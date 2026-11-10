# Tier list: o método do projeto

Digest do projeto, escrito em 10/11/2026 a partir dos seis arquivos de `dados/estratégias/tier list/` e dos outros digests desta pasta. **Ainda não está implementado em nenhum deck**: o piloto e os lotes só começam com o "pode" do dono.

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
6. **Portão do S**, sete condições, todas obrigatórias: E = 3; sem par na lista; R de 2 ou mais; I e Q de 2 ou mais e T de 1 ou mais; nenhuma trava; índice de 2,40 ou mais; três argumentos escritos (o que muda na conta sem ela, por que o substituto não cobre, em que momentos atua). Falhou em um, é A, com o motivo.

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

Ver o relatório ao dono de 10/11/2026: nome do campo do papel (o Plano já usa `papel`), deck do piloto e quem dá a nota de cada lente.
