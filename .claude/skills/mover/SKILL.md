---
name: mover
description: "Renomeia a pasta de um deck (muda grupo ou nome) e remonta o que depende dela."
argument-hint: "<pasta atual> para <pasta nova>"
model: haiku
disable-model-invocation: true
---

Pedido: $ARGUMENTS

Renomeie a pasta do deck em `dados/` com `git mv`, renomeie o HTML correspondente em `saidas/`, ajuste `contexto/inventario.csv`, e monte o painel e o hub de novo. O número antes do ponto é o grupo.
