# -*- coding: utf-8 -*-
"""Confere os dados de um deck contra o contrato (contexto/ARQUITETURA.md) e se o motor recusa dados quebrados.

    python testes/contrato.py --deck "02. Clavileño"
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
R.ok("um comandante, ou dois parceiros", sum(1 for e in lista if e["cmd"]) in (1, 2))
R.ok("de 6 a 10 agrupamentos", 6 <= len(d["grupos"]) <= 10, len(d["grupos"]))
R.ok("toda carta com o porquê escrito", all(c["why"].strip() for c in d["cards"] + d["cands"]),
     [c["n"] for c in d["cards"] + d["cands"] if not c["why"].strip()][:3])
R.ok("toda carta com o que faz", all(c["fx"].strip() for c in d["cards"] + d["cands"]))
R.ok("plano do deck (opcional): papel válido e com porquê em toda carta que tem papel", all(c.get("pp") in (None,) + dados.PAPEIS and (not c.get("pp") or (c.get("ppw") or "").strip()) for c in d["cards"] + d["cands"]))
t = dados.ler_json(os.path.join(base, "tema.json"), obrigatorio=False) or {}
try:
    build.conferir_tema(t)
    R.ok("tema.json válido", True)
except dados.ErroDeck as e:
    R.ok("tema.json válido", False, e)
fora = sorted(set(t.get("agrupamentos") or {}) - {g["k"] for g in d["grupos"]})
R.ok("cores do tema só para agrupamentos que existem", not fora, fora)
R.ok("arquivos de fora ficam em entrada/", not [f for f in os.listdir(base) if f not in (
    "deck.md", "decklist.txt", "tema.json", "avaliacao.json", "comunidade.json", "confrontos.json", "CONFRONTO.md", "HISTORICO.md", "Abrir o painel.html", "entrada")
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

    def pacote(av):
        next(iter(av["cartas"].values()))["pacote"] = "nao-existe"

    def caro(av):
        next(iter(av["cartas"].values()))["caro_por_desenho"] = "sim"

    def papel(av):   # Plano do deck: papel fora da lista
        next(iter(av["cartas"].values()))["papel"] = "rainha"

    def papel_sem_porque(av):
        c = next(iter(av["cartas"].values())); c["papel"] = "habilita"; c.pop("papel_por_que", None)

    def plano_cmd(av):
        av["plano"] = {"comandante": [{"papel": "habilita"}], "revisado": "2026-10-18"}

    recusa("papel-invalido", papel, "papel")
    recusa("papel-sem-porque", papel_sem_porque, "papel_por_que")
    recusa("plano-comandante-sem-porque", plano_cmd, "avaliacao.json, plano")
    recusa("nota-4", nota4, "vale de")
    recusa("pacote-inexistente", pacote, "não é um agrupamento")
    recusa("caro-por-desenho-nao-booleano", caro, "caro_por_desenho")
    recusa("carta-sem-avaliacao", sem_avaliacao, "sem avaliação")
    recusa("onze-agrupamentos", onze, "de 6 a 10")
    recusa("marca-nao-declarada", marca, "não está declarada")
    recusa("tier-invalido", tier, "tier")
    recusa("sai-fora-do-deck", sai, "não está no deck")
    recusa("leitura-quebrada", leitura, "não existe")
finally:
    shutil.rmtree(tmp, ignore_errors=True)

# ---------------- o Grimório (dados/grimorio/grimorio.json, contexto/ARQUITETURA.md "O Grimório"), quando já houve leitura
import grimorio  # noqa: E402
G = grimorio.ler_grimorio()
if G:
    L = grimorio.ler_lentes()
    ks = {l["k"] for l in L["tema"]} | {l["k"] for l in L["cor"]}
    R.ok("grimório: versão 1, com a data da leitura, as lentes e as cartas", G.get("versao") == 1 and bool(G.get("lido")) and isinstance(G.get("lentes"), list) and isinstance(G.get("cartas"), dict))
    R.ok("grimório: toda lente do lentes.json está no grimorio.json, com tipo, lista e o caminho que respondeu ou o motivo",
         {l["k"] for l in G["lentes"]} == ks and all(l.get("tipo") in ("tema", "cor") and isinstance(l.get("cartas"), list) and bool(l.get("caminho") or l.get("erro")) for l in G["lentes"]),
         sorted(ks ^ {l["k"] for l in G["lentes"]}))
    teto = L["teto"]["mais_incluidas"] + L["teto"]["maior_sinergia"]
    R.ok("grimório: nenhuma lente passa do teto (%d)" % teto, all(len(l["cartas"]) <= teto for l in G["lentes"]), max(len(l["cartas"]) for l in G["lentes"]))
    R.ok("grimório: toda carta de toda lente tem registro, e toda carta está em alguma lente",
         all(n in G["cartas"] for l in G["lentes"] for n in l["cartas"]) and all(c.get("lentes") for c in G["cartas"].values()))
    campos = ("n", "ci", "cost", "cmc", "t", "o", "lentes", "onde", "pastas", "st", "rende", "notas", "nv", "ponta")
    R.ok("grimório: toda carta com os campos do contrato", all(all(k in c for k in campos) for c in G["cartas"].values()),
         [n for n, c in G["cartas"].items() if not all(k in c for k in campos)][:3])
    R.ok("grimório: status só Tenho, Ociosa ou Falta, e nenhuma banida", all(c["st"] in ("tenho", "ociosa", "falta") and c.get("leg") != "banned" for c in G["cartas"].values()))
    R.ok("grimório: as lentes de cada carta batem com as listas", all(set(c["lentes"]) == {l["k"] for l in G["lentes"] if n in l["cartas"]} for n, c in G["cartas"].items()))
    fora = set(dados.BASICOS_IDX) | {x for x in L["teto"]["fora_das_lentes_de_tema"] if x.lower() not in ("básicos", "basicos")}
    R.ok("grimório: básicos, Sol Ring, Arcane Signet e Command Tower fora das lentes de tema", not [n for l in G["lentes"] if l["tipo"] == "tema" for n in l["cartas"] if n in fora])
    crit = {x["k"] for x in dados.regua()["criterios"]}
    R.ok("grimório: nota só do cadastro, nos critérios da régua, de 1 a 3", all(c["notas"] is None or (set(c["notas"]) <= crit and all(v in (1, 2, 3) for v in c["notas"].values())) for c in G["cartas"].values()))
    R.ok("grimório: sem preço no dado", not any(k in c for c in G["cartas"].values() for k in ("usd", "usd_foil", "usd_etched", "preco")))
    R.ok("grimório: ponta de lança = duas lentes de tema, ou uma e nota 3", all(
        bool(c["ponta"]) == (len([k for k in c["lentes"] if k in {l["k"] for l in L["tema"]}]) >= 2 or (len([k for k in c["lentes"] if k in {l["k"] for l in L["tema"]}]) == 1 and 3 in (c["notas"] or {}).values()))
        for c in G["cartas"].values()))
R.fim()
