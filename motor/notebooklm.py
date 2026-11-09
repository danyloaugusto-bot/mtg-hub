# -*- coding: utf-8 -*-
"""Dossiê de um deck para o NotebookLM (pedido do dono, 08/11/2026).

    python motor/notebooklm.py --deck "01. Giada"
    python motor/notebooklm.py --todos

Grava, em saidas/notebooklm/, dois arquivos por deck:
- "<pasta>.md": a fonte do caderno (plano, partida, combos, cartas, radar, glossário), em português;
- "<pasta> - instruções.txt": o texto para colar na personalização do resumo em áudio, do vídeo e do infográfico.

Lê só o que o painel já usa (dados.montar e o deck.md); não grava nada nos dados do deck. Sem preço.
"""
import argparse, os, re, sys

sys.stdout.reconfigure(encoding="utf-8")
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import dados  # noqa: E402

RAIZ = os.path.dirname(AQUI)
SAIDA = os.path.join(RAIZ, "saidas", "notebooklm")
TIERS = [("S", "Tier S: as peças que definem o deck"), ("A", "Tier A: fortes e no plano"), ("B", "Tier B: cumprem o papel"),
         ("C", "Tier C: as mais fracas do deck"), ("D", "Tier D: candidatas a sair")]
REL = {"INS": "intocável", "ALT": "alta", "MED": "média", "BAX": "baixa"}
PAPEL = {"habilita": "habilitadora", "recompensa": "recompensa", "multiplica": "multiplicadora"}
RESULTADO = {"forte": "vai bem", "equilibrado": "equilibrado", "fraco": "vai mal"}
VEREDITO = {"entra": "entra", "avaliar": "avaliar", "fora": "fica de fora"}
GLOSSARIO = [
    ("Commander", "formato de Magic com 100 cartas, uma cópia de cada (exceto terrenos básicos), um comandante lendário e quatro jogadores, cada um com 40 de vida."),
    ("Comandante", "a criatura lendária que lidera o deck; fica na zona de comando e pode ser conjurada de novo, pagando 2 a mais a cada vez."),
    ("Identidade de cor", "as cores do comandante; o deck só pode ter cartas dessas cores."),
    ("CMC", "custo de mana convertido: o total de mana impresso na carta. O custo usual é o que a carta costuma custar de verdade neste deck, com desconto ou custo alternativo."),
    ("Ramp", "aceleração de mana: terrenos extras, pedras de mana e redutores de custo."),
    ("Draw", "compra de cartas e vantagem de cartas."),
    ("Remoção", "carta que tira uma ameaça da mesa; remoção em massa (wipe) limpa várias de uma vez."),
    ("Lord", "criatura que dá bônus às outras do mesmo tipo."),
    ("Buff", "bônus de poder e resistência, por marcador +1/+1 ou efeito."),
    ("Tribal", "deck construído em torno de um tipo de criatura."),
    ("Tier", "a força da carta dentro deste deck, de S (define o deck) a D (candidata a sair)."),
    ("Relevância", "o quanto a carta é difícil de trocar: intocável, alta, média ou baixa."),
    ("Habilitadora, recompensa e multiplicadora", "os três papéis do plano: a habilitadora monta o jogo, a recompensa transforma o jogo montado em vantagem, a multiplicadora dobra o que as outras fazem."),
    ("Radar", "as cartas de fora estudadas para este deck, com o veredito: entra, avaliar ou fica de fora."),
]


def ficha(base):
    """Do deck.md: o plano em uma frase e as decisões do dono (parágrafos que começam por **Decisão do dono)."""
    p = os.path.join(base, "deck.md")
    if not os.path.exists(p):
        return "", []
    s = open(p, encoding="utf-8").read()
    m = re.search(r"## O plano em uma frase\s*\n(.*?)(?=\n## |\Z)", s, re.S)
    bloco = m.group(1).strip() if m else ""
    paras = [x.strip() for x in bloco.split("\n\n") if x.strip()]
    plano = next((x for x in paras if not x.startswith("**")), "")
    decisoes = [re.sub(r"^\*\*(.*?):?\*\*:?\s*", r"\1: ", x) for x in paras if x.startswith("**Decisão")]
    return plano, decisoes


def nome(c):
    return c["n"] + (" (no Scryfall: %s)" % c["on"] if c.get("on") and c["on"] != c["n"] else "")


def custo(c):
    if c.get("land"):
        return "terreno"
    t = "custo %s, CMC %d" % (c.get("cost") or "sem custo", c["cmc"])
    if c.get("cu") is not None and c["cu"] < c["cmc"]:
        t += "; costuma custar %d (%s)" % (c["cu"], c.get("cuc") or "")
    return t


def frase(t):
    t = (t or "").strip()
    return t if not t or t[-1] in ".!?…" else t + "."


def num(x):
    return ("%.2f" % x).replace(".", ",")


def dossie(pasta):
    base = dados.pasta_deck(pasta)
    m = dados.montar(pasta, avisar=lambda *a, **k: None)
    tema = dados.ler_json(os.path.join(base, "tema.json"))
    plano, decisoes = ficha(base)
    cards, por_id = m["cards"], {c["id"]: c for c in m["cards"] + m["cands"]}
    cmds = [c for c in cards if c.get("cmd")]
    total = sum(c["q"] for c in cards)
    magias = [c for c in cards if not c.get("land")]
    n_mag = sum(c["q"] for c in magias)
    cmc = sum(c["cmc"] * c["q"] for c in magias) / n_mag if n_mag else 0
    cmc_u = sum((c["cu"] if c.get("cu") is not None and c["cu"] < c["cmc"] else c["cmc"]) * c["q"] for c in magias) / n_mag if n_mag else 0
    n_terr = sum(c["q"] for c in cards if c.get("land"))
    tiers = {t: sum(c["q"] for c in cards if c["tier"] == t and not c.get("cmd")) for t, _ in TIERS}
    nomes_cmd = " e ".join(c["n"] for c in cmds) or tema.get("comandante_curto", pasta)

    L = []
    L.append("# %s: o deck de %s" % (tema.get("painel") or pasta, nomes_cmd))
    L.append("")
    L.append("Dossiê do deck de Commander (Magic: The Gathering) **%s**, do grupo de decks do dono. "
             "Material de estudo: como o deck joga, por que cada carta está nele e o que ainda pode mudar." % (tema.get("comandante_curto") or pasta))
    L.append("")
    L.append("- **Comandante:** %s" % " e ".join("%s (%s)" % (nome(c), c["line"]) for c in cmds))
    L.append("- **Tema:** %s" % frase(tema.get("lede")))
    if tema.get("tema_jogo"):
        L.append("- **Família:** %s (%s)" % (tema["tema_jogo"].get("familia", ""), tema["tema_jogo"].get("nome", "")))
    L.append("- **Números:** %d cartas, %d terrenos, CMC médio %s (pelo custo usual, %s); cópias por tier, terrenos incluídos e fora o comandante: %s." % (
        total, n_terr, num(cmc), num(cmc_u), ", ".join("%d %s" % (v, k) for k, v in tiers.items() if v)))
    L.append("")
    if plano or decisoes:
        L.append("## O plano")
        L.append("")
        if plano:
            L.append(frase(plano))
            L.append("")
        for d in decisoes:
            L.append(frase(d))
            L.append("")
    L.append("## O comandante")
    L.append("")
    for c in cmds:
        L.append("**%s**, %s." % (nome(c), custo(c)))
        L.append("")
        L.append("O que faz: %s" % frase(c["fx"]))
        L.append("")
        L.append("Por que lidera o deck: %s" % frase(c["why"]))
        L.append("")
    for p in (m.get("plano") or {}).get("comandante") or []:
        L.append("Papel no plano: %s. %s" % (PAPEL.get(p.get("papel"), p.get("papel")), frase(p.get("por_que"))))
        L.append("")

    e = m.get("estrategia") or {}
    if e:
        L.append("## Como a partida anda")
        L.append("")
        for k, t in (("inicio", "Início"), ("meio", "Meio"), ("fim", "Fim")):
            f = e.get(k)
            if not f:
                continue
            L.append("### %s (turnos %s)" % (t, f.get("turnos", "")))
            L.append("")
            L.append(frase(f.get("plano")))
            L.append("")
            if f.get("fortes"):
                L.append("Pontos fortes:")
                L.extend("- " + frase(x) for x in f["fortes"])
                L.append("")
            if f.get("fracos"):
                L.append("Pontos fracos:")
                L.extend("- " + frase(x) for x in f["fracos"])
                L.append("")
        if e.get("contra"):
            L.append("### Contra quem")
            L.append("")
            for x in e["contra"]:
                L.append("- **Contra %s:** %s. %s" % (x.get("tipo"), RESULTADO.get(x.get("resultado"), x.get("resultado")), frase(x.get("porque"))))
            L.append("")
        ms = e.get("mesa")
        if ms:
            # nome impresso, quando a carta tem um (as chaves do bloco são os nomes do Scryfall)
            imp = {c.get("on") or c["n"]: c["n"] for c in cards + m["cands"]}
            L.append("### Na mesa: avaliação de ameaças")
            L.append("")
            L.append("Como este deck é lido pelos outros jogadores e como o dono joga a política da mesa (material de threat assessment, 08/11/2026).")
            L.append("")
            L.append("Como a mesa te lê: %s" % frase(ms["leitura"]))
            L.append("")
            L.append("Postura: %s" % frase(ms["postura"]))
            L.append("")
            if ms.get("sinais"):
                L.append("Sinais, as cartas que te marcam como a ameaça quando descem:")
                L.extend("- **%s**: %s" % (imp.get(x["carta"], x["carta"]), frase(x["porque"])) for x in ms["sinais"])
                L.append("")
            if ms.get("guardar"):
                L.append("O que fica na mão até a hora certa:")
                L.extend("- **%s**: %s" % (imp.get(x["carta"], x["carta"]), frase(x["porque"])) for x in ms["guardar"])
                L.append("")
            L.append("Ponto de falha, o que um oponente precisa tirar para te parar: %s" % frase(ms["ponto_de_falha"]))
            L.append("")
            if ms.get("respostas"):
                L.append("Respostas a guardar, e para quê:")
                L.extend("- **%s**: %s" % (imp.get(x["carta"], x["carta"]), frase(x["para"])) for x in ms["respostas"])
                L.append("")
            L.append("As suas limpezas: %s" % frase(ms["limpezas"]))
            L.append("")
            if ms.get("alvo"):
                L.append("Quem atacar: %s" % frase(ms["alvo"]))
                L.append("")

    if m.get("combos"):
        L.append("## Combos e linhas de jogo")
        L.append("")
        for x in m["combos"]:
            pecas = [por_id[i]["n"] for i in x.get("p") or [] if i in por_id]
            L.append("### %s (%s)" % (x["n"], x.get("kind", "").lower() or "linha"))
            L.append("")
            if pecas:
                L.append("Peças: %s." % " + ".join(pecas))
                L.append("")
            L.append(frase(x.get("t")))
            L.append("")

    L.append("## As cartas, por força no deck")
    L.append("")
    L.append("Cada carta com o que faz e por que está aqui. O tier mede a força dentro deste deck; a relevância, o quanto ela é difícil de trocar.")
    L.append("")
    resto = [c for c in cards if not c.get("cmd") and not c.get("land")]
    for t, titulo in TIERS:
        grupo = sorted([c for c in resto if c["tier"] == t], key=lambda c: c["n"])
        if not grupo:
            continue
        L.append("### %s (%d)" % (titulo, len(grupo)))
        L.append("")
        for c in grupo:
            extra = ["relevância %s" % REL.get(c["rel"], c["rel"])]
            if c.get("pp"):
                extra.append("papel: %s" % PAPEL.get(c["pp"], c["pp"]) + (" e %s" % c["ppd"].lower() if c.get("ppd") else ""))
            L.append("**%s** (%s; %s; %s)" % (nome(c), c["line"], custo(c), "; ".join(extra)))
            L.append("")
            L.append("O que faz: %s Por que está no deck: %s" % (frase(c["fx"]), frase(c["why"])))
            L.append("")
    terr = sorted([c for c in cards if c.get("land") and not c.get("cmd")], key=lambda c: (-c["q"], c["n"]))
    if terr:
        L.append("### Terrenos (%d)" % n_terr)
        L.append("")
        for c in terr:
            L.append("- **%s**%s (tier %s): %s" % (nome(c), " ×%d" % c["q"] if c["q"] > 1 else "", c["tier"], frase(c["why"] or c["fx"])))
        L.append("")

    radar = [c for c in m["cands"] if c.get("verdict") in ("entra", "avaliar") and not c.get("inDeck")]
    if radar:
        L.append("## O radar: o que pode mudar")
        L.append("")
        L.append("Cartas de fora estudadas para este deck. \"Entra\" é troca recomendada; \"avaliar\" pede teste na mesa.")
        L.append("")
        for v in ("entra", "avaliar"):
            for c in sorted([c for c in radar if c["verdict"] == v], key=lambda c: c["n"]):
                sai = por_id.get(c.get("sai"))
                L.append("- **%s** (%s, tier %s): %s%s %s" % (nome(c), VEREDITO[v], c["tier"], frase(c["fx"]),
                         " Sairia: %s." % sai["n"] if sai else "", frase(c["why"])))
        L.append("")

    L.append("## Glossário")
    L.append("")
    L.extend("- **%s:** %s" % g for g in GLOSSARIO)
    L.append("")
    return "\n".join(L), tema, nomes_cmd


def instrucoes(pasta, tema, nomes_cmd):
    curto = tema.get("comandante_curto") or pasta
    return (
        "Instruções para o NotebookLM, deck %s (%s)\n"
        "Cole cada bloco no campo de personalização da ferramenta correspondente. Idioma de saída: português (Brasil).\n\n"
        "== Resumo em áudio (podcast) ==\n"
        "Fale em português do Brasil, para um jogador experiente de Commander que é o dono deste deck. Use os termos do jogo como "
        "ele usa (lord, buff, ramp, draw, wipe, tier), sem traduzir. Comece pelo plano do deck e pelo que o comandante %s faz; "
        "depois conte como a partida anda no início, no meio e no fim, os combos, as cartas tier S, e termine com o radar: o que "
        "pode entrar e o que sairia. Respeite as decisões do dono registradas no dossiê; não sugira mudar o que ele já decidiu. "
        "Não fale de preço. Não invente texto de carta: use só o que está no dossiê.\n\n"
        "== Resumo em vídeo ==\n"
        "Português do Brasil. Um vídeo de 5 a 8 minutos que explique o deck %s para quem vai jogar com ele: o plano em uma frase, "
        "o comandante, as três fases da partida, os combos e as cinco cartas mais importantes. Sem preço.\n\n"
        "== Infográfico ==\n"
        "Português do Brasil. Uma página com: o plano do deck em uma frase, o comandante, as três fases da partida (turnos e "
        "objetivo de cada uma), os combos principais com as peças, as cartas tier S e contra quem o deck vai bem e vai mal. "
        "Sem preço.\n\n"
        "== Chat do notebook (configurar) ==\n"
        "Você é um analista de Commander (Magic: The Gathering) que conhece este deck pelo dossiê. Responda em português do "
        "Brasil, direto e curto, para o dono do deck, que é um jogador experiente. Use os termos do jogo como ele usa (lord, "
        "buff, ramp, draw, wipe, tier). Baseie tudo no dossiê: não invente texto de carta nem cite carta que não esteja nele. "
        "Respeite as decisões do dono registradas no dossiê e não sugira desfazê-las. Não fale de preço. Quando sugerir uma "
        "troca, diga o que entra, o que sai e por quê.\n\n"
        "== Roteiro de perguntas (cole uma por vez no chat) ==\n"
        "1. Resuma o plano do deck %s em três frases e diga em que fase da partida ele vence.\n"
        "2. Quais cartas fazem a mesa me ver como a ameaça quando descem, e qual postura o dossiê recomenda quando isso acontece?\n"
        "3. O que um oponente precisa tirar da mesa para me parar? Como protejo isso sem gastar recurso à toa?\n"
        "4. Que cartas devo segurar na mão até a hora certa, e qual é a hora certa de cada uma?\n"
        "5. Para que servem as minhas remoções guardadas: em que alvo gasto cada uma, e em qual não gasto?\n"
        "6. Quando as minhas limpezas de mesa me favorecem e quando me prejudicam?\n"
        "7. Quem eu ataco em cada fase: o jogador com menos vida ou o que tem mais recursos? Justifique pelo dossiê.\n"
        "8. Contra que arquétipos o deck vai mal e o que fazer nessas partidas?\n"
        "9. Das trocas do radar, quais mais aumentam a força do deck e quais são só tema?\n"
        "10. Monte um checklist de turno para este deck: três perguntas antes de atacar e três antes de gastar uma remoção.\n\n"
        "== Comparativo antes x depois (quando o notebook tiver duas versões do dossiê como fontes) ==\n"
        "Mantenha as duas versões como fontes separadas, com a data no nome (por exemplo \"v1, 08/11\" e \"v2, 09/11\"), e cole no "
        "campo de personalização:\n"
        "- Infográfico: Português do Brasil. Uma página em duas colunas, \"antes\" e \"depois\", comparando as duas versões do "
        "dossiê do deck %s: o que mudou no plano e nas três fases da partida, quais cartas entraram ou saíram do radar e quem "
        "sai no lugar, o que mudou nos terrenos, o que mudou nas limpezas e na postura na mesa, e o que ficou igual. Destaque "
        "cada diferença com a data da versão. Sem preço.\n"
        "- Resumo em áudio: Fale em português do Brasil, para o dono do deck, jogador experiente de Commander, com os termos do "
        "jogo como ele usa. Compare a versão antiga e a nova do dossiê do deck %s: comece pelo que mudou no plano e na postura "
        "na mesa, depois as trocas do radar (o que entra, o que sai e por quê), os terrenos, as limpezas, e termine com o que "
        "não mudou e por quê. Cite sempre de qual versão vem cada informação. Não invente carta nem texto de carta; não fale de preço.\n"
        % (curto, nomes_cmd, curto, curto, curto, curto, curto))


def gravar(pasta):
    md, tema, nomes_cmd = dossie(pasta)
    os.makedirs(SAIDA, exist_ok=True)
    a = os.path.join(SAIDA, pasta + ".md")
    b = os.path.join(SAIDA, pasta + " - instruções.txt")
    open(a, "w", encoding="utf-8", newline="\n").write(md)
    open(b, "w", encoding="utf-8", newline="\n").write(instrucoes(pasta, tema, nomes_cmd))
    print("%s: %s (%d KB) e instruções" % (pasta, os.path.relpath(a, RAIZ), len(md.encode("utf-8")) // 1024))


def main():
    ap = argparse.ArgumentParser(description="Dossiê do deck para o NotebookLM")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--deck")
    g.add_argument("--todos", action="store_true")
    a = ap.parse_args()
    for p in (dados.pastas_decks() if a.todos else [a.deck]):
        gravar(p)


if __name__ == "__main__":
    main()
