# Caixa

As cartas que estão numa caixa, sem destino. A página da Caixa (`Abrir a Caixa.html`, na raiz do projeto) mostra cada uma com onde ela rende mais, a força sozinha, quem a joga no EDHREC e quanto vale, e guarda a sua decisão cópia a cópia.

## Para pôr cartas novas

1. Exporte só o lote novo. No ManaBox, em CSV (traz coleção, número, foil e idioma, e o preço depende disso). Texto no formato da decklist também serve: `1 Nome da carta (SET) 123`, com `*F*` para foil.
2. Salve em `dados/caixa/listas/`, com um número na frente: `02. lote 20-10.csv`, `03. lote 25-10.csv`.
3. Exportou a caixa inteira de novo, com as cartas antigas junto? Substitua o arquivo antigo, com o mesmo nome. Se somar um arquivo novo, as cartas contam em dobro.
4. Peça no Claude Code: `/caixa`. Ele lê as listas, consulta o Scryfall e o EDHREC do que é novo, dá entrada no cadastro às cartas novas, avalia a sinergia (mostrando antes de gravar), monta a Caixa e o hub e mostra o resumo.

Não edite nem apague linhas das listas para tirar o que saiu: isso é feito pela decisão na página e pelo `/caixa aplicar`. As listas ficam como registro do que entrou.

## O que mora aqui

| Arquivo | O que é | Quem mexe |
|---|---|---|
| `listas/` | Uma lista por lote, como saiu do aplicativo | Você |
| `decisoes.json` | As decisões da Caixa, cópia a cópia (o banco da Caixa publicada prevalece) | A página e o `/caixa` |
| `compras.json` | O retrato da lista de compras do hub publicado | O `/caixa` |
| `bundles.txt`, `bulk.txt` | O que foi para Bundles e para o Bulk | O `/caixa aplicar` |
| `HISTORICO.md` | O que saiu da caixa, decisão a decisão | O `/caixa aplicar` |
| `link.txt` | O link da Caixa publicada | O `/publicar` |

As pastas físicas (Preta P, Rosa (sell) e as outras) ficam em `dados/pastas/`. Uma pasta com lista aparece na mesma página, em "Lista", com as mesmas decisões: mover para outra pasta, ir ao radar de um deck ou remover.
