# -*- coding: utf-8 -*-
"""Teste da Consulta (motor/consulta.py; contexto/consulta/CONSULTA.md).

    python testes/consulta.py

Sem rede: usa uma carta que já está no cache do Scryfall e no cadastro (Vampire Nighthawk) e grava o registro numa pasta
temporária, nunca em dados/consultas/. Confere a leitura do link, a identidade de cor, o encaixe contra a conta do
encaixe.py, as recusas (nota fora da régua, nota sem porquê, deck faltando ou sobrando, veredito sem porquê, quem sai fora
do deck) e que nada é gravado nos decks.
"""
import json, os, sys, tempfile
sys.dont_write_bytecode = True
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, "motor"))
import comum  # noqa: E402
import consulta, dados, encaixe  # noqa: E402

R = comum.Relatorio("consulta")
CARTA = "Vampire Nighthawk"
TMP = tempfile.mkdtemp(prefix="consulta-")          # o registro
ENT = tempfile.mkdtemp(prefix="consulta-entrada-")  # os JSON que o Claude escreveria


def recusa(f, *a, **k):
    try:
        f(*a, **k)
    except consulta.ErroConsulta as e:
        return str(e)
    return None


def grava(obj):
    p = os.path.join(ENT, "entrada-%d.json" % len(os.listdir(ENT)))
    with open(p, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, ensure_ascii=False)
    return p


# ---------------------------------------------------------------- o pedido
R.ok("link da carta no Scryfall", consulta.ler_pedido("https://scryfall.com/card/trk/127/salt-vampire") == ("carta", "trk", "127"))
R.ok("link da API do Scryfall", consulta.ler_pedido("https://api.scryfall.com/cards/TRK/127") == ("carta", "trk", "127"))
R.ok("busca do Scryfall", consulta.ler_pedido("https://scryfall.com/search?q=set%3Atrk+t%3Avampire&unique=cards&as=grid") == ("busca", "set:trk t:vampire"))
R.ok("nome em inglês", consulta.ler_pedido("  Vampire Nighthawk ") == ("nome", "Vampire Nighthawk"))
R.ok("link de outro site é recusado", recusa(consulta.ler_pedido, "https://edhrec.com/cards/salt-vampire") is not None)
R.ok("link do Scryfall que não é carta nem busca é recusado", recusa(consulta.ler_pedido, "https://scryfall.com/sets/trk") is not None)
R.ok("nome de arquivo sem os caracteres que o Windows recusa", consulta.arquivo("Circle of Protection: Red") == "Circle of Protection - Red.json"
     and consulta.arquivo("Fire // Ice") == "Fire.json" and not any(ch in consulta.arquivo('A/B\\C*D?"E<F>G|H') for ch in '/\\*?"<>|:'))

# ---------------------------------------------------------------- a pasta do registro não é deck
R.ok("dados/consultas não é deck (PASTAS_FORA)", "consultas" not in dados.pastas_decks() and not dados.eh_deck("consultas"))

# ---------------------------------------------------------------- o dossiê
cad = dados.ler_cadastro()
R.ok("a carta do teste está no cadastro", CARTA in cad)
d = consulta.dossie(CARTA, rede=False, avisar=lambda *a: None, pasta=TMP)
todos = encaixe.decks_v3()
nas_cores = [m["pasta"] for m in todos if all(ch in (m.get("ident") or "") for ch in d["carta"]["ci"])]
R.ok("identidade: os decks do dossiê são exatamente os que têm as cores da carta", [x["pasta"] for x in d["decks"]] == nas_cores, len(nas_cores))
R.ok("identidade: os outros ficam fora, e a soma dá todos os decks v3", len(d["decks"]) + len(d["fora_da_identidade"]) == len(todos)
     and not set(d["fora_da_identidade"]) & set(nas_cores))
R.ok("cada deck traz as duas sinergias com a régua", all(set(x["sinergias"]) == {"sin1", "sin2"} and all(v["regra"] for v in x["sinergias"].values()) for x in d["decks"]))
R.ok("as comparáveis vêm da mais fraca para a mais forte", all([c["valor"] for c in x["comparaveis"]] == sorted(c["valor"] for c in x["comparaveis"]) for x in d["decks"]))
onde = {x["pasta"]: x["situacao"]["onde"] for x in d["decks"]}
R.ok("a carta que já está num deck aparece como 'deck' nele", "deck" in onde.values(), sorted(set(onde.values())))
R.ok("força sozinha: valor próprio e mediana do cadastro", d["forca"]["valor_proprio"] is not None and d["forca"]["mediana"] is not None)
R.ok("sem pedido de cadastro para carta que já tem", d["pedido_cadastro"] is None)

# ---------------------------------------------------------------- o encaixe
zeros = {x["pasta"]: {"sin": {"sin1": 0, "sin2": 0}} for x in d["decks"]}
r0 = consulta.calcular(CARTA, grava(zeros), avisar=lambda *a: None, pasta=TMP)
por = {m["pasta"]: m for m in todos}
info = dict(cmc=d["carta"]["cmc"], land=d["carta"]["terreno"], mdfc=d["carta"]["mdfc"])
iguais = all(abs(x["ganho"] - encaixe.ganho(CARTA, por[x["pasta"]], cad, info)["ganho"]) < 1e-9 for x in r0["encaixe"] if x["situacao"]["onde"] in ("nova", "deck", "radar"))
R.ok("com sinergia 0, o ganho é o mesmo do encaixe.py (o piso)", iguais)
R.ok("o encaixe vem em ordem de ganho", [x["ganho"] for x in r0["encaixe"]] == sorted((x["ganho"] for x in r0["encaixe"]), reverse=True))
nova = next((x["pasta"] for x in d["decks"] if x["situacao"]["onde"] == "nova"), None)
R.ok("há um deck em que a carta é nova", nova is not None)
dois = dict(zeros, **{nova: {"sin": {"sin1": 2, "sin2": 0}, "sin_por_que": {"sin1": "teste"}}})
r2 = consulta.calcular(CARTA, grava(dois), avisar=lambda *a: None, pasta=TMP)
g0 = next(x for x in r0["encaixe"] if x["pasta"] == nova)
g2 = next(x for x in r2["encaixe"] if x["pasta"] == nova)
mult = encaixe.contexto(por[nova])["mult"][0]
peso = dados.regua()["criterios"][0]["peso"]
pts = dados.regua()["pontos_por_nota"][2]
R.ok("sinergia 2 soma peso × pontos × saturação da Sinergia Primária", abs((g2["ganho"] - g0["ganho"]) - peso * pts * mult) < 1e-9, (g2["ganho"] - g0["ganho"], peso * pts * mult))
R.ok("a faixa segue a régua da Caixa", all(x["faixa"] == ("deck" if x["ganho"] >= r2["regua"]["deck"] else "guardar" if x["ganho"] >= r2["regua"]["guardar"] else "abaixo") for x in r2["encaixe"]))
R.ok("nada fica gravado nos decks: a carta não entra em 'avaliadas'", all(CARTA not in (m.get("avaliadas") or {}) for m in todos))
av = json.load(open(os.path.join(dados.pasta_deck(nova), "avaliacao.json"), encoding="utf-8"))
R.ok("nada fica gravado nos decks: o avaliacao.json não cita a carta", CARTA not in json.dumps(av, ensure_ascii=False))

# ---------------------------------------------------------------- as recusas
R.ok("recusa nota fora de 0 a 3", recusa(consulta.calcular, CARTA, grava(dict(zeros, **{nova: {"sin": {"sin1": 4}}})), pasta=TMP) is not None)
R.ok("recusa nota acima de 0 sem porquê", "porquê" in (recusa(consulta.calcular, CARTA, grava(dict(zeros, **{nova: {"sin": {"sin1": 1}}})), pasta=TMP) or ""))
falta = {k: v for k, v in zeros.items() if k != nova}
R.ok("recusa deck nas cores sem sinergia", "faltam" in (recusa(consulta.calcular, CARTA, grava(falta), pasta=TMP) or ""))
fora = d["fora_da_identidade"][0] if d["fora_da_identidade"] else None
R.ok("recusa deck fora das cores", fora is None or "fora das cores" in (recusa(consulta.calcular, CARTA, grava(dict(zeros, **{fora: {"sin": {}}})), pasta=TMP) or ""))

# ---------------------------------------------------------------- o registro e os vereditos
reg = json.load(open(os.path.join(TMP, consulta.arquivo(CARTA)), encoding="utf-8"))
R.ok("registro: uma consulta por dia (refazer no mesmo dia substitui)", len(reg["consultas"]) == 1 and len(reg["consultas"][0]["encaixe"]) == len(d["decks"]))
R.ok("registro: guarda a sinergia avaliada", next(x for x in reg["consultas"][0]["encaixe"] if x["pasta"] == nova)["sin"] == [2, 0])
um_deck = por[nova]
sai_ok = next(c["n"] for c in um_deck["cards"] if not c.get("cmd"))
base = {"resumo": "teste", "compra": {"acao": "nao", "porque": "teste"}}
R.ok("recusa veredito fora da lista", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, decks={nova: {"veredito": "talvez", "porque": "x"}})), pasta=TMP) is not None)
R.ok("recusa veredito sem porquê", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, decks={nova: {"veredito": "fora"}})), pasta=TMP) is not None)
R.ok("recusa quem sai fora do deck", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, decks={nova: {"veredito": "avaliar", "porque": "x", "sai": "Carta Que Não Existe"}})), pasta=TMP) is not None)
R.ok("recusa compra fora da lista", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, compra={"acao": "talvez", "porque": "x"})), pasta=TMP) is not None)
consulta.gravar_vereditos(CARTA, grava(dict(base, decks={nova: {"veredito": "avaliar", "porque": "teste", "sai": sai_ok}})), pasta=TMP)
lst = consulta.listar(pasta=TMP)
R.ok("listar: a consulta aparece com a compra e o deck em avaliar", len(lst) == 1 and lst[0]["compra"] == "nao" and lst[0]["entram"] == [nova], lst)
R.fim()
