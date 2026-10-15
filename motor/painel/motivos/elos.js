/* Motivo "elos" do gráfico de pontuação: 02. Clavileño (Ritos de Sangue), escolhido pelo dono na segunda rodada da votação de 15/10/2026.
   Veio do protótipo motivos/clavileno3.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "elos"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Clavileño, Ritos de Sangue (Orzhov, preto e marfim): emblemas da Legião do Crepúsculo, em joia de marfim, prata e laca negra.
     clav5 Rosário do Clérigo: oito fios de pérolas saem do medalhão até uma cruz gótica de filigrana; as pérolas acendem a partir do centro.
     clav6 Elos da Bênção: oito correntes radiais terminam numa asa de morcego de marfim; a parte forjada acompanha a pontuação.
     clav7 Armadura Transfigurada: oito placas de armadura em forma de asa de morcego; o comprimento acompanha a pontuação.
     Em todos, a medida de cada agrupamento é proporcional a g.frac (zero na borda do medalhão, a maior chega ao fim do curso). */
  (function () {
    var VB = 'x="-58" y="-2" width="576" height="464"';

    /* ---------- geometria ---------- */
    // ponto no referencial de um raio: 'u' para fora a partir do centro, 'v' para o lado horário
    function L(am, u, v) {
      var t = am * Math.PI / 180, ux = Math.cos(t), uy = Math.sin(t);
      return [230 + ux * u - uy * v, 230 + uy * u + ux * v];
    }
    // referencial livre: origem (cx, cy), eixo na direção 'th' (graus)
    function F(cx, cy, th, a, b) {
      var t = th * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
      return [cx + c * a - s * b, cy + s * a + c * b];
    }
    function Pt(p) { return f1(p[0]) + ' ' + f1(p[1]); }
    function reta(am, u1, u2, v) { v = v || 0; return 'M' + Pt(L(am, u1, v)) + 'L' + Pt(L(am, u2, v)); }
    function anel(am, u1, u2, hw, v0) {
      v0 = v0 || 0;
      return 'M' + Pt(L(am, u1 + hw, v0 - hw)) + 'L' + Pt(L(am, u2 - hw, v0 - hw)) + 'A' + hw + ' ' + hw + ' 0 0 1 ' + Pt(L(am, u2 - hw, v0 + hw)) +
        'L' + Pt(L(am, u1 + hw, v0 + hw)) + 'A' + hw + ' ' + hw + ' 0 0 1 ' + Pt(L(am, u1 + hw, v0 - hw)) + 'Z';
    }
    function anelF(cx, cy, th, len, hw) {
      var a = len / 2 - hw;
      return 'M' + Pt(F(cx, cy, th, -a, -hw)) + 'L' + Pt(F(cx, cy, th, a, -hw)) + 'A' + hw + ' ' + hw + ' 0 0 1 ' + Pt(F(cx, cy, th, a, hw)) +
        'L' + Pt(F(cx, cy, th, -a, hw)) + 'A' + hw + ' ' + hw + ' 0 0 1 ' + Pt(F(cx, cy, th, -a, -hw)) + 'Z';
    }
    function barraF(cx, cy, th, len) { return 'M' + Pt(F(cx, cy, th, -len / 2, 0)) + 'L' + Pt(F(cx, cy, th, len / 2, 0)); }
    function circ(c, r, estilo, extra) {
      return '<circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + f1(r) + '" style="' + estilo + '"' + (extra || '') + '/>';
    }
    // brilho em estrela de quatro pontas
    function brilho(x, y, s, cor) {
      var a = s * 0.15;
      return '<path d="M' + f1(x) + ' ' + f1(y - s) + 'Q' + f1(x + a) + ' ' + f1(y - a) + ' ' + f1(x + s) + ' ' + f1(y) + 'Q' + f1(x + a) + ' ' + f1(y + a) + ' ' + f1(x) + ' ' + f1(y + s) +
        'Q' + f1(x - a) + ' ' + f1(y + a) + ' ' + f1(x - s) + ' ' + f1(y) + 'Q' + f1(x - a) + ' ' + f1(y - a) + ' ' + f1(x) + ' ' + f1(y - s) + 'Z" style="fill:' + cor + '"/>';
    }

    /* ---------- filtros e gradientes ---------- */
    // metal/marfim com bisel: luz do alto à esquerda calculada sobre o contorno borrado
    function filtroMetal(id, sd, alt, esp, expo, dif, k1) {
      return '<filter id="' + id + '" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">' +
        '<feGaussianBlur in="SourceAlpha" stdDeviation="' + sd + '" result="b"/>' +
        '<feDiffuseLighting in="b" surfaceScale="' + alt + '" diffuseConstant="' + dif + '" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="38"/></feDiffuseLighting>' +
        '<feSpecularLighting in="b" surfaceScale="' + alt + '" specularConstant="' + esp + '" specularExponent="' + expo + '" lighting-color="#fff" result="s"><feDistantLight azimuth="225" elevation="52"/></feSpecularLighting>' +
        '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="' + (k1 || 1.15) + '" k2="0" k3="0" k4="0" result="sh"/>' +
        '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
        '<feComposite in="sh" in2="s2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="m"/>' +
        '<feComposite in="m" in2="SourceAlpha" operator="in"/></filter>';
    }
    function filtroBlur(id, sd) {
      return '<filter id="' + id + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="' + sd + '"/></filter>';
    }
    function rg(id, attrs, stops) {
      return '<radialGradient id="' + id + '" ' + attrs + '>' + stops.map(function (s) { return '<stop offset="' + s[0] + '" style="stop-color:' + s[1] + '"/>'; }).join('') + '</radialGradient>';
    }
    function lg(id, attrs, stops) {
      return '<linearGradient id="' + id + '" ' + attrs + '>' + stops.map(function (s) { return '<stop offset="' + s[0] + '" style="stop-color:' + s[1] + '"/>'; }).join('') + '</linearGradient>';
    }

    function defsComuns(ctx, I, px) {
      ['bev', 'bevD', 'bevP', 'glow', 'glowL', 'sombra', 'grao', 'nevoa', 'dentro', 'disco', 'brilhoD', 'vinheta', 'joia', 'prata', 'esfera', 'verniz',
        'perB', 'perI', 'perR', 'perN', 'perS', 'conta'].forEach(function (k) { I[k] = ctx.uid(px + k); });
      return filtroMetal(I.bev, 1.6, 4.4, 1.3, 20, 1.2, 1.3) + filtroMetal(I.bevD, 1.6, 3.6, 0.38, 12, 1, 1) + filtroMetal(I.bevP, 0.7, 2.6, 1.2, 18, 1.15) +
        filtroBlur(I.glow, 4) + filtroBlur(I.glowL, 9) + filtroBlur(I.sombra, 2.2) +
        '<filter id="' + I.grao + '" ' + VB + ' filterUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="5" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -.5 .28" result="g"/>' +
        '<feComposite in="g" in2="SourceAlpha" operator="in"/></filter>' +
        // fumaça: ruído grosso, só as cristas
        '<filter id="' + I.nevoa + '" ' + VB + ' filterUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency=".012 .018" numOctaves="4" seed="21" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.2 0 0 0 -.5" result="g"/>' +
        '<feComposite in="g" in2="SourceAlpha" operator="in"/></filter>' +
        '<clipPath id="' + I.dentro + '"><circle cx="230" cy="230" r="195"/></clipPath>' +
        rg(I.disco, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="186"', [[0, '#26262a'], [.5, '#121214'], [.86, '#070708'], [1, '#020202']]) +
        rg(I.brilhoD, 'gradientUnits="userSpaceOnUse" cx="170" cy="140" r="170"', [[0, 'rgba(255,255,255,.07)'], [1, 'rgba(255,255,255,0)']]) +
        rg(I.vinheta, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="186"', [[.62, 'rgba(0,0,0,0)'], [.92, 'rgba(0,0,0,.45)'], [1, 'rgba(0,0,0,.8)']]) +
        rg(I.joia, 'cx=".36" cy=".32" r=".72"', [[0, 'rgba(255,255,255,.75)'], [.4, 'rgba(255,255,255,0)'], [.78, 'rgba(0,0,0,.2)'], [1, 'rgba(0,0,0,.65)']]) +
        lg(I.prata, 'x1="0" y1="0" x2=".4" y2="1"', [[0, '#ffffff'], [.45, '#d9dbe0'], [1, '#8d9199']]) +
        rg(I.esfera, 'cx=".42" cy=".34" r=".75"', [[0, '#2a2a2f'], [.45, '#0f0f11'], [1, '#000']]) +
        lg(I.verniz, 'x1="0" y1="0" x2="0" y2="1"', [[0, 'rgba(255,255,255,.22)'], [1, 'rgba(255,255,255,0)']]) +
        // pérola acesa: corpo marfim com luz no alto à esquerda, a irisação na borda e o reflexo de baixo
        rg(I.perB, 'cx=".4" cy=".36" r=".68" fx=".34" fy=".28"', [[0, '#ffffff'], [.2, '#faf7f0'], [.52, '#e3ddd1'], [.82, '#aaa49a'], [1, '#6e6a64']]) +
        rg(I.perI, 'cx=".5" cy=".5" r=".5"', [[0, 'rgba(255,255,255,0)'], [.66, 'rgba(255,255,255,0)'], [.84, 'rgba(226,205,236,.32)'], [.95, 'rgba(190,222,226,.28)'], [1, 'rgba(190,222,226,0)']]) +
        rg(I.perR, 'cx=".64" cy=".82" r=".42"', [[0, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]) +
        // pérola apagada: negra e fosca
        rg(I.perN, 'cx=".4" cy=".34" r=".72"', [[0, '#3c3c41'], [.38, '#18181b'], [.8, '#060607'], [1, '#000']]) +
        rg(I.perS, 'cx=".5" cy=".5" r=".5"', [[0, 'rgba(0,0,0,.85)'], [.6, 'rgba(0,0,0,.5)'], [1, 'rgba(0,0,0,0)']]) +
        rg(I.conta, 'cx=".38" cy=".32" r=".7"', [[0, '#ffffff'], [.4, '#c9ccd2'], [1, '#4c4f55']]);
    }

    /* fundo comum: disco negro com fumaça, grão, vinheta e um sopro de luz no alto */
    function fundo(I, fumaca) {
      return '<circle cx="230" cy="230" r="196" style="fill:#000"/>' +
        '<circle cx="230" cy="230" r="186" style="fill:url(#' + I.disco + ')"/>' +
        '<circle cx="230" cy="230" r="186" style="fill:#000" filter="url(#' + I.nevoa + ')" opacity="' + (fumaca || .3) + '"/>' +
        '<circle cx="230" cy="230" r="186" style="fill:#000" filter="url(#' + I.grao + ')" opacity=".45"/>' +
        '<circle cx="230" cy="230" r="186" style="fill:url(#' + I.brilhoD + ')"/>';
    }

    /* Aclazotz, o deus-morcego: silhueta de asas abertas, 32 de largura, centrada em (x, y) */
    var MORCEGO = 'M0 -3.6L1.6 -7.6L2.6 -3.4C6 -5.2 10 -7.2 16 -7.4Q14.4 -3.6 14.6 1.2Q12.2 -1.2 10 .6Q8.6 2.2 8.2 4.6Q6 2.6 4 3.4Q2.6 4.6 1.4 7.6L0 5.8' +
      'L-1.4 7.6Q-2.6 4.6 -4 3.4Q-6 2.6 -8.2 4.6Q-8.6 2.2 -10 .6Q-12.2 -1.2 -14.6 1.2Q-14.4 -3.6 -16 -7.4C-10 -7.2 -6 -5.2 -2.6 -3.4L-1.6 -7.6Z';
    function morcego(x, y, s, I) {
      var tr = 'translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s + ')';
      return '<path transform="translate(' + f1(x) + ' ' + f1(y + 1) + ') scale(' + s + ')" d="' + MORCEGO + '" style="fill:rgba(0,0,0,.8)"/>' +
        '<path transform="' + tr + '" d="' + MORCEGO + '" style="fill:rgba(255,255,255,.3)" filter="url(#' + I.glow + ')"/>' +
        '<g filter="url(#' + I.bevP + ')"><path transform="' + tr + '" d="' + MORCEGO + '" style="fill:#ece6d6"/></g>';
    }

    /* medalhão negro polido num aro de prata, com o morcego no alto */
    function medalhao(ctx, I, contas) {
      var o = '<circle cx="230" cy="230" r="55.8" style="fill:#000"/>' +
        '<g filter="url(#' + I.bev + ')"><circle cx="230" cy="230" r="52.4" style="fill:none;stroke:#b4b0a6" stroke-width="5.8"/></g>' +
        '<circle cx="230" cy="230" r="49.2" style="fill:none;stroke:var(--gold)" stroke-width=".9" stroke-opacity=".85"/>' +
        '<circle cx="230" cy="230" r="48.4" style="fill:url(#' + I.esfera + ')"/>' +
        '<ellipse cx="230" cy="201" rx="30" ry="13" style="fill:url(#' + I.verniz + ')"/>';
      if (contas) {
        var cc = '';
        for (var k = 0; k < 32; k++) { var p = L(-90 + k * 11.25 + 5.625, 52.4, 0); cc += circ(p, 1.15, 'fill:#f2efe6'); }
        o += '<g opacity=".9">' + cc + '</g>';
      }
      return o + morcego(230, 194, 1, I);
    }

    /* pérola: sombra, corpo, irisação, reflexo e brilho (só gradientes, sem filtro) */
    function sombraPerola(c, r, I) { return circ([c[0] + 1.3, c[1] + 2], r * 1.25, 'fill:url(#' + I.perS + ')'); }
    function perola(c, r, acesa, I) {
      var x = c[0], y = c[1];
      if (!acesa) return circ(c, r, 'fill:url(#' + I.perN + ');stroke:rgba(255,255,255,.16)', ' stroke-width=".6"') +
        '<ellipse cx="' + f1(x - r * .3) + '" cy="' + f1(y - r * .36) + '" rx="' + f1(r * .3) + '" ry="' + f1(r * .18) + '" transform="rotate(-35 ' + f1(x - r * .3) + ' ' + f1(y - r * .36) + ')" style="fill:rgba(255,255,255,.2)"/>';
      return circ(c, r, 'fill:url(#' + I.perB + ')') + circ(c, r, 'fill:url(#' + I.perI + ')') + circ(c, r, 'fill:url(#' + I.perR + ')') +
        '<ellipse cx="' + f1(x - r * .3) + '" cy="' + f1(y - r * .36) + '" rx="' + f1(r * .36) + '" ry="' + f1(r * .22) + '" transform="rotate(-35 ' + f1(x - r * .3) + ' ' + f1(y - r * .36) + ')" style="fill:rgba(255,255,255,.95)"/>';
    }
    function gema(c, r, g, I, viva) {
      var o = '';
      if (viva) o += circ(c, r * 1.9, 'fill:' + g.rgba(.9), ' filter="url(#' + I.glow + ')"');
      return o + circ([c[0], c[1] + .5], r + 1.5, 'fill:#000') + circ(c, r + .9, 'fill:none;stroke:' + (viva ? 'var(--gold2)' : 'var(--gold)'), ' stroke-width="1.1"') +
        circ(c, r, 'fill:' + g.cor) + circ(c, r, 'fill:url(#' + I.joia + ')') + circ([c[0] - r * .33, c[1] - r * .36], r * .26, 'fill:#fff');
    }

    /* corrente: elos deitados (anel) e de pé (barra), alternados; a máscara abre uma fresta em volta dos de pé */
    function corrente(elos, base, filtro, mascara) {
      var o = '<g filter="url(#' + filtro + ')"><g' + (mascara ? ' mask="url(#' + mascara + ')"' : '') + '>';
      elos.forEach(function (e) { if (e.t === 'a') o += '<path d="' + e.d + '" style="fill:none;stroke:' + base + '" stroke-width="' + e.w + '"/>'; });
      o += '</g>';
      elos.forEach(function (e) { if (e.t === 'b') o += '<path d="' + e.d + '" style="fill:none;stroke:' + base + '" stroke-width="' + e.w + '" stroke-linecap="round"/>'; });
      return o + '</g>';
    }
    function sombraElos(elos, I, dx, dy) {
      var o = '<g transform="translate(' + (dx || 2) + ' ' + (dy || 2.8) + ')" opacity=".85" filter="url(#' + I.sombra + ')">';
      elos.forEach(function (e) { o += '<path d="' + e.d + '" style="fill:none;stroke:#000" stroke-width="' + (e.w + 1.5) + '" stroke-linecap="round"/>'; });
      return o + '</g>';
    }
    function mascaraElos(id, elos, folga) {
      var o = '<mask id="' + id + '" maskUnits="userSpaceOnUse" ' + VB + '><rect ' + VB + ' style="fill:#fff"/>';
      elos.forEach(function (e) { if (e.t === 'b') o += '<path d="' + e.d + '" style="fill:none;stroke:#000" stroke-width="' + (e.w + (folga || 2.6)) + '" stroke-linecap="round"/>'; });
      return o + '</mask>';
    }
    /* corrente fechada em volta do disco, no raio r: 'pares' elos deitados alternados com elos de pé */
    function elosAro(r, pares, lenA, hw, W, We, pula) {
      var elos = [], passo = 360 / pares, arco = 2 * Math.PI * r / pares;
      for (var k = 0; k < pares; k++) {
        if (pula && pula(k)) continue;
        var a = -90 + k * passo, c = L(a, r, 0);
        elos.push({ t: 'a', d: anelF(c[0], c[1], a + 90, lenA, hw), w: W, k: k });
        var b = a + passo / 2, cb = L(b, r, 0);
        if (!(pula && pula(k + .5))) elos.push({ t: 'b', d: barraF(cb[0], cb[1], b + 90, arco - lenA + 2 * hw - We), w: We, k: k + .5 });
      }
      return elos;
    }

    /* ================= 5. Rosário do Clérigo ================= */
    var C5 = {};
    var U5 = 59, NP = 5;   // as pérolas vão de U5 até a última; acesas até U5 + frac × (UF5 − U5)
    var CRUZ5 = 173;       // centro da cruz (o pé desce até a última pérola)
    var CONTAS5 = (function () {
      var out = [], u = U5;
      for (var k = 0; k < NP; k++) { var s = 6.8 + 1.8 * k / (NP - 1); u += s; out.push({ u: u, s: s }); u += s + 2.6; }
      return out;
    })();
    var UF5 = CONTAS5[NP - 1].u + CONTAS5[NP - 1].s;
    // braços da cruz latina: [ângulo relativo, comprimento]; o pé (para o centro) é o mais longo
    var BRACOS5 = [[0, 20], [180, 26], [90, 21], [-90, 21]];
    // luz do alto à esquerda: +1 numa face voltada para lá, -1 na oposta
    function luz(ang) { return Math.cos((ang + 135) * Math.PI / 180); }
    function tom(k, fc, fe) { return k >= 0 ? 'rgba(255,255,255,' + (k * fc).toFixed(3) + ')' : 'rgba(0,0,0,' + (-k * fe).toFixed(3) + ')'; }

    /* meio braço de cruz gótica (lado b >= 0 se s = 1): haste, farpa para trás em asa de morcego, pétala lateral e ponta */
    function meioBraco(C, th, n, s, w) {
      var f = .8;
      function q(a, b) { return Pt(F(C[0], C[1], th, a, s * b)); }
      return 'M' + q(0, 0) + 'L' + q(n, 0) +
        'Q' + q(n - 3 * f, 1.1 * f) + ' ' + q(n - 5.6 * f, Math.max(w, 3 * f)) +    // flanco côncavo da ponta
        'L' + q(n - 2.4 * f, 7.8 * f) +                                               // pétala lateral, espinho para fora
        'Q' + q(n - 6.6 * f, 6.4 * f) + ' ' + q(n - 8.8 * f, 4.9 * f) +
        'L' + q(n - 13 * f, 9.2 * f) +                                                // farpa para trás, em asa de morcego
        'Q' + q(n - 12.4 * f, 5.4 * f) + ' ' + q(n - 14 * f, w) +
        'L' + q(w + 1, w) + 'Z';
    }
    function cruz5(g, I) {
      var am = g.am, top = g.top, C = L(am, CRUZ5, 0), o = '', silh = '', facetas = '';
      var w = 3.5;
      BRACOS5.forEach(function (b) {
        var th = am + b[0], n = b[1];
        [1, -1].forEach(function (s) {
          var d = meioBraco(C, th, n, s, w);
          silh += d;
          facetas += '<path d="' + d + '" style="fill:' + tom(luz(th + s * 90), top ? .42 : .3, top ? .3 : .42) + '"/>';
        });
      });
      // losango central e nimbo
      var los = '', pl = [0, 90, 180, 270].map(function (k) { return F(C[0], C[1], am + k, 8, 0); });
      for (var k = 0; k < 4; k++) {
        var a = pl[k], bb = pl[(k + 1) % 4], ang = Math.atan2((a[1] + bb[1]) / 2 - C[1], (a[0] + bb[0]) / 2 - C[0]) * 180 / Math.PI;
        los += '<path d="M' + Pt(C) + 'L' + Pt(a) + 'L' + Pt(bb) + 'Z" style="fill:' + tom(luz(ang), top ? .5 : .34, top ? .34 : .5) + '"/>';
      }
      var losD = 'M' + Pt(pl[0]) + 'L' + Pt(pl[1]) + 'L' + Pt(pl[2]) + 'L' + Pt(pl[3]) + 'Z';
      var base = top ? '#f2ede0' : '#cdc5b2';
      if (top) o += '<g clip-path="url(#' + I.dentro + ')">' + circ(C, 32, 'fill:rgba(255,255,255,.55)', ' filter="url(#' + I.glowL + ')"') + '</g>';
      o += '<g transform="translate(2 3)" opacity=".95" filter="url(#' + I.sombra + ')"><path d="' + silh + losD + '" style="fill:#000"/>' + circ(C, 13.5, 'fill:none;stroke:#000', ' stroke-width="2.4"') + '</g>';
      // nimbo vazado atrás dos braços
      o += circ(C, 13.5, 'fill:none;stroke:#000', ' stroke-width="4"') + '<g filter="url(#' + I.bevP + ')">' + circ(C, 13.5, 'fill:none;stroke:' + base, ' stroke-width="2.4"') + '</g>';
      o += '<path d="' + silh + '" style="fill:' + base + ';stroke:#15130f" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="' + silh + '" style="fill:' + base + '"/>' + facetas +
        '<path d="' + losD + '" style="fill:' + base + ';stroke:#15130f" stroke-width="1.2" stroke-linejoin="round"/>' + los;
      // aresta viva no eixo de cada braço
      BRACOS5.forEach(function (b) {
        var th = am + b[0], n = b[1];
        o += '<path d="M' + Pt(F(C[0], C[1], th, 8.2, 0)) + 'L' + Pt(F(C[0], C[1], th, n - .5, 0)) + '" style="stroke:rgba(255,255,255,' + (top ? .7 : .35) + ')" stroke-width=".6"/>';
      });
      o += gema(C, 3.4, g, I, top);
      if (top) {
        var sp = F(C[0], C[1], am - 45, 13.5, 0);
        o += brilho(sp[0], sp[1], 11, 'rgba(255,255,255,.95)') + circ(sp, 1.6, 'fill:#fff');
      }
      return o;
    }


    /* ================= 6. Elos da Bênção ================= */
    var C6 = {};
    var U6 = 58, UF6 = 148, UK = 156;   // a corrente vai de U6 a UF6 (forjada até U6 + frac × (UF6 − U6)); a asa nasce em UK
    function rnd(a, b) { var x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return x - Math.floor(x); }

    // os elos de um raio: deitados de 22 e de pé entre eles, com o comprimento de cada um em u
    function elos6(am) {
      var out = [], hw = 6.8, W = 5.2, We = 5.8;
      [56, 85, 114].forEach(function (s, k) {
        out.push({ t: 'a', d: anel(am, s, s + 22, hw), w: W, u1: s, u2: s + 22, c: s + 11, len: 22, hw: hw, k: 2 * k });
        var b1 = s + 16.5 + We / 2, b2 = s + 34.5 - We / 2;
        if (k === 2) b2 = UF6 - We / 2 + 3;
        out.push({ t: 'b', d: reta(am, b1, b2), w: We, u1: b1 - We / 2, u2: b2 + We / 2, c: (b1 + b2) / 2, len: b2 - b1, k: 2 * k + 1 });
      });
      return out;
    }
    // um elo partido: o deitado abre uma fresta, o de pé se quebra em dois; ambos tortos e soltos
    function eloPartido(e, g, am, I) {
      var r1 = rnd(g.i + 1, e.k + 1), r2 = rnd(g.i + 7, e.k + 3), r3 = rnd(g.i + 3, e.k + 11);
      var dv = (r1 - .5) * 9, du = 2 + r2 * 4, giro = (r3 < .5 ? -1 : 1) * (16 + r2 * 26);
      var c = L(am, e.c + du, dv), th = am + giro, d, dash;
      if (e.t === 'a') {
        d = anelF(c[0], c[1], th, e.len, e.hw);
        var per = 2 * (e.len - 2 * e.hw) + 2 * Math.PI * e.hw, fr = 7 + r1 * 5;
        dash = f1(per - fr) + ' ' + f1(fr);
      } else {
        d = barraF(c[0], c[1], th, e.len + 2);
        dash = f1((e.len + 2) * .42) + ' ' + f1(3.4) + ' ' + f1(e.len * 2);
      }
      var cap = e.t === 'b' ? ' stroke-linecap="round"' : '';
      return {
        sombra: '<path d="' + d + '" transform="translate(1.6 2.4)" style="fill:none;stroke:rgba(0,0,0,.8)" stroke-width="' + (e.w + 1) + '" stroke-dasharray="' + dash + '"' + cap + '/>',
        elo: '<path d="' + d + '" style="fill:none;stroke:#4a4d53" stroke-width="' + e.w + '" stroke-dasharray="' + dash + '"' + cap + '/>'
      };
    }

    /* a asa de morcego (um lado, s = ±1), como a do medalhão: borda de ataque para fora, recortes da membrana para dentro.
       Aberta k (0 a 1): os pontos giram em volta da raiz, caindo para o centro (asa fechada) quando k diminui. */
    var SC6 = 1.17;
    var ASA = { S: [3, 5], W: [15, 25], T: [21.5, 23], F: [[8, 50], [-6, 46], [-15, 33], [-14, 18]], B: [-8, 5] };
    function asa6(am, s, k) {
      var K = UK;
      function q(p) {
        var r = Math.hypot(p[0], p[1]) * SC6, f = Math.atan2(p[1], p[0]), f2 = Math.PI - (Math.PI - f) * k, rr = r * (.86 + .14 * k);
        return Pt(L(am, K + rr * Math.cos(f2), s * rr * Math.sin(f2)));
      }
      function mid(a, b, t) { return [(a[0] + b[0]) / 2 + (ASA.W[0] - (a[0] + b[0]) / 2) * t, (a[1] + b[1]) / 2 + (ASA.W[1] - (a[1] + b[1]) / 2) * t]; }
      var F_ = ASA.F, memb = 'M' + q(ASA.S) + 'L' + q(ASA.W) + 'L' + q(F_[0]);
      for (var j = 1; j < 4; j++) memb += 'Q' + q(mid(F_[j - 1], F_[j], .36)) + ' ' + q(F_[j]);
      memb += 'Q' + q([-4, 13]) + ' ' + q(ASA.B) + 'Z';
      var ossos = 'M' + q(ASA.S) + 'L' + q(ASA.W), dedos = '';
      F_.forEach(function (f) { dedos += 'M' + q(ASA.W) + 'L' + q(f); });
      var dobras = '';
      for (var m = 1; m < 4; m++) dobras += 'M' + q(ASA.W) + 'L' + q(mid(F_[m - 1], F_[m], .4));
      var garra = 'M' + q([13.5, 23]) + 'L' + q(ASA.T) + 'L' + q([16.5, 27]) + 'Z';
      return { memb: memb, ossos: ossos, dedos: dedos, dobras: dobras, garra: garra };
    }
    function asas6(g, I) {
      var am = g.am, top = g.top, k = .58 + .42 * g.frac, o = '', A = [asa6(am, 1, k), asa6(am, -1, k)];
      var memb = A[0].memb + A[1].memb, osso = A[0].ossos + A[1].ossos, dedo = A[0].dedos + A[1].dedos, garra = A[0].garra + A[1].garra;
      var K = L(am, UK, 0);
      if (top) o += '<g clip-path="url(#' + I.dentro + ')">' + circ(L(am, UK + 4, 0), 46, 'fill:rgba(255,255,255,.5)', ' filter="url(#' + I.glowL + ')"') + '</g>';
      // sombra
      o += '<g transform="translate(2.2 3.2)" opacity=".9" filter="url(#' + I.sombra + ')"><path d="' + memb + garra + '" style="fill:#000"/></g>';
      // membrana de marfim, ossos em relevo por cima
      var mb = top ? '#e9e2cf' : '#7a7468', ob = top ? '#fbf8f0' : '#c9c2af';
      o += '<g filter="url(#' + (top ? I.bev : I.bevD) + ')"><path d="' + memb + '" style="fill:' + mb + '"/></g>';
      o += '<path d="' + A[0].dobras + A[1].dobras + '" style="fill:none;stroke:rgba(0,0,0,' + (top ? .22 : .3) + ')" stroke-width=".9"/>';
      o += '<path d="' + memb + '" style="fill:none;stroke:rgba(0,0,0,.55)" stroke-width=".8"/>';
      o += '<g filter="url(#' + I.bevP + ')"><path d="' + osso + '" style="fill:none;stroke:' + ob + '" stroke-width="3.6" stroke-linecap="round"/>' +
        '<path d="' + dedo + '" style="fill:none;stroke:' + ob + '" stroke-width="2.1" stroke-linecap="round"/>' +
        '<path d="' + garra + '" style="fill:' + ob + '"/></g>';
      // a joia da raiz: engaste de marfim com a pedra na cor do agrupamento
      o += circ([K[0] + 1.2, K[1] + 1.8], 8.6, 'fill:rgba(0,0,0,.8)');
      o += '<g filter="url(#' + (top ? I.bev : I.bevD) + ')">' + circ(K, 8, 'fill:' + (top ? '#ece6d6' : '#bdb6a4')) + '</g>';
      o += gema(K, 3.9, g, I, top);
      if (top) {
        var sp = L(am, UK + 17, -30);
        o += brilho(sp[0], sp[1], 10, 'rgba(255,255,255,.95)') + circ(sp, 1.5, 'fill:#fff');
        var sp2 = L(am, UK + 4, 52);
        o += brilho(sp2[0], sp2[1], 6, 'rgba(255,255,255,.85)');
      }
      return o;
    }

    // a corrente do aro se parte em três pontos, entre as asas
    var QUEBRAS6 = [7, 29, 44];
    function quebra6(k) { return QUEBRAS6.some(function (q) { return Math.abs(k - q) < .6; }); }

    MOTIVOS.clav6 = {
      deck: '02. Clavileño', nome: 'Elos da Bênção',
      desc: 'Oito correntes de prata saem do medalhão de Aclazotz até um par de asas de morcego de marfim, com uma pedra na cor do agrupamento. A parte forjada e polida da corrente acompanha a pontuação (o resto são elos partidos e apagados) e as asas se abrem na mesma medida; no maior, a corrente chega inteira e as asas se abrem por completo e brilham.',
      defs: function (ctx) {
        var I = C6;
        I.halo = ctx.uid('c6h'); I.mk = ctx.uid('c6m');
        return defsComuns(ctx, I, 'c6') +
          rg(I.halo, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="120"', [[.42, 'rgba(255,255,255,.14)'], [.66, 'rgba(255,255,255,.05)'], [1, 'rgba(255,255,255,0)']]) +
          mascaraElos(I.mk, elosAro(189, 58, 15.5, 4.3, 2.5, 3.1, quebra6), 2.2);
      },
      stage: function (ctx) {
        var I = C6, o = fundo(I, .34);
        o += '<circle cx="230" cy="230" r="120" style="fill:url(#' + I.halo + ')"/>';
        // gravação: o sol da Legião em volta do medalhão
        var raios = '';
        for (var t = 0; t < 32; t++) { var a = -90 + t * 11.25; raios += reta(a, 64, t % 2 ? 92 : 108); }
        o += '<path d="' + raios + '" style="stroke:rgba(255,255,255,.07)" stroke-width="1"/>';
        [116, 164].forEach(function (r) { o += '<circle cx="230" cy="230" r="' + r + '" style="fill:none;stroke:rgba(255,255,255,.06)" stroke-width="1"/>'; });
        o += '<circle cx="230" cy="230" r="186" style="fill:url(#' + I.vinheta + ')"/>';
        // o aro: canal negro entre filetes de marfim e a corrente partida em três pontos
        o += '<circle cx="230" cy="230" r="189" style="fill:none;stroke:#000" stroke-width="13"/>' +
          '<g filter="url(#' + I.bevD + ')"><circle cx="230" cy="230" r="189" style="fill:none;stroke:#1b1b1e" stroke-width="11.4"/></g>' +
          '<g filter="url(#' + I.bevP + ')"><circle cx="230" cy="230" r="182.2" style="fill:none;stroke:#cfc8b6" stroke-width="1.8"/>' +
          '<circle cx="230" cy="230" r="195" style="fill:none;stroke:#cfc8b6" stroke-width="1.8"/></g>';
        var elos = elosAro(189, 58, 15.5, 4.3, 2.5, 3.1, quebra6);
        o += sombraElos(elos, I, 1, 1.5) + corrente(elos, '#d0d3d8', I.bev, I.mk);
        // nas quebras, as pontas soltas: meio elo torto de cada lado
        QUEBRAS6.forEach(function (k) {
          [-1, 1].forEach(function (lado) {
            var a = -90 + (k + lado * .62) * 360 / 58, c = L(a, 188 - 2, 0), th = a + 90 + lado * 28;
            var d = anelF(c[0], c[1], th, 15.5, 4.3), per = 2 * (15.5 - 8.6) + 2 * Math.PI * 4.3;
            o += '<g filter="url(#' + I.bevP + ')"><path d="' + d + '" style="fill:none;stroke:#9a9ca2" stroke-width="2.5" stroke-dasharray="' + f1(per * .62) + ' ' + f1(per) + '" stroke-dashoffset="' + f1(lado > 0 ? 0 : per * .5) + '"/></g>';
          });
        });
        return o;
      },
      group: function (g, ctx) {
        var I = C6, am = g.am, top = g.top, rf = U6 + g.frac * (UF6 - U6), o = '';
        var elos = elos6(am), forj = elos.filter(function (e) { return e.u1 < rf - .5; }), part = elos.filter(function (e) { return e.u1 >= rf - .5; });
        var mk = ctx.uid('c6m'), cl = ctx.uid('c6c');
        o += mascaraElos(mk, forj) + '<clipPath id="' + cl + '"><circle cx="230" cy="230" r="' + f1(rf) + '"/></clipPath>';
        if (top) o += '<g clip-path="url(#' + I.dentro + ')"><path d="' + reta(am, 62, UF6) + '" style="fill:none;stroke:rgba(255,255,255,.35)" stroke-width="22" stroke-linecap="round" filter="url(#' + I.glowL + ')"/></g>';
        o += asas6(g, I);
        // os elos partidos, todos num só relevo (um filtro por raio)
        var ps = '', pe = '';
        part.forEach(function (e) { var x = eloPartido(e, g, am, I); ps += x.sombra; pe += x.elo; });
        if (part.length) o += '<g opacity=".62">' + ps + '<g filter="url(#' + I.bevD + ')">' + pe + '</g></g>';
        o += '<g clip-path="url(#' + cl + ')">' + sombraElos(forj, I) + corrente(forj, '#d6d9de', I.bev, mk) + '</g>';
        if (!top) {
          var f = L(am, rf, 0);
          o += circ(f, 8, 'fill:rgba(255,255,255,.6)', ' filter="url(#' + I.glow + ')"') +
            '<path d="M' + Pt(L(am, rf, -9.5)) + 'L' + Pt(L(am, rf, 9.5)) + '" style="stroke:rgba(255,255,255,.85)" stroke-width="1.3" stroke-linecap="round"/>' +
            brilho(f[0], f[1], 5, 'rgba(255,255,255,.95)');
        }
        return o;
      },
      center: function (ctx) {
        var I = C6, o = medalhao(ctx, I, false);
        // olhais de prata onde as correntes se prendem
        ctx.groups.forEach(function (g) {
          var p = L(g.am, 55, 0);
          o += circ([p[0], p[1] + .8], 5.6, 'fill:rgba(0,0,0,.8)') + '<g filter="url(#' + I.bevP + ')">' + circ(p, 4.6, 'fill:#c9ccd2') + '</g>' + circ(p, 1.5, 'fill:#0a0a0b');
        });
        return o;
      }
    };

    /* ================= 7. Armadura Transfigurada ================= */
    var C7 = {};
    var U7 = 56, UT7 = 182;   // a placa vai da borda do medalhão (U7) até U7 + frac × (UT7 − U7)
    // perfil de folha (0 a 1 ao longo da placa): talo estreito, barriga a 38%, ponta fina
    function folha(t) {
      if (t < .38) return .5 + .5 * Math.sin(t / .38 * Math.PI / 2);
      return Math.pow(Math.cos((t - .38) / .62 * Math.PI / 2), .8);
    }
    /* contorno de uma folha no raio am, de u0 a ut, meia largura W; 'asa' recorta a metade de fora em três arcos de asa de morcego */
    function contorno7(am, u0, ut, W, asa, v0) {
      var n = 44, esq = [], dir = [];
      for (var j = 0; j <= n; j++) {
        var t = j / n, u = u0 + (ut - u0) * t, h = W * folha(t);
        if (asa && t > .4 && t < .97) { var z = (t - .4) / .19; h *= 1 - .26 * Math.pow(Math.abs(Math.sin(Math.PI * z)), .6); }
        esq.push(Pt(L(am, u, (v0 || 0) - h))); dir.push(Pt(L(am, u, (v0 || 0) + h)));
      }
      return 'M' + esq.join('L') + 'L' + dir.reverse().join('L') + 'Z';
    }

    /* reflexo do verniz: um crescente fino rente à borda voltada para a luz (alto à esquerda) */
    function verniz7(am, u0, ut, W, asa) {
      var t0 = am * Math.PI / 180, lado = (Math.sin(t0) - Math.cos(t0)) > 0 ? 1 : -1, n = 36, fora = [], dentro = [];
      for (var j = 0; j <= n; j++) {
        var t = .06 + .8 * j / n, u = u0 + (ut - u0) * t, h = W * folha(t);
        if (asa && t > .4 && t < .97) { var z = (t - .4) / .19; h *= 1 - .26 * Math.pow(Math.abs(Math.sin(Math.PI * z)), .6); }
        var e = Math.sin(Math.PI * j / n);
        fora.push(Pt(L(am, u, lado * (h - 1.5)))); dentro.push(Pt(L(am, u, lado * (h - 1.5 - 1.8 * e))));
      }
      return 'M' + fora.join('L') + 'L' + dentro.reverse().join('L') + 'Z';
    }

  })();

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.clav6.legenda = { peca: "corrente", masc: false, texto: " é um agrupamento: a parte forjada vai do centro às asas em proporção à soma das notas, e na maior as asas se abrem por completo." };

  return MOTIVOS.clav6;
})();
