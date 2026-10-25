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
MOTOR = os.path.dirname(os.path.abspath(__file__))
REGUA_ARQ = os.path.join(MOTOR, "consulta.json")
NOME = "00. Consulta"
COMPRA = ("comprar", "esperar", "so-se-sobrar", "nao")
GRAUS = ("S", "A", "B", "C", "D")
_REGUA = None
FAIXAS = ("deck", "guardar", "abaixo")   # pela régua da Caixa: ganho >= deck_ganho_min, >= guardar_ganho_min, ou menos


class ErroConsulta(Exception):
    pass


def regua():
    """motor/consulta.json: a régua do vácuo (cada limite aponta para uma chave de motor/caixa.json ou para a mediana), as
    frases do estudo e a imagem da página."""
    global _REGUA
    if _REGUA is None:
        with open(REGUA_ARQ, encoding="utf-8") as fh:
            r = json.load(fh)
        rc = caixa.regua()
        graus = [x.get("grau") for x in r.get("vacuo") or []]
        if graus != list(GRAUS):
            raise ErroConsulta("motor/consulta.json: o vácuo precisa dos graus S, A, B, C e D, nessa ordem")
        for x in r["vacuo"]:
            for k in ("valor_min", "rank_max"):
                if x.get(k) and x[k] != "mediana" and x[k] not in rc:
                    raise ErroConsulta("motor/consulta.json: %s aponta para '%s', que não está em motor/caixa.json" % (k, x[k]))
        _REGUA = r
    return _REGUA


def limites_vacuo(mediana):
    """Os limites do vácuo em números: [{grau, gc, valor_min, rank_max}], na ordem."""
    rc = caixa.regua()
    num = lambda k: (mediana if k == "mediana" else rc[k]) if k else None
    return [dict(grau=x["grau"], gc=bool(x.get("game_changer")), valor_min=num(x.get("valor_min")), rank_max=num(x.get("rank_max"))) for x in regua()["vacuo"]]


def grau_vacuo(valor, mediana, gc=False, rank=None):
    """O grau da carta sozinha pela régua do vácuo: o primeiro que bate. rank é o do EDHREC (None antes do lançamento)."""
    if valor is None:
        return None
    for x in limites_vacuo(mediana):
        if (x["gc"] and gc) or (x["rank_max"] is not None and rank and rank <= x["rank_max"]) or (x["valor_min"] is not None and valor >= x["valor_min"]):
            return x["grau"]
        if x["valor_min"] is None and x["rank_max"] is None and not x["gc"]:
            return x["grau"]
    return GRAUS[-1]


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
                mdfc=bool(r.get("faces")) and "Land" in (r.get("type_line") or "").split("//")[-1], avisos=avisos, consultado=r.get("consultado"),
                pt=("%s/%s" % (r.get("power"), r.get("toughness"))) if r.get("power") is not None else None, artista=r.get("artist"), sid=r.get("id"),
                faces=[dict(nome=x.get("name"), custo=x.get("mana_cost") or "", tipo=x.get("type_line") or "", texto=x.get("oracle_text") or "") for x in r.get("faces") or []] or None)


# ---------------------------------------------------------------- força sozinha

def _ks():
    return [c["k"] for c in dados.regua()["criterios"]]


def s3_da_carta(cad_e, sin=(0, 0)):
    ks = _ks()
    return [sin[0], sin[1]] + [(cad_e or {}).get("n", {}).get(k, 0) for k in ks[2:]]


def _rank_valido(f):
    """O rank do EDHREC só vale depois do lançamento (antes, o Scryfall traz um número sem dado por trás)."""
    return f["rank"] if f.get("lancamento") and f["lancamento"] <= datetime.date.today().isoformat() else None


def valores_cadastro(cad, sem=None):
    return sorted(encaixe.valor(s3_da_carta(x)) for k, x in cad.items() if k != sem)


def forca(nome, cad, f, e=None):
    """O valor próprio (os oito critérios da carta, sem sinergia), a posição dele no cadastro, o EDHREC e o grau no vácuo.
    e: as notas da carta quando ela não está no cadastro (as da própria consulta); o cadastro nunca recebe a carta."""
    e = e or cad.get(nome)
    todos = valores_cadastro(cad, nome)
    med = statistics.median(todos) if todos else None
    rank = _rank_valido(f)
    if e is None:
        return dict(valor_proprio=None, mediana=med, rank=rank, gc=f["gc"], grau=None)
    v = encaixe.valor(s3_da_carta(e))
    abaixo = sum(1 for x in todos if x < v)
    return dict(valor_proprio=v, mediana=med, percentil=round(100.0 * abaixo / len(todos)) if todos else None, rank=rank, gc=f["gc"],
                grau=grau_vacuo(v, med, f["gc"], rank))


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
    if rede and f.get("sid"):
        import imagens
        try:
            imagens.baixar_faltantes({"%s-%s.jpg" % (f["set"].lower(), str(f["num"]).lower()): (f["sid"], "front")}, avisar=lambda *a: None)
        except dados.ErroDeck as e:
            avisar("aviso: imagem da carta não baixada (%s); a página mostra só o texto" % e)
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
                pedido_cadastro=None if nome in cad else dict(rubrica="contexto/pontuacao/RUBRICA.md",
                                                             grava_em="_cadastro, no JSON do --sinergias: fica no registro da consulta; dados/cartas.json não muda",
                                                             criterios=_ks()[2:], formato={"n": {"criterio": "nota de 1 a 3"}, "por_que": "frase curta, sem citar deck"}),
                forca=forca(nome, cad, f), vacuo=dict(limites=limites_vacuo(forca(nome, cad, f)["mediana"]), nota="o grau sai da régua; o Claude escreve só o porquê"),
                grimorio=no_grimorio(nome, f, cad) if nome in cad else [], edhrec=edh,
                anterior=anterior(nome, pasta), decks=decks, fora_da_identidade=fora,
                responder=dict(arquivo="--sinergias", formato={"<pasta>": {"sin": {"sin1": "0 a 3", "sin2": "0 a 3"}, "sin_por_que": {"sin1": "frase, se a nota for acima de 0"}}},
                               regra="todos os decks da lista 'decks', inclusive com 0; nota pela régua do tema.json, ao pé da letra"))


# ---------------------------------------------------------------- o encaixe com as sinergias avaliadas

def _ler_cadastro_da_consulta(j, nome, cad):
    """As oito notas da carta: as do cadastro, se ela já tem; senão as de "_cadastro" no JSON das sinergias, conferidas como
    o cadastro confere (critério da carta, nota de 1 a 3, porquê). Ficam só no registro da consulta (decisão do dono, 22/10/2026)."""
    if nome in cad:
        return cad[nome], "cadastro"
    e = j.get("_cadastro")
    if not isinstance(e, dict) or not isinstance(e.get("n"), dict):
        raise ErroConsulta('%s não tem cadastro: diga as notas em "_cadastro": {"n": {critério: nota}, "por_que": "..."}, pela RUBRICA' % nome)
    ks = _ks()[2:]
    for k, v in e["n"].items():
        if k not in ks:
            raise ErroConsulta("_cadastro: '%s' não é critério da carta (%s)" % (k, ", ".join(ks)))
        if not isinstance(v, int) or not 1 <= v <= 3:
            raise ErroConsulta("_cadastro: %s=%r; a nota vai de 1 a 3 (0 é não escrever)" % (k, v))
    if not str(e.get("por_que") or "").strip():
        raise ErroConsulta("_cadastro: falta o por_que (uma frase curta, sem citar deck)")
    return dict(n=dict(e["n"]), por_que=e["por_que"].strip(), fonte="consulta", revisado=datetime.date.today().isoformat()), "consulta"


def _ler_sinergias(arq, nomes_decks):
    with open(arq, encoding="utf-8") as fh:
        j = json.load(fh)
    if j.get("_zero_nos_outros"):
        j = dict(j, **{p: {"sin": {"sin1": 0, "sin2": 0}} for p in nomes_decks if p not in j})
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
    cad0 = dados.ler_cadastro()
    with open(arq_sinergias, encoding="utf-8") as fh:
        e, origem = _ler_cadastro_da_consulta(json.load(fh), nome, cad0)
    cad = dict(cad0, **{nome: e})   # só nesta conta: o cadastro em disco não muda
    if encaixe.identidade(nome) is None:
        encaixe._CI = None   # a carta acabou de entrar no cache do Scryfall
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
    fo = forca(nome, cad0, f, e)
    reg = registrar(f, e, linhas, pasta=pasta, forca_=fo)
    return dict(carta=f, cadastro=e, origem_cadastro=origem, forca=fo, encaixe=linhas, regua=dict(deck=R["deck_ganho_min"], guardar=R["guardar_ganho_min"]),
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


def registrar(f, cad_e, linhas, pasta=None, hoje=None, forca_=None):
    """Grava (ou refaz) a consulta do dia: preço do dia, as notas usadas, a força sozinha com o grau e o encaixe com as
    sinergias; os vereditos e o estudo de uma consulta refeita no mesmo dia se perdem, porque o encaixe mudou."""
    hoje = hoje or datetime.date.today().isoformat()
    reg = _ler_registro(f["nome"], pasta)
    reg["carta"] = {k: f.get(k) for k in ("nome", "custo", "tipo", "texto", "ci", "set", "num", "link", "lancamento", "pt", "artista", "sid", "cmc", "gc", "faces")}
    fo = forca_ or {}
    entrada = dict(data=hoje, usd=f["usd"], usd_foil=f["usd_foil"], rank=f["rank"], avisos=f["avisos"], cadastro=cad_e,
                   forca={k: fo.get(k) for k in ("valor_proprio", "mediana", "percentil", "rank", "gc", "grau")} if fo else None,
                   encaixe=[{k: x.get(k) for k in ("pasta", "sin", "sin_por_que", "valor", "valor_com_saturacao", "ganho", "sai", "valor_sai", "faixa", "tier_estimado",
                                                  "situacao", "cobre", "d_cmc", "d_acel", "acima_de", "magicas")} for x in linhas])
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
    estudo = _ler_estudo(v.get("estudo"), dia, set(por_pasta))
    for p, x in (v.get("decks") or {}).items():
        if p not in consultados:
            raise ErroConsulta("%s não está na consulta de hoje (fora das cores, ou não existe)" % p)
        if x.get("veredito") not in dados.VEREDITOS or not str(x.get("porque") or "").strip():
            raise ErroConsulta("%s: veredito é %s, com 'porque'" % (p, ", ".join(dados.VEREDITOS)))
        if x["veredito"] in ("entra", "avaliar") and not x.get("sai"):
            raise ErroConsulta("%s: veredito %s pede quem sai na prática ('sai', uma carta do deck)" % (p, x["veredito"]))
        if x.get("sai"):
            nomes = {c["n"] for c in por_pasta[p]["cards"]} | {c.get("on", c["n"]) for c in por_pasta[p]["cards"]}
            if x["sai"] not in nomes:
                raise ErroConsulta("%s: '%s' não está no deck" % (p, x["sai"]))
    dia["vereditos"] = dict(resumo=v["resumo"].strip(), compra=dict(acao=cp["acao"], porque=cp["porque"].strip()),
                            decks={p: {k: x[k] for k in ("veredito", "porque", "sai") if x.get(k)} for p, x in (v.get("decks") or {}).items()})
    dia["estudo"] = estudo
    dia["gravado"] = datetime.datetime.now().isoformat(timespec="seconds")   # a página abre na consulta mais recente
    return _gravar_registro(f["nome"], reg, pasta)


def _ler_estudo(e, dia, pastas):
    """{"leitura": "...", "forcas": [...], "fraquezas": [...], "vacuo": {"grau", "porque"}, "armadilhas": {pasta: "..."}}.
    O grau tem de ser o da régua (o script calculou no --sinergias); fortalezas e fraquezas, de três a cinco frases cada."""
    if not isinstance(e, dict):
        raise ErroConsulta("falta o estudo: leitura, forcas, fraquezas, vacuo e armadilhas")
    fr = regua()["frases"]
    if not str(e.get("leitura") or "").strip():
        raise ErroConsulta("estudo: falta a leitura (o que a carta faz de verdade, e o que não faz)")
    for k, nome in (("forcas", "fortalezas"), ("fraquezas", "fraquezas")):
        L = e.get(k)
        if not isinstance(L, list) or not fr["min"] <= len(L) <= fr["max"] or not all(str(x or "").strip() for x in L):
            raise ErroConsulta("estudo: %s são de %d a %d frases, nenhuma vazia" % (nome, fr["min"], fr["max"]))
    va = e.get("vacuo") or {}
    grau = (dia.get("forca") or {}).get("grau")
    if va.get("grau") is not None and va.get("grau") != grau:
        raise ErroConsulta("estudo: o grau no vácuo é %s pela régua (motor/consulta.json), não %r" % (grau, va.get("grau")))
    if not str(va.get("porque") or "").strip():
        raise ErroConsulta("estudo: falta o porquê do grau no vácuo")
    arm = e.get("armadilhas") or {}
    if not isinstance(arm, dict):
        raise ErroConsulta("estudo: armadilhas é {pasta: frase}")
    for p, t in arm.items():
        if p not in pastas:
            raise ErroConsulta("estudo: armadilha num deck que não existe: %s" % p)
        if not str(t or "").strip():
            raise ErroConsulta("estudo: armadilha sem frase em %s" % p)
    return dict(leitura=e["leitura"].strip(), forcas=[x.strip() for x in e["forcas"]], fraquezas=[x.strip() for x in e["fraquezas"]],
                vacuo=dict(grau=grau, porque=va["porque"].strip()), armadilhas={p: t.strip() for p, t in arm.items()})


def importar_banco(arq, pasta=None, hoje=None):
    """Traz as consultas feitas ao vivo na página publicada (coleção "consultas" do banco do artefato, lida pelo /consulta com a
    ferramenta de banco e gravada num JSON: uma lista de documentos, {"docs": [...]} ou {id: documento}) para dados/consultas/,
    como entrada **a revisar** (modo "ao-vivo", revisar: true): o Claude do Code confere as notas antes de dar como registrada.
    As notas da carta (cadastro_auto) ficam só no registro; dados/cartas.json nunca muda por aqui. Devolve os nomes importados."""
    with open(arq, encoding="utf-8") as fh:
        j = json.load(fh)
    docs = j.get("docs") if isinstance(j, dict) and isinstance(j.get("docs"), list) else (list(j.values()) if isinstance(j, dict) else j)
    if not isinstance(docs, list):
        raise ErroConsulta("o arquivo do banco é uma lista de documentos da coleção consultas")
    pastas = {m["pasta"] for m in encaixe.decks_v3()}
    feitos = []
    for d in docs:
        d = (d or {}).get("data", d) if isinstance(d, dict) and "data" in d and isinstance(d.get("data"), dict) else d
        if not isinstance(d, dict) or d.get("modo") != "ao-vivo":
            continue
        c, e = d.get("carta") or {}, d.get("entrada") or {}
        nome = c.get("nome") or d.get("nome")
        if not nome or not isinstance(e.get("encaixe"), list) or not isinstance(e.get("estudo"), dict) or not isinstance(e.get("vereditos"), dict):
            raise ErroConsulta("documento sem carta, encaixe, estudo ou vereditos: %s" % (nome or d.get("id") or "?"))
        fora = [x.get("pasta") for x in e["encaixe"] if x.get("pasta") not in pastas]
        if fora:
            raise ErroConsulta("%s: decks que não existem no encaixe: %s" % (nome, ", ".join(map(str, fora))))
        if e.get("forca", {}).get("grau") not in GRAUS:
            raise ErroConsulta("%s: sem o grau no vácuo" % nome)
        reg = _ler_registro(nome, pasta)
        if not reg.get("carta"):
            reg["carta"] = {k: c.get(k) for k in ("nome", "custo", "tipo", "texto", "ci", "set", "num", "link", "lancamento", "pt", "artista", "cmc", "gc", "faces")}
        entrada = dict(e, modo="ao-vivo", revisar=True, importado=hoje or datetime.date.today().isoformat(), cadastro_auto=bool(d.get("cadastro_auto")))
        reg["consultas"] = [x for x in reg.get("consultas") or [] if not (x.get("data") == entrada.get("data") and x.get("modo") == "ao-vivo")] + [entrada]
        reg["consultas"].sort(key=lambda x: x.get("data") or "")
        _gravar_registro(nome, reg, pasta)
        feitos.append(nome)
    return feitos


def confirmar(texto_nome, pasta=None, hoje=None):
    """Depois do "pode" do dono no /consulta importar: a consulta ao vivo mais recente da carta deixa de estar a revisar
    (revisar: false, revisado: hoje). As notas continuam só no registro; dados/cartas.json não muda."""
    nome = texto_nome.strip()
    reg = anterior(nome, pasta)
    if not reg:
        raise ErroConsulta("não há registro de %s em dados/consultas/" % nome)
    vivos = [x for x in reg.get("consultas") or [] if x.get("modo") == "ao-vivo" and x.get("revisar")]
    if not vivos:
        raise ErroConsulta("%s não tem consulta ao vivo a revisar" % nome)
    vivos[-1]["revisar"] = False
    vivos[-1]["revisado"] = hoje or datetime.date.today().isoformat()
    return _gravar_registro(nome, reg, pasta)


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
        out.append(dict(carta=(reg.get("carta") or {}).get("nome", nome[:-5]), data=u.get("data"), usd=u.get("usd"), grau=(u.get("forca") or {}).get("grau"),
                        estudo=bool(u.get("estudo")), revisar=bool(u.get("revisar")),
                        melhor=(melhor["pasta"], melhor["ganho"]) if melhor else None, compra=(ve.get("compra") or {}).get("acao"),
                        entram=[p for p, x in (ve.get("decks") or {}).items() if x["veredito"] in ("entra", "avaliar")]))
    return out



# ---------------------------------------------------------------- a página (saidas/00. Consulta.html)

def link_publicado():
    try:
        with open(os.path.join(PASTA, "link.txt"), encoding="utf-8") as fh:
            return fh.read().strip() or None
    except OSError:
        return None


def ler_registros(pasta=None):
    """Os registros de dados/consultas/ com estudo na última consulta (só esses aparecem na página), da mais nova para a mais velha."""
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
        if isinstance(reg, dict) and reg.get("carta") and reg.get("consultas") and reg["consultas"][-1].get("estudo"):
            u = reg["consultas"][-1]
            # a ordem: a mais recente primeiro (data, depois a hora em que o estudo foi gravado; sem a hora, a do arquivo)
            hora = u.get("gravado") or datetime.datetime.fromtimestamp(os.path.getmtime(os.path.join(base, nome))).isoformat(timespec="seconds")
            out.append((u.get("data") or "", hora, reg))
    out.sort(key=lambda x: (x[0], x[1]), reverse=True)
    out = [x[2] for x in out]
    return out


def _jpeg(arquivo, largura, qualidade):
    import base64, imagens
    b = imagens.miniatura(arquivo, largura, qualidade)
    return "data:image/jpeg;base64," + base64.b64encode(b).decode() if b else None


def _deck_para_pagina(m, i, capa):
    """O que a página precisa de um deck: nome, sinergias com a régua, a conta do encaixe (saturação, quem sai por lado, base
    da aceleração), as notas das cartas que ele já tem (deck e radar), as cartas para as comparáveis e o valor mediano de cada
    tier. É o mesmo que o encaixe.py usa: a conta em JavaScript da página tem de dar o mesmo número."""
    ctx = encaixe.contexto(m)
    t = dados.ler_json(os.path.join(dados.pasta_deck(m["pasta"]), "tema.json"), obrigatorio=False) or {}
    sins = t.get("sinergias") or {}
    def sai(c):
        return dict(n=c["n"], v=encaixe.valor(c["s3"]), cmc=c["cmc"], land=1 if c.get("land") else 0, acel=c["s3"][ctx["ia"]]) if c else None
    cs = [[c["n"], c.get("cmc") or 0, 1 if c.get("t") == "cri" else 0, encaixe.valor(c["s3"]), c.get("tier") or "", 1 if c.get("nocut") else 0]
          for c in m["cards"] if not c.get("cmd") and not c.get("land")]
    return dict(pasta=m["pasta"], grupo=m["pasta"][:2], painel=m.get("painel"), cmd=m.get("curto"), ident=m.get("ident") or "",
                desejo=1 if i.get("desejo") else 0, precon=1 if i.get("precon") else 0, capa=capa,
                sn=[(sins.get(k) or {}).get("nome") or ("Sinergia %d" % (j + 1)) for j, k in enumerate(("sin1", "sin2"))],
                regra={k: (sins.get(k) or {}).get("regra") for k in ("sin1", "sin2")},
                ctx=dict(mult=ctx["mult"], ncrit=ctx["ncrit"], ace=ctx["ace"], cmc=ctx["cmc"], nl=ctx["nl"], ia=ctx["ia"],
                         sai={k: sai(v) for k, v in ctx["sai"].items()}),
                ja={n: list(c["s3"]) for n, c in ctx["nomes"].items()}, no_deck=sorted(ctx["no_deck"]),
                cartas=cs, med={k: round(v, 3) for k, v in caixa._perfil_deck(m)["med"].items()})


def montar(pasta=None, avisar=print):
    """Os dados da página: as consultas registradas (com o estudo), os decks, a régua e a RUBRICA (para o modo ao vivo)."""
    R = regua()
    rc = caixa.regua()
    cad = dados.ler_cadastro()
    vals = valores_cadastro(cad)
    med = statistics.median(vals) if vals else 0
    quantis = [vals[min(len(vals) - 1, round(q * (len(vals) - 1) / 100))] for q in range(101)] if vals else []
    info = caixa.info_decks()
    import hub
    decks = {}
    for m in encaixe.decks_v3():
        capa = hub.capa_reduzida(dados.pasta_deck(m["pasta"]), largura=R["capa_largura"])
        decks[m["pasta"]] = _deck_para_pagina(m, info.get(m["pasta"]) or {}, capa)
    regs = []
    for reg in ler_registros(pasta):
        c = dict(reg["carta"])
        c["img"] = _jpeg("%s-%s.jpg" % (str(c.get("set") or "").lower(), str(c.get("num") or "").lower()), R["imagem_largura"], R["imagem_qualidade"])
        if not c["img"]:
            avisar("aviso: %s sem imagem no cache (cache/img/); a página mostra só o texto" % c["nome"])
        u = reg["consultas"][-1]
        regs.append(dict(carta=c, datas=[x["data"] for x in reg["consultas"]], **{k: u.get(k) for k in ("data", "usd", "usd_foil", "avisos", "cadastro", "forca", "encaixe", "vereditos", "estudo")}))
    rp = dados.regua()
    try:
        with open(os.path.join(os.path.dirname(MOTOR), "contexto", "pontuacao", "RUBRICA.md"), encoding="utf-8") as fh:
            rubrica = fh.read()
    except OSError:
        rubrica = None
    from urllib.parse import quote
    tem_g = os.path.exists(os.path.join(dados.DADOS, "grimorio", "grimorio.json"))
    import grimorio
    return dict(gerado=datetime.date.today().isoformat(), registros=regs, decks=decks, grupos=dict(hub.GRUPOS),
                regua=dict(deck=rc["deck_ganho_min"], guardar=rc["guardar_ganho_min"], vacuo=limites_vacuo(med), frases=R["frases"],
                           criterios=[{k: c[k] for k in ("k", "nome", "curto", "peso", "faixa") if k in c} for c in rp["criterios"]],
                           pontos=rp["pontos_por_nota"], aceleracao={k: rp["aceleracao"][k] for k in ("passo", "pontos_por_passo", "piso", "teto")},
                           veredictos=list(dados.VEREDITOS), compra=list(COMPRA)),
                cadastro=dict(mediana=med, quantis=quantis, n=len(vals)), rubrica=rubrica,
                # as oito notas de cada carta do cadastro, na ordem da régua (0 = sem nota), para o modo ao vivo não pedir o que já existe
                cad={n: [e.get("n", {}).get(k, 0) for k in [c["k"] for c in rp["criterios"]][2:]] for n, e in sorted(cad.items())},
                nav=dict(hub=dict(href=quote("00. Hub.html"), pub=rc.get("hub_publicado") or None),
                         caixa=dict(href=quote(caixa.NOME + ".html"), pub=caixa.link_publicado()) if os.path.isdir(os.path.join(caixa.pasta_caixa(), "listas")) else None,
                         grim=dict(href=quote(grimorio.NOME + ".html"), pub=grimorio.link_publicado()) if tem_g else None,
                         cic=_link_ciclos()))


def _link_ciclos():
    import ciclos
    from urllib.parse import quote
    return dict(href=quote(ciclos.NOME + ".html"), pub=ciclos.link_publicado()) if ciclos.ler_lido() else None


def pagina(pasta=None, avisar=print):
    """(html, resumo) da página da Consulta, com o CSS do hub mais o dela, como a Caixa e o Grimório."""
    import tema
    D = montar(pasta, avisar)
    pal = tema.paleta({"fundo": "#0f0f10", "painel": "#1b1b1d", "acento": "#f5a524", "acento_claro": "#ffc96b", "texto": "#f2f0ec",
                       "suave": "#bdbab3", "apagado": "#8a877f", "destaque": "#f5a524", "destaque_claro": "#ffc96b"})
    css_fontes, _ = tema.fontes(["Alegreya Sans", "Cinzel"])   # Cinzel só nos títulos (--fd); o texto e os números na Alegreya Sans (--fb)
    root = tema.raiz_css(pal, [], ["--fd:'Cinzel',Georgia,'Times New Roman',serif", "--fb:'Alegreya Sans','Segoe UI',system-ui,sans-serif"])
    cores = "".join(".ms-%s{background:%s}" % (k, v) for k, v in (("W", "#f3e7bf"), ("U", "#a9cdf0"), ("B", "#2b2228"), ("R", "#f0a28c"), ("G", "#9fd0a6")))

    def ler(*partes):
        with open(os.path.join(MOTOR, *partes), encoding="utf-8") as fh:
            return fh.read()
    sem_img = json.dumps(dict(D, decks={k: dict(v, capa=None) for k, v in D["decks"].items()}, registros=[dict(r, carta=dict(r["carta"], img=None)) for r in D["registros"]]),
                         ensure_ascii=False, separators=(",", ":"))
    js = ler("consulta", "app.js").replace("/*__DATA__*/null", json.dumps(D, ensure_ascii=False, separators=(",", ":")))
    css = ler("hub", "style.css") + chr(10) + ler("consulta", "style.css")
    html = (ler("consulta", "template.html").replace("/*__FONTS__*/", css_fontes).replace("/*__ROOT__*/", root + cores)
            .replace("/*__CSS__*/", css).replace("/*__JS__*/", js.replace("</script", "<\\/script")))
    return html, dict(registros=len(D["registros"]), decks=len(D["decks"]), kb_dados=len(sem_img.encode("utf-8")) / 1024, kb=len(html.encode("utf-8")) / 1024)


def atalho():
    from urllib.parse import quote
    alvo = "saidas/" + quote(NOME + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Consulta</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir a Consulta</a></p>\n</body>\n</html>\n') % (alvo, alvo)


# ---------------------------------------------------------------- a tela

def _n(v):
    return ("%.2f" % v).rstrip("0").rstrip(".").replace(".", ",") if isinstance(v, (int, float)) else "-"


def mostrar_calculo(res):
    f, fo = res["carta"], res["forca"]
    print("%s %s · %s" % (f["nome"], f["custo"], f["tipo"]))
    for a in f["avisos"]:
        print("  aviso:", a)
    print("  preço: US$ %s%s · EDHREC #%s · Game Changer: %s" % (f["usd"] or "-", (" (foil %s)" % f["usd_foil"]) if f["usd_foil"] else "", f["rank"] or "-", "sim" if fo["gc"] else "não"))
    print("  valor próprio %s (mediana do cadastro %s; acima de %s%% das cartas) · grau no vácuo: %s%s" % (_n(fo["valor_proprio"]), _n(fo["mediana"]), fo.get("percentil", "-"),
          fo.get("grau") or "-", "" if res.get("origem_cadastro") != "consulta" else " (notas da consulta; o cadastro não muda)"))
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
    ap.add_argument("--importar-banco", metavar="ARQ", help="traz as consultas feitas ao vivo na página publicada (JSON da coleção consultas), como entradas a revisar")
    ap.add_argument("--confirmar", metavar="CARTA", help="com o pode do dono: a consulta ao vivo importada deixa de estar a revisar")
    ap.add_argument("--montar", action="store_true", help="os dados da página (registros, decks, régua), com o tamanho; a página sai pelo build.py --consulta")
    ap.add_argument("--sem-rede", action="store_true", help="só o cache do Scryfall e do EDHREC")
    ap.add_argument("--atualizar", action="store_true", help="consulta o Scryfall mesmo com a carta no cache")
    a = ap.parse_args()
    try:
        if a.importar_banco:
            nomes = importar_banco(a.importar_banco)
            print("importadas (a revisar): %s" % (", ".join(nomes) or "nenhuma"))
            return
        if a.confirmar:
            print("registro:", confirmar(a.confirmar))
            return
        if a.montar:
            html, r = pagina()
            print("%s: %d consultas com estudo, %d decks | dados sem imagens %.0f KB | página %.0f KB" % (NOME, r["registros"], r["decks"], r["kb_dados"], r["kb"]))
            return
        if a.listar:
            for x in listar():
                print("%-32s %s  US$ %-6s grau %-2s melhor: %-24s compra: %-12s entra/avaliar: %s%s" % (
                    x["carta"], x["data"], x["usd"] or "-", x["grau"] or "-", ("%s %+.2f" % x["melhor"]) if x["melhor"] else "-", x["compra"] or "-",
                    ", ".join(x["entram"]) or "-", "  (ao vivo, a revisar)" if x["revisar"] else ""))
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
            html, r = pagina(avisar=lambda *x: None)
            saida = os.path.join(os.path.dirname(MOTOR), "saidas", NOME + ".html")
            with open(saida, "w", encoding="utf-8", newline=chr(10)) as fh:
                fh.write(html)
            print("%s: %d consultas com estudo | %.0f KB" % (NOME, r["registros"], r["kb"]))
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
