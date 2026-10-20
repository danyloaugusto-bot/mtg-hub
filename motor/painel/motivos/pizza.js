/* Motivo "pizza" do gráfico de pontuação: 02. Turtle Power!, rebranding do lote 1, variação C (Caixa no esgoto) escolhida pelo dono em 19/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "pizza"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Protótipo do rebranding, 02. Turtle Power!, variação C: "Caixa no esgoto".
   Uma caixa de pizza aberta no chão do esgoto, com a tampa de bueiro no centro (o placar). As Tartarugas já atacaram: cada fatia
   foi mordida da borda para o centro, e o que sobrou (o comprimento da fatia, com a cobertura na cor do critério) é a soma.
   A fatia cheia mantém a borda de massa; nas outras, a mordida deixa a marca dos dentes e fios de queijo, e a gordura na caixa
   mostra onde a fatia inteira estava. */
var MOTIVO_PAINEL = (function () {
  var R_IN = 58, R_TOP = 184, LEN = R_TOP - R_IN, R_MOLHO = 168, R_MASSA = 173.5;
  var I = {};
  function f1(n) { return (+n).toFixed(1); }
  function clamp(f) { return Math.max(0, Math.min(1, f)); }
  function raio(f) { return R_IN + LEN * clamp(f); }
  function setor(K, r1, r2, a0, a1) {
    return 'M' + K.d([K.pt(a0, r1), K.pt(a0, r2)]).slice(1) + 'A' + r2 + ' ' + r2 + ' 0 0 1 ' + K.d([K.pt(a1, r2)]).slice(1) +
      'L' + K.d([K.pt(a1, r1)]).slice(1) + 'A' + r1 + ' ' + r1 + ' 0 0 0 ' + K.d([K.pt(a0, r1)]).slice(1) + 'Z';
  }
  function crosta(K, r, w, a0, a1) {
    var ro = r + w, ri = r - w;
    return 'M' + K.d([K.pt(a0, ro)]).slice(1) + 'A' + ro + ' ' + ro + ' 0 0 1 ' + K.d([K.pt(a1, ro)]).slice(1) + 'A' + w + ' ' + w + ' 0 0 1 ' + K.d([K.pt(a1, ri)]).slice(1) +
      'A' + ri + ' ' + ri + ' 0 0 0 ' + K.d([K.pt(a0, ri)]).slice(1) + 'A' + w + ' ' + w + ' 0 0 1 ' + K.d([K.pt(a0, ro)]).slice(1) + 'Z';
  }
  function arco(K, r, a0, a1) { return 'M' + K.d([K.pt(a0, r)]).slice(1) + 'A' + r + ' ' + r + ' 0 0 1 ' + K.d([K.pt(a1, r)]).slice(1); }
  /* caminho suave pelos pontos médios */
  function suave(P, fechar) {
    var n = P.length, o, i;
    function m(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
    if (fechar) {
      var s = m(P[n - 1], P[0]); o = 'M' + f1(s[0]) + ' ' + f1(s[1]);
      for (i = 0; i < n; i++) { var q = m(P[i], P[(i + 1) % n]); o += 'Q' + f1(P[i][0]) + ' ' + f1(P[i][1]) + ' ' + f1(q[0]) + ' ' + f1(q[1]); }
      return o + 'Z';
    }
    o = 'M' + f1(P[0][0]) + ' ' + f1(P[0][1]);
    for (i = 1; i < n - 1; i++) { var q2 = m(P[i], P[i + 1]); o += 'Q' + f1(P[i][0]) + ' ' + f1(P[i][1]) + ' ' + f1(q2[0]) + ' ' + f1(q2[1]); }
    return o + 'L' + f1(P[n - 1][0]) + ' ' + f1(P[n - 1][1]);
  }
  function topo(ctx) {
    var b = 0; ctx.groups.forEach(function (g, k) { if (g.frac > ctx.groups[b].frac) b = k; });
    return b;
  }
  function lim(ctx, i) { var a = -90 + i * ctx.step; return [a, a + ctx.step]; }

  /* a fatia de base: molho e borda de massa assada (com manchas de forno e farinha) */
  function molho(ctx, i) {
    var K = ctx.kit, L = lim(ctx, i), a0 = L[0] + 0.35, a1 = L[1] - 0.35, o = '', k;
    o += '<path d="' + setor(K, 0.1, R_MOLHO, a0, a1) + '" style="fill:url(#' + I.molho + ')" filter="url(#' + ctx.k.textura + ')"/>';
    K.sorte(500 + i);
    var orb = '', oleo = '';
    for (k = 0; k < 22; k++) {
      var a = a0 + 2 + K.sorte() * (a1 - a0 - 4), r = 62 + K.sorte() * 100, p = K.pt(a, r);
      orb += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + f1(0.5 + K.sorte() * 0.8) + '"/>';
    }
    for (k = 0; k < 5; k++) { var ao = a0 + 3 + K.sorte() * (a1 - a0 - 6), po = K.pt(ao, 75 + K.sorte() * 85); oleo += '<ellipse cx="' + f1(po[0]) + '" cy="' + f1(po[1]) + '" rx="' + f1(3 + K.sorte() * 5) + '" ry="' + f1(1.5 + K.sorte() * 2) + '"/>'; }
    return o + '<g style="fill:#ff9a72" opacity=".22" filter="url(#' + ctx.k.brilho2 + ')">' + oleo + '</g><g style="fill:#2f4a1c" opacity=".75">' + orb + '</g>';
  }
  /* borda de massa: arco grosso com pontas arredondadas, gradiente de forno, bolhas, manchas e farinha */
  function massa(ctx, i) {
    var K = ctx.kit, L = lim(ctx, i), c0 = L[0] + 3.4, c1 = L[1] - 3.4, crust = arco(K, R_MASSA, c0, c1), o = '', k;
    K.sorte(700 + i);
    o += '<path d="' + arco(K, R_MASSA - 9, c0 - 1, c1 + 1) + '" style="fill:none;stroke:#3a0c02" stroke-width="5" opacity=".6" filter="url(#' + ctx.k.brilho2 + ')"/>' +
      '<path d="' + crosta(K, R_MASSA, 11, c0, c1) + '" style="fill:#2a1004" opacity=".7" transform="translate(1 2)" filter="url(#' + ctx.k.brilho2 + ')"/>' +
      '<path d="' + crosta(K, R_MASSA, 10.5, c0, c1) + '" style="fill:url(#' + I.massa + ')" filter="url(#' + ctx.k.textura + ')"/>';
    var ch = '', fl = '', bub = '';
    for (k = 0; k < 9; k++) {
      var aa = c0 - 1 + K.sorte() * (c1 - c0 + 2), rr = R_MASSA - 6 + K.sorte() * 12, pp = K.pt(aa, rr);
      ch += '<ellipse cx="' + f1(pp[0]) + '" cy="' + f1(pp[1]) + '" rx="' + f1(1.4 + K.sorte() * 2.6) + '" ry="' + f1(0.9 + K.sorte() * 1.2) + '" transform="rotate(' + f1(aa + 90) + ' ' + f1(pp[0]) + ' ' + f1(pp[1]) + ')"/>';
    }
    for (k = 0; k < 6; k++) { var a2 = c0 + K.sorte() * (c1 - c0), p2 = K.pt(a2, R_MASSA - 4 + K.sorte() * 8); fl += '<circle cx="' + f1(p2[0]) + '" cy="' + f1(p2[1]) + '" r="' + f1(0.4 + K.sorte() * 0.5) + '"/>'; }
    for (k = 0; k < 3; k++) {
      var ab2 = c0 + K.sorte() * (c1 - c0), pb2 = K.pt(ab2, R_MASSA - 1 + K.sorte() * 4), sb = 1.8 + K.sorte() * 1.8;
      bub += '<ellipse cx="' + f1(pb2[0]) + '" cy="' + f1(pb2[1]) + '" rx="' + f1(sb * 1.5) + '" ry="' + f1(sb) + '" transform="rotate(' + f1(ab2 + 90) + ' ' + f1(pb2[0]) + ' ' + f1(pb2[1]) + ')" style="fill:#f0bd72;stroke:#4a1c06;stroke-opacity:.55" stroke-width=".8"/>';
    }
    return o + '<g style="fill:#4a1a04" opacity=".5">' + ch + '</g>' + bub + '<g style="fill:#fff3dc" opacity=".5">' + fl + '</g>' +
      '<path d="' + arco(K, R_MASSA - 2.5, c0, c1) + '" style="fill:none;stroke:#ffe2a8" stroke-width="2.6" stroke-linecap="round" opacity=".5" filter="url(#' + ctx.k.brilho2 + ')"/>';
  }
  function base(ctx, i) { return molho(ctx, i) + massa(ctx, i); }

  /* o queijo derretido de 58 até rf, com borda ondulada e gotas que escorrem sobre o molho */
  function queijo(ctx, g, rf) {
    var K = ctx.kit, L = lim(ctx, g.i), a0 = L[0] + 1.1, a1 = L[1] - 1.1, P = [], n = 9, k;
    K.sorte(100 + g.i);
    P.push(K.pt(a0, R_IN - 6));
    for (k = 0; k <= n; k++) {
      var a = a0 + (a1 - a0) * k / n, w = (k === 0 || k === n) ? -2 : (K.sorte() - 0.5) * 6;
      P.push(K.pt(a, rf + w));
    }
    P.push(K.pt(a1, R_IN - 6));
    var lado0 = [], lado1 = [];
    var d = 'M' + f1(P[0][0]) + ' ' + f1(P[0][1]) + 'L' + suave(P.slice(1, P.length - 1)).slice(1) + 'L' + f1(P[P.length - 1][0]) + ' ' + f1(P[P.length - 1][1]) + 'Z';
    var o = '<path d="' + d + '" style="fill:rgba(60,14,4,.55)" transform="translate(1.2 2)" filter="url(#' + ctx.k.brilho2 + ')"/>';
    // gotas: o queijo escorre além da borda
    var gotas = '';
    var ng = rf > 90 ? 3 : 2;
    for (k = 0; k < ng; k++) {
      var ag = a0 + 4 + K.sorte() * (a1 - a0 - 8), lg = 5 + K.sorte() * 7, wg = 2.6 + K.sorte() * 2.2;
      var b0 = K.pt(ag, rf - 3, -wg), b1 = K.pt(ag, rf - 3, wg), tip = K.pt(ag, rf + lg), mid0 = K.pt(ag, rf + lg * 0.75, -wg * 0.9), mid1 = K.pt(ag, rf + lg * 0.75, wg * 0.9);
      var c0g = K.pt(ag, rf + lg * 0.7, -wg * 1.05), c1g = K.pt(ag, rf + lg, -wg * 0.95), c2g = K.pt(ag, rf + lg, wg * 0.95), c3g = K.pt(ag, rf + lg * 0.7, wg * 1.05);
      gotas += 'M' + f1(b0[0]) + ' ' + f1(b0[1]) + 'C' + f1(c0g[0]) + ' ' + f1(c0g[1]) + ' ' + f1(c1g[0]) + ' ' + f1(c1g[1]) + ' ' + f1(tip[0]) + ' ' + f1(tip[1]) +
        'C' + f1(c2g[0]) + ' ' + f1(c2g[1]) + ' ' + f1(c3g[0]) + ' ' + f1(c3g[1]) + ' ' + f1(b1[0]) + ' ' + f1(b1[1]) + 'Z';
    }
    o += '<path d="' + d + gotas + '" style="fill:url(#' + I.queijo + ');stroke:#c07a22;stroke-opacity:.55" stroke-width=".9" filter="url(#' + ctx.k.textura + ')"/>';
    // bolhas tostadas e brilho de gordura
    var bo = '', br = '';
    for (k = 0; k < Math.round((rf - R_IN) / 7); k++) {
      var ab = a0 + 2 + K.sorte() * (a1 - a0 - 4), rb = R_IN + 6 + K.sorte() * Math.max(1, rf - R_IN - 10), pb = K.pt(ab, rb), s = 1 + K.sorte() * 2.2;
      bo += '<ellipse cx="' + f1(pb[0]) + '" cy="' + f1(pb[1]) + '" rx="' + f1(s * 1.3) + '" ry="' + f1(s) + '"/>';
      if (K.sorte() < 0.5) { var ph = K.pt(ab + 3, rb - 4); br += '<ellipse cx="' + f1(ph[0]) + '" cy="' + f1(ph[1]) + '" rx="' + f1(2 + s) + '" ry="' + f1(0.9 + s * 0.4) + '" transform="rotate(' + f1(ab + 90) + ' ' + f1(ph[0]) + ' ' + f1(ph[1]) + ')"/>'; }
    }
    o += '<g style="fill:#b46a1c" opacity=".45">' + bo + '</g><g style="fill:#fffbe6" opacity=".5" filter="url(#' + ctx.k.brilho2 + ')">' + br + '</g>';
    return o;
  }

  /* cobertura na cor do critério: cinco tipos (pepperoni, pimentão, azeitona, cogumelo, cubos), espalhados no queijo */
  function peca(tipo, x, y, rot, s, cor) {
    var T = ' transform="translate(' + f1(x) + ' ' + f1(y) + ') rotate(' + f1(rot) + ') scale(' + s + ')"';
    switch (tipo) {
      case 0: return '<g' + T + '><circle r="6.4" style="fill:' + cor + '"/><circle r="6.4" style="fill:url(#' + I.vol + ')"/><circle r="5.2" style="fill:none;stroke:rgba(0,0,0,.25)" stroke-width="1"/>' +
        '<circle cx="1.6" cy="1" r="1" style="fill:rgba(0,0,0,.22)"/><circle cx="-2" cy="2.2" r=".7" style="fill:rgba(0,0,0,.2)"/></g>';
      case 1: return '<g' + T + '><path d="M-6 2Q0 -6 6 2" style="fill:none;stroke:' + cor + '" stroke-width="3.4" stroke-linecap="round"/>' +
        '<path d="M-5 0.6Q0 -4.6 5 0.6" style="fill:none;stroke:#fff" stroke-width="1" stroke-linecap="round" opacity=".55"/></g>';
      case 2: return '<g' + T + '><circle r="4.4" style="fill:none;stroke:' + cor + '" stroke-width="3"/><circle r="4.4" style="fill:none;stroke:url(#' + I.vol + ')" stroke-width="3"/>' +
        '<path d="M-3.4 -2.2A4 4 0 0 1 1 -4" style="fill:none;stroke:#fff" stroke-width=".9" stroke-linecap="round" opacity=".7"/></g>';
      case 3: return '<g' + T + '><path d="M-5.6 0.4C-5.6 -5.4 5.6 -5.4 5.6 0.4Q3 1.4 1.8 1.2L2.2 5.4H-2.2L-1.8 1.2Q-3 1.4 -5.6 0.4Z" style="fill:' + cor + '"/>' +
        '<path d="M-5.6 0.4C-5.6 -5.4 5.6 -5.4 5.6 0.4Q3 1.4 1.8 1.2L2.2 5.4H-2.2L-1.8 1.2Q-3 1.4 -5.6 0.4Z" style="fill:url(#' + I.vol + ')"/>' +
        '<path d="M-3.6 -2.2Q0 -4.6 3.6 -2.2" style="fill:none;stroke:#fff" stroke-width=".8" opacity=".5"/></g>';
      default: return '<g' + T + '><rect x="-3.6" y="-3.2" width="7.2" height="6.4" rx="1.4" style="fill:' + cor + '"/><rect x="-3.6" y="-3.2" width="7.2" height="6.4" rx="1.4" style="fill:url(#' + I.vol + ')"/>' +
        '<path d="M-2.6 -2.2H2.2" style="stroke:#fff" stroke-width=".8" opacity=".6"/></g>';
    }
  }
  function cobertura(ctx, g, rf) {
    var K = ctx.kit, L = lim(ctx, g.i), a0 = L[0] + 1.1, a1 = L[1] - 1.1, tipo = g.i % 5, o = '', som = '', luz = '';
    K.sorte(300 + g.i);
    var r0f = Math.min(R_IN + 13, rf - 4);
    for (var r = r0f; r <= Math.max(r0f, rf - 6); r += 17) {
      var arcLen = (a1 - a0 - 6) * Math.PI / 180 * r, n = Math.max(1, Math.floor(arcLen / 19));
      for (var k = 0; k < n; k++) {
        var a = a0 + 3 + (a1 - a0 - 6) * (k + 0.5) / n + (K.sorte() - 0.5) * 5, rr = r + (K.sorte() - 0.5) * 5, p = K.pt(a, rr), rot = K.sorte() * 360, s = 1.15 + K.sorte() * 0.2;
        som += peca(tipo, p[0] + 1.3, p[1] + 1.8, rot, s, 'rgba(60,14,4,.6)');
        luz += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="7"/>';
        o += peca(tipo, p[0], p[1], rot, s, g.cor);
      }
    }
    return '<g filter="url(#' + ctx.k.brilho2 + ')">' + som + '</g>' +
      '<g style="fill:' + g.cor + ';mix-blend-mode:screen" opacity=".35" filter="url(#' + ctx.k.brilho + ')">' + luz + '</g>' + o;
  }

  /* mordidas: círculos que tiram a ponta da fatia; a borda que sobra fica em rf */
  function mordidas(ctx, g, rf) {
    var K = ctx.kit, L = lim(ctx, g.i), a0 = L[0], a1 = L[1], n = rf > 120 ? 3 : 2, out = [], rb = rf > 120 ? 15 : rf > 90 ? 13 : 9;
    K.sorte(600 + g.i);
    for (var k = 0; k < n; k++) {
      var a = a0 + (a1 - a0) * (k + 0.5) / n + (K.sorte() - 0.5) * 4, p = K.pt(a, rf + rb * 0.7 + (K.sorte() - 0.5) * 3);
      out.push([p[0], p[1], rb * (0.92 + K.sorte() * 0.2)]);
    }
    return out;
  }
  /* fios de queijo pendurados na mordida */
  function fiosMordida(ctx, g, bs) {
    var K = ctx.kit, o = '';
    K.sorte(650 + g.i);
    bs.forEach(function (b) {
      var dx = b[0] - 230, dy = b[1] - 230, m = Math.hypot(dx, dy), ux = dx / m, uy = dy / m;
      for (var k = 0; k < 1; k++) {
        if (K.sorte() < 0.4) continue;
        var lat = (K.sorte() - 0.5) * b[2] * 1.2, x0 = b[0] - ux * b[2] * 0.9 - uy * lat, y0 = b[1] - uy * b[2] * 0.9 + ux * lat, len = 7 + K.sorte() * 8;
        var x1 = x0 + ux * len - uy * lat * 0.2, y1 = y0 + uy * len + ux * lat * 0.2;
        o += '<path d="M' + f1(x0) + ' ' + f1(y0) + 'Q' + f1((x0 + x1) / 2 + 1.5) + ' ' + f1((y0 + y1) / 2 + 2) + ' ' + f1(x1) + ' ' + f1(y1) + '" style="fill:none;stroke:#eab04a" stroke-width="1.5" stroke-linecap="round"/>' +
          '<circle cx="' + f1(x1) + '" cy="' + f1(y1) + '" r="1.5" style="fill:#f4c868"/>';
      }
    });
    return o;
  }

  return {
    raio: raio,
    legenda: { peca: "fatia", masc: false, texto: " é um critério: as Tartarugas morderam da borda para o centro, e o que sobrou da fatia é a soma; a fatia cheia ainda tem a borda." },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'pz');
      I = { caixa: ctx.uid('pzC'), molho: ctx.uid('pzM'), massa: ctx.uid('pzA'), queijo: ctx.uid('pzQ'), vol: ctx.uid('pzV'), forma: ctx.uid('pzF'), tampa: ctx.uid('pzT'), grade: ctx.uid('pzG') };
      return o +
        '<radialGradient id="' + I.molho + '" cx="230" cy="230" r="' + (R_MOLHO + 2) + '" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d4482c"/><stop offset=".72" stop-color="#ab2a18"/><stop offset=".96" stop-color="#7a180b"/><stop offset="1" stop-color="#5a1006"/></radialGradient>' +
        '<radialGradient id="' + I.massa + '" cx="230" cy="230" r="' + (R_MASSA + 11) + '" gradientUnits="userSpaceOnUse">' +
          [[0, '#5a2408'], [.09, '#94481a'], [.22, '#c47430'], [.42, '#e09a4a'], [.6, '#c8782e'], [.82, '#8e4416'], [1, '#4a1c06']].map(function (e) {
            return '<stop offset="' + ((R_MASSA - 10.5 + e[0] * 21) / (R_MASSA + 11)).toFixed(3) + '" stop-color="' + e[1] + '"/>'; }).join('') + '</radialGradient>' +
        '<radialGradient id="' + I.queijo + '" cx=".42" cy=".4" r=".75"><stop offset="0" stop-color="#fff4c6"/><stop offset=".45" stop-color="#fbd977"/><stop offset=".85" stop-color="#efb446"/><stop offset="1" stop-color="#d9932c"/></radialGradient>' +
        '<radialGradient id="' + I.vol + '" cx=".34" cy=".3" r=".78"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset=".3" stop-color="#fff" stop-opacity=".08"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>' +
        '<radialGradient id="' + I.forma + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset=".9" stop-color="#1a1f1e"/><stop offset=".965" stop-color="#5b6563"/><stop offset=".985" stop-color="#9aa6a3"/><stop offset="1" stop-color="#2a3130"/></radialGradient>' +
        '<radialGradient id="' + I.tampa + '" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#3c4644"/><stop offset=".7" stop-color="#1c2422"/><stop offset="1" stop-color="#0c1110"/></radialGradient>' +
        '<linearGradient id="' + I.caixa + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a4128"/><stop offset=".5" stop-color="#46321e"/><stop offset="1" stop-color="#2c1f12"/></linearGradient>' +
        '<clipPath id="' + I.grade + '"><circle cx="230" cy="230" r="47"/></clipPath>';
    },
    stage: function (ctx) {
      var K = ctx.kit, o = '';
      // água do esgoto em volta e a caixa de papelão aberta
      o += '<rect x="22" y="22" width="416" height="416" rx="6" style="fill:rgba(var(--gold-rgb),.35)" filter="url(#' + ctx.k.brilho + ')" opacity=".5"/>' +
        '<rect x="28" y="28" width="404" height="404" rx="5" style="fill:url(#' + I.caixa + ')" filter="url(#' + ctx.k.textura + ')"/>' +
        '<rect x="28" y="28" width="404" height="404" rx="5" style="fill:none;stroke:#120c06" stroke-width="2"/>' +
        '<path d="M28 28L44 44H416L432 28M28 432L44 416H416L432 432M44 44V416M416 44V416" style="fill:none;stroke:#140e08" stroke-width="1.4" opacity=".8"/>' +
        '<path d="M45 45H415V415H45Z" style="fill:none;stroke:rgba(255,220,170,.08)" stroke-width="1"/>';
      var gr = '';
      K.sorte(77);
      for (var k = 0; k < 7; k++) { var x = 50 + K.sorte() * 360, y = 50 + K.sorte() * 360; gr += '<ellipse cx="' + f1(x) + '" cy="' + f1(y) + '" rx="' + f1(8 + K.sorte() * 18) + '" ry="' + f1(6 + K.sorte() * 12) + '"/>'; }
      o += '<g style="fill:#000" opacity=".22" filter="url(#' + ctx.k.brilho + ')">' + gr + '</g>' +
        '<circle cx="230" cy="230" r="186" style="fill:#000" opacity=".45" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<circle cx="230" cy="230" r="184" style="fill:#3a2412" opacity=".55"/>' +
        '<circle cx="230" cy="230" r="184" style="fill:none;stroke:#d9a865" stroke-width="1" stroke-dasharray="3 4" opacity=".22"/>';
      var mig = '';
      for (k = 0; k < 40; k++) { var p = K.pt(K.sorte() * 360, 70 + K.sorte() * 115); mig += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + f1(0.5 + K.sorte() * 1.4) + '"/>'; }
      return o + '<g style="fill:#c98a44" opacity=".45">' + mig + '</g>';
    },
    group: function (g, ctx) {
      var K = ctx.kit, cheia = g.frac >= 0.985, rf = cheia ? R_TOP : R_IN + LEN * K.comp(g.frac), L = lim(ctx, g.i), o = '';
      var sil = setor(K, 0.1, rf + 2, L[0] + 0.35, L[1] - 0.35);
      if (cheia) {
        return '<path d="' + sil + '" style="fill:rgba(0,0,0,.6)" transform="translate(2 3)" filter="url(#' + ctx.k.brilho + ')"/>' +
          molho(ctx, g.i) + massa(ctx, g.i) + queijo(ctx, g, R_MOLHO - 6) + cobertura(ctx, g, R_MOLHO - 6);
      }
      var bs = mordidas(ctx, g, rf), mk = ctx.uid('pzK');
      var m = '<mask id="' + mk + '" maskUnits="userSpaceOnUse" x="0" y="0" width="460" height="460"><path d="' + setor(K, 0.1, rf + 22, L[0] + 0.35, L[1] - 0.35) + '" style="fill:#fff"/>';
      bs.forEach(function (b) { m += '<circle cx="' + f1(b[0]) + '" cy="' + f1(b[1]) + '" r="' + f1(b[2]) + '" style="fill:#000"/>'; });
      // o resto da ponta, além das mordidas, também some
      m += '<path d="' + setor(K, rf + 6, 200, L[0], L[1]) + '" style="fill:#000"/></mask>';
      var aro = '';
      bs.forEach(function (b) { aro += '<circle cx="' + f1(b[0]) + '" cy="' + f1(b[1]) + '" r="' + f1(b[2]) + '"/>'; });
      o += m + '<g mask="url(#' + mk + ')"><path d="' + sil + '" style="fill:rgba(0,0,0,.55)" transform="translate(2 3)" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        molho(ctx, g.i) + queijo(ctx, g, R_MOLHO - 6) + cobertura(ctx, g, R_MOLHO - 6) +
        '<g style="fill:none;stroke:#b8741e" stroke-width="3.2" opacity=".9">' + aro + '</g><g style="fill:none;stroke:#fff1c0" stroke-width="1" opacity=".55">' + aro + '</g></g>' +
        fiosMordida(ctx, g, bs);
      return o;
    },
    center: function (ctx) {
      var o = '<circle cx="232" cy="234" r="58" style="fill:rgba(0,0,0,.6)" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<circle cx="230" cy="230" r="56" style="fill:url(#' + I.tampa + ');stroke:#0a0e0d" stroke-width="1.5"/>' +
        '<circle cx="230" cy="230" r="56" style="fill:none;stroke:rgba(var(--gold-rgb),.55)" stroke-width="2.4" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<circle cx="230" cy="230" r="51" style="fill:none;stroke:#56605e" stroke-width="1.6"/>' +
        '<circle cx="230" cy="230" r="49" style="fill:none;stroke:#0b100f" stroke-width="1"/>';
      var gr = '';
      for (var k = -48; k <= 48; k += 8) gr += 'M' + (230 + k) + ' 180V280M180 ' + (230 + k) + 'H280';
      o += '<g clip-path="url(#' + I.grade + ')"><path d="' + gr + '" style="fill:none;stroke:#2c3533" stroke-width="2.4"/><path d="' + gr + '" style="fill:none;stroke:#0e1312" stroke-width=".7" transform="translate(.8 .8)"/></g>' +
        '<circle cx="230" cy="236" r="33" style="fill:#0e1413" opacity=".82" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<ellipse cx="214" cy="200" rx="18" ry="6" style="fill:#fff" opacity=".08" transform="rotate(-30 214 200)"/>';
      return o;
    }
  };
})();
