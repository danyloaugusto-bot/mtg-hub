# MTG Hub: contexto permanente do projeto

## O que é

Painéis dos decks de Commander (Magic: The Gathering) do Danylo, um por deck, e um hub que lista todos. Cada painel é um HTML único, sem dependências, gerado por um motor comum a partir dos dados do deck. O primeiro painel, do Clavileño, chama-se Ritos de Sangue e é a origem do motor. Um segundo painel, Coro da Alvorada (Giada), saiu do mesmo código em outra conversa. O padrão de todo deck é a soma dos dois: ver `contexto/PARIDADE.md`.

## Regras que não se negociam

1. **Um motor só.** Todo código de painel mora em `motor/`. Nunca copie o motor para dentro de um deck nem crie variação por deck. O que muda entre decks é dado e tema.
2. **Dado de deck mora em `dados/<pasta>/`** e em nenhum outro lugar.
3. **`contexto/origem/` é somente leitura.** É de onde viemos. Consulte, não edite.
4. **O que está em `entrada/` é opinião.** Handovers de outras IAs, planilhas e prints são lidos, confrontados com o texto das cartas e registrados em `CONFRONTO.md`. Concordância entre IAs não prova nada.
5. **Texto de carta nunca sai de memória.** Custo, tipo e texto vêm do Scryfall ou do cache. Se não der para conferir, pare e diga.
6. **Avaliação é julgamento, com o motivo escrito.** Toda nota, tier e veredito tem uma frase de porquê.
7. **Diga não.** O dono quer crítica. Se uma carta sugerida por ele é ruim para o deck, ela não entra, e você explica. A pergunta de sempre: a carta é boa, ou é boa neste comandante?
8. **Mudança grande pede plano antes.** Refatorar o motor ou mudar formato de dado: mostre o plano e espere o "pode".
9. **Toda sessão termina com** testes passando, `contexto/ESTADO.md` atualizado e commit.

## Ambiente

- Windows. Use `python`, não `python3`.
- O projeto fica em `C:\Projetos\mtg-hub`, fora do OneDrive. As pastas de deck têm espaço e ponto no nome: sempre entre aspas.

## Nomes dos painéis

Cada painel tem nome próprio, em português, evocativo e ligado ao comandante: Ritos de Sangue (Clavileño), Coro da Alvorada (Giada). Deck novo recebe três opções de nome para o dono escolher. Nome já dado não muda.

## Como as pastas de deck se chamam

Na raiz da pasta de um deck ficam só `deck.md`, `decklist.txt`, `capa.*` e o que o motor gera. Todo o resto é material de fora e mora em `entrada/`. O dono não precisa organizar nada: ele solta o material na pasta do deck e os comandos movem para `entrada/` antes de começar.

`dados/XX. Nome/`, onde XX é o grupo do aplicativo do dono (01 Top, 02 Tribais, 03 Caos, 04 Forfun) e Nome é o nome simples que ele escolheu para o deck. O nome da pasta é a identidade do deck: o HTML em `saidas/` e os atalhos usam exatamente o mesmo nome. Mudar de grupo é renomear a pasta, com `/mover`. Os nomes têm espaço e ponto: sempre entre aspas no terminal.

## Mapa de pastas

| Pasta | O que tem |
|---|---|
| `contexto/` | Arquitetura, método de avaliação, paridade, modelos, `ESTADO.md` (o handover vivo), inventário, referências e a origem. Também o `handover-analise-de-decks.md`, que o dono entrega a outras IAs para que analisem um deck neste mesmo método. |
| `.claude/skills/` | Os comandos do projeto, um por pasta, cada um com seu `SKILL.md`. Cada um declara modelo e esforço. Resumo em `contexto/MODELOS.md`; modelo para criar um novo em `contexto/modelo-de-skill.md`. |
| `dados/<pasta>/` | Um deck: `deck.md`, `decklist.txt`, `capa.*`, `entrada/`, e o que o motor gera (avaliação, tema, `CONFRONTO.md`, `HISTORICO.md`, `Abrir o painel.html`). |
| `motor/` | O código do painel e os scripts de montagem. Contrato dos dados em `contexto/ARQUITETURA.md`. |
| `testes/` | Os testes, que recebem o deck por `--deck`, e os números de controle em `testes/controle/`. |
| `cache/` | Dados e imagens do Scryfall. Fora do Git. |
| `saidas/` | Um HTML por deck, com o nome da pasta, e `00. Hub.html`. |
| `Abrir o Hub.html` | Na raiz. O atalho de um clique, que funciona sem internet. |

## Comandos de montagem

Mantenha esta seção atualizada.

- Um deck: `python motor/build.py --deck "02. Clavileno"` (grava `saidas/<pasta>.html` e `dados/<pasta>/Abrir o painel.html`)
- Todos: `python motor/build.py --todos` (pula, com aviso, os decks sem `avaliacao.json`)
- Cartas do zero no Scryfall: acrescente `--atualizar-scryfall`
- Testes de um deck: `python testes/todos.py --deck "02. Clavileno"` (contrato, regressão, página publicada, layout e, no Clavileño, a comparação com o painel de origem). Cada um também roda sozinho, com `--deck`.
- Hub: ainda não existe; nasce na etapa 4, com `/hub`.
- Não rode o `build.py` do kit em `contexto/origem/`: ele grava dentro da pasta de origem.

## Idioma e tom

- Interface e textos em português do Brasil. Nomes de carta em inglês, como na lista do dono.
- Respostas diretas, sem bajulação. Aponte riscos e discorde quando houver motivo.
- Textos do painel: frases curtas, sem jargão, sem caixa alta gritada.

## Limites da plataforma que moldam o projeto

- **Página publicada:** um arquivo, até 16 MiB, sem carregar nada de fora. Por isso é um artefato por deck, com imagens reduzidas e embutidas.
- **Scryfall:** no máximo 10 chamadas por segundo à API (use 100 ms de intervalo), mande `User-Agent`, guarde em cache.
- **Artes:** são da Wizards of the Coast. Painel com imagem fica privado.
- **Três ambientes, um arquivo:** arquivo local, página publicada e prévia de chat. O handover do kit explica o que muda em cada um.

## Definição de pronto de um deck

`saidas/<pasta>.html` abre sem internet e mostra as imagens; os testes passam; o hub mostra o deck; o dono aprovou as cartas tier S, as da berlinda e as trocas; `HISTORICO.md` tem a entrada da versão.
