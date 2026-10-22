# HANDOVER MASTER V3 — SISTEMA DE ANÁLISE PROFUNDA, CONTINUIDADE E AUDITORIA ANTI-ALUCINAÇÃO
**Versão:** 3.0 — metodologia aprofundada, histórico dos decks recentes, auditoria adversarial e proteção contra perda de contexto  
**Finalidade:** transferir contexto, metodologia, decisões, organização, planos de ação e regras de continuidade para novas conversas e novos decks de Magic: The Gathering Commander.



> **ATUALIZAÇÃO V3 — LEIA ANTES DE CONTINUAR:** este documento conserva a metodologia e os perfis da V2 e acrescenta lições dos projetos recentes Kaalia of the Vast, Okaun // Zndrsplt, Wilhelt e K’rrik. As seções **19 em diante** são a camada de continuidade mais recente e prevalecem caso entrem em conflito com uma orientação anterior. Os handovers específicos de cada deck e as listas atuais continuam sendo a fonte primária para decisões carta a carta; este Master é o protocolo geral, não substitui esses arquivos.
>
> **Regra de confiança:** o fato de uma recomendação constar em uma resposta ou handover anterior não prova que está correta, que foi comprada, que foi incluída ou que foi testada. Ao retomar um deck, reabra o handover e o dashboard específicos, confira CURRENT/PROPOSED e valide regras, listas e contagens antes de continuar.

---

---

## 1. Missão do projeto

Construir e evoluir decks de Commander com análise profunda, individualizada e verificável — não apenas listar cartas populares ou fazer trocas superficiais.

O objetivo de cada análise é entender a identidade do deck, identificar seus gargalos reais, pesquisar alternativas relevantes, testar as premissas estratégicas e propor mudanças com impacto explicável. Cada interação deve gerar valor analítico concreto — não apenas uma resposta rápida, genérica ou baseada em cartas populares. Manter histórico confiável das versões é obrigatório. A meta de potência pode ser “10/10”, mas essa nota deve ser tratada como objetivo de desenvolvimento, nunca como promessa. Só partidas e evidências de funcionamento permitem validar se uma versão realmente melhorou.

O trabalho precisa equilibrar:
- **Potência e consistência:** o deck executa seu plano com frequência?
- **Identidade e diversão:** continua sendo o deck que o usuário quer jogar?
- **Eficiência de slots:** cada carta justifica ocupar uma vaga?
- **Responsividade:** consegue interagir com ameaças e mudar de plano quando necessário?
- **Resiliência:** consegue se recuperar de remoções, wipes e perda de recursos?
- **Clareza e rastreabilidade:** cada mudança tem justificativa, custo e objetivo registrados.

**Princípio central:** avaliar a carta dentro do deck e da estratégia escolhida, não apenas sua força isolada. Uma carta pode ser excelente e ainda assim ser *GOOD CARD — WRONG DECK*.

---


## 1A. Novo padrão de profundidade — aprendizado consolidado

O usuário explicitamente prefere análises mais profundas, específicas e fundamentadas em cada interação. Uma resposta curta pode ser útil para uma dúvida pontual, mas **uma análise completa de deck não pode ser apressada**. A primeira versão da análise de Lathril foi considerada rápida demais e atribuiu uma nota generosa antes de demonstrar os motivos. Esse erro não deve se repetir.

### O que significa profundidade de verdade

A profundidade não é o volume de texto isoladamente. É a qualidade das ligações demonstradas entre regras, contexto, cartas, linhas de jogo e custos de oportunidade. Uma análise profunda deve:

1. **Compreender a estratégia antes de avaliar cartas.** Descrever como o deck realmente vence, como se desenvolve, quais recursos converte e quais condições precisam estar presentes.
2. **Analisar a lista real, não só o comandante ou o arquétipo.** Verificar curva, quantidade e qualidade de fontes de mana, densidade de funções, redundância, cartas situacionais, conflitos de custo e dependências.
3. **Auditar interações concretas.** Para cada interação importante, conferir texto Oracle atual, custos, timing, condições, alvo, zonas, frequência de gatilhos e se a linha é realmente possível. Não confiar na memória quando a regra muda a avaliação.
4. **Pesquisar alternativas por função.** Pesquisar cartas populares, recentes, antigas e menos óbvias; comparar o papel e o impacto potencial delas na lista específica, sem copiar listas públicas.
5. **Provar o custo e benefício de cada troca.** Explicar o que sai, o que entra, qual gargalo a mudança procura corrigir, o que se perde e em quais cenários a troca pode ser pior.
6. **Desafiar a própria conclusão.** Procurar contraexemplos, linhas falhas, condições não atendidas, vulnerabilidades e cartas concorrentes pelo mesmo slot. Não defender uma primeira hipótese só porque já foi apresentada.
7. **Separar fatos, análise e hipóteses.** Regras oficiais e texto de carta são fatos verificáveis; a qualidade de uma inclusão é análise; ganhos esperados no desempenho são hipóteses até serem testadas.
8. **Reconhecer o que ainda não foi comprovado.** Estimativas de potência, velocidade e consistência são projeções enquanto não houver playtests registrados.

### Protocolo para cada carta relevante

Para cartas centrais, candidatas a corte, novas inclusões e interações que influenciem o plano, responder conforme a relevância:

- Qual é a função real da carta nesta lista?
- Qual é a sinergia específica com o comandante e com as peças já presentes?
- Qual é seu impacto quando estamos à frente, empatados e atrás?
- Ela funciona sozinha, exige uma combinação ou é apenas boa em cenário ideal?
- O custo de mana, as cores, a velocidade e o timing são adequados?
- Há redundância útil ou sobreposição sem valor adicional?
- Que carta ou pacote concorre com ela pelo mesmo slot?
- Que vulnerabilidade cria ou resolve?
- Qual é o principal argumento **contra** incluí-la?
- Qual evidência futura diria que a carta melhorou ou piorou o deck?

Não é necessário repetir todos esses itens com o mesmo nível para cada terreno básico ou carta trivial. A profundidade deve se concentrar onde existe uma decisão real.

### Protocolo de pesquisa externa

Para análises completas, buscar fontes externas quando puderem alterar materialmente a conclusão. A amplitude deve ser adequada ao deck e à complexidade da pergunta, não uma contagem artificial de links.

- **Texto Oracle, legalidade e regras:** priorizar Scryfall/Gatherer e fontes oficiais da Wizards of the Coast; usar Comprehensive Rules e release notes oficiais quando a interação depender de uma regra específica.
- **Benchmarks do arquétipo:** usar EDHREC, decklists públicas, guias especializados e outras referências relevantes para identificar padrões, linhas negligenciadas e diferenças de construção. Benchmark é evidência de uso ou inspiração, não prova de otimização.
- **Alternativas:** comparar opções da mesma função e faixa de custo, incluindo alternativas recentes, antigas, de nicho e cartas que não aparecem nos rankings mais populares.
- **Fontes conflitantes:** identificar a divergência, voltar ao texto oficial e explicar qual interpretação se sustenta.
- **Citações:** citar afirmações factuais relevantes derivadas de pesquisa. Deixar claro quando uma conclusão é inferência analítica própria.

Não pesquisar por pesquisar. A busca deve responder perguntas concretas, como “qual é a melhor alternativa de um mana para acelerar este deck?” ou “a interação proposta funciona exatamente como foi descrita?”.

### Matriz de benchmark — copiar o raciocínio, não a lista

Ao comparar o deck com listas otimizadas, perguntar:

1. Quais funções as listas de referência cobrem melhor?
2. Quais cartas ou pacotes aparecem com frequência, e por quê?
3. São fortes neste deck ou apenas comuns no arquétipo?
4. O que essas inclusões substituiriam na lista do usuário?
5. A melhoria esperada é em velocidade, consistência, interação, recuperação ou fechamento?
6. Qual aspecto de identidade, variedade ou diversão poderia ser perdido?
7. Há uma solução menos óbvia que atinja o mesmo objetivo sem tornar o deck genérico?

Não declarar que uma lista é “otimizada” apenas porque usa cartas caras, tutores, combos ou porque o EDHREC a rotula como tal. Definir o ambiente de comparação: casual forte, high-power casual, optimized ou cEDH, conforme a intenção do usuário e o contexto disponível.

### Auditoria adversarial antes de fechar a análise

Antes de entregar uma recomendação importante, procurar deliberadamente:

- gatilhos que não disparam como inicialmente imaginado;
- custos ou requisitos ignorados;
- criaturas que deixam de estar disponíveis por estarem viradas, removidas ou sacrificadas;
- dependência excessiva do comandante;
- linhas que parecem infinitas, mas não têm mana positivo ou repetibilidade real;
- cartas fortes no vácuo, mas que competem com funções críticas;
- adições que aumentam poder teórico e pioram curva ou mãos iniciais;
- slots flexíveis que ficaram sem decisão;
- propostas com número incorreto de cartas, duplicatas ou trocas não reconciliadas.

A entrega só está pronta quando as conclusões importantes sobrevivem a essa revisão crítica.

### O que evitar

- Não concluir que o deck está em 9/10 apenas porque tem sinergia evidente.
- Não prometer 10/10 e não usar a nota para agradar ao usuário.
- Não converter automaticamente uma lista casual em uma lista genérica de alta potência.
- Não recomendar dezenas de upgrades sem priorização ou justificativa individual.
- Não declarar que todas as sugestões precisam ser incorporadas.
- Não tratar a popularidade como substituta de análise.
- Não esconder incerteza nem compensá-la com linguagem confiante.
- Não parar a pesquisa na primeira carta forte encontrada quando a decisão é importante.

### Priorização recomendada

Separar as oportunidades em três camadas:

- **Prioridade 1 — estrutural:** corrige um gargalo comprovado ou provável de alta relevância (curva, aceleração, compra, proteção, acesso à vitória, fontes de mana).
- **Prioridade 2 — sinergia/pacote:** melhora uma interação ou cria redundância útil no plano específico.
- **Prioridade 3 — refinamento/meta:** depende do ambiente, preferência de jogo, cartas que o usuário encontra, ou resultados dos testes.

Sempre que possível, indicar também a confiança da conclusão (alta, média ou baixa) e o teste que pode confirmá-la.


## 2. Fluxo de trabalho obrigatório

### 2.1 Entrada e entendimento
Quando o usuário trouxer um deck novo ou pedir uma nova rodada:
1. Identificar comandante, identidade de cores, lista completa e objetivo estratégico.
2. Consultar o contexto anterior quando houver continuidade.
3. Fazer até **5 perguntas realmente relevantes** se existirem lacunas que possam alterar a análise.
4. Se as informações forem suficientes, não criar atrito com perguntas desnecessárias: avançar diretamente para a análise.
5. Confirmar restrições específicas: cartas obrigatórias, cartas protegidas, cartas que o usuário não gosta, combos aceitos ou evitados, meta esperado, identidade temática e estado da lista.

### 2.2 Análise
Executar uma auditoria real da lista, carta a carta e do conjunto. Em decisões relevantes, aplicar o padrão de profundidade da seção 1A e fazer uma revisão adversarial das próprias hipóteses:
- função principal e funções secundárias;
- sinergia com comandante e plano de jogo;
- curva de mana, custo real e exigência de cores;
- aceleração, compra/seleção, interação, proteção e recursão;
- criação de vantagem, pressão e condições de vitória;
- dependência do comandante;
- vulnerabilidade a remoções e wipes;
- cartas redundantes, lentas, condicionais ou abaixo do nível;
- linhas de jogo iniciais, intermediárias e finais;
- oportunidades de dupla função;
- interações e regras que possam alterar o resultado esperado;
- evidência a favor e contra as principais conclusões;
- benchmark externo que ilumine a decisão sem substituir a análise individual;
- confiança da recomendação e dados necessários para validá-la.

### 2.3 Propostas
- Preservar a lista original como **CURRENT**.
- Criar propostas separadas, sem sobrescrever silenciosamente a lista original.
- Identificar claramente cada troca **OUT → IN**, justificando os dois lados.
- Não recomendar carta apenas por ser nova, cara, popular ou temática.
- Pesquisar cartas recentes, esquecidas e alternativas funcionais quando isso puder melhorar a análise.
- Não impor limite de orçamento: avaliar pelo impacto estratégico. O usuário decide depois o que consegue comprar, trocar ou já possui.
- Não presumir que uma carta sugerida está comprada ou foi testada.
- Se houver cartas *pet*, preservar por padrão e tratar como restrições explícitas; qualquer exceção deve ser discutida e autorizada.

### 2.4 Entregáveis padrão
Quando o usuário pedir uma análise completa ou der continuidade ao fluxo de construção do deck, entregar **somente os dois artefatos principais**, salvo solicitação diferente:
1. **Dashboard Excel (.xlsx)** — controle operacional, listas, análises e playtests.
2. **Handover Markdown (.md)** — contexto estratégico, decisões, metodologia, justificativas e instruções de continuidade.

Não criar arquivos acessórios só por criar. Perguntar antes de produzir artefatos extras que não agreguem valor claro.

### 2.5 Encerramento de cada sessão
Antes de finalizar:
- validar contagem de cartas e legalidade;
- reconciliar as listas no Excel com as listas no Handover;
- atualizar histórico e decisões;
- registrar questões pendentes e próximos passos;
- indicar quais cartas são propostas e quais foram realmente testadas;
- fornecer links apenas para arquivos que foram de fato criados e cuja localização foi confirmada.

---

## 3. Modelo de organização das versões

Usar sempre estados separados:

- **CURRENT:** lista de referência enviada pelo usuário. Não alterar automaticamente.
- **PROPOSED / V2 / V3…:** versão proposta com mudanças identificadas, ainda não testada.
- **TESTED:** versão que foi efetivamente jogada e cujos resultados foram registrados.
- **REJECTED / ARCHIVE:** propostas rejeitadas ou versões antigas mantidas para histórico.

Nunca chamar uma versão de “testada” sem evidência de partidas. Nunca misturar observações de uma versão com outra sem indicar a origem.

### Registro mínimo de cada mudança
Para cada carta proposta:
- carta removida e carta adicionada;
- função da carta removida;
- funções primária e secundárias da carta adicionada;
- motivo estratégico;
- impacto esperado;
- risco ou custo da troca;
- prioridade;
- estado: sugerida, aprovada, adquirida, incluída, testada, mantida ou revertida;
- resultado observado, quando houver.

---

## 4. Teoria 8×8 e organização funcional

A estrutura de referência do projeto é:
- **35 slots de terreno/fontes de mana** como alvo inicial;
- **1 comandante**;
- **64 slots de não-terrenos**, organizados em **8 grupos funcionais de referência**, com aproximadamente 8 cartas por grupo.

A estrutura é um instrumento de diagnóstico, não uma lei rígida. Deve ser adaptada à estratégia, curva, quantidade de MDFCs, ramp, custos alternativos e perfil de jogo.

### Regras para aplicar corretamente
1. Contar a lista real antes de avaliar.
2. Separar terrenos convencionais de MDFCs e outros cards que possam funcionar como fonte de mana; explicitar o critério utilizado.
3. Não confundir “35 terrenos físicos” com “35 fontes funcionais de mana”.
4. Uma carta pode cumprir várias funções na análise, mas **não pode ser contada duas vezes no total de cartas**.
5. Os grupos podem ser ajustados ao comandante e à estratégia.
6. Identificar déficits e excessos por função; não forçar oito grupos artificiais se o deck exigir adaptações.
7. Avaliar curva e fontes coloridas, não apenas o número bruto de terrenos.

### Exemplo de grupos usados em alguns decks
Os grupos são específicos do deck, não uma taxonomia universal:
- Ramp;
- Draw/compra e seleção;
- Removal/interação;
- Recursão;
- Dano direto/drenagem;
- Especial (tutores e win conditions);
- Sinergia + Pet;
- Tema central (por exemplo, Blood Tokens).

Em outros decks, os grupos podem ser proteção, tax, buffs, tokens, combate extra, equipamentos, proliferar, sacrifício ou outros papéis pertinentes.

---

## 5. Critérios de avaliação e pontuação

Toda pontuação é uma estimativa analítica, não uma medição objetiva de taxa de vitória. Explicar o motivo da nota e evitar falsa precisão. Uma nota alta exige evidência explícita sobre consistência, eficiência e proteção; não pode ser concedida apenas porque a estratégia é coerente ou as cartas parecem fortes. Informar o contexto de comparação e distinguir a avaliação da lista atual da projeção de uma lista futura.

### Eixos de avaliação
1. **Fit estratégico:** contribui para o plano específico?
2. **Eficiência de mana:** impacto compatível com custo e cores?
3. **Consistência:** melhora a chance de executar o plano?
4. **Card advantage/seleção:** gera ou encontra recursos?
5. **Interação/responsividade:** responde a ameaças relevantes?
6. **Resiliência/recursão:** ajuda a recuperar recursos?
7. **Sinergia e redundância útil:** fortalece o motor sem excesso de cartas dependentes?
8. **Condição de vitória:** ajuda a fechar a partida?
9. **Flexibilidade/dupla função:** é útil em mais de um cenário?
10. **Custo de oportunidade:** o que deixamos de usar ao ocupar esse slot?

### Tier list
Se usada, deve ter critérios explícitos e ligados ao deck:
- **S:** peça definidora, impacto excepcional e encaixe muito alto;
- **A:** inclusão premium, consistente e de grande contribuição;
- **B:** boa carta que cumpre função importante;
- **C:** jogável, mas condicional, lenta ou substituível;
- **D:** baixo encaixe, impacto insuficiente ou forte candidata a corte.

Não classificar apenas pela força geral da carta. Uma carta temática pode ser mantida por identidade e diversão; registrar isso com transparência.

### “GOOD CARD — WRONG DECK”
Usar esta classificação quando a carta for boa isoladamente, mas:
- não ajudar o plano central;
- exigir recursos que o deck não produz;
- competir com melhores cartas no mesmo custo/função;
- ser redundante em excesso;
- funcionar apenas em cenário ideal;
- ocupar espaço necessário para interação, consistência ou fechamento.

---

## 6. Dupla função, responsividade e eficiência

Uma das prioridades recorrentes do usuário é tornar os decks mais fortes e responsivos com cartas de **dupla função**.

Procurar cartas que façam duas ou mais coisas úteis, por exemplo:
- criar recurso e causar dano;
- remover ameaça e gerar vantagem;
- ser criatura tribal e motor de compra;
- gerar fichas e servir como sacrifício;
- proteger uma peça e avançar o plano;
- interagir com o cemitério e contribuir para a vitória;
- funcionar como terreno quando necessário e como spell em outra situação.

Mas não tratar “dupla função” como qualidade automática: avaliar se as duas funções são relevantes, se a carta é eficiente e se funciona quando o deck está atrás. Flexibilidade real vale mais que texto longo sem impacto.

A responsividade deve incluir, conforme o deck:
- respostas a criaturas;
- respostas a artefatos e encantamentos;
- respostas a graveyards, combos ou permanentes problemáticas;
- proteção contra wipes;
- capacidade de continuar funcionando quando o comandante é removido;
- formas de recuperar a iniciativa após ficar atrás.

---

## 7. Pesquisa de cartas, fontes e verificação

Quando a tarefa pedir pesquisa, atualização ou busca de cartas negligenciadas/recém-lançadas:
1. Pesquisar opções recentes e antigas relevantes, não só as cartas mais populares.
2. Comparar cartas por função e contexto do deck.
3. Verificar texto Oracle, custos, tipos, identidade de cores, legalidade e interações.
4. Confirmar a data/coleção quando a novidade for parte da solicitação.
5. Separar fato de regra, análise estratégica e hipótese de playtest.
6. Citar fontes para afirmações que dependam de pesquisa externa.

### Hierarquia de fontes
- **Wizards of the Coast / Comprehensive Rules / Gatherer:** regras, texto Oracle e decisões oficiais.
- **Scryfall:** texto de carta, identidade, impressão, imagens, legalidade e busca avançada.
- **EDHREC:** padrões de inclusão e tendências agregadas; não é prova de que uma carta é correta para esta lista.
- **EDH.Wiki e guias especializados:** linhas de jogo e ideias estratégicas; avaliar criticamente.
- **Decklists públicas e discussões comunitárias:** ideias adicionais, nunca substituem a auditoria individual.
- **Análise própria:** deve ser identificada como inferência ou hipótese, não como fato oficial.

Não confiar apenas em snippets quando uma interação específica depende de detalhes de regras. Em combos, conferir cada gatilho, custo, condição e estado de jogo.

---

## 8. Combos e condições de vitória

O usuário pode aceitar combos sem querer que sejam o plano principal de todo deck. Sempre esclarecer e registrar:
- combo é central, secundário ou apenas contingência?
- o usuário gosta de vencer dessa forma?
- a linha é infinita ou apenas explosiva?
- quantas peças exige?
- as peças são úteis individualmente?
- é fácil de interromper?
- há tutores suficientes para torná-la frequente?
- a inclusão altera o perfil de potência ou a experiência de jogo?

Não incluir combos só porque são conhecidos. Apresentar a linha, explicar a execução e distinguir “combo possível” de “combo provável”. O fato de uma combinação existir não significa que o deck deva ser construído em torno dela.

---

## 9. Cartas PET, identidade temática e preferências

Cartas *pet* são parte legítima do projeto e não devem ser tratadas como erros de construção automaticamente. A preferência por identidade, arte, tema e história pode ser uma restrição explícita.

Regras:
- não inferir que toda carta foil ou marcada com `*F*` é obrigatória;
- registrar cartas protegidas somente quando o usuário indicar ou quando isso estiver explicitamente documentado;
- separar a versão **temática/pet** de uma versão **otimizada**, se isso ajudar a visualizar o custo de oportunidade;
- explicar o impacto de manter uma carta abaixo da eficiência média;
- não remover cartas protegidas silenciosamente;
- não assumir que “sem limite de orçamento” significa ignorar identidade ou diversão.

### Preferência geral
O usuário não define sucesso apenas por ganhar. O deck deve continuar reconhecível como a estratégia e experiência que ele quer jogar.

---

## 10. Perfis de decks já discutidos

Esta seção registra contexto conhecido para orientar futuras continuações. **Não substitui a lista atual de cada deck**; ao retomar um deck, confirmar a última lista/artefato e não presumir que propostas foram implementadas.

### 10.1 Ken, Burning Brawler
- Estratégia: conectar com o comandante, causar dano de comandante, equipar/proteger e aproveitar combates extras.
- Grupos já definidos: Ramp; Draw; Removal; Sinergia; Equipamento (Proteção); Equipamento (Especial); Combate extra (não-criatura); Combate extra (criatura).
- **Pet cards obrigatórias:** Lightning Bolt e Vikya, Scorching Stalwart; não considerar para cortes.
- **Regra de avaliação:** Slash the Ranks não deve ser descrita como remoção de Ken, pois seu texto preserva comandantes.

### 10.2 Humanos monobrancos (Greymond / Avacyn’s Stalwart)
- Estratégia: tribal Humans, criação de tokens e pressão de combate.
- Grupos já definidos: Ramp; Draw; Removal; Proteção; Tax; Buff; Token; Dupla função / combate.

### 10.3 Lynde, Cheerful Tormentor
- Estratégia central: curses/encantamentos de maldição; avaliar início, meio e fim de jogo.
- A análise deve definir grupos que representem o motor real do deck, não copiar grupos de outro comandante.

### 10.4 Queen Marchesa — Mardu Monarchy
- Plano: começar discretamente, estabelecer proteção e mana rocks, jogar Marchesa no meio do jogo e manter a Monarquia para vantagem de cartas.
- Os grupos devem refletir monarquia, proteção, política, remoção, recursos e fechamento conforme a lista atual.

### 10.5 Fynn the Fangbearer — monogreen infect
- Estratégia: aggro, contadores de veneno e vitória rápida.
- Grupos definidos: Ramp; Draw; Removal; Sinergia; Proteção; Buff + WinCon; Proliferar; Dupla função (2 em 1).
- Atenção ao risco de ficar sem gás após o início explosivo.

### 10.6 Vito, Thorn of the Dusk Rose — Vampiros monoblack
- Deck favorito e primeiro deck do usuário.
- Identidade: Vampiros, ganho de vida, drenagem e tema.
- O usuário prefere drenagem gradual e não quer vencer com combo como plano primário, embora possa usá-lo se for inevitável.
- Pet cards registradas: **Hatred, Exsanguinate e New Blood**.
- Exige análise profunda carta a carta, preservando a identidade e as preferências.

### 10.7 Strefan, Maurer Progenitor — Rakdos Vampires/Blood Tokens
- Estratégia: início resiliente e relativamente discreto; meio do jogo com Strefan e sinergias de Blood; fim de jogo com Vampiros grandes e possíveis combos decisivos.
- Grupos definidos: Ramp; Draw; Removal; Recursão; Dano direto; Especial (tutores + wincons); Sinergia + Pet; Blood Token.
- Pets/identidade: Dracula, artes diferenciadas e Vampiros temáticos, especialmente quando relacionados a Blood.
- Prioridades recorrentes: potência alta, mais responsividade, cartas de dupla função e avaliação de cartas novas/esquecidas.
- Não reformar a base de mana automaticamente; auditar primeiro a curva, fontes coloridas e desempenho.
- Strefan recompensa a perda de vida dos oponentes durante o turno, produz Blood no fim do turno e pode sacrificar dois Blood ao atacar para colocar um Vampiro da mão em campo atacando. Confirmar texto Oracle atual ao avaliar interações específicas.
- As listas Current, V2 e V3 são estados distintos. A V3 foi proposta; não afirmar que foi testada sem registros de partidas.


### 10.8 Lathril, Blade of the Elves — Golgari Elves
- **Identidade desejada:** tribal de Elfos forte, com geração de tokens e valor interativo, mas sem se tornar simplesmente uma versão genérica de Elfball.
- **Plano:** acelerar cedo, criar uma massa de Elfos, explorar ativações repetidas de Lathril, converter tokens em cartas/dano/pressão e fechar por drenagem ou combate.
- **Grupos escolhidos:** Ramp; Draw; Removal; WinCon; Tokens; Untap + Sinergia; Buff; Ramp2. A teoria 8×8 é flexível, e Ramp/Ramp2 têm a intenção de separar aceleração de criaturas e não-criaturas/fontes de mana.
- **Critério importante:** Lathril precisa virar a si mesma e dez outros Elfos desvirados para a habilidade de drenar. Não contar a comandante como um dos dez Elfos adicionais.
- **Interações a analisar com precisão:** Dionus, Elvish Archdruid; Seedborn Muse; Staff of Domination; Umbral Mantle; Mirkwood Bats; Skullclamp; motores de geração de tokens e mana. Confirmar cada requisito, timing e número de gatilhos pelo texto Oracle atual.
- **Estado recente:** existe um Handover específico `Handover_Lathril_Elves_V2_Deep_Review.md` e um Dashboard `Lathril_Elves_Dashboard_V2_Deep_Review.xlsx`. A V2 é proposta de pesquisa, **não testada**; a referência da sessão avaliou a lista original em 7,5/10 estrutural e a V2 em 9,0–9,2/10 projetado para Commander casual de alto poder. Essas notas são estimativas de construção, não resultados de partidas.
- **Aprendizado central dessa revisão:** a primeira análise foi rápida demais e superestimou a lista atual. A revisão aprofundada melhorou ao verificar regras, comparar benchmarks, identificar motores de consistência e explicitar o que faltava provar. Em projetos futuros, iniciar já com essa profundidade, sem repetir a primeira rodada superficial.
- **Próximo passo se o projeto Lathril for retomado:** abrir os dois artefatos mais recentes, confirmar as listas Current e Proposed e auditar contagem/legalidade e trocas antes de qualquer nova recomendação; depois testar por partidas registradas. Não assumir que as mudanças foram implementadas.


### Outros decks
Quando o usuário trouxer um deck novo, não forçar analogias com os acima. Reutilizar a metodologia, não a estratégia específica.

---

## 11. Estrutura recomendada do Dashboard Excel

O arquivo deve ser operacional, legível e consistente. Abas recomendadas (adaptar se uma aba não agregar valor):

1. **Dashboard Executivo:** resumo, comandante, plano, contagens, riscos e prioridades.
2. **Card Matrix:** lista carta a carta, categoria, funções, sinergia, avaliação, estado e observações.
3. **Tier List:** classificação e justificativa.
4. **Structural Analysis:** curva, fontes de mana, cores, distribuição funcional e lacunas.
5. **Control Panel:** decisões, restrições, metas e estado das versões.
6. **Watchlist:** cartas para pesquisar/testar, incluindo opções recentes.
7. **Upgrade Matrix:** OUT → IN, justificativa, impacto, prioridade e risco.
8. **V2/V3/Projected Decklist:** lista projetada completa e marcada.
9. **Sources & Rules:** links e referências para decisões de regras e pesquisa.
10. **Read Me / Playtest Log:** instruções, resultados de partidas e decisões posteriores.

Não é obrigatório usar exatamente dez abas. O conteúdo deve ser adequado ao projeto, sem complexidade decorativa. Se houver versões Current, V2 e V3, a distinção precisa ser inequívoca.

### Validação obrigatória do Excel
- comandante identificado uma única vez;
- contagem correta de cartas e singleton, exceto terrenos básicos;
- identidade de cores/legalidade verificadas quando aplicável;
- nenhuma carta cortada continua por engano na versão projetada;
- nenhuma carta adicionada aparece sem justificativa;
- contagem de terrenos/MDFCs documentada;
- listas do Dashboard e do Handover reconciliadas;
- fórmulas, filtros, validações e formatação condicional funcionais quando usados;
- nome e caminho do arquivo verificados antes de compartilhar.

---

## 12. Estrutura recomendada do Handover Markdown por deck

Cada handover específico deve conter:
1. identidade do deck e objetivo;
2. plano de jogo por fase;
3. preferências e restrições do usuário;
4. grupos funcionais/8×8;
5. diagnóstico da lista atual;
6. principais pontos fortes e gargalos;
7. decisões e trocas propostas;
8. cartas PET e exceções;
9. combos/regras relevantes;
10. Current e lista projetada, quando necessário;
11. fontes consultadas;
12. questões pendentes;
13. próximos passos;
14. prompt curto de retomada.

Este **Handover Master geral** é o documento que descreve o sistema inteiro. O handover específico por deck é um complemento, não substituto.

---

## 13. Plano de ação padrão para cada deck

### Fase A — Congelar e validar a referência
- [ ] Salvar a lista enviada como Current.
- [ ] Conferir quantidade total e comandante.
- [ ] Verificar legalidade e identidade de cores.
- [ ] Identificar cartas protegidas, pets e restrições.
- [ ] Registrar estratégia e nível de potência esperado.

### Fase B — Diagnosticar
- [ ] Análise carta a carta.
- [ ] Curva e fontes de mana.
- [ ] Contagem funcional e aplicação da teoria 8×8.
- [ ] Consistência do início de jogo.
- [ ] Interação e respostas.
- [ ] Vantagem de cartas e recuperação.
- [ ] Condições de vitória e redundância.
- [ ] Dependência do comandante.
- [ ] Vulnerabilidades e cartas que não se encaixam.

### Fase C — Pesquisar alternativas
- [ ] Buscar cartas novas, esquecidas e alternativas por função.
- [ ] Verificar texto Oracle, legalidade e regras.
- [ ] Comparar eficiência, custo, flexibilidade e encaixe.
- [ ] Separar sugestões premium, opções condicionais e cartas que são boas mas erradas para o deck.

### Fase D — Construir a versão projetada
- [ ] Priorizar upgrades com impacto real.
- [ ] Definir OUT → IN.
- [ ] Preservar Current e registrar a versão proposta separadamente.
- [ ] Reconciliar contagens.
- [ ] Registrar hipóteses de melhoria e riscos.
- [ ] Atualizar Dashboard e Handover.

### Fase E — Testar e aprender
- [ ] Registrar mãos iniciais e qualidade das jogadas.
- [ ] Observar se o plano principal começa no tempo esperado.
- [ ] Registrar cartas mortas, excesso de cartas caras e falta de recursos.
- [ ] Registrar interação disponível quando necessária.
- [ ] Registrar como o deck se recupera de remoções e wipes.
- [ ] Registrar como fecha a partida e se as wincons aparecem.
- [ ] Manter, ajustar ou reverter cartas com base em evidências.

### Fase F — Encerrar a sessão
- [ ] Atualizar estado de cada proposta.
- [ ] Anotar perguntas ainda abertas.
- [ ] Atualizar o histórico de decisões.
- [ ] Confirmar que o Excel e o Markdown estão alinhados.
- [ ] Informar os próximos três passos prioritários.

---

## 14. Protocolo de playtest

Para cada partida, registrar quando possível:
- comandante/deck e versão utilizada;
- número de jogadores e contexto do pod;
- posição na ordem de turno;
- resultado e duração aproximada;
- qualidade da mão inicial;
- turnos em que o plano principal foi executado;
- cartas que geraram valor significativo;
- cartas que ficaram mortas ou foram difíceis de conjurar;
- interação disponível e ameaças não respondidas;
- efeito de remoções/wipes e capacidade de reconstrução;
- condição de vitória;
- cartas novas que fizeram diferença;
- observação livre do jogador.

Evitar concluir que uma carta é boa ou ruim a partir de uma única partida. Procurar padrões em várias partidas e distinguir azar pontual de problema estrutural.

### Indicadores úteis
- frequência de mãos iniciais funcionais;
- turno médio para começar a executar o plano;
- frequência de conjuração do comandante;
- frequência com que o comandante gera valor;
- número de cartas mortas por partida;
- frequência de ficar sem cartas na mão;
- respostas disponíveis quando necessárias;
- frequência de reconstrução depois de wipe;
- frequência e qualidade de fechamento.

Não inventar estatísticas se não houver dados. O objetivo é tornar os testes mais informativos, não fabricar precisão.

---

## 15. Decisões que nunca devem ser feitas silenciosamente

- cortar uma carta PET/protegida;
- substituir a estratégia central por uma versão genérica mais competitiva;
- alterar a base de mana sem diagnóstico;
- assumir que uma carta foil é protegida;
- tratar uma lista proposta como lista atual;
- classificar uma combinação como infinita sem verificar regras;
- chamar uma versão de testada sem partidas;
- recomendar uma carta apenas por popularidade ou novidade;
- aumentar a pontuação do deck sem explicar o fundamento;
- ignorar cartas novas que possam mudar substancialmente a avaliação;
- duplicar contagens de cartas que exercem múltiplas funções;
- entregar Excel e Handover com listas divergentes.

---

## 16. Como iniciar uma nova conversa

Para iniciar um chat novo, anexar este Handover Master V2. Se continuar um deck existente, anexar também a lista atual e o handover/dashboard específicos mais recentes. O Handover Master conserva o método; os arquivos específicos preservam os detalhes da lista.

Usar este prompt de retomada:

> **CONTINUE O PROJETO DE DECKBUILDING COMMANDER — PADRÃO DE ANÁLISE PROFUNDA**
>
> Use o Handover Master V2 como regra de continuidade. Quero análises profundas, específicas e fundamentadas — não uma revisão rápida baseada em cartas populares. Antes de propor trocas, entenda a identidade e a forma real de vitória do deck, audite a lista atual e identifique seus gargalos.
>
> Pesquise quando a pesquisa puder mudar a conclusão. Confira texto Oracle, regras, custos, timing e legalidade em fontes confiáveis; compare benchmarks e alternativas por função, mas não copie listas otimizadas automaticamente. Separe fatos verificados, inferências estratégicas e hipóteses que só podem ser confirmadas em partidas. Para interações importantes, faça uma auditoria adversarial e explique os requisitos e limites da linha.
>
> Avalie cada carta pelo encaixe neste deck, incluindo a função, sinergia, eficiência, impacto quando estamos à frente/empatados/atrás, vulnerabilidades, redundância e custo de oportunidade. Apresente o argumento contra cada inclusão importante e explique o que a troca resolve e o que sacrifica. Priorize as oportunidades e não dê nota alta sem demonstrar a evidência. Não prometa 10/10; explique o contexto de comparação e a incerteza.
>
> Preserve a lista original como CURRENT e mantenha PROPOSED e TESTED separados. Não corte cartas PET ou restrições registradas sem autorização. Não há limite de orçamento, mas identidade e experiência de jogo importam. Aplique a teoria 8×8 de forma flexível. Justifique todas as trocas OUT → IN, reconcilie o total de cartas e não declare uma versão como testada sem registro de partidas.
>
> Em uma análise completa, produza os dois artefatos padrão: Dashboard Excel e Handover Markdown atualizado. Verifique que ambos contêm listas reconciliadas, decisões, cartas a testar, fontes, pendências e próximos passos. Se houver uma lacuna que altere materialmente a análise, faça até cinco perguntas curtas; caso contrário, avance sem perguntas desnecessárias.



## 17. Pendências e princípio de continuidade

Este Master consolida a metodologia e as preferências gerais conhecidas, mas não substitui:
- a lista atual de cada deck;
- os dashboards e handovers específicos mais recentes;
- decisões posteriores e explícitas do usuário;
- resultados reais de partidas;
- a verificação atualizada de texto Oracle, regras e legalidade.

Ao retomar um projeto, conferir primeiro os artefatos mais recentes e confirmar em qual estado está cada alteração. Se houver conflito entre uma hipótese antiga e uma decisão explícita posterior do usuário, prevalece a decisão mais recente do usuário. Não assumir que sugestões foram compradas, incluídas ou testadas.

**Continuidade do Lathril:** para prosseguir a partir da última análise aprofundada, anexar também `Handover_Lathril_Elves_V2_Deep_Review.md` e `Lathril_Elves_Dashboard_V2_Deep_Review.xlsx`. Esses arquivos específicos contêm a análise da lista e a proposta detalhada; este Master registra o método geral aprendido.


## 18. Regra de qualidade e continuidade — V2

A cada nova sessão, a meta não é produzir mais conteúdo, e sim uma decisão melhor. Para uma recomendação central, o leitor deve conseguir responder: **qual problema existe, qual evidência o demonstra, por que esta solução é melhor que as alternativas, que custo ela tem e como vamos descobrir se funcionou?** Se a resposta não estiver clara, a análise ainda não está pronta.

**Regra final:** análise profunda, regras verificadas, pesquisa comparativa, argumentos a favor e contra, versões rastreáveis e honestidade sobre o que ainda não foi testado.


---

## 19. Atualização V3 — princípios que prevalecem a partir de agora

Esta seção consolida aprendizados que ficaram claros ao analisar diversos decks no mesmo projeto. É uma camada de controle de qualidade: deve ser aplicada em todas as novas análises, mesmo quando a lista parece simples ou o arquétipo é conhecido.

### 19.1 O objetivo não é produzir muitas trocas; é melhorar decisões

A qualidade de uma revisão não se mede pelo número de cartas alteradas, pela quantidade de links ou pelo tamanho do texto. Mede-se por quanto a análise consegue demonstrar:

1. qual gargalo real existe;
2. que evidência da lista ou de regras sustenta esse diagnóstico;
3. por que a carta proposta resolve o problema melhor que alternativas;
4. que função, linha ou flexibilidade se perde com o corte;
5. quais são as condições e riscos de a melhoria funcionar;
6. como o resultado será observado em partidas.

Uma troca só deve entrar na versão proposta quando a cadeia de raciocínio estiver clara. É válido concluir que uma carta atual deve permanecer, mesmo sendo cara, antiga ou menos popular.

### 19.2 Separar quatro estados de conhecimento

Toda análise relevante deve distinguir, explicitamente quando necessário:

- **FATO VERIFICADO:** texto Oracle, regra, legalidade, custo, tipo de carta, contagem conferida ou informação diretamente sustentada por fonte confiável.
- **INFERÊNCIA ESTRATÉGICA:** conclusão sobre encaixe no deck, eficiência, redundância, curva, plano de jogo ou custo de oportunidade.
- **HIPÓTESE DE PLAYTEST:** melhoria provável de consistência, taxa de vitória, velocidade, resiliência ou fechamento ainda não observada em partidas.
- **DESCONHECIDO / NÃO INFORMADO:** preferência, carta PET, orçamento, ambiente real, resultado de partida ou detalhe que o usuário não forneceu.

Nunca apresentar uma inferência como se fosse regra oficial. Nunca transformar uma hipótese em um resultado. Nunca preencher uma lacuna com suposição silenciosa quando ela puder alterar a recomendação.

### 19.3 Corrigir erro explicitamente, não apenas “seguir em frente”

Se uma carta foi identificada com tipo incorreto, uma regra foi interpretada mal, um combo não funciona como descrito ou a contagem não fecha:

1. declarar qual afirmação anterior estava errada;
2. informar a correção sustentada pela fonte;
3. explicar qual recomendação é afetada;
4. atualizar o handover, o Dashboard, as listas e os totais pertinentes;
5. confirmar que não restaram referências antigas contraditórias;
6. não esconder a correção atrás de nova redação confiante.

Se a primeira resposta continha uma suposição e depois a revisão a corrigiu, o histórico deve refletir a conclusão corrigida, sem perpetuar a hipótese anterior.

### 19.4 Notas e metas “10/10”

A escala 0–10 é um instrumento comparativo de construção, não uma medida objetiva de taxa de vitória. A nota deve sempre vir com contexto de comparação e critérios explícitos. A meta é aproximar o deck de uma versão excelente **para sua estratégia**, não prometer um 10/10 absoluto.

- Não aumentar a nota da lista atual apenas porque a comandante é forte.
- Não atribuir nota quase perfeita sem provar consistência, velocidade adequada, interação, proteção, recuperação e acesso às condições de vitória.
- Não elevar a nota projetada só porque foram sugeridas cartas caras ou staples.
- Se a proposta for muito mais rápida, mas perder identidade, variedade ou resiliência, explicitar essa perda.
- A V2/V3 projetada não é “testada” até haver registros de partidas suficientes.
- Quando duas propostas recebem notas próximas, explicar qual trade-off justifica escolher uma.

---

## 20. Protocolo V3 de pesquisa e auditoria — antes de recomendar cartas

### 20.1 Congelar e contar a lista antes da opinião

Executar e registrar:

- comandante(s) e identidade de cores;
- total de cartas incluindo comandante(s), sem duplicar MDFCs;
- total de terrenos físicos e fontes funcionais de mana, declarando o critério;
- contagem de criaturas relevantes por tipo e por função quando o tipo afetar a estratégia;
- singleton, identidade de cores e legalidade Commander conforme a banlist vigente na data da análise;
- curva de mana, requisitos coloridos e fontes de mana que entram viradas;
- lista de cartas que o usuário explicitamente quer preservar;
- estado de cada carta: CURRENT, PROPOSED, comprada/incluída, testada, rejeitada ou arquivada.

Uma MDFC é uma carta física; pode ser considerada fonte funcional de mana se a face-terreno tiver relevância, mas não pode ser contada como duas cartas. Explicar se o número de “terrenos” apresentado é físico ou funcional.

### 20.2 Fonte correta para a pergunta correta

Hierarquia preferencial:

1. **Scryfall / Gatherer / Wizards / Comprehensive Rules:** texto Oracle, tipos, custos, rulings, timing, legalidade e regras.
2. **Release Notes oficiais:** interações específicas de coleções recentes e exceções de funcionamento.
3. **EDHREC, EDH.Wiki e guias de arquétipo:** benchmark de uso, pacotes e ideias; não são autoridade final de regras.
4. **Decklists públicas e comunidade:** opções e linhas a investigar, não prova de que são melhores para esta lista.
5. **Análise própria:** sempre separada dos fatos e acompanhada de riscos.

Se a pergunta envolve acontecimentos, sets, banlists, regras, produtos ou cartas recentes, pesquisar na web com data atual. Não assumir que o conhecimento histórico está atualizado. Preferir o texto Oracle atual, não apenas o texto da impressão antiga fornecida pelo usuário.

### 20.3 Auditoria adversarial de cada combo ou interação importante

Antes de dizer que uma linha funciona, verificar:

- zonas de cada carta antes e depois;
- custos exatos e quais recursos pagam cada custo;
- timing e velocidade: feitiço, instantânea, habilidade ativada ou gatilho;
- gatilhos “quando ataca”, “quando é declarado atacante”, “entra no campo”, “morre”, “sai do campo” e condições de turno;
- quem controla o objeto ou escolhe alvo;
- estado de jogo necessário, incluindo outras cartas, vida, mana, cemitério, marcadores e tipo de criatura;
- se a linha é infinita, repetível um número finito de vezes, arbitrariamente grande mas finita, ou somente explosiva;
- como o oponente pode interagir e o que acontece se uma peça sai;
- se a linha vence imediatamente, cria vantagem ou apenas aumenta a probabilidade de vitória.

“Combo possível” não significa “combo frequente”. “Gatilho de entrada” não é sinônimo de “gatilho de ataque”. Se um card entra atacando, confirmar se foi declarado atacante e se as habilidades de ataque são disparadas.

### 20.4 Não confiar só na popularidade ou na força isolada

Para cada candidata importante, registrar no mínimo:

- papel primário e secundário no deck específico;
- compatibilidade com o comandante e as linhas principais;
- impacto quando estamos à frente, empatados e atrás;
- custos e requisitos reais;
- melhor argumento a favor e melhor argumento contra;
- alternativa concorrente pelo mesmo slot;
- risco de antissinergia com cartas próprias;
- prioridade e confiança da recomendação.

A etiqueta **GOOD CARD — WRONG DECK** continua válida. Cartas que parecem excelentes mas não sustentam o plano, exigem recursos ausentes ou criam antissinergias devem ser avaliadas com rigor.

---

## 21. Arquitetura do projeto: CURRENT, PROPOSED, TESTED, REJECTED

Estas etiquetas são obrigatórias e não intercambiáveis:

- **CURRENT:** lista exata fornecida pelo usuário, congelada. Não alterar nem sobrescrever.
- **PROPOSED V2 / V3:** lista recomendada ainda não testada; mudanças enumeradas e reconciliadas.
- **TESTED:** versão que foi efetivamente jogada, com data e registros de partidas.
- **REJECTED:** proposta que o usuário ou os testes rejeitaram, com motivo.
- **ARCHIVE:** versão antiga preservada para histórico.
- **ACQUIRED / INCLUDED:** usar apenas se o usuário confirmar que adquiriu ou adicionou a carta. Uma sugestão nunca implica compra.

Cada alteração deve ficar registrada como `OUT → IN` ou como mudança isolada claramente identificada. Para cada uma, dizer: problema resolvido, função perdida, ganho pretendido, risco/custo, prioridade, confiança e evidência necessária para manter ou reverter.

Não atualizar uma lista PROPOSED por cima de uma CURRENT. Se for criada V3 baseada em V2, preservar V2 e mostrar as mudanças adicionais entre V2 e V3.

---

## 22. Aprendizados específicos das revisões recentes

Esta seção resume o estado conhecido dos quatro decks analisados recentemente. Os detalhes completos, listas e justificativas estão nos handovers específicos indicados. Os números são **estimativas de construção das revisões**, não resultados medidos.

### 22.1 Kaalia of the Vast — Mardu Angels / Demons / Dragons

**Artefatos específicos:**
- `Handover_Kaalia_of_the_Vast_V2_Deep_Review.md`
- `Kaalia_of_the_Vast_Dashboard_V2.xlsx`

**Estado registrado:** CURRENT preservada; PROPOSED V2 não testada. Nota registrada: CURRENT **5,8/10**; proposta **8,9/10**. A lista original contava 100 cartas incluindo comandante, 34 terrenos e 29 criaturas elegíveis para a habilidade de Kaalia.

**Identidade e regra central:** quando Kaalia ataca um oponente, pode colocar da mão uma carta de criatura Anjo, Demônio ou Dragão virada e atacando esse oponente. Não é qualquer carta tribal.

**Lições preservadas:**
- Criaturas colocadas já atacando não foram declaradas atacantes. Habilidades que dizem “quando esta criatura ataca” não disparam pelo simples fato de entrarem atacando.
- Velomachus Lorehold perde seu gatilho de ataque naquele combate; Varragoth não consegue usar Boast com base nesse ataque; Shadrix não recebe retroativamente o início do combate daquele turno.
- **Sower of Discord é um Demônio** e é alvo válido da Kaalia. Houve uma classificação incorreta como Horror durante a análise ao vivo; a correção foi feita. Não repetir o erro.
- O pacote de proteção/ímpeto tem tanto peso estratégico quanto a qualidade da criatura grande. Sem Kaalia conectar, cartas de payoff caras podem ficar presas na mão.
- Os artefatos da revisão propõem um conjunto grande de mudanças (incluindo alterações extensas de terrenos). Antes de implementar em bloco, auditar o pacote, validar a base de mana e considerar adoção por etapas. A nota 8,9 é uma projeção relativamente agressiva, ainda não validada em partidas.

**Próxima retomada:** abrir o handover e o Dashboard; não assumir que as 66 alterações foram aceitas. Confirmar a lista atualmente usada e priorizar testes de velocidade de Kaalia, primeira conexão, qualidade dos alvos e resiliência contra remoção.

### 22.2 Okaun, Eye of Chaos // Zndrsplt, Eye of Wisdom — Izzet coin-flip precon

**Artefatos específicos:**
- `Handover_Okaun_Zndrsplt_V2_Deep_Review.md`
- `Okaun_Zndrsplt_Dashboard_V2.xlsx`

**Estado registrado:** CURRENT preservada; PROPOSED V2 com oito trocas, não testada. Nota registrada: CURRENT **7,5/10**; proposta **8,4/10**.

**Identidade obrigatória:** preservar o sabor de precon especial e o tema de cara/coroa. O deck não deve virar uma pilha genérica de staples às custas das cartas que tornam o precon único.

**Lições preservadas:**
- Krark’s Thumb melhora a chance de cada evento de moeda desejado para 75% (supondo moedas justas e escolhendo o resultado vencedor se houver ao menos uma vitória), mas não garante vitória.
- Okaun dobra poder quando vence uma moeda em seu gatilho; Zndrsplt compra por moedas vencidas. Com os dois gatilhos “flip até perder” e Thumb, a chance teórica de obter pelo menos três vitórias somadas nas duas sequências é cerca de 73,8%, sob essas condições. Isso não é a chance de ganhar a partida; Okaun ainda precisa conectar ou o poder deve ser convertido em dano.
- **Sakashima the Impostor deve ser preservado por padrão:** ao copiar um comandante, mantém o próprio nome, relevante para a regra de lendárias e para criar redundância de habilidades.
- **Cursed Mirror deve ser avaliado como acelerador flexível e efeito de cópia temporária**, não apenas como um clone redundante.
- Frenetic Efreet + Chance Encounter é linha de vitória; Niv-Mizzet, Parun + Curiosity é um segundo plano. Frenetic Efreet, Okaun e Chandra’s Ignition podem converter um Okaun enorme em dano de mesa, mas cada linha tem requisitos e vulnerabilidades.
- Kediss espalha dano de combate causado por um comandante, mas o dano causado aos demais oponentes não é dano de comandante contra eles. Fling é dano, não dano de combate nem dano de comandante.

**Trocas finais da V2 registradas no handover:** oito mudanças, incluindo Ancient Tomb, Mana Vault, Jeska’s Will, Fling, Kediss, Deflecting Swat, Fierce Guardianship e Swan Song. O mapeamento exato está no arquivo específico.

**Próxima retomada:** confirmar se o usuário quer preservar as oito trocas, verificar a versão da lista realmente jogada e registrar partidas. Não reabrir cortes de Sakashima ou Cursed Mirror sem nova evidência/contexto.

### 22.3 Wilhelt, the Rotcleaver — Zombie tribal, tokens como segundo eixo

**Artefatos específicos:**
- `Handover_Wilhelt_Zombie_Tribal_V2_Deep_Review.md`
- `Wilhelt_Zombie_Tribal_Dashboard_V2.xlsx`

**Estado registrado:** CURRENT preservada; PROPOSED V2 com nove trocas, não testada. Nota registrada: CURRENT **7,7/10**; proposta **8,7/10**. A contagem de Zumbis do maindeck foi registrada como 26 na CURRENT e 30 na V2, excluindo Wilhelt.

**Prioridade estratégica explícita do usuário:** primeiro, uma densidade alta de Zumbis relevantes; segundo, tokens e sua conversão em compra, dano, recursão, sacrifício e fechamento. Categorias funcionais: Ramp; Draw; Removal; Recursão; Sacrifice + token; Tokens; Buff; Sinergia + WinCon.

**Lições preservadas:**
- Wilhelt cria um Zombie 2/2 decayed quando outro Zombie seu sem decayed morre. O token criado já tem decayed e não gera outro token por Wilhelt quando morre.
- A habilidade do end step permite sacrificar um Zombie para comprar, tornando tokens decayed recursos valiosos mesmo que não possam bloquear e só ataquem uma vez.
- **Gravecrawler + Phyrexian Altar + Diregraf Captain** forma um loop de conjuração/sacrifício e drenagem; Plague Belcher também serve como payoff alternativo. Preserve essas peças salvo decisão explícita de abandonar a linha.
- Rooftop Storm + Acererak pode repetir conjurações enquanto Tomb of Annihilation não for completada; Diregraf Colossus pode produzir tokens a cada conjuração se houver carta de criatura no cemitério, e Mirkwood Bats transforma entradas/saídas de tokens em perda de vida. Conferir condições antes de atribuir “infinito” ao conjunto completo.
- The Scarab God é uma inclusão de alta prioridade para produzir cópias Zombie 4/4 a partir de cemitérios e drenar/selecionar no upkeep, mas ele próprio não é um Zombie.
- Lazotep Quarry tem custo de oportunidade: a habilidade de token exige sacrificar um Deserto e só pode ser ativada como feitiço. Não tratá-lo como upgrade sem custo.
- Noxious Ghoul pode limpar criaturas pequenas não-Zombie, mas também pode matar seus próprios não-Zombies, por exemplo Mirkwood Bats e The Scarab God, após entradas repetidas. Tratar como escolha de metagame, não inclusão automática.
- Roaming Throne escolhendo Zombie pode multiplicar gatilhos de outras criaturas Zombie; não gera tokens por si só.

**Próxima retomada:** manter a tribo como primeiro eixo e tokens como segundo. Não trocar a densidade tribal por uma coleção de payoffs genéricos. Testar se a V2 realmente melhora o fluxo de tokens/compra e manter registro das linhas de combo que apareceram.

### 22.4 K’rrik, Son of Yawgmoth — mono-black life as resource / drain / reanimator

**Artefatos específicos:**
- `Handover_Krrik_Son_of_Yawgmoth_V2_Deep_Review.md`
- `Krrik_Son_of_Yawgmoth_Dashboard_V2.xlsx`

**Estado registrado:** CURRENT preservada; PROPOSED V2 com 13 trocas, não testada. Nota registrada: CURRENT **6,8/10**; proposta **8,4/10**.

**Preferências conhecidas:** o deck começou com cartas pretas e de ganho/dreno de vida que não entraram no Vito. O usuário quer maior consistência, responsividade e potencial de vitória. Os pets não foram identificados ainda. Acabamento foil/etched não é prova de que a carta seja pet e não autoriza corte nem preservação automática.

**Lições preservadas:**
- K’rrik permite pagar 2 de vida por cada símbolo {B} de um custo; não substitui mana genérica. Custos genéricos continuam exigindo mana. A vida é um recurso limitado, não mana grátis.
- O núcleo Exquisite Blood + Sanguine Bond, Vito ou Enduring Tenacity já contém linhas de vitória; mantê-las por padrão.
- Aetherflux Reservoir é uma condição de vitória e pode converter sequências de mágicas em ganho de vida e ativações de 50 pontos de vida.
- Necropotence, Bolas’s Citadel, Vilis, Broker of Blood, Sensei’s Divining Top, aceleração e reanimação foram propostas para elevar consistência. Cada uma exige auditoria de custos e riscos.
- A linha K’rrik + Aetherflux Reservoir + Leshrac’s Sigil é repetível sob condições específicas e pode crescer até tornar ativações do Reservoir acessíveis; não chamá-la de “gratuita” ou garantida. Verificar a sequência de pagamentos de vida, os gatilhos do Reservoir, vida inicial e interferência adversária.
- A proposta troca duas remoções globais por aceleração e motor de combo. Isso torna o deck mais proativo, mas pode deixá-lo menos preparado para mesas cheias de criaturas. Playtests devem testar esse trade-off.
- Propostas de criaturas como Sheoldred, the Apocalypse e Bloodletter of Aclazotz foram feitas por função. Confirmar preço de oportunidade, curva e se a lista realmente quer priorizar drain/combo sobre outras cartas atuais.

**Próxima retomada:** antes de tratar os 13 cortes como definitivos, obter a lista de pets quando o usuário estiver pronto para fornecê-la; até lá, não presumir quais cartas são protegidas. Revalidar linhas de combo, total de cartas e o equilíbrio entre remoções, compra, fast mana e consumo de vida.

---

## 23. Registo de correções e alertas anti-repetição

Este registo existe para impedir que erros preliminares voltem a aparecer em novas conversas.

| Tema | Erro/risco identificado | Conclusão correta e ação preventiva |
|---|---|---|
| Kaalia — Sower of Discord | Foi temporariamente descrita incorretamente como Horror. | É um Demônio e é elegível para Kaalia. Confirmar tipo Oracle antes de classificar alvos do comandante. |
| Kaalia — trigger “when attacks” | Risco de assumir que uma criatura colocada atacando desencadeia habilidade de ataque. | Colocada já atacando não foi declarada atacante; verificar a regra e a redação individual. |
| Okaun — Sakashima | Foi considerada como possível corte numa fase preliminar. | A conclusão foi revertida: preservar como cópia relevante que mantém o próprio nome. Conferir a linha final no handover específico. |
| Okaun — Cursed Mirror | Foi considerada redundante numa hipótese preliminar. | A decisão final preserva Cursed Mirror pela função dupla de mana e cópia temporária; Champion’s Helm foi o corte para Fierce Guardianship na proposta final. |
| Wilhelt — Noxious Ghoul | Risco de supervalorizar a limpeza tribal sem avaliar seus próprios não-Zombies. | Pode matar peças próprias não-Zombie após entradas repetidas. É condicional ao metagame. |
| Wilhelt — tokens decayed | Risco de achar que a morte do token decayed gera outro token via Wilhelt. | Não: Wilhelt verifica se o Zombie que morreu não tinha decayed. O token ainda é útil para sacrificar/atacar/comprar. |
| K’rrik — pagar vida | Risco de descrever os símbolos pretos como se substituíssem o custo completo. | K’rrik substitui cada {B}, não a mana genérica. Sempre calcular o custo completo. |
| Pontuações projetadas | Risco de apresentar notas como resultados comprovados. | Todas as notas CURRENT/V2 aqui registradas são estimativas estruturais sem playtest documentado. |
| Acabamentos foil/etched | Risco de inferir preferência PET a partir de acabamento. | Não inferir pet cards por acabamento ou preço. Perguntar/registrar apenas quando o usuário informar ou quando isso for realmente necessário. |
| Artefatos e listas | Risco de assumir que sugestões foram compradas, aplicadas ou testadas. | CURRENT é congelada; PROPOSED permanece hipótese. Só mudar estado por confirmação explícita ou registro de playtest. |

Quando se encontrar um novo erro, acrescentá-lo nesta tabela com a correção e atualizar todos os locais relevantes. Não manter uma interpretação antiga somente porque já aparece em um arquivo.

---

## 24. Novos padrões de entrega — o que torna a análise útil

### 24.1 Ordem recomendada para uma análise completa

1. **Nota inicial da CURRENT**, com justificativa e formato de comparação.
2. **Identidade/plano real:** como o deck gera recursos, avança e vence.
3. **Auditoria factual:** contagem, curva, terrenos/fontes, custos, tipos e legalidade.
4. **Diagnóstico por gargalo:** não começar por lista de cartas populares.
5. **Combos/interações existentes:** preservar os que são reais e coerentes com o plano; auditar cada um.
6. **Alternativas pesquisadas:** antigos, novos, especializados e menos óbvios.
7. **Tabela OUT → IN:** justificar os dois lados, riscos e prioridade.
8. **Oito grupos do usuário**, usando o esquema fornecido em vez de inventar categorias novas sem motivo.
9. **Lista PROPOSED completa**, validada e reconciliada com as trocas.
10. **Nota projetada ao final**, com limitações, hipóteses e testes de validação.
11. **Dashboard Excel e Handover Markdown** quando o pedido for análise completa e os arquivos forem solicitados ou fizerem parte do padrão de continuidade.

### 24.2 Evitar as duas falhas opostas

- **Não ser superficial:** não produzir uma análise rápida, baseada só em staples, notas generosas e poucos argumentos.
- **Não compensar superficialidade com volume:** dezenas de trocas, tabelas e muitas cartas novas não significam profundidade. Uma recomendação pode melhorar quando reduz o número de mudanças e aprofunda a justificativa.

O alvo é uma decisão defensável, não o maior número de páginas nem a maior quantidade de upgrades.

### 24.3 Priorizar por camadas

- **P1 — estrutura:** corrige consistência, velocidade, mana, compra, proteção, acesso à vitória ou interação essencial.
- **P2 — pacote/sinergia:** cria redundância útil, motor de valor ou converte melhor o plano principal.
- **P3 — meta/estilo:** depende do pod, de preferências pessoais, de pets, de estilo de jogo ou de observações reais.

Quando possível, apresentar uma versão de mudanças pequenas e uma versão ampliada apenas se ambas forem úteis e o custo de escolha compensar a complexidade. Não forçar uma proposta de 20+ mudanças se oito melhorias mais claras puderem ser testadas primeiro.

---

## 25. Contrato de qualidade dos artefatos

### 25.1 Handover Markdown

O handover específico deve conter, conforme a relevância:
- comandante e identidade;
- nota CURRENT e nota projetada, sempre identificadas como estimativas;
- data da revisão e status de cada versão;
- plano Begin/Middle/End;
- preferências e restrições explícitas;
- oito grupos escolhidos pelo usuário;
- contagem de cartas/terrenos/fontes;
- regras e combos auditados;
- pontos fortes, gargalos e antissinergias;
- tabela completa de trocas, riscos, prioridades e confiança;
- lista CURRENT e PROPOSED completas se fizerem parte do entregável;
- fontes verificáveis;
- playtest log ou campos para preenchê-lo;
- itens não resolvidos e prompt para retomar em outro chat.

### 25.2 Dashboard Excel

O arquivo precisa ajudar a tomar decisões, não ser apenas decorativo. Incluir abas apropriadas entre:
- Dashboard Executivo;
- Current List;
- Proposed Decklist;
- Card Matrix;
- Upgrade Matrix;
- Groups / teoria 8×8;
- Tier List;
- Structural Audit;
- Sources & Rules;
- Playtest Log;
- decisões, pets ou watchlist quando houver valor real.

**Validação obrigatória antes de linkar:**
- arquivo existe no caminho exato;
- abas abrem e fórmulas essenciais estão presentes;
- CURRENT e PROPOSED têm o total correto;
- número de OUT é igual a número de IN, exceto quando a alteração justificada for de estrutura diferente;
- nenhuma carta cortada permanece na V2 por erro;
- nenhuma carta nova foi esquecida na lista proposta;
- tipos, contagens, fontes de mana e terrenos estão explicados;
- nomes de arquivo e versão batem entre Excel e handover;
- não alegar que fórmulas ou dados foram validados sem ter inspecionado o arquivo.

Se não for possível validar uma dimensão, dizer qual dimensão ficou sem validação. Link de download só pode ser fornecido para arquivo criado e existente no caminho exato.

---

## 26. Histórico dos quatro decks recentes — estado consolidado

| Deck | CURRENT | PROPOSED | Mudanças registradas | Playtest | Estado dos artefatos |
|---|---:|---:|---:|---|---|
| Kaalia of the Vast | 5,8/10 | 8,9/10 | 66 alterações registradas na proposta, muitas relacionadas à base de mana; requer revisão cuidadosa por etapas. | Não informado / nenhum registrado no handover. | Handover + Dashboard específicos. |
| Okaun // Zndrsplt | 7,5/10 | 8,4/10 | 8 trocas; preservar identidade especial do precon e núcleo de moedas. | Não testado. | Handover + Dashboard específicos. |
| Wilhelt, the Rotcleaver | 7,7/10 | 8,7/10 | 9 trocas; prioridade Zombies, tokens como eixo secundário. | Não testado. | Handover + Dashboard específicos. |
| K’rrik, Son of Yawgmoth | 6,8/10 | 8,4/10 | 13 trocas; compra explosiva, aceleração, reanimação e drain. | Não testado. | Handover + Dashboard específicos. |

**Atenção:** as notas e mudanças nessa tabela espelham as propostas registradas nos handovers específicos. Não são uma aprovação definitiva de cada OUT → IN. Ao retomar um desses decks, primeiro abra os arquivos específicos e reavalie decisões importantes com as lições V3. Não assumir que o usuário já implementou qualquer proposta.

---

## 27. Preferências gerais consolidadas do usuário

- Quer **análise profunda, criteriosa e individualizada**, e explicitou insatisfação com análises rápidas e notas altas sem evidência.
- Quer caminhar para a melhor versão possível, “próxima do 10/10”, mas isso deve ser traduzido em melhora verificável e não em promessa.
- Não há limite de orçamento para sugerir cartas, salvo indicação posterior; a decisão de comprar/incluir continua sendo do usuário.
- Fontes e época da carta não são critérios para descartar uma opção. Pesquisar velhas, recentes e opções de nicho quando isso puder alterar a conclusão.
- A identidade e a beleza/tema do deck importam, especialmente em precons especiais e estratégias tribais. Potência não significa transformar todos os decks numa pilha genérica de staples.
- Foil/etched/raridade/preço não definem automaticamente uma carta PET.
- Não fazer perguntas já respondidas. Só perguntar por informação ausente se ela puder alterar materialmente a estratégia; se for possível avançar com uma hipótese explícita e razoável, avançar.
- Quando o usuário tiver dado grupos funcionais, manter esses nomes e preencher com critério; não substituir por categorias genéricas por conveniência.
- Em análises completas, abrir pela nota CURRENT e encerrar com a nota projetada e a ressalva de que a V2 não foi testada.
- Entregar como padrão os dois artefatos do projeto Commander — Dashboard Excel e Handover Markdown — quando for uma análise completa. Para um pedido explicitamente limitado a handover, criar apenas o handover solicitado.

---

## 28. Prompt master para qualquer novo chat de Commander

Copie este texto ao iniciar uma nova conversa e anexe este Master V3, mais o handover específico e o Dashboard da lista que deseja analisar:

> **CONTINUE O PROJETO COMMANDER — HANDOVER MASTER V3, PADRÃO DE ANÁLISE PROFUNDA E ANTI-ALUCINAÇÃO**
>
> Use o Handover Master V3 como protocolo de trabalho. Leia também o handover específico e o Dashboard do deck anexado. Primeiro confirme a versão atual realmente usada; preserve CURRENT e mantenha cada PROPOSED/TESTED separada. Não presuma que sugestões antigas foram compradas, adicionadas ou testadas.
>
> Quero a análise mais precisa, útil e aprofundada possível, buscando uma versão excelente e cada vez mais próxima de 10/10 para a identidade do deck. Não atribua nota alta sem demonstrar os fundamentos e não prometa 10/10. Todas as notas são estimativas até que existam playtests suficientes.
>
> Antes de sugerir cartas, conte a lista e audite mana, curva, fontes coloridas, legalidade Commander, custos, tipos, funções, redundâncias e antissinergias. Pesquise texto Oracle atual, Comprehensive Rules, rulings e release notes oficiais quando as regras importarem. Use EDHREC, EDH.Wiki e listas públicas como benchmark, nunca como substitutos da análise individual.
>
> Para cada combo ou interação relevante, verifique custos, timing, zonas, condições, triggers, fontes de mana/vida, dependências e formas de interrupção. Diferencie fato verificado, inferência e hipótese de playtest. Se descobrir erro numa resposta ou arquivo anterior, corrija explicitamente a conclusão, explique o impacto e atualize a lista, o Dashboard e o Handover; não perpetue a versão errada.
>
> Avalie as cartas pela função nesta lista. Para toda troca importante, explique por que entra, por que sai, o que se perde, o ganho esperado, o principal argumento contra, a prioridade e como o teste poderá confirmar ou refutar a hipótese. Não corte pets ou cartas protegidas sem autorização; não inferir pets por acabamento. Não altere a base de mana automaticamente sem diagnóstico.
>
> Preserve as categorias funcionais indicadas pelo usuário e aplique a teoria 8×8 flexivelmente. Antes de entregar, reconcilie as 100 cartas, os terrenos/fontes, os OUT/IN e a consistência entre os artefatos. Se não foi possível verificar um dado, diga isso claramente. Para análise completa, produza Dashboard Excel e Handover Markdown; se o pedido for somente um handover, crie apenas esse arquivo.
>
> Em análises completas, comece com a nota CURRENT e finalize com a nota projetada. Termine com os próximos testes e as perguntas ainda realmente abertas, sem tratar nenhuma projeção como resultado de partida.

---

## 29. Checklist anti-alucinação antes de finalizar qualquer análise

- [ ] Usei a lista enviada ou os arquivos específicos corretos — não uma lista lembrada de outra conversa.
- [ ] Contei as cartas antes de analisar e reconferi o total depois das trocas.
- [ ] Verifiquei o texto Oracle atualizado de cartas que afetam a conclusão.
- [ ] Se uma regra específica é importante, confirmei Comprehensive Rules/rulings oficiais.
- [ ] Confirmei a tipagem das criaturas relevantes e requisitos de tribo.
- [ ] Verifiquei custos e timing reais para cada interação importante.
- [ ] Separei fatos de opinião e hipóteses.
- [ ] Identifiquei ao menos um risco ou argumento contra cada upgrade de alta prioridade.
- [ ] Não atribuí às cartas função que elas não cumprem, nem contei uma carta duas vezes.
- [ ] Não contei uma MDFC como duas cartas.
- [ ] Não inferi pet cards por foil/etched/raridade/preço.
- [ ] Não removi cartas protegidas nem alterei a identidade do deck silenciosamente.
- [ ] Registrei todas as trocas OUT → IN e reconciliei o número de cartas.
- [ ] Marquei claramente CURRENT, PROPOSED, TESTED, REJECTED e ACQUIRED/INCLUDED.
- [ ] Não chamei uma linha de infinita sem provar repetibilidade e recurso positivo/recursivo.
- [ ] Não chamei a V2 de testada nem a nota de taxa de vitória.
- [ ] Se encontrei uma correção, removi a formulação errada dos pontos de conclusão relevantes.
- [ ] Os arquivos e links apontam para caminhos realmente criados e conferidos.

---

## 30. Regra final V3

O próximo passo de cada conversa deve ser **mais confiável e mais útil que o anterior**, e não apenas mais comprido. Para cada recomendação central, o usuário deve conseguir responder:

1. Que problema concreto estamos tentando resolver?
2. Que evidência mostra que o problema existe?
3. Por que essa opção supera as alternativas relevantes neste deck?
4. O que a troca sacrifica ou torna pior?
5. Quais condições a tornam boa ou ruim?
6. Como vamos medir se deu certo em partidas?

Se essas respostas não estiverem claras, a análise não está pronta. A meta “10/10” significa perseguir decisões melhor fundamentadas, coerência temática, consistência e aprendizado entre versões — com **honestidade sobre limites, correções explícitas e continuidade real entre chats**.
