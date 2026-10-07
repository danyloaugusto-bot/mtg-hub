
/* ============ definições ============ */
var G = [
  { k: 'Ramp', ab: 'Ramp', d: 'Pedras de mana, mana extra e redutores de custo. Terreno que sempre entra virado vale −1, como na sua planilha.', ref: [10, 12] },
  { k: 'Draw', ab: 'Draw', d: 'Compra e vantagem de cartas.', ref: [10, 12] },
  { k: 'Removal', ab: 'Rem.', d: 'Remoção pontual e em massa: destruir, exilar, neutralizar.', ref: [8, 12] },
  { k: 'Proteção', ab: 'Prot.', d: 'Indestrutível, resistência a magia, sair de fase e proteção contra cores ou tipos.', ref: null },
  { k: 'Buff', ab: 'Buff', d: 'Lordes, marcadores +1/+1 e habilidades de combate para o time.', ref: null },
  { k: 'Token', ab: 'Tok.', d: 'Geradores e multiplicadores de fichas.', ref: null },
  { k: 'Sinergia', ab: 'Sin.', d: 'Ligação direta com a Giada e com a tribo: ser Anjo, citar Anjos ou alimentar o motor de vida. Marcar a carta como PetCard soma 1 ponto.', ref: null },
  { k: 'Especial', ab: 'Esp.', d: 'Tax, condições de vitória e recorrência.', ref: null }
];
var TIERS = [
  { k: 'S', d: 'Define o deck' }, { k: 'A', d: 'Titular' }, { k: 'B', d: 'Cumpre o papel' },
  { k: 'C', d: 'Substituível' }, { k: 'D', d: 'Fora de lugar' }
];
var RELS = [
  { k: 'INS', l: 'INS', n: 'Intocáveis', d: 'Nunca saem. Sem elas o deck é outro.' },
  { k: 'ALT', l: 'ALT', n: 'Alta sinergia', d: 'Só saem por algo claramente melhor.' },
  { k: 'MED', l: 'MÉD', n: 'Flex', d: 'Cumprem o papel e podem ser trocadas.' },
  { k: 'BAX', l: 'BAX', n: 'Na berlinda', d: 'Primeiras a sair quando algo novo aparecer.' }
];
var TYPES = [
  { k: 'cri', n: 'Criaturas', o: 'Criatura', c: '#ecc66e' }, { k: 'ins', n: 'Mágicas instantâneas', o: 'Mágica instantânea', c: '#76aaf6' },
  { k: 'fei', n: 'Feitiços', o: 'Feitiço', c: '#ac8cee' }, { k: 'art', n: 'Artefatos', o: 'Artefato', c: '#b9c2d8' },
  { k: 'enc', n: 'Encantamentos', o: 'Encantamento', c: '#54c4aa' }, { k: 'pw', n: 'Planeswalkers', o: 'Planeswalker', c: '#f6965a' },
  { k: 'bat', n: 'Batalhas', o: 'Batalha', c: '#f096c0' }, { k: 'ter', n: 'Terrenos', o: 'Terreno', c: '#a98a5c' }
];
var TG = [
  { k: 'cmd', n: 'Comandante' }, { k: 'cri', n: 'Criaturas' }, { k: 'pw', n: 'Planeswalkers' }, { k: 'bat', n: 'Batalhas' },
  { k: 'mag', n: 'Mágicas' }, { k: 'art', n: 'Artefatos' }, { k: 'enc', n: 'Encantamentos' }, { k: 'ter', n: 'Terrenos' }
];
var GROUP_OF = { cri: 'cri', pw: 'pw', bat: 'bat', ins: 'mag', fei: 'mag', art: 'art', enc: 'enc', ter: 'ter' };
var ANG = [
  { k: 'anj', n: 'Anjos', c: '#f6e3ae' }, { k: 'cri', n: 'Outras criaturas', c: '#f6965a' }, { k: 'nao', n: 'Demais cartas', c: '#76aaf6' }
];
var VERD = { entra: 'Entra', avaliar: 'Avaliar', fora: 'Fica de fora' };
var TR = { S: 0, A: 1, B: 2, C: 3, D: 4 }, RR = { INS: 0, ALT: 1, MED: 2, BAX: 3 };

/* ============ estado ============ */
var KEY = 'coro-da-alvorada-v1';
var store = (function () {
  try { var s = window.localStorage, k = KEY + ':teste'; s.setItem(k, '1'); s.removeItem(k); return s; } catch (e) { return null; }
})();
var canStore = !!store;
var localFile = (function () { try { return location.protocol === 'file:'; } catch (e) { return false; } })();
function fresh() { return { v: 1, ov: {}, custom: [], inn: {}, out: {}, swaps: [], art: false }; }
function normalize(s) {
  var f = fresh();
  if (!s || typeof s !== 'object') return f;
  ['ov', 'inn', 'out'].forEach(function (k) { if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) f[k] = s[k]; });
  if (Array.isArray(s.custom)) f.custom = s.custom.filter(function (c) { return c && c.id && c.n && Array.isArray(c.s); });
  if (Array.isArray(s.swaps)) f.swaps = s.swaps;
  f.art = !!s.art;
  return f;
}
function loadState() {
  if (!canStore) return fresh();
  try { var r = store.getItem(KEY); return r ? normalize(JSON.parse(r)) : fresh(); } catch (e) { return fresh(); }
}
function save() {
  if (!canStore) return;
  try { store.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sem espaço ou bloqueado: segue em memória */ }
}
var S = loadState();
var ui = { tab: 'geral', curve: 'tipo', q: '', fg: -1, ft: '', fr: '', sort: { k: 'n', d: 1 }, grouped: true,
           tierType: '', tierLands: false, ctrlLands: false, drawer: null, modal: false, first: true, confirmReset: false };

/* ============ utilidades ============ */
function $(s, el) { return (el || document).querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
function fmt(n, d) { return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }); }
function pl(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
function msym(sym) {
  var cls = 'ms', lab = sym;
  if (sym === 'W' || sym === 'B' || sym === 'C' || sym === 'U' || sym === 'R' || sym === 'G') cls += ' ms-' + sym;
  else if (sym.indexOf('/') > 0) { cls += ' ms-H'; lab = ''; }
  return '<i class="' + cls + '">' + esc(lab) + '</i>';
}
function mana(cost) {
  if (!cost) return '';
  var syms = [];
  var h = cost.replace(/\{([^}]+)\}/g, function (m, s) { syms.push(s); return msym(s); });
  return '<span class="mana" role="img" aria-label="Custo ' + esc(syms.join(' ')) + '">' + h + '</span>';
}
function rich(t) { return esc(t).replace(/\{([^}]+)\}/g, function (m, s) { return '<span class="mana">' + msym(s) + '</span>'; }); }
function slug(s) { return String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function lista(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1]; }

/* ============ cartas ============ */
function cands() { return D.cands.concat(S.custom); }
function E(c) {
  var o = S.ov[c.id] || {};
  var e = {}; for (var k in c) e[k] = c[k];
  e.s = (o.s || c.s).slice(); e.tier = o.tier || c.tier; e.rel = o.rel || c.rel;
  e.pet = !!o.pet; e.val = (o.val == null ? null : o.val); e.q = c.q || 1;
  e.edited = !!(o.s || o.tier || o.rel);
  e.inDeck = c.cand ? !!S.inn[c.id] : !S.out[c.id];
  return e;
}
function byId(id) {
  var all = D.cards.concat(cands());
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return E(all[i]);
  return null;
}
function deck() { return D.cards.concat(cands()).map(E).filter(function (c) { return c.inDeck; }); }
function gv(c, i) { return c.s[i] + (i === 6 && c.pet ? 1 : 0); }
function pts(c) { var t = 0; for (var i = 0; i < 8; i++) t += gv(c, i); return t; }
function ov(id) { if (!S.ov[id]) S.ov[id] = {}; return S.ov[id]; }
function wpips(c) { var n = 0; (c.cost || '').replace(/\{([^}]+)\}/g, function (m, s) { if (s === 'W') n += 1; else if (s.indexOf('W') >= 0) n += 0.5; }); return n; }

function stats(cs) {
  var st = { n: 0, nonland: 0, cmcSum: 0, curve: [], types: {}, ak: {}, rel: {}, relVal: {}, relValN: {}, tier: {}, grp: [],
             lands: 0, mdfc: 0, tapped: 0, srcW: 0, srcC: 0, pipW: 0, wp: [0, 0, 0, 0], www: [], cri: 0, angel: 0, atok: 0,
             wipes: 0, uni: 0, spot: 0, spot1: 0, gain: 0, pay: 0, aonly: 0, atk: 0, alt: [], foils: 0, sets: {}, low: 0, top: 0 };
  var i;
  for (i = 0; i < 8; i++) { st.curve.push({ n: 0, t: {}, a: {} }); st.grp.push({ hard: 0, soft: 0, pts: 0 }); }
  cs.forEach(function (c) {
    var q = c.q;
    st.n += q;
    st.types[c.t] = (st.types[c.t] || 0) + q;
    st.rel[c.rel] = (st.rel[c.rel] || 0) + q;
    st.tier[c.tier] = (st.tier[c.tier] || 0) + q;
    if (c.val != null) { st.relVal[c.rel] = (st.relVal[c.rel] || 0) + c.val * q; st.relValN[c.rel] = (st.relValN[c.rel] || 0) + q; }
    if (c.foil) st.foils += q;
    if (c.set) st.sets[c.set] = (st.sets[c.set] || 0) + q;
    for (var j = 0; j < 8; j++) {
      var v = gv(c, j); st.grp[j].pts += v * q;
      if (v >= 2) st.grp[j].hard += q; else if (v === 1) st.grp[j].soft += q;
    }
    if (c.land) {
      st.lands += q; if (c.tapped) st.tapped += q;
      if (c.prod === 'W') st.srcW += q; else st.srcC += q;
    } else {
      st.nonland += q; st.cmcSum += c.cmc * q;
      var b = st.curve[Math.min(c.cmc, 7)], ak = c.angel ? 'anj' : (c.t === 'cri' ? 'cri' : 'nao');
      b.n += q; b.t[c.t] = (b.t[c.t] || 0) + q; b.a[ak] = (b.a[ak] || 0) + q;
      st.ak[ak] = (st.ak[ak] || 0) + q;
      if (c.cmc <= 2) st.low += q;
      if (c.cmc >= 5) st.top += q;
      if (c.mdfc) st.mdfc += q;
      var wn = wpips(c); st.pipW += wn * q;
      st.wp[Math.min(3, Math.ceil(wn))] += q;
      if (wn >= 3) st.www.push(c);
      if (c.alt) st.alt.push(c);
    }
    if (c.t === 'cri') { st.cri += q; if (c.angel) st.angel += q; }
    if (c.atok) st.atok += q;
    if (c.gain) st.gain += q;
    if (c.pay) st.pay += q;
    if (c.wipe) { st.wipes += q; if (c.uni) st.uni += q; }
    else if (gv(c, 2) >= 2) { st.spot += q; if (!c.land && c.cmc <= 1) st.spot1 += q; }
    if (gv(c, 0) >= 2 && c.aonly) st.aonly += q;
    if (gv(c, 1) >= 2 && c.atk) st.atk += q;
  });
  st.avg = st.nonland ? st.cmcSum / st.nonland : 0;
  var a = st.avg;
  st.cmcPts = a === 0 ? 0 : a < 2 ? 5 : a < 3 ? 4 : a < 4 ? 3 : a < 5 ? 2 : 1;
  st.accX = a ? st.grp[0].pts / a : 0;
  st.accPts = st.accX < 0 ? 0 : Math.min(90, 5 * (Math.floor(st.accX * 2) + 1));
  st.crit = st.grp.reduce(function (t, g) { return t + g.pts; }, 0);
  st.total = st.cmcPts + st.accPts + st.crit;
  return st;
}
function cutQueue(cs, lands) {
  return cs.filter(function (c) { return !c.cmd && !c.pet && (!!(c.land || c.mdfc) === !!lands); }).sort(function (a, b) {
    return (RR[b.rel] - RR[a.rel]) || (TR[b.tier] - TR[a.tier]) || (pts(a) - pts(b)) || a.n.localeCompare(b.n);
  });
}

/* ============ fichas ============ */
function chip(c, o) {
  o = o || {};
  return '<div class="chip c-' + esc(c.col) + '" role="button" tabindex="0" draggable="true" data-card="' + esc(c.id) + '" title="' + esc(c.n + ' — ' + c.line) + '">' +
    '<span class="nm">' + esc(c.n) + (c.q > 1 ? ' ×' + c.q : '') + '</span>' +
    (c.foil ? '<span class="foil" title="Foil">✦</span>' : '') +
    (c.pet ? '<span class="pet" title="PetCard">♥</span>' : '') +
    (c.edited ? '<span class="edt" title="Avaliação alterada por você"></span>' : '') +
    (o.mana && c.cost ? mana(c.cost) : '') +
    (o.tier ? '<span class="tb sm t' + c.tier + '">' + c.tier + '</span>' : '') +
    (o.pts ? '<span class="p">' + pts(c) + '</span>' : '') +
    '</div>';
}
function tierB(t, sm) { return '<span class="tb' + (sm ? ' sm' : '') + ' t' + t + '">' + t + '</span>'; }
function relB(r) { return '<span class="rb rb-' + r + '">' + RELS[RR[r]].l + '</span>'; }

/* ============ visão geral ============ */
var CX = 320, CY = 232, WA = [-60, -37, -14, 9];
function fAng(i) { return i < 4 ? WA[i] : 180 - WA[7 - i]; }
function fpt(a, u, v) {
  var t = a * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
  return (CX + u * c - v * s).toFixed(1) + ' ' + (CY + u * s + v * c).toFixed(1);
}
/* pena: folha alongada com a ponta caindo para fora, como numa asa aberta */
function feather(a, r0, r1, side) {
  var L = r1 - r0, hw = L * 0.15, b = Math.min(7, hw * 0.55), d = L * 0.13 * side;
  var up = hw * 0.85 * side, dn = hw * 1.25 * side;
  return 'M' + fpt(a, r0, -b * side) +
    'C' + fpt(a, r0 + L * 0.22, -up * 1.15) + ' ' + fpt(a, r1 - L * 0.4, -up * 0.9 + d * 0.25) + ' ' + fpt(a, r1, d) +
    'C' + fpt(a, r1 - L * 0.22, dn + d * 0.75) + ' ' + fpt(a, r0 + L * 0.25, dn * 1.05) + ' ' + fpt(a, r0, b * side) + 'Z';
}
function rachis(a, r0, r1, side) {
  var L = r1 - r0, d = L * 0.13 * side;
  return 'M' + fpt(a, r0 + 3, 0) + 'Q' + fpt(a, r0 + L * 0.6, d * 0.12) + ' ' + fpt(a, r1 - 7, d * 0.88);
}
function wings(st) {
  var r0 = 60, R = 238, max = 1, i;
  for (i = 0; i < 8; i++) max = Math.max(max, st.grp[i].pts);
  var o = '<svg viewBox="-24 -2 688 350" role="group" aria-label="Asas com os oito agrupamentos, uma pena para cada, e a pontuação total na auréola"><defs>';
  for (i = 0; i < 8; i++) {
    o += '<radialGradient id="pg' + i + '" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + R + '">' +
      '<stop offset=".22" style="stop-color:rgba(var(--g' + i + '),.5)"/><stop offset=".85" style="stop-color:rgb(var(--g' + i + '))"/></radialGradient>';
  }
  o += '<radialGradient id="brilho" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="' + R + '">' +
    '<stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></radialGradient>' +
    '<radialGradient id="halo" gradientUnits="userSpaceOnUse" cx="' + CX + '" cy="' + CY + '" r="150">' +
    '<stop offset="0" stop-color="#f6c878" stop-opacity=".42"/><stop offset=".5" stop-color="#f6c878" stop-opacity=".12"/><stop offset="1" stop-color="#f6c878" stop-opacity="0"/></radialGradient></defs>';
  o += '<circle cx="' + CX + '" cy="' + CY + '" r="150" fill="url(#halo)"/>';
  var order = [3, 2, 1, 0, 4, 5, 6, 7], labels = '';
  order.forEach(function (i) {
    var a = fAng(i), side = i < 4 ? 1 : -1, v = st.grp[i].pts;
    var fr = Math.max(0.2, Math.sqrt(Math.max(v, 0) / max)), r1 = r0 + (R - r0) * fr;
    o += '<g class="pena" style="--i:' + (i < 4 ? 3 - i : i - 4) + ';--r:' + (side * 26) + 'deg" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
      '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
      '<path class="ghost" d="' + feather(a, r0, R, side) + '" style="fill:rgba(var(--g' + i + '),.07)" stroke="rgba(226,190,112,.42)" stroke-width="1"/>' +
      '<path class="fill" d="' + feather(a, r0, r1, side) + '" fill="url(#pg' + i + ')" stroke="rgba(246,227,174,.92)" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<path d="' + feather(a, r0, r1, side) + '" fill="url(#brilho)" pointer-events="none"/>' +
      '<path d="' + rachis(a, r0, r1, side) + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1" stroke-linecap="round" pointer-events="none"/></g>';
    var t = a * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t), lr = R + 13, lv = (R - r0) * 0.13 * side * 1.12;
    var x = CX + lr * cs - lv * sn, y = CY + lr * sn + lv * cs + (sn < -0.5 ? -12 : -2);
    labels += '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + (i < 4 ? 'start' : 'end') + '">' + esc(G[i].sh || G[i].k) +
      '<tspan class="v" x="' + x.toFixed(1) + '" dy="1.16em">' + v + '</tspan></text>';
  });
  o += labels;
  o += '<circle cx="' + CX + '" cy="' + CY + '" r="52" fill="#0b112e" stroke="#e2be70" stroke-width="2"/>' +
    '<circle cx="' + CX + '" cy="' + CY + '" r="59" fill="none" stroke="#e2be70" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 9.17" opacity=".8"/>' +
    '<circle cx="' + CX + '" cy="' + CY + '" r="46" fill="none" stroke="rgba(226,190,112,.35)" stroke-width="1"/>' +
    '<text class="ctr-n" x="' + CX + '" y="' + (CY + 11) + '" text-anchor="middle">' + st.total + '</text>' +
    '<text class="ctr-l" x="' + CX + '" y="' + (CY + 29) + '" text-anchor="middle">pontos</text></svg>';
  return o;
}
function pipe(x, w, base, top) {
  var h = base - top, fh = Math.min(13, h * 0.3), ry = Math.min(5.5, h * 0.14), ins = w * 0.24;
  function f(n) { return n.toFixed(1); }
  return 'M' + f(x + ins) + ' ' + base + 'L' + f(x) + ' ' + f(base - fh) + 'V' + f(top) +
    'A' + f(w / 2) + ' ' + f(ry) + ' 0 0 1 ' + f(x + w) + ' ' + f(top) +
    'V' + f(base - fh) + 'L' + f(x + w - ins) + ' ' + base + 'Z';
}
function curveSvg(st, mode) {
  var W = 760, H = 336, ml = 12, mr = 12, mb = 56, mt = 56;
  var cw = (W - ml - mr) / 8, bw = cw * 0.54, base = H - mb, maxH = base - mt;
  var max = 1; st.curve.forEach(function (c) { max = Math.max(max, c.n); });
  var keys = mode === 'anjo' ? ANG : TYPES.filter(function (t) { return t.k !== 'ter'; });
  var defs = '', body = '';
  function f(n) { return n.toFixed(1); }
  st.curve.forEach(function (col, i) {
    var x = ml + i * cw + (cw - bw) / 2, cx = x + bw / 2, h = col.n / max * maxH, top = base - h, ry = Math.min(5.5, h * 0.14);
    if (col.n) {
      var path = pipe(x, bw, base, top), y = base, segs = '', lines = '';
      defs += '<clipPath id="tb' + i + '"><path d="' + path + '"/></clipPath>';
      keys.forEach(function (k) {
        var v = (mode === 'anjo' ? col.a : col.t)[k.k] || 0; if (!v) return;
        var sh = v / max * maxH;
        if (y !== base) lines += '<line x1="' + f(x) + '" x2="' + f(x + bw) + '" y1="' + f(y) + '" y2="' + f(y) + '" stroke="#0a1029" stroke-width="2"/>';
        y -= sh;
        segs += '<rect x="' + f(x) + '" y="' + f(y - 8) + '" width="' + f(bw) + '" height="' + f(sh + 8.6) + '" fill="' + k.c + '"><title>Custo ' + (i === 7 ? '7 ou mais' : i) + ', ' + esc(k.n) + ': ' + v + '</title></rect>';
      });
      var fh = Math.min(13, h * 0.3), my = base - fh - 5, mw = bw * 0.27;
      var mouth = h >= 46 ? '<path d="M' + f(cx - mw) + ' ' + f(my) + 'Q' + f(cx - mw * 0.2) + ' ' + f(my - 5) + ' ' + f(cx) + ' ' + f(my - 19) + 'Q' + f(cx + mw * 0.2) + ' ' + f(my - 5) + ' ' + f(cx + mw) + ' ' + f(my) + 'Z" fill="rgba(8,12,36,.52)"/>' +
        '<line x1="' + f(cx - mw - 3) + '" x2="' + f(cx + mw + 3) + '" y1="' + f(my) + '" y2="' + f(my) + '" stroke="rgba(8,12,36,.82)" stroke-width="2.2" stroke-linecap="round"/>' : '';
      body += '<g class="tubo" style="--i:' + i + '"><g clip-path="url(#tb' + i + ')">' + segs + lines +
        '<rect x="' + f(x + bw * 0.12) + '" y="' + f(top - 8) + '" width="' + f(bw * 0.2) + '" height="' + f(h + 8) + '" fill="rgba(255,255,255,.22)"/>' +
        '<rect x="' + f(x + bw * 0.74) + '" y="' + f(top - 8) + '" width="' + f(bw * 0.26) + '" height="' + f(h + 8) + '" fill="rgba(6,10,32,.2)"/>' + mouth + '</g>' +
        '<path d="' + path + '" fill="none" stroke="#e2be70" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<ellipse cx="' + f(cx) + '" cy="' + f(top) + '" rx="' + f(bw / 2 - 0.4) + '" ry="' + f(ry) + '" fill="rgba(8,12,36,.62)" stroke="#e2be70" stroke-width="1.3"/></g>';
    } else {
      body += '<path d="' + pipe(x, bw, base, base - 14) + '" fill="none" stroke="rgba(226,190,112,.34)" stroke-dasharray="3 4"/>';
      top = base - 14; ry = 2;
    }
    body += '<text class="n" x="' + f(cx) + '" y="' + f(top - ry - 9) + '" text-anchor="middle">' + col.n + '</text>' +
      '<text x="' + f(cx) + '" y="' + (base + 23) + '" text-anchor="middle">' + (i === 7 ? '7+' : i) + '</text>';
  });
  var ax = ml + cw / 2 + Math.min(st.avg, 7) * cw;
  body = '<line x1="' + f(ax) + '" x2="' + f(ax) + '" y1="24" y2="' + (base + 6) + '" stroke="#f6e3ae" stroke-width="1.4" stroke-dasharray="2 5"/>' + body +
    '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + base + '" y2="' + base + '" stroke="rgba(226,190,112,.5)"/>' +
    '<text class="avg" x="' + f(ax + 7) + '" y="20">CMC médio ' + fmt(st.avg) + '</text>' +
    '<text x="' + (W / 2) + '" y="' + (H - 6) + '" text-anchor="middle">Custo de mana convertido, sem contar terrenos</text>';
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Curva de mana: ' +
    st.curve.map(function (c, i) { return pl(c.n, 'carta', 'cartas') + ' de custo ' + (i === 7 ? '7 ou mais' : i); }).join(', ') + '"><defs>' + defs + '</defs>' + body + '</svg>';
}

function peak(st) { var m = 0, k = 0; st.curve.forEach(function (c, i) { if (c.n > m) { m = c.n; k = i; } }); return (k === 7 ? '7 ou mais' : k) + ' manas'; }
function readings(st) {
  var r = [], src = st.lands + st.mdfc, g = st.grp, rk = g[0].hard, dr = g[1].hard, rm = g[2].hard, pr = g[3].hard;
  function add(cls, b, t) { r.push('<li class="' + cls + '"><i class="st"></i><div><b>' + b + '</b> <span>' + t + '</span></div></li>'); }

  var justo = src < 36 && st.avg >= 3.5;
  add(src < 35 || justo ? 'warn' : 'ok', pl(src, 'fonte de terreno', 'fontes de terreno') + '.',
    st.lands + ' terrenos' + (st.mdfc ? ' e ' + pl(st.mdfc, 'carta dupla com terreno no verso', 'cartas duplas com terreno no verso') : '') +
    '. A referência usual é de 35 a 37' + (justo ? ': com CMC médio de ' + fmt(st.avg) + ', está no piso.' : '.') +
    (st.tapped ? ' ' + pl(st.tapped, 'terreno entra sempre virado', 'terrenos entram sempre virados') + '.' : ''));

  var cedo = st.www.filter(function (c) { return c.cmc <= 4; }).map(function (c) { return esc(c.n); });
  add(st.srcC >= 9 ? 'warn' : 'ok', st.srcW + ' de ' + st.lands + ' terrenos geram branco.',
    (st.srcC ? 'Os outros ' + st.srcC + ' só geram incolor' : 'Nenhum terreno é só incolor') +
    (st.www.length ? ', e ' + pl(st.www.length, 'carta pede', 'cartas pedem') + ' ' + mana('{W}{W}{W}') : '') + '.' +
    (st.srcC >= 9 ? ' É o ponto mais frágil da base: cada utilitário incolor atrasa ' + (cedo.length ? lista(cedo.slice(0, 2)) : 'as cartas de três brancas') + '.' : ''));

  add(rk < 10 ? 'warn' : 'ok', pl(rk, 'carta de ramp dedicada', 'cartas de ramp dedicadas') + '.',
    'Referência: 10 a 12.' +
    (st.aonly ? ' ' + st.aonly + ' delas só valem para Anjos' + (st.top >= 16 ? ', e o topo da curva é pesado: vale mirar o teto da faixa com mana que sirva a qualquer mágica.' : '.') : '') +
    (rk < 10 ? ' Uma ou duas pedras de mana a mais ajudariam.' : ''));

  var meio = dr > 0 && st.atk * 2.5 >= dr;
  add(dr < 10 || meio ? 'warn' : 'ok', pl(dr, 'fonte de compra dedicada', 'fontes de compra dedicadas') + '.',
    'Referência: 10 a 12.' +
    (st.atk ? ' ' + st.atk + ' delas só compram quando você ataca' + (meio ? ': depois de uma remoção em massa, a mão demora a encher de novo.' : '.') : ''));

  add(st.spot < 4 || st.wipes > 5 ? 'warn' : 'ok', pl(rm, 'remoção', 'remoções') + ', sendo ' + st.wipes + ' em massa.',
    'Referência: 8 a 12, com 3 a 5 globais.' +
    (st.spot < 4 ? ' Só ' + st.spot + (st.spot === 1 ? ' é pontual' : ' são pontuais') + (st.spot1 ? '.' : ', e nenhuma custa 1 mana.') : '') +
    (st.wipes && st.uni < 2 ? (st.uni ? ' Das globais, só ' + st.uni + ' poupa' : ' Das globais, nenhuma poupa') + ' o seu lado sem ajuda de outra carta.' : ''));

  var sobra = pr > rk && pr > dr;
  add(sobra && pr >= 12 ? 'warn' : 'ok', pl(pr, 'peça de proteção', 'peças de proteção') + '.',
    sobra ? 'Mais vagas que o ramp (' + rk + ') e que a compra (' + dr + ')' + (pr >= 12 ? '. Dá para ceder uma ou duas sem expor a mesa.' : '.') : 'Volume coerente para um deck que vive da própria mesa.');

  var farto = st.gain >= st.pay * 1.5;
  add((st.cri && st.angel / st.cri < 0.75) || !farto ? 'warn' : 'ok', st.angel + ' de ' + st.cri + ' criaturas são Anjos.',
    'Densidade tribal de ' + fmt(st.cri ? st.angel / st.cri * 100 : 0, 0) + '%' + (st.atok ? ', e mais ' + pl(st.atok, 'carta cria', 'cartas criam') + ' fichas de Anjo' : '') + '. ' +
    pl(st.gain, 'fonte de ganho de vida alimenta', 'fontes de ganho de vida alimentam') + ' ' + pl(st.pay, 'carta que paga por isso', 'cartas que pagam por isso') +
    (farto ? ': o motor raramente fica sem combustível.' : ': é pouco, e vínculo com a vida no time resolve.'));

  var pesado = st.avg >= 3.6 && st.top >= 16, caras = st.alt.slice().sort(function (x, y) { return y.cmc - x.cmc; }).slice(0, 2).map(function (c) { return esc(c.n); });
  add(pesado ? 'warn' : 'ok', fmt(st.nonland ? st.low / st.nonland * 100 : 0, 0) + '% das cartas que não são terreno custam 2 ou menos.',
    'CMC médio de ' + fmt(st.avg) + ', pico em ' + peak(st) + ' e ' + pl(st.top, 'carta', 'cartas') + ' de 5 ou mais' +
    (pesado ? ': sem a Giada ou um redutor em campo, a mão trava.' : '.') +
    (st.alt.length ? ' A média engana um pouco para cima: ' + pl(st.alt.length, 'carta quase nunca custa', 'cartas quase nunca custam') + ' o impresso, como ' + lista(caras) + '.' : ''));
  return r.join('');
}

function renderGeral() {
  var cs = deck(), st = stats(cs), i;
  var maxG = 1;
  G.forEach(function (g, i) { maxG = Math.max(maxG, st.grp[i].hard + st.grp[i].soft, g.ref ? g.ref[1] : 0); });
  maxG += 1;
  var groups = G.map(function (g, i) {
    var s = st.grp[i];
    return '<button class="gr" style="--c:var(--g' + i + ')" data-act="filter-group" data-g="' + i + '" data-fid="gr' + i + '" title="' + esc(g.d) + '">' +
      '<span class="gr-n"><i class="dot"></i>' + esc(g.k) + '</span>' +
      '<span class="gr-t">' + (g.ref ? '<span class="gr-ref" style="left:' + (g.ref[0] / maxG * 100).toFixed(1) + '%;width:' + ((g.ref[1] - g.ref[0]) / maxG * 100).toFixed(1) + '%"></span>' : '') +
      '<span class="gr-b" style="width:' + ((s.hard + s.soft) / maxG * 100).toFixed(1) + '%"><i class="hard" style="flex:' + s.hard + '"></i><i class="soft" style="flex:' + s.soft + '"></i></span></span>' +
      '<span class="gr-v"><b class="num">' + s.hard + '</b> +' + s.soft + '</span><span class="gr-p num">' + s.pts + ' pts</span>' +
      '<span class="gr-d">' + esc(g.d) + '</span></button>';
  }).join('');

  var types = TYPES.filter(function (t) { return st.types[t.k]; }).sort(function (a, b) { return st.types[b.k] - st.types[a.k]; });
  var maxT = types.length ? st.types[types[0].k] : 1;
  var typeBars = types.map(function (t) {
    return '<div class="bar"><span>' + t.n + '</span><span class="bar-t"><i style="width:' + (st.types[t.k] / maxT * 100).toFixed(1) + '%;--c:' + t.c + '"></i></span><b class="num">' + st.types[t.k] + '</b></div>';
  }).join('');

  var landT = st.srcW + st.srcC || 1;
  var landStack = (st.srcW ? '<i style="flex:' + st.srcW + ';background:#f8eec8" title="Geram branco: ' + st.srcW + '"></i>' : '') +
    (st.srcC ? '<i style="flex:' + st.srcC + ';background:#9aa6c4" title="Só incolor: ' + st.srcC + '"></i>' : '');
  var landLegend = '<span><i style="background:#f8eec8"></i>Geram branco ' + st.srcW + ', ' + fmt(st.srcW / landT * 100, 0) + '%</span>' +
    '<span><i style="background:#9aa6c4"></i>Só incolor ' + st.srcC + ', ' + fmt(st.srcC / landT * 100, 0) + '%</span>';
  var wl = [['{W}{W}{W}', st.wp[3]], ['{W}{W}', st.wp[2]], ['{W}', st.wp[1]], ['', st.wp[0]]], maxW = Math.max(1, st.wp[0], st.wp[1], st.wp[2], st.wp[3]);
  var pipBars = wl.map(function (w) {
    return '<div class="bar"><span>' + (w[0] ? mana(w[0]) + (w[0] === '{W}{W}{W}' ? ' ou mais' : '') : 'Sem branco') + '</span><span class="bar-t"><i style="width:' + (w[1] / maxW * 100).toFixed(1) + '%;--c:' + (w[0] ? '#f8eec8' : '#9aa6c4') + '"></i></span><b class="num">' + w[1] + '</b></div>';
  }).join('');

  var anyVal = RELS.some(function (r) { return st.relValN[r.k]; });
  var relRows = RELS.map(function (r) {
    var n = st.rel[r.k] || 0;
    return '<tr><th scope="row">' + relB(r.k) + ' ' + r.n + '</th><td class="num"><b>' + n + '</b></td><td class="num">' + fmt(st.n ? n / st.n * 100 : 0, 0) + '%</td>' +
      (anyVal ? '<td class="num">' + (st.relValN[r.k] ? 'R$ ' + fmt(st.relVal[r.k]) : '—') + '</td><td class="num">' + (st.relValN[r.k] ? 'R$ ' + fmt(st.relVal[r.k] / st.relValN[r.k]) : '—') + '</td>' : '') + '</tr>';
  }).join('');

  var sets = Object.keys(st.sets).sort(function (a, b) { return st.sets[b] - st.sets[a] || a.localeCompare(b); }).slice(0, 5);
  var maxS = sets.length ? st.sets[sets[0]] : 1;
  var setBars = sets.map(function (s) {
    return '<div class="bar"><span>' + esc(s) + '</span><span class="bar-t"><i style="width:' + (st.sets[s] / maxS * 100).toFixed(1) + '%;--c:#e2be70"></i></span><b class="num">' + st.sets[s] + '</b></div>';
  }).join('');

  var inDeck = {}; cs.forEach(function (c) { inDeck[c.id] = c; });
  var combos = D.combos.map(function (k) {
    var miss = k.p.filter(function (id) { return !inDeck[id]; });
    return '<div class="combo"><span class="kind">' + esc(k.kind) + '</span><h3>' + esc(k.n) + '</h3><div class="pcs">' +
      k.p.map(function (id) { var c = byId(id); return c ? chip(c) : ''; }).join('') + '</div><p>' + esc(k.t) + '</p>' +
      (miss.length ? '<p class="miss">Incompleto: ' + miss.map(function (id) { var c = byId(id); return esc(c ? c.n : id); }).join(', ') + ' fora do deck.</p>' : '') + '</div>';
  }).join('');

  var cmd = cs.filter(function (c) { return c.cmd; })[0];
  var ckeys = ui.curve === 'anjo' ? ANG.filter(function (k) { return st.ak[k.k]; }) : TYPES.filter(function (t) { return t.k !== 'ter' && st.types[t.k]; });
  var h = '';
  h += '<div class="hero"><div><h1>Coro da Alvorada</h1>' +
    '<p class="hero-sub">' + esc(D.meta.cmd) + (cmd ? mana(cmd.cost) : '') + '</p>' +
    '<p class="hero-lede">Tribal de Anjos em mono-branco, movido a marcadores e ganho de vida. O plano cabe em três verbos: descer, crescer, proteger.</p>' +
    '<dl class="facts"><div><dt>cartas</dt><dd>' + st.n + '</dd></div><div><dt>CMC médio</dt><dd>' + fmt(st.avg) + '</dd></div>' +
    '<div><dt>Anjos</dt><dd>' + st.angel + '</dd></div><div><dt>fontes de terreno</dt><dd>' + (st.lands + st.mdfc) + '</dd></div>' +
    '<div><dt>foils</dt><dd>' + st.foils + '</dd></div></dl></div>' +
    '<figure class="asas">' + wings(st) + '<figcaption>Cada pena é um agrupamento e sua área é a soma das notas. Toque numa pena para abrir no tabelão.</figcaption></figure></div>';

  h += '<div class="grid g-21">' +
    '<fieldset class="pn curve"><legend>Curva de mana</legend><div class="pn-tools"><div class="seg" role="group" aria-label="Dividir os tubos">' +
    '<button data-act="curve" data-v="tipo" data-fid="cv1" aria-pressed="' + (ui.curve === 'tipo') + '">Por tipo</button>' +
    '<button data-act="curve" data-v="anjo" data-fid="cv2" aria-pressed="' + (ui.curve === 'anjo') + '">Anjos e o resto</button></div></div>' +
    curveSvg(st, ui.curve) +
    '<div class="legend">' + ckeys.map(function (k) {
      return '<span><i style="background:' + k.c + '"></i>' + k.n + ' ' + (ui.curve === 'anjo' ? st.ak[k.k] : st.types[k.k]) + '</span>';
    }).join('') + '</div></fieldset>' +
    '<fieldset class="pn"><legend>Placar do deck</legend><div class="score-big"><b>' + st.total + '</b><span>pontos</span></div>' +
    '<table class="kv"><tr><th scope="row">CMC médio</th><td class="num">' + fmt(st.avg) + '</td><td class="num"><b>' + st.cmcPts + '</b> pts</td></tr>' +
    '<tr><th scope="row">Potencial de aceleração</th><td class="num">' + fmt(st.accX) + '</td><td class="num"><b>' + st.accPts + '</b> pts</td></tr>' +
    '<tr><th scope="row">Soma das notas</th><td></td><td class="num"><b>' + st.crit + '</b> pts</td></tr></table>' +
    '<h3 class="sub">Tiers das ' + st.n + ' cartas</h3><div class="stack">' + TIERS.filter(function (t) { return st.tier[t.k]; }).map(function (t) {
      return '<i class="t' + t.k + '" style="flex:' + st.tier[t.k] + '" title="Tier ' + t.k + ': ' + st.tier[t.k] + '"></i>'; }).join('') + '</div>' +
    '<div class="legend">' + TIERS.map(function (t) { return '<span>' + tierB(t.k, true) + ' ' + (st.tier[t.k] || 0) + '</span>'; }).join('') +
    '<button class="linkish" data-act="go" data-v="tier">Abrir a tier list</button></div>' +
    '<details class="how"><summary>Como a conta é feita</summary><p>É a mesma lógica da sua planilha do Vito. O CMC médio vale de 1 a 5 pontos, e quanto mais baixo, melhor. O potencial de aceleração é a soma da coluna Ramp dividida pelo CMC médio, e cada 0,5 vale 5 pontos, até 90. O restante é a soma das notas de 0 a 3 que cada carta recebe nos oito agrupamentos. Como os agrupamentos mudam de um deck para outro, o total serve para acompanhar este deck ao longo das trocas, não para compará-lo com outro.</p></details>' +
    '</fieldset></div>';

  h += '<div class="grid g-11">' +
    '<fieldset class="pn"><legend>Os oito agrupamentos</legend><div class="gl">' + groups + '</div>' +
    '<p class="pn-note">O número em destaque conta as cartas com nota 2 ou 3; o que vem depois do sinal de mais, as de nota 1. A faixa tracejada, onde aparece, é a referência usual de Commander, e vale como regra de bolso.</p></fieldset>' +
    '<fieldset class="pn"><legend>Leitura do deck</legend><ul class="read">' + readings(st) + '</ul></fieldset></div>';

  h += '<div class="grid g-111">' +
    '<fieldset class="pn"><legend>Base de mana</legend><h3 class="sub">O que os terrenos geram</h3><div class="stack">' + landStack + '</div><div class="legend">' + landLegend + '</div>' +
    '<h3 class="sub">Peso do branco nos custos</h3><div class="bars">' + pipBars + '</div>' +
    '<p class="pn-note">Cartas que não são terreno, pelo número de símbolos brancos no custo. ' + (st.mdfc ? 'As ' + st.mdfc + ' cartas duplas viram terreno que gera branco e não entram na barra de cima.' : '') + '</p></fieldset>' +
    '<fieldset class="pn"><legend>Tipos de carta</legend><div class="bars">' + typeBars + '</div>' +
    '<h3 class="sub">Edições mais presentes</h3><div class="bars">' + setBars + '</div></fieldset>' +
    '<fieldset class="pn"><legend>Relevância</legend><table class="rel-t"><thead><tr><th></th><th>Qtd</th><th>Do deck</th>' + (anyVal ? '<th>Valor</th><th>Média</th>' : '') + '</tr></thead><tbody>' + relRows + '</tbody></table>' +
    '<p class="pn-note">' + (anyVal ? 'Valores somam apenas as cartas com preço preenchido.' : 'Para ver valor e média por faixa, como na planilha, preencha o preço em cada carta.') +
    ' <button class="linkish" data-act="go" data-v="ctrl">Abrir o painel de controle</button></p></fieldset></div>';

  h += '<fieldset class="pn"><legend>Combos e linhas de jogo</legend><div class="combos">' + combos + '</div></fieldset>';

  var el = $('#v-geral');
  el.className = 'view' + (ui.first ? ' anim' : '');
  el.innerHTML = h;
  ui.first = false;
}

/* ============ tier list ============ */
function renderTier() {
  var cs = deck().filter(function (c) {
    if (ui.tierType) return c.g === ui.tierType || (ui.tierType === 'cri' && c.cmd);
    return ui.tierLands || !c.land;
  });
  var usados = {}; deck().forEach(function (c) { usados[c.g] = 1; });
  var h = '<div class="tools"><div class="pills" role="group" aria-label="Filtrar por tipo">' +
    '<button class="pill" data-act="tier-type" data-v="" data-fid="tt" aria-pressed="' + (!ui.tierType) + '">Todas</button>' +
    TG.filter(function (t) { return t.k !== 'cmd' && (usados[t.k] || ui.tierType === t.k); }).map(function (t) {
      return '<button class="pill" data-act="tier-type" data-v="' + t.k + '" data-fid="tt' + t.k + '" aria-pressed="' + (ui.tierType === t.k) + '">' + t.n + '</button>';
    }).join('') + '</div><span class="sp"></span>' +
    (ui.tierType ? '' : '<label class="tog"><input type="checkbox" data-act="tier-lands" data-fid="tl"' + (ui.tierLands ? ' checked' : '') + '> Incluir terrenos</label>') + '</div>';
  h += '<div class="tiers">' + TIERS.map(function (t) {
    var list = cs.filter(function (c) { return c.tier === t.k; }).sort(function (a, b) { return (pts(b) - pts(a)) || a.n.localeCompare(b.n); });
    return '<div class="tier" data-t="' + t.k + '"><div class="tier-l"><b>' + t.k + '</b><span>' + t.d + '</span><small>' + pl(list.length, 'carta', 'cartas') + '</small></div>' +
      '<div class="drop" data-drop="tier:' + t.k + '">' + (list.length ? list.map(function (c) { return chip(c, { mana: true }); }).join('') :
        '<span class="empty">' + (t.k === 'D' ? 'Nenhuma carta fora de lugar. Bom sinal.' : 'Nenhuma carta nesta faixa.') + '</span>') + '</div></div>';
  }).join('') + '</div>';
  h += '<p class="hint">Arraste uma carta para outra faixa, ou toque nela para ver o motivo e reclassificar. A ordem dentro de cada faixa segue a pontuação.</p>';
  $('#v-tier').innerHTML = h;
}

/* ============ tabelão ============ */
function sortVal(c, k) {
  if (k === 'n') return c.n.toLowerCase();
  if (k === 'q') return c.q;
  if (k === 'cmc') return c.land ? -1 : c.cmc;
  if (k === 'pts') return pts(c);
  if (k === 'tier') return TR[c.tier];
  if (k === 'rel') return RR[c.rel];
  return gv(c, +k.slice(1));
}
function sorter(a, b) {
  var k = ui.sort.k, x = sortVal(a, k), y = sortVal(b, k);
  var r = (typeof x === 'string') ? x.localeCompare(y) : x - y;
  return (r * ui.sort.d) || a.n.localeCompare(b.n);
}
function scCell(v, i) {
  var cl = v > 0 ? 'v' + Math.min(v, 3) : v < 0 ? 'vn' : 'z';
  return '<td class="sc ' + cl + '" style="--c:var(--g' + i + ')">' + (v === 0 ? '·' : (v < 0 ? '−' + (-v) : v)) + '</td>';
}
function tabRows() {
  var q = ui.q.trim().toLowerCase();
  var cs = deck().filter(function (c) {
    if (q && c.n.toLowerCase().indexOf(q) < 0 && c.line.toLowerCase().indexOf(q) < 0) return false;
    if (ui.fg >= 0 && gv(c, ui.fg) <= 0) return false;
    if (ui.ft && c.g !== ui.ft) return false;
    if (ui.fr && c.rel !== ui.fr) return false;
    return true;
  });
  function row(c) {
    var cells = '';
    for (var i = 0; i < 8; i++) cells += scCell(gv(c, i), i);
    return '<tr class="row" data-card="' + esc(c.id) + '" tabindex="0"><td class="c-name"><div class="nm c-' + esc(c.col) + '"><span class="t">' + esc(c.n) + '</span>' +
      (c.foil ? '<span class="foil" title="Foil">✦</span>' : '') + (c.pet ? '<span class="pet" title="PetCard">♥</span>' : '') + (c.edited ? '<span class="edt" title="Avaliação alterada por você"></span>' : '') +
      '</div></td><td class="dimc num">' + c.q + '</td><td>' + (c.cost ? mana(c.cost) : '<span class="dimc">—</span>') + '</td><td class="num">' + (c.land ? '<span class="dimc">—</span>' : c.cmc) + '</td>' + cells +
      '<td class="pts num">' + pts(c) + '</td><td>' + tierB(c.tier, true) + '</td><td>' + relB(c.rel) + '</td></tr>';
  }
  var tot = [0, 0, 0, 0, 0, 0, 0, 0], tp = 0, tn = 0;
  cs.forEach(function (c) { for (var i = 0; i < 8; i++) tot[i] += gv(c, i) * c.q; tp += pts(c) * c.q; tn += c.q; });
  var h = '<tr class="tot"><td class="c-name">' + (cs.length === deck().length ? 'Total do deck' : 'Total do filtro') + '</td><td class="num">' + tn + '</td><td></td><td></td>' +
    tot.map(function (v) { return '<td class="num">' + v + '</td>'; }).join('') + '<td class="num">' + tp + '</td><td></td><td></td></tr>';
  if (!cs.length) return h + '<tr><td class="c-name" colspan="15" style="position:static;padding:22px 14px;color:var(--mute);max-width:none">Nenhuma carta com esses filtros. Limpe a busca ou escolha outro agrupamento.</td></tr>';
  if (ui.grouped) {
    TG.forEach(function (g) {
      var list = cs.filter(function (c) { return c.g === g.k; }).sort(sorter);
      if (!list.length) return;
      var n = 0, p = 0; list.forEach(function (c) { n += c.q; p += pts(c) * c.q; });
      h += '<tr class="grp"><td colspan="15"><div class="grp-in">' + g.n + ' (' + n + ')<span>' + p + ' pts</span></div></td></tr>' + list.map(row).join('');
    });
  } else {
    h += cs.sort(sorter).map(row).join('');
  }
  return h;
}
function th(k, label, cls, title, style) {
  var act = ui.sort.k === k;
  return '<th' + (cls ? ' class="' + cls + '"' : '') + (style ? ' style="' + style + '"' : '') + (act ? ' aria-sort="' + (ui.sort.d > 0 ? 'ascending' : 'descending') + '"' : '') + ' scope="col">' +
    '<button data-act="sort" data-k="' + k + '" data-fid="th' + k + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + label + (act ? (ui.sort.d > 0 ? ' ▲' : ' ▼') : '') + '</button></th>';
}
function renderTab() {
  var usados = {}; deck().forEach(function (c) { usados[c.g] = 1; });
  var h = '<div class="tools"><label class="fld"><span>Buscar</span><input class="inp" id="q" type="search" placeholder="nome ou tipo" value="' + esc(ui.q) + '" autocomplete="off"></label>' +
    '<label class="fld"><span>Tipo</span><select class="inp" data-act="ft" data-fid="ft"><option value="">Todos</option>' + TG.filter(function (t) { return usados[t.k] || ui.ft === t.k; }).map(function (t) { return '<option value="' + t.k + '"' + (ui.ft === t.k ? ' selected' : '') + '>' + t.n + '</option>'; }).join('') + '</select></label>' +
    '<label class="fld"><span>Relevância</span><select class="inp" data-act="fr" data-fid="fr"><option value="">Todas</option>' + RELS.map(function (r) { return '<option value="' + r.k + '"' + (ui.fr === r.k ? ' selected' : '') + '>' + r.l + ' ' + r.n + '</option>'; }).join('') + '</select></label>' +
    '<span class="sp"></span><label class="tog"><input type="checkbox" data-act="grouped" data-fid="gp"' + (ui.grouped ? ' checked' : '') + '> Agrupar por tipo</label></div>';
  h += '<div class="pills" role="group" aria-label="Filtrar por agrupamento">' + G.map(function (g, i) {
    return '<button class="pill" style="--c:var(--g' + i + ')" data-act="fg" data-g="' + i + '" data-fid="fg' + i + '" aria-pressed="' + (ui.fg === i) + '" title="' + esc(g.d) + '"><i class="dot" style="--c:var(--g' + i + ')"></i>' + esc(g.k) + '</button>';
  }).join('') + '</div>';
  h += '<div class="tw" id="tw"><table class="tbl"><thead><tr>' +
    th('n', 'Carta', 'c-name') + th('q', 'Qtd') + '<th scope="col">Custo</th>' + th('cmc', 'CMC') +
    G.map(function (g, i) { return th('g' + i, g.ab, 'gh', g.k + ': ' + g.d, '--c:var(--g' + i + ')'); }).join('') +
    th('pts', 'Pts') + th('tier', 'Tier') + th('rel', 'Relev.') + '</tr></thead><tbody id="tbody">' + tabRows() + '</tbody></table></div>';
  h += '<p class="hint">Notas de 0 a 3 em cada agrupamento: 1 é efeito de passagem, 2 é função da carta, 3 é referência do deck. Uma carta pode pontuar em vários. Toque na linha para ver o motivo e editar.</p>';
  $('#v-tab').innerHTML = h;
}

/* ============ painel de controle ============ */
function renderCtrl() {
  var all = deck(), cs = all.filter(function (c) { return ui.ctrlLands || !c.land; }), st = stats(all);
  var h = '<div class="tools"><p class="hint" style="flex:1;min-width:240px">Quatro faixas, como na coluna Relevância da sua planilha. Arraste entre as colunas ou toque na carta para mudar.</p>' +
    '<label class="tog"><input type="checkbox" data-act="ctrl-lands" data-fid="cl"' + (ui.ctrlLands ? ' checked' : '') + '> Incluir terrenos</label></div>';
  h += '<div class="kan">' + RELS.map(function (r) {
    var list = cs.filter(function (c) { return c.rel === r.k; }).sort(function (a, b) {
      return r.k === 'BAX' ? ((TR[b.tier] - TR[a.tier]) || (pts(a) - pts(b)) || a.n.localeCompare(b.n)) : ((TR[a.tier] - TR[b.tier]) || (pts(b) - pts(a)) || a.n.localeCompare(b.n));
    });
    var n = 0; list.forEach(function (c) { n += c.q; });
    return '<section class="kcol k-' + r.k + '"><header><h3>' + r.n + ' <small>' + r.l + '</small></h3><p>' + r.d + '</p><div class="kn">' + pl(n, 'carta', 'cartas') + '</div></header>' +
      '<div class="drop" data-drop="rel:' + r.k + '">' + (list.length ? list.map(function (c) { return chip(c, { tier: true, pts: true }); }).join('') : '<span class="empty">Nenhuma carta aqui.</span>') + '</div></section>';
  }).join('') + '</div>';

  var qn = cutQueue(all, false).slice(0, 8), ql = cutQueue(all, true).filter(function (c) { return c.rel === 'BAX'; });
  var queue = qn.map(function (c, i) {
    return '<li><span class="ord">' + (i + 1) + '</span>' + chip(c, { tier: true, pts: true }) + relB(c.rel) + '<p class="why">' + esc(c.why) + '</p></li>';
  }).join('');
  var pend = [];
  function pd(txt, btn, ok) { pend.push('<li><i class="mk' + (ok ? ' okk' : '') + '"></i><div>' + txt + (btn || '') + '</div></li>'); }
  if (st.n !== 100) pd('O deck está com <b>' + st.n + ' cartas</b>. ' + (st.n > 100 ? (st.n === 101 ? 'Sobra 1' : 'Sobram ' + (st.n - 100)) + ': escolha quem sai na fila de corte.' : (st.n === 99 ? 'Falta 1' : 'Faltam ' + (100 - st.n)) + ': promova uma carta do radar.'));
  cands().map(E).filter(function (c) { return c.verdict === 'entra' && !c.inDeck; }).forEach(function (c) {
    var o = c.sai ? byId(c.sai) : null;
    pd('<b>' + esc(c.n) + '</b> está no radar com veredito de entrada' + (o && o.inDeck ? ', no lugar de ' + esc(o.n) : '') + '.', '<button class="linkish" data-act="go" data-v="radar">Ver no radar</button>');
  });
  all.forEach(function (c) {
    if (c.rel === 'INS' && TR[c.tier] >= 3 && !c.pet) pd('<b>' + esc(c.n) + '</b> está como intocável com tier ' + c.tier + '. Se for PetCard, marque o coração; senão, reveja a faixa.', '<button class="linkish" data-card="' + esc(c.id) + '">Abrir</button>');
    if (c.rel === 'BAX' && TR[c.tier] <= 1) pd('<b>' + esc(c.n) + '</b> está na berlinda com tier ' + c.tier + '. As duas avaliações não combinam.', '<button class="linkish" data-card="' + esc(c.id) + '">Abrir</button>');
  });
  ql.forEach(function (c) {
    pd('Terreno na berlinda: <b>' + esc(c.n) + '</b>. ' + esc(c.why), '<button class="linkish" data-card="' + esc(c.id) + '">Abrir</button>');
  });
  if (!pend.length) pd('Nada pendente. Deck com 100 cartas e avaliações coerentes.', '', true);
  h += '<div class="grid g-11"><fieldset class="pn"><legend>Fila de corte</legend><ol class="queue">' + queue + '</ol>' +
    '<p class="pn-note">Ordem: relevância mais baixa, depois tier, depois pontuação. PetCards e o comandante nunca entram na fila; terrenos e cartas duplas com terreno no verso são avaliados à parte.</p></fieldset>' +
    '<fieldset class="pn"><legend>Pendências</legend><ul class="pend">' + pend.join('') + '</ul></fieldset></div>';
  $('#v-ctrl').innerHTML = h;
}

/* ============ radar ============ */
function cutOptions(cand) {
  var d = deck(), top = cutQueue(d, !!(cand.land || cand.mdfc)).slice(0, 12), ids = {};
  top.forEach(function (c) { ids[c.id] = 1; });
  var rest = d.filter(function (c) { return !ids[c.id] && !c.cmd && c.id !== cand.id; }).sort(function (a, b) { return a.n.localeCompare(b.n); });
  var def = (cand.sai && d.some(function (c) { return c.id === cand.sai; })) ? cand.sai : (top[0] ? top[0].id : '');
  function opt(c) { return '<option value="' + esc(c.id) + '"' + (c.id === def ? ' selected' : '') + '>' + esc(c.n) + ' (' + RELS[RR[c.rel]].l + ', ' + pts(c) + ' pts)</option>'; }
  var inTop = top.some(function (c) { return c.id === def; });
  return '<optgroup label="Fila de corte">' + top.map(opt).join('') + '</optgroup><optgroup label="Demais cartas">' + rest.map(opt).join('') + '</optgroup><option value=""' + (!def && !inTop ? ' selected' : '') + '>Ninguém sai (o deck passa de 100)</option>';
}
function renderRadar() {
  var vo = { entra: 0, avaliar: 1, fora: 2 };
  var cs = cands().map(E).sort(function (a, b) { return (vo[a.verdict] - vo[b.verdict]) || (TR[a.tier] - TR[b.tier]) || (pts(b) - pts(a)); });
  var h = '<p class="hint">Cartas fora do deck que valem acompanhar, das coleções novas e das antigas. Ao colocar uma no deck você escolhe quem sai, e todos os gráficos passam a refletir a troca.</p>';
  h += '<div class="cands">' + cs.map(function (c) {
    var tags = '';
    for (var i = 0; i < 8; i++) if (gv(c, i) > 0) tags += '<span class="gt" style="--c:var(--g' + i + ')">' + esc(G[i].sh || G[i].k) + ' ' + gv(c, i) + '</span>';
    var sw = null; S.swaps.forEach(function (s) { if (s.i === c.id) sw = s; });
    var outC = sw && sw.o ? byId(sw.o) : null;
    return '<article class="cand' + (c.inDeck ? ' in' : '') + '" id="cand-' + esc(c.id) + '"><div class="cand-h">' + tierB(c.tier) +
      '<div><h3><button class="linkish" data-card="' + esc(c.id) + '">' + esc(c.n) + '</button></h3><p class="cand-m">' + (c.cost ? mana(c.cost) + ' ' : '') + esc(c.line) + (c.pt ? ', ' + esc(c.pt) : '') + '</p></div>' +
      '<span class="vd vd-' + esc(c.verdict) + '">' + VERD[c.verdict] + '</span></div>' +
      (c.fx ? '<p class="cand-fx">' + rich(c.fx) + '</p>' : '') + (c.why ? '<p class="cand-why">' + rich(c.why) + '</p>' : '') +
      '<div class="gtags">' + tags + '<span class="gt" style="--c:226,190,112">' + pts(c) + ' pts</span></div>' +
      '<div class="cand-a">' + (c.inDeck ?
        '<span class="st">No deck' + (outC ? ', no lugar de ' + esc(outC.n) : '') + '</span><button class="btn ghost sm" data-act="unswap" data-id="' + esc(c.id) + '" data-fid="us' + esc(c.id) + '">Desfazer</button>' :
        '<select class="inp" id="sel-' + esc(c.id) + '" aria-label="Quem sai do deck para ' + esc(c.n) + ' entrar">' + cutOptions(c) + '</select>' +
        '<button class="btn sm" data-act="swap" data-id="' + esc(c.id) + '" data-fid="sw' + esc(c.id) + '">Colocar no deck</button>' +
        (c.custom ? '<button class="btn ghost sm" data-act="del-custom" data-id="' + esc(c.id) + '">Excluir</button>' : '')) +
      '</div></article>';
  }).join('') + '</div>';

  var outs = D.cards.map(E).filter(function (c) { return !c.inDeck; });
  if (outs.length) {
    h += '<fieldset class="pn"><legend>Saíram do deck</legend><ul class="outs">' + outs.map(function (c) {
      return '<li>' + chip(c, { tier: true, pts: true }) + '<span class="hint" style="flex:1;min-width:160px">' + esc(c.why) + '</span><button class="btn ghost sm" data-act="restore" data-id="' + esc(c.id) + '">Devolver ao deck</button></li>';
    }).join('') + '</ul></fieldset>';
  }

  h += '<fieldset class="pn"><legend>Adicionar carta ao radar</legend><p class="hint">Saiu coleção nova ou achou uma carta antiga? Registre aqui, dê as notas e compare com a fila de corte.</p><div class="form">' +
    '<label>Nome<input class="inp" id="nc-n" type="text" autocomplete="off"></label>' +
    '<label>Custo de mana<input class="inp" id="nc-c" type="text" placeholder="3WW ou {3}{W}{W}" autocomplete="off"></label>' +
    '<label>Tipo<select class="inp" id="nc-t">' + TYPES.map(function (t) { return '<option value="' + t.k + '">' + t.o + '</option>'; }).join('') + '</select></label>' +
    '<label>Tier<select class="inp" id="nc-tier">' + TIERS.map(function (t) { return '<option value="' + t.k + '"' + (t.k === 'B' ? ' selected' : '') + '>' + t.k + ', ' + t.d.toLowerCase() + '</option>'; }).join('') + '</select></label>' +
    '<div class="wide"><div class="g8">' + G.map(function (g, i) {
      return '<label>' + esc(g.sh || g.k) + '<select class="inp" id="nc-g' + i + '"><option>0</option><option>1</option><option>2</option><option>3</option></select></label>';
    }).join('') + '</div></div>' +
    '<label class="wide">Por que entraria<input class="inp" id="nc-w" type="text" autocomplete="off"></label>' +
    '<div class="wide" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><label class="tog"><input type="checkbox" id="nc-v"> É Anjo</label><span class="sp" style="flex:1"></span>' +
    '<button class="btn" data-act="add-custom">Adicionar ao radar</button></div></div></fieldset>';
  $('#v-radar').innerHTML = h;
}

/* ============ gaveta ============ */
function renderDrawer() {
  var el = $('#drawer'), c = ui.drawer ? byId(ui.drawer) : null;
  if (!c) { el.hidden = true; $('#scrim').hidden = !ui.modal; return; }
  var steps = G.map(function (g, i) {
    var v = c.s[i], mn = i === 0 ? -1 : 0;
    return '<div class="step"><span class="gn" title="' + esc(g.d) + '"><i class="dot" style="--c:var(--g' + i + ')"></i>' + esc(g.k) + '</span>' +
      '<span class="stp"><button data-act="step" data-g="' + i + '" data-d="-1" data-fid="sm' + i + '" aria-label="Diminuir ' + esc(g.k) + '"' + (v <= mn ? ' disabled' : '') + '>−</button>' +
      '<output>' + (v < 0 ? '−' + (-v) : v) + '</output>' +
      '<button data-act="step" data-g="' + i + '" data-d="1" data-fid="sp' + i + '" aria-label="Aumentar ' + esc(g.k) + '"' + (v >= 3 ? ' disabled' : '') + '>+</button></span></div>';
  }).join('');
  var link = c.set ? 'https://scryfall.com/card/' + encodeURIComponent(c.set.toLowerCase()) + '/' + encodeURIComponent(c.num) :
    'https://scryfall.com/search?q=' + encodeURIComponent('!"' + c.n + '"');
  var img = c.set ? 'https://api.scryfall.com/cards/' + encodeURIComponent(c.set.toLowerCase()) + '/' + encodeURIComponent(c.num) + '?format=image&version=normal' :
    'https://api.scryfall.com/cards/named?format=image&version=normal&exact=' + encodeURIComponent(c.n);
  var where = c.cand ? (c.inDeck ? 'No deck, vinda do radar' : 'No radar, fora do deck') : (c.inDeck ? '' : 'Fora do deck');
  var h = '<button class="x" data-act="close" aria-label="Fechar">×</button>' +
    '<p class="dw-type">' + esc(c.line) + '</p><h2 id="dw-title">' + esc(c.n) + '</h2>' +
    '<div class="dw-meta">' + (c.cost ? mana(c.cost) : '') + (c.land ? '' : '<span>CMC ' + c.cmc + '</span>') + (c.pt ? '<span>' + (c.ptl ? c.ptl + ' ' : '') + esc(c.pt) + '</span>' : '') +
    (c.set ? '<span>' + esc(c.set) + ' ' + esc(c.num) + '</span>' : '') + (c.q > 1 ? '<span>' + c.q + ' cópias</span>' : '') + (c.foil ? '<span><span class="foil">✦</span> foil</span>' : '') + (where ? '<span>' + where + '</span>' : '') + '</div>';
  if (S.art) h += '<div class="dw-art"><img src="' + esc(img) + '" alt="Arte de ' + esc(c.n) + '" loading="lazy" data-art></div>';
  h += (c.fx ? '<p class="dw-fx">' + rich(c.fx) + '</p>' : '') + (c.why ? '<p class="dw-why">' + rich(c.why) + '</p>' : '') +
    (c.back ? '<p class="dw-back">Outra face: ' + esc(c.back.n) + ' (' + esc(c.back.line) + ').</p>' : '');
  h += '<h3>Tier</h3><div class="segw" role="group" aria-label="Tier">' + TIERS.map(function (t) {
    return '<button data-act="set-tier" data-v="' + t.k + '" data-fid="st' + t.k + '" aria-pressed="' + (c.tier === t.k) + '">' + t.k + '<small>' + t.d + '</small></button>';
  }).join('') + '</div>';
  h += '<h3>Relevância</h3><div class="segw" role="group" aria-label="Relevância">' + RELS.map(function (r) {
    return '<button data-act="set-rel" data-v="' + r.k + '" data-fid="sr' + r.k + '" aria-pressed="' + (c.rel === r.k) + '">' + r.l + '<small>' + r.n + '</small></button>';
  }).join('') + '</div>';
  h += '<h3>Notas por agrupamento</h3><div class="steps">' + steps + '</div>';
  h += '<div class="dw-row"><label class="tog"><input type="checkbox" data-act="pet" data-fid="pet"' + (c.pet ? ' checked' : '') + '> <span class="pet">♥</span> PetCard: soma 1 ponto em Sinergia e fica fora da fila de corte</label></div>' +
    '<div class="dw-row"><label class="fld">Valor em R$ <input class="inp num" type="number" min="0" step="0.01" inputmode="decimal" data-act="val" data-fid="val" value="' + (c.val == null ? '' : c.val) + '" placeholder="0,00"></label></div>';
  h += '<div class="dw-sum"><span>Pontuação da carta</span><b>' + pts(c) + '</b></div>';
  h += '<div class="dw-links">' +
    (c.edited ? '<button class="linkish" data-act="reset-card" data-fid="rc">Voltar à avaliação original</button>' : '') +
    (c.cand ? '<button class="linkish" data-act="go" data-v="radar">' + (c.inDeck ? 'Ver a troca no radar' : 'Planejar a entrada no radar') + '</button>' :
      (c.cmd ? '' : (c.inDeck ? '<button class="linkish" data-act="cut" data-id="' + esc(c.id) + '" data-fid="ct">Tirar do deck</button>' : '<button class="linkish" data-act="restore" data-id="' + esc(c.id) + '" data-fid="ct">Devolver ao deck</button>'))) +
    '<a href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">Abrir no Scryfall</a>' +
    '<button class="linkish" data-act="art" data-fid="art">' + (S.art ? 'Ocultar a arte' : 'Mostrar a arte (usa internet)') + '</button></div>';
  el.innerHTML = h;
  el.hidden = false; $('#scrim').hidden = false;
  var im = $('[data-art]', el);
  if (im) im.addEventListener('error', function () {
    im.parentNode.innerHTML = '<p>Não deu para carregar a arte: sem internet ou imagens externas bloqueadas neste ambiente.</p>';
  });
}

/* ============ backup ============ */
function decklistText() {
  return deck().sort(function (a, b) { return (b.cmd ? 1 : 0) - (a.cmd ? 1 : 0) || a.n.localeCompare(b.n); }).map(function (c) {
    return c.q + ' ' + c.n + (c.set ? ' (' + c.set + ') ' + c.num : '') + (c.foil ? ' F' : '');
  }).join('\n');
}
function storeMsg(longo) {
  if (canStore && localFile) return longo ? 'Suas alterações ficam salvas neste navegador. O backup serve para levar o painel a outro computador ou guardar uma versão.' :
    'Suas alterações ficam salvas neste navegador. Use Backup para levar o painel a outro lugar.';
  return longo ? 'Aqui dentro do chat as alterações podem valer só enquanto a página estiver aberta. Baixe o arquivo e abra no navegador para que fiquem salvas, ou copie o backup abaixo.' :
    'Aqui as alterações podem valer só enquanto a página estiver aberta. Para guardá-las, baixe o arquivo e abra no navegador, ou use Backup.';
}
function renderModal() {
  var el = $('#modal');
  if (!ui.modal) { el.hidden = true; $('#scrim').hidden = !ui.drawer; return; }
  el.innerHTML = '<button class="x" data-act="close" aria-label="Fechar">×</button><h2 id="md-title">Backup</h2>' +
    '<p style="margin-top:8px">' + storeMsg(true) + '</p>' +
    '<h3>Backup do painel</h3><p>Guarda tiers, relevância, notas, PetCards, valores, trocas e cartas que você adicionou ao radar.</p>' +
    '<textarea id="bk-out" readonly aria-label="Backup do painel">' + esc(JSON.stringify(S)) + '</textarea>' +
    '<div class="acts"><button class="btn sm" data-act="copy" data-t="bk-out">Copiar backup</button></div>' +
    '<h3>Restaurar de um backup</h3><textarea id="bk-in" placeholder="Cole aqui o texto de um backup" aria-label="Texto do backup para restaurar"></textarea>' +
    '<div class="acts"><button class="btn sm" data-act="import">Restaurar</button></div>' +
    '<h3>Decklist atual</h3><p>No formato da sua lista, já com as trocas feitas no radar.</p>' +
    '<textarea id="bk-list" readonly aria-label="Decklist atual">' + esc(decklistText()) + '</textarea>' +
    '<div class="acts"><button class="btn sm" data-act="copy" data-t="bk-list">Copiar decklist</button></div>' +
    '<h3>Recomeçar</h3><p>Apaga suas alterações e volta à avaliação original de todas as cartas.</p>' +
    '<div class="acts"><button class="btn ghost sm" data-act="reset-all" data-fid="ra">' + (ui.confirmReset ? 'Confirmar: apagar minhas alterações' : 'Voltar tudo ao original') + '</button></div>';
  el.hidden = false; $('#scrim').hidden = false;
}

/* ============ orquestração ============ */
var RENDER = { geral: renderGeral, tier: renderTier, tab: renderTab, ctrl: renderCtrl, radar: renderRadar };
function renderCount() {
  var n = 0; deck().forEach(function (c) { n += c.q; });
  var el = $('#deckCount');
  el.textContent = n === 100 ? '100 cartas' : n + ' cartas, ' + (n > 100 ? (n === 101 ? 'sobra 1' : 'sobram ' + (n - 100)) : (n === 99 ? 'falta 1' : 'faltam ' + (100 - n)));
  el.className = 'count' + (n === 100 ? '' : ' off');
}
function render(keepFocus) {
  var fid = null, a = document.activeElement, tw = $('#tw'), sc = tw ? [tw.scrollTop, tw.scrollLeft] : null;
  if (keepFocus !== false && a && a.dataset) fid = a.dataset.fid || (a.id === 'q' ? '#q' : null);
  RENDER[ui.tab]();
  renderCount(); renderDrawer(); renderModal();
  tw = $('#tw'); if (tw && sc) { tw.scrollTop = sc[0]; tw.scrollLeft = sc[1]; }
  if (fid) { var t = fid === '#q' ? $('#q') : $('[data-fid="' + fid + '"]'); if (t) { try { t.focus({ preventScroll: true }); } catch (e) { t.focus(); } } }
}
function go(tab) {
  ui.tab = tab;
  document.querySelectorAll('.tabs [role=tab]').forEach(function (b) {
    var on = b.dataset.tab === tab; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
  });
  document.querySelectorAll('.view').forEach(function (v) { v.hidden = v.id !== 'v-' + tab; });
  render(false);
  window.scrollTo(0, 0);
}
var toastT;
function toast(msg) {
  var el = $('#toast'); el.textContent = msg; el.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2600);
}
function commit(msg) { save(); render(); if (msg) toast(msg); }
function openDrawer(id) { ui.drawer = id; ui.modal = false; renderModal(); renderDrawer(); var d = $('#drawer'); d.scrollTop = 0; d.focus(); }
function closeAll() {
  var id = ui.drawer; ui.drawer = null; ui.modal = false; ui.confirmReset = false; renderDrawer(); renderModal();
  if (id) { var back = $('#v-' + ui.tab + ' [data-card="' + id + '"]'); if (back && back.focus) back.focus(); }
}

function parseCost(txt) {
  txt = String(txt || '').toUpperCase().trim();
  var toks = [], m, re;
  if (txt.indexOf('{') >= 0) { re = /\{([^}]+)\}/g; while ((m = re.exec(txt))) toks.push(m[1].trim()); }
  else { re = /(\d+|[WUBRGCX])/g; while ((m = re.exec(txt))) toks.push(m[1]); }
  var cost = '', cmc = 0, cols = {};
  toks.forEach(function (s) {
    if (/^\d+$/.test(s)) { cmc += +s; cost += '{' + s + '}'; }
    else if (s === 'X') cost += '{X}';
    else { cmc += 1; cost += '{' + s + '}'; s.split('/').forEach(function (ch) { if ('WUBRG'.indexOf(ch) >= 0 && ch) cols[ch] = 1; }); }
  });
  var k = Object.keys(cols).sort(function (a, b) { return 'WUBRG'.indexOf(a) - 'WUBRG'.indexOf(b); }).join('');
  return { cost: cost, cmc: cmc, col: k || 'C' };
}

function act(a, t, ev) {
  var c, id = t.dataset.id, o;
  switch (a) {
    case 'backup': ui.modal = true; ui.drawer = null; ui.confirmReset = false; renderDrawer(); renderModal(); $('#modal').focus(); break;
    case 'close': closeAll(); break;
    case 'go': ui.drawer = null; go(t.dataset.v); break;
    case 'curve': ui.curve = t.dataset.v; render(); break;
    case 'filter-group': ui.fg = +t.dataset.g; ui.q = ''; ui.ft = ''; ui.fr = ''; go('tab'); break;
    case 'fg': ui.fg = (ui.fg === +t.dataset.g ? -1 : +t.dataset.g); render(); break;
    case 'sort':
      if (ui.sort.k === t.dataset.k) ui.sort.d = -ui.sort.d;
      else ui.sort = { k: t.dataset.k, d: (t.dataset.k === 'n' || t.dataset.k === 'tier' || t.dataset.k === 'rel') ? 1 : -1 };
      render(); break;
    case 'tier-type': ui.tierType = t.dataset.v; render(); break;
    case 'set-tier': ov(ui.drawer).tier = t.dataset.v; commit(); break;
    case 'set-rel': ov(ui.drawer).rel = t.dataset.v; commit(); break;
    case 'step':
      c = byId(ui.drawer); o = ov(ui.drawer); o.s = c.s.slice();
      o.s[+t.dataset.g] = Math.max(+t.dataset.g === 0 ? -1 : 0, Math.min(3, o.s[+t.dataset.g] + (+t.dataset.d)));
      commit(); break;
    case 'reset-card':
      o = S.ov[ui.drawer]; if (o) { delete o.s; delete o.tier; delete o.rel; if (!o.pet && o.val == null) delete S.ov[ui.drawer]; }
      commit('Avaliação original restaurada'); break;
    case 'art': S.art = !S.art; commit(); break;
    case 'cut':
      c = byId(id); if (!c) break;
      if (c.cand) { delete S.inn[id]; S.swaps = S.swaps.filter(function (s) { return s.i !== id; }); } else S.out[id] = 1;
      commit(c.n + ' saiu do deck'); break;
    case 'restore':
      c = byId(id); delete S.out[id]; S.swaps.forEach(function (s) { if (s.o === id) s.o = null; });
      commit((c ? c.n : 'A carta') + ' voltou ao deck'); break;
    case 'swap':
      c = byId(id); var sel = $('#sel-' + id), outId = sel ? sel.value : '';
      S.inn[id] = 1; if (outId) S.out[outId] = 1;
      S.swaps = S.swaps.filter(function (s) { return s.i !== id; }); S.swaps.push({ i: id, o: outId || null });
      o = outId ? byId(outId) : null;
      commit(c.n + ' entrou' + (o ? ', ' + o.n + ' saiu' : '')); break;
    case 'unswap':
      c = byId(id); delete S.inn[id];
      S.swaps.forEach(function (s) { if (s.i === id && s.o) delete S.out[s.o]; });
      S.swaps = S.swaps.filter(function (s) { return s.i !== id; });
      commit('Troca desfeita'); break;
    case 'add-custom':
      var name = $('#nc-n').value.trim();
      if (!name) { toast('Informe o nome da carta'); $('#nc-n').focus(); break; }
      var pc = parseCost($('#nc-c').value), tk = $('#nc-t').value, ty = TYPES.filter(function (x) { return x.k === tk; })[0], sc = [];
      for (var i = 0; i < 8; i++) sc.push(+$('#nc-g' + i).value || 0);
      var anjo = $('#nc-v').checked;
      S.custom.push({ id: 'x-' + slug(name) + '-' + Date.now().toString(36), n: name, q: 1, cost: tk === 'ter' ? '' : pc.cost, cmc: tk === 'ter' ? 0 : pc.cmc, t: tk, g: GROUP_OF[tk],
        line: ty.o + (anjo ? ' — Anjo' : ''), col: tk === 'ter' ? 'L' : (pc.col === 'W' ? 'W' : 'C'), s: sc, tier: $('#nc-tier').value, rel: 'MED', fx: '', why: $('#nc-w').value.trim(),
        cand: 1, custom: 1, verdict: 'avaliar', angel: anjo ? 1 : 0, land: tk === 'ter' ? 1 : 0, prod: tk === 'ter' ? 'C' : undefined });
      commit(name + ' entrou no radar'); break;
    case 'del-custom':
      S.custom = S.custom.filter(function (x) { return x.id !== id; }); delete S.inn[id]; delete S.ov[id];
      S.swaps.forEach(function (s) { if (s.i === id && s.o) delete S.out[s.o]; });
      S.swaps = S.swaps.filter(function (s) { return s.i !== id; });
      commit('Carta excluída do radar'); break;
    case 'copy':
      var ta = $('#' + t.dataset.t); ta.focus(); ta.select();
      var done = function () { toast('Copiado'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, function () { try { document.execCommand('copy'); done(); } catch (e) { toast('Selecione o texto e copie manualmente'); } });
      else { try { document.execCommand('copy'); done(); } catch (e) { toast('Selecione o texto e copie manualmente'); } }
      break;
    case 'import':
      try {
        var raw = JSON.parse($('#bk-in').value);
        if (!raw || typeof raw !== 'object' || !('ov' in raw)) throw new Error('formato');
        S = normalize(raw); ui.modal = false; commit('Backup restaurado');
      } catch (e) { toast('Esse texto não é um backup deste painel'); }
      break;
    case 'reset-all':
      if (!ui.confirmReset) { ui.confirmReset = true; renderModal(); var b = $('[data-fid="ra"]'); if (b) b.focus(); break; }
      S = fresh(); ui.confirmReset = false; ui.modal = false; commit('Painel de volta ao original'); break;
  }
}

/* ============ eventos ============ */
document.addEventListener('click', function (ev) {
  var t = ev.target;
  if (t.id === 'scrim') { closeAll(); return; }
  var tab = t.closest('[role=tab][data-tab]'); if (tab) { go(tab.dataset.tab); return; }
  var a = t.closest('[data-act]');
  if (a && a.tagName !== 'INPUT' && a.tagName !== 'SELECT') { act(a.dataset.act, a, ev); return; }
  if (a) return;
  var card = t.closest('[data-card]'); if (card) { openDrawer(card.dataset.card); }
});
document.addEventListener('change', function (ev) {
  var t = ev.target, a = t.dataset && t.dataset.act; if (!a) return;
  if (a === 'ft') { ui.ft = t.value; render(); }
  else if (a === 'fr') { ui.fr = t.value; render(); }
  else if (a === 'grouped') { ui.grouped = t.checked; render(); }
  else if (a === 'tier-lands') { ui.tierLands = t.checked; render(); }
  else if (a === 'ctrl-lands') { ui.ctrlLands = t.checked; render(); }
  else if (a === 'pet') { ov(ui.drawer).pet = t.checked; if (!t.checked) delete ov(ui.drawer).pet; commit(); }
  else if (a === 'val') {
    var v = parseFloat(String(t.value).replace(',', '.'));
    if (isNaN(v) || v < 0) delete ov(ui.drawer).val; else ov(ui.drawer).val = Math.round(v * 100) / 100;
    commit();
  }
});
document.addEventListener('input', function (ev) {
  if (ev.target.id === 'q') { ui.q = ev.target.value; var tb = $('#tbody'); if (tb) tb.innerHTML = tabRows(); }
});
document.addEventListener('keydown', function (ev) {
  if (ev.key === 'Escape' && (ui.drawer || ui.modal)) { closeAll(); return; }
  var t = ev.target;
  if ((ev.key === 'Enter' || ev.key === ' ') && t.matches && t.matches('.chip,.pena,tr.row')) { ev.preventDefault(); t.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
  if (t.matches && t.matches('[role=tab]') && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft')) {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role=tab]')), i = tabs.indexOf(t);
    var n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); go(n.dataset.tab); n.focus();
  }
});
/* arrastar e soltar */
document.addEventListener('dragstart', function (ev) {
  var c = ev.target.closest && ev.target.closest('.chip[data-card]'); if (!c) return;
  ev.dataTransfer.setData('text/plain', c.dataset.card); ev.dataTransfer.effectAllowed = 'move'; c.classList.add('dragging');
});
document.addEventListener('dragend', function (ev) {
  if (ev.target.classList) ev.target.classList.remove('dragging');
  document.querySelectorAll('.drop.over').forEach(function (z) { z.classList.remove('over'); });
});
document.addEventListener('dragover', function (ev) {
  var z = ev.target.closest && ev.target.closest('[data-drop]'); if (!z) return;
  ev.preventDefault(); ev.dataTransfer.dropEffect = 'move'; z.classList.add('over');
});
document.addEventListener('dragleave', function (ev) {
  var z = ev.target.closest && ev.target.closest('[data-drop]'); if (z && !z.contains(ev.relatedTarget)) z.classList.remove('over');
});
document.addEventListener('drop', function (ev) {
  var z = ev.target.closest && ev.target.closest('[data-drop]'); if (!z) return;
  ev.preventDefault();
  var id = ev.dataTransfer.getData('text/plain'), kv = z.dataset.drop.split(':'), c = byId(id);
  if (!c || c[kv[0]] === kv[1]) { z.classList.remove('over'); return; }
  ov(id)[kv[0]] = kv[1];
  commit(c.n + (kv[0] === 'tier' ? ' foi para o tier ' + kv[1] : ' agora está em ' + RELS[RR[kv[1]]].n.toLowerCase()));
});

/* ============ início ============ */
$('#feito').textContent = D.meta.feito;
$('#storeNote').textContent = storeMsg(false);
go('geral');
