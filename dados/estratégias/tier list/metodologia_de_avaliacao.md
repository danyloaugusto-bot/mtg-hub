# A Matriz Integrada de Avaliação (M.I.A.) para Commander
**Documento de Metodologia e Inteligência de Deckbuilding**

A classificação clássica de "Tier S a D" foi herdada de jogos de luta e card games competitivos 1v1. No vácuo, ela mede apenas a "força bruta" ou a "eficiência de mana" de uma carta. No Commander, especialmente em decks sinérgicos e temáticos, essa régua é falha. Uma staple genérica de $50 pode afogar o seu motor, enquanto um comum de $0.25 pode ser a engrenagem que faz o deck vencer.

Para resolver isso, desenvolvemos a **Matriz Integrada de Avaliação (M.I.A.)**. Ela abandona o julgamento superficial e avalia cada carta com base em uma equação tridimensional:

> **[ TIER FINAL ] = Função Mecânica (E.P.E.) + Grau de Sinergia + Ação de Deckbuilding**

Abaixo, detalhamos a inteligência por trás de cada um desses três pilares passo a passo.

---

## Passo 1: Definir a Função Mecânica (O Sistema E.P.E.)
Antes de saber se uma carta é boa, precisamos saber o que ela está tentando fazer. Dividimos o deck em quatro funções estruturais. Um deck otimizado precisa de uma proporção saudável entre elas.

1. **Enablers (Viabilizadores):** A graxa da engrenagem. Cartas de baixo custo que iniciam o plano de jogo, geram recursos específicos ou preparam o campo. Sem eles, o comandante não funciona. *(Ex: Motores de sacrifício, geradores de tokens de baixo custo).*
2. **Payoffs (Recompensas):** Os finalizadores e geradores de valor massivo. Cartas que exigem que o motor esteja rodando, mas que ganham o jogo ou viram a mesa quando resolvem. *(Ex: Cartas que causam dano ao entrar criaturas, feitiços de turnos extras em decks de cópia).*
3. **Enhancers (Multiplicadores):** Cartas que não fazem nada sozinhas, mas escalam absurdamente o que o deck já faz. *(Ex: Duplicadores de gatilhos, dobradores de fichas ou de dano).*
4. **Fundação (Os Vegetais):** Infraestrutura básica do jogo. Ramp, compra de cartas e remoção que não interagem necessariamente com o tema, mas são necessárias para sobreviver. 

---

## Passo 2: Medir o Grau de Sinergia (A Regra Anti-Staple)
É aqui que a inteligência da matriz brilha. Nós penalizamos cartas genéricas (Staples) que não conversam com o Comandante e recompensamos peças perfeitamente encaixadas no tema.

* **Sinergia Simbiótica:** A carta foi praticamente desenhada para o comandante. O teto máximo de poder dessa carta só é alcançado neste deck específico.
* **Sinergia Alta:** A carta alimenta a tribo, a mecânica central ou resolve um gargalo específico da estratégia de forma brilhante.
* **Sinergia Genérica / Neutra:** A carta é inegavelmente forte, mas faria exatamente a mesma coisa em qualquer outro deck das mesmas cores. *(Aqui entram os Cyclonic Rifts, Rhystic Studies e Smothering Tithes, caso não haja ligação direta com o tema).*
* **Antissinergia (Ruído):** A carta atrapalha ativamente o seu próprio plano de jogo, desliga peças importantes ou compete de forma ineficiente pelo mesmo recurso.

---

## Passo 3: Determinar a Ação de Deckbuilding
Uma Tier List não serve para nada se não disser o que fazer com a carta. Cada nível exige uma atitude do deckbuilder na hora de revisar a lista.

* **Intocável:** O slot está cravado. Não se discute corte.
* **Consolidado:** Fica no deck, a menos que surja uma carta estritamente melhor no futuro.
* **Sob Observação:** Cumpre o papel, mas não empolga. Fica no deck para manter a curva de mana ou a contagem de interações, mas é a primeira zona onde buscaremos *upgrades* temáticos.
* **Fila de Corte (Hot Seat):** A carta está ativamente sendo questionada. Se houver uma opção mais barata, mais rápida ou mais sinérgica, o corte acontece imediatamente.
* **Corte Imediato:** A carta precisa sair para a saúde do deck.

---

## O Resultado: A Classificação Final (Tier S ao D)
Cruzando as três dimensões acima, chegamos à nossa classificação final para as análises de handover:

### 🏆 TIER S: Motor Vital
* **O que é:** O coração do deck. 
* **Critérios:** Deve ser um *Enabler* crítico ou *Payoff* primário + Sinergia Simbiótica.
* **Ação:** Intocável.
* **Exemplo Prático:** *Skirk Prospector* no deck do Krenko, Mob Boss. (Ele é um goblin, custa 1, e permite sacrificar a horda para gerar mana infinita e recomeçar o motor).

### 🥇 TIER A: Titular Temático
* **O que é:** As cartas que definem o poder e a consistência da estratégia.
* **Critérios:** *Enhancer* ou *Payoff* + Sinergia Alta com o tema.
* **Ação:** Consolidado.
* **Exemplo Prático:** *Terror of the Peaks* no deck da Lathliss. (Sinergia massiva ao transformar a entrada dos dragões em controle de mesa e dano direto letal).

### 🥈 TIER B: Fundação Funcional
* **O que é:** O cimento que mantém os tijolos unidos. As "Staples" caem aqui.
* **Critérios:** *Fundação* (Ramp, Draw, Remoção) + Sinergia Genérica/Neutra. O card é forte, resolve problemas, mas não é a estrela.
* **Ação:** Sob Observação (Buscamos sempre substituir Tier B genéricos por Tier A ou S temáticos).
* **Exemplo Prático:** *Rhystic Study* no deck da Zara, Renegade Recruiter. (Comprar cartas é essencial, mas não há nenhuma sinergia específica de roubo ou piratas aqui. É eficiente, mas genérico).

### 🥉 TIER C: Substituível / Ineficiente
* **O que é:** Cartas que ocupam espaço valioso com baixo retorno estrutural.
* **Critérios:** Qualquer E.P.E. + Custo de mana alto demais + Sinergia Baixa.
* **Ação:** Fila de Corte (Hot Seat).
* **Exemplo Prático:** *Commander's Sphere* em decks de custo baixo que exigem agressividade. Custa muito caro pelo ramp que oferece, travando o desenvolvimento do *early game*.

### ❌ TIER D: Ruído e Antissinergia
* **O que é:** Armadilhas disfarçadas de cartas boas.
* **Critérios:** *Win-more* (só é boa se você já está ganhando) OU possui Sinergia Negativa com o comandante.
* **Ação:** Corte Imediato.
* **Exemplo Prático:** *Out of Time* no deck do Zur the Enchanter. (É um encantamento de 3 manas que o Zur pode tutorar para limpar a mesa, mas ele tira o próprio Zur de fase, travando o seu comandante).

---

## Tratamento de Pet Cards e Cartas Protegidas
* **Análise Clínica:** Na hora de gerar o relatório e ranquear as cartas, *Pet Cards* (etched, foils, artes alternativas, presentes) serão avaliados de forma **completamente fria e mecânica**. Se uma carta foil de estimação travar sua mão, ela receberá **Tier C ou D**.
* **Decisão do Jogador:** O relatório apontará o "custo de oportunidade" de manter o *Pet Card* (ex: "Manter esta carta custa a vaga de um viabilizador de turno 2"). O corte final será sempre ignorado pelo analista se a restrição de mantê-lo for imposta pelo dono do deck, mas o diagnóstico técnico não será maquiado.