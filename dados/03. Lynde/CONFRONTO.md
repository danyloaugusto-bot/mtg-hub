# Confronto: Lynde

08/10/2026. Três análises de fora, todas em `entrada/`. Nenhuma vale como verdade: decidem o texto oficial da carta (Scryfall, conferido para as 95 linhas da lista e para as 45 cartas recomendadas de fora) e o plano do deck.

| Sigla | Arquivo | Hora | Observação |
|---|---|---|---|
| A | `Análise Unificada e Robustecida – Grok.md` | 18:50 | Nota 7,3. Avaliação por aspecto, sem tabela por carta. |
| B | `Lynde_Balanced_Curses_V2.1_Handover_Especifico.md`, a planilha e a prévia em PNG | 18:58 | Versão V2.1, nota 7,7 → 8,9 projetada. Lista V2.0 e V2.1 de trocas. |
| C | `analise-claude-lynde.md` | 18:58 | A mais detalhada, no nosso método, com nota por carta e tabela de autoamaldiçoar. |

## A lista

Confere: 100 cartas em 95 linhas, um comandante, só básicos repetidos, todas em azul, preto e vermelho, todas reconhecidas no Scryfall pela edição e número da lista. 32 terrenos e 3 cartas duplas com terreno no verso (Hydroelectric Specimen, Malakir Rebirth e Sundering Eruption): 35 fontes. 18 foils. 16 Maldições. Valor no Scryfall: US$ 324,28.

A lista veio com a linha "COMMANDER" no topo; o motor já a ignora. A `carta.png` mostra a Lynde da MIC 38; a lista diz MIC 76, que é a versão que o painel vai mostrar.

## Onde as três concordam

- A Lynde é um motor excelente e o plano é atrito: maldições recicladas, compra constante, vitória lenta.
- A proteção da Lynde é o ponto mais fraco.
- Claws of Gix e Despotic Scepter são peças do plano, não artefatos soltos.
- Saem Powerbalance, Plargg and Nassari, Ensnared by the Mara, Keen Duelist e Lazav ou Evil Twin.
- Faltam Curse of Thirst, Curse of Fool's Wisdom, Bitterheart Witch e Paradox Haze.

Concordância não prova nada. Aqui o texto sustenta: Curse of Thirst causa dano igual ao número de Maldições no jogador; Bitterheart Witch busca uma Maldição ao morrer; Paradox Haze dá uma segunda manutenção, e a Lynde dispara em cada uma.

## Onde divergem, carta a carta

| Carta | A | B | C | Sigo | Por quê |
|---|---|---|---|---|---|
| Archfiend of Depravity | — | corta | A, ALT | C | Limpeza de um lado só a cada turno de oponente, e com Cruel Reality o oponente fica sem mesa. |
| Alexios | corta | — | B, MÉD | C | Roda a mesa atacando todos menos você e dispara Opulence, Verbosity e Disturbance a cada ataque. |
| Hydroelectric Specimen | corta | — | C, MÉD | C | É terreno no verso. Cortar tira o deck de 35 para 34 fontes. |
| Captive Audience | corta | — | B, MÉD | C | Mata um jogador em três turnos. Mas não é Maldição: destruída, não volta. |
| Relic of Sauron | — | corta | B, ALT | C | Duas manas coloridas num deck de três cores. |
| Court of Vantress | corta | corta | B, MÉD | A e B | O deck defende mal a coroa. |
| Curse of Echoes | entra | entra | fora | C | Dá a cópia a cada outro jogador, não só a você. |
| Evil Twin, Protean Thaumaturge | — | corta Evil Twin | cortam os dois | C | Copiam criatura; o deck quer copiar encantamento. |

## O que cada uma afirma que o texto desmente

**A**
- Diz que Grim Guardian dá "extort em toda Curse". O texto: cada oponente perde 1 quando entra um encantamento seu. Não há extort nem ganho de vida.
- Diz que Bitterheart Witch "tutora qualquer Curse e se sacrifica". Ela não se sacrifica: busca a Maldição quando morre, e precisa de uma saída (Claws of Gix serve).
- Põe Curse of Surveillance entre as maldições do início. Custa 5.
- Corta Hydroelectric Specimen como carta fraca. É terreno no verso.
- Diz que a proteção é "apenas Malakir Rebirth e Propaganda". Hydroelectric Specimen também desvia uma remoção para si.

**B**
- Chama Grim Guardian de "motor de dano". É perda de vida: a Curse of Bloodletting não dobra.

**C**
- Dá ao Darkstar Augur 2/2. É 2/3, com offspring.
- Diz que a Curse of Bloodletting faz a Maddening Hex render "média de 7 por mágica". A Hex pula para outro oponente, ao acaso, logo depois do primeiro dano: o dobro vale só para o primeiro disparo no jogador amaldiçoado.
- As dúvidas de regra se resolvem assim: maldição com gatilho de manutenção em você já disparou contra você, e repassá-la pela Lynde não desvia o efeito (o gatilho se refere ao jogador da manutenção). Maldição que vai ao cemitério durante um fim de turno só volta no fim de turno seguinte.

## O que nenhuma viu

1. **Paradox Haze não é Maldição.** É Aura de jogador, sem o subtipo Curse: a Lynde não a traz de volta e a Curse of Misfortunes não a busca. Tem de ficar em você, e se for destruída, foi.
2. **Curse of Leeches morta como criatura não volta.** À noite ela vira a Leech Horror, uma criatura. Se morrer assim, não era Maldição ao sair da mesa, e a Lynde não dispara. Responde a dúvida de C.
3. **Entity Tracker compra a cada Maldição que a Lynde devolve.** A maldição volta "entrando" em você, e isso é um encantamento seu entrando. B põe o Tracker no núcleo por "encantamentos entram", sem notar que o ciclo da Lynde o dispara sozinho em todo fim de turno.
