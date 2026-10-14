# Handover: Tergrid (Tergrid, God of Fright)

Versão 1.0, de 13/10/2026. Anexo de detalhe do Handover Mestre v2.0.

## Como usar

Para continuar, abra um chat novo e anexe três arquivos: o Handover Mestre v2.0, este handover e o `analise-claude-tergrid.md`. Diga o que quer fazer: o teste das dez mãos, uma segunda rodada ou o painel. A lista nova completa está no anexo da análise e em `lista_nova_tergrid.txt`.

## Onde paramos

A análise foi feita em 13/10/2026, como reconstrução direta, com o diagnóstico da lista atual no mesmo arquivo.

| Item | Atual | Nova |
|---|---|---|
| Placar | 326 | 383 |
| Turno mediano da Tergrid (simulação) | 6 | 5 |
| Tergrid até o turno 4 | 22% | 44% |
| Motores recorrentes fora a comandante | 5 | 9 |
| Forçadores sem escolha do oponente | 10 | 13 |
| Fontes de terreno | 33 | 32 |
| Game Changers | 1 | 15 |
| Nota | 5,5 | 8,5 projetada, sem partida |

A reconstrução fez 40 trocas e mexeu na base de mana.

## O que ele disse

- O deck vive de descarte e sacrifício alheio, de resiliência e de usar as permanentes dos oponentes para vencer.
- Ele quer equilíbrio entre a mesa dele, outras formas de vencer além da Tergrid e cartas de dupla função.
- As fases: no início, ler a mesa, ramp, política e criaturas pequenas; no meio, preparar a Tergrid; no fim, finalizar um ou dois jogadores sem pensar muito.
- Respostas ao ponto de controle:
  - Bracket máximo, deck otimizado ao máximo.
  - "Pode seguir com qualquer sugestão": nenhuma carta de estimação, base de mana liberada.
  - Aprovou os eixos novos.

## Eixos aprovados

Ramp · Draw · Removal · Proteção · Descarte · Sacrifício · Fechamento · Recursão.

Os originais 7 "(D) & (S)" e 8 "Especial (Sinergia + Recorrência)" foram trocados com a aprovação dele.

## O que já foi conferido e concluído

- **Texto conferido:** as 79 cartas não-básicas da lista e as 40 entradas, via `json.edhrec.com/cards`. Nenhuma ficou com texto de memória.
- **A conta do deck:** roubos por volta = eventos forçados nos oponentes × taxa de acerto. O texto só paga quando o oponente sacrifica permanente não-ficha ou descarta carta de permanente. Edito ou descarte em que o oponente escolhe tem taxa baixa.
- **Plano da lista nova:** esvaziar, roubar, sufocar. A Tergrid sai cedo, o lock simétrico vem em seguida (Pit, Mists, Smokestack, Braids, Archfiend), e você paga a sua parte com o que roubou.
- **A política saiu do plano.** O deck é o vilão da mesa, e a lista foi feita para aguentar isso.
- **Combos reais:**
  - Dark Depths + Thespian's Stage. Vesuva não serve: a cópia entra com os marcadores.
  - Sheoldred, the Apocalypse + Peer into the Abyss.
- **A Tergrid não tem combo próprio em mono-B.** O único no Commander Spellbook usa Ley Weaver, que é verde.
- **Cartas recusadas por exilar em vez de mandar ao cemitério:** Dauthi Voidwalker, Necrodominance, Garruk, Veiled Butcher e Strategic Betrayal.
- **Game Changers:** vale a lista de 09/02/2026. A atualização de 12/10/2026 não foi confirmada.

## Perguntas em aberto

1. **Teste das dez mãos com a lista nova.** As quatro medidas e as metas estão na seção 7.5 da análise. Elas decidem se as 32 fontes bastam e se a nota sobe.
2. **A mesa dele pune o vilão?** Se punir, Smokestack e Braids saem primeiro para Painful Quandary e Grief, que são os primeiros do banco.
3. **Nome do painel:** a sugestão é "Lanterna do Medo", e as alternativas são "Mãos Vazias" e "O Saque de Kaldheim". Ele ainda não escolheu.
4. **Capa** para a moldura.
5. **Quatro leituras de regra sem conferência oficial:**
   - comandante sacrificado ou descartado (903.9a);
   - a Tergrid saindo junto com o sacrifício (603.10a);
   - Ill-Gotten Gains;
   - Dark Depths com Stage.

## O que o próximo chat deve fazer

- Se vierem os números do teste, recalibrar:
  - falta de terreno: Lotus Petal sai e entra um Pântano;
  - Tergrid tarde: rever Crypt Ghast e Cabal Ritual.
- Conferir na regra oficial as quatro leituras abertas.
- Ler o texto de Chains of Mephistopheles, Memory Jar e Nykthos, que aparecem no cEDH da Tergrid e ficaram sem veredito.
- Não construir o painel. Os arquivos vão para `C:\Projetos\mtg-hub\dados\XX. Tergrid\`, e o painel sai do `/novo-deck` no Claude Code.

## Registro de rodadas

### 13/10/2026: ponto de controle e reconstrução

- **Ponto de controle:** lista conferida (100 cartas, 33 fontes, 24 de preto, 9 terrenos que só geram incolor, contando a Cabal Stronghold (no ponto de controle eu disse 8)); quatro leituras do texto da Tergrid; proposta de eixos.
- **Reconstrução:** 40 trocas. A tabela de sai e entra está na seção 7.2 da análise.
