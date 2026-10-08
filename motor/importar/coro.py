# -*- coding: utf-8 -*-
"""Converte a avaliação do kit do Coro da Alvorada (dados/evals.py) para o contrato do motor.

Uso único, registrado para auditoria:

    python motor/importar/coro.py "dados/01. Giada/entrada/kit-coro-da-alvorada2" "01. Giada"

Lê o kit sem gravar nada nele. Não reavalia: notas, tiers, relevâncias, textos e vereditos passam como estão.
O que o kit decidia com comparações entre agrupamentos (ramp x compra x proteção, densidade tribal x ganho de
vida) virou leituras separadas e mais simples: são bulletins a mais, não menos informação, só sem a frase que
cruzava dois números numa só. Isso está registrado no relatório da migração, não só aqui.
"""
import importlib.util, json, os, re, sys

sys.dont_write_bytecode = True
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

CHAVES = ["ramp", "draw", "removal", "protecao", "buff", "tokens", "sinergia", "especial"]


def carregar(caminho, nome):
    spec = importlib.util.spec_from_file_location(nome, caminho)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def notas(vetor):
    return {k: v for k, v in zip(CHAVES, vetor) if v}


def marcas(a):
    m = {}
    if a.get("gain"):
        m["ganho"] = 1
    if a.get("pay"):
        m["paga"] = 1
    if a.get("alt"):
        m["alt"] = 1
    return m


def carta(a, radar=False):
    d = {"notas": notas(a["s"]), "tier": a["tier"], "rel": a["rel"]}
    if radar:
        d["veredito"] = a["verdict"]
        if a.get("sai"):
            d["sai"] = a["sai"]
    d["faz"] = a["fx"]
    d["porque"] = a["why"]
    if a.get("wipe"):
        d["massa"] = 1
    if a.get("spot"):
        d["pontual"] = 1
    if a.get("tapped"):
        d["virado"] = 1
    if a.get("prod"):
        d["gera"] = a["prod"]
    mk = marcas(a)
    if mk:
        d["marcas"] = mk
    return d


def conv_decklist(linhas):
    out, i = [], 0
    for l in linhas:
        l = l.strip()
        if not l:
            continue
        m = re.match(r"(\d+) (.+?) \((\S+)\) (\S+)( F)?$", l)
        q, name, setc, num, foil = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
        flags = (" *CMDR*" if i == 0 else "") + (" *F*" if foil else "")
        out.append("%s %s (%s) %s%s" % (q, name, setc, num, flags))
        i += 1
    return out


def main(kit, pasta):
    ev = carregar(os.path.join(kit, "dados", "evals.py"), "evals_coro")
    destino = os.path.join(RAIZ, "dados", pasta)

    with open(os.path.join(kit, "dados", "decklist.txt"), encoding="utf-8") as f:
        linhas = conv_decklist(f.readlines())
    with open(os.path.join(destino, "decklist.txt"), "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(linhas) + "\n")

    avaliacao = {
        "feito": "07/10/2026",
        "agrupamentos": [
            {"k": "ramp", "nome": "Ramp", "ab": "Ramp", "ref": [10, 12], "desc": "Pedras de mana, mana extra e redutores de custo."},
            {"k": "draw", "nome": "Draw", "ab": "Draw", "ref": [10, 12], "desc": "Compra e vantagem de cartas."},
            {"k": "removal", "nome": "Removal", "ab": "Rem.", "ref": [8, 12], "desc": "Remoção pontual e em massa: destruir, exilar, neutralizar."},
            {"k": "protecao", "nome": "Proteção", "ab": "Prot.", "desc": "Indestrutível, resistência a magia, sair de fase e proteção contra cores ou tipos."},
            {"k": "buff", "nome": "Buff", "ab": "Buff", "desc": "Lordes, marcadores +1/+1 e habilidades de combate para o time."},
            {"k": "tokens", "nome": "Token", "ab": "Tok.", "desc": "Geradores e multiplicadores de fichas."},
            {"k": "sinergia", "nome": "Sinergia", "ab": "Sin.", "pet": True, "desc": "Ligação direta com a Giada e com a tribo: ser Anjo, citar Anjos ou alimentar o motor de vida. Marcar a carta como PetCard soma 1 ponto."},
            {"k": "especial", "nome": "Especial", "ab": "Esp.", "desc": "Tax, condições de vitória e recorrência."},
        ],
        "marcadores": {
            "tribo": {"nome": "Anjo", "plural": "Anjos", "subtipo": "Angel"},
            "ganho": {"nome": "Fonte de ganho de vida"},
            "paga": {"nome": "Carta que paga por ganho de vida"},
            "alt": {"nome": "Quase nunca custa o valor impresso"},
        },
        "leituras": [
            {"tipo": "terrenos", "min": 35},
            {"tipo": "agrupamento", "g": "ramp", "min": 10, "rotulo": ["carta de ramp dedicada", "cartas de ramp dedicadas"],
             "passagem": "que aceleram de passagem", "alerta": "Uma ou duas pedras de mana a mais ajudariam."},
            {"tipo": "agrupamento", "g": "draw", "min": 10, "rotulo": ["fonte de compra dedicada", "fontes de compra dedicadas"],
             "passagem": "incidentais"},
            {"tipo": "remocao", "g": "removal", "massa_max": 5, "massa_ref": [3, 5]},
            {"tipo": "agrupamento", "g": "protecao", "rotulo": ["peça de proteção", "peças de proteção"], "passagem": "de passagem"},
            {"tipo": "tribo", "min_pct": 75, "texto": "lordes, marcadores e o vínculo com a vida do time quase sempre têm alvo."},
            {"tipo": "proporcao", "a": "ganho", "b": "paga", "fator": 1.5,
             "rotulo": ["fonte de ganho de vida", "fontes de ganho de vida"], "rotulo_b": ["carta que paga por isso", "cartas que pagam por isso"],
             "ok": "o motor raramente fica sem combustível.", "alerta": "é pouco, e vínculo com a vida no time resolve."},
            {"tipo": "curva", "cmc_max": 3.6, "topo_max": 15, "alerta": "sem a Giada ou um redutor em campo, a mão trava."},
            {"tipo": "contagem", "marcador": "alt", "listar": True,
             "rotulo": ["carta quase nunca custa o valor impresso", "cartas quase nunca custam o valor impresso"]},
        ],
        "cartas": {c["n"]: carta(c) for c in ev.CARDS},
        "radar": {c["n"]: carta(c, radar=True) for c in ev.CANDS},
        "combos": [{"nome": x["n"], "tipo": x["kind"], "pecas": list(x["p"]), "texto": x["t"]} for x in ev.COMBOS],
    }

    comunidade = {
        "fonte": ev.EDH["fonte"], "url": ev.EDH["url"], "lido": ev.EDH["lido"], "pagina": "Anjos da Giada",
        "temas": [list(x) for x in ev.EDH["temas"]],
        "listas": [{"k": l["k"], "n": l["n"], "cards": list(l["cards"])} for l in ev.EDH["listas"] if l["k"] != "gc"],
        "sinergia": dict(ev.EDHWIKI),
        "potenciais": [{"nome": n, "sinergia": s, "novo": n in ev.NOVAS} for n, s in ev.POOL],
    }

    for nome, obj in (("avaliacao.json", avaliacao), ("comunidade.json", comunidade)):
        with open(os.path.join(destino, nome), "w", encoding="utf-8", newline="\n") as f:
            json.dump(obj, f, ensure_ascii=False, indent=1)
            f.write("\n")
    print("decklist:", len(linhas), "linhas | gravado:", len(avaliacao["cartas"]), "cartas,", len(avaliacao["radar"]),
          "no radar,", len(avaliacao["combos"]), "combos,", len(comunidade["sinergia"]), "sinergias,", len(comunidade["potenciais"]), "potenciais")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("uso: python motor/importar/coro.py <kit> <pasta do deck>")
    main(os.path.abspath(sys.argv[1]), sys.argv[2])
