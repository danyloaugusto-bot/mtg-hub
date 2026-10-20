# Pedido para o Claude Code: o Grimório (19/10/2026)

Cole a partir da linha "Leia", no Claude Code, em `C:\Projetos\mtg-hub`, com o motor livre (nenhum `/rebranding` no meio; se o lote 1 do rebranding já começou, termine e faça o commit dele antes). Modelo forte: a arquitetura é nova e 30 decks herdam.

---

Leia `CLAUDE.md`, `contexto/ESTADO.md` (só "Próxima ação"), `contexto/grimorio/METODO-GRIMORIO.md` (o método, aprovado pelo dono em 19/10), `contexto/grimorio/lentes.json` (as lentes), o protótipo `contexto/grimorio/prototipo/grimorio-prototipo.html` e as imagens `proto-1360-*.png` e `proto-375-*.png` (a régua visual: barra do hub, sub-abas em pílula, ferramentas numa linha, lista e galeria, gaveta), e `contexto/visual/GUIA-VISUAL.md` (princípio 8: fonte de título só em título). Este trabalho **não muda os dez critérios, os pesos nem o placar**, e não mexe em painel nenhum.

Trabalhe num ramo `grimorio`. Pare e mostre ao fim da Fase 2.

## Fase 1: leitura e dado

1. `contexto/grimorio/lentes.json` vai para `dados/grimorio/lentes.json` (é do dono; a cópia em `contexto/` fica como registro).
2. `motor/grimorio.py`, com três entradas de linha de comando:
   - `python motor/grimorio.py --ler [lente]`: para cada lente de tema e de cor, baixa a página do `json.edhrec.com` (cache em `cache/edhrec/lentes/<slug>.json`, 30 dias, 1 chamada/s, `User-Agent`, como `motor/edhrec.py`), extrai as listas (`container.json_dict.cardlists`: nome, `num_decks`, `potential_decks`, `synergy` quando houver), aplica o teto (40 mais incluídas + 20 de maior sinergia, sem básicos, Sol Ring, Arcane Signet e Command Tower nas lentes de tema), confere cada carta no Scryfall (`scryfall.buscar`: nome oficial, identidade, `leg`, `released_at`, `reprint`) e grava `dados/grimorio/grimorio.json` e `leitura.json`. Caminho 404: tenta `typal/` e `tribes/`, `themes/` e `theme/`; nada: lente marcada "sem leitura" com o motivo, e a leitura segue. **Confirme os caminhos no primeiro run e anote em `leitura.json` o que respondeu**; não assuma.
   - `python motor/grimorio.py --classificar <arquivo.json>`: lista para o dossiê das cartas sem nota no cadastro (texto do Scryfall e lente), na ordem: Falta e Ociosas no top 20 de cada lente primeiro. A gravação das notas é a de sempre, pelo cadastro v3 (`dados/cartas.json`), nunca por este script.
   - `python motor/grimorio.py --status`: recalcula, sem rede, onde cada carta está (decks com tier via `dados.indice_outros`, pastas via `dados.ler_pastas`, Caixa via `caixa.nomes()`), o status (Tenho, Ociosa pela regra das Sub-utilizadas, Falta), as novidades (impressão mais recente depois da leitura anterior; `reprint: false` = nova) e, para as cartas com notas 3 a 10 no cadastro, o "onde rende" (`encaixe.ranking` nos decks v3 das cores da carta, os três melhores com ganho e quem sai; o mesmo da Caixa). Pontas de lança: duas lentes de tema ou mais, ou uma lente de tema e nota 3 em algum critério.
3. Lente **Critérios**: pelo cadastro, cartas com nota 2 ou 3 em cada critério dos 3 a 10, cruzadas com o universo do Grimório (só cartas que estão em alguma lente de tema ou de cor, para a lista não virar o cadastro inteiro). Lente **8×8**: por deck com `avaliacao.json`, os agrupamentos e a contagem por pacote como na aba 8×8 do painel (pacote primário, `ref`, Mana fora), e as cartas do Grimório nas cores do deck com nota 2 ou 3 no agrupamento (`CRIT_8X8` para os pacotes funcionais; para os pacotes de tema, a lente de tema do deck).
4. Imagens: `motor/imagens.py` ganha a redução menor para o Grimório (150 px, qualidade 70) sem mexer na dos painéis; o cache continua um só.
5. `contexto/ARQUITETURA.md`, seção "O Grimório": o dado, as regras e o orçamento. `testes/contrato.py` ganha o contrato de `grimorio.json`.

## Fase 2: tela

1. `motor/grimorio/{template.html, style.css, app.js}` e `python motor/build.py --grimorio` gravando `saidas/00. Grimório.html`, com o mesmo `tema.paleta` e fontes do hub (Alegreya Sans no texto, Cinzel só em título) e o `motor/comum/ordenar.js`. A página é a do protótipo: cabeça com o campo de atualização (última leitura, fontes, coleções com a de hoje em destaque e a próxima "a sair", contagens, novidades, `/grimorio atualizar` com copiar), as seis sub-abas em pílula com endereço (`#tribos`, `#cores`, `#criterios`, `#8x8`, `#pontas`, `#novidades`), a linha de ferramentas (ordem, status, Lista/Galeria guardada no navegador em `grimorio:v1`, filtro), o cabeçalho da lente (nome em Cinzel, fonte e data da leitura, decks que a usam), a tabela ordenável pelo cabeçalho e a galeria, a gaveta da carta. Lente sem leitura mostra o estado vazio com o motivo, nunca some.
2. **Hub:** pílula `Grimório` à direita do Dashboard, no `motor/hub/template.html`, com o mesmo mecanismo de link da Caixa (`href` local e o link publicado de `dados/grimorio/link.txt` no `/publicar`). No celular, cabe na mesma linha do Dashboard ou quebra abaixo dele, nunca some.
3. **Orçamento:** o build mede o HTML; acima de 14 MB reduz a galeria (qualidade 60), depois o teto por lente, e avisa no console.
4. **Testes:** `testes/grimorio.py` (uma amostra de "onde já está" refeita em Python contra as decklists e as pastas; nenhuma carta sem registro no Scryfall; nenhuma banida; nenhum preço no HTML; pontas de lança refeitas; tamanho), `testes/layout.py` com a página em 1360 px e 375 px (sem rolagem horizontal, galeria com 6 e 2 colunas, nenhum texto abaixo de 13 px), `testes/hub.py` com a pílula.

**Pare e mostre** a página em 1360 px e 375 px (Tribos com a lente Vampiros, 8×8 com a Giada, a gaveta de uma carta) e a barra do hub.

## Fase 3: o comando `/grimorio`

A skill está pronta em `contexto/grimorio/SKILL-grimorio.md`, escrita no app (o app não grava em `.claude/`). Copie para `.claude/skills/grimorio/SKILL.md` sem mudar o conteúdo, a não ser o que a revisão pedir, e registre em `contexto/MODELOS.md` (`/grimorio`: sonnet high para `atualizar` e `publicar`, opus high para `classificar`). Contrato de linha de comando que o `motor/grimorio.py` precisa cumprir: `--ler [lente]`, `--status`, `--classificar <arquivo.json>`, e `python motor/build.py --grimorio`.

Depois: a Oficina de cada painel ganha a linha "Ver as melhores cartas para este deck no Grimório" (link para `00. Grimório.html#8x8` com o deck pré-selecionado por `?deck=` ou pelo nome guardado no navegador).

## Fase 4: fechamento

Primeira leitura de verdade (`/grimorio atualizar`), com o dossiê da primeira classificação mostrado ao dono e **sem classificar nada** até o "pode". `contexto/ESTADO.md` (a linha da leitura e as lentes sem fonte), `CLAUDE.md` (comandos), suíte verde, merge do ramo `grimorio`, commit `grimorio: página, leitura e comando`. Os arquivos de `contexto/grimorio/` são do dono e entram no commit. Publicar só com o "pode publicar" do dono, sem `capabilities`.

## O que não fazer

- Inventar carta, nota, inclusão ou caminho do EDHREC; sem resposta, a lente fica "sem leitura".
- Mudar os dez critérios, os pesos, o placar, as decklists, o radar ou as listas da Caixa e das pastas.
- Mostrar preço no Grimório, no hub ou no painel; perguntar sobre bracket ou cartas de estimação.
- Pôr o Grimório dentro do HTML do hub.
- Baixar a galeria inteira de novo a cada leitura: o cache de imagens é o de sempre.
