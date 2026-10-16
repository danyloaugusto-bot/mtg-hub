# -*- coding: utf-8 -*-
"""Confronto: o deck contra listas de fora, pela pontuação v3 (comando /confrontar).

As listas ficam em dados/<deck>/entrada/listas/<nome>.txt, no formato da decklist, com um cabeçalho de comentários
(# nome, # autor, # fonte, # atualizada, # lido). Um link do Moxfield vira um desses arquivos pela API pública do site.

Cada lista é pontuada com a régua e as sinergias deste deck: carta que o deck já avaliou (deck ou radar) leva as notas dele;
carta só no cadastro único leva os oito critérios da carta e sinergia 0, marcada "a avaliar"; carta sem cadastro vale 0 e é
listada. O placar da lista de fora é, portanto, um piso. O resultado vai para dados/<deck>/confrontos.json, que o painel
mostra na aba Radar ("Contra outras listas").

    python motor/confronto.py --deck "02. Strefan" [--moxfield URL]
"""
import argparse, datetime, io, json, os, re, sys, urllib.request
import dados, encaixe, hub, scryfall

MOX = re.compile(r"moxfield\.com/decks/([A-Za-z0-9_-]+)")
MOX_API = "https://api2.moxfield.com/v2/decks/all/%s"


def pasta_listas(pasta):
    return os.path.join(dados.DADOS, pasta, "entrada", "listas")


def _nome(c):
    return c.get("on", c["n"]).split(" // ")[0]


def baixar_moxfield(pasta, url, avisar=print):
    """Grava a lista do Moxfield em entrada/listas/<id>.txt e devolve o caminho."""
    m = MOX.search(url)
    if not m:
        raise dados.ErroDeck("não é um link de deck do Moxfield: " + url)
    req = urllib.request.Request(MOX_API % m.group(1), headers={"Accept": "application/json", "User-Agent": scryfall.UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        j = json.load(r)
    autor = (j.get("createdByUser") or {}).get("userName", "")
    linhas = ["# nome: %s" % j.get("name", m.group(1)), "# autor: %s" % autor, "# fonte: Moxfield", "# url: %s" % url,
              "# atualizada: %s" % (j.get("lastUpdatedAtUtc") or "")[:10], "# lido: %s" % datetime.date.today().isoformat(), ""]

    def linha(v):
        c = v["card"]
        return "%d %s (%s) %s" % (v["quantity"], c["name"].split(" // ")[0], (c.get("set") or "").upper(), c.get("cn") or "")

    cmds = [linha(v) for v in (j.get("commanders") or {}).values()]
    if cmds:
        linhas += ["COMMANDER"] + cmds + [""]
    linhas += sorted(linha(v) for v in (j.get("mainboard") or {}).values())
    os.makedirs(pasta_listas(pasta), exist_ok=True)
    caminho = os.path.join(pasta_listas(pasta), dados.slug(autor or m.group(1)) + ".txt")
    with open(caminho, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(linhas) + "\n")
    avisar("lista gravada: %s (%s, %d cartas)" % (caminho, j.get("name"), sum(v["quantity"] for v in j["mainboard"].values()) + len(cmds)))
    return caminho


def ler_lista(caminho):
    meta = {}
    with open(caminho, encoding="utf-8-sig") as f:
        for linha in f:
            mm = re.match(r"#\s*(\w+)\s*:\s*(.*)", linha.strip())
            if mm:
                meta[mm.group(1).lower()] = mm.group(2).strip()
    meta.setdefault("nome", os.path.splitext(os.path.basename(caminho))[0])
    return meta, dados.ler_decklist(caminho)


def _crit(cards, ks, pn, peso, minimo=2):
    n = [sum(c["q"] for c in cards if c["s3"][i] >= minimo) for i in range(len(ks))]
    pts = [sum(peso[i] * pn[c["s3"][i]] * c["q"] for c in cards if c["s3"][i]) for i in range(len(ks))]
    return n, pts


def confrontar(pasta, avisar=print):
    m = dados.montar(pasta, avisar=lambda *a: None)
    if not m.get("v3"):
        raise dados.ErroDeck("%s ainda não está na pontuação v3" % pasta)
    r, ks, peso, pn, faixa = encaixe._regua()
    cad = dados.ler_cadastro()
    meus = {_nome(c): c for c in m["cards"]}
    avaliadas = {_nome(c): c for c in m["cards"] + m["cands"]}
    pl, avg = hub.placar(m["cards"], m["grupos"], v3=True)
    n, pts = _crit(m["cards"], ks, pn, peso)
    meu = dict(placar=round(pl, 1), cmc=round(avg, 2), n=n, pts=[round(x, 1) for x in pts])
    listas = []
    pl_dir = pasta_listas(pasta)
    for arq in sorted(os.listdir(pl_dir)) if os.path.isdir(pl_dir) else []:
        if not arq.endswith(".txt"):
            continue
        meta, lista = ler_lista(os.path.join(pl_dir, arq))
        sf = scryfall.buscar([dict(set=e["set"], num=e["num"], name=e["name"]) if e.get("set") else dict(name=e["name"]) for e in lista], avisar=avisar)
        cards, so_dele, comum, sem = [], [], [], []
        for i, e in enumerate(lista):
            c = dados.montar_carta(sf[i]["name"].split(" // ")[0], None, sf[i], m["grupos"], m["marcadores"])
            c["q"] = e["q"]
            if e["cmd"]:
                c["cmd"] = 1
            nome = _nome(c)
            aval = nome in avaliadas
            if aval:
                c["s3"] = list(avaliadas[nome]["s3"])
            elif nome in cad:
                c["s3"] = [0, 0] + [cad[nome]["n"].get(k, 0) for k in ks[2:]]
            else:
                c["s3"] = [0] * len(ks)
                sem.append(nome)
            cards.append(c)
            if nome in meus:
                comum.append(nome)
            elif not c.get("cmd"):
                g = encaixe.ganho(nome, m, cad, carta=c) if nome not in sem else None
                so_dele.append(dict(n=nome, id=c["id"], cost=c.get("cost", ""), line=c.get("line", ""), cmc=c["cmc"], col=c.get("col", "C"),
                                    land=c.get("land", 0), s3=c["s3"], radar=nome in avaliadas, cad=nome not in sem,
                                    ganho=g["ganho"] if g else None, sai=g["sai"] if g else None, cobre=g["cobre"] if g else []))
        plx, avgx = hub.placar(cards, m["grupos"], v3=True)
        nx, ptsx = _crit(cards, ks, pn, peso)
        so_dele.sort(key=lambda x: (-(x["ganho"] if x["ganho"] is not None else -999), x["n"]))
        so_meu = sorted(nm for nm, c in meus.items() if nm not in {_nome(c) for c in cards} and not c.get("cmd"))
        listas.append(dict(arquivo=arq, nome=meta.get("nome", arq), autor=meta.get("autor", ""), fonte=meta.get("fonte", ""), url=meta.get("url", ""),
                           atualizada=meta.get("atualizada", ""), lido=meta.get("lido", ""), cartas=sum(c["q"] for c in cards),
                           placar=round(plx, 1), cmc=round(avgx, 2), n=nx, pts=[round(x, 1) for x in ptsx],
                           so_dele=so_dele, comum=sorted(comum), so_meu=so_meu, sem_cadastro=sem))
        avisar("%s: %s cartas, placar %s (o seu: %s); só dela %d, em comum %d, sem cadastro %d" % (
            meta.get("nome"), sum(c["q"] for c in cards), listas[-1]["placar"], meu["placar"], len(so_dele), len(comum), len(sem)))
    out = dict(lido=datetime.date.today().isoformat(), criterios=ks, meu=meu, listas=listas)
    with open(os.path.join(dados.DADOS, pasta, "confrontos.json"), "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    return out


def main():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    ap = argparse.ArgumentParser(description="Confronto do deck com listas de fora (pontuação v3).")
    ap.add_argument("--deck", required=True, help="pasta do deck")
    ap.add_argument("--moxfield", help="link de um deck do Moxfield para baixar antes")
    a = ap.parse_args()
    if a.moxfield:
        baixar_moxfield(a.deck, a.moxfield)
    confrontar(a.deck)


if __name__ == "__main__":
    main()
