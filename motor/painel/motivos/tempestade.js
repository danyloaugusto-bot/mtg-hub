/* Motivo "tempestade" do gráfico de pontuação: 05. Storm, rebranding do lote 1, variação A (Tempestade) escolhida pelo dono em 19/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "tempestade"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Storm, variação A: porte fiel de prototipos/tempestade.js para a API dos motivos e o kit de luz.
   Relâmpago com brilho largo, corpo na cor do critério, ramificações, núcleo branco e reflexo; a ponta acende e, no mais
   alto, o céu em volta também. Olho da tempestade no centro e anel de nuvem na borda. Regra C: o relâmpago vai de R0 até
   raio(g.frac), linear com mínimo de 12%. Zigue-zague por ctx.kit.sorte (semente fixa por deck). */
var MOTIVO_PAINEL = (function () {
  var R0 = 66, RMAX = 178;
  function raio(f) { return R0 + (RMAX - R0) * Math.max(0.12, Math.min(1, f)); }
  /* passeio ao longo da direção, com quebras irregulares que voltam para a linha do meio */
  function zigue(K, a, r1, jit, sd) {
    K.sorte(sd); var pts = [K.pt(a, R0, 0)], r = R0, off = 0, L = r1 - R0, sorte = function () { return K.sorte(); };
    while (r < r1 - 1) {
      r = Math.min(r1, r + Math.max(6, L * (0.09 + sorte() * 0.16)));
      off = off * 0.35 + (sorte() - 0.5) * 2 * jit * (sorte() < 0.3 ? 1.7 : 1);
      if (r >= r1) off = 0;
      pts.push(K.pt(a, r, off));
    }
    return pts;
  }
  function ramo(K, pts, k, a, len, dir, sd) {
    K.sorte(sd); k = Math.min(k, pts.length - 2); var p = pts[k], q = [p], ang = a + dir * (24 + K.sorte() * 14), t = ang * Math.PI / 180, x = p[0], y = p[1];
    for (var s = 1; s <= 3; s++) { x += Math.cos(t) * len / 3 + (K.sorte() - 0.5) * 6; y += Math.sin(t) * len / 3 + (K.sorte() - 0.5) * 6; q.push([x, y]); }
    return q;
  }
  var ids;
  return {
    raio: raio,
    legenda: { peca: "relâmpago", masc: true, texto: " é um critério: o relâmpago vai até a soma, e o mais alto acende o céu." },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'tp');
      ids = { nuvem: ctx.uid('tpN'), olho: ctx.uid('tpO'), gl: ctx.uid('tpG'), gl2: ctx.uid('tpH') };
      /* brilho próprio em coordenadas da tela: o do kit (região de -50% a 200% da caixa) corta o relâmpago reto em retângulo */
      var reg = ' filterUnits="userSpaceOnUse" x="-58" y="-2" width="576" height="464"';
      return o + '<filter id="' + ids.gl + '"' + reg + '><feGaussianBlur stdDeviation="5"/></filter><filter id="' + ids.gl2 + '"' + reg + '><feGaussianBlur stdDeviation="2"/></filter>' +
        '<filter id="' + ids.nuvem + '" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".018 .03" numOctaves="4" seed="3" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .62  0 0 0 0 .70  0 0 0 0 .82  0 0 0 1.6 -.55"/><feComposite in2="SourceGraphic" operator="in"/></filter>' +
        '<radialGradient id="' + ids.olho + '" cx="230" cy="230" r="62" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#05080c"/><stop offset=".7" stop-color="#0b111a"/><stop offset="1" stop-color="#1c2737"/></radialGradient>';
    },
    stage: function (ctx) {
      return '<circle cx="230" cy="230" r="' + (ctx.R + 4) + '" style="fill:rgba(var(--deep-rgb),.35)"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 4) + '" fill="none" stroke="#9fb3cc" stroke-width="20" filter="url(#' + ids.nuvem + ')" opacity=".42"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 4) + '" fill="none" stroke="rgba(207,224,242,.18)" stroke-width="1"/>';
    },
    group: function (g, ctx) {
      var K = ctx.kit, a = g.am, fr = Math.max(0.12, Math.min(1, g.frac)), r1 = raio(g.frac), sd = 100 + g.i * 17;
      /* o zigue-zague acompanha o comprimento: relâmpago curto não vira rabisco */
      var full = zigue(K, a, RMAX, 13, sd), real = zigue(K, a, r1, Math.min(13, (r1 - R0) * 0.16), sd);
      var o = '<path d="' + K.d(full) + '" fill="none" stroke="rgba(207,224,242,.22)" stroke-width="1" stroke-dasharray="3 4" stroke-linejoin="round"/>';
      var br = '', b1 = ramo(K, real, 4, a, (r1 - R0) * 0.32, 1, 300 + g.i), b2 = ramo(K, real, 6, a, (r1 - R0) * 0.24, -1, 400 + g.i);
      if (r1 - R0 > 30) br += '<path d="' + K.d(b1) + '" style="fill:none;stroke:' + g.rgba(.9) + '" stroke-width="1.6" stroke-linejoin="round"/><path d="' + K.d(b1) + '" fill="none" stroke="#fff" stroke-width=".6" opacity=".8"/>';
      if (fr > 0.55) br += '<path d="' + K.d(b2) + '" style="fill:none;stroke:' + g.rgba(.85) + '" stroke-width="1.3" stroke-linejoin="round"/><path d="' + K.d(b2) + '" fill="none" stroke="#fff" stroke-width=".5" opacity=".7"/>';
      /* o mais alto acende o céu (como no protótipo: o maior da lista, mesmo sem chegar ao teto da régua) */
      var top = g.frac >= Math.max.apply(null, ctx.groups.map(function (x) { return x.frac; }));
      var tip = real[real.length - 1], tx = K.f(tip[0]), ty = K.f(tip[1]);
      o += '<g style="mix-blend-mode:screen">' +
        '<path d="' + K.d(real) + '" style="fill:none;stroke:' + g.rgba(.95) + '" stroke-width="18" stroke-linejoin="round" stroke-linecap="round" filter="url(#' + ids.gl + ')" opacity=".8"/>' +
        '<path d="' + K.corpo(real, 5.6) + '" style="fill:' + g.cor + '" filter="url(#' + ctx.k.textura + ')"/>' + br +
        '<path d="' + K.corpo(real, 1.5) + '" fill="#fff" opacity=".95"/>' +
        '<path d="' + K.d(real) + '" fill="none" stroke="#fff" stroke-width="3" opacity=".35" filter="url(#' + ids.gl2 + ')"/>' +
        (top ? '<circle cx="' + tx + '" cy="' + ty + '" r="30" style="fill:' + g.rgba(.35) + '" filter="url(#' + ids.gl + ')"/>' : '') +
        '<circle cx="' + tx + '" cy="' + ty + '" r="' + (top ? 9 : 5) + '" style="fill:' + g.rgba(.9) + '" filter="url(#' + ids.gl2 + ')"/>' +
        '<circle cx="' + tx + '" cy="' + ty + '" r="' + (top ? 3 : 1.6) + '" fill="#fff"/></g>';
      return o;
    },
    center: function (ctx) {
      return '<circle cx="230" cy="230" r="62" fill="url(#' + ids.olho + ')"/>' +
        '<circle cx="230" cy="230" r="62" fill="#9fb3cc" filter="url(#' + ids.nuvem + ')" opacity=".35"/>' +
        '<circle cx="230" cy="230" r="62" fill="none" stroke="rgba(242,248,255,.55)" stroke-width="1.4"/>' +
        '<circle cx="230" cy="230" r="67" fill="none" stroke="rgba(242,248,255,.18)" stroke-width="6" filter="url(#' + ids.gl2 + ')"/>';
    }
  };
})();
