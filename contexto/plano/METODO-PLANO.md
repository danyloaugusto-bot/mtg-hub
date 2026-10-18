# Plano do deck: habilitadoras, recompensas e multiplicadoras

**Status:** aprovado pelo dono em 18/10/2026 (respostas no fim). Piloto no Clavileño (`piloto-clavileno.json`), protótipo do quadro em `prototipo-plano-1360.png` e `prototipo-plano-375.png`, régua em `plano.json`. Pedido para o Code em `PROMPT-CODE-PLANO.md`.

## De onde vem

- **The Command Zone, episódio 658** ("Commander Deckbuilding Template for the New Era"): o "resto" do template (de 30 a 40 cartas, depois de terrenos, ramp, compra e remoção) se divide em enablers, payoffs e enhancers, com a proporção sugerida de **40%, 35% e 25%**, "a ajustar pelo jeito que o deck joga". Lido no resumo do commanderdeckmaker.com, não no episódio: trate a proporção como ponto de partida.
- **Vídeo do Munrado** (12/10/2026, de 5:08 a 6:30), pelo resumo que o dono mandou (feito por outra IA, então é opinião até conferir): plano de 30 a 38 cartas; a armadilha de ter mais multiplicadoras que habilitadoras; o papel do comandante dita o resto; carta com mais de uma função é a melhor.
- As citações de discussões do r/EDH no resumo não foram conferidas e não sustentam nada aqui.

## Os três papéis (e por que esses nomes)

| Papel | Pergunta | Exemplos típicos |
|---|---|---|
| **Habilitadora** (enabler) | Sem ela, o plano acontece? | Corpos da tribo que o comandante usa, geradores de fichas, saídas de sacrifício, recursão |
| **Recompensa** (payoff) | O que o deck ganha por executar o plano? | Dreno ou compra quando algo morre, ataca ou entra; peças que fecham o jogo |
| **Multiplicadora** (enhancer) | Ela só multiplica o que já roda? | Dobrar gatilhos ou fichas, copiar habilidades, lordes |
| **Estrutura** | Não está no plano | Terrenos, ramp, compra, remoção e proteção genéricos |

"Amplificador" e "Aceleradores" já são nomes de critérios da v3; por isso **Multiplicadora** e não "Amplificadora".

## Regras de classificação

1. **O papel é do deck, não da carta.** Blood Artist é recompensa num deck de aristocratas e pode ser outra coisa noutro. Fica no `avaliacao.json` de cada deck, como a sinergia.
2. **Um papel principal por carta**, mais a **dupla função** quando existe (outro papel, ou uma função de estrutura: Draw, Ramp, Remoção). A dupla função é qualidade, não confusão.
3. **Frase de porquê** em toda classificação (regra 7 do projeto). Carta que não habilita, não recompensa nem multiplica é estrutura ou candidata a corte.
4. **O plano é definido pelo papel, não pela nota de sinergia.** A v3 tira de propósito da sinergia as recompensas puras (o que só rende com a morte conta em Dano e Draw). No Clavileño, The Meathook Massacre e Exquisite Blood têm sinergia baixa e são recompensas centrais.
5. Em tribal, o corpo da tribo que o comandante usa é habilitadora; o lorde é multiplicadora.

## O papel do comandante

| Comandante | O que o deck precisa | Checagem |
|---|---|---|
| Recompensa | Muitas habilitadoras para alimentá-lo | Habilitadoras a partir de 40% (sem teto) |
| Habilitadora | Proteção e um plano B nas 99 | Resiliência da v3 com 8 cartas ou mais de nota 2 ou 3; 10 habilitadoras nas 99; recompensas a partir de 30% |
| Multiplicadora | As 99 andam sozinhas; ele é a cereja | 12 habilitadoras e 10 recompensas nas 99, sem contar o comandante |

## O veredito

- **Excelente:** todas as faixas dentro, multiplicadoras até o número de habilitadoras, a checagem do comandante passa e pelo menos 20% do plano tem dupla função.
- **Satisfatório:** no máximo uma faixa fora, por até 3 cartas; multiplicadoras até o número de habilitadoras; a checagem do comandante passa.
- **Insuficiente:** plano com menos de 28 cartas; ou mais multiplicadoras que habilitadoras; ou a checagem do comandante falha; ou duas faixas fora; ou uma faixa fora por mais de 3 cartas.
- Plano acima de 38 cartas é anotado, não punido: em tribal, cada corpo da tribo conta como habilitadora.

Faixas (em porcentagem do plano): habilitadoras de 30 a 55%, recompensas de 25 a 45%, multiplicadoras de 10 a 30%. Os números ficam em `plano.json`, nunca no código.

## As soluções: mais forte e equilibrado

Força é o placar dos dez critérios; equilíbrio é o plano. **A boa troca melhora os dois.** O quadro não lista sugestões soltas: mostra cenários, cada um com o que entra, o que sai, a mistura de papéis depois, o veredito e o placar antes e depois (conta exata, como o painel, com a aceleração).

Os cenários, sempre nesta ordem:
1. **Hoje.**
2. **Sem comprar nada:** só cartas que o dono já tem fora de deck (Caixa e pastas), nas cores do deck, com o papel que falta.
3. **Radar como está:** as trocas marcadas "entra" que mexem no papel que falta, com quem o radar já tira. Se elas equilibram mas baixam o placar, a linha avisa e diz por quê.
4. **Recomendado:** o melhor pacote. Escolha gulosa: para cada carta com o papel que falta (primeiro as que o dono tem, depois o radar), o corte que mais sobe o placar entre as mais fracas do papel que sobra e as de estrutura sem papel, fora intocáveis, estimação, terrenos (a não ser terreno por terreno) e o que deixaria um critério da v3 abaixo da faixa. Para quando o veredito chega a excelente ou quando nenhuma troca sobe o placar.

Depois da tabela, o recomendado **troca a troca**: o papel da que entra, o que ela faz no deck, de onde vem (na Caixa, numa pasta, mover de outro deck, comprar), quem sai e o ganho de placar de cada troca. Conflitos com o radar ficam numa nota (o mesmo corte usado por outra troca).

No piloto, o "radar como está" equilibra mas enfraquece: o Cruel Celebrant no lugar do Master of Dark Rites tira 5 pontos de aceleração (o achado 3 da auditoria do Dashboard de 09/10 já dizia isso). No lugar da March of the Canonized, a mesma carta soma.

## Relação com a pontuação v3

Não muda os 10 critérios nem o placar (regra do dono). A v3 mede **quanto** o deck tem de plano (Sinergia 1 e 2, com faixas de 20 a 30 e de 8 a 15 cartas) e o que cada carta faz; o Plano do deck mede **a forma** do plano: a mistura de papéis e se ela combina com o comandante. Se o dono quiser, a forma pode entrar no placar depois, como um modificador; a recomendação é não, para o placar continuar sendo só dos critérios dele.

## O piloto: Clavileño

- Comandante: **recompensa** (converte o Vampiro que ataca e morre em carta e Demônio).
- Plano: 44 cartas, 26 habilitadoras (59%), 10 recompensas (23%), 8 multiplicadoras (18%), 16 com dupla função (36%).
- Veredito: **satisfatório**. Recompensas abaixo da faixa por 1 a 3 cartas: é o "muita morte, pouco dano" que a Estratégia do painel já dizia, agora com número.
- Cenários (placar de hoje 1.107):

| Cenário | Entra | Sai | Plano (hab · rec · mult) | Veredito | Placar |
|---|---|---|---|---|---|
| Sem comprar nada | Sanctum Seeker, Marauding Blight-Priest (Caixa) | Charismatic Conqueror, Qarsi Revenant | 24 · 12 · 8 | excelente | 1.109 (+2) |
| Radar como está | Cruel Celebrant, Vein Ripper | Master of Dark Rites, New Blood | 25 · 12 · 8 | excelente | 1.104,5 (−2,5) |
| Recomendado | os quatro | New Blood, Charismatic Conqueror, Qarsi Revenant, March of the Canonized | 23 · 14 · 8 | excelente | 1.118 (+11) |

- Troca a troca, no recomendado: Vein Ripper por New Blood +8,5 (está no Vito e no Strefan); Sanctum Seeker por Charismatic Conqueror +3 (Caixa); Cruel Celebrant por March of the Canonized +0,5 (está no Markov); Marauding Blight-Priest por Qarsi Revenant −1 (Caixa), a peça que equilibra. Se o Emeritus of Woe entrar pela March, como o radar quer, o Cruel Celebrant tira o Dusk Legion Sergeant e o pacote fica em +8,5.

## Respostas do dono (18/10/2026)

1. Nomes: Habilitadora, Recompensa e Multiplicadora. Aprovados.
2. Régua: serve para começar; calibrar no primeiro lote.
3. Placar: o quadro fica na Visão geral, antes da Estratégia, e o veredito do plano **não altera o placar** (o número que vem só dos dez critérios). A recomendação foi explicada ao dono; se ele quiser o contrário, diz.
4. Piloto: aprovado, com um pedido: apresentar melhor as soluções para um deck mais forte e equilibrado. Daí os cenários com placar antes e depois e o troca a troca.
