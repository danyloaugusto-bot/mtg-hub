# -*- coding: utf-8 -*-
"""A Caixa: as cartas sem destino, cópia a cópia (contexto/caixa/PLANO-CAIXA.md, v2, 17/10/2026).

As listas ficam em dados/caixa/listas/ (txt no formato da decklist, ou CSV), uma por lote, e nunca são editadas.
A caixa é a soma das listas menos as cópias com decisão já aplicada (dados/caixa/decisoes.json). Para cada carta:
força sozinha (os oito critérios do cadastro, a posição no EDHREC e o selo de Game Changer), onde já está (decks,
radares, pastas, lista de compras), o encaixe da pontuação v3 contra todos os decks, os comandantes que mais a jogam
no EDHREC e a sugestão de destino para cada cópia (Deck, Guardar, Venda, Bundles, Bulk), com prioridade S, A, B ou C.

A Caixa é a única página que mostra preço (exceção à decisão "Sem preço" de 14/10/2026, só nela): o preço do
Scryfall decide entre Venda e Bulk e marca o capital parado. A régua mora em motor/caixa.json.

Cópia em idioma que não é inglês: a consulta é pela coleção e pelo número, que dá a mesma impressão em inglês (o
preço de referência); o id do Scryfall de uma versão em outro idioma nunca entra no cache comum, que guarda as cartas
por coleção e número e alimenta os painéis.
"""
import csv, datetime, io, json, os, re
import dados, edhrec, encaixe, prenota, scryfall

MOTOR = os.path.dirname(os.path.abspath(__file__))
REGUA_ARQ = os.path.join(MOTOR, "caixa.json")
DESTINOS = ["deck", "guardar", "venda", "bundles", "bulk"]
NOME_DESTINO = {"deck": "Deck", "guardar": "Guardar", "venda": "Venda", "bundles": "Bundles", "bulk": "Bulk"}
PRIORIDADES = ["S", "A", "B", "C"]
_REGUA = None

# cabeçalhos de CSV reconhecidos (minúsculas, sem acento)
COLUNAS = {
    "nome": ["name", "card name", "nome", "card"],
    "q": ["quantity", "qty", "count", "qtd", "quantidade"],
    "set": ["set", "set code", "edition", "edicao", "codigo", "set_code"],
    "num": ["collector number", "number", "numero", "collector_number", "cn"],
    "foil": ["foil"],
    "acab": ["finish", "printing", "acabamento"],
    "id": ["scryfall id", "scryfall_id", "scryfallid"],
    "idioma": ["language", "idioma", "lang"],
    "cond": ["condition", "condicao"],
}


def regua():
    global _REGUA
    if _REGUA is None:
        with open(REGUA_ARQ, encoding="utf-8") as f:
            _REGUA = json.load(f)
    return _REGUA


def pasta_caixa(base=None):
    return base or os.path.join(dados.DADOS, "caixa")


def _sem_acento(s):
    import unicodedata
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower().strip()


def chave_id(nome):
    """id de documento no banco: o nome sem acento, em minúsculas, com hífens (o mesmo das Compras do hub)."""
    return re.sub(r"[^a-z0-9]+", "-", _sem_acento(nome)).strip("-")


def fmt(v, casas=1):
    """Número como a tela mostra: vírgula decimal, ponto de milhar, sem ",0" no inteiro."""
    if v is None:
        return "—"
    s = ("%." + str(casas) + "f") % v
    inteiro, _, dec = s.partition(".")
    neg = inteiro.startswith("-")
    inteiro = inteiro.lstrip("-")
    inteiro = "{:,}".format(int(inteiro)).replace(",", ".")
    out = ("-" if neg else "") + inteiro
    if dec and int(dec):
        out += "," + dec.rstrip("0")
    return out


def usd(v):
    return "US$ " + ("%.2f" % v).replace(".", ",") if v is not None else "sem preço"


# ---------------------------------------------------------------- as listas

def _acabamento(foil, acab):
    a = _sem_acento(acab or "")
    if a in ("foil", "etched"):
        return a
    if "etched" in a:
        return "etched"
    if "foil" in a:
        return "foil"
    f = _sem_acento(foil or "")
    if f in ("foil", "etched"):
        return f
    if f in ("true", "1", "sim", "yes", "s", "verdadeiro", "x"):
        return "foil"
    return "normal"


def ler_csv(caminho):
    """(cópias, colunas ignoradas, linhas ilegíveis) de um CSV, separador , ou ;."""
    with open(caminho, encoding="utf-8-sig") as f:
        bruto = f.read()
    primeira = bruto.splitlines()[0] if bruto else ""
    sep = ";" if primeira.count(";") > primeira.count(",") else ","
    leitor = csv.reader(io.StringIO(bruto), delimiter=sep)
    cab = next(leitor, [])
    norm = [_sem_acento(c) for c in cab]
    idx, usados = {}, set()
    for campo, nomes in COLUNAS.items():
        for i, c in enumerate(norm):
            if c in nomes and campo not in idx:
                idx[campo] = i
                usados.add(i)
    ignoradas = [cab[i] for i in range(len(cab)) if i not in usados]
    if "nome" not in idx and "id" not in idx:
        return [], ignoradas, [dict(linha=1, orig=primeira, motivo="cabeçalho sem a coluna do nome")]
    out, ruins = [], []
    for n, row in enumerate(leitor, 2):
        if not any(x.strip() for x in row):
            continue
        g = lambda k: row[idx[k]].strip() if k in idx and idx[k] < len(row) else ""
        try:
            q = int(g("q") or 1)
        except ValueError:
            ruins.append(dict(linha=n, orig=sep.join(row), motivo="quantidade ilegível"))
            continue
        nome = g("nome")
        if not nome and not g("id"):
            ruins.append(dict(linha=n, orig=sep.join(row), motivo="linha sem nome"))
            continue
        out.append(dict(linha=n, orig=sep.join(row), q=q, nome=nome, set=g("set").upper() or None, num=g("num") or None,
                        acab=_acabamento(g("foil"), g("acab")), id=g("id") or None, idioma=(g("idioma") or "en").lower(),
                        cond=g("cond") or None))
    return out, ignoradas, ruins


def ler_txt(caminho):
    """(cópias, [], linhas ilegíveis) de um txt no formato da decklist (1 Nome (SET) 123 *F*), sem comandante."""
    out, ruins = [], []
    with open(caminho, encoding="utf-8-sig") as f:
        for n, linha in enumerate(f, 1):
            linha = linha.strip()
            if not linha or linha.startswith(("#", "//")) or dados.CABECALHO.match(linha):
                continue
            m = dados.LINHA.match(linha)
            if not m:
                ruins.append(dict(linha=n, orig=linha, motivo="fora do formato '1 Nome (SET) 123'"))
                continue
            flags = {x.strip("*").upper() for x in (m.group(5) or "").split()}
            out.append(dict(linha=n, orig=linha, q=int(m.group(1)), nome=m.group(2), set=(m.group(3) or "").upper() or None,
                            num=m.group(4), acab="etched" if "E" in flags else "foil" if "F" in flags else "normal",
                            id=None, idioma="en", cond=None))
    return out, [], ruins


def ler_listas(base=None):
    """Todas as listas de dados/caixa/listas/, com o resumo da importação de cada uma."""
    d = os.path.join(pasta_caixa(base), "listas")
    copias, resumo = [], []
    for arq in sorted(os.listdir(d)) if os.path.isdir(d) else []:
        p = os.path.join(d, arq)
        ext = os.path.splitext(arq)[1].lower()
        if ext == ".csv":
            cs, ign, ruins = ler_csv(p)
        elif ext == ".txt":
            cs, ign, ruins = ler_txt(p)
        else:
            continue
        for c in cs:
            c["lista"] = arq
        for r in ruins:
            r["lista"] = arq
        copias += cs
        resumo.append(dict(arquivo=arq, formato=ext[1:], linhas=len(cs) + len(ruins), copias=sum(c["q"] for c in cs),
                           colunas_ignoradas=ign, ilegiveis=ruins))
    return copias, resumo


def nomes(base=None):
    """{chave do nome: cópias} das listas da Caixa, menos as cópias com decisão aplicada. Leitura leve, sem Scryfall:
    é o que dados.ler_pastas usa para a Caixa entrar como mais uma pasta nos painéis e no hub."""
    try:
        copias, _ = ler_listas(base)
    except (OSError, ValueError):
        return {}
    out = {}
    for c in copias:
        if c.get("nome"):
            k = dados.chave_nome(c["nome"])
            out[k] = out.get(k, 0) + c["q"]
    for n, v in (ler_decisoes(base).get("cartas") or {}).items():
        k = dados.chave_nome(n)
        for x in v.get("copias") or []:
            if x.get("aplicado") and out.get(k):
                out[k] -= 1
    return {k: q for k, q in out.items() if q > 0}


def gravar_resumo(cx):
    """cache/caixa/resumo.json: o que o hub mostra da Caixa (sem preço: o hub não mostra valor)."""
    por_dest, por_pri, _ = resumo_destinos(cx)
    r = dict(lido=cx["lido"], cartas=cx["resumo"]["cartas"], copias=cx["resumo"]["copias"], S=por_pri["S"][0], A=por_pri["A"][0])
    p = os.path.join(dados.RAIZ, "cache", "caixa", "resumo.json")
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(r, f, ensure_ascii=False)
    return r


def ler_resumo():
    try:
        with open(os.path.join(dados.RAIZ, "cache", "caixa", "resumo.json"), encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def link_publicado(base=None):
    try:
        with open(os.path.join(pasta_caixa(base), "link.txt"), encoding="utf-8") as f:
            return f.read().strip() or None
    except OSError:
        return None


# ---------------------------------------------------------------- decisões

def ler_decisoes(base=None):
    p = os.path.join(pasta_caixa(base), "decisoes.json")
    try:
        with open(p, encoding="utf-8") as f:
            d = json.load(f)
    except (OSError, ValueError):
        d = {}
    if d.get("versao") != 2:   # a semente era v1, {"versao": 1, "cartas": {}}
        cartas = {}
        for n, v in (d.get("cartas") or {}).items():
            cartas[n] = {"copias": v.get("copias") if isinstance(v, dict) and "copias" in v else ([v] if isinstance(v, dict) else [])}
        d = {"versao": 2, "cartas": cartas}
    return d


def gravar_decisoes(d, base=None):
    p = os.path.join(pasta_caixa(base), "decisoes.json")
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(d, ensure_ascii=False, indent=1) + "\n")


# ---------------------------------------------------------------- Scryfall

def _cache_ids():
    p = os.path.join(dados.RAIZ, "cache", "caixa", "ids.json")
    try:
        with open(p, encoding="utf-8") as f:
            return p, json.load(f)
    except (OSError, ValueError):
        return p, {}


def _resolver_ids(copias, avisar):
    """Linha só com o id do Scryfall: descobre coleção e número (sem gravar a versão do idioma no cache comum)."""
    falta = [c for c in copias if c.get("id") and not (c.get("set") and c.get("num"))]
    if not falta:
        return
    p, ids = _cache_ids()
    mudou = False
    for c in falta:
        r = ids.get(c["id"])
        if r is None:
            try:
                k = scryfall._get("https://api.scryfall.com/cards/" + c["id"])
                r = ids[c["id"]] = dict(set=k["set"].upper(), num=k["collector_number"], name=k["name"])
                mudou = True
            except scryfall.ErroScryfall as e:
                avisar("aviso: id do Scryfall não achado: %s (%s)" % (c["id"], e))
                continue
        c["set"], c["num"], c["nome"] = r["set"], r["num"], c.get("nome") or r["name"]
    if mudou:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(ids, f, ensure_ascii=False, indent=0)


def _pedido(c):
    return dict(set=c["set"], num=c["num"], name=c["nome"]) if c.get("set") and c.get("num") else dict(name=c["nome"])


def _buscar(copias, avisar):
    """{índice: registro do Scryfall}; o que não for achado fica de fora."""
    pedidos = [_pedido(c) for c in copias]
    achados = {}
    for i in range(0, len(pedidos), 70):
        lote = list(range(i, min(i + 70, len(pedidos))))
        try:
            r = scryfall.buscar([pedidos[j] for j in lote], avisar=avisar)
            for k, j in enumerate(lote):
                achados[j] = r[k]
        except scryfall.ErroScryfall:
            for j in lote:
                try:
                    achados[j] = scryfall.buscar([pedidos[j]], avisar=avisar)[0]
                except scryfall.ErroScryfall:
                    pass
    return achados


def _preco(r, acab):
    v = r.get({"foil": "usd_foil", "etched": "usd_etched"}.get(acab, "usd"))
    try:
        return float(v) if v not in (None, "") else None
    except ValueError:
        return None


# ---------------------------------------------------------------- os decks do dono

def info_decks():
    """Cada pasta de deck: grupo, Desejo, precon intacto, comandantes, cartas e radar (pelo nome do Scryfall)."""
    out = {}
    por_pasta = {m["pasta"]: m for m in encaixe.decks_v3()}
    for pasta in sorted(os.listdir(dados.DADOS)):
        base = os.path.join(dados.DADOS, pasta)
        if not (dados.eh_deck(pasta) and os.path.exists(os.path.join(base, "decklist.txt"))):
            continue
        ficha = ""
        try:
            with open(os.path.join(base, "deck.md"), encoding="utf-8") as f:
                ficha = f.read()
        except OSError:
            pass
        sit = re.search(r"\*\*situação:\*\*\s*(.+)", ficha)
        desejo = bool(sit and "desejo" in sit.group(1).lower()) or pasta.startswith("05")
        pre = re.search(r"\*\*precon:\*\*\s*(.+)", ficha)
        precon = bool(pre and "intacto" in pre.group(1).lower())
        try:
            cmds = [e["name"] for e in dados.ler_decklist(os.path.join(base, "decklist.txt")) if e["cmd"]]
        except dados.ErroDeck:
            cmds = []
        m = por_pasta.get(pasta)
        cartas = {dados.chave_nome(c.get("on", c["n"])): c for c in (m["cards"] if m else [])}
        radar = {dados.chave_nome(c.get("on", c["n"])): c for c in (m["cands"] if m else [])}
        out[pasta] = dict(pasta=pasta, grupo=pasta.split(".")[0], desejo=desejo, precon=precon, cmds=cmds,
                          painel=(m or {}).get("painel", pasta), curto=(m or {}).get("curto", (cmds[0].split(",")[0] if cmds else pasta)),
                          ident=(m or {}).get("ident", ""), cartas=cartas, radar=radar, m=m)
    return out


def _elegivel(d):
    """Deck que pode receber a sugestão Deck: existe fisicamente (01 a 04) e não é precon intacto."""
    return d and not d["desejo"] and not d["precon"]


def _ler_compras(base):
    p = os.path.join(pasta_caixa(base), "compras.json")
    try:
        with open(p, encoding="utf-8") as f:
            j = json.load(f)
    except (OSError, ValueError):
        return {}
    docs = j.get("cartas") if isinstance(j, dict) and "cartas" in j else j
    docs = docs.values() if isinstance(docs, dict) else (docs or [])
    return {dados.chave_nome(x.get("n", "")): x for x in docs if isinstance(x, dict) and x.get("n")}


# ---------------------------------------------------------------- a conta

def _imp(set_, num):
    return ("%s %s" % ((set_ or "").upper(), num or "")).strip() if set_ else ""


def montar(avisar=print, base=None, rede=True, fonte_edhrec=None):
    """A Caixa inteira, pronta para o teste e para a página. base: outra pasta no lugar de dados/caixa (testes).
    fonte_edhrec(nome) substitui a leitura do EDHREC (testes, sem rede)."""
    R = regua()
    hoje = datetime.date.today().isoformat()
    copias, resumo_listas = ler_listas(base)
    _resolver_ids(copias, avisar)
    achados = _buscar(copias, avisar) if copias else {}
    cad = dados.ler_cadastro()
    ks = encaixe._regua()[1]
    decks = info_decks()
    ds_v3 = encaixe.decks_v3()
    pastas_fis = {p: v for p, v in dados.ler_pastas().items() if p.lower() != "caixa"}
    compras = _ler_compras(base)
    dec = ler_decisoes(base)
    cmd_do_dono = {}
    for p, d in decks.items():
        for n in d["cmds"]:
            cmd_do_dono.setdefault(dados.chave_nome(n), []).append(p)
    gcs = set()
    try:
        gcs = {dados.chave_nome(n) for n in (scryfall.game_changers(avisar=lambda *a: None) or {}).get("nomes") or []}
    except Exception:
        pass

    nao_encontradas, por_carta = [], {}
    for i, c in enumerate(copias):
        r = achados.get(i)
        if r is None:
            nao_encontradas.append(dict(lista=c["lista"], linha=c["linha"], orig=c["orig"], nome=c["nome"]))
            continue
        nome = r["name"].split(" // ")[0]
        avisos = []
        if c.get("set") and (r.get("set", "").upper() != c["set"] or str(r.get("num")) != str(c["num"])):
            avisos.append("impressão %s não achada: preço da impressão padrão (%s)" % (_imp(c["set"], c["num"]), _imp(r.get("set"), r.get("num"))))
        if c["idioma"] not in ("en", "english", "ingles", "inglês", ""):
            avisos.append("cópia em %s: preço de referência da impressão em inglês" % c["idioma"])
        preco = _preco(r, c["acab"])
        if preco is None:
            avisos.append("sem preço")
        for _ in range(c["q"]):
            por_carta.setdefault(nome, dict(r=r, copias=[]))["copias"].append(
                dict(imp=_imp(r.get("set"), r.get("num")), acab=c["acab"], idioma=c["idioma"], cond=c["cond"], usd=preco,
                     data=r.get("consultado"), avisos=list(avisos), lista=c["lista"], linha=c["linha"]))

    # cópias com decisão aplicada saem da caixa; as pendentes ficam presas à cópia (por impressão e acabamento)
    decididas = 0
    for nome, v in por_carta.items():
        ds_c = (dec["cartas"].get(nome) or {}).get("copias") or []
        resto = []
        aplicadas = [x for x in ds_c if x.get("aplicado")]
        pendentes = [x for x in ds_c if not x.get("aplicado") and x.get("destino")]
        for cp in v["copias"]:
            a = next((x for x in aplicadas if x.get("imp") == cp["imp"] and x.get("acab", "normal") == cp["acab"]), None)
            if a:
                aplicadas.remove(a)
                continue
            p = next((x for x in pendentes if x.get("imp") == cp["imp"] and x.get("acab", "normal") == cp["acab"]), None)
            if p:
                pendentes.remove(p)
                cp["decisao"] = p
                decididas += 1
            resto.append(cp)
        v["copias"] = resto

    cartas, sem_cadastro = [], []
    for nome, v in sorted(por_carta.items()):
        if not v["copias"]:
            continue
        r = v["r"]
        ch = dados.chave_nome(nome)
        base_c = dados.montar_carta(nome, None, r, [], {})
        e = cad.get(nome)
        cad_auto = e is None
        if cad_auto:
            notas, _, _ = prenota.prenota(r)
            e = dict(n={k: x for k, x in notas.items() if x}, por_que="pré-nota automática, a revisar", fonte="auto")
            sem_cadastro.append(nome)
        s8 = [e["n"].get(k, 0) for k in ks[2:]]
        vp = encaixe.valor([0, 0] + s8)
        rank = r.get("edhrec_rank")
        gc = bool(r.get("game_changer")) or ch in gcs
        staple = bool(rank and rank <= R["staple_rank_max"])
        # carta só com a pré-nota automática não é forte pelo valor próprio até ser revista (dono, 17/10/2026)
        forte = gc or staple or (vp >= R["forte_valor_min"] and not cad_auto)

        # onde já está
        em_decks, radares, em_desejo = [], [], []
        for p, d in decks.items():
            if ch in d["cartas"]:
                x = d["cartas"][ch]
                em_decks.append(dict(p=p, n=d["painel"], T=x.get("tier"), r=x.get("rel"), imp=_imp(x.get("set"), x.get("num")),
                                     desejo=d["desejo"], precon=d["precon"]))
                if d["desejo"]:
                    em_desejo.append(p)
            if ch in d["radar"]:
                x = d["radar"][ch]
                sai = d["m"] and next((y for y in d["m"]["cards"] if y["id"] == x.get("sai")), None)
                radares.append(dict(p=p, n=d["painel"], v=x.get("verdict"), T=x.get("tier"), sai=sai["n"] if sai else None,
                                    desejo=d["desejo"], precon=d["precon"]))
                if d["desejo"] and x.get("verdict") != "fora":
                    em_desejo.append(p)
        nas_pastas = [dict(p=p, q=cs[ch]) for p, cs in pastas_fis.items() if ch in cs]
        na_compra = compras.get(ch)

        # encaixe contra todos os decks v3
        cad2 = cad if not cad_auto else dict(cad, **{nome: e})
        carta = dict(cmc=base_c["cmc"], land=base_c.get("land"), mdfc=base_c.get("mdfc"))
        enc = []
        for g in encaixe.ranking(nome, ds_v3, cad2, carta, n=None):
            d = decks.get(g["deck"]) or {}
            x = (d.get("cartas") or {}).get(ch) or (d.get("radar") or {}).get(ch)
            sin = [x["s3"][0], x["s3"][1]] if x and x.get("s3") else [0, 0]
            enc.append(dict(p=g["deck"], n=g["painel"], g=g["ganho"], v=g["valor"], s=g["sai"], vs=g["valor_sai"], c=g["cobre"],
                            a=1 if g["avaliada"] else 0, j=1 if g["ja_no_deck"] else 0, sin=sin,
                            pre=1 if d.get("precon") else 0, des=1 if d.get("desejo") else 0,
                            **({"dc": g["d_cmc"], "da": g["d_acel"]} if "d_cmc" in g else {})))

        # EDHREC: os comandantes que mais a jogam
        top = (fonte_edhrec(nome) if fonte_edhrec else edhrec.comandantes(nome, rede=rede, avisar=avisar)) or None
        edh = None
        if top:
            edh = [dict(t, meu=cmd_do_dono.get(dados.chave_nome(t["n"]), []) if t["pct"] >= R["edhrec_pct_min"] else [],
                        meu_baixo=cmd_do_dono.get(dados.chave_nome(t["n"]), []) if t["pct"] < R["edhrec_pct_min"] else [])
                   for t in top[:R["edhrec_top"]]]

        card = dict(n=nome, id=chave_id(nome), on=r.get("flavor_name") or None,   # nome impresso (Hades Grip), como nos painéis
                    cost=base_c.get("cost", ""), cmc=base_c["cmc"], t=base_c["t"], line=base_c.get("line", ""), col=base_c.get("col", "C"),
                    pt=base_c.get("pt"), ident="".join(r.get("color_identity") or []), land=1 if base_c.get("land") else 0,
                    mdfc=1 if base_c.get("mdfc") else 0, fx=r.get("oracle_text") or " // ".join(f.get("oracle_text", "") for f in (r.get("faces") or [])),
                    rank=rank, gc=1 if gc else 0, staple=1 if staple else 0, forte=1 if forte else 0, vp=vp, s8=s8,
                    cad_auto=1 if cad_auto else 0, por_que=e.get("por_que", ""), copias=v["copias"],
                    em_decks=em_decks, radares=radares, pastas=nas_pastas, compra=na_compra, enc=enc, edh=edh,
                    sid=r.get("id"), iset=r.get("set"), inum=r.get("num"), image=r.get("image", True))
        _sugerir(card, decks, em_desejo, R)
        card["avaliar"] = _decks_a_avaliar(card, decks)
        card["q"] = len(card["copias"])
        card["valor"] = round(sum(c["usd"] or 0 for c in card["copias"]), 2)
        cartas.append(card)

    resumo = dict(lido=hoje, listas=resumo_listas, linhas=sum(x["linhas"] for x in resumo_listas),
                  cartas=len(cartas), copias=sum(c["q"] for c in cartas), nao_encontradas=nao_encontradas,
                  ilegiveis=[r for x in resumo_listas for r in x["ilegiveis"]], sem_cadastro=sem_cadastro,
                  colunas_ignoradas=sorted({c for x in resumo_listas for c in x["colunas_ignoradas"]}), decididas=decididas,
                  sem_preco=sum(1 for c in cartas for cp in c["copias"] if cp["usd"] is None),
                  outro_idioma=sum(1 for c in cartas for cp in c["copias"] if any("preço de referência" in a for a in cp["avisos"])),
                  valor=round(sum(c["valor"] for c in cartas), 2))
    return dict(lido=hoje, regua=R, resumo=resumo, cartas=cartas,
                decks={p: dict(n=d["painel"], c=d["curto"], i=d["ident"], g=d["grupo"], desejo=1 if d["desejo"] else 0,
                               precon=1 if d["precon"] else 0) for p, d in decks.items()})


# ---------------------------------------------------------------- a sugestão, cópia a cópia

def _pct_edh(card, pasta):
    for t in card.get("edh") or []:
        if pasta in t["meu"]:
            return t
    return None


def _frase_edh(card, pasta, decks):
    t = _pct_edh(card, pasta)
    if not t:
        return ""
    return " No EDHREC, %s%% dos decks de %s a jogam." % (fmt(round(t["pct"])), t["n"].split(",")[0])


def _sugerir(card, decks, em_desejo, R):
    """Destino, prioridade e porquê de cada cópia, na ordem das regras; um deck usado por uma cópia sai das seguintes."""
    enc = {e["p"]: e for e in card["enc"]}
    em_deck = {x["p"] for x in card["em_decks"]}
    em_deck_real = {x["p"] for x in card["em_decks"] if not x["desejo"]}
    usados = set()
    gc = bool(card["gc"])
    for cp in card["copias"]:
        preco = cp["usd"]
        marcas = []
        sug = None

        def nome_deck(p):
            return decks[p]["curto"] if p in decks else p

        # 1. radar pede como entra
        cands = [x for x in card["radares"] if x["v"] == "entra" and x["p"] not in em_deck and x["p"] not in usados and _elegivel(decks.get(x["p"]))]
        cands.sort(key=lambda x: -(enc.get(x["p"], {}).get("g") or 0))
        if cands:
            x = cands[0]
            e = enc.get(x["p"], {})
            pq = "O radar do %s já a pede como entra, tier %s" % (nome_deck(x["p"]), x["T"])
            if e:
                pq += "; vale %s lá" % fmt(e["v"])
                if e.get("s"):
                    pq += ", saindo %s" % e["s"]
            sug = dict(d="deck", p=x["p"], P="S", regra=1, pq=pq + "." + _frase_edh(card, x["p"], decks), g=e.get("g"), sai=e.get("s"), T=x["T"], v="entra")
        # 2. ganho com sinergia avaliada a partir do corte de deck
        if not sug:
            fora = {x["p"] for x in card["radares"] if x["v"] == "fora"}
            es = [e for e in card["enc"] if e["a"] and not e["j"] and e["p"] not in usados and e["p"] not in fora
                  and _elegivel(decks.get(e["p"])) and e["g"] >= R["deck_ganho_min"]]
            if es:
                e = es[0]
                forte_ali = (3 in e["sin"] and e["c"]) or gc
                pq = "Rende %s no %s, com a sinergia avaliada lá, saindo %s" % (_sinal(e["g"]), nome_deck(e["p"]), e["s"] or "—")
                if e["c"]:
                    pq += "; cobre %s, abaixo da faixa" % ", ".join(e["c"])
                sug = dict(d="deck", p=e["p"], P="S" if forte_ali else "A", regra=2, pq=pq + "." + _frase_edh(card, e["p"], decks), g=e["g"], sai=e["s"])
                if preco is not None and preco > R["oportunidade_usd"] and e["g"] < R["oportunidade_ganho"]:
                    marcas.append("oportunidade")
        # 3. guardar
        if not sug:
            motivo, ref = None, None
            x = next((x for x in card["radares"] if x["v"] == "avaliar" and x["p"] not in em_deck and x["p"] not in usados and _elegivel(decks.get(x["p"]))), None)
            if x:
                e = enc.get(x["p"], {})
                motivo, ref = "O radar do %s a tem para avaliar, tier %s%s" % (nome_deck(x["p"]), x["T"], ("; rende %s lá" % _sinal(e["g"])) if e else ""), x["p"]
            if not motivo:
                e = next((e for e in card["enc"] if e["a"] and not e["j"] and e["p"] not in usados and _elegivel(decks.get(e["p"]))
                          and R["guardar_ganho_min"] <= e["g"] < R["deck_ganho_min"]), None)
                if e:
                    motivo, ref = "Rende %s no %s, abaixo do corte de deck (%s): guarde para trocar ou para um ajuste" % (_sinal(e["g"]), nome_deck(e["p"]), fmt(R["deck_ganho_min"])), e["p"]
            if not motivo:
                p = next((p for p in em_desejo if p not in usados), None)
                if p:
                    motivo, ref = "Está na lista ou no radar do %s, deck que você ainda quer montar" % nome_deck(p), p
            if not motivo:
                for t in card.get("edh") or []:
                    p = next((p for p in t["meu"] if p not in em_deck and p not in usados and decks.get(p) and not decks[p]["precon"]), None)
                    if p:
                        motivo, ref = "No EDHREC, %s%% dos decks de %s a jogam, e ela não está no seu %s: a sinergia ainda não foi avaliada lá" % (
                            fmt(round(t["pct"])), t["n"].split(",")[0], nome_deck(p)), p
                        break
            if not motivo and card["forte"] and not em_deck_real:
                partes = []
                if gc:
                    partes.append("Game Changer")
                if card["staple"]:
                    partes.append("posição %s no EDHREC" % fmt(card["rank"], 0))
                if card["vp"] >= R["forte_valor_min"]:
                    partes.append("valor próprio %s" % fmt(card["vp"]))
                motivo = "Forte sozinha (%s), sem deck seu que a use" % ", ".join(partes)
            if motivo:
                P = "A" if (preco is not None and preco > R["capital_usd"]) or gc else "B"
                if card["forte"] and preco is not None and preco >= R["venda_usd_min"]:
                    marcas.append("moeda de troca")
                sug = dict(d="guardar", p=ref, P=P, regra=3, pq=motivo + ".")
        # 4. venda
        if not sug and preco is not None and preco >= R["venda_usd_min"]:
            parado = preco >= R["capital_usd"]
            if parado:
                marcas.append("capital parado")
            onde = " (já está em todos os seus decks que a querem)" if em_deck_real else ""
            sug = dict(d="venda", p=None, P="A" if parado else "B", regra=4,
                       pq="Sem casa nos seus decks%s; vale %s%s." % (onde, usd(preco), ": capital parado" if parado else ""))
        # 5 e 6. bundles e bulk
        if not sug:
            if card["vp"] >= R["bundles_valor_min"] or (card["rank"] and card["rank"] <= R["bundles_rank_max"]):
                partes = []
                if card["vp"] >= R["bundles_valor_min"]:
                    partes.append("valor próprio %s" % fmt(card["vp"]))
                if card["rank"] and card["rank"] <= R["bundles_rank_max"]:
                    partes.append("posição %s no EDHREC" % fmt(card["rank"], 0))
                sug = dict(d="bundles", p=None, P="C", regra=5, pq="Mediana hoje (%s): pode servir num deck futuro." % ", ".join(partes))
            elif gc or card["staple"]:
                sug = dict(d="bundles", p=None, P="C", regra=6, pq="Abaixo do corte, mas %s nunca vai para o bulk." % ("Game Changer" if gc else "staple"))
            else:
                sug = dict(d="bulk", p=None, P="C", regra=6, pq="Sem casa nos seus decks, sem força sozinha e %s." % (
                    "abaixo de %s" % usd(R["venda_usd_min"]) if preco is not None else "sem preço no Scryfall"))
        if preco is None:
            marcas.append("sem preço")
        sug["marcas"] = marcas
        if sug.get("p"):
            usados.add(sug["p"])
        cp["sug"] = sug


def _sinal(v):
    return ("+" if v > 0 else "−" if v < 0 else "") + fmt(abs(v))


def _decks_a_avaliar(card, decks):
    """Onde vale avaliar a sinergia antes de decidir: os três primeiros do encaixe, os radares e os decks do dono entre
    os comandantes do EDHREC, sem sinergia avaliada ainda (o ganho desses é um piso). Precon intacto fica de fora."""
    nao_av = {e["p"]: e for e in card["enc"] if not e["a"] and not e["pre"]}
    out = []
    for e in [e for e in card["enc"] if not e["a"] and not e["pre"] and not e["des"]][:3]:
        out.append(e["p"])
    for x in card["radares"]:
        if x["p"] in nao_av and x["p"] not in out:
            out.append(x["p"])
    for t in card.get("edh") or []:
        for p in t["meu"]:
            if p in nao_av and p not in out:
                out.append(p)
    return out


def resumo_destinos(caixa):
    """{(destino, prioridade): [cópias, valor]} e os totais por destino e por prioridade."""
    por_dest = {d: [0, 0.0] for d in DESTINOS}
    por_pri = {p: [0, 0.0] for p in PRIORIDADES}
    cruz = {}
    for c in caixa["cartas"]:
        for cp in c["copias"]:
            s = cp["sug"]
            v = cp["usd"] or 0
            por_dest[s["d"]][0] += 1
            por_dest[s["d"]][1] += v
            por_pri[s["P"]][0] += 1
            por_pri[s["P"]][1] += v
            k = (s["d"], s["P"])
            cruz.setdefault(k, [0, 0.0])
            cruz[k][0] += 1
            cruz[k][1] += v
    return por_dest, por_pri, cruz


# ---------------------------------------------------------------- a página

PASTA_PAG = os.path.join(MOTOR, "caixa")
NOME = "00. Caixa"


def _img(cartas, avisar):
    """id -> data: URI, as imagens do cache reduzidas para imagem_largura px (JPEG imagem_qualidade). Baixa o que faltar."""
    import base64
    import imagens
    from PIL import Image
    R = regua()
    precisam = {}
    for c in cartas:
        if c.get("sid") and c.get("iset"):
            precisam["%s-%s.jpg" % (c["iset"].lower(), str(c["inum"]).lower())] = (c["sid"], "front")
    try:
        imagens.baixar_faltantes(precisam, avisar=lambda *a: None)
    except dados.ErroDeck as e:
        avisar("aviso: imagens: %s" % e)
    out = {}
    for c in cartas:
        if not c.get("iset"):
            continue
        p = os.path.join(imagens.CACHE_IMG, "%s-%s.jpg" % (c["iset"].lower(), str(c["inum"]).lower()))
        if not os.path.exists(p):
            continue
        im = Image.open(p).convert("RGB")
        if im.width > R["imagem_largura"]:
            im = im.resize((R["imagem_largura"], round(im.height * R["imagem_largura"] / im.width)), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=R["imagem_qualidade"], optimize=True, progressive=True)
        out[c["id"]] = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
    return out


def pagina(cx=None, avisar=print, modo_img="embutidas"):
    """(html, cx) da página da Caixa, com o CSS do hub mais o dela e a ordenação pelo cabeçalho do motor comum."""
    import hub, tema
    cx = cx or montar(avisar=avisar)
    R = cx["regua"]
    crit = [dict(k=c["k"], curto=c.get("curto") or c["nome"]) for c in dados.regua()["criterios"] if not c.get("do_deck")]
    dec = ler_decisoes()
    D = dict(lido=cx["lido"], regua=R, resumo=cx["resumo"], cartas=cx["cartas"], decks=cx["decks"], crit=crit,
             dec=dec["cartas"], pastas=[n for n, _ in hub.PASTAS], pastas_com_lista=bool([p for p in dados.ler_pastas() if p.lower() != "caixa"]),
             hub_pub=R.get("hub_publicado"), img=_img(cx["cartas"], avisar) if modo_img == "embutidas" else None)
    pal = tema.paleta({"fundo": "#0f0f10", "painel": "#1b1b1d", "acento": "#f5a524", "acento_claro": "#ffc96b", "texto": "#f2f0ec",
                       "suave": "#bdbab3", "apagado": "#8a877f", "destaque": "#f5a524", "destaque_claro": "#ffc96b"})
    css_fontes, _ = tema.fontes(["Alegreya Sans"])
    root = tema.raiz_css(pal, [], ["--fd:'Alegreya Sans','Segoe UI',system-ui,sans-serif", "--fb:'Alegreya Sans','Segoe UI',system-ui,sans-serif"])
    cores = "".join(".ms-%s{background:%s}" % (k, v) for k, v in
                    (("W", "#f3e7bf"), ("U", "#a9cdf0"), ("B", "#2b2228"), ("R", "#f0a28c"), ("G", "#9fd0a6")))

    def ler(*partes):
        with open(os.path.join(MOTOR, *partes), encoding="utf-8") as f:
            return f.read()
    js = ler("caixa", "app.js").replace("/*__DATA__*/null", json.dumps(D, ensure_ascii=False, separators=(",", ":")))
    js += chr(10) + ler("comum", "ordenar.js")
    css = ler("hub", "style.css") + chr(10) + ler("caixa", "style.css")   # os componentes do hub, mais o que é só da Caixa
    html = (ler("caixa", "template.html").replace("/*__FONTS__*/", css_fontes).replace("/*__ROOT__*/", root + cores)
            .replace("/*__CSS__*/", css).replace("/*__JS__*/", js.replace("</script", "<\\/script")))
    gravar_resumo(cx)
    return html, cx


def atalho():
    from urllib.parse import quote
    alvo = "saidas/" + quote(NOME + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Caixa</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir a Caixa</a></p>\n</body>\n</html>\n') % (alvo, alvo)


def main():
    import argparse, sys
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    ap = argparse.ArgumentParser(description="A Caixa: leitura, conta e resumo.")
    ap.add_argument("--sem-rede", action="store_true", help="não consulta o EDHREC (usa só o cache)")
    a = ap.parse_args()
    cx = montar(rede=not a.sem_rede)
    r = cx["resumo"]
    print("Caixa: %d linhas, %d cartas, %d cópias, %s" % (r["linhas"], r["cartas"], r["copias"], usd(r["valor"])))
    print("não encontradas: %d | sem cadastro: %d | sem preço: %d | colunas ignoradas: %s" % (
        len(r["nao_encontradas"]), len(r["sem_cadastro"]), r["sem_preco"], ", ".join(r["colunas_ignoradas"]) or "nenhuma"))
    por_dest, por_pri, _ = resumo_destinos(cx)
    for d in DESTINOS:
        print("  %-8s %3d cópias  %s" % (NOME_DESTINO[d], por_dest[d][0], usd(por_dest[d][1])))
    for p in PRIORIDADES:
        print("  %s %3d cópias  %s" % (p, por_pri[p][0], usd(por_pri[p][1])))


if __name__ == "__main__":
    main()
