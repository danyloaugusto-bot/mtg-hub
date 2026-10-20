/* Motivo "copa" do gráfico de pontuação: 02. Elfos, rebranding do lote 2, variação C (Contraluz) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "copa"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Motivo "folhas" do gráfico de pontuação: 02. Elfos (Selva Élfica). Protótipo do rebranding, lote 2, variação C.
   O conceito fica (galhos e folhas da floresta da Lathril); muda a execução: casca, nervura e folha de verdade, nada de
   dente-de-leão. Variações: A, galhos com casca saindo do tronco cortado no centro, cada galho cresce até a soma com folhas
   serrilhadas alternadas; B, uma folha grande por critério, presa num esporão de casca, crescendo pela área com a soma;
   C, contraluz: ramos escuros com folhas compostas translúcidas, acesas pelo sol atrás da copa.
   Regra C: A e C vão de R0 até raio(g.frac), linear com mínimo de 12%; B cresce pela área (raiz), mínimo de 12% do comprimento.
   Curvas e tamanhos por ctx.kit.sorte (semente fixa por deck). */
var MOTIVO_PAINEL = (function () {
  var V = 'C';
  var RT = 57, R0 = 60, RMAX = 178, BL0 = 74, D = Math.PI / 180;
  function cl(f) { return Math.max(0, Math.min(1, f)); }
  function comp(f) { return Math.max(0.12, cl(f)); }
  function area(f) { return Math.max(0.12, Math.sqrt(cl(f))); }
  function raio(f) { return V === 'B' ? BL0 + (RMAX - BL0) * area(f) : R0 + (RMAX - R0) * comp(f); }
  function f1(n) { return (+n).toFixed(1); }
  /* local -> tela: x ao longo da direção am (a partir do centro), y perpendicular */
  function G(am, x, y) { var c = Math.cos(am * D), s = Math.sin(am * D); return [230 + x * c - y * s, 230 + x * s + y * c]; }
  function dd(pts, z) { return 'M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') + (z ? 'Z' : ''); }
  /* a luz vem do alto à esquerda: devolve +1 se o lado +y do galho está virado para ela */
  function ladoLuz(am) { var s = Math.sin(am * D), c = Math.cos(am * D); return (-s * -0.6 + c * -0.8) > 0 ? 1 : -1; }

  /* folha de verdade: limbo lanceolado com margem serrilhada (os dentes apontam para a ponta), nervura central curva e
     nervuras laterais que sobem para a margem. Base em (bx,by) no sistema local do galho, ângulo phi, comprimento L, largura W. */
  function folha(am, bx, by, phi, L, W, o) {
    o = o || {};
    var N = o.n || 14, ser = o.ser == null ? 0.1 : o.ser, curl = o.curl || 0, a = o.a || 0.55, b = o.b || 0.85;
    var tm = a / (a + b), NORM = Math.pow(tm, a) * Math.pow(1 - tm, b), c = Math.cos(phi * D), s = Math.sin(phi * D);
    function P(u, v) { return G(am, bx + u * c - v * s, by + u * s + v * c); }
    function hw(t) { return t <= 0 || t >= 1 ? 0 : W / 2 * Math.pow(t, a) * Math.pow(1 - t, b) / NORM; }
    function mid(t) { return curl * L * Math.sin(Math.PI * t); }
    var up = [], lo = [], k, t, tt, h;
    for (k = 0; k <= N; k++) {
      t = k / N; tt = t; h = hw(t);
      if (k % 2 && k < N) { tt = Math.min(1, t + 0.4 / N); h = hw(t) * (1 + ser); }
      up.push(P(tt * L, mid(tt) + h * (1 + (o.as || 0)))); lo.push(P(tt * L, mid(tt) - h * (1 - (o.as || 0))));
    }
    var contorno = up.concat(lo.slice(1, N).reverse());
    var meio = [], nerv = '';
    for (k = 0; k <= 12; k++) meio.push(P(k / 12 * 0.96 * L, mid(k / 12 * 0.96)));
    var nv = o.nv || 5;
    for (k = 1; k <= nv; k++) {
      var t0 = 0.06 + k * (0.78 / (nv + 1)), t1 = Math.min(0.97, t0 + (o.sobe || 0.16));
      [1, -1].forEach(function (sg) {
        var p0 = P(t0 * L, mid(t0)), pc = P((t0 + (t1 - t0) * 0.35) * L, mid(t0) + sg * hw(t0) * 0.55), p1 = P(t1 * L, mid(t1) + sg * hw(t1) * 0.88);
        nerv += 'M' + f1(p0[0]) + ' ' + f1(p0[1]) + 'Q' + f1(pc[0]) + ' ' + f1(pc[1]) + ' ' + f1(p1[0]) + ' ' + f1(p1[1]);
      });
    }
    var metade = lo.concat(meio.slice().reverse());
    return { d: dd(contorno, true), metade: dd(metade, true), meio: dd(meio), nerv: nerv, base: P(0, 0), ponta: P(L, 0) };
  }

  /* corpo afilado no sistema local: espinha pts (x,y), meia-largura de w0 até w1, deslocado em y por dy */
  function corpoL(am, pts, w0, w1, dy, esc) {
    var L = [], Rr = [], n = pts.length;
    for (var k = 0; k < n; k++) {
      var p = pts[k], q = pts[Math.min(n - 1, k + 1)], r = pts[Math.max(0, k - 1)];
      var dx = q[0] - r[0], dyy = q[1] - r[1], m = Math.hypot(dx, dyy) || 1, nx = -dyy / m, ny = dx / m;
      var w = (w0 + (w1 - w0) * k / Math.max(1, n - 1)) * (esc || 1), off = (dy || 0) * (w0 + (w1 - w0) * k / Math.max(1, n - 1));
      L.push(G(am, p[0] + nx * (off + w), p[1] + ny * (off + w))); Rr.unshift(G(am, p[0] + nx * (off - w), p[1] + ny * (off - w)));
    }
    return dd(L.concat(Rr), true);
  }

  /* casca: sombra no chão, corpo marrom com textura, lado escuro, fio de luz e fissuras longitudinais */
  function casca(am, pts, w0, w1, ctx, silhueta) {
    var I = ctx.k, sl = ladoLuz(am), o = '';
    var sombra = corpoL(am, pts.map(function (p) { return [p[0] + 2, p[1] + 2.5 * sl * -1]; }), w0, w1);
    o += '<path d="' + sombra + '" fill="#000" opacity=".45" filter="url(#' + I.brilho2 + ')"/>';
    if (silhueta) {
      return o + '<path d="' + corpoL(am, pts, w0, w1) + '" fill="#0a0d08"/>' +
        '<path d="' + corpoL(am, pts, w0 * 0.22, w1 * 0.22, sl * 0.85) + '" style="fill:rgba(var(--gold2-rgb),.75)"/>' +
        '<path d="' + corpoL(am, pts, w0 * 0.5, w1 * 0.5, sl * 0.6) + '" style="fill:rgba(var(--gold2-rgb),.25)" filter="url(#' + I.brilho2 + ')"/>';
    }
    o += '<path d="' + corpoL(am, pts, w0, w1) + '" fill="#4a3421" filter="url(#' + I.textura + ')"/>' +
      '<path d="' + corpoL(am, pts, w0 * 0.5, w1 * 0.5, -sl * 0.5) + '" fill="#160e07" opacity=".7"/>' +
      '<path d="' + corpoL(am, pts, w0 * 0.2, w1 * 0.2, sl * 0.5) + '" fill="#c9a274" opacity=".55"/>';
    /* fissuras: traços escuros quebrados ao longo do galho */
    [-0.25, 0.1, 0.42].forEach(function (yy, j) {
      var lin = pts.map(function (p, k) { var w = w0 + (w1 - w0) * k / Math.max(1, pts.length - 1); return G(am, p[0], p[1] + yy * w * 2 * (j % 2 ? 1 : 0.8)); });
      o += '<path d="' + dd(lin) + '" fill="none" stroke="#0d0804" stroke-width=".55" stroke-dasharray="' + (j === 1 ? '6 2.5 3 4' : '3 3.5 8 2') + '" opacity=".85"/>';
    });
    return o;
  }

  var ids = {};
  function top(g, ctx) { return g.frac >= Math.max.apply(null, ctx.groups.map(function (x) { return x.frac; })); }

  /* espinha do galho no sistema local, com curva leve (S) sorteada por critério; a parte real é prefixo do galho cheio */
  function espinha(K, g, x0, xMax) {
    K.sorte(40 + g.i * 13);
    var b1 = (K.sorte() - 0.5) * 11, b2 = (K.sorte() - 0.5) * 6;
    return function (x) { var s = (x - x0) / (xMax - x0); return b1 * Math.sin(Math.PI * s) + b2 * Math.sin(2 * Math.PI * s) * s; };
  }
  function linha(sy, xa, xb, n) { var p = []; for (var k = 0; k <= n; k++) { var x = xa + (xb - xa) * k / n; p.push([x, sy(x)]); } return p; }
  function tangente(sy, x) { return Math.atan2(sy(x + 1) - sy(x - 1), 2) / D; }

  /* camadas de luz de uma folha acesa: corpo com profundidade e textura, metade de baixo na sombra da dobra,
     nervura central clara (o núcleo), nervuras laterais e margem fina */
  function folhaAcesa(F, g, ctx, op) {
    op = op || {};
    return '<path d="' + F.d + '" fill="url(#' + ids.gr[g.i] + ')" filter="url(#' + ctx.k.textura + ')"/>' +
      '<path d="' + F.metade + '" fill="#000" opacity="' + (op.dobra || 0.28) + '"/>' +
      '<path d="' + F.nerv + '" fill="none" stroke="#fff" stroke-width="' + (op.nl || 0.5) + '" opacity=".28" stroke-linecap="round"/>' +
      '<path d="' + F.meio + '" fill="none" stroke="#fffbe8" stroke-width="' + (op.nm || 0.9) + '" opacity="' + (op.om || 0.75) + '" stroke-linecap="round"/>' +
      '<path d="' + F.d + '" fill="none" stroke="#050805" stroke-width=".5" opacity=".45"/>';
  }

  /* ------------------------------------------------------------------ A: galhos com casca */
  /* amostrador de polilinha (sistema local): ponto e ângulo da tangente no comprimento s */
  function amostra(pts) {
    var acc = [0], k;
    for (k = 1; k < pts.length; k++) acc.push(acc[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    return { L: acc[acc.length - 1], at: function (s) {
      for (var j = 1; j < pts.length; j++) if (acc[j] >= s || j === pts.length - 1) {
        var u = Math.max(0, Math.min(1, (s - acc[j - 1]) / ((acc[j] - acc[j - 1]) || 1))), p = pts[j - 1], q = pts[j];
        return { x: p[0] + (q[0] - p[0]) * u, y: p[1] + (q[1] - p[1]) * u, a: Math.atan2(q[1] - p[1], q[0] - p[0]) / D };
      }
    } };
  }
  /* folhas alternadas ao longo de um ramo: de s0 até o fim, de SP em SP; as mais novas (perto da ponta) são menores */
  function folhasAo(am, pts, s0, SP, tam, fase, K, g, ctx, acc) {
    var A = amostra(pts), k = 0;
    for (var s = s0; s < A.L - 4; s += SP, k++) {
      var q = A.at(s), side = (k + fase) % 2 ? 1 : -1, ang = q.a + side * (40 + (K.sorte() - 0.5) * 12);
      var Lf = tam[0] + (tam[1] - tam[0]) * cl((A.L - s) / 55), W = Lf * 0.5;
      var bx = q.x - Math.sin(q.a * D) * side * 1.8, by = q.y + Math.cos(q.a * D) * side * 1.8;
      var F = folha(am, bx, by, ang, Lf, W, { curl: side * 0.06, ser: 0.13, nv: 5, n: 16 }), pb = G(am, q.x, q.y);
      acc.brilho += F.d;
      acc.folhas += '<path d="M' + f1(pb[0]) + ' ' + f1(pb[1]) + 'L' + f1(F.base[0]) + ' ' + f1(F.base[1]) + '" stroke="#3a2a18" stroke-width="1.3"/>' + folhaAcesa(F, g, ctx);
    }
    var fim = A.at(A.L);
    return fim;
  }
  function grupoA(g, ctx) {
    var K = ctx.kit, am = g.am, x0 = 48, x1 = raio(g.frac), sy = espinha(K, g, x0, RMAX);
    var Lt = Math.max(7, Math.min(19, (x1 - R0) * 0.3)), xw = x1 - Lt, o = '', fant = '', acc = { brilho: '', folhas: '' }, madeira = '';
    var len = xw - R0, w0 = 7, w1 = 1.4;
    /* fantasma: o galho cheio, só um fio pontilhado e as folhas que faltam em contorno */
    fant += '<path d="' + dd(linha(sy, xw, RMAX, 16).map(function (p) { return G(am, p[0], p[1]); })) + '" fill="none" style="stroke:rgba(var(--bone-rgb),.22)" stroke-width="1.3" stroke-dasharray="2 3"/>';
    for (var gx = R0 + 10, k = 0; gx < RMAX - 8; gx += 15, k++) if (gx > xw + 3) {
      var sd = k % 2 ? 1 : -1, F0 = folha(am, gx, sy(gx) + sd * 1.8, tangente(sy, gx) + sd * 40, 18, 8.5, { ser: 0.13, n: 16 });
      fant += '<path d="' + F0.d + '" fill="none" style="stroke:rgba(var(--bone-rgb),.18)" stroke-width=".8"/>';
    }
    var lenho = linha(sy, x0, xw + 1, 18);
    madeira += casca(am, lenho, w0, w1, ctx);
    K.sorte(200 + g.i * 7);
    var fork = len > 46, lado = K.sorte() < 0.5 ? 1 : -1;
    /* forquilha: um galho secundário sai a 38% do comprimento, para o lado sorteado, com as próprias folhas */
    if (fork) {
      var xf = R0 + len * 0.36, tf = tangente(sy, xf), af = tf + lado * 30, Lf = len * 0.42, fp = [];
      for (var j = 0; j <= 8; j++) { var u = j / 8, aa = (af - lado * 10 * u) * D; fp.push([xf + Math.cos(aa) * Lf * u, sy(xf) + Math.sin(aa) * Lf * u]); }
      var wf = w0 + (w1 - w0) * (xf - x0) / (xw - x0);
      madeira += casca(am, fp, wf * 0.62, 0.8, ctx);
      var fimF = folhasAo(am, fp, 7, 14, [12, 17], lado > 0 ? 0 : 1, K, g, ctx, acc);
      var Fb = folha(am, fimF.x, fimF.y, fimF.a, 11, 5, { ser: 0.1, n: 14 });
      acc.brilho += Fb.d; acc.folhas += folhaAcesa(Fb, g, ctx);
    }
    folhasAo(am, lenho, R0 + 10 - x0, 16, [13, 24], fork && lado > 0 ? 1 : 0, K, g, ctx, acc);
    /* folha da ponta: fecha o galho exatamente na soma */
    var Ft = folha(am, xw, sy(xw), tangente(sy, xw), Lt + 1, (Lt + 1) * 0.44, { ser: 0.1, nv: 4, n: 16 });
    acc.brilho += Ft.d; acc.folhas += folhaAcesa(Ft, g, ctx);
    o += fant + madeira +
      '<g style="mix-blend-mode:screen"><path d="' + acc.brilho + '" style="fill:' + g.cor + '" filter="url(#' + ctx.k.brilho + ')" opacity="' + (top(g, ctx) ? 0.7 : 0.42) + '"/></g>' +
      '<g class="fill">' + acc.folhas + '</g>';
    if (top(g, ctx)) o += raioDeSol(am, x1, ctx);
    return o;
  }

  /* o sol que atravessa a copa e cai no galho (ou na folha) mais alto */
  function raioDeSol(am, x1, ctx) {
    var c = G(am, R0 + (x1 - R0) * 0.62, 0), r = 18 + (x1 - R0) * 0.22;
    return '<g style="mix-blend-mode:screen" pointer-events="none"><circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + f1(r) + '" fill="url(#' + ids.sol + ')" opacity=".55"/>' +
      [0.3, 0.55, 0.8, 0.95].map(function (t, j) { var q = G(am, R0 + (x1 - R0) * t, (j % 2 ? 1 : -1) * (8 + j * 3)); return '<circle cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="' + (0.9 + j * 0.25) + '" fill="#fff8dc" opacity=".75"/>'; }).join('') + '</g>';
  }

  /* ------------------------------------------------------------------ B: uma folha grande por critério */
  function folhaB(g, ctx, L) {
    var K = ctx.kit; K.sorte(70 + g.i * 11);
    var sg = g.i % 2 ? 1 : -1, tilt = sg * (7 + K.sorte() * 6), curl = -sg * (0.035 + K.sorte() * 0.03), pec = L * 0.12;
    var yb = 0, F = folha(g.am, BL0 + pec, yb, tilt, L - pec, (L - pec) * 0.52, { n: 30, ser: 0.08, curl: curl, nv: 9, a: 0.6, b: 1.2, sobe: 0.2, as: 0.08 });
    var pa = G(g.am, BL0 - 1, 0), pz = F.base;
    return { F: F, pec: 'M' + f1(pa[0]) + ' ' + f1(pa[1]) + 'L' + f1(pz[0]) + ' ' + f1(pz[1]) };
  }
  function grupoB(g, ctx) {
    var x1 = raio(g.frac), L = x1 - BL0, cheio = folhaB(g, ctx, RMAX - BL0), B = folhaB(g, ctx, L), F = B.F, o = '';
    /* fantasma: a folha cheia em contorno pontilhado */
    o += '<path d="' + cheio.F.d + '" style="fill:rgba(var(--bone-rgb),.04);stroke:rgba(var(--bone-rgb),.22)" stroke-width=".9" stroke-dasharray="2.5 2.5"/>';
    /* esporão de casca que sai do tronco, com dois botões */
    var sy = function () { return 0; }, lenho = linha(sy, 46, BL0 + 1, 6);
    o += casca(g.am, lenho, 4.4, 2.2, ctx);
    var bt = G(g.am, BL0 - 6, ladoLuz(g.am) * -3.6);
    o += '<ellipse cx="' + f1(bt[0]) + '" cy="' + f1(bt[1]) + '" rx="2.2" ry="1.5" transform="rotate(' + f1(g.am + 30) + ' ' + f1(bt[0]) + ' ' + f1(bt[1]) + ')" fill="#6b4d2c" stroke="#1a1008" stroke-width=".5"/>';
    /* sombra da folha no chão da mata */
    o += '<path d="' + F.d + '" fill="#000" opacity=".5" transform="translate(2.5 3.5)" filter="url(#' + ctx.k.brilho2 + ')"/>';
    o += '<g style="mix-blend-mode:screen"><path d="' + F.d + '" style="fill:' + g.cor + '" filter="url(#' + ctx.k.brilho + ')" opacity="' + (top(g, ctx) ? 0.7 : 0.4) + '"/></g>';
    o += '<path d="' + B.pec + '" style="stroke:' + g.rgba(0.95) + '" stroke-width="' + f1(Math.max(1, L * 0.03)) + '" stroke-linecap="round"/>';
    o += '<g class="fill">' + folhaAcesa(F, g, ctx, { nm: Math.max(0.8, L * 0.016), nl: Math.max(0.45, L * 0.007), dobra: 0.3, om: 0.55 });
    /* nervuras terciárias: a rede miúda entre as laterais, só nas folhas grandes */
    if (L > 40) o += '<path d="' + F.d + '" fill="url(#' + ids.rede + ')" opacity=".25"/>';
    o += '</g>';
    if (top(g, ctx)) o += raioDeSol(g.am, x1, ctx);
    return o;
  }

  /* ------------------------------------------------------------------ C: contraluz, folhas compostas */
  function grupoC(g, ctx) {
    var K = ctx.kit, am = g.am, x0 = 48, x1 = raio(g.frac), sy = espinha(K, g, x0, RMAX);
    var Lt = Math.max(6, Math.min(17, (x1 - R0) * 0.3)), xw = x1 - Lt, SP = 15, o = '', brilho = '', folhas = '', fant = '', I = ctx.k;
    fant += '<path d="' + dd(linha(sy, xw, RMAX, 16).map(function (p) { return G(am, p[0], p[1]); })) + '" fill="none" style="stroke:rgba(var(--bone-rgb),.2)" stroke-width="1.1" stroke-dasharray="2 3"/>';
    K.sorte(300 + g.i * 5);
    for (var k = 0, x = R0 + 12; x < RMAX - 8; k++, x += SP) {
      var real = x < xw - 2, Lf = real ? 11 + 10 * cl((xw - x) / 45) : 19, tg = tangente(sy, x);
      [1, -1].forEach(function (side) {
        var F = folha(am, x, sy(x), tg + side * (50 + (K.sorte() - 0.5) * 8), Lf, Lf * 0.42, { ser: 0.06, nv: 5, curl: side * 0.07, a: 0.5, b: 1.0, n: 16 });
        if (real) {
          brilho += F.d;
          folhas += '<path d="' + F.d + '" fill="url(#' + ids.gr[g.i] + ')" opacity=".92"/>' +
            '<path d="' + F.d + '" fill="url(#' + ids.contra + ')" style="mix-blend-mode:screen"/>' +
            '<path d="' + F.nerv + '" fill="none" stroke="#071006" stroke-width=".45" opacity=".55"/>' +
            '<path d="' + F.meio + '" fill="none" stroke="#071006" stroke-width=".8" opacity=".6"/>' +
            '<path d="' + F.d + '" fill="none" style="stroke:' + g.rgba(1) + '" stroke-width=".6"/>';
        } else if (x > xw + 2) fant += '<path d="' + F.d + '" fill="none" style="stroke:rgba(var(--bone-rgb),.16)" stroke-width=".8"/>';
      });
    }
    var Ft = folha(am, xw, sy(xw), tangente(sy, xw), Lt + 1, (Lt + 1) * 0.36, { ser: 0.05, nv: 3 });
    brilho += Ft.d;
    folhas += '<path d="' + Ft.d + '" fill="url(#' + ids.gr[g.i] + ')"/><path d="' + Ft.d + '" fill="url(#' + ids.contra + ')" style="mix-blend-mode:screen"/>' +
      '<path d="' + Ft.meio + '" fill="none" stroke="#071006" stroke-width=".7" opacity=".6"/>';
    var lenho = linha(sy, x0, xw + 1, 14);
    o += fant + '<g style="mix-blend-mode:screen"><path d="' + brilho + '" style="fill:' + g.cor + '" filter="url(#' + I.brilho + ')" opacity="' + (top(g, ctx) ? 0.95 : 0.65) + '"/></g>' +
      casca(am, lenho, 3.4, 0.8, ctx, true) + '<g class="fill"><g filter="url(#' + I.textura + ')">' + folhas + '</g></g>';
    if (top(g, ctx)) o += raioDeSol(am, x1, ctx);
    return o;
  }

  return {
    raio: raio,
    legenda: V === 'B' ? { peca: 'folha', masc: false, texto: ' é um critério: a folha cresce com a soma, pela área.' } :
      { peca: 'galho', masc: true, texto: ' é um critério: o galho cresce até a soma, com folhas ao longo dele.' },
    defs: function (ctx) {
      var o = ctx.kit.defs(ctx, 'fl');
      ids = { chao: ctx.uid('flC'), tronco: ctx.uid('flT'), sol: ctx.uid('flS'), rede: ctx.uid('flR'), contra: ctx.uid('flK'), halo: ctx.uid('flH'), casca: ctx.uid('flX'), gr: [] };
      ctx.groups.forEach(function (g) {
        var id = ctx.uid('flG'); ids.gr.push(id);
        o += V === 'C' ?
          '<radialGradient id="' + id + '" cx=".5" cy=".5" r=".6"><stop offset="0" style="stop-color:#fff;stop-opacity:.9"/><stop offset=".45" style="stop-color:' + g.cor + '"/><stop offset="1" style="stop-color:' + g.cor + ';stop-opacity:.55"/></radialGradient>' :
          '<radialGradient id="' + id + '" cx=".36" cy=".3" r=".85"><stop offset="0" style="stop-color:#fff;stop-opacity:.4"/><stop offset=".34" style="stop-color:' + g.cor + '"/><stop offset=".75" style="stop-color:' + g.cor + '"/><stop offset="1" style="stop-color:rgba(0,0,0,.6)"/></radialGradient>';
      });
      o += '<radialGradient id="' + ids.sol + '"><stop offset="0" stop-color="#fff6d8" stop-opacity=".6"/><stop offset=".5" stop-color="#fff6d8" stop-opacity=".18"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>';
      o += '<pattern id="' + ids.rede + '" patternUnits="userSpaceOnUse" width="7" height="7"><path d="M0 3.5L3.5 0L7 3.5L3.5 7Z M3.5 0V2 M0 3.5H2" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".35"/></pattern>';
      o += '<radialGradient id="' + ids.contra + '" cx=".45" cy=".45" r=".55"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>';
      o += V === 'C' ?
        '<radialGradient id="' + ids.chao + '" cx="150" cy="120" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#5c5a2c"/><stop offset=".3" stop-color="#2c3a20"/><stop offset=".7" stop-color="#111c12"/><stop offset="1" stop-color="#070d08"/></radialGradient>' :
        '<radialGradient id="' + ids.chao + '" cx="230" cy="230" r="196" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1f2d20"/><stop offset=".6" stop-color="#132016"/><stop offset="1" stop-color="#09110b"/></radialGradient>';
      o += '<radialGradient id="' + ids.tronco + '" cx="227" cy="226" r="' + RT + '" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1c130c"/><stop offset=".55" stop-color="#2d1f13"/><stop offset=".86" stop-color="#4a3420"/><stop offset=".9" stop-color="#2a1b0f"/><stop offset="1" stop-color="#130b05"/></radialGradient>';
      o += '<filter id="' + ids.casca + '" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="turbulence" baseFrequency=".9 .12" numOctaves="2" seed="7" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .05  0 0 0 0 .03  0 0 0 0 .01  0 0 0 1.4 -.35"/><feComposite in2="SourceGraphic" operator="in"/></filter>';
      return o;
    },
    stage: function (ctx) {
      var K = ctx.kit, Rd = ctx.R + 10, o = '<circle cx="230" cy="230" r="' + Rd + '" style="fill:url(#' + ids.chao + ');stroke:rgba(var(--gold-rgb),.38)" stroke-width="1.2"/>';
      /* luz salpicada da copa: manchas claras e difusas no chão da mata */
      K.sorte(900);
      var man = '';
      for (var k = 0; k < (V === 'C' ? 6 : 11); k++) {
        var a = K.sorte() * 360, r = 70 + K.sorte() * 105, p = G(a, r, 0);
        man += '<ellipse cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" rx="' + f1(6 + K.sorte() * 12) + '" ry="' + f1(4 + K.sorte() * 7) + '" transform="rotate(' + f1(K.sorte() * 180) + ' ' + f1(p[0]) + ' ' + f1(p[1]) + ')"/>';
      }
      o += '<g fill="#e9e2a8" opacity="' + (V === 'C' ? 0.1 : 0.08) + '" filter="url(#' + ctx.k.brilho + ')">' + man + '</g>';
      if (V === 'C') {
        /* raios de sol entrando pela copa, do alto à esquerda */
        o += '<g opacity=".11" filter="url(#' + ctx.k.brilho + ')" fill="#fff3c0"><path d="M70 60L120 40L360 400L300 420Z"/><path d="M150 46L180 40L410 330L380 350Z"/><path d="M50 150L66 120L280 420L250 425Z"/></g>';
      }
      /* folhagem distante: silhuetas de folhas escuras na borda, o sub-bosque */
      var sb = '';
      K.sorte(950);
      for (var j = 0; j < 30; j++) {
        var aa = j * 12 + K.sorte() * 8, F = folha(aa, Rd - 4 - K.sorte() * 8, 0, 180 + (K.sorte() - 0.5) * 70, 12 + K.sorte() * 8, 5 + K.sorte() * 2, { ser: 0.1, n: 10 });
        sb += F.d;
      }
      o += '<path d="' + sb + '" fill="#050a06" opacity=".55"/>';
      o += '<circle cx="230" cy="230" r="' + Rd + '" fill="none" style="stroke:rgba(var(--gold-rgb),.3)" stroke-width="1"/>';
      return o;
    },
    group: function (g, ctx) { return V === 'A' ? grupoA(g, ctx) : V === 'B' ? grupoB(g, ctx) : grupoC(g, ctx); },
    center: function (ctx) {
      /* o tronco cortado: casca rachada em volta, anéis de crescimento irregulares e uma fenda do cerne para fora */
      var K = ctx.kit, o = '<circle cx="232" cy="233" r="' + (RT + 2) + '" fill="#000" opacity=".55" filter="url(#' + ctx.k.brilho2 + ')"/>';
      o += '<circle cx="230" cy="230" r="' + RT + '" fill="url(#' + ids.tronco + ')"/>';
      K.sorte(990);
      var an = '';
      for (var k = 0; k < 9; k++) {
        var r = 8 + k * 5.2, pts = [], fz = K.sorte() * 6;
        for (var t = 0; t <= 36; t++) { var a = t * 10, w = r + Math.sin(a * D * 3 + fz) * 0.9 + Math.sin(a * D * 5 + fz * 2) * 0.5; pts.push(G(a, w, 0).map(function (v, ix) { return ix ? v - 2 : v - 2; })); }
        an += dd(pts, true);
      }
      o += '<path d="' + an + '" fill="none" stroke="#e8c48e" stroke-width=".55" opacity=".16"/>';
      o += '<path d="' + an + '" fill="none" stroke="#000" stroke-width=".9" opacity=".25" transform="translate(.6 .6)"/>';
      var fe = [G(-58, 10, 0), G(-60, 26, 1.4), G(-57, 40, -1), G(-59, 51, 0)];
      o += '<path d="' + dd(fe) + '" fill="none" stroke="#000" stroke-width="1.1" opacity=".5"/>';
      /* casca: anel grosso com fissuras */
      o += '<circle cx="230" cy="230" r="' + (RT - 2.6) + '" fill="none" stroke="#2a1a0c" stroke-width="5.6"/>' +
        '<circle cx="230" cy="230" r="' + (RT - 2.6) + '" fill="none" stroke="#7a5532" stroke-width="5.6" filter="url(#' + ids.casca + ')"/>' +
        '<circle cx="230" cy="230" r="' + (RT - 5.6) + '" fill="none" stroke="#c39a66" stroke-width=".7" opacity=".55"/>' +
        '<circle cx="230" cy="230" r="' + RT + '" fill="none" style="stroke:rgba(var(--gold-rgb),' + (V === 'C' ? '.7' : '.45') + ')" stroke-width="1"/>';
      if (V === 'C') o += '<circle cx="230" cy="230" r="' + (RT + 3) + '" fill="none" style="stroke:rgba(var(--gold2-rgb),.35)" stroke-width="4" filter="url(#' + ctx.k.brilho2 + ')"/>';
      return o;
    }
  };
})();
