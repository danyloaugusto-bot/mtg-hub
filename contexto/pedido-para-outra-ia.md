# Pedido de análise para outra IA

Cole o texto abaixo na outra IA, junto com a decklist. Salve a resposta dela como um arquivo em `dados/<pasta do deck>/entrada/`, com o nome da IA (por exemplo `ia-1.md`). O formato igual para todas é o que permite confrontar depois.

Este é o pedido curto. Para uma IA que vai analisar vários decks, use o método completo em `contexto/handover-analise-de-decks.md`: ele ensina as escalas, o diagnóstico e os erros a evitar, e entrega no mesmo formato.

---

Analise este deck de Commander de Magic: The Gathering. Seja crítico: diga o que está errado, não só o que está bom.

Comandante: <nome>
Plano do deck, nas minhas palavras: <uma frase>
Lista: <cole a decklist>

Responda em Markdown, com exatamente estas seções:

1. **Plano**: como o deck ganha, em uma frase, e onde a lista trai esse plano.
2. **Agrupamentos**: os oito eixos que você usaria para avaliar este deck, com uma linha cada.
3. **Carta a carta**: uma tabela com nome, tier (S, A, B, C ou D), relevância (INS = nunca sai, ALT = só sai por algo claramente melhor, MÉD = trocável, BAX = primeira a sair) e uma frase de motivo.
4. **Cortes**: as dez primeiras cartas a sair, em ordem, com motivo.
5. **Entradas**: até dez cartas de fora, cada uma com quem sairia e por quê.
6. **Combos e linhas de jogo**.
7. **Dúvidas**: o que você não tem certeza, incluindo qualquer carta cujo texto você não conhece bem.

Regras: não invente o texto de nenhuma carta; se não souber o que uma carta faz, diga. Não trate terreno como mágica na hora de cortar. Não recomende carta só porque é forte: diga por que ela é boa neste comandante.
