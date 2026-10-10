# Handover: análise do deck do Fynn (Fynn, the Fangbearer)

Versão 1.0, de 09/10/2026. Este documento basta para um chat novo retomar o deck do Fynn de onde parou. Complementa o `Handover_Analise_de_Decks.md` v1.1.

## 0. Como usar (para o Danylo)

1. Abra um chat novo e anexe este arquivo e o `analise-claude-fynn.md`. Se puder, anexe também o handover geral.
2. Responda as perguntas da seção 5 na primeira mensagem.
3. Salve a análise em `dados/XX. Fynn/entrada/analise-claude.md`.

## 1. Onde paramos

- **Feito:** conferência da lista, leitura do comandante, texto das 70 cartas conferido, análise completa entregue (`analise-claude-fynn.md`), radar com cartas até outubro de 2026.
- **Não houve ponto de controle.** O Danylo pediu dois decks no mesmo chat e a entrega direta. As decisões que ficaram sem a palavra dele estão na seção 5.
- **Falta:** as respostas da seção 5, a rodada de refinamento ("7/10", "revise") e as análises das outras IAs para a seção de confronto.

## 2. O que o Danylo disse sobre este deck

Registre como restrições.

- O deck nasceu da vontade de ter um deck de cada cor. Este é o mono-green.
- Escolheu o comandante por custar pouca mana e ter tema e condição de vitória definidos: "infect e proliferar".
- Vê como vantagem do verde pôr muitas florestas em jogo. Vê como problema **perder o gás**: recuperar a mão para baixar cartas e agredir na hora certa.
- Estratégia nas palavras dele: não tem como fugir de ser aggro e matar o mais rápido possível.
- Não marcou carta de estimação.
- Orçamento sem teto, sempre.

**Agrupamentos que ele definiu:** 1. Ramp; 2. Draw; 3. Removal; 4. Sinergia; 5. Proteção; 6. Buff + WinCon; 7. Proliferar; 8. Dupla Função (2em1).

Links que ele mandou:
- https://scryfall.com/card/fdn/637/fynn-the-fangbearer
- https://edh.wiki/commanders/fynn-the-fangbearer/infect/
- https://edh.wiki/commanders/fynn-the-fangbearer/deathtouch/

## 3. A lista

```
COMMANDER
1 Fynn, the Fangbearer

1 Acidic Slime
1 Adaptive Sporesinger
1 Ambush Viper
1 Ankle Biter
1 Arcane Signet
1 Aspect of Hydra
1 Basilisk Collar
1 Beanstalk Giant
1 Beast Within
1 Blackblade Reforged
1 Blighted Woodland
1 Bloated Contaminator
1 Branchblight Stalker
1 Bushwhack
1 Caged Sun
1 Cankerbloom
1 Collective Resistance
1 Colossification
1 Contagion Engine
1 Courage in Crisis
1 Deadly Recluse
1 Disorienting Choice
1 End-Raze Forerunners
1 Endless Atlas
1 Enduring Vitality
1 Expand the Sphere
1 Explore
1 Ezuri's Predation
1 Fang of Shigeki
1 Flesh Burrower
1 Font of Mythos
30 Forest
1 Genesis Wave
1 Glistening Sphere
1 Harmonize
1 Hornet Queen
1 Horrid Vigor
1 Insidious Fungus
1 Karametra's Acolyte
1 Karn's Bastion
1 Kodama's Reach
1 Lifecrafter's Bestiary
1 Lightning Greaves
1 Loxodon Warhammer
1 Mask of Avacyn
1 Myriad Landscape
1 Natural Reclamation
1 Pick Your Poison
1 Plague Myr
1 Pollenbright Druid
1 Preposterous Proportions
1 Quietus Spike
1 Return of the Wildspeaker
1 Scytheclaw
1 Sedge Scorpion
1 Silklash Spider
1 Skyreaping
1 Snakeskin Veil
1 Sol Ring
1 Soul's Majesty
1 Strength in Numbers
1 Swiftfoot Boots
1 Tajuru Blightblade
1 Temple of the False God
1 Thornweald Archer
1 Throne of the High City
1 Tome of Legends
1 Wild Growth
1 Windstorm
1 Yavimaya Elder
```

## 4. O que já foi conferido e concluído

### 4.1 Lista

| Item | Resultado |
|---|---|
| Contagem | 100 cartas. Só Forest se repete (30) |
| Identidade de cor | Tudo verde ou incolor |
| Banidas | Nenhuma |
| Fontes de terreno | 35 (30 Forest e 5 utilitários). Nenhuma carta dupla |
| Game Changers | Nenhum |
| Criaturas | 23, sendo 10 com toque mortífero impresso, mais o Fynn |

### 4.2 Comandante (texto conferido em três fontes)

Fynn, the Fangbearer. {1}{G}, Legendary Creature — Human Warrior, 1/3. Toque mortífero. Sempre que uma criatura sua com toque mortífero causa dano de combate a um jogador, ele recebe dois marcadores de veneno.

Só há uma regra oficial: o veneno mata mesmo que o Fynn já tenha saído de campo. O resto é leitura do texto:

1. **Não é infectar.** São dois marcadores fixos por gatilho, com qualquer valor de dano.
2. A criatura precisa ter toque mortífero no momento do dano.
3. Cada criatura dispara em separado.
4. Só dano de combate, só a jogador. Luta não conta.
5. O Fynn é Humano: não conta para Return of the Wildspeaker.

### 4.3 Plano

**Morder, marcar, proliferar.** Proliferar acrescenta um marcador a cada jogador já envenenado, então a prioridade é marcar os três oponentes cedo. Sem proliferar, matar a mesa pede quinze conexões.

### 4.4 Diagnóstico em números

| Item | Lista |
|---|---|
| Ramp dedicado | 12 |
| Compra dedicada | 10 |
| Remoção | 11 |
| Proteção | 6, nenhuma de mesa |
| Proliferar | 9, com 3 repetíveis |
| Toque mortífero para todas | 0 |
| Evasão em massa | 1 (End-Raze Forerunners) |
| CMC médio | 3,03 |
| Placar | 348 |

### 4.5 As conclusões que não podem se perder

1. Os aumentos da lista não acrescentam veneno. O que acrescenta é mais criaturas com toque mortífero conectando.
2. Há três relógios que não se somam: veneno, dano de comandante e metade da vida.
3. Faltam evasão em massa e toque mortífero em massa.
4. A lista é ramp com começo agressivo, não aggro.
5. A compra existe, mas duas das maiores dependem de poder num deck de 1/1 e uma é simétrica.
6. Windstorm, Skyreaping e Silklash Spider matam a própria Hornet Queen.

### 4.6 Cortes e entradas propostos

**Fila de corte:** Colossification, Preposterous Proportions, Font of Mythos, Scytheclaw, Windstorm, Skyreaping, Caged Sun, Soul's Majesty, Mask of Avacyn, Karametra's Acolyte. Terreno: Temple of the False God.

**Entram:** Ohran Frostfang, Bow of Nylea, Saryth the Viper's Fang, Toski Bearer of Secrets, Triumph of the Hordes, Champion of Lambholt, Infectious Bite, Contaminant Grafter, Evolution Sage, Heroic Intervention, Rogue's Passage.

**A avaliar:** Vorinclex Monstrous Raider, Noxious Newt, Beast Whisperer, Hit-Monkey, Attercop.

**Recusadas, com motivo na análise:** Craterhoof Behemoth, Overwhelming Stampede, Viridian Longbow, Tyrranax Rex, Paladin of Predation, Phyrexian Swarmlord, Gaea's Cradle, Natural Order, Worldly Tutor. My Precious tem identidade preta e não entra.

**Nome de painel sugerido:** Dez Gotas. Opções: Presa e Peçonha, Mordida Lenta.

## 5. Perguntas em aberto

1. **Eixo 8.** "Dupla Função" conta o mesmo mérito duas vezes. Mantém, ou troca por **Evasão**, que é o que o deck mais precisa medir?
2. **Carta de estimação.** Alguma das dez da fila de corte fica de qualquer jeito?
3. **Veneno ou dano.** O Fynn gigante por dano de comandante (Colossification, Blackblade Reforged) é um plano que você quer manter, ou o deck é só de veneno?
4. **Voadores.** Windstorm, Skyreaping e Silklash Spider estão aí por causa da sua mesa de jogo? Se sim, vale manter uma.

## 6. O que o chat novo deve fazer

1. Ler este arquivo e as respostas. Não repetir o que já foi respondido.
2. Se o eixo 8 mudar, refazer as notas das 71 linhas e o placar.
3. Conferir as duas regras pendentes: Vorinclex dobrando o veneno do Fynn; Triumph of the Hordes somando o veneno do infectar com os dois do Fynn.
4. Confrontar com as análises das outras IAs, se vierem.
5. Esperar o refinamento por rodadas.

## Método, em resumo

Vale o `Handover_Analise_de_Decks.md` v1.1. Para o caso de ele não estar anexado:

- **Papel:** analista crítico de um deck de Commander. Português do Brasil, nomes das cartas em inglês. O dono é diretor de FP&A: resposta direta, com o motivo escrito, sem bajulação. A pergunta que decide: a carta é boa, ou é boa neste comandante? O analista não constrói painel nem HTML.
- **Regras de verdade:** texto de carta e regra do jogo nunca de memória quando houver dúvida; carta dupla com terreno no verso conta como fonte de terreno; número de site de comunidade mede presença, não força; condição de tempo se lê palavra por palavra.
- **Notas por eixo:** 0 não faz; 1 faz de passagem; 2 é função da carta; 3 é referência no deck. Terreno que sempre entra virado leva −1 em Ramp.
- **Tier:** S define o deck; A titular; B cumpre o papel; C substituível; D fora de lugar. **Relevância:** INS nunca sai; ALT só sai por algo claramente melhor; MÉD trocável; BAX primeira a sair.
- **Faixas:** fontes de terreno 35 a 37; ramp 10 a 12; compra 10 a 12; remoção 8 a 12, com 3 a 5 em massa.
- **Placar:** pontos do CMC médio, mais aceleração (soma de Ramp dividida pelo CMC; cada 0,5 vale 5; teto 90), mais a soma das notas.
- **Entrega:** arquivo Markdown com as seções 1 a 9 (Plano, Agrupamentos, Carta a carta, Diagnóstico, Combos e linhas, Cortes, Entradas, Proposta para o painel, Dúvidas), e 10 (Confronto) se vierem outras análises.

## Fontes que funcionaram nesta sessão

- Scryfall e Gatherer não responderam. O mtg.wtf limita depois de uma ou duas consultas.
- **`json.edhrec.com/cards/<slug>`** entrega o texto atual da carta (espelha o Scryfall). Pedir o texto em trechos curtos, senão a ferramenta resume em vez de citar.
- **`json.edhrec.com/pages/commanders/<slug>.json`** entrega inclusão, sinergia e cartas novas do comandante, mais atual que o edh.wiki.
- **`api.magicthegathering.io`** entrega as regras oficiais por carta, com redação antiga e dados até 2023.
- **`mtg.wiki/page/Monarch`** traz a regra 724 das Regras Abrangentes.
- **Card Kingdom** (listagem por coleção) e **grimoria.app** servem para as cartas de 2026.
- Coleções de 2026 até hoje: Lorwyn Eclipsed (jan), Teenage Mutant Ninja Turtles (mar), Secrets of Strixhaven (abr), Marvel Super Heroes (jun), The Hobbit (ago), Reality Fracture (out). Star Trek sai em 13/11/2026.
- Lista de Game Changers em vigor: 09/02/2026, 53 cartas.
