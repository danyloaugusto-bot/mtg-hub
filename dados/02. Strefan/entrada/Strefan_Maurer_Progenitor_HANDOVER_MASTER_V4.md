# HANDOVER MASTER V4 — STREFAN, MAURER PROGENITOR

**Projeto:** High-Power Blood Court — Rakdos Vampire / Blood Tokens  
**Atualizado em:** 11/10/2026  
**Finalidade:** transferir contexto suficiente para novas conversas, análises, revisões de cartas e novas versões do deck sem recomeçar do zero.  
**Estado das listas:** `Current` = lista original fornecida pelo usuário; `V2` = proposta estrutural anterior; `V3` = proposta high-power mais recente. **V2 e V3 não foram confirmadas como testadas.**

---

## 1. Resumo executivo — leia primeiro

O usuário quer elevar o deck de **Strefan, Maurer Progenitor** rumo a uma versão muito forte, potencialmente “10/10”, sem perder sua identidade temática. A avaliação deve ser profunda, crítica e baseada em impacto real de jogo — não uma lista superficial de upgrades, nem mudanças cosméticas.

### Identidade do deck
- **Comandante:** Strefan, Maurer Progenitor.
- **Cores:** Rakdos (preto/vermelho).
- **Plano central:** gerar e aproveitar **Blood Tokens**, causar perda de vida aos oponentes para habilitar Strefan e colocar Vampiros de alto impacto em campo, virados e atacando.
- **Subtema:** tribal de Vampiros, drenagem de vida, recursão e possíveis combos.
- **Preferências temáticas:** cartas Dracula, artes diferenciadas e Vampiros ligados a Blood Tokens têm valor especial para o usuário. Isso deve entrar na avaliação, mas não pode ser presumido como bloqueio absoluto sem confirmação nominal.
- **Orçamento:** sem limite predefinido. O foco é potência e encaixe, não preço ou disponibilidade.
- **Mana base:** não reformar automaticamente. Auditar com evidências e propor mudanças somente se houver motivo.
- **Método:** teoria 8×8; registrar função primária e funções secundárias sem contar a mesma carta duas vezes no total.

### Fases de jogo desejadas
1. **Early game:** desenvolver mana, gerar Blood e/ou causar dano eficiente sem chamar atenção cedo demais; preservar resiliência.
2. **Mid game:** resolver Strefan, garantir que oponentes tenham perdido vida no turno e atacar com dois Blood disponíveis para colocar um Vampiro da mão em campo.
3. **Late game:** ameaças de alto impacto, drenagem, recuperação pós-wipe e, se desejado, combo compacto e decisivo.

### Como deve ser a próxima análise
- Reavaliar **a lista completa**, não somente as últimas cartas citadas.
- Procurar cartas esquecidas, sinergias recentes e opções com **dupla função**: Blood + dano, Vampiro + remoção, ameaça + tutor, sacrifício + compra, drenagem + proteção, recursão + sinergia tribal etc.
- Explicar o papel concreto de cada inclusão e o custo real de cada corte.
- Distinguir fato de regra, pesquisa externa, inferência e hipótese de playtest.
- Não declarar “10/10” sem teste; uma nota de potência deve ser identificada como estimativa e acompanhada das razões e limitações.

---

## 2. Regras de continuidade e decisões vinculantes

1. **Nunca sobrescrever `Current`.** É a referência original e deve permanecer intacta em todo dashboard ou documento futuro.
2. **Preservar versões separadas:** Current, V2, V3 e futuras V4/V5, com status `proposta`, `em teste` ou `testada`.
3. **Não tratar `*F*` como PET LOCK.** Na lista, `*F*` é uma indicação de impressão/acabamento. Não prova que a carta é protegida contra cortes.
4. **Perguntar por PET LOCK nominal quando isso afetar cortes.** Respeitar a preferência estética por Dracula, artes diferenciadas e cartas Blood/Vampire, mas não inventar uma lista de cartas intocáveis.
5. **Não assumir que as inclusões sugeridas já foram compradas ou testadas.** A lista V3 é uma hipótese de construção.
6. **Não alterar a mana base por conveniência.** A V2/V3 usam 35 cartas com função de mana contando quatro MDFCs; essa contagem é um alvo de trabalho, não uma verdade universal. A necessidade real depende da curva, fontes coloridas e resultados de jogo.
7. **Sem limite de orçamento.** Não reduzir potência em favor de preço. Pode-se mencionar custo financeiro somente como informação secundária, nunca como critério primário.
8. **Sem cortes silenciosos.** Toda saída de carta deve ser explicitada com motivo, função perdida e alternativa considerada.
9. **Cartas multifuncionais contam uma vez na contagem total.** Na matriz 8×8, usar função primária e funções secundárias.
10. **Confirmar texto Oracle e legalidade atuais** para cartas novas, cartas com mecânicas recentes, combos e interações relevantes. Não confiar somente em memória ou imagens de guia.
11. **Não copiar cegamente o guia visual de Strefan.** Ele é referência estratégica, não substituto da lista do usuário.
12. **Artefatos preferidos:** no mínimo Dashboard Excel e Handover Markdown específico do deck. O usuário valoriza dashboard + handover; não criar relatórios extras que pouco agreguem sem perguntar.
13. **Fazer perguntas antes de fechar decisões realmente ambíguas**, mas não bloquear a análise com perguntas desnecessárias se já houver informação suficiente.

---

## 3. Comandante e plano técnico

**Strefan, Maurer Progenitor** custa {2}{B}{R}. No início da etapa final, ele cria um Blood Token para cada jogador que perdeu vida naquele turno. Ao atacar, pode sacrificar dois Blood para colocar um Vampiro da mão no campo de batalha virado e atacando; esse Vampiro ganha indestrutível até o final do turno.

### Consequências estratégicas
- É preciso causar perda de vida **antes do gatilho do end step** para gerar Blood nesse turno.
- O dano não precisa vir necessariamente de combate; efeitos globais de dano e drenagem podem ativar Strefan.
- Strefan precisa atacar para usar sua habilidade de cheat; proteção, remoção e condições de combate importam.
- A habilidade exige dois Blood e um Vampiro apropriado na mão. Gerar Blood sem ter alvo ou ter alvo sem Blood pode deixar recursos desconectados.
- Vampiros com impacto ao entrar, habilidades estáticas ou efeitos que não dependem de terem sido conjurados são bons alvos. Cuidado com habilidades que exigem “quando você conjurar”, custos X, ou gatilhos “quando atacar”: colocar uma criatura diretamente no campo atacando não é o mesmo que conjurá-la nem necessariamente declará-la como atacante.
- Os Blood também são recursos de filtragem: podem ajudar a descartar cartas caras ou redundantes e encontrar interação, terras ou ameaças.

Referências base: [EDH.Wiki — Strefan](https://edh.wiki/commanders/strefan-maurer-progenitor/) · [MTG Master — Strefan](https://mtgmaster.app/commanders/strefan-maurer-progenitor) · [mtg.wtf — Oracle/rulings](https://mtg.wtf/card/voc/2/Strefan-Maurer-Progenitor).

---

## 4. Organização funcional — teoria 8×8 do usuário

A estrutura de referência é **35 cartas com função de mana + comandante + 64 slots de mágicas**, distribuídos em oito grupos. A contagem deve ser verificada em cada versão; não force uma lista a caber no molde se isso mascarar uma deficiência real.

1. **Ramp**
2. **Draw**
3. **Removal**
4. **Recursão**
5. **Dano Direto**
6. **Especial** — tutores e wincons
7. **Sinergia + Pet**
8. **Blood Token**

### Regra para classificar cartas
Cada carta deve ter:
- uma função primária;
- funções secundárias e sinergias;
- fase de jogo preferencial;
- dependências (Strefan, Blood, Vampiros, criaturas morrendo, ganho/perda de vida etc.);
- avaliação de redundância e flexibilidade.

Uma carta pode ajudar em vários grupos, mas **não pode ser contada duas vezes** no total de 99 cartas não comandante.

---

## 5. Histórico das versões

### Current — lista original
É a lista de referência fornecida pelo usuário. Não editar nem reclassificar suas cartas como se as propostas já tivessem sido aceitas.

### V2 — proposta anterior
A V2 introduziu um pacote de criaturas e funções tribais, incluindo Voldaren Epicure, Bloodghast, Viscera Seer, Zulaport Cutthroat, Stormfist Crusader, Cordial Vampire, Sanctum Seeker, Patron of the Vein, Butcher of Malakir e Bloodline Necromancer, além de dois terrenos básicos adicionais na projeção. O objetivo foi melhorar início de jogo, sacrifícios, drenagem e redundância tribal.

### V3 — High-Power Blood Court
A V3 foi proposta após o usuário considerar a V2 insuficientemente forte. Ela reforça motores de Blood, pressão global, tutor, drenagem e condições de vitória. Inclui oito cartas-chave novas: **Blood Fountain, Bloodletter of Aclazotz, Bloodthirsty Conqueror, Emeritus of Woe, Enduring Tenacity, Exquisite Blood, Ingris Stingerquill e Scheming Silvertongue**. A lista também preserva inclusões selecionadas da V2, como Voldaren Epicure, Cordial Vampire, Sanctum Seeker, Patron of the Vein, Viscera Seer e Zulaport Cutthroat.

**Atenção:** a V3 ainda não foi testada. A nota numérica de potência, se usada, deve ser tratada como hipótese comparativa, não como win rate comprovada.

### Mudanças de V2 para V3 — proposta
Entradas novas da V3: Blood Fountain, Bloodletter of Aclazotz, Bloodthirsty Conqueror, Emeritus of Woe, Enduring Tenacity, Exquisite Blood, Ingris Stingerquill e Scheming Silvertongue.

Cortes em relação à V2: Bloodghast, Stormfist Crusader, Butcher of Malakir, Bloodline Necromancer, Splinter Twin, Stromkirk Occultist, Markov Enforcer e Vampire Socialite. Cada corte tem um custo de oportunidade e pode ser revertido se o playtest demonstrar que sua função faz falta.

---

## 6. V3 — lógica das principais inclusões

| Carta | Função principal | Por que avaliar | Limitação a monitorar |
|---|---|---|---|
| **Ingris Stingerquill** | Pressão global / habilitar Strefan | Faz criaturas atacantes causarem dano a cada oponente, ajudando a habilitar o gatilho de Blood. | Precisa de criaturas atacando; não é Vampiro e pode aumentar a atenção da mesa. |
| **Emeritus of Woe** | Vampiro / tutor | Corpo relevante e acesso a efeito de tutor pela mecânica *prepared*. | Validar o texto Oracle e as condições de preparo; não assumir tutor repetido sem satisfazer o gatilho. |
| **Scheming Silvertongue** | Vampiro barato / card advantage | Evasão e vínculo com a vida; converte ganho de vida em valor de cartas sob a condição da carta. | A vantagem é condicional; medir se a condição acontece de forma consistente. |
| **Bloodletter of Aclazotz** | Multiplicador de perda de vida | Aumenta drasticamente a pressão de perda de vida no turno do controlador. | Melhor quando já existe dano/drenagem; avaliar custo e impacto em mesas com remoção. |
| **Bloodthirsty Conqueror** | Vampiro / estabilização / combo | Voador, toque mortífero e ganho de vida ligado à perda de vida dos oponentes. | Custo alto; pode atrair remoção; checar perfil de combo desejado. |
| **Enduring Tenacity** | Drenagem / resiliência / combo | Transforma ganho de vida em perda de vida e pode persistir como encantamento após morrer como criatura. | Não é Vampiro; aumenta densidade de combo e precisa de fonte de ganho de vida. |
| **Blood Fountain** | Blood / recursão | Gera Blood cedo e pode recuperar criaturas mais tarde. | A recursão é lenta/custa recursos; verificar se o modo tardio é usado na prática. |
| **Exquisite Blood** | Motor de ganho de vida / combo | Ganha vida quando oponente perde vida; forma loops com efeitos que convertem ganho de vida em perda de vida. | Custo de cinco manas, não é Vampiro, e aumenta a percepção de combo do deck. |

### Outras cartas de alto interesse na avaliação
- **Voldaren Epicure:** Vampiro de custo baixo, causa dano global e cria Blood; excelente candidato de início.
- **Blood Fountain:** já incluída na V3; monitorar seu valor real de recursão.
- **Cordial Vampire:** recompensa mortes com marcadores e ajuda a escalar o tribal.
- **Sanctum Seeker:** dano/drenagem ao atacar com Vampiros; ajuda a fechar partidas e habilitar Strefan.
- **Patron of the Vein:** remoção e crescimento de Vampiros quando criaturas oponentes morrem; custo elevado, mas múltiplas funções.
- **Viscera Seer:** outlet de sacrifício barato e seleção de topo; potencializa recursão e gatilhos de morte.
- **Zulaport Cutthroat:** transforma mortes das suas criaturas em drenagem; útil com sacrifícios e wipes.
- **Stensian Sanguinist:** watchlist; entender exatamente o gatilho de ataque e a mecânica *prepared* antes de incluí-lo.
- **Morlun, Devourer of Spiders:** watchlist condicional; X não é pago quando Strefan coloca a carta diretamente no campo, então não tratá-lo como alvo automático de alto impacto.
- **Draconic Visitor:** não priorizar por enquanto; substituir Blood Tokens por Dragões conflita com o motor principal.

A lista acima é um ponto de partida, não uma lista fechada. Em futuras avaliações, pesquisar novas edições e conferir as cartas ainda não consideradas.

---

## 7. Combos e perfil de vitória

O usuário quer potência alta, mas a linha de combo deve ser explicitada, não escondida. O deck pode buscar combate, drenagem e/ou combo compacto. A escolha do pacote de combo deve ser tratada como decisão de construção e de ambiente de jogo.

### Enduring Tenacity + Bloodthirsty Conqueror
Quando um oponente perde vida, Conqueror gera ganho de vida; Tenacity converte esse ganho em perda de vida de um oponente. Isso pode repetir o processo e encerrar a partida se não houver resposta.

### Enduring Tenacity + Exquisite Blood
A perda de vida de um oponente gera ganho de vida por Exquisite Blood; Tenacity converte esse ganho em nova perda de vida, repetindo o ciclo.

### Distinção importante
**Bloodthirsty Conqueror + Exquisite Blood não devem ser descritos como combo infinito automático por si só.** Ambos podem gerar ganho de vida a partir da perda de vida do oponente, mas é necessário um efeito que converta o ganho de vida em nova perda de vida — como Enduring Tenacity — para fechar o loop descrito.

### Regras a verificar antes de publicar análise
- Texto Oracle atual de todas as peças.
- Se o loop resulta em empate ou vitória de acordo com a situação e se há uma escolha de oponente obrigatória.
- Interação com efeitos de prevenção, substituição, ganho de vida impedido, perda de vida impedida, remoção em resposta e triggers colocados na pilha.
- Não confundir dano com perda de vida; dano normalmente resulta em perda de vida, mas os termos e modificadores importam.
- Não assumir que uma criatura colocada no campo atacando dispara “quando ataca” ou efeitos de conjuração.

---

## 8. Cortes: como decidir sem enfraquecer a identidade

Toda sugestão de corte deve responder a estas perguntas:
1. Qual função a carta exerce hoje?
2. Essa função já está coberta por outra carta? Quão redundante é?
3. A carta é útil no early, mid ou late game?
4. Depende de Strefan, Blood, mesa cheia, criaturas morrendo ou uma combinação específica?
5. O que se perde se ela sair?
6. Qual carta entra no lugar e por que é melhor **na prática**, não apenas no texto?
7. A carta tem valor estético ou temático relevante para o usuário? Isso já foi confirmado como PET LOCK?

### Candidatas históricas a reavaliar (não são cortes automáticos)
- **Helm of the Host:** investimento elevado antes de gerar valor; pode criar linhas explosivas, mas precisa justificar o custo.
- **Breath of Fury:** turnos explosivos dependentes de combate e sacrifício de criatura.
- **Westgate Regent:** ameaça forte, mas concorre com alvos de impacto imediato.
- **Belligerent Guest:** encaixe temático, mas avaliar impacto por mana.
- **Cryptolith Fragment:** ramp e pressão, mas comparar com aceleradores mais eficientes.
- **Pointed Discussion:** compra + Blood; comparar com opções multifuncionais.
- **Stormfist Crusader:** compra simétrica e perda de vida podem ajudar Strefan, mas também beneficiam oponentes.
- **Bloodghast:** recursão e corpo para sacrifício, mas pode não gerar valor suficiente sem suporte.
- **Butcher of Malakir:** payoff de sacrifício poderoso, porém caro.
- **Bloodline Necromancer:** recursão tribal útil; não cortar sem medir a densidade de recursão.

O histórico de cortes não é uma lista de cartas ruins. São comparações de custo de oportunidade para cada versão.

---

## 9. Base de mana — política e diagnóstico

A Current tem 33 cartas com função de mana segundo a contagem anterior: 29 terrenos físicos + quatro MDFCs (**Agadeem's Awakening, Bloodsoaked Insight, Fell the Profane e Sundering Eruption**). A V2/V3 projetada usa 35 cartas com função de mana, incluindo quatro MDFCs. A V3 não deve ser tratada como prova de que 35 é necessariamente o número ideal.

### Não mexer sem evidência
Durante os testes, registrar:
- land drops perdidos nos turnos 2–5;
- mãos que não conseguem produzir as duas cores;
- turnos em que Strefan poderia entrar mas faltou mana;
- MDFCs usadas como terreno vs. mágicas;
- cartas caras presas na mão;
- custo real das lands que entram viradas;
- impacto de terrenos utilitários que não geram cores em curvas críticas.

Só propor alterações depois de identificar um padrão. Qualquer proposta deve comparar **fontes totais**, **fontes pretas/vermelhas**, terrenos que entram virados, utilidade e custo de oportunidade. Não fazer uma reconstrução de mana base só para aumentar a nota teórica.

---

## 10. Protocolo de avaliação e playtest

### Fase A — Auditoria antes da lista
1. Confirmar a lista-base e a versão que será analisada.
2. Confirmar total de 100 cartas incluindo comandante, singleton e identidade de cor.
3. Conferir texto Oracle, legalidade e erratas de cartas novas ou interações críticas.
4. Classificar cada carta por função primária/secundária, curva, fase e dependências.
5. Identificar lacunas estruturais: ramp, draw, remoção, recursão, dano, tutores/wincons, sinergia tribal e Blood.
6. Procurar cartas novas ou esquecidas por pesquisa de cartas e referências de deckbuilding; não usar popularidade isoladamente como prova de qualidade.

### Fase B — Matriz de decisão por carta
Para cada carta candidata, avaliar de 1 a 5:
- sinergia direta com Strefan;
- qualidade do early game;
- valor ao entrar em campo;
- dupla função/flexibilidade;
- capacidade de recuperar após wipe;
- qualidade como topdeck no late game;
- necessidade de suporte;
- vulnerabilidade a remoção;
- contribuição para Blood;
- contribuição para fechar a partida.

A nota final deve ser explicada; não usar média mecânica como substituto do julgamento. A carta pode ser muito forte em abstrato e ruim neste deck.

### Fase C — Propostas de troca
Para cada troca, informar:
- IN e OUT;
- função principal e secundárias;
- por que a carta nova é melhor neste comandante;
- o que se perde com o corte;
- dependências e riscos;
- impacto na curva e nas categorias 8×8;
- se altera mana base ou perfil de combo;
- confiança da recomendação (alta/média/baixa).

### Fase D — Teste comparativo
Idealmente, testar Current, V2 e V3 em condições de mesa comparáveis; se isso não for viável, registrar a diferença de ambiente. Alvo inicial: 8–12 partidas por versão, quando possível.

Registrar por partida:
- mão inicial e mulligan;
- turno de Strefan;
- se houve perda de vida por oponente antes do end step relevante;
- Blood criado e Blood gasto;
- primeiro ataque de Strefan e número de ativações;
- alvos colocados em campo e impacto real;
- cartas mortas na mão;
- interação disponível no momento certo;
- capacidade de se reconstruir após wipe;
- land drops e fontes coloridas faltantes;
- como a partida foi vencida/perdida;
- reação da mesa ao combo;
- nota subjetiva de responsividade e fluidez.

### Fase E — Decisão
- **Manter:** desempenho repetível e contribuição clara.
- **Testar mais:** efeito potencialmente forte, mas amostra pequena ou dependência de situação.
- **Cortar:** falha recorrente em cumprir função ou alternativa claramente superior.
- **Proteger como PET:** somente após confirmação explícita do usuário.

Não usar uma partida isolada como prova. Uma nota de potência deve ser estimativa fundamentada até existir histórico de partidas suficiente.

---

## 11. Rubrica para potência e qualidade

Ao avaliar o deck, separar os eixos abaixo em vez de dar apenas uma nota geral:
- **Consistência:** consegue fazer algo relevante nos primeiros turnos?
- **Velocidade:** em que turno costuma começar a pressionar ou ameaçar fechar?
- **Card advantage:** consegue manter recursos sem depender de Strefan?
- **Interação:** responde a criaturas, artefatos, encantamentos e ameaças variadas?
- **Resiliência:** recupera-se de remoções e wipes?
- **Plano principal:** Blood, Strefan e Vampiros trabalham juntos?
- **Redundância:** há vários caminhos para fazer o mesmo trabalho sem excesso de cartas redundantes?
- **Condições de vitória:** consegue fechar uma partida quando está à frente?
- **Flexibilidade:** cartas têm funções úteis em diferentes estados de jogo?
- **Identidade temática:** continua sendo o deck de Strefan/Blood/Vampiros desejado pelo usuário?

Uma carta pode aumentar a velocidade e diminuir a resiliência; a análise precisa explicitar esse trade-off. “10/10” é uma meta aspiracional, não uma obrigação de incluir toda carta cara ou todo combo.

---

## 12. Estado exato da V3 proposta

A lista completa da V3 deve ser obtida da aba `14_V3 Decklist` do Dashboard. Para evitar divergências entre artefatos, essa aba é a referência de trabalho da V3 neste handover. O Dashboard atual é `Strefan_Maurer_Progenitor_Dashboard_V3.xlsx`.

### V3 — lista proposta, conforme Dashboard

- 1x Strefan, Maurer Progenitor — Commander
- 1x Agadeem's Awakening — Retained
- 1x Ancient Tomb — Retained
- 1x Anje, Maid of Dishonor — Retained
- 1x Arcane Signet — Retained
- 1x Arena of Glory — Retained
- 1x Black Market Connections — Retained
- 1x Blasphemous Act — Retained
- 1x Blazemire Verge — Retained
- 1x Blightstep Pathway — Retained
- 1x Blood Crypt — Retained
- 1x Blood Fountain — IN — V3 proposed
- 1x Bloodletter of Aclazotz — IN — V3 proposed
- 1x Bloodsoaked Insight — Retained
- 1x Bloodthirsty Conqueror — IN — V3 proposed
- 1x Bloodtithe Harvester — Retained
- 1x Bontu's Monument — Retained
- 1x Cabal Pit — Retained
- 1x Captivating Vampire — Retained
- 1x Castle Locthwain — Retained
- 1x Champion of Dusk — Retained
- 1x Chaos Warp — Retained
- 1x City of Brass — Retained
- 1x Command Tower — Retained
- 1x Cordial Vampire — IN — proposed
- 1x Creeping Bloodsucker — Retained
- 1x Demonic Tutor — Retained
- 1x Emeritus of Woe — IN — V3 proposed
- 1x Enduring Tenacity — IN — V3 proposed
- 1x Exotic Orchard — Retained
- 1x Exquisite Blood — IN — V3 proposed
- 1x Exsanguinator Cavalry — Retained
- 1x Falkenrath Forebear — Retained
- 1x Fell the Profane — Retained
- 1x Florian, Voldaren Scion — Retained
- 1x Gamble — Retained
- 1x Glass-Cast Heart — Retained
- 1x Graven Cairns — Retained
- 1x Henrika Domnathi — Retained
- 1x Herald's Horn — Retained
- 1x Ingris Stingerquill — IN — V3 proposed
- 1x Kindred Dominance — Retained
- 1x Leechridden Swamp — Retained
- 1x Lich-Knights' Conquest — Retained
- 1x Luxury Suite — Retained
- 1x Malakir Bloodwitch — Retained
- 1x Malakir Rebirth — Retained
- 1x Markov Baron — Retained
- 1x Mirkwood Bats — Retained
- 1x Moonstone Eulogist — Retained
- 1x Mount Doom — Retained
- 2x Mountain — IN — proposed
- 1x Nullpriest of Oblivion — Retained
- 1x Olivia's Attendants — Retained
- 1x Olivia's Wrath — Retained
- 1x Olivia, Crimson Bride — Retained
- 1x Oni-Cult Anvil — Retained
- 1x Patchwork Banner — Retained
- 1x Path of Ancestry — Retained
- 1x Patron of the Vein — IN — proposed
- 1x Polluted Delta — Retained
- 1x Queen's Bay Paladin — Retained
- 1x Raise the Draugr — Retained
- 1x Rakdos Signet — Retained
- 1x Raucous Theater — Retained
- 1x Reanimate — Retained
- 1x Roaming Throne — Retained
- 1x Rogue's Passage — Retained
- 1x Sanctum Seeker — IN — proposed
- 1x Scheming Silvertongue — IN — V3 proposed
- 1x Shadowblood Ridge — Retained
- 1x Shivan Gorge — Retained
- 1x Smoldering Marsh — Retained
- 1x Sol Ring — Retained
- 1x Sorin, Imperious Bloodlord — Retained
- 1x Stromkirk Captain — Retained
- 1x Sulfurous Springs — Retained
- 1x Sundering Eruption — Retained
- 5x Swamp — IN — proposed
- 1x Talisman of Indulgence — Retained
- 1x Tarrian's Journal — Retained
- 1x Toxic Deluge — Retained
- 1x Twilight Prophet — Retained
- 1x Vampiric Tutor — Retained
- 1x Vein Ripper — Retained
- 1x Verdant Catacombs — Retained
- 1x Virtue of Persistence — Retained
- 1x Viscera Seer — IN — proposed
- 1x Voldaren Bloodcaster — Retained
- 1x Voldaren Epicure — IN — proposed
- 1x Voldaren Estate — Retained
- 1x Wishclaw Talisman — Retained
- 1x Withering Torment — Retained
- 1x Wound Reflection — Retained
- 1x Zulaport Cutthroat — IN — proposed

**Importante:** status `IN — proposed` significa proposta; não indica aquisição ou teste. A presença de cartas de V2 com status de proposta continua sendo proposta.

---

## 13. Lista Current original — preservada integralmente

Abaixo está a lista-base transcrita da lista fornecida pelo usuário. Usar para comparação e nunca substituí-la pela V2/V3.

```text
1 Strefan, Maurer Progenitor (VOC) 2 *F*
1 Agadeem's Awakening (ZNR) 90
1 Alesha, Who Laughs at Fate (FDN) 115
1 Ancient Tomb (LTC) 357
1 Anje, Maid of Dishonor (VOW) 231
1 Arcane Signet (CMM) 653
1 Arena of Glory (MH3) 215 *F*
1 Belligerent Guest (VOW) 301 *F*
1 Black Market Connections (CLB) 669
1 Blasphemous Act (CLB) 780
1 Blazemire Verge (DSK) 256
1 Blightstep Pathway (SLU) 12 *F*
1 Blood Crypt (RTR) 238
1 Bloodsoaked Insight (MH3) 252
1 Bloodtithe Harvester (VOW) 310
1 Bontu's Monument (DMC) 179
1 Breath of Fury (RAV) 116
1 Cabal Pit (ODY) 315
1 Captivating Vampire (C17) 104
1 Castle Locthwain (ELD) 241
1 Champion of Dusk (VOC) 124
1 Chaos Warp (C17) 131
1 City of Brass (MMA) 221
1 Command Tower (CLB) 351
1 Creeping Bloodsucker (J22) 21
1 Cryptolith Fragment (EMN) 193
1 Demonic Tutor (CMM) 150
1 Exotic Orchard (CLB) 893
1 Exsanguinator Cavalry (MOC) 26
1 Falkenrath Forebear (VOW) 334
1 Fell the Profane (MH3) 244
1 Florian, Voldaren Scion (MID) 223
1 Gamble (SPG) 24
1 Glass-Cast Heart (VOC) 18
1 Graven Cairns (2XM) 320
1 Helm of the Host (DOM) 217
1 Henrika Domnathi (VOW) 119
1 Herald's Horn (CLB) 862
1 High-Society Hunter (FDN) 61
1 Kindred Dominance (CMM) 640
1 Leechridden Swamp (SHM) 273
1 Lich-Knights' Conquest (WOE) 96 *F*
1 Lobelia, Defender of Bag End (LTC) 27
1 Luxury Suite (CLB) 355
1 Malakir Bloodwitch (VOC) 131
1 Malakir Rebirth (ZNR) 111
1 Markov Baron (MAT) 14
1 Markov Enforcer (VOC) 26
1 Mirkwood Bats (LTR) 421
1 Moonstone Eulogist (BLC) 54
1 Mount Doom (PLTR) 258s *F*
1 Mountain (VOW) 401 *F*
1 Nullpriest of Oblivion (PZNR) 118p
1 Olivia's Attendants (VOW) 307 *F*
1 Olivia's Wrath (VOC) 20
1 Olivia, Crimson Bride (VOW) 343
1 Oni-Cult Anvil (NEO) 230
1 Patchwork Banner (BLB) 247
1 Path of Ancestry (VOC) 177
1 Pointed Discussion (VOW) 126
1 Polluted Delta (MH3) 356
1 Queen's Bay Paladin (LCI) 368
1 Raise the Draugr (KHM) 105
1 Rakdos Signet (VOC) 166
1 Raucous Theater (MKM) 329
1 Reanimate (CC2) 5
1 Roaming Throne (LCI) 344
1 Rogue's Passage (RTR) 245
1 Shadowblood Ridge (NCC) 426
1 Shivan Gorge (DMC) 232
1 Smoldering Marsh (BFZ) 247
1 Sol Ring (CM2) 217
1 Sorin, Imperious Bloodlord (PM20) 115s *F*
1 Splinter Twin (ROE) 165
1 Stromkirk Captain (VOC) 157
1 Stromkirk Occultist (VOC) 151
1 Sulfurous Springs (DMU) 256 *F*
1 Sundering Eruption (MH3) 248
4 Swamp (VOW) 400 *F*
1 Talisman of Indulgence (WHO) 252
1 Tarrian's Journal (LCI) 371
1 Terminal Agony (OTP) 55
1 Throne of the God-Pharaoh (AKH) 237
1 Toxic Deluge (MH3) 277
1 Twilight Prophet (CMM) 193
1 Vampire Socialite (MID) 249
1 Vampires' Vengeance (VOW) 339 *F*
1 Vampiric Tutor (CMR) 656
1 Vein Ripper (PMKM) 110p
1 Verdant Catacombs (MH2) 260
1 Virtue of Persistence (WOE) 281
1 Voldaren Bloodcaster (VOW) 338
1 Voldaren Estate (VOW) 403 *F*
1 Westgate Regent (PAFR) 126s *F*
1 Wishclaw Talisman (ELD) 110 *F*
1 Withering Torment (DSK) 124
1 Wound Reflection (WHO) 471
```

---

## 14. Lista V2 — referência histórica

A V2 está preservada no Dashboard, aba `08_V2 Decklist`. Conteúdo abaixo para continuidade e comparação:

- 1x Strefan, Maurer Progenitor — Commander
- 1x Agadeem's Awakening — Retained
- 1x Ancient Tomb — Retained
- 1x Anje, Maid of Dishonor — Retained
- 1x Arcane Signet — Retained
- 1x Arena of Glory — Retained
- 1x Black Market Connections — Retained
- 1x Blasphemous Act — Retained
- 1x Blazemire Verge — Retained
- 1x Blightstep Pathway — Retained
- 1x Blood Crypt — Retained
- 1x Bloodghast — IN — proposed
- 1x Bloodline Necromancer — IN — proposed
- 1x Bloodsoaked Insight — Retained
- 1x Bloodtithe Harvester — Retained
- 1x Bontu's Monument — Retained
- 1x Butcher of Malakir — IN — proposed
- 1x Cabal Pit — Retained
- 1x Captivating Vampire — Retained
- 1x Castle Locthwain — Retained
- 1x Champion of Dusk — Retained
- 1x Chaos Warp — Retained
- 1x City of Brass — Retained
- 1x Command Tower — Retained
- 1x Cordial Vampire — IN — proposed
- 1x Creeping Bloodsucker — Retained
- 1x Demonic Tutor — Retained
- 1x Exotic Orchard — Retained
- 1x Exsanguinator Cavalry — Retained
- 1x Falkenrath Forebear — Retained
- 1x Fell the Profane — Retained
- 1x Florian, Voldaren Scion — Retained
- 1x Gamble — Retained
- 1x Glass-Cast Heart — Retained
- 1x Graven Cairns — Retained
- 1x Henrika Domnathi — Retained
- 1x Herald's Horn — Retained
- 1x Kindred Dominance — Retained
- 1x Leechridden Swamp — Retained
- 1x Lich-Knights' Conquest — Retained
- 1x Luxury Suite — Retained
- 1x Malakir Bloodwitch — Retained
- 1x Malakir Rebirth — Retained
- 1x Markov Baron — Retained
- 1x Markov Enforcer — Retained
- 1x Mirkwood Bats — Retained
- 1x Moonstone Eulogist — Retained
- 1x Mount Doom — Retained
- 2x Mountain — IN — proposed
- 1x Nullpriest of Oblivion — Retained
- 1x Olivia's Attendants — Retained
- 1x Olivia's Wrath — Retained
- 1x Olivia, Crimson Bride — Retained
- 1x Oni-Cult Anvil — Retained
- 1x Patchwork Banner — Retained
- 1x Path of Ancestry — Retained
- 1x Patron of the Vein — IN — proposed
- 1x Polluted Delta — Retained
- 1x Queen's Bay Paladin — Retained
- 1x Raise the Draugr — Retained
- 1x Rakdos Signet — Retained
- 1x Raucous Theater — Retained
- 1x Reanimate — Retained
- 1x Roaming Throne — Retained
- 1x Rogue's Passage — Retained
- 1x Sanctum Seeker — IN — proposed
- 1x Shadowblood Ridge — Retained
- 1x Shivan Gorge — Retained
- 1x Smoldering Marsh — Retained
- 1x Sol Ring — Retained
- 1x Sorin, Imperious Bloodlord — Retained
- 1x Splinter Twin — Retained
- 1x Stormfist Crusader — IN — proposed
- 1x Stromkirk Captain — Retained
- 1x Stromkirk Occultist — Retained
- 1x Sulfurous Springs — Retained
- 1x Sundering Eruption — Retained
- 5x Swamp — IN — proposed
- 1x Talisman of Indulgence — Retained
- 1x Tarrian's Journal — Retained
- 1x Toxic Deluge — Retained
- 1x Twilight Prophet — Retained
- 1x Vampire Socialite — Retained
- 1x Vampiric Tutor — Retained
- 1x Vein Ripper — Retained
- 1x Verdant Catacombs — Retained
- 1x Virtue of Persistence — Retained
- 1x Viscera Seer — IN — proposed
- 1x Voldaren Bloodcaster — Retained
- 1x Voldaren Epicure — IN — proposed
- 1x Voldaren Estate — Retained
- 1x Wishclaw Talisman — Retained
- 1x Withering Torment — Retained
- 1x Wound Reflection — Retained
- 1x Zulaport Cutthroat — IN — proposed

---

## 15. Fontes de referência já usadas

- [EDH.Wiki — Strefan guide](https://edh.wiki/commanders/strefan-maurer-progenitor/)
- [MTG Master — Strefan](https://mtgmaster.app/commanders/strefan-maurer-progenitor)
- [mtg.wtf — Strefan Oracle/rulings](https://mtg.wtf/card/voc/2/Strefan-Maurer-Progenitor)
- [Ingris Stingerquill](https://magicmeta.net/cards/ingris-stingerquill)
- [Emeritus of Woe](https://mtg.wtf/card/sos/80a/Emeritus-of-Woe)
- [Scheming Silvertongue](https://mtg.wtf/card/sos/329a/Scheming-Silvertongue)
- [Stensian Sanguinist](https://mtg.wtf/card/soc/29a/Stensian-Sanguinist)
- [Bloodthirsty Conqueror](https://mtg.wtf/card/fdn/58/Bloodthirsty-Conqueror)
- [Enduring Tenacity](https://mtg.wtf/card/dsk/390/Enduring-Tenacity)
- [Blood Fountain](https://mtg.wtf/card/vow/95/Blood-Fountain)
- [Morlun, Devourer of Spiders](https://mtg.wtf/card/spm/257/Morlun-Devourer-of-Spiders)

Em futuras revisões, atualizar as fontes e priorizar texto Oracle oficial/Scryfall/Gatherer para regras, além de bases de cartas recentes. Referências de comunidade servem para descobrir ideias, não substituem a leitura das cartas.

---

## 16. Prompt mestre para iniciar uma nova análise

Copie o texto abaixo em uma nova conversa junto com este Handover e o Dashboard mais recente:

> Você é meu analista especializado em Magic: The Gathering Commander e deckbuilding de alto nível. Continue o projeto **Strefan, Maurer Progenitor — High-Power Blood Court** usando o Handover e o Dashboard anexos como fonte de continuidade.
>
> **Objetivo:** levar o deck a uma potência alta, buscando uma construção próxima de 10/10, mantendo Blood Tokens como motor central e Vampiros como subtema principal. Priorize cartas multifuncionais, consistência, responsividade, interação, resiliência e capacidade de fechar partidas.
>
> **Regras obrigatórias:** preserve a lista `Current`; mantenha versões separadas; não presuma que V2/V3 foram testadas; não altere automaticamente a mana base; não trate `*F*` como PET LOCK; não corte cartas protegidas sem confirmação; não conte cartas duas vezes na teoria 8×8; não faça swaps sem justificar IN e OUT e explicar o custo da função perdida. Não há limite de orçamento.
>
> **Processo:** primeiro confira o estado dos arquivos e identifique o que mudou desde o último handover. Se houver uma ambiguidade que afete decisões importantes, faça perguntas curtas antes de concluir. Depois audite a lista completa, verifique textos Oracle e regras, pesquise cartas sinérgicas esquecidas e lançamentos recentes, compare alternativas e produza uma proposta clara com prioridade, confiança e riscos. Separe cartas que são fortes em abstrato daquelas que realmente encaixam em Strefan.
>
> **Estrutura:** use os oito grupos Ramp, Draw, Removal, Recursão, Dano Direto, Especial (tutores + wincons), Sinergia + Pet e Blood Token. Atribua função primária e secundárias sem dupla contagem. Para cada troca, informe IN, OUT, papel, justificativa, perda, curva, dependências, risco e efeito no plano de vitória.
>
> **Artefatos finais:** atualize o Dashboard Excel e o Handover Markdown do deck, preservando histórico e listas anteriores. Não crie arquivos auxiliares sem necessidade. Termine com um resumo executivo, mudanças propostas, perguntas pendentes e um plano de teste. Nunca declare a lista 10/10 sem evidência de partidas; trate qualquer nota como hipótese até validada.

---

## 17. Checklist para fechar cada nova sessão

- [ ] Current permanece intacta.
- [ ] V2/V3 e a nova versão continuam distinguíveis.
- [ ] Lista final tem exatamente 100 cartas incluindo comandante.
- [ ] Identidade de cor e singleton foram verificados.
- [ ] MDFCs e função de mana foram contadas de forma consistente.
- [ ] Cada inclusão tem justificativa específica para Strefan.
- [ ] Cada corte explica a função perdida.
- [ ] PET LOCK foi confirmado nominalmente, sem inferir de acabamento.
- [ ] Cartas novas e combos foram checados por texto Oracle.
- [ ] A teoria 8×8 não duplica cartas na contagem total.
- [ ] Mana base só mudou com justificativa explícita.
- [ ] Combos e perfil de jogo foram documentados.
- [ ] Dashboard e Handover estão alinhados.
- [ ] Playtests e decisões reais foram atualizados.

**Fim do Handover Master V4.**
