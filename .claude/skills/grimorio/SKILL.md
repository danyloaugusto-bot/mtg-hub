---
name: grimorio
description: "Atualiza o Grimório (as melhores cartas por lente: tribos, cores, critérios, 8×8), classifica as cartas novas pela rubrica e remonta a página ao lado do Dashboard."
argument-hint: "atualizar [lente] | classificar | publicar"
model: sonnet
effort: high
disable-model-invocation: true
---

# /grimorio

Alvo: $ARGUMENTS

O Grimório é a página irmã do Dashboard (`saidas/00. Grimório.html`, `contexto/grimorio/METODO-GRIMORIO.md`). Ele lê o EDHREC e o Scryfall, cruza com os decks, as pastas e a Caixa, e diz onde cada carta já está e onde renderia mais. Ele **não muda** os dez critérios, o placar, as decklists nem o radar de nenhum deck.

Com `atualizar`: relê todas as lentes (ou só a lente nomeada), recalcula status e novidades e remonta a página. É o comando de rotina a cada coleção nova (2 a 3 meses). Com `classificar`: dá nota 3 a 10 às cartas do Grimório que ainda não estão no cadastro v3, em lotes, com o modelo forte (`/model opus` antes). Com `publicar`: publica a página e grava o link.

# Arquivos

- Lê: `dados/grimorio/lentes.json`, `dados/grimorio/grimorio.json`, `dados/grimorio/leitura.json`, o cache do EDHREC e do Scryfall, `dados/cartas.json`, os `avaliacao.json` e `decklist.txt` dos decks, as pastas e a Caixa, `contexto/pontuacao/RUBRICA.md` (só em `classificar`).
- Grava: `dados/grimorio/grimorio.json`, `leitura.json`, `link.txt`, `cache/edhrec/lentes/`, `cache/img/`, `saidas/00. Grimório.html`, o hub (só o link), `contexto/ESTADO.md` ao fim; em `classificar`, as notas no cadastro `dados/cartas.json` (pelo caminho de sempre do cadastro).
- Nunca: `decklist.txt`, `avaliacao.json`, os dez critérios, os pesos, as listas da Caixa e das pastas, `lentes.json` (é do dono: lente nova, ele edita).

# Passos

**atualizar**

1. `python motor/grimorio.py --ler [lente]`. Leia o resumo: lentes lidas, lentes sem leitura (com o motivo), cartas que o Scryfall não achou, banidas que ficaram fora. Caminho do EDHREC que mudou: anote no `leitura.json` e no `ESTADO.md`; não invente lista.
2. `python motor/grimorio.py --status`: onde está, status, novidades, onde rende, pontas de lança.
3. `python motor/imagens.py --grimorio` para as cartas sem imagem no cache.
4. `python motor/build.py --grimorio` e `python motor/build.py --hub` (o hub só muda o link). Rode `python testes/grimorio.py` e `python testes/layout.py --grimorio`.
5. Mostre ao dono: quantas cartas e lentes, as novidades por coleção (novas e reimpressões), as cartas Falta entre as 10 mais incluídas de cada lente que ainda **não têm nota** (candidatas ao `classificar`), e as lentes sem leitura. Termine com a frase do `ESTADO.md`.

**classificar**

1. `python motor/grimorio.py --classificar <dossie.json>`: as cartas sem nota, com o texto do Scryfall, na ordem do método (Falta e Ociosas no top 20 de cada lente primeiro). Lotes de 50.
2. Para cada carta do lote, as notas 3 a 10 pela rubrica, lendo o texto do dossiê, nunca de memória, com a frase de porquê e `so_com` quando a nota depende do tipo (como nos lordes). **Mostre o lote antes de gravar** (carta, notas, porquê, os casos discutíveis, no máximo cinco) e espere o "pode".
3. Grave no cadastro pelo caminho de sempre (`fonte: "claude"`, `revisado` com a data). Depois `python motor/grimorio.py --status` e `python motor/build.py --grimorio`, para o "onde rende" dessas cartas aparecer.

**publicar**

1. Só com o "pode publicar" do dono. Publique `saidas/00. Grimório.html` como artefato próprio (link em `dados/grimorio/link.txt`), **sem `capabilities`**, e remonte o hub para a pílula apontar ao link publicado.
2. As imagens não vão dentro do HTML: são folhas de 2×2 cartas no tamanho grande do Scryfall (672 px, `cache/img-grande/`, baixadas pelo `--ler` ou por `python motor/grimorio.py --imagens`), em `saidas/grimorio-img/`, publicadas junto com a página pelo `files` do Artifact (`root: saidas`, caminho `grimorio-img/<folha>.jpg`). Liste antes os arquivos publicados (`action: list`, `scope: files`), mande só as folhas novas, em partes de uns 20 MB (uma de 60 MB caiu na conexão), sempre no mesmo link, e `null` para as que sumiram de `saidas/grimorio-img/`. Folha com `-p` no nome foi feita com a imagem de 340 px: rode `--imagens` e remonte antes. Limites do artefato: 511 arquivos e 256 MB por versão.

# Regras

- Texto de carta nunca de memória; nota nunca pelo EDHREC.
- Sem preço no Grimório, no hub e no painel. Sem perguntas sobre bracket ou cartas de estimação.
- Os dez critérios são do dono e não mudam de conteúdo.
- Uma sessão por vez no motor: o `atualizar` não roda com outra sessão mexendo em `motor/`.
- HTML até 14 MB (as imagens ficam fora dele); se passar, o build reduz o teto por lente e avisa, e você diz ao dono.

# Pronto quando

- `saidas/00. Grimório.html` abre com as seis sub-abas e a data de hoje no campo de atualização; a pílula Grimório está à direita do Dashboard no hub.
- `testes/grimorio.py` e `testes/layout.py --grimorio` passam.
- `contexto/ESTADO.md` tem a linha da leitura: data, cartas, lentes lidas e sem leitura, novidades, e quantas cartas esperam o `classificar`.
