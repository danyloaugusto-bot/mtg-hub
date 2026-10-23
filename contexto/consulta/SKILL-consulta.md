---
name: consulta
description: "Analisa uma carta de fora (link do Scryfall ou nome) contra todos os decks: força sozinha, sinergia em cada deck, quem sairia, veredito e se vale comprar. Direto, sem perguntas."
argument-hint: "<link do Scryfall ou nome da carta em inglês> | importar"
model: opus
effort: high
disable-model-invocation: true
---

# /consulta

Carta: $ARGUMENTS

O dono cola uma carta e quer a análise pronta, **sem perguntas no meio** (pedido dele, 22/10/2026). É só consulta: nada vai para cadastro, radar ou deck; quem move carta é a Caixa e as pastas. Desenho em `contexto/consulta/CONSULTA.md`; régua em `motor/caixa.json` e `motor/consulta.json`.

# Fluxo direto (três comandos, nenhuma parada)

1. **Dossiê.** `python motor/consulta.py "$ARGUMENTS" --dossie <tmp>/dossie.json`. Leia o dossiê: a carta (texto do Scryfall, nunca de memória), o cadastro ou o pedido de notas, a força sozinha e, por deck nas cores dela, as duas réguas de sinergia e as `comparaveis`.
   - Banida ou não legal no Commander (fora de pré-lançamento): diga em uma linha e pare.
   - Busca do Scryfall com várias cartas: use a de nome exato, se houver; senão, liste e pare.
   - Consulta anterior: refaça sem perguntar (o registro guarda uma entrada por dia).
2. **Sinergias e notas.** Grave `<tmp>/sinergias.json` com:
   - `"_cadastro": {"n": {critério: 1 a 3}, "por_que": "..."}`, só se a carta não tem cadastro, pela RUBRICA (`contexto/pontuacao/RUBRICA.md`, com as regras do dono no fim);
   - só os decks com alguma sinergia acima de 0: `{pasta: {"sin": {"sin1": n, "sin2": n}, "sin_por_que": {"sin1": "frase citando a régua"}}}`, pela régua do `tema.json` daquele deck, ao pé da letra;
   - `"_zero_nos_outros": true`, que dá 0 e 0 aos decks não citados.
   Rode `python motor/consulta.py "$ARGUMENTS" --sinergias <tmp>/sinergias.json`. A tabela mostra o valor, o ganho, quem sai pelo motor, a faixa e o grau no vácuo.
3. **Vereditos e estudo.** Grave `<tmp>/vereditos.json`: `{"resumo", "compra": {"acao", "porque"}, "decks": {pasta: {"veredito", "porque", "sai"}}, "estudo": {"leitura", "forcas": [...], "fraquezas": [...], "vacuo": {"porque"}, "armadilhas": {pasta: "..."}}}` e rode `python motor/consulta.py "$ARGUMENTS" --vereditos <tmp>/vereditos.json`. O comando grava e já remonta `saidas/00. Consulta.html`.
   - Veredito para cada deck com sinergia acima de 0 ou ganho a partir de 5: `entra`, `avaliar` ou `fora`, com o porquê. `entra` e `avaliar` pedem `sai`, a carta das `comparaveis` (mesmo papel na curva), não o "sai" do motor, que às vezes é uma MDFC ou uma peça que ninguém cortaria. Compare o valor dela com o da mais fraca do mesmo papel.
   - Desejo e precon intacto nunca recebem `entra`. Tier S em deck tribal, só carta da tribo.
   - Estudo, pelo texto do Scryfall: a leitura (o que faz e o que não faz), de três a cinco fortalezas e de três a cinco fraquezas, cada uma ancorada num trecho do texto entre aspas, o porquê do grau (o grau o script põe) e as armadilhas.
   - Compra: `comprar`, `esperar`, `so-se-sobrar` ou `nao`, pelo ganho (10 é Deck, 5 é Guardar) e pelo preço do Scryfall. Pré-lançamento ou sem preço: `esperar`, e diga para consultar de novo depois do lançamento.

O script recusa o que estiver fora da régua (nota fora de 0 a 3, nota sem porquê, veredito fora da lista, `sai` fora do deck, estudo incompleto, grau diferente da régua): corrija e rode de novo, sem perguntar ao dono.

# A resposta ao dono

Curta, nesta ordem:

1. **Veredito em uma linha**: forte, mediana ou fraca; onde rende; compra.
2. **O que a carta faz de verdade**, e o que ela não faz.
3. **Força sozinha**: grau no vácuo, valor próprio contra a mediana, EDHREC e Game Changer.
4. **Tabela** só com os decks que importam: deck, sinergias, valor, ganho, quem sai na prática, veredito. Os sem ligação numa linha.
5. **Armadilhas.**
6. **Compra**, com o preço e a data (ou "sem preço ainda").
7. Uma linha: a consulta está na aba Consulta (local; a publicada muda quando o dono pedir para publicar).

Não termine com pergunta. O registro e a linha do `contexto/ESTADO.md` ficam para o commit com o ok do dono.

# /consulta importar

As consultas feitas ao vivo na página publicada ficam no banco do artefato, coleção `consultas`.

1. O link está em `dados/consultas/link.txt`. Leia a coleção com `ArtifactData` (ação `list`, coleção `consultas`) e grave `{"docs": [...]}` num JSON temporário. Banco vazio: diga em uma linha e pare.
2. `python motor/consulta.py --importar-banco <arquivo>.json`: entra como **a revisar**.
3. Mostre, por carta: as notas (confira pela RUBRICA), as sinergias (confira pelas réguas), os vereditos, a compra e o estudo, e o que você daria diferente.
4. Com o "pode" do dono: `python motor/consulta.py --confirmar "<carta>"`. Para corrigir, refaça pelo fluxo direto.
5. `python motor/build.py --consulta`.

# Regras

- Texto de carta nunca de memória. Identidade de cor é inegociável (o script já tira os decks fora das cores).
- Toda nota, veredito e compra tem uma frase de porquê.
- Diga não: carta que não serve fica `fora`, com o motivo.
- Preço: o do Scryfall do dia, no relatório, no registro e na página.
- Nunca grave em `dados/cartas.json`, `decklist.txt` ou `avaliacao.json`.
- Não pergunte sobre bracket nem sobre cartas de estimação.
