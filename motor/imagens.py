# -*- coding: utf-8 -*-
"""Baixa, uma vez, as imagens das cartas do deck e do radar, e as reduz para embutir nos painéis.

    python motor/imagens.py --deck "02. Clavileno"
    python motor/imagens.py --todos

O cache fica em cache/img/<set>-<numero>.jpg (verso com sufixo -verso) e é compartilhado entre decks:
Sol Ring baixada por um deck já serve para todos os outros. Carta já no cache não é baixada de novo.
A capa usa o capa.* da pasta; sem ele, baixa o art_crop do comandante como capa.jpg.
"""
import argparse, io, os, sys, time, urllib.error, urllib.request

sys.dont_write_bytecode = True
MOTOR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, MOTOR)

import dados  # noqa: E402

RAIZ = os.path.dirname(MOTOR)
CACHE_IMG = os.path.join(RAIZ, "cache", "img")
CDN = "https://cards.scryfall.io/"
UA = "mtg-hub-pessoal/1.0"
LARGURA = 340
QUALIDADE = 82


def cdn_url(sid, face):
    return "%snormal/%s/%s/%s/%s.jpg" % (CDN, face, sid[0], sid[1], sid)


def baixar(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for tentativa in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 429 and tentativa < 2:
                time.sleep(1.5 * (tentativa + 1))
                continue
            raise dados.ErroDeck("Scryfall respondeu %s para %s" % (e.code, url))
        except urllib.error.URLError as e:
            raise dados.ErroDeck("sem acesso ao Scryfall (%s)" % e.reason)


def reduzir(bruto, largura=LARGURA):
    from PIL import Image
    im = Image.open(io.BytesIO(bruto)).convert("RGB")
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=QUALIDADE, optimize=True, progressive=True)
    return buf.getvalue()


def decks_alvo(nomes):
    if nomes != ["todos"]:
        return nomes
    out = []
    for n in sorted(os.listdir(dados.DADOS)):
        if n.startswith(("_", ".")) or not os.path.isdir(os.path.join(dados.DADOS, n)):
            continue
        if os.path.exists(os.path.join(dados.DADOS, n, "avaliacao.json")):
            out.append(n)
    return out


def precisa(c):
    """(arquivo frente, arquivo verso ou None) para uma carta já montada pelo motor."""
    base = "%s-%s" % (c["iset"].lower(), str(c["inum"]).lower())
    verso = base + "-verso" if c.get("iback") else None
    return base + ".jpg", (verso + ".jpg" if verso else None)


def main():
    ap = argparse.ArgumentParser(description="Baixa e reduz as imagens das cartas.")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--deck", help="pasta do deck")
    g.add_argument("--todos", action="store_true")
    a = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    os.makedirs(CACHE_IMG, exist_ok=True)

    alvos = decks_alvo(["todos"] if a.todos else [a.deck])
    if not alvos:
        sys.exit("nenhum deck com avaliacao.json encontrado")

    # uma lista única de impressões, compartilhada entre todos os decks do alvo
    precisam = {}  # arquivo -> (sid, face)
    for pasta in alvos:
        try:
            d = dados.montar(pasta, avisar=lambda *x: None)
        except dados.ErroDeck as e:
            print("%s: ERRO ao ler os dados: %s" % (pasta, e), file=sys.stderr)
            continue
        for c in d["cards"] + d["cands"]:
            fa, ve = precisa(c)
            precisam[fa] = (c["sid"], "front")
            if ve:
                precisam[ve] = (c["sid"], "back")

    ja = {f for f in precisam if os.path.exists(os.path.join(CACHE_IMG, f))}
    faltam = sorted(set(precisam) - ja)
    print("%d impressões ao todo | %d já no cache | %d para baixar" % (len(precisam), len(ja), len(faltam)))
    for i, arq in enumerate(faltam):
        sid, face = precisam[arq]
        bruto = baixar(cdn_url(sid, face))
        with open(os.path.join(CACHE_IMG, arq), "wb") as f:
            f.write(reduzir(bruto))
        if (i + 1) % 20 == 0 or i + 1 == len(faltam):
            print("  %d/%d" % (i + 1, len(faltam)))
        time.sleep(0.1)

    # capa de cada deck, se faltar
    for pasta in alvos:
        base = os.path.join(dados.DADOS, pasta)
        tem = any(f.lower().startswith("capa.") for f in os.listdir(base))
        if tem:
            continue
        try:
            d = dados.montar(pasta, avisar=lambda *x: None)
        except dados.ErroDeck:
            continue
        cmd = next((c for c in d["cards"] if c.get("cmd")), None)
        if not cmd:
            continue
        print("%s: sem capa.*, baixando a arte do comandante" % pasta)
        url = cdn_url(cmd["sid"], "front").replace("/normal/", "/art_crop/")
        bruto = baixar(url)
        with open(os.path.join(base, "capa.jpg"), "wb") as f:
            f.write(bruto)
        time.sleep(0.1)

    print("pronto.")


if __name__ == "__main__":
    main()
