# Pedido para o Claude Code: a página Consulta (22/10/2026)

Cole a partir da linha "Leia", no Claude Code, em `C:\Projetos\mtg-hub`, com o motor livre. Modelo forte (`/model opus`): há julgamento de carta e uma arquitetura nova que a Caixa e o Grimório vão reaproveitar. Antes, instale o comando que já está pronto: `New-Item -ItemType Directory .claude\skills\consulta -Force; Copy-Item contexto\consulta\SKILL-consulta.md .claude\skills\consulta\SKILL.md`.

---

Leia `CLAUDE.md`, `contexto/ESTADO.md` (só "Próxima ação"), `contexto/consulta/CONSULTA.md` (o desenho e o motivo de não ser uma aba de painel), `motor/consulta.py` e `testes/consulta.py` (prontos e verdes: 34 de 34), `dados/consultas/Salt Vampire.json` (a primeira consulta, o dado real para o protótipo), `contexto/pontuacao/RUBRICA.md`, `motor/caixa.json` (a régua), `contexto/grimorio/METODO-GRIMORIO.md` (a página irmã) e `contexto/visual/GUIA-VISUAL.md`. Este trabalho **não muda os dez critérios, os pesos, o placar, as decklists nem o radar** de nenhum deck sem o "pode" do dono.

## O que o dono pediu

Um lugar onde ele cola o link de uma carta e recebe o estudo completo: primeiro a parte escrita (o que a carta faz de verdade, fortalezas, fraquezas e uma nota "no vácuo", a força dela sozinha); abaixo, bonito e ordenado, se compensa pôr em algum deck e com que efeito (sinergia, valor, ganho, quem sai, veredito), como a análise da Salt Vampire de 22/10.

## As três decisões de arquitetura

1. **É uma página própria, `saidas/00. Consulta.html`, com pílula no hub ao lado do Grimório**, não uma aba dentro de cada painel. Uma carta contra todos os decks é assunto do hub (como a Caixa e o Grimório); a aba de painel olha para dentro de um deck só. Cada painel ganha só um link na Oficina: "Consultar uma carta de fora".
2. **Três modos, do mais confiável ao mais prático, e a página diz em qual está:**
   - **Registrada (sempre, inclusive sem internet):** o estudo gravado pelo `/consulta` em `dados/consultas/`, embutido no build. É a fonte da verdade: o Claude do Code viu o projeto inteiro, e o dono deu o "pode".
   - **Ao vivo (página publicada no claude.ai, dono logado):** para carta ainda não registrada, a página pede o estudo ao Claude pela capacidade `sample` do artefato, com a RUBRICA, as réguas de sinergia dos 30 decks e os números de saturação embutidos. O julgamento continua sendo do Claude, com o porquê escrito; a conta (valor, ganho, faixa) é a da página, igual à do `encaixe.py`. O resultado fica marcado **"ao vivo, não registrado"**, vai para o `db` do artefato e o `/consulta` o importa depois (como o `/caixa aplicar` importa as decisões).
   - **Arquivo local sem Claude:** a página busca a carta no Scryfall (o arquivo local pode chamar `api.scryfall.com`; o artefato publicado não), mostra a ficha, o valor próprio se a carta tiver cadastro e o piso do encaixe, e oferece o comando `/consulta <link>` com botão de copiar. Nunca inventa nota nem sinergia.
3. **Texto da carta nunca de memória.** Fonte por modo: arquivo local, `fetch` direto no Scryfall; página publicada no app Claude, `mcp` com `host:claude_browser` lendo o JSON de `api.scryfall.com/cards/<set>/<num>` (`get_page_text`); sem o app, um campo "cole o texto da carta como está no Scryfall" que o viewer preenche. Sem texto, a página não pede estudo ao Claude.

## O estudo: o que a página mostra, de cima para baixo

1. **Cabeça:** campo do link (aceita link de carta do Scryfall, busca com uma carta só, ou nome em inglês; o mesmo `ler_pedido` do `consulta.py`), o modo em que a página está, e a data do registro quando houver.
2. **A carta:** imagem (cache, como nos painéis), custo, tipo, identidade, texto oficial, coleção e lançamento. Aviso de pré-lançamento, de banida e de não legal. **Sem preço** (a Caixa continua a única página com preço; o preço fica no registro e no relatório do Code).
3. **Parte escrita (o estudo):** quatro blocos de texto corrido, curtos:
   - *O que faz de verdade*: a leitura do texto, incluindo o que ele não faz (a Salt Vampire: "o oponente compra outra; não é vantagem de carta").
   - *Fortalezas* e *Fraquezas*: três a cinco frases cada, cada uma ancorada num trecho do texto da carta.
   - *No vácuo*: o grau, o valor próprio e o porquê.
4. **Nota no vácuo (régua, nenhum número no código; `motor/consulta.json`):** o grau sai da régua da Caixa, para não criar uma segunda escala:

   | Grau | Quando |
   |---|---|
   | S | Game Changer, ou `edhrec_rank` até `staple_rank_max` (500) |
   | A | valor próprio a partir de `forte_valor_min` (12) |
   | B | valor próprio a partir de `bundles_valor_min` (7), ou `edhrec_rank` até `bundles_rank_max` (3000) |
   | C | valor próprio a partir da mediana do cadastro |
   | D | abaixo da mediana |

   Mostre o valor próprio como barra contra a mediana e o percentil no cadastro, e as oito notas da carta com o `por_que`. O Claude escreve o porquê do grau; a régua dá o grau. Carta sem cadastro: sem grau, com o aviso "cadastro pela RUBRICA primeiro" (no modo ao vivo, o Claude dá as oito notas e a página marca `cad_auto`, como a Caixa).
5. **Nos decks (a parte bonita):** cartões, um por deck nas cores da carta, **agrupados em cinco blocos nesta ordem** e, dentro do bloco, pelo ganho:
   - **Entra** (veredito entra), **Avaliar** (veredito avaliar), **Fica de fora, com sinergia** (nota acima de 0 em alguma sinergia), **Sem ligação** (0 e 0, numa linha compacta por deck), **Fora das cores** (só os nomes).
   - Cada cartão: capa e nome do painel, comandante, as duas sinergias em pílula (nota e nome da sinergia; o porquê abre ao toque), valor e **barra de ganho com as duas marcas da régua** (5 Guardar, 10 Deck), quem sai na prática (a comparável) e quem sai pelo motor, tier estimado, situação (já no deck, no radar, Desejo, precon intacto) e o veredito com o porquê. Os quatro critérios em que a carta cobre um buraco do deck (`cobre`) aparecem como selo.
   - Ordenação alternativa no topo do bloco: ganho, valor, nome do deck, grupo (01 a 05).
6. **Armadilhas:** o que parece sinergia e não é, uma linha por deck em que isso aconteceu (vem do estudo).
7. **Compra:** a ação (comprar, esperar, só se sobrar, não) e o porquê. Sem o número do preço.
8. **Rodapé:** o comando `/consulta <link>` com copiar (em todo modo), e, no modo ao vivo, o aviso de que o registro oficial é o do Code.
9. **Lista das consultas registradas** (sub-aba `#registradas`): galeria com a carta, a data, o grau no vácuo, o melhor deck e a compra; clique abre o estudo.

Protótipo antes do código (regra 6 do handover): `contexto/consulta/prototipo/consulta-prototipo.html`, estático, com a Salt Vampire, nas duas larguras (1360 e 375), com o mesmo `tema.paleta` e as fontes do hub (Alegreya Sans no texto, Cinzel só em título). **Pare e mostre** antes da Fase 1.

## Fase 1: registro e página (sem rede nenhuma na página)

1. **O registro ganha o estudo.** Em `dados/consultas/<carta>.json`, cada consulta do dia ganha `estudo`: `{"leitura": "...", "forcas": [...], "fraquezas": [...], "vacuo": {"grau": "S|A|B|C|D", "porque": "..."}, "armadilhas": {pasta: "..."}}`. `motor/consulta.py --vereditos` passa a exigir o bloco (grau pela régua, conferido pelo script; `porque` obrigatório; três a cinco frases em cada lista; recusa o que faltar). `--dossie` ganha a régua do vácuo e o `grau` já calculado, para o Claude só escrever o porquê. Refaça a Salt Vampire por esse caminho (o estudo dela está na resposta do app de 22/10: a leitura, as armadilhas e a compra; as fortalezas e fraquezas o Claude escreve agora, pelo texto do Scryfall).
2. **`motor/consulta.json`:** a régua do vácuo (os cinco graus apontando para as chaves de `motor/caixa.json`), os limites de texto, e `imagem_largura`/`imagem_qualidade` como no Grimório.
3. **`motor/consulta.py --montar`:** junta, para a página, os registros de `dados/consultas/`, a ficha e a imagem de cada carta (cache), os dados que o modo ao vivo precisa embutidos: a RUBRICA compacta (os dez critérios, a tabela de calibração, as regras do dono), as duas sinergias de cada deck com a régua (`tema.json`), por deck a saturação (`encaixe.contexto`: `mult` e `ncrit`), a carta que sai pelo motor por lado (`sai`), as mais fracas, as comparáveis por faixa de custo e tipo, o comandante e a identidade; e a régua (`pontuacao.json`, `caixa.json`, `consulta.json`). Isso é o `consulta-dados` que o `app.js` lê. Meça: deve ficar bem abaixo de 1 MB sem as imagens.
4. **`motor/consulta/{template.html, style.css, app.js}`** e `python motor/build.py --consulta` gravando `saidas/00. Consulta.html` e `Abrir a Consulta.html` na raiz; `--todos` monta antes do hub. `app.js` tem a conta do encaixe em JavaScript, **a mesma** do `encaixe.py` (valor = soma de peso × pontos da nota; com saturação; ganho = valor com saturação − valor de quem sai; faixa pela régua da Caixa), e o teste prova que bate.
5. **Hub:** pílula `Consulta` à direita do Grimório, mesmo mecanismo de link (local e publicado por `dados/consultas/link.txt`). Oficina de cada painel: a linha "Consultar uma carta de fora", link para `00. Consulta.html`.
6. **Testes:** `testes/consulta.py` cresce (o estudo no registro, as recusas novas, a conta em JS da página contra `encaixe.ganho` para a Salt Vampire nos 19 decks, nenhum preço no HTML, nenhuma carta sem texto do Scryfall); `testes/layout.py --consulta` em 1360 e 375 px (sem rolagem horizontal, os cinco blocos na ordem, cartões com 3 e 1 colunas, nenhum texto abaixo de 13 px); `testes/hub.py` com a pílula. `contexto/ARQUITETURA.md`, seção "A Consulta".

**Pare e mostre** a página com a Salt Vampire nas duas larguras e a barra do hub.

## Fase 2: ao vivo (página publicada)

1. **Publicação com capacidades**, só com o "pode publicar" do dono: `capabilities: {sample: {}, db: {}, user: {}, mcp: {servers: [{server: "host:claude_browser", tools: ["get_page_text"]}]}}`. Regras do `db`: `consultas` lida por todos, escrita só pelo dono (`write: "owner"`). Link em `dados/consultas/link.txt`. Leia a skill `artifact-capabilities` do app antes de escrever o `app.js` desta fase: `claude.use("sample")`, `claude.use("db")` e `claude.use("mcp")` resolvem `null` quando não há o viewer, e a página tem de funcionar inteira sem eles (é o modo registrada).
2. **Buscar a carta:** no arquivo local, `fetch` em `api.scryfall.com/cards/<set>/<num>` (ou `named?fuzzy=`), com `User-Agent` impossível no navegador, então só o `Accept`; no publicado, `host:claude_browser` → `get_page_text` na mesma URL e `JSON.parse`; sem os dois, o campo de colar o texto. Guarde só `name, mana_cost, cmc, type_line, oracle_text, color_identity, set, collector_number, released_at, legalities.commander, edhrec_rank, game_changer, card_faces`. Identidade fora das cores de um deck: o deck nem entra na conta.
3. **Pedir o estudo ao Claude (`sample`, `modelTier: "complex"`, `sample.json`):** uma chamada só, com: a RUBRICA compacta, a régua do vácuo, o texto da carta, e para cada deck nas cores dela a régua das duas sinergias, a saturação, as comparáveis e as mais fracas. Peça JSON estrito: as oito notas da carta com `por_que` (se não há cadastro), `sin1`/`sin2` por deck com o porquê (ao pé da letra da régua), `leitura`, `forcas`, `fraquezas`, `vacuo.porque`, `armadilhas`, veredito por deck com `porque` e `sai` (uma das comparáveis), e a compra. A página valida como o `consulta.py` valida (nota de 0 a 3, porquê em toda nota acima de 0, veredito da lista, `sai` no deck) e recusa o que vier errado, pedindo de novo **uma vez**; depois mostra o erro. A página calcula valor, ganho, faixa e grau; o Claude não calcula número nenhum.
4. **Guardar e importar:** o estudo ao vivo vai para `db`, coleção `consultas`, um documento por carta (`{nome, link, data, modo: "ao-vivo", estudo, sinergias, vereditos, compra, cadastro_auto}`), e aparece na lista das registradas marcado "ao vivo". `python motor/consulta.py --importar-banco <arquivo.json>` traz os documentos para `dados/consultas/` (o `/consulta` lê a coleção com a ferramenta de banco do artefato, grava o JSON e roda o importar), como entrada **a revisar**: o Claude do Code confere as notas e o cadastro antes de dar como registrada; cadastro `auto` nunca vai para `dados/cartas.json` sem revisão.
5. **Testes:** `testes/consulta.py` ganha o validador do JSON do Claude com casos de mentira (nota 4, porquê vazio, veredito "talvez", `sai` fora do deck, deck fora das cores) e o importar do banco; `testes/publicada.py` continua valendo para a página (um arquivo, sem carregar nada de fora, imagens embutidas). O `FAKE_DB` de `testes/comum.py` serve de banco de mentira.

**Pare e mostre:** a página publicada com uma carta nova pedida ao vivo (escolha uma que não esteja em deck nenhum, nas cores de três decks ou mais), o documento no `db` e o importar rodando.

## Fase 3: comando e fechamento

1. `/consulta` (a skill instalada) ganha os passos novos: escrever o estudo (passo 6 vira "julgar e escrever"), o `--montar` e o `python motor/build.py --consulta` ao fim, e `importar` como modo (`/consulta importar`: traz o banco, mostra o que veio, pede o "pode" por carta). Registre em `contexto/MODELOS.md`.
2. `contexto/ESTADO.md`, `CLAUDE.md` (comandos e o mapa de pastas), suíte verde, merge do ramo `consulta`, commit `consulta: página, estudo e modo ao vivo`. Os arquivos de `contexto/consulta/` são do dono e entram no commit.

## O que não fazer

- Inventar texto de carta, nota, sinergia ou preço. Sem texto do Scryfall, a página não pede estudo.
- Calcular número com o Claude: valor, ganho, faixa e grau são da página e do motor, com a mesma conta.
- Gravar em deck, radar ou cadastro a partir da página: tudo passa pelo `/consulta` no Code e pelo "pode".
- Mostrar preço na Consulta, no hub ou no painel; perguntar sobre bracket ou cartas de estimação.
- Pôr a Consulta dentro do HTML do hub ou de um painel.
- Publicar com capacidades sem o "pode publicar"; republicar a Caixa, o hub ou o Grimório passando `capabilities`.
