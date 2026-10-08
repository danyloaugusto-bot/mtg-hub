# -*- coding: utf-8 -*-
"""Tema de um painel: paleta, cores dos agrupamentos e das cartas, textura, fontes e capa.

Tudo que um tema não declara cai num padrão neutro, para que um deck novo funcione com tema.json quase vazio.
"""
import base64, glob, io, os, re, unicodedata
from urllib.parse import quote

MOTOR = os.path.dirname(os.path.abspath(__file__))
FONTES = os.path.join(MOTOR, "fontes")

# Chave no tema.json -> variável CSS. As de cima são as que um tema costuma declarar; as de baixo, quando faltam, são derivadas.
PALETA = [
    ("fundo", "bg"), ("painel", "panel"), ("acento", "gold"), ("acento_claro", "gold2"), ("texto", "bone"), ("suave", "mute"),
    ("apagado", "dim"), ("destaque", "blood"), ("destaque_claro", "blood2"), ("vinho", "wine"),
    ("fundo2", "bg2"), ("painel2", "panel2"), ("elevado", "raise"), ("profundo", "deep"), ("tinta", "ink"), ("cabecalho", "head"),
    ("coluna", "sticky"), ("realce", "hover"), ("total", "total"), ("botao", "btn"), ("botao2", "btn2"), ("botao_hover", "btnh"),
    ("botao2_hover", "btn2h"), ("folha", "sheet"), ("folha2", "sheet2"), ("contorno", "halo"), ("ok", "ok"), ("alerta", "warn"), ("ruim", "bad"),
]
PADRAO = {
    "fundo": "#101318", "painel": "#1a1e26", "acento": "#c9a96e", "acento_claro": "#ecd9a8", "texto": "#eef0f3", "suave": "#bcc2cc",
    "apagado": "#8b929e", "destaque": "#3a6fb5", "destaque_claro": "#6a9be0", "ok": "#5fbfa7", "alerta": "#e6ad45", "ruim": "#ea5466",
}
# Cores dos agrupamentos, na ordem, quando o tema não declara: as oito do Ritos e mais duas.
CORES_G = ["222,170,70", "104,156,228", "224,58,72", "84,184,160", "190,72,130", "238,227,200", "240,138,160", "164,122,218",
           "120,196,232", "176,190,96"]
TIPOS = {"cri": "#d93a48", "ins": "#689ce4", "fei": "#a47ada", "art": "#b4bcc6", "enc": "#54b8a0", "pw": "#deaa46", "bat": "#f08aa0", "ter": "#8a6450"}
COR = {"W": ("Branco", "#f3e7bf"), "U": ("Azul", "#689ce4"), "B": ("Preto", "#8a6f92"), "R": ("Vermelho", "#d93a48"), "G": ("Verde", "#54b8a0")}
DUO = {"W": "#f3e7bf", "U": "#7fb0ff", "B": "#a487ad", "R": "#f0596a", "G": "#6fd0a8"}
MULTI = ["#d8b46a", "#c98a5a", "#a3b86a", "#6fb3c9", "#b98ad8", "#d87a9a", "#8ab4a0", "#c9b26f", "#9a9ad8", "#d8a07a"]
NOMES = {"W": "branco", "U": "azul", "B": "preto", "R": "vermelho", "G": "verde"}


def _hex(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _mix(a, b, t):
    x, y = _hex(a), _hex(b)
    return "#%02x%02x%02x" % tuple(round(x[i] + (y[i] - x[i]) * t) for i in range(3))


def paleta(p):
    p = dict(PADRAO, **(p or {}))
    deriv = {
        "vinho": lambda: _mix(p["destaque"], p["fundo"], .55),
        "fundo2": lambda: _mix(p["fundo"], p["painel"], .45),
        "painel2": lambda: _mix(p["painel"], p["texto"], .05),
        "elevado": lambda: _mix(p["painel2"], p["texto"], .07),
        "profundo": lambda: _mix(p["fundo"], "#000000", .4),
        "tinta": lambda: _mix(p["fundo"], "#000000", .15),
        "cabecalho": lambda: _mix(p["fundo"], p["painel"], .6),
        "coluna": lambda: _mix(p["fundo"], p["painel"], .4),
        "realce": lambda: _mix(p["painel"], p["elevado"], .4),
        "total": lambda: _mix(p["painel"], p["vinho"], .3),
        "botao": lambda: _mix(p["destaque"], "#000000", .3),
        "botao2": lambda: _mix(p["destaque"], "#000000", .5),
        "botao_hover": lambda: _mix(p["destaque"], "#000000", .15),
        "botao2_hover": lambda: _mix(p["destaque"], "#000000", .4),
        "folha": lambda: p["painel2"],
        "folha2": lambda: _mix(p["fundo"], p["painel"], .3),
        "contorno": lambda: _mix(p["fundo"], p["painel"], .5),
    }
    for k, f in deriv.items():
        if k not in p:
            p[k] = f()
    return p


def luz(rgb):
    r, g, b = (int(x) for x in rgb.split(","))
    return (.2126 * r + .7152 * g + .0722 * b) / 255


def textura(nome, p):
    a, w, d = _hex(p["destaque"]), _hex(p["vinho"]), quote(p["acento"])
    grad = "linear-gradient(180deg,var(--bg2),var(--bg) 480px)"
    if nome == "vitral":
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='" + d +
               "' stroke-opacity='.045'%3E%3Ccircle cx='32' cy='16' r='12'/%3E%3Ccircle cx='32' cy='48' r='12'/%3E%3Ccircle cx='16' cy='32' r='12'/%3E%3Ccircle cx='48' cy='32' r='12'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(1100px 520px at 78%% -8%%, rgba(%d,%d,%d,.34), transparent 62%%),"
                "radial-gradient(700px 420px at 4%% 2%%, rgba(%d,%d,%d,.5), transparent 70%%),"
                'url("%s"),%s') % (a + w + (svg, grad))
    if nome == "fios":
        # treliça de fios finos em diagonal e um clarão vindo do alto, como luz vazando por uma fresta
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='" +
               quote(p["destaque_claro"]) + "' stroke-opacity='.05' stroke-width='.8'%3E%3Cpath d='M0 0L120 120M120 0L0 120'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(900px 560px at 50%% -12%%, rgba(%d,%d,%d,.3), transparent 64%%),"
                "radial-gradient(600px 380px at 96%% 4%%, rgba(%d,%d,%d,.45), transparent 70%%),"
                'url("%s"),%s') % (a + w + (svg, grad))
    if nome == "impacto":
        # linhas de velocidade em diagonal, como nos jogos de luta, e um clarão quente vindo do alto
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='none' stroke='" +
               quote(p["acento_claro"]) + "' stroke-opacity='.05' stroke-width='1.3' stroke-linecap='round'%3E%3Cpath d='M8 152L58 102M70 150L150 70M20 64L64 20M104 34L138 0M118 160L160 118'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(1000px 540px at 30%% -10%%, rgba(%d,%d,%d,.32), transparent 62%%),"
                "radial-gradient(640px 400px at 96%% 6%%, rgba(%d,%d,%d,.42), transparent 70%%),"
                'url("%s"),%s') % (a + w + (svg, grad))
    if nome == "brasao":
        # quadrifólios dourados em quincôncio, como o bordado de um tabardo, e luz de vitral vinda do alto
        q = quote(p["acento"])
        flor = ("%3Cg fill='" + q + "' fill-opacity='.09'%3E%3Ccircle cx='0' cy='-4' r='3.2'/%3E%3Ccircle cx='0' cy='4' r='3.2'/%3E"
                "%3Ccircle cx='-4' cy='0' r='3.2'/%3E%3Ccircle cx='4' cy='0' r='3.2'/%3E%3C/g%3E")
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E"
               "%3Cg transform='translate(18 18)'%3E" + flor + "%3C/g%3E%3Cg transform='translate(54 54)'%3E" + flor + "%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(1100px 560px at 50%% -12%%, rgba(%d,%d,%d,.20), transparent 64%%),"
                "radial-gradient(700px 420px at 92%% 4%%, rgba(%d,%d,%d,.16), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["acento_claro"]) + _hex(p["destaque"]) + (svg, grad))
    if nome == "papel":
        # papel de parede listrado de salão vitoriano, à luz de vela
        g = _hex(p["acento"])
        listras = ("repeating-linear-gradient(90deg, rgba(%d,%d,%d,.045) 0 2px, transparent 2px 13px, rgba(%d,%d,%d,.025) 13px 20px, transparent 20px 34px)"
                   % (g + g))
        return ("radial-gradient(900px 520px at 18%% -8%%, rgba(%d,%d,%d,.28), transparent 64%%),"
                "radial-gradient(640px 420px at 96%% 4%%, rgba(%d,%d,%d,.35), transparent 70%%),%s,%s") % (_hex(p["destaque"]) + w + (listras, grad))
    if nome == "nenhuma":
        return grad
    return "radial-gradient(1100px 520px at 78%% -8%%, rgba(%d,%d,%d,.22), transparent 62%%),%s" % (a + (grad,))


def _slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def fontes(familias):
    """@font-face embutidos para cada família presente em motor/fontes/<slug>/, e a URL do Google Fonts de reserva."""
    css, g = "", []
    for fam in familias:
        arqs = sorted(glob.glob(os.path.join(FONTES, _slug(fam), "*.woff2")))
        if not arqs:
            raise ValueError("fonte '%s' não está em motor/fontes/%s/" % (fam, _slug(fam)))
        pesos = []
        for a in arqs:
            m = re.search(r"-(\d{3})-(normal|italic)\.woff2$", a)
            w, st = int(m.group(1)), m.group(2)
            pesos.append((1 if st == "italic" else 0, w))
            with open(a, "rb") as f:
                b = base64.b64encode(f.read()).decode()
            css += "@font-face{font-family:'%s';font-style:%s;font-weight:%d;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n" % (fam, st, w, b)
        pesos.sort()
        if any(i for i, _ in pesos):
            g.append("family=%s:ital,wght@%s" % (fam.replace(" ", "+"), ";".join("%d,%d" % x for x in pesos)))
        else:
            g.append("family=%s:wght@%s" % (fam.replace(" ", "+"), ";".join(str(w) for _, w in pesos)))
    return css, "https://fonts.googleapis.com/css2?" + "&".join(g) + "&display=swap"


def capa(base, arquivo=None):
    """Capa do deck em JPEG embutido. Devolve (css, proporção) ou (None, None) se não houver."""
    from PIL import Image
    if arquivo:
        cam = os.path.join(base, arquivo)
    else:
        cands = [c for c in glob.glob(os.path.join(base, "capa.*")) if c.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))]
        cam = cands[0] if cands else None
    if not cam or not os.path.exists(cam):
        return None, None
    im = Image.open(cam).convert("RGB")
    if im.width > 1400:
        im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=86, optimize=True, progressive=True)
    return ("--art:url(data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode() + ")"), "%d/%d" % (im.width, im.height)


def cores_cartas(cartas, ident):
    """Lista de cores que o painel usa para fichas, curva e pilhas: as da identidade, as combinações presentes e incolor."""
    presentes = {c["col"] for c in cartas if c["col"] not in ("L",)}
    simples = [k for k in "WUBRG" if k in ident or k in presentes]
    multi = sorted((k for k in presentes if len(k) > 1 and all(ch in "WUBRG" for ch in k)), key=lambda k: (len(k), ["WUBRG".index(ch) for ch in k]))
    out = [dict(k=k, n=COR[k][0], c=COR[k][1]) for k in simples]
    for i, k in enumerate(multi):
        nomes = [NOMES[ch] for ch in k]
        n = (", ".join(nomes[:-1]) + " e " + nomes[-1]).capitalize()
        out.append(dict(k=k, n=n, c=MULTI[i % len(MULTI)]))
    out.append(dict(k="C", n="Incolor", c="#9aa3ad"))
    return out


def raiz_css(p, grupos_rgb, extra):
    linhas = []
    for chave, var in PALETA:
        v = p[chave]
        linhas.append("--%s:%s;--%s-rgb:%s" % (var, v, var, ",".join(str(x) for x in _hex(v))))
    linhas.append("--line:rgba(%s,.24);--line2:rgba(%s,.5)" % ((",".join(str(x) for x in _hex(p["acento"])),) * 2))
    for i, g in enumerate(grupos_rgb):
        linhas.append("--g%d:%s" % (i, g))
    linhas += extra
    return ":root{" + ";\n".join(linhas) + "}\n"
