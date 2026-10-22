# Análise: Dízimo de Sangue (K'rrik, Son of Yawgmoth)
Analista: Claude | Data: 14/10/2026
Lista conferida: sim, 100 cartas com o comandante, nenhuma repetida fora os Swamps, tudo mono-preto, nenhuma banida | Cartas sem texto conferido: 0

## Nota de partida

**Nota atual: 6 de 10.** **Projetada com as 17 trocas: 8,5**, como projeção sem partida.

O "mediano, faltou consistência" que você sentiu tem causa medida, e não é falta de carta forte. São três coisas:

1. **O deck não foi montado em volta do K'rrik.** O que o K'rrik faz é deixar pagar cada {B} com 2 de vida. A lista tem 9 cartas simétricas ou que trabalham contra isso:
   - Platinum Angel trava o pagamento com vida em 0;
   - Damnation e Mutilate matam o próprio K'rrik;
   - Army of the Damned, Rise of the Dark Realms e Alhammarret's Archive custam mana que a vida não paga.
2. **O combo existe, mas com uma peça só do lado que importa.** O Exquisite Blood fecha laço infinito com Sanguine Bond, Vito, Enduring Tenacity e Aetherflux, e é a única carta que converte perda de vida dos oponentes em ganho seu. Montar o combo até o turno 8 acontece em 39% das partidas, contando tutores.
3. **Responder no turno dos outros é raro.** O deck tem 8 remoções pontuais instantâneas, e 6 limpezas globais competem com elas pelo mesmo papel.

**Como li o pedido.**
- Você pediu deck responsivo, equilibrado e competitivo, sem estratégia definida. Criei a estratégia e entreguei 17 trocas: uma reestruturação, não ajuste fino.
- Mantive seus oito eixos.
- **Cartas de estimação:** você disse que serão as mais bonitas e caras, mas não listou. Assumi como pets as cartas foil e etched da sua lista: Call to the Void, Demonic Tutor, Erebos's Intervention, Font of Agonies, Grievous Wound, Imperial Seal, Preacher of the Schism, Shadows' Verdict, o próprio K'rrik e os Swamps. **Nenhuma delas saiu.**
- Game Changers: continuam três. O Vampiric Tutor deu lugar ao Bolas's Citadel. O Imperial Seal ficou por ser pet.

---

## 1. Plano

### 1.1 O que o K'rrik faz, palavra por palavra

| O que se costuma achar | O que o texto e as rulings dizem | Fonte |
|---|---|---|
| Ele paga qualquer mana com vida | Só os {B}. Genérico e X nunca: "You can't pay 2 life to pay for generic mana" | Ruling do K'rrik |
| Só vale para conjurar mágicas | Vale em qualquer custo, inclusive de ativação. Font of Agonies, extort e o {B} de equipar contam | Ruling do K'rrik |
| Híbrido não conta | {W/B} e {B/G} contam se você escolher a parte preta. O extort do Crypt Ghast e do Pontiff sai por 2 de vida | Ruling do K'rrik |
| Barateia o próprio K'rrik na zona de comando | Não barateia. O próprio custo dele tem {B/P}, que já pode ser pago com vida, e o imposto é genérico | Texto e CR 903.8 |
| Platinum Angel é seguro | Em 0 de vida você não paga mais custo de vida. O Angel desliga o comandante | CR 119.4 |
| Gray Merchant conta o que você pagou | Conta os {B} impressos. O K'rrik soma 3 de devoção mesmo pago com vida | Ruling citada na varredura |

### 1.2 A conta do deck

**Pagar, drenar, repagar.**

A lista tem 89 símbolos {B} em cartas que não são terreno. Com o K'rrik em campo, o custo médio em mana cai de 3,58 para 2,27. Cada 2 de vida vira uma mana preta.

Em linguagem de FP&A, é o capital de giro do Vito levado ao limite. Lá a vida era caixa que o dreno engordava. Aqui a vida é uma **linha de crédito**: o K'rrik saca, e quem amortiza são o vínculo dele, Sheoldred, Exquisite Blood, os drenos e o Bloodthirsty Conqueror. O deck perde quando saca sem ter quem amortize. Por isso a lista nova põe mais peças de ganho de vida e tira as cartas que custam vida sem devolver nada.

### 1.3 Onde a lista trai o plano, em ordem de gravidade

1. **Cartas que desligam o comandante ou morrem com ele:** Platinum Angel, Damnation e Mutilate.
2. **Mana genérica cara:** Army of the Damned (8), Rise of the Dark Realms (9) e Alhammarret's Archive (5 genéricos). O K'rrik não paga nada disso.
3. **Fechamento com uma peça só de um lado.** O Exquisite Blood é o único que transforma a perda de vida dos oponentes em ganho seu. Sem ele, Bond, Vito e Tenacity viram dreno linear.
4. **Pagadores de morte num deck sem morte:** Blood Artist, Ophiomancer, Ghoulcaller Gisa e Liliana, Heretical Healer pedem sacrifício, e a lista não tem como sacrificar de forma repetida.
5. **Poucas respostas em velocidade de instantâneo** para quem quer ser responsivo.

### 1.4 Estratégia proposta, nas três fases

| Fase | O que o deck faz | Peças principais |
|---|---|---|
| Início (1 a 4) | Rock, ritual e um motor de cartas barato; remoção instantânea guardada | Sol Ring, Jet Medallion, Dark Ritual, Cabal Ritual, Phyrexian Arena, Sheoldred, Preacher |
| Meio (5 a 7) | O K'rrik entra protegido; a vida vira mana e cartas | Swiftfoot Boots, Vilis, Bolas's Citadel, Dread Presence, Font of Agonies |
| Fim | O combo do Exquisite Blood ou o dreno em massa | Exquisite Blood ou Bloodthirsty Conqueror com Bond, Vito, Tenacity ou Aetherflux; Exsanguinate com Coffers e Nykthos |

---

## 2. Agrupamentos

Seus oito eixos: Ramp · Draw · Removal Pontual · Removal Global · WinCon · Drain/Gain life · Tutor + Reanimator · Others + Pet.

**Ressalva, registrada uma vez.** "Others + Pet" mistura uma categoria residual com uma marca afetiva. Pontuei nele só o que é utilidade (proteção, ódio de cemitério) e marquei os pets na coluna de relevância, como no resto da série. Falta um eixo de proteção do comandante. Ela foi notada em "Others".

| Eixo | Dedicadas hoje | Depois | Soma hoje | Depois |
|---|---|---|---|---|
| Ramp | 9 | 11 | 27 | 34 |
| Draw | 11 | 13 | 26 | 31 |
| Removal Pontual | 12 | 15 | 32 | 42 |
| Removal Global | 6 | 4 | 16 | 11 |
| WinCon | 12 | 14 | 41 | 45 |
| Drain/Gain life | 14 | 17 | 48 | 56 |
| Tutor + Reanimator | 8 | 7 | 22 | 20 |
| Others + Pet | 0 | 1 | 14 | 13 |

---

## 3. Carta a carta

### Comandante (1)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| K'rrik, Son of Yawgmoth | 3·0·0·0·2·2·0·0 | S | INS (pet) | Vínculo; cada {B} de qualquer custo pode ser pago com 2 de vida; +1/+1 por mágica preta | Transforma vida em mana. Ele mesmo sai por {4} e 6 de vida |

### Criaturas (18)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Vito, Thorn of the Dusk Rose | 0·0·0·0·3·3·0·0 | S | INS | Ganha vida: oponente perde | Outra metade, barata |
| Ancient Cellarspawn | 0·0·0·0·1·1·0·1 | A | ALT | Mágica paga com menos mana: oponente perde a diferença | Feita para o K'rrik |
| Crypt Ghast | 3·0·0·0·0·1·0·0 | A | ALT | Swamp dá B extra; extort | Extort pagável com vida |
| Dread Presence | 0·2·2·0·0·2·0·0 | A | ALT | Swamp entra: compra ou 2 de dano e ganha 2 | 25 Swamps: motor e remoção |
| Enduring Tenacity | 0·0·0·0·3·3·0·0 | A | ALT | Ganha vida: oponente perde; volta como encantamento | Metade resiliente |
| Gray Merchant of Asphodel | 0·0·0·0·2·3·0·0 | A | ALT | Dreno pela devoção | O K'rrik soma 3 de devoção |
| Preacher of the Schism | 0·2·0·0·0·2·0·1 | A | ALT (pet) | Compra ou Vampiro com vínculo ao atacar | Motor barato |
| Aclazotz, Deepest Betrayal | 0·2·0·0·1·1·0·0 | B | MÉD | Voa, vínculo; descarte ao atacar; verso terreno | Valor; precisa atacar |
| Boggart Trawler | 0·0·0·0·0·0·0·1 | B | ALT | Exila um cemitério; verso terreno (3 de vida ou virado) | Ódio de cemitério que é terreno |
| Nirkana Revenant | 3·0·0·0·0·0·0·0 | B | ALT | Swamp dá B extra | Redundância do Ghast |
| Valgavoth, Terror Eater | 0·0·0·0·2·2·0·0 | B | MÉD | Vínculo; rouba cartas | {6} genérico pesa |
| Barbed Servitor | 0·1·0·0·0·1·0·0 | C | BAX | Compra ao conectar; drena ao sofrer dano | Fraco |
| Blood Artist | 0·0·0·0·1·2·0·0 | C | BAX | Morte de criatura: dreno 1 | Poucas mortes no deck |
| Liliana, Heretical Healer | 0·0·0·0·0·1·1·0 | C | MÉD | Vínculo; transforma com morte | Lento sem sacrifício |
| Unstoppable Slasher | 0·0·0·0·2·0·0·0 | C | BAX | Dano de combate tira metade da vida | Depende de combate |
| Ghoulcaller Gisa | 0·0·0·0·0·0·0·1 | D | BAX | Sacrifica: fichas | Fora do plano |
| Ophiomancer | 0·0·0·0·0·0·0·1 | D | BAX | Cobra 1/1 por manutenção | Sem saída de sacrifício que pague |
| Platinum Angel | 0·0·0·0·1·0·0·1 | D | BAX | Você não perde | Em 0 de vida não paga mais custo de vida |

### Instantâneas e feitiços (33)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Dark Ritual | 3·0·0·0·0·0·0·0 | S | INS | BBB | Com o K'rrik: 2 de vida viram BBB |
| Demonic Tutor | 0·0·0·0·0·0·3·1 | S | INS (pet) | Tutor | Game Changer |
| Toxic Deluge | 0·0·0·3·0·0·0·0 | S | INS | −X/−X pagando vida | O K'rrik grande sobrevive |
| Baleful Mastery | 0·0·3·0·0·0·0·0 | A | ALT | Exila criatura ou PW | {1} e 2 de vida |
| Consuming Corruption | 0·0·3·0·0·2·0·0 | A | ALT | X por Swamp e ganha X | Grátis com o K'rrik |
| Deadly Rollick | 0·0·3·0·0·0·0·0 | A | ALT | Grátis com comandante | Grátis |
| Exsanguinate | 0·0·0·0·3·3·0·0 | A | ALT | Cada oponente perde X; você ganha | X é genérico |
| Imperial Seal | 0·0·0·0·0·0·3·1 | A | ALT (pet) | Tutor para o topo | Game Changer |
| Shadows' Verdict | 0·0·0·3·0·0·0·0 | A | ALT (pet) | Exila MV 3 ou menos, campo e cemitérios | O K'rrik tem MV 7 e fica |
| Vampiric Tutor | 0·0·0·0·0·0·3·0 | A | ALT | Tutor para o topo | Game Changer |
| Crippling Fear | 0·0·0·2·0·0·0·0 | B | MÉD | Não-tipo escolhido −3/−3 | Escolhendo Horror, poupa o K'rrik |
| Deadly Dispute | 1·2·0·0·0·0·0·0 | B | MÉD | Sacrifica: compra 2 e Tesouro | Pede sacrifício |
| Erebos's Intervention | 0·0·2·0·0·1·0·1 | B | ALT (pet) | −X/−X e ganha X; ou exila cemitério | X é genérico |
| Feed the Swarm | 0·0·3·0·0·0·0·0 | B | ALT | Criatura ou encantamento | Pega encantamento |
| Insatiable Avarice | 0·2·0·0·0·0·2·0 | B | ALT | Tutor para o topo e/ou compra 3 | Spree |
| Profane Tutor | 0·0·0·0·0·0·2·0 | B | ALT | Suspend 2: tutor | Lento |
| Promise of Power | 0·3·0·0·1·0·0·0 | B | MÉD | Compra 5 ou Demon X/X | {2} e 6 de vida |
| Reanimate | 0·0·0·0·0·0·2·0 | B | ALT | Reanima | Barata |
| Ritual of Soot | 0·0·0·2·0·0·0·0 | B | ALT | Destrói MV 3 ou menos | Também poupa o K'rrik |
| Sign in Blood | 0·2·0·0·0·0·0·0 | B | ALT | Compra 2 | Grátis com o K'rrik: 4 de vida |
| Slaughter Pact | 0·0·2·0·0·0·0·0 | B | MÉD | Grátis; paga {2}{B} na manutenção | Não mata criatura preta |
| Sorin's Vengeance | 0·0·0·0·2·3·0·0 | B | MÉD | 10 de dano e ganha 10 | {4} e 6 de vida |
| Suspended Sentence | 0·0·2·0·0·1·0·0 | B | MÉD | Destrói e drena 3 | {3} genérico |
| Tendrils of Corruption | 0·0·3·0·0·2·0·0 | B | ALT | X por Swamp e ganha X | {3} genérico |
| Withering Torment | 0·0·3·0·0·0·0·0 | B | ALT | Criatura ou encantamento | Instantânea |
| Army of the Damned | 0·0·0·0·2·0·0·0 | C | BAX | 13 Zumbis | Oito manas sem pagador de fichas |
| Call to the Void | 0·0·0·1·0·0·0·0 | C | MÉD (pet) | Cada jogador escolhe uma criatura sua e uma alheia | Fraca, mas foil |
| Command the Dreadhorde | 0·0·0·0·1·0·2·0 | C | BAX | Reanima tudo; dano igual ao MV total | Dano alto num deck que paga com vida |
| Damnation | 0·0·0·3·0·0·0·0 | C | BAX | Destrói tudo | Mata o próprio K'rrik |
| Hex | 0·0·2·0·0·0·0·0 | C | BAX | Destrói seis criaturas-alvo | Precisa de seis alvos |
| Mutilate | 0·0·0·2·0·0·0·0 | C | BAX | −1/−1 por Swamp | Com 25 Swamps, mata o K'rrik também |
| Rise of the Dark Realms | 0·0·0·0·1·0·2·0 | C | BAX | Todas as criaturas dos cemitérios | Nove manas |
| Infernal Offering | 0·1·0·0·0·0·1·0 | D | BAX | Você e um oponente sacrificam, compram e reanimam | Simétrica |

### Artefatos (8)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Sol Ring | 3·0·0·0·0·0·0·0 | S | INS | {C}{C} | O genérico é o que a vida não paga |
| Aetherflux Reservoir | 0·0·0·0·3·1·0·0 | A | ALT | Vida por mágica; 50 de vida: 50 de dano | Com o Exquisite, fecha |
| Jet Medallion | 2·0·0·0·0·0·0·0 | A | ALT | Mágicas pretas custam 1 a menos | Reduz justamente o genérico |
| Arcane Signet | 2·0·0·0·0·0·0·0 | B | ALT | B | Rock |
| Tarrian's Journal | 0·2·0·0·0·0·1·0 | B | MÉD | Sacrifica e compra; verso terreno que reanima | Dupla função |
| Alhammarret's Archive | 0·2·0·0·0·1·0·0 | C | BAX | Dobra ganho de vida e compras | Cinco manas genéricas, nada pagável com vida |
| Charcoal Diamond | 2·0·0·0·0·0·0·0 | C | MÉD | Virado; B | Rock lento |
| Heraldic Banner | 2·0·0·0·0·0·0·0 | C | BAX | +1/+0 a pretas; B | Rock de 3 num deck de poucas criaturas |

### Encantamentos e planeswalker (8)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Exquisite Blood | 0·0·0·0·3·3·0·0 | S | INS | Oponente perde vida: você ganha | Metade do combo com Bond, Vito, Tenacity e Aetherflux |
| Font of Agonies | 0·0·3·0·0·0·0·1 | S | INS (pet) | Pagar vida põe marcadores; 4 marcadores destroem criatura | Cada {B} pago com vida vira remoção |
| Sanguine Bond | 0·0·0·0·3·3·0·0 | S | INS | Ganha vida: oponente perde | Outra metade |
| Phyrexian Arena | 0·3·0·0·0·0·0·0 | A | ALT | Compra por manutenção | {1} e 4 de vida |
| Grievous Wound | 0·0·0·0·2·1·0·1 | B | MÉD (pet) | Jogador não ganha vida; dano tira metade | Fecha um oponente |
| Liliana of the Dark Realms | 2·0·1·0·0·0·0·0 | B | MÉD | +1 busca Swamp | Ramp lento |
| Ob Nixilis of the Black Oath | 0·0·0·0·1·2·0·0 | B | MÉD | +2 drena 1 de cada oponente | Ganho de vida recorrente |
| Unholy Annex // Ritual Chamber | 0·2·0·0·1·1·0·0 | B | MÉD | Compra no fim do turno; com Demon drena 2 | Sem Demon perde 2 |

### Terrenos (32)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Cabal Stronghold | 1·0·0·0·0·0·0·0 | B | ALT | {3}: B por Swamp básico | Mana grande tardia |
| 25× Swamp | 0·0·0·0·0·0·0·0 | B | MÉD | B | Básico |
| Urborg, Tomb of Yawgmoth | 1·0·0·0·0·0·0·0 | B | ALT | Tudo vira Swamp | Conta para Coffers, Consuming Corruption e Tendrils |
| Bojuka Bog | -1·0·0·0·0·0·0·1 | C | MÉD | Virado; exila cemitério | Ódio de cemitério |
| Mutavault | 0·0·0·0·0·0·0·1 | C | MÉD | Incolor; vira 2/2 | Pouco valor aqui |
| Temple of the False God | 1·0·0·0·0·0·0·0 | C | MÉD | {C}{C} com 5 terrenos | Morto no início |
| Demolition Field | 0·0·0·0·0·0·0·1 | D | BAX | Destrói terreno não básico; os dois buscam básico | Simétrico e lento |
| Myriad Landscape | -1·0·0·0·0·0·0·0 | D | BAX | Virado; busca dois Swamps virados | Mono-preto não precisa de correção |


---

## 4. Diagnóstico

### 4.1 Faixas

| Item | Hoje | Faixa | Leitura |
|---|---|---|---|
| Fontes de terreno | 32 | 35 a 37 | Abaixo, de propósito: o K'rrik paga os {B} com vida, e o custo médio efetivo é 2,27 |
| Ramp dedicado | 9 | 10 a 12 | Quase na faixa |
| Draw dedicado | 11 | 10 a 12 | Na faixa |
| Remoção pontual | 12 | 8 a 12 | Na faixa, mas só 8 instantâneas |
| Remoção global | 6 | 3 a 5 | Acima, e duas matam o K'rrik |

### 4.2 Gerar e converter

| Gera | Converte |
|---|---|
| Vida: vínculo do K'rrik, Consuming Corruption, Tendrils, Gray Merchant, Sorin's Vengeance, Ob Nixilis | Um Exquisite Blood e três peças do outro lado; o Aetherflux pede 51 de vida |

### 4.3 Concentração no comandante

Alta. Sem o K'rrik, o deck é um mono-preto com custo médio 3,58 e 32 terrenos. A lista atual não tem nenhuma peça que o proteja. A nova tem as Swiftfoot Boots e o Malakir Rebirth.

### 4.4 Combos já na lista

| Peças | Resultado | ID |
|---|---|---|
| Exquisite Blood + Sanguine Bond | Laço infinito de dreno | 690-3966 |
| Exquisite Blood + Vito | Idem | 314-3966 |
| Exquisite Blood + Enduring Tenacity | Idem | 3966-5755 |
| Exquisite Blood + Aetherflux Reservoir | Idem, com 51 de vida ou mais | 3966-4740 |

A Bloodthirsty Conqueror (entrada) tem a mesma linha de texto do Exquisite Blood ("sempre que um oponente perde vida, você ganha o mesmo tanto"). Ela forma os mesmos quatro laços, por dedução direta do texto. Pela regra do Bracket 3, combo de duas cartas montado cedo não é permitido. A lista já tinha quatro desses combos.

### 4.5 Distribuição e placar

| | S | A | B | C | D | INS | ALT | MÉD | BAX |
|---|---|---|---|---|---|---|---|---|---|
| Hoje | 9 | 16 | 52 | 17 | 6 | 9 | 30 | 44 | 17 |
| Com as trocas | 13 | 25 | 55 | 7 | 0 | 13 | 42 | 44 | 1 |

Placar: **304** hoje e **345** com as trocas. Só compara o deck com ele mesmo.

---

## 5. Combos e linhas

**Motores (lista nova):**
- **Vilis:** cada {B} pago com 2 de vida compra 2 cartas. Um Sign in Blood pago com vida e mirado em você mesmo compra 8: 4 pelo pagamento, 2 da carta e mais 2 pela perda de vida.
- **Bolas's Citadel:** joga do topo pagando vida.
- **Sheoldred:** cada compra sua ganha 2, e com Bond ou Vito isso vira dreno.
- **Dread Presence:** 25 Swamps são 25 gatilhos.
- **Font of Agonies:** a vida paga vira remoção.

**Fechamentos:**
1. Os quatro laços do Exquisite Blood, agora com uma segunda peça (a Conqueror).
2. **Exsanguinate com Cabal Coffers ou Nykthos.** O X é a única parte que a vida não paga, e é isso que os dois terrenos novos entregam.
3. **Bloodletter of Aclazotz** dobra o Exsanguinate, o Gray Merchant e a Sorin's Vengeance no seu turno.
4. **Pontiff of Blight:** cada mágica é um extort pago com 2 de vida, que drena 1 de cada oponente.

**Cuidado com a vida.** Pague com vida até perto de 15. Abaixo disso, pague em mana. A vida não é só recurso; é também o placar de quem está te atacando.

---

## 6. Cortes

1. **Platinum Angel.** Desliga o comandante em 0 de vida.
2. **Damnation.** Mata o K'rrik.
3. **Mutilate.** Idem.
4. **Army of the Damned.** Oito manas, quase todas genéricas.
5. **Rise of the Dark Realms.** Nove manas.
6. **Alhammarret's Archive.** Cinco genéricas.
7. **Hex.** Precisa de seis alvos.
8. **Infernal Offering.** Simétrica.
9. **Blood Artist, Ophiomancer e Ghoulcaller Gisa.** Pagam por mortes que o deck não produz.
10. **Barbed Servitor e Unstoppable Slasher.** Dependem de combate.

Saem também Heraldic Banner, Vampiric Tutor (troca de Game Changer), Myriad Landscape e Demolition Field.

**Primeira da fila se não for pet:** Call to the Void.

---

## 7. Entradas e o efeito somado

| Sai | Entra | Notas da entrada | Por quê |
|---|---|---|---|
| Platinum Angel | Bloodthirsty Conqueror | 0·0·0·0·3·3·0·0 | O Angel trava o pagamento com vida; o Conqueror é o segundo Exquisite Blood |
| Alhammarret's Archive | Vilis, Broker of Blood | 0·3·1·0·1·0·0·0 | Cinco manas genéricas por um motor que compra com a vida que você paga |
| Vampiric Tutor | Bolas's Citadel | 1·3·0·0·1·0·0·0 | Troca de Game Changer; o total segue em 3 |
| Army of the Damned | Sheoldred, the Apocalypse | 0·1·0·0·2·3·0·0 | Oito manas sem pagador por um motor de ganho e dreno |
| Damnation | Snuff Out | 0·0·3·0·0·0·0·0 | Limpeza que mata o K'rrik por remoção grátis |
| Mutilate | Infernal Grasp | 0·0·3·0·0·0·0·0 | Idem |
| Hex | Bitter Triumph | 0·0·3·0·0·0·0·0 | Seis alvos por uma instantânea de 2 |
| Blood Artist | Cut Down | 0·0·2·0·0·0·0·0 | Poucas mortes no deck; remoção grátis |
| Barbed Servitor | Pontiff of Blight | 0·0·0·0·2·3·0·0 | Extort na mesa toda, pago com vida |
| Unstoppable Slasher | Bloodletter of Aclazotz | 0·0·0·0·2·3·0·0 | Combate por dobrador de dreno |
| Heraldic Banner | Cabal Ritual | 3·0·0·0·0·0·0·0 | Rock de 3 por ritual de 2 de vida |
| Ghoulcaller Gisa | Emeritus of Woe | 0·0·0·0·0·0·3·0 | Fora do plano por um Demonic Tutor extra |
| Infernal Offering | Night's Whisper | 0·2·0·0·0·0·0·0 | Simétrica por compra barata |
| Ophiomancer | Swiftfoot Boots | 0·0·0·0·0·0·0·2 | Cobra sem uso por proteção do motor |
| Myriad Landscape | Cabal Coffers | 2·0·0·0·0·0·0·0 | Terreno virado por mana grande |
| Demolition Field | Nykthos, Shrine to Nyx | 2·0·0·0·0·0·0·0 | Idem |
| Rise of the Dark Realms | Malakir Rebirth | 0·0·0·0·0·0·1·1 | Nove manas por seguro do K'rrik que também é terreno |

| Medida | Hoje | Com as 17 trocas |
|---|---|---|
| Fontes de terreno | 32 | 33 |
| CMC médio (não terreno) | 3,58 | 3,34 |
| CMC médio pagando todo {B} com vida | 2,27 | 1,97 |
| Peças "perda vira ganho" (Exquisite Blood, Conqueror) | 1 | 2 |
| Peças "ganho vira perda" (Bond, Vito, Tenacity) e Aetherflux | 4 | 4 |
| Tutores | 5 | 5 |
| Chance de montar o combo até o turno 6 (peças ou tutor) | 31% | 36% |
| Chance de montar o combo até o turno 8 | 39% | 44% |
| Remoção pontual instantânea | 8 | 12 |
| Chance de ter remoção instantânea até o turno 4 | 59% | 74% |
| Cartas que matam o próprio K'rrik | 2 | 0 |
| Cartas simétricas ou contra o plano | 9 | 1 |
| Game Changers | 3 | 3 |
| Placar | 304 | 345 |

**Consideradas e recusadas:**

| Carta | Veredito | Motivo |
|---|---|---|
| Necropotence | Banco, 1º | Seria o quarto Game Changer. Se a mesa aceitar Bracket 4, entra no lugar do Night's Whisper |
| Ad Nauseam | Recusada | Game Changer, e disputa a mesma vida que o K'rrik |
| Leshrac's Sigil | Banco | Com o K'rrik, gera mágica preta infinita. Precisa de Aetherflux ou Vilis para fechar e pede 33 de vida |
| Peer into the Abyss | Recusada | Em si mesmo, corta a vida que paga a mão |
| Lich's Mastery | Recusada | Cada vida paga exila uma permanente sua |
| Necrodominance | Recusada | Exila o seu cemitério |
| Lightning Greaves | Recusada | Shroud impede seus próprios alvos; as Boots fazem melhor |
| Dismember | Recusada | Já é Phyrexian; o K'rrik não acrescenta nada |
| Culling the Weak e Skirge Familiar | Banco | Rituais de sacrifício; o deck tem pouca criatura descartável |
| The Master of Lake-town | Recusada | Cada vida paga mói o seu grimório |

---

## 8. Proposta de painel

- **Nomes:** Dízimo de Sangue; A Linha de Crédito; Filho de Yawgmoth.
- **Escolhido: Dízimo de Sangue.**
- **Clima:** oficina phyrexiana: óleo negro, cobre oxidado, carne e metal.
- **Paleta:**
  - óleo-negro `#121212`
  - cobre-oxidado `#7A4A2A`
  - carne-viva `#9C3B3B`
  - cinza-cirúrgico `#8C8F93`
  - marfim-osso `#E8E0D0`
- **Moldura:** placas rebitadas.
- **Motivo gráfico:** uma balança com uma gota de sangue num prato e um símbolo de mana preta no outro. A vida aparece como um medidor de crédito, com a faixa de 15 marcada.

---

## 9. Dúvidas

**Fontes.**
- Textos: json.edhrec.
- Rulings: grimoria (seis rulings do K'rrik).
- Combos: Commander Spellbook.
- Dados de inclusão: EDHREC, com 20.375 decks, e o recorte lifegain do edh.wiki.

**Suposições.**
- Pets são as cartas foil e etched.
- "Chance de montar o combo" conta as duas peças, uma peça com um tutor, ou dois tutores. É Monte Carlo, com 60 mil partidas e 99 cartas, na jogada, sem mulligan.
- "CMC pagando todo {B} com vida" é um teto teórico: supõe vida sempre disponível.

**Regras sem ruling explícita.**
1. A Bloodthirsty Conqueror forma os mesmos laços do Exquisite Blood. É dedução do texto idêntico; o Commander Spellbook não foi consultado para ela.
2. Pagar com vida o {B} de equipar e de flashback. A ruling diz "qualquer custo", mas não cita essas mecânicas pelo nome.

**Cinco avaliações discutíveis.**
1. **Vampiric Tutor sai e o Imperial Seal fica**, só porque o Seal é pet. Pela força, seria o contrário.
2. **Call to the Void fica** como pet. É a carta mais fraca da lista.
3. **32 terrenos.** É abaixo da faixa, mas é o padrão do K'rrik.
4. **Toxic Deluge fica.** Ela compete pela mesma vida, mas o K'rrik grande sobrevive a ela.
5. **Grievous Wound** (pet) é forte contra um oponente só, e fraca contra a mesa.

---

## 10. Confronto

**O edh.wiki** (recorte lifegain) é uma lista de dados. A base geral do K'rrik no EDHREC é combo, reanimação e tutor. O recorte de lifegain, que é o seu, é minoria: 20% dos decks.

Das cartas de maior sinergia do recorte, a lista não tinha Vilis (+59), Pontiff of Blight (+54), Blood Celebrant (+51) e Demon's Horn (+50). Vilis e Pontiff entraram. Demon's Horn é fraca demais, e o texto da Blood Celebrant ficou sem conferência.
