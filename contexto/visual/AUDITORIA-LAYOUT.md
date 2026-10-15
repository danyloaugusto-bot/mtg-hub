# Auditoria de layout, 15/10/2026

O que foi visto: os 29 painéis em 7 abas (Visão geral, Galeria, Tier list, Tabelão, Painel de controle, Radar e Oficina) e o hub em 13 estados (estante, estante aberta, lista, pastas e as 9 abas do Dashboard). Cada tela foi vista em 1360px e em 375px, 432 telas no total, montadas a partir das saídas do PC deste dia. Cada tela passou por uma medição automática (rolagem lateral, texto pequeno, texto cortado, sobreposição e contraste WCAG) e por inspeção visual em folhas de contato. O gráfico do herói e o 8×8 ficaram fora da medição; o gráfico tem o guia próprio (`GUIA-VISUAL.md`).

O que está limpo: nenhuma rolagem lateral da página nas 432 telas e nenhum erro de JavaScript. O hub está consistente nas duas larguras. O que existe abaixo é acabamento, salvo três pontos de uso.

## P1: afeta o uso ou contraria uma decisão

### 1. Abas do painel somem no desktop

12 dos 29 painéis, já em 1360px (19 dos 29 em 1280px). "Oficina" some ou fica embaixo de "100 cartas". No Evelyn, o título invade "Visão geral". Uma tela maior não resolve, porque a barra tem largura máxima. Com o problema em 1360px: Evelyn, Goblins, Humanos, Kaalia, Strefan, K'rrik, Tergrid, Valgavoth, Fynn, Queen, Zara e Zur. Em 1280px entram também Giada, Lynde, Master Of Evil, Assassin Creed, Braids, Slivers e Storm.

A causa: a marca (o nome do deck na fonte do título) não encolhe, e as abas cortam.

A correção: a marca encolhe primeiro (`min-width:0`, reticências), as abas nunca cortam, e "100 cartas" sai da barra abaixo de 1500px, porque o número já está no herói.

### 2. Abas do painel espremidas no celular

Todos os 29 painéis. A faixa de abas fica entre a seta de voltar e os botões Potenciais e Backup, com cerca de uma aba e meia visível e texto cortado dos dois lados.

A correção: as abas vão para uma segunda linha de largura total, com rolagem lateral, esmaecimento nas bordas e a aba ativa centralizada ao abrir.

### 3. O painel ainda mostra preço

Na varredura de 14/10 o preço saiu só do hub. O painel ainda mostra:

- no Tabelão, a coluna "US$", o total do deck e a ordenação por preço;
- na Visão geral, o quadro "Relevância e valor", com US$ por faixa e o total;
- na ficha da carta, "US$ x no Scryfall";
- no radar, textos de análise que citam preço (por exemplo, Gaea's Cradle "US$ 1.635").

Isso contraria a decisão "sem preço" do dono. A correção: tirar do painel e manter o quadro como "Relevância" (Qtd e % do deck). O cache pode continuar guardando o preço, mas nada o mostra. Os textos do radar com preço são reescritos no próximo `/auditar` de cada deck.

## P2: legibilidade

### 4. Letra de tier e números na fonte de título

`.tb`, `.tier-l b`, `.facts dd`, `.ctr-n` e `.score-big b` usam a fonte do deck. Na Kaalia (New Rocker) o S parece 5. Nos Dragões (Almendra Display) o A vira 𝔄. No Vito, Clavileño e K'rrik os números ficam ornamentados ou só com contorno.

A correção: a letra de tier e os números pequenos passam para a fonte do texto, peso 800, com algarismos tabulares. O placar grande mantém a fonte do deck onde ela for legível.

### 5. Rótulos do gráfico fora da tela no celular

7 decks: Vito ("Vampiros (c/ sinergia)", "Life gain/drain"), Dragões ("Dano dobrado"), K'rrik ("Tutor + Reanimator", "Removal Pontual"), Master Of Evil ("Escolha vilanesca"), Fynn ("Buff + WinCon"), Ken ("CE não-criatura") e Zara ("Motor da Zara").

A correção agora: quebrar em duas linhas os nomes acima de 14 caracteres. No rebranding, a regra entra no guia.

### 6. Curva de mana pequena no celular

O eixo e a legenda do eixo ficam com cerca de 10px na tela. A correção: o mesmo `--k` do gráfico do herói.

### 7. Símbolos de mana pequenos

Na Galeria, na Tier list e no Radar, o símbolo herda o tamanho da linha de tipo e fica entre 7,7px e 11px. A correção: mínimo de 12px.

### 8. Tabelas largas no celular sem aviso

O Tabelão tem 1.070px numa caixa de 349px. No hub ficam largas Trocas, Fundamentos, Mesa e Placar. A tabela rola de lado, mas nada avisa, e em Trocas a coluna escondida é justamente o Placar.

A correção: primeira coluna fixa e sombra de rolagem. Em Trocas, no celular, empilhar em cartões por deck, como já é feito com o radar.

## P3: acabamento

9. **Contraste.**
   - O selo INS fica entre 3,7:1 e 4,2:1 no Humanos (tema claro) e no K'rrik.
   - O selo BAX fica em 4,3:1, o chip de sinergia baixa em 3,8:1, e o link "Pular para o conteúdo" também fica abaixo do mínimo.
   - No hub, os rótulos pequenos das Fichas ficam em 3,98:1. Os neutros da Mesa (3,69:1) são discretos de propósito, mas podem ganhar um pouco de luz.
10. **"0 foils" no herói** (Storm, Deadpool e Braids). Zero não informa nada: esconder quando for 0.
11. **Linha de tipo e ✦ foil com 10,5px na Galeria.** Subir para 12px.
12. **O seletor "Colocar no deck" do radar corta o nome da carta que sai** ("Angelic Skirmisher (B…"). Mostrar o nome inteiro numa segunda linha.

## Falsos positivos (registrados para ninguém perseguir)

- **Tabelão, cerca de 1.900 "sobreposições" do rodapé com as células.** A tabela rola dentro da própria caixa, e as linhas escondidas contam como sobrepostas.
- **Visão geral, "35 fontes de terreno." sobre "32 terrenos e…".** São o negrito e o texto da mesma frase quebrando a linha. As caixas se cruzam, mas não há sobreposição visível.
- **Galeria, 1.844 textos cortados.** São nomes com reticências de propósito sobre a imagem.
- **Hub, estante aberta: Ficha e Online sobre o nome do deck.** Ficam no verso do cartão, com opacidade 0 até o mouse passar.
- **"Buscar deck" e afins.** É texto só para leitor de tela.

## Ferramentas

As ferramentas da auditoria ficaram na sessão do Claude e não estão no projeto:

- `metr.js`: a medição por tela;
- `run.py`: os painéis × abas × larguras;
- `hub.py`: os estados do hub;
- `topo.py`: as abas em 1280, 1360, 1440 e 1600px;
- `clipg.py`: os rótulos do gráfico fora da tela.

Se valer repetir, o caminho é o `testes/layout.py` ganhar os itens 1, 2, 5 e 7 (ver `PROMPT-CODE-LAYOUT.md`).
