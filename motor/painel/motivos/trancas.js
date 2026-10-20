/* Motivo "trancas" do gráfico de pontuação: 05. Braids, rebranding (lotes 3 e 4), variação C (Planta de Tolária) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "trancas"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "trancas" do gráfico de pontuação: 05. Braids (Presente de Grego), rebranding, segunda rodada, variação C (criativa).
   "Planta de Tolária": as mesmas dez tranças e os óculos de aviadora, desenhados como uma cianotipia de oficina de artífice
   (a Braids é maga de Tolária e o deck é de artefatos). Papel azul-da-prússia dobrado em quatro, quadriculado fino,
   transferidor na borda e linhas de centro traço-ponto. Cada trança é desenho técnico a traço branco: o trecho feito, até
   a soma, tem contorno cheio e fios a lápis de cor (a cor do critério); o resto até o máximo fica em linha oculta,
   tracejada, como manda a convenção, e é o fantasma. A cota no fim marca a soma. Sem brilho, sem halo, sem mix-blend.
   Medida: a trança vai da braçadeira até raio(g.frac), linear com mínimo de 12%. */
var MOTIVO_PAINEL = (function () {
  var RA = 64, RB = 182, RS = 68, H = 8.6, I = {};
  function f1(n) { return (+n).toFixed(1); }
  function cl(f) { return Math.max(0.12, Math.min(1, f)); }
  function raio(f) { return RA + (RB - RA) * cl(f); }
  function lobo(u0, L, s, h, bojo) {
    var x0 = u0, y0 = s * h, x1 = u0 + L, y1 = -s * h * 0.02, mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, m = Math.hypot(dx, dy) || 1,
      nx = -dy / m, ny = dx / m, t = L * bojo;
    return { x0: x0, y0: y0, x1: x1, y1: y1, mx: mx, my: my, nx: nx, ny: ny, t: t,
      d: 'M' + f1(x0) + ' ' + f1(y0) + 'Q' + f1(mx + nx * t) + ' ' + f1(my + ny * t) + ' ' + f1(x1) + ' ' + f1(y1) + 'Q' + f1(mx - nx * t) + ' ' + f1(my - ny * t) + ' ' + f1(x0) + ' ' + f1(y0) + 'Z' };
  }
  /* mechas com o passo fixo da trança cheia, para o trecho feito e a linha oculta casarem */
  function mechas(rS, rE) {
    var n = 13, p = (RB - rS) / (n + 1), L = 2 * p, out = [];
    for (var k = 0; k < n; k++) out.push(lobo(rS + k * p, L, k % 2 ? 1 : -1, H, 0.72));
    return out;
  }
  return {
    raio: raio,
    legenda: { peca: "trança", masc: false, texto: " é um critério: a trança está desenhada até a soma, e o resto até o máximo fica em linha oculta." },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'trC');
      I = { papel: ctx.uid('trCp'), manchas: ctx.uid('trCm'), grade: ctx.uid('trCg'), disco: ctx.uid('trCd'), clip: ctx.uid('trCc') };
      return o +
        '<radialGradient id="' + I.papel + '" cx="205" cy="195" r="230" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1c4f8e"/><stop offset=".6" stop-color="#14407a"/><stop offset="1" stop-color="#0b2a55"/></radialGradient>' +
        /* manchas do papel cianotipado: ruído largo, claro e escuro, bem fraco */
        '<filter id="' + I.manchas + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035 .05" numOctaves="3" seed="11" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .85  0 0 0 0 .92  0 0 0 0 1  0 0 0 1.4 -.55" result="c"/><feComposite in="c" in2="SourceGraphic" operator="in"/></filter>' +
        '<pattern id="' + I.grade + '" patternUnits="userSpaceOnUse" x="0" y="0" width="10" height="10"><path d="M10 0V10H0" style="fill:none;stroke:#cfe2ff" stroke-width=".35" opacity=".16"/></pattern>' +
        '<clipPath id="' + I.clip + '"><circle cx="230" cy="230" r="193"/></clipPath>' +
        '<radialGradient id="' + I.disco + '" cx="220" cy="214" r="70" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0f2f5c"/><stop offset="1" stop-color="#081b38"/></radialGradient>';
    },
    stage: function (ctx) {
      var K = ctx.kit, o = '', k, tk = '';
      o += '<circle cx="230" cy="230" r="194" style="fill:#000" opacity=".5" transform="translate(2 3)" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<circle cx="230" cy="230" r="194" fill="url(#' + I.papel + ')"/>' +
        '<circle cx="230" cy="230" r="194" style="fill:#fff" filter="url(#' + I.manchas + ')" opacity=".12"/>' +
        '<circle cx="230" cy="230" r="194" style="fill:#fff" filter="url(#' + ctx.k.textura + ')" opacity=".04"/>' +
        '<g clip-path="url(#' + I.clip + ')"><rect x="30" y="30" width="400" height="400" fill="url(#' + I.grade + ')"/>' +
        /* papel dobrado em quatro: o vinco claro de um lado e escuro do outro */
        '<path d="M30 230H430M230 30V430" style="stroke:#000" stroke-width="2.4" opacity=".16" transform="translate(1 1)"/>' +
        '<path d="M30 230H430M230 30V430" style="stroke:#d8e8ff" stroke-width=".7" opacity=".22"/></g>';
      /* transferidor na borda: traço a cada 3 graus, maior a cada 18 */
      for (k = 0; k < 120; k++) {
        var a = -90 + k * 3, big = k % 6 === 0, p0 = K.pt(a, 188 - (big ? 6 : 2.6)), p1 = K.pt(a, 188);
        tk += 'M' + f1(p0[0]) + ' ' + f1(p0[1]) + 'L' + f1(p1[0]) + ' ' + f1(p1[1]);
      }
      o += '<path d="' + tk + '" style="fill:none;stroke:#e6f0ff" stroke-width=".55" opacity=".55"/>' +
        '<circle cx="230" cy="230" r="188" style="fill:none;stroke:#e6f0ff" stroke-width=".8" opacity=".6"/>' +
        '<circle cx="230" cy="230" r="192" style="fill:none;stroke:#e6f0ff" stroke-width="1.4" opacity=".7"/>' +
        '<circle cx="230" cy="230" r="' + RB + '" style="fill:none;stroke:#e6f0ff" stroke-width=".5" stroke-dasharray="6 2 1 2" opacity=".35"/>' +
        '<circle cx="230" cy="230" r="' + RA + '" style="fill:none;stroke:#e6f0ff" stroke-width=".5" stroke-dasharray="6 2 1 2" opacity=".35"/>';
      return o;
    },
    group: function (g, ctx) {
      var rE = raio(g.frac), ms = mechas(RS - 5), T = ' transform="translate(230 230) rotate(' + f1(g.am) + ')"', cp = ctx.uid('trCk'), o = '';
      /* o trecho feito vai até a fita; a mecha que a soma corta fica cortada ali */
      var feito = '<clipPath id="' + cp + '"><rect x="' + f1(RS - 6) + '" y="-30" width="' + f1(rE - RS + 6) + '" height="60"/></clipPath>';
      var resto = ctx.uid('trCr');
      feito += '<clipPath id="' + resto + '"><rect x="' + f1(rE) + '" y="-30" width="' + f1(RB - rE + 20) + '" height="60"/></clipPath>';
      o += '<defs>' + feito + '</defs><g' + T + '>';
      /* linha de centro, traço-ponto */
      o += '<path d="M' + RA + ' 0H' + (RB + 3) + '" style="stroke:#e6f0ff" stroke-width=".45" stroke-dasharray="7 2 1.2 2" opacity=".35"/>';
      /* fantasma: o resto da trança em linha oculta (tracejada) */
      o += '<path class="ghost" d="' + ms.map(function (q) { return q.d; }).join('') + '" clip-path="url(#' + resto + ')" style="fill:none;stroke:#e6f0ff;stroke-opacity:.24" stroke-width=".7" stroke-dasharray="2.2 1.8"/>';
      o += '<g class="fill"><g clip-path="url(#' + cp + ')">';
      ms.forEach(function (q, k) {
        var hc = ctx.uid('trCh');
        /* papel por baixo da mecha (a mecha da frente esconde a de trás), hachura a lápis de cor e o contorno a tinta branca */
        o += '<clipPath id="' + hc + '"><path d="' + q.d + '"/></clipPath>' +
          '<path d="' + q.d + '" style="fill:#16457f"/>' +
          '<path d="' + [-0.78, -0.5, -0.22, 0.06, 0.34, 0.62].map(function (k) { return 'M' + f1(q.x0) + ' ' + f1(q.y0) + 'Q' + f1(q.mx + q.nx * q.t * k) + ' ' + f1(q.my + q.ny * q.t * k) + ' ' + f1(q.x1) + ' ' + f1(q.y1); }).join('') + '" clip-path="url(#' + hc + ')" style="fill:none;stroke:' + g.cor + '" stroke-width=".75" opacity=".95"/>' +
          '<path d="M' + f1(q.x0) + ' ' + f1(q.y0) + 'Q' + f1(q.mx - q.nx * q.t * 0.35) + ' ' + f1(q.my - q.ny * q.t * 0.35) + ' ' + f1(q.x1) + ' ' + f1(q.y1) + '" style="fill:none;stroke:#e6f0ff" stroke-width=".4" opacity=".6"/>' +
          '<path d="' + q.d + '" style="fill:none;stroke:#eef5ff" stroke-width="1.15" stroke-linejoin="round"/>';
      });
      o += '</g>';
      /* a fita no fim do trecho feito, também a traço */
      var laco = function (s) {
        return 'M' + f1(rE) + ' ' + f1(s * 2) + 'C' + f1(rE - 11) + ' ' + f1(s * 6) + ' ' + f1(rE - 10) + ' ' + f1(s * 17.5) + ' ' + f1(rE - 2.5) + ' ' + f1(s * 15.5) +
          'C' + f1(rE + 2.5) + ' ' + f1(s * 14) + ' ' + f1(rE + 2.5) + ' ' + f1(s * 6) + ' ' + f1(rE) + ' ' + f1(s * 2) + 'Z';
      };
      o += '<path d="' + laco(1) + laco(-1) + '" style="fill:#16457f;stroke:#eef5ff" stroke-width=".9" stroke-linejoin="round"/>' +
        '<path d="M' + f1(rE - 4) + ' ' + f1(5) + 'L' + f1(rE - 6) + ' ' + f1(13) + 'M' + f1(rE - 4) + ' ' + f1(-5) + 'L' + f1(rE - 6) + ' ' + f1(-13) + '" style="stroke:#eef5ff" stroke-width=".4" opacity=".7"/>' +
        '<rect x="' + f1(rE - 2.6) + '" y="' + f1(-H - 1) + '" width="5.2" height="' + f1(2 * H + 2) + '" style="fill:#16457f;stroke:#eef5ff" stroke-width=".9"/>' +
        '<rect x="' + f1(rE - 2.6) + '" y="' + f1(-H - 1) + '" width="5.2" height="' + f1(2 * H + 2) + '" style="fill:' + g.cor + '" opacity=".85"/>';
      /* a cota: traço de chamada além da fita e a seta que bate nele */
      o += '<path d="M' + f1(rE + 4.5) + ' -10V10" style="stroke:#eef5ff" stroke-width=".8"/>' +
        '<path d="M' + f1(rE + 4.5) + ' 0l-3.6 -1.6v3.2Z" style="fill:#eef5ff"/>';
      /* a braçadeira na raiz */
      o += '<rect x="' + f1(RS - 5) + '" y="' + f1(-H - 0.8) + '" width="6.5" height="' + f1(2 * H + 1.6) + '" style="fill:#16457f;stroke:#eef5ff" stroke-width=".9"/>' +
        '<path d="M' + f1(RS - 1.8) + ' ' + f1(-H - 0.8) + 'V' + f1(H + 0.8) + '" style="stroke:#eef5ff" stroke-width=".4"/>';
      return o + '</g></g>';
    },
    center: function (ctx) {
      var y = 189, o = '';
      o += '<circle cx="230" cy="230" r="57" fill="url(#' + I.disco + ')"/>' +
        '<circle cx="230" cy="230" r="57" style="fill:none;stroke:#eef5ff" stroke-width="1.3"/>' +
        '<circle cx="230" cy="230" r="53.5" style="fill:none;stroke:#eef5ff" stroke-width=".5" opacity=".6"/>';
      /* os óculos em vista de frente: a tira hachurada, os aros e as lentes, com as marcas de centro */
      var hz = '';
      for (var x = 172; x < 290; x += 2.4) hz += 'M' + f1(x) + ' ' + (y + 4) + 'L' + f1(x + 8) + ' ' + (y - 4);
      var cs = ctx.uid('trCs');
      o += '<clipPath id="' + cs + '"><path d="M178 ' + (y - 4) + 'H282V' + (y + 4) + 'H178Z"/></clipPath>' +
        '<path d="M178 ' + (y - 4) + 'H282V' + (y + 4) + 'H178Z" style="fill:#16457f;stroke:#eef5ff" stroke-width=".9"/>' +
        '<path d="' + hz + '" clip-path="url(#' + cs + ')" style="fill:none;stroke:#eef5ff" stroke-width=".4" opacity=".55"/>' +
        '<path d="M225 ' + (y - 1) + 'Q230 ' + (y - 5) + ' 235 ' + (y - 1) + '" style="fill:none;stroke:#eef5ff" stroke-width=".9"/>';
      [214, 246].forEach(function (cx) {
        o += '<circle cx="' + cx + '" cy="' + y + '" r="13" style="fill:#0f3463;stroke:#eef5ff" stroke-width="1.1"/>' +
          '<circle cx="' + cx + '" cy="' + y + '" r="10.4" style="fill:none;stroke:#eef5ff" stroke-width=".6"/>' +
          '<circle cx="' + cx + '" cy="' + y + '" r="9.2" style="fill:none;stroke:#eef5ff" stroke-width=".4" stroke-dasharray="1.2 1.2" opacity=".7"/>' +
          '<path d="M' + (cx - 16) + ' ' + y + 'H' + (cx + 16) + 'M' + cx + ' ' + (y - 16) + 'V' + (y + 16) + '" style="stroke:#eef5ff" stroke-width=".4" stroke-dasharray="4 1.5 1 1.5" opacity=".6"/>' +
          '<path d="M' + (cx - 6) + ' ' + (y - 5.5) + 'A8 8 0 0 1 ' + (cx + 2) + ' ' + (y - 8) + '" style="fill:none;stroke:#eef5ff" stroke-width=".6" opacity=".7"/>';
      });
      return o;
    }
  };
})();
