# -*- coding: utf-8 -*-
"""Confere a página Estratégias (motor/estrategias.py) sem rede: os digests de contexto/estrategias/, o markdown que o motor
converte, a tabela dos decks com o bloco "Na mesa", a barra do hub, sem preço e sem rolagem horizontal no celular.

    python testes/estrategias.py [--sem-montar]
"""
import os
from playwright.sync_api import sync_playwright
import comum
import estrategias

a = comum.argumentos("As Estratégias")
R = comum.Relatorio("estratégias")
arq = os.path.join(comum.RAIZ, "saidas", estrategias.NOME + ".html")
if not a.sem_montar or not os.path.exists(arq):
    html, _ = estrategias.pagina(avisar=lambda *x: None)
    with open(arq, "w", encoding="utf-8") as f:
        f.write(html)

ts = estrategias.temas()
ds = estrategias.decks_na_mesa()
com = [d for d in ds if d["tem"]]
R.ok("há pelo menos um digest em contexto/estrategias", len(ts) >= 1, [t["arquivo"] for t in ts])
R.ok("o digest de avaliação de ameaças está lá", any(t["k"] == "ameaca" for t in ts), [t["k"] for t in ts])
R.ok("todo deck entra na tabela, com ou sem o bloco", len(ds) >= 30 and all(d["nome"] and d["href"] for d in ds), len(ds))

tit, corpo = estrategias.md_para_html("# T\n\n## S\n\ntexto **forte** e `cod` e [l](https://x.y/z)\n\n- a\n- b\n\n1. um\n2. dois\n\n| x | y |\n|---|---|\n| 1 | 2 |\n")
R.ok("markdown: título, seção, negrito, código, link, listas e tabela",
     tit == "T" and "<h2>S</h2>" in corpo and "<b>forte</b>" in corpo and "<code>cod</code>" in corpo and 'href="https://x.y/z"' in corpo
     and "<li>a</li>" in corpo and "<ol><li>um</li>" in corpo and "<th>x</th>" in corpo and "<td>2</td>" in corpo, corpo[:160])
R.ok("markdown escapa HTML", "<script" not in estrategias.md_para_html("texto <script>x</script> & tal")[1])

with sync_playwright() as p:
    b = p.chromium.launch()
    for w in (1360, 375):
        pg = b.new_page(viewport={"width": w, "height": 900})
        comum.bloquear_rede(pg)
        pg.on("pageerror", lambda e: R.erros.append("PAGEERROR " + str(e)))
        pg.goto(comum.url(arq)); pg.wait_for_timeout(600)
        R.ok("%d px: título e barra do hub" % w, pg.inner_text("h1").strip() == "Estratégias" and pg.locator(".g-hubnav a").count() >= 5)
        R.ok("%d px: uma seção por digest, mais Nos decks, e a barra com as mesmas partes" % w,
             pg.locator("section.es-tema").count() == len(ts) + 1 and pg.locator("#e-nav a").count() == len(ts) + 1,
             (pg.locator("section.es-tema").count(), pg.locator("#e-nav a").count()))
        R.ok("%d px: uma linha por deck com o bloco Na mesa" % w, pg.locator(".es-decks tbody tr").count() == len(com), (pg.locator(".es-decks tbody tr").count(), len(com)))
        txt = pg.inner_text("main")
        R.ok("%d px: sem preço" % w, "US$" not in txt and "R$" not in txt and "preço:" not in txt.lower())
        R.ok("%d px: sem rolagem horizontal" % w, pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), pg.evaluate("document.documentElement.scrollWidth"))
        R.ok("%d px: nada abaixo de 13px" % w, pg.evaluate("Math.min.apply(null, Array.from(document.querySelectorAll('main p, main li, main td, main th, main a')).filter(e => e.offsetParent).map(e => parseFloat(getComputedStyle(e).fontSize)))") >= 13)
        if com:
            R.ok("%d px: o link do deck aponta para o painel" % w, pg.get_attribute(".es-deck", "href").endswith(".html"))
        pg.close()
    b.close()
R.fim()
