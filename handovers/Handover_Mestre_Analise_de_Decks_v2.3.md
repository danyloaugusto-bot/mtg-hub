# Handover Mestre: análise de decks de Commander

Versão 2.3, de 14/10/2026 (noite). Substitui a v2.2. Os handovers por deck continuam valendo como anexos de detalhe.

Este documento basta para um chat novo analisar qualquer deck do Danylo, ou retomar um dos vinte e quatro já analisados, sem reler nenhuma conversa anterior. Ele vem acompanhado de `cache_cartas_v2.3.json`, com o texto conferido de 482 cartas.

**O que mudou da v2.2 para a v2.3:**

- O painel ganhou cinco decks (Zur, Zara, Ezio, Lathliss e Krenko).
- **Duas velocidades de trabalho** (seção 3.7): o modo rápido, para análises pontuais, e o modo profundo, para "quero 10". A lição da tarde: o modo rápido baixou a profundidade, e ele percebeu na hora.
- **Simulação de motor** (seção 6.3) virou padrão nas análises fortes: em que turno o plano do deck está montado, não só a mana.
- **Cache de cartas** (seção 6.4): o texto conferido não se busca de novo.
- O passo 2 ganhou cinco lições de leitura de regra, e a seção 5 ganhou seis regras novas.
- A seção 7 ganhou os erros de 14/10 à tarde e à noite.
- A seção 3.4 ganhou o quarto tamanho de ambição: a reconstrução forte com atalho medido.

---

## 0. Em 60 segundos

**Para o Danylo.** Abra um chat novo, anexe este arquivo e o `cache_cartas_v2.3.json`, e cole a frase abaixo, trocando o que está entre colchetes. Para retomar um deck, anexe também o handover e a análise dele.

> Você está recebendo o Handover Mestre v2.3 de análise de decks de Commander e o cache de cartas. Leia o Mestre inteiro antes de responder. Tarefa de hoje: [analisar o deck novo abaixo / refinar o deck X / testar as dez mãos do deck X]. Quanto mexer: [pontual / em camadas / reconstrução forte]. Bracket: [importa / não importa]. Não mexer em: [nada / base de mana / cartas X]. Entrega: análise em Markdown, handover do deck e lista nova.

Se "quanto mexer" não vier, siga a seção 3.4: leia a ambição no texto dele.

**Para o analista.** Leia nesta ordem:

1. Seção 1, para saber em que pé está cada deck.
2. Seção 2, para saber com quem você está falando.
3. Seção 3, o método, com as duas velocidades (3.7). As seções 4 a 7 são consulta.
4. Seção 8, a ficha do deck em que você vai trabalhar.
5. Antes de buscar qualquer texto de carta, abra o cache (seção 6.4).

---

## 1. Painel de situação

Vinte e quatro decks analisados até hoje. O placar só compara um deck com ele mesmo.

| Deck | Comandante | Cores | A conta do deck | Estado | Nota (hoje / projetada) | Placar | Nome de painel |
|---|---|---|---|---|---|---|---|
| Clavileño | Clavileño, First of the Blessed | WB | atacar, morrer, voltar | Painel pronto | n/d | n/d | Ritos de Sangue |
| Giada | Giada, Font of Hope | W | descer, crescer, proteger | Painel pronto | n/d | n/d | Coro da Alvorada |
| Valgavoth | Valgavoth, Harrower of Souls | BR | ver handover | Painel a gerar | n/d | n/d | a definir |
| Ken | Ken, Burning Brawler | RW | equipar, acertar, repetir | Análise de 08/10 | n/d | 367 | Round Extra (sugerido) |
| Greymond | Greymond, Avacyn's Stalwart | W | povoar, fortalecer, atacar | Análise de 08/10 | n/d | 339 | Vigília de Thraben (sugerido) |
| Lynde | Lynde, Cheerful Tormentor | UBR | amaldiçoar, repassar, desgastar | Análise de 08/10 | n/d | 303 | Roga-Praga (sugerido) |
| Vito | Vito, Thorn of the Dusk Rose | B | acelerar, sangrar, fechar | Análise de 09/10 | n/d | 372 | Dízimo da Rosa (sugerido) |
| Fynn | Fynn, the Fangbearer | G | morder, marcar, proliferar | Análise de 09/10, 4 perguntas | n/d | 348 | Dez Gotas (sugerido) |
| Queen Marchesa | Queen Marchesa | RWB | blindar, coroar, executar | Análise de 09/10, 4 perguntas | n/d | 315 | Longa Vida à Rainha (sugerido) |
| Strefan | Strefan, Maurer Progenitor | BR | sangrar, engarrafar, soltar | Rodada 2 de 11/10 | 6,5 / 9–9,5 | 326 / 399 | Brinde Carmesim (sugerido) |
| Tergrid | Tergrid, God of Fright | B | ver handover | Reconstrução de 13/10 | 5,5 / 8,5 | 326 / 383 | Lanterna do Medo (sugerido) |
| Tartarugas | Leonardo + Michelangelo | WUBRG | ver handover | Reconstrução de 13/10 | 6 / 9 | 412 / 453 | Cowabunga (sugerido) |
| Evelyn | Evelyn, the Covetous | UBR | a definir | **Só o ponto de controle**, 3 perguntas | n/d | n/d | a definir |
| Tovolar | Tovolar, Dire Overlord | RG | uivar, conectar, comprar | Reconstrução de 13/10 | 5 / 8,5 | 338 / 452 | Noite Sem Dia (sugerido) |
| Lathril | Lathril, Blade of the Elves | BG | semear, virar, drenar | Reconstrução de 13/10 | 6,5 / 9 | 327 / 359 | Dez por Dez (sugerido) |
| Kaalia | Kaalia of the Vast | RWB | acelerar, blindar, despejar | Rodada 2 de 14/10: versão enxuta | 5 / 8 (enxuta) ou 9 | 244 / 292 / 339 | Céu, Inferno e Fogo (sugerido) |
| Okaun e Zndrsplt | Okaun + Zndrsplt | UR | virar, dobrar, conectar | Diagnóstico de 14/10, 10 trocas | 7 / 8,5 | 304 / 324 | Cara, Eu Ganho (sugerido) |
| Wilhelt | Wilhelt, the Rotcleaver | UB | morrer, renascer, drenar | Diagnóstico de 14/10, 12 trocas | 7 / 8,5 | 310 / 335 | Cutelo e Cova (sugerido) |
| K'rrik | K'rrik, Son of Yawgmoth | B | pagar, drenar, repagar | Reestruturação de 14/10, 17 trocas | 6 / 8,5 | 304 / 345 | Dízimo de Sangue (sugerido) |
| **Zur** | Zur the Enchanter | WUB | atacar, buscar, cobrar | **Em camadas de 14/10, 19 trocas** | 5,5 / 8 | 246 / 267 | Pedágio Arcano (sugerido) |
| **Zara** | Zara, Renegade Recruiter | UR | espiar, emprestar, quitar | **Em camadas de 14/10, 18 trocas** | 5 / 8 | 194 / 244 | Empréstimo Compulsório (sugerido) |
| **Ezio** | Ezio Auditore da Firenze | WUBRG | conectar, correr, executar | **Pontual de 14/10, 9 trocas** | 6 / 7 | 207 / 258 | Requiescat in Pace (sugerido) |
| **Lathliss** | Lathliss, Dragon Queen | R | descer, duplicar, queimar | **Reconstrução forte de 14/10: 25 trocas, atalho de 10** | 6,5 / 8,5 (atalho 7,5) | 259 / 320 / 294 | Ninhada Real (sugerido) |
| **Krenko** | Krenko, Mob Boss | R | dobrar, converter, recomeçar | **Reconstrução forte de 14/10: 29 trocas, atalho de 10** | 6,5 / 9 (atalho 8) | 306 / 376 / 344 | Horda do Chefão (sugerido) |

Todas as notas projetadas são **projeção sem partida**. Nenhum deck tem nota testada ainda.

**Pendências que valem para todos:**

- Nenhum arquivo foi gravado em `C:\Projetos\mtg-hub\dados\`. O Danylo salva à mão, ou conecta a pasta e pede a gravação.
- Ele não escolheu nome de painel nem deu nota em nenhum deck desde o Ken.
- Greymond, Lynde, Fynn, Marchesa e Strefan estão sem capa.
- O teste das dez mãos está pendente em todos os decks analisados desde 11/10.

**Arquivos produzidos em 14/10 (tarde e noite):**

| Deck | Análise | Handover | Listas |
|---|---|---|---|
| Zur | `analise-claude-zur.md` | `Handover_Zur_Analise_de_Deck.md` | `lista_nova_zur.txt` |
| Zara | `analise-claude-zara.md` | `Handover_Zara_Analise_de_Deck.md` | `lista_nova_zara.txt` |
| Ezio | `analise-claude-ezio.md` | `Handover_Ezio_Analise_de_Deck.md` | `lista_nova_ezio.txt` |
| Lathliss | `analise-claude-lathliss.md` (v2) | `Handover_Lathliss_Analise_de_Deck.md` (v2) | `lista_forte_lathliss.txt`, `lista_atalho_lathliss.txt` |
| Krenko | `analise-claude-krenko.md` (v2) | `Handover_Krenko_Analise_de_Deck.md` (v2) | `lista_forte_krenko.txt`, `lista_atalho_krenko.txt` |
| Os dois vermelhos | `LEIA-ME_Vermelhos.md` (índice v2) | | |

A v1 de Lathliss e Krenko (camadas, nota 8) foi substituída pela v2. Não use a v1.

---

## 2. Com quem você está falando

O Danylo é diretor de FP&A, matemático de formação e contador. Tem cerca de 25 decks, em cinco grupos: 01. Top, 02. Tribais, 03. Caos, 04. Forfun, e Compras + Precon. O projeto dos painéis fica em `C:\Projetos\mtg-hub`, com uma pasta por deck em `dados\XX. Nome\`.

**Como ele quer ser atendido:**

- Resposta direta, com o motivo escrito. Sem bajulação. Discorde quando houver razão, e diga onde.
- Português do Brasil, nomes das cartas em inglês. Texto humano, sem excesso de símbolos.
- Números com hipótese declarada. Ele confere contas.
- Analogias de finanças, quando exatas. As que funcionaram:
  - a vida como capital de giro (Vito) e como linha de crédito (K'rrik);
  - gerar contra converter, em todos os decks;
  - giro de estoque (Wilhelt);
  - margem contra operação (Okaun);
  - **a taxa como capital de giro, não como lucro (Zur);**
  - **o roubo da Zara como empréstimo compulsório com vencimento na etapa final;**
  - **o freerunning como desconto por volume e o WUBRG do Ezio como opção de compra;**
  - **a Lathliss como desdobramento de ações; o Krenko como juros compostos.**
- Refina por rodadas ("7/10", "revise", "ainda não achei forte"). Leia como pedido de mais rigor ou mais ousadia, não de mais texto.

**Fixo em todo deck:**

- **Orçamento sem teto.** Nunca pergunte.
- **Não pergunte bracket.** Informe os Game Changers e se há combo de duas cartas, e siga. Padrão: manter o total de Game Changers que ele já tem. Quando ele disser que não se importa com bracket (como nos vermelhos, em 14/10), libere Game Changers e combos e registre o bracket resultante numa linha.
- **Não pergunte cartas de estimação.** As foil, etched ou de impressão especial são os pets, **inclusive os básicos foil**. Pet nunca entra na fila de corte. Quando um pet for a carta mais fraca, ou trabalhar contra o deck, diga isso uma vez, com todas as letras (o Rest in Peace do Ezio). Quando os pets travarem espaço que importa (as Mountains foil dos vermelhos), diga uma vez e transforme em pergunta.
- **Os agrupamentos são dele.** Proponha ajuste uma vez, com o motivo, e registre a ressalva uma única vez. Quando ele não tem eixos, crie oito e passe pelo crivo da seção 4. Quando os eixos dele são "Sinergia 1, 2, 3", defina o que cada uma mede e pergunte se é isso.
- **Três fases:** início, meio e fim. Quando ele não descreve, proponha.
- **Você não constrói painel nem HTML.** Sua parte criativa é propor nome, clima, paleta e motivo gráfico.

**O que as sessões ensinaram sobre ele:**

- Pede entrega direta com frequência. Não trave num ponto de controle: entregue, e transforme cada decisão dele em suposição declarada e em pergunta no handover.
- **"Quero o 10" nem sempre é "reconstrua"** (Kaalia). Mas **"quero o 10" com "análise mais profunda" e "não me importo com bracket" é reconstrução forte** (vermelhos). Ver seção 3.4.
- **Ele percebe quando a profundidade cai.** Nos vermelhos, a primeira entrega (camadas, modo rápido, nota 8) voltou com "chegamos num nível tão bom pra agora chegar numa avaliação tão baixa?". Velocidade nunca às custas da simulação de motor e da varredura das peças que decidem.
- **Ele mede o tempo.** Perguntou por que cada análise demorava mais de uma hora. Ver seção 3.7.
- **Precon e coleção especial:** não costuma mexer, para não perder a essência. Nas coleções especiais (Ezio), troque dentro da própria coleção sempre que der, e mostre quantas cartas da coleção ficam.
- **Decks de presente:** a Zara foi montada para o irmão. Pergunte de quem são as decisões de pets e de Game Changers.
- Quando ele pede nota "no começo e no fim", abra com a nota atual e feche com a projetada.
- Manda links do Scryfall e do edh.wiki junto com a lista. O Scryfall não abre daqui. Archidekt de deck abre só até umas 90 cartas; Moxfield não abre (robots e JavaScript).
- Quando diz "não quero cair no comum", quer o plano que só aquele comandante tem.
- Quando sugere cartas pelo nome, confira, diga se ele acertou e, se acertou, diga com todas as letras.
- Às vezes manda um handover só para você "estar preparado". Confirme em duas linhas e espere o deck.
- **Ele empilha decks no mesmo chat** (em 14/10: nove no total, em duas conversas). Ele aceita fazer dois de uma vez quando os decks se parecem; ver seção 3.6.
- **Quando ele interrompe uma ferramenta, pare** e diga em que pé está. Depois, ele costuma pedir "continuar e finalizar".

---

## 3. O método

### 3.1 A pergunta que decide tudo

A carta é boa, ou é boa **neste comandante**?

### 3.2 Os nove passos

**Passo 1. Conferir a lista, por script.** 100 cartas com o comandante; repetidas fora os básicos; identidade de cor; banidas; fontes de terreno somando as duplas face com terreno. Limpe a lista guardando quais eram foil ou etched (pets).

**Passo 2. Ler o comandante palavra por palavra, com as regras oficiais.** É aqui que os decks se decidem.

| Deck | O que se achava | O que o texto diz |
|---|---|---|
| Fynn | "Infectar" | Dois marcadores fixos por criatura que conecta |
| Strefan | Sangue quando bate nos oponentes | "Cada jogador que perdeu vida" inclui ele mesmo |
| Strefan | O Vampiro entra atacando | Entra atacando sem ter sido declarado: "quando atacar" não dispara |
| Vito | O laço é uma opção | Os gatilhos são obrigatórios |
| Tovolar | A noite fica | Duas mágicas de qualquer jogador viram o dia |
| Tovolar | Golpe duplo é só dano | São dois eventos de dano |
| Lathril | Os dez Elfos precisam estar prontos | "Virar dez Elfos" não usa o {T} |
| Kaalia | Põe "carta tribal" | Põe card de criatura; ETB sim, "quando atacar" não |
| Okaun e Zndrsplt | Só as minhas moedas contam | "Um jogador vence" inclui oponentes; o Efreet é combo |
| Wilhelt | Só Zumbi não-ficha dispara | O filtro é "sem decayed" |
| K'rrik | Paga qualquer mana com vida | Só os {B}; nunca o genérico nem o X |
| **Zur** | Conjura o encantamento | **Põe**: gatilho de conjurar não dispara, ETB sim. Aura posta não mira: escolhe o que encanta, ignora hexproof, shroud e ward; proteção barra |
| **Zara** | Rouba a criatura | **Empresta**: volta à mão do dono na etapa final, se o mesmo objeto ainda estiver no campo. Sacrificada, vai ao cemitério do dono; copiada, a cópia fica; piscada sob seu controle, vira objeto novo e fica (dedução) |
| **Ezio** | Executa quem tem 10 de vida | Precisa de {W}{U}{B}{R}{G} pagos de uma vez num gatilho: mana restrita a mágica ou habilidade ativada não paga |
| **Lathliss** | Gatilho de combate | "Outro Dragão **não ficha** entra". Fichas não disparam; changelings disparam |
| **Krenko** | Thornbite se anexa sozinho | O Krenko é Warrior, não Shaman: equipar custa {4} |

**Passo 3. Achar a conta do deck.** Três verbos e, se der, uma equação. Exemplos de 14/10:
- Zur: cada ataque põe um encantamento de MV médio 2,5 sem gastar mana nem carta.
- Lathliss: cada Dragão não ficha vira dois corpos e dois disparos de cada pagador de entrada.
- Krenko: cada ativação dobra a horda; com o Purphoros, 16 Goblins são 32 de dano em cada oponente.

**Passo 4. Confrontar o plano dele com a lista.** Onde a lista trai o plano, em ordem de gravidade. Depois a tabela das três fases.

**Passo 5. Avaliar carta a carta.** Nota de 0 a 3 em cada eixo, tier, relevância e o porquê, tudo em script.

**Passo 6. Diagnosticar.** Contagens contra as faixas, e principalmente gerar contra converter:

| Deck | Gera | Converte |
|---|---|---|
| Clavileño | Muita morte | Duas cartas viravam morte em dano |
| Ken | 17 combates extras | 6 ramps e 8 compras |
| Greymond | Corpos fortes | Quase nada fazia o dano chegar |
| Lynde | Muita compra | Cinco fechamentos |
| Vito | 30 fontes de ganho de vida | Quatro conversores |
| Fynn | Onze corpos com toque mortífero | Uma evasão em massa |
| Marchesa | Duas cartas por turno | Fechamentos lentos |
| Strefan | Doze destinos para o Sangue | Cinco pings baratos |
| Tovolar | 21 lobos | 9 cartas de evasão |
| Lathril | 32 Elfos | 6 cartas que desviram a comandante |
| Kaalia | 29 tribais e 10 compras | 2 peças de blindagem |
| Okaun | 13 caminhos até o Thumb | 3 caminhos até o Efreet |
| Wilhelt | 16 geradores e 12 saídas | 4 drenos |
| K'rrik | Vida de várias fontes | Um Exquisite Blood |
| **Zur** | 28 alvos e 7 taxas | 2 peças de Voltron |
| **Zara** | 16 roubos, 6 temporários | 7 conversores, nenhum repetível |
| **Ezio** | Conexões e desconto | O WUBRG chega no turno 8 em 19% |
| **Lathliss** | 19 Dragões não ficha | Chega tarde e sem gás |
| **Krenko** | A horda dobrando | Sem combo, sem compra, com Bombardment e Altar esperando a terceira peça |

**Regra fixa: procure o combo que já está na lista.** Os nove decks de 14/10 tinham, e o dono não citou nenhum. Os de hoje:
- Zur: Wedding Ring + Consecrated Sphinx (2022-3283).
- Zara: Curiosity + Niv-Mizzet, Parun (1089-2353) e + Niv-Mizzet, the Firemind (1089-4971).
- Lathliss: Reaver Cleaver + Hellkite Charger (3398-5039), com a Lathliss como peça de poder 7.
- Krenko: **faltava uma carta.** Thornbite Staff + o Goblin Bombardment da lista (659-2178-5147).

**Regra fixa: procure a carta que falta para o combo**, não só o combo completo. O Krenko ensinou: duas peças na lista e a terceira a uma busca.

**Regra fixa: teste cada carta contra o próprio plano.** Os de hoje: limpezas que matam o comandante (Zur, Zara), o Out of Time tirando o Zur de fase, o Rest in Peace desligando seis cartas do Ezio, a Smoke travando a Zara, Chain Reaction matando os 5/5 da Lathliss, Boom // Bust e Worldfire no Krenko.

**Passo 7. Combos e linhas.** Combos, motores e fechamentos, separados. Para cada combo, o ID ou "dedução". Diga como fechar a mesa, não só um jogador, e o momento da jogada.

**Passo 8. Cortes e entradas.** Tabela de pares "sai | entra | por quê", efeito somado em antes e depois, tudo por script. Inclua as recusadas.

**Passo 9. Painel, dúvidas e handover.** Três nomes e o escolhido, clima, paleta de cinco cores com hex, moldura e motivo. Depois a seção de dúvidas e o handover do deck.

### 3.3 A varredura em três frentes

1. Todas as cartas da mecânica central, por busca de texto.
2. A tribo ou o tema nas coleções recentes, até hoje.
3. Os pagadores laterais.

Peça ao subagente uma lista de **armadilhas**. As de hoje:
- Zur: enchantress que compra ao conjurar (Mesa Enchantress, Kor Spiritdancer, Sram); encantamentos de MV 4 ou mais.
- Zara: Essence Flux (devolve ao dono), Aboleth Spawn, Sower of Temptation; Wizard's Staff (ela é Pirate).
- Ezio: terras de mana restrita que não pagam o WUBRG.
- Lathliss: Hour of Devastation e Burn Down the House (5 de dano mata os 5/5); criadores de Dragão ficha.
- Krenko: Kiki-Jiki (não copia lendário), Tavern Brawler (Background).

### 3.4 Quatro tamanhos de ambição

| Tamanho | Quando | O que entrega |
|---|---|---|
| Pontual (8 a 15 trocas) | Precon, coleção especial, forfun, "poucos slots", "não perder a essência" | Diagnóstico, tabela de pares, antes e depois, banco e recusadas |
| Em camadas | "Não precisa de tantas mudanças, mas quero mais forte"; "retomar"; lacunas apontadas por ele | Três a cinco camadas, cada uma medida, em ordem de prioridade |
| Reconstrução | "O mais forte possível", "crie a estratégia", "deck competitivo" | Lista de 100, pares com função, antes e depois, e **o atalho das dez trocas mais fortes, medido** |
| **Reconstrução forte** | **"Quero 10", "análise mais profunda", "não me importo com bracket"** | **Versão forte com Game Changers e combos liberados, atalho das 10, simulação de motor das três versões (hoje, forte, atalho) e a razão do atalho** |

Lições:
- Kaalia: a versão enxuta entregou 85% do ganho com um terço das trocas. Mostrar essa razão ajuda ele a decidir.
- Vermelhos: o atalho entregou cerca de 55% do ganho de placar com 10 das 25 a 29 trocas, mas perdeu mais no motor. **Mostre a razão no placar e no motor**, porque elas divergem.

### 3.5 A nota e o teste

Três notas: atual, projetada (sempre "projeção sem partida") e testada. Não dê 10 a uma lista que nunca foi embaralhada. **Quando ele pedir 10, diga qual é o teto honesto e o que o segura** (comandante de 6 manas, pets que travam espaço, combo dependente de uma peça). Ofereça o teste das dez mãos com três ou quatro medidas e metas.

### 3.6 Como conduzir

- **Contexto.** O risco depende do quanto você carrega, não do número de mensagens.
  - Avise uma vez, a partir do segundo deck completo, com a frase da preferência dele ("⚠️ Contexto elevado — risco de alucinação aumentando. Recomendo criar um handover"), e ofereça o handover.
  - Se ele seguir no mesmo chat, siga. Uma linha no fim basta nos decks seguintes.
  - O que torna vários decks seguros é uma pasta por deck e tudo em arquivo e script.
- **Dois decks de uma vez** funciona quando se parecem (os dois vermelhos). Uma pasta por deck, os mesmos três arquivos, **um índice que compara os dois** (`LEIA-ME_<tema>.md`), e uma pesquisa de texto só para as cartas dos dois.
- **Ponto de controle** só quando ele não pedir entrega direta.
- Feche na conversa com: a nota atual e a projetada; a descoberta principal; onde discorda dele; a tabela de trocas; o antes e depois em cinco linhas; a avaliação de que tem menos certeza; o nome de painel. Não repita o arquivo.

### 3.7 Duas velocidades

Ele perguntou por que cada análise passava de uma hora. A resposta medida: o tempo estava na pesquisa web dos subagentes (até 51 minutos numa varredura sem teto), não na análise.

| | Modo rápido | Modo profundo |
|---|---|---|
| Quando | Pontual, forfun, coleção especial | Camadas grandes, reconstrução, "quero 10" |
| Texto das cartas | Cache primeiro; dois subagentes com teto de 50 a 75 buscas para o resto | Igual |
| Regras do comandante | O próprio analista, duas buscas (EDHREC e Grimoria) | Igual, mais um subagente de combos se o comandante for peça de combo |
| Varredura | Um subagente de dados e lacunas, teto de 25 a 40 buscas | Varredura das três frentes, teto de 40 a 60, **mais um subagente só para as candidatas fortes** |
| Simulação | Mana e o gargalo principal | **Motor das três versões**, 20 mil partidas (seção 6.3) |
| Tempo medido em 14/10 | Ezio: 12 minutos; dois vermelhos em camadas: 21 minutos | Dois vermelhos em reconstrução forte: cerca de 20 minutos, reaproveitando os textos |

**O erro a não repetir:** usar o modo rápido quando ele quer profundidade. Na dúvida, profundo. E nunca pule a simulação do motor numa análise que propõe nota 8 ou mais.

---

## 4. Escalas

**Nota por eixo:** 0 não faz; 1 faz de passagem; 2 é função da carta; 3 é referência no deck. Terreno que sempre entra virado leva −1 em Ramp. Carta de estimação soma 1 em Sinergia.

**Tier:** S define o deck; A titular; B cumpre o papel; C substituível; D fora de lugar.

**Relevância:** INS nunca sai; ALT só sai por algo claramente melhor; MÉD trocável; BAX primeira a sair. Pets aparecem como "(pet)".

**Faixas do diagnóstico:**

| Item | Faixa |
|---|---|
| Fontes de terreno | 35 a 37 |
| Ramp dedicado | 10 a 12 |
| Compra dedicada | 10 a 12 |
| Remoção | 8 a 12, com 3 a 5 em massa |

Quando o deck se afasta de propósito, diga que é de propósito.

**Placar:** pontos do CMC médio (5 abaixo de 2; 4 abaixo de 3; 3 abaixo de 4; 2 abaixo de 5; senão 1), mais aceleração (soma das notas de Ramp dividida pelo CMC médio; cada 0,5 vale 5 pontos; teto de 90), mais a soma de todas as notas. **O placar não mede multiplicação, resposta nem compra em carta**: quando uma camada boa faz o placar cair (Zara camada 2, Lathliss camada 3, Krenko camada 4), diga por quê.

**Crivo para os eixos dele:** mede uma função? Os eixos se somam? Mais de meia dúzia de cartas? Há eixo para o que o deck mais precisa medir? Os que falharam hoje: "Recursão + Goad" (Zur), "Tax + WinCon" e "Outros" (Zara), "Sinergia 1, 2, 3" sem definição (vermelhos), "Buff + Haste" no Krenko (o ímpeto é o que importa). Em quase todos faltou **proteção do comandante**.

**Régua de calibração:**

| Carta (deck) | Tier | Relev. | O que ensina |
|---|---|---|---|
| Toxic Deluge (Clavileño) | S | INS | Especialista pode ser S com 3 pontos |
| Relentless Assault (Ken) | C | BAX | Sinergia no site, e não funciona com o comandante |
| Necrodominance (Vito) | C | BAX | Carta forte que desliga dez cartas da lista |
| Spear Spewer (Strefan) | S | INS | Um 0/2 de uma mana pode ser a melhor carta |
| Velomachus Lorehold (Kaalia) | C | MÉD | Texto de bomba, e nada pela comandante |
| Frenetic Efreet (Okaun) | S | INS | Um 2/1 de três manas vence o deck |
| Possibility Storm (Okaun) | D | BAX | Carta temática que desmonta o próprio combo |
| Platinum Angel (K'rrik) | D | BAX | "Não posso perder" que trava o comandante |
| Crowded Crypt (Wilhelt) | C | MÉD | Fichas do tipo certo que não disparam o comandante |
| **Out of Time (Zur)** | D | BAX | Encantamento que o comandante busca e que o tira de fase |
| **Thassa, Deep-Dwelling (Zara)** | S | INS | Uma peça de flicker transforma o empréstimo em roubo |
| **Brotherhood Regalia (Ezio)** | S | INS | Equipamento de 2 que garante o desconto todo turno |
| **Universal Automaton (Lathliss)** | B | ALT | Um 1/1 de 1 mana que vale um 5/5 pela comandante |
| **Thornbite Staff (Krenko)** | S | INS | A carta que falta para o combo com o que já está na lista |

---

## 5. Regras de verdade

1. **Texto de carta nunca de memória.** Se não der para buscar, marque "(texto de memória)".
2. **Regra do jogo também se confere** antes de chamar algo de combo.
3. **Carta dupla com terreno no verso conta como fonte de terreno.** Room conta a soma das portas no grimório.
4. **Número de site mede presença, não força.**
5. **Concordar com outra IA, com um guia ou com um subagente não prova nada.** Hoje um subagente chamou o Marvin de armadilha; ele é um segundo Krenko.
6. **Leia o comandante com as regras oficiais dele.**
7. **Condição de tempo se lê palavra por palavra.**
8. **Teste o bônus do comandante contra as checagens da lista.**
9. **"Cada jogador" não é "cada oponente", e "um jogador vence" não é "você vence".**
10. **Gatilho obrigatório não é opção.**
11. **"Entra atacando" não é "atacou".**
12. **Filtro do comandante se lê exato.**
13. **Separe texto, regra oficial e leitura sua.**
14. **Suas afirmações anteriores também se conferem.**
15. **Todo número do texto sai do script.**
16. **Pôr não é conjurar.** ETB dispara; "quando conjurar", kicker e "if it was cast" não; X vale 0 (Zur, Zara).
17. **Objeto que sai e volta é objeto novo** (400.7). Efeitos atrelados ao objeto antigo se perdem (Zara com Thassa).
18. **Mana restrita a mágica ou habilidade ativada não paga custo de gatilho** (Ezio).
19. **Destruição ou exílio de terrenos em massa joga o deck no Bracket 4**, mesmo sem Game Changer (Boom // Bust, Worldfire).
20. **Anexo grátis por tipo: confira o tipo do comandante** (Thornbite Staff anexa em Shaman; o Krenko é Warrior).
21. **O simulador também se confere.** Antes de reportar, rode à mão uma partida simples e veja se a ordem das jogadas faz sentido. Hoje o simulador do Krenko descia o ímpeto no turno errado; corrigi às claras antes de entregar.
22. **Nunca escreva o custo ou o tipo do comandante de memória no pedido ao subagente.** Copie da fonte. Hoje escrevi o custo da Zara errado ({1}{U}{R} em vez de {3}{U}{R}).

---

## 6. Caixa de ferramentas

### 6.1 Fontes

| Para quê | Fonte | Observação |
|---|---|---|
| Texto atual da carta | `json.edhrec.com/cards/<slug>` | Slug minúsculo, hífens, sem apóstrofo, vírgula ou acento. Carta dupla: a primeira face. Às vezes dá erro de servidor: use o Archidekt |
| Fallback de texto e legalidade | `archidekt.com/api/cards/v2/?name=<nome>&unique=true` | Traz `legalities.commander` e `gameChanger` |
| Game Changer e banida | campos `game_changer` e `banned` do EDHREC | `legal_commander` só diz se a carta pode ser comandante. Ignore |
| Página do comandante | `json.edhrec.com/pages/commanders/<slug>.json` | Vem cortada; peça seções |
| Combos de uma carta | `json.edhrec.com/pages/combos/<slug>.json` | Os IDs são os do Commander Spellbook |
| Espelho com percentuais | `edh.wiki/commanders/<slug>/<tema>/` | Seção de sinergia traz só 10 |
| Rulings | `grimoria.app/cards/<slug>` | Melhor fonte; às vezes paráfrase |
| Combos | `commanderspellbook.com/combo/<ids>/` | Abra pelo ID; a API do backend bloqueia robôs |
| Decks de inspiração | Archidekt abre até umas 90 cartas; Moxfield não abre | Diga o que não veio |
| Game Changers | `scrollvault.net/guides/game-changers.html` | Lista de 09/02/2026, 53 cartas; próximo B&R em 30/11/2026 |

**Não funcionam daqui:** Scryfall, Gatherer, Moxfield e curl do terminal.

**O truque da citação:** peça o texto "literal, em trechos numerados de até 90 caracteres".

**Game Changers conferidos até hoje:** Demonic Tutor, Vampiric Tutor, Imperial Seal, Necropotence, Bolas's Citadel, Ad Nauseam, Tergrid, Orcish Bowmasters, Opposition Agent, Braids; Rhystic Study, Cyclonic Rift, Fierce Guardianship, Force of Will, Mystical Tutor, Intuition, Gifts Ungiven, Consecrated Sphinx, Narset, Thassa's Oracle; Gamble, Jeska's Will, Underworld Breach; Smothering Tithe, Teferi's Protection, Enlightened Tutor, Drannith Magistrate, Humility, Farewell; Mana Vault, Ancient Tomb, Grim Monolith, The One Ring, Chrome Mox, Mox Diamond.

**Não são Game Changers (conferidos):** Sol Ring, Toxic Deluge, Skullclamp, Emeritus of Woe, Craterhoof, Zur, Treachery, Gilded Drake, Agent of Treachery, Thassa Deep-Dwelling, Helm of the Host, Phyrexian Altar, Teferi Time Raveler, Assassin's Trophy, Swords to Plowshares, Path to Exile, Supreme Verdict, Rest in Peace, Gauntlet of Power.

**Banidas conferidas:** Mana Crypt, Jeweled Lotus, Dockside Extortionist.

**Bracket 3:** até 3 Game Changers e nada de combo de duas cartas montado cedo. **Bracket 4:** destruição de terrenos em massa, ou mais de 3 Game Changers.

**Coleções de 2026 até hoje:** Lorwyn Eclipsed (23/01), TMNT (06/03), Secrets of Strixhaven (24/04), Marvel (26/06), The Hobbit (14/08), Reality Fracture (02/10). Star Trek sai em 13/11. Jabs, Mistress of Mockery sai em 19/10.

### 6.2 A linha de montagem

1. **Uma pasta por deck** (`/home/claude/<deck>/`). Lista limpa e pets em arquivo. Contagem por script antes de responder.
2. **Cache primeiro** (6.4). Só as cartas fora do cache vão aos subagentes.
3. **Subagentes em paralelo, sempre com teto de buscas:**
   - dois de texto, com a lista dividida (teto de 50 a 75 cada);
   - um de dados e lacunas do comandante (teto de 25 a 40);
   - no modo profundo, um de candidatas fortes por deck (teto de 55), com combos abertos por ID.
   - **Regras do comandante: o próprio analista**, em paralelo.
4. **Scripts:**
   - `motor.py` comum: `novo(eixos)`, `montar(D, pares, camadas)`, `checar(...)` com asserts de 100 cartas, pares batendo com entradas, pet fora dos cortes e marca de pet conferida contra o arquivo; `resumo`, `p_ver` (hipergeométrica), `sim_mana`.
   - `dados.py` por deck (`c(...)` e `e(...)`, `PARES`, `CAMADAS`); no modo profundo, `base_atual.py` com a lista de hoje e `dados_forte.py` com a versão forte e o `ATALHO`.
   - `stats_*.py` para contagens, flags e placar das versões.
   - `sim_motor.py` para o motor (6.3).
   - `gerar_*.py` preenche o modelo `analise_*_tpl.md` com marcadores `{{...}}` e confere que não sobrou nenhum.
5. **Flags que medem a conta**, não só os eixos. As de hoje:
   - Zur: `Z` alvo do Zur, `F` fechamento, `SY`, `KZ` mata o Zur, `PO` política, `PZ` protege o Zur.
   - Zara: `RB` rouba, `RP` roubo que fica, `RT` até o fim do turno, `CV` converte o empréstimo, `CR` conversor repetível, `MZ` multiplica a Zara, `IZ` Izzet óbvio.
   - Ezio: `A` Assassino no grimório, `FRC` freerunning próprio, `GY` usa cemitério, `ANY` gera qualquer cor.
   - Vermelhos: `TR` da tribo, `US` limpeza que poupa você, `WP` que mata você, `CR` compra recorrente, `RS` resposta instantânea, `HA` dá ímpeto, `MLD` terrenos em massa, `CBK` peça de combo, `OUT` saída de sacrifício, `PAY` pagador, `GC`.
6. **Reconcilie.** Corrija por substituição exata, com assert de ocorrência única. Nunca escreva "0 cartas" nem "0%": escreva "nenhuma" ou "zero".

### 6.3 Simulação de motor (padrão no modo profundo)

Goldfish guloso: 20 mil partidas por versão, na jogada, sem mulligan, sem oponente. Joga terreno, rocks (os de uso único como o Mana Vault contam só no turno em que entram), redutores, o comandante assim que der, depois o que o plano pede, do mais barato. Mede o turno em que o plano está montado, não o dano exato. Declare as hipóteses na análise.

Medidas que funcionaram:
- **Zur:** Zur conjurável até o turno N; ataques até 21 de dano de comandante (determinístico, com hipótese de mesa).
- **Zara:** Zara conjurável; ver um conversor repetível até o turno 6 (hipergeométrica).
- **Ezio:** WUBRG disponível no combate até o turno N, com casamento bipartido de cores e filtros.
- **Lathliss:** em campo até o turno N; fichas 5/5 até o turno 8; motor montado (comandante, pagador e duas fichas); cartas vistas.
- **Krenko:** ativando até o turno N (ímpeto um turno antes); combo montado (com Gamble e Goblin Engineer como tutores); horda no turno 8; cartas vistas.

**Antes de reportar, confira a lógica com uma partida à mão** (regra 21).

### 6.4 O cache de cartas

`cache_cartas_v2.3.json` tem o texto conferido de 482 cartas de hoje (Zur, Zara, Ezio, Lathliss, Krenko e todas as candidatas), com o deck de origem e o campo de Game Changer. Use antes de qualquer busca. Ao fim de cada sessão, gere a versão nova do cache com as cartas novas.

---

## 7. Erros que já aconteceram

Releia antes de entregar.

**De 14/10, tarde e noite:**
- **Profundidade cortada pela pressa.** A primeira entrega dos vermelhos saiu em modo rápido, com nota 8 e sem simulação de motor. Ele percebeu e pediu de novo. Na dúvida, modo profundo.
- **Varredura sem teto.** A do Zur levou 51 minutos e 248 buscas. Todo subagente tem teto.
- **Custo do comandante de memória no pedido ao subagente** (a Zara). Copie da fonte.
- **Simulador com a ordem errada** (o ímpeto do Krenko). Confira à mão antes de reportar.
- **Afirmação sobre a coleção sem conferir** (Ezio: escrevi que todas as cartas da coleção ficavam, e saíam cinco). Corrigi antes de entregar.
- **"Cinco saídas de sacrifício"** quando eram quatro de graça e duas pagas. Conte pela função exata.
- **Generalização sem base** ("o CMC mais alto da série"). Tirei antes de entregar.
- **Subagente que confunde tipo com função** (o Marvin como armadilha por não ser Goblin).

**De 14/10, manhã:**
- Reconstrução onde ele queria camadas (Kaalia).
- Atalho oferecido sem medir.
- Aviso de contexto cedo demais.
- Subagente que leu errado a lista.
- Premissa do próprio pedido ao subagente.
- Carta esquecida no `dados.py`.
- Ano de lançamento de memória.
- Corte de terreno sem repor.

**De 13/10 e antes:** contagem de terreno de cabeça; lista numerada repetida; eixo de proteção sumindo; primeira rodada tímida; número antes da conta; aceitar o nome que o dono dá à mecânica; chamar evasão de proteção; tutores de cabeça; limpeza de mesa para deck de mesa larga; ficha contada como tribo; não somar o efeito das trocas; cortar infraestrutura em nome do tema; inventar laço; dar nota a tudo e não discordar de nada.

---

## 8. Fichas de bolso

As fichas de Vito, Fynn, Marchesa, Strefan, Tovolar, Lathril, Evelyn, Tergrid, Tartarugas, Ken, Greymond, Lynde, Clavileño, Giada e Valgavoth estão na v2.1 e nos handovers próprios. As de Kaalia, Okaun, Wilhelt e K'rrik estão na v2.2 e nos handovers próprios. Todas continuam válidas. Abaixo, os cinco de hoje.

### Zur the Enchanter (Pedágio Arcano)

- **O que ele disse:** ideia antiga para retomar; política e negociação; controlar e taxar a mesa; não necessariamente vencer, mas deixar o jogo dinâmico.
- **Eixos dele:** Ramp, Draw, Removal (não-encantamentos), Removal (encantamentos), Tax, Proteção, Recursão + Goad, Sinergia.
- **A conta:** atacar, buscar, cobrar.
- **O que não pode se perder:** ele põe, não conjura; Aura posta ignora hexproof, shroud e ward; Sakashima copiando o Zur ganha o gatilho; o Wizard's Staff dobra a busca (o Zur é Wizard) e vai antes da primeira Aura, por causa do shroud da Greater Auramancy.
- **Achados:** seis cartas contra o plano (quatro limpezas que matam o Zur, Out of Time, Oppression); Wedding Ring + Sphinx; 7 terrenos pretos.
- **Onde discordei:** taxa não vence; pillow fort sem relógio deixa a mesa mais lenta, não mais dinâmica.
- **19 trocas em 4 camadas** (motor e fechamento, política, o Zur não se mata, mana). Nota 5,5 / 8.
- **Aberto:** "Removal (encantamentos)" é remoção em forma de encantamento? Rhystic Study como segundo Game Changer? Oppression é parte da graça?

### Zara, Renegade Recruiter (Empréstimo Compulsório)

- **O que ele disse:** montado para o irmão, como homenagem; deck de roubo para fugir do Izzet óbvio; pediu estratégia.
- **Eixos dele:** Ramp, Draw, Removal, Copia (spells), Tax + WinCon, Counter, Control (MonoBlue), Outros.
- **A conta:** espiar, emprestar, quitar. Sacrificar é a baixa do ativo do dono; piscar é converter o empréstimo em capital seu; copiar é ficar com os juros.
- **O que não pode se perder:** {3}{U}{R}, Human Pirate; a criatura volta à mão se o mesmo objeto estiver no campo; Thassa e Closet, ordenados por cima da devolução, a tornam sua (dedução).
- **18 trocas em 4 camadas** (quitar o empréstimo, mais Zara, roubo que fica, mana). Nota 5 / 8.
- **Aberto:** de quem são as decisões (dele ou do irmão)? A mesa aceita a leitura da Thassa?

### Ezio Auditore da Firenze (Requiescat in Pace)

- **O que ele disse:** coleção especial de Assassin's Creed, forfun, poucos slots; sem eixos nem estratégia.
- **Eixos criados:** Ramp e fixação, Compra, Remoção, Assassinos, Conexão, Freerunning, Proteção, Fechamento.
- **A conta:** conectar, correr, executar.
- **O que não pode se perder:** o WUBRG chega no combate até o turno 8 em 19% (35% com as trocas); Secluded Courtyard e Brotherhood Headquarters não pagam o gatilho; o Rest in Peace (pet) desliga seis cartas.
- **9 trocas, todas da coleção ou de mana.** Nota 6 / 7. As cartas da coleção ficam em 53.
- **Aberto:** o Rest in Peace fica? Quer o Sorin Markov (execução de duas cartas)?

### Lathliss, Dragon Queen (Ninhada Real)

- **O que ele disse:** pressão com Dragões; faltavam limpeza unilateral, compra recorrente e respostas. Depois: análise mais profunda, meta 10, não se importa com bracket.
- **Eixos dele:** Ramp, Draw, Removal, Sinergia 1, 2 e 3, Tesouro, Combate extra.
- **A conta:** descer, duplicar, queimar.
- **O que não pode se perder:** "outro Dragão não ficha"; changelings disparam; o combo Cleaver + Charger com a Lathliss como peça de poder 7.
- **Versão forte (25 trocas) e atalho (10).** Lathliss até o turno 6: 44% → 57%. Nota 6,5 / 8,5 (atalho 7,5). Cinco Game Changers.
- **Aberto:** forte ou atalho? Liberar três Mountains (pets) para mais mana rápida?

### Krenko, Mob Boss (Horda do Chefão)

- **O que ele disse:** pressão com muitos Goblins; as mesmas lacunas; meta 10, não se importa com bracket.
- **Eixos dele:** Ramp, Draw, Removal, Token, Combate + Dano Direto, Buff + Haste, Sinergia 1 e 2.
- **A conta:** dobrar, converter, recomeçar.
- **O que não pode se perder:** o Thornbite Staff com o Bombardment da lista é combo; três peças de combo com o Ashnod's Altar; o Marvin é um segundo Krenko; o Krenko é Warrior (equipar o Staff custa {4}).
- **Versão forte (29 trocas) e atalho (10).** Combo montado até o turno 8: zero → 18%. Nota 6,5 / 9 (atalho 8). Cinco Game Changers.
- **Aberto:** forte ou atalho? Liberar quatro Mountains (pets)? Separar o ímpeto do buff nos eixos?

---

## 9. O formato da entrega

Arquivo Markdown, com estas seções:

```
# Análise: <nome de painel> (<comandante>)
Analista | Data | Lista conferida | Cartas sem texto conferido
## Nota de partida      notas (tabela com hoje / forte / atalho no modo profundo); a descoberta principal; como li o pedido; por que não 10
## 1. Plano             leitura do comandante em tabela; a conta; onde a lista trai o plano; as três fases; o que manter na mão inicial
## 2. Agrupamentos      os eixos e a ressalva única
## 3. Carta a carta     uma tabela por tipo
## 4. Diagnóstico       antes e depois (três colunas no modo profundo); como medi; gerar e converter; combos; brackets
## 5. Linhas de jogo    motores, fechamentos, como fechar a mesa, o momento da jogada
## 6. Trocas            pares por camada, com coluna "no atalho"; quanto cada camada rende; o atalho; texto das entradas; banco; recusadas
## 7. Painel            três nomes, clima, paleta com hex, moldura, motivo
## 8. Dúvidas           fontes, suposições da simulação, pets que travam espaço, avaliações discutíveis
```

Junto, sempre: o handover do deck e a lista nova em `.txt`. No modo profundo, duas listas: `lista_forte_<deck>.txt` e `lista_atalho_<deck>.txt`. Com dois decks ou mais, um índice `LEIA-ME_<tema>.md`.

**Paletas e climas já usados**, para não repetir:

| Painel | Clima |
|---|---|
| Ritos de Sangue (Clavileño) | Gótico escuro, vermelho e preto |
| Dízimo da Rosa (Vito) | Sacristia: ouro velho, marfim e rosa sobre vinho |
| Dez Gotas (Fynn) | Floresta fria: musgo, osso e verde-peçonha |
| Longa Vida à Rainha (Marchesa) | Corte de Paliano: azul-noite, carmesim e ouro |
| Brinde Carmesim (Strefan) | Gravura em preto e branco com um vermelho só |
| Noite Sem Dia (Tovolar) | Ardósia, âmbar de lua, musgo, ferrugem e osso |
| Dez por Dez (Lathril) | Verde-pinho, ameixa, ouro-folha, casca negra e pergaminho |
| Céu, Inferno e Fogo (Kaalia) | Tríptico de altar: osso, brasa, ônix, ouro-pálido, cinza-tempestade |
| Cara, Eu Ganho (Okaun) | Cassino em Ravnica: verde-feltro, ouro-moeda, azul-faísca, vermelho-ciclope, marfim |
| Cutelo e Cova (Wilhelt) | Cemitério alagado: musgo-cadáver, azul-afogado, osso, sangue seco, breu |
| Dízimo de Sangue (K'rrik) | Oficina phyrexiana: óleo-negro, cobre oxidado, carne-viva, cinza-cirúrgico, marfim-osso |
| Pedágio Arcano (Zur) | Gabinete de Esper: etério #5C8DB8, prata-vidro #C7D0D8, nanquim #161A24, lacre-ameixa #5E2E4F, papel-selo #EFE7D4 |
| Empréstimo Compulsório (Zara) | Casa de penhores pirata: azul-abismo #12263A, latão-velho #B08D57, brasa-de-pólvora #C4472F, ferrugem-de-casco #6B4A3A, papel-de-penhor #E8DCC2 |
| Requiescat in Pace (Ezio) | Florença à noite: terracota #A4472B, ocre-afresco #C8873E, branco-capuz #EEE7DA, cinza-pedra #4B4F54, noite-de-Arno #1C2230 |
| Ninhada Real (Lathliss) | Covil vulcânico: obsidiana #17120F, brasa #D9480F, ouro-de-tesouro #E0B44C, escama-carmim #7A1F1A, cinza-vulcânico #6E6A66 |
| Horda do Chefão (Krenko) | Oficina goblin: ferrugem #9A4A1F, fuligem #2A2522, laranja-faísca #F28C28, verde-goblin #6C8A3C, papel-de-ordem #E9DFC9 |

---

## 10. O que não fazer

- Construir painel, dashboard ou HTML do deck.
- Inventar texto de carta, preço, regra, ano ou custo de comandante.
- Recomendar carta só por ser forte, ou só por ser popular.
- Esconder discordância para agradar, ou dar 10 sem teste.
- Entregar a análise só no corpo da conversa.
- Perguntar orçamento, bracket ou cartas de estimação.
- Cortar pet, inclusive básico foil.
- Mexer no tema central de um precon ou coleção especial que ele quer preservar.
- Insistir num ajuste de eixo depois que ele decidiu.
- Repetir o aviso de contexto a cada deck.
- **Usar o modo rápido quando ele pede profundidade.**
- **Rodar subagente sem teto de buscas.**
- **Reportar número de simulador sem conferir a lógica.**

---

## 11. Fila sugerida

1. **O deck especial**, em chat novo, com este arquivo, o cache e a frase da seção 0. Pergunte (ou leia no texto) se é para modo profundo; pela palavra "especial", provavelmente é.
2. **Decisões dos vermelhos:** forte ou atalho; liberar Mountains foil para mana rápida.
3. **Testes de dez mãos**, na ordem em que decidem mais:
   - Krenko forte (confirma o combo e o 9);
   - Lathliss forte (confirma a velocidade);
   - Kaalia enxuta, K'rrik, Okaun;
   - depois Zur, Zara e os demais.
4. **Perguntas abertas** dos handovers de hoje: Zur (eixos, Rhystic, Oppression), Zara (de quem são as decisões, leitura da Thassa), Ezio (Rest in Peace, Sorin).
5. **Evelyn:** análise completa.
6. **Notas e nomes de painel** de todos os decks marcados como "sugerido".
7. **Gravar os arquivos** em `dados\` e rodar o `/novo-deck` no Claude Code.
8. **Atualizar o cache** ao fim de cada sessão.
