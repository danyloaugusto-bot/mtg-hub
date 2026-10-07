# -*- coding: utf-8 -*-
import re, json, base64, unicodedata, importlib, sys, os
sys.path.insert(0, os.path.dirname(__file__))
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
import annot, edh
importlib.reload(annot); importlib.reload(edh)
from parse import load

FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts") + "/"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist", "ritos-de-sangue.html")

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

SUB = {"Vampire": "Vampiro", "Cleric": "Clérigo", "Noble": "Nobre", "Knight": "Cavaleiro", "Soldier": "Soldado",
       "Spirit": "Espírito", "Phyrexian": "Phyrexiano", "Horror": "Horror", "Human": "Humano", "Advisor": "Conselheiro",
       "Wizard": "Mago", "Assassin": "Assassino", "God": "Deus", "Golem": "Golem", "Aetherborn": "Etergênito",
       "Warlock": "Bruxo", "Sorin": "Sorin", "Siege": "Cerco", "Aura": "Aura", "Equipment": "Equipamento",
       "Plains": "Planície", "Swamp": "Pântano", "Pirate": "Pirata", "Warrior": "Guerreiro", "Ally": "Aliado", "Shaman": "Xamã"}

def typeinfo(types):
    w = types.split()
    leg = "Legendary" in w
    basic = "Basic" in w
    mains = [x for x in w if x in ("Creature", "Artifact", "Enchantment", "Land", "Instant", "Sorcery", "Planeswalker", "Battle")]
    subs = [x for x in w if x not in mains and x not in ("Legendary", "Basic")]
    if "Creature" in mains:
        t = "cri"; base = "Criatura Artefato" if "Artifact" in mains else "Criatura"; fem = True
    elif "Land" in mains:
        t = "ter"; base = "Terreno"; fem = False
    elif "Planeswalker" in mains:
        t = "pw"; base = "Planeswalker"; fem = False
    elif "Battle" in mains:
        t = "bat"; base = "Batalha"; fem = True
    elif "Instant" in mains:
        t = "ins"; base = "Mágica Instantânea"; fem = True
    elif "Sorcery" in mains:
        t = "fei"; base = "Feitiço"; fem = False
    elif "Artifact" in mains:
        t = "art"; base = "Artefato"; fem = False
    else:
        t = "enc"; base = "Encantamento"; fem = False
    line = base
    if leg:
        line += " Lendária" if fem else " Lendário"
    if basic:
        line += " Básico"
    if subs:
        line += " — " + " ".join(SUB.get(x, x) for x in subs)
    return t, line, leg, ("Vampire" in subs)

def cost_fmt(mc):
    if not mc or mc == "no cost":
        return "", 0, set()
    out = []; cmc = 0; cols = set()
    for tok in mc.split():
        if tok.isdigit():
            out.append("{%s}" % tok); cmc += int(tok)
        elif tok == "X":
            out.append("{X}")
        elif len(tok) == 2 and all(ch in "WUBRG" for ch in tok):
            out.append("{%s/%s}" % (tok[0], tok[1])); cmc += 1; cols.update(tok)
        elif tok in "WUBRG":
            out.append("{%s}" % tok); cmc += 1; cols.add(tok)
        elif tok == "C":
            out.append("{C}"); cmc += 1
        else:
            raise ValueError("custo desconhecido: " + mc)
    return "".join(out), cmc, cols

GROUP_OF = {"cri": "cri", "pw": "pw", "bat": "bat", "ins": "mag", "fei": "mag", "art": "art", "enc": "enc", "ter": "ter"}

def build_card(name, ann, q=1, setc=None, num=None, foil=False, cmd=False):
    faces = load(name)
    f = faces[0]
    t, line, leg, vamp = typeinfo(f["Types"])
    cost, cmc, cols = cost_fmt(f.get("ManaCost"))
    if t == "ter":
        col = "L"
    elif cols == {"W"}:
        col = "W"
    elif cols == {"B"}:
        col = "B"
    elif cols == {"W", "B"}:
        col = "WB"
    elif not cols:
        col = "C"
    else:
        col = "".join(sorted(cols))
    d = dict(id=slug(name), n=name, q=q, cost=cost, cmc=cmc, t=t, g=("cmd" if cmd else GROUP_OF[t]),
             line=line, col=col, s=ann["s"], tier=ann["tier"], rel=ann["rel"], fx=ann["fx"], why=ann["why"])
    stat = f.get("PT") or f.get("Loyalty") or f.get("Defense")
    if stat:
        d["pt"] = stat
        if t == "pw": d["ptl"] = "Lealdade"
        if t == "bat": d["ptl"] = "Defesa"
    if leg: d["leg"] = 1
    if vamp: d["vamp"] = 1
    if t == "ter": d["land"] = 1
    if setc: d["set"] = setc
    if num: d["num"] = num
    if foil: d["foil"] = 1
    if cmd: d["cmd"] = 1
    # verso
    if len(faces) > 1:
        b = faces[1]
        if b.get("Name") and b.get("Name") != "None":
            bt, bline, _, _ = typeinfo(b["Types"])
            d["back"] = dict(n=b["Name"], line=bline)
            if bt == "ter" and t != "ter" and f.get("AlternateMode") == "Modal":
                d["mdfc"] = 1
        elif f.get("AlternateMode") == "Prepare":
            spell = {"Emeritus of Woe": "Demonic Tutor", "Scheming Silvertongue": "Sign in Blood"}[name]
            d["back"] = dict(n=spell, line="Feitiço (mágica preparada)")
    for k in ("prod", "tapped", "wipe", "outlet", "drain", "verdict", "pri"):
        if ann.get(k):
            d[k] = (1 if ann[k] is True else ann[k])
    if f.get("AlternateMode") in ("DoubleFaced", "Modal") and d.get("back"):
        d["dfc"] = 1
    if name in edh.E:
        syn, sid = edh.E[name]
        assert re.fullmatch(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", sid), name
        if syn is not None: d["syn"] = syn
        d["sid"] = sid
    return d

def main():
    cards = []
    for l in open(os.path.join(os.path.dirname(__file__), "decklist.txt"), encoding="utf8"):
        m = re.match(r"(\d+) (.+?) \((\w+)\) (\S+)(.*)", l.strip())
        q, name, setc, num, rest = int(m.group(1)), m.group(2), m.group(3), m.group(4), m.group(5)
        cards.append(build_card(name, annot.A[name], q, setc, num, "*F*" in rest, "*CMDR*" in rest))
    ids = {c["n"]: c["id"] for c in cards}
    cands = []
    for name, ann in annot.R.items():
        c = build_card(name, ann)
        c["cand"] = 1
        if ann.get("sai"):
            c["sai"] = ids[ann["sai"]]
        cands.append(c)
    ids.update({c["n"]: c["id"] for c in cands})
    combos = [dict(n=x["n"], kind=x["kind"], p=[ids[p] for p in x["p"]], t=x["t"]) for x in annot.COMBOS]
    data = dict(cards=cards, cands=cands, combos=combos,
                edh=dict(themes=[list(x) for x in edh.THEMES], extra=[list(x) for x in edh.EXTRA], url=edh.URL, date=edh.DATE),
                meta=dict(feito="07/10/2026", cmd="Clavileño, Primeiro dos Abençoados"))
    from PIL import Image
    import io
    im = Image.open(os.path.join(HERE, "assets", "clavileno.png")).convert("RGB")
    buf = io.BytesIO(); im.save(buf, "JPEG", quality=86, optimize=True, progressive=True)
    art = ":root{--art:url(data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode() + ")}"
    print("arte: %.0f KB em JPEG" % (len(buf.getvalue()) / 1024))

    def b64(p):
        return base64.b64encode(open(p, "rb").read()).decode()
    fonts = ""
    for w in (600, 800):
        fonts += "@font-face{font-family:'Grenze Gotisch';font-style:normal;font-weight:%d;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n" % (
            w, b64(FONTS + "grenze-gotisch/files/grenze-gotisch-latin-%d-normal.woff2" % w))
    for w, st in ((400, "normal"), (400, "italic"), (500, "normal"), (700, "normal"), (800, "normal")):
        fonts += "@font-face{font-family:'Alegreya Sans';font-style:%s;font-weight:%d;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n" % (
            st, w, b64(FONTS + "alegreya-sans/files/alegreya-sans-latin-%d-%s.woff2" % (w, st)))

    here = os.path.dirname(__file__)
    tpl = open(os.path.join(here, "template.html"), encoding="utf8").read()
    css = open(os.path.join(here, "style.css"), encoding="utf8").read()
    js = open(os.path.join(here, "app.js"), encoding="utf8").read()
    js = js.replace("/*__DATA__*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    html = tpl.replace("/*__FONTS__*/", fonts).replace("/*__ART__*/", art).replace("/*__CSS__*/", css).replace("/*__JS__*/", js.replace("</script", "<\\/script"))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, "w", encoding="utf8").write(html)
    json.dump(data, open(os.path.join(here, "data.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
    tot = sum(c["q"] for c in cards)
    print("cartas:", tot, "| únicas:", len(cards), "| radar:", len(cands), "| html: %.0f KB" % (len(html.encode("utf8")) / 1024))

if __name__ == "__main__":
    main()
