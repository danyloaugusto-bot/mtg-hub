
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
function fresh() { return { v: 1, ov: {}, custom: [], inn: {}, out: {}, swaps: [], img: true }; }
function normalize(s) {
  var f = fresh();
  if (!s || typeof s !== 'object') return f;
  ['ov', 'inn', 'out'].forEach(function (k) { if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) f[k] = s[k]; });
  if (Array.isArray(s.custom)) f.custom = s.custom.filter(function (c) { return c && c.id && c.n && Array.isArray(c.s); });
  if (Array.isArray(s.swaps)) f.swaps = s.swaps;
  f.img = s.img !== false;   /* a v1 guardava "art" (arte só na gaveta, desligada); na v2 as imagens nascem ligadas */
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
           tierType: '', tierLands: false, ctrlLands: false, drawer: null, modal: false, first: true, confirmReset: false, tierView: '', flip: false, booted: false, poolAll: false };

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
/* potenciais: cartas da leitura do edh.wiki que ainda não estão no deck nem no radar */
function poolById(id) { var p = D.pool || []; for (var i = 0; i < p.length; i++) if (p[i].id === id) return p[i]; return null; }
function poolOpen() {
  var have = {}; D.cards.concat(cands()).forEach(function (c) { have[c.id] = 1; });
  return (D.pool || []).filter(function (p) { return !have[p.id]; });
}
function E(c) {
  var o = S.ov[c.id] || {};
  var e = {}; for (var k in c) e[k] = c[k];
  e.s = (o.s || c.s).slice(); e.tier = o.tier || c.tier; e.rel = o.rel || c.rel;
  if (c.cand) e.verdict = o.verdict || c.verdict;
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
             wipes: 0, uni: 0, spot: 0, spot1: 0, gain: 0, pay: 0, aonly: 0, atk: 0, alt: [], foils: 0, sets: {}, low: 0, top: 0, dual: [] };
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
    /* pontual: remoção dedicada que não é global, ou global que também responde a um alvo (marca spot) */
    if (gv(c, 2) >= 2 && (!c.wipe || c.spot)) { st.spot += q; if (!c.land && c.cmc <= 1) st.spot1 += q; if (c.wipe) st.dual.push(c); }
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

/* ============ imagens das cartas ============ */
/* Duas fontes. PACK: imagens embutidas no arquivo, quando o kit monta a versão com imagens (scripts/baixar_imagens.py).
   Sem PACK, o Scryfall: a página pede as cartas em lote (uma chamada a cada 75), guarda só o identificador de cada imagem
   e carrega as figuras direto do servidor de imagens. Se o lote não passar, pede imagem por imagem, com intervalo. */
var API = 'https://api.scryfall.com/', CDN = 'https://cards.scryfall.io/';
var IKEY = KEY + ':img';
var IM = { st: 'idle', map: {}, q: [], t: null, miss: {}, csp: false };
/* Página publicada e prévia de chat não carregam nada de outros sites. Na montagem para publicar (PUB) o painel nem tenta;
   nos demais casos, o navegador avisa por este evento quando a política do ambiente barra o pedido. */
function isPub() { return typeof PUB !== 'undefined' && !!PUB; }
document.addEventListener('securitypolicyviolation', function (ev) { if (String(ev.blockedURI || '').indexOf('scryfall') >= 0) IM.csp = true; });
var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function hasPack() { return typeof PACK === 'object' && !!PACK; }
function imgOn() { return S.img !== false; }
function imgMaybe() { return imgOn() && IM.st !== 'falhou' && IM.st !== 'barrado'; }
function imgReady() { return IM.st === 'ok' || IM.st === 'lento' || IM.st === 'pacote'; }
function pkey(c) { return (c.set || '') + '|' + (c.num || ''); }
function imRead() {
  IM.map = {};
  if (!canStore) return;
  try {
    var r = JSON.parse(store.getItem(IKEY) || 'null');
    if (r && r.v === 1 && r.m) for (var id in r.m) {
      var e = r.m[id];
      if (Array.isArray(e) && UUID.test(e[0])) IM.map[id] = { u: e[0], b: e[1] ? 1 : 0, a: String(e[2] || ''), k: String(e[3] || '') };
    }
  } catch (e) { IM.map = {}; }
}
function imWrite() {
  if (!canStore) return;
  var m = {}; for (var id in IM.map) { var e = IM.map[id]; m[id] = [e.u, e.b, e.a, e.k]; }
  try { store.setItem(IKEY, JSON.stringify({ v: 1, m: m })); } catch (e) { /* sem espaço ou bloqueado: segue em memória */ }
}
function imEntry(c) { var e = IM.map[c.id]; return e && e.k === pkey(c) ? e : null; }
function apiImg(c, size) {
  return (c.set ? API + 'cards/' + encodeURIComponent(c.set.toLowerCase()) + '/' + encodeURIComponent(c.num) + '?' : API + 'cards/named?exact=' + encodeURIComponent(c.n) + '&') + 'format=image&version=' + size;
}
function imUrl(c, size, back) {
  if (IM.st === 'pacote') return PACK[c.id + (back ? '|b' : '')] || '';
  var e = imEntry(c);
  if (e) return back && !e.b ? '' : CDN + size + '/' + (back ? 'back' : 'front') + '/' + e.u.charAt(0) + '/' + e.u.charAt(1) + '/' + e.u + '.jpg';
  return IM.st === 'lento' && !back ? apiImg(c, size) : '';
}
function imBack(c) { if (IM.st === 'pacote') return !!PACK[c.id + '|b']; var e = imEntry(c); return !!(e && e.b); }
function imArtist(c) { if (IM.st === 'pacote') return (typeof CRED === 'object' && CRED && CRED[c.id]) || ''; var e = imEntry(c); return e ? e.a : ''; }
function imPost(ids) {
  return fetch(API + 'cards/collection', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ identifiers: ids }) })
    .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); });
}
function imTake(k, c) {
  var faces = k.card_faces || [], u = String(k.id || ''), front = k.image_uris || (faces[0] && faces[0].image_uris);
  if (!front || !UUID.test(u)) return false;
  IM.map[c.id] = { u: u, b: (!k.image_uris && faces[1] && faces[1].image_uris) ? 1 : 0, a: String(k.artist || (faces[0] && faces[0].artist) || ''), k: pkey(c) };
  return true;
}
/* pede as cartas da lista em lotes de 75 e devolve as que o Scryfall não achou */
function imBatch(list, byName) {
  var chunks = [], miss = [], p = Promise.resolve();
  for (var i = 0; i < list.length; i += 75) chunks.push(list.slice(i, i + 75));
  chunks.forEach(function (ch, n) {
    p = p.then(function () { return n ? new Promise(function (ok) { setTimeout(ok, 160); }) : null; }).then(function () {
      return imPost(ch.map(function (c) { return (c.set && !byName) ? { set: c.set.toLowerCase(), collector_number: String(c.num) } : { name: c.n }; }));
    }).then(function (res) {
      var bySet = {}, byN = {};
      (res && res.data || []).forEach(function (k) {
        bySet[(k.set + '|' + k.collector_number).toLowerCase()] = k;
        var nm = String(k.name || '').toLowerCase(); byN[nm] = k; byN[nm.split(' // ')[0]] = k;
      });
      ch.forEach(function (c) {
        var k = (c.set && !byName) ? bySet[(c.set + '|' + c.num).toLowerCase()] : byN[c.n.toLowerCase()];
        if (!k || !imTake(k, c)) miss.push(c);
      });
    });
  });
  return p.then(function () { return miss; });
}
function imStart() {
  if (!imgOn()) { IM.st = 'off'; imNote(); return; }
  if (hasPack()) { IM.st = 'pacote'; imChanged(); return; }
  if (isPub()) { IM.st = 'barrado'; imChanged(); return; }
  if (IM.st === 'busy') return;
  imRead();
  var need = D.cards.concat(cands(), poolOpen()).filter(function (c) { return !imEntry(c) && !IM.miss[c.id]; });
  if (!need.length) { IM.st = 'ok'; imChanged(); return; }
  if (typeof fetch !== 'function' || navigator.onLine === false) { IM.st = 'falhou'; imChanged(); return; }
  IM.st = 'busy'; imNote();
  imBatch(need, false).then(function (miss) {
    /* impressão que o Scryfall não reconheceu pela edição e número: tenta pelo nome */
    var again = miss.filter(function (c) { return c.set; });
    miss.forEach(function (c) { if (!c.set) IM.miss[c.id] = 1; });
    return again.length ? imBatch(again, true) : [];
  }).then(function (miss) { (miss || []).forEach(function (c) { IM.miss[c.id] = 1; }); IM.st = 'ok'; imWrite(); imChanged(); }, function () {
    /* o lote não passou. Se foi a política do ambiente que barrou, insistir não adianta; senão, testa uma imagem antes de desistir */
    setTimeout(function () {
      if (IM.csp) { IM.st = 'barrado'; imChanged(); return; }
      var t = new Image();
      t.onload = function () { IM.st = 'lento'; imChanged(); };
      t.onerror = function () { setTimeout(function () { IM.st = IM.csp ? 'barrado' : 'falhou'; imChanged(); }, 60); };
      t.src = apiImg({ n: D.cards[0].n }, 'small');
    }, 60);
  });
}
function imNote() {
  var el = $('#imgNote'); if (!el) return;
  function b(a, t) { return ' <button class="linkish" data-act="' + a + '">' + t + '</button>'; }
  el.innerHTML = !imgOn() ? 'Imagens das cartas desligadas.' + b('img', 'Ligar') :
    IM.st === 'pacote' ? 'Imagens das cartas embutidas no arquivo.' + b('img', 'Desligar') :
    IM.st === 'ok' ? 'Imagens das cartas: Scryfall, pela internet.' + b('img', 'Desligar') :
    IM.st === 'lento' ? 'Imagens das cartas: Scryfall, uma a uma, porque o pedido em lote não passou.' + b('img', 'Desligar') :
    IM.st === 'barrado' ? (isPub() ? 'Imagens das cartas: fora desta versão publicada, que não carrega imagens de outros sites. Elas aparecem no arquivo aberto no navegador e na versão com imagens embutidas.' :
      'Imagens das cartas: barradas aqui, porque este ambiente não carrega imagens de outros sites. Baixe o arquivo e abra no navegador.') :
    IM.st === 'falhou' ? 'Imagens das cartas fora do ar: sem internet, ou este ambiente bloqueia imagens externas. O resto do painel funciona igual.' + b('img-retry', 'Tentar de novo') :
    'Buscando as imagens das cartas no Scryfall.';
}
function imChanged() {
  imNote();
  if (!ui.booted) return;
  if (ui.tab !== 'geral') render(); else { renderDrawer(); hydrate(); }
}
/* preenche as molduras .ci com a imagem; fora da gaveta, só quando a moldura chega perto da tela */
var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fill(e.target); } });
}, { rootMargin: '320px 0px' }) : null;
function fill(el) {
  if (el.querySelector('img')) return;
  var c = byId(el.dataset.ci) || poolById(el.dataset.ci); if (!c) return;
  var big = el.dataset.big === '1', back = el.dataset.back === '1', src = imUrl(c, big ? 'normal' : 'small', back);
  if (!src) return;
  var im = document.createElement('img');
  im.alt = big ? 'Carta ' + c.n : ''; im.decoding = 'async'; im.draggable = false;
  if (!big && IM.st === 'ok') { im.srcset = src + ' 146w, ' + imUrl(c, 'normal', back) + ' 488w'; im.sizes = '120px'; }
  im.onload = function () { el.classList.add('ok'); };
  im.onerror = function () {
    if (IM.st === 'lento' && c.set && !back && im.getAttribute('data-r') !== '1') { im.setAttribute('data-r', '1'); im.src = apiImg({ n: c.n }, big ? 'normal' : 'small'); return; }
    if (im.parentNode) im.parentNode.removeChild(im);
  };
  el.appendChild(im);
  if (IM.st === 'lento') {
    if (big) IM.q.unshift([im, src]); else IM.q.push([im, src]);          /* a carta aberta na gaveta passa na frente */
    if (!IM.t) IM.t = setInterval(function () {
      var j = IM.q.shift();
      while (j && !j[0].isConnected) j = IM.q.shift();                    /* pula imagens de telas que já saíram */
      if (!j) { clearInterval(IM.t); IM.t = null; return; }
      j[0].src = j[1];
    }, 130);
  } else im.src = src;
}
function hydrate() {
  if (io) io.disconnect();
  if (!imgOn() || !imgReady()) return;
  var els = document.querySelectorAll('.ci[data-ci]');
  for (var i = 0; i < els.length; i++) {
    if (els[i].querySelector('img')) continue;
    if (io && els[i].dataset.big !== '1') io.observe(els[i]); else fill(els[i]);
  }
}
/* espiada: a carta em tamanho de leitura ao lado do ponteiro, só em tela com mouse */
var PK = { el: null, im: null, id: null, t: null, x: 0, y: 0 };
var canHover = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
function peekPos() {
  var W = 250, H = 349, x = PK.x + 22, y = PK.y - H / 2;
  if (x + W > window.innerWidth - 8) x = PK.x - W - 22;
  if (x < 8) x = 8;
  y = Math.max(8, Math.min(y, window.innerHeight - H - 8));
  PK.el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
}
function peekHide() { clearTimeout(PK.t); PK.id = null; if (PK.el) PK.el.hidden = true; }
function peekShow(id) {
  var c = byId(id) || poolById(id), src = c ? imUrl(c, 'normal') : '';
  if (!src || PK.id !== id) return;
  if (!PK.el) {
    PK.el = document.createElement('div'); PK.el.className = 'peek'; PK.el.hidden = true; PK.el.setAttribute('aria-hidden', 'true');
    PK.im = document.createElement('img'); PK.im.alt = ''; PK.el.appendChild(PK.im); document.body.appendChild(PK.el);
    PK.im.onload = function () { if (PK.id) { PK.el.hidden = false; peekPos(); } };
    PK.im.onerror = function () { PK.el.hidden = true; };
  }
  PK.el.hidden = true;
  if (PK.im.getAttribute('src') === src && PK.im.complete && PK.im.naturalWidth) { PK.el.hidden = false; peekPos(); } else PK.im.src = src;
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
function slot(c, cls, big, back) {
  return '<span class="ci' + (cls ? ' ' + cls : '') + '" data-ci="' + esc(c.id) + '"' + (big ? ' data-big="1"' : '') + (back ? ' data-back="1"' : '') + '><span class="ci-n">' + esc(c.n) + '</span></span>';
}
function tile(c) {
  return '<div class="chip tile c-' + esc(c.col) + '" role="button" tabindex="0" draggable="true" data-card="' + esc(c.id) + '" title="' + esc(c.n + ' — ' + c.line) + '">' +
    '<span class="tile-i">' + slot(c) + '<span class="tile-b">' + (c.q > 1 ? '<span class="tile-q">×' + c.q + '</span>' : '') +
    (c.foil ? '<span class="foil" title="Foil">✦</span>' : '') + (c.pet ? '<span class="pet" title="PetCard">♥</span>' : '') +
    (c.edited ? '<span class="edt" title="Avaliação alterada por você"></span>' : '') + '<span class="p">' + pts(c) + '</span></span></span>' +
    '<span class="tile-n">' + esc(c.n) + '</span></div>';
}
/* sinergia no edh.wiki: sinal externo, fora do placar */
var BANDS = [
  { k: 's-hi', n: '+40% ou mais', c: '#e2be70' }, { k: 's-md', n: '+10% a +39%', c: '#7fb0ff' }, { k: 's-lo', n: '+1% a +9%', c: '#6f7aa6' },
  { k: 's-neg', n: 'zero ou negativa', c: '#f07a8c' }, { k: 's-na', n: 'fora da página', c: '#39437a' }
];
function synCls(v) { return v == null ? 's-na' : v >= 40 ? 's-hi' : v >= 10 ? 's-md' : v > 0 ? 's-lo' : 's-neg'; }
function synTxt(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '%'; }
function synB(v) { return '<span class="syn ' + synCls(v) + '">' + (v == null ? 'fora da página' : synTxt(v)) + '</span>'; }
function edhPanel(cs) {
  var e = D.meta.edh; if (!e) return '';
  var inDeck = {}, radar = {}, n = {}, tot = 0;
  cs.forEach(function (c) { inDeck[c.id] = c; });
  cands().forEach(function (c) { radar[c.id] = c; });
  cs.forEach(function (c) { if (c.cmd || c.land || c.custom) return; var k = synCls(c.syn); n[k] = (n[k] || 0) + c.q; tot += c.q; });
  function nomes(a) {
    return lista(a.map(function (nm) { var id = slug(nm); return (inDeck[id] || radar[id]) ? '<button class="linkish" data-card="' + esc(id) + '">' + esc(nm) + '</button>' : esc(nm); }));
  }
  var rows = e.listas.map(function (l) {
    var ok = [], miss = [];
    l.cards.forEach(function (nm) { (inDeck[slug(nm)] ? ok : miss).push(nm); });
    var noRadar = miss.filter(function (nm) { return radar[slug(nm)]; }).length === miss.length;
    var t = l.k === 'gc' ? (ok.length ? 'No deck: ' + nomes(ok) + '. Se a mesa joga por brackets, confira a contagem na lista oficial.' : 'Nenhuma no deck.') :
      (miss.length ? (miss.length === 1 ? 'Falta ' : 'Faltam ') + nomes(miss) + (noRadar ? (miss.length === 1 ? ', que já está no radar.' : ', que já estão no radar.') : '.') : 'Todas no deck.');
    return '<li><b class="num">' + ok.length + ' de ' + l.cards.length + '</b><span><em>' + esc(l.n) + '.</em> ' + t + '</span></li>';
  }).join('');
  var on = BANDS.filter(function (b) { return n[b.k]; });
  return '<fieldset class="pn"><legend>Sinal da comunidade</legend><ul class="edh-l">' + rows + '</ul>' +
    '<h3 class="sub">Sinergia das ' + tot + ' cartas que não são terreno</h3><div class="stack">' +
    on.map(function (b) { return '<i style="flex:' + n[b.k] + ';background:' + b.c + '" title="' + b.n + ': ' + n[b.k] + '"></i>'; }).join('') + '</div><div class="legend">' +
    on.map(function (b) { return '<span><i style="background:' + b.c + '"></i>' + b.n + ' ' + n[b.k] + '</span>'; }).join('') + '</div>' +
    '<p class="pn-note">Página de Anjos da Giada no ' + esc(e.fonte) + ', lida em ' + esc(e.lido) + '. Sinergia é o quanto a carta aparece nesses decks acima do uso normal dela na cor: mede o que é típico da Giada, não o que é forte, e não entra no placar. Temas mais comuns por lá: ' +
    lista(e.temas.map(function (t) { return esc(t[0]) + ' ' + t[1] + '%'; })) + '.</p>' +
    '<p class="pn-note"><button class="linkish" data-act="go" data-v="ctrl">Ver onde você e a comunidade divergem</button> &nbsp; <a href="' + esc(e.url) + '" target="_blank" rel="noopener noreferrer">Abrir a página</a></p></fieldset>';
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

  add(st.spot < 4 || st.wipes > 5 || !st.spot1 ? 'warn' : 'ok', pl(rm, 'remoção', 'remoções') + ', sendo ' + st.wipes + ' em massa.',
    'Referência: 8 a 12, com 3 a 5 globais. ' + (st.spot === 1 ? '1 responde a um alvo' : st.spot + ' respondem a um alvo') +
    (st.dual.length ? ', contando ' + lista(st.dual.map(function (c) { return esc(c.n); })) + ', que ' + (st.dual.length === 1 ? 'faz' : 'fazem') + ' os dois papéis' : '') +
    (st.spot1 ? '.' : (st.dual.length ? ', e' : ', mas') + ' nenhuma custa 1 mana.') +
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
    '<p class="hero-lede">Tribal de Anjos em mono-branco, movido a marcadores e ganho de vida. O plano cabe em três verbos: descer, crescer, proteger.</p>' +
    '<dl class="facts"><div><dt>cartas</dt><dd>' + st.n + '</dd></div><div><dt>CMC médio</dt><dd>' + fmt(st.avg) + '</dd></div>' +
    '<div><dt>Anjos</dt><dd>' + st.angel + '</dd></div><div><dt>fontes de terreno</dt><dd>' + (st.lands + st.mdfc) + '</dd></div>' +
    '<div><dt>foils</dt><dd>' + st.foils + '</dd></div></dl></div>' +
    (cmd ? '<figure class="cmd"><div class="cmd-f"><button class="cmd-art" data-card="' + esc(cmd.id) + '" aria-label="Abrir a carta ' + esc(cmd.n) + '">' +
      (typeof ART === 'string' && ART ? '<img src="' + ART + '" width="626" height="443" alt="Giada de vestido escuro e espada na mão, de asas abertas em rosa, azul e dourado contra o céu">' : '') +
      '<span class="cmd-plate"><b>' + esc(D.meta.cmd) + '</b>' + mana(cmd.cost) + '<small>' + esc(cmd.line) + (cmd.pt ? ', ' + esc(cmd.pt) : '') + '</small></span></button></div>' +
      '<figcaption>' + rich(cmd.fx) + '</figcaption></figure>' : '') + '</div>';
  var fAsas = '<fieldset class="pn"><legend>As oito penas</legend><figure class="asas">' + wings(st) +
    '<figcaption>Cada pena é um agrupamento e sua área é a soma das notas. Toque numa pena para abrir no tabelão.</figcaption></figure></fieldset>';

  var fCurva = '<fieldset class="pn curve"><legend>Curva de mana</legend><div class="pn-tools"><div class="seg" role="group" aria-label="Dividir os tubos">' +
    '<button data-act="curve" data-v="tipo" data-fid="cv1" aria-pressed="' + (ui.curve === 'tipo') + '">Por tipo</button>' +
    '<button data-act="curve" data-v="anjo" data-fid="cv2" aria-pressed="' + (ui.curve === 'anjo') + '">Anjos e o resto</button></div></div>' +
    curveSvg(st, ui.curve) +
    '<div class="legend">' + ckeys.map(function (k) {
      return '<span><i style="background:' + k.c + '"></i>' + k.n + ' ' + (ui.curve === 'anjo' ? st.ak[k.k] : st.types[k.k]) + '</span>';
    }).join('') + '</div></fieldset>';
  var fPlacar = '<fieldset class="pn"><legend>Placar do deck</legend><div class="score-big"><b>' + st.total + '</b><span>pontos</span></div>' +
    '<table class="kv"><tr><th scope="row">CMC médio</th><td class="num">' + fmt(st.avg) + '</td><td class="num"><b>' + st.cmcPts + '</b> pts</td></tr>' +
    '<tr><th scope="row">Potencial de aceleração</th><td class="num">' + fmt(st.accX) + '</td><td class="num"><b>' + st.accPts + '</b> pts</td></tr>' +
    '<tr><th scope="row">Soma das notas</th><td></td><td class="num"><b>' + st.crit + '</b> pts</td></tr></table>' +
    '<h3 class="sub">Tiers das ' + st.n + ' cartas</h3><div class="stack">' + TIERS.filter(function (t) { return st.tier[t.k]; }).map(function (t) {
      return '<i class="t' + t.k + '" style="flex:' + st.tier[t.k] + '" title="Tier ' + t.k + ': ' + st.tier[t.k] + '"></i>'; }).join('') + '</div>' +
    '<div class="legend">' + TIERS.map(function (t) { return '<span>' + tierB(t.k, true) + ' ' + (st.tier[t.k] || 0) + '</span>'; }).join('') +
    '<button class="linkish" data-act="go" data-v="tier">Abrir a tier list</button></div>' +
    '<details class="how"><summary>Como a conta é feita</summary><p>É a mesma lógica da sua planilha do Vito. O CMC médio vale de 1 a 5 pontos, e quanto mais baixo, melhor. O potencial de aceleração é a soma da coluna Ramp dividida pelo CMC médio, e cada 0,5 vale 5 pontos, até 90. O restante é a soma das notas de 0 a 3 que cada carta recebe nos oito agrupamentos. Como os agrupamentos mudam de um deck para outro, o total serve para acompanhar este deck ao longo das trocas, não para compará-lo com outro.</p></details>' +
    '</fieldset>';
  var fEdh = edhPanel(cs);
  h += fEdh ? '<div class="grid g-21">' + fAsas + fPlacar + '</div><div class="grid g-21">' + fCurva + fEdh + '</div>' :
    fAsas + '<div class="grid g-21">' + fCurva + fPlacar + '</div>';

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
  var gal = imgMaybe() && ui.tierView !== 'fichas';
  var h = '<div class="tools"><div class="pills" role="group" aria-label="Filtrar por tipo">' +
    '<button class="pill" data-act="tier-type" data-v="" data-fid="tt" aria-pressed="' + (!ui.tierType) + '">Todas</button>' +
    TG.filter(function (t) { return t.k !== 'cmd' && (usados[t.k] || ui.tierType === t.k); }).map(function (t) {
      return '<button class="pill" data-act="tier-type" data-v="' + t.k + '" data-fid="tt' + t.k + '" aria-pressed="' + (ui.tierType === t.k) + '">' + t.n + '</button>';
    }).join('') + '</div><span class="sp"></span>' +
    (imgMaybe() ? '<div class="seg" role="group" aria-label="Como mostrar as cartas"><button data-act="tier-view" data-v="cartas" data-fid="tv1" aria-pressed="' + gal + '">Cartas</button>' +
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
  if (k === 'tier') return TR[c.tier];
  if (k === 'rel') return RR[c.rel];
  if (k === 'syn') return c.syn == null ? -999 : c.syn;
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
  var edh = !!D.meta.edh, ncol = edh ? 16 : 15;
  function row(c) {
    var cells = '';
    for (var i = 0; i < 8; i++) cells += scCell(gv(c, i), i);
    return '<tr class="row" data-card="' + esc(c.id) + '" tabindex="0"><td class="c-name"><div class="nm c-' + esc(c.col) + '"><span class="t">' + esc(c.n) + '</span>' +
      (c.foil ? '<span class="foil" title="Foil">✦</span>' : '') + (c.pet ? '<span class="pet" title="PetCard">♥</span>' : '') + (c.edited ? '<span class="edt" title="Avaliação alterada por você"></span>' : '') +
      '</div></td><td class="dimc num">' + c.q + '</td><td>' + (c.cost ? mana(c.cost) : '<span class="dimc">—</span>') + '</td><td class="num">' + (c.land ? '<span class="dimc">—</span>' : c.cmc) + '</td>' + cells +
      '<td class="pts num">' + pts(c) + '</td><td>' + tierB(c.tier, true) + '</td><td>' + relB(c.rel) + '</td>' +
      (edh ? '<td>' + (c.syn == null ? '<span class="dimc">·</span>' : synB(c.syn)) + '</td>' : '') + '</tr>';
  }
  var tot = [0, 0, 0, 0, 0, 0, 0, 0], tp = 0, tn = 0;
  cs.forEach(function (c) { for (var i = 0; i < 8; i++) tot[i] += gv(c, i) * c.q; tp += pts(c) * c.q; tn += c.q; });
  var h = '<tr class="tot"><td class="c-name">' + (cs.length === deck().length ? 'Total do deck' : 'Total do filtro') + '</td><td class="num">' + tn + '</td><td></td><td></td>' +
    tot.map(function (v) { return '<td class="num">' + v + '</td>'; }).join('') + '<td class="num">' + tp + '</td><td></td><td></td>' + (edh ? '<td></td>' : '') + '</tr>';
  if (!cs.length) return h + '<tr><td class="c-name" colspan="' + ncol + '" style="position:static;padding:22px 14px;color:var(--mute);max-width:none">Nenhuma carta com esses filtros. Limpe a busca ou escolha outro agrupamento.</td></tr>';
  if (ui.grouped) {
    TG.forEach(function (g) {
      var list = cs.filter(function (c) { return c.g === g.k; }).sort(sorter);
      if (!list.length) return;
      var n = 0, p = 0; list.forEach(function (c) { n += c.q; p += pts(c) * c.q; });
      h += '<tr class="grp"><td colspan="' + ncol + '"><div class="grp-in">' + g.n + ' (' + n + ')<span>' + p + ' pts</span></div></td></tr>' + list.map(row).join('');
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
    th('pts', 'Pts') + th('tier', 'Tier') + th('rel', 'Relev.') +
    (D.meta.edh ? th('syn', 'EDH', '', 'Sinergia no edh.wiki: quanto a carta aparece nos decks de Anjos da Giada acima do uso normal dela na cor. Não entra nos pontos.') : '') + '</tr></thead><tbody id="tbody">' + tabRows() + '</tbody></table></div>';
  h += '<p class="hint">Notas de 0 a 3 em cada agrupamento: 1 é efeito de passagem, 2 é função da carta, 3 é referência do deck. Uma carta pode pontuar em vários. Toque na linha para ver o motivo e editar.' +
    (D.meta.edh ? ' A coluna EDH é a sinergia da carta no edh.wiki: sinal de fora, que não entra nos pontos.' : '') + '</p>';
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
  if (D.meta.edh) {
    var quente = all.filter(function (c) { return !c.cmd && !c.custom && c.rel === 'BAX' && c.syn != null && c.syn >= 20; }).sort(function (a, b) { return b.syn - a.syn; });
    var frio = all.filter(function (c) { return !c.cmd && !c.custom && !c.cand && TR[c.tier] <= 1 && (c.syn == null || c.syn <= 0); }).sort(function (a, b) { return (TR[a.tier] - TR[b.tier]) || a.n.localeCompare(b.n); });
    var dl = function (list, vazio) {
      return list.length ? '<ul class="dv">' + list.map(function (c) { return '<li>' + chip(c, { tier: true }) + synB(c.syn) + relB(c.rel) + '</li>'; }).join('') + '</ul>' : '<p class="hint">' + vazio + '</p>';
    };
    h += '<fieldset class="pn"><legend>Você e a comunidade</legend><div class="div2">' +
      '<div><h3 class="sub">Na berlinda aqui, assinatura da Giada lá</h3>' + dl(quente, 'Nenhuma carta da berlinda tem sinergia alta na comunidade.') + '</div>' +
      '<div><h3 class="sub">Titular aqui, fora do radar de lá</h3>' + dl(frio, 'Todas as suas titulares aparecem na página com sinergia positiva.') + '</div></div>' +
      '<p class="pn-note">Segunda opinião, não veredito. A sinergia do ' + esc(D.meta.edh.fonte) + ', lida em ' + esc(D.meta.edh.lido) + ', mede o que é típico dos decks de Anjos da Giada: staples genéricas e cartas recentes ficam baixas ou de fora. Vale olhar antes de cortar uma carta da esquerda ou de blindar uma da direita.</p></fieldset>';
  }
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
  var todas = cands().map(E).sort(function (a, b) { return (vo[a.verdict] - vo[b.verdict]) || (TR[a.tier] - TR[b.tier]) || (pts(b) - pts(a)); });
  var cs = todas.filter(function (c) { return c.inDeck || c.verdict !== 'fora'; });
  var fora = todas.filter(function (c) { return !c.inDeck && c.verdict === 'fora'; });
  var h = '<p class="hint">Cartas fora do deck que valem acompanhar, das coleções novas e das antigas. Ao colocar uma no deck você escolhe quem sai, e todos os gráficos passam a refletir a troca. A etiqueta azul traz a sinergia da carta no edh.wiki, quando ela aparece por lá. Quem você deixa de fora desce para a lista abaixo, com a nota e o motivo guardados.</p>';
  h += '<div class="cands">' + cs.map(function (c) {
    var tags = '';
    for (var i = 0; i < 8; i++) if (gv(c, i) > 0) tags += '<span class="gt" style="--c:var(--g' + i + ')">' + esc(G[i].sh || G[i].k) + ' ' + gv(c, i) + '</span>';
    var sw = null; S.swaps.forEach(function (s) { if (s.i === c.id) sw = s; });
    var outC = sw && sw.o ? byId(sw.o) : null;
    var th = imgMaybe() ? '<button class="cand-th" data-card="' + esc(c.id) + '" tabindex="-1" aria-hidden="true">' + slot(c) + '</button>' : '';
    return '<article class="cand' + (c.inDeck ? ' in' : '') + '" id="cand-' + esc(c.id) + '"><div class="cand-h">' + tierB(c.tier) +
      '<div><h3><button class="linkish" data-card="' + esc(c.id) + '">' + esc(c.n) + '</button></h3><p class="cand-m">' + (c.cost ? mana(c.cost) + ' ' : '') + esc(c.line) + (c.pt ? ', ' + esc(c.pt) : '') + '</p></div>' +
      '<span class="vd vd-' + esc(c.verdict) + '">' + VERD[c.verdict] + '</span></div>' +
      '<div class="cand-b' + (th ? '' : ' noimg') + '">' + th + '<div class="cand-t">' + (c.fx ? '<p class="cand-fx' + (c.orig ? ' orig' : '') + '">' + rich(c.fx) + '</p>' : '') + (c.why ? '<p class="cand-why">' + rich(c.why) + '</p>' : '') + '</div></div>' +
      '<div class="gtags">' + tags + '<span class="gt" style="--c:226,190,112">' + pts(c) + ' pts</span>' +
      (c.syn != null ? '<span class="gt" style="--c:127,176,255" title="Sinergia nos decks de Anjos da Giada, no edh.wiki">edh.wiki ' + synTxt(c.syn) + '</span>' : '') + '</div>' +
      '<div class="cand-a">' + (c.inDeck ?
        '<span class="st">No deck' + (outC ? ', no lugar de ' + esc(outC.n) : '') + '</span><button class="btn ghost sm" data-act="unswap" data-id="' + esc(c.id) + '" data-fid="us' + esc(c.id) + '">Desfazer</button>' :
        '<select class="inp" id="sel-' + esc(c.id) + '" aria-label="Quem sai do deck para ' + esc(c.n) + ' entrar">' + cutOptions(c) + '</select>' +
        '<button class="btn sm" data-act="swap" data-id="' + esc(c.id) + '" data-fid="sw' + esc(c.id) + '">Colocar no deck</button>' +
        '<button class="btn ghost sm" data-act="verdict" data-v="fora" data-id="' + esc(c.id) + '">Deixar de fora</button>' +
        (c.custom ? '<button class="btn ghost sm" data-act="del-custom" data-id="' + esc(c.id) + '">' + (c.pool ? 'Devolver aos potenciais' : 'Excluir') + '</button>' : '')) +
      '</div></article>';
  }).join('') + '</div>';

  if (fora.length) {
    h += '<fieldset class="pn"><legend>Avaliadas, ficam de fora</legend><ul class="fora">' + fora.map(function (c) {
      return '<li>' + tierB(c.tier, true) + '<div><p><button class="linkish" data-card="' + esc(c.id) + '">' + esc(c.n) + '</button>' +
        (c.syn != null ? '<span class="fora-s">edh.wiki ' + synTxt(c.syn) + '</span>' : '') + '</p><p class="fora-d' + (!c.why && c.orig ? ' orig' : '') + '">' +
        (c.why ? rich(c.why) : c.fx ? rich(c.fx) : 'Sem descrição ainda.') + '</p></div>' +
        '<button class="btn ghost sm" data-act="verdict" data-v="avaliar" data-id="' + esc(c.id) + '" data-fid="rv' + esc(c.id) + '">Reavaliar</button></li>';
    }).join('') + '</ul></fieldset>';
  }

  var outs = D.cards.map(E).filter(function (c) { return !c.inDeck; });
  if (outs.length) {
    h += '<fieldset class="pn"><legend>Saíram do deck</legend><ul class="outs">' + outs.map(function (c) {
      return '<li>' + chip(c, { tier: true, pts: true }) + '<span class="hint" style="flex:1;min-width:160px">' + esc(c.why) + '</span><button class="btn ghost sm" data-act="restore" data-id="' + esc(c.id) + '">Devolver ao deck</button></li>';
    }).join('') + '</ul></fieldset>';
  }

  if (D.meta.edh && D.pool && D.pool.length) {
    var po = poolOpen(), ver = ui.poolAll ? po : po.slice(0, 12), th = imgMaybe();
    var pedido = 'Atualize a leitura do edh.wiki no painel Coro da Alvorada (Giada, Font of Hope). Página: ' + D.meta.edh.url + ' . Última leitura: ' + D.meta.edh.lido +
      '. Com o kit anexado: releia a página, atualize EDHWIKI, POOL e NOVAS em dados/evals.py, confira as cartas novas no Forge, rode gerar_dados.py, montar.py e testar.py e me devolva o HTML e o kit. ' +
      'Diga quais cartas entraram ou saíram da lista e quais mudaram 10 pontos ou mais de sinergia.';
    h += '<fieldset class="pn" id="pool"><legend>Potenciais do edh.wiki</legend>' +
      '<p class="hint">' + (po.length === 1 ? '1 carta' : po.length + ' cartas') + ' da página de Anjos da Giada que não estão no deck nem no radar, da maior sinergia para a menor. Leitura de ' + esc(D.meta.edh.lido) +
      '. Custo, tipo e texto vêm do Forge, e o texto fica no original porque essas cartas ainda não passaram por avaliação. Leve ao radar as que merecem nota, ou deixe de fora para a decisão ficar registrada.</p>' +
      '<div class="pool">' + ver.map(function (p) {
        return '<article class="pc' + (th ? '' : ' noimg') + '">' + (th ? '<span class="pc-th" data-peek="' + esc(p.id) + '">' + slot(p) + '</span>' : '') +
          '<div><h3>' + esc(p.n) + '</h3><p class="cand-m">' + (p.cost ? mana(p.cost) + ' ' : '') + esc(p.line) + (p.pt ? ', ' + esc(p.pt) : '') + '</p>' +
          '<p class="pc-s">' + synB(p.syn) + (p.novo ? '<span class="novo">coleção recente</span>' : '') + '</p>' +
          '<details class="pc-o"><summary>Texto da carta</summary><p class="orig">' + rich(p.fx) + '</p></details>' +
          '<div class="pc-a"><button class="btn sm" data-act="pool-in" data-v="avaliar" data-id="' + esc(p.id) + '">Levar ao radar</button>' +
          '<button class="btn ghost sm" data-act="pool-in" data-v="fora" data-id="' + esc(p.id) + '">Deixar de fora</button></div></div></article>';
      }).join('') + '</div>' +
      (po.length > 12 ? '<p class="pn-note"><button class="linkish" data-act="pool-all" data-fid="pa">' + (ui.poolAll ? 'Mostrar só as 12 de maior sinergia' : 'Ver as ' + po.length) + '</button></p>' : '') +
      '<div class="upd"><h3 class="sub">Atualizar a leitura</h3><p class="hint">Este painel não consegue ler outro site sozinho: o navegador barra, pela mesma regra que barra imagens de fora numa página publicada. A leitura do edh.wiki é refeita fora daqui. Copie o pedido e mande ao Claude com o kit: ele relê a página, confere as cartas novas no Forge e devolve o painel atualizado.</p>' +
      '<textarea class="inp" id="edh-req" readonly rows="4" aria-label="Pedido de atualização">' + esc(pedido) + '</textarea>' +
      '<div class="pc-a"><button class="btn sm" data-act="edh-copy" data-fid="ec">Copiar pedido de atualização</button>' +
      '<a href="' + esc(D.meta.edh.url) + '" target="_blank" rel="noopener noreferrer">Abrir a página do edh.wiki</a></div></div></fieldset>';
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
  var liga = 'https://www.ligamagic.com.br/?view=cards/card&card=' + encodeURIComponent(c.n);
  var where = c.cand ? (c.inDeck ? 'No deck, vinda do radar' : 'No radar, fora do deck') : (c.inDeck ? '' : 'Fora do deck');
  var h = '<button class="x" data-act="close" aria-label="Fechar">×</button>' +
    '<p class="dw-type">' + esc(c.line) + '</p><h2 id="dw-title">' + esc(c.n) + '</h2>' +
    '<div class="dw-meta">' + (c.cost ? mana(c.cost) : '') + (c.land ? '' : '<span>CMC ' + c.cmc + '</span>') + (c.pt ? '<span>' + (c.ptl ? c.ptl + ' ' : '') + esc(c.pt) + '</span>' : '') +
    (c.set ? '<span>' + esc(c.set) + ' ' + esc(c.num) + '</span>' : '') + (c.q > 1 ? '<span>' + c.q + ' cópias</span>' : '') + (c.foil ? '<span><span class="foil">✦</span> foil</span>' : '') + (where ? '<span>' + where + '</span>' : '') + '</div>';
  if (imgOn() && IM.st !== 'barrado') {
    var bk = ui.flip && imBack(c), art = imArtist(c);
    h += IM.st === 'falhou' ? '<div class="dw-art"><p class="dw-cred">Sem imagem agora: sem internet, ou imagens externas bloqueadas neste ambiente. <button class="linkish" data-act="img-retry" data-fid="ir">Tentar de novo</button></p></div>' :
      '<div class="dw-art">' + slot(c, '', true, bk) +
      (imBack(c) ? '<button class="btn ghost sm" data-act="flip" data-fid="flip">' + (bk ? 'Ver a frente' : 'Ver o verso') + '</button>' : '') +
      (art ? '<p class="dw-cred">Ilustração de ' + esc(art) + '</p>' : '') + '</div>';
  }
  h += (c.fx ? '<p class="dw-fx' + (c.orig ? ' orig' : '') + '">' + rich(c.fx) + '</p>' : '') + (c.why ? '<p class="dw-why">' + rich(c.why) + '</p>' : '') +
    (D.meta.edh && !c.custom && !c.cmd ? '<p class="dw-syn">' + synB(c.syn) + (c.syn != null ? 'de sinergia nos decks de Anjos da Giada, segundo o edh.wiki.' : 'Não aparece na página de Anjos da Giada no edh.wiki.') + '</p>' : '') +
    (c.back ? '<p class="dw-back">Outra face: ' + esc(c.back.n) + ' (' + esc(c.back.line) + ').</p>' : '');
  if (c.cand && !c.inDeck) h += '<h3>Veredito</h3><div class="segw" role="group" aria-label="Veredito">' + ['entra', 'avaliar', 'fora'].map(function (v) {
    return '<button data-act="verdict" data-v="' + v + '" data-id="' + esc(c.id) + '" data-fid="vd' + v + '" aria-pressed="' + (c.verdict === v) + '">' + VERD[v] + '</button>';
  }).join('') + '</div>';
  h += '<h3>Tier</h3><div class="segw" role="group" aria-label="Tier">' + TIERS.map(function (t) {
    return '<button data-act="set-tier" data-v="' + t.k + '" data-fid="st' + t.k + '" aria-pressed="' + (c.tier === t.k) + '">' + t.k + '<small>' + t.d + '</small></button>';
  }).join('') + '</div>';
  h += '<h3>Relevância</h3><div class="segw" role="group" aria-label="Relevância">' + RELS.map(function (r) {
    return '<button data-act="set-rel" data-v="' + r.k + '" data-fid="sr' + r.k + '" aria-pressed="' + (c.rel === r.k) + '">' + r.l + '<small>' + r.n + '</small></button>';
  }).join('') + '</div>';
  h += '<h3>Notas por agrupamento</h3><div class="steps">' + steps + '</div>';
  h += '<div class="dw-row"><label class="tog"><input type="checkbox" data-act="pet" data-fid="pet"' + (c.pet ? ' checked' : '') + '> <span class="pet">♥</span> PetCard: soma 1 ponto em Sinergia e fica fora da fila de corte</label></div>' +
    '<div class="dw-row"><label class="fld">Valor em R$ <input class="inp num" type="number" min="0" step="0.01" inputmode="decimal" data-act="val" data-fid="val" value="' + (c.val == null ? '' : c.val) + '" placeholder="0,00"></label>' +
    '<a href="' + esc(liga) + '" target="_blank" rel="noopener noreferrer">Consultar na Liga Magic</a></div>';
  h += '<div class="dw-sum"><span>Pontuação da carta</span><b>' + pts(c) + '</b></div>';
  h += '<div class="dw-links">' +
    (c.edited ? '<button class="linkish" data-act="reset-card" data-fid="rc">Voltar à avaliação original</button>' : '') +
    (c.cand ? '<button class="linkish" data-act="go" data-v="radar">' + (c.inDeck ? 'Ver a troca no radar' : 'Planejar a entrada no radar') + '</button>' :
      (c.cmd ? '' : (c.inDeck ? '<button class="linkish" data-act="cut" data-id="' + esc(c.id) + '" data-fid="ct">Tirar do deck</button>' : '<button class="linkish" data-act="restore" data-id="' + esc(c.id) + '" data-fid="ct">Devolver ao deck</button>'))) +
    '<a href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">Abrir no Scryfall</a>' +
    (IM.st === 'barrado' ? '' : '<button class="linkish" data-act="img" data-fid="img">' + (imgOn() ? 'Desligar as imagens' : (hasPack() ? 'Ligar as imagens' : 'Ligar as imagens (usa internet)')) + '</button>') + '</div>';
  el.innerHTML = h;
  el.hidden = false; $('#scrim').hidden = false;
  hydrate();
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
  renderCount(); renderDrawer(); renderModal(); hydrate();
  var eb = $('#edhBtn'); if (eb) { eb.hidden = !(D.meta.edh && D.pool && D.pool.length); eb.textContent = 'Potenciais ' + poolOpen().length; }
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
function openDrawer(id) { peekHide(); ui.drawer = id; ui.flip = false; ui.modal = false; renderModal(); renderDrawer(); var d = $('#drawer'); d.scrollTop = 0; d.focus(); }
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
    case 'img':
      S.img = !imgOn(); save(); peekHide();
      if (S.img) imStart(); else imNote();
      render(); toast(S.img ? 'Imagens das cartas ligadas' : 'Imagens das cartas desligadas'); break;
    case 'img-retry': IM.st = 'idle'; imStart(); toast('Buscando as imagens de novo'); break;
    case 'flip': ui.flip = !ui.flip; renderDrawer(); o = $('[data-fid="flip"]'); if (o) o.focus(); break;
    case 'tier-view': ui.tierView = t.dataset.v; render(); break;
    case 'verdict':
      o = byId(t.dataset.id); if (!o || !o.cand) break;
      ov(o.id).verdict = t.dataset.v;
      commit(o.n + (t.dataset.v === 'fora' ? ' fica de fora do radar' : t.dataset.v === 'entra' ? ' com veredito de entrada' : ' voltou para avaliação')); break;
    case 'pool-in':
      o = poolById(t.dataset.id); if (!o || byId(o.id)) break;
      S.custom.push({ id: o.id, n: o.n, q: 1, cost: o.cost, cmc: o.cmc, t: o.t, g: o.g, line: o.line, pt: o.pt, col: o.col, s: [0, 0, 0, 0, 0, 0, o.angel ? 2 : 0, 0], tier: 'B', rel: 'MED',
        fx: o.fx, why: '', orig: 1, syn: o.syn, cand: 1, custom: 1, pool: 1, verdict: t.dataset.v, angel: o.angel ? 1 : 0, land: o.land ? 1 : 0, prod: o.land ? 'C' : undefined });
      commit(o.n + (t.dataset.v === 'fora' ? ' fica de fora' : ' entrou no radar')); break;
    case 'pool-all': ui.poolAll = !ui.poolAll; render(); break;
    case 'edh': ui.drawer = null; go('radar'); o = $('#pool'); if (o) o.scrollIntoView({ block: 'start' }); break;
    case 'edh-copy':
      o = $('#edh-req'); if (!o) break;
      o.focus(); o.select();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(o.value).then(function () { toast('Pedido copiado'); }, function () { toast('Pedido selecionado: copie com Ctrl+C'); });
      else toast('Pedido selecionado: copie com Ctrl+C');
      break;
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
      commit(name + ' entrou no radar'); if (imgOn()) imStart(); break;
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
        S = normalize(raw); ui.modal = false; commit('Backup restaurado'); imStart();
      } catch (e) { toast('Esse texto não é um backup deste painel'); }
      break;
    case 'reset-all':
      if (!ui.confirmReset) { ui.confirmReset = true; renderModal(); var b = $('[data-fid="ra"]'); if (b) b.focus(); break; }
      S = fresh(); ui.confirmReset = false; ui.modal = false; commit('Painel de volta ao original'); imStart(); break;
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
  peekHide();
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
  peekHide();
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

/* espiada da carta ao passar o mouse */
document.addEventListener('mouseover', function (ev) {
  if (!canHover || !imgOn() || !imgReady()) return;
  var t = ev.target.closest && ev.target.closest('[data-card],[data-peek]');
  if (t && t.closest('#drawer')) t = null;
  var id = t ? (t.dataset.card || t.dataset.peek) : null;
  if (id === PK.id) return;
  peekHide();
  if (!id) return;
  PK.id = id; PK.x = ev.clientX; PK.y = ev.clientY;
  PK.t = setTimeout(function () { peekShow(id); }, IM.st === 'lento' ? 280 : 140);
});
document.addEventListener('mousemove', function (ev) {
  if (!PK.id) return;
  PK.x = ev.clientX; PK.y = ev.clientY;
  if (PK.el && !PK.el.hidden) peekPos();
}, { passive: true });
document.documentElement.addEventListener('mouseleave', peekHide);
window.addEventListener('scroll', peekHide, { passive: true, capture: true });
window.addEventListener('online', function () { if (imgOn() && IM.st === 'falhou') { IM.st = 'idle'; imStart(); } });

/* ============ início ============ */
$('#feito').textContent = D.meta.feito;
if (D.meta.edh) $('#edhNote').textContent = 'Sinergia da comunidade: ' + D.meta.edh.fonte + ', página de Anjos da Giada, lida em ' + D.meta.edh.lido + '.';
$('#storeNote').textContent = storeMsg(false);
imStart();
go('geral');
ui.booted = true;
