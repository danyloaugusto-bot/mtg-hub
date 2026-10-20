/* Motivo "luta" do gráfico de pontuação: 04. Ken, rebranding, lote 3, acabamento aprovado pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "luta"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "luta" do gráfico de pontuação: 04. Ken (Round Extra), escolhido pelo dono na votação de 15/10/2026.
   O build inclui este arquivo apenas no painel cujo tema.json tem "grafico": "luta"; o motivoSvg do app.js monta a moldura
   (rótulos, placar, clique em cada critério). Viewbox -58 -2 576 464, centro 230,230, raio interno 60, externo 184.
   Rebranding, lote 3, variação K: o mesmo desenho (barras de energia de jogo de luta, metade direita contra metade esquerda
   como jogador 1 contra jogador 2, cronômetro do round marcando infinito) com o kit de luz:
   - corpo da energia na cor do critério, com profundidade (claro em cima, escuro embaixo) e textura sutil;
   - núcleo: um filete quase branco correndo dentro da energia, e a frente da barra em brasa branca;
   - brilho difuso na cor do critério vazando pela moldura (ctx.k.brilho), mais forte nas cheias (MAX);
   - moldura de metal com textura e fio de luz; arena com profundidade (centro mais claro, borda no escuro).
   Animação (reflexo que corre a barra cheia e o MAX piscando) agora em CSS, desligada com prefers-reduced-motion.
   Regra C: o comprimento da energia é linear em g.frac, com mínimo de 12% (ctx.kit.comp). */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, L = 120, d;
  function f1(n) { return (+n).toFixed(1); }
  /* linha de cada critério: a altura vem do ângulo; lado direito (jogador 1) ou esquerdo (jogador 2) */
  function lane(g) {
    var t = g.am * Math.PI / 180;
    return { y: CY + 124 * Math.sin(t), dy: Math.abs(124 * Math.sin(t)), side: Math.cos(t) >= -1e-6 ? 1 : -1 };
  }
  return {
    legenda: { peca: "barra", masc: false, texto: " é um critério: enche em proporção à soma das notas, e a cheia chega ao MAX." },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'kn');
      d = { chrome: ctx.uid('kc'), body: ctx.uid('kb'), scan: ctx.uid('ks'), glow: ctx.uid('kf'), halo: ctx.uid('kh'), arena: ctx.uid('ka'), vin: ctx.uid('kv'),
        sw: ctx.uid('kw'), anS: ctx.uid('kS'), anM: ctx.uid('kM'), med: ctx.uid('kd') };
      return o +
        '<linearGradient id="' + d.chrome + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--bone)"/><stop offset=".3" style="stop-color:var(--dim)"/>' +
        '<stop offset=".52" stop-color="#0c0806"/><stop offset=".72" style="stop-color:var(--dim)"/><stop offset="1" style="stop-color:var(--mute)"/></linearGradient>' +
        /* profundidade da energia: luz por cima, sombra por baixo (sobre a cor do critério) */
        '<linearGradient id="' + d.body + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".3" stop-color="#fff" stop-opacity=".06"/>' +
        '<stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>' +
        '<linearGradient id="' + d.sw + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<pattern id="' + d.scan + '" width="6" height="3" patternUnits="userSpaceOnUse"><rect width="6" height="1" style="fill:rgba(255,255,255,.03)"/></pattern>' +
        '<radialGradient id="' + d.arena + '" cx="230" cy="230" r="194" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:rgba(var(--wine-rgb),.4)"/>' +
        '<stop offset=".5" style="stop-color:rgba(var(--deep-rgb),.8)"/><stop offset="1" stop-color="#070403"/></radialGradient>' +
        '<radialGradient id="' + d.vin + '" cx="230" cy="230" r="194" gradientUnits="userSpaceOnUse"><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>' +
        '<radialGradient id="' + d.halo + '"><stop offset="0" style="stop-color:rgba(var(--blood2-rgb),.6)"/><stop offset="1" style="stop-color:rgba(var(--blood-rgb),0)"/></radialGradient>' +
        '<radialGradient id="' + d.med + '" cx="230" cy="206" r="60" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:var(--raise)"/><stop offset=".6" style="stop-color:var(--sheet2)"/><stop offset="1" stop-color="#0a0605"/></radialGradient>' +
        '<filter id="' + d.glow + '" x="-30%" y="-120%" width="160%" height="340%"><feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b"/>' +
        '<feFlood style="flood-color:var(--blood2)" flood-opacity=".85"/><feComposite in2="b" operator="in" result="h"/><feMerge><feMergeNode in="h"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
        '<style>@media (prefers-reduced-motion:no-preference){.' + d.anS + '{animation:' + d.anS + ' 1.8s linear infinite}.' + d.anM + '{animation:' + d.anM + ' 1.1s ease-in-out infinite}}' +
        '@keyframes ' + d.anS + '{from{transform:translate(-20px,0)}to{transform:translate(' + (L + 20) + 'px,0)}}@keyframes ' + d.anM + '{0%,100%{opacity:1}50%{opacity:.55}}</style>';
    },
    stage: function (ctx) {
      return '<circle cx="230" cy="230" r="' + (ctx.R + 10) + '" style="fill:url(#' + d.arena + ')"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 10) + '" style="fill:url(#' + d.scan + ')"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 10) + '" style="fill:url(#' + d.vin + ');stroke:rgba(var(--blood-rgb),.55)" stroke-width="1.4"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 4) + '" style="fill:none;stroke:rgba(var(--blood-rgb),.35)" stroke-width="1.6" stroke-dasharray="1 6" stroke-linecap="round"/>';
    },
    group: function (g, ctx) {
      var K = ctx.kit, ln = lane(g), dyE = ln.dy - 12;
      var dxs = Math.max(18, Math.sqrt(Math.max(0, 66 * 66 - dyE * dyE)));
      var x0 = CX + ln.side * dxs, fr = K.comp(g.frac), fw = fr * L, cheia = g.frac >= 0.999;
      var trk = ctx.uid('kk'), emp = ctx.uid('ke');
      var TRK = 'M0 -8.5H' + L + 'L' + (L - 7) + ' 5.5L0 8.5Z';
      var o = '<g transform="translate(' + f1(x0) + ' ' + f1(ln.y) + ')' + (ln.side < 0 ? ' scale(-1 1)' : '') + '">' +
        '<clipPath id="' + trk + '"><path d="' + TRK + '"/></clipPath>' +
        '<clipPath id="' + emp + '"><rect x="' + f1(fw) + '" y="-12" width="' + f1(L - fw + 8) + '" height="24"/></clipPath>';
      /* brilho difuso da energia, por trás da moldura: vaza pelas bordas do metal */
      o += '<g style="mix-blend-mode:screen"><path d="M2 0H' + f1(Math.max(4, fw - 2)) + '" style="fill:none;stroke:' + g.cor + '" stroke-width="' + (cheia ? 26 : 20) + '" stroke-linecap="round" filter="url(#' + ctx.k.brilho + ')" opacity="' + (cheia ? .85 : .3 + .45 * fr) + '"/></g>';
      o += '<g' + (cheia ? ' filter="url(#' + d.glow + ')"' : '') + '>';
      /* moldura de metal com ponteira angulosa voltada para o centro */
      o += '<path d="M-3 -11.4H' + (L + 5.6) + 'L' + (L - 5.2) + ' 8.4L-3 11.4L-9.5 11.4L-15.5 0L-9.5 -11.4Z" style="fill:url(#' + d.chrome + ');stroke:rgba(0,0,0,.85)" stroke-width=".9" stroke-linejoin="round" filter="url(#' + ctx.k.textura + ')"/>' +
        '<path d="M-2 -10.3H' + (L + 3.4) + '" style="fill:none;stroke:rgba(255,255,255,.65)" stroke-width=".6"/>' +
        '<path d="M-10.2 0L-6.6 -5.2L-3 0L-6.6 5.2Z" style="fill:' + g.cor + ';stroke:rgba(0,0,0,.8)" stroke-width=".6"/>' +
        '<path d="M-7.8 -1.9L-6.6 -3.7L-5.6 -2.2Z" fill="#fff" opacity=".85"/>';
      /* trilho vazio (escuro, com um resto de cor), energia em camadas: corpo, profundidade, núcleo */
      o += '<path d="' + TRK + '" fill="#090605"/>' +
        '<g clip-path="url(#' + trk + ')">' +
        '<rect x="0" y="-9" width="' + L + '" height="18" style="fill:' + g.rgba(.1) + '"/>' +
        '<rect x="0" y="-9" width="' + L + '" height="18" style="fill:rgba(var(--wine-rgb),.22)"/>' +
        '<rect x="0" y="-9" width="' + f1(fw) + '" height="18" style="fill:' + g.cor + '" filter="url(#' + ctx.k.textura + ')"/>' +
        '<rect x="0" y="-9" width="' + f1(fw) + '" height="18" style="fill:url(#' + d.body + ')"/>' +
        '<g style="mix-blend-mode:screen"><rect x="0" y="-4.6" width="' + f1(fw) + '" height="3.4" fill="#fff" opacity=".45" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<rect x="0" y="-3.6" width="' + f1(fw) + '" height="1.3" fill="#fff" opacity=".75"/></g>';
      if (cheia) {
        /* reflexo que corre a barra cheia (parado em 62% com movimento reduzido) */
        o += '<g transform="translate(' + f1(L * 0.62) + ' 0)"><path class="' + d.anS + '" d="M-6 -9H12L4 9H-14Z" style="fill:url(#' + d.sw + ')"/></g>';
      } else {
        /* a frente da energia em brasa: núcleo branco com brilho na cor */
        o += '<g style="mix-blend-mode:screen"><rect x="' + f1(fw - 4) + '" y="-9" width="5" height="18" style="fill:' + g.cor + '" filter="url(#' + ctx.k.brilho2 + ')"/></g>' +
          '<rect x="' + f1(fw - 1.6) + '" y="-9" width="1.6" height="18" fill="#fff" opacity=".95"/>';
      }
      var tk = '';
      for (var k = 1; k < 10; k++) { var x = k * L / 10; tk += 'M' + f1(x + 5) + ' -10L' + f1(x - 5) + ' 10'; }
      o += '<path d="' + tk + '" style="fill:none;stroke:rgba(0,0,0,.6)" stroke-width="1.5"/>' +
        '<path d="' + tk + '" clip-path="url(#' + emp + ')" style="fill:none;stroke:rgba(var(--gold-rgb),.12)" stroke-width="1"/>' +
        '<path d="M0 -7.8H' + L + '" style="fill:none;stroke:rgba(0,0,0,.45)" stroke-width="1.3"/></g>' +
        '<path d="' + TRK + '" style="fill:none;stroke:rgba(0,0,0,.9)" stroke-width=".8"/>';
      o += '</g></g>';
      if (cheia) {
        var mx = CX + ln.side * (dxs + L - 4);
        o += '<text class="' + d.anM + '" transform="translate(' + f1(mx) + ' ' + f1(ln.y - 15.5) + ') skewX(-12)" text-anchor="' + (ln.side > 0 ? 'end' : 'start') + '" ' +
          'style="font:800 22px/1 var(--fb);fill:#fff;letter-spacing:1.4px;stroke:var(--wine);stroke-width:3px;paint-order:stroke" filter="url(#' + d.glow + ')">MAX</text>';
      }
      return o;
    },
    /* medalhão com o cronômetro do round marcando infinito, aceso */
    center: function (ctx) {
      return '<circle cx="230" cy="230" r="' + (ctx.r0 - 5) + '" style="fill:url(#' + d.med + ');stroke:var(--gold)" stroke-width="1.6"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.r0 - 9) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.22)" stroke-width=".7"/>' +
        '<g style="mix-blend-mode:screen"><circle cx="230" cy="194" r="22" style="fill:url(#' + d.halo + ')"/></g>' +
        '<g transform="translate(230 194)">' +
        '<path d="M-14 -9.5H14L19 0L14 9.5H-14L-19 0Z" fill="#0a0605" style="stroke:url(#' + d.chrome + ')" stroke-width="2"/>' +
        '<path d="M-13 -7.8H13" style="fill:none;stroke:rgba(255,255,255,.2)" stroke-width=".8"/>' +
        '<path d="M0 0C3 -5.2 9.4 -5.2 9.4 0C9.4 5.2 3 5.2 0 0C-3 -5.2 -9.4 -5.2 -9.4 0C-9.4 5.2 -3 5.2 0 0Z" style="fill:none;stroke:var(--gold2)" stroke-width="4" stroke-linejoin="round" filter="url(#' + ctx.k.brilho2 + ')" opacity=".9"/>' +
        '<path d="M0 0C3 -5.2 9.4 -5.2 9.4 0C9.4 5.2 3 5.2 0 0C-3 -5.2 -9.4 -5.2 -9.4 0C-9.4 5.2 -3 5.2 0 0Z" style="fill:none;stroke:var(--gold2)" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M0 0C3 -5.2 9.4 -5.2 9.4 0C9.4 5.2 3 5.2 0 0C-3 -5.2 -9.4 -5.2 -9.4 0C-9.4 5.2 -3 5.2 0 0Z" fill="none" stroke="#fff" stroke-width=".7" opacity=".8"/></g>';
    }
  };
})();
