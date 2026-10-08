(function () {
'use strict';

var H = /*__DATA__*/null;
window.HUB = H;   /* para os testes; o hub não lê nada daqui */

function $(s) { return document.querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
function fmt(n, d) { return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function pl(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
function semAcento(s) { return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

function cores(s) {
  var c = String(s || '').toUpperCase();
  return '<span class="cores" aria-label="Cores: ' + esc(c || 'incolor') + '">' + 'WUBRG'.split('').filter(function (k) { return c.indexOf(k) >= 0; })
    .map(function (k) { return '<i class="ms ms-' + k + '">' + k + '</i>'; }).join('') + '</span>';
}
/* OK: sem troca nem compra sugerida no radar. nOK: há o que mexer. Decks sem painel usam o rótulo do aplicativo. */
function selo(d) {
  if (d.painel) {
    return d.pendentes ? '<span class="selo s-nok" title="Há ' + pl(d.pendentes, 'troca sugerida', 'trocas sugeridas') + ' no radar">nOK · ' + pl(d.pendentes, 'troca', 'trocas') + '</span>'
      : '<span class="selo s-ok" title="Sem troca nem compra pendente no radar">OK</span>';
  }
  var a = d.app;
  if (a === 'OK') return '<span class="selo s-ok">OK</span>';
  if (a === 'nOK' || a === 'OKn') return '<span class="selo s-nok">' + esc(a) + '</span>';
  if (a) return '<span class="selo s-obras">' + esc(a) + '</span>';
  return '';
}
function appDifere(d) {
  if (!d.painel || !d.app) return '';
  var calc = d.pendentes ? 'nOK' : 'OK', app = d.app === 'OKn' ? 'nOK' : d.app;
  return app !== calc ? '<span class="app">no aplicativo: ' + esc(d.app) + '</span>' : '';
}

function cartao(d) {
  var pub = d.link ? '<a class="pub" href="' + esc(d.link) + '" target="_blank" rel="noopener noreferrer">publicado</a>' : '';
  if (d.painel) {
    return '<article class="deck" data-busca="' + esc(semAcento(d.nome + ' ' + d.painel + ' ' + d.cmd)) + '">' +
      (d.capa ? '<img class="capa" src="' + d.capa + '" alt="" style="object-position:' + esc(d.foco || '50% 30%') + '">' : '') +
      '<a class="ir" href="' + esc(d.href) + '" aria-label="Abrir o painel ' + esc(d.painel) + ', deck ' + esc(d.nome) + '"></a>' +
      '<div class="tampa"></div>' +
      '<div class="faixa"><h3>' + esc(d.nome) + '</h3><p class="sub">' + esc(d.painel) + '</p></div>' +
      '<div class="base"><div class="pilha"><div class="nums"><span><b class="num">' + d.placar + '</b> pts</span><span>CMC <b class="num">' + fmt(d.cmc, 2) + '</b></span>' +
      '<span><b class="num">' + d.berlinda + '</b> na berlinda</span></div>' +
      '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' + selo(d) + appDifere(d) + pub + '</div></div>' + cores(d.cores) + '</div></article>';
  }
  return '<article class="deck vazio' + (d.capa ? ' com-capa' : '') + '" data-busca="' + esc(semAcento(d.nome + ' ' + d.cmd)) + '">' +
    (d.capa ? '<img class="capa" src="' + d.capa + '" alt="" style="opacity:.45">' : '') +
    '<div class="meio"><b>Em construção</b><span>painel a fazer</span></div>' +
    '<div class="faixa"><h3>' + esc(d.nome) + '</h3>' + (d.cmd ? '<p class="sub">' + esc(d.cmd) + '</p>' : '') + '</div>' +
    '<div class="base"><div class="pilha"><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' + selo(d) + pub + '</div></div>' + cores(d.cores) + '</div></article>';
}

function grupos() {
  return H.grupos.map(function (g) {
    var ds = H.decks.filter(function (d) { return d.grupo === g.k; });
    var prontos = ds.filter(function (d) { return d.painel; }).length;
    return '<section class="grupo" data-grupo="' + g.k + '"><h2>' + esc(g.n) + ' <small>' + pl(ds.length, 'deck', 'decks') + (prontos ? ', ' + prontos + ' com painel' : '') + '</small></h2>' +
      (ds.length ? '<div class="grade">' + ds.map(cartao).join('') + '</div>' : '<p class="vazio-g">Nenhum deck neste grupo ainda.</p>') + '</section>';
  }).join('');
}

function compras() {
  if (!H.compras.length) return '<p class="nota">Nenhuma carta com veredito de entrada nos radares.</p>';
  var tot = 0, sem = 0;
  var linhas = H.compras.map(function (c) {
    if (c.usd) tot += +c.usd; else sem++;
    var liga = 'https://www.ligamagic.com.br/?view=cards/card&card=' + encodeURIComponent(c.n);
    return '<tr><td>' + esc(c.n) + '</td><td>' + esc(c.deck) + '</td><td>' + (c.sai ? esc(c.sai) : '<span style="color:var(--dim)">ninguém</span>') + '</td>' +
      '<td class="n num">' + (c.usd ? 'US$ ' + fmt(+c.usd, 2) : '—') + '</td><td><a href="' + esc(liga) + '" target="_blank" rel="noopener noreferrer">LigaMagic</a></td></tr>';
  }).join('');
  return '<div class="tw"><table><thead><tr><th>Carta</th><th>Deck</th><th>No lugar de</th><th class="n">Preço no Scryfall</th><th>Preço em R$</th></tr></thead><tbody>' + linhas +
    '</tbody><tfoot><tr><td>' + pl(H.compras.length, 'carta', 'cartas') + '</td><td></td><td></td><td class="n num">US$ ' + fmt(tot, 2) + '</td><td></td></tr></tfoot></table></div>' +
    '<p class="nota">Cartas com veredito de entrada no radar de cada deck. A marca "tenho a carta" fica dentro de cada painel e não chega aqui: confira antes de comprar.' +
    (sem ? ' ' + pl(sem, 'carta está', 'cartas estão') + ' sem preço no Scryfall.' : '') + ' Preço em dólar da impressão padrão, na data do último build.</p>';
}

function ranking() {
  var ps = H.decks.filter(function (d) { return d.painel; });
  if (!ps.length) return '<p class="nota">Nenhum deck com painel ainda.</p>';
  function lista(arr, val, um, varios) {
    return '<ol>' + arr.map(function (d, i) {
      return '<li><span class="o">' + (i + 1) + '</span><a href="' + esc(d.href) + '">' + esc(d.nome) + '</a><span class="p num">' + pl(val(d), um, varios) + '</span></li>';
    }).join('') + '</ol>';
  }
  var porPlacar = ps.slice().sort(function (a, b) { return b.placar - a.placar; });
  var porPend = ps.slice().sort(function (a, b) { return (b.pendentes - a.pendentes) || (b.berlinda - a.berlinda); });
  return '<div class="rk"><div><h3>Por pendências</h3>' + lista(porPend, function (d) { return d.pendentes; }, 'troca', 'trocas') +
    '<p class="nota">Trocas sugeridas no radar e ainda não feitas no projeto. Empate desfeito pelas cartas na berlinda.</p></div>' +
    '<div><h3>Por placar</h3>' + lista(porPlacar, function (d) { return d.placar; }, 'ponto', 'pontos') +
    '<p class="nota">Cuidado ao comparar: cada deck tem os próprios agrupamentos, então o placar mede um deck contra ele mesmo ao longo do tempo, não um deck contra outro.</p></div></div>';
}

function comuns() {
  if (!H.comuns.length) {
    return '<p class="nota">Nenhuma carta aparece em três ou mais decks ainda. Conta só os decks que já têm decklist no projeto' +
      (H.em_dois ? '; ' + pl(H.em_dois, 'carta está', 'cartas estão') + ' em dois.' : '.') + '</p>';
  }
  return '<div class="tw"><table><thead><tr><th>Carta</th><th class="n">Decks</th><th>Onde</th></tr></thead><tbody>' + H.comuns.map(function (c) {
    return '<tr><td>' + esc(c[0]) + '</td><td class="n num">' + c[1].length + '</td><td><div class="chips">' + c[1].map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div></td></tr>';
  }).join('') + '</tbody></table></div><p class="nota">Terrenos básicos não entram. Conta só os decks que já têm decklist no projeto.</p>';
}

function filtrar() {
  var q = semAcento($('#q').value.trim());
  document.querySelectorAll('.deck').forEach(function (el) { el.hidden = !!q && el.dataset.busca.indexOf(q) < 0; });
  document.querySelectorAll('.grupo').forEach(function (g) {
    var vis = g.querySelectorAll('.deck:not([hidden])').length;
    g.hidden = !!q && !vis;
  });
}

function aba(k) {
  document.querySelectorAll('.abas [role=tab]').forEach(function (b) { var on = b.dataset.aba === k; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  document.querySelectorAll('.vista').forEach(function (v) { v.hidden = v.id !== 'v-' + k; });
}

var ps = H.decks.filter(function (d) { return d.painel; });
$('#resumo').textContent = pl(H.decks.length, 'deck', 'decks') + ', ' + ps.length + ' com painel';
$('#legenda').innerHTML = '<b>OK</b>: deck fechado, sem troca nem compra pendente no radar. <b>nOK</b>: há o que mexer ou comprar. Nos decks com painel, o selo é calculado; nos outros, vem do aplicativo.';
$('#grupos').innerHTML = grupos();
$('#v-compras').innerHTML = compras();
$('#v-ranking').innerHTML = ranking();
$('#v-comuns').innerHTML = comuns();
$('#foot').innerHTML = '<p>O hub mostra a foto do último build, de ' + esc(H.gerado) + '. O que você edita dentro de um painel fica naquele painel até voltar para o projeto com o <code>/importar-backup</code>, pela aba Oficina.</p>' +
  '<p>Arte das cartas e dos comandantes: © Wizards of the Coast. Preços e textos: Scryfall.</p>';
$('#q').addEventListener('input', filtrar);
document.addEventListener('click', function (ev) { var t = ev.target.closest('.abas [role=tab]'); if (t) aba(t.dataset.aba); });
document.addEventListener('keydown', function (ev) {
  var t = ev.target; if (!t.matches || !t.matches('.abas [role=tab]') || (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft')) return;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.abas [role=tab]')), i = tabs.indexOf(t);
  var n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; aba(n.dataset.aba); n.focus();
});
})();
