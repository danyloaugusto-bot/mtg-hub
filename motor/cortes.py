# -*- coding: utf-8 -*-
"""Cortes do radar sem repetição (critério do dono, 13/11/2026).

Quando duas ou mais cartas do radar (entra ou avaliar) apontam a mesma carta do deck como "sai", a de letra mais alta fica
com o corte; a seguinte leva o próximo corte mais fraco ainda livre, e assim por diante. Corte protegido (comandante, S, A,
carta que fica por decisão do dono, de estimação, MDFC, terreno que busca outro, peça de combo) nunca é corte, e a carta do
radar que apontava para um corte protegido também é reposta. O corte novo segue a regra de sempre: do mesmo lado (terreno
por terreno), de preferência da mesma função (o critério de maior nota da carta que entra), a letra mais baixa primeiro
(D, C, B) e, dentro da letra, o menor índice da tier list.

    python motor/cortes.py --deck "01. Vito"            # mostra o que mudaria
    python motor/cortes.py --deck "01. Vito" --gravar   # grava no avaliacao.json (só com o "pode" do dono)
"""
import argparse, io, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dados, encaixe, destinos  # noqa: E402

ORDEM = "SABCD"


def _protegida(c, combo):
    return (c.get("cmd") or c.get("nocut") or c.get("fica") or c.get("tier") in ("S", "A") or c.get("mdfc")
            or c["id"] in combo or destinos._busca_terreno(c) or c["q"] != 1)


def _chave(c):
    """O nome da carta como chave do avaliacao.json: o do Scryfall (o impresso, como Count Dracula, fica em c["n"])."""
    return c.get("on") or c["n"]


def _porque_protegida(c, combo):
    n = _chave(c)
    if c.get("fica"):
        return "%s fica por decisão do dono" % n
    if c.get("nocut"):
        return "%s é carta de estimação" % n
    if c["id"] in combo:
        return "%s é peça de combo do deck" % n
    if c.get("tier") in ("S", "A"):
        return "%s é tier %s" % (n, c["tier"])
    if c.get("mdfc"):
        return "%s tem terreno no verso" % n
    if destinos._busca_terreno(c):
        return "%s é terreno que busca outro" % n
    return "%s não pode sair" % n


def resolver(pasta):
    """[(carta do radar, sai antes, sai depois, motivo)] para o deck."""
    m = dados.montar(pasta, avisar=lambda *a: None)
    av = dados.ler_json(os.path.join(dados.pasta_deck(pasta), "avaliacao.json"))
    ix = {n: (x.get("indice") or 0) for n, x in av["cartas"].items()}
    por_id = {c["id"]: c for c in m["cards"]}
    combo = {i for cb in m.get("combos") or [] for i in cb.get("p") or []}
    ativos = [r for r in m["cands"] if r.get("verdict") in ("entra", "avaliar") and r.get("sai")]
    # a letra mais alta escolhe primeiro; empate: entra antes de avaliar, depois o maior valor no placar
    ativos.sort(key=lambda r: (ORDEM.find(r.get("tier") or "D"), 0 if r["verdict"] == "entra" else 1, -encaixe.valor(r["s3"]), r["n"]))
    usados, out = set(), []
    for r in ativos:
        atual = por_id.get(r["sai"])
        livre = atual is not None and not _protegida(atual, combo) and r["sai"] not in usados
        if livre:
            usados.add(r["sai"])
            continue
        lados = encaixe._lados(r)
        base = [c for c in m["cards"] if not _protegida(c, combo) and c["id"] not in usados and encaixe._lados(c) & lados]
        if not base:
            out.append((r["n"], atual["n"] if atual else r["sai"], None, "nenhum corte livre do mesmo lado"))
            continue
        top = max(r["s3"][2:]) if r.get("s3") else 0
        fun = [i for i in range(2, len(r["s3"])) if top and r["s3"][i] == top]
        mesma = [c for c in base if any(c["s3"][i] >= 1 for i in fun)]
        novo = min(mesma or base, key=lambda c: ("DCB".find(c.get("tier") or "B"), ix.get(c["n"], 0), c["n"]))
        usados.add(novo["id"])
        motivo = _porque_protegida(atual, combo) if atual is not None and _protegida(atual, combo) else \
                 ("%s já é o corte de uma carta de letra mais alta" % (_chave(atual) if atual else r["sai"]))
        out.append((_chave(r), _chave(atual) if atual else r["sai"], _chave(novo), motivo))
    return out


def gravar(pasta, mudancas):
    arq = os.path.join(dados.pasta_deck(pasta), "avaliacao.json")
    with io.open(arq, encoding="utf-8") as f:
        a = json.load(f)
    R = a["radar"]
    for n, antes, depois, motivo in mudancas:
        x = R.get(n)
        if x is None or depois is None:
            continue
        x["sai"] = depois
        nota = "Corte pelo critério do dono (13/11/2026): sai %s, porque %s." % (depois, motivo)
        p = (x.get("porque") or "").rstrip()
        x["porque"] = (p + " " + nota).strip() if nota not in p else p
    with io.open(arq, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(a, ensure_ascii=False, indent=1) + "\n")


def main():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    ap = argparse.ArgumentParser(description="Cortes do radar sem repetição.")
    ap.add_argument("--deck", required=True)
    ap.add_argument("--gravar", action="store_true")
    a = ap.parse_args()
    mud = resolver(a.deck)
    if not mud:
        print("%s: nenhum corte repetido ou protegido no radar" % a.deck)
        return
    for n, antes, depois, motivo in mud:
        print("%s: sai %s -> %s (%s)" % (n, antes, depois or "sem corte livre", motivo))
    if a.gravar:
        gravar(a.deck, mud)
        print("gravado: %d cartas do radar" % sum(1 for x in mud if x[2]))


if __name__ == "__main__":
    main()
