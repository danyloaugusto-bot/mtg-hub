# -*- coding: utf-8 -*-
"""Posições oficiais do 8×8.

O dono arrasta cartas entre os pacotes na aba 8×8 do painel e clica em Salvar posições: o painel mostra um texto
(deck e uma linha por carta movida) que ele cola na conversa. Este script lê esse texto e grava o campo `pacote`
da carta no `avaliacao.json` do deck. As notas, o tier e o placar não mudam.

  python motor/pacotes.py --conferir <arquivo.txt>   # só mostra o que mudaria
  python motor/pacotes.py --gravar <arquivo.txt>

Formato do arquivo:
  Salvar posições do 8×8
  Deck: 01. Markov
  Blood Artist > Banquete [banquete]
"""
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import caixa  # noqa: E402

LINHA = re.compile(r"^(.+?)\s*>\s*.*\[([^\]]+)\]\s*$")


def ler(arquivo):
    deck, movs = None, []
    for bruta in io.open(arquivo, encoding="utf-8-sig"):
        linha = bruta.strip()
        if not linha or linha.lower().startswith("salvar posi"):
            continue
        if linha.lower().startswith("deck:"):
            deck = linha.split(":", 1)[1].strip()
            continue
        m = LINHA.match(linha)
        if not m:
            raise SystemExit("linha fora do formato: %r" % linha)
        movs.append((m.group(1).strip(), m.group(2).strip()))
    if not deck:
        raise SystemExit("faltou a linha 'Deck: <pasta>'")
    if not movs:
        raise SystemExit("nenhuma carta no arquivo")
    return deck, movs


def aplicar(arquivo, gravar):
    deck, movs = ler(arquivo)
    caminho, a, recuo, fim = caixa._ler_av(deck)   # o arquivo volta com o recuo e o fim de linha que já tinha
    grupos = [g["k"] for g in a["agrupamentos"]]
    nomes = {g["k"]: g["nome"] for g in a["agrupamentos"]}
    erros, feitas = [], []
    for carta, pk in movs:
        alvo = a["cartas"].get(carta)
        onde = "deck"
        if alvo is None and carta in a.get("radar", {}):
            alvo, onde = a["radar"][carta], "radar"
        if alvo is None:
            erros.append("%s: não está no deck nem no radar" % carta)
        elif pk not in grupos + ["sem"]:
            erros.append("%s: pacote %r não é um agrupamento do deck" % (carta, pk))
        else:
            feitas.append((carta, alvo, pk, onde))
    if erros:
        raise SystemExit("nada gravado:\n  " + "\n  ".join(erros))
    for carta, alvo, pk, onde in feitas:
        antes = alvo.get("pacote")
        alvo["pacote"] = pk
        print("%s (%s): %s -> %s" % (carta, onde, nomes.get(antes, antes or "pela maior nota"), nomes.get(pk, pk)))
    if gravar:
        tmp = caminho + ".tmp"
        with io.open(tmp, "w", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(a, ensure_ascii=False, indent=recuo) + ("\n" if fim else ""))
        os.replace(tmp, caminho)
        print("gravado: %s, %d carta(s)" % (deck, len(feitas)))
    else:
        print("conferido: %s, %d carta(s); nada gravado" % (deck, len(feitas)))


if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in ("--conferir", "--gravar"):
        raise SystemExit(__doc__)
    aplicar(sys.argv[2], sys.argv[1] == "--gravar")
