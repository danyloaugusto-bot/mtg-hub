---
name: novo-deck
description: "Etapa 5. Cria o painel de um deck a partir da lista, da ficha e das análises de outras IAs."
argument-hint: "<pasta do deck, ex.: 01. Markov>"
model: opus
effort: high
disable-model-invocation: true
---

Deck: $ARGUMENTS

Leia tudo o que estiver em `dados/$ARGUMENTS/`, solto na pasta ou dentro de `entrada/`: lista, ficha, capa, handovers de outras IAs, planilhas, HTMLs, prints. O dono solta o material na pasta e espera que você se vire com o que houver.

## Antes de tudo: arrumar a pasta

Na raiz da pasta do deck ficam só `deck.md`, `decklist.txt`, `capa.*` e o que o motor gera. Se houver outros arquivos soltos ali (handovers, planilhas, HTMLs, pastas de kit), mova para `entrada/` e diga o que moveu. Não apague nada. Se houver mais de uma versão do mesmo material, use a mais recente (pelo número de revisão dentro do HTML, ou pela data) e diga qual usou.

O que pode faltar, e o que fazer:

- Sem `decklist.txt`: procure a lista no material (handover, planilha, HTML), monte o arquivo e me mostre para eu confirmar antes de seguir.
- Sem `deck.md`: escreva a ficha a partir do material e me mostre.
- Sem capa: avise. Eu escolho uma, ou você busca opções com `/capa`.
- Sem nenhuma lista em lugar nenhum: pare e peça.

## Passo 1: dados

- Confira que a lista fecha em 100 cartas, respeita a identidade de cor do comandante e que o Scryfall reconhece todos os nomes. Liste o que não bater.
- Busque texto oficial, custo, tipo e preço de cada carta, usando o cache.

## Passo 2: confronto das análises de fora

Leia tudo em `entrada/`. Cada arquivo é uma opinião, não uma verdade. Escreva `CONFRONTO.md` na pasta do deck:

- onde as análises concordam;
- onde divergem, carta a carta, e qual você segue e por quê;
- o que cada uma afirma que o texto oficial da carta desmente (regra errada, carta que não faz o que dizem, corte de terreno tratado como corte de mágica);
- o que nenhuma viu.

Concordância entre IAs não prova nada: elas erram juntas. Quem decide é o texto da carta e o plano do deck.

## Passo 3: proposta, antes de avaliar

Devolva para eu aprovar: o plano do deck em uma frase; os agrupamentos que fazem sentido para este deck, com uma linha cada; a proposta de tema (três opções de nome para o painel, no espírito de Ritos de Sangue, Coro da Alvorada e Dízimo das Almas; clima; paleta de cinco cores; a moldura, que é retrato por padrão; um motivo gráfico ligado ao comandante e à capa, que se inspira nos painéis existentes sem copiar nenhum). Diga se o motivo já existe no motor ou se é acréscimo ao motor. Pare aqui e espere minha resposta.

## Passo 4: avaliação carta a carta

Siga `contexto/AVALIACAO.md`. Para cada carta: notas de 0 a 3 nos agrupamentos, tier, relevância, uma frase do que faz e uma do porquê neste deck. Depois: combos e linhas de jogo, diagnóstico, fila de corte, e um radar com 8 a 15 cartas de fora (entra, avaliar, fica de fora), cada uma com motivo e com quem sairia.

Escreva também a `estrategia` (formato em `contexto/ARQUITETURA.md`): início, meio e fim, cada fase com turnos, plano, fortes e fracos, e contra quem o deck vai bem, equilibrado ou mal, com o motivo. Use os números da lista, conferidos.

Cartas de estimação, ou candidatas que o dono apontou, levam `fora_do_corte`: nunca entram na fila de corte nem aparecem como `sai` no radar. Preço não se escreve à mão: vem do Scryfall no build.

A aba 8×8 nasce sozinha: cada carta cai no agrupamento de maior nota (terreno em Mana). Só use `"pacote"` numa carta quando o maior valor não for onde ela deve contar na teoria 8×8. Confira, depois do build, se algum quadro ficou muito cheio ou vazio sem querer.

Marque `"caro_por_desenho": true` nas cartas de custo alto que custam menos na prática (redução de custo, custo alternativo, protótipo, aventura), para o quadro "Custo e curva" não sugerir trocá-las por custo. Tier S e intocáveis já ficam fora da lista das mais caras sem marca.

## Passo 5: revisão comigo

Antes de montar, mostre: todas as cartas tier S e todas as BAX, com o motivo; as cinco avaliações em que você tem menos certeza; as trocas que recomenda. Ajuste o que eu contestar.

## Passo 6: montar

Imagens, build, testes e hub.

## Pronto quando

`saidas/$ARGUMENTS.html` abre sem internet com as imagens, os testes passam, o hub mostra o deck, e eu aprovei S, BAX e trocas.

Ao terminar: `contexto/ESTADO.md`, uma entrada no `HISTORICO.md` do deck e commit `deck: $ARGUMENTS v1.0`.
