# -*- coding: utf-8 -*-
"""Bateria de testes em navegador headless (Playwright + Chromium).

Uso: python3 scripts/testar.py [caminho do html]     (padrão: dist/coro-da-alvorada.html)
Requer: pip install playwright && playwright install chromium
Gera capturas em ./capturas e termina com código 1 se algo falhar.
"""
import asyncio, os, sys
from playwright.async_api import async_playwright

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(RAIZ, "dist", "coro-da-alvorada.html")
CAPT = os.path.join(RAIZ, "capturas")
ABAS = ["geral", "tier", "tab", "ctrl", "radar"]
falhas = []


def confere(cond, msg):
    print(("ok   " if cond else "FALHA") + " " + msg)
    if not cond:
        falhas.append(msg)


async def main():
    os.makedirs(CAPT, exist_ok=True)
    async with async_playwright() as p:
        nav = await p.chromium.launch()
        # 1. render nas cinco abas, em três larguras, com console limpo
        for largura in (1320, 860, 390):
            ctx = await nav.new_context(viewport={"width": largura, "height": 900})
            pg = await ctx.new_page(); erros = []
            pg.on("console", lambda m: erros.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: erros.append(str(e)))
            await pg.goto("file://" + HTML); await pg.wait_for_timeout(2500)
            for aba in ABAS:
                if aba != "geral":
                    await pg.click('[data-tab="%s"]' % aba); await pg.wait_for_timeout(350)
                tam = await pg.evaluate("document.querySelector('#v-%s').innerHTML.length" % aba)
                confere(tam > 500, "largura %d, aba %s renderizada" % (largura, aba))
                await pg.screenshot(path=os.path.join(CAPT, "%d-%s.png" % (largura, aba)), full_page=True)
            confere(not erros, "largura %d sem erros de console %s" % (largura, erros[:2]))
            confere(await pg.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "largura %d sem rolagem horizontal da página" % largura)
            await ctx.close()
        # 2. números de controle e interações
        ctx = await nav.new_context(viewport={"width": 1320, "height": 900})
        pg = await ctx.new_page()
        await pg.goto("file://" + HTML); await pg.wait_for_timeout(1500)
        await pg.evaluate("localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(1500)
        confere(await pg.evaluate("document.querySelector('#deckCount').textContent") == "100 cartas", "contador em 100 cartas")
        placar = await pg.evaluate("document.querySelector('.score-big b').textContent")
        confere(placar.isdigit(), "placar numérico: " + placar)
        confere(await pg.evaluate("document.querySelectorAll('.pena').length") == 8, "oito penas")
        confere(await pg.evaluate("document.querySelectorAll('g.tubo').length") >= 6, "tubos da curva")
        confere(await pg.evaluate("document.querySelectorAll('.read li').length") == 8, "oito leituras do deck")
        await pg.click('.pena[data-g="3"]'); await pg.wait_for_timeout(400)
        confere(await pg.evaluate("document.querySelector('[role=tab][aria-selected=true]').dataset.tab") == "tab", "pena abre o tabelão filtrado")
        await pg.click("#tbody tr.row"); await pg.wait_for_timeout(300)
        antes = await pg.evaluate("document.querySelector('#drawer .dw-sum b').textContent")
        await pg.click('#drawer [data-act="step"][data-g="5"][data-d="1"]'); await pg.wait_for_timeout(200)
        depois = await pg.evaluate("document.querySelector('#drawer .dw-sum b').textContent")
        confere(int(depois) == int(antes) + 1, "nota editada na gaveta muda a pontuação")
        await pg.keyboard.press("Escape")
        await pg.click('[data-tab="tier"]'); await pg.wait_for_timeout(300)
        ficha = await pg.evaluate("document.querySelector('.tier[data-t=\"B\"] .chip').dataset.card")
        await pg.drag_and_drop('.chip[data-card="%s"]' % ficha, '[data-drop="tier:A"]'); await pg.wait_for_timeout(400)
        confere(await pg.evaluate("document.querySelector('.chip[data-card=\"%s\"]').closest('.tier').dataset.t" % ficha) == "A", "arrastar ficha muda o tier")
        await pg.click('[data-tab="radar"]'); await pg.wait_for_timeout(300)
        await pg.click('[data-act="swap"]'); await pg.wait_for_timeout(300)
        confere(await pg.evaluate("document.querySelectorAll('.cand.in').length") == 1, "troca no radar")
        confere(await pg.evaluate("document.querySelector('#deckCount').textContent") == "100 cartas", "troca mantém 100 cartas")
        await pg.reload(); await pg.wait_for_timeout(1200)
        await pg.click('[data-tab="radar"]'); await pg.wait_for_timeout(300)
        confere(await pg.evaluate("document.querySelectorAll('.cand.in').length") == 1, "estado persiste ao recarregar (arquivo local)")
        await pg.click('[data-act="backup"]'); await pg.wait_for_timeout(200)
        confere('"swaps"' in await pg.evaluate("document.querySelector('#bk-out').value"), "backup exporta o estado")
        await pg.click('[data-act="reset-all"]'); await pg.wait_for_timeout(150); await pg.click('[data-act="reset-all"]'); await pg.wait_for_timeout(300)
        confere(await pg.evaluate("document.querySelectorAll('.cand.in').length") == 0, "recomeçar limpa o estado")
        await ctx.close()
        # 3. ambiente sem armazenamento (iframe isolado, como a prévia de um chat)
        casca = os.path.join(CAPT, "_casca.html")
        open(casca, "w").write('<!doctype html><meta charset=utf-8><iframe sandbox="allow-scripts" src="file://%s" style="border:0;width:1200px;height:800px"></iframe>' % HTML)
        ctx = await nav.new_context(viewport={"width": 1240, "height": 840})
        pg = await ctx.new_page(); erros = []
        pg.on("pageerror", lambda e: erros.append(str(e)))
        await pg.goto("file://" + casca); await pg.wait_for_timeout(2200)
        quadro = pg.frames[1]
        confere(await quadro.evaluate("document.querySelectorAll('.pena').length") == 8 and not erros, "funciona sem armazenamento, em iframe isolado")
        await nav.close()
    print("\nTUDO CERTO" if not falhas else "\n%d FALHA(S)" % len(falhas))
    sys.exit(1 if falhas else 0)

asyncio.run(main())
