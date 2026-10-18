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
import csv, datetime, hashlib, io, json, os, re, statistics
import dados, edhrec, encaixe, prenota, scryfall

MOTOR = os.path.dirname(os.path.abspath(__file__))
REGUA_ARQ = os.path.join(MOTOR, "caixa.json")
DESTINOS = ["deck", "guardar", "venda", "bundles", "bulk"]
NOME_DESTINO = {"deck": "Deck", "guardar": "Guardar", "venda": "Venda", "bundles": "Bundles", "bulk": "Bulk", "remover": "Remover"}
CAIXA = "Caixa"   # a origem padrão; as outras são as pastas com lista em dados/pastas/<pasta>.txt
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


def _arq_marcas():
    return os.path.join(dados.DADOS, "pastas", "marcas.json")


def _ler_marcas():
    """dados/pastas/marcas.json: {pasta: {chave do nome: {"pet": true}}}, as cartas de estimação de cada pasta."""
    try:
        with open(_arq_marcas(), encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def ler_traducoes():
    """dados/traducoes.json: {"cartas": {nome: {"pt", "h", "fonte", "em"}}}, a tradução livre do texto oficial, só para ler.
    "h" é a marca (sha1, 8 primeiros) do texto em inglês que foi traduzido: se o Scryfall mudar o texto, a tradução fica velha."""
    try:
        with open(os.path.join(dados.DADOS, "traducoes.json"), encoding="utf-8") as f:
            return json.load(f).get("cartas") or {}
    except (OSError, ValueError):
        return {}


def marca_texto(fx):
    return hashlib.sha1((fx or "").encode("utf-8")).hexdigest()[:8]


def link_publicado(base=None):
    try:
        with open(os.path.join(pasta_caixa(base), "link.txt"), encoding="utf-8") as f:
            return f.read().strip() or None
    except OSError:
        return None


# ---------------------------------------------------------------- decisões

def _arq_decisoes(base=None, origem=None):
    if origem and origem != CAIXA:
        return os.path.join(dados.DADOS, "pastas", "decisoes.json")
    return os.path.join(pasta_caixa(base), "decisoes.json")


def ler_decisoes(base=None, origem=None):
    """As decisões de uma origem: a Caixa (dados/caixa/decisoes.json) ou uma pasta (dados/pastas/decisoes.json, por pasta)."""
    p = _arq_decisoes(base, origem)
    try:
        with open(p, encoding="utf-8") as f:
            d = json.load(f)
    except (OSError, ValueError):
        d = {}
    if origem and origem != CAIXA:
        d = (d.get("pastas") or {}).get(origem) or {"versao": 2, "cartas": {}}
    if d.get("versao") != 2:   # a semente era v1, {"versao": 1, "cartas": {}}
        cartas = {}
        for n, v in (d.get("cartas") or {}).items():
            cartas[n] = {"copias": v.get("copias") if isinstance(v, dict) and "copias" in v else ([v] if isinstance(v, dict) else [])}
        d = {"versao": 2, "cartas": cartas}
    return d


def gravar_decisoes(d, base=None, origem=None):
    p = _arq_decisoes(base, origem)
    if origem and origem != CAIXA:
        try:
            with open(p, encoding="utf-8") as f:
                todas = json.load(f)
        except (OSError, ValueError):
            todas = {"versao": 2, "pastas": {}}
        todas.setdefault("pastas", {})[origem] = d
        d = todas
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(d, ensure_ascii=False, indent=1) + "\n")


def origens(base=None):
    """A Caixa (se tem listas) e cada pasta com lista não vazia em dados/pastas/<pasta>.txt."""
    out = []
    if os.path.isdir(os.path.join(pasta_caixa(base), "listas")):
        out.append(CAIXA)
    pf = os.path.join(dados.DADOS, "pastas")
    for f in sorted(os.listdir(pf)) if os.path.isdir(pf) else []:
        if f.lower().endswith(".txt") and os.path.getsize(os.path.join(pf, f)) > 0:
            out.append(f[:-4])
    return out


def colecao(origem):
    """A coleção do banco da página publicada: "decisoes" para a Caixa, "decisoes-<pasta>" para cada pasta."""
    return "decisoes" if not origem or origem == CAIXA else "decisoes-" + chave_id(origem)


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

# critério da v3 e o quadro do 8×8 com o mesmo papel, pela chave do agrupamento (os de tema não têm par)
CRIT_8X8 = {"draw": "draw", "remocao": "removal", "aceleradores": "ramp", "evasao": "evasao", "recurso": "recursao"}


def _perfil_deck(m):
    """O que a gaveta mostra de um deck ao lado de cada carta: quantas cartas têm nota 2 ou 3 em cada critério da v3 (a mesma
    conta da saturação), os quadros do 8×8 ligados a um critério (cartas no quadro e a referência, 8 a 8 quando o agrupamento
    não tem faixa) e o valor mediano de cada tier, para estimar o tier de uma carta que o deck ainda não avaliou.
    O quadro de cada carta segue o painel: o pacote fixado, ou o agrupamento de maior nota (empate: o primeiro da ordem);
    terreno, carta com terreno no verso e comandante ficam fora."""
    gs = m.get("grupos") or []
    caixas = {g["k"]: 0 for g in gs}
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
    pk = {}
    for ck, gk in CRIT_8X8.items():
        g = next((g for g in gs if g["k"] == gk), None)
        if g:
            ref = g.get("ref") or [8, 8]
            pk[ck] = [g["nome"], caixas[gk], ref[0], ref[1]]
    vals = {}
    for c in m["cards"]:
        if not c.get("cmd") and not c.get("land") and c.get("tier"):
            vals.setdefault(c["tier"], []).append(encaixe.valor(c["s3"]))
    return dict(nc=encaixe.contexto(m)["ncrit"], pk=pk, med={t: statistics.median(v) for t, v in vals.items()})


def _tier_estimado(v, med):
    """O tier de uma carta que o deck não avaliou, pelo valor dela contra o valor mediano de cada tier do deck. No máximo A:
    S só com avaliação (o que também guarda a regra dos tribais, S só para carta da tribo)."""
    presentes = [t for t in ("A", "B", "C", "D") if t in med]
    for t in presentes:
        if v >= med[t]:
            return t
    return presentes[-1] if presentes else None


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


def montar(avisar=print, base=None, rede=True, fonte_edhrec=None, origem=None):
    """A Caixa inteira, pronta para o teste e para a página. base: outra pasta no lugar de dados/caixa (testes).
    fonte_edhrec(nome) substitui a leitura do EDHREC (testes, sem rede). origem: uma pasta (dados/pastas/<pasta>.txt)
    no lugar da caixa: as mesmas contas e decisões para as cartas daquela pasta."""
    R = regua()
    hoje = datetime.date.today().isoformat()
    origem = origem or CAIXA
    if origem == CAIXA:
        copias, resumo_listas = ler_listas(base)
    else:
        arq = os.path.join(dados.DADOS, "pastas", origem + ".txt")
        copias, ign, ruins = ler_txt(arq)
        for c in copias:
            c["lista"] = origem + ".txt"
        for x in ruins:
            x["lista"] = origem + ".txt"
        resumo_listas = [dict(arquivo=origem + ".txt", formato="txt", linhas=len(copias) + len(ruins), copias=sum(c["q"] for c in copias),
                              colunas_ignoradas=[], ilegiveis=ruins)]
    _resolver_ids(copias, avisar)
    achados = _buscar(copias, avisar) if copias else {}
    cad = dados.ler_cadastro()
    ks = encaixe._regua()[1]
    decks = info_decks()
    ds_v3 = encaixe.decks_v3()
    perfis = {m["pasta"]: _perfil_deck(m) for m in ds_v3}
    pastas_fis = {p: v for p, v in dados.ler_pastas().items() if p != origem}
    compras = _ler_compras(base)
    dec = ler_decisoes(base, origem)
    pet = (_ler_marcas().get(origem) or {}) if origem != CAIXA else {}
    trad = ler_traducoes()
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
        aplicadas = [x for x in ds_c if x.get("aplicado")] if origem == CAIXA else []
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
            av = ((d.get("m") or {}).get("avaliadas") or {}).get(nome)
            sin = [x["s3"][0], x["s3"][1]] if x and x.get("s3") else list(av["sin"]) if av else [0, 0]
            T = x.get("tier") if x else None   # o tier do deck ou do radar; sem ele, estimado pelo valor (com "~")
            if not T and g["deck"] in perfis:
                te = _tier_estimado(encaixe.valor(sin + s8), perfis[g["deck"]]["med"])
                T = "~" + te if te else None
            enc.append(dict(p=g["deck"], n=g["painel"], g=g["ganho"], v=g["valor"], s=g["sai"], vs=g["valor_sai"], c=g["cobre"], T=T,
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
                    sid=r.get("id"), iset=r.get("set"), inum=r.get("num"), image=r.get("image", True), pet=1 if pet.get(ch) else 0)
        t = trad.get(nome)
        if t and t.get("pt"):
            card["tx"] = {"pt": t["pt"]}
            if t.get("h") != marca_texto(card["fx"]):
                card["tx"]["velha"] = 1
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
    return dict(lido=hoje, regua=R, resumo=resumo, cartas=cartas, origem=origem,
                decks={p: dict(n=d["painel"], c=d["curto"], i=d["ident"], g=d["grupo"], desejo=1 if d["desejo"] else 0,
                               precon=1 if d["precon"] else 0, **({"nc": perfis[p]["nc"], "pk": perfis[p]["pk"]} if p in perfis else {}))
                       for p, d in decks.items()})


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
        tr = []   # o caminho pelas regras: por que cada regra anterior não serviu (a gaveta mostra)

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
            sug = dict(d="deck", p=x["p"], P="S", regra=1, pq=pq + "." + _frase_edh(card, x["p"], decks), g=e.get("g"), sai=e.get("s"), T=x["T"], v="entra",
                       pp="S: o radar do deck já pede a carta.")
        else:
            tr.append([1, "Radar", _nao_radar(card, "entra", em_deck, usados, decks, nome_deck)])
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
                sug = dict(d="deck", p=e["p"], P="S" if forte_ali else "A", regra=2, pq=pq + "." + _frase_edh(card, e["p"], decks), g=e["g"], sai=e["s"],
                           pp="S: Game Changer." if gc else "S: sinergia 3 no deck e cobre um critério abaixo da faixa." if forte_ali else
                           "A: rende no deck, mas sem sinergia 3 que cubra um critério abaixo da faixa (isso daria S).")
                if preco is not None and preco > R["oportunidade_usd"] and e["g"] < R["oportunidade_ganho"]:
                    marcas.append("oportunidade")
            else:
                av = [e for e in card["enc"] if e["a"] and not e["j"] and _elegivel(decks.get(e["p"]))]
                if not av:
                    t = "nenhum deck seu avaliou a sinergia dela; sem avaliação, o ganho é só um piso e não leva a Deck"
                else:
                    e = max(av, key=lambda e: e["g"])
                    if e["g"] < R["deck_ganho_min"]:
                        t = "o maior ganho com a sinergia avaliada é %s no %s, abaixo do corte de %s" % (_sinal(e["g"]), nome_deck(e["p"]), fmt(R["deck_ganho_min"]))
                    elif e["p"] in usados:
                        t = "rende %s no %s, mas a cópia anterior já vai para lá" % (_sinal(e["g"]), nome_deck(e["p"]))
                    else:
                        t = "rende %s no %s, mas o radar de lá a deixa de fora" % (_sinal(e["g"]), nome_deck(e["p"]))
                tr.append([2, "Ganho num deck", t])
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
                pp = ("A: Game Changer." if gc else "A: vale mais de %s." % usd(R["capital_usd"])) if P == "A" else \
                    "B: vale até %s e não é Game Changer (mais cara, ou Game Changer, seria A)." % usd(R["capital_usd"])
                sug = dict(d="guardar", p=ref, P=P, regra=3, pq=motivo + ".", pp=pp)
            else:
                tr.append([3, "Guardar", _nao_guardar(card, em_deck, em_deck_real, em_desejo, usados, decks, nome_deck, R)])
        # 4. venda
        if not sug and preco is not None and preco >= R["venda_usd_min"]:
            parado = preco >= R["capital_usd"]
            if parado:
                marcas.append("capital parado")
            onde = " (já está em todos os seus decks que a querem)" if em_deck_real else ""
            sug = dict(d="venda", p=None, P="A" if parado else "B", regra=4,
                       pq="Sem casa nos seus decks%s; vale %s%s." % (onde, usd(preco), ": capital parado" if parado else ""),
                       pp="A: %s ou mais, capital parado." % usd(R["capital_usd"]) if parado else "B: entre %s e %s (a partir de %s seria A)." % (
                           usd(R["venda_usd_min"]), usd(R["capital_usd"]), usd(R["capital_usd"])))
        elif not sug:
            tr.append([4, "Venda", "vale %s, abaixo de %s" % (usd(preco), usd(R["venda_usd_min"])) if preco is not None else "sem preço no Scryfall"])
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
                tr.append([5, "Bundles", "força sozinha %s, abaixo de %s%s, e %s" % (
                    fmt(card["vp"]), fmt(R["bundles_valor_min"]), " (pré-nota automática, a revisar)" if card["cad_auto"] else "",
                    "posição %s no EDHREC, fora do top %s" % (fmt(card["rank"], 0), fmt(R["bundles_rank_max"], 0)) if card["rank"] else "fora do ranking do EDHREC")])
                sug = dict(d="bulk", p=None, P="C", regra=6, pq="Sem casa nos seus decks, sem força sozinha e %s." % (
                    "abaixo de %s" % usd(R["venda_usd_min"]) if preco is not None else "sem preço no Scryfall"))
        if preco is None:
            marcas.append("sem preço")
        sug["marcas"] = marcas
        sug["tr"] = tr
        sug.setdefault("pp", "C: Bundles e Bulk são sempre prioridade C.")
        if sug.get("p"):
            usados.add(sug["p"])
        cp["sug"] = sug


def _nao_radar(card, v, em_deck, usados, decks, nome_deck):
    """Por que nenhum radar levou a carta (v: "entra" ou "avaliar")."""
    pq = []
    for x in card["radares"]:
        if x["v"] != v:
            continue
        if x["p"] in em_deck:
            m = "ela já está no deck"
        elif x["p"] in usados:
            m = "a cópia anterior já vai para lá"
        elif not _elegivel(decks.get(x["p"])):
            m = "é deck Desejo ou precon intacto, que não recebe carta"
        else:
            continue
        pq.append("o radar do %s a tem como %s, mas %s" % (nome_deck(x["p"]), v, m))
    return "; ".join(pq) or "nenhum radar a tem como %s" % v


def _nao_guardar(card, em_deck, em_deck_real, em_desejo, usados, decks, nome_deck, R):
    """Por que a carta não ficou para guardar: as cinco condições da regra 3, uma a uma."""
    partes = [_nao_radar(card, "avaliar", em_deck, usados, decks, nome_deck)]
    partes.append("nenhum ganho avaliado entre %s e %s" % (fmt(R["guardar_ganho_min"]), fmt(R["deck_ganho_min"])))
    partes.append("não está na lista nem no radar de um deck Desejo" if not em_desejo else "o deck Desejo já recebeu a cópia anterior")
    if card.get("edh") is None:
        partes.append("sem a página dela no EDHREC")
    else:
        partes.append("nenhum deck seu entre os %s comandantes que mais a jogam no EDHREC, com %s%% ou mais" % (R["edhrec_top"], fmt(R["edhrec_pct_min"])))
    if card["forte"]:
        partes.append("é forte sozinha, mas já está no seu " + ", ".join(sorted(nome_deck(p) for p in em_deck_real)))
    else:
        f = ["força sozinha %s, abaixo de %s%s" % (fmt(card["vp"]), fmt(R["forte_valor_min"]), " (pré-nota automática, a revisar)" if card["cad_auto"] else "")]
        f.append("posição %s no EDHREC, fora do top %s" % (fmt(card["rank"], 0), fmt(R["staple_rank_max"], 0)) if card["rank"] else "fora do ranking do EDHREC")
        f.append("não é Game Changer")
        partes.append("não é forte sozinha (" + "; ".join(f) + ")")
    return "; ".join(partes)


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
    crit10 = [[c["k"], c.get("curto") or c["nome"], c["faixa"][0], c["faixa"][1]] for c in dados.regua()["criterios"]]   # os dez, com a faixa
    # a Caixa e cada pasta com lista: as mesmas contas e decisões, uma origem por vez na tela
    lista = [cx] + [montar(avisar=avisar, origem=o) for o in origens() if o != CAIXA]
    todas = [c for x in lista for c in x["cartas"]]
    ors = [dict(k=x["origem"], col=colecao(x["origem"]), resumo=x["resumo"], cartas=x["cartas"], dec=ler_decisoes(origem=x["origem"])["cartas"]) for x in lista]
    D = dict(lido=cx["lido"], regua=R, origens=ors, decks=cx["decks"], crit=crit, crit10=crit10,
             pastas=[n for n, _ in hub.PASTAS], pastas_com_lista=bool([p for p in dados.ler_pastas() if p != CAIXA]),
             hub_pub=R.get("hub_publicado"), img=_img(todas, avisar) if modo_img == "embutidas" else None)
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


# ---------------------------------------------------------------- o /caixa: avaliar a sinergia e aplicar as decisões

def _ler_av(pasta):
    p = os.path.join(dados.DADOS, pasta, "avaliacao.json")
    with open(p, encoding="utf-8") as f:
        bruto = f.read()
    m = re.match(r"\{\n( +)\"", bruto)
    return p, json.loads(bruto), (len(m.group(1)) if m else 1), bruto.endswith("\n")


def dossie_avaliar(cx, decks_filtro=None):
    """Os pares (carta, deck) sem sinergia avaliada, para o /caixa avaliar: o texto da carta (Scryfall) e a régua das duas
    sinergias de cada deck (tema.json). decks_filtro: só estes decks."""
    out = {}
    for c in cx["cartas"]:
        # com decks escolhidos: toda carta nas cores deles ainda sem sinergia avaliada (a vista "Para o deck");
        # sem escolha: os "decks a avaliar" de cada carta (os três primeiros do encaixe, os radares e o EDHREC)
        alvos = [e["p"] for e in c["enc"] if e["p"] in decks_filtro and not e["a"] and not e["j"] and not e["pre"]] if decks_filtro else c["avaliar"]
        for p in alvos:
            t = dados.ler_json(os.path.join(dados.DADOS, p, "tema.json"), obrigatorio=False) or {}
            sins = (t.get("sinergias") or {})
            d = out.setdefault(p, dict(deck=p, sinergias={k: dict(nome=v.get("nome"), regra=v.get("regra")) for k, v in sins.items() if k in ("sin1", "sin2")}, cartas=[]))
            e = next((x for x in c["enc"] if x["p"] == p), {})
            d["cartas"].append(dict(nome=c["n"], custo=c["cost"], tipo=c["line"], texto=c["fx"], ganho_piso=e.get("g"), sai=e.get("s")))
    return out


def traducoes_faltando(cxs):
    """As cartas da Caixa e das pastas sem tradução, ou com tradução de um texto que o Scryfall já mudou: {nome: {tipo, custo, texto}}."""
    trad, out = ler_traducoes(), {}
    for cx in cxs:
        for c in cx["cartas"]:
            t = trad.get(c["n"])
            if c["fx"].strip() and (not t or t.get("h") != marca_texto(c["fx"])):
                out[c["n"]] = dict(tipo=c["line"], custo=c["cost"], texto=c["fx"])
    return out


def gravar_traducoes(arquivo, cxs, hoje=None):
    """Grava em dados/traducoes.json as traduções de um JSON {nome: texto em português}, com a marca do texto em inglês de hoje.
    Só cartas da Caixa ou das pastas (é de lá que vem o texto em inglês); devolve os nomes gravados."""
    hoje = hoje or datetime.date.today().isoformat()
    with open(arquivo, encoding="utf-8") as f:
        novas = json.load(f)
    fx = {c["n"]: c["fx"] for cx in cxs for c in cx["cartas"]}
    fora = [n for n in novas if n not in fx]
    if fora:
        raise SystemExit("fora da Caixa e das pastas: " + ", ".join(fora))
    arq = os.path.join(dados.DADOS, "traducoes.json")
    try:
        with open(arq, encoding="utf-8") as f:
            tudo = json.load(f)
    except (OSError, ValueError):
        tudo = {"versao": 1, "cartas": {}}
    for n, t in novas.items():
        if not str(t).strip():
            raise SystemExit("tradução vazia: " + n)
        tudo["cartas"][n] = {"pt": str(t).strip(), "h": marca_texto(fx[n]), "fonte": "claude", "em": hoje}
    tudo["cartas"] = dict(sorted(tudo["cartas"].items()))
    with open(arq, "w", encoding="utf-8", newline="\n") as f:
        json.dump(tudo, f, ensure_ascii=False, indent=1)
    return sorted(novas)


def gravar_avaliadas(arquivo, hoje=None):
    """{pasta: {carta: {"sin": {...}, "sin_por_que": {...}}}} -> chave "avaliadas" do avaliacao.json de cada deck (no lugar,
    preservando o recuo). Carta que já está no deck ou no radar não entra: lá ela já tem sinergia."""
    hoje = hoje or datetime.date.today().isoformat()
    with open(arquivo, encoding="utf-8") as f:
        novo = json.load(f)
    feitos = []
    for pasta, cartas in novo.items():
        p, av, ind, nl = _ler_av(pasta)
        ja = {n.split(" // ")[0] for n in list((av.get("cartas") or {})) + list((av.get("radar") or {}))}
        alvo = av.setdefault("avaliadas", {})
        for n, x in cartas.items():
            if n.split(" // ")[0] in ja:
                continue
            alvo[n] = dict(sin={k: v for k, v in (x.get("sin") or {}).items() if v}, sin_por_que={k: v for k, v in (x.get("sin_por_que") or {}).items() if v},
                           em=hoje, fonte="caixa")
            feitos.append((pasta, n))
        dados.ler_avaliadas(av)   # recusa nota fora da régua antes de gravar
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(av, ensure_ascii=False, indent=ind) + ("\n" if nl else ""))
    return feitos


def importar_banco(arquivo, base=None, origem=None):
    """Documentos de uma coleção de decisões do banco da Caixa publicada (lista ou {id: doc}) -> decisões da origem; o banco
    prevalece. Coleção "decisoes" para a Caixa, "decisoes-<pasta>" para cada pasta (colecao())."""
    with open(arquivo, encoding="utf-8") as f:
        j = json.load(f)
    docs = j.values() if isinstance(j, dict) else j
    dec = ler_decisoes(base, origem)
    n = 0
    for d in docs:
        d = d.get("data", d) if isinstance(d, dict) else d
        if isinstance(d, dict) and d.get("n"):
            dec["cartas"][d["n"]] = {"copias": d.get("copias") or []}
            n += 1
    gravar_decisoes(dec, base, origem)
    return n


def _linha(nome, imp, acab):
    s_, _, num = (imp or "").partition(" ")
    return "1 %s%s%s" % (nome, (" (%s) %s" % (s_, num)) if s_ and num else "", " *F*" if acab == "foil" else " E" if acab == "etched" else "")


def _tirar_da_pasta(pasta, nome, imp, acab):
    """Tira uma cópia de dados/pastas/<pasta>.txt: a linha da mesma impressão e acabamento (ou a primeira do nome), e
    desconta 1 se a linha tem quantidade maior. Devolve True se achou."""
    arq = os.path.join(dados.DADOS, "pastas", pasta + ".txt")
    try:
        with open(arq, encoding="utf-8") as f:
            linhas = f.read().split("\n")
    except OSError:
        return False
    alvo = dados.chave_nome(nome)
    s_, _, num = (imp or "").partition(" ")
    cand = []
    for i, l in enumerate(linhas):
        m = dados.LINHA.match(l.strip())
        if not m or dados.chave_nome(m.group(2)) != alvo:
            continue
        flags = {x.strip("*").upper() for x in (m.group(5) or "").split()}
        a = "etched" if "E" in flags else "foil" if "F" in flags else "normal"
        mesma = (m.group(3) or "").upper() == s_.upper() and (m.group(4) or "") == num and a == acab
        cand.append((0 if mesma else 1, i, m))
    if not cand:
        return False
    _, i, m = sorted(cand)[0]
    q = int(m.group(1))
    linhas[i] = "" if q <= 1 else str(q - 1) + linhas[i].strip()[len(m.group(1)):]
    with open(arq, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(l for l in linhas if l.strip()) + "\n")
    return True


def aplicar(base=None, hoje=None, origem=None):
    """Executa as decisões ainda não aplicadas de uma origem: Guardar e Venda -> dados/pastas/<pasta>.txt; Bundles e Bulk
    -> dados/caixa/bundles.txt e bulk.txt; Remover -> a cópia só sai. Vinda de uma pasta, a cópia sai também do arquivo
    daquela pasta. Pet card fica marcado em dados/pastas/marcas.json. As de Deck ficam para o /caixa pôr no radar
    (julgamento: notas, tier, quem sai) e marcar com --marcar. Nenhuma decklist muda; as listas da caixa nunca são editadas."""
    hoje = hoje or datetime.date.today().isoformat()
    origem = origem or CAIXA
    dec = ler_decisoes(base, origem)
    pasta_fis = os.path.join(dados.DADOS, "pastas")
    marcas = _ler_marcas()
    feitos, deck = [], []
    for nome, v in dec["cartas"].items():
        for x in v.get("copias") or []:
            if x.get("aplicado") or not x.get("destino"):
                continue
            d = x["destino"]
            if d == "deck":
                deck.append(dict(n=nome, deck=x.get("deck"), imp=x.get("imp"), acab=x.get("acab", "normal"), origem=origem))
                continue
            if d in ("guardar", "venda") and not x.get("pasta"):
                continue
            if d in ("guardar", "venda") and x["pasta"] == origem:
                x["aplicado"] = hoje   # fica onde está
                feitos.append((nome, d, origem + ", fica"))
                continue
            if origem != CAIXA and not _tirar_da_pasta(origem, nome, x.get("imp"), x.get("acab", "normal")):
                continue
            if d != "remover":
                if d in ("guardar", "venda"):
                    os.makedirs(pasta_fis, exist_ok=True)
                    arq = os.path.join(pasta_fis, x["pasta"] + ".txt")
                else:
                    arq = os.path.join(pasta_caixa(base), d + ".txt")
                with open(arq, "a", encoding="utf-8", newline="\n") as f:
                    f.write(_linha(nome, x.get("imp"), x.get("acab", "normal")) + "\n")
                if x.get("pet") and d in ("guardar", "venda"):
                    marcas.setdefault(x["pasta"], {})[dados.chave_nome(nome)] = {"pet": True}
            x["aplicado"] = hoje
            feitos.append((nome, d, x.get("pasta") or ("" if d == "remover" else d)))
    gravar_decisoes(dec, base, origem)
    if marcas != _ler_marcas():
        os.makedirs(pasta_fis, exist_ok=True)
        with open(_arq_marcas(), "w", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(marcas, ensure_ascii=False, indent=1) + "\n")
    if feitos:
        _historico(["%s%s → %s%s" % (nome, "" if origem == CAIXA else " (da pasta %s)" % origem, NOME_DESTINO[d], " (%s)" % onde if onde else "")
                    for nome, d, onde in feitos], hoje, base)
    return feitos, deck


def marcar(nome, imp, acab="normal", base=None, hoje=None, origem=None):
    """Marca como aplicada uma cópia de destino Deck, depois de a carta entrar no radar do deck como "avaliar"; vinda de
    uma pasta, a cópia sai também do arquivo da pasta."""
    hoje = hoje or datetime.date.today().isoformat()
    origem = origem or CAIXA
    dec = ler_decisoes(base, origem)
    for x in (dec["cartas"].get(nome) or {}).get("copias") or []:
        if x.get("destino") == "deck" and not x.get("aplicado") and x.get("imp") == imp and x.get("acab", "normal") == acab:
            if origem != CAIXA:
                _tirar_da_pasta(origem, nome, imp, acab)
            x["aplicado"] = hoje
            gravar_decisoes(dec, base, origem)
            _historico(["%s → radar do %s, para avaliar" % (nome, x.get("deck"))], hoje, base)
            return True
    return False


def _historico(linhas, hoje, base=None):
    p = os.path.join(pasta_caixa(base), "HISTORICO.md")
    novo = not os.path.exists(p)
    with open(p, "a", encoding="utf-8", newline="\n") as f:
        if novo:
            f.write("# Caixa: histórico\n\nO que saiu da caixa, decisão a decisão (/caixa aplicar).\n")
        f.write("\n## %s\n\n" % "/".join(reversed(hoje.split("-"))) + "".join("- %s\n" % l for l in linhas))


def main():
    import argparse, sys
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    ap = argparse.ArgumentParser(description="A Caixa: leitura, conta e resumo; e os passos mecânicos do /caixa.")
    ap.add_argument("--sem-rede", action="store_true", help="não consulta o EDHREC (usa só o cache)")
    ap.add_argument("--avaliar", metavar="ARQUIVO", help="grava o dossiê dos pares carta e deck a avaliar")
    ap.add_argument("--decks", nargs="*", help="com --avaliar: só estes decks")
    ap.add_argument("--gravar-avaliadas", metavar="ARQUIVO", help="grava as sinergias aprovadas na chave avaliadas dos decks")
    ap.add_argument("--importar-banco", metavar="ARQUIVO", help="traz as decisões do banco da Caixa publicada para decisoes.json")
    ap.add_argument("--aplicar", action="store_true", help="executa Guardar, Venda, Bundles e Bulk; lista as de Deck")
    ap.add_argument("--marcar", nargs=3, metavar=("CARTA", "IMPRESSAO", "ACABAMENTO"), help="marca uma cópia de Deck como aplicada")
    ap.add_argument("--traducoes-faltando", metavar="ARQUIVO", help="grava as cartas da Caixa e das pastas que ainda não têm tradução")
    ap.add_argument("--gravar-traducoes", metavar="ARQUIVO", help="grava em dados/traducoes.json as traduções de um JSON {nome: texto}")
    ap.add_argument("--origem", help="uma pasta (dados/pastas/<pasta>.txt) no lugar da Caixa, para --importar-banco, --aplicar e --marcar")
    a = ap.parse_args()
    if a.gravar_avaliadas:
        for p, n in gravar_avaliadas(a.gravar_avaliadas):
            print("avaliada: %s em %s" % (n, p))
        return
    if a.importar_banco:
        print("decisões do banco copiadas (%s): %d cartas" % (a.origem or CAIXA, importar_banco(a.importar_banco, origem=a.origem)))
        return
    if a.aplicar:
        feitos, deck = aplicar(origem=a.origem)
        for n, d, onde in feitos:
            print("aplicada: %s -> %s (%s)" % (n, NOME_DESTINO[d], onde))
        for x in deck:
            print("deck, a pôr no radar: %s -> %s (%s, %s)" % (x["n"], x["deck"], x["imp"], x["acab"]))
        return
    if a.marcar:
        print("marcada" if marcar(*a.marcar, origem=a.origem) else "nenhuma cópia de Deck pendente com essa impressão e acabamento")
        return
    cx = montar(rede=not a.sem_rede)
    if a.traducoes_faltando or a.gravar_traducoes:
        cxs = [cx] + [montar(rede=False, origem=o) for o in origens() if o != CAIXA]
        if a.gravar_traducoes:
            print("traduções gravadas: %d" % len(gravar_traducoes(a.gravar_traducoes, cxs)))
        else:
            d = traducoes_faltando(cxs)
            with open(a.traducoes_faltando, "w", encoding="utf-8") as f:
                json.dump(d, f, ensure_ascii=False, indent=1)
            print("sem tradução: %d cartas" % len(d))
        return
    if a.avaliar:
        d = dossie_avaliar(cx, a.decks)
        with open(a.avaliar, "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=1)
        print("dossiê: %d decks, %d pares carta e deck" % (len(d), sum(len(x["cartas"]) for x in d.values())))
        return
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
