"""Coleção: avalia uma coleção inteira contra os decks e leva ao radar o que tem potencial (pedido do dono, 09/11/2026).

O dono não quer consultar carta por carta: a cada coleção nova, toda carta nas cores de um deck passa pela mesma conta da
Consulta (notas da carta pela RUBRICA, sinergia pela régua do tema.json, ganho no placar e quem sai). O que dá ganho de Deck
vira candidata ao radar; o "pode" do dono grava.

Fluxo (o /colecao):
  --ler CÓDIGO...            lista do Scryfall (legais no Commander, sem básicos), cache e o arquivo da coleção
  --dossie CÓDIGO ARQ        o próximo lote de cartas ainda sem análise, com as réguas dos decks
  --sinergias CÓDIGO ARQ     grava a análise do lote (notas e sinergias) e calcula o ganho em cada deck
  --resumo CÓDIGO            as candidatas por deck (ganho de Deck e de Guardar), com as cartas que disputam a vaga
  --radar CÓDIGO ARQ         com o "pode": grava no radar dos decks e o cadastro das cartas novas
  --controle                 o que já foi avaliado, por coleção

Arquivos: dados/colecoes/<CÓDIGO>.json (a análise, uma entrada por carta) e dados/colecoes/controle.json. Nunca grava em
decklist.txt nem tema.json. Decks Desejo ficam fora (dados.eh_desejo); precon intacto nunca recebe "entra"."""
import argparse
import datetime
import io
import json
import os
import sys
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import caixa      # noqa: E402
import consulta   # noqa: E402
import dados      # noqa: E402
import encaixe    # noqa: E402
import prenota    # noqa: E402
import scryfall   # noqa: E402

PASTA = os.path.join(dados.DADOS, "colecoes")
CONTROLE = os.path.join(PASTA, "controle.json")
LOTE = 40


class ErroColecao(Exception):
    pass


def _hoje():
    return datetime.date.today().isoformat()


def _arq(codigo):
    return os.path.join(PASTA, codigo.upper() + ".json")


def _ler(caminho, vazio):
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return vazio


def _gravar(caminho, d):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(d, ensure_ascii=False, indent=1) + "\n")


def ler_colecao(codigo):
    return _ler(_arq(codigo), None)


# ---------------------------------------------------------------- a lista da coleção

def ler(codigo, avisar=print):
    """Todas as cartas da coleção legais no Commander, sem básicos, uma por nome, guardadas no cache do Scryfall.
    O arquivo da coleção guarda a lista; a análise já feita fica."""
    codigo = codigo.upper()
    q = "e:%s legal:commander -t:basic" % codigo.lower()
    url = "https://api.scryfall.com/cards/search?" + urllib.parse.urlencode({"q": q, "unique": "cards", "order": "set"})
    hoje = _hoje()
    c = scryfall._ler()
    lista, nome_set, lanc = [], None, None
    while url:
        try:
            r = scryfall._get(url)
        except scryfall.ErroScryfall as e:
            raise ErroColecao("%s: %s" % (codigo, e))
        for k in r.get("data") or []:
            scryfall._guardar(c, k, hoje)
            lista.append(dict(nome=k["name"].split(" // ")[0], set=k["set"], num=k["collector_number"]))
            nome_set = nome_set or k.get("set_name")
            lanc = lanc or k.get("released_at")
        url = r.get("next_page")
    scryfall._gravar(c)
    encaixe._CI = None   # cartas novas no cache: a identidade é relida
    ant = ler_colecao(codigo) or {}
    d = dict(versao=1, codigo=codigo, nome=nome_set, lancamento=lanc, lido=hoje, lista=lista, cartas=ant.get("cartas") or {})
    _gravar(_arq(codigo), d)
    _controle(codigo, d)
    avisar("%s (%s, %s): %d cartas legais no Commander, sem básicos; %d já analisadas" % (codigo, nome_set, lanc, len(lista), len(d["cartas"])))
    return d


# ---------------------------------------------------------------- o lote

def _decks():
    """Os decks v3 fora os Desejo, com a régua das duas sinergias e a marca de precon intacto."""
    info = caixa.info_decks()
    out = []
    for m in encaixe.decks_v3():
        t = dados.ler_json(os.path.join(dados.pasta_deck(m["pasta"]), "tema.json"), obrigatorio=False) or {}
        sins = t.get("sinergias") or {}
        out.append(dict(m=m, precon=bool((info.get(m["pasta"]) or {}).get("precon")),
                        reguas={k: dict(nome=v.get("nome"), regra=v.get("regra")) for k, v in sins.items() if k in ("sin1", "sin2")}))
    return out


def _ficha(item):
    r = consulta.achar("https://scryfall.com/card/%s/%s" % (item["set"], item["num"]), rede=False)
    return consulta.ficha(r, avisar=lambda *a: None)


def _alvos(f, decks):
    """Os decks em que a carta cabe (identidade) e ainda é nova (fora do deck e do radar)."""
    out = []
    for d in decks:
        if not consulta._cabe(f, d["m"]):
            continue
        if consulta._situacao(f["nome"], d["m"])["onde"] in ("deck", "radar"):
            continue
        out.append(d)
    return out


def _da_consulta(nome):
    """A consulta já registrada da carta, se houver: notas e sinergias que não precisam ser refeitas."""
    reg = consulta.anterior(nome)
    if not reg or not reg.get("consultas"):
        return None
    u = reg["consultas"][-1]
    return dict(cadastro=reg.get("cadastro") or u.get("cadastro"),
                sin={x["pasta"]: dict(sin=x["sin"], sin_por_que=x.get("sin_por_que") or {}) for x in u.get("encaixe") or []}, em=u.get("data"))


def dossie(codigo, arq, tamanho=LOTE, avisar=print, pular=0):
    """O próximo lote de cartas sem análise: texto do Scryfall, cadastro (ou o pedido de notas) e os decks em que cabem e são
    novas. As réguas dos decks vão uma vez só, no topo. Carta sem deck nenhum fica registrada como sem alvo."""
    d = ler_colecao(codigo)
    if not d:
        raise ErroColecao("%s ainda não foi lida: rode --ler %s" % (codigo, codigo))
    cad = dados.ler_cadastro()
    decks = _decks()
    lote, sem_alvo, reaproveitadas = [], 0, 0
    for item in d["lista"]:
        if item["nome"] in d["cartas"]:
            continue
        f = _ficha(item)
        alvos = _alvos(f, decks)
        if not alvos:
            d["cartas"][item["nome"]] = dict(set=item["set"], num=item["num"], sem_alvo=True, em=_hoje())
            sem_alvo += 1
            continue
        ant = _da_consulta(f["nome"])
        if ant and all(x["m"]["pasta"] in ant["sin"] for x in alvos) and (f["nome"] in cad or ant["cadastro"]):
            reaproveitadas += 1   # já consultada: a conta usa o que a consulta registrou
            _gravar_analise(d, f, item, ant["cadastro"] if f["nome"] not in cad else None, {p: ant["sin"][p] for p in [x["m"]["pasta"] for x in alvos]},
                            alvos, cad, origem="consulta de " + (ant["em"] or "?"))
            continue
        if pular:
            pular -= 1
            continue
        lote.append(dict(nome=f["nome"], link=f["link"], custo=f["custo"], tipo=f["tipo"], texto=f["texto"], ci=f["ci"] or "C",
                         terreno=f["terreno"], cadastro=cad.get(f["nome"]),
                         decks=[x["m"]["pasta"] for x in alvos]))
        if len(lote) >= tamanho:
            break
    _gravar(_arq(codigo), d)
    usados = sorted({p for c in lote for p in c["decks"]})
    out = dict(colecao=codigo, gerado=_hoje(), faltam=sum(1 for i in d["lista"] if i["nome"] not in d["cartas"]) - len(lote),
               reguas={x["m"]["pasta"]: dict(comandante=x["m"].get("curto"), precon=x["precon"], **x["reguas"]) for x in decks if x["m"]["pasta"] in usados},
               cartas=lote,
               responder=dict(arquivo="--sinergias", formato={"<carta>": {"_cadastro": "só se a carta não tem cadastro: {n: {critério: 1 a 3}, por_que}",
                                                                          "<pasta>": {"sin": {"sin1": "0 a 3", "sin2": "0 a 3"}, "sin_por_que": {"sin1": "frase"}}}},
                              regra="só os decks com sinergia acima de 0; os outros decks da carta ficam com 0 e 0"))
    os.makedirs(os.path.dirname(os.path.abspath(arq)), exist_ok=True)
    with open(arq, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    avisar("%s: lote de %d cartas | %d sem deck nas cores (registradas) | %d reaproveitadas da Consulta | faltam %d depois deste lote"
           % (codigo, len(lote), sem_alvo, reaproveitadas, out["faltam"]))
    return out


# ---------------------------------------------------------------- a análise e o ganho

def _gravar_analise(d, f, item, cad_proposto, sins, alvos, cad, origem="colecao"):
    """O ganho em cada deck alvo, pela conta do encaixe (a mesma da Consulta), sem mexer em deck nem no cadastro."""
    nome = f["nome"]
    e = cad.get(nome) or cad_proposto
    cad_c = dict(cad, **{nome: e})
    R = caixa.regua()
    linhas = []
    for x in alvos:
        m = x["m"]
        s = sins.get(m["pasta"]) or dict(sin=[0, 0], sin_por_que={})
        sin = s["sin"] if isinstance(s["sin"], list) else [s["sin"].get("sin1", 0), s["sin"].get("sin2", 0)]
        guard = m.get("avaliadas")
        m["avaliadas"] = dict(guard or {}, **{nome: dict(sin=sin)})
        try:
            g = encaixe.ganho(nome, m, cad_c, dict(cmc=f["cmc"], land=f["terreno"], mdfc=f["mdfc"]))
        finally:
            m["avaliadas"] = guard if guard is not None else {}
        s3 = consulta.s3_da_carta(e, sin)
        ganho = g["ganho"]
        perfil = caixa._perfil_deck(m)
        linhas.append(dict(pasta=m["pasta"], precon=x["precon"], sin=sin, sin_por_que=s.get("sin_por_que") or {}, valor=encaixe.valor(s3),
                           ganho=ganho, sai=g["sai"], valor_sai=g["valor_sai"],
                           faixa="deck" if ganho >= R["deck_ganho_min"] else "guardar" if ganho >= R["guardar_ganho_min"] else "abaixo",
                           tier_estimado=caixa._tier_estimado(encaixe.valor(s3), perfil["med"])))
    linhas.sort(key=lambda z: (-z["ganho"], z["pasta"]))
    d["cartas"][nome] = dict(set=item["set"], num=item["num"], tipo=f["tipo"], terreno=f["terreno"], cmc=f["cmc"],
                             cadastro_proposto=cad_proposto if nome not in cad else None, origem=origem, em=_hoje(), linhas=linhas)


def gravar_sinergias(codigo, arq, avisar=print, gravar=True):
    """A análise de um lote: {carta: {"_cadastro": {...}?, pasta: {"sin", "sin_por_que"}}}. Confere como a Consulta confere
    (nota de 0 a 3, porquê em toda nota acima de 0, notas da carta pela RUBRICA) e calcula o ganho."""
    d = ler_colecao(codigo)
    if not d:
        raise ErroColecao("%s ainda não foi lida" % codigo)
    with open(arq, encoding="utf-8") as fh:
        j = json.load(fh)
    cad = dados.ler_cadastro()
    decks = _decks()
    itens = {i["nome"]: i for i in d["lista"]}
    feitas = 0
    for nome, x in j.items():
        if nome.startswith("_"):
            continue
        if nome not in itens:
            raise ErroColecao("%s não está na lista da coleção %s" % (nome, codigo))
        f = _ficha(itens[nome])
        alvos = _alvos(f, decks)
        pastas = [a["m"]["pasta"] for a in alvos]
        try:
            e, _ = consulta._ler_cadastro_da_consulta(x, f["nome"], cad)
        except consulta.ErroConsulta as er:
            raise ErroColecao("%s: %s" % (nome, er))
        sobram = [p for p in x if not p.startswith("_") and p not in pastas]
        if sobram:
            raise ErroColecao("%s: decks fora das cores, que já têm a carta, ou que não existem: %s" % (nome, ", ".join(sobram)))
        sins = {}
        for p in pastas:
            y = x.get(p) or {}
            sin, pq = y.get("sin") or {}, y.get("sin_por_que") or {}
            for k in ("sin1", "sin2"):
                v = sin.get(k, 0)
                if not isinstance(v, int) or not 0 <= v <= 3:
                    raise ErroColecao("%s, %s: %s=%r; a nota vai de 0 a 3" % (nome, p, k, v))
                if v and not str(pq.get(k) or "").strip():
                    raise ErroColecao("%s, %s: falta o porquê de %s" % (nome, p, k))
            sins[p] = dict(sin=[sin.get("sin1", 0), sin.get("sin2", 0)], sin_por_que={k: pq[k] for k in ("sin1", "sin2") if sin.get(k)})
        if gravar:
            _gravar_analise(d, f, itens[nome], e if f["nome"] not in cad else None, sins, alvos, cad)
        feitas += 1
    if not gravar:
        avisar("%s: %d cartas conferidas, sem erro (nada gravado)" % (codigo, feitas))
        return feitas
    _gravar(_arq(codigo), d)
    _controle(codigo, d)
    avisar("%s: %d cartas analisadas neste lote | %d de %d no total" % (codigo, feitas, len(d["cartas"]), len(d["lista"])))
    return feitas


# ---------------------------------------------------------------- o resumo

def candidatas(codigo, faixas=("deck", "guardar")):
    """{pasta: [(carta, linha)]}, por ganho, só nas faixas pedidas."""
    d = ler_colecao(codigo) or {}
    out = {}
    for nome, c in (d.get("cartas") or {}).items():
        for l in c.get("linhas") or []:
            if l["faixa"] in faixas:
                out.setdefault(l["pasta"], []).append((nome, l))
    for p in out:
        out[p].sort(key=lambda z: -z[1]["ganho"])
    return out


def resumo(codigo, avisar=print):
    d = ler_colecao(codigo)
    if not d:
        raise ErroColecao("%s ainda não foi lida" % codigo)
    decks = {x["m"]["pasta"]: x["m"] for x in _decks()}
    feitas = sum(1 for c in d["cartas"].values() if not c.get("sem_alvo"))
    avisar("%s (%s): %d cartas | analisadas %d | sem deck nas cores %d | faltam %d" % (
        codigo, d.get("nome"), len(d["lista"]), feitas, sum(1 for c in d["cartas"].values() if c.get("sem_alvo")),
        sum(1 for i in d["lista"] if i["nome"] not in d["cartas"])))
    for p, xs in sorted(candidatas(codigo).items()):
        avisar("\n%s" % p)
        for nome, l in xs:
            m = decks.get(p)
            f = d["cartas"][nome]
            comp = []
            if m:
                comp = [c["n"] for c in consulta._comparaveis(m, dict(tipo=f.get("tipo") or "", cmc=f.get("cmc") or 0)) if not c["intocavel"]][:4]
            avisar("  %-6s %+6.2f  %-34s sin %d/%d  valor %-5s sai pelo motor: %s%s%s" % (
                l["faixa"], l["ganho"], nome[:34], l["sin"][0], l["sin"][1], l["valor"], l["sai"],
                " | mesmo papel: " + ", ".join(comp) if comp and not f.get("terreno") else "", " (precon intacto)" if l["precon"] else ""))


# ---------------------------------------------------------------- o radar

def gravar_radar(codigo, arq, avisar=print):
    """{pasta: {carta: {"veredito", "tier", "rel", "faz", "porque", "sai"}}} -> radar de cada deck, com a sinergia da análise;
    a carta sem cadastro ganha as notas que a análise deu (fonte claude). Recusa Desejo, precon com "entra", "sai" fora do deck."""
    d = ler_colecao(codigo)
    if not d:
        raise ErroColecao("%s ainda não foi lida" % codigo)
    with open(arq, encoding="utf-8") as fh:
        j = json.load(fh)
    info = caixa.info_decks()
    cad = prenota.ler_cadastro()
    feitos, pendentes = [], []
    for pasta, cartas in j.items():
        if dados.eh_desejo(pasta):
            raise ErroColecao("%s é deck Desejo: não recebe carta" % pasta)
        p, av, ind, nl = caixa._ler_av(pasta)
        no_deck = set(av.get("cartas") or {})
        radar = av.setdefault("radar", {})
        for nome, v in cartas.items():
            c = d["cartas"].get(nome)
            l = next((x for x in (c or {}).get("linhas") or [] if x["pasta"] == pasta), None)
            if not l:
                raise ErroColecao("%s, %s: a carta não foi analisada para este deck" % (pasta, nome))
            if v.get("veredito") not in dados.VEREDITOS:
                raise ErroColecao("%s, %s: veredito %r; use %s" % (pasta, nome, v.get("veredito"), ", ".join(dados.VEREDITOS)))
            if v["veredito"] == "entra" and (info.get(pasta) or {}).get("precon"):
                raise ErroColecao("%s é precon intacto: não recebe 'entra'" % pasta)
            if v.get("sai") and v["sai"] not in no_deck:
                raise ErroColecao("%s, %s: 'sai' %r não está no deck" % (pasta, nome, v["sai"]))
            if v.get("veredito") == "entra" and v.get("sai"):
                ja = [n for n, x in radar.items() if x.get("veredito") == "entra" and x.get("sai") == v["sai"] and n != nome]
                if ja:
                    raise ErroColecao("%s, %s: 'sai' %r já é o corte de %s, que também entra" % (pasta, nome, v["sai"], ja[0]))
            for campo in ("tier", "rel", "faz", "porque"):
                if not str(v.get(campo) or "").strip():
                    raise ErroColecao("%s, %s: falta '%s'" % (pasta, nome, campo))
            if nome not in cad["cartas"] and (c or {}).get("cadastro_proposto"):   # também para a carta que já está no radar
                cp = c["cadastro_proposto"]
                cad["cartas"][nome] = dict(n=cp["n"], por_que=cp["por_que"], fonte="claude", revisado=_hoje())
            if nome in radar or nome in no_deck:
                continue
            ent = dict(notas={}, sin={k: n for k, n in zip(("sin1", "sin2"), l["sin"]) if n}, sin_por_que=l["sin_por_que"], tier=v["tier"], rel=v["rel"],
                       veredito=v["veredito"], faz=v["faz"], porque=v["porque"], origem="coleção %s (%s)" % (codigo, _hoje()))
            if v.get("sai"):
                ent["sai"] = v["sai"]
            dados.conferir_avaliacao(ent, "%s, radar: %s" % (pasta, nome), [], {}, radar=True)
            radar[nome] = ent
            feitos.append((pasta, nome))
        pendentes.append((p, av, ind, nl))
    # tudo conferido: só agora grava (um erro no meio não deixa deck gravado sem o cadastro das cartas)
    for p, av, ind, nl in pendentes:
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(av, ensure_ascii=False, indent=ind) + ("\n" if nl else ""))
    prenota.gravar_cadastro(cad)
    ctl = _ler(CONTROLE, {})
    r = ctl.setdefault(codigo, {}).setdefault("radar", {})
    for pasta, nome in feitos:
        r.setdefault(pasta, [])
        if nome not in r[pasta]:
            r[pasta].append(nome)
    _gravar(CONTROLE, ctl)
    avisar("%s: %d cartas gravadas no radar de %d decks" % (codigo, len(feitos), len({x[0] for x in feitos})))
    return feitos


# ---------------------------------------------------------------- o controle

def _controle(codigo, d):
    ctl = _ler(CONTROLE, {})
    x = ctl.setdefault(codigo, {})
    faltam = sum(1 for i in d["lista"] if i["nome"] not in d["cartas"])
    x.update(nome=d.get("nome"), lancamento=d.get("lancamento"), lido=d.get("lido"), cartas=len(d["lista"]),
             analisadas=len(d["cartas"]), faltam=faltam, situacao="avaliada" if not faltam else "em andamento")
    if not faltam:
        x.setdefault("avaliada_em", _hoje())
    _gravar(CONTROLE, ctl)


def controle(avisar=print):
    ctl = _ler(CONTROLE, {})
    if not ctl:
        avisar("nenhuma coleção avaliada ainda")
    for k, x in sorted(ctl.items(), key=lambda kv: kv[1].get("lancamento") or ""):
        avisar("%-4s %-34s %s  %s: %s de %s analisadas, no radar de %d decks" % (
            k, (x.get("nome") or "")[:34], x.get("lancamento"), x.get("situacao"), x.get("analisadas"), x.get("cartas"), len(x.get("radar") or {})))
    return ctl


def main():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    ap = argparse.ArgumentParser(description="Avalia uma coleção inteira contra os decks (o /colecao).")
    ap.add_argument("--ler", nargs="+", metavar="CÓDIGO")
    ap.add_argument("--dossie", nargs=2, metavar=("CÓDIGO", "ARQ"))
    ap.add_argument("--tamanho", type=int, default=LOTE)
    ap.add_argument("--lotes", type=int, default=1, help="com --dossie: quantos lotes de uma vez (ARQ vira ARQ_1.json, ARQ_2.json...)")
    ap.add_argument("--conferir", nargs=2, metavar=("CÓDIGO", "ARQ"), help="confere um JSON de sinergias sem gravar")
    ap.add_argument("--sinergias", nargs=2, metavar=("CÓDIGO", "ARQ"))
    ap.add_argument("--resumo", metavar="CÓDIGO")
    ap.add_argument("--radar", nargs=2, metavar=("CÓDIGO", "ARQ"))
    ap.add_argument("--controle", action="store_true")
    a = ap.parse_args()
    try:
        if a.ler:
            for c in a.ler:
                ler(c)
        if a.dossie:
            if a.lotes > 1:
                base = a.dossie[1][:-5] if a.dossie[1].endswith(".json") else a.dossie[1]
                for i in range(a.lotes):
                    o = dossie(a.dossie[0].upper(), "%s_%d.json" % (base, i + 1), a.tamanho, pular=i * a.tamanho)
                    if not o["cartas"]:
                        os.remove("%s_%d.json" % (base, i + 1))
                        break
            else:
                dossie(a.dossie[0].upper(), a.dossie[1], a.tamanho)
        if a.conferir:
            gravar_sinergias(a.conferir[0].upper(), a.conferir[1], gravar=False)
        if a.sinergias:
            gravar_sinergias(a.sinergias[0].upper(), a.sinergias[1])
        if a.resumo:
            resumo(a.resumo.upper())
        if a.radar:
            gravar_radar(a.radar[0].upper(), a.radar[1])
        if a.controle:
            controle()
    except (ErroColecao, consulta.ErroConsulta, dados.ErroDeck) as e:
        sys.exit("erro: %s" % e)


if __name__ == "__main__":
    main()
