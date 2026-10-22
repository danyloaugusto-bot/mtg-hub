# HANDOVER ESPECÍFICO — KEN, BURNING BRAWLER

**Versão:** V3.0 — auditoria integral refeita em 2026-10-08

## 1. Identidade

**Ken, Burning Brawler — Boros Voltron + Equipment + Extra Combats + combat-damage spell engine.**

O projeto usa exclusivamente o nome **Ken, Burning Brawler**. Aisha of Sparks and Smoke é apenas o nome de referência usado por algumas bases de dados para a mesma carta.

## 2. Plano central

**CONNECT → SURVIVE → CONVERT → REPEAT.**

- CONNECT: evasão, remoção de bloqueadores e equipamentos.
- SURVIVE: proteção de Equipment + proteção não-Equipment.
- CONVERT: Shoryuken, Glamdring, draw, mana e mágicas gratuitas.
- REPEAT: combates extras diretos, motores de main phase e efeitos atrasados.

## 3. Correção crítica da V2

A auditoria V3 corrige um erro estrutural da análise anterior: nem toda sorcery que diz 'after this main phase' cria um combate adicional quando lançada pelo Shoryuken durante o combate. O CR 500.8 trata fases extras como sendo adicionadas após a fase especificada; quando não há uma main phase aplicável naquele momento, essa parte do efeito não cria o combate. citeturn16view0

Isso altera a classificação de Relentless Assault, Seize the Day, Resurgence, Waves of Aggression e Overpowering Attack. Elas continuam jogáveis e importantes, mas não são 'Ken → cast grátis → combate imediatamente' por si mesmas.

World at War recebe tratamento especial por Rebound: o cast via Ken é atrasado, e o cast no upkeep pode configurar o combate posterior. citeturn5search0

## 4. Métricas reconciliadas

- 100 cartas: 1 comandante + 99 maindeck.
- Current: **31 physical lands + 2 MDFCs = 33 land-capable**.
- V3: **32 physical lands + 2 MDFCs = 34 land-capable**.
- Current nonland average MV: **3.09**.
- V3 nonland average MV: **2.86**.
- Current score: **7.8/10**.
- V3 projected score: **8.8/10**.

## 5. Pet Cards — LOCK

**Lightning Bolt** e **Vikya, Scorching Stalwart** são PET LOCK por decisão do projeto. Não entram em cortes.

## 6. Slash the Ranks

**KEEP / CORE SUPPORT.** O texto é 'Destroy all creatures and planeswalkers except for commanders.' Portanto, Ken permanece. Isso torna Slash the Ranks uma ferramenta de remoção de bloqueadores particularmente alinhada ao plano. citeturn2search18

## 7. Cuts V3

- **OUT — Risk Factor:** Replace opponent-controlled choice with deterministic card advantage.
- **OUT — Reyav, Master Smith:** Reduce redundant double-strike support; use direct protection/consistency instead.
- **OUT — Battle Angels of Tyr:** Remove a strong but off-engine standalone creature.
- **OUT — Everflowing Chalice:** Prefer more direct, lower-opportunity-cost consistency pieces.
- **OUT — Fall of the First Civilization:** Too slow for the proactive Ken plan.
- **OUT — Insurrection:** Eight mana is excessive for a deck whose commander is the primary finisher.
- **OUT — Danitha Capashen, Paragon:** Medium-impact creature slot can become direct protection/tutor/draw.
- **OUT — Grim Reaper's Sprint:** Main-phase-dependent extra combat plus five-mana Aura is less efficient than direct combat engines.
- **OUT — Response // Resurgence:** Versatile, but MV 7 and main-phase dependence on Resurgence reduce Ken synergy.
- **OUT — Opal Palace:** Replace low-impact commander-counter utility with an untapped Boros source; V3 also increases net land count.

## 8. Adds V3

- **IN — Boros Charm:** Indestructible board protection or double strike finisher.
- **IN — Mother of Runes:** Repeatable protection and evasion for Ken.
- **IN — Esper Sentinel:** Cheap recurring card advantage.
- **IN — Enlightened Tutor:** Tutors Equipment, protection enchantments and key engines.
- **IN — Mizzix's Mastery:** Recurs a high-impact instant/sorcery; can rebuild a spent graveyard package.
- **IN — Temur Battle Rage:** Double strike plus trample can convert one connection into lethal commander damage.
- **IN — Angelfire Ignition:** Excellent Ken-cast sorcery: counters, haste, trample, lifelink and indestructible.
- **IN — Deflecting Swat:** Free protection/interference while Ken is on the battlefield.
- **IN — Clifftop Retreat:** Untapped dual with basic-land support.
- **IN — Inspiring Vantage:** Untapped early-game dual; improves tempo.

## 9. Extra Combats — classificação obrigatória

### Phase-independent / direct
Raiyuu; Karlach; Aurelia; Port Razer; Fear of Missing Out; Genji Glove; Hexplate Wallbreaker; Great Train Heist.

### Main-phase dependent
Aggravated Assault; Grim Reaper's Sprint; Overpowering Attack; Relentless Assault; Response // Resurgence; Seize the Day; Waves of Aggression.

### Delayed / special
World at War.

Great Train Heist pode criar o combate durante combat phase, mas é um instant e portanto não é uma spell que Ken pode castar pelo Shoryuken. citeturn3search8

Raiyuu e Karlach são especialmente importantes porque seus gatilhos adicionam o combate diretamente após a fase atual. citeturn3search3turn3search5

Fear of Missing Out também cria o combate diretamente após a fase atual quando o requisito de delirium é atendido. citeturn7search12

## 10. Core audit

- **Commander:** Ken = LOCK.
- **Draw:** Sram, Akiri, Sword of Fire and Ice, Faithless Looting; V3 adiciona Esper Sentinel.
- **Protection:** Boots, Plates, Hammer, Sigarda's Aid; V3 adiciona Boros Charm, Mother of Runes, Deflecting Swat.
- **Equipment tutors:** Fighter Class, Open the Armory, Axgard Armory; V3 adiciona Enlightened Tutor.
- **Extra combat creatures/equipment:** Raiyuu, Karlach, Aurelia, Port Razer, Genji Glove, Hexplate Wallbreaker, Fear of Missing Out.
- **Removal:** Slash the Ranks, Promise of Loyalty, Single Combat, Divine Reckoning and targeted answers.

## 11. Win conditions

Primary: **21 commander damage from Ken**. The current Comprehensive Rules confirms this as the Commander loss condition. citeturn16view1

Secondary/emergency: Chandra's Ignition, double-strike bursts, and table-wide damage after Ken is sufficiently large.

## 12. Watchlist

- **Teferi's Protection** — Top-tier protection against wipes/removal. | Priority: HIGH | Status: Test
- **Grand Abolisher** — Protects the decisive Ken turn. | Priority: HIGH | Status: Test
- **Sunforger** — Reusable instant toolbox in an Equipment shell. | Priority: HIGH | Status: Test
- **Duelist's Heritage** — Repeatable double strike and political utility. | Priority: HIGH | Status: Test
- **Swords to Plowshares** — Premium one-mana creature removal. | Priority: HIGH | Status: Test
- **Loran's Escape** — Cheap protection redundancy. | Priority: MEDIUM | Status: Test
- **Kediss, Emberclaw Familiar** — One successful Ken hit can damage all opponents. | Priority: MEDIUM | Status: Test
- **Rugged Prairie** — Strong Boros fixing with utility lands. | Priority: MEDIUM | Status: Test
- **Sacred Foundry** — Untapped dual source. | Priority: MEDIUM | Status: Test
- **Spectator Seating** — Excellent multiplayer untapped dual. | Priority: MEDIUM | Status: Test

## 13. Handover compliance

- **100 cards / 1 commander:** PASS — 100 total; 1 Ken + 99 maindeck.
- **Singleton:** PASS — No repeated nonbasic/nonland card names; basics are the only duplicates.
- **Color identity:** PASS — All cards fit RW/colorless identity.
- **Land count reconciled:** PASS — Current 31 physical + 2 MDFCs; V3 32 + 2.
- **MV / curve:** PASS — Current 3.09; V3 2.86 for nonlands.
- **Eight groups:** PASS — Every card has a primary group from the eight user-defined categories.
- **Card-by-card audit:** PASS — 100 rows including commander.
- **Tier List:** PASS — S/A/B/C/D plus LAND.
- **Cuts:** PASS — 10 explicit cuts with reasons.
- **Upgrades:** PASS — 10 explicit adds with reasons.
- **V3:** PASS — Validated at exactly 100 cards.
- **Watchlist:** PASS — 10 future candidates.
- **Sources:** PASS — Rules, Scryfall, EDHREC and Wizards release notes recorded.
- **Rules interactions:** PASS — Timing of Ken/Shoryuken and extra combats explicitly audited.
- **Pet cards:** PASS — Lightning Bolt and Vikya are PET LOCK.
- **Slash the Ranks:** PASS — KEEP; commanders are explicitly exempt.
- **Mana consistency:** PASS — V3 adds one net physical land rather than cutting mana for marginal spells.
- **No goodstuff drift:** PASS — Every V3 addition maps to a documented deck function.

## 14. Sources

- **Comprehensive Rules 2026-06-19** — https://media.wizards.com/2026/downloads/MagicCompRules%2020260619.pdf — Rules authority; Commander 903; phase creation 500.8 — 2026-10-08
- **Magic Commander** — https://magic.wizards.com/en/formats/commander — Commander format / commander damage — 2026-10-08
- **Scryfall — Ken/Aisha** — https://scryfall.com/card/sld/430/aisha-of-sparks-and-smoke — Oracle text / naming — 2026-10-08
- **EDHREC — Ken** — https://edhrec.com/commanders/ken-burning-brawler — Current commander data — 2026-10-08
- **EDHREC — Ken Extra Combats** — https://edhrec.com/commanders/ken-burning-brawler/extra-combats — Extra-combat archetype data — 2026-10-08
- **EDHREC — Ken Equipment** — https://edhrec.com/commanders/ken-burning-brawler/equipment — Equipment data — 2026-10-08
- **Wizards — Duskmourn Release Notes** — https://magic.wizards.com/en/news/feature/duskmourn-house-of-horror-release-notes — Fear of Missing Out timing — 2026-10-08
- **Wizards — Commander Legends Release Notes** — https://magic.wizards.com/en/news/feature/commander-legends-battle-for-baldurs-gate-release-notes-2022-06-01 — Karlach timing / Commander rules — 2026-10-08
- **Wizards — Outlaws Release Notes** — https://magic.wizards.com/en/news/feature/outlaws-of-thunder-junction-release-notes — Great Train Heist timing — 2026-10-08
- **Wizards — Fallout Release Notes** — https://media.wizards.com/2024/downloads/PIP_Release_Notes/EN_MTGPIP_Release%20Notes_20240108.pdf — Grim Reaper's Sprint / Inventory Management — 2026-10-08
- **Wizards — Assassin's Creed Release Notes** — https://magic.wizards.com/en/news/feature/assassins-creed-release-notes — Fall of the First Civilization — 2026-10-08
- **User Handover — General** — Conversation file — Global methodology / requirements — 2026-10-08
