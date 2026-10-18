---
name: precos
description: "Atualiza o valor de hoje das cartas da Caixa e das pastas (Scryfall e dólar PTAX) e monta a página da Caixa."
argument-hint: "[origem: Caixa ou o nome de uma pasta, como Preta P]"
model: sonnet
effort: low
disable-model-invocation: true
---

Origem: $ARGUMENTS

O valor de hoje serve para o dono decidir se compensa mandar uma carta para a pasta de venda e comprar outras melhores (seção "Vender para comprar" da página da Caixa). Preço aparece nas páginas da Caixa e das pastas; no hub, só o saldo de cada pasta, ao passar o mouse; nos painéis, nunca.

1. Rode `python motor/caixa.py --precos`, com `--origem "<origem>"` se o pedido trouxe uma (Caixa ou uma pasta). O script consulta o Scryfall de novo para as impressões daquela origem (ou de todas), ignorando a validade de 7 dias do cache, guarda o preço anterior de cada impressão em `dados/precos/ultimo.json`, busca a PTAX do último dia útil no Banco Central (`cambio_brl: "ptax"` em `motor/caixa.json`) e monta as páginas: `saidas/00. Caixa.html` e uma por pasta com lista, `saidas/00. Pasta <pasta>.html`.
2. Mostre ao dono, em poucas linhas: quantas cópias e impressões foram consultadas, quantos preços mudaram e quantos passaram da variação da régua (10%), a cotação usada (e se é a última guardada, porque a API falhou), o tamanho da página e os avisos do script.
3. Republique por cima dos mesmos links, sem passar `capabilities`: `saidas/00. Caixa.html` (link em `dados/caixa/link.txt`) e cada página de pasta, `saidas/00. Pasta <pasta>.html` (links em `dados/pastas/links.json`). Depois monte e republique o hub (`python motor/build.py --hub`), que mostra o saldo de cada pasta ao passar o mouse.
4. Mostre o saldo de cada lista: o valor de hoje e quanto subiu ou caiu desde a atualização anterior (o mesmo indicador do topo das páginas).

Não mexa em decisões, listas ou decklists. Ao terminar, uma linha em `contexto/ESTADO.md` só se o dono pedir; não há commit (os preços ficam em `dados/precos/ultimo.json`, que entra no próximo commit da Caixa).
