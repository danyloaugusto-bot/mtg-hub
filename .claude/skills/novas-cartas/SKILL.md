---
name: novas-cartas
description: "Etapa 6. Completa a seção Potenciais com os lançamentos do Scryfall, para todos os decks."
model: sonnet
effort: high
disable-model-invocation: true
---

A seção Potenciais já existe no padrão, com a fonte da comunidade (edh.wiki). Esta etapa acrescenta a segunda fonte: os lançamentos. Objetivo: um botão ao lado de Backup que abre a seção e mostra o que saiu de novo nas cores do deck, com uma primeira triagem.

1. Dados: o build grava em cada painel um retrato das cartas recentes nas cores do deck, vindo de `GET https://api.scryfall.com/cards/search` com a consulta `id<=<cores> f:commander is:firstprint date>=<data>` e `order=released`. Use o cache e pagine. O painel publicado não consulta a internet: mostra o retrato do último build e a data dele. No arquivo local, um botão "Atualizar agora" refaz a consulta direto do navegador.
2. Triagem por regras, declaradas em um lugar só e ajustáveis por deck: o tipo da tribo do deck e as palavras do texto que apontam para cada agrupamento. Resultado: nota provisória por agrupamento e tier provisório, sempre marcados como "triagem automática".
3. Interface: grade com imagem, custo, preço em dólar, link da LigaMagic, notas provisórias e os mesmos dois botões da fonte da comunidade, "Levar ao radar" e "Deixar de fora". O que ficou de fora não volta. O que vai para o radar entra como "avaliar".
4. Deixe escrito na tela: triagem não é veredito. Tier e compra saem de `/colecao`.

## Pronto quando

Funciona em dois decks, com teste que simula o Scryfall, e a seção aparece vazia e explicada quando não há retrato.

Ao terminar: `contexto/ESTADO.md` e commit `novas cartas`.
