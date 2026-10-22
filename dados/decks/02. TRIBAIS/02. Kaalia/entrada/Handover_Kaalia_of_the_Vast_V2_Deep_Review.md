# HANDOVER ESPECÍFICO — KAALIA OF THE VAST | V2 DEEP REVIEW

**Projeto:** Commander — análise profunda e evolução de deck
**Comandante:** Kaalia of the Vast (Mardu: branco/preto/vermelho)
**Estado da lista recebida:** `CURRENT` — congelada como referência; não foi alterada
**Estado da proposta:** `PROPOSED V2` — versão analítica ainda **não testada**
**Estado de playtest:** `TESTED` — nenhuma partida registrada até a data deste handover
**Meta:** maximizar consistência, velocidade, proteção e impacto dos Anjos, Demônios e Dragões colocados em combate pela Kaalia, mantendo um plano de combate reconhecível e sem exigir combo infinito como condição principal de vitória.

## 1. Resumo executivo

A lista CURRENT tem 100 cartas incluindo a comandante, 34 terrenos e 25 terrenos básicos. A contagem de alvos elegíveis é 29: Sower of Discord é um Demônio e pode ser colocado pela Kaalia. Ela tem ameaças fortes e algumas respostas relevantes, mas o motor da Kaalia está incompleto: há aceleração, porém pouca proteção proativa e nenhuma fonte dedicada de ímpeto no pacote original. Há ainda cartas cujo texto de ataque não funciona quando a Kaalia as coloca já atacando.

**Nota CURRENT:** 5,8/10 — estimativa analítica para Commander casual de alto poder, não resultado de partidas.

A V2 proposta foi construída para reduzir a distância entre comprar uma criatura poderosa e convertê-la imediatamente em vantagem. Ela aumenta o terreno count para 35, usa aceleração mais eficiente, ímpeto/proteção, seleção e tutores, remoção eficiente, recursão e alvos de Kaalia com ETB, habilidades estáticas ou gatilhos de dano de combate.

**Nota projetada da V2:** 8,9/10 — projeção de construção para high-power casual/optimized casual, ainda sujeita a validação por partidas. Não declarar como 10/10 nem como testada.

## 2. Regra Oracle da comandante — verificação obrigatória

Texto de referência de Kaalia of the Vast: “Whenever Kaalia attacks an opponent, you may put an Angel, Demon, or Dragon creature card from your hand onto the battlefield tapped and attacking that opponent.”

Fontes para conferência:
- Scryfall (impressão indicada pelo usuário): https://scryfall.com/card/mh3/290/kaalia-of-the-vast
- Texto Oracle/rulings consultáveis: https://mtg.wtf/card/2xm/204/Kaalia-of-the-Vast
- Comprehensive Rules da Wizards: https://magic.wizards.com/en/rules
- Guia especializado de arquétipo: https://edh.wiki/commanders/kaalia-of-the-vast/aggro/

Correções de interpretação:
1. Não é uma carta tribal genérica. Kaalia permite uma **carta de criatura Anjo, Demônio ou Dragão** da mão.
2. É necessário que Kaalia ataque **um oponente**. Atacar um planeswalker ou uma battle não satisfaz o texto “attacks an opponent”.
3. A criatura entra virada e atacando o mesmo oponente, mas **não foi declarada atacante**. Portanto, habilidades “Whenever this creature attacks” não disparam quando a criatura é colocada no campo já atacando.
4. Habilidades de ETB, habilidades estáticas e habilidades de dano de combate ainda podem funcionar normalmente.
5. A proteção contra “não pode atacar” geralmente não impede o efeito de colocação já atacando, porque a criatura não está sendo declarada atacante. Isso não deve ser confundido com dar ímpeto à Kaalia: ela própria ainda precisa poder atacar.

Implicações concretas na lista CURRENT:
- **Velomachus Lorehold:** seu gatilho de ataque não ocorre quando é colocado já atacando; por isso não é tratado como payoff confiável de Kaalia.
- **Shadrix Silverquill:** a habilidade ocorre no início do combate do seu turno; quando Kaalia ataca, esse momento já passou. Shadrix pode ter valor em turnos seguintes, mas não é um payoff imediato do ataque atual.
- **Varragoth, Bloodsky Sire:** boast exige que Varragoth tenha atacado; ser posto já atacando não equivale a ter atacado por declaração. Não é um tutor imediato nesse cenário.
- **Balor:** o gatilho de ataque não dispara quando ele entra já atacando; a habilidade de morte continua funcionando. Sua avaliação não ignora completamente o texto de morte, mas o modo de ataque perde confiabilidade.
- **Master of Cruelties:** embora apareça em recomendações de Kaalia, colocá-lo já atacando não dispara sua habilidade de ataque. Não foi incluído como atalho automático para reduzir o oponente a 1 de vida.

Estas distinções são regras, não estimativas. Os ganhos projetados das inclusões seguintes são hipóteses estratégicas até serem comparados em partidas.

## 3. Estratégia proposta por fase do jogo

### Início — montar o ataque que importa
- Priorizar mão com 2–3 fontes de mana, aceleração e acesso a Kaalia ou proteção/ímpeto. A V2 contém dez peças de aceleração não-terreno no grupo primário, mas parte delas exige descartar/exilar uma carta ou pagar vida; não mulligar automaticamente para toda mão explosiva.
- Usar Lightning Greaves, Swiftfoot Boots, Rising of the Day, Arena of Glory ou Hall of the Bandit Lord para tentar atacar mais cedo. Rising of the Day dá ímpeto às criaturas lendárias; não dá ímpeto a todos os alvos não lendários.
- Proteger a janela do primeiro ataque. Grand Abolisher e Silence podem reduzir a interação durante seu turno; Mother of Runes e Giver of Runes ajudam contra certas remoções alvo, enquanto Boros Charm, Teferi’s Protection, Flawless Maneuver e Deflecting Swat cobrem cenários diferentes. Nenhuma delas responde a tudo.

### Meio — escolher o alvo que resolve o estado de jogo
- **Atrás / precisa estabilizar:** Angel of Despair, Angel of the Ruins, Angel of Serenity e Shadowgrange Archfiend oferecem interação por ETB; Toxic Deluge e remoções instantâneas cobrem situações em que atacar não basta.
- **Empatado / precisa manter recursos:** Hoarding Broodlord, Rune-Scarred Demon e Burning-Rune Demon melhoram acesso a cartas; Ancient Silver Dragon pode reabastecer a mão em grande escala quando conecta dano de combate. As mágicas encontradas por tutores ainda precisam ser pagas.
- **À frente / quer converter conexão em vantagem:** Ancient Copper Dragon, Ancient Gold Dragon, Ancient Brass Dragon, Balefire Dragon, Lord of the Void e Hellkite Tyrant precisam de dano de combate para produzir seus melhores resultados; proteção e escolha do oponente tornam-se cruciais.
- **Precisa encerrar:** Gisela, Blade of Goldnight, Bloodletter of Aclazotz, Archfiend of Despair e Sower of Discord amplificam a pressão, mas são efeitos diferentes: Bloodletter duplica a perda de vida de oponentes no seu turno; Gisela altera dano; Archfiend of Despair faz perder vida no fim do turno com base na vida perdida naquele turno.

### Fim — redundância, não apenas uma criatura grande
- Usar múltiplas ameaças com funções distintas, recursão via Reanimate/Animate Dead e recuperação de criaturas por Liesa, Forgotten Archangel.
- Avacyn, Angel of Hope, Archangel Avacyn e Serra’s Emissary ajudam a proteger a posição de formas diferentes, mas não dão imunidade a toda remoção, exílio, sacrifício ou efeitos que não destroem.
- Se Kaalia é removida repetidamente, a lista deve conseguir conjurar algumas ameaças, gerar cartas, tutorar, reanimar e interagir. A independência da comandante melhora, mas continua sendo um ponto vulnerável de uma estratégia baseada em ataque.

## 4. Diagnóstico da CURRENT

| Eixo | Diagnóstico |
|---|---|
| Quantidade | 100 cartas; 34 terrenos; 25 básicos; 9 terrenos não básicos. Há 29 alvos elegíveis de Anjo/Demônio/Dragão, incluindo Sower of Discord (Demônio). Singleton conforme a lista enviada, salvo repetição de básicos. |
| Curva | Densidade alta de criaturas e mágicas caras; a comandante custa quatro manas e precisa atacar para gerar valor. |
| Aceleração | Há Sol Ring, Arcane Signet, três Signets, Mind Stone e Savai Crystal. Parte é eficiente, mas Savai Crystal e outros rocks de três manas competem com o desenvolvimento do turno em que queremos atacar. |
| Ímpeto | Não há fonte dedicada no pacote CURRENT. Sem ímpeto, baixar Kaalia no turno anterior dá aos oponentes uma janela para removê-la antes que gere valor. |
| Proteção | Boros Charm e Your Temple Is Under Attack são respostas úteis, mas não constituem uma camada confiável de proteção à comandante. Avacyn e algumas criaturas protegem em contextos mais específicos e custam muito. |
| Vantagem/seleção | Há Smothering Tithe, Hoarding Broodlord, Call of the Ring, Sign in Blood, Read the Bones e outras cartas úteis; a densidade de seleção/tutor para encontrar a combinação correta de mana + Kaalia + proteção é baixa. |
| Remoção | Existe interação, mas algumas escolhas têm restrições (por exemplo, Power Word Kill não pode destruir Anjos, Demônios ou Dragões) e há remoções lentas ou pouco flexíveis para a função desejada. |
| Conversão do ataque | Várias criaturas são poderosas, porém nem todas afetam a mesa no momento da entrada; outras dependem de um gatilho de ataque que não acontece quando Kaalia as coloca no combate. |
| Recuperação | Raise the Draugr recupera criaturas do cemitério para a mão, não diretamente para o campo. A lista original tem poucas formas de reconstruir um alvo removido. |

Cartas CURRENT que têm papel importante e são preservadas na V2 incluem Kaalia, Ancient Brass Dragon, Ancient Gold Dragon, Avacyn, Angel of Hope, Archangel Avacyn, Balefire Dragon, Boros Charm, Command Tower, Exotic Orchard, Gisela, Blade of Goldnight, Hellkite Tyrant, Hoarding Broodlord, Drana and Linvala, Linvala, Keeper of Silence, Lord of the Void, Rakdos, Patron of Chaos, Shadowgrange Archfiend, Sower of Discord, Smothering Tithe, Sol Ring, Valgavoth, Terror Eater, Savai Triome e Bojuka Bog. Path to Exile também é mantida.

## 5. Proposta funcional 8×8 — 64 cartas não-terreno além da comandante

A Teoria 8×8 foi usada como instrumento de diagnóstico. Os grupos primários abaixo são **mutuamente exclusivos** nesta contagem: cada não-terreno da proposta ocupa um único grupo principal, embora várias cartas tenham funções secundárias.

| Grupo | Slots | Função principal |
|---|---:|---|
| 1. Ramp e mana colorida | 10 | Reduzir o tempo até Kaalia; manter conjuração de apoio. |
| 2. Ímpeto e proteção | 11 | Melhorar a primeira conexão e defender a janela de combate. |
| 3. Compra, tutores e acesso a cartas | 10 | Encontrar peças e evitar perder gás após a primeira ameaça. |
| 4. Remoção por ETB e interação de mágicas | 10 | Responder a permanentes, criaturas e mesas que não podem ser vencidas só atacando. |
| 5. Payoffs de dano de combate e multiplicadores | 12 | Converter a conexão em tesouros, dano em massa, criaturas roubadas ou fechamento. |
| 6. Disrupção estática / proteção de mesa | 7 | Restringir oponentes e tornar a mesa mais difícil de responder. |
| 7. Pressão / negação em etapas finais | 2 | Produzir valor e pressionar fora do gatilho de ataque. |
| 8. Recursão / recuperação | 2 | Reutilizar alvos de alto impacto após remoção. |
| **Total** | **64** | 35 terrenos + comandante + 64 não-terrenos = 100 cartas. |

## 6. Lista completa PROPOSED V2 — não testada

```text
COMMANDER
1 Kaalia of the Vast

LANDS (35)
1 Ancient Tomb
1 Arena of Glory
1 Arid Mesa
1 Badlands
1 Battlefield Forge
1 Blood Crypt
1 Bloodstained Mire
1 Bojuka Bog
1 Caves of Koilos
1 Clifftop Retreat
1 Command Tower
1 Concealed Courtyard
1 Exotic Orchard
1 Godless Shrine
1 Hall of the Bandit Lord
1 Luxury Suite
1 Marsh Flats
1 Mana Confluence
1 Reflecting Pool
1 Sacred Foundry
1 Savai Triome
1 Spectator Seating
1 Sulfurous Springs
1 Sundown Pass
1 Vault of Champions
1 Urborg, Tomb of Yawgmoth
3 Mountain
3 Plains
3 Swamp

CREATURES (33 besides commander)
1 Ancient Brass Dragon
1 Ancient Copper Dragon
1 Ancient Gold Dragon
1 Angel of Despair
1 Angel of the Ruins
1 Archangel Avacyn
1 Avacyn, Angel of Hope
1 Balefire Dragon
1 Bloodletter of Aclazotz
1 Drana and Linvala
1 Gisela, Blade of Goldnight
1 Hellkite Tyrant
1 Hoarding Broodlord
1 Ancient Silver Dragon
1 Linvala, Keeper of Silence
1 Lord of the Void
1 Rakdos, Patron of Chaos
1 Rune-Scarred Demon
1 Serra's Emissary
1 Terror of the Peaks
1 Valgavoth, Terror Eater
1 Vilis, Broker of Blood
1 Archfiend of Despair
1 Archfiend of Depravity
1 Angel of Serenity
1 Burning-Rune Demon
1 Liesa, Forgotten Archangel
1 Shadowgrange Archfiend
1 Sower of Discord
1 Esper Sentinel
1 Grand Abolisher
1 Mother of Runes
1 Giver of Runes

NONCREATURE SPELLS (31)
1 Sol Ring
1 Mana Vault
1 Chrome Mox
1 Mox Diamond
1 Lotus Petal
1 Arcane Signet
1 Talisman of Conviction
1 Talisman of Hierarchy
1 Talisman of Indulgence
1 Dark Ritual
1 Lightning Greaves
1 Swiftfoot Boots
1 Rising of the Day
1 Boros Charm
1 Teferi's Protection
1 Flawless Maneuver
1 Deflecting Swat
1 Silence
1 Necropotence
1 The One Ring
1 Smothering Tithe
1 Demonic Tutor
1 Vampiric Tutor
1 Swords to Plowshares
1 Path to Exile
1 Anguished Unmaking
1 Wear // Tear
1 Deadly Rollick
1 Reanimate
1 Animate Dead
1 Toxic Deluge
```

**Contagem:** 100 cartas incluindo Kaalia; 35 terrenos (9 básicos + 26 não básicos); 33 criaturas no deck além da comandante; 31 mágicas não-criatura. Há 29 criaturas Anjo/Demônio/Dragão elegíveis para a habilidade da Kaalia e quatro criaturas de suporte. Proposta destinada a Commander legal, sujeita à conferência final da banlist/texto Oracle ao importar a lista para o ambiente de jogo. Não inclui Mana Crypt ou Jeweled Lotus.

## 7. Por que os principais pacotes foram escolhidos

### Aceleração e cores
- **Mana Vault, Chrome Mox, Mox Diamond, Lotus Petal e Dark Ritual:** aumentam a chance de Kaalia aparecer cedo. O custo é real: descarte/exílio de carta, perda de vida ou recursos de uso limitado. O ganho de velocidade pode ser menor em mesas que punem fast mana ou alongam a partida.
- **Talismans e Arcane Signet:** fontes de duas manas que corrigem cores e são menos explosivas, mas melhoram a consistência.
- **35 terrenos e correção Mardu:** reduzem mãos em que há ameaças mas faltam cores. A base é cara e causa perda de vida em algumas linhas; os playtests devem observar cores nos dois primeiros turnos e a vida restante depois dos fetch/shocks/pain lands.
- **Cinco fontes dedicadas de ímpeto (incluindo terrenos):** Lightning Greaves, Swiftfoot Boots, Rising of the Day, Hall of the Bandit Lord e Arena of Glory. Arena só concede ímpeto à criatura conjurada com a mana gerada pela habilidade ativada/exertada; Hall entra virada e custa 3 de vida ao ser ativado. **Ancient Tomb** acelera, mas produz incolor e custa vida. Esses terrenos ajudam à janela de ataque, mas não substituem fontes coloridas.

### Ímpeto e proteção
- **Lightning Greaves / Swiftfoot Boots:** aumentam a probabilidade de Kaalia atacar, mas Greaves tem shroud e pode dificultar equipar outra proteção/target; Swiftfoot Boots é mais lenta e permite alvos.
- **Rising of the Day:** ímpeto para Kaalia por ela ser lendária; o bônus não torna todos os alvos não lendários mais fortes nem lhes concede ímpeto.
- **Boros Charm, Teferi's Protection, Flawless Maneuver, Deflecting Swat e Silence:** funções diferentes; não tratar como cinco cópias da mesma proteção. Eles precisam ser guardados para as ameaças que realmente derrotariam nosso plano.
- **Mother of Runes / Giver of Runes:** ajudam contra remoção alvo e bloqueadores por proteção, mas não impedem wipes globais. Grand Abolisher atua apenas durante nosso turno e não impede a ativação de todas as habilidades de permanentes adversárias.

### Alvos de Kaalia
- **Angel of Despair, Angel of the Ruins, Angel of Serenity e Shadowgrange Archfiend:** trazem interação em ETB; funcionam mesmo quando colocados já atacando. Angel of the Ruins exige escolher até dois artefatos/encantamentos; Angel of Serenity afeta até três criaturas e devolve as cartas exiladas às mãos quando sai do campo.
- **Hoarding Broodlord, Rune-Scarred Demon e Burning-Rune Demon:** melhoram acesso a cartas por ETB; Ancient Silver Dragon fornece volume de compra explosivo quando conecta dano de combate. A vantagem dos tutores não elimina o custo de conjurar as cartas encontradas.
- **Ancient Copper Dragon / Gold Dragon / Brass Dragon, Balefire Dragon e Lord of the Void:** recompensam conectar. São menos impressionantes quando bloqueados, removidos antes do dano ou se a Kaalia não conseguir atacar o oponente certo. Proteção e seleção de ataque fazem parte do pacote.
- **Gisela, Bloodletter, Archfiend of Despair e Sower of Discord:** aceleram o fechamento de partidas. A sobreposição é intencional, mas as peças devem ser medidas por dano real e não apenas por texto potencial.
- **Vilis, Broker of Blood:** é um motor de cartas quando há perda de vida; a habilidade ativada também pode remover criaturas pequenas e gerar cartas. Argumento contra: não gera valor automaticamente apenas por entrar, e a ativação custa mana preta e 2 pontos de vida.
- **Terror of the Peaks:** pode converter futuras entradas de criatura em dano e protege-se de alvos por custo de vida; argumento contra: Kaalia colocá-lo em campo não faz o próprio Terror disparar a habilidade de “outra criatura”. É uma ameaça de continuidade, não um ETB removal imediato.
- **Sower of Discord:** é um Demônio e, portanto, um alvo válido da Kaalia. Ao entrar, escolhe dois jogadores distintos; cada vez que um deles recebe dano, o outro perde a mesma quantidade de vida. Isso amplifica o combate sem depender de um gatilho “quando esta criatura ataca”. A limitação é escolher bem a dupla: o segundo jogador perde vida, não recebe dano, e o efeito só converte valor quando há dano a um dos escolhidos.

## 8. Trocas OUT → IN e custo de oportunidade

A matriz exata de 66 mudanças está na aba **Upgrade Matrix** do Excel, com função, justificativa, prioridade, confiança, risco e estado. A lista CURRENT permanece intacta na aba **Card Matrix**. A síntese abaixo registra os blocos de maior impacto.

### Base de mana — 21 trocas

| OUT | IN | Racional e risco |
|---|---|---|
| Mountain | Arena of Glory | Mana-base package upgrade. OUT: Reduce basics from 6 to 3 in the current shell; optimized fetch/shock/dual sources improve WBR access. Retain 3 Mountains. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Mountain | Arid Mesa | Mana-base package upgrade. OUT: Reduce basics from 6 to 3 in the current shell; optimized fetch/shock/dual sources improve WBR access. Retain 3 Mountains. IN: Fetchland improves color selection; can find an appropriate typed dual/shock or basic. |
| Mountain | Badlands | Mana-base package upgrade. OUT: Reduce basics from 6 to 3 in the current shell; optimized fetch/shock/dual sources improve WBR access. Retain 3 Mountains. IN: Typed multicolor source makes fetchlands more flexible; manage life/tapped-entry tradeoffs. |
| Plains | Battlefield Forge | Mana-base package upgrade. OUT: Reduce basics from 9 to 3; use fetchable duals/shocks and untapped lands for better colored access. Retain 3 Plains. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Plains | Blood Crypt | Mana-base package upgrade. OUT: Reduce basics from 9 to 3; use fetchable duals/shocks and untapped lands for better colored access. Retain 3 Plains. IN: Typed multicolor source makes fetchlands more flexible; manage life/tapped-entry tradeoffs. |
| Plains | Bloodstained Mire | Mana-base package upgrade. OUT: Reduce basics from 9 to 3; use fetchable duals/shocks and untapped lands for better colored access. Retain 3 Plains. IN: Fetchland improves color selection; can find an appropriate typed dual/shock or basic. |
| Plains | Caves of Koilos | Mana-base package upgrade. OUT: Reduce basics from 9 to 3; use fetchable duals/shocks and untapped lands for better colored access. Retain 3 Plains. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Plains | Clifftop Retreat | Mana-base package upgrade. OUT: Reduce basics from 9 to 3; use fetchable duals/shocks and untapped lands for better colored access. Retain 3 Plains. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Plains | Concealed Courtyard | Mana-base package upgrade. OUT: Reduce basics from 9 to 3; use fetchable duals/shocks and untapped lands for better colored access. Retain 3 Plains. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Swamp | Godless Shrine | Mana-base package upgrade. OUT: Reduce basics from 10 to 3; Urborg plus fetchable black duals preserve black access while improving white/red access. Retain 3 Swamps. IN: Typed multicolor source makes fetchlands more flexible; manage life/tapped-entry tradeoffs. |
| Swamp | Hall of the Bandit Lord | Mana-base package upgrade. OUT: Reduce basics from 10 to 3; Urborg plus fetchable black duals preserve black access while improving white/red access. Retain 3 Swamps. IN: Land slot trades colored tempo for a reliable haste line; activate before casting Kaalia. |
| Swamp | Luxury Suite | Mana-base package upgrade. OUT: Reduce basics from 10 to 3; Urborg plus fetchable black duals preserve black access while improving white/red access. Retain 3 Swamps. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Swamp | Marsh Flats | Mana-base package upgrade. OUT: Reduce basics from 10 to 3; Urborg plus fetchable black duals preserve black access while improving white/red access. Retain 3 Swamps. IN: Fetchland improves color selection; can find an appropriate typed dual/shock or basic. |
| Swamp | Mana Confluence | Mana-base package upgrade. OUT: Reduce basics from 10 to 3; Urborg plus fetchable black duals preserve black access while improving white/red access. Retain 3 Swamps. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Swamp | Reflecting Pool | Mana-base package upgrade. OUT: Reduce basics from 10 to 3; Urborg plus fetchable black duals preserve black access while improving white/red access. Retain 3 Swamps. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Swamp | Sacred Foundry | Mana-base package upgrade. OUT: Reduce basics from 10 to 3; Urborg plus fetchable black duals preserve black access while improving white/red access. Retain 3 Swamps. IN: Typed multicolor source makes fetchlands more flexible; manage life/tapped-entry tradeoffs. |
| Cathedral of War | Spectator Seating | Mana-base package upgrade. OUT: Exalted is a marginal +1/+1 when Kaalia attacks alone; tapped utility land is less important than color consistency and haste. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Monumental Henge | Sulfurous Springs | Mana-base package upgrade. OUT: Utility is less valuable than untapped color fixing and fetchable duals in a three-color, tempo-sensitive deck. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Rogue's Passage | Sundown Pass | Mana-base package upgrade. OUT: Expensive activation is unnecessary for flying Kaalia; spend the land slot on color fixing or haste. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Shattered Landscape | Vault of Champions | Mana-base package upgrade. OUT: Cycling/fetch utility is slower than the proposed multicolor sources and fast lands. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |
| Temple of Silence | Urborg, Tomb of Yawgmoth | Mana-base package upgrade. OUT: Tapped scry land slows the plan; the proposed mana base prioritizes untapped color sources. IN: Mana-base improvement: more reliable Mardu colors, fewer low-impact tapped/colorless slots. |

**Custo/oposição:** reduzir os básicos melhora cores e habilita fetchlands/duais, mas também aumenta perda de vida, exposição a hate de não básicos e dependência de uma base mais cara. Não é obrigatório copiar exatamente a base de mana se o ambiente pune vida ou não-básicos; neste projeto o orçamento não é a restrição principal.

### Estrutura e criaturas — 19 mudanças

| OUT | IN | Por que melhora o plano |
|---|---|---|
| Sorin Markov | Ancient Tomb | Sorin is a six-mana planeswalker that does not support Kaalia's attack engine; this proposed slot instead adds an explosive land source and increases total lands from 34 to 35. This is a deck-structure reallocation, not a like-for-like card role replacement. |
| Ao, the Dawn Sky | Ancient Silver Dragon | OUT: Ao is a valid target, but much of its value is tied to its death trigger. IN: Ancient Silver Dragon is an eligible Dragon target; a combat-damage connection can draw a very large number of cards, and that damage trigger does work when it enters attacking. It is an eight-mana threat that would be clunky to cast fairly and can fail if blocked or removed before damage. |
| Archangel of Strife | Serra's Emissary | OUT: Table-wide choice is politically variable and can improve an opponent's combat as well as yours; impact is less reliable than a selected protection effect. IN: Immediate static/ETB protection or disruption, not dependent on a separate attack trigger. Serra's Emissary can choose the card type most relevant to the pod and immediately protect Kaalia/the board from that type. |
| Archangel of Thune | Bloodletter of Aclazotz | OUT: Powerful with repeatable lifegain, but the deck has no dedicated lifegain engine to make it consistently snowball. IN: Damage/life-loss multiplier that accelerates a combat-centric close. Bloodletter multiplies opponents' life loss on your turn; the current deck lacks repeatable lifegain to support Thune. |
| Baneslayer Angel | Angel of Despair | OUT: Efficient body for casual play, but no ETB, static lock, or game-ending trigger; too fair for the premium Kaalia target slot. IN: High-value ETB interaction; Kaalia's cheat bypasses mana cost while preserving the ETB trigger. Replaces a fair lifelink body with an ETB that destroys a target permanent when cheated into play. |
| Decadent Dragon | Ancient Copper Dragon | OUT: Playable combat-damage value, but Ancient Copper Dragon has a substantially higher ceiling for enabling hard-casts after a successful hit. IN: Combat-damage payoff; the trigger works if the creature connects even though it was put in attacking. Ancient Copper Dragon can create a large Treasure burst when it connects, helping hard-cast payoffs after Kaalia is answered. |
| Indulgent Tormentor | Archfiend of Depravity | OUT: Slow upkeep value that lets opponents choose the least harmful mode; Archfiend of Depravity / Despair create higher pressure immediately. IN: Premium Angel/Demon/Dragon payoff. Evaluate whether it impacts the board immediately, produces value on damage, or controls opponents. Archfiend constrains opponents' creature boards on upkeep; Tormentor gives opponents too much control over its value trigger. |
| Piru, the Volatile | Angel of Serenity | OUT: Piru's death wipe is delayed and can punish your own nonlegendary support. IN: Angel of Serenity is an eligible Angel target; its ETB can exile up to three creatures from the battlefield and/or graveyards. The trade-off is that cards exiled this way return to their owners' hands when Angel of Serenity leaves. |
| Resolute Archangel | Vilis, Broker of Blood | OUT: Can reset life totals when behind, but is conditional and does not reliably advance the kill; Vilis converts life payments into cards and removal pressure. IN: Premium Angel/Demon/Dragon payoff. Evaluate whether it impacts the board immediately, produces value on damage, or controls opponents. Vilis can turn life paid to activate its ability into cards and shrink creatures; Resolute Archangel only resets life when behind. |
| Reya Dawnbringer | Liesa, Forgotten Archangel | OUT: Seven-mana upkeep recursion is slow and exposes a full turn cycle before value; Liesa brings recurring value with a stronger static effect. IN: Premium Angel/Demon/Dragon payoff. Evaluate whether it impacts the board immediately, produces value on damage, or controls opponents. Liesa provides immediate static recursion value instead of waiting for an upkeep trigger on a seven-mana creature. |
| Sephara, Sky's Blade | Angel of the Ruins | OUT: A strong flyer-protection option, but partly redundant with Avacyn, Serra's Emissary, and the dedicated protection package; Angel of the Ruins adds immediate interaction. IN: High-value ETB interaction; Kaalia's cheat bypasses mana cost while preserving the ETB trigger. Sephara's flyer protection overlaps with Avacyn and other protection; Angel of the Ruins immediately exiles up to two artifacts/enchantments. |
| Shadrix Silverquill | Burning-Rune Demon | OUT: Its beginning-of-combat value is too delayed when it is put onto the battlefield during the attack step, and its choices can help opponents. IN: ETB card selection/tutor converts Kaalia's attack into quality or access for the next sequence. Shadrix's beginning-of-combat trigger has missed the current combat when cheated in; Burning-Rune Demon gives tutor choice on entry. |
| Varragoth, Bloodsky Sire | Rune-Scarred Demon | OUT: Its boast ability requires it to have attacked; being put onto the battlefield attacking with Kaalia does not make it declared as an attacker. Rune-Scarred Demon tutors immediately on ETB. IN: ETB card selection/tutor converts Kaalia's attack into quality or access for the next sequence. Varragoth's boast requires that it attacked, which it did not do when merely put into combat; Rune-Scarred Demon tutors on ETB. |
| Velomachus Lorehold | Terror of the Peaks | OUT: Its attack trigger does not fire when Kaalia places it onto the battlefield attacking; the slot is stronger as an ETB or combat-damage payoff. IN: Premium Angel/Demon/Dragon payoff. Evaluate whether it impacts the board immediately, produces value on damage, or controls opponents. Velomachus's attack trigger does not fire on entry attacking; Terror of the Peaks triggers on subsequent creatures entering and turns Kaalia into a damage engine. |
| Infiltration Lens | Esper Sentinel | OUT: Draw depends on the equipped creature being blocked; Kaalia flies and needs protection more than conditional card draw. IN: Replace conditional draw that requires being blocked with a one-mana tax/draw engine that starts much earlier. |
| Ghostly Prison | Grand Abolisher | OUT: Good meta-defense, but it taxes attacks rather than protecting Kaalia from removal; proactive protection and haste better advance the central plan. IN: Replace an attack tax with a creature that prevents opponents from casting spells during your turn, protecting the Kaalia attack window. |
| Embercleave | Mother of Runes | OUT: Can surprise-kill, but spends a slot and mana on combat stats instead of solving Kaalia's larger weakness: being removed before generating value. IN: Trade a mana-intensive combat trick for repeatable protection that helps Kaalia survive removal and combat. |
| Two-Handed Axe | Giver of Runes | OUT: Combat-stat enhancement competes with the more urgent need for haste/protection; Giver of Runes protects the engine instead. IN: Replace a combat-stat slot with a one-mana protection creature; the engine surviving is more important than adding power to one attacker. |
| Ruinous Ultimatum | Deflecting Swat | OUT: Extremely powerful when cast, but seven mana and three colors make it slow; Toxic Deluge can reset problematic boards much earlier. IN: A seven-mana reset is hard to cast on tempo; Deflecting Swat can protect Kaalia or redirect a key targeted spell/ability for free when commander is controlled. Protect the attack/board at the moment opponents try to stop it; some effects cover only particular answer types. |

### Rebalanceamento das mágicas — 26 mudanças de slot

| OUT | IN | O que o slot passa a fazer |
|---|---|---|
| Balor | Archfiend of Despair | OUT: The attack mode doesn't trigger when Kaalia puts it into combat; the death mode is conditional. Lower immediate floor than an ETB or combat-damage payoff. IN: Damage/life-loss multiplier that accelerates a combat-centric close. The attack trigger on Balor won't trigger from Kaalia's put-into-combat effect; Archfiend of Despair amplifies life loss at end step. |
| Abstruse Appropriation | Deadly Rollick | OUT: Flexible exile + potential cast-back, but four mana is expensive for reactive interaction in a deck that needs to deploy/protect Kaalia. IN: Free creature exile while Kaalia is on the battlefield; lower mana cost than the current four-mana reactive spell. Efficient interaction; broadens responses beyond combat and helps avoid being outraced. |
| Boros Signet | Mana Vault | OUT: Useful ramp but slower than premium zero/one-mana acceleration and is being replaced as part of the fast-mana package. IN: Mana Vault adds three mana for one generic mana activation, enabling earlier Kaalia or a rapid recast. Low-cost acceleration increases the chance of a turn-two/three Kaalia and lets you recast or hard-cast threats. |
| Call of the Ring | Necropotence | OUT: A steady but slower value engine; replaced by stronger card-advantage engines that better support a high-power plan. IN: Necropotence offers much higher card volume; life total must be managed carefully. High-volume card advantage helps rebuild when Kaalia is removed and finds protection/payoffs. |
| Damn | Toxic Deluge | OUT: Flexible, but Toxic Deluge offers a cheaper and more scalable reset for clearing blockers while potentially preserving large threats. IN: Earlier, scalable reset that can clear blockers while potentially preserving the largest threats. Efficient interaction; broadens responses beyond combat and helps avoid being outraced. |
| Darksteel Mutation | Anguished Unmaking | OUT: Good commander answer, but the proposed package prioritizes broader instant-speed interaction and protection while retaining creature-based permanent removal. IN: Anguished Unmaking answers any nonland permanent at instant speed; costs 3 life and does not neutralize a commander indefinitely. Efficient interaction; broadens responses beyond combat and helps avoid being outraced. |
| Demonic Counsel | Demonic Tutor | OUT: Useful conditional tutor, but the proposed version uses broad tutors and multiple ETB creature tutors, reducing reliance on delirium/creature-type restrictions. IN: Unconditional access to the missing piece rather than depending on a Demon or delirium condition. Flexible access to the missing piece: acceleration, protection, a payoff, or interaction. |
| Entreat the Dead | Reanimate | OUT: Higher-variance, mana-intensive recursion. Reanimate and Animate Dead return a premium creature for far less mana. IN: Reanimate puts a premium creature onto the battlefield for one mana, at a life cost. Resilience: re-use a premium creature after removal/wipe, or exploit a graveyard target. |
| Fatal Push | Swords to Plowshares | OUT: Efficient with revolt, but limited by mana value if revolt is not enabled; Deadly Rollick can be free with Kaalia and exiles any creature. IN: One-mana exile and no revolt dependency; life gained by the opponent is usually less costly than leaving a threat. Efficient interaction; broadens responses beyond combat and helps avoid being outraced. |
| Ghirapur Orrery | Talisman of Indulgence | OUT: Symmetrical and can help opponents refill or make extra land drops; the replacement card engines are more reliable and less opponent-dependent. IN: Remove a symmetric engine that can benefit opponents and add low-cost colored acceleration. Low-cost acceleration increases the chance of a turn-two/three Kaalia and lets you recast or hard-cast threats. |
| Mind Stone | Lotus Petal | OUT: Reasonable two-mana rock, but the final list uses stronger acceleration density and color fixing; lower priority than the fast-mana package. IN: Lotus Petal can enable an early Kaalia turn, though it is a one-shot resource and poor as a late topdeck. Low-cost acceleration increases the chance of a turn-two/three Kaalia and lets you recast or hard-cast threats. |
| Orzhov Signet | Chrome Mox | OUT: Good card in isolation, but being replaced by more explosive acceleration as part of the package. IN: Chrome Mox can accelerate without waiting for a two-mana rock; imprint cost reduces card count. Low-cost acceleration increases the chance of a turn-two/three Kaalia and lets you recast or hard-cast threats. |
| Path of Peril | Flawless Maneuver | OUT: Three-mana board wipe with a conditional cleave mode; Toxic Deluge is cheaper, more flexible, and more likely to preserve your large creatures. IN: Rather than relying on a three-mana wipe, this can let your creatures survive destroy-based wipes when Kaalia is in play. Protect the attack/board at the moment opponents try to stop it; some effects cover only particular answer types. |
| Power Word Kill | Wear // Tear | OUT: Its restriction prevents targeting Angels, Demons, and Dragons — common creature types in Commander — making it a poor high-power answer despite low mana cost. IN: Power Word Kill cannot target many Angels/Demons/Dragons; Wear // Tear covers artifact/enchantment problems cheaply. Efficient interaction; broadens responses beyond combat and helps avoid being outraced. |
| Raise the Draugr | Animate Dead | OUT: Requires two creature cards to share a type and returns them to hand, not battlefield; Reanimate / Animate Dead create immediate battlefield impact. IN: Animate Dead returns a threat directly to the battlefield rather than to hand, at a low mana cost. Resilience: re-use a premium creature after removal/wipe, or exploit a graveyard target. |
| Rakdos Signet | Mox Diamond | OUT: Useful fixing, but the fast-mana package better supports turn-two/three Kaalia and more efficient recovery. IN: Mox Diamond can enable a very early Kaalia, but requires discarding a land; land count is increased to 35. Low-cost acceleration increases the chance of a turn-two/three Kaalia and lets you recast or hard-cast threats. |
| Read the Bones | The One Ring | OUT: Solid budget draw, but superseded by The One Ring and Necropotence for card volume in a no-budget, higher-power build. IN: The One Ring protects you for a turn on entry and supplies repeatable cards, though it accumulates life loss. High-volume card advantage helps rebuild when Kaalia is removed and finds protection/payoffs. |
| Savai Crystal | Talisman of Hierarchy | OUT: Three-mana mana rock is too slow for a four-mana commander whose success depends on tempo. IN: Two-mana fixing is materially faster than a three-mana rock. Low-cost acceleration increases the chance of a turn-two/three Kaalia and lets you recast or hard-cast threats. |
| Sign in Blood | Talisman of Conviction | OUT: Efficient but low ceiling versus Necropotence / The One Ring; the new card engines better refill after Kaalia is answered. IN: The deck has deeper card engines now; prioritize early colored mana to cast Kaalia and protection. Low-cost acceleration increases the chance of a turn-two/three Kaalia and lets you recast or hard-cast threats. |
| Strixhaven Stadium | Vampiric Tutor | OUT: A slow alternate win condition disconnected from Kaalia's strongest lines; its slot is better spent on protection or interaction. IN: Replace a slow alternate win condition with an instant-speed tutor to find haste, protection, interaction, or a payoff. Flexible access to the missing piece: acceleration, protection, a payoff, or interaction. |
| Terminate | Silence | OUT: Efficient, but Path to Exile and Swords to Plowshares cost one mana and exile; the deck also gains broader removal elsewhere. IN: Silence is a proactive tool to make the key turn safer; creature answers are covered by other one-mana/free/broad removal. Protect the attack/board at the moment opponents try to stop it; some effects cover only particular answer types. |
| Thrilling Encore | Rising of the Day | OUT: Can be a blowout after a wipe, but five-mana and opponent-dependent; this version prioritizes lower-cost resilience and an efficient reset. IN: Rather than waiting for a wipe to justify a five-mana spell, global haste for legendary creatures enables Kaalia to generate value immediately. Haste reduces the exposed window after Kaalia resolves; Greaves/Boots add different protection tradeoffs. |
| Unholy Annex // Ritual Chamber | Swiftfoot Boots | OUT: A playable slow value engine, but the deck already has better draw engines and needs lower-cost interaction/acceleration in those slots. IN: A draw engine that takes time is exchanged for protection/haste that determines whether Kaalia generates any value. Haste reduces the exposed window after Kaalia resolves; Greaves/Boots add different protection tradeoffs. |
| Vindicate | Teferi's Protection | OUT: Good universal removal but sorcery-speed at three mana; Anguished Unmaking is instant-speed and can answer a broader range of threats in the moment. IN: Trade sorcery-speed removal for a broad defensive effect that can blank a lethal swing or protect the board from a wipe. Protect the attack/board at the moment opponents try to stop it; some effects cover only particular answer types. |
| Wedding Ring | Dark Ritual | OUT: Symmetrical card advantage can help an opponent, and four mana is slow; The One Ring provides immediate protection and repeatable cards. IN: A slow symmetric engine is exchanged for explosive one-turn acceleration; this is a slot reallocation, not a like-for-like role upgrade. Low-cost acceleration increases the chance of a turn-two/three Kaalia and lets you recast or hard-cast threats. |
| Your Temple Is Under Attack | Lightning Greaves | OUT: Useful modal card, but dedicated protection spells in the proposed list are cheaper or broader and don't force a choice between defense and cards. IN: Replace a modal three-mana choice with zero-equip haste and shroud; remember shroud also prevents your own targeting. Haste reduces the exposed window after Kaalia resolves; Greaves/Boots add different protection tradeoffs. |

**Como ler os custos:** algumas trocas são equivalentes funcionais (ex.: remoção por remoção), outras são realocação deliberada de slots para priorizar velocidade/proteção/consistência. As cartas cortadas não são necessariamente ruins; elas passam a perder a disputa pelo espaço na proposta. Exemplos: Ghirapur Orrery é simétrica e pode reabastecer os oponentes; Wedding Ring divide valor com outro jogador; Infiltration Lens depende de ser bloqueada; Ghostly Prison é defensiva e não protege o ataque da Kaalia; Sorin Markov e várias criaturas caras têm impacto mais lento do que o plano exige.

## 9. Cartas de atenção e argumentos contra a V2

- **Kaalia continua sendo um ponto de falha:** botas e proteção ajudam, mas remoções antes da declaração de ataque, efeitos de sacrifício, exílio e respostas bem temporizadas podem interromper o motor.
- **Dano de combate não é garantido:** Ancient Dragons, Balefire, Lord of the Void e Hellkite Tyrant precisam conectar para suas principais recompensas. Escolha do oponente, avaliação de bloqueadores e proteção são críticas.
- **Fast mana não é gratuito:** Chrome Mox e Mox Diamond exigem recursos adicionais; Mana Vault pode causar pressão de vida se permanecer virada; Lotus Petal é de uso único; Dark Ritual é pontual e não corrige cores por si só.
- **Necropotence e The One Ring exigem gestão de vida/risco:** não ativar indiscriminadamente quando já estamos sob pressão ou sem meios de proteger o que compramos.
- **Tutores aumentam consistência, mas reduzem variedade e atraem interação:** priorizar tutor por necessidade, e não repetir a linha mais óbvia a cada partida.
- **Não é cEDH:** o plano ainda depende de combate e de uma comandante de quatro manas. A proposta é high-power casual/optimized casual, com capacidade de pressionar cedo, não uma afirmação de competitividade com listas cEDH.
- **Custo e identidade:** a base e algumas mágicas são caras e a lista fica menos casual/temática do que a CURRENT. A preferência por diversão e estilo ainda tem prioridade se o usuário decidir preservar alguma carta pessoal.

## 10. Regras de contagem, legalidade e estado

- CURRENT: 100 cards incluindo comandante; 34 terrenos.
- PROPOSED V2: 100 cards incluindo comandante; 35 terrenos.
- Singleton: verificado no decklist proposta, exceto cópias de terrenos básicos.
- Identidade: Mardu; a proposta não inclui cartas com identidade fora de branco/preto/vermelho.
- A proposta não foi testada, não foi comprada nem declarada implementada.
- A lista proposta foi comparada à lista oficial de banidas de Commander consultada em 14/10/2026; nenhum card proposto apareceu como banido em Commander. Verificar novamente no dia de jogar, pois a banlist pode mudar.
- No dashboard, a aba `Proposed Decklist` contém lista, função principal, condição de alvo Kaalia e status. `Card Matrix` mantém a lista recebida. `Upgrade Matrix` registra as mudanças. `Playtest Log` tem linhas para registrar 30 partidas.

## 11. Protocolo de playtest

Registrar pelo menos 10 partidas iniciais antes de refinar cartas uma a uma; 20–30 partidas darão uma leitura melhor, embora variância e pods diferentes sigam importantes. Priorizar:

1. **Mão inicial funcional:** cores, terreno, ramp e plano para Kaalia. Marcar mulligans e se houve queima de recursos para manter a mão.
2. **Turno da primeira Kaalia:** em quantas partidas ela entrou no turno 2/3/4? Em quantas sobreviveu até atacar?
3. **Primeiro ataque:** conseguiu conectar o gatilho? Qual carta foi colocada? O oponente escolhido fazia sentido?
4. **Valor realmente produzido:** ETB/removal, cartas encontradas, tesouros, dano, permanentes roubadas ou vida drenada. Separar impacto real do texto que não disparou.
5. **Falhas:** cartas caras presas na mão, fontes coloridas ausentes, Kaalia removida, proteção que não respondia ao efeito, alvo bloqueado ou ameaça removida antes do dano.
6. **Recuperação:** depois de wipe, quantos turnos até voltar a ameaçar? Reanimate/Animate Dead/Liesa realmente ajudaram?
7. **Fechamento:** como venceu, em qual turno e com quais cartas? Se a mesa sobreviveu ao primeiro ataque, a V2 conseguiu seguir jogando?

### Critérios de ajuste após teste
- Se Kaalia frequentemente entra mas não ataca, aumentar proteção/ímppeto e testar mulligan; não adicionar mais ameaças grandes.
- Se ataca, mas falta impacto, trocar apenas os alvos de pior desempenho por ETB/estáticos/combat-damage mais consistentes.
- Se faltam cartas, testar os motores de compra antes de adicionar mais tutores.
- Se a vida cai demasiado pela base de mana/Necropotence/Ring, substituir parte do pacote por fontes menos dolorosas, sem reduzir a contagem de cores sem análise.
- Não retirar ou manter uma carta a partir de uma única partida. Procurar padrões repetidos e separar azar de problema estrutural.

## 12. Fontes consultadas

- Scryfall — Kaalia of the Vast, MH3 #290: https://scryfall.com/card/mh3/290/kaalia-of-the-vast
- Oracle / ruling da Kaalia: https://mtg.wtf/card/2xm/204/Kaalia-of-the-Vast
- EDH.Wiki — Kaalia Aggro: https://edh.wiki/commanders/kaalia-of-the-vast/aggro/
- EDHREC — Kaalia of the Vast: https://edhrec.com/commanders/kaalia-of-the-vast
- EDHREC — Kaalia optimized lists: https://edhrec.com/commanders/kaalia-of-the-vast/optimized
- Wizards of the Coast — Commander rules / Comprehensive Rules: https://magic.wizards.com/en/rules
- Wizards of the Coast — Modern Horizons 3 Release Notes (ruling oficial da Kaalia): https://magic.wizards.com/en/news/feature/modern-horizons-3-release-notes
- Wizards of the Coast — Banned & Restricted Lists (Commander): https://magic.wizards.com/en/banned-restricted-list
- Scryfall — Angel of the Ruins: https://scryfall.com/card/mh2/4/angel-of-the-ruins
- Scryfall — Grand Abolisher: https://scryfall.com/card/m12/18/grand-abolisher
- Scryfall — Bloodletter of Aclazotz: https://scryfall.com/card/lci/92/bloodletter-of-aclazotz
- Scryfall — Abstruse Appropriation: https://scryfall.com/card/mh3/177/abstruse-appropriation
- Sower of Discord — Oracle text/type (Creature — Demon): https://mtg.wtf/card/c18/19/Sower-of-Discord

**Fatos verificados:** texto da comandante e regra de entrar atacando sem declarar atacante; contagem do deck/listas; tipos funcionais conforme textos de cartas referenciados.
**Análise própria:** classificação dos gargalos, encaixe das cartas, escolha dos grupos, trocas e notas.
**Hipóteses ainda não verificadas:** melhora em velocidade, frequência de ataque, recuperação e taxa de vitória da V2. Só partidas registradas podem validar essas projeções.

## 13. Próximos três passos

1. Revisar a lista proposta e confirmar se a direção high-power casual — com base de mana premium, fast mana e tutores — corresponde à experiência desejada.
2. Se aprovada, jogar 10 partidas registrando os campos de `Playtest Log`; não marcar nenhuma carta como TESTED antes disso.
3. Atualizar o Dashboard e este Handover com dados: cartas mortas, turno da Kaalia, sobrevivência ao primeiro ataque, impacto dos alvos e método de vitória.

## 14. Prompt de continuidade

> Continue a análise profunda do deck Kaalia of the Vast usando o Handover Master V2 e este Handover específico. Mantenha a lista enviada originalmente como CURRENT, esta lista como PROPOSED V2 e não declare a V2 como testada sem partidas registradas. Audite regras Oracle e custo de oportunidade antes de sugerir alterações; priorize os dados de playtest e preserve a separação entre fato, inferência e hipótese. Abra também `Kaalia_of_the_Vast_Dashboard_V2.xlsx` para manter as listas, trocas e métricas sincronizadas.