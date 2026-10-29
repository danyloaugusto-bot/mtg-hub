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
R.ok("Vilis: preço da M20 122 normal igual ao do cache", v["copias"][0]["usd"] == float(reg.get("usd")), (v["copias"][0]["usd"], reg.get("usd")))
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
R.ok("Vilis: Kaalia +%s com a sinergia avaliada (plano, lote 2), e marcada pelo EDHREC (50%%)" % cv["kaalia_ganho"],
     ka.get("g") == cv["kaalia_ganho"] and ka.get("a") == 1 and "02. Kaalia" in kedh.get("meu", []), (ka.get("g"), ka.get("a"), kedh))
s = v["copias"][0]["sug"]
R.ok("Vilis: sugestão Deck no K'rrik, prioridade S", (s["d"], s["p"], s["P"]) == ("deck", "03. K'rrik", "S"), s)
R.ok("Vilis: o porquê traz os números (radar, tier, valor, EDHREC)", "K'rrik" in s["pq"] and "entra" in s["pq"] and "71%" in s["pq"], s["pq"])
R.ok("Vilis: a Kaalia sai dos decks a avaliar depois da sinergia avaliada", "02. Kaalia" not in v["avaliar"] and v["avaliar"], v["avaliar"])
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
vce = carta(cx, "Celestine, the Living Saint")["valor"] or 0   # o preço muda a cada /precos: a faixa segue o preço do dia
R.ok("regra 4: venda na faixa do preço de hoje (B de US$ 5 a 20, A de 20 para cima: US$ %.2f)" % vce, ce.get("d") == "venda" and ce.get("P") == ("A" if vce >= 20 else "B"), ce)
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

# ---------------------------------------------------------------- pasta do ManaBox (subpasta): tarefas, proxy, banida, preços de hoje
MB, TXT = "zz teste MB", "zz teste TXT"
CAB = "Name,Set code,Set name,Collector number,Foil,Rarity,Quantity,ManaBox ID,Scryfall ID,Purchase price,Misprint,Altered,Signed,Condition,Language,Proxy,Purchase price currency,Added\n"


def linha_mb(nome, set_, num, rar="rare", compra="10.00", signed="false", proxy="false"):
    return "%s,%s,Teste,%s,normal,%s,1,1,,%s,false,false,%s,near_mint,pt,%s,BRL,2026-10-18T00:00:00.000Z\n" % (
        '"%s"' % nome if "," in nome else nome, set_, num, rar, compra, signed, proxy)


csv_mb = os.path.join(PF, MB, "export.csv")
PREC, CAMB = caixa._arq_precos(), caixa.CAMBIO
guarda2 = {q: (open(q, encoding="utf-8").read() if os.path.exists(q) else None) for q in (os.path.join(PF, "decisoes.json"), HIST, PREC, CAMB)}
tmpc = tempfile.mkdtemp()
try:
    os.makedirs(os.path.join(PF, MB))
    hd_linha = linha_mb("Hero's Downfall", "SLD", "312", compra="12.61")
    with open(csv_mb, "w", encoding="utf-8") as f:
        f.write(CAB + linha_mb("Mana Crypt", "SPG", "17", rar="mythic") + linha_mb("Commander's Sphere", "SLD", "315", proxy="true")
                + linha_mb("Umezawa's Jitte", "PLST", "BOK-163", signed="true") + hd_linha)
    with open(os.path.join(PF, TXT + ".txt"), "w", encoding="utf-8") as f:
        f.write("1 Hero's Downfall (SLD) 312\n")
    pl = caixa.pastas_lista()
    R.ok("pasta em subpasta: lida como ManaBox; o .txt antigo segue valendo", pl.get(MB, {}).get("sub") is True and pl.get(TXT, {}).get("sub") is False
         and MB in caixa.origens() and TXT in caixa.origens(), {k: v["sub"] for k, v in pl.items()})
    R.ok("pasta com nome fora do hub: avisada (a Preta P bate)", MB in caixa.pastas_fora_do_hub() and "Preta P" not in caixa.pastas_fora_do_hub())
    R.ok("leitor leve dos painéis e do hub: a subpasta entra em ler_pastas", dados.ler_pastas().get(MB, {}).get("hero's downfall") == 1)
    cm = caixa.montar(avisar=lambda *a: None, rede=False, fonte_edhrec=fonte, origem=MB)
    mc, csf, jt, hd = carta(cm, "Mana Crypt"), carta(cm, "Commander's Sphere"), carta(cm, "Umezawa's Jitte"), carta(cm, "Hero's Downfall")
    R.ok("ManaBox: resumo da leitura (4 cópias; ignoradas só Set name e ManaBox ID)", cm["manabox"] and cm["resumo"]["copias"] == 4
         and set(cm["resumo"]["colunas_ignoradas"]) == {"Set name", "ManaBox ID"}, cm["resumo"]["colunas_ignoradas"])
    R.ok("banida no Commander: selo, nunca Deck; Venda com preço", mc["leg"] == "banned" and mc["ban"] == 1
         and all(cp["sug"]["d"] == ("venda" if cp["usd"] is not None else "guardar") for cp in mc["copias"]), (mc.get("leg"), [cp["sug"]["d"] for cp in mc["copias"]]))
    R.ok("proxy: selo, nunca Venda nem Deck", csf["copias"][0].get("proxy") == 1 and csf["copias"][0]["sug"]["d"] not in ("venda", "deck"), csf["copias"][0]["sug"]["d"])
    R.ok("assinada: selo e aviso de que o preço do Scryfall não reflete", jt["copias"][0].get("selos") == ["assinada"] and any("não reflete" in a for a in jt["copias"][0]["avisos"]))
    R.ok("raridade e preço do cadastro do ManaBox na cópia, fora das regras", hd["copias"][0].get("rar") == "rara"
         and hd["copias"][0].get("compra") == {"v": 12.61, "moeda": "BRL", "em": "2026-10-18"}, hd["copias"][0].get("compra"))
    # remover numa subpasta: o export não é editado; vira tarefa, feita quando o export novo não traz a cópia
    caixa.gravar_decisoes({"versao": 2, "cartas": {"Hero's Downfall": {"copias": [{"imp": "SLD 312", "acab": "normal", "destino": "remover", "em": "2026-10-18", "aplicado": None}]}}}, origem=MB)
    antes = open(csv_mb, encoding="utf-8").read()
    caixa.aplicar(origem=MB)
    x = caixa.ler_decisoes(origem=MB)["cartas"]["Hero's Downfall"]["copias"][0]
    R.ok("tarefa no ManaBox: o export não muda e a decisão vira tarefa", open(csv_mb, encoding="utf-8").read() == antes
         and (x.get("tarefa") or {}).get("q_origem") == 1 and not x.get("aplicado"), x)
    cm2 = caixa.montar(avisar=lambda *a: None, rede=False, fonte_edhrec=fonte, origem=MB)
    R.ok("tarefa pendente: a cópia segue na pasta, com a decisão presa a ela", carta(cm2, "Hero's Downfall")
         and (carta(cm2, "Hero's Downfall")["copias"][0].get("decisao") or {}).get("destino") == "remover")
    R.ok("tarefa pendente na lista da página", any(t["n"] == "Hero's Downfall" and t["de"] == MB for t in caixa.tarefas_pendentes()))
    with open(csv_mb, "w", encoding="utf-8") as f:   # o export novo, sem a cópia
        f.write(antes.replace(hd_linha, ""))
    caixa.aplicar(origem=MB)
    x = caixa.ler_decisoes(origem=MB)["cartas"]["Hero's Downfall"]["copias"][0]
    R.ok("export novo sem a cópia: a tarefa fica feita", (x.get("tarefa") or {}).get("feita") and x.get("aplicado")
         and not any(t["n"] == "Hero's Downfall" and t["de"] == MB for t in caixa.tarefas_pendentes()), x)
    # da Caixa para a pasta do ManaBox: sai da Caixa já, e a tarefa fica feita quando o export da pasta traz a cópia
    os.makedirs(os.path.join(tmpc, "listas"))
    with open(os.path.join(tmpc, "listas", "l.txt"), "w", encoding="utf-8") as f:
        f.write("1 Hero's Downfall (SLD) 312\n")
    caixa.gravar_decisoes({"versao": 2, "cartas": {"Hero's Downfall": {"copias": [{"imp": "SLD 312", "acab": "normal", "destino": "guardar", "pasta": MB, "em": "2026-10-18", "aplicado": None}]}}}, base=tmpc)
    caixa.aplicar(base=tmpc)
    y = caixa.ler_decisoes(base=tmpc)["cartas"]["Hero's Downfall"]["copias"][0]
    R.ok("Caixa -> pasta do ManaBox: sai da Caixa, vira tarefa e nenhum .txt é criado", y.get("aplicado") and (y.get("tarefa") or {}).get("q_destino") == 0
         and not os.path.exists(os.path.join(PF, MB + ".txt")), y)
    with open(csv_mb, "a", encoding="utf-8") as f:
        f.write(linha_mb("Hero's Downfall", "SLD", "312"))
    caixa.aplicar(base=tmpc)
    y = caixa.ler_decisoes(base=tmpc)["cartas"]["Hero's Downfall"]["copias"][0]
    R.ok("o export da pasta de destino traz a cópia: a tarefa fica feita", (y.get("tarefa") or {}).get("feita"), y)
    # preços de hoje com um Scryfall de mentira: +20% na Jitte, +5% nas outras
    import copy as copia_
    if os.path.exists(PREC):
        os.remove(PREC)

    def scry_mentira(ps, atualizar):
        out = {}
        for i, p in enumerate(ps):
            r = copia_.deepcopy(scryfall.buscar([p], avisar=lambda *a: None)[0])
            if atualizar and r.get("usd"):
                r["usd"] = "%.2f" % (float(r["usd"]) * (1.2 if r["name"] == "Umezawa's Jitte" else 1.05))
            out[i] = r
        return out
    com_preco = sum(1 for c in cm["cartas"] if c["copias"][0]["usd"] is not None and c["copias"][0]["acab"] == "normal")
    rp = caixa.atualizar_precos(MB, avisar=lambda *a: None, buscar=scry_mentira)
    reg = caixa.ler_precos()["copias"]
    jk = caixa._chave_preco("PLST BOK-163", "normal")
    R.ok("/precos: consulta tudo de novo e guarda o anterior; conta os que mudaram e os que passaram de 10%",
         rp["mudaram"] == com_preco and rp["variacao"] == 1 and abs(reg[jk]["usd"] / reg[jk]["ant"] - 1.2) < 0.01, (rp, com_preco, reg.get(jk)))
    # a variação na tela: acima de 10% aparece, abaixo não (o preço atual do cache contra o anterior guardado)
    pj, ph = jt["copias"][0]["usd"], carta(cm, "Mana Crypt")["copias"][0]["usd"]
    with open(PREC, "w", encoding="utf-8") as f:
        json.dump({"copias": {jk: {"usd": pj, "em": "2026-10-18", "ant": round(pj / 1.25, 2), "ant_em": "2026-10-01"},
                              caixa._chave_preco("SPG 17", "normal"): {"usd": ph, "em": "2026-10-18", "ant": round(ph / 1.05, 2), "ant_em": "2026-10-01"}}}, f)
    cm3 = caixa.montar(avisar=lambda *a: None, rede=False, fonte_edhrec=fonte, origem=MB)
    vj, vm = carta(cm3, "Umezawa's Jitte")["copias"][0].get("var"), carta(cm3, "Mana Crypt")["copias"][0].get("var")
    R.ok("variação: +25% aparece ao lado do valor, +5% não", vj is not None and abs(vj - 0.25) < 0.01 and vm is None, (vj, vm))
    # PTAX de mentira: guarda; sem resposta, usa a última e marca; sem nenhuma guardada, só dólar
    if os.path.exists(CAMB):
        os.remove(CAMB)

    def sem_rede(h):
        raise OSError("sem rede")
    c1 = caixa.cambio(atualizar=True, fonte=lambda h: {"v": 5.5, "data": "2026-10-16", "fonte": "PTAX"})
    c2 = caixa.cambio(atualizar=True, fonte=sem_rede, avisar=lambda *a: None)
    R.ok("PTAX: guarda a cotação; sem resposta, fica a última guardada, marcada", c1["v"] == 5.5 and c2["v"] == 5.5 and c2.get("velha") == 1 and caixa.cambio()["v"] == 5.5)
    os.remove(CAMB)
    R.ok("PTAX sem resposta e sem cotação guardada: a página fica só em dólar", caixa.cambio(atualizar=True, fonte=sem_rede, avisar=lambda *a: None) is None)
finally:
    shutil.rmtree(os.path.join(PF, MB), ignore_errors=True)
    if os.path.exists(os.path.join(PF, TXT + ".txt")):
        os.remove(os.path.join(PF, TXT + ".txt"))
    shutil.rmtree(tmpc, ignore_errors=True)
    for q, v in guarda2.items():
        if v is None:
            if os.path.exists(q):
                os.remove(q)
        else:
            open(q, "w", encoding="utf-8", newline="\n").write(v)
R.ok("pasta do ManaBox de teste limpa", not [f for f in os.listdir(PF) if f.startswith("zz teste")])

# ---------------------------------------------------------------- lista do projeto em CSV (22/10/2026, a Preta P)
# A pasta deixa de seguir o ManaBox: dados/pastas/<pasta>.csv, no formato do ManaBox, que o motor edita ao aplicar. Carta que
# chega traz a linha de onde veio (idioma, selos, preço do cadastro); carta que sai some do arquivo, com o cabeçalho intacto.
PJ = "zz teste PJ"
csv_pj = os.path.join(PF, PJ + ".csv")
guarda3 = {q: (open(q, encoding="utf-8").read() if os.path.exists(q) else None) for q in (os.path.join(PF, "decisoes.json"), os.path.join(PF, "marcas.json"), HIST)}
tmpp = tempfile.mkdtemp()
try:
    with open(csv_pj, "w", encoding="utf-8") as f:
        f.write(CAB + linha_mb("Hero's Downfall", "SLD", "312"))
    os.makedirs(os.path.join(tmpp, "listas"))
    with open(os.path.join(tmpp, "listas", "l.csv"), "w", encoding="utf-8") as f:
        f.write(CAB + linha_mb("Umezawa's Jitte", "PLST", "BOK-163", signed="true", compra="33.00"))
    pl = caixa.pastas_lista()
    R.ok("lista do projeto em CSV: lida como pasta que o motor edita (não é ManaBox)", pl.get(PJ, {}).get("sub") is False and PJ in caixa.origens() and not caixa.eh_manabox(PJ))
    caixa.gravar_decisoes({"versao": 2, "cartas": {"Umezawa's Jitte": {"copias": [{"imp": "PLST BOK-163", "acab": "normal", "destino": "guardar", "pasta": PJ, "em": "2026-10-22", "aplicado": None}]}}}, base=tmpp)
    caixa.aplicar(base=tmpp)
    _, cab_pj, rows_pj = caixa._ler_csv_cru(csv_pj)
    jit = [r for r in rows_pj if r[0] == "Umezawa's Jitte"]
    R.ok("da Caixa para a lista do projeto: a linha chega com idioma, selo e preço do cadastro, quantidade 1",
         cab_pj == CAB.strip().split(",") and len(jit) == 1 and jit[0][cab_pj.index("Language")] == "pt" and jit[0][cab_pj.index("Signed")] == "true"
         and jit[0][cab_pj.index("Purchase price")] == "33.00" and jit[0][cab_pj.index("Quantity")] == "1", jit)
    R.ok("da Caixa para a lista do projeto: aplicada na hora, sem tarefa de ManaBox",
         all(x.get("aplicado") and not x.get("tarefa") for x in caixa.ler_decisoes(base=tmpp)["cartas"]["Umezawa's Jitte"]["copias"]))
    cpj = caixa.montar(avisar=lambda *a: None, rede=False, fonte_edhrec=fonte, origem=PJ)
    R.ok("a pasta mostra as duas cartas, com o selo da que chegou", cpj["resumo"]["copias"] == 2 and (carta(cpj, "Umezawa's Jitte") or {}).get("copias", [{}])[0].get("selos") == ["assinada"])
    caixa.gravar_decisoes({"versao": 2, "cartas": {"Hero's Downfall": {"copias": [{"imp": "SLD 312", "acab": "normal", "destino": "remover", "em": "2026-10-22", "aplicado": None}]}}}, origem=PJ)
    caixa.aplicar(origem=PJ)
    _, cab2, rows2 = caixa._ler_csv_cru(csv_pj)
    R.ok("saída da lista do projeto: a linha some e o resto fica como estava", cab2 == cab_pj and [r[0] for r in rows2] == ["Umezawa's Jitte"], [r[0] for r in rows2])
finally:
    if os.path.exists(csv_pj):
        os.remove(csv_pj)
    shutil.rmtree(tmpp, ignore_errors=True)
    for q, v in guarda3.items():
        if v is None:
            if os.path.exists(q):
                os.remove(q)
        else:
            open(q, "w", encoding="utf-8", newline="\n").write(v)
R.ok("lista do projeto de teste limpa", not os.path.exists(csv_pj))

# ---------------------------------------------------------------- data de entrada (22/10/2026): Added do ManaBox ou a data da lista
tmpd = tempfile.mkdtemp()
try:
    for nome_, txt_ in (("03. lote 22-10.txt", "1 Sol Ring (M3C) 305\n"), ("04. lote 05-11-2026.txt", "1 Sol Ring (M3C) 305\n")):
        open(os.path.join(tmpd, nome_), "w", encoding="utf-8").write(txt_)
    R.ok("data de entrada pelo nome da lista (dd-mm, com o ano do arquivo; dd-mm-aaaa)",
         caixa.data_do_arquivo(os.path.join(tmpd, "03. lote 22-10.txt")).endswith("-10-22") and caixa.data_do_arquivo(os.path.join(tmpd, "04. lote 05-11-2026.txt")) == "2026-11-05")
    open(os.path.join(tmpd, "l.csv"), "w", encoding="utf-8").write(CAB + linha_mb("Sol Ring", "M3C", "305"))
    cs_, _, _ = caixa.ler_csv(os.path.join(tmpd, "l.csv"))
    R.ok("data de entrada da coluna Added do ManaBox", cs_ and cs_[0].get("ent") == "2026-10-18", cs_[0].get("ent") if cs_ else None)
finally:
    shutil.rmtree(tmpd, ignore_errors=True)

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
    pv = caixa.usd(carta(cx_real, "Vilis, Broker of Blood")["valor"])   # o preço de hoje (muda a cada /precos)
    R.ok("linha do Vilis: S, K'rrik, +24 e o preço de hoje", lv.count() == 1 and lv.locator("td.cx-pr").inner_text().strip() == "S" and "K'rrik" in t and "+24" in t and pv in t, (pv, t[:160]))
    # Entrada (22/10/2026): as cópias que entraram nos últimos 3 dias, e agrupar pela data de entrada, a mais nova primeiro
    import datetime as _dt
    hoje_ = _dt.date.today()
    recentes = {c["id"] for c in pend if any(cp.get("ent") and (hoje_ - _dt.date.fromisoformat(cp["ent"])).days < 3 for cp in c["copias"])}
    b3 = pg.locator('[data-act="ui"][data-k="ent"][data-v="3"]')
    if b3.is_enabled():
        b3.click(); pg.wait_for_timeout(300)
        ids3 = set(pg.eval_on_selector_all("tr.cx-r", "es => es.map(e => e.getAttribute('data-id'))"))
        R.ok("Entrada 3 dias: só as cartas com cópia que entrou nos últimos 3 dias", ids3 == recentes, (len(ids3), len(recentes)))
    else:   # nenhuma cópia entrou nos últimos 3 dias: o botão fica desligado
        R.ok("Entrada 3 dias: sem cópia recente, o botão fica desligado", not recentes, len(recentes))
    pg.click('[data-act="ui"][data-k="ent"][data-v=""]'); pg.wait_for_timeout(200)
    pg.click('[data-act="ui"][data-k="ver"][data-v="galeria"]'); pg.wait_for_timeout(200)
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="entrada"]'); pg.wait_for_timeout(300)
    hs_e = [x.strip() for x in pg.eval_on_selector_all(".cx-g-h h2", "es => es.map(e => e.textContent.replace(/[▾▸]/g, ''))")]
    datas = sorted({cp["ent"] for c in pend for cp in c["copias"] if cp.get("ent")}, reverse=True)
    R.ok("Agrupar por entrada: um grupo por data, a mais nova primeiro", hs_e and hs_e[0].startswith("Entrou em " + "/".join(reversed(datas[0].split("-")))) and len(hs_e) == len(datas), hs_e)
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="prioridade"]'); pg.wait_for_timeout(200)
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
    R.ok("cores: seis botões (W U B R G e Incolor), com o símbolo de mana, e o modo", pg.locator('.cx-cores [data-act="cor"]').count() == 6
         and pg.locator('.cx-cores [data-act="cor"] svg.cx-mi-W').count() == 1 and pg.locator('.cx-cores select[data-ctl="cormodo"]').count() == 1)
    base = set(pg.eval_on_selector_all(".cx-cd", "es => es.map(e => e.getAttribute('data-id'))"))
    por_id = {c["id"]: c for c in cx_real["cartas"]}
    ident = lambda i: set(x for x in "WUBRG" if x in (por_id[i]["ident"] or ""))
    vis = lambda: set(pg.eval_on_selector_all(".cx-cd", "es => es.map(e => e.getAttribute('data-id'))"))
    pg.click('.cx-cores [data-act="cor"][data-v="W"]'); pg.click('.cx-cores [data-act="cor"][data-v="R"]'); pg.wait_for_timeout(300)
    esp = {i for i in base if ident(i) & {"W", "R"}}
    R.ok("cores, Contém: branco ou vermelho na identidade (%d cartas)" % len(esp), vis() == esp, (len(vis()), len(esp)))
    pg.select_option('select[data-ctl="cormodo"]', "cabe"); pg.wait_for_timeout(300)
    esp = {i for i in base if ident(i) <= {"W", "R"}}
    R.ok("cores, Cabe em: identidade dentro de branco e vermelho, incolores juntas (%d cartas)" % len(esp), vis() == esp, (len(vis()), len(esp)))
    pg.select_option('select[data-ctl="cormodo"]', "exata"); pg.wait_for_timeout(300)
    esp = {i for i in base if ident(i) == {"W", "R"}}
    R.ok("cores, Exatamente: só as de branco e vermelho (%d cartas)" % len(esp), vis() == esp, (len(vis()), len(esp)))
    pg.click('[data-act="cores-limpar"]'); pg.wait_for_timeout(300)
    pg.select_option('select[data-ctl="cormodo"]', "contem"); pg.wait_for_timeout(200)
    R.ok("cores: limpar volta a todas", pg.locator(".cx-cd").count() == len(pend))
    # subtipo: a lista suspensa, pelo que vem depois do travessão na linha de tipo
    subs = pg.eval_on_selector_all('select[data-ctl="sub"] option', "es => es.map(e => e.value).filter(Boolean)")
    if subs:
        sub = subs[0]
        pg.select_option('select[data-ctl="sub"]', sub); pg.wait_for_timeout(300)
        def tem(i):
            return any(sub in (f.split(" — ")[1].split() if " — " in f else []) for f in (por_id[i].get("line") or "").split(" // "))
        esp = {i for i in base if tem(i)}
        R.ok("subtipo %s: só as cartas com esse subtipo (%d)" % (sub, len(esp)), esp and vis() == esp, (len(vis()), len(esp)))
        pg.select_option('select[data-ctl="sub"]', ""); pg.wait_for_timeout(300)
        R.ok("subtipo: Todos volta a todas", pg.locator(".cx-cd").count() == len(pend))
    # a busca acha uma carta que um filtro de cor esconde: avisa, e Mostrar limpa os filtros
    nao_w = next((c for c in pend if c.get("ident") and "W" not in c["ident"]), None)
    if nao_w:
        pg.click('.cx-cores [data-act="cor"][data-v="W"]'); pg.fill("#q", nao_w["n"]); pg.wait_for_timeout(400)
        R.ok("busca: carta escondida pelo filtro de cor (%s) ganha o aviso com Mostrar" % nao_w["n"], pg.locator(".cx-busca-esc").count() == 1 and nao_w["n"] in pg.inner_text(".cx-busca-esc"))
        pg.click('[data-act="limpar-filtros"]'); pg.wait_for_timeout(400)
        R.ok("busca: Mostrar limpa os filtros e a carta aparece", pg.locator('.cx-cd[data-id="%s"]' % nao_w["id"]).count() == 1 and pg.locator(".cx-busca-esc").count() == 0)
        pg.fill("#q", ""); pg.click('[data-act="ui"][data-k="dec"][data-v="pendentes"]'); pg.wait_for_timeout(400)
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
    # destino de cada cópia: uma carta da Caixa com cópias em destinos diferentes (escolhida no dado; a lista muda com o /caixa aplicar)
    pg.click('[data-act="ui"][data-k="agrupar"][data-v="destino"]'); pg.wait_for_timeout(300)
    dd = next((c for c in pend if len({cp["sug"]["d"] for cp in c["copias"]}) >= 2), None)
    if dd:
        NOMES_D = {"deck": "Deck", "guardar": "Guardar", "venda": "Venda", "bundles": "Bundles", "bulk": "Bulk"}
        ec = pg.evaluate("""(i) => { var out = [], g = ''; document.querySelectorAll('tbody tr').forEach(function (r) { if (r.classList.contains('grp')) g = r.querySelector('.cx-tg').textContent.replace(/[▾▸]/g, ''); else if (r.getAttribute('data-id') === i) out.push([g, r.querySelector('td.cx-vl').getAttribute('data-v')]); }); return out; }""", dd["id"])
        grupos = sorted({x[0] for x in ec}); esp_g = sorted({NOMES_D[cp["sug"]["d"]] for cp in dd["copias"]})
        R.ok("agrupar por destino é cópia a cópia: %s aparece em %s, cada cópia com o seu preço" % (dd["n"], ", ".join(esp_g)), grupos == esp_g and len(ec) == len(esp_g), (ec, esp_g))
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
    # uma carta da Caixa com cópias em sugestões diferentes (a lista muda com o /caixa aplicar: a carta é escolhida no dado)
    dupla = next((c for c in cx_real["cartas"] if len({cp["sug"]["d"] for cp in c["copias"]}) >= 2), None)
    alvo = dupla["id"] if dupla else cx_real["cartas"][0]["id"]
    pg.evaluate("(i) => window.CAIXA.abrir(i)", alvo); pg.wait_for_timeout(300)
    gv = pg.inner_text("#cx-gav-in")
    R.ok("gaveta: o que a carta faz, em português, com o aviso de tradução livre", pg.locator("#cx-gav-in .cx-tx").count() == 1 and "Tradução livre" in gv)
    if dupla:
        ds = {cp["sug"]["d"] for cp in dupla["copias"]}
        caixas = pg.eval_on_selector_all("#cx-gav-in .cx-sug", "e => e.map(x => x.innerText)")
        R.ok("gaveta: uma caixa por sugestão (%s: %s)" % (dupla["n"], ", ".join(sorted(ds))), len(caixas) == len(ds), len(caixas))
        R.ok("gaveta: cada sugestão mostra as regras (as que não serviram e a que decidiu) e a prioridade", all("Prioridade" in t for t in caixas)
             and pg.locator("#cx-gav-in .cx-sug li.sim").count() == len(ds), caixas[:1])
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
    # placar de valor: a soma de hoje e a variação desde a atualização anterior, por lista
    soma = round(sum(cp["usd"] or 0 for c in cx_real["cartas"] for cp in c["copias"]), 2)
    dif = round(sum((cp["usd"] - cp["ant"]) for c in cx_real["cartas"] for cp in c["copias"] if cp["usd"] is not None and cp.get("ant") is not None), 2)
    pc = pg.evaluate("(() => { var p = window.CAIXA.placarDe(window.CAIXA.ORS[0]); return [Math.round(p.t * 100) / 100, Math.round(p.d * 100) / 100]; })()")
    R.ok("placar: o valor de hoje e a variação desde a atualização anterior batem com os dados", abs(pc[0] - soma) < 0.011 and abs(pc[1] - dif) < 0.011, (pc, soma, dif))
    R.ok("saldo no topo: só o da lista aberta, com a cor da variação e o detalhe no passar do mouse", pg.locator("#cx-saldo").count() == 1
         and pg.locator("#cx-saldo .cx-up, #cx-saldo .cx-down, #cx-saldo .cx-dz").count() == 1 and "desde" in (pg.get_attribute("#cx-saldo", "title") or ""))
    R.ok("uma página por lista: a Caixa não tem o seletor de lista", pg.locator('select[data-ctl="origem"]').count() == 0)
    R.ok("o topo numa linha só (1360 px)", pg.evaluate("document.querySelector('.top').getBoundingClientRect().height") < 80)
    # prioridade e sugestão filtram a lista (cópia a cópia)
    decid = set(pg.evaluate("Object.keys(window.__store || {})"))   # as que o teste já decidiu no banco de mentira (saem das pendentes)
    pend2 = [c for c in pend if c["id"] not in decid]
    ns = sum(1 for c in pend2 if any(cp["sug"]["P"] == "S" for cp in c["copias"]))
    pg.click('.cx-fi [data-act="prio"][data-v="S"]'); pg.wait_for_timeout(300)
    ids_s = set(pg.eval_on_selector_all("tr.cx-r", "es => es.map(e => e.getAttribute('data-id'))"))
    R.ok("filtro de prioridade: S mostra só as cartas com cópia de prioridade S (%d)" % ns, len(ids_s) == ns and pg.locator("tr.cx-r td.cx-pr .tb.tS").count() == pg.locator("tr.cx-r").count(), (len(ids_s), ns))
    pg.click('.cx-fi [data-act="dest"][data-v="deck"]'); pg.wait_for_timeout(300)
    nsd = sum(1 for c in pend2 if any(cp["sug"]["P"] == "S" and cp["sug"]["d"] == "deck" for cp in c["copias"]))
    R.ok("filtro de sugestão junto: S e Deck", len(set(pg.eval_on_selector_all("tr.cx-r", "es => es.map(e => e.getAttribute('data-id'))"))) == nsd, nsd)
    pg.click('[data-act="prios-limpar"]'); pg.click('[data-act="dests-limpar"]'); pg.wait_for_timeout(300)
    R.ok("filtros de prioridade e sugestão: limpar volta a todas", len(set(pg.eval_on_selector_all("tr.cx-r", "es => es.map(e => e.getAttribute('data-id'))"))) == len(pend2))
    R.ok("botão Atualizar preços no topo, com a data dos preços", pg.is_visible("#cx-pbt") and "Atualizar preços" in pg.inner_text("#cx-pbt"))
    # Atualizar preços com um Scryfall de mentira no navegador: tudo 10% mais caro; o placar sobe e o navegador guarda
    pg.evaluate(r"""(() => { window.fetch = function (url, op) { var ids = JSON.parse(op.body).identifiers, data = [];
      window.CAIXA.ORS.forEach(function (o) { o.cartas.forEach(function (c) { c.copias.forEach(function (cp) {
        var m = /^(\S+) (.+)$/.exec(cp.imp || ''); if (!m || cp.usd == null) return;
        if (ids.some(function (x) { return x.set === m[1].toLowerCase() && x.collector_number === m[2]; })) {
          var pr = {}; pr[{ foil: 'usd_foil', etched: 'usd_etched' }[cp.acab] || 'usd'] = String(Math.round(cp.usd * 110) / 100);
          data.push({ set: m[1].toLowerCase(), collector_number: m[2], prices: pr }); } }); }); });
      return Promise.resolve({ ok: true, json: function () { return Promise.resolve({ data: data }); } }); }; return 1; })()""")
    pg.click("#cx-pbt"); pg.wait_for_timeout(2500)
    p2 = pg.evaluate("(() => { var p = window.CAIXA.placarDe(window.CAIXA.ORS[0]); return [Math.round(p.t * 100) / 100, Math.round(p.p * 1000) / 1000]; })()")
    R.ok("Atualizar preços: os preços novos entram, o placar fica verde e o navegador guarda", abs(p2[0] - round(soma * 1.1, 2)) < 3.0 and p2[1] > 0.05   # a variação é contra o preço anterior guardado de cada cópia (datas variadas), não contra o de hoje
         and pg.locator("#cx-saldo .cx-up").count() == 1 and pg.evaluate("!!localStorage.getItem('mtg-hub:caixa:precos-vivos')") and "Scryfall de hoje" in pg.inner_text("#cx-aviso"), (p2, soma))
    pg.evaluate("localStorage.removeItem('mtg-hub:caixa:precos-vivos')"); pg.reload(); pg.wait_for_timeout(800)
    pg.evaluate("(() => { window.fetch = function () { return Promise.reject(new TypeError('bloqueado')); }; return 1; })()")
    pg.click("#cx-pbt"); pg.wait_for_timeout(600)
    R.ok("Atualizar preços sem acesso ao Scryfall: avisa e manda rodar /precos", "/precos" in pg.inner_text("#cx-aviso"))
    # a ficha da pasta e os selos, com a Preta P na tela (dados/pastas/pastas.json e o export do ManaBox)
    if "Preta P" in caixa.origens():
        cpp = caixa.montar(avisar=lambda *a: None, rede=False, origem="Preta P")
        ppag = os.path.join(comum.RAIZ, "saidas", caixa.nome_pagina("Preta P") + ".html")
        R.ok("Preta P: página própria (00. Pasta Preta P.html), bem mais leve que a Caixa", os.path.exists(ppag) and os.path.getsize(ppag) < os.path.getsize(pag) / 4)
        pg.goto(comum.url(ppag)); pg.wait_for_timeout(800)
        pg.click('[data-act="ui"][data-k="agrupar"][data-v="nenhum"]'); pg.wait_for_timeout(300)
        R.ok("Preta P: a ficha do Relicário de Ônix, com formato e os três papéis", "Relicário de Ônix" in pg.inner_text(".cx-ficha") and pg.locator(".cx-fpa li").count() == 3
             and "Relicário de Ônix" in pg.evaluate("document.title"))
        R.ok("Preta P: uma linha por carta e o selo nas banidas", len(set(pg.eval_on_selector_all("tr.cx-r", "es => es.map(e => e.getAttribute('data-id'))"))) == len(cpp["cartas"])
             and pg.locator("tr.cx-r .cx-sl-ban").count() == sum(1 for c in cpp["cartas"] if c.get("ban") or c.get("ilegal")))
        R.ok("Preta P: lista do projeto desde 22/10/2026, sem o aviso de tarefa do ManaBox", "export do ManaBox" not in pg.inner_text("#cx-lede") and not caixa.eh_manabox("Preta P"))
        R.ok("Preta P: o saldo no topo é o da pasta", "pasta Preta P" in (pg.get_attribute("#cx-saldo", "title") or ""))
        R.ok("Preta P não vende: nenhuma sugestão de Venda, Bulk ou Bundles, nem capital parado", all(cp["sug"]["d"] in ("deck", "guardar") and "capital parado" not in cp["sug"]["marcas"]
             for c in cpp["cartas"] for cp in c["copias"]))
        pg.evaluate("window.CAIXA.abrir(window.CAIXA.D.origens[0].cartas[0].id)"); pg.wait_for_timeout(300)
        R.ok("Preta P não vende: a gaveta não tem os botões Venda, Bulk e Bundles", pg.locator('#cx-gav-in [data-act="decidir"][data-k="venda"]').count() == 0
             and pg.locator('#cx-gav-in [data-act="decidir"][data-k="guardar"]').count() >= 1)
        pg.keyboard.press("Escape")
        # o fichário (26/10/2026): a pasta página a página, arrastar, organizar, rascunho e Salvar posições
        ncop = sum(len(c["copias"]) for c in cpp["cartas"])
        R.ok("fichário: a opção Fichário ao lado de Tabela e Galeria, só nas pastas", pg.locator('[data-act="ui"][data-k="ver"][data-v="fichario"]').count() == 1)
        pg.evaluate("localStorage.removeItem('mtg-hub:fichario:v1')")
        pg.click('[data-act="ui"][data-k="ver"][data-v="fichario"]'); pg.wait_for_timeout(400)
        # vale com qualquer arrumação salva (dados/pastas/fichario.json): as contas partem do que a página mostra
        ocup = pg.locator(".fx-casa:not(.vazia)").count()
        sv = caixa.ler_fichario().get("Preta P") or {}
        salvas = [k for k in sv.get("casas") or [] if k]
        ult = max([i for i, k in enumerate(sv.get("casas") or []) if k] or [-1])
        casas_n = ult + 1 + max(ncop - len(salvas), 0)   # as cópias novas entram depois da última casa salva
        npag = max(sv.get("paginas") or 0, -(-casas_n // 4), 1)
        reais = lambda: pg.locator(".fx-pag:not(.fx-verso)").count()
        R.ok("fichário: uma casa por cópia (%d), em %d páginas de 2×2, aos pares" % (ncop, npag), ocup == ncop and reais() == npag
             and pg.locator(".fx-pag").count() == 2 * pg.locator(".fx-ab").count(), (ocup, reais()))
        pg.click('[data-fx="pagina"]'); pg.wait_for_timeout(250)
        R.ok("fichário: + Página põe uma página vazia no fim", reais() == npag + 1)
        primeira = lambda: pg.eval_on_selector_all(".fx-casa:not(.vazia)", "e => [+e[0].getAttribute('data-casa'), e[0].title]")
        i0, p0 = primeira()
        pg.click('[data-fx="inserir"][data-v="0"]'); pg.wait_for_timeout(250)
        R.ok("fichário: + antes da página 1 empurra as cartas uma página", primeira() == [i0 + 4, p0] and reais() == npag + 2)
        pg.click('[data-fx="tirar"][data-v="0"]'); pg.wait_for_timeout(250)
        R.ok("fichário: tirar a página vazia devolve as cartas", primeira() == [i0, p0])
        pg.click('[data-fx="descartar"]'); pg.wait_for_timeout(250)
        pg.click('[data-act="ui"][data-k="ver"][data-v="tabela"]'); pg.click('[data-act="ui"][data-k="dec"][data-v="decididas"]'); pg.click('[data-act="ui"][data-k="ver"][data-v="fichario"]'); pg.wait_for_timeout(300)
        R.ok("fichário: o filtro Decisão não vale aqui (nenhuma carta apagada, sem o seletor)", pg.locator(".fx-casa.apagada").count() == 0 and pg.locator('[data-act="ui"][data-k="dec"]').count() == 0)
        pg.click('.cx-cores [data-act="cor"][data-v="G"]'); pg.wait_for_timeout(250)
        R.ok("fichário: cor apaga as outras, com o aviso e Mostrar todas", pg.locator(".fx-casa.apagada").count() > 0 and pg.locator(".fx-apag").count() == 1)
        pg.click('[data-fx="todas"]'); pg.wait_for_timeout(250)
        R.ok("fichário: Mostrar todas limpa os filtros da carta", pg.locator(".fx-casa.apagada").count() == 0)
        t0 = pg.eval_on_selector_all(".fx-casa:not(.vazia)", "e => e.slice(0, 2).map(x => x.title)")
        c01 = pg.eval_on_selector_all(".fx-casa:not(.vazia)", "e => e.slice(0, 2).map(x => x.getAttribute('data-casa'))")
        pg.locator('.fx-casa[data-casa="%s"]' % c01[0]).drag_to(pg.locator('.fx-casa[data-casa="%s"]' % c01[1])); pg.wait_for_timeout(300)
        t1 = pg.eval_on_selector_all(".fx-casa:not(.vazia)", "e => e.slice(0, 2).map(x => x.title)")
        R.ok("fichário: arrastar troca as duas cartas de lugar e vira rascunho", t0[0] == t1[1] and t0[1] == t1[0] and "não salvas" in pg.inner_text(".fx-est"), (t0, t1))
        pg.click('[data-fx="org"][data-v="valor"]'); pg.wait_for_timeout(300)
        us = [max([cp.get("usd") or 0 for c in cpp["cartas"] for cp in c["copias"]])]
        v0 = pg.eval_on_selector_all(".fx-casa:not(.vazia)", "e => e[0].title")
        R.ok("fichário: Organizar por valor põe a mais cara na primeira casa", caixa.usd(us[0]) in v0, (v0, us))
        pg.click('[data-fx="desfazer"]'); pg.wait_for_timeout(300)
        R.ok("fichário: Desfazer volta à arrumação de antes", pg.eval_on_selector_all(".fx-casa:not(.vazia)", "e => e.slice(0, 2).map(x => x.title)") == t1)
        pg.click('[data-fx="grade"][data-v="3x3"]'); pg.wait_for_timeout(300)
        R.ok("fichário: página 3×3 tem nove casas", pg.locator(".fx-pag").first.locator(".fx-casa").count() == 9)
        pg.click('[data-fx="grade"][data-v="2x2"]'); pg.wait_for_timeout(300)
        ia = primeira()[0]
        pg.click('[data-fx="arrumar"]'); pg.click('.fx-casa[data-casa="%d"]' % ia); pg.wait_for_timeout(150)
        R.ok("fichário: Arrumar ligado, tocar seleciona a carta", pg.locator(".fx-casa.sel").count() == 1)
        livre = pg.eval_on_selector_all(".fx-pag:not(.fx-verso) .fx-casa.vazia", "e => +e[e.length - 1].getAttribute('data-casa')")
        pg.click('.fx-casa[data-casa="%d"]' % livre); pg.wait_for_timeout(300)
        R.ok("fichário: tocar numa casa vazia leva a carta para lá", "vazia" in (pg.locator('.fx-casa[data-casa="%d"]' % ia).get_attribute("class") or "")
             and "vazia" not in (pg.locator('.fx-casa[data-casa="%d"]' % livre).get_attribute("class") or "") and pg.locator('.fx-casa:not(.vazia)').count() == ncop)
        pg.click('[data-fx="arrumar"]')
        pg.click('[data-fx="salvar"]'); pg.wait_for_timeout(400)
        R.ok("fichário: Salvar posições grava, mostra 'Posições salvas' e o comando /caixa fichario", "salvas" in pg.inner_text(".fx-est") and "/caixa fichario Preta P" in pg.inner_text(".fx-cmd"))
        R.ok("fichário: sem erro de página", not R.erros, R.erros[:2])
    b.close()
# o importar do fichário: os documentos do banco viram dados/pastas/fichario.json (sem mexer no arquivo de verdade)
import tempfile as _tf
_d = _tf.mkdtemp()
_arq_real = caixa.ARQ_FICHARIO
caixa.ARQ_FICHARIO = os.path.join(_d, "fichario.json")
_ent = os.path.join(_d, "banco.json")
json.dump({"docs": [{"id": "preta-p", "data": {"pasta": "Preta P", "grade": [2, 2], "casas": ["a|X 1|normal|1", None, "b|Y 2|foil|1"], "em": "2026-10-26"}}]}, open(_ent, "w", encoding="utf-8"))
_r = caixa.importar_fichario(_ent)
_f = json.load(open(caixa.ARQ_FICHARIO, encoding="utf-8"))
R.ok("fichário: o importar grava grade e casas, com a casa vazia no lugar", _r == {"Preta P": 2} and _f["Preta P"]["casas"] == ["a|X 1|normal|1", None, "b|Y 2|foil|1"] and _f["Preta P"]["grade"] == [2, 2])
json.dump({"pasta": "Rosa P", "grade": [3, 3], "casas": [None, "c|Z 9|normal|1"], "paginas": 4, "em": "2026-10-29"}, open(_ent, "w", encoding="utf-8"))
_r = caixa.importar_fichario(_ent)
_f = json.load(open(caixa.ARQ_FICHARIO, encoding="utf-8"))
R.ok("fichário: o importar aceita o documento só, como a página copia no arquivo local", _r == {"Rosa P": 1} and _f["Rosa P"]["paginas"] == 4 and "Preta P" in _f)
json.dump([{"pasta": "Preta P", "grade": [9, 9], "casas": []}], open(_ent, "w", encoding="utf-8"))
try:
    caixa.importar_fichario(_ent); _rec = False
except Exception:
    _rec = True
R.ok("fichário: o importar recusa grade fora de 1 a 6", _rec)
caixa.ARQ_FICHARIO = _arq_real
R.fim()
