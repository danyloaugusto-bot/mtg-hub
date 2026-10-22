# -*- coding: utf-8 -*-
"""Pré-nota automática dos oito critérios da carta (pontuação v3), a partir do texto oficial no cache do Scryfall.

    python motor/prenota.py --deck "01. Giada"          grava em dados/cartas.json e mostra as 20 de menor certeza
    python motor/prenota.py --deck "01. Giada" --ver    só mostra, sem gravar

Serve para o Claude revisar mais rápido, não para valer sozinha (contexto/pontuacao/RUBRICA.md e DADOS.md, seção 1).
Grava fonte "auto" e nunca sobrescreve uma carta com fonte "claude" ou "dono". As regras de "faz duas vezes" e de
"um efeito, um critério" ficam para a revisão. As notas antigas do deck (agrupamentos do método anterior) entram só
como segundo sinal: quando discordam do texto, a certeza cai.
"""
import argparse, datetime, io, json, os, re, sys

sys.dont_write_bytecode = True
MOTOR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, MOTOR)
import dados, scryfall  # noqa: E402

CADASTRO = os.path.join(dados.DADOS, "cartas.json")
CRITERIOS = ("resiliencia", "recurso", "draw", "amplificador", "remocao", "evasao", "dano", "aceleradores")
NOME_PT = {"resiliencia": "resiliência", "recurso": "recurso", "draw": "draw", "amplificador": "amplificador",
           "remocao": "remoção", "evasao": "evasão", "dano": "dano direto", "aceleradores": "aceleradores"}
# agrupamentos do método antigo que dão um sinal para o critério novo (DADOS.md); o resto (sinergia, eixos) não entra
ANTIGO = {"ramp": "aceleradores", "ramp2": "aceleradores", "mana": "aceleradores",
          "draw": "draw", "compra": "draw", "combustivel": "draw",
          "removal": "remocao", "remocao": "remocao", "interacao": "remocao", "encanto": "remocao", "limpeza": "remocao", "global": "remocao",
          "counter": "resiliencia", "protecao": "resiliencia", "blindagem": "resiliencia", "defesa": "resiliencia",
          "tokens": "recurso", "token": "recurso", "fichas": "recurso", "recursao": "recurso", "tutor": "recurso",
          "buff": "amplificador", "prolif": "amplificador", "marcadores": "amplificador",
          "evasao": "evasao", "dano": "dano", "drain": "dano"}
TIPOS = ("angel", "zombie", "vampire", "elf", "goblin", "dragon", "human", "wolf", "werewolf", "sliver", "wizard", "knight",
         "demon", "assassin", "pirate", "equipment", "aura", "dinosaur", "merfolk", "spirit", "soldier", "warrior", "cleric", "rogue")
EVASIVAS = ("flying", "trample", "menace", "deathtouch", "shadow", "skulk", "fear", "intimidate", "horsemanship")
NUM = r"(?:a|an|one|two|three|four|five|six|seven|x|that many|\d+)"
REPETE = r"(?:at the beginning of|whenever|each of your turns|each turn)"
DONO = r"owner(?:'s|s'|'|s)?"


def _frases(t):
    return [f.strip() for f in re.split(r"(?<=[.!?])\s+|\n", t) if f.strip()]


def _palavras_chave(t):
    """Palavras-chave da própria carta: linhas feitas só de palavras-chave separadas por vírgula."""
    ks = set()
    for linha in t.split("\n"):
        partes = [p.strip() for p in re.split(r"[,;]", linha.lower()) if p.strip()]
        if partes and all(re.fullmatch(r"[a-z ]+?(?: \d+| \{[^}]+\})?", p) and len(p) < 30 for p in partes):
            ks.update(partes)
    return ks


def _analisa(texto, tipo, nome, nota):
    """Aplica as regras de partida a uma face. `nota(criterio, valor, porque)` registra o sinal; devolve o texto lido."""
    limpo = re.sub(r"\([^)]*\)", "", texto)          # sem o texto explicativo entre parênteses
    t = limpo.lower().replace(nome.lower(), "~").replace(nome.split(",")[0].lower(), "~")
    terreno = "land" in tipo and "creature" not in tipo
    frases = _frases(t)
    kws = _palavras_chave(limpo)

    # aceleradores: mana extra, busca de terreno, redutor de custo de mágica
    for f in frases:
        m = re.search(r"\badd ((?:\{[^}]+\})+)", f)
        quantidade = re.search(r"\badd (?:an amount of|x|two|three) mana|mana equal to|\badd [^.]*for each", f)
        if m or quantidade:
            simbolos = len(re.findall(r"\{[^}]+\}", m.group(1))) if m else 1
            mais = simbolos >= 2 or bool(quantidade)
            if terreno:
                if mais:
                    nota("aceleradores", 2, "terreno que gera mais de uma mana")
            else:
                nota("aceleradores", 3 if mais else 2, "gera %s" % ("duas ou mais manas" if mais else "mana"))
        elif re.search(r"\badd one mana\b", f) and not terreno:
            nota("aceleradores", 2, "gera mana")
        if re.search(r"search your library for (?:up to (?:one|two|three) )?(?:a |an |two )?(?:basic )?(?:land|plains|island|swamp|mountain|forest)", f):
            if terreno and "sacrifice" in f and "up to two" not in f:
                continue   # fetch: troca um terreno por outro
            na_mao = "into your hand" in f and "onto the battlefield" not in f
            lento = re.search(r"\{[2-9]\}, \{t\}, sacrifice", f) or re.search(r"\{[2-9]\}, sacrifice", f)
            nota("aceleradores", 1 if (lento or na_mao) else 2, "busca terreno" + (" para a mão" if na_mao else ", lenta" if lento else ""))
        if re.search(r"put (?:a|up to one|an additional) (?:basic )?land card from your hand onto the battlefield", f):
            nota("aceleradores", 1 if terreno else 2, "põe terreno a mais")
        if re.search(r"spells?[^.]*costs? (?:\{\d+\}|\{x\}|\d+) less", f) or re.search(r"costs? (?:\{\d+\}|\{x\}) less to cast", f):
            nota("aceleradores", 2, "reduz custo de mágica")

    # draw
    for f in frases:
        m = re.search(r"\bdraws? (" + NUM + r") (?:additional )?cards?\b", f) or re.search(r"\bdraws? (cards equal to)", f)
        if m and re.search(r"(?:opponent|player) draws? ", f[:m.end()]) and "you draw" not in f and "you may draw" not in f:
            m = None   # quem compra é o oponente (Smothering Tithe)
        if re.search(r"becomes? the monarch", f):
            nota("draw", 2, "vira o monarca (compra todo turno)")
        if m:
            v = 1 if m.group(1) in ("a", "an", "one") else 2
            if re.search(REPETE, f):
                v = 3
            nota("draw", v, "compra%s" % (" sempre que algo acontece" if v == 3 else (" duas ou mais" if v == 2 else " uma")))
        elif re.search(r"(?:put|reveal) [^.]*(?:into|in) your hand", f) and re.search(r"top (?:\w+ )?cards? of your library|from among them", f):
            nota("draw", 2 if re.search(REPETE, f) else 1, "põe carta do topo na mão")

    # remoção
    alvo = (r"(?:(?:up to (?:one|two|three) )?(?:other )?target (?:nonland |non-[a-z]+ |attacking |blocking |tapped |untapped )?(?:[a-z]+ )?"
            r"(?:creature|artifact|enchantment|planeswalker|permanent|battle)s?(?:,? (?:and/)?or (?:[a-z]+ )?(?:creature|artifact|enchantment|planeswalker|permanent)s?)?)")
    for f in frases:
        massa = (re.search(r"(?:destroy|exile) (?:all|each)\b", f) or re.search(r"\ball (?:other )?creatures get -", f)
                 or re.search(r"deals? \d+ damage to each creature", f) or re.search(r"sacrifices? all", f))
        if massa and "you control" not in f[massa.end():massa.end() + 40]:
            nota("remocao", 3, "remove em massa")
            continue
        m = re.search(r"\b(destroy|exile) (" + alvo + r")", f)
        if m and not re.search(r"\b(?:destroy|exile) " + alvo + r" you (?:control|own)", f):
            nota("remocao", 2, "%s alvo" % ("destrói" if m.group(1) == "destroy" else "exila"))
        elif re.search(r"return (?:target|up to one target) (?:nonland )?(?:creature|permanent|artifact|enchantment)[^.]*to its " + DONO + r" hand", f):
            nota("remocao", 2, "devolve para a mão")
        elif re.search(r"target creature (?:an opponent controls )?gets -\d+/-\d+", f) or re.search(r"deals? (?:\d+|x) damage to (?:any target|target [^.]*?creature)", f):
            nota("remocao", 2, "dano ou -X/-X em criatura")
        elif re.search(r"(?:each opponent|target player|each player) sacrifices? an? (?:creature|attacking)", f):
            nota("remocao", 2, "obriga a sacrificar")
        elif re.search(r"enchanted (?:creature|permanent) (?:can't attack|loses all|is an?|doesn't untap)", f):
            nota("remocao", 2, "neutraliza")
        elif re.search(r"\bfights?\b", f) or re.search(r"damage equal to its power to (?:target|another target) creature", f):
            nota("remocao", 1, "luta")

    # dar habilidades ao time inteiro
    for f in frases:
        m = re.search(r"(?:other )?(?:creatures|[a-z]+s) you control (?:gain|have) ([^.]*)", f)
        if not m:
            continue
        hab = m.group(1)
        if re.search(r"flying|trample|menace|shadow|can't be blocked", hab):
            nota("evasao", 3, "evasão para o time")
        if "double strike" in hab:
            nota("amplificador", 3, "golpe duplo para o time")
        elif re.search(r"first strike|that ability", hab):
            nota("amplificador", 2, "habilidade de combate para o time")
        if re.search(r"hexproof|indestructible|protection|shroud", hab):
            nota("resiliencia", 3, "protege o time")
        elif re.search(r"lifelink|vigilance", hab):
            nota("resiliencia", 2, "vínculo ou vigilância para o time")

    # resiliência
    for f in frases:
        if "you and permanents you control" in f or ("phase out" in f and "you control" in f) or "you can't lose the game" in f:
            nota("resiliencia", 3, "protege tudo")
        elif re.search(r"counter target (?:spell|noncreature spell|creature spell|activated|instant)", f):
            nota("resiliencia", 2, "anula")
        elif re.search(r"(?:equipped|enchanted) creature (?:has|gets [^.]*and has|gains) (?:hexproof|shroud|indestructible|protection)", f) and "loses all" not in f:
            nota("resiliencia", 2, "dá resistência a mágica a uma criatura")
        elif re.search(REPETE + r"[^.]*(?:you )?gain (?:\d+|x|that much) life", f):
            nota("resiliencia", 2, "ganho de vida repetível")
        elif re.search(r"can't be countered", f):
            nota("resiliencia", 1, "não pode ser anulada")
        elif (re.search(r"\b(?:gains?|have|has) (?:hexproof|indestructible|shroud)\b", f) or "protection from" in f) and "enchanted" not in f:
            nota("resiliencia", 1, "proteção")
        elif re.search(r"\bgains? (?:\d+|x) life", f):
            nota("resiliencia", 1, "ganha vida")
    for k, porque in (("lifelink", "vínculo com a vida"), ("vigilance", "vigilância"), ("hexproof", "resistência a mágica"), ("indestructible", "indestrutível")):
        if k in kws:
            nota("resiliencia", 1, porque)
    if any(k.startswith("ward") for k in kws):
        nota("resiliencia", 1, "guarda")

    # recurso: fichas, filtrar, recursão, tutor de não-terreno
    for f in frases:
        if re.search(r"\bcreates? [^.]*treasure tokens?\b", f):
            rep = bool(re.search(REPETE, f))
            nota("aceleradores", 3 if rep else 2, "cria Tesouro" + (" a cada gatilho" if rep else ""))
        elif re.search(r"\bcreates? [^.]*tokens?\b", f):
            muitas = re.search(r"\bcreates? (?:two|three|four|five|x|that many|a number of)\b", f) or "for each" in f
            v = 3 if re.search(REPETE, f) else (2 if muitas else 1)
            nota("recurso", v, "cria fichas" + (" a cada gatilho" if v == 3 else (" várias" if v == 2 else "")))
        if re.search(r"\b(?:scry|surveil) \d+", f) or (re.search(r"look at the top", f) and "into your hand" not in f):
            nota("recurso", 1, "filtra")
        if re.search(r"return (?:all|each) [^.]*cards? from (?:your|their|all) graveyards?", f) or "from all graveyards onto the battlefield" in f:
            nota("recurso", 3, "recursão em massa")
        elif (re.search(r"return [^.]*cards? from your graveyard to (?:the battlefield|your hand)", f) or re.search(r"put [^.]*from your graveyard onto the battlefield", f)
              or re.search(r"(?:play|cast) [^.]*from your graveyard", f)):
            rep = bool(re.search(REPETE, f))
            nota("recurso", 3 if rep else 2, "recursão" + (" repetível" if rep else ""))
        m = re.search(r"search your library for (?:a|an|up to one) ([a-z ,/-]+?)(?: cards?)?(?:,| with| and| that|\.)", f)
        if m and not re.search(r"\b(?:land|plains|island|swamp|mountain|forest)\b", m.group(1)):
            qualquer = m.group(1).strip() == "card"
            nota("recurso", 3 if qualquer else 2, "busca qualquer carta" if qualquer else "tutor")

    # amplificador
    for f in frases:
        if re.search(r"twice that many|double (?:the|its|their)|doubles?", f) and re.search(r"counter|token|damage|power", f):
            nota("amplificador", 3, "dobra")
        if re.search(r"(?:other )?(?:creatures|[a-z]+s) you control get \+\d+/\+\d+", f):
            nota("amplificador", 2, "reforça o time")
        elif (re.search(r"\+1/\+1 counters? on each", f) or re.search(r"each (?:other )?(?:creature|[a-z]+) you control [^.]*\+1/\+1 counter", f)
              or re.search(r"each other [a-z]+ you control enters with [^.]*\+1/\+1 counter", f)):
            nota("amplificador", 2, "marcadores no time")
        elif re.search(r"move all counters|put (?:those|its|all) counters on", f):
            nota("amplificador", 2, "passa marcadores adiante")
        elif "+1/+1 counter" in f or re.search(r"gets? \+\d+/\+\d+", f):
            nota("amplificador", 1, "marcador ou +X/+X")
        if "proliferate" in f:
            nota("amplificador", 2, "prolifera")
        if re.search(r"copy (?:target|that) (?:instant|sorcery|spell)", f):
            nota("amplificador", 2, "copia mágica")
    if "double strike" in kws:
        nota("amplificador", 1, "golpe duplo")

    # evasão da própria carta
    for f in frases:
        if re.search(r"(?:~|this creature|equipped creature|enchanted creature) can't be blocked", f):
            nota("evasao", 2, "não pode ser bloqueada")
        elif "initiative" in f:
            nota("evasao", 1, "iniciativa")
    ev = [k for k in EVASIVAS if k in kws]
    if ev:
        nota("evasao", 1, ", ".join(ev))

    # dano direto
    for f in frases:
        perde = re.search(r"(?:each opponent|target player|target opponent|that player|defending player|each player) loses? (?:\d+|x|that much)", f)
        bate = re.search(r"deals? (?:\d+|x|that much) damage to (?:each opponent|target player|target opponent|any target|each player|that player)", f)
        if perde or bate:
            v = 2 if re.search(REPETE, f) else 1
            if "where x is" in f and "each opponent" in f:
                v = 3
            nota("dano", v, "tira vida sem combate" + (" a cada gatilho" if v == 2 else ""))
    return t


def prenota(sf):
    """(notas, sinais, alertas) para um registro do cache do Scryfall; cada face é lida com o seu próprio tipo."""
    faces = sf.get("faces") or [{"oracle_text": sf.get("oracle_text") or "", "type_line": sf.get("type_line") or "", "name": sf["name"]}]
    nome = sf["name"].split(" // ")[0]
    tipo = (sf.get("type_line") or "").lower()
    n, sinais, alertas = {}, [], []

    def nota(k, v, porque):
        if v > n.get(k, 0):
            n[k] = v
        s = "%s (%s %d)" % (porque, NOME_PT[k], v)
        if s not in sinais:
            sinais.append(s)

    if "basic" in tipo and "land" in tipo:
        return {}, ["terreno básico: 0 em tudo"], []
    lido = ""
    for f in faces:
        lido += _analisa(f.get("oracle_text", ""), (f.get("type_line") or tipo).lower(), f.get("name", nome).split(" // ")[0], nota) + "\n"
    texto = "\n".join(re.sub(r"\([^)]*\)", "", f.get("oracle_text", "")) for f in faces)
    if re.search(r"choose (?:one|two)", lido):
        alertas.append("modal")
    if len(faces) > 1 or sf.get("layout") in ("modal_dfc", "transform", "adventure", "split", "flip", "prepare"):
        alertas.append("duas faces")
    if len(texto) > 320:
        alertas.append("texto longo")
    if re.search(r"\bas long as\b|\bunless\b|\bif you control\b|\bonly if\b", lido):
        alertas.append("condicional")
    return n, sinais, alertas


def so_com(sf):
    """O tipo de que parte da nota depende ("Angel", "Equipment"), quando o texto o cita."""
    faces = sf.get("faces") or []
    t = ("\n".join(f.get("oracle_text", "") for f in faces) if faces else (sf.get("oracle_text") or "")).lower()
    t = re.sub(r"\([^)]*\)", "", t)
    for tp in TIPOS:
        if re.search(r"\b(?:other )?%ss? you control\b|\b%s spells?\b" % (tp, tp), t):
            return tp.capitalize()
    return None


def antigas(av, nome):
    """Notas antigas da carta, levadas aos critérios novos (só como sinal)."""
    d = (av.get("cartas") or {}).get(nome) or (av.get("radar") or {}).get(nome) or {}
    out = {}
    for k, v in (d.get("notas") or {}).items():
        crit = ANTIGO.get(k)
        if crit and v > 0:
            out[crit] = max(out.get(crit, 0), v)
    return out


def certeza(n, ant, alertas, terreno_basico, tem_antigo):
    """Quanto a pré-nota merece confiança, de 0 a 1. Cai quando a nota antiga via um critério que o texto não pegou,
    quando o texto dá 2 ou mais num critério que o deck antigo media e marcou 0, quando as duas diferem por 2 ou mais,
    quando nenhuma regra pegou nada, e com carta modal, de duas faces, de texto longo ou condicional."""
    if terreno_basico:
        return 1.0, []
    c, motivos = 1.0, []
    for k in CRITERIOS:
        a, b = n.get(k, 0), ant.get(k, 0)
        if b > 0 and a == 0:
            c -= 0.25
            motivos.append("%s: nota antiga %d, o texto não pegou" % (NOME_PT[k], b))
        elif a >= 2 and b == 0 and k in tem_antigo:
            c -= 0.15
            motivos.append("%s: texto %d, nota antiga 0" % (NOME_PT[k], a))
        elif a and b and abs(a - b) >= 2:
            c -= 0.15
            motivos.append("%s: texto %d, nota antiga %d" % (NOME_PT[k], a, b))
    if not n:
        c -= 0.25
        motivos.append("nenhuma regra pegou nada no texto")
    for al in alertas:
        c -= 0.1 if al != "condicional" else 0.05
        motivos.append(al)
    return max(0.0, round(c, 2)), motivos


def ler_cadastro():
    if os.path.exists(CADASTRO):
        with open(CADASTRO, encoding="utf-8") as f:
            return json.load(f)
    return {"versao": 3, "cartas": {}}


def gravar_cadastro(cad):
    cad["cartas"] = dict(sorted(cad["cartas"].items(), key=lambda kv: kv[0].lower()))
    with open(CADASTRO, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(cad, ensure_ascii=False, indent=1) + "\n")


def main():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    ap = argparse.ArgumentParser(description="Pré-nota dos critérios da carta (pontuação v3).")
    ap.add_argument("--deck", required=True, help="pasta do deck")
    ap.add_argument("--ver", action="store_true", help="só mostra, sem gravar")
    ap.add_argument("--quantas", type=int, default=20)
    a = ap.parse_args()

    m = dados.montar(a.deck, avisar=lambda *x: None)
    av = dados.ler_json(os.path.join(dados.pasta_deck(a.deck), "avaliacao.json"))
    tem_antigo = {ANTIGO[g["k"]] for g in av.get("agrupamentos") or [] if g["k"] in ANTIGO}
    nomes = []
    for c in m["cards"] + m["cands"]:
        sf_nome = c.get("on", c["n"]).split(" // ")[0]
        if sf_nome not in nomes:
            nomes.append(sf_nome)
    sf = scryfall.buscar([{"name": nm} for nm in nomes], avisar=lambda *x: None)
    cad = ler_cadastro()
    hoje = datetime.date.today().isoformat()
    linhas, novas, mantidas = [], 0, 0
    for i, nm in enumerate(nomes):
        r = sf[i]
        n, sinais, alertas = prenota(r)
        ant = antigas(av, nm)
        basico = sinais == ["terreno básico: 0 em tudo"]
        cz, motivos = certeza(n, ant, alertas, basico, tem_antigo)
        linhas.append((cz, nm, n, ant, motivos))
        atual = cad["cartas"].get(nm)
        if atual and atual.get("fonte") in ("claude", "dono"):
            mantidas += 1
            continue
        e = {"n": dict((k, n[k]) for k in CRITERIOS if n.get(k)),
             "por_que": "auto: " + ("; ".join(sinais) if sinais else "nenhum sinal no texto"), "fonte": "auto", "revisado": hoje}
        sc = so_com(r)
        if sc:
            e["so_com"] = sc
        cad["cartas"][nm] = e
        novas += 1
    if not a.ver:
        gravar_cadastro(cad)
    print("%s: %d cartas (deck e radar); %d pré-notas %s, %d revisadas mantidas" % (a.deck, len(nomes), novas, "calculadas" if a.ver else "gravadas", mantidas))
    print("\nAs %d de menor certeza:" % a.quantas)
    for cz, nm, n, ant, motivos in sorted(linhas, key=lambda x: (x[0], x[1]))[:a.quantas]:
        print("%.2f | %s | pré-nota: %s | antiga: %s | %s" % (cz, nm, ", ".join("%s %d" % (NOME_PT[k], v) for k, v in n.items()) or "nada",
              ", ".join("%s %d" % (NOME_PT[k], v) for k, v in ant.items()) or "nada", "; ".join(motivos)))


if __name__ == "__main__":
    main()
