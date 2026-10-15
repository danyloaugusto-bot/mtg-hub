# Pontuação v3: arquivos, formatos e o que muda no motor

Complementa `RUBRICA.md` (as regras de nota) e `pontuacao.json` (pesos, faixas, pontos por nota e aceleração). Escrito para o Claude Code executar; decisões do dono de 15/10/2026.

## 1. Arquivos novos

### `motor/pontuacao.json`
Copiar de `contexto/pontuacao/pontuacao.json`. É a única fonte de pesos, faixas, pontos por nota e da regra de aceleração. Painel, hub e testes leem daqui; nenhum número desses fica escrito no código.

Acrescentar uma cor padrão por critério (`"cor": "r,g,b"`), para o hub e para decks sem cor própria:

| k | cor |
|---|---|
| sin1 | 232,186,86 |
| sin2 | 240,150,192 |
| resiliencia | 84,196,170 |
| recurso | 200,205,215 |
| draw | 111,170,246 |
| amplificador | 246,150,84 |
| remocao | 232,98,104 |
| evasao | 150,210,240 |
| dano | 172,110,220 |
| aceleradores | 120,200,110 |

### `dados/cartas.json`: o cadastro único
Uma entrada por carta, pelo nome oficial em inglês da face da frente (o mesmo do cache do Scryfall). Guarda só os oito critérios da carta (3 a 10); nunca as sinergias, que são do deck.

```json
{
  "versao": 3,
  "cartas": {
    "Swords to Plowshares": {
      "n": {"remocao": 2},
      "por_que": "Exila uma criatura por 1 mana, instantânea.",
      "fonte": "claude",
      "revisado": "2026-10-15"
    },
    "Lyra Dawnbringer": {
      "n": {"resiliencia": 1, "amplificador": 2, "evasao": 1},
      "por_que": "Voa; vínculo com a vida; outros Anjos ganham +1/+1 e vínculo.",
      "fonte": "claude",
      "revisado": "2026-10-15",
      "so_com": "Angel"
    }
  }
}
```

- `n`: só os critérios com nota acima de 0.
- `fonte`: `auto` (pré-nota do script), `claude` (revisada pelo Claude) ou `dono` (corrigida pelo dono). O script nunca sobrescreve `claude` nem `dono`.
- `so_com` (opcional): o tipo de que parte da nota depende ("Angel", "Zombie", "Equipment"). No encaixe, um deck sem pelo menos 10 cartas desse tipo recebe o aviso "depende de Angel" ao lado do número.

### `motor/prenota.py`
Pré-nota automática dos oito critérios da carta a partir do cache do Scryfall (`oracle_text`, `type_line`, `produced_mana`, `faces`). Grava `fonte: "auto"`. Serve para o Claude revisar mais rápido, não para valer sozinho. Regras de partida, a refinar:

| Critério | Sinal no texto (inglês, sem maiúsculas) | Nota de partida |
|---|---|---|
| aceleradores | `add {` ou `produced_mana` em não-terreno; `search your library for a basic land`/`land card`; `costs {1} less`/`cost {x} less` | 2; 3 se adiciona 2 ou mais manas |
| draw | `draw a card` | 1; `draw two`/`draw three` = 2; `at the beginning of`/`whenever` + draw = 3 |
| remocao | `destroy target`, `exile target`, `return target ... to its owner's hand` | 2; `destroy all`/`exile all`/`each creature` = 3 |
| resiliencia | `hexproof`, `indestructible`, `protection from`, `counter target spell`, `gain ... life`, `lifelink`, `vigilance` | 1; `creatures you control gain hexproof`/`indestructible` = 3 |
| recurso | `create ... token`, `scry`, `surveil`, `from your graveyard to`, `search your library for a card` | 1; repetível = 3; tutor de qualquer carta = 3 |
| amplificador | `+1/+1 counter`, `get +`, `copy target`, `proliferate`, `double strike` | 1; `creatures you control get`/`double` = 2 a 3 |
| evasao | `flying`, `trample`, `menace`, `can't be blocked`, `deathtouch`, `initiative`, `shadow` | 1; `can't be blocked` = 2; `creatures you control have flying` = 3 |
| dano | `loses ... life`, `deals ... damage to each opponent`/`target player`/`any target` | 1; `each opponent loses` repetível = 2 a 3 |

Terreno básico = 0. A regra de "faz duas vezes" e a de "um efeito, um critério" são do Claude na revisão, não do script.

**Ponto de partida a partir das notas antigas.** Para os decks que já têm avaliação, o script também lê as notas antigas como sinal, só para sugerir:

| Agrupamento antigo | Critério novo |
|---|---|
| ramp, ramp2, mana | aceleradores |
| draw, compra, combustível | draw |
| removal, interação, encanto, limpeza, global | remocao |
| counter | resiliencia (a lista do dono põe anulações em Resiliência) |
| protecao, blindagem, defesa | resiliencia |
| tokens, fichas, recursao, tutor | recurso |
| buff, prolif, marcadores | amplificador |
| evasao | evasao |
| dano, drain, vida (perda) | dano |
| sinergia, tribo e eixos do comandante | ponto de partida para sin1 e sin2 |

## 2. O que muda nos arquivos de cada deck

### `tema.json`: as duas sinergias
```json
"sinergias": {
  "sin1": {"nome": "Anjos", "regra": "Anjos e o que faz Anjo entrar ou crescer com a Giada. 1: só é Anjo. 2: Anjo que entra e cresce com ela, ou carta que põe Anjo em campo. 3: peça em volta da qual o deck foi montado."},
  "sin2": {"nome": "Marcadores e ganho de vida", "regra": "1: ganha vida ou põe marcador de passagem. 2: motor de um dos dois. 3: converte um no outro, ou dobra."},
  "aprovado": ""
}
```
O Claude propõe as duas a partir do `lede`, da estratégia e do texto do comandante; o dono aprova e a data vai em `aprovado`. Sem `aprovado`, o build avisa, mas monta.

`agrupamentos` (cores) passa a ser por critério novo, com as dez chaves. Sem cor no tema, vale a cor padrão do `pontuacao.json`.

### `avaliacao.json`
- `"versao_pontuacao": 3` no topo. Sem ele, o deck segue no método antigo: é isso que deixa o piloto rodar sem quebrar os outros 27.
- `agrupamentos` sai (os critérios são os dez fixos).
- Em cada carta de `cartas` e de `radar`, `notas` sai e entra `"sin": {"sin1": n, "sin2": n}`. `tier`, `rel`, `faz`, `porque`, `marcas`, `prioridade`, `fora_do_corte`, `veredito`, `sai` e os demais campos ficam como estão.
- `"ajustes": {"criterio": n, "motivo": "..."}` (opcional, raro): corrige um critério da carta só neste deck, quando o contexto muda a função. Exemplo: um efeito que só funciona com Equipamentos num deck sem Equipamentos. Sem `motivo`, o build recusa.
- `pacote` (a carta no quadro da aba de critérios) passa a usar as chaves novas.
- `leituras`: `agrupamento:ramp`, `agrupamento:draw` e `agrupamento:removal` viram `aceleradores`, `draw` e `remocao`. As leituras de contagem, tribo, proporção e curva não mudam.

### `HISTORICO.md`
Uma entrada "pontuação v3": o placar antigo, o novo, e a frase "a régua mudou; o placar novo não se compara com os anteriores a esta data".

## 3. O que muda no motor (mapa para o Code)

| Onde | O que |
|---|---|
| `motor/dados.py` | Ler `pontuacao.json` e `dados/cartas.json`; montar as notas de cada carta = cadastro + `sin` + `ajustes`; validar (nota de 0 a 3, chave conhecida, carta do deck ou do radar sem cadastro = erro com a lista das que faltam, `ajustes` sem motivo = erro); manter o caminho antigo para deck sem `versao_pontuacao`. |
| `motor/hub.py` | `placar` em Python com a régua nova (para os testes e o hub); empacotar as notas no array `s` na ordem dos dez critérios. |
| `motor/painel/app.js` | `stats`: soma ponderada com pontos por nota e aceleração pela tabela do dono; leituras com as chaves novas; gráfico do topo com 10 peças; tabelão com 10 colunas; aba 8×8 vira a aba dos critérios (10 quadros); fila de corte por valor da carta; gaveta da carta ganha a caixa "Encaixe". |
| `motor/hub/app.js` | `contas` igual ao painel; Fundamentos usa `aceleradores`, `draw` e `remocao`; Reserva e sobra usa as faixas do `pontuacao.json`; **o placar passa a ser comparável**: tirar as frases "o placar nunca compara decks" e acrescentar o ranking dos decks pelo placar novo e pela soma de cada critério; Radar e Compras ganham o encaixe por deck. |
| `testes/` | Placar novo refeito em Python, independente do JavaScript; controles do piloto regravados; teste de rubrica (toda carta com cadastro, notas válidas, sinergias definidas). |
| `.claude/skills/` | `/novo-deck`, `/auditar`, `/atualizar-deck`, `/potenciais` e `/compras` passam a avaliar pela `RUBRICA.md` e a gravar no cadastro único e em `sin`. |
| `contexto/` | `AVALIACAO.md` aponta para a `RUBRICA.md` quando todos os decks migrarem; `ARQUITETURA.md` e `ESTADO.md` registram a v3. |

## 4. Encaixe: a conta

Para uma carta `c` e um deck `D`:

1. Notas de `c` em `D`: cadastro + `sin` de `c` em `D` (0 se não avaliada, com o aviso "sinergia a avaliar") + `ajustes`.
2. Saturação de cada critério em `D`: conta as cartas do deck com nota 2 ou mais naquele critério e compara com a faixa (abaixo 1,5×, dentro 1×, acima 0,5×).
3. Valor com saturação de `c` = soma de peso × pontos × saturação.
4. Quem sai: a carta de menor valor (sem saturação) do deck, fora comandante, `fora_do_corte` e terrenos. Se `c` é terreno, sai o terreno de menor valor.
5. Ganho = valor com saturação de `c` − valor de quem sai. Mostrar também a variação do CMC médio e dos pontos de aceleração.
6. Ordenar os decks pelo ganho e mostrar os cinco melhores, com quem sai e os critérios em falta que a carta cobre.
