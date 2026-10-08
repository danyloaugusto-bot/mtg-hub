# -*- coding: utf-8 -*-
"""Simula a página publicada (window.claude.use com db e user) e a prévia de chat.

    python testes/publicada.py --deck "02. Clavileno"
"""
import json, os, socket, subprocess, sys, time
from urllib.parse import quote
from playwright.sync_api import sync_playwright
import comum

STUB = """
(() => {
  const K='__remoto__';
  const ref = { get: async () => { const r = localStorage.getItem(K); return r ? { id:'painel', exists:true, data:() => JSON.parse(r) } : { id:'painel', exists:false, data:() => undefined }; },
                set: async (d) => { if (window.__negar) throw { code:'invalid_argument', message:'sem permissão' }; window.__sets=(window.__sets||0)+1; await new Promise(r=>setTimeout(r,60)); localStorage.setItem(K, JSON.stringify(d)); } };
  const db = Object.freeze({ collection: (p) => { window.__path = p; return { doc: (k) => ref }; }, doc: () => ref });
  const user = Object.freeze({ id: async () => 'u_teste', isOwner: async () => true });
  window.claude = { use: (n) => new Promise(r => setTimeout(() => r(n==='db' ? db : n==='user' ? user : null), 120)) };
})();
"""

a = comum.argumentos("Página publicada e prévia de chat")
pasta = a.deck
R = comum.Relatorio("página publicada: " + pasta)
arq = comum.html(pasta, montar=not a.sem_montar)
reqs = []

s = socket.socket(); s.bind(("127.0.0.1", 0)); porta = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(porta), "--bind", "127.0.0.1"], cwd=os.path.dirname(arq),
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
U = "http://127.0.0.1:%d/%s" % (porta, quote(os.path.basename(arq)))
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); ctx = b.new_context(viewport={"width": 1360, "height": 900}); ctx.add_init_script(STUB); pg = ctx.new_page()
        pg.on("pageerror", lambda e: R.erros.append("PAGEERROR " + str(e)))
        pg.on("request", lambda r: reqs.append(r.url) if "scryfall" in r.url else None)
        pg.goto(U); pg.wait_for_timeout(1200)
        D = pg.evaluate("window.PAINEL.D"); KEY = pg.evaluate("window.PAINEL.key")
        pack = bool(D.get("img"))
        carta = next(c for c in D["cards"] if not c.get("cmd") and not c.get("land") and c["tier"] not in ("B", "C"))
        R.ok("nota de armazenamento na conta", "na sua conta" in pg.inner_text("#storeNote"), pg.inner_text("#storeNote")[:60])
        R.ok("caminho privado por pessoa", pg.evaluate("window.__path") == "data/users/u_teste", pg.evaluate("window.__path"))
        R.ok("nenhuma gravação ao abrir", pg.evaluate("window.__sets||0") == 0)
        R.ok("sem botão de voltar ao hub, que não vai junto na publicação", pg.locator("#voltar").is_hidden())
        for t in ("gal", "tab", "radar", "tier", "ctrl", "ofi", "geral"):
            pg.click('[data-tab="%s"]' % t); pg.wait_for_timeout(200)
        if pack:
            R.ok("imagens embutidas aparecem, sem chamada ao Scryfall", pg.locator("img.ci.ci-ok").count() > 0 and not reqs, (pg.locator("img.ci").count(), reqs[:2]))
        else:
            R.ok("nenhuma imagem externa nem chamada ao Scryfall", pg.locator("img.ci").count() == 0 and not reqs, (pg.locator("img.ci").count(), reqs[:2]))
        R.ok("liga e desliga das imagens fora da barra", pg.locator(".top [data-act=img]").count() == 0)
        pg.click('[data-tab="gal"]')
        if pack:
            R.ok("aviso sobre imagens embutidas", "embutidas" in pg.inner_text("#v-gal [data-imgnote]"))
            R.ok("caixa de imagens na galeria, com pacote embutido", pg.locator('#v-gal [data-act="img-tog"]').count() == 1)
        else:
            R.ok("aviso sobre imagens", "página publicada" in pg.inner_text("#v-gal [data-imgnote]"))
            R.ok("sem caixa de imagens na galeria", pg.locator('#v-gal [data-act="img-tog"]').count() == 0)
        if D["meta"]["capa"]["tem"]:
            R.ok("capa do comandante embutida segue", pg.evaluate("getComputedStyle(document.querySelector('.ava')).backgroundImage.includes('data:image/jpeg')"))
        pg.click('[data-tab="tier"]'); pg.wait_for_timeout(150)
        if pack:
            R.ok("tier list em cartas, com o pacote embutido", pg.locator("#v-tier .chip.tile").count() > 0 and pg.locator('[data-act="tier-view"]').count() == 2)
        else:
            R.ok("tier list em fichas, sem imagens", pg.locator("#v-tier .chip.tile").count() == 0 and pg.locator('[data-act="tier-view"]').count() == 0)
        pg.click('#v-tier .chip[data-card="%s"]' % carta["id"]); pg.click('[data-act="set-tier"][data-v="C"]'); pg.click('[data-act="set-tier"][data-v="B"]')
        pg.fill('[data-act="nota"]', "teste remoto"); pg.keyboard.press("Tab"); pg.wait_for_timeout(1300)
        doc = json.loads(pg.evaluate("localStorage.getItem('__remoto__')") or "null")
        R.ok("edições viram uma gravação na conta", doc is not None and json.loads(doc["json"])["ov"][carta["id"]]["tier"] == "B" and pg.evaluate("window.__sets") <= 2, pg.evaluate("window.__sets"))
        # outro aparelho: sem o estado local, só o da conta
        pg.evaluate("k => { localStorage.removeItem(k); }", KEY)
        if D["meta"].get("chave_antiga"):
            pg.evaluate("k => localStorage.removeItem(k)", D["meta"]["chave_antiga"])
        pg.reload(); pg.wait_for_timeout(1200); pg.click('[data-tab="tier"]'); pg.wait_for_timeout(200)
        R.ok("outro aparelho recupera da conta", pg.locator('#v-tier .tier[data-t="B"] .chip[data-card="%s"]' % carta["id"]).count() == 1)
        pg.click('#v-tier .chip[data-card="%s"]' % carta["id"]); R.ok("anotação veio junto", pg.input_value('[data-act="nota"]') == "teste remoto"); pg.keyboard.press("Escape")
        # conta sem permissão de escrita: cai para o navegador, sem erro
        pg.evaluate("window.__negar=true"); pg.click('#v-tier .chip[data-card="%s"]' % carta["id"]); pg.click('[data-act="set-tier"][data-v="A"]'); pg.wait_for_timeout(1300)
        R.ok("gravação recusada: segue no navegador, sem exceção", "neste navegador" in pg.inner_text("#storeNote") and not R.erros, pg.inner_text("#storeNote")[:50])
        R.ok("contagem segue funcionando", pg.inner_text("#deckCount") == "%d cartas" % sum(c["q"] for c in D["cards"]))
        pg.keyboard.press("Escape"); pg.click('[data-tab="ofi"]'); pg.click('[data-act="copy"][data-t="ofc-aud"]'); pg.wait_for_timeout(200)
        R.ok("copiar na Oficina não quebra", not R.erros and pg.inner_text("#toast") != "", pg.inner_text("#toast"))
        ctx.close()
        # sem window.claude.use (prévia do chat): nada de armazenamento
        pg = b.new_page(); pg.add_init_script("window.claude={complete:async()=>''}")
        pg.on("pageerror", lambda e: R.erros.append("PAGEERROR " + str(e)))
        pg.goto(U); pg.wait_for_timeout(900)
        R.ok("prévia do chat: memória apenas", "enquanto a página estiver aberta" in pg.inner_text("#storeNote") and pg.evaluate("k => localStorage.getItem(k)", KEY) is None)
        b.close()
finally:
    srv.terminate()
R.fim()
