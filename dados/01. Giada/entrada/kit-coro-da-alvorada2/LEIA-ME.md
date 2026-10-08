# Kit de reconstrução: Coro da Alvorada (versão 2)

Painel de deck de Commander (Giada, Font of Hope) em um único HTML que abre offline.
Este kit reconstrói o arquivo byte a byte e serve de base para painéis de outros decks.
A explicação completa está no documento "Handover: Coro da Alvorada, painel do deck da Giada", de 07/10/2026.
O que mudou da versão 1 para a 2 está em `HANDOVER-v2.md`: onde os dois divergirem, vale o v2.

## O que há aqui

| Caminho | Conteúdo |
| --- | --- |
| dist/coro-da-alvorada.html | O painel entregue (457.278 bytes) |
| src/template_head.html | Cabeçalho, CSS completo e esqueleto HTML; o marcador `/*__FONTS__*/` recebe as fontes |
| src/template_body.js | Toda a lógica: definições, estado, imagens, estatísticas, gráficos, abas, eventos |
| dados/decklist.txt | A lista original, uma carta por linha; a primeira é o comandante |
| dados/evals.py | Fonte das avaliações: notas, tier, relevância, efeito, motivo, marcações, radar, combos e a sinergia lida no edh.wiki |
| dados/D.json | Dados finais embutidos no HTML (gerado por scripts/gerar_dados.py) |
| imagens/giada-arte.webp | Arte da comandante, embutida no herói (626 x 443, 40 KB) |
| fontes/*.woff2 | As seis faces embutidas: Cormorant Unicase 700 e Alegreya Sans 400, 400 itálico, 500, 700, 800 |
| scripts/forge.py | Clona, indexa e consulta a base aberta do Forge |
| scripts/gerar_dados.py | Decklist + avaliações + Forge -> dados/D.json, com validações |
| scripts/montar.py | Junta tudo no HTML único; `--conferir` compara com dist/; `--imagens` embute as imagens das cartas; `--publicar` gera a montagem para página publicada |
| scripts/baixar_imagens.py | Baixa do Scryfall a imagem de cada carta para imagens/cartas/ (para a versão com imagens embutidas) |
| scripts/testar.py | 90 verificações em Chromium headless (Playwright), com o Scryfall simulado |

## Uso rápido

```
python3 scripts/montar.py --conferir   # deve responder IDÊNTICO
python3 scripts/montar.py              # regrava dist/coro-da-alvorada.html
python3 scripts/testar.py              # precisa de: pip install playwright && playwright install chromium
```

## Imagens das cartas: duas formas

1. **Pela internet (padrão).** O painel pede as cartas ao Scryfall em lote (duas chamadas), guarda no navegador só o
   identificador de cada imagem e, daí em diante, carrega as figuras direto do servidor de imagens. Sem internet, ou
   onde imagens externas são bloqueadas (prévia do chat, página publicada), o painel segue inteiro, com fichas de texto.
2. **Embutidas no arquivo.** Roda em qualquer lugar, sem internet, e pode ser publicado:

```
python3 scripts/baixar_imagens.py --largura 366   # ~105 imagens; sem --largura guarda o JPG original, bem mais pesado
python3 scripts/montar.py --imagens               # grava dist/coro-da-alvorada-com-imagens.html (uns 4 MB com --largura 366)
```

A impressão buscada é a da decklist (edição e número). Quando o Scryfall não a reconhece, vale a impressão padrão da carta.

## Publicar

Página publicada (e a prévia de um chat) não carrega nada de outros sites. O painel percebe quando o ambiente barra o Scryfall
e explica no rodapé. Para publicar, há duas montagens:

```
python3 scripts/montar.py --publicar              # dist/coro-da-alvorada-publicado.html: sem imagens de carta, nem tenta a rede
python3 scripts/montar.py --imagens --publicar    # com as cartas embutidas (rode antes o baixar_imagens.py)
```

## Regenerar os dados a partir do Forge

```
python3 scripts/forge.py clonar        # ~170 MB, só as pastas de cartas e de edições
python3 scripts/forge.py indexar
python3 scripts/forge.py ver "Giada, Font of Hope"
python3 scripts/gerar_dados.py         # grava dados/D.json e imprime os números de controle
```

A pasta do clone é `./forge`; para usar outra, defina a variável `FORGE_DIR`.

## Onde mexer

- Notas, tiers, textos, radar e combos: `dados/evals.py`, depois `gerar_dados.py` e `montar.py`.
- Sinergia da comunidade: dicionário `EDHWIKI` e bloco `EDH` em `dados/evals.py`. Potenciais (cartas da página fora do deck e do radar): listas `POOL` e `NOVAS`, no fim do mesmo arquivo; custo, tipo e texto saem do Forge em `gerar_dados.py`. Para outro deck sem esse dado, apague os dois e tire `edh=EDH` de `META`: o painel esconde a coluna, o painel e as etiquetas sozinho.
- Agrupadores (lista `G`), leitura do deck (`readings`), asas (`wings`, `feather`) e curva (`curveSvg`, `pipe`): `src/template_body.js`.
- Imagens (`imStart`, `imBatch`, `imUrl`, `hydrate`, espiada `peekShow`): `src/template_body.js`.
- Herói e arte da comandante: troque `imagens/giada-arte.webp` e o texto alternativo em `renderGeral`.
- Paleta (variáveis em `:root`), tipografia e layout: `src/template_head.html`.
- Chaves de armazenamento no navegador: `KEY` (estado) e `KEY + ':img'` (identificadores das imagens). Troque `KEY` ao criar painel de outro deck.

## Números de controle (07/10/2026, versão 2)

100 cartas em 85 entradas; 68 não-terrenos e 32 terrenos; 3 cartas duplas com terreno no verso;
CMC médio 3,72; curva 0/4/19/11/15/5/7/7; 28 Anjos em 31 criaturas;
placar 429 = 351 de notas + 75 de aceleração + 3 de CMC;
pontos por agrupador: Ramp 27, Draw 32, Removal 25, Proteção 42, Buff 34, Token 27, Sinergia 114, Especial 50;
tiers S 16, A 41, B 19, C 9; relevância INS 16, ALT 41, MÉD 19, BAX 9;
radar com 18 candidatas (7 entram, 10 a avaliar, 1 fica de fora, esta na lista "Avaliadas, ficam de fora");
52 potenciais do edh.wiki fora do deck e do radar (48 com +10% ou mais e 4 de coleções recentes);
edh.wiki: 74 das 84 entradas fora o comandante aparecem na página; das 67 cartas que não são terreno, 24 com +40% ou mais,
19 de +10% a +39%, 14 de +1% a +9%, 4 em zero ou negativas e 6 fora da página; listas 10 de 10, 8 de 10 e 4 de 6;
remoção: 8 dedicadas, 5 em massa, 4 que respondem a um alvo (Winds of Abandon conta nas duas), nenhuma de 1 mana.

## Créditos e licenças

- Fontes Cormorant Unicase e Alegreya Sans: SIL Open Font License 1.1 (subconjunto latin, via pacotes @fontsource).
- Custos, tipos e textos conferidos na base do Forge (github.com/Card-Forge/forge). O kit não inclui arquivos do Forge.
- Imagens das cartas: Scryfall (scryfall.com), carregadas em tempo de uso ou baixadas por você com `baixar_imagens.py`. O kit não inclui imagens de cartas além da arte da comandante, enviada pelo dono do deck.
- Sinergia: edh.wiki, página de Anjos da Giada, lida em 07/10/2026.
- Painel de fã. Magic: The Gathering é marca da Wizards of the Coast; as artes pertencem à Wizards e aos seus ilustradores.
