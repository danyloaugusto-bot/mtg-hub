# Handover: Valgavoth, Harrower of Souls (análise do Claude, v2)

Analista: Claude (Opus) | Data: 07/10/2026 | Substitui a `analise-claude-valgavoth.md` (v1)
Lista conferida: sim. 100 cartas com o comandante, sem repetição fora dos básicos, tudo em preto e vermelho, nenhuma banida | Cartas sem texto conferido: 6 com dúvida registrada na seção 9

## 0. Para o Claude Code

- **Destino.** `C:\Projetos\mtg-hub\dados\03. Valgavoth\`, junto com a lista, a capa e os outros dois handovers (Soul Siege e Soul Siege 2).
- **O que este arquivo é.** Uma das três opiniões sobre o deck, já no formato que o `/novo-deck` confronta. Nenhuma das três vale como verdade: decide o texto oficial da carta e o plano do deck.
- **Os oito agrupamentos são do dono e estão fechados.** Não renomear, fundir nem trocar. Os outros dois handovers usam eixos próprios; converta para estes.
- **As três fases (Inicial, Meio, Fim) também são do dono.** Estão na seção 5, com a fase de cada carta.
- **Decisões do dono.** Os 21 de dano de comandante são a vitória principal. Demônios são eixo, e a densidade deve subir. Cartas de estimação ainda não foram marcadas; a preferência provável é a edição DSC.
- **Pendências antes de publicar o painel.** Conferir no Scryfall as 6 cartas da seção 9 e perguntar ao dono as cartas de estimação (cada uma soma 1 ponto em Demons e sai da fila de corte).
- **O painel é gerado pelo motor do hub.** Este arquivo não traz HTML.

## 1. Plano

Fazer cada oponente perder vida no próprio turno para o Valgavoth crescer e comprar, e mantê-lo vivo até ele bater 21: **sangrar, crescer, golpear**.

O texto que manda em tudo: o Valgavoth ganha um marcador +1/+1 e compra uma carta na **primeira** vez que cada oponente perde vida **no turno dele**. São no máximo três marcadores e três cartas por rodada.

Onde a lista trai o plano:

- **Ela sangra muito e golpeia pouco.** São 18 cartas de dano direto e 2 que ajudam o comandante a conectar (Herald of Slaanesh e Lightning Greaves). Evasão além do voo: nenhuma.
- **O gatilho satura cedo.** Com quatro ou cinco fontes confiáveis em campo, a sexta não acrescenta marcador, só dano.
- **A proteção guarda o corpo, não o tamanho.** Das 9 proteções, 3 devolvem o Valgavoth sem os marcadores, e nenhuma preserva marcadores contra remoção em massa.
- **Três das cinco remoções em massa matam o próprio comandante**: Blasphemous Act, Nuclear Fallout e Blasphemous Edict.
- **21 de comandante mata um oponente, talvez dois.** Três oponentes pedem 63 de dano de combate. O Valgavoth elimina o mais saudável e o dano direto fecha os outros.
- **O deck cobra de você também.** Oito fontes recorrentes tiram a sua vida, e duas cartas suas (Sulfuric Vortex e Rampaging Ferocidon) desligam a sua cura.

## 2. Agrupamentos

Ordem das notas nas tabelas: Ramp · Draw · Removal · Demons · Dano Direto (draw) · Dano Direto (others) · Proteção · Win Con.

| # | Agrupamento | Definição |
|---|---|---|
| 1 | Ramp | Gera mana extra ou reduz custo de forma recorrente |
| 2 | Draw | Compra para o dono do deck: compra, jogar pelo topo e tutores |
| 3 | Removal | Tira permanente do oponente, pontual ou em massa |
| 4 | Demons | 3 para Demon que joga o plano ou carta que só funciona com Demon em campo; 2 para Demon comum ou carta que paga pela tribo; 1 para ligação fraca |
| 5 | Dano Direto (draw) | O oponente leva dano ou perde vida quando compra carta |
| 6 | Dano Direto (others) | Dano ou perda de vida por qualquer outro meio. 3 quando cai em todo turno de oponente sem depender dele; 2 quando depende do que ele faz; 1 quando só acontece no seu turno e não alimenta o gatilho |
| 7 | Proteção | Impede que o Valgavoth saia do campo, ou o devolve sem pagar o imposto de comandante |
| 8 | Win Con | Tudo que fecha o jogo: o que faz os 21 de comandante conectarem (ímpeto, evasão, marcadores), combos e vitórias alternativas |

## 3. Carta a carta

### Comandante

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Valgavoth, Harrower of Souls | 0·3·0·3·0·0·0·3 | S | INS | 4/4 com voo e ward (pagar 2 de vida). Na primeira perda de vida de cada oponente no turno dele, ganha um marcador +1/+1 e você compra. | É o motor, a compra e a condição de vitória. Tudo na lista se mede por ele. |

### Criaturas (25)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Barbflare Gremlin | 1·0·0·0·0·2·0·0 | C | BAX | 3/2 com iniciativa e ímpeto. Enquanto está virado, todo terreno virado por mana gera uma mana a mais e causa 1 de dano ao dono. | Alimenta o gatilho, mas dobra a mana de três oponentes para isso. O preço é alto demais para um corpo 3/2. |
| Bloodletter of Aclazotz | 0·0·0·3·0·1·0·2 | A | ALT | Demon 2/4 voador. No seu turno, toda perda de vida de oponente é dobrada. | Não dispara o gatilho (é no seu turno) nem dobra dano de comandante, mas faz um Valgavoth de poder 10 tirar 20 de vida. É o segundo eixo de abate. |
| Crypt Ghast | 3·0·0·0·0·1·0·0 | B | MÉD | Dobra a mana preta de cada Swamp e tem extorsão. | São 14 Swamps em 32 terrenos. Num deck com cinco pedras de mana, ele não é luxo. |
| Fate Unraveler | 0·0·0·0·3·0·0·0 | A | ALT | 3/4. Sempre que um oponente compra, leva 1 de dano. | Dispara na fase de compra de todo oponente, sem condição e sem custo para você. |
| Gleeful Arsonist | 0·0·0·0·0·2·0·0 | B | MÉD | 1/2 com undying. Causa dano igual ao próprio poder a cada oponente que conjura mágica não-criatura. | Alimenta o gatilho quando o oponente joga no turno dele. Depende do que a mesa conjura. |
| Gray Merchant of Asphodel | 0·0·0·0·0·1·0·2 | C | BAX | Ao entrar, drena cada oponente pela sua devoção ao preto. | Dreno no seu turno não dá marcador nem carta. É um bom finalizador num deck que não é este. |
| Herald of Slaanesh | 2·0·0·3·0·0·0·2 | A | ALT | Demon 2/2. Mágicas de Demon custam 2 a menos e seus outros Demons têm ímpeto. | O Valgavoth é Demon: passa a custar BR, o imposto de comandante cai 2 e ele ataca no turno em que desce. |
| Karazikar, the Eye Tyrant | 0·2·0·0·0·2·0·1 | B | MÉD | 5/5. Ao atacar um jogador, vira e incita uma criatura dele. Quando um oponente ataca outro, você e ele compram 1 e perdem 1 de vida. | O atacante perde vida no turno dele, então dispara o gatilho. Também tira um bloqueador do caminho. Cinco manas é o limite. |
| Kardur, Doomscourge | 0·0·0·2·0·2·0·1 | B | MÉD | Demon 4/3. Ao entrar, força as criaturas dos oponentes a atacar por uma rodada. Atacante que morre drena 1 de cada oponente. | Demon barato que gera perda de vida no turno deles por uma rodada. O efeito de entrada é de uso único. |
| Kederekt Parasite | 0·0·0·0·3·0·0·0 | S | INS | 1/1. Com uma permanente vermelha sua em campo, causa 1 de dano a cada oponente que compra. | Uma mana, e o Valgavoth é a permanente vermelha. É a melhor razão custo-gatilho do deck. |
| Lord of the Void | 0·0·0·2·0·0·0·2 | C | BAX | Demon 7/7 voador. Ao causar dano de combate, exila sete do topo do oponente e rouba uma criatura. | Sete manas para um efeito que só acontece quando você já está ganhando. É Demon, mas não joga o plano. |
| Mai, Scornful Striker | 0·0·0·0·0·3·0·0 | A | ALT | 2/2 com iniciativa. Todo jogador que conjura mágica não-criatura perde 2 de vida. | Duas manas e dispara em quase todo turno de oponente. Cobra de você também: 42 das suas 67 mágicas são não-criatura. |
| Massacre Wurm | 0·0·3·0·0·1·0·1 | A | ALT | 6/5. Ao entrar, criaturas dos oponentes ganham -2/-2. Criatura de oponente que morre tira 2 de vida do dono. | Uma das duas remoções em massa que não matam o Valgavoth. Limpa os bloqueadores pequenos. |
| Master of Cruelties | 0·0·0·3·0·0·0·3 | A | ALT | Demon 1/4, iniciativa e toque mortífero, só ataca sozinho. Se não for bloqueado, a vida do jogador vira 1. | Vida em 1 com dez fontes de dano no turno dele é morte na manutenção seguinte. |
| Mogis, God of Slaughter | 0·0·1·0·0·2·0·1 | A | ALT | Indestrutível. Na manutenção de cada oponente, 2 de dano, a menos que ele sacrifique uma criatura. | O oponente escolhe: leva o dano (e dispara o gatilho) ou perde um bloqueador. As duas saídas ajudam. |
| Ob Nixilis, Captive Kingpin | 0·2·0·3·0·0·0·2 | A | ALT | Demon 4/3 voador com atropelar. Quando oponentes perdem exatamente 1 de vida, ganha marcador e exila o topo para você jogar. | Mais de dez cartas da lista tiram exatamente 1. É um segundo Valgavoth, e é Demon. |
| Rakdos, Lord of Riots | 2·0·0·3·0·0·0·1 | A | ALT | Demon 6/6 voador com atropelar. Só pode ser conjurado se um oponente perdeu vida no turno. Criaturas custam 1 a menos por ponto de vida perdido pelos oponentes. | É o que torna os Demons caros jogáveis. Ataque primeiro com o Valgavoth e conjure depois do combate. |
| Rampaging Ferocidon | 0·0·0·0·0·2·0·1 | B | MÉD | 3/3 com ameaçar. Ninguém ganha vida. Causa 1 de dano ao controlador de cada outra criatura que entra. | Alimenta o gatilho quando o oponente desce criatura. Desliga o seu próprio ganho de vida, num deck que sangra. |
| Razorkin Needlehead | 0·0·0·0·3·0·0·0 | S | INS | 2/2, iniciativa no seu turno. Causa 1 de dano a cada oponente que compra. | Duas manas, só oponentes, toda fase de compra. Peça de referência. |
| Rot-Curse Rakshasa | 0·0·1·2·0·0·0·1 | B | MÉD | Demon 5/5 com atropelar e decayed (não bloqueia e é sacrificado depois de atacar). Do cemitério, por XBB, põe marcador decayed em X criaturas. | Demon de duas manas para a contagem da tribo. A segunda metade tira X bloqueadores do caminho para sempre. |
| Scrawling Crawler | 0·1·0·0·3·0·0·0 | A | ALT | 3/2 artefato. Na sua manutenção, cada jogador compra. Oponente que compra perde 1 de vida. | Dispara na compra de todo oponente e ainda liga o Rakdos no seu turno. Dá uma carta por rodada para cada adversário. |
| Sower of Discord | 0·0·0·2·0·1·0·2 | B | MÉD | Demon 6/6 voador. Escolha dois jogadores: dano causado a um faz o outro perder a mesma vida. | Dobra a sangria entre dois oponentes, mas a perda espelhada cai fora do turno de quem a sofre. Seis manas. |
| The Lord of Pain | 0·0·0·0·0·1·0·2 | B | MÉD | 5/5 com ameaçar. Oponentes não ganham vida. Na primeira mágica de cada jogador no turno, causa dano igual ao custo dela a outro jogador. | O dano vai para outro jogador, nunca para quem conjurou. Machuca bastante, mas quase nunca dispara o Valgavoth. |
| Unstoppable Slasher | 0·0·0·0·0·0·0·2 | C | BAX | 2/3 com toque mortífero. Dano de combate a um jogador tira metade da vida dele. Volta uma vez quando morre. | Não alimenta o gatilho. Só fecha jogo com o Bloodletter ao lado. |
| Vilis, Broker of Blood | 0·3·1·2·0·0·0·1 | B | MÉD | Demon 8/8 voador. Sempre que você perde vida, compra essa quantidade de cartas. | Oito fontes suas tiram a sua vida todo turno, então ele compra muito. Com Spiteful Visions em campo, ele mata você (ver seção 5). |

### Planeswalkers

Nenhum.

### Mágicas (21)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Blasphemous Act | 0·0·3·0·0·0·0·0 | B | MÉD | 13 de dano a cada criatura. Custa 1 a menos por criatura em campo. | É o botão de reinício, e leva o Valgavoth junto enquanto ele tiver resistência menor que 14. |
| Blasphemous Edict | 0·0·2·0·0·0·0·0 | C | BAX | Cada jogador sacrifica treze criaturas. Custa B se houver treze ou mais em campo. | Sacrifício passa por cima de toda a sua proteção. É a remoção em massa que mais contraria o plano. |
| Bolt Bend | 0·0·1·0·0·0·3·0 | A | ALT | Muda o alvo de mágica ou habilidade com alvo único. Custa R se você controla criatura de poder 4 ou mais. | Com o Valgavoth em campo custa uma mana e devolve a remoção para outra criatura. |
| Chaos Warp | 0·0·3·0·0·0·0·0 | A | ALT | Embaralha uma permanente no grimório do dono, que revela o topo e põe em campo se for permanente. | A única resposta do deck a qualquer tipo de permanente. Infraestrutura. |
| Demonic Counsel | 0·2·0·2·0·0·0·0 | B | ALT | Busca um Demon. Com delirium, busca qualquer carta. | Encontra Herald, Rakdos ou Master of Cruelties por duas manas. Melhora a cada Demon bom que entrar. |
| Feed the Swarm | 0·0·2·0·0·0·0·0 | B | ALT | Destrói criatura ou encantamento de oponente. Você perde vida igual ao custo. | Uma das duas respostas a encantamento em duas cores que quase não têm isso. |
| Imp's Mischief | 0·0·1·0·0·0·3·0 | A | ALT | Muda o alvo de uma mágica com alvo único. Você perde vida igual ao custo dela. | Proteção a duas manas. Só pega mágicas, não habilidades. |
| Insatiable Avarice | 0·2·0·0·0·0·0·0 | B | MÉD | Modal: buscar uma carta e pôr no topo (+2), e/ou um jogador compra 3 e perde 3 (+BB). | Tutor barato num deck que compra no turno seguinte. Flexível o bastante para ficar. |
| Jeska's Will | 3·2·0·0·0·0·0·0 | A | INS | Com o comandante em campo: mana vermelha igual à mão de um oponente e três cartas do topo jogáveis no turno. | O maior turno explosivo do deck. Paga uma reconjuração cara do Valgavoth. |
| Malakir Rebirth | 0·0·0·0·0·0·2·0 | B | ALT | Você perde 2 de vida; se a criatura alvo morrer no turno, volta virada. O verso é terreno. | Conta como fonte de terreno. Como proteção, devolve o Valgavoth sem os marcadores. |
| Mandate of Abaddon | 0·0·3·0·0·0·0·1 | A | ALT | Escolha uma criatura sua. Destrói todas as criaturas com poder menor que o dela. | Com o Valgavoth grande, é remoção em massa só do lado deles. Leva também os seus pingers pequenos. |
| Not Dead After All | 0·0·0·0·0·0·2·0 | B | MÉD | Se a criatura alvo morrer no turno, volta virada com um Wicked Role (+1/+1). | Poupa o imposto de comandante por uma mana. Os marcadores não voltam. |
| Nuclear Fallout | 0·0·3·0·0·2·0·0 | B | MÉD | Cada criatura ganha -2X/-2X. Cada jogador recebe X marcadores rad. | Rad faz cada oponente perder vida no turno dele por várias rodadas. Com X alto, mata o Valgavoth e os seus pingers. |
| Profane Tutor | 0·2·0·0·0·0·0·0 | B | MÉD | Suspender 2 por 1B: busca qualquer carta. | Tutor de duas manas com dois turnos de espera. Aceitável enquanto não houver tutor melhor. |
| Rakdos Charm | 0·0·2·0·0·1·0·1 | B | ALT | Modal: exila um cemitério, destrói um artefato, ou cada criatura causa 1 de dano ao controlador. | Três respostas em uma carta. O terceiro modo é instantâneo e dispara o gatilho no turno do oponente. |
| Redirect Lightning | 0·0·1·0·0·0·3·0 | A | ALT | Custo adicional de 2 manas ou 5 de vida. Muda o alvo de mágica ou habilidade com alvo único. | Proteção com uma mana aberta. Os 5 de vida pesam num deck que já sangra. |
| Return the Favor | 0·0·1·0·0·0·2·1 | B | ALT | Modal: copia mágica instantânea, feitiço ou habilidade (+1), e/ou muda o alvo de mágica ou habilidade (+1). | Três manas pela proteção, mais cara que as outras. Fica pelo modo de cópia. |
| Sadistic Shell Game | 0·0·2·0·0·0·0·0 | C | BAX | Cada jogador, a começar pelo oponente seguinte, escolhe uma criatura que você não controla. As escolhidas são destruídas. | Cinco manas em velocidade de feitiço, e a mesa escolhe três dos quatro alvos. |
| Spikefield Hazard | 0·0·1·0·0·0·0·0 | C | MÉD | 1 de dano a qualquer alvo. O verso é terreno. | É um terreno com opção. Conta como fonte de mana e não entra em fila de corte. |
| Untimely Malfunction | 0·0·2·0·0·0·2·1 | A | ALT | Modal: destrói artefato, muda o alvo de mágica ou habilidade, ou até duas criaturas não podem bloquear. | Proteção, resposta a artefato e abertura de bloqueio na mesma carta. |
| Withering Torment | 0·0·2·0·0·0·0·0 | B | ALT | Destrói criatura ou encantamento. Você perde 2 de vida. | Remoção instantânea que também pega encantamento. |

### Artefatos (9)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Arcane Signet | 2·0·0·0·0·0·0·0 | A | ALT | Gera uma mana de qualquer cor do comandante. | Valgavoth no turno 3. |
| Basilisk Collar | 0·0·0·0·0·0·0·1 | C | BAX | Equipamento: toque mortífero e vínculo com a vida. | Sulfuric Vortex e Rampaging Ferocidon, ambas suas, desligam o ganho de vida. E não dá evasão. |
| Fellwar Stone | 2·0·0·0·0·0·0·0 | A | ALT | Gera mana de cor que um terreno de oponente produz. | Rampa de duas manas. |
| Lightning Greaves | 0·0·0·0·0·0·3·2 | S | INS | Equipamento de custo 0: ímpeto e manto. | Proteção e ímpeto de graça. O manto impede as suas próprias mágicas de mirar o Valgavoth (ver seção 5). |
| Mindcrank | 0·0·0·0·0·0·0·2 | B | MÉD | Oponente que perde vida tritura a mesma quantidade. | Metade do único combo de duas cartas do deck, com Bloodchief Ascension. Sozinha, só enche o cemitério dos outros. |
| Sol Ring | 3·0·0·0·0·0·0·0 | S | INS | Duas manas incolores por uma. | Valgavoth no turno 2 ou 3. |
| Séance Board | 1·0·0·1·0·0·0·0 | C | BAX | Ganha marcador em todo fim de turno em que uma criatura morreu. Gera X manas de uma cor, só para instantâneas, feitiços, Demons e Spirits. | No turno em que entra, gera zero. O deck precisa de rampa cedo, e esta só rende tarde. |
| Talisman of Indulgence | 2·0·0·0·0·0·0·0 | A | ALT | Gera incolor, ou preta ou vermelha com 1 de dano em você. | Rampa de duas manas nas duas cores. |
| Thought Vessel | 2·0·0·0·0·0·0·0 | A | ALT | Gera uma incolor. Sem limite de mão. | Rampa, e o comandante compra até três cartas por rodada. |

### Encantamentos (12)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Bloodchief Ascension | 0·0·0·0·0·2·0·3 | A | ALT | Ganha marcador em todo fim de turno em que um oponente perdeu 2 ou mais de vida. Com três, cada carta que vai ao cemitério de um oponente tira 2 de vida dele. | Ativa em três turnos neste deck e fecha combo com Mindcrank. |
| Descent into Avernus | 2·0·0·0·0·1·0·1 | C | BAX | Na sua manutenção, soma dois marcadores; cada jogador cria X tesouros e leva X de dano. | O dano cai no seu turno, que não dá marcador, e três oponentes recebem a mesma mana que você. |
| Ghoulish Impetus | 0·0·1·0·0·0·0·0 | D | BAX | Aura: +1/+1, toque mortífero e a criatura fica incitada. | Incitar faz o oponente bater em outro oponente, que perde vida fora do próprio turno. Não alimenta o gatilho. |
| Kaya's Ghostform | 0·0·0·0·0·0·2·0 | B | ALT | Aura: se a criatura morrer ou for exilada, volta ao campo. | A única proteção que cobre remoção em massa e exílio sem mana aberta. Os marcadores não voltam. |
| Liliana's Contract | 0·2·0·2·0·0·0·2 | B | MÉD | Ao entrar, compre 4 e perca 4. Na sua manutenção, com quatro Demons de nomes diferentes, você vence. | Compra quatro por cinco. A vitória pede o Valgavoth mais três Demons, e são dez nas 99. |
| Manabarbs | 0·0·0·0·0·3·0·1 | A | ALT | Todo terreno virado por mana causa 1 de dano ao dono. | Gatilho praticamente garantido em todo turno de oponente. Cobra de você na mesma moeda. |
| Phyrexian Arena | 0·2·0·0·0·0·0·0 | B | MÉD | Uma carta a mais por turno, por 1 de vida. | É a compra dos turnos em que o Valgavoth não está em campo. |
| Roiling Vortex | 0·0·0·0·0·3·0·1 | S | INS | 1 de dano a cada jogador na manutenção dele. Pune mágica sem custo pago e pode impedir ganho de vida. | Duas manas, incondicional, todo turno de todo oponente. |
| Spiteful Visions | 0·1·0·0·3·0·0·0 | B | ALT | Cada jogador compra uma carta a mais na fase de compra. Quem compra leva 1 de dano. | Dois de dano no turno de cada oponente. Em você também, e cada carta que o Valgavoth compra custa 1 de vida. |
| Sulfuric Vortex | 0·0·0·0·0·3·0·1 | A | INS | 2 de dano a cada jogador na manutenção dele. Ninguém ganha vida. | Incondicional e difícil de remover. Custa 2 de vida por turno a você e desliga a sua cura. |
| Underworld Dreams | 0·0·0·0·3·0·0·0 | A | INS | Oponente que compra leva 1 de dano. | Só oponentes, toda fase de compra, em encantamento. |
| Unholy Annex // Ritual Chamber | 0·3·0·3·0·1·0·1 | A | INS | No seu fim de turno, compre. Com Demon em campo, drena 2 de cada oponente; sem, você perde 2. A segunda porta cria um Demon 6/6 voador. | O Valgavoth é o Demon que liga a carta. Compra todo turno, mesmo que o dreno caia no seu turno. |

### Terrenos (32)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Arena of Glory | 0·0·0·0·0·0·0·1 | B | MÉD | Gera R. Exaurida, gera RR para criatura, que ganha ímpeto. | Valgavoth com ímpeto. Só entra desvirada com Mountain, e são 7. |
| Blazemire Verge | 0·0·0·0·0·0·0·0 | B | ALT | Gera B, ou R se você controla Swamp ou Mountain. | Dual desvirado. |
| Canyon Slough | -1·0·0·0·0·0·0·0 | B | MÉD | Swamp Mountain que entra virado, com reciclar. | Conta como Swamp para Crypt Ghast e Tainted Peak. |
| Command Tower | 0·0·0·0·0·0·0·0 | A | INS | Gera as duas cores. | Sem custo. |
| Dragonskull Summit | 0·0·0·0·0·0·0·0 | B | ALT | Dual que entra desvirado com Swamp ou Mountain. | Quase sempre desvirado com 18 básicos. |
| Exotic Orchard | 0·0·0·0·0·0·0·0 | B | ALT | Gera cor que terreno de oponente produz. | Depende da mesa. |
| Foreboding Ruins | 0·0·0·0·0·0·0·0 | B | ALT | Dual que entra desvirado se você revelar Swamp ou Mountain. | Bom cedo. |
| Leechridden Swamp | -1·0·0·0·0·1·0·0 | B | MÉD | Swamp que entra virado. Por B, cada oponente perde 1, com duas permanentes pretas. | Ativado no turno de um oponente, dispara o gatilho dele quando falta outra fonte. |
| Rakdos Carnarium | 0·0·0·0·0·0·0·0 | B | MÉD | Entra virado, devolve um terreno, gera BR. | Vale por dois terrenos; a nota de rampa é anulada por entrar virado. |
| Reliquary Tower | 0·0·0·0·0·0·0·0 | C | MÉD | Incolor. Sem limite de mão. | Repete o que Thought Vessel já faz, sem gerar cor. |
| Spinerock Knoll | -1·0·0·0·0·0·0·0 | C | MÉD | Entra virado com hideaway. Libera a carta se um oponente levou 7 de dano no turno. | Um ataque do Valgavoth com 7 de poder cumpre a condição. Entra virado. |
| Tainted Peak | 0·0·0·0·0·0·0·0 | B | ALT | Gera B ou R se você controla Swamp. | 14 Swamps sustentam. |
| Temple of the False God | 1·0·0·0·0·0·0·0 | C | BAX | Duas incolores, só com cinco terrenos. | Com 34 fontes, é carta morta nas mãos iniciais curtas. |
| War Room | 0·1·0·0·0·0·0·0 | B | MÉD | Incolor. Por 3 e 2 de vida, compra uma carta. | Compra em terreno. |
| Mountain (x6) | 0·0·0·0·0·0·0·0 | B | MÉD | Básico. | Com os duais, o vermelho soma 17 fontes para 34% dos símbolos. |
| Swamp (x12) | 0·0·0·0·0·0·0·0 | B | MÉD | Básico. | Sustentam Crypt Ghast e Tainted Peak. |

## 4. Diagnóstico

| Item | Deck | Faixa | Leitura |
|---|---|---|---|
| Fontes de terreno | 34 | 35 a 37 | Abaixo. São 32 terrenos mais Malakir Rebirth e Spikefield Hazard |
| Ramp (nota 2 ou 3) | 10 | 10 a 12 | No papel, dentro. Só 5 são pedras que descem antes do comandante sem condição |
| Draw (nota 2 ou 3) | 10 nas 99 | 10 a 12 | Dentro, e o comandante compra até 3 por rodada. Três das dez são tutores |
| Removal (nota 2 ou 3) | 11, com 5 em massa | 8 a 12, com 3 a 5 | Dentro. Só 5 são pontuais de verdade, e só 2 das 5 em massa poupam o Valgavoth |
| Demons | 10 criaturas nas 99, mais 3 cartas que pagam pela tribo | conforme o comandante | Baixo. Liliana's Contract pede três Demônios além do comandante em campo |
| Dano Direto (draw) | 6 | peça do plano | Suficiente. Todas disparam em toda fase de compra de oponente |
| Dano Direto (others) | 12 | peça do plano | Sobra. Só 4 são de nota 3 |
| Proteção | 9 | peça do plano | 6 preservam marcadores, 0 contra remoção em massa |
| Win Con | 13 | peça do plano | Só 2 servem aos 21 de comandante. As outras 11 são combo, dreno ou vitória alternativa |
| CMC médio | 3,09 | conforme o plano | Bom para um comandante de 4 |
| Curva | pico em 2 (19 cartas) | pico em 2 ou 3 | 13 cartas em 3, 13 em 4, 7 em 5 e 5 acima de 5 |
| Cor | demanda B 66%, R 34%; oferta B 22 fontes, R 17 | proporções parecidas | Proporção boa. O problema é o total de fontes |

CMC conta o comandante, Unholy Annex como 3 (a porta que se conjura primeiro) e Profane Tutor como 0.

**O desequilíbrio entre gerar e converter.** O deck gera perda de vida com 18 cartas e converte marcadores em dano de comandante com 2. Sobra dano direto e falta quem faça o golpe chegar.

Conta de mesa, como estimativa: Valgavoth no turno 4, três marcadores por rodada com o dano direto montado. Ataques de 7, 10 e 13 somam 30. São três ataques para o primeiro abate, por volta do turno 7, se nada o remover e ninguém bloquear com voador.

**Lacunas, pelo nome**

1. Fontes de terreno: 34. Faltam duas.
2. Win Con para os 21: 2 cartas. Nenhuma evasão.
3. Preservação de marcadores: zero cartas.
4. Proteção contra remoção em massa: uma (Kaya's Ghostform), e ela devolve o comandante sem marcadores.
5. Demons: 10 criaturas nas 99.
6. Aceleração de até 2 manas: 5 cartas. A chance de ter uma até o turno 2 é de 39%.
7. Remoção pontual instantânea e barata: 5.

**Distribuição da régua.** Tier: 6 S, 27 A, 37 B, 13 C, 1 D (por nome de carta). Relevância nas 100: 11 INS, 35 ALT, 43 MÉD (18 são básicos), 11 BAX.

**Placar: 324.** CMC médio 3,09 dá 3 pontos. Soma de Ramp 23, dividida por 3,09, dá 7,44, que vale 70 pontos. Soma de todas as notas: 251. O placar da v1 (334) usava outros eixos e não é comparável.

## 5. Combos e linhas de jogo

### As três fases

| Fase | Objetivo | Cartas | O que a lista tem | O que falta |
|---|---|---|---|---|
| Inicial (turnos 1 a 4) | Rampar e descer o comandante | 51 | 34 fontes, 5 pedras, Herald of Slaanesh, 3 tutores, 4 fontes de dano de até 2 manas | Duas fontes, mais aceleração de 2 manas, menos terreno virado (hoje 4, mais Arena of Glory sem Mountain) |
| Meio (turnos 4 a 8) | Disparar os gatilhos e proteger o comandante | 31 | 18 fontes de dano direto, 9 proteções | Marcadores que sobrevivam a uma remoção, e remoção pontual instantânea |
| Fim | Finalizar e política | 18 | 21 de comandante, um combo, duas linhas com Bloodletter, 5 cartas que direcionam dano | Evasão para o golpe final |

**Fase Inicial.** A ordem ideal é fonte de dano de 1 ou 2 manas no turno 2 e Valgavoth no turno 3 ou 4, para ele já crescer na primeira rodada. Lightning Greaves desce antes dele.

Cartas: Valgavoth, Harrower of Souls; Herald of Slaanesh; Kederekt Parasite; Mai, Scornful Striker; Razorkin Needlehead; Demonic Counsel; Insatiable Avarice; Malakir Rebirth; Profane Tutor; Spikefield Hazard; Arcane Signet; Fellwar Stone; Lightning Greaves; Sol Ring; Séance Board; Talisman of Indulgence; Thought Vessel; Bloodchief Ascension; Roiling Vortex. Mais os 32 terrenos.

**Fase do Meio.** O gatilho só conta a primeira perda de vida de cada oponente no turno dele. Uma fonte de Dano Direto (draw) em campo já garante os três marcadores por rodada; a segunda é seguro contra remoção. Mantenha uma mana aberta para o desvio.

Cartas: Barbflare Gremlin; Crypt Ghast; Fate Unraveler; Gleeful Arsonist; Mogis, God of Slaughter; Ob Nixilis, Captive Kingpin; Rampaging Ferocidon; Rot-Curse Rakshasa; Scrawling Crawler; Bolt Bend; Chaos Warp; Feed the Swarm; Imp's Mischief; Jeska's Will; Not Dead After All; Nuclear Fallout; Rakdos Charm; Redirect Lightning; Return the Favor; Untimely Malfunction; Withering Torment; Basilisk Collar; Descent into Avernus; Ghoulish Impetus; Kaya's Ghostform; Manabarbs; Phyrexian Arena; Spiteful Visions; Sulfuric Vortex; Underworld Dreams; Unholy Annex // Ritual Chamber.

**Fase Final.** O Valgavoth mata o oponente mais saudável e o dano direto fecha os outros.

Cartas: Bloodletter of Aclazotz; Gray Merchant of Asphodel; Karazikar, the Eye Tyrant; Kardur, Doomscourge; Lord of the Void; Massacre Wurm; Master of Cruelties; Rakdos, Lord of Riots; Sower of Discord; The Lord of Pain; Unstoppable Slasher; Vilis, Broker of Blood; Blasphemous Act; Blasphemous Edict; Mandate of Abaddon; Sadistic Shell Game; Mindcrank; Liliana's Contract.

**Política.** As cartas que escolhem quem apanha são Karazikar, Kardur, Sower of Discord, The Lord of Pain e Sadistic Shell Game; Mogis oferece um dilema a cada oponente. Um alerta: Manabarbs, Sulfuric Vortex e Spiteful Visions batem em todos, e a mesa tende a se juntar contra o deck já na fase do Meio, antes de o Valgavoth estar grande.

### Combos de verdade

| Peças | O que acontece | Conferido |
|---|---|---|
| Bloodchief Ascension (ativa, com 3 marcadores) + Mindcrank | Qualquer perda de vida de um oponente o faz triturar; cada carta triturada tira 2 de vida; ele tritura mais 2, e assim até morrer. Como o dano direto atinge a todos, a mesa cai em uma rodada | Sim, pelo texto das duas |
| Bloodletter of Aclazotz + Unstoppable Slasher | O Slasher conecta e tira metade da vida, arredondada para cima. O Bloodletter dobra. O jogador perde a vida inteira | Sim |
| Bloodletter of Aclazotz + Master of Cruelties | A vida vira 1, o que conta como perder a diferença. Dobrada, a perda passa do total | Com ressalva, ver seção 9 |

### Motores

- **Valgavoth + uma fonte de Dano Direto (draw)**: três marcadores e três cartas por rodada, sem gastar mana.
- **Herald of Slaanesh + Valgavoth**: o comandante custa BR, o imposto cai 2 por conjuração e ele ataca no turno em que entra.
- **Rakdos, Lord of Riots + Valgavoth**: ataque primeiro. Sete de dano num oponente fazem Vilis e Lord of the Void custarem BBB depois do combate (o desconto só abate mana genérica).
- **Ob Nixilis, Captive Kingpin + fontes de 1 de dano**: cresce e compra pelo topo em quase todo turno de oponente.
- **Mandate of Abaddon com o Valgavoth grande**: remoção em massa só do lado deles, por 4 manas.
- **Leechridden Swamp**: ativado no turno de um oponente, garante o gatilho dele quando o resto falhou.

### Armadilhas da própria lista

- **Vilis, Broker of Blood + Spiteful Visions matam o dono do deck.** Ele compra, leva 1 de dano, o Vilis manda comprar 1, que causa 1 de dano. Os dois gatilhos são obrigatórios e o ciclo só para com a morte. Nunca ter as duas em campo. Vale um aviso no painel.
- **Lightning Greaves dá manto.** Com ela equipada, Kaya's Ghostform, Not Dead After All, Malakir Rebirth e Mandate of Abaddon não podem mirar o Valgavoth. Mover a Greaves para outra criatura antes (equipar custa 0).
- **Sulfuric Vortex e Rampaging Ferocidon** apagam o ganho de vida de Basilisk Collar, Kardur, Unholy Annex, Bloodchief Ascension e Crypt Ghast.
- **Mai, Scornful Striker** cobra 2 de vida a cada uma das 42 mágicas não-criatura do próprio deck.
- **Blasphemous Act e Nuclear Fallout** levam o Valgavoth junto.

## 6. Cortes

As dez primeiras a sair, em ordem.

1. **Ghoulish Impetus.** Incitar faz um oponente bater em outro, que perde vida fora do próprio turno. Não alimenta o gatilho.
2. **Descent into Avernus.** O dano cai no turno do dono, e três oponentes recebem os mesmos tesouros.
3. **Sadistic Shell Game.** Cinco manas, velocidade de feitiço, e a mesa escolhe três dos quatro alvos.
4. **Blasphemous Edict.** Sacrifício ignora toda a proteção.
5. **Lord of the Void.** Sete manas para um efeito de quem já está ganhando.
6. **Gray Merchant of Asphodel.** Dreno no próprio turno: não dá marcador nem carta.
7. **Basilisk Collar.** O vínculo com a vida é apagado por duas cartas da lista, e ela não dá evasão.
8. **Barbflare Gremlin.** Dobra a mana de três oponentes para causar 1 de dano.
9. **Séance Board.** Rampa que gera zero no turno em que entra.
10. **Unstoppable Slasher.** Não alimenta o gatilho e só fecha jogo com o Bloodletter ao lado.

Terreno à parte: **Temple of the False God** só sai por outro terreno. Malakir Rebirth e Spikefield Hazard são fontes de terreno e não são corte.

Atenção para as cartas de estimação: Barbflare Gremlin, Séance Board e Sadistic Shell Game são da DSC, e Unstoppable Slasher é da DSK. Se alguma for de estimação, ela fica e a troca correspondente cai.

## 7. Entradas

Preços, quando aparecem, são os do edh.wiki em 07/10/2026 e servem só de ordem de grandeza.

### O que as trocas respondem

| Dúvida do dono | Resposta | Cartas |
|---|---|---|
| Mais tutores? | Em quantidade, não: são 3, e o comandante compra até 3 por rodada. Em qualidade, sim | Varragoth, Bloodsky Sire (tutor e Demon); Demonic Tutor no lugar de Profane Tutor, se o orçamento permitir |
| Mais Demônios? | Sim, de 10 para 13 nas 99. Demon novo custa até 5 ou fecha o jogo | Archfiend of Depravity, Archfiend of Despair, Varragoth, Spawn of Mayhem |
| Mais remoção pontual? | Sim, duas, instantâneas e baratas | Terminate, Bedevil |
| Melhorar a Win Con? | É a prioridade: evasão, marcadores preservados e um fechador | Rogue's Passage, The Ozolith, Swiftfoot Boots, Chandra's Ignition, Archfiend of Despair |
| Como acelerar? | Mais fontes, mais uma pedra de 2, menos terreno virado, menos topo de curva | Sulfurous Springs, Smoldering Marsh, Rakdos Signet; saem Temple of the False God e Lord of the Void |

### Entram (15 trocas)

| # | Entra | Sai | Motivo | O que muda |
|---|---|---|---|---|
| 1 | Sulfurous Springs | Descent into Avernus | Dual desvirado nas duas cores | Fontes 34 para 35 |
| 2 | Smoldering Marsh | Gray Merchant of Asphodel | Dual com tipo Swamp e Mountain | Fontes 35 para 36 |
| 3 | Rogue's Passage | Temple of the False God | Deixa o Valgavoth imbloqueável por 4 manas | Primeira evasão do deck, terreno por terreno |
| 4 | Rakdos Signet | Séance Board | Pedra de 2 manas que gera as duas cores no turno em que entra | Aceleração de até 2 manas: 5 para 6. Chance até o turno 2: 39% para 44% |
| 5 | Swiftfoot Boots | Basilisk Collar | Ímpeto e resistência a magia, sem o manto que trava as mágicas do próprio deck | Segunda bota, equipamento por equipamento |
| 6 | The Ozolith | Rampaging Ferocidon | Guarda os marcadores quando o Valgavoth sai do campo e os devolve no combate seguinte. Pede alvo: não funciona com a Greaves equipada | Fecha a lacuna 3 e religa o ganho de vida |
| 7 | Chandra's Ignition | Sadistic Shell Game | O Valgavoth causa dano igual ao poder a cada outra criatura e a cada oponente. Também pede alvo | Terceira remoção em massa que o poupa |
| 8 | Archfiend of Depravity | Blasphemous Edict | Demon 5/4 voador. No fim do turno de cada oponente, ele fica com duas criaturas | Controle recorrente que abre o caminho |
| 9 | Archfiend of Despair | Lord of the Void | Demon 6/6 voador. Oponentes não ganham vida e, em todo fim de turno, perdem de novo o que perderam | Demon por Demon. Oito manas, seis com o Herald |
| 10 | Spawn of Mayhem | Unstoppable Slasher | Demon 4/4 voador com atropelar por 4. Causa 1 a cada jogador na manutenção do dono: liga Rakdos e Ob Nixilis, não o Valgavoth | Mais um Demon barato com evasão |
| 11 | Varragoth, Bloodsky Sire | Insatiable Avarice | Demon de 3 manas que busca carta para o topo quando ataca | Tutor por tutor, e é Demon |
| 12 | Blood Seeker | Barbflare Gremlin | Duas manas. Oponente que desce criatura perde 1 | Dano direto por dano direto, sem dar mana à mesa |
| 13 | Harsh Mentor | Ghoulish Impetus | Duas manas. 2 de dano a quem ativa habilidade de artefato, criatura ou terreno | Dano direto que dispara no turno do oponente |
| 14 | Terminate | Nuclear Fallout | Duas manas, instantânea, destrói criatura | Troca uma remoção em massa que mata o comandante por uma pontual |
| 15 | Bedevil | Not Dead After All | Três manas, instantânea, destrói artefato, criatura ou planeswalker | Sai a proteção que devolve o comandante sem marcadores |

**Antes e depois**

| Item | Antes | Depois |
|---|---|---|
| Fontes de terreno | 34 | 36 |
| Ramp (nota 2 ou 3) | 10 | 10, com 6 pedras em vez de 5 |
| Draw (nota 2 ou 3) | 10 | 10, com 3 tutores |
| Removal | 11, com 5 pontuais | 12, com 7 pontuais |
| Remoção em massa que poupa o comandante | 2 de 5 | 3 de 4 |
| Demons (criaturas nas 99) | 10 | 13 |
| Dano Direto (draw) | 6 | 6 |
| Dano Direto (others) | 12 | 11 |
| Proteção | 9, com 6 que preservam marcadores | 9, com 7 |
| Cartas que servem aos 21 de comandante | 2 | 5 |
| CMC médio | 3,09 | 3,11 |

O CMC não cai: a velocidade vem das duas fontes e da pedra a mais, não da curva. A política perde Sadistic Shell Game.

### Avaliar

| Carta | Motivo | Quem sairia |
|---|---|---|
| Mind Stone e Dark Ritual | Com as duas, a chance de aceleração até o turno 2 vai a 55%. Dark Ritual põe o Valgavoth em campo no turno 2 | Gleeful Arsonist, Phyrexian Arena |
| Fireshrieker | Golpe duplo: os 21 saem com 11 de poder | The Lord of Pain |
| Trailblazer's Boots | Travessia de terreno não básico, quase imbloqueável em Commander | Liliana's Contract |
| Mithril Coat | Indestrutível com lampejo, entra já equipada em lendária. Salva os marcadores de uma remoção em massa por destruição. Cerca de 29 dólares | Kaya's Ghostform |
| Demonic Tutor | Melhor tutor do formato. Cerca de 69 dólares | Profane Tutor |
| Demonic Covenant | Da DSC. Cria um Demon 5/5 voador por turno e compra quando Demônios atacam. Custa 6, e 4 com o Herald | Sower of Discord |

As saídas desta tabela dependem das cartas de estimação: Gleeful Arsonist e The Lord of Pain são novidades da DSC.

### Ficam de fora

| Carta | Motivo |
|---|---|
| Branching Evolution | É verde. Fora da identidade de cor |
| Blood Artist, Falkenrath Noble, Syr Konrad, Mayhem Devil | Pagam por morte de criatura, e o deck não tem saída de sacrifício |
| Animate Dead, Reanimate, Victimize | O comandante volta pela zona de comando |
| Kaervek the Merciless | Sete manas |
| Vial Smasher the Fierce | Dispara com as mágicas do dono, no turno dele |
| Shadowspear | O vínculo com a vida morre com Sulfuric Vortex. Pelo atropelar, sai caro (cerca de 30 dólares) |
| Sheoldred, the Apocalypse | Boa aqui, mas não é Demon, custa cerca de 100 dólares e o dano direto já sobra |
| Ankh of Mishra, Nightshade Harvester, Persistent Constrictor | Boas fontes, num eixo que já tem 12. Constrictor é da DSC: se for de estimação, entra no lugar de Gleeful Arsonist |
| Deflecting Swat | Melhora um desvio que a lista já tem em cinco cópias. Decisão de orçamento |
| Hatred, Unleash Fury | Abate em um golpe que depende de não haver bloqueador |
| Rakdos, the Showstopper | Mata as fontes de dano do próprio deck, que não são Demônios |

## 8. Proposta para o painel

**Nomes**

1. **A Casa Cobra.** O Valgavoth é a Casa, e o deck é um pedágio.
2. **Colheita do Medo.** O que ele faz: colhe o medo de quem joga contra.
3. **Dízimo das Almas.** A cobrança é pequena, por turno, de cada um.

**Clima.** Corredor escuro de casa antiga, madeira podre, fios vermelhos esticados no ar. Um horror que cobra em silêncio.

**Paleta**

| Cor | Hex | Uso |
|---|---|---|
| Breu | #0E0B0B | Fundo |
| Sangue seco | #7A1210 | Superfícies e faixas |
| Brasa | #E0321F | Destaque e alertas |
| Osso | #D9D2C5 | Texto |
| Névoa fria | #5E7377 | Secundário e linhas |

**Moldura da capa.** Larga. A arte é paisagem, com a figura no centro e as asas ocupando toda a largura.

**Motivo gráfico.** O X de luz vermelha no peito do Valgavoth, com fios finos irradiando para as bordas. Serve de divisor de seção e de marcador de contagem.

**Blocos próprios deste deck** (além do padrão do hub): as três fases como navegação principal; um contador de gatilho por rodada (0 a 3); o aviso da armadilha Vilis + Spiteful Visions.

## 9. Dúvidas

**O que não conferi**

- **Valgavoth, Harrower of Souls.** O Scryfall bloqueou a consulta. O texto usado bate com o handover Soul Siege, mas a fonte oficial não foi lida.
- **Mai, Scornful Striker.** Texto conferido. O custo de mana (assumido 1B) não apareceu nas fontes.
- **Redirect Lightning.** Texto conferido. O custo de mana (assumido R) não apareceu.
- **Return the Favor (SOA) 47.** Código SOA não reconhecido. Avaliada pelo texto da impressão original.
- **Sadistic Shell Game** e **Unholy Annex // Ritual Chamber.** Avaliadas de memória.
- **Cartas de fora** (seção 7): avaliadas de memória, exceto Persistent Constrictor e Demonic Covenant.
- **Preços.** Só os do edh.wiki. The Ozolith, Archfiend of Depravity, Spawn of Mayhem e Varragoth estão sem preço.

**Regras em que não tenho certeza**

- **Bloodletter + Master of Cruelties.** Entendo que "a vida vira 1" conta como perda de vida e é dobrada. Conferir.
- **The Ozolith.** A devolução acontece no início do combate do dono e pede alvo.

**Mudanças em relação à v1**

- Os oito eixos passaram a ser os do dono. Sinergia virou Demons, Sangria foi dividida em Dano Direto (draw) e (others), Voltron e Especial foram fundidos em Win Con.
- Mindcrank subiu de C e BAX para B e MÉD e saiu da fila de corte, porque o dono quer reforçar Win Con. Unstoppable Slasher desceu para C e BAX.
- Entraram Rakdos Signet, Spawn of Mayhem, Varragoth, Terminate e Bedevil. Trailblazer's Boots desceu para "avaliar".
- Contagem de Demônios corrigida: 10 nas 99 e 11 com o comandante.

**Ressalvas sobre os eixos**

- Evasão, ímpeto e preservação de marcadores não têm eixo próprio: estão dentro de Win Con. A contagem "cartas que servem aos 21" na seção 4 existe para a lacuna não sumir.
- Dano Direto (others) junta fontes garantidas e condicionais. A nota separa: 3 é garantida.

**As cinco avaliações mais discutíveis**

1. **Mai como A.** Tira 2 de vida do dono a cada mágica não-criatura.
2. **Gray Merchant como BAX.** É forte, e pontua 2 em Win Con. Sai porque dreno no próprio turno não conversa com o comandante.
3. **Vilis mantido como B.** Oito manas e uma armadilha letal com Spiteful Visions.
4. **Herald of Slaanesh como A.** Um 2/2 frágil. A nota vem do desconto no imposto de comandante.
5. **Rampaging Ferocidon saindo.** É fonte de dano de 3 manas. Sai porque o eixo sobra e ela desliga a cura do dono.

## 10. Confronto

Dois outros handovers: "Soul Siege" (A) e "Soul Siege 2" (B).

**Onde as três concordam**

- O dano que vale é o que cai no turno do oponente.
- Saem Ghoulish Impetus, Lord of the Void e Barbflare Gremlin.
- Entram Swiftfoot Boots e Harsh Mentor.

**Onde sigo A**

- The Ozolith, Chandra's Ignition e Archfiend of Depravity.
- Saída de Basilisk Collar, Gray Merchant, Blasphemous Edict, Nuclear Fallout, Insatiable Avarice e Temple of the False God.
- Subir a base de mana.

**Onde divirjo de A**

- **Diz que a lista tem 99 cartas.** Tem 100.
- **Conta 32 terrenos e para aí.** São 34 fontes com as duas cartas duplas.
- **Recomenda Branching Evolution.** A carta é verde.
- **Corta Crypt Ghast e Thought Vessel** logo depois de dizer que a mana está curta.
- **Corta Massacre Wurm e Karazikar.** O Wurm é uma das duas remoções em massa que poupam o comandante; Karazikar dispara o gatilho e é carta de política.
- **A versão proposta baixa os Demônios de 10 para 9**, contra o pedido do dono.
- **Recomenda Shadowspear** sem notar que Sulfuric Vortex apaga o vínculo com a vida.
- **Notas de 8,20 e 8,61**, com duas casas decimais e sem método declarado.

**Onde divirjo de B**

- **Corta Mai, Scornful Striker**, fonte de dano de duas manas que dispara em quase todo turno de oponente.
- **Corta Herald of Slaanesh**, que faz o comandante custar BR e atacar no turno em que entra.
- **Corta Mandate of Abaddon**, a remoção em massa que só atinge o outro lado.
- **Corta Spikefield Hazard** como se fosse mágica. É fonte de terreno.
- **Corta Redirect Lightning e Untimely Malfunction**, duas das proteções que preservam marcadores.
- **Tira três Demônios e não põe nenhum.**
- **Recomenda Blood Artist, Falkenrath Noble, Syr Konrad e Mayhem Devil** num deck sem saída de sacrifício, e **Animate Dead, Reanimate e Victimize** para um comandante que volta pela zona de comando.
- **Recomenda Kaervek** (7 manas) e **Vial Smasher** (dispara no turno do dono).
- **"Boa quantidade de pingers" e nota de 8,0 para 9,0+**, sem contagem e sem método.

**O que nenhuma das duas viu**

- O gatilho satura: mais dano direto não vira mais marcador.
- A armadilha Vilis + Spiteful Visions.
- O manto da Lightning Greaves travando quatro cartas da própria lista.
- Três das cinco remoções em massa matam o Valgavoth.
