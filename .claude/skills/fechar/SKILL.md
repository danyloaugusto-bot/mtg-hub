---
name: fechar
description: "Fecha a sessão: testes, handover vivo e commit."
model: sonnet
effort: low
disable-model-invocation: true
---

1. Rode os testes. Se algo falha, conserte ou reverta. Não deixe quebrado.
2. Atualize `contexto/ESTADO.md`: o que foi feito hoje, o que ficou pela metade, a próxima ação exata, as decisões tomadas e por quê, e as perguntas em aberto para mim.
3. Se mexeu em um deck, acrescente uma linha no `HISTORICO.md` da pasta dele: data, o que mudou, motivo.
4. `git add -A` e `git commit`, com uma mensagem que diga a etapa.
5. Diga-me em três linhas onde paramos.
