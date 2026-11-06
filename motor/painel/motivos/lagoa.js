/* Gráfico da Helga (Lagoa de Titãs, deck avulso), escolhido pelo dono em 05/11/2026: fios d'água. O redemoinho das duas
   artes da Helga: cada critério é um fio de água que sai da esfera central em curva e termina numa bolha tingida. O
   comprimento do fio é linear no critério (mínimo de 12%); o tracejado mostra o fio inteiro. Kit de luz: brilho do kit,
   bainha clara, corpo na cor do critério, núcleo branco, textura e a bolha com volume. */
var MOTIVO_PAINEL = (function () {
  var R0 = 66, RMAX = 170, ids;
  function raio(f) { return R0 + (RMAX - R0) * Math.max(0.12, Math.min(1, f)); }
  function fio(K, a, r1, sd) {
    var pts = [], n = 22, L = r1 - R0, amp = Math.min(12, L * 0.14);
    for (var k = 0; k <= n; k++) {
      var t = k / n;
      pts.push(K.pt(a + 34 * t * t * (L / (RMAX - R0)), R0 + L * t, amp * Math.sin(t * Math.PI * 1.15)));
    }
    return pts;
  }
  return {
    legenda: { peca: "fio d'água", masc: true, texto: " é um critério: o fio vai até o valor do critério e termina numa bolha; o mais longo brilha." },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'fa');
      ids = { agua: ctx.uid('faA'), orbe: ctx.uid('faO') };
      return o + '<radialGradient id="' + ids.agua + '" cx="230" cy="230" r="200" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#eef5ef"/><stop offset=".6" stop-color="#d3e5e0"/><stop offset="1" stop-color="#a9c8c6"/></radialGradient>' +
        '<radialGradient id="' + ids.orbe + '" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#d7ece9"/><stop offset="1" stop-color="#7fb0b7"/></radialGradient>';
    },
    stage: function (ctx) {
      var o = '<circle cx="230" cy="230" r="' + (ctx.R + 6) + '" style="fill:url(#' + ids.agua + ')"/>';
      // redemoinho de fundo: espirais claras
      for (var k = 0; k < 3; k++) {
        var pts = [];
        for (var t = 0; t <= 1.001; t += 0.05) pts.push(ctx.kit.pt(k * 120 + t * 300, 70 + t * 110, 0));
        o += '<path d="' + ctx.kit.d(pts) + '" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="' + (3 - k * 0.6) + '" stroke-linecap="round" opacity=".5"/>';
      }
      return o + '<circle cx="230" cy="230" r="' + (ctx.R + 6) + '" fill="none" stroke="rgba(156,116,20,.55)" stroke-width="2"/>';
    },
    group: function (g, ctx) {
      var K = ctx.kit, fr = Math.max(0.12, Math.min(1, g.frac)), r1 = raio(g.frac), sd = 200 + g.i * 11;
      var cheio = fio(K, g.am, RMAX, sd), real = fio(K, g.am, r1, sd), tip = real[real.length - 1], br = 5 + 7 * fr;
      var top = g.frac >= Math.max.apply(null, ctx.groups.map(function (x) { return x.frac; }));
      var o = '<path d="' + K.d(cheio) + '" fill="none" stroke="rgba(38,60,70,.22)" stroke-width="1.1" stroke-dasharray="3 4"/>';
      o += '<path d="' + K.d(real) + '" fill="none" style="stroke:' + g.rgba(top ? .9 : .55) + '" stroke-width="' + (top ? 16 : 11) + '" stroke-linecap="round" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<path d="' + K.corpo(real, 7, 2.2) + '" fill="rgba(255,255,255,.55)"/>' +
        '<path d="' + K.corpo(real, 5.6, 1.6) + '" style="fill:' + g.cor + '" filter="url(#' + ctx.k.textura + ')" opacity=".88"/>' +
        '<path d="' + K.corpo(real, 1.5, 0.4) + '" fill="#fff" opacity=".85"/>';
      // respingos ao longo do fio
      K.sorte(sd + 5);
      for (var s = 0; s < 3; s++) {
        var p = real[Math.min(real.length - 2, 4 + Math.floor(K.sorte() * (real.length - 6)))], dx = (K.sorte() - 0.5) * 18, dy = (K.sorte() - 0.5) * 18;
        o += '<circle cx="' + K.f(p[0] + dx) + '" cy="' + K.f(p[1] + dy) + '" r="' + K.f(1.2 + K.sorte() * 1.6) + '" style="fill:' + g.rgba(.8) + '" stroke="#fff" stroke-width=".5"/>';
      }
      // bolha na ponta, tingida pelo critério
      var bid = ctx.uid('faB');
      o += K.fundo(bid, g.cor, tip[0] - br * 0.4, tip[1] - br * 0.45, br * 1.6) +
        '<circle cx="' + K.f(tip[0]) + '" cy="' + K.f(tip[1]) + '" r="' + K.f(br) + '" style="fill:url(#' + bid + ')" stroke="rgba(255,255,255,.85)" stroke-width="1.2"/>' +
        '<ellipse cx="' + K.f(tip[0] - br * 0.35) + '" cy="' + K.f(tip[1] - br * 0.4) + '" rx="' + K.f(br * 0.32) + '" ry="' + K.f(br * 0.2) + '" fill="#fff" opacity=".9"/>';
      return o;
    },
    center: function (ctx) {
      var r = ctx.r0 - 6;
      return '<circle cx="230" cy="230" r="' + (r + 6) + '" fill="none" stroke="rgba(63,111,142,.45)" stroke-width="2" stroke-dasharray="60 20 30 16" stroke-linecap="round"/>' +
        '<circle cx="230" cy="230" r="' + r + '" style="fill:url(#' + ids.orbe + ')" stroke="rgba(255,255,255,.85)" stroke-width="1.6"/>' +
        '<path d="M' + (230 - r * 0.62) + ' ' + (230 - r * 0.2) + 'A' + (r * 0.7) + ' ' + (r * 0.7) + ' 0 0 1 ' + (230 - r * 0.05) + ' ' + (230 - r * 0.68) + '" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" opacity=".75"/>';
    }
  };
})();
