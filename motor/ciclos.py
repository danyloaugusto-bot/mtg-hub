# -*- coding: utf-8 -*-
"""Os Ciclos: as cartas que saem em ciclos (um grupo com função ou nome parecido, em geral uma por cor) em cada coleção,
organizadas por ano, coleção, cores e raridade, com onde cada uma já está, a força sozinha (o grau no vácuo da Consulta)
e onde renderia nos decks (contexto/ciclos/CICLOS.md; pedido do dono em 24/10/2026).

    python motor/ciclos.py --ler                 # Scryfall carta a carta (cache), imagens que faltam, status -> dados/ciclos/ciclos-lido.json e leitura.json
    python motor/ciclos.py --status              # sem rede: onde está, grau, onde rende, cabe em, contagens
    python motor/ciclos.py --conferir            # no ciclos.json do dono: raridade '?' pelo Scryfall e verificar SIM -> NÃO no que o Scryfall confirmou
    python motor/ciclos.py --classificar arq.json   # o dossiê das cartas sem cadastro, para a rubrica (as notas vão pelo cadastro)
    python motor/ciclos.py --csv                 # dados/ciclos/ciclos.csv, a cópia para o Excel (separador ;)

A lista é do dono (dados/ciclos/ciclos.json: ano, coleção, ciclo, carta, a cor da vaga no ciclo, raridade, observação, verificar).
O motor confere cada carta no Scryfall: nome oficial, identidade de cor (a que decide em que deck a carta cabe, regra 6 do
CLAUDE.md), custo, tipo, texto, legalidade, impressão. "Cores" do arquivo é só a vaga no ciclo. Sem preço. Nada aqui grava em
deck, radar ou cadastro: as notas entram pela rubrica, pelo caminho de sempre.
"""
import argparse, csv, datetime, json, os, statistics, sys

sys.dont_write_bytecode = True
MOTOR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, MOTOR)

import dados, encaixe, grimorio, imagens, scryfall  # noqa: E402

PASTA = os.path.join(dados.DADOS, "ciclos")
NOME = "00. Ciclos"
ORDEM_COR = "WUBRG"
RAR = {"common": "C", "uncommon": "U", "rare": "R", "mythic": "M", "special": "S", "bonus": "B"}
RAR_NOME = {"C": "Comum", "U": "Incomum", "R": "Rara", "M": "Mítica"}
TIPOS_CICLO = ("Mono", "Bicolor", "Tricolor", "Identidade", "Incolor", "Sabor", "Indefinido")


def _json(p):
    try:
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def _gravar_json(caminho, dado):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    tmp = caminho + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dado, f, ensure_ascii=False, indent=1)
    os.replace(tmp, caminho)


def ler_lista():
    """dados/ciclos/ciclos.json, a lista do dono. Confere o mínimo: cada linha com carta, coleção, código e ciclo."""
    L = _json(os.path.join(PASTA, "ciclos.json"))
    if not L or not isinstance(L.get("cartas"), list):
        raise dados.ErroDeck("sem dados/ciclos/ciclos.json (a lista do dono: ano, coleção, ciclo, carta, cores, raridade)")
    for i, c in enumerate(L["cartas"]):
        for k in ("carta", "colecao", "codigo", "ciclo"):
            if not str(c.get(k) or "").strip():
                raise dados.ErroDeck("ciclos.json, linha %d: falta '%s'" % (i + 1, k))
    return L


def ler_lido():
    return _json(os.path.join(PASTA, "ciclos-lido.json"))


def ler_leitura():
    return _json(os.path.join(PASTA, "leitura.json"))


def link_publicado():
    try:
        with open(os.path.join(PASTA, "link.txt"), encoding="utf-8") as f:
            return f.read().strip() or None
    except OSError:
        return None


def chave_ciclo(c):
    return "%s|%s" % (c["codigo"], c["ciclo"])


def _pedido(c):
    """O que pedir ao Scryfall por esta linha: a impressão fixada ("scryfall": "ecl/46") ou o nome da frente."""
    s = str(c.get("scryfall") or "").strip()
    if "/" in s:
        st, num = s.split("/", 1)
        return {"set": st.strip().lower(), "num": num.strip()}
    return {"name": grimorio._frente(c["carta"])}


# ---------------------------------------------------------------- a leitura (Scryfall, imagens, status)

def ler(rede=True, avisar=print):
    """Confere cada carta da lista no Scryfall (cache de 7 dias), baixa as imagens que faltam e calcula o status.
    Grava ciclos-lido.json (o dado da página) e leitura.json (o resumo, as não encontradas e as divergências)."""
    L = ler_lista()
    ant = ler_leitura() or {}
    hoje = datetime.date.today().isoformat()
    anterior = ant.get("lido") if ant.get("lido") != hoje else ant.get("anterior")
    linhas = L["cartas"]
    achados, nao = {}, []
    quieto = lambda *a: None
    # as fixadas por impressão, uma a uma; as demais pelo nome, em lotes
    por_nome = [c for c in linhas if "name" in _pedido(c)]
    fixas = [c for c in linhas if "set" in _pedido(c)]
    nomes = list(dict.fromkeys(grimorio._frente(c["carta"]) for c in por_nome))
    if rede:
        ach, nao_n = grimorio.confirmar(nomes, avisar=quieto)
        for n in nomes:
            if ach.get(n):
                achados[n] = ach[n]
        nao += nao_n
        for c in fixas:
            try:
                achados[c["carta"]] = scryfall.buscar([_pedido(c)], avisar=quieto)[0]
            except scryfall.ErroScryfall:
                nao.append(c["carta"])
    else:
        cache = scryfall._ler()
        for c in linhas:
            p = _pedido(c)
            if "set" in p:
                r = cache["cartas"].get(scryfall._chave(p["set"], p["num"]))
            else:
                ch = cache["nomes"].get(p["name"].lower())
                r = cache["cartas"].get(ch) if ch else None
            if r:
                achados[c["carta"] if "set" in p else p["name"]] = r
            else:
                nao.append(c["carta"])
    nao = sorted(set(nao))
    # as cartas e os ciclos
    cartas, ciclos, ordem_c, fundidas = {}, {}, [], []   # fundidas: linhas da lista que deram na mesma carta (a frente e o "A // B" de uma dupla face)
    for c in linhas:
        k = chave_ciclo(c)
        if k not in ciclos:
            ciclos[k] = dict(k=k, codigo=c["codigo"], colecao=c["colecao"], ano=c.get("ano"), lancamento=c.get("lancamento"), ciclo=c["ciclo"],
                             tipo=c.get("tipo_ciclo") if c.get("tipo_ciclo") in TIPOS_CICLO else "Indefinido", obs=c.get("observacao") or "", cartas=[])
            ordem_c.append(k)
        chave = c["carta"] if "set" in _pedido(c) else grimorio._frente(c["carta"])
        r = achados.get(chave)
        vaga = str(c.get("cores") or "?")
        if r is None:
            # sem registro no Scryfall: a linha fica na página com o aviso, sem texto, sem encaixe
            n = c["carta"]
            cartas[n] = dict(n=n, ci="", cost="", cmc=0, t="", o="", leg=None, rank=None, set=None, num=None, rel=None,
                             encontrada=0, vaga=vaga, rar=None, rar_dono=c.get("raridade") or "?", verificar=c.get("verificar") == "SIM",
                             obs=c.get("observacao") or "", ciclo=k)
            ciclos[k]["cartas"].append(n)
            continue
        d = grimorio._registro(r, None)
        d.update(encontrada=1, vaga=vaga, rar=RAR.get(r.get("rarity")), rar_dono=c.get("raridade") or "?", verificar=c.get("verificar") == "SIM",
                 obs=c.get("observacao") or "", ciclo=k)
        n = d["n"]
        if n in cartas:
            fundidas.append(c["carta"])
        if n in cartas and cartas[n]["ciclo"] != k:
            d["ciclos_extra"] = sorted(set(cartas[n].get("ciclos_extra") or []) | {cartas[n]["ciclo"]})
        cartas[n] = d
        if n not in ciclos[k]["cartas"]:
            ciclos[k]["cartas"].append(n)
    # cada ciclo: as cartas na ordem das cores da vaga (W U B R G), depois as multicores e as sem vaga
    for ci in ciclos.values():
        ci["cartas"].sort(key=lambda n: (_pos_vaga(cartas[n]["vaga"]), n))
    # divergências: a cor da vaga contra a identidade (não é erro: a identidade é a que vale), a raridade do dono contra o Scryfall
    div_c = [dict(n=n, vaga=c["vaga"], ci=c["ci"]) for n, c in cartas.items() if c["encontrada"] and c["vaga"] not in ("?", "") and c["vaga"] != c["ci"]]
    div_r = [dict(n=n, dono=c["rar_dono"], scryfall=c["rar"]) for n, c in cartas.items() if c["encontrada"] and c["rar"] and c["rar_dono"] not in ("?", "") and c["rar_dono"] != c["rar"]]
    # imagens: a impressão que o Scryfall devolveu; só o que falta é baixado
    precisam = {}
    for n, c in cartas.items():
        if not c["encontrada"]:
            continue
        arq = grimorio._arquivo_img(c)
        r = achados.get(n if n in achados else grimorio._frente(n))
        if arq and os.path.exists(os.path.join(imagens.CACHE_IMG, arq)):
            c["img"] = arq
        elif arq and r and r.get("id"):
            precisam[arq] = (r["id"], "front")
            c["img"] = arq
    if rede and precisam:
        try:
            imagens.baixar_faltantes(precisam, avisar=avisar)
        except dados.ErroDeck as e:
            avisar("aviso: imagens: %s" % e)
    for c in cartas.values():
        if c.get("img") and not os.path.exists(os.path.join(imagens.CACHE_IMG, c["img"])):
            del c["img"]
    if rede:
        try:
            imagens_grandes(cartas, avisar)
        except dados.ErroDeck as e:
            avisar("aviso: imagens grandes: %s" % e)
    G = dict(versao=1, lido=hoje, anterior=anterior, versao_lista=L.get("versao"), ciclos=[ciclos[k] for k in ordem_c], cartas=cartas,
             nao_encontradas=nao, fundidas=fundidas, divergencias=dict(cores=div_c, raridade=div_r))
    status(G, avisar=avisar)
    leitura = dict(versao=1, lido=hoje, anterior=anterior, fontes=["Scryfall", "cadastro v3", "decklists, pastas e Caixa"], contagens=G["contagens"],
                   nao_encontradas=nao, fundidas=fundidas, divergencias=G["divergencias"], linhas=len(linhas))
    _gravar_json(os.path.join(PASTA, "ciclos-lido.json"), G)
    _gravar_json(os.path.join(PASTA, "leitura.json"), leitura)
    ct = G["contagens"]
    avisar("gravado: %d cartas em %d ciclos de %d coleções | não encontradas %d | sem cadastro %d | pendentes %d | tenho %d, ociosas %d, faltam %d" % (
        ct["cartas"], ct["ciclos"], ct["colecoes"], len(nao), ct["sem_cadastro"], ct["pendentes"], ct["tenho"], ct["ociosa"], ct["falta"]))
    return G, leitura


def _pos_vaga(v):
    v = v or "?"
    if v in ("?", ""):
        return 99
    if len(v) == 1 and v in ORDEM_COR:
        return ORDEM_COR.index(v)
    return 10 + len(v)


# ---------------------------------------------------------------- o status (sem rede)

def status(G, avisar=print):
    """O que depende do projeto, sem rede: onde cada carta está (decks com tier, radar, pastas, Caixa), o status (Tenho, Ociosa,
    Falta, como no Grimório), as notas do cadastro, o grau no vácuo (a régua da Consulta), em que decks a carta cabe pela
    identidade do comandante e onde rende (encaixe.ranking nos decks que existem, todos, sem a carta)."""
    import consulta
    cad = dados.ler_cadastro()
    vals = consulta.valores_cadastro(cad)
    med = statistics.median(vals) if vals else 0
    gcs = set((scryfall._ler().get("gc") or {}).get("nomes") or [])
    pastas_decks = {(p.split(". ", 1)[1] if ". " in p else p): p for p in dados.pastas_decks() if dados.eh_deck(p)}
    idx = dados.indice_outros("__ciclos__")
    pastas = dados.ler_pastas()
    decks = encaixe.decks_v3()
    reais = [m for m in decks if not m["pasta"].startswith("05")]
    hoje = datetime.date.today().isoformat()
    for n, c in G["cartas"].items():
        ch = dados.chave_nome(n)
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
        c["st"] = grimorio._status(onde, c["pastas"])
        e = cad.get(grimorio._frente(n))
        c["notas"] = {k: v for k, v in (e.get("n") or {}).items() if v} if e else None
        c["pq"] = (e.get("por_que") or "") if e else ""
        if e and e.get("so_com"):
            c["so"] = e["so_com"]
        else:
            c.pop("so", None)
        c["cabe"] = [m["pasta"] for m in decks if c["encontrada"] and grimorio._dentro(c["ci"], m.get("ident"))] if c["encontrada"] else []
        c["rende"] = []
        c["valor"] = None
        c["grau"] = None
        if e and c["encontrada"]:
            v = encaixe.valor(consulta.s3_da_carta(e))
            rank = c.get("rank") if (c.get("rel") or "") <= hoje else None
            c["valor"] = v
            c["grau"] = consulta.grau_vacuo(v, med, grimorio._frente(n) in gcs, rank)
            r = encaixe.ranking(n, reais, cad, dict(cmc=c.get("cmc", 0), land=c.get("land"), mdfc=c.get("mdfc")), n=None)
            c["rende"] = [dict(p=g["deck"], n=g["painel"], g=g["ganho"], s=g["sai"], a=1 if g["avaliada"] else 0) for g in r if not g["ja_no_deck"]]
    G["decks"] = [dict(p=m["pasta"], n=m["painel"], c=m.get("curto", ""), ci=m.get("ident") or "", **({"dj": 1} if m["pasta"].startswith("05") else {})) for m in decks]
    G["mediana"] = med
    cs = G["cartas"].values()
    ct = dict(cartas=len(G["cartas"]), ciclos=len(G["ciclos"]), colecoes=len({x["codigo"] for x in G["ciclos"]}), anos=len({x["ano"] for x in G["ciclos"]}),
              sem_cadastro=sum(1 for c in cs if c["notas"] is None and c["encontrada"]), nao_encontradas=sum(1 for c in cs if not c["encontrada"]),
              pendentes=sum(1 for c in cs if c["verificar"] or not c["encontrada"]), com_grau=sum(1 for c in cs if c["grau"]))
    for st in ("tenho", "ociosa", "falta"):
        ct[st] = sum(1 for c in cs if c["st"] == st)
    for g in "SABCD":
        ct["grau_" + g] = sum(1 for c in cs if c["grau"] == g)
    G["contagens"] = ct
    return G


# ---------------------------------------------------------------- conferir a lista do dono pelo Scryfall

def conferir(avisar=print):
    """No ciclos.json do dono, só nas linhas com verificar = SIM e carta achada no Scryfall: preenche a raridade '?' e as cores '?'
    (com a identidade), e troca verificar para NÃO quando a raridade bate. Linha com raridade diferente da do Scryfall fica SIM,
    com a divergência na observação. Devolve o que mudou."""
    G = ler_lido()
    if not G:
        raise dados.ErroDeck("sem dados/ciclos/ciclos-lido.json: rode --ler antes")
    L = ler_lista()
    por_frente = {grimorio._frente(n): c for n, c in G["cartas"].items()}
    por_frente.update({n: c for n, c in G["cartas"].items()})
    mudou = []
    for c in L["cartas"]:
        if c.get("verificar") != "SIM":
            continue
        d = por_frente.get(c["carta"]) or por_frente.get(grimorio._frente(c["carta"]))
        if not d or not d.get("encontrada"):
            continue
        antes = dict(c)
        if c.get("raridade") in ("?", "", None) and d.get("rar"):
            c["raridade"] = d["rar"]
            c["raridade_nome"] = RAR_NOME.get(d["rar"], d["rar"])
        if c.get("cores") in ("?", "", None):
            c["cores"] = d["ci"] or "C"
            c["cores_nome"] = " / ".join({"W": "Branco", "U": "Azul", "B": "Preto", "R": "Vermelho", "G": "Verde"}[x] for x in d["ci"]) if d["ci"] else "Incolor"
            c["qtd_cores"] = len(d["ci"])
        if d.get("rar") and c.get("raridade") == d["rar"]:
            c["verificar"] = "NÃO"
        elif d.get("rar"):
            nota = "raridade no Scryfall: %s" % RAR_NOME.get(d["rar"], d["rar"])
            if nota not in (c.get("observacao") or ""):
                c["observacao"] = ((c.get("observacao") or "") + "; " + nota).strip("; ")
        if c != antes:
            mudou.append(dict(carta=c["carta"], de={k: antes.get(k) for k in ("raridade", "cores", "verificar")}, para={k: c.get(k) for k in ("raridade", "cores", "verificar")}))
    if mudou:
        _gravar_json(os.path.join(PASTA, "ciclos.json"), L)
    avisar("conferidas: %d linhas mudaram no ciclos.json" % len(mudou))
    return mudou


# ---------------------------------------------------------------- o dossiê para a rubrica

def classificar(arquivo, avisar=print):
    """O dossiê das cartas dos ciclos sem cadastro (texto do Scryfall, ciclo, onde está, em que decks cabe), na ordem das coleções
    (mais recente primeiro), ciclo e cor da vaga. As notas são gravadas pela rubrica no cadastro v3, nunca por este script."""
    G = ler_lido()
    if not G:
        raise dados.ErroDeck("sem dados/ciclos/ciclos-lido.json: rode --ler antes")
    cad = dados.ler_cadastro()
    r = dados.regua()
    pos = {k["k"]: i for i, k in enumerate(G["ciclos"])}
    sem = [n for n, c in G["cartas"].items() if c["encontrada"] and grimorio._frente(n) not in cad]
    # da coleção mais recente para a mais antiga; dentro da coleção, na ordem dos ciclos e das vagas
    sem.sort(key=lambda n: ("~" if not G["cartas"][n].get("rel") else "".join(chr(0xFFFF - ord(ch)) for ch in G["cartas"][n]["rel"]), pos.get(G["cartas"][n]["ciclo"], 99), _pos_vaga(G["cartas"][n]["vaga"]), n))
    cartas = []
    for n in sem:
        c = G["cartas"][n]
        ci = next((x for x in G["ciclos"] if x["k"] == c["ciclo"]), {})
        cartas.append(dict(n=n, colecao=ci.get("colecao"), codigo=ci.get("codigo"), ciclo=ci.get("ciclo"), vaga=c["vaga"], rar=c["rar"],
                           t=c["t"], cost=c["cost"], cmc=c["cmc"], ci=c["ci"], o=c["o"], rank=c.get("rank"), rel=c.get("rel"),
                           onde=[dict(d=x["d"], w=x["w"], t=x["t"]) for x in c["onde"]], pastas=c["pastas"], cabe=c["cabe"]))
    out = dict(gerado=datetime.date.today().isoformat(), rubrica="contexto/pontuacao/RUBRICA.md", grava_em="dados/cartas.json (versão 3, fonte 'claude')",
               criterios=[dict(k=x["k"], nome=x["nome"], desc=dados.DESC_V3.get(x["k"], "")) for x in r["criterios"] if not x.get("do_deck")],
               total=len(cartas), cartas=cartas)
    _gravar_json(arquivo, out)
    avisar("dossiê: %d cartas sem cadastro em %s" % (len(cartas), arquivo))
    return out


# ---------------------------------------------------------------- a cópia para o Excel

def csv_excel(avisar=print):
    """dados/ciclos/ciclos.csv: a lista do dono mais o que o Scryfall e o projeto disseram de cada carta (separador ;)."""
    L = ler_lista()
    G = ler_lido() or {"cartas": {}}
    por = {grimorio._frente(n): c for n, c in G["cartas"].items()}
    por.update(G["cartas"])
    p = os.path.join(PASTA, "ciclos.csv")
    cols = ["ano", "lancamento", "colecao", "codigo", "ciclo", "tipo_ciclo", "carta", "cores", "cores_nome", "qtd_cores", "raridade", "raridade_nome", "observacao", "verificar",
            "identidade", "raridade_scryfall", "grau", "status", "onde", "cabe_em", "rende_melhor"]
    with open(p, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(cols)
        for c in L["cartas"]:
            d = por.get(c["carta"]) or por.get(grimorio._frente(c["carta"])) or {}
            onde = ", ".join("%s (%s %s)" % (x["d"], x["w"], x["t"]) for x in d.get("onde") or []) + ("; " if d.get("onde") and d.get("pastas") else "") + ", ".join("%s ×%d" % kv for kv in (d.get("pastas") or {}).items())
            melhor = (d.get("rende") or [None])[0]
            w.writerow([c.get(k, "") for k in cols[:14]] + [d.get("ci", ""), d.get("rar") or "", d.get("grau") or "", d.get("st") or "", onde,
                                                            ", ".join(d.get("cabe") or []), ("%s %+.2f" % (melhor["p"], melhor["g"])) if melhor else ""])
    avisar("gravado: %s (%d linhas)" % (p, len(L["cartas"])))
    return p


# ---------------------------------------------------------------- a página (motor/ciclos/)

ORCAMENTO_MB = 14   # teto do HTML (o publicado vai até 16 MiB); as imagens não entram nele: vão em arquivos à parte
# as imagens: folhas de 2×2 cartas no tamanho "large" do Scryfall (672×936), por coleção, em saidas/ciclos-img/, publicadas
# junto com a página (o artefato guarda até 511 arquivos; uma por carta não caberia). O nome da folha vem das cartas que ela
# tem: folha que não mudou não é refeita nem publicada de novo.
DIR_IMG = "ciclos-img"


def imagens_grandes(cartas=None, avisar=print):
    """Baixa a versão grande (672 px) das cartas que ainda não a têm em cache/img-grande/ (o --ler já chama; --imagens só isto)."""
    if cartas is None:
        G = ler_lido()
        if not G:
            raise dados.ErroDeck("sem dados/ciclos/ciclos-lido.json: rode --ler")
        cartas = G["cartas"]
    cache = scryfall._ler()["cartas"]
    pre = {}
    for c in cartas.values():
        r = cache.get(scryfall._chave(c["set"], c["num"])) if c.get("img") and c.get("set") else None
        if r and r.get("id"):
            pre[c["img"]] = (r["id"], "front")
    return imagens.baixar_grandes(pre, avisar=avisar)


def folhas(G, avisar=print):
    """As folhas de imagem dos Ciclos em saidas/ciclos-img/ (imagens.folhas), uma série por coleção da impressão."""
    grupos = {}
    for c in G["cartas"].values():
        if c.get("img"):
            grupos.setdefault((c.get("set") or "x").lower(), set()).add(c["img"])
    return imagens.folhas(grupos, os.path.join(os.path.dirname(MOTOR), "saidas", DIR_IMG), avisar, "python motor/ciclos.py --imagens")


def _montar_dados(G, avisar=print):
    import caixa, consulta
    from urllib.parse import quote
    cad = dados.ler_cadastro()
    r = dados.regua()
    crit = [dict(k=c["k"], n=c.get("curto") or c["nome"], w=c["peso"], dd=bool(c.get("do_deck"))) for c in r["criterios"]]
    cards, sp = {}, folhas(G, avisar)
    for n, c in G["cartas"].items():
        x = dict(n=n, ci=c["ci"], cost=c["cost"], cmc=(int(c["cmc"]) if float(c["cmc"] or 0).is_integer() else c["cmc"]), t=c["t"], o=c["o"], rank=c.get("rank"),
                 set=(c.get("set") or "").upper(), rel=c.get("rel"), enc=c["encontrada"], vaga=c["vaga"], rar=c.get("rar"), rar_dono=c.get("rar_dono"),
                 ver=1 if c.get("verificar") else 0, obs=c.get("obs") or "", ciclo=c["ciclo"], st=c["st"], onde=c["onde"], pastas=c["pastas"],
                 notas=c["notas"], pq=c["pq"], valor=c.get("valor"), grau=c.get("grau"), cabe=c["cabe"], rende=c["rende"])
        if c.get("so"):
            x["so"] = c["so"]
        if c.get("ciclos_extra"):
            x["ciclos_extra"] = c["ciclos_extra"]
        if c.get("img") in sp:
            x["sp"] = sp[c["img"]]
        cards[n] = x
    colecoes = {}
    for ci in G["ciclos"]:
        k = ci["codigo"]
        if k not in colecoes:
            colecoes[k] = dict(k=k, n=ci["colecao"], ano=ci["ano"], lanc=ci["lancamento"], ciclos=[], cartas=0)
        colecoes[k]["ciclos"].append(ci["k"])
        colecoes[k]["cartas"] += len(ci["cartas"])
    cols = sorted(colecoes.values(), key=lambda x: (x["lanc"] or "", x["n"]))
    tem_caixa = os.path.isdir(os.path.join(caixa.pasta_caixa(), "listas"))
    tem_g = os.path.exists(os.path.join(dados.DADOS, "grimorio", "grimorio.json"))
    D = dict(lido=G.get("lido"), anterior=G.get("anterior"), contagens=G["contagens"], crit=crit, decks=G["decks"], mediana=G.get("mediana"),
             vacuo=consulta.limites_vacuo(G.get("mediana") or 0), ciclos=G["ciclos"], colecoes=cols, cards=cards,
             nao=G.get("nao_encontradas") or [], div=G.get("divergencias") or {},
             hub=dict(href=quote("00. Hub.html"), pub=(caixa.regua().get("hub_publicado") or None)),
             caixa=dict(href=quote(caixa.NOME + ".html"), pub=caixa.link_publicado()) if tem_caixa else None,
             grimorio=dict(href=quote(grimorio.NOME + ".html"), pub=grimorio.link_publicado()) if tem_g else None,
             consulta=dict(href=quote(consulta.NOME + ".html"), pub=consulta.link_publicado()))
    return D


def pagina(avisar=print):
    """A página dos Ciclos (html, resumo), com a paleta, as fontes e a barra do hub, o estilo do Grimório e o que é só dela."""
    import tema
    G = ler_lido()
    if not G:
        raise dados.ErroDeck("sem dados/ciclos/ciclos-lido.json: rode python motor/ciclos.py --ler")
    pal = tema.paleta({"fundo": "#0f0f10", "painel": "#1b1b1d", "acento": "#f5a524", "acento_claro": "#ffc96b", "texto": "#f2f0ec",
                       "suave": "#bdbab3", "apagado": "#8a877f", "destaque": "#f5a524", "destaque_claro": "#ffc96b"})
    css_fontes, _ = tema.fontes(["Alegreya Sans", "Cinzel"])
    root = tema.raiz_css(pal, [], ["--fd:'Cinzel',Georgia,'Times New Roman',serif", "--fb:'Alegreya Sans','Segoe UI',system-ui,sans-serif"])

    def ler_arq(*partes):
        with open(os.path.join(MOTOR, *partes), encoding="utf-8") as f:
            return f.read()
    css = ler_arq("hub", "style.css") + chr(10) + ler_arq("grimorio", "style.css") + chr(10) + ler_arq("ciclos", "style.css")
    app, tpl = ler_arq("ciclos", "app.js"), ler_arq("ciclos", "template.html")
    D = _montar_dados(G, avisar)
    D["img_dir"] = DIR_IMG
    js = app.replace("/*__DATA__*/null", json.dumps(D, ensure_ascii=False, separators=(",", ":")))
    html = (tpl.replace("/*__FONTS__*/", css_fontes).replace("/*__ROOT__*/", root)
            .replace("/*__CSS__*/", css).replace("/*__JS__*/", js.replace("</script", "<\\/script")))
    kb = len(html.encode("utf-8")) / 1024
    avisos = ["acima do orçamento de %d MB: %.0f KB" % (ORCAMENTO_MB, kb)] if kb > ORCAMENTO_MB * 1024 else []
    n_folhas, mb_img = imagens.tamanho_folhas(os.path.join(os.path.dirname(MOTOR), "saidas", DIR_IMG))
    return html, dict(cartas=len(D["cards"]), ciclos=len(D["ciclos"]), colecoes=len(D["colecoes"]), kb=kb, folhas=n_folhas, mb_img=mb_img, avisos=avisos)


def atualizar_status(avisar=lambda *a: None):
    """Refaz onde cada carta está, o grau, cabe em e onde rende, sem rede, e grava ciclos-lido.json. O build chama antes de
    montar a página: carta movida pelo /caixa aplicar não fica com o lugar antigo."""
    G = ler_lido()
    if not G:
        raise dados.ErroDeck("sem dados/ciclos/ciclos-lido.json: rode --ler")
    status(G, avisar=avisar)
    _gravar_json(os.path.join(PASTA, "ciclos-lido.json"), G)
    return G


def atalho():
    from urllib.parse import quote
    alvo = "saidas/" + quote(NOME + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Ciclos</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir os Ciclos</a></p>\n</body>\n</html>\n') % (alvo, alvo)


# ---------------------------------------------------------------- linha de comando

def main():
    ap = argparse.ArgumentParser(description="Os Ciclos: leitura, status, conferência e dossiê.")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--ler", action="store_true", help="confere a lista no Scryfall, baixa imagens e grava ciclos-lido.json e leitura.json")
    g.add_argument("--status", action="store_true", help="recalcula onde está, grau, onde rende e cabe em, sem rede")
    g.add_argument("--conferir", action="store_true", help="no ciclos.json do dono, resolve as linhas 'verificar = SIM' que o Scryfall confirma")
    g.add_argument("--classificar", metavar="ARQUIVO.json", help="grava o dossiê das cartas sem cadastro, para a rubrica")
    g.add_argument("--csv", action="store_true", help="grava dados/ciclos/ciclos.csv para o Excel")
    g.add_argument("--imagens", action="store_true", help="baixa a versão grande (672 px) das imagens que faltam em cache/img-grande/")
    ap.add_argument("--sem-rede", action="store_true", help="no --ler, só o cache do Scryfall")
    a = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    try:
        if a.ler:
            ler(rede=not a.sem_rede)
        elif a.status:
            G = atualizar_status()
            ct = G["contagens"]
            print("status: %d cartas | sem cadastro %d | com grau %d | tenho %d, ociosas %d, faltam %d" % (ct["cartas"], ct["sem_cadastro"], ct["com_grau"], ct["tenho"], ct["ociosa"], ct["falta"]))
        elif a.conferir:
            for m in conferir():
                print("  %-36s %s -> %s" % (m["carta"], m["de"], m["para"]))
        elif a.classificar:
            classificar(a.classificar)
        elif a.csv:
            csv_excel()
        elif a.imagens:
            imagens_grandes()
    except (dados.ErroDeck, scryfall.ErroScryfall) as e:
        sys.exit("ciclos: %s" % e)


if __name__ == "__main__":
    main()
