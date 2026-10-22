# Handover: K'rrik, Son of Yawgmoth

Versão 1.0, de 14/10/2026. É anexo do Handover Mestre v2.1. O detalhe está em `analise-claude-krrik.md` e a lista nova em `lista_nova_krrik.txt`.

## Como usar

Abra um chat novo e anexe três arquivos: o Handover Mestre, este handover e a análise. Diga a tarefa: confirmar os pets, refinar as trocas ou registrar o teste das dez mãos.

## Onde paramos

- **Rodada única, de 14/10:** reestruturação com 17 trocas, nos eixos dele. Foi o quarto deck da mesma conversa.
- **Nota atual: 6.** **Nota projetada: 8,5**, sem partida.
- **Placar:** 304 hoje e 345 com as trocas.
- **Nome de painel sugerido:** Dízimo de Sangue.

## O que ele disse

- Montou o deck com sobras do Vito: cartas pretas fortes de ganhar e drenar vida.
- Nos testes, foi mediano; faltou consistência.
- Quer um deck responsivo, equilibrado e vencedor, ou pelo menos competitivo.
- Não tem estratégia; pediu que eu criasse.
- Os pets devem ser as cartas mais bonitas e caras, mas ele não listou.

**Eixos dele:** Ramp, Draw, Removal Pontual, Removal Global, WinCon, Drain/Gain life, Tutor + Reanimator, Others + Pet.

## O que já foi conferido e concluído

**Texto.** Todas as cartas e entradas foram lidas no json.edhrec.

**Regras do K'rrik** (seis rulings no grimoria):
- Só os {B} podem ser pagos com vida, nunca genérico nem X.
- Vale para qualquer custo, inclusive de ativação.
- Híbrido preto conta.
- O imposto de comandante é genérico.

**Combos já na lista:** Exquisite Blood mais Sanguine Bond (690-3966), Vito (314-3966), Enduring Tenacity (3966-5755) ou Aetherflux (3966-4740).

**A conta:** pagar, drenar, repagar. A vida é uma linha de crédito que o K'rrik saca e que o ganho de vida amortiza. Com o K'rrik em campo, o custo médio efetivo cai de 3,58 para 2,27 hoje, e para 1,97 com as trocas.

**Suposição sobre os pets:** são as cartas foil e etched, que não saíram:
- Call to the Void
- Demonic Tutor
- Erebos's Intervention
- Font of Agonies
- Grievous Wound
- Imperial Seal
- Preacher of the Schism
- Shadows' Verdict
- o próprio K'rrik
- os Swamps

**As 17 trocas:**

| Sai | Entra |
|---|---|
| Platinum Angel | Bloodthirsty Conqueror |
| Alhammarret's Archive | Vilis |
| Vampiric Tutor | Bolas's Citadel |
| Army of the Damned | Sheoldred, the Apocalypse |
| Damnation | Snuff Out |
| Mutilate | Infernal Grasp |
| Hex | Bitter Triumph |
| Blood Artist | Cut Down |
| Barbed Servitor | Pontiff of Blight |
| Unstoppable Slasher | Bloodletter of Aclazotz |
| Heraldic Banner | Cabal Ritual |
| Ghoulcaller Gisa | Emeritus of Woe |
| Infernal Offering | Night's Whisper |
| Ophiomancer | Swiftfoot Boots |
| Myriad Landscape | Cabal Coffers |
| Demolition Field | Nykthos |
| Rise of the Dark Realms | Malakir Rebirth |

**Antes e depois:**

| | Hoje | Com as trocas |
|---|---|---|
| Combo montado até o turno 8 | 39% | 44% |
| Remoção instantânea | 8 | 12 |
| Remoção instantânea até o turno 4 | 59% | 74% |
| Cartas que matam o K'rrik | 2 | 0 |
| Cartas simétricas ou contra o plano | 9 | 1 |
| Game Changers | 3 | 3 |

**Banco:** Necropotence (seria o quarto Game Changer), Leshrac's Sigil, Culling the Weak, Skirge Familiar.

## Perguntas em aberto

1. Confirmar a lista de pets. Se a Call to the Void não for pet, ela é o próximo corte.
2. Imperial Seal ou Vampiric Tutor? Pela força, fica o Vampiric. O Seal ficou por ser pet.
3. A mesa aceita Necropotence (quarto Game Changer)?

## Leituras sem ruling, a conferir

- A Bloodthirsty Conqueror forma os mesmos laços do Exquisite Blood. É dedução do texto idêntico.

## O que o próximo chat deve fazer

1. Receber as respostas 1 a 3.
2. Fazer o teste das dez mãos até o turno 6. Medidas e metas:

| Medida | Meta |
|---|---|
| Turno do K'rrik | — |
| Vida no fim do turno 6 | 15 ou mais |
| Peças de combo ou tutor na mão até o turno 6 | — |
| Mãos com remoção instantânea até o turno 4 | 7 ou mais |

3. Dar a nota testada e gravar os arquivos em `C:\Projetos\mtg-hub\dados\`.

## Arquivos

- `analise-claude-krrik.md`
- `Handover_Krrik_Analise_de_Deck.md`
- `lista_nova_krrik.txt`
- `lista_krrik.txt`
- Os scripts `dados.py`, `stats.py` e `gerar.py`, com o modelo `analise_tpl.md`.
