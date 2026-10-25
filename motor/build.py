# -*- coding: utf-8 -*-
"""Monta o painel de um deck, de todos, ou o hub.

    python motor/build.py --deck "02. Clavileño"
    python motor/build.py --todos          # todos os decks com avaliação, e o hub no fim
    python motor/build.py --hub            # só o hub
    python motor/build.py --caixa          # só a Caixa (saidas/00. Caixa.html); --todos monta a Caixa antes do hub
    python motor/build.py --grimorio       # só o Grimório (saidas/00. Grimório.html); --todos monta o Grimório antes do hub
    python motor/build.py --consulta       # só a Consulta (saidas/00. Consulta.html); --todos monta a Consulta antes do hub
    python motor/build.py --ciclos         # só os Ciclos (saidas/00. Ciclos.html); --todos monta os Ciclos antes do hub

Gera saidas/<pasta>.html e dados/<pasta>/Abrir o painel.html; o hub gera saidas/00. Hub.html e Abrir o Hub.html na raiz.
Sempre com quebra de linha LF,
para que montar no Windows e no Mac dê o mesmo arquivo.
"""
import argparse, base64, json, os, sys
from urllib.parse import quote

sys.dont_write_bytecode = True
MOTOR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, MOTOR)

import caixa, ciclos, consulta, dados, encaixe, grimorio, hub, imagens, plano, scryfall, tema  # noqa: E402

RAIZ = os.path.dirname(MOTOR)
SAIDAS = os.path.join(RAIZ, "saidas")
PAINEL = os.path.join(MOTOR, "painel")
CACHE_IMG = os.path.join(RAIZ, "cache", "img")
MOLDURAS = ("larga", "retrato")
GRAFICOS = ("rosacea", "fios", "chamas", "estandartes", "alfinetes", "rebites", "espinhos", "presas", "coroa", "frascos", "runas", "cascos", "leque", "luas", "raios", "baloes", "trancas", "folhas", "ovos", "fendas", "moedas", "maos", "engrenagens", "pergaminhos", "lunetas", "torres", "meteoros", "canhoes", "asas", "tumbas", "padrao")
# mais os motivos votados, um arquivo por gráfico em motor/painel/motivos/
GRAFICOS += tuple(sorted(f[:-3] for f in os.listdir(os.path.join(PAINEL, "motivos")) if f.endswith(".js")))
CURVAS = ("ogiva", "barra")
TEXTURAS = ("vitral", "fios", "impacto", "brasao", "papel", "colmeia", "ogivas", "neve", "damasco", "cortinas", "entalhe", "redemoinho", "deco", "trigal", "tempestade", "reticula", "astrolabio", "copa", "caverna", "cinzas", "gosma", "telhados", "nervuras", "nuvens", "cordame", "tijolos", "labaredas", "estouro", "padrao", "nenhuma")
MODOS = ("escuro", "claro")
MODOS_IMG = ("embutidas", "externas", "nenhuma")


def mapa_imagens(cartas):
    """id -> data: URI, a partir do que já está em cache/img/. Carta sem arquivo no cache fica de fora
    (volta para as fontes externas ou a ficha de texto, conforme o ambiente)."""
    out = {}
    for c in cartas:
        fa, ve = imagens.precisa(c)
        for arq, chave in ((fa, c["id"]), (ve, c["id"] + "|b") if ve else (None, None)):
            if not arq:
                continue
            caminho = os.path.join(CACHE_IMG, arq)
            if os.path.exists(caminho):
                with open(caminho, "rb") as f:
                    out[chave] = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()
    return out


def ler(nome):
    with open(os.path.join(PAINEL, nome), encoding="utf-8") as f:
        return f.read()


def _contraste(a, b):
    """Razão de contraste WCAG entre duas cores [r, g, b] de 0 a 255."""
    def lum(c):
        f = [(v / 255) / 12.92 if v / 255 <= .03928 else (((v / 255) + .055) / 1.055) ** 2.4 for v in c]
        return .2126 * f[0] + .7152 * f[1] + .0722 * f[2]
    l1, l2 = lum(a), lum(b)
    return (max(l1, l2) + .05) / (min(l1, l2) + .05)


def selos_legiveis(pal, claro):
    """Selos INS e BAX com contraste de pelo menos 4,5:1 em qualquer tema (auditoria de layout, 15/10/2026). Muda só a cor
    do texto do selo: o INS tem o acento de fundo e a tinta por cima; o BAX, um véu vermelho sobre os painéis do tema."""
    hx = lambda h: list(tema._hex(h))
    css = ""
    ouro, tinta = hx(pal["acento"]), hx(pal["tinta"])
    if _contraste(tinta, ouro) < 4.5:
        melhor = max(("#111111", "#ffffff"), key=lambda c: _contraste(hx(c), ouro))
        css += ":root .rb-INS{color:%s}" % melhor   # :root para vencer a regra do style.css, que vem depois
    veu, alfa, cor = ((192, 57, 75), .1, "#a3283b") if claro else ((234, 84, 102), .2, "#ff9aa7")
    fundos = [[veu[i] * alfa + hx(pal[k])[i] * (1 - alfa) for i in range(3)] for k in ("painel", "painel2", "fundo", "folha", "folha2") if pal.get(k)]
    pior = lambda c: min(_contraste(hx(c), f) for f in fundos)
    if pior(cor) < 4.5:
        opcoes = ("#7a1726", "#5c0f1c", "#2a0a10") if claro else ("#ffc2ca", "#ffe0e4", "#ffffff")
        css += ":root .rb-BAX,:root .vd-fora,:root.claro .rb-BAX,:root.claro .vd-fora{color:%s}" % next((c for c in opcoes if pior(c) >= 4.5), opcoes[-1])
    return css + "\n" if css else ""


def conferir_tema(t):
    cap = t.get("capa") or {}
    if cap.get("moldura", "retrato") not in MOLDURAS:
        raise dados.ErroDeck("tema.json: moldura '%s'; use %s" % (cap.get("moldura"), " ou ".join(MOLDURAS)))
    g = t.get("grafico", "padrao")
    if g not in GRAFICOS:
        raise dados.ErroDeck("tema.json: gráfico '%s'; use %s" % (g, " ou ".join(GRAFICOS)))
    if t.get("curva", "ogiva") not in CURVAS:
        raise dados.ErroDeck("tema.json: curva '%s'; use %s" % (t.get("curva"), " ou ".join(CURVAS)))
    if t.get("modo", "escuro") not in MODOS:
        raise dados.ErroDeck("tema.json: modo '%s'; use %s" % (t.get("modo"), " ou ".join(MODOS)))
    if t.get("textura", "padrao") not in TEXTURAS:
        raise dados.ErroDeck("tema.json: textura '%s'; use %s" % (t.get("textura"), ", ".join(TEXTURAS)))


def montar_html(pasta, base_dados=None, tema_extra=None, atualizar_scryfall=False, modo_img="embutidas", avisar=print):
    """Devolve (html, resumo). base_dados troca a pasta dados/ (os testes montam variantes numa pasta temporária)."""
    if modo_img not in MODOS_IMG:
        raise dados.ErroDeck("--imagens '%s'; use %s" % (modo_img, " ou ".join(MODOS_IMG)))
    if base_dados:
        dados.DADOS = base_dados
    base = dados.pasta_deck(pasta)
    d = dados.montar(pasta, atualizar_scryfall=atualizar_scryfall, avisar=avisar)
    t = dados.ler_json(os.path.join(base, "tema.json"), obrigatorio=False) or {}
    if tema_extra:
        for k, v in tema_extra.items():
            if isinstance(v, dict) and isinstance(t.get(k), dict):
                t[k] = dict(t[k], **v)
            else:
                t[k] = v
    conferir_tema(t)
    cap = t.get("capa") or {}

    pal = tema.paleta(t.get("paleta"))
    cores_g = t.get("agrupamentos") or {}
    grupos = []
    for i, g in enumerate(d["grupos"]):
        rgb = cores_g.get(g["k"]) or g.get("cor") or tema.CORES_G[i % len(tema.CORES_G)]   # v3: a cor padrão de cada critério vem da régua
        g = dict(g)
        if tema.luz(rgb) > .65:
            g["claro"] = True
        grupos.append((g, rgb))

    fontes = t.get("fontes") or {}
    titulo = fontes.get("titulo", "Alegreya Sans")
    texto = fontes.get("texto", "Alegreya Sans")
    familias = list(dict.fromkeys([titulo, texto]))
    css_fontes, gfonts = tema.fontes(familias)
    art_css, ratio = tema.capa(base, cap.get("arquivo"))

    extra = [
        "--fd:'%s',%s" % (titulo, fontes.get("titulo_reserva", "Georgia,'Times New Roman',serif")),
        "--fb:'%s',%s" % (texto, fontes.get("texto_reserva", "'Segoe UI',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif")),
        "--textura:" + tema.textura(t.get("textura", "padrao"), pal),
    ]
    if fontes.get("titulo_escala"):
        # fonte larga (como a Cinzel) pede o título menor para caber em duas linhas
        extra.append("--ts:%s" % float(fontes["titulo_escala"]))
    if art_css:
        extra += [art_css, "--art-ratio:" + ratio]
        if cap.get("foco"):
            extra.append("--art-foco:" + cap["foco"])
        if cap.get("avatar"):
            extra.append("--ava-pos:" + cap["avatar"])
    else:
        extra.append("--art:none")
    root = tema.raiz_css(pal, [rgb for _, rgb in grupos], extra)
    todas = d["cards"] + d["cands"] + d["pool"]
    cores = tema.cores_cartas(todas, d["ident"])
    root += "".join(".c-%s{--cc:%s}" % (c["k"], c["c"]) for c in cores) + "\n"
    if not art_css:
        root += ".ava{display:none}\n"
    root += selos_legiveis(pal, t.get("modo") == "claro")
    if t.get("numeros_no_texto"):
        # fonte de título gótica ou só de contorno: o placar grande também vai para a fonte do texto (auditoria de layout)
        root += ".rosa .ctr-n,.score-big b{font-family:var(--fb);font-variant-numeric:tabular-nums}\n"

    cmd = next((c for c in d["cards"] if c.get("cmd")), None)
    curto = t.get("comandante_curto") or (cmd["n"].split(",")[0] if cmd else "")
    painel = t.get("painel") or pasta
    meta = dict(
        pasta=pasta, painel=painel, rev=t.get("rev", 1), feito=d["feito"],
        cmd=t.get("comandante_pt") or (cmd["n"] if cmd else ""), curto=curto, artigo=t.get("artigo", "o"),
        lede=t.get("lede", ""), verbos=t.get("verbos") or [], eixo=t.get("eixo"),
        capa=dict(moldura=cap.get("moldura", "retrato"), alt=cap.get("alt", ""), credito=cap.get("credito", "Arte da carta, © Wizards of the Coast"), tem=bool(art_css)),
        grafico=t.get("grafico", "padrao"), rotulos_curtos=t.get("rotulos_curtos") or None, curva=t.get("curva", "ogiva"), chave_antiga=t.get("chave_antiga", ""), modo=t.get("modo", "escuro"),
        gfonts=gfonts, ident=d["ident"], scryfall=d["scryfall_data"], img_padrao=(modo_img != "nenhuma"),
        regua=dados.regua_compacta(), v3=bool(d.get("v3")),
        sinergias=(t.get("sinergias") or None) if d.get("v3") else None,
        # a Oficina leva ao 8×8 do Grimório com este deck escolhido (só quando já houve leitura)
        grimorio=dict(href="00.%20Grim%C3%B3rio.html", pub=grimorio.link_publicado()) if os.path.exists(os.path.join(dados.DADOS, "grimorio", "grimorio.json")) else None,
        # e à Consulta: uma carta de fora contra todos os decks (página própria, ao lado do Grimório)
        consulta=dict(href="00.%20Consulta.html", pub=consulta.link_publicado()),
    )
    # v3: os dez critérios (aba Critérios e gráfico da página inicial), com a cor da régua; o 8×8 segue com os agrupamentos
    criterios = None
    if d.get("v3"):
        criterios = [dict(c, claro=True) if tema.luz(c["cor"]) > .65 else dict(c) for c in d["criterios"]]
    img = mapa_imagens(d["cards"] + d["cands"]) if modo_img == "embutidas" else None
    D = dict(meta=meta, grupos=[g for g, _ in grupos], criterios=criterios, marcadores=d["marcadores"], leituras=d["leituras"], cores=cores,
             banidas=d.get("banidas") or None,   # banidas no Commander no deck ou no radar: uma linha nas leituras
             tipos=dict(tema.TIPOS, **(t.get("tipos") or {})), cards=d["cards"], cands=d["cands"], pool=d["pool"],
             combos=d["combos"], edh=d["edh"], estrategia=d.get("estrategia"), img=(img or None),
             confrontos=d.get("confrontos"),   # listas de fora pontuadas na v3 (motor/confronto.py), aba Radar
             outros=d["outros"], em_pastas=d["em_pastas"], pastas_com_lista=d["pastas_com_lista"],
             # v3: onde cada carta do deck e do radar rende mais, em todos os decks v3 (gaveta da carta, caixa "Encaixe")
             encaixe=encaixe.para_painel(d, pasta, painel) if d.get("v3") else None,
             plano=plano.para_painel(pasta, d),   # o Plano do deck (motor/plano.py): veredito, checagens, cenários e as cartas por papel
             encaixe_decks=encaixe.decks_info(d, pasta, painel) if d.get("v3") else None)

    js = ler("app.js").replace("/*__DATA__*/null", json.dumps(D, ensure_ascii=False, separators=(",", ":")))
    js += chr(10) + ler(os.path.join("..", "comum", "ordenar.js"))   # ordenar tabela pelo cabeçalho (o mesmo do hub)
    # motivo votado (motor/painel/motivos/<grafico>.js): entra só no painel que o usa, antes do app.js
    motivo = os.path.join(PAINEL, "motivos", "%s.js" % t.get("grafico", "padrao"))
    if os.path.exists(motivo):
        js = ler(os.path.join("motivos", "%s.js" % t.get("grafico", "padrao"))) + "\n" + js
    html = (ler("template.html")
            .replace('<html lang="pt-BR">', '<html lang="pt-BR" class="claro">' if t.get("modo") == "claro" else '<html lang="pt-BR">')
            .replace("/*__TITULO__*/", "%s: painel do deck de %s" % (painel, curto))
            .replace("/*__PAINEL__*/", painel)
            .replace("/*__FONTS__*/", css_fontes)
            .replace("/*__ROOT__*/", root)
            .replace("/*__CSS__*/", ler("style.css"))
            .replace("/*__JS__*/", js.replace("</script", "<\\/script")))
    resumo = dict(cartas=sum(c["q"] for c in d["cards"]), unicas=len(d["cards"]), radar=len(d["cands"]), potenciais=len(d["pool"]),
                  kb=len(html.encode("utf-8")) / 1024, painel=painel)
    return html, resumo


def gravar(caminho, texto):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, "w", encoding="utf-8", newline="\n") as f:
        f.write(texto)


def atalho(pasta, painel):
    rel = os.path.relpath(SAIDAS, dados.pasta_deck(pasta)).replace(os.sep, "/")   # dados/decks/<grupo>/<pasta> -> ../../../../saidas
    alvo = rel + "/" + quote(pasta + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>%s</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir o painel %s</a></p>\n</body>\n</html>\n') % (painel, alvo, alvo, painel)


def montar_deck(pasta, atualizar_scryfall=False, modo_img="embutidas"):
    html, r = montar_html(pasta, atualizar_scryfall=atualizar_scryfall, modo_img=modo_img)
    mb = r["kb"] / 1024
    if mb > 15:
        raise dados.ErroDeck("o HTML ficou com %.1f MB; o teto da página publicada é 16 MiB e o limite do projeto é 15 MB" % mb)
    gravar(os.path.join(SAIDAS, pasta + ".html"), html)
    gravar(os.path.join(dados.pasta_deck(pasta), "Abrir o painel.html"), atalho(pasta, r["painel"]))
    print("%s: %s | cartas %d (%d únicas) | radar %d | potenciais %d | %.0f KB%s" % (
        pasta, r["painel"], r["cartas"], r["unicas"], r["radar"], r["potenciais"], r["kb"], "  AVISO: passou de 12 MB" if mb > 12 else ""))


def montar_hub():
    html, H = hub.montar()
    gravar(os.path.join(SAIDAS, hub.NOME + ".html"), html)
    gravar(os.path.join(RAIZ, "Abrir o Hub.html"), hub.atalho())
    prontos = sum(1 for d in H["decks"] if d["painel"])
    print("%s: %d decks, %d com painel | %.0f KB" % (hub.NOME, len(H["decks"]), prontos, len(html.encode("utf-8")) / 1024))


def montar_caixa(modo_img="embutidas"):
    """A Caixa: página própria, como um painel; avisa acima de aviso_mb e recusa acima de teto_mb (motor/caixa.json)."""
    R = caixa.regua()
    if not os.path.isdir(os.path.join(caixa.pasta_caixa(), "listas")):
        print("%s: sem dados/caixa/listas/, pulada" % caixa.NOME)
        return
    # uma página por lista: a Caixa e cada pasta com lista (00. Pasta <pasta>.html), como um painel por deck
    for origem in caixa.origens():
        html, cx = caixa.pagina(modo_img=modo_img, origem=origem)
        nome = caixa.nome_pagina(origem)
        mb = len(html.encode("utf-8")) / 1048576
        if mb > R["teto_mb"]:
            raise dados.ErroDeck("%s ficou com %.1f MB (teto %s MB): aplique decisões (/caixa aplicar) ou divida as listas em lotes" % (nome, mb, R["teto_mb"]))
        gravar(os.path.join(SAIDAS, nome + ".html"), html)
        r = cx["resumo"]
        print("%s: %d cartas, %d cópias | %.0f KB%s" % (nome, r["cartas"], r["copias"], mb * 1024,
                                                      "  AVISO: passou de %s MB" % R["aviso_mb"] if mb > R["aviso_mb"] else ""))
    gravar(os.path.join(RAIZ, "Abrir a Caixa.html"), caixa.atalho())


def montar_grimorio():
    """O Grimório: página própria (motor/grimorio/), a partir de dados/grimorio/grimorio.json. O orçamento (lentes.json,
    14 MB) é aplicado dentro de grimorio.pagina: acima dele, a galeria cai para qualidade 60 e depois o teto por lente, com aviso."""
    if not grimorio.ler_grimorio():
        print("%s: sem dados/grimorio/grimorio.json (rode python motor/grimorio.py --ler), pulado" % grimorio.NOME)
        return
    html, r = grimorio.pagina()
    gravar(os.path.join(SAIDAS, grimorio.NOME + ".html"), html)
    gravar(os.path.join(RAIZ, "Abrir o Grimório.html"), grimorio.atalho())
    print("%s: %d cartas em %d lentes | galeria %d px, qualidade %d%s | %.0f KB%s" % (
        grimorio.NOME, r["cartas"], r["lentes"], r["largura"], r["qualidade"], (" | teto %d+%d" % tuple(r["teto"])) if r.get("teto_reduzido") else "",
        r["kb"], "".join("  AVISO: " + a for a in r["avisos"])))


def decks():
    out = []
    for n in dados.pastas_decks():
        if not dados.eh_deck(n):
            continue
        out.append(n)
    return out


def montar_consulta():
    """A Consulta: página própria (motor/consulta/), com as consultas registradas em dados/consultas/ que já têm o estudo."""
    html, r = consulta.pagina()
    gravar(os.path.join(SAIDAS, consulta.NOME + ".html"), html)
    gravar(os.path.join(RAIZ, "Abrir a Consulta.html"), consulta.atalho())
    print("%s: %d consultas com estudo, %d decks | dados %.0f KB sem imagens | %.0f KB" % (consulta.NOME, r["registros"], r["decks"], r["kb_dados"], r["kb"]))


def montar_ciclos():
    """Os Ciclos: página própria (motor/ciclos/), a partir de dados/ciclos/ciclos-lido.json (python motor/ciclos.py --ler)."""
    if not ciclos.ler_lido():
        print("%s: sem dados/ciclos/ciclos-lido.json (rode python motor/ciclos.py --ler), pulados" % ciclos.NOME)
        return
    html, r = ciclos.pagina()
    gravar(os.path.join(SAIDAS, ciclos.NOME + ".html"), html)
    gravar(os.path.join(RAIZ, "Abrir os Ciclos.html"), ciclos.atalho())
    print("%s: %d cartas em %d ciclos de %d coleções | %.0f KB | imagens: %d folhas, %.0f MB em saidas/%s/" % (
        ciclos.NOME, r["cartas"], r["ciclos"], r["colecoes"], r["kb"], r["folhas"], r["mb_img"], ciclos.DIR_IMG))
    for a in r.get("avisos") or []:
        print("  aviso: " + a)


def main():
    ap = argparse.ArgumentParser(description="Monta os painéis dos decks.")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--deck", help="nome da pasta do deck, como em dados/")
    g.add_argument("--todos", action="store_true", help="todos os decks de dados/ que já têm avaliação, e o hub no fim")
    g.add_argument("--hub", action="store_true", help="só o hub, saidas/00. Hub.html")
    g.add_argument("--caixa", action="store_true", help="só a Caixa, saidas/00. Caixa.html")
    g.add_argument("--grimorio", action="store_true", help="só o Grimório, saidas/00. Grimório.html")
    g.add_argument("--consulta", action="store_true", help="só a Consulta, saidas/00. Consulta.html")
    g.add_argument("--ciclos", action="store_true", help="só os Ciclos, saidas/00. Ciclos.html")
    ap.add_argument("--atualizar-scryfall", action="store_true", help="consulta o Scryfall de novo, mesmo para cartas no cache")
    ap.add_argument("--imagens", choices=MODOS_IMG, default="embutidas", help="embutidas (padrão): lê cache/img/; externas: tenta o Scryfall ao vivo; nenhuma: sem imagens, nem ao vivo")
    a = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    erros = 0
    if a.hub:
        montar_hub()
        sys.exit(0)
    if a.caixa:
        try:
            montar_caixa(a.imagens)
        except (dados.ErroDeck, scryfall.ErroScryfall) as e:
            print("%s: ERRO: %s" % (caixa.NOME, e), file=sys.stderr)
            sys.exit(1)
        sys.exit(0)
    if a.grimorio:
        try:
            montar_grimorio()
        except (dados.ErroDeck, scryfall.ErroScryfall) as e:
            print("00. Grimório: ERRO: %s" % e, file=sys.stderr)
            sys.exit(1)
        sys.exit(0)
    if a.ciclos:
        try:
            montar_ciclos()
        except (dados.ErroDeck, scryfall.ErroScryfall) as e:
            print("%s: ERRO: %s" % (ciclos.NOME, e), file=sys.stderr)
            sys.exit(1)
        sys.exit(0)
    if a.consulta:
        try:
            montar_consulta()
        except (dados.ErroDeck, scryfall.ErroScryfall, consulta.ErroConsulta) as e:
            print("%s: ERRO: %s" % (consulta.NOME, e), file=sys.stderr)
            sys.exit(1)
        sys.exit(0)
    alvos = decks() if a.todos else [a.deck]
    if a.todos:
        sem = [p for p in alvos if not os.path.exists(os.path.join(dados.pasta_deck(p), "avaliacao.json"))]
        alvos = [p for p in alvos if p not in sem]
        if sem:
            print("%d pastas ainda sem avaliacao.json, puladas" % len(sem))
    for pasta in alvos:
        try:
            montar_deck(pasta, a.atualizar_scryfall, a.imagens)
        except (dados.ErroDeck, scryfall.ErroScryfall, ValueError) as e:
            erros += 1
            print("%s: ERRO: %s" % (pasta, e), file=sys.stderr)
    if a.todos:
        try:
            montar_caixa(a.imagens)
        except (dados.ErroDeck, scryfall.ErroScryfall) as e:
            erros += 1
            print("%s: ERRO: %s" % (caixa.NOME, e), file=sys.stderr)
        try:
            montar_grimorio()
        except (dados.ErroDeck, scryfall.ErroScryfall) as e:
            erros += 1
            print("00. Grimório: ERRO: %s" % e, file=sys.stderr)
        try:
            montar_consulta()
        except (dados.ErroDeck, scryfall.ErroScryfall, consulta.ErroConsulta) as e:
            erros += 1
            print("%s: ERRO: %s" % (consulta.NOME, e), file=sys.stderr)
        try:
            montar_ciclos()
        except (dados.ErroDeck, scryfall.ErroScryfall) as e:
            erros += 1
            print("%s: ERRO: %s" % (ciclos.NOME, e), file=sys.stderr)
        montar_hub()
    sys.exit(1 if erros else 0)


if __name__ == "__main__":
    main()
