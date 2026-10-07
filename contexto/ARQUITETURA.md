# Arquitetura

## A decisão

Um motor, um artefato por deck, um hub gerado no mesmo build. Decidido em 07/10/2026, com cerca de 25 decks em vista.

Por que não um artefato só com seletor de comandante: a página publicada tem teto de 16 MiB e cada deck com imagens pesa perto de 4 MB; um erro de publicação derrubaria todos os decks; e cada comandante tem tema próprio.

Por que não um código por deck: o mesmo conserto teria de ser feito 25 vezes e os painéis divergiriam. Isso já tinha começado, com o painel da Giada feito à parte.

## O que o motor precisa receber como configuração

Hoje, no kit do Clavileño, isto está fixo no código e precisa sair dele na etapa 1:

- Os agrupamentos: nome, abreviação, descrição, cor e faixa de referência. O Clavileño usa Ramp, Draw, Removal, Recursão, Sacrifice, Tokens, Sinergia + PetCard, Especial. A Giada usa Ramp, Draw, Removal, Proteção, Buff, Token, Sinergia, Especial. O motor deve aceitar de 6 a 10.
- Tema: nome do painel, paleta, fontes, textura de fundo, textos do topo e do rodapé.
- Diagnóstico: quais leituras fazem sentido para o deck e seus limiares (por exemplo, "conversores de morte em dano" só existe em deck de sacrifício).
- Combos e linhas de jogo, radar e dados de comunidade.

## Contrato de um deck

A etapa 1 fecha o formato exato e atualiza esta seção. O ponto de partida:

| Arquivo | Conteúdo |
|---|---|
| `deck.md` | Ficha escrita pelo dono: comandante, plano, agrupamentos, cartas de estimação, clima visual. |
| `capa.*` | A imagem que o dono escolheu para o deck. Vai no topo do painel e no cartão do hub. |
| `entrada/` | Tudo o que veio de fora: handovers de outras IAs, planilhas, prints. Opinião, não verdade. |
| `CONFRONTO.md` | O que foi aproveitado e recusado de cada análise de fora, e por quê. |
| `decklist.txt` | `1 Nome da Carta (SET) número`, com `*F*` para foil. Primeira linha é o comandante. |
| `tema.json` | Nome do painel, paleta, fontes, agrupamentos com cor. |
| avaliação | Por carta: notas, tier, relevância, o que faz, por que no deck, marcadores. Radar e combos. |
| `HISTORICO.md` | Versões do deck: data, o que entrou, o que saiu, motivo. |

## Imagens

Baixadas uma vez para `cache/img/`, compartilhadas entre decks (Sol Ring aparece em quase todos), reduzidas a 340 px de largura e embutidas no HTML de cada deck no build.

## Onde o estado do usuário mora

Edições feitas dentro de um painel (tier, notas, trocas, anotações) ficam naquele painel: no navegador, se for arquivo local; na conta, se for página publicada. O hub mostra a foto do último build, não essas edições. Para o hub refletir uma mudança de verdade, ela precisa voltar para `dados/<pasta>/` (pelo backup do painel) e passar por um build.

## O hub

Lê as pastas de `dados/`, o `contexto/inventario.csv` (para os decks que ainda não têm pasta) e o resumo de cada deck montado. Mostra os grupos do aplicativo do dono: 01. Top, 02. Tribais, 03. Caos, 04. Forfun, Compras + Precon. O grupo é o número no nome da pasta do deck: mover de grupo é renomear a pasta.

## Atalhos que funcionam sem internet

`Abrir o Hub.html`, na raiz, leva ao hub. Cada pasta de deck ganha `Abrir o painel.html`. Tudo por caminho relativo.

## A Oficina de cada painel

O painel não tem IA dentro dele quando é um arquivo local. A aba Oficina faz a ponte: lista o que dá para pedir ao Claude Code sobre aquele deck, com o comando já preenchido para copiar. O caminho de volta é o `/importar-backup`.
