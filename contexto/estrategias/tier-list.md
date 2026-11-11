# Tier list: o método do projeto

Digest do projeto, escrito em 10/11/2026 a partir dos seis arquivos de `dados/estratégias/tier list/` e dos outros digests desta pasta. **Piloto feito no Valgavoth em 10/11/2026**, com as notas gravadas no `avaliacao.json` do deck (campos `funcao`, `lentes`, `lentes_por_que`, `indice`, `antissinergia`, `travas`, `substituto`, `confianca`, `argumentos_s`, `tier_anterior`). Os outros decks vêm em lotes, cada um com o "pode" do dono.

## As fontes e o que vale delas

| Arquivo | O que é | O que fica |
|---|---|---|
| `Tier list - criterios CLAUDE 1.0.md` | Consolidação feita com o dono em 09/11/2026, com as decisões dele | **É a base.** Cinco lentes de 0 a 3, travas, pesos por grupo, portão do S |
| `TIER_MASTER_1.0.md`, calibração e adendo | Rubrica de 100 pontos, oito critérios de 0 a 4 | O portão do S, a escala de antissinergia (nenhuma, leve, material, estrutural), "contar a antissinergia, não presumir", o substituto com nome. Fora: a escala de 0 a 100, o critério de identidade (regra tribal pela porta dos fundos) e o "não recalcular" |
| `Tier list de cartas — critérios GROK.md` | Três eixos (tática, sinergia, piso) e cota por cargo | Cota por papel, "piso, não teto", teste de sanidade, terrenos na mesma escada |
| `metodologia_de_avaliacao.md` (M.I.A.) | Função, sinergia e ação | Os papéis e o custo de oportunidade do pet. Fora: "staple cai em B por definição" |

Erros de fato achados no material, conferidos no cache do Scryfall: o Strefan não paga {2}{B} para pôr o Vampiro em campo (a calibração do TIER MASTER diz que paga); a Necrodominance é de Modern Horizons 3, não da Reality Fracture; a Skirk Prospector gera uma mana por Goblin sacrificado, não mana infinita. Os números de EDHREC citados não foram conferidos.

## A pergunta

> Quanto o deck perde se esta carta sair e entrar a melhor alternativa possível para o mesmo papel?

Não é a força da carta: é o valor sobre a reposição. A letra é do deck, não da carta.

## O método, em seis passos

1. **A conta do deck**: três verbos que o comandante paga, os papéis e a cota de cada papel. Sai das duas sinergias do `tema.json`, do Plano do deck e das faixas da rubrica v3.
2. **Papel e cinco lentes**, cada lente de 0 a 3 com uma frase de porquê:
   - **E, Encaixe**: a conta depende dela? (1 é infraestrutura, e infraestrutura pode ser A.)
   - **I, Impacto**: o que muda na mesa quando resolve? Valor que depende de sobreviver vale um nível a menos.
   - **T, Taxa**: custo, velocidade e condição contra o padrão da função.
   - **Q, Quadrantes**: em quantos momentos do jogo está viva (desenvolvimento, paridade, atrás, na frente).
   - **R, Reposição**: a que distância está o melhor substituto, por fora (com nome) e por dentro (cota do papel). Papel abaixo da cota sobe a R; acima, desce.
3. **Travas**, que mandam mais que a média: antissinergia estrutural (teto D), antissinergia material (teto B, com a conta escrita), win-more (teto C), dependência ausente (teto C), dependência dupla (teto B), substituto nomeado melhor (teto C).
4. **Índice**: média ponderada das lentes, com os pesos do grupo do deck.
5. **Letra**: A de 2,20 para cima; B de 1,60 a 2,19; C de 1,00 a 1,59; D abaixo de 1,00. A trava vence o índice.
6. **Portão do S** (revisto pelo dono em 10/11/2026): índice de 2,40 ou mais; nenhuma das cinco lentes abaixo de 2; nenhuma trava, e antissinergia no máximo leve; três argumentos escritos (o que muda na conta sem ela, por que o substituto não cobre, em que momentos atua). O S mede excelência, não exclusividade: ter par na lista não tira o S, e não há limite de cartas S. Falhou em um item, é A.

Pesos por grupo (E, I, T, Q, R): 01. TOP 15, 25, 25, 20, 15; 02. TRIBAIS 25, 20, 20, 15, 20; 03. CAOS e 04. FORFUN 30, 20, 15, 15, 20; 05. DESEJO herda o grupo de destino.

## Decisões do dono

- Cinco tiers, sem subníveis. Nenhuma regra de tipo ou de tribo no S: o S exige argumentos (09/11/2026).
- Pet não muda a letra. A letra é honesta; o pet só fica fora do corte. Duas leituras por deck: valor de estimação (pets em S ou A) e custo de estimação (pets em C ou D).
- Pesos por grupo do deck.
- O comandante fica fora da tier list.
- A relevância (INS, ALT, MÉD, BAX) fica como campo separado, sem entrar no índice.
- Antissinergia que desliga o comandante ou o motor, mesmo por tempo limitado, conta como estrutural, salvo decisão carta a carta.
- **Refazer todos os decks** (10/11/2026), em lotes, e não só os revisitados.
- **"Bom não basta"** (10/11/2026): a carta só boa, que não muda o jogo quando entra, é a fila de upgrade. No método, isso é a lente I e a letra B.

## Ajustes do piloto (Valgavoth, 10/11/2026)

- **Substituto de fora só rebaixa a pior cópia do papel.** A carta nova entraria no lugar da pior da função, então só ela leva R = 0. Sem isso, uma carta de fora melhor derrubaria o papel inteiro.
- **Terreno:** a lente E lê as cores: 2 para as duas cores (ou utilitário que serve a um verbo), 1 para uma cor, 0 para incolor.
- **Tutor sem restrição:** I = 2, porque vale a carta que busca.
- **Os limites (2,20, 1,60, 1,00 e 2,40) ficaram como estavam.**
- **Nome do campo:** `funcao` no dado, "Função" na tela (o Plano do deck já usa `papel`).
- **Decisões por deck** ficam no bloco `tier_lista` do `avaliacao.json`. No Valgavoth: vida é recurso (cobrar a vida do dono não é antissinergia); Demônio só sai por Demônio melhor; The Lord of Pain é a única carta de estimação.
- Resultado no Valgavoth, 99 cartas fora o comandante: de 5 S, 27 A, 53 B, 13 C e 1 D para 7 S, 9 A, 63 B, 19 C e 1 D.

## Como os outros digests entram

- `radar.md` (staples e efeito manada): staple genérica é E = 1; só segura vaga pela R (papel abaixo da cota) e pela T. Carta nova só entra se a letra e o índice dela neste deck forem maiores que os da carta que sai.
- `ameaca.md` (avaliação de ameaças): o ponto de falha do deck define a cota do papel Proteção; as limpezas (3 a 4, de preferência unilaterais) definem a cota de Resposta em massa.
- Plano do deck (`contexto/plano/METODO-PLANO.md`): habilitadora, recompensa e multiplicadora são ponto de partida para o papel da tier list, que tem sete (motor, conversor, habilitador, infraestrutura, resposta, proteção, fechamento).
- Rubrica v3: o placar não muda. A tier mede o mérito do slot; o placar mede o deck.

## O que a tier list alimenta depois

- Fila de corte: D estrutural, os outros D, C com substituto, os outros C, B de papel acima da cota. Nunca o comandante, os pets nem carta de papel abaixo da cota; terreno só sai por terreno.
- Radar e `/colecao`: a troca compara a letra e o índice da carta que entra com os da que sai.
- Gaveta da carta, "Onde mais renderia": o tier que a carta teria em cada outro deck, ao lado do ganho (pedido do dono, 10/11/2026).

## Em aberto

O motor já calcula (`motor/tier.json` e `motor/tier.py`) e o painel já mostra a função e as notas. Falta aplicar o método aos outros 25 decks, em lotes de cinco, e mostrar o tier por deck no "Onde mais renderia".
