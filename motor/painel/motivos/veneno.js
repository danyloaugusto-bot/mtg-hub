/* Motivo "veneno" do gráfico de pontuação: 04. Fynn, rebranding, lote 2, variação D (Gota de vidro), escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "veneno"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Protótipo D, 04. Fynn (Presas da Serpente), lote 2, segunda rodada: "Gota de vidro".
   Dez gotas grandes de pé, como gota de verdade (barriga redonda embaixo, ponta no alto), de vidro escuro. Uma presa de
   marfim pinga em cada ponta, e o veneno dentro sobe de baixo para cima até a soma, aceso na cor do critério na superfície
   e verde quase preto no fundo. Altura do veneno linear com a soma, mínimo de 12%, cheia = 1,5 vez o máximo (regra C).
   A faixa da régua fica DENTRO de cada gota (área clara e traço do máximo, com as classes fx-band/fx-max da moldura):
   como a gota é vertical e não radial, raio() só recolhe as frações da faixa que a moldura passa (duas por critério,
   na ordem dos critérios) e devolve 0, para a moldura não desenhar o arco radial. Na implantação, o certo é a moldura
   ganhar um gancho próprio (por exemplo m.faixa(g, lo, hi)) em vez desta captura. */
var MOTIVO_PAINEL = (function () {
  var RX = 157, RY = 113, GR = 22.5, GH = 47;     // centros numa elipse mais larga que alta (as gotas dos lados não se tocam); raio da barriga; da barriga à ponta
  var TX = '143,209,79';
  var I = {}, cap = [];
  function f(n) { return (+n).toFixed(1); }
  function raio(fr) { cap.push(fr); return 0; }
  function geo(ctx, g) {
    var t = g.am * Math.PI / 180, cx = 230 + RX * Math.cos(t), cy = 230 + RY * Math.sin(t) + 10;
    return { cx: cx, cy: cy, topo: cy - GH, base: cy + GR, L: GH + GR };
  }
  function gotaD(x, y) {
    var r = GR, h = GH;
    return 'M' + f(x) + ' ' + f(y - h) + 'C' + f(x + r * 0.22) + ' ' + f(y - h * 0.62) + ' ' + f(x + r) + ' ' + f(y - r * 0.9) + ' ' + f(x + r) + ' ' + f(y) +
      'A' + r + ' ' + r + ' 0 0 1 ' + f(x - r) + ' ' + f(y) + 'C' + f(x - r) + ' ' + f(y - r * 0.9) + ' ' + f(x - r * 0.22) + ' ' + f(y - h * 0.62) + ' ' + f(x) + ' ' + f(y - h) + 'Z';
  }
  /* presa de serpente vertical, a ponta para baixo, saindo da escuridão (a base some num degradê) */
  function presa(ctx, x, yTip, s) {
    var gid = ctx.uid('fdP'), L = 17, w = 4.3, c = 2.4 * s, y0 = yTip - L;
    var out = 'M' + f(x - w) + ' ' + f(y0) + 'C' + f(x - w) + ' ' + f(y0 + L * 0.5) + ' ' + f(x - w * 0.3 + c * 0.6) + ' ' + f(y0 + L * 0.82) + ' ' + f(x + c) + ' ' + f(yTip) +
      'C' + f(x + w * 0.2 + c * 0.9) + ' ' + f(y0 + L * 0.8) + ' ' + f(x + w * 0.95 + c * 0.3) + ' ' + f(y0 + L * 0.5) + ' ' + f(x + w) + ' ' + f(y0) + 'Z';
    var meia = 'M' + f(x) + ' ' + f(y0) + 'C' + f(x + c * 0.2) + ' ' + f(y0 + L * 0.5) + ' ' + f(x + c * 0.75) + ' ' + f(y0 + L * 0.85) + ' ' + f(x + c) + ' ' + f(yTip) +
      'C' + f(x + w * 0.2 + c * 0.9) + ' ' + f(y0 + L * 0.8) + ' ' + f(x + w * 0.95 + c * 0.3) + ' ' + f(y0 + L * 0.5) + ' ' + f(x + w) + ' ' + f(y0) + 'Z';
    return '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfc3a2" stop-opacity="0"/><stop offset=".3" stop-color="#cfc3a2"/><stop offset=".8" stop-color="#efe8d2"/><stop offset="1" stop-color="#f7f3e6"/></linearGradient>' +
      '<path d="' + out + '" fill="url(#' + gid + ')" filter="url(#' + ctx.k.textura + ')"/>' +
      '<path d="' + meia + '" fill="#2a2214" opacity=".35"/>' +
      '<path d="M' + f(x - w * 0.55) + ' ' + f(y0 + 7) + 'Q' + f(x - w * 0.45) + ' ' + f(y0 + L * 0.65) + ' ' + f(x + c * 0.7 - 0.6) + ' ' + f(yTip - 2.5) + '" fill="none" stroke="#fffbea" stroke-width="1" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M' + f(x + 0.4) + ' ' + f(y0 + 9) + 'Q' + f(x + c * 0.4 + 0.4) + ' ' + f(y0 + L * 0.7) + ' ' + f(x + c * 0.95) + ' ' + f(yTip - 1.5) + '" fill="none" style="stroke:rgba(' + TX + ',.85)" stroke-width=".6" stroke-linecap="round"/>';
  }
  return {
    raio: raio,
    legenda: { peca: "gota", masc: false, texto: " é um critério: a presa pinga e o veneno sobe de baixo para cima até a soma; a mais cheia brilha mais." },
    defs: function (ctx) {
      cap = [];
      var o = ctx.kit.defs(ctx, 'fyD');
      I = { palco: ctx.uid('fdS'), escama: ctx.uid('fdE'), goela: ctx.uid('fdG'), vidro: ctx.uid('fdV'), fundo: ctx.uid('fdF') };
      o += '<radialGradient id="' + I.palco + '" gradientUnits="userSpaceOnUse" cx="230" cy="230" r="194"><stop offset=".3" stop-color="#040806"/><stop offset=".78" stop-color="#0a160e"/><stop offset=".96" stop-color="#0e1e13"/><stop offset="1" stop-color="#050906"/></radialGradient>';
      o += '<pattern id="' + I.escama + '" patternUnits="userSpaceOnUse" width="16" height="12"><path d="M-8 6A8 8 0 0 1 8 6M8 6A8 8 0 0 1 24 6M0 12A8 8 0 0 1 16 12M0 0A8 8 0 0 1 16 0" fill="none" style="stroke:rgba(' + TX + ',.07)" stroke-width="1"/></pattern>';
      o += '<radialGradient id="' + I.goela + '" gradientUnits="userSpaceOnUse" cx="230" cy="226" r="60"><stop offset="0" stop-color="#000"/><stop offset=".75" stop-color="#040805"/><stop offset="1" stop-color="#14301c"/></radialGradient>';
      // vidro escuro: fumê esverdeado, mais claro no ombro esquerdo
      o += '<radialGradient id="' + I.vidro + '" cx=".36" cy=".62" r=".75"><stop offset="0" stop-color="#1c2e22" stop-opacity=".9"/><stop offset=".7" stop-color="#08110b" stop-opacity=".92"/><stop offset="1" stop-color="#020403" stop-opacity=".96"/></radialGradient>';
      o += '<radialGradient id="' + I.fundo + '" cx=".5" cy=".62" r=".6"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>';
      return o;
    },
    stage: function (ctx) {
      return '<circle cx="230" cy="230" r="192" fill="url(#' + I.palco + ')"/>' +
        '<circle cx="230" cy="230" r="192" fill="url(#' + I.escama + ')"/>' +
        '<circle cx="230" cy="230" r="192" fill="none" style="stroke:rgba(' + TX + ',.32)" stroke-width="1.2"/>' +
        '<circle cx="230" cy="230" r="197" fill="none" style="stroke:rgba(' + TX + ',.22)" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round"/>';
    },
    group: function (g, ctx) {
      var G = geo(ctx, g), cx = G.cx, cy = G.cy, d = gotaD(cx, cy), fr = Math.max(0.12, Math.min(1, g.frac));
      var nivel = G.base - G.L * fr, clip = ctx.uid('fdC'), lg = ctx.uid('fdL'), s = g.i % 2 ? 1 : -1;
      var top = g.frac >= Math.max.apply(null, ctx.groups.map(function (x) { return x.frac; }));
      var o = '';
      // sombra e brilho em volta (o brilho na cor do critério cresce com o nível)
      o += '<path d="' + d + '" fill="#000" opacity=".55" transform="translate(2 4)" filter="url(#' + ctx.k.brilho + ')"/>';
      o += '<g style="mix-blend-mode:screen"><ellipse cx="' + f(cx) + '" cy="' + f((nivel + G.base) / 2) + '" rx="' + f(GR * (top ? 1.5 : 1.15)) + '" ry="' + f((G.base - nivel) / 2 + GR * 0.4) + '" style="fill:' + g.rgba(top ? .5 : .3) + '" filter="url(#' + ctx.k.brilho + ')"/></g>';
      // vidro
      o += '<clipPath id="' + clip + '"><path d="' + d + '"/></clipPath>' +
        '<path class="fill" d="' + d + '" fill="url(#' + I.vidro + ')"/>';
      // a faixa da régua dentro da gota
      var k = g.i * 2;
      if (cap.length === ctx.groups.length * 2 && cap[k] != null) {
        var flo = Math.max(0, Math.min(1, cap[k])), fhi = Math.max(0, Math.min(1, cap[k + 1])), ylo = G.base - G.L * flo, yhi = G.base - G.L * fhi;
        o += '<g clip-path="url(#' + clip + ')"><rect class="fx-band" x="' + f(cx - GR - 2) + '" y="' + f(yhi) + '" width="' + (2 * GR + 4) + '" height="' + f(Math.max(0, ylo - yhi)) + '"/></g>';
        var hw = yhi > cy ? Math.sqrt(Math.max(0, GR * GR - (yhi - cy) * (yhi - cy))) : GR * Math.max(0.12, (yhi - G.topo) / GH) * 1.05;
        o += '<path class="fx-max" d="M' + f(cx - hw - 3) + ' ' + f(yhi) + 'H' + f(cx + hw + 3) + '"/>';
      }
      // o veneno: escuro no fundo, aceso na cor do critério na superfície
      o += '<linearGradient id="' + lg + '" gradientUnits="userSpaceOnUse" x1="0" y1="' + f(nivel) + '" x2="0" y2="' + f(G.base) + '">' +
        '<stop offset="0" style="stop-color:' + g.cor + '"/><stop offset=".22" stop-color="#1f4217"/><stop offset=".6" stop-color="#0a1c0b"/><stop offset="1" stop-color="#020602"/></linearGradient>';
      o += '<g clip-path="url(#' + clip + ')">' +
        '<rect x="' + f(cx - GR - 2) + '" y="' + f(nivel) + '" width="' + (2 * GR + 4) + '" height="' + f(G.base - nivel + 2) + '" fill="url(#' + lg + ')" filter="url(#' + ctx.k.textura + ')"/>' +
        '<g style="mix-blend-mode:screen">' +
        '<ellipse cx="' + f(cx + 3) + '" cy="' + f(Math.min(G.base - 8, nivel + 9)) + '" rx="' + f(GR * 0.75) + '" ry="' + f(Math.min(10, (G.base - nivel) * 0.35 + 2)) + '" style="fill:' + g.cor + '" opacity=".55" filter="url(#' + ctx.k.brilho2 + ')"/>' +
        '<ellipse cx="' + f(cx) + '" cy="' + f(nivel) + '" rx="' + (GR + 2) + '" ry="2.6" style="fill:' + g.rgba(.9) + '"/>' +
        '<ellipse cx="' + f(cx) + '" cy="' + f(nivel - 0.6) + '" rx="' + f(GR * 0.7) + '" ry="1" fill="#f6ffe9" opacity=".85"/></g>';
      var K = ctx.kit; K.sorte(30 + g.i * 7);
      for (var b = 0; b < 3; b++) {
        var by = nivel + 6 + K.sorte() * Math.max(2, G.base - nivel - 12);
        if (by < G.base - 4 && G.base - nivel > 14) o += '<circle cx="' + f(cx - GR * 0.5 + K.sorte() * GR) + '" cy="' + f(by) + '" r="' + f(0.8 + K.sorte() * 1.4) + '" fill="none" stroke="#e8ffd6" stroke-width=".6" opacity=".45"/>';
      }
      o += '</g>';
      // profundidade e o vidro por cima: borda, reflexo comprido à esquerda, ponto de luz, contraluz à direita
      o += '<path d="' + d + '" fill="url(#' + I.fundo + ')"/>' +
        '<path d="' + d + '" fill="none" style="stroke:rgba(' + TX + ',.35)" stroke-width="1.1"/>' +
        '<path d="M' + f(cx - GR * 0.66) + ' ' + f(cy - GR * 0.55) + 'A' + f(GR * 0.8) + ' ' + f(GR * 0.8) + ' 0 0 0 ' + f(cx - GR * 0.42) + ' ' + f(cy + GR * 0.62) + '" fill="none" stroke="#f6ffe9" stroke-width="2.4" stroke-linecap="round" opacity=".42"/>' +
        '<path d="M' + f(cx - 2.5) + ' ' + f(G.topo + 12) + 'Q' + f(cx - GR * 0.42) + ' ' + f(cy - GR * 1.05) + ' ' + f(cx - GR * 0.62) + ' ' + f(cy - GR * 0.62) + '" fill="none" stroke="#f6ffe9" stroke-width="1.2" stroke-linecap="round" opacity=".5"/>' +
        '<ellipse cx="' + f(cx - GR * 0.42) + '" cy="' + f(cy - GR * 0.2) + '" rx="2.6" ry="1.6" fill="#fff" opacity=".85" transform="rotate(-60 ' + f(cx - GR * 0.42) + ' ' + f(cy - GR * 0.2) + ')"/>' +
        '<path d="M' + f(cx + GR * 0.86) + ' ' + f(cy - GR * 0.2) + 'A' + GR + ' ' + GR + ' 0 0 1 ' + f(cx + GR * 0.3) + ' ' + f(cy + GR * 0.95) + '" style="fill:none;stroke:' + g.rgba(.75) + ';mix-blend-mode:screen" stroke-width="1.5" stroke-linecap="round"/>';
      // a presa no alto, pingando na ponta da gota
      var yTip = G.topo - 5;
      o += presa(ctx, cx, yTip, s);
      var gx = cx + 2.6 * s, gy = yTip + 1.2;
      o += '<path d="M' + f(gx) + ' ' + f(yTip - 1) + 'C' + f(gx + 1.6) + ' ' + f(gy) + ' ' + f(gx + 2.6) + ' ' + f(gy + 2) + ' ' + f(gx) + ' ' + f(gy + 3.4) + 'C' + f(gx - 2.6) + ' ' + f(gy + 2) + ' ' + f(gx - 1.6) + ' ' + f(gy) + ' ' + f(gx) + ' ' + f(yTip - 1) + 'Z" fill="#163a12" style="stroke:' + g.rgba(.8) + '" stroke-width=".6"/>' +
        '<circle cx="' + f(gx - 0.7) + '" cy="' + f(gy + 1.4) + '" r=".6" fill="#fff" opacity=".8"/>';
      return o;
    },
    center: function (ctx) {
      var o = '<circle cx="230" cy="230" r="60" fill="url(#' + I.goela + ')"/>' +
        '<circle cx="230" cy="230" r="60" fill="none" style="stroke:rgba(' + TX + ',.5)" stroke-width="1.3"/>' +
        '<circle cx="230" cy="230" r="55" fill="none" style="stroke:rgba(' + TX + ',.14)" stroke-width="1"/>';
      var s = 8.4, w = s * 0.2, x = 230, y = 200;
      var sinal = '<circle cx="' + x + '" cy="' + y + '" r="' + s + '" fill="none" style="stroke:rgb(' + TX + ')" stroke-width="' + f(w) + '"/>' +
        '<path d="M' + f(x - w * 0.55) + ' ' + f(y + s * 1.15) + 'L' + f(x - w * 0.35) + ' ' + f(y - s * 1.05) + 'L' + x + ' ' + f(y - s * 1.55) + 'L' + f(x + w * 0.4) + ' ' + f(y - s) + 'L' + f(x + w * 0.6) + ' ' + f(y + s * 1.25) + 'Z" style="fill:rgb(' + TX + ')"/>';
      return o + '<g style="mix-blend-mode:screen" opacity=".85" filter="url(#' + ctx.k.brilho + ')">' + sinal + '</g>' + sinal;
    }
  };
})();
