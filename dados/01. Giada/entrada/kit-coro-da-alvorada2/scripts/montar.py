# -*- coding: utf-8 -*-
"""Monta o HTML único: src/template_head.html + fontes embutidas + dados/D.json + arte da comandante + src/template_body.js.

Uso:
  python3 scripts/montar.py                 # grava dist/coro-da-alvorada.html (imagens das cartas vêm do Scryfall, pela internet)
  python3 scripts/montar.py --conferir      # monta em memória e compara com o arquivo de dist/
  python3 scripts/montar.py --imagens       # grava dist/coro-da-alvorada-com-imagens.html, com as imagens de imagens/cartas/ embutidas
  python3 scripts/montar.py --publicar      # grava dist/coro-da-alvorada-publicado.html: não tenta buscar nada de outros sites
  python3 scripts/montar.py --saida outro.html
A pasta imagens/cartas/ é criada por scripts/baixar_imagens.py. A versão com imagens abre sem internet e pode ser publicada.
Página publicada não carrega imagens de outros sites: para publicar com as cartas, use --imagens; sem elas, --publicar.
"""
import base64, hashlib, json, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# ordem e nomes das faces: precisam bater com as pilhas --fd e --fb do CSS
FONTES = [("Cormorant Unicase", 700, "normal"), ("Alegreya Sans", 400, "normal"), ("Alegreya Sans", 400, "italic"),
          ("Alegreya Sans", 500, "normal"), ("Alegreya Sans", 700, "normal"), ("Alegreya Sans", 800, "normal")]
MIME = {"webp": "image/webp", "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png"}


def uri(arq):
    return "data:%s;base64,%s" % (MIME[arq.rsplit(".", 1)[1].lower()], base64.b64encode(open(arq, "rb").read()).decode())


def css_fontes():
    faces = []
    for familia, peso, estilo in FONTES:
        arq = os.path.join(RAIZ, "fontes", "%s-latin-%d-%s.woff2" % (familia.lower().replace(" ", "-"), peso, estilo))
        if not os.path.exists(arq):          # sem o arquivo, a página cai nas fontes de reserva do CSS
            print("aviso: fonte ausente,", os.path.basename(arq)); continue
        b64 = base64.b64encode(open(arq, "rb").read()).decode()
        faces.append("@font-face{font-family:'%s';font-style:%s;font-weight:%d;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % (familia, estilo, peso, b64))
    return "\n".join(faces)


def arte():
    """Arte da comandante no herói: imagens/giada-arte.webp (ou .jpg, .png). Sem o arquivo, o herói fica só com a placa."""
    for ext in ("webp", "jpg", "png"):
        arq = os.path.join(RAIZ, "imagens", "giada-arte." + ext)
        if os.path.exists(arq):
            return uri(arq)
    print("aviso: arte da comandante ausente em imagens/"); return ""


def pacote(ids):
    """Imagens das cartas para embutir: imagens/cartas/<id>.webp|jpg e <id>.back.webp|jpg, mais creditos.json (id -> ilustrador)."""
    pasta = os.path.join(RAIZ, "imagens", "cartas"); pac = {}
    for a in sorted(os.listdir(pasta)) if os.path.isdir(pasta) else []:
        m = re.match(r"^(.+?)(\.back)?\.(webp|jpe?g|png)$", a, re.I)
        if m and m.group(1) in ids:
            pac[m.group(1) + ("|b" if m.group(2) else "")] = uri(os.path.join(pasta, a))
    cred = os.path.join(pasta, "creditos.json")
    cred = {k: v for k, v in json.load(open(cred, encoding="utf-8")).items() if k in ids} if os.path.exists(cred) else {}
    return pac, cred


def montar(imagens=False, publicar=False):
    ler = lambda *p: open(os.path.join(RAIZ, *p), encoding="utf-8").read()
    head, corpo, dados = ler("src", "template_head.html"), ler("src", "template_body.js"), ler("dados", "D.json")
    assert head.count("/*__FONTS__*/") == 1
    assert "</script" not in dados.lower() and "\u2028" not in dados and "\u2029" not in dados
    pac, cred = None, None
    if imagens:
        D = json.loads(dados)
        pac, cred = pacote({c["id"] for c in D["cards"] + D["cands"]})
        assert pac, "nenhuma imagem em imagens/cartas/: rode antes scripts/baixar_imagens.py"
        print("imagens embutidas: %d arquivos de %d cartas" % (len(pac), len({k.split('|')[0] for k in pac})))
    js = lambda v: json.dumps(v, ensure_ascii=False, separators=(",", ":"))
    return (head.replace("/*__FONTS__*/", css_fontes()) + "<script>\n(function () {\n'use strict';\n\nvar D = " + dados + ";\nvar ART = " + js(arte()) +
            ";\nvar PACK = " + js(pac) + ";\nvar CRED = " + js(cred) + ";\nvar PUB = " + js(bool(publicar)) + ";\n" + corpo + "})();\n\n</script>\n</body>\n</html>\n")


if __name__ == "__main__":
    conferir = "--conferir" in sys.argv
    com, pub = "--imagens" in sys.argv and not conferir, "--publicar" in sys.argv and not conferir
    html = montar(com, pub).encode("utf-8")
    destino = os.path.join(RAIZ, "dist", "coro-da-alvorada" + ("-com-imagens" if com else "") + ("-publicado" if pub else "") + ".html")
    if "--saida" in sys.argv:
        destino = sys.argv[sys.argv.index("--saida") + 1]
    if conferir:
        destino = os.path.join(RAIZ, "dist", "coro-da-alvorada.html")
        atual = open(destino, "rb").read()
        igual = atual == html
        print("IDÊNTICO" if igual else "DIFERENTE", "|", len(html), "bytes | sha256", hashlib.sha256(html).hexdigest()[:16])
        sys.exit(0 if igual else 1)
    os.makedirs(os.path.dirname(os.path.abspath(destino)), exist_ok=True)
    open(destino, "wb").write(html)
    print("gravado:", destino, len(html), "bytes | sha256", hashlib.sha256(html).hexdigest()[:16])
