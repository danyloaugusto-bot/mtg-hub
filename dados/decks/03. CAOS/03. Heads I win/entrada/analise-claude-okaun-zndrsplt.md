# Análise: Cara ou Coroa (Okaun, Eye of Chaos + Zndrsplt, Eye of Wisdom)
Analista: Claude | Data: 14/10/2026
Lista conferida: sim. São 100 cartas com os dois comandantes, nenhuma repetida fora os básicos, tudo dentro de U/R e nenhuma banida | Cartas sem texto conferido: 0

## Nota de partida

**Nota atual: 7 de 10.** **Projetada com as 10 trocas: 8,5**, como projeção sem partida.

O deck é melhor do que você descreveu, e por um motivo que você não citou. **Ele já tem um combo de duas cartas com o comandante:** Frenetic Efreet mais Okaun. O Efreet ativa a habilidade de custo {0} quantas vezes você quiser antes de qualquer uma resolver, e cada moeda vencida dobra o Okaun. O resultado é poder infinito até o fim do turno (Commander Spellbook, combo 2199-2779). O mesmo Efreet também fecha com:

- o **Zndrsplt**: compra tantas cartas quanto você quiser;
- a **Tavern Scoundrel**: mana infinita (combo 211-2199);
- a **Chance Encounter**: vitória na manutenção seguinte (combo 2199-4800).

A nota não é mais alta porque o deck chega ao Efreet em 33% das partidas até o turno 6. Ao Thumb, chega em 84%. Ele investe nove tutores e recompras no motor e quase nada na peça que vence.

**Como li o pedido.** Você pediu critério, poucas trocas e a essência do precon preservada. Então a entrega são **10 trocas, e nenhuma mexe no tema de moedas**. As cartas que saem são as que nada fazem, as que entram viradas ou as que atrapalham o próprio deck. Você pediu para não perguntar sobre bracket nem cartas de estimação. Só registro um fato: o combo com o comandante já estava na lista. As trocas não adicionam Game Changer: continuam três, Cyclonic Rift, Gamble e Rhystic Study.

---

## 1. Plano

### 1.1 O que os comandantes fazem, palavra por palavra

Os dois têm o mesmo gatilho: "No início do combate no **seu** turno, jogue moedas até perder uma". A recompensa é que muda:

- **Okaun:** "sempre que **um jogador** vence uma moeda, dobre o poder e a resistência do Okaun até o fim do turno".
- **Zndrsplt:** "sempre que **um jogador** vence uma moeda, compre uma carta".

Leituras que decidem o deck:

| O que se costuma achar | O que o texto e as regras dizem | Fonte |
|---|---|---|
| O Thumb é a peça principal | O Thumb leva cada moeda de 50% para 75%. O Efreet transforma qualquer moeda em combo | Texto do Thumb; Commander Spellbook |
| Só as minhas moedas contam | "Um jogador" vence. Quando um oponente vence a moeda da Planar Chaos, você compra e o Okaun dobra | Texto dos comandantes; ruling de 13/07/2018 |
| A moeda ignorada pelo Thumb conta | Não conta: nem vence, nem perde | Texto do Thumb e regra 614.6; sem ruling explícita |
| Com o Thumb, o "até perder" fica igual | Cada moeda da sequência vira um par, e você escolhe. São 75% a cada uma | Ruling do Thumb ("cada moeda individual") |
| O Efreet precisa sobreviver | Não precisa. As ativações já estão na pilha. Se a primeira perde, ele é sacrificado e as outras continuam jogando moedas | Commander Spellbook, passos dos três combos |
| Krark pode ser o parceiro | Não pode. Okaun e Zndrsplt têm "Partner with" um com o outro | Ruling dos comandantes |
| O −7 do Ral Zarek dispara os comandantes | Não dispara. Ele conta caras e não fala em vencer | Texto do Ral Zarek |
| A cópia do Spark Double morre pela regra de lenda | Não morre, porque ela não é lendária. Com Krark, Spark Double e Sakashima, a mágica copiada e a devolvida coexistem | Rulings do Krark de 10/11/2020 |

### 1.2 A conta do deck

**Virar, dobrar, conectar.**

Três vitórias põem o Okaun em 24 (3, 6, 12, 24), e 21 de dano de comandante matam um oponente. A chance de chegar lá num combate:

| Sequências de moedas no combate | Sem Thumb | Com Thumb |
|---|---|---|
| 1 | 12% | 42% |
| 2 | 31% | 74% |
| 3 | 50% | 90% |

Com os dois comandantes e o Thumb, o deck mata um oponente por combate em 74% das vezes. O Thumb vale 43 pontos percentuais. Uma terceira sequência (Strionic Resonator ou Spark Double) vale mais 16.

O Efreet passa por cima dessa conta: a chance vira 100%, com ou sem Thumb.

Em linguagem de FP&A, o Thumb melhora a margem de cada operação; o Efreet é a operação que paga o ano. O deck tem 13 caminhos até a margem e 3 até a operação.

### 1.3 Onde a lista trai o plano, em ordem de gravidade

1. **Gerar e converter desequilibrados.** São 13 cartas que acham ou recompram o Thumb e 3 que chegam ao Efreet (ele, Gamble e Long-Term Plans).
2. **A Possibility Storm desmonta o próprio combo.** Com ela em campo, o Efreet, a Chance Encounter, a Chandra's Ignition e todos os seus tutores viram cartas aleatórias do mesmo tipo quando saem da mão.
3. **Terrenos que custam tempo:** 6 entram virados, 8 são só incolores, e o Niv-Mizzet pede UUURRR. A Flamekin Village entra sempre virada, porque a lista não tem Elemental.
4. **Evasão fina para o Okaun:** só a Whispersilk Cloak e o Rogue's Passage garantem que ele conecte. O Okaun grande e bloqueado não mata ninguém. Atropelar existe em Crash Through, Shadowspear, Footfall Crater, Temur Battle Rage e Embercleave.
5. **Pouca proteção no turno do combo.** São 6 cartas, quase todas equipamentos. Nada responde a uma remoção no Efreet ou no Okaun com a habilidade na pilha.

### 1.4 As três fases

| Fase | O que o deck deve fazer | Hoje | Com as trocas |
|---|---|---|---|
| Início (turnos 1 a 4) | Rock, Thumb ou Scoundrel, e o primeiro comandante | Thumb acessível até o turno 4 em 78% | Efreet acessível até o turno 4: de 28% para 42% |
| Meio (turnos 5 a 7) | Os dois comandantes em campo, com bota; o Zndrsplt compra no seu combate | Duas sequências por combate | Até três, com o Resonator; o Edgar garante a primeira vitória |
| Fim | Okaun conecta com 24 ou mais, ou entra o Efreet | Efreet acessível até o turno 6 em 33% | 49%, com Counterspell e Deflecting Swat para proteger o turno |

---

## 2. Agrupamentos

Você não mandou eixos, então criei oito. Ordem das notas: Ramp · Combustível · Interação · Proteção · Moeda · Converter · Evasão · Fechamento.

| Eixo | O que mede |
|---|---|
| Ramp | Mana. Terreno que sempre entra virado leva −1 |
| Combustível | Compra e tutor |
| Interação | Remoção e anulação |
| Proteção | Mantém comandantes, Thumb e Efreet vivos |
| Moeda | Gera moedas |
| Converter | Transforma moeda vencida em dano, cartas ou vitória |
| Evasão | Faz o Okaun conectar |
| Fechamento | Encurta o jogo |

O eixo Evasão tem poucas cartas dedicadas (2). Mantive mesmo assim, porque é a pergunta que mais decide o fim do jogo.

| Eixo | Dedicadas hoje | Depois | Soma hoje | Depois |
|---|---|---|---|---|
| Ramp | 8 | 8 | 13 | 14 |
| Combustível | 15 | 18 | 50 | 55 |
| Interação | 8 | 9 | 25 | 27 |
| Proteção | 6 | 8 | 18 | 23 |
| Moeda | 14 | 16 | 44 | 46 |
| Converter | 14 | 16 | 50 | 54 |
| Evasão | 2 | 2 | 16 | 15 |
| Fechamento | 11 | 12 | 39 | 41 |

---

## 3. Carta a carta

### Comandantes (2)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Okaun, Eye of Chaos | 0·0·0·0·2·3·0·3 | S | INS | No início do combate no seu turno, joga moedas até perder. Cada moeda que qualquer jogador vence dobra P/R dele até o fim do turno | É o relógio do deck: 3 vitórias põem um 3/3 em 24. Com o Efreet, poder infinito |
| Zndrsplt, Eye of Wisdom | 0·3·0·0·2·3·0·1 | S | INS | Mesmo gatilho de moedas; cada moeda que qualquer jogador vence compra uma carta | O motor de cartas. Com o Efreet, compra quantas você quiser |

### Criaturas (14)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Frenetic Efreet | 0·0·0·2·3·3·0·3 | S | INS | {0}: moeda; vitória faz sair de fase, derrota sacrifica | Ativado N vezes de uma vez: N moedas grátis. Com Okaun, Zndrsplt, Scoundrel ou Chance Encounter, é combo |
| Tavern Scoundrel | 2·0·0·0·2·3·0·1 | S | INS | Cada moeda vencida dá 2 Tesouros; sacrifica permanente: moeda | Com o Efreet, mana infinita |
| Krark, the Thumbless | 0·1·0·0·2·2·0·0 | A | ALT | Moeda a cada instantânea ou feitiço: vitória copia, derrota devolve | Copia Stitch, Seize e Fiery Gambit |
| Niv-Mizzet, Parun | 0·2·1·0·0·2·0·3 | A | ALT | Cada compra causa 1 de dano | Com o Zndrsplt, cada vitória vira dano; com a Curiosity, combo |
| Spark Double | 0·0·0·0·2·2·0·0 | A | ALT | Cópia não lendária | Um terceiro comandante: mais uma sequência |
| Yusri, Fortune's Flame | 0·2·0·0·3·1·1·0 | A | ALT | Voa; ao atacar, 1 a 5 moedas: compra por vitória | Atacando com o Okaun, cada vitória também o dobra |
| Goblin Traprunner | 0·0·0·0·2·1·0·1 | B | MÉD | Ao atacar, 3 moedas; ficha atacante por vitória | Atacando com o Okaun, mais três chances de dobra |
| Sakashima the Impostor | 0·0·0·0·2·2·0·0 | B | ALT | Cópia que mantém o nome | Idem |
| Tribute Mage | 0·2·0·0·0·0·0·0 | B | MÉD | Ao entrar, busca artefato de MV 2 | Acha o Thumb |
| Goblin Archaeologist | 0·0·1·0·1·0·0·0 | C | MÉD | Moeda: destrói artefato na vitória, sacrifica na derrota | Utilidade |
| Goblin Engineer | 0·1·0·0·0·0·0·0 | C | MÉD | Põe artefato no cemitério; sacrifica artefato: volta um de MV 3 | Thumb pelo cemitério |
| Mogg Assassin | 0·0·2·0·1·0·0·0 | C | MÉD | Destrói o alvo escolhido conforme a moeda | Remoção repetível a 75% |
| Goblin Kaboomist | 0·0·0·0·1·0·0·0 | D | BAX | Ficha Land Mine por manutenção; moeda que fere a si mesmo | Fichas que quase nunca importam |
| Karplusan Minotaur | 0·0·1·0·1·0·0·0 | D | BAX | Manutenção cumulativa de moedas; 1 de dano por resultado | Quatro manas por pings de 1 |

### Instantâneas e feitiços (24)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Cyclonic Rift | 0·0·3·0·0·0·1·2 | S | INS | Devolve permanente; sobrecarga devolve tudo dos oponentes | Game Changer; limpa o caminho do Okaun |
| Chandra's Ignition | 0·0·2·0·0·2·0·3 | A | ALT | Sua criatura causa dano igual ao poder a cada outra criatura e a cada oponente | Com o Okaun infinito, mata a mesa |
| Chaos Warp | 0·0·3·0·0·0·0·0 | A | ALT | Embaralha permanente | Remoção universal |
| Fiery Gambit | 0·2·1·0·2·2·0·2 | A | ALT | Moedas até parar: 3 de dano, 6 em cada oponente, compra 9 | Cada vitória também dobra o Okaun |
| Gamble | 0·3·0·0·0·0·0·0 | A | ALT | Tutor; descarta aleatória | Game Changer; acha o Efreet ou o Thumb |
| Seize the Day | 0·0·0·0·0·2·0·2 | A | ALT | Combate extra; flashback | Duas sequências de moedas a mais |
| Stitch in Time | 0·0·0·0·1·2·0·2 | A | ALT | Moeda: turno extra na vitória | Turno extra a 75% |
| Temur Battle Rage | 0·0·0·0·0·2·1·2 | A | ALT | Golpe duplo e atropelar | Okaun grande vira letal |
| Blasphemous Act | 0·0·2·0·0·0·0·0 | B | MÉD | 13 em cada criatura | Mata seus comandantes |
| Expressive Iteration | 0·2·0·0·0·0·0·0 | B | MÉD | Olha 3, pega 1, joga outra | Seleção |
| Fabricate | 0·2·0·0·0·0·0·0 | B | MÉD | Tutor de artefato | Acha o Thumb |
| Invert Polarity | 0·0·2·1·1·0·0·0 | B | ALT | Moeda: vitória rouba a mágica, derrota anula | Anulação que não falha |
| Irenicus's Vile Duplication | 0·0·0·0·2·2·1·0 | B | MÉD | Ficha cópia não lendária com voo | Okaun voador ou Zndrsplt extra |
| Long-Term Plans | 0·2·0·0·0·0·0·0 | B | ALT | Tutor para a 3ª do topo | Lento, mas acha qualquer peça |
| Mizzium Mortars | 0·0·2·0·0·0·0·0 | B | ALT | 4 de dano; sobrecarga em todas dos oponentes | Limpeza unilateral |
| Muddle the Mixture | 0·2·2·0·0·0·0·0 | B | ALT | Anula; transmute para MV 2 | Acha Thumb, Scoundrel ou Krark |
| Ponder | 0·2·0·0·0·0·0·0 | B | MÉD | Olha 3 e compra | Seleção |
| Reckless Handling | 0·2·0·0·0·0·0·0 | B | MÉD | Tutor de artefato; descarta aleatória | Acha o Thumb |
| Squee's Revenge | 0·2·0·0·2·1·0·0 | B | MÉD | Escolhe N moedas; vence todas e compra 2N | Compra e dobra |
| Valakut Awakening | 0·2·0·0·0·0·0·0 | B | ALT | Troca a mão; verso é terreno R virado | Dupla função |
| Whir of Invention | 0·2·0·0·0·0·0·0 | B | ALT | Artefato de MV X no campo, instantâneo | Thumb em campo no turno do oponente |
| Crash Through | 0·1·0·0·0·0·1·0 | C | MÉD | Atropelar a todas; compra | Barato |
| Reshape | 0·1·0·0·0·0·0·0 | C | BAX | Sacrifica artefato: artefato de MV X no campo | Sexto tutor de artefato; pede outro artefato |
| Fighting Chance | 0·0·0·1·1·0·0·0 | D | BAX | Moeda por bloqueador; previne o dano dele | Neblina parcial |

### Artefatos (17)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Krark's Thumb | 0·0·0·0·3·0·0·0 | S | INS | Joga duas moedas e ignora uma | Cada moeda vence 75% das vezes. Melhora tudo, mas não ganha sozinho |
| Sol Ring | 3·0·0·0·0·0·0·0 | S | INS | {C}{C} | Comandante no turno 3 |
| Arcane Signet | 2·0·0·0·0·0·0·0 | A | INS | U ou R | Rock de cor |
| Embercleave | 0·0·0·0·0·2·1·2 | A | ALT | Lampejo; golpe duplo e atropelar | Okaun com golpe duplo |
| Lightning Greaves | 0·0·0·3·0·0·1·0 | A | INS | Ímpeto e shroud | Comandante ataca no turno em que entra |
| Swiftfoot Boots | 0·0·0·3·0·0·1·0 | A | INS | Ímpeto e hexproof | Idem |
| Whispersilk Cloak | 0·0·0·2·0·0·3·0 | A | ALT | Imbloqueável e shroud | O Okaun conecta |
| Champion's Helm | 0·0·0·2·0·1·0·0 | B | MÉD | +2/+2; hexproof em lendária | Okaun 5/5 antes de dobrar |
| Commander's Plate | 0·0·0·2·0·1·0·0 | B | MÉD | +3/+3 e proteção das cores fora da identidade | Okaun 6/6 antes de dobrar |
| Izzet Signet | 2·0·0·0·0·0·0·0 | B | ALT | {1}: {U}{R} | Rock de cor |
| Mind Stone | 2·1·0·0·0·0·0·0 | B | MÉD | C; sacrifica e compra | Rock incolor |
| Shadowspear | 0·0·0·0·0·1·1·0 | B | MÉD | +1/+1, atropelar, vínculo | Atropelar barato |
| Talisman of Creativity | 2·0·0·0·0·0·0·0 | B | ALT | C, ou U/R com 1 de dano | Rock de cor |
| Thought Vessel | 2·0·0·0·0·0·0·0 | B | ALT | C; sem limite de mão | O Zndrsplt enche a mão |
| Cursed Mirror | 2·0·0·0·0·0·0·0 | C | MÉD | R; pode entrar como cópia de criatura por um turno | Cópia de comandante é lendária e morre |
| Midnight Clock | 1·1·0·0·0·0·0·0 | D | BAX | U; no 12º marcador, compra 7 e reinicia | Rock de 3 lento num deck que já compra muito |
| Two-Handed Axe | 0·0·0·0·0·1·0·1 | D | BAX | Dobra o poder ao atacar | Uma dobra a mais por 5 manas no total |

### Encantamentos e planeswalker (9)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Chance Encounter | 0·0·0·0·0·3·0·3 | A | ALT | Marcador por moeda vencida; 10 marcadores vencem o jogo | Com o Efreet, vence na manutenção seguinte |
| Curiosity | 0·1·0·0·0·1·0·3 | A | ALT | Dano a oponente: compra | Com o Niv-Mizzet, combo de dano |
| Rhystic Study | 0·3·0·0·0·0·0·0 | A | ALT | Compra quando o oponente não paga 1 | Game Changer |
| Impulsive Maneuvers | 0·0·0·0·2·1·0·1 | B | MÉD | Moeda por atacante; vitória dobra o próximo dano de combate | Dobra o Okaun duas vezes por vitória |
| Planar Chaos | 0·1·1·0·2·1·0·0 | B | MÉD | Quem conjura joga moeda; derrota anula | Vitória do oponente também dispara seus comandantes |
| Ral Zarek | 0·0·1·0·1·1·0·1 | B | MÉD | +1 vira e desvira; −2 dá 3; −7 cinco moedas, turnos extras | O −7 não usa "vencer", então não dispara os comandantes |
| Footfall Crater | 0·0·0·0·0·0·1·0 | C | MÉD | Aura de terreno: ímpeto e atropelar | Ciclagem 1 |
| Mirror March | 0·0·0·0·2·1·0·1 | C | MÉD | Criatura entra: moedas até perder, cópia por vitória | Caro; cada vitória também dobra o Okaun |
| Possibility Storm | 0·0·1·0·0·0·0·0 | D | BAX | Mágica da mão vira outra do mesmo tipo, de graça | Troca o seu Efreet, o seu Chance Encounter e os seus tutores por cartas aleatórias |

### Terrenos (34)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Command Tower | 0·0·0·0·0·0·0·0 | A | INS | U ou R | Melhor dual do deck |
| Academy Ruins | 0·1·0·1·0·0·0·0 | B | ALT | Incolor; artefato do cemitério para o topo | Recompra o Thumb |
| Buried Ruin | 0·1·0·1·0·0·0·0 | B | ALT | Incolor; sacrifica: artefato do cemitério para a mão | Recompra o Thumb |
| Cascade Bluffs | 0·0·0·0·0·0·0·0 | B | MÉD | Filtro U/R | Precisa de outra fonte para filtrar |
| Exotic Orchard | 0·0·0·0·0·0·0·0 | B | MÉD | Cor de terreno de oponente | Depende da mesa |
| 5× Island | 0·0·0·0·0·0·0·0 | B | MÉD | U | Básico |
| Izzet Boilerworks | 0·0·0·0·0·0·0·0 | B | MÉD | Virado; devolve um terreno; {U}{R} | Duas cores numa vaga |
| 7× Mountain | 0·0·0·0·0·0·0·0 | B | MÉD | R | Básico |
| Riverglide Pathway | 0·0·0·0·0·0·0·0 | B | ALT | U ou R, escolhe a face | Desvirado |
| Rogue's Passage | 0·0·0·0·0·0·2·1 | B | ALT | Incolor; {4},{T}: imbloqueável | O Okaun precisa conectar |
| Shivan Reef | 0·0·0·0·0·0·0·0 | B | ALT | Painland U/R | Desvirado |
| Stormcarved Coast | 0·0·0·0·0·0·0·0 | B | ALT | U/R; virado com menos de 2 outros terrenos | Bom do turno 3 em diante |
| Sulfur Falls | 0·0·0·0·0·0·0·0 | B | ALT | Checkland U/R | Quase sempre desvirado |
| The Gold Saucer | 0·0·0·0·1·1·0·0 | B | ALT | Incolor; {2},{T}: moeda, Tesouro na vitória | Moeda em velocidade de ativação, na vaga de terreno |
| Training Center | 0·0·0·0·0·0·0·0 | B | ALT | U/R; desvirado com 2+ oponentes | Sempre desvirado na mesa de quatro |
| Desolate Lighthouse | 0·1·0·0·0·0·0·0 | C | MÉD | Incolor; {1}{U}{R},{T}: loot | Filtro tardio |
| Great Furnace | 0·0·0·0·0·0·0·0 | C | MÉD | Terreno artefato R | Conta para improvise do Whir |
| Inventors' Fair | 0·1·0·0·0·0·0·0 | C | MÉD | Incolor; com 3 artefatos, sacrifica: tutor de artefato | Acha o Thumb tarde |
| Spinerock Knoll | -1·1·0·0·0·0·0·1 | C | MÉD | Virado; hideaway; joga a carta se um oponente levou 7 | O Okaun dá 7 com folga |
| Temple of Epiphany | -1·1·0·0·0·0·0·0 | C | MÉD | Virado; U/R; vidência 1 | Dual lenta |
| Tolaria West | -1·1·0·0·0·0·0·0 | C | MÉD | Virado; U; transmute para MV 0 | Busca terreno ou carta de MV 0 |
| Flamekin Village | -1·0·0·0·0·0·1·0 | D | BAX | R; virado sem Elemental na mão; {R},{T}: ímpeto | A lista não tem Elemental: entra sempre virado |
| Myriad Landscape | -1·0·0·0·0·0·0·0 | D | BAX | Virado; {2}, sacrifica: dois básicos do mesmo tipo virados | Só 12 básicos e três manas para virar dois terrenos |
| Reliquary Tower | 0·0·0·0·0·0·0·0 | D | BAX | Incolor; sem limite de mão | Repete o Thought Vessel e tira uma cor |


---

## 4. Diagnóstico

### 4.1 Faixas

| Item | Hoje | Faixa | Leitura |
|---|---|---|---|
| Fontes de terreno | 35 | 35 a 37 | Na faixa, mas 8 são só incolores |
| Ramp dedicado | 8 | 10 a 12 | Um pouco abaixo. O CMC médio de 2,84 compensa, e o Scoundrel gera Tesouros |
| Compra e tutor dedicados | 15 | 10 a 12 | Acima, de propósito: os comandantes compram |
| Interação dedicada | 8 | 8 a 12 | Na faixa. Rift, Chaos Warp, Mortars, Invert Polarity e Muddle |

### 4.2 Gerar e converter

| Gera | Converte |
|---|---|
| 23 cartas que jogam moeda e 13 caminhos até o Thumb | 3 caminhos até o Efreet, que é a única carta que transforma moeda em vitória certa |

É o mesmo padrão dos outros decks da série. O motor está superfinanciado, e a peça que fecha depende de comprá-la.

### 4.3 Concentração

Moderada. Sem os comandantes ainda sobram Chance Encounter, Stitch in Time, Fiery Gambit, Niv-Mizzet com Curiosity e o Efreet com a Scoundrel. É o deck menos dependente do comandante da série.

### 4.4 Anti-sinergias

- **Possibility Storm:** troca o seu combo por cartas aleatórias.
- **Blasphemous Act:** mata os dois comandantes. Use antes de baixá-los, ou com Okaun dobrado acima de 13.
- **Cursed Mirror:** a cópia de comandante é lendária e morre pela regra de lenda. Fica como rock.
- **Reliquary Tower e Thought Vessel** fazem a mesma coisa.

### 4.5 Poder e brackets

Três Game Changers e um combo de duas cartas com o comandante: Okaun e Efreet. Pela regra do Bracket 3, combo infinito de duas cartas montado cedo não é permitido. Só registro.

### 4.6 Distribuição e placar

| | S | A | B | C | D | INS | ALT | MÉD | BAX |
|---|---|---|---|---|---|---|---|---|---|
| Hoje | 7 | 20 | 50 | 14 | 9 | 11 | 35 | 44 | 10 |
| Com as trocas | 7 | 25 | 55 | 13 | 0 | 11 | 45 | 44 | 0 |

Placar: **304** hoje e **324** com as trocas. A soma das notas vai de 255 para 275. Só compara o deck com ele mesmo.

---

## 5. Combos e linhas

**Combos que já estão na lista.** Todos foram conferidos no Commander Spellbook.

| Peças | Resultado | ID |
|---|---|---|
| Frenetic Efreet + Okaun | Okaun infinitamente grande até o fim do turno | 2199-2779 |
| Frenetic Efreet + Tavern Scoundrel | Mana e Tesouros infinitos | 211-2199 |
| Frenetic Efreet + Chance Encounter | Vence na manutenção seguinte | 2199-4800 |
| Niv-Mizzet, Parun + Curiosity | Dano quase infinito (exige grimório maior que a vida do oponente) | 1089-2353 |
| Frenetic Efreet + Zndrsplt | Compra quantas quiser. É dedução do mesmo mecanismo; não está cadastrado | — |

**Como fechar a mesa, não só um jogador:**

- **Primeira fase principal: Efreet com Okaun e depois Chandra's Ignition.** O Okaun infinito causa dano infinito a cada oponente. Com o Zndrsplt em campo, as mesmas moedas compram a Ignition.
- **Efreet com Zndrsplt e Psychosis Crawler** (entrada): cada carta comprada tira 1 de cada oponente. Escolha o número de ativações pelo tamanho do grimório. O Zndrsplt obriga a comprar, e grimório vazio perde.
- **Efreet com Scoundrel e Rogue's Passage:** com mana infinita, o Okaun fica imbloqueável e o Rift volta com sobrecarga.

**Cuidado com o momento.** Para matar um jogador só com o Okaun, ative o Efreet **depois** dos bloqueios. Para a Ignition, ative na primeira fase principal: o dobro dura até o fim do turno.

**Motores:** Zndrsplt, Rhystic Study, Yusri, Squee's Revenge e Fiery Gambit.

---

## 6. Cortes

1. **Possibility Storm.** Desmonta o próprio combo.
2. **Fighting Chance.** Neblina parcial de bloqueadores.
3. **Goblin Kaboomist.** Fichas Land Mine que quase nunca importam.
4. **Karplusan Minotaur.** Quatro manas por pings de 1.
5. **Two-Handed Axe.** Uma dobra a mais, por 3 manas e mais o equipar.
6. **Reshape.** Sexto tutor de artefato, e pede outro artefato para sacrificar.
7. **Midnight Clock.** Rock de 3 lento num deck que já compra muito.
8. **Flamekin Village.** Entra sempre virada.
9. **Myriad Landscape.** Virada, e só há 12 básicos.
10. **Reliquary Tower.** Repete o Thought Vessel e não dá cor.

---

## 7. Entradas e o efeito somado

| Sai | Entra | Notas da entrada | Por quê |
|---|---|---|---|
| Reshape | Imperial Recruiter | 0·3·0·0·0·0·0·0 | O deck tem nove caminhos até o Thumb e dois até o Efreet. Troca um tutor de artefato por um que acha a peça que vence |
| Possibility Storm | Drift of Phantasms | 0·2·0·1·0·0·0·0 | A Storm embaralha as próprias peças do combo; o Drift busca o Efreet |
| Goblin Kaboomist | Strionic Resonator | 0·0·0·0·2·2·0·0 | Terceira sequência de moedas por 2 manas |
| Karplusan Minotaur | Psychosis Crawler | 0·0·0·0·0·3·0·3 | Compra do Zndrsplt vira dano em toda a mesa |
| Midnight Clock | Edgar, King of Figaro | 0·2·0·0·3·0·0·0 | Rock lento por uma moeda garantida por turno |
| Fighting Chance | Deflecting Swat | 0·0·1·3·0·0·0·0 | Proteção de verdade, e de graça |
| Two-Handed Axe | Counterspell | 0·0·3·2·0·0·0·0 | A dobra que falta o Okaun já tem; o turno do combo precisa de seguro |
| Flamekin Village | Steam Vents | 0·0·0·0·0·0·0·0 | Terreno que sempre entra virado por uma dual |
| Myriad Landscape | Volcanic Island | 0·0·0·0·0·0·0·0 | Idem |
| Reliquary Tower | Spirebluff Canal | 0·0·0·0·0·0·0·0 | Repete o Thought Vessel; troca incolor por dual |

| Medida | Hoje | Com as 10 trocas |
|---|---|---|
| Fontes de terreno (com o verso do Valakut) | 35 | 35 |
| Terrenos só incolores | 8 | 6 |
| Terrenos que entram virados | 6 | 4 |
| Caminhos até o Frenetic Efreet (ele e os tutores que o acham) | 3 | 5 |
| Chance de ter acesso ao Efreet até o turno 4 | 28% | 42% |
| Chance de ter acesso ao Efreet até o turno 6 | 33% | 49% |
| Caminhos até o Krark's Thumb | 13 | 12 |
| Chance de ter acesso ao Thumb até o turno 6 | 84% | 81% |
| Cartas das 98 que pagam pelo Efreet (Scoundrel, Chance Encounter, Ignition, Crawler) | 3 | 4 |
| Proteção dedicada | 6 | 8 |
| Interação dedicada | 8 | 9 |
| Cartas que jogam moeda | 23 | 22 |
| Game Changers | 3 | 3 |
| CMC médio (não terreno) | 2,84 | 2,91 |
| Placar | 304 | 324 |

**Consideradas e recusadas, para não voltarem à mesa:**

| Carta | Veredito |
|---|---|
| Wizard's Staff e Echo, Perceptive Prodigy | Fazem o mesmo que o Resonator. Ficam no banco: entram se ele não render no teste |
| Desperate Gambit | Boa, mas o Okaun já dobra; banco |
| Mithril Coat | Proteção com lampejo; banco, atrás do Swat |
| Fierce Guardianship e Jeska's Will | Seriam o quarto e o quinto Game Changer |
| Boompile | Destrói o seu Thumb e os seus comandantes |
| Game of Chaos | Só mata um oponente, e pode matar você |
| Sword of Fire and Ice | A proteção contra azul e vermelho impede mirar o Okaun com Temur Battle Rage e Seize the Day |
| Twinflame | A cópia do Okaun é lendária e morre |
| Ophidian Eye e Tandem Lookout | O Zndrsplt já compra |
| Krark's Other Thumb | Não é legal, e é de dados |
| Chira, All In | Só sai em 09/11/2026 |

Se não quiser comprar a Volcanic Island, outra dual U/R que entre desvirada cumpre quase o mesmo papel.

---

## 8. Proposta de painel

- **Nomes:** Cara, Eu Ganho; Dois Olhos, Uma Moeda; Polegar Sagrado.
- **Escolhido: Cara, Eu Ganho.**
- **Clima:** mesa de cassino clandestino num beco de Ravnica. Feltro, fichas e a luz de um ciclope.
- **Paleta:**
  - verde-feltro `#1F5C46`
  - ouro-moeda `#D8B24A`
  - azul-faísca `#3A8DDE`
  - vermelho-ciclope `#C2412D`
  - marfim `#F1EAD8`
- **Moldura:** borda de mesa de roleta.
- **Motivo gráfico:** uma moeda girando, com o olho do Okaun numa face e o do Zndrsplt na outra. Os contadores do painel (vitórias no turno, poder do Okaun, cartas compradas) aparecem como pilhas de fichas.

---

## 9. Dúvidas

**Fontes.** Todos os textos vieram do json.edhrec. As rulings vieram da api.magicthegathering.io e do grimoria; os combos, do Commander Spellbook; os dados de inclusão, do EDHREC (10.074 decks dos parceiros).

**Suposições.**
- As probabilidades usam 98 cartas no grimório, mão de 7, uma compra por turno, na jogada, sem mulligan.
- "Acesso ao Efreet" conta o próprio Efreet e os tutores que o acham (Gamble, Long-Term Plans e, nas entradas, Imperial Recruiter e Drift of Phantasms).
- A conta das moedas supõe sequências independentes, vitória a 50% ou 75% e Okaun base 3/3.

**Regras sem ruling explícita.**
1. A moeda ignorada pelo Thumb não vence nem perde.
2. Efreet com Zndrsplt dá compra sob controle. É dedução do mecanismo dos outros três combos.
3. Edgar com Thumb: o Edgar diz que as moedas "dão cara e você vence". Leio que ele resolve o primeiro grupo de moedas do turno antes do Thumb importar.

**Cinco avaliações discutíveis.**
1. **Possibility Storm sai**, mesmo sendo a carta mais caótica do deck. Se a graça do precon está nela, mantenha e corte a Goblin Archaeologist.
2. **Edgar no lugar do Midnight Clock.** São 6 manas com UU. Se o deck ficar lento no teste, troque pela Desperate Gambit.
3. **Counterspell em vez de outra peça de moeda.** É a carta menos temática da proposta.
4. **Planar Chaos fica.** Ela é simétrica, mas a vitória de um oponente também dispara os seus comandantes.
5. **Mogg Assassin fica.** É remoção repetível a 75%. Eu esperava cortá-la antes de ler o texto.

---

## 10. Confronto

**O edh.wiki** (coin-flip) é uma lista de dados, sem plano escrito. No EDHREC, o Frenetic Efreet está em cerca de 46% dos decks (4.602 de 10.074), abaixo de quase todas as cartas de moeda puras. É o principal ponto em que discordo: o Efreet é a carta mais importante do deck, acima do Thumb.

**Sobre o que você disse:** o Thumb é a carta que mais melhora o deck, de 31% para 74% de matar um oponente por combate. A carta que vence é o Efreet. Se for para buscar uma só com o Gamble, busque o Efreet quando o Okaun estiver em campo, e o Thumb quando não estiver.
