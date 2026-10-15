(function () {
'use strict';

var D = /*__DATA__*/null;
var M = D.meta;

/* ============ definições ============ */
var G = D.grupos.map(function (g) {
  return { id: g.k, k: g.nome, ab: g.ab, d: g.desc, sh: g.curto || '', ref: g.ref || null, pet: !!g.pet, neg: !!g.negativo, lt: !!g.claro };
});
var NG = G.length;
function gi(id) { for (var i = 0; i < NG; i++) if (G[i].id === id) return i; return -1; }
var IR = Math.max(0, gi('ramp'));
var IPET = (function () { for (var i = 0; i < NG; i++) if (G[i].pet) return i; return -1; })();
var NUM = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];
var MK = D.marcadores || {};
var TRIBO = MK.tribo || null;
var EDH = D.edh || null;
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
var TC = D.tipos || {};
var TYPES = [
  { k: 'cri', n: 'Criaturas', o: 'Criatura' }, { k: 'ins', n: 'Mágicas instantâneas', o: 'Mágica instantânea' },
  { k: 'fei', n: 'Feitiços', o: 'Feitiço' }, { k: 'art', n: 'Artefatos', o: 'Artefato' },
  { k: 'enc', n: 'Encantamentos', o: 'Encantamento' }, { k: 'pw', n: 'Planeswalkers', o: 'Planeswalker' },
  { k: 'bat', n: 'Batalhas', o: 'Batalha' }, { k: 'ter', n: 'Terrenos', o: 'Terreno' }
].map(function (t) { t.c = TC[t.k] || '#9aa3ad'; return t; });
var TG = [
  { k: 'cmd', n: 'Comandante' }, { k: 'cri', n: 'Criaturas' }, { k: 'pw', n: 'Planeswalkers' }, { k: 'bat', n: 'Batalhas' },
  { k: 'mag', n: 'Mágicas' }, { k: 'art', n: 'Artefatos' }, { k: 'enc', n: 'Encantamentos' }, { k: 'ter', n: 'Terrenos' }
];
var GROUP_OF = { cri: 'cri', pw: 'pw', bat: 'bat', ins: 'mag', fei: 'mag', art: 'art', enc: 'enc', ter: 'ter' };
var COLS = D.cores;
var WUBRG = ['W', 'U', 'B', 'R', 'G'];
var CNOME = { W: 'Branco', U: 'Azul', B: 'Preto', R: 'Vermelho', G: 'Verde' };
var DUO = { W: '#f3e7bf', U: '#7fb0ff', B: '#a487ad', R: '#f0596a', G: '#6fd0a8' };
var PIP = { W: '#f3e7bf', U: '#a9cdf0', B: '#2b2228', R: '#f0a28c', G: '#9fd0a6' };
var IDENT = String(M.ident || '').split('').filter(function (ch) { return WUBRG.indexOf(ch) >= 0; });
var VERD = { entra: 'Entra', avaliar: 'Avaliar', fora: 'Fica de fora' };
var TR = { S: 0, A: 1, B: 2, C: 3, D: 4 }, RR = { INS: 0, ALT: 1, MED: 2, BAX: 3 };

/* ============ estado ============ */
function slug(s) { return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
var KEY = 'mtg-hub:' + slug(M.pasta) + ':v1';
var OLDKEY = M.chave_antiga || '';
window.PAINEL = { D: D, key: KEY };   /* para os testes e para conferência; o painel não lê nada daqui */
var PUB = !!(window.claude && typeof window.claude.use === 'function');   /* página publicada como artefato */
var canStore = (function () {
  try { return (location.protocol === 'file:' || PUB) && !!window.localStorage; } catch (e) { return false; }
})();
function fresh() { return { v: 1, ov: {}, custom: [], inn: {}, out: {}, pk: {}, swaps: [], img: M.img_padrao !== false, ts: 0 }; }
function fitS(a) { a = a.slice(0, NG); while (a.length < NG) a.push(0); return a; }
function normalize(s) {
  var f = fresh();
  if (!s || typeof s !== 'object') return f;
  ['ov', 'inn', 'out', 'pk'].forEach(function (k) { if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) f[k] = s[k]; });
  Object.keys(f.ov).forEach(function (id) { var o = f.ov[id]; if (o && Array.isArray(o.s) && o.s.length !== NG) o.s = fitS(o.s); });
  Object.keys(f.pk).forEach(function (id) { if (typeof f.pk[id] !== 'string') delete f.pk[id]; });
  if (Array.isArray(s.custom)) f.custom = s.custom.filter(function (c) { return c && c.id && c.n && Array.isArray(c.s); }).map(function (c) {
    if (c.s.length !== NG) c.s = fitS(c.s);
    /* backups antigos: o Ritos marcava "vamp", o Coro marcava "angel" */
    if ((c.vamp || c.angel) && TRIBO && !(c.mk && c.mk.tribo)) { c.mk = c.mk || {}; c.mk.tribo = 1; }
    return c;
  });
  if (Array.isArray(s.swaps)) f.swaps = s.swaps;
  f.img = s.img !== false;
  f.ts = +s.ts || 0;
  return f;
}
function loadState() {
  if (!canStore) return fresh();
  try {
    var r = window.localStorage.getItem(KEY);
    if (!r && OLDKEY) r = window.localStorage.getItem(OLDKEY);   /* o que foi salvo pelo painel antigo deste deck */
    return r ? normalize(JSON.parse(r)) : fresh();
  } catch (e) { return fresh(); }
}
var remote = null, remoteBusy = false, remoteDirty = false, remoteT = null;
function saveLocal() {
  if (!canStore) return;
  try { window.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sem espaço ou bloqueado: segue em memória */ }
}
function pushRemote() {
  if (!remote) return;
  if (remoteBusy) { remoteDirty = true; return; }
  remoteBusy = true; remoteDirty = false;
  var done = function () { remoteBusy = false; if (remoteDirty) pushRemote(); };
  /* uma gravação por vez; se a conta não puder gravar, para de tentar e segue só no navegador */
  remote.set({ v: 1, ts: S.ts || Date.now(), json: JSON.stringify(S) }).then(done, function () { remote = null; updStoreNote(); done(); });
}
function save() {
  S.ts = Date.now();
  saveLocal();
  if (remote) { clearTimeout(remoteT); remoteT = setTimeout(pushRemote, 700); }
}
function initRemote() {
  if (!PUB || !window.Promise) return;
  Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function (r) {
    var db = r[0], user = r[1];
    if (!db || !user) return null;
    return user.id().then(function (id) {
      if (!id) return null;
      var ref = db.collection('data/users/' + id).doc('painel');
      return ref.get().then(function (snap) {
        var ex = snap ? (typeof snap.exists === 'function' ? snap.exists() : snap.exists) : false;
        var d = ex ? snap.data() : null, rs = null;
        if (d && typeof d.json === 'string') { try { rs = normalize(JSON.parse(d.json)); rs.ts = +d.ts || rs.ts || 0; } catch (e) { rs = null; } }
        remote = ref;
        if (rs && rs.ts > (S.ts || 0)) { S = rs; saveLocal(); render(); }
        else if (S.ts && (!rs || S.ts > rs.ts)) pushRemote();
        updStoreNote();
      });
    });
  }).catch(function () { /* sem armazenamento na conta: segue no navegador */ });
}
function storeTxt() {
  if (remote) return 'Suas alterações ficam salvas na sua conta, junto deste artefato. Use Backup para guardar uma versão ou levar o painel a outro lugar.';
  if (canStore) return 'Suas alterações ficam salvas neste navegador. Use Backup para levar o painel a outro lugar.';
  return 'Aqui as alterações valem enquanto a página estiver aberta. Para guardá-las, baixe o arquivo e abra no navegador, ou use Backup.';
}
function updStoreNote() { var n = $('#storeNote'); if (n) n.textContent = storeTxt(); }
var S = loadState();
var ui = { tab: 'geral', curve: 'tipo', q: '', fg: -1, ft: '', fr: '', sort: { k: 'n', d: 1 }, grouped: true,
           tierType: '', tierLands: false, tierView: '', ctrlLands: false, drawer: null, modal: null, first: true, confirmReset: false,
           galBy: 'tipo', galLands: false, face: 0, narrow: false, poolAll: false, of: {} };

/* ============ utilidades ============ */
function $(s, el) { return (el || document).querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
function fmt(n, d) { return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }); }
function pl(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
function lista(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1]; }
function msym(sym) {
  var cls = 'ms', lab = sym, st = '';
  if (sym === 'W' || sym === 'B' || sym === 'C' || sym === 'U' || sym === 'R' || sym === 'G') cls += ' ms-' + sym;
  else if (sym.indexOf('/') > 0) {
    var cs = sym.split('/').filter(function (ch) { return PIP[ch]; });
    if (cs.length === 2) { cls += ' ms-H'; lab = ''; st = ' style="background:linear-gradient(135deg,' + PIP[cs[0]] + ' 0 50%,' + PIP[cs[1]] + ' 50% 100%)"'; }
    else if (cs.length === 1) { cls += ' ms-' + cs[0]; lab = sym.indexOf('P') >= 0 ? 'φ' : sym.split('/')[0]; }
  }
  return '<i class="' + cls + '"' + st + '>' + esc(lab) + '</i>';
}
function mana(cost) {
  if (!cost) return '';
  var syms = [];
  var h = cost.replace(/\{([^}]+)\}/g, function (m, s) { syms.push(s); return msym(s); });
  return '<span class="mana" role="img" aria-label="Custo ' + esc(syms.join(' ')) + '">' + h + '</span>';
}
function rich(t) { return esc(t).replace(/\{([^}]+)\}/g, function (m, s) { return '<span class="mana">' + msym(s) + '</span>'; }); }
function colOf(k) { for (var i = 0; i < COLS.length; i++) if (COLS[i].k === k) return COLS[i]; return { k: k, n: k, c: '#9aa3ad' }; }
function artigo() { return M.artigo === 'a' ? 'a' : 'o'; }
function fts(ts) { var d = new Date(ts), p = function (n) { return (n < 10 ? '0' : '') + n; }; return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ', ' + p(d.getHours()) + ':' + p(d.getMinutes()); }

/* ============ cartas ============ */
function cands() { return D.cands.concat(S.custom); }
function poolById(id) { var p = D.pool || []; for (var i = 0; i < p.length; i++) if (p[i].id === id) return p[i]; return null; }
/* potenciais: cartas da leitura da comunidade que ainda não estão no deck nem no radar */
function poolOpen() {
  var have = {}; D.cards.concat(cands()).forEach(function (c) { have[c.id] = 1; });
  return (D.pool || []).filter(function (p) { return !have[p.id]; });
}
function E(c) {
  var o = S.ov[c.id] || {};
  var e = {}; for (var k in c) e[k] = c[k];
  e.s = (o.s || c.s).slice(); e.tier = o.tier || c.tier; e.rel = o.rel || c.rel;
  e.pet = !!o.pet; e.val = (o.val == null ? null : o.val); e.q = c.q || 1;
  e.edited = !!(o.s || o.tier || o.rel);
  if (c.cand) e.verdict = o.verdict || c.verdict || 'avaliar';
  e.nota = o.nota || ''; e.tem = !!o.tem;
  e.inDeck = c.cand ? !!S.inn[c.id] : !S.out[c.id];
  e.mk = c.mk || {};
  return e;
}
function byId(id) {
  var all = D.cards.concat(cands());
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return E(all[i]);
  return null;
}
function deck() { return D.cards.concat(cands()).map(E).filter(function (c) { return c.inDeck; }); }
function gv(c, i) { return (c.s[i] || 0) + (i === IPET && c.pet ? 1 : 0); }
function usdOf(c) { var u = c.foil && c.usdf ? +c.usdf : (c.usd ? +c.usd : null); return isNaN(u) ? null : u; }
function pts(c) { var t = 0; for (var i = 0; i < NG; i++) t += gv(c, i); return t; }
function ov(id) { if (!S.ov[id]) S.ov[id] = {}; return S.ov[id]; }
function pips(cost) {
  var n = {}; WUBRG.forEach(function (ch) { n[ch] = 0; });
  (cost || '').replace(/\{([^}]+)\}/g, function (m, s) {
    var cs = s.split('/').filter(function (ch) { return n[ch] != null; });
    cs.forEach(function (ch) { n[ch] += 1 / cs.length; });
  });
  return n;
}

function stats(cs) {
  var st = { n: 0, nonland: 0, cmcSum: 0, curve: [], types: {}, cols: {}, rel: {}, relVal: {}, relValN: {}, tier: {}, grp: [], usd: 0, usdN: 0, usdSem: 0, relUsd: {},
             pip: {}, src: {}, pw: {}, srcC: 0, lands: 0, mdfc: 0, tapped: 0, cri: 0, tribo: 0, wipes: 0, mk: {},
             foils: 0, sets: {}, low: 0, top: 0 };
  var i;
  for (i = 0; i < 8; i++) st.curve.push({ n: 0, t: {}, c: {} });
  for (i = 0; i < NG; i++) st.grp.push({ hard: 0, soft: 0, pts: 0 });
  Object.keys(MK).forEach(function (k) { st.mk[k] = { n: 0, v: {}, names: [] }; });
  WUBRG.forEach(function (ch) { st.pip[ch] = 0; st.src[ch] = 0; st.pw[ch] = [0, 0, 0, 0]; });
  cs.forEach(function (c) {
    var q = c.q;
    st.n += q;
    st.types[c.t] = (st.types[c.t] || 0) + q;
    st.rel[c.rel] = (st.rel[c.rel] || 0) + q;
    st.tier[c.tier] = (st.tier[c.tier] || 0) + q;
    if (c.val != null) { st.relVal[c.rel] = (st.relVal[c.rel] || 0) + c.val * q; st.relValN[c.rel] = (st.relValN[c.rel] || 0) + q; }
    if (c.foil) st.foils += q;
    var u = usdOf(c);
    if (u != null) { st.usd += u * q; st.usdN += q; st.relUsd[c.rel] = (st.relUsd[c.rel] || 0) + u * q; } else st.usdSem += q;
    if (c.set) st.sets[c.set] = (st.sets[c.set] || 0) + q;
    for (var j = 0; j < NG; j++) {
      var v = gv(c, j); st.grp[j].pts += v * q;
      if (v >= 2) st.grp[j].hard += q; else if (v === 1) st.grp[j].soft += q;
    }
    if (c.land) {
      st.lands += q; if (c.tapped) st.tapped += q;
    } else {
      st.nonland += q; st.cmcSum += c.cmc * q;
      var b = st.curve[Math.min(c.cmc, 7)];
      b.n += q; b.t[c.t] = (b.t[c.t] || 0) + q; b.c[c.col] = (b.c[c.col] || 0) + q;
      st.cols[c.col] = (st.cols[c.col] || 0) + q;
      if (c.cmc <= 2) st.low += q;
      if (c.cmc >= 5) st.top += q;
      if (c.mdfc) st.mdfc += q;
      var pn = pips(c.cost);
      WUBRG.forEach(function (ch) { st.pip[ch] += pn[ch] * q; st.pw[ch][Math.min(3, Math.ceil(pn[ch]))] += q; });
    }
    if (c.land || c.mdfc) {
      var cor = false;
      WUBRG.forEach(function (ch) { if (c.prod && c.prod.indexOf(ch) >= 0) { st.src[ch] += q; cor = true; } });
      if (!cor && c.land) st.srcC += q;
    }
    if (c.t === 'cri') { st.cri += q; if (c.mk.tribo) st.tribo += q; }
    if (c.wipe) st.wipes += q;
    Object.keys(c.mk).forEach(function (k) {
      var x = st.mk[k], v = c.mk[k]; if (!x || !v) return;
      x.n += q; x.v[v] = (x.v[v] || 0) + q; x.names.push(c.n);
    });
  });
  st.avg = st.nonland ? st.cmcSum / st.nonland : 0;
  var a = st.avg;
  st.cmcPts = a === 0 ? 0 : a < 2 ? 5 : a < 3 ? 4 : a < 4 ? 3 : a < 5 ? 2 : 1;
  st.accX = a ? st.grp[IR].pts / a : 0;
  st.accPts = st.accX < 0 ? 0 : Math.min(90, 5 * (Math.floor(st.accX * 2) + 1));
  st.crit = st.grp.reduce(function (t, g) { return t + g.pts; }, 0);
  st.total = st.cmcPts + st.accPts + st.crit;
  return st;
}
function cutQueue(cs, lands) {
  return cs.filter(function (c) { return !c.cmd && !c.pet && !c.nocut && (!!c.land === !!lands); }).sort(function (a, b) {
    return cutCmp(a, b);
  });
}
function cutCmp(a, b) {
  return (RR[b.rel] - RR[a.rel]) || ((a.pri || 99) - (b.pri || 99)) || (TR[b.tier] - TR[a.tier]) || (pts(a) - pts(b)) || a.n.localeCompare(b.n);
}

/* ============ imagens ============ */
/* Fontes, nesta ordem: o mapa embutido no arquivo (montado pelo /imagens), a imagem exata no servidor do Scryfall,
   o redirecionamento da API e, no fim, a ficha de texto que fica atrás de cada imagem. */
var PACK = (D.img && typeof D.img === 'object') ? D.img : null;
var imgOk = false, imgFailN = 0;
function hasPack() { return !!(PACK && Object.keys(PACK).length); }
function canImg() { return !PUB || hasPack(); }
function imgOn() { return S.img && canImg(); }
function cdn(sid, size, face) { return 'https://cards.scryfall.io/' + size + '/' + face + '/' + sid.charAt(0) + '/' + sid.charAt(1) + '/' + sid + '.jpg'; }
function imgList(c, size, back) {
  var L = [], enc = encodeURIComponent;
  if (PACK) { var p = PACK[c.id + (back ? '|b' : '')]; if (p) L.push(p); }
  if (PUB) return L;
  if (c.sid) L.push(cdn(c.sid, size, back ? 'back' : 'front'));
  L.push((c.set ? 'https://api.scryfall.com/cards/' + enc(c.set.toLowerCase()) + '/' + enc(String(c.num)) + '?format=image' :
    'https://api.scryfall.com/cards/named?format=image&exact=' + enc(c.on || c.n)) + '&version=' + size + (back ? '&face=back' : ''));
  return L;
}
function imgTag(c, size, back) {
  if (!imgOn()) return '';
  var L = imgList(c, size, back); if (!L.length) return '';
  return '<img class="ci" src="' + esc(L[0]) + '" data-alt="' + esc(L.slice(1).join('|')) + '" alt="Carta ' + esc(back && c.back ? c.back.n : c.n) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">';
}
function fbTile(c, back, full) {
  return '<div class="gt-fb"><b>' + esc(back && c.back ? c.back.n : c.n) + '</b>' + (!back && c.cost ? mana(c.cost) : '') + '<span class="l">' + esc(back && c.back ? c.back.line : c.line) + '</span>' +
    (full && !back && c.fx ? '<span class="x">' + rich(c.fx) + '</span>' : '') + '</div>';
}
function imgNoteHtml() {
  if (PUB && !hasPack()) return 'A página publicada bloqueia conteúdo externo, então as imagens das cartas não carregam aqui. Elas aparecem no arquivo baixado e aberto no navegador, com internet.';
  if (!imgOn()) return 'Imagens desligadas. O painel funciona inteiro sem elas.';
  if (hasPack()) return 'Imagens das cartas embutidas no arquivo: aparecem mesmo sem internet.';
  if (imgOk) return 'Imagens do Scryfall, na impressão exata da sua lista.';
  if (imgFailN) return 'As imagens do Scryfall não carregaram: sem internet, ou este ambiente bloqueia conteúdo externo. O resto do painel funciona igual.' +
    '<button class="linkish" data-act="img-retry" data-fid="ir">Tentar de novo</button>';
  return 'As imagens vêm do Scryfall e pedem internet.';
}
function updImgNote() { document.querySelectorAll('[data-imgnote]').forEach(function (n) { n.innerHTML = imgNoteHtml(); }); }
var peekEl = null, peekT = null, mx = 0, my = 0;
var canHover = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
function hidePeek() { clearTimeout(peekT); peekEl = null; var p = $('#peek'); if (p) { p.hidden = true; p.innerHTML = ''; } }
function showPeek(el) {
  var id = el.getAttribute('data-card') || el.getAttribute('data-pool'), c = byId(id) || poolById(id), p = $('#peek'); if (!c || !p || !imgOn()) return;
  var W = 250, H = 350, vw = window.innerWidth, vh = window.innerHeight;
  var x = mx + 22; if (x + W > vw - 8) x = mx - W - 22; if (x < 8) x = 8;
  var y = Math.max(8, Math.min(vh - H - 8, my - H / 2));
  p.style.left = x + 'px'; p.style.top = y + 'px';
  p.hidden = true; p.innerHTML = imgTag(c, 'normal', false).replace('loading="lazy"', 'loading="eager"');
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
    (o.moved ? '<span class="edt" title="Movida por você nesta aba"></span>' : '') +
    (o.tier ? '<span class="tb sm t' + c.tier + '">' + c.tier + '</span>' : '') +
    (o.pts ? '<span class="p">' + pts(c) + '</span>' : '') +
    '</div>';
}
function tile(c) {
  return '<div class="chip tile c-' + esc(c.col) + '" role="button" tabindex="0" draggable="true" data-card="' + esc(c.id) + '" title="' + esc(c.n + ' — ' + c.line) + '">' +
    '<span class="tile-i">' + fbTile(c) + imgTag(c, 'small', false) + '<span class="tile-b">' + (c.q > 1 ? '<span class="tile-q">×' + c.q + '</span>' : '') +
    (c.foil ? '<span class="foil" title="Foil">✦</span>' : '') + (c.pet ? '<span class="pet" title="PetCard">♥</span>' : '') +
    (c.edited ? '<span class="edt" title="Avaliação alterada por você"></span>' : '') + '<span class="p">' + pts(c) + '</span></span></span>' +
    '<span class="tile-n">' + esc(c.n) + '</span></div>';
}
function tierB(t, sm) { return '<span class="tb' + (sm ? ' sm' : '') + ' t' + t + '">' + t + '</span>'; }
function relB(r) { return '<span class="rb rb-' + r + '">' + RELS[RR[r]].l + '</span>'; }

/* ============ gráfico dos agrupamentos ============ */
function pol(r, a) { var t = a * Math.PI / 180; return (230 + r * Math.cos(t)).toFixed(1) + ' ' + (230 + r * Math.sin(t)).toFixed(1); }
function petalPath(r0, r1, a0, a1) {
  var am = (a0 + a1) / 2, sh = r0 + (r1 - r0) * 0.72, cr = sh + (r1 - sh) * 0.86;
  return 'M' + pol(r0, a0) + 'L' + pol(sh, a0) + 'Q' + pol(cr, a0 + (am - a0) * 0.1) + ' ' + pol(r1, am) +
    'Q' + pol(cr, a1 - (a1 - am) * 0.1) + ' ' + pol(sh, a1) + 'L' + pol(r0, a1) + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + pol(r0, a0) + 'Z';
}
function wedgePath(r0, r1, a0, a1) {
  return 'M' + pol(r0, a0) + 'L' + pol(r1, a0) + 'A' + r1.toFixed(1) + ' ' + r1.toFixed(1) + ' 0 0 1 ' + pol(r1, a1) + 'L' + pol(r0, a1) + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + pol(r0, a0) + 'Z';
}
function thornPath(r0, r1, a0, a1) {
  // espinho curvo: base larga no anel da haste e ponta fina desviada, como numa coroa de espinhos
  var d = a1 - a0, tip = a0 + d * 0.62, h = r1 - r0;
  return 'M' + pol(r0, a0) + 'Q' + pol(r0 + h * 0.45, a0 + d * 0.30) + ' ' + pol(r1, tip) +
    'Q' + pol(r0 + h * 0.38, a1 - d * 0.02) + ' ' + pol(r0, a1) + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + pol(r0, a0) + 'Z';
}
function fangPath(r0, r1, a0, a1) {
  // presa de serpente: base larga no anel, curva suave e ponta fina
  var d = a1 - a0, tip = a0 + d * 0.55, h = r1 - r0;
  return 'M' + pol(r0, a0) + 'C' + pol(r0 + h * 0.5, a0 + d * 0.05) + ' ' + pol(r0 + h * 0.85, tip - d * 0.12) + ' ' + pol(r1, tip) +
    'C' + pol(r0 + h * 0.8, tip + d * 0.02) + ' ' + pol(r0 + h * 0.45, a1 - d * 0.02) + ' ' + pol(r0, a1) + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + pol(r0, a0) + 'Z';
}
function crownPath(r0, r1, a0, a1) {
  // ponta de coroa: base reta no aro e lados levemente côncavos até a ponta
  var d = a1 - a0, am = (a0 + a1) / 2, h = r1 - r0;
  return 'M' + pol(r0, a0) + 'Q' + pol(r0 + h * 0.55, a0 + d * 0.32) + ' ' + pol(r1, am) +
    'Q' + pol(r0 + h * 0.55, a1 - d * 0.32) + ' ' + pol(r0, a1) + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + pol(r0, a0) + 'Z';
}
function vialPath(r0, R, a0, a1) {
  // frasco de Sangue: fundo redondo perto do centro, corpo que se alarga até o ombro, gargalo e boca. Larguras em pixels,
  // para o vidro não abrir como fatia
  var am = (a0 + a1) / 2, d = (a1 - a0) / 2 * Math.PI / 180, h = R - r0;
  var w0 = Math.min(24, (r0 + 10) * Math.sin(d) * 0.92), w1 = w0 * 1.3, wn = w0 * 0.5, wl = w0 * 0.68;
  var rb = r0 + w0 + 2, rs = r0 + h * 0.66, rn = r0 + h * 0.82;
  function pt(r, w) { return pol(r, am + w / r * 180 / Math.PI); }
  return 'M' + pt(rb, -w0) + 'L' + pt(rs, -w1) + 'Q' + pt(rn, -w1) + ' ' + pt(rn, -wn) + 'L' + pt(R - 6, -wn) + 'L' + pt(R - 6, -wl) + 'L' + pt(R, -wl) +
    'L' + pt(R, wl) + 'L' + pt(R - 6, wl) + 'L' + pt(R - 6, wn) + 'L' + pt(rn, wn) + 'Q' + pt(rn, w1) + ' ' + pt(rs, w1) + 'L' + pt(rb, w0) +
    'C' + pt(rb - w0 * 1.33, w0) + ' ' + pt(rb - w0 * 1.33, -w0) + ' ' + pt(rb, -w0) + 'Z';
}
function stonePath(r0, R, a0, a1) {
  // pedra rúnica: base reta perto do centro, lados que se alargam um pouco e topo arredondado. Larguras em pixels
  var am = (a0 + a1) / 2, d = (a1 - a0) / 2 * Math.PI / 180;
  var w0 = Math.min(24, (r0 + 8) * Math.sin(d) * 0.9), w1 = Math.min(w0 * 1.35, R * Math.sin(d) * 0.85), rt = R - w1 * 0.9;
  function pt(r, w) { return pol(r, am + w / r * 180 / Math.PI); }
  return 'M' + pt(r0 + 2, -w0) + 'L' + pt(rt, -w1) + 'Q' + pt(R, -w1) + ' ' + pt(R, 0) + 'Q' + pt(R, w1) + ' ' + pt(rt, w1) + 'L' + pt(r0 + 2, w0) + 'Z';
}
function lanternPath(cx, cy) {
  // a lanterna da Tergrid: argola, tampa e gaiola hexagonal
  return 'M' + (cx - 5) + ' ' + (cy - 34) + 'a5 5 0 1 1 10 0' + 'M' + (cx - 12) + ' ' + (cy - 26) + 'H' + (cx + 12) + 'L' + (cx + 17) + ' ' + (cy - 14) + 'V' + (cy + 14) +
    'L' + (cx + 10) + ' ' + (cy + 24) + 'H' + (cx - 10) + 'L' + (cx - 17) + ' ' + (cy + 14) + 'V' + (cy - 14) + 'Z' + 'M' + cx + ' ' + (cy - 26) + 'V' + (cy + 24);
}
function shellPts(r0, R, a0, a1) {
  // casco de tartaruga visto de cima: um oval no setor, com o eixo comprido no raio. Medidas em pixels, no sistema do setor
  var am = (a0 + a1) / 2, d = (a1 - a0) / 2 * Math.PI / 180, ri = r0 + 4, L = (R - ri) / 2, rc = ri + L;
  var W = Math.min(L * 0.8, rc * Math.sin(d) * 0.92);
  return { am: am, rc: rc, L: L, W: W, pt: function (r, w) { return pol(r, am + w / r * 180 / Math.PI); } };
}
function shellPath(s, f) {
  // o oval em quatro curvas; f encolhe (0,8 é a borda interna, onde começam as placas da margem)
  var k = 0.5523, L = s.L * f, W = s.W * f, rc = s.rc, p = s.pt;
  return 'M' + p(rc - L, 0) + 'C' + p(rc - L, -k * W) + ' ' + p(rc - k * L, -W) + ' ' + p(rc, -W) + 'C' + p(rc + k * L, -W) + ' ' + p(rc + L, -k * W) + ' ' + p(rc + L, 0) +
    'C' + p(rc + L, k * W) + ' ' + p(rc + k * L, W) + ' ' + p(rc, W) + 'C' + p(rc - k * L, W) + ' ' + p(rc - L, k * W) + ' ' + p(rc - L, 0) + 'Z';
}
function shellPlates(s) {
  // as placas: três vertebrais hexagonais no eixo, as costais saindo das junções e as marginais na borda
  var p = s.pt, L = s.L, W = s.W, rc = s.rc, h = L * 0.25, w = W * 0.36, hex = [], lines = '';
  function wi(r) { var u = (r - rc) / (0.8 * L); return 0.8 * W * Math.sqrt(Math.max(0, 1 - u * u)); }
  [-0.5, 0, 0.5].forEach(function (o) {
    var r = rc + o * L;
    hex.push({ r: r, d: 'M' + p(r - h, -0.55 * w) + 'L' + p(r, -w) + 'L' + p(r + h, -0.55 * w) + 'L' + p(r + h, 0.55 * w) + 'L' + p(r, w) + 'L' + p(r - h, 0.55 * w) + 'Z' });
  });
  [-0.25, 0.25].forEach(function (o) {
    var r = rc + o * L;
    lines += 'M' + p(r, -0.55 * w) + 'L' + p(r, -wi(r)) + 'M' + p(r, 0.55 * w) + 'L' + p(r, wi(r));
  });
  for (var t = 15; t < 360; t += 30) {
    var c = Math.cos(t * Math.PI / 180), sn = Math.sin(t * Math.PI / 180);
    lines += 'M' + p(rc + 0.8 * L * c, 0.8 * W * sn) + 'L' + p(rc + L * c, W * sn);
  }
  return { hex: hex, lines: lines + shellPath(s, 0.8) };
}
function fanPts(r0, R, a0, a1) {
  // raio art déco: três degraus que se alargam para fora, como as lâminas de um leque, e o topo em arco
  var am = (a0 + a1) / 2, d = (a1 - a0) / 2 * Math.PI / 180, ri = r0 + 2, ra = r0 + (R - r0) * 0.38, rb = r0 + (R - r0) * 0.7;
  return { am: am, ri: ri, ra: ra, rb: rb, R: R, h1: ri * Math.sin(d) * 0.9, h2: ra * Math.sin(d) * 0.9, h3: rb * Math.sin(d) * 0.9,
    pt: function (r, w) { return pol(r, am + w / r * 180 / Math.PI); } };
}
function fanPath(f) {
  var p = f.pt;
  return 'M' + p(f.ri, -f.h1) + 'L' + p(f.ra, -f.h1) + 'L' + p(f.ra, -f.h2) + 'L' + p(f.rb, -f.h2) + 'L' + p(f.rb, -f.h3) + 'L' + p(f.R, -f.h3) +
    'Q' + p(f.R + 9, 0) + ' ' + p(f.R, f.h3) + 'L' + p(f.rb, f.h3) + 'L' + p(f.rb, f.h2) + 'L' + p(f.ra, f.h2) + 'L' + p(f.ra, f.h1) + 'L' + p(f.ri, f.h1) + 'Z';
}
function pearlsSvg(r) {
  // o colar de pérolas da Evelyn em volta do placar, com o pingente embaixo
  var o = '', n = 30, k, pp;
  for (k = 0; k < n; k++) {
    pp = pol(r, k * 360 / n - 90).split(' ');
    o += '<circle cx="' + pp[0] + '" cy="' + pp[1] + '" r="2.6" style="fill:rgba(var(--gold2-rgb),.85);stroke:rgba(0,0,0,.35)" stroke-width=".6"/>';
  }
  pp = pol(r + 1, 90).split(' ');
  return o + '<circle cx="' + pp[0] + '" cy="' + (+pp[1] + 4) + '" r="5" style="fill:rgb(var(--blood-rgb));stroke:rgba(var(--gold2-rgb),.9)" stroke-width="1.2"/>';
}
function moonPhase(cx, cy, mr, f) {
  // a parte acesa de uma lua crescente que enche da direita: f de 0 (nova) a 1 (cheia)
  var rx = Math.abs(1 - 2 * f) * mr, top = cx.toFixed(1) + ' ' + (cy - mr).toFixed(1), bot = cx.toFixed(1) + ' ' + (cy + mr).toFixed(1);
  return 'M' + top + 'A' + mr + ' ' + mr + ' 0 0 1 ' + bot + 'A' + rx.toFixed(1) + ' ' + mr + ' 0 0 ' + (f > 0.5 ? 1 : 0) + ' ' + top + 'Z';
}
function clawsSvg(y) {
  // os três entalhes de garra no alto da lua do placar, um por lobo da condição da noite
  return [-14, 0, 14].map(function (dx) { var x = 230 + dx; return '<path d="M' + (x - 3) + ' ' + y + 'Q' + (x + 1) + ' ' + (y + 9) + ' ' + (x + 4) + ' ' + (y + 19) + '" style="fill:none;stroke:rgb(var(--blood2-rgb))" stroke-width="2.6" stroke-linecap="round"/>'; }).join('');
}
function boltPath(r0, r1, a0, a1) {
  // raio: base larga perto do centro, um zigue-zague no meio e a ponta fina para fora. Larguras em pixels
  var am = (a0 + a1) / 2, d = (a1 - a0) / 2 * Math.PI / 180, W = Math.min(30, (r0 + 12) * Math.sin(d) * 1.05), ri = r0 + 2, h = r1 - ri;
  function pt(u, v) { var r = ri + u * h; return pol(r, am + v * W / r * 180 / Math.PI); }
  return 'M' + pt(0, -0.25) + 'L' + pt(0, 0.45) + 'L' + pt(0.48, 0.1) + 'L' + pt(0.48, 0.45) + 'L' + pt(1, -0.35) + 'L' + pt(0.56, -0.05) + 'L' + pt(0.56, -0.4) + 'Z';
}
function eyeStormSvg(r) {
  // o olho da tempestade atrás do placar: duas espirais de nuvem em volta do centro
  var o = '', k;
  for (k = 0; k < 2; k++) {
    var a = k * 180, p0 = pol(r * 0.95, a - 90), p1 = pol(r * 0.55, a + 10), p2 = pol(r * 0.25, a + 100);
    o += '<path d="M' + p0 + 'Q' + pol(r * 0.95, a) + ' ' + p1 + 'Q' + pol(r * 0.4, a + 60) + ' ' + p2 + '" style="fill:none;stroke:rgba(var(--gold-rgb),.28)" stroke-width="5" stroke-linecap="round"/>';
  }
  return o;
}
function bubbleSvg(cx, cy, r, tx, ty) {
  // balão de fala de quadrinho, com o rabicho apontando para o centro
  var dx = tx - cx, dy = ty - cy, L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L, px = -uy, py = ux;
  var b1x = cx + ux * r * 0.82 + px * r * 0.32, b1y = cy + uy * r * 0.82 + py * r * 0.32, b2x = cx + ux * r * 0.82 - px * r * 0.32, b2y = cy + uy * r * 0.82 - py * r * 0.32;
  var tipx = cx + ux * (r + 12), tipy = cy + uy * (r + 12);
  return 'M' + b1x.toFixed(1) + ' ' + b1y.toFixed(1) + 'L' + tipx.toFixed(1) + ' ' + tipy.toFixed(1) + 'L' + b2x.toFixed(1) + ' ' + b2y.toFixed(1) +
    'A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 1 0 ' + b1x.toFixed(1) + ' ' + b1y.toFixed(1) + 'Z';
}
function poolMaskSvg(y) {
  // a máscara do Deadpool espiando por cima do placar: os dois remendos pretos com os olhos brancos
  return [[-1, 212], [1, 248]].map(function (q) {
    var x = q[1], s = q[0];
    return '<path d="M' + (x - 13 * s) + ' ' + (y + 2) + 'Q' + x + ' ' + (y - 9) + ' ' + (x + 13 * s) + ' ' + (y - 2) + 'Q' + (x + 11 * s) + ' ' + (y + 13) + ' ' + (x - 13 * s) + ' ' + (y + 2) + 'Z" style="fill:rgb(var(--ink-rgb))"/>' +
      '<path d="M' + (x - 7 * s) + ' ' + (y + 3) + 'Q' + x + ' ' + (y - 2) + ' ' + (x + 7 * s) + ' ' + (y + 1) + '" style="fill:none;stroke:rgba(255,255,255,.92)" stroke-width="2.4" stroke-linecap="round"/>';
  }).join('');
}
function gogglesSvg(y) {
  // os óculos de aviadora da Braids no alto do placar: duas lentes azuis e a tira
  return '<path d="M180 ' + y + 'H280" style="stroke:rgba(var(--gold-rgb),.5)" stroke-width="3"/>' +
    [214, 246].map(function (x) { return '<circle cx="' + x + '" cy="' + y + '" r="11" style="fill:rgba(var(--blood-rgb),.85);stroke:rgba(var(--gold-rgb),.85)" stroke-width="2.2"/>' +
      '<circle cx="' + (x - 4) + '" cy="' + (y - 4) + '" r="3" style="fill:rgba(255,255,255,.55)"/>'; }).join('');
}
function leafShape(bx, by, ang, L, W) {
  // folha de ponta fina: duas curvas da base à ponta, com a nervura no meio. W é o dobro da largura máxima
  var t = ang * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
  function q(u, v) { return (bx + u * c - v * s).toFixed(1) + ' ' + (by + u * s + v * c).toFixed(1); }
  return { d: 'M' + q(0, 0) + 'Q' + q(L * 0.45, -W) + ' ' + q(L, 0) + 'Q' + q(L * 0.45, W) + ' ' + q(0, 0) + 'Z', rib: 'M' + q(1, 0) + 'L' + q(L * 0.8, 0) };
}
function wreathSvg(r) {
  // a coroa de dez folhas em volta do placar: os dez Elfos que a Lathril vira
  var d = '', k;
  for (k = 0; k < 10; k++) {
    var a = k * 36 - 90, b = pol(r, a - 8).split(' ');
    d += leafShape(+b[0], +b[1], a + 76, 16, 9).d;
  }
  return '<circle cx="230" cy="230" r="' + r + '" style="fill:none;stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>' +
    '<path d="' + d + '" style="fill:rgba(var(--gold2-rgb),.5);stroke:rgba(var(--gold-rgb),.7)" stroke-width=".8"/>';
}
function eggPath(a, b) {
  // ovo deitado no eixo x: a base redonda em -a, a ponta mais fina em +a; a largura real fica perto de 0,75 de b
  return 'M' + (-a) + ' 0C' + (-a) + ' ' + (-b * 1.05).toFixed(1) + ' ' + (a * 0.45).toFixed(1) + ' ' + (-b * 0.95).toFixed(1) + ' ' + a + ' 0' +
    'C' + (a * 0.45).toFixed(1) + ' ' + (b * 0.95).toFixed(1) + ' ' + (-a) + ' ' + (b * 1.05).toFixed(1) + ' ' + (-a) + ' 0Z';
}
function eggCracks(a, b, k) {
  // até quatro rachaduras em zigue-zague, saindo da ponta e abrindo em direções diferentes para dentro do ovo
  var y0 = [-0.05, 0.05, -0.12, 0.12], y1 = [-0.42, 0.36, -0.1, 0.12], x1 = [0.05, 0.1, -0.2, -0.05], d = '', j, s;
  for (j = 0; j < k; j++) {
    var xa = a * 0.86, ya = y0[j] * b, xb = a * x1[j], yb = y1[j] * b;
    d += 'M' + xa.toFixed(1) + ' ' + ya.toFixed(1);
    for (s = 1; s <= 4; s++) {
      var t = s / 4, zx = xa + (xb - xa) * t, zy = ya + (yb - ya) * t + (s < 4 ? (s % 2 ? 3.5 : -3.5) : 0);
      d += 'L' + zx.toFixed(1) + ' ' + zy.toFixed(1);
    }
  }
  return d;
}
function clawSvg(x, a, b) {
  // a garra de Sliver saindo do ovo que eclodiu: três espinhos curvos para fora, do tamanho do ovo
  return [-0.3, 0, 0.3].map(function (f, j) {
    var y = f * b, L = a * (j === 1 ? 0.62 : 0.48), w = b * 0.11, s = j === 0 ? -1 : j === 2 ? 1 : 0;
    return '<path d="M' + x.toFixed(1) + ' ' + (y - w).toFixed(1) + 'Q' + (x + L * 0.55).toFixed(1) + ' ' + (y - w + s * 4).toFixed(1) + ' ' + (x + L).toFixed(1) + ' ' + (y + s * 9).toFixed(1) +
      'Q' + (x + L * 0.5).toFixed(1) + ' ' + (y + w * 0.6 + s * 3).toFixed(1) + ' ' + x.toFixed(1) + ' ' + (y + w).toFixed(1) + 'Z" style="fill:rgb(var(--blood2-rgb));stroke:rgba(var(--deep-rgb),.75)" stroke-width="1.1"/>';
  }).join('');
}
function cascadeSvg(r) {
  // a cadeia da cascata no alto do placar: cinco elos que diminuem
  var o = '<path d="M' + pol(r, -150) + 'A' + r + ' ' + r + ' 0 0 1 ' + pol(r, -30) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>';
  [6, 5, 4, 3.2, 2.5].forEach(function (s, j) {
    var p = pol(r, -150 + j * 30).split(' ');
    o += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + s + '" style="fill:rgba(var(--gold2-rgb),' + (0.9 - j * 0.14).toFixed(2) + ');stroke:rgba(var(--deep-rgb),.5)" stroke-width=".8"/>';
  });
  return o;
}
function riftPath(L, W, o) {
  // fenda no céu, deitada no eixo x de 0 a L: uma lente pontuda nas duas pontas, com a borda rasgada em dentes miúdos,
  // que se abre com o fator o (0 a 1). Não é relâmpago: a linha do meio é reta e as duas bordas se espelham
  var n = 16, top = '', bot = '', k;
  for (k = 0; k <= n; k++) {
    var x = (L * k / n).toFixed(1), h = W * Math.pow(Math.sin(Math.PI * k / n), 0.8) * o * (k % 2 ? 0.8 : 1);
    top += (k ? 'L' : 'M') + x + ' ' + (-h).toFixed(1);
  }
  for (k = n; k >= 0; k--) {
    var x2 = (L * k / n).toFixed(1), h2 = W * Math.pow(Math.sin(Math.PI * k / n), 0.8) * o * (k % 2 ? 1 : 0.82);
    bot += 'L' + x2 + ' ' + h2.toFixed(1);
  }
  return top + bot + 'Z';
}
function batWingSvg(x, W) {
  // o par de asas de couro abertas para os lados na ponta da fenda mais aberta: varetas e a membrana em arcos entre elas
  var s = W / 15, o = '';
  [-1, 1].forEach(function (g) {
    var p = function (u, v) { return (x + u * s).toFixed(1) + ' ' + (g * v * s).toFixed(1); };
    o += '<path d="M' + p(0, 0) + 'L' + p(5, 26) + 'Q' + p(8, 19) + ' ' + p(15, 21) + 'Q' + p(13, 14) + ' ' + p(19, 11) + 'Q' + p(12, 7) + ' ' + p(13, 2) + 'Q' + p(6, 3) + ' ' + p(0, 0) + 'Z" style="fill:rgb(var(--blood-rgb));stroke:rgb(var(--blood2-rgb))" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<path d="M' + p(0, 0) + 'L' + p(15, 21) + 'M' + p(0, 0) + 'L' + p(19, 11) + '" style="fill:none;stroke:rgba(var(--blood2-rgb),.75)" stroke-width=".9"/>';
  });
  return o;
}
function sigilSvg(y) {
  // o sigilo mardu da tatuagem da Kaalia, no alto do placar: um anel, o ponto e os raios
  var o = '<circle cx="230" cy="' + y + '" r="7" style="fill:none;stroke:rgb(var(--blood2-rgb))" stroke-width="2"/><circle cx="230" cy="' + y + '" r="2.2" style="fill:rgb(var(--blood2-rgb))"/>', k;
  for (k = 0; k < 8; k++) {
    var a = k * 45 * Math.PI / 180, r1 = 9.5, r2 = k % 2 ? 13 : 16;
    o += '<path d="M' + (230 + r1 * Math.cos(a)).toFixed(1) + ' ' + (y + r1 * Math.sin(a)).toFixed(1) + 'L' + (230 + r2 * Math.cos(a)).toFixed(1) + ' ' + (y + r2 * Math.sin(a)).toFixed(1) + '" style="stroke:rgb(var(--blood2-rgb))" stroke-width="1.8" stroke-linecap="round"/>';
  }
  return o;
}
function coinStack(i, n, h, W, fill) {
  // a pilha de moedas deitada no eixo x: n moedas de espessura h e largura W, cada uma com o aro e um brilho
  var o = '', k;
  for (k = 0; k < n; k++) {
    var x = 8 + k * (h + 2.2), dy = (k % 2 ? 1.2 : -1.2);
    o += '<rect x="' + x.toFixed(1) + '" y="' + (-W / 2 + dy).toFixed(1) + '" width="' + h.toFixed(1) + '" height="' + W.toFixed(1) + '" rx="' + (h / 2).toFixed(1) + '"' +
      (fill ? ' fill="url(#rg' + i + ')" style="stroke:rgba(var(--gold2-rgb),.85)" stroke-width="1.1"' : ' style="fill:rgba(var(--g' + i + '),.05);stroke:rgba(var(--gold-rgb),.3)" stroke-width="1" stroke-dasharray="3 2"') + '/>' +
      (fill ? '<path d="M' + (x + h * 0.5).toFixed(1) + ' ' + (-W / 2 + dy + 3).toFixed(1) + 'L' + (x + h * 0.5).toFixed(1) + ' ' + (W / 2 + dy - 3).toFixed(1) + '" style="stroke:rgba(255,255,255,.35)" stroke-width="1"/>' : '');
  }
  return o;
}
function flipCoinSvg(x, W) {
  // a moeda do topo saltando, girando no ar, com dois traços de movimento
  var ry = W * 0.42;
  return '<ellipse cx="' + x.toFixed(1) + '" cy="0" rx="' + (ry * 0.45).toFixed(1) + '" ry="' + ry.toFixed(1) + '" transform="rotate(28 ' + x.toFixed(1) + ' 0)" style="fill:rgb(var(--gold2-rgb));stroke:rgba(var(--deep-rgb),.7)" stroke-width="1.2"/>' +
    '<path d="M' + (x - 9).toFixed(1) + ' ' + (-ry - 2).toFixed(1) + 'q-6 6 0 12M' + (x - 13).toFixed(1) + ' ' + (ry - 8).toFixed(1) + 'q-6 6 0 12" style="fill:none;stroke:rgba(var(--gold2-rgb),.6)" stroke-width="1.3" stroke-linecap="round"/>';
}
function thumbSvg(y) {
  // o polegar cunhado no alto do placar: o dedo e a unha
  return '<path d="M224 ' + (y + 14) + 'L224 ' + (y + 2) + 'Q224 ' + (y - 7) + ' 230 ' + (y - 7) + 'Q236 ' + (y - 7) + ' 236 ' + (y + 2) + 'L236 ' + (y + 14) + 'Z" style="fill:rgba(var(--blood2-rgb),.9);stroke:rgba(var(--deep-rgb),.8)" stroke-width="1.2"/>' +
    '<path d="M226.5 ' + (y + 1) + 'Q226.5 ' + (y - 4.5) + ' 230 ' + (y - 4.5) + 'Q233.5 ' + (y - 4.5) + ' 233.5 ' + (y + 1) + 'Z" style="fill:rgba(var(--gold2-rgb),.9)"/>';
}
function handSvg(i, t, aw, open, fill) {
  // a mão de Zumbi saindo da cova, deitada no eixo x: o antebraço de 10 até t, a palma e os dedos, abertos ou em garra
  var cor = fill ? 'rgb(var(--g' + i + '))' : 'rgba(var(--g' + i + '),.05)', tr = fill ? 'rgba(var(--deep-rgb),.85)' : 'rgba(var(--gold-rgb),.28)',
    da = fill ? '' : ' stroke-dasharray="3 2"', px = t + 6, o, k;
  o = '<path d="M10 ' + (-aw / 2).toFixed(1) + 'L' + t.toFixed(1) + ' ' + (-aw / 2 - 0.8).toFixed(1) + 'L' + t.toFixed(1) + ' ' + (aw / 2 + 0.8).toFixed(1) + 'L10 ' + (aw / 2).toFixed(1) + 'Z" style="fill:' + cor + ';stroke:' + tr + '" stroke-width="1.1"' + da + '/>';
  // os dedos: quatro e o polegar; abertos, em leque; em garra, curtos e dobrados para dentro
  var ang = open ? [-48, -16, 16, 48] : [-30, -10, 10, 30], len = open ? [10, 13, 12.5, 10] : [6, 7.5, 7.5, 6], d = '';
  for (k = 0; k < 4; k++) {
    var a = ang[k] * Math.PI / 180, x0 = px + 6.2 * Math.cos(a), y0 = 6.6 * Math.sin(a), dir = a * (open ? 0.75 : 0.3),
      x1 = x0 + len[k] * Math.cos(dir), y1 = y0 + len[k] * Math.sin(dir);
    d += open ? 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'L' + x1.toFixed(1) + ' ' + y1.toFixed(1)
      : 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'Q' + (x1 + 2).toFixed(1) + ' ' + y1.toFixed(1) + ' ' + (x1 - 1.5).toFixed(1) + ' ' + (y1 * 0.4).toFixed(1);
  }
  var ta = (open ? -112 : -100) * Math.PI / 180, td = (open ? -62 : -80) * Math.PI / 180, tx0 = px + 6.2 * Math.cos(ta), ty0 = 6.6 * Math.sin(ta), tl = open ? 8.5 : 5;
  d += 'M' + tx0.toFixed(1) + ' ' + ty0.toFixed(1) + 'L' + (tx0 + tl * Math.cos(td)).toFixed(1) + ' ' + (ty0 + tl * Math.sin(td)).toFixed(1);
  if (fill) o += '<path d="' + d + '" style="fill:none;stroke:rgba(var(--deep-rgb),.85)" stroke-width="5.2" stroke-linecap="round"/>';
  o += '<path d="' + d + '" style="fill:none;stroke:' + (fill ? 'rgb(var(--g' + i + '))' : 'rgba(var(--gold-rgb),.25)') + '" stroke-width="' + (fill ? 3.2 : 1) + '" stroke-linecap="round"' + da + '/>' +
    '<ellipse cx="' + px.toFixed(1) + '" cy="0" rx="7" ry="7.6" style="fill:' + cor + ';stroke:' + tr + '" stroke-width="1.1"' + da + '/>';
  // o punho esfarrapado da manga
  if (fill && t > 18) o += '<path d="M' + (t - 6).toFixed(1) + ' ' + (-aw / 2 - 2).toFixed(1) + 'l2 3l2 -3l2 3V' + (aw / 2 + 2).toFixed(1) + 'l-2 -3l-2 3l-2 -3Z" style="fill:rgba(var(--wine-rgb),.95);stroke:rgba(var(--deep-rgb),.8)" stroke-width=".8"/>';
  return o;
}
function cleaverSvg(y) {
  // o cutelo da Wilhelt cravado no alto do placar: as línguas de chama azul atrás, a lâmina larga com o furo, o cabo no canto
  return '<g transform="translate(230 ' + y + ') rotate(-28) scale(.95)">' +
    '<path d="M-14 7Q-17 -6 -10 -15Q-8 -6 -3 -10Q-2 -22 4 -26Q6 -14 10 -12Q14 -18 15 -10Q19 -2 15 7Z" style="fill:rgba(var(--gold-rgb),.62)"/>' +
    '<path d="M-14 -6Q-15 -10 -9 -10H-6Q-4 -16 2 -17Q4 -11 9 -10Q12 -14 13 -8" style="fill:none;stroke:rgba(var(--gold2-rgb),.7)" stroke-width="1"/>' +
    '<path d="M-15 -6H11V8Q-2 12 -15 9Z" style="fill:rgba(var(--bone-rgb),.94);stroke:rgba(var(--deep-rgb),.85)" stroke-width="1.2" stroke-linejoin="round"/>' +
    '<path d="M-13 7Q-2 10 9 6.5" style="fill:none;stroke:rgba(255,255,255,.55)" stroke-width="1"/>' +
    '<circle cx="-10" cy="-1.5" r="2" style="fill:var(--sheet2)"/>' +
    '<rect x="10" y="-5" width="3.5" height="6" rx="1" style="fill:rgba(var(--gold2-rgb),.8)"/>' +
    '<path d="M13 -2H27" style="stroke:rgba(var(--wine-rgb),1)" stroke-width="4.4" stroke-linecap="round"/></g>';
}
function gearSvg(i, cx, cy, gR, lit, rot, glow) {
  // a engrenagem de latão: dez dentes ao redor; os acesos, na cor do agrupamento, contam a soma das notas
  var o = '', k, rin = gR * 0.8;
  for (k = 0; k < 10; k++) {
    var t = (rot + k * 36) * Math.PI / 180, a1 = t - 0.16, a2 = t + 0.16, b1 = t - 0.105, b2 = t + 0.105, on = k < lit,
      P = function (r, a) { return (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1); };
    o += '<path d="M' + P(rin - 1, a1) + 'L' + P(gR, b1) + 'L' + P(gR, b2) + 'L' + P(rin - 1, a2) + 'Z"' +
      (on ? ' style="fill:rgb(var(--g' + i + '));stroke:rgba(var(--deep-rgb),.8)" stroke-width="1"' : ' style="fill:rgba(var(--g' + i + '),.06);stroke:rgba(var(--blood-rgb),.35)" stroke-width="1" stroke-dasharray="2 2"') + '/>';
  }
  o += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + rin.toFixed(1) + '" style="fill:rgba(var(--g' + i + '),' + (lit ? '.22' : '.06') + ');stroke:rgba(var(--blood-rgb),.7)" stroke-width="1.4"/>';
  // quatro raios e o cubo; a mais cheia ganha o brilho verde do óleo phyrexiano no cubo
  for (k = 0; k < 4; k++) {
    var u = (rot + 18 + k * 90) * Math.PI / 180;
    o += '<line x1="' + (cx + gR * 0.3 * Math.cos(u)).toFixed(1) + '" y1="' + (cy + gR * 0.3 * Math.sin(u)).toFixed(1) + '" x2="' + (cx + rin * 0.92 * Math.cos(u)).toFixed(1) + '" y2="' + (cy + rin * 0.92 * Math.sin(u)).toFixed(1) + '" style="stroke:rgba(var(--blood-rgb),.55)" stroke-width="2.2" stroke-linecap="round"/>';
  }
  o += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (gR * 0.3).toFixed(1) + '" style="fill:var(--sheet2);stroke:rgb(var(--blood-rgb))" stroke-width="1.4"/>';
  if (glow) o += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (gR * 0.22).toFixed(1) + '" style="fill:rgba(143,207,74,.9)"/>' +
    '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (gR * 0.42).toFixed(1) + '" style="fill:none;stroke:rgba(143,207,74,.45)" stroke-width="3"/>';
  return o;
}
function phyrexianSvg(y) {
  // o símbolo de mana phyrexiana, do custo do K'rrik: o círculo cortado por um traço vertical
  return '<circle cx="230" cy="' + y + '" r="8" style="fill:none;stroke:rgb(var(--gold-rgb))" stroke-width="2.4"/>' +
    '<path d="M230 ' + (y - 13) + 'V' + (y + 13) + '" style="stroke:rgb(var(--gold-rgb))" stroke-width="2.4" stroke-linecap="round"/>';
}
function scrollSvg(i, L, w, fill, seal) {
  // o pergaminho deitado no eixo x: o rolo de madeira na base, a folha que se desenrola até L e o rolo da ponta;
  // linhas de tinta na folha, e o lacre vermelho pendurado no mais cheio
  var x0 = 8, x1 = x0 + L, o = '', k, nl = Math.max(0, Math.floor((L - 8) / 9));
  var rolo = function (x) { return '<rect x="' + (x - 3.2).toFixed(1) + '" y="' + (-w / 2 - 3).toFixed(1) + '" width="6.4" height="' + (w + 6).toFixed(1) + '" rx="3.2" style="fill:rgb(var(--wine-rgb));stroke:rgba(var(--deep-rgb),.85)" stroke-width="1"/>'; };
  if (!fill) return '<rect x="' + x0 + '" y="' + (-w / 2).toFixed(1) + '" width="' + L.toFixed(1) + '" height="' + w.toFixed(1) + '" style="fill:rgba(var(--g' + i + '),.05);stroke:rgba(var(--gold-rgb),.3)" stroke-width="1" stroke-dasharray="3 3"/>';
  o += '<path d="M' + x0 + ' ' + (-w / 2).toFixed(1) + 'L' + x1.toFixed(1) + ' ' + (-w / 2).toFixed(1) + 'L' + x1.toFixed(1) + ' ' + (w / 2).toFixed(1) + 'L' + x0 + ' ' + (w / 2).toFixed(1) + 'Z" style="fill:rgb(var(--g' + i + '));stroke:rgba(var(--deep-rgb),.7)" stroke-width="1"/>';
  for (k = 0; k < nl; k++) {
    var xx = x0 + 6 + k * 9;
    o += '<path d="M' + xx.toFixed(1) + ' ' + (-w / 2 + 3).toFixed(1) + 'V' + (w / 2 - 3 - (k % 2 ? 3 : 0)).toFixed(1) + '" style="stroke:rgba(var(--deep-rgb),.35)" stroke-width="1.2" stroke-linecap="round"/>';
  }
  o += rolo(x0) + rolo(x1);
  if (seal) o += '<path d="M' + (x1 + 1).toFixed(1) + ' ' + (w / 2 - 2).toFixed(1) + 'L' + (x1 + 8).toFixed(1) + ' ' + (w / 2 + 6).toFixed(1) + '" style="stroke:rgb(var(--blood-rgb))" stroke-width="2"/>' +
    '<circle cx="' + (x1 + 10).toFixed(1) + '" cy="' + (w / 2 + 8).toFixed(1) + '" r="6" style="fill:rgb(var(--blood-rgb));stroke:rgba(var(--deep-rgb),.8)" stroke-width="1"/>' +
    '<circle cx="' + (x1 + 10).toFixed(1) + '" cy="' + (w / 2 + 8).toFixed(1) + '" r="3" style="fill:none;stroke:rgba(255,255,255,.45)" stroke-width="1"/>';
  return o;
}
function orbSvg(y) {
  // o orbe azul do cajado do Zur, no alto do placar, com o brilho e três faíscas
  return '<circle cx="230" cy="' + y + '" r="9" style="fill:rgba(var(--gold-rgb),.85);stroke:rgba(var(--deep-rgb),.8)" stroke-width="1.2"/>' +
    '<circle cx="227" cy="' + (y - 3) + '" r="3" style="fill:rgba(255,255,255,.55)"/>' +
    '<path d="M218 ' + (y - 8) + 'l-3 -3M242 ' + (y - 8) + 'l3 -3M230 ' + (y - 12) + 'v-4" style="stroke:rgba(var(--gold-rgb),.8)" stroke-width="1.4" stroke-linecap="round"/>';
}
function spyglassSvg(i, L, w, fill, flare) {
  // a luneta deitada no eixo x: a ocular fina perto do centro, dois tubos que se encaixam e o corpo largo na ponta,
  // com anéis de latão nas juntas e a lente na boca; a mais cheia ganha o brilho na lente
  var x0 = 8, x1 = x0 + L, e1 = x0 + L * 0.28, e2 = x0 + L * 0.6, o = '';
  var tubo = function (a, b, h) { return '<rect x="' + a.toFixed(1) + '" y="' + (-h / 2).toFixed(1) + '" width="' + Math.max(0.5, b - a).toFixed(1) + '" height="' + h.toFixed(1) + '" rx="1.6" style="fill:rgb(var(--g' + i + '));stroke:rgba(var(--deep-rgb),.75)" stroke-width="1"/>'; };
  var anel = function (x, h) { return '<rect x="' + (x - 1.6).toFixed(1) + '" y="' + (-h / 2).toFixed(1) + '" width="3.2" height="' + h.toFixed(1) + '" rx="1" style="fill:var(--gold);stroke:rgba(var(--deep-rgb),.7)" stroke-width=".8"/>'; };
  if (!fill) return '<rect x="' + x0 + '" y="' + (-w / 2).toFixed(1) + '" width="' + L.toFixed(1) + '" height="' + w.toFixed(1) + '" rx="2" style="fill:rgba(var(--g' + i + '),.05);stroke:rgba(var(--gold-rgb),.3)" stroke-width="1" stroke-dasharray="3 3"/>';
  o += tubo(x0, e1, w * 0.5) + tubo(e1, e2, w * 0.74) + tubo(e2, x1, w);
  o += '<path d="M' + (e2 + 3).toFixed(1) + ' ' + (-w / 2 + 2.6).toFixed(1) + 'H' + (x1 - 5).toFixed(1) + '" style="stroke:rgba(255,255,255,.28)" stroke-width="1.4" stroke-linecap="round"/>';
  o += anel(x0, w * 0.5 + 2) + anel(e1, w * 0.74 + 2) + anel(e2, w + 2) + anel(x1 - 2, w + 4);
  o += '<ellipse cx="' + (x1 + 0.6).toFixed(1) + '" cy="0" rx="2" ry="' + (w / 2 - 1).toFixed(1) + '" style="fill:rgba(var(--gold2-rgb),.75);stroke:rgba(var(--deep-rgb),.6)" stroke-width=".8"/>';
  if (flare) o += '<path d="M' + (x1 + 9).toFixed(1) + ' -9l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z" style="fill:var(--gold2)"/>' +
    '<circle cx="' + (x1 + 9).toFixed(1) + '" cy="-3" r="7" style="fill:rgba(var(--gold2-rgb),.16)"/>';
  return o;
}
function monocleSvg(y) {
  // o monóculo de latão da Zara, no alto do placar: aro, lente com brilho e a corrente caindo para o lado
  return '<circle cx="230" cy="' + y + '" r="8.5" style="fill:rgba(255,255,255,.1);stroke:var(--gold)" stroke-width="2.4"/>' +
    '<path d="M225 ' + (y - 3) + 'a6 6 0 0 1 5 -3.4" style="fill:none;stroke:rgba(255,255,255,.55)" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M238.5 ' + (y + 1) + 'q9 6 6 15" style="fill:none;stroke:rgba(var(--gold-rgb),.85)" stroke-width="1.6" stroke-dasharray="1.6 1.8" stroke-linecap="round"/>';
}
function towerSvg(i, L, w, fill, eagle) {
  // o campanário deitado no eixo x: a base perto do centro, o corpo que sobe até L, as janelas em arco que acendem
  // com a altura, a cornija de pedra e as ameias no alto; o mais alto ganha a águia pousada
  var x0 = 8, x1 = x0 + L, o = '', k, nj = Math.max(0, Math.floor((L - 14) / 13)), hw = w / 2;
  if (!fill) return '<rect x="' + x0 + '" y="' + (-hw).toFixed(1) + '" width="' + L.toFixed(1) + '" height="' + w.toFixed(1) + '" style="fill:rgba(var(--g' + i + '),.05);stroke:rgba(var(--gold-rgb),.3)" stroke-width="1" stroke-dasharray="3 3"/>';
  o += '<rect x="' + x0 + '" y="' + (-hw).toFixed(1) + '" width="' + L.toFixed(1) + '" height="' + w.toFixed(1) + '" style="fill:rgb(var(--g' + i + '));stroke:rgba(var(--deep-rgb),.75)" stroke-width="1"/>';
  for (k = 0; k < nj; k++) {
    // janela em arco: a ponta do arco aponta para fora, como o alto da torre
    var xj = x0 + 8 + k * 13, jw = Math.min(5, w * 0.24);
    o += '<path d="M' + xj.toFixed(1) + ' ' + (-jw).toFixed(1) + 'H' + (xj + 5).toFixed(1) + 'A' + jw.toFixed(1) + ' ' + jw.toFixed(1) + ' 0 0 1 ' + (xj + 5).toFixed(1) + ' ' + jw.toFixed(1) + 'H' + xj.toFixed(1) + 'Z" style="fill:rgba(var(--gold2-rgb),.8);stroke:rgba(var(--deep-rgb),.6)" stroke-width=".7"/>';
  }
  o += '<rect x="' + (x1 - 5).toFixed(1) + '" y="' + (-hw - 2).toFixed(1) + '" width="3" height="' + (w + 4).toFixed(1) + '" style="fill:var(--gold);stroke:rgba(var(--deep-rgb),.7)" stroke-width=".8"/>';
  for (k = 0; k < 3; k++) {
    var ym = -hw + k * (w - w / 5) / 2;
    o += '<rect x="' + (x1 - 2).toFixed(1) + '" y="' + ym.toFixed(1) + '" width="5" height="' + (w / 5).toFixed(1) + '" style="fill:rgb(var(--g' + i + '));stroke:rgba(var(--deep-rgb),.75)" stroke-width=".8"/>';
  }
  if (eagle) o += '<path d="M' + (x1 + 6).toFixed(1) + ' 0l7 -8l2.4 4.6l3.2 -2.6l-1.4 6l1.4 6l-3.2 -2.6l-2.4 4.6z" style="fill:var(--gold2);stroke:rgba(var(--deep-rgb),.7)" stroke-width=".8"/>';
  return o;
}
function creedSvg(y) {
  // a insígnia da Irmandade no alto do placar: o "A" em ponta de lança, com o corte do meio
  return '<path d="M230 ' + (y - 11) + 'L242 ' + (y + 9) + 'L236.5 ' + (y + 9) + 'L230 ' + (y - 1) + 'L223.5 ' + (y + 9) + 'L218 ' + (y + 9) + 'Z" style="fill:var(--gold);stroke:rgba(var(--deep-rgb),.8)" stroke-width="1"/>' +
    '<path d="M226 ' + (y + 5) + 'H234" style="stroke:var(--gold)" stroke-width="1.6" stroke-linecap="round"/>';
}
function scalesSvg(i, L, w, lit, flame) {
  // a fileira de escamas deitada no eixo x: escamas em meia-lua que se sobrepõem da base para fora; as primeiras
  // `lit` acendem com a soma das notas, o resto fica tracejado; a mais cheia solta a labareda na ponta
  var x0 = 8, st = 9, n = Math.max(1, Math.floor((L - 4) / st)), hw = w / 2, o = '', k;
  for (k = n - 1; k >= 0; k--) {
    var xk = x0 + k * st, on = k < lit;
    o += '<path d="M' + xk.toFixed(1) + ' ' + (-hw).toFixed(1) + 'A' + (hw * 0.75).toFixed(1) + ' ' + hw.toFixed(1) + ' 0 0 1 ' + xk.toFixed(1) + ' ' + hw.toFixed(1) + 'Z" style="' +
      (on ? 'fill:rgb(var(--g' + i + '));stroke:rgba(var(--deep-rgb),.75)" stroke-width="1"' : 'fill:rgba(var(--g' + i + '),.05);stroke:rgba(var(--gold-rgb),.3)" stroke-width="1" stroke-dasharray="2.5 2.5"') + '/>';
    if (on) o += '<path d="M' + (xk + 2).toFixed(1) + ' ' + (-hw * 0.45).toFixed(1) + 'A' + (hw * 0.4).toFixed(1) + ' ' + (hw * 0.45).toFixed(1) + ' 0 0 1 ' + (xk + 2).toFixed(1) + ' ' + (hw * 0.45).toFixed(1) + '" style="fill:none;stroke:rgba(255,255,255,.22)" stroke-width="1"/>';
  }
  if (flame) {
    var xf = x0 + (lit - 1) * st + hw * 0.75 + 2;
    o += '<path d="M' + xf.toFixed(1) + ' -5q9 -3 15 -11q-1 7 3 10q4 -2 5 -6q3 8 -3 13q6 1 9 -2q-4 9 -14 9q-9 0 -15 -6z" style="fill:var(--blood2);stroke:rgba(var(--deep-rgb),.7)" stroke-width=".8"/>' +
      '<path d="M' + (xf + 3).toFixed(1) + ' -2q6 -1 10 -5q0 4 3 6q-4 4 -13 1z" style="fill:var(--gold2)"/>';
  }
  return o;
}
function dragonEyeSvg(y) {
  // o olho da rainha dragão no alto do placar: íris dourada e pupila em fenda
  return '<path d="M215 ' + y + 'Q230 ' + (y - 15) + ' 245 ' + y + 'Q230 ' + (y + 15) + ' 215 ' + y + 'Z" style="fill:var(--gold2);stroke:rgba(var(--deep-rgb),.85)" stroke-width="1.2"/>' +
    '<ellipse cx="230" cy="' + y + '" rx="1.6" ry="5" style="fill:rgb(var(--deep-rgb))"/>';
}
function maskSvg() {
  // a bandana do Leonardo atrás do placar: a faixa com os dois olhos acesos e as pontas do nó
  var y = 194, e = function (x) { return 'M' + (x - 11) + ' ' + y + 'Q' + x + ' ' + (y - 8) + ' ' + (x + 11) + ' ' + (y - 1) + 'Q' + x + ' ' + (y + 6) + ' ' + (x - 11) + ' ' + y + 'Z'; };
  return '<g clip-path="url(#ckm)">' +
    '<path d="M170 ' + (y - 10) + 'Q230 ' + (y - 16) + ' 290 ' + (y - 10) + 'V' + (y + 10) + 'Q230 ' + (y + 4) + ' 170 ' + (y + 10) + 'Z" style="fill:rgba(var(--blood-rgb),.78)"/>' +
    '<path d="M266 ' + (y + 2) + 'Q276 ' + (y + 18) + ' 279 ' + (y + 32) + 'M262 ' + (y + 6) + 'Q266 ' + (y + 22) + ' 268 ' + (y + 38) + '" style="fill:none;stroke:rgba(var(--blood-rgb),.7)" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="' + e(212) + e(248) + '" style="fill:rgba(var(--bone-rgb),.9)"/></g>';
}
function dropPath(cx, cy, h) {
  // gota de sangue atrás do placar
  return 'M' + cx + ' ' + (cy - h) + 'C' + (cx + h * 0.12) + ' ' + (cy - h * 0.52) + ' ' + (cx + h * 0.62) + ' ' + (cy - h * 0.14) + ' ' + (cx + h * 0.62) + ' ' + (cy + h * 0.26) +
    'A' + (h * 0.62) + ' ' + (h * 0.62) + ' 0 0 1 ' + (cx - h * 0.62) + ' ' + (cy + h * 0.26) + 'C' + (cx - h * 0.62) + ' ' + (cy - h * 0.14) + ' ' + (cx - h * 0.12) + ' ' + (cy - h * 0.52) + ' ' + cx + ' ' + (cy - h) + 'Z';
}
function shardPath(r0, r1, a0, a1) {
  var am = (a0 + a1) / 2, sh = r0 + (r1 - r0) * 0.78;
  return 'M' + pol(r0, a0) + 'L' + pol(sh, a0) + 'L' + pol(r1, am) + 'L' + pol(sh, a1) + 'L' + pol(r0, a1) + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + pol(r0, a0) + 'Z';
}
function flamePath(r0, r1, a0, a1) {
  // língua de fogo: lados em curva que se encontram numa ponta deslocada, como chama ao vento
  var am = (a0 + a1) / 2, w = a1 - a0, h = r1 - r0, tip = am + w * 0.16;
  return 'M' + pol(r0, a0) + 'C' + pol(r0 + h * 0.45, a0 - w * 0.08) + ' ' + pol(r0 + h * 0.72, am - w * 0.06) + ' ' + pol(r1, tip) +
    'C' + pol(r0 + h * 0.6, a1 + w * 0.02) + ' ' + pol(r0 + h * 0.34, a1 + w * 0.07) + ' ' + pol(r0, a1) +
    'A' + r0 + ' ' + r0 + ' 0 0 0 ' + pol(r0, a0) + 'Z';
}
function bannerPath(r0, r1, a0, a1) {
  // estandarte com rabo de andorinha na ponta de fora
  var am = (a0 + a1) / 2, cut = Math.min(20, (r1 - r0) * 0.3);
  return 'M' + pol(r0, a0) + 'L' + pol(r1, a0) + 'L' + pol(r1 - cut, am) + 'L' + pol(r1, a1) + 'L' + pol(r0, a1) +
    'A' + r0 + ' ' + r0 + ' 0 0 0 ' + pol(r0, a0) + 'Z';
}
function shieldPath(w, h) {
  // escudo heráldico centrado no gráfico
  var x = 230, y = 232;
  return 'M' + (x - w) + ' ' + (y - h) + 'Q' + x + ' ' + (y - h - 8) + ' ' + (x + w) + ' ' + (y - h) + 'L' + (x + w) + ' ' + (y + h * 0.1) +
    'Q' + (x + w) + ' ' + (y + h * 0.72) + ' ' + x + ' ' + (y + h) + 'Q' + (x - w) + ' ' + (y + h * 0.72) + ' ' + (x - w) + ' ' + (y + h * 0.1) + 'Z';
}
function starBurst(n, rOut, rIn, rot) {
  // estrela de impacto dos jogos de luta, atrás do placar central
  var d = '';
  for (var i = 0; i < n * 2; i++) d += (i ? 'L' : 'M') + pol(i % 2 ? rIn : rOut, rot + i * 180 / n);
  return d + 'Z';
}
function xMark(r1, r2, w, op) {
  return [45, 135, 225, 315].map(function (a) {
    return '<line x1="' + pol(r1, a).replace(' ', '" y1="') + '" x2="' + pol(r2, a).replace(' ', '" y2="') + '" style="stroke:var(--blood2)" stroke-width="' + w + '" stroke-linecap="round" opacity="' + op + '"/>';
  }).join('');
}
function gLabel(i, am, R, v) {
  var t = am * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t), lr = R + 28;
  var x = 230 + lr * cs, y = 230 + lr * sn + (sn < 0 ? -6 : 4);
  var anc = cs > 0.3 ? 'start' : cs < -0.3 ? 'end' : 'middle';
  return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anc + '">' + esc(G[i].sh || G[i].k) +
    '<tspan class="v" x="' + x.toFixed(1) + '" dy="1.08em">' + v + '</tspan></text>';
}
/* asas do Coro da Alvorada: quatro penas de cada lado, abrindo de uma auréola com o placar. Só para 8 agrupamentos. */
var WCX = 320, WCY = 232, WA = [-60, -37, -14, 9];
function fAng(i) { return i < 4 ? WA[i] : 180 - WA[7 - i]; }
function fpt(a, u, v) {
  var t = a * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
  return (WCX + u * c - v * s).toFixed(1) + ' ' + (WCY + u * s + v * c).toFixed(1);
}
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
function wingsSvg(st) {
  var r0 = 60, R = 238, max = 1, i;
  for (i = 0; i < 8; i++) max = Math.max(max, st.grp[i].pts);
  var o = '<svg viewBox="-24 -2 688 350" role="group" aria-label="Asas com os oito agrupamentos, uma pena para cada, e a pontuação total na auréola"><defs>';
  for (i = 0; i < 8; i++) {
    o += '<radialGradient id="pg' + i + '" gradientUnits="userSpaceOnUse" cx="' + WCX + '" cy="' + WCY + '" r="' + R + '">' +
      '<stop offset=".22" style="stop-color:rgba(var(--g' + i + '),.5)"/><stop offset=".85" style="stop-color:rgb(var(--g' + i + '))"/></radialGradient>';
  }
  o += '<radialGradient id="brilho" gradientUnits="userSpaceOnUse" cx="' + WCX + '" cy="' + WCY + '" r="' + R + '">' +
    '<stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></radialGradient>' +
    '<radialGradient id="halo" gradientUnits="userSpaceOnUse" cx="' + WCX + '" cy="' + WCY + '" r="150">' +
    '<stop offset="0" style="stop-color:rgba(var(--gold2-rgb),.42)"/><stop offset=".5" style="stop-color:rgba(var(--gold2-rgb),.12)"/><stop offset="1" style="stop-color:rgba(var(--gold2-rgb),0)"/></radialGradient></defs>';
  o += '<circle cx="' + WCX + '" cy="' + WCY + '" r="150" fill="url(#halo)"/>';
  var labels = '';
  [3, 2, 1, 0, 4, 5, 6, 7].forEach(function (i) {
    var a = fAng(i), side = i < 4 ? 1 : -1, v = st.grp[i].pts;
    var fr = Math.max(0.2, Math.sqrt(Math.max(v, 0) / max)), r1 = r0 + (R - r0) * fr;
    o += '<g class="pena" style="--i:' + (i < 4 ? 3 - i : i - 4) + ';--r:' + (side * 26) + 'deg" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
      '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
      '<path class="ghost" d="' + feather(a, r0, R, side) + '" style="fill:rgba(var(--g' + i + '),.07);stroke:rgba(var(--gold-rgb),.42)" stroke-width="1"/>' +
      '<path class="fill" d="' + feather(a, r0, r1, side) + '" fill="url(#pg' + i + ')" style="stroke:rgba(var(--gold2-rgb),.92)" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<path d="' + feather(a, r0, r1, side) + '" fill="url(#brilho)" pointer-events="none"/>' +
      '<path d="' + rachis(a, r0, r1, side) + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1" stroke-linecap="round" pointer-events="none"/></g>';
    var t = a * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t), lr = R + 13, lv = (R - r0) * 0.13 * side * 1.12;
    var x = WCX + lr * cs - lv * sn, y = WCY + lr * sn + lv * cs + (sn < -0.5 ? -12 : -2);
    labels += '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + (i < 4 ? 'start' : 'end') + '">' + esc(G[i].sh || G[i].k) +
      '<tspan class="v" x="' + x.toFixed(1) + '" dy="1.16em">' + v + '</tspan></text>';
  });
  o += labels + '<circle cx="' + WCX + '" cy="' + WCY + '" r="52" style="fill:var(--deep);stroke:var(--gold)" stroke-width="2"/>' +
    '<circle cx="' + WCX + '" cy="' + WCY + '" r="59" fill="none" style="stroke:var(--gold)" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 9.17" opacity=".8"/>' +
    '<circle cx="' + WCX + '" cy="' + WCY + '" r="46" fill="none" style="stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>' +
    '<text class="ctr-n" x="' + WCX + '" y="' + (WCY + 11) + '" text-anchor="middle">' + st.total + '</text>' +
    '<text class="ctr-l" x="' + WCX + '" y="' + (WCY + 29) + '" text-anchor="middle">pontos</text></svg>';
  return o;
}
function chartSvg(st) {
  if (M.grafico === 'asas' && NG === 8) return wingsSvg(st);
  var fios = M.grafico === 'fios', chamas = M.grafico === 'chamas', band = M.grafico === 'estandartes', pin = M.grafico === 'alfinetes', reb = M.grafico === 'rebites', esp = M.grafico === 'espinhos', fang = M.grafico === 'presas', crown = M.grafico === 'coroa', vial = M.grafico === 'frascos', runa = M.grafico === 'runas', casco = M.grafico === 'cascos', leque = M.grafico === 'leque', lua = M.grafico === 'luas', raio = M.grafico === 'raios', balao = M.grafico === 'baloes', tranca = M.grafico === 'trancas', folha = M.grafico === 'folhas', ovo = M.grafico === 'ovos', fenda = M.grafico === 'fendas', moeda = M.grafico === 'moedas', mao = M.grafico === 'maos', gear = M.grafico === 'engrenagens', perg = M.grafico === 'pergaminhos', lun = M.grafico === 'lunetas', torre = M.grafico === 'torres', scal = M.grafico === 'escamas', rosa = M.grafico === 'rosacea' || chamas, r0 = 60, R = 184, max = 1, i, step = 360 / NG, gap = rosa || fios || band || pin || reb || esp || fang || crown || vial || runa || casco || leque || lua || raio || balao || tranca || folha || ovo || fenda || moeda || mao || gear || perg || lun || torre || scal ? 2.4 : 1.2;
  // o ovo tem o mesmo tamanho em todos os agrupamentos: a, meio comprimento; b, a largura de desenho
  var eA = Math.min((R - r0) * 0.44, 58), eRc = r0 + (R - r0) * 0.52, eB = Math.min(eRc * Math.sin((step / 2 - gap) * Math.PI / 180) * 0.92 / 0.75, eA * 0.95), eCut = eA * 0.28;
  for (i = 0; i < NG; i++) max = Math.max(max, st.grp[i].pts);
  var o = '<svg viewBox="-58 -2 576 464" role="group" aria-label="' + (rosa && !chamas ? 'Rosácea' : 'Gráfico') + ' dos ' + NUM[NG] + ' agrupamentos, com a pontuação total no centro"><defs>';
  for (i = 0; i < NG; i++) {
    o += '<radialGradient id="rg' + i + '" gradientUnits="userSpaceOnUse" cx="230" cy="230" r="' + R + '">' +
      '<stop offset=".3" style="stop-color:rgba(var(--g' + i + '),.5)"/><stop offset="1" style="stop-color:rgb(var(--g' + i + '))"/></radialGradient>';
  }
  if (vial) for (i = 0; i < NG; i++) o += '<clipPath id="cv' + i + '"><path d="' + vialPath(r0, R, -90 + i * step + gap, -90 + (i + 1) * step - gap) + '"/></clipPath>';
  if (runa) for (i = 0; i < NG; i++) o += '<clipPath id="cr' + i + '"><path d="' + stonePath(r0, R, -90 + i * step + gap, -90 + (i + 1) * step - gap) + '"/></clipPath>';
  if (leque) for (i = 0; i < NG; i++) o += '<clipPath id="cl' + i + '"><path d="' + fanPath(fanPts(r0, R, -90 + i * step + gap, -90 + (i + 1) * step - gap)) + '"/></clipPath>';
  if (ovo) o += '<clipPath id="cob"><rect x="' + (-eA - 2) + '" y="' + (-eB - 2) + '" width="' + (eA + 2 + eCut).toFixed(1) + '" height="' + (2 * eB + 4).toFixed(1) + '"/></clipPath>' +
    '<clipPath id="coc"><rect x="' + eCut.toFixed(1) + '" y="' + (-eB - 2) + '" width="' + (eA + 2 - eCut).toFixed(1) + '" height="' + (2 * eB + 4).toFixed(1) + '"/></clipPath>';
  if (casco) {
    for (i = 0; i < NG; i++) o += '<clipPath id="ck' + i + '"><path d="' + shellPath(shellPts(r0, R, -90 + i * step + gap, -90 + (i + 1) * step - gap), 1) + '"/></clipPath>';
    o += '<clipPath id="ckm"><circle cx="230" cy="230" r="' + (r0 - 6) + '"/></clipPath>';
  }
  o += '</defs>';
  if (raio || balao || tranca) {
    // o palco: disco escuro e um aro no estilo de cada tema (nuvem tracejada, borda de quadrinho, fio de trança)
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),' + (balao ? '.75' : '.4') + ')" stroke-width="' + (balao ? 3 : 1.2) + '"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.35)" stroke-width="' + (tranca ? 2.4 : 1.2) + '" stroke-dasharray="' + (raio ? '22 5 6 5' : balao ? '3 5' : '9 3') + '" stroke-linecap="round"/>';
  } else if (moeda) {
    // a mesa de jogo: disco escuro e o aro serrilhado de uma moeda grande
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.6);stroke:rgba(var(--gold-rgb),.4)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.32)" stroke-width="5" stroke-dasharray="1.6 2.6"/>';
  } else if (scal) {
    // o pico de pedra: disco escuro, um aro fino e um aro de rocha irregular
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.6);stroke:rgba(var(--gold-rgb),.36)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.26)" stroke-width="5" stroke-dasharray="12 3 5 3 8 4"/>';
  } else if (torre) {
    // a praça à noite: disco escuro, um aro fino e um aro de pedras de calçada
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.58);stroke:rgba(var(--gold-rgb),.36)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.28)" stroke-width="6" stroke-dasharray="7 2.6"/>';
  } else if (lun) {
    // o convés à noite: disco escuro, um aro fino de latão e um cabo trançado em volta
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.58);stroke:rgba(var(--gold-rgb),.38)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.3)" stroke-width="4.2" stroke-dasharray="5 2.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--deep-rgb),.55)" stroke-width="1" stroke-dasharray="5 2.2" stroke-dashoffset="2.6"/>';
  } else if (perg) {
    // o céu de tempestade: disco escuro, um aro fino e um aro de nuvem tracejada
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.35)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.28)" stroke-width="2.4" stroke-dasharray="14 4 3 4" stroke-linecap="round"/>';
  } else if (gear) {
    // a oficina: disco de óleo escuro, um aro de latão e a fila de rebites
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.6);stroke:rgba(var(--blood-rgb),.45)" stroke-width="3"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--blood-rgb),.5)" stroke-width="3.2" stroke-dasharray="0.1 11" stroke-linecap="round"/>';
  } else if (mao) {
    // o chão do cemitério: disco de terra escura, o trilho e as barras de uma grade de ferro
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.6);stroke:rgba(var(--gold-rgb),.3)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 13) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.35)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 17) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.3)" stroke-width="8" stroke-dasharray="1.4 6.4"/>';
  } else if (fenda) {
    // o céu de guerra: disco de fumaça, um aro fino e brasas soltas em volta
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.6);stroke:rgba(var(--gold-rgb),.35)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--blood2-rgb),.55)" stroke-width="2.6" stroke-dasharray="0.1 7 0.1 13 0.1 5" stroke-linecap="round"/>';
  } else if (ovo) {
    // o ninho: disco escuro e dois aros de gravetos trançados
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.35)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.32)" stroke-width="3" stroke-dasharray="18 5 7 4" stroke-linecap="round"/>' +
      '<circle cx="230" cy="230" r="' + (R + 19) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.22)" stroke-width="2" stroke-dasharray="9 6 14 5" stroke-linecap="round" transform="rotate(7 230 230)"/>';
  } else if (folha) {
    // a clareira: disco escuro, um aro fino e uma trilha de folhas miúdas em volta
    var trilha = '';
    for (var ta = 0; ta < 360; ta += 10) { var tb = pol(R + 15, ta).split(' '); trilha += leafShape(+tb[0], +tb[1], ta + 90, 8, 5).d; }
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.4)" stroke-width="1.2"/>' +
      '<path d="' + trilha + '" style="fill:rgba(var(--gold-rgb),.28)"/>';
  } else if (lua) {
    // o céu da colheita: disco escuro, a órbita pontilhada das luas e um aro fino
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.4)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.3)" stroke-width="1" stroke-dasharray="1 7" stroke-linecap="round"/>' +
      '<circle cx="230" cy="230" r="' + (r0 + (R - r0) * 0.55).toFixed(1) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.18)" stroke-width="1" stroke-dasharray="2 6"/>';
  } else if (leque) {
    // o sol art déco: disco escuro, um filete e os raios curtos em volta
    var sun = '';
    for (var sa = 0; sa < 360; sa += 6) sun += 'M' + pol(R + 13, sa) + 'L' + pol(R + (sa % 18 ? 18 : 23), sa);
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.45)" stroke-width="1.2"/>' +
      '<path d="' + sun + '" style="fill:none;stroke:rgba(var(--gold-rgb),.45)" stroke-width="1.1"/>';
  } else if (casco) {
    // a tampa do bueiro: disco escuro e um aro com as fendas de levantar
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.4)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 17) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.38)" stroke-width="4" stroke-dasharray="14 6"/>';
  } else if (runa) {
    // o círculo de pedras: chão escuro e um anel de nós entalhados
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.4)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.45)" stroke-width="1.4" stroke-dasharray="8 3 2 3"/>';
  } else if (vial) {
    // a moldura do palco: um disco de veludo e um fio de ouro por fora das rolhas
    o += '<circle cx="230" cy="230" r="' + (R + 12) + '" style="fill:rgba(var(--deep-rgb),.5);stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>' +
      '<circle cx="230" cy="230" r="' + (R + 18) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.5)" stroke-width="1.4" stroke-dasharray="10 4 1 4"/>';
  } else if (crown) {
    // aro da coroa com uma fileira de pérolas
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.5);stroke:rgba(var(--gold-rgb),.7)" stroke-width="1.4"/>' +
      '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:rgba(var(--gold2-rgb),.55)" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 9"/>';
  } else if (fang) {
    // aro de couro com pesponto, como a borda do escudo do Fynn
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.5);stroke:rgba(var(--gold-rgb),.6)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.45)" stroke-width="1" stroke-dasharray="5 4"/>';
  } else if (esp) {
    // a haste da coroa: anel escuro com pequenos espinhos em volta
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.5);stroke:rgba(var(--gold-rgb),.55)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:rgba(var(--blood2-rgb),.55)" stroke-width="2" stroke-dasharray="2 10"/>';
  } else if (reb) {
    // saia de Dalek: aro de metal com uma fileira de rebites
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.6);stroke:rgba(var(--gold-rgb),.7)" stroke-width="1.4"/>' +
      '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.6)" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="0.1 11"/>';
  } else if (pin) {
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.45);stroke:rgba(var(--gold-rgb),.7)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.45)" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round"/>';
  } else if (band) {
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--gold-rgb),.07);stroke:var(--gold)" stroke-width="1.4"/>' +
      '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.55)" stroke-width="1" stroke-dasharray="6 4"/>';
  } else if (chamas) {
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--blood2-rgb),.6)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:var(--gold)" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.1 7" opacity=".7"/>';
  } else if (rosa) {
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.5);stroke:var(--gold)" stroke-width="1.3"/>';
    o += '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:var(--gold)" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 9.2" opacity=".75"/>';
  } else if (fios) {
    // o X de luz atravessa o gráfico por baixo das lâminas e aparece nas frestas entre elas
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--blood2-rgb),.55)" stroke-width="1"/>' +
      '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.4)" stroke-width="1" stroke-dasharray="14 6 2 6"/>' +
      xMark(r0 - 7, R + 22, 5, .22) + xMark(r0 - 7, R + 22, 1.6, .9);
  } else {
    o += '<circle cx="230" cy="230" r="' + (R + 6) + '" style="fill:rgba(var(--deep-rgb),.4);stroke:var(--line2)" stroke-width="1"/>';
  }
  for (i = 0; i < NG; i++) {
    var a0 = -90 + i * step + gap, a1 = -90 + (i + 1) * step - gap, am = (a0 + a1) / 2;
    var v = st.grp[i].pts, fr = Math.max(0.12, Math.sqrt(Math.max(v, 0) / max)), r1 = r0 + (R - r0) * fr;
    var shape = crown ? crownPath : fang ? fangPath : esp ? thornPath : fios ? shardPath : chamas ? flamePath : band ? bannerPath : rosa ? petalPath : wedgePath;
    if (reb) {
      // painel da saia: a fatia acende conforme os pontos, e cada terço ganha um rebite aceso
      var rv = '';
      [0.25, 0.5, 0.75].forEach(function (f, j) {
        var rr = r0 + (R - r0) * f, pp = pol(rr, am).split(' '), on = rr <= r1 + 6;
        rv += '<circle cx="' + pp[0] + '" cy="' + pp[1] + '" r="3.6" style="fill:' + (on ? 'rgb(var(--gold2-rgb))' : 'rgba(var(--gold-rgb),.2)') + ';stroke:rgba(0,0,0,.4)" stroke-width=".8"/>';
      });
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:rgba(var(--g' + i + '),.07);stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>' +
        '<path class="fill" d="' + wedgePath(r0, r1, a0, a1) + '" fill="url(#rg' + i + ')" style="stroke:rgba(var(--gold2-rgb),.7)" stroke-width="1.1" stroke-linejoin="round"/>' + rv + '</g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (raio || balao || tranca) {
      var gTit = '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>', gAbre = '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' + gTit;
      if (raio) {
        // raio: o contorno inteiro fica desenhado, e o raio aceso vai até a soma das notas, com um brilho branco
        o += gAbre + '<path class="ghost" d="' + boltPath(r0, R, a0, a1) + '" style="fill:rgba(var(--g' + i + '),.07);stroke:rgba(var(--gold-rgb),.4)" stroke-width="1" stroke-linejoin="round"/>' +
          '<path class="fill" d="' + boltPath(r0, r1, a0, a1) + '" fill="url(#rg' + i + ')" style="stroke:rgba(255,255,255,.75)" stroke-width="1.3" stroke-linejoin="round"/></g>';
      } else if (balao) {
        // balão: o tamanho cresce com a soma das notas; o contorno tracejado é o tamanho máximo
        var brc = r0 + (R - r0) * 0.56, bmx = Math.min((R - r0) * 0.4, brc * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.92), bs = bmx * (0.38 + 0.62 * fr), bp = pol(brc, am).split(' ');
        o += gAbre + '<circle class="ghost" cx="' + bp[0] + '" cy="' + bp[1] + '" r="' + bmx.toFixed(1) + '" style="fill:rgba(var(--g' + i + '),.05);stroke:rgba(var(--gold-rgb),.3)" stroke-width="1" stroke-dasharray="4 4"/>' +
          '<path class="fill" d="' + bubbleSvg(+bp[0], +bp[1], bs, 230, 230) + '" fill="url(#rg' + i + ')" style="stroke:rgb(var(--ink-rgb))" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<path d="' + bubbleSvg(+bp[0], +bp[1], bs, 230, 230) + '" fill="none" style="stroke:rgba(255,255,255,.25)" stroke-width="1" transform="translate(-1.5 -1.5)" pointer-events="none"/></g>';
      } else {
        // trança: sete gomos alternados ao longo do raio; acendem até a soma das notas
        var tL = (R - r0 - 6) / 7, tW = Math.min(16, (r0 + 20) * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.7), tg = '';
        for (var tk = 0; tk < 7; tk++) {
          var trc = r0 + 6 + tL * (tk + 0.5), side = tk % 2 ? 1 : -1, tpp = pol(trc, am + side * (tW * 0.32) / trc * 180 / Math.PI).split(' '), ton = trc <= r1 + tL * 0.3;
          tg += '<ellipse cx="' + tpp[0] + '" cy="' + tpp[1] + '" rx="' + (tL * 0.82).toFixed(1) + '" ry="' + (tW * 0.5).toFixed(1) + '" transform="rotate(' + (am + side * 24).toFixed(1) + ' ' + tpp[0] + ' ' + tpp[1] + ')"' +
            (ton ? ' fill="url(#rg' + i + ')" style="stroke:rgba(var(--deep-rgb),.6)" stroke-width="1.2"' : ' style="fill:rgba(var(--g' + i + '),.06);stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"') + '/>';
        }
        o += gAbre + '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' + '<g class="fill">' + tg + '</g>' +
          '<circle cx="' + pol(r0 + 4, am).split(' ')[0] + '" cy="' + pol(r0 + 4, am).split(' ')[1] + '" r="3" style="fill:rgba(var(--gold-rgb),.7)" pointer-events="none"/></g>';
      }
      o += gLabel(i, am, R, v);
      continue;
    }
    if (moeda) {
      // pilha de moedas: as oito vagas ficam desenhadas; as moedas se empilham em proporção direta à soma das notas,
      // e perto do mais cheio a moeda do topo salta girando
      var mv = Math.max(0, v) / max, mn = v > 0 ? Math.max(1, Math.round(8 * mv)) : 0, mh = (R - r0 - 34) / 8 - 2.2,
        mW = Math.min(34, 2 * (r0 + 8) * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.9), mp = pol(r0, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + mp[0] + ' ' + mp[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' + coinStack(i, 8, mh, mW, false) +
        '<g class="fill">' + coinStack(i, mn, mh, mW, true) + (mv >= 0.94 ? flipCoinSvg(8 + 8 * (mh + 2.2) + 14, mW) : '') + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (scal) {
      // escamas: acendem em proporção direta à soma das notas, da base para fora; a fileira inteira fica tracejada,
      // e a mais cheia solta a labareda
      var sbV = Math.max(0, v) / max, sbL = R - r0 - 40, sbN = Math.max(1, Math.floor((sbL - 4) / 9)), sbOn = v > 0 ? Math.max(1, Math.round(sbN * sbV)) : 0,
        sbW = Math.min(22, 2 * (r0 + 8) * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.8), sbP = pol(r0, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + sbP[0] + ' ' + sbP[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none"><g class="fill">' + scalesSvg(i, sbL, sbW, sbOn, sbV >= 0.94 && sbOn > 0) + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (torre) {
      // torre: sobe em proporção direta à soma das notas, as janelas acendem com a altura;
      // o comprimento inteiro fica tracejado, e a mais alta ganha a águia
      var tv = Math.max(0, v) / max, tL = R - r0 - 36, tl0 = tL * Math.max(0.12, tv),
        tw = Math.min(22, 2 * (r0 + 8) * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.8), tp = pol(r0, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + tp[0] + ' ' + tp[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' + towerSvg(i, tL, tw, false, false) +
        '<g class="fill">' + towerSvg(i, tl0, tw, true, tv >= 0.94) + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (lun) {
      // luneta: estica em proporção direta à soma das notas; o comprimento inteiro fica tracejado,
      // e a mais cheia ganha o brilho na lente
      var lv = Math.max(0, v) / max, lL = R - r0 - 36, ll0 = lL * Math.max(0.12, lv),
        lw = Math.min(24, 2 * (r0 + 8) * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.85), lp = pol(r0, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + lp[0] + ' ' + lp[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' + spyglassSvg(i, lL, lw, false, false) +
        '<g class="fill">' + spyglassSvg(i, ll0, lw, true, lv >= 0.94) + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (perg) {
      // pergaminho: a folha se desenrola em proporção direta à soma das notas; o comprimento inteiro fica tracejado,
      // e o mais cheio ganha o lacre vermelho
      var pv = Math.max(0, v) / max, pL = R - r0 - 34, pl0 = pL * Math.max(0.1, pv),
        pw = Math.min(26, 2 * (r0 + 8) * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.85), pp = pol(r0, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + pp[0] + ' ' + pp[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' + scrollSvg(i, pL, pw, false, false) +
        '<g class="fill">' + scrollSvg(i, pl0, pw, true, pv >= 0.94) + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (gear) {
      // engrenagem: dez dentes que acendem em proporção direta à soma das notas; a mais cheia ganha o brilho verde;
      // as vizinhas giram em sentidos alternados, como se engrenassem
      var gfr = Math.max(0, v) / max, gl = v > 0 ? Math.max(1, Math.round(10 * gfr)) : 0, grc = r0 + (R - r0) * 0.55,
        gR = Math.min((R - r0) * 0.42, grc * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.95), gp = pol(grc, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g class="fill" pointer-events="none">' + gearSvg(i, +gp[0], +gp[1], gR, gl, am + (i % 2 ? 18 : 0), gfr >= 0.94) + '</g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (mao) {
      // mão: o antebraço sobe da cova em proporção direta à soma das notas; o caminho inteiro fica tracejado,
      // e só a mão do agrupamento perto do mais cheio abre os dedos
      var hv = Math.max(0, v) / max, hL = R - r0 - 36, ht = 10 + hL * Math.max(0.08, hv), hw = 8,
        hM = Math.min(30, 2 * (r0 + 8) * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.9), hp = pol(r0, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + hp[0] + ' ' + hp[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' + handSvg(i, 10 + hL, hw, true, false) +
        '<g class="fill">' + handSvg(i, ht, hw, hv >= 0.94, true) + '</g>' +
        // o monte de terra da cova, por cima da base do braço
        '<path d="M2 ' + (-hM / 2).toFixed(1) + 'Q18 0 2 ' + (hM / 2).toFixed(1) + 'Z" style="fill:rgba(var(--wine-rgb),.95);stroke:rgba(var(--gold-rgb),.3)" stroke-width="1" stroke-linejoin="round"/>' +
        '<circle cx="9" cy="' + (-hM / 5).toFixed(1) + '" r="1.1" style="fill:rgba(var(--bone-rgb),.35)"/><circle cx="5" cy="' + (hM / 6).toFixed(1) + '" r=".9" style="fill:rgba(var(--bone-rgb),.3)"/></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (fenda) {
      // fenda: o rasgo fechado fica desenhado; ele abre e acende em proporção direta à soma das notas,
      // e o agrupamento perto do mais cheio solta uma asa pela ponta de fora
      var fv = Math.max(0, v) / max, fL = R - r0 - 16, fW = Math.min(18, (r0 + 40) * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.5), fo = Math.max(0.12, fv), fp0 = pol(r0 + 6, am).split(' ');
      var rp = riftPath(fL, fW, fo);
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + fp0[0] + ' ' + fp0[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' +
        '<path d="' + riftPath(fL, fW, 1) + '" style="fill:rgba(var(--g' + i + '),.05);stroke:rgba(var(--gold-rgb),.28)" stroke-width="1" stroke-dasharray="3 3"/>' +
        '<g class="fill"><path d="' + rp + '" style="fill:none;stroke:rgba(var(--g' + i + '),.35)" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="' + rp + '" fill="url(#rg' + i + ')" style="stroke:rgba(var(--gold2-rgb),.85)" stroke-width="1.2" stroke-linejoin="round"/>' +
        // o fio de luz que atravessa a fenda aberta
        '<path d="M' + (fL * 0.12).toFixed(1) + ' 0L' + (fL * 0.88).toFixed(1) + ' 0" style="stroke:rgba(255,240,220,' + (0.25 + 0.55 * fv).toFixed(2) + ')" stroke-width="' + (0.8 + 1.4 * fv).toFixed(1) + '" stroke-linecap="round"/>' +
        (fv >= 0.93 ? batWingSvg(fL * 0.7, fW) : '') + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (ovo) {
      // ovo: o contorno fica desenhado; a cor acende e as rachaduras se abrem em proporção direta à soma das notas (até quatro),
      // e o agrupamento perto do mais cheio eclode: a casca de cima levanta e sai a garra
      var vl = Math.max(0, v) / max, nk = Math.round(4 * vl), hatch = vl >= 0.93, ep = pol(eRc, am).split(' '), eg = eggPath(eA, eB);
      var shell = ' fill="url(#rg' + i + ')" style="opacity:' + (0.3 + 0.7 * vl).toFixed(2) + ';stroke:rgba(var(--gold2-rgb),.75)" stroke-width="1.2"';
      var corpo = hatch ?
        '<path d="' + eg + '"' + shell + ' clip-path="url(#cob)"/>' +
        '<path d="M' + eCut.toFixed(1) + ' ' + (-eB * 0.62).toFixed(1) + 'L' + (eCut + 5).toFixed(1) + ' ' + (-eB * 0.3).toFixed(1) + 'L' + (eCut - 3).toFixed(1) + ' 0L' + (eCut + 4).toFixed(1) + ' ' + (eB * 0.3).toFixed(1) + 'L' + eCut.toFixed(1) + ' ' + (eB * 0.62).toFixed(1) + '" style="fill:none;stroke:rgba(var(--deep-rgb),.8)" stroke-width="1.6"/>' +
        clawSvg(eCut, eA, eB) +
        // a tampa abre para o lado, presa pela borda, sem sair do aro
        '<g transform="translate(-4 ' + (-eB * 0.18).toFixed(1) + ') rotate(-38 ' + eCut.toFixed(1) + ' ' + (-eB * 0.62).toFixed(1) + ')"><path d="' + eg + '"' + shell + ' clip-path="url(#coc)"/></g>' :
        '<path d="' + eg + '"' + shell + '/>' +
        '<ellipse cx="' + (-eA * 0.25).toFixed(1) + '" cy="' + (-eB * 0.3).toFixed(1) + '" rx="' + (eA * 0.35).toFixed(1) + '" ry="' + (eB * 0.16).toFixed(1) + '" style="fill:rgba(255,255,255,.14)"/>' +
        (nk ? '<path d="' + eggCracks(eA, eB, nk) + '" style="fill:none;stroke:rgba(var(--deep-rgb),.85)" stroke-width="1.6" stroke-linejoin="round"/>' : '');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + ep[0] + ' ' + ep[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' +
        '<path d="' + eg + '" style="fill:rgba(var(--g' + i + '),.06);stroke:rgba(var(--gold-rgb),.45)" stroke-width="1.2"/>' +
        '<g class="fill">' + corpo + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (folha) {
      // galho: o ramo inteiro fica desenhado, com sete folhas; acendem em proporção direta à soma das notas (não pela área, como as fatias),
      // para que a diferença entre agrupamentos apareça na contagem. A folha da ponta só abre perto do agrupamento mais cheio
      var fS = Math.min(1, (r0 + 20) * Math.sin((a1 - a0) / 2 * Math.PI / 180) / 26), fP = (R - r0 - 40) / 5, fEnd = R - 22, fg = '';
      var fn = v > 0 ? Math.max(1, Math.round(7 * v / max)) : 0, fLit = fn ? Math.min(fEnd, r0 + 8 + fP * Math.min(fn - 1, 5)) : r0 + 2;
      for (var fk = 0; fk < 6; fk++) {
        var frc = r0 + 8 + fP * fk, fside = fk % 2 ? 1 : -1, fb = pol(frc, am).split(' '), fon = fk < fn, fl = leafShape(+fb[0], +fb[1], am + fside * 38, (17 + fk * 2) * fS, (11 + fk) * fS);
        fg += '<path d="' + fl.d + '"' + (fon ? ' fill="url(#rg' + i + ')" style="stroke:rgba(var(--gold2-rgb),.75)" stroke-width="1"' : ' style="fill:rgba(var(--g' + i + '),.06);stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"') + '/>' +
          (fon ? '<path d="' + fl.rib + '" style="fill:none;stroke:rgba(255,255,255,.4)" stroke-width=".8"/>' : '');
      }
      var ftp = pol(fEnd - 2, am).split(' '), fton = fn >= 7, ft =leafShape(+ftp[0], +ftp[1], am, 24 * fS, 14 * fS);
      fg += '<path d="' + ft.d + '"' + (fton ? ' fill="url(#rg' + i + ')" style="stroke:rgba(var(--gold2-rgb),.9)" stroke-width="1.2"' : ' style="fill:rgba(var(--g' + i + '),.06);stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"') + '/>';
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<path d="M' + pol(r0 + 2, am) + 'L' + pol(fEnd, am) + '" style="stroke:rgba(var(--gold-rgb),.35)" stroke-width="1.4" stroke-linecap="round"/>' +
        '<path d="M' + pol(r0 + 2, am) + 'L' + pol(fn >= 7 ? fEnd : fLit, am) + '" style="stroke:rgb(var(--gold2-rgb))" stroke-width="2" stroke-linecap="round"/>' +
        '<g class="fill" pointer-events="none">' + fg + '</g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (lua) {
      // lua: o disco fica desenhado, e a parte acesa vai de nova a cheia com a soma das notas; perto da cheia, um halo
      var mrc = r0 + (R - r0) * 0.55, mr = Math.min((R - r0) * 0.42, mrc * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.88), mp = pol(mrc, am).split(' '), mx = +mp[0], my = +mp[1];
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        (fr > 0.85 ? '<circle cx="' + mx + '" cy="' + my + '" r="' + (mr + 7).toFixed(1) + '" style="fill:rgba(var(--g' + i + '),.14)"/>' : '') +
        '<circle class="ghost" cx="' + mx + '" cy="' + my + '" r="' + mr.toFixed(1) + '" style="fill:rgba(var(--g' + i + '),.08);stroke:rgba(var(--gold-rgb),.45)" stroke-width="1.1"/>' +
        '<path class="fill" d="' + moonPhase(mx, my, mr, fr) + '" fill="url(#rg' + i + ')" style="stroke:rgba(var(--gold2-rgb),.6)" stroke-width=".8"/>' +
        [[0.35, -0.3, 0.16], [-0.25, 0.3, 0.12], [0.1, 0.45, 0.09]].map(function (q) { return '<circle cx="' + (mx + q[0] * mr).toFixed(1) + '" cy="' + (my + q[1] * mr).toFixed(1) + '" r="' + (q[2] * mr).toFixed(1) + '" style="fill:rgba(0,0,0,.12)" pointer-events="none"/>'; }).join('') +
        '</g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (leque) {
      // raio do leque: o contorno fica desenhado, a cor sobe com a soma das notas e cada degrau acende quando a cor passa dele
      var fk = fanPts(r0, R, a0, a1), fp = fanPath(fk), lf = Math.max(r0 + 6, r1), fpt = fk.pt;
      var deg = [fk.ra, fk.rb].map(function (rr, j) { var hw = j ? fk.h3 : fk.h2, on = lf >= rr;
        return '<path d="M' + fpt(rr, -hw) + 'L' + fpt(rr, hw) + '" style="stroke:' + (on ? 'rgb(var(--gold2-rgb))' : 'rgba(var(--gold-rgb),.4)') + '" stroke-width="' + (on ? 1.8 : 1.1) + '" pointer-events="none"/>'; }).join('');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + fp + '" style="fill:rgba(var(--g' + i + '),.07);stroke:rgba(var(--gold-rgb),.5)" stroke-width="1.1" stroke-linejoin="miter"/>' +
        '<circle class="fill" cx="230" cy="230" r="' + lf.toFixed(1) + '" fill="url(#rg' + i + ')" clip-path="url(#cl' + i + ')"/>' +
        '<path d="M' + fpt(fk.ri + 4, 0) + 'L' + fpt(R + 4, 0) + 'M' + fpt(fk.ra + 6, -fk.h2 * 0.55) + 'L' + fpt(R - 2, -fk.h3 * 0.55) + 'M' + fpt(fk.ra + 6, fk.h2 * 0.55) + 'L' + fpt(R - 2, fk.h3 * 0.55) + '" style="fill:none;stroke:rgba(var(--gold2-rgb),.38)" stroke-width=".8" pointer-events="none"/>' +
        deg + '</g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (casco) {
      // casco: o oval fica desenhado, a cor sobe do centro com a soma das notas e cada placa do eixo acende quando a cor passa dela
      var sk = shellPts(r0, R, a0, a1), so = shellPath(sk, 1), pl8 = shellPlates(sk), lk = Math.max(r0 + 6, r1);
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + so + '" style="fill:rgba(var(--g' + i + '),.07);stroke:rgba(var(--gold-rgb),.5)" stroke-width="1.2"/>' +
        '<circle class="fill" cx="230" cy="230" r="' + lk.toFixed(1) + '" fill="url(#rg' + i + ')" clip-path="url(#ck' + i + ')"/>' +
        pl8.hex.map(function (x) { var on = lk >= x.r; return '<path d="' + x.d + '" style="fill:' + (on ? 'rgba(var(--gold2-rgb),.3)' : 'none') + ';stroke:' + (on ? 'rgb(var(--gold2-rgb))' : 'rgba(var(--gold-rgb),.42)') + '" stroke-width="1.2" stroke-linejoin="round" pointer-events="none"/>'; }).join('') +
        '<path d="' + pl8.lines + '" fill="none" style="stroke:rgba(var(--deep-rgb),.45)" stroke-width="1.8" pointer-events="none"/>' +
        '<path d="' + pl8.lines + '" fill="none" style="stroke:rgba(var(--gold-rgb),.42)" stroke-width=".8" pointer-events="none"/></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (runa) {
      // pedra rúnica: a pedra fica desenhada, a luz fria sobe com a soma das notas e a runa acende quando a luz chega nela
      var sp = stonePath(r0, R, a0, a1), lr = Math.max(r0 + 6, r1), rg = R - 30, on = lr >= rg;
      var q0 = pol(rg - 11, am), q1 = pol(rg + 11, am), q2 = pol(rg + 3, am), dw = 7 / (rg + 10) * 180 / Math.PI, q3 = pol(rg + 11, am - dw), q4 = pol(rg + 11, am + dw);
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + sp + '" style="fill:rgba(var(--g' + i + '),.07);stroke:rgba(var(--gold-rgb),.5)" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<circle class="fill" cx="230" cy="230" r="' + lr.toFixed(1) + '" fill="url(#rg' + i + ')" clip-path="url(#cr' + i + ')"/>' +
        '<path d="M' + q0 + 'L' + q1 + 'M' + q2 + 'L' + q3 + 'M' + q2 + 'L' + q4 + '" fill="none" style="stroke:' + (on ? 'rgb(var(--gold2-rgb))' : 'rgba(var(--gold-rgb),.35)') + '" stroke-width="2" stroke-linecap="round" pointer-events="none"/></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (vial) {
      // frasco: o vidro inteiro fica desenhado, o sangue sobe até a soma das notas e a rolha fecha a boca
      var vp = vialPath(r0, R, a0, a1), dd = (a1 - a0) / 2 * Math.PI / 180, vw = Math.min(24, (r0 + 10) * Math.sin(dd) * 0.92) * 0.68;
      var c0 = pol(R, am - vw / R * 180 / Math.PI), c1 = pol(R, am + vw / R * 180 / Math.PI), c2 = pol(R + 9, am + vw * 0.85 / (R + 9) * 180 / Math.PI), c3 = pol(R + 9, am - vw * 0.85 / (R + 9) * 180 / Math.PI);
      var lv = Math.max(r0 + 6, r1);
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + vp + '" style="fill:rgba(var(--g' + i + '),.08);stroke:rgba(var(--gold2-rgb),.55)" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<circle class="fill" cx="230" cy="230" r="' + lv.toFixed(1) + '" fill="url(#rg' + i + ')" clip-path="url(#cv' + i + ')"/>' +
        '<circle cx="230" cy="230" r="' + lv.toFixed(1) + '" fill="none" style="stroke:rgba(255,255,255,.55)" stroke-width="1.4" clip-path="url(#cv' + i + ')" pointer-events="none"/>' +
        '<path d="M' + c0 + 'L' + c1 + 'L' + c2 + 'L' + c3 + 'Z" style="fill:rgba(var(--gold-rgb),.85);stroke:rgba(0,0,0,.35)" stroke-width=".8" pointer-events="none"/>' +
        '<path d="' + vp + '" fill="none" style="stroke:rgba(255,255,255,.18)" stroke-width="3" stroke-dasharray="0 ' + (r0 * 0.4).toFixed(0) + ' 40 999" pointer-events="none"/></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (pin) {
      // alfinete: a fatia fica translúcida, a agulha sai da almofada e a cabeça colorida marca os pontos
      o += '<g class="petal" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:rgba(var(--g' + i + '),.05);stroke:rgba(var(--gold-rgb),.18)" stroke-width="1"/>' +
        '<path class="fill" d="' + wedgePath(r0, r1, a0, a1) + '" fill="url(#rg' + i + ')" style="opacity:.42"/>' +
        '<line x1="' + pol(r0 - 10, am).replace(' ', '" y1="') + '" x2="' + pol(r1, am).replace(' ', '" y2="') + '" style="stroke:var(--gold2)" stroke-width="2.2" stroke-linecap="round"/>' +
        '<circle cx="' + pol(r1, am).split(' ')[0] + '" cy="' + pol(r1, am).split(' ')[1] + '" r="12" style="fill:rgb(var(--g' + i + '));stroke:var(--gold2)" stroke-width="1.4"/>' +
        '<circle cx="' + pol(r1 + 4, am - 4).split(' ')[0] + '" cy="' + pol(r1 + 4, am - 4).split(' ')[1] + '" r="3.2" style="fill:rgba(255,255,255,.55)"/></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (fios) o += '<line x1="' + pol(r0 - 7, am).replace(' ', '" y1="') + '" x2="' + pol(R + 14, am).replace(' ', '" y2="') + '" style="stroke:rgba(var(--blood2-rgb),.3)" stroke-width=".7" stroke-dasharray="1 4"/>';
    o += '<g class="' + (rosa ? 'petal' : 'wedge') + '" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
      '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
      '<path class="ghost" d="' + shape(r0, R, a0, a1) + '" style="fill:rgba(var(--g' + i + '),.07);stroke:rgba(var(--gold-rgb),' + (rosa ? '.45' : '.25') + ')" stroke-width="1"/>' +
      '<path class="fill" d="' + shape(r0, r1, a0, a1) + '" fill="url(#rg' + i + ')" style="stroke:rgba(var(--gold2-rgb),' + (rosa ? '.85' : '.55') + ')" stroke-width="' + (rosa ? '1.3' : '1') + '" stroke-linejoin="round"/></g>';
    if (crown && v > 0) {
      // a pedra preciosa na ponta, na cor do agrupamento, maior quanto mais pontos
      var jp = pol(r1 + 6, am).split(' ');
      o += '<circle cx="' + jp[0] + '" cy="' + jp[1] + '" r="' + (3 + 4 * fr).toFixed(1) + '" style="fill:rgb(var(--g' + i + '));stroke:var(--gold2)" stroke-width="1.2"/>';
    }
    if (fang && v > 0) {
      // a gota de veneno na ponta da presa
      var gp = pol(r1 + 7, -90 + i * step + gap + (step - 2 * gap) * 0.55).split(' ');
      o += '<circle cx="' + gp[0] + '" cy="' + gp[1] + '" r="3.4" style="fill:rgb(var(--blood2-rgb));stroke:rgba(255,255,255,.35)" stroke-width=".7"/>';
    }
    o += gLabel(i, am, R, v);
  }
  if (chamas) o += '<path d="' + starBurst(12, r0 + 16, r0 - 4, -90) + '" style="fill:rgba(var(--blood2-rgb),.55);stroke:var(--gold2)" stroke-width="1.2" stroke-linejoin="round"/>' +
    '<path d="' + starBurst(12, r0 + 6, r0 - 6, -75) + '" style="fill:rgba(var(--gold2-rgb),.35)"/>';
  if (pin) {
    // almofada de alfinetes: gomos costurados e pesponto
    o += '<circle cx="230" cy="230" r="' + (r0 + 2) + '" style="fill:var(--wine);stroke:var(--gold)" stroke-width="1.6"/>';
    for (var k = 0; k < 8; k++) o += '<line x1="230" y1="230" x2="' + pol(r0 + 2, k * 45).replace(' ', '" y2="') + '" style="stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>';
    o += '<circle cx="230" cy="230" r="' + (r0 - 9) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.4"/>' +
      '<circle cx="230" cy="230" r="' + (r0 - 3) + '" style="fill:none;stroke:var(--gold2)" stroke-width="1" stroke-dasharray="3 3"/>';
  } else if (raio || balao || tranca) {
    // o centro: medalhão com o olho da tempestade, a máscara do Deadpool ou os óculos da Braids
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="' + (balao ? 2.6 : 1.6) + '"/>' +
      (raio ? eyeStormSvg(r0 - 10) : balao ? poolMaskSvg(190) : gogglesSvg(190));
  } else if (moeda) {
    // medalhão como uma moeda: o aro de dentro e o polegar cunhado no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
      '<circle cx="230" cy="230" r="' + (r0 - 10) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.4)" stroke-width="1" stroke-dasharray="2 2"/>' + thumbSvg(188);
  } else if (scal) {
    // medalhão com o olho da rainha dragão no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + dragonEyeSvg(191);
  } else if (torre) {
    // medalhão com a insígnia da Irmandade no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + creedSvg(190);
  } else if (lun) {
    // medalhão com o monóculo da Zara no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + monocleSvg(190);
  } else if (perg) {
    // medalhão com o orbe do cajado no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + orbSvg(193);
  } else if (gear) {
    // medalhão com o símbolo de mana phyrexiana no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + phyrexianSvg(191);
  } else if (mao) {
    // medalhão com o cutelo em chama azul no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + cleaverSvg(192);
  } else if (fenda) {
    // medalhão com o sigilo mardu no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + sigilSvg(194);
  } else if (ovo) {
    // medalhão com a cadeia da cascata no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + cascadeSvg(r0 - 13);
  } else if (folha) {
    // medalhão com a coroa de dez folhas
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + wreathSvg(r0 - 13);
  } else if (lua) {
    // a lua cheia do placar, com os três entalhes de garra no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 3) + '" style="fill:rgba(var(--gold2-rgb),.12)"/>' +
      '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + clawsSvg(181);
  } else if (leque) {
    // medalhão com o colar de pérolas
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' + pearlsSvg(r0 - 11);
  } else if (casco) {
    // medalhão com a bandana azul atrás do placar
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.8"/>' + maskSvg();
  } else if (runa) {
    // a lanterna acesa atrás do placar
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.8"/>' +
      '<circle cx="230" cy="226" r="24" style="fill:rgba(var(--gold2-rgb),.16)"/>' +
      '<path d="' + lanternPath(230, 224) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.5)" stroke-width="1.4" stroke-linejoin="round"/>';
  } else if (vial) {
    // medalhão com uma gota de sangue atrás do placar
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.8"/>' +
      '<path d="' + dropPath(230, 236, 38) + '" style="fill:rgba(var(--blood-rgb),.42);stroke:rgba(var(--blood2-rgb),.5)" stroke-width="1"/>';
  } else if (crown) {
    // o aro interno da coroa, cravejado
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.8"/>' +
      '<circle cx="230" cy="230" r="' + (r0 - 12) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.45)" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.1 7"/>';
  } else if (fang) {
    // nó entrelaçado no centro, como o emblema do escudo
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>';
    for (var kn = 0; kn < 3; kn++) o += '<ellipse cx="230" cy="230" rx="' + (r0 - 14) + '" ry="' + (r0 - 34) + '" transform="rotate(' + (kn * 60) + ' 230 230)" style="fill:none;stroke:rgba(var(--gold-rgb),.38)" stroke-width="1.4"/>';
  } else if (esp) {
    // botão de rosa no centro: pétalas fechadas em volta do placar
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>';
    for (var pe = 0; pe < 6; pe++) o += '<path d="' + petalPath(r0 - 30, r0 - 9, pe * 60 - 80, pe * 60 - 30) + '" style="fill:rgba(var(--blood2-rgb),.28);stroke:rgba(var(--blood2-rgb),.55)" stroke-width=".8"/>';
  } else if (reb) {
    // domo do Dalek: aro, cúpula e o olho azul aceso no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.8"/>' +
      '<circle cx="230" cy="230" r="' + (r0 - 14) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.4)" stroke-width="1"/>' +
      '<circle cx="230" cy="' + (230 - r0 + 2) + '" r="6" style="fill:rgba(var(--gold2-rgb),.35)"/>' +
      '<circle cx="230" cy="' + (230 - r0 + 2) + '" r="3" style="fill:rgb(var(--gold2-rgb));stroke:rgba(255,255,255,.7)" stroke-width=".8"/>';
  } else if (band) o += '<path d="' + shieldPath(50, 56) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="2"/>' +
    '<path d="' + shieldPath(42, 48) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.5)" stroke-width="1"/>';
  else if (!pin) o += '<circle cx="230" cy="230" r="' + (r0 - 7) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>';
  o += (rosa && !chamas ? '<circle cx="230" cy="230" r="' + (r0 - 12) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>' : '') +
    (fios ? xMark(0, r0 - 16, 2.4, .28) : '') +
    '<text class="ctr-n" x="230" y="243" text-anchor="middle">' + st.total + '</text>' +
    '<text class="ctr-l" x="230" y="260" text-anchor="middle">pontos</text></svg>';
  return o;
}

/* ============ curva de mana ============ */
function lancet(x, w, base, top) {
  var h = base - top, ah = Math.min(w * 0.8, h * 0.62), ys = top + ah;
  return 'M' + x.toFixed(1) + ' ' + base + 'V' + ys.toFixed(1) + 'Q' + x.toFixed(1) + ' ' + (top + ah * 0.28).toFixed(1) + ' ' + (x + w / 2).toFixed(1) + ' ' + top.toFixed(1) +
    'Q' + (x + w).toFixed(1) + ' ' + (top + ah * 0.28).toFixed(1) + ' ' + (x + w).toFixed(1) + ' ' + ys.toFixed(1) + 'V' + base + 'Z';
}
function barra(x, w, base, top) {
  var r = Math.min(4, (base - top) / 2);
  return 'M' + x.toFixed(1) + ' ' + base + 'V' + (top + r).toFixed(1) + 'Q' + x.toFixed(1) + ' ' + top.toFixed(1) + ' ' + (x + r).toFixed(1) + ' ' + top.toFixed(1) +
    'H' + (x + w - r).toFixed(1) + 'Q' + (x + w).toFixed(1) + ' ' + top.toFixed(1) + ' ' + (x + w).toFixed(1) + ' ' + (top + r).toFixed(1) + 'V' + base + 'Z';
}
function curveSvg(st, mode) {
  var narrow = window.innerWidth < 700, shape = M.curva === 'barra' ? barra : lancet;
  var W = narrow ? 460 : 760, H = narrow ? 316 : 336, ml = narrow ? 4 : 12, mr = ml, mb = 56, mt = 52;
  var cw = (W - ml - mr) / 8, bw = cw * (narrow ? 0.72 : 0.62), base = H - mb, maxH = base - mt;
  var max = 1; st.curve.forEach(function (c) { max = Math.max(max, c.n); });
  var keys = mode === 'cor' ? COLS : TYPES.filter(function (t) { return t.k !== 'ter'; });
  var defs = '', body = '';
  st.curve.forEach(function (col, i) {
    var x = ml + i * cw + (cw - bw) / 2, cx = x + bw / 2, h = col.n / max * maxH, top = base - h;
    if (col.n) {
      var path = shape(x, bw, base, top), y = base, segs = '';
      defs += '<clipPath id="lc' + i + '"><path d="' + path + '"/></clipPath>';
      keys.forEach(function (k) {
        var v = (mode === 'cor' ? col.c : col.t)[k.k] || 0; if (!v) return;
        var sh = v / max * maxH; y -= sh;
        segs += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (sh + 0.6).toFixed(1) + '" fill="' + k.c + '"><title>Custo ' + (i === 7 ? '7 ou mais' : i) + ', ' + esc(k.n) + ': ' + v + '</title></rect>' +
          '<line x1="' + x.toFixed(1) + '" x2="' + (x + bw).toFixed(1) + '" y1="' + (y + sh).toFixed(1) + '" y2="' + (y + sh).toFixed(1) + '" style="stroke:var(--bg)" stroke-width="2"/>';
      });
      body += '<g class="lanc" style="--i:' + i + '"><g clip-path="url(#lc' + i + ')">' + segs +
        (shape === lancet ? '<line x1="' + cx.toFixed(1) + '" x2="' + cx.toFixed(1) + '" y1="' + top.toFixed(1) + '" y2="' + base + '" style="stroke:rgba(var(--bg-rgb),.4)" stroke-width="2"/>' : '') +
        '<rect x="' + x.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + (bw * 0.5).toFixed(1) + '" height="' + h.toFixed(1) + '" fill="rgba(255,255,255,.07)"/></g>' +
        '<path d="' + path + '" style="fill:none;stroke:var(--gold)" stroke-width="1.7"/></g>';
    } else {
      body += '<path d="' + shape(x, bw, base, base - 12) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.32)" stroke-dasharray="3 4"/>';
      top = base - 12;
    }
    body += '<text class="n" x="' + cx.toFixed(1) + '" y="' + (top - 9).toFixed(1) + '" text-anchor="middle">' + col.n + '</text>' +
      '<text x="' + cx.toFixed(1) + '" y="' + (base + 23) + '" text-anchor="middle">' + (i === 7 ? '7+' : i) + '</text>';
  });
  var ax = ml + cw / 2 + Math.min(st.avg, 7) * cw;
  body = '<line x1="' + ax.toFixed(1) + '" x2="' + ax.toFixed(1) + '" y1="24" y2="' + (base + 6) + '" style="stroke:var(--gold2)" stroke-width="1.4" stroke-dasharray="2 5"/>' + body +
    '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + base + '" y2="' + base + '" style="stroke:rgba(var(--gold-rgb),.5)"/>' +
    '<text class="avg" x="' + (ax > W * 0.6 ? ax - 7 : ax + 7).toFixed(1) + '" y="20"' + (ax > W * 0.6 ? ' text-anchor="end"' : '') + '>CMC médio ' + fmt(st.avg) + '</text>' +
    '<text x="' + (W / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + (narrow ? 'Custo de mana, sem contar terrenos' : 'Custo de mana convertido, sem contar terrenos') + '</text>';
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Curva de mana: ' +
    st.curve.map(function (c, i) { return pl(c.n, 'carta', 'cartas') + ' de custo ' + (i === 7 ? '7 ou mais' : i); }).join(', ') + '"><defs>' + defs + '</defs>' + body + '</svg>';
}

/* ============ leitura do deck ============ */
function refTxt(g, def) { return g && g.ref ? g.ref[0] + ' a ' + g.ref[1] : def; }
function fillTxt(t, st) {
  return esc(t || '').replace(/\{(\w+)=(\w+)\}/g, function (m, k, v) { var x = st.mk[k]; return x ? (x.v[v] || 0) : 0; })
    .replace(/\{(\w+)\}/g, function (m, k) { var x = st.mk[k]; return x ? x.n : m; });
}
function readings(st) {
  var r = [];
  function add(cls, b, t) { r.push('<li class="' + cls + '"><i class="st"></i><div><b>' + b + '</b> <span>' + t + '</span></div></li>'); }
  (D.leituras || []).forEach(function (l) {
    var i, g, w, n, x, parts;
    if (l.tipo === 'terrenos') {
      var src = st.lands + st.mdfc, rf = l.ref || [35, 37];
      w = src < (l.min == null ? 35 : l.min);
      add(w ? 'warn' : 'ok', pl(src, 'fonte de terreno', 'fontes de terreno') + '.',
        st.lands + ' terrenos' + (st.mdfc ? ' e ' + pl(st.mdfc, 'carta dupla com terreno no verso', 'cartas duplas com terreno no verso') : '') +
        '. A referência usual é de ' + rf[0] + ' a ' + rf[1] + (w ? '; com CMC médio de ' + fmt(st.avg) + ', a base está no limite.' : '.') +
        (st.tapped ? ' ' + pl(st.tapped, 'terreno entra sempre virado', 'terrenos entram sempre virados') + '.' : ''));
    } else if (l.tipo === 'agrupamento') {
      i = gi(l.g); g = st.grp[i]; w = g.hard < l.min;
      add(w ? 'warn' : 'ok', pl(g.hard, esc(l.rotulo[0]), esc(l.rotulo[1])) + '.',
        (g.soft ? 'Mais ' + g.soft + ' ' + esc(l.passagem || 'de passagem') + '.' : '') + (G[i].ref ? ' Referência: ' + refTxt(G[i]) + '.' : '') +
        (w && l.alerta ? ' ' + esc(l.alerta) : '') + (l.farto && g.hard >= l.farto.min ? ' ' + esc(l.farto.texto) : ''));
    } else if (l.tipo === 'remocao') {
      i = gi(l.g); var mr = l.massa_ref || [3, 5];
      w = st.wipes > (l.massa_max == null ? 5 : l.massa_max) || (l.min != null && st.grp[i].hard < l.min);
      // "separada": as limpezas têm agrupamento próprio (K'rrik), então não são parte das remoções contadas
      add(w ? 'warn' : 'ok', l.separada ? pl(st.grp[i].hard, 'remoção pontual', 'remoções pontuais') + ', e ' + pl(st.wipes, 'limpeza', 'limpezas') + ' à parte.'
        : pl(st.grp[i].hard, 'remoção', 'remoções') + ', sendo ' + pl(st.wipes, 'em massa', 'em massa') + '.',
        'Referência: ' + refTxt(G[i], '8 a 12') + ' no total, com ' + mr[0] + ' a ' + mr[1] + ' globais.' + (w && l.alerta ? ' ' + esc(l.alerta) : ''));
    } else if (l.tipo === 'contagem') {
      x = st.mk[l.marcador]; n = x.n;
      w = (l.min != null && n < l.min) || (l.max != null && n > l.max);
      parts = [];
      // nome com vírgula (Dionus, Elvish Archdruid) se confunde com o separador: aí a lista usa ponto e vírgula
      if (l.listar && x.names.length) parts.push(esc(x.names.join(x.names.some(function (n) { return n.indexOf(',') >= 0; }) ? '; ' : ', ')) + '.');
      if (l.texto) parts.push(fillTxt(l.texto, st));
      if (w && l.alerta) parts.push(esc(l.alerta)); else if (!w && l.ok) parts.push(esc(l.ok));
      add(w ? 'warn' : 'ok', pl(n, esc(l.rotulo[0]), esc(l.rotulo[1])) + '.', parts.join(' '));
    } else if (l.tipo === 'tribo') {
      var pct = st.cri ? st.tribo / st.cri * 100 : 0;
      w = st.cri && pct < (l.min_pct == null ? 75 : l.min_pct);
      add(w ? 'warn' : 'ok', st.tribo + ' de ' + st.cri + ' criaturas são ' + esc(TRIBO.plural || TRIBO.nome) + '.',
        'Densidade tribal de ' + fmt(pct, 0) + '%' + (l.texto ? ': ' + esc(l.texto) : '.'));
    } else if (l.tipo === 'proporcao') {
      var a = st.mk[l.a].n, b = st.mk[l.b].n, ra = l.rotulo || [MK[l.a].nome, MK[l.a].nome], rb = l.rotulo_b || [MK[l.b].nome, MK[l.b].nome];
      w = a < b * (l.fator || 1);
      add(w ? 'warn' : 'ok', pl(a, esc(ra[0]), esc(ra[1])) + ' para ' + pl(b, esc(rb[0]), esc(rb[1])) + '.', esc(w ? (l.alerta || '') : (l.ok || '')));
    } else if (l.tipo === 'curva') {
      w = (l.cmc_max != null && st.avg > l.cmc_max) || (l.topo_max != null && st.top > l.topo_max);
      add(w ? 'warn' : 'ok', fmt(st.nonland ? st.low / st.nonland * 100 : 0, 0) + '% das cartas que não são terreno custam 2 ou menos.',
        'CMC médio de ' + fmt(st.avg) + ', com o pico da curva em ' + peak(st) + '.' + (w && l.alerta ? ' ' + esc(l.alerta) : ''));
    }
  });
  return r.join('');
}
function peak(st) { var m = 0, k = 0; st.curve.forEach(function (c, i) { if (c.n > m) { m = c.n; k = i; } }); return (k === 7 ? '7 ou mais' : k) + ' manas'; }

/* ============ visão geral ============ */
function eixoN(st) {
  var e = M.eixo; if (!e) return st.cri;
  if (e.marcador === 'tribo') return st.tribo;
  return st.mk[e.marcador] ? st.mk[e.marcador].n : 0;
}
function heroHtml(st, cmds) {
  var cmd = cmds[0], par = cmds.length > 1;
  var cap = M.capa || {}, art = !!cap.tem, larga = cap.moldura === 'larga';
  var verbos = (M.verbos || []).length ? ' O plano cabe em três verbos: ' + esc(M.verbos.join(', ')) + '.' : '';
  var nome = M.cmd || (cmd ? cmd.n : '');
  var facts = '<dl class="facts"><div><dt>cartas</dt><dd>' + st.n + '</dd></div><div><dt>CMC médio</dt><dd>' + fmt(st.avg) + '</dd></div>' +
    '<div><dt>' + esc(M.eixo && M.eixo.rotulo ? M.eixo.rotulo : 'criaturas') + '</dt><dd>' + eixoN(st) + '</dd></div><div><dt>fontes de terreno</dt><dd>' + (st.lands + st.mdfc) + '</dd></div>' +
    '<div><dt>foils</dt><dd>' + st.foils + '</dd></div></dl>';
  var peca = M.grafico === 'rosacea' ? 'pétala' : M.grafico === 'fios' ? 'lâmina' : M.grafico === 'chamas' ? 'chama' : M.grafico === 'estandartes' ? 'estandarte' : M.grafico === 'alfinetes' ? 'alfinete' : M.grafico === 'rebites' ? 'painel' : M.grafico === 'espinhos' ? 'espinho' : M.grafico === 'presas' ? 'presa' : M.grafico === 'coroa' ? 'ponta' : M.grafico === 'frascos' ? 'frasco' : M.grafico === 'runas' ? 'pedra' : M.grafico === 'cascos' ? 'casco' : M.grafico === 'leque' ? 'raio' : M.grafico === 'luas' ? 'lua' : M.grafico === 'raios' ? 'relâmpago' : M.grafico === 'baloes' ? 'balão' : M.grafico === 'trancas' ? 'trança' : M.grafico === 'folhas' ? 'galho' : M.grafico === 'ovos' ? 'ovo' : M.grafico === 'fendas' ? 'fenda' : M.grafico === 'moedas' ? 'pilha' : M.grafico === 'maos' ? 'mão' : M.grafico === 'engrenagens' ? 'engrenagem' : M.grafico === 'pergaminhos' ? 'pergaminho' : M.grafico === 'lunetas' ? 'luneta' : M.grafico === 'torres' ? 'torre' : M.grafico === 'escamas' ? 'fileira' : M.grafico === 'asas' && NG === 8 ? 'pena' : 'fatia';
  var chart = '<figure class="rosa' + (M.grafico === 'asas' && NG === 8 ? ' asas' : '') + '">' + chartSvg(st) + '<figcaption>Cada ' + peca +
    (peca === 'frasco' ? ' é um agrupamento, e o sangue sobe nele com a soma das notas.' : peca === 'pedra' ? ' é um agrupamento: a luz sobe nela com a soma das notas, e a runa acende quando chega lá.' : peca === 'casco' ? ' é um agrupamento: a cor sobe nele com a soma das notas, e cada placa do meio acende quando a cor passa dela.' : peca === 'raio' ? ' do leque é um agrupamento: a cor sobe nele com a soma das notas, e cada degrau acende quando a cor passa dele.' : peca === 'lua' ? ' é um agrupamento: vai de nova a cheia com a soma das notas.' : peca === 'relâmpago' ? ' é um agrupamento, e o relâmpago vai até a soma das notas.' : peca === 'balão' ? ' é um agrupamento, e cresce com a soma das notas.' : peca === 'trança' ? ' é um agrupamento: os gomos acendem até a soma das notas.' : peca === 'pilha' ? ' de moedas é um agrupamento: cresce em proporção à soma das notas, e na mais alta a moeda do topo salta.' : peca === 'mão' ? ' é um agrupamento: sobe da cova em proporção à soma das notas, e a mais alta abre os dedos.' : peca === 'engrenagem' ? ' é um agrupamento: os dez dentes acendem em proporção à soma das notas, e a mais cheia ganha o brilho verde do óleo phyrexiano.' : peca === 'pergaminho' ? ' é um agrupamento: se desenrola em proporção à soma das notas, e o mais cheio ganha o lacre.' : peca === 'luneta' ? ' é um agrupamento: estica em proporção à soma das notas, e a mais cheia ganha o brilho na lente.' : peca === 'torre' ? ' é um agrupamento: sobe em proporção à soma das notas, as janelas acendem com a altura, e a mais alta ganha a águia.' : peca === 'fileira' ? ' de escamas é um agrupamento: as escamas acendem em proporção à soma das notas, e a mais cheia solta a labareda.' : peca === 'fenda' ? ' é um agrupamento: abre e acende em proporção à soma das notas, e a mais cheia solta uma asa.' : peca === 'ovo' ? ' é um agrupamento: a cor acende e as rachaduras se abrem em proporção à soma das notas, e o mais cheio eclode.' : peca === 'galho' ? ' é um agrupamento com sete folhas, que acendem em proporção à soma das notas: o mais cheio tem as sete.' : ' é um agrupamento e sua área é a soma das notas.') + ' Toque ' + (/^(estandarte|alfinete|painel|espinho|frasco|casco|raio|balão|relâmpago|galho|ovo|pergaminho)$/.test(peca) ? 'num ' : 'numa ') + peca + ' para abrir no tabelão.</figcaption></figure>';
  // dois comandantes (parceiros): nome, custo, tipo e texto de cada um
  var sub = '<p class="hero-sub' + (par ? ' par' : '') + '">' + (par ? cmds.map(function (c) { return esc(c.n) + mana(c.cost); }).join(' <span class="hero-mais">+</span> ') : esc(nome) + (cmd ? mana(cmd.cost) : '')) + '</p>';
  // parceiros do mesmo tipo (as Tartarugas) mostram a linha uma vez só, com as duas forças
  var linhas = []; cmds.forEach(function (c) { if (linhas.indexOf(c.line) < 0) linhas.push(c.line); });
  var tipo = !cmd ? '' : linhas.length === 1 ? '<p class="hero-type">' + esc(cmd.line) + (cmds.some(function (c) { return c.pt; }) ? ', ' + cmds.map(function (c) { return esc(c.pt || '—'); }).join(' e ') : '') + '</p>' :
    '<p class="hero-type">' + cmds.map(function (c) { return esc(c.line) + (c.pt ? ', ' + esc(c.pt) : ''); }).join(' · ') + '</p>';
  var fx = cmds.map(function (c) { return c.fx ? '<p class="hero-fx">' + (par ? '<b>' + esc(c.n.split(',')[0]) + ':</b> ' : '') + rich(c.fx) + '</p>' : ''; }).join('');
  var lede = (M.lede || verbos) ? '<p class="hero-lede">' + esc(M.lede || '') + verbos + '</p>' : '';
  if (!larga) {
    return '<div class="hero retrato' + (art ? '' : ' sem-capa') + '">' +
      (art ? '<figure class="port"><div class="port-img" role="img" aria-label="' + esc(cap.alt || 'Arte de ' + nome) + '"></div>' +
        '<svg class="port-fr" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0.8,139.2V47.6Q0.8,14.6 50,1Q99.2,14.6 99.2,47.6V139.2Z"/><path class="in" d="M4.2,135.8V48.8Q4.2,18.4 50,5.8Q95.8,18.4 95.8,48.8V135.8Z"/></svg>' +
        '<figcaption>' + esc(cap.credito || 'Arte da carta, © Wizards of the Coast') + '</figcaption></figure>' : '') +
      '<div class="hero-txt"><h1>' + esc(M.painel) + '</h1>' + sub + tipo + fx + lede + facts + '</div>' + chart + '</div>';
  }
  return '<div class="hero larga' + (art ? '' : ' sem-capa') + '"><div class="hero-top"><div class="hero-txt"><h1>' + esc(M.painel) + '</h1>' +
    (art && cmd ? '' : sub + tipo) +
    fx + lede + facts + '</div>' +
    (art && cmd ? '<figure class="capa-l"><button class="cmd-art" data-card="' + esc(cmd.id) + '" aria-label="' + esc((cap.alt || 'Arte de ' + nome) + '. Abrir a carta ' + cmd.n) + '">' +
      '<span class="cmd-plate"><b>' + esc(nome) + '</b>' + mana(cmd.cost) + '<small>' + esc(cmd.line) + (cmd.pt ? ', ' + esc(cmd.pt) : '') + '</small></span></button>' +
      '<figcaption>' + esc(cap.credito || 'Arte da carta, © Wizards of the Coast') + '</figcaption></figure>' : '') + '</div>' + chart + '</div>';
}
function coresPanel(st) {
  var colStack = COLS.filter(function (c) { return st.cols[c.k]; }).map(function (c) {
    return '<i style="flex:' + st.cols[c.k] + ';background:' + c.c + '" title="' + esc(c.n) + ': ' + st.cols[c.k] + '"></i>';
  }).join('');
  var colLegend = COLS.filter(function (c) { return st.cols[c.k]; }).map(function (c) { return '<span><i style="background:' + c.c + '"></i>' + esc(c.n) + ' ' + st.cols[c.k] + '</span>'; }).join('');
  var nSrc = st.lands + st.mdfc, maxL = 1;
  IDENT.forEach(function (ch) { maxL = Math.max(maxL, st.src[ch]); }); maxL = Math.max(maxL, st.srcC);
  function bar(lab, n, c) { return '<div class="bar"><span>' + lab + '</span><span class="bar-t"><i style="width:' + (n / maxL * 100).toFixed(1) + '%;--c:' + c + '"></i></span><b class="num">' + n + '</b></div>'; }
  var lands = IDENT.map(function (ch) { return bar('Geram ' + CNOME[ch].toLowerCase(), st.src[ch], DUO[ch]); }).join('') + (st.srcC ? bar('Só incolor', st.srcC, '#9aa6c4') : '');
  var h = '<fieldset class="pn"><legend>Cores e base de mana</legend><h3 class="sub">Cartas por cor, sem terrenos</h3><div class="stack">' + colStack + '</div><div class="legend">' + colLegend + '</div>' +
    '<h3 class="sub">O que os terrenos geram</h3><div class="bars">' + lands + '</div>';
  if (IDENT.length >= 2) {
    var pipT = 0, srcT = 0, mx = 1;
    IDENT.forEach(function (ch) { pipT += st.pip[ch]; srcT += st.src[ch]; mx = Math.max(mx, st.pip[ch], st.src[ch]); });
    pipT = pipT || 1; srcT = srcT || 1;
    h += '<h3 class="sub">Demanda e oferta de mana</h3><div class="duo">' + IDENT.map(function (ch) {
      var pip = st.pip[ch], src = st.src[ch];
      return '<span class="lab">' + CNOME[ch] + '</span><div class="pair">' +
        '<div><i style="width:' + (pip / mx * 62).toFixed(1) + '%;background:' + DUO[ch] + '"></i><small>' + fmt(pip, pip % 1 ? 1 : 0) + ' símbolos, ' + fmt(pip / pipT * 100, 0) + '%</small></div>' +
        '<div><i style="width:' + (src / mx * 62).toFixed(1) + '%;background:' + DUO[ch] + ';opacity:.5"></i><small>' + src + ' fontes, ' + fmt(src / srcT * 100, 0) + '%</small></div></div>';
    }).join('') + '</div><p class="pn-note">Linha de cima: símbolos nos custos. Linha de baixo: terrenos e cartas duplas que geram a cor, de ' + nSrc + ' fontes.</p>';
  } else if (IDENT.length === 1) {
    var ch = IDENT[0], pw = st.pw[ch], maxW = Math.max(1, pw[0], pw[1], pw[2], pw[3]), s1 = '{' + ch + '}';
    var wl = [[s1 + s1 + s1, pw[3], ' ou mais'], [s1 + s1, pw[2], ''], [s1, pw[1], ''], ['', pw[0], '']];
    h += '<h3 class="sub">Peso do ' + CNOME[ch].toLowerCase() + ' nos custos</h3><div class="bars">' + wl.map(function (w) {
      return '<div class="bar"><span>' + (w[0] ? mana(w[0]) + w[2] : 'Sem ' + CNOME[ch].toLowerCase()) + '</span><span class="bar-t"><i style="width:' + (w[1] / maxW * 100).toFixed(1) + '%;--c:' + (w[0] ? DUO[ch] : '#9aa6c4') + '"></i></span><b class="num">' + w[1] + '</b></div>';
    }).join('') + '</div><p class="pn-note">Cartas que não são terreno, pelo número de símbolos ' + CNOME[ch].toLowerCase().replace(/o$/, 'os').replace(/l$/, 'is').replace(/e$/, 'es') + ' no custo.</p>';
  }
  return h + '</fieldset>';
}
function renderGeral() {
  var cs = deck(), st = stats(cs);
  ui.narrow = window.innerWidth < 700;
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

  var anyVal = RELS.some(function (r) { return st.relValN[r.k]; });
  var relRows = RELS.map(function (r) {
    var n = st.rel[r.k] || 0;
    return '<tr><th scope="row">' + relB(r.k) + ' ' + r.n + '</th><td class="num"><b>' + n + '</b></td><td class="num">' + fmt(st.n ? n / st.n * 100 : 0, 0) + '%</td>' +
      (st.usdN ? '<td class="num">US$ ' + fmt(st.relUsd[r.k] || 0) + '</td>' : '') +
      (anyVal ? '<td class="num">' + (st.relValN[r.k] ? 'R$ ' + fmt(st.relVal[r.k]) : '—') + '</td><td class="num">' + (st.relValN[r.k] ? 'R$ ' + fmt(st.relVal[r.k] / st.relValN[r.k]) : '—') + '</td>' : '') + '</tr>';
  }).join('') + (st.usdN ? '<tr class="tot-r"><th scope="row">Deck inteiro</th><td class="num"><b>' + st.n + '</b></td><td></td><td class="num"><b>US$ ' + fmt(st.usd) + '</b></td>' + (anyVal ? '<td></td><td></td>' : '') + '</tr>' : '');

  var sets = Object.keys(st.sets).sort(function (a, b) { return st.sets[b] - st.sets[a] || a.localeCompare(b); }).slice(0, 5);
  var maxS = sets.length ? st.sets[sets[0]] : 1;
  var setBars = sets.map(function (s) {
    return '<div class="bar"><span>' + esc(s) + '</span><span class="bar-t"><i style="width:' + (st.sets[s] / maxS * 100).toFixed(1) + '%;--c:var(--gold)"></i></span><b class="num">' + st.sets[s] + '</b></div>';
  }).join('');

  var inDeck = {}; cs.forEach(function (c) { inDeck[c.id] = c; });
  var combos = D.combos.map(function (k) {
    var miss = k.p.filter(function (id) { return !inDeck[id]; });
    return '<div class="combo"><span class="kind">' + esc(k.kind) + '</span><h3>' + esc(k.n) + '</h3><div class="pcs">' +
      k.p.map(function (id) { var c = byId(id); return c ? chip(c) : ''; }).join('') + '</div><p>' + esc(k.t) + '</p>' +
      (miss.length ? '<p class="miss">Falta peça: ' + miss.map(function (id) { var c = byId(id); return esc(c ? c.n : id); }).join(', ') + ' fora do deck.</p>' : '') + '</div>';
  }).join('');

  var h = heroHtml(st, cs.filter(function (c) { return c.cmd; }));

  h += '<div class="grid g-21">' +
    '<fieldset class="pn curve"><legend>Curva de mana</legend><div class="pn-tools"><div class="seg" role="group" aria-label="Dividir as colunas">' +
    '<button data-act="curve" data-v="tipo" data-fid="cv1" aria-pressed="' + (ui.curve === 'tipo') + '">Por tipo</button>' +
    '<button data-act="curve" data-v="cor" data-fid="cv2" aria-pressed="' + (ui.curve === 'cor') + '">Por cor</button></div></div>' +
    curveSvg(st, ui.curve) +
    '<div class="legend">' + (ui.curve === 'cor' ? COLS.filter(function (c) { return st.cols[c.k]; }) : TYPES.filter(function (t) { return t.k !== 'ter' && st.types[t.k]; })).map(function (k) {
      return '<span><i style="background:' + k.c + '"></i>' + esc(k.n) + ' ' + (ui.curve === 'cor' ? st.cols[k.k] : st.types[k.k]) + '</span>';
    }).join('') + '</div></fieldset>' +
    '<fieldset class="pn"><legend>Placar do deck</legend><div class="score-big"><b>' + st.total + '</b><span>pontos</span></div>' +
    '<table class="kv"><tr><th scope="row">CMC médio</th><td class="num">' + fmt(st.avg) + '</td><td class="num"><b>' + st.cmcPts + '</b> pts</td></tr>' +
    '<tr><th scope="row">Potencial de aceleração</th><td class="num">' + fmt(st.accX) + '</td><td class="num"><b>' + st.accPts + '</b> pts</td></tr>' +
    '<tr><th scope="row">Soma das notas</th><td></td><td class="num"><b>' + st.crit + '</b> pts</td></tr></table>' +
    '<h3 class="sub">Tiers das ' + st.n + ' cartas</h3><div class="stack">' + TIERS.filter(function (t) { return st.tier[t.k]; }).map(function (t) {
      return '<i class="t' + t.k + '" style="flex:' + st.tier[t.k] + '" title="Tier ' + t.k + ': ' + st.tier[t.k] + '"></i>'; }).join('') + '</div>' +
    '<div class="legend">' + TIERS.map(function (t) { return '<span>' + tierB(t.k, true) + ' ' + (st.tier[t.k] || 0) + '</span>'; }).join('') +
    '<button class="linkish" data-act="go" data-v="tier">Abrir a tier list</button></div>' +
    '<details class="how"><summary>Como a conta é feita</summary><p>É a mesma lógica da sua planilha do Vito. O CMC médio vale de 1 a 5 pontos, e quanto mais baixo, melhor. O potencial de aceleração é a soma da coluna ' + esc(G[IR].k) + ' dividida pelo CMC médio, e cada 0,5 vale 5 pontos, até 90. O restante é a soma das notas de 0 a 3 que cada carta recebe nos ' + NUM[NG] + ' agrupamentos. Como os agrupamentos mudam de um deck para outro, o total serve para acompanhar este deck ao longo das trocas, não para compará-lo com outro.</p></details>' +
    '</fieldset></div>';

  h += custoPanel(cs, st);
  h += '<div class="grid g-11">' +
    '<fieldset class="pn"><legend>Os ' + NUM[NG] + ' agrupamentos</legend><div class="gl">' + groups + '</div>' +
    '<p class="pn-note">O número em destaque conta as cartas com nota 2 ou 3; o que vem depois do sinal de mais, as de nota 1. A faixa tracejada, onde aparece, é a referência usual de Commander, e vale como regra de bolso.</p></fieldset>' +
    '<fieldset class="pn"><legend>Leitura do deck</legend><ul class="read">' + readings(st) + '</ul></fieldset></div>';
  h += estrategiaPanel();

  h += '<div class="grid g-111">' + coresPanel(st) +
    '<fieldset class="pn"><legend>Tipos de carta</legend><div class="bars">' + typeBars + '</div>' +
    '<h3 class="sub">Edições mais presentes</h3><div class="bars">' + setBars + '</div></fieldset>' +
    '<fieldset class="pn"><legend>Relevância e valor</legend><table class="rel-t"><thead><tr><th></th><th>Qtd</th><th>Do deck</th>' + (st.usdN ? '<th>US$</th>' : '') + (anyVal ? '<th>R$</th><th>Média R$</th>' : '') + '</tr></thead><tbody>' + relRows + '</tbody></table>' +
    '<p class="pn-note">' + (st.usdN ? 'Dólar: preço do Scryfall' + (M.scryfall ? ', consultado em ' + fdate(M.scryfall) : '') + ', na impressão da sua lista e em foil quando a carta é foil' + (st.usdSem ? '; ' + pl(st.usdSem, 'carta está', 'cartas estão') + ' sem preço lá' : '') + '. ' : '') +
    (anyVal ? 'Reais: somam apenas as cartas com preço preenchido.' : 'Para ver em reais, preencha o preço em cada carta.') +
    ' <button class="linkish" data-act="go" data-v="ctrl">Abrir o painel de controle</button></p></fieldset></div>';

  if (D.combos.length) h += '<fieldset class="pn"><legend>Combos e linhas de jogo</legend><div class="combos">' + combos + '</div></fieldset>';
  h += edhPanel(cs);

  var el = $('#v-geral');
  el.className = 'view' + (ui.first ? ' anim' : '');
  el.innerHTML = h;
  ui.first = false;
}

/* ============ estratégia ============ */
var FASES = [{ k: 'inicio', n: 'Início' }, { k: 'meio', n: 'Meio' }, { k: 'fim', n: 'Fim' }];
var CONTRA = { aggro: 'Aggro', voltron: 'Voltron', combo: 'Combo', controle: 'Controle', stax: 'Stax', aristocratas: 'Aristocratas', spellslinger: 'Spellslinger', ramp: 'Ramp e big mana' };
var RES = { forte: 'Vai bem', equilibrado: 'Equilibrado', fraco: 'Vai mal' };
function estrategiaPanel() {
  var e = D.estrategia; if (!e) return '';
  var fases = FASES.filter(function (f) { return e[f.k]; }).map(function (f) {
    var x = e[f.k];
    function lst(arr, cls, tit) { return arr && arr.length ? '<h4>' + tit + '</h4><ul class="' + cls + '">' + arr.map(function (t) { return '<li>' + rich(t) + '</li>'; }).join('') + '</ul>' : ''; }
    return '<div class="fase"><h3>' + f.n + (x.turnos ? ' <small>turnos ' + esc(x.turnos) + '</small>' : '') + '</h3><p class="plano">' + rich(x.plano) + '</p>' +
      lst(x.fortes, 'fx-mais', 'Fortalezas') + lst(x.fracos, 'fx-menos', 'Fraquezas') + '</div>';
  }).join('');
  var ordem = { forte: 0, equilibrado: 1, fraco: 2 };
  var vs = (e.contra || []).slice().sort(function (a, b) { return ordem[a.resultado] - ordem[b.resultado]; }).map(function (c) {
    return '<div class="vs vs-' + esc(c.resultado) + '"><div class="vs-h"><b>' + esc(CONTRA[c.tipo] || c.tipo) + '</b><span>' + RES[c.resultado] + '</span></div><p>' + rich(c.porque) + '</p></div>';
  }).join('');
  return '<fieldset class="pn estr"><legend>Estratégia</legend>' + (fases ? '<div class="fases">' + fases + '</div>' : '') +
    (vs ? '<h3 class="sub">Contra quem</h3><div class="vss">' + vs + '</div>' : '') + '</fieldset>';
}

/* ============ comunidade ============ */
var BANDS = [
  { k: 's-hi', n: '+40% ou mais', c: '#e2be70' }, { k: 's-md', n: '+10% a +39%', c: '#7fb0ff' }, { k: 's-lo', n: '+1% a +9%', c: '#6f7aa6' },
  { k: 's-neg', n: 'zero ou negativa', c: '#f07a8c' }, { k: 's-na', n: 'fora da página', c: 'rgba(255,255,255,.12)' }
];
function synCls(v) { return v == null ? 's-na' : v >= 40 ? 's-hi' : v >= 10 ? 's-md' : v > 0 ? 's-lo' : 's-neg'; }
function synTxt(v) { return v == null ? '—' : (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '%'; }
function synB(v) { return '<span class="syn ' + synCls(v) + '">' + (v == null ? 'fora da página' : synTxt(v)) + '</span>'; }
function edhPanel(cs) {
  if (!EDH) return '';
  var on = cs.filter(function (c) { return c.syn != null; });
  var hi = on.filter(function (c) { return c.syn >= 50; });
  var tsum = 0, tcol = ['rgb(var(--g2))', 'rgb(var(--g6))', 'rgb(var(--g4))', 'rgb(var(--g5))', 'rgb(var(--g7))'];
  (EDH.temas || []).forEach(function (t) { tsum += t[1]; });
  var themes = (EDH.temas || []).map(function (t, i) { return '<i style="flex:' + t[1] + ';background:' + tcol[i % 5] + '" title="' + esc(t[0]) + ': ' + t[1] + '%"></i>'; }).join('') +
    '<i style="flex:' + Math.max(0, 100 - tsum) + ';background:rgba(255,255,255,.08)" title="Outros temas"></i>';
  var tleg = (EDH.temas || []).map(function (t, i) { return '<span><i style="background:' + tcol[i % 5] + '"></i>' + esc(t[0]) + ' ' + t[1] + '%</span>'; }).join('');
  /* distribuição das cartas que não são terreno por faixa de sinergia */
  var nb = {}, tot = 0;
  cs.forEach(function (c) { if (c.cmd || c.land || c.custom) return; var k = synCls(c.syn); nb[k] = (nb[k] || 0) + c.q; tot += c.q; });
  var bon = BANDS.filter(function (b) { return nb[b.k]; });
  var inDeck = {}, radar = {}; cs.forEach(function (c) { inDeck[c.id] = 1; }); cands().forEach(function (c) { radar[c.id] = 1; });
  function nomes(a) { return lista(a.map(function (nm) { var id = slug(nm), c = (inDeck[id] || radar[id]) ? byId(id) : null; return c ? '<button class="linkish" data-card="' + esc(id) + '">' + esc(c.n) + '</button>' : esc(nm); })); }
  var listas = (EDH.listas || []).map(function (l) {
    var ok = [], miss = [];
    l.cards.forEach(function (nm) { (inDeck[slug(nm)] ? ok : miss).push(nm); });
    var noRadar = miss.length && miss.filter(function (nm) { return radar[slug(nm)]; }).length === miss.length;
    var t = miss.length ? (miss.length === 1 ? 'Falta ' : 'Faltam ') + nomes(miss) + (noRadar ? (miss.length === 1 ? ', que já está no radar.' : ', que já estão no radar.') : '.') : 'Todas no deck.';
    return '<li><b class="num">' + ok.length + ' de ' + l.cards.length + '</b><span><em>' + esc(l.n) + '.</em> ' + t + '</span></li>';
  }).join('');
  var out = cands().map(E).concat(D.cards.map(E)).filter(function (c) { return !c.inDeck && c.syn != null; }).map(function (c) { return { n: c.n, syn: c.syn, c: c }; })
    .concat(poolOpen().filter(function (p) { return p.syn != null; }).map(function (p) { return { n: p.n, syn: p.syn, c: null }; }))
    .sort(function (a, b) { return b.syn - a.syn; }).slice(0, 12);
  var l1 = out.map(function (o) { return '<li>' + (o.c ? chip(o.c) : '<span class="plain">' + esc(o.n) + '</span>') + '<b class="num">' + synTxt(o.syn) + '</b></li>'; }).join('');
  function lst(a) {
    return a.length ? a.map(function (c) { return '<li>' + chip(c) + '<b class="num">' + synTxt(c.syn) + '</b></li>'; }).join('') : '<li class="hint">Nenhuma carta nesta situação.</li>';
  }
  var d1 = on.filter(function (c) { return c.syn >= 40 && c.rel === 'BAX'; }).sort(function (a, b) { return b.syn - a.syn; });
  var d2 = on.filter(function (c) { return c.syn <= 10 && c.rel === 'INS' && !c.land; }).sort(function (a, b) { return a.syn - b.syn; });
  var pc = EDH.precon, npc = pc ? hi.filter(function (c) { return c.set === pc.set; }).length : 0;
  return '<fieldset class="pn"><legend>Seu deck e a comunidade</legend>' +
    '<p class="hint">Comparação com as recomendações do <a href="' + esc(EDH.url) + '" target="_blank" rel="noopener noreferrer">' + esc(EDH.fonte) + (EDH.pagina ? ' para ' + esc(EDH.pagina) : '') + '</a>, consultadas em ' + esc(EDH.lido) + '. ' +
    on.length + ' das ' + cs.length + ' cartas únicas do seu deck aparecem lá.</p>' +
    (tleg ? '<h3 class="sub">Como a comunidade monta ' + artigo() + ' ' + esc(M.curto || 'comandante') + '</h3><div class="stack">' + themes + '</div><div class="legend">' + tleg + '</div>' : '') +
    (tot ? '<h3 class="sub">Sinergia das ' + tot + ' cartas que não são terreno</h3><div class="stack">' +
      bon.map(function (b) { return '<i style="flex:' + nb[b.k] + ';background:' + b.c + '" title="' + b.n + ': ' + nb[b.k] + '"></i>'; }).join('') + '</div><div class="legend">' +
      bon.map(function (b) { return '<span><i style="background:' + b.c + '"></i>' + b.n + ' ' + nb[b.k] + '</span>'; }).join('') + '</div>' : '') +
    (listas ? '<h3 class="sub">As listas da página</h3><ul class="edh-l">' + listas + '</ul>' : '') +
    '<div class="grid g-111 edh"><div><h3 class="sub">Em alta lá, fora do seu deck</h3><ul class="syl">' + (l1 || '<li class="hint">Nenhuma carta nesta situação.</li>') + '</ul></div>' +
    '<div><h3 class="sub">Em alta lá, na berlinda aqui</h3><ul class="syl">' + lst(d1) + '</ul></div>' +
    '<div><h3 class="sub">Intocável aqui, sem destaque lá</h3><ul class="syl">' + lst(d2) + '</ul></div></div>' +
    '<p class="pn-note">Leia o número com cuidado. Em sites desse tipo, sinergia mede o quanto a carta aparece mais nos decks deste comandante do que nos demais decks das mesmas cores: mede presença, não força, e não entra no placar. Por isso staples como Sol Ring pontuam baixo' +
    (pc && hi.length ? ', e ' + npc + ' das ' + hi.length + ' cartas do seu deck com 50% ou mais são da edição ' + esc(pc.set) + ', ' + esc(pc.texto) + '.' : '.') + '</p></fieldset>';
}

/* ============ galeria ============ */
function gtile(c) {
  return '<div class="gtile c-' + esc(c.col) + '" role="button" tabindex="0" data-card="' + esc(c.id) + '" aria-label="' + esc(c.n + ', tier ' + c.tier) + '">' + fbTile(c, false, true) + imgTag(c, 'normal', false) +
    '<span class="gt-b">' + tierB(c.tier, true) + relB(c.rel) + (c.q > 1 ? '<span class="gt-q">×' + c.q + '</span>' : '') +
    (c.foil ? '<span class="gt-q"><span class="foil">✦</span></span>' : '') + (c.pet ? '<span class="gt-q"><span class="pet">♥</span></span>' : '') + '</span></div>';
}
function renderGal() {
  var cs = deck().filter(function (c) { return ui.galLands || !c.land; });
  var defs = ui.galBy === 'tier' ? TIERS.map(function (t) { return { k: t.k, n: 'Tier ' + t.k, d: t.d, f: function (c) { return c.tier === t.k; } }; }) :
    ui.galBy === 'rel' ? RELS.map(function (r) { return { k: r.k, n: r.n, d: r.d, f: function (c) { return c.rel === r.k; } }; }) :
    TG.filter(function (g) { return g.k !== 'cmd'; }).map(function (g) { return { k: g.k, n: g.n, d: '', f: function (c) { return c.g === g.k || (g.k === 'cri' && c.cmd); } }; });
  var h = '<div class="tools"><div class="seg" role="group" aria-label="Agrupar a galeria">' +
    [['tipo', 'Por tipo'], ['tier', 'Por tier'], ['rel', 'Por relevância']].map(function (o) {
      return '<button data-act="gal-by" data-v="' + o[0] + '" data-fid="gb' + o[0] + '" aria-pressed="' + (ui.galBy === o[0]) + '">' + o[1] + '</button>';
    }).join('') + '</div><span class="sp"></span>' +
    '<label class="tog"><input type="checkbox" data-act="gal-lands" data-fid="gl"' + (ui.galLands ? ' checked' : '') + '> Incluir terrenos</label>' +
    (canImg() ? '<label class="tog"><input type="checkbox" data-act="img-tog" data-fid="gi"' + (imgOn() ? ' checked' : '') + '> Imagens das cartas</label>' : '') + '</div>' +
    '<p class="hint" data-imgnote>' + imgNoteHtml() + '</p>';
  defs.forEach(function (g) {
    var list = cs.filter(g.f).sort(function (a, b) { return (b.cmd ? 1 : 0) - (a.cmd ? 1 : 0) || (a.land ? 99 : a.cmc) - (b.land ? 99 : b.cmc) || a.n.localeCompare(b.n); });
    if (!list.length) return;
    var n = 0; list.forEach(function (c) { n += c.q; });
    h += '<section class="gal-sec"><h2>' + esc(g.n) + ' <small>' + pl(n, 'carta', 'cartas') + (g.d ? '. ' + esc(g.d) : '') + '</small></h2><div class="gal">' + list.map(gtile).join('') + '</div></section>';
  });
  $('#v-gal').innerHTML = h;
}

/* ============ tier list ============ */
function renderTier() {
  var all = deck();
  var cs = all.filter(function (c) {
    if (ui.tierType) return c.g === ui.tierType || (ui.tierType === 'cri' && c.cmd);
    return ui.tierLands || !c.land;
  });
  var usados = {}; all.forEach(function (c) { usados[c.g] = 1; usados[c.cmd ? 'cri' : c.g] = 1; });
  /* cartas quando há imagem; fichas quando as imagens não carregam, ou por escolha */
  var gal = imgOn() && (ui.tierView === 'cartas' || (ui.tierView !== 'fichas' && !(imgFailN && !imgOk)));
  var h = '<div class="tools"><div class="pills" role="group" aria-label="Filtrar por tipo">' +
    '<button class="pill" data-act="tier-type" data-v="" data-fid="tt" aria-pressed="' + (!ui.tierType) + '">Todas</button>' +
    TG.filter(function (t) { return t.k !== 'cmd' && (usados[t.k] || ui.tierType === t.k); }).map(function (t) {
      return '<button class="pill" data-act="tier-type" data-v="' + t.k + '" data-fid="tt' + t.k + '" aria-pressed="' + (ui.tierType === t.k) + '">' + t.n + '</button>';
    }).join('') + '</div><span class="sp"></span>' +
    (imgOn() ? '<div class="seg" role="group" aria-label="Como mostrar as cartas"><button data-act="tier-view" data-v="cartas" data-fid="tv1" aria-pressed="' + gal + '">Cartas</button>' +
      '<button data-act="tier-view" data-v="fichas" data-fid="tv2" aria-pressed="' + !gal + '">Fichas</button></div>' : '') +
    (ui.tierType ? '' : '<label class="tog"><input type="checkbox" data-act="tier-lands" data-fid="tl"' + (ui.tierLands ? ' checked' : '') + '> Incluir terrenos</label>') + '</div>';
  h += '<div class="tiers">' + TIERS.map(function (t) {
    var list = cs.filter(function (c) { return c.tier === t.k; }).sort(function (a, b) { return (pts(b) - pts(a)) || a.n.localeCompare(b.n); });
    return '<div class="tier" data-t="' + t.k + '"><div class="tier-l"><b>' + t.k + '</b><span>' + t.d + '</span><small>' + pl(list.length, 'carta', 'cartas') + '</small></div>' +
      '<div class="drop' + (gal ? ' gal' : '') + '" data-drop="tier:' + t.k + '">' + (list.length ? list.map(function (c) { return gal ? tile(c) : chip(c, { mana: true }); }).join('') :
        '<span class="empty">' + (t.k === 'D' ? 'Nenhuma carta fora de lugar. Bom sinal.' : 'Nenhuma carta nesta faixa.') + '</span>') + '</div></div>';
  }).join('') + '</div>';
  h += '<p class="hint">Arraste uma carta para outra faixa, ou toque nela para ver o motivo e reclassificar. A ordem dentro de cada faixa segue a pontuação.</p>';
  $('#v-tier').innerHTML = h;
}

/* ============ 8×8 ============ */
/* Cada carta conta em um só pacote: o de maior nota (empate: o primeiro da ordem). Terreno e carta dupla com terreno no verso
   ficam em Mana. Mover uma carta aqui é só simulação: não muda as notas, o tier nem o placar. */
var PKI = {}; G.forEach(function (g, i) { PKI[g.id] = i; });
function pkNome(k) { return k === 'mana' ? 'Mana' : k === 'sem' ? 'Sem pacote' : G[PKI[k]].k; }
function pkDef(c) {
  if (c.land || c.mdfc) return 'mana';
  var best = 0, bi = -1;
  for (var i = 0; i < NG; i++) { var v = gv(c, i); if (v > best) { best = v; bi = i; } }
  return bi < 0 ? 'sem' : G[bi].id;
}
function pkOf(c) {
  var k = S.pk[c.id] || c.pk0 || pkDef(c);
  return (k === 'mana' || k === 'sem' || PKI[k] != null) ? k : pkDef(c);
}
function renderPk() {
  var all = deck(), cmds = [], body = [];
  all.forEach(function (c) { if (c.cmd) cmds.push(c); else body.push(c); });
  // com dois comandantes, sobra uma vaga a menos: a teoria tira um terreno (34 de mana e 64 em pacotes)
  var nMana = cmds.length > 1 ? 34 : 35;
  var cols = G.map(function (g, i) {
    return { k: g.id, n: g.k, d: g.d, ref: g.ref || [8, 8], col: 'rgb(var(--g' + i + '))' };
  });
  cols.push({ k: 'mana', n: 'Mana', d: 'Terrenos e cartas duplas com terreno no verso.', ref: [nMana, nMana + 2], col: 'var(--gold)' });
  var by = { sem: [] }; cols.forEach(function (c) { by[c.k] = []; });
  body.forEach(function (c) { by[pkOf(c)].push(c); });
  if (by.sem.length) cols.push({ k: 'sem', n: 'Sem pacote', d: 'Cartas sem nota em nenhum agrupamento. Arraste para um pacote.', ref: null, col: 'var(--mute)' });
  var out = cands().map(E).filter(function (c) { return !c.inDeck && c.verdict !== 'fora'; });
  var nMoved = Object.keys(S.pk).length, total = 0;
  body.forEach(function (c) { total += c.q; });
  var h = '<div class="tools"><p class="hint" style="flex:1;min-width:260px">Cada carta conta em um só pacote: o de maior nota (empate: o primeiro da ordem). ' +
    'Arraste uma carta para outro pacote para ver o equilíbrio mudar. É só simulação: as notas, o tier e o placar não mudam.</p>' +
    (nMoved ? '<button class="btn ghost" data-act="pk-reset" data-fid="pkr">Desfazer ' + pl(nMoved, 'simulação', 'simulações') + '</button>' : '') + '</div>';
  h += '<p class="pk-tot"><b>' + total + '</b> cartas fora ' + (cmds.length > 1 ? 'os comandantes' : 'o comandante') + (cmds.length ? ' (' + cmds.map(function (c) { return esc(c.n); }).join(' e ') + ')' : '') + '. Referência da teoria: ' + nMana + ' de mana e 64 em oito pacotes de oito.</p>';
  h += '<div class="pkg">' + cols.map(function (g) {
    var list = by[g.k].slice().sort(function (a, b) { return (TR[a.tier] - TR[b.tier]) || (pts(b) - pts(a)) || a.n.localeCompare(b.n); });
    var n = 0; list.forEach(function (c) { n += c.q; });
    var st = '', msg = '';
    if (g.ref) {
      st = n < g.ref[0] ? 'falta' : n > g.ref[1] ? 'cheio' : 'ok';
      msg = (g.ref[0] === g.ref[1] ? 'referência ' + g.ref[0] : 'referência ' + g.ref[0] + ' a ' + g.ref[1]) + ' · ' +
        (st === 'falta' ? 'falta reforço' : st === 'cheio' ? 'acima da referência' : 'na faixa');
    }
    var fraca = cutQueue(list, false)[0];
    var cara = list.filter(function (c) { return pesada(c) && c.cmc >= 4; }).sort(function (a, b) { return (b.cmc - a.cmc) || (TR[b.tier] - TR[a.tier]) || a.n.localeCompare(b.n); })[0];
    var barata = cara ? maisBarata(cara, out) : null;
    var radar = out.filter(function (c) { return pkOf(c) === g.k; }).sort(function (a, b) { return TR[a.tier] - TR[b.tier]; }).slice(0, 4);
    var foot = '';
    if (g.k !== 'mana' && g.k !== 'sem' && (fraca || radar.length || cara)) {
      foot = '<div class="pk-foot">' +
        (fraca ? '<div class="pk-line pk-f"><span>Mais fraca</span>' + chip(fraca, { tier: true }) + relB(fraca.rel) + '</div>' : '') +
        (cara ? '<div class="pk-line pk-c"><span>Mais cara</span>' + chip(cara, { mana: true }) +
          (barata ? '<span class="pk-alt"><span class="ar">→</span>' + chip(barata, { mana: true }) + '<small>−' + (cara.cmc - barata.cmc) + '</small></span>' : '') + '</div>' : '') +
        (radar.length ? '<div class="pk-line pk-r"><span>Do radar</span>' + radar.map(function (c) {
          var sai = c.sai ? byId(c.sai) : null;
          return chip(c, { tier: true }).replace('<div class="chip', '<div title="' + esc(c.n + (sai ? ' · sairia ' + sai.n : '')) + '" class="chip');
        }).join('') + '</div>' : '') + '</div>';
    }
    return '<section class="kcol pk pk-' + st + '" style="--kc:' + g.col + '"><header><h3>' + esc(g.n) + ' <small>' + n + (g.ref && g.ref[0] === g.ref[1] ? ' de ' + g.ref[0] : '') + '</small></h3>' +
      (g.d ? '<p>' + esc(g.d) + '</p>' : '') + (msg ? '<div class="kn">' + msg + '</div>' : '') + '</header>' +
      '<div class="drop" data-drop="pk:' + g.k + '">' + (list.length ? list.map(function (c) { return chip(c, { tier: true, moved: !!S.pk[c.id] }); }).join('') :
        '<span class="empty">Nenhuma carta aqui.</span>') + '</div>' + foot + '</section>';
  }).join('') + '</div>';
  $('#v-pk').innerHTML = h;
}

/* ============ custo de mana ============ */
/* Quanto uma troca baixa o custo e adianta a carta. Ficam fora da conta: terrenos, o comandante, custo variável (X) e
   cartas duplas com terreno no verso. As que custam menos na prática (caro_por_desenho) não contam como ganho quando
   saem, e não entram na lista das mais caras, assim como tier S, intocáveis e cartas de estimação, que são o plano. */
function custoX(c) { return /\{X\}/.test(c.cost || ''); }
/* com dez peças de ramp de nota 2 ou mais, o deck costuma jogar uma carta de custo C no turno C − 1 */
function rampDesc(cs) {
  var i = gi('ramp'), n = 0; if (i < 0) return 0;
  cs.forEach(function (c) { if (gv(c, i) >= 2) n += c.q; });
  return n >= 10 ? 1 : 0;
}
/* o ramp só começa a render do turno 2 em diante: carta de custo 2 ou menos sai no turno do próprio custo */
function turnoDe(cmc, desc) { return cmc <= 2 ? Math.max(1, cmc) : Math.max(2, cmc - desc); }
function ganho(e, s, desc) {
  if (!s || e.land || s.land || e.mdfc || s.mdfc || custoX(e) || custoX(s)) return null;
  var k = pkOf(s), i = PKI[k], pe = pips(e.cost), ps = pips(s.cost);
  return { d: s.cmc - e.cmc, cpd: !!s.cpd, t0: turnoDe(s.cmc, desc), t1: turnoDe(e.cmc, desc),
           papel: i != null && pkOf(e) === k && !!e.wipe === !!s.wipe && gv(e, i) >= gv(s, i) && TR[e.tier] <= TR[s.tier],
           cor: WUBRG.filter(function (ch) { return pe[ch] >= 2 && pe[ch] > ps[ch]; }) };
}
function baixa(g) { return !!(g && g.d >= 1 && g.papel && !g.cpd); }
function ganhoTxt(g, s) {
  var h;
  if (g.d > 0) h = '<b>−' + g.d + ' de mana</b> contra ' + esc(s.n) + (g.t1 < g.t0 ? ', chega no turno ' + g.t1 + ' em vez do ' + g.t0 : '');
  else if (g.d === 0) h = 'Mesmo custo de ' + esc(s.n);
  else h = '<b>+' + (-g.d) + ' de mana</b> contra ' + esc(s.n) + ': o ganho, se houver, está em outro lugar';
  if (g.d > 0) h += g.papel ? ' · <span class="cv-ok">mesmo papel</span>' : ' · papel diferente';
  if (g.cpd) h += ' · ' + esc(s.n) + ' já custa menos na prática';
  if (g.cor.length) h += ' · pede mais ' + g.cor.map(function (ch) { return mana('{' + ch + '}'); }).join('');
  return h;
}
function pesada(c) { return !c.land && !c.mdfc && !c.cmd && !custoX(c) && !c.nocut && !c.pet && !c.cpd && c.tier !== 'S' && c.rel !== 'INS'; }
/* a melhor carta do radar no mesmo pacote do 8×8, com pelo menos 1 de mana a menos (usadas: já sugeridas para outra) */
function maisBarata(c, out, usadas) {
  var k = pkOf(c);
  return out.filter(function (x) { return !(usadas && usadas[x.id]) && !x.land && !x.mdfc && !custoX(x) && x.cmc <= c.cmc - 1 && pkOf(x) === k && !!x.wipe === !!c.wipe; })
    .sort(function (a, b) { return (TR[a.tier] - TR[b.tier]) || (a.cmc - b.cmc) || a.n.localeCompare(b.n); })[0] || null;
}
function jaEm(c) {
  var os = ((D.outros && D.outros[chaveN(c)]) || []).filter(function (o) { return o.w === 'deck'; });
  return !os.length ? '' : '<small class="cv-ja">' + (os.length > 2 ? 'já está em ' + os.length + ' outros decks' : 'já está no ' + esc(lista(os.map(function (o) { return o.d; })))) + '</small>';
}
function cvNome(c) { return '<button class="linkish" data-card="' + esc(c.id) + '">' + esc(c.n) + '</button> ' + (c.cost ? mana(c.cost) + ' ' : '') + tierB(c.tier, true); }
function custoPanel(cs, st) {
  var desc = rampDesc(cs), aqui = {}; cs.forEach(function (c) { aqui[c.id] = c; });
  var out = cands().map(E).filter(function (c) { return !c.inDeck && c.verdict !== 'fora'; });
  var vo = { entra: 0, avaliar: 1 }, sw = out.filter(function (c) { return c.sai && aqui[c.sai]; })
    .sort(function (a, b) { return (vo[a.verdict] - vo[b.verdict]) || (TR[a.tier] - TR[b.tier]) || a.n.localeCompare(b.n); });
  function uma(lst) { var v = {}; return lst.filter(function (c) { if (v[c.sai]) return false; v[c.sai] = 1; return true; }); }
  function aplica(lst) { var sai = {}; lst.forEach(function (c) { sai[c.sai] = 1; }); return cs.filter(function (c) { return !sai[c.id]; }).concat(lst); }
  var rec = uma(sw.filter(function (c) { return c.verdict === 'entra'; }));
  var boas = uma(sw.map(function (c) { return { c: c, g: ganho(c, aqui[c.sai], desc) }; }).filter(function (x) { return baixa(x.g); })
    .sort(function (a, b) { return b.g.d - a.g.d || (TR[a.c.tier] - TR[b.c.tier]); }).map(function (x) { return x.c; }));
  function seis(s) { return s.curve[6].n + s.curve[7].n; }
  function linha(rot, s, n) {
    var d = s.avg - st.avg;
    return '<tr><th scope="row">' + rot + (n != null ? ' <small>(' + n + ')</small>' : '') + '</th><td class="num"><b>' + fmt(s.avg) + '</b>' +
      (n != null && Math.abs(d) >= 0.005 ? ' <small class="' + (d < 0 ? 'cv-ok' : 'cv-up') + '">' + (d < 0 ? '−' : '+') + fmt(Math.abs(d)) + '</small>' : '') + '</td>' +
      '<td class="num">' + s.cmcSum + '</td><td class="num">' + seis(s) + '</td><td class="num">' + s.total + '</td></tr>';
  }
  var stR = rec.length ? stats(aplica(rec)) : null, stB = boas.length ? stats(aplica(boas)) : null;
  var h = '<fieldset class="pn cv"><legend>Custo e curva</legend>' +
    '<div class="scx"><table class="cvt"><thead><tr><th></th><th>CMC médio</th><th>CMC somado</th><th>Custo 6+</th><th>Placar</th></tr></thead><tbody>' +
    linha('Hoje', st) + (stR ? linha('Com as trocas marcadas para entrar', stR, rec.length) : '') +
    (stB ? linha('Só as trocas que baixam o custo sem perder o papel', stB, boas.length) : '') + '</tbody></table></div>';
  function ganhoCel(g) {
    return '<td class="num c-g"><b>−' + g.d + '</b>' + (g.t1 < g.t0 ? '<small>turno ' + g.t1 + ', não ' + g.t0 + '</small>' : '') + (g.papel ? '<small class="cv-ok">mesmo papel</small>' : '') + '</td>';
  }
  h += '<h3 class="sub">Trocas do radar que baixam o custo</h3>' + (boas.length ? '<div class="scx"><table class="cvt2"><thead><tr><th>Entra</th><th>Sai</th><th class="num">Ganho</th></tr></thead><tbody>' +
    boas.map(function (c) {
      var s = aqui[c.sai];
      return '<tr><th scope="row" class="c-a">' + cvNome(c) + jaEm(c) + '</th><td class="c-b" data-pre="sai">' + cvNome(s) + '</td>' + ganhoCel(ganho(c, s, desc)) + '</tr>';
    }).join('') + '</tbody></table></div>' : '<p class="hint">Nenhuma troca do radar baixa o custo mantendo o papel da carta que sai.</p>');
  /* cada carta do radar é sugerida uma vez só, da mais cara do deck para a menos cara */
  var caras = cs.filter(function (c) { return pesada(c) && c.cmc >= 5; })
    .sort(function (a, b) { return (b.cmc - a.cmc) || (TR[b.tier] - TR[a.tier]) || a.n.localeCompare(b.n); });
  var po = poolOpen().filter(function (p) { return !p.land && !custoX(p); }), usadas = {};
  var porSai = {}, tira = {};
  boas.forEach(function (c) { usadas[c.id] = 1; porSai[c.sai] = c; });
  out.forEach(function (c) { if (c.sai && !tira[c.sai]) tira[c.sai] = c; });
  h += '<h3 class="sub">As mais caras, e o que faria o mesmo por menos</h3>' + (caras.length ? '<div class="scx"><table class="cvt2"><thead><tr><th>Carta</th><th>Pacote</th><th>Mais barata no radar</th><th class="num">Ganho</th></tr></thead><tbody>' +
    caras.slice(0, 10).map(function (c) {
      var alt = porSai[c.id] || maisBarata(c, out, usadas), r;
      if (alt) {
        usadas[alt.id] = 1;
        r = '<td class="c-b" data-pre="→">' + cvNome(alt) + jaEm(alt) + '</td>' + ganhoCel(ganho(alt, c, desc));
      } else {
        var ps = po.filter(function (p) { return p.t === c.t && p.cmc <= c.cmc - 2; }).sort(function (a, b) { return (b.syn || 0) - (a.syn || 0); }).slice(0, 2);
        r = '<td colspan="2" class="cv-n c-b">' + (ps.length ? 'Nenhuma no mesmo pacote. Potenciais do mesmo tipo, ainda sem avaliação: ' + esc(lista(ps.map(function (p) { return p.n + ' (' + p.cmc + ')'; }))) + '.' :
          'Nenhuma no mesmo pacote do radar.') + '</td>';
      }
      var ja = tira[c.id] && tira[c.id] !== alt ? '<small class="cv-ja">no radar, sai para ' + esc(tira[c.id].n) + ' entrar</small>' : '';
      return '<tr><th scope="row" class="c-a">' + cvNome(c) + ja + '</th><td class="c-p">' + esc(pkNome(pkOf(c))) + '</td>' + r + '</tr>';
    }).join('') + '</tbody></table></div>' + (caras.length > 10 ? '<p class="pn-note">E mais ' + pl(caras.length - 10, 'carta', 'cartas') + ' de custo 5 ou mais.</p>' : '') :
    '<p class="hint">Nenhuma carta de custo 5 ou mais fora do plano: as caras deste deck são tier S, intocáveis ou de estimação.</p>');
  var cpd = cs.filter(function (c) { return c.cpd; });
  h += '<p class="pn-note">' + (cpd.length ? 'Custam menos na prática, e ficam fora da conta: ' + esc(lista(cpd.map(function (c) { return c.n; }))) + '. ' : '') +
    'Tier S, intocáveis e cartas de estimação não entram na lista das mais caras: o custo delas é o plano.</p>' +
    '<details class="how"><summary>Como a conta é feita</summary><p>Cada mana a menos adianta a carta em cerca de um turno no começo do jogo. ' +
    (desc ? 'Com dez ou mais peças de Ramp de nota 2 ou 3, como aqui, o deck costuma jogar uma carta de custo C no turno C − 1. ' : 'Sem dez peças de Ramp de nota 2 ou 3, a conta supõe uma carta de custo C no turno C. ') +
    'Uma troca mantém o papel quando a carta que entra fica no mesmo pacote do 8×8 que a que sai, com nota igual ou maior nele e tier igual ou melhor. ' +
    'Ficam fora: terrenos, o comandante, custo variável (X), cartas com terreno no verso e as que custam menos na prática. ' +
    'O CMC somado é a soma dos custos das mágicas: trocar uma carta de 5 por uma de 2 corta 3, e o placar sobe um ponto cada vez que o CMC médio cruza um número inteiro para baixo.</p></details></fieldset>';
  return h;
}

/* ============ tabelão ============ */
function sortVal(c, k) {
  if (k === 'n') return c.n.toLowerCase();
  if (k === 'q') return c.q;
  if (k === 'cmc') return c.land ? -1 : c.cmc;
  if (k === 'pts') return pts(c);
  if (k === 'syn') return c.syn == null ? -999 : c.syn;
  if (k === 'usd') { var u = usdOf(c); return u == null ? -1 : u; }
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
  return '<td class="sc ' + cl + (G[i].lt ? ' lt' : '') + '" style="--c:var(--g' + i + ')">' + (v === 0 ? '·' : (v < 0 ? '−' + (-v) : v)) + '</td>';
}
var NCOL = 8 + NG + (EDH ? 1 : 0);
function tabRows() {
  var q = ui.q.trim().toLowerCase();
  var cs = deck().filter(function (c) {
    if (q && c.n.toLowerCase().indexOf(q) < 0 && (c.on || '').toLowerCase().indexOf(q) < 0 && c.line.toLowerCase().indexOf(q) < 0) return false;
    if (ui.fg >= 0 && gv(c, ui.fg) <= 0) return false;
    if (ui.ft && c.g !== ui.ft) return false;
    if (ui.fr && c.rel !== ui.fr) return false;
    return true;
  });
  function row(c) {
    var cells = '';
    for (var i = 0; i < NG; i++) cells += scCell(gv(c, i), i);
    return '<tr class="row" data-card="' + esc(c.id) + '" tabindex="0"><td class="c-name"><div class="nm c-' + esc(c.col) + '">' +
      (imgOn() ? '<span class="thb">' + imgTag(c, 'small', false) + '</span>' : '') + '<span class="t">' + esc(c.n) + '</span>' +
      (c.foil ? '<span class="foil" title="Foil">✦</span>' : '') + (c.pet ? '<span class="pet" title="PetCard">♥</span>' : '') + (c.edited ? '<span class="edt" title="Avaliação alterada por você"></span>' : '') +
      '</div></td><td class="dimc num hm">' + c.q + '</td><td class="hm">' + (c.cost ? mana(c.cost) : '<span class="dimc">—</span>') + '</td><td class="num">' + (c.land ? '<span class="dimc">—</span>' : c.cmc) + '</td>' + cells +
      '<td class="pts num">' + pts(c) + '</td><td class="num dimc usd">' + (usdOf(c) == null ? '—' : fmt(usdOf(c))) + '</td>' + (EDH ? '<td class="num syn' + (c.syn == null ? ' dimc' : '') + '">' + synTxt(c.syn) + '</td>' : '') + '<td>' + tierB(c.tier, true) + '</td><td>' + relB(c.rel) + '</td></tr>';
  }
  var tot = [], tp = 0, tn = 0, tu = 0, i;
  for (i = 0; i < NG; i++) tot.push(0);
  cs.forEach(function (c) { for (var i = 0; i < NG; i++) tot[i] += gv(c, i) * c.q; tp += pts(c) * c.q; tn += c.q; tu += (usdOf(c) || 0) * c.q; });
  var h = '<tr class="tot"><td class="c-name">' + (cs.length === deck().length ? 'Total do deck' : 'Total do filtro') + '</td><td class="num hm">' + tn + '</td><td class="hm"></td><td></td>' +
    tot.map(function (v) { return '<td class="num">' + v + '</td>'; }).join('') + '<td class="num">' + tp + '</td><td class="num">' + fmt(tu) + '</td>' + (EDH ? '<td></td>' : '') + '<td></td><td></td></tr>';
  if (!cs.length) return h + '<tr><td class="c-name" colspan="' + NCOL + '" style="position:static;padding:22px 14px;color:var(--mute);max-width:none">Nenhuma carta com esses filtros. Limpe a busca ou escolha outro agrupamento.</td></tr>';
  if (ui.grouped) {
    TG.forEach(function (g) {
      var list = cs.filter(function (c) { return c.g === g.k; }).sort(sorter);
      if (!list.length) return;
      var n = 0, p = 0; list.forEach(function (c) { n += c.q; p += pts(c) * c.q; });
      h += '<tr class="grp"><td colspan="' + NCOL + '"><div class="grp-in">' + g.n + ' (' + n + ')<span>' + p + ' pts</span></div></td></tr>' + list.map(row).join('');
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
  var h = '<div class="tools"><label class="fld"><span>Buscar</span><input class="inp" id="q" type="search" placeholder="nome ou tipo" value="' + esc(ui.q) + '" autocomplete="off"></label>' +
    '<label class="fld"><span>Tipo</span><select class="inp" data-act="ft" data-fid="ft"><option value="">Todos</option>' + TG.map(function (t) { return '<option value="' + t.k + '"' + (ui.ft === t.k ? ' selected' : '') + '>' + t.n + '</option>'; }).join('') + '</select></label>' +
    '<label class="fld"><span>Relevância</span><select class="inp" data-act="fr" data-fid="fr"><option value="">Todas</option>' + RELS.map(function (r) { return '<option value="' + r.k + '"' + (ui.fr === r.k ? ' selected' : '') + '>' + r.l + ' ' + r.n + '</option>'; }).join('') + '</select></label>' +
    '<span class="sp"></span><label class="tog"><input type="checkbox" data-act="grouped" data-fid="gp"' + (ui.grouped ? ' checked' : '') + '> Agrupar por tipo</label></div>';
  h += '<div class="pills" role="group" aria-label="Filtrar por agrupamento">' + G.map(function (g, i) {
    return '<button class="pill" style="--c:var(--g' + i + ')" data-act="fg" data-g="' + i + '" data-fid="fg' + i + '" aria-pressed="' + (ui.fg === i) + '" title="' + esc(g.d) + '"><i class="dot" style="--c:var(--g' + i + ')"></i>' + esc(g.k) + '</button>';
  }).join('') + '</div>';
  h += '<div class="tw" id="tw"><table class="tbl" style="min-width:' + (654 + 52 * NG) + 'px"><thead><tr>' +
    th('n', 'Carta', 'c-name') + th('q', 'Qtd', 'hm') + '<th scope="col" class="hm">Custo</th>' + th('cmc', 'CMC') +
    G.map(function (g, i) { return th('g' + i, esc(g.ab), 'gh', g.k + ': ' + g.d, '--c:var(--g' + i + ')'); }).join('') +
    th('pts', 'Pts') + th('usd', 'US$', '', 'Preço no Scryfall, na impressão da lista') + (EDH ? th('syn', 'Wiki', '', 'Sinergia no ' + EDH.fonte + (EDH.pagina ? ' para ' + EDH.pagina : '') + ': presença na comunidade, não força') : '') +
    th('tier', 'Tier') + th('rel', 'Relev.') + '</tr></thead><tbody id="tbody">' + tabRows() + '</tbody></table></div>';
  h += '<p class="hint">Notas de 0 a 3 em cada agrupamento: 1 é efeito de passagem, 2 é função da carta, 3 é referência do deck. Uma carta pode pontuar em vários.' + (EDH ? ' A coluna Wiki é a sinergia no ' + esc(EDH.fonte) + '.' : '') + ' Toque na linha para ver a carta, o motivo e editar.</p>';
  $('#v-tab').innerHTML = h;
}

/* ============ painel de controle ============ */
function renderCtrl() {
  var all = deck(), cs = all.filter(function (c) { return ui.ctrlLands || !c.land; }), st = stats(all);
  var h = '<div class="tools"><p class="hint" style="flex:1;min-width:240px">Quatro faixas, como na coluna Relevância da sua planilha. Arraste entre as colunas ou toque na carta para mudar.</p>' +
    '<label class="tog"><input type="checkbox" data-act="ctrl-lands" data-fid="cl"' + (ui.ctrlLands ? ' checked' : '') + '> Incluir terrenos</label></div>';
  h += '<div class="kan">' + RELS.map(function (r) {
    var list = cs.filter(function (c) { return c.rel === r.k; }).sort(function (a, b) {
      return r.k === 'BAX' ? cutCmp(a, b) : ((TR[a.tier] - TR[b.tier]) || (pts(b) - pts(a)) || a.n.localeCompare(b.n));
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
  if (st.n !== 100) pend.push('<li><i class="mk"></i><span>O deck está com <b>' + st.n + ' cartas</b>. ' + (st.n > 100 ? (st.n === 101 ? 'Sobra 1' : 'Sobram ' + (st.n - 100)) + ': escolha quem sai na fila de corte.' : (st.n === 99 ? 'Falta 1' : 'Faltam ' + (100 - st.n)) + ': promova uma carta do radar.') + '</span></li>');
  cands().map(E).filter(function (c) { return c.verdict === 'entra' && !c.inDeck; }).forEach(function (c) {
    var o = c.sai ? byId(c.sai) : null;
    pend.push('<li><i class="mk"></i><span><b>' + esc(c.n) + '</b> está no radar com veredito de entrada' + (o && o.inDeck ? ', no lugar de ' + esc(o.n) : '') + '.</span> <button class="linkish" data-act="go" data-v="radar">Ver no radar</button></li>');
  });
  all.forEach(function (c) {
    if (c.rel === 'INS' && TR[c.tier] >= 3 && !c.pet) pend.push('<li><i class="mk"></i><span><b>' + esc(c.n) + '</b> está como intocável com tier ' + c.tier + '. Se for PetCard, marque o coração; senão, reveja a faixa.</span> <button class="linkish" data-card="' + esc(c.id) + '">Abrir</button></li>');
    if (c.rel === 'BAX' && TR[c.tier] <= 1) pend.push('<li><i class="mk"></i><span><b>' + esc(c.n) + '</b> está na berlinda com tier ' + c.tier + '. As duas avaliações não combinam.</span> <button class="linkish" data-card="' + esc(c.id) + '">Abrir</button></li>');
  });
  ql.forEach(function (c) {
    pend.push('<li><i class="mk"></i><span>Terreno na berlinda: <b>' + esc(c.n) + '</b>. ' + esc(c.why) + '</span> <button class="linkish" data-card="' + esc(c.id) + '">Abrir</button></li>');
  });
  if (!pend.length) pend.push('<li><i class="mk okk"></i><span>Nada pendente. Deck com 100 cartas e avaliações coerentes.</span></li>');
  h += '<div class="grid g-11"><fieldset class="pn"><legend>Fila de corte</legend><ol class="queue">' + queue + '</ol>' +
    '<p class="pn-note">Ordem: relevância mais baixa, depois a prioridade sugerida, o tier e a pontuação. PetCards, o comandante e as cartas marcadas como fora do corte nunca entram na fila; terrenos são avaliados à parte.</p></fieldset>' +
    '<fieldset class="pn"><legend>Pendências</legend><ul class="pend">' + pend.join('') + '</ul></fieldset></div>';
  $('#v-ctrl').innerHTML = h;
}

/* ============ radar ============ */
function cutOptions(cand, sel) {
  var d = deck(), top = cutQueue(d, !!cand.land).slice(0, 12), ids = {};
  top.forEach(function (c) { ids[c.id] = 1; });
  var rest = d.filter(function (c) { return !ids[c.id] && !c.cmd && c.id !== cand.id; }).sort(function (a, b) { return a.n.localeCompare(b.n); });
  var def = sel != null ? sel : ((cand.sai && d.some(function (c) { return c.id === cand.sai; })) ? cand.sai : (top[0] ? top[0].id : ''));
  function opt(c) { return '<option value="' + esc(c.id) + '"' + (c.id === def ? ' selected' : '') + '>' + esc(c.n) + ' (' + RELS[RR[c.rel]].l + ', ' + pts(c) + ' pts)</option>'; }
  return '<optgroup label="Fila de corte">' + top.map(opt).join('') + '</optgroup><optgroup label="Demais cartas">' + rest.map(opt).join('') + '</optgroup><option value=""' + (def === '' ? ' selected' : '') + '>Ninguém sai (o deck passa de 100)</option>';
}
function fdate(d) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); return m ? m[3] + '/' + m[2] + '/' + m[1] : '—'; }
function gtags(c) {
  var tags = '';
  for (var i = 0; i < NG; i++) if (gv(c, i) > 0) tags += '<span class="gt" style="--c:var(--g' + i + ')">' + esc(G[i].sh || G[i].k) + ' ' + gv(c, i) + '</span>';
  return tags;
}
function candCard(c) {
  var id = esc(c.id), sw = null;
  S.swaps.forEach(function (s) { if (s.i === c.id) sw = s; });
  var outC = sw && sw.o ? byId(sw.o) : null;
  var alvo = c.inDeck ? outC : (c.sai ? byId(c.sai) : null), gn = alvo ? ganho(c, alvo, rampDesc(deck())) : null;
  var cv = gn ? ganhoTxt(gn, alvo) : (alvo && !c.land && !alvo.land && (custoX(c) || custoX(alvo)) ? 'Custo variável (X): fica fora da conta de mana' : '');
  return '<article class="cand' + (c.inDeck ? ' in' : '') + '" id="cand-' + id + '"><div class="cand-top' + (imgOn() ? ' wi' : '') + '">' +
    (imgOn() ? '<div class="cand-img c-' + esc(c.col) + '" data-card="' + id + '" role="button" tabindex="0" aria-label="Abrir ' + esc(c.n) + '">' + fbTile(c) + imgTag(c, 'small', false) + '</div>' : '') +
    '<div class="cand-txt"><div class="cand-h">' + tierB(c.tier) + '<div><h3><button class="linkish" data-card="' + id + '">' + esc(c.n) + '</button></h3><p class="cand-m">' + (c.cost ? mana(c.cost) + ' ' : '') + esc(c.line) + (c.pt ? ', ' + esc(c.pt) : '') + '</p></div>' +
    '<span class="vd vd-' + esc(c.verdict) + '">' + VERD[c.verdict] + '</span></div>' +
    (c.fx ? '<p class="cand-fx' + (c.orig ? ' orig' : '') + '">' + rich(c.fx) + '</p>' : '') + (c.why ? '<p class="cand-why">' + rich(c.why) + '</p>' : '') + '</div></div>' +
    '<div class="gtags">' + gtags(c) + '<span class="gt" style="--c:var(--gold-rgb)">' + pts(c) + ' pts</span>' +
    (c.syn != null && EDH ? '<span class="gt" style="--c:160,170,182" title="Sinergia no ' + esc(EDH.fonte) + '">' + esc(EDH.fonte) + ' ' + synTxt(c.syn) + '</span>' : '') + (c.tem ? '<span class="gt" style="--c:95,191,167">tenho a carta</span>' : '') + '</div>' +
    (cv ? '<p class="cand-cv">' + cv + '.</p>' : '') +
    '<div class="cand-a">' + (c.inDeck ?
      '<span class="st">No deck' + (outC ? ', no lugar de ' + esc(outC.n) : '') + '</span><button class="btn ghost sm" data-act="unswap" data-id="' + id + '" data-fid="us' + id + '">Desfazer</button>' :
      '<select class="inp" id="sel-' + id + '" aria-label="Quem sai do deck para ' + esc(c.n) + ' entrar">' + cutOptions(c) + '</select>' +
      '<button class="btn ghost sm" data-act="cmp" data-id="' + id + '" data-fid="cp' + id + '">Comparar</button>' +
      '<button class="btn sm" data-act="swap" data-id="' + id + '" data-fid="sw' + id + '">Colocar no deck</button>' +
      '<button class="btn ghost sm" data-act="verdict" data-v="fora" data-id="' + id + '" data-fid="fo' + id + '">Deixar de fora</button>' +
      (c.custom ? '<button class="btn ghost sm" data-act="del-custom" data-id="' + id + '">' + (c.pool ? 'Devolver aos potenciais' : 'Excluir') + '</button>' : '')) +
    '</div></article>';
}
function poolSection() {
  if (!D.pool || !D.pool.length) return '';
  var po = poolOpen(), ver = ui.poolAll ? po : po.slice(0, 12), th = imgOn(), fonte = EDH ? EDH.fonte : 'comunidade';
  var h = '<fieldset class="pn" id="pool"><legend>Potenciais do ' + esc(fonte) + '</legend>' +
    '<p class="hint">' + (po.length === 1 ? '1 carta' : po.length + ' cartas') + (EDH && EDH.pagina ? ' da página de ' + esc(EDH.pagina) : ' da leitura da comunidade') +
    ' que não estão no deck nem no radar, da maior sinergia para a menor' + (EDH ? '. Leitura de ' + esc(EDH.lido) : '') +
    '. Custo, tipo e texto vêm do Scryfall, e o texto fica no original porque essas cartas ainda não passaram por avaliação. Leve ao radar as que merecem nota, ou deixe de fora para a decisão ficar registrada.</p>' +
    (po.length ? '<div class="pool">' + ver.map(function (p) {
      return '<article class="pc' + (th ? '' : ' noimg') + '">' + (th ? '<span class="pc-th c-' + esc(p.col) + '" data-pool="' + esc(p.id) + '">' + fbTile(p) + imgTag(p, 'small', false) + '</span>' : '') +
        '<div><h3>' + esc(p.n) + '</h3><p class="cand-m">' + (p.cost ? mana(p.cost) + ' ' : '') + esc(p.line) + (p.pt ? ', ' + esc(p.pt) : '') + '</p>' +
        '<p class="pc-s">' + synB(p.syn) + (p.novo ? '<span class="novo">coleção recente</span>' : '') + '</p>' +
        (p.fx ? '<details class="pc-o"><summary>Texto da carta</summary><p class="orig">' + rich(p.fx) + '</p></details>' : '') +
        '<div class="pc-a"><button class="btn sm" data-act="pool-in" data-v="avaliar" data-id="' + esc(p.id) + '">Levar ao radar</button>' +
        '<button class="btn ghost sm" data-act="pool-in" data-v="fora" data-id="' + esc(p.id) + '">Deixar de fora</button></div></div></article>';
    }).join('') + '</div>' : '<p class="pn-note">Todas as cartas da leitura já foram levadas ao radar ou deixadas de fora.</p>') +
    (po.length > 12 ? '<p class="pn-note"><button class="linkish" data-act="pool-all" data-fid="pa">' + (ui.poolAll ? 'Mostrar só as 12 de maior sinergia' : 'Ver as ' + po.length) + '</button></p>' : '');
  if (EDH) {
    h += '<div class="upd"><h3 class="sub">Atualizar a leitura</h3><p class="hint">Este painel não consegue ler outro site sozinho: o navegador barra, pela mesma regra que barra imagens de fora numa página publicada. A leitura é refeita no projeto. Copie o comando e cole no Claude Code: ele relê a página, confere as cartas novas no Scryfall e monta o painel de novo.</p>' +
      '<textarea class="inp" id="edh-req" readonly rows="2" aria-label="Comando de atualização">' + esc('/potenciais ' + M.pasta) + '</textarea>' +
      '<div class="pc-a"><button class="btn sm" data-act="copy" data-t="edh-req" data-fid="ec">Copiar o comando</button>' +
      '<a href="' + esc(EDH.url) + '" target="_blank" rel="noopener noreferrer">Abrir a página do ' + esc(EDH.fonte) + '</a></div></div>';
  }
  return h + '</fieldset>';
}
function renderRadar() {
  var vo = { entra: 0, avaliar: 1, fora: 2 };
  var all = cands().map(E).sort(function (a, b) { return (vo[a.verdict] - vo[b.verdict]) || (TR[a.tier] - TR[b.tier]) || (pts(b) - pts(a)) || a.n.localeCompare(b.n); });
  var main = all.filter(function (c) { return c.verdict !== 'fora' || c.inDeck; }), no = all.filter(function (c) { return c.verdict === 'fora' && !c.inDeck; });
  var h = '<p class="hint">Cartas fora do deck que valem acompanhar. Ao colocar uma no deck você escolhe quem sai, e todos os gráficos passam a refletir a troca. Quem você deixa de fora desce para a lista abaixo, com a nota e o motivo guardados. A pergunta de sempre: a carta é boa, ou é boa ' + (artigo() === 'a' ? 'na' : 'no') + ' ' + esc(M.curto || 'comandante') + '?</p>';
  h += '<div class="cands">' + main.map(candCard).join('') + '</div>';
  if (no.length) {
    h += '<fieldset class="pn"><legend>Avaliadas, ficam de fora</legend><ul class="fora">' + no.map(function (c) {
      return '<li>' + tierB(c.tier, true) + '<div><button class="linkish" data-card="' + esc(c.id) + '">' + esc(c.n) + '</button>' + (c.syn != null && EDH ? ' <span class="hint">' + esc(EDH.fonte) + ' ' + synTxt(c.syn) + '</span>' : '') +
        '<p' + (!c.why && c.orig ? ' class="orig"' : '') + '>' + (c.why ? rich(c.why) : c.fx ? rich(c.fx) : 'Sem descrição ainda.') + '</p></div>' +
        '<button class="btn ghost sm" data-act="reval" data-id="' + esc(c.id) + '" data-fid="rv' + esc(c.id) + '">Reavaliar</button></li>';
    }).join('') + '</ul><p class="pn-note">Registro do que já foi analisado e recusado, para não rediscutir a mesma carta a cada coleção.</p></fieldset>';
  }
  if (S.swaps.length) {
    h += '<fieldset class="pn"><legend>Histórico de trocas</legend><div class="scx"><table class="hist"><thead><tr><th scope="col">Data</th><th scope="col">Entrou</th><th scope="col">Saiu</th><th scope="col">Motivo</th><th></th></tr></thead><tbody>' +
      S.swaps.map(function (s, i) {
        var a = byId(s.i), b = s.o ? byId(s.o) : null;
        return '<tr><td class="num">' + fdate(s.d) + '</td><td>' + (a ? chip(a) : '—') + '</td><td>' + (b ? chip(b) : '<span class="hint">ninguém</span>') + '</td>' +
          '<td><input class="inp" type="text" data-act="motivo" data-i="' + i + '" value="' + esc(s.m || '') + '" placeholder="por que trocou" aria-label="Motivo da troca"></td>' +
          '<td><button class="btn ghost sm" data-act="unswap" data-id="' + esc(s.i) + '">Desfazer</button></td></tr>';
      }).join('') + '</tbody></table></div><p class="pn-note">O motivo é seu: edite à vontade. O histórico vai junto no backup.</p></fieldset>';
  }
  var outs = D.cards.map(E).filter(function (c) { return !c.inDeck; });
  if (outs.length) {
    h += '<fieldset class="pn"><legend>Saíram do deck</legend><ul class="outs">' + outs.map(function (c) {
      return '<li>' + chip(c, { tier: true, pts: true }) + '<span class="hint" style="flex:1;min-width:160px">' + esc(c.why) + '</span><button class="btn ghost sm" data-act="restore" data-id="' + esc(c.id) + '">Devolver ao deck</button></li>';
    }).join('') + '</ul></fieldset>';
  }
  h += poolSection();
  h += '<fieldset class="pn"><legend>Adicionar carta ao radar</legend><p class="hint">Saiu coleção nova ou achou uma carta antiga? Registre aqui, dê as notas e compare com a fila de corte.' + (PUB ? '' : ' Com internet, a imagem vem sozinha pelo nome em inglês.') + '</p><div class="form">' +
    '<label>Nome<input class="inp" id="nc-n" type="text" autocomplete="off"></label>' +
    '<label>Custo de mana<input class="inp" id="nc-c" type="text" placeholder="2B ou {2}{B}" autocomplete="off"></label>' +
    '<label>Tipo<select class="inp" id="nc-t">' + TYPES.map(function (t) { return '<option value="' + t.k + '">' + t.o + '</option>'; }).join('') + '</select></label>' +
    '<label>Tier<select class="inp" id="nc-tier">' + TIERS.map(function (t) { return '<option value="' + t.k + '"' + (t.k === 'B' ? ' selected' : '') + '>' + t.k + ', ' + t.d.toLowerCase() + '</option>'; }).join('') + '</select></label>' +
    '<div class="wide"><div class="g8">' + G.map(function (g, i) {
      return '<label>' + esc(g.sh || g.k) + '<select class="inp" id="nc-g' + i + '">' + (g.neg ? '<option>-1</option>' : '') + '<option selected>0</option><option>1</option><option>2</option><option>3</option></select></label>';
    }).join('') + '</div></div>' +
    '<label class="wide">Por que entraria<input class="inp" id="nc-w" type="text" autocomplete="off"></label>' +
    '<div class="wide" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">' + (TRIBO ? '<label class="tog"><input type="checkbox" id="nc-v"> É ' + esc(TRIBO.nome) + '</label>' : '') + '<span class="sp" style="flex:1"></span>' +
    '<button class="btn" data-act="add-custom">Adicionar ao radar</button></div></div></fieldset>';
  $('#v-radar').innerHTML = h;
}

/* ============ oficina ============ */
function deckNames() { return deck().filter(function (c) { return !c.cmd; }).map(function (c) { return c.n; }).sort(function (a, b) { return a.localeCompare(b); }); }
var OF = [
  { k: 'aud', t: 'Auditar a avaliação', d: 'O Claude relê as notas, os tiers e as relevâncias deste deck com olhar de auditor e aponta o que não se sustenta. Não altera nada.',
    c: function () { return '/auditar ' + M.pasta; } },
  { k: 'atu', t: 'Atualizar com uma análise nova', d: 'Salve a análise de outra IA na pasta entrada/ deste deck. O Claude confronta com o que já está aprovado, conta os votos nas divergências, mostra o que mudaria e só aplica o que você aprovar. A decklist não muda.',
    c: function () { return '/atualizar-deck ' + M.pasta; } },
  { k: 'cmp', t: 'Comparar duas cartas', d: 'Uma carta de fora contra uma do deck: qual fica, e por quê, com o texto oficial das duas.',
    f: [['fora', 'Carta de fora', 'text'], ['deck', 'Carta do deck', 'deck']],
    c: function (v) { return '/comparar ' + M.pasta + ' | ' + (v.fora || '<carta de fora>') + ' | ' + (v.deck || '<carta do deck>'); } },
  { k: 'col', t: 'Avaliar uma coleção nova', d: 'O Claude lê a coleção no Scryfall, separa o que interessa a este deck e dá veredito de entrada e de compra. O que valer a pena vai para o radar.',
    f: [['col', 'Código ou nome da coleção', 'text']],
    c: function (v) { return '/colecao ' + (v.col || '<coleção>') + ' ' + M.pasta; } },
  { k: 'pot', t: 'Atualizar a leitura da comunidade', d: 'Relê a página do comandante na comunidade, atualiza a sinergia das cartas e a lista de potenciais, e monta o painel de novo.',
    c: function () { return '/potenciais ' + M.pasta; } },
  { k: 'capa', t: 'Trocar a capa', d: 'Troca a imagem do topo deste painel e do cartão no hub. Salve a imagem nova na pasta do deck antes de pedir; sem imagem, o Claude busca a arte do comandante.',
    c: function () { return '/capa ' + M.pasta; } },
  { k: 'tema', t: 'Propor variações de tema', d: 'Sugere paletas, fontes, molduras e desenho do gráfico para este painel, sem implementar nada.',
    c: function () { return '/tema ' + M.pasta; } },
  { k: 'lista', t: 'Conferir a decklist', d: 'Confere a lista antes de uma nova avaliação: nomes, edições, quantidade e identidade de cor. Aponta, não corrige.',
    c: function () { return '/conferir-lista ' + M.pasta; } },
  { k: 'bk', t: 'Levar para o projeto o que foi editado aqui', big: true,
    d: 'Tiers, notas, trocas e anotações feitas neste painel ficam só aqui até voltarem para o projeto. O comando já leva o backup junto: o Claude mostra o que vai mudar antes de gravar.',
    c: function () { return '/importar-backup ' + M.pasta + '\n\n' + JSON.stringify(S); } }
];
function ofCmd(o) { return o.c(ui.of[o.k] || {}); }
function renderOfi() {
  var nomes = deckNames();
  var h = '<p class="hint">O painel não tem IA dentro dele. Estes são os pedidos que dá para fazer ao Claude Code sobre este deck: copie o comando e cole no terminal do projeto. A pasta do deck, ' + esc(M.pasta) + ', já vai preenchida.</p><div class="ofi">' + OF.map(function (o) {
    var v = ui.of[o.k] || {};
    var flds = o.f ? '<div class="flds">' + o.f.map(function (f) {
      var id = 'off-' + o.k + '-' + f[0];
      if (f[2] === 'deck') {
        return '<label>' + f[1] + '<select class="inp" id="' + id + '" data-of="' + o.k + '" data-k="' + f[0] + '"><option value="">Escolha</option>' +
          nomes.map(function (n) { return '<option' + (v[f[0]] === n ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</select></label>';
      }
      return '<label>' + f[1] + '<input class="inp" id="' + id + '" type="text" autocomplete="off" data-of="' + o.k + '" data-k="' + f[0] + '" value="' + esc(v[f[0]] || '') + '"></label>';
    }).join('') + '</div>' : '';
    var note = o.k === 'bk' ? '<span class="hint">' + (S.ts ? 'Última edição gravada em ' + fts(S.ts) + '.' : 'Nenhuma edição feita neste painel ainda.') + '</span>' : '';
    return '<article class="of" id="of-' + o.k + '"><h3>' + esc(o.t) + '</h3><p>' + esc(o.d) + '</p>' + flds +
      '<textarea id="ofc-' + o.k + '" class="' + (o.big ? 'big' : '') + '" readonly rows="' + (o.big ? 5 : 2) + '" aria-label="Comando: ' + esc(o.t) + '">' + esc(ofCmd(o)) + '</textarea>' +
      '<div class="acts"><button class="btn sm" data-act="copy" data-t="ofc-' + o.k + '" data-fid="oc' + o.k + '">Copiar o comando</button>' + note + '</div></article>';
  }).join('') + '</div>';
  $('#v-ofi').innerHTML = h;
}

/* ============ gaveta ============ */
/* onde a carta aparece nos outros decks e nas pastas: foto do último build de cada um */
function chaveN(c) { return String(c.on || c.n).split(' // ')[0].trim().toLowerCase(); }
function outrosHtml(c) {
  var k = chaveN(c), os = (D.outros && D.outros[k]) || [], ps = (D.em_pastas && D.em_pastas[k]) || [];
  var h = '<h3>Em outros decks e pastas</h3>';
  if (!os.length && !ps.length) {
    h += '<p class="dw-out-n">Não está em nenhum outro deck' + (D.pastas_com_lista && D.pastas_com_lista.length ? ' nem nas pastas.' : '. As listas das pastas ainda não chegaram: quando chegarem, aparecem aqui.') + '</p>';
    return h;
  }
  os = os.slice().sort(function (a, b) { return (a.w === b.w ? 0 : a.w === 'deck' ? -1 : 1) || TR[a.t] - TR[b.t] || a.d.localeCompare(b.d); });
  h += '<ul class="dw-out">' + os.map(function (o) {
    return '<li><b>' + esc(o.d) + '</b><span class="w">' + (o.w === 'deck' ? 'no deck' : 'no radar, ' + (o.v === 'entra' ? 'entra' : 'avaliar')) + '</span>' +
      '<span class="tb sm t' + o.t + '" title="Tier ' + o.t + '">' + o.t + '</span>' + relB(o.r) + '</li>';
  }).join('') + '</ul>';
  var aqui = TR[c.tier], melhores = os.filter(function (o) { return o.w === 'deck' && TR[o.t] < aqui; });
  var jaTem = os.filter(function (o) { return o.w === 'deck'; });
  if (c.cand && !c.inDeck && jaTem.length) {
    h += '<p class="dw-out-n">Já está ' + (jaTem.length > 1 ? 'nos decks ' + jaTem.map(function (o) { return esc(o.d); }).join(', ') : 'no deck ' + esc(jaTem[0].d)) +
      '. Se for a mesma cópia, ela sai de lá. Aqui o tier é ' + c.tier + '.</p>';
  } else if (melhores.length) {
    h += '<p class="dw-out-n">Pesa mais em ' + melhores.map(function (o) { return esc(o.d) + ' (tier ' + o.t + ')'; }).join(', ') + ' do que aqui (tier ' + c.tier + ').</p>';
  } else if (c.inDeck && os.some(function (o) { return o.w === 'radar'; }) && !jaTem.length) {
    h += '<p class="dw-out-n">É pedida no radar de outro deck. Aqui ela já joga.</p>';
  }
  if (ps.length) h += '<p class="dw-out-n"><b>Nas pastas:</b> ' + ps.map(function (p) { return esc(p.p) + ' ×' + p.q; }).join(', ') + '.</p>';
  return h;
}
function renderDrawer() {
  var el = $('#drawer'), c = ui.drawer ? byId(ui.drawer) : null;
  if (!c) { el.hidden = true; $('#scrim').hidden = !ui.modal; return; }
  var steps = G.map(function (g, i) {
    var v = c.s[i] || 0, mn = g.neg ? -1 : 0;
    return '<div class="step"><span class="gn" title="' + esc(g.d) + '"><i class="dot" style="--c:var(--g' + i + ')"></i>' + esc(g.k) + '</span>' +
      '<span class="stp"><button data-act="step" data-g="' + i + '" data-d="-1" data-fid="sm' + i + '" aria-label="Diminuir ' + esc(g.k) + '"' + (v <= mn ? ' disabled' : '') + '>−</button>' +
      '<output>' + (v < 0 ? '−' + (-v) : v) + '</output>' +
      '<button data-act="step" data-g="' + i + '" data-d="1" data-fid="sp' + i + '" aria-label="Aumentar ' + esc(g.k) + '"' + (v >= 3 ? ' disabled' : '') + '>+</button></span></div>';
  }).join('');
  var enc = encodeURIComponent;
  var link = c.set ? 'https://scryfall.com/card/' + enc(c.set.toLowerCase()) + '/' + enc(c.num) : 'https://scryfall.com/search?q=' + enc('!"' + (c.on || c.n) + '"');
  var liga = 'https://www.ligamagic.com.br/?view=cards/card&card=' + enc(c.n);
  var back = !!(ui.face && c.dfc && c.back);
  var where = c.cand ? (c.inDeck ? 'No deck, vinda do radar' : 'No radar, fora do deck') : (c.inDeck ? '' : 'Fora do deck');
  var h = '<button class="x" data-act="close" aria-label="Fechar">×</button>' +
    '<p class="dw-type">' + esc(c.line) + '</p><h2 id="dw-title">' + esc(c.n) + '</h2>' +
    '<div class="dw-meta">' + (c.cost ? mana(c.cost) : '') + (c.land ? '' : '<span>CMC ' + c.cmc + '</span>') + (c.pt ? '<span>' + (c.ptl ? c.ptl + ' ' : '') + esc(c.pt) + '</span>' : '') +
    (c.set ? '<span>' + esc(c.set) + ' ' + esc(c.num) + '</span>' : '') + (c.q > 1 ? '<span>' + c.q + ' cópias</span>' : '') + (c.foil ? '<span><span class="foil">✦</span> foil' + (c.etched ? ' etched' : '') + '</span>' : '') + (usdOf(c) != null ? '<span>US$ ' + fmt(usdOf(c)) + ' no Scryfall</span>' : '') + (where ? '<span>' + where + '</span>' : '') + '</div>';
  if (imgOn()) {
    h += '<div class="dw-art"><div class="dw-card c-' + esc(c.col) + '">' + fbTile(c, back, true) + imgTag(c, 'normal', back) + '</div>' +
      (c.dfc && c.back ? '<p><button class="linkish" data-act="face" data-fid="face">' + (back ? 'Ver a frente' : 'Ver a outra face, ' + esc(c.back.n)) + '</button></p>' : '') +
      (c.ar ? '<p class="dw-cred">Arte de ' + esc(c.ar) + '.</p>' : '') +
      '<p class="dw-cred" data-imgnote>' + (imgFailN && !imgOk ? imgNoteHtml() : '') + '</p></div>';
  }
  h += (c.fx ? '<p class="dw-fx' + (c.orig ? ' orig' : '') + '">' + rich(c.fx) + '</p>' : '') + (c.why ? '<p class="dw-why">' + rich(c.why) + '</p>' : '') +
    (c.nocut ? '<p class="dw-back">Fica fora da fila de corte: candidata a carta de estimação.</p>' : '') +
    (c.back ? '<p class="dw-back">Outra face: ' + esc(c.back.n) + ', ' + esc(c.back.line.toLowerCase()) + '.</p>' : '');
  if (EDH && !c.custom && !c.cmd) h += '<p class="dw-syn">' + synB(c.syn) + (c.syn != null ? 'de sinergia' + (EDH.pagina ? ' nos decks de ' + esc(EDH.pagina) : '') + ', segundo o ' + esc(EDH.fonte) + '. Mede presença, não força.' : 'Não aparece na página' + (EDH.pagina ? ' de ' + esc(EDH.pagina) : '') + ' no ' + esc(EDH.fonte) + '.') + '</p>';
  if (!c.cmd && !c.custom) h += outrosHtml(c);
  if (c.cand) {
    h += '<h3>Veredito</h3><div class="segw" role="group" aria-label="Veredito">' + ['entra', 'avaliar', 'fora'].map(function (v) {
      return '<button data-act="set-verdict" data-v="' + v + '" data-fid="vd' + v + '" aria-pressed="' + (c.verdict === v) + '">' + VERD[v] + '</button>';
    }).join('') + '</div>';
  }
  h += '<h3>Tier</h3><div class="segw" role="group" aria-label="Tier">' + TIERS.map(function (t) {
    return '<button data-act="set-tier" data-v="' + t.k + '" data-fid="st' + t.k + '" aria-pressed="' + (c.tier === t.k) + '">' + t.k + '<small>' + t.d + '</small></button>';
  }).join('') + '</div>';
  h += '<h3>Relevância</h3><div class="segw" role="group" aria-label="Relevância">' + RELS.map(function (r) {
    return '<button data-act="set-rel" data-v="' + r.k + '" data-fid="sr' + r.k + '" aria-pressed="' + (c.rel === r.k) + '">' + r.l + '<small>' + r.n + '</small></button>';
  }).join('') + '</div>';
  h += '<h3>Notas por agrupamento</h3><div class="steps">' + steps + '</div>';
  h += '<div class="dw-row"><label class="tog"><input type="checkbox" data-act="pet" data-fid="pet"' + (c.pet ? ' checked' : '') + '> <span class="pet">♥</span> PetCard: ' + (IPET >= 0 ? 'soma 1 ponto em ' + esc(G[IPET].sh || G[IPET].k) + ' e fica' : 'fica') + ' fora da fila de corte</label></div>' +
    (c.cand ? '<div class="dw-row"><label class="tog"><input type="checkbox" data-act="tem" data-fid="tem"' + (c.tem ? ' checked' : '') + '> Tenho esta carta</label></div>' : '') +
    '<div class="dw-row"><label class="fld">Valor em R$ <input class="inp num" type="number" min="0" step="0.01" inputmode="decimal" data-act="val" data-fid="val" value="' + (c.val == null ? '' : c.val) + '" placeholder="0,00"></label>' +
    '<a href="' + esc(liga) + '" target="_blank" rel="noopener noreferrer">Ver preço na LigaMagic</a></div>';
  h += '<h3>Anotações de mesa</h3><textarea class="inp" data-act="nota" data-fid="nota" rows="3" placeholder="Como a carta se saiu, com quem combinou, o que faltou" aria-label="Anotações de mesa">' + esc(c.nota) + '</textarea>';
  h += '<div class="dw-sum"><span>Pontuação da carta</span><b>' + pts(c) + '</b></div>';
  h += '<div class="dw-links">' +
    (c.edited ? '<button class="linkish" data-act="reset-card" data-fid="rc">Voltar à avaliação original</button>' : '') +
    (c.cand ? '<button class="linkish" data-act="go" data-v="radar">' + (c.inDeck ? 'Ver a troca no radar' : 'Planejar a entrada no radar') + '</button>' :
      (c.cmd ? '' : (c.inDeck ? '<button class="linkish" data-act="cut" data-id="' + esc(c.id) + '" data-fid="ct">Tirar do deck</button>' : '<button class="linkish" data-act="restore" data-id="' + esc(c.id) + '" data-fid="ct">Devolver ao deck</button>'))) +
    '<a href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">Abrir no Scryfall</a>' +
    (canImg() ? '<button class="linkish" data-act="img" data-fid="img2">' + (imgOn() ? 'Desligar as imagens' : (hasPack() ? 'Ligar as imagens' : 'Ligar as imagens (usa internet)')) + '</button>' : '') + '</div>';
  el.innerHTML = h;
  el.hidden = false; $('#scrim').hidden = false;
}

/* ============ modais ============ */
function decklistText() {
  return deck().sort(function (a, b) { return (b.cmd ? 1 : 0) - (a.cmd ? 1 : 0) || a.n.localeCompare(b.n); }).map(function (c) {
    return c.q + ' ' + (c.on || c.n) + (c.set ? ' (' + c.set + ') ' + c.num : '') + (c.foil ? (c.etched ? ' E' : ' *F*') : '') + (c.cmd ? ' *CMDR*' : '');
  }).join('\n');
}
function backupHtml() {
  return '<button class="x" data-act="close" aria-label="Fechar">×</button><h2 id="md-title">Backup</h2>' +
    '<p style="margin-top:8px">' + esc(storeTxt()) + (S.ts ? ' Última gravação: ' + fts(S.ts) + '.' : '') + '</p>' +
    '<h3>Backup do painel</h3><p>Guarda tiers, relevância, notas, PetCards, valores, anotações, trocas com data e motivo, e as cartas que você adicionou ao radar. Para levar ao projeto, use a aba <button class="linkish" data-act="go" data-v="ofi">Oficina</button>.</p>' +
    '<textarea id="bk-out" readonly aria-label="Backup do painel">' + esc(JSON.stringify(S)) + '</textarea>' +
    '<div class="acts"><button class="btn sm" data-act="copy" data-t="bk-out">Copiar backup</button></div>' +
    '<h3>Restaurar de um backup</h3><textarea id="bk-in" placeholder="Cole aqui o texto de um backup" aria-label="Texto do backup para restaurar"></textarea>' +
    '<div class="acts"><button class="btn sm" data-act="import">Restaurar</button></div>' +
    '<h3>Decklist atual</h3><p>No formato da sua lista, já com as trocas feitas no radar.</p>' +
    '<textarea id="bk-list" readonly aria-label="Decklist atual">' + esc(decklistText()) + '</textarea>' +
    '<div class="acts"><button class="btn sm" data-act="copy" data-t="bk-list">Copiar decklist</button></div>' +
    '<h3>Recomeçar</h3><p>Apaga suas alterações e volta à avaliação original de todas as cartas.</p>' +
    '<div class="acts"><button class="btn ghost sm" data-act="reset-all" data-fid="ra">' + (ui.confirmReset ? 'Confirmar: apagar minhas alterações' : 'Voltar tudo ao original') + '</button></div>';
}
function cmpHtml(aId, bId) {
  var a = byId(aId), b = bId ? byId(bId) : null, rows = '', i;
  if (!a) return '';
  function col(c, cls, lab) {
    return '<div class="cmp-col"><p class="cmp-lab ' + cls + '">' + lab + '</p>' + (imgOn() ? '<div class="cmp-img c-' + esc(c.col) + '">' + fbTile(c, false, true) + imgTag(c, 'normal', false) + '</div>' : '') +
      '<h3>' + esc(c.n) + '</h3><p class="cand-m">' + (c.cost ? mana(c.cost) + ' ' : '') + esc(c.line) + (c.pt ? ', ' + esc(c.pt) : '') + '</p><p class="cmp-why">' + rich(c.why || c.fx || '') + '</p></div>';
  }
  function row(lab, va, vb, na, nb, better) {
    var wa = '', wb = '';
    if (better && na != null && nb != null && na !== nb) { var aw = better === 'hi' ? na > nb : na < nb; wa = aw ? ' w' : ' lo'; wb = aw ? ' lo' : ' w'; }
    rows += '<tr><td class="l' + wa + '">' + va + '</td><th scope="row">' + lab + '</th><td class="r' + wb + '">' + vb + '</td></tr>';
  }
  var sum = '';
  if (b) {
    row('Tier', tierB(a.tier, true), tierB(b.tier, true), -TR[a.tier], -TR[b.tier], 'hi');
    row('Custo', a.land ? '—' : String(a.cmc), b.land ? '—' : String(b.cmc), a.land ? null : a.cmc, b.land ? null : b.cmc, 'lo');
    if (TRIBO) row(esc(TRIBO.nome), a.mk.tribo ? 'sim' : 'não', b.mk.tribo ? 'sim' : 'não', a.mk.tribo ? 1 : 0, b.mk.tribo ? 1 : 0, 'hi');
    var parts = [];
    for (i = 0; i < NG; i++) {
      row('<i class="dot" style="--c:var(--g' + i + ')"></i>' + esc(G[i].sh || G[i].k), String(gv(a, i)), String(gv(b, i)), gv(a, i), gv(b, i), 'hi');
      var d = gv(a, i) - gv(b, i); if (d) parts.push(esc(G[i].sh || G[i].k) + ' ' + (d > 0 ? '+' : '−') + Math.abs(d));
    }
    row('Pontos', String(pts(a)), String(pts(b)), pts(a), pts(b), 'hi');
    if (EDH) row(esc(EDH.fonte), synTxt(a.syn), synTxt(b.syn), a.syn == null ? null : a.syn, b.syn == null ? null : b.syn, 'hi');
    var dp = pts(a) - pts(b);
    sum = '<p class="cmp-sum"><b>Saldo da troca:</b> ' + (parts.length ? parts.join(', ') : 'nenhuma mudança nos agrupamentos') + '. Pontos ' + (dp > 0 ? '+' : dp < 0 ? '−' : '') + Math.abs(dp) + '.</p>';
  }
  return '<button class="x" data-act="close" aria-label="Fechar">×</button><h2 id="md-title">Comparar a troca</h2>' +
    '<p style="margin-top:8px">Lado a lado, quem entra e quem sai. Pontos ajudam, mas não decidem sozinhos: leia o motivo de cada uma.</p>' +
    '<label class="fld" style="margin-top:12px">Quem sai <select class="inp" data-act="cmp-b" data-fid="cmpb" style="flex:1;min-width:0">' + cutOptions(a, bId || '') + '</select></label>' +
    '<div class="cmp">' + col(a, 'in', 'Entra') + (b ? col(b, 'out', 'Sai') : '<div class="cmp-col"><p class="cmp-lab out">Sai</p><p class="hint">Ninguém. O deck passaria de 100 cartas.</p></div>') + '</div>' +
    (b ? '<table class="cmp-t"><tbody>' + rows + '</tbody></table>' + sum : '') +
    '<div class="acts" style="margin-top:14px"><button class="btn" data-act="cmp-swap" data-fid="cmps">Confirmar a troca</button><button class="btn ghost" data-act="close">Fechar</button></div>';
}
function renderModal() {
  var el = $('#modal');
  if (!ui.modal) { el.hidden = true; $('#scrim').hidden = !ui.drawer; return; }
  var cmp = ui.modal !== 'backup';
  el.className = 'modal' + (cmp ? ' wide' : '');
  el.innerHTML = cmp ? cmpHtml(ui.modal.a, ui.modal.b) : backupHtml();
  el.hidden = false; $('#scrim').hidden = false;
}

/* ============ orquestração ============ */
var RENDER = { geral: renderGeral, gal: renderGal, tier: renderTier, pk: renderPk, tab: renderTab, ctrl: renderCtrl, radar: renderRadar, ofi: renderOfi };
function renderCount() {
  var n = 0; deck().forEach(function (c) { n += c.q; });
  var el = $('#deckCount');
  el.textContent = n === 100 ? '100 cartas' : n + ' cartas, ' + (n > 100 ? 'sobram ' + (n - 100) : 'faltam ' + (100 - n));
  el.className = 'count' + (n === 100 ? '' : ' off');
  var eb = $('#edhBtn');
  if (eb) { var po = poolOpen().length; eb.hidden = !(D.pool && D.pool.length); eb.textContent = 'Potenciais ' + po; }
}
function render(keepFocus) {
  var fid = null, a = document.activeElement, tw = $('#tw'), sc = tw ? [tw.scrollTop, tw.scrollLeft] : null;
  if (keepFocus !== false && a && a.dataset) fid = a.dataset.fid || (a.id === 'q' ? '#q' : null);
  hidePeek();
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
  var cur = $('.tabs [aria-selected="true"]'), bar = $('.tabs');
  if (cur && bar) bar.scrollLeft = Math.max(0, cur.offsetLeft - (bar.clientWidth - cur.offsetWidth) / 2);
  render(false);
  window.scrollTo(0, 0);
}
var toastT;
function toast(msg) {
  var el = $('#toast'); el.textContent = msg; el.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2600);
}
function commit(msg) { save(); render(); if (msg) toast(msg); }
function openDrawer(id) { ui.drawer = id; ui.face = 0; ui.modal = null; hidePeek(); renderModal(); renderDrawer(); var d = $('#drawer'); d.scrollTop = 0; d.focus(); }
function closeAll() {
  var id = ui.drawer; ui.drawer = null; ui.modal = null; ui.confirmReset = false; renderDrawer(); renderModal();
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
function today() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
function firstSentence(t) { var m = /^.*?[.!?](\s|$)/.exec(String(t || '')); return m ? m[0].trim() : String(t || ''); }
function doSwap(id, outId) {
  var c = byId(id), o = outId ? byId(outId) : null; if (!c) return;
  S.inn[id] = 1;
  if (o) { if (o.cand) delete S.inn[outId]; else S.out[outId] = 1; }
  S.swaps = S.swaps.filter(function (s) { return s.i !== id; });
  S.swaps.push({ i: id, o: o ? outId : null, d: today(), m: firstSentence(c.why) });
  commit(c.n + ' entrou' + (o ? ', ' + o.n + ' saiu' : ''));
}
function updOf(o) {
  var ta = $('#ofc-' + o.k); if (ta) ta.value = ofCmd(o);
}
function act(a, t, ev) {
  var c, id = t.dataset.id, o, i;
  switch (a) {
    case 'backup': ui.modal = 'backup'; ui.drawer = null; ui.confirmReset = false; renderDrawer(); renderModal(); $('#modal').focus(); break;
    case 'close': closeAll(); break;
    case 'go': ui.drawer = null; ui.modal = null; go(t.dataset.v); break;
    case 'edh': ui.drawer = null; go('radar'); o = $('#pool'); if (o) o.scrollIntoView({ block: 'start' }); break;
    case 'curve': ui.curve = t.dataset.v; render(); break;
    case 'filter-group': ui.fg = +t.dataset.g; ui.q = ''; ui.ft = ''; ui.fr = ''; go('tab'); break;
    case 'fg': ui.fg = (ui.fg === +t.dataset.g ? -1 : +t.dataset.g); render(); break;
    case 'sort':
      if (ui.sort.k === t.dataset.k) ui.sort.d = -ui.sort.d;
      else ui.sort = { k: t.dataset.k, d: (t.dataset.k === 'n' || t.dataset.k === 'tier' || t.dataset.k === 'rel') ? 1 : -1 };
      render(); break;
    case 'tier-type': ui.tierType = t.dataset.v; render(); break;
    case 'pk-reset': S.pk = {}; commit('Simulação do 8×8 desfeita'); break;
    case 'tier-view': ui.tierView = t.dataset.v; render(); break;
    case 'gal-by': ui.galBy = t.dataset.v; render(); break;
    case 'img': S.img = !imgOn(); save(); render(); break;
    case 'img-retry': imgFailN = 0; imgOk = false; render(); updImgNote(); toast('Buscando as imagens de novo'); break;
    case 'face': ui.face = ui.face ? 0 : 1; renderDrawer(); var fb = $('[data-fid="face"]'); if (fb) fb.focus(); break;
    case 'set-tier': ov(ui.drawer).tier = t.dataset.v; commit(); break;
    case 'set-rel': ov(ui.drawer).rel = t.dataset.v; commit(); break;
    case 'set-verdict': ov(ui.drawer).verdict = t.dataset.v; commit(); break;
    case 'verdict':
      c = byId(id); if (!c || !c.cand) break;
      ov(id).verdict = t.dataset.v;
      commit(c.n + (t.dataset.v === 'fora' ? ' fica de fora do radar' : t.dataset.v === 'entra' ? ' com veredito de entrada' : ' voltou para avaliação')); break;
    case 'reval': ov(id).verdict = 'avaliar'; c = byId(id); commit((c ? c.n : 'A carta') + ' voltou para avaliação'); break;
    case 'step':
      c = byId(ui.drawer); o = ov(ui.drawer); o.s = c.s.slice();
      i = +t.dataset.g;
      o.s[i] = Math.max(G[i].neg ? -1 : 0, Math.min(3, (o.s[i] || 0) + (+t.dataset.d)));
      commit(); break;
    case 'reset-card':
      o = S.ov[ui.drawer]; if (o) { delete o.s; delete o.tier; delete o.rel; if (!Object.keys(o).length) delete S.ov[ui.drawer]; }
      delete S.pk[ui.drawer];
      commit('Avaliação original restaurada'); break;
    case 'cut':
      c = byId(id); if (!c) break;
      if (c.cand) { delete S.inn[id]; S.swaps = S.swaps.filter(function (s) { return s.i !== id; }); } else S.out[id] = 1;
      commit(c.n + ' saiu do deck'); break;
    case 'restore':
      c = byId(id); delete S.out[id]; S.swaps.forEach(function (s) { if (s.o === id) s.o = null; });
      commit((c ? c.n : 'A carta') + ' voltou ao deck'); break;
    case 'swap': var sel = $('#sel-' + id); doSwap(id, sel ? sel.value : ''); break;
    case 'cmp':
      var s2 = $('#sel-' + id); ui.modal = { a: id, b: s2 ? s2.value : '' }; ui.drawer = null; hidePeek(); renderDrawer(); renderModal();
      var md = $('#modal'); md.scrollTop = 0; md.focus(); break;
    case 'cmp-swap': if (ui.modal && ui.modal.a) { var ma = ui.modal.a, mb = ui.modal.b; ui.modal = null; doSwap(ma, mb); } break;
    case 'unswap':
      S.swaps.forEach(function (s) { if (s.i === id && s.o) { var oc = byId(s.o); if (oc && oc.cand) S.inn[s.o] = 1; else delete S.out[s.o]; } });
      delete S.inn[id]; S.swaps = S.swaps.filter(function (s) { return s.i !== id; });
      commit('Troca desfeita'); break;
    case 'pool-in':
      o = poolById(id); if (!o || byId(o.id)) break;
      var ps = []; for (i = 0; i < NG; i++) ps.push(0);
      S.custom.push({ id: o.id, n: o.n, q: 1, cost: o.cost, cmc: o.cmc, t: o.t, g: o.g, line: o.line, pt: o.pt, col: o.col, s: ps, tier: 'B', rel: 'MED',
        fx: o.fx, why: '', orig: 1, syn: o.syn, sid: o.sid, cand: 1, custom: 1, pool: 1, verdict: t.dataset.v, mk: o.mk || {}, land: o.land ? 1 : 0, prod: o.prod, mdfc: o.mdfc, dfc: o.dfc, back: o.back });
      commit(o.n + (t.dataset.v === 'fora' ? ' fica de fora' : ' entrou no radar')); break;
    case 'pool-all': ui.poolAll = !ui.poolAll; render(); break;
    case 'add-custom':
      var name = $('#nc-n').value.trim();
      if (!name) { toast('Informe o nome da carta'); $('#nc-n').focus(); break; }
      var pc = parseCost($('#nc-c').value), tk = $('#nc-t').value, ty = TYPES.filter(function (x) { return x.k === tk; })[0], sc = [];
      for (i = 0; i < NG; i++) sc.push(+$('#nc-g' + i).value || 0);
      var tb = TRIBO && $('#nc-v') ? $('#nc-v').checked : false;
      S.custom.push({ id: 'x-' + slug(name) + '-' + Date.now().toString(36), n: name, q: 1, cost: tk === 'ter' ? '' : pc.cost, cmc: tk === 'ter' ? 0 : pc.cmc, t: tk, g: GROUP_OF[tk],
        line: ty.o + (tb ? ' — ' + TRIBO.nome : ''), col: tk === 'ter' ? 'L' : pc.col, s: sc, tier: $('#nc-tier').value, rel: 'MED', fx: '', why: $('#nc-w').value.trim(),
        cand: 1, custom: 1, verdict: 'avaliar', mk: tb ? { tribo: 1 } : {}, land: tk === 'ter' ? 1 : 0 });
      commit(name + ' entrou no radar'); break;
    case 'del-custom':
      S.swaps.forEach(function (s) { if (s.i === id && s.o) { var oc = byId(s.o); if (oc && oc.cand) S.inn[s.o] = 1; else delete S.out[s.o]; } });
      c = byId(id);
      S.custom = S.custom.filter(function (x) { return x.id !== id; }); delete S.inn[id]; delete S.ov[id];
      S.swaps = S.swaps.filter(function (s) { return s.i !== id; });
      commit(c && c.pool ? c.n + ' voltou aos potenciais' : 'Carta excluída do radar'); break;
    case 'copy':
      var ta = $('#' + t.dataset.t); ta.focus(); ta.select();
      var done = function () { toast('Copiado'); };
      var manual = function () { toast('Texto selecionado: copie com Ctrl+C'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, function () { try { if (document.execCommand('copy')) done(); else manual(); } catch (e) { manual(); } });
      else { try { if (document.execCommand('copy')) done(); else manual(); } catch (e) { manual(); } }
      break;
    case 'import':
      try {
        var raw = JSON.parse($('#bk-in').value);
        if (!raw || typeof raw !== 'object' || !('ov' in raw)) throw new Error('formato');
        S = normalize(raw); ui.modal = null; commit('Backup restaurado');
      } catch (e) { toast('Esse texto não é um backup deste painel'); }
      break;
    case 'reset-all':
      if (!ui.confirmReset) { ui.confirmReset = true; renderModal(); var b = $('[data-fid="ra"]'); if (b) b.focus(); break; }
      S = fresh(); ui.confirmReset = false; ui.modal = null; commit('Painel de volta ao original'); break;
  }
}

/* ============ eventos ============ */
document.addEventListener('click', function (ev) {
  var t = ev.target;
  if (t.id === 'scrim') { closeAll(); return; }
  var tab = t.closest('[role=tab][data-tab]'); if (tab) { go(tab.dataset.tab); return; }
  var a = t.closest('[data-act]');
  if (a && a.tagName !== 'INPUT' && a.tagName !== 'SELECT' && a.tagName !== 'TEXTAREA') { act(a.dataset.act, a, ev); return; }
  if (a) return;
  var card = t.closest('[data-card]'); if (card) { openDrawer(card.getAttribute('data-card')); }
});
document.addEventListener('change', function (ev) {
  var t = ev.target, a = t.dataset && t.dataset.act, o;
  if (t.dataset && t.dataset.of) { ofField(t); return; }
  if (!a) return;
  if (a === 'ft') { ui.ft = t.value; render(); }
  else if (a === 'fr') { ui.fr = t.value; render(); }
  else if (a === 'grouped') { ui.grouped = t.checked; render(); }
  else if (a === 'tier-lands') { ui.tierLands = t.checked; render(); }
  else if (a === 'ctrl-lands') { ui.ctrlLands = t.checked; render(); }
  else if (a === 'gal-lands') { ui.galLands = t.checked; render(); }
  else if (a === 'img-tog') { S.img = t.checked; save(); render(); }
  else if (a === 'pet') { o = ov(ui.drawer); if (t.checked) o.pet = true; else delete o.pet; commit(); }
  else if (a === 'tem') { o = ov(ui.drawer); if (t.checked) o.tem = true; else delete o.tem; commit(); }
  else if (a === 'cmp-b') { if (ui.modal && ui.modal.a) { ui.modal.b = t.value; renderModal(); var s = $('[data-fid="cmpb"]'); if (s) s.focus(); } }
  /* campos de texto: grava sem redesenhar, para não engolir o clique que tirou o foco */
  else if (a === 'val') {
    var v = parseFloat(String(t.value).replace(',', '.'));
    o = ov(ui.drawer); if (isNaN(v) || v < 0) delete o.val; else o.val = Math.round(v * 100) / 100;
    save();
  }
  else if (a === 'nota') { o = ov(ui.drawer); if (t.value.trim()) o.nota = t.value; else delete o.nota; save(); }
  else if (a === 'motivo') { var sw = S.swaps[+t.dataset.i]; if (sw) { sw.m = t.value; save(); } }
});
function ofField(t) {
  var k = t.dataset.of; ui.of[k] = ui.of[k] || {}; ui.of[k][t.dataset.k] = t.value.trim();
  OF.forEach(function (o) { if (o.k === k) updOf(o); });
}
document.addEventListener('input', function (ev) {
  if (ev.target.id === 'q') { ui.q = ev.target.value; var tb = $('#tbody'); if (tb) tb.innerHTML = tabRows(); }
  else if (ev.target.dataset && ev.target.dataset.of) ofField(ev.target);
});
document.addEventListener('keydown', function (ev) {
  hidePeek();
  if (ev.key === 'Escape' && (ui.drawer || ui.modal)) { closeAll(); return; }
  var t = ev.target;
  if ((ev.key === 'Enter' || ev.key === ' ') && t.matches && t.matches('.chip,.petal,.wedge,.pena,tr.row,.gtile,.cand-img')) { ev.preventDefault(); t.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
  if (t.matches && t.matches('[role=tab]') && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft')) {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role=tab]')), i = tabs.indexOf(t);
    var n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); go(n.dataset.tab); n.focus();
  }
});
/* arrastar e soltar */
document.addEventListener('dragstart', function (ev) {
  hidePeek();
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
  if (kv[0] === 'pk') {
    if (!c || pkOf(c) === kv[1]) { z.classList.remove('over'); return; }
    if (kv[1] === (c.pk0 || pkDef(c))) delete S.pk[id]; else S.pk[id] = kv[1];
    commit(c.n + ': pacote ' + pkNome(kv[1])); return;
  }
  if (!c || c[kv[0]] === kv[1]) { z.classList.remove('over'); return; }
  ov(id)[kv[0]] = kv[1];
  commit(c.n + (kv[0] === 'tier' ? ': tier ' + kv[1] : ': ' + RELS[RR[kv[1]]].n));
});
/* imagens: cai para a próxima fonte quando uma falha; só aparece depois de carregar */
document.addEventListener('error', function (ev) {
  var t = ev.target; if (!t || t.tagName !== 'IMG' || !t.classList || !t.classList.contains('ci')) return;
  var alt = (t.getAttribute('data-alt') || '').split('|').filter(Boolean);
  if (alt.length) { t.setAttribute('data-alt', alt.slice(1).join('|')); t.src = alt[0]; return; }
  t.classList.add('ci-x');
  if (t.closest('#peek')) hidePeek();
  if (!imgFailN++ && !imgOk) {
    updImgNote();
    if (ui.tab === 'tier' && !ui.tierView) setTimeout(function () { if (!imgOk) render(); }, 0);
  }
}, true);
document.addEventListener('load', function (ev) {
  var t = ev.target; if (!t || t.tagName !== 'IMG' || !t.classList || !t.classList.contains('ci')) return;
  t.classList.add('ci-ok');
  if (t.closest('#peek')) $('#peek').hidden = false;
  if (!imgOk) { imgOk = true; updImgNote(); }
}, true);
/* prévia da carta ao passar o mouse */
document.addEventListener('mousemove', function (ev) { mx = ev.clientX; my = ev.clientY; }, { passive: true });
document.addEventListener('mouseover', function (ev) {
  if (!canHover || !imgOn()) return;
  var el = ev.target.closest && ev.target.closest('[data-card],[data-pool]');
  if (el && (el.closest('#drawer') || el.closest('#modal') || el.classList.contains('cmd-art'))) el = null;
  if (el === peekEl) return;
  hidePeek();
  if (el) { peekEl = el; mx = ev.clientX; my = ev.clientY; peekT = setTimeout(function () { if (peekEl === el) showPeek(el); }, 170); }
});
document.addEventListener('mousedown', hidePeek);
document.addEventListener('scroll', hidePeek, true);
var rzT;
window.addEventListener('resize', function () {
  clearTimeout(rzT); hidePeek();
  rzT = setTimeout(function () { if (ui.tab === 'geral' && (window.innerWidth < 700) !== ui.narrow) render(); }, 160);
});

/* ============ início ============ */
function footHtml() {
  return 'Custos, tipos e textos conferidos no Scryfall' + (M.scryfall ? ', em ' + fdate(M.scryfall) : '') + '. ' +
    (EDH ? 'Sinergias do ' + esc(EDH.fonte) + ', consultado em ' + esc(EDH.lido) + '. ' : '') +
    'Imagens das cartas ' + (hasPack() ? 'embutidas a partir do Scryfall' : 'servidas pelo Scryfall') + ', e a arte do comandante é da Wizards of the Coast. ' +
    'Tier, relevância e notas são a avaliação do Claude em ' + esc(M.feito) + ', e tudo pode ser editado tocando em qualquer carta. ' +
    '<span class="rev">Revisão ' + esc(M.rev) + ' deste painel.</span>';
}
$('#footTxt').innerHTML = footHtml();
if (PUB) { var vh = $('#voltar'); if (vh) vh.hidden = true; }   /* a página publicada não tem o hub ao lado */
updStoreNote();
go('geral');
initRemote();
if (PUB && M.gfonts) {
  /* na página publicada, as mesmas fontes também vêm do Google Fonts, caso as embutidas sejam barradas */
  var gf = document.createElement('link'); gf.rel = 'stylesheet';
  gf.href = M.gfonts;
  document.head.appendChild(gf);
}
})();
