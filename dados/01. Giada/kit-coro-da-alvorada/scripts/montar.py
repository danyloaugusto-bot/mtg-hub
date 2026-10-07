# -*- coding: utf-8 -*-
"""Monta o HTML único: src/template_head.html + fontes embutidas + dados/D.json + src/template_body.js.

Uso:
  python3 scripts/montar.py                 # grava dist/coro-da-alvorada.html
  python3 scripts/montar.py --conferir      # monta em memória e compara com o arquivo de dist/
  python3 scripts/montar.py --saida outro.html
"""
import base64, hashlib, os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# ordem e nomes das faces: precisam bater com as pilhas --fd e --fb do CSS
FONTES = [("Cormorant Unicase", 700, "normal"), ("Alegreya Sans", 400, "normal"), ("Alegreya Sans", 400, "italic"),
          ("Alegreya Sans", 500, "normal"), ("Alegreya Sans", 700, "normal"), ("Alegreya Sans", 800, "normal")]


def css_fontes():
    faces = []
    for familia, peso, estilo in FONTES:
        arq = os.path.join(RAIZ, "fontes", "%s-latin-%d-%s.woff2" % (familia.lower().replace(" ", "-"), peso, estilo))
        if not os.path.exists(arq):          # sem o arquivo, a página cai nas fontes de reserva do CSS
            print("aviso: fonte ausente,", os.path.basename(arq)); continue
        b64 = base64.b64encode(open(arq, "rb").read()).decode()
        faces.append("@font-face{font-family:'%s';font-style:%s;font-weight:%d;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % (familia, estilo, peso, b64))
    return "\n".join(faces)


def montar():
    ler = lambda *p: open(os.path.join(RAIZ, *p), encoding="utf-8").read()
    head, corpo, dados = ler("src", "template_head.html"), ler("src", "template_body.js"), ler("dados", "D.json")
    assert head.count("/*__FONTS__*/") == 1
    assert "</script" not in dados.lower() and "\u2028" not in dados and "\u2029" not in dados
    return head.replace("/*__FONTS__*/", css_fontes()) + "<script>\n(function () {\n'use strict';\n\nvar D = " + dados + ";\n" + corpo + "})();\n\n</script>\n</body>\n</html>\n"


if __name__ == "__main__":
    html = montar().encode("utf-8")
    destino = os.path.join(RAIZ, "dist", "coro-da-alvorada.html")
    if "--saida" in sys.argv:
        destino = sys.argv[sys.argv.index("--saida") + 1]
    if "--conferir" in sys.argv:
        atual = open(destino, "rb").read()
        igual = atual == html
        print("IDÊNTICO" if igual else "DIFERENTE", "|", len(html), "bytes | sha256", hashlib.sha256(html).hexdigest()[:16])
        sys.exit(0 if igual else 1)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    open(destino, "wb").write(html)
    print("gravado:", destino, len(html), "bytes | sha256", hashlib.sha256(html).hexdigest()[:16])
