# -*- coding: utf-8 -*-
"""Confere o hub aberto pelo atalho da raiz, sem internet.

    python testes/hub.py

O Dashboard faz as contas no navegador. Aqui elas são conferidas por fora: o placar contra o motor (hub.placar) e os
números de controle, o placar com as trocas recomendadas contra uma conta independente em Python, e os alertas contra
a leitura que o próprio painel de cada deck mostra.
"""
import csv, os, subprocess, sys
from playwright.sync_api import sync_playwright
import comum
import dados, hub as motor_hub

a = comum.argumentos("Hub dos decks")
R = comum.Relatorio("hub")
if not a.sem_montar:
    r = subprocess.run([sys.executable, "-B", os.path.join(comum.MOTOR, "build.py"), "--hub"], capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        sys.exit("o build do hub falhou:\n" + r.stdout + r.stderr)
atalho = os.path.join(comum.RAIZ, "Abrir o Hub.html")
with open(os.path.join(comum.RAIZ, "contexto", "inventario.csv"), encoding="utf-8") as f:
    inv = [x["pasta"] for x in csv.DictReader(f)]


def com_trocas(pasta):
    """Placar com todas as trocas de veredito 'entra', contado em Python, sem passar pelo JavaScript do hub."""
    m = dados.montar(pasta, avisar=lambda *x: None)
    entra = [c for c in m["cands"] if c["verdict"] == "entra"]
    sai = {c["sai"] for c in entra if c.get("sai")}
    cartas = [c for c in m["cards"] if c["id"] not in sai] + [dict(c, q=c.get("q", 1)) for c in entra]
    return motor_hub.placar(cartas, m["grupos"])[0]


SECOES = ["resumo", "mesa", "fundamentos", "trocas", "placar", "mana", "valor", "auditoria", "compartilhadas", "carteira"]

with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h in ((1360, 1000), (375, 812)):
        pg = b.new_page(viewport={"width": w, "height": h})
        reqs = []
        pg.on("pageerror", lambda e: R.erros.append("PAGEERROR " + str(e)))
        pg.route("**/*", lambda r: (reqs.append(r.request.url), r.abort()) if r.request.url.startswith("http") else r.continue_())
        pg.goto(comum.url(atalho)); pg.wait_for_timeout(1000)
        if w > 1000:
            H = pg.evaluate("window.HUB")
            R.ok("atalho da raiz abre o hub", pg.url.endswith("00.%20Hub.html"), pg.url[-30:])
            R.ok("abas Decks, Pastas e Dashboard", pg.eval_on_selector_all("[role=tab][data-vista]", "e=>e.map(x=>x.textContent)") == ["Decks", "Pastas", "Dashboard"])
            R.ok("grupos na ordem do aplicativo", pg.eval_on_selector_all(".grupo h2", "e=>e.map(x=>x.textContent.trim())") ==
                 ["01. Top", "02. Tribais", "03. Caos", "04. Forfun", "Compras + Precon"])
            pastas = [d["pasta"] for d in H["decks"]]
            R.ok("todos os decks do inventário e de dados/", set(inv) <= set(pastas), sorted(set(inv) - set(pastas)))
            R.ok("um cartão por deck, sem repetição", pg.locator(".deck").count() == len(H["decks"]) == len(set(pastas)), pg.locator(".deck").count())
            R.ok("nome do deck é o nome da pasta", all(d["nome"] == d["pasta"].split(". ", 1)[1] for d in H["decks"]))
            prontos = [d for d in H["decks"] if d["painel"]]
            R.ok("decks sem painel em construção", pg.locator(".deck.vazio").count() == len(H["decks"]) - len(prontos))
            R.ok("só os pontos no cartão, sem selo de situação", pg.locator(".deck .pts").count() == len(prontos) and pg.locator(".selo,.nums").count() == 0)
            R.ok("cartões dos painéis apontam para arquivos que existem",
                 all(os.path.exists(os.path.join(comum.RAIZ, "saidas", d["pasta"] + ".html")) for d in prontos))
            for d in prontos:
                R.ok("%s: placar igual ao do controle" % d["pasta"], d["placar"] == comum.controle(d["pasta"]).get("placar", d["placar"]), d["placar"])
            R.ok("rodapé com o limite do hub", "foto do último build" in pg.inner_text("#foot"))
            pg.fill("#q", "giada"); pg.wait_for_timeout(100)
            R.ok("busca filtra os cartões", pg.locator(".deck:not([hidden])").count() == 1)
            pg.fill("#q", "")
            pg.click("#t-pastas"); R.ok("aba Pastas com as oito pastas", pg.is_visible("#v-pastas") and pg.locator(".pasta").count() == 8)

            # ---------------- Dashboard
            pg.click("#t-dash"); pg.wait_for_timeout(200)
            R.ok("aba Dashboard", pg.is_visible("#v-dash"))
            R.ok("Dashboard com as dez seções e o índice", all(pg.locator("#d-" + s).count() == 1 for s in SECOES) and
                 pg.locator(".dnav a").count() == len(SECOES), [s for s in SECOES if not pg.locator("#d-" + s).count()])
            dash = {x["pasta"]: x for x in pg.evaluate("window.HUB_DASH.decks")}
            R.ok("Dashboard cobre todos os decks com painel", sorted(dash) == sorted(d["pasta"] for d in prontos), sorted(dash))
            for d in prontos:
                x = dash.get(d["pasta"], {})
                R.ok("%s: placar do Dashboard igual ao do motor" % d["pasta"], x.get("placar") == d["placar"], (x.get("placar"), d["placar"]))
                esperado = com_trocas(d["pasta"])
                R.ok("%s: placar com as trocas igual à conta em Python" % d["pasta"], x.get("placar_trocas") == esperado, (x.get("placar_trocas"), esperado))
                ctl = comum.controle(d["pasta"]).get("placar_trocas")
                if ctl is not None:
                    R.ok("%s: placar com as trocas igual ao controle" % d["pasta"], x.get("placar_trocas") == ctl, (x.get("placar_trocas"), ctl))
            R.ok("KPIs do resumo", pg.locator("#d-resumo .kpi").count() >= 5, pg.locator("#d-resumo .kpi").count())
            R.ok("lista do que pede atenção", pg.locator("#d-resumo .att > li:not(.mais)").count() >= 1)
            # mesa: com um oponente de combo, o ranking aparece com todos os decks e explica o porquê
            pg.click('#d-mesa [data-act="mesa"][data-k="combo"][data-v="1"]'); pg.wait_for_timeout(150)
            ordem = pg.eval_on_selector_all("#mesa .rank li b a", "e=>e.map(x=>x.textContent)")
            R.ok("mesa: ranking com todos os decks", len(ordem) == len(prontos), ordem)
            nota = lambda d: {"forte": 1, "equilibrado": 0, "fraco": -1}.get(
                next((c["r"] for c in d["a"]["contra"] if c["k"] == "combo"), "equilibrado"), 0)
            topo = max(nota(d) for d in prontos)
            melhores = sorted(d["nome"] for d in prontos if nota(d) == topo)
            # no empate, o hub desempata pelo nome; o primeiro tem de ser um dos que vão melhor
            R.ok("mesa: o primeiro é quem vai melhor contra combo", ordem[:1] == melhores[:1], (ordem[:1], melhores))
            pg.click('#d-mesa [data-act="mesa-limpar"]'); pg.wait_for_timeout(100)
            R.ok("mesa: limpar volta ao estado vazio", pg.locator("#mesa .rank").count() == 0)
            # simulador: cenários do deck de hoje e das recomendadas
            alvo = prontos[-1]
            pg.click('#sim [data-act="sim-deck"][data-k="%s"]' % alvo["pasta"]); pg.wait_for_timeout(100)
            pl_rec = pg.inner_text("#sim .sk >> nth=0")
            pg.click('#sim [data-act="sim-cen"][data-k="hoje"]'); pg.wait_for_timeout(100)
            pl_hoje = pg.inner_text("#sim .sk >> nth=0")
            R.ok("simulador: deck de hoje mostra o placar do motor", str(alvo["placar"]) in pl_hoje, pl_hoje.replace("\n", " "))
            R.ok("simulador: recomendadas mostram o placar com as trocas", str(dash[alvo["pasta"]]["placar_trocas"]) in pl_rec, pl_rec.replace("\n", " "))
            marcadas = pg.locator("#sim input[data-sim]:checked").count()
            pg.locator("#sim input[data-sim]").first.check(); pg.wait_for_timeout(100)
            R.ok("simulador: marcar uma carta recalcula", pg.locator("#sim input[data-sim]:checked").count() == marcadas + 1)
            # álbum: 32 figurinhas, coladas conforme as cores dos decks
            combos = {d["cores"] if d["cores"] else ("-" if d["painel"] else "") for d in H["decks"]} - {""}
            R.ok("álbum com 32 figurinhas", pg.locator(".fig").count() == 32, pg.locator(".fig").count())
            R.ok("figurinhas coladas batem com as cores dos decks", pg.locator(".fig.tem").count() == len(combos), (pg.locator(".fig.tem").count(), len(combos)))
            R.ok("fonte das combinações citada", pg.locator('#d-carteira a[href*="draftsim.com"]').count() == 1)
            R.ok("álbum em lista: 32 linhas, as mesmas coladas", pg.locator(".alb-lista tbody tr").count() == 32 and
                 pg.locator(".alb-lista tbody tr.tem").count() == len(combos), (pg.locator(".alb-lista tbody tr").count(), pg.locator(".alb-lista tbody tr.tem").count()))
            # a cara da carteira: as cores mais jogadas, contadas aqui por fora
            cnt = {ch: sum(1 for d in H["decks"] if ch in (d["cores"] or "")) for ch in "WUBRG"}
            ordem_c = sorted("WUBRG", key=lambda ch: (-cnt[ch], "WUBRG".index(ch)))
            top = ordem_c[:3] if cnt[ordem_c[2]] >= cnt[ordem_c[1]] / 2 else ordem_c[:2]
            nomes_c = {"W": "branco", "U": "azul", "B": "preto", "R": "vermelho", "G": "verde"}
            esperado_c = ", ".join("%s (%d)" % (nomes_c[ch], cnt[ch]) for ch in top[:-1]) + " e %s (%d)" % (nomes_c[top[-1]], cnt[top[-1]])
            R.ok("a cara da carteira sai das cores mais jogadas", esperado_c in pg.inner_text(".cara"), esperado_c)
            # os alertas do Dashboard batem com a leitura de cada painel
            for d in prontos:
                caminho = os.path.join(comum.RAIZ, "saidas", d["pasta"] + ".html")
                pp = b.new_page(viewport={"width": 1360, "height": 1000})
                comum.bloquear_rede(pp)
                pp.goto(comum.url(caminho)); pp.wait_for_timeout(700)
                warn = pp.locator(".read li.warn").count()
                total = pp.evaluate("document.querySelector('.score-big b') ? +document.querySelector('.score-big b').textContent : null")
                pp.close()
                R.ok("%s: alertas do Dashboard iguais aos do painel" % d["pasta"], dash[d["pasta"]]["alertas"] == warn, (dash[d["pasta"]]["alertas"], warn))
                R.ok("%s: placar do painel igual ao do Dashboard" % d["pasta"], total == dash[d["pasta"]]["placar"], (total, dash[d["pasta"]]["placar"]))
            pg.click("#t-decks")
            if prontos:
                pg.click(".deck:not(.vazio) .ir >> nth=0"); pg.wait_for_timeout(1200)
                R.ok("o cartão abre o painel, sem internet", pg.evaluate("!!(window.PAINEL && window.PAINEL.D)"), pg.url[-30:])
                R.ok("o painel tem o botão de voltar ao hub", pg.get_attribute("#voltar", "href") == "00.%20Hub.html" and pg.is_visible("#voltar"))
                pg.click("#voltar"); pg.wait_for_timeout(800)
                R.ok("voltar leva ao hub", pg.url.endswith("00.%20Hub.html"))
        for v in ("decks", "pastas", "dash"):
            pg.evaluate("v => document.querySelector('[data-vista=\"' + v + '\"]').click()", v); pg.wait_for_timeout(100)
            R.ok("%d px, %s: sem rolagem lateral" % (w, v), pg.evaluate("document.documentElement.scrollWidth") <= w)
        R.ok("%d px: nenhuma chamada de rede" % w, not reqs, reqs[:2])
        pg.close()
    b.close()
R.fim()
