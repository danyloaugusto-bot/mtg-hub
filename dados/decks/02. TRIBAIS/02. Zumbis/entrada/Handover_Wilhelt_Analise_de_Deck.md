# Handover: Wilhelt, the Rotcleaver

Versão 1.0, de 14/10/2026. É anexo do Handover Mestre v2.1. O detalhe está em `analise-claude-wilhelt.md` e a lista nova em `lista_nova_wilhelt.txt`.

## Como usar

Abra um chat novo e anexe três arquivos: o Handover Mestre, este handover e a análise. Diga a tarefa: refinar as trocas, fazer o teste das dez mãos ou escolher o nome do painel.

## Onde paramos

- **Rodada única, de 14/10:** diagnóstico com 12 trocas, nos eixos dele. Foi o terceiro deck da mesma conversa.
- **Nota atual: 7.** **Nota projetada: 8,5**, sem partida.
- **Placar:** 310 hoje e 335 com as trocas.
- **Nome de painel sugerido:** Cutelo e Cova.

## O que ele disse

- É um dos decks Zumbi mais famosos do Magic.
- Quer mais Zumbis na mesa, de carta ou ficha. O tema 1 tem que ser muito forte em Zumbis. O tema 2 é fichas e o uso delas para gerar valor: compra, dano, recorrência e recursão.
- Prefere a temática Zumbi a cartas genéricas de dreno por saída do campo.
- Pediu análise aprofundada, com Zumbis antigos e novos, e critério ao agrupar.
- Sugeriu The Scarab God e Lazotep Quarry.

**Eixos dele:** Ramp, Draw, Removal, Recursão, Sacrifice + token, Tokens, Buff, Sinergia + WinCon.

**Fases dele:**
- Início: ramp, compra e Zumbis pequenos.
- Meio: comandante em campo, controle da mesa tirando criaturas dos oponentes, valor.
- Fim: vencer por fichas, dreno ou combate.

## O que já foi conferido e concluído

**Texto.** Todas as cartas foram lidas no json.edhrec. Ficaram sem fonte só o verso do Hostile Hostel e a lealdade da Liliana, Death's Majesty.

**A correção que mais importa.** A Wilhelt dispara com Zumbi **sem decayed**, não com Zumbi "não-ficha". As fichas comuns de Zumbi disparam a Wilhelt; só as decayed não disparam.

**Combos já na lista:**
- Acererak + Rooftop Storm (1824-2452) vence sozinho.
- Gravecrawler + Phyrexian Altar + outro Zumbi (2577-4050) dá mortes infinitas; com a Wilhelt, mana infinita; com um dreno, vence.
- Variações com Rooftop Storm, Ashnod's Altar, Relentless Dead e Necroduality.

**Game Changers:** 3 (Cyclonic Rift, Rhystic Study e Necropotence). Não mudam com as trocas.

**A conta:** morrer, renascer, drenar. Cada Zumbi sem decayed que morre vale a ficha da Wilhelt mais o gatilho de quem paga pela morte.

**As 12 trocas:**

| Sai | Entra |
|---|---|
| Necrotic Hex | The Scarab God |
| Esper Panorama | Lazotep Quarry |
| Blood Scrivener | Death Baron |
| Tainted Adversary | Cemetery Reaper |
| Pyre of Heroes | Lord of the Accursed |
| Midnight Clock | Skullclamp |
| Living Death | Zombie Apocalypse |
| Damnation | Noxious Ghoul |
| Crowded Crypt | Vengeful Dead |
| Lonely Sandbar | Watery Grave |
| Myriad Landscape | Underground Sea |
| Liliana's Reaver | Cryptbreaker |

**Antes e depois:**

| | Hoje | Com as trocas |
|---|---|---|
| Cards de Zumbi | 26 | 29 |
| Senhores | 3 | 6 |
| Drenos | 4 | 6 |
| Limpezas simétricas | 4 | 1 |
| Chance de ver um dreno até o turno 6 | 41% | 55% |
| Chance de ver um senhor até o turno 6 | 32% | 55% |

**Banco, em ordem:** Prized Amalgam, Undead Hand Ninja, Grim Reaper's Scythe, Midnight Reaper, Scourge of Nel Toth, Liliana, Dreadhorde General, Drivnod.

**Recusadas:** Lord of the Undead (fortalece os Zumbis dos oponentes), Grave Titan (não é Zumbi), Poppet Stitcher e Ghoulish Procession (só fazem fichas decayed), Undead Alchemist, Blood Artist e Zulaport (não são Zumbis).

## Perguntas em aberto

1. A mesa dele usa muito cemitério? Se usar, a Living Death volta no lugar da Necroduality.
2. Ele aceita o Skullclamp, a única entrada que não é Zumbi?
3. Quer mais duais no lugar da Mortuary Mire e do Temple of Deceit?

## Ressalva registrada

Os eixos "Sacrifice + token" e "Tokens" se sobrepõem. Li o primeiro como consumir fichas e o segundo como gerar fichas. Falta um eixo de evasão; ela foi notada em "Buff".

## O que o próximo chat deve fazer

1. Receber as respostas 1 a 3.
2. Fazer o teste das dez mãos até o turno 6. Medidas e metas:

| Medida | Meta |
|---|---|
| Turno da Wilhelt | — |
| Zumbis em campo no fim do turno 6 | — |
| Mãos com um dreno até o turno 6 | 5 ou mais |
| Mãos com um senhor até o turno 6 | 5 ou mais |

3. Dar a nota testada e gravar os arquivos em `C:\Projetos\mtg-hub\dados\`.

## Arquivos desta rodada

- `analise-claude-wilhelt.md`
- `Handover_Wilhelt_Analise_de_Deck.md`
- `lista_nova_wilhelt.txt`
- `lista_wilhelt.txt`
- Os scripts `dados.py`, `stats.py` e `gerar.py`, com o modelo `analise_tpl.md`.
