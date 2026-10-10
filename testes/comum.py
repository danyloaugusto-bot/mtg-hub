# -*- coding: utf-8 -*-
"""O que os testes compartilham: escolher o deck, achar (ou montar) o HTML e registrar o resultado."""
import argparse, json, os, subprocess, sys

sys.dont_write_bytecode = True
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOTOR = os.path.join(RAIZ, "motor")
sys.path.insert(0, MOTOR)
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def argumentos(descricao, extra=None):
    ap = argparse.ArgumentParser(description=descricao)
    ap.add_argument("--deck", default="02. Clavileño", help="pasta do deck em dados/")
    ap.add_argument("--sem-montar", action="store_true", help="usa o HTML que já está em saidas/, sem montar de novo")
    if extra:
        extra(ap)
    return ap.parse_args()


def html(pasta, montar=True):
    caminho = os.path.join(RAIZ, "saidas", pasta + ".html")
    if montar or not os.path.exists(caminho):
        r = subprocess.run([sys.executable, "-B", os.path.join(MOTOR, "build.py"), "--deck", pasta], capture_output=True, text=True, encoding="utf-8")
        if r.returncode:
            sys.exit("o build falhou:\n" + r.stdout + r.stderr)
    return caminho


def url(caminho):
    return "file:///" + os.path.abspath(caminho).replace("\\", "/")


def controle(pasta):
    p = os.path.join(RAIZ, "testes", "controle", pasta + ".json")
    if os.path.exists(p):
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    return {}


def custo_baixo(m):
    """Conta independente, em Python, das trocas do radar que baixam o custo sem perder o papel (a regra da Visão geral
    e do Dashboard): devolve quantas são, uma por carta que sai, e o CMC médio do deck com todas elas."""
    G = [g["k"] for g in m["grupos"]]
    TR = "SABCD"

    def pk(c):
        if c.get("land") or c.get("mdfc"):
            return "mana"
        if c.get("pk0"):
            return c["pk0"]
        b, bi = 0, -1
        for i, v in enumerate(c.get("s") or []):
            if v > b:
                b, bi = v, i
        return G[bi] if bi >= 0 else "sem"

    def x(c):
        return "{X}" in (c.get("cost") or "")

    idx = {c["id"]: c for c in m["cards"]}
    melhor = {}
    for c in m["cands"]:
        s = idx.get(c.get("sai"))
        if c["verdict"] == "fora" or not s or s.get("cpd") or any(k.get("land") or k.get("mdfc") or x(k) for k in (c, s)):
            continue
        d, k = s["cmc"] - c["cmc"], pk(s)
        if d < 1 or k not in G or pk(c) != k or bool(c.get("wipe")) != bool(s.get("wipe")) or c["s"][G.index(k)] < s["s"][G.index(k)] or TR.index(c["tier"]) > TR.index(s["tier"]):
            continue
        if d > melhor.get(s["id"], (0, None))[0]:
            melhor[s["id"]] = (d, c)
    cs = [c for c in m["cards"] if c["id"] not in melhor] + [v[1] for v in melhor.values()]
    nl = [c for c in cs if not c.get("land")]
    return len(melhor), sum(c["cmc"] * c.get("q", 1) for c in nl) / sum(c.get("q", 1) for c in nl)


class Relatorio:
    def __init__(self, titulo):
        self.titulo, self.linhas, self.falhas, self.erros = titulo, [], 0, []

    def ok(self, nome, cond, extra=""):
        if not cond:
            self.falhas += 1
        self.linhas.append(("OK    " if cond else "FALHA ") + nome + (" | " + str(extra) if extra != "" else ""))

    def nota(self, texto):
        self.linhas.append("       " + texto)

    def fim(self):
        print("== " + self.titulo)
        print("\n".join(self.linhas))
        print("erros de página:", self.erros)
        n = sum(1 for l in self.linhas if l.startswith(("OK", "FALHA")))
        print("resultado: %d de %d" % (n - self.falhas, n) + ("" if not (self.falhas or self.erros) else "  <- há falhas"))
        sys.exit(1 if (self.falhas or self.erros) else 0)


def bloquear_rede(pg):
    pg.route("**/*", lambda r: r.abort() if r.request.url.startswith("http") else r.continue_())
