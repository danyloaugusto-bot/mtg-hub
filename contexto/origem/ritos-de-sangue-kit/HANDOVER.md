# Handover: Ritos de Sangue (painel do deck de Clavileño)

Versão 2.1, de 07/10/2026. Este arquivo acompanha o kit de fontes e basta para outra sessão (Claude Code ou uma conversa nova) continuar o trabalho sem o histórico.

## 1. O que é

Painel de um deck de Commander de Magic: Clavileño, First of the Blessed. Tema definido pelo dono: tribal de Vampiros, com subtema aristocrata (sacrifício) e recursão do cemitério. O painel é um HTML único, sem dependências, que serve de sistema vivo de manutenção: o que nunca sai, o que tem alta sinergia, o que está na berlinda e o que vale acompanhar fora do deck.

O dono é diretor de FP&A. Quer respostas diretas, críticas, sem validação automática, e que uma carta sugerida por ele seja recusada quando for o caso. A pergunta que guia toda avaliação: a carta é boa, ou é boa no Clavileño?

## 2. O que está no kit

| Caminho | Conteúdo |
|---|---|
| `dist/ritos-de-sangue.html` | O painel pronto (476 KB). É o que o dono abre. |
| `build.py` | Monta o HTML a partir de tudo abaixo. `python3 build.py`. Requer Pillow. |
| `decklist.txt` | As 100 cartas (95 únicas), com edição, número e foil, no formato do dono. |
| `annot.py` | Avaliação de cada carta: notas nos 8 agrupamentos, tier, relevância, textos, marcadores. Também o radar (`R`) e os combos. |
| `edh.py` | Sinergia e id de imagem transcritos do edh.wiki em 06/10/2026. |
| `forge/` | Texto oficial de cada carta (cache da base aberta do Forge). `fetch.py` baixa cartas novas; `parse.py` lê. |
| `app.js`, `style.css`, `template.html` | O código do painel, já consolidado. |
| `fonts/`, `assets/` | Fontes (Grenze Gotisch e Alegreya Sans, licença OFL) e a arte do comandante enviada pelo dono. |
| `tests/` | `regressao.py` (arquivo local) e `publicada.py` (simula a página publicada). Requerem Playwright. |

O build é determinístico: rodar `build.py` reproduz o `dist` byte a byte.

## 3. Como o painel funciona

Seis abas: Visão geral, Galeria, Tier list, Tabelão, Painel de controle e Radar. Tocar em qualquer carta abre uma gaveta com imagem, motivo, e edição de tier, relevância, notas, PetCard, valor em R$ e anotações de mesa.

**Modelo de avaliação**, herdado da planilha do dono (deck do Vito):

- Oito agrupamentos, nesta ordem no vetor `s`: Ramp, Draw, Removal, Recursão, Sacrifice, Tokens, Sinergia + PetCard, Especial (combos, condição de vitória, motores recorrentes).
- Nota de 0 a 3 por agrupamento. 1 é efeito de passagem, 2 é função da carta, 3 é referência do deck. Terreno que sempre entra virado leva −1 em Ramp.
- Pontos da carta: soma das notas, mais 1 se for PetCard.
- Placar do deck: pontos do CMC médio (5 se abaixo de 2, 4 abaixo de 3, 3 abaixo de 4, 2 abaixo de 5, senão 1), mais pontos de aceleração (soma de Ramp dividida pelo CMC médio; cada 0,5 vale 5 pontos, teto 90), mais a soma de todas as notas.
- Tier S, A, B, C, D mede força no deck. Relevância INS, ALT, MÉD, BAX mede permanência. São eixos diferentes.
- Fila de corte: relevância mais baixa, depois `pri` (prioridade sugerida em `annot.py`), tier e pontos. Comandante e PetCards nunca entram.

**Estado do usuário** (`S`, em JSON): `ov` (ajustes por carta: `tier`, `rel`, `s`, `pet`, `val`, `verdict`, `nota`, `tem`), `custom` (cartas que ele cadastrou no radar), `inn` e `out` (quem entrou e saiu), `swaps` (histórico com data `d` e motivo `m`), `img`, `ts`.

**Três ambientes, um arquivo só.** O código detecta onde está rodando:

| Ambiente | Onde salva | Imagens das cartas |
|---|---|---|
| Arquivo aberto no navegador (`file:`) | `localStorage` | Scryfall, na impressão exata |
| Página publicada (`window.claude.use` existe) | Conta do usuário, via capacidade `db` em `data/users/<id>/painel`, com `localStorage` de apoio | Desligadas: a página bloqueia conteúdo externo |
| Prévia dentro do chat | Só em memória | Tentadas e bloqueadas; caem para fichas de texto |

**Imagens.** `imgList` tenta, nesta ordem: URL exata obtida do Scryfall (`POST /cards/collection`, em lotes de 75, com cache de 7 dias), URL genérica pelo id em `edh.py`, e o redirecionamento da API. Cada falha passa para a próxima; no fim, sobra uma ficha tipográfica com nome, custo, tipo e resumo. A arte do comandante é embutida em base64.

**Página publicada.** Capacidades declaradas: `{db: {}, user: {}}`, contrato 0.2.72, favicon de vampiro. Gravação com espera de 700 ms e uma por vez. Republicar é pela ferramenta Artifact com a `url` do artefato existente.

## 4. Retrato do deck em 07/10/2026

- Placar 485. CMC médio 2,99. 30 das 34 criaturas são Vampiros.
- 31 terrenos mais 3 cartas duplas com terreno no verso: 34 fontes. A referência usual é 35 a 37.
- 8 cartas de ramp dedicadas (referência 10 a 12). É a lacuna estrutural.
- 12 fontes de compra. 12 remoções, 6 delas em massa, o que é demais para quem quer manter a própria mesa.
- Só Blood Artist e The Meathook Massacre convertem morte em dano. É a lacuna de fechamento.
- Combo do deck: Vito com Exquisite Blood, ou Vito com Bloodthirsty Conqueror.
- Relevância: 19 INS, 42 ALT, 31 MÉD, 8 BAX.

**Trocas sugeridas** (levam o placar a 510, os conversores de morte em dano a 4 e as remoções em massa a 5; o ramp continua em 8):

| Entra | Sai |
|---|---|
| Emeritus of Woe | March of the Canonized |
| Saw in Half | Lithoform Engine |
| Scheming Silvertongue | Treacherous Greed |
| Vein Ripper | New Blood |
| Cruel Celebrant | Master of Dark Rites |
| Swords to Plowshares | Split Up |
| Pitiless Plunderer | Henrika Domnathi |

Terreno na berlinda: Witch's Cottage, que quase sempre entra virado. Um Pântano básico rende mais; Vault of the Archangel está no radar como alternativa.

**Em avaliação no radar:** Patriarch's Bidding, Sanctum Seeker, Village Rites, Grave Pact, Indulgent Aristocrat, Champion of Dusk, Haunting Voyage, Drana Liberator of Malakir, Vraan Executioner Thane, Bloodline Necromancer, Vault of the Archangel.

**Avaliadas e recusadas:** Tip the Scales (seria a sétima remoção em massa), Captivating Vampire (pede cinco Vampiros parados), Butcher of Malakir (7 manas), Blade of the Bloodchief (engorda uma criatura só).

**Recusado de handovers anteriores, com motivo:** cortar Black Market Connections (mana e carta todo turno num deck com pouco ramp); cortar Glasswing Grace ou Desolate Mire (são terrenos); cortar High-Society Hunter, Archenemy's Charm ou Generous Gift (há cartas piores na fila); a ideia de que o deck tem drenos de sobra.

## 5. Fontes e o que cada uma vale

- **Forge:** texto oficial, custo e tipo. Confiável.
- **edh.wiki:** o número de sinergia mede presença nos decks do comandante, não força. 20 das 24 cartas do deck com 50% ou mais são da edição LCC, a do pré-construído. Usar como sinal, nunca como veredito.
- **Scryfall:** imagens e preço em dólar. O carregamento real nunca foi testado no ambiente em que o painel foi feito, que não alcança o Scryfall; foi testado com simulação. Conferir ao vivo.
- **LigaMagic:** só link por carta. Sem acesso aberto a imagens nem preços. O valor em R$ é campo manual.

## 6. Decisões do dono que valem como regra

- O bloco de regras e alvos de Saw in Half foi retirado do painel em 07/10/2026, a pedido: era dúvida pontual, já resolvida. A carta segue no radar como recomendação de entrada. Não recriar o bloco.
- PetCard começa vazio; só ele marca.
- Nomes das cartas em inglês, interface em português do Brasil.
- Tema visual: vinho, ouro e vitral; retrato do comandante em arco gótico; rosácea dos oito agrupamentos; curva de mana em janelas ogivais. Sem bibliotecas externas.

## 7. Próximos passos, já desenhados

**A. Imagens na versão publicada.** A página publicada não carrega nada de fora, e não há ajuste que mude isso. A saída é embutir. Roteiro para o Claude Code, que tem rede: (1) pedir ao Scryfall os dados das 117 cartas por `POST https://api.scryfall.com/cards/collection`, em lotes de 75, com `{set, collector_number}` para o deck e `{name}` para o radar; (2) baixar a imagem `normal` de cada uma de `cards.scryfall.io`, com intervalo de 100 ms; (3) reduzir para cerca de 340 px de largura em JPEG ou WebP (perto de 35 KB cada); (4) gravar em `img/<id>.jpg` e fazer o `build.py` embutir como `data:` num mapa `id -> imagem`, que `imgList` consulta antes das fontes externas. Orçamento: perto de 4 MB por deck; o teto da página publicada é 16 MiB.

**B. Seção "Novas cartas".** Botão ao lado de Backup que busca o que saiu de novo e faz uma triagem.

- Lista: `GET https://api.scryfall.com/cards/search?q=id<=wb f:commander is:firstprint date>=AAAA-MM-DD&order=released`, guardando a data da última consulta em `S`.
- Triagem automática, por regras sobre o texto: é Vampiro, gera ficha, sacrifica ou recompensa morte, devolve do cemitério, compra, remove, acelera. Sai uma nota provisória nos 8 agrupamentos e um tier provisório, com a carta e o preço em dólar ao lado.
- Decisão: "mandar para o radar" (vira carta em avaliação, com as notas preenchidas) ou "ignorar" (não reaparece).
- Limite honesto: regra de texto separa o que merece atenção do que não merece; não decide tier nem compra. O veredito final é julgamento, feito em conversa, ou pela capacidade `sample` na página publicada, sempre com o texto da carta colado, porque o modelo não conhece carta recém-lançada.
- Na página publicada a busca no Scryfall é bloqueada. Lá, a seção recebe as cartas por colagem (texto ou JSON exportado pelo arquivo local).

**C. Vários decks.** O dono tem um segundo painel (Giada, Font of Hope), com outros agrupamentos: Ramp, Draw, Removal, Proteção, Buff, Token, Sinergia, Especial. Para escalar: um motor só (`app.js`, `style.css`, `template.html`) e uma pasta por deck com `decklist.txt`, `annot.py`, arte e um `tema.json` (nome do painel, paleta, fontes, os oito agrupamentos com cor e descrição, combos). Hoje os agrupamentos, as cores e os textos de diagnóstico estão fixos no `app.js` (constante `G` e função `readings`); esse é o trabalho de generalização. O que não se automatiza é a avaliação carta a carta: cada deck pede a sua.

**D. Pendências menores.** Preços em R$ e PetCards seguem em branco. As 7 trocas sugeridas ainda não foram aplicadas pelo dono.

## 8. Armadilhas já pisadas

- Imagem com `loading="lazy"` dentro de bloco oculto nunca carrega. A prévia no mouse usa `eager`.
- Redesenhar a tela no `change` de um campo de texto engole o clique que tirou o foco. Campos de texto gravam sem redesenhar.
- `localStorage` só no arquivo local e na página publicada. Na prévia do chat, nunca.
- Na página publicada, `window.claude` só promete `use()`. As capacidades chegam depois, pela promessa, e podem ser `null`.
- Carta do radar que entrou no deck pode sair em outra troca: o código trata `inn` e `out` separadamente.
- Não cortar carta dupla com terreno no verso como se fosse mágica: conta como fonte de mana.
