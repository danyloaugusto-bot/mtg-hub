**Análise aprofundada – Vito, Thorn of the Dusk Rose**  
**Mono-black Vampiros + Lifegain/Drain • Consistência, não só combo**

O deck já ganha. O que falta para subir de “forte e conhecido” para “consistente” não é mais tutor nem mais combo. É fazer o plano de drenar funcionar **toda partida em que o combo não aparece**, e fazer o combo ser a válvula, não a única forma de fechar.

Fontes usadas: [EDHREC Lifegain](https://edhrec.com/commanders/vito-thorn-of-the-dusk-rose/lifegain) (~880–945 decks), página geral do Vito (~4.900 decks), [EDH.Wiki](https://edh.wiki/commanders/vito-thorn-of-the-dusk-rose/) e oracle/rulings do [Scryfall](https://scryfall.com/card/m21/127/vito-thorn-of-the-dusk-rose). Inclusão abaixo é da tag Lifegain, salvo quando eu marcar “geral”.

---

### 1.1. O que o deck realmente é

**Vito** custa {2}{B}, 1/3.  
- Sempre que você **ganha vida**, um oponente alvo perde essa quantidade.  
- {3}{B}{B}: suas criaturas ganham lifelink até o fim do turno.

Três rulings que mudam a construção:

1. O drain **não é dano**. Lifelink no Vito não cria loop sozinho.  
2. Cada criatura com lifelink que causa dano de combate é **um evento separado**. Dois vampiros conectando = dois triggers, e você pode mirar jogadores diferentes.  
3. “Ganhe X de vida” num único efeito (Gary, Exsanguinate, Crypt Incursion) é **um** evento só. Vito dispara uma vez, por um alvo.

**Combo real (não é “Vito sozinho”):**

| Peça A (você ganha quando eles perdem) | Peça B (eles perdem quando você ganha) | O que acontece |
|---|---|---|
| Exquisite Blood | Vito | Loop de mesa. Qualquer lifegain ou lifeloss de 1 fecha. |
| Exquisite Blood | Sanguine Bond | O mesmo, **sem** o comandante. |
| Exquisite Blood | Bloodthirsty Conqueror | O mesmo. |
| Exquisite Blood | Enduring Tenacity | O mesmo, e Tenacity volta do cemitério. |
| Exquisite Blood | Defiant Bloodlord | **Não** é loop de mesa. Bloodlord só drena **um** oponente. Mata uma pessoa e para, se os outros não perderem vida. |

Você já tem três Bonds (Vito, Conqueror, Tenacity) e o Blood. Falta o quarto, **Sanguine Bond**, que está em **75–79%** das listas. É a inclusão mais alta que você não joga. Sem ela, um único exílio em Exquisite Blood + remoção repetida do Vito deixa o deck “só” de valor — e hoje o valor ainda está misturado com vampiro de coleção.

**Linhas que ganham sem loop** (é aqui que a consistência mora):

- **Blood Tribute + Vito ou qualquer Bond.** Oponente com vida par perde metade, você ganha isso, o Bond devolve o mesmo valor. 40 de vida vira 0. 41 vira 1. É execução de um jogador, não da mesa. Por isso é político: você escolhe o problema.
- **Exsanguinate X com Bond.** Cada oponente perde X, você ganha 3X (mesa de 4). O Bond escolhe **um** deles e tira mais 3X. Um Exsanguinate de 7 com Vito em mesa cheia tira 7/7/28. Não é infinito e não pede que ninguém deixe o enchantment resolver “porque é combo”.
- **Gary.** Devotion alta (Coffers, Urborg, Nykthos, Crypt Ghast, Monument) transforma Gary em drain duplo no alvo do Vito. É a wincon mais honesta do mono-black e já está na lista — certo.
- **Bloodletter of Aclazotz.** Dobra a perda de vida. Tribute, Exsanguinate, Gary e até o ping do Blood Artist dobram. Não é loop; é multiplicador. Correto mantê-lo.
- **Hatred não dispara Vito.** É custo de vida, não ganho. Só vira lifegain se a criatura já tiver lifelink e o dano conectar. Petcard de fechamento de combate, não de drain. Continua, mas não conte ela como sinergia.

Playgroup.gg marca o Vito com ~31% de winrate em mais de mil jogos e vitória média no turno 8. Isso é saudável para um comandante de mesa, não de cEDH. O teto do seu deck é mais alto que essa média por causa de Necro, tutors e Coffers. O piso é mais baixo quando a mesa responde o Vito e você fica com vampiros que não ganham vida.

---

### 1.2. Pontos fortes, com o que já está certo

| Eixo | Nota | Por que essa nota, não 10 |
|---|---|---|
| Comandante | 9.0 | Sempre disponível, 3 de mana, temático. A mesa joga contra ele desde a abertura. |
| Redundância de Bond | 8.0 | Três cópias. A quarta (Sanguine Bond, 79%) é o buraco mais claro do formato. |
| Wincons não-infinitas | 8.3 | Tribute, Exsanguinate (79%), Gary (74%), Hailfire, Bloodletter. Falta densidade de drain **pequeno e repetido**. |
| Tutores | 9.4 | Demonic, Vampiric, Grim, Beseech, Insatiable Avarice. O problema não é achar a carta; é **qual** carta você busca. |
| Draw de mão | 9.2 | Necropotence, Necrodominance, Black Market Connections, Top, Castle, War Room. Poucos Vitos têm isso. |
| Ramp preto | 8.8 | Ritual, Sol Ring, Signet, Medallion, Crypt Ghast, Coffers, Stronghold, Nykthos, Urborg, Citadel, K'rrik, Ancient Tomb, Lens. |
| Remoção | 8.0 | Wipes bons (Deluge, Damnation, Edict) e spot caro porém eficiente (Rollick, Pact, Feed, Withering, Hagra). Pouca remoção que **também ganha vida**. |
| Proteção do Vito | 6.2 | Rebirth, Mischief, Rollick. Sem bota, sem Ghostform, sem regeneração barata. Comandante de 3 mana conhecido morre todo jogo. |
| Densidade de lifegain | 7.4 | Os bons estão (Aetherborn, Dire Moon, Creeping Bloodsucker, Scavenger, Blight-Priest, Malakir Bloodwitch). Os 65% (Nighthawk) e 58% (Sangromancer) não estão. |

---

### 1.3. Onde a consistência quebra

**1. Metade dos vampiros não paga o trigger.**  
Vito não se importa com “é vampiro”. Ele se importa com “você ganhou vida”. Captivating Vampire, Bloodline Keeper, Indulgent Aristocrat, Markov Baron, Sanguine Spy, Preacher, Kalitas e até Vein Ripper são cartas boas em tribal genérico e cartas mornas aqui. Vein Ripper ganha jogo por corpo e ward, então é a última dessa lista a sair. As outras ocupam o turno em que deveria entrar Nighthawk, Sangromancer ou Sanctum Seeker.

**2. O tutor está viciado no combo.**  
Com Demonic, Vampiric, Grim e Beseech, você acha Exquisite Blood quase sempre. A mesa sabe disso e segura enchantment removal. Linha mais consistente, na ordem:

1. Se o Vito não está em campo e você não tem outro Bond: busque **Vito ou Sanguine Bond / Tenacity**, não o Blood.  
2. Se você tem Bond e a mesa está em 30–40: busque **Blood Tribute** (um jogador) ou **Exsanguinate / Gary** (mesa).  
3. Exquisite Blood só quando você já tem Bond em campo **e** mana para proteger o stack, ou quando a mesa não tem mais resposta.  
4. Se a mão está vazia: Necro, não o combo.

Isso sozinho sobe a taxa de vitória mais do que trocar três criaturas.

**3. Falta o drain miúdo.**  
Combo e X-spells ganham o turno 8. Entre o turno 3 e o 7 o deck precisa pingar sem se declarar. Sangromancer (3 de vida por criatura que morre ou por descarte — com Vito, cada morte é 3 de drain), Ayara (ETB preto: perde 1, ganha 1), Blood Artist (já está), Crypt Incursion (3 por criatura no cemitério, instantâneo) e Tendrils of Corruption (mata e ganha vida igual ao número de pântanos) são exatamente isso. Incursion está em 37% e Tendrils em 31% das listas de lifegain — não são spice.

**4. Enchantment removal é o counter do deck.**  
Feed the Swarm e Withering Torment são as duas respostas a Rest in Peace, Leyline, e ao próprio Blood se você precisar reciclar. Não corte. O que falta é **não colocar o Blood cedo**. Enduring Tenacity mitiga isso porque volta. Sanguine Bond não volta; por isso ele é redundância, não plano A.

**5. Extraplanar Lens em 20 Snow Swamps é teto alto e piso baixo.**  
Se a Lens resolve, Coffers/Ghoul/Nykthos ficam absurdos e Exsanguinate mata. Se a Lens é destruída no turno em que entra, você jogou um snow land que não faz nada e perdeu um card. Para consistência eu manteria a Lens — o teto é real — mas não construiria mais nada em cima de “snow importa”. Não adicione mais payoffs de snow.

**6. Draw de vampiro não é o gargalo.**  
Phyrexian Arena (58%) e Sign in Blood (59%) são certos na média das listas porque a média não tem Necropotence. Você tem. Não enfraqueça Necro para caber Arena. O gás que falta é **vida ganhada enquanto você compra**, não mais um “compre 2, perca 2”.

---

### 1.4. Cortes, um a um

Prioridade máxima — tiram consistência:

1. **Mikokoro, Center of the Sea.** Cada ativação compra para a mesa. Com Necro você já está na frente de cartas. O land deveria ser pântano ou utilitário que te ajuda sozinho (Bojuka já não está; Takenuma ou um segundo utility de recursão vale mais).  
2. **Sorin Markov.** Seis de mana, não ganha vida, não é vampiro em campo que ataca com lifelink, e “vida vira 10” sem Bond deixa o jogador em 10. Com Bond, Tribute já mata a partir de vida par por menos mana relativa e ainda te enche de vida. É o pet que eu cortaria primeiro se o objetivo é vitória, não coleção.  
3. **Throne of Eldraine.** Monarch te torna o alvo justo quando você quer parecer “o drain político”, não “o combo”. Castle Locthwain e War Room já compram sem coroa.  
4. **Indulgent Aristocrat.** Sacrificar vampiro para dar +1/+1 não ganha vida. Sangromancer no mesmo slot ganha 3 por morte.  
5. **Markov Baron.** Lord de estatística. O deck não fecha por dano de combate sem lifelink. Sanctum Seeker, no mesmo custo emocional de tribal, drena e ganha 1 por vampiro atacante.

Prioridade alta:

6. **Sanguine Spy.** Connive é seleção. Você já tem Top, tutors e Necro.  
7. **Bloodline Keeper.** Quatro de mana, sem lifelink, token sem lifelink. Lento para um comandante que quer o turno 3.  
8. **Captivating Vampire.** Roubar criatura é forte e icônico. Não dispara Vito, não drena, e pede mana todo turno. Se for intocável por nostalgia, tire o Baron e o Aristocrat antes e aceite que este slot é coleção.  
9. **Preacher of the Schism.** O lifegain é pequeno e condicional (você atacando e já tendo mais vida). Nighthawk faz o trabalho todo turno, com deathtouch, por um mana a menos.  
10. **Qarsi Revenant.** Renew é proteção cara e única. Malakir Rebirth já cobre o “não deixe o Vito ir embora”.  

Segura, mesmo parecendo “vampiro solto”: **Vein Ripper** (corpo que a mesa tem que responder), **Kalitas** (exile + lifelink nos zumbis, ganha vida de verdade), **Henrika** (modal, lifelink possível), **Sorin, Imperious Bloodlord** (bota vampiro em campo e dá lifelink; 5.0x lift na tag). **Hatred, Exsanguinate e New Blood ficam.** Exsanguinate nem é pet fraco: é a segunda carta mais jogada do comandante.

---

### 1.5. Entradas, na ordem em que aumentam vitória

**Altíssima — estas seis mudam o piso do deck**

1. **Sanguine Bond** (79%, maior buraco). Quarto Bond. Combo sem Vito. Mesmo texto que o comandante, então Blood Tribute e Exsanguinate não apodrecem quando ele morre.  
2. **Vampire Nighthawk** (66%). Três de mana, flying, deathtouch, lifelink. É o corpo que você desce no turno em que o Vito já está ou vai entrar. Cada hit é drain.  
3. **Sangromancer** (58%, 2.1x). Não é vampiro. Entra mesmo assim. Cada criatura que morre te dá 3 de vida; cada descarte adversário também. Com Vito, um board wipe seu (Damnation, Deluge, Meathook) drena o alvo em 3 por corpo. É o motivo de o wipe deixar de ser “eu reseto e fico sem gás”.  
4. **Ayara, First of Locthwain** (~42%). Todo preto que entra: oponente perde 1, você ganha 1, Vito drena de novo se estiver em campo. Sacrifício: compre. É engine de meio de jogo, não combo.  
5. **Crypt Incursion** (37%). Instantâneo. Três de vida por criatura no cemitério **deles ou seus**, depois exílio. Com 6 criaturas, são 18 de vida e 18 de drain num alvo. Mata alguém que já foi trabalhado pelo Tribute sem pedir o Blood.  
6. **Sanctum Seeker** (39%, ~5.6x lift). Sempre que um vampiro seu ataca, cada oponente perde 1 e você ganha 1. Três vampiros atacando com Vito: a mesa perde 1 cada, você ganha 3, e o Vito joga esses 3 num alvo. É a carta que faz o plano “mostrar força no meio do jogo” existir em campo, não só na fala.

**Alta — consistência de curva e de remoção**

7. **Tendrils of Corruption** (31%). Mata criatura, ganha vida igual aos pântanos. Com Coffers/Urborg isso é um drain de 8–12 que ainda remove. Melhor que um Doom Blade seco.  
8. **Cordial Vampire** (32%, 4.9x). Quando um vampiro morre, os outros tomam +1/+1. Com Sangromancer e Blood Artist, morte vira três recursos. Lord que sobrevive a troca.  
9. **Bloodthirsty Aerialist** (44%, 4.3x). Flying que cresce com a vida ganha. Não é drain, é o relógio de combate para quando o alvo do Vito já está baixo e você não quer gastar o combo.  
10. **Whip of Erebos.** Lifelink no time sem pagar {3}{B}{B}, mais reanimação. A ativação do Vito custa 5 e some no fim do turno; a Whip fica. É o que torna Hatred e os vampiros sem lifelink nativo jogáveis de verdade.  
11. **Veinwitch Coven** (41%). Sempre que você ganha vida, pode pagar {B} e trazer um vampiro ou corpo de poder ≤2 do cemitério. Com Vito em campo, cada gain vira drain **e** recursão.  
12. **Lightning Greaves ou Swiftfoot Boots.** EDHREC dá sinergia negativa porque não são “carta de lifegain”. Para consistência de um comandante que morre, haste + shroud no turno em que você vai ativar lifelink ou segurar o Vito para o Exsanguinate vale mais do que o oitavo vampiro mediano. Uma só.

Não entra, de propósito: **Aetherflux Reservoir**. Ganha a partida e apaga a política. A mesa passa a te tratar como combo no turno 4 mesmo sem Exquisite Blood. **Phyrexian Arena** também não: Necro já compra mais. **Sheoldred** ganha jogo e não é o tema; só se a mesa for tão rápida que você precisa de um corpo que ganha sozinho.

---

### 1.6. Como jogar para ganhar mais, com a lista atual e com a lista nova

**Early (turnos 1–3).**  
Ritual / Sol Ring / Ancient Tomb para Vito no turno 2 ou 3, mas só se houver lifegain no mesmo turno ou no seguinte (Aetherborn, Dire Moon, Creeping Bloodsucker, Nighthawk). Vito sozinho em mesa vazia é um 1/3 que come remoção. Se a mão é tutor + Ritual e nada de vida, busque Necro ou Crypt Ghast, não Exquisite Blood.

**Mid (turnos 4–7).**  
Escolha um jogador. Tribute, Bloodletter e os triggers pequenos vão nele. Os outros recebem o ping simétrico (Gary, Exsanguinate pequeno, Sanctum Seeker) para ninguém se sentir seguro, mas o fechamento é público: “aquele ali é o problema”. Isso é a política que você descreveu, e ela só funciona se você **pode** matar uma pessoa sem loop. Hoje isso depende demais de Tribute e Hailfire. Com Incursion, Tendrils, Sangromancer e Seeker, a ameaça existe em campo.

Não deixe Exquisite Blood na mesa “só para assustar” se você não tem Bond. É um 5/5 de mana que come o counter e depois você não tem a peça. Blood na mão é dissuasão melhor do que Blood em campo sem proteção.

**Late.**  
Ordem de fechamento, da mais limpa para a mais odiada:

1. Bond já em campo + Exsanguinate / Gary / Tribute.  
2. Bloodletter em campo, depois qualquer uma dessas. Dobrar a perda muda a conta: Tribute em 40, dobrado, nem precisa do segundo hit do Vito para matar.  
3. Whip ou ativação do Vito + ataque com lifelink, drains separados por criatura.  
4. Hatred num bicho com lifelink que não pode ser bloqueado, se a política já falhou.  
5. Exquisite Blood, só com Bond vivo e mana para Imp’s Mischief / Rollick / Rebirth.

Se três pessoas ainda estão altas e você não tem X-spell, não force o combo no escuro. Compre com Necro, segure o Blood, mate o jogador que tem a resposta.

---

### 1.7. Nota

**Atual: 8.4 / 10.**  
Mana, tutors, Necro, três Bonds e as duas melhores X-spells já colocam o deck acima da média do comandante. A nota para abaixo de 9 porque ~8–10 slots não ganham vida, porque Sanguine Bond / Nighthawk / Sangromancer não estão, e porque a linha de tutor empurra a mesa a jogar contra o combo o tempo todo.

**Depois das 10 trocas abaixo: 9.1 / 10.**  
Não chega a 9.5 sem mudar de identidade (Ad Nauseam, Peer into the Abyss, Aetherflux, mais fast mana, menos vampiro). Isso deixaria de ser o seu primeiro deck. 9.1 é o teto honesto de “vampiro que drena todo jogo e comboia quando precisa”.

**10 cortes:** Mikokoro, Sorin Markov, Throne of Eldraine, Indulgent Aristocrat, Markov Baron, Sanguine Spy, Bloodline Keeper, Preacher of the Schism, Qarsi Revenant, Captivating Vampire.  
**10 entradas:** Sanguine Bond, Vampire Nighthawk, Sangromancer, Ayara, Crypt Incursion, Sanctum Seeker, Tendrils of Corruption, Cordial Vampire, Whip of Erebos, Veinwitch Coven.  
Se Captivating for intocável, troque a entrada da Coven por nada e corte o Spy no lugar — a Coven é a mais substituível das dez.

---

### Handover

**Identidade:** mono-black de vampiros que ganham vida e drenam. Combo Exquisite Blood é recurso de fim de jogo, não o plano que você tutora no turno 3.  
**Early:** Vito só acompanhado de lifegain. **Mid:** um alvo, drain repetido, política em cima de ameaça real. **Late:** Tribute / Exsanguinate / Gary / Bloodletter; loop por último.  
**Notas:** Comandante 9.0 | Bonds 8.0 | Wincons fair 8.3 | Tutores 9.4 | Draw 9.2 | Ramp 8.8 | Remoção 8.0 | Proteção 6.2 | Densidade de lifegain 7.4.  
**Nota atual 8.4 → potencial 9.1** com as dez trocas e a mudança de prioridade de tutor.

