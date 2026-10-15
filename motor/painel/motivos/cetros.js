/* Motivo "cetros" do gráfico de pontuação: 04. Queen (Trono Inabalável), escolhido pelo dono na votação de 15/10/2026.
   Veio do protótipo motivos/queen.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "cetros"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Queen Marchesa, Trono Inabalável: o Monarca. A ficha oficial do Monarca é uma coroa dourada em cúpula,
     com painéis de veludo e uma gema verde na frente, pousada numa almofada vermelha. */
  (function () {
    function T(x, y, s) { return 'translate(' + f1(x) + ' ' + f1(y) + ')' + (s && s !== 1 ? ' scale(' + s + ')' : ''); }
    function star4(x, y, s, cor, op) {
      var k = s * 0.2;
      return '<path d="M' + f1(x) + ' ' + f1(y - s) + 'L' + f1(x + k) + ' ' + f1(y - k) + 'L' + f1(x + s) + ' ' + f1(y) + 'L' + f1(x + k) + ' ' + f1(y + k) +
        'L' + f1(x) + ' ' + f1(y + s) + 'L' + f1(x - k) + ' ' + f1(y + k) + 'L' + f1(x - s) + ' ' + f1(y) + 'L' + f1(x - k) + ' ' + f1(y - k) + 'Z" style="fill:' + cor + '"' + (op ? ' opacity="' + op + '"' : '') + '/>';
    }

    /* ids das definições: um jogo por gráfico, para dois painéis na mesma página não se cruzarem */
    function qIds(ctx) {
      if (!ctx.qn) ctx.qn = { gold: ctx.uid('qg'), goldR: ctx.uid('qgr'), velv: ctx.uid('qv'), shine: ctx.uid('qs'), gem: ctx.uid('qe'), ruby: ctx.uid('qr'),
        cush: ctx.uid('qc'), glow: ctx.uid('qf'), halo: ctx.uid('qh'), tube: ctx.uid('qt'), sat: ctx.uid('qa') };
      return ctx.qn;
    }
    function qDefs(ctx) {
      var d = qIds(ctx);
      return '<linearGradient id="' + d.gold + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--gold2)"/><stop offset=".42" style="stop-color:var(--gold)"/><stop offset="1" style="stop-color:#6b4e1f"/></linearGradient>' +
        '<radialGradient id="' + d.goldR + '" cx=".38" cy=".32" r=".7"><stop offset="0" style="stop-color:var(--gold2)"/><stop offset=".5" style="stop-color:var(--gold)"/><stop offset="1" style="stop-color:#5e4419"/></radialGradient>' +
        '<linearGradient id="' + d.velv + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:rgba(0,0,0,.62)"/><stop offset=".28" style="stop-color:rgba(0,0,0,.22)"/>' +
        '<stop offset=".5" style="stop-color:rgba(0,0,0,.08)"/><stop offset=".72" style="stop-color:rgba(0,0,0,.22)"/><stop offset="1" style="stop-color:rgba(0,0,0,.62)"/></linearGradient>' +
        '<radialGradient id="' + d.shine + '" cx=".36" cy=".2" r=".55"><stop offset="0" style="stop-color:rgba(255,255,255,.34)"/><stop offset="1" style="stop-color:rgba(255,255,255,0)"/></radialGradient>' +
        '<radialGradient id="' + d.gem + '" cx=".4" cy=".32" r=".75"><stop offset="0" style="stop-color:#d9ffe6"/><stop offset=".3" style="stop-color:#4fd28a"/><stop offset=".75" style="stop-color:#16804a"/><stop offset="1" style="stop-color:#073a20"/></radialGradient>' +
        '<radialGradient id="' + d.ruby + '" cx=".4" cy=".32" r=".75"><stop offset="0" style="stop-color:#ffd0d8"/><stop offset=".35" style="stop-color:var(--blood2)"/><stop offset="1" style="stop-color:var(--wine)"/></radialGradient>' +
        '<radialGradient id="' + d.cush + '" cx=".45" cy=".22" r=".85"><stop offset="0" style="stop-color:#d8394f"/><stop offset=".45" style="stop-color:var(--blood)"/><stop offset="1" style="stop-color:var(--wine)"/></radialGradient>' +
        '<radialGradient id="' + d.halo + '"><stop offset="0" style="stop-color:rgba(var(--gold2-rgb),.5)"/><stop offset=".55" style="stop-color:rgba(var(--gold-rgb),.16)"/><stop offset="1" style="stop-color:rgba(var(--gold-rgb),0)"/></radialGradient>' +
        '<linearGradient id="' + d.tube + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:rgba(0,0,0,.5)"/><stop offset=".32" style="stop-color:rgba(255,255,255,.28)"/>' +
        '<stop offset=".5" style="stop-color:rgba(255,255,255,.08)"/><stop offset="1" style="stop-color:rgba(0,0,0,.55)"/></linearGradient>' +
        '<filter id="' + d.sat + '"><feColorMatrix type="saturate" values="1.45"/></filter>' +
        '<filter id="' + d.glow + '" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur in="SourceAlpha" stdDeviation="4.5" result="b"/>' +
        '<feFlood style="flood-color:var(--gold2)" flood-opacity=".6"/><feComposite in2="b" operator="in" result="h"/><feMerge><feMergeNode in="h"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    }
    function qStage(ctx) {
      return '<circle cx="230" cy="230" r="' + (ctx.R + 10) + '" style="fill:rgba(var(--deep-rgb),.62);stroke:rgba(var(--gold-rgb),.5)" stroke-width="1.3"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.R + 4) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.3)" stroke-width="1.6" stroke-dasharray="1 6" stroke-linecap="round"/>';
    }

    /* ---------- a coroa do Monarca (origem na base da faixa, no meio; ~48 de largura, ~64 de altura) ---------- */
    var BODY = 'M-24 -14C-26 -30 -14 -42 0 -43C14 -42 26 -30 24 -14L24 -2Q0 4 -24 -2Z';
    var DOME = 'M-24 -14C-26 -30 -14 -42 0 -43C14 -42 26 -30 24 -14Q0 -8 -24 -14Z';
    var BAND = 'M-24 -14Q0 -8 24 -14L24 -2Q0 4 -24 -2Z';
    var ARCH = ['M-24 -14C-26 -30 -14 -42 0 -43', 'M24 -14C26 -30 14 -42 0 -43', 'M-12 -11.8C-14.5 -27 -9 -39.5 0 -43', 'M12 -11.8C14.5 -27 9 -39.5 0 -43', 'M0 -11V-43'];
    var CROSS = 'M0 -50.6V-60M-3.7 -56.3H3.7';
    function bandTop(x) { var t = (x + 24) / 48; return -14 + 12 * t * (1 - t); }

    function crownParts(d, cor, dc) {
      var o = '<clipPath id="' + dc + '"><path d="' + DOME + '"/></clipPath><g filter="url(#' + d.sat + ')"><path d="' + DOME + '" style="fill:' + cor + '"/>' +
        '<path d="' + DOME + '" style="fill:url(#' + d.velv + ')"/>' +
        '<path d="' + DOME + '" style="fill:url(#' + d.shine + ')"/>' +
        '<g clip-path="url(#' + dc + ')"><path d="' + ARCH.join('') + '" style="fill:none;stroke:rgba(0,0,0,.2)" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M-24 -14Q0 -8 24 -14" style="fill:none;stroke:rgba(0,0,0,.3)" stroke-width="5"/></g></g>';
      ARCH.forEach(function (a) { o += '<path d="' + a + '" style="fill:none;stroke:rgba(var(--deep-rgb),.6)" stroke-width="4.6" stroke-linecap="round"/>'; });
      ARCH.forEach(function (a) { o += '<path d="' + a + '" style="fill:none;stroke:var(--gold)" stroke-width="3" stroke-linecap="round"/>'; });
      ARCH.forEach(function (a) { o += '<path d="' + a + '" style="fill:none;stroke:var(--gold2)" stroke-width="1" stroke-linecap="round" opacity=".75"/>'; });
      for (var py = -17; py >= -38; py -= 5.2) o += '<circle cx="0" cy="' + f1(py) + '" r="1.15" style="fill:var(--bone);stroke:rgba(var(--deep-rgb),.4)" stroke-width=".4"/>';
      // florões na borda da faixa, entre os arcos
      [-18, -6, 6, 18].forEach(function (x) {
        var y0 = bandTop(x) + 0.6;
        o += '<path d="M' + f1(x - 2.6) + ' ' + f1(y0) + 'L' + f1(x) + ' ' + f1(y0 - 6.2) + 'L' + f1(x + 2.6) + ' ' + f1(y0) + 'Z" style="fill:url(#' + d.gold + ');stroke:rgba(var(--deep-rgb),.55)" stroke-width=".5"/>' +
          '<circle cx="' + f1(x) + '" cy="' + f1(y0 - 7) + '" r="1.35" style="fill:var(--bone);stroke:rgba(var(--deep-rgb),.45)" stroke-width=".4"/>';
      });
      // faixa
      o += '<path d="' + BAND + '" style="fill:url(#' + d.gold + ');stroke:rgba(var(--deep-rgb),.65)" stroke-width=".8"/>' +
        '<path d="M-23.4 -11.7Q0 -5.7 23.4 -11.7M-23.4 -4.2Q0 1.8 23.4 -4.2" style="fill:none;stroke:rgba(var(--deep-rgb),.35)" stroke-width=".6"/>' +
        '<path d="M-23.4 -12.9Q0 -6.9 23.4 -12.9" style="fill:none;stroke:rgba(255,255,255,.35)" stroke-width=".6"/>';
      // gemas: esmeralda no centro, rubis dos lados, pérolas nas pontas
      o += '<ellipse cx="0" cy="-5.2" rx="4.4" ry="5.2" style="fill:var(--gold2);stroke:rgba(var(--deep-rgb),.6)" stroke-width=".6"/>' +
        '<ellipse cx="0" cy="-5.2" rx="3.4" ry="4.2" style="fill:url(#' + d.gem + ')"/>' +
        '<ellipse cx="-1.1" cy="-7" rx="1" ry="1.3" style="fill:rgba(255,255,255,.75)"/>';
      [-13, 13].forEach(function (x) {
        o += '<circle cx="' + x + '" cy="-5.8" r="2.5" style="fill:var(--gold2);stroke:rgba(var(--deep-rgb),.55)" stroke-width=".5"/><circle cx="' + x + '" cy="-5.8" r="1.8" style="fill:url(#' + d.ruby + ')"/>' +
          '<circle cx="' + f1(x - 0.6) + '" cy="-6.5" r=".55" style="fill:rgba(255,255,255,.8)"/>';
      });
      [-20, 20].forEach(function (x) { o += '<circle cx="' + x + '" cy="-7" r="1.3" style="fill:var(--bone);stroke:rgba(var(--deep-rgb),.45)" stroke-width=".4"/>'; });
      // orbe e cruz
      o += '<circle cx="0" cy="-47" r="4.2" style="fill:url(#' + d.goldR + ');stroke:rgba(var(--deep-rgb),.6)" stroke-width=".6"/>' +
        '<path d="M-4.1 -47H4.1" style="fill:none;stroke:rgba(var(--deep-rgb),.45)" stroke-width=".6"/>' +
        '<path d="' + CROSS + '" style="fill:none;stroke:rgba(var(--deep-rgb),.6)" stroke-width="3.4" stroke-linecap="round"/>' +
        '<path d="' + CROSS + '" style="fill:none;stroke:var(--gold)" stroke-width="2.1" stroke-linecap="round"/>' +
        '<path d="M0 -51V-59.6" style="fill:none;stroke:var(--gold2)" stroke-width=".7" stroke-linecap="round"/>';
      return o;
    }

    function cushion(d) {
      var o = '<path d="M-34 -3Q0 -11 34 -3Q39 5 31 13Q0 21 -31 13Q-39 5 -34 -3Z" style="fill:url(#' + d.cush + ');stroke:rgba(var(--gold-rgb),.65)" stroke-width=".8"/>' +
        '<path d="M-29 -1Q0 -8 29 -1Q33 5 27 10.5Q0 17.5 -27 10.5Q-33 5 -29 -1Z" style="fill:none;stroke:rgba(var(--gold2-rgb),.4)" stroke-width=".6" stroke-dasharray="1.6 1.6"/>' +
        '<ellipse cx="-6" cy="-3.5" rx="20" ry="3" style="fill:rgba(255,255,255,.12)"/>';
      // borlas nos quatro cantos
      [[-34, -3, -1], [34, -3, 1], [-31, 13, -1], [31, 13, 1]].forEach(function (c) {
        var x = c[0], y = c[1], s = c[2];
        o += '<path d="M' + f1(x - 1.4) + ' ' + f1(y + 1) + 'L' + f1(x + 1.4) + ' ' + f1(y + 1) + 'L' + f1(x + 2.4 + s * 1.2) + ' ' + f1(y + 8.5) + 'L' + f1(x - 2.4 + s * 1.2) + ' ' + f1(y + 8.5) + 'Z" style="fill:url(#' + d.gold + ');stroke:rgba(var(--deep-rgb),.5)" stroke-width=".5"/>' +
          '<path d="M' + f1(x + s * 0.4) + ' ' + f1(y + 2.5) + 'L' + f1(x + s * 1.1) + ' ' + f1(y + 8) + '" style="stroke:rgba(var(--deep-rgb),.35)" stroke-width=".5"/>' +
          '<circle cx="' + x + '" cy="' + y + '" r="2" style="fill:url(#' + d.goldR + ');stroke:rgba(var(--deep-rgb),.5)" stroke-width=".5"/>';
      });
      return o;
    }

    /* coroa inteira com estado: frac enche de ouro da base até a cruz; acima do nível fica a silhueta tracejada */
    function crown(ctx, d, x, y, s, frac, cor, top, ghost) {
      var sil = ctx.uid('qm'), cut = ctx.uid('qk'), up = ctx.uid('qu');
      var H0 = 4.5, H1 = -61, f = Math.max(0.04, Math.min(1, frac)), lvl = H0 - (H0 - H1) * f;
      var o = '<g transform="' + T(x, y, s) + '">' +
        '<clipPath id="' + sil + '"><path d="' + BODY + '"/><circle cx="0" cy="-47" r="4.4"/><rect x="-1.7" y="-61" width="3.4" height="11"/><rect x="-4.6" y="-58" width="9.2" height="3.4"/></clipPath>' +
        '<clipPath id="' + cut + '"><rect x="-44" y="' + f1(lvl) + '" width="88" height="' + f1(H0 - lvl + 8) + '"/></clipPath>' +
        '<clipPath id="' + up + '"><rect x="-44" y="-70" width="88" height="' + f1(lvl + 70) + '"/></clipPath>';
      if (top) o += cushion(d) + '<ellipse cx="0" cy="2.5" rx="25" ry="3.4" style="fill:rgba(0,0,0,.35)"/>';
      else if (ghost) o += '<ellipse cx="0" cy="4" rx="27" ry="4" style="fill:rgba(0,0,0,.45)"/>';
      if (ghost && f < 1) {
        o += '<g clip-path="url(#' + up + ')">' +
          '<path d="' + BODY + '" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.5)" stroke-width="1" stroke-dasharray="2.6 2.2"/>' +
          '<path d="' + ARCH.slice(2).join('') + '" style="fill:none;stroke:rgba(var(--gold-rgb),.17)" stroke-width="2.4" stroke-linecap="round"/>' +
          '<circle cx="0" cy="-47" r="4.2" style="fill:rgba(var(--deep-rgb),.55);stroke:rgba(var(--gold-rgb),.5)" stroke-width="1" stroke-dasharray="2 1.8"/>' +
          '<path d="' + CROSS + '" style="fill:none;stroke:rgba(var(--gold-rgb),.45)" stroke-width="1.4" stroke-dasharray="2 1.6"/></g>';
      }
      o += '<g' + (top ? ' filter="url(#' + d.glow + ')"' : '') + '><g clip-path="url(#' + cut + ')">' + crownParts(d, cor, ctx.uid('qd')) + '</g></g>';
      if (ghost && f < 1) {
        o += '<g clip-path="url(#' + sil + ')"><rect x="-30" y="' + f1(lvl - 2) + '" width="60" height="4" style="fill:rgba(var(--gold2-rgb),.22)"/>' +
          '<rect x="-30" y="' + f1(lvl - 0.6) + '" width="60" height="1.2" style="fill:var(--gold2)" opacity=".9"/></g>';
      }
      if (top) o += star4(-12, -55, 4.2, 'var(--gold2)', '.95') + star4(13, -49, 2.8, 'var(--gold2)', '.8') + star4(-17, -41, 2, 'var(--bone)', '.7');
      return o + '</g>';
    }

    function medal(ctx) {
      return '<circle cx="230" cy="230" r="' + (ctx.r0 - 5) + '" style="fill:var(--sheet2);stroke:var(--gold)" stroke-width="1.6"/>' +
        '<circle cx="230" cy="230" r="' + (ctx.r0 - 9) + '" style="fill:none;stroke:rgba(var(--gold-rgb),.25)" stroke-width=".7"/>';
    }

    /* opção 1: uma coroa do Monarca por agrupamento, de pé; o ouro sobe da faixa até a cruz conforme a pontuação. */

    /* ---------- opção 2: cetros ---------- */
    function crownGlyph(x, y, s, d) {
      var p = 'M-11 4L-12 -6.5L-5.6 -1L0 -9.5L5.6 -1L12 -6.5L11 4Z';
      return '<g transform="' + T(x, y, s) + '">' +
        '<path d="' + p + '" style="fill:url(#' + d.gold + ');stroke:rgba(var(--deep-rgb),.6)" stroke-width=".7" stroke-linejoin="round"/>' +
        '<rect x="-11.4" y="2" width="22.8" height="4" rx="1" style="fill:url(#' + d.gold + ');stroke:rgba(var(--deep-rgb),.6)" stroke-width=".6"/>' +
        '<circle cx="-12" cy="-7.4" r="1.5" style="fill:var(--bone)"/><circle cx="0" cy="-10.6" r="1.7" style="fill:var(--bone)"/><circle cx="12" cy="-7.4" r="1.5" style="fill:var(--bone)"/>' +
        '<circle cx="0" cy="-1.6" r="1.9" style="fill:url(#' + d.ruby + ')"/></g>';
    }
    function gem(cx, r, g, gid) {
      var o = '<circle cx="' + f1(cx) + '" cy="0" r="' + f1(r + 0.9) + '" style="fill:var(--gold);stroke:rgba(var(--deep-rgb),.6)" stroke-width=".5"/>' +
        '<circle cx="' + f1(cx) + '" cy="0" r="' + f1(r) + '" style="fill:url(#' + gid + ')"/>';
      var pts = [], rin = r * 0.5;
      for (var k = 0; k < 8; k++) {
        var a = (k * 45 + 22.5) * Math.PI / 180;
        pts.push([cx + rin * Math.cos(a), rin * Math.sin(a), cx + r * Math.cos(a), r * Math.sin(a)]);
      }
      o += '<path d="M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') + 'Z' +
        pts.map(function (p) { return 'M' + f1(p[0]) + ' ' + f1(p[1]) + 'L' + f1(p[2]) + ' ' + f1(p[3]); }).join('') + '" style="fill:none;stroke:rgba(255,255,255,.35)" stroke-width=".45"/>' +
        '<ellipse cx="' + f1(cx - r * 0.3) + '" cy="' + f1(-r * 0.32) + '" rx="' + f1(r * 0.28) + '" ry="' + f1(r * 0.2) + '" style="fill:rgba(255,255,255,.7)"/>';
      return o;
    }

    MOTIVOS.queen2 = {
      deck: '04. Queen', nome: 'Cetros',
      desc: 'Cada agrupamento é um cetro real deitado num sulco que vai do medalhão até a borda: o comprimento do cetro acompanha a pontuação, e a joia da ponta tem a cor do agrupamento. O cetro mais longo tem a joia acesa; no centro, uma coroa simples.',
      defs: qDefs,
      stage: qStage,
      group: function (g, ctx) {
        var d = qIds(ctx), rb = 60, TM = 126, L = Math.max(33.5, g.frac * TM), p = ctx.pol(rb, g.am);
        var gid = ctx.uid('qj'), sh = ctx.uid('qx'), hl = ctx.uid('qz');
        var gr = g.top ? 8.4 : 7.2, s0 = 11.6, s1 = Math.max(s0, L - 20.5), gc = s1 + 12.5, hw = 3.1;
        var o = '<radialGradient id="' + gid + '" cx=".36" cy=".32" r=".78"><stop offset="0" style="stop-color:#fff"/><stop offset=".22" style="stop-color:' + g.rgba(1) + '"/>' +
          '<stop offset=".78" style="stop-color:' + g.cor + '"/><stop offset="1" style="stop-color:rgba(var(--deep-rgb),1)"/></radialGradient>' +
          '<g transform="translate(' + f1(p[0]) + ' ' + f1(p[1]) + ') rotate(' + f1(g.am) + ')">';
        // sulco com a medida cheia e marcas a cada quarto
        o += '<path d="M3 0H' + TM + '" style="fill:none;stroke:rgba(var(--deep-rgb),.5)" stroke-width="10" stroke-linecap="round"/>' +
          '<path d="M3 0H' + TM + '" style="fill:none;stroke:rgba(var(--wine-rgb),.22)" stroke-width="7" stroke-linecap="round"/><path d="';
        for (var q = 1; q <= 3; q++) o += 'M' + f1(TM * q / 4) + ' -4V4';
        o += '" style="fill:none;stroke:rgba(var(--gold-rgb),.2)" stroke-width=".7"/>' +
          '<path d="M' + TM + ' -5.5V5.5" style="fill:none;stroke:rgba(var(--gold-rgb),.45)" stroke-width="1" stroke-linecap="round"/>';
        // brilho da joia acesa (atrás)
        if (g.top) {
          o += '<radialGradient id="' + hl + '"><stop offset="0" style="stop-color:' + g.rgba(.8) + '"/><stop offset=".45" style="stop-color:' + g.rgba(.25) + '"/><stop offset="1" style="stop-color:' + g.rgba(0) + '"/></radialGradient>' +
            '<circle cx="' + f1(gc) + '" cy="0" r="17" style="fill:url(#' + hl + ')"/>';
        }
        // pomo e colar da base
        o += '<circle cx="4.4" cy="0" r="4.4" style="fill:url(#' + d.goldR + ');stroke:rgba(var(--deep-rgb),.6)" stroke-width=".6"/>' +
          '<rect x="8.2" y="-2.4" width="1.8" height="4.8" style="fill:url(#' + d.gold + ')"/>' +
          '<rect x="9.4" y="-4.6" width="2.6" height="9.2" rx=".9" style="fill:url(#' + d.gold + ');stroke:rgba(var(--deep-rgb),.6)" stroke-width=".5"/>';
        // haste esmaltada na cor do agrupamento, com fio de ouro em espiral e nós dourados
        if (s1 > s0 + 0.5) {
          var w = s1 - s0;
          o += '<clipPath id="' + sh + '"><rect x="' + s0 + '" y="' + (-hw) + '" width="' + f1(w) + '" height="' + (2 * hw) + '"/></clipPath>' +
            '<rect x="' + s0 + '" y="' + (-hw) + '" width="' + f1(w) + '" height="' + (2 * hw) + '" style="fill:' + g.cor + ';stroke:rgba(var(--deep-rgb),.6)" stroke-width=".5"/>' +
            '<g clip-path="url(#' + sh + ')"><rect x="' + s0 + '" y="' + (-hw) + '" width="' + f1(w) + '" height="' + (2 * hw) + '" style="fill:url(#' + d.tube + ')"/><path d="';
          for (var u = s0 - 5; u < s1; u += 5.5) o += 'M' + f1(u) + ' -3.4L' + f1(u + 4) + ' 3.4';
          o += '" style="fill:none;stroke:var(--gold2)" stroke-width=".8" opacity=".75"/></g>';
          for (var k = s0 + 24; k < s1 - 9; k += 27) {
            o += '<rect x="' + f1(k - 1.8) + '" y="-4.5" width="3.6" height="9" rx="1.3" style="fill:url(#' + d.gold + ');stroke:rgba(var(--deep-rgb),.55)" stroke-width=".5"/>';
          }
        }
        // cabeça: colar, berço em coroa e a joia
        o += '<rect x="' + f1(s1) + '" y="-5.4" width="2.8" height="10.8" rx="1" style="fill:url(#' + d.gold + ');stroke:rgba(var(--deep-rgb),.6)" stroke-width=".5"/>' +
          '<path d="M' + f1(s1 + 2.8) + ' -3.8L' + f1(s1 + 8) + ' -7.2L' + f1(s1 + 8) + ' 7.2L' + f1(s1 + 2.8) + ' 3.8Z" style="fill:url(#' + d.gold + ');stroke:rgba(var(--deep-rgb),.6)" stroke-width=".5"/>';
        o += '<g' + (g.top ? ' filter="url(#' + d.glow + ')"' : '') + '>' + gem(gc, gr, g, gid) + '</g>';
        var pr = 'M' + f1(s1 + 6.5) + ' -6.6Q' + f1(gc - 1.5) + ' -11 ' + f1(gc + 4.2) + ' -6.2M' + f1(s1 + 6.5) + ' 6.6Q' + f1(gc - 1.5) + ' 11 ' + f1(gc + 4.2) + ' 6.2';
        o += '<path d="' + pr + '" style="fill:none;stroke:rgba(var(--deep-rgb),.55)" stroke-width="2.6" stroke-linecap="round"/>' +
          '<path d="' + pr + '" style="fill:none;stroke:var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' +
          '<circle cx="' + f1(gc + 4.4) + '" cy="-6.2" r="1.25" style="fill:var(--bone)"/><circle cx="' + f1(gc + 4.4) + '" cy="6.2" r="1.25" style="fill:var(--bone)"/>';
        if (g.top) o += star4(gc + 1.5, -1.8, 8, '#fff', '.9');
        return o + '</g>';
      },
      center: function (ctx) {
        var d = qIds(ctx);
        return medal(ctx) + '<circle cx="230" cy="193" r="19" style="fill:url(#' + d.halo + ')"/>' + crownGlyph(230, 196, 0.95, d);
      }
    };
  })();

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.queen2.legenda = { peca: "cetro", masc: true, texto: " é um agrupamento: o comprimento acompanha a soma das notas, e o mais longo tem a joia acesa." };

  return MOTIVOS.queen2;
})();
