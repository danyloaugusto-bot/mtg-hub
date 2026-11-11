# -*- coding: utf-8 -*-
"""Tier list pelo método do projeto (contexto/estrategias/tier-list.md).

Quem avalia dá a cada carta a função e cinco notas de 0 a 3 (as lentes E, I, T, Q, R), cada uma com uma frase, mais a
antissinergia, as travas e o substituto. A letra não se escolhe: sai daqui, pelos pesos do grupo do deck, pelos limites e
pelo portão do S (régua em motor/tier.json).

  python motor/tier.py --deck "03. Valgavoth"                      # a tier list do deck, com o índice de cada carta
  python motor/tier.py --deck "03. Valgavoth" --conferir <arq.json>  # calcula as letras do arquivo, sem gravar
  python motor/tier.py --deck "03. Valgavoth" --gravar <arq.json>    # grava no avaliacao.json (só com o "pode" do dono)

Formato do arquivo: {"conta": "...", "decisoes": ["..."], "estimacao": ["Carta"], "cartas": {carta: {"funcao", "lentes":
{"E","I","T","Q","R"}, "lentes_por_que": {...}, "antissinergia", "travas": [...], "substituto", "confianca",
"argumentos_s": [três frases, só para quem chega a S]}}}. O comandante fica fora.
"""
import collections
import json
import os
import sys

MOTOR = os.path.dirname(os.path.abspath(__file__))
ORDEM = "SABCD"
LENTES = "EITQR"
_REGUA = None


def regua():
    global _REGUA
    if _REGUA is None:
        with open(os.path.join(MOTOR, "tier.json"), encoding="utf-8") as f:
            _REGUA = json.load(f)
    return _REGUA


def grupo_de(caminho_deck, av=None):
    """O grupo que dá os pesos: o do bloco tier_lista do deck, senão a pasta de grupo, senão o padrão (misto)."""
    r = regua()
    g = ((av or {}).get("tier_lista") or {}).get("grupo")
    if g in r["pesos"]:
        return g
    g = os.path.basename(os.path.dirname(os.path.abspath(caminho_deck)))
    return g if g in r["pesos"] else r["grupo_padrao"]


def indice(lentes, grupo):
    p = regua()["pesos"][grupo]
    return round(sum(p[k] * lentes[k] for k in LENTES), 2)


def letra(c, grupo):
    """(índice, letra, motivos). c: a avaliação da carta, com lentes, travas e antissinergia."""
    r = regua()
    i = indice(c["lentes"], grupo)
    cz = r["cortes"]
    l = "A" if i >= cz["A"] - 0.005 else "B" if i >= cz["B"] - 0.005 else "C" if i >= cz["C"] - 0.005 else "D"
    motivos = []
    for t in c.get("travas") or []:
        teto = r["travas"][t]
        if ORDEM.index(teto) > ORDEM.index(l):
            l = teto
            motivos.append("teto %s: %s" % (teto, t))
    s = r["portao_s"]
    anti = r["antissinergia"]
    if (i >= s["indice"] - 0.005 and min(c["lentes"].values()) >= s["lente_minima"] and not (c.get("travas") or [])
            and anti.index(c.get("antissinergia") or "nenhuma") <= anti.index(s["antissinergia_maxima"])):
        l = "S"
    return i, l, motivos


def conferir(c, quem, grupo):
    """None, ou a frase do que está errado na tier list da carta. Carta sem lentes ainda não passou pelo método: vale a letra antiga."""
    if "lentes" not in c:
        return None
    r = regua()
    L = c["lentes"]
    if not isinstance(L, dict) or sorted(L) != sorted(LENTES) or any(not isinstance(v, int) or isinstance(v, bool) or not 0 <= v <= 3 for v in L.values()):
        return "%s: 'lentes' pede E, I, T, Q e R, cada uma de 0 a 3" % quem
    w = c.get("lentes_por_que") or {}
    falta = [k for k in LENTES if not str(w.get(k) or "").strip()]
    if falta:
        return "%s: lente sem a frase de porquê (%s)" % (quem, ", ".join(falta))
    if c.get("funcao") not in r["funcoes"]:
        return "%s: função %r; use %s" % (quem, c.get("funcao"), ", ".join(r["funcoes"]))
    if (c.get("antissinergia") or "nenhuma") not in r["antissinergia"]:
        return "%s: antissinergia %r; use %s" % (quem, c.get("antissinergia"), ", ".join(r["antissinergia"]))
    ruins = [t for t in c.get("travas") or [] if t not in r["travas"]]
    if ruins:
        return "%s: trava desconhecida (%s)" % (quem, ", ".join(ruins))
    if "substituto nomeado melhor" in (c.get("travas") or []) and not str(c.get("substituto") or "").strip():
        return "%s: a trava de substituto pede o nome da carta em 'substituto'" % quem
    if c.get("confianca") is not None and c["confianca"] not in r["confianca"]:
        return "%s: confiança %r; use %s" % (quem, c["confianca"], ", ".join(r["confianca"]))
    i, l, _ = letra(c, grupo)
    if c.get("tier") != l:
        return "%s: tier %s, mas as lentes dão %s (índice %s); a letra sai da régua, não se escolhe" % (quem, c.get("tier"), l, ("%.2f" % i).replace(".", ","))
    if l == "S":
        args = c.get("argumentos_s") or []
        if len(args) != r["portao_s"]["argumentos"] or any(not str(a).strip() for a in args):
            return "%s: tier S pede os três argumentos escritos em 'argumentos_s'" % quem
    return None


def para_painel(c, grupo):
    """O que a gaveta da carta mostra: função, as cinco notas com a frase, o índice e o que segurou ou soltou a letra."""
    if "lentes" not in c:
        return None
    i, l, motivos = letra(c, grupo)
    d = dict(f=c["funcao"], l=[c["lentes"][k] for k in LENTES], w=[c["lentes_por_que"][k] for k in LENTES], ix=i)
    if (c.get("antissinergia") or "nenhuma") != "nenhuma":
        d["an"] = c["antissinergia"]
    if motivos:
        d["tv"] = motivos
    if c.get("substituto"):
        d["sub"] = c["substituto"]
    if c.get("confianca") and c["confianca"] != "alta":
        d["cf"] = c["confianca"]
    if c.get("argumentos_s"):
        d["args"] = c["argumentos_s"]
    if c.get("tier_anterior") and c["tier_anterior"] != l:
        d["ta"] = c["tier_anterior"]
    return d


def bloco_painel(av, grupo):
    """A régua que o painel mostra: nomes das lentes e das funções, pesos do grupo, limites, e a conta e as decisões do deck."""
    t = av.get("tier_lista")
    if not t:
        return None
    r = regua()
    return dict(grupo=grupo, lentes=r["lentes"], funcoes=r["funcoes"], pesos=[r["pesos"][grupo][k] for k in LENTES], cortes=r["cortes"],
                s=r["portao_s"]["indice"], conta=t.get("conta"), decisoes=t.get("decisoes") or [], feito=t.get("feito"))


# ---------------------------------------------------------------- comando

def _ler_deck(pasta):
    sys.path.insert(0, MOTOR)
    import caixa
    return caixa._ler_av(pasta)


def aplicar(pasta, arquivo, gravar, avisar=print):
    import dados
    caminho, av, recuo, fim = _ler_deck(pasta)
    with open(arquivo, encoding="utf-8") as f:
        novo = json.load(f)
    grupo = grupo_de(os.path.dirname(caminho), dict(tier_lista=dict(grupo=novo.get("grupo"))))
    cartas = av["cartas"]
    lista = dados.ler_decklist(os.path.join(os.path.dirname(caminho), "decklist.txt"))
    cmds = {e["name"] for e in lista if e["cmd"]}
    qtd = {e["name"]: e["q"] for e in lista}
    falta = sorted(set(cartas) - cmds - set(novo["cartas"]))
    sobra = sorted(set(novo["cartas"]) - (set(cartas) - cmds))
    if falta or sobra:
        raise SystemExit("nada gravado: faltam %s; sobram %s" % (falta, sobra))
    erros, antes, depois = [], collections.Counter(), collections.Counter()
    pets = set(novo.get("estimacao") or [])
    for n, x in novo["cartas"].items():
        c = cartas[n]
        antes[c["tier"]] += qtd.get(n, 1)
        c.setdefault("tier_anterior", c["tier"])
        for k in ("funcao", "lentes", "lentes_por_que"):
            c[k] = x.get(k)
        c["antissinergia"] = x.get("antissinergia") or "nenhuma"
        for k in ("travas", "substituto", "confianca", "argumentos_s"):
            if x.get(k):
                c[k] = x[k]
            else:
                c.pop(k, None)
        try:
            c["indice"], c["tier"], _ = letra(c, grupo)
        except Exception as e:   # lente faltando ou trava fora da régua: o conferir diz qual
            c["tier"] = None
        if c["tier"] != "S":
            c.pop("argumentos_s", None)
        if "estimacao" in novo:
            if n in pets:
                c["fora_do_corte"] = True
            else:
                c.pop("fora_do_corte", None)
        e = conferir(c, n, grupo)
        if e:
            erros.append(e)
        else:
            depois[c["tier"]] += qtd.get(n, 1)
    if erros:
        raise SystemExit("nada gravado:\n  " + "\n  ".join(erros))
    import datetime
    av["tier_lista"] = dict(versao=regua()["versao"], feito=novo.get("feito") or datetime.date.today().isoformat(),
                            grupo=grupo, conta=novo.get("conta"), decisoes=novo.get("decisoes") or [])
    avisar("antes : " + "  ".join("%s %d" % (k, antes[k]) for k in ORDEM))
    avisar("depois: " + "  ".join("%s %d" % (k, depois[k]) for k in ORDEM))
    if gravar:
        with open(caminho, "w", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(av, ensure_ascii=False, indent=recuo) + ("\n" if fim else ""))
        avisar("gravado: " + pasta)
    else:
        avisar("conferido: %s; nada gravado" % pasta)


def mostrar(pasta, avisar=print):
    caminho, av, _, _ = _ler_deck(pasta)
    grupo = grupo_de(os.path.dirname(caminho), av)
    r = regua()
    com = {n: c for n, c in av["cartas"].items() if "lentes" in c}
    if not com:
        avisar("%s: ainda sem tier list pelo método novo" % pasta)
        return
    avisar("%s · grupo %s · pesos %s" % (pasta, grupo, " ".join("%s %d%%" % (k, round(r["pesos"][grupo][k] * 100)) for k in LENTES)))
    for l in ORDEM:
        for n, c in sorted(com.items(), key=lambda kv: -indice(kv[1]["lentes"], grupo)):
            i, lt, motivos = letra(c, grupo)
            if lt != l:
                continue
            avisar("%s %s  %s  %-14s %s%s%s" % (l, ("%.2f" % i).replace(".", ","), " ".join("%s%d" % (k, c["lentes"][k]) for k in LENTES), c["funcao"], n,
                                               " | " + "; ".join(motivos) if motivos else "", " | sub: " + c["substituto"] if c.get("substituto") else ""))
    erros = [e for e in (conferir(c, n, grupo) for n, c in com.items()) if e]
    avisar("erros: %s" % (erros or "nenhum"))


def main():
    a = sys.argv[1:]
    if len(a) >= 2 and a[0] == "--deck":
        if len(a) == 2:
            return mostrar(a[1])
        if len(a) == 4 and a[2] in ("--conferir", "--gravar"):
            return aplicar(a[1], a[3], a[2] == "--gravar")
    raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
