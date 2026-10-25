# -*- coding: utf-8 -*-
"""Baixa, uma vez, as imagens das cartas do deck e do radar, e as reduz para embutir nos painéis.

    python motor/imagens.py --deck "02. Clavileño"
    python motor/imagens.py --todos
    python motor/imagens.py --grimorio     # o que falta no cache para as cartas do Grimório (dados/grimorio/grimorio.json)

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


def reduzir(bruto, largura=LARGURA, qualidade=QUALIDADE):
    from PIL import Image
    im = Image.open(io.BytesIO(bruto)).convert("RGB")
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=qualidade, optimize=True, progressive=True)
    return buf.getvalue()


# a versão grande (672 px, a "large" do Scryfall), sem redução, para as páginas que publicam as imagens em arquivos à parte
# (os Ciclos): cache/img-grande/<set>-<numero>.jpg, separado do cache/img de 340 px que os painéis embutem
CACHE_GRANDE = os.path.join(RAIZ, "cache", "img-grande")


def baixar_grandes(precisam, avisar=print):
    """precisam: {arquivo: (id do Scryfall, "front" ou "back")}. Baixa a "large" de cada uma que ainda não está em cache/img-grande/."""
    os.makedirs(CACHE_GRANDE, exist_ok=True)
    faltam = sorted(f for f in precisam if not os.path.exists(os.path.join(CACHE_GRANDE, f)))
    avisar("%d impressões | %d já no cache grande | %d para baixar" % (len(precisam), len(precisam) - len(faltam), len(faltam)))
    for i, arq in enumerate(faltam):
        sid, face = precisam[arq]
        bruto = baixar(cdn_url(sid, face).replace(CDN + "normal/", CDN + "large/"))
        tmp = os.path.join(CACHE_GRANDE, arq + ".tmp")
        with open(tmp, "wb") as f:
            f.write(bruto)
        os.replace(tmp, os.path.join(CACHE_GRANDE, arq))
        if (i + 1) % 50 == 0 or i + 1 == len(faltam):
            avisar("  %d/%d" % (i + 1, len(faltam)))
        time.sleep(0.1)
    return len(faltam)


# folhas de imagem: as páginas grandes (Ciclos, Grimório) publicam as cartas em arquivos à parte, 2×2 cartas por folha no tamanho
# grande (o artefato guarda até 511 arquivos; uma por carta não caberia). O nome da folha vem das cartas que ela tem: folha que
# não mudou não é refeita nem publicada de novo; com "-p" no nome, foi feita com a de 340 px e é refeita quando a grande chegar.
CARTA_W, CARTA_H, QUALIDADE_FOLHA = 672, 936, 90


def folhas(grupos, pasta, avisar=print, comando="--imagens"):
    """grupos: {grupo (a coleção): conjunto de imagens}. Monta em `pasta` as folhas que faltam, apaga as que sobraram e devolve
    {imagem: [folha, posição 0 a 3]}. Sem a versão grande, usa a de 340 px ampliada e avisa."""
    import hashlib
    from PIL import Image
    os.makedirs(pasta, exist_ok=True)
    mapa, feitas, usadas, pequenas = {}, 0, set(), 0
    for st in sorted(grupos):
        imgs = sorted(grupos[st])
        for i in range(0, len(imgs), 4):
            grupo = imgs[i:i + 4]
            provisoria = any(not os.path.exists(os.path.join(CACHE_GRANDE, im)) for im in grupo)
            nome = "%s-%s%s.jpg" % (st, hashlib.sha1(("|".join(grupo) + "|%d|%d" % (CARTA_W, QUALIDADE_FOLHA)).encode()).hexdigest()[:10], "-p" if provisoria else "")
            usadas.add(nome)
            for k, im in enumerate(grupo):
                mapa[im] = [nome, k]
            alvo = os.path.join(pasta, nome)
            if os.path.exists(alvo):
                continue
            folha = Image.new("RGB", (CARTA_W * 2, CARTA_H * 2), (15, 15, 16))
            for k, im in enumerate(grupo):
                orig = os.path.join(CACHE_GRANDE, im)
                if not os.path.exists(orig):
                    orig = os.path.join(CACHE_IMG, im)
                    pequenas += 1
                if not os.path.exists(orig):
                    continue
                with Image.open(orig) as x:
                    folha.paste(x.convert("RGB").resize((CARTA_W, CARTA_H), Image.LANCZOS), ((k % 2) * CARTA_W, (k // 2) * CARTA_H))
            tmp = alvo + ".tmp"
            folha.save(tmp, "JPEG", quality=QUALIDADE_FOLHA, optimize=True, progressive=True)
            os.replace(tmp, alvo)
            feitas += 1
    sobras = [f for f in os.listdir(pasta) if f.endswith(".jpg") and f not in usadas]
    for f in sobras:
        os.remove(os.path.join(pasta, f))
    if feitas or sobras:
        avisar("folhas de imagem: %d feitas, %d apagadas, %d ao todo%s" % (feitas, len(sobras), len(usadas),
               (" | %d cartas sem a versão grande (rode %s)" % (pequenas, comando)) if pequenas else ""))
    return mapa


def tamanho_folhas(pasta):
    """(arquivos, MB) das folhas em `pasta`."""
    fs = [f for f in os.listdir(pasta) if f.endswith(".jpg")] if os.path.isdir(pasta) else []
    return len(fs), sum(os.path.getsize(os.path.join(pasta, f)) for f in fs) / 1048576


# o Grimório embute mais cartas que um painel: a galeria dele usa uma redução menor, feita a partir do JPEG de 340 px
# que já está no cache (o cache continua um só, e nada é baixado de novo por causa disso)
LARGURA_GRIMORIO = 150
QUALIDADE_GRIMORIO = 70


def miniatura(arquivo, largura=LARGURA_GRIMORIO, qualidade=QUALIDADE_GRIMORIO):
    """O JPEG menor de uma impressão já em cache/img/ (bytes), ou None se o arquivo não está no cache."""
    p = os.path.join(CACHE_IMG, arquivo)
    if not os.path.exists(p):
        return None
    with open(p, "rb") as f:
        return reduzir(f.read(), largura, qualidade)


def baixar_faltantes(precisam, avisar=print):
    """precisam: {arquivo: (id do Scryfall, "front" ou "back")}. Baixa e reduz só o que não está em cache/img/."""
    os.makedirs(CACHE_IMG, exist_ok=True)
    ja = {f for f in precisam if os.path.exists(os.path.join(CACHE_IMG, f))}
    faltam = sorted(set(precisam) - ja)
    avisar("%d impressões ao todo | %d já no cache | %d para baixar" % (len(precisam), len(ja), len(faltam)))
    for i, arq in enumerate(faltam):
        sid, face = precisam[arq]
        bruto = baixar(cdn_url(sid, face))
        with open(os.path.join(CACHE_IMG, arq), "wb") as f:
            f.write(reduzir(bruto))
        if (i + 1) % 20 == 0 or i + 1 == len(faltam):
            avisar("  %d/%d" % (i + 1, len(faltam)))
        time.sleep(0.1)
    return len(faltam)


def decks_alvo(nomes):
    if nomes != ["todos"]:
        return nomes
    out = []
    for n in dados.pastas_decks():
        if not dados.eh_deck(n):
            continue
        if os.path.exists(os.path.join(dados.pasta_deck(n), "avaliacao.json")):
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
    g.add_argument("--grimorio", action="store_true", help="as cartas do Grimório sem imagem no cache")
    a = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    os.makedirs(CACHE_IMG, exist_ok=True)

    if a.grimorio:
        import grimorio, scryfall
        G = grimorio.ler_grimorio()
        if not G:
            sys.exit("sem dados/grimorio/grimorio.json: rode python motor/grimorio.py --ler")
        reg = scryfall._ler()["cartas"]
        precisam = {}
        for n, c in G["cartas"].items():
            if c.get("img") and not os.path.exists(os.path.join(CACHE_IMG, c["img"])):
                r = reg.get(c["img"][:-4].replace("-", "/", 1))
                if r:
                    precisam[c["img"]] = (r["id"], "front")
        baixar_faltantes(precisam)
        print("pronto.")
        return

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

    baixar_faltantes(precisam)

    # capa de cada deck, se faltar
    for pasta in alvos:
        base = dados.pasta_deck(pasta)
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
