# Pedido para o Claude Code: o Plano do deck (18/10/2026)

Cole a partir da linha "Leia", no Claude Code, em `C:\Projetos\mtg-hub`, **só depois** que o trabalho das pastas (`contexto/caixa/PROMPT-CODE-PASTAS.md`, ramo `pastas`) tiver merge e commit, e com o motor livre. Pode ser na mesma sessão do Code.

---

Leia `CLAUDE.md`, `contexto/ESTADO.md` (só "Próxima ação"), `contexto/plano/METODO-PLANO.md` (o método aprovado pelo dono em 18/10, com as respostas dele no fim), `contexto/plano/plano.json` (a régua), `contexto/plano/piloto-clavileno.json` (o piloto, carta a carta) e o protótipo `contexto/plano/prototipo-plano-1360.png` e `-375.png` (o quadro injetado no painel do Clavileño). Este trabalho **não muda os dez critérios nem o placar da v3**.

Trabalhe num ramo `plano`. Pare e mostre ao fim da Fase 2.

## Fase 1: dado e conta

1. `contexto/plano/plano.json` vai para `motor/plano.json` (régua, como `pontuacao.json`); a cópia em `contexto/` fica como registro.
2. `avaliacao.json` de cada deck: em cada carta do deck e do radar, `papel` (`habilita`, `recompensa`, `multiplica` ou ausente = estrutura), `papel_dupla` (texto curto ou ausente) e `papel_por_que` (uma frase). No topo, `plano: {"comandante": {"papel": ..., "por_que": ...}, "revisado": "AAAA-MM-DD"}`. Deck com dois comandantes: um papel para cada. `contexto/ARQUITETURA.md` e o contrato em `testes/contrato.py` ganham os campos (opcionais: deck sem `plano` mostra o quadro "ainda não classificado").
3. Importe o piloto para `dados/02. Clavileño/avaliacao.json` (44 cartas e o comandante).
4. `motor/plano.py`: contagens por papel (sem o comandante e sem terrenos, a não ser terreno com papel), porcentagens, dupla função, as checagens (tamanho, as três faixas, multiplicadoras até as habilitadoras, a checagem do comandante, que usa a contagem de Resiliência da v3 quando o comandante é habilitadora), o veredito pelas regras do `METODO-PLANO.md` e uma frase por checagem, como no protótipo.
5. **Cenários** ("Mais forte e equilibrado", seção "As soluções" do método): Hoje, Sem comprar nada (Caixa e pastas, via `caixa.nomes()` e `dados.ler_pastas()`, nas cores do deck, com `papel` neste deck), Radar como está (trocas "entra" que mexem no papel que falta, com o `sai` do radar) e Recomendado (escolha gulosa do método). Para cada cenário: entra, sai, a mistura depois, o veredito e o placar antes e depois, pela mesma conta do painel (`stats`, com a aceleração). Aviso quando um cenário equilibra mas baixa o placar, com o motivo (por exemplo, a aceleração). No recomendado, troca a troca: papel, o que a carta faz, origem (Caixa, pasta, mover de outro deck, comprar), quem sai e o ganho. Conflitos com o radar numa nota.
6. `testes/plano.py`: refaz o piloto em Python (44 cartas: 26, 10 e 8; 16 com dupla função; veredito satisfatório) e os cenários do método com o placar de 1.107: sem comprar nada 1.109, radar como está 1.104,5 (com o aviso de aceleração), recomendado 1.118 com os quatro cortes do método. Mais um caso de mentira para cada regra do veredito e cada papel de comandante.

## Fase 2: tela

1. Painel, Visão geral: o quadro **Plano do deck** logo antes da Estratégia, como no protótipo (veredito, papel do comandante, a barra empilhada com os traços da referência, as checagens, a tabela de cenários "Mais forte e equilibrado", o recomendado troca a troca e a lista recolhível das cartas por papel, com tier e "+" para dupla função). O placar dos cenários é o número dos dez critérios; o veredito do plano nunca entra nele. As cores dos três papéis ficam no tema do painel como variáveis, com o padrão do protótipo; os textos usam a fonte do texto, não a de título (princípio 8 do `GUIA-VISUAL.md`).
2. Gaveta da carta: o papel e a dupla função, com o porquê. Tabelão: coluna "Papel", ordenável. Radar: o papel de cada candidata e o efeito da troca no veredito.
3. Hub: o veredito do plano na Lista e na Ficha de cada deck, e no Resumo do Dashboard os decks com plano insuficiente. Sem preço, como sempre.
4. Testes: `regressao.py` e `layout.py` (1360px e 375px) com o quadro; `hub.py` com o veredito.

**Pare e mostre** o Clavileño em 1360px e 375px e um deck sem classificação.

## Fase 3: o comando `/plano`

A skill está pronta em `contexto/plano/SKILL-plano.md`, escrita pelo Claude no app (o app não grava em `.claude/`). Copie para `.claude/skills/plano/SKILL.md` sem mudar o conteúdo, a não ser o que a revisão abaixo pedir. Ela usa este contrato de linha de comando, que o `motor/plano.py` precisa cumprir (implemente na Fase 1 e ajuste a skill se mudar algum nome):
- `python motor/plano.py --deck "<pasta>"`: imprime o veredito, as checagens e os quatro cenários com o placar antes e depois;
- `python motor/plano.py --deck "<pasta>" --dossie <arquivo.json>`: o comandante, as cartas do deck e do radar sem papel e as dez candidatas da Caixa e das pastas, nas cores do deck, com maior encaixe nele, cada uma com o texto do Scryfall, as notas da v3 e a régua das duas sinergias do deck;
- `python motor/plano.py --gravar <arquivo.json>`: `{pasta: {"comandante": [...], "cartas": {nome: {...}}, "candidatos": {nome: {...}}}}`; cartas do deck e do radar recebem `papel`, `papel_dupla` e `papel_por_que`; candidatas da Caixa e das pastas recebem o papel na chave `avaliadas` do deck (a mesma da Caixa), sem entrar no radar.

Revise a skill contra o que você implementou. Depois:
- `/novo-deck`, `/auditar` e `/atualizar-deck` passam a pedir o papel de carta nova no deck ou no radar.
- `contexto/MODELOS.md`: a linha do `/plano` (opus, high).
- A reavaliação de sinergia contra a Caixa e as pastas, que você propôs no `ESTADO.md` de 18/10 (5.065 pares), entra no `/plano`: uma passada por deck, o mesmo dossiê, sinergia e papel juntos. Não rode as duas separadas.

## Fase 4: fechamento

`contexto/ARQUITETURA.md` (seção "O Plano do deck"), `CLAUDE.md` (comandos), `contexto/ESTADO.md`, suíte verde, merge do ramo `plano` e commit `plano: papéis, veredito e quadro na visão geral`. Os arquivos de `contexto/plano/` são do dono e entram no commit. Os outros 29 decks são classificados depois, com `/plano todos`, lote a lote, com o "pode" do dono em cada lote.

## O que não fazer

- Mudar os dez critérios, os pesos ou o placar.
- Classificar papel de memória ou sem frase de porquê.
- Mostrar preço no painel ou no hub.
- Perguntar sobre bracket ou cartas de estimação.
