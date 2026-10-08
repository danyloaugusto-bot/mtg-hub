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
