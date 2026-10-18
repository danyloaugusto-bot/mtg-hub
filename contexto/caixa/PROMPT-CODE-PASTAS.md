# Pedido para o Claude Code: pastas lidas do ManaBox e valor de hoje (18/10/2026)

Cole a partir da linha "Leia", no Claude Code, em `C:\Projetos\mtg-hub`, com o motor livre.

---

Leia `CLAUDE.md`, `dados/pastas/LEIA-ME.md`, `dados/caixa/LEIA-ME.md` e, em `motor/caixa.py`, `ler_csv`, `ler_txt`, `origens`, `montar(origem=...)`, `_tirar_da_pasta` e `aplicar`; em `motor/dados.py`, `ler_pastas`.

O dono criou `dados/pastas/Preta P/` e pôs lá o export do ManaBox, `Pasta Preta.csv` (20 cartas). Hoje o motor só lê pasta em `dados/pastas/<pasta>.txt`, então essa lista não aparece em lugar nenhum. Trabalhe num ramo `pastas`. Pare e mostre o resultado ao fim do passo 3.

## 1. Pasta é uma subpasta, e o ManaBox é a verdade

- `dados/pastas/<pasta>/`: todos os `.csv` e `.txt` dentro dela, lidos com os mesmos `ler_csv` e `ler_txt` da Caixa e somados. O nome da pasta é o nome da subpasta e precisa bater com `hub.PASTAS` (avise se não bater). O formato antigo `dados/pastas/<pasta>.txt` continua valendo.
- `dados.ler_pastas` (o leitor leve, dos painéis e do hub) e `caixa.origens` / `montar(origem=...)` passam a usar esse leitor. Com isso, a Preta P aparece no seletor "Lista" da página da Caixa e nas referências cruzadas ("está na pasta Preta P") dos painéis e do hub.
- **Os arquivos que o dono exporta nunca são editados pelo motor.** Numa pasta em subpasta, toda decisão (Mover, Venda, Deck, Remover, e também Guardar ou Venda vindos da Caixa para essa pasta) vira **tarefa para o dono fazer na mão e no ManaBox**. Ela é dada como feita no próximo export: a cópia sumiu do arquivo da pasta de origem (e, no Mover, apareceu no da pasta de destino). Até lá, a tela mostra "a fazer no ManaBox". `_tirar_da_pasta` só edita o `.txt` antigo, nunca uma subpasta.
- Export novo da pasta inteira substitui o arquivo antigo, com o mesmo nome (como na Caixa). Escreva isso no `dados/pastas/LEIA-ME.md`.

## 2. O que mais o CSV do ManaBox traz

Colunas hoje ignoradas que passam a ser lidas, só na página da Caixa (a única com preço):
- `Proxy`: selo "proxy", nunca Venda, e não conta como cópia que pode ir para deck.
- `Signed`, `Altered`, `Misprint`: selos na carta (o preço do Scryfall não reflete isso; a tela avisa).
- `Rarity`: na linha do tipo.
- `Purchase price` e `Purchase price currency`: **não é o valor de hoje** (é o que o ManaBox gravou no cadastro e fica congelado). Mostre só na gaveta, discreto, como "no cadastro do ManaBox (data de `Added`): R$ X". Nunca entra em regra nem em soma.

## 2b. Valor de hoje, atualizado quando o dono pedir

O objetivo do dono: saber quanto cada carta vale **hoje**, depois de uma atualização de tudo ou de uma origem só, para decidir se compensa mandar para a pasta de venda e comprar cartas melhores para outros decks.

- **Atualizar preços sob demanda:** `python motor/caixa.py --precos` (Caixa e todas as pastas) e `--precos --origem "Preta P"` (ou `--origem Caixa`). Consulta o Scryfall de novo para essas impressões, ignorando a validade de 7 dias do cache (100 ms entre chamadas, `User-Agent`), e monta a página. Comando `/precos [origem]` em `.claude/skills/precos/SKILL.md` (modelo intermediário, esforço baixo).
- **Data em tudo:** cada origem mostra "preços de DD/MM" no topo; com mais de 7 dias, aviso "preços com N dias: rode /precos".
- **Variação desde a atualização anterior:** guarde, por cópia, o preço anterior e a data dele (`dados/precos/ultimo.json`, só o anterior e o atual, sem série histórica). A tabela mostra a variação ao lado do valor quando passar de 10% para cima ou para baixo.
- **Em reais:** `cambio_brl` em `motor/caixa.json` aceita `"ptax"` (padrão novo), um número fixo, ou `null`. Com `"ptax"`, o `/precos` busca a cotação de venda do dólar do último dia útil na API de dados abertos do Banco Central (PTAX, `olinda.bcb.gov.br`, `CotacaoDolarPeriodo`), guarda em `cache/cambio.json` com a data, e a página mostra "≈ R$" ao lado de cada US$ e nos totais, com "dólar PTAX R$ X de DD/MM" no topo. Se a API falhar, usa a última cotação guardada e avisa. As regras continuam em dólar (US$ 5 e US$ 20).
- **Vender para comprar** (seção nova da página da Caixa, aberta por um botão no topo). Duas colunas, a mesma régua de preço dos dois lados (US$ do Scryfall de hoje, e ≈ R$ pela PTAX):
  - **Fontes:** as cópias com decisão ou sugestão Venda, mais as marcadas "capital parado" e "cara para o que rende", de todas as origens, com o valor de hoje e a soma. `fator_venda` em `motor/caixa.json` (padrão 1.0) é quanto o dono recebe de fato vendendo ou trocando, em fração do preço; a soma mostra o bruto e o líquido.
  - **Usos:** a lista de compras (o retrato em `dados/caixa/compras.json`) e as cartas do radar como "entra" que o dono não tem em deck, Caixa ou pasta, com o preço de hoje, o melhor encaixe ("rende mais em": deck, ganho e quem sai) e a coluna "cabe no que você tem para vender": ordenadas pelo ganho, com a soma acumulada do preço até o líquido das fontes. Frase de fechamento com os números: "Com o que está marcado para venda (≈ R$ X), você compra estas N cartas, que somam +G nos decks."
  - Sem preço no cache: a carta aparece com "sem preço" e fica fora das somas.
- Nada disso aparece no hub nem nos painéis.

## 3. Legalidade no Commander

O cache do Scryfall não guarda legalidade, e a Preta P tem Mana Crypt e Dockside Extortionist, banidas no Commander desde setembro de 2024.
- `motor/scryfall.py`: guardar `legalities.commander` no registro de cada carta (vale para todo o cache, na próxima atualização de 7 dias ou com `--atualizar-scryfall`).
- Caixa e pastas: carta `banned` ganha o selo "banida no Commander", nunca recebe Deck, e a sugestão vai para Venda (com preço) ou Guardar.
- Painéis e radares: carta banida no deck ou no radar gera aviso no build (não recusa) e uma linha nas leituras do painel. Não mude nenhuma decklist.

Pare e mostre: a Preta P no seletor da Caixa, em tabela, com as 20 cartas; as duas banidas marcadas; o K'rrik PJ21 foil marcado como "mesma cópia?" do comandante do 03. K'rrik (mesma impressão); o resumo da leitura (linhas, cópias, colunas ignoradas); e o resultado de `--precos --origem "Preta P"`: quantos preços mudaram, a cotação PTAX usada, e a seção Vender para comprar em 1360px.

## 4. Fechamento

Testes: `testes/caixa.py` ganha uma pasta de mentira em subpasta com CSV do ManaBox (as colunas acima), o caso da tarefa feita pelo export, uma proxy, uma banida e o formato antigo `.txt`; o `--precos` com Scryfall e PTAX de mentira (sem rede), a variação acima e abaixo de 10%, o fallback da cotação e as somas de Vender para comprar (bruto, líquido, acumulado). `testes/hub.py` segue sem preço no hub e nos painéis. Atualize `contexto/ARQUITETURA.md` ("Cartas entre decks e pastas" e "A Caixa"), `CLAUDE.md` (mapa de pastas), `contexto/ESTADO.md`, e faça o commit `pastas: subpasta do ManaBox, tarefas, legalidade e preços de hoje`. O arquivo `dados/pastas/Preta P/Pasta Preta.csv` é do dono e entra no commit.
