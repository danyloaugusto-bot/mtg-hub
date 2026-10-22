# Análise: Tergrid (Tergrid, God of Fright)
Analista: Claude (Opus 5.5) | Data: 13/10/2026 | Rodada: reconstrução
Lista conferida: sim, 100 cartas, sem repetidas, tudo mono-black | Cartas sem texto conferido: 0 das 100 da lista atual e 0 das 40 entradas

**Suposições declaradas no topo**

- Ambição: reconstrução para o máximo de força, sem teto de bracket. Resposta dele: "pode ser o mais alto bracket".
- Cartas de estimação: nenhuma. Ele respondeu "pode seguir com qualquer sugestão", então tudo podia sair.
- Eixos: ele aprovou a troca. O 7 passa a ser Fechamento e o 8 passa a ser Recursão e Resiliência.
- A base de mana entrou na conversa, como eu tinha proposto.
- Correção do ponto de controle: lá eu disse oito terrenos incolores. São nove quando a Cabal Stronghold entra na conta: ela gera {C} sozinha e só dá {B} pela habilidade.
- Este arquivo traz a rodada de diagnóstico e a de reconstrução juntas. A lista atual é avaliada na mesma régua para que o antes e depois saia dos mesmos dados.

---

## 1. Plano

**Esvaziar, roubar, sufocar.**

**A conta do deck:** roubos por volta = eventos forçados nos oponentes × taxa de acerto.

O texto da Tergrid (conferido) só paga quando um **oponente** sacrifica uma permanente **não-ficha** ou descarta uma carta **de permanente**. Isso decide o resto:

- Evento forçado é cada descarte ou sacrifício de um oponente. Um motor recorrente, como Bottomless Pit, Smokestack ou Braids, gera três eventos por volta, um em cada oponente.
- Taxa de acerto é a chance de o evento cair numa permanente que não é ficha. É alta quando o oponente não escolhe: descarte aleatório, a mão inteira, metade de tudo, o maior MV, criatura não-ficha, ou você escolhendo a carta. É baixa quando ele escolhe: entrega uma ficha ou uma mágica instantânea.
- Hipótese de trabalho, sem fonte: numa mesa de Commander, perto de 60% das cartas na mão são permanentes, contando terrenos. Com só a Tergrid e Bottomless Pit, isso dá cerca de dois roubos por volta. Cada motor a mais soma de um a dois.

**Onde a lista atual trai o plano, por gravidade**

1. **Taxa de acerto baixa.** Dos 32 forçadores da lista, 22 deixam o oponente escolher. Em mesa de fichas, edito à escolha não gera nada.
2. **Poucos motores.** Fora a Tergrid, a lista tem 5 motores recorrentes, e dois deles (Oppression e Liliana Vess) são fracos. A chance de ter um motor até o turno 4 é 42%.
3. **A Tergrid sai tarde.** Na simulação, a mediana é o turno 6, e só 10% dos jogos a têm até o turno 3. Há 5 aceleradores de duas manas ou menos.
4. **Simetria contra você mesmo.** Tainted Aether cobra um sacrifício a cada criatura que a Tergrid rouba, porque a criatura entra sob o seu controle. Living Death desfaz o roubo, porque você sacrifica as criaturas roubadas. Oppression pesa mais em quem conjura mais, e esse é você.
5. **Fechamento caro.** Vorpal Sword pede oito manas e um combate, Curse of the Cabal custa dez, Westvale Abbey é lenta. O fechamento de verdade, Dark Depths com Thespian's Stage, já estava na lista.
6. **Base de mana.** 9 terrenos não dão preto, sem Urborg para consertar, num deck com Obliterator ({B}{B}{B}{B}).

**As três fases**

| Fase | O que você descreveu | O que a lista atual entrega | O que a lista nova entrega |
|---|---|---|---|
| I. Início | Ler a mesa, ramp, política, criaturas pequenas | 6 ramps dedicados; a política briga com Oppression e Pit | Aceleração (13 ramps dedicados), descarte cedo (Hymn, Mind Twist, Thoughtseize) e o primeiro motor. **A política sai**: este deck vai ser o vilão da mesa, e a lista nova foi feita para aguentar isso |
| II. Meio | Preparar o terreno para a Tergrid e as mágicas fortes | A Tergrid chega, em mediana, no turno 6 | A Tergrid chega em mediana no turno 5, e o meio é instalar o lock: Smokestack, Braids, Archfiend, Pit, Mists |
| III. Fim | Finalizar um ou dois jogadores sem pensar muito | Torment e Marit Lage, mais Vorpal e Westvale, que são lentas | Seis fechamentos de uma ou duas cartas: Marit Lage, Sheoldred com Peer, Citadel, Torment com Coffers, Archon, Sheoldred com Dark Deal |

**Onde discordo do plano dele:** "política no início" e "pressão por descarte simétrico" não cabem na mesma lista. Escolhi a pressão. O "sem pensar muito" do fim do jogo vale para a lista nova, mas a vitória vem por sufocamento: o turno final é o do Torment ou da Citadel, não o de um combate.

---

## 2. Agrupamentos

A ordem das notas é: **Ramp · Draw · Removal · Proteção · Descarte · Sacrifício · Fechamento · Recursão**

1. **Ramp.** Mana e aceleração. Um terreno que entra virado leva −1.
2. **Draw.** Compra. Tutor leva 1: ele acha a carta, mas não soma carta.
3. **Removal.** Tira uma ameaça da mesa. Edito leva nota aqui também.
4. **Proteção.** Mantém a Tergrid ou a mesa viva.
5. **Descarte.** Faz o oponente descartar. Quem só paga pelo descarte, como Waste Not, leva 1.
6. **Sacrifício.** Faz o oponente sacrificar.
7. **Fechamento.** Tira jogadores do jogo, ou é peça de uma linha que tira.
8. **Recursão.** Traz de volta, de qualquer cemitério. A Tergrid leva 3, porque o roubo dela é recursão do cemitério alheio.

---

## 3. Carta a carta

### 3.1 A lista nova, com o status de cada carta

### Comandante (1)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Tergrid, God of Fright | 0·0·1·0·2·2·2·3 | S | INS | Ameaça; oponente sacrifica não-ficha ou descarta permanente: você pode pôr a carta em campo sob seu controle. Verso: Lantern | É o deck. O roubo é permanente: o que ela trouxe fica mesmo se ela sair. A Lantern é o plano B quando a Tergrid morre cedo demais | fica |

### Criatura (13)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Archon of Cruelty | 0·2·2·0·2·2·2·0 | S | INS | Entra ou ataca: sacrifica, descarta, perde 3; você compra e ganha 3 | Alvo de reanimação: chega no turno 2 com Reanimate | fica |
| Rankle, Master of Pranks | 0·1·0·0·2·2·2·0 | A | ALT | Voa, ímpeto; dano: descarte, perde e compra, sacrifica | Escolhe os modos: você pode pular o sacrifício quando só tem a Tergrid | fica |
| Sheoldred, Whispering One | 0·0·1·0·0·3·1·2 | A | ALT | Oponentes sacrificam criatura na manutenção deles; você reanima na sua | Motor e alvo de reanimação | fica |
| Archfiend of Depravity | 0·0·2·0·0·3·1·0 | S | INS | Fim do turno de cada oponente: fica com duas criaturas, sacrifica o resto | Contra deck de mesa larga, pega tudo que não é ficha | entra |
| Phyrexian Obliterator | 0·0·1·1·0·2·2·0 | A | ALT | Quem causa dano a ela sacrifica essa quantidade de permanentes | Bloqueador que rouba: cada ataque contra ela vira Tergrid | fica |
| Braids, Cabal Minion | 0·0·0·0·0·3·1·0 | S | INS | Na manutenção de cada jogador: sacrifica artefato, criatura ou terreno | Você sacrifica o que roubou; eles sacrificam o que é deles | entra |
| Accursed Marauder | 0·0·1·0·0·2·0·0 | B | MÉD | Cada jogador sacrifica criatura não-ficha | Não-ficha por duas manas; você sacrifica o próprio Marauder | entra |
| Crypt Ghast | 3·0·0·0·0·0·0·0 | B | MÉD | Pântano virado para mana dá {B} a mais | Com Coffers e Urborg vira explosão; é corpo de 4 manas, cai antes de outro ramp | fica |
| Mindslicer | 0·0·0·0·3·0·0·0 | A | ALT | Ao morrer, todos descartam a mão | Com Tower ou Marauder, a mão de três oponentes sob a Tergrid | entra |
| Opposition Agent | 0·1·1·1·0·0·0·0 | A | ALT | Controla as buscas dos oponentes; exila o que acham | Corta tutores e ramp de busca; você joga o que eles buscaram | entra |
| Orcish Bowmasters | 0·0·2·0·0·0·1·0 | A | ALT | Ping ao entrar e quando oponente compra além da primeira | Pune Dark Deal e Peer; mata criaturas de 1 | entra |
| Sheoldred, the Apocalypse | 0·0·0·0·0·0·3·0 | S | INS | Você ganha 2 por compra sua; oponente perde 2 por compra dele | Dark Deal vira dano; com Peer into the Abyss mata um jogador | entra |
| Emeritus of Woe | 0·1·0·0·0·0·0·0 | A | ALT | Entra preparada com cópia de Demonic Tutor; reprepara com duas mortes no turno | Um tutor que deixa corpo para Grave Pact e Tower | entra |

### Criatura // Terreno (1)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Aclazotz, Deepest Betrayal | 0·0·0·0·2·0·2·1 | C | BAX | Voa, vínculo; ataque: oponentes descartam; morre e vira terreno | Volta como terreno; o descarte é à escolha deles | fica |

### Planeswalker (2)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Liliana of the Veil | 0·0·1·0·3·2·0·0 | S | INS | +1 todos descartam; −2 edito | Motor de 3 manas que também protege a si mesma | fica |
| Liliana, Waker of the Dead | 0·0·1·0·3·0·0·1 | A | ALT | +1 todos descartam, quem não pode perde 3; −3 −X/−X | Pune mão vazia, que é o estado que o deck cria | entra |

### Mágica instantânea (11)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Flare of Malice | 0·0·2·0·0·3·0·0 | A | ALT | Cada oponente sacrifica o maior; pode custar uma criatura preta | Soul Shatter de graça | entra |
| Sheoldred's Edict | 0·0·2·0·0·3·0·0 | A | INS | Modo: oponentes sacrificam criatura não-ficha | O modo não-ficha garante a Tergrid | fica |
| Soul Shatter | 0·0·2·0·0·3·0·0 | A | ALT | Cada oponente sacrifica a criatura ou PW de maior MV | Maior MV costuma ser não-ficha e a melhor carta da mesa | fica |
| Imp's Mischief | 0·0·1·2·0·0·0·0 | B | MÉD | Muda o alvo de mágica de alvo único | Devolve a remoção contra quem a conjurou | fica |
| Not Dead After All | 0·0·0·2·0·0·0·1 | B | MÉD | Se a criatura morrer, volta virada | Salva a Tergrid de destruição por uma mana | fica |
| Cabal Ritual | 2·0·0·0·0·0·0·0 | B | MÉD | {B}{B}{B}; cinco com threshold | Segundo ritual; com o cemitério cheio de descartes, chega a cinco | entra |
| Dark Ritual | 2·0·0·0·0·0·0·0 | A | ALT | {B}{B}{B} | Tergrid ou Pit um turno antes | fica |
| Deadly Rollick | 0·0·2·0·0·0·0·0 | A | ALT | Grátis com o comandante em campo: exila criatura | Resposta de graça enquanto a Tergrid está viva | entra |
| Dismember | 0·0·2·0·0·0·0·0 | B | MÉD | −5/−5, paga com vida | Uma mana em resposta | fica |
| Fatal Push | 0·0·2·0·0·0·0·0 | C | BAX | Destrói criatura de MV 2 (4 com revolta) | Barata; mata as peças rápidas | fica |
| Vampiric Tutor | 0·1·0·0·0·0·0·0 | A | ALT | Busca para o topo, perde 2 | Tutor de uma mana | entra |

### Feitiço (17)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Death Cloud | 0·0·2·0·3·3·1·0 | S | ALT | Cada jogador perde X, descarta X, sacrifica X criaturas e X terrenos | Com a Tergrid em campo, reconstrói a mesa com o que era deles | fica |
| Pox Plague | 0·0·2·0·3·3·1·0 | S | ALT | Todos perdem metade da vida, mão e permanentes | Metade de tudo de três oponentes vira seu; eles escolhem a metade, mas metade é metade | entra |
| Torment of Hailfire | 0·0·1·0·2·2·3·0 | S | INS | X vezes: perde 3, a menos que sacrifique não-terreno ou descarte | Com Coffers é o fechamento; cada escolha deles alimenta a Tergrid | fica |
| Peer into the Abyss | 0·2·0·0·0·0·3·0 | B | MÉD | Alvo compra metade do grimório e perde metade da vida | Com Sheoldred, the Apocalypse, mata o alvo | entra |
| Smallpox | 0·0·1·0·2·2·0·0 | A | ALT | Cada jogador perde 1, descarta, sacrifica criatura e terreno | Terreno sacrificado é permanente: a Tergrid rouba terreno | fica |
| Syphon Mind | 0·3·0·0·2·0·0·0 | A | ALT | Cada outro jogador descarta; você compra por descarte | Três descartes e três compras; descarte à escolha deles | fica |
| Dark Deal | 0·1·0·0·3·0·0·0 | A | ALT | Todos descartam a mão e compram uma a menos | A mão inteira de todos; com Sheoldred, the Apocalypse cada compra deles custa 2 | fica |
| Exhume | 0·0·0·0·0·0·0·3 | B | MÉD | Cada jogador reanima uma criatura do próprio cemitério | Archon ou Sheoldred no turno 2; os oponentes também reanimam | fica |
| Hymn to Tourach | 0·0·0·0·3·0·0·0 | A | ALT | Alvo descarta duas aleatórias | Turno 1 ou 2, antes de a mão deles virar mesa | entra |
| Mind Twist | 0·0·0·0·3·0·0·0 | A | ALT | Alvo descarta X aleatórias | Com Coffers, a mão inteira de um | entra |
| Reanimate | 0·0·0·0·0·0·0·3 | A | ALT | Reanima de qualquer cemitério, perde vida pelo MV | Archon no turno 2 | entra |
| Thoughtseize | 0·0·1·0·2·0·0·0 | B | MÉD | Você vê a mão e escolhe um não-terreno; perde 2 | Você escolhe a melhor permanente da mão e ela vem com a Tergrid | entra |
| Toxic Deluge | 0·0·3·0·0·0·0·0 | S | INS | Paga X de vida: −X/−X | Limpeza que escolhe o tamanho e poupa a Tergrid 4/5 | entra |
| Feed the Swarm | 0·0·2·0·0·0·0·0 | B | MÉD | Destrói criatura ou encantamento de oponente | Uma das poucas respostas a encantamento em mono-B | fica |
| Demonic Tutor | 0·1·0·0·0·0·0·0 | S | INS | Busca qualquer carta | Acha a peça que falta | entra |
| Grim Tutor | 0·1·0·0·0·0·0·0 | B | MÉD | Busca para a mão, perde 3 | Quinto tutor | entra |
| Imperial Seal | 0·1·0·0·0·0·0·0 | A | ALT | Busca para o topo, perde 2 | Tutor de uma mana | entra |

### Feitiço // Terreno (1)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Pelakka Predation | −1·0·0·0·2·0·0·0 | A | ALT | Oponente descarta uma carta de MV 3+ que você vê; verso terreno virado | Escolha sua: sempre uma permanente. Conta como fonte de terreno | fica |

### Encantamento (7)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| The Eldest Reborn | 0·0·1·0·2·2·0·2 | C | BAX | I edito, II descarte, III reanima de qualquer cemitério | Três capítulos que a Tergrid lê; lenta | fica |
| Grave Pact | 0·0·1·0·0·3·1·0 | A | ALT | Criatura sua morre: cada outro jogador sacrifica criatura | Vale para criatura roubada que morre | entra |
| Waste Not | 1·2·0·0·1·0·1·0 | S | INS | Descarte de oponente: Zumbi, {B}{B} ou compra | Paga cada descarte duas vezes junto com a Tergrid | fica |
| Animate Dead | 0·0·0·0·0·0·0·3 | A | ALT | Reanima criatura de qualquer cemitério | Seu Archon ou a melhor criatura que eles descartaram | entra |
| Bottomless Pit | 0·0·0·0·3·0·0·0 | S | INS | Cada jogador descarta uma aleatória na própria manutenção | Três descartes aleatórios por volta: o motor mais eficiente do deck | fica |
| Necrogen Mists | 0·0·0·0·3·0·0·0 | A | INS | Cada jogador descarta uma na própria manutenção | Segundo Pit; descarte à escolha deles, mas três por volta | entra |
| Necropotence | 0·3·0·0·0·0·0·0 | S | INS | Pula a compra; paga vida por carta | Repõe a mão que Pit e Mists cobram de você | entra |

### Artefato (12)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Bolas's Citadel | 0·3·0·0·0·1·3·0 | S | INS | Joga do topo pagando vida; sacrifica dez permanentes: oponentes perdem 10 | O roubo vira munição: dez permanentes, metade deles dos outros | entra |
| Smokestack | 0·0·0·0·0·3·2·0 | S | INS | Cada jogador sacrifica um permanente por marcador na manutenção | O lock: a mesa deles diminui e vem para a sua | entra |
| The One Ring | 0·3·0·2·0·0·0·0 | A | ALT | Proteção por um turno, compra crescente | Compra e um turno de imunidade | entra |
| Geth's Grimoire | 0·3·0·0·0·0·0·0 | A | ALT | Oponente descarta: você pode comprar | Com Pit, Mists e Dark Deal compra três por volta | fica |
| Grim Monolith | 3·0·0·0·0·0·0·0 | A | ALT | {C}{C}{C}, não desvira sozinho; {4} desvira | Segundo Mana Vault | entra |
| Mana Vault | 3·0·0·0·0·0·0·0 | S | INS | {C}{C}{C}, não desvira sozinho | Tergrid no turno 2 com terreno | entra |
| Sol Ring | 3·0·0·0·0·0·0·0 | S | INS | {C}{C} | Tergrid no turno 3 | fica |
| Arcane Signet | 2·0·0·0·0·0·0·0 | B | MÉD | Um mana da identidade | Pedra de 2 que dá {B} | fica |
| Chrome Mox | 2·0·0·0·0·0·0·0 | A | ALT | Imprime carta não-terreno; mana da cor dela | Mana de graça; troca uma carta por um turno | entra |
| Jet Medallion | 2·0·0·0·0·0·0·0 | A | ALT | Mágicas pretas custam {1} a menos | A Tergrid é preta: conta como ramp para ela e para quase todo o deck | fica |
| Mox Diamond | 2·0·0·0·0·0·0·0 | A | ALT | Descarta terreno ao entrar; mana de qualquer cor | Mana de graça; o terreno descartado é seu, não aciona a Tergrid | entra |
| Lotus Petal | 1·0·0·0·0·0·0·0 | B | MÉD | Sacrifica: um mana | Uma vez, de graça | entra |

### Equipamento (3)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Sword of Feast and Famine | 1·0·0·1·2·0·1·0 | C | BAX | +2/+2, proteção contra preto e verde; dano: descarte e desvira terrenos | Com Tergrid ameaçadora, descarte por volta | fica |
| Lightning Greaves | 0·0·0·3·0·0·0·0 | A | INS | Ímpeto e cobertura, equipar 0 | Proteção da Tergrid no turno em que entra | fica |
| Swiftfoot Boots | 0·0·0·3·0·0·0·0 | A | INS | Resistência a magia e ímpeto | Segunda cobertura | fica |

### Terreno (32)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui | Status |
|---|---|---|---|---|---|---|
| Cabal Coffers | 3·0·0·0·0·0·1·0 | A | INS | {2},{T}: {B} por Pântano | Com 20 Pântanos e Urborg, paga Torment, Peer e o Marit Lage no mesmo turno | entra |
| Dark Depths | 0·0·0·0·0·0·3·0 | A | ALT | Sem marcadores, vira Marit Lage 20/20 voadora indestrutível | Com Thespian's Stage é um fechamento de duas cartas que mata em uma volta. Vesuva não faz o combo: a cópia entra com os dez marcadores | fica |
| Geier Reach Sanitarium | 0·1·0·0·2·0·0·0 | A | ALT | {2},{T}: todos compram e descartam | Descarte em todos na velocidade de instantânea; alimenta Waste Not e Geth's Grimoire | fica |
| Phyrexian Tower | 2·0·0·0·0·1·0·0 | A | ALT | Sacrifica criatura: {B}{B} | Sacrifica Mindslicer ou Accursed Marauder em resposta; criatura roubada vira mana | entra |
| Thespian's Stage | 0·0·0·0·0·0·3·0 | A | ALT | {2},{T}: vira cópia de um terreno | A metade do Marit Lage. Fora do combo copia Coffers | fica |
| Ancient Tomb | 2·0·0·0·0·0·0·0 | A | ALT | {C}{C} e 2 de dano | Tergrid no turno 3 sem pedra | entra |
| Cabal Stronghold | 1·0·0·0·0·0·1·0 | B | MÉD | {3},{T}: {B} por Pântano básico | Paga o X do Torment no fim; fica atrás da Coffers | fica |
| Castle Locthwain | 0·2·0·0·0·0·0·0 | B | MÉD | {B}; {1}{B}{B}: compra e perde vida pela mão | Compra num terreno que entra desvirado com Pântano em campo | entra |
| Tyrite Sanctum | 0·0·0·2·0·0·0·0 | B | ALT | Torna lendária um Deus; sacrificando, marcador de indestrutível num Deus | A Tergrid é Deus: proteção contra destruição dentro de um slot de terreno | fica |
| Urborg, Tomb of Yawgmoth | 1·0·0·0·0·0·0·0 | A | ALT | Todo terreno é Pântano | Os incolores passam a dar {B} e contam para a Coffers; o Obliterator fica pagável | entra |
| Swamp ×21 | 0·0·0·0·0·0·0·0 | B | ALT | Gera {B} | Conta para Cabal Coffers, Cabal Stronghold e Crypt Ghast | entra |
| Vesuva | 0·0·0·0·0·0·0·0 | C | BAX | Entra virado como cópia de um terreno | Segunda Coffers na lista nova. Não monta o Marit Lage | fica |

### 3.2 As 40 que saem, com a nota na mesma régua

| Carta | Tipo | Notas | Tier | Relev. | Por que sai |
|---|---|---|---|---|---|
| Blighted Fen | Terreno | 0·0·1·0·0·1·0·0 | C | BAX | Edito à escolha dele, cinco manas e um terreno a menos |
| Bloodghast | Criatura | 0·0·0·0·0·0·1·2 | C | BAX | Combustível para sacrifício, nada mais |
| Bojuka Bog | Terreno | −1·0·0·0·0·0·0·0 | C | BAX | Exilar cemitério corta a própria reanimação. Contra reanimador inimigo, Tergrid pega primeiro |
| Buried Ruin | Terreno | 0·0·0·0·0·0·0·1 | C | BAX | Poucos artefatos que valha devolver |
| Clackbridge Troll | Criatura | 0·1·0·0·0·1·1·0 | D | BAX | Cabra é ficha: a Tergrid não pega o que eles sacrificam |
| Commander's Plate | Equipamento | 0·0·0·2·0·0·1·0 | B | MÉD | Equipar 3; Greaves e Boots chegam antes |
| Curse of the Cabal | Feitiço | 0·0·1·0·0·2·0·0 | D | BAX | Dez manas, ou três voltas de espera |
| Encroaching Wastes | Terreno | 0·0·1·0·0·0·0·0 | D | BAX | Destruir não é sacrificar: a Tergrid não pega |
| Erebos, God of the Dead | Criatura | 0·2·0·1·0·0·0·0 | C | MÉD | Compra lenta; Necropotence e One Ring fazem mais |
| Fake Your Own Death | Mágica instantânea | 0·0·0·2·0·0·0·1 | C | MÉD | Duplica Not Dead After All |
| Feign Death | Mágica instantânea | 0·0·0·2·0·0·0·1 | C | BAX | Terceira cópia do mesmo efeito |
| Fraying Omnipotence | Feitiço | 0·0·1·0·2·2·1·0 | B | MÉD | Simétrica; Pox Plague pega todas as permanentes |
| Henrika Domnathi | Criatura | 0·1·0·0·0·2·0·0 | C | BAX | O sacrifício pega você também |
| Hypnotic Specter | Criatura | 0·0·0·0·2·0·0·0 | C | BAX | Precisa conectar com 2/2 voador |
| Library of Leng | Artefato | 0·0·0·1·0·0·0·0 | C | BAX | Necropotence protege a mão melhor; texto com ressalva |
| Liliana Vess | Planeswalker | 0·1·0·0·2·0·0·1 | C | MÉD | Cinco manas por um descarte por turno |
| Liliana of the Dark Realms | Planeswalker | 1·0·1·0·0·0·0·0 | D | BAX | Não força ninguém a nada |
| Liliana's Reaver | Criatura | 0·0·0·0·2·0·0·0 | C | BAX | Precisa conectar; o Zumbi é ficha |
| Liliana's Triumph | Mágica instantânea | 0·0·1·0·1·2·0·0 | C | BAX | À escolha deles: entrega ficha |
| Liliana, Heretical Healer | Criatura // Planeswalker | 0·0·0·0·1·0·0·1 | D | BAX | Gatilho difícil de forçar aqui |
| Living Death | Feitiço | 0·0·2·0·0·1·1·3 | B | MÉD | Desfaz a mesa que a Tergrid roubou: as roubadas são sacrificadas por você |
| Mikokoro, Center of the Sea | Terreno | 0·1·0·0·0·0·0·0 | C | BAX | Dá carta aos três oponentes por uma sua |
| Mind Stone | Artefato | 1·1·0·0·0·0·0·0 | C | BAX | Pedra lenta num deck que quer o turno 3 |
| Mire in Misery | Feitiço | 0·0·1·0·0·2·0·0 | C | BAX | À escolha deles |
| Mutilate | Feitiço | 0·0·3·0·0·0·0·0 | B | MÉD | Destrói, não sacrifica: a Tergrid não pega. Deluge faz o mesmo e mais barato |
| Oppression | Encantamento | 0·0·0·0·3·0·0·0 | B | MÉD | Simétrico e pesa mais em você, que conjura muito |
| Phyrexian Arena | Encantamento | 0·2·0·0·0·0·0·0 | C | BAX | Necropotence e One Ring fazem o mesmo papel com muito mais carta |
| Rankle's Prank | Feitiço | 0·0·1·0·2·2·1·0 | B | MÉD | Bom; Pox Plague faz mais pela mesma vaga |
| Rush of Dread | Feitiço | 0·0·1·0·2·2·1·0 | B | MÉD | Um oponente só |
| Scheming Symmetry | Feitiço | 0·1·0·0·0·0·0·0 | D | BAX | Dá um tutor a um oponente |
| Stinging Study | Mágica instantânea | 0·3·0·0·0·0·0·0 | C | BAX | Cinco cartas por cinco manas no turno dos outros; caro para a curva nova |
| Supernatural Stamina | Mágica instantânea | 0·0·0·2·0·0·0·1 | C | BAX | Quarta cópia |
| Tainted Aether | Encantamento | 0·0·0·0·0·2·0·0 | C | BAX | Cobra cada roubo da Tergrid: as criaturas que ela traz entram sob você |
| The Long Reach of Night | Encantamento | 0·0·0·0·1·2·1·0 | C | MÉD | Escolha do oponente nos dois capítulos |
| Thran Dynamo | Artefato | 2·0·0·0·0·0·0·0 | C | BAX | Pedra de 4: chega junto com a Tergrid, não antes |
| Vindictive Lich | Criatura | 0·0·1·0·2·1·0·0 | C | BAX | Precisa morrer; Mindslicer faz mais pela mesma morte |
| Vona's Hunger | Mágica instantânea | 0·0·1·0·0·2·0·0 | B | MÉD | Bom, mas Flare e Soul Shatter fazem melhor |
| Vorpal Sword | Equipamento | 0·0·0·0·0·0·2·0 | C | BAX | Oito manas e combate; Marit Lage e Torment fecham antes |
| Westvale Abbey | Terreno | 0·0·0·0·0·0·2·0 | C | BAX | Fechamento lento e incolor; Smokestack e Braids usam fichas melhor |
| Withering Torment | Mágica instantânea | 0·0·2·0·0·0·0·0 | C | BAX | Duplica o Feed the Swarm |

---

## 4. Diagnóstico

### 4.1 Antes e depois, por script

| Item | Atual | Nova | Faixa |
|---|---|---|---|
| Cartas de terreno | 33 | 32 | — |
| Fontes de terreno (com Pelakka, sem Dark Depths) | 33 | 32 | 35 a 37 |
| Terrenos que não dão {B} sem Urborg | 9 | 5 | — |
| Ramp dedicado | 6 | 13 | 10 a 12 |
| Compra dedicada (tutor conta 1, fica fora) | 7 | 9 | 10 a 12 |
| Remoção dedicada | 10 | 13 | 8 a 12 |
| Remoção em massa por destruição (nota 3) | 1 | 1 | 3 a 5 |
| Proteção dedicada | 9 | 6 | — |
| Descarte dedicado | 23 | 22 | — |
| Sacrifício dedicado | 22 | 19 | — |
| Fechamento dedicado | 10 | 12 | — |
| Recursão dedicada | 6 | 6 | — |
| Motores recorrentes (com a Tergrid) | 6 | 10 | — |
| Forçadores que pegam sem escolha deles | 10 | 13 | — |
| Forçadores em que o oponente escolhe | 22 | 16 | — |
| Criaturas fora a comandante | 14 | 14 | — |
| Game Changers | 1 | 15 | — |
| CMC médio das não-terreno | 3.17 | 2.91 | — |
| Placar (CMC + aceleração + notas) | 326 (3+50+273) | 383 (4+90+289) | — |

**Onde a lista se afasta das faixas de propósito**

- **32 fontes de terreno**, abaixo dos 35 a 37. Em troca, são 11 aceleradores de duas manas ou menos, contando Ancient Tomb, contra 5 hoje. A chance de ter pelo menos um na mão inicial vai de 31% para 57%. É a base de deck de alta potência. Mox Diamond pede um terreno na mão, e o teste das dez mãos vai dizer se 32 basta.
- **Ramp dedicado em 13**, acima da faixa. Também é de propósito: a conta do deck depende do turno em que a Tergrid entra.
- **Uma limpeza por destruição, a Toxic Deluge.** Destruir não aciona a Tergrid. O papel de limpeza fica com Pox Plague, Death Cloud, Archfiend e Smokestack, que limpam por sacrifício e trazem o que limparam.
- **Proteção caiu de 9 para 6.** Saíram três cópias do mesmo efeito "volta virada" e a Commander's Plate. Entrou a One Ring. A proteção nova é velocidade mais resiliência: o roubo é permanente, e a Lantern segura o plano.

### 4.2 Gerar e converter

| Deck | Gera | Converte |
|---|---|---|
| Tergrid atual | 32 forçadores, 22 deles à escolha do oponente | 5 motores fora a comandante; a Tergrid em mediana no turno 6 |
| Tergrid nova | 29 forçadores, 16 à escolha do oponente | 9 motores; a Tergrid em mediana no turno 5; tutores para achar o motor |

Hoje sobra geração e falta conversão: o deck força eventos, mas eles caem em ficha ou em mágica, e a Tergrid chega tarde para colher. A lista nova corta pouco na quantidade de forçadores, de 32 para 29, e aumenta o que cada evento rende: os forçadores sem escolha deles vão de 10 para 13 e os motores, de 5 para 9.

### 4.3 Probabilidades

Hipótese: 99 cartas, mão de sete, jogando primeiro, uma compra por turno, sem mulligan.

| Medida | Atual | Nova |
|---|---|---|
| Pelo menos um acelerador de até duas manas na mão inicial | 31% | 57% |
| Motor recorrente visto até o turno 4 (dez cartas) | 42% | 63% |
| Motor ou tutor até o turno 4 | n/d | 80% |
| Tergrid em campo até o turno 2 (simulação) | 2% | 12% |
| até o turno 3 | 10% | 28% |
| até o turno 4 | 22% | 44% |
| até o turno 5 | 46% | 62% |
| Turno mediano da Tergrid | 6 | 5 |

A simulação tem 40 mil jogos por lista e é deliberadamente simples. Ignora cor de mana e não usa tutor para buscar mana. Os rituais e as pedras de uso único só valem no turno em que a Tergrid sai, e Coffers e Stronghold contam como um mana. Na prática, as duas listas saem um pouco mais cedo. A comparação entre elas é o que vale.

### 4.4 Concentração no comandante

Hoje, sem a Tergrid, o deck vira uma pilha de descartes simétricos que machucam você também. Na lista nova, o plano sobrevive sem ela. Smokestack, Braids e Archfiend travam a mesa sozinhos, e os seis fechamentos não dependem dela. O que ela roubou fica, porque o texto não dá prazo. A Lantern segura o descarte e o sacrifício quando a Tergrid está cara demais para recomprar.

### 4.5 Anti-sinergias pelo nome

- **Pit e Necrogen Mists cobram de você.** A resposta é Necropotence e One Ring para repor a mão, e reanimação para o que você descarta: descartar o Archon é armar o Reanimate.
- **Smokestack e Braids cobram de você.** A resposta é sacrificar o que você roubou. Mantenha sempre um permanente roubado ou uma pedra gasta para pagar.
- **Pox Plague e Death Cloud em você.** Você escolhe a sua metade: guarde a Tergrid e o motor.
- **Exhume** devolve uma criatura a cada oponente também. Use quando o seu cemitério tiver o Archon e o deles estiver vazio, depois de um Dark Deal.
- **Accursed Marauder com só a Tergrid na mesa.** Você precisa sacrificar uma criatura não-ficha. O próprio Marauder serve, porque já está em campo quando o gatilho resolve.

### 4.6 Poder e bracket

São 15 Game Changers na lista nova, contra 1 hoje (só a própria Tergrid). Isso põe a lista no **bracket 4**. Não há combo de duas cartas cedo com Tergrid para chamá-la de cEDH: o único combo com a Tergrid no Commander Spellbook usa Ley Weaver, que é verde. A lista oficial conferida é a de 09/02/2026, com 53 cartas. A atualização de 12/10/2026 citada no Handover Mestre **não foi confirmada** por nenhuma fonte.

### 4.7 Distribuição

- Tier atual: S 8, A 17, B 17, C 31, D 6. Tier nova: S 18, A 40, B 16, C 5, D 0.
- Relevância atual: INS 10, ALT 16, MÉD 20, BAX 33. Relevância nova: INS 21, ALT 38, MÉD 15, BAX 5.

Swamp não entra na contagem. A lista nova tem poucos BAX porque é uma reconstrução: o BAX dela é a fila da próxima rodada.

### 4.8 Placar

O placar atual é **326 (3+50+273)** e o da lista nova é **383 (4+90+289)**. A aceleração bate no teto de 90 na lista nova.

---

## 5. Combos e linhas

**Combos de verdade**

1. **Dark Depths + Thespian's Stage.** Os dois textos foram conferidos. A Stage vira cópia de Dark Depths, sem marcadores, e o gatilho cria Marit Lage, 20/20 voadora e indestrutível. Pela regra de lenda, mantenha a Stage e mande a original ao cemitério. Custa {2} mais o {2} da Stage. **Vesuva não faz o combo**: a cópia entra com os dez marcadores.
2. **Sheoldred, the Apocalypse + Peer into the Abyss** (listado no EDHREC). Os textos foram conferidos. Com um grimório de 60 cartas, o alvo compra 30 e perde 60 de vida pela Sheoldred, mais metade da vida pelo Peer. Morre.

**Motores**

- Tergrid com Pit ou Mists: três descartes por volta, e cada permanente descartada vem para você. Com Waste Not e Geth's Grimoire, cada descarte paga duas vezes.
- Smokestack ou Braids com o roubo: você sacrifica o que era deles, e eles sacrificam o que é deles, para você.
- Archfiend of Depravity: no fim do turno de cada oponente, tudo além de duas criaturas vira seu.
- Grave Pact com as criaturas roubadas: quando a criatura que era deles morre, outro edito sai.
- Mindslicer com Phyrexian Tower ou Accursed Marauder: a mão de três jogadores, sob a Tergrid.
- Sheoldred, the Apocalypse com Dark Deal: cada oponente perde 2 por carta que compra de volta.

**Fechamentos**

- Torment of Hailfire com Cabal Coffers. Cada escolha deles alimenta a Tergrid, e quem não escolhe perde 3.
- Bolas's Citadel: sacrifique dez permanentes, metade deles dos outros, e cada oponente perde 10.
- Marit Lage.
- Archon of Cruelty, reanimado no turno 2 ou 3.
- Phyrexian Obliterator: ninguém ataca nela nem a bloqueia.
- Rankle.

---

## 6. Cortes: as dez primeiras a sair da lista atual

| # | Carta | Tier | Motivo |
|---|---|---|---|
| 1 | Tainted Aether | C | Cobra cada roubo da Tergrid: as criaturas que ela traz entram sob você |
| 2 | Living Death | B | Desfaz a mesa que a Tergrid roubou: as roubadas são sacrificadas por você |
| 3 | Clackbridge Troll | D | Cabra é ficha: a Tergrid não pega o que eles sacrificam |
| 4 | Scheming Symmetry | D | Dá um tutor a um oponente |
| 5 | Encroaching Wastes | D | Destruir não é sacrificar: a Tergrid não pega |
| 6 | Curse of the Cabal | D | Dez manas, ou três voltas de espera |
| 7 | Oppression | B | Simétrico e pesa mais em você, que conjura muito |
| 8 | Liliana of the Dark Realms | D | Não força ninguém a nada |
| 9 | Liliana, Heretical Healer | D | Gatilho difícil de forçar aqui |
| 10 | Vorpal Sword | C | Oito manas e combate; Marit Lage e Torment fecham antes |

As outras 30 que saem na reconstrução:

| Carta | Tier e relevância | Motivo |
|---|---|---|
| Blighted Fen | C · BAX | Edito à escolha dele, cinco manas e um terreno a menos |
| Bloodghast | C · BAX | Combustível para sacrifício, nada mais |
| Bojuka Bog | C · BAX | Exilar cemitério corta a própria reanimação. Contra reanimador inimigo, Tergrid pega primeiro |
| Buried Ruin | C · BAX | Poucos artefatos que valha devolver |
| Commander's Plate | B · MÉD | Equipar 3; Greaves e Boots chegam antes |
| Erebos, God of the Dead | C · MÉD | Compra lenta; Necropotence e One Ring fazem mais |
| Fake Your Own Death | C · MÉD | Duplica Not Dead After All |
| Feign Death | C · BAX | Terceira cópia do mesmo efeito |
| Fraying Omnipotence | B · MÉD | Simétrica; Pox Plague pega todas as permanentes |
| Henrika Domnathi | C · BAX | O sacrifício pega você também |
| Hypnotic Specter | C · BAX | Precisa conectar com 2/2 voador |
| Library of Leng | C · BAX | Necropotence protege a mão melhor; texto com ressalva |
| Liliana Vess | C · MÉD | Cinco manas por um descarte por turno |
| Liliana's Reaver | C · BAX | Precisa conectar; o Zumbi é ficha |
| Liliana's Triumph | C · BAX | À escolha deles: entrega ficha |
| Mikokoro, Center of the Sea | C · BAX | Dá carta aos três oponentes por uma sua |
| Mind Stone | C · BAX | Pedra lenta num deck que quer o turno 3 |
| Mire in Misery | C · BAX | À escolha deles |
| Mutilate | B · MÉD | Destrói, não sacrifica: a Tergrid não pega. Deluge faz o mesmo e mais barato |
| Phyrexian Arena | C · BAX | Necropotence e One Ring fazem o mesmo papel com muito mais carta |
| Rankle's Prank | B · MÉD | Bom; Pox Plague faz mais pela mesma vaga |
| Rush of Dread | B · MÉD | Um oponente só |
| Stinging Study | C · BAX | Cinco cartas por cinco manas no turno dos outros; caro para a curva nova |
| Supernatural Stamina | C · BAX | Quarta cópia |
| The Long Reach of Night | C · MÉD | Escolha do oponente nos dois capítulos |
| Thran Dynamo | C · BAX | Pedra de 4: chega junto com a Tergrid, não antes |
| Vindictive Lich | C · BAX | Precisa morrer; Mindslicer faz mais pela mesma morte |
| Vona's Hunger | B · MÉD | Bom, mas Flare e Soul Shatter fazem melhor |
| Westvale Abbey | C · BAX | Fechamento lento e incolor; Smokestack e Braids usam fichas melhor |
| Withering Torment | C · BAX | Duplica o Feed the Swarm |

---

## 7. Entradas: a reconstrução

**A ideia da lista nova:** a Tergrid no turno 3 ou 4, o lock simétrico logo depois, e você paga a sua parte com o que roubou.

### 7.1 O que a varredura encontrou

- **Mecânica central.** Os forçadores que valem são os que o oponente não escolhe: Accursed Marauder (não-ficha por duas manas), Flare of Malice e Soul Shatter (o maior), Mind Twist e Hymn (aleatório), Archfiend (fica com duas).
- **Coleções recentes.** Pox Plague (Secrets of Strixhaven, 2026) é a melhor carta nova: metade de tudo de cada jogador. Emeritus of Woe (2026) é um Demonic Tutor com corpo. Zodiark (2025) e Junji (2025) ficaram no banco. Garruk, Veiled Butcher (2026) **exila**, então não serve para a Tergrid. As coleções Marvel's Spider-Man e Tarkir Dragonstorm não trouxeram nada útil.
- **Pagadores laterais.** Phyrexian Tower e Smokestack transformam o que você roubou em mana ou em pagamento. Bolas's Citadel faz o mesmo para o fechamento. Opposition Agent rouba a busca deles.

### 7.2 As 40 trocas

| Sai | Entra | Função | MV | Notas | Por que |
|---|---|---|---|---|---|
| Encroaching Wastes | Cabal Coffers | Mana grande | 0 | 3·0·0·0·0·0·1·0 | Com 20 Pântanos e Urborg, paga Torment, Peer e o Marit Lage no mesmo turno |
| Mikokoro, Center of the Sea | Urborg, Tomb of Yawgmoth | Conserta a base | 0 | 1·0·0·0·0·0·0·0 | Os incolores passam a dar {B} e contam para a Coffers; o Obliterator fica pagável |
| Buried Ruin | Ancient Tomb | Aceleração | 0 | 2·0·0·0·0·0·0·0 | Tergrid no turno 3 sem pedra |
| Blighted Fen | Phyrexian Tower | Aceleração e sacrifício | 0 | 2·0·0·0·0·1·0·0 | Sacrifica Mindslicer ou Accursed Marauder em resposta; criatura roubada vira mana |
| Westvale Abbey | Castle Locthwain | Compra em terreno | 0 | 0·2·0·0·0·0·0·0 | Compra num terreno que entra desvirado com Pântano em campo |
| Thran Dynamo | Mana Vault | Aceleração | 1 | 3·0·0·0·0·0·0·0 | Tergrid no turno 2 com terreno |
| Mind Stone | Grim Monolith | Aceleração | 2 | 3·0·0·0·0·0·0·0 | Segundo Mana Vault |
| Liliana of the Dark Realms | Chrome Mox | Aceleração | 0 | 2·0·0·0·0·0·0·0 | Mana de graça; troca uma carta por um turno |
| Bojuka Bog | Mox Diamond | Aceleração | 0 | 2·0·0·0·0·0·0·0 | Mana de graça; o terreno descartado é seu, não aciona a Tergrid |
| Library of Leng | Lotus Petal | Aceleração | 0 | 1·0·0·0·0·0·0·0 | Uma vez, de graça |
| Supernatural Stamina | Cabal Ritual | Aceleração | 2 | 2·0·0·0·0·0·0·0 | Segundo ritual; com o cemitério cheio de descartes, chega a cinco |
| Phyrexian Arena | Necropotence | Compra | 3 | 0·3·0·0·0·0·0·0 | Repõe a mão que Pit e Mists cobram de você |
| Commander's Plate | The One Ring | Compra e proteção | 4 | 0·3·0·2·0·0·0·0 | Compra e um turno de imunidade |
| Stinging Study | Bolas's Citadel | Compra e fechamento | 6 | 0·3·0·0·0·1·3·0 | O roubo vira munição: dez permanentes, metade deles dos outros |
| Scheming Symmetry | Demonic Tutor | Tutor | 2 | 0·1·0·0·0·0·0·0 | Acha a peça que falta |
| Feign Death | Vampiric Tutor | Tutor | 1 | 0·1·0·0·0·0·0·0 | Tutor de uma mana |
| Fake Your Own Death | Imperial Seal | Tutor | 1 | 0·1·0·0·0·0·0·0 | Tutor de uma mana |
| Liliana Vess | Grim Tutor | Tutor | 3 | 0·1·0·0·0·0·0·0 | Quinto tutor |
| Henrika Domnathi | Emeritus of Woe | Tutor com corpo | 4 | 0·1·0·0·0·0·0·0 | Um tutor que deixa corpo para Grave Pact e Tower |
| Oppression | Necrogen Mists | Motor de descarte | 3 | 0·0·0·0·3·0·0·0 | Segundo Pit; descarte à escolha deles, mas três por volta |
| Liliana, Heretical Healer | Liliana, Waker of the Dead | Motor de descarte | 4 | 0·0·1·0·3·0·0·1 | Pune mão vazia, que é o estado que o deck cria |
| Hypnotic Specter | Hymn to Tourach | Descarte aleatório cedo | 2 | 0·0·0·0·3·0·0·0 | Turno 1 ou 2, antes de a mão deles virar mesa |
| Liliana's Reaver | Mind Twist | Descarte aleatório em massa | 1 | 0·0·0·0·3·0·0·0 | Com Coffers, a mão inteira de um |
| Liliana's Triumph | Thoughtseize | Descarte que você escolhe | 1 | 0·0·1·0·2·0·0·0 | Você escolhe a melhor permanente da mão e ela vem com a Tergrid |
| Vindictive Lich | Mindslicer | Descarte da mão inteira | 4 | 0·0·0·0·3·0·0·0 | Com Tower ou Marauder, a mão de três oponentes sob a Tergrid |
| Vona's Hunger | Flare of Malice | Edito do maior, grátis | 4 | 0·0·2·0·0·3·0·0 | Soul Shatter de graça |
| Mire in Misery | Accursed Marauder | Edito não-ficha | 2 | 0·0·1·0·0·2·0·0 | Não-ficha por duas manas; você sacrifica o próprio Marauder |
| Tainted Aether | Archfiend of Depravity | Motor de sacrifício | 5 | 0·0·2·0·0·3·1·0 | Contra deck de mesa larga, pega tudo que não é ficha |
| The Long Reach of Night | Braids, Cabal Minion | Lock de sacrifício | 4 | 0·0·0·0·0·3·1·0 | Você sacrifica o que roubou; eles sacrificam o que é deles |
| Curse of the Cabal | Smokestack | Lock de sacrifício | 4 | 0·0·0·0·0·3·2·0 | O lock: a mesa deles diminui e vem para a sua |
| Rankle's Prank | Grave Pact | Motor de sacrifício | 4 | 0·0·1·0·0·3·1·0 | Vale para criatura roubada que morre |
| Fraying Omnipotence | Pox Plague | Sacrifício e descarte em massa | 5 | 0·0·2·0·3·3·1·0 | Metade de tudo de três oponentes vira seu; eles escolhem a metade, mas metade é metade |
| Mutilate | Toxic Deluge | Limpeza | 3 | 0·0·3·0·0·0·0·0 | Limpeza que escolhe o tamanho e poupa a Tergrid 4/5 |
| Withering Torment | Deadly Rollick | Remoção grátis | 4 | 0·0·2·0·0·0·0·0 | Resposta de graça enquanto a Tergrid está viva |
| Living Death | Animate Dead | Reanimação | 2 | 0·0·0·0·0·0·0·3 | Seu Archon ou a melhor criatura que eles descartaram |
| Rush of Dread | Reanimate | Reanimação | 1 | 0·0·0·0·0·0·0·3 | Archon no turno 2 |
| Bloodghast | Sheoldred, the Apocalypse | Fechamento | 4 | 0·0·0·0·0·0·3·0 | Dark Deal vira dano; com Peer into the Abyss mata um jogador |
| Vorpal Sword | Peer into the Abyss | Fechamento | 7 | 0·2·0·0·0·0·3·0 | Com Sheoldred, the Apocalypse, mata o alvo |
| Clackbridge Troll | Orcish Bowmasters | Remoção e punição de compra | 2 | 0·0·2·0·0·0·1·0 | Pune Dark Deal e Peer; mata criaturas de 1 |
| Erebos, God of the Dead | Opposition Agent | Interação e roubo de busca | 3 | 0·1·1·1·0·0·0·0 | Corta tutores e ramp de busca; você joga o que eles buscaram |

### 7.3 Como a lista nova ganha

1. A Tergrid chega antes: mediana no turno 5, contra 6, e 44% até o turno 4, contra 22%.
2. Mais eventos por volta: 9 motores contra 5, e 80% de ter motor ou tutor até o turno 4.
3. Cada evento rende mais: 13 forçadores sem escolha deles, contra 10.
4. Fechamento em duas cartas, ou numa só com Coffers: seis linhas, contra duas que fechavam de verdade.

### 7.4 Tudo o que foi considerado e ficou de fora

| Carta | Veredito | Motivo |
|---|---|---|
| Dauthi Voidwalker | Fora | Exila o que iria ao cemitério dos oponentes: desliga a Tergrid |
| Necrodominance | Fora | Exila tudo o que iria a qualquer cemitério: desliga a Tergrid |
| Garruk, Veiled Butcher (2026) | Fora | Exila em vez de matar |
| Strategic Betrayal | Fora | O oponente exila, não sacrifica |
| Tinybones, Bauble Burglar | Fora | Exila o descarte; só funciona ordenando a pilha a favor da Tergrid |
| Contamination | Fora | Lido o texto: não força sacrifício de oponente, é trava de mana |
| Myojin of Night's Reach | Fora | Oito manas, e o efeito depende do marcador que só vem se conjurada da mão |
| Plaguecrafter, Fleshbag Marauder, Merciless Executioner | Fora | O oponente entrega ficha; Accursed Marauder obriga não-ficha pelo mesmo preço |
| Burglar Rat, Elderfang Disciple, Virus Beetle | Fora | Um descarte à escolha deles: sai mágica, não permanente |
| Liliana's Caress, Megrim | Fora | Pagam dano, não roubo; Waste Not e Geth's pagam mais por descarte |
| The Raven Man, Tinybones, Trinket Thief, Tourach | Fora | Bons em descarte casual, lentos para o objetivo |
| Gix, K'rrik, Yawgmoth, Dark Confidant | Fora | Não conversam com o roubo |
| Fleshbag clones de 2026, Momentum Breaker, Susurian Dirgecraft | Fora | Edito único à escolha, ou caro |
| Ad Nauseam | Fora | Game Changer forte, mas a curva nova não tem alvo para o turno da explosão |
| Painful Quandary | Banco 1 | Forte em mesa que conjura muito; cinco manas e não rouba sozinho |
| Grief | Banco 2 | Você escolhe a carta não-terreno: rouba a melhor permanente da mão. Evocar custa uma carta preta |
| Dictate of Erebos | Banco 3 | Segundo Grave Pact, com lampejo |
| Pox | Banco 4 | Um terço de tudo por três manas; Pox Plague e Death Cloud já cobrem |
| Zodiark, Umbral God (2025) | Banco 5 | Metade das criaturas não-Deus de todos; a Tergrid é Deus e fica |
| Junji, the Midnight Sky (2025) | Banco 6 | Ao morrer: descarte e perda, ou reanima de qualquer cemitério |
| Ill-Gotten Gains | Banco 7 | Todos descartam a mão; os gatilhos da Tergrid resolvem antes da recuperação (leitura do subagente, não conferida) |
| Sheoldred // The True Scriptures | Banco 8 | Edito não-ficha mais saga que descarta três |
| Commander's Plate, Fake Your Own Death | Banco 9 e 10 | Proteção que volta se a mesa tiver muita remoção dirigida |
| Chains of Mephistopheles, Memory Jar, Nykthos | Sem veredito | Aparecem no cEDH da Tergrid; texto não conferido nesta rodada |

### 7.5 A nota e o teste

| | Nota | Leitura |
|---|---|---|
| Atual | 5,5 | Como bracket 3 é um bom deck. Contra o alvo "otimizado ao máximo", a Tergrid chega em mediana no turno 6 e a taxa de acerto é baixa |
| Projetada | 8,5 | Projeção, sem partida. Não passa disso por três motivos: a lista não tem combo compacto e determinístico de turno 3; as 32 fontes nunca foram testadas; o lock simétrico pune você quando está atrás |
| Testada | n/d | Só depois de embaralhar |

**Teste das dez mãos.** Jogue dez mãos sozinho até o turno 6, sem mulligan, e anote quatro números:

| Medida | Meta |
|---|---|
| Turno em que a Tergrid entra | Até o turno 4 em 5 das 10 mãos |
| Motor recorrente em campo no fim do turno 5 (Pit, Mists, Smokestack, Braids, Archfiend, as Lilianas, Sheoldred, Grave Pact) | Em 6 das 10 |
| Cartas na sua mão no começo do turno 6, com o seu Pit ou Mists em campo | 3 ou mais em 7 das 10 |
| Mãos com menos de duas fontes de mana até o turno 3 | No máximo 2 das 10 |

Se a primeira medida passar e a última falhar, a primeira troca é tirar Lotus Petal e colocar um Pântano.

---

## 8. Proposta de painel

- **Nomes:** Lanterna do Medo · Mãos Vazias · O Saque de Kaldheim. **Escolhido: Lanterna do Medo.** O verso da Tergrid é a lanterna, e o deck é o medo que esvazia a mão e a mesa.
- **Clima:** salão nórdico no inverno, à luz de uma lanterna só. Frio, ferro e geada, com um ponto de luz âmbar onde está o que foi roubado.
- **Paleta:** ardósia noturna `#1C1F24` · geada `#E6EBEF` · âmbar de lanterna `#D9A441` · ferro `#5B6670` · ferrugem `#7A2E22`. Nenhuma se repete das cinco paletas já usadas.
- **Moldura:** entrelaçado rúnico de Kaldheim em ferro, cantos com rebites.
- **Motivo gráfico:** cada permanente roubada acende uma runa âmbar na moldura; a mão do oponente aparece como cartas apagadas.

---

## 9. Dúvidas

**Fontes**

- Texto das 79 cartas não-básicas da lista atual: `json.edhrec.com/cards/<slug>`, todas lidas.
- Texto das 40 entradas: o mesmo, mais Grim Monolith e Peer into the Abyss, que conferi à parte.
- Busca por texto e coleções de 2025 e 2026: API do Archidekt.
- Presença e sinergia: edh.wiki (tema Discard) e EDHREC (páginas geral e cEDH).
- Game Changers: anúncio da WotC de 09/02/2026, conferido em scrollvault.net e commanderbrackets.com.

**Suposições**

- Nenhuma carta de estimação.
- A taxa de 60% de permanentes na mão é hipótese, sem fonte.
- A simulação de mana é simplificada (ver 4.3).

**Regras incertas**, com as quatro leituras separadas:

1. **Comandante sacrificado ou descartado.** Leitura minha: o dono move o comandante para a zona de comando como ação baseada em estado, antes de o gatilho da Tergrid resolver, e ela não acha a carta no cemitério. Não conferi na regra oficial (903.9a).
2. **A Tergrid sai junto com o sacrifício.** Isso acontece em Pox Plague ou Death Cloud em que você escolhe perdê-la. Leitura minha: o gatilho dela é de deixar o campo e olha para trás (603.10a), então dispara mesmo assim. Não conferido. Na dúvida, guarde a Tergrid.
3. **Ill-Gotten Gains.** O subagente afirma que a Tergrid resolve antes da recuperação. Isso não foi conferido, e a carta ficou no banco.
4. **Dark Depths com Thespian's Stage.** Leitura do texto e da regra de lenda. É o uso clássico, mas não abri a regra oficial.

**Ressalva sobre os eixos:** nenhuma. Ele aprovou a troca.

**Cinco avaliações discutíveis**

1. **Chrome Mox e Mox Diamond** num deck que sofre descarte simétrico. Cada um custa uma carta da mão. Defendo pela velocidade, mas é a troca de que tenho menos certeza.
2. **32 fontes de terreno.** Pode faltar terreno em mão de quatro mágicas. O teste das dez mãos decide.
3. **Crypt Ghast mantido** como MÉD, quando poderia ser Dictate of Erebos.
4. **A política sai do plano.** Se a mesa dele pune o vilão, Smokestack e Braids podem virar o deck contra você.
5. **Exhume como MÉD.** Devolve criatura aos três oponentes; em mesa de reanimação, é BAX.

---

## 10. Confronto

O guia que ele mandou foi a página do edh.wiki, tema Discard. Confrontei as afirmações contra o texto das cartas:

- **Waste Not, Smallpox, Geth's Grimoire e Dark Deal no topo da sinergia:** confere com o texto. Ficaram todas.
- **Mire in Misery e Liliana's Triumph com sinergia alta:** confere com a presença nas listas, mas não com a força. O oponente escolhe o que sacrificar, e saíram.
- **Withering Torment e Mutilate na lista dele:** o próprio site mostra sinergia negativa. Destruir não aciona a Tergrid, e saíram.
- **Plaguecrafter com 71% de inclusão:** presença não é força. Pega ficha, e ficou de fora.

---

## Anexo: lista completa nova (100)

**Comandante** (1)  
1 Tergrid, God of Fright

**Criatura** (13)  
1 Accursed Marauder  
1 Archfiend of Depravity  
1 Archon of Cruelty  
1 Braids, Cabal Minion  
1 Crypt Ghast  
1 Emeritus of Woe  
1 Mindslicer  
1 Opposition Agent  
1 Orcish Bowmasters  
1 Phyrexian Obliterator  
1 Rankle, Master of Pranks  
1 Sheoldred, Whispering One  
1 Sheoldred, the Apocalypse

**Criatura // Terreno** (1)  
1 Aclazotz, Deepest Betrayal

**Planeswalker** (2)  
1 Liliana of the Veil  
1 Liliana, Waker of the Dead

**Mágica instantânea** (11)  
1 Cabal Ritual  
1 Dark Ritual  
1 Deadly Rollick  
1 Dismember  
1 Fatal Push  
1 Flare of Malice  
1 Imp's Mischief  
1 Not Dead After All  
1 Sheoldred's Edict  
1 Soul Shatter  
1 Vampiric Tutor

**Feitiço** (17)  
1 Dark Deal  
1 Death Cloud  
1 Demonic Tutor  
1 Exhume  
1 Feed the Swarm  
1 Grim Tutor  
1 Hymn to Tourach  
1 Imperial Seal  
1 Mind Twist  
1 Peer into the Abyss  
1 Pox Plague  
1 Reanimate  
1 Smallpox  
1 Syphon Mind  
1 Thoughtseize  
1 Torment of Hailfire  
1 Toxic Deluge

**Feitiço // Terreno** (1)  
1 Pelakka Predation

**Encantamento** (7)  
1 Animate Dead  
1 Bottomless Pit  
1 Grave Pact  
1 Necrogen Mists  
1 Necropotence  
1 The Eldest Reborn  
1 Waste Not

**Artefato** (12)  
1 Arcane Signet  
1 Bolas's Citadel  
1 Chrome Mox  
1 Geth's Grimoire  
1 Grim Monolith  
1 Jet Medallion  
1 Lotus Petal  
1 Mana Vault  
1 Mox Diamond  
1 Smokestack  
1 Sol Ring  
1 The One Ring

**Equipamento** (3)  
1 Lightning Greaves  
1 Swiftfoot Boots  
1 Sword of Feast and Famine

**Terreno** (32)  
1 Ancient Tomb  
1 Cabal Coffers  
1 Cabal Stronghold  
1 Castle Locthwain  
1 Dark Depths  
1 Geier Reach Sanitarium  
1 Phyrexian Tower  
21 Swamp  
1 Thespian's Stage  
1 Tyrite Sanctum  
1 Urborg, Tomb of Yawgmoth  
1 Vesuva

