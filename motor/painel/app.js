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
function fresh() { return { v: 1, ov: {}, custom: [], inn: {}, out: {}, swaps: [], img: true, ts: 0 }; }
function fitS(a) { a = a.slice(0, NG); while (a.length < NG) a.push(0); return a; }
function normalize(s) {
  var f = fresh();
  if (!s || typeof s !== 'object') return f;
  ['ov', 'inn', 'out'].forEach(function (k) { if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) f[k] = s[k]; });
  Object.keys(f.ov).forEach(function (id) { var o = f.ov[id]; if (o && Array.isArray(o.s) && o.s.length !== NG) o.s = fitS(o.s); });
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
  var st = { n: 0, nonland: 0, cmcSum: 0, curve: [], types: {}, cols: {}, rel: {}, relVal: {}, relValN: {}, tier: {}, grp: [],
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
  return cs.filter(function (c) { return !c.cmd && !c.pet && (!!c.land === !!lands); }).sort(function (a, b) {
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
  L.push((c.set ? 'https://api.scryfall.com/cards/' + enc(c.set.toLowerCase()) + '/' + enc(String(c.num).toLowerCase()) + '?format=image' :
    'https://api.scryfall.com/cards/named?format=image&exact=' + enc(c.n)) + '&version=' + size + (back ? '&face=back' : ''));
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
function gLabel(i, am, R, v) {
  var t = am * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t), lr = R + 28;
  var x = 230 + lr * cs, y = 230 + lr * sn + (sn < 0 ? -6 : 4);
  var anc = cs > 0.3 ? 'start' : cs < -0.3 ? 'end' : 'middle';
  return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anc + '">' + esc(G[i].sh || G[i].k) +
    '<tspan class="v" x="' + x.toFixed(1) + '" dy="1.08em">' + v + '</tspan></text>';
}
function chartSvg(st) {
  var rosa = M.grafico !== 'padrao', r0 = 60, R = 184, max = 1, i, step = 360 / NG, gap = rosa ? 2.4 : 1.2;
  for (i = 0; i < NG; i++) max = Math.max(max, st.grp[i].pts);
  var o = '<svg viewBox="-58 -2 576 464" role="group" aria-label="' + (rosa ? 'Rosácea' : 'Gráfico') + ' dos ' + NUM[NG] + ' agrupamentos, com a pontuação total no centro"><defs>';
  for (i = 0; i < NG; i++) {
    o += '<radialGradient id="rg' + i + '" gradientUnits="userSpaceOnUse" cx="230" cy="230" r="' + R + '">' +
      '<stop offset=".3" style="stop-color:rgba(var(--g' + i + '),.5)"/><stop offset="1" style="stop-color:rgb(var(--g' + i + '))"/></radialGradient>';
  }
  o += '</defs>';
  if (rosa) {
    o += '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.5);stroke:var(--gold)" stroke-width="1.3"/>';
    o += '<circle cx="230" cy="230" r="' + (R + 14) + '" style="fill:none;stroke:var(--gold)" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 9.2" opacity=".75"/>';
  } else {
    o += '<circle cx="230" cy="230" r="' + (R + 6) + '" style="fill:rgba(var(--deep-rgb),.4);stroke:var(--line2)" stroke-width="1"/>';
  }
  for (i = 0; i < NG; i++) {
    var a0 = -90 + i * step + gap, a1 = -90 + (i + 1) * step - gap, am = (a0 + a1) / 2;
    var v = st.grp[i].pts, fr = Math.max(0.12, Math.sqrt(Math.max(v, 0) / max)), r1 = r0 + (R - r0) * fr;
    var shape = rosa ? petalPath : wedgePath;
    o += '<g class="' + (rosa ? 'petal' : 'wedge') + '" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + v + ' pontos. Abrir no tabelão.">' +
      '<title>' + esc(G[i].k) + ': ' + v + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
      '<path class="ghost" d="' + shape(r0, R, a0, a1) + '" style="fill:rgba(var(--g' + i + '),.07);stroke:rgba(var(--gold-rgb),' + (rosa ? '.45' : '.25') + ')" stroke-width="1"/>' +
      '<path class="fill" d="' + shape(r0, r1, a0, a1) + '" fill="url(#rg' + i + ')" style="stroke:rgba(var(--gold2-rgb),' + (rosa ? '.85' : '.55') + ')" stroke-width="' + (rosa ? '1.3' : '1') + '" stroke-linejoin="round"/></g>';
    o += gLabel(i, am, R, v);
  }
  o += '<circle cx="230" cy="230" r="' + (r0 - 7) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
    (rosa ? '<circle cx="230" cy="230" r="' + (r0 - 12) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>' : '') +
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
        'Mais ' + g.soft + ' ' + esc(l.passagem || 'de passagem') + '.' + (G[i].ref ? ' Referência: ' + refTxt(G[i]) + '.' : '') +
        (w && l.alerta ? ' ' + esc(l.alerta) : '') + (l.farto && g.hard >= l.farto.min ? ' ' + esc(l.farto.texto) : ''));
    } else if (l.tipo === 'remocao') {
      i = gi(l.g); var mr = l.massa_ref || [3, 5];
      w = st.wipes > (l.massa_max == null ? 5 : l.massa_max) || (l.min != null && st.grp[i].hard < l.min);
      add(w ? 'warn' : 'ok', pl(st.grp[i].hard, 'remoção', 'remoções') + ', sendo ' + pl(st.wipes, 'em massa', 'em massa') + '.',
        'Referência: ' + refTxt(G[i], '8 a 12') + ' no total, com ' + mr[0] + ' a ' + mr[1] + ' globais.' + (w && l.alerta ? ' ' + esc(l.alerta) : ''));
    } else if (l.tipo === 'contagem') {
      x = st.mk[l.marcador]; n = x.n;
      w = (l.min != null && n < l.min) || (l.max != null && n > l.max);
      parts = [];
      if (l.listar && x.names.length) parts.push(esc(x.names.join(', ')) + '.');
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
function heroHtml(st, cmd) {
  var cap = M.capa || {}, art = !!cap.tem, larga = cap.moldura !== 'retrato';
  var verbos = (M.verbos || []).length ? ' O plano cabe em três verbos: ' + esc(M.verbos.join(', ')) + '.' : '';
  var nome = M.cmd || (cmd ? cmd.n : '');
  var facts = '<dl class="facts"><div><dt>cartas</dt><dd>' + st.n + '</dd></div><div><dt>CMC médio</dt><dd>' + fmt(st.avg) + '</dd></div>' +
    '<div><dt>' + esc(M.eixo && M.eixo.rotulo ? M.eixo.rotulo : 'criaturas') + '</dt><dd>' + eixoN(st) + '</dd></div><div><dt>fontes de terreno</dt><dd>' + (st.lands + st.mdfc) + '</dd></div>' +
    '<div><dt>foils</dt><dd>' + st.foils + '</dd></div></dl>';
  var chart = '<figure class="rosa">' + chartSvg(st) + '<figcaption>Cada ' + (M.grafico === 'padrao' ? 'fatia' : 'pétala') +
    ' é um agrupamento e sua área é a soma das notas. Toque numa ' + (M.grafico === 'padrao' ? 'fatia' : 'pétala') + ' para abrir no tabelão.</figcaption></figure>';
  var fx = cmd && cmd.fx ? '<p class="hero-fx">' + rich(cmd.fx) + '</p>' : '';
  var lede = (M.lede || verbos) ? '<p class="hero-lede">' + esc(M.lede || '') + verbos + '</p>' : '';
  if (!larga) {
    return '<div class="hero retrato' + (art ? '' : ' sem-capa') + '">' +
      (art ? '<figure class="port"><div class="port-img" role="img" aria-label="' + esc(cap.alt || 'Arte de ' + nome) + '"></div>' +
        '<svg class="port-fr" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0.8,139.2V47.6Q0.8,14.6 50,1Q99.2,14.6 99.2,47.6V139.2Z"/><path class="in" d="M4.2,135.8V48.8Q4.2,18.4 50,5.8Q95.8,18.4 95.8,48.8V135.8Z"/></svg>' +
        '<figcaption>' + esc(cap.credito || 'Arte da carta, © Wizards of the Coast') + '</figcaption></figure>' : '') +
      '<div class="hero-txt"><h1>' + esc(M.painel) + '</h1>' +
      '<p class="hero-sub">' + esc(nome) + (cmd ? mana(cmd.cost) : '') + '</p>' +
      (cmd ? '<p class="hero-type">' + esc(cmd.line) + (cmd.pt ? ', ' + esc(cmd.pt) : '') + '</p>' : '') + fx + lede + facts + '</div>' + chart + '</div>';
  }
  return '<div class="hero larga' + (art ? '' : ' sem-capa') + '"><div class="hero-top"><div class="hero-txt"><h1>' + esc(M.painel) + '</h1>' +
    (art && cmd ? '' : '<p class="hero-sub">' + esc(nome) + (cmd ? mana(cmd.cost) : '') + '</p>' + (cmd ? '<p class="hero-type">' + esc(cmd.line) + (cmd.pt ? ', ' + esc(cmd.pt) : '') + '</p>' : '')) +
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
      (anyVal ? '<td class="num">' + (st.relValN[r.k] ? 'R$ ' + fmt(st.relVal[r.k]) : '—') + '</td><td class="num">' + (st.relValN[r.k] ? 'R$ ' + fmt(st.relVal[r.k] / st.relValN[r.k]) : '—') + '</td>' : '') + '</tr>';
  }).join('');

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

  var cmd = cs.filter(function (c) { return c.cmd; })[0];
  var h = heroHtml(st, cmd);

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

  h += '<div class="grid g-11">' +
    '<fieldset class="pn"><legend>Os ' + NUM[NG] + ' agrupamentos</legend><div class="gl">' + groups + '</div>' +
    '<p class="pn-note">O número em destaque conta as cartas com nota 2 ou 3; o que vem depois do sinal de mais, as de nota 1. A faixa tracejada, onde aparece, é a referência usual de Commander, e vale como regra de bolso.</p></fieldset>' +
    '<fieldset class="pn"><legend>Leitura do deck</legend><ul class="read">' + readings(st) + '</ul></fieldset></div>';

  h += '<div class="grid g-111">' + coresPanel(st) +
    '<fieldset class="pn"><legend>Tipos de carta</legend><div class="bars">' + typeBars + '</div>' +
    '<h3 class="sub">Edições mais presentes</h3><div class="bars">' + setBars + '</div></fieldset>' +
    '<fieldset class="pn"><legend>Relevância</legend><table class="rel-t"><thead><tr><th></th><th>Qtd</th><th>Do deck</th>' + (anyVal ? '<th>Valor</th><th>Média</th>' : '') + '</tr></thead><tbody>' + relRows + '</tbody></table>' +
    '<p class="pn-note">' + (anyVal ? 'Valores somam apenas as cartas com preço preenchido.' : 'Para ver valor e média por faixa, como na planilha, preencha o preço em cada carta.') +
    ' <button class="linkish" data-act="go" data-v="ctrl">Abrir o painel de controle</button></p></fieldset></div>';

  if (D.combos.length) h += '<fieldset class="pn"><legend>Combos e linhas de jogo</legend><div class="combos">' + combos + '</div></fieldset>';
  h += edhPanel(cs);

  var el = $('#v-geral');
  el.className = 'view' + (ui.first ? ' anim' : '');
  el.innerHTML = h;
  ui.first = false;
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
  function nomes(a) { return lista(a.map(function (nm) { var id = slug(nm); return (inDeck[id] || radar[id]) ? '<button class="linkish" data-card="' + esc(id) + '">' + esc(nm) + '</button>' : esc(nm); })); }
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
    (tleg ? '<h3 class="sub">Como a comunidade monta o ' + esc(M.curto || 'comandante') + '</h3><div class="stack">' + themes + '</div><div class="legend">' + tleg + '</div>' : '') +
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

/* ============ tabelão ============ */
function sortVal(c, k) {
  if (k === 'n') return c.n.toLowerCase();
  if (k === 'q') return c.q;
  if (k === 'cmc') return c.land ? -1 : c.cmc;
  if (k === 'pts') return pts(c);
  if (k === 'syn') return c.syn == null ? -999 : c.syn;
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
var NCOL = 7 + NG + (EDH ? 1 : 0);
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
    for (var i = 0; i < NG; i++) cells += scCell(gv(c, i), i);
    return '<tr class="row" data-card="' + esc(c.id) + '" tabindex="0"><td class="c-name"><div class="nm c-' + esc(c.col) + '">' +
      (imgOn() ? '<span class="thb">' + imgTag(c, 'small', false) + '</span>' : '') + '<span class="t">' + esc(c.n) + '</span>' +
      (c.foil ? '<span class="foil" title="Foil">✦</span>' : '') + (c.pet ? '<span class="pet" title="PetCard">♥</span>' : '') + (c.edited ? '<span class="edt" title="Avaliação alterada por você"></span>' : '') +
      '</div></td><td class="dimc num hm">' + c.q + '</td><td class="hm">' + (c.cost ? mana(c.cost) : '<span class="dimc">—</span>') + '</td><td class="num">' + (c.land ? '<span class="dimc">—</span>' : c.cmc) + '</td>' + cells +
      '<td class="pts num">' + pts(c) + '</td>' + (EDH ? '<td class="num syn' + (c.syn == null ? ' dimc' : '') + '">' + synTxt(c.syn) + '</td>' : '') + '<td>' + tierB(c.tier, true) + '</td><td>' + relB(c.rel) + '</td></tr>';
  }
  var tot = [], tp = 0, tn = 0, i;
  for (i = 0; i < NG; i++) tot.push(0);
  cs.forEach(function (c) { for (var i = 0; i < NG; i++) tot[i] += gv(c, i) * c.q; tp += pts(c) * c.q; tn += c.q; });
  var h = '<tr class="tot"><td class="c-name">' + (cs.length === deck().length ? 'Total do deck' : 'Total do filtro') + '</td><td class="num hm">' + tn + '</td><td class="hm"></td><td></td>' +
    tot.map(function (v) { return '<td class="num">' + v + '</td>'; }).join('') + '<td class="num">' + tp + '</td>' + (EDH ? '<td></td>' : '') + '<td></td><td></td></tr>';
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
  h += '<div class="tw" id="tw"><table class="tbl" style="min-width:' + (594 + 52 * NG) + 'px"><thead><tr>' +
    th('n', 'Carta', 'c-name') + th('q', 'Qtd', 'hm') + '<th scope="col" class="hm">Custo</th>' + th('cmc', 'CMC') +
    G.map(function (g, i) { return th('g' + i, esc(g.ab), 'gh', g.k + ': ' + g.d, '--c:var(--g' + i + ')'); }).join('') +
    th('pts', 'Pts') + (EDH ? th('syn', 'Wiki', '', 'Sinergia no ' + EDH.fonte + (EDH.pagina ? ' para ' + EDH.pagina : '') + ': presença na comunidade, não força') : '') +
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
    '<p class="pn-note">Ordem: relevância mais baixa, depois a prioridade sugerida, o tier e a pontuação. PetCards e o comandante nunca entram na fila; terrenos são avaliados à parte.</p></fieldset>' +
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
  return '<article class="cand' + (c.inDeck ? ' in' : '') + '" id="cand-' + id + '"><div class="cand-top' + (imgOn() ? ' wi' : '') + '">' +
    (imgOn() ? '<div class="cand-img c-' + esc(c.col) + '" data-card="' + id + '" role="button" tabindex="0" aria-label="Abrir ' + esc(c.n) + '">' + fbTile(c) + imgTag(c, 'small', false) + '</div>' : '') +
    '<div class="cand-txt"><div class="cand-h">' + tierB(c.tier) + '<div><h3><button class="linkish" data-card="' + id + '">' + esc(c.n) + '</button></h3><p class="cand-m">' + (c.cost ? mana(c.cost) + ' ' : '') + esc(c.line) + (c.pt ? ', ' + esc(c.pt) : '') + '</p></div>' +
    '<span class="vd vd-' + esc(c.verdict) + '">' + VERD[c.verdict] + '</span></div>' +
    (c.fx ? '<p class="cand-fx' + (c.orig ? ' orig' : '') + '">' + rich(c.fx) + '</p>' : '') + (c.why ? '<p class="cand-why">' + rich(c.why) + '</p>' : '') + '</div></div>' +
    '<div class="gtags">' + gtags(c) + '<span class="gt" style="--c:var(--gold-rgb)">' + pts(c) + ' pts</span>' +
    (c.syn != null && EDH ? '<span class="gt" style="--c:160,170,182" title="Sinergia no ' + esc(EDH.fonte) + '">' + esc(EDH.fonte) + ' ' + synTxt(c.syn) + '</span>' : '') + (c.tem ? '<span class="gt" style="--c:95,191,167">tenho a carta</span>' : '') + '</div>' +
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
  var h = '<p class="hint">Cartas fora do deck que valem acompanhar. Ao colocar uma no deck você escolhe quem sai, e todos os gráficos passam a refletir a troca. Quem você deixa de fora desce para a lista abaixo, com a nota e o motivo guardados. A pergunta de sempre: a carta é boa, ou é boa no ' + esc(M.curto || 'comandante') + '?</p>';
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
  var link = c.set ? 'https://scryfall.com/card/' + enc(c.set.toLowerCase()) + '/' + enc(c.num) : 'https://scryfall.com/search?q=' + enc('!"' + c.n + '"');
  var liga = 'https://www.ligamagic.com.br/?view=cards/card&card=' + enc(c.n);
  var back = !!(ui.face && c.dfc && c.back);
  var where = c.cand ? (c.inDeck ? 'No deck, vinda do radar' : 'No radar, fora do deck') : (c.inDeck ? '' : 'Fora do deck');
  var h = '<button class="x" data-act="close" aria-label="Fechar">×</button>' +
    '<p class="dw-type">' + esc(c.line) + '</p><h2 id="dw-title">' + esc(c.n) + '</h2>' +
    '<div class="dw-meta">' + (c.cost ? mana(c.cost) : '') + (c.land ? '' : '<span>CMC ' + c.cmc + '</span>') + (c.pt ? '<span>' + (c.ptl ? c.ptl + ' ' : '') + esc(c.pt) + '</span>' : '') +
    (c.set ? '<span>' + esc(c.set) + ' ' + esc(c.num) + '</span>' : '') + (c.q > 1 ? '<span>' + c.q + ' cópias</span>' : '') + (c.foil ? '<span><span class="foil">✦</span> foil</span>' : '') + (where ? '<span>' + where + '</span>' : '') + '</div>';
  if (imgOn()) {
    h += '<div class="dw-art"><div class="dw-card c-' + esc(c.col) + '">' + fbTile(c, back, true) + imgTag(c, 'normal', back) + '</div>' +
      (c.dfc && c.back ? '<p><button class="linkish" data-act="face" data-fid="face">' + (back ? 'Ver a frente' : 'Ver a outra face, ' + esc(c.back.n)) + '</button></p>' : '') +
      (c.ar || c.usd ? '<p class="dw-cred">' + (c.ar ? 'Arte de ' + esc(c.ar) + '. ' : '') + (c.usd ? 'No Scryfall: US$ ' + fmt(+c.usd) + (c.foil && c.usdf ? ', foil US$ ' + fmt(+c.usdf) : '') + (M.scryfall ? ', em ' + fdate(M.scryfall) : '') + '.' : '') + '</p>' : '') +
      '<p class="dw-cred" data-imgnote>' + (imgFailN && !imgOk ? imgNoteHtml() : '') + '</p></div>';
  }
  h += (c.fx ? '<p class="dw-fx' + (c.orig ? ' orig' : '') + '">' + rich(c.fx) + '</p>' : '') + (c.why ? '<p class="dw-why">' + rich(c.why) + '</p>' : '') +
    (c.back ? '<p class="dw-back">Outra face: ' + esc(c.back.n) + ', ' + esc(c.back.line.toLowerCase()) + '.</p>' : '');
  if (EDH && !c.custom && !c.cmd) h += '<p class="dw-syn">' + synB(c.syn) + (c.syn != null ? 'de sinergia' + (EDH.pagina ? ' nos decks de ' + esc(EDH.pagina) : '') + ', segundo o ' + esc(EDH.fonte) + '. Mede presença, não força.' : 'Não aparece na página' + (EDH.pagina ? ' de ' + esc(EDH.pagina) : '') + ' no ' + esc(EDH.fonte) + '.') + '</p>';
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
  h += '<div class="dw-row"><label class="tog"><input type="checkbox" data-act="pet" data-fid="pet"' + (c.pet ? ' checked' : '') + '> <span class="pet">♥</span> PetCard: soma 1 ponto' + (IPET >= 0 ? ' em ' + esc(G[IPET].sh || G[IPET].k) : '') + ' e fica fora da fila de corte</label></div>' +
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
    return c.q + ' ' + c.n + (c.set ? ' (' + c.set + ') ' + c.num : '') + (c.foil ? ' *F*' : '') + (c.cmd ? ' *CMDR*' : '');
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
var RENDER = { geral: renderGeral, gal: renderGal, tier: renderTier, tab: renderTab, ctrl: renderCtrl, radar: renderRadar, ofi: renderOfi };
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
  if ((ev.key === 'Enter' || ev.key === ' ') && t.matches && t.matches('.chip,.petal,.wedge,tr.row,.gtile,.cand-img')) { ev.preventDefault(); t.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
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
