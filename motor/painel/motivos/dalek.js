/* Motivo "dalek" do gráfico de pontuação: 03. Master Of Evil, rebranding do lote 1, variação A (Saia em anel) escolhida pelo dono em 19/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "dalek"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Protótipo A, 03. Master Of Evil: a saia do Dalek vista de cima. Dez painéis de bronze envelhecido em anel, cada um
   com a coluna de quatro hemisférios da carcaça (como no Dalek de verdade, os de baixo maiores). A luz do critério sobe
   por dentro do painel, do pescoço para a borda, até o raio da soma: o que está abaixo da linha acende (hemisférios e
   frestas), o resto fica no metal frio. No centro, a cúpula vista de cima, com o ocular e as duas luzes da cúpula. */
var MOTIVO_PAINEL = (function () {
  var RA = 68, RB = 182;                       // a luz começa no pescoço (RA) e o painel cheio termina em RB
  var ROWS = [[80, 8.4], [102.1, 10.7], [129.4, 13.6], [163.1, 17.1]];   // [raio do centro, raio do hemisfério]
  var I = {};
  function f(n) { return (+n).toFixed(1); }
  function raio(fr) { return RA + (RB - RA) * Math.max(0.12, Math.min(1, fr)); }
  function setor(ctx, r1, r2, a0, a1) {
    var P = ctx.P;
    return 'M' + P(r1, a0) + 'A' + f(r1) + ' ' + f(r1) + ' 0 0 1 ' + P(r1, a1) + 'L' + P(r2, a1) + 'A' + f(r2) + ' ' + f(r2) + ' 0 0 0 ' + P(r2, a0) + 'Z';
  }
  function frestas(ctx, a0, a1) { var P = ctx.P; return 'M' + P(RA, a0 + 1.3) + 'L' + P(RB, a0 + 1.3) + 'M' + P(RA, a1 - 1.3) + 'L' + P(RB, a1 - 1.3); }
  function painel(ctx, g) {
    var a0 = g.a0, a1 = g.a1, o = '';
    var pan = setor(ctx, RA - 6, RB + 2, a0, a1);
    o += '<path d="' + pan + '" fill="url(#' + I.bronze + ')" filter="url(#' + ctx.k.textura + ')"/>' +
      '<path d="' + pan + '" fill="none" stroke="#c49a62" stroke-width=".9" opacity=".45"/>';
    o += '<path d="' + frestas(ctx, a0, a1) + '" fill="none" stroke="#0a0705" stroke-width="2.2" stroke-linecap="round"/>';
    for (var r = RA + 6; r < RB; r += 14) {
      [a0 + 3.2, a1 - 3.2].forEach(function (a) {
        var p = ctx.pol(r, a);
        o += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="1.25" fill="#9c7646"/><circle cx="' + f(p[0] - 0.35) + '" cy="' + f(p[1] - 0.4) + '" r=".45" fill="#f3dcb0" opacity=".6"/>';
      });
    }
    return o;
  }
  return {
    raio: raio,
    legenda: { peca: "painel", masc: true, texto: " da saia do Dalek é um critério: a luz sobe do pescoço para a borda até a soma, e acende os hemisférios que alcança." },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'dlk');
      I = { bronze: ctx.uid('dBz'), cupula: ctx.uid('dCp'), domo: ctx.uid('dDm'), saia: ctx.uid('dSa'), lente: ctx.uid('dLe'), sombra: ctx.uid('dSo'), aro: ctx.uid('dAr') };
      // painel: bronze que escurece para o pescoço e para a borda (o cone da saia visto de cima)
      o += '<radialGradient id="' + I.bronze + '" gradientUnits="userSpaceOnUse" cx="230" cy="230" r="190">' +
        '<stop offset=".3" stop-color="#1c140d"/><stop offset=".55" stop-color="#3b2a1a"/><stop offset=".8" stop-color="#573e25"/><stop offset=".93" stop-color="#3e2c1a"/><stop offset="1" stop-color="#231810"/></radialGradient>';
      // hemisfério apagado: metal com reflexo frio no alto à esquerda e pátina no pé
      o += '<radialGradient id="' + I.domo + '" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="#d9b98a"/><stop offset=".22" stop-color="#8f6a3e"/>' +
        '<stop offset=".62" stop-color="#4a3320"/><stop offset=".9" stop-color="#1e150d"/><stop offset="1" stop-color="#3b4a45"/></radialGradient>';
      o += '<radialGradient id="' + I.sombra + '"><stop offset=".6" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>';
      // fundo da saia (a sapata) e a cúpula
      o += '<radialGradient id="' + I.saia + '" gradientUnits="userSpaceOnUse" cx="230" cy="230" r="200"><stop offset=".85" stop-color="#120d09"/><stop offset=".95" stop-color="#3a2a1a"/><stop offset="1" stop-color="#0d0a07"/></radialGradient>';
      o += '<radialGradient id="' + I.cupula + '" gradientUnits="userSpaceOnUse" cx="214" cy="208" r="70"><stop offset="0" stop-color="#5e5a5c"/><stop offset=".45" stop-color="#2c2a2e"/><stop offset=".85" stop-color="#151418"/><stop offset="1" stop-color="#0b0a0d"/></radialGradient>';
      o += '<radialGradient id="' + I.lente + '" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#cfe8ff"/><stop offset=".7" stop-color="#3f8fe0"/><stop offset="1" stop-color="#0b2140"/></radialGradient>';
      o += '<linearGradient id="' + I.aro + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b48a55"/><stop offset=".5" stop-color="#5a3f24"/><stop offset="1" stop-color="#2a1d12"/></linearGradient>';
      return o;
    },
    stage: function (ctx) {
      var o = '<circle cx="230" cy="230" r="196" fill="url(#' + I.saia + ')"/>' +
        '<circle cx="230" cy="230" r="194" fill="none" stroke="#8a6638" stroke-width="1.2" opacity=".55"/>' +
        '<circle cx="230" cy="230" r="186" fill="none" stroke="#000" stroke-width="2" opacity=".6"/>';
      // rebites da sapata
      for (var k = 0; k < 60; k++) {
        var p = ctx.pol(190, k * 6 + 3);
        o += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="1.5" fill="#a9824f"/><circle cx="' + f(p[0] - 0.4) + '" cy="' + f(p[1] - 0.5) + '" r=".55" fill="#f1d9ad" opacity=".7"/>';
      }
      ctx.groups.forEach(function (g) { o += painel(ctx, g); });
      return o;
    },
    group: function (g, ctx) {
      var P = ctx.P, a0 = g.a0, a1 = g.a1, am = g.am, rl = raio(g.frac), clip = ctx.uid('dCl'), lg = ctx.uid('dLg');
      var o = '';
      var fr = frestas(ctx, a0, a1);
      o += '<path d="' + setor(ctx, RA - 6, RB + 2, a0, a1) + '" fill="#000" fill-opacity="0"/>';
      // os quatro hemisférios apagados (sombra, domo de metal, aro)
      ROWS.forEach(function (rw) {
        var c = ctx.pol(rw[0], am), h = rw[1];
        o += '<circle cx="' + f(c[0] + 1.5) + '" cy="' + f(c[1] + 2) + '" r="' + f(h * 1.18) + '" fill="url(#' + I.sombra + ')"/>' +
          '<circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + f(h + 1.4) + '" fill="url(#' + I.aro + ')"/>' +
          '<circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + f(h) + '" fill="url(#' + I.domo + ')"/>';
      });
      // a luz: tudo o que fica abaixo do raio da soma acende
      o += '<clipPath id="' + clip + '"><path d="' + setor(ctx, RA - 8, rl, a0 - 1, a1 + 1) + '"/></clipPath>' + ctx.kit.fundo(lg, g.cor);
      var acesa = '<path d="' + setor(ctx, RA - 6, RB + 2, a0, a1) + '" style="fill:' + g.rgba(.07) + '"/>' +
        '<path d="' + fr + '" style="fill:none;stroke:' + g.cor + '" stroke-width="4" opacity=".8" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<path d="' + fr + '" fill="none" stroke="#fff" stroke-width=".6" opacity=".85"/>';
      var domos = '';
      ROWS.forEach(function (rw) {
        var c = ctx.pol(rw[0], am), h = rw[1];
        acesa += '<circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + f(h * 1.7) + '" style="fill:' + g.cor + '" opacity=".75" filter="url(#' + ctx.k.brilho + ')"/>';
        domos += '<circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + f(h) + '" fill="url(#' + lg + ')"/>' +
          '<circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + f(h * 0.42) + '" fill="#fff" opacity=".55" filter="url(#' + ctx.k.brilho2 + ')"/>' +
          '<ellipse cx="' + f(c[0] - h * 0.32) + '" cy="' + f(c[1] - h * 0.36) + '" rx="' + f(h * 0.28) + '" ry="' + f(h * 0.17) + '" fill="#fff" opacity=".8" transform="rotate(-35 ' + f(c[0] - h * 0.32) + ' ' + f(c[1] - h * 0.36) + ')"/>';
      });
      o += '<g clip-path="url(#' + clip + ')"><g style="mix-blend-mode:screen">' + acesa + '</g>' + domos + '</g>';
      // a linha do nível, onde a luz para
      var nv = 'M' + P(rl, a0 + 0.6) + 'A' + f(rl) + ' ' + f(rl) + ' 0 0 1 ' + P(rl, a1 - 0.6);
      o += '<path d="' + nv + '" style="fill:none;stroke:' + g.cor + '" stroke-width="4" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<path d="' + nv + '" style="fill:none;stroke:' + g.cor + '" stroke-width="1.6"/><path d="' + nv + '" fill="none" stroke="#fff" stroke-width=".5" opacity=".8"/>';
      if (g.top) {
        var c4 = ctx.pol(ROWS[3][0], am);
        o += '<circle cx="' + f(c4[0]) + '" cy="' + f(c4[1]) + '" r="34" style="fill:' + g.cor + ';mix-blend-mode:screen" opacity=".35" filter="url(#' + ctx.k.brilho + ')"/>';
      }
      return o;
    },
    center: function (ctx) {
      var o = '';
      // pescoço: anel de grade com as aletas, depois o colar
      o += '<circle cx="230" cy="230" r="66" fill="#0e0b08" stroke="#6b4c2c" stroke-width="1.2"/>';
      for (var k = 0; k < 40; k++) {
        o += '<path d="M' + ctx.P(59, k * 9) + 'L' + ctx.P(65, k * 9) + '" stroke="#8a6638" stroke-width="2.2" opacity=".75"/>';
      }
      o += '<circle cx="230" cy="230" r="58" fill="url(#' + I.cupula + ')" stroke="#8d8a98" stroke-width="1.4"/>' +
        '<circle cx="230" cy="230" r="58" fill="url(#' + I.domo + ')" opacity=".08"/>' +
        '<circle cx="230" cy="230" r="49" fill="none" stroke="#000" stroke-width="1" opacity=".55"/>' +
        '<circle cx="230" cy="230" r="48" fill="none" stroke="#9a97a3" stroke-width=".6" opacity=".35"/>';
      // as duas luzes da cúpula (as "orelhas"), azuis
      [-148, -32].forEach(function (a) {
        var p = ctx.pol(48, a);
        o += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="11" fill="#8fc7ff" opacity=".5" filter="url(#' + ctx.k.brilho + ')"/>' +
          '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="5.6" fill="#2a2830" stroke="#c0bec9" stroke-width=".8"/>' +
          '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="4" fill="url(#' + I.lente + ')"/>';
      });
      // o ocular: haste com discos, apontando para o alto, e a lente azul
      o += '<path d="M230 212V176" stroke="#1a191d" stroke-width="5.5" stroke-linecap="round"/><path d="M230 212V176" stroke="#8d8a98" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>';
      [204, 196, 188].forEach(function (y) {
        o += '<ellipse cx="230" cy="' + y + '" rx="7" ry="2.2" fill="#3a3740" stroke="#c0bec9" stroke-width=".6"/>';
      });
      o += '<circle cx="230" cy="176" r="14" fill="#8fc7ff" opacity=".55" filter="url(#' + ctx.k.brilho + ')"/>' +
        '<circle cx="230" cy="176" r="8" fill="#141317" stroke="#c0bec9" stroke-width="1"/>' +
        '<circle cx="230" cy="176" r="5.6" fill="url(#' + I.lente + ')"/><circle cx="228.4" cy="174.3" r="1.6" fill="#fff"/>';
      // disco escuro para o placar
      o += '<ellipse cx="230" cy="244" rx="52" ry="26" fill="#0b0a0d" opacity=".55" filter="url(#' + ctx.k.brilho + ')"/>';
      return o;
    }
  };
})();
