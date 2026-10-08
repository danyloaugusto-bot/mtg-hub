(function () {
'use strict';

var H = /*__DATA__*/null;
window.HUB = H;   /* para os testes; o hub não lê nada daqui */

function $(s) { return document.querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
function pl(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
function semAcento(s) { return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
var MANA = { W: '#f3e7bf', U: '#a9cdf0', B: '#8a7a92', R: '#f0a28c', G: '#9fd0a6' };
var NOMEC = { W: 'Branco', U: 'Azul', B: 'Preto', R: 'Vermelho', G: 'Verde' };

function cores(s) {
  var c = String(s || '').toUpperCase();
  if (!c) return '';
  return '<span class="cores" aria-label="Cores: ' + esc(c) + '">' + 'WUBRG'.split('').filter(function (k) { return c.indexOf(k) >= 0; })
    .map(function (k) { return '<i class="ms ms-' + k + '">' + k + '</i>'; }).join('') + '</span>';
}

/* ============ decks ============ */
function cartao(d) {
  var busca = esc(semAcento(d.nome + ' ' + (d.painel || '') + ' ' + d.cmd));
  if (d.painel) {
    return '<article class="deck" data-busca="' + busca + '">' +
      (d.capa ? '<img class="capa" src="' + d.capa + '" alt="" style="object-position:' + esc(d.foco || '50% 30%') + '">' : '') +
      '<a class="ir" href="' + esc(d.href) + '" aria-label="Abrir o painel ' + esc(d.painel) + ', deck ' + esc(d.nome) + '"></a>' +
      '<div class="tampa"></div>' +
      '<div class="faixa"><div class="nome"><h3>' + esc(d.nome) + '</h3><p class="sub">' + esc(d.painel) + '</p></div>' +
      '<span class="pts num" title="Placar do deck">' + d.placar + '<small>pts</small></span></div>' +
      '<div class="base">' + cores(d.cores) + '</div></article>';
  }
  return '<article class="deck vazio' + (d.capa ? ' com-capa' : '') + '" data-busca="' + busca + '">' +
    (d.capa ? '<img class="capa" src="' + d.capa + '" alt=""><div class="tampa"></div>' : '<div class="meio"><b>Em construção</b></div>') +
    '<div class="faixa"><div class="nome"><h3>' + esc(d.nome) + '</h3>' + (d.cmd ? '<p class="sub">' + esc(d.cmd) + '</p>' : '') + '</div></div>' +
    '<div class="base">' + (d.capa ? '<span class="obra">em construção</span>' : '') + cores(d.cores) + '</div></article>';
}
function vistaDecks() {
  return H.grupos.map(function (g) {
    var ds = H.decks.filter(function (d) { return d.grupo === g.k; });
    return '<section class="grupo" data-grupo="' + g.k + '"><h2>' + esc(g.n) + '</h2>' +
      (ds.length ? '<div class="grade">' + ds.map(cartao).join('') + '</div>' : '<p class="vazio-g">Nenhum deck neste grupo ainda.</p>') + '</section>';
  }).join('');
}

/* ============ pastas ============ */
function vistaPastas() {
  return '<p class="intro">As suas pastas de cartas. Quando chegar a lista de cada uma, ela aparece aqui organizada por cor e custo, com o valor de cada carta, ' +
    'o que tem sinergia com os seus decks e não está sendo usado, o que dá para vender, e os temas que já formariam um deck novo.</p>' +
    '<div class="pastas">' + H.pastas.map(function (p) {
      return '<article class="pasta" style="--pc:' + esc(p.c) + '"><div class="lomb"></div><div class="t"><h3>' + esc(p.n) + '</h3><p>Sem lista ainda.</p></div></article>';
    }).join('') + '</div>';
}

/* ============ dashboard ============ */
function barras(itens, max) {
  max = Math.max(1, max);
  return '<div class="barras">' + itens.map(function (it) {
    return '<div class="barra"><span>' + it.r + '</span><span class="t"><i style="width:' + (it.v / max * 100).toFixed(1) + '%;' + (it.c ? '--c:' + it.c : '') + '"></i></span><b class="num">' + it.v + '</b></div>';
  }).join('') + '</div>';
}
function vistaDash() {
  var comCor = H.decks.filter(function (d) { return d.cores; }), semCor = H.decks.length - comCor.length;
  var porCor = 'WUBRG'.split('').map(function (k) {
    return { r: '<i class="ms ms-' + k + '" style="width:18px;height:18px;font-size:10px;margin-right:6px;vertical-align:-3px">' + k + '</i>' + NOMEC[k],
      v: comCor.filter(function (d) { return d.cores.indexOf(k) >= 0; }).length, c: MANA[k] };
  });
  var nomesN = ['', 'Uma cor', 'Duas cores', 'Três cores', 'Quatro cores', 'Cinco cores'];
  var porQtd = [1, 2, 3, 4, 5].map(function (n) { return { r: nomesN[n], v: comCor.filter(function (d) { return d.cores.length === n; }).length }; })
    .filter(function (x) { return x.v; });
  var maxCor = Math.max.apply(null, porCor.map(function (x) { return x.v; }).concat(porQtd.map(function (x) { return x.v; })));
  var cxCores = '<div class="cx"><h2>Cores dos seus decks</h2>' + barras(porCor, maxCor) +
    '<h2 style="margin-top:16px;font-size:17px">Quantas cores cada deck usa</h2>' + barras(porQtd, maxCor) +
    '<p class="nota">' + pl(comCor.length, 'deck', 'decks') + ' com as cores conhecidas' + (semCor ? '; ' + pl(semCor, 'ainda está', 'ainda estão') + ' sem cor no inventário' : '') + '.</p></div>';

  var ps = H.decks.filter(function (d) { return d.painel; });
  var cri = ps.map(function (d) { return { r: esc(d.nome), v: (d.tipos && d.tipos.cri) || 0 }; }).sort(function (a, b) { return b.v - a.v; });
  var cxCri = '<div class="cx"><h2>Criaturas por deck</h2>' + (cri.length ? barras(cri, Math.max.apply(null, cri.map(function (x) { return x.v; }))) : '') +
    '<p class="nota">Conta o comandante. Só os decks que já têm painel: ' + pl(ps.length, 'deck', 'decks') + ' por enquanto.</p></div>';

  var cxComuns = '<div class="cx"><h2>Cartas em comum</h2>' + (H.comuns.length ?
    '<div class="tw"><table><thead><tr><th>Carta</th><th class="n">Decks</th><th>Onde</th></tr></thead><tbody>' + H.comuns.map(function (c) {
      return '<tr><td>' + esc(c[0]) + '</td><td class="n num">' + c[1].length + '</td><td><div class="chips">' + c[1].map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div></td></tr>';
    }).join('') + '</tbody></table></div>' : '<p class="nota">Nenhuma carta repetida entre os decks com painel.</p>') +
    '<p class="nota">Cartas que aparecem em dois ou mais decks com painel. Terrenos básicos não contam.</p></div>';
  return '<div class="painel">' + cxCores + cxCri + cxComuns + '</div>';
}

/* ============ navegação ============ */
function vista(k) {
  document.querySelectorAll('[role=tab][data-vista]').forEach(function (b) { var on = b.dataset.vista === k; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  document.querySelectorAll('.vista').forEach(function (v) { v.hidden = v.id !== 'v-' + k; });
}
function filtrar() {
  var q = semAcento($('#q').value.trim());
  if (q && $('#v-decks').hidden) vista('decks');
  document.querySelectorAll('.deck').forEach(function (el) { el.hidden = !!q && el.dataset.busca.indexOf(q) < 0; });
  document.querySelectorAll('.grupo').forEach(function (g) { g.hidden = !!q && !g.querySelectorAll('.deck:not([hidden])').length; });
}

$('#v-decks').innerHTML = vistaDecks();
$('#v-pastas').innerHTML = vistaPastas();
$('#v-dash').innerHTML = vistaDash();
$('#foot').innerHTML = '<p>O hub mostra a foto do último build, de ' + esc(H.gerado) + '. O que você edita dentro de um painel fica naquele painel até voltar para o projeto com o <code>/importar-backup</code>, pela aba Oficina.</p>' +
  '<p>Arte das cartas e dos comandantes: © Wizards of the Coast.</p>';
$('#q').addEventListener('input', filtrar);
document.addEventListener('click', function (ev) { var t = ev.target.closest('[role=tab][data-vista]'); if (t) vista(t.dataset.vista); });
document.addEventListener('keydown', function (ev) {
  var t = ev.target; if (!t.matches || !t.matches('[role=tab][data-vista]') || (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft')) return;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role=tab][data-vista]')), i = tabs.indexOf(t);
  var n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; vista(n.dataset.vista); n.focus();
});
})();
