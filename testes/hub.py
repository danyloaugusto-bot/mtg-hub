# -*- coding: utf-8 -*-
"""Confere o hub aberto pelo atalho da raiz, sem internet.

    python testes/hub.py

O Dashboard faz as contas no navegador. Aqui elas são conferidas por fora: o placar contra o motor (hub.placar) e os
números de controle, o placar com as trocas recomendadas contra uma conta independente em Python, e os alertas contra
a leitura que o próprio painel de cada deck mostra.
"""
import csv, os, re, subprocess, sys
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


SECOES = ["resumo", "fichas", "comparar", "movimentacoes", "compartilhadas", "mesa", "trocas", "reserva", "placar", "fundamentos", "mana", "potencial", "auditoria", "carteira"]
ABAS = ["resumo", "fichas", "mov", "mesa", "trocas", "mana", "potencial", "bastidores"]


def aba(pg, t):
    """Abre uma aba interna do Dashboard (uma seção por vez desde o v2)."""
    pg.click('.dnav a[data-dtab="%s"]' % t); pg.wait_for_timeout(150)
    # as caixas abrem no clique; para testar o conteúdo, abre todas desta aba
    pg.evaluate("t => document.querySelectorAll('#v-dash .dtab[data-dtab=\"' + t + '\"] details:not([open])').forEach(d => { d.open = true; })", t); pg.wait_for_timeout(50)


def movimentos_py():
    """Cartas do radar (entra ou avaliar) que já estão no deck de outro painel, contadas em Python: sem básicos e sem
    comandante na origem. Devolve {"cartas": n de nomes, "mova": pares (carta, deck que pede) com tier melhor no radar}."""
    TR = {"S": 0, "A": 1, "B": 2, "C": 3, "D": 4}
    ms = {p: dados.montar(p, avisar=lambda *x: None) for p in [d for d in sorted(os.listdir(dados.DADOS)) if dados.eh_deck(d) and os.path.exists(os.path.join(dados.DADOS, d, "avaliacao.json"))]}
    bas = set(motor_hub.BASICOS)
    no_deck = {}
    for p, m in ms.items():
        for c in m["cards"]:
            k = c.get("on") or c["n"]
            if k in bas or c.get("cmd"):
                continue
            no_deck.setdefault(k, []).append((p, c["tier"]))
    cartas, mova = set(), set()
    for p, m in ms.items():
        for c in m["cands"]:
            if c["verdict"] == "fora":
                continue
            k = c.get("on") or c["n"]
            onde = [x for x in no_deck.get(k, []) if x[0] != p]
            if not onde:
                continue
            cartas.add(k)
            if max(TR[t] for _, t in onde) > TR[c["tier"]]:
                mova.add((k, p))
    return dict(cartas=len(cartas), mova=len(mova))

def reserva_py(m):
    """Funções sem reserva, contadas em Python: até duas cartas dedicadas (nota 2 ou 3) fora o comandante, e o comandante não cumpre a função."""
    out = []
    for j, g in enumerate(m["grupos"]):
        nota = lambda c: (c.get("s") or [0] * (j + 1))[j] if j < len(c.get("s") or []) else 0
        nb = sum(c.get("q", 1) for c in m["cards"] if not c.get("cmd") and nota(c) >= 2)
        cmd = any(c.get("cmd") and nota(c) >= 2 for c in m["cards"])
        if nb <= 2 and not cmd:
            out.append(g["k"])
    return out

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
                 ["01. Top", "02. Tribais", "03. Caos", "04. Forfun", "05. Desejo"])
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
            # aba Decks: grupos fechados até o clique, com as miniaturas das capas no cabeçalho
            R.ok("Decks: grupos fechados ao abrir o hub", pg.locator("#v-decks details.g-sf[open]").count() == 0 and pg.locator("#v-decks details.g-sf").count() == 5)
            R.ok("Decks: miniaturas de todos os decks nos cabeçalhos", pg.locator("#v-decks .minis i").count() == len(H["decks"]))
            pg.click('#v-decks details[data-sf="g-02"] > summary'); pg.wait_for_timeout(150)
            R.ok("Decks: um clique abre só aquele grupo", pg.locator("#v-decks details.g-sf[open]").count() == 1 and pg.is_visible('#v-decks details[data-sf="g-02"] .deck >> nth=0'))
            pg.click('[data-dk="abrir"]'); pg.wait_for_timeout(150)
            R.ok("Decks: abrir todos", pg.locator("#v-decks details.g-sf[open]").count() == 5)
            # aba Decks: estante, lista e por cor, com filtros de cor e situação
            R.ok("Decks: alertas em cada cartão com painel, sem bracket", pg.locator(".deck:not(.vazio) .al").count() == len(prontos) and pg.locator(".brk").count() == 0)
            R.ok("Decks: passos de quem está em construção", pg.locator(".deck.vazio .passos").count() == len(H["decks"]) - len(prontos))
            pg.click('[data-dk="sit"][data-k="obra"]'); pg.wait_for_timeout(150)
            R.ok("Decks: filtro Em construção", pg.locator(".deck").count() == len(H["decks"]) - len(prontos) and pg.locator(".deck:not(.vazio)").count() == 0)
            pg.click('[data-dk="limpar"]'); pg.wait_for_timeout(150)
            pg.click('[data-dk="cor"][data-k="B"]'); pg.wait_for_timeout(150)
            com_b = [d for d in H["decks"] if "B" in ((d.get("a") or {}).get("ident") or d["cores"] or "")]
            R.ok("Decks: filtro de cor (preto)", pg.locator(".deck").count() == len(com_b), (pg.locator(".deck").count(), len(com_b)))
            pg.click('[data-dk="limpar"]'); pg.wait_for_timeout(150)
            pg.click('[data-dk="v"][data-k="lista"]'); pg.wait_for_timeout(150)
            R.ok("Decks: lista com uma linha por deck", pg.locator(".lrow").count() == len(H["decks"]), pg.locator(".lrow").count())
            pg.fill("#q", "giada"); pg.wait_for_timeout(100)
            R.ok("Decks: a busca filtra a lista", pg.locator(".lrow:not([hidden])").count() == 1)
            pg.fill("#q", "")
            pg.click('[data-dk="v"][data-k="cor"]'); pg.wait_for_timeout(150)
            R.ok("Decks: por cor mostra todos os decks", pg.locator(".deck").count() == len(H["decks"]) and pg.locator(".cor-g").count() >= 1)
            R.ok("Decks: por cor sem Ravnica, Alara nem Tarkir, e por número de cores",
                 not re.search(r"Ravnica|Alara|Tarkir|[Gg]uilda", pg.inner_text("#v-decks")) and pg.locator('#v-decks details[data-sf="fam-duas-cores"]').count() == 1)
            pg.click('[data-dk="v"][data-k="tema"]'); pg.wait_for_timeout(150)
            R.ok("Decks: por tema mostra todos os decks", pg.locator(".deck").count() == len(H["decks"]) and pg.locator('#v-decks details[data-sf="tema-tribais"]').count() == 1)
            sem_tema = [d["pasta"] for d in prontos if not d.get("tj")]
            R.ok("Decks: todo deck com painel tem tema_jogo", not sem_tema, sem_tema)
            pg.click('[data-dk="v"][data-k="lista"]'); pg.wait_for_timeout(150)
            R.ok("Decks: lista em grupos que abrem no clique", pg.locator('#v-decks details.g-sf').count() == 5)
            pg.click('[data-dk="v"][data-k="estante"]'); pg.wait_for_timeout(150)
            R.ok("Decks: volta para a estante com os grupos", pg.eval_on_selector_all(".grupo h2", "e=>e.map(x=>x.textContent.trim())") == ["01. Top", "02. Tribais", "03. Caos", "04. Forfun", "05. Desejo"])
            pg.click("#t-pastas"); R.ok("aba Pastas com as oito pastas", pg.is_visible("#v-pastas") and pg.locator(".pasta").count() == 8)

            # ---------------- Dashboard
            pg.click("#t-dash"); pg.wait_for_timeout(200)
            R.ok("aba Dashboard", pg.is_visible("#v-dash"))
            R.ok("Dashboard com as seções e as oito abas", all(pg.locator("#d-" + s).count() == 1 for s in SECOES) and
                 pg.eval_on_selector_all(".dnav a", "e=>e.map(x=>x.dataset.dtab)") == ABAS, [s for s in SECOES if not pg.locator("#d-" + s).count()])
            R.ok("uma aba por vez: abre no Resumo", pg.eval_on_selector_all("#v-dash .dtab:not([hidden])", "e=>e.map(x=>x.dataset.dtab)") == ["resumo"])
            for t in ABAS:
                aba(pg, t)
                R.ok("aba %s: só ela aparece e o endereço acompanha" % t, pg.eval_on_selector_all("#v-dash .dtab:not([hidden])", "e=>e.map(x=>x.dataset.dtab)") == [t] and
                     pg.evaluate("location.hash").startswith("#d-"), pg.evaluate("location.hash"))
            aba(pg, "mov")
            R.ok("Movimentações: abre por deck, um bloco por deck com movimento", pg.locator("#d-movimentacoes details.mv-dk").count() >= 1 and pg.locator("#d-movimentacoes details.mv-dk").count() <= len(prontos))
            pg.click('#d-movimentacoes [data-act="mov-modo"][data-k="lista"]'); pg.wait_for_timeout(150)
            aba(pg, "mov")
            R.ok("Movimentações: mova, já tem e potenciais",
                 pg.locator("#d-movimentacoes .cx h3:text('Mova em vez de comprar')").count() == 1 and
                 pg.locator("#d-movimentacoes .cx h3:text('Antes de comprar: você já tem')").count() == 1 and
                 pg.locator("#d-movimentacoes .cx h3:text('Potenciais que você já tem')").count() == 1)
            R.ok("Dashboard: o radar contra as pastas",
                 pg.locator("#d-compartilhadas .cx h3:text('O radar contra as pastas')").count() == 1)
            dash = {x["pasta"]: x for x in pg.evaluate("window.HUB_DASH.decks")}
            mv_js, mv_py = pg.evaluate("window.HUB_DASH.mov"), movimentos_py()
            R.ok("Movimentações: cartas do radar que você já tem, iguais à conta em Python", mv_js["cartas"] == mv_py["cartas"], (mv_js["cartas"], mv_py["cartas"]))
            R.ok("Movimentações: pares para mover iguais à conta em Python", mv_js["mova"] == mv_py["mova"], (mv_js["mova"], mv_py["mova"]))
            # Game Changers: contados em Python pela lista do cache do Scryfall
            import scryfall
            G = scryfall._ler().get("gc")
            if G:
                gcs = {motor_hub.frente(n) for n in G["nomes"]}
                for d in prontos:
                    m = dados.montar(d["pasta"], avisar=lambda *x: None)
                    n = sorted(c["n"] for c in m["cards"] if motor_hub.frente(c.get("on") or c["n"]) in gcs)
                    R.ok("%s: Game Changers" % d["pasta"], dash[d["pasta"]].get("game_changers") == n, (dash[d["pasta"]].get("game_changers"), n))
                R.ok("bracket fora do hub, a pedido do dono", pg.locator(".brk").count() == 0 and "racket" not in pg.inner_text("#v-dash") + pg.inner_text("#v-decks"))
            else:
                R.ok("lista de Game Changers no cache (rode o build com internet)", False)
            aba(pg, "fichas")
            R.ok("Fichas: uma por deck com painel", pg.locator(".fi").count() == len(prontos), pg.locator(".fi").count())
            pg.click('[data-act="ficha-g"][data-k="05"]'); pg.wait_for_timeout(150)
            R.ok("Fichas: filtro de grupo", pg.locator(".fi").count() == sum(1 for d in prontos if d["grupo"] == "05"))
            pg.click('[data-act="ficha-g"][data-k=""]'); pg.wait_for_timeout(150)
            pg.select_option('select[data-cmp="b"]', prontos[0]["pasta"]); pg.wait_for_timeout(150)
            R.ok("Comparar: trocar o deck redesenha", prontos[0]["nome"] in pg.inner_text("#d-comparar .cx h3 >> nth=0"))
            aba(pg, "potencial")
            R.ok("Decks em potencial: um cartão por deck sem painel", pg.locator(".pot").count() == len(H["decks"]) - len(prontos), pg.locator(".pot").count())
            aba(pg, "trocas")
            R.ok("Dashboard cobre todos os decks com painel", sorted(dash) == sorted(d["pasta"] for d in prontos), sorted(dash))
            for d in prontos:
                x = dash.get(d["pasta"], {})
                R.ok("%s: placar do Dashboard igual ao do motor" % d["pasta"], x.get("placar") == d["placar"], (x.get("placar"), d["placar"]))
                esperado = com_trocas(d["pasta"])
                R.ok("%s: placar com as trocas igual à conta em Python" % d["pasta"], x.get("placar_trocas") == esperado, (x.get("placar_trocas"), esperado))
                ctl = comum.controle(d["pasta"]).get("placar_trocas")
                if ctl is not None:
                    R.ok("%s: placar com as trocas igual ao controle" % d["pasta"], x.get("placar_trocas") == ctl, (x.get("placar_trocas"), ctl))
                nb, cmc_b = comum.custo_baixo(dados.montar(d["pasta"], avisar=lambda *x: None))
                R.ok("%s: trocas que baixam o custo iguais à conta em Python" % d["pasta"],
                     x.get("baixa_custo") == nb and abs(x.get("cmc_custo", 0) - round(cmc_b, 2)) < 0.006, (x.get("baixa_custo"), x.get("cmc_custo"), nb, round(cmc_b, 2)))
            for d in prontos:
                m = dados.montar(d["pasta"], avisar=lambda *x: None)
                x = dash.get(d["pasta"], {})
                R.ok("%s: funções sem reserva iguais à conta em Python" % d["pasta"], x.get("sem_reserva") == reserva_py(m), (x.get("sem_reserva"), reserva_py(m)))
                por_n = {c["n"]: c for c in m["cards"]}
                ruins = [n for ns in (x.get("cortes") or {}).values() for n in ns
                         if n not in por_n or (por_n[n].get("tier") not in ("C", "D") and por_n[n].get("rel") != "BAX") or por_n[n].get("rel") == "INS" or por_n[n].get("nocut") or por_n[n].get("cmd")]
                R.ok("%s: cortes seguros só de tier C ou D, ou na berlinda, fora de intocáveis e comandante" % d["pasta"], not ruins, ruins)
                faixa = {g["k"]: g.get("ref") for g in m["grupos"] if g["k"] in ("ramp", "draw", "removal")}
                for k, ns in (x.get("cortes") or {}).items():
                    j = [g["k"] for g in m["grupos"]].index(k)
                    n = sum(c.get("q", 1) for c in m["cards"] if j < len(c.get("s") or []) and c["s"][j] >= 2)
                    R.ok("%s: cortes de %s não passam do que sobra" % (d["pasta"], k), faixa.get(k) and len(ns) <= n - faixa[k][1], (len(ns), n, faixa.get(k)))
            R.ok("Reserva: funções sem reserva, trocas dentro do deck e a tabela deck a deck",
                 pg.locator("#d-reserva .cx h3:text('Funções sem reserva')").count() == 1 and
                 pg.locator("#d-reserva .cx h3:text('Trocas dentro do deck')").count() == 1 and
                 pg.locator("#d-reserva .cx h3:text('Funções curtas e pacotes com sobra, deck a deck')").count() == 1)
            R.ok("Fichas: reserva função a função em cada ficha", pg.locator(".fi .rs").count() == len(prontos))
            R.ok("preço e valor fora do hub, a pedido do dono",
                 not re.search(r"US\$|dólar|Scryfall, carta a carta|Valor que sai", pg.text_content("#v-dash") + pg.text_content("#v-decks")) and pg.locator("#d-valor").count() == 0)
            R.ok("Trocas: coluna de CMC médio antes e depois", pg.locator("#d-trocas thead th:text('CMC médio')").count() == 1)
            R.ok("Trocas: as que baixam o custo e as mais caras sem troca barata",
                 pg.locator("#d-trocas .cx h3:text('Trocas que baixam o custo')").count() == 1 and
                 pg.locator("#d-trocas .cx h3:text('Custo 6 ou mais, sem troca mais barata no radar')").count() == 1)
            aba(pg, "resumo")
            R.ok("KPIs do resumo", pg.locator("#d-resumo .kpi").count() >= 5, pg.locator("#d-resumo .kpi").count())
            R.ok("Faça agora: no máximo cinco ações", 1 <= pg.locator("#d-resumo .acoes > li").count() <= 5, pg.locator("#d-resumo .acoes > li").count())
            R.ok("carteira num relance: um deck por painel", pg.locator("#d-resumo .sd").count() == len(prontos))
            pg.click("#d-resumo .sd >> nth=3"); pg.wait_for_timeout(300)
            R.ok("clicar num deck do relance abre a ficha dele", pg.is_visible("#f-3") and pg.evaluate("location.hash") == "#f-3", pg.evaluate("location.hash"))
            R.ok("lista do que pede atenção", pg.locator("#d-resumo .att > li:not(.mais)").count() >= 1)
            # mesa: com um oponente de combo, o ranking aparece com todos os decks e explica o porquê
            aba(pg, "mesa")
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
            aba(pg, "trocas")
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
            # "Ver todas": todo botão abre a lista inteira e fecha de novo, em qualquer seção (antes, três não abriam)
            for k in pg.eval_on_selector_all('#v-dash [data-act="mais"]', "els => els.map(e => e.dataset.k)"):
                sel = '#v-dash [data-act="mais"][data-k="%s"]' % k
                aba(pg, pg.eval_on_selector(sel, "e => e.closest('.dtab').dataset.dtab"))
                n = int(re.search(r"\d+", pg.inner_text(sel)).group())
                pg.click(sel); pg.wait_for_timeout(120)
                aberto = pg.inner_text(sel)
                linhas = pg.evaluate("s => { const b = document.querySelector(s), l = b.closest('ul, ol, tbody'); return l.querySelectorAll(':scope > li:not(.mais), :scope > tr:not(.mais)').length; }", sel)
                pg.click(sel); pg.wait_for_timeout(120)
                R.ok("Ver todas (%s): abre as %d e fecha" % (k, n), aberto == "Mostrar menos" and linhas == n and pg.inner_text(sel).startswith("Ver todas"), (aberto, linhas, n))
            # álbum: 32 figurinhas, coladas conforme as cores dos decks
            aba(pg, "bastidores")
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
            # endereço: cada aba grava o seu; atualizar e voltar abrem a aba certa
            pg.click('.dnav a[href="#d-auditoria"]'); pg.wait_for_timeout(200)
            pg.click("#t-decks"); pg.wait_for_timeout(200)
            R.ok("depois de uma seção do Dashboard, a aba Decks muda o endereço", pg.evaluate("location.hash") == "#decks" and pg.is_visible("#v-decks"), pg.evaluate("location.hash"))
            R.ok("trocar de aba volta ao topo", pg.evaluate("window.scrollY") == 0, pg.evaluate("window.scrollY"))
            pg.reload(); pg.wait_for_timeout(1000)
            R.ok("atualizar a página fica em Decks", pg.is_visible("#v-decks") and not pg.is_visible("#v-dash"))
            pg.click("#t-pastas"); pg.wait_for_timeout(150); pg.reload(); pg.wait_for_timeout(1000)
            R.ok("atualizar a página fica em Pastas", pg.is_visible("#v-pastas") and pg.evaluate("location.hash") == "#pastas")
            pg.go_back(); pg.wait_for_timeout(300)
            R.ok("voltar do navegador volta para Decks", pg.is_visible("#v-decks"), pg.evaluate("location.hash"))
            pg.go_back(); pg.wait_for_timeout(300)
            R.ok("voltar de novo volta para a seção do Dashboard", pg.is_visible("#v-dash") and pg.evaluate("location.hash") == "#d-auditoria", pg.evaluate("location.hash"))
            pg.click("#t-decks"); pg.wait_for_timeout(100); pg.click('[data-dk="abrir"]'); pg.wait_for_timeout(100)
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
