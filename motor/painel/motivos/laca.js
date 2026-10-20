/* Motivo "laca" do gráfico de pontuação: 02. Evelyn, rebranding do lote 2, variação A (Leque laqueado) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "laca"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "leque" do gráfico de pontuação: 02. Evelyn (Coleção da Cobiça). Protótipo do rebranding, lote 2, variação A.
   Leque brisé laqueado: cada critério é uma lâmina rígida de laca preta, com filete de ouro na borda e por dentro, presa
   no rebite do centro (o medalhão com o colar de pérolas). A lâmina estende com a soma (linear, mínimo de 12%) e termina
   numa ponteira escalonada art déco de esmalte, a única parte na cor do critério, que acende com o kit de luz. */
var MOTIVO_PAINEL = (function () {
  var X0 = 36, RB = 62, RE = 184;
  function f1(n) { return (+n).toFixed(1); }
  function P(x, y) { return f1(x) + ' ' + f1(y); }
  function cl(f) { return Math.max(0.12, Math.min(1, f)); }
  function raio(f) { return RB + (RE - RB) * cl(f); }
  function w(x) { return 2.4 + 0.2 * x; }
  function rot(a) { return 'translate(230 230) rotate(' + f1(a) + ')'; }
  function poly(pts) { return 'M' + pts.map(function (p) { return P(p[0], p[1]); }).join('L') + 'Z'; }

  /* a lâmina até L: corpo de laca (de X0 até o colar), colar de ouro e ponteira em degraus (zigurate) até a ponta */
  function lamina(L) {
    var T = Math.max(14, Math.min(32, 0.26 * (L - RB) + 9)), xs = L - T, ws = w(xs), c0 = xs + 2.6;
    var wc = ws * 0.96, s1 = c0 + (L - c0) * 0.4, s2 = c0 + (L - c0) * 0.7, w2 = wc * 0.66, w3 = wc * 0.36;
    var capPts = [[c0, -wc], [s1, -wc], [s1, -w2], [s2, -w2], [s2, -w3], [L, 0], [s2, w3], [s2, w2], [s1, w2], [s1, wc], [c0, wc]];
    var corpo = poly([[X0, -w(X0)], [xs, -ws], [xs, ws], [X0, w(X0)]]);
    var colar = poly([[xs - 0.6, -ws - 1], [c0 + 0.4, -ws - 1], [c0 + 0.4, ws + 1], [xs - 0.6, ws + 1]]);
    var tudo = poly([[X0, -w(X0)], [xs, -ws], [xs, -ws - 1], [c0, -ws - 1]].concat(capPts.slice(0, 6), capPts.slice(6), [[c0, ws + 1], [xs, ws + 1], [xs, ws], [X0, w(X0)]]));
    var e = 2.5, filete = 'M' + P(X0, -w(X0) + e) + 'L' + P(xs - 3, -ws + e) + 'L' + P(xs - 3, ws - e) + 'L' + P(X0, w(X0) - e);
    /* núcleo da ponteira: a aresta viva no eixo, do primeiro degrau à ponta */
    var nucleo = poly([[c0 + 2, -1.1], [s2, -0.9], [L - 2.2, 0], [s2, 0.9], [c0 + 2, 1.1]]);
    var brilhoSup = poly([[c0 + 1.2, -wc + 1], [s1 - 1, -wc + 1], [s1 - 1, -wc + 2.6], [c0 + 1.2, -wc + 2.6]]);
    return { L: L, T: T, xs: xs, ws: ws, c0: c0, s1: s1, s2: s2, wc: wc, cap: poly(capPts), corpo: corpo, colar: colar, tudo: tudo, filete: filete, nucleo: nucleo, brilhoSup: brilhoSup };
  }

  var ids;
  function defs(ctx) {
    var o = ctx.kit.defs(ctx, 'lq');
    ids = { laca: ctx.uid('lqL'), ouro: ctx.uid('lqO'), ouroR: ctx.uid('lqR'), bisel: ctx.uid('lqB'), chao: ctx.uid('lqC'), disco: ctx.uid('lqD'),
      gl: ctx.uid('lqG'), gl2: ctx.uid('lqH'), sombra: ctx.uid('lqS'), perola: ctx.uid('lqP') };
    /* brilhos em coordenadas locais da lâmina (o grupo gira em volta do centro): região folgada nos dois sentidos */
    var reg = ' filterUnits="userSpaceOnUse" x="-300" y="-300" width="600" height="600"';
    o += '<filter id="' + ids.gl + '"' + reg + '><feGaussianBlur stdDeviation="5"/></filter>' +
      '<filter id="' + ids.gl2 + '"' + reg + '><feGaussianBlur stdDeviation="1.8"/></filter>' +
      '<filter id="' + ids.sombra + '"' + reg + '><feGaussianBlur stdDeviation="2.4"/></filter>';
    /* laca preta: atravessa a lâmina com um reflexo estreito junto de uma borda */
    o += '<linearGradient id="' + ids.laca + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3542"/><stop offset=".14" stop-color="#16131b"/>' +
      '<stop offset=".3" stop-color="#5d5666"/><stop offset=".36" stop-color="#1a171f"/><stop offset=".7" stop-color="#08070a"/><stop offset="1" stop-color="#1d1a22"/></linearGradient>' +
      '<linearGradient id="' + ids.ouro + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c6"/><stop offset=".4" stop-color="#d4ae5c"/><stop offset=".75" stop-color="#8f6a26"/><stop offset="1" stop-color="#4f3a12"/></linearGradient>' +
      '<radialGradient id="' + ids.ouroR + '" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#fff6da"/><stop offset=".45" stop-color="#d4ae5c"/><stop offset="1" stop-color="#5a4214"/></radialGradient>' +
      /* bisel do esmalte: claro na aresta de cima, escuro na de baixo */
      '<linearGradient id="' + ids.bisel + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".3" stop-color="#fff" stop-opacity=".06"/>' +
      '<stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>' +
      '<radialGradient id="' + ids.chao + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1d1922"/><stop offset=".6" stop-color="#110f15"/><stop offset="1" stop-color="#07060a"/></radialGradient>' +
      '<radialGradient id="' + ids.disco + '" cx="230" cy="218" r="62" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#26222c"/><stop offset=".7" stop-color="#121016"/><stop offset="1" stop-color="#060508"/></radialGradient>' +
      '<radialGradient id="' + ids.perola + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fffdf6"/><stop offset=".5" stop-color="#e9dfcb"/><stop offset="1" stop-color="#8f8576"/></radialGradient>';
    return o;
  }

  /* palco: disco de laca com aro duplo de ouro e cravos em losango entre as lâminas */
  function stage(ctx) {
    var o = '', Rd = ctx.R + 10, n = ctx.NG, i;
    o += '<circle cx="230" cy="230" r="' + Rd + '" style="fill:url(#' + ids.chao + ')" filter="url(#' + ctx.k.textura + ')"/>' +
      '<circle cx="230" cy="230" r="' + Rd + '" fill="none" stroke="#d4ae5c" stroke-opacity=".7" stroke-width="1.4"/>' +
      '<circle cx="230" cy="230" r="' + (Rd - 4.5) + '" fill="none" stroke="#d4ae5c" stroke-opacity=".35" stroke-width=".7"/>';
    for (i = 0; i < n; i++) {
      var b = -90 + i * 360 / n;
      o += '<g transform="' + rot(b) + '"><path d="M' + P(Rd - 2.2, 0) + 'L' + P(Rd + 0.2, -2.6) + 'L' + P(Rd + 2.6, 0) + 'L' + P(Rd + 0.2, 2.6) + 'Z" fill="url(#' + ids.ouroR + ')" stroke="#4f3a12" stroke-width=".4"/>' +
        '</g>';
    }
    return o;
  }

  function group(g, ctx) {
    var K = ctx.kit, L = raio(g.frac), b = lamina(L), cheia = lamina(RE), cg = ctx.uid('lqF'), o = '<g transform="' + rot(g.am) + '">';
    /* fantasma: a lâmina cheia, só o contorno em ouro tracejado */
    if (g.frac < 0.98) o += '<g opacity=".24"><path d="' + cheia.tudo + '" fill="url(#' + ids.laca + ')"/><path d="' + cheia.tudo + '" fill="none" stroke="#d4ae5c" stroke-width="1" stroke-dasharray="2.6 2.4"/></g>';
    /* sombra no disco */
    o += '<path d="' + b.tudo + '" fill="#000" opacity=".7" transform="translate(2.4 2.4)" filter="url(#' + ids.sombra + ')"/>';
    /* corpo de laca com textura, filete de ouro na borda e por dentro */
    o += '<path d="' + b.corpo + '" fill="url(#' + ids.laca + ')" filter="url(#' + ctx.k.textura + ')"/>' +
      '<path d="' + b.corpo + '" fill="none" stroke="url(#' + ids.ouro + ')" stroke-width="1.3" stroke-linejoin="miter"/>' +
      '<path d="' + b.filete + '" fill="none" stroke="#e8cf8e" stroke-opacity=".7" stroke-width=".6"/>';
    /* gravação: raios finos de ouro que convergem para o rebite, como as varetas de um leque */
    var gv = '', xr = b.xs - 4;
    if (xr - RB > 10) {
      [-0.62, -0.31, 0, 0.31, 0.62].forEach(function (k) { gv += 'M' + P(RB + 2, k * (w(RB + 2) - 3)) + 'L' + P(xr, k * (b.ws - 3)); });
      o += '<path d="' + gv + '" stroke="#e8cf8e" stroke-opacity=".42" stroke-width=".55" fill="none"/>';
    }
    if (b.xs - RB > 40) {
      var vx = b.xs - 12;
      o += '<path d="M' + P(vx - 4.5, 0) + 'L' + P(vx, -2.6) + 'L' + P(vx + 4.5, 0) + 'L' + P(vx, 2.6) + 'Z" fill="url(#' + ids.ouroR + ')" stroke="#4f3a12" stroke-width=".4"/>';
    }
    /* colar de ouro entre a laca e a ponteira */
    o += '<path d="' + b.colar + '" fill="url(#' + ids.ouro + ')" stroke="#4f3a12" stroke-width=".4"/>';
    /* a ponteira acesa: brilho difuso na cor, esmalte com textura, profundidade, bisel, núcleo e reflexo */
    var fx = b.c0 + (L - b.c0) * 0.35;
    o += '<radialGradient id="' + cg + '" gradientUnits="userSpaceOnUse" cx="' + f1(fx) + '" cy="' + f1(-b.wc * 0.35) + '" r="' + f1(Math.max(12, b.T)) + '">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>' +
      '<linearGradient id="' + cg + 'x" gradientUnits="userSpaceOnUse" x1="' + f1(b.c0) + '" y1="0" x2="' + f1(L) + '" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></linearGradient>';
    o += '<g style="mix-blend-mode:screen"><path d="' + b.cap + '" style="fill:' + g.rgba(.95) + ';stroke:' + g.rgba(.9) + '" stroke-width="7" stroke-linejoin="round" opacity="' + (g.top ? 1 : .7) + '" filter="url(#' + ids.gl + ')"/>' +
      (g.top ? '<circle cx="' + f1(L - 4) + '" cy="0" r="' + f1(b.wc + 10) + '" style="fill:' + g.rgba(.4) + '" filter="url(#' + ids.gl + ')"/>' : '') + '</g>' +
      '<path d="' + b.cap + '" style="fill:' + g.cor + '" filter="url(#' + ctx.k.textura + ')"/>' +
      '<path d="' + b.cap + '" fill="url(#' + cg + 'x)"/>' +
      '<path d="' + b.cap + '" fill="url(#' + cg + ')"/>' +
      '<path d="' + b.cap + '" fill="url(#' + ids.bisel + ')"/>' +
      '<path d="M' + P(b.s1, -b.wc) + 'L' + P(b.s1, b.wc) + 'M' + P(b.s2, -b.wc * 0.66) + 'L' + P(b.s2, b.wc * 0.66) + '" stroke="#000" stroke-opacity=".35" stroke-width=".9"/>' +
      '<g style="mix-blend-mode:screen"><path d="' + b.nucleo + '" fill="#fff" opacity=".9"/>' +
      '<path d="M' + P(b.c0 + 2, 0) + 'L' + P(L - 2, 0) + '" stroke="#fff" stroke-width="2.6" opacity=".45" filter="url(#' + ids.gl2 + ')"/>' +
      '<path d="' + b.brilhoSup + '" fill="#fff" opacity=".35"/></g>' +
      '<path d="' + b.cap + '" fill="none" stroke="#f1dc9f" stroke-width=".9" stroke-linejoin="miter"/>';
    /* a mais alta ganha um brilho em estrela na ponta */
    if (g.top) {
      var sx = L, s = 7;
      o += '<g style="mix-blend-mode:screen"><path d="M' + P(sx, -s) + 'L' + P(sx + 1.1, -1.1) + 'L' + P(sx + s, 0) + 'L' + P(sx + 1.1, 1.1) + 'L' + P(sx, s) + 'L' + P(sx - 1.1, 1.1) + 'L' + P(sx - s, 0) + 'L' + P(sx - 1.1, -1.1) + 'Z" fill="#fff" opacity=".9"/>' +
        '<circle cx="' + f1(sx) + '" cy="0" r="2.2" fill="#fff"/></g>';
    }
    return o + '</g>';
  }

  /* o rebite do leque: medalhão de laca com aro de ouro e o colar de pérolas da Evelyn por cima das bases das lâminas */
  function center(ctx) {
    var o = '<circle cx="230" cy="232" r="60" fill="#000" opacity=".55" filter="url(#' + ctx.k.brilho2 + ')"/>' +
      '<circle cx="230" cy="230" r="57" fill="url(#' + ids.disco + ')" stroke="url(#' + ids.ouro + ')" stroke-width="2.2"/>' +
      '<circle cx="230" cy="230" r="52.5" fill="none" stroke="#d4ae5c" stroke-opacity=".4" stroke-width=".7"/>';
    var n = 40, k;
    for (k = 0; k < n; k++) {
      var t = (k * 360 / n - 90) * Math.PI / 180, x = 230 + 60.6 * Math.cos(t), y = 230 + 60.6 * Math.sin(t);
      o += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="2.55" fill="url(#' + ids.perola + ')" stroke="#000" stroke-opacity=".35" stroke-width=".4"/>';
    }
    return o;
  }

  return {
    defs: defs, stage: stage, group: group, center: center, raio: raio,
    legenda: { peca: 'lâmina', masc: false, texto: ' do leque é um critério: a lâmina estende com a soma, e a ponteira acende na cor do critério.' }
  };
})();
