# -*- coding: utf-8 -*-
"""Página de uma carta no EDHREC: os comandantes que mais jogam a carta, com a porcentagem.

Lê https://json.edhrec.com/pages/cards/<slug>.json, a lista com tag "topcommanders" (container.json_dict.cardlists);
de cada entrada, name, num_decks e potential_decks. Cache em cache/edhrec/cartas/<slug>.json, válido por 30 dias.
Uma chamada por segundo, com User-Agent. Falha, ou página sem a lista: devolve None, sem erro (a carta fica sem o bloco).
"""
import datetime, json, os, re, time, unicodedata, urllib.error, urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(RAIZ, "cache", "edhrec", "cartas")
URL = "https://json.edhrec.com/pages/cards/%s.json"
UA = "mtg-hub-pessoal/1.0"
VALIDADE = 30   # dias
INTERVALO = 1.0  # segundos entre chamadas
_ultima = [0.0]


def slug(nome, inteiro=False):
    """Nome da face da frente em minúsculas, sem acento e sem pontuação; espaços viram hífen (krrik-son-of-yawgmoth).
    inteiro=True usa as duas faces, como o EDHREC faz nas cartas divididas (Fire // Ice vira fire-ice)."""
    s = unicodedata.normalize("NFKD", nome if inteiro else nome.split(" // ")[0]).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    return re.sub(r"[\s-]+", "-", s).strip("-")


def _ler_cache(sl):
    p = os.path.join(CACHE, sl + ".json")
    try:
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def _gravar_cache(sl, dado):
    os.makedirs(CACHE, exist_ok=True)
    tmp = os.path.join(CACHE, sl + ".json.tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dado, f, ensure_ascii=False)
    os.replace(tmp, os.path.join(CACHE, sl + ".json"))


def _extrair(j):
    for l in ((j.get("container") or {}).get("json_dict") or {}).get("cardlists") or []:
        if l.get("tag") == "topcommanders":
            out = []
            for v in l.get("cardviews") or []:
                n, p = v.get("num_decks"), v.get("potential_decks")
                if v.get("name") and n is not None and p:
                    out.append(dict(n=v["name"], decks=n, de=p, pct=round(100.0 * n / p, 1)))
            return out
    return None


def comandantes(nome, rede=True, avisar=print):
    """[{n, decks, de, pct}] dos comandantes que mais jogam a carta, na ordem da página; None se não houver."""
    sl = slug(nome)
    c = _ler_cache(sl)
    hoje = datetime.date.today()
    if c and c.get("lido"):
        try:
            if (hoje - datetime.date.fromisoformat(c["lido"])).days <= VALIDADE:
                return c.get("top")
        except ValueError:
            pass
    if not rede:
        return c.get("top") if c else None
    espera = INTERVALO - (time.time() - _ultima[0])
    if espera > 0:
        time.sleep(espera)
    def baixar(s):
        req = urllib.request.Request(URL % s, headers={"Accept": "application/json", "User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    try:
        try:
            j = baixar(sl)
        except urllib.error.HTTPError as e:
            if e.code != 404 or " // " not in nome:
                raise
            time.sleep(INTERVALO)
            j = baixar(slug(nome, inteiro=True))   # carta dividida: o EDHREC usa as duas faces
        top = _extrair(j)
    except (urllib.error.URLError, urllib.error.HTTPError, ValueError, OSError) as e:
        _ultima[0] = time.time()
        if c:   # sem rede ou fora do ar: vale o que estava no cache, mesmo vencido
            return c.get("top")
        avisar("aviso: EDHREC sem a página de %s (%s)" % (nome, getattr(e, "code", e)))
        _gravar_cache(sl, dict(lido=hoje.isoformat(), nome=nome, top=None, erro=str(getattr(e, "code", e))))
        return None
    _ultima[0] = time.time()
    _gravar_cache(sl, dict(lido=hoje.isoformat(), nome=nome, top=top))
    return top
