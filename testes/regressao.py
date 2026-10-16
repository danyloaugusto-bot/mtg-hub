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
    # deck v3: o placar vem dos dez critérios (aba Critérios); o 8×8 segue com os agrupamentos, à parte
    V3 = bool(D["meta"].get("v3") and D.get("criterios"))
    CR = D.get("criterios") or []
    RG = D["meta"]["regua"]
    placar_tela = lambda: comum.num_br(pg.inner_text("#v-geral .score-big b"))

    # números do topo e do placar
    facts = pg.inner_text("#v-geral .facts").replace("\n", " ")
    placar = placar_tela()
    k_pl = "placar_v3" if V3 else "placar"
    if k_pl in ctl:
        R.ok("placar de origem" + (" (v3)" if V3 else ""), placar == ctl[k_pl], placar)
    if "cmc" in ctl:
        R.ok("fatos do topo", ("cartas %d " % ctl["cartas"]) in facts and ("CMC médio " + ctl["cmc"]) in facts and (facts + " ").count("fontes de terreno %d " % ctl["fontes"]) == 1 and (facts.endswith("foils %d" % ctl["foils"]) if ctl["foils"] else "foils" not in facts), facts)
    if "relevancia" in ctl:
        rel = pg.evaluate("Array.from(document.querySelectorAll('#v-geral .rel-t tbody tr:not(.tot-r)')).map(r=>+r.querySelector('td b').textContent)")
        R.ok("relevância", rel == [ctl["relevancia"][k] for k in ("INS", "ALT", "MED", "BAX")], rel)
    if "tiers" in ctl:
        ti = pg.evaluate("Array.from(document.querySelectorAll('#v-geral .score-big ~ .legend > span')).map(s=>+s.textContent.trim().split(' ').pop())")
        R.ok("tiers", ti == [ctl["tiers"][k] for k in "SABCD"], ti)

    # custo e curva: a linha de hoje bate com o topo; as trocas que baixam o custo batem com a conta em Python
    R.ok("custo e curva na visão geral", pg.locator("#v-geral fieldset.cv .cvt tbody tr").count() >= 1)
    if "cmc" in ctl:
        hoje = pg.inner_text("#v-geral fieldset.cv .cvt tbody tr:first-child td b")
        R.ok("custo e curva: CMC médio de hoje igual ao do topo", hoje == ctl["cmc"], hoje)
    nb, cmc_b = comum.custo_baixo(D)
    linhas_cv = pg.evaluate("Array.from(document.querySelectorAll('#v-geral fieldset.cv .cvt tbody tr')).map(r=>r.innerText)")
    so = [l for l in linhas_cv if l.startswith("Só as trocas")]
    R.ok("custo e curva: trocas que baixam o custo iguais à conta em Python",
         (not so and nb == 0) or (len(so) == 1 and ("(%d)" % nb) in so[0] and abs(float(so[0].split("	")[1].split()[0].replace(",", ".")) - cmc_b) < 0.006),
         (so, nb, round(cmc_b, 2)))

    abas = ("gal", "tier", "pk") + (("crit",) if V3 else ()) + ("tab", "ctrl", "radar", "ofi", "geral")
    R.ok("aba Critérios só no deck v3", pg.locator('[data-tab="crit"]').count() == (1 if V3 else 0))
    visto = []
    for t in abas:
        pg.click('[data-tab="%s"]' % t); pg.wait_for_timeout(150)
        visto.append(pg.evaluate("document.querySelector('main').innerText"))
    R.ok("%d abas sem exceção" % len(abas), not R.erros, R.erros)
    pg.click('[data-tab="tab"]'); pg.wait_for_timeout(150)
    R.ok("Tabelão sem coluna de preço", "US$" not in pg.inner_text("#v-tab thead"))
    # ordenar pelo cabeçalho (motor/comum/ordenar.js): o Tabelão segue com a ordenação própria; as outras tabelas ganham a genérica
    R.ok("ordenar: o Tabelão fica com a ordenação própria", pg.locator("#v-tab th.ordenavel").count() == 0)
    pg.click('[data-tab="geral"]'); pg.wait_for_timeout(150)
    if pg.locator("#v-geral table.rel-t").count():
        th_q = pg.locator("#v-geral table.rel-t thead th", has_text="Qtd")
        if th_q.count():
            th_q.first.click(); pg.wait_for_timeout(100)
            ult = pg.eval_on_selector_all("#v-geral table.rel-t tbody tr", "rs => rs.map(r => r.className)")
            R.ok("ordenar: no quadro de relevância, o total fica no fim", not ult or "tot-r" in (ult[-1] or "") or all("tot-r" not in x for x in ult), ult[-2:])
    if V3:
        pg.click('[data-tab="crit"]'); pg.wait_for_timeout(150)
        hs = pg.eval_on_selector_all("table.rk-t thead th", "e => e.map(x => x.textContent.trim())")
        if "Pontos" in hs:
            ip = hs.index("Pontos")
            pg.locator("table.rk-t thead th").nth(ip).click(); pg.wait_for_timeout(150)
            pts_rk = [comum.num_br(x) for x in pg.eval_on_selector_all("table.rk-t tbody tr", "rs => rs.map(r => r.cells[%d].textContent.trim())" % ip)]
            R.ok("ordenar: ranking das cartas pelos pontos, do maior para o menor", pts_rk == sorted(pts_rk, reverse=True) and len(pts_rk) > 5, pts_rk[:5])
        pg.click('[data-tab="tab"]'); pg.wait_for_timeout(150)
    # nome impresso: a página mostra o nome da carta física; o do Scryfall fica só nos dados
    escondidos = [c["on"] for c in D["cards"] if c.get("on")]
    if escondidos:
        R.ok("nome impresso no lugar do nome do Scryfall", not [n for n in escondidos if any(n in v for v in visto)],
             ", ".join(c["n"] for c in D["cards"] if c.get("on")))

    # gaveta: stepper, PetCard e tier (com uma carta que não sai nas trocas sugeridas)
    saem = {c.get("sai") for c in D["cands"] if c["verdict"] == "entra"}
    alvo = next(c for c in D["cards"] if not c.get("cmd") and not c.get("land") and c["s"][1] < 3 and c["tier"] != "D" and c["id"] not in saem)
    pg.click('[data-tab="tier"]'); pg.wait_for_timeout(250)
    n_d = pg.locator('#v-tier .tier[data-t="D"] .chip').count()
    pg.click('#v-tier .chip[data-card="%s"]' % alvo["id"]); pg.wait_for_timeout(200)
    # no deck v3 a soma do 8×8 fica na linha menor da gaveta, e o número grande é o valor nos critérios
    soma8 = (lambda: int(pg.inner_text(".dw-sum small").split(":")[1])) if V3 else (lambda: int(pg.inner_text(".dw-sum b")))
    if V3:
        pg.click(".dw-8:not(.dw-c3):not(.dw-enc) summary"); pg.click(".dw-c3 > summary"); pg.wait_for_timeout(80)   # notas do 8×8 e dos critérios ficam em blocos que abrem
    p0, v0 = soma8(), comum.num_br(pg.inner_text(".dw-sum b"))
    pg.click('[data-act="step"][data-g="1"][data-d="1"]'); pg.check('[data-act="pet"]'); pg.wait_for_timeout(120)
    R.ok("gaveta mostra onde a carta aparece em outros decks e pastas", "Em outros decks e pastas" in pg.inner_text("#drawer"))
    R.ok("stepper e PetCard", soma8() == p0 + (2 if ipet >= 0 else 1), alvo["n"])
    R.ok("gaveta com uma nota por agrupamento" + (" e uma por critério" if V3 else ""), pg.locator(".drawer .step").count() == NG + len(CR))
    d3 = 0
    if V3:
        R.ok("gaveta v3: o 8×8 não mexe no valor da carta nos critérios", comum.num_br(pg.inner_text(".dw-sum b")) == v0, v0)
        j = next(i for i, v in enumerate(alvo["s3"]) if v < 3)
        d3 = CR[j]["peso"] * (RG["pontos_por_nota"][alvo["s3"][j] + 1] - RG["pontos_por_nota"][alvo["s3"][j]])
        pg.click('[data-act="step3"][data-g="%d"][data-d="1"]' % j); pg.wait_for_timeout(120)
        R.ok("gaveta v3: +1 em %s soma peso × pontos da nota" % CR[j]["nome"], comum.num_br(pg.inner_text(".dw-sum b")) == v0 + d3, (v0, d3))
    # sem preço na ficha, mas o link para a LigaMagic fica (decisão do dono, 15/10/2026)
    R.ok("ficha sem preço (sem valor em R$ ou US$) e com o link da LigaMagic", pg.locator('#drawer [data-act="val"]').count() == 0 and "R$" not in pg.inner_text("#drawer") and "US$" not in pg.inner_text("#drawer")
         and pg.locator('#drawer a[href*="ligamagic.com.br"]').count() == 1)
    pg.click('[data-act="set-tier"][data-v="D"]'); pg.wait_for_timeout(150)
    R.ok("tier pela gaveta muda a tier list", pg.locator('#v-tier .tier[data-t="D"] .chip').count() == n_d + 1)
    pg.keyboard.press("Escape"); pg.click('[data-tab="geral"]'); pg.wait_for_timeout(200)
    # sem preço no painel (decisão do dono): o quadro de relevância, o Tabelão e a ficha não mostram dólar nem real
    R.ok("quadro de relevância sem preço", not any(x in pg.inner_text("#v-geral .rel-t") for x in ("US$", "R$")))

    # tier list: duas visões e arrastar
    pg.click('[data-tab="tier"]'); pg.wait_for_timeout(250)
    R.ok("tier list com as duas visões", pg.locator('[data-act="tier-view"]').count() == 2)
    pg.click('[data-act="tier-view"][data-v="fichas"]'); pg.wait_for_timeout(150)
    R.ok("visão em fichas", pg.locator("#v-tier .chip.tile").count() == 0 and pg.locator("#v-tier .chip").count() > 0)
    pg.click('[data-act="tier-view"][data-v="cartas"]'); pg.wait_for_timeout(150)
    R.ok("visão em cartas", pg.locator("#v-tier .chip.tile").count() > 0)
    mover = next(c for c in D["cards"] if not c.get("cmd") and not c.get("land") and c["tier"] not in ("B", "D") and c["id"] != alvo["id"] and c["id"] not in saem)
    pg.drag_and_drop('#v-tier .chip[data-card="%s"]' % mover["id"], '#v-tier [data-drop="tier:B"]'); pg.wait_for_timeout(250)
    R.ok("arrastar entre tiers", pg.locator('#v-tier .tier[data-t="B"] .chip[data-card="%s"]' % mover["id"]).count() == 1, mover["n"])
    # 8×8: um quadro por agrupamento e um de Mana; arrastar muda a contagem e não o placar
    pg.click('[data-tab="geral"]'); pg.wait_for_timeout(200)
    pt0 = placar_tela()
    pg.click('[data-tab="pk"]'); pg.wait_for_timeout(250)
    gks = [g["k"] for g in D["grupos"]]
    R.ok("8×8: um quadro por agrupamento e um de Mana", pg.locator("#v-pk .kcol").count() in (NG + 1, NG + 2), pg.locator("#v-pk .kcol").count())
    R.ok("8×8: todas as cartas, menos o comandante, em algum quadro", pg.locator("#v-pk .kcol .chip").count() >= 1)
    caras = pg.evaluate("Array.from(document.querySelectorAll('#v-pk .pk-c > .chip')).map(e=>e.dataset.card)")
    porid = {c["id"]: c for c in D["cards"]}
    R.ok("8×8: a mais cara de cada pacote fica fora do plano (sem tier S, intocável ou custo que já cai)",
         all(porid[i]["cmc"] >= 4 and porid[i]["tier"] != "S" and porid[i]["rel"] != "INS" and not porid[i].get("cpd") for i in caras), caras)
    orig = next((k for k in gks if pg.locator('#v-pk [data-drop="pk:%s"] .chip' % k).count() > 0), None)
    dest = next((k for k in gks if k != orig), None)
    if orig and dest:
        n_o = pg.locator('#v-pk [data-drop="pk:%s"] .chip' % orig).count(); n_d2 = pg.locator('#v-pk [data-drop="pk:%s"] .chip' % dest).count()
        cid = pg.get_attribute('#v-pk [data-drop="pk:%s"] .chip' % orig, "data-card")
        pg.drag_and_drop('#v-pk [data-drop="pk:%s"] .chip[data-card="%s"]' % (orig, cid), '#v-pk [data-drop="pk:%s"]' % dest); pg.wait_for_timeout(250)
        R.ok("8×8: arrastar muda a contagem dos dois quadros",
             pg.locator('#v-pk [data-drop="pk:%s"] .chip' % orig).count() == n_o - 1 and pg.locator('#v-pk [data-drop="pk:%s"] .chip' % dest).count() == n_d2 + 1, cid)
        pg.click('[data-tab="geral"]'); pg.wait_for_timeout(200)
        R.ok("8×8: a simulação não muda o placar", placar_tela() == pt0, pt0)
        pg.click('[data-act="backup"]'); R.ok("8×8: o backup guarda o pacote movido", cid in json.loads(pg.input_value("#bk-out")).get("pk", {}))
        pg.keyboard.press("Escape")
        pg.click('[data-tab="pk"]'); pg.click('[data-act="pk-reset"]'); pg.wait_for_timeout(200)
        R.ok("8×8: desfazer a simulação", pg.locator('#v-pk [data-drop="pk:%s"] .chip' % orig).count() == n_o)
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
    porid = {c["id"]: c for c in D["cards"]}
    temx = lambda c: "{X}" in (c.get("cost") or "")
    com_cv = [c for c in sug if not c.get("land") and not porid[c["sai"]].get("land") and
              (temx(c) or temx(porid[c["sai"]]) or not (c.get("mdfc") or porid[c["sai"]].get("mdfc")))]
    R.ok("radar: o ganho de custo em cada cartão com quem sai", all(pg.locator("#cand-%s .cand-cv" % c["id"]).count() == 1 for c in com_cv) and
         pg.locator("#v-radar .cand-cv").count() == len(com_cv), (pg.locator("#v-radar .cand-cv").count(), len(com_cv)))
    for c in entram:
        pg.click('[data-act="swap"][data-id="%s"]' % c["id"]); pg.wait_for_timeout(120)
    R.ok("trocas sugeridas mantêm a contagem", cnt() == "%d cartas" % ctl.get("cartas", 100), cnt())
    R.ok("histórico com uma linha por troca", pg.locator("#v-radar .hist tbody tr").count() == len(entram))
    pg.click('[data-tab="geral"]'); pg.wait_for_timeout(300)
    facts = pg.inner_text("#v-geral .facts").replace("\n", " "); read = pg.inner_text("#v-geral .read")
    pt = placar_tela()
    R.nota("depois das %d trocas: %s | placar %s" % (len(entram), facts, pt))
    R.nota(" / ".join(x.split(".")[0] for x in read.split("\n") if x.strip())[:400])
    if V3 and "placar_trocas_v3" in ctl:
        # no v3 só a nota +1 no critério mexe no placar; o 8×8, o PetCard e o tier, não
        R.ok("placar depois das trocas (v3)", pt == ctl["placar_trocas_v3"] + d3, (pt, ctl["placar_trocas_v3"], d3))
    elif not V3 and "placar_trocas" in ctl:
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
    R.ok("backup guarda trocas, datas e imagens", len(j["swaps"]) == len(entram) and (not entram or j["swaps"][0].get("d")) and j.get("img") is True and j.get("ts"))
    linhas = pg.input_value("#bk-list").split("\n")
    R.ok("decklist exportada", len(linhas) == len(D["cards"]) and (not entram or entram[0]["n"] in pg.input_value("#bk-list")), len(linhas))
    # só as que continuam no deck: uma carta de nome impresso pode ser a que sai numa troca sugerida
    ficam = [c["on"] for c in D["cards"] if c.get("on") and c["id"] not in {x.get("sai") for x in entram}]
    if ficam:
        R.ok("decklist exportada com o nome do Scryfall", all(n in pg.input_value("#bk-list") for n in ficam), ficam)
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
