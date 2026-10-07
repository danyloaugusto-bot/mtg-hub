# Estado do projeto (handover vivo)

Atualize este arquivo ao fim de cada sessão, com `/fechar`. Ele é a primeira leitura da sessão seguinte, com `/abrir`.

## Onde estamos

- 07/10/2026: pasta criada a partir do kit do Ritos de Sangue. Nada do motor foi generalizado ainda.

## Próxima ação

`/leitura`

## Feito

- Kit do Clavileño em `contexto/origem/ritos-de-sangue-kit/`, com handover próprio.
- Pastas `dados/02. Clavileno`, `dados/01. Giada` e `dados/01. Vito` iniciadas.
- Inventário inicial com os decks que aparecem nos prints do aplicativo.
- Dezenove comandos em `.claude/skills/`, com modelo e esforço declarados.

## Pela metade

- `dados/01. Giada/entrada/` espera o material do painel da Giada.
- `contexto/inventario.csv` tem comandantes em branco e faltam decks do grupo Tribais.

## Decisões e porquês

- Um motor, um artefato por deck, hub gerado. Ver `contexto/ARQUITETURA.md`.
- O nome da pasta do deck (`XX. Nome`) é a identidade dele e carrega o grupo.
- Análises de outras IAs entram por `entrada/` e passam pelo confronto.

## Perguntas em aberto para o dono

- O que "OK" e "nOK" significam nos nomes dos decks no aplicativo?
- Publicação: esta instalação do Claude Code publica artefatos, ou os HTMLs voltam para uma conversa?
