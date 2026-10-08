# Estado do projeto (handover vivo)

Atualize este arquivo ao fim de cada sessão, com `/fechar`. Ele é a primeira leitura da sessão seguinte, com `/abrir`.

## Onde estamos

- 07/10/2026: pasta criada a partir do kit do Ritos de Sangue; Git iniciado.
- 07/10/2026: etapa 1 feita. O motor monta o painel de qualquer deck a partir de `dados/<pasta>/`. O Clavileño foi migrado sem reavaliação e o painel novo bate com o de origem em todos os números e em todas as cartas. Os testes passam: 104 verificações em cinco scripts.
- 07/10/2026: Giada migrada (Coro da Alvorada, revisão 3). Placar 429, pontos por agrupamento, tiers, relevância e fatos batem com o painel de origem. 90 verificações em quatro scripts.

## Próxima ação

`/imagens todos`

Depois, `/motor` para as asas do Coro, se o dono quiser a identidade visual completa da Giada de volta.

## Feito

- Kit do Clavileño em `contexto/origem/ritos-de-sangue-kit/`, com handover próprio. Intocado.
- Pastas `dados/02. Clavileno`, `dados/01. Giada`, `dados/01. Vito` e `dados/03. Valgavoth` iniciadas.
- Inventário inicial com os decks que aparecem nos prints do aplicativo.
- Dezenove comandos em `.claude/skills/`, com modelo e esforço declarados.
- Etapa 1: `motor/` (build, dados, Scryfall, tema, painel, fontes), contrato de um deck em `contexto/ARQUITETURA.md`, modelos em `dados/_modelo/`, testes em `testes/`.
- Clavileño no contrato: `avaliacao.json`, `comunidade.json`, `tema.json`, `HISTORICO.md`. Os dois handovers, a planilha e o HTML antigo foram para `entrada/`.
- Giada no contrato: `avaliacao.json`, `comunidade.json`, `tema.json`, `capa.webp`, `HISTORICO.md`. Material antigo (dois kits, três HTMLs, handovers, planilha) foi para `entrada/`. Conversor em `motor/importar/coro.py`.
- Painel ganhou as peças do Coro (tier list em cartas, base de mana, sinal da comunidade, potenciais, "Deixar de fora") e a aba Oficina. `contexto/PARIDADE.md` está marcado item a item.

## Pela metade

- As asas do Coro não estão no motor. A Giada usa o desenho padrão. Pedir pelo `/motor`.
- Cinco leituras da Giada ficaram mais simples que no Coro: as frases que cruzavam dois números (proteção contra ramp e compra, ramp só para Anjos, cor branca nos custos, compra só atacando) viraram leituras de um número só. Se o dono quiser as frases de volta, é `/motor` com novos tipos de leitura.
- O mapa de imagens embutidas tem o encaixe pronto e vai vazio até o `/imagens` (etapa 3).
- `contexto/inventario.csv` tem comandantes em branco e faltam decks do grupo Tribais.
- Sobraram `data.json` e `test/` dentro de `contexto/origem/ritos-de-sangue-kit/`, gravados pelo build e pelos testes antigos na etapa 0. Não estão no Git. Precisam ser apagados à mão.

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
- De 6 a 10 agrupamentos. Rosácea e desenho padrão se ajustam; as asas vão ficar presas a 8.

## Perguntas em aberto para o dono

- O que "OK", "nOK" e "OKn" significam nos nomes dos decks no aplicativo?
- O painel publicado do Clavileño (https://claude.ai/artifact/Dp4xH6CuKZowrHzW36MGH3) deve ser substituído pelo novo na mesma URL, para herdar o que está salvo na conta? Isso é da etapa 8, `/publicar`. Esta instalação do Claude Code publica artefatos.
