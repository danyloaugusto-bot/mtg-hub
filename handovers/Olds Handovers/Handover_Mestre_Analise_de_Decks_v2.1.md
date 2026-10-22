# Handover Mestre: análise de decks de Commander

Versão 2.1, de 13/10/2026. Substitui a v2.0 e o handover da sessão de 13/10. Os handovers por deck continuam valendo como anexos de detalhe.

Este documento basta para um chat novo analisar qualquer deck do Danylo, ou retomar um dos quinze já analisados, sem reler nenhuma conversa anterior.

**O que mudou da v2.0 para a v2.1:**

- O painel de situação ganhou cinco decks: Tergrid, Tartarugas, Evelyn, Tovolar e Lathril.
- A reconstrução passou a ser o padrão. Ele gostou da profundidade e pede isso por padrão.
- Há uma linha de montagem nova com três scripts (seção 6.2) e cinco lições de leitura de regra (seção 3.2).
- Duas correções de contagem: a Evelyn tem 35 terrenos, não 34, e o Doors of Durin não é carta dupla.

---

## 0. Em 60 segundos

**Para o Danylo.** Abra um chat novo, anexe este arquivo e cole a frase abaixo, trocando o que está entre colchetes. Para retomar um deck, anexe também o handover e a análise dele.

> Você está recebendo o Handover Mestre v2.1 de análise de decks de Commander. Leia inteiro antes de responder. Tarefa de hoje: [analisar o deck novo abaixo / refinar o deck X / comparar decks]. Quanto você pode mexer: [pouco, só trocas pontuais / muito, quero a lista mais forte possível]. Não mexer em: [base de mana / cartas de estimação / nada]. Entrega: arquivo de análise em Markdown e handover do deck atualizado.

A linha "quanto você pode mexer" existe por causa do Strefan: a primeira rodada propôs doze trocas, e a resposta foi "ainda não achei forte o suficiente". Diga a ambição logo de saída e a primeira entrega já vem no tamanho certo.

**O padrão desde 13/10 é a reconstrução.** No Tovolar e na Lathril, ele pediu "seja criativo" e "forte em primeiro lugar". A entrega com lista completa, conta do deck e antes e depois foi a que ele aprovou ("gostei das análises mais profundas e que fazem muito mais sentido"). Na dúvida, entregue a reconstrução e ofereça o atalho das dez trocas mais fortes.

**Para o analista.** A ordem de leitura que rende mais:

1. Seção 1, para saber em que pé está cada deck.
2. Seção 2, para saber com quem você está falando.
3. Seção 3, o método. As seções 4 a 7 são consulta.
4. Seção 8, a ficha do deck em que você vai trabalhar.

---

## 1. Painel de situação

Quinze decks analisados até hoje. O placar só compara um deck com ele mesmo.

| Deck | Comandante | Cores | A conta do deck | Estado | Placar | Nome de painel |
|---|---|---|---|---|---|---|
| Clavileño | Clavileño, First of the Blessed | WB | atacar, morrer, voltar | Análise feita, painel pronto | n/d | Ritos de Sangue |
| Giada | Giada, Font of Hope | W | descer, crescer, proteger | Análise feita, painel pronto | n/d | Coro da Alvorada |
| Valgavoth | Valgavoth, Harrower of Souls | BR | (ver handover próprio) | Análise feita, painel a gerar | n/d | a definir |
| Ken | Ken, Burning Brawler | R W | equipar, acertar, repetir | Análise feita em 08/10 | 367 | Round Extra (sugerido) |
| Greymond | Greymond, Avacyn's Stalwart | W | povoar, fortalecer, atacar | Análise feita em 08/10 | 339 | Vigília de Thraben (sugerido) |
| Lynde | Lynde, Cheerful Tormentor | UBR | amaldiçoar, repassar, desgastar | Análise feita em 08/10 | 303 | Roga-Praga (sugerido) |
| Vito | Vito, Thorn of the Dusk Rose | B | acelerar, sangrar, fechar | Análise feita em 09/10, aguarda nota | 372 | Dízimo da Rosa (sugerido) |
| Fynn | Fynn, the Fangbearer | G | morder, marcar, proliferar | Análise feita em 09/10, 4 perguntas abertas | 348 | Dez Gotas (sugerido) |
| Queen Marchesa | Queen Marchesa | RWB | blindar, coroar, executar | Análise feita em 09/10, 4 perguntas abertas | 315 | Longa Vida à Rainha (sugerido) |
| Strefan | Strefan, Maurer Progenitor | BR | sangrar, engarrafar, soltar | Rodada 2 entregue em 11/10 | 326 atual, 399 na lista nova | Brinde Carmesim (sugerido) |
| Tergrid | Tergrid, God of Fright | B | (ver handover próprio) | Reconstrução em 13/10; nota 5,5 hoje e 8,5 projetada | 326 / 383 | Lanterna do Medo (sugerido) |
| Tartarugas | Leonardo, the Balance + Michelangelo, the Heart | WUBRG | (ver handover próprio) | Reconstrução em 13/10; nota 6 hoje e 9 projetada | 412 / 453 | Cowabunga (sugerido) |
| Evelyn | Evelyn, the Covetous | UBR | a definir | **Só o ponto de controle.** Três perguntas abertas | n/d | a definir |
| Tovolar | Tovolar, Dire Overlord | RG | uivar, conectar, comprar | Reconstrução em 13/10; nota 5 hoje e 8,5 projetada | 338 / 452 | Noite Sem Dia (sugerido) |
| Lathril | Lathril, Blade of the Elves | BG | semear, virar, drenar | Reconstrução em 13/10; nota 6,5 hoje e 9 projetada | 327 / 359 | Dez por Dez (sugerido) |

Pendências que valem para todos:

- Nenhum arquivo desta série foi gravado em `C:\Projetos\mtg-hub\dados\`. O Danylo salva à mão, ou conecta a pasta e pede a gravação.
- Ele ainda não escolheu nome de painel nem deu nota para Ken, Greymond, Lynde, Vito, Fynn, Marchesa, Tergrid, Tartarugas, Tovolar e Lathril.
- Greymond, Lynde, Fynn, Marchesa e Strefan estão sem capa. A moldura do painel fica em aberto até ela chegar.
- O teste das dez mãos está pendente em Strefan, Tergrid, Tartarugas, Tovolar e Lathril.

**Arquivos produzidos.**

- **Em 09 e 11/10:** `analise-claude-vito.md`, `analise-claude-fynn.md`, `Handover_Fynn_Analise_de_Deck.md`, `analise-claude-marchesa.md`, `Handover_Marchesa_Analise_de_Deck.md`, `analise-claude-strefan.md`, `analise-claude-strefan-rodada2.md`, `Handover_Strefan_Analise_de_Deck.md` (v1.1).
- **Em 13/10:**
  - Tergrid: `analise-claude-tergrid.md`, `Handover_Tergrid_Analise_de_Deck.md`, `lista_nova_tergrid.txt`.
  - Tartarugas: `analise-claude-tmnt.md`, `Handover_TMNT_Analise_de_Deck.md`, `lista_nova_tmnt.txt`.
  - Evelyn: `Handover_Evelyn_Ponto_de_Controle.md`, `evelyn_lista.txt`.
  - Tovolar: `analise-claude-tovolar.md`, `Handover_Tovolar_Analise_de_Deck.md`, `lista_nova_tovolar.txt`.
  - Lathril: `analise-claude-lathril.md`, `Handover_Lathril_Analise_de_Deck.md`, `lista_nova_lathril.txt`.

---

## 2. Com quem você está falando

O Danylo é diretor de FP&A, matemático de formação e contador. Tem cerca de 25 decks, em cinco grupos: 01. Top, 02. Tribais, 03. Caos, 04. Forfun, e Compras + Precon. O projeto dos painéis fica em `C:\Projetos\mtg-hub`, com uma pasta por deck em `dados\XX. Nome\`.

**Como ele quer ser atendido:**

- Resposta direta, com o motivo escrito. Sem bajulação. Discorde quando houver razão, e diga onde.
- Português do Brasil, nomes das cartas em inglês. Texto humano, sem excesso de símbolos.
- Números com hipótese declarada. Ele confere contas.
- Analogias de finanças ajudam quando são exatas. Exemplos que funcionaram: a vida como capital de giro no Vito; gerar contra converter em todos os decks.
- Refina por rodadas: "7/10", "revise", "ainda não achei forte". Leia como pedido de mais rigor ou mais ousadia, não de mais texto.

**O que é fixo em todo deck:**

- **Orçamento sem teto.** Nunca pergunte.
- **Os agrupamentos são dele.** Em geral chegam prontos, oito eixos. Proponha ajuste uma vez, com o motivo. Se ele mantiver, siga e registre a ressalva uma única vez, na seção de dúvidas.
- **Três fases:** início, meio e fim. Ele descreve a estratégia de cada uma e quer vê-la confrontada com a lista.
- **Cartas de estimação** nunca entram na fila de corte. Quando ele não dá a lista nominal, pergunte ou assuma e declare.
- **Você não constrói painel nem HTML.** O painel sai de um motor único no Claude Code, a partir da sua análise e das de outras IAs. Sua parte criativa é propor nome, clima, paleta e motivo gráfico.

**O que esta sessão ensinou sobre ele:**

- Ele pede entrega direta com frequência ("faça seu melhor", dois decks de uma vez). Quando pedir, não trave num ponto de controle: entregue, e transforme cada decisão que seria dele em suposição declarada e em pergunta no handover.
- Quando diz "quero que seja um dos mais fortes", quer a lista reconstruída, não doze trocas.
- Quando diz "não sei se precisa mexer em X", não mexa em X. Diga em uma frase se discorda e siga.
- Gosta dos nomes de painel e de material de apoio visual. Ele manda guias de terceiros como espelho: confronte-os contra o texto das cartas.
- Manda links do Scryfall e do edh.wiki junto com a lista. O Scryfall não abre daqui, então use o slug no json.edhrec. O edh.wiki abre e serve de primeira leitura do comandante.
- Quando diz "não quero cair no comum", quer o plano que só aquele comandante tem. Na Lathril, era trocar o combate pelo dreno da habilidade. Ache esse plano e diga com todas as letras que o plano dele é o da mesa ao lado.
- Quando diz "mantenha meus eixos", siga com eles mesmo que falte um, e registre a ressalva uma vez. Na Lathril faltava proteção, e ela foi notada em "Untap + Sinergia".
- Quando um eixo dele é ambíguo, como Ramp e Ramp2, assuma uma leitura, declare no topo e siga.
- Às vezes manda um handover só para você "estar preparado". Nesse caso, não comece análise: confirme em duas linhas e espere o deck.

---

## 3. O método

### 3.1 A pergunta que decide tudo

A carta é boa, ou é boa **neste comandante**?

### 3.2 Os nove passos

**Passo 1. Conferir a lista, por script.** São 100 cartas com o comandante? Há repetida que não seja básico? Tudo dentro da identidade de cor? Há banida? Quantas fontes de terreno, somando as cartas duplas com terreno no verso? Conte com código, nunca de cabeça. Um subagente já devolveu 99 onde havia 100.

**Passo 2. Ler o comandante palavra por palavra, com as regras oficiais.** É aqui que os decks se decidem. Leituras que mudaram análises inteiras:

| Deck | O que o dono achava | O que o texto diz |
|---|---|---|
| Fynn | "Infectar" | Dois marcadores fixos por criatura que conecta. O tamanho da criatura não muda nada |
| Strefan | Sangue quando bate nos oponentes | "Cada jogador que perdeu vida" inclui ele mesmo, e conta jogadores, não pontos |
| Strefan | O Vampiro entra atacando | Entra atacando sem ter sido declarado: gatilho de "quando atacar" não dispara |
| Vito | O laço é uma opção | Os gatilhos são obrigatórios. Com as peças em campo, o laço acontece |
| Tovolar | A noite fica | A noite que ele força é dele. Duas mágicas de qualquer jogador viram o dia no turno seguinte |
| Tovolar | "Transforme Human Werewolves" vale para todos | Só vira lobisomem antigo de Innistrad; Daybound só muda pela regra do dia e da noite |
| Tovolar | Golpe duplo é só dano | São dois eventos de dano de combate: gatilho de "causa dano a jogador" dispara duas vezes |
| Lathril | Os dez Elfos precisam estar prontos | "Virar dez Elfos" não usa o {T} deles. Ficha recém-criada paga (ruling de 05/02/2021). Ela não conta entre os dez |
| Lathril | O plano é atacar | O comandante paga por desvirar, não por combate. O Dionus reaproveita os mesmos dez Elfos |

**Passo 3. Achar a conta do deck.** Uma frase de três verbos e, se der, uma equação. É a contribuição nova desta versão. Exemplos:

- Strefan: fichas por turno é igual ao número de jogadores que perderam vida no turno dele.
- Fynn: quinze conexões matam a mesa, e cada proliferar com os três marcados vale uma conexão e meia.
- Vito: com cinco tutores, a peça do laço está ao alcance em 70% dos jogos até o turno 8.
- Marchesa: sete dos dez fechamentos pedem quatro voltas ou mais.
- Tovolar: três lobos na manutenção garantem a noite; cada lobo que conecta compra uma carta.
- Lathril: quatro ativações matam a mesa, e cada uma pede a Lathril desvirada e mais dez Elfos.

Quando a conta aparece, o resto da análise se organiza em volta dela.

**Passo 4. Confrontar o plano dele com a lista.** Escreva onde a lista trai o plano, em ordem de gravidade. Depois a tabela das três fases: o que ele descreveu, o que a lista entrega, avaliação.

**Passo 5. Avaliar carta a carta.** Nota de 0 a 3 em cada eixo, tier, relevância, o que faz, por que aqui, em que fase rende e com que cartas conversa. Tudo montado por script, para as contagens do diagnóstico saírem dos mesmos dados.

**Passo 6. Diagnosticar.** Contagens contra as faixas, e principalmente o desequilíbrio entre **gerar e converter**. Em todo deck até hoje, um dos dois lados sobrava:

| Deck | Gera | Converte |
|---|---|---|
| Clavileño | Muita morte | Duas cartas viravam morte em dano |
| Ken | 17 combates extras | 6 ramps e 8 compras |
| Greymond | Corpos fortes | Quase nada fazia o dano chegar |
| Lynde | Muita compra | Cinco fechamentos |
| Vito | 30 fontes de ganho de vida | Quatro conversores, um deles o comandante |
| Fynn | Onze corpos com toque mortífero | Uma evasão em massa |
| Marchesa | Duas cartas por turno | Fechamentos lentos |
| Strefan | Doze destinos para o Sangue | Cinco pings baratos para gerá-lo |
| Tovolar | 21 lobos no grimório | 9 cartas de evasão; 70% de ver uma até o turno 6 |
| Lathril | 32 Elfos e muitas fichas | 6 cartas que desviram a comandante |

Inclua também: risco de concentração no comandante, anti-sinergias pelo nome, poder e brackets, distribuição de tier e relevância, placar. Em deck com laço, as duas contas: com combo e limpo.

**Procure combo que já está na lista dele**, mesmo que ele não fale em combo. A Lathril tinha dois combos de mana infinita de duas cartas (Umbral Mantle e Staff of Domination com elfos de mana), e isso põe o deck na fronteira do Bracket 4. Avise e deixe a decisão com ele.

**Procure anti-sinergia de tipo.** O Seedborn Muse é Spirit, e o Ruthless Winnower e o Crippling Fear da mesma lista o matavam. Num tribal, toda carta que não é da tribo deve ser testada contra os efeitos "não-[tribo]" da própria lista.

**Passo 7. Combos e linhas.** Combos de verdade, motores e fechamentos, separados. Confira cada combo numa fonte. Se não há combo, diga.

**Passo 8. Cortes e entradas.** As dez primeiras a sair, com motivo. De 8 a 15 cartas de fora, com veredito, motivo, quem sai e o que muda. Inclua o que recusou, para a carta não voltar à mesa a cada coleção. Some o efeito de todas as trocas numa tabela de antes e depois.

**Passo 9. Painel, dúvidas e handover.** Três nomes e o escolhido, clima, paleta de cinco cores, moldura, motivo gráfico. Depois a seção de dúvidas e o handover do deck.

### 3.3 A varredura em três frentes

A primeira rodada do Strefan olhou as listas de sinergia e achou cartas boas. A segunda fez três buscas por texto e achou as cartas que mudaram o deck. Faça as três desde o início quando ele pedir força:

1. **Todas as cartas da mecânica central**, por busca de texto, com veredito para cada uma. No Strefan eram 43 de Sangue.
2. **A tribo nas coleções recentes**, coleção por coleção, até a data de hoje.
3. **Os pagadores laterais**: cartas de qualquer época que pagam pelo que a mecânica faz por tabela. A ficha de Sangue sacrifica um artefato e descarta uma carta, e era aí que estavam Spear Spewer, Agent of the Iron Throne e Monument to Endurance.

### 3.4 Duas rodadas, dois tamanhos

| Rodada | Quando | O que entrega |
|---|---|---|
| Diagnóstico | Deck novo, ou "analise" | As nove seções, com 8 a 15 trocas |
| Reconstrução | "Quero mais forte", "busca do 10" | Lista completa de 100 cartas, tabela de sai e entra com a função de cada entrada, antes e depois por script, veredito de tudo o que foi considerado, banco de reservas em ordem |

### 3.5 A nota e o teste

Quando ele pedir nota, dê a de execução da proposta, de 0 a 10, separando três coisas:

- **Atual:** o que a lista é hoje.
- **Projetada:** o que as trocas fariam. Marque sempre como projeção sem partida.
- **Testada:** só depois de jogar.

Não dê 10 a uma lista que nunca foi embaralhada. Ofereça o teste das dez mãos: dez mãos iniciais jogadas sozinho até o turno 6, com três ou quatro medidas e uma meta para cada. As medidas saem da conta do deck. No Strefan: turno em que o comandante entra, fichas no fim desse turno, turno do primeiro Vampiro posto em campo, mãos em que faltou terreno.

### 3.6 Como conduzir

- **Um deck por conversa, de preferência.** A sessão de 11/10 carregou cinco decks e a de 13/10 carregou quatro. Funcionou porque tudo vivia em arquivo e script, mas o risco sobe. A partir do segundo deck completo, avise com a frase da preferência dele ("⚠️ Contexto elevado — risco de alucinação aumentando. Recomendo criar um handover") e ofereça o handover. Se ele disser para seguir no mesmo chat, siga.
- **Ponto de controle** quando ele não pedir pressa: conferência, plano em uma frase, onde a lista diverge, ajuste de eixos que você faria, até três perguntas. Espere a resposta.
- **Sem ponto de controle** quando ele pedir entrega direta: suposições declaradas no topo e na seção de dúvidas.
- Feche na conversa com: diagnóstico em tabela curta, as três coisas que mudaria primeiro, onde discorda dele, a avaliação de que tem menos certeza, o nome de painel. Não repita o arquivo.

---

## 4. Escalas

**Nota por eixo**

| Nota | Significa |
|---|---|
| 0 | Não faz |
| 1 | Faz de passagem |
| 2 | É função da carta |
| 3 | É referência no deck |

Terreno que sempre entra virado leva −1 em Ramp. Carta de estimação soma 1 em Sinergia.

**Tier, a força neste deck:** S define o deck; A titular; B cumpre o papel; C substituível; D fora de lugar.

**Relevância, a permanência:** INS nunca sai; ALT só sai por algo claramente melhor; MÉD trocável; BAX primeira a sair.

Tier não é a soma das notas. Em 100 cartas, espere perto de 20 INS, 40 ALT, 30 MÉD e 8 a 10 BAX. Se quase tudo sai S ou INS, a régua está frouxa.

**Faixas do diagnóstico**

| Item | Faixa |
|---|---|
| Fontes de terreno | 35 a 37 |
| Ramp dedicado (nota 2 ou 3) | 10 a 12 |
| Compra dedicada | 10 a 12 |
| Remoção | 8 a 12, com 3 a 5 em massa |

São regra de bolso. Quando o deck se afasta de propósito, diga que é de propósito.

**Placar:** pontos do CMC médio (5 se abaixo de 2; 4 abaixo de 3; 3 abaixo de 4; 2 abaixo de 5; senão 1), mais aceleração (soma das notas de Ramp dividida pelo CMC médio; cada 0,5 vale 5 pontos; teto de 90), mais a soma de todas as notas.

**Crivo para os eixos dele.** Proponha ajuste só onde o eixo falhar num destes:

- Mede uma função? "Faz duas coisas" não é função.
- Os eixos se somam? Dois eixos excludentes fazem a nota de um premiar a falta do outro.
- Terá mais de meia dúzia de cartas?
- Há eixo para o que o deck mais precisa medir? Em quatro dos cinco decks desta sessão, faltou um eixo de proteção ou de evasão.

**Régua de calibração**

| Carta (deck) | Tier | Relev. | O que ensina |
|---|---|---|---|
| Toxic Deluge (Clavileño) | S | INS | Especialista pode ser S com 3 pontos |
| Black Market Connections (vários) | S | INS | Staple genérica é infraestrutura, não corte |
| March of the Canonized (Clavileño) | C | BAX | Soma 6 pontos e é a primeira a sair: lenta |
| Relentless Assault (Ken) | C | BAX | Muita sinergia no site, e não funciona com o comandante |
| Curse of Misfortunes (Lynde) | S | INS | Uma palavra do texto faz dela o motor |
| Necrodominance (Vito) | C | BAX | Carta forte que desliga dez cartas da própria lista |
| Preposterous Proportions (Fynn) | C | BAX | Nota alta no eixo e zero no que o comandante lê |
| Descent into Avernus (Marchesa) | C | BAX | Dá aos oponentes a mana para furar a sua defesa |
| Spear Spewer (Strefan) | S | INS | Um 0/2 de uma mana pode ser a melhor carta do deck |
| Wound Reflection (Strefan) | C | BAX | Dobrar pouco por seis manas |

---

## 5. Regras de verdade

1. **Texto de carta nunca de memória.** Nesta sessão, todo texto veio de busca. Se não der para buscar, liste a carta na seção de dúvidas e marque "(texto de memória)".
2. **Regra do jogo também se confere** antes de chamar algo de combo.
3. **Carta dupla com terreno no verso conta como fonte de terreno** e nunca é cortada como mágica.
4. **Número de site mede presença, não força.** A carta mais usada nas listas do Strefan, com 86%, ficou de fora.
5. **Concordar com outra IA ou com um guia não prova nada.** Confira cada afirmação contra o texto.
6. **Leia o comandante com as regras oficiais dele.** Se a carta tem poucas, busque a regra de uma carta com as mesmas palavras, e diga que é analogia.
7. **Condição de tempo se lê palavra por palavra.** "Depois desta fase principal", "na sua manutenção", "no seu fim de turno".
8. **Teste o bônus do comandante contra as checagens da lista.**
9. **"Cada jogador" não é "cada oponente", e "perdeu vida" não é "quanto perdeu".**
10. **Gatilho obrigatório não é opção.** Verifique se há "pode" no texto antes de dizer que o dono escolhe.
11. **"Entra atacando" não é "atacou".**
12. **Separe o que é texto, o que é regra oficial e o que é leitura sua.** A seção de dúvidas existe para isso, e ele lê.
13. **Suas afirmações anteriores também se conferem.** Se a entrega contradiz o que você disse antes, diga no topo.
14. **Todo número do texto sai do script ou é reconciliado com ele.** Ver seção 7.

---

## 6. Caixa de ferramentas

### 6.1 Fontes que funcionam, em 11/10/2026

| Para quê | Fonte | Observação |
|---|---|---|
| Texto atual da carta | `json.edhrec.com/cards/<slug>` | Espelha o Scryfall. Slug em minúsculas, hifens, sem apóstrofo nem vírgula |
| Inclusão, sinergia, cartas novas | `json.edhrec.com/pages/commanders/<slug>.json` | O arquivo é cortado: peça uma seção por busca |
| Tema ou tribo | `json.edhrec.com/pages/tags/<tema>.json` | `typal/vampires.json` deu erro |
| Busca por texto, até a coleção mais recente | `archidekt.com/api/cards/v2/?oracleText=...&subTypes=...&editions=...&colors=Black,Red&unique=true&pageSize=25&page=N` | A melhor descoberta da sessão. `orderBy` quebra a consulta |
| Regras oficiais por carta | `api.magicthegathering.io/v1/cards?name="..."` | Redação antiga, dados até meados de 2024 |
| Regras oficiais de cartas novas | `grimoria.app/cards/<slug>` | Símbolos de mana às vezes errados; confie no valor de mana |
| Regras Abrangentes | `mtg.wiki/page/<Mecânica>` | Usado para a regra 724, do monarca |
| Combos | `edhrec.com/combos/<cores>/<ids>` | Espelha o Commander Spellbook |
| Impressões e numeração | `mtg.wiki/page/<SET>` | Usado para a série Drácula |
| Presença e cartas novas | `edh.wiki/commanders/<slug>/<tema>/` | Abre direto, mas anda atrasado em relação ao EDHREC |

**Não funcionam daqui:** Scryfall e Gatherer. O mtg.wtf responde uma ou duas vezes e bloqueia. O curl do terminal passa por um proxy que bloqueia json.edhrec e archidekt, então use sempre a ferramenta de leitura web, e mande os subagentes fazerem o mesmo.

**Fontes que também funcionaram em 13/10:**

- `grimoria.app/cards/<slug>` para rulings (Tovolar e Lathril).
- `commanderspellbook.com/combo/<ids>` para combos.
- `mtg.wiki` para dia e noite, enjoo de invocação e brackets.
- `scrollvault.net/guides/game-changers.html`, que conferiu a lista de Game Changers em 11/10/2026.

O EDHREC trocou a seção "High Synergy" por "High Lift".

**O truque da citação.** A ferramenta de leitura resume em vez de citar quando o trecho passa de uns 125 caracteres. Peça o texto "literal, em trechos numerados de até 90 caracteres" e junte. Sem isso, o que volta é paráfrase.

**Coleções de 2026 até hoje:** Lorwyn Eclipsed (23/01), Teenage Mutant Ninja Turtles (06/03), Secrets of Strixhaven (24/04), Marvel Super Heroes (26/06), The Hobbit (14/08), Reality Fracture (02/10). Star Trek sai em 13/11.

**Game Changers:** lista de 09/02/2026, com 53 cartas; a última inclusão foi Farewell e Biorhythm. Bracket 3 admite até três. O anúncio de 12/10/2026 mexeu só no Brawl competitivo, e o próximo B&R é em 30/11/2026.

- Craterhoof Behemoth **não** é Game Changer.
- Seedborn Muse, Bolas's Citadel e Gaea's Cradle são.
- Contagem por deck: Vito tem cinco, Strefan quatro (três na lista nova), Tergrid 15 na lista nova, Marchesa dois, Fynn nenhum, Tovolar nenhum, Lathril três na lista nova.

**Bracket 3 e combo:** o texto do mtg.wiki proíbe combo infinito de duas cartas montado cedo de propósito. Não achei o artigo oficial de fevereiro de 2026.

**Coleções de 2026 com tribo relevante:**

- Lorwyn Eclipsed (23/01): o grande pacote de Elfos pretos e verdes, como High Perfect Morcant e Morcant's Loyalist.
- The Hobbit (14/08): lobos como Bejeweled Warg e Wargling.
- Reality Fracture (02/10): Edgar, Moonlit Sovereign.

### 6.2 A linha de montagem

O que tornou possível analisar cinco decks numa sessão sem perder a mão, e que em 13/10 virou rotina de cinco subagentes e três scripts:

1. **Grave a lista num arquivo e conte por script.**
2. **Delegue a busca de texto a subagentes, em paralelo**, cada um com uma tarefa fechada:
   - conferir o texto de todas as cartas da lista e as regras do comandante;
   - buscar o radar: sinergias, cartas novas, Game Changers, combos;
   - na rodada de reconstrução, a varredura em três frentes.
   Mande cada um gravar o detalhe num arquivo e devolver uma linha por carta. Exija "NÃO CONFERIDO" no lugar de palpite, e a lista do que não conseguiu ler.
3. **Monte a análise num script.** Cada carta é uma linha de dados com tipo, valor de mana, notas, tier, relevância e os textos. As tabelas, as contagens, a curva, o placar e as probabilidades saem dali.
4. **Reconcilie.** Imprima as contagens do script e confira cada número escrito à mão no texto contra elas. Corrija por substituição exata, com verificação de que o trecho existia uma vez só.
5. **Probabilidades** por hipergeométrica, com a hipótese escrita: 99 cartas, mão de sete, uma compra por turno, sem mulligan.

Esqueleto mínimo do script:

```python
from math import comb
def p(acertos, vistas, N=99):            # chance de ter ao menos um
    return 1 - comb(N-acertos, vistas)/comb(N, vistas)

C = []                                    # uma linha por carta
def c(nome, tipo, mv, notas, tier, rel, faz, porque, fase, conversa, q=1):
    n = [int(x) for x in notas.replace('−','-').split('·')]
    C.append(dict(nome=nome, tipo=tipo, mv=mv, n=n, tier=tier, rel=rel,
                  faz=faz, porque=porque, fase=fase, conv=conversa, q=q))

# ... todas as cartas ...
assert sum(x['q'] for x in C) == 100
dedicado = lambda eixo, corte=2: [x['nome'] for x in C if x['n'][eixo] >= corte]
```

Na rodada de reconstrução, a lista nova é a lista atual menos os cortes mais as entradas, com as mesmas colunas. Assim o antes e depois sai dos mesmos dados.

**A rotina de 13/10**, que rendeu as análises de que ele mais gostou:

1. **Contar a lista por script** antes de responder, no ponto de controle.
2. **Disparar quatro subagentes em paralelo.** Cada um grava um arquivo:
   - texto da primeira metade da lista (`textos_1.md`);
   - texto da segunda metade (`textos_2.md`);
   - regras do comandante, rulings, combos e Game Changers (`regras.md`);
   - varredura em três frentes com os dados do EDHREC (`varredura.md`).
3. **Escolher as entradas e disparar um quinto subagente** só para conferir o texto delas (`textos_entradas.md`).
4. **Montar três scripts:**
   - `dados.py`: uma linha por carta, com as listas C e E, `CORTES` e asserts de 100 cartas;
   - `stats.py`: contagens por eixo, placar e hipergeométrica;
   - `gerar.py`: preenche os marcadores de um `analise_tpl.md` com as tabelas. Ele tem um assert de que a tabela de pares sai e entra bate com `CORTES` e com as entradas.
5. **Escrever a prosa no modelo com os números do `stats.py`.** Depois, corrigir o modelo por substituição exata, com assert de ocorrência única.
6. **Marcar as cartas que destravam a conta com flags próprias**, para medir a conta e não só os eixos. Exemplos: `W` para Wolf ou Werewolf, `H` para lobisomem antigo, `EL` para Elfo, `LU` para "desvira a comandante".

---

## 7. Erros que já aconteceram

Releia antes de entregar.

**Desta sessão:**

- **Primeira rodada tímida.** Doze trocas quando ele queria o deck mais forte possível. Pergunte a ambição no início, ou entregue as duas versões.
- **Número escrito antes da conta.** "Seis pedras" eram quatro; "bem servida" virou "razoável" quando a probabilidade saiu em 44%; "nove criaturas fora da tribo" eram onze. Escreva o adjetivo depois do número.
- **Exemplo dado antes da decisão dele.** Dei notas de exemplo nos eixos do Vito e ele manteve os eixos como estavam. Corrigi no topo da entrega.
- **Aceitar o nome que o dono dá à mecânica.** "Infectar" no Fynn.
- **Chamar de proteção o que é evasão.** Shizo, no handover do Vito.
- **Tutores contados de cabeça.** Eram cinco, não quatro: carta modal também busca.
- **Subagente que errou a soma da lista.**

**De 13/10:**

- **Contagem de terreno de cabeça.** A Evelyn tinha 35 terrenos, não 34, e o Doors of Durin foi contado como carta dupla sem ser. Conte por script e só chame de carta dupla o que a busca confirmou.
- **Lista numerada com número repetido** num rascunho. Releia a numeração antes de entregar.
- **Assumir que o subagente leu certo.** Um subagente escreveu "iniciativa" onde o texto era "golpe inicial" (Kruin Outlaw). Confira no arquivo dele as cartas que decidem a análise.
- **Fazer o eixo de proteção sumir.** Quando os eixos do dono não medem proteção, diga onde ela foi notada e conte as peças à parte.

**Das sessões anteriores:**

- Dizer que o comandante paga por uma carta sem ler quando ela funciona (Ken).
- Esquecer o bônus do comandante ao avaliar a compra (Greymond).
- Recomendar limpeza de mesa a deck de mesa larga.
- Contar ficha como se fosse da tribo.
- Aceitar o medo do dono sem testar.
- Recomendar carta forte que resolve o que não é o gargalo.
- Não somar o efeito das trocas.
- Cortar infraestrutura em nome do tema, ou terreno como se fosse mágica.
- Inventar laço, ou chamar de infinito sem conferir.
- Dar nota a tudo e não discordar de nada.
- Divergir de si mesmo entre o texto e a tabela.

---

## 8. Fichas de bolso

Uma por deck desta sessão. O detalhe está no handover e na análise de cada um.

### Vito, Thorn of the Dusk Rose

- **O que ele disse:** deck favorito e o primeiro. Mono-black, Vampiros com dreno e ganho de vida. Não gosta de ganhar pelo combo; usa quando é inevitável. Cartas de estimação: Hatred, Exsanguinate, New Blood.
- **Decisões dele:** eixos 5 e 6 excludentes (Vampiros sem e com sinergia), eixo 8 Petcards, combo como plano B.
- **A conta:** quatro conversores de ganho em perda, um deles o comandante. Com cinco tutores, o laço está ao alcance em 70% dos jogos até o turno 8.
- **O que não pode se perder:** o laço com Exquisite Blood é obrigatório depois que as peças estão em campo. O deck limpo é de mana grande com dreno, não tribal de combate. Proteção do comandante: duas cartas.
- **Trocas propostas:** saem Mindcrank, Blasphemous Edict, Defiant Bloodlord, Sanguine Spy, Necrodominance, Henrika. Entram Swiftfoot Boots, Lightning Greaves, Sanguine Bond, Scheming Silvertongue, Stensian Sanguinist, Defiling Daemogoth.
- **Aberto:** a nota dele para a primeira rodada; reconferir as cartas de 2026, que têm texto de loja.

### Fynn, the Fangbearer

- **O que ele disse:** o deck verde da série de um por cor. Quer aggro, teme perder o gás.
- **A conta:** dois venenos fixos por criatura com toque mortífero que conecta. Quinze conexões matam a mesa. Proliferar com os três marcados vale uma conexão e meia.
- **O que não pode se perder:** os aumentos não acrescentam veneno. Falta evasão em massa e toque mortífero em massa. A lista é ramp com começo agressivo. Três cartas matam a própria Hornet Queen.
- **Trocas propostas:** onze, lideradas por Ohran Frostfang, Triumph of the Hordes, Champion of Lambholt, Infectious Bite e Toski.
- **Aberto:** trocar o eixo "Dupla Função" por Evasão; cartas de estimação; veneno ou dano de comandante; por que os anti-voadores.

### Queen Marchesa

- **O que ele disse:** deck de estimação, construído pela teoria 8×8. Quer Mardu com remoção, agressividade e taxa. Início discreto, meio com a coroa, fim decisivo. Bem político.
- **Eixos propostos por mim, ainda sem aprovação:** Ramp, Coroa, Fortaleza, Remoção, Limpeza, Política, Motor, Fechamento.
- **A conta:** vinte fontes de coroa, e sete dos dez fechamentos pedem quatro voltas ou mais.
- **O que não pode se perder:** o fim do jogo é o elo fraco. O plano mora em 18 encantamentos sem proteção. "Agressividade" e "não chamar atenção" não cabem na mesma lista. Descent into Avernus paga as taxas dos oponentes.
- **Trocas propostas:** nove, lideradas por Teferi's Protection, Insurrection, Palace Jailer, Queen Mother Ramonda e Trouble in Pairs.
- **Aberto:** aprovar os eixos; agressividade ou fortaleza; cartas de estimação; fechar 8×8 estrito.

### Strefan, Maurer Progenitor

- **O que ele disse:** tema principal ficha de Sangue, subtema Vampiros. Quer que seja um dos mais fortes. Depois da primeira rodada: "ainda não achei forte o suficiente", quer deck mais responsivo e com dupla função, e não sabe se é preciso mexer na mana. Meta declarada: 10/10.
- **Cartas de estimação assumidas:** as oito de impressão especial (quatro da série Drácula, Voldaren Estate, três de moldura de presas). Ele não confirmou.
- **A conta:** fichas por turno é igual ao número de jogadores que perderam vida no turno dele, e ele conta como jogador.
- **A lista nova (rodada 2):** 24 trocas fora da base de mana. Em todo turno, todos perdem 1 de vida, e o resto do deck paga por isso. Laço novo com a carta de estimação: Olivia's Attendants, Krark-Clan Ironworks e Crime Novelist.
- **Antes e depois:** pings baratos em todos de 5 para 13; proteção de 1 para 4; respostas instantâneas de 5 para 8; dupla função de 23 para 40; Vampiros de 25 para 19; placar de 326 para 399.
- **Nota:** 6,5 hoje; 9 a 9,5 projetada, sem partida.
- **Aberto:** aceita 19 Vampiros; quer o laço; o teste das dez mãos; confirmar as cartas de estimação; quatro leituras de regra sem conferência oficial.

### Tovolar, Dire Overlord

- **O que ele disse:** é um dos primeiros decks dele. Achou que seria forte e não ficou, e já pensou em desmontar. Escolheu salvar o deck (caminho A). Não tem cartas de estimação. Aprovou os eixos propostos.
- **Eixos:** Ramp, Compra, Interação, Proteção, Matilha, Noite, Pressão, Evasão.
- **A conta:** três lobos na sua manutenção garantem a noite; cada lobo que conecta compra uma carta. A compra vale nas duas faces.
- **O que não pode se perder:**
  - Golpe duplo compra em dobro (Berserkers' Onslaught e o verso do Kruin Outlaw).
  - O Immerwolf trava o seu lado na noite. É leitura do mtg.wiki, não ruling.
  - O ciclo do Huntmaster para com o Immerwolf em campo.
- **A lista nova:** 32 trocas, das quais 7 de terreno.
  - Saem as duas limpezas simétricas e as névoas.
  - Entram Pyreheart Wolf, Kruin Outlaw, Howlpack Resurgence, Huntmaster of the Fells, Heroic Intervention, Toski, Ohran Frostfang e Craterhoof.
  - Lobos no grimório: de 21 para 30. Evasão: de 9 para 14.
- **Aberto:**
  - Reconstrução inteira ou só as dez trocas mais fortes?
  - O teste das dez mãos.
  - Zero limpezas está bom?
  - Craterhoof ou Overwhelming Stampede?
  - Quatro regras a confirmar.

### Lathril, Blade of the Elves

- **O que ele disse:** quer o deck forte em primeiro lugar e divertido em segundo, sem ser o Elfos comum. Quer muitas fichas e interação com as entradas. Desvirar a Lathril importa. Pediu para manter os eixos dele, sem cartas de estimação, e reconstrução no mesmo chat.
- **Eixos dele:** Ramp, Draw, Removal, WinCon, Tokens, Untap + Sinergia, Buff, Ramp2. Assumi Ramp como dork e Ramp2 como o resto do ramp.
- **A conta:** quatro ativações de 10 matam a mesa.
  - O Dionus desvira os dez Elfos, então cada vez que a Lathril desvira vale mais 10.
  - O Illusionist's Bracers dobra cada ativação para 20.
  - O Throne of the God-Pharaoh soma 11 no fim do turno.
- **O que não pode se perder:**
  - Ganhar pela habilidade, não pelo combate.
  - Os combos de mana infinita já estavam na lista dele. Com o Bracers, o deck está na fronteira do Bracket 4.
  - O Seedborn Muse não é Elf.
- **A lista nova:** 23 trocas.
  - Entram Dionus, Bracers, High Perfect Morcant, Elvish Warmaster, Elderfang Venom, Tyvar Kell, Thousand-Year Elixir, Throne, Skullclamp, Parallel Lives, Doubling Season, Wirewood Lodge e Gaea's Cradle.
  - Saem Overrun, Ruthless Winnower, Primal Vigor e as limpezas caras.
  - Cartas que desviram a Lathril: de 6 para 11.
- **Aberto:**
  - Qual o bracket da mesa dele?
  - O teste das dez mãos.
  - Craterhoof fica ou sai?
  - A leitura de Ramp contra Ramp2.

### Evelyn, the Covetous (ponto de controle)

- **O que ele disse:** é um deck forfun de Vampiros, o tribal favorito dele, montado com cartas que sobravam. Não tem eixos nem estratégia.
- **Conferido:**
  - 100 cartas, **35 terrenos** (corrigido).
  - Com o verso do Jwari Disruption, são 36 fontes.
  - Os híbridos da Evelyn se pagam com preto, e as cinco Island parecem demais.
- **Aberto:**
  - Quanto mexer, e se pode usar cartas do Vito, do Strefan e do Clavileño.
  - Cartas de estimação.
  - Aprovar os oito eixos e as fases propostas.
  - A fase do meio (Lampejo no turno alheio) depende de haver instantâneas e cartas com Lampejo, e a lista tem poucas.

### Tergrid e Tartarugas (ver os handovers próprios)

- **Tergrid:**
  - A conta: roubos por volta é igual a eventos forçados vezes a taxa de acerto.
  - A lista nova tem lock simétrico e 15 Game Changers.
  - Aberto: o teste das dez mãos; se a mesa dele pune o vilão.
- **Tartarugas:**
  - O Leonardo dispara uma vez por turno, mas em qualquer turno.
  - O gargalo era branco no turno 4 e as cinco cores no turno 6.
  - Aberto: o teste das dez mãos; Splinter como parceiro; o tema caiu de 16 para 10 Tartarugas.

### Decks anteriores, em uma linha

- **Ken:** sobrava finalizador e faltava combustível. Regra pendente: Resurgence conjurada pelo Ken.
- **Greymond:** corpos fortes sem evasão. Regra pendente: Mirror Entity com o bônus do comandante.
- **Lynde:** comprava muito e matava devagar. Regra pendente: maldição com gatilho de manutenção quando está no próprio dono.
- **Clavileño, Giada, Valgavoth:** ver os handovers próprios. Os dois primeiros têm painel pronto.

---

## 9. O formato da entrega

Arquivo Markdown, com estas seções. É o formato que o `/novo-deck` do Claude Code confronta.

```
# Análise: <deck> (<comandante>)
Analista: <IA> | Data: <dd/mm/aaaa>
Lista conferida: <sim ou o que não bateu> | Cartas sem texto conferido: <quantas>

## 1. Plano              frase de três verbos; onde a lista trai o plano; as três fases
## 2. Agrupamentos       os eixos, uma linha cada, e a ordem das notas
## 3. Carta a carta      uma tabela por tipo:
                         Carta | Notas | Tier | Relev. | O que faz | Por que aqui
                         (fase e conversa dentro de "Por que aqui")
## 4. Diagnóstico        faixas, gerar e converter, concentração, anti-sinergias,
                         brackets, distribuição, placar
## 5. Combos e linhas    combos, motores e fechamentos, separados
## 6. Cortes             as dez primeiras a sair
## 7. Entradas           8 a 15 de fora, e o efeito somado
## 8. Proposta de painel três nomes, clima, paleta, moldura, motivo gráfico
## 9. Dúvidas            fontes, suposições, regras incertas, cinco avaliações discutíveis
## 10. Confronto         só se vierem outras análises ou guias
```

Notas com ponto médio como separador (`0·3·0·2·0·0·0·0`). Carta de estimação marcada na coluna de relevância.

**Rodada de reconstrução:** o que a varredura encontrou; a ideia da lista nova em uma frase; as trocas com a função de cada entrada; antes e depois; como a lista nova ganha; tudo o que foi considerado, com veredito; a lista completa; a nota e o teste; dúvidas.

**Handover do deck**, sempre junto: como usar; onde paramos; o que ele disse; a lista; o que já foi conferido e concluído; perguntas em aberto; o que o próximo chat deve fazer. A cada rodada, acrescente uma seção datada em vez de reescrever.

**Paletas e climas já usados**, para não repetir:

| Painel | Clima |
|---|---|
| Ritos de Sangue (Clavileño) | Gótico escuro, vermelho e preto |
| Dízimo da Rosa (Vito) | Sacristia: ouro velho, marfim e rosa sobre vinho |
| Dez Gotas (Fynn) | Floresta fria: musgo, osso e verde-peçonha |
| Longa Vida à Rainha (Marchesa) | Corte de Paliano: azul-noite, carmesim e ouro |
| Brinde Carmesim (Strefan) | Gravura em preto e branco com um vermelho só, fundo claro |
| Noite Sem Dia (Tovolar) | Colheita de Kessig à meia-noite: ardósia, âmbar de lua, musgo, ferrugem e osso |
| Dez por Dez (Lathril) | Salão élfico de Kaldheim: verde-pinho, ameixa, ouro-folha, casca negra e pergaminho |

---

## 10. O que não fazer

- Construir painel, dashboard ou HTML do deck.
- Inventar texto de carta, preço ou regra.
- Recomendar carta só por ser forte.
- Esconder discordância para agradar, ou dar 10 sem teste.
- Entregar a análise só no corpo da conversa.
- Perguntar orçamento.
- Insistir num ajuste de eixo depois que ele decidiu.
- Mexer no que ele pediu para não mexer.
- Analisar um segundo deck no mesmo chat sem avisar do risco.

---

## 11. Fila sugerida

1. **Próximo deck novo:** em chat novo, com este arquivo e a frase da seção 0. Comece pelo ponto de controle e entregue a reconstrução.
2. **Evelyn:** responder as três perguntas e fazer a análise completa.
3. **Os testes de dez mãos:**
   - Lathril: decide o bracket.
   - Tovolar: decide se Toski e Ohran ficam.
   - Strefan, Tergrid e Tartarugas.
4. **Responder as perguntas abertas** de Fynn, Marchesa, Tovolar e Lathril. São curtas, e cada resposta destrava uma rodada.
5. **Dar nota e escolher nomes de painel** em todos os que estão como "sugerido".
6. **Gravar os arquivos** em `dados\` e rodar o `/novo-deck` no Claude Code para confrontar com as outras IAs.
