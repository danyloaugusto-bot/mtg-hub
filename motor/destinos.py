"""Destinos: onde cada carta dos decks renderia mais, fora dos decks que já a têm (pedido do dono, 12/11/2026).

O dono clica numa carta e quer saber em que outro deck ela teria desempenho excelente, ou onde falta uma carta como ela:
os três melhores decks, cada um com a letra da tier list, o ganho no placar, quem sairia (carta da mesma função, nunca S ou
A) e o porquê. E, no deck de onde ela sairia, a melhor carta do radar para a vaga.

Duas etapas por lote de cartas, feitas por um agente com o roteiro de contexto/destinos/BRIEF-DESTINOS.md:
  1. --dossie / --sinergias: as duas sinergias da carta em cada deck nas cores dela, pela régua de cada deck (as que o
     radar ou a Caixa já avaliaram não se refazem). Com isso o ganho deixa de ser piso.
  2. --dossie-lentes / --lentes: para os três decks de maior ganho, a função, as cinco lentes da tier list com a frase de
     cada uma e o porquê; a letra sai da régua (motor/tier.py), com os pesos do grupo do deck de destino.

Dados: dados/destinos/destinos.json. Este comando não grava em deck, radar, cadastro nem decklist.
"""
import argparse
import datetime
import io
import json
import os
import sys

MOTOR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, MOTOR)
import caixa, dados, encaixe, tier  # noqa: E402

ARQ = os.path.join(dados.DADOS, "destinos", "destinos.json")
BASICOS = {"Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes", "Snow-Covered Plains", "Snow-Covered Island",
           "Snow-Covered Swamp", "Snow-Covered Mountain", "Snow-Covered Forest"}
# decisões do dono por deck que vetam um tipo de carta como destino
def _pedra(nome):
    """Pedra de mana: artefato que não é criatura e gera mana ("Add {")."""
    x = _textos().get(nome) or {}
    tp = x.get("tipo") or ""
    import re
    return "Artifact" in tp and "Creature" not in tp and bool(re.search(r"Add (\{|\w+ mana|an amount of)", x.get("texto") or ""))


VETOS = {"01. Markov": (_pedra, "sem pedras de mana")}   # deck.md do Markov, decisão do dono

# nunca sugeridas em troca, compra ou deck (regra do dono): não ganham destino
NUNCA = {"Sol Ring", "Arcane Signet", "Tergrid, God of Fright"}
LOTE = 30
TOP = 3
PASTAS = ("Preta P",)   # pastas cujas cartas também ganham destinos (pedido do dono, 13/11/2026); a Preta P é lista do projeto


class ErroDestinos(Exception):
    pass


def _hoje():
    return datetime.date.today().isoformat()


def ler():
    if os.path.exists(ARQ):
        with open(ARQ, encoding="utf-8") as f:
            return json.load(f)
    return {"versao": 1, "cartas": {}}


class _Trava:
    """Vários agentes gravam em paralelo: a leitura e a gravação de destinos.json passam por esta trava (arquivo .trava)."""
    def __enter__(self):
        import time
        os.makedirs(os.path.dirname(ARQ), exist_ok=True)
        self.p = ARQ + ".trava"
        for _ in range(2400):
            try:
                self.fd = os.open(self.p, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
                return self
            except FileExistsError:
                time.sleep(0.5)
        raise ErroDestinos("destinos.json travado há 20 minutos: apague %s se nenhum agente estiver gravando" % self.p)

    def __exit__(self, *a):
        os.close(self.fd)
        os.remove(self.p)


def gravar(d):
    os.makedirs(os.path.dirname(ARQ), exist_ok=True)
    d["cartas"] = dict(sorted(d["cartas"].items(), key=lambda kv: kv[0].lower()))
    with open(ARQ, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(d, ensure_ascii=False, indent=1) + "\n")


# ---------------------------------------------------------------- o universo

_TEXTOS = None


def _textos():
    """Nome -> custo, tipo e texto, do cache do Scryfall (texto de carta nunca de memória)."""
    global _TEXTOS
    if _TEXTOS is None:
        with open(os.path.join(dados.RAIZ, "cache", "scryfall.json"), encoding="utf-8") as f:
            cs = json.load(f)["cartas"]
        _TEXTOS = {}
        for v in cs.values():
            n = v.get("name")
            if not n or n in _TEXTOS:
                continue
            faces = v.get("card_faces") or v.get("faces") or []
            txt = v.get("oracle_text") or " // ".join(f.get("oracle_text", "") for f in faces)
            pt = v.get("power") is not None and "%s/%s" % (v.get("power"), v.get("toughness")) or " // ".join(
                "%s/%s" % (f.get("power"), f.get("toughness")) for f in faces if f.get("power") is not None) or None
            _TEXTOS[n] = dict(custo=v.get("mana_cost") or " // ".join(f.get("mana_cost", "") for f in faces), tipo=v.get("type_line"), texto=txt,
                              leg=v.get("leg"), **({"forca_resistencia": pt} if pt else {}))
            _TEXTOS.setdefault(n.split(" // ")[0], _TEXTOS[n])
    return _TEXTOS


def _base(nome):
    return nome.split(" // ")[0]


_UNI = None


def universo():
    """As cartas dos decks físicos (sem básicos e comandantes), na ordem dos decks: {nome: {carta, decks}}."""
    global _UNI
    if _UNI is not None:
        return _UNI
    out = {}
    for m in encaixe.decks_v3():
        for c in m["cards"]:
            nome = _base(c.get("on", c["n"]))
            if c.get("cmd") or nome in BASICOS or nome in NUNCA:
                continue
            u = out.setdefault(nome, dict(carta=c, decks=[]))
            u["decks"].append(m["pasta"])
    # as cartas das pastas em PASTAS (Preta P), também as que já estão em deck (a cópia da pasta tem destino próprio)
    tx = _textos()
    for pasta in PASTAS:
        copias, _ = caixa.ler_pasta(pasta)
        for cp in copias:
            nome = _base(cp["nome"])
            if nome in BASICOS or nome in NUNCA or encaixe.identidade(nome) is None:
                continue
            if (tx.get(nome) or {}).get("leg") == "banned":   # banida no Commander não vai a deck nenhum (Dockside, Mana Crypt)
                continue
            if nome not in out:
                tipo = (tx.get(nome) or {}).get("tipo") or ""
                frente, _, verso = tipo.partition(" // ")
                land = "Land" in frente
                out[nome] = dict(carta=dict(n=nome, land=land, mdfc=bool(verso and "Land" in verso and not land)), decks=[])
            ps = out[nome].setdefault("pastas", [])
            if pasta not in ps:
                ps.append(pasta)
    _UNI = out
    return out


def _no_deck(m, nome):
    return any(_base(c.get("on", c["n"])) == nome for c in m["cards"])


def _no_radar(m, nome):
    return next((c for c in m["cands"] if _base(c.get("on", c["n"])) == nome), None)


def alvos(nome):
    """Os decks em que a carta cabe (identidade de cor) e que ainda não a têm na lista."""
    ci = encaixe.identidade(nome)
    if ci is None:
        return []
    return [m for m in encaixe.decks_v3() if all(ch in (m.get("ident") or "") for ch in ci) and not _no_deck(m, nome)]


def _sin_conhecida(m, nome, d):
    """A sinergia já avaliada da carta neste deck: a do radar, a da Caixa e das pastas, ou a deste comando. None se falta."""
    r = _no_radar(m, nome)
    if r is not None:
        return dict(sin=[r["s3"][0], r["s3"][1]], de="radar")
    av = (m.get("avaliadas") or {}).get(nome)
    if av:
        return dict(sin=list(av["sin"]), de="caixa")
    x = ((d["cartas"].get(nome) or {}).get("sin") or {}).get(m["pasta"])
    if x:
        return dict(sin=list(x["sin"]), de="destinos")
    return None


# ---------------------------------------------------------------- a conta

def _s3(nome, m, sin, cad):
    r = _no_radar(m, nome)
    if r is not None:
        return list(r["s3"])
    _, ks, _, _, _ = encaixe._regua()
    e = cad.get(nome)
    if e is None:
        return None
    return list(sin) + [e["n"].get(k, 0) for k in ks[2:]]


def _busca_terreno(c):
    """Terreno que se sacrifica para buscar outro (fetch): nunca sai (regra do dono, como no /colecao)."""
    if not c.get("land"):
        return False
    x = ((_textos().get(_base(c.get("on", c["n"]))) or {}).get("texto") or "").lower()
    return "sacrifice" in x and "search your library" in x


def corte(m, s3, carta):
    """Quem sairia: a carta mais fraca do deck que divide a função principal com a que entra (o critério da carta, fora as
    sinergias, com a maior nota), do mesmo lado (terreno por terreno), fora comandante, S, A e as que ficam por decisão do dono.
    Sem nenhuma da mesma função, a mais fraca do mesmo lado."""
    lados = encaixe._lados(carta)
    combo = {i for cb in m.get("combos") or [] for i in cb.get("p") or []}   # peça de combo do deck não sai (Dark Depths na Tergrid)
    base = [c for c in m["cards"] if not c.get("cmd") and not c.get("nocut") and not c.get("fica") and c["q"] == 1
            and c.get("tier") not in ("S", "A") and not c.get("mdfc") and c["id"] not in combo and not _busca_terreno(c) and encaixe._lados(c) & lados]
    if not base:
        return None
    top = max(s3[2:]) if s3 else 0
    funcao = [i for i in range(2, len(s3)) if top and s3[i] == top]
    mesma = [c for c in base if any(c["s3"][i] >= 1 for i in funcao)]
    # a letra mais baixa sai primeiro (D, depois C, depois B); entre as da mesma letra, a de menor valor no placar
    return min(mesma or base, key=lambda c: ("DCB".find(c.get("tier") or "B"), encaixe.valor(c["s3"]), c["n"]))


def linha(nome, m, sin, cad, carta):
    """O destino da carta no deck m: ganho contra o corte da mesma função, quem sai e o que falta no deck que ela cobre."""
    _, ks, _, _, faixa = encaixe._regua()
    s3 = _s3(nome, m, sin, cad)
    if s3 is None:
        return None
    ctx = encaixe.contexto(m)
    sai = corte(m, s3, carta)
    vc = encaixe.valor(s3, ctx["mult"])
    vs = encaixe.valor(sai["s3"]) if sai else 0
    falta = [dict(k=ks[i], n=ctx["ncrit"][i], min=faixa[i][0]) for i in range(2, len(ks)) if s3[i] >= 2 and ctx["ncrit"][i] < faixa[i][0]]
    return dict(pasta=m["pasta"], painel=m.get("painel"), ganho=round(vc - vs, 2), valor=round(vc, 2), sai=sai["n"] if sai else None,
                sai_tier=sai.get("tier") if sai else None, valor_sai=round(vs, 2), falta=falta, sin=list(sin))


def ranking(nome, d, cad, carta):
    """Todos os destinos com sinergia conhecida, do maior ganho para o menor. Faltando alguma sinergia, None."""
    out = []
    for m in alvos(nome):
        s = _sin_conhecida(m, nome, d)
        if s is None:
            return None
        ln = linha(nome, m, s["sin"], cad, carta)
        if ln:
            ln["de"] = s["de"]
            out.append(ln)
    out.sort(key=lambda z: (-z["ganho"], z["pasta"]))
    return out


# ---------------------------------------------------------------- etapa 1: sinergias

def _reguas():
    out = {}
    for m in encaixe.decks_v3():
        t = dados.ler_json(os.path.join(dados.pasta_deck(m["pasta"]), "tema.json"), obrigatorio=False) or {}
        s = t.get("sinergias") or {}
        tx = _textos()
        cmds = {c["n"]: (tx.get(_base(c.get("on", c["n"]))) or {}).get("texto") for c in m["cards"] if c.get("cmd")}
        out[m["pasta"]] = dict(comandante=m.get("curto"), texto_comandante=cmds, ident=m.get("ident"), tema=(t.get("tema_jogo") or {}).get("nome"),
                               **{k: dict(nome=v.get("nome"), regra=v.get("regra")) for k, v in s.items() if k in ("sin1", "sin2")})
    return out


def _filtro_deck(u, deck, parte=None, i=0):
    if parte:
        k, n = parte
        if i % n != k:
            return False
    return deck is None or deck in u["decks"]


def dossie(arq, deck=None, tamanho=LOTE, avisar=print, parte=None):
    """O próximo lote de cartas com sinergia por avaliar em algum deck nas cores delas."""
    d = ler()
    cad = dados.ler_cadastro()
    tx = _textos()
    lote, faltam = [], 0
    for i, (nome, u) in enumerate(universo().items()):
        if not _filtro_deck(u, deck, parte, i):
            continue
        pedir = [m["pasta"] for m in alvos(nome) if _sin_conhecida(m, nome, d) is None]
        if not pedir:
            continue
        if len(lote) >= tamanho:
            faltam += 1
            continue
        t = tx.get(nome) or {}
        lote.append(dict(nome=nome, custo=t.get("custo"), tipo=t.get("tipo"), texto=t.get("texto"), forca_resistencia=t.get("forca_resistencia"),
                         cadastro=(cad.get(nome) or {}).get("n"), esta_em=u["decks"], decks=pedir))
    usados = sorted({p for c in lote for p in c["decks"]})
    rg = _reguas()
    out = dict(etapa="sinergias", gerado=_hoje(), faltam_depois=faltam, reguas={p: rg[p] for p in usados}, cartas=lote,
               responder=dict(comando="python motor/destinos.py --sinergias <arquivo>",
                              formato={"<carta>": {"<pasta>": {"sin": {"sin1": "0 a 3", "sin2": "0 a 3"}, "sin_por_que": {"sin1": "frase citando a régua"}}}},
                              regra="só os decks com sinergia acima de 0; os outros decks pedidos da carta ficam com 0 e 0"))
    with open(arq, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    avisar("destinos, sinergias: lote de %d cartas | faltam %d depois deste lote" % (len(lote), faltam))
    return out


def gravar_sinergias(arq, avisar=print):
    with open(arq, encoding="utf-8") as fh:
        j = json.load(fh)
    universo()   # monta os decks antes de pegar a trava (a montagem é a parte lenta)
    with _Trava():
        return _gravar_sinergias(j, avisar)


def _gravar_sinergias(j, avisar):
    d = ler()
    uni = universo()
    feitas = 0
    for nome, x in j.items():
        if nome.startswith("_"):
            continue
        if nome not in uni:
            raise ErroDestinos("%s não está em nenhum deck" % nome)
        cabem = [m["pasta"] for m in alvos(nome)]
        pedir = [m["pasta"] for m in alvos(nome) if _sin_conhecida(m, nome, d) is None]
        sobram = [p for p in x if p not in cabem]
        if sobram:
            raise ErroDestinos("%s: decks fora das cores, que já têm a carta, já avaliados ou inexistentes: %s" % (nome, ", ".join(sobram)))
        e = d["cartas"].setdefault(nome, {})
        sins = e.setdefault("sin", {})
        for p in pedir:
            y = x.get(p) or {}
            sin, pq = y.get("sin") or {}, y.get("sin_por_que") or {}
            for k in ("sin1", "sin2"):
                v = sin.get(k, 0)
                if not isinstance(v, int) or isinstance(v, bool) or not 0 <= v <= 3:
                    raise ErroDestinos("%s, %s: %s=%r; a nota vai de 0 a 3" % (nome, p, k, v))
                if v and not str(pq.get(k) or "").strip():
                    raise ErroDestinos("%s, %s: falta o porquê de %s" % (nome, p, k))
            sins[p] = dict(sin=[sin.get("sin1", 0), sin.get("sin2", 0)], **({"pq": {k: pq[k] for k in ("sin1", "sin2") if sin.get(k)}} if any(sin.values()) else {}))
        e["em"] = _hoje()
        feitas += 1
    gravar(d)
    avisar("destinos: sinergias de %d cartas gravadas" % feitas)
    return feitas


# ---------------------------------------------------------------- etapa 2: lentes

def _grupo(pasta):
    # grupo_de lê a pasta de grupo a partir da pasta do deck (o pai dela): 01. TOP, 02. TRIBAIS, 03. CAOS ou 04. FORFUN
    return tier.grupo_de(dados.pasta_deck(pasta))


def _letra(c, pasta):
    """Índice e letra, recalculados com os pesos do grupo do deck de destino (a letra não se guarda: sai da régua)."""
    i, l, _ = tier.letra(c, _grupo(pasta))
    return i, l


def _ficha_deck(m, cache={}):
    if m["pasta"] not in cache:
        _, ks, _, _, faixa = encaixe._regua()
        ctx = encaixe.contexto(m)
        conta = (m.get("tier_lista") or {}).get("conta") or ""
        tx = _textos()
        cmds = {c["n"]: (tx.get(_base(c.get("on", c["n"]))) or {}).get("texto") for c in m["cards"] if c.get("cmd")}
        cache[m["pasta"]] = dict(comandante=m.get("curto"), texto_comandante=cmds, grupo=_grupo(m["pasta"]), conta=conta, precon_intacto=bool((caixa.info_decks().get(m["pasta"]) or {}).get("precon")),
                                 contagens={ks[i]: "%d (faixa %d a %d)" % (ctx["ncrit"][i], faixa[i][0], faixa[i][1]) for i in range(2, len(ks))})
    return cache[m["pasta"]]


def top(nome, d, cad, carta):
    r = ranking(nome, d, cad, carta)
    return None if r is None else r[:TOP]


def dossie_lentes(arq, deck=None, tamanho=LOTE, avisar=print, parte=None):
    """O próximo lote de cartas com as sinergias completas e sem as lentes dos três melhores destinos."""
    d = ler()
    cad = dados.ler_cadastro()
    tx = _textos()
    D = {m["pasta"]: m for m in encaixe.decks_v3()}
    lote, faltam = [], 0
    for i, (nome, u) in enumerate(universo().items()):
        if not _filtro_deck(u, deck, parte, i):
            continue
        t3 = top(nome, d, cad, u["carta"])
        if not t3:
            continue
        feitas = (d["cartas"].get(nome) or {}).get("lentes") or {}
        pedir = [z for z in t3 if z["pasta"] not in feitas]
        if not pedir and (d["cartas"].get(nome) or {}).get("extras_em"):
            continue
        if len(lote) >= tamanho:
            faltam += 1
            continue
        t = tx.get(nome) or {}
        destinos = []
        for z in pedir:
            m = D[z["pasta"]]
            st = tx.get(z["sai"]) or {}
            destinos.append(dict(pasta=z["pasta"], ficha=_ficha_deck(m), sinergia=dict(zip(("sin1", "sin2"), z["sin"])), ganho=z["ganho"],
                                 falta_no_deck=["%s: %d, faixa a partir de %d" % (f["k"], f["n"], f["min"]) for f in z["falta"]],
                                 sai=dict(nome=z["sai"], tier=z["sai_tier"], texto=st.get("texto")) if z["sai"] else None,
                                 no_radar=(_no_radar(m, nome) or {}).get("verdict")))
        todos = ranking(nome, d, cad, u["carta"]) or []
        outros = [dict(pasta=z["pasta"], comandante=D[z["pasta"]].get("curto"), conta=_ficha_deck(D[z["pasta"]])["conta"][:160], ganho=z["ganho"],
                       sai=z["sai"], falta=["%s %d/%d" % (f["k"], f["n"], f["min"]) for f in z["falta"]])
                  for z in todos[TOP:] if z["pasta"] not in feitas]
        ja = {p: dict(letra=_letra(l, p)[1], sai=l.get("sai")) for p, l in feitas.items()}
        lote.append(dict(nome=nome, custo=t.get("custo"), tipo=t.get("tipo"), texto=t.get("texto"), forca_resistencia=t.get("forca_resistencia"),
                         cadastro=(cad.get(nome) or {}).get("n"), esta_em=u["decks"], destinos=destinos, ja_avaliados=ja, outros_decks=outros))
    out = dict(etapa="lentes", gerado=_hoje(), faltam_depois=faltam, regua=dict(lentes=tier.regua()["lentes"], funcoes=list(tier.regua()["funcoes"]),
               pesos=tier.regua()["pesos"], cortes=tier.regua()["cortes"], portao_s=tier.regua()["portao_s"], travas=tier.regua()["travas"]),
               cartas=lote,
               responder=dict(comando="python motor/destinos.py --lentes <arquivo>",
                              formato={"<carta>": {"<pasta>": {"funcao": "uma das funções", "lentes": {"E": "0 a 3", "I": "", "T": "", "Q": "", "R": ""},
                                                               "lentes_por_que": {"E": "frase", "I": "", "T": "", "Q": "", "R": ""},
                                                               "travas": "opcional, lista", "antissinergia": "opcional", "substituto": "com a trava de substituto",
                                                               "argumentos_s": "três frases, só se a letra der S",
                                                               "porque": "uma ou duas frases: por que ela rende (ou não) neste deck, no lugar de quem"}}},
                              extras="em 'outros_decks', até dois decks onde a carta teria letra melhor que a dos três de 'destinos' "
                                     "(encaixe que o placar não vê: deck de uma cor só, tipo pedido pela régua, falta no deck): avalie-os também, no mesmo formato"))
    with open(arq, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    avisar("destinos, lentes: lote de %d cartas | faltam %d depois deste lote" % (len(lote), faltam))
    return out


def dossie_pares(entrada, arq, avisar=print):
    """Revisão: o dossiê das lentes para pares escolhidos ({carta: [pasta, ...]}), com ou sem lente gravada."""
    with open(entrada, encoding="utf-8") as fh:
        pares = json.load(fh)
    d = ler()
    cad = dados.ler_cadastro()
    tx = _textos()
    uni = universo()
    D = {m["pasta"]: m for m in encaixe.decks_v3()}
    lote = []
    for nome, pastas in pares.items():
        u = uni.get(nome)
        if not u:
            raise ErroDestinos("%s não está em nenhum deck" % nome)
        rk = {z["pasta"]: z for z in (ranking(nome, d, cad, u["carta"]) or [])}
        le = (d["cartas"].get(nome) or {}).get("lentes") or {}
        sins = (d["cartas"].get(nome) or {}).get("sin") or {}
        destinos = []
        for p in pastas:
            z = rk.get(p)
            if not z:
                raise ErroDestinos("%s: %s não é destino possível (cores, já tem a carta ou sem sinergia completa)" % (nome, p))
            m = D[p]
            st = tx.get(z["sai"]) or {}
            destinos.append(dict(pasta=p, ficha=_ficha_deck(m), sinergia=dict(zip(("sin1", "sin2"), z["sin"])),
                                 sinergia_por_que=(sins.get(p) or {}).get("pq"), ganho=z["ganho"],
                                 falta_no_deck=["%s: %d, faixa a partir de %d" % (f["k"], f["n"], f["min"]) for f in z["falta"]],
                                 sai=dict(nome=z["sai"], tier=z["sai_tier"], texto=st.get("texto")) if z["sai"] else None,
                                 no_radar=(_no_radar(m, nome) or {}).get("verdict"), lente_gravada=le.get(p)))
        t = tx.get(nome) or {}
        lote.append(dict(nome=nome, custo=t.get("custo"), tipo=t.get("tipo"), texto=t.get("texto"), forca_resistencia=t.get("forca_resistencia"),
                         cadastro=(cad.get(nome) or {}).get("n"), esta_em=u["decks"], destinos=destinos))
    out = dict(etapa="revisao", gerado=_hoje(), regua=dict(lentes=tier.regua()["lentes"], funcoes=list(tier.regua()["funcoes"]),
               pesos=tier.regua()["pesos"], cortes=tier.regua()["cortes"], portao_s=tier.regua()["portao_s"], travas=tier.regua()["travas"]),
               cartas=lote, responder="mesmo formato do --lentes; cada par respondido substitui a lente gravada")
    with open(arq, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    avisar("destinos, revisão: %d cartas, %d pares" % (len(lote), sum(len(x["destinos"]) for x in lote)))
    return out


def corrigir_sinergias(arq, avisar=print):
    """Revisão: troca a sinergia já gravada aqui de um par ({carta: {pasta: {sin, sin_por_que}}}) e apaga a lente dele, para refazer.
    A sinergia que vem do radar ou da Caixa do deck não muda por aqui."""
    with open(arq, encoding="utf-8") as fh:
        j = json.load(fh)
    universo()
    with _Trava():
        d = ler()
        n = 0
        for nome, x in j.items():
            if nome.startswith("_"):
                continue
            e = d["cartas"].get(nome) or {}
            for p, y in x.items():
                if p not in (e.get("sin") or {}):
                    raise ErroDestinos("%s, %s: sinergia não gravada nos destinos (vem do deck ou não existe)" % (nome, p))
                sin, pq = y.get("sin") or {}, y.get("sin_por_que") or {}
                for k in ("sin1", "sin2"):
                    v = sin.get(k, 0)
                    if not isinstance(v, int) or isinstance(v, bool) or not 0 <= v <= 3:
                        raise ErroDestinos("%s, %s: %s=%r; a nota vai de 0 a 3" % (nome, p, k, v))
                    if v and not str(pq.get(k) or "").strip():
                        raise ErroDestinos("%s, %s: falta o porquê de %s" % (nome, p, k))
                e["sin"][p] = dict(sin=[sin.get("sin1", 0), sin.get("sin2", 0)], **({"pq": {k: pq[k] for k in ("sin1", "sin2") if sin.get(k)}} if any(sin.values()) else {}))
                (e.get("lentes") or {}).pop(p, None)
                n += 1
        gravar(d)
    avisar("destinos: %d sinergias corrigidas (as lentes desses pares saíram, para refazer)" % n)
    return n


def gravar_lentes(arq, avisar=print):
    with open(arq, encoding="utf-8") as fh:
        j = json.load(fh)
    universo()
    with _Trava():
        return _gravar_lentes(j, avisar)


def _gravar_lentes(j, avisar):
    d = ler()
    cad = dados.ler_cadastro()
    uni = universo()
    feitas = 0
    for nome, x in j.items():
        if nome.startswith("_"):
            continue
        e = d["cartas"].setdefault(nome, {})
        e["extras_em"] = _hoje()   # a carta passou pela pergunta dos extras (resposta vazia: nenhum deck melhor fora do top 3)
        le = e.setdefault("lentes", {})
        u = uni.get(nome)
        sai_agora = {z["pasta"]: z["sai"] for z in (ranking(nome, d, cad, u["carta"]) or [])} if u else {}
        for p, c in x.items():
            if not os.path.isdir(dados.pasta_deck(p)):
                raise ErroDestinos("%s: deck %s não existe" % (nome, p))
            g = _grupo(p)
            c = dict(c)
            if "lentes" not in c:
                raise ErroDestinos("%s, %s: faltam as lentes" % (nome, p))
            if not str(c.get("porque") or "").strip():
                raise ErroDestinos("%s, %s: falta o porquê" % (nome, p))
            try:
                i, l, _ = tier.letra(c, g)
            except (KeyError, TypeError):
                raise ErroDestinos("%s, %s: 'lentes' pede E, I, T, Q e R, cada uma de 0 a 3" % (nome, p))
            c["tier"] = l
            erro = tier.conferir(c, "%s em %s" % (nome, p), g)
            if erro:
                raise ErroDestinos(erro)
            c["indice"] = i
            c["em"] = _hoje()
            c["sai"] = sai_agora.get(p)
            le[p] = c
        feitas += 1
    gravar(d)
    avisar("destinos: lentes de %d cartas gravadas" % feitas)
    return feitas


# ---------------------------------------------------------------- painel

def _lista_destinos(nome, carta, d, cad):
    """Os três melhores destinos da carta (letra da tier list, ganho, quem sai, o que falta, porquê), na ordem do painel:
    a letra manda e o ganho desempata; D e os decks que recusaram a carta ficam fora. None sem as sinergias completas."""
    t3 = top(nome, d, cad, carta)
    if t3 is None:
        return None
    le = (d["cartas"].get(nome) or {}).get("lentes") or {}
    todos = ranking(nome, d, cad, carta) or []
    # deck em que o radar já recusou a carta (veredito fora, decisão tomada) não é destino
    Dk = {m["pasta"]: m for m in encaixe.decks_v3()}
    recusa = {z["pasta"] for z in todos if ((_no_radar(Dk[z["pasta"]], nome) or {}).get("verdict") == "fora")
              or (z["pasta"] in VETOS and VETOS[z["pasta"]][0](nome))}
    cands = [z for z in todos if z["pasta"] in le and z["pasta"] not in recusa] + [z for z in t3 if z["pasta"] not in le and z["pasta"] not in recusa]
    out = []
    for z in cands:
        y = dict(p=z["pasta"], n=z["painel"], g=z["ganho"], s=z["sai"], st=z["sai_tier"], f=["%s %d/%d" % (f["k"], f["n"], f["min"]) for f in z["falta"]])
        l = le.get(z["pasta"])
        if l:
            ix, lt = _letra(l, z["pasta"])
            y.update(t=lt, ix=ix, fn=l["funcao"], w=l["porque"])
        out.append(y)
    # a letra manda e o ganho desempata (o placar não vê encaixe: deck de uma cor só, por exemplo); D não é destino
    ordem = "SABCD"
    out = [y for y in out if y.get("t") != "D"]
    out.sort(key=lambda y: (ordem.index(y["t"]) if y.get("t") else 4, -y["g"]))
    return out[:TOP]


def para_nomes(nomes):
    """Os destinos de cartas avulsas, pelo nome (as cópias de uma pasta): {nome: [destinos]}, para a página da pasta mostrar a
    mesma tier list da gaveta do painel. Carta fora dos destinos (sem deck nem pasta em PASTAS) fica de fora."""
    d = ler()
    if not d["cartas"]:
        return {}
    cad = dados.ler_cadastro()
    uni = universo()
    out = {}
    for nome in nomes:
        nome = _base(nome)
        u = uni.get(nome)
        if u is None or nome in out:
            continue
        lst = _lista_destinos(nome, u["carta"], d, cad)
        if lst is not None:
            out[nome] = lst
    return out


def para_painel(dk, pasta):
    """Para cada carta do deck: os três melhores destinos (letra, ganho, quem sai, o que falta, porquê) e, aqui, a melhor carta
    do radar para a vaga dela. Só com as sinergias completas; senão, None e o painel mostra a conta antiga."""
    d = ler()
    if not d["cartas"]:
        return None
    cad = dados.ler_cadastro()
    out = {}
    ctx = encaixe.contexto(dk)
    for c in dk["cards"]:
        nome = _base(c.get("on", c["n"]))
        if c.get("cmd") or nome in BASICOS:
            continue
        x = {}
        if nome in NUNCA:
            continue
        lst = _lista_destinos(nome, c, d, cad)
        if lst is not None:
            x["d"] = lst
        # se ela sair daqui: a melhor do radar (entra ou avaliar) que divide a função com ela, pelo ganho sobre ela
        top_c = max(c["s3"][2:]) if c.get("s3") else 0
        fun = [i for i in range(2, len(c["s3"])) if top_c and c["s3"][i] == top_c]
        _, ks, _, _, faixa = encaixe._regua()
        falta = [i for i in range(2, len(ks)) if ctx["ncrit"][i] < faixa[i][0]]   # a vaga também pode ir para o que falta no deck
        rs = [r for r in dk["cands"] if r.get("verdict") in ("entra", "avaliar") and encaixe._lados(r) & encaixe._lados(c)
              and (any(r["s3"][i] >= 1 for i in fun) or any(r["s3"][i] >= 2 for i in falta))]
        if rs:
            r = max(rs, key=lambda r: encaixe.valor(r["s3"], ctx["mult"]))
            x["r"] = dict(n=r["n"], id=r["id"], t=r.get("tier"), v=r.get("verdict"), g=round(encaixe.valor(r["s3"], ctx["mult"]) - encaixe.valor(c["s3"]), 2))
        if x:
            out[c["id"]] = x
    return out


# ---------------------------------------------------------------- comando

def status(avisar=print):
    d = ler()
    cad = dados.ler_cadastro()
    uni = universo()
    com_sin = com_lentes = 0
    for nome, u in uni.items():
        t3 = top(nome, d, cad, u["carta"])
        if t3 is None:
            continue
        com_sin += 1
        le = (d["cartas"].get(nome) or {}).get("lentes") or {}
        if all(z["pasta"] in le for z in t3):
            com_lentes += 1
    avisar("destinos: %d cartas | sinergias completas: %d | com as lentes dos três melhores: %d" % (len(uni), com_sin, com_lentes))


def mostrar(nome, avisar=print):
    d = ler()
    cad = dados.ler_cadastro()
    u = universo().get(nome)
    if not u:
        raise ErroDestinos("%s não está em nenhum deck" % nome)
    r = ranking(nome, d, cad, u["carta"])
    if r is None:
        avisar("%s: falta sinergia em algum deck" % nome)
        return
    le = (d["cartas"].get(nome) or {}).get("lentes") or {}
    avisar("%s (está em %s)" % (nome, ", ".join(u["decks"])))
    for z in r:
        l = le.get(z["pasta"])
        avisar("  %-20s %+6.1f  %s  sai %s (%s)  falta: %s%s" % (z["pasta"], z["ganho"], _letra(l, z["pasta"])[1] if l else "-", z["sai"], z["sai_tier"],
               ", ".join("%s %d/%d" % (f["k"], f["n"], f["min"]) for f in z["falta"]) or "-", ("  | " + l["porque"]) if l else ""))


def main():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    ap = argparse.ArgumentParser(description="Destinos: onde cada carta dos decks renderia mais.")
    ap.add_argument("--dossie", metavar="ARQ")
    ap.add_argument("--sinergias", metavar="ARQ")
    ap.add_argument("--dossie-lentes", metavar="ARQ")
    ap.add_argument("--lentes", metavar="ARQ")
    ap.add_argument("--deck", help="só as cartas deste deck")
    ap.add_argument("--tamanho", type=int, default=LOTE)
    ap.add_argument("--parte", help="k/n: só as cartas da parte k (de 0 a n-1), para agentes em paralelo sem repetir carta")
    ap.add_argument("--status", action="store_true")
    ap.add_argument("--carta")
    ap.add_argument("--dossie-pares", nargs=2, metavar=("PARES", "ARQ"), help="revisão: dossiê das lentes de pares {carta: [pasta]}")
    ap.add_argument("--corrigir-sinergias", metavar="ARQ", help="revisão: troca sinergias gravadas aqui e apaga a lente do par")
    a = ap.parse_args()
    parte = tuple(int(x) for x in a.parte.split("/")) if a.parte else None
    try:
        if a.dossie:
            dossie(a.dossie, a.deck, a.tamanho, parte=parte)
        elif a.sinergias:
            gravar_sinergias(a.sinergias)
        elif a.dossie_lentes:
            dossie_lentes(a.dossie_lentes, a.deck, a.tamanho, parte=parte)
        elif a.lentes:
            gravar_lentes(a.lentes)
        elif a.carta:
            mostrar(a.carta)
        elif a.dossie_pares:
            dossie_pares(*a.dossie_pares)
        elif a.corrigir_sinergias:
            corrigir_sinergias(a.corrigir_sinergias)
        else:
            status()
    except ErroDestinos as e:
        print("ERRO:", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
