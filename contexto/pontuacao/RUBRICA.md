# Rubrica de pontuação v3: dez critérios iguais para todos os decks

Decidida com o dono em 15/10/2026. Substitui, deck a deck, os agrupamentos próprios de cada painel (hoje são 216 colunas com 78 nomes diferentes nos 27 decks; só Ramp, Draw e Remoção aparecem em quase todos). O objetivo é um placar comparável entre decks e uma resposta honesta para duas perguntas: quanto uma carta nova melhora este deck, e em qual deck ela rende mais.

Enquanto um deck não migrar, ele continua no método antigo (`contexto/AVALIACAO.md`). O piloto é o Asas da Esperança (pasta `01. Giada`).

## Os dez critérios

Os nomes e o conteúdo de cada critério são do dono e não mudam sem ele. As chaves entre parênteses são as que vão nos arquivos.

| # | Critério (chave) | O que conta | Peso |
|---|---|---|---|
| 1 | Sinergia Primária (`sin1`) | Relação direta com a mecânica do comandante | ×2,5 |
| 2 | Sinergia Secundária (`sin2`) | A segunda mecânica do comandante, ou o que se espera do deck | ×1,5 |
| 3 | Resiliência (`resiliencia`) | Ganho de vida, resistência a mágica, anulações, vigilância | ×1 |
| 4 | Recurso (`recurso`) | Criação de fichas, filtrar o deck, recursão do cemitério | ×1 |
| 5 | Draw (`draw`) | Aumento do número de cartas na mão | ×2 |
| 6 | Amplificador (`amplificador`) | Marcadores +X/+X, copiar mágicas, proliferar, golpe duplo | ×1 |
| 7 | Remoção (`remocao`) | Destrói, exila, devolve para a mão | ×2 |
| 8 | Evasão (`evasao`) | Voar, atropelar, iniciativa, toque mortífero: o quanto é mais difícil bloquear (o conceito vem do Draft) | ×1 |
| 9 | Dano Direto (`dano`) | Tirar vida do oponente sem ser por combate | ×1 |
| 10 | Aceleradores (`aceleradores`) | Pedras de mana, tutores de terreno, redutores de custo | ×2 |

Os critérios 3 a 10 são **da carta**: a nota da Swords to Plowshares em Remoção é a mesma em qualquer deck, então é dada uma vez só, no cadastro único de cartas. Os critérios 1 e 2 são **do deck**: dependem do comandante e são dados deck a deck, a partir das duas sinergias escritas no `tema.json` de cada deck e aprovadas pelo dono.

## A nota: intensidade de 0 a 3

| Nota | Significa |
|---|---|
| 0 | Não faz. |
| 1 | Faz de passagem: condicional, pequeno, caro para o que entrega, ou só num modo raro. |
| 2 | É função da carta: faz bem, sem depender de muita coisa. |
| 3 | Excepcional: em massa, repetível todo turno, unilateral, ou faz duas vezes. |

**Regra do dono, "faz duas vezes":** se a carta cumpre o mesmo critério duas vezes, por partes diferentes do texto ou porque o outro lado da carta reforça, ela sobe um nível naquele critério (de 1 para 2, ou de 2 para 3). O teto é 3.

**Repetível, mas de 1 em 1:** ganhar 1 de vida ou causar 1 de dano a cada gatilho (Soul Warden, Blood Artist) é 2, não 3. O 3 de repetível fica para o que entrega carta, ficha, mana ou um efeito grande a cada vez.

**Uma carta pode pontuar bem num critério só.** A especialista não é penalizada por não ser multitarefa.

**Um efeito, um critério da carta.** Entre os critérios 3 a 10, o mesmo efeito não conta duas vezes. Vínculo com a vida conta em Resiliência (ganho de vida); voar conta em Evasão. Efeitos diferentes da mesma carta contam cada um no seu critério: o Opt filtra (Recurso 1) e compra (Draw 1).

**Função e encaixe podem somar.** Os critérios do deck (1 e 2) medem o encaixe com o comandante; os da carta (3 a 10) medem a função. O mesmo texto pode pontuar nos dois lados: o vínculo com a vida da Lyra conta em Resiliência e, num deck de ganho de vida, também em Sinergia Secundária. É de propósito.

### Duas regras de encaixe, que não mudam a lista do dono

- **Tutor de não-terreno conta em Recurso**, como filtrar o deck: buscar a carta certa é a forma mais forte de filtrar. Busca qualquer carta (Demonic Tutor): 3. Busca um tipo, ou põe no topo (Enlightened Tutor): 2. Tutor de terreno continua em Aceleradores.
- **Não há critério de fechamento.** O jeito de ganhar aparece pela soma de Sinergia, Dano Direto e Amplificador.

### Outras regras

- **Terreno básico:** 0 em tudo. A base de mana é medida à parte, pelas fontes de terreno.
- **Terreno com efeito:** pontua pelo efeito. Terreno que gera duas cores, ou entra desvirado de graça, não conta como acelerador. Terreno que gera mais de uma mana conta.
- **Terreno que sempre entra virado:** não tem mais nota negativa. A lentidão continua aparecendo na leitura de terrenos virados do painel.
- **Cartas de duas faces:** as duas faces contam. O outro lado reforçar o mesmo critério é a regra de "faz duas vezes".
- **Comandante:** pontua como as outras cartas e entra na soma do deck.
- **Cópias:** a pontuação vale por cópia (básicos, Relentless Rats, Persistent Petitioners).

## Exemplos de calibração

São âncoras para todo avaliador, humano ou IA, dar a mesma nota à mesma carta.

| Critério | Nota 1 | Nota 2 | Nota 3 |
|---|---|---|---|
| Resiliência | Serra Angel (vigilância); criatura com vínculo com a vida | Swiftfoot Boots (resistência a mágica); Counterspell (anulação); Soul Warden (ganho repetível pequeno) | Heroic Intervention, Teferi's Protection (protegem tudo) |
| Recurso | Opt (filtra 1); cria uma ficha uma vez | Raise Dead; Enlightened Tutor; várias fichas de uma vez | Bitterblossom (ficha todo turno); Living Death; Demonic Tutor |
| Draw | Opt (compra 1) | Night's Whisper (compra 2) | Rhystic Study, Phyrexian Arena (todo turno) |
| Amplificador | Um marcador +1/+1, uma vez | Glorious Anthem (todo o time, +1/+1) | Doubling Season; True Conviction (golpe duplo para todos) |
| Remoção | Remoção condicional ou por luta | Swords to Plowshares, Murder | Wrath of God, Cyclonic Rift (em massa) |
| Evasão | Serra Angel (voar) | Whispersilk Cloak (não pode ser bloqueada) | Levitation (o time inteiro voa) |
| Dano Direto | Um choque, uma vez | Blood Artist (1 por morte) | Gray Merchant of Asphodel, Sanguine Bond (em massa ou em laço) |
| Aceleradores | Wayfarer's Bauble (lento e caro) | Arcane Signet, Cultivate | Sol Ring |
| Sinergia (Asas da Esperança) | Anjo que só é Anjo | Anjo que entra e cresce com a Giada | Peça em volta da qual o deck foi montado |

## Do critério ao placar

**Pontos por nota.** A nota vira pontos numa escala que cresce mais rápido no topo, para uma carta excepcional valer mais que quatro efeitos de passagem:

| Nota | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Pontos | 0 | 1 | 3 | 6 |

Uma carta 1+1+1+1 soma 4 e perde para uma Swords (Remoção 3 = 6). Uma carta 2+2 empata com ela. Revisar no piloto.

**Valor da carta** = soma, nos dez critérios, de peso × pontos da nota, multiplicada pelo número de cópias.

Exemplo no Asas da Esperança, com as sinergias "Anjos" e "marcadores e ganho de vida":

| Carta | sin1 (×2,5) | sin2 (×1,5) | resiliencia (×1) | amplificador (×1) | evasao (×1) | Valor |
|---|---|---|---|---|---|---|
| Lyra Dawnbringer | 2 → 3 | 2 → 3 | 1 → 1 | 2 → 3 | 1 → 1 | 7,5 + 4,5 + 1 + 3 + 1 = **17** |
| Serra Angel | 2 → 3 | 0 | 1 → 1 | 0 | 1 → 1 | 7,5 + 1 + 1 = **9,5** |

**Placar do deck** = soma dos valores das cartas + pontos de aceleração. Não há teto.

**Pontos de aceleração** são a mesma conta de hoje, com a tabela do dono:
- X = CMC médio das mágicas, sem terrenos, como hoje.
- Y = soma das notas de 0 a 3 em Aceleradores (as notas, não os pontos) dividida por X.
- Pontos = 5 se Y < 0,5; depois +5 a cada 0,5 de Y; teto de 90 a partir de 8,5. Em fórmula: `min(90, 5 × (piso(2Y) + 1))`, e 0 se Y for negativo.

É exatamente a fórmula do Excel do dono, com a célula E6 = Y.

Os pontos do CMC médio do método antigo (de 1 a 5) saem: o CMC médio entra só como divisor da aceleração. Se o dono quiser de volta, é uma linha no `pontuacao.json`.

Ponto de atenção para o piloto: com dez critérios pesados, a soma das cartas de um deck deve ficar na casa das centenas. A aceleração, que hoje é perto de um quinto do placar, vai pesar menos. O piloto mostra o tamanho real, e o dono decide se mantém.

## Troca e encaixe: o que entra e o que sai

O placar é uma soma pura e comparável. A pergunta "quanto esta carta melhora este deck" leva em conta mais uma coisa: **saturação**.

- Cada critério tem um alvo igual para todos os decks, em número de cartas com nota 2 ou mais (tabela abaixo).
- Na conta de troca, um critério abaixo do alvo vale 1,5×; dentro da faixa, 1×; acima, 0,5×.
- **Ganho da troca** = valor com saturação da carta que entra − valor da carta que sai.
- **Quem sai:** a carta de menor valor no deck, fora o comandante, as intocáveis (`fora_do_corte`) e os terrenos (terreno se troca por terreno).

| Critério | Faixa (cartas com nota 2 ou mais) |
|---|---|
| sin1 | 20 a 30 |
| sin2 | 8 a 15 |
| resiliencia | 5 a 10 |
| recurso | 5 a 10 |
| draw | 10 a 12 |
| amplificador | 4 a 8 |
| remocao | 8 a 12 |
| evasao | 6 a 12 |
| dano | 3 a 8 |
| aceleradores | 10 a 12 |

Draw, Remoção e Aceleradores seguem as referências usuais de Commander que o projeto já usa. As outras são proposta inicial, a calibrar no piloto.

**Encaixe de uma carta:** ao clicar numa carta (gaveta do painel, Radar e Compras do hub), o hub calcula o ganho da troca em cada um dos decks e lista os melhores. Para cada deck mostra quem sairia, quais critérios abaixo do alvo a carta cobre ali, e a nota de sinergia. Se a carta nunca foi avaliada para aquele comandante, mostra "sinergia a avaliar" e conta a sinergia como 0: o número é um piso, não uma estimativa.
