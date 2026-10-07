---
name: migrar
description: "Etapa 2. Traz para o motor um deck que já tem painel pronto em entrada/."
argument-hint: "<pasta do deck, ex.: 01. Giada>"
model: sonnet
effort: high
disable-model-invocation: true
---

Deck: $ARGUMENTS

O material de origem está em `dados/$ARGUMENTS/entrada/`: handover, kit e o HTML do painel atual.

## Antes de tudo: arrumar a pasta

Na raiz da pasta do deck ficam só `deck.md`, `decklist.txt`, `capa.*` e o que o motor gera. Se houver outros arquivos soltos ali (handovers, planilhas, HTMLs, pastas de kit), mova para `entrada/` e diga o que moveu. Não apague nada. Se houver mais de uma versão do mesmo material, use a mais recente (pelo número de revisão dentro do HTML, ou pela data) e diga qual usou.

1. Leia o handover e o painel atual. Liste o que existe lá e não existe no motor, e o contrário.
2. Monte o deck no contrato do motor, dentro de `dados/$ARGUMENTS/`. Use os agrupamentos, as notas, os tiers e os textos que já estão no painel atual. Não reavalie.
3. Se o motor precisar mudar para acomodar este deck, pare e me avise: mudança de motor é com `/motor`, em outro modelo. Nunca um atalho dentro do deck.
4. Tema: mantenha o nome do painel e a identidade visual do painel atual, inclusive o gráfico próprio dos agrupamentos, se houver. A capa é o arquivo `capa.*` da pasta, se houver.
5. O deck migrado passa a ter tudo o que está em `contexto/PARIDADE.md`, mesmo o que o painel antigo não tinha. Um backup feito no painel antigo precisa abrir no novo.

## Pronto quando

- `saidas/$ARGUMENTS.html` existe e bate com o painel de origem. Mostre lado a lado: placar, contagem por agrupamento, por tier e por relevância.
- Os painéis que já existiam continuam iguais.
- Você listou o que o deck ganhou, o que mudou e o que se perdeu na migração, se houver.

Ao terminar: `contexto/ESTADO.md` e commit `deck migrado: $ARGUMENTS`.
