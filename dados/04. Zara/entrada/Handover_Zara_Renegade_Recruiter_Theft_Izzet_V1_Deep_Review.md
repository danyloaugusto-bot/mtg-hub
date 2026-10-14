# HANDOVER — Zara, Renegade Recruiter: Theft Izzet
**Versão:** V1 Deep Review / PROPOSED V2  
**Data da revisão:** 14 de outubro de 2026  
**Status:** CURRENT congelada; PROPOSED V2 não adquirida/não testada  
**Objetivo do deck:** homenagem ao irmão do usuário; Izzet que foge do spellslinger tradicional, priorizando roubo de criaturas/permanentes, cópia de cartas adversárias e apropriação dos recursos da mesa.

> **Regra de continuidade:** CURRENT é a lista enviada pelo usuário, não deve ser sobrescrita. PROPOSED V2 é uma hipótese de construção. Não assumir que cartas foram compradas, incluídas ou testadas. Os marcadores `*F*`/`*E*` indicam acabamento na lista recebida e não provam que uma carta seja PET.

## 1. Identidade e filosofia

A identidade ideal é **Theft Izzet / Appropriation Control**: revelar e avaliar mãos, roubar criaturas temporariamente ou permanentemente, copiar as melhores ameaças, reaproveitar ETBs e converter cartas emprestadas em cópias, permanentes roubadas, dano ou vantagem de combate.

O objetivo não é simplesmente jogar mágicas vermelhas e azuis ou criar um deck de magos. O deck deve parecer que está vencendo usando os recursos dos oponentes. A construção honra o irmão do usuário; manter essa identidade é parte da qualidade do deck.

**Objetivo de potência:** casual forte / high-power casual, sem supor cEDH. O pacote Curiosity + Niv-Mizzet oferece uma linha compacta de vitória, mas é um plano alternativo já presente na lista. O usuário ainda não declarou que queira removê-lo.

## 2. Pontuação inicial e projetada

- **CURRENT: 6,6/10 (estimativa estrutural).** A identidade já existe e há peças individualmente fortes (`Mob Rule`, `Dominus of Fealty`, `Grafted Identity`, `Fling`, `Kazuul's Fury`, `Curiosity`, `Cyclonic Rift`, `Rhystic Study` e `Clout of the Dominus`). Os gargalos principais são estrutura: 31 terrenos físicos, poucas maneiras dedicadas de conservar as criaturas temporariamente tomadas por Zara, subtemas spellslinger que competem por slots e algumas respostas abaixo da eficiência ideal.
- **PROPOSED V2: 8,2/10 (projeção não testada).** A proposta acrescenta o motor específico de retenção (`Sundial of the Infinite`), ferramentas de blink, mais apropriação de cartas dos adversários, um payoff de combate que pode gerar ataques adicionais de Zara e cinco terrenos. A média estimada de MV dos não-terrenos sobe levemente, de ~3,09 para ~3,21, porque alguns payoffs de roubo são caros; a melhoria de consistência vem sobretudo da base de mana e dos motores, não de uma redução da curva.
- **Nenhuma nota é taxa de vitória.** A proposta precisa ser validada em partidas, e a percepção de ameaça pode aumentar ao adicionar `Bribery`, `Stolen Strategy`, `Agent of Treachery` e `Sundial`.

## 3. Regras e interações críticas

### 3.1 Texto funcional de Zara

Zara custa `{3}{U}{R}`, é uma criatura lendária Human Pirate 4/3 com voar e tem: sempre que ataca, olhar a mão do jogador defensor; pode colocar uma carta de criatura daquela mão no campo de batalha sob seu controle, virada e atacando aquele jogador ou um planeswalker que ele controla. Devolve essa criatura à mão do dono no começo da próxima etapa final.

Pontos de regra:
1. **Zara não precisa causar dano de combate.** Ser declarada atacante dispara o gatilho. Voar ajuda a facilitar ataques, mas o requisito do gatilho é atacar.
2. **A criatura roubada não foi declarada atacante.** Ela entrou no campo de batalha atacando. Habilidades que disparam “quando esta criatura ataca” não disparam por esse evento; habilidades de entrada no campo de batalha funcionam normalmente.
3. O retorno só ocorre se a criatura ainda estiver no campo de batalha quando a habilidade atrasada resolver. Sacrificar, destruir ou piscar a criatura pode fazer com que o retorno original não a encontre; piscar cria um novo objeto.
4. `Telepathy` revela as mãos, ajudando a escolher o defensor que tem a criatura mais valiosa. Ela não é uma obrigação de turno um: às vezes vale esperar para não virar o alvo principal cedo.
5. `Clout of the Dominus` é excepcional com Zara: Zara é azul e vermelha. A Aura dá +1/+1 por ser azul, com shroud, e +1/+1 por ser vermelha, com haste — total +2/+2, shroud e haste por uma mana híbrida. Sequenciar outras mágicas que fazem alvo antes de anexar Clout; depois de ter shroud, Zara não pode ser alvo de mágicas/habilidades, inclusive suas próprias.

### 3.2 Retenção de criaturas emprestadas

- **Sundial of the Infinite:** no começo da sua etapa final, deixar o gatilho de retorno atrasado de Zara entrar na pilha; depois, enquanto for seu turno, ativar Sundial (`{1}`, virar) para encerrar o turno. A habilidade que estava na pilha é exilada e não devolverá a criatura. Não ativar cedo antes de o gatilho de retorno entrar na pilha.
- **Conjurer's Closet:** no começo da etapa final, ordenar os gatilhos para que o gatilho do Closet resolva primeiro e pisque a criatura emprestada; então a habilidade de retorno de Zara tenta encontrar o objeto original, que deixou de existir como esse objeto. A criatura que retornou é um novo objeto sob seu controle.
- **Ghostly Flicker:** pode piscar dois artefatos/criaturas/terrenos que você controla. Selecionar a criatura emprestada e outro alvo legal; quando ela volta, é um novo objeto e não é encontrada pela habilidade atrasada original.
- **Clone / Glasspool Mimic / Fated Infatuation / Quasiduplicate / Sakashima's Will:** copiar a criatura emprestada cria outro objeto. O original pode voltar para a mão do dono, mas a cópia permanece. `Quasiduplicate` é normalmente conjurado em velocidade de feitiço; `Fated Infatuation` é instantânea.
- **Grafted Identity:** paga como custo adicional o sacrifício de uma criatura e depois controla a permanente encantada. Uma criatura emprestada por Zara pode pagar esse custo; selecionar como alvo a permanente que se quer roubar.
- **Fling / Kazuul's Fury:** converter a criatura emprestada em dano de sacrifício antes que volte. `Kazuul's Fury` é MDFC; carta física conta uma vez e sua face de terreno conta como fonte funcional potencial.

### 3.3 Combate extra e condições de vitória

- **Port Razer (proposta):** quando causa dano de combate a um jogador pela primeira vez em cada turno, desvira as criaturas atacantes e cria uma fase de combate adicional. Se Zara atacar na nova fase, ela recebe outro gatilho de roubo.
- **Mob Rule:** condição de vitória baseada na mesa; escolher a metade de criaturas adequada ao estado de jogo, atacar e avaliar se Fling/Kazuul's Fury pode converter uma criatura roubada antes da etapa final.
- **Curiosity + Niv-Mizzet, the Firemind:** linha de duas cartas listada em EDH-Combos; os gatilhos de dano e compra podem se repetir até dano letal. **Curiosity + Niv-Mizzet, Parun** também tem linha equivalente. São combos reais, mas não são o foco identitário de roubo.
- `Flare of Duplication` e `Increasing Vengeance` copiam mágicas instantâneas/feitiços que você controla, não quaisquer mágicas adversárias. `Mirror Sheen` e `Redirect` possuem condições específicas de alvo; não tratá-las como cópia/counter universal.
- `Leyline of Resonance` tem sinergia principalmente com mágicas que miram somente uma criatura que você controla, como `Fated Infatuation` e `Quasiduplicate`. O encaixe existe, mas é estreito.

## 4. Plano de jogo sugerido

### Early game (turnos 1–3)
Priorizar desenvolvimento de mana e cartas que deem vantagem de informação/recursos: Sol Ring, Arcane Signet, Izzet Signet, Fellwar Stone, Talisman of Creativity, Rhystic Study, Sensei's Divining Top e Telepathy conforme o estado da mesa. Observar quem tem criaturas importantes na mão e quem será provável adversário/aliado. Evitar gastar interação em qualquer ameaça; guardar para cartas que mudam a mesa ou impedem que Zara ataque.

### Middle game (turnos 4–7)
Conjurar Zara com um plano de ataque. Clout of the Dominus permite atacar imediatamente e dificulta remoção direcionada. Escolher o oponente cujo conteúdo de mão é mais valioso — não necessariamente o jogador mais fraco nem o líder em dano. Usar criaturas de ETB roubadas para gerar valor; copiar ameaças com Quasiduplicate/Fated Infatuation/Clone/Glasspool Mimic; usar Grafted Identity ou outlets de sacrifício quando a retenção não for possível. A cada turno, escolher entre obter um ETB, uma criatura para copiar, um corpo para sacrificar ou tentar mantê-la com Sundial/Closet/Flicker.

### Late game
Transformar vantagem acumulada em fechamento: Mob Rule para uma virada de combate, Port Razer para outro combate/Zara trigger, Bribery para uma ameaça de alto impacto, Agent of Treachery para roubo permanente e draw-three condicional, Stolen Strategy para continuar conjurando mágicas dos oponentes. Se necessário, Curiosity + um Niv-Mizzet continua como combo alternativo. Usar mass removal como catch-up, não automaticamente: resetar permanentes roubadas que levaram várias manas para obter pode sacrificar vantagem própria.

## 5. Auditoria factual da lista

- **CURRENT:** 100 cartas incluindo comandante; 31 terrenos físicos; 3 MDFCs com face-terreno (`Glasspool Mimic`, `Silundi Vision`, `Kazuul's Fury`), resultando em 34 fontes funcionais potenciais — não todas desviradas.
- **PROPOSED V2:** 100 cartas incluindo comandante; 36 terrenos físicos; as mesmas 3 MDFCs; 39 fontes funcionais potenciais.
- **Ramp:** 6 rochas claras: Sol Ring, Arcane Signet, Fellwar Stone, Izzet Signet, Talisman of Creativity e Midnight Clock. Midnight Clock também tem papel de wheel tardia. Myriad Landscape é aceleração lenta; Temple of the False God é condicional e fraco cedo.
- **Mana value médio estimado** para não-terrenos da lista principal, excluindo Zara e contando MDFCs pela face de mágica: ~3,09 CURRENT e ~3,21 PROPOSED V2. É cálculo orientativo com MV frontal, não simulação de mãos.
- **Criaturas do próprio deck:** 11 na lista principal CURRENT, 9 na proposta após cortes de subtema spellslinger e inclusão de Agent/Port Razer; Zara é adicional como comandante. O número é intencionalmente baixo para um deck centrado em roubar criaturas oponentes, mas precisa de teste: mãos com muitas cópias podem faltar um bom alvo controlado.
- **Legalidade:** identidade Izzet e singleton aparente, exceto terrenos básicos. Nenhuma carta evidentemente ilegal foi identificada; verificar a banlist oficial atual antes de implementação física.

## 6. Agrupamentos 8×8 — estrutura refinada

Os grupos originais (Ramp, Draw, Removal, Copy Spells, Tax + WinCon, Counter, Control MonoBlue, Others) misturam categorias por função, cor e resultado. Isso dificulta auditar a densidade real de roubo. A proposta redefine os oito grupos:

| Grupo | CURRENT* | PROPOSED V2* | Função |
|---|---:|---:|---|
| 1. Ramp + mana base | 6 | 5 | Ramp rocks + mana base. Track physical lands separately from modal double-faced cards. |
| 2. Draw + selection | 8 | 6 | Raw draw, card selection, wheels and ongoing advantage. |
| 3. Theft — temporary / combat | 8 | 8 | Temporary control, theft that expires, combat swings and sacrifice conversion. |
| 4. Theft — permanent / control | 8 | 10 | Permanent/ongoing control of opponent cards, whether by Aura, ETB or spell. |
| 5. Copy / clone / spell manipulation | 12 | 11 | Clones, spell copies, redirection and copying a borrowed creature. |
| 6. Interaction — counters / removal / resets | 14 | 12 | Counters, flexible answers, bounce and mass resets. |
| 7. Zara engine — haste / protection / retain theft | 4 | 6 | Zara-specific support: haste/protection, information, retaining or blinking borrowed creatures. |
| 8. Finishers / tax / utility | 8 | 5 | Finishers, taxes, meta tools and secondary payoff cards. |

*Contagens primárias excluem comandante e terrenos físicos; MDFCs são contadas uma única vez na função principal da face de mágica. Os grupos não precisam conter exatamente oito cartas; a teoria 8×8 é ferramenta de diagnóstico, não regra rígida.*

## 7. Proposta de trocas OUT → IN

Todas as mudanças são hipóteses. A lista CURRENT permanece preservada.

| OUT | IN | Prioridade | Justificativa resumida | Risco/custo | Confiança |
|---|---|---|---|---|---|
| Alchemist's Gambit | Sundial of the Infinite | P1 — structural | Replace a risky extra-turn spell with Zara's signature retention engine. | Sundial only works during your turn; activate after the return trigger is on the stack. Ending the turn also removes the combat from the game state. | High |
| Browbeat | Conjurer's Closet | P1 — engine | Trade opponent-choice draw/damage for a repeatable end-step blink that can keep Zara's borrowed creature. | Costs five mana and is slow; must order the Closet trigger above Zara's return trigger. | High |
| Firemind's Research | Ghostly Flicker | P1 — engine | Convert a slow spellslinger payoff into instant-speed blink, protection and retention for borrowed creatures. | Needs two legal permanents among artifacts/creatures/lands you control; not every target is a creature. | High |
| Goblin Electromancer | Agent of Treachery | P2 — theft | Replace spellslinger cost reduction with an ETB permanent-steal threat that may also draw three cards. | Seven mana when hard-cast; not a cheap value play. Its theft effect persists after Agent leaves. | Medium |
| Goblin Flectomancer | Stolen Strategy | P2 — identity | Move from a narrow target-switch creature to a sustained engine for casting cards from opponents' libraries. | Five mana and upkeep timing; can exile cards you cannot afford to cast that turn. | High |
| Parallel Thoughts | Port Razer | P1 — closing | Replace slow setup with an extra-combat payoff that can trigger Zara again in the same turn. | Needs Port Razer to deal combat damage to a player; vulnerable to blockers and removal. | High |
| Smoke | Bribery | P2 — theft | Replace symmetric untap denial with direct access to the best creature in an opponent's library. | Five mana; raises threat perception and depends on the opponent's deck having a suitable creature. | High |
| Sphinx of the Second Sun | Chaos Warp | P1 — interaction | Trade an eight-mana value creature for a flexible answer to nearly any problematic permanent. | Chaos Warp is a random answer and may replace the threat with another permanent. | High |
| Mizzium Mortars | Steam Vents | P1 — mana | Convert a narrow removal slot into an untapped dual-color source; other sweepers and Rift remain. | Lose targeted creature removal and access to overload; check table needs before adopting. | Medium |
| Supreme Will | Shivan Reef | P1 — mana | Improve colored-source count rather than use a three-mana, medium-efficiency counter/selection spell. | Life loss can add up; keep adequate basic/dual mix. | Medium |
| Vadrik, Astral Archmage | Training Center | P1 — mana | Remove a third build-around (spell-cost reduction) and add a multiplayer-friendly dual source. | Lose some cost reduction for instants and sorceries; this is a deliberate identity choice. | Medium |
| Consuming Tide | Stormcarved Coast | P1 — mana | Reduce redundant mass-bounce effects and increase reliable color fixing for the five-mana commander and blue/red pips. | Lose one catch-up reset/draw effect; test whether Rift + Disk + Blasphemous Act are enough. | Medium |
| Exclude | Sulfur Falls | P1 — mana | Trade a three-mana narrow creature counter for a source that usually enters untapped once an Island/Mountain is present. | Lose a counter that replaces itself; retain Counterspell, Negate, Mana Leak, Essence Capture and other interaction. | Medium |

Observação: cinco entradas são novos slots de terreno, financiados por cinco mágicas cortadas; portanto, a base sobe de 31 para 36 terrenos. A proposta adiciona oito mágicas/permanentes e cinco terrenos, cortando treze cartas no total.

## 8. Alternativas para pesquisa/teste posterior

- **Coercive Recruiter:** potencial Pirate theft, mas o gatilho exige que outro Pirate entre sob seu controle. Zara já em campo não dispara esse gatilho ao atacar; uma criatura roubada pela habilidade de Zara só seria um Pirate se a carta escolhida tivesse esse tipo.
- **Captivating Crew:** roubo temporário repetível, mas a ativação é cara e compete com Act of Treason/Dominus/Unwilling Recruit.
- **Zealous Conscripts:** roubo temporário de qualquer permanente por ETB; bom, mas pode redundar com os efeitos atuais.
- **Insurrection:** fechamento potente, oito manas e alta percepção de ameaça.
- **Rite of Replication:** excelente ao copiar uma criatura oponente de alto impacto; o kicker eleva muito o investimento.
- **Malcolm, Keen-Eyed Navigator:** Zara é Pirate e pode gerar Treasure ao causar dano; sinergia menor sem densidade adicional de Pirates.
- **Treasure Nabber:** roubo temporário de artefatos de mana; depende do metagame.
- **Thassa, Deep-Dwelling:** alternativa ao Closet para blink de fim de turno, mas sobrepõe funções com Sundial/Ghostly Flicker/Closet.
- **Swiftfoot Boots / Lightning Greaves:** comuns em listas de Zara, mas não adicionar automaticamente: Clout of the Dominus já dá haste e shroud. Shroud torna Zara impossível de escolher como alvo para re-equipar/encantar depois; a sequência precisa ser planejada.
- **Rogue's Passage:** menos prioritária do que parece, pois o gatilho de Zara não exige dano de combate; voar + haste/proteção já ajudam a atacar.

## 9. Estado de cada versão e validação

- **CURRENT:** exatamente a lista original incluída na seção 11.
- **PROPOSED V2:** lista integral incluída na seção 12; não foi adquirida nem testada.
- **TESTED:** nenhuma partida documentada até a data do handover.
- **PET cards / restrições:** nenhuma carta foi declarada PET neste deck. Os acabamentos `*F*` não autorizam inferência.
- **Orçamento:** nenhuma restrição de orçamento informada; o usuário decide posteriormente o que comprar/trocar.

## 10. Prioridades para a próxima sessão

1. Confirmar se o usuário aceita combos Curiosity + Niv-Mizzet como plano alternativo ou prefere reduzir sua relevância.
2. Testar V2 em várias partidas, registrando turnos da primeira ativação de Zara, criaturas roubadas, oportunidades de cópia/retensão, cartas travadas, recuperação pós-wipe e modo de fechamento.
3. Revisar grupos e curva após resultados. Não chamar de otimizado/testado sem evidências.

### Prompt curto para retomar

> Continue o deck Zara, Renegade Recruiter — Theft Izzet usando este handover e o Dashboard. Preserve CURRENT como referência congelada; PROPOSED V2 é hipótese. Aprofunde regras e alternativas por função, não copie listas populares automaticamente. Revise o equilíbrio entre roubo temporário, roubo permanente, cópia de criaturas roubadas, retenção via Sundial/blink, mana e interação. Registre cada OUT → IN com ganhos, perdas, riscos, prioridade e confiança. Não presuma cartas PET pelos acabamentos nem presuma que mudanças foram adquiridas ou testadas. A identidade é uma homenagem ao irmão do usuário: apropriar-se dos recursos dos oponentes, não virar simplesmente spellslinger. Entregue Dashboard Excel e Handover Markdown reconciliados.

## 11. Lista CURRENT — congelada (recebida do usuário)

```text
COMMANDER
1 Zara, Renegade Recruiter (CMR) 294

1 Act of Treason (RNA) 91
1 Alchemist's Gambit (VOW) 140
1 Arcane Signet (VOC) 159
1 Archmage Emeritus (STX) 377 *F*
1 Blasphemous Act (VOC) 143
1 Browbeat (DDK) 66
1 Castle Vantress (ELD) 242
1 Clone (M14) 47
1 Clout of the Dominus (EVE) 99
1 Command Tower (C13) 281
1 Consuming Tide (VOW) 53 *F*
1 Counterspell (CMR) 395
1 Curiosity (8ED) 72
1 Cyclonic Rift (RTR) 35
1 Day's Undoing (ORI) 51
1 Desolate Lighthouse (AVR) 227
1 Dissipation Field (CLB) 718
1 Domestication (M14) 53
1 Domineering Will (CLB) 719
1 Dominus of Fealty (EVE) 102
1 Encroaching Wastes (M14) 227
1 Essence Capture (OTP) 10
1 Exclude (CMM) 90
1 Fated Infatuation (BNG) 39
1 Fellwar Stone (CMM) 382
1 Firemind's Research (GRN) 171
1 Flare of Duplication (MH3) 333
1 Fling (OTP) 24
1 Glasspool Mimic (ZNR) 60
1 Goblin Electromancer (RTR) 163
1 Goblin Flectomancer (GPT) 116
1 Grafted Identity (MID) 57
1 Increasing Vengeance (DKA) 95
1 Invoke the Winds (NEO) 58
12 Island (MID) 381 *F*
1 Izzet Boilerworks (GPT) 159
1 Izzet Charm (MM3) 171
1 Izzet Signet (CLB) 863
1 Kazuul's Fury (ZNR) 146
1 Kitnap (BLB) 53
1 Leyline of Resonance (DSK) 143
1 Malevolent Hermit (MID) 61
1 Mana Leak (9ED) 86
1 Mass Manipulation (RNA) 42
1 Midnight Clock (WOC) 99
1 Mind Control (DCI) 30 *F*
1 Mirror Sheen (EVE) 105
1 Mirrormade (ELD) 55
1 Mizzium Mortars (CLB) 803
1 Mob Rule (VOC) 147
8 Mountain (SHM) 297 *F*
1 Myriad Landscape (VOC) 176
1 Negate (M14) 64
1 Nevinyrral's Disk (MH2) 298
1 Niv-Mizzet, Parun (GRN) 192
1 Niv-Mizzet, the Firemind (DDJ) 1 *F*
1 Order of Succession (C13) 52
1 Parallel Thoughts (SCG) 44
1 Propaganda (ACR) 85
1 Quasiduplicate (RVR) 55 *F*
1 Redirect (M13) 64
1 Reliquary Tower (CMM) 425
1 Rhystic Study (PCY) 45
1 Run Away Together (CLB) 92
1 Sakashima's Will (CMR) 91
1 Sensei's Divining Top (2X2) 398 *F*
1 Silundi Vision (ZNR) 80
1 Smoke (4ED) 222
1 Sol Ring (CMR) 472
1 Sphinx of the Second Sun (CMR) 99
1 Steal Enchantment (TMP) 90
1 Supreme Will (CMR) 102
1 Talisman of Creativity (CLB) 876
1 Telepathy (8ED) 105
1 Temple of Epiphany (CLB) 923
1 Temple of the False God (VOC) 187
1 Unwilling Recruit (EVE) 64
1 Vadrik, Astral Archmage (MID) 248
1 Vandalblast (RTR) 111
1 Vivid Crag (MMA) 225
1 Vivid Creek (MMA) 226
```

## 12. Lista PROPOSED V2 — hipótese ainda não testada

```text
COMMANDER
1 Zara, Renegade Recruiter (CMR) 294
1 Act of Treason (RNA) 91
1 Arcane Signet (VOC) 159
1 Archmage Emeritus (STX) 377 *F*
1 Blasphemous Act (VOC) 143
1 Castle Vantress (ELD) 242
1 Clone (M14) 47
1 Clout of the Dominus (EVE) 99
1 Command Tower (C13) 281
1 Counterspell (CMR) 395
1 Curiosity (8ED) 72
1 Cyclonic Rift (RTR) 35
1 Day's Undoing (ORI) 51
1 Desolate Lighthouse (AVR) 227
1 Dissipation Field (CLB) 718
1 Domestication (M14) 53
1 Domineering Will (CLB) 719
1 Dominus of Fealty (EVE) 102
1 Encroaching Wastes (M14) 227
1 Essence Capture (OTP) 10
1 Fated Infatuation (BNG) 39
1 Fellwar Stone (CMM) 382
1 Flare of Duplication (MH3) 333
1 Fling (OTP) 24
1 Glasspool Mimic (ZNR) 60
1 Grafted Identity (MID) 57
1 Increasing Vengeance (DKA) 95
1 Invoke the Winds (NEO) 58
12 Island (MID) 381 *F*
1 Izzet Boilerworks (GPT) 159
1 Izzet Charm (MM3) 171
1 Izzet Signet (CLB) 863
1 Kazuul's Fury (ZNR) 146
1 Kitnap (BLB) 53
1 Leyline of Resonance (DSK) 143
1 Malevolent Hermit (MID) 61
1 Mana Leak (9ED) 86
1 Mass Manipulation (RNA) 42
1 Midnight Clock (WOC) 99
1 Mind Control (DCI) 30 *F*
1 Mirror Sheen (EVE) 105
1 Mirrormade (ELD) 55
1 Mob Rule (VOC) 147
8 Mountain (SHM) 297 *F*
1 Myriad Landscape (VOC) 176
1 Negate (M14) 64
1 Nevinyrral's Disk (MH2) 298
1 Niv-Mizzet, Parun (GRN) 192
1 Niv-Mizzet, the Firemind (DDJ) 1 *F*
1 Order of Succession (C13) 52
1 Propaganda (ACR) 85
1 Quasiduplicate (RVR) 55 *F*
1 Redirect (M13) 64
1 Reliquary Tower (CMM) 425
1 Rhystic Study (PCY) 45
1 Run Away Together (CLB) 92
1 Sakashima's Will (CMR) 91
1 Sensei's Divining Top (2X2) 398 *F*
1 Silundi Vision (ZNR) 80
1 Sol Ring (CMR) 472
1 Steal Enchantment (TMP) 90
1 Talisman of Creativity (CLB) 876
1 Telepathy (8ED) 105
1 Temple of Epiphany (CLB) 923
1 Temple of the False God (VOC) 187
1 Unwilling Recruit (EVE) 64
1 Vandalblast (RTR) 111
1 Vivid Crag (MMA) 225
1 Vivid Creek (MMA) 226
1 Sundial of the Infinite [PROPOSED; printing not selected]
1 Conjurer's Closet [PROPOSED; printing not selected]
1 Ghostly Flicker [PROPOSED; printing not selected]
1 Agent of Treachery [PROPOSED; printing not selected]
1 Stolen Strategy [PROPOSED; printing not selected]
1 Port Razer [PROPOSED; printing not selected]
1 Bribery [PROPOSED; printing not selected]
1 Chaos Warp [PROPOSED; printing not selected]
1 Steam Vents [PROPOSED; printing not selected]
1 Shivan Reef [PROPOSED; printing not selected]
1 Training Center [PROPOSED; printing not selected]
1 Stormcarved Coast [PROPOSED; printing not selected]
1 Sulfur Falls [PROPOSED; printing not selected]
```

## 13. Fontes pesquisadas

- **EDH.Wiki — Zara Theft:** Archetype role, high-synergy cards, practical Zara strategy and Sundial spotlight. [Fonte](https://edh.wiki/commanders/zara-renegade-recruiter/theft/). Benchmarks/community analysis, not official rules.
- **EDHREC — Zara Theft:** Aggregated cards and synergy levels: Coercive Recruiter, Captivating Crew, Dominus of Fealty, Mob Rule, Telepathy, Sundial, Port Razer, etc. [Fonte](https://edhrec.com/commanders/zara-renegade-recruiter/theft). Usage is not proof of superiority.
- **EDHREC — Average Zara deck:** Reference list with Aetherize, Arcane Denial, Chaos Warp, Act of Treason, Mob Rule, Fling, lands and ramp. [Fonte](https://edhrec.com/average-decks/zara-renegade-recruiter/theft). Benchmark context only; not copied.
- **Archidekt — Zara (user link):** Readable community list: includes Conjurer's Closet, Ghostly Flicker, a 35-land base and average MV around 3.42. [Fonte](https://archidekt.com/decks/2008518/zara). Used as structural benchmark; cards were not copied wholesale.
- **Moxfield — I'll Take That (user link):** Additional theft/Commander reference. [Fonte](https://moxfield.com/decks/ygwWtcI310eLDcaQJAj6kg). Page content was only partially readable in this research pass; no full list comparison claimed.
- **Scryfall — Zara LCC 297:** User-provided printing / card oracle lookup. [Fonte](https://scryfall.com/card/lcc/297/zara-renegade-recruiter). Scryfall direct page returned access denied during this pass; cross-checked Oracle with mtg.wtf.
- **Zara — Oracle / rulings:** Exact card text and ruling that a creature put onto battlefield attacking was not declared as an attacker; delayed return only matters if the card remains there. [Fonte](https://www.mtg.wtf/card/lcc/297/Zara-Renegade-Recruiter). Rules / text reference.
- **Sundial of the Infinite — Oracle/rulings:** End-turn rules: spells and abilities on stack are exiled; only activate during your turn. [Fonte](https://mtg.wtf/card/m12/218/Sundial-of-the-Infinite). Rules / text reference.
- **Agent of Treachery — Oracle text:** ETB control of target permanent; end-step draw-three condition. [Fonte](https://planeswalkerhub.com/card/agent-of-treachery). Secondary card database; verify Oracle before complicated interactions.
- **Stolen Strategy — Oracle text:** Upkeep exiles the top card of each opponent's library and permits casting those spells until end of turn. [Fonte](https://casualplaneswalker.com/card/stolen-strategy/faq/). Secondary card database; rules text cross-checked.
- **EDH-Combos — Niv-Mizzet + Curiosity:** Documents two-card draw/damage loop with Niv-Mizzet, the Firemind and Curiosity. [Fonte](https://edh-combos.com/combo/1089-4971/). Combo reference; this deck also has Niv-Mizzet, Parun as alternate pairing.
- **EDH-Combos — Niv-Mizzet, Parun + Curiosity:** Documents two-card draw/damage loop with Niv-Mizzet, Parun and Curiosity. [Fonte](https://edh-combos.com/combo/1089-2353/). Combo reference; retain only if desired play experience accepts this as an alternate win.
- **Wizards — Banned & Restricted list:** Official page used for general Commander banlist check. [Fonte](https://magic.wizards.com/pt-br/banned-restricted-list). Cards appear color-identity compatible; verify current page before final implementation.

---

**Regra final:** a melhor lista não é a que rouba a maior quantidade de cartas, e sim aquela em que cada roubo oferece uma escolha real — ficar com uma cópia, converter uma criatura em recurso, conservar uma permanente, gerar valor de ETB ou disparar uma nova fase de combate — e que consegue fazê-lo de forma consistente sem abandonar a homenagem e a identidade do deck.
