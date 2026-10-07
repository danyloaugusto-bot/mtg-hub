# HANDOVER — CLAVILENO / BLOOD COURT
## Contexto completo da conversa + especificação para continuidade por outra IA

> **Objetivo deste arquivo:** transferir para outra IA todo o contexto relevante desta conversa sobre o deck de Commander de **Clavileño, First of the Blessed**, incluindo decisões de construção, interações de regras de Magic: The Gathering, avaliação de `Saw in Half`, cartas candidatas a entrada/corte e especificação do dashboard criado.

---

# 1. IDENTIDADE DO DECK

## Comandante

**Clavileño, First of the Blessed**

## Tema principal

### 🧛 Vampire Tribal

O deck deve continuar sendo essencialmente um deck de Vampiros.

## Subtema

### ☠️ Aristocrats / Sacrifice

O segundo eixo do deck é:

- sacrifício de criaturas;
- criaturas morrendo;
- triggers de morte;
- drenagem de vida;
- geração de tokens;
- recursão do cemitério;
- transformar mortes em vantagem de cartas/mesa.

## Filosofia do deck

O deck não deve virar simplesmente um deck de Aristocrats que incidentalmente usa Vampiros.

A prioridade é:

> **Vampiros → atacar → Clavileño abençoa → sacrificar/morrer → gerar cartas + Demônios + valor → recursão → repetir.**

A construção ideal deve preservar a identidade tribal e usar Aristocrats como subtema que potencializa o plano principal.

---

# 2. DECKLIST ORIGINAL FORNECIDA

```text
// COMMANDER
1 Clavileño, First of the Blessed (LCC) 2

1 Agadeem's Awakening (ZNR) 336
1 Arcane Signet (LCC) 299
1 Archenemy's Charm (EOE) 307
1 Austere Command (LCC) 126
1 Baron Bertram Graywater (OTJ) 195
1 Bartolomé del Presidio (LCI) 301 *F*
1 Black Market Connections (CLB) 620
1 Bleachbone Verge (DFT) 501 *F*
1 Blood Artist (LCC) 182
1 Bloodghast (LCC) 184
1 Bloodline Keeper (ISD) 90 *F*
1 Bloodthirsty Conqueror (FDN) 318
1 Bojuka Bog (LCC) 320
1 Brightclimb Pathway (SLU) 14 *F*
1 Carmen, Cruel Skymarcher (LCC) 5 *F*
1 Castle Locthwain (CLB) 884
1 Cavern of Souls (2X2) 402 *F*
1 Charismatic Conqueror (LCC) 70
1 Chthonian Nightmare (MH3) 83 *F*
1 Command Tower (CC2) 8
1 Concealed Courtyard (OTJ) 268
1 Cordial Vampire (LCC) 189
1 Damn (DSC) 369 *F*
1 Deadly Dispute (P30A) 29 *F*
1 Desolate Mire (PIP) 674 *F*
1 Diabolic Intent (BRO) 89
1 Drivnod, Carnage Dominus (ONE) 350 *F*
1 Dusk Legion Sergeant (LCC) 48
1 Edgar, Charmed Groom (VOW) 341
1 Elenda's Hierophant (LCC) 71
1 Elenda, the Dusk Rose (LCI) 268
1 Exquisite Blood (SLD) 206
1 Fetid Heath (MOC) 399
1 Generous Gift (CMM) 624
1 Glasswing Grace (MH3) 254
1 Godless Shrine (GTC) 242
1 Henrika Domnathi (VOW) 335
1 High Market (AFC) 246
1 High-Society Hunter (FDN) 320
1 Insatiable Avarice (OTJ) 91
1 Invasion of New Capenna (MOM) 238
1 Isolated Chapel (LCC) 337
1 Legion Lieutenant (LCC) 275
1 Legion's Landing (XLN) 22 *F*
1 Lithoform Engine (PZNR) 245p
1 Malakir Rebirth (ZNR) 111
1 March of the Canonized (LCC) 41
1 Markov Baron (MAT) 14
1 Marsh Flats (MH2) 248
1 Master of Dark Rites (LCC) 83
1 Mavren Fein, Dusk Apostle (LCC) 133
1 Minas Tirith (LTR) 256
1 Mind Stone (LCC) 309
1 New Blood (LCC) 202
1 Nullpriest of Oblivion (ZNR) 118
1 Ojer Taq, Deepest Foundation (LCI) 26 *F*
1 Olivia's Wrath (LCC) 205
1 Orzhov Signet (LCC) 310
1 Path of Ancestry (CMM) 661
1 Phyrexian Altar (2X2) 311
1 Phyrexian Tower (SLD) 208
3 Plains (LCI) 394
1 Preacher of the Schism (LCI) 367
1 Qarsi Revenant (TDM) 86
1 Redemption Choir (LCC) 42
1 Rite of Oblivion (MID) 237
1 Roaming Throne (LCI) 258 *F*
1 Ruthless Lawbringer (OTJ) 229
1 Secluded Courtyard (LCC) 350
1 Shattered Sanctum (VOW) 283
1 Shineshadow Snarl (LCC) 351
1 Silent Clearing (ACR) 115
1 Skullclamp (SLD) 1112 *F*
1 Sol Ring (CC2) 7
1 Sorin the Mirthless (VOW) 337
1 Split Up (DSK) 32
1 Strionic Resonator (M14) 224
4 Swamp (LCI) 397
1 Talisman of Hierarchy (LCC) 315
1 Teysa Karlov (MUL) 61
1 The Meathook Massacre (MID) 348
1 Toxic Deluge (CC2) 6
1 Treacherous Greed (MKM) 237
1 Twilight Prophet (CMM) 193
1 Valkyrie's Call (FDN) 302
1 Vault of Champions (CMM) 667
1 Victimize (SPG) 23
1 Viscera Seer (LCC) 213
1 Vito, Thorn of the Dusk Rose (P30A) 28 *F*
1 Voldaren Estate (LCC) 369
1 Welcoming Vampire (LCC) 140
1 Windbrisk Heights (CLB) 930
1 Witch's Cottage (ELD) 249
1 Yahenni, Undying Partisan (LCC) 214
```

---

# 3. PRINCIPAIS INTERAÇÕES DE REGRAS DISCUTIDAS

## 3.1 Saw in Half + criatura lendária

Pergunta original:

> Se `Saw in Half` cria duas fichas de uma criatura lendária, uma precisa ser sacrificada?

Resposta:

- As duas fichas entram no campo de batalha simultaneamente.
- Ambas podem gerar ETBs.
- Depois, State-Based Actions são verificadas.
- A Legend Rule é aplicada.
- O jogador escolhe uma das permanentes lendárias com mesmo nome para permanecer.
- A outra é colocada no cemitério.
- Isso **não é um sacrifice**.
- Portanto, efeitos que dizem "whenever you sacrifice..." não disparam.
- Efeitos "whenever a creature dies" podem disparar.

### Ponto crucial

Se ambas as fichas têm ETB:

> **os dois ETBs desencadeiam antes da Legend Rule remover uma delas.**

Portanto, a ficha que posteriormente morrer pela Legend Rule ainda teve seu ETB disparado.

---

# 4. PRIORIDADE E LEGEND RULE

Pergunta:

> Posso segurar prioridade depois que as duas lendárias entram e sacrificar uma com Phyrexian Altar antes da Legend Rule?

Resposta:

## NÃO.

A Legend Rule é uma State-Based Action.

O jogo verifica State-Based Actions antes de um jogador receber prioridade.

Portanto não existe esta janela:

```text
duas lendárias entram
↓
"em resposta" sacrifico uma
↓
Legend Rule
```

A sequência é:

```text
duas lendárias entram
↓
ETBs desencadeiam
↓
State-Based Actions
↓
Legend Rule
↓
uma é colocada no cemitério
↓
jogador recebe prioridade
```

Logo, não dá para usar `Phyrexian Altar` para salvar uma das duas antes da Legend Rule.

---

# 5. CORREÇÃO IMPORTANTE SOBRE TOKENS DOUBLE-FACED

Houve um erro inicial na análise do `Bloodline Keeper`.

A resposta inicial afirmou que fichas criadas copiando um permanente transformável não poderiam transformar.

O usuário corrigiu corretamente:

> A restrição antiga caiu em 2023 com as mudanças de regras relacionadas às fichas Incubate de *March of the Machine*.

A regra relevante é a **707.8a** e as regras associadas de cópia de permanentes transformáveis.

### Regra atual relevante

Quando um efeito cria uma ficha que é uma cópia de um permanente de duas faces transformável, a ficha pode ser uma **transforming double-faced token**, copiando as faces correspondentes do original.

Portanto:

## Saw in Half + Bloodline Keeper

Funciona assim:

```text
Bloodline Keeper 3/3
        ↓
   Saw in Half
        ↓
2 × Bloodline Keeper tokens
        ↓
cada token é transformável
        ↓
paga {B} quando controla 5+ Vampiros
        ↓
2 × Lord of Lineage
```

Isso torna `Bloodline Keeper` um dos melhores alvos possíveis de `Saw in Half`.

### Importante

As fichas continuam recebendo o efeito de redução de P/T de `Saw in Half`.

Portanto:

- Bloodline Keeper original = 3/3
- cada token = 2/2
- quando transformado:
  - Lord of Lineage base = 5/5
  - efeito de Saw continua aplicável
  - portanto a ficha transformada fica 3/3 enquanto o efeito de Saw estiver vigente.

---

# 6. SAW IN HALF — AVALIAÇÃO NO DECK

Conclusão:

## `Saw in Half` = aproximadamente **8,5/10**

É uma carta que merece entrar no deck porque há uma concentração incomumente grande de bons alvos.

### Principais alvos

#### 1. Bloodline Keeper — 10/10
Melhor alvo.

- 2 Bloodline Keeper tokens
- ambos transformáveis
- ambos podem virar Lord of Lineage
- não são lendários
- você pode ficar com os dois
- dois Lord effects
- dois motores de tokens

#### 2. Welcoming Vampire — 9,5/10
- duas cópias
- as duas entram simultaneamente
- cada uma pode ver a outra entrando
- gera dois triggers de card draw no evento apropriado
- dois engines para turnos futuros

#### 3. Elenda's Hierophant — 9,5/10 quando grande
Muito dependente do tamanho.

Exemplo aproximado:

Elenda's Hierophant 7/7
→ Saw in Half
→ criatura morre
→ gera 7 Vampiros
→ cria 2 Hierophants 4/4

Quanto maior a criatura, mais absurda a interação.

#### 4. Roaming Throne — 9/10
- duas cópias
- não lendárias
- ambos podem escolher Vampire
- multiplicam triggers de criaturas
- muito forte com o grande número de triggers tribais/aristocrats do deck

#### 5. Markov Baron — 8,5/10
- 2 Barons
- cada um dá +1/+1 aos demais Vampiros
- o outro Baron também é beneficiado
- juntos fornecem forte lord effect.

#### 6. Ojer Taq — 8,5/10
É lendário, então a Legend Rule importa.

Saw:
- 2 Ojer Taq tokens
- um sobrevive
- outro morre
- interação com o lado transformado/death trigger pode gerar valor
- mantém um Ojer Taq para multiplicar tokens.

#### 7. Edgar, Charmed Groom — 8/10
- duas cópias
- Legend Rule remove uma
- uma pode continuar como Edgar
- a morte pode interagir com o lado transformado/Edgar's Coffin.

#### 8. Elenda, the Dusk Rose — 8/10 ou mais dependendo do poder
Se estiver grande, Saw pode gerar muitos Vampiros:
- Elenda original morre;
- cria tokens conforme poder;
- duas cópias entram;
- sendo lendária, uma cópia morre;
- a cópia que morre pode gerar outro Vampiro;
- forte com Blood Artist, Teysa, Drivnod, Clavileño etc.

#### 9. Ruthless Lawbringer — 7,5/10
Duas cópias podem representar dois efeitos de sacrifice/removal em vez de um.

#### 10. Drivnod — 7,5/10
Bom efeito, mas lendário:
- duas cópias → uma fica;
- ainda pode gerar valor pela morte da outra;
- mais forte quando combinado com outros death triggers.

---

# 7. NOVAS CARTAS AVALIADAS

## Emeritus of Woe — 9/10

Foi considerada a melhor das três novas cartas propostas.

Razões:

- é Vampiro;
- combina com mortes;
- oferece efeito de tutor;
- a condição de voltar a ficar preparado é natural em Aristocrats;
- trabalha diretamente com o plano do deck;
- excelente com Saw in Half.

### Saw + Emeritus

Pode transformar:

> 1 Emeritus

em:

> 2 tokens Emeritus

potencialmente oferecendo múltiplos usos do efeito de tutor.

**Recomendação: ENTRAR.**

---

## Tip the Scales — 8/10

Boa para o deck porque:

- funciona como sacrifice outlet/efeito de limpeza;
- transforma uma criatura sacrificada em X baseado na resistência;
- pode limpar criaturas pequenas;
- combina com a filosofia Aristocrats.

Problema:

- pode matar sua própria mesa;
- já existe bastante board wipe no deck.

Ainda assim:

**Recomendação: ENTRAR / TESTAR.**

---

## Scheming Silvertongue — 7,5/10

Pontos positivos:

- Vampiro;
- baixo custo;
- lifelink;
- trabalha com ganhar vida;
- oferece card draw através da mecânica Prepare;
- sinergiza com ataques.

Ponto negativo:

- menos explosivo que Emeritus;
- exige condição para transformar seu potencial de draw em valor.

**Recomendação: ENTRAR, mas é a mais discutível das três.**

Se houver espaço para apenas uma entre Scheming Silvertongue e Emeritus:

> **Emeritus of Woe > Scheming Silvertongue**

---

# 8. PRIMEIROS CORTES SUGERIDOS

Foram identificados estes cortes iniciais para abrir espaço:

## 1. Austere Command
Nota aproximada: **5,5/10**

Motivo:

- muitos board wipes já existem;
- o deck quer construir uma mesa de Vampiros;
- redundância de sweepers.

## 2. Split Up
Nota aproximada: **5,5/10**

Também redundante.

O deck já tem:
- Damn
- Toxic Deluge
- Olivia's Wrath
- The Meathook Massacre
- Austere Command

E `Tip the Scales` entra com mais identidade Aristocrats.

## 3. Black Market Connections
Nota contextual: ~7/10

Carta forte genericamente, mas menos específica ao plano do deck.

Foi considerada uma possível troca por:

> Scheming Silvertongue

Isso transforma um slot de goodstuff em:

> Vampiro + lifelink + card advantage.

## 4. Insatiable Avarice
Nota contextual: ~6/10

Foi considerada redundante/menos temática depois da inclusão de `Emeritus of Woe`.

Proposta:

> Insatiable Avarice → Emeritus of Woe

---

# 9. OUTROS CANDIDATOS A CORTE

Caso os quatro cortes acima não sejam desejados:

### Próximos candidatos

- Generous Gift
- Archenemy's Charm
- Sorin the Mirthless
- Glasswing Grace
- Desolate Mire
- outros slots de interação genérica dependendo do meta.

A regra geral é:

> Primeiro procurar cortes em cartas genéricas/redundantes antes de remover peças tribais, sac outlets, recursion ou engines de Aristocrats.

---

# 10. CARTAS FORA DO DECK SUGERIDAS

Foram sugeridas 5 cartas para avaliar:

## Sanctum Seeker — 9,5/10
Excelente para Clavileño.

Transforma ataques com Vampiros em dano global.

Plano:

> atacar com Vampiros → oponentes perdem vida → pressão + lifegain/sinergias.

Prioridade alta.

---

## Indulgent Aristocrat — 9/10

Excelente:

- Vampiro;
- sacrifice outlet;
- barato;
- transforma criaturas sacrificadas em counters para Vampiros.

Muito alinhado ao subtema Aristocrats.

---

## Vraan, Executioner Thane — 8,5/10

- payoff de morte;
- drena oponentes;
- ganha vida;
- combina com sacrifícios.

---

## Bloodline Necromancer — 8,5/10

- Vampiro;
- recursão;
- devolve Vampiros do cemitério;
- reforça diretamente o subtema de graveyard recursion.

---

## Grave Pact — 8,5/10

Não é Vampiro, mas é uma poderosa peça Aristocrats:

> sacrificar uma criatura → oponentes sacrificam criaturas.

Pode transformar cada sacrifício do deck em remoção adicional.

---

# 11. RANKING GERAL DAS NOVAS CARTAS

Prioridade sugerida:

| Prioridade | Carta | Nota |
|---|---|---:|
| 1 | Emeritus of Woe | 9,0 |
| 2 | Saw in Half | 8,5 |
| 3 | Tip the Scales | 8,0 |
| 4 | Scheming Silvertongue | 7,5 |
| 5 | Sanctum Seeker | 9,5 |
| 6 | Indulgent Aristocrat | 9,0 |
| 7 | Bloodline Necromancer | 8,5 |
| 8 | Vraan, Executioner Thane | 8,5 |
| 9 | Grave Pact | 8,5 |

Observação: a ordem acima mistura cartas novas e cartas para watchlist; as cinco últimas não estavam sendo consideradas obrigatoriamente como substituições imediatas.

---

# 12. FILOSOFIA DE AVALIAÇÃO DO DECK

Qualquer IA que continuar o projeto deve avaliar novas cartas com base em:

### Eixo 1 — Vampire Tribal
A carta é Vampiro?
Ajuda outros Vampiros?
Cria Vampiros?
Beneficia-se de Vampiros?

### Eixo 2 — Clavileño
A carta ajuda:
- atacar?
- sacrificar?
- gerar valor quando um Vampiro morre?
- transformar criaturas abençoadas em vantagem?

### Eixo 3 — Aristocrats
A carta:
- é sacrifice outlet?
- recompensa mortes?
- gera drain?
- transforma mortes em cartas?
- gera tokens?
- gera mana?

### Eixo 4 — Recursão
A carta:
- devolve criaturas do grave?
- aproveita criaturas que morreram?
- permite loops?

### Eixo 5 — Card Advantage
A carta gera:
- cartas?
- tokens?
- mana?
- triggers repetíveis?

### Eixo 6 — Eficiência
Avaliar:
- mana value;
- impacto imediato;
- repetibilidade;
- vulnerabilidade;
- redundância.

---

# 13. SISTEMA DE TIER

Foi criado este padrão:

## S — LOCK
**9,5–10**

Núcleo absoluto.

Antes de cortar, deve existir uma substituição claramente superior.

## A — CORE
**8,5–9,4**

Muito forte no plano.

Pode ser cortada em otimização avançada, mas não casualmente.

## B — SUPPORT
**7,5–8,4**

Boa carta, mas substituível.

Primeira grande área para upgrades.

## C — REVIEW
**6,5–7,4**

Funciona, mas há dúvidas de eficiência/sinergia.

## D — CUT CANDIDATE
**<6,5**

Primeiros candidatos a sair.

---

# 14. NÚCLEO "NUNCA CORTAR" DEFINIDO NO DASHBOARD

A primeira versão do dashboard marcou como núcleo absoluto:

- Clavileño, First of the Blessed
- Blood Artist
- Bloodline Keeper
- Elenda's Hierophant
- Phyrexian Altar
- Skullclamp
- Sol Ring
- Viscera Seer
- Welcoming Vampire
- Roaming Throne

Esse conjunto é uma **hipótese inicial**, não uma regra imutável.

Outra IA deve estar disposta a revisar o núcleo se:
- o deck mudar de estratégia;
- uma carta nova for claramente superior;
- o meta mudar;
- testes reais mostrarem desempenho diferente.

---

# 15. DASHBOARD / ARTEFATO CRIADO

Foi criado um arquivo Excel offline:

**Clavileno_Blood_Court_Dashboard.xlsx**

Arquivo:

`Clavileno_Blood_Court_Dashboard.xlsx`

O usuário pediu um dashboard com visual de Vampiros e as seguintes funcionalidades.

## Abas

### 01_Dashboard
Painel executivo com:

- Power Index
- Locked Core
- CMC médio
- terrenos
- quantidade aproximada de Vampiros
- Watchlist
- Tier distribution
- curva de mana
- cobertura dos 8 papéis
- núcleo absoluto.

### 02_Card Matrix

Tabela carta-a-carta contendo:

- quantidade;
- carta;
- tipo;
- CMC;
- cor/identidade;
- score;
- tier;
- status;
- Ramp;
- Draw;
- Removal;
- Recursão;
- Sacrifice;
- Tokens;
- Sinergia + PetCard;
- Especial;
- avaliação de `Saw in Half`;
- diagnóstico.

### 03_Tier List

Ranking das cartas por:

- Tier
- Score
- CMC
- papéis
- Saw Target
- Veredito.

### 04_Analysis

Gráficos/indicadores de:

- curva de mana;
- tipos;
- cores;
- cobertura dos papéis.

### 05_Control Panel

Painel de:

- nunca cortar;
- primeiros cortes;
- trocas prioritárias;
- manutenção futura.

### 06_Watchlist

Cartas fora do deck que merecem teste.

Inclui:

- Emeritus of Woe
- Saw in Half
- Tip the Scales
- Scheming Silvertongue
- Sanctum Seeker
- Indulgent Aristocrat
- Vraan, Executioner Thane
- Bloodline Necromancer
- Grave Pact

### 07_Read Me

Explicação da metodologia.

---

# 16. REQUISITOS DE EVOLUÇÃO DO DASHBOARD

Se outra IA continuar esse projeto, o dashboard ideal deve evoluir para permitir:

## Controle de versões

Exemplo:

- v1.0 — lista original
- v1.1 — Saw + Emeritus
- v1.2 — novos upgrades
- v2.0 — grande revisão.

## Histórico de mudanças

Registrar:

| Data | OUT | IN | Motivo | Resultado |
|---|---|---|---|---|

Isso é importante porque o usuário quer descobrir cartas novas ao longo do tempo sem perder o racional das trocas.

## Campo de teste

Cada carta poderia ter:

- `Owned?`
- `Tested?`
- `Performance`
- `Keep / Cut`
- `Reason`
- `Date Tested`

## Comparador de slots

Idealmente:

> Carta A vs Carta B

comparando:

- mana;
- tribal;
- draw;
- sacrifice;
- recursion;
- tokens;
- synergy;
- Saw target;
- score geral.

---

# 17. PRINCIPAL PERGUNTA ESTRATÉGICA PARA FUTURAS ANÁLISES

Sempre responder:

> **"Esta carta é boa ou ela é boa NO CLAVILEÑO?"**

Uma carta poderosa genericamente não deve automaticamente entrar.

O objetivo é maximizar:

> **Vampire Tribal + Clavileño + Aristocrats + Sacrifice + Recursion**

sem descaracterizar o deck.

---

# 18. TOM DA FUTURA ANÁLISE

O usuário explicitamente quer que a IA seja:

- honesta;
- crítica;
- disposta a dizer NÃO;
- não recomendar carta só porque é poderosa;
- identificar cartas que parecem boas mas não pertencem ao deck;
- encontrar cartas antigas que possam estar fora do radar;
- acompanhar novas cartas lançadas;
- procurar substituições melhores;
- explicar exatamente por que uma carta entra e outra sai.

Não deve haver viés de confirmação.

Se uma carta sugerida pelo usuário for ruim para o deck:

> dizer claramente que não colocaria.

---

# 19. PRÓXIMO PASSO IDEAL

A próxima etapa recomendada é fazer uma **auditoria completa dos 99**, não apenas dos candidatos discutidos.

Para cada carta:

1. Score 0–10;
2. Tier S/A/B/C/D;
3. Vampire?
4. Clavileño synergy;
5. Aristocrats synergy;
6. Sacrifice;
7. Recursion;
8. Tokens;
9. Draw;
10. Removal;
11. Ramp;
12. Combo/WinCon;
13. Saw in Half target;
14. redundância;
15. vulnerabilidade;
16. nota de "keep";
17. possíveis substitutos.

Depois:

### Construir uma versão otimizada dos 99.

A pergunta final deve ser:

> **"Se eu tivesse que jogar amanhã com exatamente 100 cartas, quais seriam as 100 melhores para este conceito?"**

E não simplesmente:

> "Quais cartas são boas?"

---

# 20. RESUMO EXECUTIVO

### Identidade

**Clavileño Vampire Tribal**

### Subtema

**Aristocrats / Sacrifice / Recursion**

### Cartas prioritárias discutidas

- Saw in Half
- Emeritus of Woe
- Tip the Scales
- Scheming Silvertongue
- Sanctum Seeker
- Indulgent Aristocrat
- Vraan
- Bloodline Necromancer
- Grave Pact

### Trocas iniciais sugeridas

```text
OUT                       IN
-------------------------------------------
Austere Command       →   Saw in Half
Split Up              →   Tip the Scales
Black Market Connections
                      →   Scheming Silvertongue
Insatiable Avarice    →   Emeritus of Woe
```

### Melhores alvos de Saw in Half

```text
1. Bloodline Keeper
2. Welcoming Vampire
3. Elenda's Hierophant
4. Roaming Throne
5. Markov Baron
6. Ojer Taq
7. Edgar, Charmed Groom
8. Elenda, the Dusk Rose
9. Ruthless Lawbringer
10. Drivnod
```

### Regra crítica

> Fichas que copiam permanentes dupla-face transformáveis podem ser fichas dupla-face transformáveis pelas regras atuais pós-March of the Machine.

### Regra crítica 2

> Não existe janela de prioridade antes da Legend Rule. State-Based Actions são verificadas antes de prioridade.

### Objetivo do projeto

Criar um **sistema vivo de manutenção do deck**, e não apenas uma decklist:

> **Deck → análise → teste → histórico → novas cartas → comparação → upgrade → nova versão.**

