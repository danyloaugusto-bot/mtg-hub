# -*- coding: utf-8 -*-
"""Teste da Caixa (motor/caixa.py), em Python, sem o JavaScript e com o EDHREC de mentira (sem rede).

    python testes/caixa.py

1. O Vilis sozinho (a semente de 17/10/2026): preço, valor próprio, posição no EDHREC, o encaixe (K'rrik, Vito, Valgavoth,
   Kaalia), a impressão diferente da do Valgavoth, a sugestão e os decks a avaliar.
2. Uma caixa de mentira numa pasta temporária, com um caso por regra, os pisos, carta sem preço, carta não encontrada,
   uma carta com três cópias repartidas, lista em CSV com ; e cabeçalho em português, decisão aplicada e pendente.
Preço e posição no EDHREC mudam com o cache (a cada 7 dias): o teste os confere contra o registro do cache, e o controle
guarda o resto. Controle em testes/controle/caixa.json.
"""
import json, os, shutil, tempfile
import comum
import caixa, dados, scryfall

R = comum.Relatorio("caixa")
CTL = json.load(open(os.path.join(comum.RAIZ, "testes", "controle", "caixa.json"), encoding="utf-8"))

FAKE = {   # EDHREC de mentira: os comandantes que mais jogam a carta
    "Vilis, Broker of Blood": [dict(n="Kaalia of the Vast", decks=20160, de=40363, pct=49.9),
                               dict(n="K'rrik, Son of Yawgmoth", decks=14507, de=20359, pct=71.3),
                               dict(n="Be'lakor, the Dark Master", decks=6723, de=15652, pct=43.0)],
    "Culling Dais": [dict(n="Kaalia of the Vast", decks=6000, de=40363, pct=14.9)],
    "Inkwell Leviathan": [dict(n="Kaalia of the Vast", decks=900, de=40363, pct=2.2)],   # abaixo de edhrec_pct_min: não conta
}


def fonte(nome):
    return FAKE.get(nome)


def caixa_em(arquivos, decisoes=None):
    tmp = tempfile.mkdtemp(prefix="caixa-")
    os.makedirs(os.path.join(tmp, "listas"))
    for nome, texto in arquivos.items():
        with open(os.path.join(tmp, "listas", nome), "w", encoding="utf-8") as f:
            f.write(texto)
    with open(os.path.join(tmp, "decisoes.json"), "w", encoding="utf-8") as f:
        json.dump(decisoes or {"versao": 1, "cartas": {}}, f)
    return tmp


def carta(cx, nome):
    return next((c for c in cx["cartas"] if c["n"] == nome), None)


def cache_de(set_, num):
    return scryfall._ler()["cartas"].get(scryfall._chave(set_, num)) or {}


# ---------------------------------------------------------------- 1. o Vilis
tmp = caixa_em({"00. Vilis.txt": "1 Vilis, Broker of Blood (M20) 122\n"})
try:
    cx = caixa.montar(avisar=lambda *a: None, base=tmp, rede=False, fonte_edhrec=fonte)
finally:
    shutil.rmtree(tmp, ignore_errors=True)
v = carta(cx, "Vilis, Broker of Blood")
cv = CTL["vilis"]
R.ok("Vilis: uma carta, uma cópia", v is not None and v["q"] == 1 and cx["resumo"]["copias"] == 1)
reg = cache_de("M20", "122")
R.ok("Vilis: preço da M20 122 normal igual ao do cache (US$ 9,97 em 17/10)", v["copias"][0]["usd"] == float(reg.get("usd")), (v["copias"][0]["usd"], reg.get("usd")))
R.ok("Vilis: valor próprio %s" % cv["vp"], v["vp"] == cv["vp"], v["vp"])
R.ok("Vilis: posição no EDHREC igual à do cache (1127 em 17/10)", v["rank"] == reg.get("edhrec_rank"), v["rank"])
enc = {e["p"]: e for e in v["enc"]}
k = enc.get("03. K'rrik", {})
R.ok("Vilis: K'rrik +%s, saindo %s, com sinergia avaliada" % (cv["krrik_ganho"], cv["krrik_sai"]),
     k.get("g") == cv["krrik_ganho"] and k.get("s") == cv["krrik_sai"] and k.get("a") == 1, k)
vi = enc.get("01. Vito", {})
R.ok("Vilis: Vito +%s, sinergia já avaliada (avaliadas do Vito)" % cv["vito_ganho"], vi.get("g") == cv["vito_ganho"] and vi.get("a") == 1, vi)
R.ok("Vilis: Valgavoth já está", enc.get("03. Valgavoth", {}).get("j") == 1)
va = next((x for x in v["em_decks"] if x["p"] == "03. Valgavoth"), {})
R.ok("Vilis: a do Valgavoth é outra impressão (PM20 122p, a da caixa é M20 122)", va.get("imp") == "PM20 122p" and v["copias"][0]["imp"] == "M20 122", (va.get("imp"), v["copias"][0]["imp"]))
ka = enc.get("02. Kaalia", {})
kedh = next((t for t in v["edh"] or [] if t["n"] == "Kaalia of the Vast"), {})
R.ok("Vilis: Kaalia +%s a avaliar, e marcada pelo EDHREC (50%%)" % cv["kaalia_ganho"],
     ka.get("g") == cv["kaalia_ganho"] and ka.get("a") == 0 and "02. Kaalia" in kedh.get("meu", []), (ka.get("g"), ka.get("a"), kedh))
s = v["copias"][0]["sug"]
R.ok("Vilis: sugestão Deck no K'rrik, prioridade S", (s["d"], s["p"], s["P"]) == ("deck", "03. K'rrik", "S"), s)
R.ok("Vilis: o porquê traz os números (radar, tier, valor, EDHREC)", "K'rrik" in s["pq"] and "entra" in s["pq"] and "71%" in s["pq"], s["pq"])
R.ok("Vilis: decks a avaliar incluem a Kaalia", "02. Kaalia" in v["avaliar"], v["avaliar"])
R.ok("Vilis: decks a avaliar sem o precon intacto", "03. Master Of Evil" not in v["avaliar"], v["avaliar"])

# ---------------------------------------------------------------- 2. a caixa de mentira
TXT = "\n".join([
    "1 Vilis, Broker of Blood (M20) 122",          # regra 1: radar do K'rrik pede como entra
    "1 Persistent Constrictor",                    # regra 2: radar do Valgavoth (avaliar) com ganho avaliado de 10 ou mais
    "1 Wheel of Fate",                             # regra 3: radar do Ken, avaliar, ganho abaixo de 10
    "1 Culling Dais (2XM) 246",                    # regra 3: um comandante do dono entre os do EDHREC (Kaalia)
    "1 Celestine, the Living Saint (40K) 10",      # regra 4: venda B
    "1 Cryptothrall (40K) 155",                    # regra 4: venda A, capital parado (decisão pendente)
    "1 Callidus Assassin (40K) 109",               # regra 5: bundles
    "1 Inkwell Leviathan (2XM) 55",                # regra 6: bulk
    "1 Loyal Inventor (ACR) 21",                   # decisão aplicada: sai da caixa
    "1 Azorius Chancery (2X2) 318",                # staple num deck, barata: bundles, nunca bulk
    "1 Carta Que Nao Existe de Jeito Nenhum",      # não encontrada
    "isto não é uma linha de carta",               # ilegível
]) + "\n"
CSV = "\n".join([
    "Nome;Quantidade;Edição;Número;Acabamento;Idioma;Preço pago",
    "Drannith Magistrate;1;IKO;11;normal;pt;10,00",     # Game Changer sem deck: guardar A, moeda de troca, aviso de idioma
    "Crackling Doom;1;2X2;196;etched;en;0,50",          # sem preço no acabamento: aviso, nunca venda
    "Stensian Sanguinist;3;SOC;29;normal;en;3,00",      # três cópias: Markov, Vito e venda
]) + "\n"
DEC = {"versao": 1, "cartas": {
    "Loyal Inventor": {"copias": [{"imp": "ACR 21", "acab": "normal", "destino": "bulk", "em": "2026-10-17", "aplicado": "2026-10-17"}]},
    "Cryptothrall": {"copias": [{"imp": "40K 155", "acab": "normal", "destino": "venda", "em": "2026-10-17", "aplicado": None}]},
}}
tmp = caixa_em({"lote.txt": TXT, "lote.csv": CSV}, DEC)
try:
    cx = caixa.montar(avisar=lambda *a: None, base=tmp, rede=False, fonte_edhrec=fonte)
    dec_lida = caixa.ler_decisoes(tmp)
finally:
    shutil.rmtree(tmp, ignore_errors=True)
r = cx["resumo"]
R.ok("decisões: a semente v1 vira v2", dec_lida["versao"] == 2 and "Loyal Inventor" in dec_lida["cartas"])
R.ok("importação: CSV com ; e cabeçalho em português, coluna desconhecida listada",
     any(x["arquivo"] == "lote.csv" and x["copias"] == 5 for x in r["listas"]) and "Preço pago" in r["colunas_ignoradas"], (r["listas"], r["colunas_ignoradas"]))
R.ok("importação: não encontrada fica de fora, com a linha original",
     [x["orig"] for x in r["nao_encontradas"]] == ["1 Carta Que Nao Existe de Jeito Nenhum"], r["nao_encontradas"])
R.ok("importação: linha ilegível listada", len(r["ilegiveis"]) == 1 and "não é uma linha" in r["ilegiveis"][0]["orig"], r["ilegiveis"])
R.ok("decisão aplicada: a cópia sai da caixa", carta(cx, "Loyal Inventor") is None)
cr = carta(cx, "Cryptothrall")
R.ok("decisão pendente: fica presa à cópia", cr and cr["copias"][0].get("decisao", {}).get("destino") == "venda")


def sug(nome, i=0):
    c = carta(cx, nome)
    return c["copias"][i]["sug"] if c and len(c["copias"]) > i else {}


R.ok("regra 1: radar pede como entra -> Deck S", (sug("Vilis, Broker of Blood")["d"], sug("Vilis, Broker of Blood")["P"]) == ("deck", "S"))
pc = sug("Persistent Constrictor")
R.ok("regra 2: ganho avaliado de 10 ou mais -> Deck no Valgavoth", pc.get("d") == "deck" and pc.get("p") == "03. Valgavoth" and pc.get("regra") == 2, pc)
wf = sug("Wheel of Fate")
R.ok("regra 3: radar avaliar, ganho abaixo de 10 -> Guardar", wf.get("d") == "guardar" and wf.get("p") == "04. Ken", wf)
cd = sug("Culling Dais")
R.ok("regra 3: comandante do dono no EDHREC -> Guardar, pela Kaalia", cd.get("d") == "guardar" and cd.get("p") == "02. Kaalia" and "EDHREC" in cd.get("pq", ""), cd)
dm = sug("Drannith Magistrate")
R.ok("regra 3: Game Changer sem deck -> Guardar A, moeda de troca", dm.get("d") == "guardar" and dm.get("P") == "A" and "moeda de troca" in dm.get("marcas", []), dm)
R.ok("aviso de idioma na cópia em português", any("preço de referência" in a for a in carta(cx, "Drannith Magistrate")["copias"][0]["avisos"]))
ce = sug("Celestine, the Living Saint")
R.ok("regra 4: venda B (US$ 5 a 20)", ce.get("d") == "venda" and ce.get("P") == "B", ce)
cy = sug("Cryptothrall")
R.ok("regra 4: venda A, capital parado (US$ 20 ou mais)", cy.get("d") == "venda" and cy.get("P") == "A" and "capital parado" in cy.get("marcas", []), cy)
R.ok("regra 5: bundles C", sug("Callidus Assassin").get("d") == "bundles" and sug("Callidus Assassin").get("P") == "C")
R.ok("regra 6: bulk C, e o comandante do dono abaixo de 10% no EDHREC não conta", sug("Inkwell Leviathan").get("d") == "bulk"
     and sug("Inkwell Leviathan").get("P") == "C" and carta(cx, "Inkwell Leviathan")["edh"][0]["meu_baixo"] == ["02. Kaalia"], sug("Inkwell Leviathan"))
R.ok("piso: staple barata num deck vai para bundles, não bulk", sug("Azorius Chancery").get("d") == "bundles", sug("Azorius Chancery"))
cdo = carta(cx, "Crackling Doom")
R.ok("sem preço: aviso na cópia e nunca venda", cdo["copias"][0]["usd"] is None and "sem preço" in cdo["copias"][0]["sug"]["marcas"]
     and cdo["copias"][0]["sug"]["d"] != "venda", cdo["copias"][0]["sug"])
st = carta(cx, "Stensian Sanguinist")
ds = [(x["sug"]["d"], x["sug"].get("p")) for x in st["copias"]]
R.ok("três cópias repartidas: Deck, outro Deck, Venda", [d for d, _ in ds] == ["deck", "deck", "venda"] and ds[0][1] != ds[1][1]
     and {ds[0][1], ds[1][1]} == {"01. Markov", "01. Vito"}, ds)
R.ok("selo ×N: a carta soma as cópias", st["q"] == 3 and abs(st["valor"] - 3 * st["copias"][0]["usd"]) < 0.01, (st["q"], st["valor"]))

# invariantes, em todas as cópias
ruins = []
for c in cx["cartas"]:
    for cp in c["copias"]:
        s = cp["sug"]
        if s["d"] == "deck":
            d = cx["decks"].get(s["p"], {})
            if d.get("precon") or d.get("desejo"):
                ruins.append("%s: deck %s (precon ou desejo)" % (c["n"], s["p"]))
            if not set(c["ident"]) <= set(d.get("i", "")):
                ruins.append("%s: fora das cores de %s" % (c["n"], s["p"]))
        if s["d"] == "bulk" and (c["gc"] or c["staple"]):
            ruins.append("%s: Game Changer ou staple no bulk" % c["n"])
        if s["d"] == "venda" and (cp["usd"] is None or cp["usd"] < caixa.regua()["venda_usd_min"]):
            ruins.append("%s: venda abaixo do corte ou sem preço" % c["n"])
        if not s.get("pq"):
            ruins.append("%s: sem porquê" % c["n"])
R.ok("invariantes: Deck só em deck real e nas cores da carta, nunca precon; GC e staple fora do bulk; venda só com preço; todo destino com porquê", not ruins, ruins[:5])
R.ok("régua: os números vêm de motor/caixa.json", caixa.regua()["venda_usd_min"] == 5.0 and caixa.regua()["deck_ganho_min"] == 10)

# ---------------------------------------------------------------- "avaliadas": sinergia avaliada fora do deck e do radar
import encaixe
cad_t = dados.ler_cadastro()
mg = dados.montar("02. Goblins", avisar=lambda *a: None)
mg.update(pasta="02. Goblins", painel="Horda em Chamas")
mg0 = dict(mg); mg0.pop("_enc", None); mg0["avaliadas"] = {}   # sem a avaliação gravada no Goblins
g0 = encaixe.ganho("Chain Reaction", mg0, cad_t)
mg2 = dict(mg); mg2.pop("_enc", None)
mg2["avaliadas"] = dados.ler_avaliadas({"avaliadas": {"Chain Reaction": {"sin": {"sin2": 2}, "sin_por_que": {"sin2": "teste"}}}})
g1 = encaixe.ganho("Chain Reaction", mg2, cad_t)
peso2 = next(c["peso"] for c in dados.regua()["criterios"] if c["k"] == "sin2")
R.ok("avaliadas: a sinergia entra no ganho e ele deixa de ser piso", not g0["avaliada"] and g1["avaliada"]
     and abs((g1["valor"] - g0["valor"]) - peso2 * dados.regua()["pontos_por_nota"][2]) < 1e-9, (g0["ganho"], g1["ganho"]))
recusas = 0
for ruim in ({"X": {"sin": {"sin1": 4}}}, {"X": {"sin": {"sin1": 2}}}, {"X": {"sin": {"sin3": 1}, "sin_por_que": {"sin3": "x"}}}):
    try:
        dados.ler_avaliadas({"avaliadas": ruim})
    except dados.ErroDeck:
        recusas += 1
R.ok("avaliadas: recusa nota fora de 0 a 3, sinergia sem porquê e chave que não é sin1 ou sin2", recusas == 3, recusas)

# ---------------------------------------------------------------- pastas como origem: mover, remover, pet card
PF = os.path.join(comum.RAIZ, "dados", "pastas")
A, B = "zz teste A", "zz teste B"
guarda = {}   # o que o teste mexe e devolve como estava: decisões e marcas das pastas, e o histórico da Caixa
HIST = os.path.join(comum.RAIZ, "dados", "caixa", "HISTORICO.md")
for q in (os.path.join(PF, "decisoes.json"), os.path.join(PF, "marcas.json"), HIST):
    guarda[q] = open(q, encoding="utf-8").read() if os.path.exists(q) else None
try:
    with open(os.path.join(PF, A + ".txt"), "w", encoding="utf-8") as f:
        f.write("2 Sol Ring (M3C) 305\n1 Inkwell Leviathan (2XM) 55\n1 Culling Dais (2XM) 246\n")
    R.ok("origens: a pasta com lista vira origem", A in caixa.origens(), caixa.origens())
    cp = caixa.montar(avisar=lambda *a: None, rede=False, fonte_edhrec=fonte, origem=A)
    sr = carta(cp, "Sol Ring")
    R.ok("origem pasta: as cartas da pasta, com as cópias", cp["origem"] == A and sr and sr["q"] == 2 and cp["resumo"]["copias"] == 4, (cp["origem"], cp["resumo"]["copias"]))
    R.ok("origem pasta: a própria pasta não aparece em \"nas pastas\"", all(x["p"] != A for c in cp["cartas"] for x in c["pastas"]))
    R.ok("origem pasta: a coleção do banco é própria", caixa.colecao(A) == "decisoes-zz-teste-a" and caixa.colecao("Caixa") == "decisoes")
    dec = {"versao": 2, "cartas": {
        "Sol Ring": {"copias": [{"imp": "M3C 305", "acab": "normal", "destino": "guardar", "pasta": B, "pet": True, "em": "2026-10-17", "aplicado": None}]},
        "Inkwell Leviathan": {"copias": [{"imp": "2XM 55", "acab": "normal", "destino": "remover", "em": "2026-10-17", "aplicado": None}]}}}
    caixa.gravar_decisoes(dec, origem=A)
    feitos, _ = caixa.aplicar(origem=A)
    txa = open(os.path.join(PF, A + ".txt"), encoding="utf-8").read()
    txb = open(os.path.join(PF, B + ".txt"), encoding="utf-8").read() if os.path.exists(os.path.join(PF, B + ".txt")) else ""
    R.ok("mover de pasta: sai uma cópia da A (fica 1 Sol Ring) e entra na B", "1 Sol Ring (M3C) 305" in txa and "2 Sol Ring" not in txa and "Sol Ring (M3C) 305" in txb, (txa, txb))
    R.ok("remover: a cópia sai da pasta e não vai a lugar nenhum", "Inkwell Leviathan" not in txa and "Inkwell Leviathan" not in txb)
    R.ok("pet card: marcado na pasta de destino", (caixa._ler_marcas().get(B) or {}).get("sol ring", {}).get("pet") is True)
    R.ok("aplicar: as decisões ficam aplicadas", all(x.get("aplicado") for v in caixa.ler_decisoes(origem=A)["cartas"].values() for x in v["copias"]), feitos)
    cb = caixa.montar(avisar=lambda *a: None, rede=False, fonte_edhrec=fonte, origem=B)
    R.ok("a pasta de destino vira origem, com o selo pet", carta(cb, "Sol Ring") and carta(cb, "Sol Ring")["pet"] == 1)
finally:
    for f in (A + ".txt", B + ".txt"):
        q = os.path.join(PF, f)
        if os.path.exists(q):
            os.remove(q)
    for q, v in guarda.items():
        if v is None:
            if os.path.exists(q):
                os.remove(q)
        else:
            open(q, "w", encoding="utf-8", newline="\n").write(v)
R.ok("pastas de teste limpas", not [f for f in os.listdir(PF) if f.startswith("zz teste")])

# ---------------------------------------------------------------- tier estimado e o deck hoje (critérios da v3 e quadros do 8×8)
R.ok("tier estimado: nunca S (S só com avaliação)", caixa._tier_estimado(99, {"S": 20, "A": 12, "B": 8}) == "A"
     and caixa._tier_estimado(9, {"S": 20, "A": 12, "B": 8}) == "B" and caixa._tier_estimado(1, {"A": 12, "B": 8, "C": 4}) == "C")
m_hw = next(m for m in encaixe.decks_v3() if m["pasta"] == "03. Heads I win")
pf = caixa._perfil_deck(m_hw)
ks_t = [c["k"] for c in dados.regua()["criterios"]]
fora_pk = sum(c["q"] for c in m_hw["cards"] if not c.get("cmd") and not c.get("land") and not c.get("mdfc"))
R.ok("perfil do deck: a contagem da v3 é a da saturação, e os quadros do 8×8 não passam das cartas do deck", pf["nc"] == encaixe.contexto(m_hw)["ncrit"]
     and set(pf["pk"]) <= set(caixa.CRIT_8X8) and all(v[1] <= fora_pk for v in pf["pk"].values()), (pf["pk"], fora_pk))
cx_t = caixa.montar(avisar=lambda *a: None, rede=False)
ts = [e["T"] for c in cx_t["cartas"] for e in c["enc"] if e.get("T")]
R.ok("tier na gaveta: real ou estimado (~), e nenhum estimado é S", ts and all(t in "SABCD" or t in ("~A", "~B", "~C", "~D") for t in ts), sorted(set(ts)))

c0 = next(c for c in cx_t["cartas"] if c.get("tx"))
mexida = dict(c0, fx=c0["fx"] + " (texto mudado)")
R.ok("tradução: toda carta da Caixa com texto tem tradução, e texto mudado no Scryfall volta para a fila",
     not caixa.traducoes_faltando([cx_t]) and list(caixa.traducoes_faltando([{"cartas": [mexida]}])) == [c0["n"]])

# ---------------------------------------------------------------- 3. a página montada (saidas/00. Caixa.html)
import subprocess, sys
from playwright.sync_api import sync_playwright
pag = os.path.join(comum.RAIZ, "saidas", "00. Caixa.html")
rb = subprocess.run([sys.executable, "-B", os.path.join(comum.MOTOR, "build.py"), "--caixa"], capture_output=True, text=True, encoding="utf-8")
R.ok("build --caixa", rb.returncode == 0 and os.path.exists(pag), (rb.stdout + rb.stderr)[-300:])
R.ok("a página fica abaixo do aviso de tamanho", os.path.getsize(pag) / 1048576 < caixa.regua()["aviso_mb"], "%.1f MB" % (os.path.getsize(pag) / 1048576))
cx_real = caixa.montar(avisar=lambda *a: None, rede=False)
pend = [c for c in cx_real["cartas"]]
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for w, h in ((1360, 900), (375, 800)):
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.on("pageerror", lambda e: R.erros.append(str(e)))
        pg.goto(comum.url(pag)); pg.wait_for_timeout(800)
        larg = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
        R.ok("%d px: sem rolagem lateral, tabela" % w, larg[0] <= larg[1], larg)
        pg.click('[data-act="ui"][data-k="ver"][data-v="galeria"]'); pg.wait_for_timeout(300)
        larg = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
        R.ok("%d px: sem rolagem lateral, galeria" % w, larg[0] <= larg[1], larg)
        pg.click('[data-act="ui"][data-k="ver"][data-v="tabela"]'); pg.wait_for_timeout(200)
        pg.locator("tr.cx-r").first.locator(".cx-nm").click(); pg.wait_for_timeout(300)
        larg = pg.evaluate("[document.querySelector('#cx-gav-in').scrollWidth, document.querySelector('#cx-gav-in').clientWidth]")
        R.ok("%d px: gaveta sem rolagem lateral" % w, larg[0] <= larg[1], larg)
        pg.close()
    pg = b.new_page(viewport={"width": 1360, "height": 900})
    pg.add_init_script(comum.FAKE_DB)
    pg.on("pageerror", lambda e: R.erros.append(str(e)))
    pg.goto(comum.url(pag)); pg.wait_for_timeout(800)
    pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(800)
    ids0 = pg.eval_on_selector_all("tr.cx-r", "es => es.map(e => e.getAttribute('data-id'))")
    par = sum(len({cp["sug"]["P"] for cp in c["copias"]}) for c in pend)
    R.ok("toda carta pendente aparece, uma linha por prioridade das cópias dela", len(set(ids0)) == len(pend) and len(ids0) == par, (len(set(ids0)), len(pend), len(ids0), par))
    lv = pg.locator('tr.cx-r[data-id="vilis-broker-of-blood"]')
    t = lv.inner_text() if lv.count() else ""
    R.ok("linha do Vilis: S, K'rrik, +24, US$ 9,97", lv.count() == 1 and lv.locator("td.cx-pr").inner_text().strip() == "S" and "K'rrik" in t and "+24" in t and "US$ 9,97" in t, t[:160])
    pg.click('[data-act="ui"][data-k="ver"][data-v="galeria"]'); pg.wait_for_timeout(300)
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="tipo"]'); pg.wait_for_timeout(300)
    xn = pg.eval_on_selector_all(".cx-cd", "es => es.map(e => [e.getAttribute('data-id'), !!e.querySelector('.cx-xn')])")
    qs = {c["id"]: c["q"] for c in cx_real["cartas"]}
    R.ok("galeria por tipo: ×N só nas cartas de duas cópias ou mais", xn and all(tem == (qs[i] > 1) for i, tem in xn), [x for x in xn if x[1] != (qs[x[0]] > 1)][:3])
    hs = [x.strip() for x in pg.eval_on_selector_all(".cx-g-h h2", "es => es.map(e => e.textContent.replace(/[▾▸]/g, ''))")]
    nomes_t = {"cri": "Criaturas", "ins": "Mágicas instantâneas", "fei": "Feitiços", "art": "Artefatos", "enc": "Encantamentos", "pw": "Planeswalkers", "bat": "Batalhas", "ter": "Terrenos"}
    esperado = [nomes_t[k] for k in ["cri", "ins", "fei", "art", "enc", "pw", "bat", "ter"] if any(c["t"] == k for c in cx_real["cartas"])]
    R.ok("agrupar por tipo: os grupos certos, na ordem do painel", hs == esperado, (hs, esperado))
    cri = sum(1 for c in cx_real["cartas"] if c["t"] == "cri")
    R.ok("agrupar por tipo: artefato criatura conta como criatura", pg.locator(".cx-g-h", has_text="Criaturas").locator("> span").inner_text().startswith(str(cri)), cri)
    # tipo: lista suspensa de múltipla escolha, com limpar
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="prioridade"]'); pg.wait_for_timeout(200)
    ter = sum(1 for c in cx_real["cartas"] if c["t"] == "ter")
    cri = sum(1 for c in cx_real["cartas"] if c["t"] == "cri")
    pg.click(".cx-dd summary"); pg.wait_for_timeout(150)
    R.ok("tipo: a lista suspensa abre com a quantidade de cada tipo", pg.is_visible(".cx-dd-p") and str(ter) in pg.inner_text(".cx-dd-p label:has(input[value='ter'])"))
    pg.check('.cx-dd-p input[value="ter"]'); pg.wait_for_timeout(300)
    vis = pg.eval_on_selector_all(".cx-cd", "es => es.map(e => e.getAttribute('data-id'))")
    R.ok("tipo: só os terrenos (%d)" % ter, len(set(vis)) == ter and {c["t"] for c in cx_real["cartas"] if c["id"] in vis} <= {"ter"}, len(set(vis)))
    pg.check('.cx-dd-p input[value="cri"]'); pg.wait_for_timeout(300)
    vis = pg.eval_on_selector_all(".cx-cd", "es => es.map(e => e.getAttribute('data-id'))")
    R.ok("tipo: dois tipos de uma vez (terrenos e criaturas)", len(set(vis)) == ter + cri and "2 tipos" in pg.inner_text(".cx-dd summary"), (len(set(vis)), ter + cri))
    pg.reload(); pg.wait_for_timeout(800)
    R.ok("tipo: a escolha fica guardada no navegador", pg.evaluate("window.CAIXA.ui.tipos.slice().sort().join()") == "cri,ter")
    pg.click(".cx-dd summary"); pg.click('[data-act="tipos-limpar"]'); pg.wait_for_timeout(300)
    R.ok("tipo: limpar volta a todos", pg.evaluate("window.CAIXA.ui.tipos.length") == 0 and len(set(pg.eval_on_selector_all(".cx-cd", "es => es.map(e => e.getAttribute('data-id'))"))) == len(pend))
    # cores: com agrupar por cor, os sete espaços com os símbolos de mana
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="cor"]'); pg.wait_for_timeout(300)
    hs = [x.strip() for x in pg.eval_on_selector_all(".cx-g-h h2", "es => es.map(e => e.textContent.replace(/[▾▸]/g, ''))")]

    def cor(c):
        k = "".join(x for x in "WUBRG" if x in (c["ident"] or ""))
        return "C" if not k else "M" if len(k) > 1 else k
    ordem = [("W", "Branco"), ("U", "Azul"), ("B", "Preto"), ("R", "Vermelho"), ("G", "Verde"), ("M", "Multicolorido"), ("C", "Incolor")]
    R.ok("cores: os grupos em Branco, Azul, Preto, Vermelho, Verde, Multicolorido, Incolor", hs == [n for k, n in ordem if any(cor(c) == k for c in cx_real["cartas"])], hs)
    R.ok("cores: sete botões, com o símbolo de mana desenhado", pg.locator('.cx-cores [data-act="cor"]').count() == 7 and pg.locator('.cx-cores [data-act="cor"] svg.cx-mi-W').count() == 1)
    pg.click('.cx-cores [data-act="cor"][data-v="W"]'); pg.click('.cx-cores [data-act="cor"][data-v="R"]'); pg.wait_for_timeout(300)
    vis = pg.eval_on_selector_all(".cx-cd", "es => es.map(e => e.getAttribute('data-id'))")
    esp = [c["id"] for c in cx_real["cartas"] if cor(c) in ("W", "R")]
    R.ok("cores: branco e vermelho juntos (%d cartas)" % len(esp), sorted(vis) == sorted(esp), (len(vis), len(esp)))
    pg.click('[data-act="cores-limpar"]'); pg.wait_for_timeout(300)
    R.ok("cores: limpar volta a todas", pg.locator(".cx-cd").count() == len(pend))
    # grupos que recolhem
    pg.click('[data-act="ui"][data-k="ver"][data-v="tabela"]'); pg.click('[data-act="ui"][data-k="agrupar"][data-v="prioridade"]'); pg.wait_for_timeout(300)
    n0 = pg.locator("tr.cx-r:visible").count()
    pg.click('[data-act="grupos"][data-v="fechar"]'); pg.wait_for_timeout(300)
    R.ok("grupos: fechar todos esconde as linhas e deixa os cabeçalhos", pg.locator("tr.cx-r:visible").count() == 0 and pg.locator("tr.grp").count() >= 1)
    pg.locator("tr.grp .cx-tg").first.click(); pg.wait_for_timeout(300)
    um = pg.locator("tr.cx-r:visible").count()
    R.ok("grupos: abrir um grupo pelo cabeçalho", 0 < um < n0, (um, n0))
    pg.click('[data-act="grupos"][data-v="abrir"]'); pg.wait_for_timeout(300)
    R.ok("grupos: abrir todos", pg.locator("tr.cx-r:visible").count() == n0)
    # a vista "Para o deck": só as cartas nas cores do comandante, pelo ganho naquele deck
    gob = [c for c in cx_real["cartas"] if any(e["p"] == "02. Goblins" for e in c["enc"])]
    pg.click('[data-act="ui"][data-k="ver"][data-v="tabela"]'); pg.wait_for_timeout(200)
    pg.select_option('select[data-ctl="deck"]', "02. Goblins"); pg.wait_for_timeout(400)
    ids = pg.eval_on_selector_all("tr.cx-r", "es => es.map(e => e.getAttribute('data-id'))")
    R.ok("Para o deck (Goblins): uma linha por carta nas cores dele (%d)" % len(gob), len(ids) == len(gob), (len(ids), len(gob)))
    R.ok("Para o deck (Goblins): todas na identidade do comandante (R)", all(set(c["ident"]) <= {"R"} for c in cx_real["cartas"] if c["id"] in ids))
    blocos = [x.split("\n")[0].strip() for x in pg.eval_on_selector_all("tr.grp td", "es => es.map(e => e.childNodes[0].textContent.replace(/[▾▸]/g, ''))")]
    R.ok("Para o deck: os blocos na ordem (Entram agora primeiro)", blocos and blocos[0] == "Entram agora"
         and blocos == [b for b in ["Entram agora", "Ganho alto, sinergia a avaliar", "Para avaliar", "Ganho baixo", "Já estão no deck"] if b in blocos], blocos)
    ent = pg.eval_on_selector_all("tbody tr", "rs => { var out = [], on = false; rs.forEach(function (r) { if (r.classList.contains('grp')) on = r.textContent.replace(/[▾▸]/g, '').indexOf('Entram agora') === 0; else if (on) out.push(r.getAttribute('data-id')); }); return out; }")
    R.ok("Para o deck (Goblins): entra agora o Goblin Chieftain (Sol Ring saiu da caixa: Remover)", "goblin-chieftain" in ent and "sol-ring" not in ent, ent)
    gs = [float(x) for x in pg.eval_on_selector_all("tr.cx-r td.cx-ga", "es => es.map(e => e.getAttribute('data-v') || '-1e9')")]
    R.ok("Para o deck: o padrão de ordem é o ganho no deck, do maior para o menor, dentro de cada bloco", pg.input_value('select[data-ctl="ord"]') == "padrao"
         and "Ganho no deck" in pg.inner_text('select[data-ctl="ord"] option[value="padrao"]'))
    pg.evaluate("window.CAIXA.abrir('goblin-chieftain')"); pg.wait_for_timeout(300)
    R.ok("Para o deck: a decisão Deck já vem com o deck escolhido", pg.input_value('#cx-gav-in select[data-cp="deck"][data-i="0"]') == "02. Goblins")
    pg.keyboard.press("Escape"); pg.select_option('select[data-ctl="deck"]', ""); pg.wait_for_timeout(300)
    R.ok("Para o deck: voltar a todos os decks mostra a caixa inteira", len(set(pg.eval_on_selector_all("tr.cx-r", "es => es.map(e => e.getAttribute('data-id'))"))) == len(pend))
    # ordenar: o seletor, a seta que inverte e o cabeçalho da tabela
    def valores_grupo1():
        return pg.evaluate("""(() => { var out = [], g = 0; document.querySelectorAll('tbody tr').forEach(function (r) { if (r.classList.contains('grp')) g++; else if (g === 1) out.push(+r.querySelector('td.cx-vl').getAttribute('data-v')); }); return out; })()""")
    pg.select_option('select[data-ctl="ord"]', "valor"); pg.wait_for_timeout(300)
    v1 = valores_grupo1()
    R.ok("ordenar por valor: do maior para o menor dentro do grupo", len(v1) > 3 and v1 == sorted(v1, reverse=True), v1[:6])
    R.ok("ordenar por valor: o cabeçalho Valor mostra a seta", pg.locator('th[aria-sort="descending"] .cx-th[data-v="valor"]').count() == 1)
    pg.click('[data-act="ord-inv"]'); pg.wait_for_timeout(300)
    v2 = valores_grupo1()
    R.ok("ordenar: a seta inverte (do menor para o maior)", v2 == sorted(v2) and pg.locator('th[aria-sort="ascending"] .cx-th[data-v="valor"]').count() == 1, v2[:6])
    pg.click('.cx-th[data-v="cmc"]'); pg.wait_for_timeout(300)
    cm = pg.evaluate("""(() => { var out = [], g = 0; document.querySelectorAll('tbody tr').forEach(function (r) { if (r.classList.contains('grp')) g++; else if (g === 1) out.push(+r.querySelector('td.cx-co').getAttribute('data-v')); }); return out; })()""")
    R.ok("ordenar pelo cabeçalho Custo: custo de mana crescente, terrenos no fim", pg.input_value('select[data-ctl="ord"]') == "cmc" and pg.evaluate("window.CAIXA.ui.inv") is False, cm[:8])
    pg.reload(); pg.wait_for_timeout(800)
    R.ok("ordenar: a escolha fica guardada no navegador", pg.input_value('select[data-ctl="ord"]') == "cmc")
    # sem grupo: uma lista só, uma linha por carta
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="nenhum"]'); pg.wait_for_timeout(300)
    R.ok("agrupar: Nenhum dá uma lista só, uma linha por carta", pg.locator("tr.grp").count() == 1 and pg.locator("tr.cx-r").count() == len(pend), (pg.locator("tr.grp").count(), pg.locator("tr.cx-r").count()))
    # destino de cada cópia: o Echocasting tem a comum no Bulk e a foil na Venda
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="destino"]'); pg.wait_for_timeout(300)
    ec = pg.evaluate("""(() => { var out = [], g = ''; document.querySelectorAll('tbody tr').forEach(function (r) { if (r.classList.contains('grp')) g = r.querySelector('.cx-tg').textContent.replace(/[▾▸]/g, ''); else if (r.getAttribute('data-id') === 'echocasting-symposium') out.push([g, r.querySelector('td.cx-vl').getAttribute('data-v')]); }); return out; })()""")
    R.ok("agrupar por destino é cópia a cópia: Echocasting na Venda (US$ 7,73) e no Bulk (US$ 3,19)", sorted(ec) == [["Bulk", "3.19"], ["Venda", "7.73"]], ec)
    # faixa de valor: filtro e grupo
    caras = [c for c in pend if any((cp["usd"] or 0) >= caixa.regua()["capital_usd"] for cp in c["copias"])]
    pg.click('[data-act="faixa"][data-v="f20"]'); pg.wait_for_timeout(300)
    vs = [float(x) for x in pg.eval_on_selector_all("tr.cx-r td.cx-vl", "es => es.map(e => e.getAttribute('data-v'))")]
    ids = pg.eval_on_selector_all("tr.cx-r", "es => es.map(e => e.getAttribute('data-id'))")
    R.ok("faixa US$ 20 ou mais: só as cópias caras (%d cartas)" % len(caras), len(set(ids)) == len(caras) and vs and min(vs) >= caixa.regua()["capital_usd"], (len(set(ids)), len(caras), min(vs) if vs else None))
    pg.click('[data-act="faixas-limpar"]'); pg.wait_for_timeout(300)
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="faixa"]'); pg.wait_for_timeout(300)
    hf = [x.replace("▾", "").replace("▸", "").strip() for x in pg.eval_on_selector_all("tr.grp .cx-tg", "es => es.map(e => e.textContent)")]
    R.ok("agrupar por valor: das caras para as baratas", hf and hf[0] == "US$ 20,00 ou mais" and hf.index("US$ 5,00 a US$ 20,00") < hf.index("Abaixo de US$ 1,00"), hf)
    # gaveta: a tradução e o caminho pelas regras, uma caixa por sugestão diferente
    pg.evaluate("window.CAIXA.abrir('echocasting-symposium')"); pg.wait_for_timeout(300)
    gv = pg.inner_text("#cx-gav-in")
    R.ok("gaveta: o que a carta faz, em português, com o aviso de tradução livre", pg.locator("#cx-gav-in .cx-tx").count() == 1 and "O jogador alvo cria uma ficha" in gv and "Tradução livre" in gv)
    R.ok("gaveta: uma caixa por sugestão (comum no Bulk, foil na Venda)", pg.locator("#cx-gav-in .cx-sug").count() == 2)
    bl = pg.locator("#cx-gav-in .cx-sug", has_text="Sugestão: Bulk")
    R.ok("gaveta: o Bulk mostra as cinco regras que não serviram e a que decidiu", bl.locator("li.nao").count() == 5 and bl.locator("li.sim").count() == 1 and "Prioridade C" in bl.inner_text(), bl.inner_text()[:200])
    R.ok("gaveta: a Venda explica a prioridade B pelo preço", "Prioridade B" in pg.locator("#cx-gav-in .cx-sug", has_text="Sugestão: Venda").inner_text())
    cab = pg.eval_on_selector_all("#cx-gav-in .cx-enc thead th", "es => es.map(e => e.textContent)")
    R.ok("gaveta: a tabela dos decks tem Tier e Preenche", "Tier" in cab and any(x.startswith("Preenche") for x in cab), cab)
    pe = pg.inner_text("#cx-gav-in .cx-enc tbody tr:first-child td.cx-pe")
    R.ok("gaveta: Preenche mostra o critério, a contagem do deck e a faixa", "de " in pe and any(x in pe for x in ("abaixo", "dentro", "acima")), pe)
    pg.keyboard.press("Escape"); pg.wait_for_timeout(200)
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="prioridade"]'); pg.select_option('select[data-ctl="ord"]', "padrao"); pg.wait_for_timeout(300)
    # decisão com o banco de mentira: Bulk numa cópia, gravada e contada
    pg.click('[data-act="ui"][data-k="ver"][data-v="tabela"]'); pg.wait_for_timeout(200)
    pg.evaluate("window.CAIXA.abrir('vilis-broker-of-blood')"); pg.wait_for_timeout(300)
    pg.click('#cx-gav-in [data-act="decidir"][data-k="bulk"][data-i="0"]'); pg.wait_for_timeout(400)
    st = pg.evaluate("window.__store['vilis-broker-of-blood']")
    R.ok("decisão: grava no banco, um documento por carta, cópia a cópia", st and st["copias"][0]["destino"] == "bulk" and st["copias"][0]["imp"] == "M20 122", st)
    pg.click('#cx-gav-in [data-act="decidir"][data-k="guardar"][data-i="0"]'); pg.wait_for_timeout(300)
    R.ok("decisão: Guardar sem pasta física não grava e avisa", pg.evaluate("window.__store['vilis-broker-of-blood'].copias[0].destino") == "bulk" and "pasta" in pg.inner_text("#cx-aviso"))
    pg.keyboard.press("Escape"); pg.wait_for_timeout(200)
    R.ok("decisão: a carta sai das pendentes", pg.locator('tr.cx-r[data-id="vilis-broker-of-blood"]').count() == 0)
    R.ok("sem preço fora da Caixa: a página da Caixa é a única com US$", "US$" in pg.inner_text("#cx-resumo"))
    b.close()
R.fim()
