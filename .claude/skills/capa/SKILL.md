---
name: capa
description: "Troca ou busca a capa de um deck."
argument-hint: "<pasta do deck>"
model: sonnet
effort: low
disable-model-invocation: true
---

Deck: $ARGUMENTS

Se há um arquivo novo `capa.*` na pasta, use-o. Se não há, procure no Scryfall as impressões do comandante com artes diferentes, mostre até cinco com edição, artista e ano, e depois que eu escolher baixe o `art_crop` como `capa.jpg`. Monte o painel e o hub de novo.
