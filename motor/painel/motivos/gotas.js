/* Motivo "gotas" do gráfico de pontuação: 04. Fynn (Presas da Serpente), escolhido pelo dono na votação de 15/10/2026.
   Veio do protótipo motivos/fynn.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "gotas"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Fynn, Presas da Serpente: o veneno. O símbolo oficial do marcador de veneno é o sinal phyrexiano
     (um aro cortado por um traço vertical, de pontas irregulares) sobre um brilho verde tóxico. */
  function poisonGlyph(x, y, s, cor) {
    // aro e traço do sinal phyrexiano; s = raio do aro
    var w = s * 0.2;
    return '<g transform="translate(' + f1(x) + ' ' + f1(y) + ')">' +
      '<circle r="' + f1(s) + '" style="fill:none;stroke:' + cor + '" stroke-width="' + f1(w) + '"/>' +
      '<path d="M' + f1(-w * 0.55) + ' ' + f1(s * 1.15) + 'L' + f1(-w * 0.35) + ' ' + f1(-s * 1.05) + 'L0 ' + f1(-s * 1.55) + 'L' + f1(w * 0.4) + ' ' + f1(-s * 1.0) +
      'L' + f1(w * 0.6) + ' ' + f1(s * 1.25) + 'Z" style="fill:' + cor + '"/></g>';
  }
  function poisonDefs() {
    return '<filter id="pzGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<radialGradient id="pzHalo"><stop offset="0" style="stop-color:rgba(var(--blood-rgb),.55)"/><stop offset="1" style="stop-color:rgba(var(--blood-rgb),0)"/></radialGradient>';
  }
  function poisonCenter(ctx) {
    return '<circle cx="230" cy="230" r="' + (ctx.r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
      '<circle cx="230" cy="196" r="20" style="fill:url(#pzHalo)"/>' + poisonGlyph(230, 198, 9, 'rgba(var(--blood2-rgb),.95)');
  }

  /* opção 1: uma gota por agrupamento, com o bico para fora; o veneno enche da base para a ponta, na cor do agrupamento.
     A mais cheia brilha verde e pinga. */
  MOTIVOS.fynn1 = {
    deck: '04. Fynn', nome: 'Gotas de veneno',
    desc: 'Cada agrupamento é uma gota de pé, como cai de verdade, que enche de veneno de baixo para cima conforme a pontuação. A mais cheia brilha em verde tóxico e pinga. No centro, o símbolo oficial do marcador de veneno.',
    defs: poisonDefs,
    stage: function (ctx) {
      return '<circle cx="230" cy="230" r="' + (ctx.R + 10) + '" style="fill:rgba(var(--deep-rgb),.6);stroke:rgba(var(--blood-rgb),.45)" stroke-width="1.3"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 16) + '" style="fill:none;stroke:rgba(var(--blood-rgb),.35)" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round"/>';
    },
    group: function (g, ctx) {
      // gota de pé: a base redonda embaixo, o bico para cima; c = centro do círculo da base
      var r = 25, h = 50, c = ctx.pol(ctx.r0 + 66, g.am), id = ctx.uid('gz');
      var cx = c[0], cy = c[1] + 12;
      var d = 'M' + f1(cx) + ' ' + f1(cy - h) + 'C' + f1(cx + r * 0.3) + ' ' + f1(cy - h * 0.55) + ' ' + f1(cx + r) + ' ' + f1(cy - r * 0.75) + ' ' + f1(cx + r) + ' ' + f1(cy) +
        'A' + r + ' ' + r + ' 0 1 1 ' + f1(cx - r) + ' ' + f1(cy) + 'C' + f1(cx - r) + ' ' + f1(cy - r * 0.75) + ' ' + f1(cx - r * 0.3) + ' ' + f1(cy - h * 0.55) + ' ' + f1(cx) + ' ' + f1(cy - h) + 'Z';
      var L = h + r, nivel = cy + r - L * Math.max(0.05, g.frac);
      var o = '<clipPath id="' + id + '"><path d="' + d + '"/></clipPath>' +
        '<path d="' + d + '" style="fill:rgba(var(--deep-rgb),.75);stroke:' + g.rgba(.5) + '" stroke-width="1.4"/>' +
        '<g clip-path="url(#' + id + ')"' + (g.top ? ' filter="url(#pzGlow)"' : '') + '>' +
        '<rect x="' + f1(cx - r - 2) + '" y="' + f1(nivel) + '" width="' + (2 * r + 4) + '" height="' + f1(cy + r - nivel + 2) + '" style="fill:' + g.cor + '"/>' +
        '<ellipse cx="' + f1(cx) + '" cy="' + f1(nivel) + '" rx="' + (r + 2) + '" ry="2.4" style="fill:rgba(255,255,255,.4)"/>' +
        (g.frac > 0.3 ? '<circle cx="' + f1(cx - 8) + '" cy="' + f1(cy + 10) + '" r="3" style="fill:rgba(255,255,255,.3)"/><circle cx="' + f1(cx + 6) + '" cy="' + f1(Math.max(nivel + 8, cy - 6)) + '" r="1.9" style="fill:rgba(255,255,255,.28)"/>' : '') +
        '</g>' +
        '<path d="M' + f1(cx - r * 0.62) + ' ' + f1(cy - r * 0.45) + 'A' + f1(r * 0.78) + ' ' + f1(r * 0.78) + ' 0 0 0 ' + f1(cx - r * 0.5) + ' ' + f1(cy + r * 0.55) + '" style="fill:none;stroke:rgba(255,255,255,.38)" stroke-width="2.2" stroke-linecap="round"/>';
      if (g.top) o += '<path d="M' + f1(cx) + ' ' + f1(cy + r + 6) + 'c-3 4 -4.5 6 -4.5 8.5a4.5 4.5 0 0 0 9 0c0 -2.5 -1.5 -4.5 -4.5 -8.5z" style="fill:rgb(var(--blood-rgb))" filter="url(#pzGlow)"/>';
      return o;
    },
    center: poisonCenter
  };

  /* opção 2: o contador de veneno. Dez marcadores por agrupamento, do centro para fora; acendem em proporção à soma das notas.
     Dez é o número que mata: o agrupamento mais cheio acende os dez e ganha o brilho. */

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.fynn1.legenda = { peca: "gota", masc: false, texto: " é um agrupamento: o veneno enche a gota de baixo para cima em proporção à soma das notas, e a mais cheia brilha e pinga." };

  return MOTIVOS.fynn1;
})();
