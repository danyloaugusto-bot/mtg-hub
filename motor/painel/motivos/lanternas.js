/* Motivo "lanternas" do gráfico de pontuação: 03. Tergrid (Lanterna do Medo), escolhido pelo dono na votação de 15/10/2026.
   Veio do protótipo motivos/tergrid.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "lanternas"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Tergrid, Lanterna do Medo: a deusa do medo de Kaldheim; o verso da carta é a Tergrid's Lantern (luz azul-gelo).
     Duas opções com a mesma lanterna acesa no medalhão:
     1. pedras rúnicas de pé, com a luz subindo por dentro da pedra;
     2. lanternas nórdicas de ferro penduradas, com a chama crescendo. */
  (function () {
    // sorteio fixo: a mesma pedra sai sempre igual
    function rng(seed) {
      var s = (seed * 7919 + 104729) % 233280;
      return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    }
    var ACENTOS = new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36f) + ']', 'g');
    function semAcento(s) { return String(s).normalize('NFD').replace(ACENTOS, '').toLowerCase(); }

    /* runas do futhark antigo, em traços; caixa de -0.5 a 0.5 de altura */
    var RUNES = {
      fehu: [[[-.16, -.5], [-.16, .5]], [[-.16, -.12], [.2, -.44]], [[-.16, .14], [.2, -.18]]],
      ansuz: [[[-.16, -.5], [-.16, .5]], [[-.16, -.5], [.2, -.2]], [[-.16, -.22], [.2, .08]]],
      thurisaz: [[[-.16, -.5], [-.16, .5]], [[-.16, -.28], [.2, 0], [-.16, .28]]],
      algiz: [[[0, -.5], [0, .5]], [[-.27, -.44], [0, -.08], [.27, -.44]]],
      hagalaz: [[[-.2, -.5], [-.2, .5]], [[.2, -.5], [.2, .5]], [[-.2, -.18], [.2, .18]]],
      gebo: [[[-.27, -.42], [.27, .42]], [[.27, -.42], [-.27, .42]]],
      tiwaz: [[[0, -.5], [0, .5]], [[-.27, -.2], [0, -.5], [.27, -.2]]],
      jera: [[[-.02, -.44], [-.25, -.2], [-.02, .04]], [[.02, -.04], [.25, .2], [.02, .44]]],
      mannaz: [[[-.2, .5], [-.2, -.5], [.2, -.1]], [[.2, .5], [.2, -.5], [-.2, -.1]]],
      ingwaz: [[[0, -.34], [.24, 0], [0, .34], [-.24, 0], [0, -.34]]],
      raido: [[[-.16, .5], [-.16, -.5], [.18, -.26], [-.16, -.02], [.2, .5]]],
      dagaz: [[[-.25, -.36], [-.25, .36], [.25, -.36], [.25, .36], [-.25, -.36]]],
      othala: [[[0, -.5], [.24, -.14], [-.24, .5]], [[0, -.5], [-.24, -.14], [.24, .5]]],
      sowilo: [[[.18, -.5], [-.18, -.12], [.18, .12], [-.18, .5]]],
      berkanan: [[[-.16, -.5], [-.16, .5]], [[-.16, -.5], [.2, -.25], [-.16, 0], [.2, .25], [-.16, .5]]],
      ehwaz: [[[-.2, .5], [-.2, -.5], [0, -.2], [.2, -.5], [.2, .5]]],
      laguz: [[[-.12, .5], [-.12, -.5], [.18, -.2]]],
      kaunan: [[[.18, -.3], [-.14, 0], [.18, .3]]],
      uruz: [[[-.18, .5], [-.18, -.5], [.18, -.2], [.18, .5]]],
      wunjo: [[[-.14, .5], [-.14, -.5], [.18, -.28], [-.14, -.06]]],
      eihwaz: [[[-.16, -.36], [0, -.5], [0, .5], [.16, .36]]],
      naudiz: [[[0, -.5], [0, .5]], [[-.2, -.12], [.2, .12]]]
    };
    // a runa de cada agrupamento pelo sentido: riqueza no ramp, sabedoria no draw, espinho no removal, proteção na proteção,
    // granizo no descarte, oferenda no sacrifício, Tyr no fechamento, o ciclo do ano na recursão
    var MAPA = [[/ramp|mana/, 'fehu'], [/draw|compra|tutor/, 'ansuz'], [/remo|intera/, 'thurisaz'], [/prote|defesa|blind/, 'algiz'],
      [/descart/, 'hagalaz'], [/sacrif/, 'gebo'], [/fecha|win|vitor/, 'tiwaz'], [/recurs|reanim/, 'jera'], [/token/, 'mannaz'],
      [/sinerg/, 'ingwaz'], [/polit/, 'raido'], [/combo/, 'dagaz']];
    var RESERVA = ['othala', 'sowilo', 'berkanan', 'ehwaz', 'laguz', 'kaunan', 'uruz', 'wunjo', 'eihwaz', 'naudiz'];
    function runaDe(g, ctx) {
      var usadas = ctx._tgRunas || (ctx._tgRunas = {}), n = semAcento(g.n), k = null, j;
      for (j = 0; j < MAPA.length; j++) if (MAPA[j][0].test(n) && !usadas[MAPA[j][1]]) { k = MAPA[j][1]; break; }
      if (!k) for (j = 0; j < RESERVA.length; j++) if (!usadas[RESERVA[j]]) { k = RESERVA[j]; break; }
      usadas[k] = 1;
      return k;
    }
    function runeD(key, x, y, h) {
      return RUNES[key].map(function (pl) {
        return pl.map(function (p, k) { return (k ? 'L' : 'M') + f1(x + p[0] * h) + ' ' + f1(y + p[1] * h); }).join('');
      }).join('');
    }
    // polígono com cantos levemente arredondados (lascas de pedra, não seixo); aberto = sem fechar a volta
    function roundPoly(pts, rr, aberto) {
      var n = pts.length, o = '';
      for (var i = 0; i < n; i++) {
        var p = pts[i];
        if (aberto && (i === 0 || i === n - 1)) { o += (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1]); continue; }
        var a = pts[(i + n - 1) % n], b = pts[(i + 1) % n], r = rr[i];
        var la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
        var ta = Math.min(r / la, 0.45), tb = Math.min(r / lb, 0.45);
        o += (i ? 'L' : 'M') + f1(p[0] + (a[0] - p[0]) * ta) + ' ' + f1(p[1] + (a[1] - p[1]) * ta) + 'Q' + f1(p[0]) + ' ' + f1(p[1]) + ' ' +
          f1(p[0] + (b[0] - p[0]) * tb) + ' ' + f1(p[1] + (b[1] - p[1]) * tb);
      }
      return o + (aberto ? '' : 'Z');
    }

    /* filtros e gradientes comuns; ids únicos por gráfico, guardados no ctx */
    function defsComum(ctx) {
      var T = ctx.tg = { glow: ctx.uid('tgGlow'), glow2: ctx.uid('tgGlowF'), blur: ctx.uid('tgBlur'), bloom: ctx.uid('tgBloom'), rock: ctx.uid('tgRock'),
        stone: ctx.uid('tgStone'), iron: ctx.uid('tgIron'), disc: ctx.uid('tgDisc'), cHalo: ctx.uid('tgCHalo'), cGlass: ctx.uid('tgCGlass'),
        wax: ctx.uid('tgWax'), chain: ctx.uid('tgChain'), shadow: ctx.uid('tgShadow'), foot: ctx.uid('tgFoot') };
      return '<filter id="' + T.glow + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/>' +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
        '<filter id="' + T.glow2 + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.4" result="b"/>' +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
        '<filter id="' + T.blur + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>' +
        '<filter id="' + T.bloom + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4.5"/></filter>' +
        // textura de pedra: ruído iluminado de lado, multiplicado sobre a pedra (e sobre a luz dentro dela)
        '<filter id="' + T.rock + '" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.05 0.085" numOctaves="4" seed="11" result="n"/>' +
        '<feDiffuseLighting in="n" surfaceScale="1.6" diffuseConstant="1.12" lighting-color="#ffffff" result="l"><feDistantLight azimuth="225" elevation="57"/></feDiffuseLighting>' +
        '<feBlend in="SourceGraphic" in2="l" mode="multiply" result="m"/><feComposite in="m" in2="SourceAlpha" operator="in"/></filter>' +
        '<linearGradient id="' + T.stone + '" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0" style="stop-color:rgb(var(--dim-rgb));stop-opacity:.66"/>' +
        '<stop offset=".55" style="stop-color:rgb(var(--dim-rgb));stop-opacity:.36"/><stop offset="1" style="stop-color:rgb(var(--dim-rgb));stop-opacity:.14"/></linearGradient>' +
        '<linearGradient id="' + T.iron + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--dim)"/><stop offset=".3" style="stop-color:var(--raise)"/>' +
        '<stop offset="1" style="stop-color:var(--deep)"/></linearGradient>' +
        '<radialGradient id="' + T.disc + '" cx=".5" cy=".5" r=".5"><stop offset="0" style="stop-color:rgba(var(--raise-rgb),.5)"/>' +
        '<stop offset=".7" style="stop-color:rgba(var(--deep-rgb),.6)"/><stop offset="1" style="stop-color:rgba(var(--deep-rgb),.78)"/></radialGradient>' +
        '<linearGradient id="' + T.foot + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:rgba(var(--deep-rgb),0)"/><stop offset=".7" style="stop-color:rgba(var(--deep-rgb),.7)"/>' +
        '<stop offset="1" style="stop-color:rgba(var(--deep-rgb),.85)"/></linearGradient>' +
        '<radialGradient id="' + T.shadow + '"><stop offset="0" style="stop-color:rgba(var(--deep-rgb),.85)"/><stop offset="1" style="stop-color:rgba(var(--deep-rgb),0)"/></radialGradient>' +
        '<radialGradient id="' + T.cHalo + '"><stop offset="0" style="stop-color:rgba(var(--gold2-rgb),.55)"/><stop offset=".45" style="stop-color:rgba(var(--gold-rgb),.2)"/>' +
        '<stop offset="1" style="stop-color:rgba(var(--gold-rgb),0)"/></radialGradient>' +
        '<radialGradient id="' + T.cGlass + '" cx=".5" cy=".66" r=".7"><stop offset="0" style="stop-color:var(--gold2)"/><stop offset=".6" style="stop-color:rgba(var(--gold-rgb),.8)"/>' +
        '<stop offset="1" style="stop-color:rgba(var(--gold-rgb),.4)"/></radialGradient>' +
        '<linearGradient id="' + T.wax + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:rgba(var(--bone-rgb),.9)"/><stop offset="1" style="stop-color:rgba(var(--bone-rgb),.42)"/></linearGradient>' +
        '<linearGradient id="' + T.chain + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" style="stop-color:rgba(var(--mute-rgb),.8)"/><stop offset="1" style="stop-color:rgba(var(--mute-rgb),0)"/></linearGradient>';
    }

    function palco(ctx) {
      var T = ctx.tg;
      return '<circle cx="230" cy="230" r="' + (ctx.R + 10) + '" style="fill:url(#' + T.disc + ');stroke:rgba(var(--gold-rgb),.4)" stroke-width="1.2"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 16) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.34)" stroke-width="1.3" stroke-dasharray="8 3 2 3"/>';
    }

    /* a Tergrid's Lantern no medalhão: pequena, acesa, acima do número (de 177 a 203, antes do placar) */
    function centro(ctx) {
      var T = ctx.tg, ir = 'fill:url(#' + T.iron + ');stroke:rgba(var(--gold-rgb),.6)';
      return '<circle cx="230" cy="230" r="' + (ctx.r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
        '<circle cx="230" cy="196" r="25" style="fill:url(#' + T.cHalo + ')"/>' +
        '<g transform="translate(230 177.5) scale(.9)">' +
        '<circle cx="0" cy="2.5" r="2.1" style="fill:none;stroke:rgba(var(--gold-rgb),.8)" stroke-width="1.1"/>' +
        '<path d="M-1.6 5L1.6 5L8.6 10.8L-8.6 10.8Z" style="' + ir + '" stroke-width=".6" stroke-linejoin="round"/>' +
        '<path d="M-3.2 9.2l.9 -1.4l.9 1.4ZM-.9 9.2l.9 -1.4l.9 1.4ZM1.4 9.2l.9 -1.4l.9 1.4Z" style="fill:var(--gold2)"/>' +
        '<rect x="-9.4" y="10.5" width="18.8" height="2.2" rx=".8" style="' + ir + '" stroke-width=".6"/>' +
        '<rect x="-6.6" y="12.7" width="13.2" height="11.6" style="fill:url(#' + T.cGlass + ')"/>' +
        '<path d="M-2 23.6C-2 21.2 -.6 19.6 .2 15.6C.8 19.6 2 21.2 2 23.6Z" style="fill:#fff" filter="url(#' + T.glow + ')"/>' +
        '<rect x="-7.6" y="12.7" width="1.9" height="11.6" style="' + ir + '" stroke-width=".4"/><rect x="5.7" y="12.7" width="1.9" height="11.6" style="' + ir + '" stroke-width=".4"/>' +
        '<rect x="-3" y="12.7" width=".8" height="11.6" style="fill:var(--raise)"/><rect x="2.2" y="12.7" width=".8" height="11.6" style="fill:var(--raise)"/>' +
        '<rect x="-8.6" y="24.1" width="17.2" height="2" rx=".7" style="' + ir + '" stroke-width=".6"/>' +
        '<path d="M-6.6 26.1Q0 29.6 6.6 26.1Z" style="' + ir + '" stroke-width=".5"/></g>';
    }

    /* ---------- opção 1: pedras rúnicas fincadas ---------- */
    // quatro silhuetas de pedra bruta, do pé esquerdo ao pé direito; x em meias larguras, y em alturas (para cima é negativo).
    // O ponto mais alto é sempre -1, para que a luz cheia (100%) chegue ao topo de todas; r = raio de cada canto (lasca viva ou gasta).
    var MENIRES = [
      { p: [[-1, .03], [-1.02, -.3], [-.98, -.62], [-.9, -.86], [-.62, -1.0], [-.2, -.97], [.2, -.9], [.55, -.8], [.82, -.66], [.97, -.42], [1.02, -.18], [1, .03]],
        r: [1, 4, 5, 6, 4, 3, 5, 4, 5, 6, 4, 1] },
      { p: [[-1, .03], [-1.04, -.26], [-.94, -.52], [-.78, -.74], [-.5, -.9], [-.12, -1.0], [.18, -.96], [.46, -.84], [.74, -.62], [.92, -.4], [1.0, -.16], [.98, .03]],
        r: [1, 5, 4, 6, 4, 2.5, 3, 5, 4, 6, 4, 1] },
      { p: [[-1, .03], [-1.05, -.36], [-.98, -.7], [-.82, -.88], [-.5, -.9], [-.3, -.84], [-.08, -.97], [.3, -1.0], [.66, -.9], [.92, -.66], [1.02, -.32], [.98, .03]],
        r: [1, 5, 4, 4, 2, 2, 3, 4, 6, 5, 5, 1] },
      { p: [[-1, .03], [-1.0, -.34], [-.9, -.64], [-.66, -.86], [-.3, -.96], [.06, -.98], [.36, -1.0], [.7, -.92], [.9, -.74], [1.0, -.5], [1.04, -.22], [1, .03]],
        r: [1, 6, 6, 5, 4, 5, 3, 4, 5, 4, 5, 1] }
    ];
    var ORDEM_MENIR = [1, 0, 3, 2, 0, 1, 2, 3];


    /* ---------- opção 2: lanternas nórdicas penduradas ---------- */
    MOTIVOS.tergrid2 = {
      deck: '03. Tergrid', nome: 'Lanternas',
      desc: 'Cada agrupamento é uma lanterna nórdica de ferro, pendurada pela argola. A chama e a luz dos vidros crescem com a pontuação; a maior arde forte, com halo.',
      defs: defsComum,
      stage: palco,
      group: function (g, ctx) {
        var T = ctx.tg, s = 1.2, c = ctx.pol(127, g.am), hx = c[0], hy = c[1] - 30 * s, f = Math.max(0.06, g.frac), fe = Math.pow(f, 1.3);
        var ir = 'fill:url(#' + T.iron + ');stroke:rgba(var(--mute-rgb),.4)';
        // a chama: altura proporcional à pontuação (cheia = 26, quase até o teto)
        var fb = 49.6, hf = Math.max(2.4, 26 * f), wf = 1.5 + 4 * f, fc = fb - hf * 0.42;
        var gl = ctx.uid('tggl'), hl = ctx.uid('tghl');
        var o = '<radialGradient id="' + gl + '" gradientUnits="userSpaceOnUse" cx="0" cy="' + f1(fc) + '" r="' + f1(8 + 24 * f) + '">' +
          '<stop offset="0" style="stop-color:' + g.rgba(.22 + .74 * fe) + '"/><stop offset=".55" style="stop-color:' + g.rgba(.06 + .5 * fe) + '"/>' +
          '<stop offset="1" style="stop-color:' + g.rgba(.02 + .26 * fe) + '"/></radialGradient>' +
          '<radialGradient id="' + hl + '"><stop offset="0" style="stop-color:' + g.rgba(g.top ? .66 : .05 + .4 * fe) + '"/>' +
          '<stop offset=".45" style="stop-color:' + g.rgba(g.top ? .26 : .02 + .14 * fe) + '"/><stop offset="1" style="stop-color:' + g.rgba(0) + '"/></radialGradient>';
        o += '<g transform="translate(' + f1(hx) + ' ' + f1(hy) + ') scale(' + s + ')">';
        // halo da luz em volta da lanterna
        o += '<circle cx="0" cy="' + f1(fc) + '" r="' + f1(g.top ? 48 : 10 + 30 * f) + '" style="fill:url(#' + hl + ')"/>';
        // corrente curta que some para cima, no escuro, e a argola
        o += '<line x1="0" y1="-11" x2="0" y2="-3.4" style="stroke:url(#' + T.chain + ')" stroke-width="1.1"/>' +
          '<ellipse cx="0" cy="-5.6" rx="1.4" ry="2.4" style="fill:none;stroke:rgba(var(--mute-rgb),.55)" stroke-width=".85"/>' +
          '<circle cx="0" cy="0" r="3.2" style="fill:none;stroke:rgba(var(--mute-rgb),.75)" stroke-width="1.4"/>';
        // telhado em pirâmide de ferro, com furos em triângulo por onde a luz escapa
        var furo = g.rgba(.12 + .85 * fe);
        o += '<rect x="-1.5" y="3" width="3" height="2.8" rx=".6" style="' + ir + '" stroke-width=".5"/>' +
          '<path d="M-2.4 5.6L2.4 5.6L15.4 16.8L-15.4 16.8Z" style="' + ir + '" stroke-width=".7" stroke-linejoin="round"/>' +
          '<path d="M-1.2 6.4L-8.6 16.2" style="fill:none;stroke:rgba(var(--bone-rgb),.16)" stroke-width=".8"/>' +
          '<path d="M-8.4 15.2l1.3 -2.2l1.3 2.2ZM-4.1 15.2l1.3 -2.2l1.3 2.2ZM.2 15.2l1.3 -2.2l1.3 2.2ZM4.5 15.2l1.3 -2.2l1.3 2.2ZM-2.2 11.2l1.1 -1.9l1.1 1.9ZM1.1 11.2l1.1 -1.9l1.1 1.9Z" ' +
          'style="fill:' + furo + '"' + (fe > 0.5 ? ' filter="url(#' + T.glow + ')"' : '') + '/>' +
          '<rect x="-16.8" y="16.4" width="33.6" height="3.4" rx="1.1" style="' + ir + '" stroke-width=".7"/>' +
          '<path d="M-14.5 18.1l1.6 -1l1.6 1l1.6 -1l1.6 1l1.6 -1l1.6 1l1.6 -1l1.6 1l1.6 -1l1.6 1l1.6 -1l1.6 1l1.6 -1l1.6 1l1.6 -1l1.6 1l1.6 -1l1.6 1" style="fill:none;stroke:rgba(var(--bone-rgb),.2)" stroke-width=".5"/>';
        // vidros: vidro fumê embaixo, a luz da chama por cima; as faces de lado ficam mais escuras
        o += '<rect x="-13" y="19.8" width="26" height="35.6" style="fill:rgba(var(--deep-rgb),.9)"/>' +
          '<rect x="-13" y="19.8" width="26" height="35.6" style="fill:url(#' + gl + ')"/>' +
          '<rect x="-13" y="19.8" width="5.6" height="35.6" style="fill:rgba(var(--deep-rgb),.34)"/><rect x="7.4" y="19.8" width="5.6" height="35.6" style="fill:rgba(var(--deep-rgb),.44)"/>';
        // uma barra de ferro atravessada em cada face lateral
        o += '<path d="M-13 37.6H-7.4M7.4 37.6H13" style="fill:none;stroke:rgba(var(--deep-rgb),.9)" stroke-width="1.3"/>' +
          '<path d="M-13 37H-7.4M7.4 37H13" style="fill:none;stroke:rgba(var(--mute-rgb),.22)" stroke-width=".5"/>';
        // a vela e a chama
        o += '<rect x="-2.7" y="' + fb + '" width="5.4" height="6" style="fill:url(#' + T.wax + ')"/>' +
          '<ellipse cx="0" cy="' + fb + '" rx="2.7" ry=".9" style="fill:' + g.rgba(.4 + .5 * f) + '"/>' +
          '<line x1="0" y1="' + fb + '" x2=".3" y2="' + f1(fb - 1.5) + '" style="stroke:var(--deep)" stroke-width=".6"/>';
        var fl = function (w, h, dx) {
          var t = fb - h;
          return 'M' + f1(dx) + ' ' + f1(t) + 'C' + f1(dx * 0.6 + w * 0.55) + ' ' + f1(t + h * 0.38) + ' ' + f1(w * 1.05) + ' ' + f1(fb - h * 0.3) + ' ' + f1(w * 0.75) + ' ' + f1(fb - h * 0.1) +
            'C' + f1(w * 0.45) + ' ' + f1(fb + 0.4) + ' ' + f1(-w * 0.45) + ' ' + f1(fb + 0.4) + ' ' + f1(-w * 0.75) + ' ' + f1(fb - h * 0.1) +
            'C' + f1(-w * 1.05) + ' ' + f1(fb - h * 0.3) + ' ' + f1(dx * 0.6 - w * 0.55) + ' ' + f1(t + h * 0.38) + ' ' + f1(dx) + ' ' + f1(t) + 'Z';
        };
        o += '<path d="' + fl(wf, hf, 0.7) + '" style="fill:' + g.cor + '" filter="url(#' + (g.top ? T.glow2 : T.glow) + ')"/>' +
          '<path d="' + fl(wf * 0.62, hf * 0.66, 0.4) + '" style="fill:rgba(255,255,255,' + (g.top ? .85 : .55) + ')"/>' +
          '<path d="' + fl(wf * 0.34, hf * 0.34, 0.1) + '" style="fill:rgba(255,255,255,.92)"/>';
        // reflexo no vidro da frente
        o += '<line x1="-5.4" y1="22.6" x2="-5.4" y2="34" style="stroke:rgba(255,255,255,.12)" stroke-width="1"/>';
        // armação de ferro: faixas de cima e de baixo, colunas de canto e do meio; as bordas de dentro pegam a luz
        var rim = g.rgba(.1 + .55 * fe);
        o += '<rect x="-15" y="19.6" width="2.8" height="36" style="' + ir + '" stroke-width=".5"/><rect x="12.2" y="19.6" width="2.8" height="36" style="' + ir + '" stroke-width=".5"/>' +
          '<rect x="-8.2" y="19.6" width="1.4" height="36" style="fill:var(--raise)"/><rect x="6.8" y="19.6" width="1.4" height="36" style="fill:var(--raise)"/>' +
          '<path d="M-12.1 22.6V52.8M12.1 22.6V52.8M-6.7 22.6V52.8M6.7 22.6V52.8" style="fill:none;stroke:' + rim + '" stroke-width=".6"/>' +
          '<rect x="-15.4" y="19.4" width="30.8" height="3.2" rx=".6" style="' + ir + '" stroke-width=".5"/>' +
          '<rect x="-15.4" y="52.6" width="30.8" height="3.2" rx=".6" style="' + ir + '" stroke-width=".5"/>';
        // rebites
        [-11, -4, 4, 11].forEach(function (x) {
          o += '<circle cx="' + x + '" cy="21" r=".55" style="fill:rgba(var(--bone-rgb),.35)"/><circle cx="' + x + '" cy="54.2" r=".55" style="fill:rgba(var(--bone-rgb),.35)"/>';
        });
        // base: prato e um fundo raso de ferro batido
        o += '<rect x="-16.4" y="55.6" width="32.8" height="3" rx="1" style="' + ir + '" stroke-width=".7"/>' +
          '<path d="M-12.6 58.6Q0 64.6 12.6 58.6Z" style="' + ir + '" stroke-width=".6"/>' +
          '<path d="M-14.5 57.1l1.6 -.8l1.6 .8l1.6 -.8l1.6 .8l1.6 -.8l1.6 .8l1.6 -.8l1.6 .8l1.6 -.8l1.6 .8l1.6 -.8l1.6 .8l1.6 -.8l1.6 .8l1.6 -.8l1.6 .8l1.6 -.8l1.6 .8" style="fill:none;stroke:rgba(var(--bone-rgb),.18)" stroke-width=".5"/>';
        // a maior: a luz vaza também pela aba e pela base
        if (g.top) o += '<path d="M-15.4 16.9H15.4M-16.4 55.8H16.4" style="fill:none;stroke:' + g.rgba(.65) + '" stroke-width=".8"/>';
        return o + '</g>';
      },
      center: centro
    };
  })();

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.tergrid2.legenda = { peca: "lanterna", masc: false, texto: " é um agrupamento: a chama cresce com a soma das notas, e a maior arde com halo." };

  return MOTIVOS.tergrid2;
})();
