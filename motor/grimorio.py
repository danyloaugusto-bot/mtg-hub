# -*- coding: utf-8 -*-
"""O Grimório: as melhores cartas de cada lente da carteira, com onde já estão, onde rendem e o status
(contexto/grimorio/METODO-GRIMORIO.md, aprovado pelo dono em 19/10/2026).

    python motor/grimorio.py --ler [lente]            # EDHREC (cache de 30 dias) + Scryfall -> dados/grimorio/grimorio.json e leitura.json
    python motor/grimorio.py --status                 # sem rede: onde está, status, onde rende, 8×8, pontas de lança, novidades
    python motor/grimorio.py --classificar arq.json   # o dossiê das cartas sem cadastro, para a rubrica (as notas vão pelo cadastro)

As lentes ficam em dados/grimorio/lentes.json (do dono). Regras: carta nunca de memória (toda carta passa pelo Scryfall;
banida não entra); teto por lente (40 mais incluídas e 20 de maior sinergia, sem básicos, Sol Ring, Arcane Signet e
Command Tower nas lentes de tema); nota só pelo cadastro v3; sem preço. Caminho do EDHREC que não responde: a lente fica
"sem leitura", com o motivo, e a leitura segue.
"""
import argparse, datetime, json, os, sys, time, urllib.error, urllib.request

sys.dont_write_bytecode = True
MOTOR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, MOTOR)

import dados, encaixe, imagens, scryfall  # noqa: E402

RAIZ = dados.RAIZ
PASTA = os.path.join(dados.DADOS, "grimorio")
CACHE = os.path.join(RAIZ, "cache", "edhrec", "lentes")
URL = "https://json.edhrec.com/pages/%s.json"
UA = "mtg-hub-pessoal/1.0"
VALIDADE = 30    # dias do cache de cada página do EDHREC
INTERVALO = 1.0  # segundos entre chamadas ao EDHREC
NOME = "00. Grimório"
TIERS = "SABCD"
# listas de comandantes, não de cartas, que as páginas de tema trazem junto
LISTAS_FORA = ("topcommanders", "newcommanders")
# as variantes de caminho das páginas de tema: em 20/10/2026 só tags/<slug> respondia (typal/ e themes/ davam 403)
PREFIXOS = ("tags", "typal", "tribes", "themes", "theme")
# as páginas por cor: top/<nome da combinação em inglês> (top/<letras> dava 403 em 20/10/2026)
COR_EDHREC = {"C": "colorless", "W": "white", "U": "blue", "B": "black", "R": "red", "G": "green",
              "WU": "azorius", "UB": "dimir", "BR": "rakdos", "RG": "gruul", "WG": "selesnya", "WB": "orzhov", "UR": "izzet", "BG": "golgari", "WR": "boros", "UG": "simic",
              "WUB": "esper", "UBR": "grixis", "BRG": "jund", "WRG": "naya", "WUG": "bant", "WBG": "abzan", "WUR": "jeskai", "UBG": "sultai", "WBR": "mardu", "URG": "temur",
              "WUBRG": "five-color"}
# critério da v3 e o quadro do 8×8 com o mesmo papel (o mesmo mapa da Caixa, motor/caixa.py)
CRIT_8X8 = {"draw": "draw", "remocao": "removal", "aceleradores": "ramp", "evasao": "evasao", "recurso": "recursao"}
_ultima = [0.0]


# ---------------------------------------------------------------- arquivos

def ler_lentes():
    L = dados.ler_json(os.path.join(PASTA, "lentes.json"))
    for tipo in ("tema", "cor"):
        vistos = set()
        for l in L.get(tipo) or []:
            if not l.get("k") or not l.get("nome"):
                raise dados.ErroDeck("lentes.json: lente de %s sem chave ou nome: %s" % (tipo, l))
            if l["k"] in vistos:
                raise dados.ErroDeck("lentes.json: chave repetida: " + l["k"])
            vistos.add(l["k"])
    t = L.get("teto") or {}
    for campo in ("mais_incluidas", "maior_sinergia"):
        if not isinstance(t.get(campo), int) or t[campo] <= 0:
            raise dados.ErroDeck("lentes.json: teto sem '%s'" % campo)
    return L


def ler_grimorio():
    return dados.ler_json(os.path.join(PASTA, "grimorio.json"), obrigatorio=False)


def ler_leitura():
    return dados.ler_json(os.path.join(PASTA, "leitura.json"), obrigatorio=False)


def link_publicado():
    try:
        with open(os.path.join(PASTA, "link.txt"), encoding="utf-8") as f:
            return f.read().strip() or None
    except OSError:
        return None


def _gravar_json(caminho, dado):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    tmp = caminho + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dado, f, ensure_ascii=False, indent=1)
    os.replace(tmp, caminho)


# ---------------------------------------------------------------- EDHREC

def _ler_cache(k):
    try:
        with open(os.path.join(CACHE, k + ".json"), encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def _gravar_cache(k, dado):
    os.makedirs(CACHE, exist_ok=True)
    tmp = os.path.join(CACHE, k + ".json.tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dado, f, ensure_ascii=False)
    os.replace(tmp, os.path.join(CACHE, k + ".json"))


def _baixar(caminho):
    """(estado, json): "ok" com a página; o código HTTP (403, 404) sem ela; "rede: ..." quando o EDHREC não respondeu."""
    espera = INTERVALO - (time.time() - _ultima[0])
    if espera > 0:
        time.sleep(espera)
    req = urllib.request.Request(URL % caminho, headers={"Accept": "application/json", "User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            j = json.load(r)
        _ultima[0] = time.time()
        return "ok", j
    except urllib.error.HTTPError as e:
        _ultima[0] = time.time()
        return str(e.code), None
    except (urllib.error.URLError, ValueError, OSError) as e:
        _ultima[0] = time.time()
        return "rede: %s" % getattr(e, "reason", e), None


def _extrair(j):
    """As listas de cartas da página (container.json_dict.cardlists): tag, título e, de cada carta, nome, num_decks,
    potential_decks e synergy (só as páginas de tema trazem sinergia)."""
    out = []
    for l in ((j.get("container") or {}).get("json_dict") or {}).get("cardlists") or []:
        cartas = []
        for v in l.get("cardviews") or []:
            if v.get("name") and v.get("num_decks") is not None:
                cartas.append(dict(n=v["name"], nd=v["num_decks"], pd=v.get("potential_decks"), syn=v.get("synergy")))
        if cartas:
            out.append(dict(tag=l.get("tag"), header=l.get("header"), cartas=cartas))
    return out


def caminhos_tema(fonte):
    """O caminho do lentes.json primeiro e, se não responder, as variantes conhecidas com o mesmo slug."""
    slug = (fonte or "").rstrip("/").split("/")[-1]
    out = [fonte] if fonte else []
    for p in PREFIXOS:
        c = p + "/" + slug
        if c not in out:
            out.append(c)
    return out


def caminhos_cor(k):
    nome = COR_EDHREC.get(dados.ordem_cores(k) or ("C" if k == "C" else k))
    return ["top/" + nome] if nome else []


def pagina_lente(l, tipo, forcar=False, rede=True, avisar=print):
    """A página do EDHREC de uma lente, do cache (30 dias) ou da rede, tentando os caminhos até um responder.
    Devolve {lido, k, caminho, tentados, listas, erro}. Caminho que não responde fica no cache com o motivo (o --ler <lente>
    força a nova tentativa); falha de rede não vai para o cache."""
    k = l["k"]
    c = _ler_cache(k)
    hoje = datetime.date.today()
    if c and c.get("lido") and not forcar:
        try:
            if (hoje - datetime.date.fromisoformat(c["lido"])).days <= VALIDADE:
                return c
        except ValueError:
            pass
    if not rede:
        return c
    caminhos = caminhos_tema(l.get("fonte")) if tipo == "tema" else caminhos_cor(k)
    if not caminhos:
        dado = dict(lido=hoje.isoformat(), k=k, caminho=None, tentados=[], listas=[], erro="sem fonte em lentes.json")
        _gravar_cache(k, dado)
        return dado
    tentados = []
    for cam in caminhos:
        st, j = _baixar(cam)
        tentados.append([cam, st])
        if j is not None:
            listas = _extrair(j)
            if listas:
                dado = dict(lido=hoje.isoformat(), k=k, caminho=cam, tentados=tentados, listas=listas, header=j.get("header"))
                _gravar_cache(k, dado)
                return dado
            tentados[-1][1] = "ok, sem listas de cartas"
            continue
        if st.startswith("rede"):
            if c:   # sem rede ou fora do ar: vale o que estava no cache, mesmo vencido
                avisar("aviso: EDHREC sem resposta para %s (%s); vale a leitura de %s" % (l["nome"], st, c.get("lido")))
                return c
            avisar("aviso: EDHREC sem resposta para %s (%s)" % (l["nome"], st))
            return dict(lido=None, k=k, caminho=None, tentados=tentados, listas=[], erro="sem resposta do EDHREC (%s)" % st)
    dado = dict(lido=hoje.isoformat(), k=k, caminho=None, tentados=tentados, listas=[],
                erro="nenhum caminho respondeu: " + ", ".join("%s (%s)" % tuple(t) for t in tentados))
    _gravar_cache(k, dado)
    return dado


def selecionar(pag, tipo, teto):
    """O teto da lente: as `mais_incluidas` cartas por inclusão (num_decks ÷ potential_decks) e as `maior_sinergia` por
    sinergia (quando a página dá), sem repetir, na ordem de inclusão. Uma carta em duas listas da página fica com a entrada
    de mais decks. Nas lentes de tema, básicos e os nomes de `fora_das_lentes_de_tema` ficam de fora."""
    if not pag or not pag.get("listas"):
        return []
    cartas = {}
    for l in pag["listas"]:
        if l.get("tag") in LISTAS_FORA:
            continue
        for v in l["cartas"]:
            x = cartas.get(v["n"])
            if x is None or (v["nd"] or 0) > (x["nd"] or 0):
                cartas[v["n"]] = dict(v)
            elif v.get("syn") is not None and x.get("syn") is None:
                x["syn"] = v["syn"]
    if tipo == "tema":
        fora = set()
        for n in teto.get("fora_das_lentes_de_tema") or []:
            if n.lower() in ("básicos", "basicos"):
                fora |= dados.BASICOS_IDX
            else:
                fora.add(n)
        cartas = {n: v for n, v in cartas.items() if n not in fora}
    for v in cartas.values():
        v["inc"] = round(v["nd"] / v["pd"], 4) if v.get("pd") else None
    por_inc = sorted(cartas.values(), key=lambda v: (-(v["inc"] or 0), -(v["nd"] or 0), v["n"]))[:teto["mais_incluidas"]]
    por_syn = sorted([v for v in cartas.values() if v.get("syn") is not None], key=lambda v: (-v["syn"], v["n"]))[:teto["maior_sinergia"]]
    out, idx = [], {}
    for v in por_inc:
        v["por"] = "inc"
        idx[v["n"]] = v
        out.append(v)
    for v in por_syn:
        if v["n"] in idx:
            idx[v["n"]]["por"] = "inc+syn"
        else:
            v["por"] = "syn"
            out.append(v)
    return out


# ---------------------------------------------------------------- Scryfall

def _frente(n):
    return str(n or "").split(" // ")[0].strip()


def confirmar(nomes, avisar=print):
    """Toda carta passa pelo Scryfall pelo nome da frente (scryfall.buscar, lotes de 75; o que falha no lote é tentado
    uma a uma). Devolve ({nome do EDHREC: registro}, [nomes que o Scryfall não acha])."""
    achados, nao = {}, []
    quieto = lambda *a: None
    for i in range(0, len(nomes), 75):
        lote = nomes[i:i + 75]
        pedidos = [{"name": _frente(n)} for n in lote]
        try:
            r = scryfall.buscar(pedidos, avisar=avisar)
            for j, n in enumerate(lote):
                achados[n] = r[j]
        except scryfall.ErroScryfall:
            for j, n in enumerate(lote):
                try:
                    achados[n] = scryfall.buscar([pedidos[j]], avisar=quieto)[0]
                except scryfall.ErroScryfall:
                    nao.append(n)
    return achados, nao


def _registro(r, rr):
    """O que o Grimório guarda de uma carta: do registro da busca por nome (r), nome oficial, identidade, custo, tipo, texto,
    legalidade e posição no EDHREC; da impressão mais recente (rr, scryfall.recente), coleção, data e `reprint`."""
    faces = r.get("faces") or []
    frente = faces[0] if faces else {}
    tl = r.get("type_line") or frente.get("type_line") or ""
    o = r.get("oracle_text") or "\n//\n".join(f.get("oracle_text", "") for f in faces)
    ult = rr or r
    bt = (faces[1].get("type_line") or "") if len(faces) > 1 else ""
    d = dict(n=r["name"], ci=dados.ordem_cores("".join(r.get("color_identity") or [])), cost=r.get("mana_cost") or frente.get("mana_cost") or "",
             cmc=r.get("cmc") or 0, t=tl, o=o, leg=r.get("leg"), rank=r.get("edhrec_rank"),
             set=ult.get("set"), num=ult.get("num"), rel=ult.get("released_at"), reprint=ult.get("reprint"), rec=1 if rr else 0)
    if "Land" in tl.split(" — ")[0].split():
        d["land"] = 1
    elif r.get("layout") == "modal_dfc" and "Land" in bt.split(" — ")[0].split():
        d["mdfc"] = 1
    return d


def _arquivo_img(r):
    return "%s-%s.jpg" % (str(r.get("set", "")).lower(), str(r.get("num", "")).lower()) if r.get("set") else None


# ---------------------------------------------------------------- a leitura

def _colecoes(hoje, avisar):
    """As coleções para o campo de atualização: as seis mais recentes já lançadas (a última em destaque) e as próximas
    duas a sair, pelo /sets do Scryfall."""
    s = scryfall.colecoes(avisar=avisar)
    if not s:
        return []
    lista = [x for x in s["lista"] if x["set_type"] in ("expansion", "core", "commander", "masters", "draft_innovation", "eternal")]
    antes = [x for x in lista if x["released_at"] <= hoje and x.get("card_count")]
    depois = [x for x in lista if x["released_at"] > hoje]
    out = [dict(c=x["code"].upper(), n=x["name"], d=x["released_at"]) for x in antes[-6:]]
    if out:
        out[-1]["atual"] = 1
    out += [dict(c=x["code"].upper(), n=x["name"], d=x["released_at"], fut=1) for x in depois[:2]]
    return out


def ler(lente=None, rede=True, avisar=print):
    """A leitura: EDHREC por lente (cache de 30 dias), teto, Scryfall carta a carta, imagens que faltam no cache, e o status
    (onde está, onde rende, 8×8, pontas, novidades). Grava dados/grimorio/grimorio.json e leitura.json. Com `lente`, aquela
    lente é lida de novo mesmo com o cache válido; as outras seguem pelo cache."""
    L = ler_lentes()
    teto = L["teto"]
    ant = ler_leitura() or {}
    anterior = ant.get("lido")
    hoje = datetime.date.today().isoformat()
    forcar = set()
    if lente:
        alvo = lente.strip().lower()
        for tipo in ("tema", "cor"):
            for l in L[tipo]:
                if l["k"].lower() == alvo or l["nome"].lower() == alvo:
                    forcar.add(l["k"])
        if not forcar:
            raise dados.ErroDeck("lente '%s' não está em dados/grimorio/lentes.json" % lente)
    lentes_out, caminhos, sem = [], {}, {}
    for tipo in ("tema", "cor"):
        for l in L[tipo]:
            pag = pagina_lente(l, tipo, forcar=(l["k"] in forcar), rede=rede, avisar=avisar) or {}
            sel = selecionar(pag, tipo, teto)
            fonte = l.get("fonte") if tipo == "tema" else (caminhos_cor(l["k"]) or [None])[0]
            caminhos[l["k"]] = dict(fonte=fonte, tentados=pag.get("tentados") or [], respondeu=pag.get("caminho"), lido=pag.get("lido"),
                                    listas=[[x.get("tag"), len(x["cartas"])] for x in pag.get("listas") or []],
                                    na_pagina=len({v["n"] for x in pag.get("listas") or [] if x.get("tag") not in LISTAS_FORA for v in x["cartas"]}))
            if not sel:
                sem[l["k"]] = pag.get("erro") or "a página não trouxe listas de cartas"
            avisar("%-28s %s" % (l["nome"], ("%d cartas (%s)" % (len(sel), pag.get("caminho"))) if sel else "sem leitura: " + sem[l["k"]]))
            lentes_out.append(dict(k=l["k"], nome=l["nome"], tipo=tipo, familia=l.get("familia"), fonte=fonte, caminho=pag.get("caminho"),
                                   lido=pag.get("lido"), decks=list(l.get("decks") or []), erro=sem.get(l["k"]),
                                   cartas=[x["n"] for x in sel], _dados={x["n"]: dict(inc=x["inc"], nd=x["nd"], pd=x["pd"], syn=x.get("syn"), por=x["por"]) for x in sel}))
    nomes = list(dict.fromkeys(n for e in lentes_out for n in e["cartas"]))
    avisar("%d cartas nas lentes; conferindo no Scryfall" % len(nomes))
    achados, nao = confirmar(nomes, avisar)
    rec = scryfall.recente(list(achados), avisar=avisar) if achados else {}
    cartas, banidas, oficial = {}, [], {}
    for n in nomes:
        r = achados.get(n)
        if r is None:
            continue
        c = _registro(r, rec.get(_frente(r["name"]).lower()))
        if c["leg"] == "banned":
            banidas.append(c["n"])
            continue
        oficial[n] = c["n"]
        cartas.setdefault(c["n"], c).setdefault("lentes", {})
    for e in lentes_out:
        novas = []
        for n in e["cartas"]:
            of = oficial.get(n)
            if of:
                novas.append(of)
                cartas[of]["lentes"][e["k"]] = e["_dados"][n]
        e["cartas"] = novas
        del e["_dados"]
    if nao:
        avisar("aviso: %d nomes que o Scryfall não acha ficam de fora: %s" % (len(nao), ", ".join(nao[:12]) + (" …" if len(nao) > 12 else "")))
    if banidas:
        avisar("aviso: %d banidas no Commander ficam de fora: %s" % (len(banidas), ", ".join(banidas)))
    # imagens: a impressão já no cache serve; o que falta é baixado uma vez (o cache é o de sempre)
    precisam = {}
    edhrec_de = {v: k for k, v in oficial.items()}
    for n, c in cartas.items():
        r = achados.get(edhrec_de[n])
        rr = rec.get(_frente(n).lower())
        arqs = [(_arquivo_img(x), x) for x in (r, rr) if x and _arquivo_img(x)]
        pronto = next((a for a, _ in arqs if os.path.exists(os.path.join(imagens.CACHE_IMG, a))), None)
        if pronto:
            c["img"] = pronto
        elif arqs:
            a, x = arqs[0]
            precisam[a] = (x["id"], "front")
            c["img"] = a
    if rede and precisam:
        try:
            imagens.baixar_faltantes(precisam, avisar=avisar)
        except dados.ErroDeck as e:
            avisar("aviso: imagens: %s" % e)
    for c in cartas.values():
        if c.get("img") and not os.path.exists(os.path.join(imagens.CACHE_IMG, c["img"])):
            del c["img"]
    G = dict(versao=1, lido=hoje, anterior=anterior, lentes=lentes_out, cartas=cartas)
    status(G, L, avisar=avisar)
    leitura = dict(versao=1, lido=hoje, anterior=anterior, fontes=["EDHREC (json.edhrec.com)", "Scryfall", "cadastro v3"],
                   colecoes=_colecoes(hoje, avisar), caminhos=caminhos, sem_leitura=sem, nao_encontradas=nao, banidas=banidas,
                   contagens=G["contagens"])
    _gravar_json(os.path.join(PASTA, "grimorio.json"), G)
    _gravar_json(os.path.join(PASTA, "leitura.json"), leitura)
    ct = G["contagens"]
    avisar("gravado: %d cartas em %d lentes (%d lidas, %d sem leitura) | sem cadastro %d | novidades %d | pontas %d | tenho %d, ociosas %d, faltam %d" % (
        ct["cartas"], ct["lentes"], ct["lidas"], ct["sem_leitura"], ct["sem_cadastro"], ct["novidades"], ct["pontas"], ct["tenho"], ct["ociosa"], ct["falta"]))
    return G, leitura


# ---------------------------------------------------------------- o status (sem rede)

def _status(onde, pastas):
    """Tenho: em algum deck que existe (01 a 04). Ociosa: parada em pasta ou na Caixa sem estar em deck, ou num deck onde
    pesa pouco enquanto o radar de outro deck a pede como S ou A com tier melhor que o de todos os decks onde está (a regra das
    Sub-utilizadas do hub). Falta: em nenhum lugar. Deck de 05. Desejo não conta: não existe fisicamente."""
    reais = [x for x in onde if not x.get("dj")]
    em_deck = [x for x in reais if x["w"] == "deck"]
    if em_deck:
        melhor = min(TIERS.index(x["t"]) for x in em_deck)
        pede = [x for x in reais if x["w"] == "radar" and x["t"] in ("S", "A") and TIERS.index(x["t"]) < melhor]
        return "ociosa" if pede else "tenho"
    if pastas:
        return "ociosa"
    return "falta"


def _dentro(ci, ident):
    return all(ch in (ident or "") for ch in (ci or ""))


def status(G, L=None, avisar=print):
    """Recalcula, sem rede, o que depende do projeto: onde cada carta está (decks com tier, pastas, Caixa), o status, as notas
    do cadastro, o "onde rende" (encaixe.ranking nos decks que existem, os três melhores sem a carta), as novidades, as pontas
    de lança, a lente 8×8 de cada deck e as contagens."""
    L = L or ler_lentes()
    cad = dados.ler_cadastro()
    temas = {l["k"] for l in L["tema"]}
    pastas_decks = {(p.split(". ", 1)[1] if ". " in p else p): p for p in sorted(os.listdir(dados.DADOS)) if dados.eh_deck(p)}
    idx = dados.indice_outros("__grimorio__")
    pastas = dados.ler_pastas()
    decks = encaixe.decks_v3()
    reais = [m for m in decks if not m["pasta"].startswith("05")]
    hoje = datetime.date.today().isoformat()
    anterior = G.get("anterior")
    for nome, c in G["cartas"].items():
        ch = dados.chave_nome(nome)
        onde = []
        for x in idx.get(ch, []):
            p = pastas_decks.get(x["d"], x["d"])
            y = dict(p=p, d=x["d"], w=x["w"], t=x["t"], r=x["r"])
            if x.get("v"):
                y["v"] = x["v"]
            if p.startswith("05"):
                y["dj"] = 1
            onde.append(y)
        c["onde"] = onde
        c["pastas"] = {p: cs[ch] for p, cs in pastas.items() if ch in cs}
        c["st"] = _status(onde, c["pastas"])
        e = cad.get(_frente(nome))
        c["notas"] = {k: v for k, v in (e.get("n") or {}).items() if v} if e else None
        c["pq"] = (e.get("por_que") or "") if e else ""
        if e and e.get("so_com"):
            c["so"] = e["so_com"]
        else:
            c.pop("so", None)
        c["rende"] = []
        if e:
            r = encaixe.ranking(nome, reais, cad, dict(cmc=c.get("cmc", 0), land=c.get("land"), mdfc=c.get("mdfc")), n=None)
            c["rende"] = [dict(p=g["deck"], n=g["painel"], g=g["ganho"], s=g["sai"], a=1 if g["avaliada"] else 0) for g in r if not g["ja_no_deck"]][:3]
        nv = None
        if anterior and c.get("rel") and anterior < c["rel"] <= hoje:
            nv = "nova" if c.get("reprint") is False else "reimp"
        c["nv"] = nv
        nt = [k for k in c.get("lentes") or {} if k in temas]
        c["ponta"] = 1 if (len(nt) >= 2 or (len(nt) == 1 and any(v == 3 for v in (c["notas"] or {}).values()))) else 0
    G["decks"] = [dict(p=m["pasta"], n=m["painel"], c=m.get("curto", ""), ci=m.get("ident") or "", **({"dj": 1} if m["pasta"].startswith("05") else {})) for m in decks]
    G["g8"] = _g8(G, L, decks)
    G["pontas"] = sorted((n for n, c in G["cartas"].items() if c["ponta"]), key=lambda n: (G["cartas"][n].get("rank") or 10 ** 9, n))
    ct = dict(cartas=len(G["cartas"]), lentes=len(G["lentes"]), lidas=sum(1 for l in G["lentes"] if l["cartas"]),
              sem_leitura=sum(1 for l in G["lentes"] if not l["cartas"]), sem_cadastro=sum(1 for c in G["cartas"].values() if c["notas"] is None),
              novidades=sum(1 for c in G["cartas"].values() if c["nv"]), pontas=len(G["pontas"]))
    for st in ("tenho", "ociosa", "falta"):
        ct[st] = sum(1 for c in G["cartas"].values() if c["st"] == st)
    G["contagens"] = ct
    return G


def _g8(G, L, decks):
    """A lente 8×8: por deck v3, os agrupamentos com a contagem por pacote como na aba 8×8 do painel (pacote fixado ou
    agrupamento de maior nota, empate para o primeiro; terreno, carta com terreno no verso e comandante fora), a referência
    (8 a 8 sem faixa) e as cartas do Grimório nas cores do deck para o pacote: nota 2 ou 3 no critério com o mesmo papel
    (CRIT_8X8) ou, nos pacotes de tema, as cartas das lentes de tema do deck. As que o deck ainda não tem vêm primeiro,
    por popularidade no EDHREC; no máximo 15 por quadro."""
    inv = {v: k for k, v in CRIT_8X8.items()}
    tema_de = {}
    for l in L["tema"]:
        for p in l.get("decks") or []:
            tema_de.setdefault(p, []).append(l["k"])
    out = {}
    for m in decks:
        gs = m.get("grupos") or []
        caixas = {g["k"]: 0 for g in gs}
        no_deck = {dados.chave_nome(c.get("on", c["n"])) for c in m["cards"]}
        for c in m["cards"]:
            if c.get("cmd") or c.get("land") or c.get("mdfc"):
                continue
            k = c.get("pk0")
            if k not in caixas:
                best, k = 0, None
                for i, v in enumerate((c.get("s") or [])[:len(gs)]):
                    if v > best:
                        best, k = v, gs[i]["k"]
            if k in caixas:
                caixas[k] += c["q"]
        ident = m.get("ident") or ""
        quadros = []
        for g in gs:
            crit = inv.get(g["k"])
            if crit:
                cs = [n for n, c in G["cartas"].items() if (c.get("notas") or {}).get(crit, 0) >= 2 and _dentro(c["ci"], ident)]
            else:
                ls = tema_de.get(m["pasta"]) or []
                cs = [n for n, c in G["cartas"].items() if any(k in (c.get("lentes") or {}) for k in ls) and _dentro(c["ci"], ident)]
            cs.sort(key=lambda n: (dados.chave_nome(n) in no_deck, G["cartas"][n].get("rank") or 10 ** 9, n))
            quadros.append(dict(k=g["k"], n=g["nome"], no=caixas[g["k"]], ref=list(g.get("ref") or [8, 8]), por=crit or "tema", cs=cs[:15]))
        out[m["pasta"]] = dict(quadros=quadros)
    return out


# ---------------------------------------------------------------- o dossiê para a rubrica

def classificar(arquivo, avisar=print):
    """O dossiê das cartas do Grimório sem cadastro (texto do Scryfall, lentes, onde está), na ordem: Falta e Ociosas entre as
    20 mais incluídas de cada lente primeiro, depois as outras por popularidade. As notas são gravadas pela rubrica no cadastro
    v3 (dados/cartas.json), nunca por este script."""
    G = ler_grimorio()
    if not G:
        raise dados.ErroDeck("sem dados/grimorio/grimorio.json: rode --ler antes")
    cad = dados.ler_cadastro()
    r = dados.regua()
    sem = {n: c for n, c in G["cartas"].items() if _frente(n) not in cad}
    prio = {}
    for l in G["lentes"]:
        for i, n in enumerate(l["cartas"][:20]):
            c = sem.get(n)
            if c and c["st"] in ("falta", "ociosa"):
                prio[n] = min(prio.get(n, 99), i)
    ordem = sorted(sem, key=lambda n: (0 if n in prio else 1, prio.get(n, 99), sem[n].get("rank") or 10 ** 9, n))
    cartas = []
    for n in ordem:
        c = sem[n]
        cartas.append(dict(n=n, prioridade=("%s entre as 20 mais incluídas" % ("falta" if c["st"] == "falta" else "ociosa")) if n in prio else "",
                           st=c["st"], lentes=sorted(c.get("lentes") or {}), t=c["t"], cost=c["cost"], cmc=c["cmc"], ci=c["ci"], o=c["o"], rank=c.get("rank"),
                           onde=[dict(d=x["d"], w=x["w"], t=x["t"]) for x in c["onde"]], pastas=c["pastas"]))
    out = dict(gerado=datetime.date.today().isoformat(), rubrica="contexto/pontuacao/RUBRICA.md", grava_em="dados/cartas.json (versão 3, fonte 'claude')",
               criterios=[dict(k=x["k"], nome=x["nome"], desc=dados.DESC_V3.get(x["k"], "")) for x in r["criterios"] if not x.get("do_deck")],
               total=len(cartas), prioritarias=len(prio), cartas=cartas)
    _gravar_json(arquivo, out)
    avisar("dossiê: %d cartas sem cadastro (%d prioritárias: Falta ou Ociosa entre as 20 mais incluídas) em %s" % (len(cartas), len(prio), arquivo))
    return out


# ---------------------------------------------------------------- a página (motor/grimorio/)

def _fmt_data(d):
    return "/".join(reversed(d.split("-"))) if d else ""


def _cortar(G, teto):
    """As listas de cada lente dentro de um teto (mais incluídas, maior sinergia), pelos números guardados em cada carta.
    Com o teto do lentes.json devolve as listas inteiras; o build só reduz quando a página passa do orçamento."""
    out = {}
    for l in G["lentes"]:
        d = [(n, G["cartas"][n]["lentes"][l["k"]]) for n in l["cartas"]]
        por_inc = sorted(d, key=lambda x: (-(x[1].get("inc") or 0), -(x[1].get("nd") or 0), x[0]))[:teto[0]]
        por_syn = sorted([x for x in d if x[1].get("syn") is not None], key=lambda x: (-x[1]["syn"], x[0]))[:teto[1]]
        fica = {x[0] for x in por_inc} | {x[0] for x in por_syn}
        out[l["k"]] = [n for n in l["cartas"] if n in fica]
    return out


def _montar_pagina(G, L, lt, qualidade, teto, memo):
    import base64
    from urllib.parse import quote
    import caixa, tema
    listas = _cortar(G, teto)
    membro = {k: set(v) for k, v in listas.items()}
    universo = set(n for ns in listas.values() for n in ns)
    nome_deck = lambda p: p.split(". ", 1)[1] if ". " in p else p
    cam = lt.get("caminhos") or {}
    temas, cores = [], []
    for l in G["lentes"]:
        tent = ", ".join("%s (%s)" % tuple(t) for t in (cam.get(l["k"]) or {}).get("tentados") or [])
        e = dict(k=l["k"], n=l["nome"], src=l.get("caminho") or l.get("fonte") or "", lido=_fmt_data(l.get("lido")), decks=[nome_deck(p) for p in l["decks"]],
                 q=len(listas[l["k"]]), erro=l.get("erro"), tentados=tent)
        if l["tipo"] == "tema":
            e["f"] = l.get("familia") or ""
            temas.append(e)
        else:
            cores.append(e)
    crit = [dict(k=c["k"], n=c["nome"], w=c["peso"], dd=1 if c.get("do_deck") else 0) for c in dados.regua()["criterios"]]
    cards = {}
    for n in sorted(universo):
        c = G["cartas"][n]
        x = dict(n=n, ci=c["ci"], cost=c["cost"], cmc=(int(c["cmc"]) if float(c["cmc"] or 0).is_integer() else c["cmc"]), t=c["t"], o=c["o"], rank=c.get("rank"),
                 set=(c.get("set") or "").upper(), rel=c.get("rel"), nv=c.get("nv"), st=c["st"], onde=c["onde"], pastas=c["pastas"], rende=c["rende"],
                 notas=c["notas"], pq=c["pq"], ponta=c["ponta"],
                 lk={k: dict(inc=v.get("inc"), syn=v.get("syn"), por=v.get("por"), nd=v.get("nd"), pd=v.get("pd")) for k, v in c["lentes"].items() if n in membro.get(k, ())})
        if c.get("so"):
            x["so"] = c["so"]
        if c.get("img"):
            chave = (c["img"], qualidade)
            if chave not in memo:
                memo[chave] = imagens.miniatura(c["img"], qualidade=qualidade) or False
            if memo[chave]:
                x["img"] = "data:image/jpeg;base64," + base64.b64encode(memo[chave]).decode()
        cards[n] = x
    g8 = {p: dict(quadros=[dict(q, cs=[n for n in q["cs"] if n in universo]) for q in v["quadros"]]) for p, v in (G.get("g8") or {}).items()}
    pontas = [n for n in G.get("pontas") or [] if n in universo]
    ct = dict(cartas=len(cards), lentes=len(G["lentes"]), lidas=sum(1 for l in G["lentes"] if listas[l["k"]]), sem_leitura=sum(1 for l in G["lentes"] if not listas[l["k"]]),
              sem_cadastro=sum(1 for c in cards.values() if c["notas"] is None), novidades=sum(1 for c in cards.values() if c["nv"]), pontas=len(pontas))
    for st in ("tenho", "ociosa", "falta"):
        ct[st] = sum(1 for c in cards.values() if c["st"] == st)
    tem_caixa = os.path.isdir(os.path.join(caixa.pasta_caixa(), "listas"))
    D = dict(lido=G.get("lido"), anterior=G.get("anterior"), fontes=lt.get("fontes") or ["EDHREC", "Scryfall", "cadastro v3"], colecoes=lt.get("colecoes") or [],
             contagens=ct, temas=temas, cores=cores, crit=crit, decks=G.get("decks") or [], g8=g8, lentes=listas, cards=cards, pontas=pontas,
             hub=dict(href=quote("00. Hub.html"), pub=(caixa.regua().get("hub_publicado") or None)),
             caixa=dict(href=quote(caixa.NOME + ".html"), pub=caixa.link_publicado()) if tem_caixa else None,
             teto=list(teto), orcamento=L.get("orcamento_html_mb"), galeria=dict(largura=imagens.LARGURA_GRIMORIO, qualidade=qualidade))
    pal = tema.paleta({"fundo": "#0f0f10", "painel": "#1b1b1d", "acento": "#f5a524", "acento_claro": "#ffc96b", "texto": "#f2f0ec",
                       "suave": "#bdbab3", "apagado": "#8a877f", "destaque": "#f5a524", "destaque_claro": "#ffc96b"})
    css_fontes, _ = tema.fontes(["Alegreya Sans", "Cinzel"])   # Cinzel só nos títulos (--fd); o texto e os números na Alegreya Sans (--fb)
    root = tema.raiz_css(pal, [], ["--fd:'Cinzel',Georgia,'Times New Roman',serif", "--fb:'Alegreya Sans','Segoe UI',system-ui,sans-serif"])

    def ler(*partes):
        with open(os.path.join(MOTOR, *partes), encoding="utf-8") as f:
            return f.read()
    js = ler("grimorio", "app.js").replace("/*__DATA__*/null", json.dumps(D, ensure_ascii=False, separators=(",", ":")))
    js += chr(10) + ler("comum", "ordenar.js")   # ordenar a tabela pelo cabeçalho, como no painel, no hub e na Caixa
    css = ler("hub", "style.css") + chr(10) + ler("grimorio", "style.css")   # a barra e os componentes do hub, mais o que é só do Grimório
    html = (ler("grimorio", "template.html").replace("/*__FONTS__*/", css_fontes).replace("/*__ROOT__*/", root)
            .replace("/*__CSS__*/", css).replace("/*__JS__*/", js.replace("</script", "<\\/script")))
    return html, dict(cartas=len(cards), lentes=ct["lidas"])


def pagina(avisar=print):
    """A página do Grimório (html, resumo). Orçamento (lentes.json, 14 MB): acima dele, a galeria cai para qualidade 60 e
    depois o teto por lente, com aviso em cada passo; o grimorio.json não muda."""
    G = ler_grimorio()
    if not G:
        raise dados.ErroDeck("sem dados/grimorio/grimorio.json: rode python motor/grimorio.py --ler")
    L = ler_lentes()
    lt = ler_leitura() or {}
    teto0 = [L["teto"]["mais_incluidas"], L["teto"]["maior_sinergia"]]
    orc = L.get("orcamento_html_mb") or 14
    passos = [(imagens.QUALIDADE_GRIMORIO, teto0), (60, teto0)] + [(60, t) for t in ([30, 15], [25, 12], [20, 10], [15, 8], [10, 5]) if t[0] < teto0[0]]
    memo, avisos = {}, []
    for q, teto in passos:
        html, r = _montar_pagina(G, L, lt, q, teto, memo)
        mb = len(html.encode("utf-8")) / 1048576
        if mb <= orc:
            break
        avisos.append("%.1f MB com qualidade %d e teto %d+%d, acima do orçamento de %s MB" % (mb, q, teto[0], teto[1], orc))
    for a in avisos:
        avisar("aviso: " + a)
    r.update(avisos=avisos, qualidade=q, largura=imagens.LARGURA_GRIMORIO, teto=teto, teto_reduzido=(teto != teto0), kb=len(html.encode("utf-8")) / 1024)
    return html, r


def atalho():
    from urllib.parse import quote
    alvo = "saidas/" + quote(NOME + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Grimório</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir o Grimório</a></p>\n</body>\n</html>\n') % (alvo, alvo)


# ---------------------------------------------------------------- linha de comando

def main():
    ap = argparse.ArgumentParser(description="O Grimório: leitura, status e dossiê.")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--ler", nargs="?", const="", metavar="LENTE", help="lê o EDHREC e o Scryfall e grava grimorio.json e leitura.json; com uma lente, relê só ela")
    g.add_argument("--status", action="store_true", help="recalcula onde está, status, onde rende, 8×8, pontas e novidades, sem rede")
    g.add_argument("--classificar", metavar="ARQUIVO.json", help="grava o dossiê das cartas sem cadastro, para a rubrica")
    ap.add_argument("--sem-rede", action="store_true", help="no --ler, usa só o cache do EDHREC e do Scryfall")
    a = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    try:
        if a.ler is not None:
            ler(a.ler or None, rede=not a.sem_rede)
        elif a.status:
            G = ler_grimorio()
            if not G:
                raise dados.ErroDeck("sem dados/grimorio/grimorio.json: rode --ler antes")
            status(G)
            _gravar_json(os.path.join(PASTA, "grimorio.json"), G)
            lt = ler_leitura() or {}
            lt["contagens"] = G["contagens"]
            _gravar_json(os.path.join(PASTA, "leitura.json"), lt)
            ct = G["contagens"]
            print("status: %d cartas | sem cadastro %d | novidades %d | pontas %d | tenho %d, ociosas %d, faltam %d" % (
                ct["cartas"], ct["sem_cadastro"], ct["novidades"], ct["pontas"], ct["tenho"], ct["ociosa"], ct["falta"]))
        else:
            classificar(a.classificar)
    except (dados.ErroDeck, scryfall.ErroScryfall) as e:
        print("ERRO: %s" % e, file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
