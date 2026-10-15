# Análise: Linhagem Markov (Edgar Markov). Fatia 2 de 2: forte, atalho e motor

Analista: Claude | Data: 15/10/2026 | Simulação: 20 mil partidas por versão | Listas: `lista_forte_edgar.txt` e `lista_atalho_edgar.txt`

## Nota de chegada

| | Hoje | Forte | Atalho |
|---|---|---|---|
| Nota | 6,5 | 8,5 (projetada; era 9) | 7,5 (projetada; era 8) |
| Placar | 436 | 474 | 456 |
| Game Changers / Bracket | 3 / B3 | 6 / B4 | 3 / B3 |

**A simulação baixou as duas projeções em meio ponto, e o motivo é um só: mana.** Com 32 terrenos e quase nenhuma aceleração, o deck tem em média 2,8 terrenos em campo no turno 4 e conjura um Vampiro só até ali (300 partidas instrumentadas da lista de hoje). As trocas melhoram tudo o que medi. A primeira medição mostrou o próximo gargalo, terrenos e Vampiros baratos, porque a eminência rende por mágica, não por mana. Por isso acrescentei a camada 5 (dois terrenos e dois Vampiros de 1 e 2 manas) e medi de novo. A forte final tem 26 trocas e 14 Vampiros de 1 e 2 manas, contra 11 hoje.

## 4b. O motor, medido

Goldfish guloso, na jogada, sem mulligan e sem oponente. Joga terreno, pedras, depois o Edgar a partir do turno 4 se houver 6 manas com as três cores, e então os Vampiros do mais barato ao mais caro. Ataca com tudo o que pode. O "relógio da mesa" é o turno em que o dano somado passa de 120 (três oponentes com 40) ou em que o combo do Vito fica montado.

| Medida | Hoje | Forte | Atalho |
|---|---|---|---|
| Vampiros em campo no fim do turno 4 (média) | 2,6 | 3,3 | 2,9 |
| Edgar em campo até o turno 6 | 15% | 32% | 18% |
| Turno mediano do Edgar | 10 | 8 | 10 |
| Mesa morta até o turno 7 | 5% | 17% | 10% |
| Mesa morta até o turno 8 | 21% | 44% | 32% |
| Turno mediano do relógio | 10 | 9 | 9 |
| Cartas vistas até o turno 6 | 13,0 | 13,3 | 13,1 |
| Combo do Vito montado até o turno 8 | 0,4% | 0,7% | 0,3% |

**A razão do atalho.** Com 10 das 26 trocas, o atalho entrega 46% do ganho da forte na mesa morta até o turno 8, mas só 17% do ganho no Edgar até o turno 6. A diferença está na camada de mana, que o atalho leva só pela metade (Sol Ring e duas shocks), enquanto a forte leva Signet, Tithe, Three Tree City e os dois terrenos da camada 5. No placar, o atalho fica com 53% do ganho. Placar e motor divergem de novo, como nos vermelhos.

**Como conferi o simulador.** Rodei uma partida à mão (semente 7 da lista de hoje). Mão com três terrenos, sendo o Temple of Triumph virado no turno 1; Legion Lieutenant no turno 3 (a primeira mágica pagável); Shared Animosity no 4 (Bloodline Keeper pedia 4 manas). Ataque do turno 4 com o lorde e a ficha: 3 + 3 = 6. A ordem fez sentido. Também corrigi dois erros antes de reportar: o simulador tirava fontes de mana erradas depois de pagar, e conjurava remoção sem alvo no goldfish.

**Hipóteses que pesam (o que o simulador não vê):**

- Não há bloqueadores. Iroas, Cover of Darkness e o menace não aparecem nos números; o Sanctum Seeker aparece, e é por isso que ele pesa tanto.
- Remoção, proteção, limpeza e reanimação ficam na mão, porque no goldfish não há alvo.
- Convocar (Markov Baron, Clever Concealment) não foi modelado, e isso subestima um pouco hoje e forte.
- Smothering Tithe rende 2 Tesouros por rodada (mesa casual que não paga). Necropotence rende 3 cartas por turno. O Citadel vale 1 carta por turno.
- As buscas priorizam Skullclamp, Shared Animosity, Isshin e Sanctum Seeker, e não o combo; por isso o combo quase não aparece.
- Poder e resistência das criaturas que não são ficha vieram de memória. Fichas, lordes e marcadores vêm do texto conferido.
- Filtros (Fetid Heath, Graven Cairns, Rugged Prairie) contam como dupla desvirada, o que favorece um pouco a lista de hoje.

### Camada 5, medida e incorporada à forte

Depois da primeira rodada (forte com 22 trocas), medi as quatro trocas abaixo. Elas renderam +0,4 Vampiro no turno 4, +4 pontos no Edgar até o turno 6 e +6 pontos na mesa morta até o turno 8, perdendo 0,1 carta vista (sai o Idol). Entraram na forte.

| Sai | Entra | Por quê |
|---|---|---|
| Chaos Warp | Bloodtithe Harvester | Remoção que também é Vampiro de 2 e dispara a eminência. |
| Mavren Fein, Dusk Apostle | Voldaren Epicure | Vampiro de 1; o dano de entrada liga Socialite, Knight e Pit Fighter no mesmo turno. |
| Idol of Oblivion | Cavern of Souls | 33º terreno: qualquer cor para Vampiro. |
| Cover of Darkness | Vault of Champions | 34º terreno: W/B desvirada na mesa de quatro. Com Iroas, a evasão continua. |

## 5. Linhas de jogo

**Motores.**

- Eminência mais Anointed Procession: cada Vampiro conjurado vira três corpos.
- Skullclamp sem lorde em campo: {1} compra 2 com uma ficha. Com lorde, as fichas não morrem com +1/−1, e o Clamp passa a precisar de saída de sacrifício. Yahenni é a grátis; Indulgent Aristocrat e o Edgar de 2026 cobram {2}.
- Welcoming Vampire e Idol of Oblivion compram uma carta por turno, porque a eminência faz entrar ficha todo turno.
- Emeritus of Woe: o Demonic Tutor ao entrar e de novo depois de qualquer turno com duas mortes. Um ataque trocado ou uma ativação do Aristocrat já bastam.

**Fechamentos, do mais barato ao mais caro.**

1. Sanctum Seeker com a horda atacando: cada atacante drena 3 da mesa (1 de cada oponente). Com Isshin ou Roaming Throne, 6; com os dois, 12. O Bloodletter dobra tudo no seu turno.
2. Shared Animosity com doze atacantes: +11/+0 em cada um, e o dobro com Isshin.
3. Stensian Sanguinist: depois de conectar, um Exsanguinate com toda a mana que sobrar. Com Three Tree City e dez Vampiros, X passa de 10, ou seja, 30 de dano na mesa, 60 com o Bloodletter.
4. Akroma's Will (os dois modos só com o Edgar em campo) ou Kindred Charge, para dobrar o dano do turno.
5. Plano B: o combo Vito + Conqueror, buscado por Demonic, Vampiric ou Emeritus quando o combate travar.

**Como fechar a mesa, não um jogador.** O Sanctum Seeker e o Exsanguinate atingem cada oponente, e o combate não. Ataque dividido só vale com Seeker ou Bloodletter em campo. Sem eles, concentre no jogador com mais vida, que é também o que liga o Preacher.

**O momento da jogada.** O Edgar entra no turno em que paga 6 com as três cores e ataca na hora (tem ímpeto), mas só se houver pelo menos quatro Vampiros para coroar. Antes disso, cada mana vai para Vampiro barato, porque a eminência já trabalha da zona de comando. A Akroma's Will espera o Edgar em campo.

## 6b. O atalho

As 10 trocas marcadas na fatia 1, sem nenhum Game Changer novo:

- **Mana:** Blood Crypt, Godless Shrine e Sol Ring.
- **Conversão:** Sanctum Seeker, Isshin, Bloodletter, Stensian e Crippling Fear.
- **Motor:** Indulgent Aristocrat e Emeritus.

O atalho é o Bracket 3 mais forte que encontrei sem mexer em pet. Se você quiser trocar uma das dez, a primeira candidata é o Arcane Signet no lugar do Stensian, porque a mana é o gargalo medido.

## 7. Painel

**Nomes:** Linhagem Markov, Coroação de Sangue e A Corte do Patriarca. Escolho **Linhagem Markov**: a eminência é literalmente a linhagem, e foi com este deck que tudo começou.

**Clima:** galeria de retratos de família em Innistrad, à luz de lareira. Verniz velho, veludo e prata de castiçal.

| Cor | Hex | Uso |
|---|---|---|
| Verniz-âmbar | #8C5A2B | Molduras e títulos |
| Veludo-ameixa | #4A1F3D | Fundo das seções |
| Prata-de-castiçal | #C9C6BF | Texto secundário e linhas |
| Carvão-de-lareira | #1B1A1F | Fundo principal |
| Sinete-carmim | #9E1B32 | Destaques, Tier S e Game Changers |

**Moldura:** retrato oval com filete dourado para o Edgar na capa. **Motivo:** uma árvore genealógica que ganha um ramo para cada Vampiro do deck, com o Edgar no tronco e os dois outros Edgars (o noivo e o ancião de 2026) nos primeiros galhos.

## 8. Dúvidas

- **Fontes.** Texto das cartas no EDHREC e no Archidekt; regras no Grimoria (Edgar, Isshin, Roaming Throne, Emeritus e Akroma's Will); combos no Commander Spellbook (314-6191, 110-6191, 690-6191, 314-3966); percentuais nos 51.835 decks do EDHREC; precon de 2017 completo. Desde a liberação dos Game Changers usei 5 das 25 buscas.
- **Leituras minhas, não regras confirmadas:** a Akroma's Will com um modo só enquanto o Edgar está na zona de comando (regra 108.4), e o Roaming Throne não dobrando a eminência nessa zona.
- **Pets que travam espaço.** Cemetery Gatekeeper, Vampire Nocturnus e Lich-Knights' Conquest rendem pouco aqui, e digo isso uma vez. Os três ficam. Se um dia você liberar um deles, a vaga vai para um Vampiro de 1 ou 2 manas.
- **Avaliações discutíveis.** Sanctum Seeker e Indulgent Aristocrat são previsíveis (68% e 73%); entraram porque não têm substituta à altura. O Edgar de 2026 entrou mais pelo deck do que pela força: é um B. O Smothering Tithe depende da mesa não pagar.
- **A nota.** Os 8,5 e 7,5 são projeção sem partida. O teste das dez mãos decide.

**Teste das dez mãos (metas para a forte):**

- Pelo menos 3 Vampiros em campo no turno 4 em seis das dez mãos.
- Edgar em campo até o turno 6 em três das dez.
- Mesa morta, ou combo montado, até o turno 8 em quatro das dez.
- Nenhuma mão travada em dois terrenos no turno 4.
