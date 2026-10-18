---
name: plano
description: "Classifica o plano de um deck (habilitadoras, recompensas, multiplicadoras), dá o veredito e monta os cenários para um deck mais forte e equilibrado."
argument-hint: "<pasta do deck> | todos"
model: opus
effort: high
disable-model-invocation: true
---

# /plano

Alvo: $ARGUMENTS

O Plano do deck é uma lente ao lado da pontuação v3 (`contexto/plano/METODO-PLANO.md`, aprovado pelo dono em 18/10/2026). Ele não muda os dez critérios nem o placar. A régua mora em `motor/plano.json`; o piloto, que serve de exemplo de classificação, em `contexto/plano/piloto-clavileno.json`.

Com `todos`: lotes de 5 decks, na ordem dos grupos (01 a 05), pulando os que já têm `plano.revisado` (a não ser que o dono peça de novo). Um deck por vez dentro do lote.

# Arquivos

- Lê: `contexto/plano/METODO-PLANO.md`, `motor/plano.json`, `contexto/plano/piloto-clavileno.json`, o `avaliacao.json`, o `tema.json` e a `decklist.txt` do deck, `dados/cartas.json`, o cache do Scryfall, a Caixa e as pastas.
- Grava: `papel`, `papel_dupla` e `papel_por_que` nas cartas e no radar do `avaliacao.json` do deck; o bloco `plano` (comandante e `revisado`); o papel das candidatas da Caixa e das pastas na chave `avaliadas` (pelo script); `contexto/ESTADO.md` ao fim de cada lote.
- Nunca: `decklist.txt`, os dez critérios, os pesos, o placar, as listas da Caixa e das pastas.

# Passos

1. **Dossiê.** `python motor/plano.py --deck "<pasta>" --dossie <arquivo.json>`: o comandante, as cartas do deck e do radar ainda sem papel, e as dez cartas da Caixa e das pastas, nas cores do deck, com maior encaixe nele, cada uma com o texto do Scryfall, as notas da v3 e a régua das duas sinergias do deck.
2. **Classificar** pelo método, lendo o texto do dossiê, nunca de memória:
   - o papel do comandante (habilitadora, recompensa ou multiplicadora; deck com dois comandantes, um para cada), com uma frase;
   - cada carta: o papel principal ou nenhum (estrutura), a dupla função quando houver (outro papel, ou Draw, Ramp, Remoção) e uma frase de porquê;
   - as regras do método valem: o papel é deste deck; o plano é definido pelo papel, não pela nota de sinergia; em tribal, o corpo da tribo que o comandante usa é habilitadora e o lorde é multiplicadora.
3. **Mostrar antes de gravar:** a tabela por papel (carta, tier, papel, dupla, porquê), o papel do comandante, as contagens, o veredito e as checagens. Aponte os casos discutíveis (no máximo cinco) e espere o "pode" do dono. No `todos`, mostre o lote inteiro (os cinco decks) e espere um "pode" por lote.
4. **Gravar.** Com o "pode", grave num JSON `{pasta: {"comandante": [...], "cartas": {nome: {"papel", "papel_dupla", "papel_por_que"}}, "candidatos": {nome: {...}}}}` e rode `python motor/plano.py --gravar <arquivo.json>`.
5. **Montar e conferir.** `python motor/build.py --deck "<pasta>"` (ou `--todos` no fim do `todos`) e `python motor/build.py --hub`. Rode `python testes/plano.py` e `python testes/todos.py --deck "<pasta>"`.
6. **Mostrar o resultado:** `python motor/plano.py --deck "<pasta>"` imprime o veredito e os cenários (hoje, sem comprar nada, radar como está, recomendado), com o placar antes e depois. Diga em uma frase o que o dono ganha com o recomendado, e quando o radar como está equilibra mas enfraquece.

# Regras

- Texto de carta nunca de memória; sem texto no cache, rode o Scryfall ou pare e diga.
- Toda classificação tem frase de porquê.
- Carta da Caixa ou de pasta não entra no radar por este comando: só ganha papel em `avaliadas`, para o cenário "sem comprar nada".
- Se a reavaliação de sinergia contra a Caixa e as pastas ainda não rodou para o deck, faça junto, na mesma passada: o mesmo dossiê serve para `sin1`, `sin2` (pela régua do `tema.json`) e papel. Grave a sinergia com `python motor/caixa.py --gravar-avaliadas` e o papel com `--gravar`.
- Sem preço no painel ou no hub. Sem perguntas sobre bracket ou cartas de estimação.

# Pronto quando

- O deck tem o quadro Plano do deck na Visão geral, com veredito, cenários e as cartas por papel.
- `testes/plano.py` e a bateria do deck passam.
- `contexto/ESTADO.md` tem a linha do lote, com o veredito de cada deck.
