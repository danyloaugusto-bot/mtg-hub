# Teoria 8x8 e Teoria do Cubo no Commander: Guia Técnico, Estrutura Matemática e Arquitetura para Hubs de Deckbuilding

## 1. Fundamentos Arquiteturais e Filosofia de Deckbuilding

### 1.1 O Desafio Singleton e a Paralisação de Escolhas no Commander
Construir um baralho de 100 cartas no formato **Commander (EDH)** em *Magic: The Gathering* apresenta um desafio estrutural único. Por ser um formato *singleton* (no qual é permitida apenas uma cópia de cada carta, com exceção de terrenos básicos), os jogadores frequentemente enfrentam a **paralisação de escolhas** (*choice paralysis*) ao tentar selecionar 99 cartas em um universo de dezenas de milhares de opções válidas.

Sem uma metodologia clara, a montagem tende a resultar em baralhos inconsistentes, caracterizados por alta variância mecânica, falhas de suprimento de mana (*mana screw* ou *mana flood*) e incapacidade de executar o plano de jogo planejado frente a três oponentes em partidas *multiplayer*.

### 1.2 A Analogia da Pizza: Massa (Estrutura) vs. Cobertura (Sinergia)
Para compreender a função da Teoria 8x8, a arquitetura de qualquer deck de Commander pode ser dividida através da metáfora da pizza:

* **A Massa da Pizza (Estrutura Matemática)**: Representa o esqueleto mecânico indispensável para que o jogo aconteça com fluidez. Inclui a base de terrenos (35 cartas por padrão), aceleração de mana (*ramp*), motores de compra de cartas (*card draw*) e interações/remoções. Se a massa for deficiente, o deck desmorona independentemente do valor individual das cartas por cima.
* **A Cobertura / Toppings (Sinergia e Identidade)**: Representa as cartas temáticas, sinergias específicas, mecânicas de vitória e cartas de preferência pessoal (*pet cards*). 

A falha mais comum de deckbuilders iniciantes e intermediários é sobrecarregar o baralho com *toppings* (sinergias chamativas) enquanto negligenciam a massa (fundação de recursos e respostas). A Teoria 8x8 atua como o molde estrutural que garante que a "massa" seja matematicamente sólida antes da adição dos temperos.

### 1.3 Origem Histórica e Evolução Conceitual
A evolução da teoria na comunidade seguiu marcos fundamentais:

* **Post Original no Tumblr (Junho de 2016)**: Publicado sob o título *"The 8x8 Theory"*, o conceito nasceu como uma diretriz heurística simples para dar o pontapé inicial (*jumping-off point*) na construção de baralhos casuais, propondo o modelo simétrico de 8 pacotes de 8 cartas.
* **Redescoberta e "Teoria do Cubo" (Final de 2024)**: O conceito foi revitalizado e expandido por criadores de conteúdo como **Rebell Lily** (*Using the Forgotten Cube Theory to Build Commander Decks*), **Caverna das Lhamas** (*Guia Definitivo de Deckbuild: A Teoria do Cubo*), **Carrier's Chronicles**, **Lente Prismática** e **TapNTurnGaming**.
* **Etimologia de "Teoria do Cubo"**: O termo "Cubo" deriva da metáfora visual de organizar as 64 mágicas do deck em **8 blocos visuais ou "cubos" de 8 cartas**, permitindo ao jogador visualizar o deck como um conjunto modular de 8 micropacotes funcionais em vez de uma lista caótica de 99 cartas.

---

## 2. Matemática da Teoria 8x8: Probabilidade Hipergeométrica e Métricas

### 2.1 A Fórmula Mestra da Estrutura
A Teoria 8x8 divide o deck de 100 cartas em uma equação simétrica e modular:

$$\text{Total} = 1 \text{ (Comandante)} + 35 \text{ (Terrenos)} + (8 \times 8) \text{ (Mágicas)} = 100 \text{ Cartas}$$

Em baralhos que utilizam a mecânica de **Parceiros (*Partner Commanders*)**, a fórmula é ajustada preservando o total de 64 mágicas:

$$\text{Total (Partners)} = 2 \text{ (Comandantes)} + 34 \text{ (Terrenos)} + (8 \times 8) \text{ (Mágicas)} = 100 \text{ Cartas}$$

### 2.2 O Cálculo Hipergeométrico Exato
A escolha do número 8 é fundamentada na **distribuição hipergeométrica**, que calcula a probabilidade de obter $k$ sucessos em $n$ amostras sem reposição de uma população $N$ contendo $K$ sucessos.

A fórmula da probabilidade hipergeométrica para obter pelo menos 1 carta de um pacote específico é:

$$P(X \ge 1) = 1 - \frac{\binom{N - K}{n}}{\binom{N}{n}}$$

Onde:
* $N = 99$ (cartas no grimório após a separação do Comandante na Zona de Comando).
* $K$ = número de cartas do efeito no deck (ex: $K = 1$ para carta única; $K = 8$ para um pacote $1 \times 8$).
* $n$ = número de cartas compradas (ex: $n = 7$ no Turno 1; $n = 13$ no Turno 7 considerando a compra normal por turno).

### 2.3 Tabela Comparativa de Probabilidade e Consistência

A tabela a seguir apresenta a probabilidade exata de comprar **pelo menos uma carta** de um determinado efeito de acordo com a quantidade de cartas daquele efeito no deck ($K$) e o turno da partida ($n$):

| Efeito no Deck ($K$) | Turno 1 ($n=7$ compras) | Turno 3 ($n=9$ compras) | Turno 5 ($n=11$ compras) | Turno 7 ($n=13$ compras) | Perfil de Consistência |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1 Carta (Cópia Única)** | 11,7% | 14,8% | 17,8% | 20,0% | Extrema Inconsistência (1 em 9 jogos no Turno 1) |
| **4 Cartas (Meio Pacote)** | 39,2% | 47,4% | 54,6% | 60,8% | Presença Ocasional |
| **8 Cartas (Pacote 1x8)** | **65,4%** | **74,1%** | **80,8%** | **85,3%** | **Limiar de Redundância Ideal** |
| **10 Cartas (Pacote Expandido)** | 74,0% | 82,1% | 87,8% | 91,8% | Alta Prioridade (Ramp / Draw) |
| **12 Cartas (Pacote Duplo)** | 80,4% | 87,9% | 92,7% | 95,7% | Efeitos Fundamentais de Presença Quase Garantida |

### 2.4 Análise dos Resultados Matemáticos
1. **O Salto da Mão Inicial (Turno 1)**: Ter apenas 1 cópia de uma carta essencial entrega uma probabilidade de apenas **11,7%** na mão inicial. Ao estruturar um pacote $1 \times 8$ com 8 cartas funcionalmente equivalentes, a probabilidade salta para **65,4%** — garantindo que em aproximadamente 2 de cada 3 partidas a mão inicial conterá aquele recurso.
2. **Confiabilidade no Mid-Game (Turno 7)**: Até o Turno 7 (com 13 cartas vistas), a chance de acessar ao menos uma carta de um pacote $1 \times 8$ alcança **85,3%**.
3. **Ponto de Redundância Mínima**: Matematicamente, 8 é o número mínimo de cópias redundantes necessário em um baralho de 99 cartas para transformar uma mecânica em um evento altamente provável sem saturar a mão do jogador.

---

## 3. Taxonomia Padronizada dos Pacotes 1x8 (Fundação vs. Estratégicos)

Para garantir equilíbrio entre defesa, aceleração e plano de vitória, a Teoria 8x8 recomenda dividir os 8 pacotes em dois grandes grupos: **4 Pacotes de Fundação** (Universais) e **4 Pacotes Estratégicos** (Específicos do Comandante).

### 3.1 Os 4 Pacotes de Fundação (A Massa Universal)

#### Pacote 1: Aceleração de Mana (*Ramp*) — 8 Cartas
* **Objetivo**: Adiantar a curva de mana para castar o Comandante e mágicas de alto impacto antes do tempo regulamentar.
* **Tipos de Carta**: Pedras de mana (*Sol Ring*, *Arcane Signet*), busca de terrenos (*Rampant Growth*, *Nature's Lore*) e dorks de mana (*Birds of Paradise*, *Llanowar Elves*).
* **Diretriz de Custo**: Focar em custos de mana convertidos (CMC) entre 1 e 2.

#### Pacote 2: Compra de Cartas (*Card Draw*) — 8 Cartas
* **Objetivo**: Manter o fluxo de recursos na mão e evitar a estagnação no *mid/late game*.
* **Tipos de Carta**: Compra pontual instantânea (*Brainstorm*, *Night's Whisper*), motores de compra recorrente (*Phyrexian Arena*, *Rhystic Study*, *Beast Whisperer*) e cantrips.
* **Diretriz de Custo**: Mix de motores contínuos (CMC 2-3) e compras de grande volume (CMC 4+).

#### Pacote 3: Remoções e Interação (*Spot Removal & Board Wipes*) — 8 Cartas
* **Objetivo**: Neutralizar ameaças dos oponentes, quebrar combos e redefinir a mesa quando o estado de jogo for desfavorável.
* **Tipos de Carta**: Remoções pontuais instantâneas (*Swords to Plowshares*, *Counterspell*, *Beast Within*) e varreduras de mesa (*Cleansing Nova*, *Cyclonic Rift*, *Farewell*).
* **Divisão Típica**: 5 a 6 remoções pontuais + 2 a 3 varreduras globais.

#### Pacote 4: Proteção e Salvaguarda (*Protection & Disruption*) — 8 Cartas
* **Objetivo**: Garantir a permanência do Comandante e das peças centrais do combo no campo de batalha.
* **Tipos de Carta**: Concessão de *Hexproof/Indestructible* (*Heroic Intervention*, *Lightning Greaves*, *Swiftfoot Boots*), anulações defensivas e proteções de fase (*Teferi's Protection*).

### 3.2 Os 4 Pacotes Estratégicos (Os Toppings / Identidade)

#### Pacote 5: Sinergia Principal A (Motor Temático Central) — 8 Cartas
* **Objetivo**: Executar a mecânica primária do baralho.
* **Exemplos**: Cartas de efeito *Enrage* em decks de Dinossauros; geradores de fichas em decks de *Tokens*; marcadores +1/+1.

#### Pacote 6: Sinergia Principal B (Amplificadores e Multiplicadores) — 8 Cartas
* **Objetivo**: Elevar a escala da Sinergia A.
* **Exemplos**: Multiplicadores de fichas (*Parallel Lives*, *Anointed Procession*); amplificadores de dano; abridores de combate extra.

#### Pacote 7: Suporte, Recursão e Utilitários — 8 Cartas
* **Objetivo**: Recuperar recursos do cemitério, tutores estratégicos e utilitários de nicho.
* **Exemplos**: Reanimação (*Animate Dead*, *Eternal Witness*), tutores de peças específicas e prevenção de cemitério.

#### Pacote 8: Condições de Vitória (*Wincons / Finishers*) — 8 Cartas
* **Objetivo**: Encerrar a partida e aplicar a vitória final.
* **Exemplos**: Efeitos de atropelar em massa (*Craterhoof Behemoth*, *Overwhelming Stampede*), combos de duas cartas ou aceleração massiva de dano evasivo.

---

## 4. Engenharia Avançada: Overlap, Split Packages e Seleção Qualitativa

### 4.1 Sobreposição de Papéis (*Overlap / Multipurpose Cards*)
A otimização avançada da Teoria 8x8 ocorre através do **Overlap (Sobreposição)**: a seleção de cartas que cumprem papéis em **dois ou mais pacotes simultaneamente**.

O *Overlap* permite expandir virtualmente a densidade do deck para além das 100 cartas físicas, mantendo a estrutura hipergeométrica intacta.

* **Exemplo Emblemático: *Ugin, the Ineffable***: Em um deck com artefatos/equipamentos incolores, *Ugin* atua simultaneamente em três pacotes:
  1. *Pacote de Remoção*: Sua habilidade de -3 remove permanentes coloridas.
  2. *Pacote de Ramp*: Sua habilidade estática reduz o custo de mágicas incolores em (2).
  3. *Pacote de Card Draw*: Sua habilidade de +1 manifesta cartas do topo que vão para a mão ao saírem do campo.

#### Outros Exemplos Notáveis de Overlap:
* ***Hedron Archive***: Atua no Pacote de **Ramp** no início do jogo (gera 2 manas incolores) e transita para o Pacote de **Card Draw** no *late game* (sacrifica para comprar 2 cartas).
* ***Shuko* (em um deck de *Kemba, Kha Regent*)**: Alocado no Pacote de **Geração de Fichas** (Custo 1, Equipar 0 ativa a habilidade da Kemba a custo zero na manutenção), mesmo sendo um Equipamento de utilidade.
* ***Terrenos Modais de Dupla Face (MDFCs)***: Cartas como *Valakut Awakening* ou *Witch Enchanter* ocupam o espaço de **Terrenos**, mas funcionam como **Card Draw** ou **Remoção**, elevando a contagem real de mágicas sem reduzir a base de mana.
* ***Terrenos Utilitários de Compra***: *War Room* e *Arch of Orazca* ocupam *slots* de terrenos de base, mas alimentam a reserva de compra de cartas.

### 4.2 Divisão de Pacotes (*Split Packages*)
Nem todos os efeitos exigem um pacote cheio de 8 cartas. Quando um efeito é situacional, a Teoria 8x8 permite a **Subdivisão (Split)** de 1 pacote em sub-blocos complementares de $4 + 4$ ou $6 + 2$:

$$\text{Pacote 3 (Interação)} = 4 \text{ Remoções Pontuais} + 4 \text{ Varreduras Globais} = 8 \text{ Cartas}$$

$$\text{Pacote 7 (Recursão/Tutor)} = 6 \text{ Reanimações} + 2 \text{ Tutores de Grimório} = 8 \text{ Cartas}$$

### 4.3 Princípio da Rejeição de Cartas de Contingência Pura
Uma diretriz crítica defendida por especialistas de deckbuilding (como na *Carrier's Chronicles*) é a **eliminação de cartas de contingência passiva**:

* **Definição**: Cartas que só têm utilidade quando o jogador está em desvantagem passiva (ex: *Wellwisher* para ganhar vida após sofrer uma remoção de mesa).
* **Regra de Ouro**: Todas as 64 mágicas do deck devem **avançar proativamente o plano de jogo principal** ou **impedir proativamente a vitória dos oponentes**. Cartas reativas que não geram valor de mesa devem ser descartadas dos pacotes.

### 4.4 Sinergia vs. Condição de Vitória (*Wincon*)
Sinergia isolada gera presença de mesa e movimentação de cartas, mas não ganha o jogo por si só. Um erro frequente é preencher todos os 4 Pacotes Estratégicos apenas com motores de sinergia (ex: criar 40 fichas 1/1) sem reservar um pacote para o **Encerrador de Jogo** (ex: conceder Atropelar e +X/+X às fichas).

O **Pacote 8 (Wincons)** deve ser reservado exclusivamente para fechar a partida de forma decisiva.

---

## 5. Estudos de Caso Práticos

### 5.1 Estudo de Caso 1: Mono-White de Equipamentos e Fichas (*Kemba, Kha Regent*)

```
Comandante: Kemba, Kha Regent (1) | Terrenos: 35 (Base) + 2 MDFCs = 37
```

* **Adaptação da Estrutura**: A aceleração de mana e compra de cartas em Mono-White são historicamente escassas. O deck expandiu os pacotes de **Ramp** e **Card Draw** de 8 para **10 cartas cada**, reduzindo o pacote de suporte estratégico.
* **Tabela de Pacotes do Deck de Kemba**:

| Pacote 1x8 | Função | Cartas Emblemáticas | Estratégia de Overlap / Flexibilidade |
| :--- | :--- | :--- | :--- |
| **Pacote 1 (Expandido: 10)** | Ramp / Mana | *Sol Ring*, *Arcane Signet*, *Pearl Medallion*, *Knight of the White Orchid* | Foco em CMCs 1-2. |
| **Pacote 2 (Expandido: 10)** | Card Draw | *Puresteel Paladin*, *Sram, Senior Edificer*, *Esper Sentinel*, *Mask of Memory* | Compra atrelada ao cast e ataque com equipamentos. |
| **Pacote 3 (Split: 4+4)** | Remoções | *Swords to Plowshares*, *Path to Exile* (4) + *Sunfall*, *Farewell* (4) | Equilíbrio entre pontual e varredura. |
| **Pacote 4 (8)** | Proteção | *Lightning Greaves*, *Swiftfoot Boots*, *Hammer of Nazahn*, *Flawless Maneuver* | Equipamentos que dão Hexproof/Indestructible. |
| **Pacote 5 (8)** | Equipamentos Leves | *Shuko*, *Bone Saw*, *Accorder's Shield* | Custo de equipar 0 para disparar o gatilho da Kemba no T3. |
| **Pacote 6 (8)** | Amplificadores de Ficha | *Anointed Procession*, *Mondrak, Glory Dominus*, *Intangible Virtue* | Multiplicação do exército de Gatos. |
| **Pacote 7 (8)** | Voltron / Buffs | *Colossus Hammer*, *Sword of Feast and Famine* | Aumento de poder da Comandante. |
| **Pacote 8 (8)** | Wincons | *Odric, Lunarch Marshal*, *Akroma's Will* | Concessão de evasão e dano de vitória em massa. |

### 5.2 Estudo de Caso 2: Mono-Green Tribal de Elfos (*Marwyn, the Nurturer*)

```
Comandante: Marwyn, the Nurturer (1) | Terrenos: 33 Terrenos Básicos + 2 Utilitários = 35
```

* **Alinhamento da Curva de Mana**: O plano central é colocar *Marwyn* em campo no **Turno 2**. Para isso, o **Pacote 1 (Ramp)** foi composto exclusivamente por dorks de mana de **CMC 1** (*Llanowar Elves*, *Fyndhorn Elves*, *Elvish Mystic*, *Boreal Druid*, *Sol Ring*).

```
LINHA DE JOGO IDEAL (CURVA ALINHADA):
Turno 1: Terreno + Dork de CMC 1 (Llanowar Elves)
Turno 2: Terreno + Cast de Marwyn, the Nurturer (Custo 3 alcançado no T2)
Turno 3: Mágica Tribal de Elfos -> Cresce Marwyn -> Gera 4+ manas
```

* **Testes de Goldfish (10 Turnos no Moxfield)**: O criador do deck utilizou simulações solo de 10 turnos no Moxfield para validar a densidade de dorks. O teste comprovou que a taxa de sucesso de cast da Marwyn no Turno 2 ultrapassou **82%** com a estrutura 8x8 alinhada.

### 5.3 Estudo de Caso 3: Baralho de Comandantes Parceiros (*Ravos + Sengir*)

```
Comandantes: Ravos, Soultender + Sengir, the Dark Baron (2) | Terrenos: 34 | Mágicas: 64
```

* **Matemática com Partners**: A presença de 2 Comandantes na Zona de Comando garante 2 cartas de acesso permanente. A base de terrenos é ajustada para 34 para manter o total exato de 100 cartas.
* **Estrutura de Pacotes**:
  * **Pacote 1 (Ramp)**: 8 Pedras de Mana Orzhov.
  * **Pacote 2 (Card Draw)**: 8 Motores de Sacrifício com compra (*Village Rites*, *Skullclamp*).
  * **Pacote 3 (Remoções)**: 8 Remoções Orzhov (*Despark*, *Utter End*).
  * **Pacote 4 (Proteção/Recursão)**: 8 Efeitos de Reanimação (*Animate Dead*, *Reanimate*).
  * **Pacotes 5 a 8 (Sinergias Aristocratas/Fichas/Wincons)**: 32 Cartas.

---

## 6. Matriz de Adaptação por Nível de Poder (Brackets 1 a 5 e cEDH)

A Teoria 8x8 não se aplica de forma idêntica em todas as mesas. Seu desempenho varia conforme o nível de poder (*Bracket*) da partida.

### 6.1 Tabela de Adequação por Bracket

| Nível de Poder (Bracket) | Característica do Formato | Aplicabilidade da Teoria 8x8 | Adaptações Necessárias |
| :--- | :--- | :--- | :--- |
| **Bracket 1: Casual / Precon** | Baralhos não otimizados, curvas altas, jogos longos (10+ turnos). | **100% Ideal** | Nenhuma. O modelo simétrico entrega consistência perfeita. |
| **Bracket 2: Focado** | Estratégia clara, boa base de terrenos, curva ajustada (CMC 3.5). | **100% Ideal** | Aplicar a divisão de 4 Fundação + 4 Estratégicos. |
| **Bracket 3: Otimizado** | Sem combos de turno 3, mas com interações eficientes e tutor ocasional. | **Excelente** | Introduzir cartas de *Overlap* e ajustar pacotes para 10/6. |
| **Bracket 4: High Power** | Combos rápidos, interações de CMC 1-2, vitórias no Turno 4-6. | **Requer Flexibilização** | Elevar Ramp e Proteção; reduzir pacotes temáticos. |
| **Bracket 5: cEDH / Commander 500** | Vitórias Turno 1-3, interações gratuitas (*Force of Will*), tutores em massa. | **Inadequado (Falha)** | **Quebra da Teoria**: A simetria 8x8 é substituída por assimetria extrema. |

### 6.2 Por que a Teoria 8x8 Falha no cEDH (Bracket 5)?
1. **Densidade de Tutores de Custo 1**: No cEDH, um deck roda *Demonic Tutor*, *Vampiric Tutor*, *Mystical Tutor*, *Imperial Seal*, etc. Um único tutor funciona virtualmente como qualquer uma das 64 mágicas do deck, invalidando a necessidade de 8 cópias simétricas de um efeito.
2. **Interações de Custo Zero**: O cEDH exige interações instantâneas gratuitas (*Fierce Guardianship*, *Deflecting Swat*, *Pact of Negation*), priorizando eficiência de mana absoluta sobre a simetria de pacotes.
3. **Curva de Mana Ultra-Baixa (CMC Médio < 1.8)**: A estrutura de 35 terrenos é excessiva no cEDH (que utiliza entre 26 e 30 terrenos devido a pedras de mana rápidas como *Mana Crypt*, *Mox Diamond* e *Chrome Mox*).

### 6.3 Ajuste por Comandantes com Motores Embutidos
Quando o Comandante já possui compra de cartas ou aceleração de mana integrada na Zona de Comando (ex: *Tatyova, Benthic Druid*, *Korvold, Fae-Cursed King*, *Yarok, the Desecrated*), a Teoria 8x8 deve ser rebalanciada:

```
Comandante gera Compra -> Reduz Pacote de Card Draw de 8 para 4-5
                      -> Transfere 3-4 vagas para o Pacote de Proteção/Sinergia
```

---

## 7. Especificação Técnica para Hubs de Deckbuilding e Agentes de IA

Para implementar a Teoria 8x8 como um algoritmo de geração automática de baralhos em uma inteligência artificial ou Hub de Decks, utilize a seguinte especificação técnica.

### 7.1 Mapeamento de Tags Padronizadas (para Moxfield e Archidekt)

Um Hub de Decks deve categorizar a lista enviada ao Moxfield/Archidekt utilizando a funcionalidade de *Custom Tags*:

* `#1-Ramp`: Aceleração e busca de terrenos.
* `#2-Draw`: Compra e vantagem de cartas.
* `#3-Removal`: Remoções pontuais e varreduras.
* `#4-Protection`: Proteção, anulações e resguardos.
* `#5-Synergy-A`: Motor temático primário.
* `#6-Synergy-B`: Amplificadores e multiplicadores.
* `#7-Utility`: Recursão, cemitério e tutores.
* `#8-Wincon`: Finalizadores e condições de vitória.

### 7.2 Fluxo Algorítmico do Agente de IA para Deckbuilding

1. **Entrada e Leitura do Comandante**:
   - Identificar se há 1 ou 2 Comandantes (Partners). Definir 35 ou 34 terrenos de base.
   - Verificar se o Comandante possui motor de compra ou ramp integrado na Zona de Comando. Em caso afirmativo, rebalançar os pacotes (reduzir o pacote de compra/ramp para 5 e aumentar o de proteção/sinergia).
2. **Seleção dos 4 Pacotes de Fundação**:
   - Selecionar 8 fontes de *Ramp* (CMC médio menor ou igual a 2.5).
   - Selecionar 8 motores de *Card Draw* (mix de compras pontuais e contínuas).
   - Selecionar 8 cartas de *Remoção e Interação* (5 a 6 pontuais e 2 a 3 varreduras).
   - Selecionar 8 cartas de *Proteção* (adequadas às cores do baralho).
3. **Construção dos 4 Pacotes Estratégicos**:
   - Definir Sinergia A (8 cartas centrais).
   - Definir Sinergia B (8 multiplicadores).
   - Definir Suporte/Recursão (8 utilitários de cemitério/tutores).
   - Definir Wincons (8 finalizadores e condições de vitória).
4. **Varredura de Otimização e Overlap**:
   - Identificar cartas multifuncionais que cumprem 2 ou mais papéis (ex: Ugin, Hedron Archive, MDFCs).
   - Substituir cartas mono-função de CMC elevado por opções de Overlap.
   - Eliminar cartas de contingência passiva que só funcionam em desvantagem.
5. **Validação Final e Emissão do Rascunho**:
   - Validar se a contagem total de cartas é exatamente igual a 100.
   - Verificar se a curva média de mana é inferior a 3.2 (para Brackets 2-3).
   - Emitir a lista formatada com Custom Tags para cada pacote.

### 7.3 Checklist de Auditoria 10/10 para Validação de Baralhos Gerados

Antes de aprovar uma lista gerada pelo Hub de IA, execute a validação automatizada:

1. **Validação Estatística**: O deck possui ao menos 8 fontes de *Ramp* de CMC $\le 2$ para garantir 65,4% de probabilidade de aceleração no Turno 1?
2. **Validação de Terrenos**: O total de terrenos (incluindo MDFCs) é igual a pelo menos 35 (ou 34 com Partners)?
3. **Validação de Interação**: Há pelo menos 8 cartas de remoção/interação registradas?
4. **Validação de Vitória**: O Pacote 8 contém ao menos 4 cartas capazes de encerrar a partida diretamente em um estado de mesa favorável?
5. **Validação de Overlap**: Pelo menos 3 cartas da lista foram identificadas como cartas multifuncionais (*Overlap*)?
6. **Filtro Anti-Contingência**: Foram removidas todas as cartas puramente reativas que não avançam o plano principal?
