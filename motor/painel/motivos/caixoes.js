/* Motivo "caixoes" do gráfico de pontuação: 01. Markov (Edgar Markov), escolhido pelo dono em 15/10/2026 na segunda rodada
   da votação: "Caixões: vigília" (opção 2), refeita a partir dos caixões da primeira rodada. Veio do protótipo
   motivos/markov_caixoes.js, só com essa opção. O Markov ainda não tem painel: o build inclui este arquivo quando o tema.json
   dele tiver "grafico": "caixoes"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Dez caixões de ébano laqueado em anel, cabeceira para fora; a tampa gira presa na cabeceira e revela o veludo do pé até a
   borda livre na proporção da pontuação; o maior abre a tampa por inteiro. Cada desenho tem uns 250 KB de SVG (veio e capitonê
   por caixão), contra uns 85 KB dos outros motivos.
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};
  var D2R = Math.PI / 180;
  function Pt(x, y) { return f1(x) + ' ' + f1(y); }
  function T(am) { return 'translate(230 230) rotate(' + (am - 90).toFixed(2) + ')'; }
  function S(am, x, y) { var t = (am - 90) * D2R, c = Math.cos(t), s = Math.sin(t); return [230 + x * c - y * s, 230 + x * s + y * c]; }
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function rnd(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
  function circ(r, cx, cy) {
    cx = cx == null ? 230 : cx; cy = cy == null ? 230 : cy;
    return 'M' + Pt(cx - r, cy) + 'a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(2 * r) + ' 0a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(-2 * r) + ' 0Z';
  }
  function poly(pts) { return 'M' + pts.map(function (p) { return Pt(p[0], p[1]); }).join('L') + 'Z'; }
  function stops(st) { return st.map(function (x) { return '<stop offset="' + x[0] + '" style="stop-color:' + x[1] + (x[2] != null ? ';stop-opacity:' + x[2] : '') + '"/>'; }).join(''); }
  function lin(id, v, st, ex) { return '<linearGradient id="' + id + '" x1="' + v[0] + '" y1="' + v[1] + '" x2="' + v[2] + '" y2="' + v[3] + '"' + (ex ? ' ' + ex : '') + '>' + stops(st) + '</linearGradient>'; }
  function rad(id, ex, st) { return '<radialGradient id="' + id + '" ' + ex + '>' + stops(st) + '</radialGradient>'; }
  function blur(id, sd) { return '<filter id="' + id + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="' + sd + '"/></filter>'; }
  // metal/pedra com bisel: luz do alto à esquerda calculada sobre o contorno borrado, com sombra projetada opcional
  function metal(id, sd, alt, esp, expo, dif, k1, sh, lc) {
    return '<filter id="' + id + '" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="' + sd + '" result="b"/>' +
      '<feDiffuseLighting in="b" surfaceScale="' + alt + '" diffuseConstant="' + dif + '" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="42"/></feDiffuseLighting>' +
      '<feSpecularLighting in="b" surfaceScale="' + alt + '" specularConstant="' + esp + '" specularExponent="' + expo + '" lighting-color="' + (lc || '#fff') + '" result="s"><feDistantLight azimuth="225" elevation="52"/></feSpecularLighting>' +
      '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="' + k1 + '" k2="0" k3="0" k4="0" result="sh"/>' +
      '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
      '<feComposite in="sh" in2="s2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="m"/>' +
      '<feComposite in="m" in2="SourceAlpha" operator="in" result="lit"/>' +
      (sh ? '<feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="sb"/><feOffset in="sb" dx="1" dy="1.5" result="so"/>' +
        '<feComponentTransfer in="so" result="sd"><feFuncA type="linear" slope="' + sh + '"/></feComponentTransfer>' +
        '<feMerge><feMergeNode in="sd"/><feMergeNode in="lit"/></feMerge>' : '') + '</filter>';
  }
  function torus(a, b, R) {
    function o(r) { return (r / R).toFixed(4); }
    var d = b - a;
    return [[o(a), '#1a1004'], [o(a + d * .16), '#76551c'], [o(a + d * .36), '#e6c77e'], [o(a + d * .46), '#fff3cc'],
      [o(a + d * .58), '#c09a4e'], [o(a + d * .84), '#5a3f12'], [o(b), '#120a02']];
  }
  function topo(ctx) { var t = null; ctx.groups.forEach(function (g) { if (g.top && !t) t = g; }); return t; }

  /* ---------- cor e luz ---------- */
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function rgb(c) { return 'rgb(' + c.map(function (v) { return Math.round(Math.max(0, Math.min(255, v))); }).join(',') + ')'; }
  function pal(base, hi, k, lo) { return { base: hex(base), hi: hex(hi), k: k, lo: lo ? hex(lo) : [0, 0, 0] }; }
  // b = 1 é a face plana de frente para o observador; abaixo escurece para lo, acima clareia para hi
  function tone(P, b) {
    if (b <= 1) return rgb(P.base.map(function (v, i) { return P.lo[i] + (v - P.lo[i]) * Math.max(0, b); }));
    var t = Math.min(1, (b - 1) * P.k);
    return rgb(P.base.map(function (v, i) { return v + (P.hi[i] - v) * t; }));
  }
  var ELEV = 48 * D2R, AMB = .3, DIF = .95, FLAT = AMB + DIF * Math.sin(ELEV);
  // direção da luz (alto à esquerda da tela) nas coordenadas locais de um raio de ângulo am
  function luz(am) {
    var t = (am - 90) * D2R, c = Math.cos(t), s = Math.sin(t), X = -Math.SQRT1_2, Y = -Math.SQRT1_2;
    var hx = X * c + Y * s, hy = -X * s + Y * c;
    return { hx: hx, hy: hy, x: hx * Math.cos(ELEV), y: hy * Math.cos(ELEV), z: Math.sin(ELEV) };
  }
  function bri(n, L) { return (AMB + DIF * Math.max(0, n[0] * L.x + n[1] * L.y + n[2] * L.z)) / FLAT; }

  /* ---------- polígonos ---------- */
  function area(P) { var s = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
  // normais horizontais para fora, uma por aresta (aresta i vai de P[i] a P[i+1])
  function outN(P) {
    var sg = area(P) > 0 ? 1 : -1;
    return P.map(function (a, i) { var b = P[(i + 1) % P.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l * sg, -dx / l * sg]; });
  }
  // desloca o polígono para dentro (d > 0) ou para fora (d < 0), com cantos em esquadria
  function offs(P, d) {
    var n = P.length, N = outN(P), out = [];
    var Ls = P.map(function (a, i) { var b = P[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [a[0] - N[i][0] * d, a[1] - N[i][1] * d, dx / l, dy / l]; });
    for (var i = 0; i < n; i++) {
      var p = Ls[(i - 1 + n) % n], q = Ls[i], den = p[2] * q[3] - p[3] * q[2];
      if (Math.abs(den) < 1e-9) { out.push([q[0], q[1]]); continue; }
      var t = ((q[0] - p[0]) * q[3] - (q[1] - p[1]) * q[2]) / den;
      out.push([p[0] + p[2] * t, p[1] + p[3] * t]);
    }
    return out;
  }
  function shift(P, dx, dy) { return P.map(function (p) { return [p[0] + dx, p[1] + dy]; }); }
  // anel de faces entre os deslocamentos d0 e d1; lean > 0: a face desce para fora; lean < 0: desce para dentro
  function faces(P, d0, d1, lean, pl, L, M, up) {
    var A = offs(P, d0), B = offs(P, d1), N = outN(P), n = P.length, o = '', sl = Math.sin(lean), cl = Math.cos(lean);
    for (var i = 0; i < n; i++) {
      var j = (i + 1) % n, nn = [N[i][0] * sl, N[i][1] * sl, cl], q = [A[i], A[j], B[j], B[i]];
      if (M) { nn = M.rot(nn); q = q.map(function (p) { return M.map(p, up); }); }
      var col = tone(pl, bri(nn, L));
      o += '<path d="' + poly(q) + '" style="fill:' + col + ';stroke:' + col + '" stroke-width=".3" stroke-linejoin="round"/>';
    }
    return o;
  }
  // aplica o mapa da tampa a um caminho com M, L, C, Q e Z absolutos
  function mapPath(d, M, up) {
    var tk = d.match(/[MLCQZ]|-?\d*\.?\d+(?:e-?\d+)?/gi), o = '';
    for (var i = 0; i < tk.length; i++) {
      if (/[MLCQZ]/i.test(tk[i])) o += tk[i];
      else { var q = M.map([+tk[i], +tk[++i]], up); o += Pt(q[0], q[1]) + ' '; }
    }
    return o;
  }

  /* ---------- o caixão ---------- */
  function montar(V) {
    var G = V.g, R = [[G.wf, G.yf], [G.ws, G.ys], [G.wh, G.yh]];
    V.OUT = R.concat(R.slice().reverse().map(function (p) { return [-p[0], p[1]]; }));
    V.PL = offs(V.OUT, -G.pl);
    V.IN = offs(V.OUT, G.wall);
    V.LIDO = offs(V.OUT, -G.ov);
    V.yfc = G.yf + G.wall; V.yhc = G.yh - G.wall;
    V.yH = G.yh + G.ov; V.Lf = V.yH - (G.yf - G.ov);
    return V;
  }
  // a tampa gira em torno da aresta de cima da cabeceira (aberta, fica em pé dentro do contorno do caixão);
  // up é a altura dentro da espessura (0 = face de baixo, t = face de cima); a ponta que sobe alarga um pouco (perspectiva)
  function lidMap(V, th) {
    var G = V.g, c = Math.cos(th), s = Math.sin(th), yH = V.yH;
    function P3(x, y, up) { var d = yH - y, Z = G.hb + G.t + d * s + (up - G.t) * c, k = 1 + Math.max(0, Z - G.hb - G.t) / V.Hx; return [x * k, yH - d * c + (up - G.t) * s, Z, k]; }
    return {
      c: c, s: s, P3: P3,
      map: function (p, up) { var q = P3(p[0], p[1], up == null ? G.t : up); return [q[0], q[1]]; },
      rot: function (n) { return [n[0], n[1] * c + n[2] * s, -n[1] * s + n[2] * c]; }
    };
  }
  // a borda livre de baixo da tampa fica exatamente em yfc + frac * (yhc - yfc): o forro visível é proporcional à pontuação
  function estado(g, ctx, V) {
    var key = '_cx' + V.id, C = ctx[key] = ctx[key] || {};
    if (C[g.i]) return C[g.i];
    var G = V.g, f = g.v > 0 ? (g.top ? 1 : clamp(g.frac)) : 0;
    // ponto mais baixo da tampa = canto de baixo da borda livre: yH - Lf cos(th) - t sen(th); resolve th por bisseção
    var target = V.yfc + f * (V.yhc - V.yfc), th = 0;
    if (f > 0) {
      var lo = 0, hi = Math.PI / 2;
      for (var it = 0; it < 40; it++) { var mid = (lo + hi) / 2; if (V.yH - V.Lf * Math.cos(mid) - G.t * Math.sin(mid) < target) lo = mid; else hi = mid; }
      th = (lo + hi) / 2;
    }
    return (C[g.i] = { f: f, target: target, th: th, L: luz(g.am), M: lidMap(V, th), tr: T(g.am) });
  }
  // sombra da tampa sobre o plano de altura zp (desloca para longe da luz em proporção à altura)
  function lidShadow(st, V, zp, k) {
    var L = st.L, res = [];
    [0, V.g.t].forEach(function (up) {
      res.push(V.LIDO.map(function (p) { var q = st.M.P3(p[0], p[1], up), h = Math.max(0, q[2] - zp) * k; return [q[0] - L.hx * h, q[1] - L.hy * h]; }));
    });
    return res;
  }
  function grao(id, gr, seed) {
    return '<filter id="' + id + '" x="-6%" y="-6%" width="112%" height="112%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="' + gr.bf + '" numOctaves="4" seed="' + seed + '" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="' + gr.a + ' 0 0 0 ' + gr.b + '  ' + gr.a + ' 0 0 0 ' + gr.b + '  ' + gr.a + ' 0 0 0 ' + gr.b + '  0 0 0 0 1" result="g"/>' +
      '<feBlend in="SourceGraphic" in2="g" mode="multiply" result="m"/><feComposite in="m" in2="SourceAlpha" operator="in"/></filter>';
  }
  // cantoneira: placa em leque no canto v, com as abas ao longo das arestas
  function cap(v, a, b, s) {
    var e1 = [a[0] - v[0], a[1] - v[1]], e2 = [b[0] - v[0], b[1] - v[1]], l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1]);
    e1 = [e1[0] / l1, e1[1] / l1]; e2 = [e2[0] / l2, e2[1] / l2];
    var bi = [e1[0] + e2[0], e1[1] + e2[1]], lb = Math.hypot(bi[0], bi[1]); bi = [bi[0] / lb, bi[1] / lb];
    function at(u, w) { return [v[0] + e1[0] * u + e2[0] * w, v[1] + e1[1] * u + e2[1] * w]; }
    var p0 = [v[0] + bi[0] * .5, v[1] + bi[1] * .5], A = at(s, .35), B = at(.35, s), q = [v[0] + bi[0] * s * .62, v[1] + bi[1] * s * .62];
    return { d: 'M' + Pt(p0[0], p0[1]) + 'L' + Pt(A[0], A[1]) + 'Q' + Pt(q[0], q[1]) + ' ' + Pt(B[0], B[1]) + 'Z', rivet: [v[0] + bi[0] * s * .42, v[1] + bi[1] * s * .42] };
  }
  // cruz gótica de pontas trilobadas, ao longo da tampa (a cabeça da cruz para a cabeceira)
  function cruz(V) {
    var C = V.cz, w = C.w, r = C.r, d = 'M' + [[-w, C.yb], [w, C.yb], [w, C.yc - w], [C.hx, C.yc - w], [C.hx, C.yc + w], [w, C.yc + w], [w, C.yt], [-w, C.yt], [-w, C.yc + w], [-C.hx, C.yc + w], [-C.hx, C.yc - w], [-w, C.yc - w]].map(function (p) { return Pt(p[0], p[1]); }).join('L') + 'Z';
    var lob = [];
    [[[0, C.yb], [0, -1]], [[0, C.yt], [0, 1]], [[C.hx, C.yc], [1, 0]], [[-C.hx, C.yc], [-1, 0]]].forEach(function (e) {
      var p = e[0], u = e[1], v = [-u[1], u[0]];
      lob.push([p[0] + u[0] * r * .55, p[1] + u[1] * r * .55, r]);
      lob.push([p[0] - u[0] * r * .3 + v[0] * r * 1.05, p[1] - u[1] * r * .3 + v[1] * r * 1.05, r * .92]);
      lob.push([p[0] - u[0] * r * .3 - v[0] * r * 1.05, p[1] - u[1] * r * .3 - v[1] * r * 1.05, r * .92]);
    });
    return { d: d, lob: lob, boss: [0, C.yc, C.boss] };
  }
  function ell(M, x, y, r, st, up) { var q = M.P3(x, y, up == null ? M.up : up); return '<ellipse cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" rx="' + f1(r * q[3]) + '" ry="' + f1(Math.max(.05, r * M.c)) + '" style="' + st + '"/>'; }

  function caixao(g, ctx, V) {
    var K = ctx.mk, G = V.g, st = estado(g, ctx, V), L = st.L, M = st.M, tr = st.tr, f = st.f, o = '', d = '', i;
    var OUT = V.OUT, IN = V.IN, LIDO = V.LIDO;
    var id = { gl: ctx.uid('mcr'), gr: ctx.uid('mcg'), pat: ctx.uid('mcp'), cu: ctx.uid('mcc'), pil: ctx.uid('mci'), sh: ctx.uid('mcs'), shl: ctx.uid('mcl'), cav: ctx.uid('mcv'), box: ctx.uid('mcb') };
    var hx = L.hx, hy = L.hy;
    M.up = G.t + .4;
    /* ---- defs locais: veio, recortes, capitonê com a luz deste caixão ---- */
    d += grao(id.gr, V.grain, 11 + g.i * 17);
    d += '<clipPath id="' + id.cav + '"><path d="' + poly(IN) + '"/></clipPath><clipPath id="' + id.box + '"><path d="' + poly(OUT) + '"/></clipPath>';
    var sc = V.satC, ac = V.acB + V.acF * f;
    d += rad(id.cu, 'cx=".5" cy=".5" r=".62" fx="' + (.5 + .22 * hx).toFixed(3) + '" fy="' + (.5 + .22 * hy).toFixed(3) + '"', [[0, sc[0], ac], [.45, sc[1]], [.86, sc[2]], [1, sc[3]]]);
    var pw = V.tuft[0], ph = V.tuft[1], dm = function (cx, cy) { return 'M' + Pt(cx, cy - ph / 2) + 'L' + Pt(cx + pw / 2, cy) + 'L' + Pt(cx, cy + ph / 2) + 'L' + Pt(cx - pw / 2, cy) + 'Z'; };
    var cell = '<rect width="' + pw + '" height="' + ph + '" style="fill:' + sc[2] + '"/>';
    [[pw / 2, ph / 2], [0, 0], [pw, 0], [0, ph], [pw, ph]].forEach(function (c) { cell += '<path d="' + dm(c[0], c[1]) + '" style="fill:url(#' + id.cu + ')"/>'; });
    var crease = 'M' + Pt(pw / 2, 0) + 'L' + Pt(pw, ph / 2) + 'L' + Pt(pw / 2, ph) + 'L' + Pt(0, ph / 2) + 'Z';
    cell += '<path d="' + crease + '" transform="translate(' + f1(-.35 * hx) + ' ' + f1(-.35 * hy) + ')" style="fill:none;stroke:' + sc[0] + '" stroke-width=".35" opacity=".28"/>';
    cell += '<path d="' + crease + '" style="fill:none;stroke:' + sc[3] + '" stroke-width=".55" opacity=".9"/>';
    [[pw / 2, 0], [pw, ph / 2], [pw / 2, ph], [0, ph / 2]].forEach(function (b) {
      cell += '<circle cx="' + f1(b[0]) + '" cy="' + f1(b[1]) + '" r=".78" style="fill:' + sc[3] + '"/>' +
        '<circle cx="' + f1(b[0] + .28 * hx) + '" cy="' + f1(b[1] + .28 * hy) + '" r=".3" style="fill:' + sc[0] + '" opacity=".75"/>';
    });
    d += '<pattern id="' + id.pat + '" patternUnits="userSpaceOnUse" x="' + f1(-pw / 2) + '" y="' + f1(V.yfc + 1.2) + '" width="' + pw + '" height="' + ph + '">' + cell + '</pattern>';
    d += rad(id.pil, 'cx=".5" cy=".5" r=".6" fx="' + (.5 + .25 * hx).toFixed(3) + '" fy="' + (.5 + .3 * hy).toFixed(3) + '"', [[0, sc[0], ac], [.5, sc[1]], [.9, sc[2]], [1, sc[3]]]);
    var cyc = (V.yfc + V.yhc) / 2;
    d += lin(id.sh, [f1(hx * 30), f1(cyc + hy * 30), f1(-hx * 30), f1(cyc - hy * 30)], [[0, '#fff', V.sheen], [.55, '#fff', 0]], 'gradientUnits="userSpaceOnUse"');
    var lcy = (st.target + V.yH) / 2;
    d += lin(id.shl, [f1(hx * 26), f1(lcy + hy * 26), f1(-hx * 26), f1(lcy - hy * 26)], [[0, V.lidHi, V.lidSheen], [.6, V.lidHi, 0], [1, '#000', .18]], 'gradientUnits="userSpaceOnUse"');
    if (V.gloss) d += lin(id.gl, [f1(hx * 26), f1(lcy + hy * 26), f1(-hx * 26), f1(lcy - hy * 26)], [[0, '#fff', 0], [.2, '#fff', 0], [.27, '#fff', V.gloss], [.31, '#fff', V.gloss * .5], [.4, '#fff', 0]], 'gradientUnits="userSpaceOnUse"');
    o += '<defs>' + d + '</defs>';

    /* ---- caixa: moldura de base, tampo da borda chanfrado por dentro e por fora ---- */
    var box = '<path d="' + poly(V.PL) + '" style="fill:' + tone(V.wood, .5) + '"/>' + faces(V.PL, 0, G.pl * .6, .75, V.wood, L);
    box += '<path d="' + poly(shift(OUT, -hx * 1.3, -hy * 1.3)) + '" style="fill:#000" opacity=".55" filter="url(#' + K.b1 + ')"/>';
    box += '<path d="' + poly(OUT) + '" style="fill:' + tone(V.wood, 1) + '"/>' + faces(OUT, 0, 1.3, .8, V.wood, L) + faces(OUT, G.wall - 1.1, G.wall, -.9, V.wood, L);
    o += '<g transform="' + tr + '"><g filter="url(#' + id.gr + ')">' + box + '</g>';
    // sombra da tampa erguida sobre a borda da caixa
    if (f > 0) {
      var sr = lidShadow(st, V, G.hb, V.shL);
      o += '<g clip-path="url(#' + id.box + ')"><g opacity=".5" filter="url(#' + K.b1 + ')">' + sr.map(function (p) { return '<path d="' + poly(p) + '" style="fill:#000"/>'; }).join('') + '</g></g>';
    }
    o += '</g>';

    /* ---- ferragens da caixa: alças de barra nas laterais e cantoneiras no tampo da borda ---- */
    var hw = '', N0 = outN(OUT);
    [[0, [.3, .68]], [1, [.5]]].forEach(function (e) {
      var a = OUT[e[0]], b = OUT[e[0] + 1], n = N0[e[0]], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), u = [dx / l, dy / l];
      e[1].forEach(function (t) {
        [1, -1].forEach(function (sg) {
          var p = [a[0] + dx * t, a[1] + dy * t], hl = V.hdl, gp = 2.1;
          function q(s, k) { return [sg * (p[0] + u[0] * s + n[0] * k), p[1] + u[1] * s + n[1] * k]; }
          var A = q(-hl, .2), B = q(-hl + .6, gp), C = q(hl - .6, gp), D = q(hl, .2);
          hw += '<path d="M' + Pt(A[0], A[1]) + 'L' + Pt(B[0], B[1]) + 'L' + Pt(C[0], C[1]) + 'L' + Pt(D[0], D[1]) + '" style="fill:none;stroke:' + V.brass + '" stroke-width="1.15" stroke-linejoin="round" stroke-linecap="round"/>' +
            '<circle cx="' + f1(A[0]) + '" cy="' + f1(A[1]) + '" r="1.05" style="fill:' + V.brass + '"/><circle cx="' + f1(D[0]) + '" cy="' + f1(D[1]) + '" r="1.05" style="fill:' + V.brass + '"/>';
        });
      });
    });
    var IN1 = offs(OUT, .9);
    [0, 1, 4, 5].forEach(function (k) {
      var n = IN1.length, c = cap(IN1[k], IN1[(k + 1) % n], IN1[(k - 1 + n) % n], 4.2);
      hw += '<path d="' + c.d + '" style="fill:' + V.brass + '"/>';
    });
    o += '<g filter="url(#' + K.bev + ')"><g transform="' + tr + '">' + hw + '</g></g>';

    /* ---- forro: capitonê, rolo franzido na borda, travesseiro, brilho de cetim, sombras de profundidade ---- */
    var cav = '<rect x="-30" y="' + f1(V.yfc - 2) + '" width="60" height="' + f1(V.yhc - V.yfc + 4) + '" style="fill:url(#' + id.pat + ')"/>';
    var y0 = V.yhc - 13.6, y1 = V.yhc - 2.6, pwh = V.pil;
    cav += '<rect x="' + f1(-pwh - hx * 1.6) + '" y="' + f1(y0 - hy * 1.6) + '" width="' + f1(2 * pwh) + '" height="' + f1(y1 - y0) + '" rx="4.2" style="fill:#000" opacity=".6" filter="url(#' + K.b1 + ')"/>';
    cav += '<rect x="' + f1(-pwh) + '" y="' + f1(y0) + '" width="' + f1(2 * pwh) + '" height="' + f1(y1 - y0) + '" rx="4.2" style="fill:url(#' + id.pil + ');stroke:' + sc[3] + '" stroke-width=".5"/>';
    var pc = [0, (y0 + y1) / 2], gath = '';
    [[-pwh + 1.6, y0 + 1.4], [pwh - 1.6, y0 + 1.4], [pwh - 1.6, y1 - 1.4], [-pwh + 1.6, y1 - 1.4]].forEach(function (p) {
      gath += 'M' + Pt(pc[0], pc[1]) + 'Q' + Pt((pc[0] + p[0]) / 2 + .8, (pc[1] + p[1]) / 2) + ' ' + Pt(p[0], p[1]);
    });
    cav += '<path d="' + gath + '" style="fill:none;stroke:' + sc[3] + '" stroke-width=".5" opacity=".7"/><circle cx="0" cy="' + f1(pc[1]) + '" r=".9" style="fill:' + sc[3] + '"/>';
    var R0 = offs(IN, 0), R1 = offs(IN, 1.25), R2 = offs(IN, 2.5), pl = '';
    cav += faces(IN, 0, 1.25, .95, V.sat, L) + faces(IN, 1.25, 2.5, -.95, V.sat, L);
    for (i = 0; i < IN.length; i++) {
      var j = (i + 1) % IN.length, el = Math.hypot(R0[j][0] - R0[i][0], R0[j][1] - R0[i][1]), m = Math.max(2, Math.round(el / 1.7));
      for (var k = 1; k < m; k++) {
        var t = k / m, a0 = [R0[i][0] + (R0[j][0] - R0[i][0]) * t, R0[i][1] + (R0[j][1] - R0[i][1]) * t], a2 = [R2[i][0] + (R2[j][0] - R2[i][0]) * t, R2[i][1] + (R2[j][1] - R2[i][1]) * t];
        pl += 'M' + Pt(a0[0], a0[1]) + 'L' + Pt(a2[0], a2[1]);
      }
    }
    cav += '<path d="' + pl + '" style="fill:none;stroke:' + sc[3] + '" stroke-width=".32" opacity=".55"/>';
    cav += '<path d="' + poly(R2) + '" style="fill:none;stroke:' + sc[3] + '" stroke-width=".6" opacity=".8"/>';
    // o forro revelado acende (mais forte quanto maior a pontuação)
    var gy = (st.target + V.yfc) / 2, gry = (st.target - V.yfc) / 2 + 8;
    if (f > 0) cav += '<ellipse cx="0" cy="' + f1(gy) + '" rx="22" ry="' + f1(gry) + '" style="fill:url(#' + K.ember + ')" opacity="' + (V.glow0 + V.glow1 * f).toFixed(2) + '"/>';
    cav += '<rect x="-30" y="' + f1(V.yfc - 2) + '" width="60" height="' + f1(V.yhc - V.yfc + 4) + '" style="fill:url(#' + id.sh + ')"/>';
    cav += '<path d="' + poly(IN) + '" style="fill:none;stroke:#000" stroke-width="5" opacity=".62" filter="url(#' + K.b2 + ')"/>';
    cav += '<path d="M-40 50H40V200H-40Z' + poly(shift(IN, -hx * V.wsh, -hy * V.wsh)) + '" fill-rule="evenodd" style="fill:#000" opacity=".5" filter="url(#' + K.b1 + ')"/>';
    if (f > 0) cav += '<g opacity="' + V.lidShOp + '" filter="url(#' + K.b2 + ')">' + lidShadow(st, V, G.z0, V.shL).map(function (p) { return '<path d="' + poly(p) + '" style="fill:#000"/>'; }).join('') + '</g>';
    o += '<g transform="' + tr + '"><g clip-path="url(#' + id.cav + ')">' + cav + '</g></g>';

    /* ---- tampa: espessura à mostra na borda livre, chanfro, frisos, veio e brilho de verniz ---- */
    var lid = '', NL = outN(LIDO);
    for (i = 0; i < LIDO.length; i++) {
      if (NL[i][1] > -.05 || f <= 0) continue;
      var a = LIDO[i], b = LIDO[(i + 1) % LIDO.length], col = tone(V.end, bri(M.rot([NL[i][0], NL[i][1], 0]), L));
      var q4 = [M.map(a, 0), M.map(b, 0), M.map(b, G.t), M.map(a, G.t)];
      lid += '<path d="' + poly(q4) + '" style="fill:' + col + ';stroke:' + col + '" stroke-width=".3" stroke-linejoin="round"/>';
    }
    var topN = M.rot([0, 0, 1]), LT = LIDO.map(function (p) { return M.map(p); });
    var arris = f > 0 ? '<path d="M' + Pt(LT[5][0], LT[5][1]) + 'L' + Pt(LT[0][0], LT[0][1]) + '" style="stroke:' + V.lidHi + '" stroke-width=".45" opacity=".45"/>' : '';
    lid += '<path d="' + poly(LT) + '" style="fill:' + tone(V.wood, bri(topN, L)) + '"/>' + faces(LIDO, 0, 1.7, .8, V.wood, L, M);
    if (V.groove) lid += faces(LIDO, 4.4, 5.0, -.8, V.wood, L, M) + faces(LIDO, 5.0, 5.6, .8, V.wood, L, M);
    o += '<g transform="' + tr + '"><g filter="url(#' + id.gr + ')">' + lid + '</g>' +
      '<path d="' + poly(LT) + '" style="fill:url(#' + id.shl + ')"/>' + (V.gloss ? '<path d="' + poly(offs(LIDO, 1.7).map(function (p) { return M.map(p); })) + '" style="fill:url(#' + id.gl + ')"/>' : '') + arris;
    if (V.inlay && M.c > .16) o += '<path d="' + poly(offs(LIDO, 4.6).map(function (p) { return M.map(p); })) + '" style="fill:none;stroke:' + V.inlay + '" stroke-width=".55" opacity=".85"/>';
    o += '</g>';
    // ornamentos da tampa: cruz e cantoneiras (luz de tela pelo filtro)
    var gemAt = null;
    if (M.c > .16) {
      var cz = cruz(V), orn = '';
      orn += '<path d="' + mapPath(cz.d, M, M.up) + '" style="fill:' + V.czFill + '"/>';
      cz.lob.forEach(function (p) { orn += ell(M, p[0], p[1], p[2], 'fill:' + V.czFill); });
      orn += ell(M, cz.boss[0], cz.boss[1], cz.boss[2], 'fill:' + V.czFill);
      var LI = offs(LIDO, 1.0), nL = LI.length;
      for (i = 0; i < nL; i++) {
        var cc = cap(LI[i], LI[(i + 1) % nL], LI[(i - 1 + nL) % nL], 4.6);
        orn += '<path d="' + mapPath(cc.d, M, M.up) + '" style="fill:' + V.brass + '"/>';
      }
      o += '<g filter="url(#' + (V.cross === 'talha' ? K.carve : K.bev) + ')"><g transform="' + tr + '">' + orn + '</g></g>';
      gemAt = M.P3(0, V.cz.yc, M.up + .3);
    } else {
      gemAt = M.P3(0, LIDO[0][1], G.t / 2);
    }
    // pedra na cor do agrupamento, em engaste de latão
    if (gemAt) {
      var gx = gemAt[0], gyy = gemAt[1], gr = V.gemR * gemAt[3], gry2 = M.c > .16 ? V.gemR * Math.max(.3, M.c) : V.gemR * .8;
      o += '<g transform="' + tr + '"><ellipse cx="' + f1(gx) + '" cy="' + f1(gyy) + '" rx="' + f1(gr + .7) + '" ry="' + f1(gry2 + .7) + '" style="fill:#1a1004"/>' +
        '<ellipse cx="' + f1(gx) + '" cy="' + f1(gyy) + '" rx="' + f1(gr) + '" ry="' + f1(gry2) + '" style="fill:' + g.cor + '"/>' +
        '<ellipse cx="' + f1(gx) + '" cy="' + f1(gyy) + '" rx="' + f1(gr) + '" ry="' + f1(gry2) + '" style="fill:url(#' + K.gemHL + ')"/>' +
        '<ellipse cx="' + f1(gx) + '" cy="' + f1(gyy) + '" rx="' + f1(gr + .35) + '" ry="' + f1(gry2 + .35) + '" style="fill:none;stroke:#d9b56a" stroke-width=".45" opacity=".9"/></g>';
    }
    /* ---- o maior: o forro aceso transborda em luz ---- */
    if (g.top) o += '<g transform="' + tr + '" style="pointer-events:none"><path d="' + poly(IN) + '" style="fill:#ff2a3c" opacity="' + V.topBloom + '" filter="url(#' + K.glowL + ')"/></g>';
    return o;
  }

  /* ---------- defs comuns ---------- */
  function base(ctx) {
    var K = ctx.mk = {};
    'bev bevF carve b1 b2 b3 glow glowL clipD vig hot gA gV gRim gBez bead med gemHL ember ivo redwax stone stoneF fog flame flameC halo pool'.split(' ').forEach(function (k) { K[k] = ctx.uid('mc' + k); });
    var s = metal(K.bev, .7, 1.9, 1.15, 20, 1.1, 1.2, .55, '#fff6dc') + metal(K.bevF, .7, 2, 1.1, 18, 1.1, 1.2, .6, '#fff6dc') +
      metal(K.carve, .55, 1.5, .28, 14, 1.12, 1.18, .55, '#ffe8cc');
    s += blur(K.b1, .9) + blur(K.b2, 1.8) + blur(K.b3, 2.6) + blur(K.glow, 4) + blur(K.glowL, 9);
    s += '<clipPath id="' + K.clipD + '"><circle cx="230" cy="230" r="194"/></clipPath>';
    s += rad(K.vig, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="194"', [[.5, '#000', 0], [.86, '#000', .5], [1, '#000', .88]]);
    s += rad(K.hot, '', [[0, '#ff3448', .7], [.4, 'var(--blood)', .32], [1, 'var(--blood)', 0]]);
    s += lin(K.gA, [0, 0, 1, 0], [[0, '#1a1004'], [.17, '#6b4c18'], [.36, '#b48a3c'], [.47, '#e6c77e'], [.53, '#fff3cc'], [.62, '#caa458'], [.82, '#6a4c1a'], [1, '#170e03']]);
    s += lin(K.gV, [0, 0, 0, 1], [[0, '#fff3cc'], [.25, '#e6c77e'], [.55, '#c09a4e'], [.85, '#6b4c18'], [1, '#1a1004']]);
    s += rad(K.gRim, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="196"', torus(190.4, 195.6, 196));
    s += rad(K.gBez, 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="57"', torus(49, 56.6, 57));
    s += rad(K.bead, 'cx=".36" cy=".32" r=".72"', [[0, '#fff3cc'], [.3, '#e6c77e'], [.62, '#b48a3c'], [1, '#3a2608']]);
    s += rad(K.med, 'cx=".5" cy=".4" r=".62"', [[0, '#1c0a0e'], [.7, '#070304'], [1, '#000']]);
    s += rad(K.gemHL, 'cx=".36" cy=".32" r=".75"', [[0, '#fff', .9], [.22, '#fff', .25], [.55, '#000', 0], [1, '#000', .55]]);
    s += rad(K.ember, '', [[0, '#ff6070', .85], [.45, '#ff2a40', .45], [1, '#ff2a40', 0]]);
    s += lin(K.redwax, [0, 0, 1, 0], [[0, '#1c0204'], [.16, '#640a15'], [.36, '#be2738'], [.52, '#a0192a'], [.8, '#52060f'], [1, '#180103']]);
    s += lin(K.ivo, [0, 0, 1, 0], [[0, '#4a3e30'], [.16, '#b9a888'], [.36, '#f3ead8'], [.55, '#e2d5ba'], [.8, '#9c8b6c'], [1, '#3a2f22']]);
    s += '<filter id="' + K.stone + '" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="5" seed="5"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 .62  0 0 0 0 .52  0 0 0 0 .5  1.3 0 0 0 -.52"/></filter>';
    s += '<filter id="' + K.stoneF + '" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="3" seed="9" result="a"/>' +
      '<feColorMatrix in="a" type="matrix" values="0 0 0 0 .7  0 0 0 0 .62  0 0 0 0 .56  1.5 0 0 0 -.74" result="f"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4" result="b"/>' +
      '<feColorMatrix in="b" type="matrix" values="0 0 0 0 .5  0 0 0 0 .42  0 0 0 0 .4  .9 0 0 0 -.36" result="m"/>' +
      '<feMerge><feMergeNode in="m"/><feMergeNode in="f"/></feMerge></filter>';
    s += '<filter id="' + K.fog + '" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".009 .013" numOctaves="4" seed="23"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 .78  0 0 0 0 .66  0 0 0 0 .68  1.9 0 0 0 -.78"/></filter>';
    s += rad(K.flame, 'cx=".5" cy=".78" r=".75" fx=".5" fy=".86"', [[0, '#ffffff'], [.22, '#fff6d0'], [.48, '#ffc45a'], [.75, '#ff7a20', .85], [1, '#ff4a10', 0]]);
    s += rad(K.flameC, 'cx=".5" cy=".7" r=".6"', [[0, '#fff'], [.6, '#fffbe8', .9], [1, '#fff3c0', 0]]);
    s += rad(K.halo, '', [[0, '#ffd890', .55], [.25, '#ffb860', .22], [.6, '#ff9040', .06], [1, '#ff8030', 0]]);
    s += rad(K.pool, '', [[0, '#ffb060', .22], [.5, '#ff8a3a', .07], [1, '#ff7a30', 0]]);
    return s;
  }

  /* aro fino de ouro com losangos nas divisas e contas no meio de cada agrupamento */
  function rim(ctx) {
    var K = ctx.mk, o = '<circle cx="230" cy="230" r="196" style="fill:none;stroke:#000" stroke-width="1.2" stroke-opacity=".8"/>' +
      '<g filter="url(#' + K.bevF + ')"><path d="' + circ(195.6) + circ(190.4) + '" fill-rule="evenodd" style="fill:url(#' + K.gRim + ')"/>';
    for (var k = 0; k < ctx.NG; k++) {
      var a = -90 + k * ctx.step;
      o += '<g transform="' + T(a) + '"><path d="M0 186.6L3.4 191.6L0 196L-3.4 191.6Z" style="fill:url(#' + K.gA + ')"/></g>';
      var p = pol(193, a + ctx.step / 2);
      o += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="1.9" style="fill:url(#' + K.bead + ')"/>';
    }
    return o + '</g><circle cx="230" cy="230" r="188.2" style="fill:none;stroke:#c9a35a" stroke-width=".8" stroke-opacity=".5"/>';
  }

  /* o sigilo dos Markov: tridente de pontas afiadas, a do meio mais longa; 16 de altura centrado em (cx, cy) */
  var SIG = 'M0 -8.6L1.9 -3.2L1.15 2L-1.15 2L-1.9 -3.2Z' +
    'M-7.2 -5.8L-5.4 -1.3C-5 1.5 -3 3.4 0 3.6C3 3.4 5 1.5 5.4 -1.3L7.2 -5.8L4.1 -1.9C3.7 .3 2.3 1.4 0 1.5C-2.3 1.4 -3.7 .3 -4.1 -1.9Z' +
    'M-5.4 -1.3L-7.6 -.2L-5.2 .4ZM5.4 -1.3L7.6 -.2L5.2 .4Z' +
    'M-1.15 3.3L1.15 3.3L.95 6L0 8.6L-.95 6Z' + 'M-3.4 4.7L3.4 4.7L2.6 6.1L-2.6 6.1Z';
  function sigil(cx, cy, s, K, glow) {
    var tr = 'translate(' + f1(cx) + ' ' + f1(cy) + ') scale(' + s + ')';
    return (glow ? '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(12 * s) + '" style="fill:url(#' + K.hot + ')" opacity=".6"/>' : '') +
      '<path transform="translate(' + f1(cx + .6) + ' ' + f1(cy + 1) + ') scale(' + s + ')" d="' + SIG + '" style="fill:#000" opacity=".85"/>' +
      '<g filter="url(#' + K.bevF + ')"><path transform="' + tr + '" d="' + SIG + '" style="fill:url(#' + K.gV + ')"/></g>';
  }
  /* medalhão negro com aro de ouro e o sigilo no alto */
  function medal(ctx) {
    var K = ctx.mk;
    return '<circle cx="230" cy="230" r="58.5" style="fill:#000" opacity=".7"/>' +
      '<circle cx="230" cy="230" r="49.5" style="fill:url(#' + K.med + ')"/>' +
      '<g filter="url(#' + K.bevF + ')"><path d="' + circ(56.6) + circ(49) + '" fill-rule="evenodd" style="fill:url(#' + K.gBez + ')"/></g>' +
      '<circle cx="230" cy="230" r="46.4" style="fill:none;stroke:#c9a35a" stroke-opacity=".45" stroke-width=".8"/>' +
      sigil(230, 194, .93, K, true);
  }

  /* sombras de todos os caixões no chão (antes de qualquer caixão, para nenhuma sombra cair sobre o vizinho) */
  function sombrasChao(ctx, V) {
    var K = ctx.mk, o = '<g filter="url(#' + K.b3 + ')" opacity="' + V.shOp + '">';
    ctx.groups.forEach(function (g) {
      var st = estado(g, ctx, V), L = st.L, h = V.g.hb * V.shF, P = V.PL, Q = shift(P, -L.hx * h, -L.hy * h), s = '<path d="' + poly(P) + '"/><path d="' + poly(Q) + '"/>';
      for (var i = 0; i < P.length; i++) { var j = (i + 1) % P.length; s += '<path d="' + poly([P[i], P[j], Q[j], Q[i]]) + '"/>'; }
      if (st.f > 0) lidShadow(st, V, 0, V.shL).forEach(function (p) { s += '<path d="' + poly(p) + '"/>'; });
      o += '<g transform="' + st.tr + '" style="fill:#000">' + s + '</g>';
    });
    return o + '</g>';
  }

  /* chão de cripta: lajes com juntas (luz do alto à esquerda: a aresta de baixo à direita da junta acende) */
  function setor(r1, r2, a0, a1) {
    var p = pol(r1, a0), q = pol(r1, a1), u = pol(r2, a1), v = pol(r2, a0);
    return 'M' + Pt(p[0], p[1]) + 'A' + r1 + ' ' + r1 + ' 0 0 1 ' + Pt(q[0], q[1]) + 'L' + Pt(u[0], u[1]) + 'A' + r2 + ' ' + r2 + ' 0 0 0 ' + Pt(v[0], v[1]) + 'Z';
  }
  function lajes(ctx, rings, op, tons) {
    var j = '', k, a, o = '';
    if (tons) {
      var rr = rings.concat([194]), n = 0;
      for (var z = 0; z < rr.length - 1; z++) {
        var div = z === rr.length - 2 && rings.length > 1 ? 2 : 1;
        for (k = 0; k < ctx.NG * div; k++) {
          var a0 = -90 + k * ctx.step / div, a1 = a0 + ctx.step / div, t = rnd(++n * 3.7 + z), w = t > .5;
          o += '<path d="' + setor(rr[z], rr[z + 1], a0, a1) + '" style="fill:' + (w ? '#e8d6c0' : '#000') + '" opacity="' + (w ? (t - .5) * tons : (.5 - t) * tons * 3).toFixed(3) + '"/>';
        }
      }
    }
    rings.forEach(function (r) { j += circ(r); });
    for (k = 0; k < ctx.NG; k++) { a = -90 + k * ctx.step; var p1 = pol(rings[0], a), p2 = pol(194, a); j += 'M' + Pt(p1[0], p1[1]) + 'L' + Pt(p2[0], p2[1]); }
    for (k = 0; k < ctx.NG; k++) { a = -90 + (k + .5) * ctx.step; var q1 = pol(rings[rings.length - 1], a), q2 = pol(194, a); j += 'M' + Pt(q1[0], q1[1]) + 'L' + Pt(q2[0], q2[1]); }
    return o + '<path d="' + j + '" style="fill:none;stroke:#000" stroke-width="1.5" opacity="' + op + '"/>' +
      '<path d="' + j + '" style="fill:none;stroke:#e8d2b0" stroke-width=".45" opacity=".07" transform="translate(.7 .8)"/>';
  }

  /* vela de marfim de pé (vista de lado), base em (x, y): prato de latão, cera escorrida, pavio e chama */
  var IVO = { w: 2.3, top: '#efe4cc', pool: '#c9b896', d1: '#f7f0e2', d2: '#d8cab0', heat: .22, dish: true };
  function velaPe(x, y, K, h, seed, W) {
    W = W || IVO;
    var w = W.w, top = y - h, o = '', r1 = rnd(seed), r2 = rnd(seed + 3);
    if (W.dish) o += '<g filter="url(#' + K.bevF + ')"><ellipse cx="' + f1(x) + '" cy="' + f1(y + .6) + '" rx="5.4" ry="1.75" style="fill:url(#' + K.gA + ')"/></g>';
    o += '<ellipse cx="' + f1(x + .6) + '" cy="' + f1(y + .1) + '" rx="2.9" ry=".8" style="fill:#000" opacity=".45"/>';
    o += '<path d="M' + Pt(x - w, y) + 'L' + Pt(x - w, top + .5) + 'Q' + Pt(x, top + 1.2) + ' ' + Pt(x + w, top + .5) + 'L' + Pt(x + w, y) + 'Q' + Pt(x, y + .7) + ' ' + Pt(x - w, y) + 'Z" style="fill:url(#' + (W.grad || K.ivo) + ')"/>';
    // cera escorrida (mesmo marfim, um pouco mais clara) e a borda derretida do topo
    var dx1 = -w + .5 + r1 * .8, dl1 = 2.4 + r2 * 2.6, dx2 = w - 1 - r2 * .5, dl2 = 1.4 + r1 * 1.6;
    o += '<path d="M' + Pt(x + dx1 - .55, top + .6) + 'L' + Pt(x + dx1 - .5, top + dl1) + 'Q' + Pt(x + dx1, top + dl1 + 1) + ' ' + Pt(x + dx1 + .5, top + dl1) + 'L' + Pt(x + dx1 + .55, top + .6) + 'Z" style="fill:' + W.d1 + '" opacity=".55"/>';
    o += '<path d="M' + Pt(x + dx2 - .45, top + .6) + 'L' + Pt(x + dx2 - .4, top + dl2) + 'Q' + Pt(x + dx2, top + dl2 + .8) + ' ' + Pt(x + dx2 + .4, top + dl2) + 'L' + Pt(x + dx2 + .45, top + .6) + 'Z" style="fill:' + W.d2 + '" opacity=".6"/>';
    o += '<ellipse cx="' + f1(x) + '" cy="' + f1(top + .5) + '" rx="' + w + '" ry=".75" style="fill:' + W.top + '"/><ellipse cx="' + f1(x) + '" cy="' + f1(top + .6) + '" rx="' + f1(w * .6) + '" ry=".42" style="fill:' + W.pool + '"/>';
    o += '<path d="M' + Pt(x, top + .5) + 'Q' + Pt(x + .35, top - .6) + ' ' + Pt(x + .15, top - 1.5) + '" style="fill:none;stroke:#1a0f08" stroke-width=".5" stroke-linecap="round"/>';
    // calor da chama na cera do topo
    o += '<path d="M' + Pt(x - w, top + .5) + 'L' + Pt(x - w, top + 3.6) + 'L' + Pt(x + w, top + 3.6) + 'L' + Pt(x + w, top + .5) + 'Z" style="fill:#ffb860" opacity="' + W.heat + '"/>';
    return { body: o, fx: x + .15, fy: top - 1.3 };
  }
  // chama em camadas: borda alaranjada translúcida, miolo branco, um toque azul na base
  function chama(x, y, s, K) {
    var hh = 7.2 * s, ww = 1.75 * s;
    return '<path d="M' + Pt(x + .15 * s, y - hh) + 'C' + Pt(x + ww * .55, y - hh * .62) + ' ' + Pt(x + ww * 1.05, y - hh * .3) + ' ' + Pt(x + ww, y - hh * .12) +
      'C' + Pt(x + ww * .95, y + .9 * s) + ' ' + Pt(x - ww * .95, y + .9 * s) + ' ' + Pt(x - ww, y - hh * .12) + 'C' + Pt(x - ww * 1.05, y - hh * .32) + ' ' + Pt(x - ww * .4, y - hh * .64) + ' ' + Pt(x + .15 * s, y - hh) + 'Z" style="fill:url(#' + K.flame + ')"/>' +
      '<path d="M' + Pt(x + .05 * s, y - hh * .62) + 'C' + Pt(x + ww * .5, y - hh * .34) + ' ' + Pt(x + ww * .55, y - hh * .05) + ' ' + Pt(x, y + .1 * s) + 'C' + Pt(x - ww * .55, y - hh * .05) + ' ' + Pt(x - ww * .45, y - hh * .34) + ' ' + Pt(x + .05 * s, y - hh * .62) + 'Z" style="fill:url(#' + K.flameC + ')"/>' +
      '<ellipse cx="' + f1(x) + '" cy="' + f1(y - .1 * s) + '" rx="' + f1(ww * .55) + '" ry="' + f1(.7 * s) + '" style="fill:#5a8cff" opacity=".35"/>';
  }

  /* ======================= markov4b: Vigília ======================= */
  var VB = montar({
    id: 'b',
    g: { yf: 70, ys: 149, yh: 182, wf: 9.8, ws: 21.6, wh: 14, hb: 15, z0: 8, t: 3.9, ov: .8, wall: 3.6, pl: 1.8 },
    Hx: 380, shF: .36, shL: .3, wsh: 3.2, shOp: .85, lidShOp: .66,
    wood: pal('#231211', '#a08276', 1.8, '#020101'),
    end: pal('#1c0e0d', '#7a5c52', 1.6, '#020101'),
    grain: { bf: '.8 .03', a: .9, b: .5 },
    sat: pal('#a80e26', '#ff6a78', 1.3, '#120004'),
    satC: ['#ff4a5a', '#c0102a', '#4e0411', '#170105'], acB: .85, acF: .15,
    tuft: [7.6, 8.8], pil: 8.8, sheen: .1, lidHi: '#fff0e6', lidSheen: .16, gloss: .2,
    glow0: .3, glow1: .5, topBloom: .55, groove: false, inlay: '#c9a35a',
    brass: '#b38d45', hdl: 4.4, gemR: 1.8, cross: 'latao', czFill: '#c49a4c',
    cz: { yb: 90, yt: 170, yc: 156, hx: 10, w: 1.3, r: 1.45, boss: 2.8 }
  });
  function bDefs(ctx) { return base(ctx); }
  // grupos de três velas vermelhas de alturas diferentes, de pé num prato de ferro, nas divisas junto ao aro
  var RV = 166, RED = { w: 2.4, grad: null, top: '#b4202f', pool: '#6e0a16', d1: '#d8384a', d2: '#8a1020', heat: .3, dish: false };
  function velasB(ctx) {
    var out = [];
    for (var k = 0; k < ctx.NG; k++) {
      var a = -90 + k * ctx.step, p = pol(RV, a), m = k % 2 ? -1 : 1;
      out.push({ a: a, k: k, p: p, c: [[0, -1.2, 13 + rnd(k) * 1.6, 2.5], [-5.6 * m, 1.3, 9 + rnd(k + 9) * 1.4, 2.2], [5.2 * m, 2.1, 6.4 + rnd(k + 4) * 1.2, 2.1]] });
    }
    return out;
  }
  function bStage(ctx) {
    var K = ctx.mk, o = '', k;
    o += rad(K.disc = ctx.uid('mcd'), 'gradientUnits="userSpaceOnUse" cx="230" cy="230" r="198"', [[0, '#1c0a0c'], [.45, '#100506'], [.8, '#060203'], [1, '#020001']]);
    o = '<defs>' + o + '</defs><circle cx="230" cy="230" r="196" style="fill:url(#' + K.disc + ')"/>';
    o += '<g clip-path="url(#' + K.clipD + ')" opacity=".4"><rect x="30" y="30" width="400" height="400" filter="url(#' + K.stone + ')"/></g>';
    o += lajes(ctx, [64], .6);
    // o veludo aceso tinge o chão de vermelho; as velas, de âmbar
    ctx.groups.forEach(function (g) {
      var st = estado(g, ctx, VB);
      if (st.f > 0) o += '<g transform="' + st.tr + '"><ellipse cx="0" cy="' + f1((st.target + VB.yfc) / 2) + '" rx="' + f1(30 + 8 * st.f) + '" ry="' + f1((st.target - VB.yfc) / 2 + 24) + '" style="fill:url(#' + K.hot + ')" opacity="' + (.25 + .5 * st.f).toFixed(2) + '"/></g>';
    });
    velasB(ctx).forEach(function (v) { o += '<circle cx="' + f1(v.p[0]) + '" cy="' + f1(v.p[1] - 6) + '" r="52" style="fill:url(#' + K.pool + ')"/>'; });
    o += sombrasChao(ctx, VB);
    o += '<g clip-path="url(#' + K.clipD + ')" opacity=".42"><rect x="30" y="30" width="400" height="400" filter="url(#' + K.fog + ')"/></g>';
    o += '<circle cx="230" cy="230" r="194" style="fill:url(#' + K.vig + ')"/>';
    return o + rim(ctx);
  }
  function bGroup(g, ctx) { return caixao(g, ctx, VB); }
  function bCenter(ctx) {
    var K = ctx.mk, o = '', fl = '', W = {};
    Object.keys(RED).forEach(function (k) { W[k] = RED[k]; });
    W.grad = K.redwax;
    velasB(ctx).forEach(function (v) {
      var x = v.p[0], y = v.p[1];
      o += '<ellipse cx="' + f1(x + 1.2) + '" cy="' + f1(y + 3.4) + '" rx="11" ry="3.4" style="fill:#000" opacity=".55" filter="url(#' + K.b1 + ')"/>';
      o += '<g filter="url(#' + K.bev + ')"><ellipse cx="' + f1(x) + '" cy="' + f1(y + 2.2) + '" rx="10.4" ry="3.3" style="fill:#3a332d"/></g>' +
        '<ellipse cx="' + f1(x - .4) + '" cy="' + f1(y + 1.9) + '" rx="7.6" ry="2.1" style="fill:#5e0a14" opacity=".9"/>';
      v.c.slice().sort(function (p, q) { return p[1] - q[1]; }).forEach(function (c, j) {
        var w2 = {}; Object.keys(W).forEach(function (k) { w2[k] = W[k]; }); w2.w = c[3];
        var r = velaPe(x + c[0], y + c[1], K, c[2], v.k * 11 + j, w2);
        o += r.body;
        fl += '<circle cx="' + f1(r.fx) + '" cy="' + f1(r.fy - 3) + '" r="' + (c[2] > 12 ? 17 : 13) + '" style="fill:url(#' + K.halo + ')"/>' + chama(r.fx, r.fy, c[2] > 12 ? 1 : .85, K);
      });
      fl += '<circle cx="' + f1(x) + '" cy="' + f1(y - 10) + '" r="50" style="fill:url(#' + K.halo + ')" opacity=".34"/>';
    });
    // névoa rasteira passando por cima dos pés dos caixões
    var fog = '<g clip-path="url(#' + K.clipD + ')" opacity=".16"><rect x="30" y="30" width="400" height="400" filter="url(#' + K.fog + ')" transform="rotate(37 230 230)"/></g>';
    return o + fl + fog + medal(ctx);
  }
  MOTIVOS.markov4b = {
    deck: '01. Markov', nome: 'Caixões: vigília',
    desc: 'Dez caixões hexagonais de ébano laqueado em anel, cabeceira para fora, com filete e cruz de latão dourado e uma pedra na cor do agrupamento. A tampa, grossa, gira presa na cabeceira e projeta sombra longa; o veludo cor de sangue revelado brilha por dentro na proporção exata da pontuação e tinge o chão. Névoa rasteira e grupos de três velas vermelhas num prato de ferro junto ao aro, com halo quente que tinge as cabeceiras.',
    defs: bDefs, stage: bStage, group: bGroup, center: bCenter
  };
  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.markov4b.legenda = { peca: "caixão", masc: true, texto: " é um agrupamento: a tampa se abre e mostra o veludo em proporção à soma das notas, e o mais cheio abre por inteiro." };

  return MOTIVOS.markov4b;
})();
