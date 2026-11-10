---
name: colecao
description: "Avalia coleções inteiras contra todos os decks, pela mesma conta da Consulta, e leva ao radar o que tem ganho de Deck, com o pode do dono."
argument-hint: "<códigos das coleções no Scryfall, ex.: FRA TRK> | pendentes | controle"
model: opus
effort: high
disable-model-invocation: true
---

# /colecao

Pedido: $ARGUMENTS

O dono não quer consultar carta por carta (pedido de 09/11/2026, depois da Hall of Echoes, que devia ter chegado sozinha ao radar da Zara e do Fynn). Este comando passa uma coleção inteira pela conta da Consulta e leva ao radar o que rende. Motor: `motor/colecao.py`. Análise: `dados/colecoes/<CÓDIGO>.json`. Controle: `dados/colecoes/controle.json`.

Os códigos são os do Scryfall (https://scryfall.com/sets). Vários de uma vez, na ordem dada. `pendentes`: as coleções do controle em andamento. `controle`: só mostra o que já foi avaliado (`python motor/colecao.py --controle`).

# Fluxo, por coleção

1. **Ler.** `python motor/colecao.py --ler <CÓDIGO>`: as cartas legais no Commander, sem básicos, no cache do Scryfall.
2. **Lotes.** `python motor/colecao.py --dossie <CÓDIGO> <tmp>/lote.json` (40 cartas; `--tamanho` muda). O dossiê traz o texto do Scryfall, o cadastro (ou nada) e, por carta, os decks em que ela cabe e ainda é nova (fora os Desejo, o deck e o radar). As réguas das duas sinergias de cada deck vêm uma vez, no topo. Carta já consultada é reaproveitada sozinha; carta sem deck nas cores fica registrada.
3. **Analisar o lote**, lendo o texto, nunca de memória, e grave `<tmp>/sin.json`: `{carta: {"_cadastro": {"n": {critério: 1 a 3}, "por_que": "..."}, "<pasta>": {"sin": {"sin1": n, "sin2": n}, "sin_por_que": {"sin1": "frase citando a régua"}}}}`.
   - `_cadastro` só para carta sem cadastro, pela RUBRICA (`contexto/pontuacao/RUBRICA.md`, com as regras do dono no fim).
   - Só os decks com sinergia acima de 0; os outros ficam com 0 e 0.
   - Rode `python motor/colecao.py --sinergias <CÓDIGO> <tmp>/sin.json` e passe ao próximo lote, sem parar, até `faltam 0`.
4. **Resumo.** `python motor/colecao.py --resumo <CÓDIGO>`: por deck, as cartas com ganho de Deck (10+) e de Guardar (5 a 10), o "sai" do motor e as cartas do deck com o mesmo papel.
5. **Vereditos e parada.** Para cada carta com ganho de Deck: `entra`, `avaliar` ou `fora`, com o porquê, e o `sai` na prática (carta do mesmo papel, nunca tier S ou A, nunca carta com `fica`, de estimação, MDFC ou terreno que se sacrifica para buscar outro; terreno sai por terreno, para a cota de 33 a 35). Leia antes os digests de `contexto/estrategias/`: staple e remoção genérica só entram com buraco no critério ou no pacote 8×8 (conte as remoções e as limpezas do deck); deck perto do teto só com carta excelente. Precon intacto nunca recebe `entra`. **Mostre ao dono, por deck: carta, ganho, veredito, quem sai e o porquê; a lista "de olho" (Guardar) em uma linha por deck. Espere o "pode".**
6. **Gravar.** Com o "pode", grave `<tmp>/radar.json`: `{pasta: {carta: {"veredito", "tier", "rel", "faz", "porque", "sai"}}}` e rode `python motor/colecao.py --radar <CÓDIGO> <tmp>/radar.json`. A sinergia vai da análise; a carta sem cadastro ganha as notas da análise no `dados/cartas.json` (fonte claude). Depois `python motor/build.py --todos` (ou `--deck` de cada deck tocado e `--hub`), `python testes/colecao.py`, `python testes/todos.py --deck "<pasta>" --sem-montar` nos decks tocados e `python testes/hub.py`. O placar com as trocas pode mudar de propósito: atualize os controles e diga quais.
7. **Fechar.** Uma linha no `contexto/ESTADO.md` e no `HISTORICO.md` de cada deck tocado; commit só com o ok do dono, um por arquivo.

# Regras

- Texto de carta nunca de memória. Identidade de cor é inegociável (o motor já filtra).
- Sem preço no radar, no painel e no hub. Compra é decisão da lista de compras.
- Sem perguntas sobre bracket ou cartas de estimação. Nunca sugerir Sol Ring, Arcane Signet nem segunda Tergrid.
- Em Valgavoth, Demônio nunca é o corte.
- Nunca grave em `decklist.txt` nem `tema.json`.
- Modelo: dar nota a uma coleção inteira é a tarefa "aplicar a régua a muitas cartas" do `contexto/MODELOS.md`; avise se a sessão não estiver no indicado.
