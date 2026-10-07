# Coro da Alvorada, versão 2: o que mudou

07/10/2026. Complementa o "Handover: Coro da Alvorada, painel do deck da Giada". Onde os dois divergirem, vale este.

## Estado

| Medida | Versão 1 | Versão 2 |
| --- | --- | --- |
| Arquivo | 345 KB | 457 KB (dist/coro-da-alvorada.html) |
| Deck | 100 cartas, 429 pontos | Igual: o deck não mudou |
| Radar | 12 candidatas (6 entram, 5 a avaliar, 1 fora) | 18 candidatas (7 entram, 10 a avaliar, 1 fora) |
| Imagem de carta | Só na gaveta, desligada por padrão | Em todas as abas, ligada por padrão, com botão de desligar |
| Testes | 35 verificações | 90, com o Scryfall simulado em seis situações |

## O que entrou

1. **Arte da Giada no herói.** A imagem enviada pelo dono do deck vai embutida (WebP, 40 KB). O herói passou a ser título à esquerda e arte à direita, com placa de nome, custo e tipo; tocar abre a carta. As asas desceram para o painel "As oito penas", ao lado do placar.
2. **Imagens das cartas pelo Scryfall.** Pedido em lote a `/cards/collection` (75 por chamada), pela edição e número da decklist; o que não é reconhecido é buscado pelo nome. O navegador guarda só o identificador de cada imagem (chave `coro-da-alvorada-v1:img`), então ao reabrir não há chamada à API. Se o lote falha, cai para um pedido por imagem, com intervalo; se nada passa, o painel volta às fichas de texto e avisa no rodapé.
3. **Onde as imagens aparecem.** Gaveta (carta inteira, botão de virar em carta de duas faces, crédito do ilustrador); espiada ao passar o mouse em qualquer carta; tier list em modo "Cartas" (alternável com "Fichas"); miniatura em cada candidata do radar.
4. **Versão com imagens embutidas.** `scripts/baixar_imagens.py` e `scripts/montar.py --imagens` geram um segundo arquivo, que não depende de internet e pode ser publicado.
5. **Sinal da comunidade.** Sinergia de cada carta na página de Anjos da Giada no edh.wiki (campo `syn`, fora do placar): painel na visão geral, coluna EDH no tabelão, linha na gaveta, etiqueta no radar e o painel "Você e a comunidade" no painel de controle.
6. **Seis candidatas novas no radar**, conferidas no Forge: Folk Hero (entra, no lugar de Chivalric Alliance), Angelic Field Marshal, Path to Exile, Arcane Signet, Emeria Shepherd e Segovian Angel (a avaliar).
7. **Link de preço na Liga Magic** ao lado do campo de valor em R$, na gaveta.
8. **Publicação.** Página publicada e prévia de chat não carregam imagens de outros sites. O painel percebe quando o ambiente barra o Scryfall e explica no rodapé, sem botão que não leva a nada. `scripts/montar.py --publicar` gera a montagem que nem tenta a rede: é a que foi publicada como artefato em 07/10/2026, sem imagens de carta. Para publicar com as cartas, use `--imagens --publicar`.
9. **Veredito editável e lista "Avaliadas, ficam de fora".** Na gaveta de cada candidata há o veredito (Entra, Avaliar, Fica de fora), e cada cartão do radar tem "Deixar de fora". Quem fica de fora desce para uma lista abaixo da grade, com tier, sinergia e motivo, e volta com "Reavaliar". O veredito escolhido fica em `ov[id].verdict`.
10. **Potenciais do edh.wiki.** 52 cartas da página que não estão no deck nem no radar (as de +10% ou mais e as de coleções recentes), com custo, tipo e texto original vindos do Forge (`D.pool`, a partir de `POOL` e `NOVAS` em `dados/evals.py`). Cada uma pode ir ao radar ou ficar de fora; o botão "Potenciais" no topo leva até elas.
11. **Atualizar a leitura.** O painel não lê outro site sozinho (o navegador barra). A seção de potenciais traz um pedido pronto para copiar e mandar ao Claude com o kit, que refaz a leitura, confere no Forge e devolve o painel.

## Dados e estado

- Carta: campos novos `syn` (sinergia em %, inteiro; ausente quando a carta não aparece na página) e `spot` (remoção em massa que também responde a um alvo).
- `meta`: `rev` (2) e `edh` (fonte, url, data da leitura, temas e as três listas da página).
- Estado do usuário: `img` (verdadeiro por padrão) substitui `art`. A chave `coro-da-alvorada-v1` foi mantida: o que estava salvo na versão 1 continua valendo.

## Regras que mudaram

| Regra | Antes | Agora |
| --- | --- | --- |
| Leitura 5, remoção | Pontual era toda remoção dedicada que não fosse em massa; alerta com menos de 4 pontuais ou mais de 5 globais | Carta marcada `spot` conta nas duas colunas; alerta também quando nenhuma pontual custa 1 mana |
| Tier list | Sempre fichas de texto | Cartas quando há imagem; fichas quando não há, ou por escolha |
| Regra 3 do prompt de retomada | "Sem recursos externos" | O arquivo segue único e funciona sem internet; só as imagens das cartas vêm de fora, e a versão embutida elimina até isso |

## O que a leitura crítica do handover mudou

- **Remoção pontual era 4, não 3.** Winds of Abandon exila um alvo por {1}{W} e contava só como remoção em massa.
- **A ressalva do Bishop of Wings cai.** O texto oficial só fala em morrer; Forge e Scryfall batem. Não há versão que cite exílio.
- **O radar tinha viés de novidade.** The Mind Stone (-2% de sinergia, US$ 40,61) estava com veredito de entrada sem a alternativa óbvia, Arcane Signet (+6%, US$ 0,43). Lightstall Inquisitor (+11%) aparecia sem o Segovian Angel (+35%), que voa e ajuda a pagar a Sephara. As três cartas de Reality Fracture não têm dado de uso: o veredito delas é opinião.
- **O placar premia densidade tribal.** Sinergia soma 114 dos 351 pontos de notas porque todo Anjo vale 2 só por ser Anjo. Serve para acompanhar o deck, não para decidir Anjo contra não-Anjo. Mantido, pela regra 2.
- **O que a comunidade confirma.** As 10 cartas de maior sinergia estão no deck; das 10 mais usadas faltam as duas remoções de 1 mana; 7 das 9 cartas da berlinda estão em baixa ou fora da página. As exceções são Angelic Skirmisher (+28%) e Emeria, the Sky Ruin (+23%).

## Ressalvas

- A chamada real ao Scryfall não foi exercitada no ambiente de construção, que bloqueia o site. O comportamento foi testado com respostas simuladas no formato documentado da API.
- A sinergia do edh.wiki mede o que é típico dos decks de Anjos da Giada, não o que é forte. Staples genéricas e cartas recentes ficam baixas ou de fora.
- O ilustrador da arte do herói não foi creditado pelo nome: a Giada tem pelo menos quatro ilustrações e não foi possível confirmar de qual se trata. A gaveta credita o ilustrador de cada carta a partir do Scryfall.
- Os preços em US$ citados no radar são os da página do edh.wiki em 07/10/2026.

## Pendências

- [ ] Abrir o arquivo no navegador, com internet, e confirmar que as imagens carregam (primeira execução real).
- [ ] Decidir as sete trocas com veredito de entrada no radar.
- [ ] Escolher entre The Mind Stone e Arcane Signet, e entre Lightstall Inquisitor e Segovian Angel.
- [ ] Preencher o valor em R$ das cartas (o link da Liga Magic está na gaveta).
- [ ] Rever Angelic Skirmisher e Emeria, the Sky Ruin à luz da sinergia da comunidade.
- [ ] Reler a página do edh.wiki quando Reality Fracture tiver dados de uso.
- [ ] Confirmar ou trocar o nome "Coro da Alvorada" e informar o ilustrador da arte do herói.
