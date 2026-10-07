---
name: potenciais
description: "Relê a página da comunidade do comandante e atualiza a lista de potenciais do deck."
argument-hint: "<pasta do deck>"
model: sonnet
effort: high
disable-model-invocation: true
---

Deck: $ARGUMENTS

1. Abra a página de comunidade indicada em `deck.md` (edh.wiki ou EDHREC). Se não houver link, procure a do comandante e me mostre antes de usar.
2. Colete as cartas que a página recomenda e o número de sinergia de cada uma. Tire as que já estão no deck, no radar ou na lista das que ficam de fora.
3. Para cada carta que sobrar, busque o texto oficial no Scryfall (use o cache) e escreva uma frase do que ela faz e uma de por que serviria, ou não, a este deck.
4. Grave a lista de potenciais nos dados do deck, com a data da leitura, e monte o painel de novo.
5. Mostre as dez de maior sinergia e diga quais você levaria ao radar.

Lembre: o número mede presença na comunidade, não força. Carta de pré-construído aparece inflada.

Ao terminar: uma linha no `HISTORICO.md` do deck e commit `potenciais: $ARGUMENTS`.
