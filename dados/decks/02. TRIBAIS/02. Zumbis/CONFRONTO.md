# Confronto das análises de fora: Wilhelt, the Rotcleaver

14/10/2026. Três fontes, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial do Scryfall, conferido para as 92 linhas da lista e para as 40 cartas que as fontes sugerem, e o Commander Spellbook para os combos.

| Sigla | Arquivo | Observação |
|---|---|---|
| A | `Handover_Wilhelt_Zombie_Tribal_V2_Deep_Review.md` e `Wilhelt_Zombie_Tribal_Dashboard_V2.xlsx` | Revisão V2: 9 trocas, sem partida. A planilha repete o handover. |
| B | `analise-claude-wilhelt.md`, `Handover_Wilhelt_Analise_de_Deck.md` e `lista_nova_wilhelt.txt` | Claude, 14/10/2026: 12 trocas, nos eixos do dono. |
| C | `analise - deck zumbis.glok.md` | Grok: 16 cortes e 14 entradas em três camadas, sem pares de troca. |

## A lista

Confere: 100 cartas em 92 linhas, só básicos repetidos (4 Island, 6 Swamp), todas reconhecidas no Scryfall, todas em azul e preto, nenhuma banida. 33 terrenos e o Malakir Rebirth, terreno no verso: 34 fontes. Sete terrenos entram sempre virados. Três Game Changers: Cyclonic Rift, Necropotence e Rhystic Study. 26 Zumbis fora a Wilhelt; Geralf, Ghoulcaller Gisa e Mirkwood Bats são as criaturas que não são Zumbi. CMC médio 3,25 sem terrenos.

**A comandante.** Sempre que outro Zumbi seu morre, **se ele não tinha decayed**, você cria um Zumbi 2/2 com decayed. No começo do seu passo final, você pode sacrificar um Zumbi para comprar uma carta. A e B leem certo: fichas comuns de Zumbi disparam a Wilhelt; só as decayed não disparam.

## Onde as três concordam

- Entram **The Scarab God** e **Lazotep Quarry**, as duas que o dono sugeriu, e **Death Baron**, **Cryptbreaker** e **Vengeful Dead**.
- Sai o **Midnight Clock**, e sai o **Liliana's Reaver** (B e C cortam; A troca pelo Grave Titan).
- Ficam os dois combos que já estão na lista: Gravecrawler com Phyrexian Altar e outro Zumbi (Spellbook 2577-4050) e Acererak com Rooftop Storm (1824-2452). A e B os protegem; C só corta o Acererak (veja abaixo).

## Onde divergem, carta a carta

| Ponto | A | B | C | O que sigo |
|---|---|---|---|---|
| Acererak the Archlich | fica: combo | fica: combo de duas cartas | sai: "muito lento" | **Fica.** Com a Rooftop Storm, vence sozinho (Spellbook 1824-2452). |
| Limpezas simétricas (Damnation, Living Death, Necrotic Hex) | ficam | saem as três; fica a Toxic Deluge | sai o Necrotic Hex | **B, em parte.** Saem o Necrotic Hex (sete manas, simétrico) e a Damnation. A Living Death vai a avaliar: devolve as criaturas dos oponentes, e a troca de B tem um problema de texto (abaixo). |
| Dictate of Erebos | sai pelo Accursed Marauder | fica | não cita | **Fica.** É a fase do meio que o dono descreveu: controlar a mesa tirando criaturas dos oponentes, e cada ficha decayed vira um edito. |
| Funeral Room // Awakening Hall | sai pelo Vengeful Dead | fica | sai | **A.** O dono prefere Zumbis a drenos genéricos por morte; o Vengeful Dead faz o mesmo dreno sendo Zumbi. |
| Lords | Death Baron | Death Baron, Cemetery Reaper e Lord of the Accursed | os três, na camada 1 | **B e C.** Com 3 lords, as fichas 2/2 não pressionam. |
| Skullclamp | não cita | entra | camada 1 | **Entra.** Não é Zumbi, mas é o tema 2 do dono: ficha que vira carta. |
| Grave Titan | entra | recusa: não é Zumbi | não cita | **Avaliar.** B aceita o Scarab God, que também não é Zumbi; o Titan cria Zumbis sem decayed, mas custa 6. |
| Roaming Throne | entra pelo Endless Ranks | não cita | camada 2 | **Avaliar.** Escolhendo Zombie, dobra a Wilhelt, o Captain, o Belcher e o Headless Rider, mas também as compras obrigatórias do Undead Augur. Custa 4. |
| Noxious Ghoul | lista de espera | entra pela Damnation | camada 1 | **A: avaliar** (veja o texto abaixo). |
| Base de mana | mantém | Watery Grave e Underground Sea no lugar de Lonely Sandbar e Myriad Landscape | não cita | **B.** Dual desvirada no lugar de terreno sempre virado. |
| Vaga da Lazotep Quarry | Hostile Hostel | Esper Panorama | Hostile Hostel | **B.** O Hostel ainda é saída de sacrifício; o Panorama só busca básico, e há só 10. |

## O que cada uma afirma que o texto oficial desmente

**A**
- Diz que as conjurações repetidas do Acererak disparam o Diregraf Colossus "se houver ao menos uma carta de criatura no cemitério". O gatilho de conjuração do Colossus não pede nada no cemitério; só os marcadores com que ele entra dependem dos Zumbis no cemitério.

**B**
- **Noxious Ghoul** "limpa só o lado deles". O −1/−1 vale para toda criatura que não é Zumbi, inclusive as suas: Geralf, Ghoulcaller Gisa, Mirkwood Bats e o The Scarab God que B mesmo põe. E se acumula: depois de um Army of the Damned, nenhuma delas sobra.
- **Zombie Apocalypse** é "a mesma recursão em massa, só para os seus Zumbis". O texto termina com "then destroy all Humans": Geralf e Ghoulcaller Gisa são Human Wizard e morrem.

**C**
- **Acererak** "muito lento": é metade de um combo de duas cartas que já está na lista.
- **Warren Soultrader** com o Gravecrawler "vira loop infinito de mana/treasure + dano". Cada sacrifício custa 1 de vida: o laço para na sua vida, a menos que algo devolva vida, como o Funeral Room. E não é novidade de 2026: é de 2024.
- **Midnight Reaper** compra "quando zumbis morrem (sinergia perfeita com Wilhelt)". Só compra por criatura **não-ficha**, e causa 1 de dano a você a cada vez: as fichas da Wilhelt não contam.
- **Lord of the Undead** como complemento: dá +1/+1 aos Zumbis de todos os jogadores (B viu).

## O que nenhuma viu

- **As compras obrigatórias nos laços.** O Undead Augur ("você compra e perde 1") e a Kindred Discovery ("compre uma carta") não têm "pode". No laço do Gravecrawler, cada volta compra uma carta pelo Augur, mais uma pela Discovery, e tira 1 de vida. No laço do Acererak, cada entrada dele compra pela Discovery, e cada ficha do Colossus também. Sem cuidado, os laços infinitos matam o próprio dono por grimório ou por vida antes dos oponentes. A linha certa é sacrificar o Augur antes de começar, ou fechar por um dreno que bata em todos (Plague Belcher, Vengeful Dead).
- **Necroduality com o Acererak.** A cópia do Acererak também volta à mão (e some, por ser ficha) e explora a masmorra: duas explorações por conjuração.
- **O Roaming Throne dobra o Augur também**: duas compras e 2 de vida por morte de Zumbi.
- **A conta do laço do Acererak.** Cada volta pela Lost Mine of Phandelver leva quatro conjurações, tira 1 de cada oponente (Dark Pool) e compra uma carta (Temple of Dumathoin). Com o Mirkwood Bats e o Colossus, são 5 de dreno por volta; sem eles, são cerca de 40 voltas e 40 compras para fechar uma mesa de 40 de vida.
