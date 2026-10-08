# Método de avaliação

Herdado da planilha do deck do Vito (em `origem/vito/`) e do painel do Clavileño.

## Agrupamentos

Cada deck tem os seus, em geral oito. Parta destes e troque o que não fizer sentido para o comandante:

Ramp, Draw, Removal, um ou dois eixos do plano do deck (Recursão e Sacrifice no Clavileño; Proteção e Buff na Giada), Tokens, Sinergia + PetCard, Especial (combos, condição de vitória, motores que rendem todo turno).

Uma carta pode pontuar em vários.

## Notas

De 0 a 3 por agrupamento:

- 0: não faz.
- 1: faz de passagem.
- 2: é função da carta.
- 3: é referência no deck.

Terreno que sempre entra virado leva −1 em Ramp. PetCard, que só o dono marca, soma 1 ponto e sai da fila de corte.

## Dois eixos, que não são o mesmo

- **Tier (S, A, B, C, D):** força da carta neste deck. S define o deck; D está fora de lugar.
- **Relevância (INS, ALT, MÉD, BAX):** permanência. INS nunca sai; ALT só sai por algo claramente melhor; MÉD cumpre papel e é trocável; BAX é a primeira a sair.

Uma staple genérica pode ser S e MÉD ao mesmo tempo. Uma carta de estimação pode ser C e INS.

## Placar do deck

Pontos do CMC médio (5 se abaixo de 2; 4 abaixo de 3; 3 abaixo de 4; 2 abaixo de 5; senão 1), mais pontos de aceleração (soma de Ramp dividida pelo CMC médio; cada 0,5 vale 5 pontos; teto de 90), mais a soma de todas as notas. Serve para comparar o deck com ele mesmo ao longo do tempo, não um deck com outro.

## Fila de corte

Relevância mais baixa primeiro, depois a prioridade sugerida, o tier e os pontos. Comandante e PetCards nunca entram. Terrenos são avaliados à parte: não se corta terreno para pôr mágica sem olhar a contagem de fontes.

## Radar

Cartas de fora, cada uma com veredito (entra, avaliar, fica de fora), motivo e quem sairia. O que foi recusado fica registrado, para não rediscutir a mesma carta a cada coleção.

**Identidade de cor é inegociável.** Nenhuma carta sugerida no radar, nos potenciais ou em qualquer lugar pode ficar fora da identidade de cor do comandante (as cores do custo e do texto dela, pelo `color_identity` do Scryfall; nunca de memória). Isso já aconteceu uma vez (Branching Evolution, verde, sugerida para o Valgavoth, preto-vermelho, por uma IA de fora) e o motor agora recusa o build se acontecer de novo (`dados.py`, checagem de identidade em `decklist.txt`, no radar e nos potenciais). Confira a identidade de toda carta candidata antes de escrevê-la no `avaliacao.json`.

## Referências usuais de Commander, como regra de bolso

35 a 37 fontes de terreno; 10 a 12 de ramp; 10 a 12 de compra; 8 a 12 remoções, com 3 a 5 em massa. Ajuste ao plano do deck e diga quando estiver se afastando de propósito.

## Fontes e o peso de cada uma

- Scryfall: texto oficial, custo, tipo, imagem, preço em dólar. É a verdade sobre a carta.
- edh.wiki e EDHREC: o que a comunidade joga com o comandante. O número de sinergia mede presença, não força, e é inflado pelas cartas de pré-construído. Sinal, nunca veredito.
- LigaMagic: preço em real. Sem acesso automático; o valor é campo manual, com link por carta.

## O que o dono revisa antes de um deck ser dado como pronto

Todas as cartas tier S, todas as BAX, as trocas sugeridas, e as cinco avaliações em que o avaliador tem menos certeza.
