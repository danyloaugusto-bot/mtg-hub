# Confronto das análises de fora: K'rrik, Son of Yawgmoth

14/10/2026. Três fontes, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial e as rulings do Scryfall, conferidos para as 76 linhas da lista e para as 46 cartas que as fontes sugerem, e o Commander Spellbook para os combos.

| Sigla | Arquivo | Observação |
|---|---|---|
| A | `Handover_Krrik_Son_of_Yawgmoth_V2_Deep_Review.md` e `Krrik_Son_of_Yawgmoth_Dashboard_V2.xlsx` | Revisão V2: 13 trocas, sem partida. |
| B | `analise-claude-krrik.md`, `Handover_Krrik_Analise_de_Deck.md` e `lista_nova_krrik.txt` | Claude, 14/10/2026: 17 trocas, nos eixos do dono. |
| C | `Analise deck K'rrik - Grok.md` | Grok: 20 cortes e entradas em três camadas, sem pares de troca. |

## A lista

Confere: 100 cartas em 76 linhas, só Swamps repetidos (25), todas reconhecidas no Scryfall, todas pretas ou incolores, nenhuma banida. 32 terrenos e o Boggart Trawler, terreno no verso: 33 fontes. Três Game Changers: Demonic Tutor, Imperial Seal e Vampiric Tutor. 19 criaturas, CMC médio 3,63 sem terrenos e 91 símbolos de mana preta.

**O comandante, pelas rulings do Scryfall.** Cada {B} de qualquer custo (mágica, ativação, ação especial) pode ser pago com 2 de vida. Nunca o genérico nem o X. Num símbolo híbrido ou phyrexiano, você escolhe pagar a parte preta e aí paga com vida: o extort ({W/B}) sai por 2 de vida. O valor de mana do K'rrik é sempre 7. Toda mágica preta põe um marcador +1/+1 nele.

## Onde as três concordam

- O deck usa vida como mana, e o laço do Exquisite Blood é o fechamento.
- Entram **Vilis, Broker of Blood**, **Bolas's Citadel**, **Sheoldred, the Apocalypse**, **Cabal Ritual**, **Bloodletter of Aclazotz** e **Snuff Out**.
- Saem **Army of the Damned**, **Hex**, **Infernal Offering** e **Barbed Servitor**.

## Onde divergem, carta a carta

| Ponto | A | B | C | O que sigo |
|---|---|---|---|---|
| Game Changers | põe três a mais (Necropotence, Bolas's Citadel, Ancient Tomb) sem dizer: 3 viram 6 | troca o Vampiric Tutor pelo Bolas's Citadel: fica em 3 | põe três a mais (Necropotence, Bolas's Citadel, Opposition Agent) sem dizer | **B, até o dono decidir.** Necropotence vai a avaliar. |
| Cartas de estimação | não supõe, mas não corta foil | supõe as foil e a etched | corta Call to the Void, Shadows' Verdict, Grievous Wound e Preacher, que são foil | **B, até o dono confirmar**: nenhuma foil sai. |
| Limpezas | ficam Damnation, Toxic Deluge, Shadows' Verdict e Crippling Fear; saem Mutilate e Ritual of Soot | saem Damnation e Mutilate, que matam o K'rrik | saem Ritual of Soot e Shadows' Verdict | **B.** Ficam as que poupam o K'rrik: Shadows' Verdict e Ritual of Soot (valor até 3; ele tem 7), Crippling Fear (escolhendo Horror) e Toxic Deluge (com o K'rrik grande). |
| Platinum Angel | fica | sai | sai | **Sai.** São sete manas genéricas, que a vida não paga. E com menos de 2 de vida o K'rrik não paga mais nenhum {B} (regra 119.4): o Angel só segura um deck já travado. |
| Proteção do K'rrik | nenhuma | Swiftfoot Boots | Lightning Greaves e Swiftfoot Boots | **B.** O manto (shroud) da Greaves impede os seus próprios alvos, como o Malakir Rebirth. |
| Leshrac's Sigil | entra (K'rrik + Aetherflux) | banco | não cita | **Avaliar.** É combo de três cartas (Spellbook 2903-3260-4740) e com o Pontiff of Blight (abaixo). |
| Ancient Cellarspawn | fica | fica | sai | **Fica.** Mágica paga com vida gasta menos mana que o valor dela: o oponente perde a diferença. |
| Myriad Landscape | fica | sai pela Cabal Coffers | não cita | **Avaliar** (veja o que nenhuma viu). |

## O que cada uma afirma que o texto oficial desmente

**A**
- Diz que Sensei's Divining Top com Bolas's Citadel "não forma loop infinito sem mana para ativar", porque a compra do Top custaria {1}. A compra do Top é "{T}: compre e ponha o Top no topo do grimório", sem mana; a Citadel o conjura de novo por 1 de vida. Com o Aetherflux Reservoir ou a Sheoldred, é combo (Commander Spellbook 2173-4740-5078 e 2173-2498-5078), e a própria lista de A tem as quatro peças.
- Não diz que as trocas levam o deck de 3 para 6 Game Changers.

**B**
- Nada que o texto desminta.

**C**
- Diz que Exsanguinate e Torment of Hailfire saem "pagos com vida". O X nunca é pago com vida (ruling do K'rrik): só o {B}{B}.
- Diz que o Skirge Familiar faz "o mesmo" que o Blood Celebrant, transformar vida em mana. O Skirge descarta carta para gerar {B}; não usa vida.
- Não diz que Necropotence, Bolas's Citadel e Opposition Agent são Game Changers.

## O que nenhuma viu

- **O laço do Top com a Citadel.** A o descarta por um erro de texto; B e C não juntam as peças. Com o Aetherflux, que já está na lista, a Citadel e o Top fecham o jogo.
- **K'rrik + Leshrac's Sigil + Pontiff of Blight** (Commander Spellbook 1698-2903-3260). Cada volta da Sigil, paga com vida, dispara o extort de toda a mesa. B põe o Pontiff e deixa a Sigil no banco; A põe a Sigil sem o Pontiff.
- **Myriad Landscape com o Dread Presence.** Dois Swamps de uma vez são dois gatilhos (compra ou 2 de dano), e mais dois Swamps básicos para a Cabal Stronghold. B a corta por "mono-preto não precisa de correção", o que é verdade, mas não é o papel dela aqui.
