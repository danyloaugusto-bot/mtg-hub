---
name: imagens
description: "Etapa 3. Baixa as imagens das cartas uma vez e as embute nos painéis."
argument-hint: "<pasta do deck, ou todos>"
model: sonnet
effort: medium
disable-model-invocation: true
---

Alvo: $ARGUMENTS

Por quê: a página publicada não carrega nada de fora. As imagens precisam estar dentro do arquivo.

Se `motor/imagens.py` ainda não existe, crie-o:

- para cada carta do deck e do radar, descubra a impressão exata no Scryfall com `POST https://api.scryfall.com/cards/collection`, em lotes de 75. Use `{set, collector_number}` quando a lista traz edição e número, e `{name}` quando não traz. O que voltar em `not_found` tenta de novo por nome;
- baixe a imagem `normal` de `cards.scryfall.io`, frente e verso quando houver; reduza para 340 px de largura, JPEG qualidade 82; grave em `cache/img/<set>-<numero>.jpg` (verso com sufixo `-verso`);
- o cache é compartilhado entre decks: carta já baixada não é baixada de novo;
- guarde em `cache/scryfall.json` o que é útil de cada carta (texto oficial, tipo, custo, artista, preço em dólar, data de lançamento), com a data da consulta, e não repita a consulta por 7 dias;
- intervalo de 100 ms entre chamadas à API e cabeçalho `User-Agent: mtg-hub-pessoal/1.0`.

Capa: use o arquivo `capa.*` da pasta do deck. Só se não houver, baixe o `art_crop` do comandante e salve como `capa.jpg`.

`motor/build.py` aceita `--imagens embutidas|externas|nenhuma`, com `embutidas` de padrão. Avise se um HTML passar de 12 MB e pare se passar de 15 MB.

## Pronto quando

Os painéis do alvo mostram todas as imagens sem internet, o tamanho de cada HTML está no seu relatório, e uma segunda execução não baixa nada.

Ao terminar: `contexto/ESTADO.md` e commit `imagens: $ARGUMENTS`.
