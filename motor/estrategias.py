# -*- coding: utf-8 -*-
"""A página Estratégias (saidas/00. Estratégias.html): os digests do projeto em contexto/estrategias/*.md, escritos a partir do
material que o dono solta em dados/estratégias/<tema>/, e a tabela dos decks que já têm o bloco "Na mesa" da estratégia.

    python motor/build.py --estrategias

Sem preço. A página é estática: o que ela mostra vem dos .md e dos avaliacao.json no momento do build."""
import csv, html, json, os, re
from urllib.parse import quote

MOTOR = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(MOTOR)
import dados  # noqa: E402

NOME = "00. Estratégias"
DIGESTS = os.path.join(RAIZ, "contexto", "estrategias")
PASTA = os.path.join(dados.DADOS, "estratégias")   # o material bruto do dono; link.txt é o link da página publicada
ORCAMENTO_MB = 2


def link_publicado():
    try:
        with open(os.path.join(PASTA, "link.txt"), encoding="utf-8") as f:
            return f.read().strip() or None
    except OSError:
        return None


# ---------------------------------------------------------------- markdown, o bastante para os digests
_INLINE = [
    (re.compile(r"\*\*(.+?)\*\*"), r"<b>\1</b>"),
    (re.compile(r"`([^`]+)`"), r"<code>\1</code>"),
    (re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)"), r'<a href="\2" target="_blank" rel="noopener">\1</a>'),
]


def _inline(t):
    t = html.escape(t, quote=False)
    for rx, sub in _INLINE:
        t = rx.sub(sub, t)
    return t


def md_para_html(texto):
    """Títulos (##, ###), parágrafos, listas (- e 1.), tabelas (| a | b |) e negrito, código e link na linha. O # de primeiro
    nível vira o título da seção e não entra no corpo."""
    out, titulo = [], None
    linhas = texto.replace("\r\n", "\n").split("\n")
    i = 0

    def tabela(ls):
        cel = lambda l: [c.strip() for c in l.strip().strip("|").split("|")]
        cab = cel(ls[0])
        corpo = [cel(l) for l in ls[2:]] if len(ls) > 2 else []
        h = "<table><thead><tr>" + "".join("<th>%s</th>" % _inline(c) for c in cab) + "</tr></thead><tbody>"
        for r in corpo:
            h += "<tr>" + "".join("<td>%s</td>" % _inline(c) for c in r) + "</tr>"
        return h + "</tbody></table>"

    while i < len(linhas):
        l = linhas[i]
        if not l.strip():
            i += 1
            continue
        if l.startswith("# "):
            titulo = titulo or l[2:].strip()
            i += 1
            continue
        m = re.match(r"^(#{2,4})\s+(.*)", l)
        if m:
            n = len(m.group(1))
            out.append("<h%d>%s</h%d>" % (n, _inline(m.group(2)), n))
            i += 1
            continue
        if l.lstrip().startswith("|"):
            j = i
            while j < len(linhas) and linhas[j].lstrip().startswith("|"):
                j += 1
            out.append(tabela(linhas[i:j]))
            i = j
            continue
        if re.match(r"^\s*[-*]\s+", l) or re.match(r"^\s*\d+\.\s+", l):
            ordenada = bool(re.match(r"^\s*\d+\.\s+", l))
            itens = []
            while i < len(linhas) and (re.match(r"^\s*[-*]\s+", linhas[i]) or re.match(r"^\s*\d+\.\s+", linhas[i])):
                itens.append(re.sub(r"^\s*([-*]|\d+\.)\s+", "", linhas[i]))
                i += 1
            tag = "ol" if ordenada else "ul"
            out.append("<%s>%s</%s>" % (tag, "".join("<li>%s</li>" % _inline(x) for x in itens), tag))
            continue
        # parágrafo: junta as linhas até a próxima em branco
        par = [l]
        i += 1
        while i < len(linhas) and linhas[i].strip() and not re.match(r"^(#{1,4}\s|\s*[-*]\s|\s*\d+\.\s|\s*\|)", linhas[i]):
            par.append(linhas[i])
            i += 1
        out.append("<p>%s</p>" % _inline(" ".join(x.strip() for x in par)))
    return titulo, "\n".join(out)


def _slug(t):
    t = t.lower()
    for a, b in (("á", "a"), ("à", "a"), ("ã", "a"), ("â", "a"), ("é", "e"), ("ê", "e"), ("í", "i"), ("ó", "o"), ("ô", "o"), ("õ", "o"), ("ú", "u"), ("ç", "c")):
        t = t.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-") or "tema"


def temas():
    """Os digests, na ordem dos nomes de arquivo."""
    out = []
    if not os.path.isdir(DIGESTS):
        return out
    for f in sorted(os.listdir(DIGESTS)):
        if not f.endswith(".md"):
            continue
        with open(os.path.join(DIGESTS, f), encoding="utf-8") as h:
            titulo, corpo = md_para_html(h.read())
        out.append(dict(k=_slug(f[:-3]), titulo=titulo or f[:-3], corpo=corpo, arquivo=f))
    return out


def _links_publicados():
    inv = os.path.join(RAIZ, "contexto", "inventario.csv")
    out = {}
    try:
        with open(inv, encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f):
                if (r.get("link_publicado") or "").strip():
                    out[r["pasta"]] = r["link_publicado"].strip()
    except OSError:
        pass
    return out


def _primeira(t):
    t = (t or "").strip()
    m = re.match(r"(.+?[.!?])(\s|$)", t)
    return m.group(1) if m else t


def decks_na_mesa():
    """Por deck que já tem estrategia.mesa: pasta, nome, grupo, a primeira frase da leitura e da postura, e os links."""
    pub = _links_publicados()
    out = []
    for p in dados.pastas_decks():
        caminho = dados.pasta_deck(p)
        try:
            with open(os.path.join(caminho, "avaliacao.json"), encoding="utf-8") as f:
                av = json.load(f)
        except (OSError, ValueError):
            continue
        ms = ((av.get("estrategia") or {}).get("mesa")) or None
        grupo = os.path.basename(os.path.dirname(caminho))
        out.append(dict(pasta=p, nome=p.split(". ", 1)[-1], grupo=grupo if grupo.lower() != "decks" else "", tem=bool(ms),
                        leitura=_primeira(ms["leitura"]) if ms else "", postura=_primeira(ms["postura"]) if ms else "",
                        href=quote(p + ".html"), pub=pub.get(p)))
    return out


def _dados_pagina():
    import caixa, consulta, grimorio
    tem_g = os.path.exists(os.path.join(grimorio.PASTA, "grimorio.json"))
    return dict(hub=dict(href=quote("00. Hub.html"), pub=(caixa.regua().get("hub_publicado") or None)),
                caixa=dict(href=quote(caixa.NOME + ".html"), pub=caixa.link_publicado()) if os.path.isdir(os.path.join(caixa.pasta_caixa(), "listas")) else None,
                grimorio=dict(href=quote(grimorio.NOME + ".html"), pub=grimorio.link_publicado()) if tem_g else None,
                consulta=dict(href=quote(consulta.NOME + ".html"), pub=consulta.link_publicado()))


def pagina(avisar=print):
    """A página (html, resumo): a paleta e a barra do hub, o estilo do Grimório e o que é só dela."""
    import tema
    ts = temas()
    if not ts:
        raise dados.ErroDeck("sem digest em contexto/estrategias/*.md")
    ds = decks_na_mesa()
    pal = tema.paleta({"fundo": "#0f0f10", "painel": "#1b1b1d", "acento": "#d8b25a", "acento_claro": "#f1d58a", "texto": "#f2f0ec",
                       "suave": "#bdbab3", "apagado": "#8a877f", "destaque": "#d8b25a", "destaque_claro": "#f1d58a"})
    css_fontes, _ = tema.fontes(["Alegreya Sans", "Cinzel"])
    root = tema.raiz_css(pal, [], ["--fd:'Cinzel',Georgia,'Times New Roman',serif", "--fb:'Alegreya Sans','Segoe UI',system-ui,sans-serif"])

    def ler_arq(*partes):
        with open(os.path.join(MOTOR, *partes), encoding="utf-8") as f:
            return f.read()
    css = ler_arq("hub", "style.css") + chr(10) + ler_arq("grimorio", "style.css") + chr(10) + ler_arq("estrategias", "style.css")
    app, tpl = ler_arq("estrategias", "app.js"), ler_arq("estrategias", "template.html")

    nav = "".join('<a href="#%s" data-aba="%s">%s</a>' % (t["k"], t["k"], html.escape(t["titulo"])) for t in ts) + '<a href="#decks" data-aba="decks">Nos decks</a>'
    corpo = "".join('<section class="es-tema" id="%s"><h2>%s</h2>%s<p class="es-fonte">Fonte: <code>contexto/estrategias/%s</code>, a partir de <code>dados/estratégias/</code>.</p></section>'
                    % (t["k"], html.escape(t["titulo"]), t["corpo"], html.escape(t["arquivo"])) for t in ts)
    com = [d for d in ds if d["tem"]]
    linhas = "".join('<tr><td><a class="es-deck" data-pasta="%s" href="%s">%s</a><small>%s</small></td><td>%s</td><td>%s</td></tr>'
                     % (html.escape(d["pasta"]), d["href"], html.escape(d["nome"]), html.escape(d["grupo"]), html.escape(d["leitura"]), html.escape(d["postura"])) for d in com)
    sem = [d["nome"] for d in ds if not d["tem"]]
    decks_html = ('<section class="es-tema" id="decks"><h2>Nos decks</h2><p>%d de %d decks já têm o bloco "Na mesa" na Visão geral do painel: como a mesa lê o deck e a postura recomendada. A tabela mostra a primeira frase de cada um; o resto está no painel.</p>'
                  % (len(com), len(ds)) +
                  ('<table class="es-decks"><thead><tr><th>Deck</th><th>Como a mesa te lê</th><th>Postura</th></tr></thead><tbody>%s</tbody></table>' % linhas if com else "") +
                  ('<p class="es-fonte">Ainda sem o bloco: %s.</p>' % html.escape(", ".join(sem)) if sem else "") + "</section>")
    D = dict(_dados_pagina(), decks={d["pasta"]: d["pub"] for d in ds if d["pub"]}, gerado=__import__("datetime").date.today().strftime("%d/%m/%Y"))
    js = app.replace("/*__DATA__*/null", json.dumps(D, ensure_ascii=False, separators=(",", ":")))
    out = (tpl.replace("/*__FONTS__*/", css_fontes).replace("/*__ROOT__*/", root).replace("/*__CSS__*/", css)
           .replace("<!--__NAV__-->", nav).replace("<!--__CORPO__-->", corpo + decks_html)
           .replace("/*__JS__*/", js.replace("</script", "<\\/script")))
    kb = len(out.encode("utf-8")) / 1024
    avisos = ["acima do orçamento de %d MB: %.0f KB" % (ORCAMENTO_MB, kb)] if kb > ORCAMENTO_MB * 1024 else []
    return out, dict(temas=len(ts), decks=len(com), total=len(ds), kb=kb, avisos=avisos)


def atalho():
    alvo = "saidas/" + quote(NOME + ".html")
    return ('<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Estratégias</title>\n'
            '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n<body>\n'
            '<p><a href="%s">Abrir as Estratégias</a></p>\n</body>\n</html>\n') % (alvo, alvo)
