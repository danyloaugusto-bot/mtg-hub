/* Motivo "vigia" do gráfico de pontuação: 04. Assassin Creed, rebranding do lote 2, variação A (Olho de águia) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "vigia"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Protótipo do rebranding, 04. Assassin Creed (Irmandade Oculta), lote 2: torres de vigia em silhueta, salto de fé na mais alta.
   Cada critério é uma torre renascentista que nasce do anel da cidade e sobe para fora; a altura da pedra (da base até o
   topo) é a soma, linear com mínimo de 12% (raio(f) = topo da torre). A pedra é escura, quase silhueta; a cor do critério
   aparece só numa luz. A torre mais alta ganha a viga do ponto de observação, a águia e o rastro do salto de fé.
   Variações: A, olho de águia (a cidade vista de cima à noite, a cúpula do Duomo no centro; torres de vigia ameadas com o
   fogo de vigia na cor do critério); B, skyline ao pôr do sol (céu em gradiente do horizonte para a noite, anel de telhados,
   campanários negros com a janela do sino acesa na cor do critério); C, noite de lua (muralha em anel, campanários de pedra
   ao luar, o estandarte no mastro na cor do critério). */
var MOTIVO_PAINEL = (function () {
  var V = 'A';
  var R0 = 64, RMAX = 180;
  var I = {};
  function f1(n) { return (+n).toFixed(1); }
  function P(x, y) { return f1(x) + ' ' + f1(y); }
  function raio(f) { return R0 + (RMAX - R0) * Math.max(0.12, Math.min(1, f)); }
  function rot(a) { return 'translate(230 230) rotate(' + f1(a) + ')'; }
  function D(pts, z) { return 'M' + pts.map(function (p) { return P(p[0], p[1]); }).join('L') + (z ? 'Z' : ''); }
  function topo(ctx) { var b = 0; ctx.groups.forEach(function (g, k) { if (g.frac > ctx.groups[b].frac) b = k; }); return b; }

  /* ameias gibelinas (rabo de andorinha) ao longo do topo xT, de y0 a y1, n merlões; devolve a sequência de pontos */
  function ameias(xT, mh, y0, y1, n) {
    var pts = [], w = (y1 - y0) / (n * 2 - 1);
    for (var k = 0; k < n; k++) {
      var a = y0 + k * 2 * w, b = a + w, m = (a + b) / 2;
      pts.push([xT - mh, a], [xT, a], [xT - mh * 0.42, m], [xT, b], [xT - mh, b]);
    }
    return pts;
  }

  /* a torre deitada no eixo x (base em R0, topo em L). Devolve a silhueta e as medidas das partes. */
  function torre(L, hw, tipo) {
    var H = L - R0, k = Math.min(1, H / 62), wg = hw + 2.8, wb = hw - 1.8, o = { k: k, hw: hw, wg: wg, wb: wb, L: L };
    var pts = [], lado = [];
    if (tipo === 'vigia') {
      // torre de vigia: fuste, mísulas, galeria ameada no alto (o fogo arde entre as ameias)
      var mh = Math.max(2.4, 6.5 * k), gh = 8 * k + 2, xg = L - mh - gh;
      o.xg = xg; o.xt = L - mh; o.mh = mh;
      lado = [[R0 - 4, hw + 0.8], [xg - 3.5 * k, hw], [xg, wg]];
      lado.forEach(function (p) { pts.push([p[0], -p[1]]); });
      pts = pts.concat(ameias(L, mh, -wg, wg, 3).map(function (p, i) { return i === 0 ? [L - mh, -wg] : p; }));
      for (var i = lado.length - 1; i >= 0; i--) pts.push([lado[i][0], lado[i][1]]);
      o.d = D(pts, true);
      return o;
    }
    // campanário: fuste, mísulas, galeria ameada, sineira recuada, cornija e flecha com remate
    var mast = tipo === 'mastro' ? 9 * k + 3 : 0, Lp = L - mast;
    var sp = 19 * k, bh = 17 * k, cr = 2.5 * k, gh = 6.5 * k, mh = 3.6 * k, fin = 4 * k;
    var xg = Lp - (sp + bh + cr + gh + mh), xb = xg + gh, xc = xb + mh + bh, xs = xc + cr;
    xg = Math.max(R0 + 1, xg);
    o.xg = xg; o.xb = xb; o.xc = xc; o.xs = xs; o.Lp = Lp; o.bh = bh; o.mh = mh; o.fin = fin;
    var mw = wg - wb;
    lado = [[R0 - 4, hw + 0.8], [xg - 3 * k, hw], [xg, wg], [xb, wg], [xb + mh, wg], [xb + mh * 0.58, wg - mw / 2], [xb + mh, wb], [xc, wb],
      [xc, wb + 1.3], [xs, wb + 1.3], [xs, wb - 0.6], [Lp - fin, 0.9]];
    lado.forEach(function (p) { pts.push([p[0], -p[1]]); });
    for (var j = lado.length - 1; j >= 0; j--) pts.push([lado[j][0], lado[j][1]]);
    o.d = D(pts, true);
    o.abre = function (s) {
      // a abertura em arco da sineira (o topo do arco aponta para fora), escala s
      var x0 = xb + mh + bh * 0.16, x1 = xb + mh + bh * 0.86, ow = wb * 0.56 * s;
      x1 = x0 + (x1 - x0) * s;
      var xa = Math.max(x0 + 0.5, x1 - ow);
      return 'M' + P(x0, -ow) + 'L' + P(xa, -ow) + 'A' + f1(ow) + ' ' + f1(ow) + ' 0 0 1 ' + P(xa, ow) + 'L' + P(x0, ow) + 'Z';
    };
    return o;
  }

  /* águia vista de cima, cabeça para +x, envergadura ~30 */
  var AGUIA = (function () {
    var m = [[9, 0], [7, -1.1], [5, -1.6], [3.6, -2.4], [4.4, -6], [4.6, -10], [3.8, -14], [2.6, -17.5], [1.2, -19.5], [0.6, -17.6], [-0.8, -19.4],
      [-1.2, -17], [-2.6, -18.6], [-2.6, -15.8], [-4, -16.6], [-3.6, -13.6], [-4.6, -10], [-5.2, -6], [-4.4, -3], [-6, -2.8], [-11.5, -4.4], [-12.5, 0]];
    return m.concat(m.slice(1, -1).reverse().map(function (p) { return [p[0], -p[1]]; }));
  })();
  function aguia(x, y, ang, sc, cor, borda) {
    return '<g transform="translate(' + P(x, y) + ') rotate(' + f1(ang) + ') scale(' + sc + ')">' +
      '<path d="' + D(AGUIA, true) + '" style="fill:' + cor + ';stroke:' + borda + '" stroke-width=".7" stroke-linejoin="round"/>' +
      '<path d="M3.4 -4L1.6 -15M1.4 -4L-1 -14M-0.8 -4L-3 -12M3.4 4L1.6 15M1.4 4L-1 14M-0.8 4L-3 12" fill="none" stroke="' + borda + '" stroke-opacity=".45" stroke-width=".45"/>' +
      '<path d="M' + P(8.6, 0) + 'L' + P(6.6, -1.2) + 'L' + P(4.8, -1.5) + 'L' + P(4.8, 1.5) + 'L' + P(6.6, 1.2) + 'Z" fill="#efe6d6" opacity=".85"/>' +
      '<path d="M' + P(8.4, -0.6) + 'L' + P(9.6, 0) + 'L' + P(8.4, 0.6) + 'Z" fill="#e8b850"/></g>';
  }

  function defs(ctx) {
    var o = ctx.kit.defs(ctx, 'tr');
    I = { pedra: ctx.uid('trP'), pedraB: ctx.uid('trQ'), base: ctx.uid('trB'), ceu: ctx.uid('trC'), viv: ctx.uid('trV'), fogo: ctx.uid('trF'),
      disco: ctx.uid('trD'), duomo: ctx.uid('trU'), nevoa: ctx.uid('trN'), lua: ctx.uid('trL'), luar: ctx.uid('trM'), bl3: ctx.uid('trH') };
    var st = function (off, c, a) { return '<stop offset="' + off + '" stop-color="' + c + '"' + (a == null ? '' : ' stop-opacity="' + a + '"') + '/>'; };
    var reg = ' filterUnits="userSpaceOnUse" x="-58" y="-2" width="576" height="464"';
    o += '<filter id="' + I.bl3 + '"' + reg + '><feGaussianBlur stdDeviation="9"/></filter>';
    // a pedra, de lado a lado da torre (coordenadas locais): A e B escura, C ao luar (lado claro em -y; a outra versão vira o lado)
    var pedra = V === 'A' ? [['#7a5c40', 0], ['#2c241d', .12], ['#151110', .55], ['#0a0908', 1]]
      : V === 'B' ? [['#5a2c18', 0], ['#140f0e', .1], ['#0c0909', .6], ['#1d0f0b', .94], ['#3a1c12', 1]]
      : [['#8d93a6', 0], ['#5b6070', .16], ['#363a47', .55], ['#181a22', 1]];
    var g1 = '', g2 = '';
    pedra.forEach(function (s) { g1 += st(s[1], s[0]); });
    pedra.slice().reverse().forEach(function (s) { g2 += st(1 - s[1], s[0]); });
    o += '<linearGradient id="' + I.pedra + '" gradientUnits="userSpaceOnUse" x1="0" y1="-12" x2="0" y2="12">' + g1 + '</linearGradient>' +
      '<linearGradient id="' + I.pedraB + '" gradientUnits="userSpaceOnUse" x1="0" y1="-12" x2="0" y2="12">' + g2 + '</linearGradient>';
    // profundidade ao longo da torre: a base some na sombra (ou na névoa)
    o += '<linearGradient id="' + I.base + '" gradientUnits="userSpaceOnUse" x1="' + R0 + '" y1="0" x2="' + RMAX + '" y2="0">' +
      (V === 'C' ? st(0, '#0b0f18', .85) + st(.35, '#0b0f18', .25) + st(1, '#0b0f18', 0) : st(0, '#000', .7) + st(.4, '#000', .2) + st(1, '#000', 0)) + '</linearGradient>';
    o += '<radialGradient id="' + I.disco + '" cx="230" cy="230" r="56" gradientUnits="userSpaceOnUse">' +
      (V === 'C' ? st(0, '#0c1018') + st(.75, '#141a26') + st(1, '#26304a') : st(0, '#0a0807') + st(.75, '#16110e') + st(1, '#2c1f16')) + '</radialGradient>';
    if (V === 'A') {
      o += '<radialGradient id="' + I.ceu + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse">' + st(0, '#2e231b') + st(.6, '#1b1511') + st(1, '#0c0a08') + '</radialGradient>' +
        '<radialGradient id="' + I.duomo + '" cx="222" cy="214" r="64" gradientUnits="userSpaceOnUse">' + st(0, '#8a4429') + st(.55, '#5a2a18') + st(1, '#2a130b') + '</radialGradient>';
    } else if (V === 'B') {
      o += '<radialGradient id="' + I.ceu + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse">' +
        st(0, '#ffd27a') + st(.34, '#f7a24a') + st(.46, '#d9653a') + st(.6, '#9c3a3c') + st(.76, '#4c2342') + st(.9, '#24183a') + st(1, '#140f26') + '</radialGradient>';
    } else {
      o += '<radialGradient id="' + I.ceu + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse">' + st(0, '#2b3650') + st(.45, '#1c2438') + st(1, '#0a0d16') + '</radialGradient>' +
        '<radialGradient id="' + I.lua + '" cx=".38" cy=".34" r=".7">' + st(0, '#fffdf2') + st(.6, '#e6e8ee') + st(1, '#b8bfcf') + '</radialGradient>' +
        '<radialGradient id="' + I.luar + '">' + st(0, '#dfe8ff', .45) + st(.4, '#b9c8ea', .14) + st(1, '#b9c8ea', 0) + '</radialGradient>';
    }
    return o;
  }

  /* anel de telhados (B e C): perfil irregular de casas, cumeeiras e cúpulas entre r 56 e rTop */
  function telhados(ctx, rTop, cor, borda) {
    var K = ctx.kit, a = -90, pts = [], o = '';
    K.sorte(900);
    while (a < 270) {
      var w = 3 + K.sorte() * 5, h = rTop - 6 + K.sorte() * 6, tp = K.sorte();
      var b = Math.min(270, a + w);
      pts.push(ctx.pol(h, a));
      if (tp < 0.4) pts.push(ctx.pol(h + 2 + K.sorte() * 1.5, (a + b) / 2));        // cumeeira
      else if (tp < 0.5) { for (var t = 1; t < 6; t++) pts.push(ctx.pol(h + 6 * Math.sin(t / 6 * Math.PI), a + (b - a) * t / 6)); } // cúpula
      else if (tp < 0.58) { var c = (a + b) / 2; pts.push(ctx.pol(h, c - 0.6), ctx.pol(h + 4.5, c - 0.4), ctx.pol(h + 4.5, c + 0.4), ctx.pol(h, c + 0.6)); } // chaminé/torreta
      pts.push(ctx.pol(h, b));
      a = b;
    }
    var ring = 'M' + pts.map(function (p) { return P(p[0], p[1]); }).join('L') + 'Z';
    var ins = 52;
    o += '<path d="' + ring + 'M' + P(230 + ins, 230) + 'A' + ins + ' ' + ins + ' 0 1 0 ' + P(230 - ins, 230) + 'A' + ins + ' ' + ins + ' 0 1 0 ' + P(230 + ins, 230) + 'Z" fill-rule="evenodd" style="fill:' + cor + '"/>';
    if (borda) o += '<path d="' + ring + '" fill="none" style="stroke:' + borda + '" stroke-width=".8"/>';
    return o;
  }

  function stage(ctx) {
    var K = ctx.kit, Rd = ctx.R + 10, o = '', k, i;
    if (V === 'A') {
      // a cidade vista de cima, à noite: quarteirões de telha, ruas em anel e avenidas, lampiões
      o += '<circle cx="230" cy="230" r="' + Rd + '" style="fill:url(#' + I.ceu + ')"/>';
      var tel = ['#4a3226', '#44301f', '#503628', '#3e2a1f', '#4b3424'], blocos = '', cume = '', lamp = '';
      K.sorte(77);
      var aneis = [[66, 10], [80, 12], [96, 12], [112, 13], [129, 13], [146, 13], [163, 12], [179, 11]];
      aneis.forEach(function (an, ai) {
        var r = an[0], h = an[1], a = -90 + K.sorte() * 4;
        while (a < 266) {
          var w = (8 + K.sorte() * 10) / r * 57.3, gap = (2.2 + K.sorte() * 1.8) / r * 57.3;
          if (K.sorte() < 0.08) { a += w + gap; continue; }   // praça
          var am = a + w / 2, len = w / 57.3 * r;
          var cor = tel[Math.floor(K.sorte() * tel.length)];
          blocos += '<g transform="' + rot(am) + '"><rect x="' + f1(r) + '" y="' + f1(-len / 2) + '" width="' + f1(h - 2.4) + '" height="' + f1(len) + '" fill="' + cor + '"/></g>';
          cume += '<g transform="' + rot(am) + '"><path d="M' + P(r + (h - 2.4) / 2, -len / 2 + 0.6) + 'V' + f1(len / 2 - 0.6) + '" stroke="#a87250" stroke-opacity=".22" stroke-width=".6"/>' +
            '<rect x="' + f1(r + (h - 2.4) / 2) + '" y="' + f1(-len / 2) + '" width="' + f1((h - 2.4) / 2) + '" height="' + f1(len) + '" fill="#000" opacity=".14"/></g>';
          if (K.sorte() < 0.16) { var pl = ctx.pol(r - 1.2, a + w + gap / 2); lamp += '<circle cx="' + f1(pl[0]) + '" cy="' + f1(pl[1]) + '" r="1.1"/>'; }
          a += w + gap;
        }
      });
      o += '<g opacity=".3">' + blocos + '</g><g>' + cume + '</g>' +
        '<g fill="#ffcf7a" opacity=".55" filter="url(#' + ctx.k.brilho2 + ')">' + lamp + '</g><g fill="#fff1c8" opacity=".75">' + lamp.replace(/r="1.1"/g, 'r=".5"') + '</g>';
      // a noite por cima: escurece a cidade, mais na borda
      o += '<circle cx="230" cy="230" r="' + Rd + '" fill="#07060a" opacity=".3"/>' +
        '<circle cx="230" cy="230" r="' + (Rd - 8) + '" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="18" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<circle cx="230" cy="230" r="' + Rd + '" fill="none" style="stroke:rgba(var(--gold-rgb),.45)" stroke-width="1.2"/>';
    } else if (V === 'B') {
      // céu do pôr do sol: o horizonte quente no anel da cidade, a noite na borda, nuvens finas e as primeiras estrelas
      o += '<circle cx="230" cy="230" r="' + Rd + '" style="fill:url(#' + I.ceu + ')"/>';
      K.sorte(55);
      var nuv = '';
      for (k = 0; k < 9; k++) {
        var rn = 104 + K.sorte() * 40, an0 = -90 + K.sorte() * 360, an1 = an0 + 22 + K.sorte() * 40, p0 = ctx.pol(rn, an0), p1 = ctx.pol(rn, an1);
        nuv += '<path d="M' + P(p0[0], p0[1]) + 'A' + f1(rn) + ' ' + f1(rn) + ' 0 0 1 ' + P(p1[0], p1[1]) + '" stroke-width="' + f1(2 + K.sorte() * 3.5) + '"/>';
      }
      o += '<g fill="none" stroke="#ffb27a" stroke-opacity=".35" stroke-linecap="round" filter="url(#' + ctx.k.brilho2 + ')">' + nuv + '</g>';
      var est = '';
      for (k = 0; k < 46; k++) { var ps = ctx.pol(150 + K.sorte() * 40, -90 + K.sorte() * 360); est += '<circle cx="' + f1(ps[0]) + '" cy="' + f1(ps[1]) + '" r="' + f1(0.35 + K.sorte() * 0.6) + '" opacity="' + f1(0.3 + K.sorte() * 0.6) + '"/>'; }
      o += '<g fill="#fff6e6">' + est + '</g>';
      o += '<circle cx="230" cy="230" r="' + Rd + '" fill="none" stroke="#0a0712" stroke-opacity=".6" stroke-width="10" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<circle cx="230" cy="230" r="' + Rd + '" fill="none" style="stroke:rgba(var(--gold-rgb),.5)" stroke-width="1.2"/>';
      // o anel de telhados em contraluz
      o += telhados(ctx, 78, '#0b0807', 'rgba(255,170,90,.35)');
    } else {
      // noite de lua: céu azul-escuro, estrelas, a lua no vão mais aberto entre as torres, névoa na base e a muralha em anel
      o += '<circle cx="230" cy="230" r="' + Rd + '" style="fill:url(#' + I.ceu + ')"/>';
      K.sorte(31);
      var es = '';
      for (k = 0; k < 70; k++) { var pe = ctx.pol(96 + K.sorte() * 92, -90 + K.sorte() * 360); es += '<circle cx="' + f1(pe[0]) + '" cy="' + f1(pe[1]) + '" r="' + f1(0.3 + K.sorte() * 0.65) + '" opacity="' + f1(0.25 + K.sorte() * 0.6) + '"/>'; }
      o += '<g fill="#eef3ff">' + es + '</g>';
      var m = luaPos(ctx);
      o += '<circle cx="' + f1(m[0]) + '" cy="' + f1(m[1]) + '" r="46" fill="url(#' + I.luar + ')"/>' +
        '<circle cx="' + f1(m[0]) + '" cy="' + f1(m[1]) + '" r="10.5" fill="url(#' + I.lua + ')"/>' +
        '<g fill="#9aa3b8" opacity=".35"><circle cx="' + f1(m[0] - 3) + '" cy="' + f1(m[1] + 2) + '" r="2.4"/><circle cx="' + f1(m[0] + 3.4) + '" cy="' + f1(m[1] - 2.6) + '" r="1.5"/><circle cx="' + f1(m[0] + 2) + '" cy="' + f1(m[1] + 4.4) + '" r="1.1"/></g>';
      o += '<circle cx="230" cy="230" r="' + Rd + '" fill="none" stroke="#04060c" stroke-opacity=".7" stroke-width="12" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<circle cx="230" cy="230" r="' + Rd + '" fill="none" stroke="#b9c4dc" stroke-opacity=".45" stroke-width="1.2"/>';
      // névoa baixa em volta da cidade
      o += '<circle cx="230" cy="230" r="84" fill="none" stroke="#c7d3ee" stroke-opacity=".16" stroke-width="22" filter="url(#' + I.bl3 + ')"/>';
      o += telhados(ctx, 74, '#0e121b', 'rgba(185,200,235,.3)');
      // a muralha: anel de pedra com ameias
      var mur = '', nM = 72;
      for (i = 0; i < nM; i++) { var b0 = -90 + i * 360 / nM, b1 = b0 + 360 / nM * 0.55; mur += '<path d="M' + ctx.P(66, b0) + 'L' + ctx.P(69.5, b0) + 'L' + ctx.P(69.5, b1) + 'L' + ctx.P(66, b1) + 'Z"/>'; }
      o += '<circle cx="230" cy="230" r="61" fill="none" stroke="#2a3040" stroke-width="10"/>' +
        '<circle cx="230" cy="230" r="65.6" fill="none" stroke="#8c96ad" stroke-opacity=".5" stroke-width=".8"/>' +
        '<g fill="#2a3040">' + mur + '</g>';
    }
    return o;
  }

  /* a lua (C) fica no meio do vão entre as duas torres vizinhas mais baixas */
  function luaPos(ctx) {
    var n = ctx.NG, best = 0, bv = 9;
    for (var i = 0; i < n; i++) { var v = ctx.groups[i].frac + ctx.groups[(i + 1) % n].frac; if (v < bv) { bv = v; best = i; } }
    var a = -90 + (best + 1) * ctx.step, r = Math.max(raio(ctx.groups[best].frac), raio(ctx.groups[(best + 1) % n].frac)) * 0.5 + 72;
    r = Math.min(150, Math.max(120, r));
    return ctx.pol(r, a);
  }

  function group(g, ctx) {
    var K = ctx.kit, L = raio(g.frac), sd = 40 + g.i * 13;
    K.sorte(sd);
    var hw = 10 + K.sorte() * 1.6, tipo = V === 'A' ? 'vigia' : V === 'C' ? 'mastro' : 'sino';
    var t = torre(L, hw, tipo), full = torre(RMAX, hw, tipo), alto = g.i === topo(ctx);
    var cl = ctx.uid('trK'), o = '<g transform="' + rot(g.am) + '">';
    // lado iluminado (C: o lado voltado para a lua)
    var grad = I.pedra;
    if (V === 'C') { var mp = luaPos(ctx), ma = Math.atan2(mp[1] - 230, mp[0] - 230) * 180 / Math.PI; if (Math.sin((ma - g.am) * Math.PI / 180) > 0) grad = I.pedraB; }
    // fantasma: a torre cheia, tracejada
    o += '<path d="' + full.d + '" fill="none" stroke="' + (V === 'C' ? '#c9d3ea' : '#e8c98a') + '" stroke-opacity=".22" stroke-width="1" stroke-dasharray="3 3"/>';
    // a torre mais alta: o halo do ponto de observação
    if (alto) o += '<circle cx="' + f1(L - 16) + '" cy="0" r="24" fill="' + (V === 'C' ? '#dfe8ff' : '#ffe2a0') + '" opacity="' + (V === 'B' ? .3 : .2) + '" filter="url(#' + I.bl3 + ')"/>';
    // o brilho da luz do critério fica atrás da pedra: aura em volta, sem tingir a torre
    if (V === 'A') o += '<circle cx="' + f1(t.xt + 3) + '" cy="0" r="' + f1(15 + 9 * t.k) + '" style="fill:' + g.rgba(.6) + ';mix-blend-mode:screen" filter="url(#' + ctx.k.brilho + ')"/>';
    if (V === 'B') o += '<circle cx="' + f1(t.xb + t.mh + t.bh * 0.5) + '" cy="0" r="' + f1(12 + 9 * t.k) + '" style="fill:' + g.rgba(.55) + ';mix-blend-mode:screen" filter="url(#' + ctx.k.brilho + ')"/>';
    // sombra projetada
    o += '<path d="' + t.d + '" fill="#000" opacity=".55" transform="translate(-1 3)" filter="url(#' + ctx.k.brilho2 + ')"/>';
    // a pedra
    o += '<clipPath id="' + cl + '"><path d="' + t.d + '"/></clipPath>' +
      '<path d="' + t.d + '" style="fill:url(#' + grad + ')" filter="url(#' + ctx.k.textura + ')"/>' +
      '<g clip-path="url(#' + cl + ')">';
    // fiadas de pedra e cunhais
    var fi = '';
    for (var x = R0 + 4; x < L - 2; x += 4.2) fi += 'M' + P(x, -18) + 'L' + P(x, 18);
    o += '<path d="' + fi + '" stroke="' + (V === 'C' ? '#0b0d14' : '#000') + '" stroke-opacity="' + (V === 'C' ? .35 : .4) + '" stroke-width=".45"/>' +
      '<path d="M' + P(R0, -hw + 1.6) + 'L' + P(t.xg, -hw + 1.6) + 'M' + P(R0, hw - 1.6) + 'L' + P(t.xg, hw - 1.6) + '" stroke="#fff" stroke-opacity="' + (V === 'C' ? .12 : .05) + '" stroke-width=".6"/>';
    // seteiras no fuste
    var nj = Math.floor((t.xg - R0 - 10) / 17), set = '';
    for (var j = 0; j < nj; j++) { var xj = R0 + 14 + j * 17; set += '<path d="M' + P(xj, -1.1) + 'L' + P(xj + 4.4, -1.1) + 'A1.1 1.1 0 0 1 ' + P(xj + 4.4, 1.1) + 'L' + P(xj, 1.1) + 'Z"/>'; }
    o += '<g fill="#000" opacity=".75">' + set + '</g>';
    // mísulas da galeria
    var mis = '';
    for (var q = -t.wg + 1.4; q < t.wg - 0.5; q += 2.6) mis += 'M' + P(t.xg - 2.6 * t.k, q) + 'L' + P(t.xg + 0.6, q);
    o += '<path d="' + mis + '" stroke="#000" stroke-opacity=".55" stroke-width=".7"/><path d="M' + P(t.xg + 0.4, -t.wg) + 'L' + P(t.xg + 0.4, t.wg) + '" stroke="#000" stroke-opacity=".6" stroke-width="1"/>';
    // profundidade: a base afunda na sombra
    o += '<rect x="' + (R0 - 6) + '" y="-20" width="' + f1(L - R0 + 8) + '" height="40" fill="url(#' + I.base + ')"/>';
    // C: o luar lambe as arestas do topo
    if (V === 'C') o += '<path d="' + t.d + '" fill="none" stroke="#dfe8ff" stroke-opacity=".28" stroke-width="1.2"/>';
    // A: a luz do fogo escorre pela pedra a partir do topo
    if (V === 'A') {
      var fg = ctx.uid('trG');
      o += '<linearGradient id="' + fg + '" gradientUnits="userSpaceOnUse" x1="' + f1(L) + '" y1="0" x2="' + f1(L - 16) + '" y2="0"><stop offset="0" style="stop-color:' + g.rgba(.45) + '"/><stop offset="1" style="stop-color:' + g.rgba(0) + '"/></linearGradient>' +
        '<rect x="' + f1(L - 40) + '" y="-20" width="44" height="40" fill="url(#' + fg + ')" style="mix-blend-mode:screen"/>';
    }
    o += '</g>';
    // contorno fino de recorte (contraluz)
    o += '<path d="' + t.d + '" fill="none" stroke="' + (V === 'B' ? '#ffb070' : V === 'C' ? '#9aa6c2' : '#b07a4a') + '" stroke-opacity="' + (V === 'B' ? .4 : .22) + '" stroke-width=".6"/>';

    // a luz do critério
    var lz = '<g style="mix-blend-mode:screen">';
    if (V === 'A') {
      // o fogo de vigia entre as ameias
      var fw = t.wg - 1.4, fh = 8 + 12 * t.k, x0 = t.xt - 2;
      K.sorte(sd + 5);
      // três línguas de fogo: a do meio mais alta, as do lado tortas para fora
      var lingua = function (y, h, wt, bend) {
        return 'M' + P(x0, y - wt) + 'C' + P(x0 + h * 0.45, y - wt * 1.15) + ' ' + P(x0 + h * 0.72, y + bend - wt * 0.25) + ' ' + P(x0 + h, y + bend) +
          'C' + P(x0 + h * 0.62, y + bend * 0.3 + wt * 0.5) + ' ' + P(x0 + h * 0.35, y + wt * 1.1) + ' ' + P(x0, y + wt) + 'Z';
      };
      var ls = [[0, 1, 0.42, (K.sorte() - 0.5) * 3], [-fw * 0.48, 0.62 + K.sorte() * 0.12, 0.34, -2.2], [fw * 0.48, 0.6 + K.sorte() * 0.14, 0.34, 2.2]];
      var chama = ls.map(function (l) { return lingua(l[0], fh * l[1], fw * l[2], l[3]); }).join('');
      var nuc = ls.map(function (l) { return lingua(l[0] * 0.8, fh * l[1] * 0.55, fw * l[2] * 0.5, l[3] * 0.5); }).join('');
      lz += '<path d="' + chama + '" style="fill:' + g.rgba(.9) + '" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<path d="' + chama + '" style="fill:' + g.cor + '" filter="url(#' + ctx.k.textura + ')"/>' +
        '<path d="' + nuc + '" fill="#fff" opacity=".9" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<path d="' + nuc + '" fill="#fffbe8" opacity=".85"/>';
      // fagulhas
      K.sorte(sd + 9);
      for (var s = 0; s < 3 + Math.round(3 * t.k); s++) lz += '<circle cx="' + f1(x0 + fh + 1 + K.sorte() * 6) + '" cy="' + f1((K.sorte() - 0.5) * fw * 1.6) + '" r="' + f1(0.4 + K.sorte() * 0.5) + '" fill="#fff" style="fill:' + g.rgba(1) + '"/>';
      o += lz + '</g>';
      // as ameias por cima do fogo (o fogo arde atrás do parapeito)
      var cp = ctx.uid('trA');
      o += '<clipPath id="' + cp + '"><rect x="' + f1(t.xt - 1.6) + '" y="-20" width="' + f1(t.mh + 3) + '" height="40"/></clipPath>' +
        '<g clip-path="url(#' + cp + ')"><path d="' + t.d + '" style="fill:url(#' + grad + ')"/>' +
        '<path d="' + t.d + '" fill="none" style="stroke:' + g.rgba(.8) + '" stroke-width=".8"/></g>';
    } else if (V === 'B') {
      // a janela do sino acesa: brilho largo, vidro na cor, núcleo claro e o sino em contraluz
      var ab = t.abre(1), ab2 = t.abre(0.6), xm = t.xb + t.mh + t.bh * 0.5;
      lz += '<path d="' + ab + '" style="fill:' + g.rgba(.95) + '" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<path d="' + ab + '" style="fill:' + g.cor + '" filter="url(#' + ctx.k.textura + ')"/>' +
        '<path d="' + ab2 + '" fill="#fff" opacity=".85" filter="url(#' + ctx.k.brilho2 + ')"/></g>';
      o += lz;
      if (t.bh > 8) {
        // o sino: boca virada para a base, alça para fora
        var bx = t.xb + t.mh + t.bh * 0.62, bw = t.wb * 0.42, bl = t.bh * 0.42;
        o += '<path d="M' + P(bx - bl * 0.5, -bw) + 'Q' + P(bx + bl * 0.15, -bw * 0.85) + ' ' + P(bx + bl * 0.5, -bw * 0.4) + 'L' + P(bx + bl * 0.5, bw * 0.4) + 'Q' + P(bx + bl * 0.15, bw * 0.85) + ' ' + P(bx - bl * 0.5, bw) + 'Z" fill="#120c0a"/>' +
          '<path d="M' + P(bx + bl * 0.5, 0) + 'L' + P(bx + bl * 0.5 + 1.6, 0) + '" stroke="#120c0a" stroke-width="1.6"/>';
      }
      // a flecha: remate em bola com a ponta
      o += '<circle cx="' + f1(t.Lp - t.fin * 0.7) + '" cy="0" r="' + f1(Math.max(0.6, 1.3 * t.k)) + '" fill="#0c0909"/><path d="M' + P(t.Lp - t.fin, 0) + 'L' + P(t.Lp, 0) + '" stroke="#0c0909" stroke-width=".8"/>';
    } else {
      // o estandarte: mastro no alto da flecha e o pano tremulando para o lado
      var xm0 = t.Lp - t.fin, xmT = L, sc = Math.max(0.72, t.k), fl = 21 * sc, fwid = 9 * sc;
      o += '<path d="M' + P(xm0, 0) + 'L' + P(xmT, 0) + '" stroke="#c9d3ea" stroke-opacity=".8" stroke-width=".9"/><circle cx="' + f1(xmT) + '" cy="0" r="' + f1(0.9 * sc + 0.3) + '" fill="#e8d9a8"/>';
      var xa = xmT - 0.6, xb2 = xa - fwid, side = (g.i % 2 ? 1 : -1), wave = function (u) { return Math.sin(u * Math.PI * 1.6) * 1.4 * sc; };
      var top = [], bot = [];
      for (var u = 0; u <= 1.0001; u += 0.2) { top.push([xa + wave(u), side * fl * u]); bot.push([xb2 + wave(u) * 1.1 + (u > 0.8 ? fwid * 0.0 : 0), side * fl * u]); }
      // cauda de andorinha na ponta
      var tip = [[xa + wave(1), side * fl], [(xa + xb2) / 2 + wave(1), side * (fl - 3.4 * sc)], [xb2 + wave(1) * 1.1, side * fl]];
      var pano = D(top.slice(0, -1).concat(tip).concat(bot.slice(0, -1).reverse()), true);
      var dobra = D(top.map(function (p, i2) { return [(p[0] + bot[i2][0]) / 2 + 0.6, p[1]]; }), false);
      lz += '<path d="' + pano + '" style="fill:' + g.rgba(.75) + '" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<path d="' + pano + '" style="fill:' + g.cor + '" filter="url(#' + ctx.k.textura + ')"/>' +
        '<path d="' + dobra + '" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="' + f1(1.1 * sc) + '" stroke-linecap="round" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<path d="' + dobra + '" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="' + f1(0.4 * sc) + '" stroke-linecap="round"/></g>';
      o += lz + '<path d="' + pano + '" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".4"/>';
      // janela da sineira escura
      o += '<path d="' + t.abre(1) + '" fill="#06080d" opacity=".85"/>';
    }

    // a mais alta: viga do ponto de observação, a águia e o salto de fé
    if (alto) {
      var xv = V === 'A' ? t.xg + 1 : t.xb + 0.6, yv = t.wg, side2 = 1;
      o += '<path d="M' + P(xv, side2 * (yv - 1)) + 'L' + P(xv, side2 * (yv + 11)) + '" stroke="#3a2a1c" stroke-width="2.2" stroke-linecap="square"/>' +
        '<path d="M' + P(xv + 0.7, side2 * (yv - 1)) + 'L' + P(xv + 0.7, side2 * (yv + 11)) + '" stroke="#a07a52" stroke-opacity=".7" stroke-width=".6"/>';
      // o rastro do salto: da ponta da viga, mergulha rente à torre até a base
      var yj = side2 * (yv + 11), fen = R0 + 12;
      o += '<path d="M' + P(xv, yj) + 'C' + P(xv + 6, yj + side2 * 8) + ' ' + P(xv - 30, yj + side2 * 14) + ' ' + P(fen + 4, side2 * (yv + 9)) + '" fill="none" stroke="#fff3d6" stroke-opacity=".75" stroke-width="1.3" stroke-dasharray="1.4 2.8" stroke-linecap="round"/>';
      // a águia em voo sobre a ponta da viga, de asas abertas
      var ec = V === 'C' ? '#2c3140' : V === 'B' ? '#120c0a' : '#2e2118', eb = V === 'C' ? '#c9d3ea' : V === 'B' ? '#ffb070' : '#e8c98a';
      var ex = Math.min(L - 4, xv + 12), ey = side2 * (yv + 22);
      o += '<circle cx="' + f1(ex) + '" cy="' + f1(ey) + '" r="16" fill="' + (V === 'B' ? '#ffd9a0' : '#fff1cc') + '" opacity="' + (V === 'B' ? .5 : .32) + '" filter="url(#' + ctx.k.brilho + ')"/>' +
        aguia(ex, ey, -28, 1.0, ec, eb);
    }
    return o + '</g>';
  }

  function center(ctx) {
    var o = '';
    var insignia = function (y, c) {
      return '<path d="M230 ' + (y - 11) + 'L242 ' + (y + 9) + 'L236.5 ' + (y + 9) + 'L230 ' + (y - 1) + 'L223.5 ' + (y + 9) + 'L218 ' + (y + 9) + 'Z" style="fill:' + c + '"/>' +
        '<path d="M226 ' + (y + 5) + 'H234" style="stroke:' + c + '" stroke-width="1.6" stroke-linecap="round"/>';
    };
    if (V === 'A') {
      // a cúpula do Duomo vista de cima: oito gomos de telha, nervuras de mármore e a lanterna
      var oct = [], nerv = '';
      for (var k = 0; k < 8; k++) { var a = -90 + 22.5 + k * 45; oct.push(ctx.pol(57, a)); var p1 = ctx.pol(57, a), p2 = ctx.pol(34, a); nerv += 'M' + P(p1[0], p1[1]) + 'L' + P(p2[0], p2[1]); }
      o += '<path d="' + D(oct, true) + '" fill="#000" opacity=".5" transform="translate(1.5 3)" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<path d="' + D(oct, true) + '" style="fill:url(#' + I.duomo + ')" filter="url(#' + ctx.k.textura + ')"/>' +
        '<path d="' + nerv + '" stroke="#efe6d6" stroke-opacity=".8" stroke-width="2.2"/>' +
        '<path d="' + D(oct, true) + '" fill="none" stroke="#efe6d6" stroke-opacity=".85" stroke-width="2"/>' +
        '<circle cx="230" cy="230" r="42" fill="#0b0705" opacity=".62" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<circle cx="230" cy="230" r="34" fill="none" stroke="#efe6d6" stroke-opacity=".35" stroke-width="1"/>' + insignia(190, '#efe6d6');
      return o;
    }
    var aro = V === 'C' ? '#b9c4dc' : 'var(--gold)';
    o += '<circle cx="230" cy="232" r="58" fill="#000" opacity=".5" filter="url(#' + ctx.k.brilho2 + ')"/>' +
      '<circle cx="230" cy="230" r="55" style="fill:url(#' + I.disco + ');stroke:' + aro + '" stroke-width="1.6"/>' +
      '<circle cx="230" cy="230" r="50" fill="none" style="stroke:' + aro + '" stroke-opacity=".3" stroke-width=".8"/>' + insignia(190, V === 'C' ? '#d8deea' : 'var(--gold)');
    return o;
  }

  return {
    defs: defs, stage: stage, group: group, center: center, raio: raio,
    legenda: { peca: 'torre', masc: false, texto: V === 'A' ? ' é um critério: a torre sobe até a soma, o fogo de vigia arde no alto, e da mais alta a águia marca o salto de fé.'
      : V === 'B' ? ' é um critério: a torre sobe até a soma contra o pôr do sol, a janela do sino acende, e da mais alta a águia marca o salto de fé.'
      : ' é um critério: a torre sobe até a soma, o estandarte tremula no alto, e da mais alta a águia marca o salto de fé.' }
  };
})();
