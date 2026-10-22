# Lathril, Blade of the Elves — Handover V2: Deep Review

**Status:** researched proposal, not tested in games  
**Review date:** 13 October 2026  
**Commander:** Lathril, Blade of the Elves  
**Colors:** Golgari (black/green)  
**Build objective:** powerful Elf tribal with a distinct identity: token generation, token payoffs, and repeatable Lathril activations—not merely generic Elfball.

> **Important:** “7.5/10 current” and “9.0–9.2/10 V2 projected” are structured deckbuilding estimates, not measured win rates, a universal Commander rating, or playtest results. The exact ceiling depends heavily on the local pod, mulligan discipline, interaction density, and how much tutor/fast-mana consistency is desirable.

## 1. Executive verdict

The previous review moved too quickly and gave the current list too generous an initial rating. This review uses three distinct lenses:

1. **Internal deck logic:** curve, role density, redundancy, card quality, protection, interaction, and the way cards support one another.
2. **External benchmark:** the EDHREC “Optimized” Lathril list, the Elf-filtered optimized list, and the recent 2026 Lathril upgrade article. These are comparison points, not instructions to copy another deck.
3. **Actual evidence still missing:** games played with this exact list. Until those exist, every score for the proposed build is a projection.

**Current list: 7.5/10 structural estimate.** It already has excellent mana engines and real closing power, but it is slower than its best cards suggest. The main weaknesses are too few turn-one mana Elves, limited protection, several expensive or conditional slots, and not enough conversion of token quantity into cards and damage.

**V2 proposal: 9.0–9.2/10 projected for high-power casual.** The 16 one-for-one changes tighten the opening turns, add the uniquely powerful Dionus + Lathril interaction, and allow tokens to generate cards and noncombat damage as well as combat pressure. The proposal retains Lathril, Seedborn Muse, Staff of Domination, Umbral Mantle, the core tribal makers, and the multiple combat/drain paths.

**What would be needed to justify 9.5+?** More selection/tutor density and table-specific protection, validated through play. The external optimized EDHREC benchmark includes multiple tutors in addition to Finale of Devastation, as well as a greater concentration of one-mana Elves and protection. Adding all such cards can improve consistency, but also risks making the deck more repetitive and less distinctive. See “Optional high-power tuning module” below.

## 2. Deck identity and priorities

### The intended play pattern

- **Early game:** produce mana before the table develops; deploy Elves that scale with the number of Elves or convert the board into mana.
- **Midgame:** create a wide board while establishing one or more engines—Lathril, Dionus, Seedborn Muse, a mana Elf, Staff of Domination, Umbral Mantle, Skullclamp, or a token payoff.
- **Closing turns:** choose the line that best fits the board: Lathril’s life-loss ability, combat with Craterhoof Behemoth/Finale/Unnatural Growth, or token and creature death value through Mirkwood Bats, Shaman of the Pack, Skemfar Shadowsage, Poison-Tip Archer, and related pieces.
- **Resilience:** do not commit every engine and payoff into a likely board wipe unless the follow-up wins immediately or protection is available.

### What makes this version different

The distinct hook is **tapping as a resource**, not just “play Elves, pump team.” Lathril can drain without combat; Dionus gives an own-turn untap engine; Seedborn Muse refreshes the board on opponent turns; Staff of Domination and Umbral Mantle can turn large mana Elves into combo engines. The token plan then has three jobs: grow the board, create mana/cards, and threaten life totals even when combat is blocked.

The 8×8 categories remain the user’s organizational framework, not a rigid quota. Cards can support more than one category; do not double-count one card in total-card reconciliation.

## 3. Rules and interactions that materially affect the build

### Lathril requires herself plus ten other Elves

Her activated ability costs tapping Lathril **and** tapping ten untapped Elves you control. Lathril does not count as one of the ten. The activation is much more demanding than “have ten Elves total”: when ready to activate, the practical threshold is Lathril plus ten other untapped Elves, and those Elves need to remain on the board long enough for the ability to resolve. The official Kaldheim release notes confirm the rule.  
Reference: https://magic.wizards.com/en/news/feature/kaldheim-release-notes-2021-01-22

### Dionus, Elvish Archdruid is the most important new synergy

Dionus gives your Elves an ability that triggers the first time each of them becomes tapped during **your turn**: that Elf untaps and gets a +1/+1 counter. This includes Lathril and the Elves used to pay her activated ability. If Lathril plus ten other Elves are available, the first Lathril activation can trigger Dionus on all of them; once those triggers resolve, the creatures can be tapped again for a second Lathril activation during the same turn. The “only once each turn” clause means this is not an infinite loop by itself: those same Elves do not keep re-triggering Dionus during that turn.

Dionus also benefits mana Elves during your own turn. It does not replace Seedborn Muse, which does its work at each opponent’s untap step. These engines overlap in purpose but not in timing.

### Seedborn Muse + Lathril

Seedborn Muse untaps your permanents during each other player’s untap step. Lathril’s tap ability can be activated at instant speed, including during an opponent’s turn. If you maintain the required number of untapped Elves and keep Lathril alive, this can threaten a separate 10-life drain during each opponent’s turn. This is a threat, not a guarantee: removal, board wipes, tapped creatures, and commander timing all matter.

### Mana-Elf combo thresholds

- **Staff of Domination:** an Elf that can tap for at least five mana can generate positive net mana through a loop that pays three to use Staff to untap the Elf and one to untap Staff. With the right board state, this can produce infinite mana; Staff can then convert that mana into cards/life/untaps. Four mana per tap does not produce a positive-mana loop with this sequence.
- **Umbral Mantle:** an equipped creature that can produce at least four mana per tap can pay three to untap and grow, netting one mana per loop. This can create infinite mana and arbitrarily large power for that creature. Exact sequencing and whether the creature can legally activate remain important.
- These are real lines in the current list, but they are not guaranteed just because Staff or Mantle is in the deck. The build must generate the mana threshold and locate the pieces.

### Mirkwood Bats: two different triggers

This card is a strong fit, but its triggers must be evaluated accurately:
- When you create **one or more tokens in a single event**, it deals damage equal to the number of opponents to any target. Creating five tokens simultaneously does not make this trigger deal five times that amount.
- Whenever a token you control leaves the battlefield, **each opponent loses 1 life**. If five tokens leave, this second ability triggers five times.
- Doubling Season increases the number of tokens you make, which helps the leaving/death-side payoff, but does not automatically multiply the first trigger’s damage for each token in a single creation event.

### Skullclamp turns disposable 1/1 Elf tokens into cards

A 1/1 token equipped with Skullclamp becomes 2/0 from +1/-1 and dies to state-based actions; when the equipped creature dies, Skullclamp draws two cards. This means some token-makers become repeatable card advantage, though losing the body matters if the board is needed to activate Lathril. Do not clamp away the tenth needed Elf without accounting for the cost.

### Other card-text details

- **Gala Greeters:** its Alliance ability can trigger whenever another creature enters under your control. Each trigger must choose a mode that has not been chosen earlier that turn (counter, Treasure, or gain 2 life), so a token swarm can cause repeated triggers—but each of the three modes is available only once per turn. Treasure can support Jaheira and token payoffs.
- **The Great Henge:** its draw clause is for a **nontoken creature** entering under your control; Elf tokens do not cause the draw trigger.
- **Primal Vigor:** symmetrical; it doubles token creation and counters for opponents too. Doubling Season is the asymmetric alternative if budget is irrelevant.
- **Tyvar, Jubilant Brawler:** gives creatures you control permission to activate abilities as though they had haste, can untap one creature with +1, and can return a creature with mana value 2 or less from the graveyard with −2. It supports both Lathril’s tap ability and a mana Elf played that turn.

## 4. Research benchmark: what “optimized Lathril” tends to improve

The current EDHREC optimized reference has 33 lands and includes a much denser package of turn-one Elves, card advantage, tutors, and protection than the CURRENT inventory. Its listed cards include Circle of Dreams Druid, Dionus, Elvish Warmaster, Llanowar Elves, Elvish Mystic, Fyndhorn Elves, Finale of Devastation, Green Sun’s Zenith, Natural Order, Demonic Tutor, Vampiric Tutor, Worldly Tutor, Heroic Intervention, Skullclamp, Swiftfoot Boots, and Doubling Season. The Elf-filtered optimized list gives additional confirmation of the same direction. Sources below.

This comparison leads to four findings:

1. **Increase turn-one action.** The CURRENT list has only Elvish Mystic and Fyndhorn Elves among true one-mana mana Elves. V2 adds Llanowar Elves and Arbor Elf. That is a material improvement, not full optimized density.
2. **Use creature count as a mana engine.** Circle of Dreams Druid is exceptional once the board is wide, but vulnerable to removal; it adds ceiling, not safety.
3. **Add ways to find the right engine.** V2 proposes Chord of Calling and Finale of Devastation. More tutors can raise consistency further, but should be a deliberate choice rather than a blind copy.
4. **Protect the turns invested into the board.** V2 adds Heroic Intervention, Selfless Safewright, and Swiftfoot Boots. They answer different threat classes and do not stop every form of removal.

EDHREC data is user-generated and filtered by selected deck brackets; it is a useful metagame benchmark, not proof that a card is correct for this specific list.

## 5. Proposed V2: exact 16 one-for-one swaps

**Every change below is PROPOSED, not tested.** Each row preserves the 100-card total by replacing one card with one card.

| # | OUT (current) | IN (proposed) | Why / caveat |
|---:|---|---|---|
| 1 | Puppet Strings | Tyvar, Jubilant Brawler | Much stronger role compression: tap-ability haste, one-creature untap, and small-creature recovery. Tyvar is not an Elf and can be attacked/removed. |
| 2 | Return Upon the Tide | Dionus, Elvish Archdruid | The signature interaction with Lathril: own-turn untaps for the commander, tapped mana Elves, and +1/+1 counters. Gives the deck a more distinctive engine than slow recursion. |
| 3 | Llanowar Visionary | Circle of Dreams Druid | Replaces a small ETB draw/ramp body with enormous green mana in a wide board. The downside is vulnerability to removal and less immediate card replacement. |
| 4 | Bounty of Skemfar | Llanowar Elves | Bounty is useful value (may find a land and an Elf), but three mana is slow when the priority is a turn-one accelerator. This is a curve/consistency decision, not a claim that Bounty is bad. |
| 5 | Harvest Season | Arbor Elf | Harvest Season needs a developed board and creatures tapping in combat; Arbor Elf makes the opening curve faster if you have a Forest to untap. |
| 6 | Dwynen, Gilt-Leaf Daen | Elvish Warmaster | Adds token generation from Elf entries and an activated team finisher; better connects the token engine to both board width and closing damage. Loses Dwynen’s life gain/anthem profile. |
| 7 | Lothlórien Blade | Mirkwood Bats | Blade is slow, conditional repeatable combat removal; Bats makes token creation events deal damage and makes tokens leaving drain every opponent. Bats is a payoff, not a token maker by itself. |
| 8 | Damnable Pact | Skullclamp | Turns disposable 1/1 tokens into repeatable two-card draw. Pact could be a flexible late-game draw/finisher, but is a one-shot spell and can benefit an opponent if targeted poorly. |
| 9 | Phyrexian Arena | Champions of the Perfect | Better fit for a creature-heavy build: a large body that can draw from casting creature spells. It costs four mana and needs an Elf exiled as an additional cost; if it leaves, the exiled card returns to its owner’s hand. |
| 10 | Casualties of War | Heroic Intervention | Trades six-mana, broad but expensive removal for protection of the entire board. Heroic Intervention does not stop sacrifice effects, “destroy” replacement bypasses, or −X/−X effects that reduce toughness to zero; it is not universal protection. |
| 11 | Eyeblight Massacre | Selfless Safewright | Retain Kindred Dominance and Crippling Fear as tribal-aware sweepers; gain a flash/convoke Elf that can give other permanents of a chosen type hexproof and indestructible for the turn. Its protection is tribal/type-limited. |
| 12 | Trailblazer’s Boots | Swiftfoot Boots | Haste and hexproof protect Lathril and let her use her tap ability sooner; Boots’ equip cost is the tradeoff. Boots will be less important if Lathril is rarely removed or timing does not matter in your pod. |
| 13 | Overrun | Finale of Devastation | Tutor for a creature from library/graveyard or, at X≥10, give the team +X/+X and haste. Much more flexible as both selection and finisher. |
| 14 | Primal Vigor | Doubling Season | Keeps the token-multiplier role but stops doubling opponents’ tokens and counters. It is still a five-mana setup card and may be slow in very fast pods. |
| 15 | Myriad Landscape | Wirewood Lodge | Myriad Landscape is tapped, colorless, and delayed; Lodge can untap Lathril or an Elf mana engine. Lodge produces only colorless mana and should not worsen color consistency. |
| 16 | Jagged-Scar Archers | Chord of Calling | Archers is a scalable answer mostly to flyers; Chord finds an exact creature at instant speed and can be convoked using a wide board. Keep Archers in a flyer-heavy local meta. |

### Why not cut Skemfar Elderhall?

Skemfar Elderhall has real utility: it makes mana and, when sacrificed/activated for its higher-cost mode, can create two Elf tokens while giving a creature −2/−2. It therefore supports the distinctive token plan and is not the first land slot I would cut. The proposed land swap is Myriad Landscape → Wirewood Lodge.

## 6. Power audit

These are qualitative architecture estimates, not win-rate metrics.

| Dimension | CURRENT | V2 projected | Explanation |
|---|---:|---:|---|
| Early setup / speed | 6.5 | 9.0 | Four true one-mana mana Elves after V2, plus Sol Ring/Emerald Medallion; still can mulligan poorly. |
| Elf mana ceiling | 8.8 | 9.4 | Priest, Archdruid, Marwyn, Channeler and Staff/Mantle already scale well; Circle of Dreams Druid and Dionus improve the ceiling. |
| Token production | 8.4 | 9.0 | Already strong token makers; Warmaster and Doubling Season add redundancy/output. |
| Token-to-damage/card conversion | 6.8 | 9.2 | Mirkwood Bats and Skullclamp make tokens more than bodies; remember Bats has two differently worded triggers. |
| Lathril activation consistency | 8.0 | 9.5 | Dionus, Tyvar and Wirewood Lodge support activation windows, while Seedborn Muse remains the opponent-turn engine. Requires the actual ten other untapped Elves. |
| Draw / card advantage | 7.5 | 9.0 | Skullclamp and Champions add engines, but Champions is four mana and can be answered. |
| Protection / recovery | 5.5 | 8.3 | Heroic Intervention, Selfless Safewright and Swiftfoot Boots help, but a single protection suite cannot solve every wipe. |
| Interaction efficiency | 7.5 | 8.0 | V2 trims expensive/overlapping answers; Chord can find a creature answer. Final balance depends on local threats. |
| Access to engines/finishers | 7.2 | 9.1 | Finale and Chord find pieces. More tutors would increase consistency if desired. |
| Mana base | 7.2 | 8.0 | Holds at 33 land-capable slots; still needs 5–8 games tracking missed land drops/color issues. |
| **Overall build estimate** | **7.5** | **9.0–9.2** | Proposed gains are meaningful, but not yet playtested and not equal to a measured power level. |

### Why not call it 10/10 now?

A literal 10/10 is not a stable rating without defining the comparison set. Relative to high-power casual Elf tribal, the V2 is much tighter. Relative to the strongest optimized Commander lists, it still has fewer tutors and less stack interaction, and it is vulnerable to a well-timed board wipe. Calling it a 10/10 before games would repeat the problem of over-rating the earlier pass.

## 7. Optional high-power tuning module (do not apply automatically)

These options are for moving from the V2 target toward roughly 9.4–9.5, depending on local meta and how much tutoring you want. They are **not included** in the 100-card proposed list below.

- **Binding the Old Gods → Green Sun’s Zenith:** the strongest first test if you want another creature tutor that can find a mana engine or a finisher. You lose a versatile removal saga, so keep it if your meta demands that effect.
- **Nullmage Shepherd → Worldly Tutor:** only if the activation cost of Shepherd is often too slow and you want instant-speed access to a creature. Keep Shepherd if artifacts/enchantments dominate your table.
- **Ruthless Winnower → Allosaurus Shepherd:** only in a blue/counterspell-heavy pod. Allosaurus Shepherd is a one-mana Elf, protects your green spells from being countered, and offers a late team pump; it is not general board-wipe protection.
- **Further tutor density:** Worldly Tutor, Green Sun’s Zenith, Natural Order, or Demonic Tutor appear in optimized reference builds. Decide whether you want that consistency: it can push power higher but can also make games feel repetitive. The core V2 already has Finale and Chord, so test before adding multiple more tutors.

I would not add all options simultaneously. The best first optional change is usually Green Sun’s Zenith for Binding the Old Gods, then decide based on observed play patterns.

## 8. Eight user categories — V2 projected map

1. **Ramp:** Elvish Mystic, Fyndhorn Elves, Llanowar Elves, Arbor Elf, Priest of Titania, Elvish Archdruid, Marwyn, Llanowar Tribe, Wirewood Channeler, Circle of Dreams Druid.
2. **Draw:** Beast Whisperer, Leaf-Crowned Visionary, Skullclamp, Champions of the Perfect, Pact of the Serpent, Sylvan Messenger, The Great Henge, Bolas’s Citadel.
3. **Removal:** Assassin’s Trophy, Binding the Old Gods, Feed the Swarm, Kindred Dominance, Crippling Fear, Reclamation Sage, Withering Torment, Nullmage Shepherd, Chord of Calling (as access to a creature answer).
4. **WinCon:** Lathril drain, Craterhoof Behemoth, Finale of Devastation, Shaman of the Pack, Skemfar Shadowsage, Unnatural Growth, Mirkwood Bats, Staff/Umbral Mantle mana lines.
5. **Tokens:** Elven Ambush, Elvish Promenade, Imperious Perfect, Elvish Warmaster, Lys Alana Huntmaster, Wolverine Riders, Galadhrim Ambush, Cultivator of Blades, Lathril combat trigger, Doubling Season.
6. **Untap + Sinergia:** Seedborn Muse, Staff of Domination, Umbral Mantle, Seeker of Skybreak, Vitalize, Tyvar, Dionus, Wirewood Lodge, Lathril, Marwyn, Priest of Titania.
7. **Buff:** Canopy Tactician, Imperious Perfect, Craterhoof Behemoth, Cultivator of Blades, Timberwatch Elf, Unnatural Growth, Elvish Warmaster, Doubling Season.
8. **Ramp2:** Sol Ring, Emerald Medallion, Kodama’s Reach, Oracle of Mul Daya, Revitalizing Repast, Bridgeworks Battle, Disciple of Freyalise. Doubling Season is a payoff, not ramp.

The eight groups are functional labels. A card may appear in more than one group conceptually; count each physical card once in the deck.

## 9. Mulligan and play sequencing

### Keep-hand indicators

Prefer a hand that has at least one of:
- one-mana acceleration plus a functional two/three-mana follow-up;
- Sol Ring plus productive plays (not only a hand of expensive cards);
- enough lands and an early engine where the colors are reliable.

Treat hands with several expensive payoffs but no early mana, or multiple colorless/ETB-tapped lands and no accelerator, as suspect. Do not keep just because Craterhoof/Staff/Doubling Season looks powerful in isolation.

### Avoiding premature commitment

- If you can develop a board and hold up Heroic Intervention, consider doing so rather than placing every engine on the table.
- If Dionus is out and you can tap ten other Elves plus Lathril, plan sequencing before tapping: the first activation can create Dionus triggers that untap the crew, but those triggers are once per Elf per turn.
- If Seedborn Muse is available, consider leaving enough Elves untapped to represent Lathril activations on opponents’ turns rather than tapping the entire board for marginal value.
- If Skullclamp is available, identify expendable tokens and count whether sacrificing them drops you below the ten other Elves needed for Lathril.

### Main endgame decisions

- Use **combat** when Craterhoof/Finale/Unnatural Growth can make lethal pressure and blockers are manageable.
- Use **Lathril drain** when the board supports ten other untapped Elves and the table is within reach.
- Use **token damage/death value** when combat is blocked or opponents’ life totals are high; remember Mirkwood Bats’s two separate triggers.
- Use **mana combo** only when the threshold is genuinely met and the line is safer or faster than fair combat.

## 10. Playtest protocol: 8 games before calling it 9.5+

Record these for each game:
- opening-hand keep/mulligan and why;
- whether you made a meaningful play on turn one;
- turn Lathril entered and whether she attacked;
- turn you first had Lathril + ten other untapped Elves;
- first meaningful drain activation and how many opponents it hit;
- first card-advantage engine online;
- cards stuck in hand at 5+ mana;
- number of cards expended or creatures lost to a wipe;
- whether Heroic Intervention/Safewright/Boots saved a key turn;
- win/loss and which line actually closed the game.

**Suggested split:** Games 1–4 test only the core V2 package. Games 5–8 make one optional tuning change (e.g., Green Sun’s Zenith for Binding the Old Gods) and compare. Avoid changing five more cards between every game; the result would be hard to interpret.

### Diagnostic thresholds (heuristics, not laws)

- If you often do nothing meaningful on turn one, add one-mana accelerants before adding another five-mana payoff.
- If you develop a large board but cannot close, improve payoff/tutor density instead of adding more token-makers.
- If your hand empties after a wipe, prioritize card advantage and protection.
- If you have mana but not the right creature, test a tutor.
- If you are consistently color-screwed, revisit land colors before cutting more lands.
- If opponents die to combo too often and it makes games repetitive, keep the synergistic engines but do not automatically maximize tutor density.

## 11. Source notes

Sources used for comparison and rules checking; the links can change as sites update.

1. **EDHREC — Optimized Average Lathril Deck:**  
   https://edhrec.com/average-decks/lathril-blade-of-the-elves/optimized  
   Comparison for 33 lands, high concentration of cheap Elf accelerants, tutor package, protection, and draw engines. User-configured deck-bracket data is not a formal power rating.

2. **EDHREC — Optimized Elf-filtered Lathril Deck:**  
   https://edhrec.com/average-decks/lathril-blade-of-the-elves/optimized/elves  
   Additional comparison for tribal density and engine selection.

3. **EDHREC — Lathril commander page:**  
   https://edhrec.com/commanders/lathril-blade-of-the-elves  
   High-level card inclusion patterns; community data, not an optimization guarantee.

4. **EDHREC — New Cards to Add to Lathril Commander Decks (2026):**  
   https://edhrec.com/articles/new-cards-to-add-to-lathril-commander-decks  
   Recent discussion of Dionus, Champions of the Perfect, Selfless Safewright, and other current upgrade candidates.

5. **Wizards of the Coast — Kaldheim Release Notes:**  
   https://magic.wizards.com/en/news/feature/kaldheim-release-notes-2021-01-22  
   Official rules clarification for Lathril’s activated ability and the ten-Elf payment.

6. **Card text / oracle lookup — Mirkwood Bats:**  
   https://scryfall.com/search?q=%21%22Mirkwood+Bats%22  
   Use the current Oracle wording for token-creation vs token-leaves triggers.

7. **Card text / oracle lookup — Dionus, Elvish Archdruid:**  
   https://scryfall.com/search?q=%21%22Dionus%2C+Elvish+Archdruid%22

8. **Card text / oracle lookup — Tyvar, Jubilant Brawler:**  
   https://scryfall.com/search?q=%21%22Tyvar%2C+Jubilant+Brawler%22

9. **Card text / oracle lookup — Skullclamp:**  
   https://scryfall.com/search?q=%21%22Skullclamp%22

10. **EDHREC — Lathril tap/untap optimized:**  
    https://edhrec.com/commanders/lathril-blade-of-the-elves/optimized/tap-untap  
    Comparison for engines that exploit untapping and commander activations.

11. **EDHREC — Lathril combos:**  
    https://edhrec.com/combos/lathril-blade-of-the-elves  
    Reference for combo lines associated with large mana Elves, Staff of Domination, and Umbral Mantle.

## 12. Decklist and status

- CURRENT list remains preserved in the workbook’s **Card-by-Card CURRENT** tab.
- The following list is a derived **PROPOSED V2** after applying exactly the 16 one-for-one changes above.
- Count verified programmatically: **99 main-deck cards + 1 commander = 100 total**.
- Proposed changes are **not tested**. Do not rename them TESTED until actual games are recorded.

### Commander

1 Lathril, Blade of the Elves

### Proposed main deck — 99 cards

10 Forest
8 Swamp
1 Arbor Elf
1 Assassin's Trophy
1 Beast Whisperer
1 Binding the Old Gods
1 Bolas's Citadel
1 Bridgeworks Battle
1 Canopy Tactician
1 Champions of the Perfect
1 Chord of Calling
1 Circle of Dreams Druid
1 Command Tower
1 Craterhoof Behemoth
1 Crippling Fear
1 Cultivator of Blades
1 Darkbore Pathway
1 Deathcap Glade
1 Dionus, Elvish Archdruid
1 Disciple of Freyalise
1 Doubling Season
1 Elven Ambush
1 Elvish Archdruid
1 Elvish Mystic
1 Elvish Promenade
1 Elvish Warmaster
1 Emerald Medallion
1 Feed the Swarm
1 Finale of Devastation
1 Fyndhorn Elves
1 Gala Greeters
1 Galadhrim Ambush
1 Glissa Sunslayer
1 Harald, King of Skemfar
1 Heroic Intervention
1 Imperious Perfect
1 Jaheira, Friend of the Forest
1 Jungle Hollow
1 Khalni Ambush
1 Kindred Dominance
1 Kodama's Reach
1 Leaf-Crowned Visionary
1 Llanowar Elves
1 Llanowar Tribe
1 Lys Alana Huntmaster
1 Marwyn, the Nurturer
1 Mirkwood Bats
1 Nullmage Shepherd
1 Oracle of Mul Daya
1 Pact of the Serpent
1 Path of Ancestry
1 Poison-Tip Archer
1 Priest of Titania
1 Reclamation Sage
1 Revitalizing Repast
1 Rhonas's Monument
1 Ruthless Winnower
1 Secluded Courtyard
1 Seedborn Muse
1 Seeker of Skybreak
1 Selfless Safewright
1 Shaman of the Pack
1 Skemfar Elderhall
1 Skemfar Shadowsage
1 Skullclamp
1 Sol Ring
1 Staff of Domination
1 Swiftfoot Boots
1 Sylvan Messenger
1 Temple of Malady
1 The Great Henge
1 Timberwatch Elf
1 Twilight Mire
1 Tyvar, Jubilant Brawler
1 Umbral Mantle
1 Undergrowth Stadium
1 Unnatural Growth
1 Vitalize
1 Vraska Joins Up
1 Wirewood Channeler
1 Wirewood Lodge
1 Withering Torment
1 Wolverine Riders
