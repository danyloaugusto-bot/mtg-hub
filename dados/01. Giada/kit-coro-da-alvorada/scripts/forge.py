# -*- coding: utf-8 -*-
"""Consulta à base aberta do Forge (github.com/Card-Forge/forge): custo, tipo, P/R e texto oficial de cada carta.

Uso:
  python3 scripts/forge.py clonar            # baixa só as pastas de cartas e de edições (~140 MB)
  python3 scripts/forge.py indexar           # monta o índice por nome (forge_idx.json)
  python3 scripts/forge.py ver "Giada, Font of Hope"
A pasta do clone é ./forge, ou a apontada pela variável FORGE_DIR.
"""
import json, os, re, subprocess, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FORGE = os.environ.get("FORGE_DIR", os.path.join(RAIZ, "forge"))
CARTAS = os.path.join(FORGE, "forge-gui", "res", "cardsfolder")
EDICOES = os.path.join(FORGE, "forge-gui", "res", "editions")
INDICE = os.path.join(RAIZ, "forge_idx.json")
CAMPOS = r"^(Name|ManaCost|Types|PT|Loyalty|Defense|Oracle|AlternateMode|MeldPair|Colors):(.*)$"


def clonar():
    if not os.path.isdir(FORGE):
        subprocess.check_call(["git", "clone", "--depth", "1", "--filter=blob:none", "--sparse",
                               "https://github.com/Card-Forge/forge.git", FORGE])
    subprocess.check_call(["git", "sparse-checkout", "set", "forge-gui/res/cardsfolder", "forge-gui/res/editions"], cwd=FORGE)


def ler(caminho):
    """Devolve as faces de um arquivo de carta (frente, e verso ou fusão quando houver)."""
    faces, atual = [], {}
    for linha in open(caminho, encoding="utf-8", errors="replace").read().split("\n"):
        linha = linha.rstrip("\r")
        if linha.strip() == "ALTERNATE" or linha.startswith("SPECIALIZE"):
            faces.append(atual); atual = {}
            continue
        m = re.match(CAMPOS, linha)
        if m:
            atual[m.group(1)] = m.group(2).strip()
    faces.append(atual)
    return faces


def indexar():
    idx = {}
    for pasta, _, arquivos in os.walk(CARTAS):
        for a in arquivos:
            if not a.endswith(".txt"):
                continue
            caminho = os.path.join(pasta, a)
            rel = os.path.relpath(caminho, CARTAS)
            for i, face in enumerate(ler(caminho)):
                nome = face.get("Name")
                if not nome:
                    continue
                ordem = (2 if rel.startswith("rebalanced") else 0) + (0 if i == 0 else 1)
                if nome.lower() not in idx or ordem < idx[nome.lower()]["ordem"]:
                    idx[nome.lower()] = {"arquivo": rel, "face": i, "ordem": ordem}
    json.dump(idx, open(INDICE, "w"))
    return idx


_idx = None
def carta(nome):
    """Face pedida e todas as faces da carta, ou None se o nome não existir na base."""
    global _idx
    if _idx is None:
        _idx = json.load(open(INDICE)) if os.path.exists(INDICE) else indexar()
    e = _idx.get(nome.lower())
    if not e:
        return None
    faces = ler(os.path.join(CARTAS, e["arquivo"]))
    return faces[e["face"]], faces


def edicoes_de(nome):
    """Coleções em papel que trazem a carta: (data, código, número)."""
    achadas = []
    for a in sorted(os.listdir(EDICOES)):
        txt = open(os.path.join(EDICOES, a), encoding="utf-8", errors="replace").read()
        cod = re.search(r"^Code=(.*)$", txt, re.M); data = re.search(r"^Date=(.*)$", txt, re.M); tipo = re.search(r"^Type=(.*)$", txt, re.M)
        if not (cod and data) or (tipo and tipo.group(1).strip() == "Online"):
            continue
        for linha in txt.split("\n"):
            m = re.match(r"^(\S+)\s+[CURMLSTB]\s+(.+?)(\s+@.*)?$", linha.strip())
            if m and m.group(2).strip() == nome:
                achadas.append((data.group(1).strip(), cod.group(1).strip(), m.group(1)))
    return sorted(achadas)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "clonar":
        clonar()
    elif cmd == "indexar":
        print(len(indexar()), "nomes indexados")
    elif cmd == "ver":
        r = carta(sys.argv[2])
        if not r:
            sys.exit("não achei: " + sys.argv[2])
        for f in r[1]:
            print(f.get("Name"), "|", f.get("ManaCost"), "|", f.get("Types"), "|", f.get("PT", f.get("Defense", "-")))
            print("   ", (f.get("Oracle") or "").replace("\\n", " / "))
        print("edições:", edicoes_de(r[0]["Name"])[:6])
    else:
        print(__doc__)
