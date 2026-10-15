# -*- coding: utf-8 -*-
"""Encaixe de uma carta nos decks da pontuação v3 (contexto/pontuacao/DADOS.md, seção 4).

Para uma carta c e um deck D:
1. notas de c em D: cadastro único + sinergias de c em D (0, com o aviso "sinergia a avaliar", se D não avaliou c);
2. saturação de cada critério em D: cartas do deck com nota 2 ou mais contra a faixa da régua (abaixo 1,5×, dentro 1×, acima 0,5×);
3. valor com saturação de c = soma de peso × pontos da nota × saturação;
4. quem sai: a carta de menor valor (sem saturação) do deck, fora comandante, fora_do_corte e terrenos; se c é terreno, o terreno
   de menor valor. Carta de duas faces com terreno no verso (MDFC) conta como terreno aqui: ela é fonte de mana do deck, e
   trocá-la por mágica baixaria as fontes;
5. ganho = valor com saturação de c − valor de quem sai; à parte, a variação do CMC médio e dos pontos de aceleração.
Carta fora da identidade de cor do deck não encaixa nele.

O painel (gaveta da carta) e o hub (Radar e Compras) usam esta mesma conta, montada em Python no build.
"""
import json, os
import dados, scryfall

_CI = None
_DECKS = {}


def _regua():
    r = dados.regua()
    return r, [c["k"] for c in r["criterios"]], [c["peso"] for c in r["criterios"]], r["pontos_por_nota"], [c["faixa"] for c in r["criterios"]]


def identidade(nome):
    """Identidade de cor da carta, pelo cache do Scryfall (a mesma fonte da checagem de identidade do motor)."""
    global _CI
    if _CI is None:
        _CI = {}
        for v in scryfall._ler().get("cartas", {}).values():
            if isinstance(v, dict) and v.get("name"):
                _CI.setdefault(v["name"].split(" // ")[0], "".join(v.get("color_identity") or []))
    return _CI.get(nome.split(" // ")[0])


def valor(s3, mult=None):
    """Soma de peso × pontos da nota (× saturação de cada critério, se dada), para as dez notas na ordem da régua."""
    _, _, peso, pn, _ = _regua()
    return sum(peso[i] * pn[v] * (mult[i] if mult else 1) for i, v in enumerate(s3) if v)


def _nome(c):
    return c.get("on", c["n"]).split(" // ")[0]


def _terra(c):
    """Terreno ou carta com terreno no verso (MDFC): só troca com outra do mesmo tipo."""
    return bool(c and (c.get("land") or c.get("mdfc")))


def contexto(m):
    """O que o encaixe precisa de um deck, calculado uma vez: saturação, quem sai e a base da aceleração."""
    if "_enc" in m:
        return m["_enc"]
    r, ks, peso, pn, faixa = _regua()
    sat = r["saturacao"]
    minimo = sat.get("conta_com_nota_minima", 2)
    ncrit = [sum(c["q"] for c in m["cards"] if c["s3"][i] >= minimo) for i in range(len(ks))]
    mult = [sat["abaixo"] if ncrit[i] < faixa[i][0] else sat["acima"] if ncrit[i] > faixa[i][1] else sat["dentro"] for i in range(len(ks))]
    def menor(terra):
        cs = [c for c in m["cards"] if not c.get("cmd") and not c.get("nocut") and _terra(c) == terra and c["q"] == 1]
        return min(cs, key=lambda c: (valor(c["s3"]), c["n"])) if cs else None
    ia = ks.index("aceleradores")
    nl = [c for c in m["cards"] if not c.get("land")]
    ctx = dict(mult=mult, ncrit=ncrit, sai={False: menor(False), True: menor(True)}, ia=ia,
               nl=sum(c["q"] for c in nl), cmc=sum(c["cmc"] * c["q"] for c in nl), ace=sum(c["s3"][ia] * c["q"] for c in m["cards"]),
               nomes={_nome(c): c for c in m["cards"] + m["cands"]}, no_deck={_nome(c) for c in m["cards"]})
    m["_enc"] = ctx
    return ctx


def _acel(ace, cmc, nl):
    avg = cmc / nl if nl else 0
    return dados.pontos_aceleracao(ace / avg if avg else 0), avg


def ganho(nome, m, cad, carta=None):
    """Encaixe de uma carta no deck m (montado por dados.montar, v3). carta: cmc, land e mdfc, para quem sai e a variação do CMC
    e da aceleração.
    Devolve None se a carta não tem cadastro ou está fora da identidade de cor do deck."""
    _, ks, _, _, faixa = _regua()
    ci = identidade(nome)
    if ci is None or any(ch not in (m.get("ident") or "") for ch in ci):
        return None
    base = nome.split(" // ")[0]
    ctx = contexto(m)
    proprio = ctx["nomes"].get(base)
    if proprio is not None:
        s3, avaliada = list(proprio["s3"]), True   # o deck já avaliou a carta: as notas dele, com sinergias e ajustes
    else:
        e = cad.get(base)
        if e is None:
            return None
        s3, avaliada = [e["n"].get(k, 0) for k in ks], False
    terra = _terra(carta)
    sai = ctx["sai"][terra]
    vc, vs = valor(s3, ctx["mult"]), (valor(sai["s3"]) if sai else 0)
    out = dict(deck=m.get("pasta"), painel=m.get("painel"), avaliada=avaliada, ja_no_deck=base in ctx["no_deck"], valor=round(vc, 2),
               sai=sai["n"] if sai else None, valor_sai=round(vs, 2), ganho=round(vc - vs, 2),
               cobre=[ks[i] for i in range(len(ks)) if s3[i] >= 2 and ctx["ncrit"][i] < faixa[i][0]])
    if carta is not None and sai is not None and not out["ja_no_deck"]:
        a0, avg0 = _acel(ctx["ace"], ctx["cmc"], ctx["nl"])
        # o CMC médio conta só as não terrenos (a MDFC entra nele pela face da frente)
        cmc1, nl1 = ctx["cmc"], ctx["nl"]
        if not sai.get("land"):
            cmc1, nl1 = cmc1 - sai["cmc"], nl1 - 1
        if not carta.get("land"):
            cmc1, nl1 = cmc1 + carta.get("cmc", 0), nl1 + 1
        a1, avg1 = _acel(ctx["ace"] - sai["s3"][ctx["ia"]] + s3[ctx["ia"]], cmc1, nl1)
        out.update(d_cmc=round(avg1 - avg0, 3), d_acel=a1 - a0)
    return out


def ranking(nome, decks, cad, carta=None, n=5):
    """Os decks onde a carta rende mais, pelo ganho."""
    res = [g for g in (ganho(nome, m, cad, carta) for m in decks) if g is not None]
    res.sort(key=lambda g: (-g["ganho"], g["deck"] or ""))
    return res[:n] if n else res


def decks_v3():
    """Os decks da pasta de dados atual que estão na pontuação v3, montados uma vez por execução."""
    base = dados.DADOS
    if base not in _DECKS:
        out = []
        for pasta in sorted(os.listdir(base)):
            ap = os.path.join(base, pasta, "avaliacao.json")
            if pasta.startswith("_") or not os.path.exists(ap):
                continue
            with open(ap, encoding="utf-8") as f:
                if json.load(f).get("versao_pontuacao") != 3:
                    continue
            m = dados.montar(pasta, avisar=lambda *x: None)
            t = dados.ler_json(os.path.join(base, pasta, "tema.json"), obrigatorio=False) or {}
            m.update(pasta=pasta, painel=t.get("painel") or pasta)
            out.append(m)
        _DECKS[base] = out
    return _DECKS[base]


def para_painel(d, pasta, painel):
    """Encaixe de cada carta do deck e do radar em todos os decks v3, em chaves curtas, para a gaveta do painel."""
    cad = dados.ler_cadastro()
    ds = [m for m in decks_v3() if m["pasta"] != pasta] + [dict(d, pasta=pasta, painel=painel)]
    out = {}
    for c in d["cards"] + d["cands"]:
        if c.get("cmd"):
            continue
        r = ranking(c.get("on", c["n"]), ds, cad, dict(cmc=c["cmc"], land=c.get("land"), mdfc=c.get("mdfc")), n=None)
        out[c["id"]] = [dict(p=g["deck"], n=g["painel"], g=g["ganho"], v=g["valor"], s=g["sai"], vs=g["valor_sai"], c=g["cobre"],
                             a=1 if g["avaliada"] else 0, j=1 if g["ja_no_deck"] else 0,
                             **({"dc": g["d_cmc"], "da": g["d_acel"]} if "d_cmc" in g else {})) for g in r]
    return out
