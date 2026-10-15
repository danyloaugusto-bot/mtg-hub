/* Motivo "pilhas" do gráfico de pontuação: 03. Heads I win (Moeda Viciada), escolhido pelo dono na votação de 15/10/2026.
   Veio do protótipo motivos/heads.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "pilhas"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Heads I win, Moeda Viciada: cara ou coroa. Okaun e Zndrsplt, os Olhos do Caos e da Sabedoria, jogam moedas;
     a peça é o Krark's Thumb, o polegar do goblin Krark. Paleta de gibi gosmento: verde-ácido (var(--gold)) sobre ciano (var(--blood)).
     As moedas são de ouro de verdade (o tema não tem dourado: o "gold" deste deck é o verde-ácido). */

  function hdN(n) { return (+n).toFixed(1); }
  function hdPt(x, y) { return hdN(x) + ' ' + hdN(y); }

  /* ids dos gradientes deste desenho, únicos por gráfico */
  function hdDefs(ctx) {
    var I = ctx.hd = { ouroH: ctx.uid('hdOH'), ouroD: ctx.uid('hdOD'), ouroE: ctx.uid('hdOE'), face: ctx.uid('hdFa'),
      chao: ctx.uid('hdCh'), glow: ctx.uid('hdGl'), halo: ctx.uid('hdHa'), dots: ctx.uid('hdDo'), fade: ctx.uid('hdFd'), mask: ctx.uid('hdMa'),
      brilho: ctx.uid('hdBr'), campo: ctx.uid('hdCa'), sombra: ctx.uid('hdSo') };
    function st(o, c) { return '<stop offset="' + o + '" style="stop-color:' + c + '"/>'; }
    return '<linearGradient id="' + I.ouroH + '" x1="0" x2="1" y1="0" y2="0">' + st(0, '#5a3f10') + st(.1, '#a8802c') + st(.28, '#fff0bd') + st(.42, '#e8c66a') +
        st(.7, '#b18630') + st(.9, '#7a5719') + st(1, '#4a330b') + '</linearGradient>' +
      '<linearGradient id="' + I.ouroD + '" x1="0" y1="0" x2="1" y2="1">' + st(0, '#fff1c2') + st(.35, '#e6c262') + st(.7, '#a77b27') + st(1, '#5e4213') + '</linearGradient>' +
      '<linearGradient id="' + I.ouroE + '" x1="1" y1="1" x2="0" y2="0">' + st(0, '#fff1c2') + st(.4, '#d9b354') + st(1, '#5e4213') + '</linearGradient>' +
      '<radialGradient id="' + I.face + '" cx=".36" cy=".3" r=".8">' + st(0, 'rgba(255,255,255,.5)') + st(.45, 'rgba(255,255,255,.06)') + st(1, 'rgba(var(--deep-rgb),.4)') + '</radialGradient>' +
      '<radialGradient id="' + I.chao + '">' + st(0, 'rgba(var(--deep-rgb),.75)') + st(.6, 'rgba(var(--deep-rgb),.35)') + st(1, 'rgba(var(--deep-rgb),0)') + '</radialGradient>' +
      '<radialGradient id="' + I.sombra + '">' + st(.78, 'rgba(var(--deep-rgb),.6)') + st(1, 'rgba(var(--deep-rgb),0)') + '</radialGradient>' +
      '<radialGradient id="' + I.halo + '">' + st(0, 'rgba(var(--gold-rgb),.5)') + st(1, 'rgba(var(--gold-rgb),0)') + '</radialGradient>' +
      '<radialGradient id="' + I.campo + '" cx=".4" cy=".35" r=".75">' + st(0, '#40381f') + st(1, '#17140b') + '</radialGradient>' +
      '<linearGradient id="' + I.brilho + '" x1="0" y1="0" x2="1" y2="1">' + st(.3, 'rgba(255,255,255,0)') + st(.46, 'rgba(255,255,255,.5)') + st(.54, 'rgba(255,255,255,.12)') + st(.62, 'rgba(255,255,255,0)') + '</linearGradient>' +
      '<filter id="' + I.glow + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<pattern id="' + I.dots + '" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="3.5" cy="3.5" r="1.15" style="fill:rgba(var(--blood-rgb),.55)"/></pattern>' +
      '<radialGradient id="' + I.fade + '" cx="230" cy="230" r="194" gradientUnits="userSpaceOnUse">' + st(.35, '#000') + st(.8, '#666') + st(1, '#fff') + '</radialGradient>' +
      '<mask id="' + I.mask + '"><circle cx="230" cy="230" r="194" style="fill:url(#' + I.fade + ')"/></mask>';
  }

  /* palco: mesa escura com retícula de gibi em ciano, mais forte na borda, e um aro de gosma verde que escorre do alto */
  function hdStage(ctx) {
    var I = ctx.hd, R = ctx.R + 10;
    var o = '<circle cx="230" cy="230" r="' + R + '" style="fill:rgba(var(--deep-rgb),.62);stroke:rgba(var(--blood-rgb),.35)" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="' + R + '" style="fill:url(#' + I.dots + ')" mask="url(#' + I.mask + ')" opacity=".55"/>';
    // gosma: um aro verde de borda irregular; na metade de cima ela escorre em pingos que descem por gravidade
    var ri = [], NB = 120;
    for (var k = 0; k <= NB; k++) {
      var aa = k * 2 * Math.PI / NB, up = Math.max(0, -Math.sin(aa)), w = 2.8 + 2.6 * up * up + .45 * Math.sin(aa * 17 + 1) + .3 * Math.sin(aa * 29 + 2);
      ri.push(hdPt(230 + (R - w) * Math.cos(aa), 230 + (R - w) * Math.sin(aa)));
    }
    var gos = '<path d="M' + hdPt(230 + R, 230) + 'A' + R + ' ' + R + ' 0 1 1 ' + hdPt(230 - R, 230) + 'A' + R + ' ' + R + ' 0 1 1 ' + hdPt(230 + R, 230) + 'Z M' + ri.join('L') + 'Z" fill-rule="evenodd" style="fill:rgba(var(--gold-rgb),.82)"/>' +
      '<path d="M' + ri.slice(64, 112).join('L') + '" style="fill:none;stroke:rgba(255,255,255,.28)" stroke-width=".8"/>';
    var pingos = [[-156, 9], [-134, 16], [-117, 7], [-99, 21], [-76, 11], [-57, 17], [-36, 8], [-18, 12]];
    pingos.forEach(function (p) {
      var a = p[0] * Math.PI / 180, x = 230 + (R - 4) * Math.cos(a), y = 230 + (R - 4) * Math.sin(a), L = p[1], b = 2.1 + L * .05, nk = b * .55;
      gos += '<path d="M' + hdPt(x - b - 3, y - 1.5) + 'C' + hdPt(x - b, y) + ' ' + hdPt(x - nk, y + 2) + ' ' + hdPt(x - nk, y + L * .55) +
        'C' + hdPt(x - nk, y + L - b * 1.2) + ' ' + hdPt(x - b, y + L - b * .9) + ' ' + hdPt(x - b, y + L) +
        'A' + hdN(b) + ' ' + hdN(b) + ' 0 0 0 ' + hdPt(x + b, y + L) +
        'C' + hdPt(x + b, y + L - b * .9) + ' ' + hdPt(x + nk, y + L - b * 1.2) + ' ' + hdPt(x + nk, y + L * .55) +
        'C' + hdPt(x + nk, y + 2) + ' ' + hdPt(x + b, y) + ' ' + hdPt(x + b + 3, y - 1.5) + 'Z" style="fill:rgba(var(--gold-rgb),.82)"/>' +
        '<ellipse cx="' + hdN(x - b * .38) + '" cy="' + hdN(y + L - b * .2) + '" rx="' + hdN(b * .26) + '" ry="' + hdN(b * .4) + '" style="fill:rgba(255,255,255,.5)"/>';
    });
    return o + gos;
  }

  /* lateral de uma moeda em perspectiva (cilindro baixo): y = centro da elipse do topo */
  function hdLado(cx, y, rx, ry, t, g, I) {
    var d = 'M' + hdPt(cx - rx, y) + 'L' + hdPt(cx - rx, y + t) + 'A' + rx + ' ' + ry + ' 0 0 0 ' + hdPt(cx + rx, y + t) + 'L' + hdPt(cx + rx, y) +
      'A' + rx + ' ' + ry + ' 0 0 1 ' + hdPt(cx - rx, y) + 'Z';
    // ouro tingido pela cor do agrupamento: a mistura "color" troca o matiz e mantém o brilho do metal (cobre, prata, ouro verde...)
    var o = '<path d="' + d + '" style="fill:url(#' + I.ouroH + ')"/><path d="' + d + '" style="fill:' + g.cor + ';mix-blend-mode:color" opacity=".7"/>';
    // serrilha: ranhuras verticais que se adensam nas laterais, como numa moeda de verdade
    var N = 22, ln = '', lt = '';
    for (var j = 2; j < N - 1; j++) {
      var th = Math.PI * j / N, x = cx - rx * Math.cos(th), dy = ry * Math.sin(th);
      ln += 'M' + hdPt(x, y + dy + .6) + 'V' + hdN(y + t + dy - .4);
      lt += 'M' + hdPt(x + .55, y + dy + .6) + 'V' + hdN(y + t + dy - .4);
    }
    o += '<path d="' + ln + '" style="stroke:rgba(var(--deep-rgb),.42)" stroke-width=".55"/><path d="' + lt + '" style="stroke:rgba(255,255,255,.2)" stroke-width=".45"/>';
    // fresta escura entre uma moeda e a de baixo e o fio de luz da quina de cima
    o += '<path d="M' + hdPt(cx - rx, y + t) + 'A' + rx + ' ' + ry + ' 0 0 0 ' + hdPt(cx + rx, y + t) + '" style="fill:none;stroke:rgba(var(--deep-rgb),.7)" stroke-width=".9"/>' +
      '<path d="M' + hdPt(cx - rx + .5, y + .4) + 'A' + rx + ' ' + ry + ' 0 0 0 ' + hdPt(cx + rx - .5, y + .4) + '" style="fill:none;stroke:rgba(255,255,255,.35)" stroke-width=".7"/>';
    return o;
  }
  /* face de cima: aro de ouro e o centro na cor do agrupamento, com um olho cunhado (Okaun, o Olho do Caos) */
  function hdTopo(cx, y, rx, ry, g, I) {
    var o = '<ellipse cx="' + hdN(cx) + '" cy="' + hdN(y) + '" rx="' + rx + '" ry="' + ry + '" style="fill:url(#' + I.ouroD + ');stroke:rgba(var(--deep-rgb),.5)" stroke-width=".5"/>';
    var ix = rx * .8, iy = ry * .8;
    o += '<ellipse cx="' + hdN(cx) + '" cy="' + hdN(y) + '" rx="' + hdN(ix) + '" ry="' + hdN(iy) + '" style="fill:' + g.cor + '"/>' +
      '<ellipse cx="' + hdN(cx) + '" cy="' + hdN(y) + '" rx="' + hdN(ix) + '" ry="' + hdN(iy) + '" style="fill:url(#' + I.face + ');stroke:rgba(var(--deep-rgb),.45)" stroke-width=".7"/>';
    // olho em relevo, achatado pela perspectiva
    var ew = rx * .42, eh = ry * .34;
    o += '<path d="M' + hdPt(cx - ew, y) + 'Q' + hdPt(cx, y - eh * 2) + ' ' + hdPt(cx + ew, y) + 'Q' + hdPt(cx, y + eh * 2) + ' ' + hdPt(cx - ew, y) + 'Z" style="fill:rgba(var(--deep-rgb),.22);stroke:rgba(var(--deep-rgb),.5)" stroke-width=".6"/>' +
      '<ellipse cx="' + hdN(cx) + '" cy="' + hdN(y) + '" rx="' + hdN(ew * .32) + '" ry="' + hdN(eh * .95) + '" style="fill:rgba(var(--deep-rgb),.55)"/>' +
      '<path d="M' + hdPt(cx - ew * .9, y + .5) + 'Q' + hdPt(cx, y + eh * 2 + .6) + ' ' + hdPt(cx + ew * .9, y + .5) + '" style="fill:none;stroke:rgba(255,255,255,.4)" stroke-width=".5"/>';
    return o;
  }

  /* crescente afinado nas pontas: arco de movimento */
  function hdArco(cx, cy, r, a1, a2, w, cor) {
    function p(rr, a) { var t = a * Math.PI / 180; return hdPt(cx + rr * Math.cos(t), cy + rr * Math.sin(t)); }
    return '<path d="M' + p(r, a1) + 'A' + r + ' ' + r + ' 0 0 1 ' + p(r, a2) + 'A' + hdN(r * w) + ' ' + hdN(r * w) + ' 0 0 0 ' + p(r, a1) + 'Z" style="fill:' + cor + '"/>';
  }

  /* a moeda que salta girando: vista quase de lado, inclinada, com arcos de giro e riscos de subida */
  function hdSalto(x, y, g, I, sx) {
    var ry = 15.5, rx = 6, t = 4.4, o = '';
    o += '<circle cx="' + hdN(x) + '" cy="' + hdN(y) + '" r="27" style="fill:url(#' + I.halo + ')"/>';
    o += '<g transform="translate(' + hdPt(x, y) + ') scale(' + sx + ' 1) rotate(-28)">' +
      '<path d="M0 ' + (-ry) + 'A' + rx + ' ' + ry + ' 0 0 1 0 ' + ry + 'L' + t + ' ' + ry + 'A' + rx + ' ' + ry + ' 0 0 0 ' + t + ' ' + (-ry) + 'Z" style="fill:url(#' + I.ouroH + ')"/>';
    var ln = '';
    for (var j = 2; j < 15; j++) { var th = Math.PI * j / 16, yy = -ry * Math.cos(th), dx = rx * Math.sin(th); ln += 'M' + hdPt(dx + .5, yy) + 'H' + hdN(dx + t - .3); }
    o += '<path d="' + ln + '" style="stroke:rgba(var(--deep-rgb),.4)" stroke-width=".5"/>' +
      '<ellipse cx="0" cy="0" rx="' + rx + '" ry="' + ry + '" style="fill:url(#' + I.ouroD + ');stroke:rgba(var(--deep-rgb),.5)" stroke-width=".5"/>' +
      '<ellipse cx="0" cy="0" rx="' + hdN(rx * .78) + '" ry="' + hdN(ry * .8) + '" style="fill:' + g.cor + '"/>' +
      '<ellipse cx="0" cy="0" rx="' + hdN(rx * .78) + '" ry="' + hdN(ry * .8) + '" style="fill:url(#' + I.face + ');stroke:rgba(var(--deep-rgb),.4)" stroke-width=".6"/>' +
      '<path d="M' + hdPt(-rx * .45, -ry * .55) + 'Q' + hdPt(-rx * .7, 0) + ' ' + hdPt(-rx * .45, ry * .55) + '" style="fill:none;stroke:rgba(255,255,255,.55)" stroke-width="1" stroke-linecap="round"/></g>';
    // arcos de giro, em volta da moeda
    function m(a) { return sx > 0 ? a : 180 - a; }
    function arco(r, a1, a2, w, c) { return sx > 0 ? hdArco(x, y, r, a1, a2, w, c) : hdArco(x, y, r, m(a2), m(a1), w, c); }
    o += arco(22, 196, 252, 1.25, 'rgba(255,255,255,.5)') + arco(22, 16, 72, 1.25, 'rgba(255,255,255,.5)') +
      arco(26.5, 205, 238, 1.3, 'rgba(255,255,255,.25)') + arco(26.5, 25, 58, 1.3, 'rgba(255,255,255,.25)');
    return o;
  }

  MOTIVOS.heads1 = {
    deck: '03. Heads I win', nome: 'Pilhas de moedas',
    desc: 'Cada agrupamento é uma pilha de moedas de pé, de borda serrilhada em ouro tingido na cor do agrupamento; quanto maior a pontuação, mais moedas (até oito). No maior, a moeda do topo salta girando, como num cara ou coroa. No centro, uma moeda com o olho de Okaun e Zndrsplt.',
    defs: hdDefs,
    stage: hdStage,
    group: function (g, ctx) {
      var I = ctx.hd, rx = 20.5, ry = 6.7, t = 7.2, NM = 8, a = g.am * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a);
      // cada pilha tem o seu chão; o desnível entre as fileiras abre espaço para a moeda que salta
      var dy = sn < -0.7 ? 41 : sn < 0 ? 18 : sn < 0.7 ? 40 : 37;
      var n = Math.max(1, Math.round(g.frac * NM));
      var bx = 230 + 122 * cs, by = 230 + 122 * sn + dy, o = '';
      o += '<ellipse cx="' + hdN(bx + 4) + '" cy="' + hdN(by + 1.5) + '" rx="' + (rx + 11) + '" ry="' + hdN(ry + 3) + '" style="fill:url(#' + I.chao + ')"/>';
      if (g.top) o += '<ellipse cx="' + hdN(bx) + '" cy="' + hdN(by - n * t / 2) + '" rx="' + (rx + 20) + '" ry="' + hdN(n * t / 2 + 20) + '" style="fill:url(#' + I.halo + ')"/>';
      for (var k = 0; k < n; k++) {
        var j = k === 0 ? 0 : (((g.i * 7 + k * 13) % 5) - 2) * .5, y = by - (k + 1) * t, cx = bx + j;
        o += hdLado(cx, y, rx, ry, t, g, I);
        o += hdTopo(cx, y, rx, ry, g, I);
      }
      if (g.top) {
        var yt = by - n * t - ry, sx = cs >= 0 ? 1 : -1, jx = bx + sx * 15, jy = yt - 26;
        o += hdSalto(jx, jy, g, I, sx);
        o += '<path d="M' + hdPt(bx + sx * 2, yt - 3) + 'l' + hdPt(sx * 2.2, -6) + 'M' + hdPt(bx + sx * 9, yt - 5) + 'l' + hdPt(sx * 2, -5.5) + 'M' + hdPt(bx - sx * 5, yt - 3) + 'l' + hdPt(sx * 1.6, -5) + '" style="stroke:rgba(255,255,255,.4)" stroke-width="1.1" stroke-linecap="round"/>';
      }
      return o;
    },
    center: function (ctx) {
      var I = ctx.hd;
      return '<circle cx="230" cy="230" r="' + (ctx.r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
        '<circle cx="230" cy="195" r="19" style="fill:url(#' + I.halo + ')"/>' + hdMoedaOlho(230, 195, 9, I);
    }
  };

  /* serrilha de moeda vista de frente: dentes quadrados em volta */
  function hdDentes(cx, cy, r, h, N) {
    var d = '', s = 360 / N;
    for (var j = 0; j < N; j++) {
      var a = j * s, pts = [[r, a + s * .08], [r, a + s * .5], [r - h, a + s * .62], [r - h, a + s * .96]];
      pts.forEach(function (p, q) { var t = p[1] * Math.PI / 180; d += (j === 0 && q === 0 ? 'M' : 'L') + hdPt(cx + p[0] * Math.cos(t), cy + p[0] * Math.sin(t)); });
    }
    return d + 'Z';
  }
  /* pequena moeda de frente com o olho (emblema do centro da opção 1) */
  function hdMoedaOlho(x, y, r, I) {
    return '<path d="' + hdDentes(x, y, r, 1, 30) + '" style="fill:url(#' + I.ouroD + ');stroke:rgba(var(--deep-rgb),.5)" stroke-width=".4"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + hdN(r * .72) + '" style="fill:rgb(var(--gold-rgb));stroke:rgba(var(--deep-rgb),.5)" stroke-width=".5"/>' +
      '<path d="M' + hdPt(x - r * .55, y) + 'Q' + hdPt(x, y - r * .62) + ' ' + hdPt(x + r * .55, y) + 'Q' + hdPt(x, y + r * .62) + ' ' + hdPt(x - r * .55, y) + 'Z" style="fill:var(--sheet2)"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + hdN(r * .2) + '" style="fill:rgb(var(--gold-rgb))"/>';
  }


  /* opção 2: uma moeda grande de frente por agrupamento, que se cunha como um relógio, do alto em sentido horário */

  /* estrela de brilho de quatro pontas */
  function hdBrilho(x, y, s) {
    return '<path d="M' + hdPt(x, y - s) + 'Q' + hdPt(x + s * .16, y - s * .16) + ' ' + hdPt(x + s, y) + 'Q' + hdPt(x + s * .16, y + s * .16) + ' ' + hdPt(x, y + s) +
      'Q' + hdPt(x - s * .16, y + s * .16) + ' ' + hdPt(x - s, y) + 'Q' + hdPt(x - s * .16, y - s * .16) + ' ' + hdPt(x, y - s) + 'Z" style="fill:rgba(255,255,255,.92)"/>';
  }

  /* o Krark's Thumb: polegar de goblin, verde, cortado na base com uma tira de couro, piparoteando uma moedinha */
  function hdPolegar(x, y, I) {
    var pele = 'fill:rgb(var(--gold-rgb));stroke:rgba(var(--deep-rgb),.75)';
    var o = '<g transform="translate(' + hdPt(x - 1, y) + ')">' +
      // polegar de pé, curvado para trás, com a unha
      '<path d="M-1.6 0.5C-1.9 -3 -1.4 -6.4 0.4 -8.2C1.6 -9.3 3.4 -9 3.9 -7.4C4.4 -5.6 3.6 -3.4 3.4 -0.5Z" style="' + pele + '" stroke-width=".6"/>' +
      '<path d="M1.2 -8.4C2.4 -8.9 3.5 -8.4 3.7 -7.1L3.5 -5.4C2.6 -5.2 1.6 -5.5 1 -6.2Z" style="fill:rgba(255,255,255,.6);stroke:rgba(var(--deep-rgb),.5)" stroke-width=".35"/>' +
      // punho: quatro dedos dobrados de frente
      '<path d="M-6.2 1.6C-6.4 0 -5.4 -0.6 -3.8 -0.4L3.2 -0.6C5 -0.6 5.8 0.6 5.6 2.4L5.4 6.6C5.3 7.8 4.4 8.4 3.2 8.4H-4C-5.6 8.4 -6.4 7.6 -6.3 6.2Z" style="' + pele + '" stroke-width=".6"/>' +
      '<path d="M-6.1 2.4H-0.8M-6.2 4.4H-0.6M-6.2 6.4H-0.8" style="stroke:rgba(var(--deep-rgb),.6)" stroke-width=".5"/>' +
      '<path d="M-0.8 0.2C0 1.5 0 6.5 -0.8 8.2" style="fill:none;stroke:rgba(var(--deep-rgb),.45)" stroke-width=".45"/>' +
      '<path d="M-5.2 0.6C-4.6 0.1 -3.6 0 -2.6 0.1" style="fill:none;stroke:rgba(255,255,255,.5)" stroke-width=".5"/>' +
      // punho de ouro onde o polegar foi cortado
      '<rect x="-5.6" y="8" width="10.6" height="2.6" rx=".7" style="fill:url(#' + I.ouroD + ');stroke:rgba(var(--deep-rgb),.6)" stroke-width=".35"/></g>';
    // a moedinha piparoteada, de lado
    o += '<g transform="translate(' + hdPt(x + 8.6, y - 6.2) + ') rotate(-35)"><ellipse rx="1.5" ry="3.6" style="fill:url(#' + I.ouroD + ');stroke:rgba(var(--deep-rgb),.55)" stroke-width=".35"/></g>' +
      '<path d="M' + hdPt(x + 5.4, y - 9.6) + 'q1.4 -1.6 3.2 -1.4M' + hdPt(x + 11.6, y - 2.6) + 'q.9 -1.6 .5 -3" style="fill:none;stroke:rgba(255,255,255,.45)" stroke-width=".5" stroke-linecap="round"/>';
    return o;
  }

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.heads1.legenda = { peca: "pilha", masc: false, texto: " é um agrupamento: tem mais moedas quanto maior a soma das notas (até oito), e na mais alta a moeda do topo salta." };

  return MOTIVOS.heads1;
})();
