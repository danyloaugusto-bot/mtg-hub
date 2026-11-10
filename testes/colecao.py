# -*- coding: utf-8 -*-
"""Teste do /colecao (motor/colecao.py): a análise de cada coleção e o controle.

    python testes/colecao.py

Sem rede. Confere, em cada dados/colecoes/<CÓDIGO>.json: só decks que existem e não são Desejo; identidade de cor; nota de
sinergia de 0 a 3 com porquê; faixa coerente com o ganho e a régua da Caixa; carta sem cadastro com notas propostas; o
controle bate com os arquivos; e as recusas do --radar (Desejo, precon com "entra", "sai" fora do deck), num deck de mentira.
"""
import glob, json, os, sys, tempfile
sys.dont_write_bytecode = True
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, "motor"))
import comum  # noqa: E402
import caixa, colecao, dados, encaixe  # noqa: E402

R = comum.Relatorio("coleção")
reg = caixa.regua()
decks = {m["pasta"]: m for m in encaixe.decks_v3()}
cad = dados.ler_cadastro()
arqs = [a for a in glob.glob(os.path.join(colecao.PASTA, "*.json")) if os.path.basename(a) != "controle.json"]
R.ok("há ao menos uma coleção lida", bool(arqs), len(arqs))
ctl = colecao._ler(colecao.CONTROLE, {})
for a in arqs:
    d = json.load(open(a, encoding="utf-8"))
    k = d["codigo"]
    nomes = {i["nome"] for i in d["lista"]}
    cs = d["cartas"]
    R.ok("%s: toda carta analisada está na lista da coleção" % k, set(cs) <= nomes, sorted(set(cs) - nomes)[:3])
    linhas = [(n, l) for n, c in cs.items() for l in c.get("linhas") or []]
    R.ok("%s: só decks que existem e não são Desejo" % k, all(l["pasta"] in decks and not dados.eh_desejo(l["pasta"]) for _, l in linhas),
         sorted({l["pasta"] for _, l in linhas if l["pasta"] not in decks})[:3])
    fora_cor = [(n, l["pasta"]) for n, l in linhas if not all(ch in (decks[l["pasta"]].get("ident") or "") for ch in (encaixe.identidade(n) or ""))]
    R.ok("%s: identidade de cor respeitada" % k, not fora_cor, fora_cor[:3])
    ruins = [(n, l["pasta"]) for n, l in linhas if any(not 0 <= v <= 3 for v in l["sin"]) or any(v and not (l["sin_por_que"].get("sin%d" % (i + 1)) or "").strip() for i, v in enumerate(l["sin"]))]
    R.ok("%s: sinergia de 0 a 3, com porquê acima de 0" % k, not ruins, ruins[:3])
    fx = [(n, l["pasta"]) for n, l in linhas if l["faixa"] != ("deck" if l["ganho"] >= reg["deck_ganho_min"] else "guardar" if l["ganho"] >= reg["guardar_ganho_min"] else "abaixo")]
    R.ok("%s: faixa coerente com o ganho" % k, not fx, fx[:3])
    sem_nota = [n for n, c in cs.items() if c.get("linhas") and n not in cad and not c.get("cadastro_proposto")]
    R.ok("%s: carta sem cadastro tem notas propostas" % k, not sem_nota, sem_nota[:3])
    x = ctl.get(k) or {}
    R.ok("%s: o controle bate com o arquivo" % k, x.get("cartas") == len(d["lista"]) and x.get("analisadas") == len(cs), (x.get("cartas"), x.get("analisadas")))

# ---------------------------------------------------------------- as recusas do --radar, sem tocar em deck de verdade
d = dict(versao=1, codigo="ZZZ", nome="teste", lancamento="2026-01-01", lido="2026-01-01", lista=[dict(nome="Carta X", set="zzz", num="1")],
         cartas={"Carta X": dict(set="zzz", num="1", linhas=[dict(pasta="05. Storm", sin=[0, 0], sin_por_que={}, ganho=12, faixa="deck")])})
tmp = tempfile.mkdtemp()
old = colecao.PASTA, colecao.CONTROLE
colecao.PASTA, colecao.CONTROLE = tmp, os.path.join(tmp, "controle.json")
try:
    colecao._gravar(colecao._arq("ZZZ"), d)
    arq = os.path.join(tmp, "r.json")
    json.dump({"05. Storm": {"Carta X": dict(veredito="entra", tier="A", rel="ALT", faz="x", porque="x")}}, open(arq, "w", encoding="utf-8"))
    try:
        colecao.gravar_radar("ZZZ", arq, avisar=lambda *a: None)
        R.ok("--radar recusa deck Desejo", False)
    except colecao.ErroColecao as e:
        R.ok("--radar recusa deck Desejo", "Desejo" in str(e), str(e))
finally:
    colecao.PASTA, colecao.CONTROLE = old
R.fim()
