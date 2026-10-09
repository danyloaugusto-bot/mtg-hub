# Histórico: Coro da Alvorada (Giada)

## Revisão 4, 08/10/2026: as asas de volta

- O gráfico do topo volta a ser as asas do Coro da Alvorada: oito penas, quatro de cada lado, abrindo de uma auréola com o placar. O motor ganhou o desenho "asas".
- A fila de corte ganhou ordem escrita, como nos outros painéis: Invasion of Gobakhan, Everybody Lives!, Split Up, Horn of the Mark, Angelic Skirmisher, Orim's Chant, Chivalric Alliance, The Immortal Sun, Herald of Eternal Dawn e Steel Seraph; os terrenos Command Beacon e Terrain Generator à parte.
- Nenhuma nota, tier, relevância ou texto mudou. Placar 429.

## Revisão 3, 07/10/2026: o painel passa a sair do motor

- O deck não mudou: 100 cartas, 85 entradas, placar 429. Nenhuma nota, tier, relevância, texto, veredito ou combo foi alterado.
- A avaliação saiu do `evals.py` da revisão 2 do kit (`kit-coro-da-alvorada2`) para `avaliacao.json` e `comunidade.json`, pelo `motor/importar/coro.py`. Comparados lado a lado no navegador, placar, pontos por agrupamento, tiers, relevância e os cinco fatos do topo batem com o painel de origem.
- Custo, tipo e faces passam a vir do Scryfall, no lugar do Forge.
- O painel ganha o que só o Ritos de Sangue tinha: aba Galeria, comparador de trocas lado a lado, anotações de mesa e a marca "tenho" por carta, veredito do radar editável na gaveta, e o estado salvo na conta na página publicada (o Coro antigo só gravava no navegador).
- Ganha também a aba Oficina, com os comandos do projeto já preenchidos.
- O que você salvou no navegador com o painel anterior (chave `coro-da-alvorada-v1`) continua valendo.
- **Gráfico dos agrupamentos:** as asas, que eram a identidade visual do Coro, ainda não existem no motor. O painel usa o desenho padrão (fatias) até a migração ser completada com uma mudança de motor, pelo `/motor`. É a maior perda desta migração.
- **Leituras do deck:** cinco delas ganharam uma frase a menos. O motor hoje expressa cada leitura como uma comparação simples (uma faixa de referência, ou um marcador contra um limite). O Coro cruzava dois números numa frase só: "mais vagas de proteção que ramp e que compra", "ramp que só vale para Anjos, com o topo da curva pesado", "a cor branca engasga, atrasando X e Y", "compra que só funciona atacando, pior depois de remoção em massa". Essas comparações não aparecem mais como texto; o dado por trás de cada uma (contagem por agrupamento, símbolos de mana por cor, fontes de terreno) continua visível nos painéis "Os oito agrupamentos" e "Base de mana", só que como número, não como frase pronta. Nenhuma nota, tier ou veredito mudou: é a leitura que ficou mais simples, não a avaliação.
- A gramática do painel passou a saber o gênero do comandante: "é boa na Giada", não "é boa no Giada". Campo novo em `tema.json`.

## Versão 2, 07/10/2026 (kit-coro-da-alvorada2)

457 KB. Radar com 18 candidatas (7 entram, 10 a avaliar, 1 fica de fora). Imagens do Scryfall em todas as abas, sinal da comunidade, 52 potenciais do edh.wiki. Detalhes no `HANDOVER-v2.md` do kit, em `entrada/`.

## Versão 1, 06/10/2026 (kit-coro-da-alvorada)

345 KB. Primeira versão do painel, com imagem só na gaveta e 12 candidatas no radar.
