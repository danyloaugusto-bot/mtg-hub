# Prompt para o Claude Code: pontuação v3

Leia, nesta ordem: `contexto/pontuacao/RUBRICA.md`, `contexto/pontuacao/DADOS.md`, `contexto/pontuacao/pontuacao.json`, `contexto/ARQUITETURA.md` e `contexto/ESTADO.md`. A rubrica é do dono: os dez critérios, os pesos e a tabela de aceleração não mudam sem ele.

Antes de começar: confira com `git status` se há mudanças de gráfico em andamento no motor. Se houver, pare e me avise; esta migração só começa com elas no commit. Trabalhe num ramo `pontuacao-v3`.

Pare no fim de cada fase com um resumo curto do que mudou, dos números e das dúvidas, e espere meu "pode seguir".

## Fase 1: régua no motor, sem mexer em nenhum deck
1. Copie `contexto/pontuacao/pontuacao.json` para `motor/pontuacao.json`, com as cores padrão de `DADOS.md`.
2. `dados.py`, `hub.py`, painel e hub leem a régua de lá. Deck sem `"versao_pontuacao": 3` segue exatamente no método antigo.
3. Teste: `python testes/todos.py` em dois decks antigos e `python testes/hub.py` dão o mesmo resultado de antes (os placares antigos não podem mudar).

## Fase 2: cadastro único e pré-nota
1. Crie `motor/prenota.py` e `dados/cartas.json` como em `DADOS.md`, seção 1, para as cartas do Asas da Esperança (`01. Giada`): deck e radar.
2. Mostre uma tabela das 20 pré-notas de que o script tem menos certeza.

## Fase 3: piloto no Asas da Esperança
1. Revise o cadastro das cartas do deck e do radar pela `RUBRICA.md`, carta a carta, e grave `fonte: "claude"` com `por_que` curto. Use os exemplos de calibração como âncora.
2. Proponha as duas sinergias no `tema.json` (`DADOS.md`, seção 2) e dê `sin1` e `sin2` a cada carta. Deixe `aprovado` vazio.
3. Migre o `avaliacao.json` para a v3 (`versao_pontuacao`, `sin`, `pacote`, `leituras`).
4. Ainda não mexa nos gráficos: se precisar, mostre o topo com o desenho padrão para 10 peças.
5. Me entregue:
   - placar antigo e novo, e a parte de cada critério no novo;
   - as dez cartas de maior valor e as dez de menor;
   - quanto a aceleração pesa no placar novo;
   - as 15 notas de que você tem menos certeza;
   - três trocas do radar com o ganho calculado (`DADOS.md`, seção 4).

## Fase 4: telas
1. Gráfico do topo com 10 peças em todos os desenhos. Nas asas, cinco penas por lado; nas tumbas, duas fileiras de cinco. Os outros desenhos já usam o número de agrupamentos, mas confira um por um.
2. Tabelão com 10 colunas, aba de critérios no lugar da 8×8, fila de corte por valor.
3. Gaveta da carta com a caixa "Encaixe" (seção 4 de `DADOS.md`), lendo o cadastro de todos os decks já migrados.
4. Hub: placar comparável (ranking e soma por critério), Fundamentos, Reserva e sobra, Radar e Compras com encaixe.
5. Testes: placar novo refeito em Python, sem usar o JavaScript; teste de rubrica; `testes/layout.py` com 10 peças.

## Fase 5: os outros decks, de cinco em cinco
Para cada lote: cadastro revisado, sinergias propostas, `avaliacao.json` migrado, build e testes. No fim de cada lote, me mande a mesma entrega da Fase 3, resumida por deck. Comece pelos decks com menos agrupamentos próprios.

## Fase 6: fechamento
1. Skills `/novo-deck`, `/auditar`, `/atualizar-deck`, `/potenciais` e `/compras` passam a avaliar pela rubrica e a gravar no cadastro único e em `sin`.
2. `AVALIACAO.md` aponta para a `RUBRICA.md`; `ARQUITETURA.md` e `ESTADO.md` registram a v3; uma entrada "pontuação v3" no `HISTORICO.md` de cada deck.
3. Monte tudo, rode todos os testes, faça o commit e o `/publicar`. No hub, não passe `capabilities`.
