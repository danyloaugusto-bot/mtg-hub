# -*- coding: utf-8 -*-
"""Converte a avaliação de um kit no formato do Ritos de Sangue (annot.py e edh.py) para o contrato do motor.

Uso único, registrado aqui para que a migração do Clavileño possa ser refeita e auditada:

    python motor/importar/ritos.py contexto/origem/ritos-de-sangue-kit "02. Clavileño"

Lê o kit sem gravar nada nele (nem __pycache__) e escreve avaliacao.json e comunidade.json em dados/<pasta>/.
Não reavalia: notas, tiers, relevâncias, textos, vereditos e combos passam como estão.
"""
import importlib.util, json, os, sys

sys.dont_write_bytecode = True
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Ordem do vetor s no annot.py do Ritos
CHAVES = ["ramp", "draw", "removal", "recursao", "sacrifice", "tokens", "sinergia", "especial"]


def carregar(caminho, nome):
    spec = importlib.util.spec_from_file_location(nome, caminho)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def notas(vetor):
    return {k: v for k, v in zip(CHAVES, vetor) if v}


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
    if a.get("tapped"):
        d["virado"] = 1
    if a.get("prod"):
        d["gera"] = a["prod"]
    if a.get("pri"):
        d["prioridade"] = a["pri"]
    marcas = {}
    if a.get("outlet"):
        marcas["saida"] = a["outlet"]
    if a.get("drain"):
        marcas["dreno"] = 1
    if marcas:
        d["marcas"] = marcas
    return d


def main(kit, pasta):
    annot = carregar(os.path.join(kit, "annot.py"), "annot_ritos")
    edh = carregar(os.path.join(kit, "edh.py"), "edh_ritos")
    destino = os.path.join(RAIZ, "dados", pasta)

    avaliacao = {
        "feito": "07/10/2026",
        "agrupamentos": [
            {"k": "ramp", "nome": "Ramp", "ab": "Ramp", "ref": [10, 12],
             "desc": "Pedras de mana, mana extra e redutores de custo. Terreno que sempre entra virado vale −1, como na sua planilha."},
            {"k": "draw", "nome": "Draw", "ab": "Draw", "ref": [10, 12], "desc": "Compra e vantagem de cartas."},
            {"k": "removal", "nome": "Removal", "ab": "Rem.", "ref": [8, 12], "desc": "Remoção pontual e em massa: destruir, exilar, −X/−X."},
            {"k": "recursao", "nome": "Recursão", "ab": "Rec.", "ref": [6, 10], "desc": "Volta do cemitério: reanimação e cartas que retornam sozinhas."},
            {"k": "sacrifice", "nome": "Sacrifice", "ab": "Sac.", "ref": [12, 18], "desc": "Saídas de sacrifício e recompensas por morte."},
            {"k": "tokens", "nome": "Tokens", "ab": "Tok.", "ref": [8, 12], "desc": "Geradores e multiplicadores de fichas."},
            {"k": "sinergia", "nome": "Sinergia + PetCard", "curto": "Sinergia", "ab": "Sin.", "pet": True,
             "desc": "Ligação direta com o Clavileño e com a tribo. Marcar a carta como PetCard soma 1 ponto."},
            {"k": "especial", "nome": "Especial", "ab": "Esp.", "desc": "Combos, condições de vitória e motores que rendem todo turno."},
        ],
        "marcadores": {
            "tribo": {"nome": "Vampiro", "plural": "Vampiros", "subtipo": "Vampire"},
            "saida": {"nome": "Saída de sacrifício", "valores": {"1": "repetível, com custo", "2": "grátis e instantânea"}},
            "dreno": {"nome": "Converte morte em dano"},
        },
        "leituras": [
            {"tipo": "terrenos", "min": 35},
            {"tipo": "agrupamento", "g": "ramp", "min": 9, "rotulo": ["carta de ramp dedicada", "cartas de ramp dedicadas"],
             "passagem": "que aceleram de passagem", "alerta": "Uma ou duas pedras de mana a mais ajudariam."},
            {"tipo": "agrupamento", "g": "draw", "min": 9, "rotulo": ["fonte de compra dedicada", "fontes de compra dedicadas"],
             "passagem": "incidentais", "farto": {"min": 12, "texto": "Aqui o deck está bem servido."}},
            {"tipo": "remocao", "g": "removal", "massa_max": 5, "massa_ref": [3, 5],
             "alerta": "Há remoção global sobrando para um deck que quer manter a própria mesa."},
            {"tipo": "contagem", "marcador": "saida", "min": 6, "rotulo": ["saída de sacrifício repetível", "saídas de sacrifício repetíveis"],
             "texto": "{saida=2} gratuitas e instantâneas; as demais pedem mana ou virar a carta."},
            {"tipo": "contagem", "marcador": "dreno", "min": 3, "listar": True,
             "rotulo": ["carta converte morte em dano", "cartas convertem morte em dano"],
             "alerta": "O deck gera muita morte e tem poucos conversores: é a lacuna mais clara.",
             "ok": "Bom volume para fechar o jogo sem combo."},
            {"tipo": "tribo", "min_pct": 75, "texto": "lordes, Olivia’s Wrath e o gatilho do Clavileño quase sempre têm alvo."},
            {"tipo": "curva"},
        ],
        "cartas": {n: carta(a) for n, a in annot.A.items()},
        "radar": {n: carta(a, radar=True) for n, a in annot.R.items()},
        "combos": [{"nome": x["n"], "tipo": x["kind"], "pecas": list(x["p"]), "texto": x["t"]} for x in annot.COMBOS],
    }

    comunidade = {
        "fonte": "edh.wiki",
        "url": edh.URL,
        "lido": edh.DATE,
        "pagina": "Clavileño com Vampiros",
        "temas": [list(x) for x in edh.THEMES],
        "listas": [],
        "precon": {"set": "LCC", "texto": "a do pré-construído do Clavileño"},
        "sinergia": {n: v[0] for n, v in edh.E.items() if v[0] is not None},
        "potenciais": [{"nome": n, "sinergia": s} for n, s in edh.EXTRA],
    }

    for nome, obj in (("avaliacao.json", avaliacao), ("comunidade.json", comunidade)):
        with open(os.path.join(destino, nome), "w", encoding="utf-8", newline="\n") as f:
            json.dump(obj, f, ensure_ascii=False, indent=1)
            f.write("\n")
    print("gravado:", len(avaliacao["cartas"]), "cartas,", len(avaliacao["radar"]), "no radar,",
          len(avaliacao["combos"]), "combos,", len(comunidade["sinergia"]), "sinergias,", len(comunidade["potenciais"]), "potenciais")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("uso: python motor/importar/ritos.py <kit> <pasta do deck>")
    main(os.path.abspath(sys.argv[1]), sys.argv[2])
