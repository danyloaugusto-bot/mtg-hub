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
    if nome == "colmeia":
        # malha hexagonal, como a parede da nave Dalek, e um clarão vermelho de laboratório vindo do alto
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cg fill='none' stroke='" +
               quote(p["acento_claro"]) + "' stroke-opacity='.055' stroke-width='1'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100M28 0L28 34L0 50M28 34L56 50L56 84L28 100L0 84L0 50'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(1000px 560px at 50%% -12%%, rgba(%d,%d,%d,.28), transparent 64%%),"
                "radial-gradient(640px 400px at 96%% 4%%, rgba(%d,%d,%d,.3), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["destaque"]) + _hex(p["acento"]) + (svg, grad))
    if nome == "ogivas":
        # arcos góticos em filete dourado, como as janelas da nave, e luz de vela vinda do alto
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='72' viewBox='0 0 48 72'%3E%3Cg fill='none' stroke='" +
               quote(p["acento"]) + "' stroke-opacity='.07' stroke-width='1'%3E%3Cpath d='M6 72V36Q6 14 24 4Q42 14 42 36V72M24 4V72'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(1000px 560px at 50%% -12%%, rgba(%d,%d,%d,.22), transparent 64%%),"
                "radial-gradient(640px 400px at 96%% 4%%, rgba(%d,%d,%d,.3), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["acento"]) + _hex(p["destaque"]) + (svg, grad))
    if nome == "neve":
        # flocos espalhados caindo sobre a floresta escura, e a névoa fria vinda do alto
        q = quote(p["texto"])
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='" + q + "'%3E"
               "%3Ccircle cx='12' cy='18' r='1.4' fill-opacity='.10'/%3E%3Ccircle cx='58' cy='6' r='1' fill-opacity='.08'/%3E%3Ccircle cx='96' cy='34' r='1.8' fill-opacity='.09'/%3E"
               "%3Ccircle cx='30' cy='70' r='1.1' fill-opacity='.08'/%3E%3Ccircle cx='122' cy='88' r='1.3' fill-opacity='.10'/%3E%3Ccircle cx='74' cy='104' r='1.6' fill-opacity='.07'/%3E"
               "%3Ccircle cx='8' cy='124' r='1' fill-opacity='.09'/%3E%3Ccircle cx='108' cy='130' r='1.1' fill-opacity='.08'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(1100px 560px at 50%% -14%%, rgba(%d,%d,%d,.16), transparent 64%%),"
                "radial-gradient(640px 400px at 92%% 6%%, rgba(%d,%d,%d,.22), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["texto"]) + _hex(p["destaque"]) + (svg, grad))
    if nome == "damasco":
        # brocado do trono: medalhões em ogiva, em ouro discreto, e luz de salão vinda do alto
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='88' viewBox='0 0 64 88'%3E%3Cg fill='none' stroke='" +
               quote(p["acento"]) + "' stroke-opacity='.07' stroke-width='1'%3E%3Cpath d='M32 4C48 18 48 32 32 44C16 32 16 18 32 4Z'/%3E"
               "%3Cpath d='M0 44C16 58 16 72 0 84M64 44C48 58 48 72 64 84'/%3E%3Ccircle cx='32' cy='24' r='3'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(1000px 560px at 50%% -12%%, rgba(%d,%d,%d,.2), transparent 64%%),"
                "radial-gradient(640px 400px at 94%% 4%%, rgba(%d,%d,%d,.24), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["acento"]) + _hex(p["destaque"]) + (svg, grad))
    if nome == "cortinas":
        # palco de ópera: bambinela em festões logo abaixo da barra, pregas de veludo que somem para baixo e luz de ribalta vinda do alto
        q, o = quote(p["destaque"]), quote(p["acento"])
        bambinela = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='34' viewBox='0 0 96 34'%3E"
                     "%3Cpath d='M0 0H96V8Q72 32 48 8Q24 32 0 8Z' fill='" + q + "' fill-opacity='.34'/%3E"
                     "%3Cpath d='M0 8Q24 32 48 8Q72 32 96 8' fill='none' stroke='" + o + "' stroke-opacity='.42' stroke-width='1.2'/%3E"
                     "%3Ccircle cx='48' cy='11' r='2' fill='" + o + "' fill-opacity='.5'/%3E%3C/svg%3E")
        dobra = _hex(p["destaque"])
        pregas = ("repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0, rgba(%d,%d,%d,.07) 16px, rgba(0,0,0,.05) 30px, rgba(%d,%d,%d,.06) 44px, rgba(0,0,0,.16) 60px)"
                  % (dobra + dobra))
        return ('url("%s") 0 58px/96px 34px repeat-x,'
                "radial-gradient(900px 520px at 50%% -10%%, rgba(%d,%d,%d,.22), transparent 64%%),"
                "linear-gradient(180deg, transparent 0, transparent 120px, var(--bg) 820px),%s,%s") % ((bambinela,) + _hex(p["acento_claro"]) + (pregas, grad))
    if nome == "entalhe":
        # nós nórdicos entalhados em pedra, como a moldura de Kaldheim, e a luz fria da lanterna vinda do alto
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='48' viewBox='0 0 72 48'%3E%3Cg fill='none' stroke='" +
               quote(p["acento"]) + "' stroke-opacity='.07' stroke-width='1.4'%3E%3Cpath d='M0 24C18 0 54 48 72 24M0 24C18 48 54 0 72 24'/%3E"
               "%3Ccircle cx='36' cy='24' r='3'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(900px 540px at 62%% -10%%, rgba(%d,%d,%d,.09), transparent 64%%),"
                "radial-gradient(640px 400px at 6%% 4%%, rgba(%d,%d,%d,.10), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["acento_claro"]) + _hex(p["destaque"]) + (svg, grad))
    if nome == "redemoinho":
        # a espiral de água da capa das Tartarugas: ondas em arco e bolhas subindo, com um brilho azul no alto e um verde à esquerda
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='none' stroke='" +
               quote(p["acento"]) + "' stroke-opacity='.06' stroke-width='1.3'%3E%3Cpath d='M12 96a68 68 0 0 1 136 0M36 96a44 44 0 0 1 88 0'/%3E%3C/g%3E"
               "%3Cg fill='none' stroke='" + quote(p["destaque_claro"]) + "' stroke-opacity='.09'%3E%3Ccircle cx='128' cy='26' r='6'/%3E"
               "%3Ccircle cx='141' cy='45' r='3'/%3E%3Ccircle cx='24' cy='136' r='4.5'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(900px 520px at 70%% -10%%, rgba(%d,%d,%d,.16), transparent 64%%),"
                "radial-gradient(640px 420px at 4%% 6%%, rgba(%d,%d,%d,.10), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["destaque"]) + _hex(p["acento"]) + (svg, grad))
    if nome == "deco":
        # leques art déco em filete, como os painéis de New Capenna, e o brilho do batom no alto
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'%3E%3Cg fill='none' stroke='" +
               quote(p["acento"]) + "' stroke-opacity='.06' stroke-width='1'%3E%3Cpath d='M0 40a40 40 0 0 1 80 0M12 40a28 28 0 0 1 56 0M24 40a16 16 0 0 1 32 0M40 40V24'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(900px 520px at 72%% -10%%, rgba(%d,%d,%d,.14), transparent 64%%),"
                "radial-gradient(640px 420px at 4%% 6%%, rgba(%d,%d,%d,.08), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["destaque"]) + _hex(p["acento"]) + (svg, grad))
    if nome == "trigal":
        # o trigal de Kessig à meia-noite: espigas em filete, a lua clara no alto e a brasa da colheita embaixo à esquerda
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='64' viewBox='0 0 56 64'%3E%3Cg fill='none' stroke='" +
               quote(p["acento"]) + "' stroke-opacity='.06' stroke-width='1.1' stroke-linecap='round'%3E"
               "%3Cpath d='M28 62V16M28 22l-5-5M28 22l5-5M28 30l-5-5M28 30l5-5M28 38l-5-5M28 38l5-5M28 16l0-6'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(760px 480px at 76%% -12%%, rgba(%d,%d,%d,.14), transparent 62%%),"
                "radial-gradient(700px 420px at 0%% 100%%, rgba(%d,%d,%d,.10), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["acento_claro"]) + _hex(p["destaque"]) + (svg, grad))
    if nome == "tempestade":
        # chuva de vento em diagonal e o clarão de um relâmpago atrás das nuvens, como na capa da Storm
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='" +
               quote(p["acento"]) + "' stroke-opacity='.06' stroke-width='1' stroke-linecap='round'%3E%3Cpath d='M12 0l-7 20M36 16l-7 20M26 34l-5 14'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(980px 520px at 68%% -14%%, rgba(%d,%d,%d,.16), transparent 62%%),"
                "radial-gradient(520px 360px at 10%% 6%%, rgba(%d,%d,%d,.12), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["acento_claro"]) + _hex(p["destaque"]) + (svg, grad))
    if nome == "reticula":
        # retícula de gibi: pontos de meio-tom e o vermelho do uniforme do Deadpool num canto
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cg fill='" +
               quote(p["acento"]) + "' fill-opacity='.07'%3E%3Ccircle cx='3.5' cy='3.5' r='1.5'/%3E%3Ccircle cx='10.5' cy='10.5' r='1.5'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(900px 520px at 80%% -10%%, rgba(%d,%d,%d,.22), transparent 62%%),"
                "radial-gradient(600px 400px at 0%% 10%%, rgba(%d,%d,%d,.10), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["destaque"]) + _hex(p["acento"]) + (svg, grad))
    if nome == "astrolabio":
        # astrolábios de Tolaria em filete, círculos e marcas de hora, e a luz dourada das arcadas da capa
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='" +
               quote(p["acento"]) + "' stroke-opacity='.055' stroke-width='1'%3E%3Ccircle cx='60' cy='60' r='44'/%3E%3Ccircle cx='60' cy='60' r='34'/%3E"
               "%3Cpath d='M60 12v10M60 98v10M12 60h10M98 60h10M60 60l18-22'/%3E%3C/g%3E%3C/svg%3E")
        return ("radial-gradient(900px 520px at 78%% -10%%, rgba(%d,%d,%d,.14), transparent 62%%),"
                "radial-gradient(620px 420px at 4%% 4%%, rgba(%d,%d,%d,.12), transparent 70%%),"
                'url("%s"),%s') % (_hex(p["acento_claro"]) + _hex(p["destaque"]) + (svg, grad))
    if nome == "copa":
        # a copa da floresta em filete, ramos com folhas alternadas, e os fachos de sol que atravessam as árvores na capa da Lathril, sumindo para baixo
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='" +
               quote(p["acento"]) + "' stroke-opacity='.06' stroke-width='1' stroke-linejoin='round'%3E%3Cpath d='M30 88Q36 56 30 18'/%3E"
               "%3Cpath d='M33 66q10-10 20-5q-10 10-20 5ZM32 48q-10-9-19-3q9 9 19 3ZM32 32q9-10 18-6q-8 10-18 6Z'/%3E"
               "%3Cpath d='M74 30q8-8 16-4q-8 8-16 4ZM70 40q-6-8-14-6q6 8 14 6Z'/%3E%3C/g%3E%3C/svg%3E")
        sol = _hex(p["acento_claro"])
        fachos = ("repeating-linear-gradient(112deg, transparent 0, transparent 70px, rgba(%d,%d,%d,.035) 92px, transparent 120px, transparent 210px)" % sol)
        return ('url("%s"),'
                "radial-gradient(820px 480px at 74%% -12%%, rgba(%d,%d,%d,.16), transparent 62%%),"
                "linear-gradient(180deg, transparent 0, transparent 140px, var(--bg) 900px),%s,%s") % ((svg,) + sol + (fachos, grad))
    if nome == "caverna":
        # o ninho do The First Sliver: estalactites logo abaixo da barra, em quitina escura com filete âmbar, e o brilho dos ovos vindo de baixo
        q, o = quote(p["vinho"]), quote(p["acento"])
        estalactites = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='54' viewBox='0 0 120 54'%3E"
                        "%3Cpath d='M0 0H120V5L111 22L104 6L95 46L86 7L74 28L66 6L55 52L45 8L36 25L28 6L18 38L9 7L0 18Z' fill='" + q + "' fill-opacity='.85'/%3E"
                        "%3Cpath d='M0 18L9 7L18 38L28 6L36 25L45 8L55 52L66 6L74 28L86 7L95 46L104 6L111 22L120 5' fill='none' stroke='" + o +
                        "' stroke-opacity='.3' stroke-width='1'/%3E%3C/svg%3E")
        brilho = _hex(p["acento"])
        return ('url("%s") 0 58px/120px 54px repeat-x,'
                "radial-gradient(1000px 520px at 30%% 620px, rgba(%d,%d,%d,.13), transparent 66%%),"
                "radial-gradient(700px 420px at 92%% 120px, rgba(%d,%d,%d,.10), transparent 70%%),%s") % ((estalactites,) + brilho + _hex(p["destaque"]) + (grad,))
    if nome == "cinzas":
        # o céu de guerra da Kaalia: flocos de cinza caindo, umas brasas soltas, a fumaça no alto e o clarão de fogo embaixo
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 110 110'%3E%3Cg fill='" +
               quote(p["suave"]) + "' fill-opacity='.07'%3E%3Cpath d='M12 18l5-2 2 4-4 3z'/%3E%3Cpath d='M64 9l4 1-1 4-4-1z'/%3E%3Cpath d='M88 52l5-1 1 3-5 2z'/%3E"
               "%3Cpath d='M31 71l3 2-2 4-3-2z'/%3E%3Cpath d='M70 92l4-2 2 3-4 2z'/%3E%3C/g%3E%3Cg fill='" + quote(p["acento"]) +
               "' fill-opacity='.22'%3E%3Ccircle cx='48' cy='40' r='1.2'/%3E%3Ccircle cx='97' cy='83' r='1'/%3E%3Ccircle cx='18' cy='99' r='1.1'/%3E%3C/g%3E%3C/svg%3E")
        return ('url("%s"),'
                "radial-gradient(900px 520px at 78%% -12%%, rgba(%d,%d,%d,.12), transparent 62%%),"
                "radial-gradient(1000px 520px at 18%% 640px, rgba(%d,%d,%d,.13), transparent 66%%),%s") % ((svg,) + _hex(p["suave"]) + _hex(p["acento"]) + (grad,))
    if nome == "gosma":
        # o gibi gosmento do Krark's Thumb: fios de fumaça em filete, umas gotas verdes e o brilho de gosma nos cantos
        svg = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='120' viewBox='0 0 140 120'%3E%3Cg fill='none' stroke='" +
               quote(p["suave"]) + "' stroke-opacity='.06' stroke-width='1.4' stroke-linecap='round'%3E"
               "%3Cpath d='M8 92c14-10 4-24 18-30s20 8 34-2'/%3E%3Cpath d='M78 30c12-8 2-20 16-24s16 8 30 0'/%3E%3C/g%3E%3Cg fill='" + quote(p["acento"]) +
               "' fill-opacity='.10'%3E%3Cpath d='M112 70q3 6 0 9a3 3 0 0 1-5-3q2-3 5-6z'/%3E%3Cpath d='M40 14q3 6 0 9a3 3 0 0 1-5-3q2-3 5-6z'/%3E%3C/g%3E%3C/svg%3E")
        return ('url("%s"),'
                "radial-gradient(820px 500px at 84%% -10%%, rgba(%d,%d,%d,.14), transparent 62%%),"
                "radial-gradient(700px 440px at 2%% 6%%, rgba(%d,%d,%d,.11), transparent 70%%),%s") % ((svg,) + _hex(p["destaque"]) + _hex(p["acento"]) + (grad,))
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
