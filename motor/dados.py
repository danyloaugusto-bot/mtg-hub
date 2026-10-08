# -*- coding: utf-8 -*-
"""Lê a pasta de um deck (dados/<pasta>/), valida o contrato e monta o objeto D que o painel recebe.

Contrato: contexto/ARQUITETURA.md, seção "Contrato de um deck".
"""
import json, os, re, unicodedata

import scryfall

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DADOS = os.path.join(RAIZ, "dados")
WUBRG = "WUBRG"
TIERS = ("S", "A", "B", "C", "D")
RELS = ("INS", "ALT", "MED", "BAX")
VEREDITOS = ("entra", "avaliar", "fora")
LEITURAS = ("terrenos", "agrupamento", "remocao", "contagem", "tribo", "proporcao", "curva")
FASES = ("inicio", "meio", "fim")
CONTRA = ("aggro", "voltron", "combo", "controle", "stax", "aristocratas", "spellslinger", "ramp")
RESULTADOS = ("forte", "equilibrado", "fraco")


class ErroDeck(Exception):
    pass


PASTAS_FORA = {"pastas"}   # dados/pastas guarda as pastas de cartas do dono, não é deck


def eh_deck(nome):
    """Pasta de dados/ que é um deck: não começa com _ ou ., e não é uma das pastas reservadas."""
    return (not nome.startswith(("_", "."))) and nome.lower() not in PASTAS_FORA and os.path.isdir(os.path.join(DADOS, nome))


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def ler_json(caminho, obrigatorio=True):
    if not os.path.exists(caminho):
        if obrigatorio:
            raise ErroDeck("falta o arquivo " + os.path.relpath(caminho, RAIZ))
        return None
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except ValueError as e:
        raise ErroDeck("%s não é um JSON válido: %s" % (os.path.relpath(caminho, RAIZ), e))


# ---------------------------------------------------------------- decklist
LINHA = re.compile(r"^(\d+)\s+(.+?)(?:\s+\(([A-Za-z0-9]+)\)\s+(\S+))?((?:\s+(?:\*[A-Za-z]+\*|F|E|CMDR))*)\s*$")


def ler_decklist(caminho):
    if not os.path.exists(caminho):
        raise ErroDeck("falta decklist.txt")
    out = []
    with open(caminho, encoding="utf-8-sig") as f:
        for n, linha in enumerate(f, 1):
            linha = linha.strip()
            if not linha or linha.startswith("#") or linha.startswith("//"):
                continue
            m = LINHA.match(linha)
            if not m:
                raise ErroDeck("decklist.txt, linha %d não está no formato '1 Nome (SET) 123': %s" % (n, linha))
            flags = {f.strip("*").upper() for f in (m.group(5) or "").split()}
            out.append(dict(q=int(m.group(1)), name=m.group(2), set=m.group(3), num=m.group(4),
                            foil="F" in flags or "E" in flags, etched="E" in flags, cmd="CMDR" in flags))
    if not out:
        raise ErroDeck("decklist.txt está vazia")
    if not any(e["cmd"] for e in out):
        out[0]["cmd"] = True
    return out


# ---------------------------------------------------------------- tipos em português
SUB = {
    "Vampire": "Vampiro", "Cleric": "Clérigo", "Noble": "Nobre", "Knight": "Cavaleiro", "Soldier": "Soldado",
    "Spirit": "Espírito", "Phyrexian": "Phyrexiano", "Horror": "Horror", "Human": "Humano", "Advisor": "Conselheiro",
    "Wizard": "Mago", "Assassin": "Assassino", "God": "Deus", "Golem": "Golem", "Aetherborn": "Etergênito",
    "Warlock": "Bruxo", "Sorin": "Sorin", "Siege": "Cerco", "Aura": "Aura", "Equipment": "Equipamento",
    "Plains": "Planície", "Swamp": "Pântano", "Pirate": "Pirata", "Warrior": "Guerreiro", "Ally": "Aliado", "Shaman": "Xamã",
    "Angel": "Anjo", "Island": "Ilha", "Mountain": "Montanha", "Forest": "Floresta", "Elf": "Elfo", "Goblin": "Goblin",
    "Zombie": "Zumbi", "Dragon": "Dragão", "Demon": "Demônio", "Rogue": "Ladino", "Druid": "Druida", "Beast": "Fera",
    "Bird": "Ave", "Cat": "Felino", "Dog": "Cão", "Wolf": "Lobo", "Elemental": "Elemental", "Giant": "Gigante",
    "Merfolk": "Tritão", "Turtle": "Tartaruga", "Ninja": "Ninja", "Monk": "Monge", "Berserker": "Berserker",
    "Artificer": "Artífice", "Construct": "Construto", "Saga": "Saga", "Vehicle": "Veículo", "Food": "Comida",
    "Treasure": "Tesouro", "Clue": "Pista", "Shrine": "Santuário", "Class": "Classe", "Case": "Caso", "Room": "Sala",
    "Gate": "Portão", "Cave": "Caverna", "Town": "Cidade", "Desert": "Deserto", "Lair": "Covil", "Sphere": "Esfera",
    "Skeleton": "Esqueleto", "Werewolf": "Lobisomem", "Devil": "Diabo", "Imp": "Diabrete",
    "Faerie": "Fada", "Fungus": "Fungo", "Insect": "Inseto", "Rat": "Rato", "Snake": "Serpente", "Spider": "Aranha",
}
PRINCIPAIS = ("Creature", "Artifact", "Enchantment", "Land", "Instant", "Sorcery", "Planeswalker", "Battle")


def tipo(type_line):
    """Igual ao typeinfo do kit do Ritos, agora a partir da linha de tipo do Scryfall."""
    esq, _, dir_ = (type_line or "").partition(" — ")
    w = esq.split()
    subs = dir_.split()
    leg = "Legendary" in w
    basic = "Basic" in w
    mains = [x for x in w if x in PRINCIPAIS]
    if "Creature" in mains:
        t = "cri"; base = "Criatura Artefato" if "Artifact" in mains else "Criatura"; fem = True
    elif "Land" in mains:
        t = "ter"; base = "Terreno"; fem = False
    elif "Planeswalker" in mains:
        t = "pw"; base = "Planeswalker"; fem = False
    elif "Battle" in mains:
        t = "bat"; base = "Batalha"; fem = True
    elif "Instant" in mains:
        t = "ins"; base = "Mágica Instantânea"; fem = True
    elif "Sorcery" in mains:
        t = "fei"; base = "Feitiço"; fem = False
    elif "Artifact" in mains:
        t = "art"; base = "Artefato"; fem = False
    else:
        t = "enc"; base = "Encantamento"; fem = False
    line = base
    if leg:
        line += " Lendária" if fem else " Lendário"
    if basic:
        line += " Básico"
    if subs:
        line += " — " + " ".join(SUB.get(x, x) for x in subs)
    return t, line, leg, subs


GROUP_OF = {"cri": "cri", "pw": "pw", "bat": "bat", "ins": "mag", "fei": "mag", "art": "art", "enc": "enc", "ter": "ter"}


def custo(mc):
    """Custo no formato {1}{W}{B}: devolve (custo, cmc, cores na ordem WUBRG)."""
    if not mc:
        return "", 0, ""
    cmc, cores = 0, set()
    for s in re.findall(r"\{([^}]+)\}", mc):
        if s.isdigit():
            cmc += int(s)
        elif s in ("X", "Y", "Z"):
            pass
        else:
            cmc += 1
            cores.update(ch for ch in s if ch in WUBRG)
    return mc, cmc, "".join(c for c in WUBRG if c in cores)


def ordem_cores(s):
    return "".join(c for c in WUBRG if c in (s or ""))


# ---------------------------------------------------------------- avaliação
def vetor(notas, grupos, quem):
    if not isinstance(notas, dict):
        raise ErroDeck("%s: 'notas' precisa ser um objeto {agrupamento: nota}" % quem)
    chaves = [g["k"] for g in grupos]
    for k, v in notas.items():
        if k not in chaves:
            raise ErroDeck("%s: nota em '%s', que não é um agrupamento deste deck (%s)" % (quem, k, ", ".join(chaves)))
        minimo = -1 if grupos[chaves.index(k)].get("negativo") else 0
        if not isinstance(v, int) or v < minimo or v > 3:
            raise ErroDeck("%s: nota %r em %s; vale de %d a 3" % (quem, v, k, minimo))
    return [notas.get(k, 0) for k in chaves]


def conferir_avaliacao(av, quem, grupos, marcadores, radar=False):
    if av.get("tier") not in TIERS:
        raise ErroDeck("%s: tier %r; use %s" % (quem, av.get("tier"), " ".join(TIERS)))
    if av.get("rel") not in RELS:
        raise ErroDeck("%s: relevância %r; use %s" % (quem, av.get("rel"), " ".join(RELS)))
    if radar and av.get("veredito") not in VEREDITOS:
        raise ErroDeck("%s: veredito %r; use %s" % (quem, av.get("veredito"), ", ".join(VEREDITOS)))
    for k in (av.get("marcas") or {}):
        if k not in marcadores:
            raise ErroDeck("%s: marca '%s' não está declarada em 'marcadores'" % (quem, k))
    for campo in ("faz", "porque"):
        if not isinstance(av.get(campo, ""), str):
            raise ErroDeck("%s: '%s' precisa ser texto" % (quem, campo))


# ---------------------------------------------------------------- carta
def nome_impresso(sf):
    """Nome que está na carta física, quando difere do nome do Scryfall (ex.: Ken, Burning Brawler, impresso na SLD 430,
    que o Scryfall chama de Aisha of Sparks and Smoke). Só impressões em inglês: nome de carta é sempre em inglês."""
    n = sf.get("flavor_name") or (sf.get("printed_name") if sf.get("lang") in (None, "en") else None)
    return n if n and n != sf.get("name") else None


def montar_carta(nome, av, sf, grupos, marcadores, entrada=None):
    faces = sf.get("faces") or []
    frente = faces[0] if faces else sf
    t, line, leg, subs = tipo(frente.get("type_line") or sf.get("type_line"))
    mc = frente.get("mana_cost") if faces else sf.get("mana_cost")
    if sf.get("layout") == "prepare":
        mc = faces[0].get("mana_cost") if faces else (sf.get("mana_cost") or "").split(" // ")[0]
    cost, cmc, cores = custo(mc)
    if t == "ter":
        col = "L"
    else:
        col = cores or "C"
    d = dict(id=slug(nome), n=nome, q=1, cost=cost, cmc=cmc, t=t, g=GROUP_OF[t], line=line, col=col)
    if av is not None:
        d.update(s=vetor(av.get("notas", {}), grupos, nome), tier=av["tier"], rel=av["rel"],
                 fx=av.get("faz", ""), why=av.get("porque", ""))
    stat = None
    if frente.get("power") is not None and frente.get("toughness") is not None:
        stat = "%s/%s" % (frente["power"], frente["toughness"])
    elif frente.get("loyalty"):
        stat = frente["loyalty"]; d["ptl"] = "Lealdade"
    elif frente.get("defense"):
        stat = frente["defense"]; d["ptl"] = "Defesa"
    if stat:
        d["pt"] = stat
    if leg:
        d["leg"] = 1
    if t == "ter":
        d["land"] = 1
    lay = sf.get("layout")
    if len(faces) > 1 and faces[1].get("name"):
        bt, bline, _, _ = tipo(faces[1].get("type_line"))
        if lay == "prepare":
            d["back"] = dict(n=faces[1]["name"], line=bline + " (mágica preparada)")
        elif lay == "adventure":
            d["back"] = dict(n=faces[1]["name"], line=bline + " (aventura)")
        elif lay in ("transform", "modal_dfc"):
            d["back"] = dict(n=faces[1]["name"], line=bline)
            d["dfc"] = 1
            if lay == "modal_dfc" and bt == "ter" and t != "ter":
                d["mdfc"] = 1
    # marcadores
    mk = {}
    for k, m in marcadores.items():
        if m.get("subtipo") and m["subtipo"] in subs:
            mk[k] = 1
    if av is not None:
        for k, v in (av.get("marcas") or {}).items():
            if v:
                mk[k] = v
        if av.get("massa"):
            d["wipe"] = 1
        if av.get("pontual"):
            d["spot"] = 1
        if av.get("virado"):
            d["tapped"] = 1
        if av.get("prioridade"):
            d["pri"] = av["prioridade"]
        if av.get("fora_do_corte"):
            d["nocut"] = 1
        if av.get("gera"):
            d["prod"] = av["gera"]
    if mk:
        d["mk"] = mk
    if "prod" not in d and (t == "ter" or d.get("mdfc")):
        pm = ordem_cores("".join(sf.get("produced_mana") or []))
        if pm or "C" in (sf.get("produced_mana") or []):
            d["prod"] = pm or "C"
    # impressão e imagem
    if entrada:
        d["q"] = entrada["q"]
        if entrada.get("set"):
            d["set"] = entrada["set"].upper()
            d["num"] = entrada["num"]
        if entrada.get("foil"):
            d["foil"] = 1
        if entrada.get("etched"):
            d["etched"] = 1
        if entrada.get("cmd"):
            d["cmd"] = 1
            d["g"] = "cmd"
    d["sid"] = sf["id"]
    d["iset"] = sf["set"]
    d["inum"] = sf["num"]
    if d.get("dfc") and len(faces) > 1 and faces[1].get("image"):
        d["iback"] = 1
    if sf.get("artist") or (faces and faces[0].get("artist")):
        d["ar"] = sf.get("artist") or faces[0].get("artist")
    if sf.get("usd"):
        d["usd"] = sf["usd"]
    if sf.get("usd_foil"):
        d["usdf"] = sf["usd_foil"]
    if d.get("etched") and sf.get("usd_etched"):
        d["usdf"] = sf["usd_etched"]
    if entrada is not None and nome_impresso(sf):
        # o painel mostra o nome da carta física; o do Scryfall fica guardado para busca, links e exportação
        d["on"] = nome
        d["n"] = nome_impresso(sf)
    return d


# ---------------------------------------------------------------- leituras
def conferir_leituras(leituras, grupos, marcadores):
    chaves = [g["k"] for g in grupos]
    for i, l in enumerate(leituras):
        q = "leitura %d (%s)" % (i + 1, l.get("tipo"))
        if l.get("tipo") not in LEITURAS:
            raise ErroDeck("%s: tipo desconhecido; use %s" % (q, ", ".join(LEITURAS)))
        if l["tipo"] in ("agrupamento", "remocao") and l.get("g") not in chaves:
            raise ErroDeck("%s: agrupamento '%s' não existe" % (q, l.get("g")))
        if l["tipo"] == "contagem" and l.get("marcador") not in marcadores:
            raise ErroDeck("%s: marcador '%s' não está declarado" % (q, l.get("marcador")))
        if l["tipo"] == "tribo" and "tribo" not in marcadores:
            raise ErroDeck("%s: falta declarar o marcador 'tribo'" % q)
        if l["tipo"] == "proporcao" and (l.get("a") not in marcadores or l.get("b") not in marcadores):
            raise ErroDeck("%s: 'a' e 'b' precisam ser marcadores declarados" % q)
        if l["tipo"] in ("agrupamento", "contagem") and not (isinstance(l.get("rotulo"), list) and len(l["rotulo"]) == 2):
            raise ErroDeck("%s: 'rotulo' precisa ser [singular, plural]" % q)


def conferir_estrategia(e):
    """Bloco opcional: as três fases do jogo e contra que tipo de deck este vai bem ou mal."""
    if e is None:
        return None
    if not isinstance(e, dict):
        raise ErroDeck("avaliacao.json: 'estrategia' precisa ser um objeto")
    for f in FASES:
        x = e.get(f)
        if x is None:
            continue
        if not isinstance(x, dict) or not str(x.get("plano", "")).strip():
            raise ErroDeck("estratégia, fase '%s': falta o 'plano'" % f)
        for k in ("fortes", "fracos"):
            if not isinstance(x.get(k, []), list):
                raise ErroDeck("estratégia, fase '%s': '%s' precisa ser uma lista" % (f, k))
    vistos = set()
    for c in e.get("contra") or []:
        if c.get("tipo") not in CONTRA:
            raise ErroDeck("estratégia, 'contra': tipo '%s'; use %s" % (c.get("tipo"), ", ".join(CONTRA)))
        if c.get("resultado") not in RESULTADOS:
            raise ErroDeck("estratégia, contra %s: resultado '%s'; use %s" % (c["tipo"], c.get("resultado"), ", ".join(RESULTADOS)))
        if not str(c.get("porque", "")).strip():
            raise ErroDeck("estratégia, contra %s: falta o 'porque'" % c["tipo"])
        if c["tipo"] in vistos:
            raise ErroDeck("estratégia, 'contra': %s repetido" % c["tipo"])
        vistos.add(c["tipo"])
    return {k: v for k, v in e.items() if not k.startswith("_")}


# ---------------------------------------------------------------- deck inteiro
def montar(pasta, atualizar_scryfall=False, avisar=print):
    base = os.path.join(DADOS, pasta)
    if not os.path.isdir(base):
        raise ErroDeck("não existe a pasta dados/" + pasta)
    lista = ler_decklist(os.path.join(base, "decklist.txt"))
    av = ler_json(os.path.join(base, "avaliacao.json"))
    com = ler_json(os.path.join(base, "comunidade.json"), obrigatorio=False)

    grupos = av.get("agrupamentos") or []
    if not 6 <= len(grupos) <= 10:
        raise ErroDeck("avaliacao.json: o deck tem %d agrupamentos; o motor aceita de 6 a 10" % len(grupos))
    vistos = set()
    for g in grupos:
        for campo in ("k", "nome", "ab", "desc"):
            if not g.get(campo):
                raise ErroDeck("avaliacao.json: agrupamento sem '%s': %s" % (campo, g))
        if g["k"] in vistos:
            raise ErroDeck("avaliacao.json: agrupamento repetido: " + g["k"])
        vistos.add(g["k"])
        if g.get("ref") is not None and not (isinstance(g["ref"], list) and len(g["ref"]) == 2):
            raise ErroDeck("avaliacao.json: 'ref' de %s precisa ser [mínimo, máximo]" % g["k"])
    if sum(1 for g in grupos if g.get("pet")) > 1:
        raise ErroDeck("avaliacao.json: só um agrupamento recebe o ponto do PetCard")
    for g in grupos:
        if g["k"] == "ramp":
            g.setdefault("negativo", True)
    def sem_comentario(d):
        return {k: v for k, v in (d or {}).items() if not k.startswith("_")}

    marcadores = sem_comentario(av.get("marcadores"))
    leituras = av.get("leituras") or []
    conferir_leituras(leituras, grupos, marcadores)

    cartas_av = sem_comentario(av.get("cartas"))
    radar_av = sem_comentario(av.get("radar"))
    faltam = [e["name"] for e in lista if e["name"] not in cartas_av]
    if faltam:
        raise ErroDeck("cartas da decklist sem avaliação em avaliacao.json: " + ", ".join(faltam))
    sobra = sorted(set(cartas_av) - {e["name"] for e in lista})
    if sobra:
        avisar("aviso: avaliadas mas fora da decklist (ignoradas): " + ", ".join(sobra))
    for n, a in cartas_av.items():
        conferir_avaliacao(a, n, grupos, marcadores)
    for n, a in radar_av.items():
        conferir_avaliacao(a, n + " (radar)", grupos, marcadores, radar=True)
        if a.get("sai") and a["sai"] not in cartas_av:
            raise ErroDeck("%s (radar): 'sai' aponta para %s, que não está no deck" % (n, a["sai"]))
        if n in cartas_av:
            raise ErroDeck("%s está no deck e no radar ao mesmo tempo" % n)

    pot = (com or {}).get("potenciais") or []
    pot = [p for p in pot if p["nome"] not in cartas_av and p["nome"] not in radar_av]

    # fatos das cartas
    pedidos = [dict(name=e["name"], set=e["set"], num=e["num"]) if e.get("set") else dict(name=e["name"]) for e in lista]
    pedidos += [dict(name=n) for n in radar_av] + [dict(name=p["nome"]) for p in pot]
    sf = scryfall.buscar(pedidos, atualizar=atualizar_scryfall, avisar=avisar)

    # identidade de cor: nenhuma carta do deck, do radar ou dos potenciais pode ficar fora da identidade do comandante
    i_cmd = next((i for i, e in enumerate(lista) if e["cmd"]), None)
    ident = ordem_cores("".join(sf[i_cmd].get("color_identity") or [])) if i_cmd is not None else ""
    n0 = len(lista)
    faixas = [("decklist.txt", [(sf[i], e["name"]) for i, e in enumerate(lista)]),
              ("avaliacao.json, radar", [(sf[n0 + j], n) for j, n in enumerate(radar_av)]),
              ("comunidade.json, potenciais", [(sf[n0 + len(radar_av) + j], p["nome"]) for j, p in enumerate(pot)])]
    for onde, itens in faixas:
        fora = [nome for r, nome in itens if any(c not in ident for c in (r.get("color_identity") or []))]
        if fora:
            raise ErroDeck("%s: fora da identidade de cor do comandante (%s): %s" % (onde, ident or "incolor", ", ".join(fora)))

    cards = [montar_carta(e["name"], cartas_av[e["name"]], sf[i], grupos, marcadores, e) for i, e in enumerate(lista)]
    # o mesmo básico em duas impressões vira duas linhas: cada uma precisa de id próprio
    vistos_id = {}
    for c in cards:
        k = vistos_id[c["id"]] = vistos_id.get(c["id"], 0) + 1
        if k > 1:
            c["id"] = "%s-%d" % (c["id"], k)
    ids = {}
    for c in cards:
        # combos e trocas citam a carta pelo nome do Scryfall, que é o da avaliacao.json
        ids.setdefault(c.get("on", c["n"]), c["id"])
    cands = []
    for j, (n, a) in enumerate(radar_av.items()):
        c = montar_carta(n, a, sf[n0 + j], grupos, marcadores)
        c["cand"] = 1
        c["verdict"] = a["veredito"]
        if a.get("sai"):
            c["sai"] = ids[a["sai"]]
        cands.append(c)
    ids.update({c["n"]: c["id"] for c in cands})
    n1 = n0 + len(radar_av)
    pool = []
    for j, p in enumerate(pot):
        c = montar_carta(p["nome"], None, sf[n1 + j], grupos, marcadores)
        r = sf[n1 + j]
        faces = r.get("faces") or []
        c["fx"] = r.get("oracle_text") or " // ".join(f.get("oracle_text", "") for f in faces)
        c["orig"] = 1
        if p.get("sinergia") is not None:
            c["syn"] = p["sinergia"]
        if p.get("novo"):
            c["novo"] = 1
        pool.append(c)

    combos = []
    for x in av.get("combos") or []:
        for p in x["pecas"]:
            if p not in ids:
                raise ErroDeck("combo '%s': a peça %s não está no deck nem no radar" % (x["nome"], p))
        combos.append(dict(n=x["nome"], kind=x.get("tipo", "Combo"), p=[ids[p] for p in x["pecas"]], t=x.get("texto", "")))

    edh = None
    if com:
        sin = com.get("sinergia") or {}
        for c in cards + cands:
            n = c.get("on", c["n"])
            if n in sin and sin[n] is not None:
                c["syn"] = sin[n]
        edh = dict(fonte=com.get("fonte", "edh.wiki"), url=com.get("url", ""), lido=com.get("lido", ""), pagina=com.get("pagina", ""),
                   temas=com.get("temas") or [], listas=com.get("listas") or [], precon=com.get("precon"))

    estrategia = conferir_estrategia(av.get("estrategia"))
    return dict(cards=cards, cands=cands, pool=pool, combos=combos, edh=edh, grupos=grupos, estrategia=estrategia,
                marcadores=marcadores, leituras=leituras, feito=av.get("feito", ""), ident=ident,
                scryfall_data=max((r.get("consultado", "") for r in sf.values()), default=""))
