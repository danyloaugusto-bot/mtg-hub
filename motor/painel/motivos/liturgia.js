/* Motivo "liturgia" do gráfico de pontuação: 01. Vito (Sangria Sagrada), escolhido pelo dono na segunda rodada da votação de 15/10/2026.
   Veio do protótipo motivos/vito2.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "liturgia"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Vito, Sangria Sagrada, segunda rodada: emblemas de ouro e sangue sobre preto, ocupando o disco inteiro.
     vito3 Liturgia Sanguínea: em cada raio do emblema, um cálice de ouro de pé (boca para o aro) cujo sangue corre por
     um canal cavado no raio até o medalhão; o nível na taça e o comprimento do filete seguem a pontuação.
     vito4 Círculo da Drenagem: oito canais de ouro em redemoinho nascem no aro e puxam o sangue para o núcleo; o sangue
     avança no canal na proporção da pontuação.
     Coordenadas locais (vlT): x atravessa o raio, y é a distância ao centro (cresce para fora). */

  function vlT(am) { return 'translate(230 230) rotate(' + (am - 90).toFixed(2) + ')'; }
  function vlP(x, y) { return f1(x) + ' ' + f1(y); }
  function vlStops(st) {
    return st.map(function (x) { return '<stop offset="' + x[0] + '" style="stop-color:' + x[1] + (x[2] != null ? ';stop-opacity:' + x[2] : '') + '"/>'; }).join('');
  }
  function vlLin(id, v, st, ex) {
    return '<linearGradient id="' + id + '" x1="' + v[0] + '" y1="' + v[1] + '" x2="' + v[2] + '" y2="' + v[3] + '"' + (ex || '') + '>' + vlStops(st) + '</linearGradient>';
  }
  function vlRad(id, ex, st) { return '<radialGradient id="' + id + '" ' + ex + '>' + vlStops(st) + '</radialGradient>'; }
  // círculo como caminho (para anéis com fill-rule evenodd)
  function vlCirc(r, cx, cy) {
    cx = cx == null ? 230 : cx; cy = cy == null ? 230 : cy;
    return 'M' + f1(cx - r) + ' ' + f1(cy) + 'a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0Z';
  }
  // pontos do lado direito (x >= 0), de dentro para fora; o lado esquerdo é o espelho
  function vlSym(pts) {
    var s = 'M' + pts.map(function (p) { return vlP(p[0], p[1]); }).join('L');
    for (var i = pts.length - 1; i >= 0; i--) s += 'L' + vlP(-pts[i][0], pts[i][1]);
    return s + 'Z';
  }
  // degradê radial que faz um anel entre os raios a e b parecer roliço (ouro com bisel)
  function vlTorus(a, b, R) {
    function o(r) { return (r / R).toFixed(4); }
    var d = b - a;
    return [[o(a), '#241604'], [o(a + d * 0.16), '#86601f'], [o(a + d * 0.36), 'var(--gold2)'], [o(a + d * 0.46), '#fff8e0'],
      [o(a + d * 0.58), 'var(--gold)'], [o(a + d * 0.84), '#6a4813'], [o(b), '#1a1003']];
  }
  // estrela de brilho de quatro pontas
  function vlSpark(x, y, a, K, op) {
    var b = a * 0.18;
    return '<path d="M' + vlP(x, y - a) + 'L' + vlP(x + b, y - b) + 'L' + vlP(x + a, y) + 'L' + vlP(x + b, y + b) + 'L' + vlP(x, y + a) + 'L' + vlP(x - b, y + b) +
      'L' + vlP(x - a, y) + 'L' + vlP(x - b, y - b) + 'Z" style="fill:#fff" opacity="' + (op || 0.95) + '" filter="url(#' + K.glowS + ')"/>';
  }

  /* defs comuns: ouro, sangue, fumaça, filtros de bisel (luz do alto à esquerda, igual para todo o emblema) e de sangue úmido */
  function vlDefs(ctx) {
    var K = ctx.vl = {};
    'gA gV gRim gBez bead disc vig halo hot smoke clipD bev wet wetS glow glowS blH glass med rose'.split(' ').forEach(function (n) { K[n] = ctx.uid('vl' + n); });
    var GD = '#241604', GM = '#86601f', GH = '#fff8e0';
    var s = '';
    s += vlLin(K.gA, [0, 0, 1, 0], [[0, GD], [0.17, GM], [0.37, 'var(--gold)'], [0.49, 'var(--gold2)'], [0.55, GH], [0.63, 'var(--gold2)'], [0.82, '#7a5517'], [1, GD]]);
    s += vlLin(K.gV, [0, 0, 0, 1], [[0, GH], [0.22, 'var(--gold2)'], [0.5, 'var(--gold)'], [0.82, GM], [1, GD]]);
    s += vlRad(K.gRim, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="196"', vlTorus(180, 195, 196));
    s += vlRad(K.gBez, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="58"', vlTorus(48, 57, 58));
    s += vlRad(K.bead, 'cx=".36" cy=".32" r=".72"', [[0, GH], [0.3, 'var(--gold2)'], [0.62, 'var(--gold)'], [1, '#4a3009']]);
    // fundo: preto profundo, um vinho muito escuro no meio e vinheta na borda
    s += vlRad(K.disc, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="196"', [[0, '#170409'], [0.34, '#090103'], [0.68, '#020001'], [1, '#000']]);
    s += vlRad(K.vig, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="182"', [[0.55, '#000', 0], [0.9, '#000', 0.6], [1, '#000', 0.9]]);
    s += vlRad(K.halo, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="130"', [[0.3, 'var(--blood)', 0.3], [0.55, 'var(--blood)', 0.08], [1, 'var(--blood)', 0]]);
    s += vlRad(K.hot, '', [[0, '#ff3a4c', 0.6], [0.4, 'var(--blood)', 0.3], [1, 'var(--blood)', 0]]);
    s += vlRad(K.med, 'cx=".5" cy=".5" r=".5"', [[0, '#1d0609'], [0.72, '#080203'], [1, '#000']]);
    s += vlRad(K.rose, 'cx=".4" cy=".35" r=".75"', [[0, '#ff5262'], [0.5, 'var(--blood)'], [1, 'var(--wine)']]);
    s += vlLin(K.blH, [0, 0, 1, 0], [[0, '#1a0205'], [0.14, 'var(--wine)'], [0.34, 'var(--blood)'], [0.5, '#e3263b'], [0.62, 'var(--blood)'], [0.88, 'var(--wine)'], [1, '#1a0205']]);
    s += vlLin(K.glass, [0, 0, 1, 0], [[0, 'rgba(255,236,214,.2)'], [0.12, 'rgba(46,10,14,.8)'], [0.5, 'rgba(10,2,4,.94)'], [0.88, 'rgba(46,10,14,.82)'], [1, 'rgba(255,236,214,.14)']]);
    // fumaça vermelha (textura do fundo)
    s += '<filter id="' + K.smoke + '" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".011 .015" numOctaves="4" seed="11"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .03  0 0 0 0 .07  1.9 0 0 0 -.82"/></filter>';
    s += '<clipPath id="' + K.clipD + '"><circle cx="230" cy="230" r="181"/></clipPath>';
    // bisel do ouro: relevo a partir do contorno, luz do alto à esquerda (sombra difusa e realce especular)
    s += '<filter id="' + K.bev + '" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="b"/>' +
      '<feDiffuseLighting in="b" surfaceScale="3.2" diffuseConstant="1.3" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting>' +
      '<feSpecularLighting in="b" surfaceScale="3.2" specularConstant="1.1" specularExponent="20" lighting-color="#fff4d0" result="s"><feDistantLight azimuth="225" elevation="38"/></feSpecularLighting>' +
      '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="sh"/>' +
      '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
      '<feComposite in="sh" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".85" k4="0" result="lit"/>' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="sb"/><feOffset in="sb" dx="1.4" dy="2" result="so"/>' +
      '<feComponentTransfer in="so" result="sd"><feFuncA type="linear" slope=".75"/></feComponentTransfer>' +
      '<feMerge><feMergeNode in="sd"/><feMergeNode in="lit"/></feMerge></filter>';
    // sangue úmido: só o realce especular, mais concentrado
    s += '<filter id="' + K.wet + '" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="1.3" result="b"/>' +
      '<feSpecularLighting in="b" surfaceScale="2.6" specularConstant="1.2" specularExponent="34" lighting-color="#ffe9e9" result="s"><feDistantLight azimuth="225" elevation="42"/></feSpecularLighting>' +
      '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
      '<feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".9" k4="0"/></filter>';
    s += '<filter id="' + K.wetS + '" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="b"/>' +
      '<feSpecularLighting in="b" surfaceScale="2" specularConstant=".75" specularExponent="30" lighting-color="#ffe0e0" result="s"><feDistantLight azimuth="225" elevation="45"/></feSpecularLighting>' +
      '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
      '<feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".8" k4="0"/></filter>';
    s += '<filter id="' + K.glow + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>';
    s += '<filter id="' + K.glowS + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation=".9" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    return s;
  }

  /* palco comum: disco preto com fumaça vermelha, vinheta e o brilho de poder atrás do medalhão */
  function vlStageBase(ctx) {
    var K = ctx.vl;
    return '<circle cx="230" cy="230" r="196" style="fill:url(#' + K.disc + ')"/>' +
      '<g clip-path="url(#' + K.clipD + ')" opacity=".38"><rect x="40" y="40" width="380" height="380" filter="url(#' + K.smoke + ')"/></g>' +
      '<circle cx="230" cy="230" r="182" style="fill:url(#' + K.vig + ')"/>' +
      '<circle cx="230" cy="230" r="130" style="fill:url(#' + K.halo + ')"/>';
  }

  /* aro de ouro grosso: toro com bisel, filete interno e contas de ouro nos ângulos dados */
  function vlRim(ctx, beads) {
    var K = ctx.vl, o = '<g filter="url(#' + K.bev + ')">';
    o += '<path d="' + vlCirc(195) + vlCirc(180) + '" fill-rule="evenodd" style="fill:url(#' + K.gRim + ')"/>';
    o += '<path d="' + vlCirc(177) + vlCirc(174.2) + '" fill-rule="evenodd" style="fill:var(--gold)"/>';
    beads.forEach(function (b) {
      var p = pol(187.5, b[0]);
      o += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + b[1] + '" style="fill:url(#' + K.bead + ')"/>';
    });
    return o + '</g>' + '<circle cx="230" cy="230" r="195.4" style="fill:none;stroke:#000" stroke-opacity=".7" stroke-width=".8"/>';
  }

  /* medalhão comum: preto com bisel de ouro; o fio de sangue por dentro do aro acende onde o maior chega */
  function vlMedal(ctx, ang) {
    var K = ctx.vl, o = '';
    o += '<circle cx="230" cy="230" r="49" style="fill:url(#' + K.med + ')"/>';
    o += '<g filter="url(#' + K.bev + ')"><path d="' + vlCirc(57) + vlCirc(48.5) + '" fill-rule="evenodd" style="fill:url(#' + K.gBez + ')"/></g>';
    o += '<circle cx="230" cy="230" r="45.6" style="fill:none;stroke:var(--gold)" stroke-opacity=".45" stroke-width=".9"/>';
    if (ang != null) {
      var a0 = pol(47, ang - 34), a1 = pol(47, ang + 34), arc = 'M' + vlP(a0[0], a0[1]) + 'A47 47 0 0 1 ' + vlP(a1[0], a1[1]);
      o += '<path d="' + arc + '" style="fill:none;stroke:#ff2a40" stroke-width="5" stroke-linecap="round" opacity=".7" filter="url(#' + K.glow + ')"/>' +
        '<path d="' + arc + '" style="fill:none;stroke:var(--blood)" stroke-width="2.6" stroke-linecap="round"/>' +
        '<path d="' + arc + '" style="fill:none;stroke:#ff6b78" stroke-width=".9" stroke-linecap="round"/>';
    }
    return o;
  }

  /* a Dusk Rose pequena, em sangue e ouro; (x, y) = centro, s = escala (s = 1 dá uns 16 de largura) */
  function vlRose(x, y, s, K) {
    function T(d) { var n = 0; return d.replace(/-?\d*\.?\d+/g, function (v) { return f1((n++ % 2 ? y : x) + parseFloat(v) * s); }); }
    var ink = '#1a0a02', sw = f1(0.5 * s);
    return '<path d="' + T('M -1 6 C -4 7 -7 7.6 -9 6.2 C -7 4.8 -4 4.6 -1 6 Z') + '" style="fill:var(--gold);stroke:' + ink + '" stroke-width="' + sw + '"/>' +
      '<path d="' + T('M 1 6 C 4 7 7 7.6 9 6.2 C 7 4.8 4 4.6 1 6 Z') + '" style="fill:var(--gold);stroke:' + ink + '" stroke-width="' + sw + '"/>' +
      '<path d="' + T('M -6.6 -2.6 C -8.2 -6.4 -4.6 -8.8 -2.4 -7 C -1.2 -8.8 1.2 -8.8 2.4 -7 C 4.6 -8.8 8.2 -6.4 6.6 -2.6 C 4 0 -4 0 -6.6 -2.6 Z') + '" style="fill:url(#' + K.rose + ');stroke:var(--gold2)" stroke-width="' + sw + '"/>' +
      '<path d="' + T('M -7.2 -2.8 C -7.6 2.2 -4.6 5.6 0 5.8 C 4.6 5.6 7.6 2.2 7.2 -2.8 C 4.6 -0.4 -4.6 -0.4 -7.2 -2.8 Z') + '" style="fill:url(#' + K.rose + ');stroke:var(--gold2)" stroke-width="' + sw + '"/>' +
      '<path d="' + T('M -2.8 -2.4 C -3 -5.6 2.6 -6 3 -3 C 3.2 -1 0.4 -0.6 -0.2 -2.4 C -0.6 -3.6 1.2 -4 1.4 -3') + '" style="fill:none;stroke:var(--gold2)" stroke-width="' + f1(0.7 * s) + '" stroke-linecap="round"/>' +
      '<path d="' + T('M -4.6 1.2 C -3 3.4 3 3.4 4.6 1.2') + '" style="fill:none;stroke:var(--gold2)" stroke-width="' + f1(0.55 * s) + '" stroke-linecap="round" opacity=".8"/>';
  }

  /* ---------- vito3: Liturgia Sanguínea ---------- */
  /* Em coordenadas locais o centro fica "embaixo": o cálice está de pé no raio, com o pé para o centro e a boca para o aro.
     O sangue assenta no fundo da taça (lado do centro), desce pela haste e corre pelo canal cavado no raio até o medalhão. */

  // meia largura da taça em função da distância ao centro: fundo estreito em 134, boca larga em 174
  function vl3BowlW(r) { var t = Math.max(0, Math.min(1, (174 - r) / 40)); return 6 + 20 * Math.sqrt(1 - t * t) + 1.5 * Math.pow(1 - t, 3); }
  function vl3Bowl() {
    var L = [], Rr = [];
    for (var r = 134; r <= 174.01; r += 1.6) { var w = vl3BowlW(r); Rr.push(vlP(w, r)); L.unshift(vlP(-w, r)); }
    return 'M' + L.join('L') + 'L' + Rr.join('L') + 'Z';
  }
  function vl3Side(k) {          // contorno de um lado da taça (k = 1 direita, -1 esquerda), do fundo à boca
    var s = '';
    for (var r = 134; r <= 174.01; r += 1.6) s += (s ? 'L' : 'M') + vlP(k * vl3BowlW(r), r);
    return s;
  }
  function vl3Rib(k) {           // nervura da gaiola de ouro sobre o vidro
    var s = '';
    for (var r = 138; r <= 172.01; r += 2) s += (s ? 'L' : 'M') + vlP(k * 0.44 * vl3BowlW(r), r);
    return s;
  }
  // gota pendurada em (x, r0) que escorre para o centro: comprimento len, bulbo de raio w na ponta
  function vl3Drip(x, r0, len, w) {
    var c = r0 - len + w;
    return '<path d="M' + vlP(x - 0.45 * w, r0) + 'C' + vlP(x - 0.4 * w, r0 - 0.5 * len) + ' ' + vlP(x - w, c + w) + ' ' + vlP(x - w, c) +
      'A' + w + ' ' + w + ' 0 0 1 ' + vlP(x + w, c) + 'C' + vlP(x + w, c + w) + ' ' + vlP(x + 0.4 * w, r0 - 0.5 * len) + ' ' + vlP(x + 0.45 * w, r0) + 'Z"/>';
  }
  var VL3_HOLE = 'M-4.6 59A4.6 4.6 0 0 1 4.6 59L4.6 101L-4.6 101Z';   // canal cavado no raio, do pé do cálice ao medalhão
  var VL3_SPOKE = vlSym([[10, 50], [9.6, 61], [12.4, 62.6], [12.4, 67.4], [8.6, 69.4], [6.8, 80], [7.2, 93], [8.2, 99], [8.6, 101]]);
  var VL3_CALYX = 'M-16 140.4C-10 142.6 10 142.6 16 140.4C13 136.6 9 134.4 5.6 133.2L-5.6 133.2C-9 134.4 -13 136.6 -16 140.4Z';

  function vl3Defs(ctx) {
    var s = vlDefs(ctx), K = ctx.vl;
    K.clipBowl = ctx.uid('vlBowl'); K.clipHole = ctx.uid('vlHole');
    return s + '<clipPath id="' + K.clipBowl + '"><path d="' + vl3Bowl() + '"/></clipPath><clipPath id="' + K.clipHole + '"><path d="' + VL3_HOLE + '"/></clipPath>';
  }

  function vl3Stage(ctx) {
    var K = ctx.vl, o = vlStageBase(ctx);
    // faixa de inscrição: preto e vinho entre dois filetes de ouro, com traços de sangue
    o += '<path d="' + vlCirc(173) + vlCirc(163.5) + '" fill-rule="evenodd" style="fill:#0d0204"/>';
    o += '<circle cx="230" cy="230" r="168.3" style="fill:none;stroke:var(--blood)" stroke-opacity=".7" stroke-width="1" stroke-dasharray="5 3.2"/>';
    o += '<g filter="url(#' + K.bev + ')"><path d="' + vlCirc(164.6) + vlCirc(162.6) + '" fill-rule="evenodd" style="fill:var(--gold)"/></g>';
    o += '<circle cx="230" cy="230" r="118" style="fill:none;stroke:var(--blood)" stroke-opacity=".45" stroke-width="1.2"/>';
    // lâminas de ouro entre os raios
    o += '<g filter="url(#' + K.bev + ')">';
    for (var k = 0; k < 8; k++) {
      o += '<g transform="' + vlT(-90 + k * 45) + '"><path d="M0 66L3.8 114L0 158L-3.8 114Z" style="fill:url(#' + K.gA + ')"/>' +
        '<circle cx="0" cy="118" r="3" style="fill:url(#' + K.bead + ')"/><circle cx="0" cy="168.3" r="3" style="fill:url(#' + K.bead + ')"/></g>';
    }
    o += '</g>';
    var beads = [];
    for (var j = 0; j < 8; j++) beads.push([-90 + j * 45, 4.4]);
    return o + vlRim(ctx, beads);
  }

  function vl3Group(g, ctx) {
    var K = ctx.vl, T = vlT(g.am), f = Math.max(0, Math.min(1, g.frac)), o = '';
    var head = 99 - f * (99 - 59);                    // ponta do filete de sangue no canal (59 = encosta no medalhão)
    var lv = 141 + (0.12 + 0.88 * f) * 31;              // nível do sangue na taça (141 = fundo visível, 172 = boca)
    if (g.top) o += '<g transform="' + T + '"><ellipse cx="0" cy="138" rx="56" ry="55" style="fill:url(#' + K.hot + ')"/><ellipse cx="0" cy="150" rx="34" ry="34" style="fill:url(#' + K.hot + ')" opacity=".7"/></g>';
    // fundo do canal
    o += '<g transform="' + T + '"><path d="' + VL3_HOLE + '" style="fill:#070102"/></g>';
    // ouro de trás: ponta que fura o aro, raio com espinhos e canal, pé e haste
    o += '<g filter="url(#' + K.bev + ')"><g transform="' + T + '">' +
      '<path d="M0 166L11 183L0 195.4L-11 183Z" style="fill:url(#' + K.gA + ')"/>' +
      '<path d="' + VL3_SPOKE + VL3_HOLE + '" fill-rule="evenodd" style="fill:url(#' + K.gA + ')"/>' +
      '<path d="M6.6 76L16.8 70.5L6.9 86Z" style="fill:url(#' + K.gA + ')"/><path d="M-6.6 76L-16.8 70.5L-6.9 86Z" style="fill:url(#' + K.gA + ')"/>' +
      '<rect x="-3.2" y="108" width="6.4" height="27" rx="1.6" style="fill:url(#' + K.gA + ')"/>' +
      '<path d="M-17 99C-17 96.6 17 96.6 17 99C17 103.4 9.4 105.8 5.8 107.8C4.2 108.8 3.4 110.4 3.4 112L-3.4 112C-3.4 110.4 -4.2 108.8 -5.8 107.8C-9.4 105.8 -17 103.4 -17 99Z" style="fill:url(#' + K.gA + ')"/>' +
      '<rect x="-18" y="96.6" width="36" height="3.2" rx="1.6" style="fill:url(#' + K.gV + ')"/>' +
      '<ellipse cx="0" cy="113.4" rx="5.4" ry="2" style="fill:url(#' + K.gA + ')"/><ellipse cx="0" cy="131.2" rx="5.4" ry="2" style="fill:url(#' + K.gA + ')"/>' +
      '<ellipse cx="0" cy="122" rx="8.8" ry="6.4" style="fill:url(#' + K.gA + ')"/>' +
      '</g></g>';
    // a taça: vidro escuro e o sangue no nível da pontuação
    o += '<g transform="' + T + '"><path d="' + vl3Bowl() + '" style="fill:url(#' + K.glass + ')"/>' +
      '<g clip-path="url(#' + K.clipBowl + ')"><rect x="-30" y="132" width="60" height="' + f1(lv - 132) + '" style="fill:url(#' + K.blH + ')"/>' +
      '<ellipse cx="0" cy="' + f1(lv) + '" rx="' + f1(vl3BowlW(lv) - 0.3) + '" ry="2.6" style="fill:#c41a2e;stroke:#ff8a94" stroke-opacity=".5" stroke-width=".8"/></g>' +
      '<path d="M-21 168C-23.5 160 -22.5 150 -16 142" style="fill:none;stroke:#fff" stroke-opacity=".34" stroke-width="2" stroke-linecap="round"/></g>';
    // a gaiola de ouro da taça: lados, nervuras, cálice de folhas no fundo e a borda da boca
    o += '<g filter="url(#' + K.bev + ')"><g transform="' + T + '">' +
      '<path d="' + vl3Side(1) + vl3Side(-1) + '" style="fill:none;stroke:var(--gold)" stroke-width="4.2" stroke-linecap="round"/>' +
      '<path d="' + VL3_CALYX + '" style="fill:url(#' + K.gA + ')"/>' +
      '<rect x="-28.5" y="171.2" width="57" height="7.6" rx="3.6" style="fill:url(#' + K.gV + ')"/>' +
      '</g></g>';
    // a gema do nó, na cor do agrupamento
    o += '<g transform="' + T + '"><circle cx="0" cy="122" r="4.6" style="fill:#120a02"/><circle cx="0" cy="122" r="3.6" style="fill:' + g.cor + '"/>' +
      '<circle cx="-1.1" cy="121" r="1.15" style="fill:#fff" opacity=".85"/></g>';
    // o sangue drenado no canal
    var blood = '<g clip-path="url(#' + K.clipHole + ')"><rect x="-6" y="' + f1(head) + '" width="12" height="' + f1(103 - head) + '" style="fill:var(--blood)"/>' +
      '<circle cx="0" cy="' + f1(head) + '" r="4.6" style="fill:var(--blood)"/></g>';
    if (g.top) o += '<g transform="' + T + '" filter="url(#' + K.glow + ')" opacity=".95">' + blood.replace(/fill:var\(--blood\)/g, 'fill:#ff2438') + '</g>';
    o += '<g filter="url(#' + K.wet + ')"><g transform="' + T + '">' + blood +
      '<rect x="-2.2" y="' + f1(head) + '" width="4.4" height="' + f1(Math.max(0, 99 - head)) + '" rx="2.2" style="fill:#e8283e" opacity=".9"/>' +
      '</g></g>';
    o += '<g transform="' + T + '"><circle cx="-1.5" cy="' + f1(head + 0.4) + '" r="1.3" style="fill:#fff" opacity=".85"/>' +
      (head < 91 ? '<rect x="-3" y="' + f1(head + 3) + '" width="1" height="' + f1(96 - head - 3) + '" rx=".5" style="fill:#fff" opacity=".45"/>' : '') + '</g>';
    if (g.top) {
      // transborda: o sangue sobe acima da boca e escorre pelos lados de ouro, na direção do centro
      o += '<g filter="url(#' + K.wet + ')"><g transform="' + T + '" style="fill:var(--blood)">' +
        '<path d="M-28.4 174.6C-23 187 23 187 28.4 174.6C20 176.6 -20 176.6 -28.4 174.6Z"/>' +
        vl3Drip(-26.6, 176, 24, 2.7) + vl3Drip(26.2, 176, 15, 2.3) + vl3Drip(-13, 176, 8.5, 2) + vl3Drip(9, 176, 6.5, 1.8) +
        '<circle cx="-27.6" cy="145" r="1.9"/><circle cx="27.2" cy="153.5" r="1.5"/></g></g>';
      var sp = pol(176, g.am + 7), sp2 = pol(66, g.am);
      o += vlSpark(sp[0], sp[1], 8, K) + vlSpark(sp2[0], sp2[1], 5.5, K, 0.85);
    }
    return o;
  }

  function vl3Center(ctx) {
    var K = ctx.vl, top = null;
    ctx.groups.forEach(function (g) { if (g.top && !top) top = g; });
    return vlMedal(ctx, top ? top.am : null) + '<circle cx="230" cy="194" r="11" style="fill:url(#' + K.hot + ')" opacity=".55"/>' + vlRose(230, 194, 0.95, K);
  }

  MOTIVOS.vito3 = {
    deck: '01. Vito', nome: 'Liturgia Sanguínea',
    desc: 'Um emblema de ouro com oito raios; na ponta de cada raio, um cálice de ouro com sangue que desce pela haste e corre por um canal até o medalhão da Dusk Rose. Quanto maior a pontuação, mais cheio o cálice e mais longe o filete de sangue chega; o maior transborda, encosta no medalhão e brilha.',
    defs: vl3Defs, stage: vl3Stage, group: vl3Group, center: vl3Center
  };

  /* ---------- vito4: Círculo da Drenagem ---------- */
  /* Cada canal é uma espiral logarítmica que nasce no aro (ângulo do agrupamento, raio 160) e gira 85 graus até o núcleo
     (raio 54, sob o medalhão). O sangue enche o canal a partir do aro; o comprimento cheio é a fração da pontuação. */

  var VL4 = { rO: 160, rI: 54, SW: 85 };

  // pontos do canal, igualmente espaçados no comprimento: {x, y, tangente, normal, u (0 no aro, 1 no núcleo)}
  function vl4Path(am) {
    var N = 180, raw = [], L = [0], i;
    for (i = 0; i <= N; i++) {
      var s = i / N, r = VL4.rO * Math.pow(VL4.rI / VL4.rO, s), p = pol(r, am + VL4.SW * s);
      raw.push(p);
      if (i) L.push(L[i - 1] + Math.hypot(p[0] - raw[i - 1][0], p[1] - raw[i - 1][1]));
    }
    var tot = L[N], M = 140, pts = [], j = 0;
    for (var k = 0; k <= M; k++) {
      var d = tot * k / M;
      while (j < N - 1 && L[j + 1] < d) j++;
      var t = (d - L[j]) / (L[j + 1] - L[j] || 1);
      pts.push([raw[j][0] + (raw[j + 1][0] - raw[j][0]) * t, raw[j][1] + (raw[j + 1][1] - raw[j][1]) * t]);
    }
    return pts.map(function (p, k) {
      var a = pts[Math.max(0, k - 1)], b = pts[Math.min(M, k + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      return { x: p[0], y: p[1], tx: dx / l, ty: dy / l, nx: -dy / l, ny: dx / l, u: k / M };
    });
  }
  // ponto do canal num u qualquer (interpolado)
  function vl4At(P, u) {
    var M = P.length - 1, x = Math.max(0, Math.min(1, u)) * M, k = Math.min(M - 1, Math.floor(x)), t = x - k, a = P[k], b = P[k + 1];
    var tx = a.tx + (b.tx - a.tx) * t, ty = a.ty + (b.ty - a.ty) * t, l = Math.hypot(tx, ty) || 1;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, tx: tx / l, ty: ty / l, nx: -ty / l, ny: tx / l, u: u };
  }
  // fita ao longo do canal entre u0 e u1: meia largura wf(u), deslocamento lateral of(u), pontas redondas opcionais
  function vl4Rib(P, u0, u1, wf, of, capA, capB) {
    var M = P.length - 1, sel = [vl4At(P, u0)], Lf = [], Rt = [], d, q, ph;
    for (var k = 0; k <= M; k++) if (P[k].u > u0 + 1e-6 && P[k].u < u1 - 1e-6) sel.push(P[k]);
    sel.push(vl4At(P, u1));
    sel.forEach(function (p) {
      var w = wf(p.u), o = of ? of(p.u) : 0;
      Lf.push(vlP(p.x + p.nx * (o + w), p.y + p.ny * (o + w)));
      Rt.push(vlP(p.x + p.nx * (o - w), p.y + p.ny * (o - w)));
    });
    function cap(p, back) {
      var w = wf(p.u), o = of ? of(p.u) : 0, cx = p.x + p.nx * o, cy = p.y + p.ny * o, s = [];
      for (q = 1; q < 10; q++) {
        ph = Math.PI * q / 10;
        s.push(back ? vlP(cx + w * (-p.nx * Math.cos(ph) - p.tx * Math.sin(ph)), cy + w * (-p.ny * Math.cos(ph) - p.ty * Math.sin(ph)))
          : vlP(cx + w * (p.nx * Math.cos(ph) + p.tx * Math.sin(ph)), cy + w * (p.ny * Math.cos(ph) + p.ty * Math.sin(ph))));
      }
      return s;
    }
    d = 'M' + Rt[0] + (capA ? 'L' + cap(sel[0], true).join('L') : '') + 'L' + Lf.join('L');
    if (capB) d += 'L' + cap(sel[sel.length - 1], false).join('L');
    Rt.reverse();
    return d + 'L' + Rt.join('L') + 'Z';
  }
  // meia largura do canal: gota larga junto ao aro (12,4) que se afina num fio até o núcleo (3,6)
  function vl4W(u) { return 3.6 + 6.4 * Math.pow(1 - u, 1.3) + 2.6 * Math.exp(-Math.pow((u - 0.03) / 0.08, 2)); }

  function vl4Defs(ctx) { return vlDefs(ctx); }

  function vl4Stage(ctx) {
    var K = ctx.vl, o = vlStageBase(ctx), k;
    // o redemoinho: rastros de sangue escuro entre os canais, borrados
    o += '<g filter="url(#' + K.glowS + ')">';
    for (k = 0; k < 16; k++) {
      var P = vl4Path(-90 + k * 22.5 + 11.25);
      o += '<path d="' + vl4Rib(P, 0.02, 0.97, function (u) { return 0.4 + 1.6 * (1 - u); }) + '" style="fill:var(--blood)" opacity="' + (k % 2 ? 0.32 : 0.18) + '"/>';
    }
    o += '</g>';
    // faixa escura por dentro do aro, com filete de ouro e dentes de ouro (espinhos) virados para dentro
    o += '<path d="' + vlCirc(179) + vlCirc(169) + '" fill-rule="evenodd" style="fill:#0a0103"/>';
    o += '<g filter="url(#' + K.bev + ')"><path d="' + vlCirc(170.4) + vlCirc(168.2) + '" fill-rule="evenodd" style="fill:var(--gold)"/>';
    for (k = 0; k < 8; k++) {
      o += '<g transform="' + vlT(-90 + k * 45) + '"><path d="M-6 181L0 152L6 181Z" style="fill:url(#' + K.gA + ')"/></g>' +
        '<g transform="' + vlT(-90 + k * 45 + 12) + '"><path d="M-3 180L0 168L3 180Z" style="fill:url(#' + K.gA + ')"/></g>' +
        '<g transform="' + vlT(-90 + k * 45 - 12) + '"><path d="M-3 180L0 168L3 180Z" style="fill:url(#' + K.gA + ')"/></g>';
    }
    o += '</g>';
    var beads = [];
    for (k = 0; k < 8; k++) beads.push([-90 + k * 45, 4.6], [-90 + k * 45 + 12, 2.6], [-90 + k * 45 - 12, 2.6]);
    return o + vlRim(ctx, beads);
  }

  function vl4Group(g, ctx) {
    var K = ctx.vl, f = Math.max(0, Math.min(1, g.frac)), P = vl4Path(g.am), o = '';
    var wIn = function (u) { return vl4W(u); }, wOut = function (u) { return vl4W(u) + 4.6; };
    // calha escura e paredes de ouro do canal
    o += '<path d="' + vl4Rib(P, 0, 1, function (u) { return vl4W(u) + 0.4; }, null, true) + '" style="fill:#060102"/>';
    o += '<g filter="url(#' + K.bev + ')"><path d="' + vl4Rib(P, 0, 1, wOut, null, true) + vl4Rib(P, 0, 1, wIn, null, true) + '" fill-rule="evenodd" style="fill:var(--gold)"/></g>';
    // o sangue puxado do aro até a fração da pontuação: vinho nas bordas, sangue, miolo vivo e reflexo branco
    var wB = function (u) { return vl4W(u) - 0.6; };
    var body = vl4Rib(P, 0, f, wB, null, true, true);
    o += '<path d="' + body + '" style="fill:' + (g.top ? '#ff2438' : 'var(--blood)') + '" opacity="' + (g.top ? 0.95 : 0.4) + '" filter="url(#' + K.glow + ')"/>';
    o += '<g filter="url(#' + K.wetS + ')"><path d="' + body + '" style="fill:#3c050b"/>' +
      '<path d="' + vl4Rib(P, 0, f, function (u) { return wB(u) * 0.8; }, function (u) { return -wB(u) * 0.12; }, true, true) + '" style="fill:#a8121f"/>' +
      '<path d="' + vl4Rib(P, 0, f, function (u) { return wB(u) * 0.42; }, function (u) { return -wB(u) * 0.26; }, true, true) + '" style="fill:' + (g.top ? '#ff2a36' : '#d0161f') + '"/></g>';
    if (f > 0.1) o += '<path d="' + vl4Rib(P, 0.06, f - 0.05, function () { return 0.32; }, function (u) { return wB(u) * 0.42; }, true, true) + '" style="fill:#ff6a5e" opacity=".55"/>' +
      '<path d="' + vl4Rib(P, 0.12, f - 0.03, function () { return 0.28; }, function (u) { return wB(u) * 0.05; }, true, true) + '" style="fill:#ff8a7a" opacity=".45"/>';
    if (f > 0.06) o += '<path d="' + vl4Rib(P, 0.03, f - 0.02, function (u) { return 0.25 + wB(u) * 0.05; }, function (u) { return -wB(u) * 0.5; }, true, true) + '" style="fill:#fff" opacity=".45"/>';
    var h = vl4At(P, f), hw = wB(f);
    o += '<circle cx="' + f1(h.x + h.tx * hw * 0.3 - h.nx * hw * 0.4) + '" cy="' + f1(h.y + h.ty * hw * 0.3 - h.ny * hw * 0.4) + '" r="' + f1(Math.max(0.9, hw * 0.28)) + '" style="fill:#fff" opacity=".85"/>';
    // o engaste no aro, com a gema na cor do agrupamento
    o += '<g filter="url(#' + K.bev + ')"><g transform="' + vlT(g.am) + '"><path d="M0 165C5 168 10 171.5 12.6 175.6L18.6 173.4L15.4 180.6C15.8 187 9.4 193 0 195.6C-9.4 193 -15.8 187 -15.4 180.6L-18.6 173.4L-12.6 175.6C-10 171.5 -5 168 0 165Z" style="fill:url(#' + K.gA + ')"/></g></g>';
    var c = pol(183.6, g.am);
    o += '<circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="6" style="fill:#120a02"/><circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="4.7" style="fill:' + g.cor + '"/>' +
      '<circle cx="' + f1(c[0] - 1.3) + '" cy="' + f1(c[1] - 1.3) + '" r="1.3" style="fill:#fff" opacity=".85"/>';
    if (g.top) {
      var en = pol(60, g.am + VL4.SW * 0.985);
      o += '<circle cx="' + f1(en[0]) + '" cy="' + f1(en[1]) + '" r="16" style="fill:url(#' + K.hot + ')"/>';
      o += vlSpark(h.x, h.y, 6, K, 0.9) + vlSpark(c[0] + 6, c[1] - 6, 6, K, 0.9);
    }
    return o;
  }

  // o cálice pequeno de ouro no alto do medalhão (y de 186 a 202)
  function vl4Chalice(K) {
    return '<g filter="url(#' + K.bev + ')"><path d="M221.6 186.4L238.4 186.4C238.4 192.4 234.6 195.8 230 195.8C225.4 195.8 221.6 192.4 221.6 186.4Z" style="fill:url(#' + K.gA + ')"/>' +
      '<rect x="228.9" y="195" width="2.2" height="4.6" style="fill:var(--gold)"/><ellipse cx="230" cy="197.4" rx="2.6" ry="1.2" style="fill:var(--gold2)"/>' +
      '<path d="M224.6 202C225.6 199.8 227.6 199.2 230 199.2C232.4 199.2 234.4 199.8 235.4 202Z" style="fill:url(#' + K.gA + ')"/></g>' +
      '<ellipse cx="230" cy="187.6" rx="7.4" ry="1.5" style="fill:var(--blood);stroke:#ff6b78" stroke-width=".5"/>' +
      '<path d="M224.4 188.2C224.2 190.6 224.6 192 225.2 192.6" style="fill:none;stroke:#fff" stroke-opacity=".5" stroke-width=".9" stroke-linecap="round"/>';
  }

  function vl4Center(ctx) {
    var K = ctx.vl, top = null;
    ctx.groups.forEach(function (g) { if (g.top && !top) top = g; });
    var o = vlMedal(ctx, top ? top.am + VL4.SW : null);
    if (top) {   // o maior chega ao núcleo: brilho sobre o aro do medalhão no ponto de chegada
      var en = pol(55, top.am + VL4.SW);
      o += '<circle cx="' + f1(en[0]) + '" cy="' + f1(en[1]) + '" r="15" style="fill:url(#' + K.hot + ')"/>' + vlSpark(en[0], en[1], 7, K, 0.9);
    }
    return o + '<circle cx="230" cy="194" r="11" style="fill:url(#' + K.hot + ')" opacity=".5"/>' + vl4Chalice(K);
  }

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.vito3.legenda = { peca: "cálice", masc: true, texto: " é um agrupamento: o sangue drenado corre até o centro em proporção à soma das notas, e o maior transborda." };

  return MOTIVOS.vito3;
})();
