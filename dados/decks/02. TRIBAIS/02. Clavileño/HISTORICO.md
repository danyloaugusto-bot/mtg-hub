# Histórico: Ritos de Sangue (Clavileño)

## Revisão 3, 07/10/2026: o painel passa a sair do motor

- O deck não mudou: 100 cartas, as mesmas 95 entradas, placar 485. Nenhuma nota, tier, relevância, texto, veredito ou combo foi alterado.
- A avaliação saiu do `annot.py` e do `edh.py` do kit para `avaliacao.json` e `comunidade.json`, pelo `motor/importar/ritos.py`. A comparação carta a carta com o painel anterior (`testes/origem.py`) não acha diferença.
- Custo, tipo e faces passam a vir do Scryfall, no lugar do Forge. Os dois batem em todas as cartas.
- O painel ganha as peças do Coro da Alvorada: tier list em cartas, base de mana, sinal da comunidade por faixa de sinergia, potenciais com as 11 cartas em alta na página, "Deixar de fora" no radar e a aba Oficina.
- O topo ganha a linha de tipo e o que o Clavileño faz. Continua com retrato em arco e rosácea.
- O que você salvou no navegador com o painel anterior continua valendo: o painel novo lê a chave antiga.
- Ainda pendentes, como antes: as sete trocas sugeridas, os PetCards e os preços em R$.

## Versão 2.1, 07/10/2026

Retirado o bloco de regras e alvos de Saw in Half, a pedido. Kit em `contexto/origem/ritos-de-sangue-kit/`.

## Versões 1 e 2, 06 e 07/10/2026

Painel feito em conversa: avaliação das 100 cartas, radar com 22 candidatas, sete trocas sugeridas, imagens do Scryfall e página publicada com o estado na conta. Detalhes no `HANDOVER.md` do kit.

## Pontuação v3, 15/10/2026

- Placar no método antigo: 485. Placar na pontuação v3: 1.097,5 (critérios 1.022,5 + aceleração 75). A régua mudou; o placar novo não se compara com os anteriores a esta data.
- Sinergias aprovadas pelo dono: sin1 "Vampiros abençoados" e sin2 "Morrer e voltar". Cada carta do deck e do radar ganhou a nota de sinergia com o porquê, e as cartas novas entraram no cadastro único (`dados/cartas.json`).
- Textos da avaliação antiga que o texto oficial desmentia foram corrigidos, com autorização do dono, conferidos no Scryfall.

## Potenciais, 15/10/2026

- Página relida em https://edh.wiki/commanders/clavileno-first-of-the-blessed/vampires/: 25 potenciais, de +21% a +66%, 14 deles novos na lista (corte único: sinergia +10% ou mais, as 25 maiores); 11 cartas novas no cadastro único (`dados/cartas.json`), com os oito critérios da carta, para o encaixe da pontuação v3.

## Radar, 16/10/2026

- Com o ok do dono, dos potenciais da página relida em 15/10: Crossway Troublemakers (B/MED, sin1 2 e sin2 1, +11) e Pact of the Serpent (B/MED, sin1 1, +9,5), saindo Malakir Rebirth; o `testes/origem.py` passou a aceitar as duas como acréscimo depois do kit. Todas com veredito "avaliar": o placar e o placar com as trocas não mudam. O ganho é o do encaixe depois da sinergia avaliada.

## Plano do deck, 18/10/2026

- Papéis classificados (habilitadora, recompensa, multiplicadora); veredito hoje: Satisfatório; com o recomendado: Excelente. Só o radar e o cadastro mudaram, a lista do deck não.
- 06/11/2026: o porquê de cada carta foi revisado para explicar, numa frase, o tier e a relevância neste deck (pedido do dono). Notas, tiers e placar não mudaram.
- 07/11/2026: custo usual ao lado do impresso, pedido do dono: 1 carta que sai mais barata neste deck ganhou o valor usual e a frase de como sai: Markov Baron (0). O CMC impresso, a curva e o placar não mudam.
- 08/11/2026: porquês de Bloodthirsty Conqueror e Vito citavam Exquisite Blood, nome do Scryfall; agora citam Hunger of the Ancient One, o nome impresso da carta do deck. Só o texto mudou.
- 08/11/2026: nome duplo, pedido do dono: o painel mostra o nome impresso da carta física em destaque e o nome do Scryfall menor, logo abaixo (na gaveta, "No Scryfall: …"); os textos citam a carta como "Impresso (Scryfall)", 5 textos (estratégia, porquês e combos).

- 09/11/2026: bloco "Na mesa" (avaliação de ameaças, material do dono de 08/11) e revisão de terrenos pela régua do dono: Three Tree City (entra, sai Desolate Mire), Plaza of Heroes (entra, sai Shineshadow Snarl), Takenuma, Abandoned Mire (entra, sai Path of Ancestry) e Eiganjo, Seat of the Empire (avaliar, sai Fetid Heath); os terrenos virados caem de 4 para 2 (Bojuka Bog e Windbrisk Heights). Limpezas: 6, acima da regra de 3 a 4; a Split Up já sai no radar e a Austere Command é a próxima. Plaza of Heroes entrou no cadastro.
- 09/11/2026: staples no radar pela regra do dono (só entram com buraco no critério ou no pacote, ou com sinergia própria; proteção genérica só onde proteção é agrupamento): Swords to Plowshares, fora (entra antes).
- 09/11/2026: radar: 1 cartas das coleções novas pelo /colecao (FRC 1; 0 entra, 0 avaliar, 1 fora), com o selo de coleção e o filtro no radar; bloco "A história" na Visão geral (historia.md, resumo do mtg.wiki ou da Wikipedia); "Onde mais renderia" na gaveta de cada carta.
- 10/11/2026: radar: Mondrak, Glory Dominus como avaliar, com Split Up de saída (consulta do dono; dobra o Demônio de cada abençoado que morre, mas não é Vampiro).
- 11/11/2026: tier list refeita pelo método novo (função e cinco notas por carta, com frase; a letra sai da conta): 7 S, 17 A, 58 B, 18 C, 0 D, com o comandante; Exquisite Blood foi de A para C; textos da Yahenni e da Plaza of Heroes corrigidos.
- 13/11/2026: troca na lista, feita pelo dono: saem Legion Lieutenant, Redemption Choir, Split Up e Treacherous Greed; entram Emeritus of Woe (SOS 80, S), Scheming Silvertongue (SOS 329, B), Saw in Half (UNF 88 foil, A) e Cruel Celebrant (LCC 267, A), as quatro vindas do radar. Placar 1107 -> 1117,5; com as trocas, 1128 -> 1141; 31 Vampiros, CMC 2,97, tiers 8/19/58/15/0. Cinco limpezas (a Split Up saiu); Mondrak e Tip the Scales passam a sair pela Austere Command. O teste de origem (kit Ritos de Sangue) saiu da bateria: a lista deixou de ser a do kit.
- 13/11/2026: radar novo pela comunidade (EDHREC: página geral e temas vampires, aristocrats, sacrifice, lifegain e tokens; edh.wiki), a pedido do dono: 17 cartas, 4 entra (Sorin, Imperious Bloodlord S no lugar da Invasion of New Capenna; Malakir Bloodwitch S no lugar do Markov Baron; Vampire Gourmand A no lugar do Master of Dark Rites; Vengeful Bloodwitch A no lugar do Strionic Resonator), 6 avaliar e 7 fora. Crossway Troublemakers e Pact of the Serpent deixaram de sair pela Malakir Rebirth (MDFC). Textos das cinco limpezas e dos substitutos corrigidos. Placar com as trocas 1141 -> 1161.
- 13/11/2026: decisões do dono sobre o radar: Pitiless Plunderer (não é Vampiro) de entra para avaliar; cortes repetidos resolvidos pelo critério novo (motor/cortes.py): Etchings of the Chosen sai Drivnod, Bloodletter of Aclazotz sai Count Dracula. Placar com as trocas 1161,5.
