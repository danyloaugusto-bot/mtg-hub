# Modelo de skill

Para criar um comando novo: crie a pasta `.claude/skills/<nome>/`, salve dentro dela um arquivo `SKILL.md` com o conteúdo abaixo, e ajuste. O nome da pasta e o `name:` têm de ser iguais, em minúsculas, com hífen no lugar de espaço.

As três linhas de traço do cabeçalho são três hifens comuns (`---`), não um travessão. Se o editor trocar por travessão, o comando não aparece.

```
---
name: nome-da-skill
description: "O que faz, em uma frase. É o que aparece na lista quando você digita a barra."
argument-hint: "<o que vem depois do nome, se houver>"
model: sonnet
effort: medium
disable-model-invocation: true
---

# /nome-da-skill

Alvo: $ARGUMENTS

# Arquivos

- Lê: quais arquivos e pastas consultar.
- Grava: o que pode criar ou alterar. O que não está aqui, não toca.

# Passos

1. Primeiro passo.
2. Segundo passo.
3. Onde parar e esperar minha resposta, se houver.

# Regras

- O que não fazer.
- Texto de carta nunca de memória.

# Pronto quando

- O teste que eu mesmo consigo ver.
```

## O que cada linha do cabeçalho faz

- `name`: o nome que você digita depois da barra.
- `description`: a frase da lista. Entre aspas, para não quebrar se tiver dois-pontos.
- `argument-hint`: a dica do que escrever depois do nome. Opcional.
- `model` e `effort`: com que modelo e esforço o comando roda. A lógica está em `contexto/MODELOS.md`. Opcionais: sem eles, vale o que estiver na sessão.
- `disable-model-invocation: true`: o comando só roda quando você chama. Sem essa linha, o Claude Code pode acioná-lo por conta própria quando achar que o assunto combina.
- `$ARGUMENTS`: é trocado pelo que você escreveu depois do nome. Em `/novo-deck 03. Valgavoth`, vira `03. Valgavoth`.

## O jeito mais fácil

Peça ao próprio Claude Code: "Crie uma skill chamada <nome> que faça <o quê>, seguindo contexto/modelo-de-skill.md". Depois leia o arquivo que ele criou antes de usar.
