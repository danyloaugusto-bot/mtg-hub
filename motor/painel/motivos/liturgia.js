/* Motivo "liturgia" do gráfico de pontuação: 01. Vito, rebranding (lotes 3 e 4), variação R (Cristal e ouro) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "liturgia"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Protótipo R (rebranding, 2ª rodada) do motivo "liturgia": 01. Vito (Sangria Sagrada).
   Mesma composição da Liturgia Sanguínea votada em 15/10: em cada raio, um cálice de pé com a boca para o aro; o sangue
   assenta na taça e corre por um canal até o medalhão. Refeito como objeto fotografado: cálices de cristal com montagem de
   ouro polido (o reflexo atravessa o metal como num cilindro), sangue escuro e opaco com menisco, sobre mármore negro
   com veios e filetes de latão embutidos. A luz é a de uma vela fora de quadro, no alto à esquerda: quente, sem halo
   colorido; cada cálice faz sombra no mármore. A cor do critério é só a pedra cabochão no nó da haste.
   Medida: o nível na taça e o filete no canal seguem max(12%, frac). Coordenadas locais: x atravessa o raio, y é a
   distância ao centro. */
var MOTIVO_PAINEL = (function () {
  var D = Math.PI / 180;
  function pol(r, a) { return [230 + r * Math.cos(a * D), 230 + r * Math.sin(a * D)]; }
  function f1(n) { return (+n).toFixed(1); }
  function P(x, y) { return f1(x) + ' ' + f1(y); }
  function T(am) { return 'translate(230 230) rotate(' + (am - 90).toFixed(2) + ')'; }
  function circ(r) { return 'M' + f1(230 - r) + ' 230a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0Z'; }
  function stops(st) { return st.map(function (x) { return '<stop offset="' + x[0] + '" style="stop-color:' + x[1] + (x[2] != null ? ';stop-opacity:' + x[2] : '') + '"/>'; }).join(''); }
  function lin(id, v, st, ex) { return '<linearGradient id="' + id + '" x1="' + v[0] + '" y1="' + v[1] + '" x2="' + v[2] + '" y2="' + v[3] + '"' + (ex || '') + '>' + stops(st) + '</linearGradient>'; }
  function rad(id, ex, st) { return '<radialGradient id="' + id + '" ' + ex + '>' + stops(st) + '</radialGradient>'; }
  function torus(a, b, R) {
    function o(r) { return (r / R).toFixed(4); }
    var d = b - a;
    return [[o(a), '#1e1203'], [o(a + d * 0.14), '#7a5518'], [o(a + d * 0.32), '#d8a94e'], [o(a + d * 0.42), '#fbe6b0'], [o(a + d * 0.5), '#c8963c'],
      [o(a + d * 0.66), '#4a3210'], [o(a + d * 0.84), '#a27630'], [o(b), '#160d02']];
  }
  var K = {};

  // taça: meia largura em função da distância ao centro (fundo estreito em 134, boca larga em 174)
  function bowlW(r) { var t = Math.max(0, Math.min(1, (174 - r) / 40)); return 6 + 20 * Math.sqrt(1 - t * t) + 1.5 * Math.pow(1 - t, 3); }
  function bowl(ins) {
    var L = [], Rr = [];
    for (var r = 134; r <= 174.01; r += 1.6) { var w = Math.max(0.5, bowlW(r) - ins); Rr.push(P(w, r)); L.unshift(P(-w, r)); }
    return 'M' + L.join('L') + 'L' + Rr.join('L') + 'Z';
  }
  function side(k, ins) { var s = ''; for (var r = 135; r <= 172.01; r += 1.6) s += (s ? 'L' : 'M') + P(k * (bowlW(r) - ins), r); return s; }
  function drip(x, r0, len, w) {
    var c = r0 - len + w;
    return '<path d="M' + P(x - 0.45 * w, r0) + 'C' + P(x - 0.4 * w, r0 - 0.5 * len) + ' ' + P(x - w, c + w) + ' ' + P(x - w, c) +
      'A' + w + ' ' + w + ' 0 0 1 ' + P(x + w, c) + 'C' + P(x + w, c + w) + ' ' + P(x + 0.4 * w, r0 - 0.5 * len) + ' ' + P(x + 0.45 * w, r0) + 'Z"/>';
  }
  var HOLE = 'M-3.6 60A3.6 3.6 0 0 1 3.6 60L3.6 99L-3.6 99Z';
  var SPOKE = 'M-7 56L7 56L7.6 62L10.4 63.2L10.4 67L7.4 68.4L6.6 99L-6.6 99L-7.4 68.4L-10.4 67L-10.4 63.2L-7.6 62Z';
  var FOOT = 'M-17 99C-17 96.6 17 96.6 17 99C17 103.4 9.4 105.8 5.8 107.8C4.2 108.8 3.4 110.4 3.4 112L-3.4 112C-3.4 110.4 -4.2 108.8 -5.8 107.8C-9.4 105.8 -17 103.4 -17 99Z';
  var CALYX = 'M-16 140.4C-10 142.6 10 142.6 16 140.4C13 136.6 9 134.4 5.6 133.2L-5.6 133.2C-9 134.4 -13 136.6 -16 140.4Z';
  var FLEUR = 'M0 168L9 182L0 194.6L-9 182Z';

  function defs(ctx) {
    'gold goldV rim bez marble vein speck warm vig onyx glass blood hl shadow shadowS clipD rose cab'.split(' ').forEach(function (n) { K[n] = ctx.uid('vr' + n); });
    var s = '';
    // ouro polido visto como cilindro: borda escura, meio-tom, reflexo estreito, a faixa escura do ambiente e o contraluz da vela
    s += lin(K.gold, [0, 0, 1, 0], [[0, '#24170a'], [0.1, '#5e4114'], [0.26, '#b8862f'], [0.38, '#efcd7e'], [0.44, '#fff2cc'], [0.5, '#d4a24a'],
      [0.62, '#5a3c11'], [0.74, '#3a270b'], [0.86, '#a77a2e'], [0.94, '#e2b964'], [1, '#2e1e08']]);
    s += lin(K.goldV, [0, 0, 0, 1], [[0, '#fff0c4'], [0.25, '#d9a74c'], [0.55, '#7a5518'], [0.8, '#3a270b'], [1, '#b08236']]);
    s += rad(K.rim, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="196"', torus(180, 195, 196));
    s += rad(K.bez, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="58"', torus(48, 57, 58));
    // mármore negro: fundo quente, veios finos (as dobras do ruído "turbulence"), pontinhos de calcita
    s += rad(K.marble, 'gradientUnits="userSpaceOnUse" cx="200" cy="190" r="230"', [[0, '#1b1512'], [0.6, '#0e0b09'], [1, '#040303']]);
    s += '<filter id="' + K.vein + '" filterUnits="userSpaceOnUse" x="30" y="30" width="400" height="400"><feTurbulence type="turbulence" baseFrequency=".010 .022" numOctaves="4" seed="29" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .78  0 0 0 0 .72  0 0 0 0 .64  -16 0 0 0 1.25"/><feComposite in2="SourceAlpha" operator="in"/></filter>';
    s += '<filter id="' + K.speck + '" filterUnits="userSpaceOnUse" x="30" y="30" width="400" height="400"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="4" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .9  0 0 0 0 .85  0 0 0 0 .8  4 0 0 0 -2.5"/><feComposite in2="SourceAlpha" operator="in"/></filter>';
    // a vela fora de quadro: um sopro quente no alto à esquerda
    s += rad(K.warm, 'gradientUnits="userSpaceOnUse" cx="120" cy="80" r="320"', [[0, '#ffb35a', 0.13], [0.5, '#ff9a3c', 0.04], [1, '#ff9a3c', 0]]);
    s += rad(K.vig, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="182"', [[0.6, '#000', 0], [1, '#000', 0.7]]);
    s += rad(K.onyx, 'gradientUnits="userSpaceOnUse" cx="218" cy="214" r="56"', [[0, '#231816'], [0.6, '#0c0807'], [1, '#020101']]);
    // cristal: borda mais densa (Fresnel), miolo quase invisível
    s += lin(K.glass, [0, 0, 1, 0], [[0, 'rgba(255,236,214,.34)'], [0.07, 'rgba(70,40,30,.3)'], [0.22, 'rgba(20,10,8,.12)'], [0.5, 'rgba(10,6,6,.06)'],
      [0.8, 'rgba(20,10,8,.12)'], [0.93, 'rgba(70,40,30,.3)'], [1, 'rgba(255,236,214,.24)']]);
    // sangue: opaco, mais escuro onde a taça é mais grossa
    s += lin(K.blood, [0, 0, 1, 0], [[0, '#160104'], [0.18, '#3e030a'], [0.42, '#740a16'], [0.56, '#7e0d1a'], [0.8, '#3e030a'], [1, '#160104']]);
    s += lin(K.hl, [0, 0, 0, 1], [[0, '#fff', 0], [0.3, '#fff', 0.55], [0.75, '#fff', 0.3], [1, '#fff', 0]]);
    s += '<filter id="' + K.shadow + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.2"/><feOffset dx="3" dy="4" result="o"/>' +
      '<feComponentTransfer in="o" result="s"><feFuncA type="linear" slope=".72"/></feComponentTransfer><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    s += '<filter id="' + K.shadowS + '" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter>';
    s += '<clipPath id="' + K.clipD + '"><circle cx="230" cy="230" r="181"/></clipPath>';
    s += rad(K.rose, 'cx=".4" cy=".35" r=".75"', [[0, '#a8202e'], [0.5, '#6a0a16'], [1, '#2a0408']]);
    K.clipBowl = ctx.uid('vrB'); K.clipHole = ctx.uid('vrH');
    s += '<clipPath id="' + K.clipBowl + '"><path d="' + bowl(1.6) + '"/></clipPath><clipPath id="' + K.clipHole + '"><path d="' + HOLE + '"/></clipPath>';
    return s;
  }

  function stage(ctx) {
    var o = '', k;
    o += '<circle cx="230" cy="230" r="196" style="fill:url(#' + K.marble + ')"/>' +
      '<g clip-path="url(#' + K.clipD + ')"><rect x="40" y="40" width="380" height="380" fill="#000" filter="url(#' + K.vein + ')" opacity=".36"/>' +
      '<rect x="40" y="40" width="380" height="380" fill="#000" filter="url(#' + K.speck + ')" opacity=".25"/></g>' +
      '<circle cx="230" cy="230" r="182" style="fill:url(#' + K.warm + ')"/>' +
      '<circle cx="230" cy="230" r="182" style="fill:url(#' + K.vig + ')"/>';
    // filetes de latão embutidos entre os raios, e a faixa de ônix por dentro do aro
    ctx.groups.forEach(function (g) {
      var a = pol(64, g.a0 - ctx.gap), b = pol(162, g.a0 - ctx.gap);
      o += '<path d="M' + P(a[0], a[1]) + 'L' + P(b[0], b[1]) + '" stroke="#000" stroke-opacity=".6" stroke-width="2.2"/>' +
        '<path d="M' + P(a[0], a[1]) + 'L' + P(b[0], b[1]) + '" stroke="#9a7633" stroke-width="1.1"/>';
    });
    o += '<path d="' + circ(173) + circ(163.5) + '" fill-rule="evenodd" style="fill:#080505"/>' +
      '<path d="' + circ(164.6) + circ(163) + '" fill-rule="evenodd" style="fill:#9a7633"/>' +
      '<circle cx="230" cy="230" r="118" fill="none" stroke="#9a7633" stroke-opacity=".55" stroke-width=".9"/>';
    // o aro: toro de ouro, a sombra que ele joga para dentro e marcas de uso
    o += '<g clip-path="url(#' + K.clipD + ')"><circle cx="233" cy="234" r="182" fill="none" stroke="#000" stroke-opacity=".7" stroke-width="6" filter="url(#' + K.shadowS + ')"/></g>';
    o += '<path d="' + circ(195) + circ(180) + '" fill-rule="evenodd" style="fill:url(#' + K.rim + ')"/>' +
      '<path d="' + circ(177) + circ(175.2) + '" fill-rule="evenodd" style="fill:#a77a2e"/>';
    var risco = '';
    for (k = 0; k < 40; k++) {
      var a0 = (k * 137.5) % 360, rr = 182 + (k * 7) % 12, p0 = pol(rr, a0), p1 = pol(rr + 0.6, a0 + 1.2 + (k % 3));
      risco += 'M' + P(p0[0], p0[1]) + 'L' + P(p1[0], p1[1]);
    }
    o += '<path d="' + risco + '" stroke="#2a1a06" stroke-opacity=".45" stroke-width=".4"/>' +
      '<circle cx="230" cy="230" r="195.4" style="fill:none;stroke:#000" stroke-opacity=".7" stroke-width=".8"/>';
    return o;
  }

  function group(g, ctx) {
    var f = Math.max(0.12, Math.min(1, g.frac)), tr = T(g.am), o = '';
    var head = 99 - f * (99 - 60), lv = 141 + f * 31;
    // canal cavado e o raio de ouro, com sombra no mármore
    o += '<g filter="url(#' + K.shadow + ')"><g transform="' + tr + '">' +
      '<path d="' + FLEUR + '" style="fill:url(#' + K.gold + ')"/>' +
      '<path d="' + SPOKE + HOLE + '" fill-rule="evenodd" style="fill:url(#' + K.gold + ')"/>' +
      '<path d="' + FOOT + '" style="fill:url(#' + K.gold + ')"/>' +
      '<rect x="-18" y="96.6" width="36" height="3.2" rx="1.6" style="fill:url(#' + K.goldV + ')"/>' +
      '<rect x="-3.2" y="108" width="6.4" height="27" rx="1.6" style="fill:url(#' + K.gold + ')"/>' +
      '<ellipse cx="0" cy="113.4" rx="5.4" ry="2" style="fill:url(#' + K.gold + ')"/><ellipse cx="0" cy="131.2" rx="5.4" ry="2" style="fill:url(#' + K.gold + ')"/>' +
      '<ellipse cx="0" cy="122" rx="8.8" ry="6.4" style="fill:url(#' + K.gold + ')"/>' +
      '<path d="' + CALYX + '" style="fill:url(#' + K.gold + ')"/>' +
      // o sangue dentro do cristal (o vidro em si quase não faz sombra)
      '<g clip-path="url(#' + K.clipBowl + ')"><rect x="-30" y="132" width="60" height="' + f1(lv - 132) + '" style="fill:url(#' + K.blood + ')"/></g>' +
      '</g></g>';
    o += '<g transform="' + tr + '">' +
      // o fundo do canal: sombra do lado de cima e o sangue que já correu
      '<path d="' + HOLE + '" style="fill:#0a0303"/>' +
      '<g clip-path="url(#' + K.clipHole + ')"><rect x="-6" y="56" width="3" height="46" fill="#000" opacity=".6"/>' +
      '<rect x="-5" y="' + f1(head) + '" width="10" height="' + f1(101 - head) + '" style="fill:url(#' + K.blood + ')"/>' +
      '<circle cx="0" cy="' + f1(head) + '" r="3.6" style="fill:#5a0610"/></g>' +
      '<path d="M-1.4 ' + f1(head + 1.4) + 'L-1.4 ' + f1(Math.max(head + 1.6, 96)) + '" stroke="#ffd8c8" stroke-opacity=".35" stroke-width=".6" stroke-linecap="round"/>' +
      // a superfície do sangue na taça: menisco e o reflexo da vela
      '<g clip-path="url(#' + K.clipBowl + ')"><ellipse cx="0" cy="' + f1(lv) + '" rx="' + f1(bowlW(lv) - 1.6) + '" ry="2.1" style="fill:#4e0710"/>' +
      '<path d="M' + P(-(bowlW(lv) - 4), lv - 0.9) + 'Q' + P(-(bowlW(lv) - 10) * 0.5, lv - 1.8) + ' ' + P(0, lv - 1.9) + '" fill="none" stroke="#ff9a88" stroke-opacity=".45" stroke-width=".6"/></g>' +
      // o cristal: corpo quase transparente, bordas densas, um reflexo comprido da vela e um curto do outro lado
      '<path d="' + bowl(0) + '" style="fill:url(#' + K.glass + ')"/>' +
      '<path d="' + side(1, 0.6) + '" fill="none" stroke="#fff4e4" stroke-opacity=".28" stroke-width=".7"/>' +
      '<path d="' + side(-1, 0.6) + '" fill="none" stroke="#fff4e4" stroke-opacity=".45" stroke-width=".8"/>' +
      '<path d="M-17.5 166C-20 158 -19.6 150 -14.4 143.4" fill="none" stroke="url(#' + K.hl + ')" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M15.6 160C17 155 16.6 151 14.2 147" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.1" stroke-linecap="round"/>' +
      // a borda de ouro da boca
      '<rect x="-28.5" y="171.2" width="57" height="7.2" rx="3.4" style="fill:url(#' + K.gold + ')"/>' +
      '<path d="M-26.6 172.3L26.6 172.3" stroke="#fff2cc" stroke-opacity=".35" stroke-width=".5"/>' +
      // o cabochão do nó, na cor do critério
      '<circle cx="0" cy="122" r="4.4" style="fill:#140b03"/><circle cx="0" cy="122" r="3.5" style="fill:' + g.cor + '"/>' +
      '<circle cx="0" cy="122" r="3.5" fill="#000" fill-opacity=".35"/>' +
      '<ellipse cx="-1" cy="120.9" rx="1.5" ry=".9" fill="#fff" fill-opacity=".55"/>' +
      '</g>';
    if (g.top) {
      // o maior transborda: o sangue passa da boca e escorre pelo ouro, na direção do centro
      o += '<g transform="' + tr + '" style="fill:#4a050d">' +
        '<path d="M-28.4 174.6C-23 186 23 186 28.4 174.6C20 176.6 -20 176.6 -28.4 174.6Z"/>' +
        drip(-26.6, 176, 24, 2.6) + drip(26.2, 176, 15, 2.2) + drip(-12, 176, 8.5, 1.9) + drip(9, 176, 6.5, 1.7) + '</g>' +
        '<g transform="' + tr + '"><path d="M-22 180.6Q0 183.4 22 180.6" fill="none" stroke="#ff9a88" stroke-opacity=".35" stroke-width=".6"/>' +
        '<circle cx="-27" cy="155.5" r=".9" fill="#ffb0a0" fill-opacity=".5"/></g>';
    }
    return o;
  }

  // a Dusk Rose pequena, em sangue e ouro
  function rose(x, y, s) {
    function Tt(d) { var n = 0; return d.replace(/-?\d*\.?\d+/g, function (v) { return f1((n++ % 2 ? y : x) + parseFloat(v) * s); }); }
    var ink = '#140802', sw = f1(0.5 * s);
    return '<path d="' + Tt('M -1 6 C -4 7 -7 7.6 -9 6.2 C -7 4.8 -4 4.6 -1 6 Z') + '" style="fill:#a77a2e;stroke:' + ink + '" stroke-width="' + sw + '"/>' +
      '<path d="' + Tt('M 1 6 C 4 7 7 7.6 9 6.2 C 7 4.8 4 4.6 1 6 Z') + '" style="fill:#a77a2e;stroke:' + ink + '" stroke-width="' + sw + '"/>' +
      '<path d="' + Tt('M -6.6 -2.6 C -8.2 -6.4 -4.6 -8.8 -2.4 -7 C -1.2 -8.8 1.2 -8.8 2.4 -7 C 4.6 -8.8 8.2 -6.4 6.6 -2.6 C 4 0 -4 0 -6.6 -2.6 Z') + '" style="fill:url(#' + K.rose + ');stroke:#c8963c" stroke-width="' + sw + '"/>' +
      '<path d="' + Tt('M -7.2 -2.8 C -7.6 2.2 -4.6 5.6 0 5.8 C 4.6 5.6 7.6 2.2 7.2 -2.8 C 4.6 -0.4 -4.6 -0.4 -7.2 -2.8 Z') + '" style="fill:url(#' + K.rose + ');stroke:#c8963c" stroke-width="' + sw + '"/>' +
      '<path d="' + Tt('M -2.8 -2.4 C -3 -5.6 2.6 -6 3 -3 C 3.2 -1 0.4 -0.6 -0.2 -2.4 C -0.6 -3.6 1.2 -4 1.4 -3') + '" style="fill:none;stroke:#c8963c" stroke-width="' + f1(0.7 * s) + '" stroke-linecap="round"/>';
  }

  function center(ctx) {
    return '<circle cx="232" cy="233" r="58" fill="#000" fill-opacity=".6" filter="url(#' + K.shadowS + ')"/>' +
      '<circle cx="230" cy="230" r="49" style="fill:url(#' + K.onyx + ')"/>' +
      '<ellipse cx="222" cy="205" rx="26" ry="9" fill="#fff" fill-opacity=".045"/>' +
      '<path d="' + circ(57) + circ(48.5) + '" fill-rule="evenodd" style="fill:url(#' + K.bez + ')"/>' +
      '<circle cx="230" cy="230" r="45.6" style="fill:none;stroke:#9a7633" stroke-opacity=".5" stroke-width=".8"/>' +
      ctx.groups.map(function (g) { var p = pol(52.7, g.am); return '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="1.3" fill="#2a1a06" fill-opacity=".6"/>'; }).join('') +
      rose(230, 194, 0.95);
  }

  return {
    deck: '01. Vito', nome: 'Liturgia (cristal e ouro)',
    defs: defs, stage: stage, group: group, center: center,
    legenda: { peca: "cálice", masc: true, texto: " é um critério: o nível do sangue na taça e o filete no canal acompanham os pontos, e o maior transborda." }
  };
})();
