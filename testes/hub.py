# -*- coding: utf-8 -*-
"""Confere o hub aberto pelo atalho da raiz, sem internet.

    python testes/hub.py
"""
import csv, os, subprocess, sys
from playwright.sync_api import sync_playwright
import comum

a = comum.argumentos("Hub dos decks")
R = comum.Relatorio("hub")
if not a.sem_montar:
    r = subprocess.run([sys.executable, "-B", os.path.join(comum.MOTOR, "build.py"), "--hub"], capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        sys.exit("o build do hub falhou:\n" + r.stdout + r.stderr)
atalho = os.path.join(comum.RAIZ, "Abrir o Hub.html")
with open(os.path.join(comum.RAIZ, "contexto", "inventario.csv"), encoding="utf-8") as f:
    inv = [x["pasta"] for x in csv.DictReader(f)]

with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h in ((1360, 1000), (375, 812)):
        pg = b.new_page(viewport={"width": w, "height": h})
        reqs = []
        pg.on("pageerror", lambda e: R.erros.append("PAGEERROR " + str(e)))
        pg.route("**/*", lambda r: (reqs.append(r.request.url), r.abort()) if r.request.url.startswith("http") else r.continue_())
        pg.goto(comum.url(atalho)); pg.wait_for_timeout(1000)
        if w > 1000:
            H = pg.evaluate("window.HUB")
            R.ok("atalho da raiz abre o hub", pg.url.endswith("00.%20Hub.html"), pg.url[-30:])
            R.ok("abas Decks, Pastas e Dashboard", pg.eval_on_selector_all("[role=tab][data-vista]", "e=>e.map(x=>x.textContent)") == ["Decks", "Pastas", "Dashboard"])
            R.ok("grupos na ordem do aplicativo", pg.eval_on_selector_all(".grupo h2", "e=>e.map(x=>x.textContent.trim())") ==
                 ["01. Top", "02. Tribais", "03. Caos", "04. Forfun", "Compras + Precon"])
            pastas = [d["pasta"] for d in H["decks"]]
            R.ok("todos os decks do inventário e de dados/", set(inv) <= set(pastas), sorted(set(inv) - set(pastas)))
            R.ok("um cartão por deck, sem repetição", pg.locator(".deck").count() == len(H["decks"]) == len(set(pastas)), pg.locator(".deck").count())
            R.ok("nome do deck é o nome da pasta", all(d["nome"] == d["pasta"].split(". ", 1)[1] for d in H["decks"]))
            prontos = [d for d in H["decks"] if d["painel"]]
            R.ok("decks sem painel em construção", pg.locator(".deck.vazio").count() == len(H["decks"]) - len(prontos))
            R.ok("só os pontos no cartão, sem selo de situação", pg.locator(".deck .pts").count() == len(prontos) and pg.locator(".selo,.nums").count() == 0)
            R.ok("cartões dos painéis apontam para arquivos que existem",
                 all(os.path.exists(os.path.join(comum.RAIZ, "saidas", d["pasta"] + ".html")) for d in prontos))
            for d in prontos:
                R.ok("%s: placar igual ao do controle" % d["pasta"], d["placar"] == comum.controle(d["pasta"]).get("placar", d["placar"]), d["placar"])
            R.ok("rodapé com o limite do hub", "foto do último build" in pg.inner_text("#foot"))
            pg.fill("#q", "giada"); pg.wait_for_timeout(100)
            R.ok("busca filtra os cartões", pg.locator(".deck:not([hidden])").count() == 1)
            pg.fill("#q", "")
            pg.click("#t-pastas"); R.ok("aba Pastas com as oito pastas", pg.is_visible("#v-pastas") and pg.locator(".pasta").count() == 8)
            pg.click("#t-dash"); R.ok("aba Dashboard", pg.is_visible("#v-dash") and pg.locator("#v-dash .cx").count() == 3)
            pg.click("#t-decks")
            if prontos:
                pg.click(".deck:not(.vazio) .ir >> nth=0"); pg.wait_for_timeout(1200)
                R.ok("o cartão abre o painel, sem internet", pg.evaluate("!!(window.PAINEL && window.PAINEL.D)"), pg.url[-30:])
                R.ok("o painel tem o botão de voltar ao hub", pg.get_attribute("#voltar", "href") == "00.%20Hub.html" and pg.is_visible("#voltar"))
                pg.click("#voltar"); pg.wait_for_timeout(800)
                R.ok("voltar leva ao hub", pg.url.endswith("00.%20Hub.html"))
        for v in ("decks", "pastas", "dash"):
            pg.evaluate("v => document.querySelector('[data-vista=\"' + v + '\"]').click()", v); pg.wait_for_timeout(100)
            R.ok("%d px, %s: sem rolagem lateral" % (w, v), pg.evaluate("document.documentElement.scrollWidth") <= w)
        R.ok("%d px: nenhuma chamada de rede" % w, not reqs, reqs[:2])
        pg.close()
    b.close()
R.fim()
