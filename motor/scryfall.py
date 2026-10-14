# -*- coding: utf-8 -*-
"""Fatos das cartas vindos do Scryfall, com cache em cache/scryfall.json.

O cache é compartilhado entre decks e fica fora do Git. Uma carta é consultada de novo depois de 7 dias
(para o preço ficar em dia) ou quando o build roda com --atualizar-scryfall; sem rede, vale o que está no cache. Regras do Scryfall: no máximo 10 chamadas por segundo
(aqui, 100 ms de intervalo) e cabeçalho User-Agent.
"""
import datetime, json, os, time, urllib.error, urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(RAIZ, "cache", "scryfall.json")
API = "https://api.scryfall.com/cards/collection"
BUSCA_GC = "https://api.scryfall.com/cards/search?q=is%3Agamechanger&unique=cards&order=name"
UA = "mtg-hub-pessoal/1.0"
VALIDADE = 7   # dias: depois disso, a carta é consultada de novo (preço do dia)


class ErroScryfall(Exception):
    pass


def _ler():
    try:
        with open(CACHE, encoding="utf-8") as f:
            c = json.load(f)
        if c.get("v") == 1:
            return c
    except (OSError, ValueError):
        pass
    return {"v": 1, "cartas": {}, "nomes": {}}


def _gravar(c):
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    tmp = CACHE + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(c, f, ensure_ascii=False, indent=0, sort_keys=True)
    os.replace(tmp, CACHE)


def _face(f):
    d = {k: f.get(k) for k in ("name", "mana_cost", "type_line", "power", "toughness", "loyalty", "defense", "oracle_text", "artist")}
    d["image"] = bool(f.get("image_uris"))
    return {k: v for k, v in d.items() if v not in (None, "")}


def _reduzir(k, hoje):
    """Guarda só o que o motor e o /imagens usam."""
    precos = k.get("prices") or {}
    d = {
        "id": k["id"], "name": k["name"], "layout": k.get("layout"), "set": k["set"], "num": k["collector_number"],
        "mana_cost": k.get("mana_cost"), "cmc": k.get("cmc"), "type_line": k.get("type_line"),
        "power": k.get("power"), "toughness": k.get("toughness"), "loyalty": k.get("loyalty"), "defense": k.get("defense"),
        "produced_mana": k.get("produced_mana"), "color_identity": k.get("color_identity"),
        "oracle_text": k.get("oracle_text"), "artist": k.get("artist"),
        "usd": precos.get("usd"), "usd_foil": precos.get("usd_foil"), "usd_etched": precos.get("usd_etched"),
        "released_at": k.get("released_at"), "image": bool(k.get("image_uris")),
        "printed_name": k.get("printed_name"), "flavor_name": k.get("flavor_name"), "lang": k.get("lang"),
        "game_changer": True if k.get("game_changer") else None, "edhrec_rank": k.get("edhrec_rank"),
        "consultado": hoje,
    }
    if k.get("card_faces"):
        d["faces"] = [_face(f) for f in k["card_faces"]]
    return {a: b for a, b in d.items() if b not in (None, "")}


def _post(ids):
    corpo = json.dumps({"identifiers": ids}).encode()
    req = urllib.request.Request(API, data=corpo, headers={"Content-Type": "application/json", "Accept": "application/json", "User-Agent": UA})
    for tentativa in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429 and tentativa < 2:
                time.sleep(1.5 * (tentativa + 1))
                continue
            raise ErroScryfall("Scryfall respondeu %s" % e.code)
        except urllib.error.URLError as e:
            raise ErroScryfall("sem acesso ao Scryfall (%s)" % e.reason)
    raise ErroScryfall("Scryfall recusou depois de três tentativas")


def _chave(set_, num):
    return ("%s/%s" % (set_, num)).lower()


def _guardar(c, k, hoje):
    r = _reduzir(k, hoje)
    ch = _chave(r["set"], r["num"])
    c["cartas"][ch] = r
    nome = r["name"].lower()
    c["nomes"].setdefault(nome, ch)
    c["nomes"].setdefault(nome.split(" // ")[0], ch)
    return ch


def buscar(pedidos, atualizar=False, avisar=print):
    """pedidos: lista de dicts {"set", "num"} ou {"name"}. Devolve {indice_do_pedido: registro}.

    Impressão que o Scryfall não reconhece pela edição e número é buscada pelo nome, e o aviso sai no log.
    """
    c = _ler()
    hoje = datetime.date.today().isoformat()

    c.setdefault("alias", {})

    def achar(p):
        if "set" in p:
            ch = _chave(p["set"], p["num"])
            return c["cartas"].get(ch) or c["cartas"].get(c["alias"].get(ch, ""))
        ch = c["nomes"].get(p["name"].lower())
        return c["cartas"].get(ch) if ch else None

    limite = (datetime.date.today() - datetime.timedelta(days=VALIDADE)).isoformat()

    def velho(r):
        return (r.get("consultado") or "") < limite

    faltam = [i for i, p in enumerate(pedidos) if atualizar or not achar(p) or velho(achar(p))]
    mudou = False
    try:
        mudou = _consultar(c, pedidos, faltam, hoje, avisar)
    except ErroScryfall as e:
        # sem rede: segue com o que está no cache, se o cache tem tudo; só para quando falta carta de verdade
        if any(not achar(pedidos[i]) for i in faltam):
            raise
        avisar("aviso: %s; os preços e textos ficam os da última consulta" % e)
    if mudou:
        _gravar(c)

    out = {}
    for i, p in enumerate(pedidos):
        r = achar(p)
        if r is None and "set" in p:
            ch = c["nomes"].get(p["name"].lower())
            r = c["cartas"].get(ch) if ch else None
        if r is None:
            raise ErroScryfall("sem dados para " + p.get("name", "?"))
        out[i] = r
    return out


def _consultar(c, pedidos, faltam, hoje, avisar):
    mudou = False
    if faltam:
        pendentes = list(faltam)
        for rodada in ("impressao", "nome"):
            if not pendentes:
                break
            ids = []
            for i in pendentes:
                p = pedidos[i]
                if rodada == "impressao" and "set" in p:
                    # o número do colecionador é sensível a maiúsculas no Scryfall (promo "1P" difere de "1p")
                    ids.append((i, {"set": p["set"].lower(), "collector_number": str(p["num"])}))
                else:
                    ids.append((i, {"name": p["name"]}))
            nao = []
            for n in range(0, len(ids), 75):
                lote = ids[n:n + 75]
                if n:
                    time.sleep(0.1)
                resp = _post([x[1] for x in lote])
                for k in resp.get("data", []):
                    _guardar(c, k, hoje)
                    mudou = True
                for i, ident in lote:
                    p = pedidos[i]
                    if "set" in ident:
                        ok = _chave(ident["set"], ident["collector_number"]) in c["cartas"]
                    else:
                        ok = ident["name"].lower() in c["nomes"]
                    if not ok:
                        nao.append(i)
                time.sleep(0.1)
            if rodada == "impressao":
                for i in nao:
                    if "set" in pedidos[i]:
                        avisar("aviso: %s (%s %s) não reconhecida pela edição e número; buscando pelo nome" %
                               (pedidos[i].get("name"), pedidos[i]["set"], pedidos[i]["num"]))
            else:
                # impressão achada só pelo nome: guarda o atalho para não perguntar de novo a cada build
                for i in pendentes:
                    p = pedidos[i]
                    if "set" in p and i not in nao and p["name"].lower() in c["nomes"]:
                        c["alias"][_chave(p["set"], p["num"])] = c["nomes"][p["name"].lower()]
                        mudou = True
            pendentes = nao
        if pendentes:
            if mudou:
                _gravar(c)
            raise ErroScryfall("cartas não encontradas no Scryfall: " + ", ".join(pedidos[i].get("name", "?") for i in pendentes))
    return mudou


def _get(url):
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": UA})
    for tentativa in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429 and tentativa < 2:
                time.sleep(1.5 * (tentativa + 1))
                continue
            raise ErroScryfall("Scryfall respondeu %s" % e.code)
        except urllib.error.URLError as e:
            raise ErroScryfall("sem acesso ao Scryfall (%s)" % e.reason)
    raise ErroScryfall("Scryfall recusou depois de três tentativas")


def game_changers(atualizar=False, avisar=print):
    """A lista oficial de Game Changers do Commander, pela busca `is:gamechanger` do Scryfall, com o mesmo prazo de 7 dias
    das cartas. Devolve {"nomes": [...], "consultado": data} ou None quando nunca deu para consultar. A lista muda algumas
    vezes por ano (Wizards); por isso não fica escrita no motor."""
    c = _ler()
    gc = c.get("gc") or {}
    limite = (datetime.date.today() - datetime.timedelta(days=VALIDADE)).isoformat()
    if gc.get("nomes") and not atualizar and (gc.get("consultado") or "") >= limite:
        return gc
    try:
        nomes, url = [], BUSCA_GC
        while url:
            r = _get(url)
            nomes += [k["name"] for k in r.get("data", [])]
            url = r.get("next_page") if r.get("has_more") else None
            if url:
                time.sleep(0.1)
        if not nomes:
            raise ErroScryfall("a busca de Game Changers voltou vazia")
        c = _ler()   # relê: outro passo do build pode ter gravado cartas no meio
        c["gc"] = {"nomes": sorted(set(nomes)), "consultado": datetime.date.today().isoformat()}
        _gravar(c)
        return c["gc"]
    except ErroScryfall as e:
        if gc.get("nomes"):
            avisar("aviso: %s; a lista de Game Changers fica a de %s" % (e, gc.get("consultado")))
            return gc
        avisar("aviso: %s; sem a lista de Game Changers, o hub não estima o bracket por ela" % e)
        return None
