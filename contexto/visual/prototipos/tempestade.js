/* protótipo: relâmpagos com tratamento de luz (núcleo branco, corpo colorido, brilho difuso, ramificações),
   olho da tempestade no centro e anel de nuvem. Mesmos dados e mesma regra: o relâmpago vai até a soma das notas. */
window.tempestade = function (G, total) {
  var CX = 230, CY = 230, R0 = 70, RMAX = 182, n = G.length, max = 1, i;
  G.forEach(function (g) { max = Math.max(max, g.v); });
  var best = G.reduce(function (b, g, k) { return g.v > G[b].v ? k : b; }, 0);
  var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  function pt(a, r, off) { var t = (a - 90) * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [CX + r * c - off * s, CY + r * s + off * c]; }
  /* o raio: passeio aleatório ao longo da direção, com quebras de tamanho irregular que voltam para a linha do meio */
  function raio(a, r1, jit, sd) {
    seed = sd; var pts = [pt(a, R0, 0)], r = R0, off = 0, L = r1 - R0;
    while (r < r1 - 1) {
      var passo = L * (0.09 + rnd() * 0.16); r = Math.min(r1, r + passo);
      off = off * 0.35 + (rnd() - 0.5) * 2 * jit * (rnd() < 0.3 ? 1.7 : 1);
      if (r >= r1) off = 0;
      pts.push(pt(a, r, off));
    }
    return pts;
  }
  /* corpo afinando: polígono largo na base e em ponta no fim */
  function corpo(pts, w0) {
    var L = [], Rt = [], n = pts.length;
    for (var k = 0; k < n; k++) {
      var p = pts[k], q = pts[Math.min(n - 1, k + 1)], o2 = pts[Math.max(0, k - 1)];
      var dx = q[0] - o2[0], dy = q[1] - o2[1], m = Math.hypot(dx, dy) || 1, nx = -dy / m, ny = dx / m, w = w0 * (1 - k / (n - 1)) + 0.4;
      L.push([p[0] + nx * w, p[1] + ny * w]); Rt.unshift([p[0] - nx * w, p[1] - ny * w]);
    }
    return 'M' + L.concat(Rt).map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z';
  }
  function d(pts) { return 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L'); }
  function ramo(pts, k, a, len, dir, sd) {
    seed = sd; var p = pts[k], q = [p], ang = a + dir * (24 + rnd() * 14), r = 0;
    var t0 = (ang - 90) * Math.PI / 180, x = p[0], y = p[1];
    for (var s = 1; s <= 3; s++) {
      x += Math.cos(t0) * len / 3 + (rnd() - 0.5) * 6; y += Math.sin(t0) * len / 3 + (rnd() - 0.5) * 6; q.push([x, y]);
    }
    return q;
  }
  var o = '<svg viewBox="-58 -2 576 464" role="group" aria-label="Tempestade"><defs>' +
    '<filter id="tbrilho" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>' +
    '<filter id="tbrilho2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>' +
    '<filter id="nuvem" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".018 .03" numOctaves="4" seed="3" result="n"/>' +
    '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .62  0 0 0 0 .70  0 0 0 0 .82  0 0 0 1.6 -.55"/><feComposite in2="SourceGraphic" operator="in"/></filter>' +
    '<radialGradient id="olho" cx="' + CX + '" cy="' + CY + '" r="64" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#05080c"/><stop offset=".7" stop-color="#0b111a"/><stop offset="1" stop-color="#1c2737"/></radialGradient>' +
    '<radialGradient id="clarao" cx="0" cy="0" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="#e8f2ff" stop-opacity=".45"/><stop offset="1" stop-color="#cfe0f2" stop-opacity="0"/></radialGradient>' +
    '</defs>';
  /* anel de nuvem: faixa larga com textura de nuvem, mais escura por dentro */
  o += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (RMAX + 8) + '" fill="none" stroke="#9fb3cc" stroke-width="22" filter="url(#nuvem)" opacity=".42"/>' +
    '<circle cx="' + CX + '" cy="' + CY + '" r="' + (RMAX + 8) + '" fill="none" stroke="rgba(207,224,242,.18)" stroke-width="1"/>';
  var ghosts = '', bolts = '', flash = '', labels = '';
  for (i = 0; i < n; i++) {
    var a = i * 360 / n + 360 / n / 2 - 360 / n / 2, g = G[i], fr = Math.max(0.12, Math.sqrt(g.v / max)), r1 = R0 + (RMAX - R0) * fr;
    a = i * 360 / n + 180 / n;
    var full = raio(a, RMAX, 13, 100 + i * 17), real = raio(a, r1, 13 * (0.55 + 0.45 * fr), 100 + i * 17);
    ghosts += '<path d="' + d(full) + '" fill="none" stroke="rgba(207,224,242,.22)" stroke-width="1" stroke-dasharray="3 4" stroke-linejoin="round"/>';
    var c = 'rgb(' + g.c + ')', ca = function (al) { return 'rgba(' + g.c + ',' + al + ')'; };
    var br = '';
    var b1 = ramo(real, 4, a, (r1 - R0) * 0.32, 1, 300 + i), b2 = ramo(real, 6, a, (r1 - R0) * 0.24, -1, 400 + i);
    br += '<path d="' + d(b1) + '" fill="none" stroke="' + ca(.9) + '" stroke-width="1.6" stroke-linejoin="round"/><path d="' + d(b1) + '" fill="none" stroke="#fff" stroke-width=".6" opacity=".8"/>';
    if (fr > 0.55) br += '<path d="' + d(b2) + '" fill="none" stroke="' + ca(.85) + '" stroke-width="1.3" stroke-linejoin="round"/><path d="' + d(b2) + '" fill="none" stroke="#fff" stroke-width=".5" opacity=".7"/>';
    bolts += '<g class="raio-p">' +
      '<path d="' + d(real) + '" fill="none" stroke="' + ca(.95) + '" stroke-width="18" stroke-linejoin="round" stroke-linecap="round" filter="url(#tbrilho)" opacity=".8"/>' +
      '<path d="' + corpo(real, 5.6) + '" fill="' + c + '"/>' +
      br +
      '<path d="' + corpo(real, 1.5) + '" fill="#fff" opacity=".95"/>' +
      '<path d="' + d(real) + '" fill="none" stroke="#fff" stroke-width="3" opacity=".35" filter="url(#tbrilho2)"/></g>';
    var tip = real[real.length - 1];
    /* a ponta acende; no relâmpago mais alto, o céu em volta também */
    flash += (i === best ? '<circle cx="' + tip[0].toFixed(1) + '" cy="' + tip[1].toFixed(1) + '" r="34" fill="' + ca(.35) + '" filter="url(#tbrilho)"/>' : '') +
      '<circle cx="' + tip[0].toFixed(1) + '" cy="' + tip[1].toFixed(1) + '" r="' + (i === best ? 9 : 5) + '" fill="' + ca(.9) + '" filter="url(#tbrilho2)"/>' +
      '<circle cx="' + tip[0].toFixed(1) + '" cy="' + tip[1].toFixed(1) + '" r="' + (i === best ? 3 : 1.6) + '" fill="#fff"/>';
    var t = (a - 90) * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t), lr = RMAX + 34;
    var x = CX + lr * cs, y = CY + lr * sn + (sn < 0 ? -6 : 4), anc = cs > 0.3 ? 'start' : cs < -0.3 ? 'end' : 'middle';
    labels += '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anc + '">' + g.n + '<tspan class="v" x="' + x.toFixed(1) + '" dy="1.08em">' + g.v + '</tspan></text>';
  }
  o += ghosts + '<g style="mix-blend-mode:screen">' + bolts + flash + '</g>' + labels;
  /* olho da tempestade com o placar */
  o += '<circle cx="' + CX + '" cy="' + CY + '" r="64" fill="url(#olho)"/>' +
    '<circle cx="' + CX + '" cy="' + CY + '" r="64" fill="#9fb3cc" filter="url(#nuvem)" opacity=".35"/>' +
    '<circle cx="' + CX + '" cy="' + CY + '" r="64" fill="none" stroke="rgba(242,248,255,.55)" stroke-width="1.4"/>' +
    '<circle cx="' + CX + '" cy="' + CY + '" r="70" fill="none" stroke="rgba(242,248,255,.18)" stroke-width="6" filter="url(#tbrilho2)"/>' +
    '<text class="ctr-n" x="' + CX + '" y="' + (CY + 14) + '" text-anchor="middle" style="filter:drop-shadow(0 0 8px rgba(190,215,255,.75))">' + total + '</text>' +
    '<text class="ctr-l" x="' + CX + '" y="' + (CY + 34) + '" text-anchor="middle">pontos</text></svg>';
  return o;
};
