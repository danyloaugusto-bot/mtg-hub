# Handover Mestre: análise de decks de Commander

Versão 2.2, de 14/10/2026. Substitui a v2.1. Os handovers por deck continuam valendo como anexos de detalhe.

Este documento basta para um chat novo analisar qualquer deck do Danylo, ou retomar um dos dezenove já analisados, sem reler nenhuma conversa anterior.

**O que mudou da v2.1 para a v2.2:**

- O painel de situação ganhou quatro decks (Kaalia, Okaun e Zndrsplt, Wilhelt e K'rrik) e uma segunda rodada da Kaalia.
- A ambição agora tem três tamanhos (seção 3.4). Na Kaalia, ele achou a reconstrução grande demais e escolheu uma versão em camadas, medida por script.
- O passo 2 ganhou quatro lições de leitura de regra, e o passo 6 ganhou uma regra fixa: procurar o combo que já está na lista. Os quatro decks de 14/10 tinham pelo menos um.
- Duas preferências viraram regra: não perguntar bracket e não perguntar cartas de estimação.
- O aviso de contexto foi recalibrado (seção 3.6).
- A seção 7 ganhou os erros de 14/10.

---

## 0. Em 60 segundos

**Para o Danylo.** Abra um chat novo, anexe este arquivo e cole a frase abaixo, trocando o que está entre colchetes. Para retomar um deck, anexe também o handover e a análise dele.

> Você está recebendo o Handover Mestre v2.2 de análise de decks de Commander. Leia inteiro antes de responder. Tarefa de hoje: [analisar o deck novo abaixo / refinar o deck X / testar as dez mãos do deck X]. Quanto mexer: [pontual, até 12 trocas / em camadas / reconstrução]. Não mexer em: [nada / base de mana / cartas X]. Entrega: análise em Markdown, handover do deck e lista nova.

Se a linha "quanto mexer" não vier, siga a regra da seção 3.4: leia a ambição no texto dele.

**Para o analista.** A ordem de leitura que rende mais:

1. Seção 1, para saber em que pé está cada deck.
2. Seção 2, para saber com quem você está falando.
3. Seção 3, o método. As seções 4 a 7 são consulta.
4. Seção 8, a ficha do deck em que você vai trabalhar.

---

## 1. Painel de situação

Dezenove decks analisados até hoje. O placar só compara um deck com ele mesmo.

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
| **Kaalia** | Kaalia of the Vast | RWB | acelerar, blindar, despejar | **Rodada 2 de 14/10: versão enxuta** | 5 / 8 (enxuta) ou 9 (reconstrução) | 244 / 292 enxuta / 339 | Céu, Inferno e Fogo (sugerido) |
| **Okaun e Zndrsplt** | Okaun, Eye of Chaos + Zndrsplt, Eye of Wisdom | UR | virar, dobrar, conectar | Diagnóstico de 14/10, 10 trocas | 7 / 8,5 | 304 / 324 | Cara, Eu Ganho (sugerido) |
| **Wilhelt** | Wilhelt, the Rotcleaver | UB | morrer, renascer, drenar | Diagnóstico de 14/10, 12 trocas | 7 / 8,5 | 310 / 335 | Cutelo e Cova (sugerido) |
| **K'rrik** | K'rrik, Son of Yawgmoth | B | pagar, drenar, repagar | Reestruturação de 14/10, 17 trocas | 6 / 8,5 | 304 / 345 | Dízimo de Sangue (sugerido) |

Todas as notas projetadas são **projeção sem partida**. Nenhum deck tem nota testada ainda.

**Pendências que valem para todos:**

- Nenhum arquivo foi gravado em `C:\Projetos\mtg-hub\dados\`. O Danylo salva à mão, ou conecta a pasta e pede a gravação.
- Ele ainda não escolheu nome de painel nem deu nota em nenhum deck desde o Ken.
- Greymond, Lynde, Fynn, Marchesa e Strefan estão sem capa.
- O teste das dez mãos está pendente em todos os decks analisados desde 11/10.

**Arquivos produzidos.**

- **Até 13/10:** ver a seção 1 da v2.1. Cada deck tem `analise-claude-<deck>.md`, `Handover_<Deck>_Analise_de_Deck.md` e, nas reconstruções, `lista_nova_<deck>.txt`.
- **Em 14/10:**
  - Kaalia: `analise-claude-kaalia.md`, `Handover_Kaalia_Analise_de_Deck.md` (com a seção da rodada 2), `lista_nova_kaalia.txt` (reconstrução) e `lista_enxuta_kaalia.txt` (a escolhida).
  - Okaun e Zndrsplt: `analise-claude-okaun-zndrsplt.md`, `Handover_Okaun_Zndrsplt_Analise_de_Deck.md`, `lista_nova_okaun.txt`.
  - Wilhelt: `analise-claude-wilhelt.md`, `Handover_Wilhelt_Analise_de_Deck.md`, `lista_nova_wilhelt.txt`.
  - K'rrik: `analise-claude-krrik.md`, `Handover_Krrik_Analise_de_Deck.md`, `lista_nova_krrik.txt`.

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
  - margem contra operação (Okaun: o Thumb melhora a margem, o Efreet é a operação que paga o ano).
- Refina por rodadas ("7/10", "revise", "ainda não achei forte"). Leia como pedido de mais rigor ou mais ousadia, não de mais texto.

**Fixo em todo deck:**

- **Orçamento sem teto.** Nunca pergunte.
- **Não pergunte bracket.** Informe os Game Changers e se há combo de duas cartas, e siga. Padrão: manter o total de Game Changers que ele já tem. Quando a lista nova passar de três, ofereça a conversão para Bracket 3 numa tabela.
- **Não pergunte cartas de estimação.** Quando ele não listar, assuma e declare no topo. Regra que funcionou no K'rrik: as cartas foil, etched ou de impressão especial da lista são os pets. Pet nunca entra na fila de corte. Quando um pet for a carta mais fraca, diga isso uma vez, com todas as letras.
- **Os agrupamentos são dele.** Proponha ajuste uma vez, com o motivo, e registre a ressalva uma única vez, na seção de dúvidas. Quando ele não tem eixos, crie oito e passe-os pelo crivo da seção 4.
- **Três fases:** início, meio e fim. Ele descreve a estratégia de cada uma e quer vê-la confrontada com a lista. Quando não descreve, proponha.
- **Você não constrói painel nem HTML.** Sua parte criativa é propor nome, clima, paleta e motivo gráfico.

**O que as sessões ensinaram sobre ele:**

- Pede entrega direta com frequência. Não trave num ponto de controle: entregue, e transforme cada decisão dele em suposição declarada e em pergunta no handover.
- **"Quero o 10" nem sempre é "reconstrua".** Na Kaalia ele pediu 10/10, recebeu 71 trocas e respondeu: "não acho que o deck precise de tantas mudanças, mas quero saber onde e como deixá-lo mais rápido e forte". A versão em camadas foi a aceita. Ver seção 3.4.
- **Precon especial:** ele não costuma mexer, para não perder a essência. Nenhuma troca no tema central; tire só o que não faz falta ou atrapalha. Foi o caso do Okaun e Zndrsplt.
- Quando ele pede nota "no começo e no fim", abra com a nota atual e feche com a projetada.
- Manda links do Scryfall e do edh.wiki junto com a lista. O Scryfall não abre daqui; use o slug no json.edhrec. O edh.wiki abre, mas é lista de dados, sem guia escrito.
- Quando diz "não quero cair no comum", quer o plano que só aquele comandante tem.
- Quando sugere cartas pelo nome (The Scarab God e Lazotep Quarry na Wilhelt), confira, diga se ele acertou e, se acertou, diga com todas as letras.
- Às vezes manda um handover só para você "estar preparado". Confirme em duas linhas e espere o deck.
- **Ele empilha decks no mesmo chat.** Em 14/10 foram quatro. Ver seção 3.6.

---

## 3. O método

### 3.1 A pergunta que decide tudo

A carta é boa, ou é boa **neste comandante**?

### 3.2 Os nove passos

**Passo 1. Conferir a lista, por script.** São 100 cartas com o comandante? Há repetida que não seja básico? Tudo dentro da identidade de cor? Há banida? Quantas fontes de terreno, somando as cartas duplas com terreno no verso? Conte com código, nunca de cabeça. Limpe a lista: remova `(SET) número` e as marcas `*F*` e `*E*`, mas **guarde quais eram foil ou etched**, porque são a suposição de pets.

**Passo 2. Ler o comandante palavra por palavra, com as regras oficiais.** É aqui que os decks se decidem.

| Deck | O que se achava | O que o texto diz |
|---|---|---|
| Fynn | "Infectar" | Dois marcadores fixos por criatura que conecta |
| Strefan | Sangue quando bate nos oponentes | "Cada jogador que perdeu vida" inclui ele mesmo |
| Strefan | O Vampiro entra atacando | Entra atacando sem ter sido declarado: gatilho de "quando atacar" não dispara |
| Vito | O laço é uma opção | Os gatilhos são obrigatórios |
| Tovolar | A noite fica | Duas mágicas de qualquer jogador viram o dia |
| Tovolar | Golpe duplo é só dano | São dois eventos de dano: gatilhos disparam duas vezes |
| Lathril | Os dez Elfos precisam estar prontos | "Virar dez Elfos" não usa o {T}; ficha recém-criada paga |
| **Kaalia** | Põe "carta tribal" | Põe **card de criatura** Angel, Demon ou Dragon. ETB dispara antes dos bloqueios; "quando atacar" não dispara; ataca o mesmo oponente; ela não tem vigilância; planeswalker não conta |
| **Okaun e Zndrsplt** | Só as minhas moedas contam | "Um jogador vence": a moeda vencida por um oponente também dispara. O Efreet ativado N vezes antes de resolver é combo com o comandante, e ele nem precisa sobreviver |
| **Wilhelt** | Só Zumbi não-ficha dispara | O filtro é "sem decayed". Fichas comuns de Zumbi disparam |
| **K'rrik** | Paga qualquer mana com vida | Só os {B}, em qualquer custo, inclusive ativação e híbrido. Nunca o genérico nem o X. Platinum Angel trava o pagamento em 0 de vida |

**Passo 3. Achar a conta do deck.** Uma frase de três verbos e, se der, uma equação. Exemplos:
- Okaun: três vitórias levam o Okaun a 24; com duas sequências e o Thumb, 74%.
- Wilhelt: cada Zumbi sem decayed que morre vale a ficha mais o gatilho de quem paga.
- K'rrik: cada 2 de vida vira uma mana preta; com ele em campo, o custo médio efetivo cai de 3,58 para 2,27.

**Passo 4. Confrontar o plano dele com a lista.** Escreva onde a lista trai o plano, em ordem de gravidade. Depois a tabela das três fases.

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
| Kaalia | 29 tribais e 10 compras | 2 peças de blindagem, nenhum multiplicador |
| Okaun | 13 caminhos até o Thumb | 3 caminhos até o Efreet |
| Wilhelt | 16 geradores de fichas e 12 saídas de sacrifício | 4 drenos |
| K'rrik | Vida de várias fontes | Um Exquisite Blood |

**Regra fixa: procure o combo que já está na lista.** Os quatro decks de 14/10 tinham, e o dono não citou nenhum:
- Kaalia: Master of Cruelties (entrada).
- Okaun: Frenetic Efreet com o comandante, com a Scoundrel e com a Chance Encounter.
- Wilhelt: Acererak com Rooftop Storm, e o laço do Gravecrawler com o Phyrexian Altar.
- K'rrik: quatro laços do Exquisite Blood.

Busque no Commander Spellbook por ID e diga se o combo vence sozinho ou pede finalizador.

**Regra fixa: teste cada carta contra o próprio plano.** Nas listas de 14/10, cartas fortes trabalhavam contra o comandante: limpezas que matam o comandante, Possibility Storm desmontando o combo, Platinum Angel travando o K'rrik, fichas decayed num deck de Wilhelt. Marque com uma flag e conte (seção 6.2).

**Passo 7. Combos e linhas.** Combos, motores e fechamentos, separados. Para cada combo, o ID do Commander Spellbook ou "dedução". Diga também **como fechar a mesa, não só um jogador**, e o **momento** da jogada. No Okaun: ativar o Efreet depois dos bloqueios para matar um jogador; na fase principal, antes da Ignition, para matar todos.

**Passo 8. Cortes e entradas.** Monte a tabela de pares "sai | entra | por quê" e some o efeito numa tabela de antes e depois, tudo por script. Inclua as recusadas, para elas não voltarem à mesa. Quando ele pede Zumbis "velhos e novos", ponha uma coluna de ano.

**Passo 9. Painel, dúvidas e handover.** Três nomes e o escolhido, clima, paleta de cinco cores com hex, moldura e motivo gráfico. Depois a seção de dúvidas e o handover do deck.

### 3.3 A varredura em três frentes

1. **Todas as cartas da mecânica central**, por busca de texto.
2. **A tribo ou o tema nas coleções recentes**, até hoje.
3. **Os pagadores laterais**: cartas que pagam pelo que a mecânica faz por tabela.

Peça ao subagente uma lista de **armadilhas**: cartas populares que não funcionam com aquele comandante. Exemplos:
- Kaalia: Drakuseth e Scourge of the Throne, porque dependem de gatilho de ataque.
- Wilhelt: Poppet Stitcher, que só faz fichas decayed.
- K'rrik: Lich's Mastery.

### 3.4 Três tamanhos de ambição

| Tamanho | Quando | O que entrega |
|---|---|---|
| Pontual (8 a 15 trocas) | Precon, "criterioso", "pontual", "não perder a essência", "análise aprofundada" | Diagnóstico completo, a tabela de pares, antes e depois, banco e recusadas |
| Em camadas | "Não precisa de tantas mudanças, mas quero mais rápido e forte"; ou depois de uma reconstrução recusada | Três ou quatro camadas (força, mana, terrenos, proteção), cada uma medida por script, com a ordem de prioridade e quanto cada uma rende |
| Reconstrução | "O mais forte possível", "seja criativo", "deck competitivo", "crie a estratégia" | Lista de 100, pares com função, antes e depois, tudo o que foi considerado. **Ofereça também o atalho das dez trocas mais fortes, medido por script** |

Lição da Kaalia: a reconstrução chegava a 9 e a versão enxuta, com 26 trocas, a 8. Era 85% do ganho com um terço das mudanças. **Mostrar essa razão ajuda ele a decidir.**

### 3.5 A nota e o teste

Separe três notas:
- **Atual:** o que a lista é hoje.
- **Projetada:** o que as trocas fariam. Marque sempre como projeção sem partida.
- **Testada:** só depois de jogar.

Não dê 10 a uma lista que nunca foi embaralhada. Ofereça o teste das dez mãos com três ou quatro medidas tiradas da conta do deck, cada uma com meta.

### 3.6 Como conduzir

- **Contexto.** O risco depende de quanto você carrega na conversa, não do número de mensagens. Regras:
  - Avise **uma vez**, a partir do segundo deck completo, com a frase da preferência dele ("⚠️ Contexto elevado — risco de alucinação aumentando. Recomendo criar um handover"), e ofereça o handover.
  - Na Kaalia, avisei no primeiro deck e ele contestou com razão.
  - Se ele seguir no mesmo chat, siga. Não repita o aviso a cada deck: uma linha no fim basta.
  - O que tornou quatro decks seguros em 14/10 foi **uma pasta por deck e tudo em arquivo e script**. A conversa nunca guardou número que não estivesse num arquivo.
- **Ponto de controle** só quando ele não pedir entrega direta.
- Feche na conversa com:
  - a nota atual e a projetada;
  - a descoberta principal (combo escondido, regra mal lida);
  - onde discorda dele;
  - a tabela de trocas;
  - o antes e depois em cinco linhas;
  - a avaliação de que tem menos certeza;
  - o nome de painel.

  Não repita o arquivo.

---

## 4. Escalas

**Nota por eixo:** 0 não faz; 1 faz de passagem; 2 é função da carta; 3 é referência no deck. Terreno que sempre entra virado leva −1 em Ramp. Carta de estimação soma 1 em Sinergia.

**Tier, a força neste deck:** S define o deck; A titular; B cumpre o papel; C substituível; D fora de lugar.

**Relevância, a permanência:** INS nunca sai; ALT só sai por algo claramente melhor; MÉD trocável; BAX primeira a sair. Pets aparecem como "(pet)" na coluna de relevância.

Em 100 cartas, espere perto de 20 INS, 40 ALT, 30 MÉD e 8 a 10 BAX. Terrenos intercambiáveis ficam em MÉD, não em ALT.

**Faixas do diagnóstico:**

| Item | Faixa |
|---|---|
| Fontes de terreno | 35 a 37 |
| Ramp dedicado | 10 a 12 |
| Compra dedicada | 10 a 12 |
| Remoção | 8 a 12, com 3 a 5 em massa |

Quando o deck se afasta de propósito, diga que é de propósito. Exemplos: 32 terrenos no K'rrik; 33 na Wilhelt, com CMC médio de 3,2.

**Placar:** pontos do CMC médio (5 abaixo de 2; 4 abaixo de 3; 3 abaixo de 4; 2 abaixo de 5; senão 1), mais aceleração (soma das notas de Ramp dividida pelo CMC médio; cada 0,5 vale 5 pontos; teto de 90), mais a soma de todas as notas.

**Crivo para os eixos dele.** Proponha ajuste só onde o eixo falhar:
- Mede uma função?
- Os eixos se somam?
- Terá mais de meia dúzia de cartas?
- Há eixo para o que o deck mais precisa medir?

Em quase todos os decks faltou eixo de **proteção ou evasão**. Diga onde ela foi notada e conte as peças à parte.

**Régua de calibração:**

| Carta (deck) | Tier | Relev. | O que ensina |
|---|---|---|---|
| Toxic Deluge (Clavileño) | S | INS | Especialista pode ser S com 3 pontos |
| Relentless Assault (Ken) | C | BAX | Sinergia no site, e não funciona com o comandante |
| Necrodominance (Vito) | C | BAX | Carta forte que desliga dez cartas da própria lista |
| Spear Spewer (Strefan) | S | INS | Um 0/2 de uma mana pode ser a melhor carta |
| Velomachus Lorehold (Kaalia) | C | MÉD | Texto de bomba, e nada pela comandante |
| Frenetic Efreet (Okaun) | S | INS | Um 2/1 de três manas é a carta que vence o deck |
| Possibility Storm (Okaun) | D | BAX | Carta temática que desmonta o próprio combo |
| Platinum Angel (K'rrik) | D | BAX | "Não posso perder" que trava o comandante |
| Crowded Crypt (Wilhelt) | C | MÉD | Fichas do tipo certo que não disparam o comandante |

---

## 5. Regras de verdade

1. **Texto de carta nunca de memória.** Se não der para buscar, marque "(texto de memória)".
2. **Regra do jogo também se confere** antes de chamar algo de combo.
3. **Carta dupla com terreno no verso conta como fonte de terreno.** Sala (Room) não é dupla face de terreno; use o valor de cada porta, não o somado.
4. **Número de site mede presença, não força.**
5. **Concordar com outra IA, com um guia ou com um subagente não prova nada.** Em 14/10, um subagente disse que o Frenetic Efreet não estava na lista, e estava. Confira as cartas que decidem a análise no arquivo e na lista.
6. **Leia o comandante com as regras oficiais dele.**
7. **Condição de tempo se lê palavra por palavra.**
8. **Teste o bônus do comandante contra as checagens da lista.**
9. **"Cada jogador" não é "cada oponente", e "um jogador vence" não é "você vence".**
10. **Gatilho obrigatório não é opção.**
11. **"Entra atacando" não é "atacou".**
12. **Filtro do comandante se lê exato:** "sem decayed" não é "não-ficha"; "{B}" não é "qualquer mana".
13. **Separe texto, regra oficial e leitura sua.** A seção de dúvidas existe para isso.
14. **Suas afirmações anteriores também se conferem.** Se a entrega contradiz o que você disse antes, diga no topo. Exemplo: o atalho da Kaalia cortava a Cathedral of War e deixava 33 terrenos; corrigi às claras.
15. **Todo número do texto sai do script.** Inclusive o do atalho que você oferece no handover.

---

## 6. Caixa de ferramentas

### 6.1 Fontes

| Para quê | Fonte | Observação |
|---|---|---|
| Texto atual da carta | `json.edhrec.com/cards/<slug>` | Slug minúsculo, hífens, sem apóstrofo nem vírgula, acentos removidos ("Barad-dûr" vira barad-dur). Exceção vista: Erebos's Intervention é `ereboss-intervention` |
| Game Changer e banida | campos `game_changer` e `banned` do mesmo JSON | `legal_commander` só diz se a carta pode ser comandante. Ignore |
| Página do comandante | `json.edhrec.com/pages/commanders/<slug>.json` | Cortado; peça uma seção por busca. Às vezes a seção "High Synergy" não vem: use o edh.wiki |
| Espelho com percentuais | `edh.wiki/commanders/<slug>/<tema>/` | Abre direto. É lista de dados, sem guia escrito. Percentuais cerca de 2 pontos acima do EDHREC |
| Busca por texto ou tipo | `archidekt.com/api/cards/v2/?oracleText=...&subTypes=...&colors=...&unique=true&pageSize=25&page=N` | `orderBy` quebra a consulta. O filtro de cor é exato e deixa de fora as multicoloridas; busque também sem cor |
| Rulings | `grimoria.app/cards/<slug>` | A melhor fonte de rulings em 14/10 |
| Rulings antigas | `api.magicthegathering.io/v1/cards?name="..."` | Redação antiga; às vezes volta vazia |
| Combos | `commanderspellbook.com/combo/<ids>/` | A busca do site não renderiza daqui; abra pelo ID. Os IDs do EDHREC são os mesmos |
| Game Changers | `scrollvault.net/guides/game-changers.html` e `json.edhrec.com/pages/top/game-changers.json` | |
| Regras e brackets | `mtg.wiki` | Páginas com vírgula ou apóstrofo no nome costumam falhar |

**Não funcionam daqui:** Scryfall e Gatherer. O curl do terminal é bloqueado; use sempre a ferramenta de leitura web e mande os subagentes fazerem o mesmo.

**O truque da citação.** Peça o texto "literal, em trechos numerados de até 90 caracteres" e junte. Sem isso, o que volta é paráfrase.

**Game Changers** (lista de 09/02/2026, 53 cartas; o próximo B&R é em 30/11/2026). Conferidos nesta série:
- **Pretos:** Demonic Tutor, Vampiric Tutor, Imperial Seal, Necropotence, Bolas's Citadel, Ad Nauseam, Tergrid, Orcish Bowmasters, Opposition Agent, Braids.
- **Azuis:** Rhystic Study, Cyclonic Rift, Fierce Guardianship, Force of Will, Mystical Tutor, Intuition, Gifts Ungiven, Consecrated Sphinx, Narset, Thassa's Oracle.
- **Vermelhos:** Gamble, Jeska's Will, Underworld Breach.
- **Brancos:** Smothering Tithe, Teferi's Protection, Enlightened Tutor, Drannith Magistrate, Humility, Farewell.
- **Incolores:** Mana Vault, Chrome Mox, Ancient Tomb, The One Ring, Grim Monolith, Mox Diamond, entre outros.

**Não são Game Changers:** Sol Ring, Toxic Deluge, Skullclamp, Emeritus of Woe (que traz uma cópia de Demonic Tutor), Craterhoof.

**Banidas conferidas:** Mana Crypt, Jeweled Lotus, Dockside Extortionist.

**Bracket 3:** até 3 Game Changers e nada de combo de duas cartas montado cedo. A atualização da WotC de 21/10/2025 removeu as restrições a tutores e acrescentou a expectativa de pelo menos 6 turnos por partida.

**Coleções de 2026 até hoje:** Lorwyn Eclipsed (23/01), TMNT (06/03), Secrets of Strixhaven (24/04), Marvel (26/06), The Hobbit (14/08), Reality Fracture (02/10). Star Trek sai em 13/11. Chira, All In sai em 09/11/2026.

### 6.2 A linha de montagem (rotina de 14/10)

1. **Uma pasta por deck** (`/home/claude/<deck>/`). Lista limpa em `lista_<deck>.txt`. Contagem por script antes de responder.
2. **Quatro subagentes em paralelo**, cada um gravando um arquivo:
   - `textos_1.md` e `textos_2.md`, com a lista dividida ao meio. Peça o que importa para aquele comandante: tipo da criatura e das fichas; número de {B}; se joga moeda.
   - `regras.md`, com rulings, combos com ID, Game Changers e brackets.
   - `varredura.md`, com as três frentes, as armadilhas e os dados do EDHREC e do edh.wiki.
3. **Um quinto subagente** para o texto das entradas (`textos_entradas.md`). Para três ou quatro cartas, busque você mesmo, em paralelo.
4. **Três scripts:**
   - `dados.py`: uma linha por carta, com `c(...)` para a lista atual e `e(...)` para as entradas; `PARES` com sai, entra e por quê; asserts de 100 cartas nas duas listas, de pares batendo com as entradas e de nenhum pet entre os cortes. **O assert de 100 pegou duas cartas esquecidas em 14/10.** Rode antes de qualquer conta.
   - `stats.py`: contagens por eixo e por flag, placar, hipergeométrica, Monte Carlo quando a conta pede.
   - `gerar.py`: preenche o `analise_tpl.md`; marcadores `{{A.chave}}`, `{{D.chave}}`, `{{PA.chave}}` (porcentagem); assert de que não sobrou marcador.
5. **Flags que medem a conta**, não só os eixos. As de 14/10:
   - Kaalia: `T` tribal, `AT` gatilho de ataque, `PB` blindagem barata, `MU` multiplicador, `DD` dobrador.
   - Okaun: `MO` moeda, `EF` paga o Efreet, `TE` acha o Efreet, `TT` acha o Thumb.
   - Wilhelt: `Z` Zumbi, `ZT` cria Zumbi sem decayed, `DR` dreno, `LD` senhor, `WP` limpeza simétrica.
   - K'rrik: `b` (número de {B}), `A` e `B` (as duas metades do combo), `KK` mata o comandante, `SY` contra o plano, `P` pet.
6. **Simulações que funcionaram:**
   - Monte Carlo de mana para comandante de três cores, com 40 mil partidas: "conjurável até o turno N".
   - Probabilidade de vitórias em moedas com N sequências "até perder".
   - Monte Carlo de combo: duas peças, ou peça mais tutor, ou dois tutores.
7. **Reconcilie.** Corrija o modelo por substituição exata, com assert de ocorrência única. Nunca escreva "0 cartas"; escreva "nenhuma".

---

## 7. Erros que já aconteceram

Releia antes de entregar.

**De 14/10:**
- **Reconstrução onde ele queria camadas.** A Kaalia recebeu 71 trocas e ele disse que era demais. Leia a ambição; quando houver dúvida, entregue as duas versões medidas.
- **Atalho oferecido sem medir.** O atalho da Kaalia no handover deixava 33 terrenos. Todo atalho passa pelo script.
- **Aviso de contexto cedo demais.** Na Kaalia avisei no primeiro deck. Ele contestou com razão.
- **Subagente que leu errado a lista.** O agente de regras do Okaun disse que o Efreet estava fora; estava dentro. A peça que decide a análise se confere na lista.
- **Premissa do próprio pedido ao subagente.** Na Wilhelt, eu escrevi "não-ficha" no pedido, e a varredura corrigiu. Copie o texto do comandante no pedido, não a sua leitura.
- **Carta esquecida no `dados.py`.** Aconteceu duas vezes (Liliana's Reaver e Boggart Trawler). O assert de 100 pegou.
- **Ano de lançamento de memória.** A coluna de anos da Wilhelt saiu de memória e precisou de correção. Marque "aprox." ou busque.
- **Corte de terreno sem repor.** Trocar Hostile Hostel por uma criatura derrubava os terrenos; troquei o corte.

**De 13/10:**
- Contagem de terreno de cabeça.
- Lista numerada com número repetido.
- Assumir que o subagente leu certo.
- Deixar o eixo de proteção sumir.

**Das sessões anteriores:**
- Primeira rodada tímida.
- Número escrito antes da conta.
- Exemplo dado antes da decisão dele.
- Aceitar o nome que o dono dá à mecânica.
- Chamar de proteção o que é evasão.
- Tutores contados de cabeça.
- Recomendar limpeza de mesa a deck de mesa larga. Repetiu-se na Wilhelt e no K'rrik, agora como diagnóstico.
- Contar ficha como se fosse da tribo.
- Não somar o efeito das trocas.
- Cortar infraestrutura em nome do tema, ou terreno como se fosse mágica.
- Inventar laço, ou chamar de infinito sem conferir.
- Dar nota a tudo e não discordar de nada.

---

## 8. Fichas de bolso

As fichas de Vito, Fynn, Marchesa, Strefan, Tovolar, Lathril, Evelyn, Tergrid, Tartarugas, Ken, Greymond, Lynde, Clavileño, Giada e Valgavoth estão na seção 8 da v2.1 e nos handovers próprios, e continuam válidas. Abaixo, os decks de 14/10.

### Kaalia of the Vast

- **O que ele disse:** comandante interessante pela regra de pôr uma carta atacando. Não tinha eixos nem estratégia. Pediu 10/10, com nota no começo e no fim.
- **Depois da reconstrução:** "não acho que o deck precise de tantas mudanças, mas quero saber onde e como deixá-lo mais rápido e forte; siga com o que for melhor".
- **Eixos criados:** Ramp, Combustível, Interação, Blindagem, Carga, Multiplicador, Trava, Fechamento.
- **A conta:** acelerar, blindar, despejar. Cada ataque com a carga certa tira um oponente.
- **O que não pode se perder:**
  - Ela põe card de criatura Angel, Demon ou Dragon.
  - "Quando atacar" não dispara na criatura posta, mas o ETB sim, antes dos bloqueios.
  - A criatura ataca o mesmo oponente.
  - A Kaalia não tem vigilância.
  - Master of Cruelties funciona (ruling de 2013); Isshin dobra o gatilho.
  - O gargalo é a cor: ela é conjurável até o turno 4 em 48% das partidas, hoje.
- **A versão escolhida, enxuta (26 trocas em 4 camadas):**

| Camada | O que entra |
|---|---|
| Força (10) | Greaves, Boots, Grand Abolisher, Isshin, Master of Cruelties, Terror of Mount Velus, Subjugator Angel, Neriv, Rune-Scarred Demon, Aurelia |
| Rocks de cor (3) | Três Talismans |
| Terrenos (10) | Duais originais, shocks, três fetches, Arena of Glory |
| Proteção grátis (3) | Flawless Maneuver, Deflecting Swat, Mother of Runes |

- **Efeito da versão enxuta:**
  - Kaalia conjurável até o turno 4: de 48% para 62%.
  - Proteção vista até o turno 4: de 19% para 54%.
  - Nota 8; um só Game Changer.
- **A reconstrução** (71 trocas, 10 Game Changers, nota 9) ficou como referência.
- **Aberto:** o teste das dez mãos com a enxuta; Ancient Gold, Ancient Brass, Shadrix e Decadent Dragon são a próxima fila.

### Okaun, Eye of Chaos + Zndrsplt, Eye of Wisdom

- **O que ele disse:** precon especial de Secret Lair. Não costuma mexer em precon, mas fez melhorias em moedas. Acha o Krark's Thumb a carta principal. Quer critério: cartas pontuais, tirando só o que não fará falta.
- **A conta:** virar, dobrar, conectar. Três vitórias levam o Okaun a 24.

| Sequências de moedas | Sem Thumb | Com Thumb |
|---|---|---|
| Duas | 31% | 74% |
| Três | 50% | 90% |

- **A descoberta:** Frenetic Efreet mais Okaun é poder infinito (2199-2779). O Efreet também fecha com a Scoundrel (211-2199) e com a Chance Encounter (2199-4800). Para matar a mesa: Efreet na fase principal e depois a Chandra's Ignition.
- **Onde discordo dele:** o Thumb melhora; o Efreet vence. São 13 caminhos até o Thumb contra 3 até o Efreet.
- **As 10 trocas:**
  - Entram: Imperial Recruiter, Drift of Phantasms, Strionic Resonator, Psychosis Crawler, Edgar, Deflecting Swat, Counterspell e três duais.
  - Saem: Possibility Storm, Kaboomist, Minotaur, Fighting Chance, Axe, Reshape, Midnight Clock e três terrenos lentos.
  - Acesso ao Efreet até o turno 6: de 33% para 49%.
- **Aberto:** se a Possibility Storm é parte da graça; se o combo é plano principal; Volcanic Island ou dual mais barata.

### Wilhelt, the Rotcleaver

- **O que ele disse:** deck Zumbi famoso. O tema 1 tem que ser muito forte em Zumbis; o tema 2, fichas e uso delas (compra, dano, recorrência, recursão). Pediu Zumbis velhos e novos e sugeriu The Scarab God e Lazotep Quarry.
- **Eixos dele:** Ramp, Draw, Removal, Recursão, Sacrifice + token, Tokens, Buff, Sinergia + WinCon.
- **Fases dele:** ramp e Zumbis pequenos; comandante e controle da mesa; vencer por fichas, dreno ou combate.
- **A conta:** morrer, renascer, drenar.
- **O que não pode se perder:** o filtro é "sem decayed". Os combos que já estavam na lista: Acererak mais Rooftop Storm (vence sozinho) e o laço do Gravecrawler com o Phyrexian Altar.
- **As 12 trocas:**
  - Entram: The Scarab God, Lazotep Quarry, Death Baron, Cemetery Reaper, Lord of the Accursed, Vengeful Dead, Zombie Apocalypse, Noxious Ghoul, Skullclamp, Cryptbreaker e duas duais.
  - Saem as limpezas simétricas, as fábricas de decayed e os terrenos lentos.

| | Hoje | Com as trocas |
|---|---|---|
| Senhores | 3 | 6 |
| Drenos | 4 | 6 |
| Limpezas simétricas | 4 | 1 |

- **Aberto:** se a mesa usa muito cemitério (Living Death); se aceita o Skullclamp; mais duais.

### K'rrik, Son of Yawgmoth

- **O que ele disse:** montou com sobras do Vito. Foi mediano, faltou consistência. Quer um deck responsivo, equilibrado e competitivo, e pediu que eu criasse a estratégia. Os pets serão as cartas mais bonitas e caras, ainda sem lista.
- **Eixos dele:** Ramp, Draw, Removal Pontual, Removal Global, WinCon, Drain/Gain life, Tutor + Reanimator, Others + Pet.
- **A conta:** pagar, drenar, repagar. A vida é uma linha de crédito.
- **O que não pode se perder:**
  - Só os {B} podem ser pagos com vida.
  - Platinum Angel desliga o K'rrik.
  - Damnation e Mutilate o matam.
  - Os quatro laços do Exquisite Blood já estavam na lista; a Bloodthirsty Conqueror é a segunda peça.
- **Pets assumidos:** as foil e etched. Nenhuma saiu.
- **As 17 trocas:**
  - Entram: Bloodthirsty Conqueror, Vilis, Bolas's Citadel (no lugar do Vampiric), Sheoldred, Snuff Out, Infernal Grasp, Bitter Triumph, Cut Down, Pontiff of Blight, Bloodletter of Aclazotz, Cabal Ritual, Emeritus of Woe, Night's Whisper, Swiftfoot Boots, Cabal Coffers, Nykthos e Malakir Rebirth.

| | Hoje | Com as trocas |
|---|---|---|
| Remoção instantânea | 8 | 12 |
| Cartas contra o plano | 9 | 1 |
| Game Changers | 3 | 3 |

- **Aberto:** confirmar os pets; Imperial Seal ou Vampiric; Necropotence como quarto Game Changer.

---

## 9. O formato da entrega

Arquivo Markdown, com estas seções:

```
# Análise: <nome de painel> (<comandante>)
Analista | Data | Lista conferida | Cartas sem texto conferido
## Nota de partida      nota atual e projetada; a descoberta principal; como li o pedido
## 1. Plano             leitura do comandante em tabela; a conta; onde a lista trai o plano; as três fases
## 2. Agrupamentos      os eixos e a ressalva única
## 3. Carta a carta     uma tabela por tipo: Carta | Notas | Tier | Relev. | O que faz | Por que aqui
## 4. Diagnóstico       faixas, gerar e converter, concentração, anti-sinergias, combos, brackets, placar
## 5. Combos e linhas   motores e fechamentos; como fechar a mesa; o momento da jogada
## 6. Cortes            em ordem
## 7. Entradas          pares sai | entra | por quê; antes e depois; recusadas e banco
## 8. Painel            três nomes, clima, paleta com hex, moldura, motivo
## 9. Dúvidas           fontes, suposições, regras sem ruling, cinco avaliações discutíveis
## 10. Confronto        guias e sugestões dele
```

Junto, sempre: o handover do deck e a lista nova em `.txt` (quantidade e nome, uma carta por linha, somando 100).

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

---

## 10. O que não fazer

- Construir painel, dashboard ou HTML do deck.
- Inventar texto de carta, preço, regra ou ano.
- Recomendar carta só por ser forte, ou só por ser popular.
- Esconder discordância para agradar, ou dar 10 sem teste.
- Entregar a análise só no corpo da conversa.
- Perguntar orçamento, bracket ou cartas de estimação.
- Cortar pet.
- Mexer no tema central de um precon que ele quer preservar.
- Insistir num ajuste de eixo depois que ele decidiu.
- Repetir o aviso de contexto a cada deck.

---

## 11. Fila sugerida

1. **Testes de dez mãos**, na ordem em que decidem mais:
   - Kaalia enxuta, que confirma o 8;
   - K'rrik, que mede a vida no turno 6;
   - Okaun, que mede o acesso ao Efreet;
   - depois Wilhelt, Lathril, Tovolar, Strefan, Tergrid e Tartarugas.
2. **Responder as perguntas abertas:**
   - pets do K'rrik;
   - Possibility Storm no Okaun;
   - cemitério da mesa na Wilhelt;
   - e as de Fynn, Marchesa, Tovolar, Lathril e Evelyn.
3. **Evelyn:** análise completa.
4. **Notas e nomes de painel** de todos os decks marcados como "sugerido".
5. **Gravar os arquivos** em `dados\` e rodar o `/novo-deck` no Claude Code.
6. **Próximo deck novo:** em chat novo, com este arquivo e a frase da seção 0.
