# Handover específico — Wilhelt, the Rotcleaver | Zombie Tribal V2

**Data da revisão:** 14 de outubro de 2026  
**Versão atual:** CURRENT (lista original do usuário, preservada)  
**Versão recomendada:** PROPOSED V2 (9 trocas, não testada)  
**Comandante:** Wilhelt, the Rotcleaver  
**Identidade:** Dimir (azul/preto)  
**Estratégia priorizada:** Zombie tribal como eixo primário; criação/uso de tokens como segundo eixo; recursão, compra e dreno como conversores de valor.

---

## 1. Resumo executivo e notas

- **CURRENT: 7,7/10** como construção para Commander casual forte. A lista já tem motores premium, boa massa crítica tribal e uma condição de vitória por loop que pode ser letal.
- **PROPOSED V2: 8,7/10 projetado**, ainda não testado. O ganho projetado vem de mais densidade de Zombies relevantes, The Scarab God, Grave Titan, Cryptbreaker, Death Baron, Accursed Marauder, Vengeful Dead e multiplicação de gatilhos com Roaming Throne.
- A contagem de criaturas Zombie no maindeck sobe de 26 em CURRENT para 30 em PROPOSED V2 (exclui Wilhelt); entram seis Zombies e saem dois Zombies, enquanto The Scarab God não é Zombie e Roaming Throne, embora impresso como Golem, ganha o tipo Zombie em campo se esse tipo for escolhido.
- As notas são estimativas analíticas, não taxas de vitória. Só playtests reais podem confirmar se a proposta melhora consistência e resultado.
- Não é uma reconstrução de estratégia: a lista original fica registrada como CURRENT; nenhuma sugestão é tratada como adquirida ou testada.

## 2. Leitura correta do comandante

Wilhelt tem dois eixos:
1. Quando outro Zombie seu morre e não tinha decayed, cria um Zombie 2/2 com decayed.
2. No começo de cada end step, pode sacrificar um Zombie para comprar uma carta.

**Nuance de regras importante:** o token decayed criado por Wilhelt não faz Wilhelt gerar outro token quando morre, porque ele já tinha decayed. Isso não o torna inútil: ele pode atacar uma vez, ser sacrificado por Carrion Feeder/altar/Geralf/Gisa ou ser usado na compra de Wilhelt, conforme a linha de jogo.

O melhor fluxo é: jogar Zombies não-decaídos; convertê-los em tokens com Wilhelt quando morrem; usar o token decayed para comprar, alimentar sac outlets ou pagar custos de cartas; converter o volume resultante em compra, recursão, dreno ou combate.

## 3. Diagnóstico estrutural de CURRENT

### Pontos fortes

- **Pacote de combo já presente:** Gravecrawler, Phyrexian Altar, Diregraf Captain e Plague Belcher.
- **Token engines:** Diregraf Colossus, Headless Rider, Ghoulcaller Gisa, Cleaver Skaab, Army of the Damned, Necrotic Hex, Empty the Laboratory, Wand of Orcus e outras peças.
- **Card advantage:** Necropotence, Rhystic Study, Kindred Discovery, Undead Augur, Fell Stinger e Blood Scrivener.
- **Recursão:** Living Death, Reanimate, Victimize, Lich-Knights' Conquest, Relentless Dead, Zul Ashur, Liliana, Death's Majesty e Sidisi, Regent of the Mire.
- **Payoffs tribais:** Diregraf Captain, Plague Belcher, Undead Warchief, Eternal Skylord, Gleaming Overseer e Gray Merchant of Asphodel.

### Gargalos reais

- Faltam alguns Zombies de alto impacto para este estilo: The Scarab God, Death Baron, Cryptbreaker, Accursed Marauder, Vengeful Dead e Grave Titan. Noxious Ghoul também é uma opção poderosa, mas condicional, por afetar seus próprios não-Zombies.
- Alguns motores de token são lentos ou dependem de já estar à frente — especialmente Endless Ranks of the Dead e Dreadhorde Invasion.
- Parte do plano de dreno/controle vem de permanentes genéricos que não reforçam a identidade tribal, principalmente Dictate of Erebos e Funeral Room // Awakening Hall.
- Há **33 terrenos físicos** e Malakir Rebirth como MDFC que pode funcionar como terreno. A base é razoável com pedras, Rooftop Storm e Urza's Incubator, mas a curva ainda tem mágicas de 6–8 manas. Registre mãos com pouca mana; não aumente ou reduza terrenos só por teoria sem observar os testes.

## 4. Combo já presente — proteger e manter

### Gravecrawler + Phyrexian Altar + Diregraf Captain
1. Controle Diregraf Captain; ele é um Zombie e satisfaz o requisito de Gravecrawler.
2. Conjure Gravecrawler do cemitério pagando {B}.
3. Sacrifique Gravecrawler para Phyrexian Altar, adicionando {B}.
4. Use essa mana para conjurar Gravecrawler novamente.
5. Cada morte de Gravecrawler faz Diregraf Captain disparar e cada oponente perde 1 vida. Repita o ciclo até os oponentes serem eliminados, salvo interação.

**Payoff alternativo:** Plague Belcher também drena cada oponente quando outro Zombie seu morre. Wilhelt não é obrigatório para essa linha, mas cria um token decayed por morte de Gravecrawler e transforma a linha em valor adicional.

**Regra de continuidade:** não cortar Gravecrawler, Phyrexian Altar, Diregraf Captain ou Plague Belcher sem uma decisão explícita de abandonar o combo. O deck não precisa se tornar combo-centric; essa linha é um plano B já coerente com a tribo.

### Segunda linha explosiva já presente — Rooftop Storm + Acererak

Acererak the Archlich **é um Zombie Wizard**. Rooftop Storm faz mágicas de criatura Zombie custarem {0}. Enquanto Tomb of Annihilation não tiver sido completada, o ETB de Acererak o devolve à mão e faz você venturar em uma masmorra; isso permite conjurá-lo novamente e repetir o processo. A linha é interrompida se Acererak não retornar à mão, Rooftop Storm deixar o campo, uma conjuração for anulada ou Tomb of Annihilation for completada.

O loop de conjurações é especialmente relevante nesta lista porque ela já contém **Diregraf Colossus** e **Mirkwood Bats**:
- Se houver ao menos uma carta de criatura no seu cemitério, as conjurações repetidas de Acererak podem disparar Diregraf Colossus e produzir tokens Zombie repetidamente.
- Cada token que entra pode disparar Mirkwood Bats, fazendo cada oponente perder vida. Em condições normais da linha, isso pode fechar o jogo sem depender de ataque.
- Sem Diregraf Colossus, Acererak ainda oferece repetidas entradas/aventuras, mas o valor e a capacidade de vencer dependem das salas das masmorras e de outros payoffs.

**Implicação para as melhorias:** manter Acererak, Rooftop Storm, Diregraf Colossus e Mirkwood Bats é importante. O segundo combo reforça a decisão de não cortar peças só para adicionar payoffs genéricos; ele já combina o tema Zombie, produção de tokens e conversão em dano.

## 5. PROPOSED V2 — nove trocas recomendadas

| OUT | IN | Justificativa principal | Custo/risco |
|---|---|---|---|
| Hostile Hostel | Lazotep Quarry | O Quarry é sac outlet por mana e recursão que cria uma cópia 4/4 preta Zombie de criatura do cemitério. | A cópia exige {X}{2}, tap + sacrificar um Desert, e apenas como feitiço; ativar sacrificando o próprio Quarry consome a fonte de mana. |
| Unstoppable Slasher | The Scarab God | Troca um Zombie Assassin autônomo, focado em conectar em combate, por um motor que cria cópias 4/4 Zombie de qualquer cemitério e dá dreno/seleção no upkeep. Isso melhora tokens, recursão e valor de mesa. | Slasher é realmente Zombie, tem deathtouch e faz o jogador perder metade da vida ao conectar; ele pode voltar após morrer, então é uma ameaça forte que será sacrificada para abrir espaço a um motor de valor mais amplo. Scarab God também não é Zombie em si e custa cinco manas. |
| Cursecloth Wrappings | Death Baron | Zombie lord com +1/+1 e deathtouch, melhora combate e aumenta densidade tribal. | Perde-se o embalm-like do artefato; Death Baron é vulnerável a remoção de criatura. |
| Dreadhorde Invasion | Cryptbreaker | Um Zombie de baixo custo que cria tokens ao descartar criatura e compra ao virar três Zombies. | Perde a linha de Army que cresce ao longo do tempo; Cryptbreaker requer carta para descartar e três Zombies para comprar. |
| Dictate of Erebos | Accursed Marauder | Mantém a interação centrada em Zombies: ETB força cada jogador a sacrificar uma criatura não-token, e o corpo pode alimentar os motores tribais. | Muito menos abrangente que Dictate; não atinge tokens e os jogadores escolhem o sacrifício. É uma escolha de identidade tribal com custo de controle. |
| Funeral Room // Awakening Hall | Vengeful Dead | Converte mortes de Zombies em dreno de todos os oponentes e fortalece a redundância do combo. | Perde o dreno genérico e o lado Awakening Hall de reanimação em massa; outras formas de reanimação permanecem. |
| Liliana's Reaver | Grave Titan | Grave Titan gera dois Zombies ao entrar e dois ao atacar; dá valor imediato e recorrente. | Custa seis manas e aumenta a pressão na curva superior. |
| Midnight Clock | Postmortem Professor | Zombie de 2 manas, drena ao atacar e pode voltar do cemitério exilando instantânea/feitiço. | Perde pedra de mana e possível refill tardio; Professor não pode bloquear e precisa atacar para drenar. |
| Endless Ranks of the Dead | Roaming Throne | Escolhendo Zombie, o Throne torna-se Zombie em campo e duplica gatilhos de outras criaturas suas do tipo escolhido: Wilhelt, Diregraf Captain, Plague Belcher, Undead Augur e Headless Rider, entre outros. | Não faz tokens sozinho e não é impresso como Zombie na lista; Endless Ranks podia produzir muito token se sobrevivesse vários upkeeps. |

### Por que The Scarab God é obrigatório para testar

O texto Oracle diz: no começo do upkeep, cada oponente perde X vida e você faz scry X, em que X é sua quantidade de Zombies. Por {2}{U}{B}, exila uma carta de criatura de qualquer cemitério e cria uma cópia token 4/4 preta que também é Zombie. A cópia não só aumenta a contagem: pode trazer a habilidade de ETB ou outras habilidades impressas, sujeita às exceções do texto. É uma peça de valor, recursão e dreno.

### Por que Lazotep Quarry tem um custo de oportunidade real

A habilidade não é grátis. A ativação de cópia exige pagar {X}{2}, virar Quarry e sacrificar um Desert, exilando criatura de mana value X do cemitério para criar cópia 4/4 preta Zombie. A habilidade pode copiar uma criatura cara sem pagar seu custo normal, mas o token é 4/4 e a ativação só pode ser feita como feitiço. Como terreno, ele também é incolor e pode sacrificar uma criatura por mana de qualquer cor; portanto, entra como utilidade, não como fonte perfeita de cores.

## 6. Novos e antigos Zombies pesquisados

### Prioridade A — entrar na V2
- **The Scarab God:** geração recorrente de Zombies, recursão de cemitério e dreno/scry proporcional à mesa.
- **Death Baron:** lord + deathtouch; relevante para combate, bloqueios e defesa contra criaturas grandes.
- **Cryptbreaker:** motor barato que converte criaturas mortas na mão em tokens e tokens existentes em cartas.
- **Accursed Marauder:** corpo Zombie barato com ETB que força cada jogador a sacrificar uma criatura não-token. Aumenta densidade tribal e interage, mas é menos eficaz contra mesas de tokens e os jogadores escolhem o que sacrificar.
- **Vengeful Dead:** dreno de todos os oponentes quando Zombies morrem; payoff tribal que também fecha o combo.
- **Grave Titan:** um dos melhores corpos para este deck; cria tokens logo ao entrar e continua gerando ao atacar.
- **Postmortem Professor (Secrets of Strixhaven, 2026):** Zombie recente de custo {1}{B}; ao atacar, cada oponente perde 1 e você ganha 1; pode retornar do cemitério por {1}{B}, exilando instantânea/feitiço.
- **Roaming Throne:** é impresso como Golem, mas ao entrar e escolher Zombie torna-se também Zombie no campo de batalha. Além disso, dobra habilidades desencadeadas de outras criaturas suas do tipo escolhido. O teto é muito alto com Wilhelt e payoffs tribais; não é um gerador de tokens por si só.
- **Lazotep Quarry:** terreno utilitário de Modern Horizons 3 Commander (2024), com sac outlet e criação de cópia Zombie.

### Opções fortes para uma próxima rodada, não incluídas nesta V2

- **Lord of the Accursed:** outro lord; concede +1/+1 e pode dar menace aos Zombies. Priorizar se combate for a condição de vitória mais comum.
- **Cemetery Reaper:** lord que também pode exilar criatura do cemitério para criar Zombie. Comparar com Death Baron se recursão de graveyards for comum no seu meta.
- **Gisa and Geralf / Midnight Reaper:** ótimos testes posteriores para valor e compra, mas a V2 já melhora card advantage e interação sem adicionar muitas peças simultaneamente.
- **Warren Soultrader:** motor muito forte de sacrifício/tesouros, mas é Vampire, não Zombie; só priorizar se o combo/sacrifice for mais importante do que a identidade tribal estrita.
- **Ravenous Rotbelly:** Zombie que converte três Zombies sacrificados em sacrifício de criatura pelos oponentes. Forte quando a mesa já gera muitos tokens, mas cinco manas é custo relevante.

O benchmark EDH.Wiki/EDHREC mostra que Cryptbreaker, Death Baron, Noxious Ghoul, The Scarab God, Grave Titan, Undead Augur, Headless Rider, Gravecrawler e Diregraf Captain aparecem com frequência em shells de Wilhelt. Usei isso como sinal de que suas funções são reconhecidas e testadas pela comunidade; as recomendações acima derivam do encaixe específico e dos slots que substituem, não de popularidade isolada.

## 7. Grupos funcionais — teoria 8×8 adaptada

O usuário escolheu estes oito grupos. A classificação abaixo usa uma função principal por carta, embora várias cartas tenham funções secundárias. Os terrenos físicos são contabilizados à parte; Malakir Rebirth é um MDFC, não contado como terreno físico.

### 1. Ramp
Arcane Signet; Ashnod's Altar; Crowded Crypt; Dimir Signet; Phyrexian Altar; Rooftop Storm; Sol Ring; Talisman of Dominance; Urza's Incubator.  
CURRENT também tem Midnight Clock.

### 2. Draw
Blood Scrivener; Fell Stinger; Kindred Discovery; Necropotence; Rhystic Study; Undead Augur.  
V2 também tem Cryptbreaker.

### 3. Removal
Baleful Mastery; Cyclonic Rift; Damnation; Go for the Throat; Murderous Rider; Toxic Deluge; Withering Torment.  
CURRENT usa Dictate of Erebos na função de controle; V2 adiciona Accursed Marauder, um corpo Zombie com ETB de sacrifício de criatura não-token. Noxious Ghoul fica na watchlist por sua antissinergia potencial com seus próprios não-Zombies.

### 4. Recursão
Lich-Knights' Conquest; Liliana, Death's Majesty; Living Death; Malakir Rebirth; Mortuary Mire; Reanimate; Relentless Dead; Rise of the Dread Marn; Sidisi, Regent of the Mire; Victimize; Zul Ashur, Lich Lord.  
V2 acrescenta Lazotep Quarry por sua habilidade de copiar criatura do cemitério como Zombie.

### 5. Sacrifice + token
Carrion Feeder; Cleaver Skaab; Empty the Laboratory; Geralf, Visionary Stitcher; Ghoulcaller Gisa; Gravecrawler; Pyre of Heroes; Sidisi, Undead Vizier.  
Phyrexian Altar e Ashnod's Altar são contados primariamente em Ramp, embora sejam também sac outlets.

### 6. Tokens
Army of the Damned; Diregraf Colossus; Headless Rider; Necrotic Hex; Tainted Adversary; Wand of Orcus.  
CURRENT também tem Dreadhorde Invasion e Endless Ranks of the Dead. V2 os troca por Cryptbreaker, Grave Titan e por amplificação com Roaming Throne/The Scarab God.

### 7. Buff
Champion of the Perished; Eternal Skylord; Gleaming Overseer; Undead Warchief.  
CURRENT também tem Cursecloth Wrappings; V2 substitui por Death Baron.

### 8. Sinergia + WinCon
Acererak the Archlich; Diregraf Captain; Gray Merchant of Asphodel; Grim Servant; Hordewing Skaab; Mirkwood Bats; Necroduality; Plague Belcher.  
V2 adiciona The Scarab God, Vengeful Dead, Postmortem Professor e Roaming Throne; CURRENT tinha Funeral Room // Awakening Hall, Liliana's Reaver e Unstoppable Slasher.

## 8. Playtest protocol

Registrar pelo menos 8–10 partidas antes de ajustar novamente. Não concluir que uma carta é boa/ruim a partir de apenas uma partida.

Por partida, registrar:
1. Quantos terrenos e aceleradores estavam na mão inicial e se a mão era funcional.
2. Turno em que Wilhelt entrou e começou a gerar value.
3. Quantos Zombies foram gerados por morte de Zombie, tokens por ETB e por turno.
4. Se a compra foi suficiente e quais motores realmente compraram cartas.
5. Se Accursed Marauder conseguiu atingir ameaças relevantes ou foi sacrificado por seu próprio gatilho; observar também se mesas de tokens reduzem seu impacto.
6. Se The Scarab God produziu cópia valiosa e se sobreviveu ao upkeep.
7. Se a linha Gravecrawler + altar + payoff ou a linha Rooftop Storm + Acererak + Diregraf Colossus + Mirkwood Bats apareceu, e se foi interrompida.
8. Se a vitória veio de combo, dreno, combate ou recursão em massa.

### Critérios para manter ou reverter
- **Cryptbreaker:** contar ativações de token e cartas compradas; reavaliar se faltar criatura para descartar.
- **Death Baron:** verificar o quanto de deathtouch/+1/+1 realmente alterou ataques ou bloqueios.
- **Accursed Marauder:** observar se o sacrifício forçado atinge criaturas relevantes ou se costuma sacrificá-lo imediatamente. Noxious Ghoul fica como alternativa de metagame, não inclusão confirmada.
- **Grave Titan:** contar tokens efetivamente produzidos antes de ser removido.
- **Roaming Throne:** registrar quais gatilhos duplicou e se a mesa o removeu antes do primeiro valor.
- **Scarab God:** medir valor do primeiro uso de habilidade e do primeiro upkeep.
- **Lazotep Quarry:** anotar se a habilidade de cópia foi utilizada; se nunca houver janela/mana, sua inclusão pode ter custo maior que o benefício.

## 9. Lista CURRENT preservada

- 1 Wilhelt, the Rotcleaver
- 1 Accursed Duneyard
- 1 Acererak the Archlich
- 1 Arcane Signet
- 1 Army of the Damned
- 1 Ashnod's Altar
- 1 Baleful Mastery
- 1 Barad-dûr
- 1 Blood Scrivener
- 1 Bojuka Bog
- 1 Carrion Feeder
- 1 Champion of the Perished
- 1 Choked Estuary
- 1 Clearwater Pathway
- 1 Cleaver Skaab
- 1 Command Tower
- 1 Crowded Crypt
- 1 Cursecloth Wrappings
- 1 Cyclonic Rift
- 1 Damnation
- 1 Darkslick Shores
- 1 Darkwater Catacombs
- 1 Dictate of Erebos
- 1 Dimir Aqueduct
- 1 Dimir Signet
- 1 Diregraf Captain
- 1 Diregraf Colossus
- 1 Dreadhorde Invasion
- 1 Empty the Laboratory
- 1 Endless Ranks of the Dead
- 1 Esper Panorama
- 1 Eternal Skylord
- 1 Exotic Orchard
- 1 Fell Stinger
- 1 Funeral Room // Awakening Hall
- 1 Geralf, Visionary Stitcher
- 1 Ghoulcaller Gisa
- 1 Gleaming Overseer
- 1 Gloomlake Verge
- 1 Go for the Throat
- 1 Gravecrawler
- 1 Gray Merchant of Asphodel
- 1 Grim Servant
- 1 Headless Rider
- 1 Hordewing Skaab
- 1 Hostile Hostel
- 4 Island
- 1 Kindred Discovery
- 1 Lich-Knights' Conquest
- 1 Liliana's Reaver
- 1 Liliana, Death's Majesty
- 1 Living Death
- 1 Lonely Sandbar
- 1 Malakir Rebirth
- 1 Midnight Clock
- 1 Mirkwood Bats
- 1 Mortuary Mire
- 1 Murderous Rider
- 1 Myriad Landscape
- 1 Necroduality
- 1 Necropotence
- 1 Necrotic Hex
- 1 Path of Ancestry
- 1 Phyrexian Altar
- 1 Plague Belcher
- 1 Pyre of Heroes
- 1 Reanimate
- 1 Relentless Dead
- 1 Rhystic Study
- 1 Rise of the Dread Marn
- 1 River of Tears
- 1 Rooftop Storm
- 1 Shipwreck Marsh
- 1 Sidisi, Regent of the Mire
- 1 Sidisi, Undead Vizier
- 1 Sol Ring
- 1 Sunken Hollow
- 6 Swamp
- 1 Tainted Adversary
- 1 Tainted Isle
- 1 Talisman of Dominance
- 1 Temple of Deceit
- 1 Toxic Deluge
- 1 Unclaimed Territory
- 1 Undead Augur
- 1 Undead Warchief
- 1 Unstoppable Slasher
- 1 Urza's Incubator
- 1 Victimize
- 1 Wand of Orcus
- 1 Withering Torment
- 1 Zul Ashur, Lich Lord

## 10. Lista PROPOSED V2 — 100 cartas, incluindo comandante

- 1 Wilhelt, the Rotcleaver
- 1 Accursed Duneyard
- 1 Acererak the Archlich
- 1 Arcane Signet
- 1 Army of the Damned
- 1 Ashnod's Altar
- 1 Baleful Mastery
- 1 Barad-dûr
- 1 Blood Scrivener
- 1 Bojuka Bog
- 1 Carrion Feeder
- 1 Champion of the Perished
- 1 Choked Estuary
- 1 Clearwater Pathway
- 1 Cleaver Skaab
- 1 Command Tower
- 1 Crowded Crypt
- 1 Death Baron
- 1 Cyclonic Rift
- 1 Damnation
- 1 Darkslick Shores
- 1 Darkwater Catacombs
- 1 Accursed Marauder
- 1 Dimir Aqueduct
- 1 Dimir Signet
- 1 Diregraf Captain
- 1 Diregraf Colossus
- 1 Cryptbreaker
- 1 Empty the Laboratory
- 1 Roaming Throne
- 1 Esper Panorama
- 1 Eternal Skylord
- 1 Exotic Orchard
- 1 Fell Stinger
- 1 Vengeful Dead
- 1 Geralf, Visionary Stitcher
- 1 Ghoulcaller Gisa
- 1 Gleaming Overseer
- 1 Gloomlake Verge
- 1 Go for the Throat
- 1 Gravecrawler
- 1 Gray Merchant of Asphodel
- 1 Grim Servant
- 1 Headless Rider
- 1 Hordewing Skaab
- 1 Lazotep Quarry
- 4 Island
- 1 Kindred Discovery
- 1 Lich-Knights' Conquest
- 1 Postmortem Professor
- 1 Liliana, Death's Majesty
- 1 Living Death
- 1 Lonely Sandbar
- 1 Malakir Rebirth
- 1 Grave Titan
- 1 Mirkwood Bats
- 1 Mortuary Mire
- 1 Murderous Rider
- 1 Myriad Landscape
- 1 Necroduality
- 1 Necropotence
- 1 Necrotic Hex
- 1 Path of Ancestry
- 1 Phyrexian Altar
- 1 Plague Belcher
- 1 Pyre of Heroes
- 1 Reanimate
- 1 Relentless Dead
- 1 Rhystic Study
- 1 Rise of the Dread Marn
- 1 River of Tears
- 1 Rooftop Storm
- 1 Shipwreck Marsh
- 1 Sidisi, Regent of the Mire
- 1 Sidisi, Undead Vizier
- 1 Sol Ring
- 1 Sunken Hollow
- 6 Swamp
- 1 Tainted Adversary
- 1 Tainted Isle
- 1 Talisman of Dominance
- 1 Temple of Deceit
- 1 Toxic Deluge
- 1 Unclaimed Territory
- 1 Undead Augur
- 1 Undead Warchief
- 1 The Scarab God
- 1 Urza's Incubator
- 1 Victimize
- 1 Wand of Orcus
- 1 Withering Torment
- 1 Zul Ashur, Lich Lord

## 11. Fontes consultadas

- EDH.Wiki — Wilhelt Zombies: https://edh.wiki/commanders/wilhelt-the-rotcleaver/zombies/
- Scryfall — Wilhelt, the Rotcleaver: https://scryfall.com/card/mic/2/wilhelt-the-rotcleaver
- Scryfall — Accursed Marauder: https://scryfall.com/card/mh3/80/accursed-marauder
- Unstoppable Slasher Oracle/type: https://scryfall.com/card/dsk/119/unstoppable-slasher
- EDHREC — Average Wilhelt Zombies: https://edhrec.com/average-decks/wilhelt-the-rotcleaver/zombies
- EDHREC — Wilhelt Zombies: https://edhrec.com/commanders/wilhelt-the-rotcleaver/zombies
- The Scarab God Oracle/rulings: https://mtg.wtf/card/hou/145/The-Scarab-God
- Lazotep Quarry Oracle/rulings: https://mtg.wtf/card/m3c/131/Lazotep-Quarry
- Postmortem Professor Oracle / 2026: https://mtg.wtf/card/sos/327/Postmortem-Professor
- Accursed Duneyard Oracle: https://mtg.wtf/card/drc/20/Accursed-Duneyard
- Wizards — Secrets of Strixhaven Release Notes: https://magic.wizards.com/en/news/feature/secrets-of-strixhaven-release-notes
- Scryfall — Acererak the Archlich: https://scryfall.com/card/afr/87/acererak-the-archlich
- Scryfall — Rooftop Storm: https://scryfall.com/card/mic/103/rooftop-storm
- Scryfall — Diregraf Colossus: https://scryfall.com/card/mic/112/diregraf-colossus
- Scryfall — Mirkwood Bats: https://scryfall.com/card/ltr/95/mirkwood-bats
- Regras oficiais Magic: https://magic.wizards.com/en/rules

## 12. Próximos passos

1. Testar a PROPOSED V2 sem outras alterações simultâneas.
2. Registrar 8–10 partidas no Playtest Log do Dashboard.
3. Revisar a base de mana e as cartas C/B somente com evidências das partidas; manter a identidade Zombie + tokens.

**Prompt curto para retomar em novo chat:**  
“Continue a análise profunda do deck Wilhelt com o Handover específico e o Dashboard V2. CURRENT permanece como enviada pelo usuário; PROPOSED V2 tem nove trocas não testadas. Primeiro confira os arquivos e reconcilie as listas. Preserve o combo Gravecrawler + Phyrexian Altar + Diregraf Captain/Plague Belcher salvo autorização explícita. A prioridade é Zombie tribal, tokens como segundo eixo, recursão/draw/dreno, sem transformar a lista numa pilha de payoffs genéricos. Use as evidências de playtests antes de fazer novas trocas.”
