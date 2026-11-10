# TIER MASTER 1.0 — Avaliação de cartas para Commander

**Versão:** 1.0 — 09/11/2026  
**Status:** versão-piloto normativa; critérios calibrados em quatro casos, ainda sujeitos à aprovação final do piloto.  
**Escopo:** classificação individual de cartas dentro de um deck específico de Commander.  
**Não substitui:** HUB dos decks, agrupamentos funcionais, análise global de potência, rubrica de nota do deck ou registros CURRENT / PROPOSED / TESTED.

---

## 0. Princípio central

> **A Tier mede o mérito de a carta ocupar um slot naquele deck — não o quão poderosa a carta é em abstrato.**

A pergunta que orienta a avaliação é:

**Quanto o deck perde, estrategicamente, se esta carta sair e for substituída pela melhor alternativa plausível para aquele slot?**

A resposta deve considerar simultaneamente:

- sinergia com o comandante e com o plano declarado;
- qualidade com que executa sua função principal;
- contribuição marginal ao funcionamento do deck;
- custo de mana, tempo e oportunidade;
- confiabilidade e dependências;
- dificuldade real de substituição;
- funções secundárias que efetivamente economizam slots;
- identidade temática e experiência de jogo pretendida.

Uma carta excelente em abstrato pode receber C ou D quando é uma escolha ruim para aquele deck. Uma carta modesta pode alcançar A ou S se for uma peça excepcionalmente eficiente, singular e integrada ao plano.

A classificação é **contextual ao deck, à versão da lista, ao plano do piloto e ao ambiente conhecido**. Não existe Tier universal de uma carta.

## 1. O que este sistema não faz

1. Não mede popularidade, preço, raridade, acabamento ou prestígio da carta.
2. Não replica os agrupamentos do HUB. O HUB continua sendo responsável por grupos e critérios funcionais.
3. Não soma uma carta várias vezes porque ela aparece em mais de um agrupamento. Cada carta física tem uma função primária; funções secundárias são registradas como tags.
4. Não transforma uma carta PET em carta tecnicamente melhor. A proteção PET é uma decisão de permanência do piloto, separada da nota técnica.
5. Não presume que uma carta sugerida foi adquirida, incluída ou testada.
6. Não substitui a avaliação global do deck, a simulação do motor ou a análise de geração versus conversão.

## 2. Tiers oficiais

| Tier | Faixa inicial | Definição | Implicação prática |
|---|---:|---|---|
| **S** | 90–100 | Excepcional para este deck; melhora materialmente o plano e é difícil de substituir sem perda. | Manter como referência. Só cortar após mudança de plano ou identificação de substituta claramente superior. |
| **A** | 80–89,99 | Titular premium; entrega impacto forte, eficiente e alinhado, mas há alternativas plausíveis ou trade-offs relevantes. | Manter normalmente; comparar em upgrades de alto valor. |
| **B** | 68–79,99 | Peça funcional e coerente; cumpre bem uma necessidade, mas tem limitações, menor impacto ou concorrência de alternativas. | Manter se o slot for necessário; candidata a melhoria quando houver upgrade real. |
| **C** | 50–67,99 | Slot contestável; contribuição limitada, redundante, condicional, lenta ou inferior a opções disponíveis. | Prioridade de revisão e teste de substituição. |
| **D** | 0–49,99 | Desalinhada ou prejudicial; não justifica o espaço na versão e no plano avaliados. | Corte recomendado, salvo restrição ou decisão explícita do piloto. |

### 2.1 Condições adicionais para Tier S

A pontuação de 90 ou mais é necessária, mas não suficiente. Para receber S, a carta também precisa cumprir todos estes requisitos:

- **Sinergia estratégica:** pelo menos 3/4.
- **Qualidade da função primária:** pelo menos 3/4.
- **Contribuição marginal:** pelo menos 3/4.
- **Dificuldade de substituição:** pelo menos 3/4.
- **Auditoria de antissinergia:** não pode existir conflito estrutural grave e recorrente com o comandante ou com o motor principal.

Se atingir 90 pontos, mas falhar em uma dessas condições, fica em **A**, com a razão registrada. Não se cria Tier S+.

Essas condições evitam que uma carta altamente eficiente, popular ou multifuncional receba S quando é facilmente substituível ou não se integra ao plano.

### 2.2 Nenhuma distribuição obrigatória

Não existe cota de cartas S, A, B, C ou D por deck ou por agrupamento. A classificação não será ajustada para produzir uma curva bonita. Um deck pode ter várias cartas A e nenhuma S; também pode ter vários Ss se cada um cumprir os critérios.

## 3. Rubrica de 100 pontos

Cada critério recebe uma nota de **0 a 4**. A nota ponderada é calculada pela fórmula:

`Pontos do critério = (nota de 0 a 4 ÷ 4) × peso`

`Nota final = soma dos pontos dos oito critérios`

| # | Critério | Peso | O que mede |
|---:|---|---:|---|
| 1 | **Sinergia estratégica** | **20%** | Quanto a carta conversa com o comandante, com o plano principal e com as condições de vitória/valor do deck. |
| 2 | **Qualidade da função primária** | **15%** | Quão bem a carta executa a função principal para a qual ocupa o slot. |
| 3 | **Contribuição marginal** | **15%** | Quanto o deck efetivamente perde quando a carta não está disponível, antes de colocar outra carta no lugar. |
| 4 | **Eficiência de mana e tempo** | **15%** | Custo, velocidade, timing, oportunidade de uso e impacto em relação ao investimento. |
| 5 | **Consistência e confiabilidade** | **10%** | Frequência com que a carta consegue funcionar, dependências, vulnerabilidade, condições de mesa e facilidade de usar. |
| 6 | **Dificuldade de substituição** | **10%** | Diferença entre esta carta e a melhor substituta plausível para o mesmo slot. Quanto maior a perda ao substituir, maior a nota. |
| 7 | **Multifuncionalidade efetiva** | **5%** | Funções secundárias distintas, relevantes e realmente executáveis neste deck; não conta repetição do mesmo efeito. |
| 8 | **Identidade e experiência** | **10%** | Coerência com tema, fantasia, estilo de jogo e experiência que o piloto quer preservar. |
|  | **Total** | **100%** | |

### 3.1 Âncoras de pontuação

| Nota | Interpretação geral |
|---:|---|
| **0** | Não contribui para o critério ou prejudica diretamente. |
| **1** | Contribuição pequena, rara, muito condicional ou claramente abaixo das opções usuais. |
| **2** | Cumpre adequadamente, mas sem destaque; tem limitações ou concorrentes plausíveis. |
| **3** | Acima da média para o deck; contribuição relevante, confiável e bem encaixada. |
| **4** | Excepcional no contexto do deck; referência clara naquele critério. |

Não usar nota 4 apenas porque a carta é forte. Nota 4 exige comparação com alternativas e demonstração do impacto que ela cria.

## 4. Como evitar sobreposição entre critérios

Os critérios 1, 2, 3 e 6 são próximos, mas respondem a perguntas diferentes:

- **Sinergia estratégica:** a carta se encaixa no plano?
- **Qualidade da função primária:** ela executa bem o trabalho que lhe foi atribuído?
- **Contribuição marginal:** o que o deck deixa de fazer se ela não for comprada ou não estiver disponível?
- **Dificuldade de substituição:** o que se perde ao trocar esta carta pela melhor alternativa realista?

Exemplo: uma carta pode ter ótima função primária (4/4), mas contribuição marginal baixa (2/4) porque o deck já possui oito cartas que fazem o mesmo. Também pode ter contribuição marginal alta, mas substituibilidade baixa se outra carta entregar quase o mesmo resultado por menos mana.

A pontuação de cada critério deve ter justificativa própria. Não copiar a mesma justificativa em quatro colunas.

## 5. Multifuncionalidade sem pontuação duplicada

Multifuncionalidade **não significa somar a nota integral de cada função**. Ela vale apenas 5% e reconhece economia real de slots.

| Nota | Regra |
|---:|---|
| 0 | Uma função relevante; nenhum papel secundário que altere a construção. |
| 1 | Benefício secundário pequeno ou incidental. |
| 2 | Uma segunda função útil, mas situacional ou de baixa frequência. |
| 3 | Duas funções distintas e relevantes, executadas com frequência razoável. |
| 4 | Três ou mais funções distintas, ou duas funções que comprimem slots de maneira excepcional e comprovável. |

Regras:

- A função primária é avaliada no critério 2; não recebe pontos novamente em multifuncionalidade.
- Um mesmo efeito descrito de duas formas não é dupla função.
- Função secundária só conta se for útil no deck, não apenas possível pelo texto Oracle.
- Uma carta que aparece em dois agrupamentos do HUB continua sendo uma única carta e não duplica a contagem física.
- Multifuncionalidade pode justificar a saída de uma carta mediana de outro agrupamento, mas essa troca precisa ser demonstrada na matriz OUT → IN.

## 6. Identidade e experiência — 10%

Este critério avalia a coerência da carta com a identidade escolhida para o deck, não o apego pessoal do piloto.

| Nota | Interpretação |
|---:|---|
| 0 | Contraria diretamente a fantasia ou experiência pretendida. |
| 1 | Exceção temática difícil de justificar; só permanece por vantagem mecânica relevante. |
| 2 | Neutra ou genericamente compatível com as cores, sem reforçar identidade. |
| 3 | Bem integrada ao tema, arquétipo ou experiência. |
| 4 | Reforça de forma marcante a identidade e/ou uma experiência particular daquele comandante. |

**Carta fora da tribo não recebe zero automaticamente.** Ela pode ser uma exceção legítima quando habilita uma mecânica essencial, mas o custo de identidade deve aparecer na nota e na justificativa.

**PET não concede pontos automáticos.** Se houver PET, registrar a proteção fora da pontuação. Não confundir gosto pessoal, acabamento especial e coerência temática.

## 7. Auditoria de antissinergia

Antissinergia deve ser examinada explicitamente antes de fechar a Tier. Não será criada uma nona categoria nem aplicada uma penalidade numérica automática que conte o mesmo problema duas vezes.

Usar uma das seguintes descrições no comentário da carta:

- **Nenhuma:** não há conflito material conhecido.
- **Fricção leve:** existe custo ou inconveniente, mas não compromete o plano.
- **Conflito material:** a carta desliga algumas sinergias ou exige mudar linhas de jogo; o benefício pode compensar.
- **Conflito estrutural:** desliga o comandante, o motor central ou uma parte essencial do plano de forma recorrente.

O impacto deve ser refletido principalmente em Sinergia Estratégica, Contribuição Marginal e Consistência. Não descontar novamente em todos os critérios.

Uma carta com conflito estrutural grave não pode receber S. Se o conflito torna o plano principal inviável ou contraditório, a Tier tende a C ou D; se o benefício é alto e o conflito é localizado, pode permanecer em B ou A, com a ressalva explícita.

### 7.1 Não confundir antissinergia com trade-off

Uma carta que desliga dez interações não é automaticamente ruim. É preciso comparar:

1. Quantas cartas e linhas ficam prejudicadas?
2. Com que frequência essas interações seriam relevantes?
3. O benefício da carta é imediato, recorrente ou apenas potencial?
4. Ela melhora a qualidade das cartas que permanecem na mão ou as respostas disponíveis?
5. Existem motores alternativos sem o mesmo custo?
6. O deck pode escolher quando jogar a carta, ou a presença dela mantém o conflito o tempo todo?

A pergunta correta é se o ganho líquido no plano do deck supera a perda de sinergias — não se existe qualquer antissinergia.

## 8. Dificuldade de substituição: régua obrigatória

A nota 0–4 compara a carta com a **melhor substituta plausível para aquele slot**, não com uma carta aleatória ou com todas as cartas do formato.

| Nota | Situação comparativa |
|---:|---|
| 0 | Há várias alternativas superiores; a carta é claramente substituível. |
| 1 | Há alternativas equivalentes ou melhores com custo semelhante. |
| 2 | Há substitutas funcionais, mas cada uma traz uma perda ou condição. |
| 3 | As alternativas existem, mas são materialmente inferiores em sinergia, custo, confiabilidade ou flexibilidade. |
| 4 | Não há substituta realista que preserve a contribuição singular; removê-la exige mudar o plano ou aceitar perda grande. |

Para receber S, a carta precisa tirar pelo menos 3/4 neste critério.

## 9. Tratamento de terrenos

Terrenos também ocupam slots e serão avaliados, mas a aplicação dos critérios precisa respeitar sua natureza.

- **Função primária:** produzir as cores e a quantidade de mana exigidas no turno relevante; ou cumprir uma função utilitária declarada.
- **Mana e tempo:** entrar desvirado quando necessário, custo de ativação, restrições de uso e perda de tempo.
- **Consistência:** número e qualidade das cores, acesso às cores em mãos iniciais e risco de fonte condicional.
- **Contribuição marginal:** quanto a base perde se esse terreno for removido.
- **Substituibilidade:** comparação com as melhores fontes disponíveis para a mesma combinação de cores ou função.
- **Multifuncionalidade:** MDFC, cycling, channel, busca, proteção ou utilidade contam somente quando forem realmente executáveis e relevantes.

Um terreno que sempre entra virado não recebe penalidade mecânica fixa de pontos; a perda de tempo deve ser avaliada no contexto da curva e da necessidade daquele turno. MDFCs contam como uma carta física e sua face de terreno é registrada como fonte funcional, não como um segundo slot.

## 10. Relevância para cortes e permanência

A Tier representa mérito do slot. O HUB continua a fornecer agrupamentos, e a matriz de melhoria registra a decisão de troca.

Para preservar a linguagem já usada nos Handovers, os códigos abaixo podem continuar como **prioridade operacional de revisão**, sem se tornarem uma segunda Tier:

| Código | Prioridade operacional | Interpretação |
|---|---|---|
| INS | Proteger função | Não retirar sem colocar outra carta que cubra a necessidade essencial. |
| ALT | Preferencial | Manter, salvo encontrar alternativa claramente melhor. |
| MÉD | Rotativa | Pode disputar o slot com outras cartas. |
| BAX | Revisar primeiro | Candidata prioritária a corte ou teste de substituição. |

Uma carta B pode ser INS se for a única peça que cobre uma função obrigatória, mesmo sem ser excepcional. Uma carta A pode ser MÉD se houver várias opções equivalentes. Uma carta S normalmente será INS ou ALT; se aparecer como BAX, a pontuação e a substituibilidade precisam ser reexaminadas.

A classificação INS/ALT/MÉD/BAX não concede nem retira pontos.

## 11. Popularidade, Lift e benchmarks

EDHREC deve ser usado como ferramenta de descoberta e comparação, não como julgador da Tier.

A partir de outubro de 2026, EDHREC substituiu Synergy por Lift nas páginas de comandantes, tags e combos. Lift mede associação relativa à frequência esperada caso duas cartas fossem independentes; não mede diretamente qualidade, impacto, taxa de vitória ou indispensabilidade. A própria EDHREC explica que a métrica antiga dava peso excessivo à popularidade. Ver: [Changelog: Replacing Synergy with Lift](https://edhrec.com/articles/changelog-replacing-synergy-with-lift-on-edhrecs-card-pages), [From Synergy to Lift](https://edhrec.com/articles/from-synergy-to-lift-the-math-behind-edhrecs-new-era) e [FAQ EDHREC](https://edhrec.com/faq).

Ao usar dados públicos, registrar:

- comandante e filtro de bracket/arquétipo;
- data da consulta;
- número de decks da amostra quando disponível;
- inclusão e Lift separadamente;
- limitação da amostra;
- razão pela qual o dado é relevante para a decisão.

Uma carta com baixa inclusão pode ser uma descoberta importante. Uma carta muito popular pode ser genérica ou inadequada para a lista específica.

## 12. Comparação de candidatas e decisões OUT → IN

Toda substituição relevante deve registrar:

`OUT → IN | problema | função perdida | ganho esperado | custo/risco | comparação de Tiers | prioridade | confiança | estado | evidência necessária`.

Antes de concluir que a candidata é melhor:

1. Identificar a função real do slot que será aberto.
2. Comparar as cartas em condições semelhantes de mesa e timing.
3. Verificar custos coloridos, curva e disponibilidade de mana.
4. Verificar se a candidata é funcionalmente redundante com cartas já presentes.
5. Calcular a diferença de pontuação nos critérios afetados.
6. Verificar se a nova carta cria antissinergia ou aumenta dependências.
7. Descrever o argumento mais forte contra a entrada.
8. Não recomendar carta que já esteja na lista, salvo mudança de quantidade legalmente permitida.

Uma diferença pequena de pontos não justifica automaticamente a troca. O ganho precisa ser material no plano ou corrigir um gargalo.

## 13. Formato obrigatório da ficha de Tier

| Campo | Conteúdo |
|---|---|
| Carta / versão | Nome e versão da lista em análise. |
| Função primária | Papel principal no HUB. |
| Funções secundárias | Tags adicionais, sem duplicar contagem. |
| Nota por critério | Oito notas de 0 a 4, com justificativas. |
| Pontuação ponderada | 0–100. |
| Tier | S/A/B/C/D e eventuais travas de S. |
| Antissinergia | Nenhuma / leve / material / estrutural. |
| Substituta comparada | Melhor alternativa plausível e diferença. |
| Prioridade operacional | INS/ALT/MÉD/BAX, quando usado. |
| PET | Sim apenas se explicitamente confirmado para o deck. |
| Estado | CURRENT / PROPOSED / TESTED / REJECTED / ACQUIRED / INCLUDED, conforme Master V4. |
| Confiança | Alta / média / baixa, com razão; não é Tier nem nota adicional. |

A nota de confiança não cria a categoria de evidência adiada pelo piloto. É apenas uma observação metodológica sobre o quanto a avaliação atual está sustentada por dados, texto Oracle, contexto da lista e testes disponíveis.

## 14. Calibração, revisão e governança

- Os limites de Tier são hipóteses calibráveis, não leis matemáticas naturais.
- A calibração inicial é feita pelos quatro casos do documento `TIER_MASTER_CALIBRACAO_1.0.md`.
- Após a aprovação do piloto, o sistema é adotado para novas análises.
- Não recalcular retroativamente todos os decks. Cada revisão antiga só muda quando for reavaliada explicitamente, com data, rubrica e motivo.
- Se muitos casos intuitivamente S estiverem abaixo de 90, ou cartas substituíveis estiverem chegando a S, revisar pesos/limites — não forçar a classificação.
- O sistema deve ser avaliado pela qualidade das decisões de inclusão/corte, não pela distribuição visual dos tiers.

## 15. Relação com a nota global do deck

A Tier individual não deve ser somada diretamente para produzir a nota do deck.

A avaliação global do deck continua usando a rubrica própria do Master V4: curva/aceleração, compra, sinergia, interação, proteção, fechamento, mana, flexibilidade, consistência do comandante e identidade. A Tier Master mede o mérito dos slots; o score global mede a construção como sistema.

Uma lista cheia de cartas S pode continuar mal construída por falta de equilíbrio, curva, fontes, redundância ou conversão. Uma lista com muitos Bs pode funcionar muito bem se tiver cobertura e sinergia adequadas.

## 16. Referências metodológicas

- [EDHREC — Changelog: Replacing Synergy with Lift](https://edhrec.com/articles/changelog-replacing-synergy-with-lift-on-edhrecs-card-pages) — mudança publicada em 01/10/2026; explica a motivação e a base matemática do Lift.
- [EDHREC — From Synergy to Lift](https://edhrec.com/articles/from-synergy-to-lift-the-math-behind-edhrecs-new-era) — explica o conceito de Lift e a independência estatística como referência.
- [EDHREC FAQ](https://edhrec.com/faq) — explica inclusão, Lift e universo de decks elegíveis.
- [Wizards of the Coast — Commander](https://magic.wizards.com/en/formats/commander) — filosofia de experiência de jogo, Brackets e Game Changers; serve para contextualizar impacto social, não para dar Tier individual.
- [Scryfall](https://scryfall.com/) — texto Oracle, identidade, legalidade e pesquisa de cartas. Usar o texto vigente da carta, não snippets de terceiros, quando a regra for decisiva.

---

**Regra final:** a Tier não premia uma carta por ser famosa, cara, forte isoladamente ou difícil de encontrar. Ela reconhece o quanto aquela carta merece o slot quando comparada às alternativas reais e ao plano daquele deck.
