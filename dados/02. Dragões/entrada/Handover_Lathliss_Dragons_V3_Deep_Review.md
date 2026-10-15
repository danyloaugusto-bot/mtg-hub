# HANDOVER V3 — Lathliss, Dragon Queen — Mono-Red Dragons

**Revisão:** V3 Deep Audit — 14/10/2026  
**Estado:** CURRENT congelada; PROPOSED V2 arquivada; PROPOSED V3 sugerida e não testada.  
**Identidade pretendida:** tribal de Dragões de alto poder casual, com aceleração eficiente, geração de fichas 5/5, dano por entradas, Tesouros e combates extras.  
**Objetivo de potência:** construir uma versão próxima de 10/10 para este plano, sem afirmar que isso equivale a 10/10 universal ou a win rate comprovada.

## 1. Resumo executivo

A CURRENT já tem payoffs de alta qualidade — Dragon Tempest, Molten Echoes, Roaming Throne, Utvara Hellkite, Goldspan Dragon, The Reaver Cleaver, Scourge of the Throne, Hellkite Charger — mas a lista tem uma curva elevada e poucas fontes de vantagem de cartas verdadeiramente recorrente. A V2 melhorou a estrutura; a V3 aprofunda os três gargalos: aceleração inicial, fluxo de cartas e redundância de payoffs de Dragões.

**Nota metodológica:** a antiga nota V2 de 8,5/10 foi atribuída sem uma rubrica ponderada publicada. Para evitar falsa precisão, CURRENT, V2 e V3 foram recalculadas pela mesma rubrica de dez critérios, com pesos que somam 100%. Por isso a V2 agora aparece em cerca de 8,0/10: isso é uma rebaseline transparente, não uma afirmação de que o deck piorou. A V3 é projeção estrutural e continua dependendo de playtests.

| Estado | Nota estrutural ponderada | Interpretação |
|---|---:|---|
| CURRENT | **5,9/10** | Identidade forte, estrutura irregular em ramp e draw. |
| PROPOSED V2 | **8,0/10** | Grande melhoria, mas ainda havia slots e motores de valor a investigar. |
| PROPOSED V3 | **9,1/10** | Proposta de potência alta, condicionada a testes de mana, compra e resilência. |

## 2. Auditoria estrutural

- **100 cartas** incluindo comandante nas três listas; sem duplicatas não básicas detectadas.
- **CURRENT:** 32 terrenos físicos + 3 MDFCs = 35 cartas com opção de terreno.
- **PROPOSED V2:** 31 terrenos físicos + 4 MDFCs = 35 cartas com opção de terreno.
- **PROPOSED V3:** 31 terrenos físicos + 4 MDFCs = 35 cartas com opção de terreno.
- MDFCs são contadas como uma carta; entram no grupo pela função principal da face de mágica, mas são contabilizadas como fontes funcionais de terreno.
- A proposta assume um nível de potência alto-casual / otimizado. Chrome Mox, Mana Vault e Ancient Tomb aceleram de forma significativa e podem aumentar a percepção de ameaça; não são upgrades neutros para qualquer mesa.

### Correções e fatos de regras preservados

- **Lathliss, Dragon Queen:** quando outro Dragão não ficha entra sob seu controle, cria uma ficha de Dragão 5/5 voadora. Fichas de Dragão que entram não satisfazem a condição de “outro Dragão não ficha”.
- **Roaming Throne** nomeando Dragon pode fazer a habilidade disparada de Lathliss disparar uma vez adicional. Isso aumenta fichas criadas por Dragões não ficha; não transforma fichas em gatilhos de Lathliss.
- **Chain Reaction + Wrathful Red Dragon:** Chain Reaction causa dano às criaturas. Cada Dragão seu que recebe dano pode disparar Wrathful Red Dragon, que pode causar aquela quantidade de dano a um alvo que não seja Dragão, incluindo jogadores. A limpeza continua causando dano às suas criaturas — não é uma remoção unilateral por si só —, mas os gatilhos podem converter o dano recebido em uma linha de fechamento explosiva. Verificar alvos válidos quando os gatilhos resolverem.
- **Blasphemous Act** é simétrica por padrão. Com Wrathful Red Dragon pode também gerar dano direcionado, mas não presume que seus Dragões sobrevivam.
- **Vandalblast com overload** atinge artefatos que você não controla. **Mizzium Mortars com overload** causa 4 de dano às criaturas que você não controla; é assimétrica, porém não limpa criaturas com resistência acima de 4.
- **Knollspine Dragon** repõe cartas apenas se um oponente recebeu dano naquele turno; é mais forte após combate extra, dano de gatilhos ou uma sequência de dano grande, mas pode ser medíocre quando não houve dano relevante.
- **Dragonhawk, Fate’s Tempest** dá acesso impulsivo ao exilar cartas quando entra/ataca; cartas não jogadas podem virar dano no próximo end step. O número de cartas depende da quantidade de criaturas suas com poder 4 ou maior.
- **Bonehoard Dracosaur** gera vantagem no upkeep: exila as duas cartas do topo e permite jogá-las naquele turno; cards de terreno exilados geram um token 3/1 e cards não terreno geram Tesouros.
- **Dracogenesis** é um payoff de oito manas, não um motor de compra nem um tutor. Pode explodir quando há Dragões na mão, mas fica abaixo da curva em mãos vazias ou antes de construir recursos.
- **Mana Vault** não desvira normalmente; pode-se pagar {4} no início da manutenção para desvirá-la e, se continuar virada, ela causa 1 de dano naquela manutenção. É aceleração explosiva, não ramp gratuito sem custo.

## 3. Estratégia proposta

### Early game — acelerar sem ficar sem mão

Priorizar mana e redução de custos: Sol Ring (já presente), Arcane Signet, Carnelian Orb of Dragonkind, Dragonlord’s Servant, Ruby Medallion, Herald’s Horn, Chrome Mox, Mana Vault e Urza’s Incubator. Chrome Mox custa uma carta da mão como recurso; Mana Vault não é sustentável em todos os jogos; Ancient Tomb troca vida por velocidade. Evitar mãos iniciais com muitos Dragões de seis ou sete manas e nenhuma aceleração.

### Mid game — transformar cada Dragão em múltiplos recursos

Lathliss transforma cada Dragão não ficha adicional em uma ficha 5/5. Dragon Tempest fornece ímpeto e dano escalável; Scourge of Valkas e Terror of the Peaks convertem entradas em dano; Ganax e Ancient Copper Dragon aceleram por Tesouros; Roaming Throne e Molten Echoes aumentam o valor das entradas. The One Ring, Jeska’s Will, Valakut Awakening, Dragonhawk, Bonehoard Dracosaur e Knollspine Dragon diversificam as formas de abastecer a mão.

### Late game — fechar por pressão redundante

A rota principal é a mesa aérea grande com Utvara Hellkite, Scourge of the Throne e outras fases de combate. Em paralelo, Dragon Tempest, Scourge of Valkas e Terror of the Peaks podem converter entradas em dano sem depender do combate passar. Dracogenesis aumenta o teto quando há Dragões suficientes na mão, enquanto a interação com Wrathful Red Dragon pode servir tanto como reset quanto como fechamento, desde que o risco seja aceito.

## 4. Por que a V3 melhora a V2

- Mais aceleração inicial com Chrome Mox e Mana Vault, sem sugerir um segundo Sol Ring (Sol Ring já existe na CURRENT).
- Mais acesso a mana com Ancient Tomb e proteção contra counters para mágicas de criatura Dragon por Cavern of Souls.
- Urza’s Incubator reduz custos em todo o pacote tribal; isso é melhor para sequenciar Dragões do que esperar a compra de mana adicional.
- Compra por múltiplos padrões: The One Ring (recorrente), Jeska’s Will (impulsiva e mana), Valakut Awakening (seleção/reposição) e Dragões de valor.
- Mais redundância em criaturas Dragon que produzem cartas, Tesouros e dano.
- Blasphemous Act acrescenta uma resposta ampla que pode se combinar com Wrathful Red Dragon; o pacote tem potencial alto, mas continua arriscado contra mesas sem alvos de jogador adequados ou com respostas aos gatilhos.

## 5. Mudanças da CURRENT para PROPOSED V2 (histórico preservado)


| OUT | IN | Motivo do corte | Ganho esperado | Custo / argumento contra | Prioridade | Confiança |
|---|---|---|---|---|---|
| Browbeat | The One Ring | A escolha é do oponente, então o efeito de compra é pouco confiável. | Motor de compra recorrente e proteção temporária; aumenta a consistência. | The One Ring fornece compra recorrente e proteção temporária, mas aumenta o custo em vida e a percepção de ameaça. | P1 | Alta |
| Collective Defiance | Jeska's Will | Jeska's Will oferece mais potencial de mana e acesso a cartas num turno decisivo. | Gera mana explosiva e acesso impulsivo a cartas; especialmente forte com o comandante em campo. | Defiance é modal e pode continuar sendo útil como resposta ou ajuste de mão. | P1 | Alta |
| Dictate of the Twin Gods | Wrathful Red Dragon | O multiplicador simétrico pode beneficiar os adversários; Wrathful apoia dano tribal e interage com Chain Reaction. | Converte dano recebido pelos seus Dragões em dano direcionado; combina com Chain Reaction. | Perde-se o multiplicador global; Wrathful precisa que seus Dragões recebam dano. | P1 | Alta |
| Powerbalance | Ruby Medallion | Powerbalance depende de combinar o valor de mana de mágicas adversárias com o topo; Medallion reduz custos de forma previsível. | Reduz a parte genérica do custo de mágicas vermelhas ao longo do jogo. | Powerbalance às vezes conjura uma mágica de graça, mas o resultado é pouco controlável. | P1 | Alta |
| Pyroclasm | Earthquake | Earthquake escala e normalmente preserva Dragões voadores ao limpar o chão. | Limpeza escalável de criaturas sem voar; normalmente preserva os Dragões voadores. | Earthquake causa dano a jogadores e a criaturas suas sem voar. | P2 | Alta |
| Dragon Mage | Scourge of Valkas | Scourge converte entradas de Dragões em dano sem recarregar a mão de todos os oponentes. | Transforma entradas de Dragões em dano; escala com fichas de Lathliss e Roaming Throne. | Sai uma fonte de compra tipo wheel; será importante testar os novos motores de compra. | P1 | Alta |
| Nyx Lotus | Dragonlord's Servant | Servant atua desde o turno 2 e reduz o custo dos Dragões antes de atingir devoção alta. | Redução de custo por duas manas que melhora o começo do jogo. | Nyx Lotus pode gerar muita mana mais tarde se a devoção vermelha for alta. | P1 | Alta |
| War's Toll | Herald's Horn | Horn apoia o plano tribal com redução de custos e seleção no upkeep. | Reduz custos tribais e filtra criaturas no topo durante a manutenção. | War's Toll é disruptiva/política e pode ser mantida se for parte da identidade desejada. | P1 | Alta |
| Fury of the Horde | Terror of the Peaks | Terror transforma a jogada natural de Dragões e fichas em alcance imediato. | Converte entradas de Dragões e fichas em dano, ajudando a fechar a partida. | Perde-se um combate extra; Charger, Scourge of the Throne, Great Train Heist e Overpowering Attack permanecem. | P1 | Alta |
| Reckless Endeavor | Chandra's Ignition | Ignition troca variância por uma remoção que escala com o poder de um Dragão. | Usa o poder de um Dragão grande para limpar criaturas e causar dano aos oponentes. | Endeavor pode gerar Tesouros e limpar a mesa em algumas resoluções; Ignition pode matar outras criaturas suas. | P1 | Alta |
| Storm's Wrath | Ganax, Astral Hunter | Ganax adiciona um motor de Tesouro persistente; Chain Reaction, Mizzium Mortars, Earthquake e Ignition continuam como respostas. | Cada Dragão que entra, inclusive ficha de Lathliss, cria Tesouro. | Storm's Wrath limpa criaturas voadoras/planeswalkers em alguns cenários; a troca reduz uma resposta de dano amplo. | P1 | Alta |
| Crawlspace | Lightning Greaves | Greaves protege comandante/Dragão-chave e dá ímpeto. | Protege Lathliss ou um Dragão-chave e fornece ímpeto para aumentar a velocidade. | Crawlspace limita ataques contra você e pode ser melhor em mesas muito agressivas. | P1 | Alta |
| Temple of the False God | Valakut Awakening // Valakut Stoneforge | Troca uma fonte incolor condicional por MDFC que filtra a mão e pode ser terreno. | Filtra a mão e pode ser terreno quando necessário. | A proposta passa de 32 terrenos físicos + 3 MDFCs para 31 terrenos físicos + 4 MDFCs; a opção de fonte de mana se mantém em 35. | P2 | Alta |

## 6. Mudanças incrementais de PROPOSED V2 para PROPOSED V3


| OUT | IN | Motivo do corte | Ganho esperado | Custo / argumento contra | Prioridade | Confiança |
|---|---|---|---|---|---|
| Chaos Dragon | Chrome Mox | Criatura de custo baixo, mas o ataque aleatório e impacto de combate não corrigem o gargalo estrutural. | Aceleração gratuita para adiantar Lathliss e ameaças; o deck já tem Sol Ring, então este slot precisa de outra fonte de aceleração. | Exila outra carta não artefato/não terreno da mão e reduz recursos imediatos; perde-se um corpo Dragon barato. | P1 | Alta |
| Reckless Barbarian | Mana Vault | Aceleração de uso único que exige sacrificar a criatura. | Burst de três manas por um mana investido; aumenta a chance de turno acelerado para Lathliss. | Mana Vault não desvira naturalmente; pode pagar {4} para desvirar e, se ficar virado no início da manutenção, causa 1 de dano. É mana incolor. | P1 | Alta |
| Mob Verdict | Knollspine Dragon | Votação política variável e difícil de controlar como remoção/compra. | Dragão que pode repor a mão em grande escala após dano relevante aos oponentes. | Custa sete e depende de ter causado dano relevante; planejar conjuração após dano explosivo. | P1 | Alta |
| Electrodominance | Dracogenesis | Feitiço flexível, mas exige X + RR e sua eficiência depende de ter outra mágica útil na mão. | Payoff de teto alto: permite conjurar mágicas de Dragão sem pagar seus custos após resolver. | Custa oito e pode ficar fraca sem Dragões na mão; incluída como payoff de topo com draw/ramp reforçados. | P2 | Média |
| Gadrak, the Crown-Scourge | Dragonhawk, Fate's Tempest | Gadrak gera Tesouros quando criaturas não ficha morrem, mas o motor depende de mortes e a restrição de ataque pode importar. | Dragão voador de valor: exila cartas ao entrar/atacar e converte cartas não jogadas em dano. | Gadrak pode gerar muitos Tesouros em wipes; testar se a nova fonte de cartas compensa. | P1 | Alta |
| Enduring Courage | Bonehoard Dracosaur | Bônus temporário de poder/haste é redundante com Dragon Tempest, Rising of the Day e Lightning Greaves. | Dragão que fornece vantagem recorrente e cria Tesouros/fichas a cada manutenção; dispara Lathliss ao entrar. | Custa cinco e exige sobreviver até manutenção; Enduring Courage é resiliente por voltar como encantamento. | P1 | Alta |
| Inferno of the Star Mounts | Ancient Copper Dragon | Finalizador autossuficiente, mas seu mana sink não apoia tanto o motor de Tesouros/cadeia de Dragões. | Gera potencialmente muitos Tesouros ao causar dano de combate e acelera a cadeia de Dragões. | Precisa conectar e depende de dado; Inferno é mais previsível e resiliente contra dano. | P1 | Média |
| Hedron Archive | Urza's Incubator | Rampa e compra tardios; custa quatro e não reduz custos das ameaças. | Reduz em duas manas genéricas mágicas do tipo escolhido; nomear Dragon. | Não compra nem gera mana diretamente; depende da densidade de Dragões e de permanecer em campo. | P1 | Alta |
| Untimely Malfunction | Blasphemous Act | Flexibilidade de dois manas não substitui a necessidade de uma limpeza ampla e eficiente. | Reset amplo frequentemente barato e segunda peça para a sinergia com Wrathful Red Dragon. | Simétrico por padrão e pode destruir seus Dragões; combinação explosiva pode atrair remoção e causar dano elevado à mesa. | P1 | Alta |
| Terrain Generator | Cavern of Souls | O efeito de colocar terrenos básicos em campo é lento neste deck monocolorido. | Nomear Dragon para que mágicas de criatura Dragon não sejam anuladas; mana incolor de base. | Não produz vermelho e protege apenas mágicas de criatura do tipo nomeado. | P2 | Alta |
| Barbarian Ring | Ancient Tomb | A habilidade de dano tem limiar de cemitério e raramente resolve o gargalo de mana. | Aceleração de dois manas incolores à custa de dois pontos de vida por uso. | Não produz vermelho e causa dano; exige avaliar fontes coloridas e o custo acumulado. | P1 | Alta |

### Argumentos contra as escolhas mais relevantes

- **Chrome Mox / Mana Vault / Ancient Tomb:** aceleram bastante, mas fazem gastar carta ou vida e aumentam a vulnerabilidade a decisões de mulligan ruins. Se o ambiente casual não acompanhar, podem tornar o deck excessivamente ameaçador.
- **Urza’s Incubator:** perde valor se for removido antes de você jogar vários Dragões ou se a mão não tiver criaturas do tipo escolhido.
- **Dracogenesis:** é o payoff mais condicional da V3; o custo de oito manas compete com outros finalizadores. Não deve ser tratado como inclusão comprovadamente melhor só porque tem teto alto.
- **Ancient Copper Dragon:** tem enorme potencial de Tesouros, mas exige dano de combate e depende de uma rolagem. Se não conectar, não produz o efeito esperado.
- **Dragonhawk / Bonehoard / Knollspine:** melhoram fluxo de cartas, mas têm custos altos e podem ficar presos na mão quando a aceleração falha. Bonehoard precisa chegar à manutenção para gerar valor recorrente.
- **Cavern of Souls:** protege mágicas de criatura Dragon contra anulações; não protege encantamentos, artefatos nem o comandante depois que ele está em campo.

## 7. Grupos funcionais — versão recomendada

A lista usa os oito grupos fornecidos pelo usuário. Cada carta não terreno ocupa um grupo principal; as funções secundárias podem ser anotadas sem duplicar a contagem.


| Grupo | Função | CURRENT | PROPOSED V2 | PROPOSED V3 | Diagnóstico |
|---|---|---:|---:|---:|---|
| Ramp | Aceleração, redução de custo e terrenos utilitários. | 10 | 13 | 14 | Priorizar acesso a Lathliss e redução de custo cedo; acelerar sem sacrificar toda a mão. |
| Draw | Compra, seleção, impulsos e reposição de mão. | 8 | 8 | 11 | Testar se a mão permanece abastecida depois de duas ou três ameaças. |
| Removal | Respostas pontuais, artefatos e limpezas de mesa. | 15 | 13 | 11 | Separar respostas assimétricas de resets simétricos; avaliar custo para o próprio tabuleiro. |
| Sinergia 1 | Motor de Dragões, gatilhos de entrada e fichas 5/5. | 6 | 8 | 9 | Manter densidade de Dragões não ficha para disparar Lathliss. |
| Sinergia 2 | Payoffs de dano, multiplicadores e pressão tribal. | 10 | 9 | 7 | Payoffs precisam converter entradas em dano sem depender de um único permanente. |
| Sinergia 3 | Haste, proteção, apoio tribal e utilidade. | 8 | 7 | 6 | O apoio deve proteger ou tornar o combate mais eficiente. |
| Tesouro | Produção e conversão de Tesouros em mana/vantagem. | 5 | 6 | 6 | Tesouros precisam permitir encadear Dragões e não ser apenas valor residual. |
| Combate extra | Fases de combate adicionais e conversão de mesa em letal. | 5 | 4 | 4 | A linha precisa de mesa e mana; não tratar combate extra como vitória automática. |

### Leitura dos grupos

- **Ramp (V3 = 14 slots funcionais):** inclui aceleração e redução de custo; o número alto é deliberado por causa da curva.
- **Draw (V3 = 11):** melhor cobertura de compra recorrente, impulsiva e condicionada a dano. A validação prática é se a mão continuar funcional depois de baixar dois Dragões.
- **Removal (V3 = 11):** não interpretar o total como 11 respostas pontuais. Inclui wipes e respostas assimétricas; testar quantas limpam o próprio tabuleiro.
- **Sinergia 1/2/3:** separar motor de entradas, payoffs de dano e suporte/proteção impede confundir “tenho muitos Dragões” com “tenho redundância dos efeitos que vencem”.
- **Tesouro (V3 = 6):** é combustível para continuar jogando; não pressupor mana infinita.
- **Combate extra (V3 = 4):** só é valioso se houver mesa e mana, e pode ser redundante se a mesa estiver vazia.

## 8. Rubrica ponderada de construção

Os dez critérios usam pesos comuns somando 100%. A nota não mede win rate e não substitui partidas reais.


| Critério | Peso | CURRENT | PROPOSED V2 | PROPOSED V3 |
|---|---:|---:|---:|---:|
| Curva e aceleração | 15% | 4.5 | 7.7 | 9.4 |
| Vantagem de cartas / compra | 15% | 4.7 | 7.9 | 9.0 |
| Sinergia com o plano tribal | 15% | 7.3 | 8.8 | 9.4 |
| Interação e limpezas | 15% | 6.0 | 7.6 | 9.0 |
| Proteção e resiliência | 10% | 4.5 | 7.4 | 8.5 |
| Acesso à vitória / fechamento | 10% | 7.5 | 8.8 | 9.4 |
| Base de mana | 5% | 6.2 | 7.2 | 8.8 |
| Flexibilidade funcional | 5% | 5.8 | 8.2 | 9.0 |
| Consistência da comandante | 5% | 5.0 | 7.8 | 9.1 |
| Identidade e experiência pretendida | 5% | 8.5 | 8.5 | 8.5 |
| **Nota ponderada** | **100%** | **5.85/10** | **8.01/10** | **9.08/10** |

### Critérios de playtest para avaliar a nota

1. **Ramp:** em quantas partidas Lathliss ou um motor de redução de custo entra antes do turno 5?
2. **Compra:** quantas cartas úteis são acessadas depois de esvaziar a mão inicial?
3. **Payoffs:** quantas entradas de Dragões convertem-se em ficha, dano ou Tesouro?
4. **Interação:** quantas vezes o deck consegue lidar com uma ameaça prioritária sem perder o próprio motor?
5. **Wipes:** Chain Reaction/Blasphemous Act foram usados por necessidade, por dano direcionado via Wrathful, ou apenas limparam a própria mesa?
6. **Fechamento:** qual carta efetivamente converteu vantagem em vitória? Quantas partidas falharam por falta de um finalizador ou por excesso de cartas caras?

## 9. Watchlist — ideias para estudo futuro, não inclusões automáticas

- **Deflecting Swat / Bolt Bend / Red Elemental Blast / Pyroblast:** proteção/interação de pilha; comparar com os slots atuais e com o ambiente.
- **Seething Song / Big Score / Unexpected Windfall:** aceleração pontual ou compra/tesouros, se os testes mostrarem que Chrome Mox/Mana Vault não bastam ou têm custo excessivo.
- **Atsushi, the Blazing Sky / Cavern-Hoard Dragon / Leyline Tyrant:** fontes alternativas de valor e Tesouros.
- **Aggravated Assault:** avaliar apenas se houver produção de mana durante combate suficiente; não declarar loop infinito sem demonstrar mana positiva e repetibilidade.

## 10. Lista completa — CURRENT

```text

1 Lathliss, Dragon Queen (M19) 149
1 Abstergo Entertainment (ACR) 79
1 Arcane Signet (CLB) 298
1 Arena of Glory (MH3) 215
1 Balefire Dragon (CMM) 697
1 Barbarian Ring (MH3) 299
1 Belbe's Portal (PLST) NEM-127
1 Browbeat (DDK) 66
1 Carnelian Orb of Dragonkind (CLB) 166
1 Chain Reaction (CLB) 783
1 Chaos Dragon (CLB) 784
1 Chaos Warp (CLB) 785
1 Collective Defiance (OTP) 21
1 Crawlspace (DMR) 375
1 Curse of Opulence (CLB) 786
1 Cursed Mirror (MH3) 279
1 Demand Answers (MKM) 306
1 Dictate of the Twin Gods (PJOU) 93★ *F*
1 Dragon Mage (C15) 151
1 Dragon Tempest (IMA) 125
1 Dragon's Hoard (CLB) 858
1 Dragonspeaker Shaman (AFC) 330
1 Electrodominance (OTP) 23
1 Enduring Courage (DSK) 133
1 Faithless Looting (CMM) 220
1 Fiendish Duo (MKC) 153
1 Fury of the Horde (DDN) 30
1 Gadrak, the Crown-Scourge (M21) 146
1 Goldspan Dragon (PLST) KHM-139
1 Gratuitous Violence (AFC) 127
1 Great Train Heist (OTJ) 125
1 Hedron Archive (CLB) 861
1 Hellkite Charger (CMM) 232
1 Hellkite Tyrant (RVR) 333 *F*
1 Horn of the Mark (LTR) 241
1 Incinerator of the Guilty (MKM) 132
1 Inferno of the Star Mounts (AFR) 151
1 Insurrection (ONS) 213
1 Manaform Hellkite (PVOW) 170s *F*
1 Mines of Moria (LTR) 257
1 Mizzium Mortars (GK1) 32
1 Mob Verdict (MKC) 33
1 Molten Echoes (VOC) 148
24 Mountain (MH3) 317 *F*
1 Nyx Lotus (THB) 235
1 Overpowering Attack (ACR) 37 *F*
1 Path of Ancestry (CMR) 353
1 Pinnacle Monk (MH3) 246 *F*
1 Powerbalance (MH3) 335
1 Pyroclasm (MM3) 107
1 Rapacious Dragon (JMP) 358
1 Reckless Barbarian (CLB) 193
1 Reckless Endeavor (AFC) 33
1 Rising of the Day (LTR) 145
1 Roaming Throne (LCI) 258
1 Ryusei, the Falling Star (CLB) 806
1 Sarkhan's Triumph (DTK) 154
1 Scourge of the Throne (LTC) 225
1 Skyline Despot (CMM) 254 *F*
1 Sol Ring (MKC) 237
1 Spikefield Hazard (ZNR) 166
1 Spinerock Knoll (CLB) 916
1 Spiteful Banditry (LTR) 149
1 Storm's Wrath (PTHB) 157p
1 Sundering Eruption (MH3) 248
1 Temple of the False God (CLB) 925
1 Terrain Generator (CLB) 926
1 Territorial Hellkite (C17) 29
1 The Legend of Roku (TLA) 145
1 The Reaver Cleaver (DMC) 8
1 Torbran, Thane of Red Fell (PELD) 147p *F*
1 Untimely Malfunction (DSK) 161
1 Utvara Hellkite (RTR) 110
1 Vandalblast (CMM) 646
1 Vengeful Ancestor (CLB) 812
1 War's Toll (BBD) 187
1 Wild Wasteland (PIP) 599 *F*

```

## 11. Lista completa — PROPOSED V2 (arquivo histórico, não testada)

```text

1 Lathliss, Dragon Queen (M19) 149
1 Abstergo Entertainment (ACR) 79
1 Arcane Signet (CLB) 298
1 Arena of Glory (MH3) 215
1 Balefire Dragon (CMM) 697
1 Barbarian Ring (MH3) 299
1 Belbe's Portal (PLST) NEM-127
1 Carnelian Orb of Dragonkind (CLB) 166
1 Chain Reaction (CLB) 783
1 Chaos Dragon (CLB) 784
1 Chaos Warp (CLB) 785
1 Curse of Opulence (CLB) 786
1 Cursed Mirror (MH3) 279
1 Demand Answers (MKM) 306
1 Dragon Tempest (IMA) 125
1 Dragon's Hoard (CLB) 858
1 Dragonspeaker Shaman (AFC) 330
1 Electrodominance (OTP) 23
1 Enduring Courage (DSK) 133
1 Faithless Looting (CMM) 220
1 Fiendish Duo (MKC) 153
1 Gadrak, the Crown-Scourge (M21) 146
1 Goldspan Dragon (PLST) KHM-139
1 Gratuitous Violence (AFC) 127
1 Great Train Heist (OTJ) 125
1 Hedron Archive (CLB) 861
1 Hellkite Charger (CMM) 232
1 Hellkite Tyrant (RVR) 333 *F*
1 Horn of the Mark (LTR) 241
1 Incinerator of the Guilty (MKM) 132
1 Inferno of the Star Mounts (AFR) 151
1 Insurrection (ONS) 213
1 Manaform Hellkite (PVOW) 170s *F*
1 Mines of Moria (LTR) 257
1 Mizzium Mortars (GK1) 32
1 Mob Verdict (MKC) 33
1 Molten Echoes (VOC) 148
24 Mountain (MH3) 317 *F*
1 Overpowering Attack (ACR) 37 *F*
1 Path of Ancestry (CMR) 353
1 Pinnacle Monk (MH3) 246 *F*
1 Rapacious Dragon (JMP) 358
1 Reckless Barbarian (CLB) 193
1 Rising of the Day (LTR) 145
1 Roaming Throne (LCI) 258
1 Ryusei, the Falling Star (CLB) 806
1 Sarkhan's Triumph (DTK) 154
1 Scourge of the Throne (LTC) 225
1 Skyline Despot (CMM) 254 *F*
1 Sol Ring (MKC) 237
1 Spikefield Hazard (ZNR) 166
1 Spinerock Knoll (CLB) 916
1 Spiteful Banditry (LTR) 149
1 Sundering Eruption (MH3) 248
1 Terrain Generator (CLB) 926
1 Territorial Hellkite (C17) 29
1 The Legend of Roku (TLA) 145
1 The Reaver Cleaver (DMC) 8
1 Torbran, Thane of Red Fell (PELD) 147p *F*
1 Untimely Malfunction (DSK) 161
1 Utvara Hellkite (RTR) 110
1 Vandalblast (CMM) 646
1 Vengeful Ancestor (CLB) 812
1 Wild Wasteland (PIP) 599 *F*
1 The One Ring (impressão não definida)
1 Jeska's Will (impressão não definida)
1 Wrathful Red Dragon (impressão não definida)
1 Ruby Medallion (impressão não definida)
1 Earthquake (impressão não definida)
1 Scourge of Valkas (impressão não definida)
1 Dragonlord's Servant (impressão não definida)
1 Herald's Horn (impressão não definida)
1 Terror of the Peaks (impressão não definida)
1 Chandra's Ignition (impressão não definida)
1 Ganax, Astral Hunter (impressão não definida)
1 Lightning Greaves (impressão não definida)
1 Valakut Awakening // Valakut Stoneforge (impressão não definida)

```

## 12. Lista completa — PROPOSED V3 (proposta atual, não testada)

```text

1 Lathliss, Dragon Queen (M19) 149
1 Abstergo Entertainment (ACR) 79
1 Arcane Signet (CLB) 298
1 Arena of Glory (MH3) 215
1 Balefire Dragon (CMM) 697
1 Belbe's Portal (PLST) NEM-127
1 Carnelian Orb of Dragonkind (CLB) 166
1 Chain Reaction (CLB) 783
1 Chaos Warp (CLB) 785
1 Curse of Opulence (CLB) 786
1 Cursed Mirror (MH3) 279
1 Demand Answers (MKM) 306
1 Dragon Tempest (IMA) 125
1 Dragon's Hoard (CLB) 858
1 Dragonspeaker Shaman (AFC) 330
1 Faithless Looting (CMM) 220
1 Fiendish Duo (MKC) 153
1 Goldspan Dragon (PLST) KHM-139
1 Gratuitous Violence (AFC) 127
1 Great Train Heist (OTJ) 125
1 Hellkite Charger (CMM) 232
1 Hellkite Tyrant (RVR) 333 *F*
1 Horn of the Mark (LTR) 241
1 Incinerator of the Guilty (MKM) 132
1 Insurrection (ONS) 213
1 Manaform Hellkite (PVOW) 170s *F*
1 Mines of Moria (LTR) 257
1 Mizzium Mortars (GK1) 32
1 Molten Echoes (VOC) 148
24 Mountain (MH3) 317 *F*
1 Overpowering Attack (ACR) 37 *F*
1 Path of Ancestry (CMR) 353
1 Pinnacle Monk (MH3) 246 *F*
1 Rapacious Dragon (JMP) 358
1 Rising of the Day (LTR) 145
1 Roaming Throne (LCI) 258
1 Ryusei, the Falling Star (CLB) 806
1 Sarkhan's Triumph (DTK) 154
1 Scourge of the Throne (LTC) 225
1 Skyline Despot (CMM) 254 *F*
1 Sol Ring (MKC) 237
1 Spikefield Hazard (ZNR) 166
1 Spinerock Knoll (CLB) 916
1 Spiteful Banditry (LTR) 149
1 Sundering Eruption (MH3) 248
1 Territorial Hellkite (C17) 29
1 The Legend of Roku (TLA) 145
1 The Reaver Cleaver (DMC) 8
1 Torbran, Thane of Red Fell (PELD) 147p *F*
1 Utvara Hellkite (RTR) 110
1 Vandalblast (CMM) 646
1 Vengeful Ancestor (CLB) 812
1 Wild Wasteland (PIP) 599 *F*
1 The One Ring (impressão não definida)
1 Jeska's Will (impressão não definida)
1 Wrathful Red Dragon (impressão não definida)
1 Ruby Medallion (impressão não definida)
1 Earthquake (impressão não definida)
1 Scourge of Valkas (impressão não definida)
1 Dragonlord's Servant (impressão não definida)
1 Herald's Horn (impressão não definida)
1 Terror of the Peaks (impressão não definida)
1 Chandra's Ignition (impressão não definida)
1 Ganax, Astral Hunter (impressão não definida)
1 Lightning Greaves (impressão não definida)
1 Valakut Awakening // Valakut Stoneforge (impressão não definida)
1 Chrome Mox (impressão não definida)
1 Mana Vault (impressão não definida)
1 Knollspine Dragon (impressão não definida)
1 Dracogenesis (impressão não definida)
1 Dragonhawk, Fate's Tempest (impressão não definida)
1 Bonehoard Dracosaur (impressão não definida)
1 Ancient Copper Dragon (impressão não definida)
1 Urza's Incubator (impressão não definida)
1 Blasphemous Act (impressão não definida)
1 Cavern of Souls (impressão não definida)
1 Ancient Tomb (impressão não definida)

```

## 13. Fontes e pesquisa


| Fonte | Link | Uso na análise | Ressalva |
|---|---|---|---|
| Scryfall — Lathliss | [Abrir](https://scryfall.com/card/m19/149/lathliss-dragon-queen) | Texto Oracle e habilidade de gerar fichas. | Autoridade para regras e texto; confirmar Oracle atual nas interações críticas. |
| EDH.Wiki — Lathliss / Dragons | [Abrir](https://edh.wiki/commanders/lathliss-dragon-queen/dragons/) | Estratégia e papéis frequentes do arquétipo. | Benchmark de estratégia, não prescrição automática. |
| EDHREC — Lathliss Optimized | [Abrir](https://edhrec.com/commanders/lathliss-dragon-queen/optimized) | Frequência atual de reducers, payoffs, compra e ramp. | Snapshot consultado em 2026-10; inclui listas com brackets configurados. |
| EDHREC — Lathliss Optimized Dragons | [Abrir](https://edhrec.com/commanders/lathliss-dragon-queen/optimized/dragons) | Pacotes de Dragões e funções. | Usado para identificar Ancient Copper, Dragonhawk, Bonehoard e Knollspine como alternativas a avaliar. |
| Scryfall search — Dracogenesis | [Abrir](https://scryfall.com/search?q=%21%22Dracogenesis%22) | Texto Oracle, legalidade e impressões. | Payoff caro e condicional; não deve ser considerado bom em mãos sem Dragões. |
| Scryfall search — Bonehoard Dracosaur | [Abrir](https://scryfall.com/search?q=%21%22Bonehoard+Dracosaur%22) | Texto Oracle e rulings. | Motor recorrente de vantagem e geração de Tesouros/fichas. |
| Scryfall search — Dragonhawk | [Abrir](https://scryfall.com/search?q=%21%22Dragonhawk%2C+Fate%27s+Tempest%22) | Texto Oracle e rulings. | Vantagem impulsiva e dano no end step. |
| Scryfall search — Wrathful Red Dragon | [Abrir](https://scryfall.com/search?q=%21%22Wrathful+Red+Dragon%22) | Texto Oracle e rulings. | Interação com Chain Reaction e Blasphemous Act. |
| EDHREC — Krenko reference (shared tribal comparison) | [Abrir](https://edhrec.com/commanders/krenko-mob-boss/optimized/goblins) | Benchmark usado apenas para estudo compartilhado do tribal mono-red. | Não é fonte de estratégia de Dragões; comparação restrita a estrutura, não a pacotes específicos. |

**Data da pesquisa:** 14/10/2026. EDHREC foi usado como benchmark de frequência e estrutura, não como prescrição. A página otimizada específica de Lathliss/Dragons tem uma amostra menor do que a página geral otimizada; porcentagens em grupos pequenos devem ser lidas com cautela. Revalidar texto Oracle, legalidade e banlist antes de implementar qualquer versão.

## 14. Próximos passos

1. Confirmar se as escolhas de fast mana e o nível de ameaça da V3 fazem sentido para o pod.
2. Jogar pelo menos 5 partidas com a mesma versão, registrando mãos iniciais, turno de Lathliss, cartas mortas, resposta a wipes e fechamento.
3. Atualizar o Dashboard e o Handover apenas com dados observados; só então reavaliar a nota.

### Prompt de retomada

> Continue o projeto Lathliss, Dragon Queen usando este Handover V3 e `Lathliss_Dragons_V3_Deep_Review.xlsx`. Mantenha CURRENT congelada; PROPOSED V2 arquivada; PROPOSED V3 ainda não testada. Não presuma que qualquer sugestão foi adquirida ou implementada. Antes de propor V4, confira playtests, atualize as evidências e audite regras/Oracle das interações relevantes. Preserve a identidade Dragon tribal e o pacote Chain Reaction + Wrathful Red Dragon salvo evidência nova.
