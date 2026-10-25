# CICLOS — aba de ciclos de coleção do MTG Hub

> **Integrado em 24/10/2026.** A lista que o motor lê é `dados/ciclos/ciclos.json` (edite essa; a cópia aqui é o registro do pedido). O `ciclos.js` não é mais necessário: o build embute o dado na página (`python motor/build.py --ciclos`). A identidade dos decks vem do próprio motor. O que mudou em relação ao desenho abaixo está em `contexto/ARQUITETURA.md`, seção "Os Ciclos": a identidade do Scryfall decide o encaixe (a coluna `cores` é a vaga no ciclo), o grau no vácuo e o "onde rende" entram pelo cadastro v3, e o comando é `/ciclos`.

## O que é
Aba de consulta ao lado de Dashboard, Grimório e Consulta. Lista as cartas que saem em ciclos (grupos de cartas com função ou nome parecido, uma por cor) em cada coleção, para responder duas perguntas:
1. Onde e quando cada carta foi lançada (ano, coleção, raridade).
2. Em quais decks do hub ela é legal e faz sentido.

## Arquivos desta pasta
| Arquivo | Uso |
|---|---|
| `ciclos.json` | Fonte da verdade. Editar só este. |
| `ciclos.js` | Mesmo conteúdo como `window.CICLOS = {...}`. É o que o HTML carrega, porque página aberta por `file://` não consegue dar `fetch` em JSON local. Regenerar sempre que o JSON mudar. |
| `ciclos.csv` | Cópia para abrir no Excel (separador `;`). |
| `PROMPT-CODE-CICLOS.md` | Prompt para o Claude Code construir a aba. |

## Campos de cada carta
`ano`, `lancamento` (AAAA-MM), `colecao`, `codigo`, `ciclo`, `tipo_ciclo` (Mono, Bicolor, Tricolor, Identidade, Incolor, Sabor, Indefinido), `carta`, `cores` (letras WUBRG em ordem), `cores_nome`, `qtd_cores`, `raridade` (C/U/R/M ou ?), `raridade_nome`, `observacao`, `verificar` (SIM/NÃO).

## Cobertura
34 coleções de 2021 (Kaldheim) a 2026 (Reality Fracture), 153 ciclos, 801 cartas.

## Regra de encaixe nos decks
Uma carta cabe num deck quando todas as letras de `cores` estão dentro da identidade de cor do comandante. Carta incolor (`cores` vazio, `tipo_ciclo` Incolor) cabe em qualquer deck. Carta com `cores` igual a `?` não entra em nenhum cálculo até ser verificada.

Exemplos: `BG` cabe na Lathril (BG) mas não no Wilhelt (UB). `W` cabe na Giada, Greymond, Kaalia, Marchesa, Zur e TMNT.

"Cabe" é só legalidade. O quanto a carta é boa no deck continua sendo trabalho da Consulta (10 critérios, tier, 8x8). A aba CICLOS mostra o link para mandar a carta para a Consulta.

## Pendências
94 linhas com `verificar = SIM`: raridades ou cores que não consegui confirmar na pesquisa. Conferir no Scryfall e trocar para NÃO.

## Atualização
A cada coleção nova (mesma cadência do Grimório, 2 a 3 meses): pesquisar os ciclos do set (mtg.wiki, seção Cycles), acrescentar as linhas no `ciclos.json`, regenerar `ciclos.js` e `ciclos.csv`.
