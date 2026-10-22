# HANDOVER MASTER V4 — Commander Deckbuilding
## Sistema consolidado de análise profunda, continuidade, auditoria anti-alucinação e entrega de artefatos

**Versão:** 4.0 — consolidado em 14/10/2026  
**Finalidade:** preservar as decisões, preferências, metodologia, lições aprendidas e estado dos decks discutidos, permitindo continuar em novos chats sem perder contexto nem tratar hipóteses antigas como fatos.

> **REGRA DE PRECEDÊNCIA:** este V4 substitui o Handover Master V3 como protocolo geral. O handover específico mais recente e o Dashboard específico de cada deck são a fonte primária para a lista e as trocas exatas daquele deck. Este Master guarda o método e o resumo de continuidade; não substitui arquivos específicos.
>
> **REGRA DE ESTADO:** uma recomendação anterior não prova que a carta foi comprada, adicionada ou testada. `CURRENT` continua sendo a lista exata fornecida pelo usuário; `PROPOSED` é hipótese; `TESTED` exige registros reais de partidas. Não inferir mudança de estado sem confirmação do usuário.
>
> **REGRA DE HONESTIDADE:** se lista, regra, nota, link ou arquivo não foi verificado, declarar a limitação. Não preencher lacunas silenciosamente.

---

# 1. Missão e definição de sucesso

Construir decks de Commander profundos, coerentes, eficientes e personalizados. O objetivo não é maximizar o número de trocas ou copiar listas populares; é identificar problemas reais, comparar alternativas e construir uma versão excelente **para a identidade, preferência e ambiente pretendidos**.

Uma revisão boa deve deixar claras seis respostas:
1. Qual gargalo estamos corrigindo?
2. Que evidência da lista, regra ou benchmark sustenta o diagnóstico?
3. Por que a solução proposta supera as alternativas relevantes?
4. O que se perde ou piora com a troca?
5. Em quais condições a carta é boa ou ruim?
6. Como os playtests confirmarão ou refutarão a hipótese?

A meta recorrente é buscar o mais próximo possível de **10/10**, mas 10/10 não é promessa nem medida universal. A nota descreve a qualidade estrutural esperada em determinado contexto; não é taxa de vitória. Identidade, diversão e restrições explicitadas pelo usuário fazem parte da otimização, não são obstáculos a serem removidos.

## 1.1 Preferências gerais do usuário

- Prefere análises profundas, específicas, demonstradas e comparativas. Já considerou revisões rápidas e notas generosas insuficientemente fundamentadas.
- Quer pesquisa que encontre opções populares, antigas, recentes, de nicho e menos óbvias. Data ou preço não são motivo para ignorar uma carta.
- Não há limite de orçamento para sugerir cartas, salvo indicação futura. O usuário decide depois o que possui, compra ou troca.
- Tema, identidade, cartas especiais, experiência e diversão importam; não transformar todo deck em uma pilha genérica de staples, combo ou cEDH.
- Cartas PET ou protegidas só existem quando o usuário as indicou ou quando isso estiver explicitamente documentado. `*F*`, `*E*`, foil, etched, preço e raridade não provam status PET.
- Quando o usuário fornece agrupamentos, preservá-los como ponto de partida e propor mudança somente quando houver justificativa estratégica.
- Fazer perguntas apenas quando a resposta puder alterar materialmente a análise. Usar até cinco perguntas curtas se necessário; se for possível prosseguir com uma hipótese explícita, avançar sem criar atrito.
- Em análise completa, o padrão é entregar **dois artefatos principais por deck**: Dashboard Excel e Handover Markdown. Não produzir anexos acessórios sem benefício claro.
- Quando dois decks forem enviados juntos, fazer auditorias independentes, reaproveitando pesquisa apenas onde for realmente comum. Entregar um Dashboard e um Handover separados para cada deck.

---

# 2. Contrato de versões e rastreabilidade

Usar estes estados de forma consistente:

- **CURRENT:** lista exata enviada pelo usuário, congelada e preservada.
- **PROPOSED V2/V3/V4:** versão recomendada, ainda não confirmada como comprada, incluída ou testada.
- **TESTED:** versão efetivamente jogada, com data e registros de partidas suficientes para uma avaliação inicial.
- **ACQUIRED / INCLUDED:** somente quando o usuário confirmar que comprou ou adicionou as cartas.
- **REJECTED:** proposta recusada pelo usuário ou pelos testes, com motivo.
- **ARCHIVE:** versões antigas preservadas como histórico.

Se V3 partir de V2, guardar V2 e explicitar apenas as mudanças incrementais entre V2 e V3. Nunca sobrescrever CURRENT, nem descrever V3 como testada por inferência.

## 2.1 Registro mínimo de cada troca

Cada mudança relevante deve registrar:

`OUT → IN | problema | função perdida | ganho esperado | custo/risco | prioridade | confiança | estado | evidência necessária`.

Estados da carta podem ser `sugerida`, `aprovada`, `adquirida`, `incluída`, `testada`, `mantida` ou `revertida`. Não confundir esses estados.

## 2.2 Correção explícita de erros

Quando um fato, texto Oracle, tipo, interação, contagem, nota ou arquivo estiver errado:
1. declarar qual era a afirmação incorreta;
2. explicar a correção sustentada pela fonte ou pela lista;
3. dizer quais recomendações foram afetadas;
4. atualizar o handover, o dashboard e as listas pertinentes;
5. verificar que a afirmação antiga não permanece em uma conclusão contraditória;
6. não esconder a correção atrás de uma nova redação confiante.

---

# 3. Fluxo obrigatório de análise de um deck

## Fase A — congelar e validar

- Identificar comandante(s), identidade de cores, estratégia pretendida e ambiente de jogo.
- Importar a lista exatamente como recebida.
- Contar as 100 cartas incluindo comandante; identificar duplicatas não básicas, salvo exceções legais.
- Contar terrenos físicos separadamente de MDFCs e fontes de mana funcionais; declarar critério.
- Auditar identidade de cores, legalidade Commander e banlist atual.
- Registrar cartas PET/restrições explícitas e estado da versão.
- Não presumir que notas, cartas ou versões antigas continuam válidas sem conferir artefatos recentes.

## Fase B — entender o plano real antes de recomendar

Descrever o plano em início, meio e fim de jogo. Identificar:
- como acelera e corrige cores;
- como gera vantagem de cartas e seleção;
- como transforma a sinergia do comandante em pressão/valor;
- como interage com ameaças e combos;
- como protege o motor e reconstrói após remoções/wipes;
- como efetivamente fecha partidas;
- quais dependências e condições precisam estar presentes.

Não deduzir a estratégia apenas pelo nome do comandante ou por um arquétipo amplo.

## Fase C — auditoria estrutural

Examinar curva de mana, valor de mana, custos coloridos, fontes coloridas, terrenos virados, aceleração real, quantidade de cartas caras, draw/seleção, interação, proteção, recursão, condição de vitória, redundância e antissinergias. Separar “fonte potencial” de fonte que entra desvirada e está disponível no turno necessário.

## Fase D — pesquisa comparativa

Pesquisar alternativas por função, não só por arquétipo. Comparar texto Oracle, custo, timing, encaixe, flexibilidade, custo de oportunidade e risco social. Benchmarks públicos indicam o que outras listas usam; não provam que a carta é melhor nesta lista.

## Fase E — formular a proposta

- Priorizar gargalos e evitar muitas mudanças sem justificativa.
- Registrar todos os `OUT → IN` e justificar ambos os lados.
- Preservar identidade, pets e restrições explícitas.
- Manter propostas separadas de CURRENT.
- Produzir lista PROPOSED completa e reconciliar as contagens.
- Identificar o melhor argumento contra cada upgrade importante.
- Documentar alternativas não selecionadas numa Watchlist, sem tratá-las como inclusões automáticas.

## Fase F — auditoria adversarial

Antes de fechar, procurar intencionalmente:
- triggers que não disparam como imaginado;
- custos genéricos ou coloridos não pagos;
- alvos ilegais ou zonas erradas;
- criatura “entrando atacando” confundida com “declarada atacante”;
- peças que não estão desviradas/disponíveis;
- habilidade de retorno que não será evitada pela linha proposta;
- combo chamado infinito sem loop repetível e recurso positivo;
- aumento de força teórica que piora mão inicial, curva, interação ou experiência social;
- cortes que enfraquecem cobertura funcional;
- carta já presente recomendada novamente;
- contagem OUT/IN errada ou carta cortada que permaneceu na versão projetada.

## Fase G — finalizar e validar artefatos

- Conferir 100 cartas e legalidade de cada lista.
- Reconciliar Dashboard e Handover: nomes, contagens, estados, trocas, tiers e fontes.
- Verificar o arquivo real no caminho final e, quando possível, inspecionar abas, fórmulas básicas e lista proposta.
- Só fornecer links para arquivos efetivamente criados e com caminho confirmado.
- Se um componente não foi validado, declarar exatamente o que não foi validado.

---

# 4. Pesquisa e hierarquia de fontes

Escolher a fonte conforme a pergunta:

1. **Wizards of the Coast / Comprehensive Rules / Gatherer / release notes oficiais:** regras, timing, interações específicas, identidade de cores, legalidade e ruling.
2. **Scryfall:** texto Oracle atual, custos, tipos, legalidade, impressões e pesquisa avançada.
3. **EDHREC:** padrões de inclusão e comparação agregada; não é autoridade de regras e não determina automaticamente o melhor deck.
4. **EDH.Wiki / guias especializados:** estrutura de arquétipo, sinergias, linhas e cartas para investigar; validar criticamente.
5. **Moxfield / Archidekt / decklists públicas / comunidade:** benchmarks, pacotes e alternativas; não copiar sem explicar o custo de oportunidade.
6. **EDH-Combos:** ponto de partida para linhas conhecidas; cada linha precisa de auditoria independente de custo, timing, zonas, repetibilidade, interrupção e consequência.
7. **Análise própria:** declarar quando for inferência ou hipótese.

Pesquisar sempre que a novidade de uma carta, banlist ou regra atualizada puder alterar a conclusão. Citar as fontes usadas para alegações específicas. Não afirmar que uma página/lista foi totalmente analisada se só foi possível consultar snippets, uma prévia ou parte do conteúdo; documentar o limite.

## 4.1 Benchmark adversarial

Para cada candidata importante, responder:
- por que aparece em listas de referência?
- qual problema ela resolve neste deck?
- qual carta atual sai?
- a solução mais popular é de fato a melhor aqui?
- existe opção menos óbvia com melhor eficiência/dupla função?
- a inclusão muda a potência ou a dinâmica social?
- qual é o argumento mais forte contra ela?

**GOOD CARD — WRONG DECK**: usar quando a carta é boa em abstrato, mas não apoia o plano, depende de recursos ausentes, compete com uma opção melhor, é redundante ou ocupa um slot crítico.

---

# 5. Regras, combos e interações

Para cada combo/interação importante, verificar separadamente:
1. texto Oracle atual de cada peça;
2. zonas antes/depois;
3. custos exatos e recurso utilizado;
4. timing e velocidade;
5. gatilhos, alvos e condições;
6. controle do objeto e escolha de alvos;
7. dependência de mana, vida, cartas, marcadores ou estado do tabuleiro;
8. se o loop é infinito, repetível finitamente, arbitrariamente grande mas finito ou apenas explosivo;
9. interação adversária e consequência da perda de uma peça;
10. se vence imediatamente ou somente cria vantagem.

“Possível” não significa “frequente”, e “combo listado em site” não significa “plano ideal”. O usuário pode tolerar combos como plano secundário ou não querer que definam a identidade do deck. Registrar essa preferência por deck.

## 5.1 Alertas específicos que devem ser lembrados

- **Kaalia of the Vast:** uma criatura colocada no campo já atacando não foi declarada atacante; gatilhos “when this creature attacks” normalmente não disparam apenas por entrar atacando. Sower of Discord é Demônio e alvo válido de Kaalia. Confirmar regras e texto antes de avaliar.
- **Okaun // Zndrsplt:** Krark’s Thumb aumenta a probabilidade de vencer um evento de moeda, mas não garante vitória. Dano espalhado por Kediss não é dano de comandante contra os demais oponentes. Sakashima the Impostor mantém o próprio nome ao copiar; Cursed Mirror tem função dupla de mana e cópia temporária.
- **Wilhelt:** o Zombie decayed criado por Wilhelt não gera outro token via Wilhelt quando morre, pois já tinha decayed. Noxious Ghoul pode matar os seus próprios não-Zombies. Roaming Throne multiplica triggers de outras criaturas do tipo escolhido; não cria tokens por si só.
- **K’rrik:** substitui cada símbolo {B} por pagar 2 de vida; não substitui custo genérico. Vida é recurso finito. Auditar Exquisite Blood e payoffs de drenagem para evitar descrever combo potencial como vitória garantida.
- **Lathliss:** só um Dragão não ficha que entra sob seu controle gera token pela habilidade dela; os tokens não geram tokens adicionais por si. Roaming Throne nomeando Dragon pode duplicar triggers elegíveis. Chain Reaction + Wrathful Red Dragon converte dano recebido por Dragões em dano a alvos que não sejam Dragões; a limpeza continua causando dano às suas próprias criaturas.
- **Krenko:** a habilidade de Krenko conta Goblins que você controla ao resolver; haste/proteção podem permitir ativação antes de remoção. Marvin, Murderous Mimic pode copiar habilidades ativadas de criaturas, mas cada interação precisa de seu texto e custo conferidos.
- **Zur:** busca encantamentos de valor de mana até 3 quando ataca. Uma Aura colocada diretamente no campo pela habilidade não faz alvo, embora precise poder encantar legalmente o objeto. Reconnaissance pode retirar Zur do combate depois da declaração de atacantes, sem desfazer o trigger já disparado, quando usada corretamente.
- **Zara:** sua habilidade permite temporariamente pôr em campo uma criatura revelada da mão de um oponente quando ataca; normalmente há habilidade retardada de retorno no início da próxima etapa final. Sundial of the Infinite pode exilar essa habilidade da pilha quando usada no timing apropriado; blink da criatura sob seu controle pode criar um novo objeto que permaneça sob seu controle, mas verificar cada linha exatamente antes de recomendá-la. Curiosity + Niv-Mizzet é linha conhecida; confirmar peças, triggers e possibilidade de interrupção.
- **Ezio Auditore:** usar release notes oficiais de Assassin’s Creed para freerunning e cartas ACR. Roshan, Hidden Magister amplia o tipo Assassin nas criaturas aplicáveis sob condições descritas no texto Oracle. A sinergia de cemitério de Layla/Altaïr conflita com Rest in Peace; a escolha depende da necessidade de graveyard hate do meta.
- **Thornbite Staff / Krenko:** qualquer linha combinando Staff, Krenko e sacrifício/dano precisa ser auditada para disponibilidade da criatura equipada, custo, evento de morte e repetição real. Não declarar infinito apenas porque um componente desvira em morte.

Acrescentar alertas novos sempre que um erro de análise for descoberto.

---

# 6. Teoria 8×8, grupos e contagens

A estrutura tradicional considera 1 comandante, aproximadamente 35 terrenos e 64 slots distribuídos por 8 grupos. É uma ferramenta de diagnóstico, não uma regra universal.

- Respeitar os grupos definidos pelo usuário como ponto inicial.
- Adaptar categorias para refletir estratégia real; explicar alterações.
- Cada carta física conta uma única vez na contagem total, mesmo tendo várias funções.
- A cada carta atribuir um grupo primário para tabelas de contagem e registrar as funções secundárias separadamente.
- Reportar terrenos físicos, MDFCs e fontes funcionais em colunas diferentes. MDFC é uma carta física, nunca duas.
- Avaliar fontes coloridas, terrenos que entram virados, requisitos coloridos e custo de oportunidade, não só o número bruto de terrenos.
- Em monocolor, terrenos utilitários ainda podem custar consistência; em listas de curva alta, 35 fontes funcionais não significam 35 terrenos desvirados no turno 1.
- Os oito grupos não precisam ter exatamente oito cartas. Não forçar categorias artificiais.

---

# 7. Sistema de avaliação e notas — versão consolidada

## 7.1 Princípios

- Toda nota deve ter contexto de comparação (casual, casual forte/high-power, otimizado ou cEDH), identidade desejada e principais trade-offs.
- Não atribuir 9+ apenas por causa de um comandante forte, cartas caras, staples ou muitas trocas.
- A CURRENT é avaliada pela lista que existe; a PROPOSED por projeção estrutural.
- As notas ponderadas recentes de Lathliss e Krenko substituem as notas preliminares de 8,5 que não tinham rubrica publicada. Isso não prova que a lista piorou; é rebaseline metodológica.
- Não recalcular decks antigos com a rubrica nova sem registrar a nova data, os pesos usados e a razão da mudança. Não comparar notas geradas por metodologias diferentes como se fossem idênticas.

## 7.2 Rubrica comum sugerida — 100%

| Critério | Peso |
|---|---:|
| Curva e aceleração | 15% |
| Vantagem de cartas / compra / seleção | 15% |
| Sinergia com o plano principal/tribal | 15% |
| Interação e limpezas | 15% |
| Proteção e resiliência | 10% |
| Acesso à vitória / capacidade de fechar | 10% |
| Base de mana | 5% |
| Flexibilidade funcional / dupla função | 5% |
| Consistência do comandante/motor | 5% |
| Identidade e experiência pretendida | 5% |
| **Total** | **100%** |

A rubrica deve ser adaptada quando fizer sentido e qualquer ajuste de peso precisa ser declarado. Mostrar notas por critério, não apenas a média. A precisão decimal não deve sugerir evidência que não existe; 9,08 pode ser apresentado como ~9,1/10.

## 7.3 O que significa a nota

- **0–4:** estrutura com falhas grandes para o plano declarado.
- **4–6:** identidade discernível, mas múltiplos gargalos limitam funcionamento.
- **6–7,5:** funcional, com lacunas relevantes de consistência, recursos ou interação.
- **7,5–8,5:** sólido, mas ainda com gargalos identificáveis ou redundância insuficiente.
- **8,5–9,2:** construção muito forte para o seu contexto, faltam trade-offs, testes ou refinamentos específicos.
- **9,2–9,7:** otimização muito alta para a identidade e meta declaradas, sustentada por auditoria rigorosa; ainda não significa win rate comprovada.
- **9,8–10:** reservar para casos excepcionalmente bem demonstrados, com evidência estrutural e playtests adequados; não precisa ser concedida.

Um 10/10 é uma referência aspiracional do melhor deck para a identidade pretendida, não um teto obrigatório ou uma promessa. Às vezes manter uma carta temática de potência inferior é correto; registrar explicitamente o custo de oportunidade.

---

# 8. Playtest e aprendizado por evidência

Registrar em cada partida, quando possível:
- deck e versão exatos, data, quantidade de jogadores/pod, posição na ordem;
- mão inicial e mulligans;
- turno em que o plano central começa;
- quando comandante/motor entra e quantas vezes gera valor;
- cartas mortas, cartas caras presas na mão e momentos sem gás;
- interação disponível quando necessária e ameaças não respondidas;
- efeito de remoção/wipe e capacidade de reconstrução;
- condição e turno de vitória, ou motivo de derrota;
- contribuição das cartas novas;
- comentários do jogador.

Indicadores úteis: taxa de mãos funcionais, turno da primeira jogada de impacto, número de ativações do comandante, frequência de ficar sem cartas, interação disponível nos turnos críticos, reconstrução pós-wipe e confiabilidade de fechamento.

Não julgar carta por uma única partida. Idealmente observar pelo menos 5 partidas comparáveis antes de fazer uma rodada de cortes, mais se a variância do deck/meta for alta. Não fabricar estatísticas quando os registros não existem.

---

# 9. Dashboards e Handovers — padrão de entrega

## 9.1 Dashboard Excel

Usar apenas abas que agreguem valor. Uma estrutura comum robusta inclui:
1. Dashboard Executivo;
2. CURRENT Decklist;
3. PROPOSED Decklist(s);
4. Card Matrix (grupo primário, funções secundárias, sinergia, prioridade, estado);
5. Upgrade Matrix (OUT → IN, ganho, perda, risco, prioridade, confiança);
6. Grupos / 8×8;
7. Tier List;
8. Structural Audit (curva, terrenos, fontes coloridas, contagens);
9. Watchlist;
10. Sources & Rules;
11. Playtest Log;
12. Control Panel / Read Me, se agregar valor.

## 9.2 Handover Markdown específico

Conter, conforme relevância:
- identidade, plano por fase e objetivo de potência;
- versão e data de revisão;
- preferência e restrições confirmadas;
- listas CURRENT e PROPOSED completas quando apropriado;
- contagens e critério de terreno/MDFC;
- diagnóstico estrutural, regras e combos críticos;
- trocas completas e argumentos contra;
- nota com rubrica e limites;
- fontes externas e Watchlist;
- plano de teste, pendências e prompt curto de retomada.

## 9.3 Entregas de dois decks na mesma sessão

- Tratar como **dois projetos separados**: estratégia, scores, listas, categorias, trocas e arquivos próprios.
- Aproveitar benchmark compartilhado apenas onde as funções sejam realmente equivalentes.
- Produzir 4 arquivos: 2 dashboards + 2 handovers.
- Validar cada arquivo de maneira individual; não presumir que o sucesso do deck A prova que o deck B está correto.
- Encerrar com um índice simples dos quatro links e resumo de diferenças. Se a geração ou entrega falhar, fornecer cópia com nome curto apenas após confirmar que o arquivo existe.

## 9.4 Falhas de download / entrega

Se o usuário vir “A entrega da mensagem atingiu o tempo limite”:
- não concluir que os arquivos foram danificados;
- verificar se o arquivo exato existe e tem tamanho plausível;
- oferecer o link direto novamente; se útil, criar uma cópia com nome curto e verificar o caminho;
- sugerir atualizar a página, abrir o link em nova guia ou tentar janela anônima se o problema persistir;
- não afirmar que o arquivo está íntegro se não foi possível inspecioná-lo. Distinguir “arquivo existe” de “conteúdo validado”.

---

# 10. Histórico de preferências e projetos anteriores

Esta lista resume somente as informações gerais disponíveis. O handover e dashboard específicos continuam sendo a fonte primária de cartas e trocas.

## 10.1 Ken, Burning Brawler
- Plano: conectar com o comandante, causar dano de comandante, equipar/proteger e buscar combates extras.
- Grupos: Ramp; Draw; Removal; Sinergia; Equipamento (Proteção); Equipamento (Especial); Combate extra (não-criatura); Combate extra (criatura).
- **PETs obrigatórias:** Lightning Bolt e Vikya, Scorching Stalwart — não considerar para cortes.
- **Slash the Ranks:** não descrever como remoção de Ken; seu texto preserva comandantes.

## 10.2 Humanos monobrancos (Greymond / Avacyn’s Stalwart)
- Plano: tribal Humans, tokens e pressão.
- Grupos: Ramp; Draw; Removal; Proteção; Tax; Buff; Token; Dupla função/combate.

## 10.3 Lynde, Cheerful Tormentor
- Tema central: curses/encantamentos de maldição; plano de início, meio e fim deve refletir a lista específica.

## 10.4 Queen Marchesa — Mardu Monarchy
- Plano: início discreto, rocks/proteção; estabelecer Marchesa no meio do jogo e manter Monarquia para compra.
- Prioridades funcionais: política, proteção, remoções, recursos e fechamento.

## 10.5 Fynn the Fangbearer — monogreen infect
- Plano: aggro de veneno; risco de gastar a mão e ficar sem recursos.
- Grupos: Ramp; Draw; Removal; Sinergia; Proteção; Buff + WinCon; Proliferar; Dupla função.

## 10.6 Vito, Thorn of the Dusk Rose — Vampiros monoblack
- Deck favorito/primeiro do usuário.
- Tema: Vampiros, ganho de vida e drenagem gradual. Combo pode existir como contingência, não deve ser plano principal se o usuário não o desejar.
- PETs: **Hatred, Exsanguinate e New Blood**.

## 10.7 Strefan, Maurer Progenitor — Rakdos Vampires / Blood Tokens
- Plano: início resiliente; meio de jogo com Strefan e Blood; final com Vampiros grandes e combos possíveis.
- Grupos: Ramp; Draw; Removal; Recursão; Dano direto; Especial (tutores + wincons); Sinergia + Pet; Blood Token.
- Pets/tema: Dracula, artes diferenciadas e Vampiros temáticos, especialmente ligados a Blood.
- Não reformar mana sem diagnóstico de curva/fontes. CURRENT/V2/V3 são estados distintos. A V3 prévia não é testada.

## 10.8 Lathril, Blade of the Elves — Golgari Elves
- Tema: tribal de Elfos forte, tokens e valor interativo sem virar Elfball genérico.
- Plano: acelerar, criar massa de Elfos, usar ativações de Lathril, converter tokens em cartas/dano/pressão e fechar por drenagem ou combate.
- Grupos: Ramp; Draw; Removal; WinCon; Tokens; Untap + Sinergia; Buff; Ramp2.
- Lathril precisa virar a si mesma **e dez outros Elfos desvirados** para a habilidade de drenar; não contar a comandante como um dos dez.
- Interações a auditar: Dionus, Elvish Archdruid, Seedborn Muse, Staff of Domination, Umbral Mantle, Mirkwood Bats, Skullclamp.
- Artefatos anteriores conhecidos: `Handover_Lathril_Elves_V2_Deep_Review.md` e `Lathril_Elves_Dashboard_V2_Deep_Review.xlsx`. Confirmar estado e versão antes de retomar.

## 10.9 Kaalia of the Vast — Mardu Angels/Demons/Dragons
- Handover/Dashboard próprios citados no Master V3: `Handover_Kaalia_of_the_Vast_V2_Deep_Review.md`, `Kaalia_of_the_Vast_Dashboard_V2.xlsx`.
- Na revisão registrada: CURRENT 5,8/10; PROPOSED V2 8,9/10, ambas avaliações antigas sem playtest. A proposta tinha muitas mudanças, inclusive base de mana; auditar novamente antes de implementar.
- Gatilhos “when attacks” de criaturas postas diretamente atacando por Kaalia não disparam só por entrarem atacando. **Sower of Discord é Demônio** e é alvo válido.

## 10.10 Okaun, Eye of Chaos // Zndrsplt, Eye of Wisdom
- Tema especial de precon e cara/coroa deve ser preservado; não transformar automaticamente em pilha de staples.
- Handover/Dashboard anteriores: `Handover_Okaun_Zndrsplt_V2_Deep_Review.md`, `Okaun_Zndrsplt_Dashboard_V2.xlsx`.
- CURRENT 7,5/10; V2 8,4/10 em nota histórica, proposta com oito trocas não testada.
- Combinações conhecidas incluem Frenetic Efreet + Chance Encounter e Niv-Mizzet, Parun + Curiosity; conferir regras/objetivo de cada linha. Sakashima the Impostor mantém nome próprio; Cursed Mirror é acelerador e cópia temporária; Kediss não transforma dano nos outros jogadores em dano de comandante.

## 10.11 Wilhelt, the Rotcleaver — Zombie tribal
- Prioridade: densidade alta de Zumbis relevantes; tokens como segundo eixo para compra/dano/recursão/sacrifício.
- Grupos: Ramp; Draw; Removal; Recursão; Sacrifice + token; Tokens; Buff; Sinergia + WinCon.
- Handover/Dashboard: `Handover_Wilhelt_Zombie_Tribal_V2_Deep_Review.md`, `Wilhelt_Zombie_Tribal_Dashboard_V2.xlsx`.
- CURRENT 7,7/10; V2 8,7/10 histórica, nove trocas não testadas. Gravecrawler + Phyrexian Altar + Diregraf Captain foi registrada como linha de loop/drenagem; confirmar estado atual. Noxious Ghoul pode matar seus não-Zombies. The Scarab God não é Zombie; Roaming Throne não gera tokens por conta própria.

## 10.12 K’rrik, Son of Yawgmoth — life as resource / drain / reanimator
- Handover/Dashboard: `Handover_Krrik_Son_of_Yawgmoth_V2_Deep_Review.md`, `Krrik_Son_of_Yawgmoth_Dashboard_V2.xlsx`.
- CURRENT 6,8/10; V2 8,4/10 histórica, 13 trocas não testadas. Preferência por consistência, resposta e potencial de vitória; pets não foram definidos no registro mais recente.
- Vida substitui símbolos {B}, não mana genérica. Exquisite Blood + Sanguine Bond/Vito/Enduring Tenacity são linhas conhecidas de vitória; confirmar todos os custos e condições, inclusive Aetherflux Reservoir e Leshrac’s Sigil.

---

# 11. Decks analisados na janela atual — estado consolidado

**Data das revisões:** 14/10/2026. Os status abaixo resumem os handovers recentes e não significam que as cartas sugeridas foram adquiridas/testadas. Consulte cada handover e Dashboard para lista, notas e trocas exatas.

## 11.1 Zur the Enchanter — Esper Political Control

**Artefatos prioritários:**
- `Handover_Zur_the_Enchanter_Political_Control_V2_Deep_Review.md`
- `Zur_the_Enchanter_Political_Control_Dashboard_V2_Deep_Review.xlsx`
- Existe também cópia com nome curto: `Zur_Dashboard_Deep_Review.xlsx`.

**Identidade:** controle, tax seletivo e política/negociação; manipular combate e responder cirurgicamente, mantendo o jogo dinâmico. Não converter automaticamente em hard stax/cEDH/combo.

**CURRENT registrada:** 100 cartas, 33 terrenos físicos, 66 não-terrenos além do comandante e 27 encantamentos buscáveis por Zur (MV ≤3; contar Alseid of Life’s Bounty como criatura encantamento). A lista tinha sete efeitos amplos/temporários de reset identificados: By Invitation Only, Cleansing Nova, Doomskar, Extinction Event, Out of Time, Sculpted Sunburst e Supreme Verdict.

**V3 proposta não testada:** melhor aceleração de duas manas, draw/seleção (Mystic Remora, Rhystic Study, Necropotence), interação de pilha (Swan Song, Dovin’s Veto, Arcane Denial), Swords to Plowshares, Ghostly Prison, Grasp of Fate e incentivos políticos como Duelist’s Heritage e Curses. A proposta reduziu os resets a três segundo o handover específico e melhorou fontes pretas.

**Notas:** uma avaliação preliminar de 7,9 foi substituída por revisão mais profunda. O handover V2 Deep Review registra CURRENT 6,4/10 e PROPOSED V3 8,5/10 estimado. **Esses valores não foram publicados com a mesma rubrica ponderada usada posteriormente para Lathliss/Krenko; não comparar diretamente sem recalcular.**

**Interações:** Zur ataca para buscar encantamento com MV ≤3; Reconnaissance pode retirar Zur do combate depois da declaração de atacantes, sem desfazer gatilho disparado. Impetus recompensa/induz ataques, mas não é a mesma coisa que a palavra-chave goad. Necropotence/Remora/Study aumentam força e também ameaça percebida. O tema político deve guiar a decisão, não apenas a potência bruta.

## 11.2 Zara, Renegade Recruiter — Izzet Theft / Appropriation

**Artefatos:** `Handover_Zara_Renegade_Recruiter_Theft_Izzet_V1_Deep_Review.md`, `Zara_Renegade_Recruiter_Theft_Izzet_Dashboard_V1.xlsx`.

**Identidade:** homenagem ao irmão do usuário; roubar criaturas/permanentes adversárias, copiar as melhores ameaças e transformar o poder dos outros em vantagem própria. Evitar virar Izzet spellslinger genérico. Potência casual forte/high-power casual; combo Curiosity + Niv-Mizzet pode continuar como rota secundária, se o usuário não pedir sua remoção.

**Notas históricas do handover:** CURRENT 6,6/10; PROPOSED V2 8,2/10, ainda não testada. CURRENT 100 cartas, 31 terrenos físicos + 3 MDFCs com face-terreno = 34 fontes funcionais potenciais, nem todas desviradas. V2 registra 36 terrenos físicos + 3 MDFCs = 39 fontes potenciais; a curva média dos não-terrenos sobe levemente (~3,09 para ~3,21), pois a proposta adiciona payoffs de roubo caros. O ganho alegado é principalmente retenção e manabase, não redução da curva.

**Interação-chave:** Zara coloca temporariamente criatura revelada da mão do jogador atacado; habilidade retardada de retorno geralmente acontece na próxima etapa final. Sundial of the Infinite pode remover o trigger da pilha no timing apropriado. Blink da criatura roubada sob seu controle pode fazê-la voltar como novo objeto sob seu controle. Fling/Kazuul’s Fury podem converter um empréstimo em dano/valor antes do retorno. Auditar texto/timing antes de alterar estas linhas.

**Grupos revistos:** ramp; draw/seleção; roubo temporário/combate; roubo permanente/controle; cópia/clonagem; interação/counters/resets; motor de Zara/proteção/haste/retenção; finalizadores/tax/utilidade. Não somar funções múltiplas no total físico.

## 11.3 Ezio Auditore da Firenze — Assassin’s Creed / Assassin / Historic / Freerunning

**Artefatos:** `Handover_Ezio_Auditore_Assassins_V1.md`, `Ezio_Auditore_Assassins_Dashboard_V1.xlsx`.

**Identidade:** deck for-fun da coleção Assassin’s Creed, preservar o máximo de ACR e evitar otimização competitiva desnecessária. CURRENT tem 100 cartas, 34 terrenos físicos (20 básicos) conforme o handover específico. PROPOSED V2 contém sete trocas e não foi testada.

**Plano:** acertar jogadores com Ezio/Assassinos, usar freerunning, gerar valor com Historic (artefatos, lendárias, Sagas) e montar pressão temática. Roshan, Hidden Magister amplia o tipo Assassin nos objetos aplicáveis enquanto está em campo. A compra e a mana/fixing foram os gargalos apontados.

**V2 registrada:** Sol Ring e Arcane Signet são as duas inclusões não-ACR; outras inclusões ACR reforçam draw/Assassin/Historic. A proposta corta Rest in Peace porque ela entra em conflito com as linhas de cemitério de Layla Hassan/Altaïr; isso pode ser revisitado se graveyard hate for exigência do meta. Não reduzir a identidade por competitividade desnecessária. Usar as release notes oficiais de Assassin’s Creed para regras de freerunning e cartas específicas.

## 11.4 Lathliss, Dragon Queen — Mono-Red Dragons

**Artefatos finais mais recentes:**
- `Handover_Lathliss_Dragons_V3_Deep_Review.md`
- `Lathliss_Dragons_V3_Deep_Review.xlsx`

**Identidade:** tribal de Dragões high-power casual; aceleração, fichas 5/5 de Lathliss, dano de entrada, Tesouros e combates extras. Grupos fornecidos: Ramp; Draw; Removal; Sinergia 1; Sinergia 2; Sinergia 3; Tesouro; Combate extra.

**Auditoria V3 registrada:** todas as versões têm 100 cartas. CURRENT: 32 terrenos físicos + 3 MDFCs = 35 opções de terreno. V2: 31 físicos + 4 MDFCs = 35. V3: 31 físicos + 4 MDFCs = 35. MDFCs contam uma vez como carta.

**Notas reavaliadas pela rubrica ponderada comum:** CURRENT 5,85 (~5,9); V2 8,01 (~8,0); V3 9,08 (~9,1), esta última proposta e não testada. A nota antiga 8,5 da V2 foi recalculada por não haver rubrica publicada naquela avaliação; a mudança é rebaseline, não prova de piora.

**Gargalos e melhorias:** curva e aceleração, draw recorrente/impulsivo, resiliência e redundância de payoffs. A V3 investiga Chrome Mox, Mana Vault, Ancient Tomb, Cavern of Souls, Urza’s Incubator, The One Ring, Jeska’s Will, Valakut Awakening, Dragonhawk, Bonehoard Dracosaur, Knollspine Dragon e redundância de dano/dragões. Sol Ring já existe na CURRENT e não deve ser sugerido como nova carta.

**Interações:** Chain Reaction + Wrathful Red Dragon pode transformar dano recebido em dano a alvos que não sejam Dragões; Chain Reaction ainda causa dano às criaturas suas, portanto não é wipe unilateral por si. Blasphemous Act é simétrica. Mizzium Mortars overload causa 4 às criaturas que você não controla e não limpa resistência alta. Roaming Throne nomeando Dragon pode duplicar triggers elegíveis de Lathliss. Não declarar combos/combates infinitos sem provar recursos e condições.

## 11.5 Krenko, Mob Boss — Mono-Red Goblins

**Artefatos finais mais recentes:**
- `Handover_Krenko_Goblins_V3_Deep_Review.md`
- `Krenko_Goblins_V3_Deep_Review.xlsx`

**Identidade:** tribal de Goblins que coloca pressão por volume, ativa Krenko cedo/repetidamente e converte fichas em combate, dano direto, mana e cartas. Grupos fornecidos: Ramp; Draw; Removal; Token; Combate + Dano Direto; Buff + Haste; Sinergia 1; Sinergia 2.

**Auditoria V3:** 100 cartas. CURRENT: 32 terrenos físicos + 1 MDFC = 33. V2: 33 + 1 = 34. V3: 34 + 1 = 35 opções de terreno.

**Notas reavaliadas pela rubrica ponderada comum:** CURRENT 6,04 (~6,0); V2 8,24 (~8,2); V3 9,23 (~9,2), ainda não testada. A antiga V2 8,5 foi rebaselined, não porque tenha sido provada pior, mas porque a nota original não tinha rubrica publicada.

**Gargalos e melhorias:** proteger Krenko, produzir a primeira ativação cedo, reforçar densidade tribal e evitar ficar sem gás. V3 inclui como candidatas Goblin Chieftain, Goblin Recruiter, Goblin Ringleader, Pashalik Mons e Goblin Chirurgeon, além de motores de compra/ativação. A watchlist de Conspicuous Snoop/Kiki-Jiki e pacotes de combo deve ficar separada se alterar identidade.

**Interação crítica:** Marvin, Murderous Mimic pode copiar habilidade ativada de Krenko, mas verificar texto Oracle e timing. Worldfire foi proposto para sair em favor de maior consistência; não descrever o corte como questão de banlist, e sim de plano. Thornbite Staff + Krenko + Goblin Bombardment permanece fora da baseline V3 até se decidir conscientemente o perfil de combo e demonstrar a linha exata.

**Rubrica comum publicada:** dez eixos ponderados (curva/aceleração 15%; compra 15%; sinergia 15%; interação 15%; proteção/resiliência 10%; fechamento 10%; mana 5%; flexibilidade 5%; consistência do comandante 5%; identidade 5%).

---

# 12. Registro de aprendizados da janela atual

1. **Não se aceita 8,5 como teto sem evidência.** O usuário questionou esse padrão; a resposta correta é reabrir a análise, pesquisar, publicar critérios e demonstrar gargalos. Nunca aumentar notas só para agradar.
2. **O problema de nota sem método foi concreto.** Lathliss/Krenko foram reavaliados com rubrica ponderada; suas V2 mudaram de nota por rebaseline metodológica. Repetir esse procedimento em outros decks somente quando houver tempo/escopo e registrar a alteração de método.
3. **Profundidade não é número de trocas.** Um upgrade precisa ser rastreável: problema, evidência, alternativa, custo e teste.
4. **Pesquisa não significa copiar EDHREC/Moxfield/Archidekt.** Usar listas como benchmarks; manter identidade e estilo pessoal. Moxfield ou Archidekt podem não permitir extração integral confiável; declarar limites em vez de fingir comparação completa.
5. **Força individual pode conflitar com o conceito do deck.** Zur quer controle político, não hard stax; Zara quer apropriação das cartas adversárias, não spellslinger genérico; Ezio quer Assassin’s Creed for-fun, não otimização sem tema; Lathliss quer uma máquina de Dragões; Krenko quer um enxame de Goblins.
6. **Trocas devem explicar OUT e IN.** Explicar o que a carta removida fazia, o que se ganha, o que se perde e quais cenários tornam a entrada ruim.
7. **Contagem precisa separar tipos de recurso.** Total físico de cartas, terrenos físicos, MDFCs, fontes funcionais, cartas tutoreáveis e cartas por função são métricas diferentes.
8. **MDFC é uma carta, não duas.** Contar por uma função primária; registrar separadamente que a face de terreno pode ser uma fonte funcional.
9. **Não confiar em acabamento como restrição.** Os marcadores *F*/*E* foram preservados, mas não presumidos PET.
10. **Correções devem ser explícitas.** Ex.: em Zur, a nota preliminar 7,9 foi substituída por revisão profunda; em Lathliss, Wild Wasteland não é terreno; em Lathliss, Sol Ring já está na CURRENT.
11. **Planos políticos têm custo social próprio.** Necropotence e engines altamente eficientes podem aumentar ameaça percebida; mais potência bruta nem sempre melhora o deck pretendido.
12. **A entrega do arquivo também é parte do trabalho.** Houve mensagem de timeout de entrega; criar/renomear cópias só após verificar caminhos reais. Dividir a entrega de vários arquivos em etapas quando necessário.
13. **Duas análises numa sessão funcionam, desde que independentes.** Lathliss e Krenko foram analisados em lote; as propostas e scores são separadas. Reaproveitar pesquisa mono-red apenas como ponto de partida, não como recomendação automática.
14. **Nenhuma V2/V3 recente foi testada por partidas neste contexto.** O próximo avanço de confiabilidade depende de playtest log; não declarar desempenho real com base em teoria.

---

# 13. Índice de artefatos específicos desta janela

Os arquivos abaixo foram criados no ambiente de trabalho da sessão e seus caminhos devem ser confirmados antes de oferecer links em uma conversa futura. Eles não substituem os arquivos carregados pelo usuário, nem implicam que o usuário baixou ou aplicou as propostas.

| Deck | Handover mais recente | Dashboard mais recente | Estado registrado |
|---|---|---|---|
| Zur | `Handover_Zur_the_Enchanter_Political_Control_V2_Deep_Review.md` | `Zur_the_Enchanter_Political_Control_Dashboard_V2_Deep_Review.xlsx` (há cópia `Zur_Dashboard_Deep_Review.xlsx`) | CURRENT congelada; proposta V3 não testada |
| Zara | `Handover_Zara_Renegade_Recruiter_Theft_Izzet_V1_Deep_Review.md` | `Zara_Renegade_Recruiter_Theft_Izzet_Dashboard_V1.xlsx` | CURRENT congelada; proposta V2 não testada |
| Ezio | `Handover_Ezio_Auditore_Assassins_V1.md` | `Ezio_Auditore_Assassins_Dashboard_V1.xlsx` | CURRENT congelada; proposta V2, sete trocas, não testada |
| Lathliss | `Handover_Lathliss_Dragons_V3_Deep_Review.md` | `Lathliss_Dragons_V3_Deep_Review.xlsx` | V3 projetada, não testada |
| Krenko | `Handover_Krenko_Goblins_V3_Deep_Review.md` | `Krenko_Goblins_V3_Deep_Review.xlsx` | V3 projetada, não testada |

Para outros decks da seção 10, buscar os arquivos específicos mais recentes no espaço de trabalho/biblioteca. Não inventar caminho se o arquivo não estiver disponível.

---

# 14. Prompt master de retomada — copiar em um novo chat

> **CONTINUE O PROJETO DE DECKBUILDING COMMANDER — HANDOVER MASTER V4 CONSOLIDADO**
>
> Use este Master V4 como protocolo geral e leia o handover/Dashboard específico anexado para a lista em questão. CURRENT é sempre a lista exata enviada pelo usuário; preserve-a. Mantenha PROPOSED, TESTED, REJECTED e ACQUIRED/INCLUDED separados. Não presuma que sugestão anterior foi comprada, incluída ou jogada.
>
> Quero análise profunda, específica e anti-alucinação. Entenda a identidade e o modo de vitória antes de propor cartas; audite contagem de 100 cartas, singleton, legalidade, curva, fontes de mana, cores, draw, interação, proteção, recursão e fechamento. Use a teoria 8×8 flexivelmente e preserve os grupos fornecidos pelo usuário salvo justificativa.
>
> Pesquise fontes corretas para a pergunta: Wizards/Comprehensive Rules/Gatherer/release notes e Scryfall para regras e texto Oracle; EDHREC, EDH.Wiki, Moxfield, Archidekt, EDH-Combos e referências comunitárias para benchmarks e opções. Não copiar listas automaticamente. Se não for possível abrir uma lista completa, diga isso.
>
> Para combos/interações, verifique custos, timing, zonas, gatilhos, alvos, condições, recursos, interrupções e se a linha é infinita, finita ou só explosiva. Separe fato verificado, inferência, hipótese de playtest e desconhecido. Se detectar erro antigo, corrija explicitamente e atualize todos os lugares afetados.
>
> Para cada OUT → IN relevante, explique problema, evidência, função perdida, ganho, risco, argumento contra, prioridade e como testar. Não sugira carta já presente. Preserve PETs/restrições explícitas; não inferir PET por acabamento. Potência não deve apagar o tema ou estilo desejado.
>
> Use uma rubrica de 10 critérios ponderada totalizando 100% quando couber, publique os pesos e as notas por critério. Não inflar nem prometer 10/10. As notas de Lathliss e Krenko V3 são rebaseline ponderadas; as notas de outros decks com metodologias antigas não são diretamente comparáveis sem recalcular e registrar isso.
>
> Em análise completa, produza Dashboard Excel e Handover Markdown por deck; em lote de dois decks, mantenha quatro arquivos separados e audite cada um independentemente. Confirme caminhos e consistência entre arquivos antes de fornecer links. Registre próximos passos e playtests. Nenhuma versão é TESTED sem evidência de partidas.

---

# 15. Checklist final de qualidade

- [ ] A lista de origem foi identificada como CURRENT e preservada.
- [ ] Total de 100 cartas conferido, comandante incluído.
- [ ] Singleton/identidade de cores/banlist conferidas.
- [ ] Terrenos físicos, MDFCs e fontes funcionais separados claramente.
- [ ] Curva, requisitos coloridos e terrenos virados auditados.
- [ ] Texto Oracle atual verificado para as interações decisivas.
- [ ] Regras/rulings consultados quando a linha depende de detalhes.
- [ ] Benchmark citado sem ser tratado como prova de otimização.
- [ ] Fatos, inferências, hipóteses e desconhecidos separados.
- [ ] Argumento contra registrado para upgrades importantes.
- [ ] Trocas OUT → IN reconciliadas; cartas cortadas não permaneceram por engano.
- [ ] Grupos funcionais e tier list refletem o plano real.
- [ ] Nota tem contexto, rubrica declarada e não é win rate.
- [ ] CURRENT/PROPOSED/TESTED/REJECTED/ACQUIRED/INCLUDED não foram confundidos.
- [ ] Handover e Dashboard contêm listas/contagens consistentes.
- [ ] Arquivo e caminho foram realmente verificados antes de linkar.
- [ ] Pendências e próximos testes estão registrados.

**Regra final:** produzir uma decisão melhor, não uma resposta mais impressionante. A meta 10/10 é perseguir consistência, sinergia, eficiência, identidade e evidência; nunca uma licença para exagerar certeza. Quando a análise não puder provar algo, deve dizer isso — e indicar como obter a evidência.
