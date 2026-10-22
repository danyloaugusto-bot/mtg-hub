# K'rrik, Son of Yawgmoth — Handover de análise profunda V2

**Estado:** CURRENT preservado / PROPOSED V2 ainda não testada  
**Data da análise:** 14 de outubro de 2026  
**Comandante:** K'rrik, Son of Yawgmoth (PJ21)  
**Identidade:** Mono-black — lifegain, drain, uso de vida como recurso, reanimação e combos compactos.

> Este handover complementa o Handover Master do projeto Commander. Ele registra lista, estratégia, regras, propostas, riscos e próximos passos para retomar em outro chat sem presumir que qualquer carta foi comprada ou testada.

## 1. Nota inicial e nota projetada

| Versão | Nota estrutural | Leitura |
|---|---:|---|
| CURRENT | **6,8/10** | Tem tutores premium e combos reais, mas tem motores de compra mais lentos, muitas remoções globais e alguns efeitos caros de impacto único. |
| PROPOSED V2 | **8,4/10 projetado** | Mais consistência, compra explosiva, reanimação de baixo custo, aceleração e uma linha compacta adicional de combo. |

As notas são estimativas de construção para Commander casual de alto poder / optimized casual; **não são taxas de vitória medidas**. A V2 não é cEDH e não foi testada em partidas. Para um benchmark cEDH real, seria necessária uma reformulação mais radical da velocidade, proteção de combo e pacote de fast mana.

## 2. Identidade e tese estratégica

A ideia não é simplesmente “ganhar vida”. O plano de K'rrik é usar pontos de vida como recurso de conjuração, recuperar parte desse recurso por lifelink/drain e converter o volume de mágicas em uma vitória consistente.

**Fato de regra:** K'rrik tem lifelink; para cada símbolo {B} em um custo, você pode pagar 2 pontos de vida em vez daquela mana; sempre que conjura uma mágica preta, recebe um marcador +1/+1. A habilidade não reduz o custo total e **não permite pagar vida por mana genérica**. Ela pode ser aplicada a custos de mágicas e custos ativados que tenham símbolos pretos. [Scryfall — K'rrik](https://scryfall.com/card/mh3/274/krrik-son-of-yawgmoth) · [Rulings de K'rrik](https://mtgseeker.com/card/c19/18/krrik-son-of-yawgmoth)

Exemplo: Necropotence custa {B}{B}{B}; com K'rrik em campo, pode ser conjurada pagando 6 de vida sem gastar mana. Já Bolas's Citadel ainda precisa de mana genérica, porque K'rrik não substitui símbolos genéricos.

A lista original já tem três motores importantes:
- **Exquisite Blood + Sanguine Bond / Vito / Enduring Tenacity:** qualquer ganho de vida pode começar um loop de perda de vida e ganho de vida até a partida terminar ou alguém interromper.
- **Aetherflux Reservoir:** transforma cadeias de mágicas em ganho de vida e permite causar 50 de dano por ativação pagando 50 de vida.
- **Ancient Cellarspawn:** manter na lista é importante. K'rrik frequentemente faz a mana gasta para conjurar uma mágica ficar abaixo do mana value, o que pode fazer Ancient Cellarspawn causar perda de vida adicional. [Oracle de Ancient Cellarspawn](https://mtg.wtf/card/dsc/47/Ancient-Cellarspawn)

A prioridade da V2 é tornar esses motores mais acessíveis, sem perder a capacidade de responder a ameaças.

## 3. Plano de jogo

### Begin — início
A prioridade é desenvolver mana e colocar K'rrik em campo com vida suficiente para continuar a sequência. O custo de K'rrik é {4}{B/P}{B/P}{B/P}; como os símbolos são phyrexianos, pode-se pagar 4 manas genéricas e 6 de vida para conjurá-lo. Sol Ring, Dark Ritual e Ancient Tomb ajudam a atingir esse custo mais cedo.

Não pagar vida automaticamente por cada símbolo preto. Avalie se Necropotence/Vilis/Reservoir ou o próprio combate com lifelink vão recuperar vida, e mantenha uma margem contra dano adversário.

### Middle — meio
Estabelecer pelo menos um motor de compra/seleção e manter resposta para a tentativa adversária de interromper uma linha. A V2 acrescenta Necropotence, Vilis e Sensei's Divining Top; Bolas's Citadel converte a vida em acesso ao topo. Entomb + Animate Dead permite colocar uma ameaça premium no campo sem pagar seu custo completo.

### End game — final
Fechar por uma das linhas:
1. Exquisite Blood com Sanguine Bond, Vito ou Enduring Tenacity.
2. K'rrik + Aetherflux Reservoir + Leshrac's Sigil, linha de conjuração/ganho de vida repetível.
3. Exsanguinate, ampliada em certos turnos por Bloodletter of Aclazotz.
4. Gray Merchant of Asphodel e reanimação de massa.
5. Aetherflux Reservoir depois de uma sequência grande de mágicas.

## 4. Auditoria estrutural

A lista tem **100 cartas** incluindo comandante. A contagem física considera 32 terrenos dedicados (25 Swamps básicos e sete outros terrenos) mais 1 MDFC, **Boggart Trawler // Boggart Bog**, cuja face de terreno aumenta as fontes funcionais para 33. A MDFC continua sendo uma única carta e está contada como spell na análise funcional, evitando dupla contagem.

| Métrica | CURRENT | PROPOSED V2 |
|---|---:|---:|
| Cartas totais | 100 | 100 |
| Comandantes | 1 | 1 |
| Terrenos dedicados | 32 | 32 |
| Fontes funcionais de terreno (MDFC incluída) | 33 | 33 |
| Swamps básicos | 25 | 25 |
| Slots de não-terrenos (inclui o lado de criatura da MDFC) | 67 | 67 |
| Wipes/remoção global no grupo primário | 6 | 4 |
| Grupo primário Draw | 10 | 11 |
| Grupo primário Tutor + Reanimator | 6 | 8 |

A lista original não sofre de ausência total de interação: ela já possui Deadly Rollick, Baleful Mastery, Slaughter Pact, Feed the Swarm, Withering Torment e diversos wipes. O excesso está no conjunto de remoções globais de velocidade/cobertura diferentes, enquanto faltam motores que garantam a recuperação de cartas depois de uma sequência de conjurações por vida.

## 5. Agrupamentos 8 — contagem primária

Cada carta tem **um único grupo primário** para contar slots; funções secundárias são registradas nas notas. Os grupos de terreno ficam separados, como no Handover Master.

| Grupo | CURRENT | PROPOSED V2 | Mudança |
|---|---:|---:|---:|
| 1. Ramp | 9 | 9 | 0 |
| 2. Draw | 10 | 11 | +1 |
| 3. Removal Pontual | 13 | 11 | -2 |
| 4. Removal Global | 6 | 4 | -2 |
| 5. WinCon | 8 | 9 | +1 |
| 6. Drain/Gain life | 9 | 10 | +1 |
| 7. Tutor + Reanimator | 6 | 8 | +2 |
| 8. Others + Pet | 6 | 5 | -1 |
| **Total de slots funcionais** | **67** | **67** | **Sem alteração** |

A V2 não reduz interação a ponto de virar combo goldfish: ela mantém Damnation, Toxic Deluge, Shadows' Verdict e Crippling Fear, adiciona Snuff Out e preserva as respostas já existentes que não foram selecionadas para corte.

## 6. As 13 trocas propostas — rastreabilidade

### 1. Necropotence IN ← Phyrexian Arena OUT
**Prioridade:** P1 — Compra

**Por que entra / por que sai:** Arena é previsível, mas lenta. Necropotence pode converter vida em um volume muito maior de cartas e compensar a mão consumida por K'rrik. Risco: pagar vida demais e exilar cartas que talvez quisesse no cemitério.

### 2. Bolas's Citadel IN ← Sorin's Vengeance OUT
**Prioridade:** P1 — Engine/fechamento

**Por que entra / por que sai:** Vengeance drena 10 e recupera 10, mas é um efeito único. Citadel transforma vida em acesso continuado ao topo e eleva a qualidade de Aetherflux Reservoir. Risco: Citadel ainda exige mana genérica e morre para remoção de artefato.

### 3. Vilis, Broker of Blood IN ← Ob Nixilis of the Black Oath OUT
**Prioridade:** P1 — Compra/reanimação

**Por que entra / por que sai:** Ob Nixilis gera valor incremental, enquanto Vilis converte perda de vida em cartas e é um alvo premium para Reanimate/Animate Dead. Risco: conjurá-lo da mão ainda pede cinco manas genéricas, e vida baixa é perigosa.

### 4. Sheoldred, the Apocalypse IN ← Heraldic Banner OUT
**Prioridade:** P1 — Lifegain/drain

**Por que entra / por que sai:** Banner oferece mana e +1/+0, mas o bônus de combate é periférico. Sheoldred recupera vida quando você compra e pune compras adversárias. Risco: custo de quatro manas totais efetivas (2 genéricas + 4 de vida com K'rrik em campo).

### 5. Sensei's Divining Top IN ← Barbed Servitor OUT
**Prioridade:** P1 — Seleção

**Por que entra / por que sai:** Servitor é indestrutível e pode comprar ao conectar, mas precisa causar dano de combate. Top ajuda a ordenar as cartas para Citadel. Risco: Top não gera vantagem de cartas sozinho e não forma loop infinito com Citadel sem mana para ativar.

### 6. Ancient Tomb IN ← Temple of the False God OUT
**Prioridade:** P1 — Base de mana

**Por que entra / por que sai:** Ancient Tomb fornece duas manas genéricas antes de ter cinco terrenos; Temple pode ficar inativo cedo. Risco: Tomb custa 2 de vida por ativação, o que compete com o plano K'rrik.

### 7. Cabal Ritual IN ← Ritual of Soot OUT
**Prioridade:** P1 — Aceleração

**Por que entra / por que sai:** Ritual of Soot é limitado a criaturas de mana value 3 ou menos e redundante com outras limpezas. Cabal Ritual transforma uma mana genérica + símbolo preto (que K'rrik pode pagar com 2 de vida) em BBB ou, com threshold, BBBBB. Risco: é temporário e precisa de mana genérica.

### 8. Bubbling Muck IN ← Mutilate OUT
**Prioridade:** P1 — Aceleração

**Por que entra / por que sai:** Mutilate é bom no mono-black, mas a lista já terá Damnation, Toxic Deluge, Shadows' Verdict e Crippling Fear. Bubbling Muck pode gerar uma janela de mana decisiva com Swamps/Urborg. Risco: piora muito fora de uma sequência de terrenos.

### 9. Animate Dead IN ← Army of the Damned OUT
**Prioridade:** P1 — Reanimator

**Por que entra / por que sai:** Army cria 13 corpos, mas é cara e não é a linha central de lifegain/drain. Animate Dead põe Vilis, Gray Merchant ou Valgavoth no campo por baixo custo. Risco: abrir mão de uma carta vistosa de fichas; se Army for pet, deve ser preservada e outro corte ser escolhido.

### 10. Entomb IN ← Liliana of the Dark Realms OUT
**Prioridade:** P1 — Consistência

**Por que entra / por que sai:** Liliana pode buscar Swamps e remover criatura após investir tempo; Entomb encontra exatamente o alvo que combina com Reanimate/Animate Dead. Risco: Entomb exige cemitério/reanimação e não compra carta por si.

### 11. Snuff Out IN ← Hex OUT
**Prioridade:** P1 — Interação

**Por que entra / por que sai:** Hex pode destruir até seis criaturas, mas custa seis manas e exige seis alvos. Snuff Out pode ser grátis se você controla um Swamp e remove criatura não preta. Risco: não responde a criatura preta e paga 4 de vida como custo alternativo.

### 12. Leshrac's Sigil IN ← Suspended Sentence OUT
**Prioridade:** P1 — Combo

**Por que entra / por que sai:** Suspended Sentence é remoção boa (destrói criatura e faz perder 3 de vida), mas a lista tem interação suficiente para trocar uma resposta por uma linha de vitória compacta. Sigil pode ser conjurado e retornar à mão pagando vida por seus símbolos pretos com K'rrik. Risco: exige K'rrik, Reservoir e vida suficiente; proteja os motores.

### 13. Bloodletter of Aclazotz IN ← Infernal Offering OUT
**Prioridade:** P2 — Fechamento

**Por que entra / por que sai:** Infernal Offering mistura sacrifício, compra e reanimação, mas também dá recursos ao oponente escolhido. Bloodletter duplica a perda de vida dos oponentes durante seu turno, ampliando Exsanguinate e outros drenos. Risco: precisa sobreviver ao turno e não duplica dano causado.


## 7. Auditoria de regras e linhas de vitória

### Combo A — Exquisite Blood + Sanguine Bond / Vito / Enduring Tenacity
A lista atual já tem uma condição de vitória de duas cartas. Exquisite Blood dispara quando um oponente perde vida; Sanguine Bond, Vito e Enduring Tenacity podem fazer um oponente perder vida quando você ganha vida. A sequência se repete. Os três payoffs são redundantes, mas não são automaticamente cortes: cada um também tem utilidade quando não existe combo completo.

### Combo B — K'rrik + Aetherflux Reservoir + Leshrac's Sigil
Leshrac's Sigil tem custo {B}{B} para ser conjurada e uma habilidade {B}{B} para voltar à mão. Com K'rrik no campo, cada um desses custos pode ser pago com 4 de vida. Ao conjurar repetidamente Sigil, Aetherflux Reservoir dispara a cada spell e concede vida em quantidade crescente durante o turno; com vida suficiente para atravessar o início do ciclo, a vida ganha passa a compensar os pagamentos e a sequência pode crescer até permitir ativações de 50 de vida do Reservoir. A linha exige que K'rrik, Reservoir e Sigil permaneçam disponíveis e é vulnerável a remoções/respostas. [Detalhes do combo](https://casualplaneswalker.com/combo/aetherflux-reservoir/krrik-son-of-yawgmoth/) · [Oracle de Leshrac's Sigil](https://mtg.wtf/card/sld/1188/Leshracs-Sigil)

### Bolas's Citadel + Sensei's Divining Top + Aetherflux Reservoir
É um pacote de alto valor para manipular/conjurar do topo, mas **não declarar como infinito por si só**: a habilidade de compra de Sensei's Divining Top custa {1}, então é necessário ter mana disponível ou um efeito adicional que elimine esse custo. A proposta inclui o pacote por seleção e fluxo de mágicas, não com base em um loop garantido.

### Bloodletter of Aclazotz + efeitos de drain
Durante seu turno, Bloodletter duplica a perda de vida dos oponentes. Isso pode ampliar Exsanguinate, Gray Merchant e payoffs de ganho de vida que causam perda de vida. Atenção: a carta dobra **perda de vida**, não a quantidade de dano causado, e o ganho de vida nem sempre é dobrado por substituição direta. [Oracle de Bloodletter](https://mtg.wtf/card/lci/92/Bloodletter-of-Aclazotz)

### Cuidado com a vida
Pagar vida por K'rrik não é dano; lifelink não devolve automaticamente a vida gasta. O lifelink de K'rrik ajuda quando ele causa dano. A sequência correta é usar vida de forma seletiva, criar um motor de compra, recuperar vida e só então acelerar para um fechamento.

## 8. Pets e restrições de coleção

O usuário informou que algumas cartas de maior beleza/valor são pets, mas ainda não listou quais são. **Nenhuma carta marcada *F* ou *E* na lista atual foi escolhida como corte nesta V2.** Mesmo assim, ausência de marcador não prova que uma carta não seja pet. Army of the Damned e outras cartas cortadas podem ser preservadas se forem parte da experiência que o usuário valoriza; nesse caso, registrar o pet e substituir outro slot de eficiência inferior.

Não há cartas presumidas como compradas: as inclusões são sugestões. Não foi assumido orçamento limitado. A versão original permanece CURRENT; todas as entradas e saídas estão em PROPOSED V2.

## 9. Lista completa CURRENT

Abaixo está a lista submetida, reagrupada apenas para leitura. As quantidades e impressões foram preservadas; a MDFC é mostrada com as duas faces no nome.

### Commander
- 1 K'rrik, Son of Yawgmoth (PJ21 2 *F*)

### Base de mana
- 1 Bojuka Bog (CLB 882) — Land
- 1 Cabal Stronghold (DOM 238) — Land
- 1 Demolition Field (BRO 260) — Land
- 1 Mutavault (CLB 903) — Land
- 1 Myriad Landscape (MIC 177 *F*) — Land
- 1 Temple of the False God (PLST C18-285) — Land
- 1 Urborg, Tomb of Yawgmoth (LTC 375) — Land
- 25 Swamp (ACR 105 *F*) — Basic Land

### Ramp
- 1 Arcane Signet (M3C 283)
- 1 Charcoal Diamond (VOC 162)
- 1 Crypt Ghast (GTC 61)
- 1 Dark Ritual (BTD 21)
- 1 Heraldic Banner (FDN 254)
- 1 Jet Medallion (MH3 292)
- 1 Liliana of the Dark Realms (M14 102)
- 1 Nirkana Revenant (VOC 134)
- 1 Sol Ring (VOC 168)

### Draw
- 1 Alhammarret's Archive (PLST ORI-221)
- 1 Barbed Servitor (MKM 77)
- 1 Deadly Dispute (BLC 181)
- 1 Insatiable Avarice (OTJ 91)
- 1 Phyrexian Arena (CC2 4)
- 1 Preacher of the Schism (LCI 113 *F*)
- 1 Promise of Power (C14 157)
- 1 Sign in Blood (STA 32)
- 1 Tarrian's Journal // The Tomb of Aclazotz (LCI 126)
- 1 Unholy Annex // Ritual Chamber (DSK 118)

### Removal Pontual
- 1 Baleful Mastery (STX 64)
- 1 Boggart Trawler // Boggart Bog (MH3 243) — MDFC: a face Boggart Bog funciona como terreno; já contado entre as fontes funcionais, não como uma carta extra.
- 1 Call to the Void (PCLB 118s *F*)
- 1 Consuming Corruption (MH3 84)
- 1 Erebos's Intervention (THB 94 *F*)
- 1 Feed the Swarm (CMM 159)
- 1 Font of Agonies (PRNA 74s *F*)
- 1 Hex (OTC 136)
- 1 Infernal Offering (C21 146)
- 1 Slaughter Pact (TSR 138)
- 1 Suspended Sentence (DSC 54)
- 1 Tendrils of Corruption (TSR 145)
- 1 Withering Torment (DSK 124)

### Removal Global
- 1 Crippling Fear (CMM 862)
- 1 Damnation (2X2 73)
- 1 Mutilate (GVL 55)
- 1 Ritual of Soot (PGRN 84p)
- 1 Shadows' Verdict (ZNR 344 *F*)
- 1 Toxic Deluge (C13 96)

### WinCon
- 1 Aetherflux Reservoir (KLD 192)
- 1 Army of the Damned (NCC 242)
- 1 Grievous Wound (DSK 416 *F*)
- 1 Platinum Angel (CN2 214)
- 1 Rise of the Dark Realms (FDN 183)
- 1 Sorin's Vengeance (M12 111)
- 1 Unstoppable Slasher (DSK 312)
- 1 Valgavoth, Terror Eater (DSK 120)

### Drain/Gain life
- 1 Aclazotz, Deepest Betrayal (LCI 316)
- 1 Blood Artist (J22 117)
- 1 Dread Presence (M20 96)
- 1 Enduring Tenacity (DSK 95)
- 1 Exquisite Blood (AVR 102)
- 1 Exsanguinate (CMM 638)
- 1 Gray Merchant of Asphodel (THS 89)
- 1 Sanguine Bond (WOT 35)
- 1 Vito, Thorn of the Dusk Rose (J22 487)

### Tutor + Reanimator
- 1 Command the Dreadhorde (WAR 82)
- 1 Demonic Tutor (J20 4 *F*)
- 1 Imperial Seal (2X2 439 *E*)
- 1 Profane Tutor (MH2 97)
- 1 Reanimate (JMP 270)
- 1 Vampiric Tutor (DMR 430)

### Others + Pet
- 1 Ancient Cellarspawn (DSC 47)
- 1 Deadly Rollick (CMM 695)
- 1 Ghoulcaller Gisa (CC2 2)
- 1 Liliana, Heretical Healer (CC2 1)
- 1 Ob Nixilis of the Black Oath (CMM 176)
- 1 Ophiomancer (CC2 3)


## 10. Lista completa PROPOSED V2

Esta é a lista resultante das 13 trocas. As cartas novas são marcadas **IN V2**; impressão não especificada significa apenas que foi recomendada a carta, não uma edição específica.

### Commander
- 1 K'rrik, Son of Yawgmoth (PJ21 2 *F*)

### Base de mana
- 1 Bojuka Bog (CLB 882) — Land
- 1 Cabal Stronghold (DOM 238) — Land
- 1 Demolition Field (BRO 260) — Land
- 1 Mutavault (CLB 903) — Land
- 1 Myriad Landscape (MIC 177 *F*) — Land
- 1 Urborg, Tomb of Yawgmoth (LTC 375) — Land
- **IN V2** 1 Ancient Tomb — Land
- 25 Swamp (ACR 105 *F*) — Basic Land

### Ramp
- 1 Arcane Signet (M3C 283)
- 1 Charcoal Diamond (VOC 162)
- 1 Crypt Ghast (GTC 61)
- 1 Dark Ritual (BTD 21)
- 1 Jet Medallion (MH3 292)
- 1 Nirkana Revenant (VOC 134)
- 1 Sol Ring (VOC 168)
- **IN V2** 1 Cabal Ritual
- **IN V2** 1 Bubbling Muck

### Draw
- 1 Alhammarret's Archive (PLST ORI-221)
- 1 Deadly Dispute (BLC 181)
- 1 Insatiable Avarice (OTJ 91)
- 1 Preacher of the Schism (LCI 113 *F*)
- 1 Promise of Power (C14 157)
- 1 Sign in Blood (STA 32)
- 1 Tarrian's Journal // The Tomb of Aclazotz (LCI 126)
- 1 Unholy Annex // Ritual Chamber (DSK 118)
- **IN V2** 1 Necropotence
- **IN V2** 1 Vilis, Broker of Blood
- **IN V2** 1 Sensei's Divining Top

### Removal Pontual
- 1 Baleful Mastery (STX 64)
- 1 Boggart Trawler // Boggart Bog (MH3 243) — MDFC: a face Boggart Bog funciona como terreno; já contado entre as fontes funcionais, não como uma carta extra.
- 1 Call to the Void (PCLB 118s *F*)
- 1 Consuming Corruption (MH3 84)
- 1 Erebos's Intervention (THB 94 *F*)
- 1 Feed the Swarm (CMM 159)
- 1 Font of Agonies (PRNA 74s *F*)
- 1 Slaughter Pact (TSR 138)
- 1 Tendrils of Corruption (TSR 145)
- 1 Withering Torment (DSK 124)
- **IN V2** 1 Snuff Out

### Removal Global
- 1 Crippling Fear (CMM 862)
- 1 Damnation (2X2 73)
- 1 Shadows' Verdict (ZNR 344 *F*)
- 1 Toxic Deluge (C13 96)

### WinCon
- 1 Aetherflux Reservoir (KLD 192)
- 1 Grievous Wound (DSK 416 *F*)
- 1 Platinum Angel (CN2 214)
- 1 Rise of the Dark Realms (FDN 183)
- 1 Unstoppable Slasher (DSK 312)
- 1 Valgavoth, Terror Eater (DSK 120)
- **IN V2** 1 Bolas's Citadel
- **IN V2** 1 Leshrac's Sigil
- **IN V2** 1 Bloodletter of Aclazotz

### Drain/Gain life
- 1 Aclazotz, Deepest Betrayal (LCI 316)
- 1 Blood Artist (J22 117)
- 1 Dread Presence (M20 96)
- 1 Enduring Tenacity (DSK 95)
- 1 Exquisite Blood (AVR 102)
- 1 Exsanguinate (CMM 638)
- 1 Gray Merchant of Asphodel (THS 89)
- 1 Sanguine Bond (WOT 35)
- 1 Vito, Thorn of the Dusk Rose (J22 487)
- **IN V2** 1 Sheoldred, the Apocalypse

### Tutor + Reanimator
- 1 Command the Dreadhorde (WAR 82)
- 1 Demonic Tutor (J20 4 *F*)
- 1 Imperial Seal (2X2 439 *E*)
- 1 Profane Tutor (MH2 97)
- 1 Reanimate (JMP 270)
- 1 Vampiric Tutor (DMR 430)
- **IN V2** 1 Animate Dead
- **IN V2** 1 Entomb

### Others + Pet
- 1 Ancient Cellarspawn (DSC 47)
- 1 Deadly Rollick (CMM 695)
- 1 Ghoulcaller Gisa (CC2 2)
- 1 Liliana, Heretical Healer (CC2 1)
- 1 Ophiomancer (CC2 3)


## 11. Fontes de pesquisa

- Scryfall — K'rrik, Son of Yawgmoth: https://scryfall.com/card/mh3/274/krrik-son-of-yawgmoth
- EDH.Wiki — K'rrik Lifegain: https://edh.wiki/commanders/krrik-son-of-yawgmoth/lifegain/
- EDHREC — K'rrik Lifegain: https://edhrec.com/commanders/krrik-son-of-yawgmoth/lifegain
- EDHREC — K'rrik Optimized Lifegain: https://edhrec.com/commanders/krrik-son-of-yawgmoth/optimized/lifegain
- EDHREC — K'rrik cEDH Lifegain (benchmark de teto, não lista a copiar): https://edhrec.com/commanders/krrik-son-of-yawgmoth/cedh/lifegain
- K'rrik rulings: https://mtgseeker.com/card/c19/18/krrik-son-of-yawgmoth
- Leshrac's Sigil + Aetherflux Reservoir + K'rrik: https://casualplaneswalker.com/combo/aetherflux-reservoir/krrik-son-of-yawgmoth/
- Oracle Leshrac's Sigil: https://mtg.wtf/card/sld/1188/Leshracs-Sigil
- Oracle Ancient Cellarspawn: https://mtg.wtf/card/dsc/47/Ancient-Cellarspawn
- Oracle Bloodletter of Aclazotz: https://mtg.wtf/card/lci/92/Bloodletter-of-Aclazotz
- Oracle Bubbling Muck: https://mtg.wtf/card/plst/UDS-54/Bubbling-Muck
- Oracle Cabal Ritual: https://mtg.wtf/card/tor/51/Cabal-Ritual

Os benchmarks externos ajudam a identificar padrões de construção (Necropotence, Vilis, Bolas's Citadel, Jet Medallion, reanimação, fast mana), mas a recomendação é baseada em encaixe e custo de oportunidade nesta lista específica.

## 12. Plano de playtest

Registre de 5 a 10 partidas antes de fazer uma segunda rodada de cortes. Evite alterar várias cartas depois de cada partida.

Para cada jogo, observar:
1. Qual turno K'rrik entrou e quanta vida restou após a primeira sequência de spells.
2. Se havia compra/tutor depois do primeiro motor.
3. Se a vida paga foi recuperada por lifelink, Gray Merchant, Exsanguinate, Reservoir ou Sheoldred.
4. Quantas mágicas ficaram mortas na mão e se faltou mana genérica.
5. Se as remoções responderam a tempo e se houve ausência de wipe quando necessário.
6. Se a vitória veio da linha Exquisite Blood, da linha Sigil/Reservoir, de drain ou de combate.
7. O efeito da mão inicial e se a versão reconstruiu depois que K'rrik foi removido.

Não concluir que uma carta é boa/ruim com base em uma única partida. Registrar resultado, posição na ordem, turno, pod, vida mínima e forma de fechamento.

## 13. Próximos passos

1. Testar PROPOSED V2 sem fazer cortes adicionais simultâneos.
2. Identificar quais cortes propostos são pets quando houver tempo; se algum for pet, mantê-lo e escolher um substituto.
3. Depois dos primeiros testes, decidir se o deck precisa de mais fast mana/proteção de combo ou se o gargalo principal ainda é comprar cartas.

**Prompt de retomada:** “Continue a análise profunda de K'rrik usando este Handover e `Krrik_Son_of_Yawgmoth_Dashboard_V2.xlsx`. Preserve CURRENT, trate PROPOSED V2 como não testada, não assuma os pets sem confirmação, e use o Playtest Log para orientar a próxima rodada.”
