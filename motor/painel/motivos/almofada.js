/* Motivo "almofada" do gráfico de pontuação: 03. Lynde (Chá das Maldições), escolhido pelo dono na votação de 15/10/2026.
   Veio do protótipo motivos/lynde.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "almofada"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Lynde, Chá das Maldições: Lynde, Cheerful Tormentor (Duskmourn), deck de maldições.
     Chá da tarde macabro: porcelana fina com filete dourado (var(--gold)), bandeja escura, vapor que vira espiral de maldição;
     e a almofada de alfinetes de veludo vinho (var(--wine)), capitonê, onde as maldições são espetadas. */

  function lyN(n) { return (+n).toFixed(1); }
  function lyPt(x, y) { return lyN(x) + ' ' + lyN(y); }
  function lySt(o, c) { return '<stop offset="' + o + '" style="stop-color:' + c + '"/>'; }

  function lyDefsComuns(ctx) {
    var I = ctx.ly = { glow: ctx.uid('lyGl'), blur: ctx.uid('lyBl'), blur2: ctx.uid('lyB2'), halo: ctx.uid('lyHa'), sombra: ctx.uid('lySo'),
      porc: ctx.uid('lyPo'), porcH: ctx.uid('lyPH'), porcB: ctx.uid('lyPB'), veu: ctx.uid('lyVe'), boca: ctx.uid('lyBo'), vapor: ctx.uid('lyVa'),
      ouro: ctx.uid('lyOu'), esfera: ctx.uid('lyEs'), domo: ctx.uid('lyDo'), gomo: ctx.uid('lyGo'), botao: ctx.uid('lyBt'), trama: ctx.uid('lyTr'),
      aro: ctx.uid('lyAr'), clipA: ctx.uid('lyCA'), fundo: ctx.uid('lyFu') };
    return '<filter id="' + I.glow + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="' + I.blur + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".7"/></filter>' +
      '<filter id="' + I.blur2 + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter>' +
      '<radialGradient id="' + I.halo + '">' + lySt(0, 'rgba(var(--gold2-rgb),.42)') + lySt(1, 'rgba(var(--gold2-rgb),0)') + '</radialGradient>' +
      '<radialGradient id="' + I.sombra + '">' + lySt(0, 'rgba(var(--deep-rgb),.7)') + lySt(.6, 'rgba(var(--deep-rgb),.3)') + lySt(1, 'rgba(var(--deep-rgb),0)') + '</radialGradient>' +
      '<radialGradient id="' + I.porc + '" cx=".4" cy=".35" r=".75">' + lySt(0, '#fffaf4') + lySt(.55, 'rgb(var(--bone-rgb))') + lySt(1, 'rgb(var(--mute-rgb))') + '</radialGradient>' +
      '<linearGradient id="' + I.porcH + '" x1="0" x2="1" y1="0" y2="0">' + lySt(0, 'rgb(var(--dim-rgb))') + lySt(.25, '#fffaf4') + lySt(.6, 'rgb(var(--bone-rgb))') + lySt(1, 'rgb(var(--dim-rgb))') + '</linearGradient>' +
      '<linearGradient id="' + I.porcB + '" x1="0" x2="0" y1="0" y2="1">' + lySt(0, 'rgb(var(--mute-rgb))') + lySt(1, 'rgb(var(--dim-rgb))') + '</linearGradient>' +
      '<linearGradient id="' + I.veu + '" x1="0" x2="1" y1="0" y2="0">' + lySt(0, 'rgba(var(--bone-rgb),.5)') + lySt(.14, 'rgba(255,255,255,.42)') + lySt(.3, 'rgba(var(--bone-rgb),.14)') +
        lySt(.7, 'rgba(var(--bone-rgb),.1)') + lySt(.9, 'rgba(var(--deep-rgb),.25)') + lySt(1, 'rgba(var(--bone-rgb),.35)') + '</linearGradient>' +
      '<linearGradient id="' + I.boca + '" x1="0" x2="0" y1="0" y2="1">' + lySt(0, 'rgb(var(--mute-rgb))') + lySt(1, 'rgb(var(--dim-rgb))') + '</linearGradient>' +
      '<linearGradient id="' + I.fundo + '" x1="0" x2="0" y1="0" y2="1">' + lySt(0, 'rgba(var(--deep-rgb),0)') + lySt(1, 'rgba(var(--deep-rgb),.3)') + '</linearGradient>' +
      '<linearGradient id="' + I.vapor + '" x1="0" x2="0" y1="1" y2="0">' + lySt(0, 'rgba(var(--bone-rgb),.6)') + lySt(1, 'rgba(var(--bone-rgb),0)') + '</linearGradient>' +
      '<linearGradient id="' + I.ouro + '" x1="0" y1="0" x2="1" y2="1">' + lySt(0, 'rgb(var(--gold2-rgb))') + lySt(.5, 'rgb(var(--gold-rgb))') + lySt(1, '#6e5320') + '</linearGradient>' +
      '<radialGradient id="' + I.esfera + '" cx=".36" cy=".32" r=".72">' + lySt(0, 'rgba(255,255,255,.9)') + lySt(.22, 'rgba(255,255,255,.28)') + lySt(.55, 'rgba(255,255,255,0)') + lySt(1, 'rgba(var(--deep-rgb),.55)') + '</radialGradient>';
  }

  /* ---------- opção 1: xícaras de chá ---------- */

  /* meia largura da xícara na altura y (perfil em curva de Bézier, amostrado) */
  function lyLargura(yr, yb, y) {
    var P = [[-22, yr], [-22, yr + 15], [-15.5, yb - 2.5], [-7, yb]], best = 22, bd = 1e9;
    for (var k = 0; k <= 60; k++) {
      var t = k / 60, u = 1 - t, px = u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
        py = u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1];
      if (Math.abs(py - y) < bd) { bd = Math.abs(py - y); best = -px; }
    }
    return best;
  }

  /* fio de vapor: um S que sobe e some */
  function lyVapor(x, y, h, lado, I) {
    var d = 'M' + lyPt(x, y) + 'C' + lyPt(x + 5 * lado, y - h * .25) + ' ' + lyPt(x - 5 * lado, y - h * .45) + ' ' + lyPt(x, y - h * .62) +
      'S' + lyPt(x + 3.5 * lado, y - h * .9) + ' ' + lyPt(x + 1.5 * lado, y - h);
    return '<path d="' + d + '" style="fill:none;stroke:url(#' + I.vapor + ')" stroke-width="2.6" stroke-linecap="round" filter="url(#' + I.blur + ')"/>' +
      '<path d="' + d + '" style="fill:none;stroke:url(#' + I.vapor + ')" stroke-width=".8" stroke-linecap="round"/>';
  }

  /* a espiral de maldição: o vapor sobe e se enrola */
  function lyEspiral(x, y, g, I) {
    var cx = x + 3, cy = y - 34, R = 12.5, voltas = 3.4 * Math.PI, pts = [];
    for (var k = 0; k <= 70; k++) {
      var th = voltas * (1 - k / 70), r = R * th / voltas, a = th - Math.PI * .5;
      pts.push(lyPt(cx + r * Math.cos(a) * -1, cy + r * Math.sin(a) * .92));
    }
    var ini = pts[0].split(' ');
    var d = 'M' + lyPt(x - 2, y) + 'C' + lyPt(x - 8, y - 8) + ' ' + lyPt(+ini[0] + 6, +ini[1] + 10) + ' ' + pts[0] + 'L' + pts.slice(1).join('L');
    var faisca = '';
    [[-15, -6, 1], [14, -12, .8], [11, 9, .7], [-12, 10, .6]].forEach(function (f) { faisca += '<circle cx="' + lyN(cx + f[0]) + '" cy="' + lyN(cy + f[1]) + '" r="' + f[2] + '" style="fill:' + g.rgba(.95) + '"/>'; });
    return '<path d="' + d + '" style="fill:none;stroke:' + g.rgba(.75) + '" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#' + I.blur2 + ')"/>' + '<g filter="url(#' + I.glow + ')">' + faisca + '</g>' +
      '<path d="' + d + '" style="fill:none;stroke:rgba(var(--bone-rgb),.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + lyN(cx) + '" cy="' + lyN(cy) + '" r="1.6" style="fill:rgba(var(--bone-rgb),.95)" filter="url(#' + I.glow + ')"/>';
  }

  function lyXicara(x0, y0, g, I, cid) {
    var yr = y0 - 37, rx = 22, ry = 5.4, yb = y0 - 4.6, o = '';
    var body = 'M' + lyPt(x0 - rx, yr) + 'C' + lyPt(x0 - rx, yr + 15) + ' ' + lyPt(x0 - 15.5, yb - 2.5) + ' ' + lyPt(x0 - 7, yb) + 'L' + lyPt(x0 + 7, yb) +
      'C' + lyPt(x0 + 15.5, yb - 2.5) + ' ' + lyPt(x0 + rx, yr + 15) + ' ' + lyPt(x0 + rx, yr) + 'A' + rx + ' ' + ry + ' 0 0 1 ' + lyPt(x0 - rx, yr) + 'Z';
    // sombra na bandeja, pires (espessura, face, filete, poço) e pé
    o += '<ellipse cx="' + lyN(x0 + 4) + '" cy="' + lyN(y0 + 6) + '" rx="35" ry="9" style="fill:url(#' + I.sombra + ')"/>' +
      '<ellipse cx="' + lyN(x0) + '" cy="' + lyN(y0 + 2.6) + '" rx="30" ry="7.2" style="fill:url(#' + I.porcB + ')"/>' +
      '<ellipse cx="' + lyN(x0) + '" cy="' + lyN(y0) + '" rx="30" ry="7" style="fill:url(#' + I.porc + ')"/>' +
      '<ellipse cx="' + lyN(x0) + '" cy="' + lyN(y0) + '" rx="27" ry="6" style="fill:none;stroke:rgb(var(--gold-rgb))" stroke-width=".9"/>' +
      '<ellipse cx="' + lyN(x0) + '" cy="' + lyN(y0 - .2) + '" rx="14" ry="3.3" style="fill:rgba(var(--deep-rgb),.1);stroke:rgba(var(--deep-rgb),.16)" stroke-width=".5"/>' +
      '<path d="M' + lyPt(x0 - 8.5, y0 - .6) + 'Q' + lyPt(x0, y0 + 1.8) + ' ' + lyPt(x0 + 8.5, y0 - .6) + 'L' + lyPt(x0 + 6.8, yb) + 'L' + lyPt(x0 - 6.8, yb) + 'Z" style="fill:url(#' + I.porcH + ')"/>' +
      '<path d="M' + lyPt(x0 - 8.3, y0 - 1.6) + 'Q' + lyPt(x0, y0 + .7) + ' ' + lyPt(x0 + 8.3, y0 - 1.6) + '" style="fill:none;stroke:rgb(var(--gold-rgb))" stroke-width=".7"/>';
    // asa delicada à direita, com apoio para o dedo
    var asa = 'M' + lyPt(x0 + 20.6, yr + 5) + 'C' + lyPt(x0 + 33, yr + 1) + ' ' + lyPt(x0 + 34.5, yr + 20) + ' ' + lyPt(x0 + 15.2, yr + 25.5);
    o += '<path d="' + asa + '" style="fill:none;stroke:rgba(var(--deep-rgb),.55)" stroke-width="4.8" stroke-linecap="round"/>' +
      '<path d="' + asa + '" style="fill:none;stroke:rgb(var(--bone-rgb))" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M' + lyPt(x0 + 23, yr + 4.2) + 'C' + lyPt(x0 + 31, yr + 2.4) + ' ' + lyPt(x0 + 32.6, yr + 12) + ' ' + lyPt(x0 + 30, yr + 17) + '" style="fill:none;stroke:rgba(255,255,255,.75)" stroke-width=".8" stroke-linecap="round"/>' +
      '<circle cx="' + lyN(x0 + 29.6) + '" cy="' + lyN(yr + 2.6) + '" r="1.7" style="fill:rgb(var(--bone-rgb));stroke:rgba(var(--deep-rgb),.5)" stroke-width=".5"/>';
    // corpo de porcelana fina, translúcida contra a luz: o chá aparece através dela
    var f = Math.max(0.05, g.frac), yl = yb - (yb - yr) * f, wl = lyLargura(yr, yb, yl), ryl = ry * wl / rx;
    o += '<clipPath id="' + cid + '"><path d="' + body + '"/><ellipse cx="' + lyN(x0) + '" cy="' + lyN(yr) + '" rx="' + rx + '" ry="' + ry + '"/></clipPath>' +
      '<path d="' + body + '" style="fill:rgba(var(--deep-rgb),.45)"/><path d="' + body + '" style="fill:rgba(var(--bone-rgb),' + LY_LEITE + ')"/>' +
      '<ellipse cx="' + lyN(x0) + '" cy="' + lyN(yr) + '" rx="' + rx + '" ry="' + ry + '" style="fill:url(#' + I.boca + ')"/>' +
      '<g clip-path="url(#' + cid + ')">' +
      '<rect x="' + lyN(x0 - rx - 2) + '" y="' + lyN(yl) + '" width="' + (2 * rx + 4) + '" height="' + lyN(yb - yl + 3) + '" style="fill:' + g.cor + '"/>' +
      '<ellipse cx="' + lyN(x0) + '" cy="' + lyN(yl) + '" rx="' + lyN(wl) + '" ry="' + lyN(ryl) + '" style="fill:' + g.cor + '"/>' +
      '<rect x="' + lyN(x0 - rx - 2) + '" y="' + lyN(yl) + '" width="' + (2 * rx + 4) + '" height="' + lyN(yb - yl + 3) + '" style="fill:url(#' + I.fundo + ')"/>' +
      '<ellipse cx="' + lyN(x0) + '" cy="' + lyN(yl) + '" rx="' + lyN(wl) + '" ry="' + lyN(ryl) + '" style="fill:rgba(255,255,255,.22)"/>' +
      '<path d="M' + lyPt(x0 - wl, yl + .2) + 'A' + lyN(wl) + ' ' + lyN(ryl) + ' 0 0 0 ' + lyPt(x0 + wl, yl + .2) + '" style="fill:none;stroke:rgba(var(--deep-rgb),.45)" stroke-width=".9"/>' +
      '<path d="M' + lyPt(x0 - wl + 1, yl + .3) + 'A' + lyN(wl - 1) + ' ' + lyN(ryl) + ' 0 0 0 ' + lyPt(x0 + wl - 1, yl + .3) + '" style="fill:none;stroke:rgba(255,255,255,.45)" stroke-width=".7"/>' +
      '</g>' +
      '<path d="' + body + '" style="fill:url(#' + I.veu + ')"/>' +
      '<path d="' + body + '" style="fill:none;stroke:rgba(var(--bone-rgb),.55)" stroke-width=".8"/>';
    // borda grossa da porcelana e filete dourado logo abaixo, com um friso de pontinhos
    o += '<ellipse cx="' + lyN(x0) + '" cy="' + lyN(yr) + '" rx="' + rx + '" ry="' + ry + '" style="fill:none;stroke:rgb(var(--bone-rgb))" stroke-width="1.7"/>' +
      '<ellipse cx="' + lyN(x0) + '" cy="' + lyN(yr) + '" rx="' + (rx - 1.3) + '" ry="' + (ry - .9) + '" style="fill:none;stroke:rgba(var(--deep-rgb),.25)" stroke-width=".5"/>' +
      '<path d="M' + lyPt(x0 - rx + .3, yr + 3) + 'A' + (rx - .3) + ' ' + ry + ' 0 0 0 ' + lyPt(x0 + rx - .3, yr + 3) + '" style="fill:none;stroke:rgb(var(--gold-rgb))" stroke-width="1"/>';
    var dots = '';
    for (var k = 1; k < 12; k++) { var th = Math.PI * k / 12, dx = -Math.cos(th) * (rx - 1.8), dy = Math.sin(th) * ry; dots += '<circle cx="' + lyN(x0 + dx) + '" cy="' + lyN(yr + 5.6 + dy) + '" r=".55"/>'; }
    o += '<g style="fill:rgba(var(--gold-rgb),.9)">' + dots + '</g>';
    return { svg: o, yr: yr, yl: yl };
  }

  var LY_LEITE = .8;

  /* bule pequeno de porcelana dourada, com um fio de vapor saindo do bico */
  function lyBule(x, y, I) {
    var s = 'fill:url(#' + I.ouro + ');stroke:rgba(var(--deep-rgb),.6)';
    return '<path d="M' + lyPt(x - 7.5, y) + 'C' + lyPt(x - 7.5, y + 5) + ' ' + lyPt(x - 4, y + 6) + ' ' + lyPt(x, y + 6) + 'C' + lyPt(x + 4, y + 6) + ' ' + lyPt(x + 7.5, y + 5) + ' ' + lyPt(x + 7.5, y) +
        'C' + lyPt(x + 7.5, y - 4) + ' ' + lyPt(x + 4, y - 5) + ' ' + lyPt(x, y - 5) + 'C' + lyPt(x - 4, y - 5) + ' ' + lyPt(x - 7.5, y - 4) + ' ' + lyPt(x - 7.5, y) + 'Z" style="' + s + '" stroke-width=".5"/>' +
      '<path d="M' + lyPt(x + 6.8, y + 1) + 'C' + lyPt(x + 10, y + 1) + ' ' + lyPt(x + 10.5, y - 3) + ' ' + lyPt(x + 13, y - 5.5) + 'L' + lyPt(x + 13.6, y - 4.6) + 'C' + lyPt(x + 12, y - 2) + ' ' + lyPt(x + 11.5, y + 3.4) + ' ' + lyPt(x + 6.4, y + 3.6) + 'Z" style="' + s + '" stroke-width=".45"/>' +
      '<path d="M' + lyPt(x - 7, y - 2) + 'C' + lyPt(x - 12, y - 3) + ' ' + lyPt(x - 12, y + 4) + ' ' + lyPt(x - 6.6, y + 3) + '" style="fill:none;stroke:rgba(var(--deep-rgb),.6)" stroke-width="2.2"/>' +
      '<path d="M' + lyPt(x - 7, y - 2) + 'C' + lyPt(x - 12, y - 3) + ' ' + lyPt(x - 12, y + 4) + ' ' + lyPt(x - 6.6, y + 3) + '" style="fill:none;stroke:rgb(var(--gold-rgb))" stroke-width="1.2"/>' +
      '<path d="M' + lyPt(x - 4, y - 4.6) + 'Q' + lyPt(x, y - 7.6) + ' ' + lyPt(x + 4, y - 4.6) + 'Z" style="' + s + '" stroke-width=".45"/>' +
      '<circle cx="' + lyN(x) + '" cy="' + lyN(y - 7.4) + '" r="1.2" style="' + s + '" stroke-width=".4"/>' +
      '<path d="M' + lyPt(x - 7.2, y + 1.2) + 'Q' + lyPt(x, y + 2.6) + ' ' + lyPt(x + 7.2, y + 1.2) + '" style="fill:none;stroke:rgb(var(--gold2-rgb))" stroke-width=".5"/>' +
      '<path d="M' + lyPt(x - 4.6, y - 2.6) + 'Q' + lyPt(x - 5.6, y + .5) + ' ' + lyPt(x - 4, y + 3) + '" style="fill:none;stroke:rgba(255,255,255,.6)" stroke-width=".7" stroke-linecap="round"/>' +
      '<path d="M' + lyPt(x + 13.6, y - 6.6) + 'q-1.6 -2 .2 -3.6t.2 -3.4" style="fill:none;stroke:rgba(var(--bone-rgb),.6)" stroke-width=".8" stroke-linecap="round"/>';
  }

  /* ---------- opção 2: almofada de alfinetes ---------- */

  function lyDefsAlmofada(ctx) {
    var o = lyDefsComuns(ctx), I = ctx.ly;
    return o + '<radialGradient id="' + I.domo + '" cx="205" cy="195" r="205" gradientUnits="userSpaceOnUse">' + lySt(0, 'rgba(255,255,255,.13)') + lySt(.45, 'rgba(255,255,255,.03)') +
        lySt(.78, 'rgba(var(--deep-rgb),.12)') + lySt(.92, 'rgba(var(--deep-rgb),.4)') + lySt(1, 'rgba(var(--deep-rgb),.7)') + '</radialGradient>' +
      '<radialGradient id="' + I.gomo + '" cx=".45" cy=".42" r=".62">' + lySt(0, 'rgba(255,255,255,.11)') + lySt(.5, 'rgba(255,255,255,.02)') + lySt(.85, 'rgba(var(--deep-rgb),.16)') + lySt(1, 'rgba(var(--deep-rgb),.34)') + '</radialGradient>' +
      '<radialGradient id="' + I.botao + '" cx=".38" cy=".34" r=".7">' + lySt(0, 'rgba(255,255,255,.4)') + lySt(.4, 'rgb(var(--wine-rgb))') + lySt(1, 'rgba(var(--deep-rgb),.9)') + '</radialGradient>' +
      '<linearGradient id="' + I.aro + '" x1="0" y1="0" x2="1" y2="1">' + lySt(0, 'rgb(var(--gold2-rgb))') + lySt(.4, 'rgb(var(--gold-rgb))') + lySt(.75, '#6e5320') + lySt(1, 'rgb(var(--gold-rgb))') + '</linearGradient>' +
      '<filter id="' + I.trama + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 .9  0 0 0 0 .9  0 0 0 -1.4 .9" result="a"/><feComposite in="a" in2="SourceAlpha" operator="in"/></filter>' +
      '<clipPath id="' + I.clipA + '"><circle cx="230" cy="230" r="186"/></clipPath>';
  }

  MOTIVOS.lynde2 = {
    deck: '03. Lynde', nome: 'Alfinetes refinados',
    desc: 'Uma almofada de alfinetes de veludo vinho, capitonê, com cordão dourado; cada agrupamento é um alfinete de cabeça colorida espetado na direção do seu rótulo, e quanto maior a pontuação, mais ele sai da almofada. O maior tem a cabeça brilhando.',
    defs: lyDefsAlmofada,
    stage: function (ctx) {
      var I = ctx.ly, o = '';
      // aro de latão e o veludo
      o += '<circle cx="230" cy="230" r="194" style="fill:url(#' + I.aro + ');stroke:rgba(var(--deep-rgb),.6)" stroke-width=".8"/>' +
        '<circle cx="230" cy="230" r="189.5" style="fill:rgb(var(--wine-rgb));stroke:rgba(var(--deep-rgb),.7)" stroke-width="1"/>';
      // capitonê: losangos estofados entre botões em quincôncio
      var a = 54, b = 27, cel = '', vin = '', luz = '', bot = '';
      for (var j = -8; j <= 8; j++) for (var i = -5; i <= 5; i++) {
        var x = 230 + i * a + ((j & 1) ? a / 2 : 0), y = 230 + j * b, r = Math.hypot(x - 230, y - 230);
        if (r > 214) continue;
        // losango que tem este botão no vértice de cima
        var L = [x, y], Rr = [x + a / 2, y + b], B = [x, y + 2 * b], E = [x - a / 2, y + b], c = [x, y + b];
        function q(p1, p2) { var mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2; return 'Q' + lyPt(mx + (mx - c[0]) * .18, my + (my - c[1]) * .18) + ' ' + lyPt(p2[0], p2[1]); }
        cel += '<path d="M' + lyPt(L[0], L[1]) + q(L, Rr) + q(Rr, B) + q(B, E) + q(E, L) + 'Z"/>';
        vin += 'M' + lyPt(x, y) + 'L' + lyPt(x + a / 2, y + b) + 'M' + lyPt(x, y) + 'L' + lyPt(x - a / 2, y + b);
        luz += 'M' + lyPt(x + .4, y + 1.6) + 'L' + lyPt(x + a / 2 + .4, y + b + 1.6) + 'M' + lyPt(x - .4, y + 1.6) + 'L' + lyPt(x - a / 2 - .4, y + b + 1.6);
        if (r < 182 && r > 50) bot += '<circle cx="' + lyN(x + .6) + '" cy="' + lyN(y + 1) + '" r="3.6" style="fill:rgba(var(--deep-rgb),.5)"/><circle cx="' + lyN(x) + '" cy="' + lyN(y) + '" r="2.8" style="fill:url(#' + I.botao + ')"/>' +
          '<path d="M' + lyPt(x - 2, y - 3.2) + 'l-1.6 -3.6M' + lyPt(x + 2, y - 3.2) + 'l1.6 -3.6M' + lyPt(x - 2, y + 3.2) + 'l-1.6 3.6M' + lyPt(x + 2, y + 3.2) + 'l1.6 3.6" style="stroke:rgba(var(--deep-rgb),.35)" stroke-width=".7" stroke-linecap="round"/>';
      }
      o += '<g clip-path="url(#' + I.clipA + ')"><g style="fill:url(#' + I.gomo + ')">' + cel + '</g>' +
        '<path d="' + luz + '" style="stroke:rgba(255,255,255,.07)" stroke-width="1"/>' +
        '<path d="' + vin + '" style="stroke:rgba(var(--deep-rgb),.55)" stroke-width="1.1"/>' + bot +
        '<circle cx="230" cy="230" r="190" style="fill:#fff" filter="url(#' + I.trama + ')" opacity=".07"/></g>';
      // o domo da almofada e o cordão torcido da borda
      o += '<circle cx="230" cy="230" r="189.5" style="fill:url(#' + I.domo + ')"/>' +
        '<circle cx="230" cy="230" r="187" style="fill:none;stroke:rgb(var(--gold-rgb))" stroke-width="3.6"/>' +
        '<circle cx="230" cy="230" r="187" style="fill:none;stroke:rgba(var(--deep-rgb),.55)" stroke-width="3.6" stroke-dasharray="1.3 2.4"/>' +
        '<circle cx="230" cy="230" r="188.2" style="fill:none;stroke:rgba(var(--gold2-rgb),.6)" stroke-width=".6" stroke-dasharray="1.3 2.4"/>';
      return o;
    },
    group: function (g, ctx) {
      var I = ctx.ly, re = 76, Lm = 96, L = Lm * g.frac, h = L / Lm, E = ctx.pol(re, g.am), H = ctx.pol(re + L, g.am), rh = g.top ? 10.2 : 9.2, o = '';
      var sx = 2.5 + 6 * h, sy = 3.5 + 7.5 * h, S = [H[0] + sx, H[1] + sy];
      // sombra do alfinete no veludo (cresce com a altura da cabeça)
      o += '<path d="M' + lyPt(E[0], E[1]) + 'L' + lyPt(S[0], S[1]) + '" style="stroke:rgba(var(--deep-rgb),.65)" stroke-width="2.6" stroke-linecap="round" filter="url(#' + I.blur + ')"/>' +
        '<circle cx="' + lyN(S[0]) + '" cy="' + lyN(S[1]) + '" r="' + lyN(rh * .95) + '" style="fill:rgba(var(--deep-rgb),.5)" filter="url(#' + I.blur2 + ')"/>';
      // furo no tecido, com o veludo repuxado
      var t = g.am * Math.PI / 180, ux = Math.cos(t), uy = Math.sin(t), px = -uy, py = ux, pk = '';
      [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(function (s) { pk += 'M' + lyPt(E[0] + (ux * s[1] * 2 + px * s[0] * 2), E[1] + (uy * s[1] * 2 + py * s[0] * 2)) + 'l' + lyPt(ux * s[1] * 3 + px * s[0] * 3.4, uy * s[1] * 3 + py * s[0] * 3.4); });
      o += '<circle cx="' + lyN(E[0]) + '" cy="' + lyN(E[1]) + '" r="5.5" style="fill:rgba(var(--deep-rgb),.35)" filter="url(#' + I.blur + ')"/>' +
        '<path d="M' + lyPt(E[0] - 4, E[1] + 1.6) + 'A4.3 4.3 0 0 0 ' + lyPt(E[0] + 4, E[1] + 1.6) + '" style="fill:none;stroke:rgba(255,255,255,.14)" stroke-width="1"/>' +
        '<circle cx="' + lyN(E[0]) + '" cy="' + lyN(E[1]) + '" r="1.6" style="fill:rgba(var(--deep-rgb),.8)"/>';
      // haste de aço
      var Hx = H[0] - ux * rh * .6, Hy = H[1] - uy * rh * .6;
      o += '<path d="M' + lyPt(E[0], E[1]) + 'L' + lyPt(Hx, Hy) + '" style="stroke:rgba(var(--deep-rgb),.75)" stroke-width="3.2" stroke-linecap="round"/>' +
        '<path d="M' + lyPt(E[0], E[1]) + 'L' + lyPt(Hx, Hy) + '" style="stroke:rgb(var(--mute-rgb))" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M' + lyPt(E[0] - px * .35 - uy * 0, E[1] - py * .35) + 'L' + lyPt(Hx - px * .35, Hy - py * .35) + '" style="stroke:rgba(255,255,255,.75)" stroke-width=".5" stroke-linecap="round"/>';
      // cabeça de vidro colorido
      if (g.top) o += '<circle cx="' + lyN(H[0]) + '" cy="' + lyN(H[1]) + '" r="24" style="fill:url(#' + I.halo + ')"/>';
      o += '<g' + (g.top ? ' filter="url(#' + I.glow + ')"' : '') + '><circle cx="' + lyN(H[0]) + '" cy="' + lyN(H[1]) + '" r="' + rh + '" style="fill:' + g.cor + '"/>' +
        '<circle cx="' + lyN(H[0]) + '" cy="' + lyN(H[1]) + '" r="' + rh + '" style="fill:url(#' + I.esfera + ');stroke:rgba(var(--deep-rgb),.55)" stroke-width=".6"/></g>' +
        '<ellipse cx="' + lyN(H[0] - rh * .32) + '" cy="' + lyN(H[1] - rh * .38) + '" rx="' + lyN(rh * .26) + '" ry="' + lyN(rh * .17) + '" transform="rotate(-35 ' + lyPt(H[0] - rh * .32, H[1] - rh * .38) + ')" style="fill:rgba(255,255,255,.95)"/>';
      if (g.top) o += lyEstrela(H[0] - rh * .9, H[1] - rh * 1.05, 5.5);
      return o;
    },
    center: function (ctx) {
      var I = ctx.ly;
      return '<circle cx="230" cy="230" r="' + (ctx.r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.r0 - 9.5) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.55)" stroke-width=".9" stroke-dasharray="3 2.4"/>' +
        '<circle cx="230" cy="194" r="16" style="fill:url(#' + I.halo + ')"/>' + lyCoracao(230, 195, I);
    }
  };

  function lyEstrela(x, y, s) {
    return '<path d="M' + lyPt(x, y - s) + 'Q' + lyPt(x + s * .15, y - s * .15) + ' ' + lyPt(x + s, y) + 'Q' + lyPt(x + s * .15, y + s * .15) + ' ' + lyPt(x, y + s) +
      'Q' + lyPt(x - s * .15, y + s * .15) + ' ' + lyPt(x - s, y) + 'Q' + lyPt(x - s * .15, y - s * .15) + ' ' + lyPt(x, y - s) + 'Z" style="fill:rgba(255,255,255,.92)"/>';
  }

  /* coração atravessado por um alfinete: a maldição */
  function lyCoracao(x, y, I) {
    var s = 5.6, h = 'M' + lyPt(x, y + s * .95) + 'C' + lyPt(x - s * 1.35, y + s * .1) + ' ' + lyPt(x - s * 1.05, y - s * 1) + ' ' + lyPt(x, y - s * .38) +
      'C' + lyPt(x + s * 1.05, y - s * 1) + ' ' + lyPt(x + s * 1.35, y + s * .1) + ' ' + lyPt(x, y + s * .95) + 'Z';
    var p0 = [x - 11, y + 6.4], p1 = [x + 10, y - 6.2];
    return '<path d="M' + lyPt(p0[0], p0[1]) + 'L' + lyPt(x - 4, y + 2.2) + '" style="stroke:rgb(var(--mute-rgb))" stroke-width="1.1" stroke-linecap="round"/>' +
      '<path d="' + h + '" style="fill:rgb(var(--blood-rgb));stroke:rgba(var(--deep-rgb),.7)" stroke-width=".6"/>' +
      '<path d="M' + lyPt(x - s * .75, y - s * .35) + 'Q' + lyPt(x - s * .55, y - s * .75) + ' ' + lyPt(x - s * .2, y - s * .55) + '" style="fill:none;stroke:rgba(255,255,255,.55)" stroke-width=".8" stroke-linecap="round"/>' +
      '<path d="M' + lyPt(x + 3.6, y - 2.2) + 'L' + lyPt(p1[0], p1[1]) + '" style="stroke:rgb(var(--mute-rgb))" stroke-width="1.1" stroke-linecap="round"/>' +
      '<circle cx="' + lyN(p1[0] + .6) + '" cy="' + lyN(p1[1] - .4) + '" r="2.4" style="fill:rgb(var(--gold2-rgb));stroke:rgba(var(--deep-rgb),.6)" stroke-width=".4"/>' +
      '<circle cx="' + lyN(p1[0]) + '" cy="' + lyN(p1[1] - 1.1) + '" r=".7" style="fill:#fff"/>';
  }

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.lynde2.legenda = { peca: "alfinete", masc: true, texto: " é um agrupamento: sai mais da almofada quanto maior a soma das notas, e o maior tem a cabeça acesa." };

  return MOTIVOS.lynde2;
})();
