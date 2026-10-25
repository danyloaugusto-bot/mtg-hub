# -*- coding: utf-8 -*-
"""Grava um lote de notas da rubrica no cadastro v3 (dados/cartas.json), pelo caminho de sempre (prenota.gravar_cadastro).

    python motor/ciclos_notas.py lote.json [--ver]

lote.json: {"<carta>": {"n": {"draw": 2, ...}, "por_que": "frase curta, sem citar deck", "so_com": "Equipment"}, ...}
Confere antes de gravar: a carta existe no cache do Scryfall (nome da frente), ainda não está no cadastro, cada critério é da
carta (3 a 10 da régua), nota de 1 a 3, e o por_que está escrito. Recusa o lote inteiro se algo falhar. Usado pelo
/ciclos classificar e pelo /grimorio classificar; a fonte fica "claude" e o revisado é a data de hoje."""
import argparse, datetime, json, os, sys

sys.dont_write_bytecode = True
MOTOR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, MOTOR)

import dados, prenota, scryfall  # noqa: E402


def gravar_lote(arquivo, ver=False, avisar=print):
    with open(arquivo, encoding="utf-8") as f:
        lote = json.load(f)
    if not isinstance(lote, dict) or not lote:
        raise dados.ErroDeck("o lote é {carta: {n, por_que, so_com?}}")
    ks = [c["k"] for c in dados.regua()["criterios"] if not c.get("do_deck")]
    cad = prenota.ler_cadastro()
    cache = scryfall._ler()
    nomes = cache.get("nomes") or {}
    erros, ja = [], []
    for nome, e in lote.items():
        frente = nome.split(" // ")[0]
        if frente.lower() not in nomes:
            erros.append("%s: não está no cache do Scryfall (rode o --ler antes)" % nome)
        if frente in cad["cartas"]:
            ja.append(frente)
        n = (e or {}).get("n")
        if not isinstance(n, dict):   # {} vale: carta com 0 em tudo, como um básico (a RUBRICA permite)
            erros.append("%s: 'n' é um dicionário {critério: nota}" % nome)
            continue
        for k, v in n.items():
            if k not in ks:
                erros.append("%s: '%s' não é critério da carta (%s)" % (nome, k, ", ".join(ks)))
            elif not isinstance(v, int) or not 1 <= v <= 3:
                erros.append("%s: %s=%r; a nota vai de 1 a 3 (0 é não escrever)" % (nome, k, v))
        if not str(e.get("por_que") or "").strip():
            erros.append("%s: falta o por_que" % nome)
        if e.get("so_com") is not None and not isinstance(e["so_com"], str):
            erros.append("%s: so_com é um tipo (texto)" % nome)
    if erros:
        raise dados.ErroDeck("lote recusado:\n  " + "\n  ".join(erros[:20]))
    hoje = datetime.date.today().isoformat()
    novas = 0
    for nome, e in lote.items():
        frente = nome.split(" // ")[0]
        if frente in cad["cartas"]:
            continue
        reg = {"n": dict(e["n"]), "por_que": e["por_que"].strip(), "fonte": "claude", "revisado": hoje}
        if e.get("so_com"):
            reg["so_com"] = e["so_com"]
        cad["cartas"][frente] = reg
        novas += 1
    if ja:
        avisar("já no cadastro, não tocadas: %s" % ", ".join(ja))
    if ver:
        avisar("sem gravar: %d entrariam" % novas)
        return novas
    prenota.gravar_cadastro(cad)
    avisar("gravadas %d cartas no cadastro (%d no total)" % (novas, len(cad["cartas"])))
    return novas


def main():
    ap = argparse.ArgumentParser(description="Grava um lote de notas da rubrica no cadastro v3.")
    ap.add_argument("lote")
    ap.add_argument("--ver", action="store_true", help="só confere, sem gravar")
    a = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    try:
        gravar_lote(a.lote, ver=a.ver)
    except dados.ErroDeck as e:
        sys.exit("ciclos_notas: %s" % e)


if __name__ == "__main__":
    main()
