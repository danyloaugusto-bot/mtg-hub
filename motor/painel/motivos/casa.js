/* Motivo "casa" do gráfico de pontuação: 03. Valgavoth (Dízimo das Almas), escolhido pelo dono na segunda rodada da votação de 15/10/2026.
   Veio do protótipo motivos/valgavoth2.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "casa"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Valgavoth, Dízimo das Almas: segunda rodada, em clima de filme de terror (vinheta pesada, névoa baixa, luz vermelha dura,
     sombras recortadas, granulação e arranhões de película).
     valg3 "A Casa Impossível": oito escadarias de pedra sobem do núcleo até oito fachadas góticas; a luz vermelha sobe cada
     escadaria na proporção da pontuação e só abre a porta do maior.
     valg4 "Altar de sangue": altar de pedra entalhada com oito canaletas; o sangue corre do centro na proporção da pontuação
     e só a bacia do maior enche e transborda.
     Cada agrupamento é desenhado em coordenadas locais (x lateral, y = -raio) num grupo girado; os filtros ficam num grupo
     externo sem giro, para a luz e a textura terem a mesma direção em todos. */

  // gerador pseudoaleatório com semente: o desenho sai igual em toda foto
  function vvRng(seed) { var s = (seed * 7919 + 104729) % 233280; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function vvPoly(pts) { var d = ''; for (var k = 0; k < pts.length; k++) d += (k ? 'L' : 'M') + f1(pts[k][0]) + ' ' + f1(pts[k][1]); return d + 'Z'; }
  function vvLine(pts) { var d = ''; for (var k = 0; k < pts.length; k++) d += (k ? 'L' : 'M') + f1(pts[k][0]) + ' ' + f1(pts[k][1]); return d; }
  function vvRot(g) { return 'translate(230 230) rotate(' + f1(g.am + 90) + ')'; }
  // ponto local (x lateral, y = -raio) de um agrupamento levado para o desenho absoluto
  function vvAbs(g, x, y) { var t = (g.am + 90) * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [230 + x * c - y * s, 230 + x * s + y * c]; }
  // gira o ponto p em torno de o, em graus
  function vvTurn(p, o, deg) { var t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t), x = p[0] - o[0], y = p[1] - o[1]; return [o[0] + x * c - y * s, o[1] + x * s + y * c]; }

  /* ---------- clima de terror, comum aos dois ---------- */
  function vvHorrorDefs(ctx) {
    var u = ctx.uid, K = ctx.vv = {
      disc: u('vvDisc'), grain: u('vvGrain'), fog: u('vvFog'), fogM: u('vvFogM'), fogG: u('vvFogG'), b1: u('vvB'), b3: u('vvB'), b6: u('vvB'),
      vig: u('vvVig'), vigM: u('vvVigM'), hole: u('vvHole'), med: u('vvMed'), horn: u('vvHorn'), core: u('vvCore'), halo: u('vvHalo'), fl: u('vvFl')
    };
    var reg = 'filterUnits="userSpaceOnUse" x="30" y="30" width="400" height="400" color-interpolation-filters="sRGB"';
    return '<clipPath id="' + K.disc + '"><circle cx="230" cy="230" r="196"/></clipPath>' +
      // granulação de película: ruído fino em cinza, aplicado em "overlay" (não clareia o preto)
      '<filter id="' + K.grain + '" ' + reg + '><feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="21"/>' +
      '<feColorMatrix type="matrix" values="1.7 0 0 0 -.35  1.7 0 0 0 -.35  1.7 0 0 0 -.35  0 0 0 0 1"/></filter>' +
      // névoa baixa: faixas largas e horizontais, avermelhadas pela luz que vem de baixo
      '<filter id="' + K.fog + '" ' + reg + '><feTurbulence type="fractalNoise" baseFrequency=".006 .022" numOctaves="4" seed="3"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 .56  0 0 0 0 .15  0 0 0 0 .12  2.7 0 0 0 -1.02"/></filter>' +
      '<linearGradient id="' + K.fogG + '" x1="0" y1="0" x2="0" y2="1"><stop offset=".2" stop-color="#fff" stop-opacity=".2"/>' +
      '<stop offset=".8" stop-color="#fff" stop-opacity="1"/></linearGradient>' +
      '<mask id="' + K.fogM + '" maskUnits="userSpaceOnUse" x="30" y="30" width="400" height="400"><rect x="30" y="30" width="400" height="400" fill="url(#' + K.fogG + ')"/></mask>' +
      '<filter id="' + K.b1 + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>' +
      '<filter id="' + K.b3 + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>' +
      '<filter id="' + K.b6 + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>' +
      // vinheta pesada
      '<radialGradient id="' + K.vig + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset=".56" stop-color="#000" stop-opacity="0"/>' +
      '<stop offset=".82" stop-color="#000" stop-opacity=".4"/><stop offset=".95" stop-color="#000" stop-opacity=".74"/><stop offset="1" stop-color="#000" stop-opacity=".92"/></radialGradient>' +
      '<radialGradient id="' + K.hole + '"><stop offset="0" stop-color="#000"/><stop offset=".5" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient>' +
      '<radialGradient id="' + K.med + '" cx=".5" cy=".46" r=".54"><stop offset="0" stop-color="#0a0605"/><stop offset=".72" stop-color="#110908"/>' +
      '<stop offset=".9" stop-color="#2c0906"/><stop offset="1" style="stop-color:var(--wine)"/></radialGradient>' +
      '<linearGradient id="' + K.horn + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" style="stop-color:var(--wine)"/><stop offset=".55" stop-color="#6d5e56"/>' +
      '<stop offset="1" stop-color="#e2d7c8"/></linearGradient>' +
      '<radialGradient id="' + K.core + '" cx="230" cy="230" r="76" gradientUnits="userSpaceOnUse"><stop offset=".7" style="stop-color:var(--blood2)" stop-opacity=".55"/>' +
      '<stop offset=".84" style="stop-color:var(--blood)" stop-opacity=".2"/><stop offset="1" style="stop-color:var(--blood)" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + K.halo + '"><stop offset="0" style="stop-color:var(--blood2)" stop-opacity=".75"/><stop offset=".4" style="stop-color:var(--blood)" stop-opacity=".35"/>' +
      '<stop offset="1" style="stop-color:var(--blood)" stop-opacity="0"/></radialGradient>' +
      // tremor da chama: só para quem não pediu menos movimento
      '<style>@media (prefers-reduced-motion:no-preference){.' + K.fl + '{animation:' + K.fl + ' 3.3s infinite}}' +
      '@keyframes ' + K.fl + '{0%,100%{opacity:1}7%{opacity:.78}9%{opacity:.96}31%{opacity:.88}34%{opacity:1}62%{opacity:.84}64%{opacity:.98}83%{opacity:.9}}</style>';
  }

  // névoa baixa (no palco: fica no fundo, por baixo do que importa)
  function vvFog(K, op) {
    return '<g clip-path="url(#' + K.disc + ')" mask="url(#' + K.fogM + ')" opacity="' + op + '"><rect x="30" y="30" width="400" height="400" filter="url(#' + K.fog + ')"/></g>';
  }

  // vinheta por cima de tudo, com furos onde há luz do maior e nos detalhes de cor (para não apagar a leitura)
  function vvVignette(K, holes) {
    var m = '<mask id="' + K.vigM + '" maskUnits="userSpaceOnUse" x="30" y="30" width="400" height="400"><rect x="30" y="30" width="400" height="400" fill="#fff"/>';
    holes.forEach(function (h) { m += '<circle cx="' + f1(h[0]) + '" cy="' + f1(h[1]) + '" r="' + h[2] + '" fill="url(#' + K.hole + ')"/>'; });
    return m + '</mask><circle cx="230" cy="230" r="196.5" fill="url(#' + K.vig + ')" mask="url(#' + K.vigM + ')"/>';
  }

  // película velha: granulação, arranhões verticais e poeira, bem discretos
  function vvFilm(K) {
    // a granulação fica fora de qualquer grupo com recorte: um grupo recortado isola o "overlay" e o ruído vira um véu cinza
    var rnd = vvRng(77), o = '<rect x="30" y="30" width="400" height="400" clip-path="url(#' + K.disc + ')" filter="url(#' + K.grain + ')" opacity=".5" style="mix-blend-mode:overlay;pointer-events:none"/>' +
      '<g clip-path="url(#' + K.disc + ')" style="pointer-events:none">';
    [92, 151, 288, 334, 371].forEach(function (x, k) {
      var y0 = 34 + rnd() * 120, y1 = y0 + 140 + rnd() * 220, b = (rnd() - .5) * 5;
      o += '<path d="M' + f1(x) + ' ' + f1(y0) + 'Q' + f1(x + b) + ' ' + f1((y0 + y1) / 2) + ' ' + f1(x + b * .4) + ' ' + f1(y1) + '" fill="none" stroke="' +
        (k === 2 ? '#000' : '#efe6d8') + '" stroke-opacity="' + (k === 2 ? .22 : .08 + rnd() * .05) + '" stroke-width="' + f1(.5 + rnd() * .5) + '"/>';
    });
    for (var k = 0; k < 14; k++) {
      var x = 50 + rnd() * 360, y = 50 + rnd() * 360;
      o += '<ellipse cx="' + f1(x) + '" cy="' + f1(y) + '" rx="' + f1(.4 + rnd() * .9) + '" ry="' + f1(.3 + rnd() * .6) + '" fill="' + (k % 3 ? '#efe6d8' : '#000') + '" opacity="' + f1(.12 + rnd() * .15) + '"/>';
    }
    return o + '</g>';
  }

  // medalhão escuro com chifres e um olho em fenda no alto (y 186 a 202), livre para o placar
  function vvMedal(K) {
    return '<circle cx="230" cy="230" r="55" fill="url(#' + K.med + ')"/>' +
      '<circle cx="230" cy="230" r="53.6" fill="none" stroke="#1b1311" stroke-width="2.6"/>' +
      '<circle cx="230" cy="230" r="54.8" fill="none" style="stroke:var(--blood)" stroke-opacity=".75" stroke-width="1"/>' +
      '<circle cx="230" cy="230" r="49.5" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1.4"/>' +
      '<g filter="url(#' + K.b3 + ')" opacity=".75"><ellipse cx="230" cy="195" rx="15" ry="7" style="fill:var(--blood)"/></g>' +
      '<path d="M223 202Q213.5 197.5 211 186Q218 193 228.5 197.6Z" fill="url(#' + K.horn + ')" stroke="#0a0605" stroke-width=".6"/>' +
      '<path d="M237 202Q246.5 197.5 249 186Q242 193 231.5 197.6Z" fill="url(#' + K.horn + ')" stroke="#0a0605" stroke-width=".6"/>' +
      '<ellipse cx="230" cy="192.4" rx="4.6" ry="2.5" style="fill:var(--blood2)"/>' +
      '<ellipse cx="230" cy="192.4" rx="2.4" ry="1.4" fill="#ffd9a6" opacity=".85"/>' +
      '<ellipse cx="230" cy="192.4" rx=".75" ry="2.3" fill="#000"/>';
  }

  /* ================= valg3: A Casa Impossível ================= */
  var VV_RS = 56, VV_RD = 140;
  function vvFw(r) { return 6 + (r - VV_RS) * 0.21; }            // meia largura do piso
  function vvCp(r) { return 1.8 + (r - VV_RS) * 0.035; }         // espessura do topo do muro
  function vvTw(r) { return vvFw(r) + 3 + (r - VV_RS) * 0.17; }  // meia largura até o topo do muro
  // ponto na face interna do muro: s = lado, r = raio, q = 0 (piso) a 1 (topo)
  function vvFp(s, r, q) { return [s * (vvFw(r) + q * (vvTw(r) - vvCp(r) - vvFw(r))), -r]; }
  function vvF(u, v) { return [u, -(VV_RD + v)]; }               // fachada: u lateral, v para fora a partir da base

  function vvArchFace(s, ra, w) {
    var a = vvFp(s, ra, .1), b = vvFp(s, ra, .52), c1 = vvFp(s, ra, .78), ap = vvFp(s, ra + w / 2, .9), c2 = vvFp(s, ra + w, .78), d = vvFp(s, ra + w, .52), e = vvFp(s, ra + w, .1);
    return 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]) + 'Q' + f1(c1[0]) + ' ' + f1(c1[1]) + ' ' + f1(ap[0]) + ' ' + f1(ap[1]) +
      'Q' + f1(c2[0]) + ' ' + f1(c2[1]) + ' ' + f1(d[0]) + ' ' + f1(d[1]) + 'L' + f1(e[0]) + ' ' + f1(e[1]) + 'Z';
  }
  // arco gótico de fachada, de u0 a u1, com laterais até v1 e ponta em v2
  function vvArchF(u0, u1, v0, v1, v2) {
    var m = (u0 + u1) / 2, a = vvF(u0, v0), b = vvF(u0, v1), c = vvF(u0, v1 + (v2 - v1) * .62), ap = vvF(m, v2), c2 = vvF(u1, v1 + (v2 - v1) * .62), d = vvF(u1, v1), e = vvF(u1, v0);
    return 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]) + 'Q' + f1(c[0]) + ' ' + f1(c[1]) + ' ' + f1(ap[0]) + ' ' + f1(ap[1]) +
      'Q' + f1(c2[0]) + ' ' + f1(c2[1]) + ' ' + f1(d[0]) + ' ' + f1(d[1]) + 'L' + f1(e[0]) + ' ' + f1(e[1]) + 'Z';
  }
  function vvTilt(g) { return ((g.i * 37) % 7 - 3) * 0.9; }      // cada casa um pouco torta: a Casa é impossível
  function vvRose(g) { return vvAbs(g, vvTurn(vvF(0, 29.5), [0, -VV_RD], vvTilt(g))[0], vvTurn(vvF(0, 29.5), [0, -VV_RD], vvTilt(g))[1]); }

  MOTIVOS.valg3 = {
    deck: '03. Valgavoth', nome: 'A Casa Impossível',
    desc: 'Oito escadarias de pedra sobem do poço do demônio até oito portas da Casa. A luz vermelha sobe cada escadaria na proporção da pontuação, acendendo as tochas por onde passa; só a porta do maior se abre em brasa, e o vitral colorido acima de cada porta diz qual é o agrupamento.',
    defs: function (ctx) {
      var o = vvHorrorDefs(ctx), K = ctx.vv;
      K.smoke = ctx.uid('vvSmoke'); K.stone = ctx.uid('vvStone'); K.pit = ctx.uid('vvPit'); K.ray = ctx.uid('vvRay'); K.door = ctx.uid('vvDoor'); K.flame = ctx.uid('vvFlame'); K.ao = ctx.uid('vvAo');
      return o +
        // fumaça escura em volutas, subindo do poço
        '<filter id="' + K.smoke + '" filterUnits="userSpaceOnUse" x="30" y="30" width="400" height="400" color-interpolation-filters="sRGB">' +
        '<feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="4" seed="8"/>' +
        '<feColorMatrix type="matrix" values="0 0 0 0 .02  0 0 0 0 .01  0 0 0 0 .01  3.4 0 0 0 -1.25"/></filter>' +
        // pedra: ruído fino em relevo e manchas largas, multiplicados pela cor de cada peça
        '<filter id="' + K.stone + '" x="-6%" y="-6%" width="112%" height="112%" color-interpolation-filters="sRGB">' +
        '<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="4" result="n"/>' +
        '<feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="12" result="m"/>' +
        '<feComposite in="n" in2="m" operator="arithmetic" k2=".7" k3=".75" result="h"/>' +
        '<feDiffuseLighting in="h" surfaceScale="2.4" diffuseConstant="1.15" lighting-color="#ebe5df" result="L"><feDistantLight azimuth="225" elevation="55"/></feDiffuseLighting>' +
        '<feComposite in="SourceGraphic" in2="L" operator="arithmetic" k1="1.2" result="t"/>' +
        '<feComposite in="t" in2="SourceGraphic" operator="in"/></filter>' +
        '<radialGradient id="' + K.pit + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset=".28" stop-color="#2e0906"/>' +
        '<stop offset=".5" stop-color="#110504"/><stop offset=".8" stop-color="#060303"/><stop offset="1" stop-color="#010101"/></radialGradient>' +
        '<radialGradient id="' + K.ray + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset=".3" style="stop-color:var(--blood2)" stop-opacity=".3"/>' +
        '<stop offset=".6" style="stop-color:var(--blood)" stop-opacity=".1"/><stop offset=".95" style="stop-color:var(--blood)" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + K.door + '" cx=".5" cy=".8" r=".8"><stop offset="0" stop-color="#ffe6b0"/><stop offset=".3" stop-color="#ff9a52"/>' +
        '<stop offset=".6" style="stop-color:var(--blood2)"/><stop offset="1" style="stop-color:var(--blood)"/></radialGradient>' +
        '<linearGradient id="' + K.flame + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff0c4"/><stop offset=".45" stop-color="#ffb55a"/>' +
        '<stop offset="1" style="stop-color:var(--blood2)"/></linearGradient>' +
        // sombra de canto no piso (os muros escurecem as beiradas)
        '<linearGradient id="' + K.ao + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset=".3" stop-color="#000" stop-opacity="0"/>' +
        '<stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></linearGradient>';
    },
    stage: function (ctx) {
      var K = ctx.vv, o = '<circle cx="230" cy="230" r="196" fill="url(#' + K.pit + ')"/>', rays = '', shadows = '', gates = '';
      // raios de luz vermelha no poço entre as escadarias, cortados pelas sombras longas dos pilares da borda
      ctx.groups.forEach(function (g) {
        var b = g.am + ctx.step / 2;
        rays += 'M' + P(60, b - 10) + 'L' + P(192, b - 10) + 'A192 192 0 0 1 ' + P(192, b + 10) + 'L' + P(60, b + 10) + 'Z';
        [-4.6, 0, 4.6].forEach(function (d, k) {
          var a = b + d, w = k === 1 ? 1.3 : 1.7;
          shadows += 'M' + P(64, a - w * .7) + 'L' + P(196, a - w) + 'L' + P(196, a + w) + 'L' + P(64, a + w * .7) + 'Z';
        });
        gates += '<path transform="translate(230 230) rotate(' + f1(b + 90) + ')" d="M-3.6 -141.6L-3.6 -146Q-3.6 -149 0 -150.6Q3.6 -149 3.6 -146L3.6 -141.6Z"/>';
      });
      o += '<path d="' + rays + '" fill="url(#' + K.ray + ')"/>' + '<rect x="30" y="30" width="400" height="400" clip-path="url(#' + K.disc + ')" filter="url(#' + K.smoke + ')" opacity=".9"/>' +
        vvFog(K, 1) + '<path d="' + shadows + '" fill="#000" opacity=".85"/>';
      // anel de pedra que liga as fachadas (a roda da Casa), com portais escuros entre as casas
      o += '<g filter="url(#' + K.stone + ')"><circle cx="230" cy="230" r="146" fill="none" stroke="#2a2725" stroke-width="9"/>' +
        '<circle cx="230" cy="230" r="141.6" fill="none" stroke="#121010" stroke-width="1.4"/></g><g fill="#030202">' + gates + '</g>';
      return o;
    },
    group: function (g, ctx) {
      var K = ctx.vv, RS = VV_RS, RD = VV_RD, fw = vvFw, tw = vvTw, cp = vvCp, F = vvF;
      var lit = g.frac >= 0.999, rL = lit ? RD + 8 : RS + g.frac * (RD - RS);
      var mk = ctx.uid('vvMk'), lg = ctx.uid('vvLg');
      // ---- escadaria
      var N = 13, risers = '', treads = '', nos = '';
      for (var k = 0; k < N; k++) {
        var r1 = RS * Math.pow(RD / RS, k / N), r2 = RS * Math.pow(RD / RS, (k + 1) / N), rm = r1 + (r2 - r1) * 0.36;
        risers += vvPoly([[-fw(r1), -r1], [fw(r1), -r1], [fw(rm), -rm], [-fw(rm), -rm]]);
        treads += vvPoly([[-fw(rm), -rm], [fw(rm), -rm], [fw(r2), -r2], [-fw(r2), -r2]]);
        nos += 'M' + f1(-fw(rm)) + ' ' + f1(-rm) + 'L' + f1(fw(rm)) + ' ' + f1(-rm);
      }
      var floor = vvPoly([[-fw(RS), -RS], [fw(RS), -RS], [fw(RD), -RD], [-fw(RD), -RD]]);
      var faces = '', caps = '', arches = '', foot = '';
      [-1, 1].forEach(function (s) {
        faces += vvPoly([[s * fw(RS), -RS], [s * fw(RD), -RD], [s * (tw(RD) - cp(RD)), -RD], [s * (tw(RS) - cp(RS)), -RS]]);
        caps += vvPoly([[s * (tw(RS) - cp(RS)), -RS], [s * (tw(RD) - cp(RD)), -RD], [s * tw(RD), -RD], [s * tw(RS), -RS]]);
        foot += vvPoly([vvFp(s, RS, 0), vvFp(s, RD, 0), vvFp(s, RD, .3), vvFp(s, RS, .3)]);
        for (var ra = 63; ra < RD - 8;) { var w = 0.075 * ra; arches += vvArchFace(s, ra, w); ra += w * 1.75; }
      });
      var arch = '<path d="' + treads + '" fill="#1d1a19"/><path d="' + risers + '" fill="#0b0909"/>' +
        '<path d="' + nos + '" stroke="#3a3433" stroke-width=".8"/>' +
        '<path d="' + faces + '" fill="#171413"/><path d="' + arches + '" fill="#030202"/><path d="' + caps + '" fill="#4a4644"/>';
      // ---- luz que sobe: tudo o que acende, recortado pela máscara que termina em rL (borda dura, como foco de lanterna)
      var o1 = Math.max(0, (rL - 2.5 - RS) / (rL + 2.5 - RS));
      var litL = '<defs><linearGradient id="' + lg + '" gradientUnits="userSpaceOnUse" x1="0" y1="' + (-RS) + '" x2="0" y2="' + f1(-(rL + 2.5)) + '">' +
        '<stop offset="0" stop-color="#fff"/><stop offset="' + f1(o1) + '" stop-color="#fff" stop-opacity=".74"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<mask id="' + mk + '" maskUnits="userSpaceOnUse" x="-80" y="-200" width="160" height="170"><rect x="-80" y="-200" width="160" height="170" fill="url(#' + lg + ')"/></mask></defs>' +
        '<g mask="url(#' + mk + ')"><path d="' + treads + '" fill="#6e0d07" opacity=".85"/><path d="' + risers + '" style="fill:var(--blood2)"/>' +
        '<path d="' + nos + '" stroke="#ffc7a0" stroke-width=".9" opacity=".85"/>' +
        '<path d="' + faces + '" style="fill:var(--blood)" opacity=".8"/><path d="' + arches + '" fill="#030202"/>' +
        '<path d="' + caps + '" style="fill:var(--blood2)" opacity=".6"/></g>';
      var shade = '<path d="' + floor + '" fill="url(#' + K.ao + ')"/><path d="' + foot + '" fill="#000" opacity=".45"/>';
      // ---- fachada gótica (cada uma um pouco torta)
      var stT = lit ? '#6c5048' : '#3b3735', stW = lit ? '#5d443e' : '#312e2c';
      var body = vvPoly([F(-40, 0), F(40, 0), F(40, 21), F(14, 30.5), F(14, 37), F(-14, 37), F(-14, 30.5), F(-40, 21)]);
      var fac = '<path d="' + vvPoly([F(-40, 0), F(-13, 0), F(-13, 30), F(-40, 21)]) + vvPoly([F(40, 0), F(13, 0), F(13, 30), F(40, 21)]) + '" fill="' + stW + '"/>' +
        '<path d="' + vvPoly([F(-14, 0), F(14, 0), F(14, 37), F(-14, 37)]) + '" fill="' + stT + '"/>' +
        '<path d="' + vvPoly([F(-15.5, 0), F(-13, 0), F(-13, 34), F(-15.5, 32)]) + vvPoly([F(15.5, 0), F(13, 0), F(13, 34), F(15.5, 32)]) + '" fill="#141110"/>';
      var mas = '';
      [7, 14, 21, 28].forEach(function (v) { mas += vvLine([F(-13, v), F(13, v)]); });
      [7, 14].forEach(function (v) { mas += vvLine([F(-40, v), F(-15.5, v)]) + vvLine([F(15.5, v), F(40, v)]); });
      fac += '<path d="' + mas + '" stroke="#1a1716" stroke-width=".7" fill="none"/>' +
        '<path d="' + vvPoly([F(-43, 19.5), F(-12, 31), F(-12, 35), F(-43, 23.5)]) + vvPoly([F(43, 19.5), F(12, 31), F(12, 35), F(43, 23.5)]) +
        vvPoly([F(-17.5, 35.5), F(0, 54.5), F(17.5, 35.5)]) + '" fill="#0e0c0b"/>' +
        '<path d="' + vvLine([F(0, 37), F(0, 54)]) + vvLine([F(-8, 37), F(-1, 51)]) + vvLine([F(8, 37), F(1, 51)]) + '" stroke="#2c2725" stroke-width=".7"/>' +
        '<path d="' + vvPoly([F(-42, 22), F(-37.5, 22), F(-39.8, 32)]) + vvPoly([F(42, 22), F(37.5, 22), F(39.8, 32)]) +
        vvPoly([F(-15.8, 36), F(-11.6, 36), F(-13.7, 45)]) + vvPoly([F(15.8, 36), F(11.6, 36), F(13.7, 45)]) + '" fill="#1d1918"/>' +
        '<path d="' + vvPoly([F(-12, -3.5), F(12, -3.5), F(12, 0), F(-12, 0)]) + '" fill="' + (lit ? '#6a4d45' : '#2e2a29') + '"/>' +
        '<path d="' + vvArchF(-9.6, 9.6, 0, 14, 25.5) + '" fill="' + (lit ? '#8e7a70' : '#57524e') + '"/>';
      var winD = vvArchF(-30.5, -23.5, 5, 12, 17.5) + vvArchF(23.5, 30.5, 5, 12, 17.5) + vvArchF(-4, 4, 41, 44, 47.5);
      var rose = F(0, 29.5);
      if (lit) {
        fac += '<path d="' + body + '" style="fill:var(--blood)" opacity=".3"/>' +
          '<path d="' + vvArchF(-7, 7, 0, 13, 22.5) + '" fill="url(#' + K.door + ')"/>' +
          '<path d="' + vvPoly([F(-7, 0), F(-11.5, 1.2), F(-11.5, 17.5), F(-7, 13)]) + '" fill="#0d0706"/>' +
          '<path d="' + winD + '" style="fill:var(--blood2)"/>';
      } else {
        fac += '<path d="' + vvArchF(-7, 7, 0, 13, 22.5) + '" fill="#090605"/>' +
          '<path d="' + vvLine([F(-3.5, 0), F(-3.5, 19)]) + vvLine([F(0, 0), F(0, 22)]) + vvLine([F(3.5, 0), F(3.5, 19)]) + '" stroke="#21150f" stroke-width=".8"/>' +
          '<circle cx="' + f1(F(2.2, 9)[0]) + '" cy="' + f1(F(2.2, 9)[1]) + '" r=".8" fill="#5a4a40"/>' +
          '<path d="' + winD + '" fill="#050303"/>';
      }
      // contorno frio de lua na silhueta (pôster de terror), e o vitral com a cor do agrupamento
      var sil = vvPoly([F(-40, 0), F(40, 0), F(40, 21), F(42, 22), F(39.8, 32), F(37.5, 22.5), F(15.8, 31), F(15.8, 36), F(17.5, 35.5), F(0, 54.5), F(-17.5, 35.5), F(-15.8, 36), F(-15.8, 31), F(-37.5, 22.5), F(-39.8, 32), F(-42, 22), F(-40, 21)]);
      fac += '<path d="' + sil + '" fill="none" stroke="#c9c6cc" stroke-opacity="' + (lit ? .18 : .26) + '" stroke-width=".9" stroke-linejoin="round"/>' +
        '<circle cx="' + f1(rose[0]) + '" cy="' + f1(rose[1]) + '" r="4.6" fill="#120d0c"/>' +
        '<circle cx="' + f1(rose[0]) + '" cy="' + f1(rose[1]) + '" r="3.5" style="fill:' + g.cor + '"/>' +
        '<path d="M' + f1(rose[0] - 3.5) + ' ' + f1(rose[1]) + 'h7M' + f1(rose[0]) + ' ' + f1(rose[1] - 3.5) + 'v7" stroke="#120d0c" stroke-width=".8"/>';
      var tilt = 'rotate(' + f1(vvTilt(g)) + ' 0 ' + (-RD) + ')';
      var o = '<g filter="url(#' + K.stone + ')"><g transform="' + vvRot(g) + '">' + arch + litL + shade + '<g transform="' + tilt + '">' + fac + '</g></g></g>';
      // ---- luzes: tochas, brilho do vitral, porta aberta
      var gl = '';
      for (var j = 0; j < 9; j++) {
        var rt = 66 + j * 8.75, s = j % 2 ? 1 : -1, p = vvFp(s, rt, .5);
        if (rt <= rL - 2) {
          gl += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="13" fill="url(#' + K.halo + ')" class="' + K.fl + '" style="mix-blend-mode:screen"/>' +
            '<path d="M' + f1(p[0] - 1.6) + ' ' + f1(p[1] + 1) + 'Q' + f1(p[0] - 1.7) + ' ' + f1(p[1] - 2.6) + ' ' + f1(p[0]) + ' ' + f1(p[1] - 5.6) +
            'Q' + f1(p[0] + 1.7) + ' ' + f1(p[1] - 2.6) + ' ' + f1(p[0] + 1.6) + ' ' + f1(p[1] + 1) + 'Z" fill="url(#' + K.flame + ')"/>';
        } else {
          gl += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="1.7" fill="#070505" stroke="#2c2623" stroke-width=".7"/>';
        }
      }
      // brilho no ar sobre a parte acesa: vaza por cima dos muros, mas para na mesma frente de luz
      gl += '<path d="' + floor + faces + '" mask="url(#' + mk + ')" filter="url(#' + K.b6 + ')" style="fill:var(--blood2);mix-blend-mode:screen" opacity=".42"/>';
      if (lit) {
        var dp = vvTurn(F(0, 8), [0, -RD], vvTilt(g));
        gl += '<clipPath id="' + mk + 'c"><circle cx="0" cy="0" r="195.5"/></clipPath>' +
          '<circle cx="' + f1(dp[0]) + '" cy="' + f1(dp[1]) + '" r="50" fill="url(#' + K.halo + ')" class="' + K.fl + '" style="mix-blend-mode:screen" clip-path="url(#' + mk + 'c)"/>' +
          '<g transform="' + tilt + '"><path d="' + winD + '" style="fill:var(--blood2)" filter="url(#' + K.b3 + ')" opacity=".9"/></g>' +
          '<g transform="' + tilt + '"><path d="' + vvPoly([F(-7, 0), F(7, 0), F(18, -38), F(-18, -38)]) + '" style="fill:var(--blood2)" opacity=".5" filter="url(#' + K.b3 + ')"/>' +
          '<path d="' + vvArchF(-6, 6, 1, 12, 20) + '" fill="#ffdca6" opacity=".75" filter="url(#' + K.b1 + ')"/></g>';
      }
      return o + '<g transform="' + vvRot(g) + '">' + gl + '</g>';
    },
    center: function (ctx) {
      var K = ctx.vv, holes = [];
      ctx.groups.forEach(function (g) {
        var r = vvRose(g);
        holes.push([r[0], r[1], 14]);
        if (g.frac >= 0.999) holes.push(vvAbs(g, 0, -(VV_RD + 16)).concat(56));
      });
      return '<circle cx="230" cy="230" r="76" fill="url(#' + K.core + ')" style="mix-blend-mode:screen"/>' + vvFog(K, .3) +
        vvVignette(K, holes) + vvMedal(K) + vvFilm(K);
    }
  };

  /* ================= valg4: Altar de sangue ================= */
  var VV_C0 = 62, VV_CE = 146, VV_BC = 162, VV_BR = 16, VV_RIM = 190, VV_GX = 23, VV_GY = -162;   // gema cravada ao lado da bacia

  // fenda irregular, do aro para dentro, perto do ângulo a
  function vvCrack(rnd, a, r0, r1) {
    var pts = [], n = 9;
    for (var k = 0; k <= n; k++) { var r = r0 + (r1 - r0) * k / n, d = (rnd() - .5) * 5.5 * (k ? 1 : 0); pts.push(pol(r, a + d * 30 / r)); a += (rnd() - .5) * 2.4; }
    return pts;
  }

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.valg3.legenda = { peca: "escadaria", masc: false, texto: " é um agrupamento: a luz sobe por ela em proporção à soma das notas, e só a porta do maior se abre." };

  return MOTIVOS.valg3;
})();
