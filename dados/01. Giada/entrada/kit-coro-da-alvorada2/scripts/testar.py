# -*- coding: utf-8 -*-
"""Bateria de testes em navegador headless (Playwright + Chromium).

Uso: python3 scripts/testar.py [caminho do html]     (padrão: dist/coro-da-alvorada.html)
Requer: pip install playwright && playwright install chromium
O Scryfall é simulado dentro do teste (lote de cartas e imagens), em quatro situações: no ar, fora do ar,
só o lote fora do ar e versão com imagens embutidas. Nada sai para a internet.
Gera capturas em ./capturas e termina com código 1 se algo falhar.
"""
import asyncio, json, os, shutil, struct, subprocess, sys, uuid, zlib
from playwright.async_api import async_playwright

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(RAIZ, "dist", "coro-da-alvorada.html")
CAPT = os.path.join(RAIZ, "capturas")
ABAS = ["geral", "tier", "tab", "ctrl", "radar"]
D = json.load(open(os.path.join(RAIZ, "dados", "D.json"), encoding="utf-8"))
TODAS = D["cards"] + D["cands"] + D.get("pool", [])
SEM_IMPRESSAO = ("plci", "269p")          # o Scryfall simulado "não reconhece" esta impressão: exercita a busca pelo nome
CORS = {"access-control-allow-origin": "*", "access-control-allow-headers": "content-type, accept", "access-control-allow-methods": "GET, POST, OPTIONS"}
falhas = []


def confere(cond, msg):
    print(("ok   " if cond else "FALHA") + " " + msg)
    if not cond:
        falhas.append(msg)


def png(w, h, rgb):
    """PNG liso, sem depender de biblioteca de imagem."""
    bloco = lambda tipo, dados: struct.pack(">I", len(dados)) + tipo + dados + struct.pack(">I", zlib.crc32(tipo + dados) & 0xffffffff)
    linhas = b"".join(b"\x00" + bytes(rgb) * w for _ in range(h))
    return b"\x89PNG\r\n\x1a\n" + bloco(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) + bloco(b"IDAT", zlib.compress(linhas)) + bloco(b"IEND", b"")


FIGURA = png(61, 85, (58, 96, 170))


def dupla(c):
    return bool(c.get("back")) and bool(c.get("mdfc") or c["t"] == "bat" or c["id"] == "dowsing-dagger")


def carta_scryfall(c):
    uid = str(uuid.uuid5(uuid.NAMESPACE_URL, c["id"]))
    fig = lambda lado: {t: "https://cards.scryfall.io/%s/%s/%s/%s/%s.jpg" % (t, lado, uid[0], uid[1], uid) for t in ("small", "normal")}
    k = {"object": "card", "id": uid, "name": c["n"], "set": (c.get("set") or "tst").lower(), "collector_number": str(c.get("num") or "1"), "artist": "Artista de Teste"}
    if dupla(c):
        k["name"] = c["n"] + " // " + c["back"]["n"]
        k["card_faces"] = [{"name": c["n"], "artist": "Artista de Teste", "image_uris": fig("front")}, {"name": c["back"]["n"], "image_uris": fig("back")}]
    else:
        k["image_uris"] = fig("front")
    return k


def achar(ident):
    for c in TODAS:
        if "collector_number" in ident:
            par = (ident.get("set", "").lower(), str(ident["collector_number"]).lower())
            if par != SEM_IMPRESSAO and c.get("set") and (c["set"].lower(), str(c["num"]).lower()) == par:
                return c
        elif ident.get("name") == c["n"]:
            return c
    return None


async def contexto(nav, largura, modo, altura=900):
    """modo: no-ar | fora-do-ar | sem-lote. Devolve (ctx, página, erros de console, exceções, pedidos ao Scryfall)."""
    ctx = await nav.new_context(viewport={"width": largura, "height": altura})
    pedidos = []

    async def api(route):
        req = route.request
        pedidos.append(req.method + " " + req.url)
        if modo == "fora-do-ar" or (modo == "sem-lote" and "cards/collection" in req.url):
            return await route.abort()
        if "/%s/%s?" % SEM_IMPRESSAO in req.url.lower():          # impressão que o Scryfall simulado não tem
            return await route.fulfill(status=404, headers=CORS, body="")
        if req.method == "OPTIONS":
            return await route.fulfill(status=204, headers=CORS)
        if "cards/collection" in req.url:
            achadas, perdidas = [], []
            for i in json.loads(req.post_data)["identifiers"]:
                c = achar(i)
                (achadas.append(carta_scryfall(c)) if c else perdidas.append(i))
            return await route.fulfill(status=200, headers=dict(CORS, **{"content-type": "application/json"}), body=json.dumps({"object": "list", "not_found": perdidas, "data": achadas}))
        await route.fulfill(status=200, headers=dict(CORS, **{"content-type": "image/png"}), body=FIGURA)

    async def cdn(route):
        pedidos.append("GET " + route.request.url)
        if modo == "fora-do-ar":
            return await route.abort()
        await route.fulfill(status=200, headers={"content-type": "image/png"}, body=FIGURA)

    await ctx.route("https://api.scryfall.com/**", api)
    await ctx.route("https://cards.scryfall.io/**", cdn)
    pg = await ctx.new_page(); console, excecoes = [], []
    pg.on("console", lambda m: console.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: excecoes.append(str(e)))
    return ctx, pg, console, excecoes, pedidos


async def main():
    os.makedirs(CAPT, exist_ok=True)
    js = lambda pg, expr: pg.evaluate(expr)
    async with async_playwright() as p:
        nav = await p.chromium.launch()

        # 1. render nas cinco abas, em três larguras, com console limpo (Scryfall no ar)
        for largura in (1320, 860, 390):
            ctx, pg, console, excecoes, _ = await contexto(nav, largura, "no-ar")
            await pg.goto("file://" + HTML); await pg.wait_for_timeout(2600)
            for aba in ABAS:
                if aba != "geral":
                    await pg.click('[data-tab="%s"]' % aba); await pg.wait_for_timeout(700)
                tam = await js(pg, "document.querySelector('#v-%s').innerHTML.length" % aba)
                confere(tam > 500, "largura %d, aba %s renderizada" % (largura, aba))
                await pg.screenshot(path=os.path.join(CAPT, "%d-%s.png" % (largura, aba)), full_page=True)
            confere(not console and not excecoes, "largura %d sem erros de console %s" % (largura, (console + excecoes)[:2]))
            confere(await js(pg, "document.documentElement.scrollWidth <= window.innerWidth + 1"), "largura %d sem rolagem horizontal da página" % largura)
            await ctx.close()

        # 2. números de controle, novidades da v2 e interações
        ctx, pg, console, excecoes, pedidos = await contexto(nav, 1320, "no-ar")
        await pg.goto("file://" + HTML); await pg.wait_for_timeout(1200)
        await js(pg, "localStorage.clear()"); pedidos.clear(); await pg.reload(); await pg.wait_for_timeout(2000)
        confere(await js(pg, "document.querySelector('#deckCount').textContent") == "100 cartas", "contador em 100 cartas")
        placar = await js(pg, "document.querySelector('.score-big b').textContent")
        confere(placar.isdigit(), "placar numérico: " + placar)
        confere(await js(pg, "document.querySelectorAll('.pena').length") == 8, "oito penas")
        confere(await js(pg, "document.querySelectorAll('g.tubo').length") >= 6, "tubos da curva")
        confere(await js(pg, "document.querySelectorAll('.read li').length") == 8, "oito leituras do deck")
        confere(await js(pg, "(function(){var i=document.querySelector('.cmd-art img');return !!i && i.complete && i.naturalWidth===626 && i.src.indexOf('data:image')===0})()"), "arte da comandante embutida no herói")
        confere("Giada" in await js(pg, "document.querySelector('.cmd-plate').textContent"), "placa com o nome da comandante")
        lotes = [x for x in pedidos if "cards/collection" in x and x.startswith("POST")]
        confere(len(lotes) == 4, "imagens resolvidas em lote: %d chamadas (3 lotes e 1 busca pelo nome)" % len(lotes))
        leitura = await js(pg, "document.querySelectorAll('.read li')[4].textContent")
        confere("respondem a um alvo" in leitura and "Winds of Abandon" in leitura and "nenhuma custa 1 mana" in leitura, "leitura de remoção conta a carta de duas funções")
        linhas = await js(pg, "Array.from(document.querySelectorAll('.edh-l li b')).map(function(b){return b.textContent})")
        confere(linhas == ["10 de 10", "8 de 10", "4 de 6"], "sinal da comunidade: %s" % linhas)
        await pg.click('.pena[data-g="3"]'); await pg.wait_for_timeout(400)
        confere(await js(pg, "document.querySelector('[role=tab][aria-selected=true]').dataset.tab") == "tab", "pena abre o tabelão filtrado")
        await pg.click("#tbody tr.row"); await pg.wait_for_timeout(300)
        antes = await js(pg, "document.querySelector('#drawer .dw-sum b').textContent")
        await pg.click('#drawer [data-act="step"][data-g="5"][data-d="1"]'); await pg.wait_for_timeout(200)
        depois = await js(pg, "document.querySelector('#drawer .dw-sum b').textContent")
        confere(int(depois) == int(antes) + 1, "nota editada na gaveta muda a pontuação")
        await pg.keyboard.press("Escape")
        await pg.click('.pill[data-act="fg"][aria-pressed="true"]'); await pg.wait_for_timeout(150)
        await pg.click('[data-act="grouped"]'); await pg.wait_for_timeout(150)
        await pg.click('[data-act="sort"][data-k="syn"]'); await pg.wait_for_timeout(250)
        confere(await js(pg, "document.querySelector('#tbody tr.row .t').textContent") == "Lyra Dawnbringer", "tabelão ordena pela coluna da comunidade")

        await pg.click('[data-tab="tier"]'); await pg.wait_for_timeout(900)
        confere(await js(pg, "document.querySelectorAll('.tier .tile').length") == 68, "tier list em cartas: 68 fichas com imagem")
        confere(await js(pg, "document.querySelectorAll('.tier .ci.ok').length") > 8, "imagens das cartas carregadas na tier list")
        confere("cards.scryfall.io/small/front/" in await js(pg, "document.querySelector('.tier .ci.ok img').src"), "imagem vem direto do servidor de imagens")
        await pg.hover('.tier[data-t="S"] .tile'); await pg.wait_for_timeout(700)
        confere(await js(pg, "(function(){var p=document.querySelector('.peek');return !!p && !p.hidden && p.querySelector('img').naturalWidth>0})()"), "espiada da carta ao passar o mouse")
        await pg.mouse.move(5, 5)
        ficha = await js(pg, "document.querySelector('.tier[data-t=\"B\"] .chip').dataset.card")
        # origem e destino na tela antes de arrastar: o Playwright perde o arrasto se a página rolar com o botão apertado
        await js(pg, "document.querySelector('.tier[data-t=\"B\"]').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(300)
        o = await pg.locator('.chip[data-card="%s"]' % ficha).bounding_box(); d = await pg.locator('[data-drop="tier:A"]').bounding_box()
        ox, oy = o["x"] + o["width"] / 2, o["y"] + 60
        await pg.mouse.move(ox, oy); await pg.mouse.down(); await pg.mouse.move(ox + 6, oy - 6, steps=3)
        await pg.mouse.move(d["x"] + 70, d["y"] + d["height"] - 40, steps=8); await pg.mouse.up(); await pg.wait_for_timeout(500)
        confere(await js(pg, "document.querySelector('.chip[data-card=\"%s\"]').closest('.tier').dataset.t" % ficha) == "A", "arrastar ficha muda o tier")
        await pg.click('[data-act="tier-view"][data-v="fichas"]'); await pg.wait_for_timeout(300)
        confere(await js(pg, "document.querySelectorAll('.tier .tile').length") == 0 and await js(pg, "document.querySelectorAll('.tier .chip').length") == 68, "tier list volta para fichas de texto")
        await pg.click('[data-act="tier-view"][data-v="cartas"]'); await pg.wait_for_timeout(300)

        await pg.click('.chip[data-card="emeria-s-call"]'); await pg.wait_for_timeout(700)
        confere("/normal/front/" in await js(pg, "(document.querySelector('#drawer .ci.ok img')||{}).src||''"), "gaveta mostra a carta")
        confere("Artista de Teste" in await js(pg, "document.querySelector('#drawer .dw-art').textContent"), "gaveta credita o ilustrador")
        await pg.click('#drawer [data-act="flip"]'); await pg.wait_for_timeout(600)
        confere("/normal/back/" in await js(pg, "(document.querySelector('#drawer .ci.ok img')||{}).src||''"), "carta dupla vira para o verso")
        confere("+9%" in await js(pg, "document.querySelector('#drawer .dw-syn').textContent"), "gaveta mostra a sinergia da comunidade")
        liga = await js(pg, "(document.querySelector('#drawer a[href*=\"ligamagic\"]')||{}).href||''")
        confere("view=cards/card" in liga and "Emeria" in liga, "link de preço na Liga Magic")
        await pg.keyboard.press("Escape")
        await pg.click('[data-tab="ctrl"]'); await pg.wait_for_timeout(400)
        await pg.click('.chip[data-card="cavern-of-souls"]', timeout=3000) if await js(pg, "!!document.querySelector('.chip[data-card=\"cavern-of-souls\"]')") else await js(pg, "0")
        if not await js(pg, "!document.querySelector('#drawer').hidden"):
            await pg.click('[data-act="ctrl-lands"]'); await pg.wait_for_timeout(300); await pg.click('.chip[data-card="cavern-of-souls"]')
        await pg.wait_for_timeout(600)
        confere(await js(pg, "!!document.querySelector('#drawer .ci.ok img')"), "impressão não reconhecida é achada pelo nome")
        await pg.keyboard.press("Escape")
        div = await js(pg, "Array.from(document.querySelectorAll('.dv')).map(function(u){return Array.from(u.querySelectorAll('.nm')).map(function(n){return n.textContent})})")
        confere(div == [["Angelic Skirmisher", "Emeria, the Sky Ruin"], ["Clever Concealment", "Faceless Haven", "Selfless Spirit"]], "divergências com a comunidade: %s" % div)

        await pg.click('[data-tab="radar"]'); await pg.wait_for_timeout(700)
        confere(await js(pg, "document.querySelectorAll('.cand').length") == 17 and await js(pg, "document.querySelectorAll('.fora li').length") == 1, "radar: 17 candidatas em jogo e 1 na lista das que ficam de fora")
        await pg.click('#cand-segovian-angel [data-act="verdict"]'); await pg.wait_for_timeout(300)
        confere(await js(pg, "!document.querySelector('#cand-segovian-angel')") and "Segovian Angel" in await js(pg, "document.querySelector('.fora').textContent") and "Disputa a vaga" in await js(pg, "document.querySelector('.fora').textContent"), "deixar de fora leva a carta para a lista de baixo, com tier e motivo")
        await pg.click('.fora [data-act="verdict"][data-id="segovian-angel"]'); await pg.wait_for_timeout(300)
        confere(await js(pg, "!!document.querySelector('#cand-segovian-angel')") and await js(pg, "document.querySelectorAll('.fora li').length") == 1, "reavaliar devolve a carta ao radar")
        await pg.click('#cand-segovian-angel h3 button'); await pg.wait_for_timeout(300)
        await pg.click('#drawer [data-act="verdict"][data-v="fora"]'); await pg.wait_for_timeout(300)
        confere(await js(pg, "document.querySelector('#drawer [data-act=\"verdict\"][data-v=\"fora\"]').getAttribute('aria-pressed')") == "true" and await js(pg, "document.querySelectorAll('.fora li').length") == 2, "veredito também muda pela gaveta")
        await pg.click('#drawer [data-act="verdict"][data-v="avaliar"]'); await pg.wait_for_timeout(200); await pg.keyboard.press("Escape")
        confere(await js(pg, "document.querySelectorAll('.pool .pc').length") == 12 and "Potenciais 52" == await js(pg, "document.querySelector('#edhBtn').textContent"), "potenciais do edh.wiki: 12 à mostra de 52")
        await pg.click('[data-act="pool-all"]'); await pg.wait_for_timeout(300)
        confere(await js(pg, "document.querySelectorAll('.pool .pc').length") == 52 and await js(pg, "document.querySelector('.pool .pc h3').textContent") == "Thraben Watcher", "potenciais: lista completa, da maior sinergia para a menor")
        await pg.click('.pool [data-act="pool-in"][data-v="avaliar"][data-id="thraben-watcher"]'); await pg.wait_for_timeout(400)
        confere(await js(pg, "!!document.querySelector('#cand-thraben-watcher')") and "edh.wiki +41%" in await js(pg, "document.querySelector('#cand-thraben-watcher').textContent") and await js(pg, "document.querySelectorAll('.pool .pc').length") == 51, "potencial levado ao radar vira candidata")
        await pg.click('.pool [data-act="pool-in"][data-v="fora"][data-id="angelic-accord"]'); await pg.wait_for_timeout(400)
        confere("Angelic Accord" in await js(pg, "document.querySelector('.fora').textContent") and await js(pg, "document.querySelector('#edhBtn').textContent") == "Potenciais 50", "potencial deixado de fora fica registrado na lista")
        confere("edh.wiki/commanders/giada-font-of-hope" in await js(pg, "document.querySelector('#edh-req').value"), "pedido de atualização pronto para copiar")
        await pg.click('#edhBtn'); await pg.wait_for_timeout(300)
        confere(await js(pg, "document.querySelector('[role=tab][aria-selected=true]').dataset.tab") == "radar", "botão do topo leva aos potenciais")
        await js(pg, "window.scrollTo(0, 0)"); await pg.wait_for_timeout(700)
        confere(await js(pg, "document.querySelectorAll('.cand-th .ci.ok').length") > 2 and await js(pg, "document.querySelectorAll('.fora li').length") == 2, "miniaturas no radar")
        confere("edh.wiki +34%" in await js(pg, "document.querySelector('#cand-folk-hero').textContent"), "candidata traz a sinergia da comunidade")
        await pg.click('[data-act="swap"]'); await pg.wait_for_timeout(300)
        confere(await js(pg, "document.querySelectorAll('.cand.in').length") == 1, "troca no radar")
        confere(await js(pg, "document.querySelector('#deckCount').textContent") == "100 cartas", "troca mantém 100 cartas")
        pedidos.clear(); await pg.reload(); await pg.wait_for_timeout(1500)
        await pg.click('[data-tab="radar"]'); await pg.wait_for_timeout(600)
        confere(await js(pg, "document.querySelectorAll('.cand.in').length") == 1 and await js(pg, "!!document.querySelector('#cand-thraben-watcher')") and "Angelic Accord" in await js(pg, "document.querySelector('.fora').textContent"), "estado persiste ao recarregar (arquivo local)")
        confere(not [x for x in pedidos if "api.scryfall.com" in x] and any("cards.scryfall.io" in x for x in pedidos), "ao reabrir, nenhuma chamada à API: só as imagens")
        await pg.click('#imgNote [data-act="img"]'); await pg.wait_for_timeout(300)
        await pg.click('[data-tab="tier"]'); await pg.wait_for_timeout(300)
        confere(await js(pg, "document.querySelectorAll('.ci').length") == 0, "botão desliga as imagens das cartas")
        await pg.reload(); await pg.wait_for_timeout(1200)
        confere("desligadas" in await js(pg, "document.querySelector('#imgNote').textContent"), "imagens desligadas persistem ao recarregar")
        await pg.click('[data-act="backup"]'); await pg.wait_for_timeout(200)
        confere('"swaps"' in await js(pg, "document.querySelector('#bk-out').value"), "backup exporta o estado")
        await pg.click('[data-act="reset-all"]'); await pg.wait_for_timeout(150); await pg.click('[data-act="reset-all"]'); await pg.wait_for_timeout(600)
        await pg.click('[data-tab="radar"]'); await pg.wait_for_timeout(400)
        confere(await js(pg, "document.querySelectorAll('.cand.in').length") == 0 and await js(pg, "document.querySelectorAll('.cand-th').length") == 17 and await js(pg, "document.querySelectorAll('.pool .pc').length") == 12, "recomeçar limpa o estado e religa as imagens")
        confere(not console and not excecoes, "interações sem erros de console %s" % (console + excecoes)[:2])
        await ctx.close()

        # 3. Scryfall fora do ar: o painel segue inteiro, sem imagens de carta
        ctx, pg, console, excecoes, pedidos = await contexto(nav, 1320, "fora-do-ar")
        await pg.goto("file://" + HTML); await pg.wait_for_timeout(2500)
        confere(await js(pg, "document.querySelectorAll('.pena').length") == 8 and await js(pg, "document.querySelector('.cmd-art img').naturalWidth") == 626, "sem rede: visão geral e arte da comandante intactas")
        await pg.click('[data-tab="tier"]'); await pg.wait_for_timeout(400)
        confere(await js(pg, "document.querySelectorAll('.tier .tile').length") == 0 and await js(pg, "document.querySelectorAll('.tier .chip').length") == 68, "sem rede: tier list cai para fichas de texto")
        confere("fora do ar" in await js(pg, "document.querySelector('#imgNote').textContent"), "sem rede: rodapé explica e oferece tentar de novo")
        await pg.click(".tier .chip"); await pg.wait_for_timeout(300)
        confere("Sem imagem agora" in await js(pg, "document.querySelector('#drawer .dw-art').textContent"), "sem rede: gaveta avisa no lugar da imagem")
        alheios = [m for m in console if "Failed to load resource" not in m and "net::ERR" not in m]
        confere(not excecoes and not alheios, "sem rede: nenhum erro de script %s" % (excecoes + alheios)[:2])
        confere(len(pedidos) <= 3, "sem rede: o painel desiste depois de %d pedidos" % len(pedidos))
        await pg.screenshot(path=os.path.join(CAPT, "1320-tier-sem-rede.png"), full_page=False)
        await ctx.close()

        # 4. só o pedido em lote fora do ar: imagens pedidas uma a uma, com intervalo
        ctx, pg, console, excecoes, pedidos = await contexto(nav, 1320, "sem-lote")
        await pg.goto("file://" + HTML); await pg.wait_for_timeout(2500)
        confere("uma a uma" in await js(pg, "document.querySelector('#imgNote').textContent"), "lote fora do ar: cai para imagem por imagem")
        await pg.click('[data-tab="tier"]'); await pg.wait_for_timeout(2600)
        fonte = await js(pg, "(document.querySelector('.tier .ci.ok img')||{}).src||''")
        confere("api.scryfall.com/cards/" in fonte and "format=image" in fonte, "lote fora do ar: imagem pela edição e número da lista")
        await pg.click('[data-tab="tab"]'); await pg.wait_for_timeout(300)
        await pg.fill("#q", "Cavern of Souls"); await pg.wait_for_timeout(200); await pg.click("#tbody tr.row"); await pg.wait_for_timeout(1500)
        confere("cards/named" in await js(pg, "(document.querySelector('#drawer .ci.ok img')||{}).src||''"), "lote fora do ar: impressão não reconhecida cai para a busca pelo nome")
        confere(not excecoes, "lote fora do ar: nenhum erro de script %s" % excecoes[:2])
        await ctx.close()

        # 5. ambiente sem armazenamento (iframe isolado, como a prévia de um chat)
        casca = os.path.join(CAPT, "_casca.html")
        open(casca, "w").write('<!doctype html><meta charset=utf-8><iframe sandbox="allow-scripts" src="file://%s" style="border:0;width:1200px;height:800px"></iframe>' % HTML)
        ctx, pg, console, excecoes, _ = await contexto(nav, 1240, "no-ar", 840)
        await pg.goto("file://" + casca); await pg.wait_for_timeout(2400)
        quadro = pg.frames[1]
        confere(await quadro.evaluate("document.querySelectorAll('.pena').length") == 8 and not excecoes, "funciona sem armazenamento, em iframe isolado %s" % excecoes[:1])
        await ctx.close()

        # 6. versão com imagens embutidas: nenhuma chamada externa
        pasta = os.path.join(RAIZ, "imagens", "cartas")
        if os.path.isdir(pasta):
            print("--   versão com imagens embutidas: pulada, porque imagens/cartas/ já existe (não mexo nas suas imagens)")
        else:
            os.makedirs(pasta)
            try:
                for nome in ("giada-font-of-hope.png", "sol-ring.png", "emeria-s-call.png", "emeria-s-call.back.png"):
                    open(os.path.join(pasta, nome), "wb").write(FIGURA)
                json.dump({"sol-ring": "Artista Embutido"}, open(os.path.join(pasta, "creditos.json"), "w"))
                saida = os.path.join(CAPT, "_pacote.html")
                subprocess.check_call([sys.executable, os.path.join(RAIZ, "scripts", "montar.py"), "--imagens", "--saida", saida], stdout=subprocess.DEVNULL)
            finally:
                shutil.rmtree(pasta)
            ctx, pg, console, excecoes, pedidos = await contexto(nav, 1320, "fora-do-ar")
            await pg.goto("file://" + saida); await pg.wait_for_timeout(1500)
            confere("embutidas" in await js(pg, "document.querySelector('#imgNote').textContent"), "versão embutida: rodapé informa a fonte")
            await pg.click('[data-tab="tab"]'); await pg.wait_for_timeout(300)
            await pg.fill("#q", "Sol Ring"); await pg.wait_for_timeout(200); await pg.click("#tbody tr.row"); await pg.wait_for_timeout(500)
            confere((await js(pg, "(document.querySelector('#drawer .ci.ok img')||{}).src||''")).startswith("data:image/png"), "versão embutida: carta sai de dentro do arquivo")
            confere("Artista Embutido" in await js(pg, "document.querySelector('#drawer .dw-art').textContent"), "versão embutida: crédito do ilustrador")
            confere(not pedidos and not console and not excecoes, "versão embutida: zero pedidos externos e console limpo %s" % (pedidos + console + excecoes)[:2])
            await ctx.close()

        # 7. montagem para publicar: o painel nem tenta buscar imagem de fora
        saida = os.path.join(CAPT, "_publicado.html")
        subprocess.check_call([sys.executable, os.path.join(RAIZ, "scripts", "montar.py"), "--publicar", "--saida", saida], stdout=subprocess.DEVNULL)
        ctx, pg, console, excecoes, pedidos = await contexto(nav, 1320, "no-ar")
        await pg.goto("file://" + saida); await pg.wait_for_timeout(1500)
        confere("versão publicada" in await js(pg, "document.querySelector('#imgNote').textContent") and await js(pg, "!document.querySelector('#imgNote button')"), "para publicar: rodapé explica, sem botão que não leva a nada")
        confere(await js(pg, "document.querySelectorAll('.pena').length") == 8 and await js(pg, "document.querySelector('.cmd-art img').naturalWidth") == 626, "para publicar: visão geral e arte da comandante intactas")
        await pg.click('[data-tab="tier"]'); await pg.wait_for_timeout(400)
        confere(await js(pg, "document.querySelectorAll('.tier .tile').length") == 0 and await js(pg, "document.querySelectorAll('.tier .chip').length") == 68, "para publicar: tier list em fichas de texto")
        await pg.click(".tier .chip"); await pg.wait_for_timeout(300)
        confere(await js(pg, "!document.querySelector('#drawer .dw-art') && !document.querySelector('#drawer [data-act=\"img\"]')"), "para publicar: gaveta sem moldura vazia nem botão de imagem")
        confere(not pedidos and not console and not excecoes, "para publicar: zero pedidos externos e console limpo %s" % (pedidos + console + excecoes)[:2])
        await ctx.close()

        # 8. ambiente que barra outros sites por política (como a prévia de um chat): o painel percebe e explica
        ctx, pg, console, excecoes, pedidos = await contexto(nav, 1320, "no-ar")
        pagina = open(HTML, "rb").read()

        async def casa(route):
            await route.fulfill(status=200, headers={"content-type": "text/html; charset=utf-8", "content-security-policy": "default-src 'self' 'unsafe-inline' data: blob:"}, body=pagina)
        await ctx.route("https://painel.teste/**", casa)
        await pg.goto("https://painel.teste/"); await pg.wait_for_timeout(2200)
        confere("barradas aqui" in await js(pg, "document.querySelector('#imgNote').textContent"), "política do ambiente barra o Scryfall: o painel percebe e explica")
        await pg.click('[data-tab="tier"]'); await pg.wait_for_timeout(400)
        confere(await js(pg, "document.querySelectorAll('.tier .chip').length") == 68 and not excecoes and not pedidos, "política do ambiente: fichas de texto, nenhum erro de script, nenhum pedido saiu %s" % (excecoes + pedidos)[:2])
        await ctx.close()
        await nav.close()
    print("\nTUDO CERTO" if not falhas else "\n%d FALHA(S)" % len(falhas))
    sys.exit(1 if falhas else 0)

asyncio.run(main())
