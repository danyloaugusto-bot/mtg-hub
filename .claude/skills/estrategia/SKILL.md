---
name: estrategia
description: "Lê o material de estratégia do dono (dados/estratégias/<tema>/: .md, imagens, PDF, áudio, vídeo), atualiza o digest, audita os decks pela teoria e propõe melhorias em lotes de 5."
argument-hint: "<tema> | todos"
model: opus
effort: high
disable-model-invocation: true
---

# /estrategia

Tema: $ARGUMENTS

O dono solta material de estratégia em `dados/estratégias/<tema>/` (handovers, infográficos, PDF e os áudios e o vídeo do NotebookLM) e quer que **tudo** seja lido e aplicado aos decks. O material é opinião, como `entrada/`: quem decide é o texto da carta e o plano de cada deck. O digest verificado mora em `contexto/estrategias/<tema>.md`. Com `todos`: cada subpasta de `dados/estratégias/`, uma por vez.

# Passos

1. **Converter.** `python motor/ler_midia.py "<tema>"`: PDF vira texto (e imagem nas páginas sem texto), áudio vira transcrição local com tempo, vídeo vira transcrição e folhas de quadros, tudo em `dados/estratégias/<tema>/_lido/`. Só converte o que é novo ou mudou. Falha de um arquivo: diga qual e por quê, não pule calado.
2. **Ler tudo.** Os .md e as imagens da pasta, e tudo em `_lido/` (as transcrições inteiras, as páginas do PDF, as folhas de quadros). Liste ao dono o que foi lido e o que não deu para ler. Nome de carta citado em áudio pode vir errado na transcrição: confira no Scryfall antes de usar.
3. **Digest.** Atualize `contexto/estrategias/<tema>.md`: o que o material diz, o que é novo em relação ao digest anterior, onde as fontes divergem e qual seguimos, e as **regras de decisão** para o hub (como o tema muda radar, cortes, tier e trocas). Critique: afirmação que o texto da carta ou a conta desmente, sai.
4. **Auditar os decks** (os 26 fora do Desejo) pelas regras do digest, com script que só lê, e grave `contexto/estrategias/<tema>-auditoria.md`. Para o 8×8: pacotes por deck (como a aba 8×8 conta), buracos, estourados, a curva de mana dentro de cada pacote e o checklist do material (ramp barato, terrenos, CMC médio, overlap).
5. **Propor por lote de 5 decks**, na ordem dos grupos: para cada achado, a carta que entra (do radar, da Caixa, das pastas ou nova, com texto do Scryfall), o pacote que reforça, quem sai e de que pacote. **Espere o "pode" de cada lote.** Em paralelo ao lote seguinte, pode gravar o lote aprovado.
6. **Gravar** o lote aprovado no radar do `avaliacao.json` (veredito, sai, nota com a data), `python motor/build.py --deck "<pasta>"`, `python testes/todos.py --deck "<pasta>" --sem-montar`; no fim, `--hub` e `testes/hub.py`. Placar com as trocas que muda de propósito: atualize o controle com a nota de origem.
7. **Fechar:** uma linha no `contexto/ESTADO.md` e no `HISTORICO.md` de cada deck tocado. Commit só com o ok do dono, um por arquivo.

# Regras do dono que valem aqui

- Teoria é ponto de partida, não camisa de força: **buraco é pacote que o deck se propõe a ter e está curto**. Proteção, recursão e outros pacotes da teoria são sugestão; nem todo deck precisa deles (16/11/2026). Pacote vazio por decisão registrada (Markov sem pedras) e Petcards não são buraco.
- Não cortar de pacote em 8 ou menos para engordar pacote estourado; dizer em toda troca qual pacote reforça e de qual tira.
- Letras do radar: só S e A recebem "entra"; B é "avaliar" quando é da tribo ou fecha buraco; C e D saem do radar.
- Tribal: carta da tribo não sai por não-tribo do mesmo nível. Valgavoth: Demônio só sai por Demônio. MDFC só sai por terreno. Desejo fora de tudo. Precon intacto nunca recebe "entra".
- Staples e proteção genérica só com buraco no pacote que preenchem (proteção genérica de equipamento, só voltron). Nunca Sol Ring, Arcane Signet nem segunda Tergrid.
- Texto de carta nunca de memória. Sem preço. Sem perguntas sobre bracket ou cartas de estimação. Código de cores W U B R G C.
- O material original (áudio, vídeo, PDF) não vai ao Git; `_lido/` com os .md, sim.
