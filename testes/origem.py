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
# os dois D, o do painel de origem e o do motor (a regra do tier S, abaixo, usa os dois)
with open(a.origem, encoding="utf-8") as f:
    O = json.loads(re.search(r"var D = (\{.*?\});\n", f.read(), re.S).group(1))
with open(novo, encoding="utf-8") as f:
    h = f.read()
N = json.loads(re.search(r"var D = (\{.*?\});\nvar M = ", h, re.S).group(1))
# regra do dono (15/10/2026): em deck tribal, tier S só para carta da tribo. A carta de fora da tribo que era S na origem
# e agora é A é diferença esperada, na contagem de tiers e carta a carta. Qualquer outra diferença de tier continua falhando.
_orig = {c["id"]: c for c in O["cards"] + O["cands"]}
REGRA_S = {c["id"] for c in N["cards"] + N["cands"]
           if c.get("tier") == "A" and _orig.get(c["id"], {}).get("tier") == "S" and not (c.get("mk") or {}).get("tribo") and not c.get("cmd")}
_nS = sum(c.get("q", 1) for c in N["cards"] if c["id"] in REGRA_S)


def _tiers_regra(leg):
    out = []
    for x in leg:
        m_ = re.match(r"([SABCD])\D*(\d+)", x)
        if not m_:
            out.append(x)
            continue
        q_ = int(m_.group(2)) + (-_nS if m_.group(1) == "S" else _nS if m_.group(1) == "A" else 0)
        out.append(x[:m_.start(2)] + str(q_) + x[m_.end(2):])
    return out


o["tiers"] = _tiers_regra(o["tiers"])
R.nota("regra do tier S: %d carta(s) de fora da tribo passaram de S para A" % _nS)
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
    if k in ("placar", "conta") and N["meta"].get("v3"):
        R.nota("%s: o deck está na pontuação v3, que muda o placar por desenho; não se compara com o de origem" % k)
        continue
    R.ok(k + " iguais ao painel de origem", ov == nv)

# os tipos: o painel novo junta "Cores" e "Base de mana" num só; os tipos de carta seguem iguais
tip_o = [x for x in o["tipos"] if not x.startswith(("Geram", "Só incolor"))]
tip_n = [x for x in n["tipos"] if not x.startswith(("Geram", "Só incolor"))]
R.ok("tipos de carta e edições", tip_o[:len(tip_n)] == tip_n[:len(tip_o)], tip_n[:3])

# carta a carta, contra o D embutido no painel de origem (O e N, lidos acima)
# nome impresso: o motor mostra o nome da carta física e guarda o do Scryfall em "on"; o painel de origem é anterior a isso,
# então a comparação devolve os nomes impressos aos do Scryfall, nos campos e nos textos. Qualquer outra diferença continua falhando.
IMPRESSO = {c["n"]: c["on"] for c in N["cards"] + N["cands"] if c.get("on")}
def scry(v):
    if isinstance(v, str):
        for imp, sf in IMPRESSO.items():
            v = v.replace(imp, sf)
        return v
    if isinstance(v, list):
        return [scry(x) for x in v]
    if isinstance(v, dict):
        return {k: scry(x) for k, x in v.items() if k != "on"}
    return v
for chave in ("cards", "cands", "combos"):
    N[chave] = scry(N[chave])
# textos que o texto oficial desmentia, corrigidos com autorização do dono (15/10/2026): o que a carta faz (fx) ou o porquê (why)
TEXTO_CORRIGIDO = {"High-Society Hunter", "Drivnod, Carnage Dominus", "Path of Ancestry", "Black Market Connections"}
# cartas levadas ao radar depois do kit, com o ok do dono (16/10/2026, dos potenciais da página relida): o kit não as tem
RADAR_NOVO = {"Crossway Troublemakers", "Pact of the Serpent"}
# s3 e s3w: as notas dos dez critérios e o porquê delas, que a pontuação v3 acrescentou (o kit não tem)
IGNORA = {"sid", "iset", "inum", "iback", "ar", "usd", "usdf", "mk", "vamp", "outlet", "drain", "s3", "s3w"}
dif = []
for chave in ("cards", "cands"):
    ob = {c["id"]: c for c in O[chave]}
    for c in N[chave]:
        x = ob.pop(c["id"], None)
        if not x:
            if chave == "cands" and c["n"] in RADAR_NOVO:
                continue
            dif.append("%s: %s só no motor" % (chave, c["n"])); continue
        for k in sorted((set(x) | set(c)) - IGNORA):
            if k == "tier" and c["id"] in REGRA_S:
                continue
            if k in ("fx", "why") and c["n"] in TEXTO_CORRIGIDO:
                continue
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
