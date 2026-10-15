---
name: publicar
description: "Etapa 8. Prepara e publica os painéis e o hub."
argument-hint: "[pasta do deck, ou todos]"
model: sonnet
effort: medium
disable-model-invocation: true
---

Alvo: $ARGUMENTS

1. Monte com imagens embutidas e confira o tamanho de cada HTML. O teto de uma página publicada é 16 MiB.
2. Rode o teste de página publicada.
3. Verifique o que esta instalação do Claude Code oferece para publicar artefatos. Se oferecer, publique um artefato por deck e um para o hub, com as capacidades `db` e `user` nos painéis. Se não oferecer, pare e me avise: eu publico levando cada HTML para uma conversa no claude.ai.
4. Painel que já tem link em `contexto/inventario.csv` é atualizado por cima do mesmo link, nunca publicado de novo como artefato novo.
   Ao atualizar por cima de um link (painel ou hub), **não passe `capabilities`**: o artefato guarda as que já tem. O hub guarda `db` e `user` para a lista de compras, e passar `{}` apaga as duas e a lista some do hub publicado. `capabilities` só vai na primeira publicação de um painel novo.
5. Grave os links no inventário e monte o hub outra vez.

Nada é publicado como público: as artes são da Wizards.
