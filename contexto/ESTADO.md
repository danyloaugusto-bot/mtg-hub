# Estado do projeto (handover vivo)

Atualize este arquivo ao fim de cada sessão, com `/fechar`. Ele é a primeira leitura da sessão seguinte, com `/abrir`.

## Onde estamos

- 07/10/2026: pasta criada a partir do kit do Ritos de Sangue; Git iniciado.
- 07/10/2026: etapa 1 feita. O motor monta o painel de qualquer deck a partir de `dados/<pasta>/`. O Clavileño foi migrado sem reavaliação e o painel novo bate com o de origem em todos os números e em todas as cartas. Os testes passam: 104 verificações em cinco scripts.
- 07/10/2026: Giada migrada (Coro da Alvorada, revisão 3). Placar 429, pontos por agrupamento, tiers, relevância e fatos batem com o painel de origem. 90 verificações em quatro scripts.
- 08/10/2026: imagens embutidas nos dois decks. `motor/imagens.py` baixou 229 impressões (11 MB em `cache/img/`, fora do Git) e `motor/build.py` passou a embutir por padrão. Os painéis mostram as imagens sem internet, em arquivo local e publicado. Clavileño com 7,8 MB, Giada com 6,8 MB — bem abaixo do aviso de 12 MB. Testes: 198 verificações nos dois decks.
- 08/10/2026: hub feito (etapa 4), visual estante, no estilo do aplicativo. Situação OK/nOK calculada pelas trocas pendentes no radar.
- 08/10/2026: o dono criou uma pasta para cada deck e mandou capas de Markov, Ken e Assassin Creed. Inventário alinhado aos nomes das pastas (Dragões, Turtle Power!, Heads I win, K'rrik, Master Of Evil), Lobos acrescentado, e os comandantes de Markov (Edgar Markov), Assassin Creed (Ezio Auditore da Firenze) e Ken (Aisha of Sparks and Smoke, que é o nome no Scryfall do Ken, Burning Brawler) conferidos no Scryfall. Hub com 26 decks.
- 08/10/2026: hub ajustado aos comentários do dono: nomes das pastas, só os pontos no cartão, sem OK/nOK, abas Decks, Pastas e Dashboard, lista de compras e ranking retirados, botão de voltar ao hub em cada painel.
- 08/10/2026: moldura retrato virou o padrão de todos os painéis. "02. Clavileno" virou "02. Clavileño".
- 08/10/2026: o motor ganhou a seção Estratégia (início, meio e fim, e contra quem o deck vai bem ou mal), escrita para Clavileño e Giada; preço do Scryfall por carta, por faixa de relevância e do deck inteiro, com o cache renovado a cada 7 dias; `fora_do_corte` para cartas de estimação; o gráfico e a textura `fios` e a fonte Cinzel, feitos para o Valgavoth.
- 08/10/2026: Valgavoth v1.0 fechado. `/novo-deck` completo: avaliação de 100 cartas (84 notadas), radar de 15, 8 combos, estratégia, tema "Dízimo das Almas". O dono aprovou com um ajuste: o título do painel estava grande demais para a fonte Cinzel, então o motor ganhou `titulo_escala` no tema, para reduzir o título sem mexer nos outros painéis. Esclarecido ao dono: as trocas do radar são só sugestão exibida no painel — `decklist.txt` nunca muda sozinho, só por pedido explícito. Imagens embutidas (6,5 MB), testes 87/87 nos quatro scripts, hub com 3 painéis (27/27), controle de números salvo em `testes/controle/03. Valgavoth.json`.
- 08/10/2026: trava de identidade de cor no motor (o build recusa carta fora das cores do comandante; tirou a Branching Evolution do radar do Valgavoth). O leitor da decklist aceita o formato de exportação de aplicativo (`// COMMANDER`, foil como `F`), e o número da impressão vai ao Scryfall sem virar minúsculo. O Valgavoth passou a mostrar as impressões exatas do dono (Crypt Ghast DSC 368, entre outras).
- 08/10/2026: handovers de método da raiz movidos para `contexto/referencias/metodo/`, sem mudar `AVALIACAO.md` nem o handover (decisão do dono).
- 08/10/2026: Ken v1.0 fechado (`/novo-deck 04. Ken`), painel "Round Extra". Placar 375; com as 11 trocas recomendadas, 409. O motor ganhou: nome impresso (o painel mostra Ken, Ryu, Hadoken e Lórien Brooch; o nome do Scryfall fica guardado para busca e exportação), etched foil (`E`), o mesmo básico em duas linhas, gráfico "chamas", textura "impacto" e a fonte Teko. Testes: Ken 89/89, Valgavoth 87/87, Clavileño 105/105, Giada 91/91, hub 28/28 com quatro painéis.
- 08/10/2026: Humanos v1.0 fechado (`/novo-deck 02. Humanos`), painel "Catedral dos Vivos", o primeiro claro do projeto, a pedido do dono (o oposto dos decks de mortos). Placar 347; com as 10 trocas recomendadas, 385. O motor ganhou o modo claro (`"modo": "claro"` no tema), o gráfico "estandartes", a textura "brasão", a fonte Marcellus SC e o leitor da decklist passou a ignorar cabeçalhos como `COMMANDER`. Sem PetCard e sem cartas de estimação neste deck.
- 08/10/2026: Lynde v1.0 fechado (`/novo-deck 03. Lynde`), painel "Chá das Maldições". Placar 308; com as 11 trocas recomendadas, 337. O motor ganhou o gráfico "alfinetes", a textura "papel", a fonte IM Fell English SC e a tradução de mais subtipos (Curse vira Maldição). Sem PetCard e sem cartas de estimação. O dono pôs capas em mais 15 pastas; o hub tem 26 decks, 6 com painel.
- 08/10/2026: hub revisto. 25 das 26 pastas têm capa (falta a Queen). Os decks sem painel ficam acinzentados e escurecidos, para não parecerem clicáveis. Comandante e cores de 18 decks conferidos pelas cartas enviadas e no Scryfall. Heads I win: a carta enviada é Krark's Thumb, que não pode ser comandante. Revisão de padronização dos seis painéis: mesmas sete abas, mesmos botões, mesmas seções e estratégia em todos; só Giada e Clavileño têm a seção da comunidade (edh.wiki), e a Giada não tem fila de corte sugerida.
- 08/10/2026: padronização dos seis painéis, a pedido do dono. A Giada ganhou fila de corte escrita e as asas do Coro voltaram (gráfico "asas" no motor). Heads I win tem dois comandantes: Zndrsplt, Eye of Wisdom e Okaun, Eye of Chaos. Queen Marchesa conferida, com capa. Sobras da etapa 0 apagadas com autorização do dono. Com o `/potenciais` (EDHREC), Humanos, Valgavoth, Lynde e Ken ganharam a seção da comunidade e os potenciais: os seis painéis agora têm a mesma estrutura.

## Próxima ação

Escolher o próximo deck: `/novo-deck 01. Markov` ou `/novo-deck 04. Assassin Creed` (os dois têm capa e a carta do comandante soltas na pasta), ou `/novo-deck 01. Vito`. Mandar as capas dos demais. Seis decks com painel: Giada, Clavileño, Humanos, Valgavoth, Lynde e Ken.

## Feito

- Kit do Clavileño em `contexto/origem/ritos-de-sangue-kit/`, com handover próprio. Intocado.
- Pastas `dados/02. Clavileño`, `dados/01. Giada` e `dados/03. Valgavoth` com deck completo; `dados/01. Vito` iniciada.
- Inventário inicial com os decks que aparecem nos prints do aplicativo.
- Dezenove comandos em `.claude/skills/`, com modelo e esforço declarados.
- Etapa 1: `motor/` (build, dados, Scryfall, tema, painel, fontes), contrato de um deck em `contexto/ARQUITETURA.md`, modelos em `dados/_modelo/`, testes em `testes/`.
- Clavileño no contrato: `avaliacao.json`, `comunidade.json`, `tema.json`, `HISTORICO.md`. Os dois handovers, a planilha e o HTML antigo foram para `entrada/`.
- Giada no contrato: `avaliacao.json`, `comunidade.json`, `tema.json`, `capa.webp`, `HISTORICO.md`. Material antigo (dois kits, três HTMLs, handovers, planilha) foi para `entrada/`. Conversor em `motor/importar/coro.py`.
- Painel ganhou as peças do Coro (tier list em cartas, base de mana, sinal da comunidade, potenciais, "Deixar de fora") e a aba Oficina. `contexto/PARIDADE.md` está marcado item a item.
- Etapa 4: hub em `motor/hub.py` e `motor/hub/`, com atalho `Abrir o Hub.html` na raiz. 25 decks em cinco grupos, 2 com painel, lista de compras com 14 cartas (US$ 117,51). Teste em `testes/hub.py`.
- `motor/imagens.py` e `motor/build.py --imagens embutidas|externas|nenhuma`. Cache de imagens em `cache/img/<set>-<numero>.jpg`, compartilhado entre decks. Capa das cartas (frente e verso), não dos potenciais.

## Pela metade

- Cinco leituras da Giada ficaram mais simples que no Coro: as frases que cruzavam dois números (proteção contra ramp e compra, ramp só para Anjos, cor branca nos custos, compra só atacando) viraram leituras de um número só. Se o dono quiser as frases de volta, é `/motor` com novos tipos de leitura.
- O download do `art_crop` do comandante quando falta `capa.*` (em `motor/imagens.py`) não foi exercitado: os dois decks já tinham capa. Vale conferir no primeiro deck novo sem capa pronta.
- `contexto/inventario.csv` ainda tem comandantes em branco ou a confirmar (Vito, Turtle Power!, Dragões, Zumbis, Humanos, Kaalia, Goblins, Elfos, Lobos, Heads I win, Master Of Evil, Zur, Queen, Valgavoth). As cartas que o dono manda junto com a capa resolvem isso.
- `carta.*` em Markov e Assassin Creed, e os handovers e a planilha do Ken, estão soltos na raiz das pastas: o `/novo-deck` move para `entrada/`.
- Na raiz do projeto estão `Handover_Analise_de_Decks (Grok).md` e `Handover_Geral_Analise_Decks_Commander.md`, de outras IAs, sobre método, e `Handover_Analise_de_Decks.md`, cópia idêntica da versão antiga de `contexto/handover-analise-de-decks.md`. Recomendação dada ao dono em 08/10/2026: confrontar Grok e Geral uma vez com `contexto/AVALIACAO.md`, propor o que vale incorporar e mover os três para `contexto/referencias/metodo/`. Espera o "pode".

## Decisões e porquês

- Um motor, um artefato por deck, hub gerado. Ver `contexto/ARQUITETURA.md`.
- O nome da pasta do deck (`XX. Nome`) é a identidade dele e carrega o grupo.
- Análises de outras IAs entram por `entrada/` e passam pelo confronto.
- Fatos das cartas vêm do Scryfall, com cache em `cache/scryfall.json`. O Forge do kit ficou só como conferência: os dois bateram em todas as 117 cartas.
- Avaliação em JSON, com notas pelo nome do agrupamento, no lugar do `annot.py`. Mais fácil para o dono e para outras IAs; reordenar agrupamentos não embaralha as notas.
- `saidas/*.html` fica fora do Git, porque o build recria. O atalho `Abrir o painel.html` de cada deck entra.
- O build grava sempre com LF, e `.gitattributes` fixa LF. Montar no Windows ou no Mac dá o mesmo arquivo.
- O estado no navegador fica em `mtg-hub:<pasta>:v1`. O painel lê a chave antiga do deck (`chave_antiga` no tema) para não perder o que foi salvo no painel anterior.
- `tema.json` ganhou `artigo` (o ou a), para o painel escrever "na Giada" e "no Clavileño".
- Imagens embutidas por padrão no build (`--imagens embutidas`). `cache/img/` fica fora do Git, como `cache/scryfall.json`; quem clonar o projeto roda o `/imagens` antes do primeiro build com imagem.
- De 6 a 10 agrupamentos. Rosácea, fios e desenho padrão se ajustam; as asas vão ficar presas a 8.
- Moldura retrato é o padrão de todo painel (dono, 08/10/2026).
- Preço sempre do Scryfall, por carta e do deck (dono, 08/10/2026).
- Cartas nascidas na DSC no Valgavoth são candidatas a estimação: `fora_do_corte`, relevância no mínimo MÉD, nunca `sai` no radar (dono, 08/10/2026). Quais são estimação de verdade o dono marca no painel.
- Motivo gráfico de cada deck se inspira nos painéis existentes sem copiar nenhum (dono, 08/10/2026).
- Pastas de cartas ficam "em construção" no hub até o dono mandar as listas em `dados/pastas/`.

## Perguntas em aberto para o dono

- Decidido: o painel publicado do Clavileño (https://claude.ai/artifact/Dp4xH6CuKZowrHzW36MGH3) será substituído pelo novo na mesma URL, na etapa 8, `/publicar`.
- Root handovers confrontados com `contexto/AVALIACAO.md` em 08/10/2026: a maior parte já estava coberta com fraseado diferente; achei algumas adições concretas (menu de agrupamentos por arquétipo, pergunta de estresse do imposto de comandante, vocabulário de remoção/proteção, a regra de CR 707.8a sobre token-cópia transformável, perguntar o que o dono explicitamente não quer) e algumas recusas (nota 0–10 mapeada pro tier, dashboard Excel de 10 abas, watchlist paralela ao radar). O dono decidiu seguir sem nenhuma dessas alterações. Os três arquivos foram só movidos para `contexto/referencias/metodo/`, sem mudar `AVALIACAO.md` nem o handover de método.
