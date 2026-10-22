# -*- coding: utf-8 -*-
"""A Consulta: uma carta de fora contra todos os decks (seção "A Consulta" de contexto/ARQUITETURA.md, 22/10/2026).

Responde, para uma carta que o dono viu num link e ainda não sabe se quer: ela é forte sozinha? Em quais decks entra, no
lugar de quem, e quanto ganha? Vale comprar? A conta é a mesma da Caixa e do Grimório (encaixe.ganho, pontuação v3, régua
da Caixa em motor/caixa.json); o julgamento (o cadastro pela RUBRICA, a sinergia pela régua de cada deck, o veredito e a
compra) é do Claude, no /consulta, sempre com o porquê escrito.

    python motor/consulta.py <link ou nome> --dossie <arq.json>      acha a carta (Scryfall, com cache) e grava o dossiê
    python motor/consulta.py <link ou nome> --sinergias <arq.json>   calcula o encaixe com as sinergias avaliadas e registra
    python motor/consulta.py <link ou nome> --vereditos <arq.json>   grava os vereditos e a compra na consulta do dia
    python motor/consulta.py --listar                                as consultas registradas

O link pode ser a página da carta no Scryfall (scryfall.com/card/<coleção>/<número>/...), uma busca do Scryfall que dê uma
carta só (scryfall.com/search?q=...) ou o nome em inglês. O registro fica em dados/consultas/<carta>.json, uma entrada por
dia de consulta. Nada aqui grava em deck nem no cadastro: o cadastro da carta e a ida ao radar são passos do /consulta, com
o "pode" do dono.
"""
import argparse, datetime, io, json, os, re, statistics, sys, urllib.parse

import caixa, dados, edhrec, encaixe, scryfall

PASTA = os.path.join(dados.DADOS, "consultas")
COMPRA = ("comprar", "esperar", "so-se-sobrar", "nao")
FAIXAS = ("deck", "guardar", "abaixo")   # pela régua da Caixa: ganho >= deck_ganho_min, >= guardar_ganho_min, ou menos


class ErroConsulta(Exception):
    pass


# ---------------------------------------------------------------- a carta

def ler_pedido(texto):
    """O que o dono colou: ("carta", coleção, número), ("busca", consulta) ou ("nome", nome)."""
    t = (texto or "").strip()
    if not t:
        raise ErroConsulta("diga a carta: o link do Scryfall ou o nome em inglês")
    u = urllib.parse.urlparse(t)
    if u.scheme in ("http", "https") and u.netloc.endswith("scryfall.com"):
        partes = [p for p in u.path.split("/") if p]
        if len(partes) >= 3 and partes[0] == "card":
            return ("carta", partes[1].lower(), urllib.parse.unquote(partes[2]))
        if len(partes) >= 3 and partes[0] == "cards" and u.netloc.startswith("api."):
            return ("carta", partes[1].lower(), urllib.parse.unquote(partes[2]))
        q = urllib.parse.parse_qs(u.query).get("q")
        if partes and partes[0] in ("search", "cards") and q:
            return ("busca", q[0])
        raise ErroConsulta("link do Scryfall que não é de carta nem de busca: " + t)
    if u.scheme in ("http", "https"):
        raise ErroConsulta("só links do Scryfall; para outro site, diga o nome da carta")
    return ("nome", t)


def arquivo(nome):
    """Nome de arquivo da consulta: a face da frente, sem os caracteres que o Windows recusa."""
    base = re.sub(r'[<>:"/\\|?*]+', " -", nome.split(" // ")[0]).strip(" .-")
    return re.sub(r"\s+", " ", base) + ".json"


def _no_cache(pedido):
    c = scryfall._ler()
    tipo = pedido[0]
    if tipo == "carta":
        ch = "%s/%s" % (pedido[1], pedido[2].lower())
        return c["cartas"].get(ch) or c["cartas"].get((c.get("alias") or {}).get(ch, ""))
    if tipo == "nome":
        ch = c["nomes"].get(pedido[1].lower())
        return c["cartas"].get(ch) if ch else None
    return None


def achar(texto, rede=True, atualizar=False, avisar=print):
    """O registro do Scryfall da carta (o mesmo formato do cache/scryfall.json). Com rede, consulta o Scryfall quando a carta
    não está no cache ou passou da validade; sem rede, só o cache. Uma busca que dá mais de uma carta para e lista as cartas."""
    pedido = ler_pedido(texto)
    hoje = datetime.date.today().isoformat()
    limite = (datetime.date.today() - datetime.timedelta(days=scryfall.VALIDADE)).isoformat()
    r = _no_cache(pedido)
    if r and (not rede or (not atualizar and (r.get("consultado") or "") >= limite)):
        return r
    if not rede:
        raise ErroConsulta("sem rede, e a carta não está no cache: " + texto)
    try:
        if pedido[0] == "carta":
            k = scryfall._get("https://api.scryfall.com/cards/%s/%s" % (pedido[1], urllib.parse.quote(pedido[2])))
        elif pedido[0] == "nome":
            k = scryfall._get("https://api.scryfall.com/cards/named?fuzzy=" + urllib.parse.quote(pedido[1]))
        else:
            res = scryfall._get("https://api.scryfall.com/cards/search?unique=cards&q=" + urllib.parse.quote(pedido[1]))
            ks = res.get("data") or []
            if res.get("total_cards") != 1 or len(ks) != 1:
                nomes = ", ".join(x["name"] for x in ks[:30]) + (" ..." if res.get("has_more") else "")
                raise ErroConsulta("a busca deu %s cartas; escolha uma e cole o link dela: %s" % (res.get("total_cards"), nomes))
            k = ks[0]
    except scryfall.ErroScryfall as e:
        if r:
            avisar("aviso: %s; vale o que está no cache (%s)" % (e, r.get("consultado")))
            return r
        raise ErroConsulta(str(e))
    c = scryfall._ler()
    ch = scryfall._guardar(c, k, hoje)
    scryfall._gravar(c)
    return c["cartas"][ch]


def texto_da_carta(r):
    if r.get("faces"):
        return "\n//\n".join("%s %s\n%s\n%s" % (f.get("name", ""), f.get("mana_cost", ""), f.get("type_line", ""), f.get("oracle_text", "")) for f in r["faces"])
    return r.get("oracle_text") or ""


def ficha(r, avisar=print):
    """O que a consulta mostra da carta, com o aviso de pré-lançamento e de legalidade."""
    nome = r["name"].split(" // ")[0]
    gc = None
    try:
        g = scryfall._ler().get("gc") or {}
        gc = nome in (g.get("nomes") or [])
    except Exception:
        pass
    hoje = datetime.date.today().isoformat()
    lanca = r.get("released_at") or ""
    avisos = []
    if lanca > hoje:
        avisos.append("pré-lançamento: sai em %s; o preço é de pré-venda e o EDHREC ainda não tem dado" % lanca)
    if r.get("leg") == "banned":
        avisos.append("banida no Commander")
    elif r.get("leg") not in (None, "legal", "restricted") and lanca <= hoje:
        avisos.append("não é legal no Commander (%s)" % r.get("leg"))
    return dict(nome=nome, nome_completo=r["name"], custo=r.get("mana_cost") or "", cmc=r.get("cmc") or 0, tipo=r.get("type_line") or "",
                texto=texto_da_carta(r), ci="".join(r.get("color_identity") or []), set=r.get("set"), num=r.get("num"),
                link="https://scryfall.com/card/%s/%s" % (r.get("set"), r.get("num")), usd=r.get("usd"), usd_foil=r.get("usd_foil"),
                rank=r.get("edhrec_rank"), lancamento=lanca, leg=r.get("leg"), gc=gc, terreno="Land" in (r.get("type_line") or "").split("//")[0],
                mdfc=bool(r.get("faces")) and "Land" in (r.get("type_line") or "").split("//")[-1], avisos=avisos, consultado=r.get("consultado"))


# ---------------------------------------------------------------- força sozinha

def _ks():
    return [c["k"] for c in dados.regua()["criterios"]]


def s3_da_carta(cad_e, sin=(0, 0)):
    ks = _ks()
    return [sin[0], sin[1]] + [(cad_e or {}).get("n", {}).get(k, 0) for k in ks[2:]]


def forca(nome, cad, f):
    """O valor próprio (os oito critérios da carta, sem sinergia), a posição dele no cadastro e o EDHREC."""
    e = cad.get(nome)
    todos = sorted(encaixe.valor(s3_da_carta(x)) for x in cad.values())
    if e is None:
        return dict(valor_proprio=None, mediana=statistics.median(todos) if todos else None, rank=f["rank"], gc=f["gc"])
    v = encaixe.valor(s3_da_carta(e))
    abaixo = sum(1 for x in todos if x < v)
    return dict(valor_proprio=v, mediana=statistics.median(todos), percentil=round(100.0 * abaixo / len(todos)), rank=f["rank"], gc=f["gc"])


def no_grimorio(nome, f, cad):
    """As lentes do Grimório em que a carta está, ou em que caberia (tribo no tipo, cor da identidade), com a posição dela
    pelo valor próprio contra as cartas da lente que têm cadastro."""
    try:
        with open(os.path.join(dados.DADOS, "grimorio", "grimorio.json"), encoding="utf-8") as fh:
            g = json.load(fh)
    except (OSError, ValueError):
        return []
    tipos = set(re.findall(r"[A-Za-z]+", f["tipo"].split("—")[-1])) if "—" in f["tipo"] else set()
    tribo = {"Vampire": "vampiros", "Angel": "anjos", "Goblin": "goblins", "Dragon": "dragoes", "Elf": "elfos", "Zombie": "zumbis",
             "Wolf": "lobos", "Werewolf": "lobos", "Human": "humanos", "Demon": "demonios", "Sliver": "slivers", "Turtle": "tartarugas",
             "Assassin": "assassinos", "Dalek": "daleks"}
    alvo = {tribo[t] for t in tipos if t in tribo}
    out = []
    v = encaixe.valor(s3_da_carta(cad[nome])) if nome in cad else None
    for l in g.get("lentes") or []:
        esta = nome in (l.get("cartas") or [])
        if not (esta or l["k"] in alvo or l["k"] == (f["ci"] or "C")):
            continue
        vals = sorted((encaixe.valor(s3_da_carta(cad[n])), n) for n in l.get("cartas") or [] if n in cad and n != nome)
        out.append(dict(lente=l["k"], nome=l["nome"], esta=esta, cartas=len(l.get("cartas") or []), com_nota=len(vals),
                        acima_de=sum(1 for x in vals if v is not None and x[0] < v) if v is not None else None,
                        vizinhas=[n for _, n in sorted(vals, key=lambda x: abs(x[0] - (v or 0)))[:4]] if v is not None else []))
    return out


# ---------------------------------------------------------------- os decks

def _decks():
    """Os decks v3, cada um com o que a caixa sabe dele (grupo, Desejo, precon intacto)."""
    info = caixa.info_decks()
    out = []
    for m in encaixe.decks_v3():
        i = info.get(m["pasta"]) or {}
        out.append((m, dict(desejo=bool(i.get("desejo")), precon=bool(i.get("precon")))))
    return out


def _cabe(f, m):
    return all(ch in (m.get("ident") or "") for ch in f["ci"])


def _situacao(nome, m):
    base = nome.split(" // ")[0]
    for c in m["cards"]:
        if c.get("on", c["n"]).split(" // ")[0] == base:
            return dict(onde="deck", tier=c.get("tier"), rel=c.get("rel"), sin=c["s3"][:2])
    for c in m["cands"]:
        if c.get("on", c["n"]).split(" // ")[0] == base:
            return dict(onde="radar", veredito=c.get("verdict"), tier=c.get("tier"), sin=c["s3"][:2])
    av = (m.get("avaliadas") or {}).get(base)
    if av:
        return dict(onde="avaliada", sin=av["sin"], em=av.get("em"))
    return dict(onde="nova")


def _valor(c):
    return encaixe.valor(c["s3"])


def _comparaveis(m, f, n=8):
    """As cartas do deck com o mesmo papel na curva: mesmo tipo principal (criatura ou não) e custo até 1 de distância,
    da mais fraca para a mais forte. É com elas que a carta disputa a vaga."""
    cri = "Creature" in f["tipo"].split("//")[0]
    cs = [c for c in m["cards"] if not c.get("cmd") and not c.get("land") and (c.get("t") == "cri") == cri and abs((c.get("cmc") or 0) - f["cmc"]) <= 1]
    cs.sort(key=lambda c: (_valor(c), c["n"]))
    return [dict(n=c["n"], cmc=c.get("cmc"), tier=c.get("tier"), rel=c.get("rel"), valor=_valor(c), sin=c["s3"][:2], intocavel=bool(c.get("nocut"))) for c in cs[:n]]


def _mais_fracas(m, n=5):
    cs = [c for c in m["cards"] if not c.get("cmd") and not c.get("land") and not c.get("nocut")]
    cs.sort(key=lambda c: (_valor(c), c["n"]))
    return [dict(n=c["n"], cmc=c.get("cmc"), tier=c.get("tier"), rel=c.get("rel"), valor=_valor(c)) for c in cs[:n]]


def _saturacao(m):
    ctx = encaixe.contexto(m)
    r = dados.regua()
    return {c["k"]: dict(cartas=ctx["ncrit"][i], faixa=c["faixa"], mult=ctx["mult"][i]) for i, c in enumerate(r["criterios"])}


def anterior(nome, pasta=None):
    p = os.path.join(pasta or PASTA, arquivo(nome))
    try:
        with open(p, encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError):
        return None


def dossie(texto, rede=True, atualizar=False, avisar=print, pasta=None):
    """Tudo o que o Claude precisa para avaliar a carta: a ficha, o cadastro (ou o pedido de cadastro), a força sozinha, o
    Grimório, o EDHREC, a consulta anterior e, para cada deck nas cores dela, as duas sinergias com a régua, a saturação, o piso
    do encaixe, as cartas com que ela disputa a vaga e as mais fracas do deck."""
    r = achar(texto, rede=rede, atualizar=atualizar, avisar=avisar)
    f = ficha(r, avisar)
    cad = dados.ler_cadastro()
    nome = f["nome"]
    edh = edhrec.comandantes(nome, rede=rede, avisar=avisar) if not f["lancamento"] > datetime.date.today().isoformat() else None
    decks, fora = [], []
    meus = {}
    for m, i in _decks():
        if not _cabe(f, m):
            fora.append(m["pasta"])
            continue
        cmd = [c["n"] for c in m["cards"] if c.get("cmd")]
        for c in cmd:
            meus[c] = m["pasta"]
        t = dados.ler_json(os.path.join(dados.pasta_deck(m["pasta"]), "tema.json"), obrigatorio=False) or {}
        sins = t.get("sinergias") or {}
        piso = encaixe.ganho(nome, m, cad, dict(cmc=f["cmc"], land=f["terreno"], mdfc=f["mdfc"])) if nome in cad else None
        decks.append(dict(pasta=m["pasta"], painel=m.get("painel"), comandante=m.get("curto"), ident=m.get("ident"), desejo=i["desejo"], precon=i["precon"],
                          situacao=_situacao(nome, m), sinergias={k: dict(nome=v.get("nome"), regra=v.get("regra")) for k, v in sins.items() if k in ("sin1", "sin2")},
                          saturacao={k: v for k, v in _saturacao(m).items() if k in ("sin1", "sin2")},
                          piso=dict(ganho=piso["ganho"], sai=piso["sai"], valor_sai=piso["valor_sai"]) if piso else None,
                          comparaveis=_comparaveis(m, f), mais_fracas=_mais_fracas(m)))
    for t in edh or []:
        t["meu"] = meus.get(t["n"])
    return dict(gerado=datetime.date.today().isoformat(), carta=f, cadastro=cad.get(nome),
                pedido_cadastro=None if nome in cad else dict(rubrica="contexto/pontuacao/RUBRICA.md", grava_em="dados/cartas.json", fonte="claude",
                                                             criterios=_ks()[2:], formato={"n": {"criterio": "nota de 1 a 3"}, "por_que": "frase curta, sem citar deck"}),
                forca=forca(nome, cad, f), grimorio=no_grimorio(nome, f, cad) if nome in cad else [], edhrec=edh,
                anterior=anterior(nome, pasta), decks=decks, fora_da_identidade=fora,
                responder=dict(arquivo="--sinergias", formato={"<pasta>": {"sin": {"sin1": "0 a 3", "sin2": "0 a 3"}, "sin_por_que": {"sin1": "frase, se a nota for acima de 0"}}},
                               regra="todos os decks da lista 'decks', inclusive com 0; nota pela régua do tema.json, ao pé da letra"))


# ---------------------------------------------------------------- o encaixe com as sinergias avaliadas

def _ler_sinergias(arq, nomes_decks):
    with open(arq, encoding="utf-8") as fh:
        j = json.load(fh)
    faltam = [p for p in nomes_decks if p not in j]
    sobram = [p for p in j if p not in nomes_decks and not p.startswith("_")]
    if faltam:
        raise ErroConsulta("faltam as sinergias destes decks (nas cores da carta): " + ", ".join(faltam))
    if sobram:
        raise ErroConsulta("decks fora das cores da carta, ou que não existem: " + ", ".join(sobram))
    out = {}
    for p in nomes_decks:
        x = j[p] or {}
        sin = x.get("sin") or {}
        pq = x.get("sin_por_que") or {}
        for k in ("sin1", "sin2"):
            v = sin.get(k, 0)
            if not isinstance(v, int) or not 0 <= v <= 3:
                raise ErroConsulta("%s: %s=%r; a nota vai de 0 a 3" % (p, k, v))
            if v and not str(pq.get(k) or "").strip():
                raise ErroConsulta("%s: falta o porquê de %s (toda nota acima de 0 tem uma frase)" % (p, k))
        out[p] = dict(sin=[sin.get("sin1", 0), sin.get("sin2", 0)], sin_por_que={k: pq[k] for k in ("sin1", "sin2") if sin.get(k) and pq.get(k)})
    return out


def calcular(texto, arq_sinergias, rede=False, avisar=print, pasta=None):
    """O encaixe da carta em cada deck nas cores dela, com as sinergias que o Claude avaliou (sem gravar nada nos decks), na
    ordem do ganho; e a consulta do dia gravada no registro, sem vereditos."""
    r = achar(texto, rede=rede, avisar=avisar)
    f = ficha(r, avisar)
    nome = f["nome"]
    cad = dados.ler_cadastro()
    if nome not in cad:
        raise ErroConsulta("%s ainda não tem cadastro em dados/cartas.json: avalie os oito critérios pela RUBRICA antes" % nome)
    R = caixa.regua()
    ds = [(m, i) for m, i in _decks() if _cabe(f, m)]
    sins = _ler_sinergias(arq_sinergias, [m["pasta"] for m, _ in ds])
    linhas = []
    for m, i in ds:
        s = sins[m["pasta"]]
        sit = _situacao(nome, m)
        guard = m.get("avaliadas")
        m["avaliadas"] = dict(guard or {}, **{nome: dict(sin=s["sin"])})
        try:
            g = encaixe.ganho(nome, m, cad, dict(cmc=f["cmc"], land=f["terreno"], mdfc=f["mdfc"]))
        finally:
            m["avaliadas"] = guard if guard is not None else {}
        s3 = s3_da_carta(cad[nome], s["sin"])
        perfil = caixa._perfil_deck(m)
        ganho = g["ganho"]
        faixa = "deck" if ganho >= R["deck_ganho_min"] else "guardar" if ganho >= R["guardar_ganho_min"] else "abaixo"
        nl = [c for c in m["cards"] if not c.get("cmd") and not c.get("land")]
        linhas.append(dict(pasta=m["pasta"], painel=m.get("painel"), comandante=m.get("curto"), desejo=i["desejo"], precon=i["precon"],
                           situacao=sit, sin=s["sin"], sin_por_que=s["sin_por_que"], valor=encaixe.valor(s3), valor_com_saturacao=g["valor"],
                           sai=g["sai"], valor_sai=g["valor_sai"], ganho=ganho, cobre=g["cobre"], d_cmc=g.get("d_cmc"), d_acel=g.get("d_acel"),
                           acima_de=sum(1 for c in nl if _valor(c) < encaixe.valor(s3)), magicas=len(nl),
                           tier_estimado=caixa._tier_estimado(encaixe.valor(s3), perfil["med"]), faixa=faixa))
    linhas.sort(key=lambda x: (-x["ganho"], x["pasta"]))
    reg = registrar(f, cad[nome], linhas, pasta=pasta)
    return dict(carta=f, cadastro=cad[nome], forca=forca(nome, cad, f), encaixe=linhas, regua=dict(deck=R["deck_ganho_min"], guardar=R["guardar_ganho_min"]),
                registro=reg)


# ---------------------------------------------------------------- o registro

def _ler_registro(nome, pasta=None):
    return anterior(nome, pasta) or dict(versao=1, carta=None, consultas=[])


def _gravar_registro(nome, reg, pasta=None):
    base = pasta or PASTA
    os.makedirs(base, exist_ok=True)
    p = os.path.join(base, arquivo(nome))
    tmp = p + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(json.dumps(reg, ensure_ascii=False, indent=1) + "\n")
    os.replace(tmp, p)
    return p


def registrar(f, cad_e, linhas, pasta=None, hoje=None):
    """Grava (ou refaz) a consulta do dia: preço do dia, cadastro usado e o encaixe com as sinergias; os vereditos de uma
    consulta refeita no mesmo dia se perdem, porque o encaixe mudou."""
    hoje = hoje or datetime.date.today().isoformat()
    reg = _ler_registro(f["nome"], pasta)
    reg["carta"] = {k: f[k] for k in ("nome", "custo", "tipo", "texto", "ci", "set", "num", "link", "lancamento")}
    entrada = dict(data=hoje, usd=f["usd"], usd_foil=f["usd_foil"], rank=f["rank"], avisos=f["avisos"], cadastro=cad_e,
                   encaixe=[{k: x[k] for k in ("pasta", "sin", "sin_por_que", "valor", "ganho", "sai", "faixa", "tier_estimado", "situacao")} for x in linhas])
    reg["consultas"] = [c for c in reg.get("consultas") or [] if c.get("data") != hoje] + [entrada]
    return _gravar_registro(f["nome"], reg, pasta)


def gravar_vereditos(texto, arq, rede=False, avisar=print, pasta=None, hoje=None):
    """{"resumo": "...", "compra": {"acao": comprar | esperar | so-se-sobrar | nao, "porque": "..."},
        "decks": {pasta: {"veredito": entra | avaliar | fora, "porque": "...", "sai": "<carta do deck>"}}}
    na consulta do dia. Todo veredito tem porquê; quem sai precisa estar no deck."""
    hoje = hoje or datetime.date.today().isoformat()
    f = ficha(achar(texto, rede=rede, avisar=avisar), avisar)
    reg = anterior(f["nome"], pasta)
    dia = next((c for c in (reg or {}).get("consultas") or [] if c.get("data") == hoje), None)
    if not dia:
        raise ErroConsulta("não há consulta de hoje para %s: rode --sinergias antes" % f["nome"])
    with open(arq, encoding="utf-8") as fh:
        v = json.load(fh)
    if not str(v.get("resumo") or "").strip():
        raise ErroConsulta("falta o resumo (uma frase: a carta é forte, e onde)")
    cp = v.get("compra") or {}
    if cp.get("acao") not in COMPRA or not str(cp.get("porque") or "").strip():
        raise ErroConsulta("compra: 'acao' é %s, com 'porque'" % ", ".join(COMPRA))
    por_pasta = {m["pasta"]: m for m in encaixe.decks_v3()}
    consultados = {x["pasta"] for x in dia["encaixe"]}
    for p, x in (v.get("decks") or {}).items():
        if p not in consultados:
            raise ErroConsulta("%s não está na consulta de hoje (fora das cores, ou não existe)" % p)
        if x.get("veredito") not in dados.VEREDITOS or not str(x.get("porque") or "").strip():
            raise ErroConsulta("%s: veredito é %s, com 'porque'" % (p, ", ".join(dados.VEREDITOS)))
        if x.get("sai"):
            nomes = {c["n"] for c in por_pasta[p]["cards"]} | {c.get("on", c["n"]) for c in por_pasta[p]["cards"]}
            if x["sai"] not in nomes:
                raise ErroConsulta("%s: '%s' não está no deck" % (p, x["sai"]))
    dia["vereditos"] = dict(resumo=v["resumo"].strip(), compra=dict(acao=cp["acao"], porque=cp["porque"].strip()),
                            decks={p: {k: x[k] for k in ("veredito", "porque", "sai") if x.get(k)} for p, x in (v.get("decks") or {}).items()})
    return _gravar_registro(f["nome"], reg, pasta)


def listar(pasta=None):
    base = pasta or PASTA
    out = []
    for nome in sorted(os.listdir(base)) if os.path.isdir(base) else []:
        if not nome.endswith(".json"):
            continue
        try:
            with open(os.path.join(base, nome), encoding="utf-8") as fh:
                reg = json.load(fh)
        except (OSError, ValueError):
            continue
        if not isinstance(reg, dict) or not reg.get("consultas"):
            continue
        u = reg["consultas"][-1]
        ve = u.get("vereditos") or {}
        melhor = max(u.get("encaixe") or [], key=lambda x: x["ganho"], default=None)
        out.append(dict(carta=(reg.get("carta") or {}).get("nome", nome[:-5]), data=u.get("data"), usd=u.get("usd"),
                        melhor=(melhor["pasta"], melhor["ganho"]) if melhor else None, compra=(ve.get("compra") or {}).get("acao"),
                        entram=[p for p, x in (ve.get("decks") or {}).items() if x["veredito"] in ("entra", "avaliar")]))
    return out


# ---------------------------------------------------------------- a tela

def _n(v):
    return ("%.2f" % v).rstrip("0").rstrip(".").replace(".", ",") if isinstance(v, (int, float)) else "-"


def mostrar_calculo(res):
    f, fo = res["carta"], res["forca"]
    print("%s %s · %s" % (f["nome"], f["custo"], f["tipo"]))
    for a in f["avisos"]:
        print("  aviso:", a)
    print("  preço: US$ %s%s · EDHREC #%s · Game Changer: %s" % (f["usd"] or "-", (" (foil %s)" % f["usd_foil"]) if f["usd_foil"] else "", f["rank"] or "-", "sim" if fo["gc"] else "não"))
    print("  valor próprio %s (mediana do cadastro %s; acima de %s%% das cartas)" % (_n(fo["valor_proprio"]), _n(fo["mediana"]), fo.get("percentil", "-")))
    print("  régua da Caixa: ganho >= %s é Deck; >= %s é Guardar" % (res["regua"]["deck"], res["regua"]["guardar"]))
    print()
    print("  %-22s %-7s %-6s %-6s %-30s %-6s %-5s %s" % ("deck", "sin", "valor", "ganho", "sai (valor)", "tier~", "faixa", "na fila"))
    for x in res["encaixe"]:
        marca = " (Desejo)" if x["desejo"] else " (precon intacto)" if x["precon"] else ""
        sit = {"deck": " · já no deck", "radar": " · já no radar", "avaliada": " · já avaliada"}.get(x["situacao"]["onde"], "")
        print("  %-22s %-7s %-6s %-6s %-30s %-6s %-5s acima de %d de %d%s%s" % (
            x["pasta"][:22], "%d/%d" % tuple(x["sin"]), _n(x["valor"]), ("+" if x["ganho"] > 0 else "") + _n(x["ganho"]),
            ("%s (%s)" % (x["sai"], _n(x["valor_sai"])))[:30] if x["sai"] else "-", x["tier_estimado"] or "-", x["faixa"], x["acima_de"], x["magicas"], marca, sit))
    print()
    print("registro:", res["registro"])


def main():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    ap = argparse.ArgumentParser(description="A Consulta: uma carta de fora contra todos os decks.")
    ap.add_argument("carta", nargs="?", help="link do Scryfall (carta ou busca) ou o nome em inglês")
    ap.add_argument("--dossie", metavar="ARQ", help="grava o dossiê para o Claude avaliar")
    ap.add_argument("--sinergias", metavar="ARQ", help="lê as sinergias avaliadas, calcula o encaixe e registra")
    ap.add_argument("--vereditos", metavar="ARQ", help="grava os vereditos e a compra na consulta de hoje")
    ap.add_argument("--listar", action="store_true", help="as consultas registradas")
    ap.add_argument("--sem-rede", action="store_true", help="só o cache do Scryfall e do EDHREC")
    ap.add_argument("--atualizar", action="store_true", help="consulta o Scryfall mesmo com a carta no cache")
    a = ap.parse_args()
    try:
        if a.listar:
            for x in listar():
                print("%-32s %s  US$ %-6s melhor: %-24s compra: %-12s entra/avaliar: %s" % (
                    x["carta"], x["data"], x["usd"] or "-", ("%s %+.2f" % x["melhor"]) if x["melhor"] else "-", x["compra"] or "-", ", ".join(x["entram"]) or "-"))
            return
        if not a.carta:
            ap.error("diga a carta (link do Scryfall ou nome)")
        rede = not a.sem_rede
        if a.dossie:
            d = dossie(a.carta, rede=rede, atualizar=a.atualizar)
            with open(a.dossie, "w", encoding="utf-8", newline="\n") as fh:
                json.dump(d, fh, ensure_ascii=False, indent=1)
            f = d["carta"]
            print("%s %s · %s · identidade %s" % (f["nome"], f["custo"], f["tipo"], f["ci"] or "incolor"))
            for x in f["avisos"]:
                print("  aviso:", x)
            print("  cadastro:", "sim" if d["cadastro"] else "NÃO (avalie os oito critérios pela RUBRICA antes do encaixe)")
            print("  decks nas cores: %d · fora das cores: %d" % (len(d["decks"]), len(d["fora_da_identidade"])))
            if d["anterior"]:
                print("  já consultada:", ", ".join(c["data"] for c in d["anterior"].get("consultas") or []))
            print("dossiê:", a.dossie)
        elif a.sinergias:
            mostrar_calculo(calcular(a.carta, a.sinergias, rede=rede))
        elif a.vereditos:
            print("registro:", gravar_vereditos(a.carta, a.vereditos, rede=rede))
        else:
            f = ficha(achar(a.carta, rede=rede, atualizar=a.atualizar))
            print("%s %s · %s · identidade %s · US$ %s" % (f["nome"], f["custo"], f["tipo"], f["ci"] or "incolor", f["usd"] or "-"))
            print(f["texto"])
            for x in f["avisos"]:
                print("  aviso:", x)
    except (ErroConsulta, dados.ErroDeck) as e:
        sys.exit("consulta: %s" % e)


if __name__ == "__main__":
    main()
