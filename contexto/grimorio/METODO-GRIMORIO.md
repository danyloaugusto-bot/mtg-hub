# O Grimório: cartas boas por lente, ao lado do Dashboard

Proposta de 19/10/2026, escrita no app para o dono aprovar antes de ir ao Code (regra 6 do handover: protótipo antes do código). Protótipo publicado: https://claude.ai/artifact/36T6qWReNc1Hxaz4LZ28Wy (e `contexto/grimorio/prototipo/`).

## O que é

Hoje cada painel olha para dentro do próprio deck (Radar, Oficina, 8×8). O Grimório é a primeira página que olha **entre** os decks: para cada lente da carteira, as melhores cartas que existem, com três respostas por carta:

1. **Onde já está**: em quais decks (com o tier de lá), em qual pasta, na Caixa.
2. **Onde rende**: em qual deck a carta renderia mais, pelo encaixe nos dez critérios (a mesma conta da Caixa, `encaixe.ranking`), com o ganho e quem sairia.
3. **Status**: Tenho, Ociosa (parada em pasta ou Caixa, ou num deck onde pesa pouco enquanto renderia S/A em outro, a regra das Sub-utilizadas) ou Falta.

Nome: **Grimório** (decisão do dono, 19/10). Posição: pílula ao lado do Dashboard, à direita (decisão do dono). É uma página própria, `saidas/00. Grimório.html`, como a Caixa, e não uma aba dentro do hub: a galeria de imagens não cabe no HTML do hub (4 MB hoje, teto de 16 MB no artefato).

Sem preço, como no hub e nos painéis: a ponte com compra é o status Falta, e a Caixa continua sendo o lugar do dinheiro.

## As seis sub-abas

| Sub-aba | Lente | De onde vem a lista | O que mostra |
|---|---|---|---|
| **Tribos e estilos** | uma por tema de deck (`tema_jogo` dos 30 decks), em três famílias: Tribais, Caos e mesa, Motores | EDHREC: página da tribo (`typal/<slug>`) ou do tema (`themes/<slug>`) | as cartas mais jogadas e as de maior sinergia na lente, conferidas no Scryfall |
| **Cores** | só as identidades que existem na carteira (incolor, 5 monos, 7 duplas, 4 trincas, cinco cores) | EDHREC: top cards por cor | staples da identidade (exata ou incolor); uma combinação sem deck aparece apagada |
| **Critérios** | os 10 da v3 (os dois de sinergia remetem às lentes de tema, porque são do deck) | o cadastro v3 (`dados/cartas.json`): cartas com nota 2 ou 3 no critério | ranking por nota e popularidade; a nota é a da carta, igual em todo deck |
| **8×8** | um deck por vez | os agrupamentos do `avaliacao.json` do deck (os mesmos quadros da aba 8×8 do painel) | um quadro por pacote: quantas cartas há contra a referência, e o que o Grimório tem para o pacote, nas cores do deck, com o status |
| **Pontas de lança** | cruzamento | cartas em duas lentes de tema ou mais, ou em uma lente de tema com nota 3 em algum critério | uma carta por cartão, com as lentes em que aparece; é onde o Grimório deixa de ser lista do EDHREC |
| **Novidades** | tempo | Scryfall: impressões lançadas depois da leitura anterior, dentro das listas das lentes | agrupadas por coleção; "nova" quando a impressão não é reimpressão (`reprint: false` no Scryfall), senão "reimpressão" |

Em todas: **ordenação** (Popularidade no EDHREC, Onde rende mais, Custo, Nome, Mais recentes; nos Critérios, Nota), **filtro de status** (Todas, Faltam, Ociosas, Tenho), **busca dentro da lente**, e **Lista ou Galeria** (a escolha fica guardada no navegador). Clique na carta abre a gaveta: imagem, texto do Scryfall, notas dos critérios com o porquê, onde está, onde rende, lentes, links para Scryfall e EDHREC.

## O campo de atualização

No topo, ao lado do título: última leitura, fontes, as coleções cobertas (com a de hoje em destaque e a próxima "a sair"), quantas cartas e lentes, quantas novidades, e o comando `/grimorio atualizar` com botão de copiar. A página é estática: a atualização roda no Claude Code, relê EDHREC e Scryfall e remonta a página. A cada 2 ou 3 meses (coleção nova), o dono roda o comando; a seção Novidades mostra o que mudou.

Por que não atualizar dentro da página: o artefato publicado não pode chamar o EDHREC nem o Scryfall (a política do artefato bloqueia `fetch` para outros domínios), e o arquivo offline não teria como gravar o resultado no projeto.

## O dado

`dados/grimorio/`:

- `lentes.json`: a lista de lentes (chave, nome, família, fonte no EDHREC, decks que a usam). É do dono: lente nova ou renomeada é editar este arquivo. A primeira versão está em `contexto/grimorio/lentes.json`, derivada do `tema_jogo` dos 30 decks e dos nomes dos painéis.
- `grimorio.json`: o resultado da leitura, gerado pelo motor. Por lente, as cartas com: nome oficial, identidade, custo, tipo, texto, coleção e data da impressão mais recente, `edhrec_rank`, inclusão na lente (`num_decks/potential_decks`), sinergia na lente quando a página dá, as notas 3 a 10 do cadastro, onde está (decks com tier, pastas, Caixa), onde rende (os três melhores decks com ganho e quem sai), status e as lentes em que aparece.
- `leitura.json`: data da leitura, coleções do Scryfall até a data (`/sets`), contagens, e as lentes que falharam na leitura (com o motivo).
- `link.txt`: o link publicado, como na Caixa.

Cache: `cache/edhrec/lentes/<slug>.json`, validade de 30 dias, uma chamada por segundo e `User-Agent`, como o `motor/edhrec.py` já faz para as páginas de carta. O cache do Scryfall é o de sempre (`cache/scryfall.json`, por `scryfall.buscar`). Imagens: `cache/img/`, pelo `motor/imagens.py`, com uma redução menor para a galeria (150 px de largura, qualidade 70, cerca de 9 KB), porque o Grimório embute mais cartas que um painel.

## As regras

1. **Carta nunca de memória.** Toda carta de toda lente passa pelo Scryfall antes de entrar: nome oficial, identidade de cor, legalidade no Commander (banida não entra), data. Carta que o Scryfall não acha fica fora, com aviso na leitura.
2. **Teto por lente.** As 40 mais incluídas e as 20 de maior sinergia (quando a página dá sinergia), sem repetir. Básicos, Sol Ring, Arcane Signet e Command Tower ficam fora das lentes de tema (aparecem só em Cores e Critérios).
3. **Nota só pela rubrica.** Carta que não está no cadastro v3 entra no Grimório com as notas vazias e sem "onde rende". A nota vem depois, pela rubrica (`contexto/pontuacao/RUBRICA.md`), em lotes que o dono libera: primeiro as cartas Falta e Ociosas entre as 20 mais incluídas de cada lente. Nunca estimar nota pelo EDHREC.
4. **Os dez critérios não mudam.** O Grimório lê o cadastro; não cria critério, peso nem nota nova fora da rubrica.
5. **Sem preço** na página, no hub e no link. Sem bracket, sem cartas de estimação.
6. **Caminhos do EDHREC conferidos no primeiro run.** O `json.edhrec.com` não é API oficial e os caminhos já mudaram (tribes virou typal). O leitor tenta o caminho do `lentes.json`; se der 404, tenta as variantes conhecidas e, se nada responder, marca a lente como "sem leitura" e segue. Nunca inventa lista.
7. **Orçamento da página.** Até 14 MB no HTML (teto do artefato é 16). O build mede e, se passar, reduz primeiro a galeria (qualidade), depois o teto por lente, e avisa.

## O que o dono decide (perguntas em aberto)

1. **Ordem e nomes das lentes** em `contexto/grimorio/lentes.json` (27 lentes de tema propostas; algumas tribos não têm página no EDHREC, como Tartarugas e Daleks, e ficam como "sem leitura" até alguém achar fonte melhor, ou saem).
2. **Volume da primeira classificação:** o lote inicial de notas (cartas Falta e Ociosas no top 20 de cada lente) deve dar entre 300 e 500 cartas. Pode ir em lotes de 50, com o "pode" por lote, ou aceitar a primeira versão sem "onde rende" para essas cartas e classificar aos poucos.
3. **Ação na carta (v2):** um botão "mandar para o radar do deck", que gravaria no banco do deck como "avaliar". Fica para depois da primeira leitura, porque pede `capabilities` e a regra 2 do handover (não passar `capabilities` ao republicar) foi escrita para o hub, a Caixa e os painéis; o Grimório poderia nascer com banco próprio, se o dono quiser.
4. **Fontes além do EDHREC:** edh.wiki já é lido nos `comunidade.json` dos decks; dá para somar as listas dele às lentes de tema dos comandantes que você tem. Opcional.

## Checklist de aceite (para o `/grimorio` da primeira leitura)

- [ ] Pílula Grimório à direita do Dashboard, no hub local e no publicado; abre a página.
- [ ] As seis sub-abas, com endereço (`#tribos`, `#cores`, `#criterios`, `#8x8`, `#pontas`, `#novidades`).
- [ ] Toda carta tem registro no Scryfall; nenhuma banida.
- [ ] "Onde já está" bate com as decklists e as pastas (`testes/grimorio.py` confere uma amostra).
- [ ] Nenhum preço na página.
- [ ] 1360 px e 375 px sem rolagem horizontal; galeria com 6 colunas no desktop e 2 no celular.
- [ ] HTML até 14 MB; leitura registrada em `leitura.json`; `ESTADO.md` com a linha da leitura.
