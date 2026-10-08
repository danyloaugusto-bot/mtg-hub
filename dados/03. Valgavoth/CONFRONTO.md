# Confronto: Valgavoth

08/10/2026. Três análises de fora, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial da carta (Scryfall, conferido para as 100 cartas da lista e para as 49 recomendadas de fora) e o plano do deck.

| Sigla | Arquivo | Data | Observação |
|---|---|---|---|
| C | `Handover_Valgavoth_Claude.md` (v2) | 07/10/2026 | A mais recente e a mais completa. Substitui a v1, que não veio. Traz os oito agrupamentos e as três fases do dono. |
| A | `Handover_Valgavoth_Soul_Siege.md` e `Valgavoth_Soul_Siege_Dashboard.xlsx` | 06/10/2026 | O mesmo material em texto e em planilha. |
| B | `Handover_Valgavoth_Soul_Siege2.md` | 06/10/2026 | Curto, sem método. |

## A lista

A e a planilha contam 99 cartas. C conta 100. A diferença é uma carta: **Leechridden Swamp**, que está em C e falta em A. Sigo C, com 100 cartas. **Pendente: o dono confirma se a Leechridden Swamp está no deck.**

Nenhuma das três traz edição e número. A `decklist.txt` usa a impressão padrão do Scryfall até o dono informar as dele.

## Onde as três concordam

- O dano que vale é o que cai **no turno do oponente**: é o único que dá marcador e carta ao Valgavoth.
- Saem Ghoulish Impetus, Lord of the Void e Barbflare Gremlin.
- Entram Swiftfoot Boots e Harsh Mentor.

Concordância não prova nada; aqui as três estão certas pelo texto: Ghoulish Impetus incita, e o incitado bate num oponente que não está no próprio turno; Lord of the Void custa 7 e só faz algo quando já está conectando; o Barbflare Gremlin só funciona virado e dá mana a todos.

## Onde divergem, carta a carta

| Carta | A | B | C | Sigo | Por quê |
|---|---|---|---|---|---|
| Crypt Ghast | corta | — | fica | C | São 14 Swamps (12 básicos, Canyon Slough e Leechridden Swamp). "Whenever you tap a Swamp for mana, add an additional {B}." A corta e no mesmo texto diz que a mana está curta. |
| Thought Vessel | corta | — | fica | C | Pedra de 2 manas, num deck que precisa de aceleração cedo. |
| Massacre Wurm | corta | — | fica | C | O -2/-2 só atinge as criaturas dos oponentes. É uma das duas remoções em massa que poupam o Valgavoth. |
| Karazikar, the Eye Tyrant | corta, "6 mana" | — | fica | C | Custa {3}{B}{R}, cinco. O atacante incitado perde 1 de vida no próprio turno, o que dispara o Valgavoth. |
| Mai, Scornful Striker | fica | corta | fica | A e C | Duas manas, e quase todo oponente conjura uma mágica não-criatura no próprio turno. O custo para o dono é real e entra na avaliação. |
| Herald of Slaanesh | fica | corta | fica | A e C | "Demon spells you cast cost {2} less": o Valgavoth é Elder Demon, então o imposto de comandante cai 2 a cada conjuração. |
| Mandate of Abaddon | fica | corta | fica | A e C | Com o Valgavoth grande, destrói só criaturas menores que ele. |
| Rot-Curse Rakshasa | — | corta | fica | C | Demon de duas manas, num deck que quer mais Demônios. |
| Spikefield Hazard | — | corta | fica | C | É carta dupla com terreno no verso (Spikefield Cave). B a corta como se fosse mágica. |
| Redirect Lightning, Untimely Malfunction | — | corta | ficam | C | Proteções baratas que não devolvem o Valgavoth para a zona de comando: os marcadores ficam. |
| Vilis, Broker of Blood | corta | — | fica, com alerta | decido na avaliação | A armadilha com Spiteful Visions é real (ver abaixo). |
| Rampaging Ferocidon | fica | — | sai | decido na avaliação | Fonte de dano de 3 manas, mas desliga o ganho de vida de cinco cartas do dono. |
| Spinerock Knoll | corta | — | fica | decido na avaliação | Entra virado; a condição (7 de dano num oponente no turno) é alcançável com o Valgavoth grande. |
| Nuclear Fallout, Insatiable Avarice, Temple of the False God | cortam | — | cortam | A e C | — |

## O que o texto oficial desmente

**Em A**

- **Branching Evolution** tem identidade verde. Está fora das cores do deck.
- **Karazikar** custa 5, não 6.
- **Blood Speaker** é um Ogre Shaman, não um Demon. Busca Demônios, mas não soma na contagem da tribo nem no Liliana's Contract.
- **Forge of Heroes** põe um marcador só no comandante que entrou naquele turno: um +1/+1 por conjuração. É pouco para uma vaga de terreno incolor.
- **Shadowspear:** o vínculo com a vida não funciona com Sulfuric Vortex ("If a player would gain life, that player gains no life instead") nem com Rampaging Ferocidon ("Players can't gain life"), as duas da lista.
- A V2 de A tem **9 Demônios**, menos que os 10 de hoje, contra o pedido do dono.
- Notas 8,20 e 8,61 sem método declarado.

**Em B**

- **Spikefield Hazard** é fonte de terreno.
- **Kaervek the Merciless** custa sete. **Vial Smasher** dispara com a primeira mágica do dono ("Whenever you cast your first spell each turn"), no turno dele: não alimenta o Valgavoth.
- **Animate Dead, Reanimate, Victimize:** o Valgavoth volta pela zona de comando. Reanimar poupa imposto, mas não é o problema do deck.
- "Boa quantidade de pingers" e "de 8,0 para 9,0+" sem contagem nem método.

**Em C** (poucos, e menores)

- **Mogis, God of Slaughter** está entre as criaturas, mas só é criatura com devoção a preto e vermelho de 7 ou mais. Na maior parte do jogo é um encantamento indestrutível: remoção de criatura e as remoções em massa da lista não o tocam.
- **Blood Artist e Falkenrath Noble:** C diz que pagam por morte de criatura num deck sem saída de sacrifício. O texto dispara com qualquer morte, não só sacrifício. O motivo certo para ficarem de fora é outro: a morte precisa acontecer no turno do oponente para alimentar o Valgavoth, e isso é raro.
- As dúvidas da seção 9 de C estão resolvidas pelo Scryfall: o texto do Valgavoth confere; Mai custa {1}{B}; Redirect Lightning custa {R} mais 2 manas ou 5 de vida; Return the Favor é Spree a partir de {R}{R}; Sadistic Shell Game e Unholy Annex conferem.
- **Bloodletter of Aclazotz + Master of Cruelties**, marcado em C com ressalva: "that player's life total becomes 1" é perda de vida pela regra do jogo (definir o total de vida é ganhar ou perder a diferença), e o Bloodletter dobra perda de vida no turno do dono. Funciona. Conferido pela regra, não pelo texto de uma carta.

**Confirmado pelo texto, nas três ou só em C**

- **Vilis + Spiteful Visions matam o dono do deck.** "Whenever a player draws a card, this enchantment deals 1 damage to that player" e "Whenever you lose life, draw that many cards": os dois obrigatórios, o ciclo só para quando o dono morre ou o grimório acaba.
- **Lightning Greaves dá manto** ("shroud"): com ela equipada, Kaya's Ghostform, Not Dead After All, Malakir Rebirth e Mandate of Abaddon não miram o Valgavoth.
- **Bloodchief Ascension + Mindcrank** é combo: cada carta triturada tira 2 de vida, que tritura mais 2.
- **Bloodletter não dobra dano de comandante:** dobra a perda de vida, e o dano de comandante conta o dano causado.

## O que nenhuma viu

- **Orcish Bowmasters + Spiteful Visions.** O Bowmasters pune toda carta comprada "except the first one they draw in each of their draw steps", e o Spiteful Visions dá a cada oponente exatamente essa carta a mais, no turno dele. É dano garantido no turno certo, com um corpo que cresce. Custa cerca de US$ 45.
- **Mayhem Devil + Mogis.** "Whenever a player sacrifices a permanent, this creature deals 1 damage to any target." O oponente que sacrifica uma criatura para escapar do Mogis leva o dano do Devil, na manutenção dele. O dilema deixa de ter saída. Também pune os Tesouros do Descent into Avernus.
- **Demonic Covenant é Demon.** É um "Kindred Enchantment — Demon": o Herald reduz o custo, o Demonic Counsel o encontra, e ele conta como Demon de nome próprio para o Liliana's Contract.
- **Persistent Constrictor** dispara em toda manutenção de oponente, como o Roiling Vortex, e volta uma vez quando morre. B recomendou sem dizer por quê; C deixou de fora porque o eixo de dano já sobra. Merece estar no radar.
- **Commander's Plate** dá +3/+3 e proteção contra branco, azul e verde ao Valgavoth: Win Con direta para os 21, que é a lacuna que C mesmo aponta.
- **O gatilho satura**, e só C viu: com uma fonte de dano na fase de compra em campo, os três marcadores por rodada já estão garantidos. A recomendação de B, mais seis fontes de dano, compra pouco.
