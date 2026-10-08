# -*- coding: utf-8 -*-
"""Confere os dados de um deck contra o contrato (contexto/ARQUITETURA.md) e se o motor recusa dados quebrados.

    python testes/contrato.py --deck "02. Clavileno"
"""
import json, os, shutil, tempfile
import comum
import build, dados

a = comum.argumentos("Contrato de dados de um deck")
R = comum.Relatorio("contrato: " + a.deck)
pasta = a.deck
base = os.path.join(comum.RAIZ, "dados", pasta)

try:
    d = dados.montar(pasta, avisar=lambda *x: None)
    R.ok("dados do deck aceitos pelo motor", True)
except dados.ErroDeck as e:
    R.ok("dados do deck aceitos pelo motor", False, e)
    R.fim()

lista = dados.ler_decklist(os.path.join(base, "decklist.txt"))
R.ok("decklist com 100 cartas", sum(e["q"] for e in lista) == 100, sum(e["q"] for e in lista))
R.ok("um comandante só", sum(1 for e in lista if e["cmd"]) == 1)
R.ok("de 6 a 10 agrupamentos", 6 <= len(d["grupos"]) <= 10, len(d["grupos"]))
R.ok("toda carta com o porquê escrito", all(c["why"].strip() for c in d["cards"] + d["cands"]),
     [c["n"] for c in d["cards"] + d["cands"] if not c["why"].strip()][:3])
R.ok("toda carta com o que faz", all(c["fx"].strip() for c in d["cards"] + d["cands"]))
t = dados.ler_json(os.path.join(base, "tema.json"), obrigatorio=False) or {}
try:
    build.conferir_tema(t)
    R.ok("tema.json válido", True)
except dados.ErroDeck as e:
    R.ok("tema.json válido", False, e)
fora = sorted(set(t.get("agrupamentos") or {}) - {g["k"] for g in d["grupos"]})
R.ok("cores do tema só para agrupamentos que existem", not fora, fora)
R.ok("arquivos de fora ficam em entrada/", not [f for f in os.listdir(base) if f not in (
    "deck.md", "decklist.txt", "tema.json", "avaliacao.json", "comunidade.json", "CONFRONTO.md", "HISTORICO.md", "Abrir o painel.html", "entrada")
    and not f.startswith("capa.")], [f for f in os.listdir(base)][:12])

# o motor recusa dados quebrados, com mensagem que diz onde está o erro
tmp = tempfile.mkdtemp(prefix="mtg-contrato-")


def recusa(nome, mexer, espera):
    alvo = os.path.join(tmp, nome)
    shutil.copytree(base, alvo, ignore=shutil.ignore_patterns("entrada"))
    p = os.path.join(alvo, "avaliacao.json")
    av = json.load(open(p, encoding="utf-8"))
    mexer(av)
    json.dump(av, open(p, "w", encoding="utf-8"), ensure_ascii=False)
    velho = dados.DADOS
    dados.DADOS = tmp
    try:
        dados.montar(nome, avisar=lambda *x: None)
        R.ok("recusa: " + nome, False, "aceitou")
    except dados.ErroDeck as e:
        R.ok("recusa: " + nome, espera in str(e), str(e)[:90])
    finally:
        dados.DADOS = velho


try:
    primeira = None

    def nota4(av):
        c = next(iter(av["cartas"].values())); c["notas"][av["agrupamentos"][1]["k"]] = 4

    def sem_avaliacao(av):
        av["cartas"].pop(next(n for n in av["cartas"] if "First of" not in n))

    def onze(av):
        av["agrupamentos"] += [dict(k="x%d" % i, nome="X%d" % i, ab="X", desc="teste") for i in range(11 - len(av["agrupamentos"]))]

    def marca(av):
        next(iter(av["cartas"].values()))["marcas"] = {"inexistente": 1}

    def tier(av):
        next(iter(av["cartas"].values()))["tier"] = "Z"

    def sai(av):
        next(iter(av["radar"].values()))["sai"] = "Carta Que Não Existe"

    def leitura(av):
        av["leituras"].append({"tipo": "agrupamento", "g": "nao-existe", "min": 1, "rotulo": ["a", "b"]})

    recusa("nota-4", nota4, "vale de")
    recusa("carta-sem-avaliacao", sem_avaliacao, "sem avaliação")
    recusa("onze-agrupamentos", onze, "de 6 a 10")
    recusa("marca-nao-declarada", marca, "não está declarada")
    recusa("tier-invalido", tier, "tier")
    recusa("sai-fora-do-deck", sai, "não está no deck")
    recusa("leitura-quebrada", leitura, "não existe")
finally:
    shutil.rmtree(tmp, ignore_errors=True)
R.fim()
