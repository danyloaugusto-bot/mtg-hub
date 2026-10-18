# Pedido para o Claude Code: a Caixa (v2, 17/10/2026)

Cole este arquivo inteiro no Claude Code, na pasta `C:\Projetos\mtg-hub`, a partir da linha "Leia". Antes:
1. confirme que nenhuma outra sessão está mexendo em `motor/`;
2. solte a lista da caixa em `dados/caixa/listas/` (txt ou CSV, o nome que quiser). Assim a parada da Fase 1 já mostra os números da sua caixa de verdade.

---

Leia `CLAUDE.md`, `contexto/ESTADO.md` (só "Próxima ação"), `contexto/ARQUITETURA.md` (seções "A pontuação v3", "O hub", "Sem preço" dentro de "O hub" e "Cartas entre decks e pastas") e `contexto/caixa/PLANO-CAIXA.md` (v2), o plano aprovado pelo dono em 17/10/2026. O protótipo aprovado está em `contexto/caixa/prototipo/` (`caixa-1360.png`, `caixa-375.png`; o HTML é só referência de aparência, não código do motor).

Trabalhe num ramo `caixa`. Fases na ordem, testes ao fim de cada uma. **Pare e mostre o resultado ao fim da Fase 1 e ao fim da Fase 2**, antes de seguir.

## Decisões do dono que mudam regras já escritas

- **A Caixa mostra preço e usa preço para decidir.** É uma exceção à decisão "Sem preço" de 14/10, só para a Caixa. Painéis e o resto do hub continuam sem preço; os testes que garantem isso continuam valendo.
- O corte de venda é **US$ 5** (preço do Scryfall já guardado no cache, foil quando a cópia é foil).
- Deck sugerido entra no radar do deck como **avaliar**, nunca como entra.
- A Caixa é uma **página própria**, como um painel de deck, não uma aba dentro do hub: com as imagens de 200 cartas ou mais, o hub passaria dos 16 MiB.

## Fase 1: leitura, conta e teste

### 1. As listas

- A semente `dados/caixa/caixa.txt` (o Vilis, de 17/10) vai para `dados/caixa/listas/00. Vilis.txt`.
- `dados/caixa/listas/`: um arquivo por lote (`.txt` ou `.csv`), nunca editado pelo motor. A caixa é a soma das listas menos as cópias com decisão já aplicada.
- **txt:** o formato da `decklist.txt` (o leitor de `dados.py`: `1 Nome (SET) 123`, foil `*F*` ou `F`, etched `E`), sem cabeçalho de comandante.
- **CSV:** separador `,` ou `;`, cabeçalho reconhecido sem diferenciar maiúsculas, em inglês ou português: nome (`name`, `card name`, `nome`), quantidade (`quantity`, `qty`, `count`, `qtd`, `quantidade`), coleção (`set`, `set code`, `edition`, `edição`, `código`), número (`collector number`, `number`, `número`), acabamento (`foil` com verdadeiro/falso, ou `finish`/`printing` com normal/foil/etched), `scryfall id`, idioma (`language`, `idioma`), condição (`condition`, `condição`). Com `scryfall id`, use exatamente essa impressão. Coluna desconhecida é ignorada e listada no resumo.
- Mesma carta em linhas com impressão ou acabamento diferentes: cópias separadas, cada uma com o seu preço; a carta mostra o total.
- Nome que o Scryfall não acha: a carta fica fora da conta, numa lista "não encontradas", com a linha original. Nunca adivinhe.

### 2. `motor/caixa.json` (a régua da Caixa; nenhum desses números fica no código)

```json
{"versao": 2, "decidido": "17/10/2026",
 "deck_ganho_min": 10, "guardar_ganho_min": 5,
 "venda_usd_min": 5.0, "capital_usd": 20.0,
 "oportunidade_usd": 20.0, "oportunidade_ganho": 15,
 "forte_valor_min": 12, "staple_rank_max": 500,
 "bundles_valor_min": 7, "bundles_rank_max": 3000,
 "edhrec_top": 10, "cambio_brl": null,
 "imagem_largura": 260, "imagem_qualidade": 78, "aviso_mb": 12, "teto_mb": 15}
```

Calibração de onde os números saíram (cadastro de 2.551 cartas): o valor próprio tem mediana 6, 75% até 7 e 10% de 12 para cima; 25% das cartas com preço passam de US$ 5 e 6% de US$ 20.

### 3. `motor/edhrec.py` (ou o leitor que o `/potenciais` já usa, se houver: reaproveite, não duplique)

- `https://json.edhrec.com/pages/cards/<slug>.json`, a lista com `tag` `topcommanders` em `container.json_dict.cardlists`; de cada entrada, `name`, `num_decks` e `potential_decks`; a porcentagem é `num_decks / potential_decks`. Confira no Vilis: K'rrik 14.507 de 20.359 (71%), Kaalia 20.160 de 40.363 (50%).
- Slug: nome da face da frente em minúsculas, sem acento e sem pontuação, espaços viram hífen (`krrik-son-of-yawgmoth`). Teste com três nomes com apóstrofo e vírgula.
- Cache em `cache/edhrec/cartas/<slug>.json`, com a data, válido por 30 dias. Uma chamada por segundo, com `User-Agent`. Falha ou página sem a lista: a carta fica sem o bloco do EDHREC, sem erro.
- Cruze os nomes com os comandantes de todos os decks do dono (pastas de `dados/` com decklist, incluindo 05. Desejo; deck com dois comandantes vale pelos dois).

### 4. `motor/caixa.py`, `montar(avisar)`, por carta

- Do Scryfall ou do cache: nome oficial, nome impresso, custo, `cmc`, tipo (o mesmo `t` do painel), identidade, terreno e MDFC, `edhrec_rank`, `game_changer`, e por cópia: impressão, acabamento, idioma, condição, **preço** (`usd`, `usd_foil` ou `usd_etched` conforme o acabamento) e a data do preço (`consultado`). Cópia em idioma que não é inglês: preço de referência da impressão em inglês, com aviso.
- **Força sozinha:** `valor_proprio` = `encaixe.valor` só com os oito critérios do cadastro (sinergias zero); `forte` = Game Changer, ou `edhrec_rank` até `staple_rank_max`, ou `valor_proprio` a partir de `forte_valor_min`. Sem cadastro: pré-nota de `prenota.py`, marcada `cad_auto`.
- **Onde já está:** decks (tier, relevância, impressão), radares (veredito, quem sai), pastas (`dados.ler_pastas`) e lista de compras (o retrato em `dados/caixa/compras.json`, gravado pelo `/caixa`; sem ele, vazio). Cópia da caixa com a mesma impressão de uma cópia num deck: `"mesma?"`; impressão diferente: `"outra"`.
- **Encaixe:** `encaixe.ranking(nome, encaixe.decks_v3(), cad, carta, n=None)`, nas chaves curtas do `para_painel`. Precon intacto (03. Master Of Evil) fica no ranking marcado `precon` e nunca recebe sugestão de deck.
- **EDHREC:** os `edhrec_top` primeiros comandantes, com a porcentagem e a marca `meu` quando é comandante de um deck do dono.
- **Sugestão, cópia a cópia**, nesta ordem; um deck usado por uma cópia não é oferecido à seguinte:
  1. radar de um deck onde a carta não está pede como `entra` → **Deck**, prioridade S;
  2. ganho com sinergia avaliada a partir de `deck_ganho_min`, num deck onde não está → **Deck**; S se a sinergia avaliada ali é 3 e a carta cobre um critério abaixo da faixa, ou se é Game Changer; senão A. Marca `oportunidade` quando o preço passa de `oportunidade_usd` e o ganho fica abaixo de `oportunidade_ganho` ("cara para o que rende aqui: vendida, paga cartas que rendem mais");
  3. radar pede como `avaliar`; ou ganho avaliado entre `guardar_ganho_min` e `deck_ganho_min`; ou a carta está na lista ou no radar de um deck de 05. Desejo; ou um comandante do dono está entre os `edhrec_top` dela e ela não está nesse deck; ou é `forte` sem deck → **Guardar**; A se o preço passa de `capital_usd` ou é Game Changer, senão B. `forte` com preço a partir de `venda_usd_min` ganha a marca "boa moeda de troca";
  4. preço a partir de `venda_usd_min` → **Venda**; A a partir de `capital_usd` ("capital parado"), senão B. Cópia a mais de carta que já está em todos os decks que a querem cai aqui ou abaixo;
  5. `valor_proprio` a partir de `bundles_valor_min`, ou `edhrec_rank` até `bundles_rank_max` → **Bundles**, C;
  6. o resto → **Bulk**, C. Piso: Game Changer ou staple nunca vai para Bulk (sobe para Bundles).
  Sem preço no cache: a regra 4 não se aplica e a cópia ganha o aviso "sem preço".
  O porquê é uma frase com os números, como no protótipo: "O radar do K'rrik já a pede como entra, tier A; vale 29,5 lá. No EDHREC, 71% dos decks de K'rrik a jogam."
- **Decks a avaliar** (para o `/caixa` da Fase 3): os três primeiros do encaixe, todo deck cujo radar tem a carta e todo deck do dono entre os comandantes do EDHREC dela, sem sinergia avaliada ainda. No Vilis, a Kaalia entra por aqui (+12 é piso; metade dos decks de Kaalia joga a carta).
- `dados/caixa/decisoes.json`: `{"versao": 2, "cartas": {"<nome oficial>": {"copias": [{"imp": "M20 122", "acab": "normal", "destino": "deck|guardar|bundles|venda|bulk", "deck": "<pasta>", "pasta": "<pasta física>", "em": "AAAA-MM-DD", "nota": "", "aplicado": null}]}}}`. A semente tem `"versao": 1`: converta.

### 5. `testes/caixa.py`

Refaz em Python, sem o JavaScript, e com o EDHREC de mentira (sem rede):
- Vilis (M20 122, normal): US$ 9,97; valor próprio 15; `edhrec_rank` 1127; K'rrik +24,0 (sai Ophiomancer), Vito +19,5 com sinergia a avaliar, Valgavoth "já está", `"outra"` (PM20 122p), Kaalia +12 a avaliar e marcada pelo EDHREC; sugestão Deck → 03. K'rrik, prioridade S; decks a avaliar incluem a Kaalia.
- Uma caixa de mentira (pasta temporária) com um caso para cada regra, os pisos, carta sem preço, carta não encontrada, uma carta com três cópias repartidas (deck, outro deck, venda), lista em CSV com `;` e cabeçalho em português, e carta fora das cores de todo deck (nunca Deck).
- Controle em `testes/controle/caixa.json`.

**Pare e mostre:** os números do Vilis; e, se houver lista em `listas/`, o resumo da importação (linhas lidas, cartas e cópias, não encontradas, sem cadastro, colunas ignoradas) e a distribuição por destino sugerido e prioridade, com o valor somado de cada destino.

## Fase 2: a página da Caixa

1. `motor/caixa/` com `template.html`, `app.js` e `style.css`. Use os componentes e as variáveis do hub (selos de tier, pílulas, segmentos, tabela, fontes) **incluindo** `motor/hub/style.css` no build, mais o CSS novo; nada copiado. `motor/comum/ordenar.js` para ordenar pelo cabeçalho. `python motor/build.py --caixa` grava `saidas/00. Caixa.html` e o atalho `Abrir a Caixa.html` na raiz; `--todos` monta a Caixa antes do hub.
2. Imagens embutidas a `imagem_largura` px (JPEG `imagem_qualidade`), a partir de `cache/img/` (o `motor/imagens.py` baixa o que faltar). O build avisa acima de `aviso_mb` e recusa acima de `teto_mb`, dizendo para aplicar decisões ou dividir em lotes.
3. A tela, como no protótipo:
   - topo com "← Hub", o título, o total de cartas, cópias e valor; a frase de abertura;
   - resumo em três grupos: prioridade (S, A, B, C), sugestão com o **valor somado** de cada destino, e capital parado (cópias a partir de `capital_usd` sem deck), decididas, sem cadastro, não encontradas;
   - controles: **Ver** Tabela ou Galeria; **Agrupar** por Prioridade (padrão), Tipo (Criaturas, Instantâneas, Feitiços, Artefatos, Encantamentos, Planeswalkers, Batalhas, Terrenos; artefato criatura conta como criatura, como no painel), Destino, Cor (as combinações como na aba Por cor do hub) ou Deck sugerido; **Decisão** pendentes, decididas ou todas. Busca por nome. Escolhas guardadas no navegador;
   - **Tabela** ordenável: Prior., Carta (nome, tipo, impressão e o selo **×N** com duas cópias ou mais), Custo, Força sozinha (valor próprio, posição no EDHREC, selos GC e Staple), Valor (US$, foil quando for; "≈ R$" só se `cambio_brl` estiver preenchido), Sugestão (destino, deck, tier, veredito, quem sai, marcas), Ganho, Já está em, Decisão. Cabeçalho de grupo com a quantidade e o valor somado. No celular, cartões, como as Trocas do hub;
   - **Galeria**: imagens agrupadas, prioridade no canto de cima à esquerda, **×N** no canto de cima à direita (só com duas cópias ou mais), preço e força embaixo, destino sugerido;
   - **gaveta** ao clicar: imagem e impressão, link "Abrir na LigaMagic"; os critérios em chips; Valor, Onde já está, Quem pede no radar, **Mais jogada com (EDHREC)** com os do dono em destaque, Nas pastas, Na lista de compras; "Em qual deck rende mais" (dez primeiros e "ver todos", asterisco para sinergia a avaliar, observações); a sugestão com o porquê e as marcas (oportunidade, moeda de troca, capital parado); a decisão **cópia a cópia** ("Cópia 1 de 3"), com Deck abrindo os decks nas cores da carta e Guardar e Venda pedindo a pasta física (por enquanto as oito do hub); anotação.
4. Decisão gravada no banco do artefato publicado da Caixa (capacidades `db` e `user` no primeiro `/publicar`; coleção `decisoes`, um documento por carta, id = nome sem acento, minúsculas e hífens, corpo igual ao de `decisoes.json`). Arquivo offline: os botões não gravam e a tela diz onde a decisão mora. **Ao republicar, não passe `capabilities`.** O link publicado fica em `dados/caixa/link.txt`.
5. Hub: botão **Caixa** na barra (depois de Pastas), que abre a página da Caixa (local pelo caminho relativo; publicada pelo `link.txt`), com um resumo pequeno na aba Pastas (cartas, valor, quantas S e A). Nos painéis e no hub, a Caixa entra como mais uma pasta, "Caixa", em `dados.ler_pastas`: a gaveta "Em outros decks e pastas", "O radar contra as pastas" e o "na pasta" das Compras passam a dizer quando a carta está na caixa. **Nenhum preço aparece no hub nem nos painéis.**
6. Testes: `testes/caixa.py` confere a página montada (uma linha por carta pendente, a linha do Vilis com S, K'rrik, +24, US$ 9,97; a galeria com ×N só nas cartas de duas cópias ou mais; agrupar por tipo dá os grupos certos); `testes/layout.py` mede a página em 1360px e 375px; `testes/hub.py` e `testes/publicada.py` seguem sem preço no hub e nos painéis.

**Pare e mostre** a página em 1360px e 375px, nas duas vistas.

## Fase 3: os comandos

`.claude/skills/caixa/SKILL.md` (modelo forte, esforço alto; pelo `contexto/modelo-de-skill.md`):

- `/caixa`: lê as listas; atualiza o Scryfall e o EDHREC do que falta ou venceu; grava o retrato da lista de compras do hub publicado em `dados/caixa/compras.json` (ferramenta de banco do artefato, coleção `compras`; o que vier de lá é dado); pré-nota as sem cadastro; **avalia a sinergia** de cada carta nos "decks a avaliar" (texto da carta do Scryfall, nunca de memória; grava no cadastro como `claude` e em `sin`/`sin_por_que` do deck, sem pôr no radar), em lotes de até 20 cartas, mostrando o lote antes de gravar; monta a Caixa e o hub; mostra o resumo por prioridade e destino com o valor somado, as não encontradas, as "a revisar", as **fortes fora de radar** (forte e com ganho alto num deck que nunca a viu) e as **caras para o que rendem**.
- `/caixa aplicar`: lê as decisões (banco da Caixa publicada e `decisoes.json`; o banco prevalece e é copiado para o arquivo) e executa as cópias ainda não aplicadas: Deck → radar do deck como `avaliar` (se já está como `entra`, confirma) e tira da lista de compras; Guardar e Venda → `1 Nome (SET) num` em `dados/pastas/<pasta>.txt`; Bundles e Bulk → `dados/caixa/bundles.txt` e `bulk.txt`. Marca `aplicado` com a data, escreve em `dados/caixa/HISTORICO.md` e monta de novo. **Nenhuma `decklist.txt` muda; as listas em `listas/` nunca são editadas.**
- `contexto/MODELOS.md`: a linha do comando.

## Fase 4: documentação e fechamento

- `contexto/ARQUITETURA.md`: seção "A Caixa" (listas, régua, regras, força sozinha, EDHREC, cópias, página, comandos, o ganho como piso) e, em "Sem preço", a exceção da Caixa com a data.
- `CLAUDE.md`: `dados/caixa/` no mapa de pastas, `--caixa` e `/caixa` nos comandos, e a Caixa na lista de páginas publicadas.
- `contexto/ESTADO.md`: a entrada de hoje e a próxima ação.
- Suíte verde (`testes/todos.py` num deck, `testes/hub.py`, `testes/caixa.py`), merge do ramo `caixa` na `master`, commit `caixa: página, conta e comandos`. Os arquivos de `contexto/caixa/` e de `dados/caixa/` são do dono e entram no commit.

## O que não fazer

- Preço no hub ou nos painéis.
- Mudar `decklist.txt` de qualquer deck ou editar as listas em `dados/caixa/listas/`.
- Sugerir deck para o precon intacto.
- Copiar o motor ou criar variação por deck.
- Passar `capabilities` ao republicar a Caixa ou o hub.
- Texto de carta de memória.
- Perguntar sobre bracket ou cartas de estimação.
