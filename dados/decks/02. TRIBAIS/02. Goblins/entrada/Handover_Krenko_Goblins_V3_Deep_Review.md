# HANDOVER V3 — Krenko, Mob Boss — Mono-Red Goblins

**Revisão:** V3 Deep Audit — 14/10/2026  
**Estado:** CURRENT congelada; PROPOSED V2 arquivada; PROPOSED V3 sugerida e não testada.  
**Identidade pretendida:** Goblins monored com pressão explosiva, criação exponencial de fichas, compra que evita ficar sem gás e múltiplos fechamentos por combate e dano direto.  
**Objetivo de potência:** construir uma versão próxima de 10/10 para o plano tribal, sem prometer uma taxa de vitória universal.

## 1. Resumo executivo

A CURRENT já possui um núcleo funcional de Krenko, Goblin Matron, Muxus, Goblin Warchief, Rundvelt Hordemaster, Goblin Bombardment, Ashnod’s Altar, Shared Animosity e finalizadores. O gargalo é ter Krenko ativo antes de ser removido e converter fichas em cartas, mana ou dano quando o ataque não é suficiente.

A V2 melhorou aceleração, compra e interação, mas ainda faltavam várias cartas tribais bem posicionadas em referências de alta potência. A V3 acrescenta **Goblin Chieftain, Goblin Recruiter, Goblin Ringleader, Pashalik Mons e Goblin Chirurgeon**, e melhora a base de mana com Mana Vault, Ancient Tomb, Cavern of Souls e Three Tree City. Mantém o combo Thornbite Staff + Goblin Bombardment fora da lista-base; pode ser estudado como linha opcional se o usuário decidir elevar o componente de combo.

**Nota metodológica:** a antiga nota V2 de 8,5/10 não foi calculada com uma rubrica publicada. Para tornar as versões comparáveis, CURRENT, V2 e V3 foram reavaliadas pelos mesmos dez critérios ponderados (100% no total). A antiga nota V2 aparece agora como cerca de 8,2/10; isso é rebaseline, não prova de queda no desempenho. A V3 continua não testada.

| Estado | Nota estrutural ponderada | Interpretação |
|---|---:|---|
| CURRENT | **6,0/10** | Núcleo tribal forte, mas ramp, compra e proteção podem falhar juntos. |
| PROPOSED V2 | **8,2/10** | Estrutura melhor, mas faltavam redundância tribal e uma camada de proteção/compra. |
| PROPOSED V3 | **9,2/10** | V3 otimiza o motor e o acesso a cartas, sem adotar combo infinito como plano-base. |

## 2. Auditoria estrutural

- **100 cartas** incluindo comandante nas três versões; sem duplicatas não básicas detectadas.
- **CURRENT:** 32 terrenos físicos + 1 MDFC = 33 cartas com opção de terreno.
- **PROPOSED V2:** 33 terrenos físicos + 1 MDFC = 34 cartas com opção de terreno.
- **PROPOSED V3:** 34 terrenos físicos + 1 MDFC = 35 cartas com opção de terreno.
- A V3 é mais agressiva na base de mana, mas Ancient Tomb e Three Tree City produzem mana incolor ou dependente de uma mesa tribal; não substituem fontes vermelhas em todas as mãos.
- A estrutura funcional exclui comandante e terrenos físicos dos grupos; MDFCs contam como uma carta e são atribuídas a uma função principal.
- Nenhuma carta é considerada adquirida, incluída ou testada sem confirmação do usuário.

## 3. Estratégia proposta

### Early game — habilitar Krenko antes de ser respondido

Desenvolver pedras de mana, Goblins de baixo custo e produção/conversão de recursos. Mana Vault, Ancient Tomb e Skirk Prospector ajudam a adiantar Krenko ou turnos explosivos. Buscar haste/proteção com Lightning Greaves, Goblin Warchief, Goblin Chieftain, Urabrask the Hidden ou ativação de Thousand-Year Elixir. A primeira ativação protegida frequentemente vale mais que adicionar outro payoff caro.

### Mid game — multiplicar fichas e abastecer a mão

Krenko cria uma ficha por Goblin controlado, incluindo o próprio Krenko. Cada ativação pode superar muito a anterior. Goblin Recruiter organiza Goblins no topo para preparar Muxus ou Ringleader; Goblin Ringleader pode recuperar Goblins do topo para a mão; Skullclamp, Idol of Oblivion, Slate of Ancestry e The One Ring reabastecem por mecanismos diferentes. Marvin, Murderous Mimic pode copiar a habilidade ativada de Krenko, mas também precisa ser habilitado contra doença de invocação e remoção.

### Late game — transformar o exército em vitória

Shared Animosity e Embercleave favorecem o combate; Fiery Emancipation e Impact Tremors aumentam o dano por quantidade; Goblin War Strike, Raid Bombardment, Goblin Bombardment e Pashalik Mons dão alcance fora do combate. Ashnod’s Altar e Skirk Prospector transformam fichas em mana. Não depender de uma única linha de ataque: manter um caminho de dano direto se a mesa ficar bloqueada.

## 4. Interações e regras críticas

- **Krenko** conta os Goblins que você controla, incluindo o próprio Krenko. A habilidade exige virar a criatura; haste ou efeitos de desvirar aceleram a primeira ativação.
- **Marvin, Murderous Mimic** pode copiar habilidades ativadas de outras criaturas suas, inclusive a habilidade ativada de Krenko. Marvin não ganha habilidades disparadas/estáticas das outras criaturas, e a restrição de doença de invocação continua relevante para habilidades com {T}.
- **Goblin Recruiter + Muxus/Ringleader:** Recruiter prepara o topo da biblioteca; Muxus verifica as seis cartas do topo e coloca Goblins com valor de mana até 5 no campo, e Ringleader busca Goblins revelados para a mão. Embaralhamentos/interações com o topo podem desfazer essa preparação.
- **Goblin Chirurgeon** sacrifica um Goblin para regenerar uma criatura. Isso pode proteger Krenko de destruição, mas não contra exile, bounce, -X/-X ou efeitos que não destroem.
- **Pashalik Mons:** quando Pashalik ou outro Goblin seu morre, causa 1 de dano a qualquer alvo. Sua habilidade ativada custa {3}{R}, sacrifica um Goblin e cria dois tokens Goblin; o sacrifício normalmente causa um gatilho de dano se Pashalik continuar em campo.
- **The One Ring:** quando entra e foi conjurado, concede proteção contra tudo até seu próximo turno; oferece compra que escala com marcadores, com custo de vida crescente e alta percepção de ameaça.
- **Mizzium Mortars com overload** causa 4 de dano às criaturas que você não controla (assimétrico, mas não elimina criaturas com resistência acima de 4). **Vandalblast com overload** é uma resposta assimétrica a artefatos. **Blasphemous Act** é simétrica, mas Eldrazi Monument pode manter seus Goblins indestrutíveis enquanto o Monument permanece.
- **Combo opcional não incorporado:** Thornbite Staff equipado em Krenko + Goblin Bombardment pode permitir uma sequência repetível de virar Krenko, criar fichas, sacrificar uma ficha e desvirar Krenko quando uma criatura morre. A linha depende das peças, do estado de jogo e da possibilidade de interagir; fica fora da baseline V3 para não mudar silenciosamente a identidade do deck.

## 5. Por que a V3 melhora a V2

- **Goblin Chieftain:** adiciona um lord tribal com haste, aumentando pressão e ativação do motor.
- **Goblin Recruiter:** aumenta acesso a peças relevantes e prepara Muxus/Ringleader. Ele é melhor em lista tribal densa; a V3 tem que preservar Goblin density.
- **Goblin Ringleader:** reabastece a mão com Goblins e é alvo relevante de Matron/Recruiter.
- **Pashalik Mons:** converte mortes em dano e permite transformar um Goblin em dois tokens pagando quatro manas; o custo é mana, não apenas um efeito de dano gratuito.
- **Goblin Chirurgeon:** transforma Goblins excedentes em proteção contra destruição para uma criatura relevante.
- **The One Ring:** melhora compra e fornece proteção temporária, mas não é uma peça tribal e eleva a ameaça percebida.
- **Mana Vault / Ancient Tomb / Three Tree City:** melhoram aceleração e explosão depois de estabelecer mesa; exigem acompanhar fontes vermelhas e risco de vida.
- **Cavern of Souls:** nomear Goblin ajuda a conjurar Krenko e outras mágicas de criatura Goblin sem que sejam anuladas; não protege contra remoções depois que entram.

## 6. Mudanças da CURRENT para PROPOSED V2 (histórico preservado)


| OUT | IN | Motivo do corte | Ganho esperado | Custo / argumento contra | Prioridade | Confiança |
|---|---|---|---|---|---|
| Boom // Bust | Sol Ring | A metade Bust de destruição global de terrenos não fortalece o plano normal de enxame; Sol Ring acelera a execução. | Aceleração eficiente que estava ausente da lista original. | Boom pode ser uma troca tática de terrenos; manter Bust mudaria a experiência para land destruction deliberada. | P1 | Alta |
| Chainsaw | Skullclamp | Skullclamp transforma fichas pequenas em compra e aproveita os sac outlets existentes. | Converte Goblins pequenos em vantagem de cartas, sobretudo com sac outlets. | Chainsaw pode fornecer remoção/valor temático; manter se for carta preferida. | P1 | Alta |
| Hedron Archive | Skirk Prospector | Prospector custa pouco, é Goblin e converte fichas em mana quando importa. | Transforma Goblins em mana vermelha e permite turnos explosivos. | Archive compra duas cartas mais tarde sem sacrificar criaturas. | P1 | Alta |
| Izzet Chemister | Jeska's Will | Jeska's Will gera mana e acesso impulsivo imediatamente, sem esperar recarga do Chemister. | Mana explosiva mais compra impulsiva; teto alto com comandante em campo. | Chemister pode reutilizar mágicas se sobreviver e houver densidade suficiente de instantâneas/feitiços. | P1 | Alta |
| Lavabrink Floodgates | Blasphemous Act | Act funciona como limpeza de emergência com custo frequentemente baixo. | Limpeza de emergência eficiente; interage com Brash Taunter e pode ser assimétrica com Eldrazi Monument. | É simétrica, a menos que Monument proteja seus Goblins. | P1 | Alta |
| Nevinyrral's Disk | Vandalblast | Vandalblast limpa artefatos inimigos sem destruir seus Goblins e motores. | Sobrecarga destrói artefatos dos oponentes sem afetar os seus. | Disk alcança mais tipos de permanentes, então a cobertura de reset amplo diminui. | P1 | Alta |
| Rummaging Goblin | Idol of Oblivion | Idol compra sem virar criatura ou descartar uma carta, e Krenko cria fichas com frequência. | Compra recorrente se você criou ficha no turno; Krenko habilita o gatilho naturalmente. | Rummaging Goblin filtra uma carta morta quando não foi possível criar fichas. | P1 | Alta |
| Wheel of Fate | Slate of Ancestry | Slate reabastece proporcionalmente ao seu próprio exército sem recarregar automaticamente todos os oponentes. | Pode repor a mão com muitas cartas quando você já tem um exército. | Slate custa quatro manas e descarta a mão como custo da ativação. | P1 | Alta |
| Worldfire | Thousand-Year Elixir | Worldfire apaga o estado de jogo e não aproveita o enxame; Elixir acelera ativações de Krenko/Marvin. | Permite ativar Krenko como se tivesse ímpeto e pode desvirar uma criatura. | Worldfire pode ser divertido como plano deliberado; o corte é estratégico, não por alegação de banimento. | P1 | Alta |
| Glittering Stockpile | Lightning Greaves | Greaves protege Krenko e habilita ativação imediata com baixo investimento. | Protege Krenko e dá ímpeto para ativar imediatamente. | Stockpile acumula tesouros e pode render mana num plano mais lento. | P1 | Alta |
| Door of Destinies | Impact Tremors | Grande parte das fichas de Krenko é criada, não conjurada; Tremors recompensa diretamente as entradas. | Transforma a criação de cada ficha por Krenko em dano a todos os oponentes. | Door cresce ao conjurar Goblins e continua sendo uma opção válida de anthem tribal. | P1 | Alta |
| Goblin Diplomats | Goblin Trashmaster | Trashmaster oferece bônus tribal e interação repetível com artefatos. | Lord tribal que também destrói artefatos de forma repetível sacrificando Goblins. | Diplomats é divertido e político; manter se esse papel for importante na mesa. | P1 | Alta |
| Goblin Guide | Chaos Warp | Chaos Warp melhora a cobertura de respostas em jogos avançados. | Resposta flexível para permanentes problemáticas em mono-red. | Guide pressiona cedo e pode continuar se o plano de aggro for prioridade. | P1 | Alta |
| Red Sun's Twilight | War Room | War Room adiciona um terreno e uma fonte de compra repetível. | Terreno que oferece compra recorrente quando há mana e vida disponíveis. | Twilight pode roubar artefatos com X alto e ser decisiva contra mesas de artefatos. | P2 | Alta |
| Bedlam | Wild Magic Surge | Surge adiciona interação instantânea; Bedlam impede bloqueios para todos e pode abrir contra-ataques contra você. | Resposta instantânea a quase qualquer permanente não terreno em mono-red. | Bedlam é válido se você quiser deliberadamente forçar combate em toda a mesa. | P2 | Alta |

## 7. Mudanças incrementais de PROPOSED V2 para PROPOSED V3


| OUT | IN | Motivo do corte | Ganho esperado | Custo / argumento contra | Prioridade | Confiança |
|---|---|---|---|---|---|
| Relic Robber | Goblin Chieftain | É temático e gera dano incremental, mas dá ao oponente um artefato criatura que pode criar valor em outros decks. | Lord Goblin de três manas que dá +1/+1 e haste ao tribal inteiro. | Perde-se o relógio de dano contínuo do Robber; redundância de haste já existe, mas o lord melhora tokens em combate. | P1 | Alta |
| Goblin Rally | Goblin Ringleader | Quatro fichas por quatro manas é um efeito pouco eficiente quando Krenko já produz fichas exponencialmente. | Reabastece a mão com Goblins do topo e é Goblin tutorável por Matron/Recruiter. | Pode revelar poucos Goblins se a densidade do topo for baixa; a quantidade de tokens cai em uma carta. | P1 | Alta |
| Gut, True Soul Zealot | Pashalik Mons | Gut exige gatilho de ataque e sacrifica outra criatura para produzir um token que não é Goblin; a linha é menos integrada ao motor tribal. | Morte de Pashalik ou de outro Goblin seu causa 1 de dano a qualquer alvo; por {3}{R} e sacrificando um Goblin, cria dois tokens, e o sacrifício gera um gatilho de dano se Pashalik estiver em campo. | A habilidade ativada custa quatro manas e não é um outlet gratuito; o ganho depende da mesa ter Goblins e Pashalik sobreviver. | P1 | Alta |
| Sparksmith | Goblin Chirurgeon | Pode remover criaturas, mas seu dano contra você cresce com a quantidade de Goblins que controla. | Goblin de baixo custo que sacrifica outro Goblin para regenerar uma criatura Goblin, protegendo Krenko de destruição. | Não protege contra exile, bounce, -X/-X ou efeitos que não destroem; perde-se uma fonte de remoção de criatura. | P1 | Alta |
| You See a Pair of Goblins | Goblin Recruiter | Duas fichas instantâneas são úteis, mas não resolvem a necessidade de encontrar a peça certa. | Tutor tribal que organiza os Goblins no topo; sinergiza diretamente com Muxus e Goblin Ringleader. | Não compra as cartas imediatamente e pode preparar o topo vulnerável a embaralhamento; exige densidade tribal. | P1 | Alta |
| Gauntlet of Power | The One Ring | O custo cinco e o benefício simétrico podem acelerar oponentes; o bônus depende das criaturas vermelhas. | Compra recorrente e proteção temporária imediata; grande motor de cartas para reconstruir após resposta. | Custo de vida crescente e aumento da percepção de ameaça; não é Goblin nem sinergia tribal direta. | P1 | Alta |
| Wand of Wonder | Mana Vault | Motor de alto custo, aleatório e que precisa de mana para ativar; não reforça o plano inicial. | Aceleração de baixo custo que pode antecipar Krenko e suas ativações. | Mana Vault não desvira naturalmente; pode pagar {4} para desvirar e, se ficar virado no início da manutenção, causa 1 de dano. É mana incolor. | P1 | Alta |
| Rising of the Day | Ancient Tomb | Haste adicional é útil, mas há sobreposição com Goblin Warchief, Urabrask, Greaves e o novo Chieftain. | Land que acelera o comandante e permanentes de custo alto um turno antes. | Causa dois de dano por uso e não produz vermelho; perder o bônus de +1/+0 em criaturas lendárias. | P1 | Alta |
| Mountain | Cavern of Souls | Troca um terreno básico por proteção relevante à principal peça do deck. | Nomear Goblin: Krenko e outras mágicas Goblin não podem ser anuladas quando a mana da Cavern é usada para conjurá-las. | Não produz vermelho para mágicas que não sejam do tipo escolhido se usada para mana colorida; fica vulnerável a hate de terrenos. | P1 | Alta |
| Mountain | Three Tree City | Um básico é confiável, mas não escala a mana com o exército que Krenko cria. | Ao nomear Goblin, gera mana igual ao número de Goblins controlados e pode financiar turnos explosivos. | É incolor sem a segunda habilidade e a quantidade de mana depende de ter mesa estabelecida; não ajuda muito quando atrás. | P1 | Alta |

### Argumentos contra as principais inclusões

- **Goblin Recruiter:** o valor depende de densidade tribal e de a biblioteca não ser embaralhada antes de aproveitar o topo. É tutor de preparação, não compra imediata.
- **Goblin Ringleader:** pode revelar poucos Goblins em lista pouco densa ou quando o topo foi preparado de forma subótima.
- **Pashalik Mons:** bom conversor de mortes em dano, mas sua habilidade ativada custa {3}{R} e não é um outlet grátis.
- **Goblin Chirurgeon:** excelente contra destruição, mas não resolve exile, bounce ou remoções de -X/-X.
- **The One Ring:** compra poderosa, porém aumenta vida consumida e percepção de ameaça; se o ambiente prefere partidas mais leves, teste antes de manter.
- **Ancient Tomb / Mana Vault / Three Tree City:** sobem o teto, mas também criam mãos com mana incolor sem fonte vermelha adequada. A mão inicial precisa ser avaliada pelo custo de cor, não só pela contagem bruta de fontes.

## 8. Grupos funcionais — versão recomendada

A V3 mantém os oito grupos definidos pelo usuário. Cada carta não terreno ocupa um único grupo principal; outras funções ficam registradas na matriz sem duplicar a contagem.


| Grupo | Função | CURRENT | PROPOSED V2 | PROPOSED V3 | Diagnóstico |
|---|---|---:|---:|---:|---|
| Ramp | Pedras, rituais, Prospector e terrenos que escalam mana. | 7 | 8 | 9 | Ativar Krenko cedo e ter mana para capitalizar a mesa criada. |
| Draw | Compra recorrente, reposição e seleção/tutor de topo. | 7 | 8 | 9 | O deck precisa recuperar cartas sem depender de Krenko sobreviver. |
| Removal | Remoções, dano pontual, respostas a artefatos e limpezas. | 7 | 9 | 8 | Manter respostas de cobertura variada; aceitar que mono-red tem lacunas contra encantamentos. |
| Token | Produção e multiplicação de fichas Goblin. | 7 | 7 | 6 | A produção exponencial é ótima, mas requer proteção e meios de converter fichas. |
| Combate + Dano Direto | Go-wide, dano de sacrifício e alcance fora do combate. | 9 | 9 | 9 | Manter linhas de letal quando bloqueios ou wipes impedem ataque normal. |
| Buff + Haste | Lordes, bônus de combate, ímpeto e proteção para atacar/ativar. | 14 | 12 | 12 | Haste facilita ativar Krenko no mesmo turno e evita exposição por um ciclo. |
| Sinergia 1 | Proteção, ativação/desvirar e motores de Krenko/Marvin. | 1 | 2 | 3 | Goblin Chirurgeon pode salvar Krenko de destruição sacrificando outro Goblin; não para exile/bounce. |
| Sinergia 2 | Toolbox tribal, sacrifício, recursão e valor de artefatos. | 15 | 11 | 9 | Recruiter/Ringleader/Muxus devem ter densidade tribal suficiente para gerar valor. |

### Leitura dos grupos

- **Ramp (V3 = 9 slots funcionais):** combina aceleradores e rituais; Cavern, Ancient Tomb e Three Tree City são terrenos físicos e por isso ficam fora da contagem funcional do grupo.
- **Draw (V3 = 9):** The One Ring, Ringleader, Skullclamp, Idol, Slate, Jeska’s Will e outras ferramentas cobrem compra recorrente, refill e seleção.
- **Removal (V3 = 8):** conserva respostas contra artefatos, permanentes e criaturas; mono-red ainda tem lacunas para encantamentos e alguns tipos de ameaça.
- **Token (V3 = 6):** contagem funcional parece menor, mas Krenko é a principal fábrica e fica na área de comandante. Avaliar a densidade efetiva de produtores e multiplicadores, não apenas esse número.
- **Combate + Dano Direto:** mantém linhas para vencer apesar dos bloqueios.
- **Buff + Haste:** não inflar sem motivo; haste importa especialmente para ativar Krenko antes de passar prioridade/turno.
- **Sinergia 1:** proteção e motores de ativação/desvirar.
- **Sinergia 2:** toolbox, tutores, recursão, sacrifício e valor tribal.

## 9. Rubrica ponderada de construção

Dez critérios, pesos comuns somando 100%. A nota não mede win rate nem substitui playtests.


| Critério | Peso | CURRENT | PROPOSED V2 | PROPOSED V3 |
|---|---:|---:|---:|---:|
| Curva e aceleração | 15% | 5.0 | 7.8 | 9.4 |
| Vantagem de cartas / compra | 15% | 4.6 | 8.1 | 9.3 |
| Sinergia com o plano tribal | 15% | 7.8 | 8.7 | 9.5 |
| Interação e limpezas | 15% | 6.0 | 8.1 | 8.8 |
| Proteção e resiliência | 10% | 4.5 | 8.1 | 9.1 |
| Acesso à vitória / fechamento | 10% | 7.3 | 8.8 | 9.5 |
| Base de mana | 5% | 6.2 | 7.5 | 9.2 |
| Flexibilidade funcional | 5% | 6.2 | 8.0 | 9.0 |
| Consistência da comandante | 5% | 5.5 | 8.4 | 9.3 |
| Identidade e experiência pretendida | 5% | 9.0 | 9.0 | 9.0 |
| **Nota ponderada** | **100%** | **6.04/10** | **8.24/10** | **9.23/10** |

### Critérios de playtest

1. **Tempo de Krenko:** turno em que é conjurado e turno em que ativa pela primeira vez.
2. **Proteção:** quantas vezes uma proteção/haste permitiu uma ativação antes de uma resposta adversária.
3. **Compra:** número de cartas geradas depois da primeira explosão e após um wipe.
4. **Recurso:** quantas vezes Prospector, Brightstone Ritual, Ashnod’s Altar ou Three Tree City financiam uma sequência significativa.
5. **Fechamento:** quantas partidas são vencidas por combate, dano direto ou sacrifícios.
6. **Recuperação:** se o deck volta a produzir fichas após Krenko ser removido ou após uma limpeza de mesa.

## 10. Watchlist — cartas e pacotes para uma possível V4

Estas opções não foram incorporadas automaticamente:

- **Goblin Lackey / Warren Instigator / Moggcatcher:** acelerar a entrada de Goblins grandes, se a curva e o meta justificarem.
- **Conspicuous Snoop / Kiki-Jiki, Mirror Breaker:** pacote de combo conhecido; muda o plano e requer decisão explícita.
- **Thornbite Staff:** potencialmente transforma Krenko + Goblin Bombardment em uma linha repetível de fichas/dano; não incluída na baseline.
- **Goblin Sharpshooter / Gempalm Incinerator / Massive Raid:** alternativas de interação que podem ser mais adequadas se o pod exigir remoção de criaturas.
- **Deflecting Swat / Bolt Bend:** proteção de pilha, a comparar com o custo e poder do ambiente.

## 11. Lista completa — CURRENT

```text

1 Krenko, Mob Boss (CMM) 238
1 Arcane Signet (CLB) 298
1 Ashnod's Altar (CMM) 368
1 Battle Cry Goblin (AFR) 132 *F*
1 Bedlam (7ED) 174
1 Boom // Bust (PLC) 112
1 Brash Taunter (CLB) 782
1 Breeches, Eager Pillager (LCI) 294 *F*
1 Brightstone Ritual (ONS) 191
1 Caterwauling Boggart (LRW) 157
1 Chainsaw (DSK) 128
1 Curse of Opulence (C17) 24
1 Den of the Bugbear (AFR) 254
1 Door of Destinies (M14) 208
1 Dragon Fodder (CMM) 217
1 Eldrazi Monument (ZEN) 199
1 Embercleave (ELD) 120
1 Enduring Courage (DSK) 133
1 Faithless Looting (CMM) 642
1 Fiery Emancipation (WOT) 42
1 Gauntlet of Power (DMR) 447
1 Glittering Stockpile (SNC) 107
1 Goblin Bombardment (MH2) 279
1 Goblin Diplomats (M14) 141
1 Goblin Engineer (MH1) 128
1 Goblin Guide (PLG21) 4 *F*
1 Goblin Matron (DMR) 123
1 Goblin Negotiation (FDN) 88
1 Goblin Rabblemaster (P30A) 22 *F*
1 Goblin Rally (RTR) 95
1 Goblin Surprise (FDN) 200
1 Goblin Traprunner (MH2) 130
1 Goblin War Strike (SCG) 96
1 Goblin Warchief (DOM) 130
1 Goblin Welder (DDU) 35 *F*
1 Grenzo, Havoc Raiser (CMM) 228
1 Gut, True Soul Zealot (CLB) 399
1 Hedron Archive (C18) 206
1 Hobgoblin Bandit Lord (AFR) 147
1 Icon of Ancestry (M20) 229
1 Impulsive Pilferer (CMM) 234 *F*
1 Izzet Chemister (CLB) 798
1 Lavabrink Floodgates (C20) 53
1 Legion Warboss (ONC) 101
1 Marvin, Murderous Mimic (DSK) 367
1 Mizzium Mortars (RTR) 101
28 Mountain (WOE) 274 *F*
1 Muxus, Goblin Grandee (J22) 575
1 Nevinyrral's Disk (C13) 248
1 Opal Palace (CMM) 422
1 Outpost Siege (C17) 139
1 Patchwork Banner (BLB) 247 *F*
1 Path of Ancestry (CMM) 661
1 Purphoros, Bronze-Blooded (THB) 265
1 Raid Bombardment (WOT) 47
1 Red Sun's Twilight (PONE) 145s *F*
1 Relic Robber (ZNR) 153
1 Rising of the Day (LTR) 145
1 Ruby Medallion (CMM) 405
1 Rummaging Goblin (M13) 146
1 Rundvelt Hordemaster (DMU) 142
1 Searslicer Goblin (FDN) 93 *F*
1 Shared Animosity (WOT) 49
1 Soulstone Sanctuary (FDN) 133
1 Sparksmith (ONS) 235
1 Sundering Eruption (MH3) 248
1 Thrill of Possibility (STA) 46
1 Treasure Nabber (CMM) 265
1 Urabrask the Hidden (CLB) 811
1 Wand of Wonder (CLB) 204 *F*
1 Wheel of Fate (TSR) 198
1 Worldfire (M13) 158
1 You See a Pair of Goblins (AFR) 170

```

## 12. Lista completa — PROPOSED V2 (arquivo histórico, não testada)

```text

1 Krenko, Mob Boss (CMM) 238
1 Arcane Signet (CLB) 298
1 Ashnod's Altar (CMM) 368
1 Battle Cry Goblin (AFR) 132 *F*
1 Brash Taunter (CLB) 782
1 Breeches, Eager Pillager (LCI) 294 *F*
1 Brightstone Ritual (ONS) 191
1 Caterwauling Boggart (LRW) 157
1 Curse of Opulence (C17) 24
1 Den of the Bugbear (AFR) 254
1 Dragon Fodder (CMM) 217
1 Eldrazi Monument (ZEN) 199
1 Embercleave (ELD) 120
1 Enduring Courage (DSK) 133
1 Faithless Looting (CMM) 642
1 Fiery Emancipation (WOT) 42
1 Gauntlet of Power (DMR) 447
1 Goblin Bombardment (MH2) 279
1 Goblin Engineer (MH1) 128
1 Goblin Matron (DMR) 123
1 Goblin Negotiation (FDN) 88
1 Goblin Rabblemaster (P30A) 22 *F*
1 Goblin Rally (RTR) 95
1 Goblin Surprise (FDN) 200
1 Goblin Traprunner (MH2) 130
1 Goblin War Strike (SCG) 96
1 Goblin Warchief (DOM) 130
1 Goblin Welder (DDU) 35 *F*
1 Grenzo, Havoc Raiser (CMM) 228
1 Gut, True Soul Zealot (CLB) 399
1 Hobgoblin Bandit Lord (AFR) 147
1 Icon of Ancestry (M20) 229
1 Impulsive Pilferer (CMM) 234 *F*
1 Legion Warboss (ONC) 101
1 Marvin, Murderous Mimic (DSK) 367
1 Mizzium Mortars (RTR) 101
28 Mountain (WOE) 274 *F*
1 Muxus, Goblin Grandee (J22) 575
1 Opal Palace (CMM) 422
1 Outpost Siege (C17) 139
1 Patchwork Banner (BLB) 247 *F*
1 Path of Ancestry (CMM) 661
1 Purphoros, Bronze-Blooded (THB) 265
1 Raid Bombardment (WOT) 47
1 Relic Robber (ZNR) 153
1 Rising of the Day (LTR) 145
1 Ruby Medallion (CMM) 405
1 Rundvelt Hordemaster (DMU) 142
1 Searslicer Goblin (FDN) 93 *F*
1 Shared Animosity (WOT) 49
1 Soulstone Sanctuary (FDN) 133
1 Sparksmith (ONS) 235
1 Sundering Eruption (MH3) 248
1 Thrill of Possibility (STA) 46
1 Treasure Nabber (CMM) 265
1 Urabrask the Hidden (CLB) 811
1 Wand of Wonder (CLB) 204 *F*
1 You See a Pair of Goblins (AFR) 170
1 Sol Ring (impressão não definida)
1 Skullclamp (impressão não definida)
1 Idol of Oblivion (impressão não definida)
1 Slate of Ancestry (impressão não definida)
1 Skirk Prospector (impressão não definida)
1 Goblin Trashmaster (impressão não definida)
1 Lightning Greaves (impressão não definida)
1 Thousand-Year Elixir (impressão não definida)
1 Jeska's Will (impressão não definida)
1 Blasphemous Act (impressão não definida)
1 Chaos Warp (impressão não definida)
1 Impact Tremors (impressão não definida)
1 Vandalblast (impressão não definida)
1 War Room (impressão não definida)
1 Wild Magic Surge (impressão não definida)

```

## 13. Lista completa — PROPOSED V3 (proposta atual, não testada)

```text

1 Krenko, Mob Boss (CMM) 238
1 Arcane Signet (CLB) 298
1 Ashnod's Altar (CMM) 368
1 Battle Cry Goblin (AFR) 132 *F*
1 Brash Taunter (CLB) 782
1 Breeches, Eager Pillager (LCI) 294 *F*
1 Brightstone Ritual (ONS) 191
1 Caterwauling Boggart (LRW) 157
1 Curse of Opulence (C17) 24
1 Den of the Bugbear (AFR) 254
1 Dragon Fodder (CMM) 217
1 Eldrazi Monument (ZEN) 199
1 Embercleave (ELD) 120
1 Enduring Courage (DSK) 133
1 Faithless Looting (CMM) 642
1 Fiery Emancipation (WOT) 42
1 Goblin Bombardment (MH2) 279
1 Goblin Engineer (MH1) 128
1 Goblin Matron (DMR) 123
1 Goblin Negotiation (FDN) 88
1 Goblin Rabblemaster (P30A) 22 *F*
1 Goblin Surprise (FDN) 200
1 Goblin Traprunner (MH2) 130
1 Goblin War Strike (SCG) 96
1 Goblin Warchief (DOM) 130
1 Goblin Welder (DDU) 35 *F*
1 Grenzo, Havoc Raiser (CMM) 228
1 Hobgoblin Bandit Lord (AFR) 147
1 Icon of Ancestry (M20) 229
1 Impulsive Pilferer (CMM) 234 *F*
1 Legion Warboss (ONC) 101
1 Marvin, Murderous Mimic (DSK) 367
1 Mizzium Mortars (RTR) 101
26 Mountain (WOE) 274 *F*
1 Muxus, Goblin Grandee (J22) 575
1 Opal Palace (CMM) 422
1 Outpost Siege (C17) 139
1 Patchwork Banner (BLB) 247 *F*
1 Path of Ancestry (CMM) 661
1 Purphoros, Bronze-Blooded (THB) 265
1 Raid Bombardment (WOT) 47
1 Ruby Medallion (CMM) 405
1 Rundvelt Hordemaster (DMU) 142
1 Searslicer Goblin (FDN) 93 *F*
1 Shared Animosity (WOT) 49
1 Soulstone Sanctuary (FDN) 133
1 Sundering Eruption (MH3) 248
1 Thrill of Possibility (STA) 46
1 Treasure Nabber (CMM) 265
1 Urabrask the Hidden (CLB) 811
1 Sol Ring (impressão não definida)
1 Skullclamp (impressão não definida)
1 Idol of Oblivion (impressão não definida)
1 Slate of Ancestry (impressão não definida)
1 Skirk Prospector (impressão não definida)
1 Goblin Trashmaster (impressão não definida)
1 Lightning Greaves (impressão não definida)
1 Thousand-Year Elixir (impressão não definida)
1 Jeska's Will (impressão não definida)
1 Blasphemous Act (impressão não definida)
1 Chaos Warp (impressão não definida)
1 Impact Tremors (impressão não definida)
1 Vandalblast (impressão não definida)
1 War Room (impressão não definida)
1 Wild Magic Surge (impressão não definida)
1 Goblin Chieftain (impressão não definida)
1 Goblin Ringleader (impressão não definida)
1 Pashalik Mons (impressão não definida)
1 Goblin Chirurgeon (impressão não definida)
1 Goblin Recruiter (impressão não definida)
1 The One Ring (impressão não definida)
1 Mana Vault (impressão não definida)
1 Ancient Tomb (impressão não definida)
1 Cavern of Souls (impressão não definida)
1 Three Tree City (impressão não definida)

```

## 14. Fontes e pesquisa


| Fonte | Link | Uso na análise | Ressalva |
|---|---|---|---|
| Scryfall — Krenko | [Abrir](https://scryfall.com/card/fdn/204/krenko-mob-boss) | Texto Oracle da habilidade ativada. | Confirma que Krenko conta os Goblins controlados, incluindo o próprio Krenko. |
| EDH.Wiki — Krenko Goblins | [Abrir](https://edh.wiki/commanders/krenko-mob-boss/goblins/) | Estratégia tribal, haste e motores de ficha. | Benchmark de estratégia, não prescrição automática. |
| EDHREC — Krenko Optimized | [Abrir](https://edhrec.com/commanders/krenko-mob-boss/optimized) | Frequência atual de ramp, compra, payoff e sinergia tribal. | Snapshot consultado em 2026-10; populações incluem listas otimizadas. |
| EDHREC — Krenko Optimized Goblins | [Abrir](https://edhrec.com/commanders/krenko-mob-boss/optimized/goblins) | Goblin Warchief, Chieftain, Recruiter, Ringleader, Pashalik e Chirurgeon como benchmarks. | Usado para buscar gaps da V2, não para copiar a lista média. |
| Scryfall — Marvin, Murderous Mimic | [Abrir](https://scryfall.com/search?q=%21%22Marvin%2C+Murderous+Mimic%22) | Texto Oracle e rulings. | Marvin copia habilidades ativadas de outras criaturas; não copia habilidades estáticas/disparadas. |
| Scryfall search — Goblin Recruiter | [Abrir](https://scryfall.com/search?q=%21%22Goblin+Recruiter%22) | Texto Oracle e rulings. | Tutor/ordenação do topo; importante com Muxus e Ringleader. |
| Scryfall search — Pashalik Mons | [Abrir](https://scryfall.com/search?q=%21%22Pashalik+Mons%22) | Texto Oracle e rulings. | Converte mortes de Goblins em dano e fichas em alcance. |
| Commander ban list | [Abrir](https://magic.wizards.com/en/banned-restricted-list) | Lista oficial vigente de cartas banidas. | Legalidade deve ser revalidada antes de importar mudanças; não presumir banimento por ser forte. |
| EDHREC — Optimized average list | [Abrir](https://edhrec.com/average-decks/krenko-mob-boss/optimized/goblins) | Estrutura de decks configurados como otimizados. | Comparação de funções; combo Thornbite Staff fica fora da V3-base. |

**Data da pesquisa:** 14/10/2026. EDHREC é usado como benchmark de prevalência/sinergia, não como receita. Dados de listas otimizadas não equivalem a recomendação automática para uma lista casual. Revalidar texto Oracle, banlist e legalidade antes de executar mudanças.

## 15. Próximos passos

1. Testar V3 sem o pacote Thornbite Staff, registrando partidas para avaliar o motor tribal por si só.
2. Jogar pelo menos 5 partidas com a mesma versão, anotando primeira ativação de Krenko, cartas mortas, proteção, compra e capacidade de fechar.
3. Só então decidir se o pacote de combo deve entrar como V4 opcional ou se a prioridade é mais interação.

### Prompt de retomada

> Continue o projeto Krenko, Mob Boss usando este Handover V3 e `Krenko_Goblins_V3_Deep_Review.xlsx`. Mantenha CURRENT congelada, V2 arquivada e V3 como proposta não testada. Não presumir aquisição/implementação. Preservar a tribalidade, Marvin, a compra e a proteção do comandante; não incorporar Thornbite Staff + Goblin Bombardment sem decisão explícita do usuário. Reavalie regras e resultados reais antes de aumentar a nota.
