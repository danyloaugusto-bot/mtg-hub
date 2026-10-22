# Confronto das análises de fora: Lathril, Blade of the Elves

14/10/2026. Três fontes, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial da carta (Scryfall, conferido para as 84 linhas da lista e para as 38 cartas que as fontes sugerem de fora) e as regras.

| Sigla | Arquivo | Observação |
|---|---|---|
| A | `Handover_Lathril_Elves_V2_Deep_Review.md` e `Lathril_Elves_Dashboard_V2_Deep_Review.xlsx` | Revisão profunda V2, com 16 trocas e comparação com a lista otimizada da EDHREC. |
| B | `analise-claude-lathril.md`, `Handover_Lathril_Analise_de_Deck.md` e `lista_nova_lathril.txt` | Claude, 13/10/2026. Texto de todas as cartas, probabilidades e uma reconstrução de 23 trocas. |
| C | `Análise Lathril, Blade of the Elves.md` | Outra IA, sem lista exata de trocas. |

## A lista

`decklist.txt` é a lista do dono, com edição, número e foil. O `lista_nova_lathril.txt` é a proposta de B: fica em `entrada/` como referência.

Confere: 100 cartas em 84 linhas, uma comandante, só básicos repetidos (10 Forest, 8 Swamp), todas reconhecidas no Scryfall, todas em preto e verde, nenhuma banida. 29 terrenos e 4 cartas duplas com terreno no verso (Bridgeworks Battle, Disciple of Freyalise, Khalni Ambush, Revitalizing Repast): 33 fontes. Dois Game Changers: Bolas's Citadel e Seedborn Muse.

**A comandante.** {2}{B}{G}, 2/3 com ameaça. Dano de combate num jogador: esse tanto de fichas de Elfo Guerreiro 1/1. {T}, virar dez Elfos desvirados: cada oponente perde 10 e você ganha 10. Pela ruling, os dez podem ter acabado de entrar; a Lathril não conta entre eles e precisa estar em campo desde o começo do turno (ou ter ímpeto).

## O que o dono disse (consta em B)

- Elfos, tribo forte e famosa; forte em primeiro lugar, divertido em segundo.
- Não quer o Elfos comum: quer muitas fichas e interação com as entradas.
- Desvirar a Lathril é relevante.
- Plano: rampar rápido, descer muitos Elfos, pressionar e finalizar rápido.
- Os eixos são dele: Ramp, Draw, Removal, WinCon, Tokens, Untap + Sinergia, Buff, Ramp2.
- Sem cartas de estimação; pediu a reconstrução.

## Onde as três concordam

- A habilidade da Lathril é o que diferencia o deck; desvirá-la é o motor.
- Falta proteção: Heroic Intervention aparece nas três.
- Entram Elvish Warmaster, Skullclamp e Doubling Season (ou Parallel Lives); Quest for Renewal e Wirewood Symbiote em B e C; Dionus, Elvish Archdruid em A e B.
- Saem as cartas lentas que não giram a engrenagem: Lothlórien Blade, Return Upon the Tide, Trailblazer's Boots.

## Onde divergem, carta a carta

| Ponto | A | B | C | O que sigo |
|---|---|---|---|---|
| Overrun e Craterhoof | Overrun sai; Craterhoof fica | Overrun sai; Craterhoof fica como plano B, primeiro BAX | os dois ficam | **B.** O dono pediu para fugir do comum; o Craterhoof fica como reserva. |
| Primal Vigor | troca por Doubling Season | troca por Parallel Lives | fica | **A e B.** Dobra as fichas dos oponentes também. |
| Puppet Strings | sai | fica: desvira a Lathril | sai: lento | **B.** É um dos poucos desviradores da lista. |
| Limpezas (Crippling Fear, Kindred Dominance, Eyeblight Massacre) | ficam Crippling e Kindred; sai Eyeblight | saem Crippling e Kindred; fica Eyeblight | ficam | **Avaliar.** As três poupam Elfos; Kindred Dominance mata o Seedborn Muse, as outras duas não. |
| Ruthless Winnower | fica | sai: mata o Seedborn | não cita | **B.** Faz você sacrificar o Seedborn Muse e o Craterhoof, que não são Elfos. |
| Tutores (Chord of Calling, Finale of Devastation, Green Sun's Zenith) | entram dois, um opcional | não cita | não cita | **Radar.** Acham o Dionus, o Seedborn ou a peça de combo. |
| Illusionist's Bracers | não cita | entra: a Lathril drena 20 | não cita | **Radar, com o aviso de B.** Com o Seeker of Skybreak, desvirar infinito: bracket 4. |
| Gaea's Cradle | não cita | entra | não cita | **Avaliar.** Game Changer da Reserved List, US$ 1.635 no Scryfall. |

## O que cada uma afirma que o texto desmente

**A**
- Mirkwood Bats com "dois gatilhos diferentes" (dano igual ao número de oponentes ao criar fichas; perda de vida quando ficha sai). O texto oficial é um só: sempre que você cria ou sacrifica uma ficha, cada oponente perde 1. Ficha que morre em combate não conta.
- Harvest Season "precisa de criaturas viradas no combate". Conta qualquer criatura virada, inclusive os Elfos de mana que você acabou de virar.

**B**
- Crippling Fear "também mata o Seedborn". O Seedborn Muse é 2/4: com −3/−3, sobrevive com resistência 1. Quem mata o Seedborn é o Ruthless Winnower e o Kindred Dominance.
- Umbral Mantle "com 3 Elfos dá mana infinita". Com três, o laço empata: desvira e cresce sem fim, mas não sobra mana. Mana infinita pede um Elfo que gere quatro ou mais.
- Dionus "com qualquer desvirador: 10 de dreno a mais por desvirada". A Lathril também é Elfa e desvira com o Dionus: a segunda ativação sai sem desvirador nenhum. Da terceira em diante, os dez já usaram o gatilho do turno e ficam virados. A acerta: "this includes Lathril".
- O resto confere: a ruling da Lathril, o texto do Dionus (o Elfo desvira na primeira vez que vira no seu turno, uma vez por turno), o Bracers copiando a habilidade da Lathril, o Throne of the God-Pharaoh no seu fim de turno, o Primal Vigor simétrico.

**C**
- Trailblazer's Boots como proteção. Dá deslizar em terreno não-básico; não protege nada.
- Primal Vigor "já está, complementar com Doubling Season". Ignora que ele dobra as fichas dos oponentes.

## O que nenhuma viu

- **A Jaheira não dá mana com ficha recém-criada:** a habilidade dela é de {T}, e ficha com enjoo de invocação não vira. As que viram para mana também não pagam a Lathril.
- **O Ruthless Winnower também pega o Craterhoof Behemoth**, não só o Seedborn Muse.

## Cartas sugeridas, conferidas no Scryfall

Todas existem, todas em preto e verde ou incolores, nenhuma banida. Game Changers entre as sugeridas: Seedborn Muse (já na lista) e Gaea's Cradle. As caras: Gaea's Cradle (US$ 1.635), Parallel Lives (38), Finale of Devastation (35), Doubling Season (34), Green Sun's Zenith (31).
