# Tier list de cartas: critérios Claude 1.0

**Autor:** Claude (Opus), em conversa com o Danylo, 09/11/2026.
**Status:** decisões do dono fechadas em 09/11/2026 (seção 17). Pronta para o piloto. Ainda não está implementada em nenhum deck.
**Como usar:** é um dos arquivos de `dados/estratégias/tier list/`. Quando o dono pedir, o Claude Code lê todos os arquivos da pasta, monta o digest em `contexto/estrategias/tier-list.md` com as decisões do dono e só então implementa, com plano antes (regra 9 do `CLAUDE.md`).

---

## 0. Em uma página

**A pergunta da tier list:**

> Quanto o deck perde se esta carta sair e entrar a melhor alternativa possível para o mesmo papel?

Não é "quão forte é a carta". É o **valor sobre a reposição**, o mesmo raciocínio do EVA: a carta só "cria valor" se render mais que o custo de capital do slot, e esse custo é o melhor substituto disponível.

**Como a letra sai, em seis passos:**

1. Escreva a **conta do deck**: três verbos e os papéis que ela precisa.
2. Dê a cada carta um **papel** e cinco notas de 0 a 3, as **lentes**: Encaixe, Impacto, Taxa, Quadrantes e Reposição.
3. Aplique as **travas**: antissinergia, win-more, dependência e substituto nomeado.
4. Calcule o **índice**, a média ponderada das lentes com os pesos do grupo do deck.
5. Converta o índice em **A, B, C ou D**.
6. Só promova a **S** a carta que passar pelo **portão do S**. Falhou em qualquer item, fica em A, com o motivo escrito.

**Decisões do dono que este método respeita (09/11/2026):**

- Cinco tiers e nada mais: S, A, B, C, D. Sem subníveis.
- Nenhuma regra de tipo ou de tribo no S. O S exige argumentos, não pertencer a uma tribo.
- Pet não muda a letra, nem para cima nem para baixo. A letra é honesta, e o pet só fica fora do corte.
- Pesos por grupo do deck.
- O Claude Code avisa quando a tarefa pede troca de modelo.

---

## 1. Por que mudar

1. **A mesma régua dava resultados diferentes.** Os três handovers de 14/10 dão notas diferentes ao mesmo deck: Zur 6,3, 6,4 ou 5,5; Krenko 7,1, 6,0 ou 6,5. Com o tier é igual, só que escondido atrás de uma letra. Sem critério auditável, a letra depende de quem avalia.
2. **O S misturava duas coisas:** "define o deck" e "é a melhor carta do deck". Daí a regra remendo do tribal, agora retirada. O Toxic Deluge no Clavileño é o exemplo: é a melhor no que faz, mas não define a conta.
3. **"Substituível" sem nomear o substituto é opinião.** Substituível por quem?
4. **Faltava o momento do jogo.** A régua não pegava a carta que só funciona quando você já está ganhando, nem a que fica morta na mão.
5. **Tier e Relevância se sobrepunham.** Eram dois chutes lado a lado sobre a mesma coisa: o quanto dói tirar a carta.

---

## 2. Princípios

1. **A letra é do deck, não da carta.** Não existe tier universal. O mesmo Sol Ring pode ser A num deck e C em outro (por exemplo, numa lista com aceleração acima da cota e curva muito baixa).
2. **Piso, não teto.** A carta é avaliada pelo que faz numa partida média deste deck, não no tabuleiro dos sonhos. Teto sem piso não sobe de letra. (Ideia do documento do GROK.)
3. **Substituto com nome.** Toda carta C ou abaixo cita a carta melhor, ou diz que a função passou da cota.
4. **Primeiro as notas, depois a letra.** É proibido escolher a letra e inventar as notas depois.
5. **Julgamento nas notas, regra na letra.** O avaliador julga as cinco lentes e as travas, sempre com uma frase de porquê (regra 7 do `CLAUDE.md`). A letra sai da regra. Assim duas IAs que concordam nas notas chegam à mesma letra, e quando discordarem, a discordância aparece numa lente específica, onde dá para discutir.
6. **Uma escala só no projeto: 0 a 3**, a mesma da rubrica v3. Não usar 0 a 4 nem 0 a 100: a precisão a mais seria ilusória.
7. **Texto de carta nunca de memória** (regra 5 do `CLAUDE.md`). Lente sem texto conferido leva confiança baixa.

---

## 3. Antes de classificar: a conta, os papéis e as cotas

Sem isto, a tier é chute. Escreva no topo da tier list do deck, em meia página, e não mude no meio da avaliação.

1. **A conta:** três verbos que só este comandante paga (Krenko: dobrar, converter, recomeçar).
2. **Os papéis** (uma carta tem **um** papel primário; os secundários se anotam, mas não contam na cota):

| Papel | O que é |
|---|---|
| Motor | Gera o recurso central do deck, de forma repetida |
| Conversor | Transforma o recurso central em vitória, cartas ou mana (o "converter" do método) |
| Habilitador | Liga o motor ou o comandante: põe em campo, dá ímpeto, encontra |
| Infraestrutura | Mana, compra genérica e fixação de cores: o que qualquer deck das cores precisaria |
| Resposta | Remoção, anulação, limpeza de mesa |
| Proteção | Protege o comandante ou o motor, ou reconstrói depois de uma limpeza |
| Fechamento | Termina a partida |

3. **As cotas:** quantas cartas de cada papel o deck quer, dada a curva. O ponto de partida são as faixas da rubrica v3 (Draw e Aceleradores de 10 a 12, Remoção de 8 a 12) e as referências do `AVALIACAO.md` (de 33 a 35 fontes de terreno). Ajuste ao plano e diga quando se afastar de propósito. A cota alimenta a lente R (seção 4.5). (A ideia de cota por papel vem do documento do GROK.)

---

## 4. As cinco lentes

Cada lente responde a uma pergunta e recebe uma nota de 0 a 3, com uma frase de porquê.

### 4.1 E, Encaixe: a conta do deck depende dela?

| Nota | Quando |
|---|---|
| 0 | Não avança a conta, ou empurra a conta de outro deck |
| 1 | Infraestrutura que qualquer deck das cores usaria (ramp, compra genérica, remoção genérica). Não é insulto: carta com E = 1 pode ser A |
| 2 | Alimenta um verbo da conta toda vez que resolve: dispara o comandante, ou rende mais por causa da densidade que a lista já tem |
| 3 | É um verbo da conta, ou o único jeito de o verbo acontecer no ritmo certo (motor, conversor ou peça de combo da própria lista) |

O tipo da carta não entra aqui. Carta fora da tribo pode ter E = 3 se for o conversor do deck.

**Correção em relação ao que eu disse na conversa:** propus que a acessibilidade (ser buscável pelo comandante ou por tutores) subisse o E. Retiro. A calibração do TIER MASTER mostra por que não: o Out of Time é buscável pelo Zur e mesmo assim trabalha contra o plano. Ser buscável é **critério de desempate** (seção 7), não encaixe.

### 4.2 I, Impacto: o que muda na mesa quando ela resolve?

| Nota | Quando |
|---|---|
| 0 | Quase nada |
| 1 | Um por um, ou um corpo; ou um valor que só chega se a carta sobreviver uma volta da mesa |
| 2 | Dois por um, ou motor que precisa sobreviver; ou efeito grande e garantido na entrada |
| 3 | Vira o jogo, ou motor que rende todo turno com valor já na entrada |

**Valor garantido contra valor que depende de sobreviver:** o mesmo efeito vale um nível a menos quando depende de a carta ficar na mesa. É o argumento da CoolStuffInc: a Eternal Witness bate o Tarmogoyf porque entrega na hora.

### 4.3 T, Taxa: custo, velocidade e condição contra o preço de mercado da função

| Nota | Quando |
|---|---|
| 0 | Muito cara para o que faz, ou precisa de preparo que a lista não tem |
| 1 | Acima do padrão da função, ou de feitiço quando a função pede instantânea, ou com condição relevante |
| 2 | No padrão da função |
| 3 | Abaixo do padrão: mais barata, mais rápida ou sem condição |

**Padrões de bolso, para calibrar no piloto:**

| Função | Nota 3 | Nota 2 | Nota 1 |
|---|---|---|---|
| Remoção pontual | 1 a 2 manas, instantânea | 3 instantânea, ou 2 de feitiço | 4 ou mais, ou condicional |
| Limpeza de mesa | 3 a 4 manas, ou unilateral | 5 | 6 ou mais |
| Pedra de mana | 1 a 2 manas | 3 | 4 ou mais |
| Busca de terreno | 2 manas | 3 | 4 ou mais |
| Compra recorrente | 3 manas ou menos, sem condição | 4 | 5 ou mais, ou condicional |
| Proteção do comandante | 1 a 2 manas, instantânea ou permanente | 3 | 4 ou mais |

Custo alto que, na prática, se paga com menos (redução, custo alternativo) entra pelo custo real. É o mesmo princípio da marca `caro_por_desenho` do `/novo-deck`.

### 4.4 Q, Quadrantes: em quantos momentos do jogo ela está viva?

São os quatro quadrantes da EDHREC: **desenvolvimento** (início, montando mana e peças), **paridade** (mesa equilibrada), **atrás** (alguém vai ganhar se nada mudar) e **na frente** (você vai ganhar se nada mudar).

| Nota | Viva em |
|---|---|
| 0 | Um quadrante só. Quando é só "na frente", é win-more e ativa a trava |
| 1 | Dois |
| 2 | Três |
| 3 | Os quatro |

"Viva" quer dizer que faz o papel dela numa mão média deste deck, pelo princípio do piso.

### 4.5 R, Reposição: a que distância está o melhor substituto?

Duas comparações juntas: **por fora**, contra a melhor carta na identidade de cor, sem teto de preço; **por dentro**, contra a cota do papel e as outras cartas da lista que fazem o mesmo.

| Nota | Quando |
|---|---|
| 0 | Existe carta claramente melhor, **com nome**, para o mesmo papel; ou o papel passou da cota e esta é a pior cópia |
| 1 | Há equivalente fora, ou par dentro da lista, por custo e timing parecidos |
| 2 | Os substitutos existem, mas perdem algo claro (custo, timing, encaixe) e a carta está dentro da cota |
| 3 | Não há substituto realista: tirá-la muda o plano ou abre um buraco que a lista não cobre |

**Saturação:** um papel abaixo da cota sobe a R das cartas dele em um nível (até 3); acima da cota, desce. Isso corrige o viés do peso temático contra remoção genérica quando falta remoção no deck.

---

## 5. As travas

As travas mandam mais que a média. Cada uma fecha um teto e é registrada no motivo.

| Trava | Quando | Teto |
|---|---|---|
| **Antissinergia estrutural** | Desliga o comandante, o motor ou uma parte essencial do plano, de forma recorrente | D |
| **Antissinergia material** | Desliga algumas linhas, mas o ganho pode compensar. Exige a conta escrita: quantas cartas e linhas, com que frequência, e se o ganho supera | B |
| **Win-more** | Só viva "na frente" | C |
| **Dependência ausente** | Só funciona com uma peça que não está na lista nem é buscável | C |
| **Dependência dupla** | Precisa de duas condições ou mais para fazer o papel | B |
| **Substituto nomeado melhor** | R = 0 por carta de fora melhor | C |

A escala de antissinergia (nenhuma, leve, material, estrutural) e a pergunta "o ganho líquido supera a perda?" vêm do TIER MASTER. A Necrodominance no Vito é o caso-modelo: a antissinergia é real, mas precisa ser contada, não presumida.

---

## 6. Do índice à letra

### 6.1 Os pesos por grupo

O índice é a média ponderada das cinco lentes, de 0 a 3. O peso diz o que o grupo valoriza.

| Grupo do deck | Perfil | E | I | T | Q | R | Por quê |
|---|---|---|---|---|---|---|---|
| 01. TOP | Potência | 15% | 25% | 25% | 20% | 15% | A eficiência e a confiabilidade decidem; o tema é meio, não fim |
| 02. TRIBAIS | Misto | 25% | 20% | 20% | 15% | 20% | A tribo é o plano, mas precisa ter eficiência |
| 03. CAOS | Temático | 30% | 20% | 15% | 15% | 20% | A graça é o tema; eficiência é secundária (confirmado pelo dono) |
| 04. FORFUN | Temático | 30% | 20% | 15% | 15% | 20% | Diversão e identidade primeiro |
| 05. DESEJO | Herda | | | | | | Usa o perfil do grupo onde o deck vai morar; sem destino definido, o misto |

### 6.2 Exemplo de como o peso muda a ordem

Duas cartas hipotéticas, as mesmas da conversa:

| Lente | Lorde da tribo, 4 manas | Remoção instantânea genérica, 1 mana |
|---|---|---|
| E | 3 | 0 |
| I | 2 | 2 |
| T | 1 | 3 |
| Q | 1 | 3 |
| R | 2 | 1 |
| Índice no Top (potência) | 1,70 → B | 2,00 → B, na frente |
| Índice nos Tribais (misto) | 1,90 → B, na frente | 1,65 → B |
| Índice no Caos e no Forfun (temático) | 2,00 → B | 1,50 → C |

Se o deck estiver abaixo da cota de remoção, a saturação sobe a R da remoção para 2. No temático, o índice dela vai para 1,70 e ela volta a B. É assim que o método protege a infraestrutura sem regra especial.

### 6.3 Os cortes

| Letra | Como se chega lá |
|---|---|
| **S** | Só pelo portão da seção 6.4. Nunca pelo índice sozinho |
| **A** | Índice de 2,20 ou mais |
| **B** | De 1,60 a 2,19 |
| **C** | De 1,00 a 1,59, ou teto C por trava |
| **D** | Abaixo de 1,00, ou antissinergia estrutural |

A trava vence o índice: carta com índice 2,5 e win-more fica em C. Os limites foram aceitos pelo dono como ponto de partida. Se o piloto pedir ajuste, muda a versão do arquivo de pesos, nunca em silêncio.

### 6.4 O portão do S

O dono pediu que o S exija mais argumentos. São sete condições, **todas obrigatórias**:

1. **E = 3:** é verbo da conta.
2. **Sem par na lista:** nenhuma outra carta do deck faz o mesmo trabalho por custo e timing parecidos.
3. **R de pelo menos 2:** o melhor substituto de fora, com nome, perde algo claro.
4. **I de pelo menos 2, Q de pelo menos 2 e T de pelo menos 1:** tem impacto, está viva na maior parte dos jogos e não é cara demais.
5. **Nenhuma trava**, e antissinergia no máximo leve.
6. **Índice de pelo menos 2,40** pelos pesos do grupo.
7. **Três argumentos escritos:**
   - (a) o que muda na conta do deck sem ela;
   - (b) por que o substituto nomeado não cobre;
   - (c) em quais momentos do jogo ela atua.

   Quando o simulador do projeto mede o plano do deck, vale também o **teste da ausência**: rodar sem a carta, com o substituto no lugar, e mostrar quanto piora a medida (por exemplo, o turno em que o plano fica montado).

Falhou em qualquer item, a carta é **A**, com o motivo: "A, não S, por falta de: ...".

**O caso do Skullclamp no Krenko**, que o dono contestou: é o melhor caso de teste do piloto. Pelo texto (custo {1}, +1/-1 na criatura equipada, compra duas cartas quando ela morre, equipar {1}), uma ficha 1/1 equipada vira duas cartas. É candidato a E = 3, como conversor. Mas o portão pergunta mais:
- Há outro conversor de horda em cartas na lista? Se houver, falha no item 2.
- Ele está vivo quando você está atrás e sem mesa? Isso decide o item 4.
- O substituto mais próximo perde muito? Isso decide o item 3.

O dono apostou que ele não passa. O método não decide pelo palpite de nenhum dos dois: decide no piloto, com a lista atual do Krenko.

### 6.5 O comandante

O comandante **fica fora da tier list** (decisão do dono). Ele é a régua contra a qual todas as outras são medidas, e nunca entra no corte.

---

## 7. Desempate dentro da mesma letra

Duas cartas na mesma letra e no mesmo papel, em ordem:

1. A de piso mais alto (Q, depois I).
2. A mais barata.
3. A buscável pelo comandante ou por tutores da lista.
4. A que cumpre um segundo papel que a lista realmente usa.

A ordem dentro da faixa é desempate, não ranking fino.

---

## 8. Campos que não são nota

| Campo | Valores | Para que serve |
|---|---|---|
| Papel | Os sete da seção 3 | Comparar dentro do papel e ver onde o deck está raso. É a lente gerar contra converter, carta a carta |
| Substituto | Nome da carta, ou "nenhum realista" | Obrigatório em C e D, e no portão do S |
| Antissinergia | Nenhuma, leve, material ou estrutural | Alimenta as travas |
| Confiança | Alta, média ou baixa, com o motivo | Baixa: falta texto conferido, falta a lista atual, ou a carta depende do meta |
| Estado | Projetada ou testada | A letra é projeção até haver partidas (handover V4) |
| Pet | Marca do dono | Não muda a letra. Só tira do corte |
| Tier anterior | A letra antiga | Histórico, para comparar o antes e o depois na migração |
| Relevância | INS, ALT, MÉD, BAX | Fica como está hoje (decisão do dono): é a permanência, separada da letra, e não muda o índice. Combinação estranha pede revisão: S com BAX, ou D com INS sem pet nem papel abaixo da cota |

**Revisão do dono:** toda carta S, toda carta D, todo pet em C ou D, e as cinco avaliações de confiança mais baixa. É a regra que o `AVALIACAO.md` já tem, com os pets acrescentados.

---

## 9. Pets

Decisão do dono, 09/11/2026:

- A letra é **honesta**: um pet pode sair naturalmente S ou D pelos critérios, e o dono quer ver isso, seja para valorizar a carta, seja para repensar.
- O pet **nunca entra na fila de corte** e nunca é sugerido como saída de troca.
- O motivo de ser pet é do dono e pode ser qualquer um: desenho, assinatura, raridade, preço, nome ou outro. Não se deduz pet por acabamento. Pet é a marca que o dono põe.
- Duas leituras por deck, uma linha cada no painel:
  - **Valor de estimação:** quantos pets estão em S ou A. O carinho está bem empregado.
  - **Custo de estimação:** quantos pets estão em C ou D, e qual papel eles travam. É custo de oportunidade explícito, não escondido, como as Mountains foil dos vermelhos.

---

## 10. Fila de corte

1. D com antissinergia estrutural.
2. Os outros D, do menor índice para o maior.
3. C com substituto nomeado.
4. Os outros C, do menor índice para o maior.
5. B de papel acima da cota, a pior cópia primeiro.

Nunca entram na fila: o comandante, os pets e as cartas de papel abaixo da cota. Terreno sai só por terreno, olhando a contagem de fontes, como já é a regra.

**Troca:** uma carta nova só entra se a letra e o índice dela, **neste deck**, forem maiores que os da carta que sai. A diferença tem que ser material, não de centésimos.

---

## 11. Terrenos

Os terrenos passam pelas mesmas lentes, com leitura própria:
- **E:** a cor que a curva gasta, ou um utilitário que é verbo da conta.
- **T:** entra desvirado na hora em que a mágica precisa.
- **R:** comparado com as melhores fontes daquelas cores.

Terreno de mana quase nunca é S. Só chega lá se a função extra for verbo da conta e não tiver par. O básico desvirado da cor certa, dentro da cota de fontes, pode ser A. (Leitura alinhada ao documento do GROK.)

---

## 12. Teste de sanidade, não cota

Não existe cota de letras. Mas, se o resultado sair assim, é sinal de régua frouxa ou de deck mal montado:

| Faixa | O que se espera | Se não bater |
|---|---|---|
| S | Um punhado, cada uma com os três argumentos | Revise o item 2 do portão: provavelmente há par |
| A | As melhores de cada papel, dentro da cota | Muito A de teto estreito: o piso (Q) foi ignorado |
| B | A fila real de upgrade | Lista sem B: a avaliação foi generosa, ou o deck está maduro. Diga qual dos dois |
| C | De onde saem os slots | Lista sem C não tem o que trocar |
| D | Poucas | Muitas D: a lista não segue o plano declarado, e o problema é de construção, não da régua |

Se falhar, refaça as lentes. Nunca ajuste a letra no olho.

---

## 13. Passo a passo para quem avalia (humano, Claude Code ou outra IA)

1. Leia o comandante com o texto oficial (cache ou Scryfall) e escreva a conta, os papéis e as cotas (seção 3).
2. Conte as cartas por papel contra as cotas. Anote os papéis abaixo e acima.
3. Para cada carta, inclusive os terrenos (o comandante fica fora): papel, cinco lentes com uma frase cada, antissinergia, substituto e confiança.
4. Aplique as travas.
5. Calcule o índice com os pesos do grupo e converta em letra.
6. Passe as candidatas a S pelo portão. Escreva os três argumentos; rode o teste da ausência quando houver simulador.
7. Rode o teste de sanidade da seção 12.
8. Monte a fila de corte da seção 10.
9. Mostre ao dono os itens da revisão (seção 8) antes de gravar.

**Modelo:** aplicar a tier list a um deck inteiro é tarefa de Fable, pela tabela "Aviso de troca" do `contexto/MODELOS.md`. Auditar a tier que outro modelo deu é tarefa para quem não fez a avaliação.

---

## 14. Calibração com cartas que o projeto já conhece

É ilustrativa: as letras finais saem do piloto, com a lista atual de cada deck e o texto conferido.

| Carta (deck) | Letra antiga | Provável no método | O que decide |
|---|---|---|---|
| Sol Ring (qualquer deck) | S, ou A pela regra tribal | A | E = 1: é infraestrutura de elite, mas não define a conta. Sai A pela definição, não por regra de tribo |
| Toxic Deluge (Clavileño) | S | A | Melhor no que faz, mas E baixo e com substitutos de nome. Não passa no item 1 do portão |
| Thassa, Deep-Dwelling (Zara) | S | S, se passar no portão | É o conversor do empréstimo em roubo, sem par. O TIER MASTER também chega a S |
| Thornbite Staff (Krenko) | S | S, se passar no portão | Peça do combo com o Goblin Bombardment da lista. Precisa da linha conferida e do teste da ausência |
| Skullclamp (Krenko) | A, pela regra tribal | A ou S | Caso de teste da seção 6.4 |
| Spear Spewer (Strefan) | S | A ou S | O TIER MASTER tira o S em parte por ser Goblin. Aqui o tipo não pesa: decide se há outro habilitador de perda de vida para a mesa toda |
| Universal Automaton (Lathliss) | B | B | Dispara a comandante (changeling), mas há outros changelings; impacto baixo |
| Lithoform Engine (Clavileño) | C | C | Win-more: teto C |
| Necrodominance (Vito) | C | B ou C | Antissinergia material: depende da conta das cartas desligadas, que ainda não foi refeita |
| Out of Time (Zur) | D | D (o TIER MASTER diz C) | Divergência aberta, abaixo |
| Rest in Peace (Ezio, pet) | n/d | D, pet | Desliga cartas de cemitério da lista; fica fora do corte e entra no custo de estimação |

**Antissinergia temporária (o Out of Time):** o TIER MASTER dá C, porque a carta também segura a mesa adversária. Eu dou D: o motor do Zur é atacar e buscar, e uma carta que tira o próprio Zur de fase enquanto estiver em campo desliga o motor. **Decisão do dono:** é caso a caso. Na falta de decisão pontual, vale esta recomendação: antissinergia que desliga o comandante ou o motor, mesmo por tempo limitado, conta como estrutural. O dono pode rever carta a carta quando repassar cada deck.

---

## 15. Como este método conversa com os outros arquivos da pasta

Os quatro documentos que já estavam na pasta foram lidos como opinião, não como regra (regra 4 do `CLAUDE.md`).

| Documento | O que adotei | O que recusei, e por quê |
|---|---|---|
| **TIER_MASTER 1.0 + Calibração + Adendo** | O portão do S com várias condições; a escala de antissinergia; contar a antissinergia em vez de presumir; o substituto comparado na ficha; a confiança; a ideia de que a tier não vira a nota do deck | **Escala de 0 a 4 e 0 a 100:** o projeto usa 0 a 3 em tudo, e os centésimos sugerem uma precisão que não existe. **Critério de identidade com 10%:** pune a carta de fora da tribo (o Spear Spewer perde o S em parte por ser Goblin), e é a regra tribal voltando pela porta dos fundos, que o dono retirou. **Critérios sobrepostos:** "contribuição marginal" e "dificuldade de substituição", que o próprio texto admite serem próximos, viram uma lente só, a R. **"Não recalcular retroativamente":** o dono quer aplicar em todos os decks, e a decisão é dele |
| **Critérios GROK** | Cota por papel (virou a saturação da lente R); "piso, não teto"; teste de sanidade; letra pela combinação, nunca no olho; terrenos na mesma escada | **Três eixos são poucos:** taxa (T) e impacto (I) ficam misturados no "piso", e a eficiência some como critério próprio. **A letra pela primeira regra que fecha** é elegante, mas não tem pesos, e o dono escolheu pesos por grupo |
| **M.I.A. (metodologia_de_avaliacao.md)** | Os papéis (habilitador, recompensa, multiplicador, fundação) inspiraram a tabela de papéis; o custo de oportunidade do pet | **Staple genérica cai em B por definição:** contradiz a decisão do Sol Ring em A, e a infraestrutura de elite não é "sob observação". **Erro de fato:** o exemplo diz que o Skirk Prospector gera "mana infinita". Pelo texto do cache ("Sacrifice a Goblin: Add {R}."), ele gera uma mana por Goblin sacrificado, que é finita. Isso pede cautela com o resto do documento |

---

## 16. O que muda no projeto quando houver veredito

É a proposta de implementação, para o Claude Code mostrar como plano antes de mexer (regra 9):

1. **Feito em 09/11/2026:** a regra "Tier S em deck tribal" saiu do `contexto/AVALIACAO.md` e do `/novo-deck`. As 87 cartas que ela rebaixou em 15 decks (registro no `ESTADO.md`) seguem como estão até a migração, porque o método novo reclassifica tudo.
2. **Dados:** no `avaliacao.json`, cada carta ganha `lentes` (E, I, T, Q, R), `papel`, `antissinergia`, `travas`, `substituto`, `confianca`, `argumentos_s` (só no S) e `tier_anterior`. Os valores de `tier` continuam S, A, B, C, D: o painel e o hub não mudam de vocabulário.
3. **Pesos e limites** em arquivo próprio (por exemplo, `contexto/pontuacao/tier.json`), por grupo, com versão. Mudou um peso, muda a versão, nunca em silêncio.
4. **Motor:** calcula o índice e a letra a partir das lentes e das travas, e confere o portão do S. O teste `contrato.py` recusa carta S sem os três argumentos, carta C ou D sem substituto ou motivo, e pet na fila de corte.
5. **Relevância (INS, ALT, MÉD, BAX):** fica como está. Nenhum campo novo; só a checagem das combinações estranhas da seção 8.
6. **Ordem:** piloto num deck (sugestão: Krenko, que já tem simulador e o caso do Skullclamp); revisão do dono; ajuste dos limites; depois lotes de cinco decks com o "pode" do dono, como foi o `/plano todos`.

---

## 17. Decisões

**Já tomadas pelo dono (09/11/2026):**
- Cinco tiers, sem subníveis.
- Nenhuma regra de tipo ou tribo no S; o S exige argumentos.
- Pets com letra honesta, fora do corte, por qualquer motivo que o dono escolher.
- Pesos por grupo.
- Aviso de troca de modelo no Claude Code (`CLAUDE.md` e `contexto/MODELOS.md`).

**Abertas para o veredito:**
1. Os perfis de peso da seção 6.1, principalmente o do 03. CAOS.
2. Os limites do índice (2,20, 1,60, 1,00) e o mínimo de 2,40 no portão do S.
3. A relevância: manter como campo separado, derivar da lente R (minha recomendação, que acaba com o chute duplo), ou eliminar e deixar só o pet como "fora do corte". O TIER MASTER propõe mantê-la como prioridade operacional, sem nota.
4. A antissinergia temporária (Out of Time) conta como estrutural?
5. O comandante fica fora da tier list, ou aparece como "Comandante"?

---

## Fontes

- EDHREC: [From Synergy to Lift](https://edhrec.com/articles/from-synergy-to-lift-the-math-behind-edhrecs-new-era). O lift mede presença acima do acaso em decks enviados por usuários: é sinal para achar candidatas, nunca a letra.
- EDHREC: [Guide to Quadrant Theory](https://edhrec.com/guides/the-edhrec-guide-to-quadrant-theory-in-commander). Os quatro quadrantes da lente Q.
- CoolStuffInc: [Commander Theory: Three Rules for Card Evaluation and Inclusion](https://www.coolstuffinc.com/a/commander-theory-three-rules-for-card-evaluation-and-inclusion). "A melhor no que faz" (lente R) e "impacto pesado" (lente I).
- The Mana Base: [The Last 10 Cuts](https://themanabase.com/the-metaworker-the-last-10-cuts/). A declaração de missão do deck antes de cortar (a conta, seção 3) e o cuidado com o topo da curva.
- Arquivos do projeto: `contexto/AVALIACAO.md`, `contexto/pontuacao/RUBRICA.md`, `contexto/MODELOS.md` e o cache de cartas v2.3 (textos do Skullclamp e do Skirk Prospector).
- Outros arquivos desta pasta: `TIER_MASTER_1.0.md`, `TIER_MASTER_CALIBRACAO_1.0.md`, `ADENDO_INTEGRACAO_HANDOVERS_TIER_MASTER_1.0.md`, `Tier list de cartas — critérios GROK.md` e `metodologia_de_avaliacao.md`.
