# Confronto das análises de fora: Tergrid, God of Fright

13/10/2026. Três fontes, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial da carta (Scryfall, conferido para as 80 linhas da lista e para as 73 cartas que as fontes sugerem de fora) e as regras.

| Sigla | Arquivo | Observação |
|---|---|---|
| A | `Handover_Tergrid_V1.md` e `Tergrid_Dashboard_Analise_V1.xlsx` | Mesmo autor. Auditoria inicial da lista, com cinco trocas candidatas e nenhuma decisão. |
| B | `analise-claude-tergrid.md`, `Handover_Tergrid_Analise_de_Deck.md` e `lista_nova_tergrid.txt` | Claude, 13/10/2026. A mais completa: texto de todas as cartas, nota carta a carta, simulação de turno da Tergrid e uma reconstrução de 40 trocas, com base de mana. |
| C | `Análise Tergrid, God of Fright.md` | Outra IA, sem lista exata de trocas. Reaproveita a estrutura de uma análise de outro deck (cita "Markov Baron / Westgate Regent estilo", que são do Strefan). |

## A lista

`decklist.txt` saiu do `Tergrid.txt` do dono, que traz edição, número e foil de cada carta. O `lista_nova_tergrid.txt` é a lista proposta por B, sem edições: fica em `entrada/` como referência, não como o deck.

Confere: 100 cartas em 80 linhas, um comandante, só básicos repetidos (21 Swamp), todas pretas e reconhecidas no Scryfall pela edição e número da lista, inclusive as promocionais e da The List (PLST, PUMA, PZNR, PHOU). 29 foils. 33 cartas de terreno e uma carta dupla com terreno no verso (Pelakka Predation); Dark Depths não gera mana, então são 33 fontes de fato (o painel mostra 34, porque conta todo terreno). Nove terrenos só dão incolor. Um Game Changer: a própria Tergrid.

## O que o dono disse (consta em B)

- O deck vive de descarte e sacrifício alheio, de resiliência e de usar as permanentes dos oponentes para vencer.
- Quer equilíbrio entre a mesa dele, outras formas de vencer além da Tergrid e cartas de dupla função.
- As fases: no início, ler a mesa, ramp, política e criaturas pequenas; no meio, preparar a Tergrid; no fim, finalizar um ou dois jogadores sem pensar muito.
- Respostas a B: bracket máximo, deck otimizado ao máximo; "pode seguir com qualquer sugestão", ou seja, nenhuma carta de estimação e base de mana liberada; aprovou os eixos novos.

## Onde as três concordam

- O texto da Tergrid só paga quando um **oponente** sacrifica uma permanente **que não é ficha**, ou descarta uma carta **de permanente**. Ficha sacrificada e mágica descartada não rendem nada.
- Clackbridge Troll e Curse of the Cabal saem: o Troll dá Cabras aos oponentes, e eles sacrificam as Cabras.
- O núcleo fica: Waste Not, Geth's Grimoire, Dark Deal, Bottomless Pit, Smallpox, Rankle, Liliana of the Veil, Torment of Hailfire.
- Faltam motores que funcionem sem a Tergrid. Braids aparece nas três (A e C pedem a Arisen Nightmare; B, a Cabal Minion).
- Mindslicer aparece em A, B e C.

## Onde divergem, carta a carta

| Ponto | A | B | C | O que sigo |
|---|---|---|---|---|
| Plaguecrafter, Fleshbag Marauder, Demon's Disciple | Plaguecrafter no lugar do Troll | fora: o oponente entrega ficha | prioridade máxima | **B.** O oponente escolhe, e escolhe ficha. Accursed Marauder obriga criatura não-ficha pelo mesmo preço. |
| Elderfang Disciple, Burglar Rat, Virus Beetle | não cita | fora: descarte à escolha, sai mágica | prioridade máxima | **B.** O texto confirma "each opponent discards a card": eles escolhem. |
| Painful Quandary | candidata lenta | banco | motor "absurdo" | **Avaliar.** Pune quem conjura, mas o oponente escolhe descartar mágica ou perder 5. |
| Braids | Arisen Nightmare | Cabal Minion (Game Changer) | Arisen Nightmare | **Cabal Minion para o lock, com a ressalva de B.** A Arisen é você quem escolhe sacrificar, e o oponente sacrifica algo do mesmo tipo à escolha dele. |
| Política no início | mantém | sai: o deck vira o vilão | mantém | **Pergunta ao dono.** É a maior mudança de identidade da reconstrução de B. |
| Proteção (Fake Your Own Death, Feign Death, Supernatural Stamina, Not Dead After All, Commander's Plate) | mantém | fica só Not Dead After All | mantém duas ou três | **Duas ou três ficam.** B tira quatro de uma vez e põe só The One Ring. |
| Oppression | motor A/B | sai: pesa mais em você | não cita | **B, com ressalva.** Simétrico, e você conjura mais que eles. |
| Living Death | resiliência | sai: desfaz o roubo | resiliência | **B.** Você sacrifica as criaturas roubadas, e elas voltam ao cemitério do dono. |
| Tainted Aether | não cita | sai: cobra cada roubo | sinergia | **B.** A criatura que a Tergrid traz entra sob o seu controle, e quem a controla sacrifica. |
| Base de mana | validar antes de mexer | 32 fontes, Urborg, Cabal Coffers e cinco aceleradores de custo zero ou um | não cita | **Pergunta ao dono.** O dono liberou a base para B, mas 32 fontes nunca foram testadas. |
| Game Changers | não cita | 15 na lista nova | não cita | **Bracket 4 nas duas leituras.** Ver a pergunta da lista abaixo. |

## O que cada uma afirma que o texto desmente

**A**
- Pelakka Predation "não contar como terreno". Tem terreno no verso: é fonte de terreno, como em qualquer outro deck do projeto.
- Library of Leng como proteção de descarte. Põe o descarte no topo do grimório, só para os descartes que um efeito manda você fazer; não protege a mão.

**B**
- Curse of the Cabal: "dez manas, ou três voltas de espera". O texto tem mais uma linha: com a carta suspensa, cada jogador pode sacrificar uma permanente na própria manutenção para atrasar. É escolha deles, quase sempre uma ficha, então o veredito de B se mantém, mas a leitura estava incompleta.
- O resto confere, inclusive as leituras que importam: Dark Depths com Thespian's Stage fecha e com Vesuva não fecha (a cópia entra com os dez marcadores); Sheoldred, the Apocalypse com Peer into the Abyss mata o alvo; Living Death e Tainted Aether jogam contra o roubo; 15 Game Changers na lista nova, com a Braids, Cabal Minion entre eles.

**C**
- Cita "Markov Baron / Westgate Regent estilo", "Nullpriest / Lobelia estilo", "Stromkirk Occultist estilo", "High-Society Hunter estilo" e "Moonstone Eulogist estilo": são cartas do Strefan, de outra análise. Os cortes reais são outros.
- Põe Fraying Omnipotence e Death Cloud como condições de vitória. São limpezas simétricas que pegam você também.
- Cita "Voldaren-style rats", que não existem no texto de nenhuma carta da lista ou das sugestões.

## O que nenhuma viu

1. **15 das 40 entradas de B já estão em outros decks do dono**, quase todas no Vito: Necropotence, Bolas's Citadel, Cabal Coffers, Urborg, Demonic Tutor, Vampiric Tutor, Grim Tutor e Deadly Rollick; Ancient Tomb, Toxic Deluge e Castle Locthwain também no Strefan; Phyrexian Tower no Clavileño; The One Ring na Giada e no Queen; Archfiend of Depravity no Lynde; Reanimate no Strefan. Se forem as mesmas cópias, a reconstrução tira carta de outro deck. As 40 entradas somam cerca de US$ 1.760 no Scryfall, sem contar cinco cartas sem preço (Mox Diamond, Lotus Petal, Cabal Ritual, Mind Twist e Smokestack).
2. **Henrika Domnathi está em quatro decks**: Vito, Clavileño, Strefan (como estimação) e Tergrid.
3. **Cabal Stronghold conta só Pântanos básicos.** Urborg não muda a conta dela; muda a da Cabal Coffers.
4. **A Lantern é a outra face da Tergrid**, e pode ser conjurada da zona de comando no lugar dela: {3}{B}, e vira para fazer um jogador perder 3, a menos que sacrifique uma permanente não-terreno ou descarte. B citou a Lantern como plano B; ninguém contou que ela sai um turno antes da Tergrid.

## Cartas sugeridas, conferidas no Scryfall

As 73 cartas sugeridas por B e C são pretas ou incolores e legais no Commander. Game Changers entre elas: Ancient Tomb, Mana Vault, Grim Monolith, Chrome Mox, Mox Diamond, Necropotence, The One Ring, Bolas's Citadel, Demonic Tutor, Vampiric Tutor, Imperial Seal, Braids, Cabal Minion, Orcish Bowmasters e Opposition Agent.
