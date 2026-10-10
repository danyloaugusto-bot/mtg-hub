# -*- coding: utf-8 -*-
"""Monta o painel de um deck, de todos, ou o hub.

    python motor/build.py --deck "02. Clavileño"
    python motor/build.py --todos          # todos os decks com avaliação, e o hub no fim
    python motor/build.py --hub            # só o hub

Gera saidas/<pasta>.html e dados/<pasta>/Abrir o painel.html; o hub gera saidas/00. Hub.html e Abrir o Hub.html na raiz.
Sempre com quebra de linha LF,
para que montar no Windows e no Mac dê o mesmo arquivo.
"""
import argparse, base64, json, os, sys
from urllib.parse import quote

sys.dont_write_bytecode = True
MOTOR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, MOTOR)

import dados, hub, imagens, scryfall, tema  # noqa: E402

RAIZ = os.path.dirname(MOTOR)
SAIDAS = os.path.join(RAIZ, "saidas")
PAINEL = os.path.join(MOTOR, "painel")
CACHE_IMG = os.path.join(RAIZ, "cache", "img")
MOLDURAS = ("larga", "retrato")
GRAFICOS = ("rosacea", "fios", "chamas", "estandartes", "alfinetes", "rebites", "espinhos", "presas", "asas", "padrao")
CURVAS = ("ogiva", "barra")
TEXTURAS = ("vitral", "fios", "impacto", "brasao", "papel", "colmeia", "ogivas", "neve", "padrao", "nenhuma")
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
    base = os.path.join(dados.DADOS, pasta)
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
        rgb = cores_g.get(g["k"]) or tema.CORES_G[i % len(tema.CORES_G)]
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

    cmd = next((c for c in d["cards"] if c.get("cmd")), None)
    curto = t.get("comandante_curto") or (cmd["n"].split(",")[0] if cmd else "")
    painel = t.get("painel") or pasta
    meta = dict(
        pasta=pasta, painel=painel, rev=t.get("rev", 1), feito=d["feito"],
        cmd=t.get("comandante_pt") or (cmd["n"] if cmd else ""), curto=curto, artigo=t.get("artigo", "o"),
        lede=t.get("lede", ""), verbos=t.get("verbos") or [], eixo=t.get("eixo"),
        capa=dict(moldura=cap.get("moldura", "retrato"), alt=cap.get("alt", ""), credito=cap.get("credito", "Arte da carta, © Wizards of the Coast"), tem=bool(art_css)),
        grafico=t.get("grafico", "padrao"), curva=t.get("curva", "ogiva"), chave_antiga=t.get("chave_antiga", ""), modo=t.get("modo", "escuro"),
        gfonts=gfonts, ident=d["ident"], scryfall=d["scryfall_data"], img_padrao=(modo_img != "nenhuma"),
    )
    img = mapa_imagens(d["cards"] + d["cands"]) if modo_img == "embutidas" else None
    D = dict(meta=meta, grupos=[g for g, _ in grupos], marcadores=d["marcadores"], leituras=d["leituras"], cores=cores,
             tipos=dict(tema.TIPOS, **(t.get("tipos") or {})), cards=d["cards"], cands=d["cands"], pool=d["pool"],
             combos=d["combos"], edh=d["edh"], estrategia=d.get("estrategia"), img=(img or None))

    js = ler("app.js").replace("/*__DATA__*/null", json.dumps(D, ensure_ascii=False, separators=(",", ":")))
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
    alvo = "../../saidas/" + quote(pasta + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>%s</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir o painel %s</a></p>\n</body>\n</html>\n') % (painel, alvo, alvo, painel)


def montar_deck(pasta, atualizar_scryfall=False, modo_img="embutidas"):
    html, r = montar_html(pasta, atualizar_scryfall=atualizar_scryfall, modo_img=modo_img)
    mb = r["kb"] / 1024
    if mb > 15:
        raise dados.ErroDeck("o HTML ficou com %.1f MB; o teto da página publicada é 16 MiB e o limite do projeto é 15 MB" % mb)
    gravar(os.path.join(SAIDAS, pasta + ".html"), html)
    gravar(os.path.join(dados.DADOS, pasta, "Abrir o painel.html"), atalho(pasta, r["painel"]))
    print("%s: %s | cartas %d (%d únicas) | radar %d | potenciais %d | %.0f KB%s" % (
        pasta, r["painel"], r["cartas"], r["unicas"], r["radar"], r["potenciais"], r["kb"], "  AVISO: passou de 12 MB" if mb > 12 else ""))


def montar_hub():
    html, H = hub.montar()
    gravar(os.path.join(SAIDAS, hub.NOME + ".html"), html)
    gravar(os.path.join(RAIZ, "Abrir o Hub.html"), hub.atalho())
    prontos = sum(1 for d in H["decks"] if d["painel"])
    print("%s: %d decks, %d com painel | %.0f KB" % (hub.NOME, len(H["decks"]), prontos, len(html.encode("utf-8")) / 1024))


def decks():
    out = []
    for n in sorted(os.listdir(dados.DADOS)):
        if not dados.eh_deck(n):
            continue
        out.append(n)
    return out


def main():
    ap = argparse.ArgumentParser(description="Monta os painéis dos decks.")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--deck", help="nome da pasta do deck, como em dados/")
    g.add_argument("--todos", action="store_true", help="todos os decks de dados/ que já têm avaliação, e o hub no fim")
    g.add_argument("--hub", action="store_true", help="só o hub, saidas/00. Hub.html")
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
    alvos = decks() if a.todos else [a.deck]
    if a.todos:
        sem = [p for p in alvos if not os.path.exists(os.path.join(dados.DADOS, p, "avaliacao.json"))]
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
        montar_hub()
    sys.exit(1 if erros else 0)


if __name__ == "__main__":
    main()
