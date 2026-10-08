# Motor

Monta o painel de qualquer deck a partir de `dados/<pasta>/`. Nasceu na etapa 1, do kit do Ritos de Sangue, e soma as peças do Coro da Alvorada.

```
python motor/build.py --deck "02. Clavileno"     # um deck
python motor/build.py --todos                    # todos os que têm avaliacao.json
python motor/build.py --deck "02. Clavileno" --atualizar-scryfall
```

Saída: `saidas/<pasta>.html` e `dados/<pasta>/Abrir o painel.html`. Precisa de Pillow e, na primeira vez de cada carta, de internet para o Scryfall.

Onde mexer:

- Contrato dos dados de um deck: `contexto/ARQUITETURA.md`.
- Leitura e validação dos dados: `dados.py`. Tipos em português: dicionário `SUB`.
- Paleta, texturas, fontes, capa e cores das cartas: `tema.py`.
- O painel: `painel/app.js`, `painel/style.css`, `painel/template.html`. Nada ali fala de um deck em particular.
- Fonte nova: `fontes/<família>/<família>-latin-<peso>-<estilo>.woff2`, licença aberta.

Testes: `python testes/todos.py --deck "<pasta>"`.
