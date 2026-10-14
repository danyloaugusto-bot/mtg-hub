# Análise: Kaalia (Kaalia of the Vast)
Analista: Claude | Data: 14/10/2026
Lista conferida: sim, 100 cartas com a comandante, nenhuma repetida fora os básicos, tudo dentro de R/W/B, nenhuma banida | Cartas sem texto conferido: 0 (só a lealdade inicial do Sorin Markov ficou sem fonte, e ele sai)

## Nota de partida

**Nota atual: 5 de 10.**

A lista tem um núcleo que qualquer Kaalia invejaria: Gisela, Avacyn, Balefire Dragon, Hoarding Broodlord e Lord of the Void. O problema é que esse núcleo quase nunca chega à mesa do jeito que a comandante promete. Quatro números explicam a nota:

- A Kaalia é conjurável até o turno 4 em 48% das partidas (simulação, na jogada, sem mulligan). Com 25 básicos em três cores e só um terreno que dá as três, a cor falta mais que a mana.
- A chance de ter, até o turno 4, uma peça barata que dê ímpeto ou proteção à Kaalia é de 19%. A lista tem 2 peças assim, e nenhuma bota.
- Nenhuma carta faz a Kaalia disparar duas vezes no mesmo turno.
- Das 29 tribais, 5 guardam o valor num gatilho de ataque ou de início de combate, que **não dispara** quando a criatura entra pela Kaalia.

A nota com as mudanças está no fim, na seção 11, como você pediu.

**Como li o pedido.** Você não deu eixos, estratégia nem cartas de estimação, e pediu a busca do 10. Então fiz tudo do zero e entreguei direto a reconstrução, sem ponto de controle. Cada decisão que seria sua virou suposição declarada aqui e pergunta no handover:

- Não assumi nenhuma carta de estimação.
- Orçamento sem teto.
- Bracket 4. A lista nova tem 10 Game Changers. A conversão para Bracket 3 está na seção 7.4.

---

## 1. Plano

### 1.1 O que a Kaalia faz, palavra por palavra

O texto: voa; sempre que ela ataca um oponente, você pode pôr um card de criatura Angel, Demon ou Dragon da sua mão no campo, virado e atacando esse oponente. Conferido no json.edhrec. A impressão MH3 nº 290 do seu link existe e tem o mesmo texto Oracle.

Leituras que decidem o deck:

| O que se costuma achar | O que o texto e as regras dizem | Fonte |
|---|---|---|
| "Põe uma carta tribal" | Põe um **card de criatura** que seja Angel, Demon ou Dragon. Encantamento tribal, ficha ou criatura de outro tipo não entram | Texto Oracle |
| A criatura que entra "atacou" | Ela entra atacando sem ter sido declarada. Gatilhos de "sempre que atacar" não disparam | CR 508.4; ruling da Kaalia de 07/08/2020 |
| Gatilho de ETB some | O ETB dispara normalmente, ainda no passo de declarar atacantes, **antes dos bloqueios** | Dedução da CR 508.4; nenhuma ruling diz o contrário |
| Pode escolher quem ela ataca | Ataca **o mesmo oponente** que a Kaalia atacou. Se esse jogador saiu do jogo, a criatura entra virada e fora do combate | Texto ("that opponent") e CR 508.4 |
| Ataque em planeswalker conta | Não conta. A Kaalia atacando planeswalker ou batalha não dispara | Ruling de 07/06/2024 |
| Taxa de ataque (Ghostly Prison, Propaganda) se aplica | Não se aplica à criatura posta atacando | Ruling citando Propaganda; CR 508.4c |
| Combate extra repete o gatilho | Repete, porque a Kaalia é declarada atacante de novo. Mas ela **não tem vigilância**: precisa de algo que a desvire | CR 508.3a; texto conferido |
| Varragoth pode ativar Boast | Não pode: posto atacando, ele nunca "atacou" | Ruling de 05/02/2021 |
| Master of Cruelties precisa atacar sozinho | A restrição vale só na declaração. Posto pela Kaalia, o gatilho "ataca e não é bloqueado" dispara | Ruling de 15/04/2013; Commander Spellbook, combo 29-137 |
| Isshin dobra a Kaalia | Dobra: o gatilho dispara duas vezes, com escolhas separadas. São duas criaturas por ataque | Ruling do Isshin de 18/02/2022 |
| Aurelia posta pela Kaalia dá combate extra | Não dá. Conjurada, com ímpeto, dá | Ruling da Aurelia de 24/01/2013 |

### 1.2 A conta do deck

**Acelerar, blindar, despejar.**

Cada ataque da Kaalia com a carga certa tira um oponente do jogo, porque a criatura que entra ataca o mesmo jogador que ela. A mesa cai em três ataques.

- Ataques por turno = 1 + combates extras em que ela é desvirada (Aurelia, Combat Celebrant).
- Cargas por ataque = 1, ou 2 com o Isshin.
- O que conta como "carga certa": uma criatura que mata ou trava o oponente no momento em que entra. Master of Cruelties, Terror of Mount Velus com Gisela, Subjugator Angel com qualquer coisa grande, Balefire Dragon.

Em linguagem de FP&A: a Kaalia é um ativo que converte estoque (cartas na mão) em resultado sem passar pelo caixa (mana). O deck de hoje tem estoque de sobra e uma linha de produção que para no turno em que a Kaalia leva a primeira remoção.

### 1.3 Onde a lista trai o plano, em ordem de gravidade

O seu plano é colocar em campo cartas fortes que façam a diferença quando entram. A ideia está certa. A lista trai a ideia em cinco pontos:

1. **A Kaalia não tem seguro.** Nenhuma Lightning Greaves, Swiftfoot Boots, Mother of Runes ou Grand Abolisher. Ela entra no turno 4 ou 5, passa uma volta inteira exposta como uma 2/2 voadora e lendária, e o deck inteiro depende dela atacar. Hoje há 2 peças baratas de blindagem (Boros Charm e Your Temple Is Under Attack), e as duas só protegem contra destruição.
2. **A cor falta antes da mana.** São 25 básicos, 6 deles Mountain. A Kaalia pede R, W e B na mesma volta. Com isso ela é conjurável até o turno 4 em 48% das partidas.
3. **Cinco tribais fortes que são fortes quando conjuradas, não quando postas:** Velomachus, Balor, Decadent Dragon, Shadrix e Varragoth. Pela Kaalia elas viram corpos voadores sem o efeito.
4. **Nenhum multiplicador.** Sem carta que dê segundo gatilho, a Kaalia despeja um gordo por turno, e a mesa tem uma volta inteira para responder a cada um.
5. **Cargas sem impacto imediato.** Das 29 tribais, só 16 têm Carga 2 ou 3, e só 4 têm Carga 3. Baneslayer, Archangel of Strife, Resolute Archangel e Sower of Discord entram e não mudam nada naquele turno.

### 1.4 As três fases

Você não descreveu fases. Proponho estas, e a tabela confronta a lista de hoje e a nova:

| Fase | O que o deck deve fazer | A lista de hoje | A lista nova | Avaliação |
|---|---|---|---|---|
| Início (turnos 1 a 3) | Ter R, W e B, um rock e uma peça de blindagem | Conjurável até o turno 3 em 24%; blindagem barata vista até o turno 4 em 19% | Conjurável até o turno 3 em 37%; blindagem vista até o turno 4 em 59% | Era o gargalo, e é o que mais muda |
| Meio (turnos 4 a 6) | A Kaalia ataca com bota ou com o Abolisher, e a carga muda a mesa ao entrar | Carga 3 na mão até o turno 5 em 38% | Carga 3 na mão até o turno 5 em 83% | A carga passa de corpo grande a efeito |
| Fim | Dois gatilhos por turno, dano dobrado ou o Master | Gisela é o único dobrador de dano; nenhum multiplicador de gatilho | 3 multiplicadores de gatilho e 5 dobradores de dano; Master of Cruelties | Fecha em um ou dois turnos depois que a Kaalia ataca |

---

## 2. Agrupamentos

Você não mandou eixos, então criei oito. Todos passam no crivo do handover: cada um mede uma função, eles se somam e cada um tem mais de meia dúzia de cartas, com uma exceção, Trava, que declaro abaixo.

| # | Eixo | O que mede |
|---|---|---|
| 1 | Ramp | Mana e cor a mais. Terreno que sempre entra virado leva −1 |
| 2 | Combustível | Compra e tutor: põe tribal na mão |
| 3 | Interação | Remoção e resposta à mesa |
| 4 | Blindagem | Mantém a Kaalia viva, ou dá ímpeto a ela |
| 5 | Carga | O que a criatura faz **no turno em que entra pela Kaalia**. Só tribais pontuam; gatilho de ataque vale 0 |
| 6 | Multiplicador | Mais gatilhos da Kaalia, ou dano dobrado |
| 7 | Trava | Impede a mesa de jogar normalmente |
| 8 | Fechamento | Encurta o jogo |

Ordem das notas: Ramp · Combustível · Interação · Blindagem · Carga · Multiplicador · Trava · Fechamento.

O eixo que importa é **Carga**, porque responde à pergunta que decide tudo: a carta é boa, ou é boa **pela Kaalia**? Uma Velomachus Lorehold tem texto de bomba e leva 1 em Carga. Trava tem poucas cartas (3 hoje e 3 na lista nova). Mantive o eixo porque ele separa o Grand Abolisher e a Drana and Linvala de qualquer criatura grande.

| Eixo | Dedicadas hoje | Na lista nova | Soma das notas hoje | Na lista nova |
|---|---|---|---|---|
| Ramp | 7 | 10 | 15 | 21 |
| Combustível | 10 | 12 | 40 | 35 |
| Interação | 12 | 13 | 36 | 41 |
| Blindagem | 5 | 16 | 12 | 39 |
| Carga | 16 | 27 | 50 | 73 |
| Multiplicador | 2 | 10 | 10 | 28 |
| Trava | 3 | 3 | 8 | 11 |
| Fechamento | 7 | 12 | 41 | 44 |

---

## 3. Carta a carta (lista atual)

As notas seguem a ordem da seção 2. A coluna "Por que aqui" já diz a fase e com que cartas a carta conversa.

### Comandante (1)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Kaalia of the Vast | 0·0·0·0·3·0·0·2 | S | INS | Voa. Ao atacar um oponente, põe da mão um Angel, Demon ou Dragon virado e atacando esse oponente | É o deck. Cada ataque converte uma carta da mão em 5 a 9 manas de criatura. Não tem vigilância nem proteção |

### Criaturas tribais (Angel, Demon, Dragon) (29)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Avacyn, Angel of Hope | 0·0·0·3·3·0·0·1 | S | INS | Voa, vigilância; você e suas permanentes ficam indestrutíveis | Oito manas de graça; blinda a Kaalia contra destruição |
| Balefire Dragon | 0·0·2·0·3·0·0·2 | S | INS | Dano de combate a jogador se repete em cada criatura dele | Limpeza unilateral que entra pela Kaalia |
| Gisela, Blade of Goldnight | 0·0·0·0·3·3·0·2 | S | INS | Voa, golpe inicial; dobra o dano aos oponentes, reduz à metade o seu | Dobra o dano do próprio turno em que entra |
| Archangel Avacyn | 0·0·1·2·2·0·0·0 | A | ALT | Lampejo; ao entrar, suas criaturas ficam indestrutíveis | Responde a limpeza; pela Kaalia, protege o ataque |
| Drana and Linvala | 0·0·1·0·2·0·3·0 | A | ALT | Trava habilidades ativadas das criaturas dos oponentes e as rouba | Trava barata que se conjura |
| Hoarding Broodlord | 0·3·0·0·3·0·0·0 | A | ALT | Ao entrar, tutor de qualquer carta para o exílio, que você pode jogar | Tutor no ETB: busca o próximo gordo |
| Lord of the Void | 0·1·0·0·2·0·0·1 | A | ALT | Dano de combate: exila 7 do topo do jogador e pega uma criatura | Gatilho de dano funciona pela Kaalia |
| Rakdos, Patron of Chaos | 0·2·1·0·2·0·0·1 | A | ALT | Fim do seu turno: oponente sacrifica 2 permanentes ou você compra 2 | Funciona no turno em que entra |
| Reya Dawnbringer | 0·1·0·0·2·0·0·1 | A | ALT | Reanima uma criatura por manutenção | Nove manas de graça; valor no turno seguinte |
| Sephara, Sky's Blade | 0·0·0·2·2·0·0·1 | A | ALT | Voa, vínculo; suas outras voadoras ficam indestrutíveis | A Kaalia voa: fica indestrutível |
| Valgavoth, Terror Eater | 0·1·0·1·2·0·1·1 | A | ALT | Voa, vínculo, ward de sacrificar 3; rouba o que vai para o cemitério alheio | Nove manas de graça e difícil de remover |
| Ancient Brass Dragon | 0·1·0·0·2·0·0·1 | B | MÉD | Dano de combate: d20, reanima de quaisquer cemitérios | Valor no dano |
| Ancient Gold Dragon | 0·0·0·0·2·0·0·2 | B | MÉD | Dano de combate: d20 fichas voadoras 1/1 | Exército no dano |
| Hellkite Tyrant | 0·0·1·0·2·0·0·1 | B | ALT | Dano de combate rouba os artefatos do jogador | Forte em mesa de rocks |
| Linvala, Keeper of Silence | 0·0·0·0·2·0·2·0 | B | MÉD | Criaturas dos oponentes não ativam habilidades | Redundante com Drana and Linvala |
| Shadowgrange Archfiend | 0·0·2·0·2·0·0·0 | B | MÉD | Ao entrar, cada oponente sacrifica a criatura de maior poder | Edito triplo ao entrar |
| Shadrix Silverquill | 0·1·0·0·1·1·0·1 | B | MÉD | Golpe duplo; no início do combate escolhe dois modos | Pela Kaalia o início do combate já passou (gatilho de ataque: não dispara pela Kaalia) |
| Ao, the Dawn Sky | 0·1·0·0·1·0·0·1 | C | MÉD | Voa, vigilância; ao morrer, dá valor | O valor está na morte |
| Archangel of Strife | 0·0·0·0·1·1·0·1 | C | BAX | Cada jogador escolhe guerra (+3/+0) ou paz (+0/+3) | Simétrico: a mesa escolhe paz contra você |
| Archangel of Thune | 0·0·0·0·1·1·0·1 | C | MÉD | Vínculo; ganhar vida põe +1/+1 em todo o time | Pouco ganho de vida na lista |
| Balor | 0·1·1·0·0·0·0·1 | C | BAX | Ao atacar ou morrer, modos punitivos | Pela Kaalia, só o gatilho de morte vale (gatilho de ataque: não dispara pela Kaalia) |
| Baneslayer Angel | 0·0·0·0·1·0·0·1 | C | MÉD | Voa, golpe inicial, vínculo, proteção contra Demons e Dragons | Corpo bom sem efeito ao entrar |
| Decadent Dragon | 1·1·0·0·1·0·0·1 | C | MÉD | Tesouro ao atacar; aventura rouba 2 cartas do topo | Pela Kaalia não gera tesouro (gatilho de ataque: não dispara pela Kaalia) |
| Indulgent Tormentor | 0·2·0·0·1·0·0·1 | C | MÉD | Manutenção: você compra, a menos que o oponente pague 3 de vida ou sacrifique | O oponente escolhe; lento |
| Resolute Archangel | 0·0·0·0·1·0·0·0 | C | BAX | Ao entrar, volta a vida à inicial se estiver abaixo | Efeito de pânico, sem impacto na mesa |
| Sower of Discord | 0·0·0·0·1·0·0·1 | C | BAX | Espelha o dano entre dois jogadores | Efeito pequeno para um slot tribal |
| Varragoth, Bloodsky Sire | 0·1·0·0·0·0·0·0 | C | BAX | Toque mortífero; Boast: tutor para o topo | Ruling: posto atacando não ativa Boast (gatilho de ataque: não dispara pela Kaalia) |
| Velomachus Lorehold | 0·1·0·0·1·0·0·1 | C | MÉD | Ao atacar, conjura de graça mágica de até 5 manas | Pela Kaalia o gatilho de ataque não dispara (gatilho de ataque: não dispara pela Kaalia) |
| Piru, the Volatile | 0·0·1·0·1·0·0·1 | D | BAX | Manutenção RWB ou sacrifica; ao morrer, 7 em cada criatura não lendária | Custa mana todo turno e mata o seu lado |

### Instantâneas e feitiços (17)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Boros Charm | 0·0·0·2·0·1·0·1 | A | ALT | 4 de dano, indestrutível ou golpe duplo | A peça de proteção mais barata da lista |
| Demonic Counsel | 0·2·0·0·0·0·0·0 | A | ALT | Busca um Demon; com Delirium, qualquer carta | Tutor tribal de 2 manas |
| Path to Exile | 0·0·3·0·0·0·0·0 | A | INS | Exila criatura | Remoção de 1 mana |
| Ruinous Ultimatum | 0·0·3·0·0·0·0·2 | A | ALT | Destrói todas as permanentes não terreno dos oponentes | Limpeza unilateral; custo RRWWWBB |
| Terminate | 0·0·3·0·0·0·0·0 | A | ALT | Destrói criatura | Remoção limpa |
| Vindicate | 0·0·3·0·0·0·0·0 | A | ALT | Destrói permanente | Responde a qualquer coisa |
| Abstruse Appropriation | 0·1·2·0·0·0·0·0 | B | MÉD | Exila permanente não terreno; você pode conjurá-lo | Remoção que vira carta |
| Damn | 0·0·2·0·0·0·0·0 | B | ALT | Destrói criatura; sobrecarga destrói todas | Flexível; a sobrecarga mata a Kaalia |
| Power Word Kill | 0·0·2·0·0·0·0·0 | B | MÉD | Destrói criatura que não seja Angel, Demon, Devil ou Dragon | Bom, mas não mata os gordos do espelho |
| Raise the Draugr | 0·2·0·0·0·0·0·0 | B | MÉD | Devolve 1 criatura do cemitério à mão, ou 2 do mesmo tipo | Recarrega a mão com dois Angels ou dois Dragons |
| Read the Bones | 0·2·0·0·0·0·0·0 | B | MÉD | Vidência 2, compra 2, perde 2 | Combustível honesto |
| Sign in Blood | 0·2·0·0·0·0·0·0 | B | MÉD | Compra 2, perde 2 | Combustível honesto |
| Your Temple Is Under Attack | 0·1·0·2·0·0·0·0 | B | MÉD | Indestrutível ou você e um oponente compram 2 | Proteção contra destruição |
| Entreat the Dead | 0·1·0·0·0·0·0·1 | C | MÉD | Devolve X criaturas do seu cemitério ao campo | Caro; o deck não enche o cemitério |
| Fatal Push | 0·0·2·0·0·0·0·0 | C | MÉD | Destrói criatura MV 2 (4 com Revolt) | Teto baixo no Commander |
| Path of Peril | 0·0·2·0·0·0·0·0 | C | BAX | Destrói criaturas MV 2 ou menos; com Cleave, todas | Por 6, mata o seu lado também |
| Thrilling Encore | 0·1·0·0·0·0·0·1 | C | BAX | Rouba todas as criaturas que morreram no turno | Depende de limpeza na mesma volta |

### Artefatos (13)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Sol Ring | 3·0·0·0·0·0·0·0 | S | INS | {T}: {C}{C} | Kaalia no turno 3 |
| Arcane Signet | 2·0·0·0·0·0·0·0 | A | INS | Uma cor da identidade | Conserta as três cores |
| Boros Signet | 2·0·0·0·0·0·0·0 | B | MÉD | {1},{T}: {R}{W} | Filtra para vermelho, que falta |
| Embercleave | 0·0·0·0·0·2·0·2 | B | MÉD | Lampejo; +1/+1, golpe duplo, atropelar | Bom na criatura que entrou atacando; na Kaalia, golpe duplo não dá segundo gatilho |
| Orzhov Signet | 2·0·0·0·0·0·0·0 | B | MÉD | {1},{T}: {W}{B} | Rock de cor |
| Rakdos Signet | 2·0·0·0·0·0·0·0 | B | MÉD | {1},{T}: {B}{R} | Rock de cor |
| Mind Stone | 2·1·0·0·0·0·0·0 | C | MÉD | Incolor; sacrifica e compra | Incolor não paga a Kaalia |
| Savai Crystal | 1·0·0·0·0·0·0·0 | C | BAX | R, W ou B; reciclar | Rock de 3 chega tarde para a Kaalia |
| Strixhaven Stadium | 1·0·0·0·0·0·0·2 | C | MÉD | Incolor; marcador por dano de combate; 10 marcadores derrotam o jogador | Fechamento alternativo lento; volta a zero quando você toma dano |
| Wedding Ring | 0·2·0·0·0·0·0·0 | C | BAX | Dá uma cópia a um oponente; você compra quando ele compra | Simétrico: dá cartas a um oponente |
| Ghirapur Orrery | 1·1·0·0·0·0·0·0 | D | BAX | Terreno extra para todos; mão vazia compra 3 | Simétrico: acelera a mesa inteira |
| Infiltration Lens | 0·1·0·0·0·0·0·0 | D | BAX | Compra 2 quando a equipada é bloqueada | A Kaalia voa e quase nunca é bloqueada |
| Two-Handed Axe | 0·0·0·0·0·1·0·1 | D | BAX | Dobra o poder ao atacar; aventura dá golpe duplo | Lento e pequeno |

### Encantamentos e planeswalker (6)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Smothering Tithe | 2·0·0·0·0·0·0·0 | A | ALT | Tesouro quando oponente compra, se ele não pagar 2 | Game Changer; mana grande para conjurar gordos se a Kaalia cair |
| Call of the Ring | 0·2·0·0·0·0·0·0 | B | MÉD | O Anel tenta a cada manutenção; 2 de vida: compra 1 | Compra por turno; a Kaalia portadora fica difícil de bloquear |
| Sorin Markov | 0·0·1·0·0·0·0·2 | B | MÉD | +2: 2 de dano; −3: vida do oponente vira 10 | Encurta o jogo de um oponente; não é tribal |
| Unholy Annex // Ritual Chamber | 0·2·0·0·0·0·0·1 | B | MÉD | Compra no fim do turno; com Demon drena 2 | Combustível com dreno; perde 2 sem Demon |
| Darksteel Mutation | 0·0·2·0·0·0·0·0 | C | MÉD | Criatura vira inseto 0/1 sem habilidades | Aura frágil |
| Ghostly Prison | 0·0·0·0·0·0·2·0 | C | MÉD | Atacar você custa 2 por criatura | Protege a sua vida, não a Kaalia |

### Terrenos (34)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Command Tower | 0·0·0·0·0·0·0·0 | A | INS | Qualquer cor da identidade | Melhor terreno do deck |
| Exotic Orchard | 0·0·0·0·0·0·0·0 | B | ALT | Cor que um terreno de oponente produz | Depende da mesa; bom com oponentes Mardu |
| 6× Mountain | 0·0·0·0·0·0·0·0 | B | MÉD | R | Só 6 fontes básicas de vermelho |
| 9× Plains | 0·0·0·0·0·0·0·0 | B | MÉD | W | Base de mana sem dupla |
| Savai Triome | -1·0·0·0·0·0·0·0 | B | ALT | R/W/B, entra virado, reciclar | O único terreno que dá as três cores |
| 10× Swamp | 0·0·0·0·0·0·0·0 | B | MÉD | B | Base de mana sem dupla |
| Bojuka Bog | -1·0·1·0·0·0·0·0 | C | MÉD | Entra virado; exila um cemitério; B | Ódio de cemitério de bolso; custa tempo |
| Monumental Henge | 0·1·0·0·0·0·0·0 | C | MÉD | W; {2}{W}{W},{T}: olha 5 e pega um histórico | Pega lendária ou artefato; quase só a mana importa |
| Shattered Landscape | 0·0·0·0·0·0·0·0 | C | MÉD | Incolor; sacrifica e busca básico virado | Conserta cor devagar |
| Temple of Silence | -1·1·0·0·0·0·0·0 | C | MÉD | W/B, entra virado, vidência 1 | Dupla lenta, sem vermelho |
| Cathedral of War | -1·0·0·0·0·0·0·0 | D | BAX | Entra virado; exaltado; incolor | Incolor e virado num deck de três cores; exaltado dá +1/+1 à Kaalia sozinha |
| Rogue's Passage | 0·0·0·0·0·0·0·1 | D | BAX | Incolor; {4},{T}: criatura não pode ser bloqueada | A Kaalia já voa; incolor custa cor |


---

## 4. Diagnóstico

### 4.1 Faixas

| Item | Hoje | Faixa | Leitura |
|---|---|---|---|
| Fontes de terreno | 34 | 35 a 37 | Abaixo, e com cor ruim |
| Ramp dedicado | 7 | 10 a 12 | Abaixo. Três Signets e um Mind Stone, nenhum acelera a Kaalia para o turno 3 com cor |
| Combustível dedicado | 10 | 10 a 12 | Na faixa, mas é compra genérica de 2 cartas. Tutores: 2 |
| Interação dedicada | 12 | 8 a 12 | Na faixa, com teto baixo (Fatal Push, Power Word Kill, Darksteel Mutation) |
| Limpezas | Ruinous Ultimatum, Damn sobrecarregado, Path of Peril com Cleave | 3 a 5 | Duas das três matam a própria Kaalia |

### 4.2 Gerar e converter

| Gera | Converte |
|---|---|
| 29 tribais e 10 cartas de compra: a mão nunca fica sem combustível. Chance de ter 2 tribais na mão até o turno 5: 89% | Uma comandante 2/2 sem proteção, 2 peças baratas de blindagem e nenhum multiplicador |

É o desequilíbrio mais claro de todos os decks da série. O lado de gerar está cheio, e o de converter depende de uma única carta que a mesa vê chegar com uma volta de antecedência.

### 4.3 Concentração na comandante

Total. Sem a Kaalia, o deck vira um Mardu de sete manas com 29 criaturas caras e 8 rocks. A pergunta é quantas vezes ela consegue atacar antes de morrer, e hoje a resposta mais comum é uma ou nenhuma.

### 4.4 Anti-sinergias pelo nome

- **Piru, the Volatile:** cobra R, W e B em toda manutenção, o mesmo mana que a Kaalia pede. Ao morrer, causa 7 a cada criatura **não lendária**: a Kaalia sobrevive, o resto do seu campo morre.
- **Damn sobrecarregado e Path of Peril com Cleave:** matam a Kaalia.
- **Power Word Kill:** não mata Angel, Demon, Devil nem Dragon. No espelho Kaalia ou contra qualquer deck de dragões, é carta morta.
- **Archangel of Strife:** cada jogador escolhe, e a mesa escolhe paz contra você.
- **Ghirapur Orrery e Wedding Ring:** simétricos. Dão terreno e cartas aos oponentes.
- **Cathedral of War:** exaltado dá +1/+1 à Kaalia quando ela ataca sozinha. É o único ponto do deck que gosta dela pequena e sozinha.

### 4.5 Poder e brackets

- **Hoje:** um Game Changer (Smothering Tithe), nenhum combo. Bracket 3 com folga. Pela execução, joga como um Bracket 2 forte.
- **Lista nova:** 10 Game Changers (Ancient Tomb, Chrome Mox, Demonic Tutor, Imperial Seal, Mana Vault, Necropotence, Smothering Tithe, Teferi's Protection, The One Ring, Vampiric Tutor). Bracket 4.
- O par Kaalia e Master of Cruelties elimina um oponente por ataque. Não é combo infinito, e a regra do Bracket 3 que eu conferi (mtg.wiki) proíbe combo infinito de duas cartas montado cedo. Mesmo assim, é a linha que a mesa vai sentir. Deixo a decisão com você.

### 4.6 Distribuição e placar

| | S | A | B | C | D | INS | ALT | MÉD | BAX |
|---|---|---|---|---|---|---|---|---|---|
| Atual | 5 | 17 | 47 | 25 | 6 | 8 | 18 | 59 | 15 |
| Nova | 18 | 43 | 39 | 0 | 0 | 22 | 47 | 31 | 0 |

Hoje há 15 BAX, acima dos 8 a 10 esperados. Na lista nova não há BAX nem C, o que é natural numa reconstrução. As 31 MÉD são quase todas terrenos intercambiáveis.

Placar atual: **244**. Partes: CMC médio de 4,34 dá 2 pontos; aceleração dá 30; a soma das notas dá 212. Só compara o deck com ele mesmo.

| Valor de mana | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8+ |
|---|---|---|---|---|---|---|---|---|---|
| Atual (não terreno) | 0 | 4 | 14 | 11 | 7 | 8 | 5 | 11 | 5 |
| Atual, só tribais | 0 | 0 | 0 | 1 | 3 | 7 | 3 | 10 | 5 |
| Nova (não terreno) | 1 | 7 | 13 | 9 | 6 | 6 | 4 | 11 | 7 |
| Nova, só tribais | 0 | 0 | 0 | 0 | 2 | 6 | 4 | 10 | 7 |

---

## 5. Combos e linhas

**Combos de verdade.** Na lista de hoje, nenhum. O Commander Spellbook lista um só com a Kaalia: **Kaalia + Master of Cruelties** (combo 29-137). O Master entra atacando, e se não for bloqueado a vida do oponente vira 1; a Kaalia, voando, causa o dano que falta. O Master entra na lista nova.

**Motores (lista nova).**
- **Isshin:** duas criaturas por ataque.
- **Terror of the Peaks:** cada criatura que a Kaalia põe causa dano igual ao poder dela a qualquer alvo. Uma Serra's Emissary vale 7 na cara de alguém antes do combate.
- **Rakdos, Patron of Chaos e Skyline Despot:** compra no fim do turno, que repõe o combustível gasto.
- **Liesa e Avacyn, Angel of Horror:** a Kaalia que morre volta (seção 9).

**Fechamentos (lista nova), um oponente por ataque.**

1. **Master + Subjugator Angel com Isshin.** Os dois gatilhos resolvem no passo de declarar atacantes. O Subjugator vira todas as criaturas do oponente, ninguém bloqueia, a vida dele vira 1 e a Kaalia fecha.
2. **Terror of Mount Velus + Gisela com Isshin.** O Velus dá golpe duplo a todo o time antes do dano. Kaalia 2, Gisela 5 e Velus 5 somam 12; com golpe duplo são 24; a Gisela dobra para 48. Com a Neriv em campo, Gisela e Velus entraram no turno e dobram de novo.
3. **Aurelia conjurada, com ímpeto.** Ela ataca com a Kaalia, desvira tudo e dá um segundo combate. A Kaalia ataca um segundo oponente com a carga seguinte.
4. **Balefire Dragon** contra quem tem mesa larga: o dano se repete em cada criatura do jogador.
5. **Archfiend of Despair:** no fim do turno, o oponente perde de novo tudo o que perdeu. Com Gisela ou Twinflame Tyrant, qualquer ataque vira letal.

---

## 6. Cortes: as dez primeiras a sair

1. **Piru, the Volatile.** Cobra RWB por turno e mata o seu campo ao morrer.
2. **Infiltration Lens.** A Kaalia voa e quase nunca é bloqueada.
3. **Two-Handed Axe.** Lento e pequeno.
4. **Cathedral of War.** Incolor, entra virado, e o exaltado só serve se a Kaalia atacar sozinha.
5. **Ghirapur Orrery.** Acelera a mesa inteira.
6. **Varragoth.** O Boast não funciona pela Kaalia (ruling de 2021). Sobra um 2/3 com toque mortífero.
7. **Velomachus Lorehold.** Tudo o que ele faz depende de atacar. Posto, é um 5/5.
8. **Balor.** Idem; só o gatilho de morte vale.
9. **Archangel of Strife.** A mesa escolhe paz.
10. **Resolute Archangel.** Sete manas para voltar a vida a 40 quando o deck está ganhando.

---

## 7. A reconstrução

### 7.1 O que a varredura encontrou

- **Tribais com ETB que limpam o bloqueio antes dele acontecer:**
  - Subjugator Angel vira todas as criaturas do oponente.
  - Angel of Serenity exila três.
  - Archfiend of Depravity é uma limpeza unilateral recorrente.
  - Serra's Emissary, nomeando criatura, deixa você e as suas criaturas com proteção contra criaturas.
- **O dobrador que só faz sentido na Kaalia:** Neriv, Heart of the Storm (Tarkir: Dragonstorm). As criaturas que entraram no turno causam o dobro de dano, e tudo o que a Kaalia põe entrou no turno. É Mardu, custa 4 e se conjura.
- **Terror of Mount Velus**, a carta não óbvia de maior impacto. O ETB dá golpe duplo ao time, e pela Kaalia ele entra antes do dano.
- **Kaalia, Zenith Seeker:** por 3 manas, pega até um Angel, um Demon e um Dragon entre os 6 do topo.
- **As armadilhas mais usadas no EDHREC:** Drakuseth (29,1% dos decks) e Scourge of the Throne (19,7%). As duas dependem de gatilho de ataque e, pela Kaalia, não fazem nada no turno em que entram.

### 7.2 A ideia da lista nova em uma frase

A Kaalia entra cedo, ataca no mesmo turno ou com proteção, e cada ataque despeja uma criatura que decide o combate antes dos bloqueios. Com o Isshin, despeja duas.

### 7.3 As trocas

São 71 saídas e 71 entradas. Das saídas, 49 são cartas não básicas e 22 são básicos. Das entradas, 29 são terrenos: a base de mana é metade da reconstrução.

| Função | Saem | Entram | O que muda |
|---|---|---|---|
| **Base de mana** (29 entram) | Bojuka Bog, Cathedral of War, Rogue's Passage, Shattered Landscape, Temple of Silence, Monumental Henge, 5 Mountain, 8 Plains, 9 Swamp | Plateau, Scrubland, Badlands, Sacred Foundry, Godless Shrine, Blood Crypt, Arid Mesa, Marsh Flats, Bloodstained Mire, Flooded Strand, Windswept Heath, Scalding Tarn, Polluted Delta, Battlefield Forge, Caves of Koilos, Sulfurous Springs, Mana Confluence, City of Brass, Urborg, Tomb of Yawgmoth, Inspiring Vantage, Concealed Courtyard, Blackcleave Cliffs, Clifftop Retreat, Isolated Chapel, Dragonskull Summit, Spectator Seating, Luxury Suite, Ancient Tomb, Arena of Glory | Três cores sem virado: duais com tipo, fetches que as buscam, Ancient Tomb e Arena of Glory (ímpeto) |
| **Mana** (6 entram) | Boros Signet, Orzhov Signet, Rakdos Signet, Mind Stone, Savai Crystal, Strixhaven Stadium, Ghirapur Orrery | Mana Vault, Chrome Mox, Talisman of Conviction, Talisman of Hierarchy, Talisman of Indulgence, Fellwar Stone | Rocks que entregam cor sem pedir mana de entrada; Kaalia no turno 2 ou 3 |
| **Blindagem** (8 entram) | Your Temple Is Under Attack, Ghostly Prison, Two-Handed Axe, Infiltration Lens, Embercleave | Lightning Greaves, Swiftfoot Boots, Mother of Runes, Grand Abolisher, Teferi's Protection, Flawless Maneuver, Deflecting Swat, Akroma's Will | A Kaalia ataca no turno em que entra e sobrevive à resposta |
| **Multiplicador** (3 entram) | Sorin Markov | Isshin, Two Heavens as One, Combat Celebrant, Aurelia, the Warleader | Mais de um gatilho da Kaalia por turno |
| **Carga** (16 entram) | Balor, Varragoth, Bloodsky Sire, Velomachus Lorehold, Decadent Dragon, Shadrix Silverquill, Piru, the Volatile, Ao, the Dawn Sky, Ancient Gold Dragon, Ancient Brass Dragon, Baneslayer Angel, Archangel of Thune, Archangel of Strife, Resolute Archangel, Linvala, Keeper of Silence, Indulgent Tormentor, Sower of Discord, Shadowgrange Archfiend | Serra's Emissary, Angel of Serenity, Angel of Despair, Liesa, Forgotten Archangel, Subjugator Angel, Avacyn, Angel of Horror, Master of Cruelties, Rune-Scarred Demon, Archfiend of Depravity, Archfiend of Despair, Skyline Despot, Griselbrand, Terror of the Peaks, Twinflame Tyrant, Neriv, Heart of the Storm, Terror of Mount Velus | Tribais que mudam a mesa no instante em que entram atacando |
| **Combustível** (6 entram) | Read the Bones, Sign in Blood, Call of the Ring, Unholy Annex // Ritual Chamber, Wedding Ring, Raise the Draugr | Kaalia, Zenith Seeker, Demonic Tutor, Vampiric Tutor, Imperial Seal, Necropotence, The One Ring | Trocar compra de duas cartas genéricas por tutor e por compra que acha tribal |
| **Interação** (3 entram) | Fatal Push, Power Word Kill, Darksteel Mutation, Abstruse Appropriation, Path of Peril, Entreat the Dead, Thrilling Encore | Swords to Plowshares, Anguished Unmaking, Deadly Rollick | Remoção que cobre qualquer coisa, e grátis no turno de ataque; o resto da remoção agora vem nas tribais |

Função de cada entrada fora da base de mana:

| Entra | Notas | Tier | Relev. | Função neste deck |
|---|---|---|---|---|
| Mana Vault | 3·0·0·0·0·0·0·0 | A | ALT | Game Changer; Kaalia no turno 2 |
| Chrome Mox | 2·0·0·0·0·0·0·0 | A | ALT | Game Changer; mana de cor no turno 1 |
| Talisman of Conviction | 2·0·0·0·0·0·0·0 | B | ALT | Rock de cor que não pede mana de entrada |
| Talisman of Hierarchy | 2·0·0·0·0·0·0·0 | B | ALT | Idem |
| Talisman of Indulgence | 2·0·0·0·0·0·0·0 | B | ALT | Idem |
| Fellwar Stone | 2·0·0·0·0·0·0·0 | B | MÉD | Rock de 2; depende da mesa |
| Lightning Greaves | 0·0·0·3·0·0·0·0 | S | INS | A Kaalia ataca no turno em que entra e não pode ser alvo |
| Swiftfoot Boots | 0·0·0·3·0·0·0·0 | S | INS | Redundância da Greaves |
| Mother of Runes | 0·0·0·2·0·0·0·0 | A | ALT | Protege a Kaalia todo turno por 1 mana |
| Grand Abolisher | 0·0·0·3·0·0·2·0 | S | INS | O turno de ataque fica sem resposta |
| Teferi's Protection | 0·0·0·3·0·0·0·0 | A | ALT | Game Changer; salva a mesa inteira |
| Flawless Maneuver | 0·0·0·2·0·0·0·0 | A | ALT | Resposta grátis a limpeza |
| Deflecting Swat | 0·0·1·2·0·0·0·0 | A | ALT | Resposta grátis a remoção pontual |
| Akroma's Will | 0·0·0·2·0·2·0·2 | A | ALT | Proteção e fechamento na mesma carta |
| Isshin, Two Heavens as One | 0·0·0·0·0·3·0·1 | S | INS | Duas criaturas por ataque da Kaalia |
| Combat Celebrant | 0·0·0·0·0·3·0·1 | A | ALT | A Kaalia desvira e ataca de novo: segundo gatilho |
| Aurelia, the Warleader | 0·0·0·0·1·3·0·2 | S | INS | Conjurada, ataca na hora e a Kaalia ataca duas vezes. Posta pela Kaalia, não dispara naquele turno |
| Serra's Emissary | 0·0·1·2·3·0·3·1 | S | INS | Nomeando criatura, ninguém bloqueia e nada de criatura mira a Kaalia |
| Angel of Serenity | 0·0·3·0·3·0·0·1 | A | ALT | Tira três bloqueadores antes do bloqueio |
| Angel of Despair | 0·0·2·0·2·0·0·0 | A | ALT | Remoção que vem de graça |
| Liesa, Forgotten Archangel | 0·1·0·2·1·0·0·0 | A | ALT | Os gordos voltam como combustível |
| Subjugator Angel | 0·0·1·0·3·0·0·2 | A | ALT | Entra antes dos bloqueios: ninguém bloqueia |
| Avacyn, Angel of Horror | 0·0·0·2·2·0·0·1 | A | ALT | A mesa precisa exilar, não destruir |
| Master of Cruelties | 0·0·0·0·3·0·0·3 | S | INS | Pela Kaalia o gatilho dispara (ruling de 2013): a Kaalia fecha |
| Rune-Scarred Demon | 0·3·0·0·3·0·0·0 | S | INS | Repõe o combustível que acabou de gastar |
| Archfiend of Depravity | 0·0·3·0·3·0·1·1 | S | INS | Limpeza unilateral recorrente |
| Archfiend of Despair | 0·0·0·0·3·2·1·2 | A | ALT | Dobra o dano do turno em que entra |
| Skyline Despot | 0·2·0·0·3·0·0·1 | A | ALT | Compra extra por turno; a Kaalia voadora defende a coroa |
| Griselbrand | 0·3·0·0·2·0·0·1 | A | ALT | Recarrega a mão de uma vez |
| Terror of the Peaks | 0·0·2·0·2·2·0·2 | S | INS | Cada gordo da Kaalia vira uma bola de fogo |
| Twinflame Tyrant | 0·0·0·0·3·3·0·2 | S | INS | Segunda Gisela por 5 |
| Neriv, Heart of the Storm | 0·0·0·0·2·3·0·2 | A | ALT | Tudo o que a Kaalia põe bate em dobro |
| Terror of Mount Velus | 0·0·0·0·3·3·0·3 | S | INS | Entra antes do dano: o ataque inteiro bate duas vezes |
| Kaalia, Zenith Seeker | 0·3·0·0·0·0·0·0 | A | ALT | Até três cartas de combustível por 3 manas |
| Demonic Tutor | 0·3·0·0·0·0·0·0 | S | INS | Game Changer |
| Vampiric Tutor | 0·2·0·0·0·0·0·0 | A | ALT | Game Changer |
| Imperial Seal | 0·2·0·0·0·0·0·0 | A | ALT | Game Changer |
| Necropotence | 0·3·0·0·0·0·0·0 | A | ALT | Game Changer; recarrega a mão de gordos |
| The One Ring | 0·3·0·2·0·0·0·0 | A | ALT | Game Changer; compra e uma volta de seguro |
| Swords to Plowshares | 0·0·3·0·0·0·0·0 | A | INS | Remoção de 1 mana |
| Anguished Unmaking | 0·0·3·0·0·0·0·0 | A | ALT | Responde a qualquer coisa |
| Deadly Rollick | 0·0·2·0·0·0·0·0 | A | ALT | Remoção grátis no turno de ataque |

Ficam 26 cartas da lista de hoje e 3 básicos. São elas: a Kaalia, as 12 tribais de Carga 2 ou 3 (Gisela, Avacyn, Archangel Avacyn, Sephara, Drana and Linvala, Reya, Lord of the Void, Rakdos, Valgavoth, Balefire, Hoarding Broodlord, Hellkite Tyrant), Sol Ring, Arcane Signet, Smothering Tithe, Demonic Counsel, Path to Exile, Terminate, Vindicate, Damn, Ruinous Ultimatum, Boros Charm, Command Tower, Exotic Orchard e Savai Triome.

### 7.4 Antes e depois

| Medida | Atual | Lista nova | Faixa |
|---|---|---|---|
| Fontes de terreno | 34 | 35 | 35 a 37 |
| Kaalia conjurável até o turno 3 (simulação) | 24% | 37% |  |
| Kaalia conjurável até o turno 4 (simulação) | 48% | 68% |  |
| Kaalia conjurável até o turno 5 (simulação) | 58% | 78% |  |
| Ramp dedicado (nota 2 ou 3) | 7 | 10 | 10 a 12 |
| Combustível dedicado (compra e tutor) | 10 | 12 | 10 a 12 |
| Tutores | 2 | 7 |  |
| Interação dedicada | 12 | 13 | 8 a 12 |
| Blindagem barata da Kaalia | 2 | 8 |  |
| Chance de ver blindagem barata até o turno 4 | 19% | 59% |  |
| Multiplicadores de gatilho | 0 | 3 |  |
| Dobradores de dano | 1 | 5 |  |
| Tribais (Angel, Demon, Dragon) | 29 | 29 |  |
| Tribais com Carga 2 ou 3 | 16 | 27 |  |
| Tribais com Carga 3 | 4 | 14 |  |
| Chance de ter Carga 3 na mão até o turno 5 | 38% | 83% |  |
| Tribais cujo valor está no gatilho de ataque | 5 | 0 |  |
| Game Changers | 1 | 10 |  |
| CMC médio (não terreno) | 4,34 | 4,27 |  |
| Placar | 244 | 339 | só compara o deck com ele mesmo |

Placar da lista nova: **339**. Partes: CMC médio de 4,27 dá 2 pontos; aceleração dá 45; a soma das notas dá 292.

**Conversão para Bracket 3.** Fique com três Game Changers: Smothering Tithe, Demonic Tutor e Teferi's Protection. Troque os outros sete:

| Sai | Entra |
|---|---|
| Mana Vault | Lotus Petal |
| Chrome Mox | Dark Ritual (paga o B e o genérico da Kaalia) |
| Ancient Tomb | Vault of Champions |
| Vampiric Tutor | Diabolic Intent |
| Imperial Seal | Emeritus of Woe (o "prepare" dá uma cópia de Demonic Tutor, e o JSON diz que não é Game Changer) |
| Necropotence | Phyrexian Arena |
| The One Ring | Lavaspur Boots |

Mesmo nessa versão, o Master continua matando um oponente por ataque.

### 7.5 Como a lista nova ganha

1. **Turno 2 ou 3:** um rock e uma bota, ou o Grand Abolisher.
2. **Turno 3 ou 4:** a Kaalia entra. Com Greaves, Boots ou Arena of Glory, ataca no mesmo turno.
3. **Primeiro ataque:** carga de efeito imediato. Subjugator, Angel of Serenity ou Archfiend of Depravity tiram a defesa. Rune-Scarred Demon ou Hoarding Broodlord buscam o fechamento.
4. **Segundo ou terceiro ataque:** Isshin, Aurelia ou Celebrant dão dois gatilhos, e o Master, o Velus com Gisela ou a Balefire tiram um oponente por ataque.

Seguro do turno de ataque: Grand Abolisher, Deflecting Swat, Flawless Maneuver e Teferi's Protection. Seguro da Kaalia fora do turno: botas, Mother of Runes, Sephara, Avacyn, Liesa e Avacyn, Angel of Horror.

### 7.6 Tudo o que foi considerado

| Carta | Veredito | Motivo |
|---|---|---|
| Bloodthirster | Fora | O combate extra não desvira a Kaalia, que não tem vigilância. Só ganha valor com Celebrant ou Aurelia |
| Skyline Despot | Dentro | Monarca no ETB; a Kaalia voadora defende a coroa |
| Wardscale Dragon | Banco, 1º | Atacando, o defensor não conjura mágicas. Entra no lugar da Hellkite Tyrant se a mesa tiver poucos artefatos |
| Archangel of Tithes | Banco, 2º | Taxa bloqueio atacando; se conjura no turno 4 |
| Bloodletter of Aclazotz | Banco, 3º | No seu turno, oponentes perdem o dobro. Dobrador de 4 manas, mas frágil |
| Angelic Arbiter | Banco | Trava forte, mas chega tarde |
| Ancient Copper Dragon | Banco | Tesouros no dano. Bom, porém o deck já fecha |
| Archfiend of Sorrows | Banco | −2/−2 só nos oponentes. Bom contra mesa de fichas |
| Goremand e Vile Mutilator | Banco | Pela Kaalia, o sacrifício de custo não se paga, e o ETB vira edito grátis. São fortes; perderam vaga para cargas que matam |
| Summon: Bahamut | Banco | Saga Dragon de 9; o capítulo I destrói uma permanente ao entrar |
| Kardur, Doomscourge | Banco | Esvazia bloqueadores no turno seguinte |
| Moraug e Karlach | Banco | Combates extras, mas não são tribais e custam 6 e 5 |
| Helm of the Host | Banco | Copia a Kaalia todo combate; lento demais |
| Dragon Tempest | Banco | Dá ímpeto à Kaalia; as botas fazem melhor |
| Vilis e Razaketh | Banco | Fortes, mas oito manas que a mesa já viu |
| Linvala, Keeper of Silence | Sai | Redundante com a Drana and Linvala, que trava e rouba |
| Shadowgrange Archfiend | Sai | Bom edito; perdeu para a Archfiend of Depravity, que repete |
| Ancient Gold e Ancient Brass | Saem | Dependem de dado e de conectar; as cargas novas decidem antes do bloqueio |
| Raise the Draugr | Sai | Boa recarga; perdeu para tutor |
| Sorin Markov | Sai | Não é tribal e custa 6 |
| Drakuseth, Scourge of the Throne, Utvara Hellkite, Hellkite Charger, Glorybringer | Recusadas | Gatilho de ataque. Pela Kaalia, não fazem nada no turno em que entram |
| Sunblast Angel | Recusada | Destrói criaturas viradas, a Kaalia e ela mesma |
| Shefet Archfiend | Recusada | −2/−2 em todas as outras criaturas mata a Kaalia |
| Rakdos, the Showstopper | Recusada | A moeda pode destruir a Kaalia, que é Human |
| Archfiend of the Dross | Recusada | Relógio de derrota |
| Fireshrieker | Recusada | Golpe duplo na Kaalia não dá segundo gatilho |
| Herald's Horn e Urza's Incubator | Recusadas | Escolhem um tipo só, e a Kaalia é Human Cleric |
| Jeweled Lotus | Recusada | Banida |

### 7.7 A lista completa

**Comandante (1)**

- 1 Kaalia of the Vast

**Tribais: Angels, Demons e Dragons (29)**

- 1 Angel of Despair
- 1 Angel of Serenity
- 1 Archangel Avacyn
- 1 Archfiend of Depravity
- 1 Archfiend of Despair
- 1 Aurelia, the Warleader
- 1 Avacyn, Angel of Hope
- 1 Avacyn, Angel of Horror
- 1 Balefire Dragon
- 1 Drana and Linvala
- 1 Gisela, Blade of Goldnight
- 1 Griselbrand
- 1 Hellkite Tyrant
- 1 Hoarding Broodlord
- 1 Liesa, Forgotten Archangel
- 1 Lord of the Void
- 1 Master of Cruelties
- 1 Neriv, Heart of the Storm
- 1 Rakdos, Patron of Chaos
- 1 Reya Dawnbringer
- 1 Rune-Scarred Demon
- 1 Sephara, Sky's Blade
- 1 Serra's Emissary
- 1 Skyline Despot
- 1 Subjugator Angel
- 1 Terror of Mount Velus
- 1 Terror of the Peaks
- 1 Twinflame Tyrant
- 1 Valgavoth, Terror Eater

**Outras criaturas (5)**

- 1 Combat Celebrant
- 1 Grand Abolisher
- 1 Isshin, Two Heavens as One
- 1 Kaalia, Zenith Seeker
- 1 Mother of Runes

**Blindagem (7)**

- 1 Akroma's Will
- 1 Boros Charm
- 1 Deflecting Swat
- 1 Flawless Maneuver
- 1 Lightning Greaves
- 1 Swiftfoot Boots
- 1 Teferi's Protection

**Combustível (6)**

- 1 Demonic Counsel
- 1 Demonic Tutor
- 1 Imperial Seal
- 1 Necropotence
- 1 The One Ring
- 1 Vampiric Tutor

**Interação (8)**

- 1 Anguished Unmaking
- 1 Damn
- 1 Deadly Rollick
- 1 Path to Exile
- 1 Ruinous Ultimatum
- 1 Swords to Plowshares
- 1 Terminate
- 1 Vindicate

**Mana (9)**

- 1 Arcane Signet
- 1 Chrome Mox
- 1 Fellwar Stone
- 1 Mana Vault
- 1 Smothering Tithe
- 1 Sol Ring
- 1 Talisman of Conviction
- 1 Talisman of Hierarchy
- 1 Talisman of Indulgence

**Terrenos (35)**

- 1 Ancient Tomb
- 1 Arena of Glory
- 1 Arid Mesa
- 1 Badlands
- 1 Battlefield Forge
- 1 Blackcleave Cliffs
- 1 Blood Crypt
- 1 Bloodstained Mire
- 1 Caves of Koilos
- 1 City of Brass
- 1 Clifftop Retreat
- 1 Command Tower
- 1 Concealed Courtyard
- 1 Dragonskull Summit
- 1 Exotic Orchard
- 1 Flooded Strand
- 1 Godless Shrine
- 1 Inspiring Vantage
- 1 Isolated Chapel
- 1 Luxury Suite
- 1 Mana Confluence
- 1 Marsh Flats
- 1 Mountain
- 1 Plains
- 1 Plateau
- 1 Polluted Delta
- 1 Sacred Foundry
- 1 Savai Triome
- 1 Scalding Tarn
- 1 Scrubland
- 1 Spectator Seating
- 1 Sulfurous Springs
- 1 Swamp
- 1 Urborg, Tomb of Yawgmoth
- 1 Windswept Heath


---

## 8. Proposta de painel

- **Nomes:** Revoada; Céu, Inferno e Fogo; Juízo da Vastidão.
- **Escolhido: Céu, Inferno e Fogo.**
- **Clima:** tríptico de altar mardu. Três painéis, um para cada tribo, sob a mesma moldura de pedra. É um lugar de culto, sem a sacristia do Vito nem a corte da Marchesa.
- **Paleta:**
  - osso `#EDE6D6`
  - brasa `#D9541E`
  - ônix `#1C1A1F`
  - ouro-pálido `#C9A85A`
  - cinza-tempestade `#5B6270`
- **Moldura:** arco de três vãos, como um retábulo.
- **Motivo gráfico:** três pares de asas, de penas, de morcego e de escamas, convergindo para um ponto, que é a Kaalia. Os contadores do painel (ataques, cargas, oponentes eliminados) entram no vão central.

---

## 9. Dúvidas

**Fontes.** Os textos de todas as cartas vieram do json.edhrec. As rulings vieram do grimoria.app, da api.magicthegathering.io e do Commander Spellbook; a CR 508.4, do mtg.wiki. Os dados de inclusão são do EDHREC, com 40.308 decks da Kaalia. Game Changers: lista de 09/02/2026, com 53 cartas.

**Suposições.**
- Bracket 4 e nenhuma carta de estimação.
- **A simulação de mana** foi feita assim:
  - na jogada, sem mulligan, 40 mil partidas;
  - Exotic Orchard e Fellwar Stone dão qualquer das três cores, o que é otimista;
  - os Signets contam como uma fonte de cor;
  - fastlands entram virados a partir do quarto terreno;
  - checklands, bondlands e Arena of Glory entram desvirados;
  - Chrome Mox exige outra carta colorida na mão.
- Probabilidades por hipergeométrica: 99 cartas, mão de 7, uma compra por turno, sem mulligan.

**Regras incertas (leitura minha, sem ruling específica).**
1. Liesa e Avacyn, Angel of Horror trazendo a Kaalia de volta. Pela regra atual, o comandante vai ao cemitério e o dono **pode** movê-lo para a zona de comando como ação de estado. Se você deixar a Kaalia no cemitério, a Liesa a devolve à mão sem o imposto, e a Avacyn a devolve ao campo. Confirme a redação da regra 903.9a antes de contar com isso.
2. Bloodthirster pode atacar o mesmo jogador no combate extra se entrou atacando. É dedução da CR 508.4; ele está fora da lista.
3. O ETB do Terror of Mount Velus resolve antes do dano e dá golpe duplo às atacantes. É dedução; a ruling de 2020 só diz que afeta quem está em campo na resolução.
4. A Aurelia declarada atacante no segundo combate dispara de novo, por ser o primeiro ataque dela. É dedução.

**Cinco avaliações discutíveis.**
1. **Damn fica.** É remoção de 2 manas com uma limpeza de emergência que mata a Kaalia. Se você nunca for sobrecarregar, Chaos Warp ou Generous Gift ocupam a vaga melhor.
2. **Hellkite Tyrant fica e Wardscale Dragon vai para o banco.** Isso só vale em mesa de rocks. Contra mesa de criaturas, inverta.
3. **35 terrenos com 8 rocks e Chrome Mox.** Há quem jogue 33. Mantive 35 porque a cor é o gargalo medido, não a quantidade.
4. **O custo em vida da lista nova.** Fetches, shocks, Ancient Tomb, Talismans, Vampiric, Imperial Seal, Necropotence e The One Ring: a vida vira capital de giro. É o mesmo raciocínio do Vito, com a diferença que aqui ela financia velocidade, não dreno. Contra mesa agressiva, Necropotence é a primeira a sair.
5. **Serra's Emissary nomeando "criatura".** A proteção impede que criaturas bloqueiem você e as suas criaturas, e impede habilidades de criatura de mirá-las. Não para limpeza nem mágica. Contra deck de controle, nomeie "instantânea".

---

## 10. Confronto

**O link do edh.wiki** (kaalia-of-the-vast/aggro) não é um guia escrito. É uma lista de cartas gerada por dados, sem plano, mulligan ou sequência. O plano que dá para extrair dela coincide com o desta análise: Kaalia cedo, botas, proteção grátis, tutores e as três tribos.

**Do EDHREC**, três discordâncias com a maioria:
1. Drakuseth (29,1%) e Scourge of the Throne (19,7%) aparecem muito e funcionam mal pela Kaalia.
2. Terror of Mount Velus e Subjugator Angel não aparecem nos dados da comandante e estão entre as melhores cargas que existem para ela.
3. A Neriv está em 23,4%. Deveria estar perto da Gisela.

---

## 11. A nota com as mudanças

| | Nota | O que sustenta |
|---|---|---|
| Atual | **5** | Núcleo forte; Kaalia conjurável até o turno 4 em 48%; blindagem vista até o turno 4 em 19%; nenhum multiplicador; 5 cargas que não disparam |
| Projetada | **9** | Kaalia conjurável até o turno 4 em 68%; blindagem vista até o turno 4 em 59%; 3 multiplicadores e 5 dobradores; Carga 3 na mão até o turno 5 em 83%; o Master fecha |
| Testada | pendente | |

A projetada é **projeção sem partida**. Não dou 10 a uma lista que nunca foi embaralhada. O ponto que segura o 9 é a mana: mesmo reconstruída, a Kaalia só fica conjurável no turno 5 ou depois em cerca de uma partida em três, na jogada. Isso é o preço de uma comandante de três cores e 4 manas.

**O teste das dez mãos.** Dez mãos jogadas sozinho até o turno 6, com quatro medidas:

| Medida | Meta |
|---|---|
| Turno em que a Kaalia entra | até o turno 4 em 7 das 10 mãos |
| Turno do primeiro ataque dela | até o turno 5 em 6 das 10 |
| Carga do primeiro ataque (nota no eixo Carga) | 2 ou mais em 8 das 10 |
| Mãos em que faltou uma das três cores no turno 4 | 2 ou menos |
