---
name: rebranding
description: "Rebranding dos gráficos do topo pelo guia visual, um lote por vez, com protótipo aprovado antes do código."
argument-hint: "<lote: 1 | 2 | 3 | 4>"
model: opus
effort: high
disable-model-invocation: true
---

Lote: $ARGUMENTS

Leia, nesta ordem:

1. `contexto/visual/GUIA-VISUAL.md`: a régua (princípios, inventário, kit técnico, processo, checklist). A tabela "Processo do rebranding" diz quais decks estão em cada lote e o que muda em cada um.
2. `contexto/visual/prototipos/tempestade.js` e `storm_antes_depois.png`: a régua de acabamento (núcleo claro, corpo na cor do critério, brilho difuso, profundidade, textura sutil).
3. `motor/painel/app.js`, em `motivoSvg` e nos motivos de `motor/painel/motivos/`: a API que os desenhos usam (`ctx`, `groups`, `pol`, `uid`, `defs`).

## Antes de começar

- `git status`. Se houver mudança no `motor/` de outra sessão, pare e me avise. Uma sessão por vez no motor.
- Trabalhe num ramo `rebranding-lote-<N>`.
- Os gráficos já têm os 10 critérios da v3, com ▲ e ▼. Isso não muda. Também não mudam a escala (regra C, "cheio quer dizer 1,5 vez o máximo"), o toque que abre a aba Critérios nem a legenda.
- O conceito dos gráficos marcados como "votado" no guia não se discute. Só o acabamento muda.

## Parada 1: protótipo

1. **Só no lote 1, antes de tudo:** mostre o plano do kit de luz compartilhado. São os filtros comuns em `defs`, os helpers de geometria, a semente fixa por deck e a função única de rótulo, e o plano diz onde entram para que todo motivo os use. É uma mudança de motor: espere meu "pode" (regra 9 do `CLAUDE.md`).
2. Desenhe o protótipo de cada deck do lote com os números, as cores e o tema reais de hoje:
   - **lotes 1 e 2:** 2 ou 3 variações por deck, seguindo a direção do guia;
   - **lotes 3 e 4:** uma variação só, o desenho atual com o kit de luz.
3. Mostre cada deck em 1360px (na coluna ao lado do texto do herói, nunca em outra linha) e em 375px. Também mostre o de hoje ao lado, para comparar.
4. Monte uma página de escolha como a da votação de 15/10 (https://claude.ai/artifact/XyyowYxwM8jpWf7XoTVAKD). Se não puder publicar, grave as imagens em `contexto/visual/lotes/lote-<N>/` e me mostre.
5. **Pare e espere a minha escolha** (por exemplo: "Storm: A; Humanos: B; Turtle: mais"). Para quem eu pedir "mais", faça uma nova rodada só daquele deck.

## Parada 2: resultado

1. Implemente o que eu escolhi como motivo em `motor/painel/motivos/<nome>.js`, na API de `motivoSvg`, usando o kit compartilhado. Troque o `grafico` no `tema.json` do deck quando o nome mudar.
2. Para cada deck, passe o checklist de aceite do guia, item a item.
3. Rode `python testes/layout.py --deck "<pasta>"` e `python testes/todos.py --deck "<pasta>"` em cada deck do lote, e `python testes/hub.py`.
   - `layout.py` precisa medir: nenhum rótulo do gráfico fora da tela em 375px, nada abaixo de 13px e o gráfico ao lado do texto em 1360px. Se ainda não mede, acrescente.
4. Monte os decks do lote (`python motor/build.py --deck "<pasta>"`) e o hub.
5. Mostre antes e depois de cada deck, em 1360px e 375px. **Pare e espere o meu "pode publicar".**

## Depois do "pode publicar"

1. Publique os decks do lote seguindo `.claude/skills/publicar/SKILL.md`, por cima dos links do `contexto/inventario.csv`, sem passar `capabilities`.
2. No `GUIA-VISUAL.md`, marque o lote como feito na tabela do processo e atualize o inventário: gráfico, veredito "feito em <data>".
3. Atualize `contexto/ESTADO.md` com uma linha do que mudou e a próxima ação: o próximo lote. No `HISTORICO.md` de cada deck, uma linha com o gráfico novo. Na primeira execução, registre este comando em `contexto/MODELOS.md`.
4. Faça o merge do ramo na `master` e o commit: `rebranding: lote <N> (<decks>)`.
5. Diga em três linhas o que mudou e qual é o próximo lote.
