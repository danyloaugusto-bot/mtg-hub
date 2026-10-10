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

import dados, tema

MOTOR = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(MOTOR)
SAIDAS = os.path.join(RAIZ, "saidas")
INVENTARIO = os.path.join(RAIZ, "contexto", "inventario.csv")
PASTA_HUB = os.path.join(MOTOR, "hub")
NOME = "00. Hub"

GRUPOS = [("01", "01. Top"), ("02", "02. Tribais"), ("03", "03. Caos"), ("04", "04. Forfun"), ("05", "Compras + Precon")]
# As pastas físicas de cartas do dono. O conteúdo de cada uma entra quando chegarem as listas.
PASTAS = [("Rosa (sell)", "#f28bb8"), ("Preta (esp)", "#3a3540"), ("Preta", "#2a2a2e"), ("Amarela", "#f2c94c"),
          ("Laranja", "#f2994a"), ("Rosa", "#f5a3c7"), ("Azul", "#4f8fe0"), ("Vermelha", "#d9534f")]
BASICOS = {"Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes",
           "Snow-Covered Plains", "Snow-Covered Island", "Snow-Covered Swamp", "Snow-Covered Mountain", "Snow-Covered Forest"}


def placar(cards, grupos):
    """A mesma conta do painel (app.js, stats): CMC médio, aceleração e soma das notas. Sem PetCard: ele é do dono."""
    nonland = cmc = 0
    pts = [0] * len(grupos)
    for c in cards:
        q = c["q"]
        for i, v in enumerate(c["s"]):
            pts[i] += v * q
        if not c.get("land"):
            nonland += q
            cmc += c["cmc"] * q
    avg = cmc / nonland if nonland else 0
    cmc_pts = 0 if avg == 0 else 5 if avg < 2 else 4 if avg < 3 else 3 if avg < 4 else 2 if avg < 5 else 1
    ir = next((i for i, g in enumerate(grupos) if g["k"] == "ramp"), 0)
    acc = pts[ir] / avg if avg else 0
    acc_pts = 0 if acc < 0 else min(90, 5 * (math.floor(acc * 2) + 1))
    return cmc_pts + acc_pts + sum(pts), avg


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


FLAGS = (("land", "L"), ("mdfc", "md"), ("tapped", "tp"), ("wipe", "w"), ("cmd", "cm"), ("nocut", "nc"), ("foil", "f"))


def compacta(c, sf_lancamento=None):
    """Uma carta em chaves curtas: o que o Dashboard precisa para refazer as contas do painel."""
    x = {"i": c["id"], "n": c["n"], "q": c.get("q", 1), "c": c["cmc"], "t": c["t"], "s": c.get("s") or [], "T": c.get("tier"), "r": c.get("rel")}
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
    for k, kk in (("pri", "pr"), ("mk", "mk"), ("prod", "pd"), ("cost", "co")):
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


def resumo_dashboard(pasta, base, m, t, cache):
    """O pacote do Dashboard para um deck com painel."""
    cmd = next((c for c in m["cards"] if c.get("cmd")), None)
    pool = m.get("pool") or []
    edh = m.get("edh") or {}
    est = m.get("estrategia") or {}
    futuro = lancamentos_futuros(m["cands"], cache)
    cands = [compacta(c, futuro.get(c.get("on", c["n"])) if preco(c) is None else None) for c in m["cands"]]
    return dict(
        painel=t.get("painel") or nome_do_deck(pasta), rev=t.get("rev", 1), feito=m.get("feito", ""), scryfall=m.get("scryfall_data", ""),
        hist=ler_historico(base), conf=ler_confronto(base), ident=m["ident"],
        cmd=dict(n=cmd["n"], c=cmd["cmc"], co=cmd.get("cost", "")) if cmd else None,
        grupos=[dict(k=g["k"], n=g.get("curto") or g["nome"], ab=g["ab"], ref=g.get("ref")) for g in m["grupos"]],
        marcadores={k: {kk: v[kk] for kk in ("nome", "plural") if v.get(kk)} for k, v in m["marcadores"].items()},
        leituras=m["leituras"],
        cards=[compacta(c) for c in m["cards"]], cands=cands,
        combos=[dict(n=x["n"], k=x["kind"], p=x["p"], t=x.get("t", "")) for x in m["combos"]],
        contra=[dict(k=c["tipo"], r=c["resultado"], p=c.get("porque", "")) for c in (est.get("contra") or [])],
        pool=[dict(n=p["n"], y=p.get("syn"), nv=1 if p.get("novo") else 0) for p in pool],
        edh=dict(f=edh.get("fonte", ""), l=edh.get("lido", ""), p=edh.get("pagina", "")) if edh else None,
    )


def montar(avisar=print):
    import scryfall
    inv = ler_inventario()
    pastas = [n for n in sorted(os.listdir(dados.DADOS))
              if dados.eh_deck(n)]
    nomes = list(dict.fromkeys(pastas + sorted(inv)))
    decks = []
    cache = scryfall._ler()
    for pasta in nomes:
        base = os.path.join(dados.DADOS, pasta)
        r = inv.get(pasta, {})
        grupo = pasta.split(".")[0].strip() if "." in pasta else "05"
        prio = (r.get("prioridade") or "").strip()
        d = dict(pasta=pasta, grupo=grupo, nome=nome_do_deck(pasta), cmd=(r.get("comandante") or "").replace(" (confirmar)", ""),
                 cores=dados.ordem_cores(r.get("cores", "")), painel=None,
                 lista=os.path.exists(os.path.join(base, "decklist.txt")), prio=int(prio) if prio.isdigit() else None)
        if os.path.exists(os.path.join(base, "avaliacao.json")):
            try:
                m = dados.montar(pasta, avisar=lambda *x: None)
            except dados.ErroDeck as e:
                avisar("hub: %s ficou de fora do resumo: %s" % (pasta, e))
                m = None
            if m:
                t = dados.ler_json(os.path.join(base, "tema.json"), obrigatorio=False) or {}
                pt, avg = placar(m["cards"], m["grupos"])
                cmd = next((c for c in m["cards"] if c.get("cmd")), None)
                tipos = {}
                for c in m["cards"]:
                    k = "cri" if c.get("cmd") else c["t"]
                    tipos[k] = tipos.get(k, 0) + c["q"]
                d.update(painel=t.get("painel") or d["nome"], cmd=(cmd["n"] if cmd else d["cmd"]), cores=m["ident"] or d["cores"],
                         placar=pt, cmc=round(avg, 2), tipos=tipos, href=quote(pasta + ".html"),
                         capa=capa_reduzida(base, (t.get("capa") or {}).get("arquivo")),
                         foco=(t.get("capa") or {}).get("foco", "50% 30%"))
                d["a"] = resumo_dashboard(pasta, base, m, t, cache)
        if d["painel"] is None:
            d["capa"] = capa_reduzida(base) if os.path.isdir(base) else None
        decks.append(d)

    H = dict(grupos=[dict(k=k, n=n) for k, n in GRUPOS], decks=decks, basicos=sorted(BASICOS),
             pastas=[dict(n=n, c=c) for n, c in PASTAS], gerado=datetime.date.today().strftime("%d/%m/%Y"))

    pal = tema.paleta({"fundo": "#0f0f10", "painel": "#1b1b1d", "acento": "#f5a524", "acento_claro": "#ffc96b", "texto": "#f2f0ec",
                       "suave": "#bdbab3", "apagado": "#8a877f", "destaque": "#f5a524", "destaque_claro": "#ffc96b"})
    css_fontes, _ = tema.fontes(["Alegreya Sans"])
    root = tema.raiz_css(pal, [], ["--fd:'Alegreya Sans','Segoe UI',system-ui,sans-serif", "--fb:'Alegreya Sans','Segoe UI',system-ui,sans-serif"])
    cores = "".join(".ms-%s{background:%s}" % (k, v) for k, v in
                    (("W", "#f3e7bf"), ("U", "#a9cdf0"), ("B", "#2b2228"), ("R", "#f0a28c"), ("G", "#9fd0a6")))

    def ler(n):
        with open(os.path.join(PASTA_HUB, n), encoding="utf-8") as f:
            return f.read()
    js = ler("app.js").replace("/*__DATA__*/null", json.dumps(H, ensure_ascii=False, separators=(",", ":")))
    html = (ler("template.html").replace("/*__FONTS__*/", css_fontes).replace("/*__ROOT__*/", root + cores)
            .replace("/*__CSS__*/", ler("style.css")).replace("/*__JS__*/", js.replace("</script", "<\\/script")))
    return html, H


def atalho():
    alvo = "saidas/" + quote(NOME + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Hub dos decks</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir o hub dos decks</a></p>\n</body>\n</html>\n') % (alvo, alvo)
