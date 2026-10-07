---
name: comparar
description: "Compara uma carta de fora com uma do deck e diz qual fica."
argument-hint: "<pasta do deck> | <carta de fora> | <carta do deck>"
model: opus
effort: high
disable-model-invocation: true
---

Pedido: $ARGUMENTS

Compare as duas cartas neste deck: custo, papel nos agrupamentos e sinergia com o comandante, lendo o texto oficial das duas. Diga qual fica e por quê, em cinco linhas. Se a de fora merecer, pergunte se deve ir para o radar.
