---
name: ciclos
description: "A aba Ciclos: acrescenta os ciclos de uma coleção nova à lista do dono, confere no Scryfall, dá as notas das cartas sem cadastro em lotes e remonta a página."
argument-hint: "atualizar [nome da coleção] | classificar | ler"
model: opus
effort: high
disable-model-invocation: true
---

# /ciclos

Alvo: $ARGUMENTS

Os Ciclos são a página irmã do Grimório e da Consulta (`saidas/00. Ciclos.html`, `motor/ciclos.py`, desenho em `contexto/ciclos/CICLOS.md`, pedido em `contexto/ciclos/PROMPT-CODE-CICLOS.md`). A lista é do dono: `dados/ciclos/ciclos.json`, uma linha por carta (ano, coleção, código, ciclo, tipo do ciclo, carta, a cor da vaga no ciclo, raridade, observação, verificar). O motor confere cada carta no Scryfall, baixa a imagem, diz onde ela já está, em que deck cabe (identidade do comandante, regra 6), o grau no vácuo (a régua da Consulta) e onde renderia (a conta da Caixa). Sem preço. Nada aqui grava em deck, radar ou lista do dono sem o "pode".

# Arquivos

- Lê: `dados/ciclos/ciclos.json`, o cache do Scryfall e das imagens, `dados/cartas.json`, os decks, as pastas e a Caixa, `contexto/pontuacao/RUBRICA.md` (no `classificar`).
- Grava: `dados/ciclos/ciclos-lido.json` e `leitura.json` (gerados), `dados/ciclos/ciclos.csv` (a cópia para o Excel), `saidas/00. Ciclos.html`; no `atualizar`, as linhas novas em `dados/ciclos/ciclos.json`, com o "pode" do dono; no `classificar`, as notas em `dados/cartas.json` pelo caminho de sempre do cadastro.
- Nunca: `decklist.txt`, `avaliacao.json`, os dez critérios, os pesos.

# Passos

**atualizar [coleção]**

1. Com o nome de uma coleção: pesquise os ciclos dela (a página da coleção no mtg.wiki ou no mtg.fandom.com, seção *Cycles*) e monte as linhas no formato do `ciclos.json`: `ano`, `lancamento` (AAAA-MM), `colecao`, `codigo`, `ciclo`, `tipo_ciclo` (Mono, Bicolor, Tricolor, Identidade, Incolor, Sabor), `carta`, `cores` (a vaga no ciclo), `cores_nome`, `qtd_cores`, `raridade`, `raridade_nome`, `observacao`, `verificar` ("SIM" no que não conferiu). O nome de cada carta vem da fonte, nunca de memória; se a fonte não lista os nomes, pare e diga.
2. **Mostre ao dono o que entraria** (coleção, ciclos, cartas por cor) e espere o "pode". Com o "pode", acrescente as linhas ao `dados/ciclos/ciclos.json`, no fim.
3. Sem nome de coleção: só relê a lista como está (o dono acrescentou linhas à mão).
4. `python motor/ciclos.py --ler`: Scryfall, imagens e status. Leia o resumo: não encontradas (nome errado: conserte na lista ou fixe a impressão com `"scryfall": "set/número"`), divergências de raridade. Depois `python motor/ciclos.py --conferir` (resolve as linhas "verificar" que o Scryfall confirmou) e `python motor/ciclos.py --csv`.
5. `python motor/build.py --ciclos` e `python motor/build.py --hub`. `python testes/ciclos.py` e `python testes/layout.py --ciclos`.
6. Diga ao dono: quantas cartas e ciclos entraram, quais ficaram pendentes e por quê, e quantas esperam o `classificar`. Uma linha no `contexto/ESTADO.md`.

**classificar**

1. `python motor/ciclos.py --classificar <dossie.json>`: as cartas sem cadastro, com o texto do Scryfall, da coleção mais recente para a mais antiga. Lotes de 50 a 60.
2. Para cada carta do lote, as notas dos oito critérios da carta pela rubrica, lendo o texto do dossiê, nunca de memória, com a frase de porquê e `so_com` quando a nota depende do tipo (lordes, equipamentos). Confira as regras do dono no fim da RUBRICA.
3. O dono liberou os lotes em 24/10/2026 ("vai fazendo aos poucos, não precisa esperar meu ok"): grave cada lote no cadastro pelo caminho de sempre (`prenota.ler_cadastro` / `prenota.gravar_cadastro`, `fonte: "claude"`, `revisado` com a data) e siga. Liste os casos discutíveis (no máximo cinco por lote) no relatório do fim.
4. Depois de cada lote: `python motor/ciclos.py --status` e `python motor/build.py --ciclos`, para o grau e o "onde rende" aparecerem.

**ler**

`python motor/ciclos.py --ler`, `--conferir`, `--csv`, `python motor/build.py --ciclos`: a rotina de conferência sem mexer na lista.

# Regras

- Texto de carta nunca de memória; nota nunca pela fama. Identidade de cor é a do Scryfall; a cor da vaga é só o lugar no ciclo.
- Sem preço na página. Sem perguntas sobre bracket ou cartas de estimação.
- Lista do dono só muda com o "pode" dele (atualizar) ou pelo `--conferir`, que só resolve o que ele marcou "verificar".
- Publicar só com o "pode publicar": `saidas/00. Ciclos.html` por cima do link em `dados/ciclos/link.txt`, sem passar `capabilities`.

# Pronto quando

- `saidas/00. Ciclos.html` abre com as seis sub-abas e a data de hoje; o botão Ciclos está à direita da Consulta no hub.
- `testes/ciclos.py` e `testes/layout.py --ciclos` passam.
- `contexto/ESTADO.md` tem a linha da leitura: data, cartas, ciclos, coleções, pendentes e quantas esperam o `classificar`.
