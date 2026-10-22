# Handover: Okaun, Eye of Chaos + Zndrsplt, Eye of Wisdom

Versão 1.0, de 14/10/2026. É anexo do Handover Mestre v2.1. O detalhe está em `analise-claude-okaun-zndrsplt.md` e a lista nova em `lista_nova_okaun.txt`.

## Como usar

Abra um chat novo e anexe três arquivos: o Handover Mestre, este handover e a análise. Diga a tarefa: refinar as trocas, registrar o teste das dez mãos ou escolher o nome do painel.

## Onde paramos

- **Rodada única, de 14/10:** diagnóstico com 10 trocas pontuais. É um precon especial (Secret Lair), e ele não costuma mexer em precons para não perder a essência.
- **Nota atual: 7.** **Nota projetada: 8,5**, sem partida.
- **Placar:** 304 hoje e 324 com as trocas.
- **Nome de painel sugerido:** Cara, Eu Ganho.

## O que ele disse

- Deck precon especial. Ele já fez melhorias pontuais, sobretudo nas cartas de moeda.
- Não tinha eixos nem estratégia. Pelos jogos, o deck explode e vence, ou mata um oponente, rápido quando tudo dá certo.
- Considera o Krark's Thumb a carta principal: busca o Thumb ou o mantém em campo, junto com um ou os dois comandantes.
- Quer critério: cartas pontuais que elevem o nível, tirando só as que não farão falta ou que enfraquecem o deck.
- Não perguntar sobre bracket nem cartas de estimação.

## A lista original

Está em `lista_okaun.txt`, com 100 cartas:

- 34 terrenos, sendo 12 básicos (5 Island e 7 Mountain), e 35 fontes contando o verso do Valakut Awakening.
- 23 cartas que jogam moeda.
- Três Game Changers: Cyclonic Rift, Gamble e Rhystic Study.

## O que já foi conferido e concluído

**Texto.** As 98 cartas, os comandantes e as 10 entradas foram lidos no json.edhrec.

**Regras com fonte:**
- Os comandantes disparam em "um jogador vence uma moeda" (ruling de 2018).
- O gatilho de combate vale só no seu turno.
- É "Partner with", então o Krark não pode ser o parceiro.
- O Thumb substitui cada moeda individual.
- O −7 do Ral não dispara os comandantes.

**A descoberta: o deck já tinha combo com o comandante.** Frenetic Efreet e Okaun dão poder infinito (combo 2199-2779). O Efreet também fecha com:
- Tavern Scoundrel, que dá mana infinita (211-2199);
- Chance Encounter, que vence na manutenção (2199-4800);
- Zndrsplt, que compra tudo (dedução do mesmo mecanismo).

Além desses, Niv-Mizzet e Curiosity (1089-2353).

**A conta:** virar, dobrar, conectar. Três vitórias levam o Okaun a 24. A chance de chegar lá num combate:

| | Sem Thumb | Com Thumb |
|---|---|---|
| Duas sequências | 31% | 74% |
| Três sequências | 50% | 90% |

**Gerar e converter:**

| Caminhos até | Hoje | Chance até o turno 6 |
|---|---|---|
| O Thumb | 13 | 84% |
| O Efreet | 3 | 33% |

**Onde discordo dele:** o Thumb melhora; o Efreet vence.

**As 10 trocas:**

| Sai | Entra |
|---|---|
| Reshape | Imperial Recruiter |
| Possibility Storm | Drift of Phantasms |
| Goblin Kaboomist | Strionic Resonator |
| Karplusan Minotaur | Psychosis Crawler |
| Midnight Clock | Edgar, King of Figaro |
| Fighting Chance | Deflecting Swat |
| Two-Handed Axe | Counterspell |
| Flamekin Village | Steam Vents |
| Myriad Landscape | Volcanic Island |
| Reliquary Tower | Spirebluff Canal |

Com essas trocas, o acesso ao Efreet até o turno 6 vai de 33% para 49%. Os Game Changers continuam três.

**Banco, em ordem:** Wizard's Staff, Echo, Perceptive Prodigy, Desperate Gambit, Mithril Coat.

**Recusadas:** Boompile, Game of Chaos, Sword of Fire and Ice, Twinflame, Krark's Other Thumb (ilegal) e Chira, All In (sai em 09/11/2026).

## Perguntas em aberto

1. A Possibility Storm é parte da graça do deck para ele? Se for, ela fica e sai a Goblin Archaeologist.
2. Ele quer usar o combo do Efreet como plano principal ou só quando aparecer? Isso decide se vale um quinto caminho até o Efreet.
3. Volcanic Island ou uma dual mais barata?

## Leituras sem ruling, a conferir

- A moeda ignorada pelo Thumb não vence nem perde.
- Efreet com Zndrsplt dá compra sob controle.
- Como o Edgar interage com o Thumb.

## O que o próximo chat deve fazer

1. Receber as respostas 1 a 3.
2. Fazer o teste das dez mãos até o turno 6. Medidas e metas:

| Medida | Meta |
|---|---|
| Turno do primeiro comandante | — |
| Turno em que o Okaun ataca com o Thumb em campo | — |
| Mãos com acesso ao Efreet até o turno 6 | 5 ou mais |
| Mãos em que faltou cor no turno 3 | 2 ou menos |

3. Dar a nota testada e gravar os arquivos em `C:\Projetos\mtg-hub\dados\`.

## Arquivos desta rodada

- `analise-claude-okaun-zndrsplt.md`
- `Handover_Okaun_Zndrsplt_Analise_de_Deck.md`
- `lista_nova_okaun.txt`
- `lista_okaun.txt`
- Os scripts `dados.py`, `stats.py` e `gerar.py`, com o modelo `analise_tpl.md`.
