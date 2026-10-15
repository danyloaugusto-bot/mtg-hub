# Dados de referência: Edgar Markov (Commander)

Coleta em 2026-10-14. Regras seguidas: nada escrito de memória; o que não foi conferido na fonte está marcado como "não conferido". Teto de 40 chamadas de rede (WebFetch + WebSearch); o gasto de cada seção está registrado nela. Seções acrescentadas em ordem; o "Complemento" da seção 1 e parte das citações das seções 4 e 5 foram incluídos no fim da coleta (resumo das 27 chamadas no fim do arquivo).

Status por seção (detalhes e limites dentro de cada uma):
- 1. EDHREC: PARCIAL. JSON legível só até a 7a carta de Utility Artifacts (com inclusão e sinergia); as listas cortadas vieram da página HTML do EDHREC, só com inclusão %. Sinergia % dessas listas: não conferido. Número de decks: 51.835.
- 2. edh.wiki: lida inteira (inclusão e sinergia por carta, 13 listas). Número de decks do tema e lista média: não conferido.
- 3. Precon Vampiric Bloodlust: COMPLETO, 100 cartas, conferido em duas fontes.
- 4. Game Changers: 53 cartas (ScrollVault e Draftsim coincidem). Última atualização oficial: 09/02/2026; mudança depois disso: não encontrada (sem página oficial listando as 53 cartas).
- 5. Brackets: citações oficiais do Bracket 3 e do Bracket 4 (fev/2025 e out/2025, mais a página de formato). Valores por bracket do item de combos de duas cartas na página de formato atual: não conferido.
- 6. Combos: 75 de 1.673 combos legíveis no JSON (cortado); os 4 combos pedidos, conferidos no Commander Spellbook.

---

## 1. EDHREC: json.edhrec.com/pages/commanders/edgar-markov.json

Fonte: https://json.edhrec.com/pages/commanders/edgar-markov.json (WebFetch, 2026-10-14)
Chamadas de rede gastas nesta seção: 5 (chamadas nº 1 a 4 no JSON: 3 com leitura útil e a 4a, com offset=100000, que só confirmou o fim do texto; mais a nº 25, feita depois e descrita no "Complemento" ao fim desta seção, na página HTML edhrec.com/commanders/edgar-markov).
Status: JSON PARCIAL, com sinergia: New Cards, Top Cards, High Lift Cards, Creatures, Instants, Sorceries e 6 das 7 cartas visíveis de Utility Artifacts. As listas que o JSON cortou (Utility Artifacts inteira, Enchantments, Planeswalkers, Utility Lands, Mana Artifacts, Lands) foram lidas na página HTML, só com inclusão % (sinergia %: não conferido); ver "Complemento". Battles e Game Changers: não existem como lista na página HTML.

### Limite de leitura (leia antes de usar os números)

- O texto da página que o WebFetch entrega tem 72.150 caracteres e termina cortado no meio da lista Utility Artifacts, dentro do nome da 7a carta (`"name":"Banner of Ki`, ou seja, Banner of Kinship, sem os números). A chamada com offset=100000 devolveu: "Nothing left to read from offset 100000: this page's text is 72150 characters long." Portanto não há como ler o restante desse JSON por offset; pedir em chamadas separadas permitiu extrair as listas por partes, mas não passar do corte.
- Seções pedidas que o JSON não deixou ler (fora do trecho legível): Enchantments, Artifacts (a lista que aparece no trecho se chama "Utility Artifacts" e está cortada), Planeswalkers, Utility Lands, Mana Artifacts, Lands. No JSON, tudo isso: não conferido. Essas listas foram lidas depois na página HTML do EDHREC, sem sinergia % (ver "Complemento"); listas extras depois do corte no JSON (Battles, Game Changers etc.): não conferido no JSON, e a página HTML não tem lista com esses nomes.
- A seção pedida "High Synergy Cards" não existe com esse nome neste JSON; a lista equivalente no trecho lido se chama "High Lift Cards" (tag `highliftcards`). Ela não está ordenada por inclusão (as demais estão).
- O modelo auxiliar do WebFetch informou que as cartas NÃO têm os campos `inclusion` nem `label`; só `num_decks`, `potential_decks` e `synergy`. Por isso: inclusão % = num_decks / potential_decks x 100 e sinergia % = synergy x 100, ambos calculados aqui (na página HTML do EDHREC, lida no Complemento, a inclusão aparece arredondada: inteiro a partir de 10% e uma casa decimal abaixo de 10%; aqui estão com uma casa decimal; como a página HTML exibe a sinergia: não conferido). O `potential_decks` varia por carta (ex.: Emeritus of Woe, 17.591; Qarsi Revenant, 43.061; Bloodline Bidding, 24.399); o motivo não consta no texto lido.
- Os números passaram pelo modelo auxiliar do WebFetch (transcrição, não download bruto). Conferência feita: todas as listas, exceto High Lift Cards, estão em ordem decrescente de num_decks/potential_decks, e as contagens (10, 10, 50, 34, 28) bateram com as contagens que o próprio resumidor informou. Isso afasta erro grosseiro, mas não prova que cada dígito esteja certo.
- Cartas que aparecem em Top Cards ou High Lift Cards não se repetem nas listas por tipo (ex.: Master of Dark Rites e Malakir Bloodwitch estão só em High Lift Cards). Para somar, junte as listas.

### Número de decks

- O JSON não tem campo `num_decks` no topo. O valor 51835 aparece como `potential_decks` em quase todas as cartas e é igual à soma de `budget_counts` (`{"budget":5183,"middle":41469,"expensive":5183}` = 51.835). Número de decks usado: 51.835 (derivado desses dois campos; não declarado literalmente no JSON). A página HTML do EDHREC (ver "Complemento") traz o mesmo número por extenso: "51,835decks" e "EDH deck recommendations from 51,835 Commander decks."
- `bracket_counts` (topo do JSON): `{"3":5660,"4":4168,"2":3460,"5":231,"1":97}`, soma 13.616 (decks com bracket classificado, não o total). Distribuição: bracket 1 = 0,7%; bracket 2 = 25,4%; bracket 3 = 41,6%; bracket 4 = 30,6%; bracket 5 = 1,7%.
- `header`: "Edgar Markov (Commander)". `description`: vazio.
- Campos que o resumidor viu no topo e só citou truncados (conteúdo: não conferido): `tag_counts` (primeira entrada: vampires, count 5723; segunda: lifegain, count 3102), `savedate_counts`.

### New Cards (tag `newcards`) - 5 cartas

nome | inclusão % | sinergia %
Edgar, Ancient Bloodlord | 10.3 | +8.9
Bloodline Recollector | 5.1 | +4.3
Kindred Judgment | 3.1 | +2.5
Turbulent Crater | 1.9 | -0.9
Lich's Relic | 0.6 | -0.2

Valores brutos transcritos de New Cards (nome | num_decks | potential_decks | synergy):
```
Edgar, Ancient Bloodlord | 451 | 4396 | 0.08919244839557852
Bloodline Recollector | 817 | 15903 | 0.042846284475729
Kindred Judgment | 123 | 3950 | 0.025007302116326208
Turbulent Crater | 73 | 3832 | -0.008653122191878793
Lich's Relic | 22 | 3720 | -0.002495807438098056
```

### Top Cards (tag `topcards`) - 10 cartas

nome | inclusão % | sinergia %
Captivating Vampire | 82.4 | +71.6
Blood Artist | 82.3 | +64.2
Cordial Vampire | 81.8 | +71.0
Stromkirk Captain | 74.4 | +64.4
Indulgent Aristocrat | 72.9 | +63.4
Welcoming Vampire | 72.7 | +60.0
Legion Lieutenant | 69.1 | +60.0
Bloodline Keeper | 68.6 | +59.6
Sanctum Seeker | 67.8 | +58.8
Swords to Plowshares | 67.5 | +5.5

Valores brutos transcritos de Top Cards (nome | num_decks | potential_decks | synergy):
```
Captivating Vampire | 42717 | 51835 | 0.7164
Blood Artist | 42649 | 51835 | 0.6425
Cordial Vampire | 42396 | 51835 | 0.7097
Stromkirk Captain | 38552 | 51835 | 0.6443
Indulgent Aristocrat | 37771 | 51835 | 0.6336
Welcoming Vampire | 37676 | 51835 | 0.5995
Legion Lieutenant | 35825 | 51835 | 0.6
Bloodline Keeper | 35570 | 51835 | 0.5959
Sanctum Seeker | 35133 | 51835 | 0.588
Swords to Plowshares | 35008 | 51835 | 0.0545
```

### High Lift Cards (tag `highliftcards`) - 10 cartas

nome | inclusão % | sinergia %
Falkenrath Pit Fighter | 20.2 | +17.6
Vampire Nocturnus | 17.2 | +14.9
Master of Dark Rites | 60.9 | +52.9
Malakir Bloodwitch | 52.4 | +45.5
Oathsworn Vampire | 20.8 | +18.1
Forerunner of the Legion | 34.7 | +30.1
Champion of Dusk | 43.2 | +37.5
Rakish Heir | 30.1 | +26.1
Voldaren Ambusher | 5.2 | +4.5
Patron of the Vein | 36.7 | +31.9

Valores brutos transcritos de High Lift Cards (nome | num_decks | potential_decks | synergy):
```
Falkenrath Pit Fighter | 10484 | 51835 | 0.1759
Vampire Nocturnus | 8899 | 51835 | 0.1493
Master of Dark Rites | 31552 | 51835 | 0.5295
Malakir Bloodwitch | 27155 | 51835 | 0.4553
Oathsworn Vampire | 10805 | 51835 | 0.1811
Forerunner of the Legion | 17973 | 51835 | 0.3013
Champion of Dusk | 22389 | 51835 | 0.3753
Rakish Heir | 15594 | 51835 | 0.2612
Voldaren Ambusher | 2717 | 51835 | 0.0455
Patron of the Vein | 19044 | 51835 | 0.319
```

### Creatures (tag `creatures`) - 50 cartas

nome | inclusão % | sinergia %
Vito, Thorn of the Dusk Rose | 64.6 | +54.9
Cruel Celebrant | 62.9 | +49.9
Elenda, the Dusk Rose | 58.5 | +48.9
Charismatic Conqueror | 57.1 | +46.2
Edgar, Charmed Groom | 55.3 | +47.9
Drana, Liberator of Malakir | 54.1 | +45.2
Clavileño, First of the Blessed | 52.5 | +45.5
Bloodthirsty Conqueror | 50.0 | +42.6
Markov Baron | 49.3 | +42.8
Viscera Seer | 48.2 | +33.8
Vampire of the Dire Moon | 46.0 | +39.9
Twilight Prophet | 46.0 | +39.2
Mavren Fein, Dusk Apostle | 43.0 | +37.2
Bloodletter of Aclazotz | 42.1 | +33.6
Vampire Socialite | 41.4 | +35.9
Yahenni, Undying Partisan | 40.0 | +31.5
Vengeful Bloodwitch | 34.1 | +28.7
Vampire Nighthawk | 32.9 | +27.8
Knight of the Ebon Legion | 31.3 | +26.7
Crossway Troublemakers | 29.1 | +25.1
Marauding Blight-Priest | 27.7 | +23.6
Anowon, the Ruin Sage | 26.1 | +22.7
Baron Bertram Graywater | 25.6 | +21.5
Butcher of Malakir | 25.5 | +21.5
Olivia Voldaren | 25.3 | +21.8
Emeritus of Woe | 24.7 | +20.0
Ruthless Lawbringer | 24.2 | +19.7
Scheming Silvertongue | 23.4 | +19.8
Bartolomé del Presidio | 23.4 | +18.8
Drana and Linvala | 22.9 | +14.6
Olivia, Crimson Bride | 20.4 | +16.6
Vampire Gourmand | 19.8 | +17.1
Preacher of the Schism | 19.8 | +16.8
Florian, Voldaren Scion | 19.7 | +16.6
Dusk Legion Zealot | 19.6 | +16.9
Elenda's Hierophant | 19.2 | +16.3
Nighthawk Scavenger | 19.0 | +14.6
Vein Ripper | 18.5 | +15.1
Bloodghast | 18.5 | +15.4
Falkenrath Noble | 18.0 | +15.2
Gifted Aetherborn | 17.5 | +15.0
Creeping Bloodsucker | 16.6 | +14.0
Carmen, Cruel Skymarcher | 16.4 | +12.3
Qarsi Revenant | 16.2 | +13.4
Shadow Alley Denizen | 16.2 | +14.0
Roaming Throne | 15.3 | +9.9
Voldaren Epicure | 15.2 | +13.0
Nullpriest of Oblivion | 14.2 | +12.2
Vampire Cutthroat | 13.6 | +11.8
Bloodline Necromancer | 12.9 | +11.2

Valores brutos transcritos de Creatures (nome | num_decks | potential_decks | synergy):
```
Vito, Thorn of the Dusk Rose | 33506 | 51835 | 0.5486
Cruel Celebrant | 32592 | 51835 | 0.4992
Elenda, the Dusk Rose | 30330 | 51835 | 0.489
Charismatic Conqueror | 29597 | 51835 | 0.462
Edgar, Charmed Groom | 28690 | 51835 | 0.479
Drana, Liberator of Malakir | 28034 | 51835 | 0.452
Clavileño, First of the Blessed | 27189 | 51835 | 0.4553
Bloodthirsty Conqueror | 25782 | 51554 | 0.4265
Markov Baron | 25577 | 51835 | 0.4279
Viscera Seer | 24996 | 51835 | 0.3382
Vampire of the Dire Moon | 23843 | 51835 | 0.3987
Twilight Prophet | 23821 | 51835 | 0.3922
Mavren Fein, Dusk Apostle | 22278 | 51835 | 0.3719
Bloodletter of Aclazotz | 21810 | 51835 | 0.3355
Vampire Socialite | 21465 | 51835 | 0.3591
Yahenni, Undying Partisan | 20756 | 51835 | 0.3148
Vengeful Bloodwitch | 17655 | 51835 | 0.2872
Vampire Nighthawk | 17061 | 51835 | 0.2783
Knight of the Ebon Legion | 16244 | 51835 | 0.2672
Crossway Troublemakers | 15073 | 51835 | 0.2512
Marauding Blight-Priest | 14364 | 51835 | 0.2364
Anowon, the Ruin Sage | 13537 | 51835 | 0.2265
Baron Bertram Graywater | 13250 | 51835 | 0.2151
Butcher of Malakir | 13203 | 51835 | 0.2153
Olivia Voldaren | 13097 | 51835 | 0.2178
Emeritus of Woe | 4352 | 17591 | 0.2004
Ruthless Lawbringer | 12554 | 51835 | 0.1966
Scheming Silvertongue | 4139 | 17668 | 0.1977
Bartolomé del Presidio | 12137 | 51835 | 0.1876
Drana and Linvala | 11884 | 51835 | 0.1458
Olivia, Crimson Bride | 10600 | 51835 | 0.1664
Vampire Gourmand | 10180 | 51406 | 0.1706
Preacher of the Schism | 10249 | 51835 | 0.1675
Florian, Voldaren Scion | 10235 | 51835 | 0.1662
Dusk Legion Zealot | 10147 | 51835 | 0.1693
Elenda's Hierophant | 9940 | 51835 | 0.1627
Nighthawk Scavenger | 9832 | 51835 | 0.1461
Vein Ripper | 9585 | 51835 | 0.1512
Bloodghast | 9569 | 51835 | 0.1541
Falkenrath Noble | 9326 | 51835 | 0.1524
Gifted Aetherborn | 9060 | 51835 | 0.1505
Creeping Bloodsucker | 8620 | 51835 | 0.1399
Carmen, Cruel Skymarcher | 8513 | 51835 | 0.1229
Qarsi Revenant | 6982 | 43061 | 0.1338
Shadow Alley Denizen | 8390 | 51835 | 0.1404
Roaming Throne | 7951 | 51835 | 0.0991
Voldaren Epicure | 7858 | 51835 | 0.1295
Nullpriest of Oblivion | 7350 | 51835 | 0.122
Vampire Cutthroat | 7058 | 51835 | 0.1176
Bloodline Necromancer | 6684 | 51835 | 0.1115
```

### Instants (tag `instants`) - 34 cartas

nome | inclusão % | sinergia %
Path to Exile | 48.3 | +1.2
Anguished Unmaking | 42.1 | +8.6
Dark Ritual | 36.1 | +18.5
Village Rites | 35.2 | +23.9
Teferi's Protection | 31.1 | +12.4
Vampiric Tutor | 28.9 | +14.9
Boros Charm | 27.5 | -1.5
Mortify | 23.9 | +8.9
Akroma's Will | 20.7 | +6.6
Deadly Dispute | 16.6 | -5.9
Crackling Doom | 13.0 | -4.0
Enlightened Tutor | 11.8 | +0.4
Despark | 10.9 | -2.2
Terminate | 10.9 | -1.1
Generous Gift | 9.7 | -7.3
Corrupted Conviction | 9.2 | +4.7
Culling the Weak | 9.1 | +4.6
Dawn's Truce | 8.8 | +2.0
Go for the Throat | 8.8 | +6.1
Flawless Maneuver | 8.7 | -6.2
Fracture | 8.6 | +2.8
Return to Dust | 8.1 | +5.7
Chaos Warp | 7.9 | -7.9
Clever Concealment | 7.9 | +3.2
Utter End | 7.4 | +3.4
Vampires' Vengeance | 7.3 | +6.2
Stroke of Midnight | 6.8 | -4.7
Plumb the Forbidden | 6.6 | +3.2
Infernal Grasp | 6.5 | +4.3
Abrade | 6.4 | +0.2
Fell the Profane | 6.4 | -0.3
And They Shall Know No Fear | 6.3 | +5.1
Rakdos Charm | 5.8 | -3.5
Deflecting Swat | 5.3 | -11.1

Valores brutos transcritos de Instants (nome | num_decks | potential_decks | synergy):
```
Path to Exile | 25016 | 51835 | 0.012
Anguished Unmaking | 21805 | 51835 | 0.0855
Dark Ritual | 18689 | 51835 | 0.1848
Village Rites | 18240 | 51835 | 0.2393
Teferi's Protection | 16118 | 51835 | 0.1236
Vampiric Tutor | 14974 | 51835 | 0.1488
Boros Charm | 14239 | 51835 | -0.0154
Mortify | 12408 | 51835 | 0.0888
Akroma's Will | 10717 | 51835 | 0.0664
Deadly Dispute | 8612 | 51835 | -0.0591
Crackling Doom | 6753 | 51835 | -0.0396
Enlightened Tutor | 6125 | 51835 | 0.0045
Despark | 5670 | 51835 | -0.0217
Terminate | 5660 | 51835 | -0.0107
Generous Gift | 5015 | 51835 | -0.0726
Corrupted Conviction | 4751 | 51835 | 0.0471
Culling the Weak | 4711 | 51835 | 0.0464
Dawn's Truce | 4568 | 51835 | 0.0199
Go for the Throat | 4558 | 51835 | 0.0608
Flawless Maneuver | 4495 | 51835 | -0.0625
Fracture | 4445 | 51835 | 0.028
Return to Dust | 4221 | 51835 | 0.0566
Chaos Warp | 4092 | 51835 | -0.0789
Clever Concealment | 4071 | 51835 | 0.0321
Utter End | 3854 | 51835 | 0.0338
Vampires' Vengeance | 3771 | 51835 | 0.0625
Stroke of Midnight | 3542 | 51835 | -0.0471
Plumb the Forbidden | 3420 | 51835 | 0.0318
Infernal Grasp | 3373 | 51835 | 0.0429
Abrade | 3330 | 51835 | 0.0023
Fell the Profane | 3302 | 51835 | -0.0028
And They Shall Know No Fear | 3275 | 51835 | 0.0512
Rakdos Charm | 2995 | 51835 | -0.0351
Deflecting Swat | 2757 | 51835 | -0.1107
```

### Sorceries (tag `sorceries`) - 28 cartas

nome | inclusão % | sinergia %
Olivia's Wrath | 55.4 | +48.1
New Blood | 34.7 | +30.1
Demonic Tutor | 29.2 | +10.8
Damn | 28.8 | +11.5
Ruinous Ultimatum | 24.3 | -14.9
Pact of the Serpent | 24.1 | +20.7
Diabolic Intent | 22.5 | +13.1
Blood Tribute | 17.0 | +14.6
Kindred Dominance | 16.5 | +13.8
Blasphemous Act | 16.4 | -7.2
Night's Whisper | 14.2 | +0.5
Exsanguinate | 13.6 | +10.0
Reanimate | 11.4 | -6.9
Sign in Blood | 10.9 | +3.2
Toxic Deluge | 10.6 | +2.5
Diabolic Tutor | 9.3 | +3.7
Victimize | 8.9 | +0.3
Farewell | 8.7 | -0.7
Read the Bones | 8.7 | +0.6
Vandalblast | 8.6 | -1.5
Patriarch's Bidding | 8.6 | +7.1
Vindicate | 8.4 | +2.8
Bloodline Bidding | 7.9 | +6.6
Austere Command | 7.9 | +1.1
Feed the Swarm | 7.7 | +2.8
Merciless Eviction | 7.4 | +5.1
Blasphemous Edict | 7.2 | +3.5
Grim Tutor | 6.9 | +3.1

Valores brutos transcritos de Sorceries (nome | num_decks | potential_decks | synergy):
```
Olivia's Wrath | 28708 | 51835 | 0.4807
New Blood | 17994 | 51835 | 0.3013
Demonic Tutor | 15124 | 51835 | 0.1075
Damn | 14933 | 51835 | 0.1152
Ruinous Ultimatum | 12603 | 51835 | -0.1493
Pact of the Serpent | 12502 | 51835 | 0.2067
Diabolic Intent | 11687 | 51835 | 0.1307
Blood Tribute | 8810 | 51835 | 0.1465
Kindred Dominance | 8533 | 51835 | 0.1382
Blasphemous Act | 8482 | 51835 | -0.0723
Night's Whisper | 7360 | 51835 | 0.0054
Exsanguinate | 7033 | 51835 | 0.0995
Reanimate | 5895 | 51835 | -0.0692
Sign in Blood | 5668 | 51835 | 0.0325
Toxic Deluge | 5508 | 51835 | 0.0249
Diabolic Tutor | 4810 | 51835 | 0.037
Victimize | 4623 | 51835 | 0.0027
Farewell | 4522 | 51835 | -0.0065
Read the Bones | 4498 | 51835 | 0.0061
Vandalblast | 4474 | 51835 | -0.0154
Patriarch's Bidding | 4471 | 51835 | 0.0707
Vindicate | 4349 | 51835 | 0.0282
Bloodline Bidding | 1938 | 24399 | 0.066
Austere Command | 4111 | 51835 | 0.011
Feed the Swarm | 3967 | 51835 | 0.0283
Merciless Eviction | 3856 | 51835 | 0.0506
Blasphemous Edict | 3721 | 51363 | 0.0347
Grim Tutor | 3554 | 51835 | 0.0306
```

### Utility Artifacts (tag `utilityartifacts`) - 6 cartas

nome | inclusão % | sinergia %
Skullclamp | 61.4 | +32.1
Herald's Horn | 33.4 | +27.3
Blade of the Bloodchief | 30.7 | +26.4
Vanquisher's Banner | 28.2 | +23.5
Bolas's Citadel | 20.2 | +13.3
Phyrexian Altar | 19.7 | +12.9

Valores brutos transcritos de Utility Artifacts (nome | num_decks | potential_decks | synergy):
```
Skullclamp | 31837 | 51835 | 0.3207
Herald's Horn | 17287 | 51835 | 0.2725
Blade of the Bloodchief | 15902 | 51835 | 0.2635
Vanquisher's Banner | 14643 | 51835 | 0.235
Bolas's Citadel | 10467 | 51835 | 0.1331
Phyrexian Altar | 10195 | 51835 | 0.1288
```

Observação sobre Utility Artifacts (no JSON): a 7a carta visível, Banner of Kinship, aparece cortada antes de num_decks, potential_decks e synergy; inclusão e sinergia no JSON: não conferido. Depois dela, no JSON: não conferido (a inclusão da 7a carta e das seguintes vem do Complemento abaixo).

### Complemento: listas que o JSON cortou, lidas na página HTML do EDHREC

Fonte: https://edhrec.com/commanders/edgar-markov (WebFetch, 2026-10-14). Esta URL não estava no pedido; foi usada porque o JSON não passa do corte. Os números dessa página coincidem com os do JSON nas 6 cartas de Utility Artifacts em comum e o total de decks é o mesmo (51.835).
Chamada de rede gasta: 1 (chamada nº 25).

O que a página trouxe:
- Número de decks, literal: "51,835decks" (cabeçalho da página) e "EDH deck recommendations from 51,835 Commander decks." (meta description). A data "Oct 12, 2026" que o resumidor viu está ao lado da assinatura de um artigo da página, não é data dos dados; data de coleta dos dados: não conferido.
- Seções de cartas, na ordem da página: um primeiro grupo de 5 cartas sem título (a navegação da página o chama de "New Cards"), Top Cards, High Lift Cards, Creatures, Instants, Sorceries, Utility Artifacts, Enchantments, Planeswalkers, Utility Lands, Mana Artifacts, Lands. Não há lista "Game Changers" nem "Battles" (a expressão só aparece na navegação e nos filtros). A seção "Artifacts" pedida corresponde a "Utility Artifacts".
- Sinergia: o texto da página não mostrou sinergia % nas cartas (o resumidor devolveu "n/a"). Sinergia % dessas listas na fonte EDHREC: não conferido. A edh.wiki (seção 2) traz sinergia para as mesmas seções, mas é outro conjunto de dados.
- Inclusão: a página mostra números inteiros a partir de 10% e uma casa decimal abaixo de 10%. Conferi por script que cada percentual bate com "decks com a carta / decks do universo da carta" dentro do arredondamento, e que todas as listas estão em ordem decrescente de inclusão. Contagens: Utility Artifacts 20, Enchantments 30, Planeswalkers 7, Utility Lands 16, Mana Artifacts 13, Lands 50 (conferidas por script).
- Utility Artifacts: a página traz 20 cartas e inclui a 7a, Banner of Kinship (18%, 9K de 51.4K decks), que o JSON cortou. As 6 primeiras estão na mesma ordem do JSON (acima).
- O "universo" da carta (último número de cada linha) é menor que 51.8K para algumas cartas (ex.: Chronicle of Victory, 24.4K; All-Out Assault, 43.1K; Elspeth, Storm Slayer, 43.1K); o motivo não consta no texto lido.

##### Utility Artifacts (EDHREC, página HTML) - 20 cartas

nome | inclusão % | sinergia %
Skullclamp | 61 | não conferido
Herald's Horn | 33 | não conferido
Blade of the Bloodchief | 31 | não conferido
Vanquisher's Banner | 28 | não conferido
Bolas's Citadel | 20 | não conferido
Phyrexian Altar | 20 | não conferido
Banner of Kinship | 18 | não conferido
Door of Destinies | 17 | não conferido
Idol of Oblivion | 15 | não conferido
Urza's Incubator | 14 | não conferido
Swiftfoot Boots | 14 | não conferido
Lightning Greaves | 12 | não conferido
Ashnod's Altar | 12 | não conferido
Coat of Arms | 10 | não conferido
The One Ring | 10 | não conferido
Bontu's Monument | 8.6 | não conferido
Chronicle of Victory | 8.5 | não conferido
Glass-Cast Heart | 8.2 | não conferido
Jet Medallion | 7.5 | não conferido
Heirloom Blade | 5.0 | não conferido

Valores como a página os mostra em Utility Artifacts (nome | inclusão | decks com a carta | decks do universo da carta):
```
Skullclamp | 61% | 31.8K | 51.8K
Herald's Horn | 33% | 17.3K | 51.8K
Blade of the Bloodchief | 31% | 15.9K | 51.8K
Vanquisher's Banner | 28% | 14.6K | 51.8K
Bolas's Citadel | 20% | 10.5K | 51.8K
Phyrexian Altar | 20% | 10.2K | 51.8K
Banner of Kinship | 18% | 9K | 51.4K
Door of Destinies | 17% | 8.91K | 51.8K
Idol of Oblivion | 15% | 7.72K | 51.8K
Urza's Incubator | 14% | 7.41K | 51.8K
Swiftfoot Boots | 14% | 7.13K | 51.8K
Lightning Greaves | 12% | 6.13K | 51.8K
Ashnod's Altar | 12% | 6.08K | 51.8K
Coat of Arms | 10% | 5.40K | 51.8K
The One Ring | 10% | 4.96K | 51.8K
Bontu's Monument | 8.6% | 4.45K | 51.8K
Chronicle of Victory | 8.5% | 2.07K | 24.4K
Glass-Cast Heart | 8.2% | 4.23K | 51.8K
Jet Medallion | 7.5% | 3.90K | 51.8K
Heirloom Blade | 5.0% | 2.61K | 51.8K
```

##### Enchantments (EDHREC, página HTML) - 30 cartas

nome | inclusão % | sinergia %
Exquisite Blood | 51 | não conferido
Sanguine Bond | 45 | não conferido
Shared Animosity | 36 | não conferido
Phyrexian Arena | 29 | não conferido
Anointed Procession | 27 | não conferido
Black Market Connections | 24 | não conferido
Stensia Masquerade | 24 | não conferido
Smothering Tithe | 23 | não conferido
Cathars' Crusade | 20 | não conferido
Impact Tremors | 20 | não conferido
Warleader's Call | 18 | não conferido
Legion's Landing | 17 | não conferido
The Meathook Massacre | 15 | não conferido
Etchings of the Chosen | 14 | não conferido
Vampiric Rites | 13 | não conferido
Cover of Darkness | 11 | não conferido
Necropotence | 11 | não conferido
Grave Pact | 11 | não conferido
March of the Canonized | 9.5 | não conferido
Blind Obedience | 8.8 | não conferido
Renewed Solidarity | 7.9 | não conferido
Black Market | 6.6 | não conferido
Radiant Destiny | 6.5 | não conferido
Caretaker's Talent | 6.4 | não conferido
Authority of the Consuls | 6.0 | não conferido
Tocasia's Welcome | 5.8 | não conferido
Dictate of Erebos | 5.6 | não conferido
All-Out Assault | 5.5 | não conferido
Kindred Boon | 5.4 | não conferido
Bastion of Remembrance | 5.3 | não conferido

Valores como a página os mostra em Enchantments (nome | inclusão | decks com a carta | decks do universo da carta):
```
Exquisite Blood | 51% | 26.5K | 51.8K
Sanguine Bond | 45% | 23.5K | 51.8K
Shared Animosity | 36% | 18.6K | 51.8K
Phyrexian Arena | 29% | 14.8K | 51.8K
Anointed Procession | 27% | 13.9K | 51.8K
Black Market Connections | 24% | 12.5K | 51.8K
Stensia Masquerade | 24% | 12.3K | 51.8K
Smothering Tithe | 23% | 12K | 51.8K
Cathars' Crusade | 20% | 10.6K | 51.8K
Impact Tremors | 20% | 10.5K | 51.8K
Warleader's Call | 18% | 9.46K | 51.8K
Legion's Landing | 17% | 8.95K | 51.8K
The Meathook Massacre | 15% | 7.68K | 51.8K
Etchings of the Chosen | 14% | 7.03K | 51.8K
Vampiric Rites | 13% | 6.50K | 51.8K
Cover of Darkness | 11% | 5.90K | 51.8K
Necropotence | 11% | 5.67K | 51.8K
Grave Pact | 11% | 5.51K | 51.8K
March of the Canonized | 9.5% | 4.91K | 51.8K
Blind Obedience | 8.8% | 4.58K | 51.8K
Renewed Solidarity | 7.9% | 3.84K | 48.7K
Black Market | 6.6% | 3.44K | 51.8K
Radiant Destiny | 6.5% | 3.38K | 51.8K
Caretaker's Talent | 6.4% | 3.31K | 51.8K
Authority of the Consuls | 6.0% | 3.10K | 51.8K
Tocasia's Welcome | 5.8% | 2.99K | 51.8K
Dictate of Erebos | 5.6% | 2.89K | 51.8K
All-Out Assault | 5.5% | 2.35K | 43.1K
Kindred Boon | 5.4% | 2.81K | 51.8K
Bastion of Remembrance | 5.3% | 2.75K | 51.8K
```

##### Planeswalkers (EDHREC, página HTML) - 7 cartas

nome | inclusão % | sinergia %
Sorin, Imperious Bloodlord | 47 | não conferido
Sorin, Lord of Innistrad | 19 | não conferido
Sorin, Vengeful Bloodlord | 10 | não conferido
Sorin Markov | 7.6 | não conferido
Sorin the Mirthless | 7.1 | não conferido
Elspeth, Storm Slayer | 5.2 | não conferido
Sorin, Solemn Visitor | 5.0 | não conferido

Valores como a página os mostra em Planeswalkers (nome | inclusão | decks com a carta | decks do universo da carta):
```
Sorin, Imperious Bloodlord | 47% | 24.3K | 51.8K
Sorin, Lord of Innistrad | 19% | 9.79K | 51.8K
Sorin, Vengeful Bloodlord | 10% | 4.95K | 51.8K
Sorin Markov | 7.6% | 3.93K | 51.8K
Sorin the Mirthless | 7.1% | 3.71K | 51.8K
Elspeth, Storm Slayer | 5.2% | 2.24K | 43.1K
Sorin, Solemn Visitor | 5.0% | 2.61K | 51.8K
```

##### Utility Lands (EDHREC, página HTML) - 16 cartas

nome | inclusão % | sinergia %
Bojuka Bog | 40 | não conferido
Vault of the Archangel | 33 | não conferido
Three Tree City | 30 | não conferido
Phyrexian Tower | 28 | não conferido
Urborg, Tomb of Yawgmoth | 27 | não conferido
Reliquary Tower | 14 | não conferido
Rogue's Passage | 13 | não conferido
Cabal Coffers | 10 | não conferido
Ancient Tomb | 10 | não conferido
Castle Locthwain | 8.9 | não conferido
Minas Tirith | 8.2 | não conferido
Takenuma, Abandoned Mire | 8.2 | não conferido
Temple of the False God | 8.0 | não conferido
Westvale Abbey | 7.9 | não conferido
Accursed Duneyard | 7.3 | não conferido
Windbrisk Heights | 7.0 | não conferido

Valores como a página os mostra em Utility Lands (nome | inclusão | decks com a carta | decks do universo da carta):
```
Bojuka Bog | 40% | 20.6K | 51.8K
Vault of the Archangel | 33% | 16.9K | 51.8K
Three Tree City | 30% | 15.5K | 51.8K
Phyrexian Tower | 28% | 14.4K | 51.8K
Urborg, Tomb of Yawgmoth | 27% | 14.2K | 51.8K
Reliquary Tower | 14% | 7.25K | 51.8K
Rogue's Passage | 13% | 6.88K | 51.8K
Cabal Coffers | 10% | 5.29K | 51.8K
Ancient Tomb | 10% | 5.03K | 51.8K
Castle Locthwain | 8.9% | 4.61K | 51.8K
Minas Tirith | 8.2% | 4.27K | 51.8K
Takenuma, Abandoned Mire | 8.2% | 4.22K | 51.8K
Temple of the False God | 8.0% | 4.14K | 51.8K
Westvale Abbey | 7.9% | 4.12K | 51.8K
Accursed Duneyard | 7.3% | 3.56K | 48.7K
Windbrisk Heights | 7.0% | 3.63K | 51.8K
```

##### Mana Artifacts (EDHREC, página HTML) - 13 cartas

nome | inclusão % | sinergia %
Sol Ring | 92 | não conferido
Arcane Signet | 80 | não conferido
Talisman of Hierarchy | 32 | não conferido
Orzhov Signet | 32 | não conferido
Rakdos Signet | 26 | não conferido
Talisman of Indulgence | 24 | não conferido
Patchwork Banner | 22 | não conferido
Talisman of Conviction | 16 | não conferido
Fellwar Stone | 16 | não conferido
Boros Signet | 16 | não conferido
Commander's Sphere | 14 | não conferido
Chromatic Lantern | 11 | não conferido
Mind Stone | 5.7 | não conferido

Valores como a página os mostra em Mana Artifacts (nome | inclusão | decks com a carta | decks do universo da carta):
```
Sol Ring | 92% | 47.6K | 51.8K
Arcane Signet | 80% | 41.5K | 51.8K
Talisman of Hierarchy | 32% | 16.8K | 51.8K
Orzhov Signet | 32% | 16.6K | 51.8K
Rakdos Signet | 26% | 13.6K | 51.8K
Talisman of Indulgence | 24% | 12.6K | 51.8K
Patchwork Banner | 22% | 11.5K | 51.8K
Talisman of Conviction | 16% | 8.50K | 51.8K
Fellwar Stone | 16% | 8.38K | 51.8K
Boros Signet | 16% | 8.23K | 51.8K
Commander's Sphere | 14% | 7.39K | 51.8K
Chromatic Lantern | 11% | 5.88K | 51.8K
Mind Stone | 5.7% | 2.97K | 51.8K
```

##### Lands (EDHREC, página HTML) - 50 cartas

nome | inclusão % | sinergia %
Swamp | 98 | não conferido
Plains | 95 | não conferido
Command Tower | 92 | não conferido
Mountain | 89 | não conferido
Path of Ancestry | 61 | não conferido
Voldaren Estate | 58 | não conferido
Godless Shrine | 53 | não conferido
Isolated Chapel | 52 | não conferido
Blood Crypt | 50 | não conferido
Nomad Outpost | 45 | não conferido
Sacred Foundry | 44 | não conferido
Unclaimed Territory | 43 | não conferido
Dragonskull Summit | 42 | não conferido
Secluded Courtyard | 42 | não conferido
Caves of Koilos | 38 | não conferido
Exotic Orchard | 38 | não conferido
Bloodstained Mire | 36 | não conferido
Savai Triome | 36 | não conferido
Vault of Champions | 36 | não conferido
Cavern of Souls | 34 | não conferido
Luxury Suite | 34 | não conferido
Marsh Flats | 34 | não conferido
Shattered Sanctum | 30 | não conferido
Arid Mesa | 30 | não conferido
Smoldering Marsh | 28 | não conferido
Clifftop Retreat | 28 | não conferido
Sulfurous Springs | 27 | não conferido
Haunted Ridge | 27 | não conferido
Spectator Seating | 26 | não conferido
Battlefield Forge | 25 | não conferido
Evolving Wilds | 24 | não conferido
Sundown Pass | 22 | não conferido
Orzhov Basilica | 20 | não conferido
Tainted Field | 20 | não conferido
Temple of Silence | 19 | não conferido
Blazemire Verge | 17 | não conferido
Bloodfell Caves | 17 | não conferido
Scoured Barrens | 16 | não conferido
Fetid Heath | 16 | não conferido
Terramorphic Expanse | 16 | não conferido
Rakdos Carnarium | 14 | não conferido
Shineshadow Snarl | 13 | não conferido
City of Brass | 13 | não conferido
Wind-Scarred Crag | 13 | não conferido
Foreboding Ruins | 12 | não conferido
Mana Confluence | 12 | não conferido
Temple of Malice | 12 | não conferido
Bleachbone Verge | 12 | não conferido
Scrubland | 12 | não conferido
Badlands | 12 | não conferido

Valores como a página os mostra em Lands (nome | inclusão | decks com a carta | decks do universo da carta):
```
Swamp | 98% | 50.6K | 51.8K
Plains | 95% | 49K | 51.8K
Command Tower | 92% | 47.5K | 51.8K
Mountain | 89% | 46.3K | 51.8K
Path of Ancestry | 61% | 31.8K | 51.8K
Voldaren Estate | 58% | 29.9K | 51.8K
Godless Shrine | 53% | 27.4K | 51.8K
Isolated Chapel | 52% | 27.2K | 51.8K
Blood Crypt | 50% | 25.9K | 51.8K
Nomad Outpost | 45% | 23.4K | 51.8K
Sacred Foundry | 44% | 22.7K | 51.8K
Unclaimed Territory | 43% | 22.4K | 51.8K
Dragonskull Summit | 42% | 21.8K | 51.8K
Secluded Courtyard | 42% | 21.5K | 51.8K
Caves of Koilos | 38% | 19.9K | 51.8K
Exotic Orchard | 38% | 19.6K | 51.8K
Bloodstained Mire | 36% | 18.9K | 51.8K
Savai Triome | 36% | 18.6K | 51.8K
Vault of Champions | 36% | 18.6K | 51.8K
Cavern of Souls | 34% | 17.6K | 51.8K
Luxury Suite | 34% | 17.4K | 51.8K
Marsh Flats | 34% | 17.4K | 51.8K
Shattered Sanctum | 30% | 15.8K | 51.8K
Arid Mesa | 30% | 15.6K | 51.8K
Smoldering Marsh | 28% | 14.4K | 51.8K
Clifftop Retreat | 28% | 14.3K | 51.8K
Sulfurous Springs | 27% | 13.8K | 51.8K
Haunted Ridge | 27% | 13.8K | 51.8K
Spectator Seating | 26% | 13.4K | 51.8K
Battlefield Forge | 25% | 13K | 51.8K
Evolving Wilds | 24% | 12.3K | 51.8K
Sundown Pass | 22% | 11.2K | 51.8K
Orzhov Basilica | 20% | 10.5K | 51.8K
Tainted Field | 20% | 10.2K | 51.8K
Temple of Silence | 19% | 9.59K | 51.8K
Blazemire Verge | 17% | 8.95K | 51.8K
Bloodfell Caves | 17% | 8.66K | 51.8K
Scoured Barrens | 16% | 8.44K | 51.8K
Fetid Heath | 16% | 8.27K | 51.8K
Terramorphic Expanse | 16% | 8.05K | 51.8K
Rakdos Carnarium | 14% | 7.28K | 51.8K
Shineshadow Snarl | 13% | 6.96K | 51.8K
City of Brass | 13% | 6.73K | 51.8K
Wind-Scarred Crag | 13% | 6.56K | 51.8K
Foreboding Ruins | 12% | 6.31K | 51.8K
Mana Confluence | 12% | 6.28K | 51.8K
Temple of Malice | 12% | 6.28K | 51.8K
Bleachbone Verge | 12% | 5.85K | 48.8K
Scrubland | 12% | 6.21K | 51.8K
Badlands | 12% | 6.17K | 51.8K
```


---

## 2. edh.wiki: edh.wiki/commanders/edgar-markov/vampires/

Fonte: https://edh.wiki/commanders/edgar-markov/vampires/ (WebFetch, 2026-10-14)
Chamadas de rede gastas nesta seção: 1 (chamada nº 5).
Status: lida inteira (segundo o resumidor, o texto não veio cortado: termina em "Similar Commanders" e no rodapé).

### Notas de leitura

- Número de decks: a página não traz frase do tipo "baseado em N decks" nem data de coleta dos dados (o único ano no texto é o do rodapé, "© EDH.Wiki 2026", que não é data dos dados). Número de decks do tema Vampires: não conferido. O que a página mostra de contagem:
  - Brackets: Exhibition (bracket 1) 97 decks; Core (bracket 2) 3.466; Upgraded (bracket 3) 5.647; Optimized (bracket 4) 4.163; cEDH (bracket 5) 231 (soma 13.604).
  - Budget: "$" 5.179 decks; "$$$" 5.179 decks.
  - Inferência minha, não conferida: no JSON do EDHREC (seção 1) 5.183 é 10% de 51.835; se o mesmo valer aqui, o total seria cerca de 51.790 decks. Os números são parecidos com os do JSON (bracket_counts 97 / 3.460 / 5.660 / 4.168 / 231), mas não iguais, o que indica coleta em datas diferentes.
- Bloco "Playstyle & Strategy" da página (números soltos, sem rótulo na página): Vampires 31%, Lifegain 17%, Tokens 12%, Aggro 9%, Aristocrats 8%. Rótulo "Price tag" no título: $44.39 (o que esse valor representa: não conferido).
- Rótulos de cada carta na página: "+X% Synergy" e "in X% of decks", sempre inteiros. Aqui: nome | inclusão % | sinergia %. As listas vêm em ordem decrescente de sinergia (conferi, sem exceção). A página também mostra um preço em $ por carta; não gravei (sem fonte nem data do preço).
- Seções da página, na ordem: New Cards, High Synergy Cards, Top Cards, Game Changers, Creatures, Instants, Sorceries, Utility Artifacts, Enchantments, Planeswalkers, Utility Lands, Mana Artifacts, Lands, Similar Commanders (só nomes, não transcrita). A seção Game Changers (10 cartas) não apareceu no trecho legível do JSON da seção 1.
- Lista média: não conferido. A página só traz o link "View Average Decklist"; a lista em si não está no texto lido (e o destino do link não foi aberto).
- Transcrição feita pelo modelo auxiliar do WebFetch. Conferências: contagens por lista = 5, 10, 10, 10, 50, 29, 29, 18, 29, 7, 15, 12, 50; sinergia em ordem decrescente em todas as listas.
- Comparação com o JSON do EDHREC (seção 1), nas 133 cartas presentes nas duas fontes: a inclusão da edh.wiki é em média 1,8 ponto percentual maior (mediana 1,5; de -11,7 a +12,9), e a sinergia, 1,6 ponto maior (de -11,6 a +12,6). Maiores divergências de inclusão (edh.wiki vs JSON): Teferi's Protection 44% vs 31,1%; Marauding Blight-Priest 16% vs 27,7%; Vengeful Bloodwitch 25% vs 34,1%; Demonic Tutor 38% vs 29,2%; Vampiric Tutor 37% vs 28,9%. A página não diz de que recorte ou data vêm os números; a URL termina em /vampires/ (página do tema Vampires), o que pode explicar parte da diferença, mas isso é suposição minha. As duas fontes não foram conciliadas: use cada uma com a sua origem citada.
- Comparação com a página HTML do EDHREC (Complemento da seção 1), nas 125 cartas em comum das listas Utility Artifacts, Enchantments, Planeswalkers, Utility Lands, Mana Artifacts e Lands: a inclusão da edh.wiki é em média 1,7 ponto percentual maior (mediana 1,0; de -4,0 a +11,0), com o mesmo sentido em todas as listas. Maiores diferenças (edh.wiki vs EDHREC): Savai Triome 47% vs 36%; Anointed Procession 37% vs 27%; Urborg, Tomb of Yawgmoth 36% vs 27%; Vault of Champions 45% vs 36%; Cavern of Souls 43% vs 34%; Marsh Flats 43% vs 34%.

### New Cards - 5 cartas

nome | inclusão % | sinergia %
Scheming Silvertongue | 30 | +26
Emeritus of Woe | 24 | +19
Stensian Sanguinist | 14 | +12
Arnyn, Deathbloom Botanist | 10 | +8
Erode | 4 | 0

### High Synergy Cards - 10 cartas

nome | inclusão % | sinergia %
Cordial Vampire | 85 | +74
Captivating Vampire | 83 | +72
Stromkirk Captain | 81 | +71
Blood Artist | 83 | +65
Legion Lieutenant | 74 | +64
Sanctum Seeker | 72 | +63
Indulgent Aristocrat | 72 | +62
Welcoming Vampire | 74 | +62
Bloodline Keeper | 70 | +61
Vito, Thorn of the Dusk Rose | 68 | +57

### Top Cards - 10 cartas

nome | inclusão % | sinergia %
Master of Dark Rites | 64 | +56
Elenda, the Dusk Rose | 65 | +55
Cruel Celebrant | 66 | +53
Drana, Liberator of Malakir | 61 | +52
Edgar, Charmed Groom | 59 | +52
Charismatic Conqueror | 62 | +51
Malakir Bloodwitch | 58 | +51
Olivia's Wrath | 56 | +48
Skullclamp | 66 | +37
Swords to Plowshares | 70 | +8

### Game Changers - 10 cartas

nome | inclusão % | sinergia %
Teferi's Protection | 44 | +25
Vampiric Tutor | 37 | +23
Demonic Tutor | 38 | +19
Bolas's Citadel | 22 | +15
Smothering Tithe | 31 | +6
Necropotence | 12 | +6
Ancient Tomb | 13 | +5
Enlightened Tutor | 16 | +4
The One Ring | 11 | +3
Farewell | 11 | +1

### Creatures - 50 cartas

nome | inclusão % | sinergia %
Clavileño, First of the Blessed | 54 | +47
Markov Baron | 52 | +45
Vampire of the Dire Moon | 50 | +44
Twilight Prophet | 50 | +43
Bloodthirsty Conqueror | 49 | +42
Mavren Fein, Dusk Apostle | 48 | +42
Vampire Socialite | 47 | +41
Champion of Dusk | 46 | +40
Bloodletter of Aclazotz | 45 | +36
Patron of the Vein | 41 | +36
Viscera Seer | 49 | +35
Forerunner of the Legion | 39 | +34
Yahenni, Undying Partisan | 41 | +33
Rakish Heir | 36 | +32
Knight of the Ebon Legion | 36 | +31
Vampire Nighthawk | 32 | +27
Anowon, the Ruin Sage | 31 | +27
Baron Bertram Graywater | 30 | +26
Ruthless Lawbringer | 28 | +23
Crossway Troublemakers | 27 | +23
Butcher of Malakir | 26 | +22
Olivia, Crimson Bride | 25 | +21
Olivia Voldaren | 25 | +21
Vein Ripper | 24 | +20
Florian, Voldaren Scion | 23 | +20
Vengeful Bloodwitch | 25 | +19
Falkenrath Pit Fighter | 22 | +19
Gifted Aetherborn | 20 | +18
Vampire Nocturnus | 20 | +18
Nighthawk Scavenger | 22 | +17
Dusk Legion Zealot | 20 | +17
Qarsi Revenant | 20 | +17
Preacher of the Schism | 20 | +17
Oathsworn Vampire | 20 | +17
Drana and Linvala | 25 | +16
Bartolomé del Presidio | 20 | +16
Vampire Gourmand | 19 | +16
Creeping Bloodsucker | 19 | +16
Elenda's Hierophant | 19 | +16
Roaming Throne | 21 | +15
Falkenrath Noble | 18 | +15
Elenda, Saint of Dusk | 17 | +15
Shadow Alley Denizen | 17 | +14
Bloodghast | 16 | +14
Vampire Cutthroat | 16 | +14
Carmen, Cruel Skymarcher | 17 | +13
Dusk Legion Duelist | 15 | +13
Nullpriest of Oblivion | 15 | +13
Marauding Blight-Priest | 16 | +12
Sanguine Syphoner | 14 | +12

### Instants - 29 cartas

nome | inclusão % | sinergia %
Village Rites | 29 | +18
Dark Ritual | 33 | +16
Anguished Unmaking | 49 | +15
Mortify | 26 | +11
And They Shall Know No Fear | 11 | +10
Akroma's Will | 21 | +8
Go for the Throat | 10 | +7
Return to Dust | 8 | +6
Vampires' Vengeance | 6 | +5
Path to Exile | 51 | +4
Corrupted Conviction | 9 | +4
Utter End | 7 | +3
Plumb the Forbidden | 7 | +3
Dawn's Truce | 9 | +2
Fracture | 8 | +2
Culling the Weak | 7 | +2
Fell the Profane | 8 | +1
Clever Concealment | 6 | +1
Boros Charm | 28 | -1
Crackling Doom | 15 | -2
Despark | 12 | -2
Terminate | 10 | -3
Stroke of Midnight | 7 | -4
Rakdos Charm | 5 | -4
Flawless Maneuver | 9 | -6
Generous Gift | 11 | -7
Chaos Warp | 9 | -7
Deadly Dispute | 14 | -8
Deflecting Swat | 6 | -10

### Sorceries - 29 cartas

nome | inclusão % | sinergia %
New Blood | 40 | +36
Pact of the Serpent | 26 | +23
Blood Tribute | 21 | +18
Kindred Dominance | 20 | +18
Diabolic Intent | 24 | +14
Damn | 30 | +12
Patriarch's Bidding | 11 | +9
Exsanguinate | 12 | +8
Bloodline Bidding | 10 | +8
Blasphemous Edict | 12 | +7
Merciless Eviction | 10 | +7
Kindred Charge | 6 | +5
Grim Tutor | 8 | +4
Vindicate | 9 | +3
Damnation | 5 | +3
Agadeem's Awakening | 5 | +3
Toxic Deluge | 11 | +2
Sign in Blood | 10 | +2
Diabolic Tutor | 8 | +2
Feed the Swarm | 7 | +2
Beseech the Mirror | 6 | +2
Night's Whisper | 14 | +1
Read the Bones | 10 | +1
Vandalblast | 11 | 0
Victimize | 8 | -1
Austere Command | 7 | -1
Reanimate | 10 | -7
Blasphemous Act | 14 | -9
Ruinous Ultimatum | 28 | -12

### Utility Artifacts - 18 cartas

nome | inclusão % | sinergia %
Herald's Horn | 40 | +34
Vanquisher's Banner | 36 | +30
Blade of the Bloodchief | 30 | +26
Door of Destinies | 24 | +22
Phyrexian Altar | 25 | +19
Banner of Kinship | 21 | +18
Urza's Incubator | 17 | +14
Coat of Arms | 15 | +13
Bontu's Monument | 10 | +8
Chronicle of Victory | 10 | +8
Glass-Cast Heart | 8 | +7
Ashnod's Altar | 14 | +6
Jet Medallion | 7 | +5
Eldrazi Monument | 6 | +5
Whip of Erebos | 6 | +2
Idol of Oblivion | 14 | +1
Lightning Greaves | 14 | -20
Swiftfoot Boots | 11 | -20

### Enchantments - 29 cartas

nome | inclusão % | sinergia %
Exquisite Blood | 54 | +46
Sanguine Bond | 47 | +39
Shared Animosity | 37 | +30
Anointed Procession | 37 | +24
Legion's Landing | 22 | +19
Stensia Masquerade | 21 | +18
Warleader's Call | 25 | +13
Cathars' Crusade | 20 | +13
Black Market Connections | 26 | +10
The Meathook Massacre | 14 | +9
Etchings of the Chosen | 12 | +9
Phyrexian Arena | 27 | +8
Grave Pact | 12 | +8
Vampiric Rites | 10 | +8
March of the Canonized | 10 | +8
Cover of Darkness | 10 | +7
Blind Obedience | 10 | +5
Caretaker's Talent | 10 | +5
Radiant Destiny | 6 | +5
Dictate of Erebos | 7 | +4
Kindred Boon | 5 | +4
Collective Inferno | 5 | +4
Impact Tremors | 19 | +3
Black Market | 8 | +3
Renewed Solidarity | 6 | +3
Phyrexian Reclamation | 5 | +3
Dazzling Theater // Prop Room | 5 | +3
Land Tax | 7 | 0
All-Out Assault | 7 | -5

### Planeswalkers - 7 cartas

nome | inclusão % | sinergia %
Sorin, Imperious Bloodlord | 44 | +38
Sorin, Lord of Innistrad | 19 | +16
Sorin, Vengeful Bloodlord | 12 | +10
Sorin Markov | 9 | +7
Sorin the Mirthless | 8 | +7
Sorin, Solemn Visitor | 6 | +5
Sorin, Grim Nemesis | 5 | +5

### Utility Lands - 15 cartas

nome | inclusão % | sinergia %
Three Tree City | 34 | +28
Urborg, Tomb of Yawgmoth | 36 | +23
Phyrexian Tower | 32 | +22
Bojuka Bog | 42 | +11
Cabal Coffers | 14 | +11
Vault of the Archangel | 32 | +10
Castle Locthwain | 10 | +7
Westvale Abbey | 9 | +6
Accursed Duneyard | 5 | +4
Reliquary Tower | 17 | +2
Minas Tirith | 10 | +1
Takenuma, Abandoned Mire | 9 | +1
Temple of the False God | 7 | +1
Windbrisk Heights | 6 | -5
Rogue's Passage | 11 | -12

### Mana Artifacts - 12 cartas

nome | inclusão % | sinergia %
Patchwork Banner | 27 | +22
Chromatic Lantern | 16 | +5
Sol Ring | 93 | +4
Orzhov Signet | 34 | +4
Rakdos Signet | 30 | +1
Commander's Sphere | 15 | +1
Arcane Signet | 81 | -5
Talisman of Hierarchy | 32 | -9
Boros Signet | 19 | -9
Talisman of Indulgence | 25 | -12
Fellwar Stone | 15 | -13
Talisman of Conviction | 16 | -25

### Lands - 50 cartas

nome | inclusão % | sinergia %
Voldaren Estate | 61 | +53
Unclaimed Territory | 45 | +36
Cavern of Souls | 43 | +33
Secluded Courtyard | 40 | +32
Path of Ancestry | 62 | +24
Blood Crypt | 58 | +13
Vault of Champions | 45 | +13
Godless Shrine | 60 | +12
Marsh Flats | 43 | +11
Luxury Suite | 42 | +11
Savai Triome | 47 | +10
Bloodstained Mire | 43 | +10
Arid Mesa | 39 | +7
Haunted Ridge | 27 | +7
Orzhov Basilica | 20 | +7
Brightclimb Pathway | 16 | +7
Blightstep Pathway | 15 | +7
Blazemire Verge | 18 | +6
Sacred Foundry | 50 | +5
Rakdos Carnarium | 16 | +5
Mana Confluence | 14 | +5
Shattered Sanctum | 29 | +4
Tainted Field | 16 | +4
City of Brass | 15 | +4
Bloodfell Caves | 13 | +4
Scoured Barrens | 13 | +4
Swamp | 97 | +2
Spectator Seating | 33 | +2
Scrubland | 15 | +2
Badlands | 15 | +2
Sundown Pass | 22 | +1
Graven Cairns | 13 | +1
Plateau | 13 | +1
Command Tower | 93 | 0
Isolated Chapel | 53 | -1
Caves of Koilos | 38 | -1
Plains | 94 | -2
Sulfurous Springs | 25 | -4
Fetid Heath | 17 | -4
Mountain | 89 | -5
Terramorphic Expanse | 14 | -5
Evolving Wilds | 20 | -6
Shattered Landscape | 13 | -6
Temple of Silence | 15 | -7
Dragonskull Summit | 44 | -9
Smoldering Marsh | 26 | -11
Nomad Outpost | 46 | -12
Exotic Orchard | 36 | -17
Battlefield Forge | 22 | -18
Clifftop Retreat | 26 | -25

---

## 3. Precon original: Vampiric Bloodlust (Commander 2017)

Fontes:
- Lista usada: https://mtg.wtf/deck/c17/vampiric-bloodlust (WebFetch, 2026-10-14). Título da página: "Vampiric Bloodlust - Commander 2017 Commander Deck - mtg.wtf"; set "Commander 2017"; data de lançamento na página: "2017-08-25".
- Conferência 1 (lista completa): https://json.edhrec.com/pages/precon/vampiric-bloodlust.json (WebFetch, campo `deck.cards`; header "Vampiric Bloodlust Precon - Commander 2017", set "c17"). Mesmas 99 cartas fora o comandante, mesmas quantidades, nas seis categorias.
- Conferência 2 (parcial): https://mtg.wiki/page/Vampiric_Bloodlust (título "Commander 2017/Vampiric Bloodlust"). A página NÃO traz as 100 cartas; só as 17 "New cards" do deck e a frase "is a 100 card Commander preconstructed deck". As 17 estão todas na lista abaixo (conferido por script). Sobre comandantes, a página diz: "The primary commander is Edgar Markov, and the secondary commanders are Licia, Sanguine Tribune and Mathas, Fiend Seeker." (Licia e Mathas estão entre as 99 cartas abaixo.) A página cita como origem o artigo "Commander (2017 Edition) Decklists" (magicthegathering.com); esse artigo não foi aberto: não conferido.
Chamadas de rede gastas nesta seção: 4 (chamadas nº 6 a 9: EDHREC precon, mtg.wiki, 1 busca, mtg.wtf).
Status: completo, 100 cartas, em duas fontes (EDHREC JSON e mtg.wtf) que coincidem nome por nome (conferência visual das seis categorias) e quantidade a quantidade.

Observações:
- Soma conferida: 1 (comandante) + 26 criaturas + 7 instantâneos + 11 feitiços + 10 artefatos + 8 encantamentos + 37 terrenos = 100.
- A mtg.wtf lista ainda uma entrada "Display Commander (1)" com Edgar Markov repetido; ela não entra nas 100 (com ela a página somaria 101). O que a página quer dizer com "Display Commander": não conferido.
- Formato: uma linha por carta (quantidade, nome). Os terrenos básicos aparecem com quantidade (4 Mountain, 3 Plains, 8 Swamp); na mtg.wtf eles vinham fracionados em várias linhas (2+1+1, 1+1+1, 3+3+2), somados aqui.
- Cruzamento com a lista atual de Game Changers: ver seção 4 (feito lá).

### Comandante (1)

1 Edgar Markov

### Criaturas (26)

1 Anowon, the Ruin Sage
1 Blood Artist
1 Blood Baron of Vizkopa
1 Bloodhusk Ritualist
1 Bloodline Necromancer
1 Bloodlord of Vaasgoth
1 Bloodsworn Steward
1 Butcher of Malakir
1 Captivating Vampire
1 Crimson Honor Guard
1 Dark Impostor
1 Drana, Kalastria Bloodchief
1 Falkenrath Noble
1 Kheru Mind-Eater
1 Licia, Sanguine Tribune
1 Malakir Bloodwitch
1 Mathas, Fiend Seeker
1 Patron of the Vein
1 Pawn of Ulamog
1 Rakish Heir
1 Sangromancer
1 Skeletal Vampire
1 Stromkirk Captain
1 Tithe Drinker
1 Vampire Nighthawk
1 Vein Drinker

### Instantâneos (7)

1 Crackling Doom
1 Go for the Throat
1 Mortify
1 Return to Dust
1 Skeletal Scrying
1 Swords to Plowshares
1 Teferi's Protection

### Feitiços (11)

1 Ambition's Cost
1 Blood Tribute
1 Consuming Vapors
1 Damnable Pact
1 Disrupt Decorum
1 Fell the Mighty
1 Kindred Charge
1 Merciless Eviction
1 New Blood
1 Read the Bones
1 Syphon Mind

### Artefatos (10)

1 Blade of the Bloodchief
1 Boros Signet
1 Door of Destinies
1 Heirloom Blade
1 Orzhov Signet
1 Rakdos Signet
1 Skullclamp
1 Sol Ring
1 Well of Lost Dreams
1 Worn Powerstone

### Encantamentos (8)

1 Black Market
1 Blind Obedience
1 Curse of Disturbance
1 Curse of Vitality
1 Kindred Boon
1 Outpost Siege
1 Sanguine Bond
1 Underworld Connections

### Terrenos (37)

1 Akoum Refuge
1 Bloodfell Caves
1 Bojuka Bog
1 Boros Garrison
1 Boros Guildgate
1 Cinder Barrens
1 Command Tower
1 Evolving Wilds
1 Forsaken Sanctuary
1 Kabira Crossroads
4 Mountain
1 Nomad Outpost
1 Opal Palace
1 Orzhov Basilica
1 Orzhov Guildgate
1 Path of Ancestry
3 Plains
1 Rakdos Carnarium
1 Rakdos Guildgate
1 Scoured Barrens
1 Stone Quarry
8 Swamp
1 Terramorphic Expanse
1 Urborg Volcano
1 Wind-Scarred Crag

---

## 4. Game Changers (lista oficial atual)

Fontes:
- Lista de 53 cartas: ScrollVault, https://scrollvault.net/guides/game-changers.html (WebFetch, 2026-10-14). Título: "MTG Commander Game Changers List: All 53 Cards (October 2026)". Cabeçalho: "Verified October 11, 2026 against Scryfall". Rodapé: "Checked against Scryfall's `is:gamechanger` query on October 11, 2026." e "This check runs weekly and the date above is written by the refresh job" (ou seja, a data de verificação é escrita por rotina automática; não prova revisão humana). O navegador interativo da página não trouxe nomes no texto; os nomes abaixo vêm dos grupos estáticos da página.
- Oficial (magic.wizards.com, abertas em 2026-10-14):
  - "Commander Brackets Beta Update – February 9, 2026" (https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026): Farewell entra na lista; "The only other change at this time is that Biorhythm will be going on the Game Changers list." (a página diz que isso é o que fazem "when a card comes off the banned list"; o ScrollVault diz que Biorhythm foi desbanida e adicionada no mesmo dia); a página não menciona remoções; sobre a próxima atualização: "You can expect to hear from us again likely in May or June, with something after some of the MagicCons this year."
  - "Commander Brackets Beta Update – April 22, 2025" (https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-april-22-2025): 18 cartas adicionadas, 2 removidas (Trouble in Pairs, Trinisphere) e 5 desbanidas que também entram (Braids, Cabal Minion; Coalition Victory; Gifts Ungiven; Panoptic Mirror; Sway of the Stars).
  - "Commander Brackets Beta Update – October 21, 2025" (https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025): 10 removidas (Expropriate; Jin-Gitaxias, Core Augur; Sway of the Stars; Vorinclex, Voice of Hunger; Kinnan, Bonder Prodigy; Urza, Lord High Artificer; Winota, Joiner of Forces; Yuriko, the Tiger's Shadow; Deflecting Swat; Food Chain).
  - https://magic.wizards.com/en/formats/commander: a seção Game Changers só traz o texto de introdução, sem cartas e sem data no texto coletado (o resumidor disse que as listas provavelmente são carregadas dinamicamente). Lista completa atual em página oficial: não conferido. A lista inicial de fev/2025 (40 cartas) também não veio em nenhum texto oficial aberto.
  - https://magic.wizards.com/en/news/announcements/banned-and-restricted-october-12-2026: ver "Mudança depois de 09/02/2026".
- Conferência independente da lista: https://draftsim.com/mtg-edh-game-changers/ (WebFetch, 2026-10-14; "Last updated on May 19, 2026", modified_time 2026-05-20, published_time 2026-02-09). Tem os mesmos 53 nomes do ScrollVault (conferido por script); muda só o agrupamento: Serra's Sanctum e Gaea's Cradle aparecem em Colorless (14 cartas) e White e Green ficam com 6 cada; Tergrid aparece como "Tergrid, God of Fright / Tergrid's Lantern", que contei como uma entrada. O changelog da página vai de 11/02/2025 a 09/02/2026 e não tem entrada depois de 09/02/2026. A página não informa o total (o 53 é a minha contagem) e o texto veio cortado no fim, depois da lista. Os números do changelog do Draftsim não foram usados: o resumidor leu "11 cards" removidas em 21/10/2025 e a página oficial lista 10.
Chamadas de rede gastas nesta seção: 7 (chamadas nº 10, 11, 12, 13, 18, 19 e 26): ScrollVault, página oficial de 09/02/2026, 1 busca, artigo da Star City Games de 21/10/2025, anúncio oficial de B&R de 12/10/2026, 1 tentativa na busca is:gamechanger da Scryfall que devolveu erro de rede (contada) e, por último, o artigo do Draftsim. A seção 5 usou as chamadas nº 14 a 17 e 27.

### Data da última atualização e mudanças depois de 09/02/2026

- Última atualização da lista: 9 de fevereiro de 2026, confirmada na página oficial acima. O ScrollVault diz: "The list has not changed since the February 9, 2026 update, which added Farewell and Biorhythm." e "as of October 2026 the official list has not changed".
- Mudança depois de 09/02/2026: não encontrada. O que sustenta isso:
  - ScrollVault, com verificação em 11/10/2026 contra a consulta is:gamechanger da Scryfall (rotina semanal automática).
  - O anúncio oficial de Banned and Restricted de 12/10/2026 (item que aparece na barra lateral das páginas oficiais) não menciona Commander Brackets nem Game Changers (só Competitive Brawl muda); a página diz que o próximo anúncio de B&R é em 30/11/2026.
  - Uma busca na web por atualização posterior não devolveu nenhum anúncio oficial posterior a 09/02/2026 (a busca só devolveu títulos e links; o único sinal de data recente foi "Last updated on May 19, 2026" no título de um resultado do draftsim.com, aberto depois: ver o item do Draftsim abaixo).
  - Draftsim: o changelog da página termina em 09/02/2026; o "Last updated on May 19, 2026" é a data de edição do artigo (modified_time 2026-05-20), não uma mudança na lista: a lista dessa página tem os mesmos 53 nomes do ScrollVault.
  - A página oficial de 09/02/2026 previa nova atualização "likely in May or June"; não achei registro de que ela tenha saído.
- O que não foi conferido: uma página oficial com a lista completa atual (não veio no texto) e a Scryfall diretamente (a tentativa deu erro). Portanto "sem mudança" repousa em ScrollVault e Draftsim (terceiros, que coincidem entre si) mais a ausência de anúncio oficial encontrado, não numa confirmação oficial explícita.
- Cruzamento feito por script: (1) nenhuma das 10 cartas que a página oficial de 21/10/2025 diz ter removido aparece na lista de 53; (2) as 22 cartas que as páginas oficiais dizem ter entrado e que continuam na lista (abr/2025: 16 adicionadas e 4 desbanidas, fora Deflecting Swat, Food Chain e Sway of the Stars, removidas depois; fev/2026: Farewell e Biorhythm) estão todas na lista de 53 do ScrollVault; (3) as outras 31 cartas não são citadas em nenhuma página oficial aberta; só aparecem nas duas fontes de terceiros (ScrollVault e Draftsim, que coincidem): Drannith Magistrate; Enlightened Tutor; Serra's Sanctum; Smothering Tithe; Cyclonic Rift; Fierce Guardianship; Force of Will; Mystical Tutor; Rhystic Study; Thassa's Oracle; Ad Nauseam; Bolas's Citadel; Demonic Tutor; Imperial Seal; Opposition Agent; Tergrid, God of Fright; Vampiric Tutor; Jeska's Will; Underworld Breach; Gaea's Cradle; Survival of the Fittest; Grand Arbiter Augustin IV; Ancient Tomb; Chrome Mox; Glacial Chasm; Grim Monolith; Lion's Eye Diamond; Mana Vault; Mox Diamond; The One Ring; The Tabernacle at Pendrell Vale.

### Game Changers brancos, pretos, vermelhos, multicoloridos dentro dessas cores, incolores e terrenos

Critério: o agrupamento da própria página e o custo de mana que ela mostra. Identidade de cor pelo texto de regras (que decide, por exemplo, terrenos): não conferido além do agrupamento da página. Para as cores pedidas (branco, preto e vermelho), os grupos Blue (10), Green (7) e Multicolored (4) da página ficam de fora; a lista completa de todos está mais abaixo.

Brancos (7 na página: 6 não terrenos + 1 terreno):
- Drannith Magistrate (1W, criatura)
- Enlightened Tutor (W, instantâneo)
- Farewell (4WW, feitiço)
- Humility (2WW, encantamento)
- Smothering Tithe (3W, encantamento)
- Teferi's Protection (2W, instantâneo)
- Serra's Sanctum (terreno lendário; a página o põe em White)

Pretos (10):
- Ad Nauseam (3BB, instantâneo)
- Bolas's Citadel (3BBB, artefato lendário)
- Braids, Cabal Minion (2BB, criatura lendária)
- Demonic Tutor (1B, feitiço)
- Imperial Seal (B, feitiço)
- Necropotence (BBB, encantamento)
- Opposition Agent (2B, criatura)
- Orcish Bowmasters (1B, criatura)
- Tergrid, God of Fright (3BB, criatura lendária // artefato lendário)
- Vampiric Tutor (B, instantâneo)

Vermelhos (3):
- Gamble (R, feitiço)
- Jeska's Will (2R, feitiço)
- Underworld Breach (1R, encantamento)

Multicoloridos dentro de branco, preto e vermelho: nenhum. Os 4 multicoloridos da página têm estes custos: Aura Shards (1GW), Coalition Victory (3WUBRG), Grand Arbiter Augustin IV (2WU), Notion Thief (2UB); todos usam cor fora de W/B/R.

Incolores que não são terreno (7):
- Chrome Mox (0, artefato)
- Grim Monolith (2, artefato)
- Lion's Eye Diamond (0, artefato)
- Mana Vault (1, artefato)
- Mox Diamond (0, artefato)
- Panoptic Mirror (5, artefato)
- The One Ring (4, artefato lendário)

Terrenos (7 na página; 6 dentro das cores pedidas):
- Serra's Sanctum (agrupado em White)
- Ancient Tomb, Field of the Dead, Glacial Chasm, Mishra's Workshop, The Tabernacle at Pendrell Vale (agrupados em Colorless)
- Gaea's Cradle (agrupado em Green; fora das cores pedidas)

Total nas cores pedidas mais incolores e terrenos, pelos grupos da página: 7 + 10 + 3 + 12 = 32 (dos quais 6 são terrenos).

### Lista completa dos 53, nos grupos da página (nome | custo | tipo · função indicada pela página)

Total por grupo: White 7; Blue 10; Black 10; Red 3; Green 7; Multicolored 4; Colorless 12 = 53 (conferido).

White (7)
Drannith Magistrate | 1W | Creature — Human Wizard · Stax
Enlightened Tutor | W | Instant · Tutor
Farewell | 4WW | Sorcery · Interaction
Humility | 2WW | Enchantment · Stax
Serra's Sanctum | sem custo | Legendary Land · Fast mana
Smothering Tithe | 3W | Enchantment · Card advantage, Fast mana
Teferi's Protection | 2W | Instant · Interaction

Blue (10)
Consecrated Sphinx | 4UU | Creature — Sphinx · Card advantage
Cyclonic Rift | 1U | Instant · Interaction
Fierce Guardianship | 2U | Instant · Interaction
Force of Will | 3UU | Instant · Interaction
Gifts Ungiven | 3U | Instant · Tutor
Intuition | 2U | Instant · Tutor
Mystical Tutor | U | Instant · Tutor
Narset, Parter of Veils | 1UU | Legendary Planeswalker — Narset · Stax, Card advantage
Rhystic Study | 2U | Enchantment · Card advantage
Thassa's Oracle | UU | Creature — Merfolk Wizard · Win condition, Combo piece

Black (10)
Ad Nauseam | 3BB | Instant · Card advantage, Win condition
Bolas's Citadel | 3BBB | Legendary Artifact · Card advantage, Win condition
Braids, Cabal Minion | 2BB | Legendary Creature — Human Minion · Stax
Demonic Tutor | 1B | Sorcery · Tutor
Imperial Seal | B | Sorcery · Tutor
Necropotence | BBB | Enchantment · Card advantage
Opposition Agent | 2B | Creature — Human Rogue · Stax, Interaction
Orcish Bowmasters | 1B | Creature — Orc Archer · Interaction
Tergrid, God of Fright | 3BB | Legendary Creature — God // Legendary Artifact · Engine
Vampiric Tutor | B | Instant · Tutor

Red (3)
Gamble | R | Sorcery · Tutor
Jeska's Will | 2R | Sorcery · Fast mana, Card advantage
Underworld Breach | 1R | Enchantment · Combo piece, Engine

Green (7)
Biorhythm | 6GG | Sorcery · Win condition
Crop Rotation | G | Instant · Tutor
Gaea's Cradle | sem custo | Legendary Land · Fast mana
Natural Order | 2GG | Sorcery · Tutor, Win condition
Seedborn Muse | 3GG | Creature — Spirit · Engine
Survival of the Fittest | 1G | Enchantment · Tutor, Engine
Worldly Tutor | G | Instant · Tutor

Multicolored (4)
Aura Shards | 1GW | Enchantment · Interaction, Engine
Coalition Victory | 3WUBRG | Sorcery · Win condition
Grand Arbiter Augustin IV | 2WU | Legendary Creature — Human Advisor · Stax
Notion Thief | 2UB | Creature — Human Rogue · Card advantage, Stax

Colorless (12)
Ancient Tomb | sem custo | Land · Fast mana
Chrome Mox | 0 | Artifact · Fast mana
Field of the Dead | sem custo | Land · Engine, Win condition
Glacial Chasm | sem custo | Land · Stax
Grim Monolith | 2 | Artifact · Fast mana
Lion's Eye Diamond | 0 | Artifact · Fast mana, Combo piece
Mana Vault | 1 | Artifact · Fast mana
Mishra's Workshop | sem custo | Land · Fast mana
Mox Diamond | 0 | Artifact · Fast mana
Panoptic Mirror | 5 | Artifact · Engine, Win condition
The One Ring | 4 | Legendary Artifact · Card advantage, Interaction
The Tabernacle at Pendrell Vale | sem custo | Legendary Land · Stax

### Cruzamento com os dados do Edgar (seções 1 a 3), por nome

- Precon Vampiric Bloodlust (seção 3): 1 Game Changer atual entre as 100 cartas, Teferi's Protection.
- JSON do EDHREC (seção 1, só o trecho legível): Teferi's Protection 31,1% de inclusão; Demonic Tutor 29,2%; Vampiric Tutor 28,9%; Bolas's Citadel 20,2%; Enlightened Tutor 11,8%; Farewell 8,7%. (Smothering Tithe, Necropotence, Ancient Tomb e The One Ring não aparecem no trecho legível: não conferido.)
- edh.wiki (seção 2), seção "Game Changers" da página, com inclusão e sinergia: Teferi's Protection 44% (+25); Vampiric Tutor 37% (+23); Demonic Tutor 38% (+19); Bolas's Citadel 22% (+15); Smothering Tithe 31% (+6); Necropotence 12% (+6); Ancient Tomb 13% (+5); Enlightened Tutor 16% (+4); The One Ring 11% (+3); Farewell 11% (+1). As 10 estão na lista de 53 (conferido).
- Deflecting Swat aparece nas listas do EDHREC (5,3% de inclusão no JSON) e da edh.wiki (6%), mas deixou de ser Game Changer em 21/10/2025 (removida, segundo a página oficial). Ela não está na seção "Game Changers" da edh.wiki.

---

## 5. Brackets: definição oficial atual do Bracket 3 e do Bracket 4 (magic.wizards.com)

Fontes (todas abertas em 2026-10-14):
- A: https://magic.wizards.com/en/formats/commander (página de formato; é a página que o artigo de 21/10/2025 aponta como a das definições atuais, em #brackets e #gamechangers).
- B: https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta ("Introducing Commander Brackets Beta", 11/02/2025): texto-base de cada bracket.
- C: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-april-22-2025 ("Commander Brackets Beta Update – April 22, 2025").
- D: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025 ("Commander Brackets Beta Update – October 21, 2025"): última mudança de definição.
- E: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026 (09/02/2026): a página não traz definições de bracket (só Game Changers); ver seção 4.
Chamadas de rede gastas nesta seção: 5 (chamadas nº 14, 15, 16, 17 e 27: A, B, C, D e uma segunda leitura de D, mais focada; E e a B&R de 12/10/2026 foram contadas na seção 4).
Status: PARCIAL. Há texto oficial para Game Changers, para as expectativas dos brackets 3 e 4 em D (21/10/2025, com turnos mínimos e a explicação sobre combos) e o texto-base de B (fev/2025); os valores por bracket do item "two-card infinite combos" na página de formato (A) não vieram (ver "Não conferido").

Como ler as citações: vieram pelo modelo auxiliar do WebFetch, que as marcou como literais (aspas) e separou as paráfrases; não comparei com o HTML bruto. Aspas abaixo = literal segundo o resumidor. O resumidor limita cada citação a 125 caracteres, então frases longas aparecem em fragmentos consecutivos (indicado com "a frase continua").

### Cronologia do que mudou nas definições

- 11/02/2025 (B): texto-base dos 5 brackets.
- 22/04/2025 (C): "To be clear: Commander Brackets are not receiving any changes at this time." (só mudou a lista de Game Changers.)
- 21/10/2025 (D): mudanças nas definições (tutores, estimativa de turnos, Core sem ligação com precons); ver abaixo.
- 09/02/2026 (E): nenhuma definição de bracket no texto; a página só mexe na lista de Game Changers.
- A (atual): "Commander Brackets are currently in beta." Sem data na página.

### Bracket 3 (Upgraded)

Game Changers
- A (atual): "Bracket 3 allows for up to three Game Changers."
- B (fev/2025): "Up to three cards from the Game Changers list."
- D (21/10/2025), expectativa do bracket: "Game Changers that are likely to be value engines and game-ending spells"

Combos de duas cartas e turnos
- B (fev/2025): "These decks should generally not have any two-card infinite combos that can happen cheaply"
- B: "No intentional early-game two-card infinite combos."
- B: "it's possible the long game could end with one being deployed, even out of nowhere." (trecho sobre o combo ser jogado no fim do jogo)
- D, turnos do Bracket 3: "Generally, you should expect to be able to play at least six turns before you win or lose."
- D, seção "Setting Bracket Expectations and Turns Played", exemplo do Bracket 3: "saying "you don't expect to win or lose before turn six" gives you a pretty clear indicator" / "of what kind of combos could be allowed: not ones that tend to happen in the first six turns."
- D, mesma seção: "That doesn't mean you should just wait and hold your two-card infinite until later either."
- D, mesma seção: "If a combo could frequently come up, it's not the best fit for that bracket."
- D, sobre os termos antigos: "For example, instead of wondering what "no early-game combos" means," (a frase continua no fragmento seguinte).
- D, seção "Removing Tutor Restrictions": "One of the biggest risks with tutors is enabling combos," e "with no game-ending combos at the lower brackets and turn restrictions listed in each bracket's intent"

Vitórias e estilo de jogo (D)
- "Decks to be powered up with strong synergy and high card quality; they can effectively disrupt opponents"
- "Win conditions that can be deployed in one big turn from hand, usually because of steadily accrued resources"
- "Gameplay to feature many proactive and reactive plays"

Outros itens do Bracket 3 (B)
- "These decks are souped up and ready to play beyond the strength of an average preconstructed deck."
- "No mass land denial."
- "Extra-turn cards should only appear in low quantities and are not intended to be chained in succession or looped."
- Tutores: B não menciona tutores no Bracket 3; D (primeira leitura): "remove the tutor restrictions from Commander Brackets entirely" e "rely on Game Changers to catch the most efficient tutors".

### Bracket 4 (Optimized)

Game Changers
- A (atual): "Brackets 4 and 5 allow for unlimited Game Changers."
- B: o Bracket 4 não tem limite declarado; B diz que se pode esperar "a deck full of cards off the Game Changers list" (trecho; a frase completa de B: "...mass land destruction, or a deck full of cards off the Game Changers list.")
- D: "Game Changers that are likely to be fast mana, snowballing resource engines, free disruption, and tutors"

Combos e turnos
- B: "You can expect to see explosive starts, strong tutors, cheap combos that end games,"
- B: "There are no restrictions (other than the banned list)."
- D, turnos do Bracket 4: "Generally, you should expect to be able to play at least four turns before you win or lose."
- D não traz regra específica de combo de duas cartas para o Bracket 4; a regra de combos de D é geral (ver o Bracket 3 acima).

Vitórias e estilo de jogo (D)
- "Decks not to adhere to the cEDH metagame reserved for Bracket 5"
- "Decks to be lethal, consistent, and fast, designed to take people down as fast as possible"
- "Win conditions to vary but be efficient and instantaneous"
- "Gameplay to be explosive and powerful, featuring huge threats and efficient disruption to match"

Outros (B)
- "It's time to go wild!"

### Itens gerais citados na página atual de formato (A)

- "There are five Commander Brackets. Each one is meant to classify a different kind of game experience."
- "Brackets 1, 2, and 3 are different levels of socially focused play."
- "Brackets 4 and 5 are focused on a higher power or even a competitive experience."
- "Each bracket has an intent and philosophy behind it, which is the most important part."
- "There is also a list of what is expected at that level in a few barometers:" seguido de "two-card infinite combos, extra turns, mass land denial."
- "Bracket 1 and 2 decks exclude Game Changers."

### Não conferido

- O que a página atual de formato (A) diz, bracket a bracket, sobre combos de duas cartas, turnos extras e destruição de terrenos: a lista de barômetros aparece no texto, mas os valores por bracket não vieram (o resumidor disse que o conteúdo parece estar recolhido ou carregado por script). O texto de B de fev/2025 é o último texto por extenso que consegui abrir; D (out/2025) muda tutores, estimativa de turnos e a relação do Core com precons, e diz sobre as páginas de formato: "noting these pages may not reflect the latest changes described here but will soon" (escrito em out/2025). Se a página de formato (A) foi de fato atualizada depois: não conferido.
- Se existe mudança de definição depois de 21/10/2025: a página de 09/02/2026 (E) não traz nenhuma definição de bracket, e C diz que em abr/2025 não houve mudança. Anúncio posterior: não encontrado.
- Os pisos de turnos de D só foram lidos para os brackets 3 e 4; os dos brackets 1, 2 e 5: não conferido.

---

## 6. Combos

Fontes:
- Lista: https://json.edhrec.com/pages/combos/edgar-markov.json (WebFetch, 2026-10-14). Cabeçalho do JSON: "Combos Used In Edgar Markov (1673 Combos)".
- Conferência dos 4 combos pedidos: páginas commanderspellbook.com/combo/<id>/ (WebFetch, 2026-10-14), com os IDs que vieram do JSON.
Chamadas de rede gastas nesta seção: 5 (chamadas nº 20 a 24: 1 JSON do EDHREC + 4 páginas do Commander Spellbook).
Status: lista PARCIAL (75 de 1.673 combos legíveis); os 4 combos pedidos: todos encontrados e conferidos.

### 6.1 Lista do EDHREC (parcial)

Limite de leitura: o texto do JSON veio cortado. O cabeçalho declara 1.673 combos, mas só 75 entradas completas e 1 parcial estão legíveis. A 76a entrada, Smothering Tithe + Underworld Breach + Wheel of Fortune (25.860 decks, segundo o cabeçalho da entrada), tem o comboId cortado e o resto não aparece. Os outros 1.597 combos: não conferido. (O JSON tem uma seção de artigos no topo, que não foi usada.)

Formato: ordem no JSON | ID do Commander Spellbook (campo comboId do EDHREC; é o ID usado na URL commanderspellbook.com/combo/<id>/) | cartas | resultados | percentage / count / rank (valores brutos do JSON).
Sobre os números: o campo "count" passa de 51.835 (decks do Edgar na seção 1), então não é contagem só de decks do Edgar; nos 4 combos pedidos ele coincide ou quase coincide com a "Popularity" que o Commander Spellbook mostra ("In N decks according to EDHREC"). O significado exato de percentage e rank: não conferido.

01 | 314-3966 | Vito, Thorn of the Dusk Rose + Exquisite Blood | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 2.4078 / 125349 / rank 5
02 | 314-6191 | Vito, Thorn of the Dusk Rose + Bloodthirsty Conqueror | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 1.8319 / 93347 / rank 9
03 | 690-3966 | Sanguine Bond + Exquisite Blood | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 2.8726 / 149544 / rank 2
04 | 690-6191 | Sanguine Bond + Bloodthirsty Conqueror | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 1.5389 / 78416 / rank 16
05 | 110-6191 | Marauding Blight-Priest + Bloodthirsty Conqueror | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 0.9522 / 48522 / rank 41
06 | 110-3966 | Marauding Blight-Priest + Exquisite Blood | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 1.1641 / 60601 / rank 29
07 | 314-4141 | Vito, Thorn of the Dusk Rose + Blood Tribute | Target opponent loses the game; Infinite lifeloss for target opponent | 0.3283 / 17091 / rank 249
08 | 3054-3416-4050 | Edgar Markov + Oathsworn Vampire + Phyrexian Altar | Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite storm count; Infinite death triggers | 0.4209 / 4924 / rank 1245
09 | 2292-2744--5 | Viscera Seer + Cathars' Crusade | Infinite +1/+1 counters on most creatures you control; Infinite creature ETB; Infinite creature LTB; Infinite death triggers; Infinite creature sacrifice triggers; Infinite scry 1 | 0.6051 / 14066 / rank 343
10 | 2744-3967--5 | Cathars' Crusade + Yahenni, Undying Partisan | Infinite +1/+1 counters on most creatures you control; Infinite creature ETB; Infinite creature LTB; Infinite death triggers; Infinite creature sacrifice triggers | 0.3511 / 8162 / rank 676
11 | 4141-5342 | Bloodletter of Aclazotz + Blood Tribute | Infinite lifeloss for target opponent; Near-infinite lifegain; Target opponent loses the game | 0.2027 / 10552 / rank 485
12 | 5755-6191 | Enduring Tenacity + Bloodthirsty Conqueror | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 1.2297 / 62662 / rank 27
13 | 3966-5755 | Exquisite Blood + Enduring Tenacity | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 1.4447 / 75211 / rank 19
14 | 2744-2921--5 | Cathars' Crusade + Bartolomé del Presidio | Infinite +1/+1 counters on most creatures you control; Infinite creature ETB; Infinite creature LTB; Infinite death triggers; Infinite creature sacrifice triggers | 0.3008 / 6993 / rank 821
15 | 3966-4789 | Exquisite Blood + Cliffhaven Vampire | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 0.6385 / 14842 / rank 315
16 | 2744-4050--5 | Cathars' Crusade + Phyrexian Altar | Infinite +1/+1 counters on most creatures you control; Infinite creature ETB; Infinite creature LTB; Infinite colored mana; Infinite death triggers; Infinite creature sacrifice triggers | 0.2851 / 13664 / rank 357
17 | 4789-6191 | Cliffhaven Vampire + Bloodthirsty Conqueror | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 0.4369 / 9951 / rank 519
18 | 345-2292--5 | Viscera Seer + Metallic Mimic | Infinite creature ETB; Infinite creature LTB; Infinite death triggers; Infinite creature sacrifice triggers; Infinite scry 1 | 0.1331 / 6927 / rank 823
19 | 2034-2744--5 | Ashnod's Altar + Cathars' Crusade | Infinite creature ETB; Infinite creature LTB; Infinite +1/+1 counters on most creatures you control; Infinite colorless mana; Infinite death triggers; Infinite creature sacrifice triggers | 0.5538 / 26544 / rank 114
20 | 345-3967--5 | Metallic Mimic + Yahenni, Undying Partisan | Infinite creature ETB; Infinite creature LTB; Infinite death triggers; Infinite creature sacrifice triggers | 0.0634 / 3303 / rank 1820
21 | 3373-4141 | Astarion, the Decadent + Blood Tribute | Target opponent loses the game; Infinite lifeloss for target opponent | 0.2692 / 6258 / rank 931
22 | 2939-3966 | Defiant Bloodlord + Exquisite Blood | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 0.2248 / 11701 / rank 443
23 | 3966-4740 | Aetherflux Reservoir + Exquisite Blood | Infinite damage; Infinite lifegain triggers | 1.0814 / 56295 / rank 31
24 | 2842-3054-3416-5670 | Edgar Markov + Oathsworn Vampire + Warren Soultrader + Blood Artist | Infinite artifact ETB; Infinite artifact LTB; Infinite artifact sacrifice triggers; Infinite creature ETB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite storm count; Infinite lifeloss; Infinite lifegain triggers | 0.0957 / 1119 / rank 4271
25 | 2939-6191 | Defiant Bloodlord + Bloodthirsty Conqueror | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 0.1672 / 8520 / rank 635
26 | 2932-3054-4050 | Bontu's Monument + Oathsworn Vampire + Phyrexian Altar | Infinite death triggers; Infinite creature ETB; Infinite lifegain; Infinite lifegain triggers; Infinite lifeloss; Infinite creature LTB; Infinite storm count | 0.0408 / 2126 / rank 2603
27 | 4740-6191 | Aetherflux Reservoir + Bloodthirsty Conqueror | Infinite damage; Infinite lifegain triggers | 0.7264 / 37017 / rank 64
28 | 483-3054-3416-5670 | Edgar Markov + Oathsworn Vampire + Warren Soultrader + Cruel Celebrant | Infinite artifact ETB; Infinite artifact LTB; Infinite artifact sacrifice triggers; Infinite creature ETB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite storm count; Infinite lifeloss; Infinite lifegain triggers | 0.0781 / 914 / rank 4921
29 | 2232-3416-4050 | Edgar Markov + Cloudstone Curio + Phyrexian Altar | Infinite death triggers; Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite storm count | 0.0759 / 888 / rank 5018
30 | 3966-4912 | Exquisite Blood + Epicure of Blood | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 0.1607 / 8366 / rank 658
31 | 3054-3416-5670-6094 | Edgar Markov + Oathsworn Vampire + Warren Soultrader + Vengeful Bloodwitch | Infinite artifact ETB; Infinite artifact LTB; Infinite artifact sacrifice triggers; Infinite creature ETB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite storm count; Infinite lifeloss; Infinite lifegain triggers | 0.0724 / 831 / rank 5253
32 | 4912-6191 | Epicure of Blood + Bloodthirsty Conqueror | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 0.1136 / 5791 / rank 1037
33 | 345-2921--5 | Metallic Mimic + Bartolomé del Presidio | Infinite +1/+1 counters on a creature; Infinite creature ETB; Infinite creature LTB; Infinite death triggers; Infinite creature sacrifice triggers | 0.0634 / 1473 / rank 3487
34 | 501-3054-4050 | Oathsworn Vampire + Phyrexian Altar + Jet Medallion | Infinite death triggers; Infinite creature ETB; Infinite creature LTB; Infinite storm count; Infinite creature sacrifice triggers | 0.0376 / 1958 / rank 2782
35 | 3054-4050-4871 | Oathsworn Vampire + Phyrexian Altar + Pitiless Plunderer | Infinite creature ETB; Infinite creature LTB; Infinite death triggers; Infinite creature sacrifice triggers; Infinite storm count | 0.0505 / 2630 / rank 2202
36 | 2173-4740-5078 | Sensei's Divining Top + Aetherflux Reservoir + Bolas's Citadel | Infinite card draw; Infinite draw triggers; Near-infinite damage; Near-infinite lifegain; Near-infinite lifegain triggers; Near-infinite storm count | 0.988 / 51436 / rank 37
37 | 5867-6191 | Starscape Cleric + Bloodthirsty Conqueror | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 0.446 / 22725 / rank 161
38 | 314-4624 | Vito, Thorn of the Dusk Rose + Revival // Revenge | Near-infinite lifegain; Near-infinite lifeloss for up to two target opponents | 0.5877 / 13661 / rank 358
39 | 3966-5867 | Exquisite Blood + Starscape Cleric | Infinite lifegain triggers; Infinite lifeloss; Infinite lifegain | 0.541 / 28164 / rank 103
40 | 335-5141 | Ad Nauseam + Teferi's Protection | Infinite card draw | 0.3397 / 7896 / rank 707
41 | 690-4624 | Sanguine Bond + Revival // Revenge | Near-infinite lifegain; Near-infinite lifeloss for up to two target opponents | 0.5768 / 13408 / rank 367
42 | 2034-2842-3054-4871 | Oathsworn Vampire + Ashnod's Altar + Pitiless Plunderer + Blood Artist | Infinite colorless mana; Infinite death triggers; Infinite creature ETB; Infinite lifegain; Infinite lifegain triggers; Infinite lifeloss; Infinite creature LTB; Infinite storm count | 0.0505 / 2630 / rank 2204
43 | 1957-2842-4050--204 | Veinwitch Coven + Blood Artist + Phyrexian Altar | Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain | 0.0384 / 1997 / rank 2736
44 | 1957-2842-4050--173 | Veinwitch Coven + Phyrexian Altar + Blood Artist | Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain; Infinite lifegain triggers; Infinite lifeloss; Infinite storm count | 0.0384 / 1997 / rank 2737
45 | 345-4050--5 | Phyrexian Altar + Metallic Mimic | Infinite creature ETB; Infinite creature LTB; Infinite colored mana; Infinite death triggers; Infinite creature sacrifice triggers | 0.0688 / 7083 / rank 800
46 | 2577-2842-5670 | Warren Soultrader + Gravecrawler + Blood Artist | Infinite death triggers; Infinite creature ETB; Infinite lifegain triggers; Infinite lifeloss; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite storm count | 0.9034 / 47031 / rank 44
47 | 2577-4050 | Gravecrawler + Phyrexian Altar | Infinite death triggers; Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite storm count | 1.4851 / 77315 / rank 18
48 | 3054-4050-4314 | Oathsworn Vampire + Phyrexian Altar + Pawn of Ulamog | Infinite creature LTB; Infinite creature ETB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite storm count | 0.033 / 1719 / rank 3099
49 | 483-1957-4050--204 | Veinwitch Coven + Cruel Celebrant + Phyrexian Altar | Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain | 0.0254 / 590 / rank 6550
50 | 483-1957-4050--173 | Veinwitch Coven + Phyrexian Altar + Cruel Celebrant | Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain; Infinite lifegain triggers; Infinite lifeloss; Infinite storm count | 0.0254 / 590 / rank 6551
51 | 345-2034--5 | Ashnod's Altar + Metallic Mimic | Infinite creature ETB; Infinite creature LTB; Infinite colorless mana; Infinite death triggers; Infinite creature sacrifice triggers | 0.1174 / 12083 / rank 425
52 | 2577-5670-6094 | Warren Soultrader + Gravecrawler + Vengeful Bloodwitch | Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain triggers; Infinite lifeloss; Infinite storm count | 0.2068 / 10540 / rank 487
53 | 314-4996 | Vito, Thorn of the Dusk Rose + Beacon of Immortality | Near-infinite lifegain; Near-infinite lifeloss for target opponent | 0.7628 / 17731 / rank 237
54 | 690-4996 | Beacon of Immortality + Sanguine Bond | Target opponent loses the game | 0.7534 / 17512 / rank 242
55 | 5342-5460 | Bloodletter of Aclazotz + Rush of Dread | Infinite lifeloss for target opponent; Target opponent loses the game | 0.1288 / 6705 / rank 859
56 | 3054-3416-5670-6794 | Edgar Markov + Oathsworn Vampire + Warren Soultrader + Susurian Voidborn | Infinite artifact ETB; Infinite artifact LTB; Infinite artifact sacrifice triggers; Infinite creature ETB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite storm count; Infinite lifeloss; Infinite lifegain triggers | 0.0342 / 290 / rank 9631
57 | 4624-5342 | Bloodletter of Aclazotz + Revival // Revenge | Infinite lifeloss for target opponent; Near-infinite lifegain; Target opponent loses the game | 0.1926 / 4477 / rank 1357
58 | 483-2577-5670 | Warren Soultrader + Gravecrawler + Cruel Celebrant | Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain triggers; Infinite lifeloss; Infinite storm count | 0.2114 / 4913 / rank 1250
59 | 5342-6004 | Grievous Wound + Bloodletter of Aclazotz | Target opponent loses the game; Infinite lifeloss for target opponent | 0.1645 / 8566 / rank 629
60 | 2842-4050-5544 | Forsaken Miner + Phyrexian Altar + Blood Artist | Infinite death triggers; Infinite creature ETB; Infinite lifegain; Infinite lifegain triggers; Infinite lifeloss; Infinite creature LTB; Infinite creature sacrifice triggers | 0.4046 / 21065 / rank 180
61 | 4812-5276 | Leonin Relic-Warder + Animate Dead | Infinite death triggers; Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers | 0.3775 / 8775 / rank 616
62 | 2842-5544-5670 | Warren Soultrader + Forsaken Miner + Blood Artist | Infinite death triggers; Infinite creature ETB; Infinite creature LTB; Infinite lifegain triggers; Infinite lifeloss; Infinite creature sacrifice triggers | 0.5743 / 29895 / rank 93
63 | 4050-5544-6094 | Forsaken Miner + Phyrexian Altar + Vengeful Bloodwitch | Infinite creature LTB; Infinite creature ETB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain triggers; Infinite lifegain; Infinite lifeloss | 0.1221 / 6221 / rank 942
64 | 3054-3416-5332-5670 | Edgar Markov + Oathsworn Vampire + Warren Soultrader + Carmen, Cruel Skymarcher | Infinite artifact ETB; Infinite artifact LTB; Infinite artifact sacrifice triggers; Infinite creature ETB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite storm count; Infinite +1/+1 counters on a creature; Infinite lifegain triggers | 0.0197 / 230 / rank 10843
65 | 5544-5670-6094 | Warren Soultrader + Forsaken Miner + Vengeful Bloodwitch | Infinite creature LTB; Infinite creature ETB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain triggers; Infinite lifeloss | 0.1912 / 9743 / rank 538
66 | 1957-4050-6094--204 | Veinwitch Coven + Phyrexian Altar + Vengeful Bloodwitch | Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain | 0.009 / 460 / rank 7544
67 | 1957-4050-6094--173 | Veinwitch Coven + Phyrexian Altar + Vengeful Bloodwitch | Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite lifegain; Infinite lifegain triggers; Infinite lifeloss; Infinite storm count | 0.009 / 460 / rank 7545
68 | 936-1290 | Bloodchief Ascension + Mindcrank | Infinite mill; Near-infinite lifegain; Near-infinite lifegain triggers; Near-infinite lifeloss | 1.2131 / 63153 / rank 26
69 | 1368-2706-3518 | Underworld Breach + Lion's Eye Diamond + Wheel of Fortune | Infinite draw triggers; Infinite looting; Infinite looting for opponents; Near-infinite storm count | 1.7226 / 88070 / rank 15
70 | 2744-5147--5 | Cathars' Crusade + Goblin Bombardment | Infinite +1/+1 counters on most creatures you control; Infinite creature ETB; Infinite creature LTB; Infinite damage; Infinite death triggers; Infinite creature sacrifice triggers | 0.3442 / 8260 / rank 667
71 | 4624-5755 | Enduring Tenacity + Revival // Revenge | Near-infinite lifegain; Near-infinite lifeloss for up to two target opponents | 0.4068 / 9456 / rank 563
72 | 2896-5276 | Leonin Relic-Warder + Necromancy | Infinite death triggers; Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers | 0.1951 / 4536 / rank 1339
73 | 3605-5276 | Leonin Relic-Warder + Dance of the Dead | Infinite death triggers; Infinite creature ETB; Infinite creature LTB; Infinite creature sacrifice triggers | 0.1823 / 4238 / rank 1423
74 | 1385-2034-3054-4871 | Oathsworn Vampire + Ashnod's Altar + Pitiless Plunderer + Zulaport Cutthroat | Infinite creature ETB; Infinite colorless mana; Infinite death triggers; Infinite lifegain; Infinite lifegain triggers; Infinite lifeloss; Infinite creature LTB; Infinite storm count | 0.0403 / 2099 / rank 2634
75 | 1385-3054-3416-5670 | Edgar Markov + Oathsworn Vampire + Warren Soultrader + Zulaport Cutthroat | Infinite artifact ETB; Infinite artifact LTB; Infinite artifact sacrifice triggers; Infinite creature ETB; Infinite creature sacrifice triggers; Infinite death triggers; Infinite storm count; Infinite lifeloss; Infinite lifegain triggers | 0.014 / 164 / rank 12608
76 (parcial) | ID cortado | Smothering Tithe + Underworld Breach + Wheel of Fortune | resultados, percentage e rank: não conferido | count 25860 (do cabeçalho da entrada)

Observações sobre a lista:
- Várias linhas repetem as mesmas cartas com sufixos diferentes no ID (ex.: 1957-2842-4050--204 e 1957-2842-4050--173; 483-1957-4050--204 e --173; 1957-4050-6094--204 e --173): parecem ser variantes do mesmo combo no Commander Spellbook (inferência minha). O que significam os sufixos "--5", "--173" e "--204" exatamente: não conferido.
- IDs com "--5" aparecem em combos com Cathars' Crusade e Metallic Mimic; o texto do JSON não explica o motivo.

### 6.2 Conferência dos 4 combos pedidos no Commander Spellbook

Todas as 4 páginas abriram com dados do combo (não vieram só com mensagem de carregamento). Em todas: cor da identidade "B"; marca de bracket "Spicy" (Bracket 3-4+); tabela de legalidade com células vazias no texto (legalidade por formato: não conferido); preços (TCGplayer / Card Kingdom) aparecem mas não os gravei.

#### 314-6191: Vito, Thorn of the Dusk Rose + Bloodthirsty Conqueror
- URL: https://commanderspellbook.com/combo/314-6191/ ; título da página: "Vito, Thorn of the Dusk Rose | Bloodthirsty Conqueror"
- Cartas: Vito, Thorn of the Dusk Rose; Bloodthirsty Conqueror.
- Estado inicial: "Vito and Bloodthirsty Conqueror on the battlefield."
- Pré-requisito: "You have a way to gain life."
- Passos: 1. "Gain life." 2. "Vito triggers, causing an opponent to lose 1 life." 3. "Bloodthirsty Conqueror triggers, causing you to gain 1 life." 4. "Repeat from step 2."
- Resultado: "Infinite lifegain triggers." "Infinite lifeloss." "Infinite lifegain."
- Outros campos: mana necessária: não aparece; bracket: "SpicyBracket 3-4+", descrito como "Probably 3 or 4, but hard to classify"; popularidade "93,347" decks no EDHREC; 24 variantes; salt 2.12 / 4, "Moderately salty", 17 votos no último ano.

#### 110-6191: Marauding Blight-Priest + Bloodthirsty Conqueror
- URL: https://commanderspellbook.com/combo/110-6191/ ; título: "Marauding Blight-Priest | Bloodthirsty Conqueror"
- Cartas: Marauding Blight-Priest; Bloodthirsty Conqueror.
- Estado inicial: "Marauding Blight-Priest and Bloodthirsty Conqueror on the battlefield."
- Pré-requisito: "You have a way to gain life."
- Passos: 1. "Gain life." 2. "Marauding Blight-Priest triggers, causing each opponent to lose 1 life." 3. "Bloodthirsty Conqueror triggers for each opponent that lost life." 4. "Resolve a Bloodthirsty Conqueror trigger, gaining 1 life." 5. "Repeat from step 2."
- Resultado: "Infinite lifegain triggers." "Infinite lifeloss." "Infinite lifegain."
- Outros campos: mana necessária: não aparece; bracket: "SpicyBracket 3-4+", "Probably 3 or 4, but hard to classify"; a página diz que as tags de bracket são estimadas pelas cartas e resultados, "as a guideline rather than a strict classification"; popularidade 48,522 decks no EDHREC; 24 variantes; salt 1.86 / 4, "Moderately salty", 7 votos no último ano.

#### 690-6191: Sanguine Bond + Bloodthirsty Conqueror
- URL: https://commanderspellbook.com/combo/690-6191/ ; título: "Sanguine Bond | Bloodthirsty Conqueror"
- Cartas: Sanguine Bond; Bloodthirsty Conqueror.
- Estado inicial: "Sanguine Bond and Bloodthirsty Conqueror on the battlefield."
- Pré-requisito: "You have a way to gain life."
- Passos: 1. "Gain life." 2. "Sanguine Bond triggers, causing an opponent to lose 1 life." 3. "Bloodthirsty Conqueror triggers, causing you to gain 1 life." 4. "Repeat from step 2."
- Resultado: "Infinite lifegain triggers." "Infinite lifeloss." "Infinite lifegain."
- Outros campos: mana necessária: não aparece; bracket: "This combo has been estimated to be Spicy (Bracket 3-4+)."; popularidade "In 76332 decks according to EDHREC."; número de variantes e salt: não aparecem no texto (variantes ficou em "Loading...").

#### 314-3966: Vito, Thorn of the Dusk Rose + Exquisite Blood
- URL: https://commanderspellbook.com/combo/314-3966/ ; título: "Vito, Thorn of the Dusk Rose | Exquisite Blood"
- Cartas: Vito, Thorn of the Dusk Rose; Exquisite Blood.
- Estado inicial: "Vito and Exquisite Blood on the battlefield."
- Pré-requisito: "You have a way to gain life."
- Passos: 1. "Gain life." 2. "Vito triggers, causing an opponent to lose 1 life." 3. "Exquisite Blood triggers, causing you to gain 1 life." 4. "Repeat from step 2."
- Resultado: "Infinite lifegain triggers." "Infinite lifeloss." "Infinite lifegain."
- Outros campos: mana necessária: não aparece; bracket: "This combo has been estimated to be Spicy (Bracket 3-4+)."; popularidade "In 123582 decks according to EDHREC."; número de variantes e salt: não aparecem no texto.

#### Comparação com o JSON do EDHREC
- IDs e cartas: os 4 coincidem com as linhas 02, 05, 04 e 01 da lista 6.1.
- Popularidade: Spellbook 93.347 vs JSON 93.347 (314-6191, igual); 48.522 vs 48.522 (110-6191, igual); 76.332 vs 78.416 (690-6191); 123.582 vs 125.349 (314-3966). As duas últimas diferem, o que indica coletas em datas diferentes.
- Resultados: os 4 combos têm os mesmos três resultados nas duas fontes.

---

## Resumo das chamadas de rede (WebFetch + WebSearch)

Total usado: 27 de 40, contando a tentativa que deu erro (nº 19). Nenhuma chamada fora de WebFetch e WebSearch foi usada para buscar dados na web.

1. WebFetch, EDHREC JSON (Edgar): número de decks, cabeçalhos, New Cards. [seção 1]
2. WebFetch, EDHREC JSON (Edgar): Top Cards e High Lift Cards, contagens por lista, bracket_counts e budget_counts. [seção 1]
3. WebFetch, EDHREC JSON (Edgar): Creatures, Instants, Sorceries, Utility Artifacts. [seção 1]
4. WebFetch, EDHREC JSON (Edgar), offset=100000: "Nothing left to read" (texto total de 72.150 caracteres). [seção 1]
5. WebFetch, edh.wiki (Edgar, vampires). [seção 2]
6. WebFetch, EDHREC JSON do precon Vampiric Bloodlust. [seção 3]
7. WebFetch, mtg.wiki (Vampiric Bloodlust): só cartas novas. [seção 3]
8. WebSearch, lista do precon Vampiric Bloodlust. [seção 3]
9. WebFetch, mtg.wtf (Vampiric Bloodlust). [seção 3]
10. WebFetch, ScrollVault (Game Changers). [seção 4]
11. WebFetch, anúncio oficial de 09/02/2026. [seção 4]
12. WebSearch, atualizações de Commander Brackets depois de 09/02/2026. [seção 4]
13. WebFetch, artigo da Star City Games de 21/10/2025. [seção 4]
14. WebFetch, anúncio oficial de 21/10/2025. [seção 5]
15. WebFetch, página oficial de formato Commander. [seção 5]
16. WebFetch, anúncio oficial "Introducing Commander Brackets Beta" (11/02/2025). [seção 5]
17. WebFetch, anúncio oficial de 22/04/2025. [seção 5]
18. WebFetch, anúncio oficial de Banned and Restricted de 12/10/2026. [seção 4]
19. WebFetch, busca is:gamechanger na Scryfall: erro de rede, sem dados. [seção 4]
20. WebFetch, EDHREC JSON de combos (Edgar). [seção 6]
21. WebFetch, Commander Spellbook, combo 314-6191. [seção 6]
22. WebFetch, Commander Spellbook, combo 110-6191. [seção 6]
23. WebFetch, Commander Spellbook, combo 690-6191. [seção 6]
24. WebFetch, Commander Spellbook, combo 314-3966. [seção 6]
25. WebFetch, EDHREC página HTML (Edgar): listas que o JSON cortou. [seção 1, Complemento]
26. WebFetch, Draftsim (Game Changers). [seção 4]
27. WebFetch, anúncio oficial de 21/10/2025, segunda leitura focada em Bracket 3, Bracket 4 e combos. [seção 5]
