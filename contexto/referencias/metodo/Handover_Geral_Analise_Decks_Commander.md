# HANDOVER GERAL — SISTEMA DE ANÁLISE E OTIMIZAÇÃO DE DECKS COMMANDER

**Versão:** 1.0  
**Objetivo:** servir como contexto mestre para uma nova conversa/IA analisar qualquer novo deck de Commander seguindo a mesma metodologia usada nos projetos anteriores.

---

# 1. OBJETIVO DESTE HANDOVER

Este arquivo é um **manual genérico de continuidade**.

A ideia é que o usuário possa abrir uma nova conversa, enviar uma nova decklist e pedir:

> “Analise este deck seguindo o Handover Geral — Sistema de Análise e Otimização de Decks Commander.”

A nova IA deverá:

1. entender primeiro a identidade do deck e a intenção do usuário;
2. avaliar cada carta pelo **fit com aquele deck específico**, e não pelo poder genérico em Commander;
3. identificar problemas estruturais;
4. montar Tier List;
5. propor upgrades/cortes criteriosos;
6. preservar a curva de mana e a base de mana quando isso for importante para o plano;
7. evitar “goodstuff” que fuja do tema;
8. produzir um Excel/Dashboard e um handover específico daquele deck, quando solicitado;
9. manter rastreabilidade das fontes utilizadas;
10. declarar claramente quando uma carta NÃO deve entrar.

A regra mais importante é:

> **“Uma carta boa em Commander não é automaticamente uma carta boa neste deck.”**

---

# 2. PRINCÍPIOS GERAIS DE ANÁLISE

## 2.1. Primeiro definir o projeto

Antes de mexer em qualquer carta, identificar:

- Comandante
- Identidade de cor
- Tema/tribo
- Plano principal
- Subtemas
- Condições de vitória
- Velocidade desejada
- Grau de interação
- Necessidade de proteção
- Grau de resiliência desejado
- Papel que o comandante deve exercer
- O que o usuário explicitamente NÃO quer

Exemplo de formulação:

> “Este não é simplesmente um deck de Angels; é Angel Tribal com foco em resiliência e preservação da mesa.”

Ou:

> “Este não é simplesmente Group Slug; o comandante funciona como Voltron, enquanto o Group Slug alimenta o crescimento e o card advantage.”

A análise deve partir dessa identidade.

---

# 3. FILOSOFIA DE BUILDING

As prioridades padrão são:

### 1. Identidade
A carta pertence ao plano do deck?

### 2. Velocidade
A carta ajuda o deck a executar seu plano cedo?

### 3. Praticidade
A carta é útil na maioria dos jogos ou depende demais de circunstâncias específicas?

### 4. Sinergia
A carta conversa diretamente com o comandante, tribo ou mecânica principal?

### 5. Resiliência
A carta ajuda o deck a continuar funcionando depois de remoções, wipes ou perda do comandante?

### 6. Eficiência
O efeito entregue justifica o mana, card slot e condição exigida?

### 7. Redundância
A carta melhora uma função já forte ou cria uma nova função necessária?

### 8. Condição de vitória
A carta acelera ou protege uma forma realista de ganhar?

---

# 4. REGRA “NÃO SACRIFICAR O PLANO POR STAPLES”

Não incluir uma carta simplesmente porque ela é considerada:

- staple;
- “auto include”;
- muito popular;
- muito cara;
- muito poderosa isoladamente.

Uma carta genérica só deve entrar quando:

1. resolve uma necessidade real do deck; e
2. não compete negativamente com cartas temáticas importantes.

Exemplo:

Um deck tribal pode preferir uma carta tribal de eficiência média a uma staple extremamente poderosa, caso a primeira seja mais importante para consistência e identidade.

---

# 5. CURVA DE MANA

A curva é parte central da avaliação.

Não aumentar o custo médio simplesmente para adicionar cartas poderosas.

Perguntas obrigatórias:

- Quantas cartas custam 1?
- Quantas custam 2?
- Quantas custam 3?
- Quantas custam 4?
- Quantas custam 5?
- Quantas custam 6+?
- O comandante precisa entrar cedo?
- O deck consegue usar sua mana todos os turnos?
- Existem cartas muito caras que cumprem uma função que poderia ser executada por uma carta mais barata?

## Regra prática

> **Carta de alto MV precisa justificar muito bem o espaço que ocupa.**

Em decks que dependem de velocidade, muitas cartas 6–8 MV devem ser questionadas.

Não reduzir a curva de forma artificial: preservar cartas caras quando elas são verdadeiros payoff/finisher do plano.

---

# 6. BASE DE MANA

Não cortar terrenos apenas para “abrir espaço”.

Antes de qualquer corte de land:

- contar terrenos;
- contar MDFCs;
- contar fontes totais de mana;
- verificar ramp;
- verificar custo médio;
- verificar número de cartas que exigem muita mana;
- verificar terrenos utilitários;
- verificar possibilidade de flood;
- verificar possibilidade de screw.

A base de mana deve ser analisada como parte do plano.

### Princípio importante

> **Ganhar 1 carta marginal e perder consistência de mana pode enfraquecer o deck.**

Por padrão, preservar a base existente até haver motivo concreto para alterá-la.

---

# 7. AVALIAÇÃO CARTA POR CARTA

Cada carta deve receber, quando possível:

- Score de 0 a 10
- Tier
- MV / CMC
- Tipo
- Cor / identidade
- É membro da tribo?
- Ramp
- Draw
- Removal
- Protection
- Buff
- Token
- Synergy
- Special
- Diagnóstico
- Fraqueza
- Redundância
- Fit com o deck
- Verdict

O nome dos agrupadores pode ser adaptado ao deck.

Exemplo dos agrupadores usados anteriormente:

1. Ramp
2. Draw
3. Removal
4. Protection
5. Buff
6. Token
7. Synergy
8. Special

Para um deck diferente, acrescentar categorias relevantes como:

- Graveyard
- Sacrifice
- Aristocrats
- Voltron
- Goad
- Group Slug
- Lifegain
- Counters
- Combo
- Evasion
- Tribal
- Landfall
- Reanimation

---

# 8. SISTEMA DE SCORE

Sistema base usado nos projetos anteriores:

| Score | Tier | Interpretação |
|---|---|---|
| 9,5–10,0 | S | LOCK / peça excepcional |
| 8,5–9,4 | A | CORE / peça central |
| 7,5–8,4 | B | SUPPORT / boa, mas substituível |
| 6,5–7,4 | C | REVIEW / precisa justificar o slot |
| < 6,5 | D | CUT CANDIDATE |

Essas faixas são **guias**, não leis.

Uma carta 8,0 pode ser melhor para o deck do que uma carta 9,0 se preencher uma função que esteja faltando.

---

# 9. COMO JULGAR A SINERGIA

A pergunta correta não é:

> “Essa carta é forte?”

A pergunta correta é:

> **“O que essa carta faz quando colocada neste deck?”**

Avaliar:

### Sinergia direta
Interage diretamente com o comandante.

### Sinergia tribal
É membro da tribo ou recompensa a presença de membros da tribo.

### Sinergia mecânica
Usa a mecânica principal do deck.

### Sinergia de plano
Ajuda o deck a fazer aquilo que ele quer fazer.

### Sinergia de resiliência
Ajuda o deck a reconstruir ou proteger seu plano.

---

# 10. RESILIÊNCIA

Para decks cujo objetivo inclui sobreviver a wipes:

Avaliar separadamente:

- proteção do comandante;
- proteção global;
- indestrutibilidade;
- hexproof/shroud;
- blink;
- recursion;
- permanentes que sobrevivem a wipes;
- reconstrução de mesa;
- recuperação do comandante;
- recuperação de recursos.

Uma carta que salva quatro permanentes pode ser superior a outra que simplesmente gera valor incremental.

---

# 11. REMOVAL E WRATHS

Não classificar todas as remoções como equivalentes.

Distinguir:

### Single-target
Resolve uma ameaça específica.

### Board wipe
Remove múltiplas permanentes.

### Asymmetric wipe
Tem maior chance de preservar sua mesa.

### Conditional wipe
Depende de poder, tipo, quantidade etc.

### Tribal-friendly wipe
Interage de maneira especialmente boa com a estratégia do deck.

O objetivo não é ter “muitas remoções”.

É ter as remoções adequadas para o plano.

---

# 12. PROTEÇÃO

Separar:

### Proteção do comandante
Ex.: hexproof, shroud, indestructible, protection, phase out.

### Proteção do board
Salva várias ou todas as criaturas.

### Proteção de mágicas/habilidades
Counter, redirect, copy, sacrifice prevention etc.

### Proteção por recursão
Não impede a morte, mas torna a troca favorável.

Para Voltron, a proteção do comandante possui prioridade muito alta.

---

# 13. CARD ADVANTAGE

Não contar apenas “comprar carta”.

Considerar:

- compra direta;
- draw engines;
- card selection;
- impulsive draw;
- permanentes que geram cartas ao cumprir o plano;
- recursion que funciona como vantagem de cartas;
- tutores;
- efeitos que transformam recursos do adversário em vantagem.

Uma carta que compra várias vezes ao executar o plano é geralmente mais valiosa que um draw spell isolado.

---

# 14. RAMP

Separar:

- mana rocks;
- ramp de terrenos;
- redução de custo;
- produção de mana tribal;
- mana explosiva;
- ramp condicionado.

A pergunta é:

> “Isso acelera o turno em que meu plano importante acontece?”

Não assumir que todo ramp é igualmente desejável.

---

# 15. TRIBAL

Para decks tribais:

- contar quantidade de criaturas da tribo;
- medir densidade tribal;
- identificar Lords;
- identificar payoffs tribais;
- identificar tokens da tribo;
- identificar tutores tribais;
- avaliar se cartas não tribais realmente justificam seu slot.

### Regra

> **Não sacrificar velocidade e consistência somente para aumentar artificialmente a contagem tribal.**

Mas o inverso também é verdadeiro:

> **Não colocar tantas cartas genéricas que o deck deixe de parecer e funcionar como tribal.**

---

# 16. TOKENS

Para decks com tokens, avaliar:

- quantidade criada;
- qualidade;
- custo;
- recorrência;
- explosão;
- sinergia com buffs;
- sinergia com sacrifício;
- sinergia tribal;
- capacidade de reconstruir após wipe.

Tokens que são membros da própria tribo são particularmente valiosos.

---

# 17. VOLTRON

Para decks com componente Voltron:

Priorizar:

- crescimento de poder;
- marcadores;
- evasão;
- trample;
- proteção;
- indestrutibilidade;
- hexproof/shroud;
- recursion;
- redução de custo do comandante;
- formas alternativas de converter o poder em dano.

### Perguntas obrigatórias

- Quantos ataques são necessários para chegar a 21?
- O deck consegue tornar o comandante evasivo?
- O comandante sobrevive a remoções?
- O investimento em marcadores é recuperável?
- Existe uma forma de transformar o poder em wipe/finisher?

---

# 18. GROUP SLUG / GOAD / CHAOS

Para decks desse tipo, diferenciar:

### Group Slug
Causa dano/perda de vida de forma global ou distribuída.

### Goad
Força os oponentes a atacar e muda a dinâmica da mesa.

### Chaos
Cria incerteza ou efeitos imprevisíveis.

### Política
Manipula incentivos.

Não assumir que os quatro são a mesma coisa.

Se o comandante recompensa perda de vida, priorizar fontes que criem esse evento com baixo custo e alta recorrência.

---

# 19. COMMANDER COMO MOTOR

Sempre analisar o comandante como:

- payoff;
- engine;
- mana source;
- finisher;
- card advantage;
- combo piece;
- tribal lord;
- protection magnet;
- resource converter.

Depois perguntar:

> “O deck ainda funciona se o comandante custar 2 manas a mais?”

Se a resposta for não, a proteção e a redundância têm prioridade ainda maior.

---

# 20. CONDIÇÕES DE VITÓRIA

Identificar explicitamente todas.

Classificar:

### Primária
A maneira principal pretendida pelo usuário.

### Secundária
Plano alternativo natural.

### Emergencial
Condição que pode surgir do próprio estado do jogo.

Não adicionar combos aleatórios apenas porque são eficientes se eles desfigurarem a identidade.

---

# 21. CUTS — COMO ESCOLHER

Uma carta é candidata a corte quando apresenta uma ou mais destas características:

1. baixa sinergia;
2. custo alto;
3. efeito redundante;
4. efeito condicional demais;
5. baixa relevância no plano principal;
6. substituto claramente superior;
7. ocupa slot essencial;
8. bom card genérico, mas ruim para este deck;
9. é “win more”;
10. só funciona quando o deck já está ganhando.

### Regra importante

Não cortar uma carta apenas porque ela tem nota menor que outra.

O corte precisa ser entendido em **contexto de função**.

---

# 22. UPGRADES

Toda sugestão de upgrade deve, idealmente, ser apresentada:

**OUT → IN**

com:

- motivo da saída;
- motivo da entrada;
- ganho de função;
- impacto na curva;
- impacto na mana;
- impacto no tema;
- impacto na resiliência;
- prioridade.

Exemplo:

> **OUT:** carta genérica de 5 MV  
> **IN:** criatura tribal de 3 MV  
> **Ganho:** mantém a função, reduz curva e aumenta densidade tribal.

---

# 23. CARTAS “BOAS, MAS NÃO PARA ESTE DECK”

Criar uma categoria especial:

> **GOOD CARD — WRONG DECK**

São cartas poderosas, mas não suficientemente alinhadas.

Isso evita confundir “qualidade de carta” com “qualidade do deck”.

---

# 24. WATCHLIST

Toda análise deve ter uma Watchlist com:

- cartas que quase entraram;
- cartas novas;
- substitutos potenciais;
- staples faltantes;
- peças que dependem de meta;
- cartas que precisam de testes;
- possíveis upgrades futuros.

---

# 25. FONTES E HIERARQUIA

## Fonte 1 — Regras oficiais

Usar o **Magic Comprehensive Rules** para interações de regras.

Fonte oficial atual:

https://media.wizards.com/2026/downloads/MagicCompRules%2020260619.pdf

A página oficial de regras é:

https://magic.wizards.com/en/rules

O Comprehensive Rules é a autoridade para regras de jogo e contém a seção específica de Commander (seção 903).

---

## Fonte 2 — Commander oficial

Página oficial de Commander:

https://magic.wizards.com/pt-BR/formats/commander

Usar para verificar:

- tamanho do deck;
- Singleton;
- identidade de cor;
- comandante;
- vida inicial;
- commander damage;
- regras atuais do formato;
- Game Changers / brackets quando relevante.

---

## Fonte 3 — Scryfall

Principal referência prática para:

- texto Oracle;
- custo de mana;
- mana value;
- tipo;
- subtipos;
- identidade de cor;
- legalidade;
- prints;
- rulings;
- busca por características.

https://scryfall.com/

### Regra

Quando houver dúvida sobre o texto de uma carta, **não confiar apenas na memória**.

Verificar Scryfall ou fonte oficial.

---

## Fonte 4 — EDHREC

Usar para dados do ambiente e não como autoridade absoluta sobre construção.

https://edhrec.com/

Usar para:

- frequência de inclusão;
- temas;
- categorias;
- cartas recorrentes;
- comparação de arquétipos;
- tendências;
- possíveis staples específicos do comandante.

Página geral de ajuda:

https://edhrec.com/faq

Guia:

https://edhrec.com/guides/how-to-use-edhrec

### Regra

EDHREC mostra **o que as pessoas estão jogando**, não necessariamente o que o nosso deck deveria jogar.

Uma carta com 80% de inclusão pode ser pior para uma construção muito específica.

---

## Fonte 5 — EDH.Wiki

Usar como fonte complementar de análise orientada por comandante e tema.

https://edh.wiki/

Particularmente útil para:

- estratégias do comandante;
- temas;
- High Synergy Cards;
- listas por arquétipo;
- cartas recentemente testadas.

Exemplo utilizado anteriormente:

https://edh.wiki/commanders/giada-font-of-hope/angels/

### Regra

Também é uma referência de apoio, não uma autoridade absoluta.

---

# 26. COMO USAR EDHREC + EDH.WIKI

A combinação ideal é:

**Scryfall / Wizards**  
→ “O que a carta faz?”

**EDHREC**  
→ “O que as pessoas jogam e com que frequência?”

**EDH.Wiki**  
→ “Quais cartas apresentam alta sinergia com este comandante/tema?”

**Nossa análise**  
→ “Isso realmente pertence à nossa versão específica do deck?”

A decisão final deve vir da última etapa.

---

# 27. PESQUISA WEB

Quando a análise envolver informação que pode ter mudado:

- cartas novas;
- banlist;
- Game Changers;
- preços;
- popularidade;
- metagame;
- novas cartas do comandante;
- novas páginas/recomendações;

fazer pesquisa atualizada.

Não assumir que estatísticas antigas continuam válidas.

Sempre registrar a data da verificação em `Sources`.

---

# 28. INTERAÇÕES DE REGRAS

Quando uma decisão depender de uma interação específica:

1. consultar Comprehensive Rules;
2. consultar Oracle text;
3. consultar ruling oficial/Scryfall;
4. explicar a interação passo a passo;
5. separar “regra” de “inferência estratégica”.

## Exemplo importante já discutido

Em efeitos como **Saw in Half**:

- a criatura original é destruída;
- se morreu, são criados dois tokens cópia;
- cópias lendárias entram simultaneamente;
- habilidades de ETB podem disparar antes da aplicação da State-Based Action;
- a Legend Rule acontece como State-Based Action, antes de um jogador receber prioridade;
- portanto não existe uma janela para sacrificar uma das cópias antes da Legend Rule;
- quando relevante, verificar sempre as regras atuais de cópia e permanentes dupla-face.

### DFC / tokens transformáveis

O update de March of the Machine alterou as regras de cópia para transformar tokens.

O CR 707.8a foi atualizado para permitir que um efeito que crie um token cópia de um permanente transformável crie um **transforming double-faced token**, que pode transformar como a permanente copiada.

Fonte oficial:

https://magic.wizards.com/en/news/announcements/march-of-the-machine-update-bulletin

Isso é uma lembrança importante:

> **Não confiar em regras antigas de tokens/copias/transformação sem verificar o Comprehensive Rules atual.**

---

# 29. DASHBOARD PADRÃO

Quando for solicitado um Excel para o deck, usar preferencialmente a estrutura:

### `01_Dashboard`
Resumo executivo:

- nome do deck;
- comandante;
- estratégia;
- score;
- land count;
- spell count;
- creatures;
- tribal count;
- average MV;
- role coverage;
- tier distribution;
- mana curve;
- watchlist;
- principais problemas;
- principais upgrades.

### `02_Card Matrix`
Uma linha por carta.

Cabeçalhos recomendados:

| Coluna | Campo |
|---|---|
| A | Card |
| B | Qty |
| C | Type |
| D | CMC / MV |
| E | Tribal? |
| F | Ramp |
| G | Draw |
| H | Removal |
| I | Protection |
| J | Buff |
| K | Token |
| L | Synergy |
| M | Special |
| N | Score |
| O | Tier |
| P | Status |
| Q | Verdict |
| R | Weakness |
| S | Role / Diagnosis |
| T | Deck Fit |
| U | Source |

**Nota:** “Tribal?” pode ser adaptado para `Angel?`, `Demon?`, `Vampire?`, etc.

### `03_Tier List`

- Tier
- Card
- Score
- MV
- Tribal?
- Primary Role
- Verdict
- Why

### `04_Analysis`

- curva de mana;
- tipos;
- cores;
- quantidade tribal;
- role coverage;
- ramp;
- draw;
- removal;
- protection;
- tokens;
- especial;
- lands.

### `05_Control Panel`

- Locked Core
- First Cuts
- Priority Cuts
- Must Test
- Principles

### `06_Watchlist`

- carta;
- motivo;
- prioridade;
- substituto possível;
- status.

### `07_Upgrade Matrix`

- OUT
- IN
- Delta
- Reason
- Priority
- Impact
- Source

### `08_V2 Deck`

Lista final proposta:

- Qty
- Card
- Type
- MV
- Tribal?
- Score
- Status

### `09_Sources`

Registrar:

- fonte;
- URL;
- finalidade;
- data da verificação.

### `10_Read Me`

Documentar:

- objetivo;
- critérios;
- score;
- tiers;
- regras de construção;
- observações.

---

# 30. INFORMAÇÃO SOBRE COLUNAS

Sempre criar um cabeçalho claro.

Quando houver muitas colunas, usar:

**Linha 1:** título/identificação do projeto.

**Linha 2:** nomes das colunas.

**Linha 3:** explicação curta opcional.

Exemplo:

| Card | Qty | Type | MV | Tribal? |
|---|---:|---|---:|---|
| Nome | Quantidade | Tipo | Custo | É membro da tribo? |

Nunca deixar colunas importantes com apenas `YES/NO` sem contexto.

---

# 31. QUALIDADE DO EXCEL

O arquivo deve:

- possuir cabeçalhos visíveis;
- congelar linhas de cabeçalho;
- usar filtros;
- ter wrap text;
- ter larguras apropriadas;
- usar formatação condicional quando ajudar;
- manter fórmulas quando possível;
- evitar números “hard-coded” quando puderem ser calculados;
- manter consistência visual entre abas;
- não depender de células escondidas sem documentação;
- não quebrar ao inserir ou remover cartas.

---

# 32. QUALIDADE DOS DADOS

Antes de afirmar números do deck:

1. contar cartas;
2. verificar se são exatamente 100;
3. separar comandante dos 99;
4. contar terrenos;
5. contar MDFCs;
6. contar criaturas;
7. contar membros da tribo;
8. calcular MV médio;
9. conferir as categorias.

### Regra crítica

Se duas abas mostrarem números diferentes:

> **PARAR E RECONCILIAR.**

Não entregar um dashboard com `32 lands` em uma aba e `33 lands` em outra, por exemplo.

---

# 33. HONESTIDADE DE ANÁLISE

O usuário prefere análise criteriosa.

Portanto:

- dizer **NÃO** quando uma carta não faz sentido;
- não inventar sinergia;
- não forçar justificativa para preservar uma carta;
- não recomendar carta apenas porque é cara/rara;
- não transformar toda carta em “must-have”;
- declarar incerteza quando o texto ou dado não foi verificado;
- diferenciar opinião estratégica de fato de regras.

---

# 34. FORMATO IDEAL DE RESPOSTA PARA UM NOVO DECK

Ao receber uma nova lista:

## Etapa 1 — Entendimento

“Entendi o deck como…”

## Etapa 2 — Diagnóstico

- score atual;
- pontos fortes;
- gargalos;
- problemas de curva;
- problemas de mana;
- problemas de densidade temática.

## Etapa 3 — Card Audit

Tabela completa.

## Etapa 4 — Tier List

S/A/B/C/D.

## Etapa 5 — Cuts

Priorizados.

## Etapa 6 — Upgrades

OUT → IN.

## Etapa 7 — V2

Lista completa de 100 cartas.

## Etapa 8 — Próximos testes

Watchlist.

---

# 35. COMO TRATAR O “10/10”

Quando o usuário disser:

> “Faça algo digno de 10/10.”

Interpretar como:

- análise completa;
- coerência;
- transparência;
- decisões justificadas;
- dados consistentes;
- boa documentação;
- ausência de cortes arbitrários;
- equilíbrio entre poder e identidade.

Não interpretar como:

> “Encha o deck de staples de Commander.”

O 10/10 é para **a qualidade da construção**, não simplesmente para o power level bruto.

---

# 36. LIÇÕES DOS DECKS JÁ ANALISADOS

## Clavileño — Vampires

Identidade construída:

**Vampire Tribal + Aristocrats + Sacrifice + Graveyard Recursion**

Lição:

- Saw in Half foi valorizado porque tinha muitos alvos excelentes;
- sinergia de sacrifício recebeu prioridade;
- cartas genéricas foram comparadas a peças tribais;
- recursão e tokens foram tratados como multiplicadores do plano.

---

## Giada — Angels

Identidade corrigida após discussão com o usuário:

**Angel Tribal Mono-White + velocidade + resiliência + proteção + explosão de tokens de Angels**

Lição mais importante:

> Não reduzir terrenos sem motivo apenas para encaixar mais cartas.

Também:

- evitar aumento desnecessário da curva;
- priorizar Angels relevantes;
- usar lifegain como suporte, não necessariamente como plano principal;
- valorizar proteção global;
- buscar formas de reconstruir após wipes;
- preferir cards que tragam velocidade e praticidade.

---

## Valgavoth — Rakdos

Identidade:

**Group Slug + Voltron + proteção/recursão + Demon Tribal como subtema**

Lição:

- não transformar o subtema em restrição artificial;
- Group Slug deve alimentar o comandante;
- Voltron exige proteção e evasão;
- marcadores devem converter em condição de vitória;
- wipes assimétricos podem ser muito superiores a wraths genéricas;
- evitar Demons enormes que apenas aumentem a curva sem contribuir para o plano.

---

# 37. PRINCÍPIO CENTRAL DOS PROJETOS

Os projetos anteriores levaram a uma regra geral:

> **Construir o deck a partir do que o comandante quer fazer, e não a partir de uma lista de cartas famosas.**

Depois:

> **Adicionar suporte para fazê-lo mais cedo.**

Depois:

> **Adicionar suporte para fazê-lo com consistência.**

Depois:

> **Adicionar proteção para impedir que uma única resposta desmonte o plano.**

Depois:

> **Adicionar uma ou mais maneiras reais de fechar a partida.**

Somente depois considerar slots flexíveis e “goodstuff”.

---

# 38. TEMPLATE DE BRIEF PARA NOVO DECK

Ao iniciar uma nova análise, pedir ou extrair:

```text
COMANDANTE:
DECKLIST:
IDENTIDADE:
PLANO PRINCIPAL:
SUBTEMA:
CONDIÇÕES DE VITÓRIA:
O QUE EU QUERO EVITAR:
VELOCIDADE DESEJADA:
NÍVEL DE PODER:
ORÇAMENTO:
FONTES OBRIGATÓRIAS:
```

Caso o usuário já tenha informado essas coisas, **não perguntar novamente**.

---

# 39. CHECKLIST FINAL

Antes de entregar uma análise:

[ ] 100 cartas?
[ ] 1 comandante?
[ ] Singleton respeitado?
[ ] Color identity correta?
[ ] Land count conferido?
[ ] MDFCs contabilizadas corretamente?
[ ] MV médio calculado?
[ ] curva analisada?
[ ] plano de jogo claramente definido?
[ ] wincons definidas?
[ ] proteção suficiente?
[ ] card advantage suficiente?
[ ] ramp suficiente?
[ ] removal suficiente?
[ ] tribal density coerente?
[ ] cartas fora do tema questionadas?
[ ] cartas caras justificadas?
[ ] cortes explicados?
[ ] upgrades explicados?
[ ] números consistentes entre abas?
[ ] fontes registradas?
[ ] informações atuais verificadas quando necessário?
[ ] nenhuma interação de regra importante baseada apenas em memória?

---

# 40. FONTES — LINKS PRINCIPAIS

### Magic / Wizards
- Commander: https://magic.wizards.com/pt-BR/formats/commander
- Regras: https://magic.wizards.com/en/rules
- Comprehensive Rules 2026: https://media.wizards.com/2026/downloads/MagicCompRules%2020260619.pdf
- March of the Machine Update Bulletin: https://magic.wizards.com/en/news/announcements/march-of-the-machine-update-bulletin

### Card database
- Scryfall: https://scryfall.com/

### Commander data
- EDHREC: https://edhrec.com/
- EDHREC FAQ: https://edhrec.com/faq
- EDHREC guide: https://edhrec.com/guides/how-to-use-edhrec

### Commander strategy
- EDH.Wiki: https://edh.wiki/

---

# 41. REGRA DE OURO

Quando houver dúvida entre:

**A)** uma carta extremamente poderosa, genérica e pouco relacionada ao deck

e
**B)** uma carta um pouco menos poderosa isoladamente, mas que acelera, protege, alimenta ou reforça diretamente o plano do comandante,

**preferir B**, desde que a diferença de eficiência não seja absurda.

O objetivo não é montar a “melhor coleção de cartas”.

O objetivo é montar:

> **o melhor deck possível dentro da identidade que o usuário escolheu.**

---

# 42. CONTINUIDADE ENTRE CONVERSAS

Ao receber uma nova decklist em outra conversa, a IA deve considerar este handover como o **framework global**.

Depois deve produzir um **handover específico do novo deck**, contendo:

- identidade;
- decklist original;
- diagnóstico;
- score;
- critérios específicos;
- card audit;
- Tier List;
- cortes;
- upgrades;
- V2;
- watchlist;
- decisões;
- fontes;
- regras/interações relevantes.

Assim, o handover geral funciona como o **sistema operacional**, enquanto o handover específico funciona como a **memória daquele deck**.
