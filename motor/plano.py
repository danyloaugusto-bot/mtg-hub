# -*- coding: utf-8 -*-
"""O Plano do deck: habilitadoras, recompensas e multiplicadoras (contexto/plano/METODO-PLANO.md, aprovado em 18/10/2026).

Uma lente ao lado da pontuação v3: não muda os dez critérios nem o placar. Cada carta do deck e do radar pode ter um papel
neste deck (`papel` no avaliacao.json: habilita, recompensa ou multiplica; sem papel é estrutura), a dupla função e o porquê;
o comandante tem o papel dele no bloco `plano`. Daqui saem a mistura, as checagens, o veredito e os cenários "mais forte e
equilibrado" (hoje, sem comprar nada, radar como está, recomendado), cada um com o placar antes e depois pela mesma conta do
painel (hub.placar, com a aceleração). A régua mora em motor/plano.json.

    python motor/plano.py --deck "02. Clavileño"            o veredito, as checagens e os cenários
    python motor/plano.py --deck "<pasta>" --dossie <arq>   o que falta classificar, com o texto do Scryfall (para o /plano)
    python motor/plano.py --gravar <arq>                     grava papéis do deck, do radar, do comandante e das candidatas
"""
import datetime, io, json, math, os, sys
import dados

MOTOR = os.path.dirname(os.path.abspath(__file__))
PAPEIS = dados.PAPEIS
NOMES = {"habilita": "Habilitadora", "recompensa": "Recompensa", "multiplica": "Multiplicadora"}
PLURAL = {"habilita": "Habilitadoras", "recompensa": "Recompensas", "multiplica": "Multiplicadoras"}
_REGUA = None


def regua():
    global _REGUA
    if _REGUA is None:
        with open(os.path.join(MOTOR, "plano.json"), encoding="utf-8") as f:
            _REGUA = json.load(f)
    return _REGUA


def fmt(v, casas=1):
    s = ("%." + str(casas) + "f") % v
    i, _, d = s.partition(".")
    neg = i.startswith("-")
    i = "{:,}".format(int(i.lstrip("-"))).replace(",", ".")
    return ("-" if neg else "") + i + ("," + d.rstrip("0") if d and int(d) else "")


def sinal(v):
    return ("+" if v > 0 else "−" if v < 0 else "") + fmt(abs(v))


def lista_pt(xs):
    xs = list(xs)
    return ", ".join(xs[:-1]) + " e " + xs[-1] if len(xs) > 1 else (xs[0] if xs else "")


# ---------------------------------------------------------------- a mistura e o veredito

def _plano(cards):
    """As cartas do plano: as que têm papel, fora o comandante (terreno só conta se tiver papel)."""
    return [c for c in cards if c.get("pp") and not c.get("cmd")]


def contagem(cards):
    pl = _plano(cards)
    cont = {p: sum(c["q"] for c in pl if c["pp"] == p) for p in PAPEIS}
    n = sum(cont.values())
    dupla = sum(c["q"] for c in pl if c.get("ppd"))
    return dict(n=n, cont=cont, pct={p: (cont[p] / n * 100 if n else 0) for p in PAPEIS}, dupla=dupla, dupla_pct=dupla / n * 100 if n else 0)


def _resil(cards):
    ks = [c["k"] for c in dados.regua()["criterios"]]
    i = ks.index("resiliencia")
    return sum(c["q"] for c in cards if c.get("s3") and c["s3"][i] >= 2)


def faltam(cont, n, p, lo):
    """Quantas cartas faltam para o papel chegar ao piso da faixa, trocando com outro papel (o plano não muda de tamanho)."""
    return max(0, math.ceil(lo * n / 100 - 1e-9) - cont[p])


def sobram(cont, n, p, hi):
    return max(0, cont[p] - math.floor(hi * n / 100 + 1e-9))


def avaliar(cards, cmd_papeis, nomes_cmd=None, tribal=False):
    """Mistura, checagens e veredito de uma lista de cartas (as do deck, ou as de um cenário). cmd_papeis: o papel de cada
    comandante (lista; vazia = sem classificação). tribal: o deck é da família Tribais (só muda o texto do tamanho do plano)."""
    R = regua()
    k = contagem(cards)
    n, cont, pct = k["n"], k["cont"], k["pct"]
    nomes_cmd = nomes_cmd or ["O comandante"] * len(cmd_papeis)
    checks, fora = [], []
    # tamanho
    lo, hi = R["plano_faixa"]
    if n < R["plano_minimo"]:
        checks.append(("falha", "Plano com %d cartas: abaixo do mínimo de %d." % (n, R["plano_minimo"])))
    elif n > hi:
        if tribal:
            checks.append(("ok", "Plano com %d cartas. Passa da faixa de %d a %d, como todo tribal: cada corpo da tribo conta como habilitadora." % (n, lo, hi)))
        else:
            checks.append(("ok", "Plano com %d cartas, acima da faixa de %d a %d: quase todo o deck tem papel no plano." % (n, lo, hi)))
    elif n < lo:
        checks.append(("aviso", "Plano com %d cartas, abaixo da faixa de %d a %d." % (n, lo, hi)))
    else:
        checks.append(("ok", "Plano com %d cartas, dentro da faixa de %d a %d." % (n, lo, hi)))
    # as três faixas (habilitadoras sem teto quando um comandante é recompensa), na ordem do protótipo
    sem_teto = "recompensa" in cmd_papeis and R["comandante"]["recompensa"].get("habilita_sem_teto")
    mult_ok = cont["multiplica"] <= cont["habilita"]
    cmd_ok, cmd_checks = True, []
    for pp, nome in zip(cmd_papeis, nomes_cmd):
        rc = R["comandante"][pp]
        if pp == "recompensa":
            ok = pct["habilita"] >= rc["habilita_min_pct"]
            msg = "Habilitadoras: %d (%s%%). %s é recompensa, e comandante-recompensa pede %d%% ou mais: %s" % (
                cont["habilita"], fmt(pct["habilita"], 0), nome, rc["habilita_min_pct"], "o deck alimenta bem o comandante." if ok else "faltam corpos para alimentá-lo.")
        elif pp == "habilita":
            res = _resil(cards)
            ok = res >= rc["resiliencia_min"] and cont["habilita"] >= rc["habilita_no_99_min"] and pct["recompensa"] >= rc["recompensa_min_pct"]
            msg = "%s é habilitadora: pede proteção (Resiliência com %d cartas de nota 2 ou 3; tem %d), plano B nas 99 (%d habilitadoras; tem %d) e recompensas a partir de %d%% (tem %s%%)." % (
                nome, rc["resiliencia_min"], res, rc["habilita_no_99_min"], cont["habilita"], rc["recompensa_min_pct"], fmt(pct["recompensa"], 0))
        else:
            ok = cont["habilita"] >= rc["habilita_min"] and cont["recompensa"] >= rc["recompensa_min"]
            msg = "%s é multiplicadora: as 99 precisam andar sozinhas (%d habilitadoras e %d recompensas; tem %d e %d)." % (
                nome, rc["habilita_min"], rc["recompensa_min"], cont["habilita"], cont["recompensa"])
        cmd_ok = cmd_ok and ok
        cmd_checks.append((pp, "ok" if ok else "falha", msg))
    if not cmd_papeis:
        cmd_ok = False
    for p in PAPEIS:
        a, b = R["faixas_pct"][p]
        txt = "%s: %d (%s%%)" % (PLURAL[p], cont[p], fmt(pct[p], 0))
        if p == "habilita" and sem_teto:
            checks += [(s_, m_) for pp_, s_, m_ in cmd_checks if pp_ == "recompensa"]
            continue
        if pct[p] < a:
            f = faltam(cont, n, p, a)
            fora.append(f)
            checks.append(("aviso", "%s, abaixo da faixa de %d a %d%%: falta%s %d." % (txt, a, b, "m" if f > 1 else "", f)))
        elif pct[p] > b:
            f = sobram(cont, n, p, b)
            fora.append(f)
            checks.append(("aviso", "%s, acima da faixa de %d a %d%%: sobra%s %d." % (txt, a, b, "m" if f > 1 else "", f)))
        elif p == "multiplica":
            checks.append(("ok" if mult_ok else "falha", "%s, %s que as habilitadoras.%s" % (txt, "menos" if mult_ok else "mais", " Sem a armadilha de multiplicar o que não existe." if mult_ok else " Multiplica o que não existe.")))
            continue
        else:
            checks.append(("ok", "%s, dentro da faixa de %d a %d%%." % (txt, a, b)))
        if p == "multiplica":
            checks.append(("ok" if mult_ok else "falha", ("Multiplicadoras: %d, menos que as habilitadoras (%d)." if mult_ok else
                                                         "Multiplicadoras: %d, mais que as habilitadoras (%d): multiplica o que não existe.") % (cont["multiplica"], cont["habilita"])))
    checks += [(s_, m_) for pp_, s_, m_ in cmd_checks if pp_ != "recompensa" or not sem_teto]
    # dupla função
    dmin = R["excelente_dupla_min_pct"]
    TRK = {"S": 0, "A": 1, "B": 2, "C": 3, "D": 4}
    ex = sorted([c for c in _plano(cards) if c.get("ppd")], key=lambda c: (TRK.get(c.get("tier"), 9), c["n"]))[:2]
    import re as re_
    curto_ = lambda t: (re_.match(r"^\S+ \((.*)\)$", t) or re_.match(r"(.*)", t)).group(1)   # "Multiplicadora (vira lorde)" -> "vira lorde"
    exs = (", como " + " e ".join("%s (%s)" % (c["n"], curto_(c["ppd"])) for c in ex)) if ex else ""
    checks.append(("ok" if k["dupla_pct"] >= dmin else "aviso", "Dupla função: %d das %d (%s%%)%s%s." % (
        k["dupla"], n, fmt(k["dupla_pct"], 0), "" if k["dupla_pct"] >= dmin else ", abaixo dos %d%% do excelente" % dmin, exs)))
    # o veredito
    tol = R["satisfatorio_tolerancia_cartas"]
    if not cmd_papeis:
        ver = None
    elif n < R["plano_minimo"] or not mult_ok or not cmd_ok or len(fora) >= 2 or (fora and fora[0] > tol):
        ver = "insuficiente"
    elif not fora and k["dupla_pct"] >= dmin:
        ver = "excelente"
    else:
        ver = "satisfatorio"
    return dict(k, checks=[dict(s=s, t=t) for s, t in checks], veredito=ver, mistura=[cont[p] for p in PAPEIS])


# ---------------------------------------------------------------- placar e cenários

def e_tribal(pasta):
    """O deck é da família Tribais no tema_jogo do tema.json."""
    try:
        t = json.load(open(os.path.join(dados.DADOS, pasta, "tema.json"), encoding="utf-8"))
    except (OSError, ValueError):
        return False
    return (t.get("tema_jogo") or {}).get("familia") == "Tribais"


def placar(cards, grupos):
    import hub
    return round(hub.placar(cards, grupos, v3=True)[0], 2)


def pontos_acel(cards):
    ks = [c["k"] for c in dados.regua()["criterios"]]
    i = ks.index("aceleradores")
    nl = [c for c in cards if not c.get("land")]
    q = sum(c["q"] for c in nl)
    avg = sum(c["cmc"] * c["q"] for c in nl) / q if q else 0
    return dados.pontos_aceleracao(sum(c["s3"][i] * c["q"] for c in cards) / avg if avg else 0)


def _faixas_v3():
    R = dados.regua()
    return [c["faixa"] for c in R["criterios"]]


def _contagem_v3(cards):
    n = len(dados.regua()["criterios"])
    return [sum(c["q"] for c in cards if c["s3"][i] >= 2) for i in range(n)]


def _sem_furo(antes, depois):
    """A troca não deixa um critério da v3 abaixo da faixa (se ele estava dentro ou acima)."""
    fx = _faixas_v3()
    return all(not (a >= f[0] > d) for a, d, f in zip(antes, depois, fx))


def _pede_protecao(cards, cmd_papeis):
    """Um comandante é habilitadora e o deck tem menos cartas de Resiliência 2 ou 3 do que a régua pede."""
    rc = regua()["comandante"].get("habilita") or {}
    return "habilita" in cmd_papeis and _resil(cards) < rc.get("resiliencia_min", 0)


def _faltando(av, cmd_papeis):
    R = regua()
    falta = [p for p in PAPEIS if av["pct"][p] < R["faixas_pct"][p][0]]
    if av["cont"]["multiplica"] > av["cont"]["habilita"] and "habilita" not in falta:
        falta.append("habilita")
    # o que a checagem do papel do comandante pede além das faixas (a mesma régua do veredito)
    cont, pct = av["cont"], av["pct"]
    for p in cmd_papeis:
        rc = R["comandante"].get(p) or {}
        pede = []
        if p == "habilita":
            pede = [("recompensa", pct["recompensa"] < rc["recompensa_min_pct"]), ("habilita", cont["habilita"] < rc["habilita_no_99_min"])]
        elif p == "multiplica":
            pede = [("habilita", cont["habilita"] < rc["habilita_min"]), ("recompensa", cont["recompensa"] < rc["recompensa_min"])]
        elif p == "recompensa":
            pede = [("habilita", pct["habilita"] < rc["habilita_min_pct"])]
        falta += [k for k, sim in pede if sim and k not in falta]
    return falta


def _sobrando(av, falta):
    R = regua()
    n = av["n"] or 1
    excesso = {p: av["cont"][p] - R["referencia_pct"][p] * n / 100 for p in PAPEIS if p not in falta}
    return max(excesso, key=excesso.get) if excesso else None


def _cortes(cards, sobra, entra, usados):
    """Quem pode sair: as do papel que sobra (fora tier S) e as de estrutura sem papel que são fracas (tier C ou D), fora
    comandante, intocáveis, estimação, terrenos (carta com terreno no verso conta como terreno: só terreno por terreno) e as de
    mais de uma cópia. As duas regras de fraqueza e do terreno no verso vêm do piloto do Clavileño, aprovado pelo dono."""
    R = regua()
    out = []
    terra = lambda x: bool(x.get("land") or x.get("mdfc"))
    for c in cards:
        if c.get("cmd") or c.get("nocut") or c.get("rel") == "INS" or c["q"] != 1 or c["id"] in usados:
            continue
        if terra(c) != terra(entra):
            continue
        if c.get("pp"):
            if c["pp"] != sobra or c.get("tier") in R["corte_papel_fora_tiers"]:
                continue
        elif c.get("tier") not in R["corte_estrutura_tiers"]:
            continue
        out.append(c)
    return out


def _trocar(cards, sai, entra):
    return [c for c in cards if c["id"] != sai["id"]] + [dict(entra, q=1)]


def _guloso(cards, grupos, entrantes, sobra, excluir=()):
    """Cada candidata com o melhor corte disponível, das que mais sobem o placar para as que menos (como no piloto: o pacote
    inteiro entra, inclusive a peça que só equilibra)."""
    atual, trocas, usados = list(cards), [], set(excluir)
    resta = list(entrantes)
    while resta:
        base = placar(atual, grupos)
        v0 = _contagem_v3(atual)
        melhor = None
        for e in resta:
            for c in _cortes(atual, sobra, e, usados):
                novo = _trocar(atual, c, e)
                if not _sem_furo(v0, _contagem_v3(novo)):
                    continue
                g = round(placar(novo, grupos) - base, 2)
                if melhor is None or g > melhor[0]:
                    melhor = (g, e, c, novo)
        if melhor is None:
            break
        g, e, c, atual = melhor
        usados.add(c["id"])
        trocas.append(dict(entra=e, sai=c, ganho=g))
        resta.remove(e)
    return atual, trocas


def _carta_avaliada(nome, a, grupos):
    """Uma candidata da Caixa ou de uma pasta como carta do deck: notas do cadastro, sinergia e papel de `avaliadas`."""
    import scryfall
    sc = scryfall._ler()
    k = sc["nomes"].get(nome.lower())
    r = sc["cartas"].get(k) if k else None
    cad = dados.ler_cadastro().get(nome)
    if not r or not cad:
        return None
    base = dados.montar_carta(nome, None, r, grupos, {})
    ks = [c["k"] for c in dados.regua()["criterios"]]
    s3 = list(a["sin"]) + [cad["n"].get(x, 0) for x in ks[2:]]
    return dict(base, id="cand-" + base["id"], q=1, s3=s3, pp=a["papel"], ppw=a.get("papel_por_que"), tier=None, rel=None, fx=a.get("papel_por_que", ""),
                **({"ppd": a["papel_dupla"]} if a.get("papel_dupla") else {}))


def _origem(nome, tem, outros):
    ch = dados.chave_nome(nome)
    if ch in tem:
        return tem[ch]
    if outros.get(ch):
        return "mover ou comprar"
    return "comprar"


def cenarios(pasta, m=None):
    """Os quatro cenários do método, com o placar antes e depois. Devolve None se o deck não tem plano classificado."""
    import caixa
    m = m or dados.montar(pasta, avisar=lambda *a: None)
    if not m.get("v3") or not m.get("plano"):
        return None
    cards, grupos = m["cards"], m["grupos"]
    cmd_p = [c["papel"] for c in m["plano"]["comandante"]]
    nomes_cmd = [c["n"].split(",")[0] for c in cards if c.get("cmd")]
    tribal = e_tribal(pasta)
    hoje = avaliar(cards, cmd_p, nomes_cmd, tribal)
    p0 = placar(cards, grupos)
    falta = _faltando(hoje, cmd_p)
    sobra = _sobrando(hoje, falta)
    # o que o dono já tem fora de deck (Caixa e pastas) e onde mais a carta aparece
    tem = {}
    for p, cs in dados.ler_pastas().items():
        for ch in cs:
            tem.setdefault(ch, "na Caixa" if p == "Caixa" else "na pasta " + p)
    outros = {}
    for p, d in caixa.info_decks().items():
        if p != pasta and not d["desejo"]:
            for ch in d["cartas"]:
                outros.setdefault(ch, []).append(d["curto"])
    no_deck = {dados.chave_nome(c.get("on", c["n"])) for c in cards}
    radar = [dict(c, q=1) for c in m["cands"] if c.get("pp")]
    av = m.get("avaliadas") or {}
    cand = [x for x in (_carta_avaliada(n, a, grupos) for n, a in av.items() if a.get("papel")) if x]
    proprias = [c for c in radar + cand if c["pp"] in falta and dados.chave_nome(c["n"]) in tem and dados.chave_nome(c["n"]) not in no_deck]
    vistos, proprias_u = set(), []
    for c in proprias:
        if c["n"] not in vistos:
            vistos.add(c["n"]); proprias_u.append(c)
    do_radar = [c for c in radar if c.get("verdict") == "entra" and c["pp"] in falta and c["n"] not in vistos]
    # comandante-habilitadora sem proteção: as "entra" do radar com Resiliência 2 ou 3 também contam, tenham papel ou não
    if _pede_protecao(cards, cmd_p):
        i_res = [x["k"] for x in dados.regua()["criterios"]].index("resiliencia")
        ja = {c["n"] for c in do_radar} | vistos
        do_radar += [dict(c, q=1) for c in m["cands"] if c.get("verdict") == "entra" and c["n"] not in ja and (c.get("s3") or [0] * 10)[i_res] >= 2]

    def linha(nome, sub, cs, trocas, aviso=None):
        a = avaliar(cs, cmd_p, nomes_cmd, tribal)
        p = placar(cs, grupos)
        return dict(k=nome, sub=sub, entra=[t["entra"]["n"] for t in trocas], sai=[t["sai"]["n"] for t in trocas], mistura=a["mistura"],
                    veredito=a["veredito"], placar=p, delta=round(p - p0, 2), aviso=aviso)

    out = [dict(k="hoje", sub="", entra=[], sai=[], mistura=hoje["mistura"], veredito=hoje["veredito"], placar=p0, delta=0, aviso=None)]
    # sem comprar nada
    cs1, t1 = _guloso(cards, grupos, proprias_u, sobra)
    out.append(linha("sem_comprar", "o que está na Caixa e nas pastas", cs1, t1))
    # radar como está: as trocas "entra" que mexem no papel que falta, com o corte do próprio radar
    cs2, t2 = list(cards), []
    for c in do_radar:
        sai = next((x for x in cs2 if x["id"] == c.get("sai")), None)
        if sai:
            t2.append(dict(entra=c, sai=sai, ganho=round(placar(_trocar(cs2, sai, c), grupos) - placar(cs2, grupos), 2)))
            cs2 = _trocar(cs2, sai, c)
    aviso = None
    p2 = placar(cs2, grupos)
    if t2 and p2 < p0:
        da = pontos_acel(cs2) - pontos_acel(cards)
        quem = [t["sai"]["n"] for t in t2 if t["ganho"] < 0]
        aviso = ("perde %s pontos de aceleração com a saída %s" % (fmt(-da), "do " + lista_pt(quem) if quem else "das cartas do radar")) if da < 0 else \
            "as cartas que entram valem menos nos critérios que as que saem"
    out.append(linha("radar", "equilibra, mas enfraquece" if aviso and t2 else "as trocas do radar", cs2, t2, aviso))
    # recomendado: as duas listas, com os melhores cortes
    cs3, t3 = _guloso(cards, grupos, proprias_u + do_radar, sobra)
    out.append(linha("recomendado", "os dois, com outros cortes" if t1 and t2 else "o melhor pacote", cs3, t3))
    # troca a troca, e os conflitos com o radar (o mesmo corte usado por outra carta do radar)
    trocas = []
    for t in t3:
        e = t["entra"]
        ch = dados.chave_nome(e["n"])
        org = _origem(e["n"], tem, outros)
        trocas.append(dict(entra=e["n"], papel=e.get("pp"), faz=e.get("ppw") or e.get("fx") or "", origem=org,
                           onde=outros.get(ch) or [], sai=t["sai"]["n"], sai_papel=t["sai"].get("pp"), sai_tier=t["sai"].get("tier"), ganho=t["ganho"]))
    notas = []
    cortes3 = {t["sai"]["id"]: t["sai"]["n"] for t in t3}
    for c in m["cands"]:
        if c.get("verdict") == "entra" and c.get("sai") in cortes3 and c["n"] not in [t["entra"]["n"] for t in t3]:
            _, t_alt = _guloso(cards, grupos, proprias_u + do_radar, sobra, excluir={c["sai"]})
            p_alt = placar(_aplicar(cards, t_alt), grupos)
            notas.append(dict(corte=cortes3[c["sai"]], radar=c["n"], total_alt=round(p_alt - p0, 2),
                              trocas_alt=[(x["entra"]["n"], x["sai"]["n"]) for x in t_alt]))
    return dict(hoje=hoje, falta=falta, sobra=sobra, placar=p0, cenarios=out, trocas=trocas, notas=notas, cmd=m["plano"]["comandante"], nomes_cmd=nomes_cmd)


def _aplicar(cards, trocas):
    cs = list(cards)
    for t in trocas:
        cs = _trocar(cs, t["sai"], t["entra"])
    return cs


def para_painel(pasta, m):
    """O que o quadro Plano do deck do painel recebe (D.plano): veredito, checagens, cenários, troca a troca e as cartas por papel."""
    if not m.get("v3"):
        return None
    if not m.get("plano"):
        return dict(classificado=False)
    c = cenarios(pasta, m)
    # o efeito de cada troca do radar no veredito (a candidata entra no lugar de quem o radar já tira)
    cmd_p = [x["papel"] for x in m["plano"]["comandante"]]
    radar = {}
    for x in m["cands"]:
        sai = next((y for y in m["cards"] if y["id"] == x.get("sai")), None)
        if sai and x.get("pp"):
            radar[x["id"]] = avaliar(_trocar(m["cards"], sai, x), cmd_p)["veredito"]
    return dict(radar=radar, classificado=True, veredito=c["hoje"]["veredito"], mistura=c["hoje"]["mistura"], n=c["hoje"]["n"], dupla=c["hoje"]["dupla"],
                checks=c["hoje"]["checks"], cmd=c["cmd"], nomes_cmd=c["nomes_cmd"], falta=c["falta"], placar=c["placar"],
                cenarios=c["cenarios"], trocas=c["trocas"], notas=c["notas"], ref=regua()["referencia_pct"], revisado=m["plano"].get("revisado"))


# ---------------------------------------------------------------- dossiê e gravação (o /plano)

def dossie(pasta, n_cand=10):
    import caixa, encaixe, scryfall
    m = dados.montar(pasta, avisar=lambda *a: None)
    t = dados.ler_json(os.path.join(dados.DADOS, pasta, "tema.json"), obrigatorio=False) or {}
    sc = scryfall._ler()
    ks = [c["k"] for c in dados.regua()["criterios"]]

    def texto(nome):
        k = sc["nomes"].get(nome.lower())
        r = sc["cartas"].get(k) if k else None
        if not r:
            return ""
        return r.get("oracle_text") or " // ".join(f.get("oracle_text", "") for f in (r.get("faces") or []))

    def item(c):
        return dict(nome=c["n"], tier=c.get("tier"), custo=c.get("cost"), tipo=c.get("line"), texto=texto(c["n"]), notas=dict(zip(ks, c.get("s3") or [])),
                    faz=c.get("fx", ""), papel=c.get("pp"))
    out = dict(deck=pasta, sinergias=t.get("sinergias"), comandante=[item(c) for c in m["cards"] if c.get("cmd")],
               cartas=[item(c) for c in m["cards"] if not c.get("cmd") and not c.get("pp") and not c.get("land")],
               radar=[dict(item(c), veredito=c.get("verdict")) for c in m["cands"] if not c.get("pp")])
    # as candidatas da Caixa e das pastas nas cores do deck, com maior encaixe nele
    cad = dados.ler_cadastro()
    m.update(pasta=pasta)
    no_deck = {dados.chave_nome(c.get("on", c["n"])) for c in m["cards"] + m["cands"]}
    nomes = {}
    for p, cs in dados.ler_pastas().items():
        for ch in cs:
            nomes.setdefault(ch, p)
    cands = []
    for ch, p in nomes.items():
        if ch in no_deck:
            continue
        k = sc["nomes"].get(ch)
        r = sc["cartas"].get(k) if k else None
        if not r:
            continue
        nome = r["name"].split(" // ")[0]
        g = encaixe.ganho(nome, m, cad)
        if g:
            cands.append((g["ganho"], nome, p, g))
    cands.sort(key=lambda x: -x[0])
    def tipo(nome):
        k = sc["nomes"].get(nome.lower())
        return (sc["cartas"].get(k) or {}).get("type_line", "") if k else ""
    def custo(nome):
        k = sc["nomes"].get(nome.lower())
        return (sc["cartas"].get(k) or {}).get("mana_cost", "") if k else ""
    out["candidatos"] = [dict(nome=n, origem=p, ganho=g["ganho"], avaliada=g["avaliada"], tipo=tipo(n), custo=custo(n), texto=texto(n),
                              notas=dict(zip(ks[2:], [(cad.get(n) or {}).get("n", {}).get(x, 0) for x in ks[2:]]))) for _, n, p, g in cands[:n_cand]]
    return out


def gravar(arquivo, hoje=None):
    """{pasta: {"comandante": [{papel, por_que}], "cartas": {nome: {papel, papel_dupla, papel_por_que}}, "candidatos": {...}}}:
    deck e radar no avaliacao.json; candidatas da Caixa e das pastas na chave `avaliadas` (sem entrar no radar)."""
    import caixa
    hoje = hoje or datetime.date.today().isoformat()
    with open(arquivo, encoding="utf-8") as f:
        novo = json.load(f)
    feitos = []
    for pasta, d in novo.items():
        p, av, ind, nl = caixa._ler_av(pasta)
        # o dossiê usa o nome que está na carta física (Argonath, Pillars of the Kings); o avaliacao.json, às vezes, o oficial (The Ozolith)
        m = dados.montar(pasta, avisar=lambda *a: None)
        oficial = {c["n"]: c.get("on") for c in m["cards"] + m["cands"] if c.get("on")}
        for n, x in (d.get("cartas") or {}).items():
            alvo = None
            for k in (n, oficial.get(n)):
                alvo = alvo or (av.get("cartas") or {}).get(k) or (av.get("radar") or {}).get(k)
            if alvo is None:
                raise SystemExit("%s: %s não está no deck nem no radar" % (pasta, n))
            _por(alvo, x, pasta, n)
            feitos.append((pasta, n))
        for n, x in (d.get("candidatos") or {}).items():
            a = av.setdefault("avaliadas", {}).setdefault(n, {"sin": {}, "sin_por_que": {}, "em": hoje, "fonte": "plano"})
            _por(a, x, pasta, n)
            feitos.append((pasta, n))
        if d.get("comandante"):
            av["plano"] = {"comandante": d["comandante"], "revisado": hoje}
        dados.conferir_plano(av.get("plano"), [1] * len(d.get("comandante") or [1]))
        dados.ler_avaliadas(av)
        for n, a in list((av.get("cartas") or {}).items()) + list((av.get("radar") or {}).items()):
            if a.get("papel") and (a["papel"] not in PAPEIS or not str(a.get("papel_por_que") or "").strip()):
                raise SystemExit("%s: %s com papel sem porquê" % (pasta, n))
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(av, ensure_ascii=False, indent=ind) + ("\n" if nl else ""))
    return feitos


def _por(alvo, x, pasta, n):
    papel = x.get("papel")
    if papel is not None and papel not in PAPEIS:
        raise SystemExit("%s, %s: papel %r" % (pasta, n, papel))
    if papel and not str(x.get("papel_por_que") or "").strip():
        raise SystemExit("%s, %s: papel sem porquê" % (pasta, n))
    for k in ("papel", "papel_dupla", "papel_por_que"):
        if x.get(k):
            alvo[k] = x[k]
        else:
            alvo.pop(k, None)


# ---------------------------------------------------------------- linha de comando

VER = {"excelente": "Excelente", "satisfatorio": "Satisfatório", "insuficiente": "Insuficiente", None: "Ainda não classificado"}
CEN = {"hoje": "Hoje", "sem_comprar": "Sem comprar nada", "radar": "Radar como está", "recomendado": "Recomendado"}


def main():
    import argparse
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    ap = argparse.ArgumentParser(description="O Plano do deck: papéis, veredito e cenários.")
    ap.add_argument("--deck", help="a pasta do deck")
    ap.add_argument("--dossie", metavar="ARQUIVO", help="com --deck: grava o dossiê do que falta classificar")
    ap.add_argument("--gravar", metavar="ARQUIVO", help="grava papéis de deck, radar, comandante e candidatas")
    a = ap.parse_args()
    if a.gravar:
        for p, n in gravar(a.gravar):
            print("papel: %s em %s" % (n, p))
        return
    if not a.deck:
        ap.error("--deck ou --gravar")
    if a.dossie:
        d = dossie(a.deck)
        with open(a.dossie, "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=1)
        print("dossiê: %d cartas do deck e %d do radar sem papel, %d candidatas da Caixa e das pastas" % (len(d["cartas"]), len(d["radar"]), len(d["candidatos"])))
        return
    c = cenarios(a.deck)
    if c is None:
        print("%s: ainda não classificado (sem o bloco plano no avaliacao.json)" % a.deck)
        return
    h = c["hoje"]
    print("%s: %s · plano com %d cartas (%s) · dupla função %d" % (a.deck, VER[h["veredito"]], h["n"], " · ".join("%d %s" % (h["cont"][p], NOMES[p].lower()) for p in PAPEIS), h["dupla"]))
    for k in h["checks"]:
        print("  %s %s" % ({"ok": "✓", "aviso": "!", "falha": "✗"}[k["s"]], k["t"]))
    for x in c["cenarios"]:
        print("  %-17s %-12s %s · placar %s (%s)%s" % (CEN[x["k"]], VER[x["veredito"]], "·".join(map(str, x["mistura"])), fmt(x["placar"]), sinal(x["delta"]),
                                                     "  — " + x["aviso"] if x.get("aviso") else ""))
        if x["entra"]:
            print("      entra %s; sai %s" % (lista_pt(x["entra"]), lista_pt(x["sai"])))
    for t in c["trocas"]:
        print("    %s no lugar de %s (%s, %s): %s" % (t["entra"], t["sai"], NOMES[t["papel"]].lower(), t["origem"], sinal(t["ganho"])))
    for n in c["notas"]:
        print("    nota: %s também é o corte do %s no radar; sem ele, o pacote fica em %s" % (n["corte"], n["radar"], sinal(n["total_alt"])))


if __name__ == "__main__":
    main()
