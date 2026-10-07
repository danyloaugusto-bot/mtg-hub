# -*- coding: utf-8 -*-
# Ordem das notas: [Ramp, Draw, Removal, Recursão, Sacrifice, Tokens, Sinergia, Especial]
# tier: S A B C D | rel: INS ALT MED BAX
# extras: wipe (remoção global), outlet (2 = grátis e instantâneo, 1 = repetível com custo),
#         drain (converte morte em dano), prod (cores que o terreno gera), tapped (entra virado)

A = {}

def c(name, s, tier, rel, fx, why, **kw):
    A[name] = dict(s=s, tier=tier, rel=rel, fx=fx, why=why, **kw)

# ---------------- Comandante ----------------
c("Clavileño, First of the Blessed", [0,2,0,0,1,2,3,2], "S", "INS",
  "Sempre que você ataca, um Vampiro atacante vira Demônio e ganha: ao morrer, compre uma carta e crie um Vampiro Demônio 4/3 voador, que entra virado.",
  "É o motor do deck: transforma qualquer Vampiro que ataca em carta e corpo quando morre. Tudo aqui existe para atacar, morrer e repetir.")

# ---------------- Criaturas ----------------
c("Baron Bertram Graywater", [0,2,0,0,2,2,2,1], "A", "ALT",
  "Uma vez por turno, quando fichas suas entram, cria um Vampiro 1/1 com vínculo com a vida. Por {1}{B}, sacrifica outra criatura ou artefato para comprar uma carta.",
  "Gerador de ficha e saída de sacrifício no mesmo corpo. Converte fichas em cartas sem depender do combate.", outlet=1)
c("Bartolomé del Presidio", [0,0,0,0,3,0,2,1], "A", "ALT",
  "Sacrifique outra criatura ou artefato, sem custo: ele ganha um marcador +1/+1.",
  "Saída de sacrifício gratuita por 2 manas, e ainda é Vampiro. Dispara na hora o gatilho de morte de quem o Clavileño abençoou.", outlet=2)
c("Blood Artist", [0,0,0,0,3,0,2,3], "S", "INS",
  "Sempre que ele ou outra criatura morre, um jogador perde 1 de vida e você ganha 1.",
  "Converte cada morte em dano e vida. É o que transforma o plano de sacrifício em condição de vitória.", drain=True)
c("Bloodghast", [0,0,0,3,2,0,2,1], "A", "ALT",
  "Volta do cemitério para o campo sempre que um terreno entra sob seu controle. Não pode bloquear.",
  "Combustível que se repõe sozinho: ataca, é abençoado, morre e volta no próximo terreno. Par ideal para Skullclamp e para os altares.")
c("Bloodline Keeper", [0,0,0,0,0,3,3,2], "S", "INS",
  "Vira para criar um Vampiro 2/2 voador. Com cinco Vampiros em campo, transforma por {B} em um lorde que dá +2/+2 aos outros.",
  "Fábrica de Vampiros voadores e lorde na mesma vaga. Dois turnos em campo costumam decidir a mesa.")
c("Bloodthirsty Conqueror", [0,0,0,0,0,0,2,3], "A", "ALT",
  "5/5 voador com toque mortífero. Sempre que um oponente perde vida, você ganha a mesma quantidade.",
  "Segunda cópia do Exquisite Blood, agora com corpo. Fecha o loop infinito com o Vito.")
c("Carmen, Cruel Skymarcher", [0,0,0,3,2,0,2,2], "A", "ALT",
  "Voadora que ganha um marcador e 1 de vida a cada permanente sacrificada por qualquer jogador. Ao atacar, devolve do cemitério ao campo uma permanente de custo até o poder dela.",
  "Cresce com o que o deck já faz e vira recursão a cada ataque. Quanto mais sacrifício, maior o alcance do que ela traz de volta.")
c("Charismatic Conqueror", [0,0,0,0,0,2,2,1], "B", "MED",
  "Quando um artefato ou criatura entra desvirado sob controle de um oponente, ele vira a permanente ou você cria um Vampiro 1/1 com vínculo com a vida.",
  "Em mesa de quatro rende ficha ou atrasa os oponentes. Forte no início, perde tração no fim de jogo.")
c("Cordial Vampire", [0,0,0,0,3,0,3,1], "A", "ALT",
  "Sempre que ele ou outra criatura morre, coloca um marcador +1/+1 em cada Vampiro seu.",
  "Cada sacrifício engorda a tribo inteira. Com fichas morrendo em série, o time cresce rápido.")
c("Drivnod, Carnage Dominus", [0,0,0,0,3,0,3,2], "A", "ALT",
  "Gatilhos de morte das suas permanentes disparam uma vez a mais. Pode ganhar indestrutível exilando três criaturas do cemitério.",
  "Dobra Blood Artist, as Elendas e o gatilho que o Clavileño concede. É o segundo Teysa, mais caro e sem ser Vampiro.")
c("Dusk Legion Sergeant", [0,0,0,2,1,0,2,0], "B", "MED",
  "Por {1}{B}, sacrifique-o: seus Vampiros que não são fichas ganham persistir até o fim do turno.",
  "Seguro contra remoção em massa e uma segunda rodada de gatilhos de morte. Situacional, mas barato.")
c("Edgar, Charmed Groom", [0,0,0,2,0,2,3,2], "A", "ALT",
  "Lorde +1/+1. Ao morrer, volta como o Caixão, que cria um Vampiro 1/1 com vínculo com a vida por manutenção e retorna a Edgar depois de três.",
  "Lorde que não morre de verdade: removê-lo só troca o bônus por uma fábrica de fichas.")
c("Elenda's Hierophant", [0,0,0,0,2,3,3,1], "A", "ALT",
  "1/1 voador que ganha um marcador a cada ganho de vida. Ao morrer, cria X Vampiros 1/1 com vínculo com a vida, onde X é o poder dele.",
  "Cresce sozinho num deck cheio de vínculo com a vida e explode em fichas quando é sacrificado.")
c("Elenda, the Dusk Rose", [0,0,0,0,3,3,3,2], "S", "INS",
  "Ganha um marcador a cada outra criatura que morre. Ao morrer, cria X Vampiros 1/1 com vínculo com a vida, onde X é o poder dela.",
  "A melhor recompensa de sacrifício do deck: absorve as mortes e devolve tudo em fichas.")
c("Henrika Domnathi", [0,1,1,0,1,0,1,0], "C", "BAX",
  "No início do combate escolhe um modo ainda não usado: cada jogador sacrifica uma criatura, você compra uma carta, ou ela transforma em uma 3/4 com voar, toque mortífero e vínculo com a vida.",
  "Faz um pouco de tudo e nada com força. Quatro manas por três efeitos de uso único é pouco para a vaga.", pri=7)
c("High-Society Hunter", [0,3,0,0,2,0,2,1], "A", "ALT",
  "5/3 voador. Ao atacar, pode sacrificar outra criatura para ganhar um marcador. Compra uma carta sempre que outra criatura sua que não seja ficha morre.",
  "Motor de compra que se alimenta do próprio plano e ainda oferece saída de sacrifício no ataque.")
c("Legion Lieutenant", [0,0,0,0,0,0,3,0], "B", "MED",
  "Outros Vampiros seus recebem +1/+1.",
  "Lorde de 2 manas, honesto e sem truque. Entra pela densidade tribal; é o primeiro lorde a sair se faltar espaço.")
c("Markov Baron", [0,0,0,0,0,0,3,0], "B", "MED",
  "Lorde +1/+1 com vínculo com a vida, convocar e loucura.",
  "Com fichas em campo sai quase de graça por convocar. Cumpre o mesmo papel do Legion Lieutenant.")
c("Master of Dark Rites", [2,0,0,0,2,0,2,0], "C", "BAX",
  "Vire e sacrifique outra criatura: gera {B}{B}{B} para mágicas de Vampiro, Clérigo ou Demônio.",
  "Acelera, mas a mana é restrita e custa um corpo. Compete com saídas de sacrifício melhores.", outlet=1, pri=6)
c("Mavren Fein, Dusk Apostle", [0,0,0,0,0,3,3,1], "B", "ALT",
  "Sempre que um ou mais Vampiros seus que não são fichas atacam, cria um Vampiro 1/1 com vínculo com a vida.",
  "Uma ficha por combate, no mesmo momento em que o Clavileño dispara. Combustível de sacrifício garantido todo turno.")
c("Nullpriest of Oblivion", [0,0,0,3,0,0,2,0], "B", "MED",
  "2/1 com ameaçar e vínculo com a vida. Reforçada por {3}{B}, devolve uma criatura do cemitério ao campo.",
  "Flexível: jogada de turno 2 ou reanimação no fim do jogo. Nunca é carta morta, raramente é a melhor.")
c("Ojer Taq, Deepest Foundation", [0,0,0,1,0,3,3,3], "S", "INS",
  "6/6 com vigilância. Toda criação de fichas de criatura sua é triplicada. Ao morrer, volta como terreno.",
  "Triplica as Elendas, o Bloodline Keeper e o Demônio do Clavileño. Com ele em campo, qualquer gerador de ficha decide o jogo.")
c("Preacher of the Schism", [0,2,0,0,0,1,2,1], "B", "MED",
  "2/4 com toque mortífero. Ao atacar o jogador com mais vida, cria um Vampiro 1/1 com vínculo com a vida. Ao atacar enquanto você tem a maior vida, compra uma carta e perde 1.",
  "Num deck que ganha vida o tempo todo, compra com frequência. Depende de atacar com segurança.")
c("Qarsi Revenant", [0,0,0,1,0,0,2,0], "B", "MED",
  "3/3 com voar, toque mortífero e vínculo com a vida. Do cemitério, pode ser exilado para dar os três marcadores de habilidade a outra criatura.",
  "Corpo eficiente que ainda rende algo depois de morrer. Bom, mas não conversa com sacrifício.")
c("Redemption Choir", [0,0,0,3,0,0,2,1], "B", "MED",
  "3/3 com vínculo com a vida. Ao entrar ou atacar, se você controla três criaturas de poderes diferentes, devolve do cemitério ao campo uma permanente de custo 3 ou menos.",
  "Recursão repetível a cada ataque quando a condição fecha. Com lordes e marcadores, costuma fechar.")
c("Roaming Throne", [0,0,0,0,0,0,3,3], "S", "INS",
  "4/4 com salvaguarda {2}. Escolha um tipo: gatilhos das suas outras criaturas daquele tipo disparam uma vez a mais.",
  "Nomeando Vampiro, dobra o gatilho de ataque do Clavileño e quase todo gatilho de morte da tribo.")
c("Ruthless Lawbringer", [0,0,3,0,2,0,2,0], "A", "ALT",
  "Ao entrar, você pode sacrificar outra criatura para destruir uma permanente que não seja terreno.",
  "Remoção universal num corpo de Vampiro, e o custo é exatamente o que o deck quer pagar.")
c("Teysa Karlov", [0,0,0,0,3,1,3,3], "S", "INS",
  "Gatilhos de morte das suas permanentes disparam uma vez a mais. Suas fichas de criatura têm vigilância e vínculo com a vida.",
  "Dobra o valor de cada morte por 4 manas: duas cartas e dois Demônios por Vampiro abençoado.")
c("Twilight Prophet", [0,3,0,0,0,0,2,2], "A", "ALT",
  "2/4 voador. Com a bênção da cidade, toda manutenção revela e compra o topo; os oponentes perdem vida igual ao custo da carta e você ganha o mesmo.",
  "Compra e dreno todo turno. Dez permanentes é fácil com fichas.")
c("Viscera Seer", [0,0,0,0,3,0,3,1], "A", "INS",
  "Sacrifique uma criatura, sem custo: vidência 1.",
  "A saída de sacrifício mais barata do formato, e é Vampiro. Liga o deck inteiro por uma mana.", outlet=2)
c("Vito, Thorn of the Dusk Rose", [0,0,0,0,0,0,2,3], "S", "INS",
  "Sempre que você ganha vida, um oponente perde a mesma quantidade. Por {3}{B}{B}, suas criaturas ganham vínculo com a vida até o fim do turno.",
  "Metade do combo: com Exquisite Blood ou Bloodthirsty Conqueror, qualquer ponto de vida vira loop infinito.")
c("Welcoming Vampire", [0,3,0,0,0,0,2,1], "A", "ALT",
  "2/3 voador. Uma vez por turno, compra uma carta quando criaturas suas de poder 2 ou menos entram.",
  "Uma carta por turno quase garantida com tanta ficha 1/1. Funciona também no turno dos oponentes.")
c("Yahenni, Undying Partisan", [0,0,0,0,3,0,2,1], "B", "ALT",
  "2/2 com ímpeto que cresce quando criaturas dos oponentes morrem. Sacrifique outra criatura, sem custo: fica indestrutível até o fim do turno.",
  "Saída de sacrifício gratuita que sobrevive às suas próprias remoções em massa.", outlet=2)

# ---------------- Planeswalker / Batalha ----------------
c("Sorin the Mirthless", [0,2,0,0,0,2,2,1], "B", "MED",
  "+1: olha o topo e pode comprá-lo pagando vida. −2: cria um Vampiro 2/3 com voar e vínculo com a vida. −7: 13 de dano e 13 de vida.",
  "Vantagem de carta estável e um corpo por ativação. Sólido, sem ser central.")
c("Invasion of New Capenna", [0,0,3,0,1,0,2,0], "B", "MED",
  "Ao entrar, você pode sacrificar um artefato ou criatura para exilar um artefato ou criatura de um oponente. Derrotada, vira um equipamento que distribui marcadores.",
  "Exílio por 2 manas com o custo que o deck gosta de pagar. O verso é um bônus raro.")

# ---------------- Mágicas ----------------
c("Agadeem's Awakening", [0,0,0,3,0,0,1,1], "A", "ALT",
  "Devolve do cemitério ao campo criaturas com custos diferentes entre si, cada uma de custo X ou menos. O verso é um terreno que gera {B}.",
  "Reanimação em massa no fim do jogo ou terreno quando falta mana. Nunca é carta morta.", prod="B")
c("Archenemy's Charm", [0,0,3,2,0,0,0,0], "A", "ALT",
  "Instantânea com três modos: exila criatura ou planeswalker, devolve até duas criaturas ou planeswalkers do cemitério à mão, ou dá dois marcadores e vínculo com a vida.",
  "Exílio em velocidade instantânea com recursão de reserva. O custo {B}{B}{B} pede atenção à base de mana.")
c("Austere Command", [0,0,3,0,0,0,0,0], "B", "MED",
  "Escolha dois: destruir artefatos, encantamentos, criaturas de custo 3 ou menos, criaturas de custo 4 ou mais.",
  "Única resposta em massa a artefatos e encantamentos. Cara, mas dá para poupar o seu lado.", wipe=True)
c("Damn", [0,0,3,0,0,0,0,0], "A", "ALT",
  "Destrói uma criatura por {B}{B}, ou todas por {2}{W}{W} com sobrecarga.",
  "Remoção pontual barata ou global, conforme a necessidade. A flexibilidade justifica a vaga.", wipe=True)
c("Deadly Dispute", [1,3,0,0,2,0,2,0], "A", "ALT",
  "Sacrifique um artefato ou criatura: compre duas cartas e crie um Tesouro.",
  "Compra instantânea que ainda dispara gatilho de morte. Uma das melhores cartas de aristocratas por 2 manas.")
c("Diabolic Intent", [0,0,0,0,2,0,1,3], "A", "ALT",
  "Sacrifique uma criatura: busque qualquer carta do grimório para a mão.",
  "Tutor de 2 manas cujo custo é um bônus neste deck. Encontra a peça de combo que faltar.")
c("Generous Gift", [0,0,3,0,0,0,0,0], "A", "ALT",
  "Instantânea: destrói qualquer permanente. O controlador ganha um Elefante 3/3.",
  "Responde a qualquer coisa, inclusive terrenos. É a resposta universal do branco.")
c("Insatiable Avarice", [0,3,0,0,0,0,0,2], "B", "MED",
  "Modos cumulativos: por +{2}, busca uma carta e a coloca no topo; por +{B}{B}, um jogador compra três cartas e perde 3 de vida.",
  "Tutor, compra ou os dois. Também serve de dano final com o Vito em campo.")
c("Malakir Rebirth", [0,0,0,2,0,0,1,0], "B", "ALT",
  "Instantânea de {B}: a criatura alvo volta ao campo se morrer neste turno. O verso é um terreno que gera {B}.",
  "Proteção barata para uma peça-chave ou segunda rodada de gatilho de morte. Na pior hipótese, é terreno.", prod="B")
c("New Blood", [0,0,2,0,0,0,2,0], "C", "BAX",
  "Vire um Vampiro: ganhe o controle de uma criatura em definitivo, e ela passa a tratar um tipo de criatura como Vampiro.",
  "Efeito forte, mas é feitiço de 4 manas com um alvo só e exige um Vampiro desvirado. Há remoção mais eficiente.", pri=5)
c("Olivia's Wrath", [0,0,3,0,0,0,3,0], "A", "ALT",
  "Cada criatura que não é Vampiro recebe −X/−X, onde X é o número de Vampiros que você controla.",
  "Remoção em massa de um lado só. Com meia dúzia de Vampiros, limpa a mesa e mantém a sua.", wipe=True)
c("Rite of Oblivion", [0,0,3,0,2,0,1,0], "A", "ALT",
  "Sacrifique uma permanente que não seja terreno: exile uma permanente que não seja terreno. Tem recapitular.",
  "Dois exílios em uma carta, e cada um aciona seus gatilhos de sacrifício.")
c("Split Up", [0,0,2,0,0,0,0,0], "C", "BAX",
  "Destrói todas as criaturas viradas ou todas as desviradas.",
  "Sexta remoção em massa do deck e a menos confiável: depende de como a mesa está virada.", wipe=True, pri=3)
c("Toxic Deluge", [0,0,3,0,0,0,0,0], "S", "INS",
  "Pague X de vida: todas as criaturas recebem −X/−X.",
  "A melhor remoção em massa do formato. Num deck que ganha vida, o custo quase não pesa.", wipe=True)
c("Treacherous Greed", [0,3,0,0,1,0,1,0], "C", "BAX",
  "Instantânea: sacrifique uma criatura que causou dano neste turno, compre três cartas e drene 3 de cada oponente.",
  "O texto é ótimo, a condição atrapalha: a criatura precisa ter causado dano antes. Deadly Dispute faz parecido sem restrição.", pri=4)
c("Victimize", [0,0,0,3,2,0,2,0], "A", "ALT",
  "Sacrifique uma criatura: devolva duas criaturas do cemitério ao campo, viradas.",
  "Três manas por dois corpos e mais um gatilho de morte. Padrão ouro de reanimação para aristocratas.")

# ---------------- Artefatos ----------------
c("Arcane Signet", [2,0,0,0,0,0,0,0], "A", "ALT",
  "Gera uma mana de qualquer cor da identidade do comandante.",
  "Pedra de 2 manas sem defeito. Base da aceleração.")
c("Lithoform Engine", [0,0,0,0,0,0,1,1], "C", "BAX",
  "Copia habilidades, mágicas instantâneas, feitiços ou mágicas de permanente, com custos de {2}, {3} e {4}.",
  "Quatro manas para entrar e mais mana para cada uso. Brilha quando você já está ganhando.", pri=2)
c("Mind Stone", [2,1,0,0,0,0,0,0], "B", "MED",
  "Gera {C}. Por {1}, pode ser sacrificada para comprar uma carta.",
  "Aceleração incolor que vira carta no fim do jogo.")
c("Orzhov Signet", [2,0,0,0,0,0,0,0], "B", "MED",
  "Por {1}, gera {W}{B}.",
  "Acelera e corrige cor. É a menos eficiente das pedras de 2 manas do deck.")
c("Phyrexian Altar", [3,0,0,0,3,0,2,3], "S", "INS",
  "Sacrifique uma criatura, sem custo: gere uma mana de qualquer cor.",
  "Saída de sacrifício gratuita que paga o próprio plano. Com geradores de ficha, a mana deixa de ser problema.", outlet=2)
c("Skullclamp", [0,3,0,0,2,0,3,2], "S", "INS",
  "Equipamento de {1}: +1/−1. Quando a criatura equipada morre, compre duas cartas.",
  "Cada ficha 1/1 vira duas cartas por uma mana. O melhor motor de compra do deck.")
c("Sol Ring", [3,0,0,0,0,0,0,0], "S", "INS",
  "Gera {C}{C}.",
  "A melhor aceleração do formato.")
c("Strionic Resonator", [0,0,0,0,0,0,2,1], "B", "MED",
  "Por {2}, copia uma habilidade desencadeada que você controla.",
  "Dobra o gatilho das Elendas ou do Vampiro abençoado. Sem um bom gatilho na pilha, não faz nada.")
c("Talisman of Hierarchy", [2,0,0,0,0,0,0,0], "A", "ALT",
  "Gera {C}, ou {W} ou {B} causando 1 de dano a você.",
  "Pedra de 2 manas que entra desvirada e corrige cor.")

# ---------------- Encantamentos ----------------
c("Black Market Connections", [1,3,0,0,0,1,0,3], "S", "INS",
  "Todo turno, escolha um ou mais: Tesouro por 1 de vida, carta por 2 de vida, ficha 3/2 com morfolóide por 3 de vida.",
  "Mana, carta e corpo todo turno. A vida perdida o deck recupera com folga.")
c("Chthonian Nightmare", [0,0,0,3,2,0,1,2], "A", "ALT",
  "Pague energia igual ao custo, sacrifique uma criatura e devolva o encantamento à mão: reanima uma criatura do cemitério.",
  "Reanimação reutilizável que ainda serve de saída de sacrifício. Volta para a mão e recarrega a energia.")
c("Exquisite Blood", [0,0,0,0,0,0,1,3], "S", "INS",
  "Sempre que um oponente perde vida, você ganha a mesma quantidade.",
  "Metade do combo com o Vito. Sozinho, dobra o valor de cada dreno.")
c("Glasswing Grace", [0,0,0,0,0,0,0,0], "C", "MED",
  "Aura: +2/+2, voar e vínculo com a vida. O verso é um terreno virado que gera {W} ou {B}.",
  "Na prática é um terreno bicolor com uma opção de fim de jogo. Conta como fonte de mana, não como mágica.", prod="WB")
c("Legion's Landing", [1,0,0,0,0,2,3,1], "A", "ALT",
  "Cria um Vampiro 1/1 com vínculo com a vida. Atacando com três criaturas, vira um terreno que gera {W} e fabrica mais Vampiros.",
  "Uma mana por um corpo no turno 1 e, depois, um terreno que fabrica Vampiros para sempre.")
c("March of the Canonized", [0,0,0,0,0,3,2,1], "C", "BAX",
  "Cria X Vampiros 1/1 com vínculo com a vida. Com devoção 7 a branco e preto, cria um Demônio 4/3 voador por manutenção.",
  "Cara pelo que entrega na hora, e a devoção 7 demora a fechar. Primeira da fila de corte.", pri=1)
c("The Meathook Massacre", [0,0,3,0,3,0,1,3], "S", "INS",
  "Ao entrar, todas as criaturas recebem −X/−X. Depois, cada criatura sua que morre tira 1 de vida de cada oponente, e você ganha 1 de vida a cada criatura deles que morre.",
  "Remoção em massa escalável que fica em campo como um segundo Blood Artist.", wipe=True, drain=True)
c("Valkyrie's Call", [0,0,0,3,1,0,2,2], "A", "ALT",
  "Quando uma criatura sua que não é ficha nem Anjo morre, ela volta ao campo com um marcador +1/+1, voar e o tipo Anjo.",
  "Cada Vampiro morre duas vezes: dois gatilhos de morte por carta e um time que resiste a remoções em massa.")

# ---------------- Terrenos ----------------
c("Bleachbone Verge", [0,0,0,0,0,0,0,0], "A", "ALT",
  "Gera {B}; gera {W} se você controla uma Planície ou um Pântano.",
  "Bicolor que entra desvirado.", prod="WB")
c("Bojuka Bog", [-1,0,1,0,0,0,0,0], "B", "MED",
  "Entra virado, gera {B} e exila o cemitério de um jogador.",
  "Resposta a cemitério sem ocupar vaga de mágica.", prod="B", tapped=True)
c("Brightclimb Pathway", [0,0,0,0,0,0,0,0], "A", "ALT",
  "Escolha ao baixar: gera {W} ou gera {B}.",
  "Bicolor sem custo, sempre desvirado.", prod="WB")
c("Castle Locthwain", [0,1,0,0,0,0,0,0], "A", "ALT",
  "Gera {B}. Por {1}{B}{B}, compra uma carta e você perde vida igual ao número de cartas na mão.",
  "Terreno que vira compra quando a mão esvazia.", prod="B")
c("Cavern of Souls", [0,0,0,0,0,0,2,0], "S", "INS",
  "Gera mana de qualquer cor para criaturas do tipo escolhido, e elas não podem ser anuladas.",
  "Nomeando Vampiro, corrige cor e protege a tribo de anulações.", prod="WB")
c("Command Tower", [0,0,0,0,0,0,0,0], "S", "INS",
  "Gera {W} ou {B}.",
  "O melhor terreno bicolor do formato.", prod="WB")
c("Concealed Courtyard", [0,0,0,0,0,0,0,0], "A", "ALT",
  "Gera {W} ou {B}; entra desvirado se você controla até dois outros terrenos.",
  "Perfeito no começo, virado mais tarde.", prod="WB")
c("Desolate Mire", [0,0,0,0,0,0,0,0], "B", "MED",
  "Por {1}, gera {W}{B}.",
  "Filtra mana, mas não gera cor sozinho.", prod="WB")
c("Fetid Heath", [0,0,0,0,0,0,0,0], "B", "MED",
  "Gera {C}, ou converte uma mana branca ou preta em duas dessas cores.",
  "Ajuda a pagar custos como {B}{B}{B}.", prod="WB")
c("Godless Shrine", [0,0,0,0,0,0,0,0], "S", "INS",
  "Planície Pântano. Gera {W} ou {B}; entra desvirado por 2 de vida.",
  "Tem os dois tipos básicos: liga os terrenos que checam Planície ou Pântano e pode ser buscado.", prod="WB")
c("High Market", [0,0,0,0,2,0,0,0], "A", "ALT",
  "Gera {C}. Vire e sacrifique uma criatura: ganhe 1 de vida.",
  "Saída de sacrifício que não ocupa vaga de mágica e não pode ser anulada.", prod="C", outlet=1)
c("Isolated Chapel", [0,0,0,0,0,0,0,0], "A", "ALT",
  "Gera {W} ou {B}; entra desvirado se você controla uma Planície ou um Pântano.",
  "Bicolor quase sempre desvirado.", prod="WB")
c("Marsh Flats", [0,0,0,0,0,0,0,0], "A", "ALT",
  "Pague 1 de vida e sacrifique: busca uma Planície ou um Pântano para o campo.",
  "Acha a Godless Shrine e conta como dois terrenos entrando para o Bloodghast.", prod="WB")
c("Minas Tirith", [0,1,0,0,0,0,0,0], "B", "MED",
  "Gera {W}. Por {1}{W}, compra uma carta se você atacou com duas ou mais criaturas.",
  "Compra condicionada a algo que o deck faz todo turno.", prod="W")
c("Path of Ancestry", [-1,0,0,0,0,0,1,0], "B", "MED",
  "Entra virado, gera {W} ou {B} e dá vidência 1 ao pagar Vampiros.",
  "Corrige cor; entrar virado é o preço.", prod="WB", tapped=True)
c("Phyrexian Tower", [2,0,0,0,2,0,0,0], "A", "ALT",
  "Gera {C}. Vire e sacrifique uma criatura: gere {B}{B}.",
  "Acelera e é saída de sacrifício em um terreno.", prod="C", outlet=1)
c("Plains", [0,0,0,0,0,0,0,0], "B", "MED",
  "Terreno básico. Gera {W}.",
  "Liga os terrenos que checam tipo básico. A quantidade de básicos é o ajuste fino da base de mana.", prod="W")
c("Secluded Courtyard", [0,0,0,0,0,0,1,0], "A", "ALT",
  "Gera {C}, ou mana de qualquer cor para mágicas e habilidades de criaturas do tipo escolhido.",
  "Segunda Cavern para a tribo, sem a proteção contra anulação.", prod="WB")
c("Shattered Sanctum", [0,0,0,0,0,0,0,0], "A", "ALT",
  "Gera {W} ou {B}; entra desvirado se você controla dois ou mais outros terrenos.",
  "Desvirado do turno 3 em diante.", prod="WB")
c("Shineshadow Snarl", [0,0,0,0,0,0,0,0], "B", "MED",
  "Gera {W} ou {B}; entra desvirado se você revelar uma Planície ou um Pântano da mão.",
  "Com poucos básicos, entra virado mais vezes do que deveria.", prod="WB")
c("Silent Clearing", [0,1,0,0,0,0,0,0], "A", "ALT",
  "Por 1 de vida, gera {W} ou {B}. Por {1}, pode ser sacrificado para comprar uma carta.",
  "Bicolor desvirado que vira carta no fim do jogo.", prod="WB")
c("Swamp", [0,0,0,0,0,0,0,0], "B", "MED",
  "Terreno básico. Gera {B}.",
  "Liga os terrenos que checam tipo básico. A quantidade de básicos é o ajuste fino da base de mana.", prod="B")
c("Vault of Champions", [0,0,0,0,0,0,0,0], "A", "ALT",
  "Gera {W} ou {B}; entra desvirado se você tem dois ou mais oponentes.",
  "Em Commander é um bicolor sem custo.", prod="WB")
c("Voldaren Estate", [0,0,0,0,0,0,1,0], "B", "MED",
  "Gera {C}, ou mana de qualquer cor para mágicas de Vampiro por 1 de vida. Cria fichas de Sangue.",
  "Corrige cor para a tribo; a ficha de Sangue raramente é usada.", prod="WB")
c("Windbrisk Heights", [-1,0,0,0,0,0,0,1], "B", "MED",
  "Entra virado, exila uma das quatro cartas do topo e gera {W}. Atacando com três criaturas, você joga a carta exilada sem pagar o custo.",
  "Com tanta ficha, a condição fecha fácil. Entrar virado é o custo.", prod="W", tapped=True)
c("Witch's Cottage", [-1,0,0,1,0,0,0,0], "C", "BAX",
  "Pântano que gera {B}. Entra virado sem três outros Pântanos; quando entra desvirado, põe uma criatura do cemitério no topo do grimório.",
  "Com quatro Pântanos básicos e a Godless Shrine, quase sempre entra virado e sem o bônus. Um Pântano básico rende mais.", prod="B", tapped=True)

# ---------------- Radar (fora do deck) ----------------
R = {}
def r(name, s, tier, rel, verdict, fx, why, sai=None, **kw):
    R[name] = dict(s=s, tier=tier, rel=rel, verdict=verdict, fx=fx, why=why, sai=sai, **kw)

r("Emeritus of Woe", [0,0,0,0,1,0,3,3], "S", "INS", "entra",
  "Vampiro 5/4 que entra preparado: enquanto preparado, você pode conjurar uma cópia de Demonic Tutor. Volta a ficar preparado no seu passo final se duas ou mais criaturas morreram no turno.",
  "Um tutor por turno num deck em que duas mortes são rotina. A melhor carta deste radar.",
  sai="March of the Canonized")
r("Saw in Half", [0,0,1,0,2,2,3,2], "A", "ALT", "entra",
  "Instantânea: destrói uma criatura. Se ela morrer assim, o controlador cria duas fichas que são cópias dela com metade do poder e da resistência, arredondando para cima.",
  "Nas Elendas, no Bloodline Keeper ou no Roaming Throne vale por duas cartas, e ainda salva uma peça de um exílio. Ruim como remoção nos oponentes.",
  sai="Lithoform Engine")
r("Scheming Silvertongue", [0,3,0,0,0,0,2,1], "A", "ALT", "entra",
  "Vampiro 1/3 com voar e vínculo com a vida. Fica preparado na sua segunda fase principal se você ganhou 2 ou mais de vida no turno; a mágica dele é Sign in Blood.",
  "Compra recorrente por 2 manas num deck que ganha vida todo turno. Não entra preparado: o primeiro uso vem depois.",
  sai="Treacherous Greed")
r("Vein Ripper", [0,0,0,0,3,0,3,3], "A", "ALT", "entra",
  "Vampiro 6/5 voador com salvaguarda: sacrificar uma criatura. Sempre que qualquer criatura morre, um oponente perde 2 de vida e você ganha 2.",
  "Um Blood Artist dobrado em um corpo que fecha o jogo. O deck gera muita morte e tem poucos conversores de morte em dano.",
  sai="New Blood", drain=True)
r("Cruel Celebrant", [0,0,0,0,3,0,2,2], "A", "ALT", "entra",
  "Vampiro 1/2: sempre que ele ou outra criatura ou planeswalker seu morre, cada oponente perde 1 de vida e você ganha 1.",
  "Segundo Blood Artist, atinge todos os oponentes de uma vez e é Vampiro.",
  sai="Master of Dark Rites", drain=True)
r("Patriarch's Bidding", [0,0,0,3,0,0,3,2], "A", "ALT", "avaliar",
  "Feitiço: cada jogador escolhe um tipo de criatura e devolve do cemitério ao campo todas as criaturas dos tipos escolhidos.",
  "Nomeando Vampiro, devolve o cemitério inteiro depois de uma remoção em massa. Os oponentes também escolhem um tipo: confira os cemitérios antes.")
r("Indulgent Aristocrat", [0,0,0,0,2,0,3,0], "B", "MED", "avaliar",
  "Vampiro 1/1 com vínculo com a vida. Por {2}, sacrifique uma criatura: marcador +1/+1 em cada Vampiro seu.",
  "Saída de sacrifício de 1 mana que engorda a tribo. O custo de {2} por ativação limita o uso.",
  outlet=1)
r("Champion of Dusk", [0,3,0,0,0,0,3,0], "B", "MED", "avaliar",
  "Vampiro 4/4: ao entrar, você compra X cartas e perde X de vida, onde X é o número de Vampiros que você controla.",
  "Recarrega a mão de uma vez. Quanto maior a mesa, melhor; fraco com a mesa vazia.")
r("Haunting Voyage", [0,0,0,3,0,0,2,1], "B", "MED", "avaliar",
  "Feitiço: devolve até duas criaturas de um tipo do cemitério ao campo; conjurado com foretell, devolve todas.",
  "Alternativa ao Patriarch's Bidding que só beneficia você. Pesa na curva: 6 manas, ou 2 agora e 7 depois.")
r("Tip the Scales", [0,0,2,0,2,0,1,0], "C", "BAX", "fora",
  "Feitiço: sacrifique uma criatura; todas as criaturas recebem −X/−X, onde X é a resistência dela.",
  "Seria a sétima remoção em massa, e as criaturas do deck têm resistência baixa. Só compensa com uma Elenda gigante. Se for testar, troque por Split Up.",
  sai="Split Up", wipe=True)

# ---------------- Combos e linhas de jogo ----------------
COMBOS = [
  dict(n="Loop de dreno infinito", kind="Combo",
       p=["Vito, Thorn of the Dusk Rose", "Exquisite Blood"],
       t="Qualquer ganho ou perda de vida inicia o ciclo: o Vito converte ganho em perda e o Exquisite Blood converte perda em ganho, até a mesa cair."),
  dict(n="O mesmo loop, com corpo", kind="Combo",
       p=["Vito, Thorn of the Dusk Rose", "Bloodthirsty Conqueror"],
       t="O Conqueror faz o papel do Exquisite Blood. São duas peças para a mesma metade do combo."),
  dict(n="Bênção dobrada", kind="Motor",
       p=["Clavileño, First of the Blessed", "Teysa Karlov"],
       t="O gatilho de morte concedido pelo Clavileño dispara duas vezes: duas cartas e dois Demônios 4/3 por Vampiro abençoado. Drivnod faz o mesmo."),
  dict(n="Demônios em triplo", kind="Motor",
       p=["Clavileño, First of the Blessed", "Ojer Taq, Deepest Foundation"],
       t="Cada Demônio do Clavileño vira três. O mesmo vale para as fichas das Elendas e do Bloodline Keeper."),
  dict(n="Dois abençoados por ataque", kind="Motor",
       p=["Clavileño, First of the Blessed", "Roaming Throne"],
       t="Nomeando Vampiro, o gatilho de ataque do Clavileño dispara duas vezes, e os gatilhos de morte dos Vampiros também."),
  dict(n="Mana de sacrifício", kind="Motor",
       p=["Phyrexian Altar", "Elenda, the Dusk Rose"],
       t="Sacrificar a Elenda no Altar cria X fichas, que viram X manas. Com Blood Artist em campo, cada uma ainda drena 1."),
  dict(n="Duas cartas por uma mana", kind="Motor",
       p=["Skullclamp", "Legion's Landing"],
       t="Qualquer ficha 1/1 equipada morre na hora e rende duas cartas. Funciona com todo gerador de ficha do deck."),
]

# ---------------- Radar, segunda leva: edh.wiki e handovers, já filtrados ----------------
r("Swords to Plowshares", [0,0,3,0,0,0,0,0], "A", "ALT", "entra",
  "Instantânea de {W}: exila uma criatura. O controlador ganha vida igual ao poder dela.",
  "A melhor remoção pontual do branco, por uma mana. Troca uma remoção global que está sobrando por resposta instantânea.",
  sai="Split Up")
r("Pitiless Plunderer", [3,0,0,0,2,0,1,2], "A", "ALT", "entra",
  "Humano Pirata 1/4: sempre que outra criatura sua morre, você cria um Tesouro.",
  "Cada morte vira mana: ataca direto a falta de ramp do deck. Com Phyrexian Altar, cada ficha rende duas manas. Não é Vampiro, e é a exceção que compensa.",
  sai="Henrika Domnathi")
r("Sanctum Seeker", [0,0,0,0,0,0,3,3], "A", "ALT", "avaliar",
  "Vampiro 3/4: sempre que um Vampiro seu ataca, cada oponente perde 1 de vida e você ganha 1.",
  "Converte o ataque, que o Clavileño já pede, em dreno na mesa inteira. Disputa a faixa de 4 manas, que já tem bastante gente.")
r("Village Rites", [0,3,0,0,2,0,1,0], "A", "ALT", "avaliar",
  "Instantânea de {B}: sacrifique uma criatura e compre duas cartas.",
  "Um Deadly Dispute de uma mana, sem o Tesouro. Entra fácil se abrir vaga de compra.")
r("Grave Pact", [0,0,3,0,3,0,0,2], "A", "ALT", "avaliar",
  "Encantamento: sempre que uma criatura sua morre, cada outro jogador sacrifica uma criatura.",
  "Cada sacrifício seu vira um sacrifício para cada oponente. Poder alto, custo {1}{B}{B}{B} e fama de carta antipática: é decisão de mesa, não de lista.")
r("Drana, Liberator of Malakir", [0,0,0,0,0,0,3,1], "B", "MED", "avaliar",
  "Vampira lendária 2/3 com voar e iniciativa: quando causa dano de combate a um jogador, cada criatura atacante sua ganha um marcador +1/+1.",
  "Com iniciativa, os marcadores chegam antes do dano das outras atacantes. Boa em mesa larga; depende de conectar.")
r("Vraan, Executioner Thane", [0,0,0,0,3,0,2,2], "B", "MED", "avaliar",
  "Vampiro Phyrexiano lendário 2/2: uma vez por turno, quando outras criaturas suas morrem, cada oponente perde 2 de vida e você ganha 2.",
  "Dreno barato que atinge a mesa toda, mas só dispara uma vez por turno: bom com sacrifício espaçado, fraco com sacrifício em massa.", drain=True)
r("Bloodline Necromancer", [0,0,0,3,0,0,3,0], "B", "MED", "avaliar",
  "Vampiro Mago 3/2 com vínculo com a vida: ao entrar, devolve um Vampiro ou Mago do cemitério ao campo.",
  "Reanimação tribal num corpo, e quase toda criatura do deck é alvo. Cinco manas é o freio.")
r("Vault of the Archangel", [0,0,0,0,0,0,2,1], "B", "MED", "avaliar",
  "Terreno: gera {C}. Por {2}{W}{B}, suas criaturas ganham toque mortífero e vínculo com a vida até o fim do turno.",
  "Com Vito em campo, o time inteiro com vínculo com a vida fecha o jogo num ataque. Gera só incolor, num deck que já pede muito preto: só entra no lugar de outro terreno.",
  sai="Witch's Cottage", prod="C")
r("Captivating Vampire", [0,0,1,0,0,0,3,0], "C", "BAX", "fora",
  "Vampiro 2/2, lorde +1/+1. Vire cinco Vampiros desvirados: ganhe o controle de uma criatura, que vira Vampiro.",
  "Terceiro lorde de custo baixo, e a habilidade pede cinco Vampiros parados, o oposto do plano de atacar com eles.")
r("Butcher of Malakir", [0,0,2,0,3,0,2,1], "C", "BAX", "fora",
  "Vampiro 5/4 voador: sempre que ele ou outra criatura sua morre, cada oponente sacrifica uma criatura.",
  "É um Grave Pact com corpo, por 7 manas. Num deck com CMC médio perto de 3, chega tarde demais.")
r("Blade of the Bloodchief", [0,0,0,0,1,0,2,0], "C", "BAX", "fora",
  "Equipamento de {1}: a cada criatura que morre, a equipada ganha um marcador +1/+1, ou dois se for Vampiro.",
  "Engorda uma criatura só, sem comprar, drenar nem gerar ficha. O Cordial Vampire faz isso pela tribo inteira.")

