---
name: consulta
description: "Analisa uma carta de fora (link do Scryfall ou nome) contra todos os decks: força sozinha, sinergia em cada deck, quem sairia, veredito e se vale comprar."
argument-hint: "<link do Scryfall ou nome da carta em inglês> | importar"
model: opus
effort: high
disable-model-invocation: true
---

# /consulta

Carta: $ARGUMENTS

A Consulta responde, para uma carta que o dono viu e ainda não tem (é só consulta, decisão do dono de 22/10/2026: não grava cadastro, radar nem deck; quem move carta é a Caixa e as pastas): ela é forte sozinha? Em qual deck entra, no lugar de quem, e quanto ganha? Vale comprar? É a mesma conta da Caixa e do Grimório (encaixe da pontuação v3, régua da Caixa em `motor/caixa.json`); o que muda é o ponto de partida: uma carta só, de fora, contra **todos** os decks nas cores dela. Desenho em `contexto/consulta/CONSULTA.md`.

Aceita: a página da carta no Scryfall (`scryfall.com/card/<coleção>/<número>/...`), uma busca do Scryfall que dê uma carta só, ou o nome em inglês. Busca com várias cartas: o script lista e para; pergunte qual.

# Arquivos

- Lê: `motor/consulta.py` (e por ele o cache do Scryfall e do EDHREC, `dados/cartas.json`, o `tema.json` e o `avaliacao.json` de cada deck, `dados/grimorio/grimorio.json`, `motor/caixa.json`), `contexto/pontuacao/RUBRICA.md`, `dados/consultas/` (consulta anterior da mesma carta).
- Grava: `dados/consultas/<carta>.json` (pelo script), com as notas da carta, o encaixe, os vereditos, a compra e o estudo; `saidas/00. Consulta.html` (pelo build); `contexto/ESTADO.md` ao fim.
- Nunca: `dados/cartas.json`, `decklist.txt`, `avaliacao.json` (radar e `avaliadas`); carta fora da identidade do comandante.

# Passos

1. **Achar.** `python motor/consulta.py "$ARGUMENTS" --dossie <arquivo temporário>.json`. Leia o dossiê inteiro. Avisos: pré-lançamento (preço de pré-venda, sem EDHREC), banida (pare e diga), não legal no Commander (pare e diga).
2. **Consulta anterior.** Se `anterior` existe, mostre a data e o veredito de antes e pergunte se refaz (preço novo, deck novo, cadastro mudou) ou se basta o que está registrado.
3. **Notas da carta.** Sem cadastro (`pedido_cadastro`), dê as notas dos oito critérios da carta pela RUBRICA, lendo o texto do dossiê, nunca de memória, com o `por_que` curto e sem citar deck. Confira as regras do dono no fim da RUBRICA (descarte de oponente, evasão, um efeito por critério). Elas vão em `_cadastro` no JSON do passo 4 e ficam só no registro da consulta: `dados/cartas.json` não muda.
4. **Sinergias.** Para **cada** deck da lista `decks` do dossiê, `sin1` e `sin2` de 0 a 3 pela régua do `tema.json` daquele deck, ao pé da letra, com uma frase de porquê por nota acima de 0, citando o trecho da régua. Deck sem ligação nenhuma leva 0 e 0. Grave `{pasta: {"sin": {...}, "sin_por_que": {...}}, "_cadastro": {"n": {...}, "por_que": "..."}}` num JSON temporário (`_cadastro` só para carta sem cadastro).
5. **Calcular.** `python motor/consulta.py "$ARGUMENTS" --sinergias <arquivo>.json`. O script recusa nota fora de 0 a 3, nota sem porquê e deck faltando; mostra, por deck, o valor, o ganho, quem sai pelo motor, o tier estimado, a faixa da régua da Caixa e a posição na fila do deck; mostra o grau no vácuo (pela régua de `motor/consulta.json`) e grava a consulta do dia em `dados/consultas/`.
6. **Julgar e escrever.** Para cada deck com sinergia acima de 0 ou ganho na faixa "guardar" ou acima: veredito `entra`, `avaliar` ou `fora`, com o porquê; `entra` e `avaliar` pedem quem sai na prática (`sai`). E o estudo, pelo texto do Scryfall: a leitura (o que a carta faz de verdade, e o que não faz), de três a cinco fortalezas e de três a cinco fraquezas (cada uma ancorada num trecho do texto), o porquê do grau no vácuo (o grau é o da régua; o script recusa outro) e as armadilhas, por deck. Quem sai **na prática** vem das `comparaveis` do dossiê (a carta do deck com o mesmo papel na curva), não só do "sai" do motor, que é a carta de menor valor do deck inteiro e às vezes é uma MDFC ou uma peça intocável. A pergunta de sempre: a carta é boa, ou é boa neste comandante? Desejo e precon intacto nunca recebem `entra`. Tier S em deck tribal só para carta da tribo.
7. **Compra.** `comprar`, `esperar`, `so-se-sobrar` ou `nao`, com o porquê, pelo ganho (régua da Caixa: 10 para Deck, 5 para Guardar) e pelo preço em dólar do dossiê. Pré-venda: diga que o preço é de pré-venda e sugira consultar de novo depois do lançamento.
8. **Mostrar e gravar.** No formato abaixo. Depois grave `{"resumo", "compra": {"acao", "porque"}, "decks": {pasta: {"veredito", "porque", "sai"}}, "estudo": {"leitura", "forcas": [...], "fraquezas": [...], "vacuo": {"grau", "porque"}, "armadilhas": {pasta: "..."}}}` e rode `python motor/consulta.py "$ARGUMENTS" --vereditos <arquivo>.json`.
9. **Montar a página.** `python motor/build.py --consulta` e `python testes/consulta.py`. A consulta aparece em `saidas/00. Consulta.html` (sub-aba Registradas). Nada vai para radar, deck ou cadastro: se o dono quiser a carta num deck, é outro pedido (`/atualizar-deck`), e mover cópia é com a Caixa e as pastas.

# /consulta importar

As consultas feitas ao vivo na página publicada (`saidas/00. Consulta.html`, botão "Pedir o estudo ao Claude") ficam no banco do artefato, coleção `consultas`, marcadas "ao vivo, não registrado".

1. O link da página está em `dados/consultas/link.txt`. Leia a coleção com a ferramenta de banco do artefato (`ArtifactData`, ação `list`, coleção `consultas`) e grave os documentos num JSON temporário (`{"docs": [...]}`).
2. `python motor/consulta.py --importar-banco <arquivo>.json`: cada documento entra em `dados/consultas/<carta>.json` como consulta **a revisar** (`modo: "ao-vivo"`, `revisar: true`). Nada vai para `dados/cartas.json`.
3. Para cada carta importada, mostre ao dono: as notas da carta (se vieram do estudo ao vivo, confira pela RUBRICA lendo o texto do registro), as sinergias com o porquê (confira pela régua do `tema.json` de cada deck), os vereditos, a compra e o estudo. Aponte o que você daria diferente.
4. Com o "pode" do dono para a carta: `python motor/consulta.py --confirmar "<carta>"` (deixa de estar a revisar). Se o dono quiser as notas corrigidas, refaça a carta pelo caminho normal (`/consulta <link>`), que substitui a consulta do dia.
5. `python motor/build.py --consulta` e `python testes/consulta.py`.

# Formato da resposta

1. **Veredito em uma linha**: forte, mediana ou fraca; onde rende; compra.
2. **O que a carta faz de verdade**: o texto lido, e o que ele não faz (por exemplo, "o oponente compra outra: não é vantagem de carta").
3. **Força sozinha**: valor próprio contra a mediana do cadastro, posição nas lentes do Grimório (tribo e cor), EDHREC e Game Changer.
4. **Tabela por deck**, só os que importam: deck, sinergias, valor, ganho, quem sai na prática, veredito. Os decks com 0 e 0, numa linha só.
5. **Armadilhas**: o que parece sinergia e não é (exílio não é descarte; Shapeshifter não é Changeling).
6. **Compra**, com o preço e a data.

# Regras

- Texto de carta nunca de memória: vem do dossiê (Scryfall). Sem dossiê, pare e diga.
- Identidade de cor é inegociável; o script já deixa de fora os decks fora das cores.
- Toda nota, veredito e compra tem uma frase de porquê.
- Diga não: carta que o dono sugeriu e não serve fica `fora`, com o motivo.
- Preço: o do Scryfall no dia da consulta, no relatório, no registro e na página da Consulta (decisão do dono, 22/10/2026).
- Não pergunte sobre bracket nem sobre cartas de estimação.

# Pronto quando

- `dados/consultas/<carta>.json` tem a consulta de hoje com os vereditos, a compra e o estudo (`python motor/consulta.py --listar` mostra).
- `saidas/00. Consulta.html` mostra o estudo, e `testes/consulta.py` passa.
- O dono viu o relatório no formato acima.
- Uma linha em `contexto/ESTADO.md` e commit `consulta: <carta>`.
