---
name: hub
description: "Etapa 4. Cria ou remonta o hub, a porta de entrada de todos os painéis."
model: opus
effort: high
disable-model-invocation: true
---

1. Fonte: as pastas de `dados/` (o número antes do ponto é o grupo), `contexto/inventario.csv` para os decks que ainda não têm pasta, e um resumo de cada painel calculado no build: placar, CMC médio, cartas na berlinda, entradas pendentes do radar, data da última montagem.
2. Layout: os grupos na ordem do meu aplicativo: 01. Top, 02. Tribais, 03. Caos, 04. Forfun, e 05. Desejo. Os prints em `contexto/referencias/app/` mostram como eu vejo isso hoje. Cada deck é um cartão com a capa, o nome, as cores e a situação. Deck sem painel aparece esmaecido, com "painel a fazer".
3. O cartão leva ao painel por link relativo dentro de `saidas/`, para funcionar sem internet, e mostra o link publicado quando houver.
4. Visões cruzadas, calculadas no build: cartas presentes em três ou mais decks; lista única de compras (radar com veredito de entrada e sem a marca "tenho", com deck, preço em dólar e link da LigaMagic); decks ordenados por placar e por pendências.
5. Tema do hub: próprio e neutro. Se ainda não existe, descreva dois caminhos visuais em texto e espere eu escolher.
6. `python3 motor/build.py --hub` gera `saidas/00. Hub.html`, um HTML único com as capas reduzidas e embutidas, e grava `Abrir o Hub.html` na raiz do projeto: o atalho de um clique.

Limite conhecido, que fica escrito no rodapé do hub: ele mostra a foto do último build. O que eu edito dentro de um painel fica naquele painel até eu trazer de volta com `/importar-backup`.

## Pronto quando

`Abrir o Hub.html` abre sem internet, mostra os grupos com todos os decks, e os cartões dos painéis prontos funcionam.

Ao terminar: `contexto/ESTADO.md` e commit `hub`.
