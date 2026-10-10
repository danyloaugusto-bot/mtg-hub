---
name: importar-backup
description: "Traz para o projeto o que foi editado dentro de um painel."
argument-hint: "<pasta do deck>"
model: sonnet
effort: medium
disable-model-invocation: true
---

Deck: $ARGUMENTS

Vou colar abaixo o backup do painel. Aplique em `dados/$ARGUMENTS/` os tiers, as notas, as trocas e as anotações que eu mudei. O campo `pk` do backup (aba 8×8) é simulação: só o grave como `"pacote"` na carta do `avaliacao.json` se eu pedir, porque ele não muda notas nem placar. Mostre o que vai mudar antes de gravar, registre no `HISTORICO.md` e monte o painel e o hub de novo.
