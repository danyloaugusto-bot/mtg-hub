# -*- coding: utf-8 -*-
"""O hub: a porta de entrada de todos os painéis.

Chamado por `python motor/build.py --hub` (e ao fim de `--todos`). Gera saidas/00. Hub.html, um HTML único com as
capas reduzidas e embutidas, e o atalho `Abrir o Hub.html` na raiz do projeto.

Três abas: Decks (os cartões, por grupo), Pastas (as pastas de cartas do dono, à espera das listas) e Dashboard
(números cruzados entre os decks). O nome de cada deck é o nome da pasta, sem o número do grupo.

O Dashboard recebe de cada deck com painel um resumo compacto: as cartas, o radar, os agrupamentos, as leituras, a
estratégia, os combos e as datas de cada fonte. As contas (placar, leituras, trocas, base de mana, valor) são feitas no
navegador, com a mesma lógica do painel, para que o simulador de trocas e o seletor de mesa respondam na hora. O build
só lê e empacota; não decide nada.
"""
import base64, csv, datetime, glob, io, json, math, os, re
from urllib.parse import quote

import dados, encaixe, tema

MOTOR = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(MOTOR)
SAIDAS = os.path.join(RAIZ, "saidas")
INVENTARIO = os.path.join(RAIZ, "contexto", "inventario.csv")
PASTA_HUB = os.path.join(MOTOR, "hub")
NOME = "00. Hub"

GRUPOS = [("01", "01. Top"), ("02", "02. Tribais"), ("03", "03. Caos"), ("04", "04. Forfun"), ("05", "05. Desejo")]
# As pastas físicas de cartas do dono. O conteúdo de cada uma entra quando chegarem as listas.
PASTAS = [("Rosa P", "#f28bb8"), ("Preta P", "#3a3540"), ("Preta", "#2a2a2e"), ("Amarela", "#f2c94c"),
          ("Laranja", "#f2994a"), ("Rosa", "#f5a3c7"), ("Azul", "#4f8fe0"), ("Vermelha", "#d9534f")]
BASICOS = {"Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes",
           "Snow-Covered Plains", "Snow-Covered Island", "Snow-Covered Swamp", "Snow-Covered Mountain", "Snow-Covered Forest"}


def placar(cards, grupos, v3=False):
    """A mesma conta do painel (app.js, stats), com a régua de motor/pontuacao.json. Sem PetCard: ele é do dono.
    Método antigo: pontos do CMC médio + aceleração + soma das notas dos agrupamentos do deck. v3: os dez critérios
    (vetor "s3" de cada carta), soma de peso × pontos da nota + aceleração (as notas de Aceleradores, não os pontos,
    sobre o CMC médio); os pontos do CMC médio só se a régua pedir."""
    R = dados.regua()
    if v3:
        ks, chave = [c["k"] for c in R["criterios"]], "s3"
        peso = [c["peso"] for c in R["criterios"]]
    else:
        ks, chave, peso = [g["k"] for g in grupos], "s", None
    pnota = R["pontos_por_nota"]
    nonland = cmc = 0
    pts = [0] * len(ks)
    notas = [0] * len(ks)
    for c in cards:
        q = c["q"]
        for i, v in enumerate(c[chave]):
            notas[i] += v * q
            pts[i] += (peso[i] * pnota[v] if v > 0 else 0) * q if v3 else v * q
        if not c.get("land"):
            nonland += q
            cmc += c["cmc"] * q
    avg = cmc / nonland if nonland else 0
    cmc_pts = dados.pontos_cmc(avg) if (not v3 or R.get("pontos_de_cmc_antigos")) else 0
    ir = next((i for i, k in enumerate(ks) if k == ("aceleradores" if v3 else "ramp")), 0)
    acc = notas[ir] / avg if avg else 0
    return cmc_pts + dados.pontos_aceleracao(acc) + sum(pts), avg


def ler_inventario():
    if not os.path.exists(INVENTARIO):
        return {}
    with open(INVENTARIO, encoding="utf-8") as f:
        return {r["pasta"]: r for r in csv.DictReader(f) if r.get("pasta")}


def capa_reduzida(base, arquivo=None, largura=640):
    from PIL import Image
    cam = os.path.join(base, arquivo) if arquivo else None
    if not cam or not os.path.exists(cam):
        cands = [c for c in glob.glob(os.path.join(base, "capa.*")) if c.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))]
        cam = cands[0] if cands else None
    if not cam:
        return None
    im = Image.open(cam).convert("RGB")
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=80, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def nome_do_deck(pasta):
    return pasta.split(". ", 1)[1] if ". " in pasta else pasta


# ---------------------------------------------------------------- resumo para o Dashboard
def preco(c):
    """O preço que o painel soma (usdOf no app.js): o foil quando a carta é foil e tem preço foil; senão, o comum."""
    u = c.get("usdf") if (c.get("foil") and c.get("usdf")) else c.get("usd")
    try:
        return round(float(u), 2) if u not in (None, "") else None
    except (TypeError, ValueError):
        return None


FLAGS = (("land", "L"), ("mdfc", "md"), ("tapped", "tp"), ("wipe", "w"), ("cmd", "cm"), ("nocut", "nc"), ("foil", "f"), ("cpd", "cp"))


# Game Changer: pelo nome oficial, contra a lista do Scryfall (is:gamechanger). O bracket estimado saiu do hub a pedido
# do dono (14/10/2026); fica só o fato da carta.


def registro(c, cache):
    """O registro do cache do Scryfall de uma carta do deck: pela impressão, depois pelo nome."""
    import scryfall
    cartas, alias, nomes = cache.get("cartas") or {}, cache.get("alias") or {}, cache.get("nomes") or {}
    s, n = c.get("iset") or c.get("set"), c.get("inum") or c.get("num")
    if s and n:
        ch = scryfall._chave(s, n)
        r = cartas.get(ch) or cartas.get(alias.get(ch, ""))
        if r:
            return r
    ch = nomes.get(str(c.get("on") or c.get("n") or "").lower())
    return cartas.get(ch) if ch else None


def frente(nome):
    return str(nome or "").split(" // ")[0].strip().lower()


def sinais(c, cache, gc):
    """Game Changer, pelo nome oficial da carta e pelo campo do Scryfall."""
    r = registro(c, cache) or {}
    if gc is not None and (r.get("game_changer") or frente(c.get("on") or c["n"]) in gc or frente(r.get("name")) in gc):
        return {"gc": 1}
    return {}


def compacta(c, sf_lancamento=None, sn=None):
    """Uma carta em chaves curtas: o que o Dashboard precisa para refazer as contas do painel."""
    x = {"i": c["id"], "n": c["n"], "q": c.get("q", 1), "c": c["cmc"], "t": c["t"], "s": c.get("s") or [], "T": c.get("tier"), "r": c.get("rel")}
    if c.get("s3"):
        x["s3"] = c["s3"]   # deck v3: as notas dos dez critérios, na ordem da régua
    if sn:
        x.update(sn)
    if c.get("on"):
        x["o"] = c["on"]
    u = preco(c)
    if u is not None:
        x["u"] = u
    elif sf_lancamento:
        x["rl"] = sf_lancamento   # sem preço: a impressão padrão do Scryfall é de coleção que ainda vai sair
    if c.get("foil") and c.get("usdf") and c.get("usd"):
        x["u0"] = round(float(c["usd"]), 2)   # o preço da versão comum, para medir o que o foil acrescenta
    for k, kk in FLAGS:
        if c.get(k):
            x[kk] = 1
    for k, kk in (("pri", "pr"), ("mk", "mk"), ("prod", "pd"), ("cost", "co"), ("pk0", "pk")):
        if c.get(k):
            x[kk] = c[k]
    if c.get("syn") is not None:
        x["y"] = c["syn"]
    if c.get("cand"):
        x["v"] = c["verdict"]
        if c.get("sai"):
            x["sa"] = c["sai"]
    return x


DATA = re.compile(r"(\d{2})/(\d{2})/(\d{4})")


def ler_historico(base):
    """A versão mais recente do painel, pela primeira entrada datada do HISTORICO.md que não seja de comunidade."""
    cam = os.path.join(base, "HISTORICO.md")
    if not os.path.exists(cam):
        return None
    with open(cam, encoding="utf-8") as f:
        for linha in f:
            m = re.match(r"^##\s+(.+?),\s*(\d{2}/\d{2}/\d{4})", linha)
            if m and not m.group(1).lower().startswith("comunidade"):
                return dict(v=m.group(1).strip(), d=m.group(2))
    return None


def ler_confronto(base):
    """O resumo do CONFRONTO.md: cada análise de fora (sigla, arquivo, IA quando o arquivo diz) e quantas afirmações
    dela o texto oficial desmentiu, mais o que nenhuma viu. Lê as seções pelo título; se o formato mudar, devolve None
    e o Dashboard só deixa o deck de fora desse quadro."""
    cam = os.path.join(base, "CONFRONTO.md")
    if not os.path.exists(cam):
        return None
    with open(cam, encoding="utf-8") as f:
        txt = f.read()
    topo = txt.split("\n## ", 1)[0]
    siglas = {}
    for m in re.finditer(r"^\|\s*([A-Z])\s*\|\s*(.+?)\s*\|", topo, re.M):
        arq = re.findall(r"`([^`]+)`", m.group(2))
        nome = arq[0] if arq else m.group(2)
        baixo = m.group(2).lower()
        ia = "Grok" if "grok" in baixo else "Claude" if "claude" in baixo else ""
        siglas[m.group(1)] = dict(s=m.group(1), a=nome, ia=ia, e=0)
    sec = re.search(r"^## [^\n]*desmente[^\n]*\n(.*?)(?=^## |\Z)", txt, re.M | re.S)
    if not siglas or not sec:
        return None
    atual = None
    for linha in sec.group(1).splitlines():
        b = re.match(r"^\*\*(.+?)\*\*", linha)
        if b:
            s = re.match(r"^(?:Em )?([A-Z])$", b.group(1).strip())
            atual = s.group(1) if s and s.group(1) in siglas else None
        elif atual and re.match(r"^\s*-\s", linha):
            siglas[atual]["e"] += 1
    nv = re.search(r"^## O que nenhuma viu[^\n]*\n(.*?)(?=^## |\Z)", txt, re.M | re.S)
    achados = len(re.findall(r"^(?:\d+\.|-)\s", nv.group(1), re.M)) if nv else 0
    return dict(an=[siglas[k] for k in sorted(siglas)], nv=achados)


def lancamentos_futuros(cartas, cache):
    """Nome -> data de lançamento, para as cartas cuja impressão no cache é de coleção que ainda não saiu (sem preço)."""
    hoje = datetime.date.today().isoformat()
    out = {}
    for c in cartas:
        nome = c.get("on", c["n"])
        ch = (cache.get("nomes") or {}).get(nome.lower())
        rl = ((cache.get("cartas") or {}).get(ch) or {}).get("released_at") if ch else None
        if rl and rl > hoje:
            out[nome] = rl
    return out


LINHA_REF = re.compile(r"^\s*(\d+)x?\s+(.+?)\s*(?:\([A-Za-z0-9]+\)\s*[\w-]*\s*)?(?:\*[A-Z]\*)?\s*$")


def ler_referencias(base, cache, gc):
    """Listas de referência de um deck sem painel: os .txt de entrada/ com cara de decklist (40 linhas ou mais no formato
    "1 Nome"). A primeira linha que começa com "# " é o título; o primeiro endereço que aparecer num comentário, a fonte.
    Para cada carta, o que o cache do Scryfall já sabe (preço, identidade, Game Changer); o que ele não tem fica sem dado,
    nunca de memória."""
    pasta = os.path.join(base, "entrada")
    if not os.path.isdir(pasta):
        return []
    out = []
    nomes, cartas = cache.get("nomes") or {}, cache.get("cartas") or {}
    for arq in sorted(glob.glob(os.path.join(pasta, "*.txt"))):
        with open(arq, encoding="utf-8") as f:
            linhas = f.read().splitlines()
        titulo, fonte, cs = "", "", {}
        for ln in linhas:
            if ln.startswith("#") or ln.startswith("//"):
                if not titulo and ln.startswith("# "):
                    titulo = ln[2:].strip()
                u = re.search(r"https?://\S+", ln)
                if u and not fonte:
                    fonte = u.group(0)
                continue
            m = LINHA_REF.match(ln)
            if m:
                cs[m.group(2)] = cs.get(m.group(2), 0) + int(m.group(1))
        if sum(cs.values()) < 40:
            continue
        lista = []
        for n, q in cs.items():
            ch = nomes.get(n.lower())
            r = cartas.get(ch) if ch else None
            x = {"n": n, "q": q}
            if r:
                x["ci"] = "".join(r.get("color_identity") or [])
                if r.get("usd"):
                    x["u"] = round(float(r["usd"]), 2)
                if r.get("game_changer") or (gc is not None and frente(n) in gc):
                    x["gc"] = 1
                if "Land" in (r.get("type_line") or ""):
                    x["L"] = 1
            else:
                x["sem"] = 1
            lista.append(x)
        out.append(dict(a=os.path.basename(arq), t=titulo or os.path.splitext(os.path.basename(arq))[0], f=fonte, cartas=lista))
    return out


def resumo_dashboard(pasta, base, m, t, cache, gc=None):
    """O pacote do Dashboard para um deck com painel."""
    cmd = next((c for c in m["cards"] if c.get("cmd")), None)
    pool = m.get("pool") or []
    edh = m.get("edh") or {}
    est = m.get("estrategia") or {}
    futuro = lancamentos_futuros(m["cands"], cache)
    cands = [compacta(c, futuro.get(c.get("on", c["n"])) if preco(c) is None else None, sinais(c, cache, gc)) for c in m["cands"]]
    for c, x in zip(m["cands"], cands):
        ci = encaixe.identidade(c.get("on", c["n"]))
        if ci is not None:
            x["ci"] = ci   # identidade de cor, para a lista de compras por cor
    # encaixe nos decks já nos critérios: [pasta, ganho, quem sai, já está no deck, sinergia avaliada], os três melhores
    v3s = encaixe.decks_v3()
    if v3s:
        cad = dados.ler_cadastro()
        for c, x in zip(m["cands"], cands):
            r = encaixe.ranking(c.get("on", c["n"]), v3s, cad, dict(cmc=c["cmc"], land=c.get("land"), mdfc=c.get("mdfc")), n=3)
            if r:
                x["en"] = [[g["deck"], g["ganho"], g["sai"], 1 if g["ja_no_deck"] else 0, 1 if g["avaliada"] else 0] for g in r]
    pv = None   # o veredito do Plano do deck (motor/plano.py); sem classificação, nada
    if m.get("v3") and m.get("plano"):
        import plano
        pv = plano.avaliar(m["cards"], [c["papel"] for c in m["plano"]["comandante"]])["veredito"]
    return dict(
        pv=pv, painel=t.get("painel") or nome_do_deck(pasta), rev=t.get("rev", 1), feito=m.get("feito", ""), scryfall=m.get("scryfall_data", ""),
        hist=ler_historico(base), conf=ler_confronto(base), ident=m["ident"],
        cmd=dict(n=cmd["n"], c=cmd["cmc"], co=cmd.get("cost", "")) if cmd else None,
        grupos=[dict(k=g["k"], n=g.get("curto") or g["nome"], ab=g["ab"], ref=g.get("ref")) for g in m["grupos"]], v3=bool(m.get("v3")),
        marcadores={k: {kk: v[kk] for kk in ("nome", "plural") if v.get(kk)} for k, v in m["marcadores"].items()},
        leituras=m["leituras"],
        cards=[compacta(c, None, sinais(c, cache, gc)) for c in m["cards"]], cands=cands,
        combos=[dict(n=x["n"], k=x["kind"], p=x["p"], t=x.get("t", "")) for x in m["combos"]],
        contra=[dict(k=c["tipo"], r=c["resultado"], p=c.get("porque", "")) for c in (est.get("contra") or [])],
        pool=[dict(n=p["n"], y=p.get("syn"), nv=1 if p.get("novo") else 0) for p in pool],
        edh=dict(f=edh.get("fonte", ""), l=edh.get("lido", ""), p=edh.get("pagina", "")) if edh else None,
    )


def em_pastas_hub():
    """{chave da carta: [{p: pasta, q: quantidade}]} das listas em dados/pastas/. Vazio até a primeira lista chegar."""
    out = {}
    for p, cs in dados.ler_pastas().items():
        for k, q in cs.items():
            out.setdefault(k, []).append(dict(p=p, q=q))
    return out


def pastas_hub():
    """As pastas físicas na aba Pastas: cor, a ficha (subnome, formato, frase, papéis), quantas cartas e cópias a lista tem, a página
    da pasta (local e publicada) e o saldo dela, que o hub mostra só ao passar o mouse (a única exceção ao "sem preço" no hub)."""
    import caixa
    fichas, listas = caixa.ler_fichas_pastas(), dados.ler_pastas()
    r = caixa.ler_resumo() or {}
    out = []
    for n, c in PASTAS:
        d = dict(n=n, c=c, f=fichas.get(n), q=len(listas.get(n) or {}), cp=sum((listas.get(n) or {}).values()))
        if d["q"]:
            d.update(href=quote(caixa.nome_pagina(n) + ".html"), pub=caixa.link_publicado(origem=n), s=(r.get("saldos") or {}).get(n))
        out.append(d)
    return out


def caixa_resumo_cambio():
    import caixa
    return (caixa.ler_resumo() or {}).get("cambio")


def resumo_caixa():
    """A Caixa no hub: cartas, cópias e quantas S e A, sem valor (o hub não mostra preço), e o link publicado."""
    import caixa
    r = caixa.ler_resumo()
    if not r or not os.path.isdir(os.path.join(caixa.pasta_caixa(), "listas")):
        return None
    r = {k: v for k, v in r.items() if k not in ("saldos", "cambio")}   # o saldo de cada lista vai só no cartão da pasta
    return dict(r, href=quote(caixa.NOME + ".html"), pub=caixa.link_publicado())


def resumo_consulta():
    """A Consulta no hub: a pílula à direita do Grimório abre a página própria (saidas/00. Consulta.html) ou o link publicado de
    dados/consultas/link.txt."""
    import consulta
    return dict(href=quote(consulta.NOME + ".html"), pub=consulta.link_publicado())


def resumo_grimorio():
    """O Grimório no hub: a pílula à direita do Dashboard abre a página própria (saidas/00. Grimório.html) ou o link publicado
    de dados/grimorio/link.txt; e as contagens da última leitura. None enquanto não houver leitura."""
    import grimorio
    if not os.path.exists(os.path.join(grimorio.PASTA, "grimorio.json")):
        return None
    lt = grimorio.ler_leitura() or {}
    ct = lt.get("contagens") or {}
    return dict(href=quote(grimorio.NOME + ".html"), pub=grimorio.link_publicado(), lido=lt.get("lido"), cartas=ct.get("cartas"), lentes=ct.get("lidas"))


def montar(avisar=print):
    import scryfall
    inv = ler_inventario()
    pastas = [n for n in dados.pastas_decks()
              if dados.eh_deck(n)]
    nomes = list(dict.fromkeys(pastas + sorted(inv)))
    decks = []
    G = scryfall.game_changers(avisar=avisar)
    gc = {frente(n) for n in G["nomes"]} if G else None
    cache = scryfall._ler()
    for pasta in nomes:
        base = dados.pasta_deck(pasta)
        r = inv.get(pasta, {})
        grupo = pasta.split(".")[0].strip() if "." in pasta else "05"
        prio = (r.get("prioridade") or "").strip()
        d = dict(pasta=pasta, grupo=grupo, nome=nome_do_deck(pasta), cmd=(r.get("comandante") or "").replace(" (confirmar)", ""),
                 cores=dados.ordem_cores(r.get("cores", "")), painel=None,
                 lista=os.path.exists(os.path.join(base, "decklist.txt")), prio=int(prio) if prio.isdigit() else None,
                 pub=(r.get("link_publicado") or "").strip() or None)
        if os.path.exists(os.path.join(base, "avaliacao.json")):
            try:
                m = dados.montar(pasta, avisar=lambda *x: None)
            except dados.ErroDeck as e:
                avisar("hub: %s ficou de fora do resumo: %s" % (pasta, e))
                m = None
            if m:
                t = dados.ler_json(os.path.join(base, "tema.json"), obrigatorio=False) or {}
                pt, avg = placar(m["cards"], m["grupos"], m.get("v3", False))
                tipos = {}
                for c in m["cards"]:
                    k = "cri" if c.get("cmd") else c["t"]
                    tipos[k] = tipos.get(k, 0) + c["q"]
                cmds = " + ".join(c["n"] for c in m["cards"] if c.get("cmd"))
                d.update(painel=t.get("painel") or d["nome"], cmd=(cmds or d["cmd"]), cores=m["ident"] or d["cores"],
                         placar=pt, cmc=round(avg, 2), tipos=tipos, href=quote(pasta + ".html"),
                         capa=capa_reduzida(base, (t.get("capa") or {}).get("arquivo")),
                         foco=(t.get("capa") or {}).get("foco", "50% 30%"), tj=t.get("tema_jogo"))
                d["a"] = resumo_dashboard(pasta, base, m, t, cache, gc)
        if d["painel"] is None:
            d["capa"] = capa_reduzida(base) if os.path.isdir(base) else None
            d["ref"] = ler_referencias(base, cache, gc) if os.path.isdir(base) else []
        decks.append(d)

    H = dict(grupos=[dict(k=k, n=n) for k, n in GRUPOS], decks=decks, basicos=sorted(BASICOS), regua=dados.regua_compacta(),
             pastas=pastas_hub(), cambio=(caixa_resumo_cambio()), em_pastas=em_pastas_hub(), gerado=datetime.date.today().strftime("%d/%m/%Y"),
             gc=dict(n=len(G["nomes"]), d=G.get("consultado", "")) if G else None, caixa=resumo_caixa(), grimorio=resumo_grimorio(), consulta=resumo_consulta())

    pal = tema.paleta({"fundo": "#0f0f10", "painel": "#1b1b1d", "acento": "#f5a524", "acento_claro": "#ffc96b", "texto": "#f2f0ec",
                       "suave": "#bdbab3", "apagado": "#8a877f", "destaque": "#f5a524", "destaque_claro": "#ffc96b"})
    css_fontes, _ = tema.fontes(["Alegreya Sans", "Cinzel"])   # Cinzel: o subnome das pastas (Relicário de Ônix)
    root = tema.raiz_css(pal, [], ["--fd:'Alegreya Sans','Segoe UI',system-ui,sans-serif", "--fb:'Alegreya Sans','Segoe UI',system-ui,sans-serif"])
    cores = "".join(".ms-%s{background:%s}" % (k, v) for k, v in
                    (("W", "#f3e7bf"), ("U", "#a9cdf0"), ("B", "#2b2228"), ("R", "#f0a28c"), ("G", "#9fd0a6")))

    def ler(n):
        with open(os.path.join(PASTA_HUB, n), encoding="utf-8") as f:
            return f.read()
    js = ler("app.js").replace("/*__DATA__*/null", json.dumps(H, ensure_ascii=False, separators=(",", ":")))
    js += chr(10) + ler(os.path.join("..", "comum", "ordenar.js"))   # ordenar tabela pelo cabeçalho (o mesmo do painel)
    html = (ler("template.html").replace("/*__FONTS__*/", css_fontes).replace("/*__ROOT__*/", root + cores)
            .replace("/*__CSS__*/", ler("style.css")).replace("/*__JS__*/", js.replace("</script", "<\\/script")))
    return html, H


def atalho():
    alvo = "saidas/" + quote(NOME + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Hub dos decks</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir o hub dos decks</a></p>\n</body>\n</html>\n') % (alvo, alvo)
