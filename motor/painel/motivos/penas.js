/* Motivo "penas" do gráfico de pontuação: 01. Giada, rebranding (lotes 3 e 4), variação R (Penas sobre veludo) escolhida pelo dono em 20/10/2026.
   O build inclui este arquivo só no painel cujo tema.json tem "grafico": "penas"; a moldura (rótulos, placar, clique) é o motivoSvg do app.js. */
/* Protótipo R (rebranding, 2ª rodada) do motivo "penas": 01. Giada (Asas da Esperança), escolhido pelo dono na segunda rodada da votação de 15/10/2026.
   Veio do protótipo motivos/giada2.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "penas"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Giada, Font of Hope, Asas da Esperança: opções 3 e 4.
     Moldura comum às duas: um par de asas grandes e realistas erguidas atrás do disco (rêmiges, grandes, médias e pequenas
     coberteiras em fileiras sobrepostas, cada pena com raque, barbas, sombra e luz), esmaecidas atrás dos rótulos e nas
     bordas, e uma auréola dourada flutuando acima do disco.
     giada3: oito penas brancas saem do medalhão na direção dos rótulos; o comprimento é proporcional à pontuação.
     giada4: oito penas de ouro como raios de um sol, dentro de um anel de auréola. */
  (function () {
    var D = Math.PI / 180, I = {}, DEC = 1;   // DEC = casas decimais das coordenadas (0 nas penas grandes das asas)
    function F(n) { return DEC ? (+n).toFixed(1) : String(Math.round(n)); }
    function pt(p) { return F(p[0]) + ' ' + F(p[1]); }
    function smooth(P, closed) {   // Catmull-Rom
      var n = P.length, d = 'M' + pt(P[0]);
      function at(i) { return closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))]; }
      for (var i = 0; i < (closed ? n : n - 1); i++) {
        var p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
        d += 'C' + F(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + F(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
          F(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + F(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + pt(p2);
      }
      return d + (closed ? 'Z' : '');
    }
    // caminho suave pelos pontos médios (quadráticas): mais curto que o Catmull-Rom; usado nas penas das asas
    function smoothQ(P, closed) {
      var n = P.length, d, i;
      function mid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
      if (closed) {
        d = 'M' + pt(mid(P[n - 1], P[0]));
        for (i = 0; i < n; i++) d += 'Q' + pt(P[i]) + ' ' + pt(mid(P[i], P[(i + 1) % n]));
        return d + 'Z';
      }
      d = 'M' + pt(P[0]);
      for (i = 1; i < n - 1; i++) d += 'Q' + pt(P[i]) + ' ' + pt(mid(P[i], P[i + 1]));
      return d + 'L' + pt(P[n - 1]);
    }
    function tab(T, x) {
      if (x <= T[0][0]) return T[0][1];
      for (var k = 0; k + 1 < T.length; k++) if (x <= T[k + 1][0]) return T[k][1] + (T[k + 1][1] - T[k][1]) * (x - T[k][0]) / (T[k + 1][0] - T[k][0]);
      return T[T.length - 1][1];
    }
    function hash(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
    function rgb(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
    function mix(a, b, t) {
      var A = rgb(a), B = rgb(b);
      return '#' + [0, 1, 2].map(function (i) { var v = Math.round(A[i] + (B[i] - A[i]) * t); return (v < 16 ? '0' : '') + v.toString(16); }).join('');
    }
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
    function pol(r, a) { return [230 + r * Math.cos(a * D), 230 + r * Math.sin(a * D)]; }

    /* ---------- geometria de uma pena ----------
       B = base, ang = direção (graus), len, w = largura máxima. A raque é uma curva suave; a barba "da frente" (A) fica do
       lado anti-horário e é mais estreita (lead), a de trás (V) é larga; a ponta é arredondada; bordas levemente
       irregulares e alguns rasgos (notch) dão o ar de pena de verdade. o.lite: 0 = completa (penas do dado),
       1 = sem penugem, 2 = só contorno, meia-sombra, borda e raque (escamas pequenas). o.q usa curvas quadráticas
       (caminho mais curto) e o.bd é o espaçamento das barbas. */
    function pena(B, ang, len, w, o) {
      o = o || {};
      var N = o.N || 28, lite = o.lite || 0, sm = o.q ? smoothQ : smooth, lead = o.lead == null ? 0.36 : o.lead, curv = o.curv == null ? 0.04 : o.curv,
        tz = Math.min(o.tip == null ? 0.2 : o.tip, (o.tipMax || 80) / len), q = o.quill == null ? 0.06 : o.quill,
        rough = o.rough == null ? 0.05 : o.rough, seed = o.seed || 1, taper = o.taper == null ? 0.2 : o.taper;
      var c = Math.cos(ang * D), s = Math.sin(ang * D), T = [B[0] + c * len, B[1] + s * len],
        K = [(B[0] + T[0]) / 2 - s * len * curv, (B[1] + T[1]) / 2 + c * len * curv];
      var A = [], V = [], R = [], E = [], j, t, k;
      for (j = 0; j <= N; j++) {
        t = j / N;
        var u = 1 - t, p = [u * u * B[0] + 2 * u * t * K[0] + t * t * T[0], u * u * B[1] + 2 * u * t * K[1] + t * t * T[1]];
        var dx = 2 * u * (K[0] - B[0]) + 2 * t * (T[0] - K[0]), dy = 2 * u * (K[1] - B[1]) + 2 * t * (T[1] - K[1]), l = Math.hypot(dx, dy) || 1, ex = -dy / l, ey = dx / l;
        var pr = t < q ? 0.1 : t < q + 0.2 ? 0.1 + 0.9 * Math.sin((t - q) / 0.2 * Math.PI / 2) : 1;
        pr *= 1 - taper * t;
        if (t > 1 - tz) pr *= Math.sqrt(Math.max(0, 1 - Math.pow((t - 1 + tz) / tz, 2)));
        var na = 1 + rough * (hash(seed + j * 3.1) - 0.5) * 2, nb = 1 + rough * (hash(seed + 50 + j * 2.3) - 0.5) * 2;
        (o.notch || []).forEach(function (nn) { if (Math.abs(t - nn[0]) < 0.6 / N) { if (nn[2] < 0) na *= 1 - nn[1]; else nb *= 1 - nn[1]; } });
        A.push([p[0] - ex * w * pr * lead * na, p[1] - ey * w * pr * lead * na]);
        V.push([p[0] + ex * w * pr * (1 - lead) * nb, p[1] + ey * w * pr * (1 - lead) * nb]);
        R.push(p); E.push([ex, ey]);
      }
      function at(P, t) { var x = clamp(t, 0, 1) * N, i = Math.min(N - 1, Math.floor(x)), f = x - i; return [P[i][0] + (P[i + 1][0] - P[i][0]) * f, P[i][1] + (P[i + 1][1] - P[i][1]) * f]; }
      function toward(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; }
      var res = { B: B, T: T, R: R, A: A, V: V, at: at };
      res.d = sm(A.concat(V.slice(1, N).reverse()), true);
      res.half = sm(R.slice(0, N).concat(V.slice(1, N).reverse()), true);
      res.lead = sm(A.slice(Math.round(N * q), N), false);
      // raque afinando, como um polígono fino
      var rw = o.rachis || Math.max(0.5, w * 0.05), L1 = [], L2 = [];
      for (j = 0; j <= N - 1; j++) { var hw = rw * (1 - 0.85 * j / N) * 0.5; L1.push([R[j][0] + E[j][0] * hw, R[j][1] + E[j][1] * hw]); L2.push([R[j][0] - E[j][0] * hw, R[j][1] - E[j][1] * hw]); }
      if (lite > 1) res.rachisL = 'M' + pt(R[0]) + 'L' + pt(R[Math.round(N * 0.85)]);
      else res.rachis = 'M' + L1.map(pt).join('L') + 'L' + L2.reverse().map(pt).join('L') + 'Z';
      res.spine = 'M' + R.filter(function (p, i) { return i % 4 === 0 && i < N * 0.92; }).map(pt).join('L');
      if (!lite) res.halfA = sm(R.slice(0, N).concat(A.slice(1, N).reverse()), true);
      if (lite < 2) {
        // barbas: traços finos da raque até a borda, inclinados para a ponta
        var nbarb = Math.max(5, Math.round(len / (o.bd || 2.4))), bA = '', bV = '', dA = Math.min(0.3, w * lead / len * 1.2), dV = Math.min(0.3, w * (1 - lead) / len * 1.1);
        var b0 = Math.max(q + 0.06, o.b0 || 0);   // as barbas só onde a pena aparece (a base fica sob a fileira de cima)
        nbarb = Math.max(4, Math.round(nbarb * (0.96 - b0) / (0.9 - q)));
        for (k = 0; k < nbarb; k++) {
          t = b0 + (0.96 - b0) * (k + 0.5) / nbarb;
          var r0 = at(R, t), ea = toward(r0, at(A, t + dA), 0.94), ev = toward(r0, at(V, t + dV), 0.94);
          bA += 'M' + pt(r0) + 'l' + F(ea[0] - r0[0]) + ' ' + F(ea[1] - r0[1]);
          bV += 'M' + pt(r0) + 'l' + F(ev[0] - r0[0]) + ' ' + F(ev[1] - r0[1]);
        }
        res.bA = bA; res.bV = bV;
        // rasgos: onde a borda tem um entalhe, uma fenda escura sobe na direção da raque, seguindo as barbas
        res.splits = '';
        (o.notch || []).forEach(function (nn) {
          var tn = nn[0], P = nn[2] < 0 ? A : V, e0 = at(P, tn), r2 = at(R, tn - (nn[2] < 0 ? dA : dV) * 0.9);
          res.splits += 'M' + pt(toward(r2, e0, 0.25)) + 'L' + pt(e0);
        });
      }
      if (!lite) {   // penugem da base: fios soltos que saem da haste nua
        res.down = '';
        for (k = 0; k < 7; k++) {
          t = q * 0.6 + (q + 0.14) * k / 7;
          var r1 = at(R, t), side = k % 2 ? 1 : -1, e = E[Math.round(clamp(t, 0, 1) * N)], dd = w * (0.55 + 0.25 * hash(seed + k)) * (side > 0 ? 1 - lead : lead) * 1.5;
          var tipD = at(R, t + 0.05 + 0.05 * hash(seed + 9 + k));
          res.down += 'M' + pt(r1) + 'Q' + pt([r1[0] + e[0] * side * dd * 0.6, r1[1] + e[1] * side * dd * 0.6]) + ' ' + pt([tipD[0] + e[0] * side * dd, tipD[1] + e[1] * side * dd]);
        }
      }
      return res;
    }

    function star4(x, y, r, fill, glow) {
      var k = r * 0.18;
      return '<path d="M' + F(x) + ' ' + F(y - r) + 'C' + F(x + k) + ' ' + F(y - k) + ' ' + F(x + k) + ' ' + F(y - k) + ' ' + F(x + r) + ' ' + F(y) +
        'C' + F(x + k) + ' ' + F(y + k) + ' ' + F(x + k) + ' ' + F(y + k) + ' ' + F(x) + ' ' + F(y + r) +
        'C' + F(x - k) + ' ' + F(y + k) + ' ' + F(x - k) + ' ' + F(y + k) + ' ' + F(x - r) + ' ' + F(y) +
        'C' + F(x - k) + ' ' + F(y - k) + ' ' + F(x - k) + ' ' + F(y - k) + ' ' + F(x) + ' ' + F(y - r) + 'Z" style="fill:' + (fill || '#fffaf0') + '"' +
        (glow ? ' filter="url(#' + I.glow + ')"' : '') + '/>';
    }

    /* ---------- a moldura de asas ----------
       Desenha-se a asa direita; a esquerda é a mesma, espelhada (x -> 460 - x). O braço (borda de ataque) nasce atrás do
       disco, sobe para fora até o punho, no alto, e desce um pouco até a mão; as penas pendem dele para baixo, em cinco
       fileiras: rêmiges longas por baixo, coberteiras cada vez menores por cima, e escamas junto ao braço. A luz vem da
       auréola: as penas são brancas e douradas no alto e azuladas embaixo. */
    var ARM = [[284, 206], [320, 134], [362, 76], [410, 36], [456, 16], [490, 22], [502, 46]];
    var PHI = [[0, 106], [0.3, 100], [0.5, 96], [0.7, 94], [1, 96]];         // direção das penas ao longo do braço
    var LEN = [[0, 180], [0.3, 250], [0.5, 300], [0.7, 330], [0.85, 345], [1, 340]];   // comprimento das rêmiges
    var ROWS = [   // a primeira é uma fileira de fundo, na sombra, que aparece entre as rêmiges e por fora delas
      { n: 12, s0: 0.45, s1: 1, off: 14, k: 0.96, w: 40, lead: 0.3, curv: -0.09, tip: 0.14, tipMax: 40, da: -9, dark: -0.22, N: 18, lite: 2 },
      { n: 20, s0: 0.14, s1: 1, off: 12, k: 1, w: 40, lead: 0.3, curv: -0.07, tip: 0.14, tipMax: 40, N: 20, lite: 1, bd: 4.4, b0: 0.4 },
      { n: 24, s0: 0.12, s1: 1, off: 8, k: 0.5, kmax: 165, w: 30, lead: 0.36, curv: -0.04, tip: 0.3, tipMax: 22, N: 14, lite: 1, bd: 3.8, b0: 0.38 },
      { n: 28, s0: 0.14, s1: 1, off: 4, k: 0.28, kmax: 88, w: 22, lead: 0.4, curv: -0.02, tip: 0.45, tipMax: 14, N: 12, lite: 1, bd: 3.4, b0: 0.3 },

      { n: 32, s0: 0.18, s1: 1, off: 1, k: 0.13, kmax: 36, w: 16, lead: 0.44, curv: 0.02, tip: 0.6, tipMax: 10, N: 9, lite: 2 },
      { n: 38, s0: 0.2, s1: 1, off: -2, k: 0.07, kmax: 20, w: 12, lead: 0.46, curv: 0.02, tip: 0.7, tipMax: 7, N: 8, lite: 2 }
    ];
    var armCache = null;
    function armSample() {
      if (armCache) return armCache;
      var P = [], n = ARM.length, i, j;
      function at(i) { return ARM[Math.max(0, Math.min(n - 1, i))]; }
      for (i = 0; i < n - 1; i++) {
        var p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
        for (j = 0; j < 20; j++) {
          var t = j / 20, t2 = t * t, t3 = t2 * t;
          P.push([0, 1].map(function (k) { return 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3); }));
        }
      }
      P.push(ARM[n - 1]);
      var L = [0];
      for (i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
      armCache = { P: P, L: L, tot: L[L.length - 1] };
      return armCache;
    }
    function armAt(s) {
      var A = armSample(), x = s * A.tot, i = 1;
      while (i < A.L.length - 1 && A.L[i] < x) i++;
      var f = (x - A.L[i - 1]) / ((A.L[i] - A.L[i - 1]) || 1);
      return [A.P[i - 1][0] + (A.P[i][0] - A.P[i - 1][0]) * f, A.P[i - 1][1] + (A.P[i][1] - A.P[i - 1][1]) * f];
    }
    // luz num ponto: plena no alto, perto da auréola, caindo para o azul embaixo
    function lightAt(p) { return clamp(1.24 - Math.max(0, p[1] - 25) / 400 - Math.abs(p[0] - 230) / 1500, 0.36, 1); }

    function wingFeather(f, boost, ri) {
      var id = I.uid('gaw'), b = boost || 0;
      function L(t) { return clamp(lightAt(f.at(f.R, t)) + b, 0, 1); }
      var Lm = L(0.5), big = ri < 2;
      var o = '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="' + pt(f.B).replace(' ', '" y1="') + '" x2="' + pt(f.T).replace(' ', '" y2="') + '">' +
        '<stop offset="0" stop-color="' + mix('#0a1230', '#66748f', L(0.05)) + '"/>' +
        '<stop offset="' + (big ? '.2' : '.3') + '" stop-color="' + mix('#33425f', '#e9edf4', L(0.25)) + '"/>' +
        '<stop offset=".55" stop-color="' + mix('#536482', '#fffaf0', L(0.55)) + '"/>' +
        '<stop offset=".86" stop-color="' + mix('#33425f', '#e2e7f0', L(0.86)) + '"/>' +
        '<stop offset="1" stop-color="' + mix('#26324e', '#c5cede', L(1)) + '"/></linearGradient>';
      o += '<path d="' + f.d + '" fill="url(#' + id + ')" stroke="#070c2a" stroke-opacity=".6" stroke-width=".5"/>';
      if (f.halfA) o += '<path d="' + f.halfA + '" fill="#fff" fill-opacity="' + F((big ? 0.03 : 0.08) + (big ? 0.12 : 0.2) * Lm) + '"/>';
      o += '<path d="' + f.half + '" fill="#22325e" fill-opacity="' + F(0.2 + 0.2 * (1 - Lm)) + '"/>';
      if (f.bV) o += '<path d="' + f.bV + '" fill="none" stroke="#2c3d66" stroke-opacity="' + (big ? '.34' : '.24') + '" stroke-width="' + (big ? '.5' : '.4') + '"/>' +
        '<path d="' + f.bA + '" fill="none" stroke="#fff" stroke-opacity="' + F(0.08 + 0.22 * Lm) + '" stroke-width=".35"/>';
      o += '<path d="' + f.lead + '" fill="none" stroke="#fff6e4" stroke-opacity="' + F(0.06 + 0.5 * Lm * Lm) + '" stroke-width=".7"/>';
      if (f.splits) o += '<path d="' + f.splits + '" fill="none" stroke="#0b1430" stroke-opacity=".45" stroke-width=".7" stroke-linecap="round"/>';
      if (big) o += '<path d="' + f.spine + '" fill="none" stroke="#fff" stroke-opacity="' + F(0.06 + 0.12 * Lm) + '" stroke-width="2.6" stroke-linejoin="round"/>';
      if (f.rachisL) return o + '<path d="' + f.rachisL + '" fill="none" stroke="#f6f1e2" stroke-opacity="' + F(0.4 + 0.5 * Lm) + '" stroke-width=".6"/>';
      return o + '<path d="' + f.rachis + '" fill="#f6f1e2" fill-opacity="' + F(0.4 + 0.5 * Lm) + '"/>';
    }

    function wing() {
      var o = '';
      ROWS.forEach(function (rw, ri) {
        var row = '';
        for (var i = 0; i < rw.n; i++) {
          var s = rw.s0 + (rw.s1 - rw.s0) * i / (rw.n - 1), a = tab(PHI, s) + Math.max(0, ri - 1) * 2 + (rw.da || 0) + 4 * (hash(ri * 31 + i * 7) - 0.5), A = armAt(s);
          var B = [A[0] + Math.cos(a * D) * rw.off, A[1] + Math.sin(a * D) * rw.off];
          var len = Math.min(rw.kmax || 999, rw.k * tab(LEN, s)) * (0.94 + 0.12 * hash(ri * 100 + i)), w = rw.w * (0.92 + 0.16 * hash(ri * 77 + i * 3));
          var notch = ri < 2 ? [[0.55 + 0.3 * hash(i * 7 + ri), 0.35, 1], [0.4 + 0.3 * hash(i * 11 + ri), 0.25, -1]] : ri === 2 && hash(i * 5) > 0.5 ? [[0.6, 0.3, 1]] : [];
          DEC = ri < 3 ? 0 : 1;
          var f = pena(B, a, len, w, { lead: rw.lead, curv: rw.curv, tip: rw.tip, tipMax: rw.tipMax, seed: ri * 1000 + i * 13, notch: notch, rough: 0.05,
            quill: ri > 1 ? 0.03 : 0.05, q: true, N: rw.N, lite: rw.lite, bd: rw.bd, b0: rw.b0 });
          DEC = 1;
          // penas inteiramente escondidas atrás do miolo opaco do disco não entram
          var far = 0;
          f.A.concat(f.V).forEach(function (p) { far = Math.max(far, Math.hypot(p[0] - 230, p[1] - 230)); });
          if (far < 172) continue;
          row += wingFeather(f, rw.dark || Math.max(0, ri - 1) * 0.04, ri);
        }
        // cada fileira projeta uma sombra macia sobre a de baixo
        o += '<g filter="url(#' + I.drop + ')">' + row + '</g>';
      });
      // borda de ataque: osso arredondado, com sombra por baixo e filete dourado por cima
      var E = [], j;
      for (j = 0; j <= 30; j++) E.push(armAt(0.18 + 0.82 * j / 30));
      var dE = smooth(E, false);
      o += '<path d="' + dE + '" fill="none" stroke="#02040f" stroke-opacity=".5" stroke-width="6" stroke-linecap="round" filter="url(#' + I.soft + ')" transform="translate(1 3)"/>' +
        '<path d="' + dE + '" fill="none" stroke="#dfe4f1" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="' + dE + '" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" transform="translate(0 -1)"/>' +
        '<path d="' + dE + '" fill="none" stroke="#fffaf0" stroke-opacity=".7" stroke-width=".8" stroke-linecap="round" transform="translate(0 -2.4)"/>';
      return o;
    }

    // caixas aproximadas dos rótulos da moldura (mesmo cálculo do rotulo())
    function labelSpots(ctx) {
      return ctx.groups.map(function (g) {
        var t = g.am * D, cs = Math.cos(t), sn = Math.sin(t), lr = ctx.R + 28, x = 230 + lr * cs, y = 230 + lr * sn + (sn < 0 ? -6 : 4);
        var w = Math.max(String(g.n).length * 7.1, String(g.v).length * 9.6), x0 = cs > 0.3 ? x : cs < -0.3 ? x - w : x - w / 2;
        return { cx: x0 + w / 2, cy: y + 4, rx: w / 2 + 12, ry: 28 };

      });
    }

    /* ---------- Giada R: a mesma composição (asas atrás do disco, auréola no alto, penas que saem do medalhão), refeita
       como objeto: penas brancas de verdade pousadas sobre veludo azul-noite, num aro de ouro batido. A única luz é a da
       auréola, quente, vinda do alto: as penas fazem sombra para baixo no veludo. A cor do critério é só a linha de seda
       que amarra o cálamo de cada pena. Sem brilho colorido, sem faísca. */
    function frameDefs(ctx) {
      I = { uid: ctx.uid, soft: ctx.uid('grSoft'), shadow: ctx.uid('grSh'), mask: ctx.uid('grMask'), wing: ctx.uid('grWing'), drop: ctx.uid('grDrop'),
        velvet: ctx.uid('grVel'), vel: ctx.uid('grVd'), vig: ctx.uid('grVig'), metal: ctx.uid('grMet'), metalH: ctx.uid('grMetH'), haloL: ctx.uid('grHaloL'),
        med: ctx.uid('grMed'), fray: ctx.uid('grFray'), clip: ctx.uid('grClip'), groove: ctx.uid('grGroove') };
      var o = '<filter id="' + I.soft + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
        '<filter id="' + I.shadow + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>' +
        '<filter id="' + I.groove + '" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.2"/></filter>' +
        '<filter id="' + I.drop + '" x="-10%" y="-10%" width="125%" height="125%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.4"/><feOffset dx="1.4" dy="4" result="o"/>' +
        '<feFlood flood-color="#02040f" flood-opacity=".65"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
        // borda das penas: as barbas não fecham uma linha lisa
        '<filter id="' + I.fray + '" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="1" seed="3" result="n"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter>' +
        // veludo: fibra fina (ruído alto) só um pouco mais clara que o tecido
        '<filter id="' + I.velvet + '" filterUnits="userSpaceOnUse" x="30" y="30" width="400" height="400"><feTurbulence type="fractalNoise" baseFrequency="1.1 .9" numOctaves="2" seed="7" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .62  0 0 0 0 .7  0 0 0 0 .95  0 0 0 .9 -.32"/><feComposite in2="SourceAlpha" operator="in"/></filter>';
      // máscara das asas: esmaece atrás de cada rótulo e nas bordas da moldura
      var fl = ctx.uid('grF'), gl = ctx.uid('grE'), gr = ctx.uid('grE'), gb = ctx.uid('grE'), gt = ctx.uid('grE');
      o += '<filter id="' + fl + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="11"/></filter>' +
        '<linearGradient id="' + gl + '" x1="0" y1="0" x2="1" y2="0"><stop offset=".53" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="' + gr + '" x1="1" y1="0" x2="0" y2="0"><stop offset=".53" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="' + gb + '" x1="0" y1="1" x2="0" y2="0"><stop offset=".3" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="' + gt + '" x1="0" y1="0" x2="0" y2="1"><stop offset=".74" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>';
      o += '<mask id="' + I.mask + '" maskUnits="userSpaceOnUse" x="-90" y="-30" width="640" height="522"><rect x="-90" y="-30" width="640" height="522" fill="#fff"/>' +
        '<rect x="-90" y="-30" width="60" height="522" fill="url(#' + gl + ')"/><rect x="490" y="-30" width="60" height="522" fill="url(#' + gr + ')"/>' +
        '<rect x="-90" y="392" width="640" height="100" fill="url(#' + gb + ')"/><rect x="-90" y="-30" width="640" height="38" fill="url(#' + gt + ')"/><g filter="url(#' + fl + ')">';
      labelSpots(ctx).forEach(function (b) { o += '<ellipse cx="' + F(b.cx) + '" cy="' + F(b.cy) + '" rx="' + F(b.rx) + '" ry="' + F(b.ry) + '" fill="#000" fill-opacity=".8"/>'; });
      o += '</g></mask>';
      // veludo azul-noite, mais claro no alto, onde bate a luz da auréola
      o += '<radialGradient id="' + I.vel + '" gradientUnits="userSpaceOnUse" cx="230" cy="96" r="300"><stop offset="0" stop-color="#2a3a7c"/><stop offset=".38" stop-color="#17225a"/>' +
        '<stop offset=".72" stop-color="#0c1438"/><stop offset="1" stop-color="#050920"/></radialGradient>' +
        '<radialGradient id="' + I.vig + '" gradientUnits="userSpaceOnUse" cx="230" cy="230" r="194"><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>' +
        // ouro batido: claro no alto (a auréola), bronze no meio, um reflexo frio embaixo
        '<linearGradient id="' + I.metal + '" gradientUnits="userSpaceOnUse" x1="0" y1="36" x2="0" y2="424"><stop offset="0" stop-color="#fff2c8"/><stop offset=".14" style="stop-color:var(--gold2)"/>' +
        '<stop offset=".42" style="stop-color:var(--gold)"/><stop offset=".7" stop-color="#7a5a22"/><stop offset=".88" stop-color="#5a3f14"/><stop offset="1" stop-color="#b8924a"/></linearGradient>' +
        '<linearGradient id="' + I.metalH + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d0"/><stop offset=".3" style="stop-color:var(--gold2)"/>' +
        '<stop offset=".7" stop-color="#8a6526"/><stop offset="1" stop-color="#4a3410"/></linearGradient>' +
        '<radialGradient id="' + I.haloL + '"><stop offset="0" style="stop-color:var(--gold2)" stop-opacity=".32"/><stop offset=".5" style="stop-color:var(--gold)" stop-opacity=".08"/>' +
        '<stop offset="1" style="stop-color:var(--gold)" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + I.med + '" cx=".5" cy=".3" r=".75"><stop offset="0" stop-color="#26336e"/><stop offset=".6" stop-color="#121a46"/><stop offset="1" stop-color="#060a24"/></radialGradient>' +
        '<clipPath id="' + I.clip + '"><circle cx="230" cy="230" r="' + (ctx.R + 8) + '"/></clipPath>';
      return o;
    }

    // a auréola: um aro de ouro em perspectiva, a metade de trás mais escura; a única coisa com luz própria
    function haloAbove() {
      var cx = 230, cy = 14, rx = 58, ry = 9;
      function arc(top, dy) { return 'M' + (cx - rx) + ' ' + (cy + dy) + 'A' + rx + ' ' + ry + ' 0 0 ' + (top ? 1 : 0) + ' ' + (cx + rx) + ' ' + (cy + dy); }
      return '<ellipse cx="' + cx + '" cy="' + (cy + 6) + '" rx="' + (rx * 2.1) + '" ry="' + (ry * 4.6) + '" fill="url(#' + I.haloL + ')"/>' +
        '<path d="' + arc(true, 0) + '" fill="none" stroke="#6b4c18" stroke-width="4.4"/>' +
        '<path d="' + arc(true, -1) + '" fill="none" style="stroke:var(--gold)" stroke-width="1.4"/>' +
        '<path d="' + arc(false, 3) + '" fill="none" stroke="#02040f" stroke-opacity=".5" stroke-width="4" filter="url(#' + I.soft + ')"/>' +
        '<path d="' + arc(false, 0) + '" fill="none" stroke="url(#' + I.metalH + ')" stroke-width="4.6"/>' +
        '<path d="' + arc(false, -1.2) + '" fill="none" stroke="#fff8e4" stroke-opacity=".85" stroke-width=".9"/>';
    }

    function frameStage(ctx) {
      var o = '<defs><g id="' + I.wing + '">' + wing() + '</g></defs>', M = 'matrix(-1 0 0 1 460 0)', R = ctx.R;
      o += '<g mask="url(#' + I.mask + ')"><use href="#' + I.wing + '"/><use href="#' + I.wing + '" transform="' + M + '"/></g>';
      o += haloAbove();
      // sombra do disco sobre as asas, o veludo, a fibra e a vinheta
      o += '<circle cx="232" cy="236" r="' + (R + 12) + '" fill="#02040f" fill-opacity=".6" filter="url(#' + I.soft + ')"/>' +
        '<circle cx="230" cy="230" r="' + (R + 8) + '" fill="url(#' + I.vel + ')"/>' +
        '<g clip-path="url(#' + I.clip + ')"><rect x="40" y="40" width="380" height="380" fill="#000" filter="url(#' + I.velvet + ')" opacity=".22"/></g>' +
        '<circle cx="230" cy="230" r="' + (R + 8) + '" fill="url(#' + I.vig + ')"/>';
      // o aro de ouro faz sombra para dentro, embaixo (a luz vem do alto)
      o += '<g clip-path="url(#' + I.clip + ')"><circle cx="230" cy="235" r="' + (R + 9) + '" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="7" filter="url(#' + I.soft + ')"/></g>';
      o += '<circle cx="230" cy="230" r="' + (R + 10.6) + '" fill="none" stroke="#120c02" stroke-width="7"/>' +
        '<circle cx="230" cy="230" r="' + (R + 10.6) + '" fill="none" stroke="url(#' + I.metal + ')" stroke-width="5.4"/>' +
        '<circle cx="230" cy="229.3" r="' + (R + 11.6) + '" fill="none" stroke="#fff6dc" stroke-opacity=".5" stroke-width=".6"/>' +
        '<circle cx="230" cy="230" r="' + (R + 8.4) + '" fill="none" stroke="#2a1c06" stroke-opacity=".8" stroke-width=".7"/>';
      // marcas cinzeladas no aro, na direção de cada rótulo
      ctx.groups.forEach(function (g) {
        o += '<path d="M' + pt(pol(R + 8.4, g.am)) + 'L' + pt(pol(R + 12.8, g.am)) + '" stroke="#3a2808" stroke-width="1.6"/>' +
          '<path d="M' + pt(pol(R + 8.4, g.am + 0.5)) + 'L' + pt(pol(R + 12.8, g.am + 0.5)) + '" stroke="#fff2c8" stroke-opacity=".55" stroke-width=".6"/>';
      });
      return o;
    }

    function medallion(ctx, emblem) {
      var r = ctx.r0 - 5;
      return '<circle cx="231" cy="234" r="' + (r + 3) + '" fill="#000" fill-opacity=".55" filter="url(#' + I.soft + ')"/>' +
        '<circle cx="230" cy="230" r="' + (r + 1.6) + '" fill="url(#' + I.metal + ')"/>' +
        '<circle cx="230" cy="230" r="' + (r - 1.8) + '" fill="url(#' + I.med + ')" stroke="#2a1c06" stroke-width=".8"/>' +
        '<circle cx="230" cy="229.2" r="' + (r + 1.2) + '" fill="none" stroke="#fff6dc" stroke-opacity=".45" stroke-width=".5"/>' + (emblem || '');
    }

    /* ---------- as penas de dado ----------
       A pena nasce sob o medalhão (raio 50) e a parte visível vai do aro do medalhão (55) até 55 + VMAX * frac. */
    var RIN = 50, VIS0 = 55, VMAX = 118, RING = VIS0 + VMAX;
    function dataGeom(g) {
      var len = (VIS0 - RIN) + VMAX * Math.max(0.12, g.frac), w = Math.min(23, 5 + 0.16 * len);
      return pena(pol(RIN, g.am), g.am, len, w, { lead: 0.42, curv: 0.04, tip: 0.3, tipMax: 11, quill: 0.16, taper: 0.14, rough: 0.07, seed: g.i * 31 + 7,
        N: 26, lite: 0, notch: len > 40 ? [[0.66, 0.4, 1], [0.5, 0.28, -1], [0.82, 0.3, 1]] : [[0.62, 0.35, 1], [0.78, 0.25, -1]], rachis: 1.5 });
    }
    function axisGrad(id, f, stops) {
      return '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="' + pt(f.B).replace(' ', '" y1="') + '" x2="' + pt(f.T).replace(' ', '" y2="') + '">' +
        stops.map(function (s) { return '<stop offset="' + s[0] + '" ' + (s[1].charAt(0) === 'v' ? 'style="stop-color:' + s[1] + '"' : 'stop-color="' + s[1] + '"') + '/>'; }).join('') + '</linearGradient>';
    }
    // a linha de seda que amarra o cálamo, na cor do critério: três voltas e uma ponta solta
    function linha(g) {
      var a = g.am, c = Math.cos(a * D), s = Math.sin(a * D), o = '', k;
      function at(r, off) { return [230 + c * r - s * off, 230 + s * r + c * off]; }
      for (k = 0; k < 3; k++) {
        var r = VIS0 + 3.4 + k * 2.1;
        o += '<path d="M' + pt(at(r + 0.5, -3)) + 'L' + pt(at(r + 0.5, 3)) + '" stroke="#02040f" stroke-opacity=".55" stroke-width="1.9" stroke-linecap="round"/>' +
          '<path d="M' + pt(at(r, -2.7)) + 'L' + pt(at(r, 2.7)) + '" style="stroke:' + g.cor + '" stroke-width="1.7" stroke-linecap="round"/>' +
          '<path d="M' + pt(at(r - 0.45, -1.8)) + 'L' + pt(at(r - 0.45, 1.2)) + '" stroke="#fff" stroke-opacity=".35" stroke-width=".5" stroke-linecap="round"/>';
      }
      var e0 = at(VIS0 + 7.6, 2.6);
      o += '<path d="M' + pt(e0) + 'Q' + pt(at(VIS0 + 9, 6.5)) + ' ' + pt(at(VIS0 + 13, 7.2)) + '" fill="none" style="stroke:' + g.cor + '" stroke-width="1.1" stroke-linecap="round" opacity=".9"/>';
      return o;
    }

    var MOT = {
      deck: '01. Giada', nome: 'Penas sobre veludo',
      raio: function (f) { return VIS0 + VMAX * Math.max(0.12, Math.min(1, f)); },
      defs: frameDefs,
      stage: function (ctx) {
        var o = frameStage(ctx);
        // o limite das penas: um filete de ouro embutido no veludo, com o sulco escuro por baixo
        o += '<circle cx="230" cy="230.8" r="' + RING + '" fill="none" stroke="#02040f" stroke-opacity=".6" stroke-width="1.8" filter="url(#' + I.groove + ')"/>' +
          '<circle cx="230" cy="230" r="' + RING + '" fill="none" stroke="url(#' + I.metal + ')" stroke-width=".9" stroke-opacity=".8"/>';
        return o;
      },
      group: function (g, ctx) {
        var f = dataGeom(g), id = ctx.uid('grp');
        var o = axisGrad(id, f, [[0, '#7d859c'], [0.16, '#d9dce4'], [0.42, '#fffcf4'], [0.7, '#fbf8f1'], [0.9, '#e4e3df'], [1, '#bfc3cf']]);
        // a sombra da pena no veludo: a luz vem do alto
        o += '<path d="' + f.d + '" fill="#01030c" fill-opacity=".62" filter="url(#' + I.shadow + ')" transform="translate(1.2 5)"/>' +
          '<path d="' + f.down + '" fill="none" stroke="#e9e8e4" stroke-opacity=".75" stroke-width=".55"/>' +
          '<g filter="url(#' + I.fray + ')"><path d="' + f.d + '" fill="url(#' + id + ')" stroke="#4a5574" stroke-opacity=".45" stroke-width=".45"/>' +
          '<path d="' + f.half + '" fill="#3c4a74" fill-opacity=".26"/>' +
          '<path d="' + f.halfA + '" fill="#fff" fill-opacity=".2"/>' +
          '<path d="' + f.bV + '" fill="none" stroke="#5f6a88" stroke-opacity=".38" stroke-width=".35"/>' +
          '<path d="' + f.bA + '" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width=".3"/>' +
          '<path d="' + f.splits + '" fill="none" stroke="#2c3654" stroke-opacity=".55" stroke-width=".7" stroke-linecap="round"/></g>' +
          '<path d="' + f.lead + '" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".5"/>' +
          '<path d="' + f.rachis + '" fill="#efe5cc" stroke="#8a7a58" stroke-opacity=".5" stroke-width=".3"/>';
        return o + linha(g);
      },
      center: function (ctx) {
        // um sol cinzelado no esmalte, sem brilho
        var e = '<circle cx="230" cy="194" r="3.4" fill="url(#' + I.metal + ')" stroke="#3a2808" stroke-width=".4"/>', k;
        for (k = 0; k < 12; k++) { var a = k * 30 - 90, r2 = k % 3 === 0 ? 8 : 6.4; e += '<path d="M' + pt([230 + 4.6 * Math.cos(a * D), 194 + 4.6 * Math.sin(a * D)]) + 'L' + pt([230 + r2 * Math.cos(a * D), 194 + r2 * Math.sin(a * D)]) + '" style="stroke:var(--gold)" stroke-width="1" stroke-linecap="round"/>'; }
        return medallion(ctx, e);
      }
    };
    MOT.legenda = { peca: "pena", masc: false, texto: " é um critério: o comprimento acompanha os pontos, e o filete de ouro marca o limite." };
    MOTIVOS.giadaR = MOT;
  })();

  return MOTIVOS.giadaR;
})();
