# Guia visual dos painéis

**Situação em 18/10/2026:** a Fase 4 da v3 terminou em 15/10 (todo gráfico já tem os 10 critérios) e o rebranding está liberado. O Strefan já foi refeito (Alquimia do Sangue, votação do Markov) e o Markov ganhou os Caixões. Nada do kit de luz foi aplicado ainda, e o protótipo do Storm não entrou. Execução pelo comando `/rebranding <lote>`, em quatro lotes (seção "Processo do rebranding").

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

- Pétalas e rosetas: várias versões antigas, e hoje Humanos e Turtle Power! (o Strefan saiu delas em 15/10).
- Runas "fofinhas" da Tergrid (trocadas por lanternas).
- Letras pequenas no gráfico (resolvido com `--k`, não voltar).
- Gráfico em largura total, que empurra o texto para outra linha.
- Asas em leque ou em flor, que pareciam enfeite e não asa.

## Inventário de hoje e veredito

Gráficos e fontes como estão montados em 15/10/2026, depois da votação dos gráficos. É uma proposta: o dono decide.

| Deck | Gráfico | Fonte de título | Veredito | Direção |
|---|---|---|---|---|
| 01. Giada | penas sobre veludo | Cormorant Unicase | feito em 20/10/2026 | variação R escolhida pelo dono |
| 01. Markov | caixões (vigília, 15/10) | Cinzel | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 01. Vito | cálices de cristal e ouro | Pirata One | feito em 20/10/2026 | variação R escolhida pelo dono |
| 02. Clavileño | elos de corrente | Grenze Gotisch | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 02. Dragões | meteoros de basalto | Almendra Display | feito em 20/10/2026 | variação R escolhida pelo dono |
| 02. Elfos | copa (contraluz) | Fondamento | feito em 20/10/2026 | variação C escolhida pelo dono |
| 02. Evelyn | laca (leque laqueado) | Limelight | feito em 20/10/2026 | variação A escolhida pelo dono |
| 02. Goblins | canhões | Rye | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 02. Humanos | abside (estandartes sob a abóbada, com vitral) | Marcellus SC | feito em 19/10/2026 | variação B do lote 1 |
| 02. Kaalia | lâminas (juramento) | New Rocker | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 02. Lobos | lunar (floresta) | Almendra SC | feito em 20/10/2026 | variação B escolhida pelo dono |
| 02. Strefan | alquimia (refeito em 15/10) | Playfair Display SC | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 02. Turtle Power! | pizza (caixa no esgoto, fatias mordidas) | Bangers | feito em 19/10/2026 | variação C do lote 1 |
| 02. Zumbis | tumbas, cemitério noturno | Metal Mania | feito em 20/10/2026 | variação R escolhida pelo dono |
| 03. Heads I win | pilhas na mesa de carteado | Creepster | feito em 20/10/2026 | variação R escolhida pelo dono |
| 03. K'rrik | engrenagens de aço e sangue | Tourney | feito em 20/10/2026 | variação R escolhida pelo dono |
| 03. Lynde | almofada de alfinetes | IM Fell English SC | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 03. Master Of Evil | dalek (saia em anel) | Oxanium | feito em 19/10/2026 | variação A do lote 1 |
| 03. Tergrid | lanternas | Metamorphous | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 03. Valgavoth | casa | Cinzel | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 04. Assassin Creed | vigia (olho de águia) | Italiana | feito em 20/10/2026 | variação A escolhida pelo dono |
| 04. Fynn | veneno (gota de vidro) | Uncial Antiqua | feito em 20/10/2026 | variação D, 2ª rodada escolhida pelo dono |
| 04. Ken | luta | Teko | feito em 20/10/2026 | variação acabamento aprovado escolhida pelo dono |
| 04. Queen | cetros | Cinzel Decorative | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 04. Zara | lunetas de latão e couro | Trade Winds | feito em 20/10/2026 | variação R escolhida pelo dono |
| 04. Zur | circulos | MedievalSharp | feito em 20/10/2026 | variação acabamento aprovado escolhida pelo dono |
| 05. Braids | tranças, planta de Tolária | Forum | feito em 20/10/2026 | variação C escolhida pelo dono |
| 05. Deadpool | balões | Luckiest Guy | mantido em 20/10/2026 | o dono preferiu o desenho de hoje |
| 05. Slivers | ovos de couro | Grenze | feito em 20/10/2026 | variação R escolhida pelo dono |
| 05. Storm | tempestade | Bebas Neue | feito em 19/10/2026 | variação A do lote 1 (o protótipo aplicado) |

Resumo em 18/10: 3 para refazer (Humanos, Turtle Power! e Master Of Evil), 6 para ajustar e 21 para manter com o kit de luz (os 19 de antes, mais Strefan e Markov). "Votado" quer dizer escolhido pelo dono na votação de 15/10/2026 (`contexto/ESTADO.md`): o conceito não se discute de novo, só o acabamento. As fontes de título passam; o problema é a fonte de título usada em dado (princípio 8).

**Lição de 20/10/2026 (lotes 3 e 4):** a primeira rodada aplicou o mesmo kit de luz (halo na cor do critério, núcleo branco, brilho difuso) em todos os gráficos, e o dono rejeitou: "não precisa ser colorido, só dar mais realismo ou opções mais criativas, não copiar um estilo pra todos". O kit é ferramenta opcional; a cor do critério é opcional; cada deck pede material de verdade ou uma execução criativa própria.

## Kit técnico para o Code

O protótipo `prototipos/tempestade.js` mostra as peças. O rebranding deve virar uma pequena biblioteca no `motor/painel/app.js`, reaproveitada por todos os gráficos:

- **Filtros comuns** num `<defs>` por gráfico, com id prefixado pelo nome do gráfico: brilho largo (`feGaussianBlur` 5), brilho curto (2), textura (`feTurbulence` fractalNoise, opacidade de 0,3 a 0,4) e gradiente radial de profundidade.
- **Geometria:** `pt(ângulo, raio, deslocamento)`, `corpo(pontos, largura)` (polígono que afina até a ponta) e um gerador com **semente fixa por deck**. Nunca `Math.random`: o mesmo build tem que dar o mesmo desenho.
- **Luz:** camadas na ordem brilho, corpo, núcleo e reflexo, com `mix-blend-mode: screen` no grupo das peças acesas.
- **Rótulos:** uma função só, `rotulo(ângulo, raio, nome, valor)`. Âncora por quadrante (`start`, `end` ou `middle`), quebra automática acima de 14 caracteres, rótulo curto opcional em `tema.json` (`rotulos_curtos`), classe `.v` no valor. Os tamanhos vêm do CSS com `--k`.
- **Centro:** `ctr-n` (placar) e `ctr-l` ("pontos"), iguais em todos os gráficos.
- **Teste:** `testes/layout.py` passa a medir, em 375px e 1360px, se algum rótulo sai da tela, se algum texto do gráfico fica abaixo de 13px e se o gráfico cai em outra linha no desktop.

## Processo do rebranding

O comando é `/rebranding <lote>` (`.claude/skills/rebranding/SKILL.md`). Quatro lotes, nesta ordem:

| Lote | Decks | O que muda |
|---|---|---|
| 1, refazer e régua (**feito em 19/10/2026**) | 05. Storm, 02. Humanos, 02. Turtle Power!, 03. Master Of Evil | desenho novo; o Storm aplica `prototipos/tempestade.js`. O kit de luz compartilhado nasce aqui (`KIT` no `app.js`) |
| 2, ajustar (**feito em 20/10/2026**) | 04. Fynn, 02. Lobos, 02. Elfos, 02. Evelyn, 04. Assassin Creed | mesmo conceito, execução nova |
| 3, kit de luz (votados) (**feito em 20/10/2026**) | 01. Giada, 01. Vito, 02. Clavileño, 02. Kaalia, 03. Heads I win, 03. Lynde, 03. Tergrid, 03. Valgavoth, 04. Ken, 04. Queen, 04. Zur | só o acabamento |
| 4, kit de luz (demais) (**feito em 20/10/2026**) | 01. Markov, 02. Dragões, 02. Goblins, 02. Zumbis, 02. Strefan, 03. K'rrik, 04. Zara, 05. Braids, 05. Deadpool, 05. Slivers | só o acabamento |

Cada lote para duas vezes: (1) protótipo, com 2 ou 3 variações por deck nos lotes 1 e 2 e uma folha de antes e depois nos lotes 3 e 4, para o dono escolher; (2) resultado implementado, em 1360px e 375px, antes de publicar. Uma sessão por vez no motor: o rebranding não começa com outra sessão mexendo em `motor/`.

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
