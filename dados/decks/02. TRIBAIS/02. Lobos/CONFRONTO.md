# Confronto das análises de fora: Tovolar, Dire Overlord

13/10/2026. Três fontes, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial da carta (Scryfall, conferido para as 86 linhas da lista e para as 45 cartas que as fontes sugerem de fora) e as regras.

| Sigla | Arquivo | Observação |
|---|---|---|
| A | `Handover_Tovolar_Werewolves_V1_Resgate.md` e `Tovolar_Werewolves_Dashboard_V1_Resgate.xlsx` | Mesmo autor. Nota carta a carta, oito agrupamentos e oito trocas propostas, nenhuma testada. |
| B | `analise-claude-tovolar.md`, `Handover_Tovolar_Analise_de_Deck.md` e `lista_nova_tovolar.txt` | Claude, 13/10/2026. A mais completa: texto de todas as cartas, regras de dia e noite, probabilidades e uma reconstrução de 32 trocas, 7 delas de terreno. |
| C | `Análise Criativa e Honesta — lobos.md` | Outra IA, sem lista exata de trocas: um ranking de entradas e cortes. |

## A lista

`decklist.txt` é a lista do dono, com edição, número e foil. O `lista_nova_tovolar.txt` é a lista proposta por B: fica em `entrada/` como referência, não como o deck.

Confere: 100 cartas em 86 linhas, um comandante, só básicos repetidos (9 Forest, 7 Mountain), todas reconhecidas no Scryfall, todas em vermelho e verde, nenhuma banida, nenhum Game Changer. 32 terrenos e 3 cartas duplas com terreno no verso (Bala Ged Recovery, Khalni Ambush, Turntimber Symbiosis): 35 fontes. Sete terrenos sempre entram virados.

**O comandante.** {1}{R}{G}, com Daybound. Nas duas faces: sempre que um Wolf ou Werewolf seu causa dano de combate a um jogador, você compra. Na sua manutenção, com três ou mais Wolves e Werewolves, vira noite e você pode transformar seus Human Werewolves. O verso tem {X}{R}{G}: +X/+0 e atropelar num Wolf ou Werewolf.

## O que o dono disse (consta em B)

- É um dos primeiros decks dele, inspirado na coleção de Vampiros e Lobisomens; achou que seria divertido e forte, e não ficou. Já pensou em desmontar.
- Escolheu salvar o Tovolar, em vez de desmontar.
- Nenhuma carta de estimação.
- Aprovou os oito eixos e as três fases de B.
- Ficou em aberto: reconstrução inteira ou só as trocas mais fortes; zero limpezas; Craterhoof ou Overwhelming Stampede; nome do painel.

## Onde as três concordam

- O comandante é bom; o deck é que gera corpo e não converte em dano nem em compra com regularidade.
- Fog, Moment's Peace e Spellbook saem; Bramblecrush perde para Beast Within; os pedregulhos de três manas (Gruul Cluestone, Decanter of Endless Water, Mystic Skull) perdem para ramp de duas.
- Avabruck Caretaker, Duskwatch Recruiter, Moonmist e The Great Henge aparecem em mais de uma fonte; Huntmaster of the Fells e Howlpack Resurgence em B e C.
- Immerwolf, Mayor of Avabruck, Kessig Naturalist, Tovolar's Huntmaster e Unnatural Growth são o núcleo.

## Onde divergem, carta a carta

| Ponto | A | B | C | O que sigo |
|---|---|---|---|---|
| Blasphemous Act e Savage Twister | fica uma limpeza | as duas saem | Blasphemous limpa e você reconstrói | **B.** O deck precisa de três lobos na manutenção, e a compra depende de lobo conectando. Depois da limpeza, nada conecta. |
| Gruul Charm | B, situacional | A: o primeiro modo é evasão em massa | sai: situacional | **B.** "Criaturas sem voar não podem bloquear" por duas manas é fechamento. |
| Halana and Alena | A: ímpeto ajuda a conectar | C BAX: não é lobo | não cita | **Meio-termo.** Não conta para a noite, mas dá ímpeto e marcadores a um lobo recém-conjurado, que conecta e compra no mesmo turno. |
| Lobos de uma mana (Snarling Wolf, Fearless Pup, Kessig Prowler) | B e C | ficam os dois melhores: garantem os três lobos | saem: corpos fracos | **B.** São fracos, mas são o que põe a noite no turno 3 ou 4. |
| Berserkers' Onslaught | B: cinco manas | A: golpe duplo compra duas por lobo | bom | **B.** Cada golpe é dano de combate separado: o Tovolar dispara duas vezes. |
| Compra fora do Tovolar | Beast Whisperer | Toski e Ohran Frostfang | não cita | **Os dois ao radar.** Toski e Ohran pagam pela mesma conexão do Tovolar; o Beast Whisperer paga por conjurar. Nenhum é lobo. |
| Tamanho da reconstrução | 8 trocas | 32 trocas | 10 a 12 trocas | **Pergunta ao dono**, como na Tergrid. |

## O que cada uma afirma que o texto desmente

**A**
- Moonmist "transforma Werewolves não-Humanos". Transforma Humans: vira os lobisomens antigos da face humana para a de lobo, e previne o dano de quem não é Wolf ou Werewolf.
- "Corrigir a contagem: adicionar uma carta à lista atual". A própria planilha diz 100 cartas, e são 100.
- Na planilha, Fearless Pup e Hollowhenge Overlord aparecem como Werewolf. São Wolf: contam do mesmo jeito para o Tovolar.
- Dire-Strain Rampage "com busca de terreno de vantagem". Quem busca é o dono da permanente destruída. Só vira ramp se você destruir o seu próprio terreno (dois básicos virados).

**B**
- Mayor of Avabruck virado "cria um lobo no fim de cada turno, inclusive no dos outros". O texto diz "no começo do **seu** fim de turno": um lobo por volta, não quatro.
- O resto confere, inclusive as leituras que importam: a compra vale nas duas faces; a noite pede três lobos no começo da manutenção (cláusula intervening-if); o Tovolar transforma só os lobisomens antigos, com face Human; golpe duplo compra duas vezes; Doors of Durin é artefato, não terreno. A leitura do Immerwolf travando a noite do seu lado vem do mtg.wiki e B a marcou como não confirmada.

**C**
- Werewolf Pack Leader como "Werewolf barato que transforma bem". Não tem verso: é Human Werewolf de uma face só.
- "Blasphemous Act limpa e você reconstrói fácil porque o draw é constante". A compra depende de lobo conectando: depois da limpeza, ela para.
- Gruul Charm "situacional". O primeiro modo tira todos os bloqueadores sem voar.

## O que nenhuma viu

- **Child of the Pack cria lobos em velocidade instantânea.** {2}{R}{G} sem restrição de feitiço: no fim do turno de um oponente, garante o terceiro lobo na sua manutenção.
- **Mágica conjurada no turno dos outros não conta para o dia e a noite.** Só conta o que o jogador ativo conjura. Lampejo (Spirit of the Hunt, Hollowhenge Overlord), a Child of the Pack e o +1 da Arlinn, the Pack's Hope põem lobo em campo sem empurrar a mesa para o dia.
- **Unnatural Growth dobra no começo de cada combate**, inclusive no dos oponentes: os seus bloqueadores também dobram.
- **Runebound Wolf também é instantâneo**: dano direto no fim do turno de quem estiver perto de morrer.

## Cartas sugeridas, conferidas no Scryfall

Todas existem, todas dentro de vermelho e verde, nenhuma banida, nenhum Game Changer (The Great Henge, Cavern of Souls e Craterhoof Behemoth não são). As 45 somam US$ 261; as mais caras são The Great Henge (US$ 66) e Cavern of Souls (US$ 51).

Já estão em outros decks: Beast Within (Fynn), Cavern of Souls (Giada e Clavileño), Rogue's Passage (Evelyn, Strefan, Ken e Queen), Relentless Assault (Ken), Shared Animosity (Evelyn), Rootbound Crag (Turtle Power!).
