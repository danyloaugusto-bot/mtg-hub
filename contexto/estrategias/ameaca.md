# Avaliação de ameaças (threat assessment)

Digest do projeto, escrito em 08/11/2026 a partir dos três arquivos de `dados/estratégias/ameaça/`, com as decisões do dono. É a referência do bloco **"Na mesa"** (`estrategia.mesa`) de cada deck e da página geral de estratégias do hub.

## As fontes e o que vale delas

| Arquivo | O que é | Confiança |
|---|---|---|
| `Threat_Assessment_Commander_Resumo_Completo.md` | Resumo dos dois vídeos, com a hierarquia de ameaças em nove níveis | Média: atribui frases ao Fazendo Nerdice que o terceiro arquivo diz não poder verificar |
| `estrat_gia_avan_ada_de_threat_assessment_em_commander.md` | Dossiê curto, matriz de postura | Média, pelo mesmo motivo |
| `guia_threat_assessment_commander.md` | Guia longo, com checklists, ponto de falha por arquétipo e doze cenários | Alta: declara que só o vídeo do Tolarian (02/08/2024) foi verificado, e separa o que é elaboração própria |

Regra: o guia é a base; os outros dois somam onde não contradizem. Nada aqui é texto de carta.

## As ideias que ficam

1. **Ameaça não é a maior criatura nem o menor total de vida.** É quem tem mais chance de vencer nos próximos turnos: motor de mana, motor de compra, combo parcial, comandante recorrente. Mesa larga de criaturas vem depois.
2. **Hierarquia, do mais ao menos perigoso:** algo que vence agora; motor de mana; motor de compra; comandante forte e recorrente; combo parcial; valor repetido; mesa larga; voltron protegido; stax. A ordem muda quando uma peça trava especificamente o seu deck.
3. **Remoção é recurso escasso.** Gaste no motor, não no corpo; pergunte "se eu não responder agora, o jogo acaba?" e "outro jogador pode responder por mim?".
4. **Limpeza de mesa: quem reconstrói melhor?** Não limpe porque há muitas criaturas; limpe quando a sua posição relativa melhora.
5. **Reavalie a cada jogada grande.** Quem foi a ameaça há dois turnos pode não ser mais; vingança e inércia são os dois erros mais comuns.
6. **Sendo a ameaça:** descubra por quê (mesa, motor, combo, comandante), proteja a peça que vence (não a maior criatura), e feche antes de a mesa se reorganizar.
7. **Fugindo de ser a ameaça:** desenvolva sem revelar tudo, guarde a peça decisiva na mão, prefira ameaças de perfil baixo quando o plano permite, mas sem enfraquecer a lista para parecer inofensivo.
8. **Política:** argumentos específicos e verificáveis ("se essa peça ficar, ele compra três por turno"), acordos com objetivo e prazo claros.

## Onde os arquivos se contradizem, e o que o projeto adota

- **Quando gastar interação.** O dossiê curto manda guardar tudo para proteger a própria vitória; o resumo e o guia mandam remover motor de compra e de mana cedo. **Adotado:** motor cedo, proteção para o fechamento.
- **Tom político.** O resumo sugere parecer mais fraco por linguagem corporal e "se eu cair, levo alguém comigo". **Decisão do dono (08/11/2026):** tom útil, não manipulador, como no guia; sem blefe e sem kingmaking. A postura por deck é uma de duas: **conciliador**, enquanto monta a mesa e busca aliados, ou **assumir a ameaça** e retomar a dianteira o quanto antes, quando a janela existe.
- **A pontuação mental 0–3 do guia** (velocidade, recursos, campo, combo, motor, interferência, resiliência) é ferramenta de conversa. **Não se mistura com o placar do hub.**

## Decisões do dono que valem para todos os decks

- **Visibilidade não pontua.** Tier, relevância e placar medem força no deck; "chamar atenção" é informação do bloco "Na mesa", caso a caso.
- **3 a 4 remoções globais por deck, de preferência unilaterais** ou assimétricas a favor do deck (indestrutível do seu lado, gatilhos de morte seus, reconstrução na mão). Deck com menos de três ganha sugestão no radar. A Damnation fica no Vito mesmo com 31 criaturas: "é preciso controlar a mesa até eu retomar o controle".
- **Proteção do comandante sobe no radar onde ele é o ponto de falha** (Goblins, Turtle Power!, K'rrik, pelo Plano do deck). No Vito, por decisão do dono, a proteção não é prioridade: o deck se espalha em Vampiros.
- **A decisão do dono por deck vence o material geral.**

## O que o material muda no hub

- **Por deck, o bloco `estrategia.mesa`:** como a mesa te lê, postura, sinais (as cartas que te marcam como ameaça), o que fica na mão, ponto de falha, respostas a guardar e para quê, as suas limpezas e quem atacar. Formato em `contexto/ARQUITETURA.md`; o build recusa carta citada que não esteja no deck ou no radar.
- **No dossiê do NotebookLM:** a seção "Na mesa" e o roteiro de dez perguntas para o chat.
- **Na página geral do hub:** este digest, uma vez só, para não se repetir trinta vezes.

## Leitura dos 30 decks, 08/11/2026

- 16 dos 30 decks são tribais de mesa larga: pela hierarquia, ameaça visível mas de prioridade baixa. O risco deles é a limpeza alheia, não o foco; o que importa é quem reconstrói melhor.
- Os motores que de fato viram a mesa contra o dono: Necropotence (Markov, Vito, Zumbis, Deadpool), Rhystic Study (Heads I win, Zara, Braids, Slivers, Storm), The One Ring (Giada, Queen, Braids, Deadpool, Storm), Smothering Tithe (Giada, Humanos, Kaalia, Queen, Slivers), Bolas's Citadel (Markov, Vito, Elfos). São os "sinais" naturais de cada bloco.
- Comandante como ponto de falha, pelo Plano: Goblins, Turtle Power! e K'rrik.
