# -*- coding: utf-8 -*-
"""Compara o painel montado pelo motor com o painel de origem do kit, número a número e carta a carta.

    python testes/origem.py
    python testes/origem.py --deck "02. Clavileño" --origem contexto/origem/ritos-de-sangue-kit/dist/ritos-de-sangue.html

Lê o kit sem gravar nada nele. Sai com erro se algum número ou campo de carta divergir.
"""
import json, os, re
from playwright.sync_api import sync_playwright
import comum

a = comum.argumentos("Comparação com o painel de origem", lambda ap: ap.add_argument(
    "--origem", default=os.path.join(comum.RAIZ, "contexto", "origem", "ritos-de-sangue-kit", "dist", "ritos-de-sangue.html")))
R = comum.Relatorio("origem: " + a.deck)
novo = comum.html(a.deck, montar=not a.sem_montar)

LER = """() => {
  const q = (s) => Array.from(document.querySelectorAll(s));
  const t = (s) => (document.querySelector(s) || {}).textContent || '';
  return {
    placar: t('#v-geral .score-big b'),
    conta: q('#v-geral .kv tr').map(r => r.textContent.replace(/\\s+/g, ' ').trim()),
    agrupamentos: q('#v-geral .gr').map(g => [g.querySelector('.gr-n').textContent.trim(), g.querySelector('.gr-v').textContent.replace(/\\s+/g, ' ').trim(), g.querySelector('.gr-p').textContent.trim()]),
    tiers: q('#v-geral .score-big ~ .legend > span').map(s => s.textContent.trim()),
    relevancia: q('#v-geral .rel-t tbody tr:not(.tot-r)').map(r => r.querySelector('th').textContent.replace(/\\s+/g, ' ').trim() + ' ' + r.querySelector('td').textContent),
    fatos: q('#v-geral .facts div').map(d => d.querySelector('dt').textContent + ' ' + d.querySelector('dd').textContent),
    curva: q('#v-geral .curve text.n').map(x => x.textContent),
    leituras: q('#v-geral .read li').map(l => l.textContent.replace(/\\s+/g, ' ').trim()),
    tipos: q('#v-geral .bars .bar').slice(0, 12).map(b => b.textContent.replace(/\\s+/g, ' ').trim()),
    combos: q('#v-geral .combo h3').map(h => h.textContent),
  };
}"""

with sync_playwright() as p:
    b = p.chromium.launch()
    lido = {}
    for nome, arq in (("origem", a.origem), ("novo", novo)):
        pg = b.new_page(viewport={"width": 1360, "height": 1200})
        comum.bloquear_rede(pg)
        pg.on("pageerror", lambda e: R.erros.append("PAGEERROR " + str(e)))
        pg.goto(comum.url(arq)); pg.wait_for_timeout(1000)
        lido[nome] = pg.evaluate(LER)
        pg.close()
    b.close()

o, n = lido["origem"], lido["novo"]
R.nota("%-22s %-48s %s" % ("medida", "origem", "motor"))
for k in ("placar", "conta", "agrupamentos", "tiers", "relevancia", "fatos", "curva", "leituras", "combos"):
    ov, nv = o[k], n[k]
    if isinstance(ov, list):
        for i in range(max(len(ov), len(nv))):
            x = ov[i] if i < len(ov) else "—"
            y = nv[i] if i < len(nv) else "—"
            R.nota("%-22s %-48s %s%s" % (k if i == 0 else "", str(x)[:48], str(y)[:60] if x != y else "igual", "" if x == y else "   <- difere"))
    else:
        R.nota("%-22s %-48s %s" % (k, ov, "igual" if ov == nv else nv))
    R.ok(k + " iguais ao painel de origem", ov == nv)

# os tipos: o painel novo junta "Cores" e "Base de mana" num só; os tipos de carta seguem iguais
tip_o = [x for x in o["tipos"] if not x.startswith(("Geram", "Só incolor"))]
tip_n = [x for x in n["tipos"] if not x.startswith(("Geram", "Só incolor"))]
R.ok("tipos de carta e edições", tip_o[:len(tip_n)] == tip_n[:len(tip_o)], tip_n[:3])

# carta a carta, contra o D embutido no painel de origem
with open(a.origem, encoding="utf-8") as f:
    O = json.loads(re.search(r"var D = (\{.*?\});\n", f.read(), re.S).group(1))
with open(novo, encoding="utf-8") as f:
    h = f.read()
N = json.loads(re.search(r"var D = (\{.*?\});\nvar M = ", h, re.S).group(1))
IGNORA = {"sid", "iset", "inum", "iback", "ar", "usd", "usdf", "mk", "vamp", "outlet", "drain"}
dif = []
for chave in ("cards", "cands"):
    ob = {c["id"]: c for c in O[chave]}
    for c in N[chave]:
        x = ob.pop(c["id"], None)
        if not x:
            dif.append("%s: %s só no motor" % (chave, c["n"])); continue
        for k in sorted((set(x) | set(c)) - IGNORA):
            if x.get(k) != c.get(k):
                dif.append("%s: %s: %s antes %r, agora %r" % (chave, c["n"], k, x.get(k), c.get(k)))
        mk = c.get("mk") or {}
        if bool(x.get("vamp")) != bool(mk.get("tribo")) or x.get("outlet") != mk.get("saida") or bool(x.get("drain")) != bool(mk.get("dreno")):
            dif.append("%s: %s: marcadores divergem" % (chave, c["n"]))
    dif += ["%s: %s só na origem" % (chave, v["n"]) for v in ob.values()]
for d in dif[:30]:
    R.nota(d)
R.ok("cartas do deck e do radar iguais, campo a campo (%d e %d)" % (len(N["cards"]), len(N["cands"])), not dif, len(dif))
R.ok("combos iguais", [(c["n"], c["p"], c["t"]) for c in O["combos"]] == [(c["n"], c["p"], c["t"]) for c in N["combos"]])
R.fim()
