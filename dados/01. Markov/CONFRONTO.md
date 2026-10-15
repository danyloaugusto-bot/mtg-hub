# Confronto das análises de fora: Edgar Markov

Feito em 15/10/2026, no `/novo-deck`. Quem decide é o texto oficial da carta (Scryfall, pelo cache do projeto, e a API para as faces das cartas preparadas de 2026) e o plano do deck. Concordância entre análises não prova nada.

## O que foi lido

| Arquivo (em `entrada/`) | Autor | Data | Como usei |
|---|---|---|---|
| `analise-claude-edgar (1).md` | Claude, no app | 15/10 | Versão final, já com a auditoria. Substitui `analise-claude-edgar_fatia1.md` e `_fatia2.md`, que são as duas partes da versão anterior. |
| `auditoria-edgar.md` | Claude, outra conversa | 15/10 | Correções da análise acima; os números da forte final vêm daqui. |
| `Handover_Edgar_Analise_de_Deck (1).md` | Claude, no app | 15/10 | Resumo da análise final e o que o dono disse naquela conversa. |
| `Handover_Edgar_Markov_V2_Research_Deep_Review.md` e a planilha `Edgar_Markov_Dashboard_V2_Research_Deep_Review.xlsx` | outra IA (Handover Master V4) | 14/10 | A "V2", com 16 trocas propostas e uma rubrica de 10 critérios própria. |
| `ANALISE_Edgar_Markov_Vampire_Tribal.md` | outra IA | 14/10 | A "v1.5 Tribal Purista", com tiers, cortes e entradas, sem lista final. |
| `lista_forte_edgar (1).txt`, `lista_atalho_edgar (1).txt` | Claude | 15/10 | As duas listas propostas pela análise final (27 e 10 trocas). |
| `Markov - Beijo do Vampiro.txt`, `lista-archidekt-joeydh.txt`, `lista-moxfield-winterdragon.txt` | outros jogadores | | Listas de comparação. O Beijo do Vampiro é de um amigo do dono. |
| `textos_conferidos_edgar.md`, `dados_edgar_edhrec_precon.md`, `edhrec_edgar_percentuais.csv`, `precon_2017_vampiric_bloodlust.txt`, `scripts_edgar_v2.zip` | apoio da análise do Claude | | Textos, percentuais do EDHREC, o precon de 2017 e o simulador. |

A lista do deck é o `decklist.txt`: é a "CURRENT congelada" da V2 e o "hoje" da análise do Claude, carta por carta. 100 cartas em 99 linhas, todas reconhecidas pelo Scryfall e dentro da identidade Mardu.

## Onde as três concordam

- O motor é a eminência: funciona da zona de comando, e só com mágica de Vampiro **conjurada**. Vampiro barato e mais de uma mágica por turno valem mais aqui do que em quase qualquer deck.
- A base de mana é o ponto fraco: terrenos que entram virados (os três Temples, Nomad Outpost, Path of Ancestry, Savai Triome, Windbrisk Heights, Valgavoth's Lair), Temple of the False God e Crystal Grotto. As três trocam Temples por shocks e fetches, e Temple of the False God sai em todas.
- Saem em pelo menos duas das três: Faithless Looting, Temple of the False God, Crystal Grotto, Blood for the Blood God!, Descendants' Fury, Bloodlord of Vaasgoth.
- Entram em pelo menos duas: Sanctum Seeker, Indulgent Aristocrat (Claude e v1.5), Bloodletter of Aclazotz, Scheming Silvertongue, Three Tree City, Cavern of Souls, Blood Crypt, Godless Shrine, Sacred Foundry, Bloodstained Mire, Marsh Flats.
- O combo Vito, Thorn of the Dusk Rose + Bloodthirsty Conqueror fica como reserva, não como plano (Claude e V2; a v1.5 pede "zero combos óbvios" mas mantém as duas peças no topo da tier list).

## Onde divergem, e o que sigo

| Ponto | Claude (final) | V2 | v1.5 | Sigo |
|---|---|---|---|---|
| Pedras de mana (Sol Ring, Signet, Talismans) | Entram 4 na forte (Sol Ring, Arcane Signet, dois Talismans), medidas no simulador: Edgar até o turno 6 de 32% para 38% | "Sem rocks genéricos" é preferência confirmada do dono | "Sem Sol Ring e sem pedras genéricas" é diretriz do piloto | **Pergunta ao dono.** As duas análises de 14/10 registram a recusa; a de 15/10 diz que ele liberou tudo. É a decisão que mais mexe na lista. |
| Cartas de estimação | 16 pets: as 16 cartas foil, comandante incluído | "O acabamento *F* não indica PET" | "Sem petcards" | **Pergunta ao dono.** Nos outros painéis, foil não é estimação; estimação é marcada à parte (`fora_do_corte`). |
| Toxic Deluge | Sai (C): mata a própria horda | Fica | Fica, na remoção | Sigo o Claude: aqui a horda é o capital. Olivia's Wrath e Crippling Fear limpam só o lado deles. |
| Mirror Entity | Fica (A): é changeling, dispara a eminência e vira finalizador | Fica | Sai (prioridade máxima) | Sigo o Claude: o texto confirma que é mágica de Vampiro. |
| Bloodline Keeper | Fica (A) | Sai para Three Tree City | Tier S | Fica. A V2 tira uma fábrica de Vampiros voadores para pôr um terreno; Three Tree City pode entrar no lugar de um terreno fraco. |
| Vampire Socialite | Fica (B) | Sai para Bloodstained Mire | Tier A | Fica. Mesma lógica: a fetch entra no lugar de um Temple, não de um Vampiro de 2. |
| Olivia, Crimson Bride | Sai para Emeritus of Woe | Sai para Crossway Troublemakers | Tier A | Sai. As duas que trocam concordam no motivo: seis manas disputando o turno com o Edgar. |
| Coat of Arms e Kindred Charge | Saem para duas pedras | Coat sai para Black Market Connections; Charge sai para Bloodline Bidding | Charge é candidata a sair | Os dois saem; o que entra depende da resposta sobre pedras. |
| Vampire Nocturnus | Fica (pet), rende pouco | Sai para Bloodletter | Tier S | Depende da resposta sobre estimação. |
| Cemetery Gatekeeper | Fica (pet), rende pouco | Sai para Bloodline Recollector | Candidata a sair | Depende da resposta sobre estimação. |
| Tutores (Demonic, Vampiric, Emeritus) | Entram três | Emeritus "atrai foco" | Pega do Beijo "com cuidado" | Entram, se o dono confirmar que tutor não é problema; bracket e Game Changers estão liberados. |
| Número de terrenos | 34 na forte | 35 | 36 a 37 | Decido na avaliação, depois da resposta sobre pedras. |

## O que o texto oficial desmente

**Na análise do Claude:**

- **Emeritus of Woe.** Diz que ele se prepara de novo "no fim de qualquer turno em que duas criaturas morreram". O texto diz "at the beginning of **your** end step": só no seu turno. As duas mortes têm de acontecer no seu turno, o que pesa menos que o dito.
- **Emeritus of Woe, poder.** A auditoria tirou "5/4" por não estar conferido. Está conferido: 5/4 no Scryfall.
- **Bloodlord of Vaasgoth.** "Você conjura antes do combate" é incompleto: conjurado na segunda fase principal, depois do ataque, o bloodthirst funciona. A carta continua fraca (cinco manas, só vale para Vampiro conjurado depois de dano), mas pelo motivo certo.

**Na V2:**

- **Bloodlord of Vaasgoth "pode amplificar tokens depois de dano".** O texto dá bloodthirst só a mágica de criatura Vampiro conjurada; ficha não é conjurada e não ganha nada.
- **Emeritus of Woe, "no início da etapa final".** Falta o "your": é só o seu fim de turno.

**Na v1.5:**

- **Cover of Darkness na nota de Proteção.** É evasão (medo para o tipo escolhido), não proteção.
- **Mirror Entity entre os cortes de prioridade máxima.** É changeling: conta como mágica de Vampiro e dispara a eminência, além de ser finalizador com mana sobrando.
- **Invasion of New Capenna entre os cortes.** É remoção (sacrifica um artefato ou criatura seu, exila um artefato ou criatura do oponente), e o verso põe marcadores na tribo a cada ataque.
- **"Zero combos óbvios"**, com Vito e Bloodthirsty Conqueror no topo da tier list: as duas juntas são o combo mais conhecido do Edgar.

**Conferido e certo nas análises:** Lich-Knights' Conquest, Olivia, Crimson Bride, Descendants' Fury e Kindred Charge põem no campo e não disparam a eminência; Roaming Throne dobra a eminência só com o Edgar em campo ("another creature you control"); Akroma's Will escolhe os dois modos só com o Edgar em campo ("if you control a commander", regra 903.3d); Isshin dobra o ataque do Edgar, o Sanctum Seeker e a Shared Animosity; Dusk Legion Sergeant dá persist só a Vampiro que não é ficha; Coat of Arms é simétrico; Cemetery Gatekeeper também queima o dono; Skullclamp não mata ficha 1/1 com um lorde em campo.

## O que nenhuma viu

- **As cartas preparadas não disparam a eminência pela cópia.** A análise do Claude diz isso do Emeritus, mas vale para as quatro de 2026 (Emeritus, Stensian Sanguinist, Scheming Silvertongue, Bloodline Recollector): a cópia é feitiço ou instantânea. O Vampiro em si dispara, a cópia não.
- **Stensian Sanguinist pede dano de combate da criatura que ganhou toque mortífero.** Contra mesa de voadores ou com muitos bloqueadores, o Exsanguinate pode não carregar no turno.
- **Mana restrita a Vampiro.** Secluded Courtyard, Unclaimed Territory e Voldaren Estate só pagam Vampiro em qualquer cor. A lista tem 26 mágicas que não são Vampiro e pedem cor (Akroma's Will, Ruinous Ultimatum com RRWWWBB, Olivia's Wrath, Necropotence com BBB). A conta de fontes de cor precisa separar o que paga tudo do que só paga Vampiro.
- **Necropotence pula a compra**, e o deck tem Welcoming Vampire, Idol e Skullclamp, que compram fora do passo de compra. Combina, mas o Pact of the Serpent e a Bolas's Citadel ao lado pesam na vida: Necropotence, Citadel, Pact, shocks e fetches somam custo de vida que o simulador do Claude não conta (ele mesmo avisa).
- **Edgar, Charmed Groom e Olivia Voldaren são legendários Vampiros.** Isso mantém em campo a criatura que a Olivia, Crimson Bride devolve, mas ela sai na proposta de todo jeito.

## Para o dono decidir antes da avaliação

1. **Pedras de mana:** liberadas (Sol Ring, Arcane Signet, Talismans) ou fora, como dizem as análises de 14/10?
2. **Cartas de estimação:** quais são? As 16 foils (comandante incluído) ou outra lista?
3. **Tutores** (Demonic, Vampiric e o Emeritus de Woe, que traz um Demonic Tutor): podem entrar?
