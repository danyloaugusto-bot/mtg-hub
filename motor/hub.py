# -*- coding: utf-8 -*-
"""O hub: a porta de entrada de todos os painéis.

Chamado por `python motor/build.py --hub` (e ao fim de `--todos`). Gera saidas/00. Hub.html, um HTML único com as
capas reduzidas e embutidas, e o atalho `Abrir o Hub.html` na raiz do projeto.

Três abas: Decks (os cartões, por grupo), Pastas (as pastas de cartas do dono, à espera das listas) e Dashboard
(números cruzados entre os decks). O nome de cada deck é o nome da pasta, sem o número do grupo.
"""
import base64, csv, datetime, glob, io, json, math, os
from urllib.parse import quote

import dados, tema

MOTOR = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(MOTOR)
SAIDAS = os.path.join(RAIZ, "saidas")
INVENTARIO = os.path.join(RAIZ, "contexto", "inventario.csv")
PASTA_HUB = os.path.join(MOTOR, "hub")
NOME = "00. Hub"

GRUPOS = [("01", "01. Top"), ("02", "02. Tribais"), ("03", "03. Caos"), ("04", "04. Forfun"), ("05", "Compras + Precon")]
# As pastas físicas de cartas do dono. O conteúdo de cada uma entra quando chegarem as listas.
PASTAS = [("Rosa (sell)", "#f28bb8"), ("Preta (esp)", "#3a3540"), ("Preta", "#2a2a2e"), ("Amarela", "#f2c94c"),
          ("Laranja", "#f2994a"), ("Rosa", "#f5a3c7"), ("Azul", "#4f8fe0"), ("Vermelha", "#d9534f")]
BASICOS = {"Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes",
           "Snow-Covered Plains", "Snow-Covered Island", "Snow-Covered Swamp", "Snow-Covered Mountain", "Snow-Covered Forest"}


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


def nome_do_deck(pasta):
    return pasta.split(". ", 1)[1] if ". " in pasta else pasta


def montar(avisar=print):
    inv = ler_inventario()
    pastas = [n for n in sorted(os.listdir(dados.DADOS))
              if dados.eh_deck(n)]
    nomes = list(dict.fromkeys(pastas + sorted(inv)))
    decks, presencas = [], {}
    for pasta in nomes:
        base = os.path.join(dados.DADOS, pasta)
        r = inv.get(pasta, {})
        grupo = pasta.split(".")[0].strip() if "." in pasta else "05"
        d = dict(pasta=pasta, grupo=grupo, nome=nome_do_deck(pasta), cmd=(r.get("comandante") or "").replace(" (confirmar)", ""),
                 cores=dados.ordem_cores(r.get("cores", "")), painel=None)
        if os.path.exists(os.path.join(base, "avaliacao.json")):
            try:
                m = dados.montar(pasta, avisar=lambda *x: None)
            except dados.ErroDeck as e:
                avisar("hub: %s ficou de fora do resumo: %s" % (pasta, e))
                m = None
            if m:
                t = dados.ler_json(os.path.join(base, "tema.json"), obrigatorio=False) or {}
                pt, avg = placar(m["cards"], m["grupos"])
                cmd = next((c for c in m["cards"] if c.get("cmd")), None)
                tipos = {}
                for c in m["cards"]:
                    k = "cri" if c.get("cmd") else c["t"]
                    tipos[k] = tipos.get(k, 0) + c["q"]
                d.update(painel=t.get("painel") or d["nome"], cmd=(cmd["n"] if cmd else d["cmd"]), cores=m["ident"] or d["cores"],
                         placar=pt, cmc=round(avg, 2), tipos=tipos, href=quote(pasta + ".html"),
                         capa=capa_reduzida(base, (t.get("capa") or {}).get("arquivo")),
                         foco=(t.get("capa") or {}).get("foco", "50% 30%"))
                for c in m["cards"]:
                    if c["n"] not in BASICOS:
                        presencas.setdefault(c["n"], set()).add(d["nome"])
        if d["painel"] is None:
            d["capa"] = capa_reduzida(base) if os.path.isdir(base) else None
        decks.append(d)

    comuns = sorted(([n, sorted(v)] for n, v in presencas.items() if len(v) >= 2), key=lambda x: (-len(x[1]), x[0]))
    H = dict(grupos=[dict(k=k, n=n) for k, n in GRUPOS], decks=decks, comuns=comuns,
             pastas=[dict(n=n, c=c) for n, c in PASTAS], gerado=datetime.date.today().strftime("%d/%m/%Y"))

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
