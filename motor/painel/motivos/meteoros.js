/* Motivo "meteoros" do gráfico de pontuação: 02. Dragões, rebranding (lotes 3 e 4), variação R (Basalto em brasa) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "meteoros"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "meteoros", 02. Dragões (Fogo e Sangue, Lathliss). Rebranding, segunda rodada, variação R (realismo), 20/10/2026.
   Conversão do desenho embutido no chartSvg (meteorSvg, o céu e o medalhão com o olho da rainha) para a API dos motivos,
   com a mesma composição: cada meteoro desce para o centro, a cabeça junto do medalhão e o rastro para fora até a soma.
   Execução realista, como foto de um bólido: a cabeça é uma rocha escura de verdade, com a face da frente em brasa e
   rachaduras incandescentes; atrás dela, o plasma (branco, amarelo, laranja, vermelho) e depois a fumaça cinza que se
   abre e se desfaz; lascas se soltam pelo caminho. A única luz é a do fogo, na cor do fogo. O céu é noite com fumaça
   iluminada por baixo e estrelas. O olho no medalhão é um olho de réptil: íris âmbar fibrosa, pupila em fenda, escamas.
   A cor do critério não aparece: o rótulo identifica. O maior (94% ou mais) arde mais e explode em fragmentos.
   Regra C: o rastro vai de 80 a 80 + 96 f, linear, mínimo de 12%; raio(f) devolve esse raio. Sorteio por ctx.kit.sorte. */
var MOTIVO_PAINEL = (function () {
  var RB = 80, RMAX = 176, I;
  function raio(f) { return RB + (RMAX - RB) * Math.max(0.12, Math.min(1, f)); }
  function f1(n) { return (+n).toFixed(1); }
  function P(x, y) { return f1(x) + ' ' + f1(y); }
  function stops(st) { return st.map(function (x) { return '<stop offset="' + x[0] + '" style="stop-color:' + x[1] + (x[2] != null ? ';stop-opacity:' + x[2] : '') + '"/>'; }).join(''); }
  /* forma afunilada ao longo de x, de x0 a x1, meia largura w0 em x0 e w1 em x1, com uma ondulação fixa */
  function trilha(x0, x1, w0, w1, sd, amp) {
    var n = 14, up = [], dn = [], k;
    for (k = 0; k <= n; k++) {
      var t = k / n, x = x0 + (x1 - x0) * t, w = w0 + (w1 - w0) * t, ond = Math.sin(t * 9 + sd) * amp * t;
      up.push(P(x, -w + ond)); dn.unshift(P(x, w + ond));
    }
    return 'M' + P(x0, 0) + 'L' + up.join('L') + 'L' + dn.join('L') + 'Z';
  }
  /* rocha irregular (semente fixa) */
  function rocha(r, K) {
    var n = 9, pts = [];
    for (var k = 0; k < n; k++) { var a = k / n * Math.PI * 2, rr = r * (0.78 + 0.32 * K.sorte()); pts.push(P(rr * Math.cos(a), rr * Math.sin(a) * 0.92)); }
    return 'M' + pts.join('L') + 'Z';
  }
  return {
    raio: raio,
    legenda: { peca: "meteoro", masc: true, texto: " é um critério: o rastro de fogo e fumaça cresce com a soma, e o maior se parte em fragmentos." },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'mtr');
      I = {};
      'ceu fum neb clip vig fogo rocha brasa med esc iris palp sombra luz fum2 b1 b3'.split(' ').forEach(function (k) { I[k] = ctx.uid('mtr' + k); });
      o += '<radialGradient id="' + I.ceu + '" cx="230" cy="246" r="200" gradientUnits="userSpaceOnUse">' + stops([[0, '#2a110b'], [.45, '#170a09'], [.8, '#0b0609'], [1, '#050306']]) + '</radialGradient>';
      /* fumaça no céu, iluminada por baixo pelo fogo */
      o += '<filter id="' + I.neb + '" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="4" seed="29" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .42  0 0 0 0 .16  0 0 0 0 .08  0 0 0 2.1 -1.02"/></filter>';
      o += '<clipPath id="' + I.clip + '"><circle cx="230" cy="230" r="193"/></clipPath>';
      o += '<radialGradient id="' + I.vig + '" cx="230" cy="230" r="194" gradientUnits="userSpaceOnUse">' + stops([[.62, '#000', 0], [1, '#000', .7]]) + '</radialGradient>';
      /* fumaça do rastro: a borda se desfaz */
      o += '<filter id="' + I.fum + '" x="-20%" y="-60%" width="140%" height="220%"><feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="3" seed="7" result="t"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.1"/></filter>';
      o += '<filter id="' + I.fum2 + '" x="-20%" y="-60%" width="140%" height="220%"><feTurbulence type="fractalNoise" baseFrequency=".12" numOctaves="2" seed="13" result="t"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="t" scale="4" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".7"/></filter>';
      o += '<filter id="' + I.b1 + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>';
      o += '<filter id="' + I.b3 + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.5"/></filter>';
      o += '<radialGradient id="' + I.rocha + '" cx=".62" cy=".36" r=".8">' + stops([[0, '#5a463c'], [.45, '#2e221d'], [1, '#0e0806']]) + '</radialGradient>';
      o += '<radialGradient id="' + I.luz + '">' + stops([[0, '#ffb24a', .5], [.4, '#ff6a1a', .18], [1, '#ff4a10', 0]]) + '</radialGradient>';
      o += '<radialGradient id="' + I.med + '" cx="230" cy="214" r="58" gradientUnits="userSpaceOnUse">' + stops([[0, '#3a1a12'], [.6, '#22100b'], [1, '#0a0403']]) + '</radialGradient>';
      o += '<pattern id="' + I.esc + '" patternUnits="userSpaceOnUse" width="9" height="7.2" x="230" y="230"><rect width="9" height="7.2" style="fill:#1c0c08"/>' +
        '<path d="M-4.5 7.2Q0 0.6 4.5 7.2Q9 0.6 13.5 7.2M0 3.6Q4.5 -3 9 3.6" style="fill:none;stroke:#000" stroke-width="1.1" opacity=".75"/>' +
        '<path d="M-3.4 6.2Q0 1.6 3.4 6.2M5.6 6.2Q9 1.6 12.4 6.2M1.1 2.6Q4.5 -2 7.9 2.6" style="fill:none;stroke:#7a3a24" stroke-width=".5" opacity=".55"/></pattern>';
      o += '<radialGradient id="' + I.iris + '" cx="230" cy="191" r="10" gradientUnits="userSpaceOnUse">' + stops([[0, '#3a1a04'], [.14, '#ffef9a'], [.42, '#f7b32a'], [.78, '#c2560c'], [.93, '#6a2006'], [1, '#2a0a02']]) + '</radialGradient>';
      o += '<linearGradient id="' + I.palp + '" x1="0" y1="0" x2="0" y2="1">' + stops([[0, '#5a2a1c'], [.5, '#2a120c'], [1, '#0e0604']]) + '</linearGradient>';
      return o;
    },
    stage: function (ctx) {
      var K = ctx.kit, R = ctx.R, o = '', k;
      o += '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:url(#' + I.ceu + ')"/>' +
        '<g clip-path="url(#' + I.clip + ')"><rect x="30" y="30" width="400" height="400" filter="url(#' + I.neb + ')" opacity=".75"/></g>';
      /* estrelas, poucas e frias, longe do fogo */
      K.sorte(3);
      var st = '';
      for (k = 0; k < 90; k++) {
        var a = K.sorte() * 360, r = 62 + Math.sqrt(K.sorte()) * 128, rr = 0.3 + Math.pow(K.sorte(), 3) * 0.9, p = K.pt(a, r);
        st += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + f1(rr) + '" style="fill:#f4ecf0" opacity="' + f1(0.25 + 0.6 * K.sorte()) + '"/>';
      }
      o += st + '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:url(#' + I.vig + ')"/>' +
        '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:none;stroke:#3a2018" stroke-width="2.4"/>' +
        '<circle cx="230" cy="230" r="' + (R + 11.4) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.28)" stroke-width=".8"/>';
      return o;
    },
    group: function (g, ctx) {
      var K = ctx.kit, fr = Math.max(0, Math.min(1, g.frac)), c = Math.max(0.12, fr), X = raio(fr) - RB, Xmax = RMAX - RB;
      var rr = 5.5 + 5 * fr, big = fr >= 0.94, p = K.pt(g.am, RB), o = '';
      var tr = 'translate(' + f1(p[0]) + ' ' + f1(p[1]) + ') rotate(' + f1(g.am) + ')';
      var gp = ctx.uid('mtrp'), gc = ctx.uid('mtrc'), gs = ctx.uid('mtrs'), gf = ctx.uid('mtrf');
      var a0 = g.a0, a1 = g.a1, q = ctx.P;
      o += '<path d="M' + q(ctx.r0, a0) + 'L' + q(ctx.R, a0) + 'A' + ctx.R + ' ' + ctx.R + ' 0 0 1 ' + q(ctx.R, a1) + 'L' + q(ctx.r0, a1) + 'A' + ctx.r0 + ' ' + ctx.r0 + ' 0 0 0 ' + q(ctx.r0, a0) + 'Z" style="fill:transparent"/>';
      o += '<g transform="' + tr + '"><defs>' +
        '<linearGradient id="' + gs + '" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="' + f1(X) + '" y2="0">' + stops([[0, '#8a6a58', .0], [.12, '#8a7a72', .8], [.7, '#6e6560', .7], [.9, '#5a5250', .45], [1, '#4a4442', 0]]) + '</linearGradient>' +
        '<linearGradient id="' + gp + '" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="' + f1(Math.max(X * 0.62, rr * 3)) + '" y2="0">' + stops([[0, '#fff7e4'], [.1, '#ffd77a'], [.3, '#ff9a2a'], [.6, '#d4400e', .8], [1, '#8a1e06', 0]]) + '</linearGradient>' +
        '<linearGradient id="' + gc + '" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="' + f1(Math.max(X * 0.34, rr * 2)) + '" y2="0">' + stops([[0, '#fffdf4'], [.5, '#ffe9b0', .7], [1, '#ffd27a', 0]]) + '</linearGradient>' +
        '<linearGradient id="' + gf + '" gradientUnits="userSpaceOnUse" x1="' + f1(-rr) + '" y1="0" x2="' + f1(rr * 0.4) + '" y2="0">' + stops([[0, '#fffbe8'], [.35, '#ffd060'], [.7, '#ff7a1a', .85], [1, '#c83a0a', 0]]) + '</linearGradient>' +
        '</defs>';
      /* fantasma: a trajetória inteira, uma linha fina e apagada de fumaça (até 25%) */
      o += '<path d="M0 0L' + f1(Xmax) + ' 0" style="stroke:#c9b8b0" stroke-width=".9" stroke-dasharray="1 4" stroke-linecap="round" opacity=".25"/>';
      /* a luz que o bólido joga no céu em volta (cor do fogo) */
      o += '<circle cx="' + f1(rr * 0.6) + '" r="' + f1(rr * (big ? 6 : 4.2)) + '" style="fill:url(#' + I.luz + ')" opacity="' + (big ? .9 : .55 + .3 * c).toFixed(2) + '"/>';
      /* fumaça: abre e se desfaz para fora */
      K.sorte(11 + g.i * 13);
      var sd = K.sorte() * 6;
      o += '<path d="' + trilha(rr * 0.8, X, rr * 0.7, rr * 1.15 + X * 0.07, sd, 2.2) + '" style="fill:url(#' + gs + ')" filter="url(#' + I.fum + ')"/>' +
        '<path d="' + trilha(rr * 0.8, X * 0.85, rr * 0.35, rr * 0.6 + X * 0.03, sd + 1.7, 1.6) + '" style="fill:url(#' + gs + ')" opacity=".6" filter="url(#' + I.fum2 + ')"/>';
      /* plasma: o rastro em brasa logo atrás da rocha, com núcleo branco curto */
      var Lp = Math.max(X * 0.62, rr * 3);
      o += '<path d="' + trilha(0, Lp, rr * 0.82, rr * 0.18, sd, 0.8) + '" style="fill:url(#' + gp + ')" filter="url(#' + I.b1 + ')"/>' +
        '<path d="' + trilha(0, Math.max(X * 0.34, rr * 2), rr * 0.42, 0.3, sd, 0.4) + '" style="fill:url(#' + gc + ')"/>';
      /* lascas que se soltam: pontos em brasa que esfriam para fora */
      var nb = 2 + Math.round(4 * c);
      for (var k = 0; k < nb; k++) {
        var bx = rr * 1.4 + K.sorte() * (X - rr * 1.4) * 0.9, by = (K.sorte() - 0.5) * (rr * 1.2 + bx * 0.12), br = 0.45 + K.sorte() * 0.6, hot = 1 - bx / Math.max(X, 1);
        o += '<circle cx="' + f1(bx) + '" cy="' + f1(by) + '" r="' + f1(br * 2.6) + '" style="fill:#ff7a1a" opacity="' + f1(0.25 * hot + 0.08) + '" filter="url(#' + I.b1 + ')"/>' +
          '<circle cx="' + f1(bx) + '" cy="' + f1(by) + '" r="' + f1(br) + '" style="fill:' + (hot > .5 ? '#ffe2a0' : '#ff8a3a') + '"/>';
      }
      /* a rocha: basalto escuro, face da frente em brasa, rachaduras acesas */
      K.sorte(70 + g.i);
      var rk = rocha(rr * 0.8, K), cl = ctx.uid('mtrk');
      o += '<path d="M' + P(-rr * 0.35, -rr * 0.86) + 'A' + f1(rr * 0.92) + ' ' + f1(rr * 0.92) + ' 0 0 0 ' + P(-rr * 0.35, rr * 0.86) + '" style="fill:none;stroke:#ffe2a0" stroke-width="' + f1(1.4 + 1.2 * c) + '" stroke-linecap="round" opacity=".7" filter="url(#' + I.b1 + ')"/>' +
        '<defs><clipPath id="' + cl + '"><path d="' + rk + '"/></clipPath></defs>' +
        '<path d="' + rk + '" style="fill:url(#' + I.rocha + ')"/>' +
        '<g clip-path="url(#' + cl + ')"><rect x="' + f1(-rr * 1.2) + '" y="' + f1(-rr) + '" width="' + f1(rr * 1.6) + '" height="' + f1(rr * 2) + '" style="fill:url(#' + gf + ')"/>' +
        '<path d="M' + P(-rr * 0.2, -rr * 0.5) + 'L' + P(rr * 0.15, -rr * 0.1) + 'L' + P(0, rr * 0.25) + 'L' + P(rr * 0.35, rr * 0.5) + 'M' + P(rr * 0.15, -rr * 0.1) + 'L' + P(rr * 0.5, -rr * 0.2) + '" style="fill:none;stroke:#ff8a2a" stroke-width=".55" stroke-linecap="round"/>' +
        '<rect x="' + f1(-rr) + '" y="' + f1(-rr) + '" width="' + f1(rr * 2) + '" height="' + f1(rr * 2) + '" style="fill:#000" opacity=".25" filter="url(#' + ctx.k.textura + ')"/></g>' +
        '<path d="' + rk + '" style="fill:none;stroke:#0a0504" stroke-width=".5" opacity=".7"/>';
      if (big) {
        /* o maior arde mais: clarão maior na frente e faíscas riscando paralelas ao rastro */
        o += '<circle cx="' + f1(-rr * 0.3) + '" r="' + f1(rr * 1.5) + '" style="fill:#ffd27a" opacity=".35" filter="url(#' + I.b3 + ')"/>';
        K.sorte(140 + g.i);
        for (var s2 = 0; s2 < 7; s2++) {
          var sx = rr * (0.6 + 4 * K.sorte()), sy = (K.sorte() - 0.5) * rr * 3.2, sl = 3 + 6 * K.sorte();
          o += '<path d="M' + P(sx, sy) + 'L' + P(sx + sl, sy) + '" style="stroke:#ff9a3a" stroke-width=".6" stroke-linecap="round" opacity="' + f1(0.35 + 0.3 * K.sorte()) + '"/>' +
            '<circle cx="' + f1(sx) + '" cy="' + f1(sy) + '" r=".7" style="fill:#fff6dc"/>';
        }
      }
      return o + '</g>';
    },
    center: function (ctx) {
      /* medalhão de couro escamado, com o olho de réptil no alto */
      var y = 191, cl = ctx.uid('mtre'), cm = ctx.uid('mtrm'), o = '';
      var olho = 'M213 ' + y + 'Q230 ' + (y - 13) + ' 247 ' + y + 'Q230 ' + (y + 12) + ' 213 ' + y + 'Z';
      var fib = '';
      for (var k = 0; k < 36; k++) {
        var a = k * 10 * Math.PI / 180, r0 = 2.4 + (k % 3) * 0.5, r1 = 9 - (k % 2) * 1.4;
        fib += 'M' + P(230 + r0 * Math.cos(a), y + r0 * Math.sin(a)) + 'L' + P(230 + r1 * Math.cos(a), y + r1 * Math.sin(a));
      }
      o += '<circle cx="232" cy="233" r="57" style="fill:#000" opacity=".55" filter="url(#' + I.b3 + ')"/>' +
        '<defs><clipPath id="' + cm + '"><circle cx="230" cy="230" r="54"/></clipPath><clipPath id="' + cl + '"><path d="' + olho + '"/></clipPath></defs>' +
        '<circle cx="230" cy="230" r="55" style="fill:url(#' + I.med + ')"/>' +
        '<g clip-path="url(#' + cm + ')"><rect x="170" y="170" width="120" height="120" style="fill:url(#' + I.esc + ')" opacity=".9"/>' +
        '<circle cx="230" cy="236" r="44" style="fill:#0a0403" opacity=".72" filter="url(#' + I.b3 + ')"/></g>' +
        '<circle cx="230" cy="230" r="55" style="fill:none;stroke:#4a2418" stroke-width="2.2"/>' +
        '<circle cx="230" cy="230" r="56.4" style="fill:none;stroke:rgba(var(--gold-rgb),.35)" stroke-width=".7"/>' +
        /* pálpebra grossa e o olho */
        '<path d="M208 ' + (y + 1) + 'Q230 ' + (y - 19) + ' 252 ' + (y + 1) + 'Q230 ' + (y + 16) + ' 208 ' + (y + 1) + 'Z" style="fill:url(#' + I.palp + ')"/>' +
        '<path d="' + olho + '" style="fill:url(#' + I.iris + ')"/>' +
        '<g clip-path="url(#' + cl + ')"><path d="' + fib + '" style="fill:none;stroke:#6a2a06" stroke-width=".35" opacity=".8"/>' +
        '<path d="M213 ' + (y - 6) + 'Q230 ' + (y - 2) + ' 247 ' + (y - 6) + 'V' + (y - 14) + 'H213Z" style="fill:#000" opacity=".45"/></g>' +
        '<path d="M230 ' + (y - 9.5) + 'Q232.4 ' + y + ' 230 ' + (y + 9) + 'Q227.6 ' + y + ' 230 ' + (y - 9.5) + 'Z" style="fill:#050100"/>' +
        '<ellipse cx="225.2" cy="' + (y - 3.2) + '" rx="1.8" ry="1.1" transform="rotate(-25 225.2 ' + (y - 3.2) + ')" style="fill:#fff" opacity=".9"/>' +
        '<circle cx="236" cy="' + (y + 3) + '" r=".6" style="fill:#fff" opacity=".5"/>' +
        '<path d="' + olho + '" style="fill:none;stroke:#120604" stroke-width="1.1"/>' +
        '<path d="M212 ' + (y - 1) + 'Q230 ' + (y - 15.5) + ' 248 ' + (y - 1) + '" style="fill:none;stroke:#8a4a30" stroke-width=".6" opacity=".6"/>';
      return o;
    }
  };
})();
