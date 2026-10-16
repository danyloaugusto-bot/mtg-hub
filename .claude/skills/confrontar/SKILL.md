---
name: confrontar
description: "Compara o deck com listas de fora (link do Moxfield ou arquivo em entrada/listas/), pela pontuação v3, e mostra no painel."
argument-hint: "<pasta do deck> [link do Moxfield]"
model: sonnet
effort: medium
disable-model-invocation: true
---

Deck e link: $ARGUMENTS

O confronto responde, de forma recorrente, se o deck do dono está mais forte que uma lista de fora, e o que a lista de fora joga que o deck não tem. Tudo pela pontuação v3 (`contexto/pontuacao/RUBRICA.md`) e pelas sinergias deste deck.

1. Se veio um link do Moxfield, rode `python motor/confronto.py --deck "<pasta>" --moxfield <link>`: a lista é baixada pela API pública do site e gravada em `dados/<pasta>/entrada/listas/<autor>.txt`, com cabeçalho (nome, autor, fonte, url, data). Sem link, rode `python motor/confronto.py --deck "<pasta>"`: ele relê todas as listas da pasta. Link de outro site, ou que exige login: peça ao dono a lista em texto, uma carta por linha, e grave o arquivo você mesmo com o mesmo cabeçalho.
2. O script avisa as cartas **sem cadastro** em `dados/cartas.json` (valem 0 no placar da lista). Dê a cada uma a entrada pela rubrica (os oito critérios da carta, `por_que` curto sem citar deck, `fonte: "claude"`) e rode o script de novo. A sinergia dessas cartas neste deck fica em 0, marcada "a avaliar": o placar da lista é um piso.
3. Monte o painel (`python motor/build.py --deck "<pasta>"`). A caixa "Contra outras listas" fica na aba Radar: placar e CMC lado a lado, os dez critérios (pontos e cartas com nota 2 ou 3, com ▼▲ da faixa), as cartas dela que o deck não tem com o ganho do encaixe (`motor/encaixe.py`), em comum e só no seu.
4. Mostre ao dono: o placar dos dois; os três critérios em que a lista de fora leva vantagem; as cinco cartas dela de maior ganho no deck, dizendo quais você levaria ao radar e por quê (a carta é boa, ou é boa com este comandante?). Não mude o radar sozinho: o dono aprova, e a carta entra pelo `/atualizar-deck`.
5. Rodar de novo com o mesmo link substitui a lista, se o autor mexeu nela. Para tirar uma lista do confronto, apague o `.txt` e rode o script.

Ao terminar: uma linha no `HISTORICO.md` do deck e commit `confrontar: <pasta>`.
