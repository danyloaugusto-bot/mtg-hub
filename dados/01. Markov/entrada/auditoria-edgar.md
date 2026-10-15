# Auditoria: Linhagem Markov (Edgar Markov)

Auditor: Claude, em outra conversa | Data: 15/10/2026 | Base: os 12 arquivos da conversa que fez as fatias 1 e 2 | Os scripts dela rodaram de novo aqui

## Veredito

O trabalho de base é bom: o diagnóstico (gera bem, converte pouco, chega tarde) se sustenta, as listas batem e o simulador reproduz os números dela. Corrigi seis pontos de leitura e de método e mudei três decisões da forte, todas medidas. A forte final tem 27 trocas e põe o Edgar em campo até o turno 6 em 37,5% das partidas (eram 32,3%), com a mesa morta até o turno 8 em 49,3% (eram 44,2%). A nota fica em 8,5, projeção sem partida.

## O que conferi e se confirmou

- Listas por script: hoje, forte e atalho com 100 cartas cada, os 16 pets intactos.
- Placar reproduzido (436, 474 e 456) a partir do `dados.py` dela.
- Simulação reproduzida: na forte dela, Edgar até o turno 6 em 32,3% e mesa morta até o turno 8 em 44,2%, contra 32% e 44% no relatório.
- Textos das cartas de 2026 no cache v2.4: Emeritus of Woe é Vampire Warlock, e a cópia preparada é um feitiço, que não dispara a eminência. A leitura dela está certa.
- Isshin, Sanctum Seeker, Bloodletter e Olivia's Wrath: texto conferido de novo no EDHREC.

## O que corrigi

| # | Ponto | Estava | Ficou |
|---|---|---|---|
| 1 | Akroma's Will | Leitura minha, pela regra 108.4; e "a Akroma's Will espera o Edgar em campo" | Regra oficial 903.3d (controlar um comandante é tê-lo em campo). E o modo de voar e golpe duplo, que é o letal, não precisa do Edgar. Segurar a carta esperando o Edgar era conselho errado. |
| 2 | Olivia's Wrath e Isshin | Não constava | O Isshin é Humano 3/4: morre para o seu próprio Olivia's Wrath com quatro Vampiros. Entrou nas linhas de jogo. |
| 3 | Combo do Vito | Precisa de uma fonte de ganho de vida | Qualquer perda de vida de um oponente começa o laço; um ataque ou o gatilho do Seeker bastam. |
| 4 | Linha do Seeker | "Cada atacante drena 3 da mesa" | Cada atacante tira 1 de cada oponente; com Isshin e Bloodletter, 4 de cada um. |
| 5 | Tiers | 14 cartas S, acima da faixa que a própria análise declarava | 7 S, pela regra "sem substituta no plano": Skullclamp, Sanctum Seeker, Isshin, Shared Animosity, Emeritus, Sol Ring e Welcoming Vampire. Lordes (oito no deck), limpezas unilaterais e Akroma's Will descem para A. |
| 6 | Toxic Deluge | S no Clavileño, C aqui, sem explicação | O motivo agora está escrito: no Clavileño a morte é o motor; aqui a horda é o capital. |
| 7 | Emeritus of Woe | "Um 5/4" | Tirei o número: o cache não traz poder e resistência, então ele não estava conferido. |
| 8 | Simulador | O Mirror Entity usava a mana que sobrava sem gastá-la, e a mesma mana ainda pagava o Exsanguinate | Agora o Mirror gasta a mana, e o simulador escolhe o que rende mais. Também passou a modelar pedras e a medir a linha do Seeker. |

**Uma correção minha também.** Antes desta auditoria eu disse que o trio Seeker, Bloodletter e Isshin devia ser o plano A. A simulação desmente: as três peças juntas, com cinco atacantes, aparecem até o turno 8 em menos de 1% das partidas, e Seeker com Bloodletter e oito atacantes em cerca de 3%. É o teto do deck, não a rotina. O que vale é apontar as buscas para ele, o que rendeu cerca de 3 pontos na mesa morta até o turno 8.

## As três decisões que mudaram a forte, medidas

20 mil partidas por variante, mesma semente. Cada linha soma à anterior quando diz "+".

| Variante | Edgar até o turno 6 | Mesa morta até o turno 8 | Vampiros no turno 4 | Decisão |
|---|---|---|---|---|
| Forte da outra conversa | 32,3% | 44,2% | 3,25 | base |
| + buscas apontadas para Seeker, Bloodletter e Isshin | 32,4% | 47,6% | 3,30 | fica (é jogo, não carta) |
| + Vampire of the Dire Moon de volta, no lugar do Edgar, Ancient Bloodlord | 32,3% | 48,0% | 3,37 | fica |
| + Coat of Arms → Talisman of Hierarchy | 35,1% | 48,1% | 3,38 | passo intermediário |
| + Kindred Charge → Talisman of Indulgence | 38,0% | 49,5% | 3,34 | **fica: forte final** |
| Alternativa: Pact of the Serpent no lugar do Kindred Charge | 37,4% | 49,4% | 3,35 | recusada: perde cartas vistas |
| Alternativa: duas pedras no lugar de dois terrenos | 32,5% | 46,7% | 3,18 | recusada |
| Alternativa: Black Market Connections no lugar de um terreno | 34,0% | 46,6% | 3,20 | recusada |

Na rodada final da lista montada, os números ficaram em 37,5% e 49,3%: a mesma lista em outra ordem de cartas, então a diferença para a tabela é ruído de sorteio.

**Por que as pedras saem de magia, e não de terreno.** Trocar terreno por pedra deixou a mana igual e perdeu Vampiro no turno 4. Trocar dois finalizadores caros por duas pedras de 2 manas adiantou o Edgar e, mesmo sem os finalizadores, matou a mesa mais cedo. O Coat of Arms ainda tem um custo que o goldfish não mede: é simétrico, e a sua mesa tem várias tribais.

**Por que o Vampire of the Dire Moon volta.** A tese do deck é base larga cedo, e o Edgar, Ancient Bloodlord era um B que entrava pelo nome. A medição confirmou: o Dire Moon rende pelo menos o mesmo.

## O que não mudei

- O atalho: trocar o Stensian pelo Arcane Signet rende menos de 1 ponto na mesa morta até o turno 8. Não vale tirar a peça que só este deck tem.
- As recusadas da fatia 1 (The One Ring, Mox Diamond, Exquisite Blood e as outras): os motivos se sustentam.
- Pets: nenhum entrou na fila de corte.

## O que não consegui conferir

- Poder e resistência das criaturas de 2026: o cache não traz esses números, e o simulador usa memória para eles.
- A vida do jogador: o simulador não conta, então Necropotence, Citadel, Pact, shocks e fetches saem de graça.
- O Roaming Throne com o Edgar na zona de comando segue como leitura, não como regra confirmada.
- Os percentuais do EDHREC: a coleta da outra conversa é parcial (o JSON vem cortado).

## Para o Mestre v2.4

- **Pergunta sempre com a opção recomendada.** A sessão anterior parou 7 horas esperando uma resposta depois de uma interrupção. Quando der, deixar uma retomada agendada.
- **Lista de tarefas atualizada a cada etapa.** A da outra conversa ficou em "Passo 1 de 7" com a pesquisa pronta e pareceu travada.
- **Fatias de até 30 minutos, cada uma com arquivo.** A pesquisa pesada se faz uma vez e vai para o cache.
- **Auditoria por outra conversa no modo profundo.** Pegou oito pontos que a autora não viu.
- **Regra 903.3d no passo 2.** Vale para tudo que diz "if you control a commander" (Akroma's Will, Jeska's Will, Flawless Maneuver, Deflecting Swat).
- **Simulador: efeito de X gasta a mana.** O Mirror Entity contava a mesma mana duas vezes.
- **Decisão de mana só pela simulação.** O placar bate no teto de aceleração e não enxerga mana.
