/* Motivo "pilhas" do gráfico de pontuação: 03. Heads I win, rebranding (lotes 3 e 4), variação R (Mesa de carteado) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "pilhas"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* 03. Heads I win (Moeda Viciada), rebranding, segunda rodada, variação R (realismo): pilhas de moedas numa mesa de jogo.
   Mesmo conceito e composição do motivo "pilhas": uma pilha de moedas por critério, em volta do placar, e a moeda do topo
   da maior salta girando. O que muda é o material: feltro de mesa de carteado sob um lampião (a única luz, no alto do
   centro), borda de mogno envernizado, moedas de ouro velho com serrilha, aro em relevo e o olho do Okaun cunhado,
   gastas e um pouco desalinhadas. A sombra de cada pilha cai para fora, longe do lampião. A cor do critério sai das
   moedas e vira a cinta de papel de banco em volta da base da pilha. A moeda que salta tem rastro de movimento, sem brilho.
   Dado: o número de moedas é linear (até 11), com mínimo de 12% (uma moeda). */
var MOTIVO_PAINEL = (function () {
  var NM = 11, RX = 20, RY = 6.4, T = 5.6, RB = 122;
  var I = {};
  function n(v) { return (+v).toFixed(1); }
  function p(x, y) { return n(x) + ' ' + n(y); }
  function st(o, c, a) { return '<stop offset="' + o + '" stop-color="' + c + '"' + (a == null ? '' : ' stop-opacity="' + a + '"') + '/>'; }
  function moedas(f) { return Math.max(1, Math.round(Math.max(0.12, Math.min(1, f)) * NM)); }
  function rng(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }

  function defs(ctx) {
    ['lado', 'face', 'campo', 'feltro', 'luz', 'mogno', 'veio', 'trama', 'sb', 'sb2', 'rastro', 'cinta', 'couro', 'ouroS'].forEach(function (k) { I[k] = ctx.uid('hr' + k); });
    return '<linearGradient id="' + I.lado + '" x1="0" x2="1" y1="0" y2="0">' + st(0, '#3a2706') + st(.08, '#7d5a1c') + st(.24, '#e9cf86') + st(.32, '#fbefc4') + st(.42, '#d2a94e') + st(.7, '#9a7226') + st(.9, '#5e4210') + st(1, '#2e1f05') + '</linearGradient>' +
      '<linearGradient id="' + I.face + '" x1="0" y1="0" x2="1" y2="1">' + st(0, '#fbeec0') + st(.3, '#e2bf68') + st(.65, '#b28630') + st(1, '#6e4e14') + '</linearGradient>' +
      '<linearGradient id="' + I.campo + '" x1="0" y1="0" x2="1" y2="1">' + st(0, '#c99e48') + st(.5, '#b48834') + st(1, '#d8b462') + '</linearGradient>' +
      '<linearGradient id="' + I.ouroS + '" x1="0" y1="0" x2="1" y2="1">' + st(0, '#fbeec0') + st(.5, '#c9a04a') + st(1, '#5e4210') + '</linearGradient>' +
      // feltro verde-petróleo sob a luz do lampião: claro no meio, escuro na borda
      '<radialGradient id="' + I.feltro + '" cx="230" cy="215" r="200" gradientUnits="userSpaceOnUse">' + st(0, '#2c5a4c') + st(.45, '#1d4237') + st(.8, '#112922') + st(1, '#08130f') + '</radialGradient>' +
      '<filter id="' + I.trama + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="21" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 -.3" result="a"/><feComposite in="a" in2="SourceGraphic" operator="in"/></filter>' +
      '<linearGradient id="' + I.mogno + '" x1="0" y1="0" x2="1" y2="1">' + st(0, '#7a3a1c') + st(.25, '#4a1e0c') + st(.5, '#2a0f06') + st(.75, '#5a2610') + st(1, '#1c0a04') + '</linearGradient>' +
      '<filter id="' + I.veio + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .22" numOctaves="3" seed="4" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .05  0 0 0 0 .02  0 0 0 0 0  0 0 0 2.4 -1" result="a"/><feComposite in="a" in2="SourceGraphic" operator="in"/></filter>' +
      '<filter id="' + I.sb + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.2"/></filter>' +
      '<filter id="' + I.sb2 + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.1"/></filter>' +
      '<filter id="' + I.rastro + '" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation=".6 4"/></filter>' +
      // sombreado de cilindro da cinta de papel: escura nas laterais, clara onde a luz bate
      '<linearGradient id="' + I.cinta + '" x1="0" x2="1" y1="0" y2="0">' + st(0, '#000', .6) + st(.22, '#fff', .18) + st(.34, '#fff', .3) + st(.6, '#000', .05) + st(1, '#000', .62) + '</linearGradient>' +
      '<radialGradient id="' + I.couro + '" cx=".42" cy=".36" r=".72">' + st(0, '#2a2620') + st(.7, '#16130f') + st(1, '#0a0806') + '</radialGradient>';
  }

  function stage(ctx) {
    var o = '<circle cx="232" cy="234" r="200" fill="#000" opacity=".55" filter="url(#' + I.sb + ')"/>';
    // borda de mogno envernizado, com veio e o friso claro do verniz
    o += '<circle cx="230" cy="230" r="197" fill="url(#' + I.mogno + ')"/>' +
      '<circle cx="230" cy="230" r="197" fill="#000" filter="url(#' + I.veio + ')" opacity=".9"/>' +
      '<path d="M' + p(230 - 194, 230) + 'A194 194 0 0 1 ' + p(230 + 194, 230) + '" fill="none" stroke="#f0c8a0" stroke-opacity=".2" stroke-width="1.2"/>' +
      '<circle cx="230" cy="230" r="187.5" fill="none" stroke="#120604" stroke-width="2"/>';
    // o feltro e a trama
    o += '<circle cx="230" cy="230" r="186.5" fill="url(#' + I.feltro + ')"/>' +
      '<circle cx="230" cy="230" r="186.5" fill="#000" filter="url(#' + I.trama + ')" opacity=".55"/>' +
      '<circle cx="230" cy="230" r="186" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="5" filter="url(#' + I.sb2 + ')"/>';
    return o;
  }

  /* lateral de uma moeda (cilindro baixo), com a serrilha e a fresta para a de baixo */
  function lado(cx, y) {
    var d = 'M' + p(cx - RX, y) + 'L' + p(cx - RX, y + T) + 'A' + RX + ' ' + RY + ' 0 0 0 ' + p(cx + RX, y + T) + 'L' + p(cx + RX, y) + 'A' + RX + ' ' + RY + ' 0 0 1 ' + p(cx - RX, y) + 'Z';
    var o = '<path d="' + d + '" fill="url(#' + I.lado + ')"/>', ln = '', lt = '';
    for (var j = 1; j < 28; j++) {
      var th = Math.PI * j / 28, x = cx - RX * Math.cos(th), dy = RY * Math.sin(th);
      ln += 'M' + p(x, y + dy + .5) + 'V' + n(y + T + dy - .5);
      lt += 'M' + p(x + .45, y + dy + .5) + 'V' + n(y + T + dy - .5);
    }
    o += '<path d="' + ln + '" stroke="#2a1a04" stroke-opacity=".45" stroke-width=".45"/><path d="' + lt + '" stroke="#fff6d8" stroke-opacity=".18" stroke-width=".35"/>';
    o += '<path d="M' + p(cx - RX, y + T) + 'A' + RX + ' ' + RY + ' 0 0 0 ' + p(cx + RX, y + T) + '" fill="none" stroke="#1a1004" stroke-opacity=".85" stroke-width=".9"/>';
    return o;
  }
  /* face de cima: aro em relevo, campo fosco, o olho cunhado com luz do alto à esquerda, e riscos de uso */
  function face(cx, y, cheia, seed) {
    var o = '<ellipse cx="' + n(cx) + '" cy="' + n(y) + '" rx="' + RX + '" ry="' + RY + '" fill="url(#' + I.face + ')" stroke="#3a2706" stroke-opacity=".6" stroke-width=".4"/>';
    if (!cheia) return o;
    var ix = RX * .82, iy = RY * .82;
    o += '<ellipse cx="' + n(cx) + '" cy="' + n(y + .25) + '" rx="' + n(ix) + '" ry="' + n(iy) + '" fill="url(#' + I.campo + ')"/>' +
      '<path d="M' + p(cx - ix, y + .25) + 'A' + n(ix) + ' ' + n(iy) + ' 0 0 1 ' + p(cx + ix, y + .25) + '" fill="none" stroke="#4a330a" stroke-opacity=".7" stroke-width=".6"/>' +
      '<path d="M' + p(cx - ix, y + .25) + 'A' + n(ix) + ' ' + n(iy) + ' 0 0 0 ' + p(cx + ix, y + .25) + '" fill="none" stroke="#fff3c8" stroke-opacity=".6" stroke-width=".5"/>';
    // o olho em relevo, achatado pela perspectiva
    var ew = RX * .44, eh = RY * .36;
    var olho = 'M' + p(cx - ew, y) + 'Q' + p(cx, y - eh * 2) + ' ' + p(cx + ew, y) + 'Q' + p(cx, y + eh * 2) + ' ' + p(cx - ew, y) + 'Z';
    o += '<path d="' + olho + '" fill="#d8b25c"/>' +
      '<path d="M' + p(cx - ew, y) + 'Q' + p(cx, y - eh * 2) + ' ' + p(cx + ew, y) + '" fill="none" stroke="#fff4cc" stroke-opacity=".85" stroke-width=".6"/>' +
      '<path d="M' + p(cx - ew, y) + 'Q' + p(cx, y + eh * 2) + ' ' + p(cx + ew, y) + '" fill="none" stroke="#4a330a" stroke-opacity=".8" stroke-width=".6"/>' +
      '<ellipse cx="' + n(cx) + '" cy="' + n(y) + '" rx="' + n(ew * .3) + '" ry="' + n(eh * .95) + '" fill="#9a7226"/>' +
      '<path d="M' + p(cx - ew * .28, y - eh * .6) + 'A' + n(ew * .3) + ' ' + n(eh * .95) + ' 0 0 1 ' + p(cx + ew * .3, y) + '" fill="none" stroke="#3e2a08" stroke-opacity=".7" stroke-width=".45"/>';
    var r = rng(seed), sc = '';
    for (var k = 0; k < 5; k++) { var a = r() * Math.PI * 2, rr = r() * .7, x0 = cx + RX * rr * Math.cos(a), y0 = y + RY * rr * Math.sin(a), l = 2 + r() * 5, b = r() * Math.PI; sc += 'M' + p(x0, y0) + 'l' + p(l * Math.cos(b), l * Math.sin(b) * .32); }
    o += '<path d="' + sc + '" stroke="#fff8e0" stroke-opacity=".35" stroke-width=".3"/>';
    return o;
  }
  /* cinta de papel de banco na base da pilha, na cor do critério */
  function cinta(cx, yTop, h, g) {
    var rx = RX + .7, ry = RY + .25;
    var d = 'M' + p(cx - rx, yTop) + 'L' + p(cx - rx, yTop + h) + 'A' + rx + ' ' + ry + ' 0 0 0 ' + p(cx + rx, yTop + h) + 'L' + p(cx + rx, yTop) + 'A' + rx + ' ' + ry + ' 0 0 1 ' + p(cx - rx, yTop) + 'Z';
    return '<path d="' + d + '" style="fill:' + g.cor + '"/><path d="' + d + '" fill="url(#' + I.cinta + ')"/>' +
      '<path d="M' + p(cx - rx, yTop + h * .5) + 'A' + rx + ' ' + ry + ' 0 0 0 ' + p(cx + rx, yTop + h * .5) + '" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".5" stroke-dasharray="2 1.4"/>' +
      '<path d="M' + p(cx - rx, yTop) + 'A' + rx + ' ' + ry + ' 0 0 0 ' + p(cx + rx, yTop) + '" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".5"/>' +
      '<path d="M' + p(cx + 6, yTop + RY * .98) + 'l-.8 ' + n(h) + '" stroke="#000" stroke-opacity=".35" stroke-width=".7"/>';
  }
  /* a moeda que salta girando: quase de lado, inclinada, com o rastro borrado de onde veio */
  function salto(x, y, sx) {
    var ry = 15, rx = 5.6, t = 4.2, o = '', moeda = '';
    moeda += '<path d="M0 ' + (-ry) + 'A' + rx + ' ' + ry + ' 0 0 1 0 ' + ry + 'L' + t + ' ' + ry + 'A' + rx + ' ' + ry + ' 0 0 0 ' + t + ' ' + (-ry) + 'Z" fill="url(#' + I.lado + ')"/>';
    var ln = '';
    for (var j = 2; j < 15; j++) { var th = Math.PI * j / 16, yy = -ry * Math.cos(th), dx = rx * Math.sin(th); ln += 'M' + p(dx + .5, yy) + 'H' + n(dx + t - .3); }
    moeda += '<path d="' + ln + '" stroke="#2a1a04" stroke-opacity=".4" stroke-width=".45"/>' +
      '<ellipse cx="0" cy="0" rx="' + rx + '" ry="' + ry + '" fill="url(#' + I.face + ')" stroke="#3a2706" stroke-opacity=".6" stroke-width=".4"/>' +
      '<ellipse cx="0" cy="0" rx="' + n(rx * .8) + '" ry="' + n(ry * .82) + '" fill="url(#' + I.campo + ')"/>' +
      '<path d="M' + p(-rx * .2, -ry * .45) + 'Q' + p(-rx * .55, 0) + ' ' + p(-rx * .2, ry * .45) + 'Q' + p(rx * .15, 0) + ' ' + p(-rx * .2, -ry * .45) + 'Z" fill="#d8b25c" stroke="#4a330a" stroke-opacity=".6" stroke-width=".4"/>';
    var tr = 'translate(' + p(x, y) + ') scale(' + sx + ' 1) rotate(-28)';
    o += '<g transform="translate(0 9)" opacity=".35" filter="url(#' + I.rastro + ')"><g transform="' + tr + '">' + moeda + '</g></g>';
    o += '<g transform="' + tr + '">' + moeda + '</g>';
    return o;
  }

  return {
    legenda: { peca: "pilha", masc: false, texto: " é um critério: tem mais moedas quanto maior a soma (até onze), e da mais alta uma moeda salta." },
    defs: defs,
    stage: stage,
    group: function (g, ctx) {
      var a = g.am * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a);
      var dy = sn < -0.7 ? 41 : sn < 0 ? 18 : sn < 0.7 ? 40 : 37;
      var nm = moedas(g.frac), bx = 230 + RB * cs, by = 230 + RB * sn + dy, h = nm * T, o = '';
      var maxf = Math.max.apply(null, ctx.groups.map(function (x) { return x.frac; })), top = g.frac >= maxf && maxf > 0;
      // sombra: a luz vem do lampião no alto do centro, então a sombra corre para fora
      var ang = Math.atan2(by - 222, bx - 230), sl = 10 + h * .45, sxx = bx + Math.cos(ang) * sl * .55, syy = by + Math.sin(ang) * sl * .35 + 1;
      o += '<ellipse cx="' + n(sxx) + '" cy="' + n(syy) + '" rx="' + n(RX + sl * .45) + '" ry="' + n(RY + 2 + sl * .12) + '" transform="rotate(' + n(ang * 57.3 * .35) + ' ' + p(sxx, syy) + ')" fill="#000" opacity=".55" filter="url(#' + I.sb + ')"/>';
      o += '<ellipse cx="' + n(bx) + '" cy="' + n(by + .5) + '" rx="' + (RX + 1.5) + '" ry="' + n(RY + 1) + '" fill="#000" opacity=".7" filter="url(#' + I.sb2 + ')"/>';
      var xs = [];
      for (var k = 0; k < nm; k++) {
        var j = k === 0 ? 0 : (((g.i * 7 + k * 13) % 5) - 2) * .45, y = by - (k + 1) * T, cx = bx + j;
        xs.push(cx);
        o += lado(cx, y);
        o += face(cx, y, k === nm - 1, 500 + g.i * 31);
      }
      // a cinta de papel abraça as duas moedas de baixo (ou a única)
      var nb = Math.min(2, nm);
      o += cinta(bx, by - nb * T + .6, nb * T - 1.2, g);
      if (top) {
        // salta para o lado do centro, onde o feltro está livre (para fora ela bateria na pilha vizinha)
        var yt = by - h - RY, sx = cs >= 0 ? -1 : 1;
        o += salto(bx - cs * 30, yt - 10 - Math.max(0, sn) * 4, sx);
      }
      return o;
    },
    center: function (ctx) {
      // um porta-copos de couro escuro com pesponto dourado; a ficha cunhada com o olho no alto
      var o = '<circle cx="231" cy="232.5" r="57" fill="#000" opacity=".6" filter="url(#' + I.sb2 + ')"/>' +
        '<circle cx="230" cy="230" r="55" fill="url(#' + I.couro + ')"/>' +
        '<circle cx="230" cy="230" r="55" fill="#fff" filter="url(#' + I.trama + ')" opacity=".25"/>' +
        '<circle cx="230" cy="230" r="51" fill="none" stroke="#c9a04a" stroke-opacity=".75" stroke-width=".8" stroke-dasharray="2.2 1.8"/>';
      var x = 230, y = 194, r = 9.5;
      o += '<circle cx="' + (x + .8) + '" cy="' + (y + 1.2) + '" r="' + r + '" fill="#000" opacity=".6"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#' + I.ouroS + ')" stroke="#3a2706" stroke-width=".4"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="' + n(r * .78) + '" fill="url(#' + I.campo + ')" stroke="#fff3c8" stroke-opacity=".5" stroke-width=".4"/>' +
        '<path d="M' + p(x - 5, y) + 'Q' + p(x, y - 4.6) + ' ' + p(x + 5, y) + 'Q' + p(x, y + 4.6) + ' ' + p(x - 5, y) + 'Z" fill="#d8b25c" stroke="#4a330a" stroke-opacity=".7" stroke-width=".45"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="1.6" fill="#8a6420"/>';
      return o;
    }
  };
})();
