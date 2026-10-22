# Confronto das análises de fora: Ezio Auditore da Firenze

14/10/2026. Três fontes, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial do Scryfall, conferido para as 85 linhas da lista e para as 65 cartas que as fontes sugerem, as rulings do Ezio, e o Commander Spellbook para os combos.

| Sigla | Arquivo | Observação |
|---|---|---|
| A | `Handover_Ezio_Auditore_Assassins_V1.md` e `Ezio_Auditore_Assassins_Dashboard_V1.xlsx` | GPT, revisão V1 com a proposta V2: 7 trocas, sem partida. |
| B | `analise-claude-ezio.md`, `Handover_Ezio_Analise_de_Deck.md` e `lista_nova_ezio.txt` | Claude, 14/10/2026: 9 trocas, nota 6 → 7, placar 207 → 258. |
| C | `Análise – Ezio Auditore da Firenze.grok1.md` | Grok: cortes e entradas em listas de prioridade, sem pares de troca. |

## A lista

Confere: 100 cartas em 85 linhas, só básicos repetidos (4 de cada), todas reconhecidas no Scryfall, nenhuma banida, nenhum Game Changer. 55 impressões da coleção Assassin's Creed, contando o comandante.

- **Identidade de cinco cores.** O Ezio custa {1}{B}, mas o texto pede {W}{U}{B}{R}{G}.
- **34 terrenos, 20 básicos.** Só o Path of Ancestry entra virado. Mas 13 terrenos não dão cor sozinhos, sem restrição:
  - as 8 Landscapes, que dão {C} ou se sacrificam por um básico virado;
  - Ash Barrens e Ominous Cemetery;
  - Abstergo Entertainment e Crystal Grotto, que filtram por {1};
  - o Secluded Courtyard, cuja mana colorida só vale para mágica de criatura do tipo escolhido.
- **Mana fora dos terrenos.** Haunted Screen e Crystal Skull são as únicas pedras. Three Tree Mascot filtra uma cor por turno.
- **22 criaturas fora o Ezio.** 14 são Assassinos, contando o Three Tree Mascot, que é changeling. CMC médio 2,91 sem terrenos.
- **Seis cartas com freerunning próprio:** Chain Assassination, Distract the Guards, Escape Detection, Monastery Raid, Petty Larceny e Restart Sequence.

**O comandante.** Ezio Auditore da Firenze é Human Assassin 3/2, com ameaça. Mágicas Assassino que você conjura têm freerunning {B}{B}. Ao causar dano de combate a um jogador, você pode pagar {W}{U}{B}{R}{G} se esse jogador tiver 10 de vida ou menos, e ele perde o jogo. As rulings de 05/07/2024 dizem duas coisas:
- a vida é checada quando o gatilho resolve; depois do pagamento, o jogador perde de qualquer jeito;
- o freerunning vale pelo resto do turno depois que um Assassino ou o comandante conectou, mesmo que ele saia de campo.

## Onde as três concordam

- O deck é tribal de Assassinos, forfun, e deve continuar com a cara da coleção.
- **A mana é o gargalo**, sobretudo para pagar o WUBRG da execução. Entram Sol Ring e Arcane Signet (A e B).
- Faltam Assassinos da coleção que conversam com o plano: **Basim Ibn Ishaq** e **Ezio, Blade of Vengeance** aparecem nas três.
- **Deflecting Palm** sai (A, B e C).
- O **Rest in Peace** trabalha contra o próprio deck (A e B; C não trata).

## Onde divergem, carta a carta

| Ponto | A | B | C | O que sigo |
|---|---|---|---|---|
| Rest in Peace | sai, por Altaïr | fica (pet assumido), mas "é a carta que mais trabalha contra o deck" | não trata | **Pergunta ao dono** (pets). Pelo texto, desliga oito cartas da lista (ver abaixo). |
| Casualties of War | sai, por Arcane Signet | fica | corta | **A.** Seis manas com {B}{B}{G}{G} num deck de cinco cores. |
| Primal Command | fica | sai, por Brotherhood Headquarters | corta | **B.** Feitiço de {G}{G} sem papel claro no plano. |
| Smoke Bomb | fica | sai: "desliga seus equipamentos" | não trata | **Fica para avaliar.** O efeito dura até a sua manutenção. Com lampejo, é a melhor resposta da lista a uma remoção no Ezio, e depois o deixa imbloqueável. |
| The Animus | fica | sai: "peça de um Altaïr que não está no deck" | não trata | **Fica para avaliar.** Ela funciona sozinha (ver os erros). |
| Crystal Skull | fica | fica | corta | **Fica.** 39 mágicas históricas: uns quatro topos em dez viram carta a mais; terreno, só histórico. |
| Mjölnir, Apple of Eden, Metallic Mimic, Three Tree Mascot, Haunted Screen | ficam | ficam | cortam | **A e B.** O Mascot é Assassino e filtra cor; a Haunted Screen é a única pedra de cinco cores; o Mjölnir leva a mesa aos 10. |
| Murder, Dead Weight | saem, por Basim e Sol Ring | ficam | Dead Weight sai | **Avaliar.** O deck tem 16 remoções no painel, contando Royal Assassin, Hunter's Bow e as Sagas; a referência é de 8 a 12. |
| Shanid, Tax Collector, Shay Cormac | ficam | saem, por Ezio Blade, Desmond e Achilles | Tax Collector sai | **B.** Não são Assassinos e perdem o freerunning. |
| Proteção | não trata | Swiftfoot Boots no banco | Greaves e Boots, Heroic Intervention, Teferi's Protection | **Boots, não Greaves.** O Greaves dá manto, que impede você de equipar a Brotherhood Regalia no Ezio. |
| Mana de cinco cores | Sol Ring, Arcane Signet | Command Tower, Arcane Signet, Chromatic Lantern, Sol Ring, Brotherhood Headquarters | Farseek, Nature's Lore, Three Visits, Dark Ritual | **B**, menos a Brotherhood Headquarters, que não paga o WUBRG. |

## O que cada uma afirma que o texto oficial desmente

**A**
- Nada que o texto desminta. A conta de 55 impressões da coleção confere (B diz 53).

**B**
- Diz que o Smoke Bomb "desliga os seus equipamentos e remoções enquanto estiver em campo". Ele é sacrificado na sua próxima manutenção, e tem lampejo: é proteção de uma rodada, e depois deixa uma criatura imbloqueável.
- Diz que The Animus é "peça de um Altaïr que não está no deck". Ela exila uma criatura lendária de **qualquer** cemitério, com marcador de memória, e transforma uma lendária sua numa cópia dela. Não precisa do Altaïr.
- Põe a Brotherhood Headquarters entre as trocas "de mana para o WUBRG". A mana colorida dela só vale para mágica Assassino, mágica com freerunning ou habilidade de fonte Assassino. B mesmo deduz que ela não paga o WUBRG, e mesmo assim a conta nessa troca.

**C**
- Diz que o Ezio está desprotegido, "sem Greaves/Boots". A lista tem Lavaspur Boots (ward {1}), Brotherhood Regalia (ward {2}), Hunter's Bow (ward {2}), Haystack, Smoke Bomb e Escape Detection.
- Sugere o Ramses "ou a versão ACR se existir", só como lord. O Ramses existe (Dominaria United Commander) e faz muito mais do que dar +1/+1: ver "O que nenhuma viu".
- Sugere Teferi's Protection sem dizer que é Game Changer.

## O que nenhuma viu

- **Ramses, Assassin Lord transforma a execução em vitória.** O texto diz: "Sempre que um jogador perde o jogo, se ele foi atacado neste turno por um Assassino seu, você vence o jogo." O Ezio é Assassino: com o Ramses em campo, a execução de um jogador vence a partida inteira. Vale também para qualquer jogador morto em combate por Assassinos. A combinação não está catalogada no Commander Spellbook; é leitura do texto. C cita o Ramses só como lord, e B o deixa no banco.
- **O Bayek dá duas chances de execução por combate.** No seu turno, outras criaturas históricas suas têm golpe duplo, e o Ezio é lendário. O dano de golpe primeiro pode levar o jogador aos 10; o dano normal dispara o gatilho de novo, já com a vida checada abaixo de 10.
- **O Rest in Peace desliga oito cartas da lista, não seis.** B lista Layla Hassan, Restart Sequence, o capítulo III da Revelations of Ezio, Bleeding Effect, The Aesir Escape Valhalla e Abstergo. Faltam:
  - The Animus, que não acha lendária no cemitério;
  - a volta do Adéwalé para a mão;
  - e, se entrar, a força do Desmond Miles, que conta Assassinos no cemitério.
- **13 terrenos não dão cor sozinhos.** As três falam de "base frágil", e nenhuma conta quantos terrenos não dão cor nenhuma. A Chromatic Lantern de B é a carta que mais conserta isso: com ela, as Landscapes viram fontes das cinco cores.
