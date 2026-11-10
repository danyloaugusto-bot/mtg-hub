# ADENDO DE INTEGRAÇÃO — TIER MASTER 1.0

**Data:** 09/11/2026  
**Finalidade:** integrar a nova metodologia de classificação de cartas aos Handovers existentes sem reescrever nem invalidar o restante dos documentos.

## 1. Precedência documental

A partir da aprovação do TIER MASTER 1.0 pelo piloto, usar a seguinte hierarquia:

1. **Handover específico do deck + Dashboard específico mais recente:** lista CURRENT, cartas, trocas exatas, restrições, notas e decisões daquele deck.
2. **Handover Master Commander V4:** protocolo geral de deckbuilding, auditoria, pesquisa, combos, versões, 8×8, avaliação global do deck e entrega de artefatos.
3. **TIER MASTER 1.0:** regra especializada para pontuar e classificar cada carta individualmente em S/A/B/C/D.
4. **TIER MASTER Calibração 1.0:** casos de referência para interpretar os critérios e os limites.
5. **Handover Geral e Handover Mestre v2.3:** histórico de preferências, aprendizados e decisões anteriores, desde que não conflitem com o V4 ou com o TIER MASTER aprovado.

Este adendo não substitui os arquivos-fonte. Ele registra como aplicar a nova regra ao conjunto existente.

## 2. O que muda

### 2.1 Escala de Tier

Fica substituída a definição antiga:

- S: define o deck.
- A: titular.
- B: cumpre o papel.
- C: substituível.
- D: fora de lugar.

Pela definição operacional do TIER MASTER:

| Tier | Faixa inicial | Definição resumida |
|---|---:|---|
| S | 90–100, com critérios de entrada | Excepcional para aquele deck, contribuição marginal alta e difícil substituição. |
| A | 80–89,99 | Titular premium, forte e bem encaixada, mas com alternativas plausíveis ou trade-offs. |
| B | 68–79,99 | Funcional e coerente, com limitações ou concorrência de alternativas. |
| C | 50–67,99 | Slot contestável, redundante, condicional, lento ou inferior a alternativas. |
| D | 0–49,99 | Desalinhada ou prejudicial ao plano avaliado. |

Não existe S+. A pontuação de 90 não basta por si só para S: são obrigatórios os critérios mínimos descritos no TIER MASTER, inclusive dificuldade de substituição igual ou superior a 3/4 e ausência de antissinergia estrutural grave.

### 2.2 Pontuação individual

A avaliação carta a carta passa a utilizar oito critérios ponderados em 100 pontos:

| Critério | Peso |
|---|---:|
| Sinergia estratégica | 20% |
| Qualidade da função primária | 15% |
| Contribuição marginal | 15% |
| Eficiência de mana e tempo | 15% |
| Consistência e confiabilidade | 10% |
| Dificuldade de substituição | 10% |
| Multifuncionalidade efetiva | 5% |
| Identidade e experiência | 10% |
| **Total** | **100%** |

Cada eixo recebe nota de 0 a 4, multiplicada pelo peso proporcional. A carta recebe justificativa por critério, pontuação total e Tier final.

### 2.3 Multifuncionalidade

Funções secundárias podem ser registradas em tags e apontadas em outros agrupamentos do HUB, mas a carta física continua sendo contada uma única vez. O critério de multifuncionalidade vale apenas 5% e mede economia efetiva de slots; não soma a nota integral de várias funções.

### 2.4 Identidade e PET

Identidade/experiência permanece com peso de 10%. Carta fora da tribo não é automaticamente proibida, mas seu custo de identidade deve ser declarado.

PET não recebe bônus numérico. A proteção PET é uma condição de permanência definida pelo piloto e registrada fora da pontuação. Para cada deck, não presumir PET por foil, etched ou impressão especial sem confirmação explícita, conforme o protocolo geral V4.

## 3. O que permanece igual

Este adendo **não altera**:

- os agrupamentos definidos pelo piloto no HUB;
- a regra de uma carta física contar uma única vez;
- a distinção entre grupo primário e funções secundárias;
- a teoria 8×8 como ferramenta flexível de diagnóstico;
- as regras de CURRENT, PROPOSED, TESTED, REJECTED, ACQUIRED e INCLUDED;
- a rubrica global de avaliação do deck do Master V4;
- a exigência de auditoria de regras, combos, curva, fontes, interação e proteção;
- a matriz OUT → IN e o registro de ganho, perda, custo, risco, prioridade, confiança, estado e evidência necessária.

A Tier List é mais um eixo de decisão do HUB, não substitui o HUB nem cria agrupamentos duplicados.

## 4. Campo de prioridade operacional

Os códigos existentes do Handover Mestre v2.3 podem continuar sendo usados como campo operacional de decisão:

- **INS:** não retirar sem substituir a função essencial.
- **ALT:** manter salvo alternativa claramente superior.
- **MÉD:** rotativa/trocável.
- **BAX:** prioridade para revisão/corte.

Esses códigos não são uma segunda Tier e não mudam a pontuação. O relatório pode apresentar, por exemplo, `Tier A | ALT` ou `Tier B | INS`.

Se uma carta aparecer como `Tier S | BAX`, é obrigatório reabrir a avaliação de contribuição marginal e substituibilidade antes de manter essa combinação.

## 5. Campos mínimos a acrescentar ao Dashboard/Handover de cada deck

Na aba ou seção de Tier List, incluir:

1. Carta e versão da lista.
2. Grupo primário do HUB.
3. Funções secundárias (tags).
4. Oito notas de 0 a 4.
5. Pontuação ponderada (0–100).
6. Tier S/A/B/C/D.
7. Justificativa de entrada em S, quando aplicável.
8. Antissinergia: nenhuma / leve / material / estrutural.
9. Melhor substituta comparada e diferença.
10. Prioridade operacional INS/ALT/MÉD/BAX, se utilizada.
11. PET apenas quando confirmado.
12. Estado CURRENT/PROPOSED/TESTED etc., conforme Master V4.
13. Confiança da avaliação (alta/média/baixa) com motivo, sem confundir com teste formal.

Não é necessário criar uma nova aba se os campos couberem de maneira clara na aba Tier List/Card Matrix existente.

## 6. Regras de transição e não retroatividade

1. As classificações anteriores permanecem como **histórico**.
2. Não atualizar automaticamente os 24 decks já analisados.
3. Quando um deck for revisitado, aplicar o TIER MASTER 1.0 somente às cartas efetivamente reavaliadas e registrar a data da nova avaliação.
4. Não comparar números de Tier antigos com novos como se fossem produzidos pela mesma régua.
5. A calibração inicial usa Spear Spewer, Necrodominance, Thassa, Deep-Dwelling e Out of Time. As notas ainda são provisórias até revisão das listas CURRENT completas nos casos em que falta contexto.
6. Não declarar carta TESTED/VALIDATED apenas por ter recebido nota ou ter aparecido em lista pública.

## 7. Atualizações específicas aos Handovers

### 7.1 Handover Master Commander V4

Adicionar referência ao TIER MASTER 1.0 na seção de avaliação individual das cartas e na estrutura do Dashboard Excel. Manter inalterada a rubrica global do deck publicada na seção 7.2 do V4.

### 7.2 Handover Mestre v2.3

Na seção 4, substituir a definição de Tier antiga pela definição do TIER MASTER 1.0. Manter a escala de notas por eixo de 0 a 3 somente se ela continuar sendo usada para diagnóstico funcional independente; ela não é a pontuação de 0 a 100 da Tier Master.

Na seção 4, o placar de deck permanece como placar histórico/diagnóstico e não deve ser confundido com a pontuação individual de Tier.

Na seção 5, manter as regras e armadilhas documentadas.

Na seção 8, as Tiers históricas continuam válidas como registro da metodologia antiga; ao reavaliar um deck, registrar a nova Tier e não apagar a antiga.

### 7.3 Handover Geral

A metodologia de análise geral permanece. Acrescentar a instrução de que cortes e entradas importantes devem indicar a Tier antiga/histórica, a nova Tier (se reavaliada), a diferença de pontuação, a melhor alternativa comparada e o impacto no deck.

## 8. Regra de decisão para upgrades

A Tier não substitui a comparação OUT → IN. Para cada troca:

- explicar por que o OUT não merece mais aquele slot;
- explicar por que o IN é superior neste deck;
- identificar função perdida e funções ganhas;
- demonstrar o impacto da multifuncionalidade se ela permitir liberar outro slot;
- revisar sinergias, curva, mana, redundância e plano de vitória;
- registrar o argumento mais forte contra a troca;
- manter a proposta separada de CURRENT até confirmação.

Uma carta A não substitui automaticamente uma B. A troca só é recomendada quando o ganho marginal e estratégico é material e os custos foram considerados.

## 9. Registro de fontes e referências

- [Handover Master Commander V4 — arquivo-fonte](Handover_Master_Commander_V4_Consolidado.md)
- [Handover Mestre de análise de decks v2.3 — arquivo-fonte](Handover_Mestre_Analise_de_Decks_v2.3.md)
- [TIER MASTER 1.0](TIER_MASTER_1.0.md)
- [TIER MASTER Calibração 1.0](TIER_MASTER_CALIBRACAO_1.0.md)
- [EDHREC — Lift methodology](https://edhrec.com/articles/from-synergy-to-lift-the-math-behind-edhrecs-new-era)
- [EDHREC — Changelog replacing Synergy with Lift](https://edhrec.com/articles/changelog-replacing-synergy-with-lift-on-edhrecs-card-pages)
- [Wizards — Commander Brackets and Game Changers](https://magic.wizards.com/en/formats/commander)

---

**Regra de precedência:** em caso de divergência sobre pontuação e Tier individual, aplicar o TIER MASTER 1.0 depois de aprovado. Em caso de divergência sobre estratégia, lista, pets, versões ou decisões específicas de um deck, prevalecem o handover específico e o Dashboard mais recentes, respeitando o Master V4.
