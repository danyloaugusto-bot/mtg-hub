---
name: leitura
description: "Etapa 0. Leitura inicial do projeto, sem alterar nada."
model: sonnet
effort: high
disable-model-invocation: true
---

Você vai assumir um projeto em andamento. Antes de escrever qualquer código:

1. Leia, nesta ordem: `CLAUDE.md`, `contexto/ARQUITETURA.md`, `contexto/AVALIACAO.md`, `contexto/PARIDADE.md`, `contexto/ESTADO.md`, `contexto/origem/ritos-de-sangue-kit/HANDOVER.md` e `contexto/inventario.csv`. Veja os prints em `contexto/referencias/app/` e abra o segundo painel que já existe, `dados/01. Giada/entrada/coro-da-alvorada.html`.
2. Entre em `contexto/origem/ritos-de-sangue-kit/`, rode `python build.py` (no Windows o comando é `python`) e confirme que o `dist/ritos-de-sangue.html` é reproduzido. Rode os scripts de `tests/` se o Playwright estiver instalado; se não estiver, diga exatamente o que falta instalar.
3. Abra `app.js` e liste tudo o que hoje está fixo no código e é específico do Clavileño: agrupamentos, cores, textos, limiares de diagnóstico, nome do painel, combos, rodapé.

Devolva, em português:

- O que você entendeu do projeto, em até dez linhas.
- A lista do item 3, com arquivo e trecho.
- Os riscos que você vê no plano de `contexto/ARQUITETURA.md` e o que faria diferente.
- As perguntas que precisam de resposta minha antes da etapa 1.

## Sobras da estrutura antiga

Se existirem na raiz as pastas `decks/`, `docs/`, `origem/`, `prompts/` ou `dist/`, ou um `inventario.csv` solto, elas vieram de uma versão anterior deste projeto. A estrutura que vale é a descrita no `CLAUDE.md`: `contexto/`, `.claude/skills/`, `dados/` e `saidas/`. Compare: liste o que existe nas sobras e não existe na estrutura nova, e me pergunte antes de apagar qualquer coisa.

## Conferência do ambiente

- Se não existir `.gitignore` na raiz, crie com estas linhas: `cache/`, `__pycache__/`, `*.pyc`, `.DS_Store`. Sem ele, o cache de imagens entraria no Git.
- Se o Git ainda não foi iniciado na pasta, diga os comandos e espere eu rodar.
- Se faltar algum arquivo que o `CLAUDE.md` cita (por exemplo `contexto/modelo-de-skill.md` ou `contexto/PARIDADE.md`), avise: é sinal de que falta aplicar uma atualização.

Fora a limpeza das sobras, que só acontece depois do meu ok, e a criação do `.gitignore`, não crie nem edite arquivos nesta etapa.
