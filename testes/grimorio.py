# -*- coding: utf-8 -*-
"""Confere o Grimório (motor/grimorio.py) sem rede: o dado contra as decklists e as pastas, o Scryfall de cada carta,
as regras do método e a página montada.

    python testes/grimorio.py [--sem-montar]

1. Toda carta tem registro no cache do Scryfall e nenhuma é banida no Commander.
2. "Onde já está" refeito em Python, para uma amostra, contra as decklists (deck a deck) e as listas das pastas e da Caixa.
3. Status, pontas de lança e teto refeitos pelas regras de contexto/ARQUITETURA.md ("O Grimório").
4. A página: tamanho dentro do orçamento, sem preço, as seis sub-abas, a gaveta, a lente sem leitura com o motivo.
"""
import json, os, re, subprocess, sys
from playwright.sync_api import sync_playwright
import comum
import dados, grimorio, scryfall

a = comum.argumentos("O Grimório")
R = comum.Relatorio("grimorio")
G = grimorio.ler_grimorio()
if not G:
    sys.exit("sem dados/grimorio/grimorio.json: rode python motor/grimorio.py --ler")
L = grimorio.ler_lentes()
TR = {"S": 0, "A": 1, "B": 2, "C": 3, "D": 4}

# ---------------- 1. Scryfall
cache = scryfall._ler()["cartas"]
por_nome = {}
for v in cache.values():
    if isinstance(v, dict) and v.get("name"):
        por_nome.setdefault(v["name"].lower(), v)
        por_nome.setdefault(v["name"].split(" // ")[0].lower(), v)
sem = [n for n in G["cartas"] if n.lower() not in por_nome]
R.ok("toda carta do Grimório tem registro no cache do Scryfall", not sem, sem[:5])
ban = [n for n in G["cartas"] if (por_nome.get(n.lower()) or {}).get("leg") == "banned" or G["cartas"][n].get("leg") == "banned"]
R.ok("nenhuma carta banida no Commander", not ban, ban[:5])
R.ok("toda carta com nome oficial, identidade e tipo do Scryfall", all(c["n"] == n and c["ci"] == dados.ordem_cores("".join((por_nome.get(n.lower()) or {}).get("color_identity") or [])) and c["t"] for n, c in G["cartas"].items()))

# ---------------- 2. onde já está, contra as decklists e as pastas
decklists = {}
for p in sorted(os.listdir(dados.DADOS)):
    if dados.eh_deck(p) and os.path.exists(os.path.join(dados.DADOS, p, "decklist.txt")) and os.path.exists(os.path.join(dados.DADOS, p, "avaliacao.json")):
        decklists[p] = {dados.chave_nome(e["name"]) for e in dados.ler_decklist(os.path.join(dados.DADOS, p, "decklist.txt"))}
pastas = dados.ler_pastas()
amostra = sorted(G["cartas"], key=lambda n: (G["cartas"][n].get("rank") or 10 ** 9, n))[:60]
erros_d, erros_p = [], []
for n in amostra:
    c = G["cartas"][n]
    ch = dados.chave_nome(n)
    esperado = {p for p, s in decklists.items() if ch in s}
    visto = {x["p"] for x in c["onde"] if x["w"] == "deck"}
    if esperado != visto:
        erros_d.append((n, sorted(esperado ^ visto)))
    esp_p = {p: cs[ch] for p, cs in pastas.items() if ch in cs}
    if esp_p != c["pastas"]:
        erros_p.append((n, esp_p, c["pastas"]))
R.ok("onde já está (decks): bate com as decklists nas %d mais populares" % len(amostra), not erros_d, erros_d[:3])
R.ok("onde já está (pastas e Caixa): bate com as listas", not erros_p, erros_p[:3])
R.ok("a amostra tem cartas em deck, em pasta ou Caixa, e em lugar nenhum",
     any(G["cartas"][n]["onde"] for n in amostra) and any(G["cartas"][n]["pastas"] for n in amostra) and any(not G["cartas"][n]["onde"] and not G["cartas"][n]["pastas"] for n in amostra))

# ---------------- 3. status, pontas e teto
def status_py(c):
    reais = [x for x in c["onde"] if not x.get("dj")]
    em = [TR[x["t"]] for x in reais if x["w"] == "deck"]
    if em:
        melhor = min(em)
        return "ociosa" if any(x["w"] == "radar" and x["t"] in ("S", "A") and TR[x["t"]] < melhor for x in reais) else "tenho"
    return "ociosa" if c["pastas"] else "falta"


errados = [n for n, c in G["cartas"].items() if status_py(c) != c["st"]]
R.ok("status refeito em Python: Tenho, Ociosa (pasta, Caixa ou sub-utilizada) e Falta", not errados, errados[:5])
R.ok("deck de 05. Desejo não vale como Tenho", all(c["st"] != "tenho" for c in G["cartas"].values() if all(x.get("dj") for x in c["onde"] if x["w"] == "deck") and not [x for x in c["onde"] if x["w"] == "deck" and not x.get("dj")]))
temas = {l["k"] for l in L["tema"]}


def ponta_py(c):
    nt = [k for k in c["lentes"] if k in temas]
    return len(nt) >= 2 or (len(nt) == 1 and 3 in (c["notas"] or {}).values())


R.ok("pontas de lança refeitas: duas lentes de tema, ou uma e nota 3", all(bool(c["ponta"]) == ponta_py(c) for c in G["cartas"].values()) and set(G["pontas"]) == {n for n, c in G["cartas"].items() if c["ponta"]})
teto = L["teto"]
R.ok("teto por lente: até %d mais incluídas e %d de maior sinergia" % (teto["mais_incluidas"], teto["maior_sinergia"]),
     all(len([n for n in l["cartas"] if G["cartas"][n]["lentes"][l["k"]]["por"] in ("inc", "inc+syn")]) <= teto["mais_incluidas"]
         and len([n for n in l["cartas"] if G["cartas"][n]["lentes"][l["k"]]["por"] in ("syn", "inc+syn")]) <= teto["maior_sinergia"] for l in G["lentes"]))
R.ok("inclusão de cada carta na lente = num_decks ÷ potential_decks", all(abs(v["inc"] - v["nd"] / v["pd"]) < 0.001 for c in G["cartas"].values() for v in c["lentes"].values() if v.get("pd")))
R.ok("as lentes de cor não dão sinergia; as de tema dão", all(v.get("syn") is None for l in G["lentes"] if l["tipo"] == "cor" for n in l["cartas"] for v in [G["cartas"][n]["lentes"][l["k"]]])
     and any(v.get("syn") is not None for l in G["lentes"] if l["tipo"] == "tema" for n in l["cartas"] for v in [G["cartas"][n]["lentes"][l["k"]]]))
R.ok("onde rende: só decks que existem, sem a carta, no máximo três, com ganho e quem sai",
     all(len(c["rende"]) <= 3 and all(not r["p"].startswith("05") and r["p"] not in {x["p"] for x in c["onde"] if x["w"] == "deck"} and "g" in r and "s" in r for r in c["rende"]) for c in G["cartas"].values()))
R.ok("carta sem cadastro não tem onde rende", all(not c["rende"] for c in G["cartas"].values() if c["notas"] is None))
lt = grimorio.ler_leitura() or {}
R.ok("leitura.json registra o caminho que respondeu, ou o motivo, para toda lente",
     all((k in (lt.get("caminhos") or {}) and ((lt["caminhos"][k].get("respondeu") or k in (lt.get("sem_leitura") or {})))) for k in temas | {l["k"] for l in L["cor"]}))

# ---------------- 4. a página
html = os.path.join(comum.RAIZ, "saidas", grimorio.NOME + ".html")
if not a.sem_montar or not os.path.exists(html):
    r = subprocess.run([sys.executable, "-B", os.path.join(comum.MOTOR, "build.py"), "--grimorio"], capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        sys.exit("o build do Grimório falhou:\n" + r.stdout + r.stderr)
mb = os.path.getsize(html) / 1048576
R.ok("HTML dentro do orçamento (%s MB)" % L.get("orcamento_html_mb", 14), mb <= (L.get("orcamento_html_mb") or 14), "%.1f MB" % mb)
with open(html, encoding="utf-8") as f:
    txt = f.read()
PRECO = r"US\$|R\$|\"usd\"|usd_foil|\$\s?\d|(?<![Ss]em )preço"   # a palavra só aparece em "sem preço"
R.ok("sem preço no HTML", not re.search(PRECO, txt), [m.group(0) for m in re.finditer(PRECO, txt)][:3])
R.ok("sem bracket nem estimação", not re.search(r"bracket|estimação", txt, re.I))
R.ok("as seis sub-abas com endereço no HTML", all(('href="#%s"' % t) in txt for t in ("tribos", "cores", "criterios", "8x8", "pontas", "novidades")))
sem_leitura = [l for l in G["lentes"] if not l["cartas"]]
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1360, "height": 1000})
    comum.bloquear_rede(pg)
    err = []
    pg.on("pageerror", lambda e: err.append(str(e)))
    pg.goto(comum.url(html)); pg.wait_for_function("!!window.GRIMORIO", timeout=30000); pg.wait_for_timeout(300)
    Dp = pg.evaluate("({cartas: Object.keys(window.GRIMORIO.cards).length, lentes: Object.keys(window.GRIMORIO.lentes).length, pontas: window.GRIMORIO.pontas.length, g8: Object.keys(window.GRIMORIO.g8).length})")
    R.ok("a página leva as cartas, as lentes, as pontas e o 8×8 do dado", Dp["lentes"] == len(G["lentes"]) and Dp["g8"] == len(G["g8"]) and 0 < Dp["cartas"] <= len(G["cartas"]) and Dp["pontas"] <= len(G["pontas"]), Dp)
    for t in ("tribos", "cores", "criterios", "8x8", "pontas", "novidades"):
        pg.click('#g-nav a[data-aba="%s"]' % t); pg.wait_for_timeout(250)
        R.ok("sub-aba %s desenha" % t, pg.evaluate("document.querySelector('#g-corpo').children.length") > 0 and pg.get_attribute('#g-nav a[data-aba="%s"]' % t, "aria-current") == "page")
    pg.click('#g-nav a[data-aba="tribos"]'); pg.wait_for_timeout(250)
    vamp = next((l for l in G["lentes"] if l["k"] == "vampiros"), None)
    if vamp and vamp["cartas"]:
        pg.evaluate("location.hash = '#tribos=vampiros'"); pg.wait_for_timeout(300)
        n = pg.locator("#g-corpo .g-tbl tbody tr").count()
        R.ok("Vampiros: a tabela lista as cartas da lente", n == len(vamp["cartas"]), (n, len(vamp["cartas"])))
        pg.click("#g-corpo .g-tbl tbody tr >> nth=0 >> button"); pg.wait_for_timeout(200)
        R.ok("gaveta da carta: imagem ou aviso, texto, critérios, onde está, onde rende, lentes, links", pg.is_visible("#g-gav") and all(pg.locator("#g-gav h4", has_text=s).count() == 1 for s in ("Texto", "Critérios", "Onde já está", "Onde rende", "Lentes", "Abrir")))
        pg.keyboard.press("Escape"); pg.wait_for_timeout(100)
        R.ok("Esc fecha a gaveta", pg.is_hidden("#g-gav"))
        pg.click('#g-ferr .g-seg[aria-label="Status"] button >> nth=1'); pg.wait_for_timeout(200)
        R.ok("filtro Faltam: só cartas com status Falta", pg.locator("#g-corpo .g-st.tenho, #g-corpo .g-st.ociosa").count() == 0)
        pg.click('#g-ferr .g-seg[aria-label="Status"] button >> nth=0'); pg.wait_for_timeout(100)
    if sem_leitura:
        l = sem_leitura[0]
        pg.evaluate("location.hash = '#%s=%s'" % ("tribos" if l["tipo"] == "tema" else "cores", l["k"])); pg.wait_for_timeout(300)
        R.ok("lente sem leitura (%s) mostra o estado vazio com o motivo, sem sumir" % l["nome"], pg.locator("#g-corpo .g-vazio").count() == 1 and (l.get("erro") or "")[:20] in pg.inner_text("#g-corpo .g-vazio"))
    pg.goto(comum.url(html) + "?deck=" + "04.%20Queen" + "#8x8"); pg.wait_for_function("!!window.GRIMORIO", timeout=30000); pg.wait_for_timeout(400)
    R.ok("?deck= abre o 8×8 no deck pedido (a ponte da Oficina de cada painel)", pg.input_value("#g-deck8") == "04. Queen" and pg.get_attribute('#g-nav a[data-aba="8x8"]', "aria-current") == "page", pg.input_value("#g-deck8"))
    # com as 45 lentes lidas, o estado vazio é conferido esvaziando uma lente na página (o texto do motivo vem do dado)
    pg.evaluate("window.GRIMORIO.lentes['goblins'] = []; window.GRIMORIO.temas.forEach(function (t) { if (t.k === 'goblins') t.erro = 'teste: nenhum caminho respondeu'; })")
    pg.evaluate("location.hash = '#tribos=goblins'"); pg.wait_for_timeout(300)
    R.ok("lente sem cartas mostra o estado vazio com o motivo, sem sumir", pg.locator("#g-corpo .g-vazio").count() == 1 and "teste: nenhum caminho respondeu" in pg.inner_text("#g-corpo .g-vazio") and pg.locator("#g-lentes .g-chip", has_text="Goblins").count() == 1)
    # ---------------- o padrão das outras abas: ordenar, agrupar, recolher e expandir, drill
    pg.goto(comum.url(html) + "#tribos=vampiros"); pg.wait_for_function("!!window.GRIMORIO", timeout=30000)
    pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_function("!!window.GRIMORIO", timeout=30000); pg.wait_for_timeout(300)
    nomes = lambda: pg.eval_on_selector_all("#g-corpo .g-tbl tbody tr td.nm b", "e => e.map(x => x.textContent)")
    n0 = nomes()
    # contagens do status como filtro: batem com as cartas da lente
    cont = pg.evaluate("Array.from(document.querySelectorAll('#g-ferr [data-n]')).reduce(function (o, e) { o[e.getAttribute('data-n')] = +e.textContent; return o; }, {})")
    vc = G["lentes"][[l["k"] for l in G["lentes"]].index("vampiros")]["cartas"]
    esp = {"todas": len(vc), "falta": sum(1 for n in vc if G["cartas"][n]["st"] == "falta"), "ociosa": sum(1 for n in vc if G["cartas"][n]["st"] == "ociosa"), "tenho": sum(1 for n in vc if G["cartas"][n]["st"] == "tenho")}
    R.ok("totais por status no filtro (Todas, Faltam, Ociosas, Tenho) batem com a lente", cont == esp, (cont, esp))
    R.ok("sem filtro ativo, 'Limpar filtros' fica escondido", pg.is_hidden("#g-limpar"))
    # ordenar: a seta inverte, e o clique no cabeçalho ordena e inverte
    pg.click("#g-inv"); pg.wait_for_timeout(200)
    R.ok("a seta inverte a ordem da lista", nomes() == list(reversed(n0)), (nomes()[:2], n0[-2:]))
    pg.click("#g-inv"); pg.wait_for_timeout(100)
    pg.click("#g-corpo .g-tbl th >> text=Carta"); pg.wait_for_timeout(200)
    a_z = nomes()
    R.ok("clique no cabeçalho Carta ordena de A a Z (primeira letra) e marca aria-sort", a_z != n0 and [x[0].lower() for x in a_z] == sorted(x[0].lower() for x in a_z) and pg.get_attribute("#g-corpo .g-tbl th:has-text('Carta')", "aria-sort") == "ascending", a_z[:3])
    pg.click("#g-corpo .g-tbl th >> text=Carta"); pg.wait_for_timeout(200)
    R.ok("outro clique no mesmo cabeçalho inverte", nomes() == list(reversed(a_z)) and pg.get_attribute("#g-corpo .g-tbl th:has-text('Carta')", "aria-sort") == "descending", pg.get_attribute("#g-corpo .g-tbl th:has-text('Carta')", "aria-sort"))
    pg.select_option("#g-ordem", "pop"); pg.wait_for_timeout(200)
    R.ok("o seletor de ordem volta à ordem natural da lente", nomes() == n0)
    # agrupar por status: uma sanfona por grupo, com contagem; fechar, lembrar, abrir
    pg.click('#g-ferr .g-agr button[data-v="status"]'); pg.wait_for_timeout(250)
    grupos = pg.eval_on_selector_all("#g-corpo details.g-sf > summary h3", "e => e.map(x => x.textContent)")
    R.ok("Agrupar por Status: Faltam, Ociosas e Tenho (os que existem), nessa ordem", grupos == [g for g in ("Faltam", "Ociosas", "Tenho") if esp[{"Faltam": "falta", "Ociosas": "ociosa", "Tenho": "tenho"}[g]]], grupos)
    soma = pg.evaluate("Array.from(document.querySelectorAll('#g-corpo details.g-sf .g-tbl tbody tr')).length")
    R.ok("os grupos somam todas as cartas da lente", soma == len(vc), (soma, len(vc)))
    R.ok("o cabeçalho do grupo traz a contagem de cartas", all(re.search(r"\d+ cartas?", t) for t in pg.eval_on_selector_all("#g-corpo details.g-sf > summary .sf-r", "e => e.map(x => x.textContent)")))
    pg.click("#g-ab >> text=Fechar todos"); pg.wait_for_timeout(250)
    R.ok("Fechar todos recolhe todos os grupos", pg.locator("#g-corpo details.g-sf[open]").count() == 0)
    pg.reload(); pg.wait_for_function("!!window.GRIMORIO", timeout=30000); pg.wait_for_timeout(300)
    R.ok("o agrupamento e os grupos fechados ficam lembrados no navegador (grimorio:v1)", pg.locator("#g-corpo details.g-sf").count() == len(grupos) and pg.locator("#g-corpo details.g-sf[open]").count() == 0)
    pg.click("#g-ab >> text=Abrir todos"); pg.wait_for_timeout(250)
    R.ok("Abrir todos expande todos os grupos", pg.locator("#g-corpo details.g-sf[open]").count() == len(grupos))
    pg.locator("#g-corpo details.g-sf > summary").first.click(); pg.wait_for_timeout(150)
    R.ok("o clique no cabeçalho do grupo recolhe só aquele", pg.locator("#g-corpo details.g-sf[open]").count() == len(grupos) - 1)
    pg.click('#g-ferr .g-agr button[data-v="tipo"]'); pg.wait_for_timeout(250)
    tipos = pg.eval_on_selector_all("#g-corpo details.g-sf > summary h3", "e => e.map(x => x.textContent)")
    R.ok("Agrupar por Tipo: Criaturas primeiro", tipos and tipos[0] == "Criaturas", tipos)
    pg.click('#g-ferr .g-agr button[data-v="cor"]'); pg.wait_for_timeout(250)
    R.ok("Agrupar por Cor: só nomes de cor", set(pg.eval_on_selector_all("#g-corpo details.g-sf > summary h3", "e => e.map(x => x.textContent)")) <= {"Incolor", "Branco", "Azul", "Preto", "Vermelho", "Verde", "Multicolor"})
    pg.click('#g-ferr .g-agr button[data-v="nenhum"]'); pg.wait_for_timeout(250)
    R.ok("Agrupar Nenhum volta à tabela única, sem Abrir/Fechar todos", pg.locator("#g-corpo details.g-sf").count() == 0 and pg.is_hidden("#g-ab"))
    # filtros: limpar
    pg.click('#g-ferr .g-seg[aria-label="Status"] button[data-v="falta"]'); pg.wait_for_timeout(200)
    R.ok("com filtro ativo, 'Limpar filtros' aparece e volta tudo", pg.is_visible("#g-limpar") and len(nomes()) == esp["falta"])
    pg.click("#g-limpar"); pg.wait_for_timeout(250)
    R.ok("Limpar filtros restaura a lista inteira", len(nomes()) == len(vc) and pg.is_hidden("#g-limpar"))
    pg.fill("#g-filtro", "vampire"); pg.wait_for_timeout(250)
    R.ok("o filtro de texto atualiza as contagens do status sem perder o foco do campo", pg.evaluate("document.activeElement.id") == "g-filtro" and int(pg.inner_text('#g-ferr [data-n="todas"]')) == len(nomes()))
    pg.fill("#g-filtro", ""); pg.wait_for_timeout(150)
    # 8×8: quadros que recolhem, e abrir e fechar todos
    pg.evaluate("location.hash = '#8x8'"); pg.wait_for_timeout(300)
    nq = pg.locator("#g-corpo details.g-quadro").count()
    R.ok("8×8: cada pacote é uma sanfona aberta", nq > 0 and pg.locator("#g-corpo details.g-quadro[open]").count() == nq, nq)
    pg.locator("#g-corpo details.g-quadro > summary").first.click(); pg.wait_for_timeout(150)
    R.ok("8×8: o clique no resumo do pacote recolhe só ele", pg.locator("#g-corpo details.g-quadro[open]").count() == nq - 1)
    pg.click("#g-ab >> text=Fechar todos"); pg.wait_for_timeout(200)
    R.ok("8×8: Fechar todos recolhe os pacotes", pg.locator("#g-corpo details.g-quadro[open]").count() == 0)
    pg.click("#g-ab >> text=Abrir todos"); pg.wait_for_timeout(200)
    R.ok("8×8: Abrir todos expande os pacotes", pg.locator("#g-corpo details.g-quadro[open]").count() == nq)
    # drill: da lente ao 8×8 do deck, e da gaveta à lente e ao deck
    pg.evaluate("location.hash = '#tribos=vampiros'"); pg.wait_for_timeout(300)
    pg.locator("#g-corpo .g-lh .decks button").first.click(); pg.wait_for_timeout(300)
    R.ok("drill: o chip de deck do cabeçalho da lente abre o 8×8 desse deck", pg.get_attribute('#g-nav a[data-aba="8x8"]', "aria-current") == "page" and pg.input_value("#g-deck8") in {"01. Markov", "01. Vito", "02. Clavileño", "02. Strefan", "02. Evelyn"}, pg.input_value("#g-deck8"))
    pg.evaluate("location.hash = '#cores=B'"); pg.wait_for_timeout(300)
    pg.locator("#g-corpo .g-tbl tbody tr >> nth=0 >> button").click(); pg.wait_for_timeout(200)
    pg.locator("#g-gav .g-lt.g-dl").first.click(); pg.wait_for_timeout(300)
    R.ok("drill: a lente na gaveta leva à lente (e fecha a gaveta)", pg.is_hidden("#g-gav") and pg.locator('#g-nav a[aria-current="page"]').count() == 1 and pg.locator("#g-corpo .g-lh h2").count() == 1)
    pg.evaluate("localStorage.clear()")
    R.ok("sem erro de página", not err, err[:2])
    b.close()
R.fim()
