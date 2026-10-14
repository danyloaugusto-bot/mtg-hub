# HANDOVER — Okaun, Eye of Chaos // Zndrsplt, Eye of Wisdom
**Projeto:** Commander Coin-Flip — evolução pontual do precon especial  
**Versão:** V2 Deep Review  
**Data da análise:** 14 de outubro de 2026  
**Estado:** CURRENT congelado; PROPOSED V2 com 8 trocas; ainda não testada  
**Comandantes:** Okaun, Eye of Chaos + Zndrsplt, Eye of Wisdom  
**Identidade:** Izzet (azul/vermelho)  
**Nota estimada:** CURRENT **7,5/10** → PROPOSED V2 **8,4/10**  
**Contexto da nota:** estimativa estrutural para Commander casual forte/otimizado casual, não taxa de vitória nem resultado de partidas.

---

## 1. Identidade e princípio de construção

Este é um precon especial que deve continuar reconhecível como um deck de moedas. A proposta não tenta transformar a lista numa pilha genérica de staples nem remove o pacote peculiar de rolagem de moedas apenas para aumentar eficiência. O objetivo é corrigir gargalos de alto impacto com **oito trocas pontuais**, focadas em aceleração, proteção/interação e conversão de Okaun em dano letal.

A lista CURRENT recebida foi congelada como referência. Nenhuma mudança foi comprada, aplicada ou testada por se tratar de uma recomendação.

### Por que o deck já tem potencial alto

- **Krark's Thumb** é o principal multiplicador de consistência das moedas: quando você fosse jogar uma moeda, em vez disso joga duas e ignora uma. Se o objetivo é ganhar a moeda, com moedas justas você escolhe uma vitória caso ao menos uma das duas seja favorável. Isso dá **75% de chance de vitória por evento de moeda**, não 100%; duas perdas ainda são possíveis.
- **Okaun** cresce a cada moeda que você vence. Três vitórias com Okaun em campo transformam a base 3/3 em **24/24** até o fim do turno.
- **Zndrsplt** compra uma carta sempre que você vence uma moeda. As vitórias vindas de outras cartas também contam; seu texto não limita as compras às moedas da própria habilidade de início de combate.
- As habilidades de início de combate de ambos os comandantes geram **duas sequências separadas** de moedas. Se os dois estiverem em campo, Krark's Thumb também estiver ativo e nada interromper as habilidades, a chance ilustrativa de conseguir pelo menos três vitórias totais nessas duas sequências é aproximadamente **73,8%**. Essa é a chance de alcançar pelo menos 24/24 nessas condições — não a chance de ganhar a partida; Okaun ainda precisa conectar ou ser convertido em dano.
- O deck já tem rotas alternativas reais: **Frenetic Efreet + Chance Encounter**, **Frenetic Efreet + Okaun + Chandra's Ignition**, e **Niv-Mizzet, Parun + Curiosity**. Portanto, não precisa adicionar mais flips aleatórios só por adicionar; precisa conseguir chegar a uma linha, protegê-la e fechar a partida.

O benchmark de EDH.Wiki aponta Krark's Thumb, Tavern Scoundrel, Yusri, Stitch in Time, Fiery Gambit, Chance Encounter, Squee's Revenge, Krark the Thumbless, Planar Chaos e Karplusan Minotaur entre as cartas de maior sinergia agregada para o arquétipo. A lista já tem quase todo esse núcleo, e a recomendação preserva a maior parte dele. A popularidade é um sinal para investigar, não prova automática de que cada carta deva permanecer.

## 2. Regra e interações auditadas

### 2.1 Krark's Thumb e chance real

Thumb melhora cada evento de moeda que exija determinar vitória/derrota, mas não garante que você vença: com duas moedas justas, só perde o evento se ambas saírem desfavoráveis. A chance de vitória é 1 − (1/2 × 1/2) = 75%.

Ao descrever mãos ou sequências em partidas, separar:
- **fato de regra:** probabilidade teórica de 75% por evento, supondo moeda justa e escolha da face;
- **inferência estratégica:** Thumb torna as sequências muito mais confiáveis;
- **resultado ainda desconhecido:** consistência com a qual o deck realmente monta Thumb + comandante(s) e consegue protegê-los em pods reais.

### 2.2 Frenetic Efreet: lote arbitrariamente grande, mas finito

A habilidade de Frenetic Efreet custa 0: jogar a moeda; se vencer, Efreet sai de fase; se perder, é sacrificado. É possível ativá-la várias vezes enquanto se tem prioridade, empilhando as habilidades. Quando uma habilidade já está na pilha, ela normalmente é independente da fonte que a criou. Assim, as habilidades ainda podem resolver e fazer suas moedas mesmo depois de Efreet ter saído de fase ou deixado o campo.

Isso permite empilhar um **número arbitrariamente grande, porém escolhido e finito**, de ativações:
- cada vitória pode colocar um marcador de sorte em **Chance Encounter**;
- cada vitória pode disparar **Tavern Scoundrel**, gerando dois Tesouros;
- cada vitória pode dobrar **Okaun** se ele estiver no campo;
- cada vitória gera compra por **Zndrsplt** se ele estiver no campo.

Não é uma repetição literalmente infinita. É uma quantidade de ativações escolhida antecipadamente e sujeita à aleatoriedade. Com Krark's Thumb, a probabilidade por evento melhora para 75%, mas resultados desfavoráveis continuam possíveis. Não tratar a linha como vitória garantida.

### 2.3 Frenetic Efreet + Chance Encounter

Com os dois no campo, um lote grande de ativações do Efreet gera marcadores de sorte nas moedas vencidas. Ao chegar a dez marcadores, Chance Encounter vence a partida no início do próximo upkeep. Como há uma janela até esse upkeep, os oponentes ainda podem interagir com a condição de vitória. O pacote é forte e deve ser preservado.

### 2.4 Frenetic Efreet + Okaun + Chandra's Ignition

Com Okaun no campo, empilhar muitas ativações de Efreet cria oportunidades de múltiplas moedas vencidas e multiplicações de Okaun. Depois que as habilidades terminarem, **Chandra's Ignition** pode usar o poder de Okaun para causar dano a cada outro jogador e a cada outra criatura. O teto de poder é muito alto, mas a linha depende de manter Okaun, resolver as ativações, conseguir uma quantidade suficiente de vitórias e resolver Ignition.

### 2.5 Niv-Mizzet, Parun + Curiosity

Curiosity encantando Niv-Mizzet permite transformar o dano de Niv em compra opcional; comprar dispara Niv de novo. Isso pode criar uma sequência repetida de dano e compra, até você parar de comprar ou a interação ser interrompida. É uma linha separada do plano de moedas e um motivo para preservar ambas as cartas.

### 2.6 Sakashima the Impostor

**Sakashima permanece na V2.** Ele pode copiar Okaun ou Zndrsplt sem ficar com o mesmo nome da criatura copiada; a regra que refere um objeto pelo próprio nome é tratada como referência ao próprio objeto. Isso permite contornar a regra das lendárias por nome e ter uma cópia de Okaun/Zndrsplt com habilidades duplicadas. Em especial, copiar um dos comandantes pode gerar outra habilidade de início de combate no turno seguinte se o clone continuar em campo. Essa interação torna Sakashima uma sinergia premium, não um corte.

### 2.7 Kediss e Fling: o que contam — e o que não contam

- **Kediss, Emberclaw Familiar:** quando um comandante seu causa dano de combate a um oponente, causa a mesma quantidade de dano aos outros oponentes. Isso acelera a pressão no multiplayer. Porém, o dano espalhado pelo gatilho de Kediss não é dano de combate causado pelo comandante a esses outros jogadores; portanto, não conta para a regra de 21 de dano de comandante contra eles.
- **Fling:** sacrifica uma criatura como custo adicional e causa dano igual ao poder dela a um alvo. Pode encerrar um oponente já enfraquecido ou converter Okaun em dano em resposta a uma remoção direcionada. Não é dano de comandante; um Okaun 24/24 não mata sozinho um oponente que ainda tenha 40 de vida.

### 2.8 Base de mana e MDFC

A lista tem **34 cartas cuja face frontal é terreno**, mais **Valakut Awakening // Valakut Stoneforge**, que é uma carta dupla face modal: pode ser conjurada como instantânea ou jogada pela face de terreno quando apropriado. Para avaliar opções de mana ela conta funcionalmente como uma 35ª opção de terreno, mas continua contando como **uma única carta** no total. Ancient Tomb substitui Myriad Landscape e mantém o número de cartas com frente de terreno em 34.

---

## 3. Plano de jogo recomendado

### Início — acelerar sem desmontar a mão

Priorizar mãos com fontes de mana colorida, uma peça de aceleração e compra/seleção. Não manter automaticamente uma mão só porque contém Krark's Thumb se ela não consegue conjurar os comandantes ou não desenvolve mana. Ancient Tomb e Mana Vault são para adiantar o plano, não uma promessa de conjurar qualquer carta sem as cores certas.

O ideal é estabelecer o primeiro comandante em uma janela em que seja possível atacar em seguida ou protegê-lo. Thumb é muito importante, mas não vale ignorar completamente a proteção para baixar o artefato sem poder sobreviver ao turno adversário.

### Meio — montar a sequência eficiente

Se Thumb e os dois comandantes estiverem presentes, aproveitar a sequência de moedas para:
1. aumentar Okaun;
2. converter as vitórias em compra com Zndrsplt;
3. escolher a rota de fechamento de acordo com os bloqueadores e a vida dos oponentes.

Se o turno explosivo não for possível, continuar gerando valor com Tavern Scoundrel, Yusri e cartas de moeda, mantendo mana para interação. Jeska's Will ajuda a transformar presença de comandante em uma explosão de mana e acesso temporário a cartas.

### Final — não depender apenas de conectar Okaun

- **Okaun + atropelar/duplo ataque:** Footfall Crater, Shadowspear, Temur Battle Rage e Embercleave ajudam a passar por bloqueadores ou aumentar o dano.
- **Kediss:** usar quando o dano de combate do comandante em um oponente já for expressivo e espalhar a pressão for relevante.
- **Fling:** converter poder em dano não-combatente quando for letal, quando Okaun for ser removido ou quando o combate não puder fechar a partida.
- **Chandra's Ignition:** linha de alto teto se Okaun puder ficar enorme e sobreviver até a resolução.
- **Niv-Mizzet + Curiosity:** rota alternativa para quando o combate estiver travado ou o pacote de Okaun não for acessível.
- **Chance Encounter:** não esquecer a janela de interação antes do próximo upkeep.

---

## 4. Diagnóstico da lista CURRENT

### Pontos fortes

- Identidade de moedas real, não apenas superficial.
- Krark's Thumb, Frenetic Efreet, Tavern Scoundrel, Yusri, Fiery Gambit, Stitch in Time, Chance Encounter, Krark, the Thumbless, Planar Chaos, Karplusan Minotaur e Goblin Traprunner formam um núcleo coerente.
- Alto teto de explosão, com formas de transformar flips em poder, cartas, Tesouros e vitória alternativa.
- Já há uma camada respeitável de tutores e seleção de artefatos: Fabricate, Gamble, Goblin Engineer, Reckless Handling, Reshape, Tribute Mage, Whir of Invention, Muddle the Mixture e Inventors' Fair.
- O deck já conta com remoções/reset relevantes: Chaos Warp, Cyclonic Rift, Blasphemous Act e Invert Polarity.
- Existem ferramentas para atravessar ou proteger o ataque: Lightning Greaves, Swiftfoot Boots, Whispersilk Cloak, Commander's Plate, Champion's Helm, Temur Battle Rage, Embercleave e Shadowspear.

### Gargalos que justificam as trocas

1. **Velocidade de mana:** Myriad Landscape e Midnight Clock são relativamente lentos quando o deck quer criar turnos explosivos.
2. **Interação durante o turno decisivo:** há equipamentos de proteção, mas faltam respostas de pilha gratuitas/eficientes para resguardar a janela.
3. **Fechamento redundante:** Okaun pode ficar enorme sem passar pelos bloqueadores; falta uma forma eficiente de converter esse poder em dano diretamente.
4. **Tutor lento:** Long-Term Plans é uma busca demorada quando a lista já tem boas opções de acesso a artefatos/peças.
5. **Proteção de pilha redundante:** o deck tem várias peças de equipamento para proteger os comandantes; tirar Champion's Helm para incluir interação gratuita mantém uma defesa relevante sem cortar o rock flexível Cursed Mirror.

### Por que a CURRENT recebe 7,5/10

O deck já tem um plano identificável e condições de vitória explosivas, então a nota não é baixa. A penalidade vem de precisar montar uma combinação de peças e manter as peças expostas, além de ter algumas fontes de mana e interação lentas para um plano que pode ser interrompido por uma remoção ou counter na hora crítica. A nota é estrutural, não uma inferência de que o deck perde 25% das partidas.

---

## 5. Proposta PROPOSED V2 — oito trocas e custos de oportunidade

Todas as cartas da coluna IN são sugestões. A lista original permanece como CURRENT, e nenhuma carta é considerada comprada, aplicada ou testada.

| Prioridade | OUT | IN | Ganho pretendido | Custo/risco |
|---|---|---|---|---|
| P1 | Myriad Landscape | Ancient Tomb | Aceleração imediata de duas manas incolores. | Custa 2 de vida por uso e não corrige cores. |
| P1 | Midnight Clock | Mana Vault | Um salto de mana em turnos críticos. | Não é ramp sustentável; pode permanecer virado e cobrar vida. |
| P1 | Possibility Storm | Jeska's Will | Mana explosiva e acesso temporário a até três cartas; com comandante, pode usar os dois modos. | Perde uma peça caótica característica e de teto alto. |
| P1 | Fighting Chance | Fling | Fecha com dano direto e pode converter Okaun em resposta a remoção. | Perde uma carta temática defensiva; Fling não é dano de comandante. |
| P1 | Crash Through | Kediss, Emberclaw Familiar | Distribui dano de comandante pelos outros oponentes. | Perde um cantrip barato que concede atropelar a todas as criaturas controladas ao resolver. |
| P1 | Mizzium Mortars | Deflecting Swat | Redireciona algumas mágicas/habilidades direcionadas sem pagar mana ao controlar comandante. | Perde uma resposta proativa a criaturas e o modo overload. |
| P1 | Champion's Helm | Fierce Guardianship | Proteção gratuita contra uma mágica não-criatura enquanto há um comandante controlado. | Perde +2/+2 e hexproof de um equipamento, mas mantém Greaves, Boots, Commander's Plate e Whispersilk Cloak. |
| P1 | Long-Term Plans | Swan Song | Interação barata para proteger o combo/turno explosivo. | Perde uma opção de tutor geral e Swan Song não acerta mágicas de criatura nem artefatos. |

### Comentário detalhado de cada mudança

#### 1. Myriad Landscape → Ancient Tomb
Myriad Landscape entra virado e só acelera depois de investir mana e esperar. Ancient Tomb converte uma carta de terreno em duas manas imediatamente, útil para acelerar Okaun/Zndrsplt, Thumb ou um turno de desenvolvimento. A troca diminui a capacidade de fixar cores e custa vida repetidamente. A confiança é alta para velocidade, média para o efeito líquido em mãos que já precisam muito de azul/vermelho.

#### 2. Midnight Clock → Mana Vault
Midnight Clock é um motor de compra/recarga mais lento; para aproveitar, precisa ficar em campo, receber marcadores e chegar a uma etapa de manutenção posterior. Mana Vault dá uma explosão imediata para montar mais rápido a mesa. Não é uma fonte que deve ser tratada como mana gratuita eterna: pode não desvirar normalmente e cobra vida se ficar virada durante o upkeep. A mudança é voltada ao plano de explosão, não à vantagem de cartas.

#### 3. Possibility Storm → Jeska's Will
Possibility Storm é parte da identidade caótica do Magic, mas pode trocar uma carta escolhida por uma mágica aleatória e interromper tanto o deck quanto o oponente. Jeska's Will é menos temática, porém mais previsível: com um comandante controlado quando é conjurada, pode gerar mana vermelha conforme a mão de um oponente e ainda permitir jogar cartas do topo do próprio grimório naquele turno. A troca procura elevar a taxa de turnos decisivos sem acrescentar outra mecânica de moedas que disputa espaço com o plano principal.

#### 4. Fighting Chance → Fling
Fighting Chance custa uma mana, mas seu resultado depende de haver criaturas bloqueadoras e uma moeda por cada uma; seu efeito previne dano de combate causado por cada bloqueadora se a moeda for vencida. É divertida, mas não ajuda quando o problema é um Okaun grande impedido de passar ou ameaçado por remoção direcionada. Fling transforma poder em dano imediato e tem utilidade de contingência. Importante: o número de dano é igual ao último poder conhecido da criatura sacrificada; se Okaun for 24/24, são 24 de dano, não 40 nem dano de comandante. Esta é uma das mudanças com maior impacto no fechamento.

#### 5. Crash Through → Kediss, Emberclaw Familiar
Crash Through é eficiente pelo custo e compra uma carta, mas o atropelar se sobrepõe a Footfall Crater, Shadowspear, Temur Battle Rage e Embercleave. Kediss oferece um efeito diferente: espalha aos oponentes restantes a quantidade de dano de combate que um comandante seu causou a um jogador. Quando Okaun atravessa por 24 ou mais, isso pode deixar a mesa inteira em alcance de finalização. O dano distribuído por Kediss não conta como dano de comandante para os outros oponentes, o que impede interpretar essa carta como uma vitória automática por dano de comandante.

#### 6. Mizzium Mortars → Deflecting Swat
Mizzium Mortars é uma remoção razoável, mas em seis manas para o modo amplo pode ser lenta no turno em que o deck está tentando fechar. A lista ainda mantém Blasphemous Act, Chaos Warp, Cyclonic Rift e Invert Polarity para responder/estabilizar. Deflecting Swat protege a sequência de cartas redirecionando mágicas ou habilidades que tenham alvo e custa zero quando você controla um comandante. A confiança é média-alta porque a troca fica pior em mesas dominadas por criaturas que precisam de remoção direta e melhor em mesas com remoções direcionadas e interação de pilha.

#### 7. Champion's Helm → Fierce Guardianship
Champion's Helm dá +2/+2 e hexproof à criatura lendária equipada, sendo boa proteção em si. O motivo do corte não é baixa qualidade: há quatro outras peças de equipamento/ proteção relevantes (Lightning Greaves, Swiftfoot Boots, Commander's Plate e Whispersilk Cloak), além de proteções na pilha. Fierce Guardianship adiciona uma resposta gratuita a uma mágica não-criatura enquanto você controla um comandante e ajuda a resguardar o turno crítico. O custo é perder a camada de hexproof/+2/+2; os testes devem confirmar se isso é sentido.

#### 8. Long-Term Plans → Swan Song
Long-Term Plans pode encontrar qualquer carta, mas por três manas deixa-a em terceiro do topo e ainda exige acesso a compra/seleção para obtê-la. O deck já tem Fabricate, Gamble, Goblin Engineer, Reckless Handling, Reshape, Tribute Mage, Whir of Invention, Muddle the Mixture e Inventors' Fair para acessar peças. Swan Song é muito mais barato para proteger a linha, embora seja restrito a encantamentos, instantâneas e feitiços e dê ao oponente uma ficha 2/2. A troca reduz flexibilidade de tutor para aumentar a proteção no turno decisivo.

### O que deliberadamente NÃO cortar

- **Krark's Thumb:** peça central da identidade e multiplicador de chance.
- **Frenetic Efreet / Chance Encounter:** linha explosiva que também recompensa flips.
- **Tavern Scoundrel, Yusri, Krark, the Thumbless, Fiery Gambit, Stitch in Time, Squee's Revenge, Planar Chaos, Karplusan Minotaur, Goblin Traprunner e Goblin Kaboomist:** preservam densidade e sabor de moedas.
- **Sakashima the Impostor, Spark Double e Irenicus's Vile Duplication:** mantêm redundância/cópias e possíveis sequências adicionais.
- **Niv-Mizzet, Parun + Curiosity:** mantém uma segunda rota de vitória diferente do ataque de Okaun.
- **Chandra's Ignition, Embercleave, Footfall Crater, Shadowspear, Temur Battle Rage, Two-Handed Axe e Seize the Day:** são formas distintas de converter poder em fim de jogo.

---

## 6. Organização funcional flexível (8 grupos)

Não forço 8 grupos idênticos de oito cartas: a função real importa mais que a simetria. O número de cartas abaixo é uma classificação principal para os **63 spells comuns**; cartas podem contribuir secundariamente a outros grupos sem serem contadas duas vezes.

| Grupo | CURRENT | PROPOSED V2 | Função |
|---|---:|---:|---|
| Ramp & desenvolvimento de mana | 8 | 9 | Acelerar comandantes e turnos explosivos. |
| Motores e geradores de moedas | 12 | 12 | Produzir moedas, compras, Tesouros ou valor repetido. |
| Payoffs de moedas e vitórias alternativas | 6 | 5 | Converter moedas em crescimento, counters, vantagem ou vitória. |
| Tutores, compra e seleção | 12 | 11 | Encontrar Thumb, montar combo e manter a mão. |
| Acesso ao dano letal de Okaun | 8 | 9 | Passar por bloqueadores, amplificar dano ou converter poder. |
| Proteção e interação de pilha | 5 | 7 | Proteger peças e o turno em que o plano fecha. |
| Remoções, disrupção e resets | 6 | 4 | Responder a ameaças ou reiniciar mesa. |
| Clones e combo secundário | 6 | 6 | Redundância de habilidades e Niv-Mizzet + Curiosity. |
| **Total** | **63** | **63** | O MDFC Valakut Awakening é tratado separadamente, sem dupla contagem. |

A V2 melhora o pacote de aceleração/defesa e as opções de finalizar, ao custo de menos um slot de payoff de moeda, um tutor lento e duas respostas/efeitos mais situacionais. Essa escolha precisa ser testada: se ficar sem resposta para criaturas grandes for frequente, a prioridade é recuperar uma remoção eficiente, não adicionar mais um payoff de moeda.

---

## 7. Lista congelada CURRENT

**Contagem:** 100 cartas incluindo comandantes (2 comandantes + 98 cartas na zona principal). A listagem abaixo usa nomes e quantidades; os códigos de edição/acabamentos podem ser consultados na entrada original do usuário e na aba `Current List` do Excel.

```text
1 Okaun, Eye of Chaos
1 Zndrsplt, Eye of Wisdom
1 Academy Ruins
1 Arcane Signet
1 Blasphemous Act
1 Buried Ruin
1 Cascade Bluffs
1 Champion's Helm
1 Chance Encounter
1 Chandra's Ignition
1 Chaos Warp
1 Command Tower
1 Commander's Plate
1 Crash Through
1 Curiosity
1 Cursed Mirror
1 Cyclonic Rift
1 Desolate Lighthouse
1 Embercleave
1 Exotic Orchard
1 Expressive Iteration
1 Fabricate
1 Fiery Gambit
1 Fighting Chance
1 Flamekin Village
1 Footfall Crater
1 Frenetic Efreet
1 Gamble
1 Goblin Archaeologist
1 Goblin Engineer
1 Goblin Kaboomist
1 Goblin Traprunner
1 Great Furnace
1 Impulsive Maneuvers
1 Inventors' Fair
1 Invert Polarity
1 Irenicus's Vile Duplication
5 Island
1 Izzet Boilerworks
1 Izzet Signet
1 Karplusan Minotaur
1 Krark's Thumb
1 Krark, the Thumbless
1 Lightning Greaves
1 Long-Term Plans
1 Midnight Clock
1 Mind Stone
1 Mirror March
1 Mizzium Mortars
1 Mogg Assassin
7 Mountain
1 Muddle the Mixture
1 Myriad Landscape
1 Niv-Mizzet, Parun
1 Planar Chaos
1 Ponder
1 Possibility Storm
1 Ral Zarek
1 Reckless Handling
1 Reliquary Tower
1 Reshape
1 Rhystic Study
1 Riverglide Pathway
1 Rogue's Passage
1 Sakashima the Impostor
1 Seize the Day
1 Shadowspear
1 Shivan Reef
1 Sol Ring
1 Spark Double
1 Spinerock Knoll
1 Squee's Revenge
1 Stitch in Time
1 Stormcarved Coast
1 Sulfur Falls
1 Swiftfoot Boots
1 Talisman of Creativity
1 Tavern Scoundrel
1 Temple of Epiphany
1 Temur Battle Rage
1 The Gold Saucer
1 Thought Vessel
1 Tolaria West
1 Training Center
1 Tribute Mage
1 Two-Handed Axe
1 Valakut Awakening
1 Whir of Invention
1 Whispersilk Cloak
1 Yusri, Fortune's Flame
```

## 8. Lista projetada PROPOSED V2

**Contagem:** 100 cartas incluindo comandantes. São exatamente oito trocas; nenhuma outra carta muda. Esta lista ainda não foi testada.

```text
1 Okaun, Eye of Chaos
1 Zndrsplt, Eye of Wisdom
1 Academy Ruins
1 Arcane Signet
1 Blasphemous Act
1 Buried Ruin
1 Cascade Bluffs
1 Fierce Guardianship
1 Chance Encounter
1 Chandra's Ignition
1 Chaos Warp
1 Command Tower
1 Commander's Plate
1 Kediss, Emberclaw Familiar
1 Curiosity
1 Cursed Mirror
1 Cyclonic Rift
1 Desolate Lighthouse
1 Embercleave
1 Exotic Orchard
1 Expressive Iteration
1 Fabricate
1 Fiery Gambit
1 Fling
1 Flamekin Village
1 Footfall Crater
1 Frenetic Efreet
1 Gamble
1 Goblin Archaeologist
1 Goblin Engineer
1 Goblin Kaboomist
1 Goblin Traprunner
1 Great Furnace
1 Impulsive Maneuvers
1 Inventors' Fair
1 Invert Polarity
1 Irenicus's Vile Duplication
5 Island
1 Izzet Boilerworks
1 Izzet Signet
1 Karplusan Minotaur
1 Krark's Thumb
1 Krark, the Thumbless
1 Lightning Greaves
1 Swan Song
1 Mana Vault
1 Mind Stone
1 Mirror March
1 Deflecting Swat
1 Mogg Assassin
7 Mountain
1 Muddle the Mixture
1 Ancient Tomb
1 Niv-Mizzet, Parun
1 Planar Chaos
1 Ponder
1 Jeska's Will
1 Ral Zarek
1 Reckless Handling
1 Reliquary Tower
1 Reshape
1 Rhystic Study
1 Riverglide Pathway
1 Rogue's Passage
1 Sakashima the Impostor
1 Seize the Day
1 Shadowspear
1 Shivan Reef
1 Sol Ring
1 Spark Double
1 Spinerock Knoll
1 Squee's Revenge
1 Stitch in Time
1 Stormcarved Coast
1 Sulfur Falls
1 Swiftfoot Boots
1 Talisman of Creativity
1 Tavern Scoundrel
1 Temple of Epiphany
1 Temur Battle Rage
1 The Gold Saucer
1 Thought Vessel
1 Tolaria West
1 Training Center
1 Tribute Mage
1 Two-Handed Axe
1 Valakut Awakening
1 Whir of Invention
1 Whispersilk Cloak
1 Yusri, Fortune's Flame
```

---

## 9. Scorecard da avaliação

| Eixo | CURRENT /10 | PROPOSED V2 /10 | Motivo da mudança |
|---|---:|---:|---|
| Encaixe estratégico | 9,0 | 9,0 | Já é um deck temático muito coerente; V2 mantém a identidade. |
| Velocidade / aceleração | 6,8 | 8,5 | Ancient Tomb, Mana Vault e Jeska's Will encurtam o caminho ao turno explosivo. |
| Consistência | 7,1 | 8,2 | Mais acesso ao turno decisivo e mais proteção; não elimina a variância natural. |
| Compra / seleção | 7,8 | 7,8 | O núcleo atual já é denso; não se aposta em aumentar ainda mais tutores lentos. |
| Interação / responsividade | 6,9 | 8,3 | Deflecting Swat, Fierce Guardianship e Swan Song melhoram a defesa da pilha. |
| Resiliência | 7,0 | 8,1 | Maior chance de proteger a comandante, Thumb e uma janela de combo. |
| Sinergia temática | 9,3 | 9,1 | Mantém o núcleo de moedas; um payoff de moeda sai em troca de Fling. |
| Fechamento | 7,8 | 8,7 | Fling e Kediss ampliam as formas de converter Okaun em dano. |
| Flexibilidade / dupla função | 7,6 | 8,0 | Há mais proteção e mais conversão de poder em dano. |
| Custo de oportunidade | 7,0 | 7,8 | Trocamos peças lentas/situacionais, mas perdemos algumas linhas de valor real. |

**Nota estimada CURRENT: 7,5/10.**  
**Nota projetada PROPOSED V2: 8,4/10.**

A V2 não recebe 9,5–10 porque ainda depende de peças expostas, permanece sujeita à variância e não foi provada em partidas. Para justificar uma nota maior será necessário observar consistência e não apenas o teto de um turno perfeito.

---

## 10. Playtest — o que registrar

Registrar pelo menos 5–10 partidas antes de uma segunda rodada de upgrades. Uma partida isolada não é evidência suficiente para cortar ou manter uma carta.

Em cada partida, anotar:
- versão usada (CURRENT ou PROPOSED V2), tamanho do pod e resultado;
- se a mão inicial tinha mana, acesso à comandante e uma carta de desenvolvimento/proteção;
- turno do primeiro ataque de Okaun ou primeiro gatilho relevante de Zndrsplt;
- se Krark's Thumb apareceu e foi protegido;
- número aproximado de cartas compradas via Zndrsplt;
- se Okaun conectou, foi bloqueado ou foi removido;
- se Fling, Kediss, Chandra's Ignition, Chance Encounter ou Niv-Mizzet + Curiosity fecharam a partida;
- cartas que ficaram mortas na mão ou foram lentas;
- se sentiu falta de remoção direta depois de tirar Mizzium Mortars;
- se o modo de cópia de Cursed Mirror gerou ataques/coins relevantes;
- se a proteção gratuita estava disponível no momento crítico.

### Critérios para manter ou reverter mudanças

- **Ancient Tomb/Mana Vault:** manter se adiantarem comandantes e turnos explosivos com frequência sem criar mãos com cores impossíveis ou custo de vida problemático.
- **Jeska's Will:** manter se gerar turnos com múltiplas ações importantes, não apenas mana excedente.
- **Fling/Kediss:** medir quantas vezes convertem poder em dano relevante; se Kediss for fraca por falta de conexão, priorizar evasão ou proteção em sua vaga.
- **Deflecting Swat/Fierce Guardianship/Swan Song:** registrar se impediram uma remoção/counter importante; se faltarem respostas a permanentes já resolvidas, devolver uma remoção eficiente.
- **Fighting Chance/Crash Through:** observar se sua perda foi sentida; se sim, a proposta pode ser parcialmente revertida, não é preciso aceitar as oito trocas em bloco.

---

## 11. Fontes de pesquisa

- [Scryfall — Okaun, Eye of Chaos](https://scryfall.com/card/sld/380/okaun-eye-of-chaos-okaun-eye-of-chaos) — Texto Oracle e legalidade da comandante.
- [Scryfall — Zndrsplt, Eye of Wisdom](https://scryfall.com/card/sld/379/zndrsplt-eye-of-wisdom-zndrsplt-eye-of-wisdom) — Texto Oracle da compra e sequência de moedas.
- [EDH.Wiki — Okaun/Zndrsplt Coin Flip](https://edh.wiki/commanders/okaun-eye-of-chaos-zndrsplt-eye-of-wisdom/coin-flip/) — Benchmark para o arquétipo, cartas de alta sinergia e estratégia.
- [Regras abrangentes oficiais da Wizards](https://media.wizards.com/2026/downloads/MagicCompRules%2020260619.pdf) — Regras 705 sobre moedas; consulte também 113.7a sobre habilidades na pilha que independem da fonte.
- [EDHREC — Frenetic Efreet + Chance Encounter](https://edhrec.com/combos/izzet/2199-4800) — Sequência de ativações de custo zero, flips e vitória no próximo upkeep.
- [Scryfall — Sakashima the Impostor](https://scryfall.com/card/sld/1232/sakashima-the-impostor) — Exceção de nome da cópia e permanência do nome próprio.
- [Scryfall — Jeska's Will](https://scryfall.com/card/cmr/187/jeskas-will) — Texto Oracle dos dois modos e condição para escolher ambos.
- [Scryfall — Kediss, Emberclaw Familiar](https://scryfall.com/card/cmr/188/kediss-emberclaw-familiar) — Dano espelhado aos outros oponentes, distinto de dano de comandante.
- [Scryfall — Fierce Guardianship](https://scryfall.com/card/c20/36/fierce-guardianship) — Interação gratuita condicionada a controlar comandante.
- [Scryfall — Deflecting Swat](https://scryfall.com/card/c20/50/deflecting-swat) — Redirecionamento de mágica/habilidade com alvo.
- [Scryfall — Swan Song](https://scryfall.com/card/ths/65/swan-song) — Proteção de baixo custo contra instantâneas, feitiços e encantamentos.
- [Scryfall — Ancient Tomb](https://scryfall.com/card/tmp/315/ancient-tomb) — Aceleração incolor imediata com custo em vida.
- [Scryfall — Mana Vault](https://scryfall.com/card/2xm/270/mana-vault) — Aceleração explosiva e risco de não desvirar normalmente.
- [Scryfall — Fling](https://scryfall.com/card/m20/140/fling) — Conversão de poder em dano direto sacrificando a criatura.
- [Scryfall — Cursed Mirror](https://scryfall.com/card/c21/50/cursed-mirror) — Rock vermelho e cópia temporária com ímpeto.
- [Scryfall — Crash Through](https://scryfall.com/card/m21/140/crash-through) — Atropelar temporário + compra de uma carta.
- [Scryfall — Fighting Chance](https://scryfall.com/card/exo/82/fighting-chance) — Prevenção situacional de dano das criaturas bloqueadoras.

As fontes externas foram usadas para verificar texto Oracle, interações e referências do arquétipo. A recomendação individual, as notas, a seleção final de oito trocas e a leitura de custo-benefício são análise estratégica, não fatos oficiais de uma base de dados.

---

## 12. Histórico de versão e próximos passos

### Histórico
- **CURRENT:** lista enviada pelo usuário em 14/10/2026; congelada e não alterada.
- **PROPOSED V2:** oito trocas listadas acima; não testada.
- **TESTED:** ainda não existe versão com resultados registrados.
- **REJECTED/ARCHIVE:** nenhuma troca foi rejeitada pelo usuário ainda.

### Próximos três passos
1. Revisar a `Upgrade Matrix` do Dashboard e selecionar se deseja implementar as oito propostas de uma vez ou priorizar as de velocidade e proteção.
2. Jogar 5–10 partidas com a versão escolhida, anotando os critérios de playtest.
3. Reavaliar especialmente o pacote de remoção versus proteção: o maior risco da V2 é ficar melhor em proteger o próprio combo, mas pior em responder a criaturas já resolvidas.

### Prompt curto para retomar em outro chat

> Continue a análise profunda de Okaun, Eye of Chaos // Zndrsplt, Eye of Wisdom usando este handover e o `Okaun_Zndrsplt_Dashboard_V2.xlsx`. Preserve CURRENT e PROPOSED separados. V2 tem oito trocas e ainda não foi testada. Confirme a versão realmente usada antes de recomendar alterações adicionais; use os resultados de partidas para decidir se as melhorias aumentaram velocidade, proteção e fechamento sem sacrificar o núcleo especial de moedas do precon.
