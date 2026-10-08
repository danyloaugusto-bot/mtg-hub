# Kit de reconstrução: Coro da Alvorada

Painel de deck de Commander (Giada, Font of Hope) em um único HTML que abre offline.
Este kit reconstrói o arquivo byte a byte e serve de base para painéis de outros decks.
A explicação completa (funções, regras, design, decisões e passo a passo) está no documento
"Handover: Coro da Alvorada, painel do deck da Giada", de 07/10/2026.

## O que há aqui

| Caminho | Conteúdo |
| --- | --- |
| dist/coro-da-alvorada.html | O painel entregue (345.352 bytes) |
| src/template_head.html | Cabeçalho, CSS completo e esqueleto HTML; o marcador `/*__FONTS__*/` recebe as fontes |
| src/template_body.js | Toda a lógica: definições, estado, estatísticas, gráficos, abas, eventos |
| dados/decklist.txt | A lista original, uma carta por linha; a primeira é o comandante |
| dados/evals.py | Fonte das avaliações: notas, tier, relevância, efeito, motivo, marcações, radar, combos |
| dados/D.json | Dados finais embutidos no HTML (gerado por scripts/gerar_dados.py) |
| fontes/*.woff2 | As seis faces embutidas: Cormorant Unicase 700 e Alegreya Sans 400, 400 itálico, 500, 700, 800 |
| scripts/forge.py | Clona, indexa e consulta a base aberta do Forge |
| scripts/gerar_dados.py | Decklist + avaliações + Forge -> dados/D.json, com validações |
| scripts/montar.py | Junta tudo no HTML único; `--conferir` compara com dist/ |
| scripts/testar.py | 35 verificações em Chromium headless (Playwright) |

## Uso rápido

```
python3 scripts/montar.py --conferir   # deve responder IDÊNTICO
python3 scripts/montar.py              # regrava dist/coro-da-alvorada.html
python3 scripts/testar.py              # precisa de: pip install playwright && playwright install chromium
```

## Regenerar os dados a partir do Forge

```
python3 scripts/forge.py clonar        # ~140 MB, só as pastas de cartas e de edições
python3 scripts/forge.py indexar
python3 scripts/forge.py ver "Giada, Font of Hope"
python3 scripts/gerar_dados.py         # grava dados/D.json e imprime os números de controle
```

A pasta do clone é `./forge`; para usar outra, defina a variável `FORGE_DIR`.

## Onde mexer

- Notas, tiers, textos, radar e combos: `dados/evals.py`, depois `gerar_dados.py` e `montar.py`.
- Agrupadores (lista `G`), leitura do deck (`readings`), asas (`wings`, `feather`) e curva (`curveSvg`, `pipe`): `src/template_body.js`.
- Paleta (variáveis em `:root`), tipografia e layout: `src/template_head.html`.
- Chave de armazenamento no navegador: `KEY` em `src/template_body.js`. Troque ao criar painel de outro deck.

## Números de controle (07/10/2026)

100 cartas em 85 entradas; 68 não-terrenos e 32 terrenos; 3 cartas duplas com terreno no verso;
CMC médio 3,72; curva 0/4/19/11/15/5/7/7; 28 Anjos em 31 criaturas;
placar 429 = 351 de notas + 75 de aceleração + 3 de CMC;
pontos por agrupador: Ramp 27, Draw 32, Removal 25, Proteção 42, Buff 34, Token 27, Sinergia 114, Especial 50;
tiers S 16, A 41, B 19, C 9; relevância INS 16, ALT 41, MÉD 19, BAX 9.

## Créditos e licenças

- Fontes Cormorant Unicase e Alegreya Sans: SIL Open Font License 1.1 (subconjunto latin, via pacotes @fontsource).
- Custos, tipos e textos conferidos na base do Forge (github.com/Card-Forge/forge). O kit não inclui arquivos do Forge.
- Painel de fã. Magic: The Gathering é marca da Wizards of the Coast.
