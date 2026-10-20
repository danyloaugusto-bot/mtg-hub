/* Motivo "circulos" do gráfico de pontuação: 04. Zur, rebranding, lote 3, acabamento aprovado pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "circulos"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "circulos" do gráfico de pontuação: 04. Zur (Equilíbrio Encantado), escolhido pelo dono na votação de 15/10/2026.
   Veio do protótipo motivos/zur.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "circulos"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184.
   Rebranding, lote 3, variação K (só o kit de luz, com as runas acendendo): mesmos círculos e mesma composição. O arco ganha
   brilho largo na cor do critério, corpo com textura, núcleo branco e reflexo; as runas que ele cobre acendem com brilho,
   cor e fio branco; o disco de cada círculo ganha profundidade e o glifo do círculo cheio acende inteiro.
   Sem raio(f): a peça cresce em ângulo, não em raio, então a faixa radial da régua não se aplica (como hoje). */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Zur, Equilíbrio Encantado: encantamentos. Opção 1, as constelações de Nyx (a mecânica de constelação de Theros);
     opção 2, círculos de encantamento. No centro, o orbe azul do cajado do Zur. */

  function zrRng(seed) {
    var s = seed % 2147483647; if (s <= 0) s += 2147483646;
    return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; };
  }
  function zrXY(p) { return f1(p[0]) + ' ' + f1(p[1]); }
  // reflexo de quatro pontas; 'e' alonga a cruz vertical
  function zrBrilho(x, y, s, cor, e) {
    var a = s * 0.14, v = s * (e || 1);
    return '<path d="M' + f1(x) + ' ' + f1(y - v) + 'Q' + f1(x + a) + ' ' + f1(y - a) + ' ' + f1(x + s) + ' ' + f1(y) + 'Q' + f1(x + a) + ' ' + f1(y + a) + ' ' + f1(x) + ' ' + f1(y + v) +
      'Q' + f1(x - a) + ' ' + f1(y + a) + ' ' + f1(x - s) + ' ' + f1(y) + 'Q' + f1(x - a) + ' ' + f1(y - a) + ' ' + f1(x) + ' ' + f1(y - v) + 'Z" style="fill:' + cor + '"/>';
  }
  function zrDefs(ctx, I) {
    I.glow = ctx.uid('zg'); I.orbe = ctx.uid('zo'); I.halo = ctx.uid('zh'); I.med = ctx.uid('zm');
    return '<filter id="' + I.glow + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<radialGradient id="' + I.orbe + '" cx=".38" cy=".32" r=".7"><stop offset="0" style="stop-color:#ffffff"/><stop offset=".22" style="stop-color:var(--gold2)"/><stop offset=".62" style="stop-color:var(--gold)"/><stop offset="1" style="stop-color:#1b4a7e"/></radialGradient>' +
      '<radialGradient id="' + I.halo + '"><stop offset="0" style="stop-color:rgba(var(--gold-rgb),.65)"/><stop offset=".45" style="stop-color:rgba(var(--gold-rgb),.22)"/><stop offset="1" style="stop-color:rgba(var(--gold-rgb),0)"/></radialGradient>' +
      '<radialGradient id="' + I.med + '" cx=".5" cy=".36" r=".7"><stop offset="0" style="stop-color:#1c3354"/><stop offset=".6" style="stop-color:var(--sheet2)"/><stop offset="1" style="stop-color:var(--deep)"/></radialGradient>';
  }
  /* o medalhão com o orbe azul do cajado, preso nas garras de prata */
  function zrCentro(ctx, I) {
    return '<circle cx="230" cy="230" r="' + (ctx.r0 - 5) + '" style="fill:url(#' + I.med + ');stroke:var(--gold)" stroke-width="1.6"/>' +
      '<circle cx="230" cy="230" r="' + (ctx.r0 - 8.5) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.3)" stroke-width=".6"/>' +
      '<circle cx="230" cy="193" r="16" style="fill:url(#' + I.halo + ')"/>' +
      '<path d="M230 201.6C224.6 200.8 221.6 197 222 192.4C222.3 189.4 223.4 187.4 225.2 186M230 201.6C235.4 200.8 238.4 197 238 192.4C237.7 189.4 236.6 187.4 234.8 186" style="fill:none;stroke:rgba(var(--bone-rgb),.85)" stroke-width="1.25" stroke-linecap="round"/>' +
      '<path d="M227 202L230 199.4L233 202L230 203.4Z" style="fill:rgba(var(--bone-rgb),.85)"/>' +
      '<circle cx="230" cy="193" r="6.6" style="fill:url(#' + I.orbe + ')"/>' +
      '<circle cx="227.8" cy="190.8" r="1.5" style="fill:rgba(255,255,255,.9)"/>';
  }

  /* opção 1: constelações. Cada agrupamento é uma constelação de 6 a 8 estrelas, ligada por linhas finas, que acende do
     centro para fora: a distância que a luz alcança é proporcional à nota. O maior acende a última estrela, que cintila. */
  var ZR1 = {};
  var ZR_CONST = [
    [[0, 0], [.16, .42], [.34, .3], [.5, -.2], [.66, -.5], [.84, -.3], [1, .15]],
    [[0, -.25], [.18, .35], [.36, -.15], [.55, .45], [.76, -.05], [1, .35]],
    [[0, .15], [.14, -.3], [.3, -.55], [.47, -.1], [.6, .4], [.77, .55], [.9, .15], [1, -.35]],
    [[0, -.45], [.2, -.55], [.4, -.22], [.57, .15], [.76, .45], [1, .28]],
    [[0, .35], [.17, -.1], [.33, .3], [.5, -.35], [.67, .1], [.84, -.5], [1, -.1]],
    [[0, 0], [.2, -.4], [.38, .05], [.53, .5], [.7, .2], [.86, .5], [1, .05]],
    [[0, -.1], [.15, .4], [.35, .5], [.5, .05], [.66, -.45], [.83, -.2], [1, -.55]],
    [[0, .3], [.16, -.05], [.3, -.45], [.47, -.2], [.62, .25], [.76, -.05], [.9, .4], [1, .1]]
  ];
  var ZR_MAG = [1, .7, .9, .62, 1.1, .78, .95, .7, 1.05, .66];

  /* opção 2: círculos de encantamento. Cada agrupamento é um círculo mágico de pé, com runas no anel; o arco na cor do
     agrupamento se fecha a partir do alto, no sentido horário, em proporção à nota, e as runas que ele cobre acendem.
     O glifo do meio só acende quando o círculo fecha: o maior. */
  var ZR2 = {};
  var ZR_RUNAS = ['M0 2.6V-2.6M-1.6 -1L0 -2.6L1.6 -1', 'M0 2.6V-2.6M0 -.3L-1.7 -2.3M0 -.3L1.7 -2.3', 'M-1.7 -2.4L1.7 2.4V-2.4L-1.7 2.4Z',
    'M0 -2.6L1.5 -.7L-1.3 2.6M0 -2.6L-1.5 -.7L1.3 2.6', 'M0 -2.6V2.6M-1.3 0a1.3 1.3 0 1 0 2.6 0a1.3 1.3 0 1 0 -2.6 0', 'M1 -2.4A2.5 2.5 0 1 0 1 2.4A1.9 1.9 0 1 1 1 -2.4Z',
    'M0 -2.4L2 1.8H-2ZM0 .5V.6', 'M1.2 -2.6L-1.2 -.5L1.2 .5L-1.2 2.6'];
  function zrGlifo(i, x, y) {
    // glifos do meio, raio ~17; um por agrupamento
    function pg(n, r, a0) { var s = []; for (var k = 0; k < n; k++) { var a = (a0 + k * 360 / n) * Math.PI / 180; s.push(f1(x + r * Math.cos(a)) + ' ' + f1(y + r * Math.sin(a))); } return 'M' + s.join('L') + 'Z'; }
    function ci(r) { return 'M' + f1(x - r) + ' ' + f1(y) + 'a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0Z'; }
    switch (i % 8) {
      case 0: return pg(3, 17, -90) + ci(6);
      case 1: return 'M' + f1(x - 16) + ' ' + f1(y) + 'Q' + f1(x) + ' ' + f1(y - 13) + ' ' + f1(x + 16) + ' ' + f1(y) + 'Q' + f1(x) + ' ' + f1(y + 13) + ' ' + f1(x - 16) + ' ' + f1(y) + 'Z' + ci(5) + ci(1.6);
      case 2: return pg(3, 17, 90) + 'M' + f1(x - 9.5) + ' ' + f1(y - 3) + 'H' + f1(x + 9.5) + ci(2);
      case 3: return 'M' + f1(x + 4) + ' ' + f1(y - 15) + 'A15 15 0 1 0 ' + f1(x + 4) + ' ' + f1(y + 15) + 'A11 11 0 1 1 ' + f1(x + 4) + ' ' + f1(y - 15) + 'Z' + pg(4, 4.6, -90).replace(/Z$/, 'Z');
      case 4: return pg(4, 17, -90) + pg(4, 8.5, -45) + ci(1.8);
      case 5: return pg(3, 17, -90) + pg(3, 17, 90) + ci(4);
      case 6: return ci(11) + 'M' + f1(x) + ' ' + f1(y - 17) + 'V' + f1(y - 4) + 'M' + f1(x) + ' ' + f1(y + 4) + 'V' + f1(y + 17) + 'M' + f1(x - 17) + ' ' + f1(y) + 'H' + f1(x - 4) + 'M' + f1(x + 4) + ' ' + f1(y) + 'H' + f1(x + 17);
      default: return pg(4, 16, -90) + pg(4, 16, -45) + ci(3.2);
    }
  }
  /* kit de luz: filtros comuns, o fundo de cada círculo (profundidade) e o palco */
  function zrDefsK(ctx, I) {
    var o = ctx.kit.defs(ctx, 'zr') + zrDefs(ctx, I);
    I.disco = ctx.uid('zd'); I.palco = ctx.uid('zp');
    return o + '<radialGradient id="' + I.disco + '" cx=".5" cy=".42" r=".6"><stop offset="0" style="stop-color:rgba(var(--gold-rgb),.13)"/><stop offset=".62" style="stop-color:rgba(var(--deep-rgb),.9)"/>' +
      '<stop offset=".9" style="stop-color:rgba(var(--deep-rgb),.95)"/><stop offset="1" style="stop-color:rgba(var(--gold-rgb),.16)"/></radialGradient>' +
      '<radialGradient id="' + I.palco + '" cx="230" cy="230" r="' + (ctx.R + 8) + '" gradientUnits="userSpaceOnUse"><stop offset=".25" style="stop-color:rgba(var(--gold-rgb),.06)"/>' +
      '<stop offset=".7" style="stop-color:rgba(0,0,0,0)"/><stop offset="1" style="stop-color:rgba(0,0,0,.45)"/></radialGradient>';
  }
  /* faixa de arco (preenchida, para a textura do kit pegar inteira): do alto, no sentido horário, até 'lim' graus */
  function zrFaixa(x, y, r, w, lim) {
    var a = r + w / 2, b = r - w / 2;
    function q(rr, g) { var t = g * Math.PI / 180; return f1(x + rr * Math.sin(t)) + ' ' + f1(y - rr * Math.cos(t)); }
    if (lim >= 359.9) return 'M' + q(a, 0) + 'A' + a + ' ' + a + ' 0 1 1 ' + q(a, 180) + 'A' + a + ' ' + a + ' 0 1 1 ' + q(a, 0) + 'Z' +
      'M' + q(b, 0) + 'A' + b + ' ' + b + ' 0 1 0 ' + q(b, 180) + 'A' + b + ' ' + b + ' 0 1 0 ' + q(b, 0) + 'Z';
    var lg = lim > 180 ? 1 : 0;
    return 'M' + q(a, 0) + 'A' + a + ' ' + a + ' 0 ' + lg + ' 1 ' + q(a, lim) + 'L' + q(b, lim) + 'A' + b + ' ' + b + ' 0 ' + lg + ' 0 ' + q(b, 0) + 'Z';
  }
  function zrArco(x, y, r, lim) {
    if (lim >= 359.9) return 'M' + f1(x) + ' ' + f1(y - r) + 'A' + r + ' ' + r + ' 0 1 1 ' + f1(x) + ' ' + f1(y + r) + 'A' + r + ' ' + r + ' 0 1 1 ' + f1(x) + ' ' + f1(y - r);
    var t = lim * Math.PI / 180;
    return 'M' + f1(x) + ' ' + f1(y - r) + 'A' + r + ' ' + r + ' 0 ' + (lim > 180 ? 1 : 0) + ' 1 ' + f1(x + r * Math.sin(t)) + ' ' + f1(y - r * Math.cos(t));
  }
  MOTIVOS.zur2 = {
    deck: '04. Zur', nome: 'Círculos de encantamento',
    desc: 'Cada agrupamento é um círculo de encantamento, com runas no anel: o arco na cor do agrupamento se fecha a partir do alto, no sentido horário, conforme a pontuação, e as runas que ele cobre acendem. O glifo do meio só acende quando o círculo fecha, e isso só acontece no maior; no centro, o orbe azul do cajado do Zur.',
    defs: function (ctx) { return zrDefsK(ctx, ZR2); },
    stage: function (ctx) {
      var I = ZR2, R = ctx.R, o = '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:rgba(var(--deep-rgb),.62);stroke:rgba(var(--gold-rgb),.45)" stroke-width="1.2"/>' +
        '<circle cx="230" cy="230" r="' + (R + 8) + '" style="fill:url(#' + I.palco + ')"/>' +
        '<circle cx="230" cy="230" r="' + (R + 6) + '" style="fill:none;stroke:rgba(var(--gold2-rgb),.14)" stroke-width="3" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<circle cx="230" cy="230" r="' + (R + 3) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.2)" stroke-width=".6"/>';
      for (var k = 0; k < 120; k++) {
        var a = k * 3, p1 = pol(R + 3, a), p2 = pol(R + (k % 5 ? 5.5 : 8), a);
        o += '<path d="M' + zrXY(p1) + 'L' + zrXY(p2) + '" style="stroke:rgba(var(--gold-rgb),.28)" stroke-width=".6"/>';
      }
      // o diagrama que liga os círculos
      var v = ctx.groups.map(function (g) { return zrXY(pol(124, g.am)); });
      o += '<path d="M' + v.join('L') + 'Z" style="fill:none;stroke:rgba(var(--gold-rgb),.16)" stroke-width=".8"/>';
      var st = ''; for (var j = 0; j < v.length; j++) st += 'M' + v[j] + 'L' + v[(j + 3) % v.length];
      o += '<path d="' + st + '" style="fill:none;stroke:rgba(var(--gold-rgb),.07)" stroke-width=".7"/>';
      return o;
    },
    group: function (g, ctx) {
      var I = ZR2, K = ctx.k, c = pol(124, g.am), x = c[0], y = c[1], ro = 34, ri = 24, rr = 29, cheio = g.frac >= 0.999;
      var lim = Math.max(0, Math.min(1, g.frac)) * 360, o = '';
      if (g.top) o += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (ro + 14) + '" style="fill:url(#' + I.halo + ')"/>';
      // o disco: fundo escuro com profundidade (claro no meio, aro aceso)
      o += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (ro + 2.5) + '" style="fill:rgba(var(--deep-rgb),.85);stroke:rgba(var(--gold-rgb),.3)" stroke-width=".6"/>' +
        '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (ro + 2.5) + '" style="fill:url(#' + I.disco + ')"/>' +
        '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + ro + '" style="fill:none;stroke:rgba(var(--gold-rgb),.2)" stroke-width="3"/>' +
        '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + ri + '" style="fill:none;stroke:rgba(var(--gold-rgb),.38)" stroke-width=".7"/>';
      // runas no anel, de pé em relação ao centro do círculo: as que o arco cobre acendem (brilho, corpo na cor, núcleo branco)
      var n = 14, acesas = '', apagadas = '';
      for (var k = 0; k < n; k++) {
        var a = (k + 0.5) * 360 / n, q = [x + rr * Math.sin(a * Math.PI / 180), y - rr * Math.cos(a * Math.PI / 180)];
        var el = '<path transform="translate(' + zrXY(q) + ') rotate(' + f1(a) + ')" d="' + ZR_RUNAS[(k * 3 + g.i) % ZR_RUNAS.length] + '"/>';
        if (a <= lim) acesas += el; else apagadas += el;
      }
      if (apagadas) o += '<g style="fill:none;stroke:rgba(var(--gold-rgb),.28)" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round">' + apagadas + '</g>';
      // o arco que fecha, com o kit de luz: brilho largo, corpo na cor com textura, núcleo e reflexo
      var arco = zrArco(x, y, ro, lim), faixa = zrFaixa(x, y, ro, 3.4, lim), w = g.top ? 1 : 0.8;
      o += '<g style="mix-blend-mode:screen">';
      if (lim > 0.5) {
        o += '<path d="' + arco + '" style="fill:none;stroke:' + g.cor + '" stroke-width="' + (g.top ? 11 : 8) + '" stroke-linecap="round" filter="url(#' + K.brilho + ')" opacity="' + (.5 + .25 * w) + '"/>';
      }
      if (acesas) {
        o += '<g style="fill:none;stroke:' + g.cor + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#' + K.brilho2 + ')" opacity=".95">' + acesas + '</g>' +
          '<g style="fill:none;stroke:' + g.cor + '" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">' + acesas + '</g>' +
          '<g style="fill:none;stroke:#fff" stroke-width=".45" stroke-linecap="round" stroke-linejoin="round" opacity=".85">' + acesas + '</g>';
      }
      if (lim > 0.5) {
        o += '<path d="' + faixa + '" fill-rule="evenodd" style="fill:' + g.cor + '" filter="url(#' + K.textura + ')"/>' +
          '<path d="' + arco + '" style="fill:none;stroke:#fff" stroke-width="1.1" stroke-linecap="round" opacity="' + (g.top ? .9 : .75) + '"/>' +
          '<path d="' + arco + '" style="fill:none;stroke:#fff" stroke-width="2.6" stroke-linecap="round" opacity=".3" filter="url(#' + K.brilho2 + ')"/>';
      }
      if (!cheio) {
        // a ponta do arco: a centelha que vai fechando o círculo
        var e = [x + ro * Math.sin(lim * Math.PI / 180), y - ro * Math.cos(lim * Math.PI / 180)];
        o += '<circle cx="' + f1(e[0]) + '" cy="' + f1(e[1]) + '" r="6" style="fill:' + g.rgba(.9) + '" filter="url(#' + K.brilho2 + ')"/>' +
          '<circle cx="' + f1(e[0]) + '" cy="' + f1(e[1]) + '" r="2.2" style="fill:#fff"/>';
      }
      o += '</g>';
      // marcas nos quatro pontos cardeais do anel
      for (var m = 0; m < 4; m++) {
        var pm = [x + (ro + 2.5) * Math.sin(m * Math.PI / 2), y - (ro + 2.5) * Math.cos(m * Math.PI / 2)];
        o += '<circle cx="' + f1(pm[0]) + '" cy="' + f1(pm[1]) + '" r="1.3" style="fill:rgba(var(--gold2-rgb),.7)"/>';
      }
      // o glifo do meio: só acende quando o círculo fecha
      var gl = zrGlifo(g.i, x, y);
      if (cheio) {
        var fg = ctx.uid('zf');
        o += '<radialGradient id="' + fg + '"><stop offset="0" style="stop-color:' + g.rgba(.42) + '"/><stop offset=".6" style="stop-color:' + g.rgba(.14) + '"/><stop offset="1" style="stop-color:' + g.rgba(.04) + '"/></radialGradient>' +
          '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (ri - 1) + '" style="fill:url(#' + fg + ')"/>' +
          '<g style="mix-blend-mode:screen"><path d="' + gl + '" style="fill:none;stroke:' + g.cor + '" stroke-width="4" stroke-linejoin="round" filter="url(#' + K.brilho + ')" opacity=".8"/>' +
          '<path d="' + gl + '" style="fill:none;stroke:' + g.cor + '" stroke-width="1.6" stroke-linejoin="round"/>' +
          '<path d="' + gl + '" style="fill:none;stroke:#fff" stroke-width=".6" stroke-linejoin="round" opacity=".9"/></g>';
      } else {
        o += '<path d="' + gl + '" style="fill:none;stroke:' + g.rgba(0.3) + '" stroke-width=".9" stroke-linejoin="round"/>';
      }
      return o;
    },
    center: function (ctx) {
      var K = ctx.k;
      return '<circle cx="230" cy="230" r="' + (ctx.r0 + 2) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.25)" stroke-width="4" filter="url(#' + K.brilho2 + ')"/>' +
        zrCentro(ctx, ZR2) +
        '<g style="mix-blend-mode:screen"><circle cx="230" cy="193" r="9" style="fill:rgba(var(--gold-rgb),.7)" filter="url(#' + K.brilho + ')"/>' +
        '<circle cx="230" cy="193" r="2.4" style="fill:#fff" opacity=".85" filter="url(#' + K.brilho2 + ')"/></g>';
    }
  };

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.zur2.legenda = { peca: "círculo", masc: true, texto: " é um critério: o arco se fecha em proporção à soma, as runas que ele cobre acendem, e o glifo do meio só acende no círculo cheio." };

  return MOTIVOS.zur2;
})();
