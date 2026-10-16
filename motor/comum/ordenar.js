/* Ordenar tabela pelo cabeçalho, no painel e no hub (o build junta este arquivo aos dois app.js).
   Um clique no cabeçalho ordena pela coluna e outro inverte: número do maior para o menor (lê "1.019", "955,5", "−2",
   "68%"), tier de S a D, relevância de INS a BAX, texto de A a Z; vazio e "—" ficam sempre no fim. As linhas de total,
   média e "mostrar mais" e os cabeçalhos de grupo ficam no lugar; entre dois cabeçalhos de grupo, as linhas se ordenam
   dentro do grupo. Lista cortada ("Ver todas as N") abre inteira antes de ordenar. A ordem escolhida volta sozinha
   quando a tabela é redesenhada. Fica de fora a tabela com ordenação própria (botões data-act="sort", como o Tabelão)
   e a marcada com data-nosort. */
(function () {
  'use strict';
  var FIXA = /(^|\s)(tot|tot-r|mais|cob|med|grp)(\s|$)/;   // linhas que não entram na ordem
  var FIM = / (tot|tot-r|mais|cob|med) /;                   // dessas, as que ficam no fim do bloco
  var TIER = { S: 5, A: 4, B: 3, C: 2, D: 1 }, REL = { INS: 4, ALT: 3, MED: 2, 'MÉD': 2, BAX: 1 };
  var memo = {};   // chave da tabela -> {c: coluna, d: 1 crescente ou -1 decrescente}

  var css = document.createElement('style');
  css.textContent = 'th.ordenavel{cursor:pointer;-webkit-user-select:none;user-select:none}' +
    'th.ordenavel:hover,th.ordenavel:focus-visible{text-decoration:underline dotted;text-underline-offset:3px}' +
    'th.ordenavel[aria-sort="descending"]::after{content:" \\25BC";font-size:.72em;opacity:.85}' +
    'th.ordenavel[aria-sort="ascending"]::after{content:" \\25B2";font-size:.72em;opacity:.85}';
  document.head.appendChild(css);

  function cabecalho(t) { return t.tHead && t.tHead.rows.length ? t.tHead.rows[t.tHead.rows.length - 1] : null; }
  function apta(t) { return !!(cabecalho(t) && t.tBodies.length && !t.hasAttribute('data-nosort') && !t.querySelector('[data-act="sort"]')); }
  function chave(t) {
    var sec = t.closest('[id]'), h = cabecalho(t);
    return (sec ? sec.id : '') + '|' + t.className + '|' + Array.prototype.map.call(h.cells, function (c) { return c.textContent.replace(/[▲▼]/g, '').trim(); }).join('·');
  }
  /* coluna real da célula (conta os colspan das anteriores) e a célula de uma linha naquela coluna */
  function coluna(cel) { var n = 0, c = cel; while ((c = c.previousElementSibling)) n += c.colSpan || 1; return n; }
  function celula(tr, col) {
    var n = 0;
    for (var i = 0; i < tr.cells.length; i++) { var c = tr.cells[i]; if (col >= n && col < n + (c.colSpan || 1)) return c; n += c.colSpan || 1; }
    return null;
  }
  function texto(c) {
    if (!c) return '';
    var v = c.getAttribute('data-v');
    return (v != null ? v : c.textContent).replace(/\s+/g, ' ').trim();
  }
  function numero(s) {
    var m = s.replace(/[−–]/g, '-').match(/^[^\d+\-]{0,3}([+\-]?\d{1,3}(?:\.\d{3})+(?:,\d+)?|[+\-]?\d+(?:,\d+)?)/);
    return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : null;
  }
  function vazio(s) { return !s || s === '—' || s === '-' || s === '–'; }
  function grupo(tr, ncol) { return tr.cells.length === 1 && (tr.cells[0].colSpan || 1) >= Math.min(2, ncol); }

  function ordenar(t, col, d) {
    var h = cabecalho(t), ncol = 0;
    Array.prototype.forEach.call(h.cells, function (c) { ncol += c.colSpan || 1; });
    Array.prototype.forEach.call(t.tBodies, function (tb) {
      var linhas = Array.prototype.slice.call(tb.rows), blocos = [], atual = { dados: [], fim: [] };
      linhas.forEach(function (tr) {
        var cl = ' ' + tr.className + ' ';
        if (FIM.test(cl)) atual.fim.push(tr);                                   // total, média, "mostrar mais": no fim do bloco
        else if (/ grp /.test(cl) || grupo(tr, ncol)) {                          // cabeçalho de grupo: fecha o bloco e fica no lugar
          blocos.push(atual); blocos.push({ fixa: tr }); atual = { dados: [], fim: [] };
        } else atual.dados.push(tr);
      });
      blocos.push(atual);
      // o tipo da coluna sai dos valores de todas as linhas de dados da tabela
      var vals = [];
      blocos.forEach(function (b) { (b.dados || []).forEach(function (tr) { vals.push(texto(celula(tr, col))); }); });
      var cheios = vals.filter(function (s) { return !vazio(s); });
      var tipo = !cheios.length ? 'texto'
        : cheios.every(function (s) { return TIER[s] != null; }) ? 'tier'
        : cheios.every(function (s) { return REL[s] != null; }) ? 'rel'
        : cheios.filter(function (s) { return numero(s) != null; }).length * 2 >= cheios.length ? 'num' : 'texto';
      function chaveDe(s) { return tipo === 'tier' ? TIER[s] : tipo === 'rel' ? REL[s] : tipo === 'num' ? numero(s) : s; }
      blocos.forEach(function (b) {
        if (!b.dados) { tb.appendChild(b.fixa); return; }
        b.dados.map(function (tr, i) { var s = texto(celula(tr, col)); return { tr: tr, i: i, s: s, v: vazio(s) ? null : chaveDe(s) }; })
          .sort(function (a, b2) {
            if (a.v == null || b2.v == null) return (a.v == null) - (b2.v == null) || a.i - b2.i;
            var r = tipo === 'texto' ? String(a.v).localeCompare(String(b2.v), 'pt-BR', { numeric: true, sensitivity: 'base' }) : a.v - b2.v;
            return r * d || a.i - b2.i;
          })
          .forEach(function (x) { tb.appendChild(x.tr); });
        b.fim.forEach(function (tr) { tb.appendChild(tr); });
      });
    });
    Array.prototype.forEach.call(h.cells, function (c) { if (c.classList.contains('ordenavel')) c.removeAttribute('aria-sort'); });
    var alvo = celula(h, col); if (alvo) alvo.setAttribute('aria-sort', d > 0 ? 'ascending' : 'descending');
    t.setAttribute('data-ord', col + ':' + d);
  }

  function marcar(t) {
    Array.prototype.forEach.call(cabecalho(t).cells, function (c) {
      if (c.classList.contains('ordenavel') || !c.textContent.trim()) return;
      c.classList.add('ordenavel');
      if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '0');
      if (!c.title) c.title = 'Ordenar por esta coluna';
    });
  }
  function varrer() {
    Array.prototype.forEach.call(document.querySelectorAll('table'), function (t) {
      if (!apta(t)) return;
      marcar(t);
      var m = memo[chave(t)];
      if (m && t.getAttribute('data-ord') !== m.c + ':' + m.d) ordenar(t, m.c, m.d);
    });
  }
  function clicar(th) {
    var t = th.closest('table');
    if (!t || !apta(t) || th.parentNode !== cabecalho(t)) return;
    var col = coluna(th), k = chave(t), m = memo[k];
    var d;
    if (m && m.c === col) d = -m.d;
    else {
      // primeiro clique: número e tier do maior para o menor; texto de A a Z
      var tr = t.tBodies[0] && Array.prototype.find.call(t.tBodies[0].rows, function (r) { return !FIXA.test(r.className) && !vazio(texto(celula(r, col))); });
      var s = tr ? texto(celula(tr, col)) : '';
      d = (numero(s) != null || TIER[s] != null || REL[s] != null) ? -1 : 1;
    }
    memo[k] = { c: col, d: d };
    // lista cortada: abre inteira; o redesenho volta a ordenar sozinho
    var mais = t.querySelector('tr.mais button, tr.mais [data-act="mais"]');
    if (mais && /^Ver todas/.test(mais.textContent.trim())) { mais.click(); setTimeout(varrer, 0); return; }
    ordenar(t, col, d);
  }
  document.addEventListener('click', function (ev) {
    var th = ev.target.closest && ev.target.closest('th.ordenavel');
    if (!th || ev.target.closest('button, a, input, select, label')) return;
    clicar(th);
  });
  document.addEventListener('keydown', function (ev) {
    if ((ev.key !== 'Enter' && ev.key !== ' ') || !ev.target.matches || !ev.target.matches('th.ordenavel')) return;
    ev.preventDefault(); clicar(ev.target);
  });
  var pendente = false;
  new MutationObserver(function () {
    if (pendente) return;
    pendente = true;
    (window.requestAnimationFrame || setTimeout)(function () { pendente = false; varrer(); });
  }).observe(document.body, { childList: true, subtree: true });
  varrer();
  window.ORDENAR = { varrer: varrer, memo: memo };   // para os testes
})();
