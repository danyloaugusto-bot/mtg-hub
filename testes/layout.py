# -*- coding: utf-8 -*-
"""Monta variantes de um deck numa pasta temporária e confere o layout no celular e na tela larga.

    python testes/layout.py --deck "02. Clavileño" [--fotos pasta]

Variantes: 6 e 10 agrupamentos, moldura larga com gráfico padrão, e um deck sem tema nem capa.
Confere: nenhuma rolagem lateral, todas as abas sem erro, um elemento por agrupamento no gráfico, no tabelão e na gaveta.
Nada é gravado em dados/ nem em saidas/.
"""
import json, os, shutil, tempfile
from playwright.sync_api import sync_playwright
import comum
import build, dados

def _args(ap):
    ap.add_argument("--fotos", help="pasta para salvar capturas")
    ap.add_argument("--grimorio", action="store_true", help="em vez de um deck, a página do Grimório (saidas/00. Grimório.html)")
    ap.add_argument("--consulta", action="store_true", help="em vez de um deck, a página da Consulta (saidas/00. Consulta.html)")


a = comum.argumentos("Layout com 6 a 10 agrupamentos e as duas molduras", _args)

# o menor texto visível na tela, fora os símbolos de mana (que são desenho, não texto)
LETRA_MIN_PAGINA = """() => { var m = null; document.querySelectorAll('body *').forEach(function (e) { if (e.closest('.g-ms, .ms, script, style, [hidden]') || !e.offsetParent) return;
  var tem = Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }); if (!tem) return;
  var f = parseFloat(getComputedStyle(e).fontSize); if (m === null || f < m) m = f; }); return m; }"""
COLUNAS = """() => { var g = document.querySelector('.g-gal'); if (!g) return null; var xs = {}; Array.prototype.forEach.call(g.children, function (c) { xs[Math.round(c.getBoundingClientRect().left)] = 1; }); return Object.keys(xs).length; }"""


def layout_grimorio():
    """A página do Grimório em 1360 e 375 px: sem rolagem lateral em nenhuma sub-aba, galeria com 6 e 2 colunas, nenhum
    texto abaixo de 13 px, a gaveta dentro da tela e a pílula do hub."""
    import subprocess, sys
    import grimorio
    R = comum.Relatorio("layout: Grimório")
    arq = os.path.join(comum.RAIZ, "saidas", grimorio.NOME + ".html")
    if not a.sem_montar or not os.path.exists(arq):
        r = subprocess.run([sys.executable, "-B", os.path.join(comum.MOTOR, "build.py"), "--grimorio"], capture_output=True, text=True, encoding="utf-8")
        if r.returncode:
            sys.exit("o build do Grimório falhou:\n" + r.stdout + r.stderr)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w, hh, cols in ((1360, 900, 6), (375, 812, 2)):
            pg = b.new_page(viewport={"width": w, "height": hh})
            comum.bloquear_rede(pg)
            err = []
            pg.on("pageerror", lambda e: err.append(str(e)))
            pg.goto(comum.url(arq)); pg.wait_for_function("!!window.GRIMORIO", timeout=30000); pg.wait_for_timeout(400)
            largos, letras = [], []
            for t in ("tribos", "cores", "criterios", "8x8", "pontas", "novidades"):
                pg.click('#g-nav a[data-aba="%s"]' % t); pg.wait_for_timeout(250)
                sw = pg.evaluate("document.documentElement.scrollWidth")
                if sw > w + 1:
                    largos.append("%s=%d" % (t, sw))
                lm = pg.evaluate(LETRA_MIN_PAGINA)
                if lm is not None:
                    letras.append((round(lm, 1), t))
            pg.evaluate("location.hash = '#tribos=vampiros'"); pg.wait_for_timeout(300)
            vista = pg.locator('#g-ferr .g-seg[aria-label="Vista"] button', has_text="Galeria")
            if vista.count():
                vista.click(); pg.wait_for_timeout(300)
            n = pg.evaluate(COLUNAS)
            R.ok("%d px: galeria com %d colunas" % (w, cols), n == cols, n)
            sw = pg.evaluate("document.documentElement.scrollWidth")
            if sw > w + 1:
                largos.append("galeria=%d" % sw)
            lm = pg.evaluate(LETRA_MIN_PAGINA)
            if lm is not None:
                letras.append((round(lm, 1), "galeria"))
            pg.click("#g-corpo .g-card >> nth=0"); pg.wait_for_timeout(250)
            gw = pg.evaluate("(() => { var g = document.querySelector('#g-gav'), r = g.getBoundingClientRect(); return [g.scrollWidth - g.clientWidth, Math.round(r.right), Math.round(r.width)]; })()")
            R.ok("%d px: gaveta aberta dentro da tela, sem rolagem lateral" % w, pg.is_visible("#g-gav") and gw[0] <= 1 and gw[1] <= w + 1 and gw[2] <= w, gw)
            lm = pg.evaluate(LETRA_MIN_PAGINA)
            if lm is not None:
                letras.append((round(lm, 1), "gaveta"))
            if a.fotos:
                os.makedirs(a.fotos, exist_ok=True)
                pg.screenshot(path=os.path.join(a.fotos, "grimorio-gaveta-%d.png" % w))
            pg.keyboard.press("Escape"); pg.wait_for_timeout(100)
            vista = pg.locator('#g-ferr .g-seg[aria-label="Vista"] button', has_text="Lista")
            if vista.count():
                vista.click(); pg.wait_for_timeout(200)
            R.ok("%d px: nenhuma sub-aba com rolagem lateral" % w, not largos, ", ".join(largos))
            R.ok("%d px: nenhum texto abaixo de 13 px" % w, not letras or min(letras)[0] >= 12.95, min(letras) if letras else None)
            R.ok("%d px: sub-abas na barra fixa, todas visíveis" % w, pg.locator("#g-nav a").count() == 6 and all(pg.locator("#g-nav a").nth(i).is_visible() for i in range(6)))
            R.ok("%d px: sem erro de página" % w, not err, err[:2])
            if a.fotos:
                pg.evaluate("location.hash = '#tribos=vampiros'"); pg.wait_for_timeout(300)
                pg.screenshot(path=os.path.join(a.fotos, "grimorio-tribos-%d.png" % w), full_page=(w == 375))
                pg.evaluate("location.hash = '#8x8'"); pg.wait_for_timeout(300)
                pg.select_option("#g-deck8", "01. Giada"); pg.wait_for_timeout(300)
                pg.screenshot(path=os.path.join(a.fotos, "grimorio-8x8-%d.png" % w), full_page=(w == 375))
            pg.close()
        b.close()
    R.fim()


def layout_consulta():
    """A página da Consulta em 1360 e 375 px: sem rolagem lateral, os cinco blocos dos decks na ordem, cartões em 3 e 1 colunas,
    nenhum texto abaixo de 13 px, a barra do topo numa linha só e a sub-aba das registradas."""
    import subprocess, sys
    import consulta
    R = comum.Relatorio("layout: Consulta")
    arq = os.path.join(comum.RAIZ, "saidas", consulta.NOME + ".html")
    if not a.sem_montar or not os.path.exists(arq):
        r = subprocess.run([sys.executable, "-B", os.path.join(comum.MOTOR, "build.py"), "--consulta"], capture_output=True, text=True, encoding="utf-8")
        if r.returncode:
            sys.exit("o build da Consulta falhou:\n" + r.stdout + r.stderr)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w, hh, cols in ((1360, 900, 3), (375, 812, 1)):
            pg = b.new_page(viewport={"width": w, "height": hh})
            comum.bloquear_rede(pg)
            err = []
            pg.on("pageerror", lambda e: err.append(str(e)))
            pg.goto(comum.url(arq)); pg.wait_for_function("!!window.CONSULTA", timeout=30000); pg.wait_for_timeout(300)
            if not pg.evaluate("CONSULTA.D.registros.length"):
                R.ok("%d px: sem consulta registrada, a página abre vazia e sem erro" % w, not err, err[:2]); pg.close(); continue
            sw = pg.evaluate("document.documentElement.scrollWidth")
            R.ok("%d px: sem rolagem lateral no estudo" % w, sw <= w + 1, sw)
            R.ok("%d px: os cinco blocos dos decks, na ordem" % w, pg.evaluate("[...document.querySelectorAll('[data-bloco]')].map(b => b.dataset.bloco).join(',')") == "entra,avaliar,fora,sem,cores")
            n = pg.evaluate("(() => { var g = [...document.querySelectorAll('.cs-grade')].sort((a, b) => b.children.length - a.children.length)[0]; if (!g) return null; var xs = {}; [...g.children].forEach(c => xs[Math.round(c.getBoundingClientRect().left)] = 1); return Math.min(Object.keys(xs).length, g.children.length); })()")
            maior = pg.evaluate("Math.max(0, ...[...document.querySelectorAll('.cs-grade')].map(g => g.children.length))")
            R.ok("%d px: cartões dos decks em %d coluna(s)" % (w, cols), n is None or n == min(cols, maior), n)
            lm = pg.evaluate(LETRA_MIN_PAGINA)
            R.ok("%d px: nenhum texto abaixo de 13 px" % w, lm is None or lm >= 12.95, lm)
            linhas = pg.evaluate("new Set([...document.querySelectorAll('.top nav a')].filter(x => !x.hidden && x.offsetWidth).map(x => Math.round(x.getBoundingClientRect().top))).size")
            R.ok("%d px: a barra do topo numa linha só, com a Consulta acesa" % w, linhas == 1 and pg.get_attribute("#cs-l-cons", "aria-current") == "page", linhas)
            pg.evaluate("location.hash = '#registradas'"); pg.wait_for_timeout(250)
            sw = pg.evaluate("document.documentElement.scrollWidth")
            R.ok("%d px: registradas, uma por consulta com estudo, sem rolagem lateral" % w,
                 pg.locator(".cs-rc").count() == pg.evaluate("CONSULTA.D.registros.length") and sw <= w + 1, sw)
            if a.fotos:
                os.makedirs(a.fotos, exist_ok=True)
                pg.evaluate("location.hash = '#estudo'"); pg.wait_for_timeout(250)
                pg.screenshot(path=os.path.join(a.fotos, "consulta-%d.png" % w), full_page=True)
            R.ok("%d px: sem erro de página" % w, not err, err[:2])
            pg.close()
        b.close()
    R.fim()


if a.grimorio:
    layout_grimorio()
if a.consulta:
    layout_consulta()
R = comum.Relatorio("layout: " + a.deck)
origem = dados.pasta_deck(a.deck)
tmp = tempfile.mkdtemp(prefix="mtg-layout-")


def variante(nome, mexer_av=None, mexer_tema=None, sem_capa=False):
    base = os.path.join(tmp, nome)
    shutil.copytree(origem, base, ignore=shutil.ignore_patterns("entrada", "Abrir o painel.html"))
    pav, pte = os.path.join(base, "avaliacao.json"), os.path.join(base, "tema.json")
    av = json.load(open(pav, encoding="utf-8"))
    te = json.load(open(pte, encoding="utf-8")) if os.path.exists(pte) else {}
    if mexer_av:
        mexer_av(av)
    if mexer_tema is not None:
        te = mexer_tema(te)
    json.dump(av, open(pav, "w", encoding="utf-8"), ensure_ascii=False)
    if te is None:
        os.remove(pte)
    else:
        json.dump(te, open(pte, "w", encoding="utf-8"), ensure_ascii=False)
    if sem_capa:
        for f in os.listdir(base):
            if f.startswith("capa."):
                os.remove(os.path.join(base, f))
    html, _ = build.montar_html(nome, base_dados=tmp, avisar=lambda *x: None)
    caminho = os.path.join(tmp, nome + ".html")
    with open(caminho, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    return caminho, len(av["agrupamentos"])


def refs(leitura):
    """Chaves de agrupamento que uma leitura cita, para não deixar uma leitura órfã nas variantes."""
    return {leitura[k] for k in ("g", "a", "b") if leitura.get(k)}


def seis(av):
    # tira os dois últimos agrupamentos que nenhuma leitura cita por nome, para não precisar reescrever leituras
    citados = set().union(*(refs(l) for l in av.get("leituras", []))) if av.get("leituras") else set()
    livres = [g["k"] for g in av["agrupamentos"] if g["k"] not in citados]
    fora = set(livres[-2:]) if len(livres) >= 2 else {g["k"] for g in av["agrupamentos"][-2:]}
    av["agrupamentos"] = [g for g in av["agrupamentos"] if g["k"] not in fora]
    av["leituras"] = [l for l in av.get("leituras", []) if not (refs(l) & fora)]
    for bloco in ("cartas", "radar"):
        for c in av[bloco].values():
            c["notas"] = {k: v for k, v in c["notas"].items() if k not in fora}
            if c.get("pacote") in fora:
                del c["pacote"]


def dez(av):
    livres = (k for k in ("xp1", "xp2", "xp3") if k not in {g["k"] for g in av["agrupamentos"]})
    k1, k2 = next(livres), next(livres)
    av["agrupamentos"] += [
        {"k": k1, "nome": "Extra 1", "ab": "Ex1", "desc": "Agrupamento de teste, só para conferir o layout com dez."},
        {"k": k2, "nome": "Extra 2", "ab": "Ex2", "desc": "Agrupamento de teste, só para conferir o layout com dez."},
    ]
    for i, c in enumerate(av["cartas"].values()):
        if i % 7 == 0:
            c["notas"][k1] = 1
        if i % 5 == 0:
            c["notas"][k2] = 2


def larga(te):
    te = dict(te)
    te["capa"] = dict(te.get("capa", {}), moldura="larga")
    te.update(grafico="padrao")
    return te


ABAS = """() => {
  const t = document.querySelector('.tabs'), r = t.getBoundingClientRect(), a = document.querySelector('.top-act').getBoundingClientRect();
  const cortadas = Array.from(t.querySelectorAll('[role=tab]')).filter(b => b.offsetParent).filter(b => { const x = b.getBoundingClientRect();
    return x.left < r.left - 1 || x.right > r.right + 1 || (x.right > a.left + 1 && x.top < a.bottom - 1 && x.bottom > a.top + 1); }).map(b => b.textContent);
  return {cortadas: cortadas, scroll: t.scrollWidth - t.clientWidth, abas_topo: Math.round(r.top), botoes_base: Math.round(a.bottom)};
}"""
ROTULOS_FORA = """() => Array.from(document.querySelectorAll('figure.rosa svg text')).filter(t => t.textContent.trim()).map(t => { const r = t.getBoundingClientRect(); return [t.textContent.trim().slice(0, 24), Math.round(r.left), Math.round(r.right)]; }).filter(x => x[1] < -1 || x[2] > innerWidth + 1)"""
# guia visual (rebranding): o menor texto do gráfico como aparece na tela (tamanho da fonte vezes a escala do SVG)
LETRA_MIN = """() => { const ts = Array.from(document.querySelectorAll('figure.rosa svg text, figure.rosa svg tspan')).filter(t => t.textContent.trim() && t.getBoundingClientRect().width); return ts.length ? Math.min(...ts.map(t => { const m = t.getScreenCTM(); return parseFloat(getComputedStyle(t).fontSize) * (m ? Math.hypot(m.a, m.b) : 1); })) : null; }"""
# guia visual: no desktop, o gráfico fica na coluna ao lado do texto do herói, nunca em outra linha
AO_LADO = """() => { const f = document.querySelector('.hero figure.rosa'), t = document.querySelector('.hero-txt'); if (!f || !t) return null; const a = f.getBoundingClientRect(), b = t.getBoundingClientRect(); return a.top < b.bottom && a.left >= b.right - 5; }"""
MS_MIN = """() => { const ms = Array.from(document.querySelectorAll('main .view:not([hidden]) .ms')).filter(e => e.offsetParent); return ms.length ? Math.min(...ms.map(e => e.getBoundingClientRect().width)) : null; }"""

VARIANTES = [
    ("v6", seis, None, False),
    ("v10", dez, None, False),
    ("larga", None, larga, False),
    ("cru", None, lambda te: None, True),
]

try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for nome, mav, mte, sc in VARIANTES:
            try:
                arq, ng = variante(nome, mav, mte, sc)
            except (dados.ErroDeck, ValueError) as e:
                R.ok(nome + ": montagem", False, e); continue
            for w, h in ((375, 812), (1280, 900), (1360, 900)):
                pg = b.new_page(viewport={"width": w, "height": h})
                comum.bloquear_rede(pg)
                err = []
                pg.on("pageerror", lambda e: err.append(str(e)))
                pg.goto(comum.url(arq)); pg.wait_for_timeout(700)
                largos = []
                v3 = pg.evaluate("!!(window.PAINEL.D.meta.v3 && window.PAINEL.D.criterios)")
                nc = len(pg.evaluate("window.PAINEL.D.criterios || []"))
                ms_min = []
                for t in ("geral", "gal", "tier", "pk") + (("crit",) if v3 else ()) + ("tab", "ctrl", "radar", "ofi"):
                    pg.click('[data-tab="%s"]' % t); pg.wait_for_timeout(120)
                    sw = pg.evaluate("document.documentElement.scrollWidth")
                    if sw > w + 1:
                        largos.append("%s=%d" % (t, sw))
                    if t in ("gal", "tier", "radar"):
                        x = pg.evaluate(MS_MIN)
                        if x is not None:
                            ms_min.append((x, t))
                pg.click('[data-tab="geral"]'); pg.wait_for_timeout(200)
                # auditoria de layout (15/10/2026): abas inteiras, rótulos do gráfico na tela, símbolo de mana legível
                ab = pg.evaluate(ABAS)
                if w > 640:
                    R.ok("%s, %d px: nenhuma aba cortada ou coberta" % (nome, w), not ab["cortadas"] and ab["scroll"] <= 1, ab)
                else:
                    R.ok("%s, %d px: abas numa linha própria, sem nada por cima" % (nome, w), ab["abas_topo"] >= ab["botoes_base"] - 1, ab)
                    fora = pg.evaluate(ROTULOS_FORA)
                    R.ok("%s, %d px: rótulos do gráfico dentro da tela" % (nome, w), not fora, fora[:3])
                lm = pg.evaluate(LETRA_MIN)
                R.ok("%s, %d px: texto do gráfico com 13px ou mais" % (nome, w), lm is None or lm >= 12.95, round(lm, 1) if lm else lm)
                if w == 1360 and nome != "larga":
                    R.ok("%s, %d px: gráfico ao lado do texto do herói" % (nome, w), pg.evaluate(AO_LADO) is not False)
                R.ok("%s, %d px: símbolo de mana com 12px ou mais" % (nome, w), not ms_min or min(ms_min)[0] >= 11.95, min(ms_min) if ms_min else None)
                fatias = pg.locator(".rosa .petal, .rosa .wedge, .rosa .lapide").count()
                pg.click('[data-tab="tab"]'); pg.wait_for_timeout(120)
                cols = pg.locator("#v-tab thead th.gh").count()
                pg.click("#v-tab tr.row >> nth=0"); pg.wait_for_timeout(150)
                passos = pg.locator(".drawer .step").count()
                dw = pg.evaluate("(() => { const d = document.querySelector('#drawer'); return d.scrollWidth - d.clientWidth; })()")
                pg.keyboard.press("Escape")
                R.ok("%s, %d px: %d agrupamentos sem rolagem lateral" % (nome, w, ng), not largos and dw <= 1, ", ".join(largos) or ("gaveta +%d" % dw if dw > 1 else ""))
                if v3:   # deck v3: o gráfico mostra os critérios; a gaveta tem os critérios e os agrupamentos
                    R.ok("%s, %d px: gráfico com %d critérios, tabelão com %d e gaveta com os dois" % (nome, w, nc, ng), fatias == nc and cols == ng and passos == ng + nc, (fatias, cols, passos))
                else:
                    R.ok("%s, %d px: gráfico, tabelão e gaveta com %d" % (nome, w, ng), fatias == cols == passos == ng, (fatias, cols, passos))
                R.ok("%s, %d px: sem erro de página" % (nome, w), not err, err[:2])
                if a.fotos:
                    os.makedirs(a.fotos, exist_ok=True)
                    pg.click('[data-tab="geral"]'); pg.wait_for_timeout(1500)
                    pg.screenshot(path=os.path.join(a.fotos, "%s-%d.png" % (nome, w)))
                pg.close()
        b.close()
finally:
    shutil.rmtree(tmp, ignore_errors=True)
R.fim()
