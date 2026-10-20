/* Motivo "abside" do gráfico de pontuação: 02. Humanos, rebranding do lote 1, variação B (Abside vista de baixo) escolhida pelo dono em 19/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "abside"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "estandartes" do gráfico de pontuação: 02. Humanos (Catedral dos Vivos). Protótipo do rebranding, variação B.
   Cada critério é um estandarte de tecido pendurado numa haste dourada na nave da catedral; o pano cai do centro para fora,
   em direção ao rótulo, e o comprimento do pano é a soma (linear, mínimo de 12%). Dobras, galão e franja dourados, textura
   de tecido e luz de vitral. Variações: A, galeria em arco (pedra clara, barra reta com franja e borlas nos cantos); B, abside vista de baixo
   (abóbada ao anoitecer, um vitral de lanceta atrás de cada estandarte, ponta em cauda de andorinha); C, coroa de luz
   (lustre de roda dourado com velas no centro, ponta em bico com borla). */
var MOTIVO_PAINEL = (function () {
  var V = 'B';
  var XH = 74, RE = 184, HW0 = 14, HW1 = 19, ROD = 17;
  function f1(n) { return (+n).toFixed(1); }
  function hw(x) { return HW0 + (HW1 - HW0) * Math.max(0, Math.min(1, (x - XH) / (RE - XH))); }
  function raio(f) { return XH + (RE - XH) * f; }
  function P(x, y) { return f1(x) + ' ' + f1(y); }
  var FIM = { A: 'reto', B: 'cauda', C: 'ponta' }[V];

  /* o pano até o comprimento L: lados com ondas leves das dobras e a ponta no estilo da variação.
     Devolve o contorno, a barra (onde vai a franja) e o fim das laterais. */
  function pano(L) {
    var len = L - XH, x0 = XH - 2.5, n, xe, hem, pts = [], k, x;
    if (FIM === 'ponta') { n = Math.min(24, Math.max(5, len * 0.42)); xe = L - 4 - n; }
    else { n = Math.min(17, Math.max(4, len * 0.34)); xe = L; }
    var passo = Math.max(3, (xe - x0) / 14);
    var onda = function (x, fase) { return 0.8 * Math.sin((x - XH) / 8.5 + fase) * Math.min(1, (x - x0) / 12); };
    for (x = x0; x < xe; x += passo) pts.push([x, -hw(x) - onda(x, 0.4)]);
    var he = hw(xe);
    pts.push([xe, -he]);
    if (FIM === 'reto') {
      hem = [[L, -he], [L, he]];
    } else if (FIM === 'cauda') {
      hem = [[L, -he], [L - n, 0], [L, he]];
      pts.push([L - n, 0]);
    } else {
      hem = [[xe, -he], [L - 4, 0], [xe, he]];
      pts.push([L - 4, 0]);
    }
    pts.push([xe, he]);
    var lado = [];
    for (x = x0; x < xe; x += passo) lado.push([x, hw(x) + onda(x, 2.1)]);
    for (k = lado.length - 1; k >= 0; k--) pts.push(lado[k]);
    return { d: 'M' + pts.map(function (p) { return P(p[0], p[1]); }).join('L') + 'Z', hem: 'M' + hem.map(function (p) { return P(p[0], p[1]); }).join('L'), xe: xe, n: n };
  }

  function ids(ctx) {
    if (!ctx.hn) ctx.hn = { dobra: ctx.uid('hd'), queda: ctx.uid('hq'), ouro: ctx.uid('ho'), ouroR: ctx.uid('hr'), haste: ctx.uid('hh'), chao: ctx.uid('hc'),
      raio: ctx.uid('hy'), sat: ctx.uid('hs'), centro: ctx.uid('hz'), vid: ctx.uid('hv'), chama: ctx.uid('hf'), disco: ctx.uid('hk'), vela: ctx.uid('hl') };
    return ctx.hn;
  }

  function defs(ctx) {
    var o = ctx.kit.defs(ctx, 'est'), d = ids(ctx);
    var st = function (off, c, a) { return '<stop offset="' + off + '" stop-color="' + c + '" stop-opacity="' + a + '"/>'; };
    // dobras: pregas no sentido do comprimento, alternando vale e crista (coordenadas locais do estandarte)
    o += '<linearGradient id="' + d.dobra + '" gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2="20">' +
      st(0, '#000', .42) + st(.1, '#fff', .12) + st(.2, '#000', .24) + st(.36, '#fff', .3) + st(.5, '#000', .22) + st(.64, '#fff', .2) + st(.8, '#000', .28) + st(.9, '#fff', .08) + st(1, '#000', .45) + '</linearGradient>';
    // profundidade: claro junto da haste, escurece na barra
    o += '<linearGradient id="' + d.queda + '" gradientUnits="userSpaceOnUse" x1="' + XH + '" y1="0" x2="' + RE + '" y2="0">' +
      st(0, '#fff', .3) + st(.25, '#fff', 0) + st(.7, '#000', .12) + st(1, '#000', .34) + '</linearGradient>';
    o += '<linearGradient id="' + d.ouro + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbeab0"/><stop offset=".45" stop-color="#c99a3a"/><stop offset="1" stop-color="#6e4f17"/></linearGradient>' +
      '<radialGradient id="' + d.ouroR + '" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff6d6"/><stop offset=".4" stop-color="#d4a845"/><stop offset="1" stop-color="#6a4a12"/></radialGradient>' +
      '<linearGradient id="' + d.haste + '" gradientUnits="userSpaceOnUse" x1="' + (XH - 1.6) + '" y1="0" x2="' + (XH + 1.6) + '" y2="0"><stop offset="0" stop-color="#7a5a1c"/><stop offset=".35" stop-color="#fbeab0"/><stop offset=".6" stop-color="#c99a3a"/><stop offset="1" stop-color="#5e430f"/></linearGradient>';
    o += '<filter id="' + d.sat + '"><feColorMatrix type="saturate" values="1.4"/><feComponentTransfer><feFuncR type="gamma" exponent="1.15"/><feFuncG type="gamma" exponent="1.15"/><feFuncB type="gamma" exponent="1.15"/></feComponentTransfer></filter>';
    // raio de luz do vitral sobre o estandarte mais longo
    o += '<linearGradient id="' + d.raio + '" gradientUnits="userSpaceOnUse" x1="' + (RE + 14) + '" y1="0" x2="' + XH + '" y2="0">' +
      st(0, '#fff', V === 'B' ? .5 : .75) + st(.55, '#fff8e0', V === 'B' ? .2 : .32) + st(1, '#fff8e0', 0) + '</linearGradient>';
    if (V === 'A') {
      o += '<radialGradient id="' + d.chao + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f6efe0"/><stop offset=".55" stop-color="#e8dcc2"/><stop offset="1" stop-color="#c8b28a"/></radialGradient>';
    } else if (V === 'B') {
      o += '<radialGradient id="' + d.chao + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#58526c"/><stop offset=".45" stop-color="#34304a"/><stop offset="1" stop-color="#191724"/></radialGradient>' +
        '<pattern id="' + d.vid + '" patternUnits="userSpaceOnUse" width="9" height="12" patternTransform="rotate(0)"><path d="M0 0L4.5 6L0 12M9 0L4.5 6L9 12" fill="none" stroke="#120f1c" stroke-opacity=".55" stroke-width=".7"/></pattern>' +
        '<radialGradient id="' + d.disco + '" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#fffaf0"/><stop offset=".7" stop-color="#f1e6cc"/><stop offset="1" stop-color="#cdb684"/></radialGradient>';
    } else {
      o += '<radialGradient id="' + d.chao + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff6e0"/><stop offset=".35" stop-color="#f2e3c0"/><stop offset=".75" stop-color="#e0cba0"/><stop offset="1" stop-color="#bfa477"/></radialGradient>' +
        '<radialGradient id="' + d.chama + '"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#ffe9a8"/><stop offset=".65" stop-color="#ffb540" stop-opacity=".55"/><stop offset="1" stop-color="#ff9a1a" stop-opacity="0"/></radialGradient>';
    }
    return o;
  }

  function rot(a) { return 'translate(230 230) rotate(' + f1(a) + ')'; }

  /* palco: o chão ou a abóbada da nave, as nervuras entre os estandartes e as colunas na borda */
  function stage(ctx) {
    var d = ids(ctx), o = '', i, b, n = ctx.NG, step = 360 / n, Rd = ctx.R + 12;
    var fundoTx = ' filter="url(#' + ctx.k.textura + ')"';
    if (V === 'A') {
      o += '<circle cx="230" cy="230" r="' + Rd + '" style="fill:url(#' + d.chao + ');stroke:rgba(var(--gold-rgb),.55)" stroke-width="1.3"' + fundoTx + '/>';
      // lajes do piso
      [104, 132, 160].forEach(function (r) { o += '<circle cx="230" cy="230" r="' + r + '" fill="none" stroke="#8a6a35" stroke-opacity=".13" stroke-width=".8"/>'; });
      // luz que entra pelos vitrais: feixes largos e suaves, um rosado, um azul e um dourado
      o += '<g opacity=".5" filter="url(#' + ctx.k.brilho + ')">' +
        '<path d="M60 70L150 40L330 330L270 360Z" fill="#fff7e6" opacity=".55"/><path d="M380 60L430 110L250 300L220 280Z" fill="#cfdcf2" opacity=".4"/><path d="M60 330L90 380L250 250L240 230Z" fill="#f2cfd6" opacity=".35"/></g>';
    } else if (V === 'B') {
      o += '<circle cx="230" cy="230" r="' + Rd + '" style="fill:url(#' + d.chao + ');stroke:rgba(var(--gold-rgb),.7)" stroke-width="1.6"' + fundoTx + '/>';
      // vitrais de lanceta: um atrás de cada estandarte, do tamanho do estandarte cheio (o fantasma)
      ctx.groups.forEach(function (g) {
        var w = function (x) { return hw(x) + 4; }, xa = 150, xt = RE + 6, wa = w(xa);
        var jan = 'M' + P(XH + 6, -w(XH + 6)) + 'L' + P(xa, -wa) + 'Q' + P(xa + (xt - xa) * 0.7, -wa) + ' ' + P(xt, 0) + 'Q' + P(xa + (xt - xa) * 0.7, wa) + ' ' + P(xa, wa) + 'L' + P(XH + 6, w(XH + 6)) + 'Z';
        o += '<g transform="' + rot(g.am) + '">' +
          '<path d="' + jan + '" style="fill:' + g.rgba(g.top ? .38 : .22) + '"/>' +
          '<path d="' + jan + '" fill="url(#' + d.vid + ')"/>' +
          '<path d="' + jan + '" style="fill:' + g.rgba(.55) + '" opacity="' + (g.top ? .5 : .25) + '" filter="url(#' + ctx.k.brilho + ')"/>' +
          '<path d="M' + P(XH + 6, 0) + 'L' + P(xt - 2, 0) + 'M' + P(xa, -wa) + 'L' + P(xa, wa) + 'M' + P(115, -w(115)) + 'L' + P(115, w(115)) + '" stroke="#120f1c" stroke-opacity=".6" stroke-width="1.1" fill="none"/>' +
          '<path d="' + jan + '" fill="none" stroke="#d9c48f" stroke-opacity=".55" stroke-width="1.3"/></g>';
      });
    } else {
      o += '<circle cx="230" cy="230" r="' + Rd + '" style="fill:url(#' + d.chao + ');stroke:rgba(var(--gold-rgb),.55)" stroke-width="1.3"' + fundoTx + '/>';
      [110, 150].forEach(function (r) { o += '<circle cx="230" cy="230" r="' + r + '" fill="none" stroke="#8a6a35" stroke-opacity=".12" stroke-width=".8"/>'; });
    }
    // nervuras da abóbada entre os estandartes e as colunas agrupadas na borda
    for (i = 0; i < n; i++) {
      b = -90 + i * step;
      var nerv = 'M' + P(60, 0) + 'L' + P(Rd - 2, 0);
      var pedra = V === 'B' ? ['#0f0d16', '#6c6584', '#b9b0cc'] : ['#7a5f30', '#d9c9a6', '#fffaf0'];
      o += '<g transform="' + rot(b) + '">' +
        '<path d="' + nerv + '" stroke="' + pedra[0] + '" stroke-opacity="' + (V === 'B' ? .7 : .22) + '" stroke-width="' + (V === 'B' ? 6 : 4.5) + '"/>' +
        '<path d="' + nerv + '" stroke="' + pedra[1] + '" stroke-width="' + (V === 'B' ? 3.4 : 2.6) + '"/>' +
        '<path d="' + nerv + '" stroke="' + pedra[2] + '" stroke-opacity=".7" stroke-width=".8" transform="translate(0 -.8)"/>';
      // coluna agrupada (vista de cima): fuste central e três colunelos
      var cx = RE + 3;
      o += '<circle cx="' + f1(cx + 1.5) + '" cy="1.5" r="7.5" fill="#000" opacity=".18"/>' +
        [[cx - 3.8, 0, 2.6], [cx + 2.6, -3.6, 2.6], [cx + 2.6, 3.6, 2.6], [cx, 0, 4.6]].map(function (c) {
          return '<circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + c[2] + '" fill="url(#' + d.ouroR + ')" stroke="#4d3a12" stroke-opacity=".55" stroke-width=".5"' + (V === 'B' ? '' : ' opacity=".9"') + '/>';
        }).join('') + '</g>';
    }
    // cornija da borda
    o += '<circle cx="230" cy="230" r="' + (Rd - 3) + '" fill="none" style="stroke:rgba(var(--gold-rgb),.45)" stroke-width="2.4" stroke-dasharray="1.4 3.2"/>';
    if (V === 'A') {
      // a galeria em arco: um anel de pedra com uma arcada ogival por estandarte, de onde ele pende
      o += '<circle cx="230" cy="230" r="65" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="20" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<circle cx="230" cy="230" r="64" fill="none" stroke="#efe4cb" stroke-width="18"/>' +
        '<circle cx="230" cy="230" r="73" fill="none" style="stroke:rgba(var(--gold-rgb),.75)" stroke-width="1.2"/>' +
        '<circle cx="230" cy="230" r="55.5" fill="none" style="stroke:rgba(var(--gold-rgb),.6)" stroke-width="1"/>';
      ctx.groups.forEach(function (g) {
        var arco = 'M' + P(73, -12) + 'L' + P(66, -12) + 'Q' + P(58, -11) + ' ' + P(57.5, 0) + 'Q' + P(58, 11) + ' ' + P(66, 12) + 'L' + P(73, 12) + 'Z';
        o += '<g transform="' + rot(g.am) + '"><path d="' + arco + '" fill="#5a4320" fill-opacity=".42" stroke="#c99a3a" stroke-width=".9"/>' +
          '<path d="M' + P(71, -9) + 'L' + P(66, -9) + 'Q' + P(61, -8.5) + ' ' + P(60.5, 0) + '" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.6"/></g>';
      });
      for (i = 0; i < n; i++) o += '<g transform="' + rot(-90 + i * step) + '"><circle cx="64" cy="0" r="3.4" fill="url(#' + d.ouroR + ')" stroke="#4d3a12" stroke-opacity=".5" stroke-width=".5"/></g>';
    }
    if (V === 'C') {
      // a coroa de luz: lustre de roda dourado, aro duplo com rendilhado, torres e uma vela em cada torre
      o += '<circle cx="230" cy="230" r="80" fill="#ffd27a" opacity=".35" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<circle cx="230" cy="230" r="66" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="16" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<circle cx="230" cy="230" r="72" fill="none" stroke="#6e4f17" stroke-width="3.6"/><circle cx="230" cy="230" r="72" fill="none" stroke="#e6c46e" stroke-width="2"/>' +
        '<circle cx="230" cy="230" r="59" fill="none" stroke="#6e4f17" stroke-width="3.6"/><circle cx="230" cy="230" r="59" fill="none" stroke="#e6c46e" stroke-width="2"/>' +
        '<circle cx="230" cy="230" r="65.5" fill="none" stroke="#b8892f" stroke-width="9" stroke-dasharray="2.2 2.4" opacity=".75"/>' +
        '<circle cx="230" cy="230" r="65.5" fill="none" stroke="#fff3c4" stroke-width="1" stroke-dasharray=".8 3.8" opacity=".8"/>';
      for (i = 0; i < n; i++) {
        o += '<g transform="' + rot(-90 + i * step) + '">' +
          '<rect x="57" y="-4.6" width="17" height="9.2" rx="1.2" fill="url(#' + d.ouro + ')" stroke="#4d3a12" stroke-width=".6"/>' +
          '<path d="M57 -4.6V4.6M60.5 -4.6V4.6M70.5 -4.6V4.6" stroke="#4d3a12" stroke-opacity=".45" stroke-width=".6"/>' +
          '<circle cx="65.5" cy="0" r="3" fill="#fbf4e4" stroke="#bfa477" stroke-width=".5"/>' +
          '<circle cx="65.5" cy="0" r="11" fill="url(#' + d.chama + ')" style="mix-blend-mode:screen"/>' +
          '<circle cx="65.5" cy="0" r="1.6" fill="#fff"/></g>';
      }
    }
    return o;
  }

  /* um estandarte: haste, pano com dobras e galão, emblema, franja, sombra e brilho */
  function group(g, ctx) {
    var d = ids(ctx), k = ctx.k, L = raio(ctx.kit.comp(g.frac)), p = pano(L), cl = ctx.uid('hp'), o = '<g transform="' + rot(g.am) + '">';
    // fantasma: o estandarte cheio (A e C; na B o vitral de lanceta faz esse papel)
    if (V !== 'B') {
      var cheio = pano(RE);
      o += '<path d="' + cheio.d + '" style="fill:' + g.cor + ';stroke:rgba(var(--gold-rgb),1)" fill-opacity=".18" stroke-width="1" stroke-dasharray="3 2.6" opacity=".25"/>';
    }
    o += '<filter id="' + d.sat + '"><feColorMatrix type="saturate" values="1.4"/><feComponentTransfer><feFuncR type="gamma" exponent="1.15"/><feFuncG type="gamma" exponent="1.15"/><feFuncB type="gamma" exponent="1.15"/></feComponentTransfer></filter>';
    // raio de luz do vitral sobre o mais longo (atrás do pano)
    if (g.top) {
      var wr = hw(RE) + 12;
      o += '<path d="M' + P(RE + 6, -wr) + 'L' + P(XH, -HW0 - 2) + 'L' + P(XH, HW0 + 2) + 'L' + P(RE + 6, wr) + 'Z" fill="url(#' + d.raio + ')" filter="url(#' + k.brilho + ')"' + (V === 'B' ? ' style="mix-blend-mode:screen"' : '') + '/>';
    }
    // sombra no chão e brilho difuso da cor
    o += '<path d="' + p.d + '" fill="#2a1c08" opacity="' + (V === 'B' ? .55 : .3) + '" transform="translate(3 2)" filter="url(#' + k.brilho2 + ')"/>' +
      '<path d="' + p.d + '" style="fill:' + g.cor + '" opacity="' + (g.top ? .85 : .45) + '" filter="url(#' + k.brilho + ')"/>';
    // o pano
    o += '<clipPath id="' + cl + '"><path d="' + p.d + '"/></clipPath>' +
      '<g filter="url(#' + d.sat + ')"><path d="' + p.d + '" style="fill:' + g.cor + '" filter="url(#' + k.textura + ')"/></g>' +
      '<g clip-path="url(#' + cl + ')">' +
      '<rect x="' + (XH - 4) + '" y="-24" width="' + f1(L - XH + 8) + '" height="48" fill="url(#' + d.dobra + ')"/>' +
      '<rect x="' + (XH - 4) + '" y="-24" width="' + f1(L - XH + 8) + '" height="48" fill="url(#' + d.queda + ')"/>' +
      // bainha da haste: o pano dá a volta na haste
      '<rect x="' + (XH - 4) + '" y="-24" width="7.5" height="48" fill="#000" opacity=".28"/>' +
      '<path d="M' + P(XH + 3.5, -24) + 'V24" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>' +
      // núcleo claro: a crista de luz na prega
      '<path d="M' + P(XH + 5, -5.6) + 'L' + P(p.xe - p.n * 0.6, -6.2) + '" stroke="#fff" stroke-width="2.2" opacity=".7" filter="url(#' + k.brilho2 + ')"/>' +
      '<path d="M' + P(XH + 5, -5.6) + 'L' + P(p.xe - p.n * 0.6, -6.2) + '" stroke="#fff" stroke-width=".6" opacity=".6"/>' +
      // galão dourado bordado na orla
      '<path d="' + p.d + '" fill="none" stroke="#e8c463" stroke-width="3.4"/>' +
      '</g>' +
      '<path d="' + p.d + '" fill="none" stroke="#4a3310" stroke-opacity=".6" stroke-width=".6"/>';
    // emblema bordado: a cruz da catedral com o anel (só quando o pano tem espaço)
    if (L - XH > 46) {
      var ex = XH + 21;
      var cruz = 'M' + P(ex - 9, 0) + 'L' + P(ex + 12, 0) + 'M' + P(ex - 3, -6.5) + 'L' + P(ex - 3, 6.5);
      o += '<path d="' + cruz + '" stroke="#3d2a0b" stroke-opacity=".55" stroke-width="3.6" stroke-linecap="round"/>' +
        '<circle cx="' + f1(ex - 3) + '" cy="0" r="4.4" fill="none" stroke="#3d2a0b" stroke-opacity=".55" stroke-width="2.8"/>' +
        '<path d="' + cruz + '" stroke="#f1d27a" stroke-width="2" stroke-linecap="round"/>' +
        '<circle cx="' + f1(ex - 3) + '" cy="0" r="4.4" fill="none" stroke="#f1d27a" stroke-width="1.4"/>' +
        '<path d="M' + P(ex - 8.4, -.5) + 'L' + P(ex + 11, -.5) + '" stroke="#fffbe8" stroke-width=".5" opacity=".8"/>';
    }
    // franja dourada na barra
    o += '<path d="' + p.hem + '" fill="none" stroke="#5e430f" stroke-opacity=".5" stroke-width="5.4" stroke-dasharray=".8 1" transform="translate(1.6 0)"/>' +
      '<path d="' + p.hem + '" fill="none" stroke="#e1b54f" stroke-width="5" stroke-dasharray=".8 1" transform="translate(1.6 0)"/>' +
      '<path d="' + p.hem + '" fill="none" stroke="#8a6614" stroke-width="1.4"/>';
    if (FIM === 'reto') {
      // borlas nos cantos da barra
      [-1, 1].forEach(function (s) { var yc = s * (hw(L) - 0.5);
        o += '<path d="M' + P(L, yc - 1.6) + 'L' + P(L + 5.5, yc - 2.2) + 'L' + P(L + 5.5, yc + 2.2) + 'L' + P(L, yc + 1.6) + 'Z" fill="url(#' + d.ouro + ')" stroke="#5e430f" stroke-width=".4"/>' +
          '<circle cx="' + f1(L + .6) + '" cy="' + f1(yc) + '" r="1.9" fill="url(#' + d.ouroR + ')" stroke="#5e430f" stroke-width=".3"/>'; });
    }
    if (FIM === 'ponta') {
      // borla na ponta
      o += '<path d="M' + P(L - 4.5, 0) + 'L' + P(L - 1.5, 0) + '" stroke="#8a6614" stroke-width="1"/>' +
        '<path d="M' + P(L - 2, -1.8) + 'L' + P(L, -2.4) + 'L' + P(L, 2.4) + 'L' + P(L - 2, 1.8) + 'Z" fill="url(#' + d.ouro + ')" stroke="#5e430f" stroke-width=".4"/>' +
        '<circle cx="' + f1(L - 3.4) + '" cy="0" r="1.6" fill="url(#' + d.ouroR + ')"/>';
    }
    // a haste dourada com remates em lança, e os cordões que a prendem
    var yr = ROD, ancora = V === 'A' ? 'M' + P(XH, -yr + 2) + 'L' + P(66, -9) + 'M' + P(XH, yr - 2) + 'L' + P(66, 9)
      : V === 'B' ? 'M' + P(XH, -yr + 2) + 'L' + P(XH - 12, 0) + 'L' + P(XH, yr - 2)
      : 'M' + P(XH, -yr + 2) + 'L' + P(71.5, -8) + 'M' + P(XH, yr - 2) + 'L' + P(71.5, 8);
    o += '<path d="' + ancora + '" fill="none" stroke="' + (V === 'B' ? '#e8d39a' : '#6e4f17') + '" stroke-opacity=".8" stroke-width=".8"/>' +
      '<path d="M' + P(XH, -yr) + 'L' + P(XH, yr) + '" stroke="#3d2a0b" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M' + P(XH, -yr) + 'L' + P(XH, yr) + '" stroke="url(#' + d.haste + ')" stroke-width="2.8" stroke-linecap="round"/>';
    [-1, 1].forEach(function (s) {
      var y = s * yr;
      o += '<path d="M' + P(XH - 1.6, y) + 'L' + P(XH, y + s * 3.6) + 'L' + P(XH + 1.6, y) + 'Z" fill="url(#' + d.ouro + ')" stroke="#4d3a12" stroke-width=".4"/>' +
        '<circle cx="' + XH + '" cy="' + f1(y) + '" r="1.9" fill="url(#' + d.ouroR + ')" stroke="#4d3a12" stroke-width=".4"/>';
    });
    if (g.top) o += '<circle cx="' + f1(L - 2) + '" cy="0" r="10" fill="#fff6d8" opacity=".55" filter="url(#' + k.brilho + ')"/>';
    return o + '</g>';
  }

  function center(ctx) {
    var d = ids(ctx);
    var cruz = function (y, c) {
      return '<path d="M230 ' + (y - 12) + 'V' + (y + 12) + 'M222 ' + (y - 4) + 'H238" stroke="' + c + '" stroke-width="2.2" stroke-linecap="round"/>' +
        '<circle cx="230" cy="' + (y - 4) + '" r="4.6" fill="none" stroke="' + c + '" stroke-width="1.4"/>';
    };
    if (V === 'B') {
      // a chave da abóbada: medalhão de pedra clara com folha de ouro
      return '<circle cx="230" cy="232" r="58" fill="#000" opacity=".45" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<circle cx="230" cy="230" r="56" fill="url(#' + d.disco + ')" stroke="#c99a3a" stroke-width="2.4"/>' +
        '<circle cx="230" cy="230" r="51.5" fill="none" stroke="#b8892f" stroke-width="2.2" stroke-dasharray="1.2 2.6" opacity=".8"/>' +
        '<circle cx="230" cy="230" r="47" fill="none" stroke="rgba(168,128,31,.35)" stroke-width=".8"/>' + cruz(194, '#a8801f');
    }
    if (V === 'C') {
      return '<circle cx="230" cy="230" r="54" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
        '<circle cx="230" cy="230" r="49.5" fill="none" style="stroke:rgba(var(--gold-rgb),.35)" stroke-width=".8"/>' + cruz(194, 'var(--gold)');
    }
    return '<circle cx="230" cy="230" r="54" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
      '<circle cx="230" cy="230" r="49.5" fill="none" style="stroke:rgba(var(--gold-rgb),.35)" stroke-width=".8"/>' + cruz(194, 'var(--gold)');
  }

  return {
    defs: defs, stage: stage, group: group, center: center, raio: raio,
    legenda: { peca: 'estandarte', masc: true, texto: ' é um critério: o comprimento do pano acompanha a soma, e o mais longo recebe a luz do vitral.' }
  };
})();
