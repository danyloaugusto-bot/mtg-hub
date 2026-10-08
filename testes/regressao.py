# -*- coding: utf-8 -*-
"""Regressão do painel aberto como arquivo local, sem internet.

    python testes/regressao.py --deck "02. Clavileño"

As cartas usadas nos passos são escolhidas a partir dos dados do próprio deck; os números esperados vêm de
testes/controle/<pasta>.json, quando existe.
"""
import json
from playwright.sync_api import sync_playwright
import comum

a = comum.argumentos("Regressão do painel em arquivo local")
pasta = a.deck
R = comum.Relatorio("regressão: " + pasta)
ctl = comum.controle(pasta)
arq = comum.html(pasta, montar=not a.sem_montar)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1360, "height": 2200})
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: R.erros.append("PAGEERROR " + str(e)))
    comum.bloquear_rede(pg)
    pg.goto(comum.url(arq)); pg.wait_for_timeout(1200)
    D = pg.evaluate("window.PAINEL.D")
    NG = len(D["grupos"])
    ipet = next((i for i, g in enumerate(D["grupos"]) if g.get("pet")), -1)
    cnt = lambda: pg.inner_text("#deckCount")

    # números do topo e do placar
    facts = pg.inner_text("#v-geral .facts").replace("\n", " ")
    placar = int(pg.inner_text("#v-geral .score-big b"))
    if "placar" in ctl:
        R.ok("placar de origem", placar == ctl["placar"], placar)
    if "cmc" in ctl:
        R.ok("fatos do topo", ("cartas %d " % ctl["cartas"]) in facts and ("CMC médio " + ctl["cmc"]) in facts and ("fontes de terreno %d " % ctl["fontes"]) in facts and facts.endswith("foils %d" % ctl["foils"]), facts)
    if "relevancia" in ctl:
        rel = pg.evaluate("Array.from(document.querySelectorAll('#v-geral .rel-t tbody tr:not(.tot-r)')).map(r=>+r.querySelector('td b').textContent)")
        R.ok("relevância", rel == [ctl["relevancia"][k] for k in ("INS", "ALT", "MED", "BAX")], rel)
    if "tiers" in ctl:
        ti = pg.evaluate("Array.from(document.querySelectorAll('#v-geral .score-big ~ .legend > span')).map(s=>+s.textContent.trim().split(' ').pop())")
        R.ok("tiers", ti == [ctl["tiers"][k] for k in "SABCD"], ti)

    abas = ("gal", "tier", "tab", "ctrl", "radar", "ofi", "geral")
    for t in abas:
        pg.click('[data-tab="%s"]' % t); pg.wait_for_timeout(150)
    R.ok("sete abas sem exceção", not R.erros, R.erros)

    # gaveta: stepper, PetCard, valor e tier (com uma carta que não sai nas trocas sugeridas)
    saem = {c.get("sai") for c in D["cands"] if c["verdict"] == "entra"}
    alvo = next(c for c in D["cards"] if not c.get("cmd") and not c.get("land") and c["s"][1] < 3 and c["tier"] != "D" and c["id"] not in saem)
    pg.click('[data-tab="tier"]'); pg.wait_for_timeout(250)
    n_d = pg.locator('#v-tier .tier[data-t="D"] .chip').count()
    pg.click('#v-tier .chip[data-card="%s"]' % alvo["id"]); pg.wait_for_timeout(200)
    p0 = int(pg.inner_text(".dw-sum b"))
    pg.click('[data-act="step"][data-g="1"][data-d="1"]'); pg.check('[data-act="pet"]'); pg.wait_for_timeout(120)
    R.ok("stepper e PetCard", int(pg.inner_text(".dw-sum b")) == p0 + (2 if ipet >= 0 else 1), alvo["n"])
    R.ok("gaveta com uma nota por agrupamento", pg.locator(".drawer .step").count() == NG)
    pg.fill('[data-act="val"]', "12.5"); pg.click('[data-act="set-tier"][data-v="D"]'); pg.wait_for_timeout(150)
    R.ok("valor não engole o clique seguinte", pg.locator('#v-tier .tier[data-t="D"] .chip').count() == n_d + 1)
    pg.keyboard.press("Escape"); pg.click('[data-tab="geral"]'); pg.wait_for_timeout(200)
    R.ok("valor na tabela de relevância", "12,50" in pg.inner_text("#v-geral .rel-t"))

    # tier list: duas visões e arrastar
    pg.click('[data-tab="tier"]'); pg.wait_for_timeout(250)
    R.ok("tier list com as duas visões", pg.locator('[data-act="tier-view"]').count() == 2)
    pg.click('[data-act="tier-view"][data-v="fichas"]'); pg.wait_for_timeout(150)
    R.ok("visão em fichas", pg.locator("#v-tier .chip.tile").count() == 0 and pg.locator("#v-tier .chip").count() > 0)
    pg.click('[data-act="tier-view"][data-v="cartas"]'); pg.wait_for_timeout(150)
    R.ok("visão em cartas", pg.locator("#v-tier .chip.tile").count() > 0)
    mover = next(c for c in D["cards"] if not c.get("cmd") and not c.get("land") and c["tier"] not in ("B", "D") and c["id"] != alvo["id"])
    pg.drag_and_drop('#v-tier .chip[data-card="%s"]' % mover["id"], '#v-tier [data-drop="tier:B"]'); pg.wait_for_timeout(250)
    R.ok("arrastar entre tiers", pg.locator('#v-tier .tier[data-t="B"] .chip[data-card="%s"]' % mover["id"]).count() == 1, mover["n"])
    pg.click('[data-tab="ctrl"]'); pg.wait_for_timeout(150)
    faixa = next(c for c in D["cards"] if not c.get("cmd") and not c.get("land") and c["rel"] != "BAX" and c["id"] not in (alvo["id"], mover["id"]))
    pg.drag_and_drop('#v-ctrl .kan .chip[data-card="%s"]' % faixa["id"], '#v-ctrl [data-drop="rel:BAX"]'); pg.wait_for_timeout(250)
    R.ok("arrastar entre faixas", pg.locator('#v-ctrl .k-BAX .chip[data-card="%s"]' % faixa["id"]).count() == 1, faixa["n"])
    entram = [c for c in D["cands"] if c["verdict"] == "entra"]
    pend = pg.inner_text("#v-ctrl .pend")
    R.ok("pendências listam as entradas sugeridas", all(c["n"] in pend for c in entram), len(entram))

    # radar: sugestões, trocas e histórico
    pg.click('[data-tab="radar"]'); pg.wait_for_timeout(200)
    sug = [c for c in D["cands"] if c.get("sai") and c["verdict"] != "fora"]
    R.ok("sugestões de saída", all(pg.eval_on_selector("#sel-" + c["id"], "e=>e.value") == c["sai"] for c in sug), len(sug))
    for c in entram:
        pg.click('[data-act="swap"][data-id="%s"]' % c["id"]); pg.wait_for_timeout(120)
    R.ok("trocas sugeridas mantêm a contagem", cnt() == "%d cartas" % ctl.get("cartas", 100), cnt())
    R.ok("histórico com uma linha por troca", pg.locator("#v-radar .hist tbody tr").count() == len(entram))
    pg.click('[data-tab="geral"]'); pg.wait_for_timeout(300)
    facts = pg.inner_text("#v-geral .facts").replace("\n", " "); read = pg.inner_text("#v-geral .read")
    pt = int(pg.inner_text("#v-geral .score-big b"))
    R.nota("depois das %d trocas: %s | placar %d" % (len(entram), facts, pt))
    R.nota(" / ".join(x.split(".")[0] for x in read.split("\n") if x.strip())[:400])
    if "placar_trocas" in ctl:
        # o PetCard e o tier alterados acima não mexem no placar das trocas, mas a nota +1 mexe
        R.ok("placar depois das trocas", pt == ctl["placar_trocas"] + 2 if ipet >= 0 else pt == ctl["placar_trocas"] + 1, pt)
    for t in ctl.get("ausente", []):
        R.ok("texto retirado não volta: " + t, t not in pg.inner_text("#v-geral"))

    # radar: deixar de fora, potenciais
    pg.click('[data-tab="radar"]'); pg.wait_for_timeout(200)
    av = next((c for c in D["cands"] if c["verdict"] == "avaliar"), None)
    if av:
        pg.click('[data-act="verdict"][data-v="fora"][data-id="%s"]' % av["id"]); pg.wait_for_timeout(150)
        R.ok("deixar de fora no cartão do radar", pg.locator('#v-radar .fora [data-act="reval"][data-id="%s"]' % av["id"]).count() == 1, av["n"])
    if D["pool"]:
        n0 = len(D["pool"])
        R.ok("botão Potenciais com o número", pg.inner_text("#edhBtn") == "Potenciais %d" % n0, pg.inner_text("#edhBtn"))
        pid = pg.get_attribute('#pool [data-act="pool-in"][data-v="avaliar"]', "data-id")
        pg.click('#pool [data-act="pool-in"][data-v="avaliar"]'); pg.wait_for_timeout(200)
        R.ok("levar ao radar", pg.locator("#cand-" + pid).count() == 1 and pg.inner_text("#edhBtn") == "Potenciais %d" % (n0 - 1))
        R.ok("pedido de atualização pronto", "/potenciais " + pasta in pg.input_value("#edh-req"))
    pg.fill("#nc-n", "Carta de Teste"); pg.fill("#nc-c", "{2}{W}{B}"); pg.click('[data-act="add-custom"]'); pg.wait_for_timeout(200)
    R.ok("carta nova no radar", pg.locator('#v-radar .cand h3:has-text("Carta de Teste")').count() == 1)

    # oficina
    pg.click('[data-tab="ofi"]'); pg.wait_for_timeout(150)
    cmds = [pg.input_value(t) for t in ("#ofc-aud", "#ofc-cmp", "#ofc-col", "#ofc-capa", "#ofc-bk")]
    R.ok("oficina com a pasta preenchida", all(pasta in c for c in cmds), cmds[0])
    pg.fill("#off-cmp-fora", "Carta de Fora"); pg.select_option("#off-cmp-deck", label=mover["n"]); pg.wait_for_timeout(100)
    R.ok("comparar recebe as duas cartas", pg.input_value("#ofc-cmp") == "/comparar %s | Carta de Fora | %s" % (pasta, mover["n"]), pg.input_value("#ofc-cmp"))
    bk_of = pg.input_value("#ofc-bk")
    R.ok("levar ao projeto leva o backup junto", bk_of.startswith("/importar-backup " + pasta + "\n\n{") and len(json.loads(bk_of.split("\n\n", 1)[1])["swaps"]) == len(entram))

    # backup
    pg.click('[data-act="backup"]'); bk = pg.input_value("#bk-out"); j = json.loads(bk)
    R.ok("backup guarda trocas, datas e imagens", len(j["swaps"]) == len(entram) and j["swaps"][0].get("d") and j.get("img") is True and j.get("ts"))
    linhas = pg.input_value("#bk-list").split("\n")
    R.ok("decklist exportada", len(linhas) == len(D["cards"]) and (not entram or entram[0]["n"] in pg.input_value("#bk-list")), len(linhas))
    pg.click('[data-act="reset-all"]'); pg.click('[data-act="reset-all"]'); pg.wait_for_timeout(200)
    pg.click('[data-tab="radar"]'); pg.wait_for_timeout(150)
    R.ok("recomeçar", cnt() == "%d cartas" % ctl.get("cartas", 100) and pg.locator("#v-radar .hist").count() == 0)
    pg.click('[data-act="backup"]'); pg.fill("#bk-in", bk); pg.click('[data-act="import"]'); pg.wait_for_timeout(250)
    R.ok("restaurar backup", pg.locator("#v-radar .hist tbody tr").count() == len(entram) and cnt() == "%d cartas" % ctl.get("cartas", 100))
    # backup no formato antigo do Coro: sem ts, com "art" e carta própria marcada "angel"
    velho = {"v": 1, "ov": {}, "custom": [{"id": "x-velha", "n": "Carta Velha", "q": 1, "cost": "{2}", "cmc": 2, "t": "art", "g": "art", "line": "Artefato",
                                           "col": "C", "s": [0, 0, 0, 0, 0, 0, 0, 0], "tier": "B", "rel": "MED", "fx": "", "why": "", "cand": 1, "custom": 1, "verdict": "avaliar", "angel": 1}],
             "inn": {}, "out": {}, "swaps": [], "art": False}
    pg.click('[data-act="backup"]'); pg.fill("#bk-in", json.dumps(velho)); pg.click('[data-act="import"]'); pg.wait_for_timeout(250)
    pg.click('[data-tab="radar"]'); pg.wait_for_timeout(150)
    R.ok("backup antigo, sem data e com outro formato, abre", pg.locator('#v-radar .cand h3:has-text("Carta Velha")').count() == 1 and not R.erros)
    pg.click('[data-act="backup"]'); pg.click('[data-act="reset-all"]'); pg.click('[data-act="reset-all"]'); pg.wait_for_timeout(150)

    # imagens: com pacote embutido, aparecem mesmo sem internet; sem pacote, o aviso oferece nova tentativa
    pg.click('[data-tab="gal"]'); pg.wait_for_timeout(600)
    if D.get("img"):
        R.ok("imagens embutidas aparecem sem internet", pg.locator("img.ci.ci-ok").count() > 0, pg.locator("img.ci.ci-ok").count())
        R.ok("aviso de imagens embutidas", "embutidas" in pg.inner_text("#v-gal [data-imgnote]"))
    else:
        R.ok("imagens fora do ar: aviso com nova tentativa", pg.locator('#v-gal [data-imgnote] [data-act="img-retry"]').count() == 1, pg.inner_text("#v-gal [data-imgnote]")[:70])
        pg.click('#v-gal [data-act="img-retry"]'); pg.wait_for_timeout(300)
        R.ok("nova tentativa sem exceção", not R.erros)
    ctx.close()

    # chave antiga: o que o painel anterior deste deck salvou no navegador continua valendo
    if D["meta"].get("chave_antiga"):
        ctx = b.new_context(viewport={"width": 1360, "height": 1200})
        pg = ctx.new_page(); comum.bloquear_rede(pg)
        pg.on("pageerror", lambda e: R.erros.append("PAGEERROR " + str(e)))
        c0 = D["cards"][1]
        estado = {"v": 1, "ov": {c0["id"]: {"tier": "D", "nota": "salvo no painel antigo"}}, "custom": [], "inn": {}, "out": {}, "swaps": [], "img": True, "ts": 1}
        pg.add_init_script("if(!localStorage.getItem('%s'))localStorage.setItem('%s', %s)" % (D["meta"]["chave_antiga"], D["meta"]["chave_antiga"], json.dumps(json.dumps(estado))))
        pg.goto(comum.url(arq)); pg.wait_for_timeout(800)
        pg.click('[data-tab="tier"]'); pg.click('[data-act="tier-view"][data-v="fichas"]'); pg.wait_for_timeout(150)
        R.ok("lê o que o painel antigo salvou", pg.locator('#v-tier .tier[data-t="D"] .chip[data-card="%s"]' % c0["id"]).count() == 1, c0["n"])
        ctx.close()
    b.close()
R.fim()
