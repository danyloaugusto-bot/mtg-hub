/* Motivo "alquimia" do gráfico de pontuação: 02. Strefan (Baile Carmesim), escolhido pelo dono em 15/10/2026 a partir da
   opção 2 da votação do Edgar Markov, "Alquimia do Sangue". Veio do protótipo motivos/markov.js da votação, só com essa opção.
   O build inclui este arquivo apenas no painel cujo tema.json tem "grafico": "alquimia"; o motivoSvg do app.js monta a
   moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};
  var D2R = Math.PI / 180, VB = 'x="-58" y="-2" width="576" height="464"';
  function Pt(x, y) { return f1(x) + ' ' + f1(y); }
  function T(am) { return 'translate(230 230) rotate(' + (am - 90).toFixed(2) + ')'; }
  function S(am, x, y) { var t = (am - 90) * D2R, c = Math.cos(t), s = Math.sin(t); return [230 + x * c - y * s, 230 + x * s + y * c]; }
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function rnd(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
  function circ(r, cx, cy) {
    cx = cx == null ? 230 : cx; cy = cy == null ? 230 : cy;
    return 'M' + Pt(cx - r, cy) + 'a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(2 * r) + ' 0a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(-2 * r) + ' 0Z';
  }
  function poly(pts) { return 'M' + pts.map(function (p) { return Pt(p[0], p[1]); }).join('L') + 'Z'; }
  function sym(pts) {   // pontos do lado direito, de dentro para fora; o esquerdo é o espelho
    var a = pts.slice(), b = pts.slice().reverse().map(function (p) { return [-p[0], p[1]]; });
    return poly(a.concat(b));
  }
  function stops(st) { return st.map(function (x) { return '<stop offset="' + x[0] + '" style="stop-color:' + x[1] + (x[2] != null ? ';stop-opacity:' + x[2] : '') + '"/>'; }).join(''); }
  function lin(id, v, st, ex) { return '<linearGradient id="' + id + '" x1="' + v[0] + '" y1="' + v[1] + '" x2="' + v[2] + '" y2="' + v[3] + '"' + (ex ? ' ' + ex : '') + '>' + stops(st) + '</linearGradient>'; }
  function rad(id, ex, st) { return '<radialGradient id="' + id + '" ' + ex + '>' + stops(st) + '</radialGradient>'; }
  function blur(id, sd) { return '<filter id="' + id + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="' + sd + '"/></filter>'; }
  // metal/pedra com bisel: luz do alto à esquerda calculada sobre o contorno borrado, com sombra projetada opcional
  function metal(id, sd, alt, esp, expo, dif, k1, sh, lc) {
    return '<filter id="' + id + '" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="' + sd + '" result="b"/>' +
      '<feDiffuseLighting in="b" surfaceScale="' + alt + '" diffuseConstant="' + dif + '" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="42"/></feDiffuseLighting>' +
      '<feSpecularLighting in="b" surfaceScale="' + alt + '" specularConstant="' + esp + '" specularExponent="' + expo + '" lighting-color="' + (lc || '#fff') + '" result="s"><feDistantLight azimuth="225" elevation="52"/></feSpecularLighting>' +
      '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="' + k1 + '" k2="0" k3="0" k4="0" result="sh"/>' +
      '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
      '<feComposite in="sh" in2="s2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="m"/>' +
      '<feComposite in="m" in2="SourceAlpha" operator="in" result="lit"/>' +
      (sh ? '<feGaussianBlur in="SourceAlpha" stdDeviation="1.8" result="sb"/><feOffset in="sb" dx="1.3" dy="2" result="so"/>' +
        '<feComponentTransfer in="so" result="sd"><feFuncA type="linear" slope="' + sh + '"/></feComponentTransfer>' +
        '<feMerge><feMergeNode in="sd"/><feMergeNode in="lit"/></feMerge>' : '') + '</filter>';
  }
  function torus(a, b, R) {
    function o(r) { return (r / R).toFixed(4); }
    var d = b - a;
    return [[o(a), '#1a1004'], [o(a + d * .16), '#76551c'], [o(a + d * .36), '#e6c77e'], [o(a + d * .46), '#fff3cc'],
      [o(a + d * .58), '#c09a4e'], [o(a + d * .84), '#5a3f12'], [o(b), '#120a02']];
  }
  // brilho de quatro pontas
  function spark(x, y, a, op) {
    var b = a * .16;
    return '<path d="M' + Pt(x, y - a) + 'L' + Pt(x + b, y - b) + 'L' + Pt(x + a, y) + 'L' + Pt(x + b, y + b) + 'L' + Pt(x, y + a) + 'L' + Pt(x - b, y + b) +
      'L' + Pt(x - a, y) + 'L' + Pt(x - b, y - b) + 'Z" style="fill:#fff" opacity="' + (op || .95) + '"/><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(a * .16) + '" style="fill:#fff"/>';
  }
  // lado local (+1 = +x) voltado para a luz do alto à esquerda, num raio de ângulo am
  function lado(am) { return Math.cos(am * D2R) - Math.sin(am * D2R) > 0 ? 1 : -1; }
  function topo(ctx) { var t = null; ctx.groups.forEach(function (g) { if (g.top && !t) t = g; }); return t; }

  /* ---------- defs comuns ---------- */
  function base(ctx) {
    var K = ctx.mk = {};
    'bev bevF bevS glow glowS glowL smoke vig clipD hot gA gV gRim gBez bead med gemR ivo'.split(' ').forEach(function (k) { K[k] = ctx.uid('mk' + k); });
    var s = metal(K.bev, 1.4, 3.4, 1.2, 22, 1.15, 1.25, .75, '#fff6dc') + metal(K.bevF, .7, 2, 1.1, 18, 1.1, 1.2, .6, '#fff6dc') +
      metal(K.bevS, 1.3, 2.6, .16, 30, 1.05, 1.3, .8);
    s += blur(K.glow, 4) + blur(K.glowL, 10) +
      '<filter id="' + K.glowS + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation=".9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    s += '<filter id="' + K.smoke + '" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".011 .015" numOctaves="4" seed="17"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .03  0 0 0 0 .07  1.9 0 0 0 -.82"/></filter>';
    s += '<clipPath id="' + K.clipD + '"><circle cx="230" cy="230" r="194"/></clipPath>';
    s += rad(K.vig, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="194"', [[.55, '#000', 0], [.88, '#000', .55], [1, '#000', .9]]);
    s += rad(K.hot, '', [[0, '#ff3448', .7], [.4, 'var(--blood)', .32], [1, 'var(--blood)', 0]]);
    s += lin(K.gA, [0, 0, 1, 0], [[0, '#1a1004'], [.17, '#6b4c18'], [.36, '#b48a3c'], [.47, '#e6c77e'], [.53, '#fff3cc'], [.62, '#caa458'], [.82, '#6a4c1a'], [1, '#170e03']]);
    s += lin(K.gV, [0, 0, 0, 1], [[0, '#fff3cc'], [.25, '#e6c77e'], [.55, '#c09a4e'], [.85, '#6b4c18'], [1, '#1a1004']]);
    s += rad(K.gRim, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="196"', torus(190.4, 195.6, 196));
    s += rad(K.gBez, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="57"', torus(49, 56.6, 57));
    s += rad(K.bead, 'cx=".36" cy=".32" r=".72"', [[0, '#fff3cc'], [.3, '#e6c77e'], [.62, '#b48a3c'], [1, '#3a2608']]);
    s += rad(K.med, 'cx=".5" cy=".4" r=".62"', [[0, '#1c0a0e'], [.7, '#070304'], [1, '#000']]);
    s += rad(K.gemR, 'cx=".38" cy=".34" r=".7"', [[0, '#ffe0e3'], [.16, '#ff6b7a'], [.42, 'var(--blood2)'], [.72, 'var(--blood)'], [1, '#2a0308']]);
    s += lin(K.ivo, [0, 0, 1, 0], [[0, '#3e3326'], [.22, '#a8977a'], [.45, '#e8dcc4'], [.6, '#d6c7a8'], [.82, '#8a7a5e'], [1, '#342a1e']]);
    return s;
  }

  /* aro fino de ouro com losangos nas divisas e contas no meio de cada agrupamento */
  function rim(ctx) {
    var K = ctx.mk, o = '<circle cx="230" cy="230" r="196" style="fill:none;stroke:#000" stroke-width="1.2" stroke-opacity=".8"/>' +
      '<g filter="url(#' + K.bevF + ')"><path d="' + circ(195.6) + circ(190.4) + '" fill-rule="evenodd" style="fill:url(#' + K.gRim + ')"/>';
    for (var k = 0; k < ctx.NG; k++) {
      var a = -90 + k * ctx.step;
      o += '<g transform="' + T(a) + '"><path d="M0 186.6L3.4 191.6L0 196L-3.4 191.6Z" style="fill:url(#' + K.gA + ')"/></g>';
      var p = pol(193, a + ctx.step / 2);
      o += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="1.9" style="fill:url(#' + K.bead + ')"/>';
    }
    return o + '</g><circle cx="230" cy="230" r="188.2" style="fill:none;stroke:#c9a35a" stroke-width=".8" stroke-opacity=".5"/>';
  }

  /* o sigilo dos Markov: tridente de pontas afiadas, a do meio mais longa; 16 de altura centrado em (cx, cy) */
  var SIG = 'M0 -8.6L1.9 -3.2L1.15 2L-1.15 2L-1.9 -3.2Z' +
    'M-7.2 -5.8L-5.4 -1.3C-5 1.5 -3 3.4 0 3.6C3 3.4 5 1.5 5.4 -1.3L7.2 -5.8L4.1 -1.9C3.7 .3 2.3 1.4 0 1.5C-2.3 1.4 -3.7 .3 -4.1 -1.9Z' +
    'M-5.4 -1.3L-7.6 -.2L-5.2 .4ZM5.4 -1.3L7.6 -.2L5.2 .4Z' +
    'M-1.15 3.3L1.15 3.3L.95 6L0 8.6L-.95 6Z' + 'M-3.4 4.7L3.4 4.7L2.6 6.1L-2.6 6.1Z';
  function sigil(cx, cy, s, K, glow) {
    var tr = 'translate(' + f1(cx) + ' ' + f1(cy) + ') scale(' + s + ')';
    return (glow ? '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(12 * s) + '" style="fill:url(#' + K.hot + ')" opacity=".6"/>' : '') +
      '<path transform="translate(' + f1(cx + .6) + ' ' + f1(cy + 1) + ') scale(' + s + ')" d="' + SIG + '" style="fill:#000" opacity=".85"/>' +
      '<g filter="url(#' + K.bevF + ')"><path transform="' + tr + '" d="' + SIG + '" style="fill:url(#' + K.gV + ')"/></g>';
  }

  /* medalhão negro com aro de ouro e o sigilo no alto */
  function medal(ctx) {
    var K = ctx.mk;
    return '<circle cx="230" cy="230" r="58" style="fill:#000" opacity=".65"/>' +
      '<circle cx="230" cy="230" r="49.5" style="fill:url(#' + K.med + ')"/>' +
      '<g filter="url(#' + K.bevF + ')"><path d="' + circ(56.6) + circ(49) + '" fill-rule="evenodd" style="fill:url(#' + K.gBez + ')"/></g>' +
      '<circle cx="230" cy="230" r="46.4" style="fill:none;stroke:#c9a35a" stroke-opacity=".45" stroke-width=".8"/>' +
      sigil(230, 194, .93, K, true);
  }

  /* ponta de lança em flor-de-lis, base em y = 0 e ponta em y = 30 (usar dentro de T(am)) */
  var LZ = {
    blade: 'M0 2.4C4.4 6 6.4 11 6 15.4C5.4 21 2.4 26 0 30C-2.4 26 -5.4 21 -6 15.4C-6.4 11 -4.4 6 0 2.4Z',
    half: 'M0 2.4C4.4 6 6.4 11 6 15.4C5.4 21 2.4 26 0 30Z',
    pet: 'M2.6 3.4C6.4 5.2 11.4 9.6 12.8 3.4C13.4 .4 12.6 -2.2 11.4 -4.2C11.2 1.2 8.8 4.6 3.6 6.6Z',
    col: 'M-5.8 0H5.8V3.8H-5.8Z',
    foot: 'M-3.8 .2L3.8 .2L1.9 -2.6Q0 -3.8 -1.9 -2.6Z'
  };
  function headMetal(K) {
    return '<path d="' + LZ.pet + '" style="fill:url(#' + K.gA + ')"/><path d="' + LZ.pet + '" transform="scale(-1 1)" style="fill:url(#' + K.gA + ')"/>' +
      '<path d="' + LZ.blade + '" style="fill:url(#' + K.gA + ')"/><path d="' + LZ.foot + '" style="fill:url(#' + K.gA + ')"/>' +
      '<path d="' + LZ.col + '" style="fill:url(#' + K.gV + ')"/>';
  }
  function headFacets(am, op) {
    var sd = lado(am);
    return '<path d="' + LZ.half + '" transform="scale(' + sd + ' 1)" style="fill:#fff" opacity="' + (op || .22) + '"/>' +
      '<path d="' + LZ.half + '" transform="scale(' + -sd + ' 1)" style="fill:#000" opacity="' + (op || .22) + '"/>' +
      '<path d="M0 4L0 28.6" style="stroke:#fff8e0" stroke-width=".5" opacity=".7"/>';
  }


  /* ======================= markov2: Alquimia do Sangue ======================= */
  var M2 = { cy: 148, R: 23, lip: 104, nw: 5 };
  var M2Y = M2.cy - Math.sqrt(M2.R * M2.R - M2.nw * M2.nw);   // onde o gargalo encontra a esfera
  var M2FLASK = 'M' + Pt(-M2.nw, M2.lip) + 'L' + Pt(-M2.nw, M2Y) + 'A23 23 0 1 0 ' + Pt(M2.nw, M2Y) + 'L' + Pt(M2.nw, M2.lip) + 'Z';
  // símbolos alquímicos (traço), ~10 de altura, centrados em 0,0
  var GLIFOS = [
    'M4.5 0A4.5 4.5 0 1 1 -4.5 0A4.5 4.5 0 1 1 4.5 0ZM1 0A1 1 0 1 1 -1 0A1 1 0 1 1 1 0Z',                 // sol
    'M1.6 -4.8A5 5 0 1 0 1.6 4.8A3.8 3.8 0 1 1 1.6 -4.8Z',                                                 // lua
    'M-5 4.2L0 -4.6L5 4.2Z',                                                                               // fogo
    'M-5 -4.2L0 4.6L5 -4.2Z',                                                                              // água
    'M-5 4.2L0 -4.6L5 4.2ZM-3.2 1L3.2 1',                                                                  // ar
    'M-5 -4.2L0 4.6L5 -4.2ZM-3.2 -1L3.2 -1',                                                               // terra
    'M2.8 -1A2.8 2.8 0 1 1 -2.8 -1A2.8 2.8 0 1 1 2.8 -1ZM0 1.8L0 5.6M-2.2 3.8L2.2 3.8M-2.6 -5.6Q0 -3 2.6 -5.6', // mercúrio
    'M-3.6 -3.4L0 -6.4L3.6 -3.4L0 -.4ZM0 -.4L0 6M-2.6 3L2.6 3',                                            // enxofre
    'M4.4 0A4.4 4.4 0 1 1 -4.4 0A4.4 4.4 0 1 1 4.4 0ZM-4.4 0L4.4 0',                                       // sal
    'M-1.6 -5.6L-1.6 5M-3.6 -3.4L.6 -3.4M-1.6 -.6Q3.6 -2.6 3.4 1.6Q3.2 4.6 .8 5.6'                         // saturno
  ];
  function glifo(k, x, y, s, op, w) {
    return '<path transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s + ')" d="' + GLIFOS[k % GLIFOS.length] + '" style="fill:none;stroke:#c9a35a" stroke-width="' + f1((w || 1.2) / s) + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + (op || .7) + '"/>';
  }
  function m2Defs(ctx) {
    var s = base(ctx), K = ctx.mk;
    'disc flask blood tube bLin bEdge glass'.split(' ').forEach(function (k) { K[k] = ctx.uid('mk2' + k); });
    s += lin(K.bLin, [0, 0, 0, 1], [[0, '#ff5a66'], [.12, '#e3203a'], [.55, '#a8142a'], [1, '#3a030b']]);
    s += rad(K.bEdge, 'gradientUnits="userSpaceOnUse" cx="0" cy="148" r="23"', [[0, '#000', 0], [.62, '#000', 0], [.9, '#000', .35], [1, '#000', .7]]);
    s += rad(K.glass, 'gradientUnits="userSpaceOnUse" cx="0" cy="148" r="23"', [[0, '#2a060c', .2], [.78, '#2a060c', .34], [.96, '#ffe8e0', .14], [1, '#2a060c', .4]]);
    s += rad(K.disc, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="196"', [[0, '#22080d'], [.4, '#0e0306'], [.75, '#050102'], [1, '#000']]);
    s += '<clipPath id="' + K.flask + '"><path d="' + M2FLASK + '"/></clipPath>';
    s += rad(K.blood, 'gradientUnits="userSpaceOnUse" cx="-5" cy="152" r="30"', [[0, '#ff5d6a'], [.3, '#e3203a'], [.68, 'var(--blood)'], [1, '#33030a']]);
    s += lin(K.tube, [0, 0, 1, 0], [[0, '#5a0610'], [.4, '#e0263c'], [.6, '#ff5a66'], [1, '#5a0610']]);
    return s;
  }
  function m2Stage(ctx) {
    var K = ctx.mk, o = '<circle cx="230" cy="230" r="196" style="fill:url(#' + K.disc + ')"/>' +
      '<g clip-path="url(#' + K.clipD + ')" opacity=".34"><rect x="30" y="30" width="400" height="400" filter="url(#' + K.smoke + ')"/></g>';
    var g = '', k, a, p;
    // anéis gravados
    [[64, 1.1], [68.5, .7], [96, .8], [148, .7], [176, 1], [187.5, 0]].forEach(function (r) { if (r[1]) g += '<circle cx="230" cy="230" r="' + r[0] + '" style="fill:none;stroke:#c9a35a" stroke-width="' + r[1] + '"/>'; });
    // decagrama ligando os frascos
    var star = '';
    for (k = 0; k < ctx.NG; k++) { var p1 = pol(148, ctx.groups[k].am), p2 = pol(148, ctx.groups[(k + 3) % ctx.NG].am); star += 'M' + Pt(p1[0], p1[1]) + 'L' + Pt(p2[0], p2[1]); }
    g += '<path d="' + star + '" style="fill:none;stroke:#c9a35a" stroke-width=".7" opacity=".55"/>';
    // marcas entre os anéis internos
    var tk = '';
    for (k = 0; k < 60; k++) { a = -90 + k * 6; var q1 = pol(64, a), q2 = pol(k % 5 ? 66.5 : 68.5, a); tk += 'M' + Pt(q1[0], q1[1]) + 'L' + Pt(q2[0], q2[1]); }
    g += '<path d="' + tk + '" style="stroke:#c9a35a" stroke-width=".7"/>';
    o += '<g opacity=".42">' + g + '</g>';
    // faixa externa com símbolos pequenos
    var band = '';
    for (k = 0; k < 2 * ctx.NG; k++) { p = pol(182, -90 + k * ctx.step / 2 + ctx.step / 4); band += glifo(k + 3, p[0], p[1], .62, .55, 1); }
    o += band + '<circle cx="230" cy="230" r="178.4" style="fill:none;stroke:#c9a35a" stroke-width=".9" opacity=".55"/>';
    // medalhões de símbolos entre os frascos
    for (k = 0; k < ctx.NG; k++) {
      a = -90 + k * ctx.step; p = pol(150, a);
      o += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="10.5" style="fill:#0a0304;stroke:#c9a35a" stroke-width=".9" opacity=".9"/>' +
        '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="8.6" style="fill:none;stroke:#c9a35a" stroke-width=".5" opacity=".6"/>' +
        glifo(k, p[0], p[1], .95, .9, 1.25);
      var q = pol(108, a);
      o += glifo(k + 5, q[0], q[1], .7, .55, 1);
    }
    o += '<circle cx="230" cy="230" r="194" style="fill:url(#' + K.vig + ')"/>';
    return o + rim(ctx);
  }
  function m2Group(g, ctx) {
    var K = ctx.mk, f = clamp(g.frac), tr = T(g.am), o = '';
    var yb = M2.cy + M2.R, yt = M2Y, yl = yb - f * (yb - yt);
    if (g.top) o += '<g transform="' + tr + '"><circle cx="0" cy="146" r="46" style="fill:url(#' + K.hot + ')"/></g>';
    // tubo de vidro com sangue, do medalhão ao gargalo, com um bulbo no meio
    o += '<g transform="' + tr + '">' +
      '<rect x="-3.2" y="54" width="6.4" height="' + f1(M2.lip - 54) + '" rx="2" style="fill:rgba(255,236,226,.08);stroke:rgba(255,236,226,.42)" stroke-width=".8"/>' +
      '<circle cx="0" cy="80" r="6.6" style="fill:rgba(255,236,226,.08);stroke:rgba(255,236,226,.42)" stroke-width=".8"/>' +
      '<g filter="url(#' + K.glow + ')" opacity="' + (g.top ? .9 : .45) + '"><rect x="-2" y="55" width="4" height="' + f1(M2.lip - 54) + '" style="fill:#ff2438"/><circle cx="0" cy="80" r="5.2" style="fill:#ff2438"/></g>' +
      '<rect x="-1.9" y="55" width="3.8" height="' + f1(M2.lip - 54) + '" style="fill:url(#' + K.tube + ')"/>' +
      '<circle cx="0" cy="80" r="5.3" style="fill:url(#' + K.blood + ')"/>' +
      '<circle cx="-.4" cy="66" r=".8" style="fill:#ffb0b8" opacity=".8"/><circle cx=".5" cy="93" r=".6" style="fill:#ffb0b8" opacity=".7"/>' +
      '</g>';
    // frasco: vidro de trás, sangue no nível da pontuação, menisco
    var mw = Math.sqrt(Math.max(0, M2.R * M2.R - (yl - M2.cy) * (yl - M2.cy)));
    o += '<g transform="' + tr + '"><path d="' + M2FLASK + '" style="fill:url(#' + K.glass + ')"/>' +
      '<g clip-path="url(#' + K.flask + ')">' +
      (g.top ? '<rect x="-8" y="' + f1(M2.lip) + '" width="16" height="' + f1(yl - M2.lip + 1) + '" style="fill:url(#' + K.blood + ')"/>' : '') +
      (g.top ? '' : (function () {   // gotas pingando do gargalo até a superfície, com a onda onde caem
        var d = '<path d="M-2.6 ' + f1(M2.lip) + 'Q0 ' + f1(M2.lip + 4.4) + ' 2.6 ' + f1(M2.lip) + 'Z" style="fill:#c8182e"/>', n = Math.max(1, Math.floor((yl - M2.lip - 8) / 11));
        for (var q = 1; q <= n; q++) { var y = M2.lip + 4 + q * (yl - M2.lip - 6) / (n + 1); d += '<path d="M0 ' + f1(y - 2.6) + 'Q1.5 ' + f1(y + .4) + ' 0 ' + f1(y + 1.4) + 'Q-1.5 ' + f1(y + .4) + ' 0 ' + f1(y - 2.6) + 'Z" style="fill:#e3203a"/>'; }
        return d + '<ellipse cx="0" cy="' + f1(yl + .3) + '" rx="4" ry="1.2" style="fill:none;stroke:#ff9aa4" stroke-width=".6" opacity=".8"/>';
      })()) +
      '<g filter="url(#' + K.glow + ')" opacity="' + (g.top ? .9 : .5) + '"><rect x="-26" y="' + f1(yl) + '" width="52" height="' + f1(yb + 2 - yl) + '" style="fill:#ff2438"/></g>' +
      '<rect x="-26" y="' + f1(yl) + '" width="52" height="' + f1(yb + 2 - yl) + '" style="fill:url(#' + K.bLin + ')"/>' +
      '<rect x="-26" y="' + f1(yl) + '" width="52" height="' + f1(yb + 2 - yl) + '" style="fill:url(#' + K.bEdge + ')"/>' +
      (mw > 2 && !g.top ? '<ellipse cx="0" cy="' + f1(yl) + '" rx="' + f1(mw) + '" ry="2.2" style="fill:#ff4d5c;stroke:#ff9aa4" stroke-width=".6" stroke-opacity=".7"/>' : '') +
      '</g>' +
      '<path d="' + M2FLASK + '" style="fill:none;stroke:rgba(255,236,226,.5)" stroke-width="1.4"/>' +
      '<path d="' + M2FLASK + '" style="fill:none;stroke:rgba(0,0,0,.5)" stroke-width=".6" transform="translate(0 0)"/></g>';
    // reflexos do vidro (na tela, com a luz do alto à esquerda), evitando o gargalo
    var c = S(g.am, 0, M2.cy), neck = (g.am + 180) % 360, hl = '';
    function arc(r, a0, a1) {
      var s = '', n = 0;
      for (var a = a0; a <= a1 + .01; a += 4) {
        var dd = Math.abs((((a - neck) % 360) + 540) % 360 - 180);
        if (dd < 20) { n = 0; continue; }
        s += (n++ ? 'L' : 'M') + Pt(c[0] + r * Math.cos(a * D2R), c[1] + r * Math.sin(a * D2R));
      }
      return s;
    }
    hl += '<path d="' + arc(M2.R - 3.2, 196, 262) + '" style="fill:none;stroke:#fff" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>' +
      '<path d="' + arc(M2.R - 2.4, 20, 72) + '" style="fill:none;stroke:#fff" stroke-width="1.2" stroke-linecap="round" opacity=".22"/>' +
      '<ellipse cx="' + f1(c[0] - 8.5) + '" cy="' + f1(c[1] - 9.5) + '" rx="3.2" ry="2" transform="rotate(-40 ' + f1(c[0] - 8.5) + ' ' + f1(c[1] - 9.5) + ')" style="fill:#fff" opacity=".85"/>';
    o += hl;
    // ouro: berço do frasco, colar do gargalo com a gema do agrupamento, anel do tubo no medalhão
    o += '<g filter="url(#' + K.bev + ')"><g transform="' + tr + '">' +
      '<path d="' + (function () { var s = '', r = M2.R + 2; for (var a = 36; a <= 144; a += 6) s += (s ? 'L' : 'M') + Pt(r * Math.cos(a * D2R), M2.cy + r * Math.sin(a * D2R)); return s; })() + '" style="fill:none;stroke:#c9a35a" stroke-width="2.2"/>' +
      '<path d="M-14.6 165.4L-19.4 162.2L-17.6 168.6ZM14.6 165.4L19.4 162.2L17.6 168.6Z" style="fill:url(#' + K.gA + ')"/>' +
      '<path d="M-11 171L-14.4 179L-9.6 178ZM11 171L14.4 179L9.6 178ZM-2.4 173L0 180.4L2.4 173Z" style="fill:url(#' + K.gA + ')"/><circle cx="0" cy="175.4" r="2" style="fill:url(#' + K.bead + ')"/>' +
      '<rect x="-7.6" y="' + f1(M2.lip - 3) + '" width="15.2" height="5" rx="1.6" style="fill:url(#' + K.gV + ')"/>' +
      '<rect x="-5" y="57" width="10" height="3.6" rx="1.2" style="fill:url(#' + K.gV + ')"/>' +
      '</g></g>';
    var gp = S(g.am, 0, M2.lip - .5);
    o += '<circle cx="' + f1(gp[0]) + '" cy="' + f1(gp[1]) + '" r="2.8" style="fill:#120a02"/><circle cx="' + f1(gp[0]) + '" cy="' + f1(gp[1]) + '" r="2.1" style="fill:' + g.cor + '"/>' +
      '<circle cx="' + f1(gp[0] - .7) + '" cy="' + f1(gp[1] - .7) + '" r=".7" style="fill:#fff" opacity=".85"/>';
    if (g.top) {   // transborda: escorre por fora do vidro e pinga para o aro
      var dr = '<g filter="url(#' + K.glowS + ')"><g transform="' + tr + '" style="fill:#e3203a">';
      [[-1, 34, 2.1], [1, 58, 1.8], [-1, 76, 1.6]].forEach(function (d) {
        var r = M2.R + .9, a0 = -90 + d[0] * 13, a1 = -90 + d[0] * (13 + d[1]), s = '';
        for (var a = a0; d[0] > 0 ? a <= a1 : a >= a1; a += d[0] * 3) s += (s ? 'L' : 'M') + Pt(r * Math.cos(a * D2R), M2.cy + r * Math.sin(a * D2R));
        dr += '<path d="' + s + '" style="fill:none;stroke:#e3203a" stroke-width="' + f1(d[2] * 1.1) + '" stroke-linecap="round"/>';
        dr += '<circle cx="' + f1(r * Math.cos(a1 * D2R)) + '" cy="' + f1(M2.cy + r * Math.sin(a1 * D2R)) + '" r="' + f1(d[2] * 1.1) + '"/>';
      });
      dr += '<ellipse cx="0" cy="' + f1(M2.lip - 1) + '" rx="6.4" ry="2" /><circle cx="-6" cy="181" r="1.4"/><circle cx="5" cy="183.6" r="1.1"/></g></g>';
      o += dr;
      var sp = S(g.am, -9, M2.cy - 10);
      o += spark(sp[0], sp[1], 7) + spark(c[0] + 10, c[1] + 12, 4.5, .8);
    }
    return o;
  }
  MOTIVOS.markov2 = {
    deck: '01. Markov', nome: 'Alquimia do Sangue',
    desc: 'Um círculo alquímico gravado em ouro, com um frasco redondo de vidro em cada agrupamento, ligado ao medalhão por um tubo de vidro cheio de sangue. O nível do sangue no frasco segue a pontuação; o maior fica cheio até o gargalo, transborda e brilha.',
    defs: m2Defs, stage: m2Stage, group: m2Group, center: medal
  };
  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.markov2.legenda = { peca: "frasco", masc: true, texto: " é um agrupamento: o sangue sobe nele com a soma das notas, e o mais cheio transborda." };

  return MOTIVOS.markov2;
})();
