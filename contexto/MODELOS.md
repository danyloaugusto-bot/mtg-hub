# Modelo e esforço por comando

Cada comando em `.claude/skills/` já declara o modelo e o esforço no cabeçalho. Esta tabela é o resumo e o porquê.

| Comando | Modelo | Esforço | O que faz |
|---|---|---|---|
| `/abrir` | sonnet | low | Abre a sessão: lê o contexto e diz onde paramos. |
| `/fechar` | sonnet | low | Fecha a sessão: testes, handover vivo e commit. |
| `/leitura` | sonnet | high | Etapa 0. Leitura inicial do projeto, sem alterar nada. |
| `/motor` | opus | xhigh | Etapa 1. Generaliza o Ritos de Sangue em um motor para todos os decks, provado com o Clavileño. |
| `/migrar <pasta do deck, ex.: 01. Giada>` | sonnet | high | Etapa 2. Traz para o motor um deck que já tem painel pronto em entrada/. |
| `/imagens <pasta do deck, ou todos>` | sonnet | medium | Etapa 3. Baixa as imagens das cartas uma vez e as embute nos painéis. |
| `/hub` | opus | high | Etapa 4. Cria ou remonta o hub, a porta de entrada de todos os painéis. |
| `/novo-deck <pasta do deck, ex.: 01. Markov>` | opus | high | Etapa 5. Cria o painel de um deck a partir da lista, da ficha e das análises de outras IAs. |
| `/atualizar-deck <pasta do deck>` | opus | high | Confronta uma análise nova de outra IA com o painel que já existe e aplica só o que o dono aprovar. |
| `/novas-cartas` | sonnet | high | Etapa 6. Completa a seção Potenciais com os lançamentos do Scryfall, para todos os decks. |
| `/colecao <código ou nome da coleção> [pasta do deck]` | opus | high | Etapa 7. Avalia uma coleção nova para um deck ou para todos, com veredito de entrada e de compra. |
| `/potenciais <pasta do deck>` | sonnet | high | Relê a página da comunidade do comandante e atualiza a lista de potenciais do deck. |
| `/publicar [pasta do deck, ou todos]` | sonnet | medium | Etapa 8. Prepara e publica os painéis e o hub. |
| `/auditar <pasta do deck>` | opus | high | Relê a avaliação de um deck com olhar de auditor, sem alterar nada. |
| `/comparar <pasta do deck> | <carta de fora> | <carta do deck>` | opus | high | Compara uma carta de fora com uma do deck e diz qual fica. |
| `/capa <pasta do deck>` | sonnet | low | Troca ou busca a capa de um deck. |
| `/conferir-lista <pasta do deck>` | sonnet | medium | Confere a decklist antes de avaliar, sem corrigir. |
| `/tema <pasta do deck>` | opus | high | Propõe variações de tema visual para um painel, sem implementar. |
| `/mover <pasta atual> para <pasta nova>` | haiku | não se aplica | Renomeia a pasta de um deck (muda grupo ou nome) e remonta o que depende dela. |
| `/compras` | sonnet | medium | Monta a lista única de compras a partir dos radares de todos os decks. |
| `/confrontar <pasta do deck> [link do Moxfield]` | sonnet | medium | Compara o deck com listas de fora (Moxfield ou arquivo), pela pontuação v3, e mostra no painel. |
| `/caixa [aplicar] [pastas de deck]` | opus | high | Lê as listas da Caixa, avalia a sinergia das cartas nos decks (mostra antes de gravar) e monta a página; com `aplicar`, executa as decisões do dono. |
| `/plano <pasta do deck> \| todos` | opus | high | Classifica o plano do deck (habilitadoras, recompensas, multiplicadoras), dá o veredito e monta os cenários mais forte e equilibrado; com `todos`, lotes de 5 com o "pode" do dono, e a reavaliação de sinergia junto. |
| `/precos [origem]` | sonnet | low | Atualiza o valor de hoje das cartas da Caixa e das pastas (Scryfall de novo e dólar PTAX) e monta a página da Caixa. |
| `/rebranding <lote: 1 \| 2 \| 3 \| 4>` | opus | high | Refaz os gráficos do topo pelo guia visual, um lote por vez, com protótipo aprovado antes do código e o "pode publicar" do dono antes de publicar. |
| `/grimorio atualizar \| classificar \| publicar` | sonnet (`classificar`: opus) | high | Relê o EDHREC e o Scryfall, recalcula status e novidades e remonta o Grimório; com `classificar`, dá nota às cartas sem cadastro em lotes de 50 com o "pode" do dono (`/model opus` antes); com `publicar`, só com o "pode publicar". |
| `/importar-backup <pasta do deck>` | sonnet | medium | Traz para o projeto o que foi editado dentro de um painel. |
| `/consulta <link do Scryfall ou nome>` | opus | high | Analisa uma carta de fora contra todos os decks nas cores dela: força sozinha, sinergia pela régua de cada deck, encaixe, veredito, compra e o estudo escrito; monta a página da Consulta. |
| `/consulta importar` | opus | high | Traz do banco da página publicada as consultas feitas ao vivo, confere notas e sinergias pela RUBRICA e pelas réguas, e confirma com o "pode" do dono. |
| `/ciclos atualizar <coleção> | classificar | ler` | opus | high | A aba Ciclos: pesquisa os ciclos de uma coleção nova e os acrescenta à lista do dono com o "pode"; confere no Scryfall; dá as notas das cartas sem cadastro em lotes; remonta a página. |

## A regra por trás da tabela

- **Julgamento pede o modelo forte.** Avaliar carta, confrontar análises, decidir arquitetura, propor tema: `opus`, esforço `high`. É onde um erro custa a sua revisão.
- **Arquitetura que 25 decks herdam pede um degrau a mais.** Só o `/motor` usa `xhigh`. Se você tiver o Fable, é a única etapa em que ele se paga: rode `/model fable` antes.
- **Trabalho com teste objetivo pede o modelo do dia a dia.** Script de download, migração para um contrato já definido, publicação: `sonnet`, esforço `medium` ou `high`. Ou funciona, ou o teste mostra.
- **Rotina pede o mínimo.** Abrir e fechar sessão, renomear pasta, trocar capa: `sonnet` em `low` ou `haiku`.
- **`max` não é padrão de nada.** A documentação do Claude Code diz que ele pode render em tarefas exigentes, mas tem retorno decrescente e tende a pensar demais. Reserve para um problema que sobreviveu a duas tentativas em `xhigh`.

## Quando subir, e como

- Travou em um bug depois de duas tentativas: escreva `ultrathink` no pedido, ou `/effort xhigh` na sessão.
- Uma migração (`/migrar`) começou a exigir mudança no motor: pare e rode `/motor` para essa parte.
- Quer planejar com o modelo forte e executar com o do dia a dia: `/model opusplan` usa Opus no modo de plano e Sonnet na execução.

## Quando descer

- Etapa repetida que já deu certo três vezes (por exemplo, `/novo-deck` em decks parecidos): experimente `sonnet` em `high` em um deck e compare as cartas S e BAX com o que o `opus` daria. Se a sua revisão não mudar, desça.

Para trocar na mão: `/model <nome>` e `/effort <nível>`. Se uma etapa se estender por várias mensagens, confirme no cabeçalho da sessão que o modelo e o esforço continuam os indicados.
