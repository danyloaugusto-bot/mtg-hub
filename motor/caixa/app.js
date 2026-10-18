/* A Caixa (motor/caixa.py monta os dados; este arquivo só desenha e grava as decisões).
   A única página que mostra preço: exceção à decisão "Sem preço" de 14/10/2026, só aqui (dono, 17/10/2026).
   Decisão cópia a cópia, gravada no banco da Caixa publicada (coleção "decisoes", um documento por carta). */
var D = /*__DATA__*/null;
var R = D.regua, CR = D.crit, DECKS = D.decks, ORS = D.origens;
var O = ORS[0], CARTAS = O.cartas;   // a origem na tela: a Caixa ou uma pasta (motor/caixa.py, origens)
var LS = 'mtg-hub:caixa:v1';
var ui = { ver: 'tabela', agrupar: 'prioridade', ord: 'padrao', inv: false, dec: 'pendentes', tipos: [], cores: [], faixas: [], fechados: {}, deck: '', origem: '', q: '' };
try {
  var g = JSON.parse(localStorage.getItem(LS) || '{}');
  ['ver', 'agrupar', 'ord', 'dec', 'deck', 'origem'].forEach(function (k) { if (g[k]) ui[k] = g[k]; });
  ui.inv = !!g.inv;
  if (Array.isArray(g.tipos)) ui.tipos = g.tipos; else if (g.tipo) ui.tipos = [g.tipo];   // o seletor antigo guardava um tipo só
  if (Array.isArray(g.cores)) ui.cores = g.cores;
  if (Array.isArray(g.faixas)) ui.faixas = g.faixas;
  if (g.fechados && typeof g.fechados === 'object') ui.fechados = g.fechados;
} catch (e) { }
function guardaUI() { try { localStorage.setItem(LS, JSON.stringify({ ver: ui.ver, agrupar: ui.agrupar, ord: ui.ord, inv: ui.inv, dec: ui.dec, tipos: ui.tipos, cores: ui.cores, faixas: ui.faixas, fechados: ui.fechados, deck: ui.deck, origem: ui.origem })); } catch (e) { } }

var DB = { db: null, pode: false, docs: {}, erro: '', ocupado: {} };   // docs: {coleção: {id: documento}}
var PUB = location.protocol !== 'file:';
var aberta = null;   // id da carta na gaveta

function $(s) { return document.querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
function pl(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
function fmt(v, casas) {
  if (v == null) return '—';
  casas = casas == null ? 1 : casas;
  var s = Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: casas });
  return s;
}
function usd(v) { return v == null ? 'sem preço' : 'US$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function brl(v) { return (R.cambio_brl && v != null) ? ' <small class="dim">≈ R$ ' + Number(v * R.cambio_brl).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</small>' : ''; }
function sinal(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v)); }
function slug(s) { return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function hojeISO() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function tierB(t) { return t ? '<span class="tb t' + esc(t) + '">' + esc(t) + '</span>' : ''; }
function curto(p) { return DECKS[p] ? DECKS[p].c : p; }
var NOMED = { deck: 'Deck', guardar: 'Guardar', venda: 'Venda', bundles: 'Bundles', bulk: 'Bulk', remover: 'Remover' };
function nomeD(d) { return d === 'guardar' && O.k !== 'Caixa' ? 'Manter' : NOMED[d]; }   // numa pasta, guardar é ficar onde está
function eCaixa() { return O.k === 'Caixa'; }
function usarOrigem(k) {
  O = ORS.filter(function (x) { return x.k === k; })[0] || ORS[0]; CARTAS = O.cartas; ui.origem = O.k;
  $('#cx-tit').textContent = eCaixa() ? 'Caixa' : 'Pasta ' + O.k;
  document.title = eCaixa() ? 'Caixa' : 'Pasta ' + O.k;
}
var ORDD = ['deck', 'guardar', 'venda', 'bundles', 'bulk'], ORDP = ['S', 'A', 'B', 'C'];
/* faixa de valor de cada cópia: os cortes são os da régua (venda a partir de US$ 5, capital parado a partir de US$ 20), mais US$ 1 */
var FAIXAS = ['f20', 'f5', 'f1', 'f0', 'fn'];
function faixaDe(v) { return v == null ? 'fn' : v >= R.capital_usd ? 'f20' : v >= R.venda_usd_min ? 'f5' : v >= 1 ? 'f1' : 'f0'; }
function nomeFaixa(k) {
  return { f20: usd(R.capital_usd) + ' ou mais', f5: usd(R.venda_usd_min) + ' a ' + usd(R.capital_usd), f1: usd(1) + ' a ' + usd(R.venda_usd_min), f0: 'Abaixo de ' + usd(1), fn: 'Sem preço' }[k];
}
var TIPOS = [['cri', 'Criaturas'], ['ins', 'Mágicas instantâneas'], ['fei', 'Feitiços'], ['art', 'Artefatos'], ['enc', 'Encantamentos'], ['pw', 'Planeswalkers'], ['bat', 'Batalhas'], ['ter', 'Terrenos']];
var NOMEC = { '': 'Incolor', W: 'Mono-branco', U: 'Mono-azul', B: 'Mono-preto', R: 'Mono-vermelho', G: 'Mono-verde',
  WU: 'Azorius', UB: 'Dimir', BR: 'Rakdos', RG: 'Gruul', WG: 'Selesnya', WB: 'Orzhov', UR: 'Izzet', BG: 'Golgari', WR: 'Boros', UG: 'Simic',
  WUB: 'Esper', UBR: 'Grixis', BRG: 'Jund', WRG: 'Naya', WUG: 'Bant', WBG: 'Abzan', WUR: 'Jeskai', UBG: 'Sultai', WBR: 'Mardu', URG: 'Temur',
  UBRG: 'Glint', WBRG: 'Dune', WURG: 'Ink', WUBG: 'Witch', WUBR: 'Yore', WUBRG: 'WUBRG' };
var CORES = [['W', 'Branco'], ['U', 'Azul'], ['B', 'Preto'], ['R', 'Vermelho'], ['G', 'Verde'], ['M', 'Multicolorido'], ['C', 'Incolor']];
function corDe(c) { var k = ordemCor(c.ident || ''); return !k ? 'C' : k.length > 1 ? 'M' : k; }
var SVG = {
  W: '<circle cx="16" cy="16" r="5.2"/><g>' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<path d="M16 3.6l1.9 5.4h-3.8z" transform="rotate(' + a + ' 16 16)"/>'; }).join('') + '</g>',
  U: '<path d="M16 5.5c0 0-7 8.6-7 13.6a7 7 0 0 0 14 0c0-5-7-13.6-7-13.6z"/>',
  B: '<path d="M16 6.5c-5.2 0-8.6 3.7-8.6 8.3 0 2.8 1.3 4.8 3.2 6v3.7h2.6v-2h1.5v2h2.6v-2h1.5v2h2.6v-3.7c1.9-1.2 3.2-3.2 3.2-6 0-4.6-3.4-8.3-8.6-8.3z"/><circle cx="12.6" cy="15.2" r="2.2" class="vz"/><circle cx="19.4" cy="15.2" r="2.2" class="vz"/>',
  R: '<path d="M16.8 4.8c.6 4.3 6.6 6.4 6.6 12.7a7.4 7.4 0 0 1-14.8 0c0-3.4 2-5.7 3.7-7 .1 2.2 1.1 3.5 2.4 3.9-.4-3.6.3-6.9 2.1-9.6z"/>',
  G: '<path d="M16 5.5a6.6 6.6 0 0 0-6.5 7.6 5 5 0 0 0 4.7 7.4h.3V25h-3v1.8h9V25h-3v-4.5h.3a5 5 0 0 0 4.7-7.4A6.6 6.6 0 0 0 16 5.5z"/>',
  C: '<path d="M16 7l7.2 9-7.2 9-7.2-9z" fill="none" stroke-width="2.4"/>'
};
function icone(k, rot) {
  if (k === 'M') return '<span class="cx-mi cx-mi-M" aria-hidden="true"></span>';
  return '<svg class="cx-mi cx-mi-' + k + '" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" class="bg"/><g class="fg">' + SVG[k] + '</g></svg>';
}
function ordemCor(s) { return 'WUBRG'.split('').filter(function (k) { return s.indexOf(k) >= 0; }).join(''); }
function msym(s) { var k = s.toUpperCase(); if (/^[WUBRG]$/.test(k)) return '<i class="ms ms-' + k + '">' + k + '</i>'; return '<i class="ms ms-C">' + esc(s) + '</i>'; }
function mana(cost) { return cost ? '<span class="cx-cost">' + cost.replace(/\s/g, '').split('//')[0].replace(/\{([^}]+)\}/g, function (m, s) { return msym(s.replace('/', '')); }) + '</span>' : ''; }

/* ---------- decisões: o banco publicado prevalece sobre o arquivo ---------- */
function decisoesDe(c) {
  var dd = DB.docs[O.col], d = dd && dd[c.id] ? dd[c.id] : (O.dec[c.n] || null);
  return ((d && d.copias) || []).filter(function (x) { return !x.aplicado; });
}
/* a decisão de cada cópia: cópias de mesma impressão e acabamento são intercambiáveis, então casam pela ordem */
function decCopias(c) {
  var ds = decisoesDe(c).slice(), out = [];
  c.copias.forEach(function (cp) {
    var i = -1;
    for (var k = 0; k < ds.length; k++) if (ds[k] && ds[k].imp === cp.imp && (ds[k].acab || 'normal') === cp.acab) { i = k; break; }
    out.push(i >= 0 ? ds[i] : null);
    if (i >= 0) ds[i] = null;
  });
  return out;
}
/* as cópias que a lista mostra, pelo filtro de decisão (pendentes, decididas ou todas) */
function visCopias(c) {
  var dc = decCopias(c), out = [];
  c.copias.forEach(function (cp, i) {
    var feita = !!(dc[i] && dc[i].destino);
    if (ui.dec !== 'todas' && (ui.dec === 'pendentes') === feita) return;
    if (ui.faixas.length && ui.faixas.indexOf(faixaDe(cp.usd)) < 0) return;
    out.push(i);
  });
  return out;
}
/* a vista de uma carta num grupo: só as cópias que caem nele, com a quantidade e o valor delas */
function vista(c, idx) {
  var v = Object.create(c);
  v.parte = idx; v.q = idx.length;
  v.valor = Math.round(idx.reduce(function (s, i) { return s + (c.copias[i].usd || 0); }, 0) * 100) / 100;
  return v;
}
function cps(c) { return c.parte ? c.parte.map(function (i) { return c.copias[i]; }) : c.copias; }
function prioCarta(c) {
  var best = 'C';
  (c.parte || visCopias(c)).forEach(function (i) { var P = c.copias[i].sug.P; if (ORDP.indexOf(P) < ORDP.indexOf(best)) best = P; });
  return best;
}
function sugCarta(c) {
  if (c.parte) return c.copias[c.parte[0]].sug;
  var dc = decCopias(c);
  for (var i = 0; i < c.copias.length; i++) if (!(dc[i] && dc[i].destino)) return c.copias[i].sug;
  return c.copias[0].sug;
}

function visiveis() {
  var q = ui.q.trim().toLowerCase();
  return CARTAS.filter(function (c) {
    if (!visCopias(c).length) return false;   // nenhuma cópia passa no filtro de decisão e de faixa de valor
    if (ui.tipos.length && ui.tipos.indexOf(c.t) < 0) return false;
    if (ui.agrupar === 'cor' && !ui.deck && ui.cores.length && ui.cores.indexOf(corDe(c)) < 0) return false;
    if (ui.deck && !encDe(c, ui.deck)) return false;   // só as cartas nas cores do comandante (o encaixe só existe nelas)
    if (q && c.n.toLowerCase().indexOf(q) < 0 && (c.on || '').toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
}
/* ordenar: o critério vale dentro de cada grupo; a seta inverte */
var ORDS = [['padrao', ''], ['valor', 'Valor'], ['forca', 'Força sozinha'], ['ganho', 'Ganho no deck'], ['cmc', 'Custo de mana'], ['cor', 'Cor'], ['edhrec', 'Posição no EDHREC'], ['tipo', 'Tipo'], ['nome', 'Nome']];
function nomeOrd(k) { return k === 'padrao' ? (ui.deck ? 'Ganho no deck' : 'Prioridade e valor') : ORDS.filter(function (x) { return x[0] === k; })[0][1]; }
var SETA = { padrao: '↓', valor: '↓', forca: '↓', ganho: '↓', cmc: '↑', cor: '↑', edhrec: '↑', tipo: '↑', nome: '↑' };   // o sentido natural de cada critério
function setaOrd() { var s = SETA[ui.ord] || '↓'; return ui.inv ? (s === '↓' ? '↑' : '↓') : s; }
function melhorEnc(c) {   // o deck da sugestão; sem sugestão de deck, o de maior ganho que não é precon, Desejo nem já tem a carta
  var s = sugCarta(c);
  if (s.p) { var e = encDe(c, s.p); if (e) return e; }
  return c.enc.filter(function (x) { return !x.pre && !x.des && !x.j; })[0] || null;
}
function ganhoOrd(c) { var e = ui.deck ? encDe(c, ui.deck) : melhorEnc(c); return e ? e.g : -1e9; }
function tipoIdx(c) { for (var i = 0; i < TIPOS.length; i++) if (TIPOS[i][0] === c.t) return i; return 99; }
function corKey(c) { var k = ordemCor(c.ident || ''); return 'WUBRGMC'.indexOf(corDe(c)) + ':' + k.length + ':' + k.split('').map(function (x) { return 'WUBRG'.indexOf(x); }).join(''); }
function compara(a, b) {
  var k = ui.ord, r = 0;
  if (k === 'padrao') r = ui.deck ? ganhoOrd(b) - ganhoOrd(a) : (ORDP.indexOf(prioCarta(a)) - ORDP.indexOf(prioCarta(b)) || (b.valor || 0) - (a.valor || 0));
  else if (k === 'valor') r = (b.valor || 0) - (a.valor || 0);
  else if (k === 'forca') r = b.vp - a.vp || (a.rank || 1e9) - (b.rank || 1e9);
  else if (k === 'ganho') r = ganhoOrd(b) - ganhoOrd(a);
  else if (k === 'cmc') r = (a.t === 'ter' ? 99 : a.cmc) - (b.t === 'ter' ? 99 : b.cmc);   // terrenos no fim
  else if (k === 'cor') r = corKey(a) < corKey(b) ? -1 : corKey(a) > corKey(b) ? 1 : 0;
  else if (k === 'edhrec') r = (a.rank || 1e9) - (b.rank || 1e9);
  else if (k === 'tipo') r = tipoIdx(a) - tipoIdx(b);
  else if (k === 'nome') r = (a.on || a.n).localeCompare(b.on || b.n, 'en');
  if (ui.inv) r = -r;
  return r || (a.on || a.n).localeCompare(b.on || b.n, 'en');
}
function encDe(c, p) { for (var i = 0; i < c.enc.length; i++) if (c.enc[i].p === p) return c.enc[i]; return null; }
function radarDe(c, p) { for (var i = 0; i < c.radares.length; i++) if (c.radares[i].p === p) return c.radares[i]; return null; }
/* a vista "Para o deck": os blocos pelo encaixe naquele deck, do maior ganho para o menor */
var FOCO = [['entra', 'Entram agora'], ['alto', 'Ganho alto, sinergia a avaliar'], ['meio', 'Para avaliar'], ['baixo', 'Ganho baixo'], ['ja', 'Já estão no deck']];
function focoDe(c, p) {
  var e = encDe(c, p), rd = radarDe(c, p);
  if (e.j) return 'ja';
  if ((rd && rd.v === 'entra') || (e.a && e.g >= R.deck_ganho_min)) return 'entra';
  if (rd && rd.v === 'fora') return 'baixo';
  if (e.g >= R.deck_ganho_min) return 'alto';
  if (e.g >= R.guardar_ganho_min) return 'meio';
  return 'baixo';
}
function gruposFoco(L) {
  var p = ui.deck;
  var dicas = { entra: 'o radar já pede, ou ganho de ' + fmt(R.deck_ganho_min) + ' ou mais com a sinergia avaliada',
    alto: 'ganho de ' + fmt(R.deck_ganho_min) + ' ou mais, mas o deck nunca avaliou a carta: o número é piso',
    meio: 'ganho de ' + fmt(R.guardar_ganho_min) + ' a ' + fmt(R.deck_ganho_min),
    baixo: 'ganho abaixo de ' + fmt(R.guardar_ganho_min) + ', ou recusada no radar', ja: 'a cópia da caixa seria uma segunda' };
  return FOCO.map(function (f, i) {
    var cs = L.filter(function (c) { return focoDe(c, p) === f[0]; }).map(function (c) { return vista(c, visCopias(c)); }).sort(compara);
    return { k: f[0], n: f[1], o: i, cs: cs, dica: dicas[f[0]] };
  }).filter(function (g) { return g.cs.length; });
}
var ORDG = ORDD.concat(['remover']);
/* prioridade, destino e deck são de cada cópia: uma carta com cópias em destinos diferentes aparece em cada grupo, com as cópias dele */
function chaveCopia(c, i) {
  var s = c.copias[i].sug, d = decCopias(c)[i], feita = d && d.destino;
  if (ui.agrupar === 'prioridade') return { k: s.P, n: 'Prioridade ' + s.P, o: ORDP.indexOf(s.P) };
  if (ui.agrupar === 'destino') { var dd = feita ? d.destino : s.d; return { k: dd, n: nomeD(dd), o: ORDG.indexOf(dd) }; }
  if (ui.agrupar === 'faixa') { var f = faixaDe(c.copias[i].usd); return { k: f, n: nomeFaixa(f), o: FAIXAS.indexOf(f) }; }
  var dk = feita ? (d.destino === 'deck' ? d.deck || '' : '') : (s.d === 'deck' && s.p ? s.p : '');
  return { k: 'd' + dk, n: dk ? curto(dk) + (DECKS[dk] ? ' · ' + DECKS[dk].n : '') : 'Sem deck sugerido', o: dk ? 0 : 1 };
}
function grupos(L) {
  if (ui.deck && DECKS[ui.deck]) return gruposFoco(L);
  var g = {}, ordem = [];
  function add(k, nome, ord, c) { if (!g[k]) { g[k] = { k: k, n: nome, o: ord, cs: [] }; ordem.push(k); } g[k].cs.push(c); }
  L.forEach(function (c) {
    var idx = visCopias(c);
    if (ui.agrupar === 'prioridade' || ui.agrupar === 'destino' || ui.agrupar === 'deck' || ui.agrupar === 'faixa') {
      var por = {}, ks = [];
      idx.forEach(function (i) { var k = chaveCopia(c, i); if (!por[k.k]) { por[k.k] = { g: k, idx: [] }; ks.push(k.k); } por[k.k].idx.push(i); });
      ks.forEach(function (k) { add(por[k].g.k, por[k].g.n, por[k].g.o, vista(c, por[k].idx)); });
    }
    else if (ui.agrupar === 'tipo') { var t = TIPOS.filter(function (x) { return x[0] === c.t; })[0] || ['?', 'Outros']; add(t[0], t[1], TIPOS.indexOf(t), vista(c, idx)); }
    else if (ui.agrupar === 'cor') { var k = corDe(c), ic = CORES.filter(function (x) { return x[0] === k; })[0]; add('c' + k, ic[1], CORES.indexOf(ic), vista(c, idx)); }
    else add('todas', 'Todas as cartas', 0, vista(c, idx));
  });
  var out = ordem.map(function (k) { return g[k]; });
  out.sort(function (a, b) { return a.o - b.o || a.n.localeCompare(b.n, 'pt-BR'); });
  out.forEach(function (x) { x.cs.sort(compara); });
  return out;
}
function valorGrupo(cs) { return cs.reduce(function (s, c) { return s + (c.valor || 0); }, 0); }

/* ---------- resumo e controles ---------- */
function resumo() {
  var pri = { S: [0, 0], A: [0, 0], B: [0, 0], C: [0, 0] }, dest = {}, parado = 0, decid = 0;
  ORDD.forEach(function (d) { dest[d] = [0, 0]; });
  CARTAS.forEach(function (c) {
    var dc = decCopias(c);
    c.copias.forEach(function (cp, i) {
      if (dc[i] && dc[i].destino) { decid++; return; }
      var s = cp.sug, v = cp.usd || 0;
      pri[s.P][0]++; pri[s.P][1] += v; dest[s.d][0]++; dest[s.d][1] += v;
      if (cp.usd != null && cp.usd >= R.capital_usd && s.d !== 'deck') parado++;
    });
  });
  var it = function (b, t, z) { return '<span class="it' + (z ? ' z' : '') + '"><b class="num">' + b + '</b> ' + t + '</span>'; };
  var r = O.resumo;
  return '<div class="seg"><span class="seg-l">Prioridade</span>' + ORDP.map(function (p) { return it(pri[p][0] + ' ' + p, '', !pri[p][0]); }).join('') + '</div>' +
    '<div class="seg"><span class="seg-l">Sugestão</span>' + ORDD.map(function (d) { return it(dest[d][0] ? usd(dest[d][1]) : '—', nomeD(d) + ' <small class="dim">' + dest[d][0] + '</small>', !dest[d][0]); }).join('') + '</div>' +
    '<div class="seg">' + it(parado, 'capital parado (≥ ' + usd(R.capital_usd) + ' sem deck)', !parado) + it(decid, 'decididas', !decid) +
    it(r.sem_cadastro.length, 'sem cadastro', !r.sem_cadastro.length) + it(r.nao_encontradas.length, 'não encontradas', !r.nao_encontradas.length) + '</div>';
}
function seg(rot, campo, ops) {
  return '<div class="seg" role="group" aria-label="' + rot + '"><span class="seg-l">' + rot + '</span>' + ops.map(function (o) {
    return '<button data-act="ui" data-k="' + campo + '" data-v="' + o[0] + '" aria-pressed="' + (ui[campo] === o[0]) + '">' + o[1] + '</button>';
  }).join('') + '</div>';
}
/* o seletor de tipo, ao lado da busca: só os tipos que existem na caixa, com a quantidade de cartas */
function seletorDeck() {
  return '<label class="cmp-s cx-fd"><span class="seg-l">Para o deck</span><select data-ctl="deck" aria-label="Ver as cartas para um deck"><option value="">Todos os decks</option>' +
    Object.keys(DECKS).filter(function (p) { return !DECKS[p].desejo; }).sort().map(function (p) {
      var n = CARTAS.filter(function (c) { return encDe(c, p); }).length;
      return '<option value="' + esc(p) + '"' + (ui.deck === p ? ' selected' : '') + '>' + esc(p) + ' (' + n + ')' + (DECKS[p].precon ? ' · precon' : '') + '</option>';
    }).join('') + '</select></label>';
}
/* tipo: lista suspensa de múltipla escolha, com a quantidade de cada tipo na origem e um botão de limpar */
var ddAberta = false;
function seletorTipo() {
  var n = {}; CARTAS.forEach(function (c) { n[c.t] = (n[c.t] || 0) + 1; });
  ui.tipos = ui.tipos.filter(function (t) { return n[t]; });
  var nomes = TIPOS.filter(function (t) { return ui.tipos.indexOf(t[0]) >= 0; }).map(function (t) { return t[1]; });
  var rot = !nomes.length ? 'Todos' : nomes.length === 1 ? nomes[0] : nomes.length + ' tipos';
  return '<details class="cx-dd"' + (ddAberta ? ' open' : '') + '><summary><span class="seg-l">Tipo</span><b>' + esc(rot) + '</b><span class="cx-dd-s" aria-hidden="true">▾</span></summary><div class="cx-dd-p">' +
    TIPOS.filter(function (t) { return n[t[0]]; }).map(function (t) {
      return '<label><input type="checkbox" data-ctl="tipo" value="' + t[0] + '"' + (ui.tipos.indexOf(t[0]) >= 0 ? ' checked' : '') + '> ' + t[1] + ' <span class="dim">' + n[t[0]] + '</span></label>';
    }).join('') + '<button class="bt-c" data-act="tipos-limpar"' + (ui.tipos.length ? '' : ' disabled') + '>Limpar</button></div></details>';
}
function botoesCor() {
  var n = {}; CARTAS.forEach(function (c) { var k = corDe(c); n[k] = (n[k] || 0) + 1; });
  return '<div class="seg cx-cores" role="group" aria-label="Cores"><span class="seg-l">Cores</span>' + CORES.map(function (x) {
    var on = ui.cores.indexOf(x[0]) >= 0;
    return '<button data-act="cor" data-v="' + x[0] + '" aria-pressed="' + on + '" title="' + x[1] + ' (' + (n[x[0]] || 0) + ')"' + (n[x[0]] ? '' : ' disabled') + '>' + icone(x[0]) + '<span>' + x[1] + '</span></button>';
  }).join('') + (ui.cores.length ? '<button class="cx-limpa" data-act="cores-limpar">Limpar</button>' : '') + '</div>';
}
function seletorOrdem() {
  return '<div class="seg cx-ord" role="group" aria-label="Ordenar"><label class="cmp-s"><span class="seg-l">Ordenar</span><select data-ctl="ord" aria-label="Ordenar por">' +
    ORDS.map(function (o) { return '<option value="' + o[0] + '"' + (ui.ord === o[0] ? ' selected' : '') + '>' + esc(nomeOrd(o[0])) + '</option>'; }).join('') +
    '</select></label><button data-act="ord-inv" aria-label="Inverter a ordem" title="Inverter a ordem">' + setaOrd() + '</button></div>';
}
function botoesFaixa() {
  var n = {}, v = {};
  CARTAS.forEach(function (c) {
    var dc = decCopias(c);
    c.copias.forEach(function (cp, i) {
      var feita = !!(dc[i] && dc[i].destino);
      if (ui.dec !== 'todas' && (ui.dec === 'pendentes') === feita) return;
      var f = faixaDe(cp.usd); n[f] = (n[f] || 0) + 1; v[f] = (v[f] || 0) + (cp.usd || 0);
    });
  });
  return '<div class="seg cx-fx" role="group" aria-label="Faixa de valor"><span class="seg-l">Valor</span>' + FAIXAS.map(function (k) {
    var on = ui.faixas.indexOf(k) >= 0;
    return '<button data-act="faixa" data-v="' + k + '" aria-pressed="' + on + '"' + (n[k] ? '' : ' disabled') + ' title="' + pl(n[k] || 0, 'cópia', 'cópias') + (v[k] ? ', ' + usd(v[k]) : '') + '">' + esc(nomeFaixa(k)) + ' <small>' + (n[k] || 0) + '</small></button>';
  }).join('') + (ui.faixas.length ? '<button class="cx-limpa" data-act="faixas-limpar">Limpar</button>' : '') + '</div>';
}
function seletorOrigem() {
  if (ORS.length < 2) return '';
  return '<label class="cmp-s cx-fo2"><span class="seg-l">Lista</span><select data-ctl="origem" aria-label="Caixa ou pasta"><option value="Caixa"' + (eCaixa() ? ' selected' : '') + '>Caixa (' + ORS[0].cartas.length + ')</option>' +
    ORS.slice(1).map(function (o) { return '<option value="' + esc(o.k) + '"' + (O.k === o.k ? ' selected' : '') + '>Pasta ' + esc(o.k) + ' (' + o.cartas.length + ')</option>'; }).join('') + '</select></label>';
}
function controles() {
  return seletorOrigem() + seletorDeck() + seletorTipo() + seg('Ver', 'ver', [['tabela', 'Tabela'], ['galeria', 'Galeria']]) +
    (ui.deck ? '' : seg('Agrupar', 'agrupar', [['prioridade', 'Prioridade'], ['tipo', 'Tipo'], ['destino', 'Destino'], ['cor', 'Cor'], ['deck', 'Deck'], ['faixa', 'Valor'], ['nenhum', 'Nenhum']])) +
    seletorOrdem() +
    seg('Decisão', 'dec', [['pendentes', 'Pendentes'], ['decididas', 'Decididas'], ['todas', 'Todas']]) +
    botoesFaixa() +
    (ui.agrupar === 'cor' && !ui.deck ? botoesCor() : '');
}
/* cada grupo recolhe e expande pelo cabeçalho; a escolha fica no navegador, por modo de agrupar */
function chaveGrupo(gr) { return (ui.deck ? 'deck:' + ui.deck : ui.agrupar) + ':' + gr.k; }
function fechado(gr) { return !!ui.fechados[chaveGrupo(gr)]; }
function cabGrupo(gr) {
  var f = fechado(gr), ic = ui.agrupar === 'cor' && !ui.deck && /^c[WUBRGMC]$/.test(gr.k) ? icone(gr.k.slice(1)) + ' ' : '';
  return '<button class="cx-tg" data-act="grupo" data-g="' + esc(chaveGrupo(gr)) + '" aria-expanded="' + !f + '"><span class="cx-tg-s" aria-hidden="true">' + (f ? '▸' : '▾') + '</span>' + ic + esc(gr.n) + '</button>';
}

/* ---------- pedaços de uma carta ---------- */
function forca(c) {
  return '<b class="num">' + fmt(c.vp) + '</b>' + (c.gc ? ' <span class="cx-gc" title="Game Changer">GC</span>' : '') + (c.staple ? ' <span class="cx-st" title="top ' + R.staple_rank_max + ' do EDHREC">Staple</span>' : '') +
    '<small>' + (c.rank ? '#' + fmt(c.rank, 0) + ' no EDHREC' : 'fora do ranking do EDHREC') + '</small>';
}
function valorTxt(c) {
  var foil = cps(c).filter(function (x) { return x.acab !== 'normal'; });
  return '<b class="num">' + usd(c.valor) + '</b>' + brl(c.valor) + (c.q > 1 ? '<small>' + c.q + ' cópias</small>' : '') +
    (foil.length ? '<small>' + foil.map(function (x) { return x.acab; }).join(', ') + '</small>' : '');
}
function sugTxt(s) {
  var h = '<span class="cx-dest cx-d-' + s.d + '">' + nomeD(s.d) + '</span>' + (s.p ? esc(curto(s.p)) : '');
  if (s.T) h += ' ' + tierB(s.T);
  if (s.v) h += ' <span class="vd vd-' + s.v + '">radar: ' + s.v + '</span>';
  if (s.sai) h += '<small>sai ' + esc(s.sai) + '</small>';
  (s.marcas || []).forEach(function (m) { h += '<span class="cx-mc">' + esc(m) + '</span>'; });
  return h;
}
function ganhoTxt(c, s) {
  var e = s.p ? c.enc.filter(function (x) { return x.p === s.p; })[0] : (c.enc.filter(function (x) { return !x.pre && !x.des && !x.j; })[0]);
  if (!e) return '<span class="dim">—</span>';
  return '<b class="num ' + (e.g > 0 ? 'cx-pos' : e.g < 0 ? 'cx-neg' : '') + '">' + sinal(e.g) + '</b>' + (e.a ? '' : '<span class="cx-ast" title="sinergia ainda não avaliada: o número é piso">*</span>') +
    (s.p ? '' : '<small>' + esc(curto(e.p)) + '</small>');
}
function ganhoFoco(c) {
  var e = encDe(c, ui.deck), rd = radarDe(c, ui.deck);
  if (!e) return '<span class="dim">—</span>';
  return '<b class="num ' + (e.g > 0 ? 'cx-pos' : e.g < 0 ? 'cx-neg' : '') + '">' + sinal(e.g) + '</b>' + (e.a ? '' : '<span class="cx-ast" title="sinergia ainda não avaliada: o número é piso">*</span>') +
    '<small>' + (e.j ? 'já está no deck' : 'sai ' + esc(e.s || '—')) + '</small>' + (rd ? '<small><span class="vd vd-' + esc(rd.v) + '">radar: ' + esc(rd.v) + '</span></small>' : '');
}
function jaTxt(c) {
  var cp0 = cps(c)[0];
  var h = c.em_decks.map(function (x) {
    var mesma = x.imp && cp0.imp ? (x.imp === cp0.imp ? 'mesma?' : 'outra impressão') : '';
    return '<span>' + esc(curto(x.p)) + ' ' + tierB(x.T) + (mesma ? '<small>' + mesma + '</small>' : '') + '</span>';
  }).join(' ');
  if (c.pastas.length) h += '<small>na pasta ' + c.pastas.map(function (x) { return esc(x.p); }).join(', ') + '</small>';
  return h || '<span class="dim">—</span>';
}
function decTxt(c) {
  var dc = decCopias(c);
  return '<div class="cx-dec">' + c.copias.map(function (cp, i) {
    if (c.parte && c.parte.indexOf(i) < 0) return '';
    var d = dc[i], s = cp.sug;
    var rot = d && d.destino ? (i + 1) + ' ✓ ' + nomeD(d.destino) + (d.deck ? ' · ' + curto(d.deck) : d.pasta ? ' · ' + d.pasta : '')
      : (i + 1) + ' → ' + nomeD(s.d) + (s.p && s.d === 'deck' ? ' · ' + curto(s.p) : '') + ' ▾';
    return '<button class="bt-c' + (d && d.destino ? ' dec-on' : '') + '" data-act="abrir" data-id="' + esc(c.id) + '">' + esc(rot) + '</button>';
  }).join('') + '</div>';
}
function imgDe(c) { return D.img && D.img[c.id] ? '<img src="' + D.img[c.id] + '" alt="' + esc(c.n) + '" loading="lazy">' : '<span class="cx-sem">' + esc(c.n) + '\n' + esc(c.line) + '</span>'; }

/* ---------- tabela e galeria ---------- */
function th(rot, k, cl) {
  var on = ui.ord === k || (k === 'nome' && (ui.ord === 'tipo' || ui.ord === 'cor')) || (k === 'forca' && ui.ord === 'edhrec');
  return '<th scope="col"' + (cl ? ' class="' + cl + '"' : '') + (on ? ' aria-sort="' + (setaOrd() === '↓' ? 'descending' : 'ascending') + '"' : '') + '><button class="cx-th' + (on ? ' on' : '') + '" data-act="ord" data-v="' + k + '">' + rot + (on ? ' <span aria-hidden="true">' + setaOrd() + '</span>' : '') + '</button></th>';
}
function tabela(G) {
  var cab = '<thead><tr>' + th('Prior.', 'padrao') + th('Carta', 'nome') + th('Custo', 'cmc') + th('Força sozinha', 'forca') + th('Valor', 'valor', 'n') +
    '<th scope="col">Sugestão</th>' + th('Ganho', 'ganho', 'n') + '<th scope="col">Já está em</th><th scope="col">Decisão</th></tr></thead>';
  var corpo = G.map(function (gr) {
    var f = fechado(gr);
    return '<tr class="grp"><td colspan="9">' + cabGrupo(gr) + '<span>' + pl(gr.cs.length, 'carta', 'cartas') + ' · ' + usd(valorGrupo(gr.cs)) + (gr.dica ? ' · ' + esc(gr.dica) : '') + '</span></td></tr>' + gr.cs.map(function (c) {
      var s = sugCarta(c), e = ui.deck ? encDe(c, ui.deck) : s.p ? c.enc.filter(function (x) { return x.p === s.p; })[0] : null;
      return '<tr class="cx-r" data-id="' + esc(c.id) + '"' + (f ? ' hidden' : '') + '>' +
        '<td class="cx-pr" data-v="' + prioCarta(c) + '">' + tierB(prioCarta(c)) + '</td>' +
        '<td class="cx-ca" data-v="' + esc(c.n) + '"><button class="cx-nm" data-act="abrir" data-id="' + esc(c.id) + '">' + esc(c.on || c.n) + '</button>' + (c.q > 1 ? '<span class="cx-xn">×' + c.q + '</span>' : '') + (c.pet ? '<span class="cx-petb" title="pet card">pet</span>' : '') +
        '<small>' + esc(c.line) + ' · ' + esc(cps(c)[0].imp) + '</small></td>' +
        '<td class="cx-co" data-v="' + c.cmc + '">' + mana(c.cost) + '</td>' +
        '<td class="cx-fo" data-l="Força sozinha" data-v="' + c.vp + '">' + forca(c) + '</td>' +
        '<td class="cx-vl n" data-v="' + (c.valor || 0) + '">' + valorTxt(c) + '</td>' +
        '<td class="cx-sg" data-l="Sugestão" data-v="' + nomeD(s.d) + '">' + sugTxt(s) + '</td>' +
        '<td class="cx-ga n" data-v="' + (e ? e.g : '') + '">' + (ui.deck ? ganhoFoco(c) : ganhoTxt(c, s)) + '</td>' +
        '<td class="cx-ja" data-l="Já está em">' + jaTxt(c) + '</td>' +
        '<td class="cx-dc" data-l="Decisão">' + decTxt(c) + '</td></tr>';
    }).join('');
  }).join('');
  return '<div class="cx-tw"><table class="tbl cx-t" data-nosort>' + cab + '<tbody>' + corpo + '</tbody></table></div>';
}
function chaveGal(c) {
  if (ui.ord === 'cmc') return c.t === 'ter' ? 'terreno' : 'custo ' + fmt(c.cmc);
  if (ui.ord === 'edhrec') return c.rank ? '#' + fmt(c.rank, 0) + ' EDHREC' : 'sem ranking';
  return 'força ' + fmt(c.vp);
}
function galeria(G) {
  return G.map(function (gr) {
    return '<div class="cx-g-h"><h2>' + cabGrupo(gr) + '</h2><span>' + gr.cs.length + ' · ' + usd(valorGrupo(gr.cs)) + (gr.dica ? ' · ' + esc(gr.dica) : '') + '</span></div><div class="cx-gal"' + (fechado(gr) ? ' hidden' : '') + '>' + gr.cs.map(function (c) {
      var s = sugCarta(c), e = ui.deck ? encDe(c, ui.deck) : s.p ? c.enc.filter(function (x) { return x.p === s.p; })[0] : null;
      return '<button class="cx-cd" data-act="abrir" data-id="' + esc(c.id) + '" aria-label="' + esc(c.n) + '">' + imgDe(c) + tierB(prioCarta(c)) +
        (c.q > 1 ? '<span class="cx-xn">×' + c.q + '</span>' : '') +
        '<span class="cx-li"><b class="num">' + usd(c.valor) + '</b><span>' + chaveGal(c) + '</span></span>' +
        (ui.deck ? '<span class="cx-sg">' + esc(curto(ui.deck)) + ' <b class="' + (e.g > 0 ? 'cx-pos' : 'cx-neg') + '">' + sinal(e.g) + '</b>' + (e.a ? '' : '<span class="cx-ast">*</span>') + (e.j ? ' · já está' : ' · sai ' + esc(e.s || '—')) + '</span>'
          : '<span class="cx-sg"><span class="cx-dest cx-d-' + s.d + '">' + nomeD(s.d) + '</span>' + (s.p ? esc(curto(s.p)) : '') + (e ? ' ' + sinal(e.g) : '') + '</span>') + '</button>';
    }).join('') + '</div>';
  }).join('');
}

/* ---------- gaveta ---------- */
function gaveta(c) {
  var cp0 = c.copias[0], dc = decCopias(c);
  var chips = CR.map(function (k, i) { var v = c.s8[i]; return v ? '<span>' + esc(k.curto) + ' <b>' + v + '</b></span>' : ''; }).join('') +
    '<span>força sozinha <b>' + fmt(c.vp) + '</b></span>' + (c.rank ? '<span>#' + fmt(c.rank, 0) + ' no EDHREC</span>' : '') + (c.gc ? '<span class="cx-gc">GC</span>' : '') + (c.staple ? '<span class="cx-st">Staple</span>' : '');
  var valor = c.copias.map(function (x, i) {
    return '<li><span>' + (c.q > 1 ? 'Cópia ' + (i + 1) + ': ' : '') + esc(x.imp) + ', ' + esc(x.acab) + (x.idioma && x.idioma !== 'en' ? ', ' + esc(x.idioma) : '') + '</span><b class="num">' + usd(x.usd) + brl(x.usd) + '</b></li>' +
      (x.avisos.length ? '<li class="vz">' + esc(x.avisos.join('; ')) + '</li>' : '');
  }).join('') + '<li class="vz">Scryfall, ' + esc(fdata(cp0.data)) + '. Confira na LigaMagic antes de vender.</li>';
  var onde = c.em_decks.map(function (x) {
    var mesma = x.imp && cp0.imp ? (x.imp === cp0.imp ? 'mesma impressão? confira' : 'outra impressão (' + esc(x.imp) + ')') : '';
    var e = c.enc.filter(function (y) { return y.p === x.p; })[0];
    return '<li><span>' + esc(curto(x.p)) + ' ' + tierB(x.T) + ' ' + esc(x.r || '') + (mesma ? ', ' + mesma : '') + (x.desejo ? ' <small class="dim">(Desejo)</small>' : '') + '</span>' + (e ? '<span class="num">vale ' + fmt(e.v) + '</span>' : '') + '</li>';
  }).join('') || '<li class="vz">Em nenhum deck.</li>';
  var radar = c.radares.map(function (x) {
    var e = c.enc.filter(function (y) { return y.p === x.p; })[0];
    return '<li><span>' + esc(curto(x.p)) + ' ' + tierB(x.T) + ' <span class="vd vd-' + esc(x.v) + '">' + esc(x.v) + '</span>' + (x.sai ? ', sai ' + esc(x.sai) : '') + '</span>' + (e ? '<span class="num">vale ' + fmt(e.v) + '</span>' : '') + '</li>';
  }).join('') || '<li class="vz">Nenhum radar pede a carta.</li>';
  var edh = c.edh ? c.edh.map(function (t) {
    var meu = t.meu.length;
    return '<li' + (meu ? ' class="meu"' : '') + '><span>' + esc(t.n) + (meu ? ' · seu deck' : '') + (t.meu_baixo && t.meu_baixo.length ? ' <small class="dim">(seu deck, abaixo de ' + R.edhrec_pct_min + '%)</small>' : '') + '</span><span class="num">' + fmt(t.pct, 0) + '%</span></li>';
  }).join('') : '<li class="vz">Sem a página da carta no EDHREC.</li>';
  var pastas = c.pastas.length ? c.pastas.map(function (x) { return '<li><span>' + esc(x.p) + '</span><span class="num">×' + x.q + '</span></li>'; }).join('') : '<li class="vz">' + (D.pastas_com_lista ? 'Em nenhuma pasta.' : 'Nenhuma lista de pasta chegou ainda.') + '</li>';
  var compra = c.compra ? '<li><span class="pill warn"><i>!</i>pedida por ' + esc((c.compra.pedidos || []).map(function (p) { return p.d || p.p; }).join(', ')) + '</span></li><li class="vz">A cópia da caixa resolve.</li>' : '<li class="vz">Não está na lista de compras.</li>';
  var encRows = c.enc.slice(0, aberta === c.id + ':todos' ? c.enc.length : 10).map(function (e, i) {
    var d = DECKS[e.p] || {};
    var obs = [];
    var rd = c.radares.filter(function (x) { return x.p === e.p; })[0];
    if (rd) obs.push('radar: ' + rd.v);
    var t = (c.edh || []).filter(function (x) { return x.meu.indexOf(e.p) >= 0; })[0];
    if (t) obs.push('EDHREC: ' + fmt(t.pct, 0) + '% dos decks de ' + t.n.split(',')[0]);
    if (e.pre) obs.push('precon intacto: só referência');
    if (e.des) obs.push('Desejo: deck ainda não montado');
    if (!e.a) obs.push('a avaliar');
    return '<tr' + (i === 0 ? ' class="top"' : '') + '><td><b>' + esc(d.c || e.p) + '</b> <small class="dim">' + esc(d.n || '') + '</small></td><td>' + mana((d.i || '').split('').map(function (k) { return '{' + k + '}'; }).join('')) + '</td>' +
      '<td class="cx-et">' + tierEnc(e) + '</td>' +
      '<td class="n num ' + (e.g > 0 ? 'cx-pos' : 'cx-neg') + '" data-v="' + e.g + '">' + sinal(e.g) + (e.a ? '' : '<span class="cx-ast">*</span>') + '</td><td class="n num" data-v="' + e.v + '">' + fmt(e.v) + '</td>' +
      '<td class="cx-pe">' + preenche(c, e) + '</td>' +
      '<td>' + (e.j ? 'já está no deck' : 'sai ' + esc(e.s || '—') + ' (' + fmt(e.vs) + ')') + '</td><td><small class="dim">' + esc(obs.join(' · ')) + '</small></td></tr>';
  }).join('');
  var verTodos = c.enc.length > 10 ? '<p class="cx-nt"><button class="bt-c" data-act="enc-todos" data-id="' + esc(c.id) + '">' + (aberta === c.id + ':todos' ? 'Ver só os dez primeiros' : 'Ver todos os ' + c.enc.length) + '</button></p>' : '';
  /* por que este destino e esta prioridade: as regras na ordem, as que não serviram e a que decidiu; cópias de mesma sugestão juntas */
  var porSug = [];
  c.copias.forEach(function (cp, i) {
    var k = cp.sug.d + '|' + (cp.sug.p || '') + '|' + cp.sug.P + '|' + cp.sug.pq, gr = porSug.filter(function (x) { return x.k === k; })[0];
    if (!gr) porSug.push(gr = { k: k, s: cp.sug, is: [] });
    gr.is.push(i);
  });
  var sugBox = porSug.map(function (gr) {
    var s0 = gr.s, quem = porSug.length > 1 ? (gr.is.length > 1 ? 'Cópias ' + gr.is.map(function (i) { return i + 1; }).join(' e ') : 'Cópia ' + (gr.is[0] + 1)) +
      ' (' + esc(c.copias[gr.is[0]].imp + ', ' + c.copias[gr.is[0]].acab) + '): ' : '';
    return '<div class="cx-sug"><h3>' + quem + 'Sugestão: ' + nomeD(s0.d) + (s0.p ? ' → ' + esc(curto(s0.p)) : '') + ' · prioridade ' + s0.P + '</h3>' + trilha(s0) +
      ((s0.marcas || []).length ? '<p>' + s0.marcas.map(function (m) { return '<span class="cx-mc">' + esc(m) + '</span>'; }).join('') + '</p>' : '') + '</div>';
  }).join('') + (c.avaliar.length ? '<p class="cx-nt">Sinergia a avaliar antes de decidir: ' + c.avaliar.map(curto).map(esc).join(', ') + ' (o /caixa avalia). Com a sinergia avaliada, a sugestão pode mudar.</p>' : '');
  var cps = '<div class="cx-cps">' + c.copias.map(function (cp, i) { return copiaHtml(c, cp, i, dc[i]); }).join('') + '</div>' +
    '<p class="cx-nt">' + (DB.db && DB.pode ? 'Deck: a carta vai ao radar do deck como "avaliar" e sai da lista de compras quando o /caixa aplicar. Guardar e Venda pedem a pasta física. Nada muda na decklist sem o seu pedido.'
      : PUB ? 'Só quem edita a Caixa grava decisões.' : 'Arquivo local: as decisões gravam só na Caixa publicada. Aqui a gaveta é para consulta.') + '</p>';
  return '<button class="cx-gav-x" data-act="fechar" aria-label="Fechar">×</button><div class="cx-gv"><div class="cx-gv-img">' + imgDe(c) +
    '<p>Impressão da caixa: ' + esc(c.copias.map(function (x) { return x.imp + ', ' + x.acab; }).join('; ')) + '. <a href="https://www.ligamagic.com.br/?view=cards/card&card=' + encodeURIComponent(c.n) + '" target="_blank" rel="noopener noreferrer">Abrir na LigaMagic</a></p>' +
    (c.fx ? '<p class="dim" style="white-space:pre-line">' + esc(c.fx) + '</p>' : '') + '</div>' +
    '<div><h2 id="cx-gav-t">' + esc(c.on || c.n) + (c.q > 1 ? '<span class="cx-xn">×' + c.q + '</span>' : '') + '</h2>' + (c.on ? '<p class="dim">' + esc(c.n) + '</p>' : '') +
    '<p class="cx-line">' + mana(c.cost) + ' ' + esc(c.line) + (c.pt ? ' ' + esc(c.pt) : '') + ' · identidade ' + (mana(ordemCor(c.ident).split('').map(function (k) { return '{' + k + '}'; }).join('')) || 'incolor') + '</p>' +
    '<div class="cx-chips">' + chips + '</div>' + (c.por_que ? '<p class="cx-nt" style="margin:-6px 0 14px">' + 'Força sozinha: ' + esc(c.por_que) + '</p>' : '') +
    (c.tx ? '<div class="cx-tx"><h3>O que a carta faz</h3><p>' + esc(c.tx.pt) + '</p><p class="cx-nt">Tradução livre do texto oficial em inglês, que fica abaixo da imagem' +
      (c.tx.velha ? '. <b>O texto oficial mudou depois da tradução: vale o inglês.</b>' : '; na dúvida, vale o inglês.') + '</p></div>' : '') +
    '<div class="cx-bx"><div><h3>Valor</h3><ul>' + valor + '</ul></div><div><h3>Onde já está</h3><ul>' + onde + '</ul></div><div><h3>Quem pede no radar</h3><ul>' + radar + '</ul></div>' +
    '<div><h3>Mais jogada com (EDHREC)</h3><ul>' + edh + '</ul></div><div><h3>Nas pastas</h3><ul>' + pastas + '</ul></div><div><h3>Na lista de compras</h3><ul>' + compra + '</ul></div></div>' +
    '<h3 class="sub">Em qual deck rende mais</h3><div class="cx-tw" style="background:none;box-shadow:none"><table class="tbl cx-enc" data-nosort><thead><tr><th>Deck</th><th>Cores</th><th>Tier</th><th class="n">Ganho</th><th class="n">Vale</th><th>Preenche (o deck hoje)</th><th>Quem sai</th><th></th></tr></thead><tbody>' + encRows + '</tbody></table></div>' + verTodos +
    '<p class="cx-nt">Ganho: o valor da carta nos critérios do deck, com saturação, menos o da carta de menor valor que sairia. Asterisco: sinergia ainda não avaliada naquele deck, o número é piso. ' +
    'Tier: o do deck ou do radar; com ≈, estimado pelo valor da carta contra o valor mediano de cada tier do deck, no máximo A (S só com avaliação). ' +
    'Preenche: os critérios em que a carta tem nota 2 ou 3 e quantas cartas o deck já tem neles contra a faixa da régua (▼ abaixo: a carta tapa um buraco e vale 1,5×; ▲ acima: vale 0,5×); ' +
    'embaixo, o quadro do 8×8 com o mesmo papel, contra a referência dele (8 quando o agrupamento não tem faixa). Os quadros de tema não têm par: a sinergia é que conta.</p>' +
    sugBox + cps + '</div></div>';
}
function trilha(s) {
  var nomeR = function (t) { return t === 'Guardar' ? nomeD('guardar') : t; };
  return '<p class="cx-tr-l">Por quê: o motor testa as regras na ordem e para na primeira que serve.</p><ol class="cx-tr">' +
    (s.tr || []).map(function (t) { return '<li class="nao"><span class="cx-tr-i" aria-hidden="true">✗</span><span><b>' + t[0] + '. ' + esc(nomeR(t[1])) + '</b>: ' + esc(t[2]) + '.</span></li>'; }).join('') +
    '<li class="sim"><span class="cx-tr-i" aria-hidden="true">✓</span><span><b>' + s.regra + '. ' + nomeD(s.d) + (s.p && s.d === 'deck' ? ' · ' + esc(curto(s.p)) : '') + '</b>: ' + esc(s.pq) + '</span></li></ol>' +
    (s.pp ? '<p class="cx-pp"><b>Prioridade ' + esc(s.pp.slice(0, 1)) + '</b>' + esc(s.pp.slice(1)) + '</p>' : '');
}
var SIMF = { ab: '▼ abaixo', de: 'dentro', ac: '▲ acima' };
function faixaTxt(a, b) { return a === b ? String(a) : a + '–' + b; }
function estado(n, a, b) { return n < a ? 'ab' : n > b ? 'ac' : 'de'; }
function tierEnc(e) {
  if (!e.T) return '<span class="dim">—</span>';
  if (e.T.charAt(0) !== '~') return tierB(e.T);
  return '<span class="cx-te" title="estimado pelo valor da carta contra as cartas do deck; S só com avaliação">≈ ' + tierB(e.T.slice(1)) + '</span>';
}
/* os critérios fortes da carta (nota 2 ou 3) contra o deck hoje: a v3 pela faixa da régua e o quadro do 8×8 com o mesmo papel */
function preenche(c, e) {
  var dk = DECKS[e.p] || {};
  if (!dk.nc) return '';
  var notas = (e.sin || [0, 0]).concat(c.s8);
  var h = D.crit10.map(function (k, i) {
    var v = notas[i];
    if (!(v >= 2)) return '';
    var n = dk.nc[i], st = estado(n, k[2], k[3]);
    var l = '<span class="cx-pl cx-pr-' + st + '"><b>' + esc(k[1]) + ' ' + v + '</b>: ' + n + ' de ' + faixaTxt(k[2], k[3]) + ' <i>' + SIMF[st] + '</i></span>';
    var q = dk.pk && dk.pk[k[0]];
    if (q) { var s8 = estado(q[1], q[2], q[3]); l += '<span class="cx-pl cx-p8 cx-pr-' + s8 + '">8×8 ' + esc(q[0]) + ': ' + q[1] + ' de ' + faixaTxt(q[2], q[3]) + ' <i>' + SIMF[s8] + '</i></span>'; }
    return l;
  }).join('');
  return h || '<span class="dim">nenhum critério com nota 2 ou 3</span>';
}
function decksDaCarta(c) {
  var ok = c.enc.filter(function (e) { var d = DECKS[e.p]; return d && !d.desejo && !d.precon && !e.j; });
  return ok.map(function (e) { return e.p; });
}
function copiaHtml(c, cp, i, d) {
  var s = cp.sug, dest = d && d.destino, pode = DB.db && DB.pode, key = c.id + '|' + i;
  var opc = decksDaCarta(c), def = (d && d.deck) || (ui.deck && opc.indexOf(ui.deck) >= 0 && ui.deck) || (s.d === 'deck' && s.p) || opc[0] || '';
  var selDeck = '<select data-cp="deck" data-id="' + esc(c.id) + '" data-i="' + i + '" aria-label="Deck"' + (pode ? '' : ' disabled') + '>' + opc.map(function (p) {
    var e = c.enc.filter(function (x) { return x.p === p; })[0];
    return '<option value="' + esc(p) + '"' + (p === def ? ' selected' : '') + '>' + esc(curto(p)) + (e ? ' ' + sinal(e.g) : '') + '</option>';
  }).join('') + '</select>';
  var selPasta = '<select data-cp="pasta" data-id="' + esc(c.id) + '" data-i="' + i + '" aria-label="Pasta física"' + (pode ? '' : ' disabled') + '><option value="">pasta…</option>' + D.pastas.map(function (p) {
    return '<option' + (d && d.pasta === p ? ' selected' : '') + '>' + esc(p) + '</option>';
  }).join('') + '</select>';
  var bt = function (k, rot) { return '<button class="bt-c' + (dest === k ? ' dec-on' : '') + '" data-act="decidir" data-k="' + k + '" data-id="' + esc(c.id) + '" data-i="' + i + '"' + (pode && !DB.ocupado[key] ? '' : ' disabled') + '>' + rot + '</button>'; };
  return '<div class="cx-cp"><b>Cópia ' + (i + 1) + ' de ' + c.copias.length + '</b><span class="dim">' + esc(cp.imp) + ' · ' + esc(cp.acab) + ' · ' + usd(cp.usd) + '</span>' +
    bt('deck', 'Deck') + (opc.length ? selDeck : '') + bt('guardar', eCaixa() ? 'Guardar' : 'Mover') + bt('bundles', 'Bundles') + bt('venda', 'Venda') + bt('bulk', 'Bulk') + selPasta +
    bt('remover', 'Remover') + '<label class="cx-pet"><input type="checkbox" data-cp="pet" data-id="' + esc(c.id) + '" data-i="' + i + '"' + ((d && d.pet) || c.pet ? ' checked' : '') + (pode ? '' : ' disabled') + '> pet card</label>' +
    '<input type="text" data-cp="nota" data-id="' + esc(c.id) + '" data-i="' + i + '" placeholder="anotação (opcional)" value="' + esc((d && d.nota) || '') + '"' + (pode ? '' : ' disabled') + '>' +
    '<small>Sugestão desta cópia: ' + nomeD(s.d) + (s.p ? ' · ' + esc(curto(s.p)) : '') + ' · prioridade ' + s.P + '. ' + esc(s.pq) + (d && d.destino ? ' Decidido em ' + esc(fdata(d.em)) + '.' : '') + '</small></div>';
}
function fdata(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? m[3] + '/' + m[2] + '/' + m[1] : '—'; }

function abrir(id) {
  var c = CARTAS.filter(function (x) { return x.id === id; })[0]; if (!c) return;
  aberta = id;
  $('#cx-gav-in').innerHTML = gaveta(c);
  $('#cx-gav').hidden = false; document.body.style.overflow = 'hidden';
  $('#cx-gav-in').focus();
}
function redesenharGaveta() {
  if (!aberta || $('#cx-gav').hidden) return;
  var id = aberta.split(':')[0], c = CARTAS.filter(function (x) { return x.id === id; })[0];
  if (c) { var st = $('#cx-gav-in').scrollTop; $('#cx-gav-in').innerHTML = gaveta(c); $('#cx-gav-in').scrollTop = st; }
}
function fechar() { $('#cx-gav').hidden = true; document.body.style.overflow = ''; aberta = null; }

/* ---------- gravar ---------- */
function decidir(c, i, destino) {
  if (!DB.db || !DB.pode) return;
  var dc = decCopias(c), cp = c.copias[i], atual = dc[i];
  var nova = { imp: cp.imp, acab: cp.acab, destino: destino, deck: null, pasta: null, em: hojeISO(), nota: (atual && atual.nota) || '', pet: !!(atual && atual.pet), aplicado: null };
  if (atual && atual.destino === destino) nova.destino = null;   // clicar de novo desfaz
  if (nova.destino === 'deck') {
    var sel = document.querySelector('select[data-cp="deck"][data-id="' + c.id + '"][data-i="' + i + '"]');
    nova.deck = sel ? sel.value : (cp.sug.p || null);
    if (!nova.deck) { aviso('Esta carta não tem deck nas cores dela.'); return; }
  }
  if (nova.destino === 'guardar' || nova.destino === 'venda') {
    var sp = document.querySelector('select[data-cp="pasta"][data-id="' + c.id + '"][data-i="' + i + '"]');
    nova.pasta = sp ? sp.value : '';
    if (!nova.pasta) { aviso('Escolha a pasta física de ' + nomeD(nova.destino).toLowerCase() + ' antes.'); if (sp) sp.focus(); return; }
  }
  gravar(c, i, nova);
}
function gravar(c, i, nova) {
  var dc = decCopias(c).slice();
  dc[i] = nova;
  var aplicadas = ((((DB.docs[O.col] || {})[c.id]) || O.dec[c.n] || {}).copias || []).filter(function (x) { return x.aplicado; });
  var copias = aplicadas.concat(dc.filter(function (x) { return x && (x.destino || x.nota); }));
  var key = c.id + '|' + i;
  DB.ocupado[key] = 1; redesenharGaveta();
  var ref = DB.db.collection(O.col).doc(c.id);
  (copias.length ? ref.set({ n: c.n, copias: copias }) : ref.delete())
    .then(function () { DB.erro = ''; }, function (e) { DB.erro = (e && e.code) || 'erro'; aviso('Não gravou (' + DB.erro + ').'); })
    .then(function () { delete DB.ocupado[key]; render(); redesenharGaveta(); });
}
function aviso(t) { var el = $('#cx-aviso'); el.innerHTML = '<p class="cx-aviso">' + esc(t) + '</p>'; setTimeout(function () { if (el.textContent === t) el.innerHTML = ''; }, 4000); }

function ligarBanco() {
  if (!window.claude || typeof window.claude.use !== 'function') return;
  Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function (r) {
    DB.db = r[0];
    if (!DB.db) { render(); return; }
    var u = r[1];
    (u && u.canEdit ? u.canEdit() : Promise.resolve(true)).then(function (p) { DB.pode = p !== false; render(); redesenharGaveta(); }, function () { DB.pode = true; render(); });
    ORS.forEach(function (o) {   // uma coleção por origem: "decisoes" (Caixa) e "decisoes-<pasta>"
      DB.db.collection(o.col).onSnapshot(function (s) {
        var m = {}; s.docs.forEach(function (x) { if (x.exists) m[x.id] = x.data(); });
        DB.docs[o.col] = m; render(); redesenharGaveta();
      }, function (e) { DB.erro = (e && e.code) || 'erro'; render(); });
    });
  }, function () { render(); });
}

/* ---------- desenho ---------- */
function render() {
  var r = O.resumo;
  $('#cx-tot').textContent = pl(r.cartas, 'carta', 'cartas') + ' · ' + pl(r.copias, 'cópia', 'cópias') + ' · ' + usd(r.valor) + ' no total';
  $('#cx-lede').textContent = eCaixa() ? 'As cartas da caixa, à espera de destino. Para cada uma, o motor cruza onde ela já está, quem pede no radar, em qual deck ela rende mais, a força dela sozinha, o que a comunidade faz com ela e quanto vale. A decisão é sua, cópia a cópia, e fica gravada.'
    : 'As cartas da pasta ' + O.k + ', com as mesmas contas da Caixa. Mover leva a cópia para outra pasta, Deck a põe no radar do deck, Remover a tira da pasta. "Manter" é a sugestão de deixar onde está.';
  $('#cx-resumo').innerHTML = resumo();
  $('#cx-ctl').innerHTML = controles();
  var L = visiveis(), G = grupos(L);
  var dk = ui.deck && DECKS[ui.deck];
  var lede = dk ? '<p class="cx-foco">Para o <b>' + esc(dk.c) + '</b> (' + esc(dk.n) + '): ' + pl(L.length, 'carta', 'cartas') + ' da caixa nas cores do comandante, ' +
    (mana(ordemCor(dk.i).split('').map(function (k) { return '{' + k + '}'; }).join('')) || 'incolor') + ', do maior ganho para o menor.' +
    (dk.precon ? ' Precon intacto: a lista não muda, o encaixe é só referência.' : '') + ' Asterisco: o deck nunca avaliou a carta, o ganho é piso (o /caixa avalia a sinergia).</p>' : '';
  $('#cx-lista').innerHTML = lede + (L.length ? (ui.ver === 'tabela' ? tabela(G) : galeria(G)) :
    '<p class="dim">' + (ui.dec === 'pendentes' ? 'Nenhuma carta pendente' : ui.dec === 'decididas' ? 'Nenhuma carta decidida ainda' : 'Nenhuma carta') + (ui.q ? ' com esse nome' : '') + (ui.tipos.length || ui.faixas.length || (ui.agrupar === 'cor' && ui.cores.length) ? ' com esses filtros' : '') + '.</p>');
  var rod = '<p class="nota">Força sozinha: o valor da carta pela régua, só com os oito critérios dela, sem sinergia, e a posição no EDHREC. Selos <span class="cx-gc">GC</span> Game Changer e <span class="cx-st">Staple</span> top ' + R.staple_rank_max + ' do EDHREC. Com duas cópias ou mais, o nome ganha <span class="cx-xn">×N</span> e a decisão abre uma linha por cópia. Valor: preço do Scryfall em dólar, pela impressão e pelo acabamento de cada cópia; cópia em outro idioma usa a impressão em inglês como referência.</p>';
  if (r.nao_encontradas.length) rod += '<p class="nota">Não encontradas no Scryfall (fora da conta): ' + r.nao_encontradas.map(function (x) { return esc(x.lista + ', linha ' + x.linha + ': ' + x.orig); }).join(' · ') + '</p>';
  if (r.ilegiveis.length) rod += '<p class="nota">Linhas que não deu para ler: ' + r.ilegiveis.map(function (x) { return esc(x.lista + ', linha ' + x.linha + ': ' + x.orig); }).join(' · ') + '</p>';
  $('#cx-rodape').innerHTML = rod;
  $('#foot').innerHTML = '<p class="nota" style="max-width:1400px;margin:0 auto;padding:10px 20px 30px">Montada em ' + esc(fdata(D.lido)) + ' a partir de ' + r.listas.map(function (x) { return esc(x.arquivo); }).join(', ') + '. ' +
    (DB.db ? (DB.pode ? 'As decisões gravam no banco desta página.' : 'Só quem edita grava decisões.') : PUB ? 'Sem acesso ao banco desta página.' : 'Arquivo local: as decisões moram na Caixa publicada.') + '</p>';
}

document.addEventListener('click', function (ev) {
  var a = ev.target.closest('[data-act]');
  if (!a) {
    var tr = ev.target.closest('tr.cx-r');
    if (tr && !ev.target.closest('button, a, select, input')) abrir(tr.getAttribute('data-id'));
    return;
  }
  var act = a.getAttribute('data-act'), id = a.getAttribute('data-id');
  if (act === 'ui') { ui[a.getAttribute('data-k')] = a.getAttribute('data-v'); guardaUI(); render(); }
  else if (act === 'abrir') abrir(id);
  else if (act === 'ord-inv') { ui.inv = !ui.inv; guardaUI(); render(); }
  else if (act === 'ord') { var ok = a.getAttribute('data-v'); if (ui.ord === ok) ui.inv = !ui.inv; else { ui.ord = ok; ui.inv = false; } guardaUI(); render(); }
  else if (act === 'tipos-limpar') { ui.tipos = []; ddAberta = false; guardaUI(); render(); }
  else if (act === 'cor') { var k = a.getAttribute('data-v'), i = ui.cores.indexOf(k); if (i >= 0) ui.cores.splice(i, 1); else ui.cores.push(k); guardaUI(); render(); }
  else if (act === 'cores-limpar') { ui.cores = []; guardaUI(); render(); }
  else if (act === 'faixa') { var fk = a.getAttribute('data-v'), fi = ui.faixas.indexOf(fk); if (fi >= 0) ui.faixas.splice(fi, 1); else ui.faixas.push(fk); guardaUI(); render(); }
  else if (act === 'faixas-limpar') { ui.faixas = []; guardaUI(); render(); }
  else if (act === 'grupo') { var gk = a.getAttribute('data-g'); if (ui.fechados[gk]) delete ui.fechados[gk]; else ui.fechados[gk] = 1; guardaUI(); render(); }
  else if (act === 'grupos') {
    grupos(visiveis()).forEach(function (gr) { if (a.getAttribute('data-v') === 'fechar') ui.fechados[chaveGrupo(gr)] = 1; else delete ui.fechados[chaveGrupo(gr)]; });
    guardaUI(); render();
  }
  else if (act === 'fechar') fechar();
  else if (act === 'enc-todos') { aberta = aberta === id + ':todos' ? id : id + ':todos'; redesenharGaveta(); }
  else if (act === 'decidir') { var c = CARTAS.filter(function (x) { return x.id === id; })[0]; if (c) decidir(c, +a.getAttribute('data-i'), a.getAttribute('data-k')); }
});
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (t.matches && t.matches('select[data-ctl="deck"]')) { ui.deck = t.value; guardaUI(); render(); return; }
  if (t.matches && t.matches('select[data-ctl="ord"]')) { ui.ord = t.value; ui.inv = false; guardaUI(); render(); return; }
  if (t.matches && t.matches('select[data-ctl="origem"]')) { usarOrigem(t.value); guardaUI(); render(); return; }
  if (t.matches && t.matches('input[data-ctl="tipo"]')) {
    ui.tipos = Array.prototype.map.call(document.querySelectorAll('input[data-ctl="tipo"]:checked'), function (x) { return x.value; });
    ddAberta = true; guardaUI(); render(); return;
  }
  if (t.matches && t.matches('input[data-cp="pet"]')) {
    var cpet = CARTAS.filter(function (x) { return x.id === t.getAttribute('data-id'); })[0]; if (!cpet || !DB.db || !DB.pode) return;
    var ip = +t.getAttribute('data-i'), dcp = decCopias(cpet), cpp = cpet.copias[ip];
    var np = dcp[ip] ? JSON.parse(JSON.stringify(dcp[ip])) : { imp: cpp.imp, acab: cpp.acab, destino: null, deck: null, pasta: null, em: hojeISO(), nota: '', aplicado: null };
    np.pet = t.checked; gravar(cpet, ip, np); return;
  }
  if (!t.matches || !t.matches('input[data-cp="nota"]')) return;
  var c = CARTAS.filter(function (x) { return x.id === t.getAttribute('data-id'); })[0]; if (!c || !DB.db || !DB.pode) return;
  var i = +t.getAttribute('data-i'), dc = decCopias(c), cp = c.copias[i];
  var nova = dc[i] ? JSON.parse(JSON.stringify(dc[i])) : { imp: cp.imp, acab: cp.acab, destino: null, deck: null, pasta: null, em: hojeISO(), aplicado: null };
  nova.nota = t.value.trim();
  gravar(c, i, nova);
});
document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !$('#cx-gav').hidden) fechar(); });
$('#q').addEventListener('input', function () { ui.q = this.value; render(); });
document.addEventListener('toggle', function (ev) { if (ev.target.classList && ev.target.classList.contains('cx-dd')) ddAberta = ev.target.open; }, true);
document.addEventListener('click', function (ev) {   // clicar fora fecha a lista de tipos
  if (ddAberta && !ev.target.closest('.cx-dd')) { var d = document.querySelector('.cx-dd'); if (d) d.open = false; ddAberta = false; }
});
if (ui.deck && (!DECKS[ui.deck] || DECKS[ui.deck].desejo)) ui.deck = '';
if (!ORDS.some(function (o) { return o[0] === ui.ord; })) ui.ord = 'padrao';
ui.faixas = ui.faixas.filter(function (k) { return FAIXAS.indexOf(k) >= 0; });
usarOrigem(ui.origem || 'Caixa');
if (PUB && D.hub_pub) $('#cx-hub').href = D.hub_pub;
render();
ligarBanco();
window.CAIXA = { D: D, ui: ui, render: render, abrir: abrir };   // para os testes
