# O padrão unificado: o que todo painel tem

Os dois painéis que existem, Ritos de Sangue (Clavileño) e Coro da Alvorada (Giada), saíram do mesmo código em conversas separadas e divergiram. Cada um tem peças que o outro não tem. Este arquivo é a soma dos dois e passa a ser o padrão de todo deck.

A etapa do motor só termina quando cada linha abaixo foi conferida no painel novo do Clavileño. A migração da Giada só termina quando o mesmo vale para ela.

**A base é o Ritos de Sangue.** É o mais completo dos dois, na avaliação do dono e na contagem: tem doze ações que o Coro não tem, contra oito no sentido contrário. O motor nasce do código do Ritos, e do Coro entram só as peças listadas aqui.

As seções até "Geral" vêm do Ritos de Sangue. As três últimas vêm da comparação com o Coro da Alvorada, refeita em 07/10/2026 com a revisão mais nova do Coro.

**Conferência da etapa 1, em 07/10/2026,** no painel novo do Clavileño (`saidas/02. Clavileno.html`, revisão 3). `[x]` quer dizer conferido no painel e coberto por teste em `testes/`. O que ficou para depois está explicado na própria linha.

## Visão geral
- [x] Retrato do comandante em arco, avatar na barra, título, subtítulo e fatos do deck
- [x] Rosácea dos agrupamentos, com o placar no centro; clicar numa pétala abre o tabelão filtrado
- [x] Curva de mana em janelas ogivais, por tipo e por cor, com a marca do CMC médio
- [x] Placar com a conta explicada e a distribuição de tiers
- [x] Barras dos agrupamentos com a faixa de referência
- [x] Leitura do deck, com os diagnósticos. Os oito do Clavileño saem dos dados com o mesmo texto de antes
- [x] Cores (cartas por cor; demanda e oferta de mana), tipos, edições e relevância, com valor e média quando há preço
- [x] Combos e linhas de jogo, com aviso quando falta peça
- [x] Seu deck e a comunidade

## Galeria
- [x] Por tipo, por tier e por relevância; incluir terrenos; ficha de texto quando não há imagem

## Tier list
- [x] Arrastar entre faixas; filtro por tipo; incluir terrenos

## Tabelão
- [x] Busca; filtros por tipo, relevância e agrupamento; ordenar por qualquer coluna
- [x] Agrupar por tipo com subtotais; linha de total; miniaturas; coluna da comunidade; primeira coluna fixa

## Painel de controle
- [x] Quatro faixas com arrastar; fila de corte; pendências

## Radar
- [x] Cartão com imagem, veredito, notas, sinergia e a marca "tenho"
- [x] Escolher quem sai, comparar lado a lado, colocar no deck, desfazer
- [x] Histórico de trocas com data e motivo editável
- [x] Avaliadas que ficam de fora, com reavaliar; saíram do deck, com devolver
- [x] Cadastrar carta nova

## Gaveta da carta
- [x] Imagem, frente e verso; tipo em português; o que faz e por que no deck
- [x] Tier, relevância, notas por agrupamento, PetCard, valor em R$, anotações de mesa
- [x] Links para Scryfall e LigaMagic; voltar à avaliação original; tirar e devolver ao deck

## Geral
- [x] Prévia da carta ao passar o mouse
- [x] Backup: exportar, restaurar, decklist atual, recomeçar com confirmação
- [x] Três ambientes: arquivo local, página publicada e prévia
- [x] Teclado, foco visível, celular sem rolagem lateral, respeito a movimento reduzido. Sem rolagem lateral conferido em 375 px, em todas as abas, com 6, 8 e 10 agrupamentos

## Vem do Coro da Alvorada e passa a valer para todos
- [x] Tier list com duas visões: cartas, com as imagens, e fichas. Sem imagem, volta sozinha para fichas
- [x] Imagens carregadas só quando a moldura aparece na tela, com aviso do estado e botão de tentar de novo. O carregamento sob demanda é o do próprio navegador; não precisou do vigia de rolagem do Coro
- [x] Painel de base de mana: o que os terrenos geram e o peso de cada cor nos custos
- [x] Sinal da comunidade: as cartas do deck distribuídas por faixa de sinergia, e as listas da página de origem (alta sinergia, mais usadas). O Clavileño não tem as listas na leitura de 06/10; o painel as mostra quando `comunidade.json` traz
- [x] Dados de comunidade estruturados no deck: fonte, link, data da leitura, temas e listas
- [x] Número de revisão do painel nos dados
- [x] Potenciais da comunidade: lista de cartas da página do edh.wiki que não estão no deck nem no radar, em ordem de sinergia, com as doze primeiras à vista e o resto sob pedido. Cada uma com "Levar ao radar" e "Deixar de fora"
- [x] Botão "Deixar de fora" direto no cartão do radar, além do veredito dentro da gaveta
- [x] Atualizar a leitura: o painel não lê outro site sozinho, então mostra o pedido pronto para copiar. No projeto, o pedido vira o comando `/potenciais`, e a aba Oficina traz esse comando preenchido
- [x] Marcadores próprios do deck, declarados nos dados e usados nos diagnósticos. No Coro: Anjo, ganho de vida, proteção, ataque. No Ritos: Vampiro, saída de sacrifício, dreno, prioridade de corte

## Só o Ritos tem, e a Giada ganha na migração
Todas estas já estão no motor. A Giada ganha cada uma ao migrar; a conferência nela é da etapa 2.
- [ ] Aba Galeria
- [ ] Comparador de trocas, lado a lado
- [ ] Histórico de trocas com data e motivo
- [ ] Anotações de mesa por carta e a marca "tenho"
- [ ] Veredito do radar editável dentro da gaveta, e "Reavaliar" na lista das que ficam de fora. A lista em si o Coro já tem
- [ ] Página publicada com o estado salvo na conta. O Coro hoje só grava no navegador

## Onde os dois fazem a mesma coisa de jeitos diferentes: o que vale
- [ ] **Gráfico dos agrupamentos:** é uma peça do tema. Rosácea no Ritos, asas no Coro. O motor oferece o encaixe e um desenho padrão para deck sem tema próprio. *Encaixe, rosácea e padrão prontos, de 6 a 10 agrupamentos. As asas entram com a Giada, na etapa 2.*
- [x] **Cores e base de mana:** um painel só, que se adapta a deck de uma cor ou de várias
- [x] **Comunidade:** um painel só, com os temas, a distribuição por faixa de sinergia e as listas de divergência entre o deck e a comunidade
- [ ] **Imagens:** o carregamento sob demanda e a nova tentativa do Coro, com a cadeia de fontes e as fichas de texto do Ritos, mais o mapa embutido criado pelo `/imagens`. *Tudo pronto menos o mapa embutido, que nasce na etapa 3. O encaixe para ele já existe.*
- [x] **Tier com imagens:** a alternância fica na Tier list. A Galeria agrupa por tipo e por relevância
- [x] **Outra face da carta:** uma ação só, com um nome só
- [ ] **Cartas novas para o deck:** uma seção só, "Potenciais", com duas fontes: a comunidade (edh.wiki, que o Coro já tem) e os lançamentos (Scryfall, criada pelo `/novas-cartas`). As mesmas duas ações nas duas. *A seção e a fonte da comunidade estão prontas. A fonte de lançamentos é da etapa 6.*
- [x] **Estado do usuário:** o formato do Ritos, com data da última gravação. Um backup feito no Coro antigo precisa continuar abrindo

## O topo do painel: o que é fixo e o que é do tema

Os dois painéis abrem de jeitos diferentes. A regra: o esqueleto é o mesmo em todo deck; a pele é do tema.

Fixo, com os mesmos elementos em todo painel:
- [x] Barra: emblema do deck, nome do painel, as seis abas (Visão geral, Galeria, Tier list, Tabelão, Painel de controle, Radar), contagem de cartas, botão Potenciais com o número, e Backup. O liga e desliga das imagens sai da barra e fica na Galeria e na gaveta. *Mais a sétima aba, Oficina.*
- [x] Nome do painel em destaque
- [x] Comandante: nome, custo, linha de tipo e uma frase do que ele faz
- [x] O plano em uma frase que fecha em três verbos (atacar, morrer, voltar; descer, crescer, proteger)
- [x] Cinco fatos: cartas, CMC médio, a tribo ou o eixo do deck, fontes de terreno, foils
- [x] A capa escolhida pelo dono
- [x] O gráfico dos agrupamentos com o placar no centro

Do tema, declarado nos dados do deck:
- [x] Paleta, fontes e textura de fundo
- [x] Moldura da capa: `larga` ou `retrato`. Larga mostra a arte inteira, em paisagem, com o gráfico logo abaixo, como no Coro. Retrato recorta a arte na vertical, dentro de uma moldura, com o gráfico ao lado, como o arco do Ritos. O padrão é `larga`, porque não corta a imagem que o dono escolheu; `retrato` só quando a arte tem uma figura central
- [ ] Desenho do gráfico dos agrupamentos: rosácea, asas, ou o desenho padrão. *Rosácea e padrão prontos; asas na etapa 2.*

O Ritos de Sangue continua com retrato e rosácea. O Coro da Alvorada continua com capa larga e asas. Os dois passam a mostrar os mesmos elementos.
