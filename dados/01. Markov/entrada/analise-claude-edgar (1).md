# Análise final: Linhagem Markov (Edgar Markov)

Analista: Claude | Data: 15/10/2026 | Lista conferida por script: 100 cartas, 16 pets (com o comandante), nenhuma repetida | Cartas sem texto conferido: nenhuma. Texto conferido nesta conversa: 231 cartas no EDHREC e no Archidekt, mais 11 do cache v2.3; regras no Grimoria; combos no Commander Spellbook.

Versão final, revista na auditoria de 15/10/2026 (o que mudou está em `auditoria-edgar.md`). As notas são projeção sem partida.

## Nota de partida

| | Hoje | Forte | Atalho (10 trocas) |
|---|---|---|---|
| Nota | 6,5 | 8,5 (projetada) | 7,5 (projetada) |
| Placar | 436 | 464 | 456 |
| Game Changers | 3 | 6 | 3 |
| Bracket | 3 | 4 | 3 |

**A descoberta principal.** O deck gera muito bem e converte por poucos caminhos, e ainda chega atrasado. A eminência e os lordes fazem a horda. Mas a mana não tem nenhuma aceleração fora dos terrenos, e 8 dos 32 terrenos entram virados. Com isso, o Edgar de 6 manas, que é quem coroa a horda, chega tarde. E na hora de atravessar bloqueio a lista tem só três cartas: Cover of Darkness, Shared Animosity e Akroma's Will. Falta quem transforme cada atacante em dano mesmo bloqueado (Sanctum Seeker) e quem dobre os gatilhos de ataque (Isshin).

**A segunda descoberta veio de 2026.** Secrets of Strixhaven e Reality Fracture trouxeram Vampiros "preparados", que carregam uma mágica de reserva. O Emeritus of Woe é um Vampiro de 4 manas que entra com um Demonic Tutor pronto e o recarrega a cada turno com duas mortes, e não é Game Changer. O Stensian Sanguinist é um Vampiro de 2 manas que vira um Exsanguinate sempre que a horda conecta. Quase ninguém joga essas cartas no Edgar: o Emeritus está em 25% dos decks no EDHREC, e o Sanguinist fica abaixo do corte da lista (14% no edh.wiki).

**Como li o pedido.** Reconstrução forte. Você quer 10, pediu o melhor esforço e liberou Game Changers e combos. O plano A é a horda no combate, o plano B é o dreno com o combo do Vito, e a mesa é casual, de jogos longos. Vampiro previsível só entra quando não tem substituta à altura, e cada escolha vem com o motivo.

**Por que não 10.** São três tetos honestos:

- O Edgar custa 6, e metade do valor dele (os marcadores do ataque) só vem com ele em campo.
- 16 pets ocupam espaço, e três deles rendem pouco aqui: Cemetery Gatekeeper, Vampire Nocturnus e Lich-Knights' Conquest.
- A lista nunca foi embaralhada. A nota da forte é projeção até o teste das dez mãos.

## 1. Plano

### A leitura do Edgar

| Trecho | O que o texto diz | Regra oficial ou leitura | O que muda no deck |
|---|---|---|---|
| Eminência | "Whenever you cast another Vampire spell, if Edgar is in the command zone or on the battlefield, create a 1/1 black Vampire creature token." | Regra oficial (Grimoria): é gatilho, e o Edgar precisa estar na zona de comando ou em campo quando você conjura e de novo quando o gatilho resolve. Se ele troca de zona no meio, o gatilho não faz nada. Roaming Throne só dobra a eminência com o Edgar em campo (leitura minha: na zona de comando ele não é "creature you control"). | Do turno 1 em diante, cada Vampiro conjurado vale dois corpos. O Edgar não precisa ser conjurado para o motor andar. |
| "Cast" | Conjurar, não pôr. | Regra 16 do Mestre. | Não disparam: o que Descendants' Fury, Lich-Knights' Conquest e a Olivia, Crimson Bride põem em campo, as fichas da Elenda e a cópia preparada do Emeritus (é um feitiço). Disparam: changelings (Mirror Entity) e a loucura do Markov Baron. |
| "Another" | O próprio Edgar não conta. | Texto. | Conjurar o Edgar não gera ficha. |
| First strike, haste | Ataca no turno em que entra. | Texto. | Com 6 manas, ele entra e coroa a horda no mesmo turno. |
| Ataque | "Put a +1/+1 counter on each Vampire you control." | Texto. Isshin dobra (regra oficial: vale para gatilhos ligados a ataque), e Roaming Throne também. | Marcador é permanente: cada ataque é um reajuste que fica. |
| "If you control a commander" | Akroma's Will escolhe os dois modos se você controla um comandante. | Regra oficial 903.3d: controlar um comandante quer dizer tê-lo em campo. | Sem o Edgar em campo, a Akroma's Will escolhe um modo só. O modo do letal (voar e golpe duplo) não precisa dele. |

### A conta

**Conjurar, coroar, investir.** Cada Vampiro conjurado vale dois corpos. Cada lorde e cada ataque do Edgar somam +1 em todos eles.

Poder da horda ≈ 2N × (1 + L + k), onde N é o número de Vampiros conjurados, L o número de lordes e k o número de ataques do Edgar. No turno 6, com N = 7, L = 2 e k = 1, são 14 corpos de 4 de poder: 56 de dano potencial.

Em finanças, a eminência é uma bonificação em ações: cada compra vem com uma ação extra. O lorde e o ataque do Edgar são reajustes que incidem sobre a base inteira, bonificadas incluídas. Por isso o deck precisa de base larga cedo: o retorno de um lorde cresce com a base sobre a qual ele incide.

### Onde a lista trai o plano, em ordem de gravidade

1. **Mana.** Nenhuma aceleração fora dos terrenos, 8 terrenos que entram virados, e Temple of the False God e Valgavoth's Lair quase não pagam. O Edgar chega tarde, e com ele o coroar.
2. **A horda não atravessa.** Contra bloqueio, a lista só tem Cover of Darkness, Shared Animosity e Akroma's Will. Falta o dreno por atacante (Sanctum Seeker), quem dobre os gatilhos de ataque (Isshin) e quem torne o ataque seguro (Iroas).
3. **Limpeza que mata a própria horda.** O Toxic Deluge não poupa ninguém, e numa mesa casual a limpeza unilateral rende mais (Crippling Fear, Olivia's Wrath, Ruinous Ultimatum).
4. **Cartas que não entram na conta.** Descendants' Fury põe, não conjura. Bloodlord of Vaasgoth pede dano antes de você conjurar. O persist do Dusk Legion Sergeant só vale para Vampiros que não são ficha. Faithless Looting perde carta. Blood for the Blood God! e March of the Canonized custam caro pelo que dão.
5. **Akroma's Will com um modo só** enquanto o Edgar estiver na zona de comando (regra 903.3d). O modo de golpe duplo, que é o letal, funciona sozinho.

### As três fases

| Fase | Objetivo | Como | Cartas que decidem |
|---|---|---|---|
| Início (turnos 1 a 4) | Base larga: 6 a 8 corpos no turno 4 | Vampiro de 1 e 2 manas com a eminência da zona de comando; um motor de compra cedo | Indulgent Aristocrat, Legion Lieutenant, Cordial Vampire, Skullclamp, Welcoming Vampire, Sol Ring |
| Meio (turnos 5 a 7) | Coroar e converter | Lordes; Edgar com ímpeto; transformar fichas em cartas e cada ataque em dreno | Edgar, Stromkirk Captain, Captivating Vampire, Sanctum Seeker, Isshin, Emeritus of Woe, Pact of the Serpent |
| Fim (turno 7 em diante) | Fechar a mesa, não um jogador | Investida com pump ou cópia; dreno dobrado; o combo do Vito como reserva | Shared Animosity, Akroma's Will, Sanctum Seeker com Bloodletter e Isshin, Stensian Sanguinist, Vito + Conqueror |

**Mão inicial.** Fique com 2 a 4 terrenos, sendo duas cores desviradas, pelo menos um Vampiro de até 2 manas e um motor (Skullclamp, Welcoming Vampire ou um lorde). Faça mulligan com zero Vampiros de até 3 manas ou com um terreno só.

## 2. Agrupamentos

Você pediu agrupamentos definitivos; estes oito passam no crivo. Cada um mede uma função, eles se somam, cada um tem mais de seis cartas, e há eixo para proteção, que faltou em quase todos os decks até hoje.

| Eixo | O que mede | 3 é | Cartas com nota 2 ou 3 (hoje / forte / atalho) |
|---|---|---|---|
| Mana (MAN) | Ramp e fixação de cor | Sol Ring, Command Tower | 8 | 21 | 11 |
| Compra e busca (CMP) | Compra e busca | Skullclamp, Emeritus | 12 | 14 | 13 |
| Remoção (REM) | Remoção, pontual e em massa | Olivia's Wrath | 12 | 11 | 12 |
| Proteção (PRO) | Proteção da horda e do Edgar | Teferi's Protection | 3 | 4 | 3 |
| Eminência (EMI) | Eminência: corpos por mágica (Vampiro barato, ficha, dobrador) | Vampiro de 1 ou 2 manas, Anointed Procession | 30 | 29 | 29 |
| Coroação (COR) | Coroação: lordes e marcadores permanentes | Legion Lieutenant, Cordial Vampire | 14 | 15 | 16 |
| Investida (INV) | Investida: fechar em combate (evasão, pump de turno, dreno por atacante) | Shared Animosity, Sanctum Seeker | 11 | 11 | 14 |
| Banquete (BAN) | Banquete: sacrifício, dreno na morte, combo de reserva | Blood Artist, Vito | 12 | 12 | 12 |

O placar não ganha bônus de pet, porque esse bônus é do eixo Sinergia, que aqui não existe. Pets nunca saem, de qualquer forma.

## 3. Carta a carta

Notas de 0 a 3 por eixo. "EDHREC %" é a inclusão nos 51.835 decks do Edgar; "—" quer dizer abaixo do corte das listas, ou seja, rara. Ordem: tier, depois nome.

### Criaturas (37)

| Carta | MV | MAN | CMP | REM | PRO | EMI | COR | INV | BAN | Tier | Relev. | EDHREC % | Por quê, neste comandante |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Welcoming Vampire | 3 | 0 | 3 | 0 | 0 | 2 | 0 | 1 | 0 | S | INS | 73 | Uma carta por turno, porque toda eminência faz entrar um 1/1. |
| Baron Bertram Graywater | 4 | 0 | 2 | 0 | 0 | 2 | 0 | 0 | 2 | A | ALT | 26 | A primeira ficha do turno gera outra; a saída de sacrifício troca ficha por carta. |
| Blood Artist | 2 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | A | ALT | 82 | Vampiro de 2 que transforma bloqueio e limpeza em dreno; o plano B começa aqui. |
| Bloodline Keeper | 4 | 0 | 0 | 0 | 0 | 3 | 3 | 1 | 0 | A | ALT | 69 | Fábrica de 2/2 voadores; com cinco Vampiros vira lorde de +2/+2. |
| Bloodthirsty Conqueror | 5 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 3 | A | ALT | 50 | Metade do combo com o Vito (Spellbook 314-6191); sozinho, 5/5 voador com toque mortífero. |
| Captivating Vampire | 3 | 0 | 0 | 2 | 0 | 2 | 3 | 0 | 0 | A | ALT | 82 | Lorde de 3 e, com cinco Vampiros desvirados, rouba uma criatura por turno. |
| Cordial Vampire | 2 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 2 | A | ALT | 82 | Cada morte, de qualquer lado da mesa, é +1/+1 em todos os Vampiros. |
| Cruel Celebrant | 2 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | A | ALT | 63 | Cada morte sua drena cada oponente; mesa larga vira relógio. |
| Edgar, Charmed Groom | 4 | 0 | 0 | 0 | 0 | 1 | 3 | 0 | 1 | A | ALT | 55 | Lorde que, ao morrer, vira o caixão que fabrica Vampiros. |
| Elenda, the Dusk Rose | 4 | 0 | 0 | 0 | 0 | 1 | 2 | 1 | 3 | A | ALT | 58 | Cresce a cada morte e devolve o poder em fichas com vínculo vital. |
| Florian, Voldaren Scion | 3 | 0 | 3 | 0 | 0 | 2 | 0 | 1 | 0 | A | ALT | 20 | Depois do ataque, olha tantas cartas quanto a vida que a mesa perdeu. |
| Knight of the Ebon Legion | 1 | 0 | 0 | 0 | 0 | 3 | 1 | 1 | 0 | A | ALT | 31 | Vampiro de 1 que vira 4/5 com toque mortífero e cresce quando a mesa sangra. |
| Legion Lieutenant | 2 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 0 | A | ALT | 69 | Lorde de 2: o reajuste que incide sobre a base inteira desde o turno 2. |
| Markov Baron (pet) | 3 | 0 | 0 | 0 | 0 | 2 | 3 | 0 | 1 | A | ALT | 49 | Lorde com convocar: as fichas pagam o próprio lorde. |
| Mirror Entity | 3 | 0 | 0 | 0 | 0 | 2 | 0 | 3 | 0 | A | ALT | — | Changeling: dispara a eminência; no fim, X/X para a horda inteira. |
| Olivia Voldaren | 4 | 0 | 0 | 2 | 0 | 1 | 1 | 0 | 0 | A | ALT | 25 | Pinga criaturas e as torna Vampiros: remoção repetível que alimenta lordes. |
| Preacher of the Schism | 3 | 0 | 2 | 0 | 0 | 2 | 0 | 1 | 0 | A | ALT | 20 | Ataca e compra ou faz ficha; casa com a mesa casual. |
| Roaming Throne | 4 | 0 | 1 | 0 | 0 | 0 | 3 | 1 | 1 | A | ALT | 15 | Escolha Vampire: dobra os gatilhos dos Vampiros; com o Edgar em campo, eminência e ataque dobram. |
| Ruthless Lawbringer | 3 | 0 | 0 | 3 | 0 | 2 | 0 | 0 | 1 | A | ALT | 24 | Vampiro de 3 que troca uma ficha por qualquer permanente. |
| Stromkirk Captain | 3 | 0 | 0 | 0 | 0 | 2 | 3 | 1 | 0 | A | ALT | 74 | Lorde que dá iniciativa à horda inteira. |
| Vito, Thorn of the Dusk Rose (pet) | 3 | 0 | 0 | 0 | 0 | 2 | 0 | 2 | 3 | A | ALT | 65 | Peça do combo: qualquer perda de vida de um oponente, com o Conqueror em campo, vira laço infinito. |
| Clavileño, First of the Blessed (pet) | 3 | 0 | 1 | 0 | 0 | 2 | 0 | 1 | 1 | B | ALT | 52 | Cada ataque prepara um Demônio que, ao morrer, compra e deixa um 4/3 voador. |
| Drana and Linvala | 4 | 0 | 0 | 1 | 0 | 1 | 0 | 1 | 0 | B | MÉD | 23 | Voadora que desliga as habilidades ativadas das criaturas deles; boa, mas fora da conta. |
| Falkenrath Pit Fighter | 1 | 0 | 2 | 0 | 0 | 3 | 0 | 0 | 1 | B | MÉD | 20 | Vampiro de 1 para o turno 1; depois troca ficha e carta por duas cartas. |
| Gifted Aetherborn | 2 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 1 | B | MÉD | 18 | 2/3 com toque mortífero e vínculo; bom, mas genérico. |
| Mavren Fein, Dusk Apostle | 3 | 0 | 0 | 0 | 0 | 2 | 0 | 1 | 0 | B | MÉD | 43 | Ficha a cada ataque de Vampiro que não é ficha; com Isshin, duas. |
| Nighthawk Scavenger | 3 | 0 | 0 | 0 | 0 | 2 | 0 | 1 | 1 | B | MÉD | 19 | Voador forte, mas sem relação com a horda. |
| Olivia, Crimson Bride | 6 | 0 | 0 | 0 | 0 | 1 | 0 | 2 | 1 | B | MÉD | 20 | Seis manas que disputam o turno com o Edgar. |
| Vampire Nocturnus (pet) | 4 | 0 | 0 | 0 | 0 | 1 | 2 | 2 | 0 | B | MÉD | 17 | +2/+1 e voar quando o topo é preto: perto de metade das vezes. |
| Vampire Socialite | 2 | 0 | 0 | 0 | 0 | 3 | 2 | 0 | 0 | B | MÉD | 41 | Conjurada depois do combate, põe marcador em todos os Vampiros. |
| Vampire of the Dire Moon | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 1 | B | MÉD | 46 | Vampiro de 1 para a eminência do turno 1. Fica: a base larga cedo é a tese do deck. |
| Yahenni, Undying Partisan (pet) | 3 | 0 | 0 | 0 | 1 | 2 | 1 | 0 | 3 | B | ALT | 40 | Saída de sacrifício grátis que se protege. |
| Carmen, Cruel Skymarcher | 5 | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 2 | C | MÉD | 16 | Cinco manas para crescer com sacrifícios; o Edgar já coroa a tribo inteira. |
| Cemetery Gatekeeper (pet) | 2 | 0 | 0 | 0 | 0 | 3 | 0 | 1 | 0 | C | MÉD | — | Vampiro de 2 para a eminência. Nunca exile carta de criatura: ele também queima você. |
| Vito, Fanatic of Aclazotz | 4 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 2 | C | MÉD | — | Pede três sacrifícios no turno para render tudo. |
| Bloodlord of Vaasgoth | 5 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | D | BAX | — | Bloodthirst pede dano antes; você conjura antes do combate. Cinco manas por quase nada. |
| Dusk Legion Sergeant | 2 | 0 | 0 | 0 | 1 | 3 | 0 | 0 | 1 | D | BAX | — | Persist só em Vampiro que não é ficha, e o deck é feito de fichas. |

### Outras mágicas e artefatos (30)

| Carta | MV | MAN | CMP | REM | PRO | EMI | COR | INV | BAN | Tier | Relev. | EDHREC % | Por quê, neste comandante |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Shared Animosity | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | S | INS | 36 | Com doze atacantes, cada um ganha +11/+0. |
| Skullclamp | 1 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 1 | S | INS | 61 | Ficha 1/1 equipada morre e compra duas por {1}. |
| Akroma's Will | 4 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | 0 | A | ALT | 21 | O modo de voar e golpe duplo, que é o letal, não precisa do Edgar. Os dois modos juntos só com ele em campo (regra 903.3d). |
| Anguished Unmaking (pet) | 3 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | A | ALT | 42 | Exílio instantâneo de qualquer permanente não terreno. |
| Anointed Procession | 4 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | A | ALT | 27 | Dobra a eminência: cada Vampiro conjurado vira três corpos. |
| Banner of Kinship (pet) | 5 | 0 | 0 | 0 | 0 | 0 | 3 | 1 | 0 | A | ALT | 18 | Com oito Vampiros, +8/+8 permanente; só conta quem está em campo quando entra. |
| Bolas's Citadel (pet) | 6 | 1 | 3 | 0 | 0 | 0 | 0 | 0 | 1 | A | ALT | 20 | Curva baixa paga em vida; sacrificar dez permanentes é fechamento de mesa. |
| Coat of Arms | 5 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | A | ALT | 10 | Simétrico: numa mesa de tribais dá o mesmo bônus ao vizinho. Na auditoria, a pedra no lugar dela rendeu mais no motor. |
| Damn | 2 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | A | ALT | 29 | Remoção de 2 e, se precisar, limpeza de 4. |
| Deadly Dispute | 2 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 2 | A | ALT | 17 | Uma ficha da eminência vira duas cartas e um Tesouro. |
| Idol of Oblivion | 2 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | A | ALT | 15 | A eminência cria ficha todo turno, e o ídolo compra todo turno. |
| Kindred Charge | 6 | 0 | 0 | 0 | 0 | 2 | 0 | 3 | 0 | A | ALT | — | Seis manas por um turno de dano. Na auditoria, a pedra no lugar dela rendeu mais no motor. |
| Legion's Landing | 1 | 1 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | A | ALT | 17 | Ficha no turno 1 e terreno que fabrica Vampiros quando você ataca com três. |
| Necropotence | 3 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | A | ALT | 11 | Compra paga em vida, num deck que ganha vida com facilidade. |
| Olivia's Wrath | 5 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | A | ALT | 55 | Limpeza que poupa a tribo e escala com ela. Mata o Isshin (Humano) a partir de quatro Vampiros. |
| Pact of the Serpent | 3 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | A | ALT | 24 | Compra X cartas, X = Vampiros: com a horda, mão cheia. |
| Rite of Oblivion | 2 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 1 | A | ALT | — | Uma ficha paga o exílio, e a carta volta do cemitério. |
| Ruinous Ultimatum (pet) | 7 | 0 | 0 | 3 | 0 | 0 | 0 | 1 | 0 | A | ALT | 24 | Limpa só a mesa deles; exige RRWWWBB. |
| Teferi's Protection | 3 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | A | ALT | 31 | Atravessa a limpeza com o campo inteiro. |
| Chaos Warp | 3 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | B | MÉD | 8 | Responde qualquer permanente, em vermelho. |
| Cover of Darkness | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | B | MÉD | 11 | Medo para a tribo: só criatura preta ou artefato bloqueia. |
| Invasion of New Capenna | 2 | 0 | 0 | 2 | 0 | 0 | 2 | 1 | 1 | B | ALT | — | Remove com uma ficha; derrotada, vira equipamento que põe marcadores na tribo a cada ataque. |
| Lich-Knights' Conquest (pet) | 5 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 2 | B | MÉD | — | Fichas viram reanimação; põe, não conjura. |
| New Blood | 4 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | B | MÉD | 35 | Rouba e converte uma criatura, como feitiço de 4. |
| Your Temple Is Under Attack | 3 | 0 | 1 | 0 | 2 | 0 | 0 | 0 | 0 | B | MÉD | — | Indestrutível de 3 ou compra simétrica. |
| Blood for the Blood God! | 11 | 0 | 2 | 0 | 0 | 0 | 0 | 2 | 1 | C | BAX | — | Brilha só depois de uma limpeza; num deck que ataca, o desconto raramente chega. |
| Descendants' Fury | 4 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 | C | BAX | — | Põe no campo, então não dispara a eminência, e pede dano e sacrifício. |
| March of the Canonized | 2 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | C | BAX | 10 | X fichas por X+2: caro pelo que dá. |
| Toxic Deluge | 3 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | C | BAX | 11 | Mata a sua horda junto. No Clavileño é S porque lá a morte é o motor; aqui a horda é o capital. |
| Faithless Looting | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | D | BAX | — | Perde carta; só conversa com a loucura do Markov Baron. |

### Terrenos (31 nomes, 32 cartas)

| Carta | MV | MAN | CMP | REM | PRO | EMI | COR | INV | BAN | Tier | Relev. | EDHREC % | Por quê, neste comandante |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Command Tower (pet) | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | A | INS | 92 | As três cores, desvirada. |
| Arid Mesa (pet) | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | ALT | 30 | Busca o triome; na forte, também as três shocks. |
| Blightstep Pathway | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | — | B ou R, desvirada, uma face só. |
| Brightclimb Pathway | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | — | W ou B, desvirada, uma face só. |
| Dragonskull Summit | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | 42 | B ou R; desvirada com Swamp ou Mountain (o triome conta). |
| Exotic Orchard | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | 38 | Na mesa de quatro, quase sempre as três cores. |
| Fabled Passage (pet) | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | — | Básico virado até o quarto terreno. |
| Fetid Heath | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | 16 | Filtro W/B: precisa de mana colorida para render. |
| Fountainport | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | — | Incolor; no jogo longo, sacrifica ficha e compra. |
| Graven Cairns | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | — | Filtro B/R. |
| Luxury Suite | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | ALT | 34 | B ou R, desvirada na mesa de quatro. |
| Mountain | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | ALT | 89 | Básico (alvo dos fetches). |
| Needleverge Pathway | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | — | R ou W, desvirada, uma face só. |
| Nomad Outpost | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | 45 | As três cores, sempre virada. |
| Path of Ancestry | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | ALT | 61 | Qualquer cor, virada; vidência ao conjurar Vampiro. |
| Plains | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | ALT | 95 | Básico. |
| Savai Triome (pet) | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | ALT | 36 | As três cores, virada; tem os três tipos básicos para os fetches. |
| Secluded Courtyard | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | 42 | Qualquer cor só para criatura do tipo escolhido. |
| Swamp | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | ALT | 98 | Básico. |
| Temple of Silence | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | 19 | W/B virada, vidência 1; o par mais importante. |
| Unclaimed Territory | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | B | MÉD | 43 | Qualquer cor só para criatura do tipo escolhido. |
| Vault of the Archangel | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 2 | 1 | B | ALT | 33 | Toque mortífero e vínculo para todos; com o Vito, cada atacante drena. |
| Voldaren Estate | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | B | ALT | 58 | Qualquer cor para Vampiro; no fim, Sangue barato. |
| Crystal Grotto | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | C | BAX | — | Incolor, ou paga 1 para filtrar. |
| Rugged Prairie | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | C | MÉD | — | Filtro R/W: o par que o deck menos usa. |
| Shattered Landscape | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | C | BAX | — | Incolor, ou um básico virado: lento demais. |
| Temple of Malice | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | C | MÉD | 12 | B/R virada, vidência 1. |
| Temple of Triumph | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | C | BAX | — | R/W virada: o par menos usado. |
| Windbrisk Heights | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | C | MÉD | 7 | Virada; mágica grátis quando três atacam. |
| Temple of the False God | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | D | BAX | 8 | Só funciona com cinco terrenos, num deck de 32. |
| Valgavoth's Lair | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | D | BAX | — | Uma cor, sempre virada. |

## 4. Diagnóstico

| Medida | Hoje | Forte | Atalho | Faixa |
|---|---|---|---|---|
| Terrenos | 32 | 34 | 32 | 35 a 37 (abaixo de propósito: curva baixa e eminência da zona de comando) |
| CMC médio (sem terrenos) | 3.31 | 2.94 | 3.28 | |
| Terrenos que entram virados | 8 | 5 | 7 | |
| Ramp fora dos terrenos | 0 | 5 | 1 | 10 a 12 (o deck vive abaixo disso de propósito) |
| Compra e busca (nota 2+) | 12 | 14 | 13 | 10 a 12 |
| Remoção (nota 2+) | 12 | 11 | 12 | 8 a 12 |
| Remoção em massa / unilateral | 4 / 2 | 4 / 3 | 4 / 3 | 3 a 5 |
| Proteção (nota 2+) | 3 | 4 | 3 | |
| Mágicas de Vampiro (disparam a eminência) | 36 | 35 | 36 | |
| Vampiros de 1 e 2 manas | 11 | 14 | 11 | |
| Lordes | 8 | 7 | 8 | |
| Tiers S / A / B / C / D | 3/38/40/13/5 | 7/55/34/3/0 | 7/44/38/9/1 | Poucos S, zero D |
| Placar (pontos do CMC + aceleração, no teto de 90 + notas) | 436 | 464 | 456 | |

A aceleração bate no teto de 90 nas três versões, porque os terrenos contam no eixo Mana. Quem diferencia o placar são as notas. O placar também não mede a velocidade do motor; isso fica para a simulação da fatia 2.

### Gerar contra converter

| | Gera | Converte |
|---|---|---|
| Hoje | 36 mágicas de Vampiro com eminência, 8 lordes | 3 cartas de evasão ou pump de turno, nenhum dreno por atacante, combo de reserva sem busca |
| Forte | 35 mágicas de Vampiro, 7 lordes, Isshin dobrando o ataque | Sanctum Seeker, Bloodletter, Isshin, Stensian, Iroas, Shared Animosity, Akroma's Will, Mirror Entity; combo com três buscas, que apontam primeiro para o Seeker e o Bloodletter |

### Previsibilidade, medida

Régua: o percentual de inclusão no EDHREC. Mede presença, não força.

| Deck | Vampiros | Vampiros com 50% ou mais | Inclusão média dos Vampiros | Game Changers |
|---|---|---|---|---|
| Danylo hoje | 36 | 13 | 38% | 3 |
| Danylo forte | 35 | 15 | 42% | 6 |
| Danylo atalho | 36 | 15 | 42% | 3 |
| Beijo do Vampiro | 34 | 13 | 37% | 7 |
| JoeyDH (Archidekt) | 36 | 15 | 45% | 2 |
| WinterDragon (Moxfield) | 33 | 13 | 42% | 3 |

Sua lista de hoje já é a menos previsível do grupo. 36 cartas dela, fora os básicos, não aparecem em nenhum dos três decks. Na forte, a média dos Vampiros sobe de 38% para 42%, e isso é escolha minha: saem Vampiros raros mas fracos (Bloodlord, Sergeant, Vito Fanatic, Carmen) e entram duas peças sem substituta à altura (Sanctum Seeker e Indulgent Aristocrat). A assinatura do deck muda de lugar: passa a ser o que só este Edgar tem, Isshin, Iroas, Stensian, Emeritus, Scheming Silvertongue, Crippling Fear e Three Tree City. Na forte, 29 cartas não aparecem em nenhum dos três decks.

O Beijo do Vampiro, do seu amigo, é um Bracket 4 de sete Game Changers (Imperial Seal, Vampiric, Demonic, The One Ring, Necropotence, Citadel e Teferi's). Ele divide 35 cartas com a sua lista de hoje e 44 com a forte. A diferença de fundo: o Beijo busca peças, e a sua forte busca e também dobra o ataque.

### Combos

- **Vito, Thorn of the Dusk Rose + Bloodthirsty Conqueror** (Spellbook 314-6191). Com as duas em campo, qualquer perda de vida de um oponente (um ataque, um gatilho do Seeker ou do Blood Artist) começa o laço, e a mesa perde vida infinita. Já está na lista. Na forte, três buscas o encontram: Demonic, Vampiric e o Emeritus.
- Peças possíveis que recusei: Exquisite Blood (314-3966) e Sanguine Bond (690-6191). Com três buscas, uma terceira peça não acrescenta.
- **Brackets.** Hoje: Bracket 3, com 3 Game Changers e um combo de 8 manas que não é de começo de jogo. Forte: Bracket 4, com 6 Game Changers. Atalho: Bracket 3.

## 6. Trocas

Versão forte: 27 trocas em 6 camadas (a camada 5 entrou com a simulação da fatia 2, e a camada 6 com a auditoria, que também devolveu o Vampire of the Dire Moon ao deck). O atalho são as 10 marcadas, escolhidas para continuar no Bracket 3 (nenhum Game Changer novo). A fatia 2 mede o motor de cada versão e pode mexer no atalho.

**Camada 1. Mana no turno certo**

| Sai | Entra | No atalho | Por quê |
|---|---|---|---|
| Temple of the False God (D, EDHREC 8) | Blood Crypt (A, EDHREC 50) | sim | B/R desvirada (2 de vida) e alvo dos fetches. |
| Valgavoth's Lair (D, EDHREC —) | Godless Shrine (A, EDHREC 53) | sim | W/B desvirada, o par mais pedido pela lista. |
| Crystal Grotto (C, EDHREC —) | Sacred Foundry (A, EDHREC 44) | não | R/W desvirada e alvo dos fetches. |
| Temple of Triumph (C, EDHREC —) | Marsh Flats (A, EDHREC 34) | não | Busca Plains ou Swamp: acha as três shocks e o triome. |
| Temple of Malice (C, EDHREC 12) | Bloodstained Mire (A, EDHREC 36) | não | Busca Swamp ou Mountain: acha as três shocks e o triome. |
| Shattered Landscape (C, EDHREC —) | Three Tree City (A, EDHREC 30) | não | Escolha Vampire: com dez Vampiros, {2} vira dez manas de uma cor. |
| Faithless Looting (D, EDHREC —) | Sol Ring (S, EDHREC 92) | sim | Duas manas por uma: Edgar no turno 4. |
| Bloodlord of Vaasgoth (D, EDHREC —) | Arcane Signet (A, EDHREC 80) | não | Qualquer das três cores. |
| Descendants' Fury (C, EDHREC —) | Smothering Tithe (A, EDHREC 23) | não | Na mesa casual quase ninguém paga: Tesouro toda rodada. |

**Camada 2. A horda fecha o jogo**

| Sai | Entra | No atalho | Por quê |
|---|---|---|---|
| Vito, Fanatic of Aclazotz (C, EDHREC —) | Sanctum Seeker (S, EDHREC 68) | sim | Cada Vampiro que ataca tira 1 de cada oponente antes dos bloqueios; com Isshin, 2; com Isshin e Bloodletter, 4. |
| March of the Canonized (C, EDHREC 10) | Isshin, Two Heavens as One (S, EDHREC —) | sim | Dobra todo gatilho de ataque: marcadores do Edgar, dreno do Seeker, Shared Animosity, Preacher, Clavileño. É Humano: morre para o seu Olivia's Wrath. |
| Blood for the Blood God! (C, EDHREC —) | Iroas, God of Victory (A, EDHREC —) | não | Menace na horda e nenhum dano nos atacantes: atacar todo turno sai de graça. |
| Carmen, Cruel Skymarcher (C, EDHREC 16) | Bloodletter of Aclazotz (A, EDHREC 42) | sim | No seu turno, toda perda de vida dos oponentes dobra, combate e drenos incluídos. Com Seeker e Isshin, 4 de cada oponente por atacante. |
| Gifted Aetherborn (B, EDHREC 18) | Stensian Sanguinist (A, EDHREC —) | sim | Vampiro de 2 que vira um Exsanguinate em cada turno em que a horda conecta. |
| Toxic Deluge (C, EDHREC 11) | Crippling Fear (A, EDHREC —) | sim | Escolha Vampire: só as criaturas deles levam −3/−3. |

**Camada 3. Motor: compra e busca**

| Sai | Entra | No atalho | Por quê |
|---|---|---|---|
| Dusk Legion Sergeant (D, EDHREC —) | Indulgent Aristocrat (A, EDHREC 73) | sim | Vampiro de 1 que transforma qualquer ficha em +1/+1 para a tribo inteira. |
| Olivia, Crimson Bride (B, EDHREC 20) | Emeritus of Woe (S, EDHREC 25) | sim | Um Demonic Tutor ao entrar e outro a cada turno com duas mortes; não é Game Changer. |
| Nighthawk Scavenger (B, EDHREC 19) | Scheming Silvertongue (A, EDHREC 23) | não | Vampiro de 2 voador com vínculo; ganhando 2 de vida no turno, conjura Sign in Blood de novo. |
| New Blood (B, EDHREC 35) | Demonic Tutor (A, EDHREC 29) | não | Busca a peça que falta: Skullclamp, Shared Animosity, Isshin ou o combo. |
| Drana and Linvala (B, EDHREC 23) | Vampiric Tutor (A, EDHREC 29) | não | Busca instantânea de 1; põe no topo. |

**Camada 4. Proteção**

| Sai | Entra | No atalho | Por quê |
|---|---|---|---|
| Your Temple Is Under Attack (B, EDHREC —) | Clever Concealment (A, EDHREC 8) | não | Tira de fase o seu campo; com convocar, as fichas pagam quase tudo. |

**Camada 5. Base larga: mais terreno e Vampiro barato**

| Sai | Entra | No atalho | Por quê |
|---|---|---|---|
| Chaos Warp (B, EDHREC 8) | Bloodtithe Harvester (A, EDHREC —) | não | Remoção que também é Vampiro de 2 e dispara a eminência. |
| Mavren Fein, Dusk Apostle (B, EDHREC 43) | Voldaren Epicure (B, EDHREC 15) | não | Vampiro de 1; o dano de entrada liga Socialite, Knight e Pit Fighter no mesmo turno. |
| Idol of Oblivion (A, EDHREC 15) | Cavern of Souls (A, EDHREC 34) | não | Qualquer cor para Vampiro, sem contramágica. |
| Cover of Darkness (B, EDHREC 11) | Vault of Champions (A, EDHREC 36) | não | W/B desvirada na mesa de quatro. |

**Camada 6. Mana medida na auditoria**

| Sai | Entra | No atalho | Por quê |
|---|---|---|---|
| Coat of Arms (A, EDHREC 10) | Talisman of Hierarchy (B, EDHREC 32) | não | Pedra de 2 que faz W ou B (1 de dano) ou incolor: Edgar um turno antes. |
| Kindred Charge (A, EDHREC —) | Talisman of Indulgence (B, EDHREC 24) | não | Pedra de 2 que faz B ou R (1 de dano) ou incolor: Edgar um turno antes. |

### Banco (entram se você quiser outra cara)

| Carta | Por quê | EDHREC % |
|---|---|---|
| Vampires' Vengeance | Instantânea de 3: 2 de dano em tudo que não é Vampiro. A limpeza unilateral mais barata da tribo. | 7 |
| Lethal Scheme | Remoção instantânea paga por fichas (convocar), e cada ficha que pagou conspira. | — |
| Bloodline Recollector | Reality Fracture: Vampiro de 2 que vira Ancestral Craving (compra 3) a cada fim de turno com três mortes. | 5 |
| Oathsworn Vampire | Volta do cemitério para ser conjurado de novo quando você ganhou vida: eminência repetível. | 21 |
| Door of Destinies | Cresce a cada mágica de Vampiro, o mesmo evento da eminência. | — |
| Taunt from the Rampart | Uma rodada sem bloqueadores na mesa inteira: letal com a horda. | — |
| Enlightened Tutor | Busca Skullclamp, Shared Animosity, Anointed Procession ou Necropotence (Game Changer). | 12 |
| Changeling Outcast | Changeling de 1 mana que não pode ser bloqueado: dispara a eminência e carrega os marcadores. | — |
| Dusk Legion Duelist | Compra quando recebe marcador: cada ataque do Edgar vira carta. | — |

### Recusadas

| Carta | Por quê |
|---|---|
| Champion of Dusk | Compra e perde X obrigatoriamente; com 15 Vampiros, 15 de vida de uma vez. |
| Charismatic Conqueror, Viscera Seer, Master of Dark Rites, Malakir Bloodwitch, Twilight Prophet | Previsíveis (46% a 61%) e com substituta melhor na lista ou na forte. |
| Vein Ripper, Patron of the Vein, Necropolis Regent, Crossway Troublemakers | Seis manas disputando o turno com o Edgar. |
| Mondrak, Glory Dominus e Ojer Taq | Dobram fichas como o Anointed Procession, mas não são Vampiros nem disparam a eminência. |
| Maskwood Nexus | Quatro manas para tornar Vampiro o que já quase todo é. |
| The One Ring e Mox Diamond | Game Changers fortes, mas o deck já compra demais, e a Mox custa uma carta num jogo longo. |
| Exquisite Blood e Sanguine Bond | Terceira peça de combo; as buscas já acham o Vito e o Conqueror. |
| Bloodline Bidding e Kindred Judgment | Oito e sete manas; a primeira põe, não conjura. |
| Toxic Deluge (sai) | Mata a horda junto. No Clavileño é S porque lá a morte é o motor; aqui a horda é o capital. |
| Edgar, Ancient Bloodlord | Proposto na fatia 1. A auditoria mediu e ele rende menos que o Vampire of the Dire Moon, que ele tirava; é um B que entrava pelo nome. |
| Coat of Arms e Kindred Charge (saem) | Finalizadores que a simulação troca com vantagem por duas pedras de mana. O Coat ainda é simétrico numa mesa de tribais. |

## 8a. Dúvidas do diagnóstico

- A Akroma's Will com um modo só, com o Edgar na zona de comando, é regra oficial (903.3d), conferida na auditoria.
- O Roaming Throne não dobra a eminência com o Edgar na zona de comando. Também é leitura minha, pelo texto "another creature you control".
- Cemetery Gatekeeper (pet): nunca exile carta de criatura, terreno ou feitiço. Exile instantâneo ou planeswalker de um oponente.
- A previsibilidade usa a inclusão do EDHREC. Carta abaixo do corte das listas conta como zero.

# Parte 2: forte, atalho e motor

## Nota de chegada

| | Hoje | Forte | Atalho |
|---|---|---|---|
| Nota | 6,5 | 8,5 (projetada) | 7,5 (projetada) |
| Placar | 436 | 464 | 456 |
| Game Changers / Bracket | 3 / B3 | 6 / B4 | 3 / B3 |

**O gargalo medido é a mana, e a forte final ataca isso.** A lista de hoje põe o Edgar em campo até o turno 6 em 15% das partidas. A forte da outra conversa chegava a 32%; a forte final, com duas pedras no lugar de Coat of Arms e Kindred Charge, chega a 38%. A mesa morta até o turno 8 vai de 21% hoje para 49%.

**O placar caiu de 474 para 464, e isso não é perda.** O placar bate no teto de aceleração em todas as versões, então não enxerga mana nem turno. Duas pedras pontuam menos nos eixos que dois finalizadores, mas o motor medido melhora. A decisão foi tomada pela simulação.

## 4b. O motor, medido

Goldfish guloso, na jogada, sem mulligan e sem oponente, 20 mil partidas por versão. Joga terreno, pedras, o Edgar a partir do turno 4 se houver 6 manas com as três cores, e então os Vampiros do mais barato ao mais caro. Ataca com tudo. O relógio da mesa é o turno em que o dano somado passa de 120 (três oponentes com 40) ou em que o combo do Vito fica montado.

| Medida | Hoje | Forte | Atalho |
|---|---|---|---|
| Vampiros em campo no fim do turno 4 (média) | 2,6 | 3,4 | 2,9 |
| Edgar em campo até o turno 6 | 15% | 38% | 18% |
| Turno mediano do Edgar | 10 | 7 | 10 |
| Mesa morta até o turno 7 | 5% | 19% | 10% |
| Mesa morta até o turno 8 | 21% | 49% | 32% |
| Turno mediano do relógio | 10 | 9 | 9 |
| Cartas vistas até o turno 6 | 13,0 | 13,3 | 13,1 |
| Seeker e Bloodletter atacando com 8 Vampiros até o turno 8 | 0,0% | 2,9% | 0,4% |
| O mesmo com Isshin e 5 Vampiros até o turno 8 | 0,0% | 0,5% | 0,0% |
| Combo do Vito montado até o turno 8 | 0,4% | 0,7% | 0,3% |

**A razão do atalho.** Com 10 das 27 trocas, o atalho entrega 38% do ganho da forte na mesa morta até o turno 8, mas só 13% do ganho no Edgar até o turno 6. A diferença está na mana: o atalho leva Sol Ring e duas shocks; a forte leva também Signet, dois Talismans, Tithe, Three Tree City e dois terrenos a mais. Placar e motor divergem de novo, como nos vermelhos.

**Como conferi o simulador.** Rodei de novo os scripts da outra conversa e reproduzi os números dela (Edgar até o turno 6 na forte: 32%; mesa morta até o turno 8: 44%). Depois, uma partida à mão da forte final, semente 7: Captivating Vampire no 3; Deadly Dispute e Blood Artist no 4; o Edgar no 5, atacando com quatro criaturas para 14 (cada Vampiro com o marcador do ataque e o +1 do lorde); Shared Animosity no 7, com oito atacantes. A ordem faz sentido.

**Hipóteses que pesam (o que o simulador não vê):**

- Não há bloqueadores. Iroas e o menace não aparecem nos números; o Sanctum Seeker aparece, e por isso pesa tanto.
- Remoção, proteção, limpeza e reanimação ficam na mão, porque no goldfish não há alvo. Por isso a simulação não sabe o valor do Coat of Arms numa mesa travada.
- A vida não é contada: Necropotence, Citadel, Pact of the Serpent, shocks e fetches saem de graça. Isso favorece um pouco a forte.
- Convocar (Markov Baron, Clever Concealment) não foi modelado, o que subestima um pouco hoje e a forte.
- Smothering Tithe rende 2 Tesouros por rodada. Necropotence rende 3 cartas por turno. O Citadel vale 1 carta por turno.
- As buscas vão primeiro para Sanctum Seeker, Bloodletter e Isshin, e só depois para Skullclamp e Shared Animosity.
- Poder e resistência das criaturas vêm de memória, porque o cache não traz esses números. Os que decidem foram conferidos na fonte: Sanctum Seeker 3/4, Isshin 3/4, Bloodletter 2/4.
- Filtros (Fetid Heath, Graven Cairns, Rugged Prairie) contam como dupla desvirada, o que favorece um pouco a lista de hoje.

## 5. Linhas de jogo

**Motores.**

- Eminência mais Anointed Procession: cada Vampiro conjurado vira três corpos.
- Skullclamp sem lorde em campo: {1} compra 2 com uma ficha. Com lorde, as fichas não morrem com +1/−1, e o Clamp passa a precisar de saída de sacrifício. Yahenni é a grátis; o Indulgent Aristocrat cobra {2}.
- Welcoming Vampire compra uma carta por turno, porque a eminência faz entrar ficha todo turno.
- Emeritus of Woe: um Demonic Tutor ao entrar e de novo no fim de qualquer turno em que duas criaturas morreram. A cópia é um feitiço, não um Vampiro: não dispara a eminência.

**Fechamentos, do mais barato ao mais caro.**

1. Sanctum Seeker com a horda atacando: cada Vampiro que ataca tira 1 de vida de cada oponente, antes dos bloqueios. Isshin ou Roaming Throne dobram; os dois juntos quadruplicam. O Bloodletter dobra toda perda de vida no seu turno. Seeker, Isshin e Bloodletter juntos: 4 de cada oponente por atacante; dez atacantes tiram 40 de cada um. É o teto do deck, não a rotina: as três peças juntas são raras até o turno 8. Mas apontar as buscas para o Seeker e o Bloodletter rendeu cerca de 3 pontos na mesa morta até o turno 8.
2. Shared Animosity com doze atacantes: +11/+0 em cada um, o dobro com Isshin.
3. Stensian Sanguinist: sempre que você ataca, uma criatura ganha toque mortífero; se ela causar dano de combate a um jogador, o Sanguinist fica preparado, e na segunda fase principal você conjura uma cópia de Exsanguinate com a mana que sobrar. Com Three Tree City e dez Vampiros, X passa de 10: 30 de vida na mesa, 60 com o Bloodletter.
4. Akroma's Will: o modo de voar e golpe duplo, que dobra o dano do turno, funciona sem o Edgar. Com o Edgar em campo você ganha também o segundo modo (vínculo, indestrutível e proteção), o que protege o ataque de uma resposta. Não segure a carta esperando o Edgar.
5. Plano B: Vito + Bloodthirsty Conqueror. Com os dois em campo, qualquer perda de vida de um oponente começa o laço. Busque quando o combate travar.

**Como fechar a mesa, não um jogador.** O Sanctum Seeker e o Exsanguinate atingem cada oponente, e o combate não. Ataque dividido só vale com Seeker ou Bloodletter em campo. Sem eles, concentre no jogador com mais vida, que é também o que liga o Preacher.

**O momento da jogada.**

- O Edgar entra no turno em que paga 6 com as três cores e ataca na hora (tem ímpeto), de preferência com quatro Vampiros para coroar. Antes disso, cada mana vai para Vampiro barato, porque a eminência já trabalha da zona de comando.
- Olivia's Wrath com o Isshin em campo mata o Isshin, que é Humano. Prefira o Crippling Fear (ele fica em 0/1) ou desça o Isshin depois da limpeza.
- Ordem das buscas: Sanctum Seeker, depois Bloodletter, depois Isshin. Skullclamp quando o motor de cartas parar. O combo do Vito quando o combate travar.

## 6b. O atalho

As 10 trocas marcadas, sem nenhum Game Changer novo:

- **Mana:** Blood Crypt, Godless Shrine e Sol Ring.
- **Conversão:** Sanctum Seeker, Isshin, Bloodletter, Stensian e Crippling Fear.
- **Motor:** Indulgent Aristocrat e Emeritus.

A outra conversa sugeria o Arcane Signet no lugar do Stensian. Medi: +0,8 pontos na mesa morta até o turno 8 e +2,3 no Edgar até o turno 6. É pouco para tirar a peça que só este deck tem, então o atalho fica como está.

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

**Moldura:** retrato oval com filete dourado para o Edgar na capa. **Motivo:** uma árvore genealógica que ganha um ramo para cada Vampiro do deck, com o Edgar no tronco e o Edgar noivo no primeiro galho.

## 8. Dúvidas

- **Fontes.** Texto das cartas no EDHREC e no Archidekt (cache v2.4); regras no Grimoria e, para a Akroma's Will, a regra 903.3d; combos no Commander Spellbook (314-6191, 110-6191, 690-6191, 314-3966); percentuais nos 51.835 decks do EDHREC, com a coleta marcada como parcial; precon de 2017 completo.
- **Leitura minha, não regra confirmada:** o Roaming Throne não dobra a eminência com o Edgar na zona de comando, pelo texto "another creature you control".
- **Pets que travam espaço.** Cemetery Gatekeeper, Vampire Nocturnus e Lich-Knights' Conquest rendem pouco aqui, e digo isso uma vez. Os três ficam. Se um dia você liberar um deles, a vaga vai para um Vampiro de 1 ou 2 manas.
- **Avaliações discutíveis.** Sanctum Seeker e Indulgent Aristocrat são previsíveis (68% e 73% no EDHREC); entraram porque não têm substituta à altura. O Smothering Tithe depende da mesa não pagar. O corte do Coat of Arms vem de um goldfish, que não vê mesa travada: se a sua mesa não tiver outras tribais, ele volta no lugar do Talisman of Indulgence.
- **A nota.** Os 8,5 e 7,5 são projeção sem partida. O teste das dez mãos decide.

**Teste das dez mãos (metas para a forte):**

- Pelo menos 3 Vampiros em campo no turno 4 em seis das dez mãos.
- Edgar em campo até o turno 6 em quatro das dez.
- Mesa morta, ou combo montado, até o turno 8 em cinco das dez.
- Nenhuma mão travada em dois terrenos no turno 4.
