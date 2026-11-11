# Tarefa: tier list de um deck pelo método do projeto (MTG Hub)

Projeto em `C:\Projetos\mtg-hub`. Você prepara as notas da tier list de UM deck de Commander e as confere com o motor. **Não grave nada dentro do projeto**: só o arquivo de saída na pasta de rascunho indicada. Não faça commit, não monte painel, não mexa em `decklist.txt`, `tema.json` nem `avaliacao.json`.

## Leia antes, nesta ordem

1. `contexto/estrategias/tier-list.md`: o método (pergunta, seis passos, lentes, travas, portão do S, ajustes do piloto).
2. `dados/estratégias/tier list/Tier list - criterios CLAUDE 1.0.md`: as tabelas de cada lente (seções 3 a 6 e 11). Atenção: o portão do S dessa fonte foi revisto; vale o do digest (item 1).
3. `motor/tier.json`: pesos por grupo, limites, travas, funções.
4. `contexto/tier/piloto-valgavoth.json`: o exemplo pronto (83 cartas). Imite o tamanho e o tom das frases.
5. Do deck (pasta em `dados/decks/<grupo>/<pasta>/`): `tema.json` (as duas sinergias e os verbos), `deck.md`, `decklist.txt`, e no `avaliacao.json` os blocos `estrategia`, `cartas` (tier atual, notas, porquê, `fora_do_corte`, `fica`), `radar` (de onde vêm os substitutos com nome), `combos` e `plano`.

## Texto das cartas: nunca de memória

Leia o texto oficial no cache: `cache/scryfall.json`, chave `nomes` (nome em minúsculas, a frente da carta dupla) leva a uma chave de `cartas`, com `mana_cost`, `type_line`, `oracle_text` (ou `faces`). Monte para você um dossiê com todas as cartas do deck antes de dar nota. Substituto com nome só vale se estiver no radar do deck ou se você conferir o texto dele no cache.

## O que entregar

Um JSON em `<RASCUNHO>/tier_<pasta>.json`, neste formato (o comandante fica fora; todas as outras cartas do `avaliacao.json` entram, terrenos e básicos também):

```json
{"conta": "uma ou duas frases: os três verbos do deck",
 "decisoes": [],
 "cartas": {"Nome da carta": {
   "funcao": "motor | conversor | habilitador | infraestrutura | resposta | proteção | fechamento",
   "lentes": {"E": 0, "I": 0, "T": 0, "Q": 0, "R": 0},
   "lentes_por_que": {"E": "frase", "I": "frase", "T": "frase", "Q": "frase", "R": "frase"},
   "antissinergia": "nenhuma | leve | material | estrutural",
   "travas": [],
   "substituto": "nome, quando houver",
   "confianca": "alta | média | baixa",
   "argumentos_s": ["só se a carta chegar a S: o que muda na conta sem ela", "por que o substituto com nome não cobre", "em que momentos do jogo ela atua"]}}}
```

Não inclua a chave `estimacao` (as marcas de estimação do deck ficam como estão).

Confira com o motor, até passar sem erro (em Git Bash, sempre com `< /dev/null`):

```
cd /c/Projetos/mtg-hub && PYTHONIOENCODING=utf-8 python motor/tier.py --deck "<pasta>" --conferir "<RASCUNHO>/tier_<pasta>.json" < /dev/null
```

A letra **não se escolhe**: o motor calcula pelos pesos do grupo. Dê as notas primeiro; se a letra sair estranha, reveja a lente errada, nunca force a letra. Carta que o motor levar a S sem `argumentos_s` é recusada: escreva os três argumentos.

## Regras do método que mais pegam

- **A pergunta:** quanto o deck perde se esta carta sair e entrar a melhor alternativa para a mesma função. Piso, não teto: o que a carta faz numa partida média deste deck.
- **E (Encaixe):** 3 é verbo da conta; 2 alimenta um verbo toda vez; 1 é infraestrutura que qualquer deck das cores usaria; 0 não avança a conta. Tipo de criatura não entra: nada de regra de tribo.
- **I (Impacto):** valor que depende de sobreviver vale um nível a menos. Tutor sem restrição é 2.
- **T (Taxa):** contra o padrão da função (tabela da seção 4.3 da fonte). Custo que se paga com menos na prática entra pelo custo real.
- **Q (Quadrantes):** desenvolvimento, paridade, atrás, na frente; 0 a 3 conforme vive em um, dois, três ou quatro.
- **R (Reposição):** por fora (substituto com nome) e por dentro (cota da função). Função abaixo da cota sobe a R em um nível; acima, desce. **Substituto de fora só rebaixa a pior cópia da função**, não a função inteira.
- **Terrenos:** E = 2 para as duas ou mais cores do deck sem condição pesada (ou utilitário que serve a um verbo), 1 para uma cor (também em deck de uma cor só), 0 para incolor; T pelo entrar desvirado; I = 1. Básicos: uma entrada só por nome.
- **Travas:** antissinergia estrutural (teto D), antissinergia material (teto B, com a conta na frase), win-more (teto C), dependência ausente (C), dependência dupla (B), substituto nomeado melhor (C, e exige `substituto`).
- **S:** índice de 2,40 ou mais, nenhuma lente abaixo de 2, nenhuma trava, antissinergia no máximo leve. Mede excelência ("faz muita coisa, tem sinergia, é forte, impecável"), não exclusividade: ter par na lista não tira o S, e não há limite de cartas S.
- **"Bom não basta":** a carta só boa, que não muda o jogo quando entra, é B. Não infle I nem E.
- Pet não muda a letra. A relevância (INS, ALT, MÉD, BAX) não entra.

## Regras do dono

- Frases em português do Brasil, curtas (até umas 20 palavras), afirmativas, sem travessão longo, sem jargão de método. Jargão de Magic do jogador fica: lord, buff, ramp, goad. Nome de carta em inglês, como impresso.
- Sem preço em lugar nenhum.
- Nunca sugerir Sol Ring, Arcane Signet nem uma segunda Tergrid como substituto.
- Decks do grupo 05. DESEJO não existem fisicamente: não cite cartas "deles" como disponíveis.
- Carta com `fica` ou `fora_do_corte` continua com letra honesta: só não entra em corte.
- Não afirme nada que você não conferiu no texto da carta ou nos arquivos do deck.

## Relatório final (sua resposta)

Em português, curto, só fatos conferidos:

1. A conta do deck (os três verbos) e as cotas que você usou por função, com quantas cartas o deck tem em cada.
2. Distribuição antes e depois (as duas linhas que o `--conferir` imprime).
3. Todas as S, com uma linha cada.
4. Todas as D, com o motivo e o substituto.
5. Cartas com `fora_do_corte` ou `fica` que ficaram em C ou D.
6. As cinco notas em que você tem menos certeza, com a dúvida em uma frase.
7. Cartas que mudaram duas letras ou mais (de A para C, por exemplo), com o motivo.
8. Qualquer erro de fato que você tenha achado no `avaliacao.json` do deck (texto de carta que não bate com o porquê escrito).
9. O caminho completo do arquivo gerado e a confirmação de que o `--conferir` passou.
