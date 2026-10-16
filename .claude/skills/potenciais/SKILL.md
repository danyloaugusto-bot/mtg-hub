---
name: potenciais
description: "Relê a página da comunidade do comandante e atualiza a lista de potenciais do deck."
argument-hint: "<pasta do deck>"
model: sonnet
effort: high
disable-model-invocation: true
---

Deck: $ARGUMENTS

1. Abra a página de comunidade indicada em `deck.md` (edh.wiki ou EDHREC). Se não houver link, procure a do comandante e me mostre antes de usar.
2. Colete as cartas que a página recomenda e o número de sinergia de cada uma. Tire as que já estão no deck, no radar ou na lista das que ficam de fora, e as fora da identidade de cor. Fica a regra do dono (15/10/2026):
   - o número é a **sinergia**, nunca a inclusão (% dos decks que jogam a carta). No EDHREC, a página só mostra a inclusão ao WebFetch: a sinergia vem do JSON da página (`json.edhrec.com/pages/commanders/<comandante>[/<tema>].json`, campo `synergy` ×100);
   - **corte:** só as 25 de maior sinergia, com +10 ou mais;
   - `listas` guarda só "Alta sinergia" (`alta`) e "Mais usadas" (`top`).
   Com vários decks de uma vez, não consulte o Scryfall em paralelo: as gravações no cache disputam o arquivo, e a busca por nome pode trocar a impressão de cartas do radar (rode `motor/imagens.py` depois).
3. Para cada carta que sobrar, busque o texto oficial no Scryfall (use o cache) e escreva uma frase do que ela faz e uma de por que serviria, ou não, a este deck.
4. Grave a lista de potenciais nos dados do deck, com a data da leitura. Para o encaixe da pontuação v3 (gaveta da carta, Radar e Compras do hub) funcionar, toda potencial que ainda não está no cadastro único `dados/cartas.json` ganha entrada pela `contexto/pontuacao/RUBRICA.md` (os oito critérios da carta, `por_que` curto sem citar o deck, `fonte: "claude"`); a sinergia dela neste deck fica para quando ela for ao radar. Monte o painel de novo.
5. Mostre as dez de maior sinergia e diga quais você levaria ao radar.

Lembre: o número mede presença na comunidade, não força. Carta de pré-construído aparece inflada.

Ao terminar: uma linha no `HISTORICO.md` do deck e commit `potenciais: $ARGUMENTS`.
