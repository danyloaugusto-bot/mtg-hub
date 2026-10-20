/* Motivo "lunar" do gráfico de pontuação: 02. Lobos, rebranding do lote 2, variação B (Floresta) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "lunar"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Protótipo do rebranding, 02. Lobos (Lua da Matilha), lote 2: luas de verdade.
   Cada critério é uma lua prateada, com mares e crateras (a mesma face em todas, como a Lua real), e a parte acesa vai de
   nova a cheia com a soma: a área acesa é a fração (regra C, mínimo de 12%), e o terminador anda em linha reta do lado de
   dentro para o de fora, então raio(f) marca onde ele cruza o eixo da lua. A cor do critério fica só no halo e no brilho do
   lado aceso; o disco escuro mostra a luz cinérea. Variações: A, anel de luas no céu estrelado, com as três garras no centro;
   B, luas grandes sobre a floresta vista de baixo, com nuvens e um lobo uivando no penhasco; C, a lua cheia do Tovolar no
   centro, com o placar, e as dez fases em órbita, acesas pelo lado que olha para ela. */
var MOTIVO_PAINEL = (function () {
  var V = 'B';
  var CFG = { A: { MRC: 124, MR: 33 }, B: { MRC: 135, MR: 39 }, C: { MRC: 140, MR: 29 } }[V];
  var MRC = CFG.MRC, MR = CFG.MR, RIN = MRC - MR, I;
  function f1(n) { return (+n).toFixed(1); }
  function cl(f) { return Math.max(0.12, Math.min(1, f)); }
  /* onde o terminador cruza o eixo da lua: linear na fração, do limbo de dentro (nova) ao de fora (cheia) */
  function raio(f) { return RIN + 2 * MR * cl(f); }
  function suave(P) {
    var n = P.length, o, i;
    function m(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
    var s = m(P[n - 1], P[0]); o = 'M' + f1(s[0]) + ' ' + f1(s[1]);
    for (i = 0; i < n; i++) { var q = m(P[i], P[(i + 1) % n]); o += 'Q' + f1(P[i][0]) + ' ' + f1(P[i][1]) + ' ' + f1(q[0]) + ' ' + f1(q[1]); }
    return o + 'Z';
  }
  function mancha(K, cx, cy, rx, ry, amp, sd) {
    K.sorte(sd); var P = [], n = 11;
    for (var k = 0; k < n; k++) { var t = k / n * 2 * Math.PI, w = 1 + (K.sorte() - 0.5) * 2 * amp; P.push([cx + Math.cos(t) * rx * w, cy + Math.sin(t) * ry * w]); }
    return suave(P);
  }
  /* a parte acesa: limbo do lado de dentro (voltado para o centro do gráfico) e terminador elíptico; ângulo a = direção para fora */
  function fase(cx, cy, r, f, a) {
    var t = a * Math.PI / 180, c = Math.cos(t), s = Math.sin(t), rx = Math.abs(1 - 2 * f) * r;
    var top = [cx + r * s, cy - r * c], bot = [cx - r * s, cy + r * c];
    if (f >= 0.999) return 'M' + f1(top[0]) + ' ' + f1(top[1]) + 'A' + r + ' ' + r + ' 0 1 0 ' + f1(bot[0]) + ' ' + f1(bot[1]) + 'A' + r + ' ' + r + ' 0 1 0 ' + f1(top[0]) + ' ' + f1(top[1]) + 'Z';
    return 'M' + f1(top[0]) + ' ' + f1(top[1]) + 'A' + f1(r) + ' ' + f1(r) + ' 0 0 0 ' + f1(bot[0]) + ' ' + f1(bot[1]) +
      'A' + f1(rx) + ' ' + f1(r) + ' ' + f1(a) + ' 0 ' + (f < 0.5 ? 1 : 0) + ' ' + f1(top[0]) + ' ' + f1(top[1]) + 'Z';
  }

  /* a face da Lua em coordenadas de raio 100: mares (Procellarum, Imbrium, Serenitatis, Tranquillitatis, Crisium...),
     planaltos claros no sul, crateras e os raios de Tycho */
  function superficie(K) {
    var mares = [[-58, -2, 24, 44, .16], [-44, 26, 20, 20, .2], [-26, -36, 26, 23, .14], [-8, -66, 38, 7, .2], [14, -36, 15, 14, .12], [33, -8, 20, 16, .22],
      [67, -24, 9, 12, .1], [55, 14, 11, 17, .2], [36, 31, 9, 9, .2], [-14, 34, 17, 12, .22], [-46, 41, 9, 9, .15], [-12, -8, 10, 7, .25], [4, -14, 8, 6, .25], [-90, 2, 6, 9, .2]];
    var o = '<g style="fill:#262a31" opacity=".62" filter="url(#' + I.mar + ')">';
    mares.forEach(function (m, k) { o += '<path d="' + mancha(K, m[0], m[1], m[2], m[3], m[4], 900 + k) + '"/>'; });
    o += '</g><g style="fill:#262a31" opacity=".25" filter="url(#' + I.mar + ')">';
    mares.forEach(function (m, k) { if (k % 3 === 0) o += '<path d="' + mancha(K, m[0] + 6, m[1] + 4, m[2] * 0.55, m[3] * 0.5, .3, 950 + k) + '"/>'; });
    o += '</g><g style="fill:#fff" opacity=".2" filter="url(#' + I.mar + ')"><ellipse cx="18" cy="62" rx="44" ry="26"/><ellipse cx="-34" cy="74" rx="26" ry="14"/><ellipse cx="70" cy="44" rx="16" ry="22"/></g>';
    // crateras pequenas nos planaltos: fundo escuro, borda clara
    K.sorte(990); var cr = '', bo = '';
    for (var k = 0; k < 34; k++) {
      var a = K.sorte() * 2 * Math.PI, d = Math.sqrt(K.sorte()) * 94, x = Math.cos(a) * d, y = Math.sin(a) * d * 0.95 + 18 * K.sorte(), r = 1.6 + K.sorte() * K.sorte() * 5.5;
      if (Math.hypot(x, y) > 96 - r) continue;
      cr += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '"/>';
      bo += '<circle cx="' + f1(x - r * 0.18) + '" cy="' + f1(y - r * 0.18) + '" r="' + f1(r * 0.92) + '"/>';
    }
    o += '<g style="fill:none;stroke:#fff" stroke-width="1" opacity=".2">' + bo + '</g><g style="fill:#30343b" opacity=".45">' + cr + '</g>';
    // Tycho com os raios, Copérnico, Kepler e Aristarco claros; Platão e Grimaldi escuros
    var ty = [-12, 70], ra = '';
    K.sorte(995);
    for (k = 0; k < 14; k++) { var aa = K.sorte() * 2 * Math.PI, L = 22 + K.sorte() * 70; ra += 'M' + ty[0] + ' ' + ty[1] + 'L' + f1(ty[0] + Math.cos(aa) * L) + ' ' + f1(ty[1] + Math.sin(aa) * L); }
    o += '<path d="' + ra + '" style="fill:none;stroke:#fff" stroke-width="1.6" opacity=".14" filter="url(#' + I.mar + ')"/>' +
      '<g style="fill:#fff">' + [[-12, 70, 4.2, .75], [-30, -14, 4.6, .55], [-52, -8, 3, .5], [-62, -22, 2.4, .8]].map(function (c) {
        return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + (c[2] * 2.2).toFixed(1) + '" opacity="' + (c[3] * 0.25).toFixed(2) + '"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" opacity="' + c[3] + '"/>';
      }).join('') + '</g>' +
      '<circle cx="-12" cy="70" r="2.2" style="fill:#555a62"/><circle cx="-30" cy="-14" r="2.4" style="fill:#5b6068" opacity=".8"/>' +
      '<ellipse cx="-12" cy="-57" rx="6" ry="4.5" style="fill:#2a2e35" opacity=".7"/><ellipse cx="-86" cy="4" rx="5" ry="8" style="fill:#2a2e35" opacity=".6"/>';
    return o;
  }

  /* uma lua: halo na cor do critério, disco escuro com a luz cinérea, a parte acesa (máscara de borda macia, recortada
     pelo limbo nítido) em prata com a face e a textura, e o aro fantasma */
  function lua(ctx, cx, cy, r, f, a, cor, rgba, opt) {
    opt = opt || {};
    var K = ctx.kit, s = (r / 100).toFixed(4), T = 'translate(' + f1(cx) + ' ' + f1(cy) + ') scale(' + s + ')', mk = ctx.uid('lm'), cp = ctx.uid('lc');
    var ph = fase(cx, cy, r, f, a), o = '';
    if (cor) {
      o += '<g style="mix-blend-mode:screen">' +
        (opt.topo ? '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r + 12) + '" style="fill:' + rgba(.32) + '" filter="url(#' + ctx.k.brilho + ')"/>' : '') +
        '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r + 3.5) + '" style="fill:none;stroke:' + cor + '" stroke-width="5" filter="url(#' + ctx.k.brilho + ')" opacity="' + (0.35 + 0.4 * f).toFixed(2) + '"/>' +
        '<path d="' + fase(cx, cy, r + (V === 'B' ? 6 : 4), f, a) + '" style="fill:' + cor + '" filter="url(#' + ctx.k.brilho + ')" opacity="' + (V === 'B' ? 1 : .9) + '"/>' +
        '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r + 1.2) + '" style="fill:none;stroke:' + rgba(.55) + '" stroke-width="1"/></g>';
    }
    o += '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '" fill="url(#' + I.escuro + ')"' + (opt.opaca ? '' : ' opacity=".9"') + '/>' +
      '<use href="#' + I.face + '" transform="' + T + '" opacity=".5"/>' +
      '<mask id="' + mk + '"><path d="' + ph + '" style="fill:#fff" filter="url(#' + I.macio + ')"/></mask>' +
      '<clipPath id="' + cp + '"><circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '"/></clipPath>' +
      '<g clip-path="url(#' + cp + ')"><g mask="url(#' + mk + ')">' +
      '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '" fill="url(#' + I.prata + ')" filter="url(#' + ctx.k.textura + ')"/>' +
      '<use href="#' + I.face + '" transform="' + T + '"/>' +
      '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '" fill="url(#' + I.limbo + ')"/></g></g>' +
      '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '" style="fill:none;stroke:rgba(225,232,245,.2)" stroke-width=".9"/>';
    return o;
  }

  /* o lobo sentado uivando, de perfil para a esquerda e o focinho para o alto, em caixa 13..99 x 0..100 (base em y = 100) */
  var LOBO = [[18.4, 3.2], [24.3, 4.7], [28.1, 10.8], [32, 16.9], [36, 17.6], [43.3, 8.8], [44.4, 13.6], [43.3, 20.8], [45.5, 25], [49, 28], [48.5, 31], [53, 34], [58, 40], [64, 50],
    [70, 60], [76, 70], [80, 80], [81, 90], [85, 93], [93, 94], [99, 98], [92, 100], [74, 100], [58, 100], [55, 97], [48, 97], [45, 100], [26, 100], [23, 98], [27, 95], [28, 86],
    [27, 75], [23, 65], [21, 55], [20, 48], [23, 45], [21, 41], [24, 37], [22, 31], [20.2, 23.7], [17.7, 17.1], [13.8, 11], [21, 12], [15.8, 6.4]];
  function lobo(x, y, h, espelho) {
    var s = h / 100;
    return 'M' + LOBO.map(function (p) { return f1(x + (espelho ? -1 : 1) * (p[0] - 56) * s) + ' ' + f1(y + (p[1] - 100) * s); }).join('L') + 'Z';
  }
  /* pinheiro visto de baixo: base na borda (raio rb), ponta para o centro (raio rb - h) */
  function pinheiro(K, a, rb, h, w) {
    var n = 5, Lt = [], Rt = [], k;
    Lt.push(K.pt(a, rb + 2, -1.6)); Rt.push(K.pt(a, rb + 2, 1.6));
    for (k = 0; k < n; k++) {
      var u0 = h * (0.12 + 0.8 * k / n), ww = w * (1 - k / n * 0.78), u1 = u0 + h * 0.8 / n * 0.95;
      Lt.push(K.pt(a, rb - u0, -ww * 0.3), K.pt(a, rb - u0 - 1, -ww), K.pt(a, rb - u1, -ww * 0.28));
      Rt.push(K.pt(a, rb - u0, ww * 0.3), K.pt(a, rb - u0 - 1, ww), K.pt(a, rb - u1, ww * 0.28));
    }
    var tip = K.pt(a, rb - h, 0);
    return K.d(Lt.concat([tip]).concat(Rt.reverse()), true);
  }
  function estrelas(K, n, r0, r1, sd) {
    K.sorte(sd); var o = '', b = '';
    for (var k = 0; k < n; k++) {
      var p = K.pt(K.sorte() * 360, r0 + Math.sqrt(K.sorte()) * (r1 - r0)), rr = 0.35 + K.sorte() * K.sorte() * 1.1, op = 0.25 + K.sorte() * 0.6;
      o += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + f1(rr) + '" opacity="' + op.toFixed(2) + '"/>';
      if (rr > 1.05) b += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + f1(rr * 3) + '"/>';
    }
    return '<g style="fill:#dfe8f5" opacity=".5" filter="url(#' + I.macio + ')">' + b + '</g><g style="fill:#f2f5fb">' + o + '</g>';
  }
  function garras() {
    // três rasgos de garra no alto do centro, um por lobo da condição da noite: lente fina na diagonal, borda de luar embaixo
    var o = '';
    [-14, 0, 14].forEach(function (dx) {
      var L = [], Rr = [], n = 10, x0 = 221 + dx, y0 = 180, x1 = 238 + dx, y1 = 205;
      for (var k = 0; k <= n; k++) {
        var t = k / n, x = x0 + (x1 - x0) * t + Math.sin(t * Math.PI) * 2, y = y0 + (y1 - y0) * t, w = 2.3 * Math.sin(t * Math.PI) + 0.2;
        L.push([x - w, y + w * 0.4]); Rr.unshift([x + w, y - w * 0.4]);
      }
      var c = 'M' + L.concat(Rr).map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') + 'Z';
      o += '<path d="' + c + '" style="fill:rgba(214,224,240,.4)" transform="translate(.9 .6)"/><path d="' + c + '" style="fill:#020305"/>';
    });
    return o;
  }

  return {
    raio: raio,
    legenda: { peca: "lua", masc: false, texto: " é um critério: a parte acesa cresce com a soma, de nova a cheia, e o halo tem a cor do critério." },
    defs: function (ctx) {
      var K = ctx.kit, o = K.defs(ctx, 'lua');
      I = { face: ctx.uid('luF'), recorte: ctx.uid('luR'), mar: ctx.uid('luM'), macio: ctx.uid('luS'), prata: ctx.uid('luP'), escuro: ctx.uid('luE'), limbo: ctx.uid('luL'),
        ceu: ctx.uid('luC'), nuvem: ctx.uid('luN'), centro: ctx.uid('luZ'), coroa: ctx.uid('luK'), veu: ctx.uid('luV'), via: ctx.uid('luW') };
      o += '<filter id="' + I.mar + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>' +
        '<filter id="' + I.macio + '" x="-60%" y="-30%" width="220%" height="160%"><feGaussianBlur stdDeviation=".9"/></filter>' +
        '<clipPath id="' + I.recorte + '"><circle r="99"/></clipPath>' +
        '<radialGradient id="' + I.prata + '" cx=".46" cy=".44" r=".58"><stop offset="0" stop-color="#fdfcf7"/><stop offset=".5" stop-color="#e6e4dc"/><stop offset=".86" stop-color="#c3c2bb"/><stop offset="1" stop-color="#9d9c97"/></radialGradient>' +
        '<radialGradient id="' + I.limbo + '" cx=".5" cy=".5" r=".5"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a1d24" stop-opacity=".35"/></radialGradient>' +
        '<radialGradient id="' + I.escuro + '" cx=".42" cy=".4" r=".62"><stop offset="0" stop-color="#2a3240"/><stop offset=".75" stop-color="#171d27"/><stop offset="1" stop-color="#0c1017"/></radialGradient>' +
        '<g id="' + I.face + '" clip-path="url(#' + I.recorte + ')">' + superficie(K) + '</g>';
      if (V === 'A') {
        o += '<radialGradient id="' + I.ceu + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#121924"/><stop offset=".7" stop-color="#0b1018"/><stop offset="1" stop-color="#151d2a"/></radialGradient>' +
          '<radialGradient id="' + I.centro + '" cx="230" cy="222" r="58" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1c2532"/><stop offset=".8" stop-color="#0d1219"/><stop offset="1" stop-color="#070a0f"/></radialGradient>' +
          '<filter id="' + I.via + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="11" result="n"/>' +
          '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .75  0 0 0 0 .8  0 0 0 0 .9  0 0 0 1.4 -.5"/><feComposite in2="SourceGraphic" operator="in"/></filter>';
      } else if (V === 'B') {
        o += '<radialGradient id="' + I.ceu + '" cx="230" cy="230" r="198" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0a0f17"/><stop offset=".6" stop-color="#121a27"/><stop offset=".88" stop-color="#26324a"/><stop offset="1" stop-color="#3a4258"/></radialGradient>' +
          '<filter id="' + I.nuvem + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .028" numOctaves="4" seed="7" result="n"/>' +
          '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .58  0 0 0 0 .64  0 0 0 0 .74  0 0 0 2.1 -.95"/><feComposite in2="SourceGraphic" operator="in"/></filter>' +
          '<radialGradient id="' + I.centro + '" cx="230" cy="226" r="58" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1b2433"/><stop offset=".85" stop-color="#0c1119"/><stop offset="1" stop-color="#06090d"/></radialGradient>';
      } else {
        o += '<radialGradient id="' + I.ceu + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1d2635"/><stop offset=".45" stop-color="#101722"/><stop offset="1" stop-color="#0a0e15"/></radialGradient>' +
          '<radialGradient id="' + I.coroa + '" cx="230" cy="230" r="190" gradientUnits="userSpaceOnUse"><stop offset=".3" stop-color="#e8ecf4" stop-opacity=".22"/><stop offset=".55" stop-color="#c8d2e2" stop-opacity=".07"/><stop offset="1" stop-color="#c8d2e2" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="' + I.veu + '" cx="230" cy="236" r="66" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0b1017" stop-opacity=".82"/><stop offset=".62" stop-color="#0b1017" stop-opacity=".62"/><stop offset="1" stop-color="#0b1017" stop-opacity=".05"/></radialGradient>';
      }
      return o;
    },
    stage: function (ctx) {
      var K = ctx.kit, R = ctx.R, o = '';
      if (V === 'A') {
        o += '<circle cx="230" cy="230" r="' + (R + 12) + '" fill="url(#' + I.ceu + ')"/>' +
          '<g transform="rotate(-32 230 230)"><ellipse cx="230" cy="230" rx="' + (R + 6) + '" ry="46" fill="#fff" filter="url(#' + I.via + ')" opacity=".16"/></g>' +
          estrelas(K, 90, 64, R + 8, 31) +
          '<circle cx="230" cy="230" r="' + MRC + '" style="fill:none;stroke:rgba(var(--gold-rgb),.2)" stroke-width="1" stroke-dasharray="1 6" stroke-linecap="round"/>' +
          '<circle cx="230" cy="230" r="' + (R + 12) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.38)" stroke-width="1.2"/>' +
          '<circle cx="230" cy="230" r="' + (R + 7) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.14)" stroke-width="1"/>';
      } else if (V === 'B') {
        o += '<circle cx="230" cy="230" r="' + (R + 12) + '" fill="url(#' + I.ceu + ')"/>' + estrelas(K, 70, 60, R - 10, 41) +
          '<circle cx="230" cy="230" r="' + (R + 6) + '" fill="#fff" filter="url(#' + I.nuvem + ')" opacity=".55"/>';
        // a floresta vista de baixo: duas fileiras de pinheiros com a ponta para o céu (o centro)
        var tras = '', frente = '', k;
        K.sorte(61);
        for (k = 0; k < 46; k++) { var a = k * 360 / 46 + (K.sorte() - 0.5) * 4; tras += pinheiro(K, a, R + 10, 30 + K.sorte() * 24, 7 + K.sorte() * 3); }
        for (k = 0; k < 38; k++) { var b = k * 360 / 38 + 4 + (K.sorte() - 0.5) * 5; frente += pinheiro(K, b, R + 12, 18 + K.sorte() * 16, 6 + K.sorte() * 2.5); }
        o += '<path d="' + tras + '" style="fill:#0d1520"/><path d="' + frente + '" style="fill:#05080d"/>' +
          '<circle cx="230" cy="230" r="' + (R + 12) + '" style="fill:none;stroke:#05080d" stroke-width="3"/>' +
          '<circle cx="230" cy="230" r="' + (R + 13.5) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.3)" stroke-width="1"/>';
      } else {
        o += '<circle cx="230" cy="230" r="' + (R + 12) + '" fill="url(#' + I.ceu + ')"/>' + estrelas(K, 70, 110, R + 8, 51) +
          '<circle cx="230" cy="230" r="' + (R + 12) + '" fill="url(#' + I.coroa + ')"/>';
        // raios de luar saindo da lua cheia, entre as órbitas
        var rl = '';
        for (var j = 0; j < 20; j++) { var aj = j * 18 + 9; rl += 'M' + K.d([K.pt(aj - 1.6, 72), K.pt(aj, R + 4), K.pt(aj + 1.6, 72)], true).slice(1); }
        o += '<path d="' + rl + '" style="fill:#dfe6f2" opacity=".06" filter="url(#' + ctx.k.brilho + ')"/>' +
          '<circle cx="230" cy="230" r="' + MRC + '" style="fill:none;stroke:rgba(220,228,242,.22)" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round"/>' +
          '<circle cx="230" cy="230" r="' + (R + 12) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.36)" stroke-width="1.2"/>';
      }
      return o;
    },
    group: function (g, ctx) {
      var p = ctx.kit.pt(g.am, MRC), f = cl(g.frac);
      var top = g.frac >= Math.max.apply(null, ctx.groups.map(function (x) { return x.frac; }));
      return lua(ctx, p[0], p[1], MR, f, g.am, g.cor, g.rgba, { topo: top });
    },
    center: function (ctx) {
      var K = ctx.kit, o = '';
      if (V === 'A') {
        o += '<circle cx="230" cy="230" r="62" style="fill:none;stroke:rgba(214,224,240,.18)" stroke-width="6" filter="url(#' + ctx.k.brilho2 + ')"/>' +
          '<circle cx="230" cy="230" r="56" fill="url(#' + I.centro + ')"/>' +
          '<circle cx="230" cy="230" r="56" style="fill:none;stroke:rgba(var(--gold-rgb),.7)" stroke-width="1.4"/>' +
          '<circle cx="230" cy="230" r="51" style="fill:none;stroke:rgba(var(--gold-rgb),.2)" stroke-width="1"/>' + garras();
      } else if (V === 'B') {
        o += '<circle cx="230" cy="230" r="60" style="fill:#000" opacity=".5" filter="url(#' + ctx.k.brilho + ')"/>' +
          '<circle cx="230" cy="230" r="56" fill="url(#' + I.centro + ')"/>' +
          '<circle cx="230" cy="230" r="56" style="fill:none;stroke:rgba(var(--gold-rgb),.6)" stroke-width="1.4"/>' + garras();
        // o penhasco com o lobo uivando, embaixo, entre os rótulos
        var pen = 'M180 462L186 452L191 449L196 443L204 441L209 437L218 436L226 434L236 435L243 438L250 437L258 441L266 440L272 446L279 450L284 462Z', lb = lobo(222, 437, 44) + lobo(266, 442, 30, true);
        o += '<path d="' + lb + '" style="fill:none;stroke:rgba(220,230,245,.5)" stroke-width="1.6" filter="url(#' + ctx.k.brilho2 + ')"/>' +
          '<path d="' + pen + '" style="fill:#04070b;stroke:rgba(220,230,245,.22)" stroke-width=".8"/>' +
          '<path d="' + lb + '" style="fill:#04070b"/>';
      } else {
        // a lua cheia do Tovolar com o placar: velada no meio para o número ler
        o += '<circle cx="230" cy="230" r="70" style="fill:#e6ebf4" opacity=".35" filter="url(#' + ctx.k.brilho + ')"/>' +
          lua(ctx, 230, 230, 64, 1, -90, null, null, { opaca: true }) +
          '<circle cx="230" cy="230" r="64" fill="url(#' + I.veu + ')"/>' +
          '<circle cx="230" cy="230" r="64.5" style="fill:none;stroke:rgba(var(--gold-rgb),.55)" stroke-width="1.2"/>';
      }
      return o;
    }
  };
})();
