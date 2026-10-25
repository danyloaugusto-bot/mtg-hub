# -*- coding: utf-8 -*-
"""Confere os Ciclos (motor/ciclos.py) sem rede: a lista do dono contra o Scryfall, as regras (identidade, cabe em, grau, status,
onde rende), a conferência da lista numa cópia e a página montada.

    python testes/ciclos.py [--sem-montar]

1. Toda carta encontrada tem registro no cache do Scryfall, identidade e raridade de lá; nenhuma banida.
2. "Cabe em" é a identidade do comandante; "onde já está" bate com as decklists e as pastas numa amostra; status e grau refeitos.
3. --conferir numa cópia da lista: preenche a raridade '?' e só tira o "verificar" do que o Scryfall confirma; a lista do dono não muda.
4. A página: tamanho, sem preço, as seis sub-abas, a linha do ciclo com as cinco cores, o filtro por deck, a gaveta com Consultar.
"""
import json, os, re, shutil, subprocess, sys, tempfile
from playwright.sync_api import sync_playwright
import comum
import ciclos, consulta, dados, encaixe, grimorio, scryfall

a = comum.argumentos("Os Ciclos")
R = comum.Relatorio("ciclos")
G = ciclos.ler_lido()
if not G:
    sys.exit("sem dados/ciclos/ciclos-lido.json: rode python motor/ciclos.py --ler")
L = ciclos.ler_lista()
TR = {"S": 0, "A": 1, "B": 2, "C": 3, "D": 4}
C = G["cartas"]
enc = {n: c for n, c in C.items() if c["encontrada"]}

# ---------------- 1. a lista e o Scryfall
R.ok("a lista do dono tem as colunas pedidas em toda linha", all(all(k in c for k in ("ano", "lancamento", "colecao", "codigo", "ciclo", "tipo_ciclo", "carta", "cores", "raridade", "verificar")) for c in L["cartas"]))
R.ok("toda linha da lista virou uma carta do dado (as fundidas são a frente e o 'A // B' da mesma carta)", len(C) + len(G.get("fundidas") or []) == len({c["carta"] for c in L["cartas"]}), (len(C), len(G.get("fundidas") or []), len({c["carta"] for c in L["cartas"]})))
cache = scryfall._ler()["cartas"]
por_nome = {}
for v in cache.values():
    if isinstance(v, dict) and v.get("name"):
        por_nome.setdefault(v["name"].lower(), v)
        por_nome.setdefault(v["name"].split(" // ")[0].lower(), v)
sem = [n for n in enc if n.lower() not in por_nome]
R.ok("toda carta encontrada tem registro no cache do Scryfall", not sem, sem[:5])
R.ok("identidade de cor e raridade vêm do Scryfall", all(c["ci"] == dados.ordem_cores("".join(por_nome[n.lower()].get("color_identity") or [])) and (c["rar"] in ("C", "U", "R", "M") or c["rar"] is None) for n, c in enc.items() if n.lower() in por_nome))
R.ok("nenhuma carta banida no Commander", not [n for n, c in enc.items() if c.get("leg") == "banned"])
R.ok("as não encontradas ficam no dado, sem texto e sem encaixe, e na leitura", all(not c["o"] and not c["rende"] and not c["cabe"] for c in C.values() if not c["encontrada"]) and set(G["nao_encontradas"]) == {n for n, c in C.items() if not c["encontrada"]})
R.ok("todo ciclo tem coleção, código, ano e tipo válido, e suas cartas existem no dado", all(x["colecao"] and x["codigo"] and x["ano"] and x["tipo"] in ciclos.TIPOS_CICLO and all(n in C for n in x["cartas"]) for x in G["ciclos"]))
R.ok("cada carta aponta para o ciclo que a lista", all(n in next(x for x in G["ciclos"] if x["k"] == c["ciclo"])["cartas"] for n, c in C.items()))
R.ok("a divergência de cor é só informação: vaga diferente da identidade, nunca da raridade", all(x["vaga"] != x["ci"] for x in G["divergencias"]["cores"]) and all(x["dono"] != x["scryfall"] for x in G["divergencias"]["raridade"]))

# ---------------- 2. cabe em, onde está, status, grau, onde rende
decks = encaixe.decks_v3()
ident = {m["pasta"]: m.get("ident") or "" for m in decks}
erro_cabe = [n for n, c in enc.items() if set(c["cabe"]) != {p for p, i in ident.items() if all(ch in i for ch in c["ci"])}]
R.ok("cabe em: exatamente os decks cuja identidade contém a da carta (incolor cabe em todos)", not erro_cabe, erro_cabe[:4])
R.ok("a cor da vaga não decide o encaixe (Medalhões incolores cabem em todo deck)", all(len(c["cabe"]) == len(decks) for n, c in enc.items() if c["ci"] == "" ))
decklists = {}
for p in dados.pastas_decks():
    if dados.eh_deck(p) and os.path.exists(os.path.join(dados.pasta_deck(p), "decklist.txt")) and os.path.exists(os.path.join(dados.pasta_deck(p), "avaliacao.json")):
        decklists[p] = {dados.chave_nome(e["name"]) for e in dados.ler_decklist(os.path.join(dados.pasta_deck(p), "decklist.txt"))}
pastas = dados.ler_pastas()
amostra = sorted(enc, key=lambda n: (enc[n].get("rank") or 10 ** 9, n))[:80]
erros_d, erros_p = [], []
for n in amostra:
    c = C[n]
    ch = dados.chave_nome(n)
    esperado = {p for p, s in decklists.items() if ch in s}
    visto = {x["p"] for x in c["onde"] if x["w"] == "deck"}
    if esperado != visto:
        erros_d.append((n, sorted(esperado ^ visto)))
    esp_p = {p: cs[ch] for p, cs in pastas.items() if ch in cs}
    if esp_p != c["pastas"]:
        erros_p.append((n, esp_p, c["pastas"]))
R.ok("onde já está (decks): bate com as decklists nas 80 mais populares", not erros_d, erros_d[:3])
R.ok("onde já está (pastas e Caixa): bate com as listas", not erros_p, erros_p[:3])


def status_py(c):
    reais = [x for x in c["onde"] if not x.get("dj")]
    em = [TR[x["t"]] for x in reais if x["w"] == "deck"]
    if em:
        melhor = min(em)
        return "ociosa" if any(x["w"] == "radar" and x["t"] in ("S", "A") and TR[x["t"]] < melhor for x in reais) else "tenho"
    return "ociosa" if c["pastas"] else "falta"


R.ok("status refeito em Python: Tenho, Ociosa e Falta, como no Grimório", not [n for n, c in C.items() if status_py(c) != c["st"]])
cad = dados.ler_cadastro()
med = G.get("mediana")
R.ok("a mediana do dado é a do cadastro", med is not None and abs(med - __import__("statistics").median(consulta.valores_cadastro(cad))) < 1e-9)
gcs = set((scryfall._ler().get("gc") or {}).get("nomes") or [])
hoje = __import__("datetime").date.today().isoformat()
erro_g = []
for n, c in enc.items():
    e = cad.get(grimorio._frente(n))
    if not e:
        if c["grau"] is not None or c["rende"]:
            erro_g.append((n, "sem cadastro com grau ou rende"))
        continue
    v = encaixe.valor(consulta.s3_da_carta(e))
    g = consulta.grau_vacuo(v, med, grimorio._frente(n) in gcs, c.get("rank") if (c.get("rel") or "") <= hoje else None)
    if c["grau"] != g or abs((c["valor"] or 0) - v) > 1e-9:
        erro_g.append((n, c["grau"], g))
R.ok("grau no vácuo: a régua da Consulta sobre as notas do cadastro; sem cadastro, sem grau nem onde rende", not erro_g, erro_g[:4])
R.ok("onde rende: só decks que existem (01 a 04), sem a carta, dentro das cores, com ganho e quem sai, em ordem de ganho",
     all(all(not r["p"].startswith("05") and r["p"] in c["cabe"] and r["p"] not in {x["p"] for x in c["onde"] if x["w"] == "deck"} and "g" in r and "s" in r for r in c["rende"])
         and [r["g"] for r in c["rende"]] == sorted((r["g"] for r in c["rende"]), reverse=True) for c in enc.values()))
R.ok("as contagens batem", G["contagens"]["cartas"] == len(C) and G["contagens"]["sem_cadastro"] == sum(1 for c in enc.values() if c["notas"] is None) and G["contagens"]["pendentes"] == sum(1 for c in C.values() if c["verificar"] or not c["encontrada"]))

# ---------------- 3. --conferir numa cópia da lista
TMP = tempfile.mkdtemp(prefix="ciclos-")
shutil.copy(os.path.join(ciclos.PASTA, "ciclos.json"), TMP)
shutil.copy(os.path.join(ciclos.PASTA, "ciclos-lido.json"), TMP)
Lc = json.load(open(os.path.join(TMP, "ciclos.json"), encoding="utf-8"))
alvo = next((c for c in Lc["cartas"] if C.get(c["carta"], {}).get("encontrada") and C[c["carta"]].get("rar")), None)
if alvo:
    alvo["raridade"] = "?"; alvo["verificar"] = "SIM"
    outro = next((c for c in Lc["cartas"] if c is not alvo and C.get(c["carta"], {}).get("encontrada") and C[c["carta"]].get("rar")), None)
    outro["raridade"] = "M" if C[outro["carta"]]["rar"] != "M" else "C"; outro["verificar"] = "SIM"
    json.dump(Lc, open(os.path.join(TMP, "ciclos.json"), "w", encoding="utf-8"), ensure_ascii=False)
    antes = open(os.path.join(ciclos.PASTA, "ciclos.json"), "rb").read()
    pasta0 = ciclos.PASTA
    ciclos.PASTA = TMP
    try:
        mud = ciclos.conferir(avisar=lambda *x: None)
    finally:
        ciclos.PASTA = pasta0
    Ld = {c["carta"]: c for c in json.load(open(os.path.join(TMP, "ciclos.json"), encoding="utf-8"))["cartas"]}
    R.ok("--conferir: raridade '?' preenchida pelo Scryfall e 'verificar' vira NÃO", Ld[alvo["carta"]]["raridade"] == C[alvo["carta"]]["rar"] and Ld[alvo["carta"]]["verificar"] == "NÃO")
    R.ok("--conferir: raridade diferente da do Scryfall fica SIM, com a divergência na observação", Ld[outro["carta"]]["verificar"] == "SIM" and "raridade no Scryfall" in Ld[outro["carta"]]["observacao"])
    R.ok("--conferir: só mexe nas linhas 'verificar = SIM'", all(c["verificar"] == "SIM" or c == next(x for x in L["cartas"] if x["carta"] == c["carta"]) for c in Ld.values() if c["carta"] in {alvo["carta"], outro["carta"]} or True) and len(mud) >= 2)
    R.ok("a lista do dono em dados/ciclos não mudou com o teste", open(os.path.join(ciclos.PASTA, "ciclos.json"), "rb").read() == antes)

# ---------------- 4. a página
html = os.path.join(comum.RAIZ, "saidas", ciclos.NOME + ".html")
if not a.sem_montar or not os.path.exists(html):
    r = subprocess.run([sys.executable, "-B", os.path.join(comum.MOTOR, "build.py"), "--ciclos"], capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        sys.exit("o build dos Ciclos falhou:\n" + r.stdout + r.stderr)
mb = os.path.getsize(html) / 1048576
R.ok("HTML dentro do orçamento (14 MB)", mb <= 14, "%.1f MB" % mb)
with open(html, encoding="utf-8") as f:
    txt = f.read()
PRECO = r"US\$|R\$|\"usd\"|usd_foil|\$\s?\d|(?<![Ss]em )preço"
R.ok("sem preço no HTML", not re.search(PRECO, txt), [m.group(0) for m in re.finditer(PRECO, txt)][:3])
refs = set(re.findall(r'"sp":\["([^"]+)"', txt))
pasta_img = os.path.join(comum.RAIZ, "saidas", "ciclos-img")
R.ok("imagens: fora do HTML, e toda folha citada existe em saidas/ciclos-img (menos de 500, o artefato guarda 511 arquivos)",
     "data:image/jpeg" not in txt and refs and all(os.path.exists(os.path.join(pasta_img, f)) for f in refs) and len(refs) < 500, len(refs))
R.ok("sem bracket nem estimação", not re.search(r"\bbracket\b|estimação", txt, re.I))   # "square brackets" do texto de cleave não conta
R.ok("as seis sub-abas com endereço no HTML", all(('href="#%s"' % t) in txt for t in ("ano", "colecao", "cores", "raridade", "decks", "pendencias")))
mono = next((x for x in G["ciclos"] if x["tipo"] == "Mono" and len(x["cartas"]) == 5 and all(C[n]["encontrada"] for n in x["cartas"])), None)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1360, "height": 1000})
    comum.bloquear_rede(pg)
    err = []
    pg.on("pageerror", lambda e: err.append(str(e)))
    pg.goto(comum.url(html)); pg.wait_for_function("!!window.CICLOS", timeout=30000); pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_function("!!window.CICLOS", timeout=30000); pg.wait_for_timeout(300)
    Dp = pg.evaluate("({cartas: Object.keys(CICLOS.cards).length, ciclos: CICLOS.ciclos.length, cols: CICLOS.colecoes.length, decks: CICLOS.decks.length})")
    R.ok("a página leva as cartas, os ciclos, as coleções e os decks do dado", Dp["cartas"] == len(C) and Dp["ciclos"] == len(G["ciclos"]) and Dp["cols"] == G["contagens"]["colecoes"] and Dp["decks"] == len(decks), Dp)
    for t in ("ano", "colecao", "cores", "raridade", "decks", "pendencias"):
        pg.evaluate("location.hash = '#%s'" % t); pg.wait_for_timeout(300)
        R.ok("sub-aba %s desenha" % t, pg.evaluate("document.querySelector('#c-corpo').children.length") > 0 and pg.get_attribute('#c-nav a[data-aba="%s"]' % t, "aria-current") == "page")
    if mono:
        pg.evaluate("location.hash = '#colecao=%s'" % mono["codigo"]); pg.wait_for_timeout(350)
        linha = pg.locator('#c-corpo .c-ciclo[data-ciclo="%s"]' % mono["k"].replace('"', '\\"'))
        cols = linha.locator(".c-vagas > .c-vaga").count()
        cores = pg.eval_on_selector_all('#c-corpo .c-ciclo[data-ciclo="%s"] .c-vagas > .c-vaga .c-vaga-c' % mono["k"].replace('"', '\\"'), "e => e.map(x => x.textContent.trim().slice(0, 1))")
        R.ok("Coleção: o ciclo mono é uma linha com as cinco cores na ordem W U B R G", linha.count() == 1 and cols == 5 and cores == ["W", "U", "B", "R", "G"], (cols, cores))
        R.ok("cada vaga da linha mostra a carta com imagem, grau e status", linha.locator(".c-carta").count() == 5 and linha.locator(".c-carta .c-grau").count() == 5 and linha.locator(".c-carta .g-st").count() == 5)
        pg.wait_for_timeout(600)
        ims = pg.eval_on_selector_all('#c-corpo .c-ciclo[data-ciclo="%s"] .c-sp img' % mono["k"].replace('"', '\\"'), "e => e.map(x => [x.naturalWidth, x.getAttribute('src')])")
        R.ok("imagens: a folha 2×2 no tamanho grande (1344 px) carrega em cada carta da linha", len(ims) == 5 and all(w == 1344 for w, _ in ims), ims[:2])
        topos = pg.eval_on_selector_all('#c-corpo .c-ciclo[data-ciclo="%s"] .c-vagas > .c-vaga > .c-vaga-c' % mono["k"].replace('"', '\\"'), "e => e.map(x => Math.round(x.getBoundingClientRect().top))")
        R.ok("as cinco cores começam na mesma altura", len(set(topos)) == 1, topos)
        multi = next((c for c in G["ciclos"] if c["tipo"] in ("Bicolor", "Tricolor") and len(c["cartas"]) >= 4), None)
        if multi:
            pg.evaluate("location.hash = '#colecao=%s'" % multi["codigo"]); pg.wait_for_timeout(500)
            tp = pg.eval_on_selector_all('#c-corpo .c-ciclo[data-ciclo="%s"] .c-vagas.livre .c-carta' % multi["k"].replace('"', '\\"'), "e => e.map(x => Math.round(x.getBoundingClientRect().top))")
            linhas = {}
            for t in tp:
                linhas.setdefault(min((k for k in linhas if abs(k - t) < 60), default=t), []).append(t)
            R.ok("ciclo de duas cores: as cartas de cada linha começam na mesma altura", tp and all(len(set(v)) == 1 for v in linhas.values()), tp)
        pg.click('#c-corpo .c-ciclo[data-ciclo="%s"] .c-carta >> nth=0' % mono["k"].replace('"', '\\"')); pg.wait_for_timeout(250)
        R.ok("gaveta: texto, critérios, onde está, onde rende, cabe em e os botões", pg.is_visible("#g-gav") and all(pg.locator("#g-gav h4", has_text=s).count() == 1 for s in ("Texto", "Critérios", "Onde já está", "Onde rende", "Cabe em", "Abrir")))
        hc = pg.get_attribute("#g-gav a.ouro", "href") or ""
        R.ok("o botão Consultar leva a carta à Consulta (#consultar=<carta>)", "Consulta" in hc and "#consultar=" in hc, hc)
        pg.keyboard.press("Escape"); pg.wait_for_timeout(100)
        R.ok("Esc fecha a gaveta", pg.is_hidden("#g-gav"))
    # Nos meus decks: só cartas que cabem no deck escolhido
    d0 = next((d for d in G["decks"] if not d.get("dj")), G["decks"][0])
    pg.evaluate("location.hash = '#decks=%s'" % d0["p"].replace("'", "\\'")); pg.wait_for_timeout(400)
    ok_deck = pg.evaluate("(p) => { var ns = [...document.querySelectorAll('#c-corpo .g-tbl tbody tr td.nm b')].map(b => b.textContent); return ns.length > 0 && ns.every(n => CICLOS.cards[n] && CICLOS.cards[n].cabe.indexOf(p) >= 0) && ns.length === Object.keys(CICLOS.cards).filter(n => CICLOS.cards[n].enc && CICLOS.cards[n].cabe.indexOf(p) >= 0).length; }", d0["p"])
    R.ok("Nos meus decks: a tabela traz todas e só as cartas que cabem no deck escolhido (%s)" % d0["p"], ok_deck)
    ganhos = pg.evaluate("(p) => [...document.querySelectorAll('#c-corpo .g-tbl tbody tr td.nm b')].map(b => { var r = (CICLOS.cards[b.textContent].rende || []).filter(x => x.p === p)[0]; return r ? r.g : -1e9; })", d0["p"])
    R.ok("Nos meus decks: a ordem padrão é pelo ganho naquele deck", ganhos == sorted(ganhos, reverse=True))
    # cores combináveis: só W → identidade dentro de W (ou incolor)
    pg.evaluate("location.hash = '#raridade=R'"); pg.wait_for_timeout(300)
    pg.click('#c-ferr .c-cores button[data-cor="W"]'); pg.wait_for_timeout(300)
    R.ok("filtro de cores: só W deixa as cartas de identidade branca ou incolor", pg.evaluate("[...document.querySelectorAll('#c-corpo .g-tbl tbody tr td.nm b')].every(b => /^W?$/.test(CICLOS.cards[b.textContent].ci))") and pg.is_visible("#c-limpar"))
    pg.click('#c-ferr .c-cores button[data-cor="B"]'); pg.wait_for_timeout(300)
    R.ok("filtro de cores: W e B juntos aceitam W, B, WB e incolor", pg.evaluate("[...document.querySelectorAll('#c-corpo .g-tbl tbody tr td.nm b')].every(b => /^[WB]*$/.test(CICLOS.cards[b.textContent].ci))"))
    pg.click("#c-limpar"); pg.wait_for_timeout(250)
    R.ok("Limpar filtros volta tudo e some", pg.is_hidden("#c-limpar"))
    pg.click('#c-ferr .g-seg[aria-label="Grau"] button[data-v="sem"]'); pg.wait_for_timeout(300)
    R.ok("filtro Grau 'Sem nota' deixa só cartas sem cadastro", pg.evaluate("[...document.querySelectorAll('#c-corpo .g-tbl tbody tr td.nm b')].every(b => !CICLOS.cards[b.textContent].grau)"))
    pg.click("#c-limpar"); pg.wait_for_timeout(200)
    pg.click("#c-pend"); pg.wait_for_timeout(300)
    R.ok("'só pendentes' deixa só as marcadas verificar ou não encontradas", pg.evaluate("[...document.querySelectorAll('#c-corpo .g-tbl tbody tr td.nm b')].every(b => CICLOS.cards[b.textContent].ver || !CICLOS.cards[b.textContent].enc)"))
    pg.click("#c-limpar"); pg.wait_for_timeout(200)
    # ordenar pelo cabeçalho e agrupar
    pg.click("#c-corpo .g-tbl th >> text=Carta"); pg.wait_for_timeout(250)
    az = pg.eval_on_selector_all("#c-corpo .g-tbl tbody tr td.nm b", "e => e.map(x => x.textContent)")
    R.ok("clique no cabeçalho Carta ordena de A a Z", [x[0].lower() for x in az] == sorted(x[0].lower() for x in az) and pg.get_attribute("#c-corpo .g-tbl th:has-text('Carta')", "aria-sort") == "ascending")
    pg.click('#c-ferr .g-agr button[data-v="colecao"]'); pg.wait_for_timeout(300)
    grupos = pg.locator("#c-corpo details.g-sf").count()
    R.ok("Agrupar por Coleção: uma sanfona por coleção, com Abrir e Fechar todos", grupos > 1 and pg.is_visible("#c-ab"))
    pg.click("#c-ab >> text=Fechar todos"); pg.wait_for_timeout(200)
    R.ok("Fechar todos recolhe os grupos", pg.locator("#c-corpo details.g-sf[open]").count() == 0)
    pg.click('#c-ferr .g-agr button[data-v="nenhum"]'); pg.wait_for_timeout(200)
    # Pendências lista as não encontradas e as marcadas verificar
    pg.evaluate("location.hash = '#pendencias'"); pg.wait_for_timeout(300)
    R.ok("Pendências: as não encontradas e as 'verificar' com as contagens do dado", ("(%d)" % G["contagens"]["nao_encontradas"]) in pg.inner_text("#c-corpo") and ("(%d)" % sum(1 for c in enc.values() if c["verificar"])) in pg.inner_text("#c-corpo"))
    pg.evaluate("localStorage.clear()")
    R.ok("sem erro de página", not err, err[:2])
    b.close()
R.fim()
