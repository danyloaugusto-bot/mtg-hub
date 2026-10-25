/* Os Ciclos (motor/ciclos/app.js): a página lê window.CICLOS (montado por motor/ciclos.py a partir de dados/ciclos/ciclos-lido.json)
   e desenha as seis sub-abas: Ano, Coleção, Cores, Raridade, Nos meus decks e Pendências. Nada é calculado de novo aqui: identidade,
   raridade, grau no vácuo, onde está, onde rende e em que deck cabe vêm do motor. Sem rede e sem preço. Guarda no navegador
   (ciclos:v1) a vista, a ordem, o agrupamento, os grupos fechados, a lente de cada aba e o deck. Endereços: #ano, #colecao, #cores,
   #raridade, #decks, #pendencias (e #aba=valor). O botão Consultar leva a carta à aba Consulta. */
(function () {
  'use strict';
  var D = /*__DATA__*/null;
  window.CICLOS = D;
  var ABAS = ['ano', 'colecao', 'cores', 'raridade', 'decks', 'pendencias'];
  var cards = D.cards, CRIT = {}, COL = {}, CIC = {}, DECK = {};
  D.crit.forEach(function (c) { CRIT[c.k] = c; });
  D.colecoes.forEach(function (c) { COL[c.k] = c; });
  D.ciclos.forEach(function (c) { CIC[c.k] = c; });
  D.decks.forEach(function (d) { DECK[d.p] = d; });
  var TODAS = Object.keys(cards).map(function (n) { return cards[n]; });
  var NOME_COR = { W: 'Branco', U: 'Azul', B: 'Preto', R: 'Vermelho', G: 'Verde' };
  var RAR_NOME = { C: 'Comum', U: 'Incomum', R: 'Rara', M: 'Mítica' };
  var GRAUS = ['S', 'A', 'B', 'C', 'D'];
  var AGRUPAR = ['nenhum', 'status', 'grau', 'cor', 'raridade', 'colecao', 'tipo'];
  var VISTAS = ['ciclos', 'lista', 'galeria'];

  function $(s, r) { return (r || document).querySelector(s); }
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k.slice(0, 2) === 'on') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c == null || c === false) return; el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c))); });
    return el;
  }
  // a imagem: uma das quatro cartas de uma folha 2×2 em ciclos-img/ (publicada junto com a página); a moldura recorta a carta
  function imgCarta(c, lazy) {
    if (!c.sp) return null;
    var k = c.sp[1];
    return h('span', { class: 'c-sp' }, [h('img', { src: (D.img_dir || 'ciclos-img') + '/' + c.sp[0], alt: c.n, loading: lazy ? 'lazy' : null, decoding: 'async',
      style: 'transform:translate(' + (-(k % 2) * 50) + '%,' + (-Math.floor(k / 2) * 50) + '%)' })]);
  }
  function nomeDeck(p) { var i = p.indexOf('. '); return i > 0 ? p.slice(i + 2) : p; }
  function data(d) { return d ? d.split('-').reverse().join('/') : '—'; }
  function mes(d) { return d && d.length >= 7 ? d.slice(5, 7) + '/' + d.slice(0, 4) : (d || '—'); }
  function ganho(g) { return (g < 0 ? '−' : '+') + Math.abs(g).toFixed(1).replace('.', ','); }
  function num(n) { return n == null ? '—' : String(Math.round(n * 10) / 10).replace('.', ','); }
  function dv(v) { return v == null ? '' : String(v).replace('.', ','); }
  function inteiro(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
  function cicloDe(c) { return CIC[c.ciclo] || {}; }
  function colDe(c) { return COL[cicloDe(c).codigo] || {}; }
  function pendente(c) { return !c.enc || c.ver; }

  // ---------------- estado
  var S = { aba: 'ano', lente: {}, ordem: '', inv: false, agrupar: 'nenhum', fech: {}, st: 'todas', grau: 'todos', rar: 'todas', cores: '', pend: false, vista: {}, q: '', deck: null };
  var anos = []; D.colecoes.forEach(function (c) { if (c.ano != null && anos.indexOf(String(c.ano)) < 0) anos.push(String(c.ano)); }); anos.sort().reverse();
  S.lente.ano = anos[0] || null;
  S.lente.colecao = D.colecoes.length ? D.colecoes[D.colecoes.length - 1].k : null;
  var IDENTS = (function () {   // as identidades presentes, da mono à de cinco cores, incolor por último
    var m = {}; TODAS.forEach(function (c) { if (c.enc) m[c.ci || 'C'] = (m[c.ci || 'C'] || 0) + 1; });
    return Object.keys(m).sort(function (a, b) { return (a === 'C') - (b === 'C') || a.length - b.length || ordemCi(a) - ordemCi(b); }).map(function (k) { return { k: k, q: m[k] }; });
  })();
  function ordemCi(ci) { var s = 0; ci.split('').forEach(function (ch, i) { s = s * 6 + ('WUBRG'.indexOf(ch) + 1); }); return s; }
  S.lente.cores = IDENTS.length ? IDENTS[0].k : null;
  S.lente.raridade = 'M';
  var decksSel = D.decks.slice();
  S.deck = decksSel.length ? decksSel[0].p : null;
  function carregar() {
    try {
      var m = JSON.parse(localStorage.getItem('ciclos:v1') || '{}');
      if (m.vista && typeof m.vista === 'object') S.vista = m.vista;
      if (m.ordem) S.ordem = m.ordem;
      if (m.inv) S.inv = true;
      if (AGRUPAR.indexOf(m.agrupar) >= 0) S.agrupar = m.agrupar;
      if (m.fech && typeof m.fech === 'object') S.fech = m.fech;
      if (m.deck && DECK[m.deck]) S.deck = m.deck;
      if (m.lente) { if (anos.indexOf(m.lente.ano) >= 0) S.lente.ano = m.lente.ano; if (COL[m.lente.colecao]) S.lente.colecao = m.lente.colecao; if (IDENTS.some(function (x) { return x.k === m.lente.cores; })) S.lente.cores = m.lente.cores; if (RAR_NOME[m.lente.raridade]) S.lente.raridade = m.lente.raridade; }
    } catch (e) {}
  }
  function guardar() { try { localStorage.setItem('ciclos:v1', JSON.stringify({ vista: S.vista, ordem: S.ordem, inv: S.inv, agrupar: S.agrupar, fech: S.fech, deck: S.deck, lente: S.lente })); } catch (e) {} }
  carregar();
  try { var qd = new URLSearchParams(location.search).get('deck'); if (qd && DECK[qd]) S.deck = qd; } catch (e) {}

  // ---------------- peças
  function sym(s) {
    var cls = 'g-ms', txt = s;
    if (/^[WUBRG]$/.test(s)) cls += ' g-ms-' + s;
    else if (/^[WUBRG]\/[WUBRG]$/.test(s)) cls += ' hib g-ms-' + s[0];
    else if (/^[WUBRG]\/P$/.test(s)) { cls += ' g-ms-' + s[0]; txt = s[0] + 'Φ'; }
    else if (/^\d+\/[WUBRG]$/.test(s)) cls += ' hib g-ms-' + s[2];
    return h('span', { class: cls, title: '{' + s + '}' }, [txt]);
  }
  function mana(cost, ci) {
    var out = h('span', { class: 'g-mana' });
    var toks = (cost || '').match(/\{[^}]+\}/g);
    if (toks && toks.length) toks.forEach(function (t) { out.appendChild(sym(t.slice(1, -1))); });
    else (ci || '').split('').forEach(function (ch) { if (ch) out.appendChild(sym(ch)); });
    return out;
  }
  function pips(ci) { var o = h('span', { class: 'g-mana' }); if (!ci) o.appendChild(h('span', { class: 'g-ms', title: 'incolor' }, ['C'])); else ci.split('').forEach(function (ch) { o.appendChild(sym(ch)); }); return o; }
  function nomeCi(ci) { if (!ci) return 'Incolor'; if (ci.length === 1) return NOME_COR[ci]; return ci.split('').map(function (ch) { return NOME_COR[ch]; }).join(' / '); }
  function stPill(c) { return h('span', { class: 'g-st ' + c.st }, [c.st === 'tenho' ? 'Tenho' : c.st === 'ociosa' ? 'Ociosa' : 'Falta']); }
  function pendPill(c) { return !c.enc ? h('span', { class: 'g-st nao', title: 'o Scryfall não achou esta carta com este nome: confira o nome em dados/ciclos/ciclos.json' }, ['Não encontrada']) : c.ver ? h('span', { class: 'g-st pend', title: 'linha marcada "verificar" na lista: ' + (c.rar_dono === '?' ? 'raridade a confirmar' : 'conferir no Scryfall') }, ['Pendente']) : null; }
  function grauPill(c, lg) { return c.grau ? h('span', { class: 'c-grau ' + c.grau + (lg ? ' lg' : ''), title: 'grau no vácuo ' + c.grau + ' · valor próprio ' + num(c.valor) + ' (mediana do cadastro ' + num(D.mediana) + ')' }, [c.grau]) : h('span', { class: 'c-grau x' + (lg ? ' lg' : ''), title: c.enc ? 'sem nota no cadastro: o grau entra pela rubrica' : 'sem texto do Scryfall' }, [lg ? '—' : 'sem nota']); }
  function rarPill(r, dono) { var k = r || (dono && dono !== '?' ? dono : null); return h('span', { class: 'c-rar ' + (k || 'x'), title: k ? RAR_NOME[k] || k : 'raridade a confirmar' }, [k || '?']); }
  function chipsOnde(c, max) {
    var out = [];
    (c.onde || []).forEach(function (x) { if (x.w === 'deck') out.push(h('span', { class: 'g-d' + (x.dj ? ' dj' : ''), title: (x.dj ? 'deck de desejo, não existe fisicamente' : 'no deck') + ' · tier ' + x.t + ' · ' + x.r }, [x.d, x.dj ? ' · desejo' : null, h('span', { class: 'T' }, [x.t])])); });
    (c.onde || []).forEach(function (x) { if (x.w === 'radar') out.push(h('span', { class: 'g-d radar' + (x.dj ? ' dj' : ''), title: 'no radar, veredito ' + (x.v || 'avaliar') + ' · tier ' + x.t }, [x.d + ' · radar ', h('span', { class: 'T' }, [x.t])])); });
    Object.keys(c.pastas || {}).forEach(function (p) { out.push(h('span', { class: 'g-d pasta', title: p === 'Caixa' ? 'na Caixa' : 'na pasta ' + p }, [p === 'Caixa' ? 'Caixa' : 'Pasta ' + p, c.pastas[p] > 1 ? ' ×' + c.pastas[p] : null])); });
    if (max && out.length > max) { var n = out.length - max; out = out.slice(0, max); out.push(h('span', { class: 'g-d' }, ['+' + n])); }
    return out;
  }
  function chipsRende(c, max, link) {
    var out = (c.rende || []).slice(0, max || 3).map(function (r) {
      return h(link ? 'button' : 'span', { class: 'g-d rende' + (link ? ' g-dl' : ''), type: link ? 'button' : null, onclick: link ? function () { S.deck = r.p; guardar(); vai('decks'); } : null, title: 'ganho ' + ganho(r.g) + (r.s ? ' · sai ' + r.s : '') + (r.a ? '' : ' · sinergia a avaliar (piso)') }, [nomeDeck(r.p), ' ', h('span', { class: 'g' }, [ganho(r.g) + (r.a ? '' : '*')])]);
    });
    return out;
  }
  function chipsCabe(c, max) {
    var out = (c.cabe || []).map(function (p) { var d = DECK[p] || {}; return h('span', { class: 'g-d' + (d.dj ? ' dj' : ''), title: 'cabe pela identidade do comandante' + (d.dj ? ' (deck de desejo)' : '') }, [nomeDeck(p)]); });
    if (max && out.length > max) { var n = out.length - max; out = out.slice(0, max); out.push(h('span', { class: 'g-d' }, ['+' + n])); }
    return out;
  }
  function crChips(c) {
    if (!c.notas) return [h('span', { class: 'g-aviso' }, [c.enc ? 'sem cadastro' : 'sem texto'])];
    var out = [];
    D.crit.forEach(function (k) { var v = c.notas[k.k]; if (v >= 2) out.push(h('span', { class: 'g-n' + v, title: k.n + ' ' + v + ' (peso ×' + k.w + ')' }, [k.n + ' ' + v])); });
    return out.length ? out : [h('span', { class: 'g-aviso' }, ['nenhuma nota 2 ou 3'])];
  }
  function vazio(titulo, texto) { return h('div', { class: 'g-vazio' }, [h('b', {}, [titulo]), texto || null]); }
  function cab(nome, meta, extra) { return h('div', { class: 'g-lh' }, [h('h2', {}, [nome]), meta ? h('span', { class: 'meta' }, [meta]) : null, extra || null]); }
  function sanfona(id, titulo, resumo, corpo, cls) {
    return h('details', { class: 'sf g-sf ' + (cls || ''), 'data-sf': id, open: S.fech[id] ? null : true }, [
      h('summary', {}, [h('span', { class: 'sf-t' }, [titulo]), resumo ? h('span', { class: 'sf-r' }, [resumo]) : null, h('i', { class: 'sf-i', 'aria-hidden': 'true' })]),
      h('div', { class: 'sf-c' }, [corpo])]);
  }
  document.addEventListener('toggle', function (ev) {
    var d = ev.target; if (!d.dataset || !d.dataset.sf) return;
    if (d.open) delete S.fech[d.dataset.sf]; else S.fech[d.dataset.sf] = 1;
    guardar();
  }, true);

  // ---------------- ordem, filtro, grupos
  var ORD = [['natural', 'Ordem do ciclo'], ['encaixe', 'Onde rende mais'], ['grau', 'Grau no vácuo'], ['status', 'Status (faltam primeiro)'], ['novo', 'Mais recentes'], ['raridade', 'Raridade'], ['custo', 'Custo'], ['nome', 'Nome']];
  var SETA = { natural: '↓', encaixe: '↓', grau: '↓', novo: '↓', raridade: '↓', status: '↑', custo: '↑', nome: '↑' };
  function ordemEf() { return ORD.some(function (o) { return o[0] === S.ordem; }) ? S.ordem : 'natural'; }
  function seta(o) { var t = SETA[o] || '↓'; return S.inv ? (t === '↓' ? '↑' : '↓') : t; }
  var POS = {}; D.ciclos.forEach(function (ci, i) { ci.cartas.forEach(function (n, j) { POS[n] = i * 100 + j; }); });
  var RARO = { M: 0, R: 1, U: 2, C: 3 }, ST = { falta: 0, ociosa: 1, tenho: 2 }, GR = { S: 0, A: 1, B: 2, C: 3, D: 4 };
  function ordena(arr) {
    var o = ordemEf();
    function rende(c) { return c.rende && c.rende.length ? c.rende[0].g : -1e9; }
    function gr(c) { return c.grau ? GR[c.grau] : 9; }
    var f = {
      natural: function (x, y) { return (POS[x.n] || 0) - (POS[y.n] || 0); },
      encaixe: function (x, y) { return rende(y) - rende(x) || gr(x) - gr(y) || x.n.localeCompare(y.n); },
      grau: function (x, y) { return gr(x) - gr(y) || (y.valor || 0) - (x.valor || 0) || x.n.localeCompare(y.n); },
      status: function (x, y) { return ST[x.st] - ST[y.st] || (POS[x.n] || 0) - (POS[y.n] || 0); },
      novo: function (x, y) { return (y.rel || '').localeCompare(x.rel || '') || (POS[x.n] || 0) - (POS[y.n] || 0); },
      raridade: function (x, y) { return (RARO[x.rar] == null ? 9 : RARO[x.rar]) - (RARO[y.rar] == null ? 9 : RARO[y.rar]) || (POS[x.n] || 0) - (POS[y.n] || 0); },
      custo: function (x, y) { return (x.cmc || 0) - (y.cmc || 0) || (POS[x.n] || 0) - (POS[y.n] || 0); },
      nome: function (x, y) { return x.n.localeCompare(y.n, 'pt-BR'); }
    };
    var out = arr.slice().sort(f[o]);
    return S.inv ? out.reverse() : out;
  }
  function pedeOrdem(k) { if (ordemEf() === k) S.inv = !S.inv; else { S.ordem = k; S.inv = false; } guardar(); desenha(); }
  function textoOk(c) { var q = S.q.trim().toLowerCase(); return !q || (c.n + ' ' + c.t + ' ' + cicloDe(c).ciclo + ' ' + colDe(c).n + ' ' + (c.pq || '')).toLowerCase().indexOf(q) >= 0; }
  function dentro(ci, ident) { for (var i = 0; i < ci.length; i++) if (ident.indexOf(ci[i]) < 0) return false; return true; }
  function passa(c) {
    if (!textoOk(c)) return false;
    if (S.st !== 'todas' && c.st !== S.st) return false;
    if (S.grau !== 'todos' && (S.grau === 'sem' ? !!c.grau : c.grau !== S.grau)) return false;
    if (S.rar !== 'todas' && (c.rar || c.rar_dono) !== S.rar) return false;
    if (S.cores && !dentro(c.ci || '', S.cores)) return false;
    if (S.pend && !pendente(c)) return false;
    return true;
  }
  function filtra(arr) { return arr.filter(passa); }
  function tipoDe(c) {
    var t = (c.t || '').split(' — ')[0].split(' // ')[0];
    var ts = [['Creature', 'Criaturas'], ['Planeswalker', 'Planeswalkers'], ['Battle', 'Batalhas'], ['Land', 'Terrenos'], ['Instant', 'Mágicas instantâneas'], ['Sorcery', 'Feitiços'], ['Artifact', 'Artefatos'], ['Enchantment', 'Encantamentos']];
    for (var i = 0; i < ts.length; i++) if (t.indexOf(ts[i][0]) >= 0) return [i, ts[i][1]];
    return [99, 'Outros'];
  }
  function corDeC(c) { var ci = c.ci || ''; if (!ci) return [0, 'Incolor']; if (ci.length > 1) return [6, 'Multicolor']; return [1 + 'WUBRG'.indexOf(ci), NOME_COR[ci]]; }
  function agrupa(arr) {
    var por = {}, ordem = [];
    arr.forEach(function (c) {
      var g = S.agrupar === 'status' ? [ST[c.st], { falta: 'Faltam', ociosa: 'Ociosas', tenho: 'Tenho' }[c.st]]
        : S.agrupar === 'grau' ? [c.grau ? GR[c.grau] : 9, c.grau ? 'Grau ' + c.grau : 'Sem nota']
        : S.agrupar === 'cor' ? corDeC(c)
        : S.agrupar === 'raridade' ? [RARO[c.rar] == null ? 9 : RARO[c.rar], c.rar ? RAR_NOME[c.rar] : 'Raridade a confirmar']
        : S.agrupar === 'colecao' ? [-(parseInt((colDe(c).lanc || '0').replace('-', ''), 10) || 0), colDe(c).n || '?']
        : tipoDe(c);
      if (!por[g[1]]) { por[g[1]] = { n: g[1], o: g[0], cs: [] }; ordem.push(g[1]); }
      por[g[1]].cs.push(c);
    });
    return ordem.map(function (k) { return por[k]; }).sort(function (a, b) { return a.o - b.o; });
  }
  function contar(cs) { var n = { falta: 0, ociosa: 0, tenho: 0, pend: 0 }; cs.forEach(function (c) { n[c.st]++; if (pendente(c)) n.pend++; }); return n; }
  var CTX = {};

  // ---------------- ferramentas
  function seg(rot, itens, atual, fn, semRotulo) {
    var g = h('div', { class: 'seg g-seg', role: 'group', 'aria-label': rot }, [semRotulo ? null : h('span', { class: 'seg-l' }, [rot])]);
    itens.forEach(function (o) {
      g.appendChild(h('button', { type: 'button', class: atual === o[0] ? 'on' : '', 'aria-pressed': atual === o[0] ? 'true' : 'false', 'data-v': o[0], onclick: function () { fn(o[0]); } },
        [o[1], o[2] ? h('span', { class: 'q num', 'data-n': o[2] }, ['']) : null]));
    });
    return g;
  }
  function abrirTodos(abrir) { document.querySelectorAll('#c-corpo details[data-sf]').forEach(function (d) { d.open = abrir; }); }
  function vistaEf() { var v = S.vista[S.aba]; if (VISTAS.indexOf(v) < 0) v = (S.aba === 'ano' || S.aba === 'colecao') ? 'ciclos' : 'lista'; if (v === 'ciclos' && CTX.ciclos === false) v = 'lista'; return v; }
  function ferr(ctx) {
    var f = $('#c-ferr'); f.innerHTML = ''; f.hidden = !ctx;
    if (!ctx) return;
    if (!ctx.minimo) {
      var sel = h('select', { id: 'c-ordem', onchange: function () { S.ordem = this.value; S.inv = false; guardar(); desenha(); } });
      ORD.forEach(function (o) { sel.appendChild(h('option', { value: o[0] }, [o[1]])); });
      sel.value = ordemEf();
      f.appendChild(h('div', { class: 'seg g-ord' }, [h('label', { for: 'c-ordem', class: 'seg-l' }, ['Ordem']), sel,
        h('button', { type: 'button', class: 'g-inv', id: 'c-inv', 'aria-label': 'Inverter a ordem', title: 'Inverter a ordem', onclick: function () { S.inv = !S.inv; guardar(); desenha(); } }, [seta(ordemEf())])]));
      f.appendChild(seg('Status', [['todas', 'Todas', 'todas'], ['falta', 'Faltam', 'falta'], ['ociosa', 'Ociosas', 'ociosa'], ['tenho', 'Tenho', 'tenho']], S.st, function (v) { S.st = v; desenha(); }));
      f.appendChild(seg('Grau', [['todos', 'Todos'], ['S', 'S'], ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'], ['sem', 'Sem nota']], S.grau, function (v) { S.grau = v; desenha(); }));
      if (S.aba !== 'raridade') f.appendChild(seg('Raridade', [['todas', 'Todas'], ['M', 'Mítica'], ['R', 'Rara'], ['U', 'Incomum'], ['C', 'Comum']], S.rar, function (v) { S.rar = v; desenha(); }));
      if (S.aba !== 'cores' && S.aba !== 'decks') {
        var cc = h('div', { class: 'c-cores', role: 'group', 'aria-label': 'Cabe nestas cores', title: 'Cabe nestas cores: só cartas cuja identidade está dentro das cores marcadas' });
        'WUBRG'.split('').forEach(function (ch) { cc.appendChild(h('button', { type: 'button', 'aria-pressed': S.cores.indexOf(ch) >= 0 ? 'true' : 'false', 'data-cor': ch, title: NOME_COR[ch], onclick: function () { S.cores = S.cores.indexOf(ch) >= 0 ? S.cores.replace(ch, '') : 'WUBRG'.split('').filter(function (x) { return S.cores.indexOf(x) >= 0 || x === ch; }).join(''); desenha(); } }, [sym(ch)])); });
        f.appendChild(cc);
      }
      f.appendChild(h('div', { class: 'g-agr' }, [seg('Agrupar', [['nenhum', 'Nenhum'], ['status', 'Status'], ['grau', 'Grau'], ['cor', 'Cor'], ['raridade', 'Raridade'], ['colecao', 'Coleção'], ['tipo', 'Tipo']], S.agrupar, function (v) { S.agrupar = v; guardar(); desenha(); })]));
      var vs = [['ciclos', 'Ciclos'], ['lista', 'Lista'], ['galeria', 'Galeria']].filter(function (v) { return v[0] !== 'ciclos' || ctx.ciclos !== false; });
      f.appendChild(seg('Vista', vs, vistaEf(), function (v) { S.vista[S.aba] = v; guardar(); desenha(); }, true));
      f.appendChild(h('label', { class: 'g-aviso c-pendchk' }, [h('input', { type: 'checkbox', id: 'c-pend', checked: S.pend ? true : null, onchange: function () { S.pend = this.checked; desenha(); } }), ' só pendentes']));
    }
    f.appendChild(h('div', { class: 'g-ab', id: 'c-ab' }, [h('button', { type: 'button', class: 'linkish', onclick: function () { abrirTodos(true); } }, ['Abrir todos']), h('button', { type: 'button', class: 'linkish', onclick: function () { abrirTodos(false); } }, ['Fechar todos'])]));
    if (!ctx.minimo) {
      f.appendChild(h('button', { type: 'button', class: 'linkish', id: 'c-limpar', onclick: function () { S.st = 'todas'; S.grau = 'todos'; S.rar = 'todas'; S.cores = ''; S.pend = false; S.q = ''; desenha(); } }, ['Limpar filtros']));
      f.appendChild(h('div', { class: 'f' }, [h('input', { class: 'g-filtro', id: 'c-filtro', type: 'search', placeholder: 'Filtrar carta, ciclo ou coleção', 'aria-label': 'Filtrar', value: S.q, oninput: function () { S.q = this.value; desenhaCorpo(); } })]));
    }
  }
  function filtroAtivo() { return S.st !== 'todas' || S.grau !== 'todos' || S.rar !== 'todas' || S.cores || S.pend || S.q.trim(); }
  function atualizaFerr() {
    var base = (CTX.base || []).filter(function (c) { return textoOk(c) && (S.grau === 'todos' || (S.grau === 'sem' ? !c.grau : c.grau === S.grau)) && (S.rar === 'todas' || (c.rar || c.rar_dono) === S.rar) && (!S.cores || dentro(c.ci || '', S.cores)) && (!S.pend || pendente(c)); }), n = contar(base);
    var t = { todas: base.length, falta: n.falta, ociosa: n.ociosa, tenho: n.tenho };
    document.querySelectorAll('#c-ferr [data-n]').forEach(function (e) { e.textContent = t[e.getAttribute('data-n')]; });
    var l = $('#c-limpar'); if (l) l.hidden = !filtroAtivo();
    var ab = $('#c-ab'); if (ab) ab.hidden = !document.querySelector('#c-corpo details[data-sf]');
  }

  // ---------------- as vistas: ciclos (linhas por cor), lista e galeria
  function cartaoCarta(c, comVaga) {
    var sub = comVaga ? (c.t || '').split(' — ')[0].split(' // ')[0] : (cicloDe(c).ciclo + ' · ' + (colDe(c).k || ''));
    return h('button', { class: 'c-carta' + (pendente(c) ? ' pend' : ''), type: 'button', onclick: function () { gaveta(c); } }, [
      h('div', { class: 'g-im' }, [c.sp ? imgCarta(c, true) : h('div', { class: 'g-semimg' }, [c.enc ? 'sem imagem no cache' : 'não encontrada no Scryfall'])]),
      h('div', { class: 'g-tx' }, [h('b', {}, [c.n.split(' // ')[0]]), h('small', {}, [sub]),
        h('span', { class: 'g-ch c-selos' }, [grauPill(c), S.agrupar === 'status' ? null : stPill(c), pendPill(c)]),
        h('span', { class: 'g-ch' }, c.rende && c.rende.length ? chipsRende(c, 1) : chipsOnde(c, 1))])]);
  }
  function linhaCiclo(ci, cs) {
    var mono = ci.tipo === 'Mono' || cs.every(function (c) { return c.vaga.length === 1 && 'WUBRG'.indexOf(c.vaga) >= 0; });
    var rars = {}; cs.forEach(function (c) { var r = c.rar || (c.rar_dono !== '?' ? c.rar_dono : null); if (r) rars[r] = 1; });
    var n = contar(cs);
    var cabeca = h('div', { class: 'c-ch' }, [h('h3', {}, [ci.ciclo]),
      h('span', { class: 'meta' }, [ci.tipo === 'Mono' ? 'uma por cor' : ci.tipo === 'Bicolor' ? 'duas cores' : ci.tipo === 'Tricolor' ? 'três cores' : ci.tipo === 'Identidade' ? 'por identidade' : ci.tipo === 'Sabor' ? 'ciclo de sabor' : 'tipo a definir', ' · ', plural(cs.length, 'carta', 'cartas'), n.tenho ? ' · ' + plural(n.tenho, 'tenho', 'tenho') : '', n.falta ? ' · ' + plural(n.falta, 'falta', 'faltam') : '']),
      h('span', { class: 'g-ch' }, Object.keys(rars).sort(function (a, b) { return RARO[a] - RARO[b]; }).map(function (r) { return rarPill(r); }).concat(n.pend ? [h('span', { class: 'g-st pend' }, [plural(n.pend, 'pendente', 'pendentes')])] : [])),
      ci.obs ? h('span', { class: 'obs' }, [ci.obs]) : null]);
    var grade;
    if (mono) {
      grade = h('div', { class: 'c-vagas' });
      'WUBRG'.split('').forEach(function (ch) {
        var nessa = cs.filter(function (c) { return c.vaga === ch; });
        var col = h('div', { class: 'c-vaga' }, [h('span', { class: 'c-vaga-c' }, [sym(ch), NOME_COR[ch]])]);
        if (nessa.length) nessa.forEach(function (c) { col.appendChild(cartaoCarta(c, true)); });
        else col.appendChild(h('div', { class: 'c-vazia' }, ['sem carta nesta cor']));
        grade.appendChild(col);
      });
      var resto = cs.filter(function (c) { return 'WUBRG'.indexOf(c.vaga) < 0 || c.vaga.length !== 1; });
      if (resto.length) { var g2 = h('div', { class: 'c-vagas livre' }); resto.forEach(function (c) { g2.appendChild(h('div', { class: 'c-vaga' }, [h('span', { class: 'c-vaga-c' }, [pips(c.ci), nomeCi(c.ci)]), cartaoCarta(c, true)])); }); grade = h('div', { class: 'c-ciclos' }, [grade, g2]); }
    } else {
      grade = h('div', { class: 'c-vagas livre' });
      cs.forEach(function (c) { grade.appendChild(h('div', { class: 'c-vaga' }, [h('span', { class: 'c-vaga-c' }, [pips(c.ci), nomeCi(c.ci)]), cartaoCarta(c, true)])); });
    }
    return h('article', { class: 'c-ciclo', 'data-ciclo': ci.k }, [cabeca, grade]);
  }
  function vistaCiclos(arr) {
    var por = {}; arr.forEach(function (c) { (por[c.ciclo] = por[c.ciclo] || []).push(c); });
    var ks = D.ciclos.map(function (ci) { return ci.k; }).filter(function (k) { return por[k]; });
    if (ordemEf() === 'novo' || ordemEf() === 'natural') { var invk = (S.inv !== (ordemEf() === 'novo')); if (invk) ks.reverse(); }
    return h('div', { class: 'c-ciclos' }, ks.map(function (k) { return linhaCiclo(CIC[k], por[k].slice().sort(function (x, y) { return (POS[x.n] || 0) - (POS[y.n] || 0); })); }));
  }
  function tabela(arr) {
    var cols = [['#', 'n'], ['Carta', '', 'nome'], ['Custo', '', 'custo'], ['Coleção · ciclo', '', 'novo'], ['Rar.', '', 'raridade'], ['Grau', '', 'grau'], ['Critérios 2 e 3', 'cr'], ['Onde já está', ''], ['Onde rende', '', 'encaixe'], ['Status', '', 'status'], ['Por quê', 'pq']];
    var oe = ordemEf();
    var tb = h('table', { class: 'g-tbl', 'data-nosort': '' }, [h('thead', {}, [h('tr', {}, cols.map(function (c) {
      var on = c[2] && c[2] === oe;
      return h('th', { scope: 'col', class: c[1] === 'n' ? 'n' : null, 'aria-sort': on ? (seta(oe) === '↓' ? 'descending' : 'ascending') : null },
        [c[2] ? h('button', { type: 'button', class: 'g-th' + (on ? ' on' : ''), title: 'Ordenar por esta coluna; outro clique inverte', onclick: function () { pedeOrdem(c[2]); } }, [c[0], on ? ' ' + seta(oe) : '']) : c[0]]);
    }))])]);
    var body = h('tbody');
    arr.forEach(function (c, i) {
      var ci = cicloDe(c), col = colDe(c);
      body.appendChild(h('tr', {}, [
        h('td', { class: 'n num', 'data-v': i + 1 }, [String(i + 1)]),
        h('td', { class: 'nm' }, [h('button', { type: 'button', onclick: function () { gaveta(c); } }, [h('b', {}, [c.n]), h('small', {}, [(c.t || '—').replace(' — ', ' · ')])]), pendente(c) ? h('div', {}, [pendPill(c)]) : null]),
        h('td', { class: 'num', 'data-v': dv(c.cmc) }, [mana(c.cost, c.ci)]),
        h('td', { class: 'col' }, [h('b', {}, [col.k || '?', ' · ', mes(col.lanc)]), ci.ciclo || '']),
        h('td', {}, [rarPill(c.rar, c.rar_dono)]),
        h('td', { 'data-v': c.grau || '' }, [grauPill(c)]),
        h('td', { class: 'cr' }, [h('span', { class: 'g-ch' }, crChips(c))]),
        h('td', {}, [h('span', { class: 'g-ch' }, chipsOnde(c))]),
        h('td', {}, [h('span', { class: 'g-ch' }, c.rende && c.rende.length ? chipsRende(c) : [h('span', { class: 'g-aviso' }, [c.notas ? (c.cabe.length ? 'já em todos, ou sem ganho' : 'fora das cores de todos') : 'sem cadastro'])])]),
        h('td', {}, [stPill(c)]),
        h('td', { class: 'pq' }, [c.pq || '—'])]));
    });
    tb.appendChild(body);
    return h('div', { class: 'g-tw' }, [tb]);
  }
  function galeria(arr) { return h('div', { class: 'g-gal' }, arr.map(function (c) { return cartaoCarta(c, false); })); }
  function lista(arr) { var v = vistaEf(); return v === 'galeria' ? galeria(arr) : v === 'ciclos' ? vistaCiclos(arr) : tabela(arr); }
  function corpoLista(arr, id, fazer) {
    fazer = fazer || lista;
    if (!arr.length) return vazio('Nada com esse filtro.', 'Troque o status, o grau, a raridade ou as cores, ou limpe a busca.');
    if (S.agrupar === 'nenhum' || CTX.agrupa === false) return fazer(arr);
    var w = h('div', { class: 'g-grupos' });
    agrupa(arr).forEach(function (g) {
      var n = contar(g.cs);
      w.appendChild(sanfona(id + '|' + S.agrupar + '|' + g.n, h('h3', {}, [g.n]), plural(g.cs.length, 'carta', 'cartas') + (n.falta ? ' · ' + plural(n.falta, 'falta', 'faltam') : '') + (n.tenho ? ' · ' + plural(n.tenho, 'tenho', 'tenho') : ''), fazer(g.cs)));
    });
    return w;
  }

  // ---------------- as abas
  function chips(w, titulo, itens, atual, fn) {
    var fam = h('div', { class: 'g-fam' }, [h('span', { class: 'g-fn' }, [titulo])]);
    itens.forEach(function (it) { fam.appendChild(h('button', { type: 'button', class: 'g-chip' + (atual === it.k ? ' on' : ''), title: it.title || '', onclick: function () { fn(it.k); } }, [it.pips || null, it.n, it.q != null ? h('span', { class: 'q' }, [String(it.q)]) : null])); });
    w.appendChild(fam);
  }
  function cartasDe(cols) { var out = []; cols.forEach(function (col) { col.ciclos.forEach(function (k) { CIC[k].cartas.forEach(function (n) { out.push(cards[n]); }); }); }); return out; }
  function lentesAno() {
    var w = $('#c-lentes'); w.innerHTML = '';
    var box = h('div', { class: 'g-lentes' });
    chips(box, 'Ano', anos.map(function (a) { var cols = D.colecoes.filter(function (c) { return String(c.ano) === a; }); return { k: a, n: a, q: cols.reduce(function (s, c) { return s + c.cartas; }, 0), title: plural(cols.length, 'coleção', 'coleções') }; }), S.lente.ano, function (k) { S.lente.ano = k; guardar(); desenha(); });
    w.appendChild(box);
  }
  function corpoAno() {
    var a = S.lente.ano, cols = D.colecoes.filter(function (c) { return String(c.ano) === a; }).slice().reverse();
    var base = cartasDe(cols);
    CTX = { base: base };
    var w = h('div');
    w.appendChild(cab(a, plural(cols.length, 'coleção', 'coleções') + ' · ' + plural(base.length, 'carta', 'cartas') + ' em ' + plural(cols.reduce(function (s, c) { return s + c.ciclos.length; }, 0), 'ciclo', 'ciclos')));
    var arr = ordena(filtra(base));
    if (!arr.length) { w.appendChild(vazio('Nada com esse filtro.', 'Troque o status, o grau, a raridade ou as cores, ou limpe a busca.')); return w; }
    if (S.agrupar !== 'nenhum') { w.appendChild(corpoLista(arr, 'ano|' + a)); return w; }
    var g = h('div', { class: 'g-grupos' });
    cols.forEach(function (col) {
      var cs = arr.filter(function (c) { return colDe(c).k === col.k; }); if (!cs.length) return;
      var n = contar(cs);
      g.appendChild(sanfona('ano|' + a + '|' + col.k, h('h3', {}, [col.n]), col.k + ' · ' + mes(col.lanc) + ' · ' + plural(cs.length, 'carta', 'cartas') + ' em ' + plural(col.ciclos.length, 'ciclo', 'ciclos') + (n.falta ? ' · ' + plural(n.falta, 'falta', 'faltam') : '') + (n.tenho ? ' · ' + plural(n.tenho, 'tenho', 'tenho') : ''), lista(cs)));
    });
    w.appendChild(g);
    return w;
  }
  function lentesColecao() {
    var w = $('#c-lentes'); w.innerHTML = '';
    var box = h('div', { class: 'g-lentes' });
    anos.forEach(function (a) {
      var cols = D.colecoes.filter(function (c) { return String(c.ano) === a; }).slice().reverse();
      chips(box, a, cols.map(function (c) { return { k: c.k, n: c.n, q: c.cartas, title: c.k + ' · ' + mes(c.lanc) + ' · ' + plural(c.ciclos.length, 'ciclo', 'ciclos') }; }), S.lente.colecao, function (k) { S.lente.colecao = k; guardar(); desenha(); });
    });
    w.appendChild(box);
  }
  function corpoColecao() {
    var col = COL[S.lente.colecao];
    if (!col) return vazio('Nenhuma coleção na lista.');
    var base = cartasDe([col]);
    CTX = { base: base };
    var w = h('div');
    w.appendChild(cab(col.n, col.k + ' · ' + mes(col.lanc) + ' · ' + plural(base.length, 'carta', 'cartas') + ' em ' + plural(col.ciclos.length, 'ciclo', 'ciclos')));
    w.appendChild(corpoLista(ordena(filtra(base)), 'col|' + col.k));
    return w;
  }
  function lentesCores() {
    var w = $('#c-lentes'); w.innerHTML = '';
    var box = h('div', { class: 'g-lentes' });
    [['Mono e incolor', function (x) { return x.k.length === 1; }], ['Duas cores', function (x) { return x.k.length === 2; }], ['Três ou mais', function (x) { return x.k.length >= 3; }]].forEach(function (g) {
      var its = IDENTS.filter(g[1]).map(function (x) { return { k: x.k, n: nomeCi(x.k === 'C' ? '' : x.k), q: x.q, pips: pips(x.k === 'C' ? '' : x.k), title: 'identidade de cor ' + (x.k === 'C' ? 'incolor' : x.k) + ' · decks: ' + (D.decks.filter(function (d) { return dentro(x.k === 'C' ? '' : x.k, d.ci); }).map(function (d) { return nomeDeck(d.p); }).join(', ') || 'nenhum') }; });
      if (its.length) chips(box, g[0], its, S.lente.cores, function (k) { S.lente.cores = k; guardar(); desenha(); });
    });
    w.appendChild(box);
  }
  function corpoCores() {
    var k = S.lente.cores; if (!k) return vazio('Nenhuma carta encontrada.');
    var ci = k === 'C' ? '' : k;
    var base = TODAS.filter(function (c) { return c.enc && (c.ci || '') === ci; });
    CTX = { base: base, ciclos: false };
    var w = h('div');
    var ds = D.decks.filter(function (d) { return dentro(ci, d.ci); });
    w.appendChild(cab(nomeCi(ci), plural(base.length, 'carta', 'cartas') + ' com esta identidade de cor', h('span', { class: 'decks' }, ds.length ? ds.map(function (d) { return h('button', { type: 'button', class: 'g-d g-dl' + (d.dj ? ' dj' : ''), title: 'deck em que estas cartas cabem: abrir Nos meus decks', onclick: function () { S.deck = d.p; guardar(); vai('decks'); } }, [nomeDeck(d.p)]); }) : [h('span', { class: 'g-aviso' }, ['nenhum deck seu com estas cores'])])));
    w.appendChild(corpoLista(ordena(filtra(base)), 'cores|' + k));
    return w;
  }
  function lentesRaridade() {
    var w = $('#c-lentes'); w.innerHTML = '';
    var box = h('div', { class: 'g-lentes' });
    chips(box, 'Raridade', ['M', 'R', 'U', 'C'].map(function (r) { return { k: r, n: RAR_NOME[r], q: TODAS.filter(function (c) { return (c.rar || c.rar_dono) === r; }).length, pips: rarPill(r) }; }), S.lente.raridade, function (k) { S.lente.raridade = k; guardar(); desenha(); });
    w.appendChild(box);
  }
  function corpoRaridade() {
    var r = S.lente.raridade;
    var base = TODAS.filter(function (c) { return (c.rar || c.rar_dono) === r; });
    CTX = { base: base };
    var w = h('div');
    w.appendChild(cab(RAR_NOME[r] + (r === 'M' ? 's' : 's'), plural(base.length, 'carta', 'cartas') + ' · raridade pelo Scryfall (a da lista, quando o Scryfall não trouxe)'));
    w.appendChild(corpoLista(ordena(filtra(base)), 'rar|' + r));
    return w;
  }
  function corpoDecks() {
    var w = h('div', { class: 'c-deck' });
    if (!decksSel.length) { CTX = { minimo: true }; w.appendChild(vazio('Nenhum deck v3.')); return w; }
    var sel = h('select', { id: 'c-deck', onchange: function () { S.deck = this.value; guardar(); desenha(); } });
    decksSel.forEach(function (d) { sel.appendChild(h('option', { value: d.p }, [d.p + (d.n && d.n !== nomeDeck(d.p) ? ' · ' + d.n : '') + (d.dj ? ' (desejo)' : '')])); });
    sel.value = S.deck;
    var d = DECK[S.deck];
    var base = TODAS.filter(function (c) { return c.enc && c.cabe.indexOf(S.deck) >= 0; });
    CTX = { base: base, ciclos: false };
    w.appendChild(h('div', { class: 'g-sel8' }, [h('label', { for: 'c-deck' }, ['Deck', sel])]));
    w.appendChild(h('div', { class: 'c-deck-cab' }, [h('b', {}, [d.n || nomeDeck(d.p)]), pips(d.ci), h('span', { class: 'g-aviso' }, [d.c ? d.c + ' · ' : '', 'identidade ', d.ci || 'incolor', ' · ', plural(base.length, 'carta de ciclo cabe', 'cartas de ciclo cabem'), ' neste deck; a ordem padrão é pelo ganho (a mesma conta da Caixa; * = sinergia ainda não avaliada, o ganho é piso). ', d.dj ? 'Deck de desejo: não existe fisicamente.' : ''])]));
    var arr = filtra(base);
    if (S.ordem === '' || S.ordem === 'natural') { arr = arr.slice().sort(function (x, y) { var gx = (x.rende || []).filter(function (r) { return r.p === S.deck; })[0], gy = (y.rende || []).filter(function (r) { return r.p === S.deck; })[0]; return ((gy ? gy.g : -1e9) - (gx ? gx.g : -1e9)) || (POS[x.n] || 0) - (POS[y.n] || 0); }); if (S.inv) arr.reverse(); } else arr = ordena(arr);
    var fazer = function (cs) {
      if (vistaEf() === 'galeria') return galeria(cs);
      var tb = h('table', { class: 'g-tbl', 'data-nosort': '' }, [h('thead', {}, [h('tr', {}, [h('th', { class: 'n' }, ['#']), h('th', {}, ['Carta']), h('th', {}, ['Custo']), h('th', {}, ['Coleção · ciclo']), h('th', {}, ['Grau']), h('th', { class: 'n' }, ['Ganho aqui']), h('th', {}, ['Quem sai']), h('th', {}, ['Onde já está']), h('th', {}, ['Status']), h('th', {}, ['Por quê'])])])]);
      var body = h('tbody');
      cs.forEach(function (c, i) {
        var r = (c.rende || []).filter(function (x) { return x.p === S.deck; })[0], no = (c.onde || []).some(function (x) { return x.w === 'deck' && x.p === S.deck; }), ci = cicloDe(c), col = colDe(c);
        body.appendChild(h('tr', {}, [h('td', { class: 'n num' }, [String(i + 1)]),
          h('td', { class: 'nm' }, [h('button', { type: 'button', onclick: function () { gaveta(c); } }, [h('b', {}, [c.n]), h('small', {}, [(c.t || '—').replace(' — ', ' · ')])])]),
          h('td', { class: 'num' }, [mana(c.cost, c.ci)]), h('td', { class: 'col' }, [h('b', {}, [col.k || '?', ' · ', mes(col.lanc)]), ci.ciclo || '']), h('td', {}, [grauPill(c)]),
          h('td', { class: 'n num' }, [no ? h('span', { class: 'g-st tenho' }, ['No deck']) : r ? h('span', { class: 'g-d rende' }, [ganho(r.g) + (r.a ? '' : '*')]) : h('span', { class: 'g-aviso' }, [c.notas ? (d.dj ? 'deck de desejo: sem conta' : '—') : 'sem cadastro'])]),
          h('td', { class: 'pq' }, [r && r.s ? r.s : '—']), h('td', {}, [h('span', { class: 'g-ch' }, chipsOnde(c, 3))]), h('td', {}, [stPill(c)]), h('td', { class: 'pq' }, [c.pq || '—'])]));
      });
      tb.appendChild(body);
      return h('div', { class: 'g-tw' }, [tb]);
    };
    w.appendChild(corpoLista(arr, 'decks|' + S.deck, fazer));
    return w;
  }
  function corpoPend() {
    CTX = { minimo: true };
    var w = h('div', { class: 'c-pend' });
    w.appendChild(cab('Pendências', 'o que a leitura não resolveu sozinha e como acrescentar a próxima coleção'));
    var nao = TODAS.filter(function (c) { return !c.enc; }), ver = TODAS.filter(function (c) { return c.enc && c.ver; });
    w.appendChild(h('div', { class: 'cx' }, [h('h3', {}, ['Não encontradas no Scryfall (' + nao.length + ')']), nao.length ? h('ul', {}, nao.map(function (c) { return h('li', {}, [h('b', {}, [c.n]), ' · ' + cicloDe(c).ciclo + ' · ' + (colDe(c).n || ''), ' — confira o nome em dados/ciclos/ciclos.json (ou fixe a impressão em "scryfall": "set/número") e rode /ciclos atualizar']); })) : h('p', { class: 'g-aviso' }, ['Todas as cartas da lista foram achadas.'])]));
    w.appendChild(h('div', { class: 'cx' }, [h('h3', {}, ['Marcadas "verificar" na lista (' + ver.length + ')']), h('p', { class: 'g-aviso' }, ['O Scryfall confirmou nome, identidade e raridade dessas cartas; a marca só sai da lista quando a raridade escrita bate (python motor/ciclos.py --conferir) ou quando você a tira à mão.']),
      ver.length ? h('ul', {}, ver.map(function (c) { return h('li', {}, [h('button', { type: 'button', class: 'linkish', onclick: function () { gaveta(c); } }, [c.n]), ' · ' + cicloDe(c).ciclo + ' · ' + (colDe(c).k || ''), ' · raridade na lista ' + (c.rar_dono || '?') + (c.rar ? ', no Scryfall ' + c.rar : ''), c.obs ? ' · ' + c.obs : '']); })) : h('p', { class: 'g-aviso' }, ['Nenhuma.'])]));
    var dc = (D.div.cores || []);
    w.appendChild(h('div', { class: 'cx' }, [h('h3', {}, ['Cor da vaga diferente da identidade (' + dc.length + ')']), h('p', { class: 'g-aviso' }, ['Não é erro: a cor da vaga é o lugar da carta no ciclo; a identidade do Scryfall é a que decide em que deck ela cabe.']),
      dc.length ? h('ul', {}, dc.map(function (x) { return h('li', {}, [h('b', {}, [x.n]), ' · vaga ' + x.vaga + ' · identidade ' + (x.ci || 'incolor')]); })) : null]));
    var dr = (D.div.raridade || []);
    w.appendChild(h('div', { class: 'cx' }, [h('h3', {}, ['Raridade da lista diferente do Scryfall (' + dr.length + ')']), dr.length ? h('ul', {}, dr.map(function (x) { return h('li', {}, [h('b', {}, [x.n]), ' · lista ' + x.dono + ' · Scryfall ' + x.scryfall]); })) : h('p', { class: 'g-aviso' }, ['Nenhuma.'])]));
    w.appendChild(h('div', { class: 'cx' }, [h('h3', {}, ['Coleção nova']), h('p', { class: 'g-aviso' }, ['A cada coleção, o comando pesquisa os ciclos dela, mostra o que entrou e, com o seu "pode", acrescenta as linhas em dados/ciclos/ciclos.json, confere no Scryfall e remonta esta página.']),
      h('p', {}, [h('code', { id: 'c-cmd' }, ['/ciclos atualizar <nome da coleção>']), ' ', h('button', { type: 'button', class: 'g-btn sm', onclick: function () { var b = this; try { navigator.clipboard.writeText('/ciclos atualizar ').then(function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1500); }); } catch (x) {} } }, ['Copiar'])]),
      h('p', { class: 'g-aviso' }, ['Para uma carta só: acrescente a linha à mão no ciclos.json (ano, coleção, código, ciclo, carta, cores, raridade) e rode /ciclos atualizar sem nome.'])]));
    return w;
  }

  function desenhaCorpo() {
    var c = $('#c-corpo'); c.innerHTML = '';
    var a = S.aba;
    CTX = {};
    c.appendChild(a === 'ano' ? corpoAno() : a === 'colecao' ? corpoColecao() : a === 'cores' ? corpoCores() : a === 'raridade' ? corpoRaridade() : a === 'decks' ? corpoDecks() : corpoPend());
    atualizaFerr();
  }
  function desenha() {
    var a = S.aba;
    document.querySelectorAll('#c-nav a').forEach(function (x) { if (x.getAttribute('data-aba') === a) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
    $('#c-lentes').innerHTML = '';
    if (a === 'ano') lentesAno(); else if (a === 'colecao') lentesColecao(); else if (a === 'cores') lentesCores(); else if (a === 'raridade') lentesRaridade();
    desenhaCorpo();
    ferr(Object.keys(CTX).length ? CTX : null);
    atualizaFerr();
  }
  function fechaGaveta() { $('#g-gav').hidden = true; $('#g-veu').hidden = true; }
  function vai(aba, k) {
    fechaGaveta();
    var alvo = '#' + aba + (k ? '=' + encodeURIComponent(k) : '');
    if (location.hash === alvo) { daHash(); S.q = ''; desenha(); window.scrollTo(0, 0); } else location.hash = alvo;
  }

  // ---------------- a gaveta
  function linkConsulta(c) { var base = (location.protocol !== 'file:' && D.consulta.pub) ? D.consulta.pub : D.consulta.href; return base + '#consultar=' + encodeURIComponent(c.n.split(' // ')[0]); }
  function gaveta(c) {
    var g = $('#g-gav'), v = $('#g-veu');
    g.innerHTML = ''; g.hidden = false; v.hidden = false;
    v.onclick = fechaGaveta;
    var ci = cicloDe(c), col = colDe(c);
    g.appendChild(h('div', { class: 'cab' }, [h('h2', {}, [c.n]), h('button', { class: 'x', type: 'button', 'aria-label': 'Fechar', onclick: fechaGaveta }, ['×'])]));
    g.appendChild(h('div', { class: 'corpo' }, [
      c.sp ? imgCarta(c, false) : h('div', { class: 'semimg' }, [c.enc ? 'sem imagem no cache' : 'não encontrada no Scryfall']),
      h('div', {}, [
        h('p', {}, [mana(c.cost, c.ci), ' ', h('span', { class: 'g-aviso' }, [c.t || '—'])]),
        h('p', { style: 'margin-top:8px' }, [stPill(c), ' ', pendPill(c)]),
        h('div', { class: 'c-gvac', style: 'margin-top:10px' }, [grauPill(c, true), h('div', {}, [h('b', {}, [c.grau ? 'Grau ' + c.grau + ' no vácuo' : 'Sem grau']), h('span', { class: 'b' }, [c.valor != null ? h('i', { style: 'width:' + Math.min(100, c.valor / 18 * 100).toFixed(1) + '%' }) : null, h('em', { style: 'left:' + Math.min(100, (D.mediana || 0) / 18 * 100).toFixed(1) + '%', title: 'mediana do cadastro' })]), h('small', {}, [c.valor != null ? 'valor próprio ' + num(c.valor) + ' · mediana do cadastro ' + num(D.mediana) + ' · a régua da Consulta' : c.enc ? 'a nota entra pela rubrica (/ciclos classificar)' : 'sem texto do Scryfall'])])]),
        h('p', { class: 'g-aviso', style: 'margin-top:8px' }, ['EDHREC #' + (c.rank ? inteiro(c.rank) : '—') + (c.set ? ' · impressão: ' + c.set + (c.rel ? ' (' + data(c.rel) + ')' : '') : '')]),
        c.so ? h('p', { class: 'g-aviso', style: 'margin-top:4px' }, ['só com: ' + c.so]) : null])]));
    g.appendChild(h('div', { class: 'c-gciclo' }, [h('span', {}, [h('b', {}, [col.n || '?']), ' · ', col.k || '', ' · ', mes(col.lanc)]), h('span', {}, ['Ciclo ', h('b', {}, [ci.ciclo || '?']), ' (', (ci.tipo || '').toLowerCase(), ') · vaga ', c.vaga === '?' ? 'a definir' : nomeCi(c.vaga === 'C' ? '' : c.vaga), ' · identidade ', h('b', {}, [c.ci || 'incolor']), ' · ', rarPill(c.rar, c.rar_dono), ' ', c.rar ? RAR_NOME[c.rar] : '']), c.obs ? h('span', {}, [c.obs]) : null, c.ciclos_extra ? h('span', {}, ['também em: ' + c.ciclos_extra.map(function (k) { return (CIC[k] || {}).ciclo || k; }).join(', ')]) : null]));
    g.appendChild(h('section', {}, [h('h4', {}, ['Texto']), h('p', { class: 'ora' }, [c.o || '—'])]));
    g.appendChild(h('section', {}, [h('h4', {}, ['Critérios (cadastro v3)']), h('span', { class: 'g-ch' }, crChips(c)), c.notas ? (c.pq ? h('p', { class: 'g-aviso' }, [c.pq]) : null) : h('p', { class: 'g-aviso' }, ['Sem cadastro: a nota entra pela rubrica, em lotes (/ciclos classificar). Sem nota não há grau nem "onde rende".'])]));
    var onde = chipsOnde(c, 40);
    g.appendChild(h('section', {}, [h('h4', {}, ['Onde já está']), h('span', { class: 'g-ch' }, onde.length ? onde : [h('span', { class: 'g-aviso' }, ['em nenhum deck, pasta ou Caixa'])])]));
    var rende = h('section', {}, [h('h4', {}, ['Onde rende'])]);
    if (c.rende && c.rende.length) {
      rende.appendChild(h('span', { class: 'g-ch' }, chipsRende(c, 3, true)));
      c.rende.slice(0, 5).forEach(function (r) { rende.appendChild(h('p', { class: 'sai' }, [nomeDeck(r.p) + (r.n && r.n !== nomeDeck(r.p) ? ' (' + r.n + ')' : '') + ': ganho ' + ganho(r.g) + (r.s ? ', sai ' + r.s : '') + (r.a ? '' : ' · sinergia a avaliar, o ganho é piso')])); });
      if (c.rende.length > 5) rende.appendChild(h('p', { class: 'g-aviso' }, ['e mais ' + (c.rende.length - 5) + ' decks, em Nos meus decks']));
    } else rende.appendChild(h('p', { class: 'g-aviso' }, [c.notas ? (c.cabe.length ? 'já está em todos os decks em que cabe, ou nenhum ganho' : 'fora da identidade de todos os seus decks') : 'sem cadastro, sem encaixe']));
    rende.appendChild(h('p', { class: 'g-aviso' }, ['Os decks que existem (01 a 04) e ainda não têm a carta, pelo encaixe nos dez critérios e quem sairia, a mesma conta da Caixa. A sinergia deck a deck é trabalho da Consulta.']));
    g.appendChild(rende);
    var cabe = chipsCabe(c, 40);
    g.appendChild(h('section', {}, [h('h4', {}, ['Cabe em (identidade do comandante)']), h('span', { class: 'g-ch' }, cabe.length ? cabe : [h('span', { class: 'g-aviso' }, [c.enc ? 'em nenhum dos seus decks' : 'sem identidade (não encontrada)'])])]));
    g.appendChild(h('section', {}, [h('h4', {}, ['Abrir']), h('div', { class: 'links c-acoes' }, [
      h('a', { class: 'g-btn sm ouro', href: linkConsulta(c), target: '_blank', rel: 'noopener', title: 'Abre a Consulta com esta carta: o estudo completo, sinergia deck a deck, veredito e compra' }, ['Consultar']),
      h('a', { class: 'g-btn sm', href: 'https://scryfall.com/search?q=' + encodeURIComponent('!"' + c.n.split(' // ')[0] + '"'), target: '_blank', rel: 'noopener' }, ['Scryfall']),
      h('a', { class: 'g-btn sm', href: 'https://edhrec.com/cards/' + c.n.split(' // ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-'), target: '_blank', rel: 'noopener' }, ['EDHREC'])])]));
    g.focus();
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#g-gav').hidden) fechaGaveta(); });

  // ---------------- cabeça, barra e rodapé
  function estado() {
    var ct = D.contagens || {};
    var e = $('#c-estado'); e.innerHTML = '';
    e.appendChild(h('span', { class: 'g-lt-t' }, ['Leitura de ', h('b', { class: 'num' }, [data(D.lido)])]));
    e.appendChild(h('span', { class: 'g-lt-f' }, ['Scryfall · cadastro v3 · decklists, pastas e Caixa']));
    e.appendChild(h('button', { class: 'g-upd', type: 'button', id: 'c-copiar', title: 'Copia o comando para colar no Claude Code: acrescenta uma coleção, confere no Scryfall e remonta esta página',
      onclick: function () { var b = this; try { navigator.clipboard.writeText('/ciclos atualizar').then(function () { b.lastChild.textContent = 'Copiado'; setTimeout(function () { b.lastChild.textContent = '/ciclos atualizar'; }, 1500); }); } catch (x) {} } },
      [h('span', { class: 'g-upd-i', 'aria-hidden': 'true' }, ['↻']), h('span', {}, ['/ciclos atualizar'])]));
    var k = $('#c-kpis'); k.innerHTML = '';
    function kpi(rot, v, sub, cls) { return h('div', { class: 'g-kpi' + (cls ? ' ' + cls : '') }, [h('span', { class: 'g-kpi-l' }, [rot]), h('span', { class: 'g-kpi-v num' }, v), sub ? h('span', { class: 'g-kpi-s' }, [sub]) : null]); }
    k.appendChild(kpi('Cartas', [inteiro(ct.cartas || 0)], plural(ct.ciclos || 0, 'ciclo', 'ciclos') + ' em ' + plural(ct.colecoes || 0, 'coleção', 'coleções')));
    k.appendChild(kpi('Tenho', [String(ct.tenho || 0)], (ct.ociosa || 0) + ' ociosas · ' + (ct.falta || 0) + ' faltam'));
    k.appendChild(kpi('Com grau', [String(ct.com_grau || 0), h('small', {}, ['de ' + (ct.cartas || 0)])], (ct.grau_S || 0) + ' S · ' + (ct.grau_A || 0) + ' A · ' + (ct.grau_B || 0) + ' B', ''));
    k.appendChild(kpi('Sem nota', [inteiro(ct.sem_cadastro || 0)], ct.sem_cadastro ? 'esperam a rubrica' : 'cadastro completo', ct.sem_cadastro ? 'warn' : ''));
    k.appendChild(kpi('Pendentes', [String(ct.pendentes || 0)], (ct.nao_encontradas || 0) + ' não encontradas · ' + ((ct.pendentes || 0) - (ct.nao_encontradas || 0)) + ' a verificar', ct.pendentes ? 'warn' : ''));
    var tl = D.colecoes.length ? h('ol', { class: 'g-tl', 'aria-label': 'Coleções' }, D.colecoes.slice(-8).map(function (c, i, arr) {
      return h('li', { class: i === arr.length - 1 ? 'atual' : '', title: c.n + ' · ' + plural(c.cartas, 'carta', 'cartas') }, [h('i', { 'aria-hidden': 'true' }), h('b', {}, [c.k]), h('span', { class: 'num' }, [mes(c.lanc)])]);
    })) : h('span', { class: 'g-kpi-s' }, ['sem coleções']);
    k.appendChild(h('div', { class: 'g-kpi col' }, [h('span', { class: 'g-kpi-l' }, ['Coleções na lista · as oito mais recentes']), tl]));
  }
  function barra() {
    var pub = location.protocol !== 'file:';
    var hub = pub && D.hub.pub ? D.hub.pub : D.hub.href;
    $('#c-l-decks').href = hub + '#decks'; $('#c-l-pastas').href = hub + '#pastas'; $('#c-l-dash').href = hub + '#dashboard';
    var cx = $('#c-l-caixa'); if (D.caixa) { cx.hidden = false; cx.href = pub && D.caixa.pub ? D.caixa.pub : D.caixa.href; }
    var gr = $('#c-l-grim'); if (D.grimorio) { gr.hidden = false; gr.href = pub && D.grimorio.pub ? D.grimorio.pub : D.grimorio.href; }
    if (D.consulta) $('#c-l-cons').href = pub && D.consulta.pub ? D.consulta.pub : D.consulta.href;
  }
  function rodape() {
    $('#foot').innerHTML = '<p>Leitura de ' + data(D.lido) + '. A lista dos ciclos é do dono (dados/ciclos/ciclos.json); nome, texto, identidade, raridade e impressão: Scryfall; notas e grau no vácuo: cadastro v3 e a régua da Consulta; onde está: decklists, pastas e Caixa; onde rende: encaixe nos dez critérios, a mesma conta da Caixa. "Cabe" é a identidade do comandante; o quanto a carta é boa no deck é trabalho da Consulta. Sem preço.</p><p>Arte das cartas: © Wizards of the Coast.</p>';
  }

  // ---------------- endereço
  function daHash() {
    var t = (location.hash || '').replace('#', '').split('='), a = t[0];
    if (ABAS.indexOf(a) >= 0) S.aba = a;
    if (t[1]) { var l = decodeURIComponent(t[1]); if (a === 'ano' && anos.indexOf(l) >= 0) S.lente.ano = l; else if (a === 'colecao' && COL[l]) S.lente.colecao = l; else if (a === 'cores' && IDENTS.some(function (x) { return x.k === l; })) S.lente.cores = l; else if (a === 'raridade' && RAR_NOME[l]) S.lente.raridade = l; else if (a === 'decks' && DECK[l]) S.deck = l; }
  }
  window.addEventListener('hashchange', function () { daHash(); S.q = ''; desenha(); window.scrollTo(0, 0); });
  estado(); barra(); rodape(); daHash(); desenha();
})();
