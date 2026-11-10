# TIER MASTER 1.0 — Calibração de quatro casos

**Data:** 09/11/2026  
**Status:** calibração-piloto; não equivale a playtest nem a reclassificação definitiva dos decks.  
**Referência normativa:** `TIER_MASTER_1.0.md`.

## 0. Como ler esta calibração

Os quatro casos foram escolhidos porque expõem problemas diferentes do sistema antigo:

1. **Spear Spewer / Strefan:** carta fora da tribo, mas com uma função altamente ligada ao comandante.
2. **Necrodominance / Vito:** motor de compra muito potente que também desliga cartas e linhas do deck.
3. **Thassa, Deep-Dwelling / Zara:** carta que altera estruturalmente o funcionamento do comandante e acumula várias funções.
4. **Out of Time / Zur:** carta que o comandante pode encontrar, mas que também retira o próprio comandante de fase e pode interromper a cadência de ataques.

O Handover Mestre v2.3 registrava, na metodologia anterior, Spear Spewer como S/INS, Necrodominance como C/BAX, Thassa como S/INS e Out of Time como D/BAX. Essas classificações são **histórico**, não verdade definitiva. A presente calibração faz uma nova leitura com os critérios propostos.

### Limites da evidência

- Os Handovers anexados não incluem as quatro listas completas atuais de Strefan, Vito, Zara e Zur.
- O Mestre v2.3 registra algumas interações e observações, mas não fornece a lista detalhada de todas as cartas afetadas em Vito nem todas as substitutas já incluídas em Strefan.
- Portanto, as notas abaixo são **provisórias**, com confiança média ou baixa conforme o caso. Não são resultado de partidas.
- A referência a “dez cartas afetadas” por Necrodominance vem do Handover v2.3; a contagem não foi refeita contra a lista atual nesta calibração.

## 1. Escala aplicada

Critérios e pesos:

| Sigla | Critério | Peso |
|---|---|---:|
| SE | Sinergia estratégica | 20% |
| QF | Qualidade da função primária | 15% |
| CM | Contribuição marginal | 15% |
| MT | Eficiência de mana e tempo | 15% |
| CR | Consistência e confiabilidade | 10% |
| DS | Dificuldade de substituição | 10% |
| MF | Multifuncionalidade efetiva | 5% |
| IE | Identidade e experiência | 10% |

Fórmula: `(nota ÷ 4) × peso`, somando os oito resultados.

| Tier | Faixa |
|---|---:|
| S | 90–100, com requisitos adicionais |
| A | 80–89,99 |
| B | 68–79,99 |
| C | 50–67,99 |
| D | 0–49,99 |

---

## 2. Caso 1 — Spear Spewer no Strefan, Maurer Progenitor

### Contexto sustentado pelo Handover

O Handover Mestre v2.3 resume a conta do Strefan como “sangrar, engarrafar, soltar” e registra que cada jogador que perdeu vida no turno contribui para a criação de Blood tokens no início do end step. Também registra que a perda de vida do próprio Strefan conta. Spear Spewer é um Goblin Warrior 0/2 com defender e habilidade `{T}: Spear Spewer deals 1 damage to each player`.

A linha de valor é clara: ativar Spear Spewer faz cada jogador perder vida; se os quatro jogadores perderem vida, Strefan cria um Blood token para cada um deles no seu end step. A habilidade de Strefan oferece então uma oportunidade de pagar `{2}{B}` e sacrificar dois Blood tokens para colocar um Vampiro da mão no campo de batalha virado e atacando. A geração de quatro Blood não multiplica por si só o número de ativações daquele gatilho; ela fornece mais material e escolha de uso.

### Pontuação provisória

| Critério | Nota 0–4 | Pontos ponderados | Justificativa |
|---|---:|---:|---|
| SE — Sinergia estratégica | 4 | 20,00 | Habilita diretamente o requisito de perda de vida dos jogadores para a mecânica de Strefan. |
| QF — Função primária | 4 | 15,00 | Por uma mana, pode causar perda de vida a todos os jogadores em cada turno em que consiga virar. |
| CM — Contribuição marginal | 4 | 15,00 | Pode transformar um único ponto de dano global em vários Blood tokens e habilitar a linha central do comandante. |
| MT — Mana e tempo | 4 | 15,00 | Custo inicial de uma mana; ativação sem custo adicional. A limitação é precisar virar e sobreviver até ativar. |
| CR — Consistência | 3 | 7,50 | Efeito simples e repetível, mas depende de permanecer em campo, estar desvirado e resolver a habilidade. |
| DS — Substituição | 3 | 7,50 | Há outros habilitadores de perda de vida, mas nem todos atingem cada jogador de uma vez por custo tão baixo. A lista atual é necessária para confirmar a lacuna real. |
| MF — Multifuncionalidade | 1 | 1,25 | Sua principal função é habilitar perda de vida; não há outra função relevante demonstrada no contexto fornecido. |
| IE — Identidade | 1 | 2,50 | É Goblin, não Vampiro; a exceção temática tem justificativa mecânica forte, mas não reforça o tribal. |
| **Total** |  | **83,75** | **Tier A provisório** |

### Diagnóstico

**Nova classificação provisória: A**, em vez de S. O resultado reconhece que a carta é excepcionalmente eficiente no papel, mas a identidade off-tribal, a fragilidade de uma criatura 0/2 e a existência potencial de outros habilitadores impedem tratá-la como pilar S sem comparar a lista inteira.

A classificação antiga S/INS pode ter superestimado a carta por seu vínculo mecânico singular. Isso não significa que ela deva sair. Ela pode continuar sendo ALT ou até INS se, ao comparar a lista atual, nenhuma alternativa cobrir o mesmo papel com custo e confiabilidade equivalentes. A prioridade operacional não é automaticamente derivada da Tier.

**Alternativas a investigar, não substitutas automáticas:** fontes de dano global repetível, pingers que atinjam todos os jogadores, efeitos de perda de vida em cada turno e cartas que criem Blood sem exigir uma criatura fora da tribo. Cada alternativa precisa ser comparada quanto a cores, mana, repetibilidade e quem perde vida.

**Confiança:** média-baixa, pois a lista de Strefan e a densidade atual de habilitadores não foram anexadas.

---

## 3. Caso 2 — Necrodominance no Vito, Thorn of the Dusk Rose

### Contexto sustentado pelo Handover

O Handover registra Vito como deck monoblack de Vampiros, ganho de vida e drenagem gradual, com combo como contingência e foco em manter a identidade. O Handover Mestre v2.3 classificava Necrodominance como C/BAX e anotava que a carta “desliga dez cartas da lista”. A contagem exata não foi verificada contra a lista atual nesta sessão.

O texto Oracle de Necrodominance estabelece: pular a etapa de compra; no início da etapa final, pode pagar qualquer quantidade de vida para comprar aquela quantidade de cartas; tamanho máximo de mão cinco; se um card ou ficha fosse para o cemitério de qualquer lugar, é exilado em vez disso. As notas oficiais de Modern Horizons 3 confirmam que habilidades que disparam quando uma permanente própria vai do campo ao cemitério — como “when this creature dies” — não disparam enquanto Necrodominance está sob seu controle.

### Pontuação provisória

| Critério | Nota 0–4 | Pontos ponderados | Justificativa |
|---|---:|---:|---|
| SE — Sinergia estratégica | 2 | 10,00 | A compra ajuda a encontrar respostas e criaturas; a substituição de cemitério por exílio conflita com death triggers, sacrifício e recursão. Não impede, por si só, o gatilho de Vito que depende de ganhar vida. |
| QF — Função primária | 4 | 15,00 | Motor de compra potencialmente enorme e repetível, com conversão direta de vida em cartas. |
| CM — Contribuição marginal | 3 | 11,25 | Pode reabastecer a mão e elevar a qualidade das opções; o máximo de mão cinco e a necessidade de pagar vida limitam o ganho líquido em certas situações. |
| MT — Mana e tempo | 4 | 15,00 | Três manas, ainda que `{B}{B}{B}` seja exigente; o motor não exige mana adicional para cada carta, mas exige vida. |
| CR — Consistência | 3 | 7,50 | O gatilho de end step é recorrente, mas depende de vida disponível e de a carta permanecer em campo; não compra imediatamente ao entrar. |
| DS — Substituição | 3 | 7,50 | Existem outros motores de compra preta, mas poucos convertem vida em uma seleção tão ampla por custo três. A melhor alternativa depende da lista e da velocidade desejada. |
| MF — Multifuncionalidade | 1 | 1,25 | A função dominante é compra; o efeito de exílio de cemitério é uma função secundária, mas neste deck também pode ser uma desvantagem. |
| IE — Identidade | 3 | 7,50 | É coerente com a identidade preta, o uso de vida como recurso e o tom sombrio do deck, embora não seja Vampiro nem peça tribal. |
| **Total** |  | **75,00** | **Tier B provisório** |

### Diagnóstico

**Nova classificação provisória: B**, em vez de C. A mudança não declara que Necrodominance é automaticamente boa para a lista; reconhece que o valor de compra pode compensar a antissinergia, exatamente como o piloto levantou.

A avaliação precisa comparar o valor prático de manter até cinco cartas selecionadas e acesso a respostas com o custo de desligar as dez cartas citadas no histórico. Também é importante distinguir “comprar cinco cartas” de “aumentar a mão em cinco”: se já houver cinco cartas, a compra pode funcionar como seleção/troca de mão, pois o tamanho máximo continua cinco. A carta não é um gatilho de ganho de vida para Vito; pagar vida é perda de vida e não ativa habilidades que exigem ganhar vida.

### Pendências obrigatórias antes da Tier final

1. Recontar as dez cartas afetadas na lista CURRENT mais recente.
2. Separar death triggers, recursão, sacrifício, auto-mill e outras interações realmente desligadas.
3. Identificar quantas dessas dez cartas são centrais, quantas são redundantes e quantas são opcionais.
4. Comparar com motores de compra já presentes e com alternativas como Necropotence, Phyrexian Arena, Black Market Connections ou outras opções realmente disponíveis na lista. Não presumir que qualquer delas é automaticamente melhor.
5. Simular linhas de mão: mão vazia, mão com duas cartas, mão com cinco cartas; vida disponível; cartas que podem ser usadas em velocidade instantânea antes do cleanup; impacto da regra de mão máxima.

**Confiança:** baixa-média. A carta está bem compreendida, mas falta a lista atual completa de Vito para medir a antissinergia e a redundância reais.

---

## 4. Caso 3 — Thassa, Deep-Dwelling na Zara, Renegade Recruiter

### Contexto sustentado pelo Handover

O Handover descreve Zara como deck Izzet de roubo/apropriação: a habilidade de Zara empresta temporariamente a criatura revelada da mão de um oponente, com retorno programado na etapa final. O documento identifica Thassa, Deep-Dwelling como uma peça que pode converter o empréstimo em controle permanente ao piscar a criatura no timing correto; registra Thassa como S/INS.

Thassa tem indestrutível, é uma criatura somente com devoção azul cinco ou mais, pisca até uma criatura própria no início de cada etapa final e tem uma habilidade ativada para virar outra criatura por `{3}{U}`. A interação com Zara depende da ordem das habilidades na etapa final: colocar a habilidade retardada de retorno de Zara na pilha primeiro e a habilidade de Thassa acima dela; o blink resolve antes, cria um novo objeto sob seu controle e a habilidade de retorno deixa de reconhecer o objeto anterior. Essa linha deve ser revalidada com as regras e com a versão exata de Zara usada.

### Pontuação provisória

| Critério | Nota 0–4 | Pontos ponderados | Justificativa |
|---|---:|---:|---|
| SE — Sinergia estratégica | 4 | 20,00 | Interage diretamente com a peculiaridade do comandante e transforma empréstimo temporário em apropriação permanente na linha correta. |
| QF — Função primária | 4 | 15,00 | Motor repetível de blink no end step, além de oferecer uma linha decisiva com Zara. |
| CM — Contribuição marginal | 4 | 15,00 | Muda a economia central do deck: criatura emprestada pode deixar de voltar ao dono e permanecer sob seu controle. |
| MT — Mana e tempo | 3 | 11,25 | Quatro manas e valor diferido; não gera o blink imediatamente ao entrar, mas o motor é recorrente. |
| CR — Consistência | 4 | 10,00 | O efeito de end step é repetível; indestrutível aumenta a resiliência enquanto Thassa não for criatura, embora a interação dependa do timing correto. |
| DS — Substituição | 4 | 10,00 | Existem alternativas de blink, mas poucas reúnem a mesma sinergia com Zara, indestrutível e habilidade de tap. |
| MF — Multifuncionalidade | 4 | 5,00 | Blink recorrente, tap de criatura e corpo indestrutível quando a devoção permite; mais de uma função útil no plano de controle/apropriação. |
| IE — Identidade | 3 | 7,50 | Não é Pirate nem Izzet, mas reforça de forma muito específica o tema de roubo e retenção de recursos adversários. |
| **Total** |  | **93,75** | **Tier S provisório** |

### Diagnóstico

**Nova classificação provisória: S**, preservando a classificação histórica, agora com uma justificativa explícita de contribuição marginal e dificuldade de substituição.

Benchmark EDHREC consultado em 09/11/2026 para Zara mostrava Thassa, Deep-Dwelling em aproximadamente 35% das listas (216 de 619) e Lift exibido de 1,18 na página consultada. Isso sugere associação muito forte ao comandante, mas não é o fundamento da Tier: a linha de regras e o encaixe específico são mais importantes. O tamanho da amostra e o método da plataforma continuam relevantes.

**Confiança:** média-alta no plano de interação; média na substituibilidade, que depende da lista e do pacote completo de blink/controle.

---

## 5. Caso 4 — Out of Time no Zur the Enchanter

### Contexto sustentado pelo Handover

O Handover descreve Zur como deck Esper de controle político, tax seletivo e busca de encantamentos de valor de mana até três quando ataca. Out of Time é um encantamento de `{1}{W}{W}` que, ao entrar, desvira todas as criaturas e as faz entrar em fase até Out of Time deixar o campo; recebe um marcador de tempo para cada criatura que entrou em fase dessa maneira e tem vanishing.

Como Zur também é criatura, ele entra em fase junto com as demais criaturas. O gatilho de ataque de Zur já terá disparado antes de Out of Time entrar, mas Zur deixa de estar disponível para novos ataques enquanto estiver em fase. O encantamento pode, portanto, ser um reset temporário de criaturas que Zur consegue buscar, mas também interrompe a principal cadência de valor do comandante. Se Out of Time sair antes, as criaturas em fase retornam; isso torna a permanência do efeito dependente também da interação com encantamentos.

O EDHREC de Zur Optimized consultado em 09/11/2026 mostrava Out of Time em cerca de 9,0% das listas (125 de aproximadamente 1,38 mil decks) e Lift exibido de 6,0. Em um recorte Tempo menor, aparecia em aproximadamente 14% de 28 decks com Lift 8,8. Esses números indicam presença situacional em algumas construções, não um veredito de qualidade.

### Pontuação provisória

| Critério | Nota 0–4 | Pontos ponderados | Justificativa |
|---|---:|---:|---|
| SE — Sinergia estratégica | 2 | 10,00 | Zur consegue buscá-la e o deck quer controlar criaturas, mas ela retira o próprio Zur de fase e interrompe ataques futuros. |
| QF — Função primária | 3 | 11,25 | É um reset temporário amplo de criaturas por três manas, podendo neutralizar mesas agressivas e ameaças de combate. |
| CM — Contribuição marginal | 2 | 7,50 | Contra mesa cheia de criaturas pode ganhar muitos turnos; contra combos não baseados em criaturas ou mesas com poucas criaturas, o impacto cai. |
| MT — Mana e tempo | 3 | 11,25 | Custo três e tutoreável por Zur; a duração variável e a possibilidade de remoção do encantamento complicam a previsibilidade. |
| CR — Consistência | 2 | 5,00 | Depende de densidade de criaturas adversárias, do número de criaturas que entram em fase e de o encantamento permanecer no campo. |
| DS — Substituição | 2 | 5,00 | Há outras respostas globais ou efeitos de controle de criaturas; o diferencial de ser encantamento tutoreável por Zur não elimina as perdas. |
| MF — Multifuncionalidade | 1 | 1,25 | Sua função principal é controlar a mesa de criaturas; a utilidade de reset e temporização é próxima, não uma segunda função independente. |
| IE — Identidade | 2 | 5,00 | É coerente com controle de mesa, mas não fortalece a dimensão política/negocial nem o motor de ataques de Zur. |
| **Total** |  | **56,25** | **Tier C provisório** |

### Diagnóstico

**Nova classificação provisória: C/BAX**, em vez de D/BAX. A mudança é importante: a carta não é completamente fora de lugar. Ela pode ser uma resposta forte, tutoreável e adequada a um meta com muitas criaturas. O problema é que seu custo estratégico inclui retirar o próprio comandante de fase e suspender a cadência de ataques, além de ser um efeito temporário e dependente da mesa.

A nota C não significa “carta ruim”. Significa que, como ocupante do slot padrão de um Zur político que quer atacar e buscar encantamentos, ela é contestável. Se a lista ou o meta mudar para controle de criaturas com baixa dependência de ataques contínuos, a avaliação pode subir.

**Confiança:** média. O efeito está claro e o Handover documenta o conflito, mas a lista atual e o meta específico precisam ser considerados.

---

## 6. Resultado lado a lado

| Carta | Tier histórico no Mestre v2.3 | Nota nova | Tier novo provisório | Lição para o sistema |
|---|---|---:|---|---|
| Spear Spewer — Strefan | S / INS | 83,75 | **A** | Excelente habilitador pode perder S por ser off-tribal e por substituibilidade ainda não comprovada como excepcional. |
| Necrodominance — Vito | C / BAX | 75,00 | **B** | Antissinergia não deve apagar automaticamente o valor enorme de compra; é preciso medir quantas linhas são realmente desligadas. |
| Thassa, Deep-Dwelling — Zara | S / INS | 93,75 | **S** | Uma carta pode merecer S quando transforma o plano do comandante e é difícil de substituir. |
| Out of Time — Zur | D / BAX | 56,25 | **C** | Carta tutoreável e funcional pode ser contestável, não necessariamente desalinhada; a perda do comandante precisa aparecer no score. |

## 7. O que a calibração ensina sobre os pesos

1. **Substituibilidade precisa ser explícita.** Sem comparar a melhor alternativa real, o avaliador pode promover para S uma carta que é simplesmente uma das várias opções boas.
2. **A identidade temática precisa pesar, mas não proibir exceções.** Spear Spewer é um excelente teste: a mecânica é forte, a identidade é fraca. A nota final deve mostrar esse trade-off, não impor uma proibição tribal automática.
3. **Antissinergia exige quantificação contextual.** Necrodominance não é automaticamente ruim por exilar cartas que iriam ao cemitério; seu ganho de cartas pode compensar. A lista atual precisa ser varrida para medir o custo real.
4. **O valor de uma carta pode ser transformacional.** Thassa não é apenas um blink: ela altera uma mecânica temporária de Zara e gera valor em outros alvos. Isso justifica notas altas em sinergia, contribuição, substituição e multifuncionalidade.
5. **Tutelabilidade não é sinergia suficiente.** Out of Time pode ser encontrado por Zur, mas a tutelabilidade não apaga o fato de que suspende o próprio comandante e o motor de ataque.
6. **A mesma carta pode mudar de Tier em outro deck.** As notas não devem ser transportadas para outras listas.

## 8. Decisões pendentes antes da aprovação definitiva

- [ ] Confirmar se o piloto aceita os intervalos S 90+, A 80–89,99, B 68–79,99, C 50–67,99 e D abaixo de 50.
- [ ] Reavaliar Spear Spewer com a CURRENT completa de Strefan e comparação de todos os pingers/habilitadores disponíveis.
- [ ] Reavaliar Necrodominance com a CURRENT completa de Vito e recontagem das cartas/interações afetadas.
- [ ] Auditar linha de timing de Thassa + Zara e as alternativas que realmente disputam o slot.
- [ ] Confirmar meta e lista atual de Zur para decidir se Out of Time é C/BAX ou se uma variante de controle de criaturas justifica nota maior.
- [ ] Após a aprovação, congelar os pesos e os limites como TIER MASTER 1.0; qualquer mudança futura deve virar versão 1.1, não alteração silenciosa.

## 9. Fontes e referências

- Handover Mestre de análise de decks v2.3, seção 4 (escala anterior e casos de calibração), seção 5 (regras e princípios), seção 8 (fichas de Zur e Zara). Documento fornecido pelo piloto.
- Handover Master Commander V4, seções 2, 3, 4, 6, 7 e 8. Documento fornecido pelo piloto.
- [Wizards — Reality Fracture Release Notes](https://magic.wizards.com/en/news/feature/reality-fracture-release-notes) — texto Oracle e rulings de Necrodominance; explica que efeitos de substituição impedem habilidades de morte quando cartas/fichas não chegam ao cemitério.
- [EDHREC — Zara, Renegade Recruiter](https://edhrec.com/commanders/zara-renegade-recruiter) — benchmark de inclusão/Lift de Thassa, Deep-Dwelling; consulta em 09/11/2026.
- [EDHREC — Zur the Enchanter / Optimized](https://edhrec.com/commanders/zur-the-enchanter/optimized) — benchmark de Out of Time; consulta em 09/11/2026.
- [EDHREC — Vito, Thorn of the Dusk Rose](https://edhrec.com/commanders/vito-thorn-of-the-dusk-rose) e [recorte cEDH](https://edhrec.com/commanders/vito-thorn-of-the-dusk-rose/cedh) — contexto de motores e opções; o recorte cEDH tem amostra pequena e não deve ser generalizado.
- [EDHREC — From Synergy to Lift](https://edhrec.com/articles/from-synergy-to-lift-the-math-behind-edhrecs-new-era) e [Changelog](https://edhrec.com/articles/changelog-replacing-synergy-with-lift-on-edhrecs-card-pages) — interpretação correta de Lift.
- [Spear Spewer — Scryfall search](https://scryfall.com/search?q=%21%22Spear+Spewer%22), [Necrodominance — Scryfall search](https://scryfall.com/search?q=%21%22Necrodominance%22), [Thassa, Deep-Dwelling — Scryfall search](https://scryfall.com/search?q=%21%22Thassa%2C+Deep-Dwelling%22), [Out of Time — Scryfall search](https://scryfall.com/search?q=%21%22Out+of+Time%22) — conferência de texto Oracle a ser refeita antes de cada decisão de regra específica.

---

**Conclusão do piloto:** a metodologia já distingue melhor as quatro situações do que a escala anterior, mas os quatro casos também mostram por que as listas completas e as alternativas disponíveis são indispensáveis para finalizar certas notas. O próximo passo é aprovação dos limites e, depois, revisão dos dois casos com maior incerteza: Spear Spewer e Necrodominance.
