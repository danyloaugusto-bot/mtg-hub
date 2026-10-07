import subprocess, time, json
from playwright.sync_api import sync_playwright
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
errs=[]; log=[]; reqs=[]
def ok(n,c,e=""): log.append(("OK    " if c else "FALHA ")+n+(" | "+str(e) if e!="" else ""))
srv=subprocess.Popen(["python3","-m","http.server","8771","--bind","127.0.0.1"],cwd=__import__("os").path.join(__import__("os").path.dirname(__import__("os").path.dirname(__import__("os").path.abspath(__file__))),"dist"),stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':1360,'height':900}); ctx.add_init_script(STUB); pg=ctx.new_page()
    pg.on("pageerror", lambda e: errs.append("PAGEERROR "+str(e)))
    pg.on("request", lambda r: reqs.append(r.url) if "scryfall" in r.url else None)
    U="http://127.0.0.1:8771/ritos-de-sangue.html"
    pg.goto(U); pg.wait_for_timeout(1200)
    ok("publicada: nota de armazenamento na conta", "na sua conta" in pg.inner_text('#storeNote'), pg.inner_text('#storeNote')[:60])
    ok("publicada: caminho privado por pessoa", pg.evaluate("window.__path")=="data/users/u_teste", pg.evaluate("window.__path"))
    ok("publicada: nenhuma gravação ao abrir", pg.evaluate("window.__sets||0")==0)
    for t in ("gal","tab","radar","tier","ctrl","geral"):
        pg.click(f'[data-tab="{t}"]'); pg.wait_for_timeout(200)
    ok("publicada: nenhuma imagem externa nem chamada ao Scryfall", pg.locator('img.ci').count()==0 and not reqs, (pg.locator('img.ci').count(), reqs[:2]))
    ok("publicada: botão de imagens escondido", pg.locator('#imgBtn').is_hidden())
    pg.click('[data-tab="gal"]'); ok("publicada: aviso sobre imagens", "página publicada" in pg.inner_text('#v-gal [data-imgnote]'))
    ok("publicada: retrato do comandante embutido segue", pg.evaluate("getComputedStyle(document.querySelector('.ava')).backgroundImage.includes('data:image/jpeg')"))
    pg.screenshot(path="test/p-gal.png")
    pg.click('[data-tab="tier"]'); pg.click('#v-tier .chip[data-card="sol-ring"]'); pg.click('[data-act="set-tier"][data-v="C"]'); pg.click('[data-act="set-tier"][data-v="B"]')
    pg.fill('[data-act="nota"]','teste remoto'); pg.keyboard.press('Tab'); pg.wait_for_timeout(1300)
    doc=json.loads(pg.evaluate("localStorage.getItem('__remoto__')") or "null")
    ok("edições viram uma gravação na conta", doc is not None and json.loads(doc["json"])["ov"]["sol-ring"]["tier"]=="B" and pg.evaluate("window.__sets")<=2, pg.evaluate("window.__sets"))
    # outro aparelho: sem o estado local, só o da conta
    pg.evaluate("localStorage.removeItem('ritos-de-sangue-v1')"); pg.reload(); pg.wait_for_timeout(1200); pg.click('[data-tab="tier"]'); pg.wait_for_timeout(200)
    ok("outro aparelho recupera da conta", pg.locator('#v-tier .tier[data-t="B"] .chip[data-card="sol-ring"]').count()==1)
    pg.click('#v-tier .chip[data-card="sol-ring"]'); ok("anotação veio junto", pg.input_value('[data-act="nota"]')=="teste remoto"); pg.keyboard.press('Escape')
    # conta sem permissão de escrita: cai para o navegador, sem erro
    pg.evaluate("window.__negar=true"); pg.click('#v-tier .chip[data-card="sol-ring"]'); pg.click('[data-act="set-tier"][data-v="A"]'); pg.wait_for_timeout(1300)
    ok("gravação recusada: segue no navegador, sem exceção", "neste navegador" in pg.inner_text('#storeNote') and not errs, pg.inner_text('#storeNote')[:50])
    ok("troca e contagem seguem funcionando", pg.inner_text('#deckCount')=="100 cartas")
    ctx.close()
    # sem window.claude.use (prévia do chat): nada de armazenamento
    pg=b.new_page(); pg.add_init_script("window.claude={complete:async()=>''}"); pg.goto(U); pg.wait_for_timeout(900)
    ok("prévia do chat: memória apenas", "enquanto a página estiver aberta" in pg.inner_text('#storeNote') and pg.evaluate("localStorage.getItem('ritos-de-sangue-v1')") is None)
    b.close()
finally:
  srv.terminate()
print("\n".join(log)); print("erros:", errs)
