# -*- coding: utf-8 -*-
"""Baixa do Scryfall a imagem de cada carta do deck e do radar para imagens/cartas/.

Com as imagens na pasta, "python3 scripts/montar.py --imagens" grava dist/coro-da-alvorada-com-imagens.html:
um arquivo só, que mostra as cartas sem internet e pode ser publicado.

Uso:
  python3 scripts/baixar_imagens.py                # baixa o que falta, no tamanho "normal" do Scryfall (488 x 680)
  python3 scripts/baixar_imagens.py --largura 366  # reduz cada imagem para 366 px de largura, em WebP (precisa de: pip install pillow)
  python3 scripts/baixar_imagens.py --refazer      # baixa tudo de novo

Segue as regras de uso do Scryfall: cartas pedidas em lote (75 por chamada), intervalo entre os pedidos e identificação no User-Agent.
A impressão é a da decklist (edição e número); quando o Scryfall não a reconhece, vale a impressão padrão da carta.
"""
import io, json, os, sys, time, urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(RAIZ, "imagens", "cartas")
API = os.environ.get("SCRYFALL_API", "https://api.scryfall.com").rstrip("/")
UA = "painel-coro-da-alvorada/2 (painel de deck pessoal, uso proprio)"
TAMANHO = "normal"


def pedir(url, corpo=None, cabecalhos=None):
    time.sleep(0.12)
    req = urllib.request.Request(url, data=corpo, headers=dict({"User-Agent": UA, "Accept": "*/*"}, **(cabecalhos or {})))
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read()


def lote(cartas, por_nome):
    """Devolve ({id: carta do Scryfall}, [cartas não achadas])."""
    achadas, faltam = {}, []
    for i in range(0, len(cartas), 75):
        grupo = cartas[i:i + 75]
        nome = lambda c: por_nome or not c.get("set")
        ids = [{"name": c["n"]} if nome(c) else {"set": c["set"].lower(), "collector_number": str(c["num"])} for c in grupo]
        res = json.loads(pedir(API + "/cards/collection", json.dumps({"identifiers": ids}).encode("utf-8"),
                               {"Content-Type": "application/json", "Accept": "application/json"}))
        por_par, por_n = {}, {}
        for k in res.get("data", []):
            por_par[(k.get("set", "") + "|" + str(k.get("collector_number", ""))).lower()] = k
            por_n[k["name"].lower()] = k; por_n[k["name"].lower().split(" // ")[0]] = k
        for c in grupo:
            k = por_n.get(c["n"].lower()) if nome(c) else por_par.get((c["set"] + "|" + str(c["num"])).lower())
            if k: achadas[c["id"]] = k
            else: faltam.append(c)
    return achadas, faltam


def faces(k):
    """[(sufixo, url)] da frente e, em carta de duas faces, do verso."""
    if k.get("image_uris"):
        return [("", k["image_uris"][TAMANHO])]
    fs = [f for f in k.get("card_faces", []) if f.get("image_uris")]
    return [("" if i == 0 else ".back", f["image_uris"][TAMANHO]) for i, f in enumerate(fs[:2])]


def tem(base):
    return any(os.path.exists(base + e) for e in (".webp", ".jpg", ".jpeg", ".png"))


def main():
    largura = int(sys.argv[sys.argv.index("--largura") + 1]) if "--largura" in sys.argv else 0
    refazer = "--refazer" in sys.argv
    Image = None
    if largura:
        try:
            from PIL import Image
        except ImportError:
            sys.exit("--largura precisa da biblioteca Pillow: pip install pillow")
    D = json.load(open(os.path.join(RAIZ, "dados", "D.json"), encoding="utf-8"))
    cartas = D["cards"] + D["cands"]
    os.makedirs(PASTA, exist_ok=True)
    arq_cred = os.path.join(PASTA, "creditos.json")
    creditos = json.load(open(arq_cred, encoding="utf-8")) if os.path.exists(arq_cred) else {}
    pendentes = [c for c in cartas if refazer or not tem(os.path.join(PASTA, c["id"]))]
    if not pendentes:
        print("nada a baixar: as %d cartas já têm imagem em imagens/cartas/" % len(cartas)); return
    achadas, faltam = lote(pendentes, False)
    if faltam:                                   # impressão não reconhecida: tenta pelo nome
        mais, faltam = lote([c for c in faltam if c.get("set")], True) if any(c.get("set") for c in faltam) else ({}, faltam)
        for c in list(mais): print("  impressão da lista não reconhecida, usei a padrão:", next(x["n"] for x in cartas if x["id"] == c))
        achadas.update(mais)
    n = total = 0
    for c in pendentes:
        k = achadas.get(c["id"])
        if not k: continue
        for sufixo, url in faces(k):
            dados = pedir(url)
            base = os.path.join(PASTA, c["id"] + sufixo)
            for e in (".webp", ".jpg", ".jpeg", ".png"):
                if os.path.exists(base + e): os.remove(base + e)
            if Image:
                im = Image.open(io.BytesIO(dados)).convert("RGB")
                if im.width > largura: im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
                saida = io.BytesIO(); im.save(saida, "WEBP", quality=82, method=6); dados = saida.getvalue(); base += ".webp"
            else:
                base += ".jpg"
            open(base, "wb").write(dados); n += 1; total += len(dados)
        artista = k.get("artist") or (k.get("card_faces") or [{}])[0].get("artist")
        if artista: creditos[c["id"]] = artista
    json.dump(creditos, open(arq_cred, "w", encoding="utf-8"), ensure_ascii=False, indent=0, sort_keys=True)
    print("baixadas: %d imagens de %d cartas, %.1f MB em imagens/cartas/" % (n, len(achadas), total / 1e6))
    if faltam: print("sem imagem (o Scryfall não achou):", ", ".join(c["n"] for c in faltam))
    print("agora: python3 scripts/montar.py --imagens")


if __name__ == "__main__":
    main()
