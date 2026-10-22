---
name: consulta
description: "Analisa uma carta de fora (link do Scryfall ou nome) contra todos os decks: força sozinha, sinergia em cada deck, quem sairia, veredito e se vale comprar."
argument-hint: "<link do Scryfall ou nome da carta em inglês>"
model: opus
effort: high
disable-model-invocation: true
---

# /consulta

Carta: $ARGUMENTS

A Consulta responde, para uma carta que o dono viu e ainda não tem: ela é forte sozinha? Em qual deck entra, no lugar de quem, e quanto ganha? Vale comprar? É a mesma conta da Caixa e do Grimório (encaixe da pontuação v3, régua da Caixa em `motor/caixa.json`); o que muda é o ponto de partida: uma carta só, de fora, contra **todos** os decks nas cores dela. Desenho em `contexto/consulta/CONSULTA.md`.

Aceita: a página da carta no Scryfall (`scryfall.com/card/<coleção>/<número>/...`), uma busca do Scryfall que dê uma carta só, ou o nome em inglês. Busca com várias cartas: o script lista e para; pergunte qual.

# Arquivos

- Lê: `motor/consulta.py` (e por ele o cache do Scryfall e do EDHREC, `dados/cartas.json`, o `tema.json` e o `avaliacao.json` de cada deck, `dados/grimorio/grimorio.json`, `motor/caixa.json`), `contexto/pontuacao/RUBRICA.md`, `dados/consultas/` (consulta anterior da mesma carta).
- Grava: `dados/consultas/<carta>.json` (pelo script); `dados/cartas.json` só para a carta consultada, se ela não tiver cadastro, com o "pode"; com outro "pode", o radar dos decks escolhidos e a chave `avaliadas` (passo 9); `contexto/ESTADO.md` ao fim.
- Nunca: `decklist.txt`; o radar como "entra" sem o dono; carta fora da identidade do comandante.

# Passos

1. **Achar.** `python motor/consulta.py "$ARGUMENTS" --dossie <arquivo temporário>.json`. Leia o dossiê inteiro. Avisos: pré-lançamento (preço de pré-venda, sem EDHREC), banida (pare e diga), não legal no Commander (pare e diga).
2. **Consulta anterior.** Se `anterior` existe, mostre a data e o veredito de antes e pergunte se refaz (preço novo, deck novo, cadastro mudou) ou se basta o que está registrado.
3. **Cadastro.** Sem cadastro (`pedido_cadastro`), dê as notas dos oito critérios da carta pela RUBRICA, lendo o texto do dossiê, nunca de memória, com o `por_que` curto e sem citar deck. Confira as regras do dono no fim da RUBRICA (descarte de oponente, evasão, um efeito por critério). Mostre e espere o "pode"; grave em `dados/cartas.json` com `fonte: "claude"` e `revisado`, mantendo a ordem e o recuo do arquivo (como o `prenota.gravar_cadastro`).
4. **Sinergias.** Para **cada** deck da lista `decks` do dossiê, `sin1` e `sin2` de 0 a 3 pela régua do `tema.json` daquele deck, ao pé da letra, com uma frase de porquê por nota acima de 0, citando o trecho da régua. Deck sem ligação nenhuma leva 0 e 0. Grave `{pasta: {"sin": {...}, "sin_por_que": {...}}}` num JSON temporário.
5. **Calcular.** `python motor/consulta.py "$ARGUMENTS" --sinergias <arquivo>.json`. O script recusa nota fora de 0 a 3, nota sem porquê e deck faltando; mostra, por deck, o valor, o ganho, quem sai pelo motor, o tier estimado, a faixa da régua da Caixa e a posição na fila do deck; grava a consulta do dia em `dados/consultas/`.
6. **Julgar.** Para cada deck com sinergia acima de 0 ou ganho na faixa "guardar" ou acima: veredito `entra`, `avaliar` ou `fora`, com o porquê. Quem sai **na prática** vem das `comparaveis` do dossiê (a carta do deck com o mesmo papel na curva), não só do "sai" do motor, que é a carta de menor valor do deck inteiro e às vezes é uma MDFC ou uma peça intocável. A pergunta de sempre: a carta é boa, ou é boa neste comandante? Desejo e precon intacto nunca recebem `entra`. Tier S em deck tribal só para carta da tribo.
7. **Compra.** `comprar`, `esperar`, `so-se-sobrar` ou `nao`, com o porquê, pelo ganho (régua da Caixa: 10 para Deck, 5 para Guardar) e pelo preço em dólar do dossiê. Pré-venda: diga que o preço é de pré-venda e sugira consultar de novo depois do lançamento.
8. **Mostrar e gravar.** No formato abaixo. Depois grave `{"resumo", "compra": {"acao", "porque"}, "decks": {pasta: {"veredito", "porque", "sai"}}}` e rode `python motor/consulta.py "$ARGUMENTS" --vereditos <arquivo>.json`.
9. **Levar adiante, só com o "pode".** Para os decks com `entra` ou `avaliar` que o dono escolher: a carta entra no radar como **"avaliar"**, com tudo o que o radar pede (notas `sin` e `sin_por_que`, tier, relevância, faz, porquê e quem sai), como no `/atualizar-deck`; depois `python motor/build.py --deck "<pasta>"` e `python motor/build.py --hub`, e `python testes/todos.py --deck "<pasta>" --sem-montar`. Para guardar as sinergias nos decks em que a carta fica de fora, sem pôr no radar (a Caixa e o Grimório deixam de tratar o ganho como piso): grave o JSON do passo 4, só com os decks de nota acima de 0, e rode `python motor/caixa.py --gravar-avaliadas <arquivo>.json`.

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
- Preço só no relatório e no registro; nenhuma página mostra (a Caixa segue sendo a única com preço).
- Não pergunte sobre bracket nem sobre cartas de estimação.

# Pronto quando

- `dados/consultas/<carta>.json` tem a consulta de hoje com os vereditos e a compra (`python motor/consulta.py --listar` mostra).
- O dono viu o relatório no formato acima.
- Uma linha em `contexto/ESTADO.md` e commit `consulta: <carta>`.
