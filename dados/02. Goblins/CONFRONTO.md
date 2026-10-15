# Confronto das análises de fora: Krenko, Mob Boss

14/10/2026. Três fontes, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial do Scryfall, conferido para as 73 linhas da lista e para as 59 cartas que as fontes sugerem, a ruling do Krenko, e o Commander Spellbook para os combos.

| Sigla | Arquivo | Observação |
|---|---|---|
| A | `Handover_Krenko_Goblins_V3_Deep_Review.md` e `Krenko_Goblins_V3_Deep_Review.xlsx` | GPT, revisão V3 (a mais recente; a V2, `Handover_Krenko_Goblins_Deep_Review.md` e a planilha, fica como histórico). 25 trocas: as 15 da V2 e mais 10. Nota 6,0 → 9,2, sem partida. |
| B | `analise-claude-krenko.md` (versão 2), `Handover_Krenko_Analise_de_Deck.md`, `lista_forte_krenko.txt` e `lista_atalho_krenko.txt` | Claude, 14/10/2026: versão forte (29 trocas, nota 9) e atalho (10 trocas, nota 8); placar 306 → 376 / 344. |
| C | `Krenko_Mob_Boss_Analise.md` | Grok, versão "teto absoluto": cortes e entradas em listas de prioridade, sem pares de troca. |

## A lista

Confere: 100 cartas em 73 linhas, só a Mountain repetida (28, todas foil), todas reconhecidas no Scryfall, todas vermelhas, nenhuma banida, nenhum Game Changer.

- 32 terrenos, mais o Sundering Eruption, que tem verso de terreno. Path of Ancestry entra sempre virado; Den of the Bugbear, virado com dois outros terrenos.
- 29 criaturas fora o Krenko, 25 delas Goblins.
- Seis cartas dão ímpeto ao Krenko no turno em que ele entra: Goblin Warchief, Purphoros, Bronze-Blooded, Rising of the Day, Urabrask the Hidden, Enduring Courage e, pagando, o Battle Cry Goblin.
- CMC médio 3,03 sem terrenos.

**O comandante.** {2}{R}{R}, Goblin Guerreiro lendário 3/3. Vira: cria X fichas Goblin 1/1, X os Goblins que você controla. A ruling diz que conta todos os seus Goblins, o próprio Krenko inclusive. É Guerreiro, não Xamã: o Thornbite Staff não se prende a ele de graça (equipar {4}), como B lembra.

**O dono** quer um deck bem forte, meta 10, sem se importar com bracket, e sem cartas de estimação. Lacunas que ele viu: limpeza que poupa o lado dele, compra recorrente e em quantidade, respostas. Eixos dele: Ramp, Draw, Removal, Token, Combate + Dano Direto, Buff + Haste, Sinergia 1 e 2.

## Onde as três concordam

- **Skirk Prospector** entra (A, B e C): um Goblin de 1 mana que transforma fichas em mana.
- **Goblin Chieftain**, **Pashalik Mons** e **Lightning Greaves** entram (A, B e C).
- Falta compra: **Skullclamp**, **Idol of Oblivion**, **The One Ring** e **Goblin Ringleader** (A e B); wheels e Conspicuous Snoop (C, e o Snoop em B).
- Aceleração: **Sol Ring**, **Mana Vault** e **Ancient Tomb** (A e B), **Jeska's Will** (A e B).
- **Chaos Warp** entra como resposta (A, B e C).
- Saem **Boom // Bust**, **Worldfire**, **Nevinyrral's Disk**, **Lavabrink Floodgates** e **Izzet Chemister** (A e B; C também, quase todas).

## Onde divergem, carta a carta

| Ponto | A | B | C | O que sigo |
|---|---|---|---|---|
| Combo | fica fora da lista-base, "para não mudar a identidade sem avisar" | Thornbite Staff, Umbral Mantle, Staff of Domination, Phyrexian Altar, Goblin Sharpshooter | "infinitos leves" | **B**, no espírito do pedido (meta 10, sem bracket). E o Skirk sozinho já fecha laços com o que está na lista (ver abaixo). |
| Limpeza | Blasphemous Act (com o Eldrazi Monument), Vandalblast | Goblin Chainwhirler, Electrickery | Blasphemous Act | **B.** As duas só acertam o lado deles. O Blasphemous Act fica para avaliar: com o Monument em campo, os seus Goblins são indestrutíveis. |
| Respostas | Wild Magic Surge, Chaos Warp | Chaos Warp, Deflecting Swat, Abrade, Pyroblast | Deflecting Swat | **B.** O dono pediu respostas. |
| Gauntlet of Power | sai: "benefício simétrico" | fica: "dobra a mana do mono-red" | não trata | **B.** Com 28 Mountains, a mana extra é quase toda sua; só as Mountains dos oponentes também ganham. |
| Marvin, Murderous Mimic | fica | fica: "um segundo Krenko" | corta | **A e B.** Ele copia a habilidade do Krenko, e o deck tem seis fontes de ímpeto. |
| Wheel of Fate | sai, por Slate of Ancestry | sai | "Wheel of Fate / Reforge" como entrada | **A e B.** A wheel recarrega os três oponentes também. |
| Goblin Guide, Goblin Diplomats, Bedlam | saem (V2) | Guide fica; Diplomats e Bedlam saem | Bedlam sai | **Avaliar.** |
| Mana: Cavern of Souls e Three Tree City | entram, no lugar de duas Mountains | não trata (pergunta se pode trocar Mountains) | não trata | **Avaliar.** O dono não tem pets: as Mountains podem sair. |

## O que cada uma afirma que o texto oficial desmente

**A**
- Diz que a Mana Vault, "se ficar virada no início da manutenção, causa 1 de dano". O dano é no começo do passo de **compra**; na manutenção você só escolhe pagar {4} para desvirá-la.
- Diz que a Three Tree City "gera mana igual ao número de Goblins". Gera, mas pagando {2} e virando; sem isso, dá {C}.

**B**
- Nada que o texto desminta.

**C**
- Sugere **Dockside Extortionist** "se orçamento permitir". A carta é **banida** no Commander.
- Põe o **Blasphemous Act** como limpeza unilateral. Ele causa 13 de dano a cada criatura, inclusive a todos os seus Goblins.
- Sugere **Thrill of Possibility** e **Faithless Looting** "adicionais". Os dois já estão na lista.

## O que nenhuma viu

- **O Skirk Prospector fecha quatro laços com cartas que já estão na lista.** Com o Krenko e qualquer fonte de ímpeto, o laço é: o Krenko vira e cria fichas; o Skirk sacrifica o Krenko, que volta ao comando; as fichas sacrificadas pagam o Krenko de novo, com o imposto; ele entra com ímpeto e vira outra vez, com mais Goblins do que antes. Commander Spellbook: com o Goblin Warchief (38-659-1288), com o Rising of the Day (38-659-1879), com o Urabrask the Hidden (38-647-659) e com o Purphoros, Bronze-Blooded (38-659-3480). As três análises sugerem o Skirk só como ramp; nenhuma juntou com o ímpeto que já está no deck. Com o Goblin Bombardment da lista, cada Goblin sacrificado ainda causa 1 de dano.
- **Brash Taunter com Fiery Emancipation.** O Taunter é indestrutível e devolve a um oponente todo dano que recebe; com o Fiery, o dano é triplicado duas vezes. Com o Blasphemous Act do radar, são 13 × 3 = 39 no Taunter, e 39 × 3 = 117 no oponente.
