# HANDOVER ESPECÍFICO — VITO, THORN OF THE DUSK ROSE
**Projeto:** Mono-Black Vampire Tribal · Lifegain/Lifedrain · combo como contingência  
**Versão:** Current preservada + V2 projetada · **Verificação:** 9 de outubro de 2026  
**Framework:** Handover Master v3.0

> Este documento registra a memória operacional do deck. O Dashboard Excel é a fonte principal da auditoria carta a carta; este Handover guarda intenção, decisões, trade-offs e interações que não podem se perder em uma nova conversa.

---

## 1. Identidade e intenção do usuário

**Formulação do deck:** *Mono-Black Vampire Tribal com lifegain/lifedrain e pressão política; Vito converte cada evento de ganho de vida em perda de vida direcionada, enquanto os Vampiros entregam drenagem recorrente, value e presença de mesa. Os combos são linhas conhecidas e fortes, mantidas como contingência, não como plano padrão para toda partida.*

Esse é o primeiro deck do usuário e seu favorito. A otimização deve respeitar tanto a experiência pessoal quanto a potência. O objetivo não é transformar a lista em um deck genérico de tutors + combo. As melhorias precisam fortalecer o deck que já existe: Vampiros monoblack, ganho/perda de vida, agressividade no início e pressão sobre o líder no meio/fim de jogo.

A mesa reconhece o Vito como ameaça de combo. A pilotagem deve administrar essa reputação: construir pressão justa, demonstrar força, escolher o oponente mais relevante para drenagem pontual e buscar aliados quando a situação política permitir. Tutor não precisa significar buscar o combo; pode encontrar remoção, draw ou uma engine defensiva.

### PET LOCKS — não cortar
- **Hatred:** finalizador surpresa de combate. Avaliar janela, vida restante e respostas, nunca sugerir OUT.
- **Exsanguinate:** PET CARD e finalizador escalável. Uma cópia preparada de Exsanguinate (por ex. via Stensian Sanguinist) é adicional, não substituição.
- **New Blood:** roubo + conversão para Vampire; tem valor tribal e político, não somente função de remoção.

As três são restrições explícitas de construção e devem permanecer em Current, V2 e em versões futuras.

---

## 2. Comandante — Vito, Thorn of the Dusk Rose

**MV 3 · Legendary Creature — Vampire Cleric · 1/3 · mono-black.**

Texto funcional: sempre que você ganha vida, o Vito faz um oponente-alvo perder a mesma quantidade de vida. Sua habilidade de {3}{B}{B} concede lifelink às criaturas que você controla até o fim do turno.

### O que significa para a construção
- Vito é motor/payoff, não precisa atacar para disparar a habilidade principal.
- O deck precisa conseguir executar um jogo decente sem Vito na mesa: Creeping Bloodsucker, Marauding Blight-Priest, Enduring Tenacity, Gray Merchant of Asphodel, Malakir Bloodwitch, Bloodletter of Aclazotz, Meathook Massacre e Exsanguinate mantêm a pressão.
- Vito chama remoção. Proteção e redundância são valiosas, mas proteger o comandante a qualquer custo pode ser menos importante que desenvolver um motor de valor quando ele custa muito por commander tax.
- Vito causa **perda de vida**, não dano. Isso importa para regras que exigem dano e para lifelink: a habilidade do Vito não causa dano nem ganha vida por si só.
- Um evento de ganho de vida relevante pode disparar Vito; isso não significa que cada oponente que perdeu vida em um mesmo efeito provoque um trigger separado do Vito.

---

## 3. Métricas reconciliadas

| Métrica | Current | V2 projetada |
|---|---:|---:|
| Total de cartas incluindo comandante | 100 | 100 |
| Comandante | 1 | 1 |
| Maindeck | 99 | 99 |
| Terrenos físicos | 31 | 31 |
| MDFCs alocadas à mana | 3 | 3 |
| Slots atribuídos à mana | 34 | 34 |
| Mágicas funcionais | 65 | 65 |
| Criaturas nos 99 | 26 | 27 |
| Cartas Vampire incluindo Vito | 22 | 23 |
| MV médio das mágicas funcionais (X=0) | 3,22 | 3,15 |
| Nota estimada | 8,3/10 | 9,0/10 projetada |

**Convenção de contagem:** Agadeem's Awakening, Hagra Mauling e Malakir Rebirth contam como cartas com função de terreno no pacote de mana e não são contadas duas vezes. A média de MV considera as 65 mágicas funcionais, usa X=0 e exclui terrenos, MDFCs e comandante; é uma métrica comparativa, não previsão exata da curva real de jogo.

**Current:** lista submetida pelo usuário, sem mudanças silenciosas.  
**V2:** quatro trocas propostas, ainda sem playtest.  
**Tested:** nenhuma conclusão da V2 está validada por partidas registradas.

O modelo 8×8 do Handover Master recomenda como referência 35 slots de mana + 64 slots funcionais + comandante. Não é lei rígida. A configuração atual (34 mana allocations + 65 mágicas) é preservada na V2. Não cortar Damnation ou uma função vital apenas para forçar a conta. O teste deve olhar keepable hands, mulligans e land drops para confirmar se a base é suficiente.

---

## 4. Diagnóstico executivo — Current

### Forças
1. **Acesso a cartas:** Demonic Tutor, Vampiric Tutor, Beseech the Mirror, Insatiable Avarice, Black Market Connections, Necropotence, Necrodominance e Bolas's Citadel formam uma base forte de seleção/compra.
2. **Explosão de mana:** Sol Ring, Ancient Tomb, Dark Ritual, Crypt Ghast, K'rrik, Jet Medallion, Bontu's Monument, Cabal Coffers, Urborg e Nykthos criam turnos acima da curva.
3. **Múltiplas camadas de drenagem:** Vito, Creeping Bloodsucker, Marauding Blight-Priest, Enduring Tenacity, Bloodletter of Aclazotz, Gray Merchant, Malakir Bloodwitch, Vein Ripper e The Meathook Massacre.
4. **Várias linhas de combo:** a lista não depende de uma única combinação, então pode punir mesas que ignoram a ameaça.
5. **Plano justo de vitória:** Exsanguinate, Torment of Hailfire, Gray Merchant, Malakir Bloodwitch, Bloodletter of Aclazotz, Blood Tribute e lifelink em massa com Vito fecham jogos sem exigir loop infinito.
6. **Interação de mono-black sólida:** Deadly Rollick, Slaughter Pact, Feed the Swarm, Withering Torment, Consuming Corruption, Hagra Mauling, Toxic Deluge, Damnation e Blasphemous Edict cobrem ameaças distintas.

### Gargalos reais
- **Topo da curva congestionado:** Defiant Bloodlord é um Vampire coerente, mas sete manas para redundância parecida com Vito é alto; Morlun oferece uma forma escalável de converter mana excedente em impacto imediato.
- **Vida como recurso disputado:** Black Market Connections, Necropotence, Necrodominance, Bolas's Citadel, Ancient Tomb, K'rrik, Hatred e tutores podem gastar a vida que o deck está tentando gerir. É importante reconhecer os turnos em que não dá para maximizar todas as opções.
- **Anti-sinergia com Necrodominance:** muito forte para repor recursos, mas a substituição de cemitério por exílio impede que cartas/fichas cheguem ao cemitério enquanto estiver ativa. Isso desliga vários triggers de morte, incluindo Blood Artist, The Meathook Massacre e Vein Ripper. É uma questão de sequencing, não uma recomendação automática de corte.
- **Tutors elevam a percepção de ameaça:** a eficiência é real, mas uma linha visível de tutor + peça de combo pode unir a mesa contra você. O uso estratégico do tutor faz parte do deckbuilding e da pilotagem.
- **Base de mana precisa de evidência prática:** 34 slots atribuídos a terrenos/MDFCs coexistem com vários motores poderosos, mas não se deve presumir que o ramp compensa sempre mãos com poucas fontes iniciais.

---

## 5. Linha de jogo pretendida

### Early game — turnos 1–3
Prioridades: (1) mão funcional e mana; (2) ramp que permita adiantar Vito ou uma engine; (3) Vampire barato com lifelink/drain ou motor de cartas; (4) não se expor a remoção sem plano para continuar.

Uma mão inicial boa não precisa conter uma peça do combo. Prefira avaliar fonte de mana + ação inicial + continuidade. Vito cedo é desejável, mas baixar o comandante sem payoff nem proteção pode ser pior do que estabelecer uma engine que continue funcionando se ele for removido.

### Midgame — turnos 4–7
- Colocar engines repetíveis e estabilizar a própria vida.
- Drenar toda a mesa com payoffs de grupo e escolher o oponente certo para a perda adicional de Vito.
- Priorizar a ameaça real do líder da mesa; remover o maior corpo não é sempre a melhor decisão.
- Usar New Blood como swing político/tribal se houver um alvo valioso, mantendo em mente o custo adicional de virar um Vampire desvirado.
- Guardar interação para a peça que pode ganhar, não gastar tudo em um valor marginal.
- Se tutor for necessário, buscar a peça que mais resolve o estado atual: remoção, draw, proteção, engine ou combo. O objetivo é decidir, não automatizar.

### Late game
- Exsanguinate, Torment of Hailfire, Gray Merchant, Malakir Bloodwitch, Bloodletter, Morlun (na V2) e drenagem repetida são fechamentos justos.
- A ativação de Vito com lifelink em massa pode transformar uma board desenvolvida numa enorme mudança dos totais de vida.
- Hatred continua como ameaça de combate inesperada: contar o pagamento de vida e a possibilidade de resposta adversária.
- Combo fica disponível quando a janela for inevitável ou necessária para a vitória. “Não gosto de ganhar com combo” significa não forçar esse plano toda partida, não que se deva recusar uma vitória clara quando a janela existe.

---

## 6. O pacote de combos: distinguir loop de finisher

### 6.1 Vito + Exquisite Blood
Quando um oponente perde vida, Exquisite Blood faz você ganhar aquela quantidade de vida; Vito então causa perda adicional e Exquisite Blood volta a disparar. Loop conhecido e muito visível. Os adversários que sabem da lista normalmente tentarão remover ou impedir uma das peças.

### 6.2 Vito + Bloodthirsty Conqueror
Uma perda de vida inicial de oponente inicia a sequência: Conqueror ganha vida, Vito causa perda adicional, Conqueror volta a disparar. É ameaça óbvia quando as duas permanentes estão na mesa; a sequência depende de mudança inicial relevante e de as habilidades poderem resolver.

### 6.3 Bloodchief Ascension + Mindcrank
A Ascension precisa estar com três marcadores de missão. Uma perda de vida alimenta Mindcrank; cartas moídas podem disparar Ascension, que faz o oponente perder mais vida e você ganhar vida. Isso realimenta Mindcrank e pode criar loop. Exige preparação dos marcadores e as duas peças em campo; não presumir que ocorre automaticamente ao baixar Ascension.

### 6.4 Exquisite Blood + payoff de drenagem após ganho de vida
Enduring Tenacity, Defiant Bloodlord, Marauding Blight-Priest e Vito podem fornecer o elo que faz oponente perder vida quando você ganha vida. O alcance do dreno depende do texto de cada carta. **Blood Artist sozinho não é um payoff de ganho de vida**, pois seu trigger depende de criaturas morrerem.

### 6.5 Fins potentes sem loop
- **Exsanguinate + Vito:** todos perdem vida; você ganha vida; Vito gera perda extra direcionada a um oponente. Não é infinito.
- **Blood Tribute + Vito:** grande swing de vida contra alvo + ganho de vida + perda adicional de Vito. Não é infinito por si só.
- **Morlun + Vito:** se conjurado com X>0, Morlun causa X de dano de ETB; por lifelink, esse dano faz você ganhar X de vida e dispara Vito. É finisher escalável, não loop.
- **Bloodletter of Aclazotz:** dobra a perda de vida dos oponentes durante o seu turno. Amplificador, não combo sozinho.
- **Bolas's Citadel + Sensei's Divining Top:** motor de topo que pode gerar sequências explosivas, mas não é loop infinito automático sem analisar mana e cartas disponíveis.

---

## 7. Arquitetura de 8 grupos

Cada carta tem **um único grupo primário** para a soma; funções secundárias estão na matriz. 

| Grupo primário | Current | V2 |
|---|---:|---:|
| 1. Ramp | 10 | 10 |
| 2. Draw + Tutor | 10 | 9 |
| 3. Removal | 9 | 9 |
| 4. Combos | 4 | 4 |
| 5. Vampiros (s/ sinergia) | 6 | 5 |
| 6. Vampiros (c/ sinergia) | 16 | 16 |
| 7. Life gain/drain | 7 | 9 |
| 8. Petcards | 3 | 3 |
| **Total funcional** | **65** | **65** |

### 1. Ramp
Sol Ring, Arcane Signet, Dark Ritual, Crypt Ghast, K'rrik, Jet Medallion, Bontu's Monument, Herald's Horn, Extraplanar Lens e Throne of Eldraine.  
Cabal Coffers/Urborg são multiplicadores de mana e Nykthos depende de devoção. Cabal Stronghold conta basic Swamps, não todos os terrenos que viraram Swamps. Extraplanar Lens com Snow-Covered Swamp pode beneficiar oponentes que também jogam Swamps nevados. Throne of Eldraine custa cinco para entrar e a produção de quatro é restrita às mágicas monocolores da cor escolhida; não equivale a quatro manas incondicionais.

### 2. Draw + Tutor
Black Market Connections, Necropotence, Necrodominance, Bolas's Citadel, Sensei's Divining Top, Castle Locthwain, War Room, Mikokoro, Insatiable Avarice, Preacher of the Schism, Sanguine Spy, Twilight Prophet e tutores. A lista tem muito acesso à mão/topo; a pergunta não é simplesmente “precisa de draw?”, mas como desenhar cartas sem perder vida demais, perder a janela política ou desligar triggers de morte com Necrodominance.

### 3. Removal
Deadly Rollick, Slaughter Pact, Feed the Swarm, Withering Torment, Consuming Corruption, Hagra Mauling, Imp's Mischief, Toxic Deluge, Damnation e Blasphemous Edict. As funções não são equivalentes. Damnation permanece por ser reset confiável. Blasphemous Edict tem mana value 8 e é Sorcery; apenas com 13+ criaturas no campo é possível pagar o custo alternativo, e o efeito é simétrico de sacrifício. Não deve ser contado como uma wrath de custo fixo baixo.

### 4. Combos
Inclui as peças que tornam possíveis as linhas acima. O agrupamento conta as cartas no papel primário do pacote, e não todas as cartas secundárias que participam de uma linha. Isto evita duplicação de contagem.

### 5. Vampiros (sem sinergia primária)
Avaliados pelo corpo, custo e impacto mesmo sem Vito. Não são cortes automáticos: criaturas de lifelink/deathtouch podem estabilizar e dar gatilhos. Devem justificar seu espaço frente a Vampiros mais baratos ou com utilidade adicional.

### 6. Vampiros (com sinergia)
Núcleo inclui Blood Artist, Bloodletter of Aclazotz, Bloodline Keeper, Bloodthirsty Conqueror, Captivating Vampire, Creeping Bloodsucker, Marauding Blight-Priest, Markov Baron, Preacher of the Schism, Sorin, Imperious Bloodlord, Vein Ripper e Twilight Prophet. As melhores inclusões fazem compressão de função: Vampire + lifelink/drain, Vampire + draw, lord + tokens, ou criatura + proteção/recuperação.

### 7. Life gain/drain
Distinguir dreno direcionado de Vito, drenagem de mesa, ganhos/ perdas proporcionais (Blood Tribute), devotion payoff (Gray Merchant), efeitos recorrentes e multiplicador durante seu turno (Bloodletter). V2 cresce este pacote porque o plano preferido do usuário é ganhar de forma justa por pressão incremental.

### 8. Petcards
Hatred, Exsanguinate e New Blood. São parte da identidade e permanecem independentemente do resultado do score.

---

## 8. V2: trocas propostas e os trade-offs reais

### A. Defiant Bloodlord → Morlun, Devourer of Spiders
**OUT:** Defiant Bloodlord continua muito coerente com Vampire + lifegain/drain, mas tem MV 7 e a habilidade é parecida com um payoff já coberto por Vito/Enduring Tenacity/Blight-Priest.  
**IN:** Morlun custa {X}{B}{B}, tem lifelink, entra com X marcadores e causa X de dano a um oponente. O dano de ETB ainda faz ganhar X vida graças ao lifelink; Vito transforma essa vida em perda adicional. É um fechamento escalável e justo que converte mana excedente em impacto.  
**Risco:** Morlun consome todo o X que você decidir alocar. Se Sorin, Imperious Bloodlord coloca Morlun no campo em vez de conjurá-lo, X=0; ele não ganha marcadores nem causa dano de ETB.

### B. Grim Tutor → Emeritus of Woe
**OUT:** Grim Tutor é um tutor incondicional excelente de três manas; não é carta fraca e tem vantagem de ritmo.  
**IN:** Emeritus é Vampire 5/4, entra preparado com cópia de Demonic Tutor por {1}{B} e pode se preparar de novo no end step se duas ou mais criaturas morreram naquele turno.  
**Trade-off:** o primeiro tutor normalmente representa 4 manas para a criatura + 2 para a cópia, versus 3 de Grim Tutor. A proposta troca velocidade por corpo tribal, presença de board e eventual repetição. Não é upgrade de custo puro. Usar a cópia para buscar draw/remoção/proteção quando possível, e não somente combo. Se o playtest mostrar falta de tutor rápido, Grim Tutor deve voltar.

### C. Indulgent Aristocrat → Scheming Silvertongue
**OUT:** Indulgent Aristocrat é um Vampire de custo 1 com lifelink, outlet de sacrifício e habilidade que pode colocar marcadores em todos os Vampires. O corte é **o mais discutível**: a habilidade depende de criaturas excedentes, mana e board tribal; mas o outlet pode ter valor em mesas que pressionam Blood Artist/Meathook/Vein Ripper.  
**IN:** Scheming Silvertongue custa {1}{B}, é 1/3, Vampire, voa e tem lifelink. Ao chegar à segunda main phase com pelo menos duas vidas ganhas no turno, prepara uma cópia de Sign in Blood que custa {B}{B}.  
**Trade-off:** sobe o custo de um para dois manas e troca outlet/counters por evasão e compra condicional. Se o sac outlet é importante na experiência real, manter Aristocrat e testar Silvertongue contra outra criatura de payoff mais lenta.

### D. Nighthawk Scavenger → Sanguine Syphoner
**OUT:** Nighthawk Scavenger é um ótimo Vampire de combate com voar, lifelink e deathtouch; continua bom em metagame com muita criatura. A questão é a curva e o impacto incremental mais defensivo.  
**IN:** Sanguine Syphoner custa {1}{B}; quando ataca, cada oponente perde 1 vida e você ganha 1. Não precisa conectar para disparar. O ganho de vida provoca trigger do Vito; com Marauding Blight-Priest, pode gerar mais drenagem de mesa.  
**Trade-off:** troca qualidade defensiva por custo baixo e drenagem de mesa mais alinhada ao plano justo. Em ambiente de combate intenso, Nighthawk pode continuar sendo a escolha certa.

| OUT | IN | Classe | Confiança |
|---|---|---|---|
| Defiant Bloodlord | Morlun, Devourer of Spiders | Curva + finisher escalável | Alta, testar |
| Grim Tutor | Emeritus of Woe | Role compression tribal/tutor | Média; Grim é mais rápido |
| Indulgent Aristocrat | Scheming Silvertongue | Compra/evasão vs outlet/counters | Média/baixa; corte mais discutível |
| Nighthawk Scavenger | Sanguine Syphoner | Pressão justa de baixo custo | Alta no plano; depende do meta |

Nenhuma dessas decisões declara a carta removida “ruim”. Os testes devem registrar o ganho e o que se perde; implementar gradualmente é preferível a trocar quatro cartas de uma vez sem observação.

---

## 9. Novas cartas e watchlist

### V2
- **Morlun, Devourer of Spiders:** Vampire, lifelink, ETB escalável e ganho de vida → Vito; bom finisher sem loop.
- **Emeritus of Woe:** corpo tribal + tutor preparado + possibilidade condicional de re-preparar. Aumenta a percepção de combo e tem custo de primeiro tutor maior que Grim Tutor.
- **Scheming Silvertongue:** Vampire barato, flying/lifelink e Sign in Blood preparado se você tiver ganho ≥2 vidas no turno até o início da segunda main phase. O total de duas vidas é cumulativo; o próprio lifelink de um único ponto não basta.
- **Sanguine Syphoner:** ataque drena cada oponente em 1 e você ganha 1. Vito foca perda adicional e Blight-Priest pode ampliar o dreno.

### Watchlist prioritária — não são inclusões automáticas
- **Bloodline Recollector:** Vampire de {1}{B} que, se três ou mais criaturas morreram no turno, prepara cópia de Ancestral Craving por {B} (compra três, perde três). Excelente para mesas de troca de criaturas, mas incompatível com gatilho de morte enquanto Necrodominance estiver substituindo a ida ao cemitério por exílio.
- **Stensian Sanguinist:** Vampire de {1}{B}; ao atacar dá deathtouch a uma criatura e, se ela conectar, prepara uma cópia da PET CARD Exsanguinate. A cópia ainda precisa ser paga por {X}{B}{B} e depende de conexão; valor temático altíssimo, mas precisa de playtest.
- **Vengeful Bloodwitch:** cada morte de criatura sua pode virar 1 de ganho e perda, com trigger adicional de Vito; frágil e sujeita à mesma incompatibilidade com Necrodominance.
- **Nazar, the Velvet Fang:** acumula marcadores quando você ganha vida e pode convertê-los em compra de três quando ataca. Potencial de grind, mas curva e necessidade de ataque o deixam abaixo das opções de dois manas.
- **Moseo, Vein's New Dean:** não é Vampire, embora seja de identidade preta; cria Pest que ganha vida ao atacar e pode recuperar criatura ao fim do turno. Testar apenas se a recursão preencher um gargalo real.
- **Defiling Daemogoth:** não Vampire e mais caro; drain atrasado. Prioridade baixa para a identidade atual.

---

## 10. Interações de regras e armadilhas de pilotagem

1. **Vito causa perda de vida, não dano.**
2. **Lifelink se aplica a dano não de combate.** Por isso Morlun pode ganhar vida com seu ETB; a vida ganha dispara Vito.
3. **Sorin, Imperious Bloodlord não conjura Morlun.** Quando o coloca no campo com a habilidade -3, o X do custo não foi pago; X=0.
4. **Bloodletter of Aclazotz** só dobra a perda de vida dos oponentes durante o seu turno.
5. **Necrodominance** substitui cartas/fichas indo ao cemitério por exílio enquanto seu efeito se aplica. Isso impede “dies” triggers nesse período: Blood Artist, Meathook Massacre, Vein Ripper e os candidatos baseados em morte ficam desativados em relação a esses eventos.
6. **Blasphemous Edict** é Sorcery de MV 8. A condição (13+ criaturas no campo) habilita custo alternativo; o efeito é simétrico de sacrifício, não substituto garantido de Damnation.
7. **Cabal Coffers + Urborg:** Urborg faz os terrenos serem Swamps, permitindo Coffers escalar. **Cabal Stronghold** conta basic Swamps, logo não é equivalente.
8. **Extraplanar Lens:** ao exilar Snow-Covered Swamp, o efeito pode beneficiar oponentes que também usem Snow-Covered Swamps.
9. **Insatiable Avarice** tem linhas/modos de tutor no topo ou compra; não assumir que equivale sempre a tutor imediato na mão.
10. **Prepared spell não é gratuito.** Emeritus precisa pagar {1}{B} para a cópia de Demonic Tutor; só pode se preparar de novo com a condição de morte no turno.
11. **Scheming Silvertongue:** condição de duas vidas verificadas no começo da segunda main phase; o ganho é acumulado ao longo do turno.
12. **New Blood:** conferir o custo adicional de virar um Vampire desvirado ao roubar e converter a criatura; planejar o turno com esse recurso disponível.

---

## 11. Plano de playtest

Fazer pelo menos seis jogos, idealmente testando alguns swaps por vez. Por jogo, anotar: mão inicial/mulligan, turno de Vito, land drops/ mana nos turnos 3/5/7, cartas na mão nos turnos 4/7, primeiro drain relevante, triggers de Vito por turno, cartas mortas, uso de cada nova carta, uso de Necrodominance e gatilhos que foram perdidos, remoção adversária mais importante, turnos de fechamento, carta MVP e motivo da vitória/derrota.

Perguntas a responder:
1. Morlun fecha jogos por X de modo mais útil que Defiant Bloodlord ou perdemos redundância de payoff?
2. Emeritus é melhor no plano real (corpo + tutor extra) ou sentimos falta do tutor rápido de Grim?
3. Scheming Silvertongue prepara a cópia com frequência suficiente para justificar perder o outlet/counters do Aristocrat?
4. Sanguine Syphoner melhora pressão de mesa em comparação com Nighthawk Scavenger no seu metagame?
5. Necrodominance atrapalhou a contagem de mortes e o plano de lifedrain?
6. A base de 34 slots de mana foi consistente em mãos keepáveis?
7. O deck ganhou por drenagem justa em quantidade semelhante ou começou a depender demais de tutors/combo?

**Não alterar “Projected” para “Tested” até haver partidas anotadas.**

---

## 12. Fontes verificadas (9 de outubro de 2026)

- [Scryfall — Vito, Thorn of the Dusk Rose](https://scryfall.com/card/m21/127/vito-thorn-of-the-dusk-rose) — Oracle e características do comandante.
- [EDH.Wiki — Vito (estratégia)](https://edh.wiki/commanders/vito-thorn-of-the-dusk-rose/) — contexto lifegain/Vampires/lifedrain.
- [EDH.Wiki — Vito Lifegain](https://edh.wiki/commanders/vito-thorn-of-the-dusk-rose/lifegain/) — padrões de construção.
- [EDHREC — Vito Lifegain](https://edhrec.com/commanders/vito-thorn-of-the-dusk-rose/lifegain) — comparação de popularidade; popularidade é evidência auxiliar, não decisão.
- [Wizards — Foundations Release Notes](https://magic.wizards.com/en/news/feature/foundations-release-notes) — texto/rulings de cartas relevantes do pacote Foundations.
- [Morlun — Oracle](https://mtg.wtf/card/spm/257/Morlun-Devourer-of-Spiders)
- [Emeritus of Woe — Oracle](https://www.mtg.wtf/card/sos/80a/Emeritus-of-Woe)
- [Scheming Silvertongue — Oracle](https://mtg.wtf/card/sos/329a/Scheming-Silvertongue)
- [Sanguine Syphoner — Oracle](https://mtg.wtf/card/fdn/68/Sanguine-Syphoner)
- [Bloodline Recollector — Oracle](https://mtg.wtf/card/fra/49a/Bloodline-Recollector)
- [Stensian Sanguinist — Oracle](https://mtg.wtf/card/soc/29a/Stensian-Sanguinist)
- [Vengeful Bloodwitch — Oracle](https://mtg.wtf/card/fdn/76/Vengeful-Bloodwitch)
- [Blasphemous Edict — texto/custo alternativo](https://www.mtggoldfish.com/price/foundations/57/blasphemous-edict)

Textos Oracle e documentos oficiais têm precedência sobre recomendações de comunidade. A matriz Excel mantém a URL por carta e o racional individual.

---

## 13. Lista original — Current, sem alterações

```text
1 Vito, Thorn of the Dusk Rose (M21) 127 *F*
1 Agadeem's Awakening (ZNR) 336
1 Ancient Tomb (TMP) 315
1 Arcane Signet (VOC) 159
1 Beseech the Mirror (WOE) 82
1 Black Market Connections (ACR) 87 *F*
1 Blasphemous Edict (FDN) 57
1 Blood Artist (2X2) 352 *F*
1 Blood Tribute (C17) 100
1 Bloodchief Ascension (ZEN) 82
1 Bloodletter of Aclazotz (LCI) 92 *F*
1 Bloodline Keeper (V17) 4 *F*
1 Bloodthirsty Conqueror (FDN) 460 *F*
1 Bolas's Citadel (PWAR) 79 *F*
1 Bontu's Monument (DMC) 179
1 Cabal Coffers (MH2) 301
1 Cabal Stronghold (DOM) 238
1 Captivating Vampire (M11) 87 *F*
1 Castle Locthwain (ELD) 241
1 Consuming Corruption (MH3) 407
1 Creeping Bloodsucker (J22) 21
1 Crypt Ghast (DSC) 368 *F*
1 Damnation (TSR) 106
1 Dark Ritual (A25) 82
1 Deadly Rollick (C20) 42
1 Defiant Bloodlord (BFZ) 107 *F*
1 Demonic Tutor (DVD) 49
1 Enduring Tenacity (DSK) 374
1 Exquisite Blood (LCC) 195
1 Exsanguinate (SOM) 61
1 Extraplanar Lens (CMM) 656
1 Feed the Swarm (CLB) 752
1 Gifted Aetherborn (AER) 61 *F*
1 Gray Merchant of Asphodel (TSR) 323
1 Grim Tutor (M21) 103 *F*
1 Hagra Mauling (ZNR) 339
1 Hatred (EXO) 64
1 Henrika Domnathi (VOW) 293
1 Herald's Horn (C17) 53
1 Imp's Mischief (OTP) 15 *F*
1 Indulgent Aristocrat (SOI) 118 *F*
1 Insatiable Avarice (OTJ) 91
1 Jet Medallion (MH3) 346
1 K'rrik, Son of Yawgmoth (MH3) 365 *F*
1 Kalitas, Traitor of Ghet (OGW) 86
1 Malakir Bloodwitch (ZEN) 100
1 Malakir Rebirth (ZNR) 111
1 Marauding Blight-Priest (ZNR) 112
1 Markov Baron (MAT) 64 *F*
1 Mikokoro, Center of the Sea (DMC) 217
1 Mindcrank (CLB) 866
1 Necrodominance (MH3) 102
1 Necropotence (SLC) 1995 *F*
1 New Blood (C17) 19
1 Nighthawk Scavenger (ZNR) 115
1 Nullpriest of Oblivion (ZNR) 118
1 Nykthos, Shrine to Nyx (THS) 223
1 Path of Ancestry (CMM) 661
1 Preacher of the Schism (LCI) 113 *F*
1 Qarsi Revenant (TDM) 426 *F*
1 Sanguine Spy (SNC) 93
1 Sensei's Divining Top (CHK) 268
1 Shadowspear (THB) 236
1 Shizo, Death's Storehouse (CHK) 283 *F*
1 Slaughter Pact (TSR) 138
20 Snow-Covered Swamp (MH1) 252
1 Sol Ring (CC2) 7
1 Sorin Markov (M12) 109
1 Sorin, Imperious Bloodlord (SLD) 1244 *F*
1 The Meathook Massacre (MID) 348
1 Throne of Eldraine (WOC) 40
1 Torment of Hailfire (HOU) 77
1 Toxic Deluge (CC2) 6
1 Twilight Prophet (RIX) 88
1 Urborg, Tomb of Yawgmoth (UMA) 254
1 Vampire of the Dire Moon (M20) 120
1 Vampiric Tutor (CMR) 156
1 Vein Ripper (MKM) 346 *F*
1 War Room (CMR) 361 *F*
1 Witch's Cottage (ELD) 249
1 Withering Torment (DSK) 124
```

---

## 14. Lista proposta — V2 (projeção, não testada)

```text
1 Vito, Thorn of the Dusk Rose (M21) 127 *F*
1 Agadeem's Awakening (ZNR) 336
1 Ancient Tomb (TMP) 315
1 Arcane Signet (VOC) 159
1 Beseech the Mirror (WOE) 82
1 Black Market Connections (ACR) 87 *F*
1 Blasphemous Edict (FDN) 57
1 Blood Artist (2X2) 352 *F*
1 Blood Tribute (C17) 100
1 Bloodchief Ascension (ZEN) 82
1 Bloodletter of Aclazotz (LCI) 92 *F*
1 Bloodline Keeper (V17) 4 *F*
1 Bloodthirsty Conqueror (FDN) 460 *F*
1 Bolas's Citadel (PWAR) 79 *F*
1 Bontu's Monument (DMC) 179
1 Cabal Coffers (MH2) 301
1 Cabal Stronghold (DOM) 238
1 Captivating Vampire (M11) 87 *F*
1 Castle Locthwain (ELD) 241
1 Consuming Corruption (MH3) 407
1 Creeping Bloodsucker (J22) 21
1 Crypt Ghast (DSC) 368 *F*
1 Damnation (TSR) 106
1 Dark Ritual (A25) 82
1 Deadly Rollick (C20) 42
1 Morlun, Devourer of Spiders (SPM) 257
1 Demonic Tutor (DVD) 49
1 Enduring Tenacity (DSK) 374
1 Exquisite Blood (LCC) 195
1 Exsanguinate (SOM) 61
1 Extraplanar Lens (CMM) 656
1 Feed the Swarm (CLB) 752
1 Gifted Aetherborn (AER) 61 *F*
1 Gray Merchant of Asphodel (TSR) 323
1 Emeritus of Woe (SOS) 80
1 Hagra Mauling (ZNR) 339
1 Hatred (EXO) 64
1 Henrika Domnathi (VOW) 293
1 Herald's Horn (C17) 53
1 Imp's Mischief (OTP) 15 *F*
1 Scheming Silvertongue (SOS) 99
1 Insatiable Avarice (OTJ) 91
1 Jet Medallion (MH3) 346
1 K'rrik, Son of Yawgmoth (MH3) 365 *F*
1 Kalitas, Traitor of Ghet (OGW) 86
1 Malakir Bloodwitch (ZEN) 100
1 Malakir Rebirth (ZNR) 111
1 Marauding Blight-Priest (ZNR) 112
1 Markov Baron (MAT) 64 *F*
1 Mikokoro, Center of the Sea (DMC) 217
1 Mindcrank (CLB) 866
1 Necrodominance (MH3) 102
1 Necropotence (SLC) 1995 *F*
1 New Blood (C17) 19
1 Sanguine Syphoner (FDN) 68
1 Nullpriest of Oblivion (ZNR) 118
1 Nykthos, Shrine to Nyx (THS) 223
1 Path of Ancestry (CMM) 661
1 Preacher of the Schism (LCI) 113 *F*
1 Qarsi Revenant (TDM) 426 *F*
1 Sanguine Spy (SNC) 93
1 Sensei's Divining Top (CHK) 268
1 Shadowspear (THB) 236
1 Shizo, Death's Storehouse (CHK) 283 *F*
1 Slaughter Pact (TSR) 138
20 Snow-Covered Swamp (MH1) 252
1 Sol Ring (CC2) 7
1 Sorin Markov (M12) 109
1 Sorin, Imperious Bloodlord (SLD) 1244 *F*
1 The Meathook Massacre (MID) 348
1 Throne of Eldraine (WOC) 40
1 Torment of Hailfire (HOU) 77
1 Toxic Deluge (CC2) 6
1 Twilight Prophet (RIX) 88
1 Urborg, Tomb of Yawgmoth (UMA) 254
1 Vampire of the Dire Moon (M20) 120
1 Vampiric Tutor (CMR) 156
1 Vein Ripper (MKM) 346 *F*
1 War Room (CMR) 361 *F*
1 Witch's Cottage (ELD) 249
1 Withering Torment (DSK) 124
```

---

## 15. Decisões que não podem ser perdidas

- Preservar Mono-Black Vampire Tribal + lifegain/lifedrain; este é o primeiro e favorito deck do usuário.
- Hatred, Exsanguinate e New Blood são PET LOCKs permanentes.
- Não transformar o deck em “tutor + combo” como plano padrão; priorizar vitória por drenagem justa quando viável.
- Quatro swaps propostos não são veredictos irreversíveis. Grim Tutor, Indulgent Aristocrat e Nighthawk Scavenger possuem razões fortes para permanecer; os seus cortes devem ser validados na mesa.
- **Damnation permanece**; não cortar uma wrath confiável só para forçar 8×8.
- Current e V2 fecham 100 cartas; ambos têm 31 terrenos físicos + 3 MDFCs = 34 slots atribuídos à mana + 65 cartas funcionais + comandante.
- Emeritus of Woe acrescenta corpo Vampire e possibilidade de tutor extra, mas sua primeira cópia é mais lenta que Grim Tutor.
- Morlun é uma condição de vitória justa escalável, não um combo infinito; se for posto em campo por Sorin, X=0.
- Scheming Silvertongue precisa atingir o threshold de duas vidas até a segunda main phase.
- Necrodominance tem anti-sinergia estrutural com triggers de morte.
- Current 8,3/10 é estimativa analítica; V2 9,0/10 é projeção, não dado testado.

**Próximo passo:** testar V2 gradualmente, registrar partidas e revisar os dois artefatos com evidências de jogo ou com as novas cartas dos próximos sets.
