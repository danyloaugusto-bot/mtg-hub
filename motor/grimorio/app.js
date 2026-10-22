/* O Grimório (motor/grimorio/app.js): a página lê window.GRIMORIO (montado por motor/grimorio.py a partir de
   dados/grimorio/grimorio.json) e desenha as seis sub-abas: Tribos e estilos, Cores, Critérios, 8×8, Pontas de lança e
   Novidades. Nada é calculado de novo aqui: notas, status, onde está, onde rende e os quadros do 8×8 vêm do motor.
   Sem rede e sem preço. Guarda no navegador (grimorio:v1) a vista (Lista ou Galeria), a ordem, a lente de cada aba e o
   deck do 8×8. Endereços: #tribos, #cores, #criterios, #8x8, #pontas, #novidades (e #aba=lente); ?deck= abre o 8×8 no deck. */
(function () {
  'use strict';
  var D = /*__DATA__*/null;
  window.GRIMORIO = D;
  var ABAS = ['tribos', 'cores', 'criterios', '8x8', 'pontas', 'novidades'];
  var TEMA = {}, COR = {}, CRIT = {};
  D.temas.forEach(function (t) { TEMA[t.k] = t; });
  D.cores.forEach(function (c) { COR[c.k] = c; });
  D.crit.forEach(function (c) { CRIT[c.k] = c; });
  var cards = D.cards;
  var TIER = { S: 0, A: 1, B: 2, C: 3, D: 4 };
  var AGRUPAR = ['nenhum', 'status', 'tipo', 'cor'];
  var NOME_P = {};   // nome do deck (sem o número) -> pasta, para os chips de deck levarem ao 8×8
  D.decks.forEach(function (d) { NOME_P[d.p.replace(/^\d+\.\s*/, '')] = d.p; });

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
  function nomeDeck(p) { var i = p.indexOf('. '); return i > 0 ? p.slice(i + 2) : p; }
  function data(d) { return d ? d.split('-').reverse().join('/') : '—'; }
  function pct(x) { return x == null ? '—' : Math.round(x * 100) + '%'; }
  function syn(s) { return s == null ? '—' : (s < 0 ? '−' : '+') + Math.abs(s).toFixed(2).replace('.', ','); }
  function ganho(g) { return (g < 0 ? '−' : '+') + Math.abs(g).toFixed(1).replace('.', ','); }
  function dv(v) { return v == null ? '' : String(v).replace('.', ','); }   // data-v no formato que o ordenar.js lê (vírgula decimal)
  function inteiro(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  // ---------------- estado
  var S = { aba: 'tribos', lente: {}, ordem: '', inv: false, agrupar: 'nenhum', fech: {}, st: 'todas', vista: {}, q: '', deck8: null };
  function primeira(lista, f) { for (var i = 0; i < lista.length; i++) if (f(lista[i])) return lista[i].k; return lista.length ? lista[0].k : null; }
  S.lente.tribos = primeira(D.temas, function (t) { return t.q; });
  S.lente.cores = primeira(D.cores, function (c) { return c.q; });
  S.lente.criterios = primeira(D.crit, function (c) { return !c.dd; });
  var decks8 = D.decks.filter(function (d) { return D.g8[d.p]; });
  S.deck8 = decks8.length ? decks8[0].p : null;
  function carregar() {
    try {
      var m = JSON.parse(localStorage.getItem('grimorio:v1') || '{}');
      if (m.vista && typeof m.vista === 'object') S.vista = m.vista;
      if (m.ordem) S.ordem = m.ordem;
      if (m.inv) S.inv = true;
      if (AGRUPAR.indexOf(m.agrupar) >= 0) S.agrupar = m.agrupar;
      if (m.fech && typeof m.fech === 'object') S.fech = m.fech;
      if (m.deck8 && D.g8[m.deck8]) S.deck8 = m.deck8;
      if (m.lente) { if (TEMA[m.lente.tribos]) S.lente.tribos = m.lente.tribos; if (COR[m.lente.cores]) S.lente.cores = m.lente.cores; if (CRIT[m.lente.criterios] && !CRIT[m.lente.criterios].dd) S.lente.criterios = m.lente.criterios; }
    } catch (e) {}
  }
  function guardar() { try { localStorage.setItem('grimorio:v1', JSON.stringify({ vista: S.vista, ordem: S.ordem, inv: S.inv, agrupar: S.agrupar, fech: S.fech, deck8: S.deck8, lente: S.lente })); } catch (e) {} }
  carregar();
  try { var qd = new URLSearchParams(location.search).get('deck'); if (qd && D.g8[qd]) S.deck8 = qd; } catch (e) {}

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
  function stPill(c) { return h('span', { class: 'g-st ' + c.st }, [c.st === 'tenho' ? 'Tenho' : c.st === 'ociosa' ? 'Ociosa' : 'Falta']); }
  function nvPill(c, comSet) { return c.nv ? h('span', { class: 'g-st novo', title: c.nv === 'nova' ? 'carta nova: a impressão mais recente não é reimpressão' : 'reimpressão em coleção lançada depois da leitura anterior' }, [(c.nv === 'nova' ? 'Nova' : 'Reimpressão') + (comSet && c.set ? ' · ' + c.set : '')]) : null; }
  function chipsOnde(c, max, link) {
    var out = [];
    (c.onde || []).forEach(function (x) {
      if (x.w === 'deck') out.push(h(link ? 'button' : 'span', { class: 'g-d' + (x.dj ? ' dj' : '') + (link ? ' g-dl' : ''), type: link ? 'button' : null, onclick: link ? function () { abre8(x.p); } : null, title: (x.dj ? 'deck de desejo, não existe fisicamente' : 'no deck') + ' · tier ' + x.t + ' · ' + x.r }, [x.d, x.dj ? ' · desejo' : null, h('span', { class: 'T' }, [x.t])]));
    });
    (c.onde || []).forEach(function (x) {
      if (x.w === 'radar') out.push(h('span', { class: 'g-d radar' + (x.dj ? ' dj' : ''), title: 'no radar, veredito ' + (x.v || 'avaliar') + ' · tier ' + x.t }, [x.d + ' · radar ', h('span', { class: 'T' }, [x.t])]));
    });
    Object.keys(c.pastas || {}).forEach(function (p) { out.push(h('span', { class: 'g-d pasta', title: p === 'Caixa' ? 'na Caixa' : 'na pasta ' + p }, [p === 'Caixa' ? 'Caixa' : 'Pasta ' + p, c.pastas[p] > 1 ? ' ×' + c.pastas[p] : null])); });
    if (max && out.length > max) { var n = out.length - max; out = out.slice(0, max); out.push(h('span', { class: 'g-d' }, ['+' + n])); }
    return out;
  }
  function chipsRende(c, max, link) {
    var out = (c.rende || []).map(function (r) {
      return h(link ? 'button' : 'span', { class: 'g-d rende' + (link ? ' g-dl' : ''), type: link ? 'button' : null, onclick: link ? function () { abre8(r.p); } : null, title: 'ganho ' + ganho(r.g) + (r.s ? ' · sai ' + r.s : '') + (r.a ? '' : ' · sinergia a avaliar (piso)') }, [nomeDeck(r.p), ' ', h('span', { class: 'g' }, [ganho(r.g) + (r.a ? '' : '*')])]);
    });
    if (max && out.length > max) out = out.slice(0, max);
    return out;
  }
  function crChips(c) {
    if (!c.notas) return [h('span', { class: 'g-aviso' }, ['sem cadastro'])];
    var out = [];
    D.crit.forEach(function (k) { var v = c.notas[k.k]; if (v >= 2) out.push(h('span', { class: 'g-n' + v, title: k.n + ' ' + v + ' (peso ×' + k.w + ')' }, [k.n + ' ' + v])); });
    return out.length ? out : [h('span', { class: 'g-aviso' }, ['nenhuma nota 2 ou 3'])];
  }
  function vazio(titulo, texto) { return h('div', { class: 'g-vazio' }, [h('b', {}, [titulo]), texto || null]); }
  function cabLente(nome, meta, decks) {
    return h('div', { class: 'g-lh' }, [h('h2', {}, [nome]), meta ? h('span', { class: 'meta' }, [meta]) : null,
      h('span', { class: 'decks' }, (decks || []).map(function (n) { var p = NOME_P[n]; return p ? h('button', { type: 'button', class: 'g-d g-dl', title: 'deck que usa esta lente: abrir o 8×8 de ' + n, onclick: function () { abre8(p); } }, [n]) : h('span', { class: 'g-d', title: 'deck que usa esta lente' }, [n]); }))]);
  }

  // ---------------- ordem, grupos e filtro
  function opcoesOrdem(ctx) {
    var o = [['pop', ctx.k ? 'Inclusão no EDHREC' : 'Popularidade (EDHREC)']];
    if (ctx.tema) o.push(['sinergia', 'Sinergia na lente']);
    if (ctx.crit) o.unshift(['nota', 'Nota no critério']);
    return o.concat([['encaixe', 'Onde rende mais'], ['status', 'Status (faltam primeiro)'], ['custo', 'Custo'], ['nome', 'Nome'], ['novo', 'Mais recentes']]);
  }
  function ordemEf(ctx) { var ops = opcoesOrdem(ctx).map(function (o) { return o[0]; }); return ops.indexOf(S.ordem) >= 0 ? S.ordem : ops[0]; }
  // ↓ = o maior primeiro; ↑ = o menor ou A a Z primeiro (a seta vira quando a ordem é invertida)
  var SETA = { pop: '↓', sinergia: '↓', nota: '↓', encaixe: '↓', novo: '↓', status: '↑', custo: '↑', nome: '↑' };
  function seta(o) { var t = SETA[o] || '↓'; return S.inv ? (t === '↓' ? '↑' : '↓') : t; }
  function ordena(arr, ctx) {
    var o = ordemEf(ctx);
    function rank(c) { return c.rank || 1e9; }
    function lk(c) { return ctx.k && c.lk ? c.lk[ctx.k] : null; }
    function inc(c) { var l = lk(c); return l && l.inc != null ? l.inc : -1; }
    function sy(c) { var l = lk(c); return l && l.syn != null ? l.syn : -9; }
    function rende(c) { return c.rende && c.rende.length ? c.rende[0].g : -1e9; }
    var ST = { falta: 0, ociosa: 1, tenho: 2 };
    var f = {
      pop: function (x, y) { return ctx.k ? (inc(y) - inc(x) || rank(x) - rank(y)) : (rank(x) - rank(y)); },
      sinergia: function (x, y) { return sy(y) - sy(x) || rank(x) - rank(y); },
      encaixe: function (x, y) { return rende(y) - rende(x) || rank(x) - rank(y); },
      status: function (x, y) { return ST[x.st] - ST[y.st] || rank(x) - rank(y); },
      custo: function (x, y) { return (x.cmc || 0) - (y.cmc || 0) || rank(x) - rank(y); },
      nome: function (x, y) { return x.n.localeCompare(y.n, 'pt-BR'); },
      novo: function (x, y) { return (y.rel || '').localeCompare(x.rel || '') || rank(x) - rank(y); },
      nota: function (x, y) { var k = ctx.crit; return ((y.notas || {})[k] || 0) - ((x.notas || {})[k] || 0) || rank(x) - rank(y); }
    };
    var out = arr.slice().sort(f[o]);
    return S.inv ? out.reverse() : out;
  }
  // clique no cabeçalho da tabela: ordena por ela; outro clique na mesma coluna inverte (como na Caixa)
  function pedeOrdem(ctx, k) { if (ordemEf(ctx) === k) S.inv = !S.inv; else { S.ordem = k; S.inv = false; } guardar(); desenha(); }
  function textoOk(c) { var q = S.q.trim().toLowerCase(); return !q || (c.n + ' ' + c.t + ' ' + (c.pq || '')).toLowerCase().indexOf(q) >= 0; }
  function filtra(arr) { return arr.filter(function (c) { return textoOk(c) && (S.st === 'todas' || c.st === S.st); }); }
  // o tipo principal da carta (a parte da linha de tipo antes do travessão)
  function tipoDe(c) {
    var t = (c.t || '').split(' — ')[0].split(' // ')[0];
    var ts = [['Creature', 'Criaturas'], ['Planeswalker', 'Planeswalkers'], ['Battle', 'Batalhas'], ['Land', 'Terrenos'], ['Instant', 'Mágicas instantâneas'], ['Sorcery', 'Feitiços'], ['Artifact', 'Artefatos'], ['Enchantment', 'Encantamentos']];
    for (var i = 0; i < ts.length; i++) if (t.indexOf(ts[i][0]) >= 0) return [i, ts[i][1]];
    return [99, 'Outros'];
  }
  function corDeC(c) {
    var ci = c.ci || '';
    if (!ci) return [0, 'Incolor'];
    if (ci.length > 1) return [6, 'Multicolor'];
    return [1 + 'WUBRG'.indexOf(ci), { W: 'Branco', U: 'Azul', B: 'Preto', R: 'Vermelho', G: 'Verde' }[ci]];
  }
  function agrupa(arr) {
    var por = {}, ordem = [];
    arr.forEach(function (c) {
      var g = S.agrupar === 'status' ? [{ falta: 0, ociosa: 1, tenho: 2 }[c.st], { falta: 'Faltam', ociosa: 'Ociosas', tenho: 'Tenho' }[c.st]] : S.agrupar === 'tipo' ? tipoDe(c) : corDeC(c);
      if (!por[g[1]]) { por[g[1]] = { n: g[1], o: g[0], cs: [] }; ordem.push(g[1]); }
      por[g[1]].cs.push(c);
    });
    return ordem.map(function (k) { return por[k]; }).sort(function (a, b) { return a.o - b.o; });
  }
  function contar(cs) { var n = { falta: 0, ociosa: 0, tenho: 0 }; cs.forEach(function (c) { n[c.st]++; }); return n; }
  // a sanfona do projeto (details.sf do hub): começa aberta, e o que você fecha fica lembrado neste navegador
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
  var CTX = {};   // o contexto da tela (lente, critério e a lista inteira da lente) que a ordem, o cabeçalho da tabela e as contagens usam

  // ---------------- ferramentas
  function seg(rot, itens, atual, fn, semRotulo) {
    var g = h('div', { class: 'seg g-seg', role: 'group', 'aria-label': rot }, [semRotulo ? null : h('span', { class: 'seg-l' }, [rot])]);
    itens.forEach(function (o) {
      g.appendChild(h('button', { type: 'button', class: atual === o[0] ? 'on' : '', 'aria-pressed': atual === o[0] ? 'true' : 'false', 'data-v': o[0], onclick: function () { fn(o[0]); } },
        [o[1], o[2] ? h('span', { class: 'q num', 'data-n': o[0] }, ['']) : null]));
    });
    return g;
  }
  function abrirTodos(abrir) { document.querySelectorAll('#g-corpo details[data-sf]').forEach(function (d) { d.open = abrir; }); }
  function ferr(ctx) {
    var f = $('#g-ferr'); f.innerHTML = ''; f.hidden = !ctx;
    if (!ctx) return;
    if (!ctx.minimo) {
      var ops = opcoesOrdem(ctx);
      var sel = h('select', { id: 'g-ordem', onchange: function () { S.ordem = this.value; S.inv = false; guardar(); desenha(); } });
      ops.forEach(function (o) { sel.appendChild(h('option', { value: o[0] }, [o[1]])); });
      sel.value = ordemEf(ctx);
      f.appendChild(h('div', { class: 'seg g-ord' }, [h('label', { for: 'g-ordem', class: 'seg-l' }, ['Ordem']), sel,
        h('button', { type: 'button', class: 'g-inv', id: 'g-inv', 'aria-label': 'Inverter a ordem', title: 'Inverter a ordem', onclick: function () { S.inv = !S.inv; guardar(); desenha(); } }, [seta(ordemEf(ctx))])]));
      f.appendChild(seg('Status', [['todas', 'Todas', 1], ['falta', 'Faltam', 1], ['ociosa', 'Ociosas', 1], ['tenho', 'Tenho', 1]], S.st, function (v) { S.st = v; desenha(); }));
      if (ctx.agrupa !== false) f.appendChild(h('div', { class: 'g-agr' }, [seg('Agrupar', [['nenhum', 'Nenhum'], ['status', 'Status'], ['tipo', 'Tipo'], ['cor', 'Cor']], S.agrupar, function (v) { S.agrupar = v; guardar(); desenha(); })]));
      if (ctx.vista !== false) f.appendChild(seg('Vista', [['lista', 'Lista'], ['galeria', 'Galeria']], S.vista[S.aba] || 'lista', function (v) { S.vista[S.aba] = v; guardar(); desenha(); }, true));
    }
    f.appendChild(h('div', { class: 'g-ab', id: 'g-ab' }, [h('button', { type: 'button', class: 'linkish', onclick: function () { abrirTodos(true); } }, ['Abrir todos']), h('button', { type: 'button', class: 'linkish', onclick: function () { abrirTodos(false); } }, ['Fechar todos'])]));
    if (!ctx.minimo) {
      f.appendChild(h('button', { type: 'button', class: 'linkish', id: 'g-limpar', onclick: function () { S.st = 'todas'; S.q = ''; desenha(); } }, ['Limpar filtros']));
      f.appendChild(h('div', { class: 'f' }, [h('input', { class: 'g-filtro', id: 'g-filtro', type: 'search', placeholder: 'Filtrar nesta lente', 'aria-label': 'Filtrar nesta lente', value: S.q, oninput: function () { S.q = this.value; desenhaCorpo(); } })]));
    }
  }
  // o que muda com o filtro de texto, sem refazer as ferramentas (o campo de busca não perde o foco)
  function atualizaFerr() {
    var base = (CTX.base || []).filter(textoOk), n = contar(base);
    var t = { todas: base.length, falta: n.falta, ociosa: n.ociosa, tenho: n.tenho };
    document.querySelectorAll('#g-ferr [data-n]').forEach(function (e) { e.textContent = t[e.getAttribute('data-n')]; });
    var l = $('#g-limpar'); if (l) l.hidden = !(S.st !== 'todas' || S.q.trim());
    var ab = $('#g-ab'); if (ab) ab.hidden = !document.querySelector('#g-corpo details[data-sf]');
  }

  // ---------------- lista e galeria
  function tabela(arr, ctx) {
    var cols = [['#', 'n'], ['Carta', '', 'nome'], ['Custo', '', 'custo']];
    if (ctx.k) { cols.push(['Inclusão', 'n', 'pop']); if (ctx.tema) cols.push(['Sinergia', 'n', 'sinergia']); }
    cols.push([ctx.crit ? 'Nota' : 'Critérios 2 e 3', 'cr', ctx.crit ? 'nota' : null], ['Onde já está', ''], ['Onde rende', '', 'encaixe'], ['Status', '', 'status'], ['Por quê', 'pq']);
    var oe = ordemEf(ctx);
    var tb = h('table', { class: 'g-tbl', 'data-nosort': '' }, [h('thead', {}, [h('tr', {}, cols.map(function (c) {
      var on = c[2] && c[2] === oe;
      return h('th', { scope: 'col', class: c[1] === 'n' ? 'n' : null, 'aria-sort': on ? (seta(oe) === '↓' ? 'descending' : 'ascending') : null },
        [c[2] ? h('button', { type: 'button', class: 'g-th' + (on ? ' on' : ''), title: 'Ordenar por esta coluna; outro clique inverte', onclick: function () { pedeOrdem(ctx, c[2]); } }, [c[0], on ? ' ' + seta(oe) : '']) : c[0]]);
    }))])]);
    var body = h('tbody');
    arr.forEach(function (c, i) {
      var l = ctx.k && c.lk ? c.lk[ctx.k] : null;
      var tds = [
        h('td', { class: 'n num', 'data-v': i + 1 }, [String(i + 1)]),
        h('td', { class: 'nm' }, [h('button', { type: 'button', onclick: function () { gaveta(c); } }, [h('b', {}, [c.n]), h('small', {}, [c.t.replace(' — ', ' · ') + (c.nv && c.set ? ' · ' + c.set : '')])])]),
        h('td', { class: 'num', 'data-v': dv(c.cmc == null ? '' : c.cmc) }, [mana(c.cost, c.ci)])
      ];
      if (ctx.k) {
        tds.push(h('td', { class: 'n num', 'data-v': dv(l && l.inc != null ? Math.round(l.inc * 1000) / 10 : ''), title: l && l.nd != null ? inteiro(l.nd) + ' de ' + inteiro(l.pd) + ' decks' : '' }, [l ? pct(l.inc) : '—']));
        if (ctx.tema) tds.push(h('td', { class: 'n num', 'data-v': dv(l && l.syn != null ? Math.round(l.syn * 100) / 100 : '') }, [l ? syn(l.syn) : '—']));
      }
      tds.push(
        h('td', { class: 'cr', 'data-v': ctx.crit ? ((c.notas || {})[ctx.crit] || 0) : Object.keys(c.notas || {}).filter(function (k) { return c.notas[k] >= 2; }).length },
          ctx.crit ? [h('span', { class: 'g-n' + ((c.notas || {})[ctx.crit] || 1) }, [CRIT[ctx.crit].n + ' ' + ((c.notas || {})[ctx.crit] || 0)])] : [h('span', { class: 'g-ch' }, crChips(c))]),
        h('td', { 'data-v': (c.onde || []).length + Object.keys(c.pastas || {}).length }, [h('span', { class: 'g-ch' }, chipsOnde(c))]),
        h('td', { 'data-v': dv(c.rende && c.rende.length ? c.rende[0].g : '') }, [h('span', { class: 'g-ch' }, c.rende && c.rende.length ? chipsRende(c) : [h('span', { class: 'g-aviso' }, [c.notas ? '—' : 'sem cadastro'])])]),
        h('td', { 'data-v': c.st }, [stPill(c), c.nv ? ' ' : null, nvPill(c)]),
        h('td', { class: 'pq' }, [c.pq || '—'])
      );
      body.appendChild(h('tr', {}, tds));
    });
    tb.appendChild(body);
    return h('div', { class: 'g-tw' }, [tb]);
  }
  function galeria(arr) {
    return h('div', { class: 'g-gal' }, arr.map(function (c) {
      return h('button', { class: 'g-card', type: 'button', onclick: function () { gaveta(c); } }, [
        h('div', { class: 'g-im' }, [c.img ? h('img', { src: c.img, alt: c.n, loading: 'lazy' }) : h('div', { class: 'g-semimg' }, ['sem imagem no cache']),
          S.agrupar === 'status' ? null : stPill(c), nvPill(c)]),   // agrupado por status, o grupo já diz o status: sem selo na carta
        h('div', { class: 'g-tx' }, [h('b', {}, [c.n]), h('span', { class: 'g-ch' }, c.rende && c.rende.length ? chipsRende(c, 2) : chipsOnde(c, 2))])]);
    }));
  }
  function lista(arr, ctx) { return (S.vista[S.aba] || 'lista') === 'galeria' ? galeria(arr) : tabela(arr, ctx); }
  function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
  // sem grupos: a tabela ou a galeria; com Agrupar: uma sanfona por grupo, com a contagem e o que falta no cabeçalho
  function corpoLista(arr, ctx, id, fazer) {
    fazer = fazer || lista;
    if (!arr.length) return vazio('Nada com esse filtro.', 'Troque o status ou limpe a busca.');
    if (S.agrupar === 'nenhum' || ctx.agrupa === false) return fazer(arr, ctx);
    var w = h('div', { class: 'g-grupos' });
    agrupa(arr).forEach(function (g) {
      var n = contar(g.cs);
      w.appendChild(sanfona(id + '|' + S.agrupar + '|' + g.n, h('h3', {}, [g.n]),
        plural(g.cs.length, 'carta', 'cartas') + (n.falta ? ' · ' + plural(n.falta, 'falta', 'faltam') : '') + (n.ociosa ? ' · ' + plural(n.ociosa, 'ociosa', 'ociosas') : ''), fazer(g.cs, ctx)));
    });
    return w;
  }

  // ---------------- as abas
  function lentesTribos() {
    var w = $('#g-lentes'); w.innerHTML = '';
    var fams = {}, ordemF = [];
    D.temas.forEach(function (t) { if (!fams[t.f]) { fams[t.f] = []; ordemF.push(t.f); } fams[t.f].push(t); });
    var box = h('div', { class: 'g-lentes' });
    ordemF.forEach(function (f) {
      var fam = h('div', { class: 'g-fam' }, [h('span', { class: 'g-fn' }, [f || 'Lentes'])]);
      fams[f].forEach(function (t) {
        fam.appendChild(h('button', { type: 'button', class: 'g-chip' + (S.lente.tribos === t.k ? ' on' : '') + (t.q ? '' : ' vazia'),
          title: (t.q ? t.q + ' cartas · ' : 'sem leitura · ') + (t.decks.length ? 'decks: ' + t.decks.join(', ') : 'nenhum deck seu usa esta lente'),
          onclick: function () { S.lente.tribos = t.k; guardar(); desenha(); } }, [t.n]));
      });
      box.appendChild(fam);
    });
    w.appendChild(box);
  }
  function corpoTribos() {
    var t = TEMA[S.lente.tribos];
    if (!t) return vazio('Nenhuma lente de tema em lentes.json.');
    var arr = (D.lentes[t.k] || []).map(function (n) { return cards[n]; });
    CTX = { k: t.k, tema: true, base: arr };
    var w = h('div');
    w.appendChild(cabLente(t.n, arr.length ? arr.length + ' cartas · EDHREC ' + t.src + ' · lido ' + t.lido : 'sem leitura', t.decks));
    if (!arr.length) {
      w.appendChild(vazio('Esta lente ficou sem leitura.', (t.erro || 'A fonte não respondeu.') + (t.tentados ? ' Caminhos tentados: ' + t.tentados + '.' : '') + ' Confira a fonte em dados/grimorio/lentes.json e rode /grimorio atualizar.'));
      return w;
    }
    CTX = { k: t.k, tema: true, base: arr };
    w.appendChild(corpoLista(ordena(filtra(arr), CTX), CTX, 'tribos|' + t.k));
    return w;
  }
  function lentesCores() {
    var w = $('#g-lentes'); w.innerHTML = '';
    var box = h('div', { class: 'g-lentes' });
    [['Incolor e mono', function (c) { return c.k.length === 1; }], ['Duas cores', function (c) { return c.k.length === 2; }], ['Três e cinco', function (c) { return c.k.length >= 3; }]].forEach(function (g) {
      var fam = h('div', { class: 'g-fam' }, [h('span', { class: 'g-fn' }, [g[0]])]);
      D.cores.filter(g[1]).forEach(function (c) {
        fam.appendChild(h('button', { type: 'button', class: 'g-chip' + (S.lente.cores === c.k ? ' on' : '') + (c.q ? '' : ' vazia'),
          title: (c.q ? c.q + ' cartas · ' : 'sem leitura · ') + (c.decks.length ? 'decks: ' + c.decks.join(', ') : 'sem deck nessa identidade'),
          onclick: function () { S.lente.cores = c.k; guardar(); desenha(); } }, [mana('', c.k === 'C' ? '' : c.k), c.n]));
      });
      if (fam.children.length > 1) box.appendChild(fam);
    });
    w.appendChild(box);
  }
  function corpoCores() {
    var c = COR[S.lente.cores];
    if (!c) return vazio('Nenhuma lente de cor em lentes.json.');
    var arr = (D.lentes[c.k] || []).map(function (n) { return cards[n]; });
    CTX = { k: c.k, base: arr };
    var w = h('div');
    w.appendChild(cabLente(c.n, arr.length ? arr.length + ' cartas · as mais jogadas nessa identidade · EDHREC ' + c.src + ' · lido ' + c.lido : 'sem leitura', c.decks));
    if (!arr.length) {
      w.appendChild(vazio('Combinação sem leitura.', (c.erro || 'A página de cor não respondeu.') + (c.tentados ? ' Caminhos tentados: ' + c.tentados + '.' : '')));
      return w;
    }
    CTX = { k: c.k, base: arr };
    w.appendChild(corpoLista(ordena(filtra(arr), CTX), CTX, 'cores|' + c.k));
    return w;
  }
  function lentesCrit() {
    var w = $('#g-lentes'); w.innerHTML = '';
    var fam = h('div', { class: 'g-fam' }, [h('span', { class: 'g-fn' }, ['Critérios'])]);
    D.crit.forEach(function (c) {
      var n = 0; Object.keys(cards).forEach(function (k) { if ((cards[k].notas || {})[c.k] >= 2) n++; });
      fam.appendChild(h('button', { type: 'button', class: 'g-chip' + (S.lente.criterios === c.k ? ' on' : '') + (c.dd ? ' vazia' : ''), disabled: c.dd ? true : null,
        title: c.dd ? 'as sinergias são do deck: ficam nas lentes de tema' : n + ' cartas · peso ×' + c.w,
        onclick: function () { if (!c.dd) { S.lente.criterios = c.k; guardar(); desenha(); } } }, [c.n, c.dd ? h('span', { class: 'q' }, ['tema']) : null]));
    });
    w.appendChild(h('div', { class: 'g-lentes' }, [fam]));
  }
  function corpoCrit() {
    var k = S.lente.criterios, c = CRIT[k];
    if (!c) return vazio('Nenhum critério na régua.');
    var arr = Object.keys(cards).map(function (n) { return cards[n]; }).filter(function (x) { return (x.notas || {})[k] >= 2; });
    var w = h('div');
    w.appendChild(cabLente(c.n, arr.length + ' cartas · peso ×' + c.w + ' · nota 2 ou 3 no cadastro v3, a mesma em todo deck · só cartas de alguma lente'));
    CTX = { crit: k, base: arr };
    w.appendChild(corpoLista(ordena(filtra(arr), CTX), CTX, 'criterios|' + k));
    return w;
  }
  function corpo8() {
    CTX = { minimo: true };
    var w = h('div');
    if (!decks8.length) { w.appendChild(vazio('Nenhum deck v3 com agrupamentos.')); return w; }
    var sel = h('select', { id: 'g-deck8', onchange: function () { S.deck8 = this.value; guardar(); desenhaCorpo(); } });
    decks8.forEach(function (d) { sel.appendChild(h('option', { value: d.p }, [d.p + (d.n && d.n !== nomeDeck(d.p) ? ' · ' + d.n : '') + (d.dj ? ' (desejo)' : '')])); });
    sel.value = S.deck8;
    w.appendChild(h('div', { class: 'g-sel8' }, [h('label', { for: 'g-deck8' }, ['Deck', sel]),
      h('span', { class: 'g-aviso' }, ['Um quadro por pacote do 8×8 do deck: quantas cartas há contra a referência, e o que o Grimório tem para cada pacote nas cores do deck (nota 2 ou 3 no critério com o mesmo papel; nos pacotes de tema, as lentes de tema do deck).'])]));
    var g = D.g8[S.deck8], deck = S.deck8;
    var grid = h('div', { class: 'g-q8' });
    g.quadros.forEach(function (q) {
      var ref0 = q.ref[0], ref1 = q.ref[1];
      var pctv = Math.min(100, Math.round(100 * q.no / (ref1 || 8)));
      var cls = q.no < ref0 ? 'falta' : q.no > ref1 ? 'sobra' : 'cheio';
      var ul = h('ul');
      q.cs.forEach(function (n) {
        var c = cards[n]; if (!c) return;
        var no = (c.onde || []).some(function (x) { return x.w === 'deck' && x.p === deck; });
        var outros = (c.onde || []).filter(function (x) { return x.w === 'deck' && x.p !== deck && !x.dj; }).map(function (x) { return x.d; });
        var pastas = Object.keys(c.pastas || {});
        var txt = no ? 'já no deck' : outros.length ? 'em ' + outros.slice(0, 2).join(', ') + (outros.length > 2 ? ' +' + (outros.length - 2) : '') + ' · mova ou compre outra cópia' : pastas.length ? 'parada em ' + pastas.map(function (p) { return p === 'Caixa' ? 'Caixa' : 'Pasta ' + p; }).join(', ') : 'não tem';
        ul.appendChild(h('li', {}, [h('button', { type: 'button', onclick: function () { gaveta(c); } }, [
          c.img ? h('img', { class: 'g-mini', src: c.img, alt: '', loading: 'lazy' }) : h('span', { class: 'g-mini' }),
          h('span', { class: 'nm' }, [h('b', {}, [c.n]), h('small', {}, [txt])]),
          no ? h('span', { class: 'g-st tenho' }, ['No deck']) : outros.length ? h('span', { class: 'g-st ociosa' }, ['Mover']) : pastas.length ? h('span', { class: 'g-st ociosa' }, ['Ociosa']) : h('span', { class: 'g-st falta' }, ['Falta'])])]));
      });
      var qid = '8x8|' + deck + '|' + q.k;
      grid.appendChild(h('details', { class: 'sf g-quadro', 'data-sf': qid, open: S.fech[qid] ? null : true }, [
        h('summary', {}, [
          h('h3', {}, [q.n, h('span', { class: 'n num ' + cls, title: 'referência ' + (ref0 === ref1 ? ref0 : ref0 + ' a ' + ref1) + ' · ' + (q.por === 'tema' ? 'cartas das lentes de tema do deck' : 'critério ' + (CRIT[q.por] ? CRIT[q.por].n : q.por)) }, [q.no + ' de ' + (ref0 === ref1 ? ref0 : ref0 + '–' + ref1)])]),
          h('div', { class: 'g-bar' }, [h('i', { class: cls, style: 'width:' + pctv + '%' })]),
          h('i', { class: 'sf-i', 'aria-hidden': 'true' })]),
        h('div', { class: 'sf-c' }, [q.cs.length ? ul : h('p', { class: 'nada' }, ['O Grimório ainda não tem carta com nota 2 ou 3 neste papel, nas cores do deck.'])])]));
    });
    w.appendChild(grid);
    return w;
  }
  function tagsLentes(c, link) {
    var lts = [];
    Object.keys(c.lk || {}).forEach(function (k) { if (TEMA[k]) lts.push(h(link ? 'button' : 'span', { class: 'g-lt' + (link ? ' g-dl' : ''), type: link ? 'button' : null, onclick: link ? function () { S.lente.tribos = k; guardar(); vai('tribos', k); } : null, title: 'inclusão ' + pct(c.lk[k].inc) + (c.lk[k].syn != null ? ' · sinergia ' + syn(c.lk[k].syn) : '') }, [TEMA[k].n])); });
    Object.keys(c.lk || {}).forEach(function (k) { if (COR[k]) lts.push(h(link ? 'button' : 'span', { class: 'g-lt cor' + (link ? ' g-dl' : ''), type: link ? 'button' : null, onclick: link ? function () { S.lente.cores = k; guardar(); vai('cores', k); } : null, title: 'inclusão ' + pct(c.lk[k].inc) }, [COR[k].n])); });
    return lts;
  }
  function corpoPontas() {
    var w = h('div');
    w.appendChild(cabLente('Pontas de lança', 'cartas em duas lentes de tema ou mais, ou numa lente de tema com nota 3 em algum critério: aqui mora o cruzamento'));
    var arr = ordena(filtra(D.pontas.map(function (n) { return cards[n]; }).filter(Boolean)), { vista: false });
    if (!arr.length) { w.appendChild(vazio('Nada com esse filtro.', D.pontas.length ? 'Troque o status ou limpe a busca.' : 'Nenhuma carta cruza duas lentes ainda.')); return w; }
    CTX = { vista: false, base: D.pontas.map(function (n) { return cards[n]; }).filter(Boolean) };
    var grade = function (cs) {
      return h('div', { class: 'g-pontas' }, cs.map(function (c) {
        var lts = tagsLentes(c);
        Object.keys(c.notas || {}).forEach(function (k) { if (c.notas[k] === 3 && CRIT[k]) lts.push(h('span', { class: 'g-lt cor' }, [CRIT[k].n + ' 3'])); });
        return h('button', { class: 'g-ponta', type: 'button', onclick: function () { gaveta(c); } }, [
          c.img ? h('img', { src: c.img, alt: '', loading: 'lazy' }) : h('div', { class: 'semimg' }),
          h('div', {}, [h('b', {}, [c.n]), h('div', { class: 'lts' }, lts), h('span', { class: 'g-ch' }, [stPill(c)].concat(chipsOnde(c, 3)).concat(chipsRende(c, 3))), h('p', {}, [c.pq || ''])])]);
      }));
    };
    w.appendChild(corpoLista(arr, CTX, 'pontas', grade));
    return w;
  }
  function corpoNov() {
    CTX = { agrupa: false, base: [] };
    var w = h('div', { class: 'g-nov' });
    w.appendChild(cabLente('Novidades', D.anterior ? 'impressões lançadas depois da leitura anterior (' + data(D.anterior) + '), dentro das listas das lentes; "nova" quando não é reimpressão' : 'impressões lançadas depois da leitura anterior'));
    if (!D.anterior) { w.appendChild(vazio('Primeira leitura: ainda não há leitura anterior para comparar.', 'A partir da próxima atualização, as cartas das lentes com impressão lançada depois de ' + data(D.lido) + ' aparecem aqui, por coleção.')); return w; }
    var arr = filtra(Object.keys(cards).map(function (n) { return cards[n]; }).filter(function (c) { return c.nv; }));
    CTX.base = Object.keys(cards).map(function (n) { return cards[n]; }).filter(function (c) { return c.nv; });
    if (!arr.length) { w.appendChild(vazio('Nada novo com esse filtro.', 'Nenhuma carta das lentes saiu em coleção lançada depois de ' + data(D.anterior) + '.')); return w; }
    var por = {};
    arr.forEach(function (c) { (por[c.set] = por[c.set] || []).push(c); });
    Object.keys(por).sort(function (a, b) { return (por[b][0].rel || '').localeCompare(por[a][0].rel || ''); }).forEach(function (s) {
      var cs = ordena(por[s], {}), novas = cs.filter(function (c) { return c.nv === 'nova'; }).length;
      w.appendChild(sanfona('nov|' + s, h('h3', {}, [s]),
        data(cs[0].rel) + ' · ' + plural(cs.length, 'carta', 'cartas') + ' · ' + plural(novas, 'nova', 'novas') + ', ' + plural(cs.length - novas, 'reimpressão', 'reimpressões'),
        corpoLista(cs, { agrupa: false }, 'nov|' + s)));
    });
    return w;
  }

  function desenhaCorpo() {
    var c = $('#g-corpo'); c.innerHTML = '';
    var a = S.aba;
    CTX = {};
    c.appendChild(a === 'tribos' ? corpoTribos() : a === 'cores' ? corpoCores() : a === 'criterios' ? corpoCrit() : a === '8x8' ? corpo8() : a === 'pontas' ? corpoPontas() : corpoNov());
    atualizaFerr();
  }
  function desenha() {
    var a = S.aba;
    document.querySelectorAll('#g-nav a').forEach(function (x) { if (x.getAttribute('data-aba') === a) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
    $('#g-lentes').innerHTML = '';
    if (a === 'tribos') lentesTribos(); else if (a === 'cores') lentesCores(); else if (a === 'criterios') lentesCrit();
    desenhaCorpo();
    ferr(Object.keys(CTX).length ? CTX : null);
    atualizaFerr();
  }
  function fechaGaveta() { $('#g-gav').hidden = true; $('#g-veu').hidden = true; }
  // drill: de uma carta ou de um chip para a lente ou para o 8×8 do deck
  function vai(aba, k) {
    fechaGaveta();
    var alvo = '#' + aba + (k ? '=' + encodeURIComponent(k) : '');
    if (location.hash === alvo) { daHash(); S.q = ''; desenha(); window.scrollTo(0, 0); } else location.hash = alvo;
  }
  function abre8(p) { S.deck8 = p; guardar(); vai('8x8'); }

  // ---------------- a gaveta
  function gaveta(c) {
    var g = $('#g-gav'), v = $('#g-veu');
    g.innerHTML = ''; g.hidden = false; v.hidden = false;
    var fecha = fechaGaveta;
    v.onclick = fecha;
    g.appendChild(h('div', { class: 'cab' }, [h('h2', {}, [c.n]), h('button', { class: 'x', type: 'button', 'aria-label': 'Fechar', onclick: fecha }, ['×'])]));
    g.appendChild(h('div', { class: 'corpo' }, [
      c.img ? h('img', { src: c.img, alt: c.n }) : h('div', { class: 'semimg' }, ['sem imagem no cache']),
      h('div', {}, [
        h('p', {}, [mana(c.cost, c.ci), ' ', h('span', { class: 'g-aviso' }, [c.t])]),
        h('p', { style: 'margin-top:8px' }, [stPill(c), ' ', nvPill(c, true)]),
        h('p', { class: 'g-aviso', style: 'margin-top:8px' }, ['EDHREC #' + (c.rank ? inteiro(c.rank) : '—') + ' entre todas as cartas' + (c.set ? ' · impressão mais recente: ' + c.set + (c.rel ? ' (' + data(c.rel) + ')' : '') : '')]),
        c.so ? h('p', { class: 'g-aviso', style: 'margin-top:4px' }, ['só com: ' + c.so]) : null])]));
    g.appendChild(h('section', {}, [h('h4', {}, ['Texto']), h('p', { class: 'ora' }, [c.o || '—'])]));
    g.appendChild(h('section', {}, [h('h4', {}, ['Critérios (cadastro v3)']), h('span', { class: 'g-ch' }, crChips(c)),
      c.notas ? (c.pq ? h('p', { class: 'g-aviso' }, [c.pq]) : null) : h('p', { class: 'g-aviso' }, ['Sem cadastro: a nota entra pela rubrica, no lote que você liberar (/grimorio classificar). Sem nota não há "onde rende".'])]));
    var onde = chipsOnde(c, 40, true);
    g.appendChild(h('section', {}, [h('h4', {}, ['Onde já está']), h('span', { class: 'g-ch' }, onde.length ? onde : [h('span', { class: 'g-aviso' }, ['em nenhum deck, pasta ou Caixa'])])]));
    var rende = h('section', {}, [h('h4', {}, ['Onde rende'])]);
    if (c.rende && c.rende.length) {
      rende.appendChild(h('span', { class: 'g-ch' }, chipsRende(c, 3, true)));
      c.rende.forEach(function (r) { rende.appendChild(h('p', { class: 'sai' }, [nomeDeck(r.p) + (r.n && r.n !== nomeDeck(r.p) ? ' (' + r.n + ')' : '') + ': ganho ' + ganho(r.g) + (r.s ? ', sai ' + r.s : '') + (r.a ? '' : ' · sinergia a avaliar, o ganho é piso')])); });
    } else rende.appendChild(h('p', { class: 'g-aviso' }, [c.notas ? 'nenhum deck seu nas cores da carta sem ela, ou nenhum ganho' : 'sem cadastro, sem encaixe']));
    rende.appendChild(h('p', { class: 'g-aviso' }, ['Os três melhores decks que existem (01 a 04) e ainda não têm a carta, pelo encaixe nos dez critérios e quem sairia, a mesma conta da Caixa.']));
    g.appendChild(rende);
    g.appendChild(h('section', {}, [h('h4', {}, ['Lentes']), h('span', { class: 'g-ch' }, tagsLentes(c, true))]));
    var slug = c.n.split(' // ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-');
    g.appendChild(h('section', {}, [h('h4', {}, ['Abrir']), h('div', { class: 'links' }, [
      h('a', { class: 'g-btn sm', href: 'https://scryfall.com/search?q=' + encodeURIComponent('!"' + c.n.split(' // ')[0] + '"'), target: '_blank', rel: 'noopener' }, ['Scryfall']),
      h('a', { class: 'g-btn sm', href: 'https://edhrec.com/cards/' + slug, target: '_blank', rel: 'noopener' }, ['EDHREC'])])]));
    g.focus();
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#g-gav').hidden) { $('#g-gav').hidden = true; $('#g-veu').hidden = true; } });

  // ---------------- cabeça, barra e rodapé
  function estado() {
    var ct = D.contagens || {};
    var e = $('#g-estado'); e.innerHTML = '';
    e.appendChild(h('span', { class: 'g-lt-t' }, ['Leitura de ', h('b', { class: 'num' }, [data(D.lido)])]));
    e.appendChild(h('span', { class: 'g-lt-f' }, [(D.fontes || []).map(function (f) { return f.replace(/\s*\(.*\)/, ''); }).join(' · ')]));
    e.appendChild(h('button', { class: 'g-upd', type: 'button', id: 'g-copiar', title: 'Copia o comando para colar no Claude Code: relê o EDHREC e o Scryfall e remonta esta página',
      onclick: function () { var b = this; try { navigator.clipboard.writeText('/grimorio atualizar').then(function () { b.lastChild.textContent = 'Copiado'; setTimeout(function () { b.lastChild.textContent = '/grimorio atualizar'; }, 1500); }); } catch (x) {} } },
      [h('span', { class: 'g-upd-i', 'aria-hidden': 'true' }, ['↻']), h('span', {}, ['/grimorio atualizar'])]));
    // os números, como os KPIs do Dashboard do hub; a última célula é a linha do tempo das coleções
    var k = $('#g-kpis'); k.innerHTML = '';
    function kpi(rot, v, sub, cls) { return h('div', { class: 'g-kpi' + (cls ? ' ' + cls : '') }, [h('span', { class: 'g-kpi-l' }, [rot]), h('span', { class: 'g-kpi-v num' }, v), sub ? h('span', { class: 'g-kpi-s' }, [sub]) : null]); }
    k.appendChild(kpi('Cartas', [inteiro(ct.cartas || 0)], 'conferidas no Scryfall'));
    k.appendChild(kpi('Lentes lidas', [String(ct.lidas || 0), h('small', {}, ['de ' + (ct.lentes || 0)])], ct.sem_leitura ? ct.sem_leitura + ' sem leitura' : 'todas responderam', ct.sem_leitura ? 'warn' : ''));
    k.appendChild(kpi('Sem nota', [inteiro(ct.sem_cadastro || 0)], ct.sem_cadastro ? 'esperam a rubrica' : 'cadastro completo', ct.sem_cadastro ? 'warn' : ''));
    k.appendChild(D.anterior ? kpi('Novidades', [String(ct.novidades || 0)], 'desde ' + data(D.anterior), ct.novidades ? 'novo' : '') : kpi('Novidades', ['—'], 'primeira leitura'));
    var por = [], idx = {};
    (D.colecoes || []).forEach(function (c) { var kk = c.d + (c.fut ? 'f' : ''); if (idx[kk] == null) { idx[kk] = por.length; por.push({ d: c.d, cs: [], ns: [], atual: 0, fut: 0 }); } var g = por[idx[kk]]; g.cs.push(c.c); g.ns.push(c.n); if (c.atual) g.atual = 1; if (c.fut) g.fut = 1; });
    var tl = por.length ? h('ol', { class: 'g-tl', 'aria-label': 'Coleções' }, por.map(function (g) {
      return h('li', { class: g.atual ? 'atual' : g.fut ? 'fut' : '', title: g.ns.join(' · ') + (g.atual ? ' (a mais recente)' : g.fut ? ' (a sair)' : '') },
        [h('i', { 'aria-hidden': 'true' }), h('b', {}, [g.cs.join('/')]), h('span', { class: 'num' }, [(g.fut ? 'sai ' : '') + data(g.d).slice(0, 5)])]);
    })) : h('span', { class: 'g-kpi-s' }, ['sem a lista de coleções']);
    k.appendChild(h('div', { class: 'g-kpi col' }, [h('span', { class: 'g-kpi-l' }, ['Coleções' + (por.some(function (g) { return g.atual; }) ? ' · a mais recente em destaque, a próxima tracejada' : '')]), tl]));
  }
  function barra() {
    var pub = location.protocol !== 'file:';
    var hub = pub && D.hub.pub ? D.hub.pub : D.hub.href;
    $('#g-l-decks').href = hub + '#decks';
    $('#g-l-pastas').href = hub + '#pastas';
    $('#g-l-dash').href = hub + '#dashboard';
    var cx = $('#g-l-caixa');
    if (D.caixa) { cx.hidden = false; cx.href = pub && D.caixa.pub ? D.caixa.pub : D.caixa.href; }
    if (D.consulta) $('#g-l-cons').href = pub && D.consulta.pub ? D.consulta.pub : D.consulta.href;
  }
  function rodape() {
    $('#foot').innerHTML = '<p>Leitura de ' + data(D.lido) + '. Cartas, inclusões e sinergias: EDHREC; nome, texto, identidade e impressão: Scryfall; notas: cadastro v3; onde está: decklists, pastas e Caixa; onde rende: encaixe nos dez critérios. Teto por lente: ' + D.teto[0] + ' mais incluídas e ' + D.teto[1] + ' de maior sinergia. Sem preço.</p><p>Arte das cartas: © Wizards of the Coast.</p>';
  }

  // ---------------- endereço
  function daHash() {
    var t = (location.hash || '').replace('#', '').split('='), a = t[0];
    if (ABAS.indexOf(a) >= 0) S.aba = a;
    if (t[1]) { var l = decodeURIComponent(t[1]); if (a === 'tribos' && TEMA[l]) S.lente.tribos = l; else if (a === 'cores' && COR[l]) S.lente.cores = l; else if (a === 'criterios' && CRIT[l] && !CRIT[l].dd) S.lente.criterios = l; }
  }
  window.addEventListener('hashchange', function () { daHash(); S.q = ''; desenha(); window.scrollTo(0, 0); });
  estado(); barra(); rodape(); daHash(); desenha();
})();
