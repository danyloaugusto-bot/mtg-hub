# -*- coding: utf-8 -*-
"""Monta variantes de um deck numa pasta temporária e confere o layout no celular e na tela larga.

    python testes/layout.py --deck "02. Clavileño" [--fotos pasta]

Variantes: 6 e 10 agrupamentos, moldura larga com gráfico padrão e curva em barras, e um deck sem tema nem capa.
Confere: nenhuma rolagem lateral, todas as abas sem erro, um elemento por agrupamento no gráfico, no tabelão e na gaveta.
Nada é gravado em dados/ nem em saidas/.
"""
import json, os, shutil, tempfile
from playwright.sync_api import sync_playwright
import comum
import build, dados

a = comum.argumentos("Layout com 6 a 10 agrupamentos e as duas molduras", lambda ap: ap.add_argument("--fotos", help="pasta para salvar capturas"))
R = comum.Relatorio("layout: " + a.deck)
origem = os.path.join(comum.RAIZ, "dados", a.deck)
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
    te.update(grafico="padrao", curva="barra")
    return te


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
            for w, h in ((375, 812), (1280, 900)):
                pg = b.new_page(viewport={"width": w, "height": h})
                comum.bloquear_rede(pg)
                err = []
                pg.on("pageerror", lambda e: err.append(str(e)))
                pg.goto(comum.url(arq)); pg.wait_for_timeout(700)
                largos = []
                for t in ("geral", "gal", "tier", "pk", "tab", "ctrl", "radar", "ofi"):
                    pg.click('[data-tab="%s"]' % t); pg.wait_for_timeout(120)
                    sw = pg.evaluate("document.documentElement.scrollWidth")
                    if sw > w + 1:
                        largos.append("%s=%d" % (t, sw))
                pg.click('[data-tab="geral"]'); pg.wait_for_timeout(200)
                fatias = pg.locator(".rosa .petal, .rosa .wedge").count()
                pg.click('[data-tab="tab"]'); pg.wait_for_timeout(120)
                cols = pg.locator("#v-tab thead th.gh").count()
                pg.click("#v-tab tr.row >> nth=0"); pg.wait_for_timeout(150)
                passos = pg.locator(".drawer .step").count()
                dw = pg.evaluate("(() => { const d = document.querySelector('#drawer'); return d.scrollWidth - d.clientWidth; })()")
                pg.keyboard.press("Escape")
                R.ok("%s, %d px: %d agrupamentos sem rolagem lateral" % (nome, w, ng), not largos and dw <= 1, ", ".join(largos) or ("gaveta +%d" % dw if dw > 1 else ""))
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
