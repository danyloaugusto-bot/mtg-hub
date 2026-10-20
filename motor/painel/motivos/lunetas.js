/* Motivo "lunetas" do gráfico de pontuação: 04. Zara, rebranding (lotes 3 e 4), variação R (Latão e couro) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "lunetas"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "lunetas" do gráfico de pontuação: 04. Zara (Tripulação Alheia). Rebranding, segunda rodada, variação R
   (realismo). Mesma composição de hoje: uma luneta de três tubos por critério, deitada no raio, a ocular perto do centro
   e a boca para fora; o comprimento é linear com a soma (mínimo de 12%) e o contorno tracejado é a luneta inteira.
   Refeito como objeto de verdade sobre o convés à noite: tubos de latão polido com o reflexo do céu, o corpo forrado de
   couro costurado, anéis de junta mais largos, a lente de vidro escuro com o reflexo curvo, a sombra no chão; o convés
   é de tábuas com veio, calafeto e pregos, e o aro é um cabo de cânhamo torcido de verdade. Sem cor de critério e sem
   brilho: o rótulo identifica. A mais cheia ganha só o reflexo da lua na lente. No centro, o monóculo da Zara sobre um
   disco de couro com aro de latão. */
var MOTIVO_PAINEL = (function () {
  var R0 = 68, LMAX = 98, I = {};
  function f1(n) { return (+n).toFixed(1); }
  function raio(f) { return R0 + LMAX * Math.max(0.12, Math.min(1, f)); }
  function largura(ctx) { return Math.min(24, 2 * (ctx.r0 + 8) * Math.sin((ctx.step / 2 - ctx.gap) * Math.PI / 180) * 0.85); }
  function juntas(L) { return [0, L * 0.28, L * 0.6, L]; }
  function silhueta(L, w) {
    var e = juntas(L), h = [w * 0.25, w * 0.37, w * 0.5];
    return 'M0 ' + f1(-h[0]) + 'H' + f1(e[1]) + 'V' + f1(-h[1]) + 'H' + f1(e[2]) + 'V' + f1(-h[2]) + 'H' + f1(e[3]) +
      'V' + f1(h[2]) + 'H' + f1(e[2]) + 'V' + f1(h[1]) + 'H' + f1(e[1]) + 'V' + f1(h[0]) + 'H0Z';
  }
  /* um tubo deitado: material (latão ou couro) e a sombra de cilindro por cima */
  function tubo(a, b, h, mat) {
    var r = '<rect x="' + f1(a) + '" y="' + f1(-h / 2) + '" width="' + f1(Math.max(0.5, b - a)) + '" height="' + f1(h) + '"';
    return r + ' style="fill:url(#' + (mat === 'couro' ? I.couro : I.latao) + ')"' + (mat === 'couro' ? ' filter="url(#' + I.grao + ')"' : '') + '/>' +
      (mat === 'couro' ? r + ' fill="url(#' + I.cil + ')"/>' : '') +
      r + ' style="fill:none;stroke:#1a1108" stroke-opacity=".7" stroke-width=".6"/>';
  }
  function anel(x, h, w) {
    w = w || 3.4;
    return '<rect x="' + f1(x - w / 2) + '" y="' + f1(-h / 2) + '" width="' + f1(w) + '" height="' + f1(h) + '" rx=".8" style="fill:url(#' + I.latao + ')" stroke="#1a1108" stroke-opacity=".8" stroke-width=".6"/>' +
      '<path d="M' + f1(x - w / 2 + 0.8) + ' ' + f1(-h / 2 + 0.6) + 'V' + f1(h / 2 - 0.6) + '" stroke="#1a1108" stroke-opacity=".35" stroke-width=".5"/>';
  }
  return {
    raio: raio,
    legenda: { peca: "luneta", masc: false, texto: " é um critério: estica em proporção à soma das notas, e a mais cheia pega o reflexo da lua na lente." },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'ln');
      I = { latao: ctx.uid('lnL'), couro: ctx.uid('lnC'), cil: ctx.uid('lnY'), lente: ctx.uid('lnV'), tabua: ctx.uid('lnT'), vinheta: ctx.uid('lnN'), corda: ctx.uid('lnK'), grao: ctx.uid('lnG'), sombra: ctx.uid('lnS'), disco: ctx.uid('lnD'), veio: ctx.uid('lnW'), clip: ctx.uid('lnX') };
      return o +
        /* latão polido: borda escura, o céu refletido numa faixa clara, o corpo dourado e o reflexo do convés embaixo */
        '<linearGradient id="' + I.latao + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a10"/><stop offset=".12" stop-color="#a88a4c"/><stop offset=".24" stop-color="#f4e2a8"/><stop offset=".34" stop-color="#c9a24a"/>' +
        '<stop offset=".62" stop-color="#7a5a22"/><stop offset=".82" stop-color="#4a3410"/><stop offset=".92" stop-color="#6e5228"/><stop offset="1" stop-color="#24180a"/></linearGradient>' +
        '<linearGradient id="' + I.couro + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a170c"/><stop offset=".25" stop-color="#6a4126"/><stop offset=".55" stop-color="#4a2a16"/><stop offset="1" stop-color="#1a0d06"/></linearGradient>' +
        '<linearGradient id="' + I.cil + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".22" stop-color="#ffe8cc" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>' +
        '<radialGradient id="' + I.lente + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#3a4a5a"/><stop offset=".5" stop-color="#121a24"/><stop offset="1" stop-color="#05070a"/></radialGradient>' +
        '<filter id="' + I.grao + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="6" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -1.4" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in" result="gi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge></filter>' +
        /* veio da madeira: ruído esticado na direção das tábuas */
        '<filter id="' + I.veio + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .55" numOctaves="3" seed="2" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .05  0 0 0 0 .03  0 0 0 0 .01  2.4 0 0 0 -1.05" result="v"/><feComposite in="v" in2="SourceGraphic" operator="in" result="vi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="vi"/></feMerge></filter>' +
        '<filter id="' + I.sombra + '" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
        '<radialGradient id="' + I.vinheta + '" cx="230" cy="230" r="' + (ctx.R + 12) + '" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#000" stop-opacity=".02"/><stop offset=".7" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>' +
        '<linearGradient id="' + I.corda + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8bd88"/><stop offset=".5" stop-color="#9a7a48"/><stop offset="1" stop-color="#4a3418"/></linearGradient>' +
        '<radialGradient id="' + I.disco + '" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#4a2c1a"/><stop offset=".6" stop-color="#2c180c"/><stop offset="1" stop-color="#160b05"/></radialGradient>' +
        '<clipPath id="' + I.clip + '"><circle cx="230" cy="230" r="' + (ctx.R + 11) + '"/></clipPath>';
    },
    stage: function (ctx) {
      var R = ctx.R, S = ctx.kit.sorte, o = '<g clip-path="url(#' + I.clip + ')">', y, k;
      /* tábuas do convés, de tons diferentes, com o calafeto escuro e os pregos nas emendas */
      S(5);
      var tons = ['#563a27', '#4a3221', '#5e412c', '#503724', '#452e1d'], cal = '', prego = '';
      for (y = 230 - R - 14, k = 0; y < 230 + R + 14; y += 17, k++) {
        var ex = 60 + S() * 120 + (k % 2) * 160;
        o += '<rect x="30" y="' + f1(y) + '" width="400" height="17" fill="' + tons[k % 5] + '"/>';
        cal += 'M30 ' + f1(y) + 'H430M' + f1(ex) + ' ' + f1(y) + 'v17M' + f1(ex + 210) + ' ' + f1(y) + 'v17';
        [ex, ex + 210].forEach(function (xx) { prego += '<circle cx="' + f1(xx - 4) + '" cy="' + f1(y + 5) + '" r=".9"/><circle cx="' + f1(xx - 4) + '" cy="' + f1(y + 12) + '" r=".9"/><circle cx="' + f1(xx + 4) + '" cy="' + f1(y + 5) + '" r=".9"/><circle cx="' + f1(xx + 4) + '" cy="' + f1(y + 12) + '" r=".9"/>'; });
      }
      o += '<rect x="30" y="30" width="400" height="400" fill="#3a2618" opacity=".55" filter="url(#' + I.veio + ')"/>' +
        '<path d="' + cal + '" style="fill:none;stroke:#0e0805" stroke-width="1.4"/>' +
        '<path d="' + cal + '" style="fill:none;stroke:#8a6a4a" stroke-opacity=".18" stroke-width=".5" transform="translate(0 1.2)"/>' +
        '<g fill="#14100c">' + prego + '</g>' +
        '<rect x="30" y="30" width="400" height="400" fill="url(#' + I.vinheta + ')"/></g>';
      /* o cabo de cânhamo torcido em volta do convés */
      var n = 150, cord = '';
      for (k = 0; k < n; k++) {
        var a = k * 360 / n, p = ctx.pol(R + 15, a);
        cord += '<ellipse cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" rx="4.4" ry="2.4" transform="rotate(' + f1(a + 90 + 50) + ' ' + f1(p[0]) + ' ' + f1(p[1]) + ')"/>';
      }
      o += '<circle cx="230" cy="230" r="' + (R + 15) + '" style="fill:none;stroke:#000" stroke-opacity=".6" stroke-width="9" filter="url(#' + I.sombra + ')"/>' +
        '<circle cx="230" cy="230" r="' + (R + 15) + '" style="fill:none;stroke:#3a2a14" stroke-width="7"/>' +
        '<g style="fill:url(#' + I.corda + ')" stroke="#2a1c0c" stroke-width=".4">' + cord + '</g>';
      return o;
    },
    group: function (g, ctx) {
      var K = ctx.kit, w = largura(ctx), L = LMAX * K.comp(g.frac), e = juntas(L), p = K.pt(g.am, R0, 0), lua = g.frac >= 0.94;
      var hs = [w * 0.5, w * 0.74, w], x1 = L;
      /* a sombra cai para baixo na tela: deslocamento fixo girado para o sistema da luneta */
      var t = -g.am * Math.PI / 180, sx = 2.5 * Math.sin(-t) + 1 * Math.cos(t), sy = 2.5 * Math.cos(t) - 1 * Math.sin(-t);
      var o = '<g transform="translate(' + f1(p[0]) + ' ' + f1(p[1]) + ') rotate(' + f1(g.am) + ')">' +
        '<path class="ghost" d="' + silhueta(LMAX, w) + '" style="fill:none;stroke:#e8cf8a" stroke-opacity=".22" stroke-width="1" stroke-dasharray="3 3"/>' +
        '<path d="' + silhueta(L, w + 1) + '" fill="#000" opacity=".7" filter="url(#' + I.sombra + ')" transform="translate(' + f1(sx) + ' ' + f1(sy) + ')"/>' +
        '<g class="fill">' +
        tubo(0, e[1], hs[0], 'latao') + tubo(e[1], e[2], hs[1], 'latao') + tubo(e[2], x1, hs[2], 'couro');
      /* costura do couro ao longo do corpo */
      if (x1 - e[2] > 8) o += '<path d="M' + f1(e[2] + 3) + ' ' + f1(hs[2] * 0.18) + 'H' + f1(x1 - 4) + '" stroke="#c8a878" stroke-opacity=".55" stroke-width=".7" stroke-dasharray="1.6 1.4"/>';
      /* tampa da ocular e os anéis */
      o += '<rect x="-3.4" y="' + f1(-hs[0] / 2 - 0.6) + '" width="4" height="' + f1(hs[0] + 1.2) + '" rx="1" style="fill:url(#' + I.latao + ')" stroke="#1a1108" stroke-width=".6"/>' +
        '<ellipse cx="-3.4" cy="0" rx=".9" ry="' + f1(hs[0] * 0.28) + '" fill="#050403"/>' +
        anel(e[1], hs[1] + 1.6) + anel(e[2], hs[2] + 1.6) + anel(x1 - 2.4, hs[2] + 3.2, 4.8);
      /* a lente: vidro escuro na boca, com o reflexo curvo do céu */
      o += '<ellipse cx="' + f1(x1 + 0.4) + '" cy="0" rx="2.2" ry="' + f1(w / 2 + 0.6) + '" style="fill:url(#' + I.lente + ')" stroke="#2a1c0a" stroke-width=".7"/>' +
        '<path d="M' + f1(x1 + 0.9) + ' ' + f1(-w / 2 + 2.5) + 'q1.4 ' + f1(w * 0.18) + ' .6 ' + f1(w * 0.36) + '" fill="none" stroke="#c8d8e8" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round"/>';
      if (lua) o += '<circle cx="' + f1(x1 + 1.1) + '" cy="' + f1(-w * 0.2) + '" r="1.5" fill="#f4f8ff" opacity=".9"/><circle cx="' + f1(x1 + 1.1) + '" cy="' + f1(-w * 0.2) + '" r="3.2" fill="#f4f8ff" opacity=".18"/>';
      return o + '</g></g>';
    },
    center: function (ctx) {
      var y = 190;
      /* disco de couro com aro de latão; o monóculo da Zara no alto, com a corrente */
      return '<circle cx="231.5" cy="233" r="58" fill="#000" opacity=".6" filter="url(#' + I.sombra + ')"/>' +
        '<circle cx="230" cy="230" r="58" style="fill:url(#' + I.latao + ')"/>' +
        '<circle cx="230" cy="230" r="54" style="fill:url(#' + I.disco + ')" filter="url(#' + I.grao + ')"/>' +
        '<circle cx="230" cy="230" r="50" style="fill:none;stroke:#c8a878" stroke-opacity=".35" stroke-width=".7" stroke-dasharray="1.8 1.6"/>' +
        '<path d="M238.5 ' + (y + 2) + 'q10 7 6 17" style="fill:none;stroke:#b8954a" stroke-width="1.4" stroke-dasharray="1.6 1.2" stroke-linecap="round"/>' +
        '<circle cx="230" cy="' + y + '" r="8.6" style="fill:url(#' + I.lente + ')"/>' +
        '<circle cx="230" cy="' + y + '" r="8.6" style="fill:none;stroke:url(#' + I.latao + ')" stroke-width="2.6"/>' +
        '<path d="M225 ' + (y - 3) + 'a6 6 0 0 1 5 -3.4" style="fill:none;stroke:#c8d8e8" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"/>';
    }
  };
})();
