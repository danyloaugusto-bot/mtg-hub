---
name: atualizar-deck
description: "Confronta uma análise nova de outra IA com o painel que já existe e aplica só o que o dono aprovar."
argument-hint: "<pasta do deck, ex.: 02. Strefan>"
model: opus
effort: high
disable-model-invocation: true
---

# /atualizar-deck

Deck: $ARGUMENTS

Para deck que já tem painel. Uma análise nova é mais uma fonte de ideias e mais um voto nas divergências, não uma decisão. O que já foi aprovado fica, e o que o dono já decidiu não se rediscute por voto. Para deck sem painel, o comando é o `/novo-deck`.

# Arquivos

- Lê: a pasta `dados/$ARGUMENTS/` inteira (`deck.md`, `decklist.txt`, `CONFRONTO.md`, `avaliacao.json`, `comunidade.json`, `HISTORICO.md` e tudo em `entrada/`), mais `contexto/AVALIACAO.md`.
- Grava, só depois do "pode": `CONFRONTO.md` (uma fonte nova e uma seção nova), `avaliacao.json` (só o que foi aprovado), `HISTORICO.md`, `testes/controle/$ARGUMENTS.json` (se o placar mudar de propósito) e `contexto/ESTADO.md`.
- Nunca: `decklist.txt` e `tema.json`. `deck.md` só muda para registrar uma decisão nova do dono.

# Passos

1. **Achar o material novo.** É o que está em `entrada/` e não aparece na tabela de fontes do `CONFRONTO.md`. Arquivo solto na raiz da pasta vai para `entrada/` antes de começar; diga o que moveu. Se não houver material novo, pare e diga. Se houver mais de um, diga quais vai ler.
2. **Ler o material inteiro:** texto, planilha e imagens. Conferir no Scryfall o texto de toda carta que ele cita, dentro e fora da lista: identidade de cor, legalidade (banida não entra), Game Changer.
3. **Confrontar com o que está aprovado** (o `avaliacao.json` e o `CONFRONTO.md` atuais, não o material bruto anterior):
   - onde concorda com o painel: mais um voto, nada muda;
   - onde diverge, carta a carta: votos a favor e contra, com as siglas das fontes e o dono quando ele já decidiu, e o que você segue;
   - o que o texto oficial desmente: regra errada, carta que não está na lista, corte de terreno tratado como corte de mágica, número de site de comunidade lido como força;
   - o que é novo: cartas que não estão no deck, no radar, nos potenciais nem entre as recusadas.
4. **Parar e mostrar a proposta:** o que muda (cartas novas no radar e com que veredito; notas, tiers ou trocas recomendadas que mudariam, com o motivo), o que fica igual e o efeito no placar e nas trocas. Se nada muda além do confronto, diga. Espere o "pode".
5. **Com o "pode", aplicar só o que foi aprovado:**
   - `CONFRONTO.md`: uma linha na tabela de fontes (a próxima letra, o arquivo, a data e uma observação) e uma seção "Mais um voto: a análise X (data)", com a tabela de votos e o que o texto desmente;
   - `avaliacao.json`: editar no lugar, preservando todo o resto; não regerar do zero. Carta nova no radar leva notas, tier, relevância, veredito, motivo e quem sairia, como as outras;
   - montar o painel, rodar `python testes/todos.py --deck "$ARGUMENTS" --sem-montar`, montar o hub (`python motor/build.py --hub`) e rodar `python testes/hub.py`;
   - se o placar ou o placar com as trocas mudou de propósito, atualizar os números de controle.

# Regras

- O que o dono já decidiu (cartas de estimação, combo mantido, bracket, preferências registradas em `deck.md` e no `HISTORICO.md`) aparece como voto contra quando a análise diverge, e fica como está.
- A `decklist.txt` nunca muda. As trocas do radar são sugestão.
- Concordância entre IAs não prova nada: elas erram juntas. Decidem o texto da carta e o plano do deck.
- Análise sem lista exata de trocas não autoriza troca recomendada: as ideias dela entram no radar como "avaliar".
- Identidade de cor é inegociável. Carta banida não entra em lugar nenhum.
- Os textos do painel usam o nome impresso da carta física; o nome do Scryfall fica nas chaves.
- Se a análise pede uma mudança grande (agrupamentos novos, um terço das notas ou mais, tema novo), pare e sugira refazer com o `/novo-deck` ou um plano.

# Pronto quando

- O `CONFRONTO.md` tem a fonte nova e a tabela de votos.
- Painel e hub foram montados de novo, e os testes do deck e do hub passam.
- Há uma entrada no `HISTORICO.md` do deck e uma linha no `contexto/ESTADO.md`.
- Commit `deck: <pasta>, nova análise de fora (fonte X)`.
