# Caixa: o plano (v2, 17/10/2026)

**Para quem é:** o dono e o Claude Code. A v2 substitui a v1 da mesma noite: o dono revisou seis pontos depois do primeiro protótipo. O pedido para o Code está em `PROMPT-CODE-CAIXA.md`; o protótipo, em `prototipo/` (o Vilis, com dados reais).

## O problema

Uma pilha de cartas boas numa caixa, sem destino. Cada cópia vai para um de cinco lugares, e a mesma carta pode servir a mais de um deck: é preciso saber se vai para o deck A ou o B, se uma segunda cópia tem casa, e se uma carta forte que está fora de todo radar vale mais num deck ou na troca.

| Destino | O que é, nas palavras do dono |
|---|---|
| Deck | Tier alto, ou entra num 8×8 no lugar de uma carta mais fraca ou de custo alto |
| Guardar | Pasta de fácil acesso: troca entre decks ou deck futuro (05. Desejo) |
| Bundles | Mediana hoje, com potencial para algum dia |
| Venda | Sem sinergia com deck atual ou futuro; vale a troca por algo melhor |
| Bulk | Praticamente lixo |

## As cinco perguntas que a Caixa responde para cada carta

1. **Onde ela rende mais?** O encaixe da pontuação v3 (`motor/encaixe.py`) contra todos os decks nas cores dela, com quem sairia. O ganho compara com a carta mais fraca do deck, então quase sempre dá positivo: sem sinergia avaliada, o número é um piso. Por isso o `/caixa` avalia a sinergia antes de o dono decidir.
2. **Ela é forte sozinha?** O valor próprio (os oito critérios do cadastro, sem sinergia), a posição no EDHREC (`edhrec_rank`, que o cache do Scryfall já guarda) e o selo de Game Changer. As duas medidas olham coisas diferentes: a régua mede o que a carta faz, o EDHREC mede o quanto a comunidade joga. Staple e Game Changer nunca vão para o Bulk.
3. **Com quem a comunidade joga ela?** Os comandantes que mais jogam a carta, na página da carta no EDHREC, com a porcentagem. Quando um deles é comandante de um deck do dono, esse deck entra na avaliação de sinergia mesmo que o encaixe o ponha lá embaixo. No Vilis: 71% dos decks de K'rrik e 50% dos de Kaalia jogam a carta; a Kaalia estava em +12 no encaixe porque a sinergia dela nunca foi avaliada.
4. **Quanto vale?** Preço do Scryfall em dólar, pela impressão e pelo acabamento de cada cópia. Decide entre Venda e Bulk (US$ 5), sobe a prioridade de carta cara sem casa (US$ 20, "capital parado") e marca a carta cara que rende pouco no deck sugerido ("vendida, paga cartas que rendem mais"). Não troca sozinho um deck bom por venda: isso é decisão do dono, com a marca na tela.
5. **Quantas cópias e para onde cada uma?** A decisão é cópia a cópia. A segunda cópia vai para o próximo deck que a quer; sem outro deck, cai para Guardar, Venda ou abaixo.

## Decisões do dono (17/10/2026)

| # | Decisão | Origem |
|---|---|---|
| 1 | A Caixa mostra preço e usa preço para decidir: exceção à decisão "Sem preço" de 14/10, só na Caixa. Painéis e hub seguem sem preço | 20h33: "o critério de valor da carta seja decisivo de alguma forma" |
| 2 | Corte de venda em US$ 5, pelo preço do Scryfall | 19h54 |
| 3 | Limiares 10 (Deck) e 5 (Guardar), a calibrar na primeira lista | 19h54 |
| 4 | Pastas físicas: o dono explica cada uma quando mandar a lista dela; até lá, a Caixa pergunta a pasta na hora | 19h54 |
| 5 | Deck sugerido entra no radar como "avaliar"; a força da recomendação vem da prioridade S, A, B, C | 19h54 |
| 6 | Tabela ordenável, e também galeria, com agrupar por prioridade, tipo, destino, cor ou deck | 19h54 e 20h33 |
| 7 | Cópias: selo ×N no canto com duas ou mais, decisão por cópia | 20h33 |
| 8 | Força sozinha, staples e Game Changers pesam na sugestão | 20h33 |
| 9 | Comandantes que mais jogam a carta, pelo EDHREC | 20h33 |
| 10 | Listas em txt ou CSV; CSV preferido quando traz impressão e acabamento | 20h33, recomendação do Claude |

## Por que uma página própria

Com 200 cartas, as imagens a 260px somam uns 4 a 5 MB; o hub já tem 3,9 MB e o teto da página publicada é 16 MiB. A Caixa vira uma página como um painel de deck (`saidas/00. Caixa.html`), com botão no hub, e a Caixa entra como mais uma "pasta" nas referências cruzadas dos painéis e do hub ("está na Caixa"). A caixa esvazia à medida que as decisões são aplicadas, então o tamanho se regula sozinho; se uma lista nova estourar, o build recusa e pede lote.

## A régua (`motor/caixa.json`) e as regras

Os números e a ordem das regras estão no `PROMPT-CODE-CAIXA.md`, Fase 1, itens 2 e 4. Resumo, cópia a cópia:

| Ordem | Quando | Destino e prioridade |
|---|---|---|
| 1 | Radar pede como "entra" | Deck, S |
| 2 | Ganho com sinergia avaliada ≥ 10 | Deck, S (sinergia 3 cobrindo critério curto, ou Game Changer) ou A |
| 3 | Radar "avaliar"; ganho 5 a 10; deck de Desejo; comandante do dono no EDHREC; forte sem deck | Guardar, A (≥ US$ 20 ou GC) ou B |
| 4 | Preço ≥ US$ 5 | Venda, A (≥ US$ 20) ou B |
| 5 | Valor próprio ≥ 7 ou top 3.000 do EDHREC | Bundles, C |
| 6 | O resto (nunca staple nem GC) | Bulk, C |

Calibração: no cadastro de 2.551 cartas, o valor próprio tem mediana 6 e 10% de 12 para cima; 25% das cartas com preço passam de US$ 5 e 6% de US$ 20.

## Formato das listas

- **Decks:** continua `decklist.txt`. É o que os aplicativos importam e exportam, e o deck não precisa de condição nem preço.
- **Caixa e pastas:** o que o aplicativo exportar com mais informação. CSV com coleção, número e foil (e, se vier, idioma, condição e o id do Scryfall) é o melhor, porque o preço depende da impressão e do acabamento: o Vilis normal da M20 vale US$ 9,97, o foil US$ 17,26 e a promo do Valgavoth US$ 11,30. txt com `(SET) número` e `*F*` serve igual. Lista só com nomes é a pior: o preço cai na impressão padrão do Scryfall.
- As listas ficam em `dados/caixa/listas/`, uma por lote, e nunca são editadas. A caixa é a soma das listas menos as cópias com decisão aplicada.

## Limites conhecidos

- Preço em dólar do Scryfall (TCGplayer) não é o preço da LigaMagic. A tela traz o link da LigaMagic para conferir antes de vender. `cambio_brl` em `caixa.json` liga o "≈ R$" se o dono quiser.
- Carta em português: o Scryfall dá o preço da impressão em inglês; a tela avisa.
- EDHREC sem a página da carta, ou fora do ar: a carta fica sem o bloco, sem erro.
