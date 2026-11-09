/* Estratégias: a página é montada pelo motor; aqui só os links do hub e dos painéis (locais no arquivo, publicados no claude.ai). */
var E = /*__DATA__*/null;
var $ = function (s) { return document.querySelector(s); };
var pub = location.protocol !== 'file:';
function link(id, d) { var a = $(id); if (!a || !d) return; a.hidden = false; if (pub && d.pub) a.href = d.pub; else a.href = d.href + (a.getAttribute('href').indexOf('#') >= 0 ? a.getAttribute('href').slice(a.getAttribute('href').indexOf('#')) : ''); }
if (E) {
  if (E.hub) { ['#e-l-decks', '#e-l-pastas', '#e-l-dash'].forEach(function (id) { var a = $(id); var h = a.getAttribute('href'); a.href = (pub && E.hub.pub) ? E.hub.pub + h.slice(h.indexOf('#')) : h; }); }
  link('#e-l-caixa', E.caixa); link('#e-l-grim', E.grimorio); link('#e-l-cons', E.consulta);
  if (pub) { Array.prototype.forEach.call(document.querySelectorAll('.es-deck'), function (a) { var p = E.decks[a.getAttribute('data-pasta')]; if (p) a.href = p; }); }
  $('#e-estado').textContent = 'Montado em ' + E.gerado + '.';
}
/* a aba ativa da barra acompanha a rolagem */
var links = Array.prototype.slice.call(document.querySelectorAll('#e-nav a'));
function ativa() {
  var y = window.scrollY + 90, atual = links[0];
  links.forEach(function (a) { var s = document.getElementById(a.getAttribute('data-aba')); if (s && s.offsetTop <= y) atual = a; });
  links.forEach(function (a) { if (a === atual) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
}
window.addEventListener('scroll', ativa, { passive: true }); ativa();
$('#foot').innerHTML = '<p>O material bruto fica em <code>dados/estratégias/&lt;tema&gt;/</code>; o digest, em <code>contexto/estrategias/</code>. Nada aqui entra no placar ou no tier dos decks.</p>';
