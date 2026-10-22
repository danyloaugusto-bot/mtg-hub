# A Consulta: uma carta de fora contra todos os decks

> **Atualização de 22/10/2026, à noite.** O desenho abaixo foi superado pelo pedido `PROMPT-CODE-CONSULTA.md`: a Consulta virou página própria (`saidas/00. Consulta.html`, botão na barra ao lado do Grimório), não uma caixa no Grimório. Decisões do dono no mesmo dia: **é só consulta**, nada grava cadastro, radar ou deck (as oito notas da carta ficam no registro, em `_cadastro`; quem move carta é a Caixa e as pastas); a página **pode mostrar o preço do Scryfall**; quem sai é obrigatório só em `entra` e `avaliar`. Por isso as seções "Fase 2" e "dados/cartas.json, com o pode do dono" ficam como histórico. O estado atual está em `contexto/ARQUITETURA.md`, seção "A Consulta".

Pedido do dono, 22/10/2026: "uma forma de consultar uma carta em específico pra saber em qual deck ela se encaixa melhor, qual tier, critério ou 8×8; uma análise completa dela pra cada um dos meus decks". Exemplo: Salt Vampire (TRK 127), um Vampiro preto, com cinco decks de Vampiros nas cores dela.

## A resposta curta

Um comando, `/consulta <link do Scryfall ou nome>`, que roda no Claude Code. Não uma aba que analisa sozinha.

## Por que não uma aba CONSULTA que recebe o link e analisa

1. **A página não alcança o Scryfall.** Painel, hub, Caixa e Grimório são HTML estático: o arquivo local não grava nada no projeto, e o artefato publicado bloqueia `fetch` para outros domínios (o mesmo motivo de o Grimório se atualizar pelo `/grimorio atualizar`, `METODO-GRIMORIO.md`). Sem o texto oficial, a regra 5 manda parar.
2. **A análise é julgamento, com o porquê escrito (regra 7).** A sinergia de uma carta em cada deck sai da régua do `tema.json`, lida ao pé da letra. Um script na página que adivinhasse por palavra-chave erraria exatamente onde importa: daria sinergia à Salt Vampire na Tergrid (o oponente exila a carta da mão, não descarta: a Tergrid não dispara) e nos Zumbis (Shapeshifter não é Changeling).
3. **O resultado precisa voltar ao projeto.** O veredito vira registro, radar e sinergia avaliada (`avaliadas`), que a Caixa e o Grimório usam. Uma página publicada não escreve em `dados/`.

O que a página pode fazer bem, sem rede e sem julgamento, está na fase 2.

## O que a Consulta responde

As cinco perguntas da Caixa, para uma carta que o dono ainda não tem:

| Pergunta | De onde vem |
|---|---|
| O que ela faz de verdade? | Texto do Scryfall (cache), nunca de memória |
| É forte sozinha? | Valor próprio pelos oito critérios do cadastro (RUBRICA), contra a mediana do cadastro; posição nas lentes do Grimório da tribo e da cor; EDHREC; Game Changer |
| Em qual deck rende, no lugar de quem? | `sin1` e `sin2` em **cada** deck nas cores dela, pela régua do deck; o encaixe v3 (`encaixe.ganho`), com saturação, quem sai, critérios em falta, variação do CMC e da aceleração, tier estimado e posição na fila do deck |
| Onde não entra, e por quê? | Decks fora da identidade (o script nem os avalia) e as armadilhas, escritas |
| Vale comprar? | Ganho contra a régua da Caixa (`deck_ganho_min` 10, `guardar_ganho_min` 5) e o preço em dólar do Scryfall: comprar, esperar, só se sobrar, ou não |

O 8×8 entra pelo dossiê: as cartas com que a consultada disputa a vaga (mesmo tipo, custo até 1 de distância) e as mais fracas do deck. "Quem sai" na prática vem daí: o "sai" do motor é a carta de menor valor do deck inteiro, que às vezes é uma MDFC ou uma peça que ninguém cortaria.

## Arquivos

| Arquivo | O que é |
|---|---|
| `contexto/consulta/SKILL-consulta.md` | O comando: passos, formato da resposta, regras. Vai para `.claude/skills/consulta/SKILL.md` (a sessão na nuvem não grava em `.claude/`; ver "Para integrar") |
| `motor/consulta.py` | O script: acha a carta (link de carta, busca de uma carta só, ou nome), grava o dossiê, calcula o encaixe com as sinergias avaliadas, grava vereditos e compra, lista as consultas. Não grava em deck nem no cadastro |
| `dados/consultas/<carta>.json` | O registro: a ficha da carta e uma entrada por dia de consulta (preço do dia, cadastro usado, sinergias com o porquê, encaixe, vereditos, compra). Carta recusada fica registrada, para não rediscutir |
| `testes/consulta.py` | 34 verificações sem rede, com registro numa pasta temporária |
| `motor/dados.py` | `consultas` entrou em `PASTAS_FORA`: sem isso, o motor tomaria `dados/consultas/` por um deck |

Comandos:

```
python motor/consulta.py "<link ou nome>"                         a ficha da carta
python motor/consulta.py "<link ou nome>" --dossie <arq.json>      o dossiê para o Claude avaliar
python motor/consulta.py "<link ou nome>" --sinergias <arq.json>   o encaixe com as sinergias, e o registro do dia
python motor/consulta.py "<link ou nome>" --vereditos <arq.json>   vereditos e compra no registro do dia
python motor/consulta.py --listar                                  as consultas registradas
python testes/consulta.py
```

## Fase 2, à espera do "pode" do dono

Uma caixa **Consultar** no Grimório (que já é a página "entre os decks", sem preço), com duas funções que funcionam sem rede:

1. Um campo onde o dono cola o link do Scryfall; a página monta o comando `/consulta <link>` com botão de copiar, como o campo de atualização do Grimório já faz com o `/grimorio atualizar`.
2. Se a carta já foi consultada, mostra o veredito registrado na hora (os registros entram embutidos no build): data, onde entra, quem sai, sem o preço.

E uma sub-aba **Consultas**, com a galeria das cartas consultadas, o melhor deck de cada uma e o veredito. Muda `motor/grimorio.py`, `motor/grimorio/app.js` e o teste do Grimório: pede protótipo antes do código, como o Grimório pediu.

## Para integrar (não gravado em 22/10 porque outra sessão escrevia nesses arquivos)

**Instalar o comando:** copiar `contexto/consulta/SKILL-consulta.md` para `.claude/skills/consulta/SKILL.md` (pasta nova). No PowerShell, na raiz do projeto: `New-Item -ItemType Directory .claude\skills\consulta -Force; Copy-Item contexto\consulta\SKILL-consulta.md .claude\skills\consulta\SKILL.md`. Depois, `/consulta` aparece na lista ao digitar a barra.

**`contexto/ESTADO.md`, em "Onde estamos":**

- 22/10/2026: a Consulta (`/consulta <link ou nome>`, `motor/consulta.py`, `dados/consultas/`, `testes/consulta.py` 34/34; desenho em `contexto/consulta/CONSULTA.md`). Uma carta de fora contra os decks nas cores dela: força sozinha, sinergia pela régua de cada deck, encaixe v3, veredito e compra. `consultas` entrou em `PASTAS_FORA`. Primeira consulta: Salt Vampire (TRK 127, pré-venda US$ 12,10): mediana, melhor casa Evelyn (+6,25, avaliar no lugar do Bloodcrazed Paladin), compra "não".

**`contexto/ESTADO.md`, em "Perguntas em aberto para o dono":**

- A RUBRICA e as réguas tribais dizem "Changeling e Shapeshifter contam como da tribo". No jogo, o tipo Shapeshifter sozinho não dá outros tipos: a Salt Vampire (Vampire Shapeshifter) não é Zumbi, Elfo nem Tartaruga. A Consulta deu 0 nesses decks. Proposta: "Changeling conta como da tribo; Shapeshifter só quando copia ou vira a tribo (Irma, Metallic Mimic)".

**`contexto/ARQUITETURA.md`, seção nova "A Consulta":** o resumo deste arquivo (o que responde, os arquivos, que nada grava em deck sem o "pode", e o registro em `dados/consultas/`).

**`dados/cartas.json`, com o "pode" do dono** (a avaliação usou esta entrada; a Salt Vampire ainda não está no cadastro):

```json
"Salt Vampire": {
 "n": {"resiliencia": 1, "remocao": 1},
 "por_que": "Vínculo com a vida; ao entrar, você vê a mão de um oponente e exila a melhor carta que não é terreno, mas ele compra outra.",
 "fonte": "claude",
 "revisado": "2026-10-22"
}
```

Remoção 1 e não 2: a RUBRICA dá 2 a "escolher a melhor carta (Thoughtseize)", mas aqui o oponente compra outra no lugar, o que faz dela uma troca de qualidade, não uma perda de carta.
