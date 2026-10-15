# Handover: pontuação v3 e o estado do hub (15/10/2026)

Para a próxima conversa, ou o Claude Code, partir daqui sem reler o histórico.

## A decisão

O dono quer um placar comparável entre decks e uma resposta para "quanto esta carta melhora este deck" e "em que deck ela rende mais". Hoje não dá: os 27 painéis têm 216 colunas de agrupamento com 78 nomes diferentes.

Decidido, nas palavras do dono e nesta ordem:
1. **Dez critérios iguais para todos**, com os nomes e o conteúdo que ele definiu: Sinergia Primária, Sinergia Secundária, Resiliência, Recurso, Draw, Amplificador, Remoção, Evasão, Dano Direto, Aceleradores. Ele recusou mexer no conteúdo deles. Evasão inclui toque mortífero e iniciativa, pelo conceito do Draft (mais difícil de bloquear), e anulações ficam em Resiliência.
2. **Nota de 0 a 3 por intensidade**, não por contagem. A regra dele de "faz duas vezes" sobe um nível. Uma carta pode pontuar bem num critério só.
3. **Pontos por nota 0, 1, 3, 6**, para a carta excepcional valer mais que várias de passagem. Proposto por mim; ele não se opôs. Revisar no piloto.
4. **Pesos iguais para todos os decks:** Sinergia Primária ×2,5; Secundária ×1,5; Draw, Remoção e Aceleradores ×2; os outros ×1. O dono baixou a minha proposta, que achou pesada.
5. **Placar sem teto:** soma dos valores das cartas + pontos de aceleração. A aceleração é a fórmula dele, igual à de hoje: Y = soma das notas de Aceleradores ÷ CMC médio; 5 pontos a cada 0,5 de Y, de 5 a 90. Os pontos antigos do CMC médio (1 a 5) saem; isso é suposição minha, a confirmar com ele.
6. **Saturação só na conta de troca e encaixe**, não no placar: abaixo da faixa 1,5×, dentro 1×, acima 0,5×.
7. **Duas regras de encaixe** que não mudam a lista dele: tutor de não-terreno conta em Recurso; não há critério de fechamento.
8. **Piloto no Asas da Esperança** (pasta `01. Giada`; o painel se chamava Coro da Alvorada até 15/10/2026).

Os detalhes estão em `RUBRICA.md`, `DADOS.md`, `pontuacao.json` e `PROMPT-CODE.md`, nesta mesma pasta.

## Estado do hub e dos painéis nesta data

- **Preço e valor saíram do hub inteiro**, a pedido do dono: troca boa é a que melhora o deck. Não voltar a sugerir conta de dinheiro.
- **Reserva e sobra**: funções com até duas cartas dedicadas, faixas de ramp, compra e remoção, cortes seguros. Com a v3, passa a usar as faixas do `pontuacao.json`.
- **Sub-utilizadas**: S ou A no radar de um deck e pior em todo deck onde já está (33 no dia 14/10).
- **Aba Compras**: lista no banco do hub publicado (coleção `compras`), botão "+ Compras" no radar de todos os decks. **Ao republicar o hub, nunca passar `capabilities`**, ou o banco se perde.
- **Cartão do hub**: sem contador de alertas; o verso mostra só o CMC médio. O dono recusou data, funções sem reserva, chance do comandante, onde está curto e contra quem sofre; ele diz depois se quiser mais.
- **Gráficos**: rótulos com tamanho fixo na tela; asas novas e realistas no Asas da Esperança, ao lado do texto (o dono não quer o gráfico em outra linha); tumbas e fonte Metal Mania no Cortejo Fúnebre. O dono gostou das tumbas e dos quatro decks de 05. Desejo, que são a régua: objeto do tema, letra grande, nada fofo.
- **Em aberto**: a proposta de refazer nove gráficos com cara de pétala ou de fofo. Vito: velas. Ken: barras de energia. Fynn: gotas de veneno. Queen: coroa com joias. Valgavoth: correntes. Humanos: estandartes pendurados. Lynde: xícaras. Master Of Evil: mostradores. Tergrid: lanternas e uma fonte mais sombria. Com a v3, todo desenho precisa aceitar 10 peças.
- **Testes que já falhavam**: `regressao.py` no botão `tier-view` "fichas"; `contrato.py` do Zumbis, com a cor `buff` sobrando no `tema.json`.

## Lição de processo

Duas sessões mexeram no mesmo `motor/painel/app.js` ao mesmo tempo. Funcionou, aplicando as mudanças por cima da versão mais nova com guarda de data, mas o Claude Code chegou a achar que as mudanças da outra sessão eram de outra pessoa e não levá-las no commit. Regra daqui para frente: **uma sessão por vez no motor**. Quando o Claude do celular ou da web mexer, o dono avisa o Code, e vice-versa.
