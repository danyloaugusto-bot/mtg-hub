/* Motivo "luta" do gráfico de pontuação: 04. Ken (Round Extra), escolhido pelo dono na votação de 15/10/2026.
   Veio do protótipo motivos/ken.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "luta"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Ken, Burning Brawler (Secret Lair de Street Fighter), Round Extra: o deck vive de combates extras.
     Os dois motivos usam a tela de luta: metade direita contra metade esquerda, como jogador 1 contra jogador 2. */
  (function () {
    function kIds(ctx) {
      if (!ctx.kn) ctx.kn = { chrome: ctx.uid('kc'), gloss: ctx.uid('kg'), scan: ctx.uid('ks'), glow: ctx.uid('kf'), halo: ctx.uid('kh'), hot: ctx.uid('kt'), soft: ctx.uid('kz') };
      return ctx.kn;
    }
    function kDefs(ctx) {
      var d = kIds(ctx);
      return '<linearGradient id="' + d.chrome + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--bone)"/><stop offset=".38" style="stop-color:var(--dim)"/>' +
        '<stop offset=".52" style="stop-color:rgb(var(--deep-rgb))"/><stop offset=".7" style="stop-color:var(--dim)"/><stop offset="1" style="stop-color:var(--mute)"/></linearGradient>' +
        '<linearGradient id="' + d.gloss + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:rgba(255,255,255,.55)"/><stop offset=".42" style="stop-color:rgba(255,255,255,.08)"/>' +
        '<stop offset=".55" style="stop-color:rgba(0,0,0,0)"/><stop offset="1" style="stop-color:rgba(0,0,0,.38)"/></linearGradient>' +
        '<pattern id="' + d.scan + '" width="6" height="3" patternUnits="userSpaceOnUse"><rect width="6" height="1" style="fill:rgba(255,255,255,.035)"/></pattern>' +
        '<radialGradient id="' + d.halo + '"><stop offset="0" style="stop-color:rgba(var(--blood2-rgb),.55)"/><stop offset="1" style="stop-color:rgba(var(--blood-rgb),0)"/></radialGradient>' +
        '<filter id="' + d.glow + '" x="-30%" y="-120%" width="160%" height="340%"><feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b"/>' +
        '<feFlood style="flood-color:var(--blood2)" flood-opacity=".85"/><feComposite in2="b" operator="in" result="h"/><feMerge><feMergeNode in="h"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
        '<filter id="' + d.soft + '" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="1.1"/></filter>' +
        '<filter id="' + d.hot + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    }
    function kStage(ctx) {
      var d = kIds(ctx);
      return '<circle cx="230" cy="230" r="' + (ctx.R + 10) + '" style="fill:rgba(var(--deep-rgb),.66);stroke:rgba(var(--blood-rgb),.55)" stroke-width="1.4"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 10) + '" style="fill:url(#' + d.scan + ')"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 4) + '" style="fill:none;stroke:rgba(var(--blood-rgb),.35)" stroke-width="1.6" stroke-dasharray="1 6" stroke-linecap="round"/>';
    }
    /* linha de cada agrupamento: a altura vem do ângulo; lado direito (jogador 1) ou esquerdo (jogador 2) */
    function lane(g) {
      var t = g.am * Math.PI / 180;
      return { y: CY + 124 * Math.sin(t), dy: Math.abs(124 * Math.sin(t)), side: Math.cos(t) >= -1e-6 ? 1 : -1 };
    }
    function medal(ctx) {
      return '<circle cx="230" cy="230" r="' + (ctx.r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.r0 - 9) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.22)" stroke-width=".7"/>';
    }

    /* ---------- opção 1: barras de energia ---------- */
    var L = 120;
    MOTIVOS.ken1 = {
      deck: '04. Ken', nome: 'Tela de luta',
      desc: 'Cada agrupamento é uma barra de energia de jogo de luta, com moldura de metal e dez segmentos, que enche conforme a pontuação; a metade direita e a esquerda se encaram como jogador 1 e jogador 2. A maior fica cheia, brilha e pisca "MAX"; no centro, o cronômetro do round marca infinito.',
      defs: kDefs,
      stage: kStage,
      group: function (g, ctx) {
        var d = kIds(ctx), ln = lane(g), dyE = ln.dy - 12;
        var dxs = Math.max(18, Math.sqrt(Math.max(0, 66 * 66 - dyE * dyE)));
        var x0 = CX + ln.side * dxs, fw = Math.max(2, g.frac * L);
        var trk = ctx.uid('kk'), emp = ctx.uid('ke');
        var TRK = 'M0 -8.5H' + L + 'L' + (L - 7) + ' 5.5L0 8.5Z', sw = ctx.uid('kw');
        var o = '<g transform="translate(' + f1(x0) + ' ' + f1(ln.y) + ')' + (ln.side < 0 ? ' scale(-1 1)' : '') + '">' +
          '<clipPath id="' + trk + '"><path d="' + TRK + '"/></clipPath>' +
          '<clipPath id="' + emp + '"><rect x="' + f1(fw) + '" y="-12" width="' + f1(L - fw + 8) + '" height="24"/></clipPath>';
        o += '<g' + (g.top ? ' filter="url(#' + d.glow + ')"' : '') + '>';
        // moldura de metal com ponteira angulosa voltada para o centro
        o += '<path d="M-3 -11.4H' + (L + 5.6) + 'L' + (L - 5.2) + ' 8.4L-3 11.4L-9.5 11.4L-15.5 0L-9.5 -11.4Z" style="fill:url(#' + d.chrome + ');stroke:rgba(var(--deep-rgb),.9)" stroke-width=".9" stroke-linejoin="round"/>' +
          '<path d="M-2 -10.3H' + (L + 3.4) + '" style="fill:none;stroke:rgba(255,255,255,.6)" stroke-width=".6"/>' +
          '<path d="M-10.2 0L-6.6 -5.2L-3 0L-6.6 5.2Z" style="fill:' + g.cor + ';stroke:rgba(var(--deep-rgb),.8)" stroke-width=".6"/>' +
          '<path d="M-7.8 -1.9L-6.6 -3.7L-5.6 -2.2Z" style="fill:rgba(255,255,255,.75)"/>';
        // trilho vazio, energia, segmentos
        o += '<path d="' + TRK + '" style="fill:rgba(var(--deep-rgb),.95)"/>' +
          '<g clip-path="url(#' + trk + ')">' +
          '<rect x="0" y="-9" width="' + L + '" height="18" style="fill:rgba(var(--wine-rgb),.32)"/>' +
          '<rect x="0" y="-9" width="' + f1(fw) + '" height="18" style="fill:' + g.cor + '"/>' +
          '<rect x="0" y="-9" width="' + f1(fw) + '" height="18" style="fill:url(#' + d.gloss + ')"/>';
        if (g.top) {
          // reflexo que corre a barra cheia
          o += '<linearGradient id="' + sw + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:rgba(255,255,255,0)"/><stop offset=".5" style="stop-color:rgba(255,255,255,.75)"/><stop offset="1" style="stop-color:rgba(255,255,255,0)"/></linearGradient>' +
            '<path d="M-6 -9H12L4 9H-14Z" style="fill:url(#' + sw + ')" transform="translate(' + f1(L * 0.62) + ' 0)">' +
            '<animateTransform attributeName="transform" type="translate" values="-20 0;' + (L + 20) + ' 0" dur="1.8s" repeatCount="indefinite"/></path>';
        } else o += '<rect x="' + f1(fw - 1.4) + '" y="-9" width="1.4" height="18" style="fill:rgba(255,255,255,.85)"/>';
        var tk = '';
        for (var k = 1; k < 10; k++) { var x = k * L / 10; tk += 'M' + f1(x + 5) + ' -10L' + f1(x - 5) + ' 10'; }
        o += '<path d="' + tk + '" style="fill:none;stroke:rgba(var(--deep-rgb),.7)" stroke-width="1.5"/>' +
          '<path d="' + tk + '" clip-path="url(#' + emp + ')" style="fill:none;stroke:rgba(var(--gold-rgb),.14)" stroke-width="1"/>' +
          '<path d="M0 -7.8H' + L + '" style="fill:none;stroke:rgba(0,0,0,.5)" stroke-width="1.3"/></g>' +
          '<path d="' + TRK + '" style="fill:none;stroke:rgba(var(--deep-rgb),.9)" stroke-width=".8"/>';
        o += '</g></g>';
        if (g.top) {
          var mx = CX + ln.side * (dxs + L - 4);
          o += '<text transform="translate(' + f1(mx) + ' ' + f1(ln.y - 15.5) + ') skewX(-12)" text-anchor="' + (ln.side > 0 ? 'end' : 'start') + '" ' +
            'style="font:600 17px/1 var(--fd);fill:#fff;letter-spacing:1.4px;stroke:var(--wine);stroke-width:3px;paint-order:stroke" filter="url(#' + d.glow + ')">MAX' +
            '<animate attributeName="opacity" values="1;.55;1" dur="1.1s" repeatCount="indefinite"/></text>';
        }
        return o;
      },
      center: function (ctx) {
        var d = kIds(ctx);
        return medal(ctx) + '<circle cx="230" cy="194" r="20" style="fill:url(#' + d.halo + ')"/>' +
          '<g transform="translate(230 194)">' +
          '<path d="M-14 -9.5H14L19 0L14 9.5H-14L-19 0Z" style="fill:rgba(var(--deep-rgb),.92);stroke:url(#' + d.chrome + ')" stroke-width="2"/>' +
          '<path d="M-13 -7.8H13" style="fill:none;stroke:rgba(255,255,255,.18)" stroke-width=".8"/>' +
          '<path d="M0 0C3 -5.2 9.4 -5.2 9.4 0C9.4 5.2 3 5.2 0 0C-3 -5.2 -9.4 -5.2 -9.4 0C-9.4 5.2 -3 5.2 0 0Z" style="fill:none;stroke:var(--gold2)" stroke-width="2.2" stroke-linejoin="round" filter="url(#' + d.hot + ')"/></g>';
      }
    };

    /* ---------- opção 2: hadoukens ---------- */
    function burst(n, ro, ri, rot) {
      var p = [];
      for (var k = 0; k < 2 * n; k++) {
        var a = (rot + k * 180 / n) * Math.PI / 180, r = k % 2 ? ri : ro * (k % 4 === 0 ? 1 : 0.84);
        p.push(f1(r * Math.cos(a)) + ' ' + f1(r * Math.sin(a)));
      }
      return 'M' + p.join('L') + 'Z';
    }
  })();

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.ken1.legenda = { peca: "barra", masc: false, texto: " é um agrupamento: enche em proporção à soma das notas, e a mais cheia chega ao MAX." };

  return MOTIVOS.ken1;
})();
