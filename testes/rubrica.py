# -*- coding: utf-8 -*-
"""Teste da rubrica da pontuação v3, em todos os decks migrados (os que têm "versao_pontuacao": 3).

    python testes/rubrica.py

Confere, sem o JavaScript e sem o placar do motor:
- o cadastro único: toda carta do deck e do radar tem entrada, notas de 0 a 3 só nos oito critérios da carta, porquê e fonte;
- as sinergias do deck: nome e régua no tema.json, aprovadas, e o porquê de cada nota de sinergia no avaliacao.json;
- o placar refeito à mão, a partir dos arquivos (decklist, cadastro, sinergias, régua), igual ao do motor e ao do controle.
"""
import json, math, os, sys
sys.dont_write_bytecode = True
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, "motor"))
import comum  # noqa: E402
import dados, hub  # noqa: E402

R = comum.Relatorio("rubrica da pontuação v3")
with open(os.path.join(RAIZ, "motor", "pontuacao.json"), encoding="utf-8") as f:
    REGUA = json.load(f)
CRIT = [c["k"] for c in REGUA["criterios"]]
PESO = {c["k"]: c["peso"] for c in REGUA["criterios"]}
DA_CARTA = [c["k"] for c in REGUA["criterios"] if not c.get("do_deck")]
PN = REGUA["pontos_por_nota"]
with open(os.path.join(RAIZ, "dados", "cartas.json"), encoding="utf-8") as f:
    CAD = json.load(f)["cartas"]

# o cadastro inteiro: notas válidas, porquê e fonte
ruins = []
for nome, e in CAD.items():
    for k, v in (e.get("n") or {}).items():
        if k not in DA_CARTA or not isinstance(v, int) or not 0 <= v <= 3:
            ruins.append("%s: %s=%r" % (nome, k, v))
    if not str(e.get("por_que", "")).strip():
        ruins.append("%s: sem porquê" % nome)
    if e.get("fonte") not in ("auto", "claude", "dono"):
        ruins.append("%s: fonte %r" % (nome, e.get("fonte")))
R.ok("cadastro único: %d cartas com notas de 0 a 3 nos critérios da carta, porquê e fonte" % len(CAD), not ruins, ruins[:5])


def pontos_acel(y):
    a = REGUA["aceleracao"]
    return 0 if y < 0 else min(a["teto"], a["piso"] + a["pontos_por_passo"] * math.floor(y / a["passo"]))


v3 = []
for pasta in sorted(os.listdir(os.path.join(RAIZ, "dados"))):
    ap = os.path.join(RAIZ, "dados", pasta, "avaliacao.json")
    if pasta.startswith("_") or not os.path.exists(ap):
        continue
    with open(ap, encoding="utf-8") as f:
        av = json.load(f)
    if av.get("versao_pontuacao") != 3:
        continue
    v3.append(pasta)
    with open(os.path.join(RAIZ, "dados", pasta, "tema.json"), encoding="utf-8") as f:
        tm = json.load(f)
    sn = tm.get("sinergias") or {}
    R.ok("%s: as duas sinergias com nome e régua" % pasta, all(str((sn.get(k) or {}).get(c, "")).strip() for k in ("sin1", "sin2") for c in ("nome", "regra")), sn.keys())
    R.ok("%s: sinergias aprovadas pelo dono" % pasta, bool(str(sn.get("aprovado", "")).strip()), sn.get("aprovado"))
    sem_cad, sem_pq = [], []
    for sec in ("cartas", "radar"):
        for nome, a in (av.get(sec) or {}).items():
            if nome.startswith("_"):
                continue
            if nome.split(" // ")[0] not in CAD:
                sem_cad.append(nome)
            for k, v in (a.get("sin") or {}).items():
                if v and not str((a.get("sin_por_que") or {}).get(k, "")).strip():
                    sem_pq.append("%s %s" % (nome, k))
    R.ok("%s: toda carta do deck e do radar no cadastro" % pasta, not sem_cad, sem_cad[:5])
    R.ok("%s: toda nota de sinergia com o porquê" % pasta, not sem_pq, sem_pq[:5])

    # placar à mão: decklist (quantidade) + cadastro + sinergias + régua; CMC do Scryfall, pelo motor
    m = dados.montar(pasta, avisar=lambda *x: None)
    soma, ace, cmc, nl = 0.0, 0, 0.0, 0
    for c in m["cards"]:
        nome = c.get("on", c["n"])
        a = (av.get("cartas") or {}).get(nome) or (av.get("cartas") or {}).get(c["n"]) or {}
        n = dict(CAD[nome.split(" // ")[0]]["n"])
        n.update({k: v for k, v in (a.get("sin") or {}).items() if v})
        n.update({k: v for k, v in (a.get("ajustes") or {}).items() if k != "motivo"})
        soma += c["q"] * sum(PESO[k] * PN[v] for k, v in n.items() if v)
        ace += c["q"] * n.get("aceleradores", 0)
        if not c.get("land"):
            nl += c["q"]
            cmc += c["q"] * c["cmc"]
    media = cmc / nl if nl else 0
    total = soma + pontos_acel(ace / media if media else 0)
    pm, _ = hub.placar(m["cards"], m["grupos"], True)
    R.ok("%s: placar refeito à mão igual ao do motor" % pasta, abs(total - pm) < 1e-9, (total, pm))
    ctl = comum.controle(pasta).get("placar_v3")
    if ctl is not None:
        R.ok("%s: placar refeito à mão igual ao do controle" % pasta, abs(total - ctl) < 1e-9, (total, ctl))
    R.nota("%s: placar %s (critérios %s + aceleração %s)" % (pasta, total, soma, total - soma))

R.ok("há deck na pontuação v3", bool(v3), v3)

# encaixe (DADOS.md, seção 4), refeito à mão a partir dos arquivos e comparado com o que o painel embute (D.encaixe)
import re  # noqa: E402
SAT = REGUA["saturacao"]
FAIXA = {c["k"]: c["faixa"] for c in REGUA["criterios"]}
MON = {p_: dados.montar(p_, avisar=lambda *x: None) for p_ in v3}


def notas_mao(nome, pasta):
    m = MON[pasta]
    for c in m["cards"] + m["cands"]:
        if c.get("on", c["n"]).split(" // ")[0] == nome.split(" // ")[0]:
            return dict(zip(CRIT, c["s3"]))
    return dict(CAD[nome.split(" // ")[0]]["n"])


def ganho_mao(nome, pasta, terra):
    m = MON[pasta]
    n2 = {k: sum(c["q"] for c in m["cards"] if c["s3"][i] >= SAT.get("conta_com_nota_minima", 2)) for i, k in enumerate(CRIT)}
    mult = {k: SAT["abaixo"] if n2[k] < FAIXA[k][0] else SAT["acima"] if n2[k] > FAIXA[k][1] else SAT["dentro"] for k in CRIT}
    val = lambda nt, ml=None: sum(PESO[k] * PN[v] * (ml[k] if ml else 1) for k, v in nt.items() if v)
    # terreno troca com terreno; carta com terreno no verso (MDFC) conta como terreno
    cands = [c for c in m["cards"] if not c.get("cmd") and not c.get("nocut") and bool(c.get("land") or c.get("mdfc")) == terra and c["q"] == 1]
    sai = min(cands, key=lambda c: (val(dict(zip(CRIT, c["s3"]))), c["n"]))
    return round(val(notas_mao(nome, pasta), mult) - val(dict(zip(CRIT, sai["s3"]))), 2), sai["n"]


for pasta in v3:
    with open(os.path.join(RAIZ, "saidas", pasta + ".html"), encoding="utf-8") as f:
        D = json.loads(re.search(r"var D = (\{.*?\});\nvar M = ", f.read(), re.S).group(1))
    enc = D.get("encaixe") or {}
    R.ok("%s: o painel traz o encaixe de toda carta do deck e do radar" % pasta, all(c["id"] in enc for c in D["cards"] + D["cands"] if not c.get("cmd")), len(enc))
    erros = []
    for c in (D["cands"] + D["cards"])[:25]:
        if c.get("cmd"):
            continue
        for e in enc.get(c["id"], []):
            g, sai = ganho_mao(c.get("on", c["n"]), e["p"], bool(c.get("land") or c.get("mdfc")))
            if abs(g - e["g"]) > 1e-6 or sai != e["s"]:
                erros.append("%s em %s: painel %s/%s, à mão %s/%s" % (c["n"], e["p"], e["g"], e["s"], g, sai))
    R.ok("%s: ganho e quem sai, refeitos à mão, iguais aos do painel (25 cartas)" % pasta, not erros, erros[:3])
R.fim()
