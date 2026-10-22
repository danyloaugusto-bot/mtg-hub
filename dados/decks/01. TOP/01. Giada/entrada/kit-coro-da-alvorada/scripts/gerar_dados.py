# -*- coding: utf-8 -*-
"""Junta a decklist, as avaliações (dados/evals.py) e os fatos do Forge em dados/D.json, validando tudo.

Uso: python3 scripts/gerar_dados.py        (precisa do clone do Forge: ver scripts/forge.py)
"""
import json, math, os, re, sys, unicodedata
from collections import Counter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, "scripts")); sys.path.insert(0, os.path.join(RAIZ, "dados"))
from forge import carta
from evals import CARDS, CANDS, COMBOS, META


def slug(s):
    s = "".join(ch for ch in unicodedata.normalize("NFKD", s) if not unicodedata.combining(ch)).lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def ler_decklist(caminho):
    """Linhas no formato '1 Nome (SET) número [F]'. A primeira é o comandante."""
    deck = []
    for linha in open(caminho, encoding="utf-8"):
        linha = linha.strip()
        if not linha or linha.startswith("//"):
            continue
        m = re.match(r"^(\d+)\s+(.+?)\s+\(([A-Z0-9]+)\)\s+(\S+)(\s+F)?$", linha)
        assert m, "linha fora do formato: " + linha
        deck.append({"q": int(m.group(1)), "n": m.group(2), "set": m.group(3), "num": m.group(4), "foil": bool(m.group(5))})
    return deck


def custo(mc):
    if not mc or mc == "no cost":
        return "", 0
    txt, cmc = "", 0
    for tok in mc.split():
        txt += "{" + tok + "}"
        cmc += int(tok) if tok.isdigit() else (0 if tok == "X" else 1)
    return txt, cmc


TIPO = [("Land", "ter"), ("Creature", "cri"), ("Battle", "bat"), ("Instant", "ins"), ("Sorcery", "fei"), ("Artifact", "art"), ("Enchantment", "enc"), ("Planeswalker", "pw")]
GRUPO = dict(cri="cri", pw="pw", bat="bat", ins="mag", fei="mag", art="art", enc="enc", ter="ter")
# palavra do tipo em inglês -> trecho que a linha de tipo em português precisa conter
CONFERE = {"Legendary": "Lendári", "Angel": "Anjo", "Cleric": "Clérigo", "Knight": "Cavaleiro", "Soldier": "Soldado", "Human": "Humano", "Spirit": "Espírito",
           "Horror": "Horror", "Wizard": "Mago", "Equipment": "Equipamento", "Aura": "Aura", "Siege": "Cerco", "Plains": "Planície", "Snow": "Neve", "Basic": "Básico",
           "Creature": "Criatura", "Artifact": "Artefato", "Enchantment": "Encantamento", "Land": "Terreno", "Instant": "Instantânea", "Sorcery": "Feitiço", "Battle": "Batalha", "Book": "Livro"}
MARCAS = ("ptl", "angel", "gain", "pay", "atok", "wipe", "uni", "aonly", "atk", "alt", "back", "mdfc", "prod", "tapped")


def fatos(nome):
    r = carta(nome)
    assert r, "não achei no Forge: " + nome
    f = r[0]
    tipos = f.get("Types", "")
    c, cmc = custo(f.get("ManaCost", ""))
    t = next(v for k, v in TIPO if k in tipos.split())
    d = dict(cost=c, cmc=cmc, t=t, tipos=tipos)
    if t == "cri" and f.get("PT"): d["pt"] = f["PT"]
    if t == "bat" and f.get("Defense"): d["pt"] = f["Defense"]
    if "Legendary" in tipos.split(): d["leg"] = 1
    if t == "ter": d["land"] = 1
    d["col"] = "L" if t == "ter" else ("W" if "{W}" in c else "C")   # deck mono-branco: ajuste aqui para outras cores
    return d


def montar(ev, linha=None, candidata=False):
    f = fatos(ev["n"])
    for en, pt in CONFERE.items():
        if en in f["tipos"].split():
            assert pt in ev["line"], '%s: linha de tipo "%s" não bate com o Forge (%s)' % (ev["n"], ev["line"], f["tipos"])
    assert len(ev["s"]) == 8 and all(isinstance(x, int) and -1 <= x <= 3 for x in ev["s"]), ev["n"]
    assert ev["tier"] in "SABCD" and ev["rel"] in ("INS", "ALT", "MED", "BAX"), ev["n"]
    c = dict(id=slug(ev["n"]), n=ev["n"], q=(linha["q"] if linha else 1), cost=f["cost"], cmc=f["cmc"], t=f["t"], g=GRUPO[f["t"]],
             line=ev["line"], col=f["col"], s=ev["s"], tier=ev["tier"], rel=ev["rel"], fx=ev["fx"], why=ev["why"])
    for k in ("pt", "leg", "land"):
        if k in f: c[k] = f[k]
    for k in MARCAS:
        if k in ev: c[k] = ev[k]
    assert ("Angel" in f["tipos"].split()) == bool(ev.get("angel")), ev["n"] + ": marca angel não bate com o Forge"
    if c.get("land"):
        assert c.get("prod") in ("W", "C"), ev["n"] + ": terreno sem prod"
    if linha:
        c["set"] = linha["set"]; c["num"] = linha["num"]
        if linha["foil"]: c["foil"] = 1
    if candidata:
        assert ev["verdict"] in ("entra", "avaliar", "fora")
        c["cand"] = 1; c["verdict"] = ev["verdict"]
    return c


def gerar():
    deck = ler_decklist(os.path.join(RAIZ, "dados", "decklist.txt"))
    por_nome = {e["n"]: e for e in CARDS}
    nomes = [d["n"] for d in deck]
    falta = [n for n in nomes if n not in por_nome]; sobra = [n for n in por_nome if n not in nomes]
    assert not falta and not sobra and len(por_nome) == len(CARDS), ("sem avaliação:", falta, "avaliação sem carta:", sobra)
    cartas = []
    for i, d in enumerate(deck):
        c = montar(por_nome[d["n"]], d)
        if i == 0: c["g"] = "cmd"; c["cmd"] = 1
        cartas.append(c)
    ids = {c["id"] for c in cartas}
    assert len(ids) == len(cartas)
    cartas = [cartas[0]] + sorted(cartas[1:], key=lambda c: c["n"].lower())
    cands = []
    for ev in CANDS:
        assert ev["n"] not in por_nome
        c = montar(ev, None, True)
        if ev.get("sai"):
            assert slug(ev["sai"]) in ids, ev["sai"]
            c["sai"] = slug(ev["sai"])
        cands.append(c)
    todos = ids | {c["id"] for c in cands}
    combos = []
    for k in COMBOS:
        p = [slug(x) for x in k["p"]]
        assert all(x in todos for x in p), k["n"]
        combos.append(dict(n=k["n"], kind=k["kind"], p=p, t=k["t"]))
    return dict(cards=cartas, cands=cands, combos=combos, meta=META)


def resumo(D):
    cs = D["cards"]; nl = [c for c in cs if not c.get("land")]
    n = sum(c["q"] for c in cs); media = sum(c["cmc"] * c["q"] for c in nl) / sum(c["q"] for c in nl)
    notas = sum(sum(c["s"]) * c["q"] for c in cs); ramp = sum(c["s"][0] * c["q"] for c in cs)
    pc = 5 if media < 2 else 4 if media < 3 else 3 if media < 4 else 2 if media < 5 else 1
    pa = min(90, 5 * (math.floor(ramp / media * 2) + 1))
    print("cartas %d | entradas %d | não-terreno %d | terrenos %d | cartas duplas %d" % (n, len(cs), sum(c["q"] for c in nl), n - sum(c["q"] for c in nl), sum(1 for c in cs if c.get("mdfc"))))
    print("CMC médio %.2f | placar %d = %d notas + %d aceleração + %d CMC" % (media, notas + pa + pc, notas, pa, pc))
    for i, g in enumerate(["Ramp", "Draw", "Removal", "Proteção", "Buff", "Token", "Sinergia", "Especial"]):
        print("  %-9s dedicadas %2d | de passagem %2d | pontos %3d" % (g, sum(c["q"] for c in cs if c["s"][i] >= 2), sum(c["q"] for c in cs if c["s"][i] == 1), sum(c["s"][i] * c["q"] for c in cs)))
    print("tiers", dict(Counter(c["tier"] for c in cs)), "| relevância", dict(Counter(c["rel"] for c in cs)))
    print("curva", [sum(c["q"] for c in nl if min(c["cmc"], 7) == i) for i in range(8)], "| anjos", sum(1 for c in cs if c.get("angel")), "de", sum(1 for c in cs if c["t"] == "cri"))


if __name__ == "__main__":
    D = gerar()
    destino = os.path.join(RAIZ, "dados", "D.json")
    json.dump(D, open(destino, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    resumo(D)
    print("gravado:", destino)
