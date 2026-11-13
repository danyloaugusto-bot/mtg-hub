# Tarefa: destinos das cartas (MTG Hub)

Projeto em `C:\Projetos\mtg-hub`. O dono clica numa carta de um deck e quer saber **em que outro deck dele ela renderia mais**: os três melhores, cada um com a letra da tier list, o ganho no placar, quem sairia e o porquê (pedido de 12/11/2026). Desde 13/11/2026, as cartas da pasta física Preta P também entram (`esta_em` vazio quando ela não está em deck nenhum: todo deck nas cores dela é alvo). Você faz isso para uma parte das cartas, em duas etapas, pelo `motor/destinos.py`. Ele grava só em `dados/destinos/destinos.json`. **Você não grava mais nada no projeto**: só os seus arquivos de resposta na pasta de rascunho indicada. Não faça commit, não monte painel, não mexa em `decklist.txt`, `tema.json`, `avaliacao.json` nem `dados/cartas.json`.

Em Git Bash, todo comando termina com `< /dev/null`, e o Python roda com `PYTHONIOENCODING=utf-8`.

## Leia antes

1. `contexto/tier/BRIEF-TIER.md`, seções "Regras do método que mais pegam" e "Regras do dono": valem aqui, palavra por palavra.
2. `contexto/estrategias/tier-list.md`: o método (lentes, travas, portão do S).
3. `motor/tier.json`: pesos por grupo, limites, travas e funções.

## Etapa 1: sinergias

```
python motor/destinos.py --dossie "<RASCUNHO>/sin_<k>.json" --parte <k>/<n> --tamanho 30 < /dev/null
```

O dossiê traz, no topo, a régua das duas sinergias de cada deck (com o comandante e a conta do deck) e, por carta, o texto do Scryfall, as notas do cadastro, onde ela já está e os decks em que falta avaliar a sinergia. Para cada carta, dê `sin1` e `sin2` (0 a 3) **só nos decks em que alguma das duas passa de 0**, cada nota com a frase que cita a régua daquele deck. Os decks que você não citar ficam com 0 e 0. Leia a régua ao pé da letra: o que ela não pede, não pontua. Tipo de criatura só conta se a régua pedir aquele tipo.

Grave `<RASCUNHO>/sin_<k>_resp.json` no formato `{"<carta>": {"<pasta>": {"sin": {"sin1": 2, "sin2": 0}, "sin_por_que": {"sin1": "frase"}}}}` e rode:

```
python motor/destinos.py --sinergias "<RASCUNHO>/sin_<k>_resp.json" < /dev/null
```

Se o motor recusar, corrija e rode de novo. Repita com novos dossiês até ele dizer `faltam 0 depois deste lote`.

## Etapa 2: lentes dos três melhores destinos

```
python motor/destinos.py --dossie-lentes "<RASCUNHO>/len_<k>.json" --parte <k>/<n> --tamanho 30 < /dev/null
```

Por carta, os três decks de maior ganho, já com a sinergia, o ganho, o que falta no deck (critério abaixo da faixa que a carta cobre), quem sairia (a carta mais fraca da mesma função, com o texto) e as contagens do deck por critério. Para cada par carta e deck, a tier list **como se a carta entrasse naquele deck no lugar de quem sai**:

- `funcao`, as cinco `lentes` (E, I, T, Q, R, de 0 a 3) e `lentes_por_que` (uma frase por lente), `antissinergia`, `travas` e `substituto` quando houver, e `argumentos_s` (três frases) só se as lentes derem S;
- `porque`: uma ou duas frases para o dono, dizendo por que ela rende ali (ou por que não), no lugar de quem e, se for o caso, que falta no deck ela cobre. Exemplo: "Num deck só branco, as quatro manas pagam todo Anjo, e a compra de duas não depende de atacar. Sai a Dowsing Dagger, ramp que só vira terreno depois de dano em combate."

**Até dois extras por carta.** O top 3 sai do ganho no placar, e o placar não vê encaixe: o Throne of Eldraine, que só paga mágica de uma cor, rende num deck de uma cor só (Giada) e quase nada em cinco cores, mas o ganho diz o contrário. O dossiê traz em `outros_decks` os demais decks possíveis (ganho, quem sai, o que falta, a conta do deck). Se a carta teria letra melhor em algum deles do que nos três de `destinos`, avalie até dois deles também, no mesmo formato. No painel, a letra manda e o ganho desempata; destino D não aparece. Carta com `destinos` vazio e `ja_avaliados` preenchido só passa pela pergunta dos extras: responda os extras que valerem, ou `{}` para a carta (nenhum deck melhor). Toda carta do dossiê precisa aparecer na resposta, nem que seja com `{}`.

A **R** olha o deck de destino: a cota da função lá (as contagens do dossiê) e o melhor substituto que aquele deck já tem. A **E** olha a conta daquele deck. A letra não se escolhe: o motor calcula com os pesos do grupo do deck de destino.

Grave `<RASCUNHO>/len_<k>_resp.json` no formato `{"<carta>": {"<pasta>": {"funcao": "...", "lentes": {...}, "lentes_por_que": {...}, "porque": "..."}}}` e rode:

```
python motor/destinos.py --lentes "<RASCUNHO>/len_<k>_resp.json" < /dev/null
```

Repita até `faltam 0`. A etapa 2 só lista as cartas com a etapa 1 completa.

## Regras do dono que mais pegam aqui

- Texto de carta só do dossiê ou de `cache/scryfall.json`, nunca de memória. O dossiê traz a força e resistência (`forca_resistencia`) e o texto dos comandantes de cada deck (`texto_comandante`): o que um comandante dispara e o tamanho de uma criatura saem daí.
- Precon intacto (`precon_intacto` na ficha do deck): avalie normalmente, mas o `porque` termina com "O deck é precon intacto: a lista não muda."
- Valgavoth: Demônio só sai por Demônio melhor; vida é recurso.
- Terreno de uma cor tem E 1, também em deck de uma cor só. Limpeza que leva a sua mesa é antissinergia material, não estrutural.
- Sem preço. Sem bracket. Nunca sugerir Sol Ring, Arcane Signet nem uma segunda Tergrid (o motor já os tira).
- "Bom não basta": carta só boa é B. Não infle I nem E.
- Proteção genérica (Teferi's Protection, Heroic Intervention, botas e mantos) e staple genérica só pontuam alto em deck voltron, ou quando o deck tem buraco naquela função; fora disso, E no máximo 1.

## Relatório final (sua resposta)

Curto, em português: quantas cartas você fez nas duas etapas, quantas S saíram (com uma linha cada), e as cinco avaliações de que você tem menos certeza, com a dúvida em uma frase.
