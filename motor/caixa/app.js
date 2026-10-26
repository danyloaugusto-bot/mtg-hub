/* A Caixa (motor/caixa.py monta os dados; este arquivo só desenha e grava as decisões).
   A única página que mostra preço: exceção à decisão "Sem preço" de 14/10/2026, só aqui (dono, 17/10/2026).
   Decisão cópia a cópia, gravada no banco da Caixa publicada (coleção "decisoes", um documento por carta). */
var D = /*__DATA__*/null;
var R = D.regua, CR = D.crit, DECKS = D.decks, ORS = D.origens;
var O = ORS[0], CARTAS = O.cartas;   // a origem na tela: a Caixa ou uma pasta (motor/caixa.py, origens)
var LS = 'mtg-hub:caixa:v1';
var ui = { ver: 'tabela', agrupar: 'prioridade', ord: 'padrao', inv: false, dec: 'pendentes', tipos: [], cores: [], corModo: 'contem', sub: '', faixas: [], prios: [], dests: [], fechados: {}, deck: '', origem: '', q: '', ent: '' };
try {
  var g = JSON.parse(localStorage.getItem(LS) || '{}');
  ['ver', 'agrupar', 'ord', 'dec', 'deck', 'origem', 'ent', 'corModo', 'sub'].forEach(function (k) { if (g[k]) ui[k] = g[k]; });
  ui.inv = !!g.inv;
  if (Array.isArray(g.tipos)) ui.tipos = g.tipos; else if (g.tipo) ui.tipos = [g.tipo];   // o seletor antigo guardava um tipo só
  if (Array.isArray(g.cores)) ui.cores = g.cores.filter(function (k) { return 'WUBRGC'.indexOf(k) >= 0; });   // o botão Multicolorido saiu: o modo de cor resolve
  if (Array.isArray(g.faixas)) ui.faixas = g.faixas;
  if (Array.isArray(g.prios)) ui.prios = g.prios;
  if (Array.isArray(g.dests)) ui.dests = g.dests;
  if (g.fechados && typeof g.fechados === 'object') ui.fechados = g.fechados;
} catch (e) { }
function guardaUI() { try { localStorage.setItem(LS, JSON.stringify({ ver: ui.ver, agrupar: ui.agrupar, ord: ui.ord, inv: ui.inv, dec: ui.dec, tipos: ui.tipos, cores: ui.cores, corModo: ui.corModo, sub: ui.sub, faixas: ui.faixas, prios: ui.prios, dests: ui.dests, fechados: ui.fechados, deck: ui.deck, origem: ui.origem, ent: ui.ent })); } catch (e) { } }

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
var CB = D.cambio && D.cambio.v ? D.cambio : null;   // o dólar em reais (PTAX do último dia útil, no /precos); as regras seguem em dólar
function reais(v) { return 'R$ ' + Number(v * CB.v).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
function brl(v) { return (CB && v != null) ? ' <small class="dim">≈ ' + reais(v) + '</small>' : ''; }
function fdm(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? m[3] + '/' + m[2] : '—'; }
function diasDesde(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); if (!m) return null; return Math.round((new Date(hojeISO() + 'T12:00:00') - new Date(m[1] + '-' + m[2] + '-' + m[3] + 'T12:00:00')) / 864e5); }
function sinal(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v)); }
function slug(s) { return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function hojeISO() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function tierB(t) { return t ? '<span class="tb t' + esc(t) + '">' + esc(t) + '</span>' : ''; }
function curto(p) { return DECKS[p] ? DECKS[p].c : p; }
var NOMED = { deck: 'Deck', guardar: 'Guardar', venda: 'Venda', bundles: 'Bundles', bulk: 'Bulk', remover: 'Remover' };
function nomeD(d) { return d === 'guardar' && O.k !== 'Caixa' ? 'Manter' : NOMED[d]; }   // numa pasta, guardar é ficar onde está
function eCaixa() { return O.k === 'Caixa'; }
function verFich() { return ui.ver === 'fichario' && !eCaixa(); }   // a vista Fichário só existe nas pastas
var FICHAS = D.fichas || {};   // a ficha de cada pasta (dados/pastas/pastas.json): subnome, formato, frase, papéis
function semVenda() { return !eCaixa() && FICHAS[O.k] && FICHAS[O.k].venda === false; }   // a pasta não vende (Preta P)
function subnome(p) { return FICHAS[p] && FICHAS[p].subnome ? FICHAS[p].subnome : ''; }
function usarOrigem(k) {
  O = ORS.filter(function (x) { return x.k === k; })[0] || ORS[0]; CARTAS = O.cartas; ui.origem = O.k;
  $('#cx-tit').textContent = eCaixa() ? 'Caixa' : 'Pasta ' + O.k;
  document.title = eCaixa() ? 'Caixa' : O.k + (subnome(O.k) ? ' · ' + subnome(O.k) : '');
}
var ICP = ['◆', '♛', '➜'];
function fichaHtml() {
  var f = FICHAS[O.k];
  if (!f) return '';
  return '<div class="cx-ficha"><svg class="cx-gema" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="cx-gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a5262"/><stop offset=".5" stop-color="#17141b"/><stop offset="1" stop-color="#040405"/></linearGradient></defs>' +
    '<path d="M20 6h24l14 16-26 36L6 22z" fill="url(#cx-gm)" stroke="rgba(255,201,107,.6)" stroke-width="1.3"/><path d="M6 22h52M20 6l-4 16 16 36 16-36-4-16M16 22L32 6l16 16" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1"/></svg>' +
    '<div><p class="cx-fsub">' + esc(f.subnome || '') + '</p>' + (f.formato ? '<span class="cx-ffm">' + esc(f.formato) + '</span>' : '') + (f.frase ? '<p class="cx-ffr">' + esc(f.frase) + '</p>' : '') +
    (f.papeis ? '<ul class="cx-fpa">' + f.papeis.map(function (x, i) { return '<li><i aria-hidden="true">' + (ICP[i] || '•') + '</i><b>' + esc(x[0]) + '</b> ' + esc(x[1]) + '</li>'; }).join('') + '</ul>' : '') + '</div></div>';
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
/* filtro de cor: botões W U B R G e Incolor, combináveis, em três modos. "Contém": a identidade tem alguma das marcadas;
   "Cabe em": a identidade está toda dentro das marcadas (a carta cabe num comandante dessas cores; incolor cabe sempre);
   "Exatamente": a identidade é igual às marcadas (Incolor sozinho: só as incolores). */
var MODOS_COR = [['contem', 'Contém'], ['cabe', 'Cabe em'], ['exata', 'Exatamente']];
function identSet(c) { return (c.ident || '').split('').filter(function (x) { return 'WUBRG'.indexOf(x) >= 0; }); }
function passaCor(c) {
  var id = identSet(c), sel = ui.cores.filter(function (k) { return k !== 'C'; }), comC = ui.cores.indexOf('C') >= 0;
  var dentro = function (x) { return sel.indexOf(x) >= 0; };
  if (ui.corModo === 'cabe') return id.every(dentro);
  if (ui.corModo === 'exata') return id.length === sel.length && id.every(dentro) && (sel.length > 0 || comC);
  return (comC && !id.length) || id.some(dentro);
}
/* subtipos pela linha de tipo (o que vem depois do travessão, em cada face): Vampiro, Equipamento, Aura, Floresta... */
function subtipos(c) {
  var out = [];
  (c.line || '').split(' // ').forEach(function (f) { var p = f.split(' — ')[1]; if (p) p.split(/\s+/).forEach(function (w) { if (w && out.indexOf(w) < 0) out.push(w); }); });
  return out;
}
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
function decisoesDe(c, o) {
  o = o || O;
  var dd = DB.docs[o.col], d = dd && dd[c.id] ? dd[c.id] : (o.dec[c.n] || null);
  return ((d && d.copias) || []).filter(function (x) { return !x.aplicado || (o.mb && x.tarefa && !x.tarefa.feita); });
}
function aFazer(d) { return !!(d && d.destino && (O.mb || (d.pasta && (D.manabox || []).indexOf(d.pasta) >= 0))); }   // tarefa no ManaBox
/* a decisão de cada cópia: cópias de mesma impressão e acabamento são intercambiáveis, então casam pela ordem */
function decCopias(c, o) {
  var ds = decisoesDe(c, o).slice(), out = [];
  c.copias.forEach(function (cp) {
    var i = -1;
    for (var k = 0; k < ds.length; k++) if (ds[k] && ds[k].imp === cp.imp && (ds[k].acab || 'normal') === cp.acab) { i = k; break; }
    out.push(i >= 0 ? ds[i] : null);
    if (i >= 0) ds[i] = null;
  });
  return out;
}
/* a data de entrada de cada cópia (cp.ent, AAAA-MM-DD): o filtro Entrada pega os últimos N dias, contando hoje */
function hojeLocal() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function diasDesde(ent) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ent || ''); if (!m) return null; return Math.round((hojeLocal() - new Date(+m[1], +m[2] - 1, +m[3])) / 864e5); }
function entrouNos(cp, n) { var d = diasDesde(cp.ent); return d != null && d < n; }
/* as cópias que a lista mostra, pelo filtro de decisão (pendentes, decididas ou todas) */
function visCopias(c) {
  var dc = decCopias(c), out = [];
  c.copias.forEach(function (cp, i) {
    var feita = !!(dc[i] && dc[i].destino);
    if (ui.dec !== 'todas' && (ui.dec === 'pendentes') === feita) return;
    if (ui.faixas.length && ui.faixas.indexOf(faixaDe(cp.usd)) < 0) return;
    if (ui.ent && !entrouNos(cp, +ui.ent)) return;   // entrada: os últimos 3, 7 ou 30 dias
    if (ui.prios.length && ui.prios.indexOf(cp.sug.P) < 0) return;   // prioridade da sugestão (S, A, B, C)
    if (ui.dests.length && ui.dests.indexOf(feita ? dc[i].destino : cp.sug.d) < 0) return;   // destino: o decidido, ou o sugerido
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
    if (ui.cores.length && !passaCor(c)) return false;
    if (ui.sub && subtipos(c).indexOf(ui.sub) < 0) return false;
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
  if (ui.agrupar === 'entrada') { var e = c.copias[i].ent || ''; return { k: 'e' + e, n: e ? 'Entrou em ' + fdata(e) + (diasDesde(e) === 0 ? ' (hoje)' : '') : 'Sem data de entrada', o: e ? -Number(e.replace(/-/g, '')) : 0 }; }
  var dk = feita ? (d.destino === 'deck' ? d.deck || '' : '') : (s.d === 'deck' && s.p ? s.p : '');
  return { k: 'd' + dk, n: dk ? curto(dk) + (DECKS[dk] ? ' · ' + DECKS[dk].n : '') : 'Sem deck sugerido', o: dk ? 0 : 1 };
}
function grupos(L) {
  if (ui.deck && DECKS[ui.deck]) return gruposFoco(L);
  var g = {}, ordem = [];
  function add(k, nome, ord, c) { if (!g[k]) { g[k] = { k: k, n: nome, o: ord, cs: [] }; ordem.push(k); } g[k].cs.push(c); }
  L.forEach(function (c) {
    var idx = visCopias(c);
    if (ui.agrupar === 'prioridade' || ui.agrupar === 'destino' || ui.agrupar === 'deck' || ui.agrupar === 'faixa' || ui.agrupar === 'entrada') {
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
/* placar de valor: cada origem, o valor de hoje e a variação desde a atualização anterior (verde subiu, vermelho caiu) */
function placarDe(o) {
  var t = 0, a = 0, n = 0, em = {};
  o.cartas.forEach(function (c) {
    c.copias.forEach(function (cp) {
      if (cp.usd == null) return;
      t += cp.usd; a += cp.ant != null ? cp.ant : cp.usd; n++;
      if (cp.ant != null && cp.ant_em) em[cp.ant_em] = (em[cp.ant_em] || 0) + 1;
    });
  });
  var desde = Object.keys(em).sort(function (x, y) { return em[y] - em[x] || (x < y ? -1 : 1); })[0] || null;   // a data mais comum do preço anterior
  return { t: t, a: a, d: t - a, p: a ? (t - a) / a : 0, desde: desde, copias: n };
}
function deltaTxt(pl_) {
  var d = Math.round(pl_.d * 100) / 100, desde = pl_.desde ? 'desde ' + fdm(pl_.desde) : 'desde a última atualização';
  if (!d) return '<span class="cx-dz">estável</span><small>' + desde + '</small>';
  var s = d > 0 ? '+' : '−';
  return '<span class="' + (d > 0 ? 'cx-up' : 'cx-down') + '">' + (d > 0 ? '▲ ' : '▼ ') + s + usd(Math.abs(d)) + ' (' + s + fmt(Math.abs(pl_.p) * 100, Math.abs(pl_.p) < 0.01 ? 2 : 1) + '%)</span>' +
    '<small>' + (CB ? '≈ ' + s + reais(Math.abs(d)) + ' · ' : '') + desde + '</small>';
}
function placarHtml() {
  if (ORS.length < 1) return '';
  return '<div class="cx-placar" role="group" aria-label="Valor de cada lista">' + ORS.map(function (o) {
    var p = placarDe(o), sn = o.k === 'Caixa' ? '' : subnome(o.k);
    return '<button class="cx-pl-c' + (o.k === O.k ? ' on' : '') + '" data-act="origem" data-v="' + esc(o.k) + '" style="--oc:' + esc(corOrigem(o.k)) + '">' +
      '<span class="cx-pl-n"><b>' + esc(o.k === 'Caixa' ? 'Caixa' : 'Pasta ' + o.k) + '</b>' + (sn ? '<small class="cx-pl-s">' + esc(sn) + '</small>' : '') + '<small>' + pl(o.cartas.length, 'carta', 'cartas') + '</small></span>' +
      '<span class="cx-pl-v"><b>' + (CB ? reais(p.t) + ' <small>' + usd(p.t) + '</small>' : usd(p.t)) + '</b>' + deltaTxt(p) + '</span></button>';
  }).join('') + '</div>';
}
var CORPASTA = { 'Caixa': '#f5a524', 'Rosa P': '#f28bb8', 'Preta P': '#8a7f96', 'Preta': '#6f6a75', 'Amarela': '#f2c94c', 'Laranja': '#f2994a', 'Rosa': '#f5a3c7', 'Azul': '#4f8fe0', 'Vermelha': '#d9534f' };
function corOrigem(k) { return CORPASTA[k] || '#8a877f'; }
function tarefasHtml() {
  var t = D.tarefas || [];
  if (!t.length) return '';
  return '<details class="cx-tf"><summary><b>' + pl(t.length, 'tarefa', 'tarefas') + ' a fazer no ManaBox</b> <span class="dim">(dadas como feitas quando o próximo export mostrar)</span></summary><ul>' +
    t.map(function (x) {
      return '<li>' + esc(x.n) + ' <span class="dim">(' + esc(x.imp || '') + (x.acab && x.acab !== 'normal' ? ', ' + esc(x.acab) : '') + ')</span>: ' +
        (x.de === 'Caixa' ? 'da Caixa' : 'da pasta ' + esc(x.de)) + ' → ' + esc(x.pasta ? 'pasta ' + x.pasta : NOMED[x.d] || x.d) + ' <span class="dim">desde ' + esc(fdata(x.em)) + '</span></li>';
    }).join('') + '</ul></details>';
}
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
  // prioridade e sugestão filtram a lista abaixo: tocar marca (mais de um ao mesmo tempo), tocar de novo desmarca
  var fb = function (act, v, on, z, html, tit) { return '<button class="it' + (z ? ' z' : '') + '" data-act="' + act + '" data-v="' + v + '" aria-pressed="' + on + '"' + (z ? ' disabled' : '') + ' title="' + esc(tit) + '">' + html + '</button>'; };
  var r = O.resumo;
  return tarefasHtml() + '<div class="seg cx-fi" role="group" aria-label="Filtrar por prioridade"><span class="seg-l">Prioridade</span>' + ORDP.map(function (p) {
      return fb('prio', p, ui.prios.indexOf(p) >= 0, !pri[p][0], '<b class="num">' + pri[p][0] + ' ' + p + '</b>', 'Só as cópias de prioridade ' + p + ' (' + usd(pri[p][1]) + ')');
    }).join('') + (ui.prios.length ? '<button class="cx-limpa" data-act="prios-limpar">Limpar</button>' : '') + '</div>' +
    '<div class="seg cx-fi" role="group" aria-label="Filtrar por sugestão"><span class="seg-l">Sugestão</span>' + ORDD.map(function (d) {
      return fb('dest', d, ui.dests.indexOf(d) >= 0, !dest[d][0], '<b class="num">' + (dest[d][0] ? usd(dest[d][1]) : '—') + '</b> ' + nomeD(d) + ' <small class="dim">' + dest[d][0] + '</small>', 'Só as cópias com sugestão ' + nomeD(d));
    }).join('') + (ui.dests.length ? '<button class="cx-limpa" data-act="dests-limpar">Limpar</button>' : '') + '</div>' +
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
/* subtipo: lista suspensa com os subtipos da origem e a quantidade de cada um */
function seletorSub() {
  var n = {}; CARTAS.forEach(function (c) { subtipos(c).forEach(function (w) { n[w] = (n[w] || 0) + 1; }); });
  var ks = Object.keys(n).sort(function (a, b) { return n[b] - n[a] || a.localeCompare(b, 'pt'); });
  if (!ks.length) return '';
  if (ui.sub && !n[ui.sub]) ui.sub = '';
  return '<label class="cmp-s cx-sub"><span class="seg-l">Subtipo</span><select data-ctl="sub" aria-label="Subtipo"><option value="">Todos</option>' + ks.map(function (k) {
    return '<option value="' + esc(k) + '"' + (ui.sub === k ? ' selected' : '') + '>' + esc(k) + ' (' + n[k] + ')</option>'; }).join('') + '</select></label>';
}
function botoesCor() {
  var n = {}; CARTAS.forEach(function (c) { var id = identSet(c); if (!id.length) n.C = (n.C || 0) + 1; id.forEach(function (k) { n[k] = (n[k] || 0) + 1; }); });
  var modo = '<select class="cx-cmodo" data-ctl="cormodo" aria-label="Como filtrar as cores">' + MODOS_COR.map(function (m) {
    return '<option value="' + m[0] + '"' + (ui.corModo === m[0] ? ' selected' : '') + '>' + m[1] + '</option>'; }).join('') + '</select>';
  return '<div class="seg cx-cores" role="group" aria-label="Cores"><span class="seg-l">Cores</span>' + modo + CORES.filter(function (x) { return x[0] !== 'M'; }).map(function (x) {
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
/* Entrada: as cópias que entraram nos últimos 3, 7 ou 30 dias, com quantas cópias cada um tem no filtro de decisão atual */
function botoesEntrada() {
  var OPS = [['', 'Todas'], ['3', '3 dias'], ['7', '7 dias'], ['30', '30 dias']], n = { '': 0, '3': 0, '7': 0, '30': 0 };
  CARTAS.forEach(function (c) {
    var dc = decCopias(c);
    c.copias.forEach(function (cp, i) {
      var feita = !!(dc[i] && dc[i].destino);
      if (ui.dec !== 'todas' && (ui.dec === 'pendentes') === feita) return;
      n['']++; ['3', '7', '30'].forEach(function (k) { if (entrouNos(cp, +k)) n[k]++; });
    });
  });
  return '<div class="seg cx-ent" role="group" aria-label="Entrada"><span class="seg-l">Entrada</span>' + OPS.map(function (o) {
    return '<button data-act="ui" data-k="ent" data-v="' + o[0] + '" aria-pressed="' + (ui.ent === o[0]) + '"' + (o[0] && !n[o[0]] ? ' disabled' : '') +
      ' title="' + pl(n[o[0]], 'cópia', 'cópias') + (o[0] ? ' entraram nos últimos ' + o[0] + ' dias' : '') + '">' + o[1] + ' <small>' + n[o[0]] + '</small></button>';
  }).join('') + '</div>';
}
function seletorOrigem() {
  if (ORS.length < 2) return '';
  return '<label class="cmp-s cx-fo2"><span class="seg-l">Lista</span><select data-ctl="origem" aria-label="Caixa ou pasta"><option value="Caixa"' + (eCaixa() ? ' selected' : '') + '>Caixa (' + ORS[0].cartas.length + ')</option>' +
    ORS.slice(1).map(function (o) { return '<option value="' + esc(o.k) + '"' + (O.k === o.k ? ' selected' : '') + '>Pasta ' + esc(o.k) + (subnome(o.k) ? ' · ' + esc(subnome(o.k)) : '') + ' (' + o.cartas.length + ')</option>'; }).join('') + '</select></label>';
}
function controles() {
  return seletorOrigem() + seletorDeck() + seletorTipo() + seletorSub() + seg('Ver', 'ver', [['tabela', 'Tabela'], ['galeria', 'Galeria']].concat(eCaixa() ? [] : [['fichario', 'Fichário']])) +
    (ui.deck || verFich() ? '' : seg('Agrupar', 'agrupar', [['prioridade', 'Prioridade'], ['tipo', 'Tipo'], ['destino', 'Destino'], ['cor', 'Cor'], ['deck', 'Deck'], ['faixa', 'Valor'], ['entrada', 'Entrada'], ['nenhum', 'Nenhum']])) +
    seletorOrdem() +
    seg('Decisão', 'dec', [['pendentes', 'Pendentes'], ['decididas', 'Decididas'], ['todas', 'Todas']]) +
    botoesFaixa() + botoesEntrada() + botoesCor();
}
/* cada grupo recolhe e expande pelo cabeçalho; a escolha fica no navegador, por modo de agrupar */
function chaveGrupo(gr) { return (ui.deck ? 'deck:' + ui.deck : ui.agrupar) + ':' + gr.k; }
function fechado(gr) { return !!ui.fechados[chaveGrupo(gr)]; }
function cabGrupo(gr) {
  var f = fechado(gr), ic = ui.agrupar === 'cor' && !ui.deck && /^c[WUBRGMC]$/.test(gr.k) ? icone(gr.k.slice(1)) + ' ' : '';
  return '<button class="cx-tg" data-act="grupo" data-g="' + esc(chaveGrupo(gr)) + '" aria-expanded="' + !f + '"><span class="cx-tg-s" aria-hidden="true">' + (f ? '▸' : '▾') + '</span>' + ic + esc(gr.n) + '</button>';
}

/* ---------- pedaços de uma carta ---------- */
function selos(c) {
  var h = c.ban ? '<span class="cx-sl cx-sl-ban" title="banida no Commander: nunca vai para deck">banida no Commander</span>' :
    c.ilegal ? '<span class="cx-sl cx-sl-ban" title="não vale no Commander (Un-set, Alchemy e afins): nunca vai para deck">fora do Commander</span>' : '';
  var cs = cps(c), px = cs.filter(function (x) { return x.proxy; }).length, ss = {};
  cs.forEach(function (x) { (x.selos || []).forEach(function (k) { ss[k] = 1; }); });
  if (px) h += '<span class="cx-sl" title="proxy: nunca vai para venda nem para deck como carta nova">proxy' + (cs.length > 1 ? ' ×' + px : '') + '</span>';
  Object.keys(ss).forEach(function (k) { h += '<span class="cx-sl" title="o preço do Scryfall não reflete isso">' + esc(k) + '</span>'; });
  return h;
}
function rarDe(c) { var x = cps(c).filter(function (y) { return y.rar; })[0]; return x ? x.rar : ''; }
function varTxt(cs) {
  var x = cs.filter(function (y) { return y.var != null; }).sort(function (a, b) { return Math.abs(b.var) - Math.abs(a.var); })[0];
  if (!x) return '';
  return '<small class="cx-var ' + (x.var > 0 ? 'cx-pos' : 'cx-neg') + '" title="desde ' + esc(fdata(x.var_em)) + ', quando valia ' + esc(usd(x.var_de)) + '">' + (x.var > 0 ? '▲' : '▼') + ' ' + fmt(Math.abs(x.var) * 100, 0) + '%</small>';
}
function forca(c) {
  return '<b class="num">' + fmt(c.vp) + '</b>' + (c.gc ? ' <span class="cx-gc" title="Game Changer">GC</span>' : '') + (c.staple ? ' <span class="cx-st" title="top ' + R.staple_rank_max + ' do EDHREC">Staple</span>' : '') +
    '<small>' + (c.rank ? '#' + fmt(c.rank, 0) + ' no EDHREC' : 'fora do ranking do EDHREC') + '</small>';
}
function valorTxt(c) {
  var foil = cps(c).filter(function (x) { return x.acab !== 'normal'; });
  return '<b class="num">' + usd(c.valor) + '</b>' + brl(c.valor) + varTxt(cps(c)) + (c.q > 1 ? '<small>' + c.q + ' cópias</small>' : '') +
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
    var rot = d && d.destino ? (i + 1) + ' ✓ ' + nomeD(d.destino) + (d.deck ? ' · ' + curto(d.deck) : d.pasta ? ' · ' + d.pasta : '') + (aFazer(d) ? ' · a fazer no ManaBox' : '')
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
        '<td class="cx-ca" data-v="' + esc(c.n) + '"><button class="cx-nm" data-act="abrir" data-id="' + esc(c.id) + '">' + esc(c.on || c.n) + '</button>' + (c.q > 1 ? '<span class="cx-xn">×' + c.q + '</span>' : '') + (c.pet ? '<span class="cx-petb" title="pet card">pet</span>' : '') + selos(c) +
        '<small>' + esc(c.line) + (rarDe(c) ? ' · ' + esc(rarDe(c)) : '') + ' · ' + esc(cps(c)[0].imp) + '</small></td>' +
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


/* ---------- fichário: a pasta física, página a página (só nas pastas) ----------
   Cada cópia ocupa uma casa; as páginas mostram a grade da pasta (2×2 por padrão) aos pares, como o fichário aberto.
   Mexer (arrastar, ou Arrumar e tocar) é rascunho, guardado neste navegador; "Salvar posições" grava no banco da página
   publicada (coleção "fichario", um documento por pasta) e o /caixa fichario traz para dados/pastas/fichario.json. */
var FICH = D.fichario || {};
var LSF = 'mtg-hub:fichario:v1';
var FX = { sel: null, arrumar: false, ant: null, drag: null, rasc: {}, msg: '' };
try { FX.rasc = JSON.parse(localStorage.getItem(LSF) || '{}') || {}; } catch (e) { FX.rasc = {}; }
function guardaRasc() { try { localStorage.setItem(LSF, JSON.stringify(FX.rasc)); } catch (e) { } }
var GRADES = [[2, 2], [3, 3], [4, 3]];
function fxCopias() {   // todas as cópias da pasta, cada uma com a chave estável "<id>|<SET número>|<acabamento>|<n>"
  var out = [], vistos = {};
  CARTAS.forEach(function (c) { c.copias.forEach(function (cp, i) { var b = c.id + '|' + cp.imp + '|' + cp.acab; vistos[b] = (vistos[b] || 0) + 1; out.push({ k: b + '|' + vistos[b], c: c, cp: cp }); }); });
  return out;
}
function fxSalvo() { var b = DB.docs.fichario && DB.docs.fichario[slug(O.k)]; return b && b.casas ? b : (FICH[O.k] || null); }
function fxEstado() {   // o rascunho, se houver; senão o salvo; senão a ordem da lista
  var r = FX.rasc[O.k], sv = fxSalvo(), base = r || sv;
  var cs = fxCopias(), por = {}; cs.forEach(function (x) { por[x.k] = x; });
  var usados = {}, casas = ((base && base.casas) || []).map(function (k) { if (k && por[k] && !usados[k]) { usados[k] = 1; return k; } return null; });
  var ult = -1; casas.forEach(function (k, i) { if (k) ult = i; });
  casas = casas.slice(0, ult + 1).concat(cs.filter(function (x) { return !usados[x.k]; }).map(function (x) { return x.k; }));   // as novas entram depois da última ocupada
  return { grade: (base && base.grade) || (FICHAS[O.k] && FICHAS[O.k].grade) || [2, 2], casas: casas, por: por, rasc: !!r, sv: sv };
}
function fxRascunho(grade, casas) {
  var ult = -1; casas.forEach(function (k, i) { if (k) ult = i; });
  FX.rasc[O.k] = { grade: grade, casas: casas.slice(0, ult + 1) }; guardaRasc(); FX.msg = '';
}
function fxMover(a, b) {
  if (a === b) return;
  var E = fxEstado(), cs = E.casas.slice();
  while (cs.length <= Math.max(a, b)) cs.push(null);
  var t = cs[a]; cs[a] = cs[b]; cs[b] = t;
  fxRascunho(E.grade, cs); render();
}
function fxOrdenar(modo) {
  var E = fxEstado(); FX.ant = { grade: E.grade, casas: E.casas.slice(), rasc: FX.rasc[O.k] || null };
  var cs = fxCopias(), ordem = 'WUBRGMC';
  var num = function (imp) { var n = parseInt(String(imp || '').split(' ')[1], 10); return isNaN(n) ? 1e9 : n; };
  cs.sort(function (x, y) {
    if (modo === 'valor') return ((y.cp.usd || 0) - (x.cp.usd || 0)) || x.c.n.localeCompare(y.c.n);
    if (modo === 'colecao') return String(x.cp.rel || '9999').localeCompare(String(y.cp.rel || '9999')) || String(x.cp.imp).split(' ')[0].localeCompare(String(y.cp.imp).split(' ')[0]) || num(x.cp.imp) - num(y.cp.imp);
    if (modo === 'cor') return (ordem.indexOf(corDe(x.c)) - ordem.indexOf(corDe(y.c))) || x.c.n.localeCompare(y.c.n);
    return x.c.n.localeCompare(y.c.n);
  });
  fxRascunho(E.grade, cs.map(function (x) { return x.k; })); render();
}
function fxSalvar() {
  var E = fxEstado();
  var ult = -1; E.casas.forEach(function (k, i) { if (k) ult = i; });
  var doc = { pasta: O.k, grade: E.grade, casas: E.casas.slice(0, ult + 1), em: hojeISO() };
  if (!DB.db) {   // arquivo local: sem banco, as posições vão para a área de transferência, para colar no Claude Code
    var txt = '/caixa fichario ' + JSON.stringify(doc);
    try { navigator.clipboard.writeText(txt).then(function () { FX.msg = 'Arquivo local: as posições foram copiadas. Cole no Claude Code para guardar no projeto.'; render(); }, function () { FX.msg = 'Não deu para copiar.'; render(); }); } catch (e) { FX.msg = 'Não deu para copiar.'; render(); }
    return;
  }
  if (!DB.pode) { aviso('Só quem edita esta página salva as posições.'); return; }
  FX.msg = 'Salvando…'; render();
  DB.db.collection('fichario').doc(slug(O.k)).set(doc).then(function () {
    delete FX.rasc[O.k]; guardaRasc(); FX.ant = null; FX.msg = 'salvo'; render();
  }, function (e) { FX.msg = 'Não gravou (' + ((e && e.code) || 'erro') + '). O rascunho continua neste navegador.'; render(); });
}
function fxBarra(E) {
  var b = function (k, v, rot, on, dica) { return '<button class="bt-c' + (on ? ' dec-on' : '') + '" data-fx="' + k + '" data-v="' + v + '"' + (dica ? ' title="' + esc(dica) + '"' : '') + '>' + rot + '</button>'; };
  var sv = E.sv, quando = sv && sv.em ? fdata(sv.em) : '';
  var est = E.rasc ? '<span class="fx-est rasc">Alterações não salvas</span>' : sv ? '<span class="fx-est ok">Posições salvas' + (quando ? ' em ' + esc(quando) : '') + '</span>' : '<span class="fx-est">Ainda sem posições salvas: a ordem é a da lista</span>';
  var cmd = FX.msg === 'salvo' ? '<div class="fx-cmd"><span>Salvo nesta página. Para guardar no projeto a versão mais atual da pasta, mande no Claude Code:</span><code id="fx-cmd-t">/caixa fichario ' + esc(O.k) + '</code><button class="bt-c" data-fx="copiar" data-v="">Copiar</button></div>'
    : FX.msg ? '<p class="fx-msg">' + esc(FX.msg) + '</p>' : '';
  return '<div class="fx-barra">' +
    '<div class="seg" role="group" aria-label="Casas por página"><span class="seg-l">Página</span>' + GRADES.map(function (g) { return b('grade', g.join('x'), g[0] + '×' + g[1], E.grade[0] === g[0] && E.grade[1] === g[1]); }).join('') + '</div>' +
    '<div class="seg" role="group" aria-label="Organizar"><span class="seg-l">Organizar por</span>' + b('org', 'valor', 'Valor', false, 'As mais caras nas primeiras páginas') + b('org', 'colecao', 'Coleção', false, 'Pela data de lançamento da impressão') + b('org', 'cor', 'Cor', false) + b('org', 'nome', 'Nome', false) +
      (FX.ant ? b('desfazer', '', 'Desfazer', false, 'Volta à arrumação de antes do último Organizar') : '') + '</div>' +
    b('arrumar', '', FX.arrumar ? 'Arrumar: ligado' : 'Arrumar (tocar e mover)', FX.arrumar, 'Ligado: toque numa carta e depois na casa de destino. No computador, também dá para arrastar.') +
    (E.rasc ? b('descartar', '', 'Descartar', false, 'Volta às posições salvas') : '') +
    '<button class="bt-c fx-salvar" data-fx="salvar" data-v=""' + (E.rasc || !E.sv ? '' : ' disabled') + '>Salvar posições</button>' + est + '</div>' + cmd;
}
function fichario(L) {
  var E = fxEstado(), vis = {}; L.forEach(function (c) { vis[c.id] = 1; });
  var porPag = E.grade[0] * E.grade[1], n = Math.max(1, Math.ceil(E.casas.length / porPag)) + 1;   // uma página vazia no fim, para ter onde pôr
  if (n % 2) n++;
  var casa = function (idx) {
    var k = E.casas[idx], x = k && E.por[k];
    if (!x) return '<div class="fx-casa vazia' + (FX.sel === idx ? ' sel' : '') + '" data-casa="' + idx + '"></div>';
    var f = x.cp.acab && x.cp.acab !== 'normal' ? '<span class="fx-f">' + esc(x.cp.acab) + '</span>' : '';
    return '<div class="fx-casa' + (FX.sel === idx ? ' sel' : '') + (vis[x.c.id] ? '' : ' apagada') + '" data-casa="' + idx + '" draggable="true" title="' + esc(x.c.n + ' · ' + x.cp.imp + ' · ' + usd(x.cp.usd)) + '">' + imgDe(x.c) + f + '<span class="fx-v num">' + usd(x.cp.usd) + '</span></div>';
  };
  var pag = function (p) {
    var h = '';
    for (var i = 0; i < porPag; i++) h += casa(p * porPag + i);
    return '<div class="fx-pag"><div class="fx-grid" style="grid-template-columns:repeat(' + E.grade[0] + ',minmax(0,1fr))">' + h + '</div><span class="fx-np">página ' + (p + 1) + '</span></div>';
  };
  var ab = '';
  for (var p = 0; p < n; p += 2) ab += '<div class="fx-ab">' + pag(p) + pag(p + 1) + '</div>';
  var ocup = E.casas.filter(Boolean).length;
  return fxBarra(E) + '<p class="nota fx-nota">' + pl(ocup, 'cópia', 'cópias') + ' em ' + pl(Math.ceil(Math.max(E.casas.length, 1) / porPag), 'página', 'páginas') + ' de ' + E.grade[0] + '×' + E.grade[1] + '. Arraste uma carta para outra casa (troca de lugar com a que estiver lá), ou ligue Arrumar e toque. Os filtros só apagam as cartas que não passam; nenhuma sai do lugar. Clique numa carta, com Arrumar desligado, para abrir a ficha.</p>' + ab;
}
document.addEventListener('click', function (ev) {
  var bt = ev.target.closest('[data-fx]');
  if (bt) {
    var k = bt.getAttribute('data-fx'), v = bt.getAttribute('data-v'), E = fxEstado();
    if (k === 'grade') { fxRascunho(v.split('x').map(Number), E.casas); render(); }
    else if (k === 'org') fxOrdenar(v);
    else if (k === 'desfazer' && FX.ant) { if (FX.ant.rasc) FX.rasc[O.k] = FX.ant.rasc; else delete FX.rasc[O.k]; guardaRasc(); FX.ant = null; render(); }
    else if (k === 'arrumar') { FX.arrumar = !FX.arrumar; FX.sel = null; render(); }
    else if (k === 'descartar') { delete FX.rasc[O.k]; guardaRasc(); FX.ant = null; FX.sel = null; FX.msg = ''; render(); }
    else if (k === 'salvar') fxSalvar();
    else if (k === 'copiar') { var t = $('#fx-cmd-t').textContent; try { navigator.clipboard.writeText(t).then(function () { bt.textContent = 'Copiado'; }, function () { bt.textContent = 'Selecione e copie'; }); } catch (e) { bt.textContent = 'Selecione e copie'; } }
    return;
  }
  var fc = ev.target.closest('.fx-casa');
  if (!fc) return;
  var idx = +fc.getAttribute('data-casa');
  if (FX.arrumar) {
    if (FX.sel === null) { if (!fc.classList.contains('vazia')) { FX.sel = idx; render(); } }
    else { var a = FX.sel; FX.sel = null; if (a === idx) render(); else fxMover(a, idx); }
    return;
  }
  var E2 = fxEstado(), x = E2.por[E2.casas[idx]];
  if (x) abrir(x.c.id);
});
document.addEventListener('dragstart', function (ev) {
  var fc = ev.target.closest && ev.target.closest('.fx-casa[draggable]'); if (!fc) return;
  FX.drag = +fc.getAttribute('data-casa');
  try { ev.dataTransfer.setData('text/plain', String(FX.drag)); ev.dataTransfer.effectAllowed = 'move'; } catch (e) { }
});
document.addEventListener('dragover', function (ev) {
  var fc = ev.target.closest && ev.target.closest('.fx-casa'); if (!fc || FX.drag === null) return;
  ev.preventDefault(); document.querySelectorAll('.fx-casa.alvo').forEach(function (x) { if (x !== fc) x.classList.remove('alvo'); }); fc.classList.add('alvo');
});
document.addEventListener('drop', function (ev) {
  var fc = ev.target.closest && ev.target.closest('.fx-casa'); if (!fc || FX.drag === null) return;
  ev.preventDefault(); var a = FX.drag; FX.drag = null; fxMover(a, +fc.getAttribute('data-casa'));
});
document.addEventListener('dragend', function () { FX.drag = null; document.querySelectorAll('.fx-casa.alvo').forEach(function (x) { x.classList.remove('alvo'); }); });

/* ---------- gaveta ---------- */
function gaveta(c) {
  var cp0 = c.copias[0], dc = decCopias(c);
  var chips = CR.map(function (k, i) { var v = c.s8[i]; return v ? '<span>' + esc(k.curto) + ' <b>' + v + '</b></span>' : ''; }).join('') +
    '<span>força sozinha <b>' + fmt(c.vp) + '</b></span>' + (c.rank ? '<span>#' + fmt(c.rank, 0) + ' no EDHREC</span>' : '') + (c.gc ? '<span class="cx-gc">GC</span>' : '') + (c.staple ? '<span class="cx-st">Staple</span>' : '') +
    (c.ban ? '<span class="cx-sl-ban">banida no Commander</span>' : '');
  var valor = c.copias.map(function (x, i) {
    var moeda = x.compra ? (x.compra.moeda === 'USD' ? 'US$ ' : x.compra.moeda === 'BRL' || !x.compra.moeda ? 'R$ ' : x.compra.moeda + ' ') : '';
    return '<li><span>' + (c.q > 1 ? 'Cópia ' + (i + 1) + ': ' : '') + esc(x.imp) + ', ' + esc(x.acab) + (x.idioma && x.idioma !== 'en' ? ', ' + esc(x.idioma) : '') + (x.rar ? ', ' + esc(x.rar) : '') +
      (x.proxy ? ' <span class="cx-sl">proxy</span>' : '') + (x.selos || []).map(function (k) { return ' <span class="cx-sl">' + esc(k) + '</span>'; }).join('') + '</span><b class="num">' + usd(x.usd) + brl(x.usd) + varTxt([x]) + '</b></li>' +
      (x.avisos.length ? '<li class="vz">' + esc(x.avisos.join('; ')) + '</li>' : '') +
      (x.compra ? '<li class="vz cx-mbx">No cadastro do ManaBox (' + esc(fdata(x.compra.em)) + '): ' + moeda + Number(x.compra.v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '. Não é o valor de hoje.</li>' : '');
  }).join('') + '<li class="vz">Scryfall, ' + esc(fdata(cp0.data)) + (CB ? '; dólar ' + (CB.fonte === 'PTAX' ? 'PTAX ' : '') + 'R$ ' + fmt(CB.v, 4) + (CB.data ? ' de ' + esc(fdata(CB.data)) : '') : '') + '. Confira na LigaMagic antes de vender.</li>';
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
  var pastas = c.pastas.length ? c.pastas.map(function (x) { return '<li><span>' + esc(x.p) + (subnome(x.p) ? ' <small class="dim">' + esc(subnome(x.p)) + '</small>' : '') + '</span><span class="num">×' + x.q + '</span></li>'; }).join('') : '<li class="vz">' + (D.pastas_com_lista ? 'Em nenhuma pasta.' : 'Nenhuma lista de pasta chegou ainda.') + '</li>';
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
    '<p>Impressão da caixa: ' + esc(c.copias.map(function (x) { return x.imp + ', ' + x.acab; }).join('; ')) + '. ' + entradaTxt(c) + '<a href="https://www.ligamagic.com.br/?view=cards/card&card=' + encodeURIComponent(c.n) + '" target="_blank" rel="noopener noreferrer">Abrir na LigaMagic</a></p>' +
    (c.fx ? '<p class="dim" style="white-space:pre-line">' + esc(c.fx) + '</p>' : '') + '</div>' +
    '<div><h2 id="cx-gav-t">' + esc(c.on || c.n) + (c.q > 1 ? '<span class="cx-xn">×' + c.q + '</span>' : '') + '</h2>' + (c.on ? '<p class="dim">' + esc(c.n) + '</p>' : '') +
    '<p class="cx-line">' + mana(c.cost) + ' ' + esc(c.line) + (c.pt ? ' ' + esc(c.pt) : '') + (rarDe(c) ? ' · ' + esc(rarDe(c)) : '') + ' · identidade ' + (mana(ordemCor(c.ident).split('').map(function (k) { return '{' + k + '}'; }).join('')) || 'incolor') + '</p>' +
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
  var num = function (n) { return n ? n + '. ' : ''; };
  return '<p class="cx-tr-l">Por quê: o motor testa as regras na ordem e para na primeira que serve.</p><ol class="cx-tr">' +
    (s.tr || []).map(function (t) { return '<li class="nao"><span class="cx-tr-i" aria-hidden="true">✗</span><span><b>' + num(t[0]) + esc(nomeR(t[1])) + '</b>: ' + esc(t[2]) + '.</span></li>'; }).join('') +
    '<li class="sim"><span class="cx-tr-i" aria-hidden="true">✓</span><span><b>' + num(s.regra) + nomeD(s.d) + (s.p && s.d === 'deck' ? ' · ' + esc(curto(s.p)) : '') + '</b>: ' + esc(s.pq) + '</span></li></ol>' +
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
  var DICA = { remover: 'Tira a carta da coleção (vendida, trocada, perdida). Não leva a pasta nenhuma: para uma pasta, escolha a pasta ao lado de Guardar.', guardar: 'Guarda na pasta escolhida ao lado (escolher a pasta já grava).' };
  var bt = function (k, rot) { return '<button class="bt-c' + (dest === k ? ' dec-on' : '') + '" data-act="decidir" data-k="' + k + '" data-id="' + esc(c.id) + '" data-i="' + i + '"' + (DICA[k] ? ' title="' + esc(DICA[k]) + '"' : '') + (pode && !DB.ocupado[key] ? '' : ' disabled') + '>' + rot + '</button>'; };
  return '<div class="cx-cp"><b>Cópia ' + (i + 1) + ' de ' + c.copias.length + '</b><span class="dim">' + esc(cp.imp) + ' · ' + esc(cp.acab) + ' · ' + usd(cp.usd) + '</span>' +
    bt('deck', 'Deck') + (opc.length ? selDeck : '') + bt('guardar', eCaixa() ? 'Guardar' : 'Mover') + selPasta + (semVenda() ? '' : bt('venda', 'Venda') + bt('bundles', 'Bundles') + bt('bulk', 'Bulk')) +
    bt('remover', 'Remover') + '<label class="cx-pet"><input type="checkbox" data-cp="pet" data-id="' + esc(c.id) + '" data-i="' + i + '"' + ((d && d.pet) || c.pet ? ' checked' : '') + (pode ? '' : ' disabled') + '> pet card</label>' +
    '<input type="text" data-cp="nota" data-id="' + esc(c.id) + '" data-i="' + i + '" placeholder="anotação (opcional)" value="' + esc((d && d.nota) || '') + '"' + (pode ? '' : ' disabled') + '>' +
    '<small>Sugestão desta cópia: ' + nomeD(s.d) + (s.p ? ' · ' + esc(curto(s.p)) : '') + ' · prioridade ' + s.P + '. ' + esc(s.pq) + (d && d.destino ? ' Decidido em ' + esc(fdata(d.em)) + '.' : '') + '</small></div>';
}
/* "Entrou em 22/10/2026 (lista 03. lote 22-10.txt)", uma vez por data e lista das cópias da carta */
function entradaTxt(c) {
  var vistos = {}, partes = [];
  c.copias.forEach(function (x) { var k = (x.ent || '') + '|' + (x.lista || ''); if (vistos[k]) return; vistos[k] = 1; if (x.ent) partes.push(fdata(x.ent) + (x.lista ? ' (lista ' + x.lista + ')' : '')); });
  return partes.length ? 'Entrou em ' + esc(partes.join('; ')) + '. ' : '';
}
function fdata(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? m[3] + '/' + m[2] + '/' + m[1] : '—'; }

/* Atualizar preços: o navegador pede ao Scryfall os preços de todas as impressões das listas (lotes de 75, como o motor).
   No arquivo local funciona; na página publicada o claude.ai pode bloquear a conexão, e aí o caminho é o /precos no Claude Code,
   que grava em dados/precos/ultimo.json e republica. O que o navegador trouxe fica guardado nele até um build mais novo. */
var LSP = 'mtg-hub:caixa:precos-vivos', atualizando = false;
function chaveImp(cp) { return cp.imp + '|' + cp.acab; }
function aplicarVivos() {
  var g; try { g = JSON.parse(localStorage.getItem(LSP) || 'null'); } catch (e) { g = null; }
  if (!g || !g.em || !g.p) return;
  if (g.build !== D.gerado && ORS.every(function (o) { return (o.resumo.precos_de || '') >= g.em; })) return;   // o build já é mais novo
  ORS.forEach(function (o) {
    o.cartas.forEach(function (c) {
      c.copias.forEach(function (cp) { var x = g.p[chaveImp(cp)]; if (x) { cp.ant = x[1]; cp.ant_em = x[2]; cp.usd = x[0]; cp.data = g.em; } });
      c.valor = Math.round(c.copias.reduce(function (s, cp) { return s + (cp.usd || 0); }, 0) * 100) / 100;
    });
    o.resumo.precos_de = g.em; o.resumo.valor = Math.round(o.cartas.reduce(function (s, c) { return s + c.valor; }, 0) * 100) / 100;
  });
}
function atualizarPrecos() {
  if (atualizando) return;
  var imps = {}, lista = [];
  ORS.forEach(function (o) { o.cartas.forEach(function (c) { c.copias.forEach(function (cp) {
    var m = /^(\S+) (.+)$/.exec(cp.imp || ''); if (!m) return;
    var k = m[1].toLowerCase() + '/' + m[2]; if (!imps[k]) { imps[k] = 1; lista.push({ set: m[1].toLowerCase(), collector_number: m[2] }); }
  }); }); });
  var lotes = []; for (var i = 0; i < lista.length; i += 75) lotes.push(lista.slice(i, i + 75));
  var achados = {}, bt = $('#cx-pbt'), feitos = 0;
  atualizando = true; bt.disabled = true;
  var passo = function (k) {
    if (k >= lotes.length) return Promise.resolve();
    bt.textContent = 'Atualizando ' + (k + 1) + ' de ' + lotes.length + '…';
    return fetch('https://api.scryfall.com/cards/collection', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ identifiers: lotes[k] }) })
      .then(function (r) { if (!r.ok) throw new Error('Scryfall ' + r.status); return r.json(); })
      .then(function (j) { (j.data || []).forEach(function (x) { achados[x.set.toLowerCase() + '/' + x.collector_number] = x.prices || {}; }); feitos++; })
      .then(function () { return new Promise(function (ok) { setTimeout(ok, 120); }); })
      .then(function () { return passo(k + 1); });
  };
  passo(0).then(function () {
    var hoje = hojeISO(), mudou = 0, salvo = { em: hoje, build: D.gerado, p: {} };
    ORS.forEach(function (o) { o.cartas.forEach(function (c) { c.copias.forEach(function (cp) {
      var m = /^(\S+) (.+)$/.exec(cp.imp || ''), pr = m && achados[m[1].toLowerCase() + '/' + m[2]];
      if (!pr) return;
      var v = pr[{ foil: 'usd_foil', etched: 'usd_etched' }[cp.acab] || 'usd'], novo = v ? +v : null;
      var ant = cp.data === hoje && cp.ant != null ? cp.ant : cp.usd, ant_em = cp.data === hoje && cp.ant_em ? cp.ant_em : cp.data;
      if (novo != null && ant != null && novo !== ant) mudou++;
      salvo.p[chaveImp(cp)] = [novo, ant, ant_em];
    }); }); });
    try { localStorage.setItem(LSP, JSON.stringify(salvo)); } catch (e) { }
    aplicarVivos();
    atualizando = false; bt.disabled = false;
    render(); redesenharGaveta();
    var pc = placarDe(O);
    aviso('Preços do Scryfall de hoje: ' + pl(mudou, 'preço mudou', 'preços mudaram') + '. ' + (O.k === 'Caixa' ? 'A Caixa' : 'A pasta ' + O.k) + ' ' + (pc.d >= 0 ? 'subiu ' : 'caiu ') + usd(Math.abs(pc.d)) +
      '. Ficam neste navegador; para gravar no projeto e republicar, rode /precos no Claude Code.', 9000);
  }, function () {
    atualizando = false; bt.disabled = false; render();
    try { navigator.clipboard.writeText('/precos').catch(function () { }); } catch (e) { }
    aviso('Daqui a página não consegue falar com o Scryfall' + (PUB ? ' (o claude.ai bloqueia a conexão)' : '') + '. Rode /precos no Claude Code (já copiei): ele atualiza tudo, grava e republica a Caixa.', 10000);
  });
}
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
function aviso(t, ms) { var el = $('#cx-aviso'); el.innerHTML = '<p class="cx-aviso">' + esc(t) + '</p>'; setTimeout(function () { if (el.textContent === t) el.innerHTML = ''; }, ms || 4000); }

function ligarBanco() {
  if (!window.claude || typeof window.claude.use !== 'function') return;
  Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function (r) {
    DB.db = r[0];
    if (!DB.db) { render(); return; }
    var u = r[1];
    (u && u.canEdit ? u.canEdit() : Promise.resolve(true)).then(function (p) { DB.pode = p !== false; render(); redesenharGaveta(); }, function () { DB.pode = true; render(); });
    DB.db.collection('fichario').onSnapshot(function (s) {   // as posições salvas de cada pasta no fichário
      var m = {}; s.docs.forEach(function (x) { if (x.exists) m[x.id] = x.data(); });
      DB.docs.fichario = m; if (verFich()) render();
    }, function () { });
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
  var dias = diasDesde(r.precos_de);
  var bt = $('#cx-pbt'); if (bt && !atualizando) { bt.innerHTML = '↻ Atualizar preços' + (r.precos_de ? ' <small>' + fdm(r.precos_de) + '</small>' : ''); bt.classList.toggle('velho', dias > R.precos_dias); }
  $('#cx-tot').innerHTML = esc(pl(r.cartas, 'carta', 'cartas') + ' · ' + pl(r.copias, 'cópia', 'cópias')) +
    (r.precos_de && dias > R.precos_dias ? ' · <span class="cx-velho">preços com ' + dias + ' dias</span>' : '');
  // o saldo da lista aberta, só indicativo: o valor de hoje e a variação desde a atualização anterior; o detalhe no passar do mouse
  var ps = placarDe(O), sd = Math.round(ps.d * 100) / 100, sg = sd > 0 ? '+' : sd < 0 ? '−' : '';
  $('#cx-saldo').innerHTML = '<b>' + (CB ? reais(ps.t) : usd(ps.t)) + '</b> <span class="' + (sd > 0 ? 'cx-up' : sd < 0 ? 'cx-down' : 'cx-dz') + '">' +
    (sd ? (sd > 0 ? '▲ ' : '▼ ') + sg + fmt(Math.abs(ps.p) * 100, Math.abs(ps.p) < 0.01 ? 2 : 1) + '%' : 'estável') + '</span>';
  $('#cx-saldo').title = 'Saldo ' + (eCaixa() ? 'da Caixa' : 'da pasta ' + O.k) + ': ' + usd(ps.t) + (CB ? ' (≈ ' + reais(ps.t) + ')' : '') + '. ' +
    (sd ? (sd > 0 ? 'Subiu ' : 'Caiu ') + usd(Math.abs(sd)) + (CB ? ' (≈ ' + reais(Math.abs(sd)) + ')' : '') + ' desde ' + (ps.desde ? fdata(ps.desde) : 'a atualização anterior') : 'Sem variação desde a atualização anterior') + '. ' +
    (r.precos_de ? 'Preços do Scryfall de ' + fdata(r.precos_de) + '. ' : '') + (CB ? 'Dólar ' + (CB.fonte === 'PTAX' ? 'PTAX ' : '') + 'R$ ' + fmt(CB.v, 4) + (CB.data ? ' de ' + fdata(CB.data) : '') + (CB.velha ? ' (a última guardada)' : '') + '.' : '');
  $('#cx-lede').innerHTML = (eCaixa() ? '' : fichaHtml()) + esc(eCaixa() ? 'As cartas da caixa, à espera de destino. Para cada uma, o motor cruza onde ela já está, quem pede no radar, em qual deck ela rende mais, a força dela sozinha, o que a comunidade faz com ela e quanto vale. A decisão é sua, cópia a cópia, e fica gravada.'
    : 'As cartas da pasta ' + O.k + ', com as mesmas contas da Caixa. Mover leva a cópia para outra pasta, Deck a põe no radar do deck, Remover a tira da pasta. "Manter" é a sugestão de deixar onde está.' +
      (O.mb ? ' A lista é o export do ManaBox: o motor não a edita; cada decisão vira tarefa para você fazer na mão e no ManaBox, e a cópia sai daqui quando o próximo export não a trouxer mais.' : ''));
  $('#cx-resumo').innerHTML = resumo();
  $('#cx-ctl').innerHTML = controles();
  var L = visiveis(), G = grupos(L);
  var dk = ui.deck && DECKS[ui.deck];
  var lede = dk ? '<p class="cx-foco">Para o <b>' + esc(dk.c) + '</b> (' + esc(dk.n) + '): ' + pl(L.length, 'carta', 'cartas') + ' da caixa nas cores do comandante, ' +
    (mana(ordemCor(dk.i).split('').map(function (k) { return '{' + k + '}'; }).join('')) || 'incolor') + ', do maior ganho para o menor.' +
    (dk.precon ? ' Precon intacto: a lista não muda, o encaixe é só referência.' : '') + ' Asterisco: o deck nunca avaliou a carta, o ganho é piso (o /caixa avalia a sinergia).</p>' : '';
  $('#cx-lista').innerHTML = lede + (verFich() ? fichario(L) : L.length ? (ui.ver === 'galeria' || ui.ver === 'fichario' ? galeria(G) : tabela(G)) :
    '<p class="dim">' + (ui.dec === 'pendentes' ? 'Nenhuma carta pendente' : ui.dec === 'decididas' ? 'Nenhuma carta decidida ainda' : 'Nenhuma carta') + (ui.q ? ' com esse nome' : '') + (ui.tipos.length || ui.sub || ui.faixas.length || ui.prios.length || ui.dests.length || ui.ent || ui.cores.length ? ' com esses filtros' : '') + '.</p>');
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
  else if (act === 'precos') atualizarPrecos();
  else if (act === 'origem') { usarOrigem(a.getAttribute('data-v')); guardaUI(); render(); }
  else if (act === 'ord-inv') { ui.inv = !ui.inv; guardaUI(); render(); }
  else if (act === 'ord') { var ok = a.getAttribute('data-v'); if (ui.ord === ok) ui.inv = !ui.inv; else { ui.ord = ok; ui.inv = false; } guardaUI(); render(); }
  else if (act === 'tipos-limpar') { ui.tipos = []; ddAberta = false; guardaUI(); render(); }
  else if (act === 'cor') { var k = a.getAttribute('data-v'), i = ui.cores.indexOf(k); if (i >= 0) ui.cores.splice(i, 1); else ui.cores.push(k); guardaUI(); render(); }
  else if (act === 'cores-limpar') { ui.cores = []; guardaUI(); render(); }
  else if (act === 'faixa') { var fk = a.getAttribute('data-v'), fi = ui.faixas.indexOf(fk); if (fi >= 0) ui.faixas.splice(fi, 1); else ui.faixas.push(fk); guardaUI(); render(); }
  else if (act === 'faixas-limpar') { ui.faixas = []; guardaUI(); render(); }
  else if (act === 'prio' || act === 'dest') { var lp = act === 'prio' ? ui.prios : ui.dests, kv = a.getAttribute('data-v'), ix = lp.indexOf(kv); if (ix >= 0) lp.splice(ix, 1); else lp.push(kv); guardaUI(); render(); }
  else if (act === 'prios-limpar') { ui.prios = []; guardaUI(); render(); }
  else if (act === 'dests-limpar') { ui.dests = []; guardaUI(); render(); }
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
  if (t.matches && t.matches('select[data-ctl="cormodo"]')) { ui.corModo = t.value; guardaUI(); render(); return; }
  if (t.matches && t.matches('select[data-ctl="sub"]')) { ui.sub = t.value; guardaUI(); render(); return; }
  if (t.matches && t.matches('select[data-cp="pasta"]')) {   // escolher a pasta já é a decisão: Guardar nela (ou Venda, se a cópia já ia para a venda)
    var cP = CARTAS.filter(function (x) { return x.id === t.getAttribute('data-id'); })[0]; if (!cP || !DB.db || !DB.pode || !t.value) return;
    var iP = +t.getAttribute('data-i'), dP = decCopias(cP)[iP], cpP = cP.copias[iP], destP = dP && dP.destino === 'venda' ? 'venda' : 'guardar';
    gravar(cP, iP, { imp: cpP.imp, acab: cpP.acab, destino: destP, deck: null, pasta: t.value, em: hojeISO(), nota: (dP && dP.nota) || '', pet: !!(dP && dP.pet), aplicado: null });
    aviso(nomeD(destP) + ' na pasta ' + t.value + ': registrado.'); return;
  }
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
ui.prios = ui.prios.filter(function (k) { return ORDP.indexOf(k) >= 0; });
ui.dests = ui.dests.filter(function (k) { return ORDG.indexOf(k) >= 0; });
aplicarVivos();   // preços que este navegador já buscou no Scryfall, se mais novos que o build
// o hub abre uma pasta direto na Caixa: 00. Caixa.html#lista=Preta%20P
var hl = /^#lista=(.+)$/.exec(location.hash || '');
if (hl) { try { ui.origem = decodeURIComponent(hl[1]); } catch (e) { } }
usarOrigem(ui.origem || 'Caixa');
barra();
render();
ligarBanco();
// a barra do topo, a mesma do hub e do Grimório: Decks, Pastas, Caixa, Dashboard e Grimório. A aberta fica dourada (Caixa, ou Pastas
// na página de uma pasta). No arquivo local os links vão aos HTML de saidas/; publicada, aos links do claude.ai, com a aba no fim.
function barra() {
  var N = D.nav || {}, hub = N.hub || {}, b = PUB && hub.pub ? hub.pub : (hub.href || '00.%20Hub.html');
  $('#cx-l-decks').href = b + '#decks'; $('#cx-l-pastas').href = b + '#pastas'; $('#cx-l-dash').href = b + '#dashboard';
  var cx = $('#cx-l-caixa');
  if (eCaixa()) { cx.setAttribute('aria-current', 'page'); cx.href = '#main'; cx.title = 'Você está na Caixa: volta ao topo'; }
  else {
    $('#cx-l-pastas').setAttribute('aria-current', 'page');
    if (N.caixa) cx.href = PUB && N.caixa.pub ? N.caixa.pub : N.caixa.href;
  }
  var g = $('#cx-l-grim'); if (N.grim) { g.hidden = false; g.href = PUB && N.grim.pub ? N.grim.pub : N.grim.href; }
  if (N.cons) $('#cx-l-cons').href = PUB && N.cons.pub ? N.cons.pub : N.cons.href;
  var cc = $('#cx-l-cic'); if (N.cic) { cc.hidden = false; cc.href = PUB && N.cic.pub ? N.cic.pub : N.cic.href; }
}
$('#cx-l-caixa').addEventListener('click', function (ev) { if (this.getAttribute('aria-current')) { ev.preventDefault(); window.scrollTo(0, 0); } });
window.CAIXA = { D: D, ui: ui, render: render, abrir: abrir, placarDe: placarDe, ORS: ORS };   // para os testes
