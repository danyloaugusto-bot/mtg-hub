---
name: motor
description: "Etapa 1. Generaliza o Ritos de Sangue em um motor para todos os decks, provado com o Clavileño."
model: opus
effort: xhigh
disable-model-invocation: true
---

Objetivo: transformar o painel do Clavileño em um motor que monta o painel de qualquer deck. O alvo não é só repetir o Ritos de Sangue: é o padrão unificado de `contexto/PARIDADE.md`, que soma o Ritos de Sangue e o Coro da Alvorada.

## O que fazer

0. Leia também `dados/01. Giada/entrada/coro-da-alvorada.html`. Ele saiu do mesmo código, em outra conversa, e tem peças que o Ritos não tem. Onde os dois resolvem a mesma coisa de jeitos diferentes, vale o que está decidido em `contexto/PARIDADE.md`.
1. Crie `motor/` a partir de `contexto/origem/ritos-de-sangue-kit/` (código do painel, scripts de montagem, fontes). A pasta de origem continua intocada.
2. Tire do código tudo o que é do Clavileño e leve para os dados do deck: os agrupamentos (nome, abreviação, descrição, cor, faixa de referência); paleta, fontes, textura e nome do painel; textos do topo, do rodapé e dos diagnósticos, com seus limiares; combos, radar e dados de comunidade.
3. Feche o contrato de dados de um deck em `dados/<pasta>/` e descreva-o em `contexto/ARQUITETURA.md`. Atualize `dados/_modelo/`.
4. Migre o Clavileño para `dados/02. Clavileño/` nesse contrato. A avaliação vem de `annot.py` e `edh.py` do kit de origem. Não reavalie nada. A capa é `capa.png`.
5. `python3 motor/build.py --deck "02. Clavileño"` gera `saidas/02. Clavileño.html`. `--todos` percorre `dados/`, ignorando `_modelo`. O nome do arquivo de saída é sempre o nome da pasta do deck.
6. A cada montagem, grave também `Abrir o painel.html` dentro da pasta do deck: um atalho que leva ao HTML em `saidas/`, por caminho relativo, para funcionar sem internet.
7. Aba nova no painel, "Oficina": lista o que dá para pedir ao Claude Code sobre este deck, cada item com o comando já preenchido com o nome da pasta e um botão de copiar. No mínimo: auditar, comparar duas cartas, avaliar coleção nova, trocar a capa, e levar para o projeto o que foi editado no painel (com o backup copiado junto).
8. O topo do painel segue a seção "O topo do painel" do padrão: os mesmos elementos em todo deck, com duas molduras de capa (larga e retrato) e o desenho do gráfico vindos do tema.
9. Leve os testes para `testes/` e faça-os receber o deck como parâmetro.

## Restrições

- O painel continua sendo um HTML único, sem dependência externa, que funciona nos três ambientes descritos no handover do kit: arquivo local, página publicada e prévia.
- Sem framework e sem etapa de build em Node. Python gera, JavaScript puro roda.
- De 6 a 10 agrupamentos sem quebrar o layout: rosácea, tabelão e gaveta se ajustam.

## Pronto quando

- `saidas/02. Clavileño.html` mantém os números do painel de origem (placar 485, mesmas contagens por agrupamento, tier e relevância) e ganha as peças do Coro listadas no padrão. Mostre a comparação.
- Cada item de `contexto/PARIDADE.md` está marcado como conferido, ou explicado.
- Os testes de regressão e de página publicada passam no caminho novo.

## Antes de começar

Mostre o plano: arquivos que vai criar, formato do tema e formato da avaliação, e como fica o topo do painel em cada uma das duas molduras. Espere meu "pode".

## Ao terminar

Atualize `contexto/ESTADO.md` e a seção de comandos do `CLAUDE.md`. Commit: `etapa 1: motor generalizado e Clavileño migrado`.
