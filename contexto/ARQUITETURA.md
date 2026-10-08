# Arquitetura

## A decisão

Um motor, um artefato por deck, um hub gerado no mesmo build. Decidido em 07/10/2026, com cerca de 25 decks em vista.

Por que não um artefato só com seletor de comandante: a página publicada tem teto de 16 MiB e cada deck com imagens pesa perto de 4 MB; um erro de publicação derrubaria todos os decks; e cada comandante tem tema próprio.

Por que não um código por deck: o mesmo conserto teria de ser feito 25 vezes e os painéis divergiriam. Isso já tinha começado, com o painel da Giada feito à parte.

## O motor

Feito na etapa 1 (07/10/2026), a partir do kit do Ritos de Sangue. Nada do código fala de um deck em particular: tudo o que era do Clavileño saiu para `dados/02. Clavileno/`.

| Arquivo | O que faz |
|---|---|
| `motor/build.py` | Monta `saidas/<pasta>.html` e `dados/<pasta>/Abrir o painel.html`. `--deck "<pasta>"` ou `--todos`. |
| `motor/dados.py` | Lê a pasta do deck, valida o contrato abaixo e monta o objeto que o painel recebe. Erro de dado para o build com mensagem que diz onde está. |
| `motor/scryfall.py` | Custo, tipo, faces, cores, artista e preço de cada carta, com cache em `cache/scryfall.json` (fora do Git, compartilhado entre decks). |
| `motor/tema.py` | Paleta, cores dos agrupamentos e das cartas, textura, fontes embutidas e capa. O que o tema não declara cai num padrão neutro. |
| `motor/painel/` | `app.js`, `style.css` e `template.html`: o painel em si. JavaScript puro, sem dependência. |
| `motor/fontes/<família>/` | Fontes embutidas, `<família>-latin-<peso>-<estilo>.woff2`. Hoje: Grenze Gotisch, Alegreya Sans, Cormorant Unicase. |
| `motor/importar/ritos.py` | Conversão única do `annot.py` e `edh.py` do kit para o contrato. Fica registrada para auditoria. |

O build grava sempre com quebra de linha LF e é determinístico: montar duas vezes dá o mesmo arquivo, em qualquer sistema.

## Contrato de um deck

Tudo mora em `dados/<pasta>/`. Na raiz, só estes arquivos; o resto vai para `entrada/`.

| Arquivo | Quem escreve | Obrigatório |
|---|---|---|
| `deck.md` | O dono, com ajuda do `/novo-deck` | sim |
| `decklist.txt` | O dono | sim |
| `capa.*` | O dono, ou o `/capa` | não; sem capa, o topo fica só com texto e gráfico |
| `avaliacao.json` | O Claude, com o motivo escrito | sim |
| `tema.json` | O Claude, a partir do clima pedido em `deck.md` | não; sem ele, vale o tema padrão |
| `comunidade.json` | O `/potenciais` | não; sem ele, somem o painel da comunidade, a coluna Wiki e os potenciais |
| `CONFRONTO.md` | O Claude | quando houver material em `entrada/` |
| `HISTORICO.md` | O Claude | sim, uma entrada por versão |
| `Abrir o painel.html` | O build | gerado |

Campo cujo nome começa com `_` é comentário e o motor ignora.

### `decklist.txt`

Uma carta por linha: `1 Nome da Carta (SET) número`, com `*F*` para foil e `*CMDR*` para o comandante. Sem `*CMDR*`, a primeira linha é o comandante. Edição e número são opcionais; sem eles, vale a impressão padrão do Scryfall. O nome é o do Scryfall, em inglês.

### `avaliacao.json`

```json
{
  "feito": "07/10/2026",
  "agrupamentos": [
    {"k": "ramp", "nome": "Ramp", "ab": "Ramp", "desc": "Pedras de mana...", "ref": [10, 12]},
    {"k": "sinergia", "nome": "Sinergia + PetCard", "curto": "Sinergia", "ab": "Sin.", "pet": true, "desc": "..."}
  ],
  "marcadores": {
    "tribo": {"nome": "Vampiro", "plural": "Vampiros", "subtipo": "Vampire"},
    "saida": {"nome": "Saída de sacrifício", "valores": {"1": "repetível, com custo", "2": "grátis e instantânea"}}
  },
  "leituras": [ {"tipo": "terrenos", "min": 35} ],
  "cartas": {
    "Blood Artist": {"notas": {"sacrifice": 3, "sinergia": 2, "especial": 3}, "tier": "S", "rel": "INS",
                     "faz": "...", "porque": "...", "marcas": {"dreno": 1}}
  },
  "radar": {
    "Saw in Half": {"notas": {"removal": 1}, "tier": "A", "rel": "ALT", "veredito": "entra", "sai": "Lithoform Engine", "faz": "...", "porque": "..."}
  },
  "combos": [ {"nome": "...", "tipo": "Combo", "pecas": ["Carta A", "Carta B"], "texto": "..."} ]
}
```

**Agrupamentos.** De 6 a 10, na ordem em que aparecem no painel. `k` é a chave usada nas notas e no tema; `ref` é a faixa de referência, opcional. Três chaves têm papel no motor: `ramp` entra no potencial de aceleração do placar e aceita nota −1 (terreno que entra virado); `removal` é o que a leitura de remoção conta; o agrupamento com `"pet": true` recebe o ponto do PetCard.

**Notas.** Por nome do agrupamento, de 0 a 3, omitindo os zeros. 1 é de passagem, 2 é função da carta, 3 é referência no deck.

**Campos de toda carta.** `tier` (S A B C D), `rel` (INS ALT MED BAX), `faz` e `porque` são obrigatórios. Opcionais: `massa` (remoção em massa), `pontual` (remoção em massa que também responde a um alvo), `virado` (terreno que sempre entra virado), `gera` (cores que o terreno gera, como `"WB"` ou `"C"`; sem ele, vale o que o Scryfall diz), `prioridade` (ordem sugerida na fila de corte, 1 sai primeiro). No radar, também `veredito` (entra, avaliar, fora) e `sai`, o nome de uma carta do deck.

**Marcadores.** São do deck: Vampiro e saída de sacrifício no Ritos; Anjo, ganho de vida e proteção no Coro. Um marcador com `subtipo` é dado pelo tipo da carta, sem precisar marcar à mão. Os demais vão em `marcas` de cada carta, com valor 1 ou um número que a leitura pode distinguir.

**Leituras.** Os diagnósticos do painel, cada um com seus limiares e textos:

| `tipo` | Campos | O que diz |
|---|---|---|
| `terrenos` | `min`, `ref` | Fontes de terreno (terrenos e cartas duplas com terreno no verso). |
| `agrupamento` | `g`, `min`, `rotulo` [singular, plural], `passagem`, `alerta`, `farto` {`min`, `texto`} | Cartas dedicadas de um agrupamento, as de passagem e a referência. |
| `remocao` | `g`, `massa_max`, `massa_ref`, `min`, `alerta` | Remoções, quantas em massa e a referência. |
| `contagem` | `marcador`, `min`, `max`, `rotulo`, `listar`, `texto`, `alerta`, `ok` | Cartas com um marcador. No `texto`, `{saida=2}` vira o número de cartas com aquele valor. |
| `tribo` | `min_pct`, `texto` | Densidade da tribo entre as criaturas. Pede o marcador `tribo`. |
| `proporcao` | `a`, `b`, `fator`, `rotulo`, `rotulo_b`, `alerta`, `ok` | Um marcador contra outro, como ganho de vida contra quem paga por ele. |
| `curva` | `cmc_max`, `topo_max`, `alerta` | Cartas baratas, CMC médio e pico da curva. |

### `tema.json`

```json
{
  "painel": "Ritos de Sangue", "rev": 3,
  "comandante_pt": "Clavileño, Primeiro dos Abençoados", "comandante_curto": "Clavileño", "artigo": "o",
  "lede": "Tribal de Vampiros com sacrifício e recursão.", "verbos": ["atacar", "morrer", "voltar"],
  "eixo": {"rotulo": "Vampiros", "marcador": "tribo"},
  "capa": {"arquivo": "capa.png", "moldura": "retrato", "alt": "...", "credito": "...", "foco": "47% 0", "avatar": "48% 13%/430% auto"},
  "grafico": "rosacea", "curva": "ogiva", "textura": "vitral",
  "fontes": {"titulo": "Grenze Gotisch", "texto": "Alegreya Sans"},
  "paleta": {"fundo": "#12070b", "painel": "#210e16", "acento": "#d8b46a", "...": "..."},
  "agrupamentos": {"ramp": "222,170,70", "...": "..."},
  "chave_antiga": "ritos-de-sangue-v1"
}
```

- `artigo`: `o` (padrão) ou `a`, para o comandante. Usado nos dois lugares em que o painel fala dele com artigo ("é boa no Clavileño" / "é boa na Giada", "como a comunidade monta o Clavileño" / "monta a Giada").
- `moldura`: `larga` (padrão) mostra a arte inteira, com o gráfico abaixo; `retrato` recorta a arte num arco, com o gráfico ao lado. `foco` posiciona o recorte; `avatar`, o círculo da barra.
- `grafico`: `rosacea` ou `padrao`. As `asas` do Coro chegam na etapa 2. `curva`: `ogiva` ou `barra`. `textura`: `vitral`, `padrao` ou `nenhuma`.
- `paleta`: as dez chaves de base são `fundo`, `painel`, `acento`, `acento_claro`, `texto`, `suave`, `apagado`, `destaque`, `destaque_claro` e `vinho`. As finas (`fundo2`, `painel2`, `elevado`, `profundo`, `tinta`, `cabecalho`, `coluna`, `realce`, `total`, `botao`, `botao2`, `botao_hover`, `botao2_hover`, `folha`, `folha2`, `contorno`, `ok`, `alerta`, `ruim`) são derivadas quando faltam. Cores de tier, relevância, veredito e símbolos de mana são do motor, iguais em todo deck.
- `agrupamentos`: cor de cada um, em `"r,g,b"`. Sem ela, vale uma paleta de dez cores.
- `fontes`: famílias de `motor/fontes/`. Fonte nova entra lá antes de entrar no tema.
- `chave_antiga`: onde o painel anterior deste deck guardava o estado no navegador, para não perder edições na migração.

### `comunidade.json`

```json
{
  "fonte": "edh.wiki", "url": "https://...", "lido": "06/10/2026", "pagina": "Clavileño com Vampiros",
  "temas": [["Vampiros", 29], ["Lifegain", 23]],
  "listas": [{"k": "alta", "n": "Alta sinergia", "cards": ["..."]}],
  "precon": {"set": "LCC", "texto": "a do pré-construído do Clavileño"},
  "sinergia": {"Cordial Vampire": 86},
  "potenciais": [{"nome": "Unclaimed Territory", "sinergia": 66, "novo": false}]
}
```

Sinergia mede presença nos decks do comandante, não força, e não entra no placar. Potenciais que já estão no deck ou no radar são ignorados.

## Imagens

Ordem de tentativa no painel: o mapa embutido no arquivo (`D.img`), a imagem exata no servidor do Scryfall (pelo id da impressão), o redirecionamento da API e, no fim, a ficha de texto. Sem pacote e sem internet, o aviso oferece "Tentar de novo".

`motor/imagens.py`, feito na etapa 3, baixa uma vez para `cache/img/<set>-<numero>.jpg` (verso com sufixo `-verso`), compartilhado entre decks, e reduz a 340 px de largura, JPEG qualidade 82:

```
python motor/imagens.py --deck "02. Clavileno"
python motor/imagens.py --todos
```

Cada carta do deck e do radar entra; os potenciais, não. Carta já no cache não é baixada de novo. Capa: usa o `capa.*` da pasta; sem ele, baixa o `art_crop` do comandante como `capa.jpg`.

`motor/build.py --imagens` controla o que vai no HTML: `embutidas` (padrão) lê `cache/img/` e embute cada imagem como `data:` URI, indexada pelo id da carta; `externas` deixa `D.img` vazio e o painel tenta o Scryfall ao vivo, como antes do `/imagens`; `nenhuma` também deixa vazio e começa com as imagens desligadas (`tema.json` não tem campo para isso; é só do build). Build sem rodar o `/imagens` antes simplesmente não encontra nada no cache e sai como `externas`, sem erro.

Com o pacote embutido, a página publicada também mostra as imagens: `data:` URIs não são conteúdo externo, então passam onde o Scryfall ao vivo é bloqueado. O botão de ligar e desligar aparece na Galeria mesmo publicada, porque desligar continua sendo escolha do dono.

## Onde o estado do usuário mora

Edições feitas dentro de um painel (tier, notas, trocas, anotações) ficam naquele painel: no navegador, se for arquivo local, sob a chave `mtg-hub:<pasta>:v1`; na conta, se for página publicada, em `data/users/<id>/painel`. O hub mostra a foto do último build, não essas edições. Para o hub refletir uma mudança de verdade, ela precisa voltar para `dados/<pasta>/` (pela Oficina, com o `/importar-backup`) e passar por um build.

O formato do estado é o do Ritos, com a data da última gravação. Backups do Ritos e do Coro antigos continuam abrindo.

## O hub

Lê as pastas de `dados/`, o `contexto/inventario.csv` (para os decks que ainda não têm pasta) e o resumo de cada deck montado. Mostra os grupos do aplicativo do dono: 01. Top, 02. Tribais, 03. Caos, 04. Forfun, Compras + Precon. O grupo é o número no nome da pasta do deck: mover de grupo é renomear a pasta. Nasce na etapa 4.

## Atalhos que funcionam sem internet

`Abrir o Hub.html`, na raiz, leva ao hub. Cada pasta de deck ganha `Abrir o painel.html`, que o build grava a cada montagem. Tudo por caminho relativo.

## A Oficina de cada painel

O painel não tem IA dentro dele quando é um arquivo local. A aba Oficina faz a ponte: lista o que dá para pedir ao Claude Code sobre aquele deck, com o comando já preenchido com o nome da pasta e um botão de copiar. Hoje: auditar, comparar duas cartas, avaliar coleção nova, atualizar a leitura da comunidade, trocar a capa, propor variações de tema, conferir a decklist, e levar ao projeto o que foi editado no painel, com o backup copiado junto. O caminho de volta é o `/importar-backup`.
