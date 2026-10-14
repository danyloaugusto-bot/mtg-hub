# Arquitetura

## A decisão

Um motor, um artefato por deck, um hub gerado no mesmo build. Decidido em 07/10/2026, com cerca de 25 decks em vista.

Por que não um artefato só com seletor de comandante: a página publicada tem teto de 16 MiB e cada deck com imagens pesa perto de 4 MB; um erro de publicação derrubaria todos os decks; e cada comandante tem tema próprio.

Por que não um código por deck: o mesmo conserto teria de ser feito 25 vezes e os painéis divergiriam. Isso já tinha começado, com o painel da Giada feito à parte.

## O motor

Feito na etapa 1 (07/10/2026), a partir do kit do Ritos de Sangue. Nada do código fala de um deck em particular: tudo o que era do Clavileño saiu para `dados/02. Clavileño/`.

| Arquivo | O que faz |
|---|---|
| `motor/build.py` | Monta `saidas/<pasta>.html` e `dados/<pasta>/Abrir o painel.html`. `--deck "<pasta>"` ou `--todos`. |
| `motor/dados.py` | Lê a pasta do deck, valida o contrato abaixo e monta o objeto que o painel recebe. Erro de dado para o build com mensagem que diz onde está. |
| `motor/scryfall.py` | Custo, tipo, faces, cores, artista e preço de cada carta, com cache em `cache/scryfall.json` (fora do Git, compartilhado entre decks). |
| `motor/tema.py` | Paleta, cores dos agrupamentos e das cartas, textura, fontes embutidas e capa. O que o tema não declara cai num padrão neutro. |
| `motor/painel/` | `app.js`, `style.css` e `template.html`: o painel em si. JavaScript puro, sem dependência. |
| `motor/fontes/<família>/` | Fontes embutidas, `<família>-latin-<peso>-<estilo>.woff2`. Hoje: Grenze Gotisch, Alegreya Sans, Cormorant Unicase, Cinzel, Teko, Marcellus SC, IM Fell English SC, Oxanium, Pirata One, Uncial Antiqua, Cinzel Decorative, Playfair Display SC, Metamorphous, Bangers, Limelight. |
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

Uma carta por linha: `1 Nome da Carta (SET) número`, com `*F*` ou `F` para foil, `E` para etched foil e `*CMDR*` para o comandante. Sem `*CMDR*`, a primeira linha é o comandante. Sob o cabeçalho `COMMANDER`, todas as cartas até a primeira linha em branco são comandantes: é assim que entram dois parceiros (Turtle Power!). O build aceita um comandante, ou dois com parceria no texto (Partner, Friends forever, Doctor's companion, Background), e recusa o resto. Linhas em branco, as que começam com `#` ou `//` e os cabeçalhos de seção das exportações de aplicativo (`COMMANDER`, `Deck`, `Sideboard`) são ignorados. Edição e número são opcionais; sem eles, vale a impressão padrão do Scryfall. O número vai como está na carta: o Scryfall diferencia maiúscula de minúscula (`1P` não é `1p`). O mesmo básico pode vir em duas linhas, uma por impressão. O nome é o do Scryfall, em inglês.

**Nome impresso.** Quando a impressão da lista traz um nome diferente do Scryfall (Secret Lair de Street Fighter, nome de fantasia de Universes Beyond), o painel mostra o nome da carta física: `Aisha of Sparks and Smoke` (SLD 430) aparece como Ken, Burning Brawler; `Lightning Bolt` (SLD 675), como Hadoken. O nome do Scryfall continua sendo a chave na `avaliacao.json`, nos combos e no radar, e é o que vai na decklist exportada, porque é o que os sites reconhecem. A busca do tabelão aceita os dois.

**Identidade de cor.** O build recusa qualquer carta da decklist, do radar ou dos potenciais fora da identidade de cor do comandante. Com dois comandantes, vale a união das duas identidades.

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
  "estrategia": {
    "inicio": {"turnos": "1 a 4", "plano": "...", "fortes": ["..."], "fracos": ["..."]},
    "meio": {"turnos": "5 a 8", "plano": "...", "fortes": ["..."], "fracos": ["..."]},
    "fim": {"turnos": "9 em diante", "plano": "...", "fortes": ["..."], "fracos": ["..."]},
    "contra": [{"tipo": "aggro", "resultado": "fraco", "porque": "..."}]
  },
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

**Campos de toda carta.** `tier` (S A B C D), `rel` (INS ALT MED BAX), `faz` e `porque` são obrigatórios. Opcionais: `massa` (remoção em massa), `pontual` (remoção em massa que também responde a um alvo), `virado` (terreno que sempre entra virado), `gera` (cores que o terreno gera, como `"WB"` ou `"C"`; sem ele, vale o que o Scryfall diz), `prioridade` (ordem sugerida na fila de corte, 1 sai primeiro), `fora_do_corte` (candidata a carta de estimação: nunca entra na fila de corte nem é sugerida como saída; no Valgavoth, as cartas nascidas na DSC), `pacote` (fixa o quadro da carta na aba 8×8), `caro_por_desenho` (`true` quando a carta custa menos na prática: redução de custo, custo alternativo, protótipo ou aventura; fica fora da conta de custo). No radar, também `veredito` (entra, avaliar, fora) e `sai`, o nome de uma carta do deck.

**Marcadores.** São do deck: Vampiro e saída de sacrifício no Ritos; Anjo, ganho de vida e proteção no Coro. Um marcador com `subtipo` é dado pelo tipo da carta, sem precisar marcar à mão; `subtipo` aceita um tipo ou uma lista (`["Wolf", "Werewolf"]` na Lua da Matilha). Os demais vão em `marcas` de cada carta, com valor 1 ou um número que a leitura pode distinguir.

**Estratégia.** Opcional, mas todo deck novo nasce com ela (decidido pelo dono em 08/10/2026). Três fases, `inicio`, `meio` e `fim`, cada uma com `turnos`, `plano` (obrigatório), `fortes` e `fracos` (listas de frases). Em `contra`, até oito arquétipos, sem repetir: `aggro`, `voltron`, `combo`, `controle`, `stax`, `aristocratas`, `spellslinger` e `ramp`, cada um com `resultado` (`forte`, `equilibrado` ou `fraco`) e `porque`. O painel mostra a seção na Visão geral, logo depois das leituras.

**Preços.** Vêm do Scryfall, em dólar, carta a carta (`usd` e `usd_foil`), e o painel soma o deck inteiro e cada faixa de relevância. O cache consulta de novo a carta com mais de 7 dias, para o preço ficar em dia; sem rede, vale o último preço guardado.

**Leituras.** Os diagnósticos do painel, cada um com seus limiares e textos:

| `tipo` | Campos | O que diz |
|---|---|---|
| `terrenos` | `min`, `ref` | Fontes de terreno (terrenos e cartas duplas com terreno no verso). |
| `agrupamento` | `g`, `min`, `rotulo` [singular, plural], `passagem`, `alerta`, `farto` {`min`, `texto`} | Cartas dedicadas de um agrupamento, as de passagem (omitidas quando são zero) e a referência. |
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
- `modo`: `escuro` (padrão) ou `claro`. O claro põe a classe `claro` na página, e o CSS troca o que foi desenhado para fundo escuro (selos de relevância e veredito, campos, botões, letras da tier list). A paleta do tema tem de ser clara: fundo e painel claros, texto escuro, `acento_claro` mais escuro que `acento`. Primeiro uso: Catedral dos Vivos.
- `moldura`: `retrato` (padrão, decidido pelo dono em 08/10/2026) recorta a arte num arco, com o texto e o gráfico ao lado, tudo na primeira tela, como o Ritos de Sangue; `larga` mostra a arte inteira em paisagem, com o gráfico abaixo, e fica só como opção. `foco` posiciona o recorte; `avatar`, o círculo da barra.
- `grafico`: `rosacea` (pétalas, do Ritos), `fios` (lâminas com um X de luz atravessando as frestas, do Dízimo das Almas), `chamas` (línguas de fogo com a estrela de impacto no centro, do Round Extra), `estandartes` (flâmulas com rabo de andorinha e o placar num escudo heráldico, da Catedral dos Vivos), `alfinetes` (alfinetes de cabeça colorida espetados numa almofada de costura, do Chá das Maldições), `rebites` (os agrupamentos como painéis da saia de um Dalek, com três rebites que acendem conforme os pontos e o olho azul no domo central, do Mestre do Mal), `coroa` (pontas de coroa com uma pedra preciosa na ponta, na cor do agrupamento, do Trono Inabalável), `presas` (presas de serpente curvas com uma gota de veneno na ponta e um nó entrelaçado no centro, das Presas da Serpente), `espinhos` (coroa de espinhos curvos com um botão de rosa no centro, da Sangria Sagrada), `frascos` (frascos de Sangue de fundo redondo, com rolha, que enchem até a soma das notas, e uma gota de sangue atrás do placar, do Baile Carmesim), `runas` (pedras rúnicas que acendem de baixo para cima com a soma das notas, uma runa que se ilumina quando a luz chega nela e a lanterna atrás do placar, da Lanterna do Medo), `cascos` (cascos de tartaruga em que a cor sobe com a soma das notas e as placas do meio acendem, a bandana azul do Leonardo atrás do placar e o aro de uma tampa de bueiro, do Cowabunga), `leque` (raios art déco em três degraus que acendem quando a cor passa, um colar de pérolas com pingente em volta do placar e um sol de raios curtos por fora, da Coleção da Cobiça), `asas` (as oito penas do Coro da Alvorada, quatro de cada lado, abrindo de uma auréola com o placar; só com 8 agrupamentos, senão o painel usa o desenho padrão) ou `padrao`. `curva`: `ogiva` ou `barra`. `textura`: `vitral`, `fios` (treliça fina em diagonal e um clarão vindo do alto), `impacto` (linhas de velocidade em diagonal e um clarão quente), `brasao` (quadrifólios dourados em quincôncio), `papel` (papel de parede listrado, à luz de vela), `colmeia` (malha hexagonal e um clarão vermelho), `ogivas` (arcos góticos em filete dourado), `neve` (flocos espalhados e névoa fria), `damasco` (medalhões de brocado em ouro discreto), `cortinas` (bambinela em festões logo abaixo da barra e pregas de veludo que somem para baixo, como um palco de ópera), `entalhe` (nós nórdicos entalhados em pedra, como a moldura de Kaldheim, e a luz fria vinda do alto), `redemoinho` (ondas em arco e bolhas, a espiral de água da capa das Tartarugas), `deco` (leques art déco em filete de latão e o brilho do batom no alto), `padrao` ou `nenhuma`. Em `fontes`, `titulo_escala` reduz o título do topo (0,7 para a Cinzel, que é larga).
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
python motor/imagens.py --deck "02. Clavileño"
python motor/imagens.py --todos
```

Cada carta do deck e do radar entra; os potenciais, não. Carta já no cache não é baixada de novo. Capa: usa o `capa.*` da pasta; sem ele, baixa o `art_crop` do comandante como `capa.jpg`.

`motor/build.py --imagens` controla o que vai no HTML: `embutidas` (padrão) lê `cache/img/` e embute cada imagem como `data:` URI, indexada pelo id da carta; `externas` deixa `D.img` vazio e o painel tenta o Scryfall ao vivo, como antes do `/imagens`; `nenhuma` também deixa vazio e começa com as imagens desligadas (`tema.json` não tem campo para isso; é só do build). Build sem rodar o `/imagens` antes simplesmente não encontra nada no cache e sai como `externas`, sem erro.

Com o pacote embutido, a página publicada também mostra as imagens: `data:` URIs não são conteúdo externo, então passam onde o Scryfall ao vivo é bloqueado. O botão de ligar e desligar aparece na Galeria mesmo publicada, porque desligar continua sendo escolha do dono.

## Onde o estado do usuário mora

Edições feitas dentro de um painel (tier, notas, trocas, anotações) ficam naquele painel: no navegador, se for arquivo local, sob a chave `mtg-hub:<pasta>:v1`; na conta, se for página publicada, em `data/users/<id>/painel`. O hub mostra a foto do último build, não essas edições. Para o hub refletir uma mudança de verdade, ela precisa voltar para `dados/<pasta>/` (pela Oficina, com o `/importar-backup`) e passar por um build.

O formato do estado é o do Ritos, com a data da última gravação. Backups do Ritos e do Coro antigos continuam abrindo.

## O hub

Feito na etapa 4 (`motor/hub.py`, `motor/hub/`), ajustado em 08/10/2026 a pedido do dono. `python motor/build.py --hub` grava `saidas/00. Hub.html` e o atalho `Abrir o Hub.html` na raiz; `--todos` remonta o hub no fim.

- **Três abas.** **Decks**, os cartões por grupo; **Pastas**, as oito pastas de cartas do dono, à espera das listas; **Dashboard**, ao lado da busca, com números cruzados.
- **Endereço de cada aba** (11/10/2026): `#decks`, `#pastas` e `#dashboard`, e `#d-<seção>` para as seções do Dashboard. Trocar de aba grava o endereço e volta ao topo; atualizar a página, ou voltar e avançar no navegador, abre a aba que o endereço diz. Sem endereço, abre em Decks.
- **Grupos:** na ordem do aplicativo: 01. Top, 02. Tribais, 03. Caos, 04. Forfun e Compras + Precon. O grupo é o número no nome da pasta; `05.` é Compras + Precon. Mover de grupo é renomear a pasta.
- **Cartão:** capa (`capa.*` da pasta, reduzida e embutida), o nome do deck (o nome da pasta, sem o número do grupo), o nome do painel ou o comandante, as cores e, nos decks com painel, só os pontos, no canto superior direito. Sem selo de situação: OK e nOK ainda não têm regra definida. Deck sem avaliação aparece com fundo neutro e "Em construção", ou com a capa e um selo pequeno de "em construção" quando a capa já chegou.
- **Dashboard:** dez seções, refeito em 09/10/2026 a pedido do dono, com olhar de auditor, de FP&A e de análise de sensibilidade. **Resumo** (números da carteira, o que pede atenção por gravidade, rotina de conferência); **Mesa** (contra quem cada deck vai bem, e um seletor que ordena os decks pela mesa montada); **Fundamentos** (fontes, ramp, compra e remoção contra a referência, e os alertas de cada painel); **Trocas** (custo, valor que sai, saldo, placar com as trocas, retorno por dólar, trocas que o placar não paga e um simulador por deck); **Placar** (degraus da aceleração e do CMC, folgas, onde mora a força de cada deck); **Mana** (fórmula de Karsten de 2022, probabilidade hipergeométrica de cumprir as quedas de terreno e de baixar o comandante na curva, demanda e oferta de cada cor); **Valor** (por deck e relevância, as dez mais caras, dinheiro na berlinda, prêmio do foil); **Auditoria** (conferências, calibração da régua de relevância, tier contra relevância, as análises de fora pelo `CONFRONTO.md`, frescor das fontes); **Compartilhadas** (cópias físicas e capital, o radar entre os decks); **Carteira** (o álbum das 32 combinações de cores com os nomes, perfis, mecânicas e outros nomes da Draftsim, a cara da carteira, a lista de conferência tenho/falta, a roda das guildas, cores, andamento da análise e criaturas por deck).
- **Como o Dashboard conta:** o build empacota, em cada deck com painel (`d.a` no JSON do hub), as cartas e o radar em chaves curtas, os agrupamentos, as leituras, a estratégia, os combos, a comunidade e a data de cada fonte; `HISTORICO.md` e `CONFRONTO.md` são lidos pelos títulos das seções, e se o formato mudar o deck só sai daquele quadro. As contas são feitas no navegador com a mesma lógica do painel (`stats` e `readings` de `motor/painel/app.js`), para o simulador e a mesa responderem na hora. **Leitura nova no painel tem de entrar também na função `leituras` de `motor/hub/app.js`.** O placar nunca é somado nem ranqueado entre decks: ele compara o deck com ele mesmo. `testes/hub.py` confere o placar e o placar com as trocas contra o motor, contra uma conta independente em Python e contra os controles, e os alertas contra a leitura de cada painel.
- **Limiares do Dashboard:** preço velho depois de 7 dias (o mesmo do cache), comunidade depois de 30, avaliação depois de 90; descasamento de cor a partir de 10 pontos percentuais; tier e relevância "colados" quando coincidem em 90% das cartas ou mais, sem os básicos; régua de relevância de 12 a 28% INS, 30 a 50% ALT, 20 a 40% MÉD e 6 a 14% BAX, em torno do 20/40/30/8-10 do método.
- **Painel e hub:** cada painel tem um botão de voltar ao hub, no canto da barra. Na página publicada ele some, porque o hub não vai junto.
- **Fontes:** as pastas de `dados/`, o `contexto/inventario.csv` (comandante, cores e prioridade dos decks sem painel), o `cache/scryfall.json` (data de lançamento das impressões sem preço) e o resumo de cada deck com avaliação.
- **Limite:** as edições feitas dentro de um painel não chegam ao hub; ele mostra a foto do último build.

## Atalhos que funcionam sem internet

`Abrir o Hub.html`, na raiz, leva ao hub. Cada pasta de deck ganha `Abrir o painel.html`, que o build grava a cada montagem. Tudo por caminho relativo.

## A aba 8×8 de cada painel

Foi acrescentada em 10/10/2026, a pedido do dono, entre a Tier list e o Tabelão. Mostra um quadro por agrupamento do deck, mais um de Mana, para ver qual pacote está cheio ou pede reforço, na linha da teoria 8×8 (35 de mana e 64 cartas em oito pacotes de oito). **É só para enxergar:** arrastar uma carta de um quadro para outro simula o equilíbrio e não muda as notas, o tier nem o placar. A simulação fica em `S.pk` (no navegador, ou na conta se publicado), vai no backup e se desfaz com um botão.

- **Pacote primário.** Cada carta conta em um só quadro: o agrupamento de maior nota (empate: o primeiro da ordem do deck). Terreno e carta dupla com terreno no verso ficam em Mana. Carta sem nota em nenhum agrupamento vai para um quadro "Sem pacote", que só aparece quando há alguma. Para fixar o pacote de uma carta, ponha `"pacote": "<chave do agrupamento>"` (ou `"mana"`, `"sem"`) no `avaliacao.json`; o motor recusa uma chave que não exista.
- **Referência.** Cada quadro mostra o número de cartas contra a faixa `ref` do agrupamento; sem `ref`, vale 8. Mana vale de 35 a 37, ou de 34 a 36 com dois comandantes, que ocupam uma vaga a mais. A referência é guia, não regra de corte.
- **Para trocar com sabedoria.** Cada quadro mostra a carta mais fraca (pela mesma ordem da fila de corte) e as cartas do radar cujo pacote primário é aquele. Passando o mouse numa do radar, aparece quem sairia.
- **O comandante** fica fora da contagem.

## Custo de mana: o que faria o mesmo por menos

Acrescentado em 10/10/2026, a pedido do dono: carta que chega mais cedo pesa mais no jogo. A conta mora em três lugares do painel e num do Dashboard, sempre com a mesma regra.

- **A regra.** Uma troca do radar *baixa o custo sem perder o papel* quando a carta que entra custa pelo menos 1 a menos que a que sai, fica no mesmo pacote do 8×8, é do mesmo tipo de remoção (limpeza de mesa só troca por limpeza de mesa), tem nota igual ou maior nesse pacote e tier igual ou melhor. Ficam fora da conta: terrenos, o comandante, custo variável (`{X}` no custo), cartas com terreno no verso e as marcadas com `caro_por_desenho`. Cada carta do radar é sugerida para uma carta cara só, da mais cara para a menos cara.
- **Como se mede o ganho.** Em mana (custo da que sai menos o da que entra), em turno e no deck inteiro. Turno: carta de custo 2 ou menos sai no turno do próprio custo; acima disso, com dez ou mais peças de Ramp de nota 2 ou 3, no turno custo − 1 (nunca antes do 2); sem isso, no turno do custo. Deck: CMC médio, CMC somado, cartas de custo 6 ou mais e placar, hoje, com as trocas marcadas para entrar e só com as que baixam o custo sem perder o papel.
- **Visão geral, quadro "Custo e curva".** A tabela de antes e depois, as trocas do radar que baixam o custo e as mais caras do deck (custo 5 ou mais), cada uma com a carta mais barata do mesmo pacote no radar (a da própria troca, quando a carta já sai para uma mais barata) e o aviso quando o radar já a tira para outra carta entrar. Sem ela no radar, aponta até dois potenciais do mesmo tipo que custam 2 ou mais a menos, avisando que ainda não têm avaliação. Diz quando a carta mais barata já está no deck de outro. Tier S, intocáveis e cartas de estimação não entram na lista das mais caras: o custo delas é o plano.
- **Radar.** Cada cartão com quem sai mostra a diferença de mana, o turno em que a carta chega, se mantém o papel e se pede mais de uma cor.
- **8×8.** Cada quadro mostra a mais cara do pacote (custo 4 ou mais, pela mesma regra) e a do radar que faria o mesmo por menos.
- **Dashboard, seção Trocas.** A coluna "CMC médio" (antes e depois das trocas recomendadas), "Trocas que baixam o custo" de todos os decks e "As mais caras sem troca barata no radar" (custo 6 ou mais), que é por onde começar a procurar carta nova.
- **Falta:** buscar no Scryfall cartas mais baratas que façam o mesmo, para além do radar e dos potenciais. Fica para um comando novo.

## Cartas entre decks e pastas

Acrescentado em 10/10/2026, a pedido do dono, para trocar de lugar em vez de comprar duas cartas: uma carta que pesa pouco num deck pode ser forte em outro, ou já estar numa pasta.

- **Na gaveta de cada carta** (as janelas do painel), a seção "Em outros decks e pastas" lista onde a carta aparece nos outros decks, no deck ou no radar, com o tier e a relevância de cada lugar. Diz quando a carta "pesa mais" em outro deck, quando a carta do radar já está no deck de outro ("se for a mesma cópia, ela sai de lá") e em que pasta ela está.
- **Como o painel sabe.** O build lê a `avaliacao.json` de todos os outros decks (`dados.indice_outros`) e grava no painel só as cartas que aparecem nele, em `D.outros`. As pastas vêm de `dados/pastas/<nome da pasta>.txt` (`dados.ler_pastas`; uma linha por carta, `2 Nome da carta`, com ou sem `(SET) 123` depois), em `D.em_pastas`. Chave de comparação: o nome do Scryfall, sem a face de trás e em minúsculas. É a foto do último build de cada deck: se outro deck mudou, é preciso montar de novo.
- **No Dashboard do hub**, a seção Compartilhadas ganhou "Onde cada carta rende mais" (as cartas que aparecem em dois ou mais lugares com tiers diferentes, ordenadas pela maior diferença) e "O radar contra as pastas" (o que o radar pede e já está numa pasta). A coluna "Onde" da tabela de cartas em mais de um deck passou a mostrar o tier. Sem lista de pasta, a caixa das pastas avisa que as listas ainda não chegaram.
- **Falta:** o formato definitivo das listas das pastas fecha quando a primeira chegar; hoje só o texto simples é lido.

## A Oficina de cada painel

O painel não tem IA dentro dele quando é um arquivo local. A aba Oficina faz a ponte: lista o que dá para pedir ao Claude Code sobre aquele deck, com o comando já preenchido com o nome da pasta e um botão de copiar. Hoje: auditar, atualizar com uma análise nova, comparar duas cartas, avaliar coleção nova, atualizar a leitura da comunidade, trocar a capa, propor variações de tema, conferir a decklist, e levar ao projeto o que foi editado no painel, com o backup copiado junto. O caminho de volta é o `/importar-backup`.
