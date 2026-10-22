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
    # do export do ManaBox: selos e o preço do cadastro (só na gaveta, nunca em regra nem em soma)
    "proxy": ["proxy"],
    "signed": ["signed", "assinada"],
    "altered": ["altered", "alterada"],
    "misprint": ["misprint"],
    "rar": ["rarity", "raridade"],
    "compra": ["purchase price", "preco de compra"],
    "moeda": ["purchase price currency", "moeda"],
    "added": ["added", "adicionada"],
}
SELOS = {"signed": "assinada", "altered": "alterada", "misprint": "misprint"}
RARIDADE = {"common": "comum", "uncommon": "incomum", "rare": "rara", "mythic": "mítica", "special": "especial", "bonus": "bônus"}


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


def _sim(v):
    return _sem_acento(v or "") in ("true", "1", "sim", "yes", "s", "verdadeiro", "x")


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
        compra = None
        try:
            if g("compra"):
                compra = dict(v=float(g("compra").replace(",", ".")), moeda=(g("moeda") or "").upper() or None, em=g("added")[:10] or None)
        except ValueError:
            compra = None
        out.append(dict(linha=n, orig=sep.join(row), q=q, nome=nome, set=g("set").upper() or None, num=g("num") or None,
                        acab=_acabamento(g("foil"), g("acab")), id=g("id") or None, idioma=(g("idioma") or "en").lower(),
                        cond=g("cond") or None, proxy=_sim(g("proxy")), selos=[v for k, v in SELOS.items() if _sim(g(k))],
                        rar=RARIDADE.get(g("rar").lower(), g("rar").lower() or None), compra=compra,
                        ent=(g("added")[:10] if re.match(r"\d{4}-\d{2}-\d{2}", g("added")) else None)))
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


def data_do_arquivo(caminho):
    """A data de entrada de uma lista sem data por carta: a do nome do arquivo ("03. lote 22-10.txt", com o ano do arquivo), senão o
    dia em que o arquivo entrou no projeto (Git), senão a data do arquivo."""
    mt = datetime.date.fromtimestamp(os.path.getmtime(caminho))
    m = re.search(r"(?<!\d)(\d{1,2})[-_.](\d{1,2})(?:[-_.](\d{2,4}))?(?!\d)", os.path.basename(caminho).split(".", 1)[-1])
    if m:
        dia, mes = int(m.group(1)), int(m.group(2))
        ano = int(m.group(3)) if m.group(3) else mt.year
        ano = ano + 2000 if ano < 100 else ano
        try:
            return datetime.date(ano, mes, dia).isoformat()
        except ValueError:
            pass
    try:
        import subprocess
        r = subprocess.run(["git", "log", "--diff-filter=A", "--format=%ad", "--date=short", "--", caminho], cwd=dados.RAIZ,
                           capture_output=True, text=True, timeout=10)
        d = (r.stdout or "").strip().splitlines()
        if d:
            return d[-1]
    except (OSError, ValueError, subprocess.SubprocessError):
        pass
    return mt.isoformat()


def _ler_arquivos(caminhos, nome_de):
    """(cópias, resumo) de uma lista de arquivos .csv e .txt somados; nome_de(caminho) é o nome que a tela mostra."""
    copias, resumo = [], []
    for p in caminhos:
        ext = os.path.splitext(p)[1].lower()
        if ext == ".csv":
            cs, ign, ruins = ler_csv(p)
        elif ext == ".txt":
            cs, ign, ruins = ler_txt(p)
        else:
            continue
        arq = nome_de(p)
        ent = None
        for c in cs:
            c["lista"] = arq
            if not c.get("ent"):   # sem data por carta (texto, ou CSV sem a coluna Added): a data da lista
                ent = ent or data_do_arquivo(p)
                c["ent"] = ent
        for r in ruins:
            r["lista"] = arq
        copias += cs
        resumo.append(dict(arquivo=arq, formato=ext[1:], linhas=len(cs) + len(ruins), copias=sum(c["q"] for c in cs),
                           colunas_ignoradas=ign, ilegiveis=ruins))
    return copias, resumo


def ler_listas(base=None):
    """Todas as listas de dados/caixa/listas/, com o resumo da importação de cada uma."""
    d = os.path.join(pasta_caixa(base), "listas")
    return _ler_arquivos([os.path.join(d, a) for a in sorted(os.listdir(d))] if os.path.isdir(d) else [], os.path.basename)


def pastas_lista():
    """As pastas com lista: cada subpasta de dados/pastas/ com .csv ou .txt dentro (o export do ManaBox, que é a verdade e o
    motor nunca edita: {"sub": True}) e a lista do projeto, dados/pastas/<pasta>.csv (formato do ManaBox) ou <pasta>.txt
    ({"sub": False}, que o motor edita ao aplicar). Pasta com os dois soma os dois e segue a regra da subpasta."""
    pf = os.path.join(dados.DADOS, "pastas")
    out = {}
    for f in sorted(os.listdir(pf)) if os.path.isdir(pf) else []:
        p = os.path.join(pf, f)
        if os.path.isdir(p):
            arqs = [os.path.join(p, a) for a in sorted(os.listdir(p)) if a.lower().endswith((".csv", ".txt"))]
            if arqs:
                out.setdefault(f, dict(sub=True, arqs=[]))
                out[f]["sub"] = True
                out[f]["arqs"] = arqs + out[f]["arqs"]
        elif f.lower().endswith((".txt", ".csv")) and os.path.getsize(p) > 0 and f.lower() not in ("decisoes.json",):
            # lista do projeto: o .txt antigo ou, desde 22/10/2026, o .csv no formato do ManaBox (a Preta P), que o motor edita
            out.setdefault(f[:-4], dict(sub=False, arqs=[]))["arqs"].append(p)
    return out


def ler_fichas_pastas():
    """dados/pastas/pastas.json: {pasta: {subnome, formato, frase, papeis: [[nome, o que entra]]}}, a ficha de cada pasta física."""
    j = dados.ler_json(os.path.join(dados.DADOS, "pastas", "pastas.json"), obrigatorio=False) or {}
    return {k: v for k, v in j.items() if not k.startswith("_") and isinstance(v, dict)}


def pastas_fora_do_hub():
    """Nomes de pasta com lista que não batem com hub.PASTAS (o nome da subpasta precisa ser o da pasta física)."""
    import hub
    conhecidas = {n for n, _ in hub.PASTAS}
    return [p for p in pastas_lista() if p not in conhecidas]


def ler_pasta(nome):
    """(cópias, resumo da leitura) de uma pasta: os arquivos da subpasta somados, e o .txt antigo."""
    pf = os.path.join(dados.DADOS, "pastas")
    return _ler_arquivos((pastas_lista().get(nome) or {}).get("arqs", []), lambda p: os.path.relpath(p, pf).replace("\\", "/"))


def eh_manabox(origem):
    """Pasta em subpasta: o export do ManaBox é a verdade; decisão vira tarefa para o dono, nunca edição de arquivo."""
    return bool(origem and origem != CAIXA and (pastas_lista().get(origem) or {}).get("sub"))


def nomes_pasta(nome):
    """{chave do nome: cópias} de uma pasta, leitura leve sem Scryfall (dados.ler_pastas, painéis e hub)."""
    try:
        copias, _ = ler_pasta(nome)
    except (OSError, ValueError):
        return {}
    out = {}
    for c in copias:
        if c.get("nome"):
            k = dados.chave_nome(c["nome"])
            out[k] = out.get(k, 0) + c["q"]
    return out


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


def saldo(cx):
    """O saldo de uma lista: o valor de hoje, o da atualização anterior e a data mais comum dele (para o "desde")."""
    t = a = 0.0
    em = {}
    for c in cx["cartas"]:
        for cp in c["copias"]:
            if cp["usd"] is None:
                continue
            t += cp["usd"]
            a += cp["ant"] if cp.get("ant") is not None else cp["usd"]
            if cp.get("ant") is not None and cp.get("ant_em"):
                em[cp["ant_em"]] = em.get(cp["ant_em"], 0) + 1
    desde = sorted(em, key=lambda d: (-em[d], d))[0] if em else None
    return dict(valor=round(t, 2), ant=round(a, 2), desde=desde, precos_de=cx["resumo"].get("precos_de"))


def gravar_resumo(cx):
    """cache/caixa/resumo.json: o que o hub mostra. Da Caixa: cartas, cópias, S e A, sem valor. De cada lista (Caixa e pastas):
    o saldo, que o hub mostra só ao passar o mouse na pasta (a pedido do dono, 18/10/2026), e o dólar em reais."""
    p = os.path.join(dados.RAIZ, "cache", "caixa", "resumo.json")
    r = ler_resumo() or {}
    if cx["origem"] == CAIXA:
        por_dest, por_pri, _ = resumo_destinos(cx)
        r.update(lido=cx["lido"], cartas=cx["resumo"]["cartas"], copias=cx["resumo"]["copias"], S=por_pri["S"][0], A=por_pri["A"][0])
    r.setdefault("saldos", {})[cx["origem"]] = dict(saldo(cx), cartas=cx["resumo"]["cartas"], copias=cx["resumo"]["copias"])
    cb = cambio(avisar=lambda *a: None)
    r["cambio"] = cb["v"] if cb else None
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


def _arq_precos():
    return os.path.join(dados.DADOS, "precos", "ultimo.json")


def _chave_preco(imp, acab):
    return "%s|%s" % (imp, acab)


def ler_precos():
    """dados/precos/ultimo.json: {"copias": {"SET num|acabamento": {usd, em, ant, ant_em}}}, só o preço da última
    atualização (/precos) e o anterior, sem série histórica. A tabela mostra a variação quando passa da régua (10%)."""
    try:
        with open(_arq_precos(), encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def atualizar_precos(origem=None, avisar=print, buscar=None):
    """Consulta o Scryfall de novo para as impressões da Caixa e das pastas (ou de uma origem), ignorando a validade de 7 dias
    do cache, e guarda o preço anterior de cada impressão e acabamento. buscar(pedidos, atualizar) substitui o Scryfall (testes).
    Devolve o resumo: cópias, impressões, preços que mudaram e os que passaram da variação da régua."""
    R = regua()
    buscar = buscar or (lambda ps, atualizar: scryfall.buscar(ps, atualizar=atualizar, avisar=avisar))
    hoje = datetime.date.today().isoformat()
    copias = []
    for o in ([origem] if origem else origens()):
        cs, _ = ler_listas() if o == CAIXA else ler_pasta(o)
        copias += cs
    _resolver_ids(copias, avisar)
    unicos = {}
    for c in copias:
        unicos.setdefault((c.get("set"), c.get("num"), c.get("nome")), c)
    itens = list(unicos.values())
    antes, depois = {}, {}
    for i in range(0, len(itens), 70):
        lote = itens[i:i + 70]
        ps = [_pedido(c) for c in lote]
        try:
            a = buscar(ps, False)
            d = buscar(ps, True)
        except scryfall.ErroScryfall as e:
            avisar("aviso: %s; esse lote fica com o preço do cache" % e)
            continue
        for k, c in enumerate(lote):
            antes[k + i], depois[k + i] = a[k], d[k]
    reg = ler_precos()
    cps = reg.setdefault("copias", {})
    mudou = varia = 0
    for i, c in enumerate(itens):
        if i not in depois:
            continue
        r0, r1 = antes[i], depois[i]
        imp = _imp(r1.get("set"), r1.get("num"))
        for acab in {x["acab"] for x in copias if (x.get("set"), x.get("num"), x.get("nome")) == (c.get("set"), c.get("num"), c.get("nome"))}:
            k = _chave_preco(imp, acab)
            novo, velho = _preco(r1, acab), _preco(r0, acab)
            ant = cps.get(k) or {}
            # o anterior é o da última atualização; na primeira, o que o cache tinha antes desta
            ant_v, ant_em = (ant.get("usd"), ant.get("em")) if ant.get("em") and ant.get("em") != hoje else (ant.get("ant"), ant.get("ant_em")) if ant else (velho, r0.get("consultado"))
            if ant_v is None:
                ant_v, ant_em = velho, r0.get("consultado")
            cps[k] = dict(usd=novo, em=hoje, ant=ant_v, ant_em=ant_em)
            if novo is not None and ant_v is not None and novo != ant_v:
                mudou += 1
                if ant_v and abs(novo - ant_v) / ant_v >= R["variacao_min"]:
                    varia += 1
    reg["lido"] = hoje
    os.makedirs(os.path.dirname(_arq_precos()), exist_ok=True)
    with open(_arq_precos(), "w", encoding="utf-8", newline="\n") as f:
        json.dump(reg, f, ensure_ascii=False, indent=1, sort_keys=True)
    return dict(copias=sum(c["q"] for c in copias), impressoes=len(depois), mudaram=mudou, variacao=varia)


CAMBIO = os.path.join(dados.RAIZ, "cache", "cambio.json")
PTAX = ("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,"
        "dataFinalCotacao=@dataFinalCotacao)?@dataInicial='%s'&@dataFinalCotacao='%s'&$format=json&$select=cotacaoVenda,dataHoraCotacao")


def _ptax_rede(hoje):
    """A cotação de venda do dólar (PTAX) do último dia útil, pela API de dados abertos do Banco Central."""
    import urllib.request
    d1 = datetime.date.fromisoformat(hoje)
    d0 = d1 - datetime.timedelta(days=10)
    url = PTAX % (d0.strftime("%m-%d-%Y"), d1.strftime("%m-%d-%Y"))
    req = urllib.request.Request(url.replace("'", "%27").replace("$", "%24"), headers={"Accept": "application/json", "User-Agent": scryfall.UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        vs = json.load(r).get("value") or []
    if not vs:
        raise ValueError("a PTAX voltou vazia")
    ult = max(vs, key=lambda x: x["dataHoraCotacao"])
    return dict(v=round(float(ult["cotacaoVenda"]), 4), data=ult["dataHoraCotacao"][:10], fonte="PTAX")


def cambio(atualizar=False, avisar=print, fonte=None, hoje=None):
    """O dólar em reais para a tela ("≈ R$"): cambio_brl de motor/caixa.json é "ptax" (a cotação de venda do último dia útil,
    buscada no /precos e guardada em cache/cambio.json), um número fixo, ou null (sem reais). As regras seguem em dólar.
    Sem rede, vale a última cotação guardada, com aviso. fonte(hoje) substitui a API (testes)."""
    modo = regua().get("cambio_brl")
    if modo is None:
        return None
    if isinstance(modo, (int, float)):
        return dict(v=float(modo), data=None, fonte="fixo")
    try:
        with open(CAMBIO, encoding="utf-8") as f:
            guardado = json.load(f)
    except (OSError, ValueError):
        guardado = None
    if atualizar:
        hoje = hoje or datetime.date.today().isoformat()
        try:
            novo = (fonte or _ptax_rede)(hoje)
            os.makedirs(os.path.dirname(CAMBIO), exist_ok=True)
            with open(CAMBIO, "w", encoding="utf-8") as f:
                json.dump(novo, f, ensure_ascii=False)
            return novo
        except Exception as e:
            if guardado:
                avisar("aviso: PTAX sem resposta (%s); fica a cotação de %s" % (e, guardado.get("data")))
                return dict(guardado, velha=1)
            avisar("aviso: PTAX sem resposta (%s) e nenhuma cotação guardada; a página fica só em dólar" % e)
            return None
    return guardado


def link_publicado(base=None, origem=None):
    """O link da página publicada: o da Caixa em dados/caixa/link.txt; o de cada pasta em dados/pastas/links.json."""
    if origem and origem != CAIXA:
        try:
            with open(os.path.join(dados.DADOS, "pastas", "links.json"), encoding="utf-8") as f:
                return (json.load(f) or {}).get(origem) or None
        except (OSError, ValueError):
            return None
    try:
        with open(os.path.join(pasta_caixa(base), "link.txt"), encoding="utf-8") as f:
            return f.read().strip() or None
    except OSError:
        return None


def nome_pagina(origem=None):
    """O arquivo de cada lista em saidas/: "00. Caixa" e "00. Pasta <pasta>", uma página por lista, como um painel por deck."""
    return NOME if not origem or origem == CAIXA else "00. Pasta " + origem


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
    """A Caixa (se tem listas) e cada pasta com lista: subpasta de dados/pastas/ ou o .txt antigo."""
    out = []
    if os.path.isdir(os.path.join(pasta_caixa(base), "listas")):
        out.append(CAIXA)
    return out + list(pastas_lista())


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
    for pasta in dados.pastas_decks():
        base = dados.pasta_deck(pasta)
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
    manabox = eh_manabox(origem)
    if origem == CAIXA:
        copias, resumo_listas = ler_listas(base)
    else:
        copias, resumo_listas = ler_pasta(origem)
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
    # pasta que não vende (ficha com "venda": false, como a Preta P): nada dela vai para venda, bulk ou bundles
    sem_venda = origem != CAIXA and (ler_fichas_pastas().get(origem) or {}).get("venda") is False
    precos_ant = ler_precos().get("copias") or {}
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
        if c.get("selos"):
            avisos.append("%s: o preço do Scryfall não reflete isso" % ", ".join(c["selos"]))
        imp = _imp(r.get("set"), r.get("num"))
        ant = (precos_ant.get(_chave_preco(imp, c["acab"])) or {})
        var = round((preco - ant["ant"]) / ant["ant"], 3) if preco is not None and ant.get("ant") else None
        for _ in range(c["q"]):
            cp = dict(imp=imp, acab=c["acab"], idioma=c["idioma"], cond=c["cond"], usd=preco,
                      data=r.get("consultado"), avisos=list(avisos), lista=c["lista"], linha=c["linha"], ent=c.get("ent"))
            if c.get("proxy"):
                cp["proxy"] = 1
            for k in ("selos", "rar", "compra"):
                if c.get(k):
                    cp[k] = c[k]
            if ant.get("ant") is not None:   # o preço da atualização anterior: o placar de cada origem soma a variação
                cp["ant"], cp["ant_em"] = ant["ant"], ant.get("ant_em")
            if var is not None and abs(var) >= R["variacao_min"]:
                cp["var"], cp["var_de"], cp["var_em"] = var, ant["ant"], ant.get("ant_em")
            por_carta.setdefault(nome, dict(r=r, copias=[]))["copias"].append(cp)

    # cópias com decisão aplicada saem da caixa; as pendentes ficam presas à cópia (por impressão e acabamento)
    decididas = 0
    for nome, v in por_carta.items():
        ds_c = (dec["cartas"].get(nome) or {}).get("copias") or []
        resto = []
        aplicadas = [x for x in ds_c if x.get("aplicado")] if origem == CAIXA else []
        if manabox:   # a cópia some quando o export não a traz mais; até lá, a decisão (aplicada ou não) fica nela, "a fazer no ManaBox"
            pendentes = [x for x in ds_c if x.get("destino") and not (x.get("tarefa") or {}).get("feita")]
        else:
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
        ban = r.get("leg") == "banned"   # banida no Commander: nunca vai para deck (Venda com preço, senão Guardar)

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
                    sid=r.get("id"), iset=r.get("set"), inum=r.get("num"), image=r.get("image", True), pet=1 if pet.get(ch) else 0,
                    ban=1 if ban else 0, leg=r.get("leg"), ilegal=1 if r.get("leg") == "not_legal" else 0)
        t = trad.get(nome)
        if t and t.get("pt"):
            card["tx"] = {"pt": t["pt"]}
            if t.get("h") != marca_texto(card["fx"]):
                card["tx"]["velha"] = 1
        _sugerir(card, decks, em_desejo, R, sem_venda)
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
                  valor=round(sum(c["valor"] for c in cartas), 2),
                  precos_de=min((cp["data"] for c in cartas for cp in c["copias"] if cp.get("data")), default=None),
                  proxies=sum(1 for c in cartas for cp in c["copias"] if cp.get("proxy")), banidas=[c["n"] for c in cartas if c.get("ban")])
    return dict(lido=hoje, regua=R, resumo=resumo, cartas=cartas, origem=origem, manabox=manabox,
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


def _sugerir(card, decks, em_desejo, R, sem_venda=False):
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
        pode_deck = not card.get("ban") and not card.get("ilegal") and not cp.get("proxy")
        if card.get("ban"):   # banida no Commander: Venda com preço, senão Guardar
            if preco is not None:
                parado = preco >= R["capital_usd"]
                sug = dict(d="venda", p=None, P="A" if parado else "B", regra=0, pq="Banida no Commander: não joga em nenhum deck seu; vale %s." % usd(preco),
                           pp="A: %s ou mais, capital parado." % usd(R["capital_usd"]) if parado else "B: abaixo de %s." % usd(R["capital_usd"]))
                if parado:
                    marcas.append("capital parado")
            else:
                sug = dict(d="guardar", p=None, P="B", regra=0, pq="Banida no Commander e sem preço no Scryfall: guarde até saber o valor.",
                           pp="B: banida, sem preço para decidir a venda.")
        elif card.get("ilegal"):
            tr.append([0, "Fora do Commander", "a carta não vale no formato (Un-set, Alchemy e afins): nunca vai para deck"])
        elif cp.get("proxy"):
            tr.append([0, "Proxy", "cópia proxy: não vai para deck como carta nova nem para venda"])

        def nome_deck(p):
            return decks[p]["curto"] if p in decks else p

        # 1. radar pede como entra
        cands = [x for x in card["radares"] if x["v"] == "entra" and x["p"] not in em_deck and x["p"] not in usados and _elegivel(decks.get(x["p"]))] if pode_deck and not sug else []
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
        elif pode_deck and not sug:
            tr.append([1, "Radar", _nao_radar(card, "entra", em_deck, usados, decks, nome_deck)])
        # 2. ganho com sinergia avaliada a partir do corte de deck
        if not sug:
            fora = {x["p"] for x in card["radares"] if x["v"] == "fora"}
            es = [e for e in card["enc"] if e["a"] and not e["j"] and e["p"] not in usados and e["p"] not in fora
                  and _elegivel(decks.get(e["p"])) and e["g"] >= R["deck_ganho_min"]] if pode_deck else []
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
            elif pode_deck:
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
        if not sug and preco is not None and preco >= R["venda_usd_min"] and not cp.get("proxy"):
            parado = preco >= R["capital_usd"]
            if parado:
                marcas.append("capital parado")
            onde = " (já está em todos os seus decks que a querem)" if em_deck_real else ""
            sug = dict(d="venda", p=None, P="A" if parado else "B", regra=4,
                       pq="Sem casa nos seus decks%s; vale %s%s." % (onde, usd(preco), ": capital parado" if parado else ""),
                       pp="A: %s ou mais, capital parado." % usd(R["capital_usd"]) if parado else "B: entre %s e %s (a partir de %s seria A)." % (
                           usd(R["venda_usd_min"]), usd(R["capital_usd"]), usd(R["capital_usd"])))
        elif not sug:
            tr.append([4, "Venda", "proxy não se vende" if cp.get("proxy") else "vale %s, abaixo de %s" % (usd(preco), usd(R["venda_usd_min"])) if preco is not None else "sem preço no Scryfall"])
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
        if sem_venda and sug["d"] in ("venda", "bulk", "bundles"):
            tr.append([sug.get("regra") or 0, NOME_DESTINO[sug["d"]], "seria a sugestão, mas esta pasta não vende: por definição, as cartas dela ficam"])
            sug = dict(d="guardar", p=None, P="C", regra=0, pq="Fica na pasta: nada daqui vai para venda, bulk ou bundles.", pp="C: fica onde está, sem ação.")
            marcas = [m for m in marcas if m not in ("capital parado", "moeda de troca", "oportunidade")]
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


def _nav(R):
    """Os links da barra do topo (hub, Caixa e Grimório), local e publicado, como o hub e o Grimório fazem."""
    from urllib.parse import quote
    import grimorio
    tem_g = os.path.exists(os.path.join(grimorio.PASTA, "grimorio.json"))
    return dict(hub=dict(href=quote("00. Hub.html"), pub=R.get("hub_publicado") or None),
                caixa=dict(href=quote(NOME + ".html"), pub=link_publicado()),
                grim=dict(href=quote(grimorio.NOME + ".html"), pub=grimorio.link_publicado()) if tem_g else None,
                cons=_link_consulta())


def _link_consulta():
    import consulta
    from urllib.parse import quote
    return dict(href=quote(consulta.NOME + ".html"), pub=consulta.link_publicado())


def pagina(cx=None, avisar=print, modo_img="embutidas", origem=None):
    """(html, cx) da página de uma lista, a Caixa ou uma pasta (uma página por lista, como um painel por deck), com o CSS do hub
    mais o dela e a ordenação pelo cabeçalho do motor comum."""
    import datetime as dt_, hub, tema
    cx = cx or montar(avisar=avisar, origem=origem)
    origem = cx["origem"]
    R = cx["regua"]
    crit = [dict(k=c["k"], curto=c.get("curto") or c["nome"]) for c in dados.regua()["criterios"] if not c.get("do_deck")]
    crit10 = [[c["k"], c.get("curto") or c["nome"], c["faixa"][0], c["faixa"][1]] for c in dados.regua()["criterios"]]   # os dez, com a faixa
    lista = [cx]
    todas = cx["cartas"]
    ors = [dict(k=x["origem"], col=colecao(x["origem"]), resumo=x["resumo"], cartas=x["cartas"], dec=ler_decisoes(origem=x["origem"])["cartas"],
                mb=1 if x.get("manabox") else 0) for x in lista]
    for p in pastas_fora_do_hub():
        avisar("aviso: a pasta %s não bate com nenhuma pasta física do hub (hub.PASTAS)" % p)
    D = dict(lido=cx["lido"], regua=R, origens=ors, decks=cx["decks"], crit=crit, crit10=crit10,
             cambio=cambio(avisar=avisar), tarefas=[t for t in tarefas_pendentes() if t["de"] == origem or t.get("pasta") == origem],
             fichas=ler_fichas_pastas(), gerado=dt_.datetime.now().isoformat(timespec="seconds"),
             manabox=[p for p, v in pastas_lista().items() if v["sub"]],
             pastas=[n for n, _ in hub.PASTAS], pastas_com_lista=bool([p for p in dados.ler_pastas() if p != CAIXA]),
             nav=_nav(R), img=_img(todas, avisar) if modo_img == "embutidas" else None)
    pal = tema.paleta({"fundo": "#0f0f10", "painel": "#1b1b1d", "acento": "#f5a524", "acento_claro": "#ffc96b", "texto": "#f2f0ec",
                       "suave": "#bdbab3", "apagado": "#8a877f", "destaque": "#f5a524", "destaque_claro": "#ffc96b"})
    css_fontes, _ = tema.fontes(["Alegreya Sans", "Cinzel"])   # Cinzel: o subnome das pastas (Relicário de Ônix)
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
    alvo = "saidas/" + quote(nome_pagina() + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Caixa</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir a Caixa</a></p>\n</body>\n</html>\n') % (alvo, alvo)


# ---------------------------------------------------------------- o /caixa: avaliar a sinergia e aplicar as decisões

def _ler_av(pasta):
    p = os.path.join(dados.pasta_deck(pasta), "avaliacao.json")
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
            t = dados.ler_json(os.path.join(dados.pasta_deck(p), "tema.json"), obrigatorio=False) or {}
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


def _acab_csv(v):
    v = (v or "").strip().lower()
    return "etched" if v == "etched" else "foil" if v in ("foil", "true", "yes", "sim") else "normal"


def _ler_csv_cru(arq):
    """(separador, cabeçalho, linhas) de um CSV, sem interpretar."""
    with open(arq, encoding="utf-8-sig") as f:
        bruto = f.read()
    primeira = bruto.splitlines()[0] if bruto else ""
    sep = ";" if primeira.count(";") > primeira.count(",") else ","
    rows = list(csv.reader(io.StringIO(bruto), delimiter=sep))
    return sep, (rows[0] if rows else []), [r for r in rows[1:] if any(x.strip() for x in r)]


def _gravar_csv_cru(arq, sep, cab, linhas):
    buf = io.StringIO()
    w = csv.writer(buf, delimiter=sep, lineterminator="\n")
    w.writerow(cab)
    w.writerows(linhas)
    with open(arq, "w", encoding="utf-8", newline="\n") as f:
        f.write(buf.getvalue())


def _col(cab, campo):
    """O índice da coluna de um campo (COLUNAS) num cabeçalho, ou None."""
    norm = [_sem_acento(c) for c in cab]
    for i, c in enumerate(norm):
        if c in COLUNAS[campo]:
            return i
    return None


def _linha_de_origem(origem, nome, imp, acab, base=None):
    """(cabeçalho, linha) do CSV de onde vem uma cópia (lista da Caixa ou da pasta de origem), para a carta chegar ao destino com
    coleção, número, foil, idioma, condição, selos e o preço do cadastro. None se veio de um .txt ou não achou."""
    if origem == CAIXA:
        copias, _ = ler_listas(base)
        pasta_dir = os.path.join(pasta_caixa(base), "listas")
        caminho = lambda c: os.path.join(pasta_dir, c["lista"])
    else:
        copias, _ = ler_pasta(origem)
        caminho = lambda c: os.path.join(dados.DADOS, "pastas", c["lista"])
    alvo = dados.chave_nome(nome)
    cand = [c for c in copias if dados.chave_nome(c.get("nome") or "") == alvo and c["acab"] == acab and c.get("lista", "").lower().endswith(".csv")
            and (not imp or _imp(c.get("set"), c.get("num")) == imp)]
    if not cand:
        return None
    c = cand[0]
    try:
        _, cab, linhas = _ler_csv_cru(caminho(c))
        return cab, linhas[c["linha"] - 2]
    except (OSError, IndexError):
        return None


def _por_na_pasta(pasta, nome, imp, acab, origem, base=None):
    """Põe uma cópia na lista do projeto da pasta: no dados/pastas/<pasta>.csv, se existe (copiando a linha de onde a carta veio,
    com quantidade 1), senão no <pasta>.txt."""
    pasta_fis = os.path.join(dados.DADOS, "pastas")
    os.makedirs(pasta_fis, exist_ok=True)
    arq_csv = os.path.join(pasta_fis, pasta + ".csv")
    if os.path.exists(arq_csv):
        sep, cab, linhas = _ler_csv_cru(arq_csv)
        nova = [""] * len(cab)
        fonte = _linha_de_origem(origem, nome, imp, acab, base)
        if fonte:
            fcab, frow = fonte
            fnorm = [_sem_acento(c) for c in fcab]
            for i, c in enumerate(cab):
                if _sem_acento(c) in fnorm:
                    j = fnorm.index(_sem_acento(c))
                    nova[i] = frow[j] if j < len(frow) else ""
        s_, _, num = (imp or "").partition(" ")
        for campo, v in (("nome", nome), ("set", s_), ("num", num), ("foil", acab)):   # o que a linha de origem não trouxe
            i = _col(cab, campo)
            if i is not None and not nova[i]:
                nova[i] = v
        i = _col(cab, "q")
        if i is not None:
            nova[i] = "1"
        linhas.append(nova)
        _gravar_csv_cru(arq_csv, sep, cab, linhas)
        return arq_csv
    arq = os.path.join(pasta_fis, pasta + ".txt")
    with open(arq, "a", encoding="utf-8", newline="\n") as f:
        f.write(_linha(nome, imp, acab) + "\n")
    return arq


def _tirar_do_csv(arq, nome, imp, acab):
    """Tira uma cópia de uma lista do projeto em CSV: a linha da mesma impressão e acabamento (ou a primeira do nome), e desconta
    1 se a quantidade é maior. Devolve True se achou."""
    try:
        sep, cab, linhas = _ler_csv_cru(arq)
    except OSError:
        return False
    iq, inome, iset, inum, ifoil = (_col(cab, k) for k in ("q", "nome", "set", "num", "foil"))
    if inome is None:
        return False
    alvo = dados.chave_nome(nome)
    s_, _, num = (imp or "").partition(" ")
    g = lambda r, i: r[i].strip() if i is not None and i < len(r) else ""
    cand = []
    for k, r in enumerate(linhas):
        if dados.chave_nome(g(r, inome)) != alvo:
            continue
        mesma = g(r, iset).upper() == s_.upper() and g(r, inum) == num and _acab_csv(g(r, ifoil)) == acab
        cand.append((0 if mesma else 1, k))
    if not cand:
        return False
    _, k = sorted(cand)[0]
    try:
        q = int(g(linhas[k], iq) or 1)
    except ValueError:
        q = 1
    if q <= 1:
        del linhas[k]
    else:
        linhas[k][iq] = str(q - 1)
    _gravar_csv_cru(arq, sep, cab, linhas)
    return True


def _tirar_da_pasta(pasta, nome, imp, acab):
    """Tira uma cópia de dados/pastas/<pasta>.txt: a linha da mesma impressão e acabamento (ou a primeira do nome), e
    desconta 1 se a linha tem quantidade maior. Devolve True se achou. A lista do projeto em CSV (<pasta>.csv) vem primeiro."""
    if _tirar_do_csv(os.path.join(dados.DADOS, "pastas", pasta + ".csv"), nome, imp, acab):
        return True
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


def _conta(pasta, nome, imp, acab):
    """Quantas cópias de uma carta (na impressão e no acabamento, quando dados) o export de uma pasta tem hoje."""
    if not pasta or pasta == CAIXA:
        return None
    alvo = dados.chave_nome(nome)
    copias, _ = ler_pasta(pasta)
    return sum(c["q"] for c in copias if dados.chave_nome(c.get("nome") or "") == alvo and c["acab"] == acab
               and (not imp or not c.get("set") or _imp(c["set"], c["num"]) == imp))


def conferir_tarefas(dec, origem, hoje):
    """Dá como feitas as tarefas do ManaBox que o export novo já mostra: a cópia sumiu do arquivo da pasta de origem e, no
    Mover, apareceu no da pasta de destino. Devolve as que ficaram feitas."""
    feitas = []
    for nome, v in dec["cartas"].items():
        for x in v.get("copias") or []:
            t = x.get("tarefa")
            if not t or t.get("feita"):
                continue
            saiu = t.get("q_origem") is None or _conta(origem, nome, x.get("imp"), x.get("acab", "normal")) < t["q_origem"]
            chegou = t.get("q_destino") is None or _conta(t.get("pasta"), nome, x.get("imp"), x.get("acab", "normal")) > t["q_destino"]
            if saiu and chegou:
                t["feita"] = hoje
                x["aplicado"] = x.get("aplicado") or hoje
                feitas.append(nome)
    return feitas


def tarefas_pendentes():
    """As tarefas do ManaBox ainda não vistas no export: [{n, de, d, pasta, em}] de todas as origens (para a página)."""
    out = []
    for o in origens():
        for nome, v in (ler_decisoes(origem=o).get("cartas") or {}).items():
            for x in v.get("copias") or []:
                t = x.get("tarefa")
                if t and not t.get("feita"):
                    out.append(dict(n=nome, de=o, d=x.get("destino"), pasta=t.get("pasta") or x.get("pasta"), em=t.get("em"), imp=x.get("imp"), acab=x.get("acab", "normal")))
    return out


def aplicar(base=None, hoje=None, origem=None):
    """Executa as decisões ainda não aplicadas de uma origem: Guardar e Venda -> a lista do projeto da pasta (dados/pastas/
    <pasta>.csv, com a linha de onde a carta veio, ou <pasta>.txt); Bundles e Bulk
    -> dados/caixa/bundles.txt e bulk.txt; Remover -> a cópia só sai. Vinda de uma pasta, a cópia sai também do arquivo
    daquela pasta. Pet card fica marcado em dados/pastas/marcas.json. As de Deck ficam para o /caixa pôr no radar
    (julgamento: notas, tier, quem sai) e marcar com --marcar. Nenhuma decklist muda; as listas da caixa nunca são editadas."""
    hoje = hoje or datetime.date.today().isoformat()
    origem = origem or CAIXA
    dec = ler_decisoes(base, origem)
    pasta_fis = os.path.join(dados.DADOS, "pastas")
    marcas = _ler_marcas()
    feitos, deck = [], []
    mb_origem = eh_manabox(origem)
    for nome in conferir_tarefas(dec, origem, hoje):
        feitos.append((nome, "tarefa", "feita no ManaBox"))
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
            mb_destino = d in ("guardar", "venda") and eh_manabox(x["pasta"])
            if mb_origem or mb_destino:
                # pasta do ManaBox: o motor não edita o export; vira tarefa para o dono, feita quando o próximo export mostrar
                if not x.get("tarefa"):
                    imp_, acab_ = x.get("imp"), x.get("acab", "normal")
                    x["tarefa"] = dict(em=hoje, pasta=x.get("pasta") if mb_destino else None,
                                       q_origem=_conta(origem, nome, imp_, acab_) if mb_origem else None,
                                       q_destino=_conta(x["pasta"], nome, imp_, acab_) if mb_destino else None)
                    feitos.append((nome, d, (x.get("pasta") or NOME_DESTINO[d]) + ", a fazer no ManaBox"))
                if not mb_origem:   # da Caixa (ou de uma pasta em .txt) para uma pasta do ManaBox: sai da origem já
                    if origem != CAIXA:
                        _tirar_da_pasta(origem, nome, x.get("imp"), x.get("acab", "normal"))
                    x["aplicado"] = hoje
                if x.get("pet") and d in ("guardar", "venda"):
                    marcas.setdefault(x["pasta"], {})[dados.chave_nome(nome)] = {"pet": True}
                continue
            if origem != CAIXA and not _tirar_da_pasta(origem, nome, x.get("imp"), x.get("acab", "normal")):
                continue
            if d != "remover":
                if d in ("guardar", "venda"):
                    # a carta chega à lista do projeto da pasta: no .csv com a linha de onde veio, ou no .txt
                    _por_na_pasta(x["pasta"], nome, x.get("imp"), x.get("acab", "normal"), origem, base)
                else:
                    with open(os.path.join(pasta_caixa(base), d + ".txt"), "a", encoding="utf-8", newline="\n") as f:
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
        _historico(["%s%s → %s%s" % (nome, "" if origem == CAIXA else " (da pasta %s)" % origem, NOME_DESTINO.get(d, "tarefa"), " (%s)" % onde if onde else "")
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
            if eh_manabox(origem):   # o export manda: a cópia sai quando o dono exportar a pasta de novo
                x["tarefa"] = dict(em=hoje, pasta=None, q_origem=_conta(origem, nome, imp, acab), q_destino=None)
            elif origem != CAIXA:
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
    ap.add_argument("--precos", action="store_true", help="consulta o Scryfall de novo (ignora a validade de 7 dias) para a Caixa e as pastas, ou só --origem; atualiza a PTAX e monta a página")
    ap.add_argument("--origem", help="uma pasta (dados/pastas/<pasta>.txt) no lugar da Caixa, para --importar-banco, --aplicar e --marcar")
    a = ap.parse_args()
    if a.precos:
        if a.origem and a.origem not in origens():
            raise SystemExit("origem desconhecida: %s (origens: %s)" % (a.origem, ", ".join(origens())))
        r = atualizar_precos(a.origem)
        print("preços (%s): %d cópias, %d impressões consultadas, %d preços mudaram, %d passaram de %s%%" % (
            a.origem or "Caixa e pastas", r["copias"], r["impressoes"], r["mudaram"], r["variacao"], fmt(regua()["variacao_min"] * 100, 0)))
        cb = cambio(atualizar=True)
        print("dólar: %s" % ("PTAX R$ %s de %s%s" % (fmt(cb["v"], 4), cb["data"], " (a última guardada)" if cb.get("velha") else "") if cb else "sem cotação"))
        import build
        build.montar_caixa("embutidas")
        return
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
