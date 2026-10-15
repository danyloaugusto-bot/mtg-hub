# Prompt para o Claude Code: correções de layout (15/10/2026)

Cole o bloco abaixo no Claude Code, na pasta do projeto, **quando nenhuma outra sessão estiver mexendo em `motor/`**. Se a pontuação v3 já estiver em andamento, rode isto entre duas fases (depois de terminar uma e antes de começar a seguinte), nunca no meio de uma.

---

Leia `contexto/visual/AUDITORIA-LAYOUT.md` e `contexto/visual/GUIA-VISUAL.md` (princípio 8). Corrija os itens P1 e P2 da auditoria, nesta ordem, e pare para eu ver depois do passo 3.

1. **Abas no desktop** (`motor/painel/style.css`, cabeçalho `.top`):
   - `.brand` encolhe primeiro (`min-width:0; overflow:hidden; text-overflow:ellipsis`), e o nome do deck aparece inteiro no `title`;
   - `nav.tabs` nunca corta (`flex:0 0 auto`);
   - "100 cartas" some da barra abaixo de 1500px;
   - critério: em 1280, 1360, 1440 e 1600px, nenhuma aba cortada nem coberta em nenhum dos 29 painéis.
2. **Abas no celular** (até 640px):
   - as abas vão para uma segunda linha de largura total, abaixo da seta e dos botões;
   - rolagem lateral, esmaecimento de 24px nas bordas, aba ativa centralizada ao abrir;
   - `--top` atualizado para a altura nova, para o conteúdo e os cabeçalhos fixos não ficarem por baixo.
3. **Sem preço no painel** (`motor/painel/app.js`):
   - remover a coluna "US$", a ordenação `usd` e o total em dólar do Tabelão;
   - o quadro "Relevância e valor" vira "Relevância" (Qtd e % do deck, sem US$ e sem R$) e perde a nota sobre o Scryfall;
   - remover "US$ x no Scryfall" da ficha da carta;
   - `scryfall.py` pode continuar guardando o preço, mas nada o mostra;
   - em `contexto/ARQUITETURA.md`, decisão "Sem preço": trocar "o painel de cada deck mostra" por "nem o painel nem o hub mostram";
   - listar (não editar) os textos de `avaliacao.json` que citam US$, para eu reescrever no próximo `/auditar`.

   **Pare aqui** e me mostre: Evelyn, Fynn e Queen em 1360px, e Giada e Kaalia em 375px.
4. **Tier e números na fonte do texto:**
   - `.tb`, `.tier-l b`, `.facts dd` e os selos usam `var(--fb)`, peso 800, `font-variant-numeric: tabular-nums`;
   - `.ctr-n` e `.score-big b` mantêm `var(--fd)`, exceto nos decks com fonte de título gótica ou só de contorno, que entram numa lista em `tema.json` com `"numeros_no_texto": true` (Vito, Clavileño, Kaalia, Dragões, K'rrik).
5. **Rótulos do gráfico no celular:**
   - nome acima de 14 caracteres quebra em duas linhas (`tspan`) quando o rótulo sairia da tela;
   - critério: em 375px, nenhum rótulo de `figure.rosa` fora de 0 a 375px nos 29 painéis.
6. **Curva de mana no celular:** o mesmo `--k` do `escalaRosa()` aplicado a `.curve svg`; texto com pelo menos 13px na tela.
7. **Símbolos de mana:** `.ms` com no mínimo 12px na tela (Galeria, Tier list e Radar).
8. **Tabelas no celular:**
   - no painel, a primeira coluna do Tabelão fica fixa (`position:sticky; left:0`) e a caixa ganha uma sombra de rolagem;
   - no hub (`motor/hub/style.css`), Trocas empilha em cartões por deck até 560px, com o Placar visível;
   - Fundamentos e Mesa ficam com a primeira coluna fixa.
9. P3 que custam uma linha:
   - esconder o fato "foils" do herói quando for 0;
   - linha de tipo e ✦ com 12px na Galeria;
   - selo INS e BAX com contraste de 4,5:1 nos 29 temas (ajustar a cor do texto do selo, não a do fundo).

Testes:

- `testes/layout.py` ganha as medições dos passos 1, 2, 5 e 7: aba cortada ou coberta em 1280 e 1360px, aba coberta no celular, rótulo do gráfico fora da tela em 375px e `.ms` abaixo de 12px;
- rode `testes/todos.py`, `testes/layout.py` e `testes/hub.py`;
- remova do teste do hub o que dependia de preço, se houver;
- `testes/regressao.py` (botão `tier-view` "fichas") e `testes/contrato.py` dos Zumbis (cor `buff`) já falhavam antes: não são deste trabalho, só me avise se mudarem.

No fim: o `build --todos` e o `--hub`, atualize `contexto/ESTADO.md` com uma linha do que mudou, e faça o commit só destes arquivos.
