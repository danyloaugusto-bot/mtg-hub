# Confronto das análises de fora: Leonardo, the Balance + Michelangelo, the Heart

13/10/2026. Três fontes, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial da carta (Scryfall, conferido para as 93 linhas da lista e para as 76 cartas que as fontes sugerem de fora) e as regras.

| Sigla | Arquivo | Observação |
|---|---|---|
| A | `Handover_TMNT_Leonardo_Michelangelo_V2.md` e `TMNT_..._Dashboard_V2_Auditoria.xlsx` | Auditoria estrutural, sem nenhuma troca proposta. Plano "+1/+1 e fichas, com o tribal TMNT como identidade". |
| B | `analise-claude-tmnt.md`, `Handover_TMNT_Analise_de_Deck.md` e `lista_nova_tmnt.txt` | Claude, 13/10/2026. A mais completa: texto de todas as cartas, nota carta a carta, simulação de cor e uma reconstrução de 41 saídas e 47 entradas, com base de mana. |
| C | `Análise Aprofundada — tartarugas.md` | Outra IA, sem lista exata de trocas: um ranking de entradas e cortes por grupo. |

## A lista

`decklist.txt` é a lista do dono, com edição, número e foil. O `lista_nova_tmnt.txt` é a lista proposta por B: fica em `entrada/` como referência, não como o deck.

Confere: 100 cartas em 93 linhas, dois comandantes, só básicos repetidos (3 Forest, 3 Plains, 2 Island, 2 Mountain, 2 Swamp), todas reconhecidas no Scryfall pela edição e número da lista. 26 foils, entre eles os 12 básicos. 34 cartas de terreno, 12 delas básicos. Nenhum Game Changer. CMC médio das não-terreno 3,30.

**Os dois comandantes.** Os dois têm "Partner—Character select", que só pareia com outra carta da mesma variante. A identidade de cinco cores vem do Leonardo: a habilidade {W}{U}{B}{R}{G} está no texto dele. O Michelangelo é verde. O motor hoje lê só a primeira linha como comandante e confere a identidade só por ela: precisa aprender a ler os dois.

## O que o dono disse (consta em B)

- Cinco cores, temático das Tartarugas; os temas possíveis são +1/+1, Turtles e fichas.
- Quer um deck "minimamente competitivo", que, se não vencer, chegue perto, com várias respostas e várias formas de vencer.
- Acha que o início do jogo é ter acesso às cores.
- Respostas a B: sem se preocupar com bracket; aceita Game Changers que façam sentido; pode reconstruir, mas dificilmente foge do tema; nenhuma carta protegida; aprovou os oito eixos e as três fases.

## Onde as três concordam

- O motor é o Leonardo: ficha sua entra, marcador em cada criatura sua, **uma vez por turno**. Qualquer ficha serve (Food, Treasure, Clue, Mutagen).
- O Michelangelo é o parceiro certo pelo custo: a Food da segunda fase principal aciona o Leonardo em todo turno seu em que você atacou.
- Faltam multiplicadores baratos: Hardened Scales e Branching Evolution aparecem em B e C; A pede para "conferir a eficiência" das peças de marcador.
- Falta proteção para os comandantes e para a mesa. Heroic Intervention, Teferi's Protection e Inspiring Call aparecem em B e C.
- A base de mana de cinco cores é o ponto fraco do início. Farseek, Nature's Lore, Three Visits e triomes aparecem em B e C.

## Onde divergem, carta a carta

| Ponto | A | B | C | O que sigo |
|---|---|---|---|---|
| Limpezas simétricas (Blasphemous Act, Supreme Verdict, Vanquish the Horde, Game Over) | "úteis, exigem plano de reconstrução" | as quatro saem | ficam: limpa e reconstrói com a Ozolith | **B.** O deck ganha por largura e cada uma apaga o próprio investimento. A Ozolith guarda os marcadores, mas devolve todos numa criatura só, no seu combate. |
| Dobradores de ficha (Parallel Lives, Anointed Procession, Academy Manufactor) | não cita | fora: o Leonardo só conta uma vez por turno | prioridade alta | **B.** Dobrar ficha no mesmo turno não rende gatilho a mais. Doubling Season fica pela metade dos marcadores. |
| Fichas baratas (Secure the Wastes, Raise the Alarm, Lingering Souls, Elspeth) | não cita | não cita; prefere ficha no turno dos oponentes | prioridade alta | **B, com ressalva.** O que falta é ficha **fora do seu turno**: Smothering Tithe, April O'Neil, Human Element, Mona Lisa, Ever Adaptable, Ooze Spill, Tireless Provisioner com fetch. Secure the Wastes é instantânea e serve; Raise the Alarm também. Ficam como "avaliar". |
| Lightning Greaves, Swiftfoot Boots | não cita | não cita | "proteção mínima obrigatória" | **Avaliar.** Protegem o Leonardo contra remoção pontual por duas manas; a Greaves bloqueia o seu Saved by the Shell. |
| Fechamento | combate e as palavras do Leonardo | dano por marcador (Casey Jones, All Will Be One), golpe duplo | Craterhoof, Finale, Triumph of the Hordes | **B.** Casey e All Will Be One matam sem atacar. Triumph of the Hordes fica como "avaliar": com a mesa cheia de marcadores, o infectar mata num ataque. |
| Terrenos | 33 (errado: são 34) e "testar 35 a 36" | 32, com seis básicos, dez fetches e shocks e cinco triomes | "mais fixing" | **Avaliar até o teste.** A conta de B é boa, mas 32 terrenos em cinco cores nunca foram embaralhados. Mesmo critério da Tergrid. |
| Techniques do set | não cita | ficam Shredder's, Splinter's, The Last Ronin's e New Generation's; saem Leonardo's e Raphael's | quase todas saem | **B.** Splinter's Technique é tutor; The Last Ronin's Technique é ficha instantânea; o sneak dá velocidade de instantânea. |
| Coin of Mastery, High Score | não cita | ficam (A) | saem: "pouco valor" | **B.** O Treasure da Coin é instantâneo: aciona o Leonardo no turno alheio. High Score é multiplicador e compra. |
| Wave Goodbye, Shellshock | não cita | ficam (A) | saem se faltar vaga | **B.** Wave Goodbye é quase unilateral aqui; Shellshock é remoção que cria ficha no turno alheio. |
| Trouble in Pairs | compra a avaliar | sai | "excelente" | **Avaliar.** Compra no turno dos outros, mas custa quatro e depende do que eles fazem. |
| Rhythm of the Wild | não cita | sai | "protege e dá ímpeto" | **B.** Só impede contramágica na conjuração; não protege nada em campo. |

## O que cada uma afirma que o texto desmente

**A**
- "Terrenos físicos: 33". São 34 (12 básicos e 22 não-básicos).
- "Três efeitos globais": são quatro limpezas. Faltou o Game Over.
- Ash Barrens e Fabled Passage como ramp. Acertam a cor, mas não aceleram: os dois trocam um terreno por outro.

**B**
- Double Jump // Flying Kick: "a base 5/5 apaga os marcadores do Leonardo". Não apaga. Pela ordem das camadas, os marcadores +1/+1 somam depois da força e resistência de base: a criatura vira 5/5 mais os marcadores. O corte de B ainda pode valer pela eficiência, mas o motivo está errado.
- "16 criaturas Turtle, fora os comandantes" e "10 na lista nova". São 17 e 11: faltou a Lita, Little Orphan Amphibian, que é Mutant Ninja Turtle.
- Nature's Lore e Three Visits "pegam triome desvirado". Buscam o terreno para o campo desvirado, mas o triome entra virado pelo próprio texto. Só o shock entra desvirado (pagando 2 de vida).
- Ash Barrens "um turno e uma mana para virar básico". O ciclo vai à mão, não ao campo; a carta continua sendo a sua jogada de terreno do turno.
- O resto confere, inclusive as leituras que importam: Casey Jones dispara uma vez por criatura que recebe marcador e causa esse tanto de dano; Coin of Mastery e The Ooze geram ficha em qualquer turno; Smothering Tithe dispara nas compras dos oponentes; Swift Demise só destrói criaturas que você não controla.

**C**
- Continue? como compra ("Continue?, High Score e Lessons from Life ajudam"). O Continue? devolve ao campo até quatro criaturas que morreram neste turno: é proteção contra limpeza, não compra.
- "Corpsejack + Ozolith começam a multiplicar". A Ozolith não multiplica: guarda os marcadores de quem sai e os passa a uma criatura no seu combate.
- "Rhythm of the Wild protege". Só impede contramágica nas suas criaturas e dá ímpeto ou marcador.
- "Drenagem via Foods se escalar Academy". Nenhuma carta da lista drena com Food.
- "Quase zero proteção": a lista tem Saved by the Shell, Continue? e The Ozolith. Pouca, mas não zero.

## O que nenhuma viu

- **Raphael, the Muscle dobra o dano do Casey Jones.** O texto dobra "todo dano que criaturas suas com marcador causariam", não só o de combate. O Casey é criatura e vai ter marcador do Leonardo: com os dois em campo, cada gatilho do Casey causa o dobro. Seis criaturas com quatro marcadores cada viram 48 de dano, não 24.
- **O Leonardo é opcional ("você pode").** Se você recusa o primeiro gatilho do turno, ainda pode usar o próximo: dá para esperar a criatura nova entrar antes de pôr os marcadores. É leitura do texto ("faça isso só uma vez por turno" limita o que você faz, não o gatilho).
- **Splinter, Radical Rat não dobra o Leonardo.** Pela mesma leitura, o segundo gatilho resolve, mas não pode pôr marcador de novo no mesmo turno. B deixou em aberto; o Splinter rende com o Raid do Michelangelo e com os outros Ninjas, não com o Leonardo.
- **Mikey & Leo e All Will Be One contam qualquer marcador**, não só +1/+1: o marcador de voar do Double Jump também compra uma carta com Mikey & Leo e causa dano com All Will Be One.
- **Sodden Verdure tem os tipos Forest e Island:** as fetches de B a buscam. B a cortou por entrar virada com poucos básicos, o que é verdade.

## Cartas sugeridas, conferidas no Scryfall

Todas existem, todas dentro de WUBRG, nenhuma banida. "Rocksteady, Mighty Mutanimals", citada por B no banco, não existe com esse nome no Scryfall e fica de fora. Game Changers entre as sugeridas: Smothering Tithe, Teferi's Protection, Cyclonic Rift e Rhystic Study (B), Worldly Tutor (C). As 47 entradas de B somam US$ 576 pelos preços do Scryfall, sem os seis shocks, que estão sem preço na impressão retornada.

Já estão em outros decks do dono (cópia física a conferir): Cyclonic Rift (Lynde), Smothering Tithe (Giada, Humanos, Queen), Teferi's Protection e Flawless Maneuver (Giada, Humanos), Swords to Plowshares (Queen), Marsh Flats (Clavileño), Verdant Catacombs (Strefan), Xander's Lounge (Lynde).
