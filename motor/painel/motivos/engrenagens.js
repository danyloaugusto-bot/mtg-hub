/* Motivo "engrenagens" do gráfico de pontuação: 03. K'rrik, rebranding (lotes 3 e 4), variação R (Aço e sangue) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "engrenagens"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "engrenagens" do gráfico de pontuação: 03. K'rrik (Dívida & Herança). Rebranding, segunda rodada, variação R
   (realismo). Mesma composição de hoje: dez engrenagens no mesmo lugar e com a mesma rotação alternada, e a medida é a
   contagem de dentes (um dente por décimo da soma, mínimo de um). Refeito como peça usinada fotografada com luz do alto à
   esquerda: aço com o brilho escovado em anéis, chanfro claro e escuro nas bordas, cinco furos de alívio, o cubo com a
   porca sextavada, e a sombra da peça sobre a chapa de ferro rebitada. Os dentes que contam estão banhados de sangue
   (vida como mana): vermelho escuro e espesso, com o reflexo molhado e a gota que escorre para baixo. Sem cor de
   critério, sem brilho: o rótulo identifica. A mais cheia (94% ou mais) tem o cubo afogado em óleo phyrexiano, preto e
   furta-cor. O medalhão do centro leva o símbolo da mana phyrexiana cinzelado no ferro e cheio de sangue.
   Sem raio(): a medida é a contagem de dentes, não um comprimento (como hoje). */
var MOTIVO_PAINEL = (function () {
  function F(n) { return (+n).toFixed(1); }
  var I;
  function corpoEng(cx, cy, gR, rin, rot) {
    var d = '', k, P = function (r, a) { return F(cx + r * Math.cos(a)) + ' ' + F(cy + r * Math.sin(a)); };
    for (k = 0; k < 10; k++) {
      var t = (rot + k * 36) * Math.PI / 180, tn = (rot + (k + 1) * 36) * Math.PI / 180;
      d += (k ? 'L' : 'M') + P(rin, t - 0.19) + 'L' + P(gR, t - 0.11) + 'L' + P(gR, t + 0.11) + 'L' + P(rin, t + 0.19) +
        'A' + F(rin) + ' ' + F(rin) + ' 0 0 1 ' + P(rin, tn - 0.19);
    }
    return d + 'Z';
  }
  function dente(cx, cy, r1, r2, t, w1, w2) {
    var P = function (r, a) { return F(cx + r * Math.cos(a)) + ' ' + F(cy + r * Math.sin(a)); };
    return 'M' + P(r1, t - w1) + 'L' + P(r2, t - w2) + 'L' + P(r2, t + w2) + 'L' + P(r1, t + w1) + 'Z';
  }
  function circ(cx, cy, r) { return 'M' + F(cx + r) + ' ' + F(cy) + 'A' + F(r) + ' ' + F(r) + ' 0 1 0 ' + F(cx - r) + ' ' + F(cy) + 'A' + F(r) + ' ' + F(r) + ' 0 1 0 ' + F(cx + r) + ' ' + F(cy) + 'Z'; }
  return {
    legenda: { peca: "engrenagem", masc: false, texto: " é um critério: os dentes banhados de sangue contam a soma, um por décimo, e a mais cheia tem o cubo no óleo phyrexiano." },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'en');
      I = { aco: ctx.uid('enA'), chanfro: ctx.uid('enF'), cubo: ctx.uid('enC'), chapa: ctx.uid('enP'), sombra: ctx.uid('enS'), sangue: ctx.uid('enG'), rebite: ctx.uid('enR'), oleo: ctx.uid('enO'), furo: ctx.uid('enH'), med: ctx.uid('enM'), ferro: ctx.uid('enI') };
      return o +
        /* aço: claro no alto à esquerda, frio no meio, escuro embaixo */
        '<linearGradient id="' + I.aco + '" x1=".15" y1=".05" x2=".85" y2=".95"><stop offset="0" stop-color="#a7aeb2"/><stop offset=".25" stop-color="#6c7479"/><stop offset=".55" stop-color="#40474c"/><stop offset=".8" stop-color="#2c3236"/><stop offset="1" stop-color="#16191b"/></linearGradient>' +
        /* chanfro da borda: fio claro onde a luz bate, escuro do outro lado */
        '<linearGradient id="' + I.chanfro + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8ecee" stop-opacity=".85"/><stop offset=".45" stop-color="#8a9296" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></linearGradient>' +
        '<radialGradient id="' + I.cubo + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#d4d9dc"/><stop offset=".4" stop-color="#7a8287"/><stop offset="1" stop-color="#1f2427"/></radialGradient>' +
        '<radialGradient id="' + I.furo + '" cx=".62" cy=".66" r=".7"><stop offset="0" stop-color="#16191b"/><stop offset=".7" stop-color="#0b0d0e"/><stop offset="1" stop-color="#000"/></radialGradient>' +
        '<filter id="' + I.sombra + '" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.6"/></filter>' +
        /* sangue: escuro na raiz, vermelho vivo e espesso na ponta */
        '<radialGradient id="' + I.sangue + '" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#a51a22"/><stop offset=".4" stop-color="#6e0a12"/><stop offset="1" stop-color="#2c0205"/></radialGradient>' +
        '<radialGradient id="' + I.rebite + '" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#9aa0a4"/><stop offset=".5" stop-color="#4a5054"/><stop offset="1" stop-color="#14171a"/></radialGradient>' +
        /* óleo phyrexiano: preto, com o reflexo furta-cor de película */
        '<linearGradient id="' + I.oleo + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#05070a"/><stop offset=".3" stop-color="#140c22"/><stop offset=".42" stop-color="#0a2426"/><stop offset=".52" stop-color="#1c240a"/><stop offset=".62" stop-color="#06080a"/><stop offset="1" stop-color="#020304"/></linearGradient>' +
        '<radialGradient id="' + I.chapa + '" cx="230" cy="200" r="' + (ctx.R + 30) + '" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2a2e31"/><stop offset=".7" stop-color="#1a1d1f"/><stop offset="1" stop-color="#0e1011"/></radialGradient>' +
        '<radialGradient id="' + I.med + '" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#4a5054"/><stop offset=".55" stop-color="#2a2f32"/><stop offset="1" stop-color="#111416"/></radialGradient>' +
        '<linearGradient id="' + I.ferro + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d9498"/><stop offset=".5" stop-color="#3b4145"/><stop offset="1" stop-color="#121517"/></linearGradient>';
    },
    stage: function (ctx) {
      /* chapa de ferro escurecida, com riscos de uso, o aro de ferro e a fila de rebites abaulados */
      var R = ctx.R, S = ctx.kit.sorte, o = '<circle cx="230" cy="230" r="' + (R + 18) + '" style="fill:url(#' + I.ferro + ')"/>' +
        '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:url(#' + I.chapa + ')"/>' +
        '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:#1a1d1f" filter="url(#' + ctx.k.textura + ')" opacity=".9"/>' +
        '<circle cx="230" cy="230" r="' + (R + 10) + '" style="fill:none;stroke:#000" stroke-opacity=".7" stroke-width="2"/>' +
        '<circle cx="230" cy="230" r="' + (R + 18) + '" style="fill:none;stroke:#000" stroke-opacity=".6" stroke-width="1"/>';
      S(7);
      var risco = '';
      for (var k = 0; k < 26; k++) {
        var a = S() * 360, r = 30 + S() * (R - 30), p = ctx.pol(r, a), L = 6 + S() * 18, t = S() * Math.PI;
        risco += 'M' + F(p[0]) + ' ' + F(p[1]) + 'l' + F(L * Math.cos(t)) + ' ' + F(L * Math.sin(t));
      }
      o += '<path d="' + risco + '" style="fill:none;stroke:#9aa2a6" stroke-opacity=".12" stroke-width=".6"/>';
      var n = Math.round(2 * Math.PI * (R + 14) / 14);
      for (k = 0; k < n; k++) {
        var q = ctx.pol(R + 14, k * 360 / n);
        o += '<circle cx="' + F(q[0] + 0.6) + '" cy="' + F(q[1] + 0.8) + '" r="2.3" fill="#000" opacity=".55"/><circle cx="' + F(q[0]) + '" cy="' + F(q[1]) + '" r="2.1" style="fill:url(#' + I.rebite + ')"/>';
      }
      return o;
    },
    group: function (g, ctx) {
      var r0 = ctx.r0, R = ctx.R, step = ctx.step, gap = ctx.gap, S = ctx.kit.sorte;
      var lit = g.frac > 0 ? Math.max(1, Math.min(10, Math.round(10 * g.frac))) : 1, grc = r0 + (R - r0) * 0.55,
        gR = Math.min((R - r0) * 0.42, grc * Math.sin((step / 2 - gap) * Math.PI / 180) * 0.95), p = ctx.pol(grc, g.am),
        cx = p[0], cy = p[1], rot = g.am + (g.i % 2 ? 18 : 0), rin = gR * 0.8, k, o = '', body = corpoEng(cx, cy, gR, rin, rot);
      var furos = '';
      for (k = 0; k < 5; k++) { var u = (rot + 18 + k * 72) * Math.PI / 180; furos += circ(cx + gR * 0.47 * Math.cos(u), cy + gR * 0.47 * Math.sin(u), gR * 0.13); }
      /* a sombra da peça na chapa */
      o += '<path d="' + body + '" fill="#000" opacity=".75" filter="url(#' + I.sombra + ')" transform="translate(2.2 3)"/>';
      /* o aço, com os furos de alívio vazados */
      o += '<path class="fill" d="' + body + furos + '" fill-rule="evenodd" style="fill:url(#' + I.aco + ')"/>';
      /* brilho escovado: anéis concêntricos do torno */
      var esc = '';
      for (var rr = gR * 0.3; rr < rin - 1.5; rr += 1.3) esc += '<circle cx="' + F(cx) + '" cy="' + F(cy) + '" r="' + F(rr) + '" stroke="' + (Math.round(rr * 7) % 3 ? '#fff' : '#000') + '" stroke-opacity="' + (Math.round(rr * 7) % 3 ? '.05' : '.09') + '"/>';
      o += '<g fill="none" stroke-width=".6" pointer-events="none">' + esc + '</g>';
      /* os furos: parede interna com a luz pegando o lado de baixo */
      o += '<path d="' + furos + '" style="fill:url(#' + I.furo + ')"/>' +
        '<path d="' + furos + '" style="fill:none;stroke:#c9cfd2" stroke-opacity=".35" stroke-width=".7" transform="translate(.5 .7)"/>';
      /* sangue nos dentes que contam: a camada espessa cobre o dente e escorre pelo aro entre eles */
      var sg = '', brilho = '', gotas = '';
      for (k = 0; k < lit; k++) {
        var tk = (rot + k * 36) * Math.PI / 180;
        sg += dente(cx, cy, rin - 2.6, gR + 0.6, tk, 0.24, 0.13);
        brilho += dente(cx, cy, gR * 0.86, gR - 0.4, tk - 0.05, 0.025, 0.02);
        if (Math.sin(tk) > 0.35) {
          var tx = cx + (gR + 0.4) * Math.cos(tk), ty = cy + (gR + 0.4) * Math.sin(tk), Lg = 2.6 + (k % 3) * 1.4;
          gotas += 'M' + F(tx - 1.1) + ' ' + F(ty) + 'Q' + F(tx - 1.3) + ' ' + F(ty + Lg) + ' ' + F(tx) + ' ' + F(ty + Lg + 1.6) + 'Q' + F(tx + 1.3) + ' ' + F(ty + Lg) + ' ' + F(tx + 1.1) + ' ' + F(ty) + 'Z';
        }
      }
      if (lit > 1) {
        var a0 = (rot - 14) * Math.PI / 180, a1 = (rot + (lit - 1) * 36 + 14) * Math.PI / 180, rb = rin - 0.6, ri = rin - 3.4, big = (a1 - a0) > Math.PI ? 1 : 0;
        sg += 'M' + F(cx + rb * Math.cos(a0)) + ' ' + F(cy + rb * Math.sin(a0)) + 'A' + F(rb) + ' ' + F(rb) + ' 0 ' + big + ' 1 ' + F(cx + rb * Math.cos(a1)) + ' ' + F(cy + rb * Math.sin(a1)) +
          'L' + F(cx + ri * Math.cos(a1)) + ' ' + F(cy + ri * Math.sin(a1)) + 'A' + F(ri) + ' ' + F(ri) + ' 0 ' + big + ' 0 ' + F(cx + ri * Math.cos(a0)) + ' ' + F(cy + ri * Math.sin(a0)) + 'Z';
      }
      o += '<g pointer-events="none"><path d="' + sg + gotas + '" style="fill:url(#' + I.sangue + ')" stroke="#2a0306" stroke-width=".5" stroke-linejoin="round"/>' +
        '<path d="' + brilho + '" fill="#ffd9d6" opacity=".42"/></g>';
      /* chanfro da borda inteira por cima de tudo */
      o += '<path d="' + body + '" style="fill:none;stroke:url(#' + I.chanfro + ')" stroke-width="1" stroke-linejoin="round" pointer-events="none"/>';
      /* o cubo: ressalto torneado, a porca sextavada e o eixo */
      var hx = '', hr = gR * 0.19;
      for (k = 0; k < 6; k++) { var ha = (rot + k * 60) * Math.PI / 180; hx += (k ? 'L' : 'M') + F(cx + hr * Math.cos(ha)) + ' ' + F(cy + hr * Math.sin(ha)); }
      o += '<circle cx="' + F(cx + 0.8) + '" cy="' + F(cy + 1.2) + '" r="' + F(gR * 0.29) + '" fill="#000" opacity=".5"/>' +
        '<circle cx="' + F(cx) + '" cy="' + F(cy) + '" r="' + F(gR * 0.29) + '" style="fill:url(#' + I.cubo + ')"/>' +
        '<circle cx="' + F(cx) + '" cy="' + F(cy) + '" r="' + F(gR * 0.29) + '" style="fill:none;stroke:url(#' + I.chanfro + ')" stroke-width=".8"/>';
      if (g.frac >= 0.94) {
        /* óleo phyrexiano afogando o cubo, escorrendo por um dos furos */
        var ox = cx, oy = cy;
        o += '<path d="M' + F(ox - gR * 0.34) + ' ' + F(oy) + 'A' + F(gR * 0.34) + ' ' + F(gR * 0.32) + ' 0 0 1 ' + F(ox + gR * 0.34) + ' ' + F(oy) + 'Q' + F(ox + gR * 0.33) + ' ' + F(oy + gR * 0.22) + ' ' + F(ox + gR * 0.08) + ' ' + F(oy + gR * 0.31) +
          'L' + F(ox + gR * 0.07) + ' ' + F(oy + gR * 0.58) + 'Q' + F(ox + gR * 0.03) + ' ' + F(oy + gR * 0.68) + ' ' + F(ox - gR * 0.01) + ' ' + F(oy + gR * 0.58) + 'L' + F(ox - gR * 0.03) + ' ' + F(oy + gR * 0.32) +
          'Q' + F(ox - gR * 0.33) + ' ' + F(oy + gR * 0.24) + ' ' + F(ox - gR * 0.34) + ' ' + F(oy) + 'Z" style="fill:url(#' + I.oleo + ')" stroke="#000" stroke-width=".5" pointer-events="none"/>' +
          '<path d="M' + F(ox - gR * 0.22) + ' ' + F(oy - gR * 0.12) + 'Q' + F(ox - gR * 0.12) + ' ' + F(oy - gR * 0.26) + ' ' + F(ox + gR * 0.08) + ' ' + F(oy - gR * 0.25) + '" fill="none" stroke="#e8f0ff" stroke-opacity=".55" stroke-width=".9" stroke-linecap="round" pointer-events="none"/>';
      } else {
        o += '<path d="' + hx + 'Z" style="fill:#5d656a;stroke:#15181a" stroke-width=".6"/>' +
          '<path d="' + hx + 'Z" style="fill:none;stroke:#d8dde0" stroke-opacity=".35" stroke-width=".5" transform="translate(-.4 -.4)"/>' +
          '<circle cx="' + F(cx) + '" cy="' + F(cy) + '" r="' + F(gR * 0.085) + '" fill="#0a0c0d"/>';
      }
      return o;
    },
    center: function (ctx) {
      /* medalhão de ferro forjado, com o símbolo da mana phyrexiana cinzelado e cheio de sangue */
      var y = 191, sim = 'M' + 238 + ' ' + y + 'A8 8 0 1 0 222 ' + y + 'A8 8 0 1 0 238 ' + y + 'M230 ' + (y - 13) + 'V' + (y + 13);
      return '<circle cx="231.5" cy="232.5" r="' + (ctx.r0 - 3) + '" fill="#000" opacity=".6" filter="url(#' + I.sombra + ')"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.r0 - 3) + '" style="fill:url(#' + I.ferro + ')"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.r0 - 7) + '" style="fill:url(#' + I.med + ')"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.r0 - 7) + '" style="fill:#2a2f32" filter="url(#' + ctx.k.textura + ')" opacity=".5"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.r0 - 7) + '" style="fill:none;stroke:#000" stroke-opacity=".6" stroke-width="1"/>' +
        '<path d="' + sim + '" style="fill:none;stroke:#050607" stroke-width="3.6" stroke-linecap="round"/>' +
        '<path d="' + sim + '" style="fill:none;stroke:#8a0f18" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="' + sim + '" style="fill:none;stroke:#e04a50" stroke-opacity=".45" stroke-width=".7" stroke-linecap="round" transform="translate(-.5 -.5)"/>' +
        '<path d="' + sim + '" style="fill:none;stroke:#c9cfd2" stroke-opacity=".25" stroke-width=".7" transform="translate(.9 1.4)"/>';
    }
  };
})();
