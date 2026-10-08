# -*- coding: utf-8 -*-
"""O hub: a porta de entrada de todos os painéis.

Chamado por `python motor/build.py --hub` (e ao fim de `--todos`). Gera saidas/00. Hub.html, um HTML único com as
capas reduzidas e embutidas, e o atalho `Abrir o Hub.html` na raiz do projeto.

Fontes: as pastas de dados/ (o número antes do ponto é o grupo), contexto/inventario.csv para o que ainda não tem
pasta, e um resumo de cada deck com avaliação, calculado aqui com a mesma conta do painel.
"""
import base64, csv, datetime, glob, io, json, math, os, re
from urllib.parse import quote

import dados, tema

MOTOR = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(MOTOR)
SAIDAS = os.path.join(RAIZ, "saidas")
INVENTARIO = os.path.join(RAIZ, "contexto", "inventario.csv")
PASTA_HUB = os.path.join(MOTOR, "hub")
NOME = "00. Hub"

GRUPOS = [("01", "01. Top"), ("02", "02. Tribais"), ("03", "03. Caos"), ("04", "04. Forfun"), ("05", "Compras + Precon")]
BASICOS = {"Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes",
           "Snow-Covered Plains", "Snow-Covered Island", "Snow-Covered Swamp", "Snow-Covered Mountain", "Snow-Covered Forest"}
SUFIXO = re.compile(r"\s*-\s*(OKn|nOK|OK)\s*$")


def placar(cards, grupos):
    """A mesma conta do painel (app.js, stats): CMC médio, aceleração e soma das notas. Sem PetCard: ele é do dono."""
    nonland = cmc = 0
    pts = [0] * len(grupos)
    for c in cards:
        q = c["q"]
        for i, v in enumerate(c["s"]):
            pts[i] += v * q
        if not c.get("land"):
            nonland += q
            cmc += c["cmc"] * q
    avg = cmc / nonland if nonland else 0
    cmc_pts = 0 if avg == 0 else 5 if avg < 2 else 4 if avg < 3 else 3 if avg < 4 else 2 if avg < 5 else 1
    ir = next((i for i, g in enumerate(grupos) if g["k"] == "ramp"), 0)
    acc = pts[ir] / avg if avg else 0
    acc_pts = 0 if acc < 0 else min(90, 5 * (math.floor(acc * 2) + 1))
    return cmc_pts + acc_pts + sum(pts), avg


def ler_inventario():
    if not os.path.exists(INVENTARIO):
        return {}
    with open(INVENTARIO, encoding="utf-8") as f:
        return {r["pasta"]: r for r in csv.DictReader(f) if r.get("pasta")}


def capa_reduzida(base, arquivo=None, largura=640):
    from PIL import Image
    cam = os.path.join(base, arquivo) if arquivo else None
    if not cam or not os.path.exists(cam):
        cands = [c for c in glob.glob(os.path.join(base, "capa.*")) if c.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))]
        cam = cands[0] if cands else None
    if not cam:
        return None
    im = Image.open(cam).convert("RGB")
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=80, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def situacao_app(rotulo):
    r = (rotulo or "").strip()
    if r == "OK":
        return "ok"
    if r in ("nOK", "OKn"):
        return "nok"
    if r:
        return "obras"
    return ""


def montar(avisar=print):
    inv = ler_inventario()
    pastas = [n for n in sorted(os.listdir(dados.DADOS))
              if not n.startswith(("_", ".")) and os.path.isdir(os.path.join(dados.DADOS, n))]
    nomes = list(dict.fromkeys(pastas + list(inv)))
    decks, compras, presencas = [], [], {}
    for pasta in nomes:
        base = os.path.join(dados.DADOS, pasta)
        r = inv.get(pasta, {})
        grupo = pasta.split(".")[0].strip() if "." in pasta else "05"
        nome_app = SUFIXO.sub("", r.get("nome_no_app") or "") or pasta.split(". ", 1)[-1]
        d = dict(pasta=pasta, grupo=grupo, nome=nome_app, cmd=r.get("comandante", ""), cores=r.get("cores", ""),
                 app=r.get("situacao_no_app", ""), link=r.get("link_publicado", ""), painel=None)
        av_ok = os.path.exists(os.path.join(base, "avaliacao.json"))
        html = os.path.join(SAIDAS, pasta + ".html")
        if av_ok:
            try:
                m = dados.montar(pasta, avisar=lambda *x: None)
            except dados.ErroDeck as e:
                avisar("hub: %s ficou de fora do resumo: %s" % (pasta, e))
                m = None
            if m:
                t = dados.ler_json(os.path.join(base, "tema.json"), obrigatorio=False) or {}
                pt, avg = placar(m["cards"], m["grupos"])
                entra = [c for c in m["cands"] if c.get("verdict") == "entra"]
                cmd = next((c for c in m["cards"] if c.get("cmd")), None)
                d.update(
                    painel=t.get("painel") or pasta, cmd=(cmd["n"] if cmd else d["cmd"]), cores=m["ident"] or d["cores"],
                    placar=pt, cmc=round(avg, 2), berlinda=sum(c["q"] for c in m["cards"] if c["rel"] == "BAX"),
                    pendentes=len(entra), href=quote(pasta + ".html"), existe=os.path.exists(html),
                    montado=(datetime.datetime.fromtimestamp(os.path.getmtime(html)).strftime("%d/%m/%Y %H:%M") if os.path.exists(html) else ""),
                    capa=capa_reduzida(base, (t.get("capa") or {}).get("arquivo")),
                    foco=(t.get("capa") or {}).get("foco", "50% 30%"))
                for c in entra:
                    compras.append(dict(n=c["n"], deck=d["nome"], pasta=pasta, painel=d["painel"], usd=c.get("usd"),
                                        sai=next((x["n"] for x in m["cards"] if x["id"] == c.get("sai")), "")))
                for c in m["cards"]:
                    if c["n"] not in BASICOS:
                        presencas.setdefault(c["n"], set()).add(d["nome"])
        elif os.path.exists(os.path.join(base, "decklist.txt")):
            try:
                for e in dados.ler_decklist(os.path.join(base, "decklist.txt")):
                    if e["name"] not in BASICOS:
                        presencas.setdefault(e["name"], set()).add(d["nome"])
            except dados.ErroDeck:
                pass
        if d["painel"] is None:
            d["capa"] = capa_reduzida(base) if os.path.isdir(base) else None
        decks.append(d)

    comuns = sorted(([n, sorted(v)] for n, v in presencas.items() if len(v) >= 3), key=lambda x: (-len(x[1]), x[0]))
    em_dois = sum(1 for v in presencas.values() if len(v) == 2)
    compras.sort(key=lambda x: (-(float(x["usd"]) if x["usd"] else 0), x["n"]))
    H = dict(grupos=[dict(k=k, n=n) for k, n in GRUPOS], decks=decks, compras=compras, comuns=comuns, em_dois=em_dois,
             gerado=datetime.date.today().strftime("%d/%m/%Y"))

    pal = tema.paleta({"fundo": "#0f0f10", "painel": "#1b1b1d", "acento": "#f5a524", "acento_claro": "#ffc96b", "texto": "#f2f0ec",
                       "suave": "#bdbab3", "apagado": "#8a877f", "destaque": "#f5a524", "destaque_claro": "#ffc96b"})
    css_fontes, _ = tema.fontes(["Alegreya Sans"])
    root = tema.raiz_css(pal, [], ["--fd:'Alegreya Sans','Segoe UI',system-ui,sans-serif", "--fb:'Alegreya Sans','Segoe UI',system-ui,sans-serif"])
    cores = "".join(".ms-%s{background:%s}" % (k, v) for k, v in
                    (("W", "#f3e7bf"), ("U", "#a9cdf0"), ("B", "#2b2228"), ("R", "#f0a28c"), ("G", "#9fd0a6")))

    def ler(n):
        with open(os.path.join(PASTA_HUB, n), encoding="utf-8") as f:
            return f.read()
    js = ler("app.js").replace("/*__DATA__*/null", json.dumps(H, ensure_ascii=False, separators=(",", ":")))
    html = (ler("template.html").replace("/*__FONTS__*/", css_fontes).replace("/*__ROOT__*/", root + cores)
            .replace("/*__CSS__*/", ler("style.css")).replace("/*__JS__*/", js.replace("</script", "<\\/script")))
    return html, H


def atalho():
    alvo = "saidas/" + quote(NOME + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Hub dos decks</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir o hub dos decks</a></p>\n</body>\n</html>\n') % (alvo, alvo)
