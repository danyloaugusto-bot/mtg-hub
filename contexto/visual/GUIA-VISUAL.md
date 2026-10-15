# Guia visual dos painéis

Versão 1, 15/10/2026. Vale para o gráfico do herói de cada painel (a "rosa"), para a fonte de título e para o que é dado (tier, números, rótulos). É a régua do **rebranding**, que roda depois da Fase 4 da pontuação v3 (`contexto/pontuacao/PROMPT-CODE.md`), quando todo painel passa a ter os mesmos 10 critérios.

Por que depois do v3: hoje cada deck tem de 8 a 10 agrupamentos com nomes próprios. No v3 serão 10 critérios fixos (Sinergia primária, Sinergia secundária, Resiliência, Recurso, Draw, Amplificador, Remoção, Evasão, Dano direto, Aceleradores). Redesenhar 29 gráficos agora e de novo daqui a duas semanas é pagar duas vezes.

## O que o dono já disse (fonte das regras)

- "Os 4 decks da lista de 05. Desejos ficaram excelentes. Todos criativos e sinérgicos! Era isso que eu esperava pros demais."
- "Não letras pequenas, confuso e fofos quando não estão ligados ao tema do deck."
- Tergrid com runas: "não tá muito fofinho não?". Vários "parecem pétalas".
- Zumbis: "HORROR! MEDO! SOMBRIO!", e o gráfico "podia ser TUMBAS". As tumbas ficaram legais.
- Giada: "asas maiores e realistas", e "não quero que vá pra outra linha! tem que caber ao lado das informações do deck".
- Storm: gostou do estilo e da escolha, mas "ainda muito cartoon ou infantil". O protótipo em `prototipos/` é a régua de acabamento.

## Os oito princípios

1. **Objeto do tema, nunca forma genérica.** O gráfico é uma coisa do mundo do deck: asa, tumba, lanterna, cálice, barra de vida. Teste: escondendo os números e o título, dá para adivinhar o deck? Pétala, roseta, fatia de pizza genérica, bolinha colorida e cata-vento não passam.
2. **Luz de verdade, não desenho animado.** Kit de luz, nesta ordem: núcleo claro (quase branco), corpo na cor do critério, brilho difuso da mesma cor (desfoque gaussiano), profundidade (gradiente radial ou sombra interna) e textura sutil (ruído com no máximo 40% de opacidade). Sem contorno grosso igual em tudo e sem pastel chapado.
3. **Legibilidade primeiro.** Rótulos do gráfico com 14,5px e valores com 16,5px na tela, em qualquer largura (a variável `--k` já faz isso). Nunca abaixo de 13px. Rótulo nunca sai da área visível: no celular, nome longo quebra em duas linhas ou usa o rótulo curto. Fantasma (a forma do máximo possível) com no máximo 25% de opacidade. Contraste de rótulo de pelo menos 4,5:1.
4. **Dado honesto.** A peça cresce com o que o critério soma ao placar. Comprimento é linear; área usa raiz quadrada. A maior peça toca o limite e as demais são proporcionais a ela. Toda peça aparece, mesmo com valor baixo (mínimo de 12% do comprimento), para o critério fraco ficar visível.
5. **Dez peças, sempre.** No v3 o gráfico precisa caber 10 critérios com 10 rótulos sem colisão. As duas sinergias usam o nome do deck ("Anjos", "Vampiros c/ sinergia"); os outros oito usam o nome fixo.
6. **Encaixe.** No desktop, coluna de até 580px ao lado do texto do herói, nunca em outra linha. No celular, largura total. O `viewBox` reserva margem para os rótulos de fora.
7. **Tom por deck.** Cartoon só onde o deck é cômico: Deadpool, Turtle Power!, Heads I win e Goblins. Os outros são realistas, sombrios ou elegantes, conforme o tema.
8. **Fonte de exibição só em título.** A fonte do deck vai em título, subtítulo e cabeçalhos de seção. Letra de tier, números pequenos, selos e rótulos do gráfico usam a fonte do texto, peso 800, algarismos tabulares. Uma fonte gótica faz o S do tier parecer 5 (Kaalia) e o A virar 𝔄 (Dragões). O número grande do placar pode usar a fonte do deck quando ela for legível nesse tamanho.

Acabamento: entrada animada de no máximo 900ms, desligada com `prefers-reduced-motion`. Tocar numa peça abre o tabelão filtrado por aquele critério, como hoje.

## Referências

**Aprovadas** (o padrão a seguir):

| Deck | Gráfico | Por que funciona |
|---|---|---|
| 05. Braids | tranças | objeto do tema, cor só onde há dado |
| 05. Deadpool | balões | cômico onde o deck é cômico |
| 05. Slivers | ovos | colmeia e eclosão, a casca racha com a soma |
| 05. Storm | raios | ideia certa; acabamento do protótipo |
| 02. Zumbis | tumbas | horror de verdade, lápide que sobe da terra |
| 01. Giada | asas | asas grandes, na coluna ao lado do texto |
| Votação de 15/10 | os 12 vencedores | escolhas do dono, a partir de protótipos com os números reais |
| `prototipos/tempestade.js` | protótipo do Storm | a régua de luz: núcleo branco, corpo colorido, brilho, ramificação, olho da tempestade |

**Rejeitadas** (não repetir):

- Pétalas e rosetas: várias versões antigas, e hoje Humanos, Strefan e Turtle Power!.
- Runas "fofinhas" da Tergrid (trocadas por lanternas).
- Letras pequenas no gráfico (resolvido com `--k`, não voltar).
- Gráfico em largura total, que empurra o texto para outra linha.
- Asas em leque ou em flor, que pareciam enfeite e não asa.

## Inventário de hoje e veredito

Gráficos e fontes como estão montados em 15/10/2026, depois da votação dos gráficos. É uma proposta: o dono decide.

| Deck | Gráfico | Fonte de título | Veredito | Direção |
|---|---|---|---|---|
| 01. Giada | penas e asas | Cormorant Unicase | manter (votado) | só o kit de luz |
| 01. Vito | cálices (liturgia) | Pirata One | manter (votado) | números na fonte do texto |
| 02. Clavileño | elos de corrente | Grenze Gotisch | manter (votado) | números na fonte do texto |
| 02. Dragões | meteoros | Almendra Display | manter | tier na fonte do texto; meteoro mais incandescente |
| 02. Elfos | galhos e folhas | Fondamento | ajustar | o galho lembra dente-de-leão; casca, nervura e folha de verdade |
| 02. Evelyn | leque art déco | Limelight | ajustar | dourado e preto, cor só na ponta da lâmina |
| 02. Goblins | canhões | Rye | manter | tom cômico permitido |
| 02. Humanos | estandartes | Marcellus SC | **refazer** | hoje é cata-vento de pétalas; estandartes pendurados numa nave de catedral, o comprimento é a soma |
| 02. Kaalia | lâminas (juramento) | New Rocker | manter (votado) | S do tier parece 5: tier na fonte do texto |
| 02. Lobos | luas | Almendra SC | ajustar | luas parecem bolinhas coloridas; lua prateada com crateras, a fase enche com a soma |
| 02. Strefan | frascos | Playfair Display SC | **refazer** | frascos em roseta viram pétalas; taças de cristal num brinde, o sangue sobe com a soma |
| 02. Turtle Power! | cascos | Bangers | **refazer** | cascos em roseta viram pétalas; pizza de 10 fatias, o recheio cresce com a soma (cômico permitido) |
| 02. Zumbis | tumbas | Metal Mania | manter | aprovado |
| 03. Heads I win | pilhas de moedas | Creepster | manter (votado) | tom cômico permitido |
| 03. K'rrik | engrenagens | Tourney | manter | número do placar em contorno: fonte do texto |
| 03. Lynde | almofada de alfinetes | IM Fell English SC | manter (votado) | só o kit de luz |
| 03. Master Of Evil | rebites | Oxanium | **refazer** | hoje é pizza genérica; a saia do Dalek, com fileiras de hemisférios que acendem por critério |
| 03. Tergrid | lanternas | Metamorphous | manter (votado) | mais escuro e mais chama |
| 03. Valgavoth | casa | Cinzel | manter (votado) | só o kit de luz; de longe lê como sol vermelho, então vale reforçar portas e escada |
| 04. Assassin Creed | torres | Italiana | ajustar | torres pequenas e coloridas demais; torres de vigia em silhueta, salto de fé na mais alta |
| 04. Fynn | gotas | Uncial Antiqua | ajustar (votado) | o conceito fica, porque foi escolhido na votação. Ressalva: as gotas em pastel puxam para o fofo. Paleta de veneno (verde e preto, cor do critério só no brilho) e presas no topo |
| 04. Ken | barras de vida (luta) | Teko | manter (votado) | melhor conceito da carteira |
| 04. Queen | cetros | Cinzel Decorative | manter (votado) | só o kit de luz |
| 04. Zara | lunetas | Trade Winds | manter | só o kit de luz |
| 04. Zur | círculos | MedievalSharp | manter (votado) | só o kit de luz, com as runas acendendo |
| 05. Braids | tranças | Forum | manter | aprovado |
| 05. Deadpool | balões | Luckiest Guy | manter | aprovado |
| 05. Slivers | ovos | Grenze | manter | aprovado |
| 05. Storm | raios | Bebas Neue | ajustar | aplicar o protótipo (`prototipos/tempestade.js`) |

Resumo: 4 para refazer, 6 para ajustar, 19 para manter com o kit de luz. "Votado" quer dizer escolhido pelo dono na votação de 15/10/2026 (`contexto/ESTADO.md`): o conceito não se discute de novo, só o acabamento. As fontes de título passam; o problema é a fonte de título usada em dado (princípio 8).

## Kit técnico para o Code

O protótipo `prototipos/tempestade.js` mostra as peças. O rebranding deve virar uma pequena biblioteca no `motor/painel/app.js`, reaproveitada por todos os gráficos:

- **Filtros comuns** num `<defs>` por gráfico, com id prefixado pelo nome do gráfico: brilho largo (`feGaussianBlur` 5), brilho curto (2), textura (`feTurbulence` fractalNoise, opacidade de 0,3 a 0,4) e gradiente radial de profundidade.
- **Geometria:** `pt(ângulo, raio, deslocamento)`, `corpo(pontos, largura)` (polígono que afina até a ponta) e um gerador com **semente fixa por deck**. Nunca `Math.random`: o mesmo build tem que dar o mesmo desenho.
- **Luz:** camadas na ordem brilho, corpo, núcleo e reflexo, com `mix-blend-mode: screen` no grupo das peças acesas.
- **Rótulos:** uma função só, `rotulo(ângulo, raio, nome, valor)`. Âncora por quadrante (`start`, `end` ou `middle`), quebra automática acima de 14 caracteres, rótulo curto opcional em `tema.json` (`rotulos_curtos`), classe `.v` no valor. Os tamanhos vêm do CSS com `--k`.
- **Centro:** `ctr-n` (placar) e `ctr-l` ("pontos"), iguais em todos os gráficos.
- **Teste:** `testes/layout.py` passa a medir, em 375px e 1360px, se algum rótulo sai da tela, se algum texto do gráfico fica abaixo de 13px e se o gráfico cai em outra linha no desktop.

## Processo do rebranding

1. Esperar a Fase 4 do v3 (gráficos já com os 10 critérios).
2. Lotes de até 6 decks: (a) os 4 de refazer; (b) os 6 de ajustar; (c) os 19 de manter, só com o kit de luz, em lotes maiores.
3. Em cada lote: imagem antes e depois de cada deck (desktop e celular), aprovação do dono, implementação, `testes/layout.py` e `testes/todos.py`, e só então o lote seguinte.
4. Uma sessão por vez no motor. O rebranding não começa com outra sessão mexendo em `motor/`.

## Checklist de aceite (por gráfico)

- [ ] Dá para adivinhar o deck sem ler nada?
- [ ] Nenhuma pétala, roseta, bolinha ou cata-vento?
- [ ] O kit de luz completo: núcleo, corpo, brilho, profundidade e textura?
- [ ] Dez peças e dez rótulos, sem colisão, em 1360px e em 375px?
- [ ] Rótulos com pelo menos 13px e nenhum fora da tela?
- [ ] A maior peça toca o limite e as outras são proporcionais?
- [ ] Cabe na coluna de 580px ao lado do texto?
- [ ] Tier e números na fonte do texto?
- [ ] O mesmo desenho a cada build (semente fixa)?
- [ ] Animação curta, desligada com movimento reduzido?
