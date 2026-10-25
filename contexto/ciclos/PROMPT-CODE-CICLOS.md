# Prompt para o Claude Code — aba CICLOS

Cole o texto abaixo no Claude Code, aberto em `C:\Projetos\mtg-hub`.

---

Leia `contexto/ciclos/CICLOS.md` antes de tudo. Depois:

1. **Dados.** Copie `contexto/ciclos/ciclos.json` e `ciclos.js` para a pasta de dados compartilhados do hub (onde ficarem os dados do Grimório; se não houver padrão, use `dados/_compartilhado/ciclos/`). Não altere o conteúdo.

2. **Identidade dos decks.** Para cada pasta em `dados/` no formato `XX. Nome`, descubra a identidade de cor do comandante (pelo painel, handover ou lista do deck) e grave num arquivo único `dados/_compartilhado/decks-identidade.json` com: pasta, nome do painel, comandante, identidade (letras WUBRG), grupo (01 a 05). Se não achar a identidade de algum deck, liste para mim no final em vez de chutar.

3. **Aba CICLOS.** Crie a aba ao lado de Dashboard, Grimório e Consulta, seguindo o layout e a navegação que já existem no hub. Ela deve funcionar offline, abrindo por `file://`, carregando os dados via `<script src="...ciclos.js">`.
   - Tabela clicável e ordenável por qualquer coluna (mesmo padrão da Caixa).
   - Filtros: ano, coleção, ciclo, cores (botões WUBRG que dá para combinar), raridade, tipo de ciclo e "só pendentes" (`verificar = SIM`).
   - Agrupamento opcional por coleção, mostrando cada ciclo como uma linha com as cartas nas colunas W U B R G.
   - Coluna "Cabe em": decks em que a carta é legal pela regra de identidade do CICLOS.md. Seletor de deck no topo que filtra a tabela só para as cartas legais naquele deck.
   - Cada carta com link para o Scryfall (`https://scryfall.com/search?q=!"<nome>"`) e um botão "Consultar" que leva a carta para a aba Consulta.
   - Linhas com `verificar = SIM` com um selo discreto de pendente.

4. **Imagens (opcional).** Se a skill de download de imagens já existe, use para baixar as imagens dessas cartas para uso offline na galeria. Se não, deixe só os links.

5. **Atualização.** Crie a skill `/ciclos-atualizar`: recebe o nome de uma coleção nova, pesquisa os ciclos dela, acrescenta no `ciclos.json`, regenera `ciclos.js` e `ciclos.csv`, e me mostra o que entrou antes de gravar.

Use modelo e esforço adequados: a montagem da tabela e dos filtros não precisa de esforço máximo. No final me mostre o caminho da aba e a lista de decks sem identidade encontrada, se houver.
