/* Motivo "ovos" do gráfico de pontuação: 05. Slivers, rebranding (lotes 3 e 4), variação R (Ovos de couro) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "ovos"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "ovos" do gráfico de pontuação: 05. Slivers (Ninho de Enxames), rebranding, segunda rodada, variação R (realismo).
   Mesmo conceito e composição de hoje: dez ovos deitados no ninho, a ponta para fora, a casca racha com a soma e o mais
   cheio eclode, com a tampa quebrada e a garra do Sliver saindo. Refeito como objeto: casca de couro grossa, cor de osso,
   com pintas e manchas (as pintas miúdas têm a cor do critério, como o pigmento de um ovo de ave), luz quente de caverna
   vindo do alto à esquerda, sombra no ninho, e o ninho de gravetos, fibras e lascas de osso em volta. A rachadura sai da
   base do ovo e avança para a ponta; na fresta aparece a quitina do filhote. No centro, uma placa de quitina com as cinco
   gotas de resina da cascata. Sem halo, sem núcleo branco, sem mix-blend, sem luz de dentro.
   Medida: a rachadura vai da base do ovo até raio(g.frac), linear com mínimo de 12%; o ovo eclode a partir de 93%, como hoje. */
var MOTIVO_PAINEL = (function () {
  var R0 = 60, RR = 184, STEP = 36, GAP = 2.4;
  var EA = Math.min((RR - R0) * 0.44, 58), ERC = R0 + (RR - R0) * 0.52;
  var EB = Math.min(ERC * Math.sin((STEP / 2 - GAP) * Math.PI / 180) * 0.92 / 0.75, EA * 0.95) * 0.93, ECUT = EA * 0.28;
  function cl(f) { return Math.max(0.12, Math.min(1, f)); }
  function raio(f) { return ERC - EA + 2 * EA * cl(f); }
  function f1(n) { return (+n).toFixed(1); }
  function ovo(a, b) {
    return 'M' + (-a) + ' 0C' + (-a) + ' ' + f1(-b * 1.05) + ' ' + f1(a * 0.45) + ' ' + f1(-b * 0.95) + ' ' + a + ' 0' +
      'C' + f1(a * 0.45) + ' ' + f1(b * 0.95) + ' ' + (-a) + ' ' + f1(b * 1.05) + ' ' + (-a) + ' 0Z';
  }
  /* meia largura do ovo na posição x (aproximação da curva acima) */
  function meia(x) { var t = (x + EA) / (2 * EA); return EB * 0.79 * Math.sqrt(Math.max(0, t)) * Math.pow(Math.max(0, 1 - t), 0.62) * 1.7; }
  /* rachadura da base até x1: linha quebrada com semente fixa e dois galhos */
  function racha(K, x1, sd) {
    K.sorte(sd);
    var pts = [[-EA + 1.2, 0]], x = -EA + 1.2, y = 0, k, br = [];
    while (x < x1 - 0.5) {
      x = Math.min(x1, x + 2.5 + K.sorte() * 5);
      var lim = Math.max(1, meia(x) * 0.45);
      y = Math.max(-lim, Math.min(lim, y + (K.sorte() - 0.5) * 7));
      pts.push([x, y]);
    }
    for (k = 1; k < pts.length - 1; k++) {
      if (K.sorte() < 0.55) continue;
      var p = pts[k], s = K.sorte() < 0.5 ? -1 : 1, L = 3 + K.sorte() * 6, an = (25 + K.sorte() * 40) * Math.PI / 180;
      var q = [p[0] + L * Math.cos(an), p[1] + s * L * Math.sin(an)], q2 = [q[0] + L * 0.5, q[1] + s * L * 0.25 * (K.sorte() - 0.3)];
      br.push([p, q, q2]);
    }
    return { d: 'M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L'),
      g: br.map(function (b) { return 'M' + b.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L'); }).join('') };
  }
  /* garra de Sliver: três espinhos curvos de quitina, com o dorso claro */
  function garra(x, I) {
    return [-0.3, 0, 0.3].map(function (fy, j) {
      var y = fy * EB, L = EA * (j === 1 ? 0.66 : 0.5), w = EB * 0.12, s = j === 0 ? -1 : j === 2 ? 1 : 0;
      var d = 'M' + f1(x) + ' ' + f1(y - w) + 'Q' + f1(x + L * 0.55) + ' ' + f1(y - w + s * 4) + ' ' + f1(x + L) + ' ' + f1(y + s * 9) +
        'Q' + f1(x + L * 0.5) + ' ' + f1(y + w * 0.6 + s * 3) + ' ' + f1(x) + ' ' + f1(y + w) + 'Z';
      var dorso = 'M' + f1(x + 2) + ' ' + f1(y - w * 0.45) + 'Q' + f1(x + L * 0.55) + ' ' + f1(y - w * 0.45 + s * 4) + ' ' + f1(x + L - 2) + ' ' + f1(y + s * 9);
      return '<path d="' + d + '" style="fill:#000" opacity=".45" transform="translate(1.5 2)"/>' +
        '<path d="' + d + '" fill="url(#' + I.quit + ')" style="stroke:#140a14" stroke-width=".9"/>' +
        '<path d="' + dorso + '" style="fill:none;stroke:#d9c8e8" stroke-width=".8" stroke-linecap="round" opacity=".55"/>' +
        [0.3, 0.5, 0.7].map(function (t) { var px = x + L * t, py = y + s * 9 * t * t - w * (1 - t) * 0.3; return '<path d="M' + f1(px) + ' ' + f1(py - w * 0.8 * (1 - t) - 1) + 'l1 ' + f1(w * 1.6 * (1 - t) + 2) + '" style="stroke:#140a14" stroke-width=".5" opacity=".6"/>'; }).join('');
    }).join('');
  }
  function luzLocal(am, k) { var t = -am * Math.PI / 180, vx = -k, vy = -k; return [vx * Math.cos(t) - vy * Math.sin(t), vx * Math.sin(t) + vy * Math.cos(t)]; }
  var I;
  return {
    raio: raio,
    legenda: { peca: 'ovo', masc: true, texto: ' é um critério: a rachadura sai da base e avança com a soma, e o mais cheio eclode.' },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'svR');
      I = { chao: ctx.uid('svRc'), quit: ctx.uid('svRq'), placa: ctx.uid('svRp'), resina: ctx.uid('svRr'), base: ctx.uid('svRb'), cima: ctx.uid('svRt'), pele: ctx.uid('svRk') };
      return o +
        '<radialGradient id="' + I.chao + '" cx="215" cy="205" r="215" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a2416"/><stop offset=".6" stop-color="#26170e"/><stop offset="1" stop-color="#120a05"/></radialGradient>' +
        '<linearGradient id="' + I.quit + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1a34"/><stop offset=".55" stop-color="#6a4f86"/><stop offset="1" stop-color="#b6a2cc"/></linearGradient>' +
        '<radialGradient id="' + I.placa + '" cx="216" cy="210" r="70" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a2a30"/><stop offset=".7" stop-color="#1e1418"/><stop offset="1" stop-color="#0c0709"/></radialGradient>' +
        '<radialGradient id="' + I.resina + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe1a0"/><stop offset=".35" stop-color="#d98a2c"/><stop offset="1" stop-color="#5a2a08"/></radialGradient>' +
        /* pele da casca: manchas largas, claras e escuras */
        '<filter id="' + I.pele + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="23" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .28  0 0 0 0 .2  0 0 0 0 .12  0 0 0 1.8 -.75" result="c"/><feComposite in="c" in2="SourceGraphic" operator="in"/></filter>' +
        '<clipPath id="' + I.base + '"><rect x="' + f1(-EA - 2) + '" y="' + f1(-EB - 2) + '" width="' + f1(EA + 2 + ECUT) + '" height="' + f1(2 * EB + 4) + '"/></clipPath>' +
        '<clipPath id="' + I.cima + '"><rect x="' + f1(ECUT) + '" y="' + f1(-EB - 2) + '" width="' + f1(EA + 2 - ECUT) + '" height="' + f1(2 * EB + 4) + '"/></clipPath>';
    },
    /* o ninho: chão de caverna, uma cama de fibras e o anel de gravetos e lascas de osso */
    stage: function (ctx) {
      var K = ctx.kit, o = '', k, cores = ['#2e1d10', '#4a3019', '#6a4826', '#8a6638', '#a88a5c'], camadas = ['', '', '', '', ''];
      o += '<circle cx="230" cy="230" r="194" fill="url(#' + I.chao + ')"/>' +
        '<circle cx="230" cy="230" r="194" style="fill:#fff" filter="url(#' + ctx.k.textura + ')" opacity=".05"/>';
      K.sorte(1);
      for (k = 0; k < 520; k++) {
        var outer = k < 360, r = outer ? 150 + K.sorte() * 40 : 66 + K.sorte() * 100, a = K.sorte() * 360, L = outer ? 8 + K.sorte() * 16 : 4 + K.sorte() * 8, tilt = (outer ? 70 : 0) + (K.sorte() - 0.5) * 120;
        var p0 = K.pt(a, r), ang = (a + 90 + tilt) * Math.PI / 180, bend = (K.sorte() - 0.5) * 5;
        if (r + L / 2 > 193) r = 193 - L / 2;
        var x1 = p0[0] + L * Math.cos(ang), y1 = p0[1] + L * Math.sin(ang), mx = (p0[0] + x1) / 2 - bend * Math.sin(ang), my = (p0[1] + y1) / 2 + bend * Math.cos(ang);
        var c = outer ? Math.floor(K.sorte() * 5) : Math.floor(K.sorte() * 3);
        camadas[c] += 'M' + f1(p0[0]) + ' ' + f1(p0[1]) + 'Q' + f1(mx) + ' ' + f1(my) + ' ' + f1(x1) + ' ' + f1(y1);
      }
      o += '<g transform="translate(1 1.6)" opacity=".7"><path d="' + camadas.join('') + '" style="fill:none;stroke:#000" stroke-width="2" stroke-linecap="round" filter="url(#' + ctx.k.brilho2 + ')"/></g>';
      camadas.forEach(function (d, i) { o += '<path d="' + d + '" style="fill:none;stroke:' + cores[i] + '" stroke-width="' + (1.8 - i * 0.2) + '" stroke-linecap="round"/>'; });
      /* lascas de osso no anel */
      K.sorte(2); var os = '';
      for (k = 0; k < 14; k++) {
        var aa = K.sorte() * 360, rr = 168 + K.sorte() * 18, q = K.pt(aa, rr), w = 3 + K.sorte() * 5;
        os += '<ellipse cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" rx="' + f1(w) + '" ry="' + f1(1.3 + K.sorte()) + '" transform="rotate(' + f1(K.sorte() * 180) + ' ' + f1(q[0]) + ' ' + f1(q[1]) + ')"/>';
      }
      o += '<g style="fill:#cbbb9a;stroke:#3a2a18" stroke-width=".5" opacity=".75">' + os + '</g>' +
        '<circle cx="230" cy="230" r="194" style="fill:none;stroke:#000" stroke-width="6" opacity=".35" filter="url(#' + ctx.k.brilho2 + ')"/>';
      return o;
    },
    group: function (g, ctx) {
      var K = ctx.kit, vl = Math.max(0, Math.min(1, g.frac)), hatch = vl >= 0.93, ep = ctx.pol(ERC, g.am), eg = ovo(EA, EB);
      var lv = -EA + 2 * EA * cl(g.frac), L = luzLocal(g.am, EB * 0.5), gC = ctx.uid('svRd'), gS = ctx.uid('svRs'), cOv = ctx.uid('svRo'), T = 'translate(' + f1(ep[0]) + ' ' + f1(ep[1]) + ') rotate(' + f1(g.am + (((g.i * 7919) % 11) / 10 - 0.5) * 9) + ')';
      var o = '<path class="ghost" d="' + eg + '" transform="' + T + '" style="fill:transparent;stroke:rgba(var(--gold-rgb),.0)" stroke-width="1"/>';
      /* sombra do ovo no ninho, para baixo e à direita da tela */
      o += '<g transform="translate(3.5 5)" pointer-events="none"><path d="' + eg + '" transform="' + T + '" style="fill:#000" opacity=".7" filter="url(#' + ctx.k.brilho + ')"/></g>';
      o += '<g class="fill"><g transform="' + T + '" pointer-events="none">' +
        '<defs><clipPath id="' + cOv + '"><path d="' + eg + '"/></clipPath>' +
        '<radialGradient id="' + gC + '" cx="' + f1(L[0]) + '" cy="' + f1(L[1]) + '" r="' + f1(EA * 1.55) + '" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3dfb4"/>' +
        '<stop offset=".35" stop-color="#cdb084"/><stop offset=".72" stop-color="#7f6444"/><stop offset="1" stop-color="#2e2214"/></radialGradient>' +
        '<radialGradient id="' + gS + '" cx="' + f1(L[0]) + '" cy="' + f1(L[1]) + '" r="' + f1(EA * 1.55) + '" gradientUnits="userSpaceOnUse"><stop offset=".3" stop-color="#2e2214" stop-opacity="0"/>' +
        '<stop offset=".75" stop-color="#2e2214" stop-opacity=".35"/><stop offset="1" stop-color="#1a1209" stop-opacity=".7"/></radialGradient></defs>';
      function casca(clip) {
        var c = clip ? ' clip-path="url(#' + clip + ')"' : '', s = '', k;
        s += '<path d="' + eg + '" fill="url(#' + gC + ')"' + c + '/>' +
          '<g' + c + '><path d="' + eg + '" style="fill:#fff" filter="url(#' + I.pele + ')" clip-path="url(#' + cOv + ')"/></g>';
        /* pintas: miúdas na cor do critério e algumas escuras maiores */
        K.sorte(500 + g.i); var pc = '', pe = '';
        for (k = 0; k < 34; k++) {
          var px = (K.sorte() - 0.45) * 1.8 * EA, w = meia(px), py = (K.sorte() - 0.5) * 1.7 * w, rr = 0.5 + K.sorte() * 1.3;
          if (Math.abs(py) > w * 0.9) continue;
          if (k % 4 === 0) pe += '<ellipse cx="' + f1(px) + '" cy="' + f1(py) + '" rx="' + f1(rr * 1.6) + '" ry="' + f1(rr) + '"/>';
          else pc += '<circle cx="' + f1(px) + '" cy="' + f1(py) + '" r="' + f1(rr * 0.8) + '"/>';
        }
        s += '<g' + c + '><g clip-path="url(#' + cOv + ')"><g style="fill:' + g.cor + '" opacity=".85">' + pc + '</g><g style="fill:#3a2414" opacity=".55">' + pe + '</g>' +
          /* volume por cima das pintas: o lado de baixo escurece tudo */
          '<path d="' + eg + '" fill="url(#' + gS + ')"/></g></g>' +
          '<path d="' + eg + '" style="fill:none;stroke:#1e140a" stroke-width=".9" opacity=".7"' + c + '/>';
        return s;
      }
      var corpo;
      if (hatch) {
        var borda = 'M' + f1(ECUT) + ' ' + f1(-EB * 0.62) + 'L' + f1(ECUT + 5) + ' ' + f1(-EB * 0.3) + 'L' + f1(ECUT - 3) + ' 0L' + f1(ECUT + 4) + ' ' + f1(EB * 0.3) + 'L' + f1(ECUT) + ' ' + f1(EB * 0.62);
        var rc = racha(K, ECUT - 2, 800 + g.i);
        corpo = casca(I.base) +
          /* o oco do ovo aberto: membrana úmida escura */
          '<ellipse cx="' + f1(ECUT + 1) + '" cy="0" rx="4" ry="' + f1(EB * 0.6) + '" style="fill:#1a0e12"/>' +
          '<path d="' + rc.d + rc.g + '" style="fill:none;stroke:#1a0e0a" stroke-width="1.5" stroke-linejoin="round"/>' +
          garra(ECUT - 2, I) +
          '<path d="' + borda + '" style="fill:none;stroke:#cdb994" stroke-width="2" stroke-linejoin="round"/>' +
          '<path d="' + borda + '" style="fill:none;stroke:#2a1c10" stroke-width=".7" transform="translate(-1 0)"/>' +
          /* a tampa quebrada caída de lado */
          '<g transform="translate(-6 ' + f1(-EB * 0.28) + ') rotate(-40 ' + f1(ECUT) + ' ' + f1(-EB * 0.62) + ')"><path d="' + eg + '" style="fill:#000" opacity=".5" transform="translate(2 3)" clip-path="url(#' + I.cima + ')" filter="url(#' + ctx.k.brilho2 + ')"/>' + casca(I.cima) + '</g>';
      } else {
        var rk = racha(K, lv, 800 + g.i);
        corpo = casca(null) +
          /* a rachadura: sulco escuro, a quitina do filhote na fresta e a borda clara de um lado */
          '<path d="' + rk.d + '" style="fill:none;stroke:#f4ead4" stroke-width=".9" stroke-linejoin="round" opacity=".35" transform="translate(-.6 -.9)"/>' +
          '<path d="' + rk.d + '" style="fill:none;stroke:#140a06" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>' +
          '<path d="' + rk.g + '" style="fill:none;stroke:#1e120a" stroke-width=".8" stroke-linejoin="round" stroke-linecap="round" opacity=".85"/>' +
          '<path d="' + rk.d + '" style="fill:none;stroke:' + g.cor + '" stroke-width="1.05" stroke-linejoin="round"/>';
      }
      return o + corpo + '</g></g>';
    },
    /* placa de quitina com as cinco gotas de resina da cascata, que diminuem */
    center: function (ctx) {
      var r = R0 - 13, o = '<circle cx="231" cy="232" r="59" style="fill:#000" opacity=".6" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<circle cx="230" cy="230" r="56" fill="url(#' + I.placa + ')"/>' +
        '<circle cx="230" cy="230" r="56" style="fill:#fff" filter="url(#' + I.pele + ')" opacity=".25"/>' +
        '<circle cx="230" cy="230" r="55" style="fill:none;stroke:#5a4048" stroke-width="1.2" opacity=".7"/>' +
        '<circle cx="230" cy="230" r="51" style="fill:none;stroke:#000" stroke-width="1.5" opacity=".5"/>';
      [6, 5, 4.2, 3.4, 2.7].forEach(function (s, j) {
        var p = ctx.pol(r, -150 + j * 30);
        o += '<circle cx="' + f1(p[0] + 0.8) + '" cy="' + f1(p[1] + 1.4) + '" r="' + s + '" style="fill:#000" opacity=".55" filter="url(#' + ctx.k.brilho2 + ')"/>' +
          '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + s + '" fill="url(#' + I.resina + ')" style="stroke:#3a1a04" stroke-width=".6"/>' +
          '<ellipse cx="' + f1(p[0] - s * 0.35) + '" cy="' + f1(p[1] - s * 0.4) + '" rx="' + f1(s * 0.32) + '" ry="' + f1(s * 0.2) + '" style="fill:#fff8e6" opacity=".8"/>';
      });
      return o;
    }
  };
})();
