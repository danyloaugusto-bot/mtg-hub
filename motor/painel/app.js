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
var TABC = false;   /* tabelão na visão Critérios (v3): gv e pts leem os critérios enquanto ele é desenhado */
/* régua da pontuação (motor/pontuacao.json, via build). Deck v3: duas análises lado a lado. Os agrupamentos (aba 8×8,
   tabelão, leituras) seguem com a soma das notas; os dez critérios (vetor s3 de cada carta) dão o placar, o gráfico da
   página inicial e a aba Critérios: peso × pontos da nota, mais a aceleração pelas notas de Aceleradores. */
var RG = M.regua, V3 = !!(M.v3 && D.criterios);
var CR = V3 ? D.criterios.map(function (g) {
  return { id: g.k, k: g.nome, ab: g.ab, d: g.desc, sh: g.curto || '', ref: g.ref || null, lt: !!g.claro, peso: g.peso, cor: g.cor };
}) : [];
var NC = CR.length;
var ICA = (function () { for (var i = 0; i < NC; i++) if (CR[i].id === 'aceleradores') return i; return 0; })();
function ptsCrit(v, i) { return v > 0 ? CR[i].peso * RG.pontos_por_nota[Math.min(3, v)] : 0; }
function pontosAcel(y) { var a = RG.aceleracao; return y < 0 ? 0 : Math.min(a.teto, a.piso + a.pontos_por_passo * Math.floor(y / a.passo)); }
/* placar com vírgula: a v3 tem meio ponto (peso 2,5 e 1,5) */
function fmtP(n) { return fmt(n, n % 1 ? 1 : 0); }
/* regra C do gráfico v3 (pedido de 15/10/2026): o desenho de cada critério mostra as cartas com nota 2 ou 3 contra a
   faixa da régua, com o máximo da faixa a 2/3 do comprimento (cheio em 1,5 vez o máximo); o número escrito é o ponto real.
   Durante o desenho, LAB guarda os pontos reais e MAXFIX fixa a escala, para a peça mais cheia não virar 100% sozinha. */
var LAB = null, MAXFIX = null, FOLGA = 1.5, FAIXA_VIS = false, FXS = null;
function LB(i, v) { return LAB ? LAB[i] : v; }
/* ao lado do número de cada critério: ▲ acima da faixa da régua, ▼ abaixo (vale para todo desenho, com ou sem a faixa desenhada) */
function FX(i) { var x = FXS && FXS[i]; return x ? '<tspan class="fx-s fx-' + x + '">' + (x === 'a' ? ' ▲' : ' ▼') + '</tspan>' : ''; }
function ctrLongo(st) { return fmtP(st.total).length > 4 ? ' longo' : ''; }
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
  Object.keys(f.ov).forEach(function (id) {
    var o = f.ov[id]; if (o && Array.isArray(o.s) && o.s.length !== NG) o.s = fitS(o.s);
    if (o && o.s3 && (!V3 || !Array.isArray(o.s3) || o.s3.length !== NC)) delete o.s3;   /* notas dos critérios só valem com os dez */
  });
  Object.keys(f.pk).forEach(function (id) { if (typeof f.pk[id] !== 'string') delete f.pk[id]; });
  if (Array.isArray(s.custom)) f.custom = s.custom.filter(function (c) { return c && c.id && c.n && Array.isArray(c.s); }).map(function (c) {
    if (c.s.length !== NG) c.s = fitS(c.s);
    if (c.s3 && (!V3 || !Array.isArray(c.s3) || c.s3.length !== NC)) delete c.s3;
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
var ui = { tab: 'geral', curve: 'tipo', q: '', fg: -1, fc: -1, fech: {}, ft: '', fr: '', sort: { k: 'n', d: 1 }, grouped: true,
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
  if (V3) e.s3 = (o.s3 || c.s3 || []).slice();
  e.pet = !!o.pet; e.val = (o.val == null ? null : o.val); e.q = c.q || 1;
  e.edited = !!(o.s || o.s3 || o.tier || o.rel);
  if (c.cand) e.verdict = o.verdict || c.verdict || 'avaliar';
  e.nota = o.nota || ''; e.tem = !!o.tem;
  e.inDeck = c.cand ? !!S.inn[c.id] : !S.out[c.id];
  e.mk = c.mk || {};
  return e;
}
/* gaveta v3: como a nota vira ponto, e a régua de cada critério (o que conta em cada nota, com o peso) */
function resumoDw() {
  var pn = RG.pontos_por_nota;
  return 'Cada nota de 0 a 3 vale ' + pn.slice(1).join(', ').replace(/, (\d+)$/, ' ou $1') + ' pontos, vezes o peso do critério (o ×, ao lado do nome). ' +
    'As duas sinergias seguem a régua deste deck; os outros oito critérios vêm do cadastro da carta e valem igual em todos os decks.';
}
function reguaDw() {
  var sr = M.sinergias || {};
  return '<details class="dw-rg"><summary>O que conta em cada critério</summary><ul>' + CR.map(function (g) {
    var x = sr[g.id], txt = x && x.regra ? esc(x.nome) + '. ' + esc(x.regra) : esc(g.d);
    return '<li><b>' + esc(g.k) + ' ×' + fmt(g.peso, g.peso % 1 ? 1 : 0) + ':</b> ' + txt + '</li>';
  }).join('') + '</ul></details>';
}
/* gaveta v3: em qual deck a carta rende mais (motor/encaixe.py, calculado no build). Ganho = valor da carta no deck, com a
   saturação da faixa de cada critério, menos o valor da carta de menor valor dele, que sairia. */
function encaixeHtml(c) {
  var L = (D.encaixe || {})[c.id];
  if (!L || !L.length) return '';
  var nomeC = {}; CR.forEach(function (g) { nomeC[g.id] = g.k; });
  var top = L.slice(0, 5); if (!top.some(function (x) { return x.p === M.pasta; })) { var eu = L.filter(function (x) { return x.p === M.pasta; })[0]; if (eu) top.push(eu); }
  var melhor = L.filter(function (x) { return !x.j; })[0];
  var resumo = melhor ? 'rende mais em ' + esc(melhor.n) + ', ' + (melhor.g > 0 ? '+' : melhor.g < 0 ? '−' : '±') + fmtP(Math.abs(melhor.g)) : 'já está ' + (L.length > 1 ? 'nos decks onde rende' : 'no deck');
  var linhas = top.map(function (x) {
    var este = x.p === M.pasta, nome = PUB || este ? esc(x.n) : '<a href="' + encodeURIComponent(x.p) + '.html">' + esc(x.n) + '</a>';
    // embaixo do nome do painel: o comandante e a identidade de cor, para reconhecer o deck de relance
    var inf = (D.encaixe_decks || {})[x.p] || {}, cores = String(inf.i || '').split('').filter(function (ch) { return WUBRG.indexOf(ch) >= 0; });
    var quem = (inf.c ? esc(inf.c) : '') + (cores.length ? ' <span class="mana" role="img" aria-label="Cores ' + cores.join('') + '">' + cores.map(msym).join('') + '</span>' : inf.c ? ' <span class="mana">' + msym('C') + '</span>' : '');
    var corpo = x.j ? '<span class="enc-ja">já está no deck</span> <small>' + fmtP(x.v) + ' pts com a faixa</small>' :
      '<b class="enc-g ' + (x.g > 0 ? 'pos' : x.g < 0 ? 'neg' : '') + '">' + (x.g > 0 ? '+' : x.g < 0 ? '−' : '±') + fmtP(Math.abs(x.g)) + '</b> ' +
      '<small>' + fmtP(x.v) + ' pts com a faixa; sai ' + esc(x.s || '—') + ' (' + fmtP(x.vs) + ')' +
      (x.dc != null && Math.abs(x.dc) >= 0.005 ? '; CMC médio ' + (x.dc > 0 ? '+' : '−') + fmt(Math.abs(x.dc)) : '') +
      (x.da ? '; aceleração ' + (x.da > 0 ? '+' : '−') + Math.abs(x.da) : '') + '</small>' +
      (x.c && x.c.length ? '<small class="enc-c">cobre o que falta: ' + esc(lista(x.c.map(function (k) { return nomeC[k] || k; }))) + '</small>' : '') +
      (x.a ? '' : '<small class="enc-av">sinergia a avaliar: o número é um piso</small>');
    return '<li' + (este ? ' class="este"' : '') + '><span class="enc-d">' + nome + (quem || este ? '<small class="enc-cm">' + quem + (este ? (quem ? ' · ' : '') + 'este deck' : '') + '</small>' : '') + '</span><span class="enc-v">' + corpo + '</span></li>';
  }).join('');
  return '<details class="dw-8 dw-enc"' + (ui.dwenc ? ' open' : '') + '><summary><span class="dw-h3">Encaixe<span class="dw-tot">' + resumo + '</span></span></summary>' +
    '<p class="dw-nota">Em quais decks esta carta rende mais. Ganho é o valor dela no deck, com o peso de cada critério e a faixa da régua (critério abaixo da faixa conta mais, acima conta menos), menos o valor da carta de menor valor do deck, que sairia. Terreno troca com terreno; a carta com terreno no verso joga dos dois lados e troca com terreno ou com mágica. Só entram os decks já nos critérios e nas cores da carta.</p>' +
    '<ul class="enc">' + linhas + '</ul></details>';
}
/* a carta como veio do motor, sem o que o dono mudou no painel */
function byIdRaw(id) { var all = D.cards.concat(cands()); for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i]; return null; }
function byId(id) {
  var all = D.cards.concat(cands());
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return E(all[i]);
  return null;
}
function deck() { return D.cards.concat(cands()).map(E).filter(function (c) { return c.inDeck; }); }
function gv(c, i) { if (TABC) return (c.s3 || [])[i] || 0; return (c.s[i] || 0) + (i === IPET && c.pet ? 1 : 0); }
function pts(c) { if (TABC) return pts3(c); var t = 0; for (var i = 0; i < NG; i++) t += gv(c, i); return t; }
function pts3(c) { var t = 0; for (var i = 0; i < NC; i++) t += ptsCrit((c.s3 || [])[i] || 0, i); return t; }
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
  var st = { n: 0, nonland: 0, cmcSum: 0, curve: [], types: {}, cols: {}, rel: {}, tier: {}, grp: [],
             pip: {}, src: {}, pw: {}, srcC: 0, lands: 0, mdfc: 0, tapped: 0, cri: 0, tribo: 0, wipes: 0, mk: {},
             foils: 0, sets: {}, low: 0, top: 0 };
  var i;
  for (i = 0; i < 8; i++) st.curve.push({ n: 0, t: {}, c: {} });
  for (i = 0; i < NG; i++) st.grp.push({ hard: 0, soft: 0, pts: 0 });
  st.c3 = []; for (i = 0; i < NC; i++) st.c3.push({ hard: 0, soft: 0, pts: 0, notas: 0, n3: 0 });
  Object.keys(MK).forEach(function (k) { st.mk[k] = { n: 0, v: {}, names: [] }; });
  WUBRG.forEach(function (ch) { st.pip[ch] = 0; st.src[ch] = 0; st.pw[ch] = [0, 0, 0, 0]; });
  cs.forEach(function (c) {
    var q = c.q;
    st.n += q;
    st.types[c.t] = (st.types[c.t] || 0) + q;
    st.rel[c.rel] = (st.rel[c.rel] || 0) + q;
    st.tier[c.tier] = (st.tier[c.tier] || 0) + q;
    if (c.foil) st.foils += q;
    if (c.set) st.sets[c.set] = (st.sets[c.set] || 0) + q;
    for (var j = 0; j < NG; j++) {
      var v = gv(c, j); st.grp[j].pts += v * q;
      if (v >= 2) st.grp[j].hard += q; else if (v === 1) st.grp[j].soft += q;
    }
    for (j = 0; j < NC; j++) {
      var x3 = st.c3[j]; v = (c.s3 || [])[j] || 0; x3.pts += ptsCrit(v, j) * q; x3.notas += v * q;
      if (v >= 2) x3.hard += q; else if (v === 1) x3.soft += q;
      if (v === 3) x3.n3 += q;
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
  st.cmcPts = (V3 && !RG.pontos_de_cmc_antigos) || a === 0 ? 0 : a < 2 ? 5 : a < 3 ? 4 : a < 4 ? 3 : a < 5 ? 2 : 1;
  st.accX = a ? (V3 ? st.c3[ICA].notas : st.grp[IR].pts) / a : 0;
  st.accPts = pontosAcel(st.accX);
  st.crit = (V3 ? st.c3 : st.grp).reduce(function (t, g) { return t + g.pts; }, 0);
  st.total = st.cmcPts + st.accPts + st.crit;
  return st;
}
function cutQueue(cs, lands) {
  return cs.filter(function (c) { return !c.cmd && !c.pet && !c.nocut && (!!c.land === !!lands); }).sort(function (a, b) {
    return cutCmp(a, b);
  });
}
function cutCmp(a, b) {
  // deck v3: depois da relevância e da prioridade, sai primeiro a de menor valor nos critérios (o tier desempata)
  if (V3) return (RR[b.rel] - RR[a.rel]) || ((a.pri || 99) - (b.pri || 99)) || (pts3(a) - pts3(b)) || (TR[b.tier] - TR[a.tier]) || a.n.localeCompare(b.n);
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
    (o.pts ? '<span class="p">' + (V3 ? fmtP(pts3(c)) : pts(c)) + '</span>' : '') +
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
function meteorSvg(i, Lmax, L, rr, big) {
  // o meteoro com o eixo x apontando para fora: a bola de fogo perto do centro e a cauda que se estende até L;
  // o comprimento inteiro fica tracejado, e o maior ganha as faíscas
  var f = function (n) { return n.toFixed(1); };
  var o = '<path d="M0 -13L' + f(Lmax) + ' 0L0 13Z" style="fill:rgba(var(--g' + i + '),.04);stroke:rgba(var(--gold-rgb),.28)" stroke-width="1" stroke-dasharray="3 3"/>';
  if (L <= 0) return o;
  o += '<path d="M0 ' + f(-rr) + 'Q' + f(L * 0.35) + ' ' + f(-rr * 0.8) + ' ' + f(L + rr) + ' 0Q' + f(L * 0.35) + ' ' + f(rr * 0.8) + ' 0 ' + f(rr) + 'Z" style="fill:url(#mt' + i + ')"/>' +
    '<path d="M0 ' + f(-rr * 0.5) + 'Q' + f(L * 0.3) + ' ' + f(-rr * 0.35) + ' ' + f(L * 0.72 + rr) + ' 0Q' + f(L * 0.3) + ' ' + f(rr * 0.35) + ' 0 ' + f(rr * 0.5) + 'Z" style="fill:rgba(255,244,214,.55)"/>' +
    '<circle cx="' + f(L * 0.45 + rr) + '" cy="' + f(-rr * 0.55) + '" r="1.4" style="fill:var(--gold2)"/><circle cx="' + f(L * 0.62 + rr) + '" cy="' + f(rr * 0.4) + '" r="1.1" style="fill:var(--gold2)"/>' +
    '<circle r="' + f(rr) + '" style="fill:rgb(var(--g' + i + '));stroke:rgba(var(--deep-rgb),.85)" stroke-width="1.2"/>' +
    '<circle cx="' + f(-rr * 0.18) + '" cy="' + f(-rr * 0.18) + '" r="' + f(rr * 0.5) + '" style="fill:rgba(255,248,224,.9)"/>';
  if (big) o += '<circle r="' + f(rr * 1.9) + '" style="fill:rgba(var(--gold2-rgb),.16)"/>' +
    '<path d="M' + f(-rr - 9) + ' -12l2.2 6 6 2.2 -6 2.2 -2.2 6 -2.2 -6 -6 -2.2 6 -2.2z" style="fill:var(--gold2)"/>' +
    '<path d="M' + f(-rr - 4) + ' 10l1.4 3.6 3.6 1.4 -3.6 1.4 -1.4 3.6 -1.4 -3.6 -3.6 -1.4 3.6 -1.4z" style="fill:#fff;opacity:.8"/>';
  return o;
}
function cannonSvg(i, L, f, blast) {
  // o canhão clássico deitado no eixo x: culatra redonda e larga perto do centro, cano que afina e boca em sino;
  // por dentro, a carga de goblins da cor do agrupamento enche da culatra até a boca em proporção f; o mais cheio dispara
  var x0 = 16, x1 = x0 + L, wb = 17, wm = 10.5, xs = x1 - 9, ink = '#24110a', o = '', k, F = function (n) { return n.toFixed(1); };
  var body = 'M' + x0 + ' ' + (-wb) + 'C' + F(x0 + L * 0.35) + ' ' + (-wb) + ' ' + F(xs - 10) + ' ' + (-wm) + ' ' + F(xs) + ' ' + (-wm) +
    'Q' + F(x1 - 3) + ' ' + (-wm) + ' ' + F(x1) + ' ' + F(-wm - 5) + 'L' + F(x1) + ' ' + F(wm + 5) + 'Q' + F(x1 - 3) + ' ' + wm + ' ' + F(xs) + ' ' + wm +
    'C' + F(xs - 10) + ' ' + wm + ' ' + F(x0 + L * 0.35) + ' ' + wb + ' ' + x0 + ' ' + wb + 'C' + (x0 - 14) + ' ' + wb + ' ' + (x0 - 14) + ' ' + (-wb) + ' ' + x0 + ' ' + (-wb) + 'Z';
  var inner = 'M' + (x0 - 6) + ' 0C' + (x0 - 6) + ' ' + F(-wb + 4) + ' ' + x0 + ' ' + F(-wb + 4) + ' ' + (x0 + 4) + ' ' + F(-wb + 4) +
    'C' + F(x0 + L * 0.35) + ' ' + F(-wb + 4) + ' ' + F(xs - 10) + ' ' + F(-wm + 3.5) + ' ' + F(x1 - 2) + ' ' + F(-wm + 3.5) + 'L' + F(x1 - 2) + ' ' + F(wm - 3.5) +
    'C' + F(xs - 10) + ' ' + F(wm - 3.5) + ' ' + F(x0 + L * 0.35) + ' ' + F(wb - 4) + ' ' + (x0 + 4) + ' ' + F(wb - 4) + 'C' + x0 + ' ' + F(wb - 4) + ' ' + (x0 - 6) + ' ' + F(wb - 4) + ' ' + (x0 - 6) + ' 0Z';
  o += '<circle cx="' + (x0 - 15) + '" cy="0" r="5.5" style="fill:#c98a3c;stroke:' + ink + '" stroke-width="1.5"/>' +
    '<path d="' + body + '" style="fill:#3a1d10;stroke:' + ink + ';stroke-linejoin:round" stroke-width="1.8"/>' +
    '<path d="' + inner + '" style="fill:rgba(0,0,0,.5)"/>';
  if (f > 0) {
    o += '<g clip-path="url(#ccn' + i + ')"><path d="' + inner + '" style="fill:url(#cgn' + i + ')"/>';
    for (k = 0; k < 16; k++) {
      var ex = x0 - 2 + ((k * 37) % 97) / 97 * (L - 6), hw = wb - 4 - (wb - wm) * Math.max(0, (ex - x0) / L), ey = (((k * 53) % 89) / 89 - 0.5) * hw * 1.6;
      o += '<circle cx="' + F(ex) + '" cy="' + F(ey) + '" r="' + (k % 3 ? 1.2 : 1.9) + '" style="fill:#fff3c4;opacity:.8"/>';
    }
    o += '</g>';
  }
  [0.3, 0.62].forEach(function (t) { var x = x0 + L * t, h = wb - (wb - wm) * Math.min(1, t * 1.25) + 2;
    o += '<rect x="' + F(x - 2.5) + '" y="' + F(-h) + '" width="5" height="' + F(2 * h) + '" rx="1.2" style="fill:#c98a3c;stroke:' + ink + '" stroke-width="1.1"/>'; });
  o += '<path d="M' + (x0 + 2) + ' ' + (-wb + 2) + 'C' + F(x0 + L * 0.35) + ' ' + (-wb + 2) + ' ' + F(xs - 10) + ' ' + F(-wm + 1.6) + ' ' + F(xs) + ' ' + F(-wm + 1.6) + '" style="fill:none;stroke:rgba(255,230,180,.4)" stroke-width="1.6"/>';
  if (blast) {
    // o disparo: estouro de pólvora na boca e um goblin em chamas voando
    var bx = x1 + 4, pts = [], gx = bx + 34;
    for (k = 0; k < 18; k++) { var a = k * Math.PI / 9, rr = k % 2 ? 7 : 17; pts.push(F(bx + 12 + rr * Math.cos(a)) + ' ' + F(rr * Math.sin(a))); }
    o += '<path d="M' + pts.join('L') + 'Z" style="fill:#ffc21a;stroke:#ff7a12" stroke-width="2.2"/><circle cx="' + (bx + 12) + '" cy="0" r="7" style="fill:#fff3c4"/>' +
      '<path d="M' + (gx - 14) + ' 0Q' + (gx - 2) + ' -16 ' + (gx + 14) + ' -9Q' + (gx + 8) + ' -3 ' + (gx + 18) + ' 0Q' + (gx + 8) + ' 3 ' + (gx + 14) + ' 9Q' + (gx - 2) + ' 16 ' + (gx - 14) + ' 0Z" style="fill:#ff7a12;opacity:.92"/>' +
      '<g transform="translate(' + gx + ' 0) rotate(90) scale(1.5)"><path d="M0 -7L2.5 -4L6 -6L3.5 -2L7 2L2 1L1.5 6L-1.5 6L-2 1L-7 2L-3.5 -2L-6 -6L-2.5 -4Z" style="fill:#24110a"/></g>';
  }
  return o;
}
function krenkoCrown(x, y, k) {
  // a coroa de ferro espetada do Krenko, apoiada em y
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><path d="M-7 0L-8 -8L-4 -3L-2 -10L0 -3.5L2 -10L4 -3L8 -8L7 0Z" style="fill:#c9cdd2;stroke:#2a110a;stroke-linejoin:round" stroke-width="1.1"/></g>';
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
function gLabel(i, am, R, v) { return KIT.rotulo(am, R + 28, G[i].sh || G[i].k, fmtP(LB(i, v)) + FX(i)); }
/* kit de luz do rebranding (contexto/visual/GUIA-VISUAL.md, "Kit técnico"): uma biblioteca só, usada por todo gráfico.
   Filtros comuns com id prefixado, geometria, sorteio com semente fixa por deck (nunca Math.random), as camadas de luz
   (brilho, corpo, núcleo, reflexo), a escala honesta (linear ou por área, mínimo de 12%) e o rótulo único. */
var KIT = (function () {
  var CX = 230, CY = 230, D2R = Math.PI / 180;
  function f(n) { return (+n).toFixed(1); }
  /* ângulo no sistema da moldura (graus, -90 = topo); o desvio é perpendicular à direção */
  function pt(a, r, off) { var t = a * D2R, c = Math.cos(t), s = Math.sin(t); off = off || 0; return [CX + r * c - off * s, CY + r * s + off * c]; }
  function d(pts, fechar) { return 'M' + pts.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L') + (fechar ? 'Z' : ''); }
  /* polígono que afina da base (largura w0) até a ponta */
  function corpo(pts, w0, wFim) {
    var L = [], Rt = [], n = pts.length, w1 = wFim == null ? 0.4 : wFim;
    for (var k = 0; k < n; k++) {
      var p = pts[k], q = pts[Math.min(n - 1, k + 1)], o2 = pts[Math.max(0, k - 1)];
      var dx = q[0] - o2[0], dy = q[1] - o2[1], m = Math.hypot(dx, dy) || 1, nx = -dy / m, ny = dx / m, w = w0 * (1 - k / Math.max(1, n - 1)) + w1;
      L.push([p[0] + nx * w, p[1] + ny * w]); Rt.unshift([p[0] - nx * w, p[1] - ny * w]);
    }
    return d(L.concat(Rt), true);
  }
  /* semente fixa: o nome da pasta do deck vira o número inicial (FNV-1a); sorte(n) reinicia num ponto fixo, sorte() segue */
  function semente(txt) { var h = 2166136261; txt = String(txt || ''); for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h % 233280; }
  var seed = semente(M.pasta);
  function sorte(sd) { if (sd != null) seed = (semente(M.pasta) + sd * 7919) % 233280; seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  /* filtros comuns, com id prefixado pelo nome do gráfico: brilho largo (5), brilho curto (2) e textura (ruído a .35).
     O brilho cobre uma área folgada em volta do centro (userSpaceOnUse), que vale também dentro de grupo girado: pela caixa da peça, uma peça fina e reta cortava o brilho em retângulo. */
  function defs(ctx, nome) {
    var I = { brilho: ctx.uid(nome + 'Bl'), brilho2: ctx.uid(nome + 'Bc'), textura: ctx.uid(nome + 'Tx') };
    ctx.k = I;
    return '<filter id="' + I.brilho + '" filterUnits="userSpaceOnUse" x="-700" y="-700" width="1860" height="1860"><feGaussianBlur stdDeviation="5"/></filter>' +
      '<filter id="' + I.brilho2 + '" filterUnits="userSpaceOnUse" x="-700" y="-700" width="1860" height="1860"><feGaussianBlur stdDeviation="2"/></filter>' +
      '<filter id="' + I.textura + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="' + (semente(M.pasta) % 97) + '" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .35 0" result="t"/><feComposite in="t" in2="SourceGraphic" operator="in" result="tx"/>' +
      '<feBlend in="tx" in2="SourceGraphic" mode="overlay"/></filter>';
  }
  /* profundidade: gradiente radial do claro ao escuro, na cor dada */
  function fundo(id, cor, cx, cy, r) {
    return '<radialGradient id="' + id + '"' + (cx != null ? ' cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '" gradientUnits="userSpaceOnUse"' : ' cx=".38" cy=".32" r=".8"') + '>' +
      '<stop offset="0" style="stop-color:#fff;stop-opacity:.55"/><stop offset=".35" style="stop-color:' + cor + '"/><stop offset="1" style="stop-color:rgba(0,0,0,.65)"/></radialGradient>';
  }
  /* camadas de luz de uma peça acesa: brilho largo, corpo na cor (com textura), núcleo claro e reflexo curto */
  function luz(ctx, caminho, cor, opt) {
    opt = opt || {}; var I = ctx.k;
    return (opt.brilho === false ? '' : '<path d="' + (opt.trilha || caminho) + '" style="fill:none;stroke:' + cor + '" stroke-width="' + (opt.largo || 16) + '" stroke-linecap="round" stroke-linejoin="round" filter="url(#' + I.brilho + ')" opacity=".7"/>') +
      '<path d="' + caminho + '" style="fill:' + cor + '"' + (opt.textura === false ? '' : ' filter="url(#' + I.textura + ')"') + '/>' +
      (opt.nucleo ? '<path d="' + opt.nucleo + '" style="fill:#fff" opacity=".9"/>' : '') +
      (opt.trilha ? '<path d="' + opt.trilha + '" style="fill:none;stroke:#fff" stroke-width="2.4" opacity=".35" filter="url(#' + I.brilho2 + ')"/>' : '');
  }
  /* escala honesta: comprimento linear, área pela raiz; toda peça aparece com pelo menos 12% */
  function comp(fr) { return Math.max(0.12, Math.min(1, fr)); }
  function area(fr) { return Math.max(0.12, Math.sqrt(Math.max(0, Math.min(1, fr)))); }
  /* rótulo único: âncora por quadrante, quebra acima de 14 caracteres, rótulo curto opcional (tema.json, rotulos_curtos) */
  function rotulo(a, r, nome, valor) {
    var t = a * D2R, cs = Math.cos(t), sn = Math.sin(t), x = CX + r * cs, y = CY + r * sn + (sn < 0 ? -6 : 4);
    var anc = cs > 0.3 ? 'start' : cs < -0.3 ? 'end' : 'middle', curto = (M.rotulos_curtos || {})[nome];
    var txt = curto || nome, linhas = [txt];
    if (txt.length > 14 && txt.indexOf(' ') > 0) {
      var meio = txt.length / 2, melhor = -1;
      for (var k = 0; k < txt.length; k++) if (txt[k] === ' ' && (melhor < 0 || Math.abs(k - meio) < Math.abs(melhor - meio))) melhor = k;
      linhas = [txt.slice(0, melhor), txt.slice(melhor + 1)];
    }
    if (linhas.length > 1 && sn < -0.3) y -= 15;
    return '<text x="' + f(x) + '" y="' + f(y) + '" text-anchor="' + anc + '">' + esc(linhas[0]) +
      (linhas[1] ? '<tspan x="' + f(x) + '" dy="1.05em">' + esc(linhas[1]) + '</tspan>' : '') +
      '<tspan class="v" x="' + f(x) + '" dy="1.08em">' + valor + '</tspan></text>';
  }
  return { pt: pt, d: d, corpo: corpo, sorte: sorte, defs: defs, fundo: fundo, luz: luz, comp: comp, area: area, rotulo: rotulo, f: f };
})();
/* asas do Coro da Alvorada: duas asas abertas, largas, atrás da auréola com o placar. Cada asa tem o braço (do ombro ao
   punho, no alto), três fileiras de coberteiras por cima e as penas de voo embaixo. As oito penas de voo coloridas são os
   agrupamentos, quatro por asa: o comprimento cresce com a raiz quadrada da soma das notas (a área acompanha a soma) e o
   contorno claro mostra a pena inteira. Entre elas, penas brancas de enfeite com o comprimento das vizinhas fecham a
   silhueta. Só para 8 agrupamentos. */
var WCX = 600, WCY = 236, WLMAX = 196, WLMIN = 58, WCURL = 0.12;
/* penas de voo da asa direita, de dentro para fora: posição no braço (0 = ombro, 1 = punho) e direção (90 = para baixo) */
var WT = [0.40, 0.62, 0.82, 1.0], WD = [96, 80, 64, 46];
function wArm(side, t) {
  var x0 = 60, y0 = -6, cx = 92, cy = -280, x1 = 236, y1 = -262, u = 1 - t;
  return { x: WCX + side * (u * u * x0 + 2 * u * t * cx + t * t * x1), y: WCY + u * u * y0 + 2 * u * t * cy + t * t * y1 };
}
function wPt(p, a, u, v) {
  var t = a * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
  return (p.x + u * c - v * s).toFixed(1) + ' ' + (p.y + u * s + v * c).toFixed(1);
}
function wFeather(p, a, L, curl, larg) {
  var hw = Math.max(7, L * (larg || 0.16)), b = Math.min(6, hw * 0.45), d = L * WCURL * curl;
  return 'M' + wPt(p, a, 0, -b) +
    'C' + wPt(p, a, L * 0.3, -hw * 0.9) + ' ' + wPt(p, a, L * 0.72, -hw * 0.7 + d * 0.3) + ' ' + wPt(p, a, L, d) +
    'C' + wPt(p, a, L * 0.84, hw * 0.85 + d) + ' ' + wPt(p, a, L * 0.3, hw * 1.15) + ' ' + wPt(p, a, 0, b) + 'Z';
}
function wRachis(p, a, L, curl) {
  var d = L * WCURL * curl;
  return 'M' + wPt(p, a, 4, 0) + 'Q' + wPt(p, a, L * 0.62, d * 0.15) + ' ' + wPt(p, a, L - 8, d * 0.88);
}
function wLerp(a, b, f) { return a + (b - a) * f; }
function wingsSvg(st) {
  var max = 1, i;
  for (i = 0; i < 8; i++) max = Math.max(max, st.grp[i].pts);
  var Ls = [];
  for (i = 0; i < 8; i++) Ls.push(WLMIN + (WLMAX - WLMIN) * Math.sqrt(Math.max(0, st.grp[i].pts) / max));
  var o = '<svg class="asas-svg" viewBox="146 -42 908 356" role="group" aria-label="Duas asas abertas com os oito agrupamentos, uma pena de voo para cada, e a pontuação total na auréola"><defs>';
  for (i = 0; i < 8; i++) o += '<linearGradient id="pg' + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:rgb(var(--g' + i + '))"/><stop offset="1" style="stop-color:rgba(var(--g' + i + '),.6)"/></linearGradient>';
  o += '<linearGradient id="pluma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".30"/><stop offset="1" stop-color="#fff" stop-opacity=".10"/></linearGradient>' +
    '<radialGradient id="halo" gradientUnits="userSpaceOnUse" cx="' + WCX + '" cy="' + WCY + '" r="260"><stop offset="0" style="stop-color:rgba(var(--gold2-rgb),.40)"/><stop offset=".45" style="stop-color:rgba(var(--gold2-rgb),.10)"/><stop offset="1" style="stop-color:rgba(var(--gold2-rgb),0)"/></radialGradient></defs>' +
    '<circle cx="' + WCX + '" cy="' + WCY + '" r="260" fill="url(#halo)"/>';
  var enfeite = '', voo = '', cob = '', bracos = '', labels = '';
  var pluma = function (p, a, L, curl, larg, op) { return '<path d="' + wFeather(p, a, L, curl, larg) + '" style="fill:rgba(255,255,255,' + op + ');stroke:rgba(var(--gold2-rgb),.55)" stroke-width="1"/>'; };
  [1, -1].forEach(function (side) {
    var idx = side > 0 ? [3, 2, 1, 0] : [4, 5, 6, 7];   /* de dentro para fora */
    var dir = function (k) { return side > 0 ? k : 180 - k; };
    /* penas de enfeite: duas junto do corpo e três entre cada par de penas de voo, com o comprimento das vizinhas */
    var tr = [0.06, 0.18], dd = [118, 110], ll = [Ls[idx[0]] * 0.7, Ls[idx[0]] * 0.85];
    for (var k = 0; k < 3; k++) for (var m = 1; m <= 3; m++) {
      var f = m / 4; tr.push(wLerp(WT[k], WT[k + 1], f)); dd.push(wLerp(WD[k], WD[k + 1], f)); ll.push(wLerp(Ls[idx[k]], Ls[idx[k + 1]], f) * 0.96);
    }
    for (var q = 0; q < tr.length; q++) enfeite += pluma(wArm(side, tr[q]), dir(dd[q]), ll[q], side, 0.15, 0.13);
    /* as penas de voo de verdade, uma por agrupamento */
    for (k = 0; k < 4; k++) {
      var gi = idx[k], p = wArm(side, WT[k]), a = dir(WD[k]), L = Ls[gi], v = st.grp[gi].pts;
      voo += '<g class="pena" style="--i:' + k + ';transform-origin:' + p.x.toFixed(1) + 'px ' + p.y.toFixed(1) + 'px;--r:' + (side * -20) + 'deg" tabindex="0" role="button" data-act="filter-group" data-g="' + gi + '" aria-label="' + esc(G[gi].k) + ': ' + fmtP(v) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[gi].k) + ': ' + fmtP(v) + ' pontos, ' + pl(st.grp[gi].hard + st.grp[gi].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wFeather(p, a, WLMAX, side, 0.17) + '" style="fill:rgba(var(--g' + gi + '),.06);stroke:rgba(var(--gold2-rgb),.5)" stroke-width="1" stroke-dasharray="4 4"/>' +
        '<path class="fill" d="' + wFeather(p, a, L, side, 0.17) + '" fill="url(#pg' + gi + ')" style="stroke:rgba(var(--gold2-rgb),.95)" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="' + wRachis(p, a, L, side) + '" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.2" stroke-linecap="round" pointer-events="none"/></g>';
      var t = a * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t), lr = WLMAX + 16, lv = WLMAX * WCURL * side;
      /* rótulo na ponta da pena inteira, puxado para fora da asa: as pontas descem em escada até a auréola */
      var x = p.x + lr * cs - lv * sn + side * 4, y = p.y + lr * sn + lv * cs + 6, anc = side > 0 ? 'start' : 'end';
      labels += '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anc + '">' + esc(G[gi].sh || G[gi].k) +
        '<tspan class="v" x="' + x.toFixed(1) + '" dy="1.12em">' + fmtP(v) + '</tspan></text>';
    }
    /* coberteiras: três fileiras de penas curtas ao longo do braço, as de cima menores, por cima das raízes */
    [[0.92, 0.5, 0.22], [0.96, 0.32, 0.26], [1.0, 0.18, 0.30]].forEach(function (fil, r) {
      for (var c = 0; c <= 12; c++) {
        var tc = 0.02 + c * (fil[0] - 0.02) / 12, ac = wLerp(112, 26, tc), pc = wArm(side, tc), off = 6 + r * 4;
        pc = { x: pc.x - side * off * 0.2, y: pc.y + off * (2 - r) * 0.6 };
        cob += pluma(pc, dir(ac), (48 + 26 * Math.sin(tc * 2.6)) * (fil[1] + 0.5), side, 0.3, fil[2]);
      }
    });
    /* o braço da asa, em filete dourado */
    var d = 'M' + [0, 0.2, 0.4, 0.6, 0.8, 1].map(function (tt) { var q = wArm(side, tt); return q.x.toFixed(1) + ' ' + q.y.toFixed(1); }).join('L');
    bracos += '<path d="' + d + '" fill="none" style="stroke:rgba(var(--gold2-rgb),.9)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
  });
  o += '<g pointer-events="none">' + enfeite + '</g>' + voo + '<g pointer-events="none">' + cob + bracos + '</g>' + labels +
    '<circle cx="' + WCX + '" cy="' + WCY + '" r="58" style="fill:var(--deep);stroke:var(--gold)" stroke-width="2"/>' +
    '<circle cx="' + WCX + '" cy="' + WCY + '" r="66" fill="none" style="stroke:var(--gold)" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 9.17" opacity=".8"/>' +
    '<circle cx="' + WCX + '" cy="' + WCY + '" r="51" fill="none" style="stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>' +
    '<text class="ctr-n' + ctrLongo(st) + '" x="' + WCX + '" y="' + (WCY + 12) + '" text-anchor="middle">' + fmtP(st.total) + '</text>' +
    '<text class="ctr-l" x="' + WCX + '" y="' + (WCY + 32) + '" text-anchor="middle">pontos</text></svg>';
  return o;
}
/* tumbas do Cortejo Fúnebre: um cemitério à noite. Cada lápide é um agrupamento e sobe da cova em proporção direta à
   soma das notas: a altura é a medida, como numa barra, e o contorno tracejado é a lápide inteira, o teto possível. A
   lua cheia guarda o placar, a cripta fica embaixo dela, e a lápide mais alta ganha a chama fria da Wilhelt. */
var TB_TILT = [-4, 3, -2, 5, -3, 2, -5, 4];
function tbPedra(x, y, h, w) {
  var r = w / 2;
  return 'M' + (x - r) + ' ' + y + 'L' + (x - r) + ' ' + (y - h + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + (y - h + r) + 'L' + (x + r) + ' ' + y + 'Z';
}
function tbChao(y, amp, fase, aberto) {
  /* o chão: a borda de cima ondula; fechado para o preenchimento, aberto para o filete */
  var d = 'M0 ' + y;
  for (var x = 0; x < 680; x += 40) d += 'Q' + (x + 20) + ' ' + (y - amp * Math.sin((x + fase) / 57)).toFixed(1) + ' ' + (x + 40) + ' ' + (y + amp * 0.4 * Math.cos((x + fase) / 41)).toFixed(1);
  return aberto ? d : d + 'L680 ' + (y + 70) + 'L0 ' + (y + 70) + 'Z';
}
/* tumbas do 02. Zumbis: variação R (Cemitério noturno) do rebranding, escolhida pelo dono em 20/10/2026 */
function tumbasSvg(st) {
  /* 02. Zumbis, rebranding segunda rodada, variação R (realismo). O cemitério aprovado, mesma composição e mesma medida:
     a lápide sobe da cova em proporção direta à soma (mínimo de 12% da altura); o contorno tracejado é a lápide inteira.
     Feito como foto noturna: granito de verdade (grão, manchas de tempo, líquen, musgo no pé, lasca e trinca), a cruz e o
     epitáfio cinzelados, a espessura da laje e a sombra no chão, a terra revolvida onde a pedra rompeu o solo, árvores
     mortas na névoa e uma lua de sangue (eclipse) atrás da cripta, escura o bastante para o placar ler por cima.
     Sem cor de critério: o rótulo identifica. A única luz própria é a vela de cemitério, no vidro vermelho, ao pé da
     lápide mais alta. */
  var n = NG, back = n > 8 ? 4 : Math.floor(n / 2), max = 1, best = 0, i, H0 = 118, SW = 62, yB = 214, yF = 382, MX = 340;
  for (i = 0; i < n; i++) { max = Math.max(max, st.grp[i].pts); if (st.grp[i].pts > st.grp[best].pts) best = i; }
  if (MAXFIX) max = MAXFIX;
  var esq = Math.ceil(back / 2), dir = back - esq, pos = [];
  for (i = 0; i < esq; i++) pos.push({ x: esq === 1 ? 140 : 62 + i * (190 - 62) / (esq - 1), y: yB });
  for (i = 0; i < dir; i++) pos.push({ x: dir === 1 ? 540 : 490 + i * (618 - 490) / (dir - 1), y: yB });
  var front = n - back;
  for (i = 0; i < front; i++) pos.push({ x: front === 1 ? 340 : 92 + i * (588 - 92) / (front - 1), y: yF });
  function F(v) { return (+v).toFixed(1); }
  var S = KIT.sorte; S(11);
  /* três desenhos de lápide (arco, ogiva e ombros), todos com a altura inteira h e a base em y */
  var TIPO = [0, 1, 2, 0, 2, 1, 0, 2, 1, 0], TOM = ['#5d6163', '#53585a', '#64615c', '#585c60', '#4f5452', '#605e59', '#565b5d', '#5e5e5a', '#525756', '#5a5d5f'];
  function forma(x, y, h, w, tipo) {
    var r = w / 2;
    if (tipo === 1) return 'M' + F(x - r) + ' ' + y + 'L' + F(x - r) + ' ' + F(y - h + r * 1.05) + 'Q' + F(x - r) + ' ' + F(y - h + r * 0.3) + ' ' + x + ' ' + F(y - h) +
      'Q' + F(x + r) + ' ' + F(y - h + r * 0.3) + ' ' + F(x + r) + ' ' + F(y - h + r * 1.05) + 'L' + F(x + r) + ' ' + y + 'Z';
    if (tipo === 2) { var a = r * 0.64; return 'M' + F(x - r) + ' ' + y + 'L' + F(x - r) + ' ' + F(y - h + 20) + 'Q' + F(x - r) + ' ' + F(y - h + 13) + ' ' + F(x - r + 6) + ' ' + F(y - h + 13) +
      'L' + F(x - a) + ' ' + F(y - h + 13) + 'A' + F(a) + ' 13 0 0 1 ' + F(x + a) + ' ' + F(y - h + 13) + 'L' + F(x + r - 6) + ' ' + F(y - h + 13) +
      'Q' + F(x + r) + ' ' + F(y - h + 13) + ' ' + F(x + r) + ' ' + F(y - h + 20) + 'L' + F(x + r) + ' ' + y + 'Z'; }
    return 'M' + F(x - r) + ' ' + y + 'L' + F(x - r) + ' ' + F(y - h + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + F(x + r) + ' ' + F(y - h + r) + 'L' + F(x + r) + ' ' + y + 'Z';
  }
  var o = '<svg class="tumbas-svg" viewBox="0 14 680 436" role="group" aria-label="Cemitério com ' + NUM[n] + ' lápides, uma por critério, e a pontuação total na lua"><defs>' +
    /* céu: escuro no alto, a névoa clareando no horizonte; a lua de sangue com o brilho baixo da atmosfera em volta */
    '<linearGradient id="tbCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1015" stop-opacity="0"/><stop offset=".6" stop-color="#1c2328" stop-opacity=".55"/><stop offset="1" stop-color="#2c3336" stop-opacity=".8"/></linearGradient>' +
    '<radialGradient id="tbCorona" cx="340" cy="72" r="150" gradientUnits="userSpaceOnUse"><stop offset=".28" stop-color="#7a3a2a" stop-opacity=".30"/><stop offset=".5" stop-color="#4a2a26" stop-opacity=".12"/><stop offset="1" stop-color="#2a2226" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="tbLua" cx=".34" cy=".3" r=".8"><stop offset="0" stop-color="#93503a"/><stop offset=".4" stop-color="#65301f"/><stop offset=".8" stop-color="#3a1813"/><stop offset="1" stop-color="#26100c"/></radialGradient>' +
    /* granito: grão escuro e claro, e manchas de tempo em escala maior */
    '<filter id="tbGr" x="0" y="0" width="100%" height="100%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="1.25" numOctaves="2" seed="5" result="n"/>' +
    '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .05  0 0 0 0 .05  0 0 0 0 .06  3 0 0 0 -1.85" result="dk"/>' +
    '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .86  0 0 0 0 .87  0 0 0 0 .85  -2 0 0 0 .6" result="lt"/>' +
    '<feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="9" result="m"/>' +
    '<feColorMatrix in="m" type="matrix" values="0 0 0 0 .12  0 0 0 0 .11  0 0 0 0 .08  2.4 0 0 0 -1.05" result="mc"/>' +
    '<feMerge result="t"><feMergeNode in="mc"/><feMergeNode in="dk"/><feMergeNode in="lt"/></feMerge>' +
    '<feComposite in="t" in2="SourceGraphic" operator="in" result="ti"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="ti"/></feMerge></filter>' +
    /* terra: grão grosso */
    '<filter id="tbTerra" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .5" numOctaves="2" seed="3" result="n"/>' +
    '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .2  0 0 0 0 .22  0 0 0 0 .21  -2 0 0 0 .66" result="lt"/><feComposite in="lt" in2="SourceGraphic" operator="in" result="ti"/>' +
    '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="ti"/></feMerge></filter>' +
    '<filter id="tbBorra" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="2.4"/></filter>' +
    '<filter id="tbNevoa" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>' +
    /* luz da lua (atrás e no alto): a borda de cima da pedra clareia, o pé escurece; e o lado que olha para a lua */
    '<linearGradient id="tbV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe6ea" stop-opacity=".16"/><stop offset=".22" stop-color="#fff" stop-opacity=".03"/><stop offset=".62" stop-color="#000" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></linearGradient>' +
    '<linearGradient id="tbLR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset=".5" stop-color="#000" stop-opacity=".05"/><stop offset=".86" stop-color="#d8e2e8" stop-opacity=".08"/><stop offset="1" stop-color="#d8e2e8" stop-opacity=".24"/></linearGradient>' +
    '<linearGradient id="tbLL" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset=".5" stop-color="#000" stop-opacity=".05"/><stop offset=".86" stop-color="#d8e2e8" stop-opacity=".08"/><stop offset="1" stop-color="#d8e2e8" stop-opacity=".24"/></linearGradient>' +
    '<linearGradient id="tbEsc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0d0e" stop-opacity=".45"/><stop offset="1" stop-color="#0b0d0e" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="tbMusgo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#26301c" stop-opacity=".9"/><stop offset=".5" stop-color="#3a4628" stop-opacity=".45"/><stop offset="1" stop-color="#3a4628" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="tbChao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20272a"/><stop offset=".25" stop-color="#151b1e"/><stop offset="1" stop-color="#0c1012"/></linearGradient>' +
    /* vela de cemitério: a chama e a luz quente que ela joga */
    '<radialGradient id="tbChama" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#fffbe8"/><stop offset=".35" stop-color="#ffd27a"/><stop offset=".75" stop-color="#e8782a"/><stop offset="1" stop-color="#b8401a" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="tbVidro" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ff9a5a"/><stop offset=".45" stop-color="#c8321e"/><stop offset="1" stop-color="#4a0c08"/></radialGradient>';
  for (i = 0; i < n; i++) {
    o += '<clipPath id="cova' + i + '"><rect x="' + (pos[i].x - 70) + '" y="' + (pos[i].y - H0 - 40) + '" width="140" height="' + (H0 + 40) + '"/></clipPath>' +
      '<clipPath id="tbS' + i + '"><path d="' + forma(pos[i].x, pos[i].y, H0, SW, TIPO[i % 10]) + '"/></clipPath>';
  }
  o += '</defs><rect x="0" y="14" width="680" height="' + (yB - 14 + 8) + '" fill="url(#tbCeu)"/><rect x="0" y="14" width="680" height="300" fill="url(#tbCorona)"/>';
  /* árvores mortas na névoa, nas pontas */
  var galho = function (x, y, a, L, w, prof) {
    if (prof > 4 || L < 6) return '';
    var t = a * Math.PI / 180, x2 = x + L * Math.cos(t), y2 = y + L * Math.sin(t), mx = (x + x2) / 2 + (S() - 0.5) * L * 0.3, my = (y + y2) / 2 + (S() - 0.5) * L * 0.2;
    var s = '<path d="M' + F(x) + ' ' + F(y) + 'Q' + F(mx) + ' ' + F(my) + ' ' + F(x2) + ' ' + F(y2) + '" stroke-width="' + F(w) + '"/>';
    var k = prof < 1 ? 3 : 2;
    for (var j = 0; j < k; j++) s += galho(x2, y2, a + (j - (k - 1) / 2) * (28 + S() * 22) + (S() - 0.5) * 14, L * (0.62 + S() * 0.16), w * 0.62, prof + 1);
    return s;
  };
  o += '<g style="fill:none;stroke:#080b0d" stroke-linecap="round" opacity=".9" pointer-events="none">' + galho(18, yB + 4, -84, 66, 7, 0) + galho(664, yB + 4, -97, 58, 6, 0) + '</g>';
  /* a lua de sangue: mares escuros, poucas crateras, um fiapo de nuvem no alto e outro embaixo do placar */
  var mar = '';
  [[326, 58, 15, 10], [356, 64, 11, 8], [344, 90, 13, 6], [318, 82, 7, 9], [366, 86, 6, 5]].forEach(function (m) { mar += '<ellipse cx="' + m[0] + '" cy="' + m[1] + '" rx="' + m[2] + '" ry="' + m[3] + '"/>'; });
  o += '<circle cx="340" cy="72" r="46" fill="url(#tbLua)"/>' +
    '<g fill="#1a0806" opacity=".35" filter="url(#tbBorra)">' + mar + '</g>' +
    '<circle cx="340" cy="72" r="46" fill="#7a3a2a" opacity=".5" filter="url(#tbTerra)" style="mix-blend-mode:multiply"/>' +
    '<circle cx="340" cy="72" r="45.4" fill="none" stroke="#b0644a" stroke-opacity=".22" stroke-width="1.2"/>' +
    '<ellipse cx="318" cy="34" rx="60" ry="7" fill="#151b20" opacity=".7" filter="url(#tbNevoa)"/>' +
    '<ellipse cx="362" cy="118" rx="70" ry="8" fill="#151b20" opacity=".8" filter="url(#tbNevoa)"/>' +
    '<text class="ctr-n' + ctrLongo(st) + '" x="340" y="83" text-anchor="middle">' + fmtP(st.total) + '</text><text class="ctr-l" x="340" y="101" text-anchor="middle">pontos</text>';
  /* a cripta: blocos de granito, frontão, pilastras, degrau e o portão de ferro entreaberto; em contraluz */
  var junta = '';
  for (var jy = 158; jy < 214; jy += 11) { junta += 'M283 ' + jy + 'H397'; for (var jx = 283 + ((jy / 11) % 2 ? 0 : 14); jx < 397; jx += 28) junta += 'M' + jx + ' ' + jy + 'v11'; }
  o += '<g class="cripta" pointer-events="none">' +
    '<path d="M282 214V146H398V214Z" fill="#2c3134" filter="url(#tbGr)"/><path d="M282 214V146H398V214Z" fill="url(#tbV)"/>' +
    '<path d="' + junta + '" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>' +
    '<path d="M268 150L340 120L412 150Z" fill="#2e3336" filter="url(#tbGr)"/><path d="M268 150L340 120L412 150Z" fill="#000" fill-opacity=".25"/>' +
    '<path d="M268 150L340 120L412 150" fill="none" stroke="#a7b0b4" stroke-opacity=".35" stroke-width="1.1"/>' +
    '<path d="M266 150H414V156H266Z" fill="#2c3133"/><path d="M266 150H414" stroke="#9aa2a6" stroke-opacity=".3" stroke-width="1"/>' +
    '<path d="M286 156H300V214H286ZM380 156H394V214H380Z" fill="#363b3e" filter="url(#tbGr)"/><path d="M286 156H300V214H286ZM380 156H394V214H380Z" fill="url(#tbLR)"/>' +
    '<path d="M320 214V184A20 20 0 0 1 360 184V214Z" fill="#050607"/>' +
    '<path d="M322 214V185A18 18 0 0 1 340 167V214Z" fill="none" stroke="#1d2224" stroke-width="2.2"/><path d="M327 214V180M333 214V171" stroke="#22282a" stroke-width="1.6"/>' +
    '<path d="M322 194H340" stroke="#22282a" stroke-width="1.4"/>' +
    '<path d="M336 122V105M329.5 111H342.5" fill="none" stroke="#2b3032" stroke-width="3.4" stroke-linecap="square"/><path d="M336 122V105M329.5 111H342.5" fill="none" stroke="#8d969a" stroke-opacity=".4" stroke-width="1" transform="translate(-.8 -.6)"/></g>';
  var fileira = function (de, ate) {
    var s = '', lb = '', ch = '';
    for (var i = de; i < ate; i++) {
      var p = pos[i], v = st.grp[i].pts, fr = Math.max(0, v) / max, h = H0 * Math.max(fr, 0.12), t = TB_TILT[i % 8], topo = i === best, tp = TIPO[i % 10];
      var lado = p.x < MX ? 1 : -1, rot = 'rotate(' + t + ' ' + p.x + ' ' + p.y + ')', full = forma(p.x, p.y, H0, SW, tp), x = p.x, y = p.y, top = y - H0;
      S(100 + i);
      /* líquen, trinca, lasca e epitáfio desta pedra (sorteio fixo) */
      var liq = '';
      for (var k = 0; k < 4; k++) {
        var lx = x + (S() - 0.5) * (SW - 10), ly = top + 14 + S() * (H0 - 30);
        for (var q = 0; q < 7; q++) liq += '<circle cx="' + F(lx + (S() - 0.5) * 10) + '" cy="' + F(ly + (S() - 0.5) * 7) + '" r="' + F(0.6 + S() * 1.6) + '"/>';
      }
      var esc2 = '';
      for (k = 0; k < 5; k++) esc2 += '<rect x="' + F(x + (S() - 0.5) * (SW - 12)) + '" y="' + (top + 2) + '" width="' + F(4 + S() * 7) + '" height="' + F(30 + S() * 50) + '" rx="3"/>';
      var cx0 = x + (S() > 0.5 ? 1 : -1) * (8 + S() * 14), tr = 'M' + F(cx0) + ' ' + F(top + (tp === 2 ? 2 : 6) + S() * 4);
      for (k = 1; k < 5; k++) tr += 'L' + F(cx0 + (S() - 0.5) * 9) + ' ' + F(top + 8 + k * (10 + S() * 8));
      var ep = '';
      for (k = 0; k < 3; k++) { var ew = (k === 0 ? 30 : 16 + S() * 16) / 2; ep += 'M' + F(x - ew) + ' ' + (top + 70 + k * 8) + 'H' + F(x + ew); }
      var cruz = 'M' + x + ' ' + (top + 24) + 'V' + (top + 58) + 'M' + (x - 11) + ' ' + (top + 34) + 'H' + (x + 11);
      var lasca = lado > 0 ? 'M' + F(x - SW / 2) + ' ' + F(top + SW / 2 + 6) + 'l7 -3 1 8 -8 4z' : 'M' + F(x + SW / 2) + ' ' + F(top + SW / 2 + 6) + 'l-7 -3 -1 8 8 4z';
      var luzVela = '';
      if (topo) luzVela = '<radialGradient id="tbVl" gradientUnits="userSpaceOnUse" cx="' + (x + 20) + '" cy="' + F(y - 14 - (H0 - h)) + '" r="54"><stop offset="0" stop-color="#ffb060" stop-opacity=".42"/><stop offset=".5" stop-color="#e0702a" stop-opacity=".12"/><stop offset="1" stop-color="#e0702a" stop-opacity="0"/></radialGradient>';
      s += '<g class="lapide' + (topo ? ' topo' : '') + '" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + full + '" transform="' + rot + '" style="fill:none;stroke:rgba(var(--bone-rgb,228,220,200),.22)" stroke-width="1.2" stroke-dasharray="4 5"/>' +
        '<g clip-path="url(#cova' + i + ')"><g class="sobe" transform="translate(0 ' + F(H0 - h) + ')"><g><g transform="' + rot + '">' + luzVela +
        /* a espessura da laje, do lado oposto à lua */
        '<path d="' + full + '" fill="#202426" transform="translate(' + (-lado * 4) + ' 1.5)"/>' +
        '<path class="fill" d="' + full + '" fill="' + TOM[i % 10] + '" filter="url(#tbGr)"/>' +
        '<g clip-path="url(#tbS' + i + ')" pointer-events="none">' +
        '<path d="' + full + '" fill="url(#tbV)"/><path d="' + full + '" fill="url(#' + (lado > 0 ? 'tbLR' : 'tbLL') + ')"/>' +
        '<g fill="url(#tbEsc)" filter="url(#tbBorra)">' + esc2 + '</g>' + '<g fill="#8d9668" opacity=".26">' + liq + '</g>' +
        '<rect x="' + (x - SW / 2) + '" y="' + (y - 34) + '" width="' + SW + '" height="34" fill="url(#tbMusgo)"/>' +
        '<path d="' + cruz + '" fill="none" stroke="#0a0c0d" stroke-opacity=".62" stroke-width="4.4" stroke-linecap="round"/>' +
        '<path d="' + cruz + '" fill="none" stroke="#e6ecef" stroke-opacity=".17" stroke-width="1.1" stroke-linecap="round" transform="translate(.9 1.6)"/>' +
        '<path d="' + ep + '" fill="none" stroke="#0a0c0d" stroke-opacity=".42" stroke-width="1.7" stroke-linecap="round"/>' +
        '<path d="' + ep + '" fill="none" stroke="#e6ecef" stroke-opacity=".1" stroke-width=".8" transform="translate(0 1.2)"/>' +
        '<path d="' + tr + '" fill="none" stroke="#0a0c0d" stroke-opacity=".6" stroke-width=".9" stroke-linejoin="bevel"/>' +
        '<path d="' + lasca + '" fill="#000" fill-opacity=".3"/>' +
        (topo ? '<path d="' + full + '" fill="url(#tbVl)"/>' : '') +
        '</g>' +
        '<path d="' + full + '" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="1" pointer-events="none"/>' +
        '</g></g></g></g></g>';
      /* no chão: a sombra da laje e a terra revolvida onde a pedra rompeu o solo */
      ch += '<ellipse cx="' + F(x - lado * 3) + '" cy="' + (y + 4) + '" rx="' + (SW / 2 + 9) + '" ry="5" fill="#000" opacity=".55" filter="url(#tbBorra)"/>';
      S(300 + i);
      for (k = 0; k < 9; k++) {
        var tx = x + (S() - 0.5) * (SW + 18), ty = y + 1 + S() * 5, tw = 2.5 + S() * 5, th = 1.6 + S() * 2.6;
        ch += '<path d="M' + F(tx - tw) + ' ' + F(ty) + 'Q' + F(tx - tw * 0.7) + ' ' + F(ty - th * 1.6) + ' ' + F(tx) + ' ' + F(ty - th * 1.8) + 'Q' + F(tx + tw * 0.8) + ' ' + F(ty - th * 1.4) + ' ' + F(tx + tw) + ' ' + F(ty) + 'Z" fill="#2a2724"/>' +
          '<path d="M' + F(tx - tw * 0.6) + ' ' + F(ty - th * 1.2) + 'Q' + F(tx) + ' ' + F(ty - th * 2) + ' ' + F(tx + tw * 0.5) + ' ' + F(ty - th * 1.3) + '" fill="none" stroke="#6a6660" stroke-opacity=".5" stroke-width=".8"/>';
      }
      if (topo) {
        /* vela de cemitério no vidro vermelho, ao pé da lápide mais alta: a única luz própria da cena */
        var vx = x + 20, vy = y + 3;
        ch += '<ellipse cx="' + vx + '" cy="' + (vy - 8) + '" rx="30" ry="18" fill="#ff9a4a" opacity=".10" filter="url(#tbNevoa)"/>' +
          '<ellipse cx="' + vx + '" cy="' + (vy + 1) + '" rx="9" ry="2.4" fill="#000" opacity=".6"/>' +
          '<path d="M' + (vx - 5) + ' ' + vy + 'L' + (vx - 5.6) + ' ' + (vy - 12) + 'H' + (vx + 5.6) + 'L' + (vx + 5) + ' ' + vy + 'Z" fill="url(#tbVidro)"/>' +
          '<path d="M' + (vx - 5.6) + ' ' + (vy - 12) + 'H' + (vx + 5.6) + 'V' + (vy - 14) + 'H' + (vx - 5.6) + 'Z" fill="#2a2a28"/>' +
          '<path d="M' + (vx - 3.4) + ' ' + (vy - 10) + 'V' + (vy - 2) + '" stroke="#fff" stroke-opacity=".35" stroke-width=".9"/>' +
          '<path d="M' + vx + ' ' + (vy - 24) + 'C' + (vx + 2.6) + ' ' + (vy - 19) + ' ' + (vx + 3) + ' ' + (vy - 16) + ' ' + vx + ' ' + (vy - 14) + 'C' + (vx - 3) + ' ' + (vy - 16) + ' ' + (vx - 2.4) + ' ' + (vy - 19) + ' ' + vx + ' ' + (vy - 24) + 'Z" fill="url(#tbChama)"/>';
      }
      lb += '<text x="' + p.x + '" y="' + (p.y + 24) + '" text-anchor="middle">' + esc(G[i].sh || G[i].k) + '<tspan class="v" x="' + p.x + '" dy="1.12em">' + fmtP(LB(i, v)) + FX(i) + '</tspan></text>';
    }
    return { s: s, lb: lb, ch: ch };
  };
  var tras = fileira(0, back), frente = fileira(back, n);
  var chao = function (y, f) {
    var capim = '';
    S(500 + y);
    for (var cx = 2; cx < 680; cx += 3 + S() * 4) {
      var cy = y - 5 * Math.sin((cx + f) / 57) * 0.9 + 1, hh = 2 + S() * 6;
      capim += 'M' + F(cx) + ' ' + F(cy) + 'q' + F((S() - 0.3) * 2) + ' ' + F(-hh * 0.6) + ' ' + F((S() - 0.4) * 4) + ' ' + F(-hh);
    }
    return '<path d="' + tbChao(y, 5, f) + '" fill="url(#tbChao)" pointer-events="none"/>' +
      '<path d="' + tbChao(y, 5, f) + '" fill="#1a2022" opacity=".6" filter="url(#tbTerra)" pointer-events="none"/>' +
      '<path d="' + capim + '" fill="none" stroke="#3b4436" stroke-opacity=".75" stroke-width=".9" stroke-linecap="round" pointer-events="none"/>';
  };
  var nevoa = function (y) {
    S(700 + y);
    var s = '<g fill="#c9ced0" filter="url(#tbNevoa)" pointer-events="none">';
    for (var k = 0; k < 6; k++) s += '<ellipse cx="' + F(40 + k * 120 + (S() - 0.5) * 60) + '" cy="' + F(y - 4 + (S() - 0.5) * 8) + '" rx="' + F(70 + S() * 50) + '" ry="' + F(7 + S() * 5) + '" opacity="' + F(0.05 + S() * 0.05) + '"/>';
    return s + '</g>';
  };
  o += tras.s + chao(yB, 13) + tras.ch + nevoa(yB) + tras.lb +
    frente.s + chao(yF, 71) + frente.ch + nevoa(yF) + frente.lb + '</svg>';
  return o;
}

/* motivos votados pelo dono (15/10/2026): o desenho vem de motor/painel/motivos/<grafico>.js, que o build põe só no painel
   que o usa (MOTIVO_PAINEL = {defs, stage, group, center}). Aqui fica a moldura: rótulos, placar e o clique em cada agrupamento. */
function motivoSvg(st, m) {
  var R = 184, r0 = 60, step = 360 / NG, gap = 2.4, max = 1, i, uidN = 0;
  for (i = 0; i < NG; i++) max = Math.max(max, st.grp[i].pts);
  if (MAXFIX) max = MAXFIX;
  var groups = [];
  for (i = 0; i < NG; i++) {
    var v = st.grp[i].pts;
    groups.push({ i: i, n: G[i].sh || G[i].k, v: LB(i, v), frac: Math.min(1, Math.max(0, v) / max), a0: -90 + i * step + gap, a1: -90 + (i + 1) * step - gap, am: -90 + (i + 0.5) * step,
      top: v === max, near: v >= 0.85 * max, cor: 'rgb(var(--g' + i + '))', rgba: (function (k) { return function (a) { return 'rgba(var(--g' + k + '),' + a + ')'; }; })(i) });
  }
  function polA(r, a) { var t = a * Math.PI / 180; return [230 + r * Math.cos(t), 230 + r * Math.sin(t)]; }
  var ctx = { NG: NG, step: step, gap: gap, max: max, R: R, r0: r0, CX: 230, CY: 230, total: st.total, groups: groups, pol: polA, esc: esc,
    P: function (r, a) { var p = polA(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }, f1: function (n) { return (+n).toFixed(1); },
    uid: function (p) { return (p || 'u') + 'm' + (++uidN); }, kit: KIT };
  var o = '<svg class="motivo" viewBox="-58 -2 576 464" role="group" aria-label="Gráfico dos ' + NUM[NG] + ' agrupamentos, com a pontuação total no centro"><defs>' + (m.defs ? m.defs(ctx) : '') + '</defs>';
  var faixa = '';
  FAIXA_VIS = false;
  if (MAXFIX && m.raio) {
    // regra C: em cada critério, a faixa da régua (do mínimo ao máximo) como área clara e o máximo como traço
    groups.forEach(function (g) {
      var f = G[g.i].ref; if (!f) return;
      var ra = m.raio(f[0] / (FOLGA * f[1])), rb = m.raio(1 / FOLGA), p = ctx.P;
      faixa += '<path d="M' + p(ra, g.a0) + 'A' + ra.toFixed(1) + ' ' + ra.toFixed(1) + ' 0 0 1 ' + p(ra, g.a1) + 'L' + p(rb, g.a1) + 'A' + rb.toFixed(1) + ' ' + rb.toFixed(1) + ' 0 0 0 ' + p(rb, g.a0) + 'Z" class="fx-band"/>' +
        '<path d="M' + p(rb, g.a0) + 'A' + rb.toFixed(1) + ' ' + rb.toFixed(1) + ' 0 0 1 ' + p(rb, g.a1) + '" class="fx-max"/>';
    });
    FAIXA_VIS = !!faixa;
  }
  o += m.stage ? m.stage(ctx) : '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.4)" stroke-width="1.2"/>';
  o += faixa;
  groups.forEach(function (g) {
    o += '<g class="wedge" style="--i:' + g.i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + g.i + '" aria-label="' + esc(G[g.i].k) + ': ' + fmtP(g.v) + ' pontos. Abrir no tabelão.">' +
      '<title>' + esc(G[g.i].k) + ': ' + fmtP(g.v) + ' pontos, ' + (MAXFIX && G[g.i].ref ? st.grp[g.i].hard + ' com nota 2 ou 3, faixa ' + G[g.i].ref[0] + ' a ' + G[g.i].ref[1] : pl(st.grp[g.i].hard + st.grp[g.i].soft, 'carta', 'cartas')) + '</title>' + m.group(g, ctx) + '</g>';
  });
  o += m.center ? m.center(ctx) : '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>';
  groups.forEach(function (g) { o += gLabel(g.i, g.am, R, g.v); });
  return o + '<text class="ctr-n' + ctrLongo(st) + '" x="230" y="243" text-anchor="middle">' + fmtP(st.total) + '</text>' +
    '<text class="ctr-l" x="230" y="260" text-anchor="middle">pontos</text></svg>';
}
/* v3: o gráfico da página inicial desenha os dez critérios. As funções de gráfico leem G, NG e st.grp; durante o desenho
   eles passam a ser os critérios, e o clique de cada peça abre a aba Critérios em vez do tabelão. */
function chartHero(st) {
  if (!V3) return chartSvg(st);
  var g0 = G, n0 = NG, s0 = st.grp, o;
  G = CR; NG = NC;
  st.grp = st.c3.map(function (x, i) {
    var f = CR[i].ref ? Math.min(1, x.hard / (FOLGA * CR[i].ref[1])) : 0;
    return { hard: x.hard, soft: x.soft, pts: Math.round(f * 1000) / 10 };
  });
  LAB = st.c3.map(function (x) { return x.pts; }); MAXFIX = 100;
  FXS = st.c3.map(function (x, i) { var f = CR[i].ref; return !f ? '' : x.hard > f[1] ? 'a' : x.hard < f[0] ? 'b' : ''; });
  try { o = chartSvg(st); } finally { G = g0; NG = n0; st.grp = s0; LAB = null; MAXFIX = null; FXS = null; }
  return o.replace(/data-act="filter-group"/g, 'data-act="ver-crit"').replace(/Abrir no tabelão\./g, 'Abrir na aba Critérios.')
    .replace(/agrupamentos, com a pontuação/g, 'critérios, com o placar');
}
/* cores dos critérios no gráfico da página inicial (as variáveis --gN da página são as dos agrupamentos) */
function crVars() { return V3 ? ' style="' + CR.map(function (g, i) { return '--g' + i + ':' + g.cor; }).join(';') + '"' : ''; }
/* a legenda do gráfico fala de critério e pontos na v3 */
function legV3(t, peca, masc) {
  if (!V3) return t;
  return 'Cada ' + peca + ' é um critério. O tamanho mostra as cartas com nota 2 ou 3 contra a faixa da régua' +
    (FAIXA_VIS ? ': a área clara é a faixa, o traço marca o máximo dela, e ' + (masc ? 'cheio' : 'cheia') + ' quer dizer 1,5 vez o máximo.' : ', e ' + (masc ? 'cheio' : 'cheia') + ' quer dizer 1,5 vez o máximo.') +
    ' O número ao lado é o ponto real do critério; ▲ quer dizer acima da faixa, ▼ abaixo. Toque ' + (masc ? 'num ' : 'numa ') + peca + ' para abrir na aba Critérios.';
}
function chartSvg(st) {
  if (typeof MOTIVO_PAINEL === 'object' && MOTIVO_PAINEL) return motivoSvg(st, MOTIVO_PAINEL);
  if (M.grafico === 'asas' && NG === 8) return wingsSvg(st);
  if (M.grafico === 'tumbas' && NG >= 4 && NG <= 10) return tumbasSvg(st);
  var fios = M.grafico === 'fios', chamas = M.grafico === 'chamas', band = M.grafico === 'estandartes', pin = M.grafico === 'alfinetes', reb = M.grafico === 'rebites', esp = M.grafico === 'espinhos', fang = M.grafico === 'presas', crown = M.grafico === 'coroa', vial = M.grafico === 'frascos', runa = M.grafico === 'runas', casco = M.grafico === 'cascos', leque = M.grafico === 'leque', lua = M.grafico === 'luas', raio = M.grafico === 'raios', balao = M.grafico === 'baloes', tranca = M.grafico === 'trancas', folha = M.grafico === 'folhas', ovo = M.grafico === 'ovos', fenda = M.grafico === 'fendas', moeda = M.grafico === 'moedas', mao = M.grafico === 'maos', gear = M.grafico === 'engrenagens', perg = M.grafico === 'pergaminhos', lun = M.grafico === 'lunetas', torre = M.grafico === 'torres', meteor = M.grafico === 'meteoros', horde = M.grafico === 'canhoes', rosa = M.grafico === 'rosacea' || chamas, r0 = 60, R = 184, max = 1, i, step = 360 / NG, gap = rosa || fios || band || pin || reb || esp || fang || crown || vial || runa || casco || leque || lua || raio || balao || tranca || folha || ovo || fenda || moeda || mao || gear || perg || lun || torre || meteor || horde ? 2.4 : 1.2;
  // o ovo tem o mesmo tamanho em todos os agrupamentos: a, meio comprimento; b, a largura de desenho
  var eA = Math.min((R - r0) * 0.44, 58), eRc = r0 + (R - r0) * 0.52, eB = Math.min(eRc * Math.sin((step / 2 - gap) * Math.PI / 180) * 0.92 / 0.75, eA * 0.95), eCut = eA * 0.28;
  for (i = 0; i < NG; i++) max = Math.max(max, st.grp[i].pts);
  if (MAXFIX) max = MAXFIX;
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
  } else if (horde) {
    // o estouro: disco quente, um aro fino e um aro grosso tracejado, como a borda de uma explosão de gibi
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--gold-rgb),.10);stroke:rgba(var(--gold-rgb),.55)" stroke-width="1.6"/>' +
      '<circle cx="230" cy="230" r="' + (R + 17) + '" style="fill:none;stroke:rgba(var(--blood2-rgb),.75)" stroke-width="4" stroke-dasharray="12 6"/>';
  } else if (meteor) {
    // o céu em chamas: disco escuro, um aro fino e um aro de brasas
    o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:rgba(var(--deep-rgb),.62);stroke:rgba(var(--gold-rgb),.4)" stroke-width="1.3"/>' +
      '<circle cx="230" cy="230" r="' + (R + 16) + '" style="fill:none;stroke:rgba(var(--blood2-rgb),.6)" stroke-width="3" stroke-dasharray="0.1 9 0.1 5 0.1 13" stroke-linecap="round"/>';
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:rgba(var(--g' + i + '),.07);stroke:rgba(var(--gold-rgb),.35)" stroke-width="1"/>' +
        '<path class="fill" d="' + wedgePath(r0, r1, a0, a1) + '" fill="url(#rg' + i + ')" style="stroke:rgba(var(--gold2-rgb),.7)" stroke-width="1.1" stroke-linejoin="round"/>' + rv + '</g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (raio || balao || tranca) {
      var gTit = '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>', gAbre = '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' + gTit;
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + mp[0] + ' ' + mp[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' + coinStack(i, 8, mh, mW, false) +
        '<g class="fill">' + coinStack(i, mn, mh, mW, true) + (mv >= 0.94 ? flipCoinSvg(8 + 8 * (mh + 2.2) + 14, mW) : '') + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (horde) {
      // canhão: a carga de goblins enche da culatra até a boca em proporção direta à soma das notas (cheio em 100%, pela
      // metade em 50%); o mais cheio dispara um goblin em chamas
      var cnV = Math.max(0, v) / max, cnL = R - r0 - 38, cnP = pol(r0, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + cnP[0] + ' ' + cnP[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' +
        '<clipPath id="ccn' + i + '"><rect x="-20" y="-30" width="' + (14 + (cnL + 8) * cnV).toFixed(1) + '" height="60"/></clipPath>' +
        '<linearGradient id="cgn' + i + '" x1="0" x2="1"><stop offset="0" style="stop-color:rgb(var(--g' + i + '))"/><stop offset=".8" style="stop-color:rgb(var(--g' + i + '))"/><stop offset="1" style="stop-color:#fff3c4"/></linearGradient>' +
        '<g class="fill">' + cannonSvg(i, cnL, cnV, cnV >= 0.94) + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (meteor) {
      // meteoro: a cauda se estende em proporção direta à soma das notas; o comprimento inteiro fica tracejado,
      // e o maior ganha as faíscas
      var mtV = Math.max(0, v) / max, mtM = R - r0 - 40, mtL = v > 0 ? mtM * Math.max(0.06, mtV) : 0, mtR = 7 + 6 * mtV, mtP = pol(r0 + 20, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:transparent;stroke:none"/>' +
        '<g transform="translate(' + mtP[0] + ' ' + mtP[1] + ') rotate(' + am.toFixed(1) + ')" pointer-events="none">' +
        '<linearGradient id="mt' + i + '" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="' + (mtL + mtR).toFixed(1) + '" y2="0"><stop offset="0" style="stop-color:rgb(var(--g' + i + '))"/><stop offset="1" style="stop-color:rgba(var(--g' + i + '),0)"/></linearGradient>' +
        '<g class="fill">' + meteorSvg(i, mtM, mtL, mtR, mtV >= 0.94) + '</g></g></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (torre) {
      // torre: sobe em proporção direta à soma das notas, as janelas acendem com a altura;
      // o comprimento inteiro fica tracejado, e a mais alta ganha a águia
      var tv = Math.max(0, v) / max, tL = R - r0 - 36, tl0 = tL * Math.max(0.12, tv),
        tw = Math.min(22, 2 * (r0 + 8) * Math.sin((a1 - a0) / 2 * Math.PI / 180) * 0.8), tp = pol(r0, am).split(' ');
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="wedge" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
      o += '<g class="petal" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
        '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
        '<path class="ghost" d="' + wedgePath(r0, R, a0, a1) + '" style="fill:rgba(var(--g' + i + '),.05);stroke:rgba(var(--gold-rgb),.18)" stroke-width="1"/>' +
        '<path class="fill" d="' + wedgePath(r0, r1, a0, a1) + '" fill="url(#rg' + i + ')" style="opacity:.42"/>' +
        '<line x1="' + pol(r0 - 10, am).replace(' ', '" y1="') + '" x2="' + pol(r1, am).replace(' ', '" y2="') + '" style="stroke:var(--gold2)" stroke-width="2.2" stroke-linecap="round"/>' +
        '<circle cx="' + pol(r1, am).split(' ')[0] + '" cy="' + pol(r1, am).split(' ')[1] + '" r="12" style="fill:rgb(var(--g' + i + '));stroke:var(--gold2)" stroke-width="1.4"/>' +
        '<circle cx="' + pol(r1 + 4, am - 4).split(' ')[0] + '" cy="' + pol(r1 + 4, am - 4).split(' ')[1] + '" r="3.2" style="fill:rgba(255,255,255,.55)"/></g>';
      o += gLabel(i, am, R, v);
      continue;
    }
    if (fios) o += '<line x1="' + pol(r0 - 7, am).replace(' ', '" y1="') + '" x2="' + pol(R + 14, am).replace(' ', '" y2="') + '" style="stroke:rgba(var(--blood2-rgb),.3)" stroke-width=".7" stroke-dasharray="1 4"/>';
    o += '<g class="' + (rosa ? 'petal' : 'wedge') + '" style="--i:' + i + '" tabindex="0" role="button" data-act="filter-group" data-g="' + i + '" aria-label="' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos. Abrir no tabelão.">' +
      '<title>' + esc(G[i].k) + ': ' + fmtP(LB(i, v)) + ' pontos, ' + pl(st.grp[i].hard + st.grp[i].soft, 'carta', 'cartas') + '</title>' +
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
  } else if (horde) {
    // medalhão com a coroa do Krenko no alto
    o += '<circle cx="230" cy="230" r="' + (r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="2"/>' + krenkoCrown(230, 198, 1.7);
  } else if (meteor) {
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
    '<text class="ctr-n' + ctrLongo(st) + '" x="230" y="243" text-anchor="middle">' + fmtP(st.total) + '</text>' +
    '<text class="ctr-l" x="230" y="260" text-anchor="middle">pontos</text></svg>';
  return o;
}

/* ============ curva de mana ============ */
/* Desde 15/10/2026, uma curva só para todos os painéis (o "curva" do tema, ogiva ou barra, não é mais lido):
   barras de topo arredondado sobre um trilho apagado, os tipos (ou as cores) empilhados com uma fresta entre eles, sem contorno. */
function pill(x, w, base, top) {
  var r = Math.min(w / 2.6, 11, (base - top) / 1.6);
  return 'M' + x.toFixed(1) + ' ' + base + 'V' + (top + r).toFixed(1) + 'Q' + x.toFixed(1) + ' ' + top.toFixed(1) + ' ' + (x + r).toFixed(1) + ' ' + top.toFixed(1) +
    'H' + (x + w - r).toFixed(1) + 'Q' + (x + w).toFixed(1) + ' ' + top.toFixed(1) + ' ' + (x + w).toFixed(1) + ' ' + (top + r).toFixed(1) + 'V' + base + 'Z';
}
function curveSvg(st, mode) {
  var narrow = window.innerWidth < 700;
  var W = narrow ? 460 : 760, H = narrow ? 316 : 336, ml = narrow ? 4 : 12, mr = ml, mb = 56, mt = 52;
  var cw = (W - ml - mr) / 8, bw = cw * (narrow ? 0.64 : 0.54), base = H - mb, maxH = base - mt;
  var max = 1; st.curve.forEach(function (c) { max = Math.max(max, c.n); });
  var keys = mode === 'cor' ? COLS : TYPES.filter(function (t) { return t.k !== 'ter'; });
  var defs = '<linearGradient id="cvBrilho" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/>' +
    '<stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>', body = '';
  for (var g = 5; g < max; g += 5) {
    var gy = base - g / max * maxH;
    body += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + gy.toFixed(1) + '" y2="' + gy.toFixed(1) + '" style="stroke:rgba(var(--gold-rgb),.08)"/>';
  }
  st.curve.forEach(function (col, i) {
    var x = ml + i * cw + (cw - bw) / 2, cx = x + bw / 2, h = col.n / max * maxH, top = base - h;
    body += '<path d="' + pill(x, bw, base, mt) + '" style="fill:rgba(var(--gold-rgb),.05)"/>';
    if (col.n) {
      var y = base, segs = '';
      defs += '<clipPath id="lc' + i + '"><path d="' + pill(x, bw, base, top) + '"/></clipPath>';
      keys.forEach(function (k) {
        var v = (mode === 'cor' ? col.c : col.t)[k.k] || 0; if (!v) return;
        var sh = v / max * maxH; y -= sh;
        // fresta de 2 px no alto de cada fatia, menos na de cima e nas finas demais
        var gap = (y - top > 0.5 && sh > 6) ? 2 : 0;
        segs += '<rect x="' + x.toFixed(1) + '" y="' + (y + gap).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (sh - gap + 0.6).toFixed(1) + '" fill="' + k.c + '"><title>Custo ' + (i === 7 ? '7 ou mais' : i) + ', ' + esc(k.n) + ': ' + v + '</title></rect>';
      });
      body += '<g class="lanc" style="--i:' + i + '"><g clip-path="url(#lc' + i + ')">' + segs +
        '<rect x="' + x.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="url(#cvBrilho)" style="pointer-events:none"/></g></g>';
    }
    body += '<text class="n' + (col.n ? '' : ' z') + '" x="' + cx.toFixed(1) + '" y="' + ((col.n ? top : base) - 9).toFixed(1) + '" text-anchor="middle">' + col.n + '</text>' +
      '<text x="' + cx.toFixed(1) + '" y="' + (base + 23) + '" text-anchor="middle">' + (i === 7 ? '7+' : i) + '</text>';
  });
  var ax = ml + cw / 2 + Math.min(st.avg, 7) * cw;
  body = '<line x1="' + ax.toFixed(1) + '" x2="' + ax.toFixed(1) + '" y1="26" y2="' + (base + 4) + '" style="stroke:var(--gold2);stroke-opacity:.6" stroke-width="1.2" stroke-dasharray="2 4"/>' + body +
    '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + base + '" y2="' + base + '" style="stroke:rgba(var(--gold-rgb),.35)"/>' +
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
  // banida no Commander (legalidade do Scryfall): o build avisa e a leitura mostra; a decklist não muda sozinha
  var ban = D.banidas || [], bd = ban.filter(function (b) { return b.onde === 'deck'; }), br = ban.filter(function (b) { return b.onde === 'radar'; });
  if (ban.length) add('warn', pl(ban.length, 'carta banida', 'cartas banidas') + ' no Commander.',
    (bd.length ? 'No deck: ' + esc(bd.map(function (b) { return b.n; }).join(', ')) + '. ' : '') +
    (br.length ? 'No radar: ' + esc(br.map(function (b) { return b.n; }).join(', ')) + '. ' : '') + 'Pela lista oficial do formato, no Scryfall.');
  return r.join('');
}
function peak(st) { var m = 0, k = 0; st.curve.forEach(function (c, i) { if (c.n > m) { m = c.n; k = i; } }); return (k === 7 ? '7 ou mais' : k) + ' manas'; }

/* ============ visão geral ============ */
/* a conta da pontuação v3, escrita a partir da régua (motor/pontuacao.json) */
function comoV3() {
  var pn = RG.pontos_por_nota, a = RG.aceleracao, pesos = {};
  CR.forEach(function (g) { (pesos[g.peso] = pesos[g.peso] || []).push(g.k); });
  var ps = Object.keys(pesos).map(Number).sort(function (x, y) { return y - x; }).map(function (w) { return lista(pesos[w]) + ', ' + fmt(w, w % 1 ? 1 : 0); });
  return '<p>Cada carta tem nota de 0 a 3 em ' + NUM[NC] + ' critérios: a Sinergia Primária e a Secundária vêm deste deck, os outros oito vêm do cadastro único das cartas. ' +
    'A nota vale ' + pn.slice(1).join(', ').replace(/, (\d+)$/, ' ou $1') + ' pontos (0 não pontua), vezes o peso do critério: ' + ps.join('; ') + '. ' +
    'O potencial de aceleração é a soma das notas de ' + esc(CR[ICA].k) + ' dividida pelo CMC médio: vale ' + a.piso + ' pontos, mais ' + a.pontos_por_passo + ' a cada ' + fmt(a.passo, 1) + ', até ' + a.teto + '. ' +
    (RG.pontos_de_cmc_antigos ? 'O CMC médio ainda vale de 1 a 5 pontos.' : 'O CMC médio não soma pontos: ele entra só como divisor da aceleração.') + '</p>' +
    '<p>Os agrupamentos da aba 8×8, o tabelão e as leituras seguem com a análise anterior, separada desta. Os critérios, com a faixa e as cartas de cada um, ficam na aba Critérios.</p>';
}
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
    (st.foils ? '<div><dt>foils</dt><dd>' + st.foils + '</dd></div>' : '') + '</dl>';
  var peca = M.grafico === 'rosacea' ? 'pétala' : M.grafico === 'fios' ? 'lâmina' : M.grafico === 'chamas' ? 'chama' : M.grafico === 'estandartes' ? 'estandarte' : M.grafico === 'alfinetes' ? 'alfinete' : M.grafico === 'rebites' ? 'painel' : M.grafico === 'espinhos' ? 'espinho' : M.grafico === 'presas' ? 'presa' : M.grafico === 'coroa' ? 'ponta' : M.grafico === 'frascos' ? 'frasco' : M.grafico === 'runas' ? 'pedra' : M.grafico === 'cascos' ? 'casco' : M.grafico === 'leque' ? 'raio' : M.grafico === 'luas' ? 'lua' : M.grafico === 'raios' ? 'relâmpago' : M.grafico === 'baloes' ? 'balão' : M.grafico === 'trancas' ? 'trança' : M.grafico === 'folhas' ? 'galho' : M.grafico === 'ovos' ? 'ovo' : M.grafico === 'fendas' ? 'fenda' : M.grafico === 'moedas' ? 'pilha' : M.grafico === 'maos' ? 'mão' : M.grafico === 'engrenagens' ? 'engrenagem' : M.grafico === 'pergaminhos' ? 'pergaminho' : M.grafico === 'lunetas' ? 'luneta' : M.grafico === 'torres' ? 'torre' : M.grafico === 'meteoros' ? 'meteoro' : M.grafico === 'canhoes' ? 'canhão' : M.grafico === 'tumbas' ? 'lápide' : M.grafico === 'asas' && (V3 ? NC : NG) === 8 ? 'pena' : 'fatia';
  // motivo votado: a legenda vem do arquivo do motivo (peça, gênero e o que a pontuação muda)
  var mvl = typeof MOTIVO_PAINEL === 'object' && MOTIVO_PAINEL && MOTIVO_PAINEL.legenda;
  if (mvl) peca = mvl.peca;
  var chart = mvl ? '<figure class="rosa"' + crVars() + '>' + chartHero(st) + '<figcaption>' + legV3('Cada ' + esc(mvl.peca) + esc(mvl.texto) + ' Toque ' + (mvl.masc ? 'num ' : 'numa ') + esc(mvl.peca) + ' para abrir no tabelão.', esc(mvl.peca), mvl.masc) + '</figcaption></figure>' :
    '<figure class="rosa' + (M.grafico === 'asas' && (V3 ? NC : NG) === 8 ? ' asas' : '') + '"' + crVars() + '>' + chartHero(st) + '<figcaption>' + legV3('Cada ' + peca +
    (peca === 'frasco' ? ' é um agrupamento, e o sangue sobe nele com a soma das notas.' : peca === 'pedra' ? ' é um agrupamento: a luz sobe nela com a soma das notas, e a runa acende quando chega lá.' : peca === 'casco' ? ' é um agrupamento: a cor sobe nele com a soma das notas, e cada placa do meio acende quando a cor passa dela.' : peca === 'raio' ? ' do leque é um agrupamento: a cor sobe nele com a soma das notas, e cada degrau acende quando a cor passa dele.' : peca === 'lua' ? ' é um agrupamento: vai de nova a cheia com a soma das notas.' : peca === 'relâmpago' ? ' é um agrupamento, e o relâmpago vai até a soma das notas.' : peca === 'balão' ? ' é um agrupamento, e cresce com a soma das notas.' : peca === 'trança' ? ' é um agrupamento: os gomos acendem até a soma das notas.' : peca === 'pilha' ? ' de moedas é um agrupamento: cresce em proporção à soma das notas, e na mais alta a moeda do topo salta.' : peca === 'mão' ? ' é um agrupamento: sobe da cova em proporção à soma das notas, e a mais alta abre os dedos.' : peca === 'lápide' ? ' é um agrupamento: sobe da cova em proporção à soma das notas, e a mais alta ganha a chama fria.' : peca === 'engrenagem' ? ' é um agrupamento: os dez dentes acendem em proporção à soma das notas, e a mais cheia ganha o brilho verde do óleo phyrexiano.' : peca === 'pergaminho' ? ' é um agrupamento: se desenrola em proporção à soma das notas, e o mais cheio ganha o lacre.' : peca === 'luneta' ? ' é um agrupamento: estica em proporção à soma das notas, e a mais cheia ganha o brilho na lente.' : peca === 'torre' ? ' é um agrupamento: sobe em proporção à soma das notas, as janelas acendem com a altura, e a mais alta ganha a águia.' : peca === 'canhão' ? ' é um agrupamento: a carga de goblins o enche em proporção à soma das notas (cheio até a boca em 100%, pela metade em 50%), e o mais cheio dispara.' : peca === 'meteoro' ? ' é um agrupamento: a cauda de fogo cresce em proporção à soma das notas, e o maior solta faíscas.' : peca === 'fenda' ? ' é um agrupamento: abre e acende em proporção à soma das notas, e a mais cheia solta uma asa.' : peca === 'ovo' ? ' é um agrupamento: a cor acende e as rachaduras se abrem em proporção à soma das notas, e o mais cheio eclode.' : peca === 'galho' ? ' é um agrupamento com sete folhas, que acendem em proporção à soma das notas: o mais cheio tem as sete.' : ' é um agrupamento e sua área é a soma das notas.') + ' Toque ' + (/^(estandarte|alfinete|painel|espinho|frasco|casco|raio|balão|relâmpago|galho|ovo|pergaminho|meteoro|canhão)$/.test(peca) ? 'num ' : 'numa ') + peca + ' para abrir no tabelão.', peca, /^(estandarte|alfinete|painel|espinho|frasco|casco|raio|balão|relâmpago|galho|ovo|pergaminho|meteoro|canhão|engrenagem|pergaminho|casco)$/.test(peca)) + '</figcaption></figure>';
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

  // sem preço no painel (decisão do dono, 14/10/2026): o quadro mostra só a relevância
  var relRows = RELS.map(function (r) {
    var n = st.rel[r.k] || 0;
    return '<tr><th scope="row">' + relB(r.k) + ' ' + r.n + '</th><td class="num"><b>' + n + '</b></td><td class="num">' + fmt(st.n ? n / st.n * 100 : 0, 0) + '%</td></tr>';
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

  var h = heroHtml(st, cs.filter(function (c) { return c.cmd; }));

  h += '<div class="grid g-21">' +
    '<fieldset class="pn curve"><legend>Curva de mana</legend><div class="pn-tools"><div class="seg" role="group" aria-label="Dividir as colunas">' +
    '<button data-act="curve" data-v="tipo" data-fid="cv1" aria-pressed="' + (ui.curve === 'tipo') + '">Por tipo</button>' +
    '<button data-act="curve" data-v="cor" data-fid="cv2" aria-pressed="' + (ui.curve === 'cor') + '">Por cor</button></div></div>' +
    curveSvg(st, ui.curve) +
    '<div class="legend">' + (ui.curve === 'cor' ? COLS.filter(function (c) { return st.cols[c.k]; }) : TYPES.filter(function (t) { return t.k !== 'ter' && st.types[t.k]; })).map(function (k) {
      return '<span><i style="background:' + k.c + '"></i>' + esc(k.n) + ' ' + (ui.curve === 'cor' ? st.cols[k.k] : st.types[k.k]) + '</span>';
    }).join('') + '</div></fieldset>' +
    '<fieldset class="pn"><legend>Placar do deck</legend><div class="score-big"><b>' + fmtP(st.total) + '</b><span>pontos</span></div>' +
    '<table class="kv"><tr><th scope="row">CMC médio</th><td class="num">' + fmt(st.avg) + '</td><td class="num">' + (V3 && !RG.pontos_de_cmc_antigos ? 'não pontua' : '<b>' + st.cmcPts + '</b> pts') + '</td></tr>' +
    '<tr><th scope="row">Potencial de aceleração</th><td class="num">' + fmt(st.accX) + '</td><td class="num"><b>' + st.accPts + '</b> pts</td></tr>' +
    '<tr><th scope="row">' + (V3 ? 'Pontos dos dez critérios' : 'Soma das notas') + '</th><td></td><td class="num"><b>' + fmtP(st.crit) + '</b> pts</td></tr></table>' +
    (V3 ? '<p class="pn-note"><button class="linkish" data-act="go" data-v="crit">Abrir os critérios</button>: pontos, faixa e cartas de cada um.</p>' : '') +
    '<h3 class="sub">Tiers das ' + st.n + ' cartas</h3><div class="stack">' + TIERS.filter(function (t) { return st.tier[t.k]; }).map(function (t) {
      return '<i class="t' + t.k + '" style="flex:' + st.tier[t.k] + '" title="Tier ' + t.k + ': ' + st.tier[t.k] + '"></i>'; }).join('') + '</div>' +
    '<div class="legend">' + TIERS.map(function (t) { return '<span>' + tierB(t.k, true) + ' ' + (st.tier[t.k] || 0) + '</span>'; }).join('') +
    '<button class="linkish" data-act="go" data-v="tier">Abrir a tier list</button></div>' +
    '<details class="how"><summary>Como a conta é feita</summary>' + (V3 ? comoV3() : '<p>É a mesma lógica da sua planilha do Vito. O CMC médio vale de 1 a 5 pontos, e quanto mais baixo, melhor. O potencial de aceleração é a soma da coluna ' + esc(G[IR].k) + ' dividida pelo CMC médio, e cada 0,5 vale 5 pontos, até 90. O restante é a soma das notas de 0 a 3 que cada carta recebe nos ' + NUM[NG] + ' agrupamentos. Como os agrupamentos mudam de um deck para outro, o total serve para acompanhar este deck ao longo das trocas, não para compará-lo com outro.</p>') + '</details>' +
    '</fieldset></div>';

  h += custoPanel(cs, st);
  h += '<div class="grid g-11">' +
    '<fieldset class="pn"><legend>Os ' + NUM[NG] + ' agrupamentos</legend><div class="gl">' + groups + '</div>' +
    '<p class="pn-note">O número em destaque conta as cartas com nota 2 ou 3; o que vem depois do sinal de mais, as de nota 1. A faixa tracejada, onde aparece, é a referência usual de Commander, e vale como regra de bolso.</p></fieldset>' +
    '<fieldset class="pn"><legend>Leitura do deck</legend><ul class="read">' + readings(st) + '</ul></fieldset></div>';
  h += planoPanel();
  h += estrategiaPanel();

  h += '<div class="grid g-111">' + coresPanel(st) +
    '<fieldset class="pn"><legend>Tipos de carta</legend><div class="bars">' + typeBars + '</div>' +
    '<h3 class="sub">Edições mais presentes</h3><div class="bars">' + setBars + '</div></fieldset>' +
    '<fieldset class="pn"><legend>Relevância</legend><table class="rel-t"><thead><tr><th></th><th>Qtd</th><th>Do deck</th></tr></thead><tbody>' + relRows + '</tbody></table>' +
    '<p class="pn-note"><button class="linkish" data-act="go" data-v="ctrl">Abrir o painel de controle</button></p></fieldset></div>';

  if (D.combos.length) h += '<fieldset class="pn"><legend>Combos e linhas de jogo</legend><div class="combos">' + combos + '</div></fieldset>';
  h += edhPanel(cs);

  var el = $('#v-geral');
  el.className = 'view' + (ui.first ? ' anim' : '');
  el.innerHTML = h;
  ui.first = false;
}

/* ============ plano do deck ============ */
/* habilitadoras, recompensas e multiplicadoras (motor/plano.py; contexto/plano/METODO-PLANO.md). Uma lente ao lado do placar:
   o veredito nunca entra nele. Os cenários e o placar deles vêm do build, pela mesma conta do placar. */
var PAPEL = { habilita: 'Habilitadora', recompensa: 'Recompensa', multiplica: 'Multiplicadora' };
var PAPEIS = { habilita: 'Habilitadoras', recompensa: 'Recompensas', multiplica: 'Multiplicadoras' };
var PPK = ['habilita', 'recompensa', 'multiplica'];
var VERP = { excelente: 'Excelente', satisfatorio: 'Satisfatório', insuficiente: 'Insuficiente' };
function ppB(p) { return p ? '<span class="pp pp-' + p + '">' + PAPEL[p] + '</span>' : '<span class="pp pp-est">Proteção</span>'; }
function verB(v) { return '<span class="pv pv-' + (v || 'nd') + '">' + (VERP[v] || 'Não classificado') + '</span>'; }
function mistBar(mx, alto) {
  var n = mx[0] + mx[1] + mx[2] || 1;
  return '<div class="pbar' + (alto ? ' alto' : '') + '">' + PPK.map(function (p, i) {
    return mx[i] ? '<i class="pb-' + p + '" style="flex:' + mx[i] + '">' + (alto ? '<b>' + mx[i] + '</b> ' + fmt(mx[i] / n * 100, 0) + '%' : '') + '</i>' : '';
  }).join('') + '</div>';
}
function planoManchete(P) {
  var f = P.falta || [], m = P.mistura, n = P.n || 1, ref = P.ref || {}, sobra = [];
  PPK.forEach(function (p, i) { if (f.indexOf(p) < 0 && m[i] / n * 100 > (ref[p] || 0) + 10) sobra.push(p); });
  var t = { habilita: 'Habilitadoras', recompensa: 'recompensas', multiplica: 'multiplicadoras' };
  if (!f.length) return '<b>A mistura está equilibrada.</b> O plano tem corpo, conversão e o que multiplicar.';
  var cab = (sobra.length ? PAPEIS[sobra[0]] + ' de sobra, ' : '') + (sobra.length ? t[f[0]] : PAPEIS[f[0]]) + ' de menos.';
  var rab = { recompensa: 'O deck faz o plano acontecer, mas converte pouco em vantagem.', habilita: 'Falta corpo para o plano acontecer.', multiplica: 'O plano roda, mas sem nada que o multiplique.' }[f[0]];
  return '<b>' + cab.charAt(0).toUpperCase() + cab.slice(1) + '</b> ' + rab;
}
function planoPanel() {
  var P = D.plano; if (!P) return '';
  if (!P.classificado) return '<fieldset class="pn plano"><legend>Plano do deck</legend><p class="pn-note">Ainda não classificado: habilitadoras, recompensas e multiplicadoras entram com o <code>/plano</code>. O placar não muda.</p></fieldset>';
  var n = P.n, ref = P.ref, acc = 0, tracos = '';
  ['habilita', 'recompensa'].forEach(function (p) { acc += ref[p]; tracos += '<i class="pref" style="left:' + acc + '%"></i>'; });
  var ico = { ok: '✓', aviso: '!', falha: '✗' };
  var cmd = P.cmd.map(function (c, i) { var t = c.por_que; return '<div class="pcmd">' + ppB(c.papel) + '<p><b>' + esc(P.nomes_cmd[i] || '') + '</b> ' + esc(t.charAt(0).toLowerCase() + t.slice(1)) + '</p></div>'; }).join('');
  var NOMEC = { hoje: 'Hoje', sem_comprar: 'Sem comprar nada', radar: 'Radar como está', recomendado: 'Recomendado' };
  var cen = P.cenarios.map(function (x) {
    var d = x.delta;
    return '<tr class="pc-' + x.k + (x.aviso ? ' pc-av' : '') + '"><th scope="row">' + NOMEC[x.k] + (x.sub ? '<small>' + esc(x.sub) + '</small>' : '') + '</th>' +
      '<td>' + (x.entra.length ? esc(lista(x.entra)) : '—') + '</td><td>' + (x.sai.length ? esc(lista(x.sai)) : '—') + (x.aviso ? '<small class="pc-avt">' + esc(x.aviso) + '</small>' : '') + '</td>' +
      '<td>' + mistBar(x.mistura) + '<small>' + x.mistura.join(' · ') + '</small></td><td>' + verB(x.veredito) + '</td>' +
      '<td class="num">' + fmtP(x.placar) + (d ? ' <b class="' + (d > 0 ? 'pos' : 'neg') + '">' + (d > 0 ? '+' : '−') + fmtP(Math.abs(d)) + '</b>' : '') + '</td></tr>';
  }).join('');
  var trocas = P.trocas.map(function (t) {
    var org = t.origem + (t.onde && t.onde.length && t.origem.indexOf('mover') === 0 ? '' : '');
    return '<div class="ptr">' + ppB(t.papel) + '<div><p><b>' + esc(t.entra) + '</b> no lugar de <b>' + esc(t.sai) + '</b> <span class="porg">' + esc(org) + '</span></p>' +
      '<p class="pfx">' + esc(t.faz) + (t.onde && t.onde.length ? ' Você tem ' + esc(t.entra) + ' no ' + esc(lista(t.onde)) + '.' : '') + '</p></div>' +
      '<b class="num ' + (t.ganho > 0 ? 'pos' : t.ganho < 0 ? 'neg' : '') + '">' + (t.ganho > 0 ? '+' : t.ganho < 0 ? '−' : '±') + fmtP(Math.abs(t.ganho)) + '</b></div>';
  }).join('');
  var notas = (P.notas || []).map(function (x) {
    return esc(x.corte) + ' também é o corte do ' + esc(x.radar) + ' no radar: se ele entrar, o pacote fica em ' + (x.total_alt > 0 ? '+' : x.total_alt < 0 ? '−' : '') + fmtP(Math.abs(x.total_alt)) + '.';
  }).join(' ');
  var cs = deck().filter(function (c) { return c.pp && !c.cmd; });
  var cols = PPK.map(function (p) {
    var l = cs.filter(function (c) { return c.pp === p; }).sort(function (a, b) { return (TR[a.tier] - TR[b.tier]) || a.n.localeCompare(b.n); });
    return '<div><h4 class="ph-' + p + '">' + PAPEIS[p] + ' <small>' + l.length + '</small></h4><ul>' + l.map(function (c) {
      return '<li>' + tierB(c.tier, true) + ' <button class="linkish" data-card="' + esc(c.id) + '">' + esc(c.n) + '</button>' + (c.ppd ? ' <span class="pdup" title="' + esc(c.ppd) + '">+</span>' : '') + '</li>';
    }).join('') + '</ul></div>';
  }).join('');
  return '<fieldset class="pn plano"><legend>Plano do deck</legend>' +
    '<div class="pver">' + verB(P.veredito) + '<p>' + planoManchete(P) + '</p></div>' + cmd +
    '<div class="pbw">' + mistBar(P.mistura, true) + tracos + '</div>' +
    '<p class="pleg"><b class="ph-habilita">Habilitadoras</b> fazem o plano acontecer · <b class="ph-recompensa">Recompensas</b> transformam o plano em vantagem · <b class="ph-multiplica">Multiplicadoras</b> multiplicam o que já roda. Traços: a referência de ' + ref.habilita + ', ' + ref.recompensa + ' e ' + ref.multiplica + '%.</p>' +
    '<ul class="pchk">' + P.checks.map(function (k) { return '<li class="pk-' + k.s + '"><i>' + ico[k.s] + '</i><span>' + esc(k.t) + '</span></li>'; }).join('') + '</ul>' +
    '<h3 class="sub">Mais forte e equilibrado</h3><p class="pn-note">Força é o placar dos seus dez critérios; equilíbrio é o plano. A boa troca melhora os dois.</p>' +
    '<div class="tw"><table class="tbl pcen"><thead><tr><th scope="col">Cenário</th><th scope="col">Entra</th><th scope="col">Sai</th><th scope="col">Plano <small>hab · rec · mult</small></th><th scope="col">Veredito</th><th scope="col" class="num">Placar</th></tr></thead><tbody>' + cen + '</tbody></table></div>' +
    (trocas ? '<h3 class="sub">O recomendado, troca a troca</h3><div class="ptrs">' + trocas + '</div>' : '') +
    (notas ? '<p class="pn-note">' + notas + ' Nenhuma troca muda a decklist sozinha.</p>' : '') +
    '<details class="pcart"><summary>As ' + n + ' cartas do plano, por papel</summary><div class="pcols">' + cols + '</div>' +
    '<p class="pn-note">+ dupla função (passe o mouse para ver qual). Fora do plano: terrenos, ramp, compra e remoção sem papel nele.</p></details></fieldset>';
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
  var inDeck = {}, radar = {}, oficial = {};
  cs.forEach(function (c) { inDeck[c.id] = 1; }); cands().forEach(function (c) { radar[c.id] = 1; });
  // a página usa o nome do Scryfall; carta com nome impresso (Hades Grip, do Sulfuric Vortex) é achada pelo nome oficial
  cs.concat(cands()).forEach(function (c) { if (c.on) oficial[slug(c.on)] = c.id; });
  function idDe(nm) { var s = slug(nm); return oficial[s] || s; }
  function nomes(a) { return lista(a.map(function (nm) { var id = idDe(nm), c = (inDeck[id] || radar[id]) ? byId(id) : null; return c ? '<button class="linkish" data-card="' + esc(id) + '">' + esc(c.n) + '</button>' : esc(nm); })); }
  var listas = (EDH.listas || []).map(function (l) {
    var ok = [], miss = [];
    l.cards.forEach(function (nm) { (inDeck[idDe(nm)] ? ok : miss).push(nm); });
    var noRadar = miss.length && miss.filter(function (nm) { return radar[idDe(nm)]; }).length === miss.length;
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
  if (k === 'tier') return TR[c.tier];
  if (k === 'rel') return RR[c.rel];
  if (k === 'pp') return c.pp ? PPK.indexOf(c.pp) : 9;
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
/* o total de Pts do Tabelão e o placar não são o mesmo número: no deck v3, o placar soma os critérios e a aceleração;
   na visão do 8×8, o total é a soma das notas dos agrupamentos, que não entra no placar */
function totPl(cs, tp) {
  if (!V3 || cs.length !== deck().length) return '';
  if (!TABC) return '<small class="tot-pl">soma das notas do 8×8</small>';
  var st = stats(deck());
  return '<small class="tot-pl">+ ' + st.accPts + ' de aceleração = ' + fmtP(st.total) + ', o placar</small>';
}
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
      '<td class="pts num">' + fmtP(pts(c)) + '</td>' + (EDH ? '<td class="num syn' + (c.syn == null ? ' dimc' : '') + '">' + synTxt(c.syn) + '</td>' : '') + '<td>' + tierB(c.tier, true) + '</td><td>' + relB(c.rel) + (D.plano && D.plano.classificado ? '</td><td>' + (c.pp ? ppB(c.pp) : '<span class="dimc">—</span>') : '') + '</td></tr>';
  }
  var tot = [], tp = 0, tn = 0, i;
  for (i = 0; i < NG; i++) tot.push(0);
  cs.forEach(function (c) { for (var i = 0; i < NG; i++) tot[i] += gv(c, i) * c.q; tp += pts(c) * c.q; tn += c.q; });
  var h = '<tr class="tot"><td class="c-name">' + (cs.length === deck().length ? 'Total do deck' : 'Total do filtro') + '</td><td class="num hm">' + tn + '</td><td class="hm"></td><td></td>' +
    tot.map(function (v) { return '<td class="num">' + v + '</td>'; }).join('') + '<td class="num">' + fmtP(tp) + totPl(cs, tp) + '</td>' + (EDH ? '<td></td>' : '') + '<td></td><td></td>' + (D.plano && D.plano.classificado ? '<td></td>' : '') + '</tr>';
  if (!cs.length) return h + '<tr><td class="c-name" colspan="' + NCOL + '" style="position:static;padding:22px 14px;color:var(--mute);max-width:none">Nenhuma carta com esses filtros. Limpe a busca ou escolha outro agrupamento.</td></tr>';
  if (ui.grouped) {
    TG.forEach(function (g) {
      var list = cs.filter(function (c) { return c.g === g.k; }).sort(sorter);
      if (!list.length) return;
      var n = 0, p = 0; list.forEach(function (c) { n += c.q; p += pts(c) * c.q; });
      // cada tipo abre e fecha ao tocar no cabeçalho; fechado, mostra só a contagem e os pontos
      var fech = !!ui.fech[g.k];
      h += '<tr class="grp' + (fech ? ' fechado' : '') + '" data-act="grp-tog" data-g="' + g.k + '" data-fid="grp' + g.k + '" tabindex="0" role="button" aria-expanded="' + !fech + '" title="' + (fech ? 'Abrir' : 'Fechar') + ' ' + g.n.toLowerCase() + '"><td colspan="' + NCOL + '"><div class="grp-in"><i class="grp-sw" aria-hidden="true">▾</i>' + g.n + ' (' + n + ')<span>' + fmtP(p) + ' pts</span></div></td></tr>' + (fech ? '' : list.map(row).join(''));
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
/* desenha o tabelão na visão escolhida: na de Critérios, as colunas viram os dez critérios e Pts o valor v3 da carta */
function comTabC(fn) {
  if (!(V3 && ui.tabv === 'crit')) return fn();
  var g0 = G, n0 = NG, k0 = NCOL;
  TABC = true; G = CR; NG = NC; NCOL = 7 + NC + (EDH ? 1 : 0);
  try { return fn(); } finally { TABC = false; G = g0; NG = n0; NCOL = k0; }
}
function renderTab() { comTabC(renderTab0); }
function renderTab0() {
  var tc = V3 && ui.tabv === 'crit';
  var h = (V3 ? '<div class="pn-tools tab-v"><div class="seg" role="group" aria-label="O que as colunas mostram">' +
    '<button data-act="tab-v" data-v="grp" data-fid="tvg" aria-pressed="' + !tc + '">8×8</button>' +
    '<button data-act="tab-v" data-v="crit" data-fid="tvc" aria-pressed="' + tc + '">Critérios</button></div></div>' : '') +
    '<div class="tools"><label class="fld"><span>Buscar</span><input class="inp" id="q" type="search" placeholder="nome ou tipo" value="' + esc(ui.q) + '" autocomplete="off"></label>' +
    '<label class="fld"><span>Tipo</span><select class="inp" data-act="ft" data-fid="ft"><option value="">Todos</option>' + TG.map(function (t) { return '<option value="' + t.k + '"' + (ui.ft === t.k ? ' selected' : '') + '>' + t.n + '</option>'; }).join('') + '</select></label>' +
    '<label class="fld"><span>Relevância</span><select class="inp" data-act="fr" data-fid="fr"><option value="">Todas</option>' + RELS.map(function (r) { return '<option value="' + r.k + '"' + (ui.fr === r.k ? ' selected' : '') + '>' + r.l + ' ' + r.n + '</option>'; }).join('') + '</select></label>' +
    '<span class="sp"></span>' + (ui.grouped ? '<button class="btn ghost sm" data-act="grp-all" data-fid="gpa">' + (TG.some(function (g) { return !ui.fech[g.k]; }) ? 'Recolher tudo' : 'Expandir tudo') + '</button>' : '') +
    '<label class="tog"><input type="checkbox" data-act="grouped" data-fid="gp"' + (ui.grouped ? ' checked' : '') + '> Agrupar por tipo</label></div>';
  h += '<div class="pills" role="group" aria-label="Filtrar por ' + (tc ? 'critério' : 'agrupamento') + '"' + (tc ? crVars() : '') + '>' + G.map(function (g, i) {
    return '<button class="pill" style="--c:var(--g' + i + ')" data-act="fg" data-g="' + i + '" data-fid="fg' + i + '" aria-pressed="' + (ui.fg === i) + '" title="' + esc(g.d) + '"><i class="dot" style="--c:var(--g' + i + ')"></i>' + esc(g.k) + '</button>';
  }).join('') + '</div>';
  h += '<div class="tw" id="tw"' + (tc ? crVars() : '') + '><table class="tbl" style="min-width:' + (590 + 52 * NG) + 'px"><thead><tr>' +
    th('n', 'Carta', 'c-name') + th('q', 'Qtd', 'hm') + '<th scope="col" class="hm">Custo</th>' + th('cmc', 'CMC') +
    G.map(function (g, i) { return th('g' + i, esc(g.ab), 'gh', g.k + ': ' + g.d, '--c:var(--g' + i + ')'); }).join('') +
    th('pts', 'Pts') + (EDH ? th('syn', 'Wiki', '', 'Sinergia no ' + EDH.fonte + (EDH.pagina ? ' para ' + EDH.pagina : '') + ': presença na comunidade, não força') : '') +
    th('tier', 'Tier') + th('rel', 'Relev.') + (D.plano && D.plano.classificado ? th('pp', 'Papel', '', 'Papel no Plano do deck') : '') + '</tr></thead><tbody id="tbody">' + tabRows() + '</tbody></table></div>';
  h += '<p class="hint">' + (tc ? 'Notas de 0 a 3 nos ' + NUM[NC] + ' critérios. Pts é o valor da carta: peso do critério × pontos da nota, somado.' :
    'Notas de 0 a 3 em cada agrupamento: 1 é efeito de passagem, 2 é função da carta, 3 é referência do deck. Uma carta pode pontuar em vários.') + (EDH ? ' A coluna Wiki é a sinergia no ' + esc(EDH.fonte) + '.' : '') + ' Toque na linha para ver a carta, o motivo e editar.</p>';
  $('#v-tab').innerHTML = h;
}

/* ============ painel de controle ============ */
function renderCtrl() {
  var all = deck(), cs = all.filter(function (c) { return ui.ctrlLands || !c.land; }), st = stats(all);
  var h = '<div class="tools"><p class="hint" style="flex:1;min-width:240px">Quatro faixas, como na coluna Relevância da sua planilha. Arraste entre as colunas ou toque na carta para mudar.</p>' +
    '<label class="tog"><input type="checkbox" data-act="ctrl-lands" data-fid="cl"' + (ui.ctrlLands ? ' checked' : '') + '> Incluir terrenos</label></div>';
  h += '<div class="kan">' + RELS.map(function (r) {
    var list = cs.filter(function (c) { return c.rel === r.k; }).sort(function (a, b) {
      return r.k === 'BAX' ? cutCmp(a, b) : ((TR[a.tier] - TR[b.tier]) || (V3 ? pts3(b) - pts3(a) : pts(b) - pts(a)) || a.n.localeCompare(b.n));
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
    '<p class="pn-note">Ordem: relevância mais baixa, depois a prioridade sugerida, ' + (V3 ? 'o valor da carta nos critérios e o tier' : 'o tier e a pontuação') + '. PetCards, o comandante e as cartas marcadas como fora do corte nunca entram na fila; terrenos são avaliados à parte.</p></fieldset>' +
    '<fieldset class="pn"><legend>Pendências</legend><ul class="pend">' + pend.join('') + '</ul></fieldset></div>';
  $('#v-ctrl').innerHTML = h;
}

/* ============ radar ============ */
function cutOptions(cand, sel) {
  var d = deck(), top = cutQueue(d, !!cand.land).slice(0, 12), ids = {};
  top.forEach(function (c) { ids[c.id] = 1; });
  var rest = d.filter(function (c) { return !ids[c.id] && !c.cmd && c.id !== cand.id; }).sort(function (a, b) { return a.n.localeCompare(b.n); });
  var def = sel != null ? sel : ((cand.sai && d.some(function (c) { return c.id === cand.sai; })) ? cand.sai : (top[0] ? top[0].id : ''));
  function opt(c) { return '<option value="' + esc(c.id) + '"' + (c.id === def ? ' selected' : '') + '>' + esc(c.n) + ' (' + RELS[RR[c.rel]].l + ', ' + (V3 ? fmtP(pts3(c)) : pts(c)) + ' pts)</option>'; }
  return '<optgroup label="Fila de corte">' + top.map(opt).join('') + '</optgroup><optgroup label="Demais cartas">' + rest.map(opt).join('') + '</optgroup><option value=""' + (def === '' ? ' selected' : '') + '>Ninguém sai (o deck passa de 100)</option>';
}
function fdate(d) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); return m ? m[3] + '/' + m[2] + '/' + m[1] : '—'; }
function gtags(c) {
  var tags = '';
  for (var i = 0; i < NG; i++) if (gv(c, i) > 0) tags += '<span class="gt" style="--c:var(--g' + i + ')">' + esc(G[i].sh || G[i].k) + ' ' + gv(c, i) + '</span>';
  return tags;
}
/* v3: posição de uma carta no ranking do deck pelo valor nos critérios (1 = a que mais pontua). Carta de fora entra
   na conta como se estivesse no deck, para dizer onde ficaria. */
function ranking() { return deck().filter(function (c) { return !c.cmd; }).sort(function (a, b) { return (pts3(b) - pts3(a)) || (TR[a.tier] - TR[b.tier]) || a.n.localeCompare(b.n); }); }
function posicao(c, rk) {
  rk = rk || ranking(); var v = pts3(c), n = 1;
  rk.forEach(function (x) { if (x.id !== c.id && pts3(x) > v) n++; });
  return { n: n, de: rk.length + (rk.some(function (x) { return x.id === c.id; }) || c.cmd ? 0 : 1) };
}
function gtags3(c) {
  var tags = '';
  for (var i = 0; i < NC; i++) { var v = (c.s3 || [])[i] || 0; if (v > 0) tags += '<span class="gt" style="--c:' + CR[i].cor + '">' + esc(CR[i].sh || CR[i].k) + ' · ' + v + '</span>'; }
  return tags;
}
/* v3: quanto o placar muda com a troca (entra c, sai alvo); com a carta já no deck, o que ela acrescentou */
function deltaTroca(c, alvo) {
  if (!V3 || !alvo) return null;
  var cs = deck(), sem = c.inDeck ? cs.filter(function (x) { return x.id !== c.id; }).concat([alvo]) : cs, com = c.inDeck ? cs : cs.filter(function (x) { return x.id !== alvo.id; }).concat([c]);
  return stats(com).total - stats(sem).total;
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
    (c.pp ? '<p class="cand-pp">' + ppB(c.pp) + (D.plano && D.plano.radar && D.plano.radar[c.id] ? ' <small>com a troca do radar, o plano fica ' + verB(D.plano.radar[c.id]) + '</small>' : '') + '</p>' : '') +
    (c.fx ? '<p class="cand-fx' + (c.orig ? ' orig' : '') + '">' + rich(c.fx) + '</p>' : '') + (c.why ? '<p class="cand-why">' + rich(c.why) + '</p>' : '') + '</div></div>' +
    (V3 ? '<div class="gtags">' + gtags3(c) + '<span class="gt" style="--c:var(--gold-rgb)">' + fmtP(pts3(c)) + ' pts · ' + (function (p) { return p.n + 'ª de ' + p.de; })(posicao(c)) + '</span>' :
    '<div class="gtags">' + gtags(c) + '<span class="gt" style="--c:var(--gold-rgb)">' + pts(c) + ' pts</span>') +
    (c.syn != null && EDH ? '<span class="gt" style="--c:160,170,182" title="Sinergia no ' + esc(EDH.fonte) + '">' + esc(EDH.fonte) + ' ' + synTxt(c.syn) + '</span>' : '') + (c.tem ? '<span class="gt" style="--c:95,191,167">tenho a carta</span>' : '') + '</div>' +
    (cv ? '<p class="cand-cv">' + cv + '.</p>' : '') +
    (function () { var d = deltaTroca(c, alvo); return d == null ? '' : '<p class="cand-pl">Placar ' + (d > 0 ? '+' : d < 0 ? '−' : '±') + fmtP(Math.abs(d)) + (c.inDeck ? ' com a troca por ' : ' trocando por ') + esc(alvo.n) + '.</p>'; })() +
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
/* Contra outras listas (motor/confronto.py, aba Radar): cada lista de fora pontuada pela régua e pelas sinergias deste deck.
   O placar do seu deck aqui é o da lista como está no arquivo, sem as trocas desta tela. */
function confrontoSection() {
  var CF = D.confrontos;
  if (!V3 || !CF || !CF.listas || !CF.listas.length) return '';
  var meu = CF.meu;
  function sinal(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + fmtP(Math.abs(v)); }
  function cls(v, inv) { var p = inv ? v < 0 : v > 0, n = inv ? v > 0 : v < 0; return p ? ' pos' : n ? ' neg' : ''; }
  function seta(n, i) { var r = CR[i].ref; return !r ? '' : n < r[0] ? ' <span class="cf-s" title="abaixo da faixa">▼</span>' : n > r[1] ? ' <span class="cf-s" title="acima da faixa">▲</span>' : ''; }
  function notas(s3) { return s3.map(function (v, i) { return v ? '<span class="cf-n" title="' + esc(CR[i].k) + ': ' + v + '">' + esc(CR[i].sh || CR[i].ab) + ' ' + v + '</span>' : ''; }).join(''); }
  return CF.listas.map(function (L) {
    var dif = L.placar - meu.placar, nome = L.nome + (L.autor ? ', de ' + L.autor : '');
    var topo = '<div class="cf-pl"><div><small>Seu deck</small><b class="num">' + fmtP(meu.placar) + '</b><small>CMC ' + fmt(meu.cmc, 2) + '</small></div>' +
      '<div><small>' + esc(nome) + '</small><b class="num">' + fmtP(L.placar) + '</b><small>CMC ' + fmt(L.cmc, 2) + '</small></div>' +
      '<div><small>Diferença</small><b class="num' + cls(dif, true) + '">' + sinal(dif) + '</b><small>' + (dif > 0 ? 'ela está na frente' : dif < 0 ? 'o seu está na frente' : 'empate') + '</small></div></div>';
    var crit = '<div class="scx"><table class="cf-t"><thead><tr><th scope="col">Critério</th><th scope="col" class="num">Seu deck</th><th scope="col" class="num">Cartas</th><th scope="col" class="num">' + esc(L.nome) + '</th><th scope="col" class="num">Cartas</th><th scope="col" class="num">Diferença</th></tr></thead><tbody>' +
      CR.map(function (g, i) {
        var d = L.pts[i] - meu.pts[i];
        return '<tr><td>' + esc(g.k) + '</td><td class="num">' + fmtP(meu.pts[i]) + '</td><td class="num">' + meu.n[i] + seta(meu.n[i], i) + '</td><td class="num">' + fmtP(L.pts[i]) + '</td><td class="num">' + L.n[i] + seta(L.n[i], i) + '</td><td class="num' + cls(d, true) + '">' + sinal(d) + '</td></tr>';
      }).join('') + '</tbody></table></div><p class="pn-note">Pontos por critério e cartas com nota 2 ou 3 em cada um; ▼ e ▲ marcam abaixo e acima da faixa da régua. A aceleração entra só no placar.</p>';
    var sd = L.so_dele || [], noRadar = {}; cands().forEach(function (x) { noRadar[x.id] = 1; });
    /* cada carta abre no toque (funciona no celular, onde a gaveta não existe para carta de fora): texto oficial, o porquê
       do cadastro, as notas e um botão que a põe no radar com essas notas, para avaliar */
    var dele = '<div class="cf-l">' + sd.map(function (c) {
      var emRadar = c.radar || noRadar[c.id], sit = emRadar ? 'no seu radar' : !c.cad ? 'sem cadastro nos critérios' : 'sinergia a avaliar';
      return '<details class="cf-c"><summary><span class="cf-cn"><b>' + esc(c.n) + '</b>' + (c.cost ? ' ' + mana(c.cost) : '') + '</span>' +
        '<span class="cf-cg num' + (c.ganho != null ? cls(c.ganho) : '') + '">' + (c.ganho == null ? '—' : sinal(c.ganho)) + '</span></summary>' +
        '<div class="cf-cb"><p class="cand-m">' + esc(c.line) + (c.pt ? ', ' + esc(c.pt) : '') + '</p>' +
        (c.fx ? '<p class="orig">' + rich(c.fx) + '</p>' : '') +
        (c.pq ? '<p><em>Nos critérios:</em> ' + esc(c.pq) + '</p>' : '') +
        '<p>' + (notas(c.s3) || '<span class="dim">sem nota nos critérios</span>') + '</p>' +
        '<p class="hint">' + (c.ganho == null ? 'Sem ganho calculado.' : 'Ganho no seu deck: <b class="num' + cls(c.ganho) + '">' + sinal(c.ganho) + '</b>' + (c.sai ? ', saindo ' + esc(c.sai) : '') + '.') + ' ' + sit +
        (!emRadar && c.cad ? ': este deck nunca avaliou a carta, então a sinergia conta como zero e o ganho é um piso.' : '.') + '</p>' +
        (!emRadar ? '<div class="pc-a"><button class="btn sm" data-act="cf-radar" data-id="' + esc(c.id) + '">Levar ao radar</button></div>' : '') + '</div></details>';
    }).join('') + '</div><p class="pn-note">Da maior para a menor pelo ganho (motor/encaixe.py): o valor da carta nos critérios deste deck, com saturação, menos o da carta de menor valor que sairia. "Levar ao radar" põe a carta para avaliar, com os critérios do cadastro e sinergia zero; a sinergia você dá na gaveta, ou eu dou no projeto.</p>';
    var resto = '<div class="grid g-11"><details class="cf-d"><summary>Em comum (' + (L.comum || []).length + ')</summary><p>' + esc((L.comum || []).join(', ') || '—') + '</p></details>' +
      '<details class="cf-d"><summary>Só no seu deck (' + (L.so_meu || []).length + ')</summary><p>' + esc((L.so_meu || []).join(', ') || '—') + '</p></details></div>' +
      (L.sem_cadastro && L.sem_cadastro.length ? '<p class="pn-note">Sem cadastro nos critérios, valendo 0: ' + esc(L.sem_cadastro.join(', ')) + '.</p>' : '');
    return '<fieldset class="pn cf"><legend>Contra outras listas</legend>' +
      '<p class="hint">' + esc(nome) + (L.url ? ' (<a href="' + esc(L.url) + '" target="_blank" rel="noopener noreferrer">' + esc(L.fonte || 'lista') + '</a>)' : '') + (L.atualizada ? ', atualizada em ' + esc(fdate(L.atualizada)) : '') +
      ', ' + L.cartas + ' cartas. Pontuada pela régua e pelas sinergias deste deck, lida em ' + esc(fdate(CF.lido)) + '. Para reler: <code>/confrontar ' + esc(M.pasta) + '</code>.</p>' +
      topo + '<h3 class="sub">Critério a critério</h3>' + crit +
      '<h3 class="sub">Cartas dela que você não tem (' + sd.length + ')</h3>' + dele + resto + '</fieldset>';
  }).join('');
}
function renderRadar() {
  var vo = { entra: 0, avaliar: 1, fora: 2 };
  var all = cands().map(E).sort(function (a, b) { return (vo[a.verdict] - vo[b.verdict]) || (V3 ? (pts3(b) - pts3(a)) || (TR[a.tier] - TR[b.tier]) : (TR[a.tier] - TR[b.tier]) || (pts(b) - pts(a))) || a.n.localeCompare(b.n); });
  var main = all.filter(function (c) { return c.verdict !== 'fora' || c.inDeck; }), no = all.filter(function (c) { return c.verdict === 'fora' && !c.inDeck; });
  var h = '<p class="hint">Cartas fora do deck que valem acompanhar. Ao colocar uma no deck você escolhe quem sai, e todos os gráficos passam a refletir a troca. Quem você deixa de fora desce para a lista abaixo, com a nota e o motivo guardados. A pergunta de sempre: a carta é boa, ou é boa ' + (artigo() === 'a' ? 'na' : 'no') + ' ' + esc(M.curto || 'comandante') + '?</p>';
  h += confrontoSection();
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
    (V3 ? '<div class="wide"><p class="nc-h">Notas por critério: as duas sinergias deste deck e os oito critérios da carta. Contam no placar.</p><div class="g8">' + CR.map(function (g, i) {
      return '<label title="' + esc(g.d) + '">' + esc(g.sh || g.k) + '<select class="inp" id="nc-c' + i + '"><option selected>0</option><option>1</option><option>2</option><option>3</option></select></label>';
    }).join('') + '</div></div>' : '') +
    '<div class="wide">' + (V3 ? '<p class="nc-h">Notas por agrupamento (8×8)</p>' : '') + '<div class="g8">' + G.map(function (g, i) {
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
/* o Grimório (página própria, ao lado do hub): o 8×8 dele com este deck já escolhido; só existe depois da primeira leitura */
function grimorioOf() {
  var G = M.grimorio; if (!G) return '';
  var base = (PUB && G.pub) ? G.pub : G.href, href = base + '?deck=' + encodeURIComponent(M.pasta) + '#8x8';
  return '<article class="of" id="of-grim"><h3>Ver as melhores cartas para este deck no Grimório</h3><p>' +
    'Abre o 8×8 do Grimório neste deck: um quadro por pacote, com as cartas boas nas cores dele e se você já tem, tem parada em outro deck ou pasta, ou falta. Só leitura: nada muda aqui.</p>' +
    '<div class="acts"><a class="btn sm" id="of-grim-a" href="' + esc(href) + '" target="_blank" rel="noopener">Abrir o Grimório neste deck</a></div></article>';
}
/* a Consulta (página própria, ao lado do Grimório): uma carta de fora contra todos os decks; só consulta, nada muda aqui */
function consultaOf() {
  var C = M.consulta; if (!C) return '';
  var href = (PUB && C.pub) ? C.pub : C.href;
  return '<article class="of" id="of-cons"><h3>Consultar uma carta de fora</h3><p>' +
    'Abre a Consulta: cole o link de uma carta do Scryfall e veja o que ela faz, se é forte sozinha, em qual deck rende e no lugar de quem, e se vale comprar. Só consulta: nada muda aqui.</p>' +
    '<div class="acts"><a class="btn sm" id="of-cons-a" href="' + esc(href) + '" target="_blank" rel="noopener">Abrir a Consulta</a></div></article>';
}
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
  }).join('') + grimorioOf() + consultaOf() + '</div>';
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
  /* v3: os dez critérios, com o que cada nota vale (peso × pontos), editáveis para simular */
  var w3 = c.s3w || {}, sinW = w3.sin || {}, sinR = M.sinergias || {};
  var steps3 = !V3 ? '' : CR.map(function (g, i) {
    var v = (c.s3 || [])[i] || 0, p = ptsCrit(v, i), ehSin = g.id === 'sin1' || g.id === 'sin2';
    // nas sinergias, a régua do deck no título e o porquê da nota logo abaixo (some quando a nota foi mudada aqui)
    var tit = ehSin && sinR[g.id] && sinR[g.id].regra ? sinR[g.id].nome + '. ' + sinR[g.id].regra : g.d;
    var orig = (byIdRaw(c.id) || {}).s3, mudou = orig && (orig[i] || 0) !== v;
    var o0 = orig ? (orig[i] || 0) : v;
    var pq = mudou ? '<p class="step-w g-sim">Simulada por você neste navegador; a nota original é ' + o0 + (ehSin && o0 && sinW[g.id] ? ': ' + esc(sinW[g.id]) : '.') + '</p>' :
      ehSin && v && sinW[g.id] ? '<p class="step-w">' + esc(sinW[g.id]) + '</p>' : '';
    return '<div class="step"><span class="gn" title="' + esc(tit) + '"><i class="dot" style="--c:' + g.cor + '"></i>' + esc(g.k) +
      '<small class="gw">×' + fmt(g.peso, g.peso % 1 ? 1 : 0) + '</small><small class="gp">' + (p ? fmtP(p) + ' pts' : '') + '</small></span>' +
      '<span class="stp"><button data-act="step3" data-g="' + i + '" data-d="-1" data-fid="tm' + i + '" aria-label="Diminuir ' + esc(g.k) + '"' + (v <= 0 ? ' disabled' : '') + '>−</button>' +
      '<output>' + v + '</output>' +
      '<button data-act="step3" data-g="' + i + '" data-d="1" data-fid="tp' + i + '" aria-label="Aumentar ' + esc(g.k) + '"' + (v >= 3 ? ' disabled' : '') + '>+</button></span></div>' + pq;
  }).join('');
  // o porquê das oito notas da carta (cadastro único, vale em todo deck) e do ajuste deste deck, se houver
  var cadW = !V3 ? '' : (w3.cad ? '<p class="step-w"><b>Cadastro da carta:</b> ' + esc(w3.cad) + '</p>' : '') + (w3.aj ? '<p class="step-w"><b>Ajuste neste deck:</b> ' + esc(w3.aj) + '</p>' : '');
  var enc = encodeURIComponent;
  var link = c.set ? 'https://scryfall.com/card/' + enc(c.set.toLowerCase()) + '/' + enc(c.num) : 'https://scryfall.com/search?q=' + enc('!"' + (c.on || c.n) + '"');
  var liga = 'https://www.ligamagic.com.br/?view=cards/card&card=' + enc(c.on || c.n);   // só o link: o painel não mostra preço
  var back = !!(ui.face && c.dfc && c.back);
  var where = c.cand ? (c.inDeck ? 'No deck, vinda do radar' : 'No radar, fora do deck') : (c.inDeck ? '' : 'Fora do deck');
  var h = '<button class="x" data-act="close" aria-label="Fechar">×</button>' +
    '<p class="dw-type">' + esc(c.line) + '</p><h2 id="dw-title">' + esc(c.n) + '</h2>' +
    '<div class="dw-meta">' + (c.cost ? mana(c.cost) : '') + (c.land ? '' : '<span>CMC ' + c.cmc + '</span>') + (c.pt ? '<span>' + (c.ptl ? c.ptl + ' ' : '') + esc(c.pt) + '</span>' : '') +
    (c.set ? '<span>' + esc(c.set) + ' ' + esc(c.num) + '</span>' : '') + (c.q > 1 ? '<span>' + c.q + ' cópias</span>' : '') + (c.foil ? '<span><span class="foil">✦</span> foil' + (c.etched ? ' etched' : '') + '</span>' : '') + (where ? '<span>' + where + '</span>' : '') + '</div>';
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
  if (V3) {
    var pk = c.land ? 'mana' : pkOf(c), pkN = pk === 'mana' ? 'Mana' : pk === 'sem' ? 'sem pacote' : (G[gi(pk)] || {}).k || pk;
    h += '<p class="dw-pk">No 8×8: <b>' + esc(pkN) + '</b>' + (S.pk[c.id] ? ' (movida por você)' : '') + ' <button class="linkish" data-act="go" data-v="pk">Ver no 8×8</button></p>';
    var ps = c.cmd ? null : posicao(c);
    h += '<details class="dw-8 dw-c3"' + (ui.dwc3 ? ' open' : '') + '><summary><span class="dw-h3">Notas por critério<span class="dw-tot"><b>' + fmtP(pts3(c)) + '</b> pts' + (ps ? ' · ' + ps.n + 'ª de ' + ps.de + (c.inDeck ? '' : ' se entrar') : '') + '</span></span></summary><p class="dw-nota">' + resumoDw() + ' Mudar uma nota aqui é simulação: o placar, o gráfico e a aba Critérios refazem a conta.</p>' + reguaDw() + '<div class="steps">' + steps3 + '</div>' + cadW + '</details>';
    if (c.pp) h += '<p class="dw-pp">No plano: ' + ppB(c.pp) + (c.ppd ? ' <small>dupla função: ' + esc(c.ppd) + '</small>' : '') + (c.ppw ? '<br><small>' + esc(c.ppw) + '</small>' : '') + '</p>';
    else if (D.plano && D.plano.classificado && !c.cmd && !c.land) h += '<p class="dw-pp"><small>Fora do plano: estrutura.</small></p>';
    h += encaixeHtml(c);
    h += '<details class="dw-8"' + (ui.dw8 ? ' open' : '') + '><summary>Notas por agrupamento (8×8)</summary><div class="steps">' + steps + '</div></details>';
  } else h += '<h3>Notas por agrupamento</h3><div class="steps">' + steps + '</div>';
  h += '<div class="dw-row"><label class="tog"><input type="checkbox" data-act="pet" data-fid="pet"' + (c.pet ? ' checked' : '') + '> <span class="pet">♥</span> PetCard: ' + (IPET >= 0 ? 'soma 1 ponto em ' + esc(G[IPET].sh || G[IPET].k) + (V3 ? ' no 8×8' : '') + ' e fica' : 'fica') + ' fora da fila de corte</label></div>' +
    (c.cand ? '<div class="dw-row"><label class="tog"><input type="checkbox" data-act="tem" data-fid="tem"' + (c.tem ? ' checked' : '') + '> Tenho esta carta</label></div>' : '');
  h += '<h3>Anotações de mesa</h3><textarea class="inp" data-act="nota" data-fid="nota" rows="3" placeholder="Como a carta se saiu, com quem combinou, o que faltou" aria-label="Anotações de mesa">' + esc(c.nota) + '</textarea>';
  h += V3 ? '<div class="dw-sum"><span>Pontuação da carta nos critérios<small>soma no 8×8: ' + pts(c) + '</small></span><b>' + fmtP(pts3(c)) + '</b></div>' :
    '<div class="dw-sum"><span>Pontuação da carta</span><b>' + pts(c) + '</b></div>';
  h += '<div class="dw-links">' +
    (c.edited ? '<button class="linkish" data-act="reset-card" data-fid="rc">Voltar à avaliação original</button>' : '') +
    (c.cand ? '<button class="linkish" data-act="go" data-v="radar">' + (c.inDeck ? 'Ver a troca no radar' : 'Planejar a entrada no radar') + '</button>' :
      (c.cmd ? '' : (c.inDeck ? '<button class="linkish" data-act="cut" data-id="' + esc(c.id) + '" data-fid="ct">Tirar do deck</button>' : '<button class="linkish" data-act="restore" data-id="' + esc(c.id) + '" data-fid="ct">Devolver ao deck</button>'))) +
    '<a href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">Abrir no Scryfall</a>' +
    '<a href="' + esc(liga) + '" target="_blank" rel="noopener noreferrer">Abrir na LigaMagic</a>' +
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
    '<h3>Backup do painel</h3><p>Guarda tiers, relevância, notas, PetCards, anotações, trocas com data e motivo, e as cartas que você adicionou ao radar. Para levar ao projeto, use a aba <button class="linkish" data-act="go" data-v="ofi">Oficina</button>.</p>' +
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

/* ============ critérios (pontuação v3) ============ */
/* Análise separada do 8×8: os dez critérios da régua, com os pontos, a faixa e as cartas de cada um. A faixa conta as
   cartas com nota 2 ou 3; a situação diz quanto vale, numa troca, a carta que entra nesse critério (saturação da régua). */
function situacao(i, x) {
  var f = CR[i].ref, sat = RG.saturacao || {};
  if (!f) return { k: 'ok', t: '' };
  if (x.hard < f[0]) return { k: 'falta', t: 'abaixo da faixa', m: sat.abaixo };
  if (x.hard > f[1]) return { k: 'cheio', t: 'acima da faixa', m: sat.acima };
  return { k: 'ok', t: 'na faixa', m: sat.dentro };
}
function renderCrit() {
  var el = $('#v-crit'); if (!el) return;
  var cs = deck(), st = stats(cs), sn = M.sinergias || {};
  var sins = ['sin1', 'sin2'].map(function (k) {
    var x = sn[k] || {}, i = -1; CR.forEach(function (g, j) { if (g.id === k) i = j; });
    return '<div class="crit-sin" style="--kc:rgb(' + (i >= 0 ? CR[i].cor : 'var(--gold-rgb)') + ')"><h3>' + esc(i >= 0 ? CR[i].k : k) + ': ' + esc(x.nome || 'sem nome') + '</h3>' +
      (x.regra ? '<p>' + esc(x.regra) + '</p>' : '') + '</div>';
  }).join('');
  var apr = sn.aprovado ? 'Aprovadas pelo dono em ' + esc(sn.aprovado) + '.' : 'Ainda sem sua aprovação: as duas sinergias e as notas de Sinergia são propostas.';
  var rows = CR.map(function (g, i) {
    var x = st.c3[i], si = situacao(i, x);
    return '<tr><th scope="row"><button class="linkish" data-act="ver-crit" data-g="' + i + '" data-fid="crl' + i + '"><i class="dot" style="background:rgb(' + g.cor + ')"></i>' + esc(g.k) + '</button></th>' +
      '<td class="num">' + fmt(g.peso, g.peso % 1 ? 1 : 0) + '</td><td class="num"><b>' + x.hard + '</b> +' + x.soft + '</td>' +
      '<td class="num">' + (g.ref ? g.ref[0] + ' a ' + g.ref[1] : '—') + '</td><td><span class="crit-st crit-' + si.k + '">' + si.t + '</span>' + (si.m != null ? ' <small class="num">troca ×' + fmt(si.m, si.m % 1 ? 1 : 0) + '</small>' : '') + '</td>' +
      '<td class="num"><b>' + fmtP(x.pts) + '</b></td><td class="num">' + fmt(st.total ? x.pts / st.total * 100 : 0, 1) + '%</td></tr>';
  }).join('');
  var h = '<fieldset class="pn"><legend>Os ' + NUM[NC] + ' critérios</legend>' +
    '<div class="crit-w"><table class="tbl crit-t"><thead><tr><th>Critério</th><th>Peso</th><th>Cartas</th><th>Faixa</th><th>Situação</th><th>Pontos</th><th>Do placar</th></tr></thead><tbody>' + rows +
    '<tr class="tot-r"><th scope="row">Potencial de aceleração</th><td></td><td></td><td></td><td class="num">' + fmt(st.accX) + '</td><td class="num"><b>' + st.accPts + '</b></td><td class="num">' + fmt(st.total ? st.accPts / st.total * 100 : 0, 1) + '%</td></tr>' +
    '<tr class="tot-r"><th scope="row">Placar do deck</th><td></td><td></td><td></td><td></td><td class="num"><b>' + fmtP(st.total) + '</b></td><td class="num">100%</td></tr></tbody></table></div>' +
    '<p class="pn-note">Cartas: o número em destaque conta as de nota 2 ou 3, que são as que a faixa mede; depois do sinal de mais, as de nota 1. A troca diz quanto vale a carta que entra nesse critério: abaixo da faixa conta mais, acima conta menos.</p></fieldset>' +
    '<fieldset class="pn"><legend>Sinergias deste deck</legend><div class="crit-sins">' + sins + '</div><p class="pn-note">' + apr + '</p>' +
    '<details class="how"><summary>Como a conta é feita</summary>' + comoV3() + '</details></fieldset>';
  // ranking: as cartas pelo valor nos critérios, com a parte de cada uma nos pontos dos critérios
  // filtro do ranking: todas as cartas, sem terrenos ou só terrenos (a posição é contada dentro do filtro)
  var rkf = ui.rkf || 'todas';
  var rk = ranking().filter(function (c) { return rkf === 'todas' || (rkf === 'ter') === !!c.land; }), top10 = 0, pos = 0, ant = null, somaF = 0;
  rk.forEach(function (c, k) { somaF += pts3(c) * c.q; if (k < 10) top10 += pts3(c) * c.q; });
  var nomeF = rkf === 'ter' ? 'os terrenos' : rkf === 'sem' ? 'as cartas que não são terreno' : 'as cartas';
  h += '<fieldset class="pn"><legend>Ranking das cartas</legend><div class="pn-tools"><div class="seg" role="group" aria-label="Quais cartas entram no ranking">' +
    [['todas', 'Todas as cartas'], ['sem', 'Sem terrenos'], ['ter', 'Só terrenos']].map(function (o) {
      return '<button data-act="rk-f" data-v="' + o[0] + '" data-fid="rkf' + o[0] + '" aria-pressed="' + (rkf === o[0]) + '">' + o[1] + '</button>';
    }).join('') + '</div></div>' +
    '<p class="pn-note">Da que mais pontua para a que menos, entre ' + nomeF + ', sem ' + (cs.filter(function (c) { return c.cmd; }).length > 1 ? 'os comandantes' : 'o comandante') + '. ' +
    (rk.length ? (rkf === 'todas' ? 'As dez primeiras somam ' + fmt(st.crit ? top10 / st.crit * 100 : 0, 0) + '% dos pontos dos critérios.' :
      'Juntas, somam ' + fmtP(somaF) + ' pontos, ' + fmt(st.crit ? somaF / st.crit * 100 : 0, 1) + '% dos pontos dos critérios.') : '') +
    (rkf === 'ter' ? ' O placar não mede a base de mana: cor que o terreno gera e entrar virado ficam fora da conta, então terreno básico aparece com zero sem ser carta ruim. A marca "entra virado" ajuda a achar o que atrasa o deck.' : '') +
    ' Toque numa carta para ver e simular as notas.</p>' +
    '<div class="crit-w rk-w"><table class="tbl rk-t"><thead><tr><th>#</th><th>Carta</th><th>Tier</th><th>Relevância</th><th>Pontos</th><th>Dos critérios</th><th>Onde pontua</th></tr></thead><tbody>' +
    rk.map(function (c, k) {
      var v = pts3(c); if (v !== ant) { pos = k + 1; ant = v; }
      var vir = c.land && c.tapped ? '<span class="gt rk-vir" style="--c:160,170,182">entra virado</span>' : '';
      return '<tr><td class="num">' + pos + 'ª</td><th scope="row"><button class="linkish" data-card="' + esc(c.id) + '">' + esc(c.n) + (c.q > 1 ? ' ×' + c.q : '') + '</button></th>' +
        '<td>' + tierB(c.tier) + '</td><td>' + relB(c.rel) + '</td><td class="num"><b>' + fmtP(v) + '</b></td><td class="num">' + fmt(st.crit ? v * c.q / st.crit * 100 : 0, 1) + '%</td><td class="rk-g">' + gtags3(c) + vir + '</td></tr>';
    }).join('') + (rk.length ? '' : '<tr><td colspan="7" class="empty">Nenhuma carta neste filtro.</td></tr>') + '</tbody></table></div></fieldset>';
  h += '<div class="pkg crit-g">' + CR.map(function (g, i) {
    var x = st.c3[i], si = situacao(i, x), por = [[], [], [], []];
    cs.forEach(function (c) { var v = (c.s3 || [])[i] || 0; if (v) por[v].push(c); });
    var lst = [3, 2, 1].map(function (v) {
      if (!por[v].length) return '';
      var l = por[v].sort(function (a, b) { return (TR[a.tier] - TR[b.tier]) || a.n.localeCompare(b.n); });
      var n = 0; l.forEach(function (c) { n += c.q; });
      return '<h4 class="crit-n">Nota ' + v + ' <small>' + pl(n, 'carta', 'cartas') + ', ' + fmtP(ptsCrit(v, i) * n) + ' pts</small></h4><div class="crit-l">' + l.map(function (c) { return chip(c, { tier: true }); }).join('') + '</div>';
    }).join('');
    return '<section class="kcol pk pk-' + si.k + (ui.fc === i ? ' crit-on' : '') + '" id="crit-' + i + '" style="--kc:rgb(' + g.cor + ')"><header><h3>' + esc(g.k) + ' <small>' + fmtP(x.pts) + ' pts</small></h3>' +
      '<p>' + esc(g.d) + (sn[g.id] && sn[g.id].nome ? ' Neste deck: ' + esc(sn[g.id].nome) + '.' : '') + '</p><div class="kn">' + x.hard + ' com nota 2 ou 3' + (g.ref ? ' · faixa ' + g.ref[0] + ' a ' + g.ref[1] + ' · ' + si.t : '') + ' · peso ' + fmt(g.peso, g.peso % 1 ? 1 : 0) + '</div></header>' +
      '<div class="crit-c">' + (lst || '<span class="empty">Nenhuma carta pontua aqui.</span>') + '</div></section>';
  }).join('') + '</div>';
  el.innerHTML = h;
}

/* ============ orquestração ============ */
var RENDER = { geral: renderGeral, gal: renderGal, tier: renderTier, pk: renderPk, tab: renderTab, ctrl: renderCtrl, radar: renderRadar, ofi: renderOfi, crit: renderCrit };
function renderCount() {
  var n = 0; deck().forEach(function (c) { n += c.q; });
  var el = $('#deckCount');
  el.textContent = n === 100 ? '100 cartas' : n + ' cartas, ' + (n > 100 ? 'sobram ' + (n - 100) : 'faltam ' + (100 - n));
  el.className = 'count' + (n === 100 ? '' : ' off');
  var eb = $('#edhBtn');
  if (eb) { var po = poolOpen().length; eb.hidden = !(D.pool && D.pool.length); eb.textContent = 'Potenciais ' + po; }
}
/* os rótulos dos gráficos têm o mesmo tamanho na tela em qualquer largura: o SVG escala com a figura, então a fonte
   em unidades do desenho é multiplicada por --k, a razão entre a largura do viewBox e a largura desenhada */
var RO_ROSA = window.ResizeObserver ? new ResizeObserver(function (es) {
  es.forEach(function (e) { var s = e.target, vb = s.viewBox && s.viewBox.baseVal, w = e.contentRect.width; if (vb && vb.width && w) s.style.setProperty('--k', (vb.width / w).toFixed(3)); });
  quebraRotulos();   // o tamanho do texto mudou com o --k: confere de novo os rótulos que saem da tela
}) : null;
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { quebraRotulos(); });
function escalaRosa() {
  if (RO_ROSA) document.querySelectorAll('figure.rosa svg, .curve svg').forEach(function (s) { RO_ROSA.observe(s); });
  quebraRotulos();
  var tw = $('#tw'); if (tw && !tw.dataset.sombra) { tw.dataset.sombra = 1; tw.addEventListener('scroll', function () { tw.classList.toggle('rolou', tw.scrollLeft > 2); }, { passive: true }); }
}
/* rótulos do gráfico no celular: nome com mais de 14 caracteres que sairia da tela quebra em duas linhas */
function quebraRotulos() {
  if (window.innerWidth > 640) return;
  document.querySelectorAll('figure.rosa svg text').forEach(function (t) {
    var n = t.firstChild, r = t.getBoundingClientRect();
    if (r.left >= 0 && r.right <= window.innerWidth) return;
    if (t.dataset.quebrado || !n || n.nodeType !== 3) { empurra(t); return; }
    var txt = n.nodeValue, meio = txt.length / 2, i = -1;
    for (var k = 0; k < txt.length; k++) if (txt[k] === ' ' && (i < 0 || Math.abs(k - meio) < Math.abs(i - meio))) i = k;
    if (i < 0) { empurra(t); return; }
    var NS = 'http://www.w3.org/2000/svg', x = t.getAttribute('x'), a = document.createElementNS(NS, 'tspan'), b = document.createElementNS(NS, 'tspan');
    a.setAttribute('x', x); a.textContent = txt.slice(0, i);
    b.setAttribute('x', x); b.setAttribute('dy', '1.08em'); b.textContent = txt.slice(i + 1);
    t.replaceChild(b, n); t.insertBefore(a, b);
    // na metade de cima do gráfico, sobe uma linha para o número não entrar no desenho
    var y = parseFloat(t.getAttribute('y')); if (y < 230) t.setAttribute('y', (y - 16).toFixed(1));
    t.dataset.quebrado = 1;
    empurra(t);
  });
}
/* se, mesmo em duas linhas, o rótulo ainda sai da tela, ele desliza para dentro (em unidades do desenho) */
function empurra(t) {
  var r = t.getBoundingClientRect(), sv = t.ownerSVGElement, k = sv.viewBox.baseVal.width / sv.getBoundingClientRect().width, dx = 0;
  if (r.left < 0) dx = -r.left + 2; else if (r.right > window.innerWidth) dx = window.innerWidth - r.right - 2;
  if (!dx) return;
  [t].concat(Array.prototype.slice.call(t.querySelectorAll('tspan[x]'))).forEach(function (e) { var x = e.getAttribute('x'); if (x != null) e.setAttribute('x', (parseFloat(x) + dx * k).toFixed(1)); });
}
function render(keepFocus) {
  var fid = null, a = document.activeElement, tw = $('#tw'), sc = tw ? [tw.scrollTop, tw.scrollLeft] : null;
  if (keepFocus !== false && a && a.dataset) fid = a.dataset.fid || (a.id === 'q' ? '#q' : null);
  hidePeek();
  RENDER[ui.tab](); escalaRosa();
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
    case 'rk-f': ui.rkf = t.dataset.v; render(); break;
    case 'grp-tog': ui.fech[t.dataset.g] = !ui.fech[t.dataset.g]; render(); break;
    case 'grp-all': (function () { var abrir = !TG.some(function (g) { return !ui.fech[g.k]; }); TG.forEach(function (g) { ui.fech[g.k] = !abrir; }); })(); render(); break;
    case 'tab-v': if (ui.tabv !== t.dataset.v) { ui.tabv = t.dataset.v; ui.fg = -1; if (/^g\d/.test(ui.sort.k)) ui.sort = { k: 'n', d: 1 }; } render(); break;
    case 'filter-group': ui.fg = +t.dataset.g; ui.tabv = 'grp'; ui.q = ''; ui.ft = ''; ui.fr = ''; go('tab'); break;
    case 'ver-crit': ui.fc = +t.dataset.g; if (ui.tab === 'crit') render(); else go('crit');
      var ce = $('#crit-' + ui.fc); if (ce) ce.scrollIntoView({ block: 'start', behavior: 'smooth' }); break;
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
    case 'step3':
      c = byId(ui.drawer); o = ov(ui.drawer); o.s3 = (c.s3 || []).slice();
      i = +t.dataset.g;
      o.s3[i] = Math.max(0, Math.min(3, (o.s3[i] || 0) + (+t.dataset.d)));
      commit(); break;
    case 'reset-card':
      o = S.ov[ui.drawer]; if (o) { delete o.s; delete o.s3; delete o.tier; delete o.rel; if (!Object.keys(o).length) delete S.ov[ui.drawer]; }
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
    case 'cf-radar': {   // carta de uma lista de fora (confronto) vai ao radar, para avaliar, com os critérios do cadastro
      var cf = null; (D.confrontos && D.confrontos.listas || []).forEach(function (L) { (L.so_dele || []).forEach(function (x) { if (x.id === id) cf = x; }); });
      if (!cf) break;
      if (byId(id)) { toast(cf.n + ' já está no radar'); break; }
      S.custom.push({ id: cf.id, n: cf.n, q: 1, cost: cf.cost || '', cmc: cf.cmc || 0, t: cf.t || 'cri', g: GROUP_OF[cf.t || 'cri'], line: cf.line, pt: cf.pt, col: cf.col || 'C',
        s: G.map(function () { return 0; }), tier: 'B', rel: 'MED', fx: cf.fx || '', why: '', orig: 1, cand: 1, custom: 1, verdict: 'avaliar', mk: {}, land: cf.land ? 1 : 0, s3: V3 ? cf.s3.slice() : undefined });
      commit(cf.n + ' entrou no radar, para avaliar'); break;
    }
    case 'add-custom':
      var name = $('#nc-n').value.trim();
      if (!name) { toast('Informe o nome da carta'); $('#nc-n').focus(); break; }
      var pc = parseCost($('#nc-c').value), tk = $('#nc-t').value, ty = TYPES.filter(function (x) { return x.k === tk; })[0], sc = [];
      for (i = 0; i < NG; i++) sc.push(+$('#nc-g' + i).value || 0);
      var s3n = []; if (V3) for (i = 0; i < NC; i++) s3n.push(+$('#nc-c' + i).value || 0);
      var tb = TRIBO && $('#nc-v') ? $('#nc-v').checked : false;
      S.custom.push({ id: 'x-' + slug(name) + '-' + Date.now().toString(36), n: name, q: 1, cost: tk === 'ter' ? '' : pc.cost, cmc: tk === 'ter' ? 0 : pc.cmc, t: tk, g: GROUP_OF[tk],
        line: ty.o + (tb ? ' — ' + TRIBO.nome : ''), col: tk === 'ter' ? 'L' : pc.col, s: sc, tier: $('#nc-tier').value, rel: 'MED', fx: '', why: $('#nc-w').value.trim(),
        cand: 1, custom: 1, verdict: 'avaliar', mk: tb ? { tribo: 1 } : {}, land: tk === 'ter' ? 1 : 0, s3: V3 ? s3n : undefined });
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
  else if (a === 'nota') { o = ov(ui.drawer); if (t.value.trim()) o.nota = t.value; else delete o.nota; save(); }
  else if (a === 'motivo') { var sw = S.swaps[+t.dataset.i]; if (sw) { sw.m = t.value; save(); } }
});
function ofField(t) {
  var k = t.dataset.of; ui.of[k] = ui.of[k] || {}; ui.of[k][t.dataset.k] = t.value.trim();
  OF.forEach(function (o) { if (o.k === k) updOf(o); });
}
document.addEventListener('input', function (ev) {
  if (ev.target.id === 'q') { ui.q = ev.target.value; var tb = $('#tbody'); if (tb) tb.innerHTML = comTabC(tabRows); }
  else if (ev.target.dataset && ev.target.dataset.of) ofField(ev.target);
});
document.addEventListener('keydown', function (ev) {
  hidePeek();
  if (ev.key === 'Escape' && (ui.drawer || ui.modal)) { closeAll(); return; }
  var t = ev.target;
  if ((ev.key === 'Enter' || ev.key === ' ') && t.matches && t.matches('.chip,.petal,.wedge,.pena,.lapide,tr.row,tr.grp,.gtile,.cand-img')) { ev.preventDefault(); t.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
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
/* a gaveta é redesenhada a cada nota: o bloco do 8×8 lembra se estava aberto */
document.addEventListener('toggle', function (e) {
  var l = e.target.classList; if (!l || !l.contains('dw-8')) return;
  if (l.contains('dw-c3')) ui.dwc3 = e.target.open; else if (l.contains('dw-enc')) ui.dwenc = e.target.open; else ui.dw8 = e.target.open;
}, true);
if (!V3) ['#t-crit', '#v-crit'].forEach(function (q) { var x = $(q); if (x) x.parentNode.removeChild(x); });   /* aba Critérios só no deck v3 */
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
