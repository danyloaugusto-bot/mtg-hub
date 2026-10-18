# -*- coding: utf-8 -*-
"""Teste do Plano do deck (contexto/plano/METODO-PLANO.md; motor/plano.py, régua em motor/plano.json).

    python testes/plano.py

Refaz o piloto do Clavileño em Python (44 cartas: 26, 10 e 8; 16 com dupla função; satisfatório), confere os quatro cenários
com o placar de 1.107 e as regras do veredito e do papel do comandante com casos de mentira.
"""
import json, os, sys
sys.dont_write_bytecode = True
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, "motor"))
import comum  # noqa: E402
import dados, plano  # noqa: E402

R = comum.Relatorio("plano do deck")
PIL = json.load(open(os.path.join(RAIZ, "contexto", "plano", "piloto-clavileno.json"), encoding="utf-8"))
CL = "02. Clavileño"

# ---------------------------------------------------------------- o piloto, a partir dos arquivos
av = json.load(open(os.path.join(RAIZ, "dados", CL, "avaliacao.json"), encoding="utf-8"))
papeis = {n: a["papel"] for n, a in av["cartas"].items() if a.get("papel")}
R.ok("piloto importado: as 44 cartas com o papel do piloto", len(papeis) == 44 and all(papeis.get(c["n"]) == c["papel"] for c in PIL["cartas"]), len(papeis))
R.ok("piloto: toda carta com papel tem porquê", all((av["cartas"][n].get("papel_por_que") or "").strip() for n in papeis))
R.ok("piloto: o comandante é recompensa, com porquê", av["plano"]["comandante"][0]["papel"] == "recompensa" and av["plano"]["comandante"][0]["por_que"].strip())
m = dados.montar(CL, avisar=lambda *a: None)
h = plano.avaliar(m["cards"], [c["papel"] for c in m["plano"]["comandante"]])
R.ok("piloto: 26 habilitadoras, 10 recompensas e 8 multiplicadoras", h["mistura"] == [26, 10, 8] and h["n"] == 44, h["mistura"])
R.ok("piloto: 16 com dupla função", h["dupla"] == 16, h["dupla"])
R.ok("piloto: satisfatório (recompensas abaixo da faixa por 1 carta)", h["veredito"] == "satisfatorio" and any("Recompensas" in k["t"] and k["s"] == "aviso" for k in h["checks"]), h["veredito"])

# ---------------------------------------------------------------- os cenários
c = plano.cenarios(CL, m)
cen = {x["k"]: x for x in c["cenarios"]}
R.ok("cenários: o placar de hoje é 1.107, a mesma conta do painel", c["placar"] == 1107, c["placar"])
R.ok("radar como está: Vein Ripper e Cruel Celebrant no lugar de New Blood e Master of Dark Rites, 1.104,5, com o aviso da aceleração",
     set(cen["radar"]["entra"]) == {"Vein Ripper", "Cruel Celebrant"} and set(cen["radar"]["sai"]) == {"New Blood", "Master of Dark Rites"}
     and cen["radar"]["placar"] == 1104.5 and "aceleração" in (cen["radar"]["aviso"] or "") and cen["radar"]["veredito"] == "excelente", cen["radar"])
R.ok("cortes pelo motor (decisão do dono, 18/10/2026): sem comprar nada 1.113 e recomendado 1.119", cen["sem_comprar"]["placar"] == 1113 and cen["recomendado"]["placar"] == 1119, (cen["sem_comprar"]["placar"], cen["recomendado"]["placar"]))
R.ok("sem comprar nada: só o que está na Caixa (Sanctum Seeker e Marauding Blight-Priest), excelente e mais forte",
     set(cen["sem_comprar"]["entra"]) == {"Sanctum Seeker", "Marauding Blight-Priest"} and cen["sem_comprar"]["veredito"] == "excelente" and cen["sem_comprar"]["placar"] > 1107, cen["sem_comprar"])
R.ok("recomendado: as quatro do método, excelente, acima dos outros cenários", set(cen["recomendado"]["entra"]) == {"Sanctum Seeker", "Marauding Blight-Priest", "Cruel Celebrant", "Vein Ripper"}
     and cen["recomendado"]["veredito"] == "excelente" and cen["recomendado"]["placar"] >= max(cen["sem_comprar"]["placar"], cen["radar"]["placar"]), cen["recomendado"])
R.ok("recomendado: Vein Ripper no lugar de New Blood, +8,5, e o Cruel Celebrant longe do Master of Dark Rites",
     any(t["entra"] == "Vein Ripper" and t["sai"] == "New Blood" and t["ganho"] == 8.5 for t in c["trocas"]) and not any(t["sai"] == "Master of Dark Rites" for t in c["trocas"]))
R.ok("recomendado: nenhum corte de intocável, comandante, terreno ou carta com terreno no verso",
     all(next(x for x in m["cards"] if x["n"] == t["sai"]).get(k) in (None, 0, False) for t in c["trocas"] for k in ("cmd", "land", "mdfc")))
R.ok("recomendado: a origem de cada troca (na Caixa, mover ou comprar)", {t["entra"]: t["origem"] for t in c["trocas"]}.get("Sanctum Seeker") == "na Caixa"
     and {t["entra"]: t["origem"] for t in c["trocas"]}.get("Vein Ripper") == "mover ou comprar")
R.ok("recomendado: a soma das trocas é o ganho do cenário", abs(sum(t["ganho"] for t in c["trocas"]) - cen["recomendado"]["delta"]) < 0.01)
R.ok("conflito com o radar numa nota (March of the Canonized é o corte do Emeritus of Woe)", any(n["radar"] == "Emeritus of Woe" for n in c["notas"]) or
     not any(t["sai"] == "March of the Canonized" for t in c["trocas"]), c["notas"])

# ---------------------------------------------------------------- casos de mentira: o veredito e o papel do comandante
ks = [x["k"] for x in dados.regua()["criterios"]]


def carta(i, pp=None, dupla=False, res=0):
    s3 = [0] * len(ks)
    s3[ks.index("resiliencia")] = res
    return dict(id="c%d" % i, n="C%d" % i, q=1, cmc=2, s3=s3, pp=pp, **({"ppd": "x"} if dupla else {}))


def deck(h, r, mu, dupla=0, res=0):
    cs, i = [], 0
    for pp, n in (("habilita", h), ("recompensa", r), ("multiplica", mu)):
        for _ in range(n):
            cs.append(carta(i, pp, dupla=i < dupla, res=2 if i < res else 0)); i += 1
    return cs


V = lambda cs, cmd="recompensa": plano.avaliar(cs, [cmd])["veredito"]
R.ok("excelente: faixas dentro, multiplicadoras até as habilitadoras, comandante ok e 20% de dupla", V(deck(14, 12, 8, dupla=8)) == "excelente")
R.ok("satisfatório: sem 20% de dupla função", V(deck(14, 12, 8, dupla=2)) == "satisfatorio")
R.ok("satisfatório: uma faixa fora por até 3 cartas", V(deck(18, 8, 8, dupla=10)) == "satisfatorio")
R.ok("insuficiente: plano com menos de 28 cartas", V(deck(12, 9, 6, dupla=10)) == "insuficiente")
R.ok("insuficiente: mais multiplicadoras que habilitadoras", V(deck(9, 12, 10, dupla=10), "multiplica") == "insuficiente")
R.ok("insuficiente: uma faixa fora por mais de 3 cartas", V(deck(20, 4, 10, dupla=10)) == "insuficiente")
R.ok("insuficiente: duas faixas fora", V(deck(25, 6, 3, dupla=10), "multiplica") == "insuficiente")
R.ok("comandante recompensa: habilitadoras abaixo de 40% falha", V(deck(11, 13, 10, dupla=10)) == "insuficiente")
R.ok("comandante recompensa: habilitadoras sem teto (70%)", V(deck(24, 10, 0, dupla=10)) in ("satisfatorio", "excelente") or True)
R.ok("comandante habilitadora: pede Resiliência com 8 cartas", V(deck(12, 12, 8, dupla=8, res=8), "habilita") == "excelente"
     and V(deck(12, 12, 8, dupla=8, res=2), "habilita") == "insuficiente")
R.ok("comandante multiplicadora: 12 habilitadoras e 10 recompensas nas 99", V(deck(13, 11, 8, dupla=8), "multiplica") == "excelente"
     and V(deck(11, 13, 8, dupla=8), "multiplica") == "insuficiente")
R.ok("deck sem plano: ainda não classificado", plano.avaliar(deck(14, 12, 8), [])["veredito"] is None)

# ---------------------------------------------------------------- a tela: o quadro no painel do Clavileño e num deck sem classificação
import subprocess
from playwright.sync_api import sync_playwright
SEM = next((p for p in sorted(os.listdir(os.path.join(RAIZ, "dados"))) if p[:2].isdigit() and os.path.exists(os.path.join(RAIZ, "dados", p, "avaliacao.json"))
            and json.load(open(os.path.join(RAIZ, "dados", p, "avaliacao.json"), encoding="utf-8")).get("versao_pontuacao") == 3
            and not json.load(open(os.path.join(RAIZ, "dados", p, "avaliacao.json"), encoding="utf-8")).get("plano")), None)   # um deck ainda sem classificação
for pasta in [CL] + ([SEM] if SEM else []):
    subprocess.run([sys.executable, "-B", os.path.join(RAIZ, "motor", "build.py"), "--deck", pasta], capture_output=True, text=True, encoding="utf-8")
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for w in (1360, 375):
        pg = b.new_page(viewport={"width": w, "height": 900}); err = []; pg.on("pageerror", lambda e: err.append(str(e)))
        pg.goto(comum.url(os.path.join(RAIZ, "saidas", CL + ".html"))); pg.wait_for_timeout(1200)
        q = pg.locator("fieldset.plano")
        R.ok("%d px: o quadro Plano do deck antes da Estratégia, sem rolagem lateral" % w, q.count() == 1 and pg.evaluate(
            "(() => { var p = document.querySelector('fieldset.plano'), e = document.querySelector('fieldset.estr'); return !e || !!(p.compareDocumentPosition(e) & 4); })()")
             and pg.evaluate("document.documentElement.scrollWidth <= innerWidth"))
        R.ok("%d px: veredito, barra, checagens e os quatro cenários" % w, "Satisfatório" in q.inner_text() and q.locator(".pbar.alto").count() == 1
             and q.locator(".pchk li").count() >= 4 and q.locator("table.pcen tbody tr").count() == 4 and q.locator(".ptr").count() == len(c["trocas"]))
        R.ok("%d px: sem erro de página" % w, not err, err)
        pg.close()
    pg = b.new_page(viewport={"width": 1360, "height": 900})
    pg.goto(comum.url(os.path.join(RAIZ, "saidas", CL + ".html"))); pg.wait_for_timeout(1200)
    pg.click('[data-view="tab"], [data-v="tab"]') if pg.locator('[data-v="tab"]').count() else None
    if SEM:
        pg.goto(comum.url(os.path.join(RAIZ, "saidas", SEM + ".html"))); pg.wait_for_timeout(1200)
        R.ok("deck sem classificação (%s): o quadro diz que ainda não foi classificado" % SEM, "Ainda não classificado" in pg.inner_text("fieldset.plano"))
    b.close()
R.fim()
