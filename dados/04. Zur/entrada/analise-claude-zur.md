# Análise: Pedágio Arcano (Zur the Enchanter)

Analista: Claude | Data: 14/10/2026 | Lista conferida por script: 100 cartas, nenhuma repetida fora os básicos, tudo dentro de Esper, nenhuma banida | Cartas sem texto conferido: nenhuma (77 da lista e 23 candidatas lidas no EDHREC; as entradas também no Archidekt)

## Nota de partida

**Nota atual: 5,5. Nota projetada com as 19 trocas: 8.** Projeção sem partida. Placar 246 → 267.

**Como li o pedido.** Você não disse quanto mexer. Li "retomar, tem potencial de ser forte, mas é para ser político e divertido" como **em camadas**: quatro camadas, cada uma medida, na ordem em que rendem. Não reconstruí. Se quiser parar na terceira, a mana fica como está e o deck já deixa de se sabotar.

**A descoberta principal.** O deck tem uma densidade ótima de alvos para o Zur (28 encantamentos de MV 3 ou menos, MV médio 2,5), e ao mesmo tempo **6 cartas que trabalham contra ele**: quatro limpezas que matam o Zur (Supreme Verdict, Doomskar, Cleansing Nova, By Invitation Only), o Out of Time, que tira o Zur de fase no meio do próprio ataque, e a Oppression, que pune você por conjurar. O comandante mais barato de manter vivo do formato estava sendo enterrado pela própria lista.

**O combo que já estava aí.** Wedding Ring + Consecrated Sphinx (Commander Spellbook 2022-3283): no seu turno, cada compra sua faz o oponente comprar pelo anel dele, e o Sphinx devolve duas. Compra até onde você quiser parar. Não vence sozinho. Com o Underworld Dreams em campo, cada compra do oponente vira 1 de dano nele. Essa linha de três cartas não está catalogada; é dedução minha pelo texto. Você não citou nenhum dos dois.

**A segunda descoberta, que é de mana.** São só **7 terrenos que geram preto** para um comandante que pede {W}{U}{B}. O Zur é conjurável até o turno 4 em **39%** das partidas simuladas.

---

## 1. Plano

### 1.1 O comandante, palavra por palavra

Texto Oracle: *"Flying. Whenever Zur attacks, you may search your library for an enchantment card with mana value 3 or less, put it onto the battlefield, then shuffle."* Criatura lendária, Human Wizard, 1/4, {1}{W}{U}{B}. Não é Game Changer.

| Trecho | Regra ou ruling | O que muda no deck |
|---|---|---|
| "Whenever Zur attacks" | O gatilho é na declaração de ataque. Se o Zur sair antes de resolver, o gatilho resolve mesmo assim (regra 113.7a) | O Reconnaissance tira o Zur do combate depois da busca: ele busca e nunca morre bloqueado |
| "enchantment card" | Encantamento-criatura conta. Carta com X conta como X = 0. Dupla face conta a frente. Room conta a soma das portas | Alseid e Nighthowler são alvos (o Nighthowler entra como criatura, o bestow só vale conjurando). Arguel's Blood Fast tem MV 2. Quase nenhuma Room cabe em 3 |
| "mana value 3 or less" | Na biblioteca | Smothering Tithe, Sphere of Safety, Moat e as Courts boas (todas MV 4 ou mais) ficam fora do alcance |
| "put it onto the battlefield" | Não é conjurar | Gatilho de "quando você conjura" não dispara: o extort do Blind Obedience não dispara, a Mesa Enchantress nunca compra. Gatilho de "quando entra" dispara: Grasp of Fate, Act of Authority, Killian |
| Aura posta assim | Não mira nada: você escolhe o que ela encanta (ruling de 08/12/2022). Hexproof, shroud e ward não impedem; proteção impede (702.16c) | Imprisoned in the Moon e Darksteel Mutation viram remoção que ignora hexproof. A Archnemesis pode ir em qualquer oponente |
| "you may" | Opcional | Você pode atacar só pela pressão, sem buscar, se o grimório for importar depois |
| Human Wizard, lendário, branco e azul e preto, poder 1 | — | Ativa o equipar {1} do Wizard's Staff, os dois bônus do Steel of the Godhead, o +1/+1 e ward do Combat Research e o "histórico" do Curator's Ward |

### 1.2 A conta do deck

**Atacar, buscar, cobrar.**

Cada ataque do Zur põe um encantamento de MV médio 2,5 em campo, sem gastar mana nem carta da mão. É um tutor que paga a carta que busca. Com o Wizard's Staff ou o Sakashima copiando o Zur, são dois por ataque.

O que se busca define a fase: primeiro a **taxa** (Propaganda, Ghostly Prison), que compra tempo; depois a **cirurgia** (Grasp of Fate, Imprisoned in the Moon), que tira de cada um o que importa; por último o **fechamento** (All That Glitters, Ethereal Armor, Steel of the Godhead), que transforma a mesa construída em dano de comandante.

Com o All That Glitters, o poder do Zur é 1 mais o número de artefatos e encantamentos que você controla. Com 3 rocks e 3 encantamentos, já são 7 de dano voando.

Em finanças: **a taxa é capital de giro, não é lucro.** Ela financia o tempo até o Zur começar a cobrar. Deck que só taxa é empresa que só faz caixa e nunca distribui.

### 1.3 Onde a lista trai o plano, em ordem de gravidade

1. **O deck mata o próprio comandante.** 5 cartas tiram o Zur do jogo: Supreme Verdict, Doomskar, Cleansing Nova, By Invitation Only e o Out of Time. A Cleansing Nova é a pior: um modo mata o Zur, o outro destrói os seus encantamentos. O Out of Time, buscado pelo Zur no ataque, tira o próprio Zur de fase antes do dano. Num deck em que o comandante é o tutor, cada recompra custa um turno inteiro.
2. **"Controlar, taxar e vencer dessa maneira" não fecha.** Taxa não tira vida. Hoje há 2 peças que fazem o Zur bater forte (All That Glitters e Combat Research), e o resto do fechamento é lento: Luminarch Ascension, Ominous Seas, Hissing Miasma, Underworld Dreams. O deck gera controle e converte pouco.
3. **A base de mana não sustenta três cores.** 7 terrenos geram preto. Há 23 básicos, e as duas únicas duais que sempre entram desviradas (Hallowed Fountain e Hengegate Pathway) fazem branco e azul. Fora o Command Tower, nenhum terreno desvirado gera preto além do Swamp. Zur no turno 4 em 39%; no turno 5, 55%.
4. **A política existe, mas é reativa.** Há 8 cartas de política (os dois Impetus, Bloodthirsty Blade, Wedding Ring, Act of Authority, Karmic Justice, Dictate, Secret Rendezvous). Falta o que faz a mesa brigar entre si sozinha a cada turno.

### 1.4 As três fases

Você não descreveu as fases. Proponho estas:

| Fase | O que deve acontecer | O que a lista tem hoje | Com as trocas |
|---|---|---|---|
| Início (turnos 1 a 4) | Rocks, uma taxa barata da mão, Zur no turno 4 | 9 rocks; Zur no turno 4 em 39% | 10 rocks e 8 terrenos novos; Zur no turno 4 em 52% |
| Meio (turnos 5 a 8) | O Zur ataca toda rodada. A 1ª busca é a taxa ou a cirurgia; a mesa é empurrada para brigar entre si | Propaganda e Hissing Miasma; remoção-Aura forte; goad em dois Impetus e na Blade | Ghostly Prison, Grasp of Fate, Archnemesis e Killian, que dá goad a cada encantamento que entra |
| Fim | O Zur vira Voltron e mata um oponente por vez, escolhendo quem; ou o dreno lento fecha a mesa | 2 peças de Voltron; Zur voa, mas pode ser bloqueado | 4 peças, uma delas imbloqueável com vínculo; Staff dobra a busca |

---

## 2. Agrupamentos

Os oito eixos são seus: Ramp, Draw, Removal (não-encantamentos), Removal (encantamentos), Tax, Proteção, Recursão + Goad, Sinergia.

A divisão da remoção em duas é a melhor ideia de agrupamento que vi nesta série: mede exatamente o alcance do Zur. Li "Removal (encantamentos)" como **remoção em forma de encantamento** (Darksteel Mutation, Imprisoned in the Moon), e não como remoção de encantamentos. Se era o contrário, me diga.

**A ressalva, uma vez só.** O eixo "Recursão + Goad" falha no primeiro teste do crivo: mistura recuperar cartas com direcionar ataques, duas funções sem relação. E falta o eixo que o deck mais precisa medir, **Fechamento**. Proponho trocar "Recursão + Goad" por "Política" (goad, Archnemesis, ofertas) e criar "Fechamento"; a recursão (Sun Titan, Hall, Shade's Form) vai para Sinergia. Mantive os seus eixos nas notas e medi o fechamento por fora, com a marca F.

| Eixo | Cartas com nota 2+ hoje | Com as trocas | Soma das notas hoje | Com as trocas |
|---|---|---|---|---|
| Ramp | 9 | 10 | 18 | 20 |
| Draw | 10 | 11 | 32 | 34 |
| Removal (não-encantamentos) | 9 | 7 | 23 | 20 |
| Removal (encantamentos) | 6 | 6 | 17 | 17 |
| Tax | 7 | 6 | 18 | 16 |
| Proteção | 8 | 9 | 26 | 29 |
| Recursão + Goad | 7 | 7 | 15 | 15 |
| Sinergia | 7 | 11 | 33 | 47 |

---

## 3. Carta a carta

Notas de 0 a 3 por eixo: R Ramp, D Draw, RN Removal não-encantamento, RE Removal em forma de encantamento, TX Tax, PR Proteção, RG Recursão + Goad, S Sinergia. Pets assumidos: as cartas foil e etched da lista (Arguel's Blood Fast, Dictate of Kruphix, Greater Auramancy, Reconnaissance, Mind's Eye, Hengegate Pathway). Pet soma 1 em Sinergia e nunca entra na fila de corte.

Distribuição de hoje: tiers A 11, B 33, C 51, D 2, S 3; relevância INS 7, ALT 31, MÉD 55, BAX 7. Os 23 básicos puxam MÉD para cima.

### Comandante (1)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Zur the Enchanter | D1 S3 | S | INS | 1/4 voando; ao atacar, busca encantamento de MV 3 ou menos e põe no campo | É o tutor e o motor: cada ataque vira uma carta de graça |

### Criatura (8)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Alseid of Life's Bounty (Zur busca) | PR2 S1 | B | ALT | 1/1 vínculo; {1}, sacrifica: proteção de uma cor a criatura ou encantamento seu | O Zur a busca; responde à remoção pontual no Zur ou na peça-chave |
| Baleful Strix | D1 PR1 | B | MÉD | Voar, toque mortífero, compra ao entrar | Bloqueador barato que segura o maior atacante |
| Consecrated Sphinx (Game Changer) | D3 S1 | A | ALT | 6/6 voando; compra 2 quando um oponente compra | O único Game Changer; combo de compra com o Wedding Ring |
| Judge's Familiar | TX1 PR1 | C | BAX | Voar; sacrifica para anular mágica a menos que paguem {1} | Taxa de uma vez só; pouco para um slot |
| Nighthowler (Zur busca) | S1 | C | MÉD | +X/+X, X = cards de criatura em todos os cemitérios; bestow | O Zur o põe como criatura (bestow só conjurando); corpo que cresce no jogo longo |
| Sakashima the Impostor | S2 | B | ALT | Entra como cópia de uma criatura, com nome Sakashima | Copiando o Zur, ganha o próprio gatilho de busca: dois encantamentos por combate |
| Silent Arbiter | TX2 PR2 | B | ALT | Só uma criatura ataca e só uma bloqueia por combate | Mata o ataque em massa; o Zur ataca sozinho de qualquer jeito |
| Sun Titan | RG3 S2 | A | ALT | 6/6 vigilância; ao entrar e atacar, devolve permanente de MV 3 ou menos do cemitério | Quase todo o deck tem MV 3 ou menos; recursão a cada ataque |

### Planeswalker (1)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Teferi, Time Raveler | D1 RN1 TX2 PR2 | A | INS | Oponentes só conjuram na velocidade de feitiço; -3 devolve e compra | Fecha a janela de resposta no seu turno: o ataque do Zur resolve em paz |

### Encantamento (26)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Act of Authority (Zur busca) | RE3 | B | ALT | Exila artefato ou encantamento ao entrar e a cada upkeep, passando o controle de si | Remoção repetível que vira moeda de troca na mesa |
| All That Glitters (Zur busca) | S3 | S | INS | +1/+1 por artefato e/ou encantamento seu | O único fechamento de verdade hoje: transforma a mesa do Zur em dano de comandante |
| Arguel's Blood Fast (Zur busca) | D2 S1 | C | MÉD (pet) | {1}{B}, 2 de vida: compra; vira terreno com 5 de vida ou menos | Pet; compra cara, mas cabe no Zur |
| Blind Obedience (Zur busca) | TX2 PR1 S1 | B | ALT | Extort; artefatos e criaturas dos oponentes entram virados | Taxa de tempo; o extort só dispara no que você conjura |
| Combat Research (Zur busca) | D1 PR1 S2 | B | ALT | Compra no dano de combate; se lendária, +1/+1 e ward {1} | No Zur vira 2/5 com ward e compra a cada acerto |
| Copy Enchantment (Zur busca) | S2 | B | ALT | Entra como cópia de qualquer encantamento no campo | Segunda Propaganda, segundo Grasp, ou a melhor peça de um oponente |
| Dark Tutelage (Zur busca) | D2 | C | MÉD | No upkeep, põe o topo na mão e perde vida igual ao MV | Compra contínua; MV baixo do deck segura o custo |
| Dictate of Kruphix (Zur busca) | D2 S1 | B | ALT (pet) | Cada jogador compra 1 a mais no próprio draw step | Pet; simétrico e político; com Underworld Dreams vira relógio |
| Greater Auramancy (Zur busca) | PR3 S1 | A | ALT (pet) | Seus outros encantamentos e criaturas encantadas têm shroud | Pet; blinda a mesa e o Zur encantado |
| Hissing Miasma (Zur busca) | TX2 | B | ALT | Quem ataca você perde 1 por criatura | Taxa em vida que fecha jogo devagar |
| Karmic Justice (Zur busca) | RE1 TX1 PR2 | B | ALT | Se um oponente destruir uma não-criatura sua, você destrói uma permanente dele | Dissuasão: quem mexe nos seus encantamentos paga |
| Luminarch Ascension (Zur busca) | S1 | B | ALT | Contador no fim do turno do oponente se você não perdeu vida; com 4, Anjos 4/4 | O pillow fort alimenta: sem dano, ela vira exército |
| Ominous Seas (Zur busca) | S1 | C | MÉD | Contador por compra; remove 8 para um Kraken 8/8 | Fechamento lento; brilha com Dictate e Sphinx |
| Oppression (Zur busca, **contra o plano**) | TX2 | C | BAX | Quem conjura descarta | Trava todos, inclusive você, e tira o jogo do dinâmico |
| Out of Time (Zur busca, **contra o plano**) | RE2 | D | BAX | Desvira e faz todas as criaturas saírem de fase até ele sair | Leva o próprio Zur junto, inclusive no meio do ataque |
| Phyrexian Arena (Zur busca) | D2 | B | ALT | Compra 1 a mais por upkeep e perde 1 | Compra garantida que o Zur traz de graça |
| Propaganda (Zur busca) | TX3 PR1 | A | INS | Atacar você custa {2} por criatura | A taxa que o deck promete |
| Reconnaissance (Zur busca) | PR2 S2 | A | ALT (pet) | {0}: tira atacante seu do combate e desvira | Pet; o Zur ataca, busca e sai antes de qualquer bloqueio |
| Underworld Dreams (Zur busca) | TX1 S1 | B | ALT | Oponente toma 1 por card que compra | Conversor da compra simétrica (Dictate, Wedding Ring) |
| Darksteel Mutation (Zur busca) | RE3 | A | INS | Criatura vira Inseto 0/1 indestrutível sem habilidades | Neutraliza comandante sem mandar à zona de comando |
| Imprisoned in the Moon (Zur busca) | RE3 | A | INS | Criatura, terreno ou planeswalker vira terreno incolor | Remoção cirúrgica que ignora hexproof via Zur |
| Minimus Containment (Zur busca) | RE2 | B | ALT | Permanente não-terreno vira Tesouro sem habilidades | Pega artefato e encantamento; o dono ganha um Tesouro |
| Mystic Subdual (Zur busca) | RE2 | B | MÉD | Flash; -2/-0 e perde todas as habilidades | Apaga comandante de efeito; corpo continua |
| Parasitic Impetus (Zur busca) | RG2 | B | ALT | +2/+2 e goad; ao atacar, o dono perde 2 e você ganha 2 | Política com dreno: a criatura dele bate nos outros e paga você |
| Psychic Impetus (Zur busca) | RG2 | B | MÉD | +2/+2 e goad; ao atacar, scry 2 | Goad que filtra seu topo |
| Shade's Form (Zur busca) | PR1 RG2 | B | MÉD | Pump por {B}; se a criatura morrer, volta sob seu controle | Seguro de vida do Zur, ou rouba a criatura do oponente que morrer |

### Artefato (16)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Arcane Signet | R2 | A | ALT | Mana de qualquer cor da identidade | Fixação de 2 manas |
| Azorius Locket | R2 D1 | C | MÉD | {W} ou {U}; sacrifica por 4 híbridos para comprar 2 | Rock de 3 manas |
| Orzhov Locket | R2 D1 | C | MÉD | {W} ou {B}; sacrifica para comprar 2 | Rock de 3 manas |
| Bloodthirsty Blade | PR1 RG2 | B | MÉD | +2/+0 e goad; só equipa criatura de oponente | Escolhe quem bate em quem por {1} |
| Chromatic Lantern | R2 | B | MÉD | Mana de qualquer cor; terrenos geram qualquer cor | Conserta a base |
| Commander's Sphere | R2 D1 | C | MÉD | Mana da identidade; sacrifica para comprar | Rock de 3 |
| Crawlspace | TX2 PR1 | C | MÉD | No máximo duas criaturas atacam você por combate | Taxa fraca que o Zur não busca |
| Crystal Chimes | RG2 | C | MÉD | Sacrifica: todos os encantamentos do cemitério à mão | Recursão lenta; o Sun Titan e a Hall fazem melhor |
| Decanter of Endless Water | R2 | C | MÉD | Sem limite de mão; mana de qualquer cor | Rock de 3 |
| Lightning Greaves | PR2 S1 | B | ALT | Ímpeto e shroud; equipar {0} | Zur ataca no turno em que desce |
| Mind Stone | R2 D1 | B | MÉD | {C}; sacrifica para comprar | Rock barato |
| Mind's Eye | D2 S1 | C | MÉD (pet) | Quando oponente compra, paga {1} e compra | Pet; caro, mas casa com Dictate e Wedding Ring |
| Prophetic Prism | R1 D1 | C | BAX | Compra ao entrar; filtra 1 mana em qualquer cor | Filtro, não rampa |
| Sol Ring | R3 | S | INS | {C}{C} | O melhor rock do formato |
| Talisman of Hierarchy | R2 | A | ALT | {C}, ou {W}/{B} com 1 de dano | Fixação de 2 manas |
| Wedding Ring | D2 S1 | B | ALT | Oponente ganha cópia; você compra e ganha vida quando ele compra/ganha no turno dele | Política de presente; combo de compra com o Sphinx |

### Instantânea (7)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Akroma's Blessing | PR2 | C | BAX | Proteção de uma cor para suas criaturas; ciclo {W} | Proteção que custa 3 manas |
| Brainstorm | D1 | B | MÉD | Compra 3, devolve 2 | Filtro barato |
| Fracture | RN2 | B | ALT | Destrói artefato, encantamento ou planeswalker | Remoção instantânea barata |
| Mortify | RN2 | B | ALT | Destrói criatura ou encantamento | Remoção instantânea flexível |
| Ojutai's Command | D1 RN1 PR1 | C | MÉD | Dois modos: recursão, vida, compra, anular criatura | Flexível e caro |
| Stroke of Midnight | RN2 | B | ALT | Destrói permanente não-terreno; o dono ganha Humano 1/1 | Remoção instantânea ampla |
| Sphinx's Revelation | D2 | B | MÉD | Ganha X e compra X | Compra grande no fim do turno de alguém |

### Feitiço (8)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| By Invitation Only (**contra o plano**) | RN2 | C | BAX | Cada jogador sacrifica de 0 a 13 criaturas | Você sacrifica o Zur junto |
| Cleansing Nova (**contra o plano**) | RN2 RE1 | D | BAX | Destrói todas as criaturas, ou todos os artefatos e encantamentos | Um modo mata o Zur, o outro mata o seu deck |
| Doomskar (**contra o plano**) | RN2 | C | MÉD | Destrói todas as criaturas; foretell | Mata o Zur |
| Extinction Event | RN3 | B | ALT | Exila criaturas de MV par ou ímpar | Escolhendo ímpar, o Zur (MV 4) fica |
| Promise of Power | D2 | C | MÉD | Compra 5 e perde 5, e/ou Demônio X/X | Compra cara num deck que já paga vida por compra |
| Sculpted Sunburst | RN3 S1 | A | ALT | Você escolhe uma criatura; cada oponente fica com uma de poder igual ou menor | Com o Zur escolhido, os outros ficam com criaturas de poder 1 |
| Secret Rendezvous | D2 | C | MÉD | Você e um oponente compram 3 | Moeda de negociação literal |
| Supreme Verdict (**contra o plano**) | RN3 | B | ALT | Destrói todas as criaturas; não pode ser anulada | Botão de emergência; custa o Zur |

### Terreno (33)

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Arcane Sanctum | R-1 | C | MÉD | Tri-terreno que entra virado | Base de mana |
| Azorius Chancery | — | C | MÉD | Karoo: entra virado, devolve um terreno, gera {W}{U} | Base de mana |
| Command Tower | — | B | ALT | Terreno | Base de mana |
| Hall of Heliod's Generosity | RG2 S1 | B | ALT | {1}{W}: encantamento do cemitério no topo do grimório | Recursão de encantamento em terreno |
| Hall of Storm Giants | S1 | C | MÉD | Vira Gigante 7/7 com ward {3} | Base de mana |
| Hallowed Fountain | — | C | MÉD | Terreno | Base de mana |
| Hengegate Pathway | S1 | C | MÉD (pet) | Pathway W ou U | Pet |
| Island ×10 | — | C | MÉD | Terreno | Base de mana |
| Meticulous Archive | R-1 | C | MÉD | Surveil land Plains Island, entra virado | Base de mana |
| Myriad Landscape | — | C | MÉD | Entra virado; busca dois básicos do mesmo tipo | Base de mana |
| Plains ×8 | — | C | MÉD | Terreno | Base de mana |
| Port Town | — | C | MÉD | Terreno | Base de mana |
| Swamp ×5 | — | C | MÉD | Terreno | Base de mana |


O pet mais fraco é o **Mind's Eye**: cinco manas para comprar pagando, num deck que já tem Dictate e Wedding Ring fazendo a mesa comprar. Fica.

---

## 4. Diagnóstico

### 4.1 Faixas

| Item | Faixa | Hoje | Com as trocas | Leitura |
|---|---|---|---|---|
| Fontes de terreno | 35 a 37 | 33 | 33 | Abaixo de propósito: CMC médio 2,97 e 9 rocks seguram |
| Ramp dedicado | 10 a 12 | 9 | 10 | No limite; o problema é cor, não quantidade |
| Compra dedicada | 10 a 12 | 10 | 11 | Bom; o Zur busca a compra de graça |
| Remoção (nota 2+ em um dos dois eixos) | 8 a 12 | 15 | 13 | Sobra; o excesso era limpeza |
| Remoção em massa | 3 a 5 | 7 | 4 | Hoje 7, e 5 delas levam o Zur |

### 4.2 Gerar contra converter

| Gera | Converte |
|---|---|
| 28 alvos para o Zur, 7 cartas de taxa, compra de sobra | 2 peças de Voltron e quatro fechamentos lentos |

O deck é bom em montar a mesa e ruim em cobrar por ela. É a mesma doença do Greymond e do Lynde, com o agravante de que aqui o comandante é o único que converte.

### 4.3 Concentração

28 das 67 cartas que não são terreno são alvo do Zur (42%). Cada ataque tem escolha real. O que faltava era qualidade no topo: das 10 cartas de maior sinergia com o Zur no EDHREC, a lista tinha 4; com as trocas, 7.

### 4.4 Contra o plano (6 cartas)

Oppression, Out of Time, By Invitation Only, Cleansing Nova, Doomskar, Supreme Verdict.

Mantive o **Supreme Verdict** de propósito: um botão de emergência que não pode ser anulado, para quando a mesa passar da taxa. Custa o Zur, e é o único.

Atritos menores, que ficam:
- **Silent Arbiter** limita a um atacante por combate também para você: os Anjos da Luminarch e o Zur não atacam juntos. Contra mesa larga, compensa.
- **Greater Auramancy** dá shroud ao Zur encantado, e aí nem você equipa nele. Equipe o Wizard's Staff antes da primeira Aura. O mesmo vale para o Lightning Greaves.
- **Dictate of Kruphix** dá carta a todos. É político, e com o Underworld Dreams vira relógio.

### 4.5 Combos

| Combo | ID | Peças na lista | Vence sozinho? |
|---|---|---|---|
| Wedding Ring + Consecrated Sphinx | 2022-3283 | As duas | Não: compra até onde você quiser |
| O mesmo + Underworld Dreams | não catalogado (dedução) | As três | Mata um oponente se o grimório aguentar: você compra 2 para cada 1 dele |
| Sun Titan + Shade's Form + saída de sacrifício | 20 variantes no CSB | Falta a saída | — |
| Zur + Second Chance + Stylus ou Pawnshop | 1530-1948-4431 | Nenhuma | Turnos infinitos (recusado, seção 7) |
| Zur + Stasis + Stylus ou Pawnshop | 1025-1948-4431 | Nenhuma | Trava a mesa (recusado) |

### 4.6 Brackets

Um Game Changer (Consecrated Sphinx), mantido nas trocas. Um combo de duas cartas que custa 10 manas somadas e só compra. Leitura: **Bracket 3**, antes e depois.

### 4.7 Placar

Hoje 246; com as trocas 267. O placar compara o deck com ele mesmo.

---

## 5. Combos e linhas

### 5.1 Motores

- **O Zur.** Um encantamento por ataque. Busque primeiro o que resolve o problema da mesa, não o que é mais forte em abstrato.
- **Wizard's Staff e Sakashima.** O Staff dobra o gatilho por {1} de equipar. O Sakashima copiando o Zur ganha o próprio gatilho: a cópia é "Zur" para o texto dela. Os dois juntos: quatro buscas por combate.
- **Killian.** Cada encantamento que entra vira e dá goad numa criatura de alguém. O Zur buscando é um goad por ataque; com o Staff, dois. E o Zur encantado atacando compra uma carta.

### 5.2 Fechamentos

- **Voltron, o principal.** Hipótese: 3 artefatos e 2 encantamentos no primeiro ataque, o Zur sem bloqueio, cada busca pega a melhor peça. Hoje, 3 ataques até 21 de dano de comandante (golpes de 7, 9, 10). Com as trocas e sem o Staff, também 3 (7, 12, 16). Com o Staff, 2 ataques (13, 20).
- **Dreno lento.** Dictate de Kruphix com Underworld Dreams: cada oponente toma 2 por turno dele, só de comprar. Archnemesis soma 2 por ataque no alvo.
- **A linha do Wedding Ring**, contra um oponente.

**O que as trocas de Voltron compram.** Sem o Staff, o relógio não encurta: são 3 ataques antes e depois. O ganho é de confiabilidade. Hoje o Zur depende de uma Aura só (All That Glitters) e de não ser bloqueado no ar. Com as trocas, há 4 peças, e o Steel o torna imbloqueável e com vínculo. O que encurta o relógio é o Staff.

### 5.3 Como fechar a mesa, e não só um jogador

O Voltron é cirúrgico por natureza: dano de comandante escolhe a vítima. É isso que o seu "cirúrgico contra quem jogar" pede. Para a mesa inteira, o caminho é o dreno: Dictate + Underworld Dreams + Hissing Miasma, com a taxa segurando os ataques. É lento de propósito. Num deck político, quem fecha rápido demais perde a mesa.

### 5.4 O momento da jogada

- **Ordem das buscas.** Primeiro a taxa ou a remoção da maior ameaça. O Voltron só depois que a mesa estiver taxada: o Zur com 15 de poder no turno 5 vira alvo de todo mundo. Na política, a ameaça crível vale mais guardada do que exercida.
- **Reconnaissance**, depois que a busca resolve e antes dos bloqueios, se houver voador grande na mesa.
- **Staff antes de qualquer Aura no Zur**, por causa do shroud da Greater Auramancy e do Greaves.
- **Grasp of Fate** depois que cada oponente baixou a melhor peça, não antes.

---

## 6. Cortes, em ordem

1. Out of Time: tira o Zur de fase no meio do próprio ataque.
2. Cleansing Nova: um modo mata o Zur, o outro mata o seu deck.
3. By Invitation Only: você sacrifica o Zur junto.
4. Doomskar: a terceira limpeza que mata o Zur. Fica só o Supreme Verdict.
5. Oppression: trava todos, inclusive você. Contradiz o "dinâmico e divertido".
6. Crawlspace: taxa que o Zur não busca.
7. Judge's Familiar: uma taxa de uso único num slot.
8. Akroma's Blessing: proteção de 3 manas quando existe a de graça.
9. Crystal Chimes: o Sun Titan e a Hall fazem a recursão melhor.
10. Promise of Power: compra de 5 manas num deck que já paga vida por compra (Dark Tutelage, Arena, Arguel's).
11. Prophetic Prism: filtro, não rampa.
12. Arcane Sanctum e Myriad Landscape: os dois terrenos que sempre entram virados e não dão cor.
13. Três Island, duas Plains e um Swamp: viram duais e fetches.

---

## 7. Entradas

### 7.1 Os pares

| # | Camada | Sai | Entra | Por quê |
|---|---|---|---|---|
| 1 | 1. Motor e fechamento | Out of Time | Grasp of Fate | Sai a carta que tira o Zur do combate; entra a remoção que pega uma peça de cada oponente |
| 2 | 1. Motor e fechamento | Crystal Chimes | Wizard's Staff | Recursão lenta por um equipamento que dobra cada busca do Zur |
| 3 | 1. Motor e fechamento | By Invitation Only | Steel of the Godhead | Limpeza que sacrifica o Zur por uma Aura que o torna imbloqueável e com vínculo |
| 4 | 1. Motor e fechamento | Promise of Power | Ethereal Armor | Compra de 5 manas por um multiplicador de dano de 1 mana que o Zur busca |
| 5 | 2. Política | Oppression | Archnemesis | Trava que pune todos, inclusive você, por política que premia quem ataca o líder |
| 6 | 2. Política | Crawlspace | Ghostly Prison | Taxa que o Zur não busca por taxa que ele busca |
| 7 | 2. Política | Judge's Familiar | Killian, Decisive Mentor | Um contra-feitiço de uma vez por um goad a cada encantamento que entra |
| 8 | 3. O Zur não se mata | Cleansing Nova | Winds of Rath | Limpeza que mata o Zur ou seus encantamentos por uma que poupa o Zur encantado |
| 9 | 3. O Zur não se mata | Akroma's Blessing | Flawless Maneuver | Proteção de 3 manas por proteção de graça |
| 10 | 3. O Zur não se mata | Doomskar | Curator's Ward | Terceira limpeza que mata o Zur por hexproof que ainda paga 2 cartas se ele cair |
| 11 | 4. Mana | Prophetic Prism | Talisman of Dominance | Filtro por rock que gera azul e preto |
| 12 | 4. Mana | Arcane Sanctum | Godless Shrine | Tri-terreno virado por dual desvirada |
| 13 | 4. Mana | Myriad Landscape | Watery Grave | Terreno incolor virado por dual desvirada |
| 14 | 4. Mana | Island | Underground Sea | Básico por dual |
| 15 | 4. Mana | Island | Tundra | Básico por dual |
| 16 | 4. Mana | Island | Polluted Delta | Básico por fetch |
| 17 | 4. Mana | Plains | Scrubland | Básico por dual |
| 18 | 4. Mana | Plains | Flooded Strand | Básico por fetch |
| 19 | 4. Mana | Swamp | Marsh Flats | Básico por fetch |

### 7.2 Quanto cada camada rende

| Camada | Trocas | Placar acumulado | Contra o plano | Fechamentos | Política | O que compra |
|---|---|---|---|---|---|---|
| Hoje | — | 246 | 6 | 9 | 8 | — |
| 1. Motor e fechamento | 4 | 252 | 4 | 10 | 9 | Dobra a busca (Staff), dá ao Zur imbloqueável e vínculo, cirurgia em todos os oponentes |
| 2. Política | 3 | 258 | 3 | 11 | 11 | A mesa passa a brigar entre si: goad a cada encantamento, Aura que marca o líder |
| 3. O Zur não se mata | 3 | 261 | 1 | 11 | 11 | Nenhuma limpeza da lista mata mais o Zur, exceto o Supreme Verdict mantido como botão de emergência |
| 4. Mana | 9 | 267 | 1 | 11 | 11 | Zur conjurável até o turno 4 de 39% para 52%; fontes pretas de 7 para 12 |

A ordem é a da prioridade. A camada 1 sozinha já leva o placar a 252; até a 3, 261, sem tocar na mana. **A camada 4 é a única que mexe no turno do Zur**: de 39% para 52% no turno 4.

### 7.3 Antes e depois

| Medida | Hoje | Com as 19 trocas |
|---|---|---|
| Placar | 246 | 267 |
| CMC médio (sem terrenos) | 2,97 | 2,87 |
| Alvos do Zur (encantamento de MV 3 ou menos) | 28 | 32 |
| Cartas contra o plano | 6 | 1 |
| Limpezas que matam o Zur | 5 | 1 |
| Limpezas que poupam o Zur | 2 | 3 |
| Peças de Voltron para o Zur | 2 | 4 |
| Multiplicadores do gatilho (Staff, Sakashima) | 1 | 2 |
| Cartas de política | 8 | 11 |
| Proteção do Zur | 7 | 8 |
| Taxas que o Zur busca | 4 | 4 |
| Remoções que o Zur busca | 6 | 6 |
| Fontes de terreno pretas / brancas / azuis | 7 / 15 / 18 | 12 / 18 / 20 |
| Terrenos que sempre entram virados | 4 | 2 |
| Zur conjurável até o turno 4 / 5 / 6 | 39% / 55% / 64% | 52% / 65% / 73% |
| Ataques até 21 de dano de comandante (sem Staff / com Staff) | 3 / não há Staff | 3 / 2 |
| Game Changers | 1 | 1 |
| Das 10 cartas de maior sinergia no EDHREC | 4 | 7 |

### 7.4 O texto das entradas

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Grasp of Fate (Zur busca) | RE3 S1 | S | INS | Exila uma não-terreno de cada oponente até sair | Cirurgia justa: cada oponente perde a peça que você escolher |
| Steel of the Godhead (Zur busca) | PR1 S3 | A | INS | Branca: +1/+1 e vínculo; azul: +1/+1 e não pode ser bloqueada | No Zur: +2/+2, vínculo e imbloqueável |
| Ethereal Armor (Zur busca) | S3 | A | ALT | +1/+1 por encantamento seu e golpe primeiro | Segundo multiplicador de dano do Zur |
| Archnemesis (Zur busca) | D2 S1 | A | ALT | Aura em oponente: atacá-lo drena 2, compra 1, ganha 2; migra para quem atacar você | A política em forma de carta: marca o líder e muda de dono sozinha |
| Ghostly Prison (Zur busca) | TX3 PR1 | A | INS | Atacar você custa {2} por criatura | A segunda Propaganda que faltava |
| Curator's Ward (Zur busca) | D1 PR2 | B | ALT | Hexproof; se a permanente histórica sair, compra 2 | O Zur é lendário: protegido, e se cair você compra 2 |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Killian, Decisive Mentor | D2 RG2 S2 | A | ALT | Encantamento seu entra: vira e dá goad numa criatura; criaturas com sua Aura atacando: compra | Cada busca do Zur vira um goad; o Zur encantado atacando compra |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Wizard's Staff | S3 | S | INS | Gatilhos da criatura equipada disparam uma vez a mais; equipar Wizard {1} | O Zur é Wizard: cada ataque busca dois encantamentos |
| Talisman of Dominance | R2 | A | ALT | {C}, ou {U}/{B} com 1 de dano | Fixa o preto que falta |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Flawless Maneuver | PR3 | B | ALT | De graça com comandante em campo; suas criaturas ficam indestrutíveis | Responde a limpeza sem mana |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Winds of Rath | RN3 S1 | A | ALT | Destrói todas as criaturas não encantadas | Limpeza que poupa o Zur com Aura e as criaturas que você marcou com goad |

| Carta | Notas | Tier | Relev. | O que faz | Por que aqui |
|---|---|---|---|---|---|
| Godless Shrine | — | B | MÉD | Shock W/B | Fixação de cor sem custo de tempo |
| Watery Grave | — | B | MÉD | Shock U/B | Fixação de cor sem custo de tempo |
| Underground Sea | — | B | MÉD | Dual original U/B | Fixação de cor sem custo de tempo |
| Scrubland | — | B | MÉD | Dual original W/B | Fixação de cor sem custo de tempo |
| Tundra | — | B | MÉD | Dual original W/U | Fixação de cor sem custo de tempo |
| Marsh Flats | — | B | MÉD | Fetch Plains ou Swamp (acha as duais com tipo) | Fixação de cor sem custo de tempo |
| Polluted Delta | — | B | MÉD | Fetch Island ou Swamp (acha as duais com tipo) | Fixação de cor sem custo de tempo |
| Flooded Strand | — | B | MÉD | Fetch Plains ou Island (acha as duais com tipo) | Fixação de cor sem custo de tempo |

### 7.5 Recusadas, para não voltarem à mesa

| Carta | Por que não |
|---|---|
| Second Chance | Fecha turnos infinitos com a Hall of Heliod's (1530-3208) ou o Sun Titan (1530-3175), que já estão na lista. Funciona, e é o oposto de "dinâmico e divertido" |
| Stasis | Trava a mesa e você junto; com Stylus ou Pawnshop vira lock |
| Delney, Streetwise Lookout | Dobra o gatilho do Zur (poder 1), mas desliga quando o All That Glitters, o Ethereal Armor ou o Steel passam o poder de 2 |
| Solemnity e Rest in Peace | Desligam Luminarch, Ominous Seas, Hall of Heliod's e Sun Titan |
| Mesa Enchantress, Kor Spiritdancer, Sram | Compram ao conjurar; o Zur põe, não conjura |
| Smothering Tithe, Sphere of Safety, Moat, as Courts boas | MV 4 ou mais: o Zur não busca |
| Nine Lives | Se sair do campo, você perde |

### 7.6 Banco

- **Rhystic Study.** A taxa mais forte que o Zur alcança. É Game Changer; com ela seriam dois. Entra no lugar do Crawlspace ou da Dark Tutelage se você aceitar.
- **Necropotence.** Game Changer e motor de compra brutal. Não combina com "divertido".
- **Strionic Resonator**: o segundo dobrador, se o Staff não chegar.
- **Swiftfoot Boots, Diplomatic Immunity**: mais proteção para o Zur.
- **Rule of Law e Eidolon of Rhetoric**: assimétricas a favor do Zur, porque ele não conjura. Fortes, e travam a mesa.
- **Curse of Verbosity, Court of Cunning, Fall from Favor**: política com monarca ou maldição.
- **Detention Sphere, Mystic Remora, Entity Tracker**.

---

## 8. Painel

| Nome | Ideia |
|---|---|
| **Pedágio Arcano** (escolhido) | Todo mundo passa por você e paga |
| Cartório de Esper | Nada acontece sem o seu carimbo |
| Juros de Esper | A taxa que se acumula até virar dívida impagável |

**Clima.** Gabinete de um alquimista de Esper: etherium azulado, vidro, papel timbrado, lacre de cera. Burocracia mágica, elegante e implacável.

**Paleta.**

| Cor | Hex | Uso |
|---|---|---|
| Etério | #5C8DB8 | Destaques, títulos |
| Prata-vidro | #C7D0D8 | Linhas, molduras |
| Nanquim | #161A24 | Fundo |
| Lacre-ameixa | #5E2E4F | Alertas, contra o plano |
| Papel-selo | #EFE7D4 | Texto principal |

**Moldura.** Filigrana de etherium com rebites, e borda perfurada de estampilha, como selo fiscal antigo.

**Motivo gráfico.** Um carimbo circular de "PAGO" com a silhueta do Zur no centro, cercado de anéis concêntricos, como cancela de pedágio vista de cima.

---

## 9. Dúvidas

### 9.1 Fontes

Texto das cartas: json.edhrec.com (as 77 da lista e as 23 candidatas), com as entradas também no Archidekt. Rulings: grimoria.app e api.magicthegathering.io. Combos: Commander Spellbook, abertos por ID. Dados de inclusão e sinergia: EDHREC e edh.wiki (17 mil decks). Game Changers: scrollvault.net, lista de 09/02/2026.

### 9.2 Suposições

- **Pets**: as seis cartas foil ou etched.
- **Ambição**: em camadas.
- **"Removal (encantamentos)"**: remoção em forma de encantamento.
- **Monte Carlo de mana**: 40 mil partidas, na jogada, sem mulligan. A fetch conta como fonte das três cores. A Azorius Chancery conta como uma mana virada. O Myriad Landscape conta como incolor, sem a ativação.
- **Relógio de Voltron**: 3 artefatos e 2 encantamentos no primeiro ataque, o Zur sem bloqueio. Hoje isso é otimista, porque o Zur voa mas pode ser bloqueado.

### 9.3 Regras sem ruling oficial (dedução)

- Shroud e ward não impedem a Aura posta pelo Zur. A ruling oficial cita hexproof; o raciocínio é o mesmo, porque a Aura não mira.
- A cópia do Sakashima dispara o gatilho de ataque do Zur. O texto se refere ao próprio objeto.
- A linha Wedding Ring + Sphinx + Underworld Dreams não está no Commander Spellbook.
- **Wizard's Staff** (The Hobbit, 14/08/2026) é legal em Commander pelo Archidekt. O campo do EDHREC que dizia "não legal" só indica se a carta pode ser comandante.

### 9.4 Cinco avaliações discutíveis

1. **Cortar a Oppression.** Ela é "taxar a mesa" ao pé da letra, e o Zur a põe de graça. Cortei porque trava a mesa e você junto, e isso deixa o jogo mais lento.
2. **Manter o Supreme Verdict**, que mata o Zur. É o único botão de emergência que não se anula.
3. **Sakashima como ALT.** Copiando o Zur, ele vale um Wizard's Staff. Copiando outra coisa, é só um clone de 4 manas.
4. **Manter o Silent Arbiter**, que atrapalha o goad do Killian e os Anjos da Luminarch.
5. **Nota 8 projetada.** Sem o Staff, o relógio de Voltron não encurta. Se o Staff não aparecer, o deck fica mais perto de 7,5.

---

## 10. Confronto

**Com o EDHREC.** Das 10 cartas de maior sinergia com o Zur, você tinha 4 (All That Glitters, Imprisoned in the Moon, Darksteel Mutation, Copy Enchantment). Com as trocas, 7: entram Grasp of Fate, Ethereal Armor e Steel of the Godhead. Ficaram fora Diplomatic Immunity (banco), Mirrormade (o Copy Enchantment já faz o papel) e Rest in Peace (desliga cartas suas).

**Com o que você disse.**

- *"A estratégia parece intuitiva: controlar e taxar a mesa e vencer dessa maneira."* Discordo da última parte. Taxa não vence; ela compra o tempo para o Zur vencer. A lista tinha muito do primeiro e pouco do segundo.
- *"Não necessariamente para vencer, mas para tornar o game mais dinâmico e divertido."* Discordo em parte. Pillow fort sem relógio deixa a mesa mais **lenta**, não mais dinâmica. O que deixa o jogo dinâmico é a mesa brigar entre si (goad, Archnemesis, Killian) enquanto você tem uma ameaça crível guardada. Em negociação, isso tem nome: alternativa ao acordo. Sem o Zur ameaçando 21 de dano, ninguém precisa negociar com você.
- *"Tem muito potencial de ser forte, só pela mecânica e cartas inseridas."* Concordo. A mecânica é das melhores do formato e as cartas certas já estavam ali. O que segurava era a lista atirar no próprio pé.
