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
