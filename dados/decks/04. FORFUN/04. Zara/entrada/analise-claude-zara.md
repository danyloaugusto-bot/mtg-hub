# Análise: Empréstimo Compulsório (Zara, Renegade Recruiter)

Analista: Claude | Data: 14/10/2026 | Lista conferida por script: 100 cartas, nenhuma repetida fora os básicos, tudo dentro de Izzet, nenhuma banida | Cartas sem texto conferido: nenhuma (80 da lista e 26 candidatas lidas no EDHREC)

## Nota de partida

**Nota atual: 5. Nota projetada com as 18 trocas: 8.** Projeção sem partida. Placar 194 → 244.

**Como li o pedido.** "Análise e criação de estratégia condizente", num deck que é homenagem ao seu irmão. Criei a estratégia e ajustei em **camadas**, sem reconstruir: o tema, os pets e a cara do deck ficam. Se ele quiser o deck mais forte possível, a seção 9 diz o que uma reconstrução mexeria.

**Uma correção minha, no topo.** No pedido aos subagentes eu escrevi o custo da Zara de memória, como {1}{U}{R}. Está errado. Ela custa **{3}{U}{R}, MV 5**, é **Human Pirate** (não Wizard) e é 4/3 voando. Nada na análise usa o custo errado; registro porque é exatamente o erro que o método manda evitar.

**A descoberta principal.** A Zara não rouba: ela **empresta**. A criatura volta à mão do dono na etapa final, e o deck não tinha nada que impedisse isso de forma repetível. Hoje há 7 cartas que convertem o empréstimo, todas de uso único (Fling, Kazuul's Fury, Grafted Identity e quatro cópias). **Nenhum conversor repetível.** O deck gera roubo todo turno e converte uma vez por partida.

**A regra que muda tudo.** A devolução da Zara rastreia aquele objeto. Se a criatura sair e voltar ao campo **sob seu controle**, é um objeto novo, e a devolução não acha nada. Thassa, Deep-Dwelling e Conjurer's Closet fazem isso na sua etapa final, no mesmo momento da devolução: você ordena os gatilhos, o da Thassa resolve primeiro, e a criatura emprestada vira sua para sempre, com o ETB disparando de novo. É dedução pelas regras de rastreamento de objeto e de ordem de gatilhos (seção 9), não ruling impressa. Com isso, **todo ataque da Zara vira um Control Magic**.

**O combo que já estava aí.** Curiosity com qualquer um dos dois Niv-Mizzet: compra infinita e dano até o grimório acabar (Commander Spellbook 1089-2353 e 1089-4971). Você não citou nenhum dos dois.

---

## 1. Plano

### 1.1 A comandante, palavra por palavra

Texto Oracle: *"Flying. Whenever Zara attacks, look at defending player's hand. You may put a creature card from it onto the battlefield under your control tapped and attacking that player or a planeswalker they control. Return that creature to its owner's hand at the beginning of the next end step."*

| Trecho | Regra ou ruling | O que muda no deck |
|---|---|---|
| "look at defending player's hand" | Você vê a mão inteira | Informação de graça: quem tem anulação, quem tem limpeza. A Telepathy estende isso à mesa toda |
| "put a creature card from it onto the battlefield" | Não é conjurar. ETB dispara; "if it was cast", kicker e X falham (X vale 0) | Escolha a criatura pelo ETB e pelo corpo, não pelo efeito de conjurar |
| "tapped and attacking" | Ela nunca foi declarada atacante: gatilhos de "quando atacar" dela e seus não disparam (508.4). Pode ser bloqueada | Não pegue criatura cujo valor está no ataque. Combates extras desviram a Zara, não a emprestada |
| "that player or a planeswalker they control" | Só o jogador atacado ou planeswalker dele | Escolha o alvo do ataque pela mão que você quer olhar, não só pela vida |
| "Return that creature to its owner's hand at the beginning of the next end step" | Só volta se o mesmo objeto ainda estiver no campo (ruling de 10/11/2020). Sacrificada, vai ao cemitério do dono. Cópia fica com você. Mind Control nela não segura | O deck se decide aqui: **sacrificar, piscar ou copiar** antes da etapa final |
| Se você perder o jogo | A criatura é exilada (ruling) | — |
| Custo {3}{U}{R}, Human Pirate | Taxa de comandante soma 2 a cada volta | A Zara de 5 manas precisa de proteção e de ramp; o Wizard's Staff não funciona nela |

### 1.2 A conta do deck

**Espiar, emprestar, quitar.**

A Zara é uma linha de crédito compulsória: todo ataque toma uma criatura da mão de alguém, com vencimento na etapa final do mesmo turno. O que separa um empréstimo de um roubo é o que você faz antes do vencimento:

- **Sacrificar** (Goblin Bombardment, Phyrexian Altar, Fling, Kazuul's Fury, Grafted Identity): a carta vai para o cemitério do dono. É a baixa do ativo **dele**.
- **Piscar** (Thassa, Conjurer's Closet, Ghostly Flicker): a criatura volta como sua. É a conversão do empréstimo em capital **seu**.
- **Copiar** (Clone, Glasspool Mimic, Quasiduplicate, Fated Infatuation): o original volta, a cópia fica. É ficar com os juros.

Equação: valor de cada ataque = o ETB da criatura + o dano dela + (se quitado) uma carta a menos para o dono e uma a mais para você. Sem conversor, só as duas primeiras parcelas.

### 1.3 Onde a lista trai o plano, em ordem de gravidade

1. **Gera roubo, não converte.** 16 cartas roubam algo; 6 delas só até o fim do turno, e a Zara empresta todo turno. Contra isso, 7 conversores, todos de uso único. Act of Treason, Unwilling Recruit e Mob Rule sem saída de sacrifício são só ataques emprestados.
2. **Três cartas contra o plano.** Nevinyrral's Disk mata a Zara, os seus rocks e as suas Auras de roubo (Mind Control, Kitnap, Domestication, Grafted Identity). Blasphemous Act mata a Zara. Smoke trava você também: a Zara, os dois Niv e as criaturas roubadas disputam o único desvirar.
3. **O "Izzet óbvio" ainda está lá.** 9 cartas pagam por instantânea e feitiço (Archmage Emeritus, Firemind's Research, Goblin Electromancer, Vadrik, Leyline of Resonance, Niv-Mizzet Parun, Increasing Vengeance, Flare of Duplication, Silundi Vision). O tema foge do óbvio; um terço do motor da lista, não.
4. **Mana lenta para uma comandante de 5.** 6 rocks, 5 terrenos que sempre entram virados, Temple of the False God que não gera nada antes do 5º terreno. A Zara é conjurável até o turno 5 em 37,3% das partidas simuladas, e até o 6 em 53,0%.
5. **Nenhum multiplicador e quase nenhuma proteção.** Só o Clout of the Dominus protege a Zara, e nada copia o gatilho dela.

### 1.4 As três fases

Você não descreveu as fases. Proponho:

| Fase | O que deve acontecer | Hoje | Com as trocas |
|---|---|---|---|
| Início (turnos 1 a 4) | Rocks, Telepathy, uma anulação guardada, um conversor em campo | 6 rocks; nenhum conversor repetível | 8 rocks; Goblin Bombardment de 2 e Phyrexian Altar de 3 |
| Meio (turnos 5 a 8) | A Zara ataca toda rodada, lê a mão e escolhe a criatura pelo ETB; quita o empréstimo antes da etapa final | Zara no turno 5 em 37,3%; conversão de uso único | Zara no turno 5 em 46,2%; Thassa e Closet quitam sozinhos; Helm dá duas Zaras |
| Fim | Mob Rule ou Mass Manipulation, ataque com o exército dos outros, e saída de sacrifício para o que sobrar | Mob Rule sem onde sacrificar; Niv + Curiosity | Mob Rule mais Bombardment fecha a mesa; Niv + Curiosity continua como plano B |

---

## 2. Agrupamentos

Os oito eixos são seus: Ramp, Draw, Removal, Copia (spells), Tax + WinCon, Counter, Control (MonoBlue), Outros (control + cópia + etc). Li "Control (MonoBlue)" como **roubo de controle azul** (Mind Control, Treachery) e "Outros" como roubo vermelho, cópia de criatura e o resto.

**A ressalva, uma vez só.** Três eixos falham no crivo:
- "Tax + WinCon" junta duas funções sem relação (Propaganda e Fling).
- "Control (MonoBlue)" e "Outros" dividem o roubo pela cor, não pela função. E "Outros" é um saco de tudo.
- Falta o eixo que o deck mais precisa medir: **Conversão**, o que impede o empréstimo da Zara de voltar. Falta também proteção da Zara.

Proposta: "Control (MonoBlue)" vira **Roubo que fica**, de qualquer cor; "Outros" vira **Conversão**; e "Tax + WinCon" vira **Fechamento**, com a Propaganda indo para Counter, como interação. Mantive os seus eixos nas notas e medi a conversão por fora, com as marcas.

| Eixo | Cartas com nota 2+ hoje | Com as trocas | Soma das notas hoje | Com as trocas |
|---|---|---|---|---|
| Ramp | 6 | 8 | 12 | 19 |
| Draw | 7 | 7 | 27 | 26 |
| Removal | 6 | 4 | 15 | 10 |
| Copia (spells) | 4 | 4 | 10 | 8 |
| Tax + WinCon | 8 | 9 | 22 | 23 |
| Counter | 6 | 6 | 15 | 14 |
| Control (MonoBlue) | 8 | 12 | 21 | 31 |
| Outros | 11 | 17 | 34 | 50 |

---

## 3. Carta a carta

Notas de 0 a 3: R Ramp, D Draw, RM Removal, CS Copia (spells), TW Tax + WinCon, CT Counter, CM Control (MonoBlue), OU Outros. Pets assumidos: as cartas foil (Archmage Emeritus, Consuming Tide, Mind Control, Niv-Mizzet the Firemind, Quasiduplicate, Sensei's Divining Top, e os 12 Island e 8 Mountain foil). Pet soma 1 em Sinergia e nunca entra na fila de corte. **Por isso nenhum básico saiu**: a mana foi consertada trocando os terrenos não básicos.

Distribuição de hoje: tiers A 14, B 34, C 47, D 2, S 3; relevância INS 4, ALT 27, BAX 14, MÉD 55.

### Comandante (1)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Zara, Renegade Recruiter (roubo até o fim do turno) | OU3 | S | INS | 4/3 voando; ao atacar, olha a mão do defensor e põe uma criatura dela atacando sob seu controle; volta à mão do dono na etapa final | O empréstimo de todo turno; o deck existe para que ele não volte |

### Criatura (11)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Archmage Emeritus (Izzet óbvio) | D2 OU1 | B | ALT (pet) | Compra ao conjurar ou copiar instantânea ou feitiço | Pet; motor de mágicas, não de roubo |
| Clone (converte o empréstimo) | OU2 | B | ALT | Entra como cópia de qualquer criatura | Copia a criatura emprestada: a cópia fica |
| Dominus of Fealty (roubo até o fim do turno) | OU3 | A | ALT | Voar; no upkeep, pega qualquer permanente até o fim do turno, desvirado e com ímpeto | Roubo de todo turno; com saída de sacrifício vira perda definitiva |
| Glasspool Mimic (converte o empréstimo) | OU2 | B | ALT | Entra como cópia de criatura sua; verso é terreno | Copia o empréstimo da Zara; flexível como terreno |
| Goblin Electromancer (Izzet óbvio) | R1 | C | BAX | Instantâneas e feitiços custam {1} a menos | Izzet de mágicas, não de roubo |
| Goblin Flectomancer | CS2 | B | MÉD | Sacrifica-se: muda os alvos de instantânea ou feitiço | Rouba o alvo da remoção alheia |
| Malevolent Hermit | CT2 | B | MÉD | {U}, sacrifica: anula não-criatura a menos que paguem {3}; disturb | Anulação barata, duas vezes |
| Niv-Mizzet, Parun (Izzet óbvio) | D2 TW2 | B | ALT | Compra a cada instantânea ou feitiço de qualquer jogador; 1 de dano a cada compra | Combo com Curiosity (1089-2353) |
| Niv-Mizzet, the Firemind | D2 TW2 OU1 | B | ALT (pet) | {T}: compra; 1 de dano a cada compra | Pet; combo com Curiosity (1089-4971) |
| Sphinx of the Second Sun | D1 OU1 | C | BAX | Fase inicial extra depois da principal pós-combate | Oito manas para um upkeep e uma compra a mais |
| Vadrik, Astral Archmage (Izzet óbvio) | R1 | C | MÉD | Instantâneas e feitiços custam X a menos (X = poder) | Redutor de mágica; não rouba |

### Encantamento (17)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Clout of the Dominus | OU1 | B | ALT | Azul: +1/+1 e shroud; vermelho: +1/+1 e ímpeto | Na Zara: 6/5, shroud e ímpeto por 1 mana |
| Curiosity | D2 TW2 | A | ALT | Compra quando a criatura encantada causa dano a oponente | Na Zara compra a cada ataque; no Niv é combo |
| Dissipation Field | TW1 | C | BAX | Permanente que causa dano a você volta à mão do dono | Proteção lenta e cara |
| Domestication (roubo que fica) | CM2 | B | MÉD | Controle de criatura; sacrifica a Aura se o poder for 4+ | Roubo barato que só pega criatura pequena |
| Firemind's Research (Izzet óbvio) | D1 TW1 | C | MÉD | Contadores por mágica; compra ou 5 de dano | Motor de spellslinger |
| Grafted Identity (roubo que fica, converte o empréstimo) | CM3 | A | ALT | Sacrifica uma criatura para pegar outra | Sacrifique a emprestada pela Zara e roube outra para sempre |
| Kitnap (roubo que fica) | CM2 | B | ALT | Controle de criatura; sem presente, 3 marcadores de atordoamento | Roubo que fica |
| Leyline of Resonance (Izzet óbvio) | CS1 | C | BAX | Copia instantânea ou feitiço que mira só uma criatura sua | Quase nada no deck mira só criatura sua |
| Mind Control (roubo que fica) | CM3 | A | ALT (pet) | Controle de criatura | Pet; roubo que fica |
| Mirror Sheen | CS1 | C | BAX | Copia instantânea ou feitiço que mire você | Raramente miram você |
| Mirrormade | OU2 | B | MÉD | Entra como cópia de artefato ou encantamento | Copia o melhor artefato ou encantamento da mesa |
| Parallel Thoughts | D2 | C | BAX | Separa 7 cartas e compra delas | Cinco manas para reordenar compras |
| Propaganda | TW2 | B | ALT | Atacar você custa {2} por criatura | Pillow fort que segura a Zara viva |
| Rhystic Study (Game Changer) | D3 TW1 | A | ALT | Compra a cada mágica de oponente, a menos que paguem {1} | Game Changer; compra contínua |
| Smoke (**contra o plano**) | TW1 | D | BAX | Cada jogador desvira só uma criatura | Trava você também: Zara, Niv e as emprestadas competem pelo desvirar |
| Steal Enchantment (roubo que fica) | CM1 | C | BAX | Controle de encantamento | Alvo raro |
| Telepathy | OU2 | A | ALT | Oponentes jogam de mão revelada | Sinergia mais alta da Zara no EDHREC: você planeja o roubo e a anulação |

### Artefato (8)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Arcane Signet | R2 | A | ALT | Mana da identidade | Fixação |
| Fellwar Stone | R2 | B | MÉD | Mana de cor que um oponente gera | Rock de 2 |
| Izzet Signet | R2 | B | MÉD | {1},{T}: {U}{R} | Rock de 2 |
| Talisman of Creativity | R2 | A | ALT | {C}, ou {U}/{R} com 1 de dano | Rock de 2 |
| Sol Ring | R3 | S | INS | {C}{C} | O melhor rock |
| Midnight Clock | R2 D1 | C | MÉD | {U}; no 12º marcador, troca mão e cemitério por 7 cartas | Rock de 3 com recarga |
| Nevinyrral's Disk (**contra o plano**) | RM2 | D | BAX | Destrói artefatos, criaturas e encantamentos | Mata a Zara, os seus rocks e as Auras de roubo |
| Sensei's Divining Top | D1 OU1 | B | ALT (pet) | Olha e reordena o topo | Pet; filtro barato |

### Instantânea (17)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Counterspell | CT3 | A | INS | Anula mágica | A anulação de referência |
| Cyclonic Rift (Game Changer) | RM3 | S | INS | Devolve permanente; sobrecarregado, tudo dos oponentes | Game Changer; poupa o que você controla, inclusive o roubado |
| Domineering Will (roubo até o fim do turno) | CM2 | B | MÉD | Um jogador pega até 3 criaturas que não atacam até o fim do turno, e elas bloqueiam | Política e combo com saída de sacrifício |
| Essence Capture | CT2 | B | MÉD | Anula mágica de criatura e +1/+1 | Anulação barata |
| Exclude | D1 CT2 | B | ALT | Anula mágica de criatura e compra | Anulação com carta |
| Fated Infatuation (converte o empréstimo) | OU2 | B | MÉD | Ficha cópia de criatura sua | Copia o empréstimo da Zara |
| Flare of Duplication (Izzet óbvio) | CS2 | B | MÉD | Copia instantânea ou feitiço; pode sacrificar criatura vermelha em vez de pagar | Copia Mass Manipulation ou o Gambit |
| Fling (converte o empréstimo) | TW2 | A | ALT | Sacrifica uma criatura e causa dano igual ao poder | Converte o empréstimo em dano e em perda para o dono |
| Increasing Vengeance (Izzet óbvio) | CS2 | B | MÉD | Copia instantânea ou feitiço seu; flashback copia duas vezes | Copiador de mágica própria |
| Izzet Charm | D1 RM1 CT1 | B | MÉD | Anula não-criatura (2), 2 de dano, ou compra 2 e descarta 2 | Flexível |
| Kazuul's Fury (converte o empréstimo) | TW2 | A | ALT | Sacrifica uma criatura e causa dano igual ao poder; verso é terreno | O segundo Fling, e terreno quando faltar |
| Mana Leak | CT1 | C | BAX | Anula a menos que paguem {3} | Anulação que envelhece mal no jogo longo |
| Negate | CT2 | B | MÉD | Anula não-criatura | Protege as Auras de roubo |
| Redirect | CS2 | B | MÉD | Muda os alvos de uma mágica | Rouba a mágica do oponente |
| Run Away Together | RM1 | C | BAX | Devolve duas criaturas de jogadores diferentes | Remoção temporária fraca |
| Silundi Vision (Izzet óbvio) | D1 | C | MÉD | Busca instantânea ou feitiço entre 6; verso é terreno | Filtro; terreno quando faltar |
| Supreme Will | D1 CT2 | B | MÉD | Anula a menos que paguem {3}, ou impulso de 4 | Flexível |

### Feitiço (15)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Consuming Tide | D1 RM2 | B | MÉD (pet) | Cada jogador fica com uma não-terreno; o resto volta à mão | Pet; reset que rende cartas |
| Act of Treason (roubo até o fim do turno) | OU2 | B | MÉD | Pega uma criatura até o fim do turno, com ímpeto | Só rende com saída de sacrifício |
| Alchemist's Gambit | TW1 OU2 | B | MÉD | Turno extra; pelo custo normal você perde no fim dele, pelo cleave (7) não | Mais um ataque da Zara |
| Blasphemous Act (**contra o plano**) | RM2 | C | BAX | 13 de dano em cada criatura; custa {1} a menos por criatura | Mata a Zara |
| Browbeat | D1 TW1 | C | BAX | 5 de dano a quem aceitar, ou alguém compra 3 | O oponente escolhe |
| Day's Undoing | D2 OU1 | C | MÉD | Todos embaralham mão e cemitério e compram 7; termina o turno | Enche a mão que a Zara vai olhar; também a deles |
| Invoke the Winds (roubo que fica) | CM2 | B | MÉD | Pega artefato ou criatura e desvira | Roubo que fica; {U}{U}{U}{U} pesado |
| Mass Manipulation (roubo que fica) | TW2 CM3 | A | ALT | Pega X criaturas e/ou planeswalkers | O fechamento de roubo |
| Mizzium Mortars | RM2 | A | ALT | 4 de dano em criatura; sobrecarregada, nas dos oponentes | Limpeza que poupa a Zara |
| Mob Rule (roubo até o fim do turno) | TW2 OU3 | A | ALT | Pega as criaturas de poder 4+ ou 3- até o fim do turno | O ataque com o exército dos outros |
| Order of Succession (roubo que fica) | CM1 OU1 | B | MÉD | Cada jogador pega uma criatura do próximo | Política; você escolhe o que pega |
| Quasiduplicate (converte o empréstimo) | OU2 | B | ALT (pet) | Ficha cópia de criatura sua; jump-start | Pet; duas cópias do empréstimo |
| Sakashima's Will (roubo que fica) | CM2 OU1 | B | ALT | O oponente escolhe uma criatura e você fica com ela; com comandante, também o modo de cópia | Roubo que ignora hexproof |
| Unwilling Recruit (roubo até o fim do turno) | OU1 | C | BAX | Pega criatura até o fim do turno, +X/+0 | Threaten caro de {R}{R}{R} |
| Vandalblast | RM2 | B | ALT | Destrói artefato; sobrecarregado, os dos oponentes | Remoção assimétrica |

### Terreno (31)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Castle Vantress | D1 | C | MÉD | Desvirado com Island; {2}{U}{U},{T}: vidência 2 | Base de mana |
| Command Tower | — | B | ALT | Terreno | Base de mana |
| Desolate Lighthouse | D1 | C | MÉD | {1}{U}{R},{T}: compra e descarta | Base de mana |
| Encroaching Wastes | — | C | MÉD | Incolor; sacrifica para destruir terreno não básico | Incolor num deck de duas cores |
| Island ×12 | — | C | MÉD (pet) | Terreno | Pet (foil) |
| Izzet Boilerworks | — | C | MÉD | Karoo: devolve um terreno, gera {U}{R} | Base de mana |
| Mountain ×8 | — | C | MÉD (pet) | Terreno | Pet (foil) |
| Myriad Landscape | — | C | MÉD | Busca dois básicos do mesmo tipo | Base de mana |
| Reliquary Tower | — | C | MÉD | Sem limite de mão | Base de mana |
| Temple of Epiphany | — | C | MÉD | Dual virada com vidência | Base de mana |
| Temple of the False God | R-1 | C | MÉD | {C}{C} só com 5+ terrenos | Não gera nada no começo |
| Vivid Crag | R-1 | C | MÉD | Entra virado; R ou qualquer cor com marcador | Base de mana |
| Vivid Creek | R-1 | C | MÉD | Entra virado; U ou qualquer cor com marcador | Base de mana |


O pet mais fraco é o **Archmage Emeritus**: paga por mágica, não por roubo. Fica.

---

## 4. Diagnóstico

### 4.1 Faixas

| Item | Faixa | Hoje | Com as trocas | Leitura |
|---|---|---|---|---|
| Fontes de terreno | 35 a 37 | 34 (31 terrenos e 3 duplas face) | 34 | Uma abaixo; aceitável com as duplas face, se a mana parar de entrar virada |
| Ramp dedicado | 10 a 12 | 6 | 8 | Abaixo, para uma comandante de 5 manas. É o próximo ajuste |
| Compra dedicada | 10 a 12 | 7 | 7 | Abaixo no papel; Telepathy e Curiosity na Zara compensam parte |
| Remoção | 8 a 12 | 6 | 4 | Baixa de propósito: o roubo é a remoção do deck |
| Anulação | — | 6 | 6 | Muito para um deck que quer atacar; mantive, porque a Telepathy mostra o que anular |

### 4.2 Gerar contra converter

| Gera | Converte |
|---|---|
| A Zara a cada ataque, 16 cartas de roubo, 6 delas temporárias | 7 conversores, nenhum repetível |

É a doença do Vito e do Greymond em versão Izzet: o deck produz o recurso todo turno e só sabe gastá-lo uma vez.

### 4.3 Contra o plano

Nevinyrral's Disk, Blasphemous Act e Smoke. Atritos menores, que ficam:
- **Domestication** só segura criatura de poder 3 ou menos.
- **Day's Undoing** termina o turno: a etapa final é pulada, e a criatura emprestada fica com você até a próxima etapa final, que é no turno do oponente. Ela bloqueia por você. Não é armadilha; é truque.
- **Consuming Tide** devolve também as suas Auras de roubo, se você não escolher a certa.

### 4.4 Combos

| Combo | ID | Na lista | Vence sozinho? |
|---|---|---|---|
| Curiosity + Niv-Mizzet, Parun | 1089-2353 | As duas | Compra e dano até o grimório acabar; em mesa de 4, fecha com grimório cheio ou com os dois Niv |
| Curiosity + Niv-Mizzet, the Firemind | 1089-4971 | As duas | Idem |
| Zara | nenhum no Commander Spellbook | — | A Zara é motor de valor, não peça de combo |

Nenhuma entrada cria combo novo. Agent of Treachery com Thassa ou Closet rouba um permanente por turno; é motor, não laço infinito.

### 4.5 Brackets

Dois Game Changers (Rhystic Study e Cyclonic Rift), mantidos. Dois combos de duas cartas, ambos com uma peça de 6 manas. Leitura: **Bracket 3**, antes e depois. Atenção ao Alchemist's Gambit copiado pelo Increasing Vengeance ou pela Flare: turnos extras encadeados esbarram no espírito do Bracket 3.

### 4.6 Placar

Hoje 194; com as trocas 244. O placar compara o deck com ele mesmo. Ele não mede multiplicação: a camada 2 (Helm, Resonator, Boots) faz o placar cair de 208 para 205, porque troca um redutor de custo por cópias do gatilho. É a camada que mais muda o jogo e a que o placar menos enxerga.

---

## 5. Combos e linhas

### 5.1 Motores

- **Zara + Thassa (ou Closet).** Ataque, pegue a criatura de melhor ETB, e na etapa final ordene o gatilho da Thassa por cima da devolução. A criatura volta como sua, desvirada, com o ETB de novo. Com o Agent of Treachery, cada etapa final rouba um permanente.
- **Zara + Helm of the Host.** A ficha não é lendária e tem ímpeto: duas Zaras atacando, duas mãos lidas, dois empréstimos. Com o Strionic Resonator, três.
- **Dominus of Fealty + saída de sacrifício.** No upkeep, pegue o melhor permanente de alguém; use e sacrifique antes da etapa final.

### 5.2 Fechamentos

- **Mob Rule + Goblin Bombardment.** Pegue as criaturas de poder 4 ou mais, ataque com elas, e sacrifique tudo no Bombardment antes da etapa final. Cada criatura vira 1 de dano e uma perda definitiva para o dono.
- **Mass Manipulation.** Permanente; com X alto, é a limpeza do deck.
- **Niv + Curiosity**, o plano B.
- **Fling e Kazuul's Fury** na maior criatura emprestada.

### 5.3 Como fechar a mesa, e não só um jogador

O roubo é cirúrgico por natureza: a Zara escolhe de quem tira. Para a mesa inteira, a linha é o Mob Rule com o Bombardment, que pega de todos ao mesmo tempo. O Niv com a Curiosity aponta o dano para quem quiser, um ponto de cada vez.

### 5.4 O momento da jogada

- **Quem atacar.** O jogador cuja mão você quer ver, não necessariamente o mais fraco. Com a Telepathy, você já sabe antes de declarar.
- **Qual criatura pegar.** A de melhor ETB, se houver Thassa ou Closet; a de maior poder, se houver Fling; a que o dono mais precisa, se houver Bombardment.
- **Ordem na etapa final.** Gatilho da Thassa ou do Closet por cima da devolução da Zara. Se esquecer, a criatura volta.
- **Mob Rule na fase principal de antes do combate**, e o sacrifício na de depois.
- **Anulação guardada** para a remoção na Zara, não para a primeira ameaça que aparecer.

---

## 6. Cortes, em ordem

1. Nevinyrral's Disk: mata a Zara, os rocks e as Auras de roubo.
2. Blasphemous Act: mata a Zara.
3. Smoke: trava você também.
4. Leyline of Resonance: quase nada no deck mira só uma criatura sua.
5. Mirror Sheen: raramente miram você.
6. Sphinx of the Second Sun: oito manas para um upkeep a mais.
7. Parallel Thoughts: cinco manas para reordenar compras.
8. Unwilling Recruit: Threaten de {R}{R}{R}.
9. Steal Enchantment: alvo raro.
10. Dissipation Field: proteção lenta.
11. Goblin Electromancer e Firemind's Research: "Izzet óbvio".
12. Run Away Together e Mana Leak: as interações mais fracas.
13. Temple of the False God, Encroaching Wastes, Vivid Crag e Vivid Creek: os terrenos que não geram cor ou entram virados.

---

## 7. Entradas

### 7.1 Os pares

| # | Camada | Sai | Entra | Por quê |
|---|---|---|---|---|
| 1 | 1. Quitar o empréstimo | Nevinyrral's Disk | Thassa, Deep-Dwelling | Sai a carta que mata a Zara e as Auras de roubo; entra a que torna o empréstimo da Zara permanente |
| 2 | 1. Quitar o empréstimo | Smoke | Goblin Bombardment | Trava simétrica por saída de sacrifício sem mana |
| 3 | 1. Quitar o empréstimo | Leyline of Resonance | Phyrexian Altar | Copiador sem alvo no deck por saída de sacrifício que vira mana |
| 4 | 1. Quitar o empréstimo | Sphinx of the Second Sun | Conjurer's Closet | Oito manas por um upkeep a mais, por cinco manas que roubam para sempre todo turno |
| 5 | 1. Quitar o empréstimo | Mirror Sheen | Ghostly Flicker | Cópia de mágica que raramente acha alvo por flicker que fixa dois roubos |
| 6 | 2. Mais Zara | Parallel Thoughts | Helm of the Host | Cinco manas de filtro por uma Zara a mais todo turno |
| 7 | 2. Mais Zara | Goblin Electromancer | Strionic Resonator | Redutor de mágica por cópia do gatilho da Zara |
| 8 | 2. Mais Zara | Run Away Together | Swiftfoot Boots | Bounce fraco por proteção e ímpeto para o comandante de 5 manas |
| 9 | 3. Roubo que fica | Unwilling Recruit | Treachery | Threaten de {R}{R}{R} por roubo que fica e sai de graça |
| 10 | 3. Roubo que fica | Steal Enchantment | Gilded Drake | Roubo de encantamento por troca de criatura de 2 manas |
| 11 | 3. Roubo que fica | Dissipation Field | Control Magic | Proteção lenta por roubo que fica |
| 12 | 3. Roubo que fica | Blasphemous Act | Agent of Treachery | Limpeza que mata a Zara por roubo de qualquer permanente |
| 13 | 4. Mana | Mana Leak | Mind Stone | Anulação que envelhece mal por rock de 2 |
| 14 | 4. Mana | Firemind's Research | Thought Vessel | Motor de spellslinger por rock de 2 |
| 15 | 4. Mana | Temple of the False God | Volcanic Island | Terreno que não gera nada no começo por dual |
| 16 | 4. Mana | Encroaching Wastes | Steam Vents | Incolor por dual |
| 17 | 4. Mana | Vivid Crag | Sulfur Falls | Virada por desvirada |
| 18 | 4. Mana | Vivid Creek | Shivan Reef | Virada por desvirada |

### 7.2 Quanto cada camada rende

| Camada | Trocas | Placar acumulado | Conversores | Roubo que fica | Contra o plano | O que compra |
|---|---|---|---|---|---|---|
| Hoje | — | 194 | 7 | 9 | 3 | — |
| 1. Quitar o empréstimo | 5 | 208 | 12 | 12 | 1 | Quatro conversores repetíveis e um instantâneo: o empréstimo da Zara deixa de voltar. Ver um conversor repetível até o turno 6: de zero para 40,9% |
| 2. Mais Zara | 3 | 205 | 12 | 12 | 1 | Duas Zaras por combate (Helm) ou um gatilho copiado (Resonator); hexproof e ímpeto para a comandante de 5 |
| 3. Roubo que fica | 4 | 214 | 12 | 15 | nenhuma | Roubo que fica: de 9 para 15 cartas. Sai a última carta contra o plano |
| 4. Mana | 6 | 244 | 12 | 15 | nenhuma | Zara conjurável até o turno 5 de 37,3% para 46,2%; terrenos que entram virados de 5 para 3 |

A camada 1 é a que muda o deck: sem ela, as outras três só deixam a Zara emprestar mais rápido. Se você parar em uma, pare na 1.

### 7.3 Antes e depois

| Medida | Hoje | Com as 18 trocas |
|---|---|---|
| Placar | 194 | 244 |
| CMC médio (sem terrenos) | 3,16 | 3,09 |
| Cartas que roubam | 16 | 21 |
| Roubo que fica | 9 | 15 |
| Roubo até o fim do turno | 6 | 5 |
| Conversores do empréstimo (sacrificar, piscar, copiar) | 7 | 12 |
| Conversores repetíveis | nenhum | 4 |
| Ver um conversor até o turno 6 (qualquer / repetível) | 60,7% / zero | 80,8% / 40,9% |
| Multiplicadores do gatilho da Zara | nenhum | 2 |
| Proteção da Zara | 1 | 2 |
| Cartas contra o plano | 3 | nenhuma |
| Cartas do "Izzet óbvio" (pagam por instantânea e feitiço) | 9 | 6 |
| Ramp dedicado | 6 | 8 |
| Fontes de terreno (com as duplas face) | 34 | 34 |
| Terrenos que sempre entram virados / incolores | 5 / 5 | 3 / 3 |
| Zara conjurável até o turno 5 / 6 / 7 | 37,3% / 53,0% / 62,3% | 46,2% / 60,6% / 69,8% |
| Game Changers | 2 | 2 |
| Das 15 de maior sinergia com a Zara | 2 | 5 |

### 7.4 O texto das entradas

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Thassa, Deep-Dwelling (roubo que fica, converte o empréstimo) | OU3 | S | INS | Indestrutível; na sua etapa final, exila outra criatura sua e a devolve sob seu controle | Ordene o gatilho antes da devolução da Zara: a criatura emprestada volta como sua, para sempre, e com o ETB de novo |
| Goblin Bombardment (converte o empréstimo) | TW3 OU1 | S | INS | Sacrifica uma criatura: 1 de dano em qualquer alvo | Saída de sacrifício sem mana: o empréstimo nunca volta, e cada roubo vira dano |
| Treachery (roubo que fica) | CM3 | S | INS | Controle de criatura; ao entrar, desvira até 5 terrenos | O melhor roubo do azul, de graça |
| Control Magic (roubo que fica) | CM3 | A | ALT | Controle de criatura | Roubo que fica, por 4 |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Gilded Drake (roubo que fica) | CM2 OU1 | A | ALT | Ao entrar, troca o controle dela por uma criatura de oponente | Troca para sempre por 2 manas |
| Agent of Treachery (roubo que fica) | D2 CM3 | A | ALT | Ao entrar, pega qualquer permanente; compra 3 com 3+ permanentes alheios | Com Thassa ou Closet, rouba um permanente por turno |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Conjurer's Closet (roubo que fica, converte o empréstimo) | OU3 | A | ALT | Na sua etapa final, pode exilar criatura sua e devolvê-la sob seu controle | A segunda Thassa, incolor |
| Phyrexian Altar (converte o empréstimo) | R1 TW1 OU2 | A | ALT | Sacrifica uma criatura: uma mana de qualquer cor | O empréstimo vira mana; com Act of Treason e Mob Rule, o exército dos outros paga o seu turno |
| Helm of the Host | OU3 | A | ALT | No combate, ficha cópia não lendária da criatura equipada, com ímpeto | Uma Zara a mais por turno: dois roubos por ataque, acumulando |
| Strionic Resonator | OU2 | B | ALT | {2},{T}: copia gatilho seu | Copia o gatilho da Zara, o da Thassa ou o ETB da criatura emprestada |
| Swiftfoot Boots | OU1 | B | ALT | Hexproof e ímpeto; equipar {1} | A Zara custa 5 e mais 2 a cada volta: ela precisa ficar |
| Mind Stone | R2 D1 | B | MÉD | {C}; sacrifica para comprar | Rock barato para a Zara de 5 |
| Thought Vessel | R2 | B | MÉD | {C}; sem limite de mão | Rock barato |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Ghostly Flicker (roubo que fica, converte o empréstimo) | OU2 | B | ALT | Exila dois artefatos, criaturas ou terrenos seus e devolve sob seu controle | Dois roubos temporários viram permanentes, na hora que você quiser |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Volcanic Island | — | B | MÉD | Dual original U/R | Dual desvirada |
| Steam Vents | — | B | MÉD | Shock U/R | Dual desvirada |
| Sulfur Falls | — | B | MÉD | Desvirada com Island ou Mountain | Dual desvirada |
| Shivan Reef | — | B | MÉD | Painland U/R | Dual desvirada |

### 7.5 Recusadas, para não voltarem à mesa

| Carta | Por que não |
|---|---|
| Essence Flux | Devolve a criatura ao controle **do dono**: entrega o empréstimo de volta |
| Aboleth Spawn | Copia gatilhos de criaturas que entram sob controle de oponente; as da Zara entram sob o seu |
| Sower of Temptation, Mind Flayer, Willbreaker | "Enquanto você controlar": morrem fácil, e o roubo vai junto |
| Wizard's Staff | A Zara é Pirate, não Wizard |
| Knowledge Exploitation | O prowl pede Rogue |
| Delney, Isshin, Wulfgar | Fora das cores |

### 7.6 Banco

- **Bribery** e **Zealous Conscripts**: roubo de grimório e de qualquer permanente.
- **Vedalken Shackles**: com 12 Islands, rouba quase tudo. Forte e repetível.
- **Deadeye Navigator**: a terceira peça de flicker, cara.
- **Ashnod's Altar**: segunda saída de sacrifício que vira mana.
- **Whispersilk Cloak**: a Zara imbloqueável.
- **Captivating Crew** e **Insurrection**: roubo temporário que fica forte com o Bombardment.
- **Relentless Assault** e combates extras: a Zara ataca de novo e lê outra mão (a criatura emprestada não desvira).
- **Jabs, Mistress of Mockery**: dobra os ETBs das criaturas que você controla mas não possui. Sai em 19/10/2026; confira quando for legal.
- Mais rocks, se a Zara continuar atrasando: Coldsteel Heart, Thran Dynamo.

---

## 8. Painel

| Nome | Ideia |
|---|---|
| **Empréstimo Compulsório** (escolhido) | O que a Zara faz, em linguagem de fisco |
| Mão Leve | Para o irmão: direto e com graça |
| Cofre Alheio | Joga com o que é dos outros |

**Clima.** Casa de penhores pirata nos canais de Ravnica: latão, vapor, mapa náutico e cautelas de penhor numeradas penduradas no balcão.

**Paleta.**

| Cor | Hex | Uso |
|---|---|---|
| Azul-abismo | #12263A | Fundo |
| Latão-velho | #B08D57 | Títulos, molduras |
| Brasa-de-pólvora | #C4472F | Destaques, alertas |
| Ferrugem-de-casco | #6B4A3A | Linhas, secundários |
| Papel-de-penhor | #E8DCC2 | Texto principal |

**Moldura.** Borda de carta náutica com rosa-dos-ventos nos cantos e rebites de latão.

**Motivo gráfico.** Uma cautela de penhor numerada, presa por um gancho de abordagem, com a data de vencimento riscada: "etapa final".

---

## 9. Dúvidas

### 9.1 Fontes

Texto das cartas: json.edhrec.com (as 80 da lista e as 26 candidatas; seis delas também no Archidekt). Rulings: grimoria.app e api.magicthegathering.io (cinco rulings oficiais da Zara, de 10/11/2020). Combos: Commander Spellbook, por ID. Dados: edh.wiki (619 decks) e EDHREC (cortado). Das duas listas de inspiração, a do Archidekt abriu com 90 das 100 cartas; a do Moxfield não abriu (bloqueio de robô e página que exige JavaScript).

### 9.2 Suposições

- **Pets**: as foil, inclusive os 20 básicos.
- **Ambição**: em camadas.
- **"Control (MonoBlue)"**: roubo azul; **"Outros"**: roubo vermelho, cópia de criatura e o resto.
- **Monte Carlo de mana**: 40 mil partidas, na jogada, sem mulligan. A dupla face só é jogada como terreno quando não há outro. A Izzet Boilerworks conta como uma mana virada. O Temple of the False God só gera com 5 terrenos.

### 9.3 Regras sem ruling oficial (dedução)

- **Thassa e Closet tornam o empréstimo permanente.** A criatura que sai e volta é um objeto novo (regra 400.7); a devolução da Zara procura o objeto antigo e não acha nada. Os dois gatilhos começam na etapa final e você escolhe a ordem (603.3b). Nenhuma ruling diz isso com essas cartas; o raciocínio é o mesmo de piscar uma criatura roubada por Act of Treason.
- **Day's Undoing** pula a etapa final e adia a devolução para a próxima etapa final, no turno de outro jogador.
- **Helm of the Host**: a ficha copia a Zara com o gatilho e com a devolução própria de cada criatura que ela puser.

### 9.4 Cinco avaliações discutíveis

1. **Cortar a Smoke.** Ela é anti-criatura, e o deck usa as criaturas dos outros. Mas trava a Zara junto.
2. **Manter as sete anulações que sobram.** É muito para um deck que quer atacar. Fiquei com elas porque a Telepathy diz exatamente o que anular.
3. **Manter o Niv-Mizzet, Parun**, que é o "Izzet óbvio" em pessoa. Ele é metade de um combo da lista.
4. **Thassa como S.** Toda a nota projetada depende da leitura de regra da seção 9.3. Se a sua mesa ler diferente, a Thassa cai para A e o Closet some.
5. **Nota 8 projetada.** A Zara continua chegando no turno 5 em menos da metade das partidas. A próxima camada, se houver, é mais ramp.

### 9.5 Se fosse reconstrução

Uma reconstrução trocaria a parte de spellslinger inteira (Vadrik, Flare, Increasing Vengeance, Silundi Vision, Niv-Mizzet Parun, Alchemist's Gambit) e as anulações fracas por roubo e saídas de sacrifício do banco (Vedalken Shackles, Bribery, Zealous Conscripts, Ashnod's Altar, Deadeye Navigator, Insurrection) e por mais ramp. Ficaria mais forte e mais longe do deck que você deu ao seu irmão. Não fiz.

---

## 10. Confronto

**Com o EDHREC e o edh.wiki.** Das 15 cartas de maior sinergia com a Zara, você tinha 2 (Telepathy e Fling). Com as trocas, 5: entram Thassa, Conjurer's Closet e Ghostly Flicker, exatamente o trio de flicker. As outras são piratas e terrenos de sacrifício que fazem um deck de Pirates, não de roubo.

**Com a lista do Archidekt que você mandou** ("Zara", de TheGrandMagus, 90 cartas lidas). As cartas de alta sinergia que ela tem e a sua não: Conjurer's Closet, Ghostly Flicker, Glasses of Urza, Thassa, High Market e Rogue's Passage. Três delas entraram. A base de terrenos dela (Sulfur Falls, Shivan Reef, Steam Vents) é a mesma direção da camada 4.

**Com o que você disse.**

- *"Pra fugir do óbvio que geralmente Izzet é, de mágicas ou magos."* Concordo com o tema e discordo da lista: 9 cartas pagavam por instantânea e feitiço. Com as trocas, 6. Mantive as que são pets ou metade do combo.
- *"Queria um deck de roubo, jogar com as cartas dos adversários."* O deck rouba muito e fica com pouco. A Zara empresta; quem rouba de verdade é o que você faz antes da etapa final.
- *"Coloquei umas cartas fortes, a base de mana que encontrei, mágicas sinérgicas."* As fortes estão certas: Cyclonic Rift, Rhystic Study, Mass Manipulation, Telepathy. A base de mana é o ponto fraco: cinco terrenos que sempre entram virados e cinco que não geram cor, para uma comandante de 5 manas.
