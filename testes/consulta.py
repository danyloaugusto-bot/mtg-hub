# -*- coding: utf-8 -*-
"""Teste da Consulta (motor/consulta.py; contexto/consulta/CONSULTA.md).

    python testes/consulta.py

Sem rede: usa uma carta que já está no cache do Scryfall e no cadastro (Vampire Nighthawk) e grava o registro numa pasta
temporária, nunca em dados/consultas/. Confere a leitura do link, a identidade de cor, o encaixe contra a conta do
encaixe.py, as recusas (nota fora da régua, nota sem porquê, deck faltando ou sobrando, veredito sem porquê, quem sai fora
do deck) e que nada é gravado nos decks.
"""
import hashlib, json, os, sys, tempfile
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
dia = reg["consultas"][0]
EST = {"leitura": "teste", "forcas": ["a", "b", "c"], "fraquezas": ["a", "b", "c"], "vacuo": {"grau": dia["forca"]["grau"], "porque": "teste"}, "armadilhas": {nova: "teste"}}
base = {"resumo": "teste", "compra": {"acao": "nao", "porque": "teste"}, "estudo": EST}
R.ok("recusa veredito fora da lista", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, decks={nova: {"veredito": "talvez", "porque": "x"}})), pasta=TMP) is not None)
R.ok("recusa veredito sem porquê", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, decks={nova: {"veredito": "fora"}})), pasta=TMP) is not None)
R.ok("recusa quem sai fora do deck", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, decks={nova: {"veredito": "avaliar", "porque": "x", "sai": "Carta Que Não Existe"}})), pasta=TMP) is not None)
R.ok("recusa compra fora da lista", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, compra={"acao": "talvez", "porque": "x"})), pasta=TMP) is not None)
R.ok("recusa avaliar sem quem sai", "sai" in (recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, decks={nova: {"veredito": "avaliar", "porque": "x"}})), pasta=TMP) or ""))
R.ok("aceita fora sem quem sai", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, decks={nova: {"veredito": "fora", "porque": "x"}})), pasta=TMP) is None)
R.ok("recusa vereditos sem estudo", "estudo" in (recusa(consulta.gravar_vereditos, CARTA, grava({k: v for k, v in base.items() if k != "estudo"}), pasta=TMP) or ""))
R.ok("recusa estudo sem leitura", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, estudo=dict(EST, leitura=" "))), pasta=TMP) is not None)
R.ok("recusa fortalezas com menos de três frases", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, estudo=dict(EST, forcas=["a", "b"]))), pasta=TMP) is not None)
R.ok("recusa fraquezas com mais de cinco frases", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, estudo=dict(EST, fraquezas=list("abcdef")))), pasta=TMP) is not None)
outro = next(g for g in consulta.GRAUS if g != dia["forca"]["grau"])
R.ok("recusa grau no vácuo diferente da régua", "régua" in (recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, estudo=dict(EST, vacuo={"grau": outro, "porque": "x"}))), pasta=TMP) or ""))
R.ok("recusa grau sem porquê", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, estudo=dict(EST, vacuo={"grau": dia["forca"]["grau"]}))), pasta=TMP) is not None)
R.ok("recusa armadilha num deck que não existe", recusa(consulta.gravar_vereditos, CARTA, grava(dict(base, estudo=dict(EST, armadilhas={"99. Ninguém": "x"}))), pasta=TMP) is not None)
consulta.gravar_vereditos(CARTA, grava(dict(base, decks={nova: {"veredito": "avaliar", "porque": "teste", "sai": sai_ok}})), pasta=TMP)
reg = json.load(open(os.path.join(TMP, consulta.arquivo(CARTA)), encoding="utf-8"))
R.ok("registro: o estudo fica na consulta do dia, com o grau da régua", reg["consultas"][-1]["estudo"]["vacuo"]["grau"] == dia["forca"]["grau"] and reg["consultas"][-1]["estudo"]["forcas"] == ["a", "b", "c"])
lst = consulta.listar(pasta=TMP)
R.ok("listar: a consulta aparece com a compra, o grau e o deck em avaliar", len(lst) == 1 and lst[0]["compra"] == "nao" and lst[0]["entram"] == [nova] and lst[0]["grau"] == dia["forca"]["grau"], lst)

# ---------------------------------------------------------------- a régua do vácuo (motor/consulta.json, limites em motor/caixa.json)
rc = consulta.caixa.regua()
g = consulta.grau_vacuo
R.ok("vácuo: Game Changer é S", g(1, 6, gc=True) == "S")
R.ok("vácuo: EDHREC até staple_rank_max é S", g(1, 6, rank=rc["staple_rank_max"]) == "S")
R.ok("vácuo: valor a partir de forte_valor_min é A", g(rc["forte_valor_min"], 6) == "A")
R.ok("vácuo: valor a partir de bundles_valor_min, ou EDHREC até bundles_rank_max, é B", g(rc["bundles_valor_min"], 6) == "B" and g(1, 6, rank=rc["bundles_rank_max"]) == "B")
R.ok("vácuo: valor a partir da mediana é C, abaixo é D", g(6, 6) == "C" and g(5.5, 6) == "D")
R.ok("vácuo: sem valor, sem grau", g(None, 6) is None)

# ---------------------------------------------------------------- carta sem cadastro: as notas ficam na consulta, nunca em dados/cartas.json
import scryfall  # noqa: E402
CAD_ARQ = dados.CADASTRO_ARQ
antes = hashlib.sha1(open(CAD_ARQ, "rb").read()).hexdigest()
sem = None
for k, v in sorted(scryfall._ler().get("cartas", {}).items()):
    if isinstance(v, dict) and v.get("name") and v["name"] not in cad and v.get("set") and v.get("num") and "Land" not in (v.get("type_line") or "") \
            and not v.get("faces") and v.get("color_identity") == ["B"] and "Creature" in (v.get("type_line") or ""):
        sem = "https://scryfall.com/card/%s/%s" % (v["set"], v["num"]); nome_sem = v["name"]; break
R.ok("há no cache uma carta preta sem cadastro, para o teste", sem is not None)
if sem:
    ds = consulta.dossie(sem, rede=False, avisar=lambda *a: None, pasta=TMP)
    R.ok("sem cadastro: o dossiê pede as notas para o registro, não para dados/cartas.json", ds["pedido_cadastro"] and "não muda" in ds["pedido_cadastro"]["grava_em"])
    z = {x["pasta"]: {"sin": {"sin1": 0, "sin2": 0}} for x in ds["decks"]}
    R.ok("sem cadastro e sem _cadastro: recusa", "_cadastro" in (recusa(consulta.calcular, sem, grava(z), pasta=TMP) or ""))
    R.ok("_cadastro: recusa critério que não é da carta", recusa(consulta.calcular, sem, grava(dict(z, _cadastro={"n": {"sin1": 2}, "por_que": "x"})), pasta=TMP) is not None)
    R.ok("_cadastro: recusa nota fora de 1 a 3", recusa(consulta.calcular, sem, grava(dict(z, _cadastro={"n": {"draw": 4}, "por_que": "x"})), pasta=TMP) is not None)
    R.ok("_cadastro: recusa sem por_que", recusa(consulta.calcular, sem, grava(dict(z, _cadastro={"n": {"draw": 1}})), pasta=TMP) is not None)
    rs = consulta.calcular(sem, grava(dict(z, _cadastro={"n": {"draw": 1, "resiliencia": 2}, "por_que": "teste"})), avisar=lambda *a: None, pasta=TMP)
    R.ok("_cadastro: o encaixe sai com as notas da consulta, e o grau também", rs["origem_cadastro"] == "consulta" and rs["forca"]["valor_proprio"] == encaixe.valor(consulta.s3_da_carta({"n": {"draw": 1, "resiliencia": 2}})) and rs["forca"]["grau"] in consulta.GRAUS)
    rg = json.load(open(os.path.join(TMP, consulta.arquivo(nome_sem)), encoding="utf-8"))
    R.ok("_cadastro: as notas ficam no registro, com fonte 'consulta'", rg["consultas"][-1]["cadastro"]["fonte"] == "consulta" and rg["consultas"][-1]["forca"]["grau"] == rs["forca"]["grau"])
R.ok("dados/cartas.json não mudou", hashlib.sha1(open(CAD_ARQ, "rb").read()).hexdigest() == antes)

# ---------------------------------------------------------------- a página (sem rede): a conta em JavaScript é a do encaixe.py
from playwright.sync_api import sync_playwright  # noqa: E402
html, info_p = consulta.pagina(pasta=TMP, avisar=lambda *a: None)
R.ok("página: os dados sem imagens ficam abaixo de 1 MB", info_p["kb_dados"] < 1024, round(info_p["kb_dados"]))
R.ok("página: só as consultas com estudo entram", info_p["registros"] == 1, info_p["registros"])
PG = os.path.join(TMP, "consulta.html")
open(PG, "w", encoding="utf-8").write(html)
regp = json.load(open(os.path.join(TMP, consulta.arquivo(CARTA)), encoding="utf-8"))
dia = regp["consultas"][-1]
cadx = dados.ler_cadastro()
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1360, "height": 900})
    comum.bloquear_rede(pg)
    err = []
    pg.on("pageerror", lambda e: err.append(str(e)))
    pg.goto(comum.url(PG)); pg.wait_for_function("!!window.CONSULTA", timeout=30000); pg.wait_for_timeout(300)
    R.ok("página: abre sem erro", not err, err[:2])
    difs = []
    for x in dia["encaixe"]:
        m = por[x["pasta"]]
        guard = m.get("avaliadas"); m["avaliadas"] = dict(guard or {}, **{CARTA: dict(sin=x["sin"])}); m.pop("_enc", None)
        try:
            gp = encaixe.ganho(CARTA, m, cadx, info)
        finally:
            m["avaliadas"] = guard if guard is not None else {}; m.pop("_enc", None)
        s3 = consulta.s3_da_carta(cadx[CARTA], x["sin"])
        gj = pg.evaluate("([p, s3, c]) => CONSULTA.ganho(%s, s3, CONSULTA.D.decks[p], c)" % json.dumps(CARTA), [x["pasta"], s3, dict(info, ci=d["carta"]["ci"])])
        for k in ("ganho", "valor", "sai", "valor_sai", "cobre", "d_cmc", "d_acel"):
            a_, b_ = gj.get(k), gp.get(k)
            if (abs((a_ or 0) - (b_ or 0)) > 1e-9) if isinstance(b_, (int, float)) and not isinstance(b_, bool) else a_ != b_:
                difs.append((x["pasta"], k, a_, b_))
    R.ok("página: a conta do encaixe em JavaScript dá o mesmo do encaixe.py em todos os decks nas cores", not difs, difs[:4])
    R.ok("página: o grau da régua em JavaScript é o do motor", all(pg.evaluate("([v, gc, r]) => CONSULTA.grauVacuo(v, gc, r)", [v_, gc_, r_]) == consulta.grau_vacuo(v_, consulta.statistics.median(consulta.valores_cadastro(cadx)), gc_, r_)
                                                                    for v_, gc_, r_ in ((3, False, None), (6, False, None), (7.5, False, None), (12, False, None), (1, True, None), (1, False, 400), (1, False, 2500))))
    R.ok("página: os cinco blocos dos decks, na ordem", pg.evaluate("[...document.querySelectorAll('[data-bloco]')].map(b => b.dataset.bloco).join(',')") == "entra,avaliar,fora,sem,cores")
    R.ok("página: um cartão ou linha por deck nas cores, e os de fora só pelo nome",
         pg.locator(".cs-dk, .cs-ln").count() == len(dia["encaixe"]) and pg.locator(".cs-fora span").count() == len(d["fora_da_identidade"]))
    R.ok("página: o deck em avaliar mostra quem sai na prática", sai_ok in pg.inner_text('[data-bloco="avaliar"]'))
    preco = pg.evaluate("(document.querySelector('.cs-preco') || {}).textContent || ''")
    R.ok("página: o preço é o do Scryfall gravado no registro, com a data", (not dia.get("usd")) or (consulta._n(float(dia["usd"])) in preco.replace(".", "") or ("%.2f" % float(dia["usd"])).replace(".", ",") in preco), preco)
    pg.fill("#cs-q", "Uma Carta Que Ninguém Consultou"); pg.click(".cs-ir"); pg.wait_for_timeout(200)
    R.ok("página: carta não consultada mostra o comando, sem inventar estudo",
         pg.locator(".cs-carta").count() == 0 and pg.inner_text("#cs-cmd") == "/consulta Uma Carta Que Ninguém Consultou")
    pg.fill("#cs-q", CARTA.lower()); pg.click(".cs-ir"); pg.wait_for_timeout(200)
    R.ok("página: pelo nome, abre o estudo registrado", pg.locator(".cs-carta").count() == 1 and CARTA in pg.inner_text(".cs-nome"))
    R.ok("página: nada chama a rede", not err)
    b.close()
# ---------------------------------------------------------------- fase 2: o modo ao vivo, com um Claude e um banco de mentira
def scryfall_cru(v):
    """O JSON do Scryfall (forma da API) a partir do registro do cache, para a página buscar a carta sem rede."""
    return dict(object="card", name=v["name"], mana_cost=v.get("mana_cost") or "", cmc=v.get("cmc") or 0, type_line=v.get("type_line") or "",
                oracle_text=v.get("oracle_text") or "", color_identity=v.get("color_identity") or [], set=v["set"], collector_number=v["num"],
                released_at=v.get("released_at") or "2020-01-01", legalities={"commander": v.get("leg") or "legal"}, edhrec_rank=v.get("edhrec_rank"),
                prices={"usd": v.get("usd")}, power=v.get("power"), toughness=v.get("toughness"), artist=v.get("artist"))


FAKE_CLAUDE = """(function () {
  var store = {}, subs = [], respostas = [];
  window.__store = store; window.__respostas = respostas; window.__pedidos = [];
  function snap() { var docs = Object.keys(store).sort().map(function (id) { var v = store[id]; return { id: id, data: function () { return v; } }; }); return { docs: docs }; }
  var db = { collection: function () { return { doc: function (id) { return { set: function (d) { store[id] = JSON.parse(JSON.stringify(d)); var s = snap(); subs.forEach(function (f) { setTimeout(function () { f(s); }, 0); }); return Promise.resolve(); } }; },
    onSnapshot: function (f) { subs.push(f); setTimeout(function () { f(snap()); }, 0); return function () {}; } }; } };
  var sample = function () { return Promise.reject({ code: 'invalid_request', message: 'só json' }); };
  sample.json = function (input, o) { window.__pedidos.push({ tamanho: input.length, tier: o && o.modelTier }); var r = respostas.length ? respostas.shift() : null;
    return new Promise(function (ok, nao) { setTimeout(function () { r ? ok(JSON.parse(JSON.stringify(r))) : nao({ code: 'upstream_error', message: 'sem resposta' }); }, 30); }); };
  var user = { isOwner: function () { return Promise.resolve(true); } };
  window.claude = { use: function (n) { return Promise.resolve(n === 'db' ? db : n === 'user' ? user : n === 'sample' ? sample : null); } };
})();"""

if sem:
    vsem = next(v for v in scryfall._ler()["cartas"].values() if isinstance(v, dict) and v.get("name") == nome_sem)
    cru = scryfall_cru(vsem)
    ds_sem = [x["pasta"] for x in ds["decks"]]
    nao_cores = [m["pasta"] for m in todos if m["pasta"] not in ds_sem]
    um = ds_sem[0]
    deck_um = por[um]
    comp_um = consulta._comparaveis(deck_um, consulta.ficha(vsem))
    sai_um = comp_um[0]["n"] if comp_um else next(c["n"] for c in deck_um["cards"] if not c.get("cmd"))
    BOA = {"cadastro": {"n": {"draw": 1, "resiliencia": 2}, "por_que": "teste"},
           "sinergias": dict({p_: {"sin1": 0, "sin2": 0} for p_ in ds_sem}, **{um: {"sin1": 2, "sin2": 1, "sin1_porque": "régua", "sin2_porque": "régua"}}),
           "leitura": "teste", "forcas": ["a", "b", "c"], "fraquezas": ["a", "b", "c"], "vacuo_porque": "teste", "armadilhas": {um: "teste"},
           "vereditos": {um: {"veredito": "avaliar", "porque": "teste", "sai": sai_um}}, "resumo": "teste", "compra": {"acao": "nao", "porque": "teste"}}
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1360, "height": 900})
        pg.route("**/*", lambda r: r.fulfill(status=200, content_type="application/json", body=json.dumps(cru)) if "api.scryfall.com" in r.request.url
                 else (r.abort() if r.request.url.startswith("http") else r.continue_()))
        pg.add_init_script(FAKE_CLAUDE)
        err = []
        pg.on("pageerror", lambda e: err.append(str(e)))
        pg.goto(comum.url(PG)); pg.wait_for_function("!!window.CONSULTA", timeout=30000); pg.wait_for_timeout(400)
        C = pg.evaluate("(k) => CONSULTA.normalizar(k)", cru)
        val = lambda j, tem=False: pg.evaluate("([j, C, t]) => CONSULTA.validar(j, C, t)", [j, C, tem])
        R.ok("ao vivo: a resposta boa passa no validador", val(BOA) == [], val(BOA))
        def mentira(nome, mudar, trecho):
            j = json.loads(json.dumps(BOA)); mudar(j); e = val(j)
            R.ok("ao vivo: recusa " + nome, any(trecho in x for x in e), e)
        mentira("nota 4", lambda j: j["sinergias"][um].update(sin1=4), "vai de 0 a 3")
        mentira("nota acima de 0 sem porquê", lambda j: j["sinergias"][um].update(sin1_porque=" "), "sem porquê")
        mentira('veredito "talvez"', lambda j: j["vereditos"][um].update(veredito="talvez"), "não é entra")
        mentira("quem sai fora do deck", lambda j: j["vereditos"][um].update(sai="Carta Que Não Existe"), "não está no deck")
        mentira("avaliar sem quem sai", lambda j: j["vereditos"][um].pop("sai"), "pede quem sai")
        if nao_cores:
            mentira("deck fora das cores", lambda j: j["sinergias"].update({nao_cores[0]: {"sin1": 0, "sin2": 0}}), "fora das cores")
        mentira("deck nas cores sem sinergia", lambda j: j["sinergias"].pop(ds_sem[-1]), "faltam as sinergias")
        mentira("sem as notas da carta", lambda j: j.pop("cadastro"), "falta o cadastro")
        mentira("nota da carta fora de 1 a 3", lambda j: j["cadastro"]["n"].update(draw=5), "de 1 a 3")
        mentira("fortalezas com duas frases", lambda j: j.update(forcas=["a", "b"]), "fortalezas")
        mentira("compra fora da lista", lambda j: j["compra"].update(acao="talvez"), "compra")
        # a conta ao vivo é a do motor: o mesmo JSON pelo consulta.calcular, com as notas em _cadastro
        e_js = pg.evaluate("([C, j]) => CONSULTA.calcularEntrada(C, j, j.cadastro.n, 'ao-vivo')", [C, BOA])
        sinj = dict({p_: {"sin": {"sin1": BOA["sinergias"][p_]["sin1"], "sin2": BOA["sinergias"][p_]["sin2"]},
                          "sin_por_que": {k: BOA["sinergias"][p_][k + "_porque"] for k in ("sin1", "sin2") if BOA["sinergias"][p_].get(k)}} for p_ in ds_sem},
                    _cadastro=BOA["cadastro"])
        rpy = consulta.calcular(sem, grava(sinj), avisar=lambda *a: None, pasta=TMP)
        py = {x["pasta"]: x for x in rpy["encaixe"]}
        dif = [(x["pasta"], k, x[k], py[x["pasta"]][k]) for x in e_js["encaixe"] for k in ("ganho", "valor", "sai", "faixa", "tier_estimado", "acima_de", "magicas", "cobre")
               if (abs(x[k] - py[x["pasta"]][k]) > 1e-9 if isinstance(py[x["pasta"]][k], (int, float)) and not isinstance(py[x["pasta"]][k], bool) else x[k] != py[x["pasta"]][k])]
        R.ok("ao vivo: valor, ganho, quem sai, faixa, tier e fila iguais aos do consulta.calcular", not dif, dif[:4])
        R.ok("ao vivo: o grau no vácuo é o do motor", e_js["forca"]["grau"] == rpy["forca"]["grau"], (e_js["forca"]["grau"], rpy["forca"]["grau"]))
        # o fluxo inteiro: busca a carta, pede o estudo (a primeira resposta vem errada e é pedida de novo uma vez), calcula, mostra e guarda
        ruim = json.loads(json.dumps(BOA)); ruim["sinergias"][um]["sin1"] = 9
        pg.evaluate("(r) => { window.__respostas.push(r[0], r[1]); }", [ruim, BOA])
        pg.fill("#cs-q", "https://scryfall.com/card/%s/%s" % (vsem["set"], vsem["num"])); pg.click(".cs-ir"); pg.wait_for_timeout(500)
        R.ok("ao vivo: a carta vem do Scryfall, com o botão de pedir o estudo e o comando", pg.locator(".cs-carta-v").count() == 1 and pg.locator('[data-vivo="estudar"]').count() == 1
             and pg.inner_text("#cs-cmd").startswith("/consulta https://scryfall.com/card/"))
        pg.click('[data-vivo="estudar"]'); pg.wait_for_function("document.querySelector('#cs-modo').textContent.indexOf('Ao vivo') >= 0", timeout=10000)
        R.ok("ao vivo: a resposta errada é pedida de novo uma vez, e a certa vira o estudo", pg.evaluate("window.__pedidos.length") == 2 and pg.locator(".cs-carta").count() == 1)
        R.ok("ao vivo: o pedido vai ao modelo forte e cabe no limite", all(x["tier"] == "complex" and x["tamanho"] < 250000 for x in pg.evaluate("window.__pedidos")), pg.evaluate("window.__pedidos"))
        R.ok("ao vivo: marcado 'ao vivo, não registrado'", "não registrado" in pg.inner_text("#cs-modo").lower())
        R.ok("ao vivo: os cinco blocos e o deck em avaliar com quem sai", pg.evaluate("[...document.querySelectorAll('[data-bloco]')].map(b => b.dataset.bloco).join(',')") == "entra,avaliar,fora,sem,cores"
             and sai_um in pg.inner_text('[data-bloco="avaliar"]'))
        pg.wait_for_timeout(200)
        docs = pg.evaluate("Object.keys(window.__store).map(k => Object.assign({id: k}, window.__store[k]))")
        R.ok("ao vivo: o estudo vai para o banco (coleção consultas), um documento por carta", len(docs) == 1 and docs[0]["modo"] == "ao-vivo" and docs[0]["nome"] == nome_sem and docs[0]["cadastro_auto"] is True)
        pg.evaluate("location.hash = '#registradas'"); pg.wait_for_timeout(300)
        R.ok("ao vivo: aparece nas registradas, marcado 'ao vivo'", pg.locator(".cs-rc").count() == 2 and "ao vivo" in pg.inner_text("#cs-registradas"))
        # duas respostas erradas: a página mostra o erro, não inventa estudo
        pg.evaluate("(r) => { window.__respostas.push(r, r); }", ruim)
        cru2 = dict(cru, name="Outra Carta", collector_number="9999")
        pg.unroute("**/*")
        pg.route("**/*", lambda r: r.fulfill(status=200, content_type="application/json", body=json.dumps(cru2)) if "api.scryfall.com" in r.request.url
                 else (r.abort() if r.request.url.startswith("http") else r.continue_()))
        pg.evaluate("location.hash = '#estudo'"); pg.wait_for_timeout(150); pg.fill("#cs-q", "Outra Carta"); pg.click(".cs-ir"); pg.wait_for_timeout(500)
        pg.click('[data-vivo="estudar"]'); pg.wait_for_function("!!document.querySelector('.cs-erro')", timeout=10000)
        R.ok("ao vivo: errada duas vezes, mostra o erro e não monta estudo", "fora da régua duas vezes" in pg.inner_text(".cs-erro") and pg.locator(".cs-carta:not(.cs-carta-v)").count() == 0)
        # sem o Claude (arquivo local puro): ficha, piso e comando, nunca nota inventada
        pg2 = b.new_page(viewport={"width": 1360, "height": 900})
        pg2.route("**/*", lambda r: r.fulfill(status=200, content_type="application/json", body=json.dumps(scryfall_cru(scryfall._ler()["cartas"][next(k for k, v in scryfall._ler()["cartas"].items() if isinstance(v, dict) and v.get("name") == CARTA)])))
                  if "api.scryfall.com" in r.request.url else (r.abort() if r.request.url.startswith("http") else r.continue_()))
        pg2.goto(comum.url(PG)); pg2.wait_for_function("!!window.CONSULTA", timeout=30000)
        pg2.evaluate("CONSULTA.D.registros.length = 0"); pg2.fill("#cs-q", "https://scryfall.com/card/zzz/1"); pg2.click(".cs-ir"); pg2.wait_for_timeout(500)
        R.ok("sem o Claude: ficha com o valor do cadastro e o piso, sem botão de estudo, com o comando",
             pg2.locator(".cs-carta-v").count() == 1 and pg2.locator('[data-vivo="estudar"]').count() == 0 and "Piso do encaixe" in pg2.inner_text(".cs-carta-v") and pg2.locator("#cs-cmd").count() == 1)
        R.ok("ao vivo: sem erro de página", not err, err[:2])
        b.close()
    # o importar do banco: entra como a revisar, e o cadastro não muda
    arq_banco = grava({"docs": docs})
    nomes = consulta.importar_banco(arq_banco, pasta=TMP)
    rg = json.load(open(os.path.join(TMP, consulta.arquivo(nome_sem)), encoding="utf-8"))
    ult = [x for x in rg["consultas"] if x.get("modo") == "ao-vivo"]
    R.ok("importar: a consulta ao vivo entra no registro como a revisar", nomes == [nome_sem] and len(ult) == 1 and ult[0]["revisar"] is True and ult[0]["cadastro_auto"] is True)
    R.ok("importar: listar mostra 'a revisar'", any(x["carta"] == nome_sem and x["revisar"] for x in consulta.listar(pasta=TMP)))
    R.ok("importar: recusa documento sem estudo", recusa(consulta.importar_banco, grava([dict(docs[0], entrada=dict(docs[0]["entrada"], estudo=None))]), pasta=TMP) is not None)
    consulta.confirmar(nome_sem, pasta=TMP)
    rg = json.load(open(os.path.join(TMP, consulta.arquivo(nome_sem)), encoding="utf-8"))
    ult = [x for x in rg["consultas"] if x.get("modo") == "ao-vivo"][-1]
    R.ok("confirmar: com o pode, a consulta ao vivo deixa de estar a revisar", ult["revisar"] is False and ult.get("revisado"))
    R.ok("confirmar: recusa carta sem consulta ao vivo a revisar", recusa(consulta.confirmar, nome_sem, pasta=TMP) is not None)
    R.ok("importar: dados/cartas.json não mudou", hashlib.sha1(open(CAD_ARQ, "rb").read()).hexdigest() == antes)
R.fim()
