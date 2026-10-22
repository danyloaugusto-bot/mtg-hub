# Handover: Kaalia of the Vast

Versão 1.0, de 14/10/2026. É anexo do Handover Mestre v2.1. O detalhe está em `analise-claude-kaalia.md` e a lista nova em `lista_nova_kaalia.txt`.

## Como usar

Abra um chat novo e anexe três arquivos: o Handover Mestre, este handover e a análise. Diga a tarefa: responder as perguntas abertas, refinar, ou registrar o teste das dez mãos. Não é preciso reler a conversa de 14/10.

## Onde paramos

- **Rodada única, de 14/10.** Fiz diagnóstico e reconstrução juntos, sem ponto de controle, porque ele pediu a busca do 10 e confiou na análise.
- **Nota atual: 5.** **Nota projetada: 9**, como projeção sem partida.
- **Placar:** 244 hoje e 339 na lista nova.
- **Nome de painel sugerido:** Céu, Inferno e Fogo.

## O que ele disse

- Ele acha a comandante interessante pela regra de pôr uma carta da mão atacando. A ideia dele é colocar cartas fortes que façam a diferença quando entram.
- Não tinha agrupamentos nem estratégia. Pediu que tudo fosse gerado do zero.
- Quer nota no início e, no fim, a nota com as mudanças.
- Mandou o link do edh.wiki (aggro) e o do Scryfall da impressão MH3 nº 290.

## A lista original

Está em `lista_kaalia.txt`, com 100 cartas:

- 34 terrenos, sendo 25 básicos: 6 Mountain, 9 Plains e 10 Swamp.
- 29 tribais: 11 Angels, 8 Demons e 10 Dragons.
- 8 rocks.
- Um Game Changer, a Smothering Tithe.

## O que já foi conferido e concluído

**Texto.** Todas as 100 cartas da lista e todas as 71 entradas foram lidas no json.edhrec. Só não achei a lealdade inicial do Sorin Markov, e ele sai.

**Regras com fonte:**
- Gatilho de "ataca" não dispara na criatura posta (ruling da Kaalia de 2020, CR 508.4).
- O ETB dispara.
- A criatura ataca o mesmo oponente.
- Planeswalker não conta.
- Taxa de ataque não se paga.
- Master of Cruelties funciona (ruling de 2013).
- Isshin dobra a Kaalia.
- Aurelia posta não dá combate.
- Boast não ativa.
- A Kaalia é Human Cleric e **não tem vigilância**.

**A conta:** acelerar, blindar, despejar. Cada ataque com a carga certa tira um oponente, porque a criatura entra atacando o mesmo jogador que a Kaalia.

**Gerar e converter:** sobra combustível (29 tribais e 10 cartas de compra) e falta conversão (2 peças de blindagem barata, nenhum multiplicador).

**Simulação de mana**, na jogada, sem mulligan. Kaalia conjurável:

| Até o turno | Hoje | Lista nova |
|---|---|---|
| 3 | 24% | 37% |
| 4 | 48% | 68% |
| 5 | 58% | 78% |

**A lista nova:** 71 entradas, 29 delas terrenos. Ficam 26 cartas da lista original e 3 básicos.
- Entram as botas, Mother of Runes, Grand Abolisher, Isshin, Combat Celebrant, Aurelia, Master of Cruelties, Terror of Mount Velus, Subjugator Angel, Neriv, Twinflame Tyrant, Serra's Emissary e Kaalia, Zenith Seeker.
- Saem as cinco tribais de gatilho de ataque (Velomachus, Balor, Decadent Dragon, Shadrix, Varragoth), além de Piru e dos simétricos.

**Brackets:** a lista nova tem 10 Game Changers e é Bracket 4. A conversão para Bracket 3 está na seção 7.4 da análise.

**Armadilhas registradas para não voltarem à mesa:**
- Drakuseth, Scourge of the Throne, Utvara Hellkite, Hellkite Charger e Glorybringer dependem de gatilho de ataque.
- Sunblast Angel e Shefet Archfiend matam a Kaalia.
- Rakdos, the Showstopper pode destruí-la, porque ela é Human.
- Fireshrieker não dá gatilho extra.
- Herald's Horn escolhe um tipo só.
- Bloodthirster não desvira a Kaalia.

## Perguntas em aberto

1. **Qual o bracket da sua mesa?** Isso decide se ficam os 10 Game Changers ou a versão Bracket 3.
2. **Cartas de estimação?** Assumi nenhuma. Se houver, diga quais; elas saem da fila de corte.
3. **Aceita a reconstrução inteira, ou prefere o atalho das dez trocas mais fortes?** O atalho seria: Lightning Greaves, Swiftfoot Boots, Grand Abolisher, Isshin, Master of Cruelties, Terror of Mount Velus, Subjugator Angel, Neriv, Rune-Scarred Demon e Aurelia, no lugar de Piru, Infiltration Lens, Two-Handed Axe, Ghirapur Orrery, Varragoth, Velomachus, Balor, Archangel of Strife, Resolute Archangel e Cathedral of War. Esse atalho não foi medido por script; se ele escolher esse caminho, rode o `stats.py` com essa lista antes de dar nota.
4. **Aprova os oito eixos?** Ramp, Combustível, Interação, Blindagem, Carga, Multiplicador, Trava e Fechamento. Há uma ressalva: Trava tem só 3 cartas.
5. **O par Kaalia e Master of Cruelties está liberado na sua mesa?** Não é infinito, mas tira um oponente por ataque.
6. **A sua mesa tem muitos artefatos?** Se tiver, a Hellkite Tyrant fica. Se não, entra a Wardscale Dragon.

## Leituras sem ruling, a conferir

- A Liesa e a Avacyn, Angel of Horror trazem a Kaalia de volta quando você não a manda para a zona de comando (regra 903.9a).
- O ETB do Terror of Mount Velus dá golpe duplo antes do dano.
- A Aurelia declarada no segundo combate dispara.

## O que o próximo chat deve fazer

1. Receber as respostas das perguntas 1 a 3 e ajustar a lista.
2. Fazer o teste das dez mãos com as quatro medidas da seção 11 da análise:
   - turno em que a Kaalia entra;
   - turno do primeiro ataque;
   - Carga do primeiro ataque;
   - mãos em que faltou cor.
3. Dar a nota testada.
4. Gravar os arquivos em `C:\Projetos\mtg-hub\dados\` e rodar o `/novo-deck`.

## Arquivos desta rodada

- `analise-claude-kaalia.md`
- `Handover_Kaalia_Analise_de_Deck.md`
- `lista_nova_kaalia.txt`
- `lista_kaalia.txt`
- Os scripts `dados.py`, `stats.py` e `gerar.py`, com o modelo `analise_tpl.md`, recriam as tabelas e os números.

---

## Rodada 2, de 14/10/2026: versão enxuta

**O que ele disse:** não acha que o deck precise de tantas mudanças. Quer saber onde e como deixá-lo mais rápido e forte. Pediu para seguir com o melhor. Também disse para não perguntar mais sobre bracket nem cartas de estimação.

**Decisão:** quatro camadas, 26 trocas no total. Cada camada foi medida por script, no `enxuta.py`. A lista resultante está em `lista_enxuta_kaalia.txt`.

1. **Força, 10 trocas**
   - Saem: Piru, Infiltration Lens, Two-Handed Axe, Ghirapur Orrery, Varragoth, Velomachus, Balor, Archangel of Strife, Resolute Archangel e Sower of Discord.
   - Entram: Lightning Greaves, Swiftfoot Boots, Grand Abolisher, Isshin, Master of Cruelties, Terror of Mount Velus, Subjugator Angel, Neriv, Rune-Scarred Demon e Aurelia.
2. **Rocks de cor, 3 trocas**
   - Saem: Mind Stone, Savai Crystal e Strixhaven Stadium.
   - Entram: Talisman of Conviction, Talisman of Indulgence e Talisman of Hierarchy.
   - Testei Mana Vault e Chrome Mox no lugar dos Talismans. Rendem o mesmo, porque o gargalo é a cor, e são Game Changers.
3. **Terrenos, 10 trocas**
   - Saem: Cathedral of War, Rogue's Passage, Temple of Silence, Monumental Henge, Shattered Landscape, Bojuka Bog, 2 Plains e 2 Swamp.
   - Entram: Plateau, Badlands, Scrubland, Sacred Foundry, Blood Crypt, Godless Shrine, Arid Mesa, Bloodstained Mire, Marsh Flats e Arena of Glory.
   - Testei também três painlands no lugar de três básicos. O ganho foi de 1 ponto, então ficaram de fora.
4. **Proteção grátis, 3 trocas**
   - Saem: Your Temple Is Under Attack, Darksteel Mutation e Ghostly Prison.
   - Entram: Flawless Maneuver, Deflecting Swat e Mother of Runes.

**Medido por script** (na jogada, sem mulligan):

| Medida | Hoje | Enxuta | Reconstrução |
|---|---|---|---|
| Kaalia conjurável até o turno 4 | 48% | 62% | 68% |
| Kaalia conjurável até o turno 5 | 58% | 71% | 78% |
| Ver proteção ou bota barata até o turno 4 | 19% | 54% | 59% |
| Multiplicadores de gatilho | 0 | 2 | 3 |
| Carga 3 na mão até o turno 5 | 38% | 62% | 83% |
| Game Changers | 1 | 1 | 10 |
| Placar | 244 | 292 | 339 |

**Nota projetada da enxuta: 8**, sem partida. Ela continua no Bracket 3, com um só Game Changer.

**Correção:** o atalho da rodada 1 cortava a Cathedral of War. Isso deixava 33 terrenos, então o corte passou a ser o Sower of Discord.

**Próximo passo:** o teste das dez mãos com a lista enxuta.
