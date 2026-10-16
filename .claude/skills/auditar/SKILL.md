---
name: auditar
description: "Relê a avaliação de um deck com olhar de auditor, sem alterar nada."
argument-hint: "<pasta do deck>"
model: opus
effort: high
disable-model-invocation: true
---

Deck: $ARGUMENTS

Releia a avaliação com olhar de auditor. Aponte as dez notas mais discutíveis, as cartas BAX que você defenderia e as INS que você cortaria, sempre com o texto da carta à mão. Não altere nada: quero a discussão.

A pontuação é a v3 (`contexto/pontuacao/RUBRICA.md`, com as regras do dono no fim dela): dez critérios iguais para todos os decks. Os oito critérios da carta (Resiliência, Recurso, Draw, Amplificador, Remoção, Evasão, Dano Direto, Aceleradores) ficam no cadastro único `dados/cartas.json`, uma vez por carta, valendo em todo deck; as duas sinergias (`sin1`, `sin2`) são do deck, escritas no `tema.json` e aprovadas pelo dono. O 8×8 (agrupamentos e `notas`) continua como está, à parte.

Inclua na discussão, pela `contexto/pontuacao/RUBRICA.md`: as notas do cadastro único das cartas deste deck que destoam da régua ou de cartas parecidas no cadastro (um efeito, um critério; faz duas vezes; as regras do dono no fim da RUBRICA); as notas de sinergia (`sin1`, `sin2`) que não seguem a regra escrita no `tema.json`; e se as sinergias ainda descrevem o plano do deck. Diga também o que o texto oficial desmente nos textos `faz` e `porque`.
