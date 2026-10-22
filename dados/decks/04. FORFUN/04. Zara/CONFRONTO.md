# Confronto das análises de fora: Zara, Renegade Recruiter

14/10/2026. Quatro fontes, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial do Scryfall, conferido para as 82 linhas da lista e para as 66 cartas que as fontes sugerem, as rulings da Zara, e o Commander Spellbook para os combos.

| Sigla | Arquivo | Observação |
|---|---|---|
| A | `Handover_Zara_Renegade_Recruiter_Theft_Izzet_V1_Deep_Review.md` e `Zara_Renegade_Recruiter_Theft_Izzet_Dashboard_V1.xlsx` | Revisão V1 com a proposta V2: 13 trocas, nota 6,6 → 8,2, sem partida. |
| B | `analise-claude-zara.md`, `Handover_Zara_Analise_de_Deck.md` e `lista_nova_zara.txt` | Claude, 14/10/2026: 18 trocas em quatro camadas, nota 5 → 8, placar 194 → 244. |
| C | `Análise profunda – Zara (gpt).md` | GPT: o texto que acompanha a proposta A. Mesmas trocas. |
| D | `Análise profunda – Zara, Renegade grok.md` | Grok: cortes e entradas em listas de prioridade, sem pares de troca. |

## A lista

Confere: 100 cartas em 82 linhas, só básicos repetidos (12 Island e 8 Mountain, todos foil), todas reconhecidas no Scryfall, todas em azul e vermelho, nenhuma banida. Dois Game Changers: Cyclonic Rift e Rhystic Study.

- 31 terrenos, mais 3 cartas com verso de terreno (Glasspool Mimic, Silundi Vision, Kazuul's Fury).
- Cinco terrenos entram sempre virados: Izzet Boilerworks, Myriad Landscape, Temple of Epiphany, Vivid Crag e Vivid Creek. O Castle Vantress entra desvirado com uma Island.
- Cinco terrenos não geram cor: Desolate Lighthouse, Encroaching Wastes, Myriad Landscape (que busca básicos), Reliquary Tower e Temple of the False God.
- 6 pedras de mana: Sol Ring, Arcane Signet, Fellwar Stone, Izzet Signet, Talisman of Creativity e Midnight Clock.
- 11 criaturas fora a Zara. CMC médio 3,16 sem terrenos.

**A comandante.** {3}{U}{R}, Human Pirate 4/3, voa. Ao atacar, olha a mão do jogador defensor e pode pôr uma criatura de lá em campo sob seu controle, virada e atacando; essa criatura volta à mão do dono no começo da próxima etapa final. As rulings confirmam:

- a criatura **não foi declarada atacante**: gatilhos de "quando atacar" dela não disparam, e "não pode atacar" não a impede;
- ela é **posta**, não conjurada: os gatilhos de entrar disparam, os de conjurar não, e custo X vale 0;
- ela só volta se **ainda estiver em campo** quando o gatilho resolver. Sacrificada, vai ao cemitério do dono; piscada, volta como objeto novo e fica.

**O que a lista já tem contra a devolução.** Cópia (Clone, Glasspool Mimic, Fated Infatuation, Quasiduplicate, Sakashima's Will) e sacrifício (Fling, Kazuul's Fury, Grafted Identity, e a Flare of Duplication, quando a emprestada é vermelha). Nada repetível: cada uma é uso único.

## Onde as quatro concordam

- O deck é de roubo, e o valor da Zara está em **não devolver** o que ela empresta: copiar, sacrificar ou piscar antes da etapa final.
- O combo **Curiosity + Niv-Mizzet** é real (Spellbook 1089-2353 com o Parun e 1089-4971 com o Firemind). A, B e C mantêm; só D corta os dois Niv-Mizzets.
- **Agent of Treachery** entra (A, B e D).
- A base de mana precisa de terrenos duplos que entrem desvirados: Steam Vents, Sulfur Falls e Shivan Reef aparecem em A e B.
- O lado "Izzet de mágicas" (Firemind's Research, Goblin Electromancer, Parallel Thoughts, Sphinx of the Second Sun) é o que sai primeiro.

## Onde divergem, carta a carta

| Ponto | A / C | B | D | O que sigo |
|---|---|---|---|---|
| Sundial of the Infinite | entra: a peça do arquétipo | não trata | entra, prioridade máxima | **Entra.** Na etapa final, com a devolução na pilha, encerra o turno e exila o gatilho. Uma mana por ativação, repetível, e ainda salva o Alchemist's Gambit (ver abaixo). |
| Thassa e Conjurer's Closet | Closet entra; Thassa no banco | os dois entram | os dois, prioridade alta | **B.** São os conversores repetíveis: ordenados acima da devolução, piscam a emprestada e ela volta como objeto novo, sua. |
| Multiplicar a Zara | Port Razer | Helm of the Host, Strionic Resonator | Coercive Recruiter, combates extras | **A e B juntos.** O Port Razer desvira tudo e dá outro combate, e a Zara ataca de novo; o Helm faz uma Zara a mais por turno. Os dois juntos são combo (ver abaixo). |
| Proteção da Zara | não trata | Swiftfoot Boots | Lightning Greaves e Swiftfoot Boots | **Boots, não Greaves.** O Greaves dá shroud, que impede você de equipar o Helm ou piscar a Zara. |
| Saída de sacrifício repetível | nenhuma | Goblin Bombardment e Phyrexian Altar | "poucos sac outlets", sem nomear | **B.** Cada emprestada vira dano ou mana antes de voltar. |
| Roubo que fica | Bribery, Agent | Treachery, Gilded Drake, Control Magic, Agent | Agent, Insurrection, Mass Mutiny | **B**, com a Bribery para avaliar. |
| Nevinyrral's Disk e Blasphemous Act | ficam | saem: matam a Zara | não trata | **B no Disk; Blasphemous Act fica para avaliar.** O Disk mata a Zara e tudo o que você roubou com Aura; o Act também, mas é a única limpeza de criaturas da lista. |
| Smoke | sai | sai | sai | **Sai.** Trava você também, e o deck desvira a Zara e as emprestadas. |
| Alchemist's Gambit | sai, pela Sundial | fica | sai | **Fica, se a Sundial entrar.** Juntos, viram turno extra de 3 manas. |
| Niv-Mizzet, Parun e the Firemind | ficam | ficam | saem | **Ficam.** São o único combo compacto da lista, e o Firemind é foil (ver pets). |
| Archmage Emeritus | fica | fica (pet assumido) | sai | **Pergunta ao dono**: é foil, e é o "Izzet óbvio" que o irmão queria evitar. |
| Consuming Tide | sai, por Stormcarved Coast | fica (pet assumido) | não trata | **Pergunta ao dono**: é foil. |
| Mizzium Mortars, Supreme Will, Exclude | saem, por terrenos | ficam | Exclude sai | **Ficam por ora**: A corta mágica para pôr terreno sem dizer que é isso. O deck tem 31 terrenos e 3 versos; a conta é mana, não troca de mágica. |
| Agrupamentos | 8 por função (ramp, compra, roubo temporário, roubo permanente, cópia, interação, motor da Zara, finalizadores) | os do dono, com "Roubo que fica", "Conversão" e "Fechamento" | 8 por função, parecidos com A | Proposta no passo 3, a partir dos eixos do dono. |

## O que cada uma afirma que o texto oficial desmente

**A / C**
- Diz que o Port Razer, "quando causa dano de combate a um jogador pela primeira vez em cada turno, desvira as criaturas atacantes". O texto é "sempre que", e desvira **todas** as suas criaturas. O limite é outro: ele não pode atacar de novo um jogador que já atacou no turno. Numa mesa de quatro, são até três combates extras.
- Diz que a Flare of Duplication copia "mágicas que você controla, não quaisquer mágicas adversárias". A Flare copia **qualquer** instantânea ou feitiço, inclusive de oponente. Só o Increasing Vengeance exige que a mágica seja sua.
- Corta Mizzium Mortars, Supreme Will, Consuming Tide e Exclude para pôr terrenos, e conta isso como "troca", sem dizer que é corte de mágica para subir de 31 para 36 terrenos.

**B**
- Diz que o Wizard's Staff "não funciona" na Zara porque ela é Pirate, não Wizard. O Staff tem dois custos: **Equip Wizard {1}** e **Equip {3}**. Na Zara custa 3, e ela dispara duas vezes: duas criaturas por ataque.
- Diz que no Order of Succession "você escolhe o que pega". Escolhe, mas o jogador do outro lado escolhe uma das suas, e se a Zara for a sua única criatura, é ela que vai.

**D**
- Diz que a Zara está "quase sem proteção, sem Greaves/Boots ou evasão extra". Ela voa, e a lista tem o Clout of the Dominus: na Zara, +2/+2, shroud e ímpeto por uma mana.
- Diz que a lista "devolve tudo", "quase zero ferramentas de não devolver". Tem cinco cópias e quatro sacrifícios (ver "A lista"). E D manda cortar duas delas (Clone e Flare of Duplication).
- Põe o Coercive Recruiter entre as cinco cartas que "viram o deck". O gatilho dispara quando ele ou **outro Pirate** entra; a Zara já em campo não conta, e a emprestada só conta se for Pirate. Na prática é um Act of Treason de 5 manas em corpo 4/3, mais um quando a Zara volta do comando.
- Recomenda Glasses of Urza e Peek para ver mãos. A Zara já olha a mão do defensor ao atacar; o Telepathy, que a lista já tem, resolve a escolha de quem atacar.

## O que nenhuma viu

- **Sundial of the Infinite + Alchemist's Gambit.** Pelo custo normal (3 manas), o Gambit dá um turno extra e você perde no começo da etapa final dele. Com o gatilho de perder na pilha, a Sundial encerra o turno e o exila: turno extra por 3 manas, e a devolução da Zara exilada junto. A corta o Gambit justamente para pôr a Sundial.
- **Port Razer + Helm of the Host é combo** (Spellbook 1548-1692): combates infinitos. A propõe um, B propõe o outro, nenhuma junta os dois. Com a Zara, cada combate é mais um empréstimo.
- **O Clout of the Dominus dá shroud à Zara**, e shroud impede você também: depois dele, não dá para equipar Helm, Boots ou Staff nela, nem piscá-la com o Ghostly Flicker. A ordem é equipar primeiro e encantar por último. B põe Helm e Boots sem avisar.
- **Mirrormade copiando uma Aura de roubo.** O Mirrormade entra como cópia de Mind Control, Treachery ou Control Magic, e você escolhe o que ele encanta ao entrar, sem mirar (regra 303.4f): um roubo a mais que passa por hexproof. Copiando a Treachery, ainda desvira cinco terrenos.
