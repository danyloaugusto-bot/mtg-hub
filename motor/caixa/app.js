/* A Caixa (motor/caixa.py monta os dados; este arquivo só desenha e grava as decisões).
   A única página que mostra preço: exceção à decisão "Sem preço" de 14/10/2026, só aqui (dono, 17/10/2026).
   Decisão cópia a cópia, gravada no banco da Caixa publicada (coleção "decisoes", um documento por carta). */
var D = /*__DATA__*/null;
var R = D.regua, CR = D.crit, CARTAS = D.cartas, DECKS = D.decks;
var LS = 'mtg-hub:caixa:v1';
var ui = { ver: 'tabela', agrupar: 'prioridade', dec: 'pendentes', tipo: '', deck: '', q: '' };
try { var g = JSON.parse(localStorage.getItem(LS) || '{}'); ['ver', 'agrupar', 'dec', 'tipo', 'deck'].forEach(function (k) { if (g[k]) ui[k] = g[k]; }); } catch (e) { }
function guardaUI() { try { localStorage.setItem(LS, JSON.stringify({ ver: ui.ver, agrupar: ui.agrupar, dec: ui.dec, tipo: ui.tipo, deck: ui.deck })); } catch (e) { } }

var DB = { db: null, pode: false, docs: null, erro: '', ocupado: {} };
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
var NOMED = { deck: 'Deck', guardar: 'Guardar', venda: 'Venda', bundles: 'Bundles', bulk: 'Bulk' };
var ORDD = ['deck', 'guardar', 'venda', 'bundles', 'bulk'], ORDP = ['S', 'A', 'B', 'C'];
var TIPOS = [['cri', 'Criaturas'], ['ins', 'Mágicas instantâneas'], ['fei', 'Feitiços'], ['art', 'Artefatos'], ['enc', 'Encantamentos'], ['pw', 'Planeswalkers'], ['bat', 'Batalhas'], ['ter', 'Terrenos']];
var NOMEC = { '': 'Incolor', W: 'Mono-branco', U: 'Mono-azul', B: 'Mono-preto', R: 'Mono-vermelho', G: 'Mono-verde',
  WU: 'Azorius', UB: 'Dimir', BR: 'Rakdos', RG: 'Gruul', WG: 'Selesnya', WB: 'Orzhov', UR: 'Izzet', BG: 'Golgari', WR: 'Boros', UG: 'Simic',
  WUB: 'Esper', UBR: 'Grixis', BRG: 'Jund', WRG: 'Naya', WUG: 'Bant', WBG: 'Abzan', WUR: 'Jeskai', UBG: 'Sultai', WBR: 'Mardu', URG: 'Temur',
  UBRG: 'Glint', WBRG: 'Dune', WURG: 'Ink', WUBG: 'Witch', WUBR: 'Yore', WUBRG: 'WUBRG' };
function ordemCor(s) { return 'WUBRG'.split('').filter(function (k) { return s.indexOf(k) >= 0; }).join(''); }
function msym(s) { var k = s.toUpperCase(); if (/^[WUBRG]$/.test(k)) return '<i class="ms ms-' + k + '">' + k + '</i>'; return '<i class="ms ms-C">' + esc(s) + '</i>'; }
function mana(cost) { return cost ? '<span class="cx-cost">' + cost.replace(/\s/g, '').split('//')[0].replace(/\{([^}]+)\}/g, function (m, s) { return msym(s.replace('/', '')); }) + '</span>' : ''; }

/* ---------- decisões: o banco publicado prevalece sobre o arquivo ---------- */
function decisoesDe(c) {
  var d = DB.docs && DB.docs[c.id] ? DB.docs[c.id] : (D.dec[c.n] || null);
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
function pendentes(c) { return decCopias(c).filter(function (x) { return !(x && x.destino); }).length; }
function prioCarta(c) {
  var dc = decCopias(c), best = 'C', tem = false;
  c.copias.forEach(function (cp, i) { if (dc[i] && dc[i].destino && ui.dec === 'pendentes') return; tem = true; if (ORDP.indexOf(cp.sug.P) < ORDP.indexOf(best)) best = cp.sug.P; });
  return tem ? best : c.copias[0].sug.P;
}
function sugCarta(c) {
  var dc = decCopias(c);
  for (var i = 0; i < c.copias.length; i++) if (!(dc[i] && dc[i].destino)) return c.copias[i].sug;
  return c.copias[0].sug;
}

function visiveis() {
  var q = ui.q.trim().toLowerCase();
  return CARTAS.filter(function (c) {
    var p = pendentes(c);
    if (ui.dec === 'pendentes' && !p) return false;
    if (ui.dec === 'decididas' && p) return false;
    if (ui.tipo && c.t !== ui.tipo) return false;
    if (ui.deck && !encDe(c, ui.deck)) return false;   // só as cartas nas cores do comandante (o encaixe só existe nelas)
    if (q && c.n.toLowerCase().indexOf(q) < 0 && (c.on || '').toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
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
    var cs = L.filter(function (c) { return focoDe(c, p) === f[0]; }).sort(function (a, b) { return encDe(b, p).g - encDe(a, p).g || a.n.localeCompare(b.n); });
    return { k: f[0], n: f[1], o: i, cs: cs, dica: dicas[f[0]] };
  }).filter(function (g) { return g.cs.length; });
}
function grupos(L) {
  if (ui.deck && DECKS[ui.deck]) return gruposFoco(L);
  var g = {}, ordem = [];
  function add(k, nome, ord, c) { if (!g[k]) { g[k] = { k: k, n: nome, o: ord, cs: [] }; ordem.push(k); } g[k].cs.push(c); }
  L.forEach(function (c) {
    var s = sugCarta(c);
    if (ui.agrupar === 'prioridade') { var p = prioCarta(c); add(p, 'Prioridade ' + p, ORDP.indexOf(p), c); }
    else if (ui.agrupar === 'tipo') { var t = TIPOS.filter(function (x) { return x[0] === c.t; })[0] || ['?', 'Outros']; add(t[0], t[1], TIPOS.indexOf(t), c); }
    else if (ui.agrupar === 'destino') add(s.d, NOMED[s.d], ORDD.indexOf(s.d), c);
    else if (ui.agrupar === 'cor') { var k = ordemCor(c.ident || ''); add('c' + k, NOMEC[k] || k, k.length * 100 + (Object.keys(NOMEC).indexOf(k)), c); }
    else { var dk = s.d === 'deck' && s.p ? s.p : ''; add('d' + dk, dk ? curto(dk) + (DECKS[dk] ? ' · ' + DECKS[dk].n : '') : 'Sem deck sugerido', dk ? 0 : 1, c); }
  });
  var out = ordem.map(function (k) { return g[k]; });
  out.sort(function (a, b) { return a.o - b.o || a.n.localeCompare(b.n, 'pt-BR'); });
  out.forEach(function (x) { x.cs.sort(function (a, b) { return ORDP.indexOf(prioCarta(a)) - ORDP.indexOf(prioCarta(b)) || (b.valor - a.valor) || a.n.localeCompare(b.n); }); });
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
  var r = D.resumo;
  return '<div class="seg"><span class="seg-l">Prioridade</span>' + ORDP.map(function (p) { return it(pri[p][0] + ' ' + p, '', !pri[p][0]); }).join('') + '</div>' +
    '<div class="seg"><span class="seg-l">Sugestão</span>' + ORDD.map(function (d) { return it(dest[d][0] ? usd(dest[d][1]) : '—', NOMED[d] + ' <small class="dim">' + dest[d][0] + '</small>', !dest[d][0]); }).join('') + '</div>' +
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
function seletorTipo() {
  var n = {}; CARTAS.forEach(function (c) { n[c.t] = (n[c.t] || 0) + 1; });
  if (ui.tipo && !n[ui.tipo]) ui.tipo = '';
  $('#ft').innerHTML = '<option value="">Todos os tipos (' + CARTAS.length + ')</option>' + TIPOS.filter(function (t) { return n[t[0]]; }).map(function (t) {
    return '<option value="' + t[0] + '"' + (ui.tipo === t[0] ? ' selected' : '') + '>' + t[1] + ' (' + n[t[0]] + ')</option>';
  }).join('');
}
function controles() {
  return seletorDeck() + seg('Ver', 'ver', [['tabela', 'Tabela'], ['galeria', 'Galeria']]) +
    (ui.deck ? '' : seg('Agrupar', 'agrupar', [['prioridade', 'Prioridade'], ['tipo', 'Tipo'], ['destino', 'Destino'], ['cor', 'Cor'], ['deck', 'Deck']])) +
    seg('Decisão', 'dec', [['pendentes', 'Pendentes'], ['decididas', 'Decididas'], ['todas', 'Todas']]);
}

/* ---------- pedaços de uma carta ---------- */
function forca(c) {
  return '<b class="num">' + fmt(c.vp) + '</b>' + (c.gc ? ' <span class="cx-gc" title="Game Changer">GC</span>' : '') + (c.staple ? ' <span class="cx-st" title="top ' + R.staple_rank_max + ' do EDHREC">Staple</span>' : '') +
    '<small>' + (c.rank ? '#' + fmt(c.rank, 0) + ' no EDHREC' : 'fora do ranking do EDHREC') + '</small>';
}
function valorTxt(c) {
  var foil = c.copias.filter(function (x) { return x.acab !== 'normal'; });
  return '<b class="num">' + usd(c.valor) + '</b>' + brl(c.valor) + (c.q > 1 ? '<small>' + c.q + ' cópias</small>' : '') +
    (foil.length ? '<small>' + foil.map(function (x) { return x.acab; }).join(', ') + '</small>' : '');
}
function sugTxt(s) {
  var h = '<span class="cx-dest cx-d-' + s.d + '">' + NOMED[s.d] + '</span>' + (s.p ? esc(curto(s.p)) : '');
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
  var cp0 = c.copias[0];
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
    var d = dc[i], s = cp.sug;
    var rot = d && d.destino ? (i + 1) + ' ✓ ' + NOMED[d.destino] + (d.deck ? ' · ' + curto(d.deck) : d.pasta ? ' · ' + d.pasta : '')
      : (i + 1) + ' → ' + NOMED[s.d] + (s.p && s.d === 'deck' ? ' · ' + curto(s.p) : '') + ' ▾';
    return '<button class="bt-c' + (d && d.destino ? ' dec-on' : '') + '" data-act="abrir" data-id="' + esc(c.id) + '">' + esc(rot) + '</button>';
  }).join('') + '</div>';
}
function imgDe(c) { return D.img && D.img[c.id] ? '<img src="' + D.img[c.id] + '" alt="' + esc(c.n) + '" loading="lazy">' : '<span class="cx-sem">' + esc(c.n) + '\n' + esc(c.line) + '</span>'; }

/* ---------- tabela e galeria ---------- */
function tabela(G) {
  var cab = '<thead><tr><th scope="col">Prior.</th><th scope="col">Carta</th><th scope="col">Custo</th><th scope="col">Força sozinha</th><th scope="col" class="n">Valor</th>' +
    '<th scope="col">Sugestão</th><th scope="col" class="n">Ganho</th><th scope="col">Já está em</th><th scope="col">Decisão</th></tr></thead>';
  var corpo = G.map(function (gr) {
    return '<tr class="grp"><td colspan="9">' + esc(gr.n) + '<span>' + pl(gr.cs.length, 'carta', 'cartas') + ' · ' + usd(valorGrupo(gr.cs)) + (gr.dica ? ' · ' + esc(gr.dica) : '') + '</span></td></tr>' + gr.cs.map(function (c) {
      var s = sugCarta(c), e = ui.deck ? encDe(c, ui.deck) : s.p ? c.enc.filter(function (x) { return x.p === s.p; })[0] : null;
      return '<tr class="cx-r" data-id="' + esc(c.id) + '">' +
        '<td class="cx-pr" data-v="' + prioCarta(c) + '">' + tierB(prioCarta(c)) + '</td>' +
        '<td class="cx-ca" data-v="' + esc(c.n) + '"><button class="cx-nm" data-act="abrir" data-id="' + esc(c.id) + '">' + esc(c.on || c.n) + '</button>' + (c.q > 1 ? '<span class="cx-xn">×' + c.q + '</span>' : '') +
        '<small>' + esc(c.line) + ' · ' + esc(c.copias[0].imp) + '</small></td>' +
        '<td class="cx-co" data-v="' + c.cmc + '">' + mana(c.cost) + '</td>' +
        '<td class="cx-fo" data-l="Força sozinha" data-v="' + c.vp + '">' + forca(c) + '</td>' +
        '<td class="cx-vl n" data-v="' + (c.valor || 0) + '">' + valorTxt(c) + '</td>' +
        '<td class="cx-sg" data-l="Sugestão" data-v="' + NOMED[s.d] + '">' + sugTxt(s) + '</td>' +
        '<td class="cx-ga n" data-v="' + (e ? e.g : '') + '">' + (ui.deck ? ganhoFoco(c) : ganhoTxt(c, s)) + '</td>' +
        '<td class="cx-ja" data-l="Já está em">' + jaTxt(c) + '</td>' +
        '<td class="cx-dc" data-l="Decisão">' + decTxt(c) + '</td></tr>';
    }).join('');
  }).join('');
  return '<div class="cx-tw"><table class="tbl cx-t">' + cab + '<tbody>' + corpo + '</tbody></table></div>';
}
function galeria(G) {
  return G.map(function (gr) {
    return '<div class="cx-g-h"><h2>' + esc(gr.n) + '</h2><span>' + gr.cs.length + ' · ' + usd(valorGrupo(gr.cs)) + (gr.dica ? ' · ' + esc(gr.dica) : '') + '</span></div><div class="cx-gal">' + gr.cs.map(function (c) {
      var s = sugCarta(c), e = ui.deck ? encDe(c, ui.deck) : s.p ? c.enc.filter(function (x) { return x.p === s.p; })[0] : null;
      return '<button class="cx-cd" data-act="abrir" data-id="' + esc(c.id) + '" aria-label="' + esc(c.n) + '">' + imgDe(c) + tierB(prioCarta(c)) +
        (c.q > 1 ? '<span class="cx-xn">×' + c.q + '</span>' : '') +
        '<span class="cx-li"><b class="num">' + usd(c.valor) + '</b><span>força ' + fmt(c.vp) + '</span></span>' +
        (ui.deck ? '<span class="cx-sg">' + esc(curto(ui.deck)) + ' <b class="' + (e.g > 0 ? 'cx-pos' : 'cx-neg') + '">' + sinal(e.g) + '</b>' + (e.a ? '' : '<span class="cx-ast">*</span>') + (e.j ? ' · já está' : ' · sai ' + esc(e.s || '—')) + '</span>'
          : '<span class="cx-sg"><span class="cx-dest cx-d-' + s.d + '">' + NOMED[s.d] + '</span>' + (s.p ? esc(curto(s.p)) : '') + (e ? ' ' + sinal(e.g) : '') + '</span>') + '</button>';
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
      '<td class="n num ' + (e.g > 0 ? 'cx-pos' : 'cx-neg') + '" data-v="' + e.g + '">' + sinal(e.g) + (e.a ? '' : '<span class="cx-ast">*</span>') + '</td><td class="n num" data-v="' + e.v + '">' + fmt(e.v) + '</td>' +
      '<td>' + (e.j ? 'já está no deck' : 'sai ' + esc(e.s || '—') + ' (' + fmt(e.vs) + ')') + '</td><td><small class="dim">' + esc(obs.join(' · ')) + '</small></td></tr>';
  }).join('');
  var verTodos = c.enc.length > 10 ? '<p class="cx-nt"><button class="bt-c" data-act="enc-todos" data-id="' + esc(c.id) + '">' + (aberta === c.id + ':todos' ? 'Ver só os dez primeiros' : 'Ver todos os ' + c.enc.length) + '</button></p>' : '';
  var s0 = sugCarta(c);
  var sugBox = '<div class="cx-sug"><h3>Sugestão: ' + NOMED[s0.d] + (s0.p ? ' → ' + esc(curto(s0.p)) : '') + ' · prioridade ' + s0.P + '</h3><p>' + esc(s0.pq) + '</p>' +
    ((s0.marcas || []).length ? '<p>' + s0.marcas.map(function (m) { return '<span class="cx-mc">' + esc(m) + '</span>'; }).join('') + '</p>' : '') +
    (c.avaliar.length ? '<p class="cx-nt">Sinergia a avaliar antes de decidir: ' + c.avaliar.map(curto).map(esc).join(', ') + ' (o /caixa avalia).</p>' : '') + '</div>';
  var cps = '<div class="cx-cps">' + c.copias.map(function (cp, i) { return copiaHtml(c, cp, i, dc[i]); }).join('') + '</div>' +
    '<p class="cx-nt">' + (DB.db && DB.pode ? 'Deck: a carta vai ao radar do deck como "avaliar" e sai da lista de compras quando o /caixa aplicar. Guardar e Venda pedem a pasta física. Nada muda na decklist sem o seu pedido.'
      : PUB ? 'Só quem edita a Caixa grava decisões.' : 'Arquivo local: as decisões gravam só na Caixa publicada. Aqui a gaveta é para consulta.') + '</p>';
  return '<button class="cx-gav-x" data-act="fechar" aria-label="Fechar">×</button><div class="cx-gv"><div class="cx-gv-img">' + imgDe(c) +
    '<p>Impressão da caixa: ' + esc(c.copias.map(function (x) { return x.imp + ', ' + x.acab; }).join('; ')) + '. <a href="https://www.ligamagic.com.br/?view=cards/card&card=' + encodeURIComponent(c.n) + '" target="_blank" rel="noopener noreferrer">Abrir na LigaMagic</a></p>' +
    (c.fx ? '<p class="dim" style="white-space:pre-line">' + esc(c.fx) + '</p>' : '') + '</div>' +
    '<div><h2 id="cx-gav-t">' + esc(c.on || c.n) + (c.q > 1 ? '<span class="cx-xn">×' + c.q + '</span>' : '') + '</h2>' + (c.on ? '<p class="dim">' + esc(c.n) + '</p>' : '') +
    '<p class="cx-line">' + mana(c.cost) + ' ' + esc(c.line) + (c.pt ? ' ' + esc(c.pt) : '') + ' · identidade ' + (mana(ordemCor(c.ident).split('').map(function (k) { return '{' + k + '}'; }).join('')) || 'incolor') + '</p>' +
    '<div class="cx-chips">' + chips + '</div>' + (c.por_que ? '<p class="cx-nt" style="margin:-6px 0 14px">' + esc(c.por_que) + '</p>' : '') +
    '<div class="cx-bx"><div><h3>Valor</h3><ul>' + valor + '</ul></div><div><h3>Onde já está</h3><ul>' + onde + '</ul></div><div><h3>Quem pede no radar</h3><ul>' + radar + '</ul></div>' +
    '<div><h3>Mais jogada com (EDHREC)</h3><ul>' + edh + '</ul></div><div><h3>Nas pastas</h3><ul>' + pastas + '</ul></div><div><h3>Na lista de compras</h3><ul>' + compra + '</ul></div></div>' +
    '<h3 class="sub">Em qual deck rende mais</h3><div class="cx-tw" style="background:none;box-shadow:none"><table class="tbl cx-enc" data-nosort><thead><tr><th>Deck</th><th>Cores</th><th class="n">Ganho</th><th class="n">Vale</th><th>Quem sai</th><th></th></tr></thead><tbody>' + encRows + '</tbody></table></div>' + verTodos +
    '<p class="cx-nt">Ganho: o valor da carta nos critérios do deck, com saturação, menos o da carta de menor valor que sairia. Asterisco: sinergia ainda não avaliada naquele deck, o número é piso.</p>' +
    sugBox + cps + '</div></div>';
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
    bt('deck', 'Deck') + (opc.length ? selDeck : '') + bt('guardar', 'Guardar') + bt('bundles', 'Bundles') + bt('venda', 'Venda') + bt('bulk', 'Bulk') + selPasta +
    '<input type="text" data-cp="nota" data-id="' + esc(c.id) + '" data-i="' + i + '" placeholder="anotação (opcional)" value="' + esc((d && d.nota) || '') + '"' + (pode ? '' : ' disabled') + '>' +
    '<small>Sugestão desta cópia: ' + NOMED[s.d] + (s.p ? ' · ' + esc(curto(s.p)) : '') + ' · prioridade ' + s.P + '. ' + esc(s.pq) + (d && d.destino ? ' Decidido em ' + esc(fdata(d.em)) + '.' : '') + '</small></div>';
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
  var nova = { imp: cp.imp, acab: cp.acab, destino: destino, deck: null, pasta: null, em: hojeISO(), nota: (atual && atual.nota) || '', aplicado: null };
  if (atual && atual.destino === destino) nova.destino = null;   // clicar de novo desfaz
  if (nova.destino === 'deck') {
    var sel = document.querySelector('select[data-cp="deck"][data-id="' + c.id + '"][data-i="' + i + '"]');
    nova.deck = sel ? sel.value : (cp.sug.p || null);
    if (!nova.deck) { aviso('Esta carta não tem deck nas cores dela.'); return; }
  }
  if (nova.destino === 'guardar' || nova.destino === 'venda') {
    var sp = document.querySelector('select[data-cp="pasta"][data-id="' + c.id + '"][data-i="' + i + '"]');
    nova.pasta = sp ? sp.value : '';
    if (!nova.pasta) { aviso('Escolha a pasta física de ' + NOMED[nova.destino].toLowerCase() + ' antes.'); if (sp) sp.focus(); return; }
  }
  gravar(c, i, nova);
}
function gravar(c, i, nova) {
  var dc = decCopias(c).slice();
  dc[i] = nova;
  var aplicadas = (((DB.docs && DB.docs[c.id]) || D.dec[c.n] || {}).copias || []).filter(function (x) { return x.aplicado; });
  var copias = aplicadas.concat(dc.filter(function (x) { return x && (x.destino || x.nota); }));
  var key = c.id + '|' + i;
  DB.ocupado[key] = 1; redesenharGaveta();
  var ref = DB.db.collection('decisoes').doc(c.id);
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
    DB.db.collection('decisoes').onSnapshot(function (s) {
      var m = {}; s.docs.forEach(function (x) { if (x.exists) m[x.id] = x.data(); });
      DB.docs = m; render(); redesenharGaveta();
    }, function (e) { DB.erro = (e && e.code) || 'erro'; render(); });
  }, function () { render(); });
}

/* ---------- desenho ---------- */
function render() {
  var r = D.resumo;
  $('#cx-tot').textContent = pl(r.cartas, 'carta', 'cartas') + ' · ' + pl(r.copias, 'cópia', 'cópias') + ' · ' + usd(r.valor) + ' no total';
  $('#cx-resumo').innerHTML = resumo();
  $('#cx-ctl').innerHTML = controles();
  var L = visiveis(), G = grupos(L);
  var dk = ui.deck && DECKS[ui.deck];
  var lede = dk ? '<p class="cx-foco">Para o <b>' + esc(dk.c) + '</b> (' + esc(dk.n) + '): ' + pl(L.length, 'carta', 'cartas') + ' da caixa nas cores do comandante, ' +
    (mana(ordemCor(dk.i).split('').map(function (k) { return '{' + k + '}'; }).join('')) || 'incolor') + ', do maior ganho para o menor.' +
    (dk.precon ? ' Precon intacto: a lista não muda, o encaixe é só referência.' : '') + ' Asterisco: o deck nunca avaliou a carta, o ganho é piso (o /caixa avalia a sinergia).</p>' : '';
  $('#cx-lista').innerHTML = lede + (L.length ? (ui.ver === 'tabela' ? tabela(G) : galeria(G)) :
    '<p class="dim">' + (ui.dec === 'pendentes' ? 'Nenhuma carta pendente' : ui.dec === 'decididas' ? 'Nenhuma carta decidida ainda' : 'Nenhuma carta') + (ui.q ? ' com esse nome' : '') + (ui.tipo ? ' entre ' + (TIPOS.filter(function (t) { return t[0] === ui.tipo; })[0] || ['', ''])[1].toLowerCase() : '') + '.</p>');
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
  else if (act === 'fechar') fechar();
  else if (act === 'enc-todos') { aberta = aberta === id + ':todos' ? id : id + ':todos'; redesenharGaveta(); }
  else if (act === 'decidir') { var c = CARTAS.filter(function (x) { return x.id === id; })[0]; if (c) decidir(c, +a.getAttribute('data-i'), a.getAttribute('data-k')); }
});
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (t.matches && t.matches('select[data-ctl="deck"]')) { ui.deck = t.value; guardaUI(); render(); return; }
  if (!t.matches || !t.matches('input[data-cp="nota"]')) return;
  var c = CARTAS.filter(function (x) { return x.id === t.getAttribute('data-id'); })[0]; if (!c || !DB.db || !DB.pode) return;
  var i = +t.getAttribute('data-i'), dc = decCopias(c), cp = c.copias[i];
  var nova = dc[i] ? JSON.parse(JSON.stringify(dc[i])) : { imp: cp.imp, acab: cp.acab, destino: null, deck: null, pasta: null, em: hojeISO(), aplicado: null };
  nova.nota = t.value.trim();
  gravar(c, i, nova);
});
document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !$('#cx-gav').hidden) fechar(); });
$('#q').addEventListener('input', function () { ui.q = this.value; render(); });
$('#ft').addEventListener('change', function () { ui.tipo = this.value; guardaUI(); render(); });
seletorTipo();
if (ui.deck && (!DECKS[ui.deck] || DECKS[ui.deck].desejo)) ui.deck = '';
if (PUB && D.hub_pub) $('#cx-hub').href = D.hub_pub;
render();
ligarBanco();
window.CAIXA = { D: D, ui: ui, render: render, abrir: abrir };   // para os testes
