# Pastas de cartas

Aqui entram as suas pastas físicas de cartas: Rosa P (a pasta de venda; antes "Rosa (sell)"), Preta P (a 4x4 das cartas em espera e das pet cards, que não vende; antes "Preta (esp)"), Preta, Amarela, Laranja, Rosa, Azul e Vermelha.

## A Preta P é lista do projeto (desde 22/10/2026)

A Preta P não depende mais do ManaBox. A lista dela é `dados/pastas/Preta P.csv`, no formato do ManaBox, e quem mexe nela é o motor:

- **Carta que chega da Caixa:** na página da Caixa publicada, escolha a pasta Preta P e clique em Guardar. Depois peça `/caixa aplicar`: a carta sai da Caixa e entra no CSV da Preta P, com coleção, número, foil, idioma, condição e selos copiados da lista de onde veio.
- **Carta que sai da Preta P:** decida na página da Pasta Preta P (Mover, Deck, Remover) e peça `/caixa aplicar`: a linha sai do CSV.
- Nada de exportar nem de salvar arquivo: as decisões ficam no banco da página e o `/caixa aplicar` grava no projeto; o commit guarda no GitHub.

As outras pastas podem seguir qualquer um dos dois jeitos abaixo.

## Como pôr uma pasta

1. Crie uma subpasta aqui com o nome exato da pasta física (o mesmo da aba Pastas do hub), por exemplo `dados/pastas/Preta P/`.
2. Ponha dentro o export do ManaBox daquela pasta (`.csv`). Pode haver mais de um arquivo: o motor lê todos os `.csv` e `.txt` da subpasta e soma.
3. Avise o Claude: ele monta de novo, e a pasta ganha página própria (`saidas/00. Pasta <pasta>.html`, aberta pelo cartão da pasta na aba Pastas do hub), com as mesmas contas da Caixa, e entra nas referências cruzadas ("está na pasta Preta P") dos painéis e do hub.

**Export novo substitui o antigo.** Quando a pasta mudar, exporte a pasta inteira de novo no ManaBox e grave por cima do arquivo antigo, com o mesmo nome. Não some exports: o motor soma tudo o que estiver na subpasta.

## O ManaBox é a verdade

O motor nunca edita os arquivos que você exporta. Numa pasta em subpasta, toda decisão (Mover, Venda, Deck, Remover na página da pasta, e também Guardar ou Venda vindos da Caixa para essa pasta) vira uma **tarefa para você fazer na mão e no ManaBox**. A página mostra "a fazer no ManaBox" até o próximo export: a tarefa fica feita quando a cópia some do arquivo da pasta de origem (e, no Mover, aparece no da pasta de destino).

## O que o CSV do ManaBox traz

- Proxy: a cópia ganha o selo "proxy", nunca vai para venda nem para deck como carta nova.
- Signed, Altered, Misprint: selos na carta; o preço do Scryfall não reflete isso, e a página avisa.
- Rarity: na linha do tipo.
- Purchase price: o valor que o ManaBox gravou no cadastro, congelado. Aparece só na gaveta da carta, discreto, e nunca entra em regra nem em soma. O valor de hoje vem do Scryfall, atualizado com `/precos`.

## Formato antigo

Ainda vale um arquivo `dados/pastas/<nome da pasta>.txt` com uma carta por linha, `2 Nome da carta`, com ou sem `(SET) 123` depois. Nesse formato o motor edita o arquivo quando aplica uma decisão (tira a cópia que saiu e põe a que chegou).

Esta pasta não é um deck: o motor não monta painel para ela.
