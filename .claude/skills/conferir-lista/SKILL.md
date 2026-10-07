---
name: conferir-lista
description: "Confere a decklist antes de avaliar, sem corrigir."
argument-hint: "<pasta do deck>"
model: sonnet
effort: medium
disable-model-invocation: true
---

Deck: $ARGUMENTS

Confira `decklist.txt`: 100 cartas, identidade de cor do comandante, cartas banidas em Commander e nomes que o Scryfall não reconhece. Só relate, não corrija.
