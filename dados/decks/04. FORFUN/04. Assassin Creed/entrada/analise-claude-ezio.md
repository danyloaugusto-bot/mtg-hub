# Análise: Requiescat in Pace (Ezio Auditore da Firenze)

Analista: Claude | Data: 14/10/2026 | Lista conferida por script: 100 cartas, nenhuma repetida fora os básicos, nenhuma banida | Cartas sem texto conferido: nenhuma (80 da lista e 9 entradas, no EDHREC e no Archidekt)

## Nota de partida

**Nota atual: 6. Nota projetada com 9 trocas: 7.** Projeção sem partida. Placar 207 → 258.

**Como li o pedido.** Coleção especial, forfun, "poucos slots para melhoria". Li como **pontual**: nove trocas, cinco delas de mana, e as entradas de criatura todas da própria coleção de Assassin's Creed, para o deck não perder a cara. Não havia eixos nem estratégia; criei os dois.

**A descoberta principal: a execução do Ezio quase nunca acontece.** O texto pede {W}{U}{B}{R}{G} pagos de uma vez, depois do dano de combate, com o jogador a 10 de vida ou menos. São cinco fontes, uma de cada cor, desviradas no seu combate. Simulei 30 mil partidas: hoje o deck tem as cinco cores disponíveis no combate até o turno 8 em **19,0%** das partidas, e até o turno 10 em 33,6%. Com as trocas, 34,5% e 51,6%. Melhora muito, e continua sendo coisa de fim de jogo. A execução é a sobremesa, não o prato: o deck vence batendo com Assassinos.

**O que a lista faz contra si mesma.** O Rest in Peace, que é pet, exila os cemitérios e desliga seis cartas suas que dependem deles (Layla Hassan, Restart Sequence, o capítulo III da Revelations of Ezio, Bleeding Effect, The Aesir Escape Valhalla e Abstergo). O Supreme Verdict, também pet, mata o Ezio e o exército. Nenhum dos dois sai, porque são pets; digo uma vez, com todas as letras: **o Rest in Peace é a carta que mais trabalha contra o deck**.

---

## 1. Plano

### 1.1 O comandante, palavra por palavra

Texto Oracle: *"Menace. Assassin spells you cast have freerunning {B}{B}. Whenever Ezio deals combat damage to a player, you may pay {W}{U}{B}{R}{G} if that player has 10 or less life. When you do, that player loses the game."* Criatura lendária, Human Assassin, 3/2, {1}{B}. Identidade de cinco cores.

| Trecho | Regra ou ruling | O que muda no deck |
|---|---|---|
| "Assassin spells you cast have freerunning {B}{B}" | Freerunning vale pelo resto do turno depois que um Assassino ou o comandante causou dano de combate a um jogador, mesmo que ele saia depois (ruling de 05/07/2024) | Conecte primeiro, depois conjure: Bayek por {B}{B} em vez de 5 manas. Cada criatura que não é Assassino perde esse desconto |
| "if that player has 10 or less life" | A vida é checada quando o gatilho resolve; pago o WUBRG, ele perde mesmo que ganhe vida antes do segundo gatilho (ruling de 05/07/2024) | O deck precisa de quem leve todos a 10: Arbaaz Mir, Mjölnir, Shao Jun, Origin of the Hidden Ones |
| "pay {W}{U}{B}{R}{G}" | É pagamento num gatilho, não mágica nem habilidade ativada | Secluded Courtyard e Brotherhood Headquarters **não** pagam o WUBRG: a mana delas só serve para mágica ou habilidade ativada |
| "Menace" | Precisa de dois bloqueadores | O Ezio de 3/2 conecta cedo; com a Brotherhood Regalia, não pode ser bloqueado |

### 1.2 A conta do deck

**Conectar, correr, executar.**

Um Assassino conecta, e o resto do turno fica barato: toda mágica Assassino custa {B}{B}, e seis cartas da lista têm freerunning próprio. Cada conexão é um desconto; cada desconto põe mais um Assassino em campo; e com todos perto dos 10 de vida, o Ezio executa.

Em finanças: o freerunning é um desconto por volume. Quem conecta todo turno compra o Bayek a 40% do preço. O WUBRG é a opção de compra no fim do contrato: vale muito, mas só é exercível com a mana inteira na mão.

### 1.3 Onde a lista trai o plano

1. **A execução depende de uma mana que o deck não tem.** 1 carta de ramp (o Haunted Screen), nenhum Command Tower, nenhuma fonte de cinco cores desvirada além do Path of Ancestry, que entra virado.
2. **Oito criaturas não são Assassino** e perdem o freerunning: Alexios, Ezio Brash Novice, Metallic Mimic, Shanid, Shay Cormac, Sigurd, Tax Collector e Towering Viewpoint. Metade são pets e ficam; o Roshan resolve as que sobram, porque torna Assassino tudo o que é criatura, inclusive na mão.
3. **O cemitério contra o Rest in Peace**, como acima.
4. **Smoke Bomb** dá shroud a todas as criaturas, inclusive as suas: desliga os seus equipamentos e remoções enquanto estiver em campo.

### 1.4 As três fases

| Fase | O que deve acontecer | Hoje | Com as trocas |
|---|---|---|---|
| Início (turnos 1 a 3) | Ezio no turno 2, um Assassino barato, um equipamento | Ezio de 2, Assassin Initiate, Lavaspur Boots | Mais Basim e Desmond, de 2 manas; Sol Ring e Arcane Signet |
| Meio (turnos 4 a 7) | Conectar todo turno e usar o desconto: Assassinos por {B}{B}, remoção por freerunning | 14 Assassinos no grimório | 18; Achilles e o outro Ezio como senhor e motor |
| Fim | Todos a 10 de vida com Arbaaz, Mjölnir e Shao Jun; execução com WUBRG, ou dano de Assassino | WUBRG no combate até o turno 8 em 19,0% | Em 34,5%, com Chromatic Lantern e Command Tower |

---

## 2. Agrupamentos

Você não tinha eixos. Criei oito, todos passados no crivo (cada um mede uma função; somam o deck inteiro; cada um tem mais de meia dúzia de cartas, exceto Proteção, que é o diagnóstico):

| Eixo | O que mede | Cartas com nota 2+ hoje | Com as trocas |
|---|---|---|---|
| Ramp e fixação | Mana a mais e cores para o WUBRG | 1 | 4 |
| Compra | Cartas | 10 | 12 |
| Remoção | Matar o que atrapalha | 14 | 14 |
| Assassinos | Densidade e senhores da tribo | 16 | 20 |
| Conexão | Fazer o Assassino bater: evasão, equipamento, abrir bloqueio | 9 | 10 |
| Freerunning | Cartas que ficam baratas depois de conectar | 6 | 7 |
| Proteção | Manter o Ezio e os Assassinos vivos | 0 | 0 |
| Fechamento | Levar alguém a 10 de vida e executar | 4 | 4 |

Proteção ficou com 0 cartas de nota 2 ou mais: o deck protege o Ezio só com ward de equipamento. Remoção tem 14: é o deck mais bem servido de remoção da série, o que combina com o tema.

---

## 3. Carta a carta

Notas de 0 a 3 nos oito eixos. Pets assumidos: as 31 linhas foil ou etched, inclusive os 20 básicos. Pet soma 1 em Sinergia e nunca entra na fila de corte. **Por isso as trocas de mana não tocam nos básicos.**

### Comandante (1)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Ezio Auditore da Firenze (Assassino) | AS3 CX2 FC3 | S | INS (pet) | 3/2 ameaça; mágicas Assassino têm freerunning {B}{B}; ao causar dano de combate a jogador com 10 ou menos, paga {W}{U}{B}{R}{G} e ele perde | Duas manas, abre o desconto e fecha o jogo |

### Criatura (22)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Adéwalé, Breaker of Chains (Assassino) | D2 AS2 | A | ALT | Ao entrar, procura Assassino, Pirata ou Veículo entre 6 | Acha o próximo Assassino |
| Alexios, Deimos of Kosmos | FC1 | C | MÉD (pet) | Passa de mão em mão a cada upkeep e ataca quem não é o dono | Pet; caos político, não é Assassino |
| Arbaaz Mir (Assassino) | AS2 FC2 | B | ALT (pet) | Cada histórica não ficha que entra: 1 em cada oponente e você ganha 1 | Pet; leva todos para perto dos 10 |
| Arno Dorian (Assassino) | AS3 FC1 | A | ALT | Toque mortífero; outros Assassinos +2/+0; disguise | O senhor dos Assassinos |
| Assassin Initiate (Assassino) | AS2 CX1 | B | ALT | {1}: voar, toque mortífero ou vínculo | Assassino de 1 mana que conecta no turno 2 |
| Bayek of Siwa (Assassino) | AS2 FC3 | A | ALT (pet) | Golpe duplo; no seu turno, outras criaturas históricas têm golpe duplo | Pet; dobra o dano dos lendários |
| Eivor, Wolf-Kissed (Assassino) | D1 AS2 FC1 | B | MÉD (pet) | Atropelar, ímpeto; dano mói e põe Saga ou terreno no campo | Pet; caro, mas Assassino com freerunning {B}{B} |
| Ezio, Brash Novice | AS1 CX1 | C | MÉD (pet) | Ganha marcador ao atacar; com 2, golpe primeiro e vira Assassino | Pet; só vira Assassino depois de dois ataques |
| Layla Hassan (Assassino, usa cemitério) | D2 AS2 | B | ALT (pet) | Golpe primeiro; ao entrar e quando Assassinos conectam, devolve histórica do cemitério à mão | Pet; recursão que o Rest in Peace desliga |
| Lydia Frye (Assassino) | D1 AS2 CX2 | B | ALT (pet) | Não pode ser bloqueada por poder 3+; surveil por Assassino virado | Pet; conecta fácil |
| Mary Read and Anne Bonny (Assassino) | R1 D1 AS2 | B | ALT (pet) | Ímpeto; {T}: compra e descarta; Tesouro ao descartar Island, Pirata ou Veículo | Pet; filtro e algum Tesouro |
| Metallic Mimic | AS2 | B | ALT (pet) | Escolhe tipo; as outras do tipo entram com +1/+1 | Pet; nomeando Assassino |
| Queen Marchesa (Assassino) | D2 AS2 FC1 | A | ALT | Toque mortífero, ímpeto; vira monarca; fichas Assassino se perder a coroa | Assassina com motor de compra |
| Roshan, Hidden Magister (Assassino) | D1 AS3 CX1 | A | ALT | Suas outras criaturas são Assassinos, inclusive na mão; viradas para baixo têm ameaça | Liga o freerunning para o deck inteiro |
| Royal Assassin (Assassino) | RM2 AS2 | B | ALT (pet) | {T}: destrói criatura virada | Pet; remoção repetível |
| Shanid, Sleepers' Scourge | D1 CX1 | C | BAX | Ameaça para lendários; compra ao jogar lendário | Nem Assassino nem da coleção |
| Shao Jun (Assassino) | AS2 CX2 FC1 | B | ALT | No seu turno, voar e golpe primeiro; vira dois artefatos: 1 em cada oponente | Assassina que conecta pelo ar |
| Shay Cormac | RM1 | C | BAX | Tira hexproof e proteção; marcadores de recompensa | Não é Assassino; efeito de nicho |
| Sigurd, Jarl of Ravensthorpe | FC1 | C | MÉD | Vigilância, atropelar, vínculo; mexe nas Sagas | Não é Assassino; ajuda as quatro Sagas |
| Tax Collector | RM1 PR1 | C | BAX | Ao entrar: mágicas alheias custam {1} a mais, ou detém uma criatura | Não é Assassino; efeito de uma rodada |
| Three Tree Mascot (Assassino) | R1 AS1 | B | MÉD | Changeling; {1}: uma mana de qualquer cor, uma vez por turno | Assassino por changeling e filtro de cor |
| Towering Viewpoint | CX1 PR1 | C | MÉD (pet) | Defensor, alcance; {3}: dá voar | Pet; parede |

### Artefato (16)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Adrestia | D1 AS1 CX2 | B | MÉD | Veículo com islandwalk; tripulado por Assassino, compra e vira Assassino | Conecta e compra |
| Apple of Eden, Isu Relic | D2 | C | MÉD | Paga 4 de vida: joga a mão de um oponente neste turno | Diversão pura; caro |
| Assassin Gauntlet | D1 CX2 | B | MÉD (pet) | Ao entrar, vira as criaturas de um oponente; +1/+1 e loot ao conectar | Pet; abre o caminho para conectar |
| Brotherhood Regalia | AS1 CX3 PR1 | S | INS | Ward {2}, vira Assassino e não pode ser bloqueada; equipar lendário {1} | O Ezio imbloqueável por 1: a carta que mais faz o comandante funcionar |
| Crystal Skull, Isu Spyglass | R1 D2 | B | MÉD | Joga históricas do topo; {T}: {U} | Vantagem com os lendários |
| Haunted Screen | R2 | B | ALT | {W} ou {B}; pagando 1 de vida, {G}, {U} ou {R} | O único rock de cinco cores |
| Haystack | PR1 | C | BAX | {2},{T}: criatura sua sai de fase | Proteção cara de usar |
| Hemlock Vial | D1 | C | MÉD (pet) | Compra ao entrar; toque mortífero para equipadas | Pet |
| Hidden Blade | CX2 | B | MÉD | Flash; +1/+0 e golpe primeiro; toque mortífero para Assassino ao entrar | Equipamento temático |
| Hidden Footblade | CX1 | C | MÉD (pet) | Flash; +1/+0 e ímpeto | Pet |
| Hunter's Bow | RM2 | B | MÉD | Ao entrar, a equipada luta de um lado só; alcance e ward {2} | Remoção em equipamento |
| Jackdaw | D2 | C | MÉD (pet) | Veículo; ao conectar, troca a mão por cartas por artefato | Pet |
| Lavaspur Boots | CX1 PR1 | B | MÉD | +1/+0, ímpeto e ward {1} | Ezio atacando no turno em que desce |
| Mjölnir, Storm Hammer | CX2 FC2 | B | ALT | Ao atacar, vira e atordoa uma criatura e causa dano por criatura virada | Abre bloqueio e tira vida de todos |
| Smoke Bomb (**contra o plano**) | CX1 PR1 | C | BAX | Flash; todas as criaturas têm shroud; depois, uma criatura sua imbloqueável | Shroud em todas desliga os seus equipamentos e remoções |
| The Animus (usa cemitério) | — | C | BAX | Exila lendário de cemitério com memória; transforma seu lendário em cópia | Peça do Altaïr, que não está na lista; e o Rest in Peace a desliga |

### Encantamento (8)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Ballad of the Black Flag (usa cemitério) | R1 D2 | C | MÉD | Saga: mói 3 e pega histórica, três vezes; depois desconto de {2} | Valor lento |
| Bleeding Effect (usa cemitério) | CX2 | C | MÉD (pet) | Dá às suas criaturas as habilidades das criaturas do seu cemitério | Pet; o Rest in Peace desliga |
| Coastal Piracy | D3 | A | ALT | Compra quando criatura sua causa dano de combate a oponente | Cada conexão vira carta |
| Dead Weight | RM1 | C | MÉD | -2/-2 | Remoção barata pequena |
| Origin of the Hidden Ones | RM1 AS2 FC1 | B | ALT | Saga: 4 de dano; duas fichas Assassino; mais fichas atacando | Remoção e Assassinos |
| Rest in Peace (**contra o plano**) | — | D | BAX (pet) | Exila cemitérios e tudo que iria para eles | Pet; desliga Layla, Restart Sequence, Revelations III, Bleeding Effect, Aesir e Abstergo |
| The Aesir Escape Valhalla (usa cemitério) | D1 | C | MÉD (pet) | Saga: exila permanente do cemitério, ganha vida, marcadores, devolve | Pet |
| The Revelations of Ezio (usa cemitério) | RM2 AS1 | B | ALT (pet) | Saga: destrói criatura virada; Assassinos crescem; reanima Assassino | Pet |

### Instantânea (12)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Assassin's Trophy | RM3 | A | ALT | Destrói permanente de oponente | Remoção total por 2 |
| Become Anonymous | CX1 PR1 | C | MÉD | Exila criatura sua e duas do topo, e cloak nas três | Truque com o Roshan |
| Chain Assassination (freerunning) | RM2 FR2 | B | ALT | Freerunning {1}{B}; destrói criatura e compra se outra morreu | Remoção que fica barata depois de conectar |
| Deflecting Palm | PR1 | C | BAX | Previne o dano de uma fonte e devolve ao dono | Truque defensivo |
| Escape Detection (freerunning) | D1 FR2 PR1 | B | MÉD | Freerunning devolvendo criatura azul; devolve criatura e compra | Proteção e ritmo |
| Fatal Push | RM2 | B | MÉD (pet) | Destrói criatura de MV 2 (ou 4 com revolt) | Pet |
| Go for the Throat | RM2 | B | ALT | Destrói criatura não-artefato | Remoção barata |
| Mortify | RM2 | B | ALT | Destrói criatura ou encantamento | Flexível |
| Murder | RM2 | B | MÉD (pet) | Destrói criatura | Pet |
| Path to Exile | RM3 | A | ALT | Exila criatura; o dono busca básico | Remoção de 1 mana |
| Swords to Plowshares | RM3 | A | ALT | Exila criatura; o dono ganha vida igual ao poder | Remoção de 1 mana |
| Terminate | RM2 | B | ALT | Destrói criatura | Remoção barata |

### Feitiço (7)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Casualties of War | RM3 | B | ALT | Destrói até um artefato, criatura, encantamento, terreno e planeswalker | Remoção em massa cirúrgica |
| Distract the Guards (freerunning) | FR2 | C | MÉD (pet) | Freerunning {1}{W}; três Humanos 1/1 | Pet |
| Monastery Raid (freerunning) | D2 FR2 | B | MÉD | Freerunning {X}{R}; exila X do topo e você pode jogar | Compra que escala com a conexão |
| Petty Larceny (freerunning) | D2 FR2 | B | MÉD (pet) | Freerunning {1}{B}; rouba dois do topo de um oponente | Pet |
| Primal Command | D1 PR1 | C | BAX | Dois modos: vida, topo, cemitério, tutor de criatura | Cinco manas com {G}{G} |
| Restart Sequence (freerunning, usa cemitério) | FR2 | B | MÉD (pet) | Freerunning {1}{B}; reanima criatura sua | Pet; o Rest in Peace desliga |
| Supreme Verdict (**contra o plano**) | RM2 | C | MÉD (pet) | Destrói todas as criaturas | Pet; mata o seu exército e o Ezio |

### Terreno (34)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Abstergo Entertainment | D1 | C | MÉD | {C}; {1},{T}: qualquer cor; exila para devolver histórica | Base de mana |
| Ash Barrens | — | C | MÉD | {C}; landcycling de básico {1} | Base de mana |
| Bountiful Landscape | — | C | MÉD | Sacrifica: básico de um de três tipos, virado; ciclagem | Base de mana |
| Deceptive Landscape | — | C | MÉD | Sacrifica: básico de um de três tipos, virado; ciclagem | Base de mana |
| Foreboding Landscape | — | C | MÉD | Sacrifica: básico de um de três tipos, virado; ciclagem | Base de mana |
| Perilous Landscape | — | C | MÉD | Sacrifica: básico de um de três tipos, virado; ciclagem | Base de mana |
| Seething Landscape | — | C | MÉD | Sacrifica: básico de um de três tipos, virado; ciclagem | Base de mana |
| Sheltering Landscape | — | C | MÉD | Sacrifica: básico de um de três tipos, virado; ciclagem | Base de mana |
| Tranquil Landscape | — | C | MÉD | Sacrifica: básico de um de três tipos, virado; ciclagem | Base de mana |
| Twisted Landscape | — | C | MÉD | Sacrifica: básico de um de três tipos, virado; ciclagem | Base de mana |
| Crystal Grotto | — | C | MÉD | Vidência ao entrar; {1},{T}: qualquer cor | Base de mana |
| Forest ×4 | — | C | MÉD (pet) | Terreno | Pet (foil) |
| Island ×4 | — | C | MÉD (pet) | Terreno | Pet (foil) |
| Mountain ×4 | — | C | MÉD (pet) | Terreno | Pet (foil) |
| Plains ×4 | — | C | MÉD (pet) | Terreno | Pet (foil) |
| Swamp ×4 | — | C | MÉD (pet) | Terreno | Pet (foil) |
| Ominous Cemetery | RM1 | C | BAX | {C}; exila para embaralhar criatura no grimório | Incolor num deck de cinco cores |
| Path of Ancestry | — | B | ALT | Virado; qualquer cor da identidade | Base de mana |
| Secluded Courtyard | — | C | MÉD | {C}; qualquer cor só para mágica de criatura do tipo escolhido | Nomeie Assassino; não paga o WUBRG do Ezio |


---

## 4. Diagnóstico

| Medida | Hoje | Com as 9 trocas |
|---|---|---|
| Placar | 207 | 258 |
| Assassinos no grimório (pagam freerunning {B}{B}) | 14 | 18 |
| Criaturas que não são Assassino | 8 | 5 |
| Ramp dedicado | 1 | 4 |
| Compra dedicada | 10 | 12 |
| Terrenos | 34 | 35 |
| Fontes de terreno por cor (W/U/B/R/G) | 9/10/9/10/11 | 10/11/10/11/12 |
| WUBRG disponível no combate até o turno 7 / 8 / 10 | 10,6% / 19,0% / 33,6% | 23,6% / 34,5% / 51,6% |
| Cartas contra o plano | 3 | 2 |
| Cartas da coleção Assassin's Creed | 53 | 53 |
| Game Changers | nenhum | nenhum |

**Gerar contra converter.** O deck gera conexões (Assassinos com ameaça, voar e imbloqueáveis) e converte bem em carta e desconto (Coastal Piracy, freerunning). O que não converte é a vida dos oponentes em execução, porque o WUBRG chega tarde.

**Combos.** Nenhum combo completo na lista. O mais registrado com o Ezio é Ezio + Sorin Markov (Commander Spellbook 367-5712): o Sorin põe a vida de um oponente em 10, e o Ezio executa. Fica no banco, porque é combo de duas cartas e muda o deck de forfun.

**Brackets.** Nenhum Game Changer, nenhum combo. Leitura: **Bracket 2**, antes e depois.

---

## 5. Linhas de jogo

- **A ordem do turno.** Ataque primeiro com o que conecta (Ezio com Regalia, Lydia, Basim, Shao Jun). Depois do dano, conjure os Assassinos caros por {B}{B} e as cartas de freerunning.
- **Brotherhood Regalia no Ezio**, por {1}: ameaça vira imbloqueável, e o desconto fica garantido todo turno.
- **Levar a mesa a 10.** Arbaaz Mir pinga todos a cada histórica que entra; Mjölnir causa dano em cada oponente; Shao Jun pinga todos virando artefatos. A execução escolhe a vítima: é cirúrgica.
- **Guardar o WUBRG.** No turno da execução, ataque com tudo menos a mana: os cinco terrenos precisam estar desvirados depois do dano.

---

## 6. Trocas

| # | Grupo | Sai | Entra | Por quê |
|---|---|---|---|---|
| 1 | Mana para o WUBRG | Ominous Cemetery | Command Tower | Terreno incolor por fonte das cinco cores |
| 2 | Mana para o WUBRG | Haystack | Arcane Signet | Proteção cara por rock de cinco cores |
| 3 | Mana para o WUBRG | Smoke Bomb | Chromatic Lantern | Shroud em todas as criaturas, inclusive as suas, por cinco cores em todo terreno |
| 4 | Mana para o WUBRG | The Animus | Sol Ring | Peça de um Altaïr que não está no deck por aceleração |
| 5 | Mana para o WUBRG | Primal Command | Brotherhood Headquarters | Feitiço de {G}{G} por terreno da coleção que fixa os Assassinos |
| 6 | Mais Assassinos da coleção | Shanid, Sleepers' Scourge | Ezio, Blade of Vengeance | Lendário que não é Assassino nem da coleção pelo outro Ezio, que compra |
| 7 | Mais Assassinos da coleção | Tax Collector | Desmond Miles | Efeito de uma rodada por Assassino de 2 |
| 8 | Mais Assassinos da coleção | Shay Cormac | Achilles Davenport | Efeito de nicho por senhor de Assassinos com freerunning |
| 9 | Mais Assassinos da coleção | Deflecting Palm | Basim Ibn Ishaq | Truque defensivo por Assassino de 2 que conecta e compra |

A ordem é a da prioridade: as cinco de mana primeiro, porque são as únicas que mexem na execução. Só elas levam o placar a 241.

### O texto das entradas

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Ezio, Blade of Vengeance (Assassino) | D3 AS2 FC1 | A | ALT | Toque mortífero; compra quando Assassino seu conecta | Da coleção; por freerunning custa {B}{B} |
| Desmond Miles (Assassino) | D1 AS2 CX1 FC1 | B | ALT | Ameaça; +1/+0 por outro Assassino em campo e no cemitério; surveil ao conectar | Da coleção; Assassino de 2 que cresce com a tribo |
| Achilles Davenport (Assassino, freerunning) | AS3 CX1 FR2 | A | ALT | Freerunning {U}{B}; ameaça; outros Assassinos +1/+1 | Da coleção; o segundo senhor |
| Basim Ibn Ishaq (Assassino) | D2 AS2 CX2 | A | ALT | Ao conjurar histórica, compra e fica imbloqueável no turno (uma vez por turno); cresce ao conectar | Da coleção; conecta e compra |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Arcane Signet | R2 | A | ALT | Qualquer cor da identidade | Fixação de 2 manas |
| Chromatic Lantern | R3 FC1 | S | INS | Seus terrenos geram qualquer cor; ela também | Transforma cada terreno numa fonte de WUBRG: é a carta que liga a execução do Ezio |
| Sol Ring | R3 | S | INS | {C}{C} | O melhor rock |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Command Tower | — | B | ALT | Qualquer cor da identidade, desvirado | O terreno que mais ajuda o WUBRG |
| Brotherhood Headquarters | R1 | B | ALT | {C}; qualquer cor para mágica Assassino, mágica com freerunning ou habilidade de Assassino | Da coleção; fixa os Assassinos, mas não paga o WUBRG |

O Basim tem uma leitura a conferir: as duas fontes trazem "compra uma carta" e "não pode ser bloqueado neste turno" em linhas separadas, com "uma vez por turno". Li como um só gatilho que faz as duas coisas.

### Banco

- **Altaïr Ibn-La'Ahad e Jacob Frye**, da coleção: ótimos, mas dependem do cemitério, e o Rest in Peace os desliga.
- **Mana Confluence, City of Brass, Exotic Orchard** no lugar de três Landscapes: medi, e o WUBRG até o turno 8 sobe só mais 2 pontos. O gargalo é ter cinco fontes, não a cor de cada uma.
- **Sorin Markov**: a execução de duas cartas. Muda o deck de forfun para combo.
- **Swiftfoot Boots**: proteção para o Ezio.

---

## 7. Painel

| Nome | Ideia |
|---|---|
| **Requiescat in Pace** (escolhido) | O que se diz depois da execução |
| Salto de Fé | O Ezio entra e conecta |
| Lâmina Oculta | O desconto que ninguém vê chegando |

**Clima.** Florença renascentista à noite: telhados de terracota, afresco desbotado, pergaminho de contrato, a cúpula ao fundo.

**Paleta.** Terracota #A4472B, Ocre-afresco #C8873E, Branco-capuz #EEE7DA, Cinza-pedra #4B4F54, Noite-de-Arno #1C2230.

**Moldura.** Arcos renascentistas em traço de pena, com cantos de pedra lavrada.

**Motivo gráfico.** Uma pena de águia cruzando a silhueta da cúpula de Florença.

---

## 8. Dúvidas

- **Fontes:** textos no EDHREC (77) e no Archidekt (3, quando o EDHREC caiu); rulings no Grimoria (duas, de 05/07/2024); dados de 17,7 mil decks no edh.wiki e no EDHREC; combos no Commander Spellbook.
- **Suposições:** forfun e pontual; pets são as foil e etched; a simulação do WUBRG trata as Landscapes como fonte de três cores (otimista) e Abstergo e Crystal Grotto como filtros que consomem outra fonte (conservador).
- **Dedução sem ruling:** que Secluded Courtyard e Brotherhood Headquarters não pagam o WUBRG. O texto restringe a mana a mágica ou habilidade ativada, e o pagamento do Ezio é parte de um gatilho.
- **Avaliações discutíveis:** manter Dead Weight e Murder num deck que já tem 14 remoções; o Alexios como C, quando ele pode ser a melhor diversão da mesa; e o Metallic Mimic como B, que nomeando Assassino vale mais do que parece.

## 9. Confronto

Das 20 cartas de maior sinergia com o Ezio no EDHREC, a lista tinha 8. Com as trocas, 12: entram os quatro Assassinos da coleção (Ezio Blade of Vengeance, Basim, Desmond e Achilles). A Brotherhood Headquarters, que pelo edh.wiki estaria no topo, também entrou. Ficaram fora Altaïr e os Frye, pelo cemitério; Ramses, Aya, Ratonhnhaké:ton, Cover of Darkness e Eagle Vision, por falta de slot no modo pontual. São o primeiro banco se você quiser mexer mais. Você disse que a lista tem poucos slots para melhoria: concordo nos Assassinos, e discordo na mana. 53 das 100 cartas são da coleção, antes e depois: saem cinco dela (Haystack, Smoke Bomb, The Animus, Tax Collector e Shay Cormac) e entram cinco (os quatro Assassinos e a Brotherhood Headquarters).
