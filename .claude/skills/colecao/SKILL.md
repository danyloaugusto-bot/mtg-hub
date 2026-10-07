---
name: colecao
description: "Etapa 7. Avalia uma coleção nova para um deck ou para todos, com veredito de entrada e de compra."
argument-hint: "<código ou nome da coleção> [pasta do deck]"
model: opus
effort: high
disable-model-invocation: true
---

Pedido: $ARGUMENTS

Se eu não disser o deck, faça para todos os que têm painel.

1. Atualize o cache do Scryfall com as cartas da coleção.
2. Para cada deck, nas cores dele: leia o texto de cada carta nova (nunca de memória) e separe em três pilhas, com uma frase de motivo cada: entra, avaliar, fica de fora. Para as que entram, diga quem sai e o que muda no diagnóstico do deck.
3. Compra: para "entra" e "avaliar", traga o preço em dólar e diga se vale comprar agora, esperar baixar, ou só se sobrar. Considere a marca "tenho" quando existir.
4. Mostre o resumo por deck antes de gravar. Depois grave no radar de cada deck e monte de novo, hub incluído.

Seja crítico: carta forte que não serve ao plano do deck fica de fora, com o motivo escrito.

Ao terminar: `contexto/ESTADO.md`, entradas no `HISTORICO.md` dos decks afetados e commit `coleção: <código>`.
