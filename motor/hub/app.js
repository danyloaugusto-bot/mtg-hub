(function () {
'use strict';

var H = /*__DATA__*/null;
window.HUB = H;   /* para os testes; o hub não lê nada daqui */

function $(s, el) { return (el || document).querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
function pl(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
function semAcento(s) { return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
var MANA = { W: '#f3e7bf', U: '#a9cdf0', B: '#8a7a92', R: '#f0a28c', G: '#9fd0a6' };
var NOMEC = { W: 'Branco', U: 'Azul', B: 'Preto', R: 'Vermelho', G: 'Verde' };

function cores(s) {
  var c = String(s || '').toUpperCase();
  if (!c) return '';
  return '<span class="cores" aria-label="Cores: ' + esc(c) + '">' + 'WUBRG'.split('').filter(function (k) { return c.indexOf(k) >= 0; })
    .map(function (k) { return '<i class="ms ms-' + k + '">' + k + '</i>'; }).join('') + '</span>';
}

/* ============ decks ============ */
function cartao(d) {
  var busca = esc(semAcento(d.nome + ' ' + (d.painel || '') + ' ' + d.cmd));
  if (d.painel) {
    return '<article class="deck" data-busca="' + busca + '">' +
      (d.capa ? '<img class="capa" src="' + d.capa + '" alt="" style="object-position:' + esc(d.foco || '50% 30%') + '">' : '') +
      '<a class="ir" href="' + esc(d.href) + '" aria-label="Abrir o painel ' + esc(d.painel) + ', deck ' + esc(d.nome) + '"></a>' +
      '<div class="tampa"></div>' +
      '<div class="faixa"><div class="nome"><h3>' + esc(d.nome) + '</h3><p class="sub">' + esc(d.painel) + '</p></div>' +
      '<span class="pts num" title="Placar do deck">' + d.placar + '<small>pts</small></span></div>' +
      '<div class="base">' + cores(d.cores) + '</div></article>';
  }
  return '<article class="deck vazio' + (d.capa ? ' com-capa' : '') + '" data-busca="' + busca + '">' +
    (d.capa ? '<img class="capa" src="' + d.capa + '" alt=""><div class="tampa"></div>' : '<div class="meio"><b>Em construção</b></div>') +
    '<div class="faixa"><div class="nome"><h3>' + esc(d.nome) + '</h3>' + (d.cmd ? '<p class="sub">' + esc(d.cmd) + '</p>' : '') + '</div></div>' +
    '<div class="base">' + (d.capa ? '<span class="obra">em construção</span>' : '') + cores(d.cores) + '</div></article>';
}
function vistaDecks() {
  return H.grupos.map(function (g) {
    var ds = H.decks.filter(function (d) { return d.grupo === g.k; });
    return '<section class="grupo" data-grupo="' + g.k + '"><h2>' + esc(g.n) + '</h2>' +
      (ds.length ? '<div class="grade">' + ds.map(cartao).join('') + '</div>' : '<p class="vazio-g">Nenhum deck neste grupo ainda.</p>') + '</section>';
  }).join('');
}

/* ============ pastas ============ */
function vistaPastas() {
  return '<p class="intro">As suas pastas de cartas. Quando chegar a lista de cada uma, ela aparece aqui organizada por cor e custo, com o valor de cada carta, ' +
    'o que tem sinergia com os seus decks e não está sendo usado, o que dá para vender, e os temas que já formariam um deck novo.</p>' +
    '<div class="pastas">' + H.pastas.map(function (p) {
      return '<article class="pasta" style="--pc:' + esc(p.c) + '"><div class="lomb"></div><div class="t"><h3>' + esc(p.n) + '</h3><p>Sem lista ainda.</p></div></article>';
    }).join('') + '</div>';
}

/* =====================================================================
   DASHBOARD
   Contas feitas aqui, com a mesma lógica do painel (motor/painel/app.js):
   placar, leituras, trocas do radar, base de mana e valor. O build só
   empacota os dados de cada deck em d.a.
   ===================================================================== */
var WUBRG = ['W', 'U', 'B', 'R', 'G'];
var TIERS = ['S', 'A', 'B', 'C', 'D'], RELS = ['INS', 'ALT', 'MED', 'BAX'];
var RELN = { INS: 'Intocáveis', ALT: 'Alta sinergia', MED: 'Flex', BAX: 'Na berlinda' };
var RELL = { INS: 'INS', ALT: 'ALT', MED: 'MÉD', BAX: 'BAX' };
var TR = { S: 0, A: 1, B: 2, C: 3, D: 4 };
var TIPOS = { cri: 'Criaturas', art: 'Artefatos', enc: 'Encantamentos', ins: 'Instantâneas', fei: 'Feitiços', pw: 'Planeswalkers', bat: 'Batalhas', ter: 'Terrenos' };
var ODIO = { cri: 'remoção em massa de criaturas', art: 'destruição de artefatos', enc: 'destruição de encantamentos', ins: 'anulações e taxa', fei: 'anulações e taxa',
             pw: 'ataque direto aos planeswalkers', bat: 'remoção pontual', ter: 'destruição de terrenos' };
var ARQ = [{ k: 'aggro', n: 'Aggro' }, { k: 'voltron', n: 'Voltron' }, { k: 'combo', n: 'Combo' }, { k: 'controle', n: 'Controle' },
           { k: 'stax', n: 'Stax' }, { k: 'aristocratas', n: 'Aristocratas' }, { k: 'spellslinger', n: 'Spellslinger' }, { k: 'ramp', n: 'Ramp e big mana' }];
var RES = { forte: { n: 'Vai bem', c: 'bem', v: 1, ic: '▲' }, equilibrado: { n: 'Equilibrado', c: 'eq', v: 0, ic: '●' }, fraco: { n: 'Vai mal', c: 'mal', v: -1, ic: '▼' } };
var BAS = {}; (H.basicos || []).forEach(function (n) { BAS[n] = 1; });

/* ---------- formato ---------- */
function num(n, d) { d = d || 0; return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function dol(n, d) { return 'US$ ' + num(n, d == null ? 2 : d); }
function pct(x, d) { return num(x * 100, d || 0) + '%'; }
function sinal(n, d) { return (n > 0 ? '+' : n < 0 ? '−' : '±') + num(Math.abs(n), d || 0); }
function lista(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1]; }
function soma(a, f) { var t = 0; a.forEach(function (x) { t += f ? f(x) : x; }); return t; }
function pts(c) { var t = 0; (c.s || []).forEach(function (v) { t += v; }); return t; }
function chave(c) { return c.o || c.n; }
function dataDe(s) {
  var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s || '');
  if (m) return new Date(+m[3], +m[2] - 1, +m[1], 12);
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3], 12) : null;
}
function hoje() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12); }
function diasDesde(s) { var d = dataDe(s); return d ? Math.max(0, Math.round((hoje() - d) / 864e5)) : null; }
function idade(n) { return n == null ? '—' : n === 0 ? 'hoje' : n === 1 ? 'ontem' : 'há ' + n + ' dias'; }
function brData(s) { var d = dataDe(s); if (!d) return '—'; var p = function (n) { return (n < 10 ? '0' : '') + n; }; return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear(); }
function ico(sev) { return sev === 3 ? '!' : sev === 2 ? '!' : 'i'; }
function pill(cls, txt, ic) { return '<span class="pill ' + cls + '">' + (ic ? '<i aria-hidden="true">' + ic + '</i>' : '') + esc(txt) + '</span>'; }
function manaTxt(k) { return k ? k.split('').map(function (ch) { return '<i class="ms ms-' + ch + '" aria-hidden="true">' + ch + '</i>'; }).join('') : '<i class="ms ms-C" aria-hidden="true">◇</i>'; }
function ir(sec, txt) { return '<a class="ver" href="#d-' + sec + '">' + (txt || 'Ver') + '</a>'; }

/* ---------- contas do painel ---------- */
function gix(A, k) { for (var i = 0; i < A.grupos.length; i++) if (A.grupos[i].k === k) return i; return -1; }
function pipsDe(cost) {
  var n = { W: 0, U: 0, B: 0, R: 0, G: 0 };
  String(cost || '').replace(/\{([^}]+)\}/g, function (m, s) {
    var cs = s.split('/').filter(function (ch) { return n[ch] != null; });
    cs.forEach(function (ch) { n[ch] += 1 / cs.length; });
  });
  return n;
}
function contas(cs, A) {
  var NG = A.grupos.length, i;
  var st = { n: 0, nonland: 0, cmcSum: 0, lands: 0, mdfc: 0, tapped: 0, cri: 0, tribo: 0, wipes: 0, low: 0, top: 0, foils: 0,
             grp: [], mk: {}, pip: { W: 0, U: 0, B: 0, R: 0, G: 0 }, src: { W: 0, U: 0, B: 0, R: 0, G: 0 }, srcC: 0,
             usd: 0, usdN: 0, usdSem: 0, relUsd: {}, rel: {}, tier: {}, tipos: {}, tipoPts: {}, curva: [0, 0, 0, 0, 0, 0, 0, 0] };
  for (i = 0; i < NG; i++) st.grp.push({ hard: 0, soft: 0, pts: 0 });
  Object.keys(A.marcadores || {}).forEach(function (k) { st.mk[k] = { n: 0, v: {}, nomes: [] }; });
  cs.forEach(function (c) {
    var q = c.q || 1, mk = c.mk || {}, j, v;
    st.n += q;
    st.tipos[c.t] = (st.tipos[c.t] || 0) + q;
    st.rel[c.r] = (st.rel[c.r] || 0) + q;
    st.tier[c.T] = (st.tier[c.T] || 0) + q;
    if (c.f) st.foils += q;
    if (c.u != null) { st.usd += c.u * q; st.usdN += q; st.relUsd[c.r] = (st.relUsd[c.r] || 0) + c.u * q; } else st.usdSem += q;
    for (j = 0; j < NG; j++) {
      v = c.s[j] || 0; st.grp[j].pts += v * q;
      if (v >= 2) st.grp[j].hard += q; else if (v === 1) st.grp[j].soft += q;
    }
    st.tipoPts[c.t] = (st.tipoPts[c.t] || 0) + pts(c) * q;
    if (c.L) { st.lands += q; if (c.tp) st.tapped += q; }
    else {
      st.nonland += q; st.cmcSum += c.c * q; st.curva[Math.min(c.c, 7)] += q;
      if (c.c <= 2) st.low += q;
      if (c.c >= 5) st.top += q;
      if (c.md) st.mdfc += q;
      var pn = pipsDe(c.co);
      WUBRG.forEach(function (ch) { st.pip[ch] += pn[ch] * q; });
    }
    if (c.L || c.md) {
      var cor = false;
      WUBRG.forEach(function (ch) { if (c.pd && c.pd.indexOf(ch) >= 0) { st.src[ch] += q; cor = true; } });
      if (!cor && c.L) st.srcC += q;
    }
    if (c.t === 'cri') { st.cri += q; if (mk.tribo) st.tribo += q; }
    if (c.w) st.wipes += q;
    Object.keys(mk).forEach(function (k) {
      var x = st.mk[k], val = mk[k]; if (!x || !val) return;
      x.n += q; x.v[val] = (x.v[val] || 0) + q; x.nomes.push(c.n);
    });
  });
  var a = st.avg = st.nonland ? st.cmcSum / st.nonland : 0;
  st.cmcPts = a === 0 ? 0 : a < 2 ? 5 : a < 3 ? 4 : a < 4 ? 3 : a < 5 ? 2 : 1;
  st.ramp = st.grp[Math.max(0, gix(A, 'ramp'))].pts;
  st.accX = a ? st.ramp / a : 0;
  st.accPts = st.accX < 0 ? 0 : Math.min(90, 5 * (Math.floor(st.accX * 2) + 1));
  st.crit = soma(st.grp, function (g) { return g.pts; });
  st.total = st.cmcPts + st.accPts + st.crit;
  return st;
}
/* As leituras do painel, com os limiares que cada deck declarou. Devolve o estado de cada uma. */
function leituras(st, A) {
  var out = [];
  (A.leituras || []).forEach(function (l) {
    var i, w = false, t = '', n = 0, x;
    if (l.tipo === 'terrenos') {
      n = st.lands + st.mdfc; w = n < (l.min == null ? 35 : l.min);
      t = pl(n, 'fonte de terreno', 'fontes de terreno');
    } else if (l.tipo === 'agrupamento') {
      i = gix(A, l.g); if (i < 0) return; n = st.grp[i].hard;
      w = l.min != null && n < l.min;
      t = pl(n, l.rotulo[0], l.rotulo[1]);
    } else if (l.tipo === 'remocao') {
      i = gix(A, l.g); if (i < 0) return; n = st.grp[i].hard;
      w = st.wipes > (l.massa_max == null ? 5 : l.massa_max) || (l.min != null && n < l.min);
      t = pl(n, 'remoção', 'remoções') + ', ' + st.wipes + ' em massa';
    } else if (l.tipo === 'contagem') {
      x = st.mk[l.marcador]; if (!x) return; n = x.n;
      w = (l.min != null && n < l.min) || (l.max != null && n > l.max);
      t = pl(n, l.rotulo[0], l.rotulo[1]);
    } else if (l.tipo === 'tribo') {
      var tri = (A.marcadores || {}).tribo || {};
      n = st.cri ? st.tribo / st.cri * 100 : 0;
      w = !!st.cri && n < (l.min_pct == null ? 75 : l.min_pct);
      t = st.tribo + ' de ' + st.cri + ' criaturas são ' + (tri.plural || tri.nome || 'da tribo');
    } else if (l.tipo === 'proporcao') {
      var MK = A.marcadores || {}, a = (st.mk[l.a] || {}).n || 0, b = (st.mk[l.b] || {}).n || 0;
      var ra = l.rotulo || [(MK[l.a] || {}).nome, (MK[l.a] || {}).nome], rb = l.rotulo_b || [(MK[l.b] || {}).nome, (MK[l.b] || {}).nome];
      n = a; w = a < b * (l.fator || 1);
      t = pl(a, ra[0], ra[1]) + ' para ' + pl(b, rb[0], rb[1]);
    } else if (l.tipo === 'curva') {
      n = st.avg;
      w = (l.cmc_max != null && st.avg > l.cmc_max) || (l.topo_max != null && st.top > l.topo_max);
      t = 'CMC médio de ' + num(st.avg, 2) + (l.topo_max != null ? ', ' + pl(st.top, 'carta', 'cartas') + ' de custo 5 ou mais' : '');
    } else return;
    out.push({ k: l.tipo + (l.g ? ':' + l.g : l.marcador ? ':' + l.marcador : ''), tipo: l.tipo, g: l.g || l.marcador || '', w: !!w, t: t, al: l.alerta || '', n: n });
  });
  return out;
}
function nAlertas(le) { return le.filter(function (x) { return x.w; }).length; }
/* Coloca no deck as cartas do radar marcadas em sel e tira as que elas substituem, como o painel faz. */
function aplicar(A, sel) {
  var sai = {}, add = [];
  A.cands.forEach(function (c) { if (sel[c.i]) { add.push(c); if (c.sa) sai[c.sa] = 1; } });
  return A.cards.filter(function (c) { return !sai[c.i]; }).concat(add);
}
function combosEm(A, cs) {
  var tem = {}; cs.forEach(function (c) { tem[c.i] = 1; });
  return A.combos.map(function (k) { return { k: k, falta: k.p.filter(function (id) { return !tem[id]; }) }; });
}
function motivoTroca(A, c, out, st) {
  var ir = gix(A, 'ramp'), r1 = ir >= 0 ? (c.s[ir] || 0) : 0, r0 = out && ir >= 0 ? (out.s[ir] || 0) : 0;
  if (c.L && out && !out.L) return 'Terreno no lugar de mágica: o placar não mede base de mana.';
  if (c.L && out && out.L) return 'Terreno por terreno: o placar só enxerga o que entra virado.';
  if (r1 < r0) return 'Tira ' + pl(r0 - r1, 'ponto', 'pontos') + ' de Ramp' + (st.accPts < A.st.accPts ? ' e derruba um degrau de aceleração.' : '.');
  if (out && pts(c) < pts(out)) return 'Soma menos notas que a carta que sai (' + pts(c) + ' contra ' + pts(out) + '): é troca por qualidade, tier ' + c.T + ' no lugar de ' + out.T + '.';
  if (st.cmcPts < A.st.cmcPts || st.accPts < A.st.accPts) return 'Sobe o CMC médio, e o placar sente.';
  return 'O ganho está no tier (' + c.T + ' no lugar de ' + (out ? out.T : '—') + '), não nas notas.';
}
function troca(A, c) {
  var sel = {}; sel[c.i] = 1;
  var st = contas(aplicar(A, sel), A), out = c.sa ? A.idx[c.sa] : null, d = st.total - A.st.total;
  return { c: c, out: out, d: d, u: c.u == null ? null : c.u, uo: out && out.u != null ? out.u * (out.q || 1) : 0, deck: A, porque: d <= 0 ? motivoTroca(A, c, out, st) : '' };
}
/* Fórmula de Karsten (2022) para 99 cartas: 31,42 + 3,13 × CMC médio das mágicas − 0,28 × compra e ramp de custo 2 ou menos. */
function karsten(A) {
  var ir = gix(A, 'ramp'), id = gix(A, 'draw'), q = 0, s = 0, baratas = 0;
  A.cards.forEach(function (c) {
    if (c.L || c.cm) return;
    var n = c.q || 1; q += n; s += c.c * n;
    if (c.c <= 2 && ((ir >= 0 && c.s[ir] >= 2) || (id >= 0 && c.s[id] >= 2))) baratas += n;
  });
  var avg = q ? s / q : 0;
  return { avg: avg, baratas: baratas, sug: 31.42 + 3.13 * avg - 0.28 * baratas };
}
/* Onde o placar muda de degrau: aceleração anda de 5 em 5; CMC médio, de 1 em 1. */
function degraus(st) {
  var a = st.avg, R = st.ramp, nl = st.nonland, S = st.cmcSum, r = { teto: st.accPts >= 90 };
  var piso = Math.floor(st.accX * 2) / 2;
  r.prox = piso + 0.5;
  r.sobe = Math.max(1, Math.ceil(r.prox * a - R - 1e-9));
  r.folga = Math.floor(R - piso * a + 1e-9);
  r.folgaCmc = piso > 0 ? Math.floor(R * nl / piso - S + 1e-9) : null;
  var lim = null; [5, 4, 3, 2].forEach(function (x) { if (lim == null && a >= x) lim = x; });
  r.lim = lim; r.corte = lim ? S - lim * nl + 1 : null;
  return r;
}
/* Probabilidade hipergeométrica de ver ao menos k sucessos em n cartas de N, com K sucessos no grimório. */
function comb(n, k) { if (k < 0 || k > n) return 0; k = Math.min(k, n - k); var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
function pGE(N, K, n, k) { if (k <= 0) return 1; var t = comb(N, n), p = 0; for (var x = k; x <= Math.min(K, n); x++) p += comb(K, x) * comb(N - K, n - x); return p / t; }
function baseMana(A) {
  var st = A.st, src = st.lands + st.mdfc, N = Math.max(1, st.n - 1), T = A.cmd ? Math.max(1, A.cmd.c) : 0, curva = [], k;
  var fim = Math.max(src + 4, Math.round(A.kar ? A.kar.sug : 0) + 1);
  for (k = src - 3; k <= fim; k++) curva.push({ k: k, p: pGE(N, k, 7 + T, T) });
  return { src: src, N: N, T: T, p3: pGE(N, src, 10, 3), p4: pGE(N, src, 11, 4), pc: pGE(N, src, 7 + T, T),
           mais1: pGE(N, src + 1, 7 + T, T) - pGE(N, src, 7 + T, T), curva: curva };
}

/* Calibração da régua: cartas que não são terreno básico, por faixa de relevância, e quantas têm a relevância igual ao tier. */
var FAIXA = { INS: [0.12, 0.28], ALT: [0.30, 0.50], MED: [0.20, 0.40], BAX: [0.06, 0.14] };
var PAR = { S: 'INS', A: 'ALT', B: 'MED', C: 'BAX', D: 'BAX' };
function calibra(A) {
  var r = { INS: 0, ALT: 0, MED: 0, BAX: 0 }, n = 0, diag = 0;
  A.cards.forEach(function (c) { if (BAS[chave(c)]) return; var q = c.q || 1; n += q; r[c.r] = (r[c.r] || 0) + q; if (PAR[c.T] === c.r) diag += q; });
  var fora = RELS.filter(function (k) { var x = r[k] / (n || 1); return x < FAIXA[k][0] || x > FAIXA[k][1]; });
  return { r: r, n: n, diag: n ? diag / n : 0, fora: fora };
}
function basicosRel() {
  var por = [], cont = {};
  DK.forEach(function (d) {
    var rs = {}; d.a.cards.forEach(function (c) { if (BAS[chave(c)]) rs[c.r] = (rs[c.r] || 0) + (c.q || 1); });
    var k = Object.keys(rs).sort(function (a, b) { return rs[b] - rs[a]; })[0];
    if (k) { por.push({ nome: d.nome, r: k, q: rs[k] }); cont[k] = (cont[k] || 0) + 1; }
  });
  var moda = Object.keys(cont).sort(function (a, b) { return cont[b] - cont[a]; })[0];
  return { moda: moda, fora: por.filter(function (x) { return x.r !== moda; }) };
}

/* ---------- custo de mana: a mesma conta da Visão geral de cada painel ---------- */
function custoX(c) { return /\{X\}/.test(c.co || ''); }
function pkDe(A, c) {
  if (c.L || c.md) return 'mana';
  if (c.pk && (c.pk === 'mana' || c.pk === 'sem' || gix(A, c.pk) >= 0)) return c.pk;
  var b = 0, bi = -1; (c.s || []).forEach(function (v, i) { if (v > b) { b = v; bi = i; } });
  return bi < 0 ? 'sem' : A.grupos[bi].k;
}
/* a troca baixa o custo sem perder o papel: mesmo pacote do 8×8, nota igual ou maior nele, tier igual ou melhor */
function baixaCusto(A, e, s) {
  if (!s || e.L || s.L || e.md || s.md || custoX(e) || custoX(s) || s.cp || s.c - e.c < 1) return false;
  var k = pkDe(A, s), i = gix(A, k);
  return i >= 0 && pkDe(A, e) === k && !!e.w === !!s.w && (e.s[i] || 0) >= (s.s[i] || 0) && TR[e.T] <= TR[s.T];
}
function pesada(c) { return !c.L && !c.md && !c.cm && !custoX(c) && !c.nc && !c.cp && c.T !== 'S' && c.r !== 'INS'; }
function custoDeck(A) {
  var out = A.cands.filter(function (c) { return c.v !== 'fora'; }), vistos = {}, sel = {};
  var boas = out.filter(function (c) { return baixaCusto(A, c, c.sa ? A.idx[c.sa] : null); })
    .sort(function (a, b) { return (A.idx[b.sa].c - b.c) - (A.idx[a.sa].c - a.c) || TR[a.T] - TR[b.T]; })
    .filter(function (c) { if (vistos[c.sa]) return false; vistos[c.sa] = 1; sel[c.i] = 1; return true; })
    .map(function (c) { return { c: c, s: A.idx[c.sa], d: A.idx[c.sa].c - c.c, deck: A }; });
  /* cada carta do radar é sugerida uma vez só, da mais cara do deck para a menos cara, como no painel */
  var usadas = {}, porSai = {}; boas.forEach(function (b) { usadas[b.c.i] = 1; porSai[b.s.i] = b.c; });
  var caras = A.cards.filter(function (c) { return pesada(c) && c.c >= 5; })
    .sort(function (a, b) { return b.c - a.c || TR[b.T] - TR[a.T] || a.n.localeCompare(b.n); }).map(function (c) {
      var k = pkDe(A, c);
      var alt = porSai[c.i] || out.filter(function (x) { return !usadas[x.i] && !x.L && !x.md && !custoX(x) && x.c <= c.c - 1 && pkDe(A, x) === k && !!x.w === !!c.w; })
        .sort(function (a, b) { return TR[a.T] - TR[b.T] || a.c - b.c || a.n.localeCompare(b.n); })[0];
      if (alt) usadas[alt.i] = 1;
      return { c: c, alt: alt || null, deck: A };
    });
  return { boas: boas, st: boas.length ? contas(aplicar(A, sel), A) : A.st, caras: caras };
}

/* ---------- preparo de cada deck ---------- */
var DK = H.decks.filter(function (d) { return d.a; });
DK.forEach(function (d) {
  var A = d.a;
  A.nome = d.nome; A.pasta = d.pasta; A.href = d.href;
  A.idx = {}; A.cards.forEach(function (c) { A.idx[c.i] = c; }); A.cands.forEach(function (c) { A.idx[c.i] = c; });
  A.vs = {}; A.contra.forEach(function (c) { A.vs[c.k] = c; });
  A.rec = {}; A.cands.forEach(function (c) { if (c.v === 'entra') A.rec[c.i] = 1; });
  A.st = contas(A.cards, A); A.le = leituras(A.st, A);
  A.cs2 = aplicar(A, A.rec); A.st2 = contas(A.cs2, A); A.le2 = leituras(A.st2, A);
  A.tr = A.cands.filter(function (c) { return c.v === 'entra'; }).map(function (c) { return troca(A, c); });
  A.kar = karsten(A); A.deg = degraus(A.st); A.mana = baseMana(A);
  A.custo = soma(A.tr, function (t) { return t.u || 0; }); A.semPreco = A.tr.filter(function (t) { return t.u == null; }).length;
  A.libera = soma(A.tr, function (t) { return t.uo; });
  A.combos0 = combosEm(A, A.cards); A.combos2 = combosEm(A, A.cs2);
  A.cv = custoDeck(A);
});

/* ---------- o que pede atenção ---------- */
function atencao() {
  var L = [];
  function add(sev, sec, html) { L.push({ sev: sev, sec: sec, h: html }); }
  /* mesa */
  ARQ.forEach(function (a) {
    var n = 0, bem = 0, mal = 0;
    DK.forEach(function (d) { var c = d.a.vs[a.k]; if (!c) return; n++; if (c.r === 'forte') bem++; if (c.r === 'fraco') mal++; });
    if (n >= 2 && !bem && mal * 2 >= n) add(3, 'mesa', '<b>' + esc(a.n) + ' é o ponto cego da carteira.</b> Nenhum deck vai bem contra ele, e ' + mal + ' de ' + n + ' vão mal.');
  });
  /* fundamentos que o próprio painel acusa */
  var grupos = [['agrupamento:ramp', 'Ramp dedicado abaixo do mínimo'], ['agrupamento:draw', 'Compra dedicada abaixo do mínimo'], ['terrenos', 'Fontes de terreno abaixo do mínimo'], ['remocao', 'Remoção fora da faixa']];
  grupos.forEach(function (g) {
    var ds = DK.filter(function (d) { return d.a.le.some(function (x) { return x.k === g[0] && x.w; }); });
    if (!ds.length) return;
    add(2, 'fundamentos', '<b>' + g[1] + '</b> em ' + lista(ds.map(function (d) { var x = d.a.le.filter(function (y) { return y.k === g[0]; })[0]; return esc(d.nome) + ' (' + num(x.n) + ')'; })) + '.');
  });
  /* degraus no fio */
  DK.forEach(function (d) {
    var g = d.a.deg;
    if (!g.teto && g.folga === 0 && g.folgaCmc === 0) add(2, 'placar', '<b>' + esc(d.nome) + ' está no fio do degrau de aceleração.</b> Perder 1 ponto de Ramp, ou subir 1 de CMC somado, custa 5 pontos de placar.');
    else if (!g.teto && g.folga === 0) add(1, 'placar', '<b>' + esc(d.nome) + ':</b> perder 1 ponto de Ramp derruba um degrau de aceleração (−5).');
  });
  /* cor */
  DK.forEach(function (d) {
    var A = d.a, id = A.ident.split(''); if (id.length < 2) return;
    var pt = soma(id, function (ch) { return A.st.pip[ch]; }), ft = soma(id, function (ch) { return A.st.src[ch]; });
    id.forEach(function (ch) {
      var gap = A.st.pip[ch] / (pt || 1) - A.st.src[ch] / (ft || 1);
      if (gap >= 0.1) add(2, 'mana', '<b>' + esc(d.nome) + ': falta ' + NOMEC[ch].toLowerCase() + ' na base.</b> É ' + pct(A.st.pip[ch] / pt) + ' dos símbolos de mana e ' + pct(A.st.src[ch] / ft) + ' das fontes.');
    });
  });
  /* trocas */
  DK.forEach(function (d) {
    var A = d.a;
    A.tr.forEach(function (t) {
      var ir = gix(A, 'ramp'), rampAlerta = A.le2.some(function (x) { return x.k === 'agrupamento:ramp' && x.w; });
      if (ir >= 0 && t.out && (t.out.s[ir] || 0) > (t.c.s[ir] || 0) && rampAlerta)
        add(2, 'trocas', '<b>' + esc(d.nome) + ': a troca ' + esc(t.c.n) + ' no lugar de ' + esc(t.out.n) + ' tira Ramp de um deck que continua abaixo do mínimo mesmo com as trocas.</b> Sozinha, ela ' + (t.d < 0 ? 'baixa o placar em ' + num(-t.d) : 'não sobe o placar') + '.');
    });
    A.combos2.forEach(function (x, i) {
      var antes = A.combos0[i];
      if (!antes.falta.length && x.falta.length) {
        var nomes = x.falta.map(function (id) { return A.idx[id] ? A.idx[id].n : id; });
        if (/armadilha/i.test(x.k.k)) add(1, 'trocas', '<b>' + esc(d.nome) + ':</b> as trocas recomendadas desfazem a armadilha "' + esc(x.k.n) + '" (sai ' + esc(lista(nomes)) + '). Bom sinal.');
        else add(2, 'trocas', '<b>' + esc(d.nome) + ': as trocas recomendadas desmontam "' + esc(x.k.n) + '".</b> Sai ' + esc(lista(nomes)) + '. Confirme se a linha continua valendo.');
      }
      if (antes.falta.length && !x.falta.length) add(1, 'trocas', '<b>' + esc(d.nome) + ':</b> "' + esc(x.k.n) + '" só fecha com as trocas: falta ' + esc(lista(antes.falta.map(function (id) { return A.idx[id] ? A.idx[id].n : id; }))) + ', que está no radar.');
    });
  });
  DK.forEach(function (d) {
    var A = d.a, dp = A.st2.total - A.st.total, cura = nAlertas(A.le) - nAlertas(A.le2);
    if (cura >= 2 && Math.abs(dp) / (A.st.total || 1) < 0.03) add(1, 'trocas', '<b>' + esc(d.nome) + ': as trocas tiram ' + cura + ' alertas e mexem pouco no placar (' + sinal(dp) + ').</b> O placar não mede tudo o que a troca conserta.');
    var cal = calibra(A);
    if (cal.diag >= 0.9) add(cal.diag > 0.995 ? 2 : 1, 'auditoria', '<b>' + esc(d.nome) + ': tier e relevância coincidem em ' + pct(cal.diag) + ' das cartas.</b> Os dois eixos deviam dizer coisas diferentes (força e permanência); aqui a relevância ' + (cal.diag > 0.995 ? 'só repete' : 'quase só repete') + ' o tier. Vale um /auditar só dela.');
  });
  DK.forEach(function (d) { var A = d.a; if (A.alvo && A.br && A.alvo !== A.br.b) add(2, 'fichas', '<b>' + esc(d.nome) + ': bracket estimado ' + A.br.b + ', alvo do dono ' + A.alvo + '.</b> ' + esc(brTxt(A.br)) + '.'); });
  var bas = basicosRel();
  if (bas.fora.length) add(1, 'auditoria', '<b>Terrenos básicos com relevância diferente entre os decks.</b> ' + esc(lista(bas.fora.map(function (x) { return x.nome + ' marca ' + RELL[x.r]; }))) + '; nos demais, básico é ' + RELL[bas.moda] + '.');
  var fut = [];
  DK.forEach(function (d) { d.a.cands.forEach(function (c) { if (c.rl) fut.push(esc(c.n) + ' (' + esc(d.nome) + ')'); }); });
  if (fut.length) add(1, 'auditoria', '<b>' + pl(fut.length, 'carta do radar está', 'cartas do radar estão') + ' sem preço</b> porque o Scryfall devolveu uma impressão de coleção que ainda nem saiu: ' + lista(fut) + '.');
  /* dinheiro */
  var bax = soma(DK, function (d) { return d.a.st.relUsd.BAX || 0; });
  if (bax >= 50) add(1, 'valor', '<b>' + dol(bax, 0) + ' em cartas na berlinda.</b> São as primeiras a sair; vale decidir se ficam guardadas, viram troca ou venda.');
  /* frescor */
  var velhos = DK.filter(function (d) { var n = diasDesde(d.a.scryfall); return n != null && n > 7; });
  if (velhos.length) add(2, 'auditoria', '<b>Preços com mais de 7 dias</b> em ' + lista(velhos.map(function (d) { return esc(d.nome); })) + '. Um build com internet renova.');
  var com = DK.filter(function (d) { var n = d.a.edh ? diasDesde(d.a.edh.l) : null; return n != null && n > 30; });
  if (com.length) add(1, 'auditoria', '<b>Leitura da comunidade com mais de 30 dias</b> em ' + lista(com.map(function (d) { return esc(d.nome); })) + '. Rode o /potenciais.');
  return L.sort(function (a, b) { return b.sev - a.sev; });
}

/* ---------- estado da tela ---------- */
var mesa = {};
var sim = { p: DK.length ? DK[0].pasta : '', sel: {} };
function simDeck() { for (var i = 0; i < DK.length; i++) if (DK[i].pasta === sim.p) return DK[i]; return DK[0]; }
function simCenario(A, k) {
  var s = {};
  A.cands.forEach(function (c) { if (c.v === 'entra' || (k === 'tudo' && c.v === 'avaliar')) s[c.i] = 1; });
  return k === 'hoje' ? {} : s;
}
if (DK.length) sim.sel = simCenario(DK[0].a, 'rec');
var abertos = {};

/* ---------- peças de desenho ---------- */
function secao(id, titulo, lede, corpo) {
  return '<section class="dsec" id="d-' + id + '" aria-labelledby="h-' + id + '"><header class="dsec-h"><h2 id="h-' + id + '">' + titulo + '</h2>' +
    (lede ? '<p>' + lede + '</p>' : '') + '</header>' + corpo + '</section>';
}
function caixa(titulo, corpo, cls) { return '<div class="cx' + (cls ? ' ' + cls : '') + '">' + (titulo ? '<h3>' + titulo + '</h3>' : '') + corpo + '</div>'; }
function nota(t) { return '<p class="nota">' + t + '</p>'; }
function barras(itens, max) {
  max = Math.max(1, max);
  return '<div class="barras">' + itens.map(function (it) {
    return '<div class="barra"><span>' + it.r + '</span><span class="t"><i style="width:' + (it.v / max * 100).toFixed(1) + '%;' + (it.c ? '--c:' + it.c : '') + '"></i></span><b class="num">' + (it.l != null ? it.l : it.v) + '</b></div>';
  }).join('') + '</div>';
}
function tierB(t) { return '<span class="tb t' + esc(t) + '">' + esc(t) + '</span>'; }
function relB(r) { return '<span class="rb rb-' + esc(r) + '">' + esc(RELL[r] || r) + '</span>'; }
function deckLink(A) { return A.href ? '<a href="' + esc(A.href) + '">' + esc(A.nome) + '</a>' : esc(A.nome); }
function mais(id, itens, n, render, linha) {
  var todos = abertos[id], vis = todos ? itens : itens.slice(0, n);
  var bt = '<button class="linkish" data-act="mais" data-k="' + id + '">' + (todos ? 'Mostrar menos' : 'Ver todas as ' + itens.length) + '</button>';
  return vis.map(render).join('') + (itens.length > n ? (linha ? '<tr class="mais"><td colspan="' + linha + '">' + bt + '</td></tr>' : '<li class="mais">' + bt + '</li>') : '');
}
function dolS(n, d) { return (n < 0 ? '−' : '') + dol(Math.abs(n), d); }

/* ============ 2. mesa ============ */
function rankMesa() {
  return DK.map(function (d) {
    var A = d.a, sc = 0, bem = [], mal = [], sem = [];
    ARQ.forEach(function (a) {
      var n = mesa[a.k] || 0; if (!n) return;
      var c = A.vs[a.k]; if (!c) { sem.push(a.n); return; }
      sc += RES[c.r].v * n;
      if (c.r === 'forte') bem.push(a.n + (n > 1 ? ' (×' + n + ')' : ''));
      if (c.r === 'fraco') mal.push(a.n + (n > 1 ? ' (×' + n + ')' : ''));
    });
    return { d: d, sc: sc, bem: bem, mal: mal, sem: sem };
  }).sort(function (x, y) { return y.sc - x.sc || x.mal.length - y.mal.length || x.d.nome.localeCompare(y.d.nome); });
}
function boxMesa() {
  var n = soma(ARQ, function (a) { return mesa[a.k] || 0; });
  var h = '<div class="steps" role="group" aria-label="Arquétipos na mesa">' + ARQ.map(function (a) {
    var v = mesa[a.k] || 0;
    return '<div class="step' + (v ? ' on' : '') + '"><button class="st-m" data-act="mesa" data-k="' + a.k + '" data-v="-1" aria-label="Tirar um ' + esc(a.n) + '"' + (v ? '' : ' disabled') + '>−</button>' +
      '<span>' + esc(a.n) + ' <b class="num">' + v + '</b></span><button class="st-p" data-act="mesa" data-k="' + a.k + '" data-v="1" aria-label="Pôr um ' + esc(a.n) + '"' + (n >= 5 ? ' disabled' : '') + '>+</button></div>';
  }).join('') + (n ? '<button class="linkish" data-act="mesa-limpar">Limpar a mesa</button>' : '') + '</div>';
  if (!n) {
    h += '<p class="vazio-m">Ponha na mesa os arquétipos dos oponentes, um por jogador. O ranking sai das seções "Contra quem" de cada painel.</p>';
  } else {
    var r = rankMesa(), top = r[0].sc;
    h += '<ol class="rank">' + r.map(function (x, i) {
      return '<li class="' + (x.sc === top ? 'lider' : '') + '"><span class="ord num">' + (i + 1) + '</span><div><b>' + deckLink(x.d.a) + '</b> <span class="sc num">' + sinal(x.sc) + '</span>' +
        '<p>' + (x.bem.length ? 'vai bem contra ' + esc(lista(x.bem)) : '') + (x.bem.length && x.mal.length ? '; ' : '') + (x.mal.length ? 'vai mal contra ' + esc(lista(x.mal)) : '') +
        (!x.bem.length && !x.mal.length ? 'equilibrado contra tudo o que está na mesa' : '') + (x.sem.length ? '. Sem leitura contra ' + esc(lista(x.sem)) : '') + '.</p></div></li>';
    }).join('') + '</ol>' + nota('Vai bem soma 1, equilibrado 0, vai mal tira 1, por oponente. Empate: ganha quem tem menos "vai mal".');
  }
  return h;
}
function secMesa() {
  var head = '<tr><th scope="col">Deck</th><th scope="col" class="c">Bracket</th>' + ARQ.map(function (a) { return '<th scope="col" class="c">' + esc(a.n) + '</th>'; }).join('') + '<th scope="col" class="c">Saldo</th></tr>';
  var rows = DK.map(function (d) {
    var A = d.a, b = 0, m = 0;
    return '<tr><th scope="row">' + deckLink(A) + '</th><td class="c">' + brBadge(A) + '</td>' + ARQ.map(function (a) {
      var c = A.vs[a.k]; if (!c) return '<td class="c vz">—</td>';
      var R = RES[c.r]; if (c.r === 'forte') b++; if (c.r === 'fraco') m++;
      return '<td class="c r-' + R.c + '" data-tip="' + esc(A.nome + ' contra ' + a.n + ': ' + R.n.toLowerCase() + '. ' + c.p) + '"><i aria-hidden="true">' + R.ic + '</i><span class="sr">' + R.n + '. ' + esc(c.p) + '</span></td>';
    }).join('') + '<td class="c num saldo">' + sinal(b - m) + '</td></tr>';
  }).join('');
  var foot = '<tr class="cob"><th scope="row">Quem vai bem</th><td></td>' + ARQ.map(function (a) {
    var bem = DK.filter(function (d) { var c = d.a.vs[a.k]; return c && c.r === 'forte'; }).length, mal = DK.filter(function (d) { var c = d.a.vs[a.k]; return c && c.r === 'fraco'; }).length;
    return '<td class="c num' + (!bem ? ' zero' : '') + '" data-tip="' + esc(a.n + ': ' + bem + ' vão bem, ' + mal + ' vão mal') + '">' + bem + '</td>';
  }).join('') + '<td></td></tr>';
  var vers = DK.map(function (d) {
    var b = 0, m = 0; d.a.contra.forEach(function (c) { if (c.r === 'forte') b++; if (c.r === 'fraco') m++; });
    return { d: d, s: b - m, b: b, m: m };
  }).sort(function (x, y) { return y.s - x.s; });
  var cegos = ARQ.filter(function (a) { return !DK.some(function (d) { var c = d.a.vs[a.k]; return c && c.r === 'forte'; }); }).map(function (a) { return a.n; });
  var h = '<div class="g2 g-mesa">' + caixa('Monte a mesa', '<div id="mesa">' + boxMesa() + '</div>', 'mesa-box') +
    caixa('Contra quem cada deck vai bem', '<div class="tw"><table class="mx"><thead>' + head + '</thead><tbody>' + rows + '</tbody><tfoot>' + foot + '</tfoot></table></div>' +
      '<p class="legenda"><span class="r-bem"><i>▲</i> vai bem</span><span class="r-eq"><i>●</i> equilibrado</span><span class="r-mal"><i>▼</i> vai mal</span></p>' +
      nota((cegos.length ? 'Nenhum deck vai bem contra ' + esc(lista(cegos)) + '. ' : '') + 'O selo B é o bracket estimado (motivo no selo e na ficha). Mais versátil: ' + esc(vers[0].d.nome) + ' (' + vers[0].b + ' bem, ' + vers[0].m + ' mal). Mais situacional: ' +
        esc(vers[vers.length - 1].d.nome) + ' (' + vers[vers.length - 1].b + ' bem, ' + vers[vers.length - 1].m + ' mal). Passe o mouse numa célula para ler o porquê.')) + '</div>';
  return secao('mesa', 'Qual deck levar', 'É a opinião da avaliação de cada deck, não o resultado de partidas. Use para escolher; anote o que acontecer na mesa para corrigir.', h);
}

/* ============ 3. fundamentos ============ */
var FUND = [
  { k: 'fontes', n: 'Fontes de terreno', ref: [35, 37], max: 40, min0: 28, v: function (A) { return A.st.lands + A.st.mdfc; }, le: 'terrenos' },
  { k: 'ramp', n: 'Ramp dedicado', ref: [10, 12], max: 16, v: function (A) { var i = gix(A, 'ramp'); return i < 0 ? null : A.st.grp[i].hard; }, le: 'agrupamento:ramp', g: 'ramp' },
  { k: 'draw', n: 'Compra dedicada', ref: [10, 12], max: 18, v: function (A) { var i = gix(A, 'draw'); return i < 0 ? null : A.st.grp[i].hard; }, le: 'agrupamento:draw', g: 'draw' },
  { k: 'rem', n: 'Remoção', ref: [8, 12], max: 20, v: function (A) { var i = gix(A, 'removal'); return i < 0 ? null : A.st.grp[i].hard; }, le: 'remocao', g: 'removal' },
  { k: 'massa', n: 'Em massa', ref: [3, 5], max: 9, v: function (A) { return A.st.wipes; }, le: 'remocao', alto: true }
];
function estadoFund(f, A, v) {
  var le = A.le.filter(function (x) { return x.k === f.le; })[0];
  if (f.k === 'massa') { var lr = (A.leituras || []).filter(function (l) { return l.tipo === 'remocao'; })[0], mx = lr && lr.massa_max != null ? lr.massa_max : 5; return v > mx ? 'warn' : v < 3 ? 'baixo' : 'ok'; }
  if (f.k === 'rem') return v < f.ref[0] ? 'warn' : 'ok';
  if (le) return le.w ? 'warn' : (v < f.ref[0] ? 'baixo' : 'ok');
  return v < f.ref[0] ? 'warn' : 'ok';
}
function bullet(f, v, cls, tip) {
  var lo = f.min0 || 0, span = f.max - lo, pos = function (x) { return Math.max(0, Math.min(100, (x - lo) / span * 100)).toFixed(1) + '%'; };
  return '<span class="bul" data-tip="' + esc(tip) + '"><i class="band" style="left:' + pos(f.ref[0]) + ';width:calc(' + pos(f.ref[1]) + ' - ' + pos(f.ref[0]) + ')"></i><i class="val ' + cls + '" style="width:' + pos(v) + '"></i></span>';
}
function secFund() {
  var head = '<tr><th scope="col">Deck</th>' + FUND.map(function (f) { return '<th scope="col">' + f.n + '<small>ref. ' + f.ref[0] + ' a ' + f.ref[1] + '</small></th>'; }).join('') +
    '<th scope="col">CMC médio<small>custo 2 ou menos</small></th><th scope="col" class="c">Alertas<small>do painel</small></th></tr>';
  var rows = DK.map(function (d) {
    var A = d.a;
    return '<tr><th scope="row">' + deckLink(A) + '</th>' + FUND.map(function (f) {
      var v = f.v(A); if (v == null) return '<td class="vz">—</td>';
      var e = estadoFund(f, A, v), soft = f.g ? A.st.grp[gix(A, f.g)].soft : 0;
      var tip = A.nome + ': ' + v + ' ' + f.n.toLowerCase() + (soft ? ', mais ' + soft + ' de passagem' : '') + '. Referência de ' + f.ref[0] + ' a ' + f.ref[1] + '.';
      return '<td class="fu fu-' + e + '"><b class="num">' + v + (e === 'warn' ? ' <i class="ic" aria-label="em alerta">!</i>' : '') + '</b>' + bullet(f, v, e, tip) + '</td>';
    }).join('') +
      '<td><b class="num">' + num(A.st.avg, 2) + '</b><small class="num">' + pct(A.st.low / (A.st.nonland || 1)) + '</small></td>' +
      '<td class="c">' + (nAlertas(A.le) ? pill('warn', nAlertas(A.le) + ' de ' + A.le.length, '!') : pill('ok', 'nenhum', '✓')) + '</td></tr>';
  }).join('');
  var avisos = DK.map(function (d) {
    var A = d.a, ws = A.le.filter(function (x) { return x.w; });
    if (!ws.length) return '';
    return '<li><b>' + deckLink(A) + '</b><ul>' + ws.map(function (x) {
      var depois = A.le2.filter(function (y) { return y.k === x.k; })[0];
      var al = x.al ? x.al.charAt(0).toUpperCase() + x.al.slice(1) : '';
      return '<li><span class="lt">' + esc(x.t) + '.</span> ' + esc(al) + (depois && !depois.w ? ' <span class="res">Com as trocas recomendadas, sai do alerta: ' + esc(depois.t) + '.</span>' : '') + '</li>';
    }).join('') + '</ul></li>';
  }).join('');
  var h = caixa('', '<div class="tw"><table class="tbl fund"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="legenda"><span><i class="lg-band"></i>faixa de referência</span><span><i class="lg-ok"></i>dentro</span><span><i class="lg-baixo"></i>abaixo da faixa, sem alerta no painel</span><span><i class="lg-warn"></i>em alerta no painel</span></p>' +
    nota('Dedicadas são as cartas com nota 2 ou 3 no agrupamento. O alerta segue o mínimo que cada painel definiu, que pode diferir da faixa geral: o Clavileño, por exemplo, aceita 9 de ramp.'), 'larga') +
    caixa('O que cada painel acusa', '<ul class="acusa">' + avisos + '</ul>', 'larga');
  return secao('fundamentos', 'Fundamentos contra a referência', 'As faixas usuais de Commander e as leituras de cada painel, lado a lado.', h);
}

/* ============ 4. trocas ============ */
function svgRetorno(tr) {
  var W = 640, Hh = 300, ml = 44, mr = 16, mt = 16, mb = 34, x = 0, y = 0, ps = [{ x: 0, y: 0 }];
  tr.forEach(function (t) { x += t.u; y += t.d; ps.push({ x: x, y: y, t: t }); });
  var X = Math.max(1, x), Y = Math.max(1, y);
  var sx = function (v) { return ml + v / X * (W - ml - mr); }, sy = function (v) { return Hh - mb - v / Y * (Hh - mt - mb); };
  var passo = function (m) { var p = Math.pow(10, Math.floor(Math.log10(m / 4))), c = [1, 2, 2.5, 5, 10]; for (var i = 0; i < c.length; i++) if (m / (p * c[i]) <= 5) return p * c[i]; return p * 10; };
  var px = passo(X), py = passo(Y), g = '', v;
  for (v = 0; v <= Y + 1e-9; v += py) g += '<line class="gr" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + sy(v).toFixed(1) + '" y2="' + sy(v).toFixed(1) + '"/><text class="tk" x="' + (ml - 8) + '" y="' + (sy(v) + 4).toFixed(1) + '" text-anchor="end">' + num(v) + '</text>';
  for (v = 0; v <= X + 1e-9; v += px) g += '<text class="tk" x="' + sx(v).toFixed(1) + '" y="' + (Hh - mb + 18) + '" text-anchor="middle">' + num(v) + '</text>';
  var linha = ps.map(function (p) { return sx(p.x).toFixed(1) + ',' + sy(p.y).toFixed(1); }).join(' ');
  var area = sx(0).toFixed(1) + ',' + sy(0).toFixed(1) + ' ' + linha + ' ' + sx(ps[ps.length - 1].x).toFixed(1) + ',' + sy(0).toFixed(1);
  var alvo = 0.8 * y, k80 = null;
  for (var i = 1; i < ps.length; i++) if (ps[i].y >= alvo - 1e-9) { k80 = ps[i]; break; }
  var mark = k80 ? '<line class="m80" x1="' + sx(k80.x).toFixed(1) + '" x2="' + sx(k80.x).toFixed(1) + '" y1="' + sy(0).toFixed(1) + '" y2="' + sy(k80.y).toFixed(1) + '"/>' +
    '<text class="a80" x="' + (sx(k80.x) + 8).toFixed(1) + '" y="' + (sy(k80.y) + 16).toFixed(1) + '">80% do ganho com ' + dol(k80.x, 0) + '</text>' : '';
  var dots = ps.slice(1).map(function (p) {
    var t = p.t, tip = t.c.n + ' no ' + t.deck.nome + (t.out ? ', no lugar de ' + t.out.n : '') + ': ' + sinal(t.d) + ' pts por ' + dol(t.u) + ' (' + num(t.d / Math.max(t.u, 0.01), 1) + ' pts por dólar).';
    return '<g class="pt" data-tip="' + esc(tip) + '"><circle class="hit" cx="' + sx(p.x).toFixed(1) + '" cy="' + sy(p.y).toFixed(1) + '" r="11"/><circle class="dot" cx="' + sx(p.x).toFixed(1) + '" cy="' + sy(p.y).toFixed(1) + '" r="4"/></g>';
  }).join('');
  return '<svg class="ch" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="Curva de retorno das trocas: ' + num(y) + ' pontos de placar por ' + dol(x, 0) + '">' + g +
    '<line class="ax" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + sy(0) + '" y2="' + sy(0) + '"/><polygon class="ar" points="' + area + '"/><polyline class="ln" points="' + linha + '"/>' + mark + dots +
    '<text class="tt" x="' + (W - mr) + '" y="' + (Hh - 4) + '" text-anchor="end">dólares acumulados</text><text class="tt" x="' + ml + '" y="' + (mt - 4) + '">pontos de placar</text></svg>';
}
function boxSim() {
  var d = simDeck(); if (!d) return '';
  var A = d.a, cs = aplicar(A, sim.sel), st = contas(cs, A), le = leituras(st, A), sel = A.cands.filter(function (c) { return sim.sel[c.i]; });
  var custo = soma(sel, function (c) { return c.u || 0; }), semP = sel.filter(function (c) { return c.u == null; }).length;
  var saidas = {}, conflito = [];
  sel.forEach(function (c) { if (!c.sa) return; if (saidas[c.sa]) conflito.push([saidas[c.sa], c, A.idx[c.sa]]); else saidas[c.sa] = c; });
  var libera = soma(Object.keys(saidas), function (id) { var o = A.idx[id]; return o && o.u != null ? o.u * (o.q || 1) : 0; });
  var cmb = combosEm(A, cs), avisos = [];
  conflito.forEach(function (x) { avisos.push(pill('warn', 'vaga disputada', '!') + ' ' + esc(x[0].n) + ' e ' + esc(x[1].n) + ' saem pelo mesmo lugar: ' + esc(x[2] ? x[2].n : '?') + '.'); });
  if (st.n !== 100) avisos.push(pill('warn', st.n + ' cartas', '!') + ' ' + (st.n > 100 ? 'Escolha quem sai no painel, na fila de corte.' : 'Falta carta.'));
  cmb.forEach(function (x, i) {
    var antes = A.combos0[i];
    if (antes.falta.length && !x.falta.length) avisos.push(pill('ok', 'fecha', '✓') + ' "' + esc(x.k.n) + '" fica completo.');
    if (!antes.falta.length && x.falta.length) avisos.push(pill(/armadilha/i.test(x.k.k) ? 'ok' : 'warn', /armadilha/i.test(x.k.k) ? 'armadilha desfeita' : 'desmonta', /armadilha/i.test(x.k.k) ? '✓' : '!') + ' "' + esc(x.k.n) + '" perde ' + esc(lista(x.falta.map(function (id) { return A.idx[id] ? A.idx[id].n : id; }))) + '.');
  });
  var k = function (rot, v, d0) { return '<div class="sk"><span>' + rot + '</span><b class="num">' + v + '</b>' + (d0 ? '<small class="num ' + (d0.indexOf('−') === 0 ? 'neg' : d0.indexOf('+') === 0 ? 'pos' : '') + '">' + d0 + '</small>' : '') + '</div>'; };
  var dif = function (a, b, dd) { var x = a - b; return Math.abs(x) < 1e-9 ? '' : sinal(x, dd); };
  var g = function (key) { var i = gix(A, key); return i < 0 ? null : i; };
  var ir0 = g('ramp'), id0 = g('draw'), irm = g('removal');
  var h = '<div class="sim-top"><div class="seg" role="group" aria-label="Deck do simulador">' + DK.map(function (x) {
    return '<button data-act="sim-deck" data-k="' + esc(x.pasta) + '" aria-pressed="' + (x.pasta === d.pasta) + '">' + esc(x.nome) + '</button>';
  }).join('') + '</div><div class="seg" role="group" aria-label="Cenário">' +
    '<button data-act="sim-cen" data-k="hoje">Deck de hoje</button><button data-act="sim-cen" data-k="rec">Trocas recomendadas</button><button data-act="sim-cen" data-k="tudo">E as em avaliação</button></div></div>';
  h += '<div class="sks">' + k('Placar', st.total, dif(st.total, A.st.total)) + k('Cartas', st.n, dif(st.n, A.st.n)) + k('CMC médio', num(st.avg, 2), dif(st.avg, A.st.avg, 2)) +
    k('Fontes de terreno', st.lands + st.mdfc, dif(st.lands + st.mdfc, A.st.lands + A.st.mdfc)) +
    (ir0 != null ? k('Ramp', st.grp[ir0].hard, dif(st.grp[ir0].hard, A.st.grp[ir0].hard)) : '') + (id0 != null ? k('Compra', st.grp[id0].hard, dif(st.grp[id0].hard, A.st.grp[id0].hard)) : '') +
    (irm != null ? k('Remoção', st.grp[irm].hard, dif(st.grp[irm].hard, A.st.grp[irm].hard)) : '') + k('Alertas', nAlertas(le) + ' de ' + le.length, dif(nAlertas(le), nAlertas(A.le))) +
    k('Custo', dol(custo, 0), semP ? '+' + semP + ' sem preço' : '') + k('Valor que sai', dol(libera, 0), '') + '</div>';
  if (avisos.length) h += '<ul class="sim-av">' + avisos.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul>';
  var ordem = { entra: 0, avaliar: 1, fora: 2 };
  var cands = A.cands.slice().sort(function (a, b) { return ordem[a.v] - ordem[b.v] || TR[a.T] - TR[b.T] || a.n.localeCompare(b.n); });
  var marg = {}; A.tr.forEach(function (t) { marg[t.c.i] = t.d; });
  h += '<ul class="sim-l">' + cands.map(function (c) {
    var dd = marg[c.i];
    if (dd == null) { var s1 = {}; s1[c.i] = 1; dd = contas(aplicar(A, s1), A).total - A.st.total; }
    var o = c.sa ? A.idx[c.sa] : null;
    return '<li class="v-' + c.v + (sim.sel[c.i] ? ' on' : '') + '"><label><input type="checkbox" data-sim="' + esc(c.i) + '"' + (sim.sel[c.i] ? ' checked' : '') + '>' +
      '<span class="nm">' + tierB(c.T) + ' ' + esc(c.n) + '</span><span class="vd vd-' + c.v + '">' + ({ entra: 'entra', avaliar: 'avaliar', fora: 'de fora' }[c.v]) + '</span>' +
      '<span class="sai">' + (o ? 'sai ' + esc(o.n) : 'ninguém sai') + '</span><span class="num dd ' + (dd > 0 ? 'pos' : dd < 0 ? 'neg' : '') + '" title="Efeito no placar se fosse a única troca">' + sinal(dd) + '</span>' +
      '<span class="num us">' + (c.u != null ? dol(c.u) : (c.rl ? 'sem preço' : '—')) + '</span></label></li>';
  }).join('') + '</ul>' + nota('O número ao lado de cada carta é o efeito dela sozinha no placar. As trocas ficam só aqui: a decklist não muda.');
  return h;
}
function secTrocas() {
  var todas = []; DK.forEach(function (d) { todas = todas.concat(d.a.tr); });
  var rows = DK.map(function (d) {
    var A = d.a, aval = A.cands.filter(function (c) { return c.v === 'avaliar'; }).length, dp = A.st2.total - A.st.total, saldo = A.custo - A.libera;
    var marg = soma(A.tr, function (t) { return t.d; }), dc = A.st2.avg - A.st.avg;
    return '<tr><th scope="row">' + deckLink(A) + '</th><td class="n num">' + A.tr.length + '</td><td class="n num">' + aval + '</td>' +
      '<td class="n num">' + dol(A.custo, 0) + (A.semPreco ? '<small>+' + A.semPreco + ' sem preço</small>' : '') + '</td><td class="n num">' + dol(A.libera, 0) + '</td>' +
      '<td class="n num' + (saldo < -0.005 ? ' pos' : '') + '">' + dolS(saldo, 0) + '</td>' +
      '<td class="n num">' + A.st.total + ' <span class="seta">→</span> ' + A.st2.total + '<small class="' + (dp >= 0 ? 'pos' : 'neg') + '">' + sinal(dp) + ' (' + sinal(dp / A.st.total * 100, 1) + '%)</small></td>' +
      '<td class="n num">' + num(A.st.avg, 2) + ' <span class="seta">→</span> ' + num(A.st2.avg, 2) +
        (Math.abs(dc) >= 0.005 ? '<small class="' + (dc < 0 ? 'pos' : 'neg') + '">' + sinal(dc, 2) + '</small>' : '') + '</td>' +
      '<td class="n num" data-tip="' + esc('Somando as trocas uma a uma: ' + sinal(marg) + '. Juntas: ' + sinal(dp) + '.') + '">' + sinal(marg) + '</td>' +
      '<td class="n num">' + nAlertas(A.le) + ' <span class="seta">→</span> ' + nAlertas(A.le2) + '</td></tr>';
  }).join('');
  var custo = soma(DK, function (d) { return d.a.custo; }), libera = soma(DK, function (d) { return d.a.libera; });
  var pos = todas.filter(function (t) { return t.d > 0 && t.u != null; }).sort(function (a, b) { return b.d / Math.max(b.u, 0.01) - a.d / Math.max(a.u, 0.01) || b.d - a.d; });
  var neg = todas.filter(function (t) { return t.d <= 0; }).sort(function (a, b) { return a.d - b.d; });
  var semp = todas.filter(function (t) { return t.d > 0 && t.u == null; });
  var maior = DK.map(function (d) { return { d: d, x: d.a.st2.total - d.a.st.total - soma(d.a.tr, function (t) { return t.d; }) }; }).sort(function (a, b) { return Math.abs(b.x) - Math.abs(a.x); })[0];
  var h = caixa('', '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">Entram</th><th scope="col" class="n">Em avaliação</th>' +
    '<th scope="col" class="n">Custo</th><th scope="col" class="n">Valor que sai</th><th scope="col" class="n">Saldo</th><th scope="col" class="n">Placar</th><th scope="col" class="n">CMC médio</th><th scope="col" class="n">Soma das partes</th><th scope="col" class="n">Alertas</th></tr></thead><tbody>' + rows +
    '</tbody></table></div>' + nota('Custo: as cartas que entram, no Scryfall. Valor que sai: as que deixam o deck, no mesmo preço. No total, as trocas custam ' + dol(custo, 0) + ' e tiram ' + dol(libera, 0) +
      ' em cartas do deck. Preço de Scryfall é de varejo: numa troca ou venda, carta usada vale menos. ' +
      (maior && Math.abs(maior.x) >= 5 ? 'O placar anda em degraus: ' + esc(maior.d.nome) + ' soma ' + sinal(soma(maior.d.a.tr, function (t) { return t.d; })) + ' com as trocas uma a uma e ' + sinal(maior.d.a.st2.total - maior.d.a.st.total) + ' com todas juntas. Julgue o pacote, não a carta.' : '')), 'larga');
  h += '<div class="g2">' + caixa('Quanto placar cada dólar compra', svgRetorno(pos) + nota('Cada ponto é uma troca recomendada, da que rende mais pontos por dólar para a que rende menos, medida sozinha. ' +
      (semp.length ? 'Fora do gráfico, sem preço: ' + esc(lista(semp.map(function (t) { return t.c.n + ' (' + t.deck.nome + ')'; }))) + '.' : '')) +
    '<ol class="melhores">' + pos.slice(0, 6).map(function (t) {
      return '<li><b>' + esc(t.c.n) + '</b> <span class="dim">no ' + esc(t.deck.nome) + (t.out ? ', no lugar de ' + esc(t.out.n) : '') + '</span><span class="num">' + sinal(t.d) + ' por ' + dol(t.u) + '</span></li>';
    }).join('') + '</ol>') +
    caixa('Trocas que o placar não paga', '<ul class="naopaga">' + mais('naopaga', neg, 6, function (t) {
      return '<li><span class="num neg">' + sinal(t.d) + '</span><div><b>' + esc(t.c.n) + '</b> <span class="dim">no ' + esc(t.deck.nome) + (t.out ? ', no lugar de ' + esc(t.out.n) : '') + '</span><p>' + esc(t.porque) + '</p></div></li>';
    }) + '</ul>' + nota('Placar não é tudo: terreno, qualidade e proteção nem sempre viram nota. Essas trocas se justificam pelo motivo escrito no radar de cada painel.')) + '</div>';
  var boas = [], semAlt = [];
  DK.forEach(function (d) { boas = boas.concat(d.a.cv.boas); semAlt = semAlt.concat(d.a.cv.caras.filter(function (x) { return !x.alt && x.c.c >= 6; })); });
  boas.sort(function (a, b) { return b.d - a.d || TR[a.c.T] - TR[b.c.T] || a.c.n.localeCompare(b.c.n); });
  semAlt.sort(function (a, b) { return b.c.c - a.c.c || TR[b.c.T] - TR[a.c.T] || a.c.n.localeCompare(b.c.n); });
  var mudam = DK.filter(function (d) { return d.a.cv.boas.length; });
  h += '<div class="g2">' + caixa('Trocas que baixam o custo', '<ul class="naopaga custo">' + (boas.length ? mais('baixa', boas, 8, function (b) {
      return '<li><span class="num pos">−' + b.d + '</span><div><b>' + esc(b.c.n) + '</b> <span class="dim">no ' + esc(b.deck.nome) + ', no lugar de ' + esc(b.s.n) +
        ' (custo ' + b.s.c + ' → ' + b.c.c + ')</span>' + (b.c.v === 'avaliar' ? ' ' + pill('info', 'em avaliação') : '') + '</div></li>';
    }) : '<li class="dim">Nenhuma troca do radar baixa o custo mantendo o papel.</li>') + '</ul>' +
    nota((mudam.length ? 'Com essas trocas, o CMC médio fica assim: ' + esc(lista(mudam.map(function (d) { return d.nome + ' ' + num(d.a.st.avg, 2) + ' → ' + num(d.a.cv.st.avg, 2); }))) + '. ' : '') +
      'Mantém o papel quando a carta que entra fica no mesmo pacote do 8×8 que a que sai, com nota igual ou maior nele e tier igual ou melhor. Cada mana a menos adianta a carta em cerca de um turno no começo do jogo.')) +
    caixa('As mais caras sem troca barata no radar', '<ul class="naopaga custo">' + (semAlt.length ? mais('caras', semAlt, 8, function (x) {
      return '<li><span class="num">' + x.c.c + '</span><div><b>' + esc(x.c.n) + '</b> <span class="dim">no ' + esc(x.deck.nome) + ', tier ' + x.c.T + ', ' + RELL[x.c.r] + '</span></div></li>';
    }) : '<li class="dim">Toda carta de custo 6 ou mais fora do plano já tem alternativa mais barata no radar.</li>') + '</ul>' +
    nota('Custo 6 ou mais, sem carta mais barata no mesmo pacote do radar. Ficam fora tier S, intocáveis, estimação, custo variável (X) e as que custam menos na prática. É por onde começar a procurar uma carta mais barata que faça o mesmo.')) + '</div>';
  h += caixa('Simulador de trocas', '<div id="sim">' + boxSim() + '</div>', 'larga sim-box');
  return secao('trocas', 'Trocas recomendadas: custo, retorno e risco', 'O radar de cada painel, somado: o que entra, o que sai, quanto custa e o que muda.', h);
}

/* ============ 5. placar ============ */
function secPlacar() {
  var rows = DK.map(function (d) {
    var A = d.a, st = A.st, g = A.deg, t = st.total || 1;
    var comp = '<span class="comp" aria-hidden="true"><i class="c1" style="flex:' + st.cmcPts + '"></i><i class="c2" style="flex:' + st.accPts + '"></i><i class="c3" style="flex:' + st.crit + '"></i></span>';
    var sobe = g.teto ? 'no teto de 90' : '+' + pl(g.sobe, 'ponto', 'pontos') + ' de Ramp: +5';
    var cai = g.teto ? '—' : g.folga === 0 ? '<b class="aviso">−1 ponto de Ramp: −5</b>' : 'aguenta perder ' + g.folga + ' de Ramp';
    var cmcCai = g.folgaCmc == null ? '—' : g.folgaCmc === 0 ? '<b class="aviso">+1 de CMC somado: −5</b>' : 'aguenta +' + g.folgaCmc + ' de CMC somado';
    var cmcSobe = g.lim ? 'cortar ' + g.corte + ' de CMC somado: +1' : 'no máximo';
    return '<tr><th scope="row">' + deckLink(A) + '</th><td class="n num"><b>' + st.total + '</b></td>' +
      '<td>' + sobe + '</td><td>' + cai + '</td><td>' + cmcCai + '</td><td>' + cmcSobe + '</td>' +
      '<td class="n num">' + num(st.accX, 2) + '<small>próximo: ' + num(g.prox, 1) + '</small></td><td class="compc">' + comp +
      '<small class="num">' + st.cmcPts + ' + ' + st.accPts + ' + ' + st.crit + '</small></td></tr>';
  }).join('');
  var expo = DK.map(function (d) {
    var A = d.a, tp = A.st.tipoPts, tot = soma(Object.keys(tp), function (k) { return Math.max(0, tp[k]); }) || 1;
    var ks = Object.keys(TIPOS).filter(function (k) { return tp[k] > 0; });
    var maior = ks.slice().sort(function (a, b) { return tp[b] - tp[a]; })[0];
    return '<div class="ex"><div class="ex-h"><b>' + deckLink(A) + '</b><span>' + pct(tp[maior] / tot) + ' em ' + TIPOS[maior].toLowerCase() + '</span></div><span class="stk">' + ks.map(function (k) {
      return '<i class="tp-' + k + '" style="flex:' + tp[k] + '" data-tip="' + esc(TIPOS[k] + ': ' + pct(tp[k] / tot) + ' das notas') + '"></i>';
    }).join('') + '</span><p class="dim">Teme ' + ODIO[maior] + '.</p></div>';
  }).join('');
  var leg = Object.keys(TIPOS).filter(function (k) { return DK.some(function (d) { return d.a.st.tipoPts[k] > 0; }); }).map(function (k) { return '<span><i class="tp-' + k + '"></i>' + TIPOS[k] + '</span>'; }).join('');
  var h = caixa('', '<div class="tw"><table class="tbl plac"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">Placar</th><th scope="col">Para subir</th><th scope="col">Folga de Ramp</th><th scope="col">Folga de CMC</th><th scope="col">Degrau do CMC</th>' +
    '<th scope="col" class="n">Aceleração</th><th scope="col">CMC + aceleração + notas</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="legenda"><span><i class="c1"></i>CMC médio, de 1 a 5</span><span><i class="c2"></i>aceleração, em degraus de 5</span><span><i class="c3"></i>soma das notas</span></p>' +
    nota('A aceleração é a soma das notas de Ramp dividida pelo CMC médio; cada 0,5 vale 5 pontos, até 90. Por isso um ponto de Ramp pode valer 6 no placar, e um pouco de CMC a mais pode custar 5. CMC somado é a soma dos custos das mágicas: trocar uma carta de 5 por uma de 2 corta 3.'), 'larga');
  h += caixa('Onde mora a força de cada deck', '<div class="exs">' + expo + '</div><p class="legenda">' + leg + '</p>' +
    nota('Parte das notas que está em cada tipo de carta. É a exposição do deck: quanto mais concentrada, mais um tipo de remoção dói.'), 'larga');
  return secao('placar', 'Sensibilidade do placar', 'Onde cada placar muda de degrau, e quanto ele aguenta antes de cair. Compare cada deck com ele mesmo.', h);
}

/* ============ 6. mana ============ */
function svgMana(A) {
  var M = A.mana, W = 220, Hh = 120, ml = 30, mr = 8, mt = 10, mb = 22;
  var xs = M.curva.map(function (p) { return p.k; }), x0 = xs[0], x1 = xs[xs.length - 1];
  var sx = function (k) { return ml + (k - x0) / (x1 - x0) * (W - ml - mr); }, sy = function (p) { return Hh - mb - (Math.max(0.4, p) - 0.4) / 0.6 * (Hh - mt - mb); };
  var g = [0.4, 0.6, 0.8, 1].map(function (p) { return '<line class="gr" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + sy(p).toFixed(1) + '" y2="' + sy(p).toFixed(1) + '"/><text class="tk" x="' + (ml - 5) + '" y="' + (sy(p) + 3.5).toFixed(1) + '" text-anchor="end">' + pct(p) + '</text>'; }).join('');
  var line = M.curva.map(function (p) { return sx(p.k).toFixed(1) + ',' + sy(p.p).toFixed(1); }).join(' ');
  var kar = Math.round(A.kar.sug), kx = kar >= x0 && kar <= x1 ? '<line class="kar" x1="' + sx(kar).toFixed(1) + '" x2="' + sx(kar).toFixed(1) + '" y1="' + mt + '" y2="' + (Hh - mb) + '"/><text class="tk kt" x="' + (sx(kar) - 3).toFixed(1) + '" y="' + (mt + 8) + '" text-anchor="end">Karsten</text>' : '';
  var pts2 = M.curva.map(function (p) {
    var cur = p.k === M.src;
    return '<g class="pt" data-tip="' + esc(p.k + ' fontes: ' + pct(p.p, 1) + ' de ter ' + M.T + ' terrenos no turno ' + M.T) + '"><circle class="hit" cx="' + sx(p.k).toFixed(1) + '" cy="' + sy(p.p).toFixed(1) + '" r="9"/>' +
      '<circle class="' + (cur ? 'dot cur' : 'dot sm') + '" cx="' + sx(p.k).toFixed(1) + '" cy="' + sy(p.p).toFixed(1) + '" r="' + (cur ? 4.5 : 2.5) + '"/></g>';
  }).join('');
  var tks = M.curva.filter(function (p) { return (p.k - M.src) % 2 === 0; }).map(function (p) { return '<text class="tk" x="' + sx(p.k).toFixed(1) + '" y="' + (Hh - 6) + '" text-anchor="middle">' + p.k + '</text>'; }).join('');
  return '<svg class="ch mini" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="' + esc(A.nome + ': chance de ' + M.T + ' terrenos no turno ' + M.T + ' conforme o número de fontes') + '">' + g + kx +
    '<polyline class="ln" points="' + line + '"/>' + pts2 + tks + '</svg>';
}
function secMana() {
  var rows = DK.map(function (d) {
    var A = d.a, M = A.mana, k = A.kar, gap = M.src - k.sug;
    return '<tr><th scope="row">' + deckLink(A) + '</th><td class="n num">' + A.st.lands + (A.st.mdfc ? ' + ' + A.st.mdfc : '') + ' = <b>' + M.src + '</b></td>' +
      '<td class="n num">' + num(k.sug, 1) + '<small>' + sinal(gap, 1) + '</small></td><td class="n num">' + A.st.tapped + '</td>' +
      '<td class="n num">' + pct(M.p3) + '</td><td class="n num">' + pct(M.p4) + '</td>' +
      '<td class="n num"><b>' + pct(M.pc) + '</b><small>' + (A.cmd ? 'custo ' + A.cmd.c + ', turno ' + M.T : '') + '</small></td><td class="n num">' + sinal(M.mais1 * 100, 1) + ' p.p.</td></tr>';
  }).join('');
  var minis = DK.map(function (d) {
    var A = d.a;
    return '<figure class="mm"><figcaption><b>' + esc(A.nome) + '</b><span>' + pct(A.mana.pc) + ' com ' + A.mana.src + ' fontes</span></figcaption>' + svgMana(A) + '</figure>';
  }).join('');
  var cor = DK.filter(function (d) { return d.a.ident.length >= 2; }).map(function (d) {
    var A = d.a, id = A.ident.split(''), pt = soma(id, function (ch) { return A.st.pip[ch]; }) || 1, ft = soma(id, function (ch) { return A.st.src[ch]; }) || 1;
    return '<div class="cb"><b>' + deckLink(A) + '</b>' + id.map(function (ch) {
      var a = A.st.pip[ch] / pt, b = A.st.src[ch] / ft, gap = a - b;
      return '<div class="cbr"><span>' + manaTxt(ch) + '</span><span class="cbt"><i class="dem" style="width:' + (a * 100).toFixed(1) + '%;--c:' + MANA[ch] + '"></i><i class="ofe" style="width:' + (b * 100).toFixed(1) + '%;--c:' + MANA[ch] + '"></i></span>' +
        '<span class="num' + (gap >= 0.1 ? ' aviso' : '') + '">' + pct(a) + ' / ' + pct(b) + '</span></div>';
    }).join('') + '</div>';
  }).join('');
  var h = caixa('', '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">Terrenos + duplas</th><th scope="col" class="n">Karsten sugere</th><th scope="col" class="n">Virados</th>' +
    '<th scope="col" class="n">3 terrenos no turno 3</th><th scope="col" class="n">4 no turno 4</th><th scope="col" class="n">Comandante na curva</th><th scope="col" class="n">Cada fonte a mais</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    nota('Probabilidade de ter os terrenos, só com terrenos e cartas duplas: grimório de 99, sem mulligan, comprando no primeiro turno, como no multiplayer. Ramp ajuda e não entra na conta, então é o piso. ' +
      'Karsten (2022): 31,42 + 3,13 × CMC médio − 0,28 × compra e ramp de custo 2 ou menos; é mais conservadora que os 35 a 37 do projeto. As duplas contam como terreno aqui.'), 'larga');
  h += caixa('Comandante na curva, conforme o número de fontes', '<div class="mms">' + minis + '</div>' + nota('Cada curva mostra a chance de ter terrenos para o comandante no turno do custo dele, de 3 fontes a menos até a sugestão de Karsten. O ponto maior é o deck de hoje; a linha vertical, a sugestão de Karsten.'), 'larga');
  if (cor) h += caixa('Demanda e oferta de cada cor', '<div class="cbs">' + cor + '</div>' + nota('Barra cheia: parte dos símbolos de mana nos custos. Barra clara: parte das fontes que geram a cor. Diferença de 10 pontos ou mais fica destacada.'), 'larga');
  return secao('mana', 'Base de mana', 'Terrenos, chance de cumprir a curva e equilíbrio de cores.', h);
}

/* ============ 7. valor ============ */
function secValor() {
  var tot = soma(DK, function (d) { return d.a.st.usd; }), max = Math.max.apply(null, DK.map(function (d) { return d.a.st.usd; }));
  var bars = DK.slice().sort(function (a, b) { return b.a.st.usd - a.a.st.usd; }).map(function (d) {
    var A = d.a;
    return '<div class="vb"><span class="vb-n">' + deckLink(A) + '</span><span class="vb-t"><span class="stk" style="width:' + (A.st.usd / max * 100).toFixed(1) + '%">' + RELS.map(function (r) {
      var v = A.st.relUsd[r] || 0; return v ? '<i class="rv-' + r + '" style="flex:' + v.toFixed(2) + '" data-tip="' + esc(A.nome + ', ' + RELN[r].toLowerCase() + ': ' + dol(v)) + '"></i>' : '';
    }).join('') + '</span></span><b class="num">' + dol(A.st.usd, 0) + '</b></div>';
  }).join('');
  var cartas = []; DK.forEach(function (d) { d.a.cards.forEach(function (c) { if (c.u != null) cartas.push({ c: c, A: d.a, v: c.u * (c.q || 1) }); }); });
  cartas.sort(function (a, b) { return b.v - a.v; });
  var top10 = soma(cartas.slice(0, 10), function (x) { return x.v; });
  var joias = cartas.slice(0, 10).map(function (x, i) {
    return '<tr><td class="n num dim">' + (i + 1) + '</td><td>' + esc(x.c.n) + (x.c.f ? ' <span class="foil">foil</span>' : '') + '</td><td>' + deckLink(x.A) + '</td><td class="c">' + tierB(x.c.T) + ' ' + relB(x.c.r) + '</td><td class="n num">' + dol(x.v) + '</td></tr>';
  }).join('');
  var bax = cartas.filter(function (x) { return x.c.r === 'BAX'; });
  var baxT = soma(bax, function (x) { return x.v; });
  var saem = {}; DK.forEach(function (d) { d.a.tr.forEach(function (t) { if (t.out) saem[d.pasta + '|' + t.out.i] = 1; }); });
  var baxL = bax.slice(0, 8).map(function (x) {
    return '<li><span class="num">' + dol(x.v) + '</span><div><b>' + esc(x.c.n) + '</b> <span class="dim">no ' + esc(x.A.nome) + ', tier ' + esc(x.c.T) + '</span>' + (saem[x.A.pasta + '|' + x.c.i] ? ' ' + pill('info', 'sai numa troca recomendada') : '') + '</div></li>';
  }).join('');
  var foilP = soma(DK, function (d) { return soma(d.a.cards, function (c) { return c.f && c.u0 != null && c.u != null ? Math.max(0, c.u - c.u0) * (c.q || 1) : 0; }); });
  var foils = soma(DK, function (d) { return d.a.st.foils; });
  var h = '<div class="g2">' + caixa('Valor por deck e por relevância', '<div class="vbs">' + bars + '</div><p class="legenda">' + RELS.map(function (r) { return '<span><i class="rv-' + r + '"></i>' + RELN[r] + '</span>'; }).join('') + '</p>' +
      nota('Total: ' + dol(tot, 0) + '. As 10 cartas mais caras somam ' + dol(top10, 0) + ', ' + pct(top10 / (tot || 1)) + ' do valor. O acabamento foil de ' + foils + ' cartas acrescenta ' + dol(foilP, 0) + ' sobre a versão comum.')) +
    caixa('As dez mais caras', '<div class="tw"><table class="tbl"><thead><tr><th></th><th scope="col">Carta</th><th scope="col">Deck</th><th scope="col" class="c">Tier e relevância</th><th scope="col" class="n">US$</th></tr></thead><tbody>' + joias + '</tbody></table></div>') + '</div>' +
    caixa('Dinheiro parado na berlinda: ' + dol(baxT, 0), '<ul class="bax">' + baxL + '</ul>' + nota('Cartas BAX, da mais cara para a mais barata. Antes de comprar a carta que entra, veja quanto vale a que sai.'), 'larga');
  return secao('valor', 'Onde está o dinheiro', 'Preço do Scryfall em dólar, na impressão e no acabamento da sua lista.', h);
}

/* ============ 8. auditoria ============ */
function secAudit() {
  var chk = [];
  function item(ok, titulo, det) { chk.push('<li class="' + (ok === true ? 'ok' : ok === 'info' ? 'inf' : 'warn') + '">' + pill(ok === true ? 'ok' : ok === 'info' ? 'info' : 'warn', ok === true ? 'ok' : ok === 'info' ? 'nota' : 'ver', ok === true ? '✓' : ok === 'info' ? 'i' : '!') + '<div><b>' + titulo + '</b>' + (det ? '<p>' + det + '</p>' : '') + '</div></li>'); }
  var n100 = DK.filter(function (d) { return d.a.st.n !== 100; });
  item(!n100.length, 'Cem cartas em todos os decks', n100.length ? esc(lista(n100.map(function (d) { return d.nome + ' (' + d.a.st.n + ')'; }))) : '');
  item(true, 'Identidade de cor', 'O build recusa carta fora das cores do comandante, no deck, no radar e nos potenciais.');
  var inc = []; DK.forEach(function (d) { d.a.cards.forEach(function (c) { if ((c.r === 'INS' && TR[c.T] >= 3) || (c.r === 'BAX' && TR[c.T] <= 1)) inc.push(c.n + ' (' + d.nome + ', ' + c.T + ' ' + RELL[c.r] + ')'); }); });
  item(!inc.length, 'Tier e relevância coerentes', inc.length ? esc(lista(inc)) : 'Nenhuma intocável com tier C ou D, nenhuma na berlinda com tier S ou A.');
  var zero = []; DK.forEach(function (d) { d.a.cards.forEach(function (c) { if (!c.L && !c.md && !c.cm && pts(c) === 0) zero.push(c.n + ' (' + d.nome + ', ' + c.T + ' ' + RELL[c.r] + ')'); }); });
  item(!zero.length || 'info', 'Cartas sem nota em agrupamento nenhum', zero.length ? esc(lista(zero)) + '. Uma carta que não pontua em nada precisa de um porquê forte para ficar.' : '');
  var vaga = [], vagaRec = 0; DK.forEach(function (d) {
    var m = {}; d.a.cands.forEach(function (c) { if (c.sa && c.v !== 'fora') (m[c.sa] = m[c.sa] || []).push(c); });
    Object.keys(m).forEach(function (id) {
      if (m[id].length < 2) return;
      if (m[id].filter(function (c) { return c.v === 'entra'; }).length > 1) vagaRec++;
      vaga.push(d.nome + ': ' + lista(m[id].map(function (c) { return c.n; })) + ' disputam a vaga de ' + (d.a.idx[id] ? d.a.idx[id].n : id));
    });
  });
  item(!vaga.length || (vagaRec ? false : 'info'), 'Vagas disputadas no radar', vaga.length ? esc(vaga.join('; ')) + '. Promover as duas deixa o deck com 101 cartas' +
    (vagaRec ? '; ' + pl(vagaRec, 'disputa é', 'disputas são') + ' entre trocas recomendadas, e o pacote do radar não fecha em 100.' : '; nenhuma disputa é entre duas trocas recomendadas.') : '');
  var dep = []; DK.forEach(function (d) { d.a.combos0.forEach(function (x) { if (x.falta.length) dep.push('"' + x.k.n + '" (' + d.nome + ') depende de ' + lista(x.falta.map(function (id) { return d.a.idx[id] ? d.a.idx[id].n : id; }))); }); });
  item(!dep.length || 'info', 'Combos com peça fora do deck', dep.length ? esc(dep.join('; ')) + '.' : '');
  var fut = []; DK.forEach(function (d) { d.a.cands.forEach(function (c) { if (c.rl) fut.push(c.n + ' (' + d.nome + ', ' + brData(c.rl) + ')'); }); });
  item(!fut.length, 'Preço de todas as cartas do radar', fut.length ? 'Sem preço: ' + esc(lista(fut)) + '. O Scryfall devolveu, pelo nome, uma impressão de coleção que ainda vai sair. Correção sugerida no motor: preferir a impressão mais recente que já tem preço.' : '');
  /* calibração da régua, sem os terrenos básicos */
  var bas = basicosRel();
  item(!bas.fora.length || 'info', 'Terrenos básicos com a mesma relevância em todo deck', bas.fora.length ? esc(lista(bas.fora.map(function (x) { return x.nome + ' marca os ' + x.q + ' básicos como ' + RELL[x.r]; }))) + '; os demais, como ' + RELL[bas.moda] + '. Não muda o placar, mas engorda a contagem de intocáveis.' : '');
  var cal = DK.map(function (d) {
    var C = calibra(d.a);
    var cel = RELS.map(function (k) {
      var x = C.r[k] / (C.n || 1), fora = C.fora.indexOf(k) >= 0;
      return '<td class="n num' + (fora ? ' fora' : '') + '" data-tip="' + esc(RELN[k] + ': ' + C.r[k] + ' cartas, ' + pct(x) + '; esperado de ' + pct(FAIXA[k][0]) + ' a ' + pct(FAIXA[k][1])) + '">' + pct(x) + '</td>';
    }).join('');
    var leit = C.diag > 0.995 ? pill('warn', 'eixos colados', '!') : C.diag >= 0.9 ? pill('warn', 'eixos quase colados', '!') : C.fora.length ? pill('warn', C.fora.map(function (k) { return RELL[k]; }).join(' e ') + ' fora da faixa', '!') : pill('ok', 'régua firme', '✓');
    return '<tr><th scope="row">' + deckLink(d.a) + '</th>' + cel + '<td class="n num' + (C.diag >= 0.9 ? ' fora' : '') + '">' + pct(C.diag) + '</td><td>' + leit + '</td></tr>';
  }).join('');
  var hm = DK.map(function (d) {
    var A = d.a, m = {}, mx = 1;
    A.cards.forEach(function (c) { var k = c.T + c.r; m[k] = (m[k] || 0) + (c.q || 1); mx = Math.max(mx, m[k]); });
    return '<figure class="hm"><figcaption>' + esc(A.nome) + '</figcaption><div class="hmg"><span></span>' + RELS.map(function (r) { return '<span class="hh">' + RELL[r] + '</span>'; }).join('') +
      TIERS.map(function (t) {
        return '<span class="hh">' + t + '</span>' + RELS.map(function (r) {
          var v = m[t + r] || 0, anom = v && ((r === 'INS' && TR[t] >= 3) || (r === 'BAX' && TR[t] <= 1));
          var al = v ? 0.14 + 0.86 * v / mx : 0;
          return '<span class="hc' + (anom ? ' anom' : '') + (!v ? ' z' : al < 0.55 ? ' cl' : '') + '" style="--a:' + al.toFixed(2) + '" data-tip="' + esc(A.nome + ': ' + pl(v, 'carta', 'cartas') + ' tier ' + t + ' e ' + RELL[r]) + '">' + (v || '') + '</span>';
        }).join('');
      }).join('') + '</div></figure>';
  }).join('');
  var conf = DK.filter(function (d) { return d.a.conf; });
  var porIA = {};
  conf.forEach(function (d) { d.a.conf.an.forEach(function (x) { var k = x.ia || 'outras'; porIA[k] = porIA[k] || { n: 0, e: 0 }; porIA[k].n++; porIA[k].e += x.e; }); });
  var confRows = conf.map(function (d) {
    var C = d.a.conf;
    return '<tr><th scope="row">' + deckLink(d.a) + '</th>' + ['A', 'B', 'C'].map(function (s) {
      var x = C.an.filter(function (y) { return y.s === s; })[0];
      return x ? '<td class="n num" data-tip="' + esc(x.a) + '">' + x.e + '<small>' + esc(x.ia || 'outra IA') + '</small></td>' : '<td class="vz">—</td>';
    }).join('') + '<td class="n num">' + C.nv + '</td></tr>';
  }).join('');
  var iaTxt = Object.keys(porIA).map(function (k) { var x = porIA[k]; return (k === 'outras' ? 'as não identificadas' : k) + ', ' + num(x.e / x.n, 1) + ' por análise'; });
  var fr = DK.map(function (d) {
    var A = d.a, cel = function (s, lim, rot) { var n = diasDesde(s); var cls = n == null ? '' : n > lim ? 'warn' : 'ok'; return '<td class="n num">' + (s ? brData(s) : '—') + '<small' + (cls ? ' class="' + cls + '"' : '') + '>' + idade(n) + '</small></td>'; };
    return '<tr><th scope="row">' + deckLink(A) + '</th>' + cel(A.feito, 90) + cel(A.scryfall, 7) + cel(A.edh ? A.edh.l : '', 30) + '<td>' + (A.hist ? esc(A.hist.v) + '<small>' + brData(A.hist.d) + '</small>' : '—') + '</td>' +
      '<td class="n num">' + A.pool.length + '<small>' + A.cands.filter(function (c) { return c.v === 'avaliar'; }).length + ' a avaliar</small></td></tr>';
  }).join('');
  var h = '<div class="g2">' + caixa('Conferências', '<ul class="chk">' + chk.join('') + '</ul>') +
    caixa('Calibração da régua de relevância', '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Deck</th>' + RELS.map(function (r) { return '<th scope="col" class="n">' + RELL[r] + '</th>'; }).join('') + '<th scope="col" class="n">Tier igual<small>à relevância</small></th><th scope="col">Leitura</th></tr></thead><tbody>' + cal + '</tbody></table></div>' +
      nota('Sem os terrenos básicos. O método espera perto de 20% INS, 40% ALT, 30% MÉD e 8 a 10% BAX; destacado, o que sai da faixa. "Tier igual" conta as cartas em que a relevância repete o tier (S e INS, A e ALT, B e MÉD, C ou D e BAX): perto de 100%, os dois eixos viraram um só.') +
      '<div class="hms">' + hm + '</div>' + nota('Tier contra relevância, carta a carta, com os básicos. As casas de canto (intocável fraca, berlinda forte) são as incoerências. Uma diagonal cheia e o resto vazio quer dizer que a relevância só repete o tier.')) + '</div>';
  h += '<div class="g2">' + (conf.length ? caixa('As análises de fora, conferidas', '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">A</th><th scope="col" class="n">B</th><th scope="col" class="n">C</th><th scope="col" class="n">Ninguém viu</th></tr></thead><tbody>' + confRows + '</tbody></table></div>' +
      nota('Itens que o CONFRONTO.md registra como desmentidos ou esclarecidos pelo texto oficial, por análise, e os achados que nenhuma das três viu. Média: ' + esc(iaTxt.join('; ')) + '. Análise mais longa faz mais afirmações, então o número não é taxa de erro. Concordância entre IAs não prova nada; o texto da carta decide.')) : '') +
    caixa('Frescor dos dados', '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">Avaliação</th><th scope="col" class="n">Preços</th><th scope="col" class="n">Comunidade</th><th scope="col">Versão</th><th scope="col" class="n">Potenciais</th></tr></thead><tbody>' + fr + '</tbody></table></div>' +
      nota('Avaliação com mais de 90 dias pede um /auditar; preço com mais de 7, um build com internet; comunidade com mais de 30, o /potenciais. Potenciais: cartas da comunidade ainda sem triagem.')) + '</div>';
  return secao('auditoria', 'Auditoria da avaliação', 'Coerência interna, calibração, as análises de fora e a idade de cada fonte.', h);
}

/* ============ 9. compartilhadas ============ */
function secComp() {
  var m = {};
  DK.forEach(function (d) { d.a.cards.forEach(function (c) { var k = chave(c); if (BAS[k]) return; (m[k] = m[k] || []).push({ A: d.a, c: c }); }); });
  var cs = Object.keys(m).filter(function (k) { return m[k].length >= 2; }).map(function (k) {
    var v = m[k], caps = soma(v, function (x) { return x.c.u || 0; });
    var rels = {}; v.forEach(function (x) { rels[x.c.r] = 1; });
    return { k: k, v: v, cap: caps, div: Object.keys(rels).length > 1 && rels.BAX };
  }).sort(function (a, b) { return b.v.length - a.v.length || b.cap - a.cap || a.k.localeCompare(b.k); });
  var extra = soma(cs, function (x) { return x.v.length - 1; }), cap = soma(cs, function (x) { return x.cap; });
  var rows = mais('comp', cs, 12, function (x) {
    return '<tr><td>' + esc(x.k) + (x.div ? ' ' + pill('info', 'berlinda num deck') : '') + '</td><td class="n num">' + x.v.length + '</td><td><div class="chips">' + x.v.map(function (y) {
      return '<span data-tip="' + esc(y.A.nome + ': tier ' + y.c.T + ', ' + RELN[y.c.r].toLowerCase() + (y.c.u != null ? ', ' + dol(y.c.u) : '')) + '" class="ch-' + y.c.r + '">' + esc(y.A.nome) + ' ' + esc(y.c.T) +
        '<span class="sr">, tier ' + esc(y.c.T) + ', ' + esc(RELN[y.c.r]) + '</span></span>';
    }).join('') + '</div></td><td class="n num">' + dol(x.cap) + '</td></tr>';
  }, 4);
  var rad = {}; DK.forEach(function (d) { d.a.cands.forEach(function (c) { if (c.v === 'fora') return; (rad[chave(c)] = rad[chave(c)] || []).push({ A: d.a, c: c }); }); });
  var dem = Object.keys(rad).filter(function (k) { return rad[k].length >= 2; }).map(function (k) { return '<li><b>' + esc(k) + '</b>: ' + esc(lista(rad[k].map(function (y) { return y.A.nome + ' (' + (y.c.v === 'entra' ? 'entra' : 'avaliar') + ')'; }))) + '.</li>'; });
  var ja = Object.keys(rad).filter(function (k) { return m[k]; }).map(function (k) {
    var onde = m[k].map(function (y) { return y.A.nome; });
    return '<li><b>' + esc(k) + '</b>, no radar ' + esc(lista(rad[k].map(function (y) { return 'do ' + y.A.nome; }))) + ', já está ' + esc(onde.length > 1 ? 'em ' + lista(onde) : 'no ' + onde[0]) + '.</li>';
  });
  var pas = H.em_pastas || {}, temPastas = Object.keys(pas).length > 0;
  function ch(c) { return String(c.o || c.n).split(' // ')[0].trim().toLowerCase(); }
  var radarEmPasta = [];
  DK.forEach(function (d) { d.a.cands.forEach(function (c) { if (c.v === 'fora') return; var p = pas[ch(c)]; if (p) radarEmPasta.push({ A: d.a, c: c, p: p }); }); });
  var pastasBox = temPastas
    ? (radarEmPasta.length ? '<ul class="lst">' + radarEmPasta.map(function (x) {
        return '<li><b>' + esc(x.c.n) + '</b>, no radar do ' + esc(x.A.nome) + ' (' + esc(x.c.v === 'entra' ? 'entra' : 'avaliar') + '), já está em ' + esc(lista(x.p.map(function (q) { return q.p + ' ×' + q.q; }))) + '. Dá para pegar de lá em vez de comprar.</li>';
      }).join('') + '</ul>' : '<p class="hint">Nenhuma carta dos radares está nas pastas.</p>')
    : '<p class="hint">As listas das pastas ainda não chegaram. Quando chegarem (em <code>dados/pastas/</code>), esta caixa mostra o que o radar pede e você já tem.</p>';
  var h = '<div class="g2">' + caixa('Cartas em mais de um deck', '<p class="dest">' + pl(cs.length, 'carta aparece', 'cartas aparecem') + ' em dois ou mais decks: para jogar com todos montados, são <b>' + extra + ' cópias a mais</b>, somando ' + dol(cap, 0) + '.</p>' +
      '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Carta</th><th scope="col" class="n">Decks</th><th scope="col">Onde</th><th scope="col" class="n">Capital</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      nota('Terrenos básicos não contam. A cor do nome mostra a relevância da carta em cada deck; passe o mouse para ver tier e preço.')) +
    '<div>' + caixa('O radar entre os decks', (dem.length ? '<h4>Pedida em mais de um deck</h4><ul class="lst">' + dem.join('') + '</ul>' : '') + (ja.length ? '<h4>Já existe em outro deck</h4><ul class="lst">' + ja.join('') + '</ul>' : '') +
      nota('Antes de comprar: a carta pode estar parada em outro deck. Se for a mesma cópia, ela sai de lá. A leitura carta a carta, com o tier de cada lugar, está logo acima, em Movimentações.')) +
    caixa('O radar contra as pastas', pastasBox, 'larga') + '</div></div>';
  return secao('compartilhadas', 'Cópias e capital', 'As cartas que aparecem em mais de um deck: quantas cópias a mais e quanto dinheiro isso é.', h);
}

/* ============ 10. carteira e o álbum das cores ============ */
/* Nomes, perfis, mecânicas e outros nomes de cada combinação: Draftsim, "All 26 Color Combinations of Magic" (Ethan Rodgers,
   atualizado em 30/09/2026), em resumo nosso. As cinco cores puras são resumo nosso da roda das cores; o incolor vem da Draftsim.
   f: o que a combinação é dentro da família (aliada ou inimiga, cor de base do fragmento, virtude do clã). */
var ALBUM = [
  { g: 'Uma cor', d: 'As cinco cores do Magic, e o incolor.', cs: [
    { k: 'W', n: 'Branco', f: 'uma cor', p: 'Ordem e comunidade: proteção, vida e limpeza de mesa.' },
    { k: 'U', n: 'Azul', f: 'uma cor', p: 'Conhecimento: anular, comprar, devolver.' },
    { k: 'B', n: 'Preto', f: 'uma cor', p: 'Poder a qualquer preço: destruir e reanimar.' },
    { k: 'R', n: 'Vermelho', f: 'uma cor', p: 'Liberdade e impulso: dano direto e ataque.' },
    { k: 'G', n: 'Verde', f: 'uma cor', p: 'Natureza: criaturas grandes, fichas e ramp.' },
    { k: '-', n: 'Incolor', f: 'sem cor', p: 'Só artefatos, mana phyrexiana ou Eldrazi; o terreno da casa é o Wastes.' }] },
  { g: 'Guildas de Ravnica', d: 'As dez duplas. Cinco aliadas, vizinhas na roda das cores, e cinco inimigas, opostas.', cs: [
    { k: 'WU', n: 'Azorius', f: 'guilda aliada', al: 1, p: 'A lei: evasão e prevenção.', m: 'flying, flicker, detain, addendum', alt: ['Guidelight Voyagers (Aetherdrift)'] },
    { k: 'UB', n: 'Dimir', f: 'guilda aliada', al: 1, p: 'Segredo, manipulação e contraespionagem.', m: 'mill, surveil, looting, deathtouch', alt: ['Speed Demons (Aetherdrift)'] },
    { k: 'BR', n: 'Rakdos', f: 'guilda aliada', al: 1, p: 'Destruição e excesso: queimar e sacrificar.', m: 'spectacle, menace, compra por impulso', alt: ['Endriders (Aetherdrift)'] },
    { k: 'RG', n: 'Gruul', f: 'guilda aliada', al: 1, p: 'A natureza agressiva contra a cidade.', m: 'riot, trample, landfall', alt: ['Goblin Rocketeers (Aetherdrift)'] },
    { k: 'WG', n: 'Selesnya', f: 'guilda aliada', al: 1, p: 'Harmonia: fichas e encantamentos.', m: 'populate, convoke, tokens', alt: ['Alacrian Quickbeasts (Aetherdrift)'] },
    { k: 'WB', n: 'Orzhov', f: 'guilda inimiga', p: 'Taxa e extorsão: a vida como moeda.', m: 'lifelink, extort, afterlife', alt: ['Silverquill (Strixhaven)', 'Champions of Amonkhet (Aetherdrift)'] },
    { k: 'UR', n: 'Izzet', f: 'guilda inimiga', p: 'Experimentos: mágicas que mexem na mesa.', m: 'overload, jump-start, haste, cópias', alt: ['Prismari (Strixhaven)', 'Keelhaulers (Aetherdrift)'] },
    { k: 'BG', n: 'Golgari', f: 'guilda inimiga', p: 'Vida e morte: cemitério e crescimento.', m: 'dredge, scavenge, undergrowth, self-mill', alt: ['Witherbloom (Strixhaven)', 'Speedbrood (Aetherdrift)'] },
    { k: 'WR', n: 'Boros', f: 'guilda inimiga', p: 'O exército disciplinado: números e combate.', m: 'equipment, mentor, battalion, tokens', alt: ['Lorehold (Strixhaven)', 'Cloudspire Racing (Aetherdrift)'] },
    { k: 'UG', n: 'Simic', f: 'guilda inimiga', p: 'Adaptação: ramp, compra e evolução.', m: 'landfall, adapt, evolve, graft', alt: ['Quandrix (Strixhaven)', 'Aether Rangers (Aetherdrift)'] }] },
  { g: 'Fragmentos de Alara', d: 'Uma cor no centro, com as duas vizinhas.', cs: [
    { k: 'WUG', n: 'Bant', f: 'fragmento de base branca', p: 'Nobreza: encantamentos que dão voo e travam.', alt: ['Brokers (Capenna)'] },
    { k: 'WUB', n: 'Esper', f: 'fragmento de base azul', p: 'Controle e ordem: artefatos e artífices.', alt: ['Obscura (Capenna)'] },
    { k: 'UBR', n: 'Grixis', f: 'fragmento de base preta', p: 'Morte e mortos-vivos: gatilhos, taxa e queima.', alt: ['Maestros (Capenna)'] },
    { k: 'BRG', n: 'Jund', f: 'fragmento de base vermelha', p: 'Comer ou ser comido: agressão, sacrifício e ramp.', alt: ['Riveteers (Capenna)'] },
    { k: 'WRG', n: 'Naya', f: 'fragmento de base verde', p: 'Colossos: os pequenos seguram até os grandes chegarem.', alt: ['Cabaretti (Capenna)'] }] },
  { g: 'Clãs de Tarkir', d: 'Uma cor no centro, com as duas inimigas. Cada clã tem uma virtude.', cs: [
    { k: 'WBG', n: 'Abzan', f: 'clã da resistência', p: 'Resistência: perdurar, reanimar e ganhar vida.', m: 'outlast, bolster', alt: ['Indatha (Ikoria)', 'Teneb (Planar Chaos)', 'Necra (Apocalypse)', 'Junk'] },
    { k: 'WUR', n: 'Jeskai', f: 'clã da astúcia', p: 'Astúcia: prowess, anulações e queima.', m: 'prowess', alt: ['Raugrin (Ikoria)', 'Numot (Planar Chaos)', 'Raka (Apocalypse)', 'USA'] },
    { k: 'UBG', n: 'Sultai', f: 'clã da crueldade', p: 'Crueldade: o cemitério como recurso.', m: 'delve, self-mill', alt: ['Zagoth (Ikoria)', 'Vorosh (Planar Chaos)', 'Ana (Apocalypse)', 'BUG'] },
    { k: 'WBR', n: 'Mardu', f: 'clã da velocidade', p: 'Velocidade: atacar antes de todos.', m: 'raid, dash', alt: ['Savai (Ikoria)', 'Oros (Planar Chaos)', 'Dega (Apocalypse)', 'Rorzhov'] },
    { k: 'URG', n: 'Temur', f: 'clã da selvageria', p: 'Selvageria: criaturas grandes e cópias.', m: 'cópias de mágica, saque', alt: ['Ketria (Ikoria)', 'Intet (Planar Chaos)', 'Ceta (Apocalypse)', 'RUG'] }] },
  { g: 'Quatro cores', d: 'Os nomes vêm dos Nefilins; cada combinação deixa uma cor de fora.', cs: [
    { k: 'UBRG', n: 'Glint-Eye', f: 'quatro cores', p: 'Tudo, menos o branco.' },
    { k: 'WBRG', n: 'Dune-Brood', f: 'quatro cores', p: 'Tudo, menos o azul.' },
    { k: 'WURG', n: 'Ink-Treader', f: 'quatro cores', p: 'Tudo, menos o preto.' },
    { k: 'WUBG', n: 'Witch-Maw', f: 'quatro cores', p: 'Tudo, menos o vermelho.' },
    { k: 'WUBR', n: 'Yore-Tiller', f: 'quatro cores', p: 'Tudo, menos o verde.' }] },
  { g: 'Cinco cores', d: 'Todas as cores de uma vez.', cs: [
    { k: 'WUBRG', n: 'Arco-íris', f: 'cinco cores', p: 'Quase tudo ao alcance, se a base de mana deixar.', x: 'É a que mais pede pedras de mana e terrenos de todas as cores.' }] }
];
function perfil(c) {
  return c.p + (c.x ? ' ' + c.x : '') + (c.m ? ' Mecânicas: ' + c.m + '.' : '') + (c.alt && c.alt.length ? ' Outros nomes: ' + lista(c.alt) + '.' : '');
}
function rotuloCor(k) { return k === '-' ? 'incolor' : k.split('').map(function (ch) { return NOMEC[ch].toLowerCase(); }).join(', ').replace(/, ([^,]+)$/, ' e $1'); }
/* A cara da carteira: as cores mais jogadas, somando todos os decks, viram a combinação que a carteira seria se fosse um deck.
   Três cores quando a terceira aparece em pelo menos metade dos decks da segunda; senão, a guilda das duas primeiras. */
function caraDaCarteira(cnt, por) {
  var ord = WUBRG.slice().sort(function (a, b) { return cnt[b] - cnt[a] || WUBRG.indexOf(a) - WUBRG.indexOf(b); });
  if (!cnt[ord[0]]) return '';
  var top = cnt[ord[2]] && cnt[ord[2]] >= cnt[ord[1]] / 2 ? ord.slice(0, 3) : cnt[ord[1]] ? ord.slice(0, 2) : ord.slice(0, 1);
  var k = WUBRG.filter(function (ch) { return top.indexOf(ch) >= 0; }).join(''), c = null;
  ALBUM.forEach(function (p) { p.cs.forEach(function (x) { if (x.k === k) c = x; }); });
  if (!c) return '';
  var ds = por[k] || [], cores = top.map(function (ch) { return NOMEC[ch].toLowerCase() + ' (' + cnt[ch] + ')'; });
  var vezes = ['', 'uma vez', 'duas vezes', 'três vezes', 'quatro vezes', 'cinco vezes'][ds.length] || ds.length + ' vezes';
  /* "Velocidade: atacar antes de todos." já está no "clã da velocidade": fica só "atacar antes de todos" */
  var art = /^guilda/.test(c.f) ? 'a ' : /^(fragmento|clã)/.test(c.f) ? 'o ' : '', m0 = /^([^:]+):\s*(.+)$/.exec(c.p);
  var oque = m0 && c.f.toLowerCase().indexOf(m0[1].toLowerCase()) >= 0 ? ': ' + m0[2] : '. ' + c.p;
  return '<div class="cara"><span class="fig-m">' + manaTxt(k) + '</span><p><b>A cara da carteira: ' + esc(c.n) + '.</b> Somando as cores de todos os decks, ' +
    esc(lista(cores)) + ' vêm na frente. Se a carteira fosse um deck, seria ' + esc(c.n) + ', ' + art + esc(c.f) + esc(oque) + ' ' +
    (ds.length ? 'E essa figurinha você já tem ' + vezes + ': ' + esc(lista(ds.map(function (d) { return d.nome; }))) + '.' : 'E é justamente uma figurinha que falta no álbum.') + '</p></div>';
}
function coresDeck(d) { return d.cores ? d.cores : (d.painel ? '-' : ''); }
function album() {
  var por = {}, cnt = { W: 0, U: 0, B: 0, R: 0, G: 0 }, conhecidos = 0;
  H.decks.forEach(function (d) {
    var k = coresDeck(d); if (!k) return;
    conhecidos++; (por[k] = por[k] || []).push(d);
    k.split('').forEach(function (ch) { if (cnt[ch] != null) cnt[ch]++; });
  });
  var todas = []; ALBUM.forEach(function (p) { p.cs.forEach(function (c) { todas.push(c); }); });
  var tem = todas.filter(function (c) { return por[c.k]; }), rep = todas.filter(function (c) { return por[c.k] && por[c.k].length > 1; });
  var falta = todas.filter(function (c) { return !por[c.k] && c.k !== '-'; });
  var sug = falta.map(function (c) {
    var s = soma(c.k.split(''), function (ch) { return 1 / Math.max(1, cnt[ch]); }) / c.k.length;
    return { c: c, s: s };
  }).sort(function (a, b) { return b.s - a.s || a.c.k.length - b.c.k.length; }).slice(0, 3);
  var raras = WUBRG.slice().sort(function (a, b) { return cnt[a] - cnt[b]; });
  var n = 0;
  var pags = ALBUM.map(function (p) {
    var dentro = p.cs.filter(function (c) { return por[c.k]; }).length;
    return '<div class="pag"><div class="pag-h"><h4>' + esc(p.g) + '</h4><span class="num">' + dentro + ' de ' + p.cs.length + '</span><p>' + esc(p.d) + '</p></div><div class="figs">' + p.cs.map(function (c) {
      n++;
      var ds = por[c.k] || [], capa = null;
      ds.forEach(function (d) { if (!capa && d.capa) capa = d.capa; });
      var tip = c.n + (c.f === 'uma cor' ? '. ' : ' (' + rotuloCor(c.k) + '; ' + c.f + '). ') + perfil(c) + (ds.length ? ' Seus decks: ' + lista(ds.map(function (d) { return d.nome; })) + '.' : ' Você ainda não tem.');
      return '<article class="fig' + (ds.length ? ' tem' : ' falta') + (c.al ? ' aliada' : '') + '" data-tip="' + esc(tip) + '">' +
        (ds.length && capa ? '<img src="' + capa + '" alt="" loading="lazy">' : '') + '<span class="fig-n num">' + (n < 10 ? '0' : '') + n + '</span>' +
        (ds.length > 1 ? '<span class="rep">×' + ds.length + '</span>' : '') + '<div class="fig-c"><span class="fig-m">' + manaTxt(c.k === '-' ? '' : c.k) + '</span><h5>' + esc(c.n) + '</h5>' +
        (ds.length ? '<p class="fig-d">' + ds.map(function (d) { return d.painel ? '<a href="' + esc(d.href) + '">' + esc(d.nome) + '</a>' : esc(d.nome); }).join(', ') + '</p><span class="sr">' + esc(perfil(c)) + '</span>' : '<p class="fig-p">' + esc(c.p) + '</p>') +
        '</div>' + (ds.length ? '' : '<span class="carimbo" aria-hidden="true">falta</span>') + '</article>';
    }).join('') + '</div></div>';
  }).join('');
  /* a mesma coisa em lista: tenho ou não tenho, combinação por combinação, com o perfil e os outros nomes */
  var m = 0;
  var linhas = ALBUM.map(function (p) {
    return p.cs.map(function (c) {
      m++;
      var ds = por[c.k] || [];
      return '<tr class="' + (ds.length ? 'tem' : 'falta') + '"><td class="n num">' + (m < 10 ? '0' : '') + m + '</td>' +
        '<th scope="row">' + esc(c.n) + '<small>' + esc(c.f) + '</small><span class="cm-m">' + manaTxt(c.k === '-' ? '' : c.k) + '</span></th><td class="cm">' + manaTxt(c.k === '-' ? '' : c.k) + '</td>' +
        '<td>' + (ds.length ? pill('ok', 'tenho' + (ds.length > 1 ? ' ×' + ds.length : ''), '✓') + '<small class="dk">' + ds.map(function (d) { return d.painel ? '<a href="' + esc(d.href) + '">' + esc(d.nome) + '</a>' : esc(d.nome); }).join(', ') + '</small>' : pill('bad', 'falta', '✕')) + '</td>' +
        '<td class="pf">' + esc(perfil(c)) + '</td></tr>';
    }).join('');
  }).join('');
  var conferencia = '<details class="alb-lista"><summary>Ver o álbum como lista: tenho ou não tenho, combinação por combinação</summary><div class="tw"><table class="tbl">' +
    '<thead><tr><th scope="col" class="n">Nº</th><th scope="col">Combinação</th><th scope="col">Cores</th><th scope="col">Na carteira</th><th scope="col">Perfil, mecânicas e outros nomes</th></tr></thead><tbody>' + linhas + '</tbody></table></div></details>';
  var resumo = '<div class="alb-h"><div class="alb-n"><b class="num">' + tem.length + '</b><span>de ' + todas.length + ' figurinhas coladas</span></div>' +
    '<span class="meter grande" aria-hidden="true"><i style="width:' + (tem.length / todas.length * 100).toFixed(1) + '%"></i></span>' +
    '<p>Faltam ' + (todas.length - tem.length) + '. Repetidas: ' + esc(lista(rep.map(function (c) { return c.n + ' ×' + por[c.k].length; }))) + '.</p>' +
    '<p>As cores que você menos joga: ' + esc(lista(raras.slice(0, 2).map(function (ch) { return NOMEC[ch].toLowerCase() + ' (' + pl(cnt[ch], 'deck', 'decks') + ')'; }))) + '. ' +
    'Para equilibrar a carteira, as figurinhas que mais faltam são ' + esc(lista(sug.map(function (x) { return x.c.n; }))) + '.</p></div>' + caraDaCarteira(cnt, por);
  var prog = '<div class="pags">' + ALBUM.map(function (p) {
    var dentro = p.cs.filter(function (c) { return por[c.k]; }).length;
    return '<div class="barra"><span>' + esc(p.g) + '</span><span class="t"><i style="width:' + (dentro / p.cs.length * 100).toFixed(1) + '%"></i></span><b class="num">' + dentro + ' de ' + p.cs.length + '</b></div>';
  }).join('') + '</div>';
  return { h: resumo + roda(por, cnt, prog) + '<div class="album">' + pags + '</div>' + conferencia, tem: tem.length, todas: todas.length };
}
function roda(por, cnt, prog) {
  var R = 104, cx = 170, cy = 164, ang = { W: -90, U: -18, B: 54, R: 126, G: 198 }, P = {};
  WUBRG.forEach(function (ch) { var a = ang[ch] * Math.PI / 180; P[ch] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
  var pares = [['W', 'U', 'Azorius'], ['U', 'B', 'Dimir'], ['B', 'R', 'Rakdos'], ['R', 'G', 'Gruul'], ['G', 'W', 'Selesnya'],
               ['W', 'B', 'Orzhov'], ['U', 'R', 'Izzet'], ['B', 'G', 'Golgari'], ['R', 'W', 'Boros'], ['G', 'U', 'Simic']];
  var ord = function (a, b) { return WUBRG.filter(function (ch) { return ch === a || ch === b; }).join(''); };
  var linhas = pares.map(function (p) {
    var ds = por[ord(p[0], p[1])] || [], a = P[p[0]], b = P[p[1]];
    return '<g data-tip="' + esc(p[2] + ': ' + (ds.length ? lista(ds.map(function (d) { return d.nome; })) : 'nenhum deck')) + '"><line class="hitl" x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '"/>' +
      '<line class="' + (ds.length ? 'gld' : 'gld vazia') + '" style="stroke-width:' + (ds.length ? 3 + 2.5 * (ds.length - 1) : 1) + '" x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '"/></g>';
  }).join('');
  var nos = WUBRG.map(function (ch) {
    var p = P[ch], r = 15 + Math.sqrt(cnt[ch]) * 3.2, lado = Math.cos(ang[ch] * Math.PI / 180), lx, ly, an = 'middle';
    if (lado > 0.5) { lx = p.x + r + 6; ly = p.y + 4; an = 'start'; }
    else if (lado < -0.5) { lx = p.x - r - 6; ly = p.y + 4; an = 'end'; }
    else if (p.y < cy) { lx = p.x; ly = p.y - r - 7; }
    else { lx = p.x; ly = p.y + r + 15; }
    return '<g data-tip="' + esc(NOMEC[ch] + ': em ' + pl(cnt[ch], 'deck', 'decks')) + '"><circle class="no" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + r.toFixed(1) + '" style="fill:' + MANA[ch] + '"/>' +
      '<text class="no-t" x="' + p.x.toFixed(1) + '" y="' + (p.y + 5).toFixed(1) + '" text-anchor="middle">' + cnt[ch] + '</text>' +
      '<text class="no-l" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="' + an + '">' + NOMEC[ch] + '</text></g>';
  }).join('');
  var g2 = pares.filter(function (p) { return por[ord(p[0], p[1])]; }).length;
  return '<div class="roda"><svg viewBox="0 0 340 320" role="img" aria-label="Roda das cores: ' + g2 + ' de 10 guildas na carteira">' + linhas + nos + '</svg>' +
    '<div class="roda-t"><p><b>A roda das cores.</b> Cada círculo é uma cor, do tamanho de quantos decks a usam. Cada linha é uma guilda: grossa quando você tem o deck, fina quando falta. As do contorno são as aliadas; as da estrela, as inimigas.</p>' +
    '<p class="num"><b>' + g2 + ' de 10</b> guildas na carteira. Faltam ' + esc(lista(pares.filter(function (p) { return !por[ord(p[0], p[1])]; }).map(function (p) { return p[2]; }))) + '.</p>' + (prog || '') + '</div></div>';
}
function secCarteira() {
  var comCor = H.decks.filter(function (d) { return d.cores; }), semCor = H.decks.length - comCor.length;
  var porCor = WUBRG.map(function (k) {
    return { r: '<i class="ms ms-' + k + '" style="width:18px;height:18px;font-size:10px;margin-right:6px;vertical-align:-3px">' + k + '</i>' + NOMEC[k], v: comCor.filter(function (d) { return d.cores.indexOf(k) >= 0; }).length, c: MANA[k] };
  });
  var nomesN = ['', 'Uma cor', 'Duas cores', 'Três cores', 'Quatro cores', 'Cinco cores'];
  var porQtd = [1, 2, 3, 4, 5].map(function (n) { return { r: nomesN[n], v: comCor.filter(function (d) { return d.cores.length === n; }).length }; }).filter(function (x) { return x.v; });
  var maxCor = Math.max.apply(null, porCor.map(function (x) { return x.v; }).concat(porQtd.map(function (x) { return x.v; })));
  var cri = DK.map(function (d) { return { r: esc(d.nome), v: (d.tipos && d.tipos.cri) || 0 }; }).sort(function (a, b) { return b.v - a.v; });
  var tot = H.decks.length, capa = H.decks.filter(function (d) { return d.capa; }).length, listaN = H.decks.filter(function (d) { return d.lista; }).length;
  var fun = [{ r: 'No inventário', v: tot }, { r: 'Com capa', v: capa }, { r: 'Com lista', v: listaN }, { r: 'Com painel', v: DK.length }];
  var prox = H.decks.filter(function (d) { return !d.painel && d.prio; }).sort(function (a, b) { return a.prio - b.prio; });
  var A = album();
  var h = caixa('O álbum das combinações de cores', A.h + nota('Nomes, perfis, mecânicas e outros nomes das combinações: <a href="https://draftsim.com/mtg-color-combinations/" target="_blank" rel="noopener noreferrer">Draftsim, “All 26 Color Combinations of Magic”</a> (Ethan Rodgers, atualizado em 30/09/2026), em resumo nosso; as cinco cores puras são resumo nosso da roda das cores. ' +
      'As cores de cada deck vêm do painel ou, sem painel, do inventário. Passe o mouse numa figurinha para ver o perfil, ou abra a lista logo acima.'), 'larga album-box');
  h += '<div class="g3">' + caixa('Cores dos seus decks', barras(porCor, maxCor) + '<h4>Quantas cores cada deck usa</h4>' + barras(porQtd, maxCor) +
      nota(pl(comCor.length, 'deck', 'decks') + ' com as cores conhecidas' + (semCor ? '; ' + pl(semCor, 'ainda está', 'ainda estão') + ' sem cor no inventário' : '') + '.')) +
    caixa('Andamento da análise', barras(fun, tot) + nota((prox.length ? 'Próximos pela prioridade do inventário: ' + esc(lista(prox.map(function (d) { return d.nome; }))) + '. ' : '') + 'Um deck ganha painel com o /novo-deck, a partir da lista e das análises de fora.')) +
    caixa('Criaturas por deck', (cri.length ? barras(cri, Math.max.apply(null, cri.map(function (x) { return x.v; }))) : '') + nota('Conta o comandante. Só os decks que já têm painel.')) + '</div>';
  return secao('carteira', 'Carteira', 'Os ' + tot + ' decks do inventário, com ou sem painel.', h);
}

/* ============ bracket estimado ============ */
/* As regras dos brackets oficiais do Commander que dá para ler numa lista: Game Changers (lista do Scryfall, is:gamechanger),
   destruição de terrenos em massa e turno extra (pelo texto oficial, no build), e combos de duas cartas (os combos da
   avaliação). Vale a regra mais alta que disparar, com o motivo escrito. O 1 e o 2 só se separam pela intenção do dono,
   então o piso é 2. Quem decide o bracket de verdade é o dono: isto é uma estimativa com porquê. */
var KIND_COMBO = { Combo: 1, 'Vitória': 1, Finalizador: 1 };
function bracketDe(A, cs) {
  var tem = {}, gc = [], ml = [], xt = [];
  cs.forEach(function (c) { tem[c.i] = 1; if (c.gc) gc.push(c.n); if (c.ml) ml.push(c.n); if (c.xt) xt.push(c.n); });
  var c2 = A.combos.filter(function (k) { return KIND_COMBO[k.k] && k.p.length === 2 && k.p.every(function (id) { return tem[id]; }); });
  var b = 2, why = [];
  function sobe(n, t) { if (n > b) b = n; why.push({ b: n, t: t }); }
  if (!H.gc) why.push({ b: 0, t: 'Sem a lista de Game Changers (o build não alcançou o Scryfall): a estimativa ignora esse critério.' });
  else if (gc.length >= 4) sobe(4, pl(gc.length, 'Game Changer', 'Game Changers') + ': quatro ou mais pedem o 4');
  else if (gc.length) sobe(3, pl(gc.length, 'Game Changer', 'Game Changers') + ': até três cabem no 3');
  if (ml.length) sobe(4, 'destruição de terrenos em massa (' + lista(ml) + ')');
  if (xt.length >= 3) sobe(3, pl(xt.length, 'carta', 'cartas') + ' de turno extra: risco de encadear');
  else if (xt.length) why.push({ b: 0, t: 'turno extra avulso (' + lista(xt) + '): cabe no 2 e no 3 se não encadear' });
  if (c2.length) sobe(3, pl(c2.length, 'combo de duas cartas', 'combos de duas cartas') + ' (' + lista(c2.map(function (k) { return k.n; })) + '); se monta antes do turno 6, é 4');
  if (!why.some(function (w) { return w.b; })) why.unshift({ b: 2, t: 'nenhum Game Changer, combo de duas cartas, turno extra em série ou destruição de terrenos; o 1 é só para deck temático de propósito' });
  return { b: b, gc: gc, ml: ml, xt: xt, c2: c2, why: why };
}
DK.forEach(function (d) { d.a.br = bracketDe(d.a, d.a.cards); d.a.br2 = bracketDe(d.a, d.a.cs2); });
function brTxt(br) { return br.why.filter(function (w) { return w.b; }).map(function (w) { return w.t; }).join('; ') || br.why.map(function (w) { return w.t; }).join('; '); }
function brBadge(A, comTrocas) {
  var b = A.br, b2 = A.br2, tip = 'Bracket estimado ' + b.b + ': ' + brTxt(b) + '.' + (A.alvo ? ' Alvo do dono: ' + A.alvo + '.' : '') + (b2.b !== b.b ? ' Com as trocas recomendadas: ' + b2.b + ' (' + brTxt(b2) + ').' : '');
  return '<span class="brk b' + b.b + (A.alvo && A.alvo !== b.b ? ' fora' : '') + '" data-tip="' + esc(tip) + '">B' + b.b + (comTrocas && b2.b !== b.b ? '<small>→' + b2.b + '</small>' : '') + '</span>';
}

/* ============ a mão inicial ============ */
function pEQ(N, K, n, k) { return comb(K, k) * comb(N - K, n - k) / comb(N, n); }
function nCmd(A) { return soma(A.cards.filter(function (c) { return c.cm; }), function (c) { return c.q || 1; }) || 1; }
function mao(A) {
  var st = A.st, N = Math.max(8, st.n - nCmd(A)), L = st.lands + st.mdfc;
  var g = function (k) { var i = gix(A, k); return i < 0 ? null : st.grp[i].hard; };
  var r = g('ramp'), d = g('draw'), rm = g('removal'), terr = 0, k;
  for (k = 2; k <= 4; k++) terr += pEQ(N, L, 7, k);
  return { terr: terr, ramp: r == null ? null : pGE(N, r, 7, 1), compra: d == null ? null : pGE(N, d, 10, 1), rem: rm == null ? null : pGE(N, rm, 10, 1), n: { r: r, d: d, rm: rm, L: L } };
}

/* ============ peças pequenas das fichas ============ */
function svgCurva(cv, cv2) {
  var W = 236, Hh = 74, mb = 16, mt = 6, n = cv.length, bw = W / n, mx = Math.max.apply(null, cv.concat(cv2 || [])) || 1;
  var g = cv.map(function (v, i) {
    var x = i * bw, h = v / mx * (Hh - mb - mt), h2 = cv2 ? cv2[i] / mx * (Hh - mb - mt) : 0, w = cv2 ? (bw - 6) / 2 : bw - 6;
    var lbl = i === n - 1 ? n - 1 + '+' : String(i);
    return '<g data-tip="' + esc('Custo ' + lbl + ': ' + v + (cv2 ? ' contra ' + cv2[i] : '') + ' mágicas') + '"><rect class="hit" x="' + x.toFixed(1) + '" y="0" width="' + bw.toFixed(1) + '" height="' + Hh + '"/>' +
      '<rect class="cbar" x="' + (x + 3).toFixed(1) + '" y="' + (Hh - mb - h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(h, v ? 1.5 : 0).toFixed(1) + '" rx="2"/>' +
      (cv2 ? '<rect class="cbar b2" x="' + (x + 3 + w).toFixed(1) + '" y="' + (Hh - mb - h2).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(h2, cv2[i] ? 1.5 : 0).toFixed(1) + '" rx="2"/>' : '') +
      '<text class="tk" x="' + (x + bw / 2).toFixed(1) + '" y="' + (Hh - 3) + '" text-anchor="middle">' + lbl + '</text></g>';
  }).join('');
  return '<svg class="curva" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="Curva de custo das mágicas: ' + cv.join(', ') + '">' + g + '</svg>';
}
function tiposBar(A) {
  var t = A.st.tipos, tot = soma(Object.keys(t), function (k) { return t[k]; }) || 1;
  var ks = ['cri', 'art', 'enc', 'ins', 'fei', 'pw', 'bat', 'ter'].filter(function (k) { return t[k]; });
  return '<span class="stk tipos">' + ks.map(function (k) { return '<i class="tp-' + k + '" style="flex:' + t[k] + '" data-tip="' + esc(TIPOS[k] + ': ' + t[k] + ' (' + pct(t[k] / tot) + ')') + '"></i>'; }).join('') + '</span>' +
    '<p class="tipos-l">' + ks.map(function (k) { return '<span><i class="tp-' + k + '"></i>' + TIPOS[k] + ' <b class="num">' + t[k] + '</b></span>'; }).join('') + '</p>';
}
function fundMini(A) {
  return '<div class="fm">' + FUND.map(function (f) {
    var v = f.v(A); if (v == null) return '';
    var e = estadoFund(f, A, v);
    return '<div class="fm-l"><span>' + f.n + '</span><b class="num' + (e === 'warn' ? ' aviso' : '') + '">' + v + '</b>' + bullet(f, v, e, A.nome + ': ' + v + ' ' + f.n.toLowerCase() + '. Referência de ' + f.ref[0] + ' a ' + f.ref[1] + '.') + '</div>';
  }).join('') + '</div>';
}
function coresMini(A) {
  var id = A.ident.split(''); if (id.length < 2) return '';
  var pt = soma(id, function (ch) { return A.st.pip[ch]; }) || 1, ft = soma(id, function (ch) { return A.st.src[ch]; }) || 1;
  return '<div class="cbm">' + id.map(function (ch) {
    var a = A.st.pip[ch] / pt, b = A.st.src[ch] / ft;
    return '<div class="cbr" data-tip="' + esc(NOMEC[ch] + ': ' + pct(a) + ' dos símbolos de mana, ' + pct(b) + ' das fontes') + '"><span>' + manaTxt(ch) + '</span><span class="cbt"><i class="dem" style="width:' + (a * 100).toFixed(1) + '%;--c:' + MANA[ch] + '"></i><i class="ofe" style="width:' + (b * 100).toFixed(1) + '%;--c:' + MANA[ch] + '"></i></span>' +
      '<span class="num' + (a - b >= 0.1 ? ' aviso' : '') + '">' + pct(a) + ' / ' + pct(b) + '</span></div>';
  }).join('') + '</div>';
}
function combosResumo(A) {
  var fech = A.combos0.filter(function (x) { return !x.falta.length && !/armadilha/i.test(x.k.k); });
  var duros = fech.filter(function (x) { return KIND_COMBO[x.k.k]; }), motores = fech.length - duros.length;
  var um = A.combos0.filter(function (x) { return x.falta.length === 1 && !/armadilha/i.test(x.k.k); });
  return { duros: duros, motores: motores, um: um };
}

/* ============ fichas ============ */
var ficha = { ord: 'grupo', g: '' };
var ORD_F = [['grupo', 'Grupo'], ['nome', 'Nome'], ['bracket', 'Bracket'], ['valor', 'Valor'], ['alertas', 'Alertas']];
function fichaDe(d, i) {
  var A = d.a, st = A.st, M = mao(A), C = combosResumo(A);
  var bem = A.contra.filter(function (c) { return c.r === 'forte'; }).map(function (c) { return (ARQ.filter(function (a) { return a.k === c.k; })[0] || { n: c.k }).n; });
  var mal = A.contra.filter(function (c) { return c.r === 'fraco'; }).map(function (c) { return (ARQ.filter(function (a) { return a.k === c.k; })[0] || { n: c.k }).n; });
  var al = nAlertas(A.le), dp = A.st2.total - st.total;
  var odd = function (rot, p, tip) { return p == null ? '' : '<div class="odd" data-tip="' + esc(tip) + '"><b class="num">' + pct(p) + '</b><span>' + rot + '</span></div>'; };
  var h = '<article class="fi" id="f-' + i + '" data-grupo="' + esc(d.grupo) + '">' +
    '<header class="fi-h"><div><h3>' + deckLink(A) + '</h3><p class="dim">' + esc(A.painel) + (A.cmd ? ' · ' + esc(A.cmd.n) : '') + '</p></div>' +
    '<div class="fi-b">' + cores(A.ident) + brBadge(A, true) + '</div></header>' +
    '<div class="fi-n">' +
      '<div><span>Placar</span><b class="num">' + st.total + '</b><small class="num ' + (dp > 0 ? 'pos' : dp < 0 ? 'neg' : '') + '">' + (dp ? sinal(dp) + ' com as trocas' : 'sem trocas') + '</small></div>' +
      '<div><span>CMC médio</span><b class="num">' + num(st.avg, 2) + '</b><small class="num">' + pct(st.low / (st.nonland || 1)) + ' custam 2 ou menos</small></div>' +
      '<div><span>Valor</span><b class="num">' + dol(st.usd, 0) + '</b><small class="num">' + (A.tr.length ? A.tr.length + ' trocas, ' + dol(A.custo, 0) : 'nenhuma troca') + '</small></div>' +
      '<div><span>Alertas</span><b class="num' + (al ? ' aviso' : '') + '">' + al + '</b><small class="num">de ' + A.le.length + ' leituras</small></div>' +
    '</div>' +
    '<div class="fi-g">' +
      '<div><h4>Curva das mágicas</h4>' + svgCurva(st.curva) + '<h4>Tipos</h4>' + tiposBar(A) + '</div>' +
      '<div><h4>Fundamentos</h4>' + fundMini(A) + '</div>' +
    '</div>' +
    '<h4>Na mão</h4><div class="odds">' +
      odd('2 a 4 terrenos na mão de 7', M.terr, M.n.L + ' fontes de terreno em ' + (st.n - nCmd(A)) + ' cartas. Mão de 7, sem mulligan.') +
      odd('ramp na mão de 7', M.ramp, M.n.r + ' cartas de ramp dedicado. Pelo menos uma na mão de 7.') +
      odd('compra até o turno 4', M.compra, M.n.d + ' cartas de compra dedicada. Pelo menos uma entre as 10 primeiras cartas (mão de 7 e três compras).') +
      odd('remoção até o turno 4', M.rem, M.n.rm + ' remoções dedicadas. Pelo menos uma entre as 10 primeiras cartas.') +
    '</div>' +
    (A.ident.length >= 2 ? '<h4>Cores: símbolos / fontes</h4>' + coresMini(A) : '') +
    '<dl class="fi-d">' +
      '<div><dt>Game Changers</dt><dd>' + (A.br.gc.length ? '<span class="chips">' + A.br.gc.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</span>' : (H.gc ? 'nenhum' : 'lista indisponível')) + '</dd></div>' +
      '<div><dt>Combos</dt><dd>' + (C.duros.length ? esc(lista(C.duros.map(function (x) { return x.k.n; }))) : 'nenhum combo fechado') + (C.motores ? ' · ' + pl(C.motores, 'motor', 'motores') : '') +
        (C.um.length ? '<br><span class="dim">A uma carta: ' + esc(lista(C.um.slice(0, 3).map(function (x) { var id = x.falta[0], c = A.idx[id]; return x.k.n + ' (falta ' + (c ? c.n : id) + (c && c.v ? ', no radar' : '') + ')'; }))) + (C.um.length > 3 ? ' e mais ' + (C.um.length - 3) : '') + '</span>' : '') + '</dd></div>' +
      '<div><dt>Mesa</dt><dd>' + (bem.length ? 'vai bem contra ' + esc(lista(bem)) : 'sem ponto forte declarado') + (mal.length ? '; vai mal contra ' + esc(lista(mal)) : '') + '</dd></div>' +
    '</dl>' +
    '<p class="fi-f"><a href="' + esc(A.href) + '">Abrir o painel</a><button class="linkish" data-act="cmp-com" data-k="' + esc(d.pasta) + '">Comparar com outro</button></p>' +
    '</article>';
  return h;
}
function ordFichas() {
  var idx = DK.map(function (d, i) { return { d: d, i: i }; }).filter(function (x) { return !ficha.g || x.d.grupo === ficha.g; });
  var by = {
    grupo: function (a, b) { return a.i - b.i; },
    nome: function (a, b) { return a.d.nome.localeCompare(b.d.nome); },
    bracket: function (a, b) { return b.d.a.br.b - a.d.a.br.b || a.i - b.i; },
    valor: function (a, b) { return b.d.a.st.usd - a.d.a.st.usd; },
    alertas: function (a, b) { return nAlertas(b.d.a.le) - nAlertas(a.d.a.le) || a.i - b.i; }
  };
  return idx.sort(by[ficha.ord]);
}
function secFichas() {
  var gs = H.grupos.filter(function (g) { return DK.some(function (d) { return d.grupo === g.k; }); });
  var ctl = '<div class="ctl"><div class="seg" role="group" aria-label="Ordem das fichas"><span class="seg-l">Ordem</span>' + ORD_F.map(function (o) {
      return '<button data-act="ficha-ord" data-k="' + o[0] + '" aria-pressed="' + (ficha.ord === o[0]) + '">' + o[1] + '</button>';
    }).join('') + '</div><div class="seg" role="group" aria-label="Grupo"><span class="seg-l">Grupo</span><button data-act="ficha-g" data-k="" aria-pressed="' + (!ficha.g) + '">Todos</button>' + gs.map(function (g) {
      return '<button data-act="ficha-g" data-k="' + esc(g.k) + '" aria-pressed="' + (ficha.g === g.k) + '">' + esc(g.n.replace(/^\d+\. /, '')) + '</button>';
    }).join('') + '</div></div>';
  var brs = {}; DK.forEach(function (d) { brs[d.a.br.b] = (brs[d.a.br.b] || 0) + 1; });
  var h = ctl + '<div class="fis">' + ordFichas().map(function (x) { return fichaDe(x.d, x.i); }).join('') + '</div>' +
    nota('Bracket estimado pelas regras oficiais que dá para ler na lista: Game Changers (lista do Scryfall' + (H.gc ? ', ' + H.gc.n + ' cartas, consulta de ' + brData(H.gc.d) : ', indisponível neste build') + '), destruição de terrenos em massa e turno extra pelo texto oficial, e os combos de duas cartas da avaliação. ' +
      'Passe o mouse no selo para ler o motivo. Hoje: ' + esc(lista(Object.keys(brs).sort().map(function (k) { return pl(brs[k], 'deck', 'decks') + ' no ' + k; }))) + '. ' +
      'Na mão: probabilidade hipergeométrica, grimório sem o comandante, mão de 7 sem mulligan.');
  return secao('fichas', 'Fichas dos decks', 'Cada deck numa tela: força, custo, base, interação e a mesa. O placar compara o deck com ele mesmo, nunca com os outros.', h);
}

/* ============ comparar dois decks ============ */
function semBas(A) { var m = {}; A.cards.forEach(function (c) { var k = chave(c); if (!BAS[k]) m[k] = c; }); return m; }
function pares() {
  var out = [];
  for (var i = 0; i < DK.length; i++) for (var j = i + 1; j < DK.length; j++) {
    var a = semBas(DK[i].a), b = semBas(DK[j].a), n = 0, u = 0, k;
    for (k in a) { u++; if (b[k]) n++; } for (k in b) if (!a[k]) u++;
    out.push({ a: DK[i], b: DK[j], n: n, j: u ? n / u : 0 });
  }
  return out.sort(function (x, y) { return y.n - x.n || y.j - x.j; });
}
var PARES = pares();
var cmp = { a: PARES.length ? PARES[0].a.pasta : '', b: PARES.length ? PARES[0].b.pasta : '' };
function porPasta(p) { for (var i = 0; i < DK.length; i++) if (DK[i].pasta === p) return DK[i]; return null; }
function secComparar() {
  if (DK.length < 2) return '';
  var da = porPasta(cmp.a) || DK[0], db = porPasta(cmp.b) || DK[1], A = da.a, B = db.a;
  var ma = semBas(A), mb = semBas(B), comum = [], soA = [], soB = [], k;
  for (k in ma) (mb[k] ? comum : soA).push(k); for (k in mb) if (!ma[k]) soB.push(k);
  var porT = function (m) { return function (x, y) { return TR[m[x].T] - TR[m[y].T] || x.localeCompare(y); }; };
  comum.sort(porT(ma)); soA.sort(porT(ma)); soB.sort(porT(mb));
  var sel = function (lado, atual) { return '<label class="cmp-s"><span class="sr">Deck ' + lado + '</span><select data-cmp="' + lado + '">' + DK.map(function (d) { return '<option value="' + esc(d.pasta) + '"' + (d.pasta === atual ? ' selected' : '') + '>' + esc(d.nome) + '</option>'; }).join('') + '</select></label>'; };
  var g = function (X, key) { var i = gix(X, key); return i < 0 ? '—' : X.st.grp[i].hard; };
  var linhas = [
    ['Bracket estimado', brBadge(A), brBadge(B)], ['CMC médio', num(A.st.avg, 2), num(B.st.avg, 2)], ['Fontes de terreno', A.st.lands + A.st.mdfc, B.st.lands + B.st.mdfc],
    ['Ramp dedicado', g(A, 'ramp'), g(B, 'ramp')], ['Compra dedicada', g(A, 'draw'), g(B, 'draw')], ['Remoção', g(A, 'removal'), g(B, 'removal')], ['Em massa', A.st.wipes, B.st.wipes],
    ['Criaturas', A.st.cri, B.st.cri], ['Game Changers', A.br.gc.length, B.br.gc.length], ['Valor', dol(A.st.usd, 0), dol(B.st.usd, 0)], ['Alertas', nAlertas(A.le), nAlertas(B.le)]
  ];
  var chip = function (m, nome) { return function (k) { var c = m[k]; return '<span class="ch-' + c.r + '" data-tip="' + esc(nome + ': tier ' + c.T + ', ' + RELN[c.r].toLowerCase()) + '">' + esc(k) + ' ' + esc(c.T) + '</span>'; }; };
  var chipC = function (k) { var x = ma[k], y = mb[k]; return '<span data-tip="' + esc(A.nome + ': ' + x.T + ' ' + RELL[x.r] + '; ' + B.nome + ': ' + y.T + ' ' + RELL[y.r]) + '"' + (x.T !== y.T ? ' class="dif"' : '') + '>' + esc(k) + ' <small>' + x.T + '·' + y.T + '</small></span>'; };
  var h = '<div class="cmp-top">' + sel('a', da.pasta) + '<span class="vs">contra</span>' + sel('b', db.pasta) + '</div>' +
    '<div class="g2"><div class="cx"><h3>' + esc(A.nome) + ' e ' + esc(B.nome) + '</h3>' +
      '<p class="dest"><b>' + comum.length + '</b> cartas em comum, sem os básicos: ' + pct(comum.length / Math.max(1, comum.length + soA.length + soB.length)) + ' das cartas dos dois somadas.</p>' +
      '<div class="tw"><table class="tbl cmp"><thead><tr><th></th><th scope="col" class="n">' + esc(A.nome) + '</th><th scope="col" class="n">' + esc(B.nome) + '</th></tr></thead><tbody>' +
      linhas.map(function (l) { return '<tr><th scope="row">' + l[0] + '</th><td class="n num">' + l[1] + '</td><td class="n num">' + l[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<h4>Curva das mágicas</h4>' + svgCurva(A.st.curva, B.st.curva) + '<p class="legenda"><span><i class="lg-a"></i>' + esc(A.nome) + '</span><span><i class="lg-b"></i>' + esc(B.nome) + '</span></p></div>' +
    '<div class="cx"><h3>As cartas</h3><h4>Em comum (' + comum.length + ')</h4><div class="chips">' + comum.map(chipC).join('') + '</div>' +
      '<h4>Só no ' + esc(A.nome) + ' (' + soA.length + ')</h4><div class="chips">' + soA.slice(0, 24).map(chip(ma, A.nome)).join('') + (soA.length > 24 ? '<span class="dim">e mais ' + (soA.length - 24) + '</span>' : '') + '</div>' +
      '<h4>Só no ' + esc(B.nome) + ' (' + soB.length + ')</h4><div class="chips">' + soB.slice(0, 24).map(chip(mb, B.nome)).join('') + (soB.length > 24 ? '<span class="dim">e mais ' + (soB.length - 24) + '</span>' : '') + '</div>' +
      nota('Em comum: o tier no primeiro e no segundo deck; destacadas, as que mudam de tier. Só num deck: as 24 de tier mais alto. Cartas em comum disputam a mesma cópia se você não tiver duas.') + '</div></div>' +
    caixa('Os pares mais parecidos da carteira', '<ol class="pares">' + PARES.slice(0, 8).map(function (p) {
      return '<li><button class="linkish" data-act="cmp-par" data-k="' + esc(p.a.pasta) + '" data-v="' + esc(p.b.pasta) + '">' + esc(p.a.nome) + ' e ' + esc(p.b.nome) + '</button> <span class="num">' + p.n + ' em comum</span> <span class="dim num">(' + pct(p.j) + ')</span></li>';
    }).join('') + '</ol>' + nota('Sem os básicos. Par muito parecido é deck redundante na mesa e disputa de cópia física; vale saber antes de comprar a mesma carta duas vezes.'), 'larga');
  return secao('comparar', 'Comparar dois decks', 'Lado a lado: números, curva e cartas. Comece pelos pares mais parecidos.', h);
}

/* ============ movimentações ============ */
/* Uma carta que o radar de um deck pede e que já existe em outro deck. Se ela rende mais onde é pedida (tier melhor no
   radar do que no deck onde está), a sugestão é mover; se não, é "você já tem": compre outra cópia ou aceite tirar de lá.
   O hub não sabe se as duas são a mesma cópia física: quem sabe é o dono. Comandante não sai do lugar. */
function movimentos() {
  var noDeck = {};
  DK.forEach(function (d) { d.a.cards.forEach(function (c) { var k = chave(c); if (BAS[k] || c.cm) return; (noDeck[k] = noDeck[k] || []).push({ A: d.a, c: c }); }); });
  var mova = [], ja = [], pot = [];
  DK.forEach(function (d) {
    d.a.cands.forEach(function (c) {
      if (c.v === 'fora') return;
      var k = chave(c), onde = (noDeck[k] || []).filter(function (x) { return x.A !== d.a; });
      if (!onde.length) return;
      var pior = onde.slice().sort(function (x, y) { return TR[y.c.T] - TR[x.c.T] || RELS.indexOf(y.c.r) - RELS.indexOf(x.c.r); })[0];
      var it = { k: k, para: d.a, c: c, de: pior, onde: onde, ganho: TR[pior.c.T] - TR[c.T], u: c.u };
      (it.ganho > 0 ? mova : ja).push(it);
    });
    (d.a.pool || []).forEach(function (p) {
      var onde = (noDeck[p.n] || []).filter(function (x) { return x.A !== d.a; });
      if (onde.length) pot.push({ k: p.n, para: d.a, onde: onde, y: p.y });
    });
  });
  var V = { entra: 0, avaliar: 1 };
  mova.sort(function (a, b) { return b.ganho - a.ganho || V[a.c.v] - V[b.c.v] || RELS.indexOf(b.de.c.r) - RELS.indexOf(a.de.c.r) || (b.u || 0) - (a.u || 0) || a.k.localeCompare(b.k); });
  ja.sort(function (a, b) { return V[a.c.v] - V[b.c.v] || (b.u || 0) - (a.u || 0) || a.k.localeCompare(b.k); });
  pot.sort(function (a, b) { return (b.y || 0) - (a.y || 0) || a.k.localeCompare(b.k); });
  var vistos = {}, eco = 0;
  mova.concat(ja).forEach(function (x) { var id = x.k + '|' + x.para.pasta; if (!vistos[id]) { vistos[id] = 1; eco += x.u || 0; } });
  var cartas = {}; mova.concat(ja).forEach(function (x) { cartas[x.k] = 1; });
  return { mova: mova, ja: ja, pot: pot, eco: eco, n: Object.keys(cartas).length };
}
var MOV = movimentos();
var movF = { deck: '', so: '' };
function filtraMov(L) { return L.filter(function (x) { return (!movF.deck || x.para.pasta === movF.deck || x.onde.some(function (o) { return o.A.pasta === movF.deck; })) && (!movF.so || (x.c && x.c.v === 'entra')); }); }
function ondeTxt(x, exceto) { return x.onde.filter(function (o) { return o !== exceto; }).map(function (o) { return o.A.nome + ' ' + o.c.T; }); }
function secMov() {
  var sel = '<label class="cmp-s"><span class="seg-l">Deck</span><select data-mov="deck"><option value="">Todos</option>' + DK.map(function (d) { return '<option value="' + esc(d.pasta) + '"' + (movF.deck === d.pasta ? ' selected' : '') + '>' + esc(d.nome) + '</option>'; }).join('') + '</select></label>';
  var seg = '<div class="seg" role="group" aria-label="Veredito no radar"><button data-act="mov-so" data-k="" aria-pressed="' + (!movF.so) + '">Entra e avaliar</button><button data-act="mov-so" data-k="entra" aria-pressed="' + (movF.so === 'entra') + '">Só as que entram</button></div>';
  var mv = filtraMov(MOV.mova), ja = filtraMov(MOV.ja), pot = MOV.pot.filter(function (x) { return !movF.deck || x.para.pasta === movF.deck || x.onde.some(function (o) { return o.A.pasta === movF.deck; }); });
  var vd = function (v) { return '<span class="vd vd-' + v + '">' + (v === 'entra' ? 'entra' : 'avaliar') + '</span>'; };
  var rowsM = mais('mova', mv, 10, function (x) {
    var outros = ondeTxt(x, x.de);
    return '<tr><td><b>' + esc(x.k) + '</b>' + (outros.length ? '<small class="dim">também em ' + esc(lista(outros)) + '</small>' : '') + '</td>' +
      '<td>' + deckLink(x.de.A) + ' ' + tierB(x.de.c.T) + ' ' + relB(x.de.c.r) + '</td><td class="c seta">→</td>' +
      '<td>' + deckLink(x.para) + ' ' + tierB(x.c.T) + ' ' + vd(x.c.v) + '</td><td class="n num">' + (x.u != null ? dol(x.u) : '—') + '</td></tr>';
  }, 5);
  /* uma linha por carta: quem pede, onde já está */
  var porCarta = {}, jaG = [];
  ja.forEach(function (x) { if (!porCarta[x.k]) { porCarta[x.k] = { k: x.k, u: x.u, pedem: [], onde: x.onde }; jaG.push(porCarta[x.k]); } porCarta[x.k].pedem.push(x); });
  var rowsJ = mais('ja', jaG, 10, function (g) {
    var forte = g.pedem.some(function (x) { return x.c.v === 'avaliar'; }) && g.onde.some(function (o) { return TR[o.c.T] <= 1; });
    return '<tr><td><b>' + esc(g.k) + '</b>' + (forte ? ' ' + pill('ok', 'forte em outro deck', '✓') : '') + '</td><td><div class="pede">' + g.pedem.map(function (x) { return '<span>' + deckLink(x.para) + ' ' + tierB(x.c.T) + ' ' + vd(x.c.v) + '</span>'; }).join('') + '</div></td>' +
      '<td><div class="chips">' + g.onde.map(function (o) { return '<span class="ch-' + o.c.r + '" data-tip="' + esc(o.A.nome + ': tier ' + o.c.T + ', ' + RELN[o.c.r].toLowerCase()) + '">' + esc(o.A.nome) + ' ' + esc(o.c.T) + '</span>'; }).join('') + '</div></td>' +
      '<td class="n num">' + (g.u != null ? dol(g.u) : '—') + '</td></tr>';
  }, 4);
  var rowsP = mais('pot', pot, 8, function (x) {
    return '<li><b>' + esc(x.k) + '</b>, potencial do ' + deckLink(x.para) + ', já está em ' + esc(lista(x.onde.map(function (o) { return o.A.nome + ' (' + o.c.T + ')'; }))) + '.</li>';
  });
  var tot = soma(mv, function (x) { return x.u || 0; }), totJ = soma(ja, function (x) { return x.u || 0; });
  var h = '<div class="ctl">' + sel + seg + '</div>' +
    '<p class="dest">' + pl(MOV.n, 'carta que os radares pedem já está', 'cartas que os radares pedem já estão') + ' em algum deck seu: até <b>' + dol(MOV.eco, 0) + '</b> em compras para decidir antes de gastar.</p>' +
    caixa('Mova em vez de comprar (' + mv.length + ')', (mv.length ? '<div class="tw"><table class="tbl mov"><thead><tr><th scope="col">Carta</th><th scope="col">Hoje está em</th><th></th><th scope="col">Rende mais em</th><th scope="col" class="n">Preço</th></tr></thead><tbody>' + rowsM + '</tbody></table></div>' : '<p class="hint">Nada com esse filtro.</p>') +
      nota('O radar de um deck pede, com tier melhor, uma carta que você já tem em outro deck. Da mais vantajosa para a menos: maior salto de tier, depois "entra" antes de "avaliar", depois quem está na berlinda onde está. Mova, ou compre outra cópia; ' + dol(tot, 0) + ' no total, pelo Scryfall.'), 'larga') +
    caixa('Antes de comprar: você já tem (' + jaG.length + ')', (jaG.length ? '<div class="tw"><table class="tbl mov"><thead><tr><th scope="col">Carta</th><th scope="col">Pedida por</th><th scope="col">Já está em</th><th scope="col" class="n">Preço</th></tr></thead><tbody>' + rowsJ + '</tbody></table></div>' : '<p class="hint">Nada com esse filtro.</p>') +
      nota('Aqui a carta rende igual ou mais onde já está: tirar de lá custa. Ou compra outra cópia (' + dol(totJ, 0) + ' somando cada pedido), ou decide qual deck fica com ela. "Forte em outro deck" é carta para avaliar que já é S ou A em outro lugar: um voto a favor de promover.'), 'larga') +
    caixa('Potenciais que você já tem (' + pot.length + ')', '<ul class="lst">' + rowsP + '</ul>' + nota('Cartas que a comunidade sugere para um deck (os potenciais, ainda sem triagem) e que já estão em outro. Quem decide se sobem ao radar é o /atualizar-deck.'), 'larga');
  return secao('movimentacoes', 'Movimentações', 'Onde cada carta rende mais, entre o que você já tem e o que os radares pedem.', h);
}

/* ============ decks em potencial ============ */
function secPotencial() {
  var semP = H.decks.filter(function (d) { return !d.painel; });
  var dono = {};
  DK.forEach(function (d) { d.a.cards.forEach(function (c) { var k = String(chave(c)).split(' // ')[0].toLowerCase(); (dono[k] = dono[k] || []).push({ A: d.a, c: c }); }); });
  semP.sort(function (a, b) { return (b.ref && b.ref.length ? 1 : 0) - (a.ref && a.ref.length ? 1 : 0) || (a.prio || 99) - (b.prio || 99) || a.pasta.localeCompare(b.pasta); });
  var blocos = semP.map(function (d) {
    var cab = '<header class="pot-h">' + (d.capa ? '<img src="' + d.capa + '" alt="">' : '<span class="pot-sem"></span>') + '<div><h3>' + esc(d.nome) + '</h3><p class="dim">' + esc(d.cmd || 'comandante a confirmar') + '</p>' + cores(d.cores) + '</div></header>';
    if (!d.ref || !d.ref.length) return '<article class="pot vazio">' + cab + '<p class="hint">Sem lista de referência. Solte em <code>dados/' + esc(d.pasta) + '/entrada/</code> o texto exportado de uma lista do Moxfield ou do Archidekt, e o hub mede quanto dela você já tem.</p></article>';
    var todas = {}, origem = {};
    var refs = d.ref.map(function (r) {
      var cs = r.cartas.filter(function (x) { return !BAS[x.n] && x.n.split(' // ')[0].toLowerCase() !== String(d.cmd || '').split(' // ')[0].toLowerCase(); });
      var tem = [], falta = [];
      cs.forEach(function (x) { var k = x.n.split(' // ')[0].toLowerCase(), o = dono[k]; todas[x.n] = todas[x.n] || { x: x, em: 0, o: o }; todas[x.n].em++; (o ? tem : falta).push(x); });
      return { r: r, cs: cs, tem: tem, falta: falta };
    });
    var nomes = Object.keys(todas), cons = nomes.filter(function (n) { return todas[n].em === refs.length; });
    var temU = nomes.filter(function (n) { return todas[n].o; }), faltaU = nomes.filter(function (n) { return !todas[n].o; });
    temU.forEach(function (n) {
      var o = todas[n].o.slice().sort(function (a, b) { return TR[b.c.T] - TR[a.c.T]; })[0];
      var rot = o.A.nome + (o.c.cm ? ' (comandante)' : '');
      origem[rot] = (origem[rot] || 0) + 1;
    });
    var orig = Object.keys(origem).map(function (k) { return { r: esc(k), v: origem[k] }; }).sort(function (a, b) { return b.v - a.v; });
    var faltaC = faltaU.map(function (n) { return todas[n]; }).sort(function (a, b) { return (b.em - a.em) || ((b.x.u || 0) - (a.x.u || 0)) || a.x.n.localeCompare(b.x.n); });
    var precoF = soma(faltaC, function (t) { return t.x.u || 0; }), semPreco = faltaC.filter(function (t) { return t.x.u == null; }).length;
    var listas = refs.map(function (R) {
      var p = R.tem.length / (R.cs.length || 1);
      return '<div class="pot-l"><div class="pot-lh"><a href="' + esc(R.r.f || '#') + '" target="_blank" rel="noopener noreferrer">' + esc(R.r.t) + '</a><b class="num">' + R.tem.length + ' de ' + R.cs.length + '</b></div>' +
        '<span class="meter"><i style="width:' + (p * 100).toFixed(1) + '%"></i></span><small class="dim num">' + pct(p) + ' você já tem, sem contar o comandante e os básicos</small></div>';
    }).join('');
    return '<article class="pot">' + cab + listas +
      '<div class="g3">' +
        caixa('Já tem (' + temU.length + ')', '<div class="chips">' + temU.sort().map(function (n) { var t = todas[n]; return '<span' + (t.em === refs.length && refs.length > 1 ? ' class="cons"' : '') + ' data-tip="' + esc(n + ': ' + lista(t.o.map(function (o) { return o.A.nome + ' ' + o.c.T + (o.c.cm ? ', comandante' : ''); }))) + '">' + esc(n) + '</span>'; }).join('') + '</div>') +
        caixa('Falta (' + faltaU.length + ')', '<div class="chips">' + faltaC.map(function (t) { return '<span' + (t.em === refs.length && refs.length > 1 ? ' class="cons"' : '') + ' data-tip="' + esc(t.x.n + (t.x.u != null ? ': ' + dol(t.x.u) : t.x.sem ? ': ainda sem dados do Scryfall no cache' : ': sem preço') + (t.em === refs.length && refs.length > 1 ? '; está em todas as listas' : '')) + '">' + esc(t.x.n) + (t.x.gc ? ' <small>GC</small>' : '') + '</span>'; }).join('') + '</div>' +
          nota('Destacadas: estão em todas as listas (' + cons.length + ' no total). Preço conhecido do que falta: ' + dol(precoF, 0) + (semPreco ? '; ' + pl(semPreco, 'carta ainda sem dados do Scryfall', 'cartas ainda sem dados do Scryfall') + ', conferidas no /novo-deck' : '') + '.')) +
        caixa('De onde viriam', barras(orig, Math.max.apply(null, orig.map(function (x) { return x.v; }).concat([1]))) + nota('Para cada carta que você já tem, o deck onde ela rende menos (o mais fácil de ceder). Montar este deck sem comprar segunda cópia mexe nesses decks.')) +
      '</div></article>';
  }).join('');
  var com = semP.filter(function (d) { return d.ref && d.ref.length; }).length;
  return secao('potencial', 'Decks em potencial', 'Os ' + semP.length + ' decks ainda sem painel. ' + (com ? pl(com, 'tem lista de referência', 'têm lista de referência') + ': o hub mede quanto você já tem.' : 'Nenhum tem lista de referência ainda.'), '<div class="pots">' + blocos + '</div>');
}

/* ============ resumo ============ */
function acoes(att) {
  var L = [];
  att.filter(function (x) { return x.sev === 3; }).slice(0, 1).forEach(function (x) { L.push({ tipo: 'Decidir', sec: x.sec, h: x.h }); });
  /* as duas melhores para agir já: entram no radar, valem ao menos US$ 3, maior salto de tier e depois a mais cara */
  var mv = MOV.mova.filter(function (m) { return m.c.v === 'entra' && m.u != null && m.u >= 3; }).sort(function (a, b) { return b.ganho - a.ganho || b.u - a.u; });
  mv.slice(0, 2).forEach(function (m) {
    L.push({ tipo: 'Mover', sec: 'movimentacoes', h: '<b>' + esc(m.k) + ': do ' + esc(m.de.A.nome) + ' para o ' + esc(m.para.nome) + '.</b> Lá é ' + m.de.c.T + ' (' + RELL[m.de.c.r] + '); no radar do ' + esc(m.para.nome) + ', ' + m.c.T + '. Mova, ou compre outra cópia' + (m.u != null ? ' (' + dol(m.u) + ')' : '') + '.' });
  });
  var gap = null;
  DK.forEach(function (d) {
    var A = d.a, id = A.ident.split(''); if (id.length < 2) return;
    var pt = soma(id, function (ch) { return A.st.pip[ch]; }) || 1, ft = soma(id, function (ch) { return A.st.src[ch]; }) || 1;
    id.forEach(function (ch) { var g = A.st.pip[ch] / pt - A.st.src[ch] / ft; if (!gap || g > gap.g) gap = { g: g, A: A, ch: ch, a: A.st.pip[ch] / pt, b: A.st.src[ch] / ft }; });
  });
  if (gap && gap.g >= 0.1) L.push({ tipo: 'Consertar', sec: 'mana', h: '<b>' + esc(gap.A.nome) + ': falta ' + NOMEC[gap.ch].toLowerCase() + ' na base.</b> É ' + pct(gap.a) + ' dos símbolos de mana e ' + pct(gap.b) + ' das fontes: o maior descompasso da carteira.' });
  var fund = [['agrupamento:draw', 'compra dedicada'], ['agrupamento:ramp', 'ramp dedicado'], ['terrenos', 'fontes de terreno']].map(function (g) {
    return { g: g, ds: DK.filter(function (d) { return d.a.le.some(function (x) { return x.k === g[0] && x.w; }); }) };
  }).sort(function (a, b) { return b.ds.length - a.ds.length; })[0];
  if (fund && fund.ds.length) L.push({ tipo: 'Padrão', sec: 'fundamentos', h: '<b>' + pl(fund.ds.length, 'deck tem', 'decks têm') + ' ' + fund.g[1] + ' abaixo do mínimo</b> (' + esc(lista(fund.ds.slice(0, 6).map(function (d) { return d.nome; }))) + (fund.ds.length > 6 ? ' e mais ' + (fund.ds.length - 6) : '') + '). É o buraco mais comum da carteira.' });
  var best = []; DK.forEach(function (d) { best = best.concat(d.a.tr.filter(function (t) { return t.d > 0 && t.u != null; })); });
  best.sort(function (a, b) { return b.d / Math.max(b.u, 0.01) - a.d / Math.max(a.u, 0.01); });
  if (best[0]) L.push({ tipo: 'Comprar', sec: 'trocas', h: '<b>' + esc(best[0].c.n) + ' no ' + esc(best[0].deck.nome) + '</b>' + (best[0].out ? ', no lugar de ' + esc(best[0].out.n) : '') + ': ' + sinal(best[0].d) + ' pontos de placar por ' + dol(best[0].u) + '. A troca que mais rende por dólar.' });
  var fora = DK.filter(function (d) { return d.a.alvo && d.a.alvo !== d.a.br.b; });
  fora.forEach(function (d) { L.push({ tipo: 'Decidir', sec: 'fichas', h: '<b>' + esc(d.nome) + ': bracket estimado ' + d.a.br.b + ', alvo ' + d.a.alvo + '.</b> ' + esc(brTxt(d.a.br)) + '.' }); });
  return L.slice(0, 5);
}
function saude() {
  return '<div class="sau">' + DK.map(function (d, i) {
    var A = d.a, al = nAlertas(A.le), cls = al === 0 ? 'ok' : al <= 2 ? 'warn' : 'bad';
    return '<a class="sd sd-' + cls + '" href="#f-' + i + '"><span class="sd-n">' + esc(d.nome) + '</span>' + cores(A.ident) +
      '<span class="sd-d">' + brBadge(A) + '<span class="num">' + dol(A.st.usd, 0) + '</span><span class="num sd-a" title="Leituras em alerta">' + (al ? al + ' !' : '✓') + '</span></span></a>';
  }).join('') + '</div>';
}
function secResumo(att) {
  var total = H.decks.length, comp = DK.length;
  var valor = soma(DK, function (d) { return d.a.st.usd; });
  var nTr = soma(DK, function (d) { return d.a.tr.length; }), custo = soma(DK, function (d) { return d.a.custo; }), semP = soma(DK, function (d) { return d.a.semPreco; });
  var al0 = soma(DK, function (d) { return nAlertas(d.a.le); }), al2 = soma(DK, function (d) { return nAlertas(d.a.le2); }), nLe = soma(DK, function (d) { return d.a.le.length; });
  var cego = null;
  ARQ.forEach(function (a) {
    var n = 0, bem = 0, mal = 0;
    DK.forEach(function (d) { var c = d.a.vs[a.k]; if (!c) return; n++; if (c.r === 'forte') bem++; if (c.r === 'fraco') mal++; });
    if (n && !bem && (!cego || mal > cego.mal)) cego = { a: a, mal: mal, n: n };
  });
  var kpi = function (rot, val, sub, extra, sec) { return '<a class="kpi" href="#d-' + sec + '"><span class="kpi-l">' + rot + '</span><b class="kpi-v">' + val + '</b>' + (extra || '') + '<span class="kpi-s">' + sub + '</span></a>'; };
  var h = '<div class="kpis">' +
    kpi('Decks com painel', comp + ' <small>de ' + total + '</small>', pct(comp / total) + ' da carteira analisada', '<span class="meter" aria-hidden="true"><i style="width:' + (comp / total * 100).toFixed(1) + '%"></i></span>', 'fichas') +
    kpi('Valor dos ' + comp + ' decks', dol(valor, 0), 'pelo Scryfall, carta a carta', '', 'valor') +
    kpi('Trocas recomendadas', String(nTr), dol(custo, 0) + ' para fazer todas' + (semP ? ', ' + pl(semP, 'sem preço', 'sem preço') : ''), '', 'trocas') +
    kpi('Você já tem', String(MOV.n), 'cartas que os radares pedem; até ' + dol(MOV.eco, 0) + ' em compras', '', 'movimentacoes') +
    kpi('Leituras em alerta', al0 + ' <small>de ' + nLe + '</small>', 'caem para ' + al2 + ' com as trocas', '', 'fundamentos') +
    (cego ? kpi('Ponto cego', esc(cego.a.n), 'nenhum deck vai bem; ' + cego.mal + ' de ' + cego.n + ' vão mal', '', 'mesa') : '') +
    '</div>';
  var tipoC = { Decidir: 'bad', Mover: 'ok', Consertar: 'warn', 'Padrão': 'warn', Comprar: 'info' };
  var ac = acoes(att);
  h += '<div class="g2 resumo-g"><div class="cx"><h3>Faça agora</h3><ol class="acoes">' + ac.map(function (x) {
      return '<li>' + pill(tipoC[x.tipo] || 'info', x.tipo) + '<p>' + x.h + '</p>' + ir(x.sec) + '</li>';
    }).join('') + '</ol>' +
    '<details class="todos"><summary>Todos os ' + att.length + ' avisos, por gravidade</summary><ul class="att">' + att.map(function (x) {
      var sevN = { 3: 'Alta', 2: 'Média', 1: 'Nota' }, sevC = { 3: 'bad', 2: 'warn', 1: 'info' };
      return '<li>' + pill(sevC[x.sev], sevN[x.sev], ico(x.sev)) + '<p>' + x.h + '</p>' + ir(x.sec) + '</li>';
    }).join('') + '</ul></details>' +
    nota('As cinco que mais mudam a carteira hoje: uma decisão de mesa, as duas melhores movimentações, o maior descompasso de cor, o buraco mais comum e a troca que mais rende por dólar. Tudo sai do último build.') + '</div>' +
    '<div class="cx"><h3>A carteira num relance</h3>' + saude() +
      '<p class="legenda"><span><i class="lg-ok"></i>sem alerta</span><span><i class="lg-warn"></i>1 ou 2 alertas</span><span><i class="lg-bad"></i>3 ou mais</span><span>B: bracket estimado</span></p>' +
      nota('Clique num deck para abrir a ficha dele. O placar fica de fora de propósito: ele compara o deck com ele mesmo, não com os outros.') + '</div></div>' +
    caixa('Rotina de conferência', '<dl class="rot">' +
    '<div><dt>Antes de jogar</dt><dd>' + ir('mesa', 'Mesa') + ', pela mesa que vai sentar, e o bracket na ' + ir('fichas', 'ficha') + '.</dd></div>' +
    '<div><dt>Antes de comprar</dt><dd>' + ir('movimentacoes', 'Movimentações') + ': a carta pode já estar num deck onde rende menos.</dd></div>' +
    '<div><dt>Depois de mexer num deck</dt><dd>' + ir('fichas', 'Fichas') + ', ' + ir('fundamentos', 'Fundamentos') + ' e ' + ir('trocas', 'Trocas') + '.</dd></div>' +
    '<div><dt>Uma vez por mês</dt><dd>' + ir('valor', 'Valor') + ' e ' + ir('auditoria', 'Bastidores') + '. Monte o hub com internet para renovar preços e Game Changers.</dd></div>' +
    '<div><dt>Deck novo</dt><dd>' + ir('potencial', 'Decks em potencial') + ' e o álbum de cores em ' + ir('carteira', 'Carteira') + '.</dd></div>' +
    '</dl>', 'larga');
  return secao('resumo', 'A carteira hoje', 'Os ' + comp + ' decks com painel, cruzados. Comece pelo "Faça agora"; o resto está nas abas.', h);
}

/* ============ montagem do dashboard ============ */
var DTABS = [['resumo', 'Resumo', ['resumo']], ['fichas', 'Fichas', ['fichas', 'comparar']], ['mov', 'Movimentações', ['movimentacoes', 'compartilhadas']],
             ['mesa', 'Mesa', ['mesa']], ['trocas', 'Trocas e valor', ['trocas', 'placar', 'valor']], ['mana', 'Fundamentos e mana', ['fundamentos', 'mana']],
             ['potencial', 'Decks em potencial', ['potencial']], ['bastidores', 'Bastidores', ['auditoria', 'carteira']]];
var SEC_HTML = { fichas: secFichas, comparar: secComparar, movimentacoes: secMov, compartilhadas: secComp, mesa: secMesa, trocas: secTrocas, placar: secPlacar,
                 valor: secValor, fundamentos: secFund, mana: secMana, potencial: secPotencial, auditoria: secAudit, carteira: secCarteira };
function abaDe(sec) { for (var i = 0; i < DTABS.length; i++) if (DTABS[i][2].indexOf(sec) >= 0) return DTABS[i]; return null; }
function vistaDash() {
  if (!DK.length) return '<p class="intro">Nenhum deck com painel ainda. O Dashboard cruza os decks assim que o primeiro painel existir.</p>' + secCarteira();
  var att = atencao();
  return '<nav class="dnav" aria-label="Abas do Dashboard">' + DTABS.map(function (t) { return '<a href="#d-' + t[2][0] + '" data-dtab="' + t[0] + '">' + t[1] + '</a>'; }).join('') + '</nav>' +
    DTABS.map(function (t, i) {
      return '<div class="dtab" data-dtab="' + t[0] + '"' + (i ? ' hidden' : '') + '>' + t[2].map(function (s) { return s === 'resumo' ? secResumo(att) : SEC_HTML[s](); }).join('') + '</div>';
    }).join('');
}
function mostrarAba(t) {
  document.querySelectorAll('#v-dash .dtab').forEach(function (el) { el.hidden = el.dataset.dtab !== t[0]; });
  document.querySelectorAll('#v-dash .dnav a').forEach(function (a) { if (a.dataset.dtab === t[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
}
/* redesenha só a parte que mudou: as capas embutidas pesam, e o resto da página não precisa voltar */
function seletor(ds) { return '[data-act="' + ds.act + '"]' + (ds.k ? '[data-k="' + ds.k + '"]' : '') + (ds.v ? '[data-v="' + ds.v + '"]' : ''); }
/* Cada seção sabe se redesenhar. O botão "Ver todas" redesenha a seção onde está, seja qual for a lista:
   antes havia um mapa por lista, e as listas que ficaram fora dele (pesa, baixa, caras) não abriam. */
var SEC_FN = { resumo: function () { return secResumo(atencao()); } }; Object.keys(SEC_HTML).forEach(function (k) { SEC_FN[k] = SEC_HTML[k]; });
function redesenharSecao(k, sec) {
  var f = SEC_FN[sec]; if (!f) return;
  var el = document.getElementById('d-' + sec); if (!el) return;
  var tmp = document.createElement('div'); tmp.innerHTML = f();
  el.parentNode.replaceChild(tmp.firstChild, el);
  if (!k) return;
  var bt = document.querySelector(k.charAt(0) === '[' ? '#d-' + sec + ' ' + k : '#d-' + sec + ' [data-act="mais"][data-k="' + k + '"]'); if (bt) bt.focus();
}
function redesenharMesa() {
  var box = $('#mesa'); if (!box) return;
  var ds = document.activeElement && document.activeElement.dataset && document.activeElement.dataset.act ? { act: document.activeElement.dataset.act, k: document.activeElement.dataset.k, v: document.activeElement.dataset.v } : null;
  box.innerHTML = boxMesa();
  var el = ds ? box.querySelector(seletor(ds)) : null;
  if (el && !el.disabled) el.focus(); else { var alt = box.querySelector('button:not([disabled])'); if (alt && ds) alt.focus(); }
}
function redesenharSim(sel) {
  var box = $('#sim'); if (!box) return;
  var foco = document.activeElement, act = foco && foco.dataset ? foco.dataset.act : null, k = foco && foco.dataset ? foco.dataset.k : null;
  box.innerHTML = boxSim();
  var el = sel ? box.querySelector('[data-sim="' + sel + '"]') : (act ? box.querySelector('[data-act="' + act + '"]' + (k ? '[data-k="' + k + '"]' : '')) : null);
  if (el) el.focus();
}

/* ============ dica flutuante ============ */
var tip = document.createElement('div');
tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true;
document.body.appendChild(tip);
function mostrarDica(el, x, y) {
  var t = el.getAttribute('data-tip'); if (!t) return;
  tip.textContent = t; tip.hidden = false;
  var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  var px = x != null ? x : r.left + r.width / 2, py = y != null ? y : r.top;
  var left = Math.max(8, Math.min(window.innerWidth - w - 8, px - w / 2)), top = py - h - 12;
  if (top < 72) top = (y != null ? y : r.bottom) + 16;
  tip.style.left = left + 'px'; tip.style.top = top + 'px';
}
function esconderDica() { tip.hidden = true; }
document.addEventListener('pointerover', function (ev) { var el = ev.target.closest && ev.target.closest('[data-tip]'); if (el) mostrarDica(el, ev.clientX, ev.clientY); });
document.addEventListener('pointermove', function (ev) { var el = ev.target.closest && ev.target.closest('[data-tip]'); if (el) mostrarDica(el, ev.clientX, ev.clientY); else esconderDica(); });
document.addEventListener('pointerout', function (ev) { if (!ev.relatedTarget || !ev.relatedTarget.closest || !ev.relatedTarget.closest('[data-tip]')) esconderDica(); });
document.addEventListener('focusin', function (ev) { var el = ev.target.closest && ev.target.closest('[data-tip]'); if (el) mostrarDica(el); else esconderDica(); });
document.addEventListener('focusout', esconderDica);
window.addEventListener('scroll', esconderDica, { passive: true });
document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') esconderDica(); });

/* ============ navegação ============ */
/* Cada aba tem endereço próprio (#decks, #pastas, #dashboard; as seções do Dashboard, #d-…). Atualizar a página,
   ou voltar e avançar no navegador, abre a aba que o endereço diz. */
var ROTA = { decks: '#decks', pastas: '#pastas', dash: '#dashboard' };
function vista(k) {
  document.querySelectorAll('[role=tab][data-vista]').forEach(function (b) { var on = b.dataset.vista === k; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  document.querySelectorAll('.vista').forEach(function (v) { v.hidden = v.id !== 'v-' + k; });
  esconderDica();
}
function irPara(k) {
  /* troca na hora; o endereço vem em seguida, e o hashchange que ele dispara só repete a mesma vista */
  vista(k); window.scrollTo(0, 0);
  if (location.hash !== ROTA[k]) location.hash = ROTA[k];
}
function rota(inicio) {
  var h = location.hash, m = /^#d-(.+)$/.exec(h), f = /^#f-\d+$/.test(h);
  if (m || f) {
    var sec = f ? 'fichas' : m[1], t = abaDe(sec), el = document.getElementById(h.slice(1));
    /* a ficha pedida pode estar escondida pelo filtro de grupo: limpa o filtro e redesenha */
    if (f && !el && ficha.g) { ficha.g = ''; redesenharSecao(null, 'fichas'); el = document.getElementById(h.slice(1)); }
    if (t && el) {
      vista('dash'); mostrarAba(t);
      setTimeout(function () { if (!f && t[2][0] === sec) window.scrollTo(0, 0); else el.scrollIntoView(); }, 0);
      return;
    }
  }
  if (h === '#dashboard') { vista('dash'); mostrarAba(DTABS[0]); if (!inicio) window.scrollTo(0, 0); return; }
  vista(h === '#pastas' ? 'pastas' : 'decks');
  if (!inicio) window.scrollTo(0, 0);
}
function filtrar() {
  var q = semAcento($('#q').value.trim());
  if (q && $('#v-decks').hidden) irPara('decks');
  document.querySelectorAll('.deck').forEach(function (el) { el.hidden = !!q && el.dataset.busca.indexOf(q) < 0; });
  document.querySelectorAll('.grupo').forEach(function (g) { g.hidden = !!q && !g.querySelectorAll('.deck:not([hidden])').length; });
}

$('#v-decks').innerHTML = vistaDecks();
$('#v-pastas').innerHTML = vistaPastas();
$('#v-dash').innerHTML = vistaDash();
$('#foot').innerHTML = '<p>O hub mostra a foto do último build, de ' + esc(H.gerado) + '. O que você edita dentro de um painel fica naquele painel até voltar para o projeto com o <code>/importar-backup</code>, pela aba Oficina.</p>' +
  '<p>Arte das cartas e dos comandantes: © Wizards of the Coast.</p>';
$('#q').addEventListener('input', filtrar);
rota(true);
window.addEventListener('hashchange', function () { rota(false); });
document.addEventListener('click', function (ev) { var a = ev.target.closest && ev.target.closest('a[href^="#d-"], a[href^="#f-"]'); if (a && $('#v-dash').hidden) vista('dash'); });
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[role=tab][data-vista]'); if (t) { irPara(t.dataset.vista); return; }
  var a = ev.target.closest('#v-dash [data-act]'); if (!a) return;
  var act = a.dataset.act, k = a.dataset.k;
  if (act === 'mesa') { var v = (mesa[k] || 0) + (+a.dataset.v); mesa[k] = Math.max(0, Math.min(3, v)); redesenharMesa(); }
  else if (act === 'mesa-limpar') { mesa = {}; redesenharMesa(); }
  else if (act === 'mais') { var sc = a.closest('.dsec'); abertos[k] = !abertos[k]; if (sc) redesenharSecao(k, sc.id.slice(2)); }
  else if (act === 'sim-deck') { sim.p = k; sim.sel = simCenario(simDeck().a, 'rec'); redesenharSim(); }
  else if (act === 'sim-cen') { sim.sel = simCenario(simDeck().a, k); redesenharSim(); }
  else if (act === 'ficha-ord') { ficha.ord = k; redesenharSecao('[data-act="ficha-ord"][data-k="' + k + '"]', 'fichas'); }
  else if (act === 'ficha-g') { ficha.g = k; redesenharSecao('[data-act="ficha-g"][data-k="' + k + '"]', 'fichas'); }
  else if (act === 'cmp-par') { cmp.a = k; cmp.b = a.dataset.v; redesenharSecao('[data-cmp="a"]', 'comparar'); var c0 = document.getElementById('d-comparar'); if (c0) c0.scrollIntoView(); }
  else if (act === 'cmp-com') {
    /* compara com o deck mais parecido com ele */
    var par = PARES.filter(function (p) { return p.a.pasta === k || p.b.pasta === k; })[0];
    cmp.a = k; if (par) cmp.b = par.a.pasta === k ? par.b.pasta : par.a.pasta;
    location.hash = '#d-comparar'; redesenharSecao('[data-cmp="b"]', 'comparar');
  }
  else if (act === 'mov-so') { movF.so = k; redesenharSecao('[data-act="mov-so"][data-k="' + k + '"]', 'movimentacoes'); }
});
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (t.matches && t.matches('select[data-cmp]')) { cmp[t.dataset.cmp] = t.value; redesenharSecao('[data-cmp="' + t.dataset.cmp + '"]', 'comparar'); }
  else if (t.matches && t.matches('select[data-mov]')) { movF.deck = t.value; redesenharSecao('[data-mov="deck"]', 'movimentacoes'); }
});
document.addEventListener('change', function (ev) {
  var c = ev.target.closest('#v-dash [data-sim]'); if (!c) return;
  if (c.checked) sim.sel[c.dataset.sim] = 1; else delete sim.sel[c.dataset.sim];
  redesenharSim(c.dataset.sim);
});
document.addEventListener('keydown', function (ev) {
  var t = ev.target; if (!t.matches || !t.matches('[role=tab][data-vista]') || (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft')) return;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role=tab][data-vista]')), i = tabs.indexOf(t);
  var n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; irPara(n.dataset.vista); n.focus();
});
/* para os testes e para conferência: as contas do Dashboard, deck a deck */
window.HUB_DASH = { decks: DK.map(function (d) { var A = d.a; return { pasta: d.pasta, placar: A.st.total, placar_trocas: A.st2.total, alertas: nAlertas(A.le), alertas_trocas: nAlertas(A.le2), valor: Math.round(A.st.usd * 100) / 100, fontes: A.mana.src, karsten: Math.round(A.kar.sug * 10) / 10,
  cmc: Math.round(A.st.avg * 100) / 100, cmc_custo: Math.round(A.cv.st.avg * 100) / 100, baixa_custo: A.cv.boas.length,
  bracket: A.br.b, bracket_trocas: A.br2.b, game_changers: A.br.gc.slice().sort(), combos2: A.br.c2.map(function (k) { return k.n; }) }; }),
  mov: { mova: MOV.mova.length, ja: MOV.ja.length, pot: MOV.pot.length, cartas: MOV.n, eco: Math.round(MOV.eco * 100) / 100 } };
})();
