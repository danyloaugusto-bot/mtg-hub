# Histórico: Coro da Alvorada (Giada)

## Revisão 4, 08/10/2026: as asas de volta

- O gráfico do topo volta a ser as asas do Coro da Alvorada: oito penas, quatro de cada lado, abrindo de uma auréola com o placar. O motor ganhou o desenho "asas".
- A fila de corte ganhou ordem escrita, como nos outros painéis: Invasion of Gobakhan, Everybody Lives!, Split Up, Horn of the Mark, Angelic Skirmisher, Orim's Chant, Chivalric Alliance, The Immortal Sun, Herald of Eternal Dawn e Steel Seraph; os terrenos Command Beacon e Terrain Generator à parte.
- Nenhuma nota, tier, relevância ou texto mudou. Placar 429.

## Revisão 3, 07/10/2026: o painel passa a sair do motor

- O deck não mudou: 100 cartas, 85 entradas, placar 429. Nenhuma nota, tier, relevância, texto, veredito ou combo foi alterado.
- A avaliação saiu do `evals.py` da revisão 2 do kit (`kit-coro-da-alvorada2`) para `avaliacao.json` e `comunidade.json`, pelo `motor/importar/coro.py`. Comparados lado a lado no navegador, placar, pontos por agrupamento, tiers, relevância e os cinco fatos do topo batem com o painel de origem.
- Custo, tipo e faces passam a vir do Scryfall, no lugar do Forge.
- O painel ganha o que só o Ritos de Sangue tinha: aba Galeria, comparador de trocas lado a lado, anotações de mesa e a marca "tenho" por carta, veredito do radar editável na gaveta, e o estado salvo na conta na página publicada (o Coro antigo só gravava no navegador).
- Ganha também a aba Oficina, com os comandos do projeto já preenchidos.
- O que você salvou no navegador com o painel anterior (chave `coro-da-alvorada-v1`) continua valendo.
- **Gráfico dos agrupamentos:** as asas, que eram a identidade visual do Coro, ainda não existem no motor. O painel usa o desenho padrão (fatias) até a migração ser completada com uma mudança de motor, pelo `/motor`. É a maior perda desta migração.
- **Leituras do deck:** cinco delas ganharam uma frase a menos. O motor hoje expressa cada leitura como uma comparação simples (uma faixa de referência, ou um marcador contra um limite). O Coro cruzava dois números numa frase só: "mais vagas de proteção que ramp e que compra", "ramp que só vale para Anjos, com o topo da curva pesado", "a cor branca engasga, atrasando X e Y", "compra que só funciona atacando, pior depois de remoção em massa". Essas comparações não aparecem mais como texto; o dado por trás de cada uma (contagem por agrupamento, símbolos de mana por cor, fontes de terreno) continua visível nos painéis "Os oito agrupamentos" e "Base de mana", só que como número, não como frase pronta. Nenhuma nota, tier ou veredito mudou: é a leitura que ficou mais simples, não a avaliação.
- A gramática do painel passou a saber o gênero do comandante: "é boa na Giada", não "é boa no Giada". Campo novo em `tema.json`.

## Versão 2, 07/10/2026 (kit-coro-da-alvorada2)

457 KB. Radar com 18 candidatas (7 entram, 10 a avaliar, 1 fica de fora). Imagens do Scryfall em todas as abas, sinal da comunidade, 52 potenciais do edh.wiki. Detalhes no `HANDOVER-v2.md` do kit, em `entrada/`.

## Versão 1, 06/10/2026 (kit-coro-da-alvorada)

345 KB. Primeira versão do painel, com imagem só na gaveta e 12 candidatas no radar.

## Custo de mana, 10/10/2026

- O painel ganhou o quadro "Custo e curva" na Visão geral, o ganho de custo em cada cartão do radar e a mais cara de cada pacote no 8×8. Marcadas como `caro_por_desenho`, porque custam menos na prática e ficam fora da conta: Vanquish the Horde (custa 1 a menos por criatura em campo) e Steel Seraph (protótipo por {1}{W}{W}).

## Pontuação v3, 15/10/2026

- Placar no método antigo: 429. Placar na pontuação v3: 1.029 (critérios 944 + aceleração 85). A régua mudou; o placar novo não se compara com os anteriores a esta data.
- Sinergias aprovadas pelo dono: sin1 "Anjos" e sin2 "Marcadores e ganho de vida". Cada carta do deck e do radar ganhou a nota de sinergia com o porquê, e as cartas novas entraram no cadastro único (`dados/cartas.json`).

## Potenciais, 15/10/2026

- Página relida em https://edh.wiki/commanders/giada-font-of-hope/angels/: 25 potenciais, de +15% a +41%, 0 deles novos na lista (corte único: sinergia +10% ou mais, as 25 maiores); 18 cartas novas no cadastro único (`dados/cartas.json`), com os oito critérios da carta, para o encaixe da pontuação v3.

## Radar, 16/10/2026

- Com o ok do dono, dos potenciais da página relida em 15/10: Vanquisher's Banner (B/MED, sin1 2, +12,5) e Sunblast Angel (B/MED, sin1 2, +12,5), saindo Sejiri Shelter. Todas com veredito "avaliar": o placar e o placar com as trocas não mudam. O ganho é o do encaixe depois da sinergia avaliada.

## Plano do deck, 18/10/2026

- Papéis classificados (habilitadora, recompensa, multiplicadora); veredito hoje: Insuficiente; com o recomendado: Satisfatório. Só o radar e o cadastro mudaram, a lista do deck não.

## Rebranding, 20/10/2026

- Gráfico do herói: penas sobre veludo (variação R, escolhida pelo dono).
- 05/11/2026: Arcane Signet no radar passa de avaliar para fora, por decisão do dono (ele tem as duas pedras guardadas e não vê necessidade de colocá-las).
- 06/11/2026: o porquê de cada carta foi revisado para explicar, numa frase, o tier e a relevância neste deck (pedido do dono). Notas, tiers e placar não mudaram.
- 07/11/2026: troca no deck físico, feita pelo dono: sai Steel Seraph (BRO 38), que vai para a Caixa; entra Lyra, Archangel of Dawn (FRA 294), que estava no radar como entra (tier S/INS). Placar 1.029 para 1.049; CMC médio 3,72 para 3,68. O Serafim fica no radar como fora, com o motivo.
- 07/11/2026: plano do dono registrado no deck.md: Anjos grandes, remoção em massa com proteção só para os seus e nada de remoção pontual. Estratégia reescrita. Tiers: Everybody Lives! C/BAX para A/ALT (para combo e remoção em massa de oponente por 2 manas); Invasion of Gobakhan, Split Up e Horn of the Mark C/BAX para B/MED; Orim's Chant fica C/BAX. Radar: Swords to Plowshares fora (decisão do dono); Winnowing, Urza's Incubator e The Mind Stone de entra para avaliar (saem Split Up, Orim's Chant e The Immortal Sun). Placar 1.049 sem mudança; o placar com as trocas cai porque três entras viraram avaliar.
- 07/11/2026: terrenos no radar, a pedido do dono (só terrenos que entram desvirados e rendem cedo): Abandoned Air Temple (A/ALT, marcador em todo o time; entra no lugar de uma das 16 Snow-Covered Plains, para manter a Emeria, por decisão do dono), Talon Gates of Madara (A/ALT, tira um Anjo de fase em resposta; sai Terrain Generator) e Ancient Tomb (A/ALT, duas manas; sai Command Beacon). Talon Gates e Ancient Tomb como entra; a Air Temple como avaliar e sem sai, porque o painel não troca uma cópia só de um básico. Pesquisa: os 421 terrenos que um mono-branco pode jogar (Scryfall) e os terrenos da Giada no EDHREC. Ficaram fora: Karakas (banida), Plaza of Heroes e Kor Haven (proteção pequena), Monumental Henge e Castle Ardenvale (rendem pouco aqui). Abandoned Air Temple e Talon Gates of Madara entraram no cadastro.
- 07/11/2026: custo usual ao lado do impresso, pedido do dono: 5 cartas que saem mais baratas neste deck ganharam o valor usual e a frase de como saem: Sephara, Sky's Blade (1), Clever Concealment (0), Flare of Fortitude (0), Flawless Maneuver (0), Vanquish the Horde (2). O CMC impresso, a curva e o placar não mudam.
- 08/11/2026: nome duplo, pedido do dono: o painel mostra o nome impresso da carta física em destaque e o nome do Scryfall menor, logo abaixo (na gaveta, "No Scryfall: …"); os textos citam a carta como "Impresso (Scryfall)", 2 textos (The Ozolith e um combo). Remoção pontual, decisão do dono: Get Lost, Generous Gift, Darksteel Mutation e a Eiganjo ficam, e nenhuma outra entra; a Path to Exile passou de avaliar a fora, como a Swords to Plowshares. Ficha, estratégia e radar atualizados.
