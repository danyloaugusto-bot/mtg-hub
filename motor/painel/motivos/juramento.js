/* Motivo "juramento" do gráfico de pontuação: 02. Kaalia (Céu, Fogo e Inferno), escolhido pelo dono na segunda rodada da votação de 15/10/2026.
   Veio do protótipo motivos/kaalia2.js da votação, só com a opção vencedora. O build inclui este arquivo apenas no painel
   cujo tema.json tem "grafico": "juramento"; o motivoSvg do app.js monta a moldura (rótulos, placar, clique em cada agrupamento).
   Mesma geometria do chartSvg: viewBox -58 -2 576 464, centro 230,230, raio interno 60, externo 184. */
var MOTIVO_PAINEL = (function () {
  var CX = 230, CY = 230, _uid = 0;
  function pol(r, a) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)]; }
  function P(r, a) { var p = pol(r, a); return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function f1(n) { return (+n).toFixed(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uid(p) { return (p || 'u') + (++_uid); }
  var MOTIVOS = {};

  /* Kaalia of the Vast, "Céu, Fogo e Inferno": segunda leva, em metal, vidro e pedra (o que o vetor faz bem).
     kaalia3 Juramento de Nira: a espada de Nira atravessa o disco, com fitas branca e vermelha; oito lâminas saem do medalhão.
     kaalia4 Sangue e Ascensão: rosácea gótica de vitral em três campos (anjo, demônio, dragão); oito lancetas de vidro.
     kaalia5 Ruínas de Alara: oito blocos de pedra partidos em volta de um redemoinho de três cores.
     Em todos, a medida de cada agrupamento é proporcional a g.frac (zero na borda do medalhão, a maior chega ao aro, raio 184).
     Luz de cima e da esquerda; sombras para baixo e para a direita. */
  (function () {
    'use strict';
    var K = {}, C = null;                                  // ids e ctx da renderização corrente
    function ids(ctx, nomes) { C = ctx; K = {}; nomes.forEach(function (n) { K[n] = ctx.uid('kq' + n); }); }
    function U(n) { return 'url(#' + K[n] + ')'; }
    function n1(v) { return (+v).toFixed(1); }
    function pt(p) { return n1(p[0]) + ' ' + n1(p[1]); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function dir(a) { var t = a * Math.PI / 180; return [Math.cos(t), Math.sin(t)]; }
    function along(p, d, s) { return [p[0] + d[0] * s, p[1] + d[1] * s]; }
    function rng(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }
    function stops(list) {
      return list.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] === undefined ? '' : ' stop-opacity="' + s[2] + '"') + '/>'; }).join('');
    }
    function lin(id, x1, y1, x2, y2, list, us) {
      return '<linearGradient id="' + K[id] + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + (us ? ' gradientUnits="userSpaceOnUse"' : '') + '>' + stops(list) + '</linearGradient>';
    }
    function rad(id, cx, cy, r, list, us) {
      return '<radialGradient id="' + K[id] + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '"' + (us ? ' gradientUnits="userSpaceOnUse"' : '') + '>' + stops(list) + '</radialGradient>';
    }
    function poly(P) { return 'M' + P.map(pt).join('L') + 'Z'; }
    function rgb(c, f) { return 'rgb(' + Math.round(clamp(c[0] * f, 0, 255)) + ',' + Math.round(clamp(c[1] * f, 0, 255)) + ',' + Math.round(clamp(c[2] * f, 0, 255)) + ')'; }
    function hex(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
    // Catmull-Rom pela polilinha inteira, t de 0 a 1
    function cr(P, t) {
      var n = P.length - 1, f = clamp(t * n, 0, n - 1e-6), i = Math.floor(f), u = f - i;
      var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)];
      function c(k) { return 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u * u + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u * u * u); }
      function dc(k) { return 0.5 * ((-p0[k] + p2[k]) + 2 * (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u + 3 * (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u * u); }
      var dx = dc(0), dy = dc(1), L = Math.hypot(dx, dy) || 1;
      return { p: [c(0), c(1)], t: [dx / L, dy / L] };
    }
    /* diz se o lado -y local de um objeto girado de am graus está voltado para a luz */
    function litUp(am) { var t = am * Math.PI / 180; return (-0.55 * Math.sin(t) + 0.83 * Math.cos(t)) > 0; }
    function rot(g) { return 'translate(230 230) rotate(' + n1(g.am) + ')'; }

    /* ---------------- defs comuns ---------------- */
    var NOMES = ['b1', 'b2', 'b4', 'b8', 'b14', 'shadow', 'glowO', 'emb', 'hammer', 'rock',
      'sLU', 'sLD', 'sDU', 'sDD', 'sheen', 'hLU', 'hLD', 'hDU', 'hDD', 'goldA', 'goldX', 'goldR', 'goldRad', 'rim', 'leather', 'gem',
      'medF', 'diskF', 'diskIn'];
    function defsComuns() {
      var o = '';
      [['b1', .7], ['b2', 1.4], ['b4', 3.5], ['b8', 8], ['b14', 14]].forEach(function (b) {
        o += '<filter id="' + K[b[0]] + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="' + b[1] + '"/></filter>';
      });
      o += '<filter id="' + K.shadow + '" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="1.6" dy="2.6" stdDeviation="1.7" flood-color="#000" flood-opacity=".85"/></filter>';
      o += '<filter id="' + K.glowO + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>';
      o += '<filter id="' + K.emb + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
      o += '<filter id="' + K.hammer + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="12" result="n"/>' +
        '<feDiffuseLighting in="n" surfaceScale="2.6" diffuseConstant="1.1" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="42"/></feDiffuseLighting>' +
        '<feComposite in="l" in2="SourceGraphic" operator="in"/></filter>';
      // pedra: textura de relevo multiplicada sobre a cor
      o += '<filter id="' + K.rock + '" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".11" numOctaves="4" seed="3" result="n"/>' +
        '<feDiffuseLighting in="n" surfaceScale="2.2" diffuseConstant="1.25" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting>' +
        '<feBlend in="SourceGraphic" in2="l" mode="multiply" result="m"/><feComposite in="m" in2="SourceAlpha" operator="in"/></filter>';
      // aço: U = metade de cima (fio em 0, aresta central em 1), D = metade de baixo
      o += lin('sLU', 0, 0, 0, 1, [[0, '#aeb6c0'], [.3, '#dfe4ea'], [.8, '#f7f9fb'], [1, '#ffffff']]);
      o += lin('sLD', 0, 0, 0, 1, [[0, '#ffffff'], [.2, '#f7f9fb'], [.7, '#dfe4ea'], [1, '#aeb6c0']]);
      o += lin('sDU', 0, 0, 0, 1, [[0, '#6c5650'], [.35, '#3b3a40'], [1, '#5d6670']]);
      o += lin('sDD', 0, 0, 0, 1, [[0, '#5d6670'], [.65, '#3b3a40'], [1, '#6c5650']]);
      o += lin('sheen', 0, 0, 1, 0, [[0, '#000', .35], [.12, '#fff', 0], [.42, '#fff', 0], [.5, '#fff', .38], [.58, '#fff', 0], [.86, '#fff', 0], [1, '#fff', .2]]);
      o += lin('hLU', 0, 0, 0, 1, [[0, '#fff7d6'], [.3, '#ffcf6a'], [1, '#f07a22']]);
      o += lin('hLD', 0, 0, 0, 1, [[0, '#f07a22'], [.7, '#ffcf6a'], [1, '#fff7d6']]);
      o += lin('hDU', 0, 0, 0, 1, [[0, '#ffc060'], [.4, '#d4461a'], [1, '#7e1a0a']]);
      o += lin('hDD', 0, 0, 0, 1, [[0, '#7e1a0a'], [.6, '#d4461a'], [1, '#ffc060']]);
      o += lin('goldA', 0, 0, 0, 1, [[0, '#fff0c2'], [.28, '#e2b660'], [.6, '#8c5c1e'], [1, '#3a2008']]);
      o += lin('goldX', 0, 0, 1, 0, [[0, '#4a2a0a'], [.35, '#e8c070'], [.55, '#fff2c8'], [.8, '#9a6a26'], [1, '#3a2008']]);
      o += lin('goldR', 0, 0, 1, 1, [[0, '#fff0c2'], [.22, '#d8aa52'], [.5, '#5a3510'], [.74, '#c79a4c'], [1, '#2a1606']]);
      o += rad('goldRad', '.38', '.32', '.75', [[0, '#fff4d0'], [.35, '#e0b25a'], [.75, '#7c4e16'], [1, '#2e1806']]);
      o += lin('rim', 0, 0, 1, 1, [[0, '#e6c787'], [.18, '#a77a36'], [.42, '#3e240a'], [.6, '#1e1004'], [.8, '#76552a'], [1, '#1a0e04']]);
      o += lin('leather', 0, 0, 0, 1, [[0, '#120806'], [.35, '#4e2c1a'], [.55, '#6a3e26'], [1, '#100604']]);
      o += rad('gem', '.35', '.3', '.7', [[0, '#fff', .9], [.3, '#fff', .25], [.7, '#000', 0], [1, '#000', .45]]);
      o += rad('medF', '.42', '.38', '.7', [[0, '#2a1814'], [.7, '#140a09'], [1, '#080404']]);
      o += rad('diskF', '.5', '.5', '.5', [[0, '#22141a'], [.55, '#170c10'], [.9, '#0d0709'], [1, '#050203']]);
      o += rad('diskIn', '50%', '50%', '50%', [[0, '#000', 0], [.8, '#000', .1], [1, '#000', .7]]);
      return o;
    }

    /* disco de ferro batido com aro de bronze */
    function disco(rivets) {
      var o = '<circle cx="230" cy="234" r="203" fill="#000" opacity=".7" filter="' + U('b8') + '"/>';
      o += '<circle cx="230" cy="230" r="190" fill="' + U('diskF') + '"/>';
      o += '<circle cx="230" cy="230" r="186" fill="#fff" filter="' + U('hammer') + '" opacity=".1"/>';
      o += '<circle cx="230" cy="230" r="186" fill="' + U('diskIn') + '"/>';
      o += '<circle cx="230" cy="230" r="190.5" fill="none" stroke="' + U('rim') + '" stroke-width="11"/>';
      o += '<circle cx="230" cy="230" r="190.5" fill="none" stroke="#fff" filter="' + U('hammer') + '" stroke-width="11" opacity=".12"/>';
      o += '<circle cx="230" cy="230" r="184.6" fill="none" stroke="#f7dca6" stroke-opacity=".35" stroke-width=".6"/><circle cx="230" cy="230" r="184" fill="none" stroke="#080404" stroke-width="1"/>';
      o += '<circle cx="230" cy="230" r="196.2" fill="none" stroke="#080404" stroke-width="1"/><circle cx="230" cy="230" r="195.4" fill="none" stroke="#f7dca6" stroke-opacity=".18" stroke-width=".5"/>';
      if (rivets) for (var k = 0; k < 24; k++) { var p = pol(190.5, -90 + k * 15 + 7.5); o += '<circle cx="' + n1(p[0]) + '" cy="' + n1(p[1]) + '" r="1.9" fill="' + U('goldRad') + '" stroke="#140804" stroke-width=".4"/>'; }
      return o;
    }

    /* ---------------- lâminas ---------------- */
    function perfil(kind, x0, L, w) {
      var x1 = x0 + L, segs;
      if (kind === 'folha') segs = [[[x0 + L * .32, -w * 1.07], [x0 + L * .74, -w * .58], [x1, 0]]];
      else {
        var tp = Math.min(L * .6, w * 3.3), xa = x1 - tp;
        segs = [[[lerp(x0, xa, 1 / 3), -w * .953], [lerp(x0, xa, 2 / 3), -w * .907], [xa, -w * .86]], [[x1 - tp * .5, -w * .84], [x1 - tp * .14, -w * .38], [x1, 0]]];
      }
      return { s: [x0, -w], segs: segs, x0: x0, x1: x1, w: w };
    }
    function fwd(P, k) {
      var o = 'M' + n1(P.s[0]) + ' ' + n1(P.s[1] * k);
      P.segs.forEach(function (c) { o += 'C' + n1(c[0][0]) + ' ' + n1(c[0][1] * k) + ' ' + n1(c[1][0]) + ' ' + n1(c[1][1] * k) + ' ' + n1(c[2][0]) + ' ' + n1(c[2][1] * k); });
      return o;
    }
    function back(P, k) {
      var o = '', ends = [P.s].concat(P.segs.map(function (c) { return c[2]; }));
      for (var i = P.segs.length - 1; i >= 0; i--) {
        var c = P.segs[i], p0 = ends[i];
        o += 'C' + n1(c[1][0]) + ' ' + n1(c[1][1] * k) + ' ' + n1(c[0][0]) + ' ' + n1(c[0][1] * k) + ' ' + n1(p0[0]) + ' ' + n1(p0[1] * k);
      }
      return o;
    }
    function lamina(kind, x0, L, w, up, hot) {
      var P = perfil(kind, x0, L, w), x1 = x0 + L;
      var gU = hot ? (up ? 'hLU' : 'hDU') : (up ? 'sLU' : 'sDU'), gD = hot ? (up ? 'hDD' : 'hLD') : (up ? 'sDD' : 'sLD');
      var o = '', outl = fwd(P, 1) + back(P, -1) + 'Z';
      o += '<path d="' + fwd(P, 1) + 'L' + n1(x0) + ' 0Z" fill="' + U(gU) + '"/>';
      o += '<path d="' + fwd(P, -1) + 'L' + n1(x0) + ' 0Z" fill="' + U(gD) + '"/>';
      o += '<path d="' + fwd(P, 1) + back(P, .66) + 'Z" fill="#fff" fill-opacity="' + (up ? .42 : .1) + '"/>';
      o += '<path d="' + fwd(P, -1) + back(P, -.66) + 'Z" fill="#fff" fill-opacity="' + (up ? .1 : .42) + '"/>';
      o += '<path d="M' + n1(x0 + 1) + ' 0L' + n1(x1 - 1.5) + ' 0" stroke="' + (hot ? '#fff3c4' : '#fff') + '" stroke-opacity=".75" stroke-width=".45"/>';
      o += '<path d="' + outl + '" fill="' + U('sheen') + '"/>';
      o += '<path d="' + fwd(P, 1) + '" fill="none" stroke="#fff" stroke-opacity="' + (up ? .9 : .3) + '" stroke-width=".4"/>';
      o += '<path d="' + fwd(P, -1) + '" fill="none" stroke="#fff" stroke-opacity="' + (up ? .3 : .9) + '" stroke-width=".4"/>';
      o += '<path d="' + outl + '" fill="none" stroke="#080404" stroke-opacity=".85" stroke-width=".7"/>';
      return { svg: o, outline: outl };
    }
    function gema(x, y, r, g) {
      return '<circle cx="' + n1(x) + '" cy="' + n1(y) + '" r="' + n1(r + .7) + '" fill="#1a0c04"/>' +
        '<circle cx="' + n1(x) + '" cy="' + n1(y) + '" r="' + n1(r) + '" style="fill:' + g.cor + '"/>' +
        '<circle cx="' + n1(x) + '" cy="' + n1(y) + '" r="' + n1(r) + '" fill="' + U('gem') + '"/>';
    }
    // barra afilada ao longo de uma cúbica (braço de guarda, chifre)
    function cano(a, b, c, d, w0, w1) {
      var N = 18, L = [], R = [];
      for (var k = 0; k <= N; k++) {
        var t = k / N, u = 1 - t;
        var p = [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
        var dv = [3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]), 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1])];
        var len = Math.hypot(dv[0], dv[1]) || 1, w = lerp(w0, w1, t);
        L.push([p[0] - dv[1] / len * w, p[1] + dv[0] / len * w]); R.push([p[0] + dv[1] / len * w, p[1] - dv[0] / len * w]);
      }
      return 'M' + L.map(pt).join('L') + 'L' + R.reverse().map(pt).join('L') + 'Z';
    }

    /* ---------------- medalhão e emblemas ---------------- */
    function medalhao(emb, anel) {
      return '<circle cx="230" cy="232" r="60" fill="#000" opacity=".6" filter="' + U('b4') + '"/>' +
        '<circle cx="230" cy="230" r="55" fill="' + U('medF') + '"/>' +
        '<circle cx="230" cy="230" r="53.2" fill="none" stroke="' + U(anel || 'goldR') + '" stroke-width="3.6"/>' +
        '<circle cx="230" cy="230" r="55.1" fill="none" stroke="#120804" stroke-width=".8"/>' +
        '<circle cx="230" cy="230" r="51.2" fill="none" stroke="#120804" stroke-width=".6"/>' +
        '<circle cx="230" cy="230" r="50.4" fill="none" stroke="#f7d8a4" stroke-opacity=".18" stroke-width=".6"/>' + (emb || '');
    }
    // espada vertical entre duas fitas (y 186 a 202)
    function emblemaEspada() {
      return '<path d="M223 199Q226 193 222.5 189M237 199Q234 193 237.5 189" fill="none" stroke="#c0283a" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M224.6 199.6Q227.4 194 224.4 190M235.4 199.6Q232.6 194 235.6 190" fill="none" stroke="#efe6d8" stroke-width="1.1" stroke-linecap="round"/>' +
        '<path d="M230 202.6L228.3 192.4L230 191.4L231.7 192.4Z" fill="#e8ecf0" stroke="#2a2a30" stroke-width=".3"/>' +
        '<path d="M225.4 191.6H234.6" stroke="' + U('goldA') + '" stroke-width="1.5" stroke-linecap="round"/>' +
        '<rect x="229.2" y="187.6" width="1.6" height="3.6" fill="#4a2a18"/><circle cx="230" cy="186.9" r="1.5" fill="' + U('goldRad') + '"/>';
    }
    // três gotas de luz (branca, vermelha, roxa) num triângulo (y 186 a 202)
    function emblemaTriade(cores) {
      var s = '<circle cx="230" cy="195" r="7.4" fill="none" stroke="' + U('goldA') + '" stroke-width="1"/>';
      [-90, 30, 150].forEach(function (a, i) {
        var p = [230 + 4.2 * Math.cos(a * Math.PI / 180), 195 + 4.2 * Math.sin(a * Math.PI / 180)];
        s += '<circle cx="' + n1(p[0]) + '" cy="' + n1(p[1]) + '" r="2.3" fill="' + cores[i] + '" stroke="#1a0c04" stroke-width=".35"/>';
      });
      return s;
    }

    /* =====================================================================================
       kaalia3: Juramento de Nira
       ===================================================================================== */
    // fita de tecido torcida ao longo de uma curva; cf/cb: cores da frente e do verso
    function fita(P, W, tw, ph0, cf, cb, amp, freq) {
      var N = 90, i, Cc = [], Nn = [], Wd = [], T = [];
      amp = amp || 0; freq = freq || 3;
      for (i = 0; i <= N; i++) {
        var t = i / N, q = cr(P, t), c = Math.cos(ph0 + t * tw * Math.PI), nn = [-q.t[1], q.t[0]];
        var wob = amp * Math.sin(t * freq * Math.PI) * Math.min(1, t * 4);
        Cc.push(along(q.p, nn, wob)); Nn.push(nn); T.push(q.t); Wd.push(W * (1 - .25 * t) * (Math.abs(c) < .1 ? (c < 0 ? -.1 : .1) : c));
      }
      var A = Cc.map(function (p, j) { return along(p, Nn[j], Wd[j]); }), B = Cc.map(function (p, j) { return along(p, Nn[j], -Wd[j]); });
      var o = '<path d="M' + A.map(pt).join('L') + 'L' + B.slice().reverse().map(pt).join('L') + 'Z" fill="#000" opacity=".55" transform="translate(2.5 4)" filter="' + U('b2') + '"/>';
      var last = '';
      for (i = 0; i < N; i++) {
        var cc = (Wd[i] + Wd[i + 1]) / (2 * W * (1 - .25 * i / N)), base = cc >= 0 ? cf : cb;
        var f = (.36 + .64 * Math.pow(Math.abs(cc), .8)) * (1 + .08 * Math.sin(i * .7));
        last = rgb(base, f);
        o += '<path d="M' + pt(A[i]) + 'L' + pt(A[i + 1]) + 'L' + pt(B[i + 1]) + 'L' + pt(B[i]) + 'Z" fill="' + last + '" stroke="' + last + '" stroke-width=".4"/>';
      }
      var e = N, tE = T[e], aE = along(A[e], tE, W * 1.5), bE = along(B[e], tE, W * 1.5), nE = along(Cc[e], tE, W * .3);
      o += '<path d="M' + pt(A[e]) + 'L' + pt(aE) + 'L' + pt(nE) + 'L' + pt(bE) + 'L' + pt(B[e]) + 'Z" fill="' + last + '" stroke="' + last + '" stroke-width=".4"/>';
      o += '<path d="M' + A.map(pt).join('L') + 'L' + pt(aE) + '" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".5"/>';
      o += '<path d="M' + B.map(pt).join('L') + 'L' + pt(bE) + '" fill="none" stroke="#000" stroke-opacity=".45" stroke-width=".5"/>';
      return o;
    }
    var BRANCO = [hex('#f2eadc'), hex('#b9ad9c')], RUBRO = [hex('#c22632'), hex('#6a0e16')];
    function espadaNira() {
      var o = '';
      var edgeL = 'M218 44L219.4 360C220 395 225 430 230 458', edgeR = 'M242 44L240.6 360C240 395 235 430 230 458';
      var blade = 'M218 44L219.4 360C220 395 225 430 230 458C235 430 240 395 240.6 360L242 44Z';
      o += '<path d="' + blade + '" fill="#000" opacity=".7" transform="translate(5 6)" filter="' + U('b4') + '"/>';
      o += '<path d="' + edgeL + 'L230 44Z" fill="' + U('bigL') + '"/>';
      o += '<path d="' + edgeR + 'L230 44Z" fill="' + U('bigD') + '"/>';
      o += '<path d="' + edgeL + 'L230 451C226.2 425 222.4 393 221.9 360L220.7 44Z" fill="#fff" fill-opacity=".28"/>';
      o += '<path d="' + edgeR + 'L230 451C233.8 425 237.6 393 238.1 360L239.3 44Z" fill="#fff" fill-opacity=".07"/>';
      // sulco com filete de ouro gravado
      o += '<path d="M227.3 60L227.6 330Q230 342 232.4 330L232.7 60Z" fill="#15181c" stroke="#000" stroke-opacity=".6" stroke-width=".4"/>';
      o += '<path d="M227.9 60L228.1 330" stroke="#fff" stroke-opacity=".35" stroke-width=".4"/>';
      var dm = '';
      for (var y = 72; y < 324; y += 16) dm += 'M230 ' + (y - 3.4) + 'L231.5 ' + y + 'L230 ' + (y + 3.4) + 'L228.5 ' + y + 'Z';
      o += '<path d="M230 64V326" stroke="' + U('goldX') + '" stroke-width=".8"/><path d="' + dm + '" fill="' + U('goldA') + '" stroke="#2a1404" stroke-width=".3"/>';
      o += '<path d="' + blade + '" fill="none" stroke="#06070a" stroke-width=".9"/>';
      // ricasso de ouro
      o += '<path d="M216.6 42H243.4L241.4 52Q230 60 218.6 52Z" fill="' + U('goldA') + '" stroke="#1a0c04" stroke-width=".6"/>';
      o += '<path d="M222 47Q230 52 238 47" fill="none" stroke="#2a1404" stroke-opacity=".6" stroke-width=".6"/>';
      // empunhadura, pomo
      o += '<rect x="226.2" y="13" width="7.6" height="17" fill="' + U('leather') + '" stroke="#0a0402" stroke-width=".5"/>';
      var wr = '';
      for (var yy = 14; yy < 29.5; yy += 2.1) wr += 'M226.2 ' + n1(yy + 1.6) + 'L233.8 ' + n1(yy);
      o += '<path d="' + wr + '" stroke="' + U('goldX') + '" stroke-width=".7"/>';
      o += '<rect x="225" y="11.6" width="10" height="3" rx="1" fill="' + U('goldA') + '" stroke="#1a0c04" stroke-width=".4"/>';
      o += '<rect x="225" y="28.4" width="10" height="3" rx="1" fill="' + U('goldA') + '" stroke="#1a0c04" stroke-width=".4"/>';
      o += '<circle cx="230" cy="6.4" r="6" fill="' + U('goldRad') + '" stroke="#1a0c04" stroke-width=".6"/><circle cx="230" cy="6.4" r="4.2" fill="none" stroke="#2a1404" stroke-opacity=".6" stroke-width=".5"/>';
      o += '<circle cx="230" cy="6.4" r="2.5" fill="#b3202c"/><circle cx="230" cy="6.4" r="2.5" fill="' + U('gem') + '"/>';
      // guarda: braços curvos que sobem nas pontas
      var q = cano([221, 35], [204, 37], [186, 35], [176, 23], 3, 1.6) + cano([239, 35], [256, 37], [274, 35], [284, 23], 3, 1.6);
      o += '<path d="' + q + '" fill="' + U('goldA') + '" stroke="#1a0c04" stroke-width=".55"/>';
      o += '<path d="M222 33.4C206 35 190 33.6 178.6 24M238 33.4C254 35 270 33.6 281.4 24" fill="none" stroke="#fff4d8" stroke-opacity=".45" stroke-width=".5"/>';
      o += '<circle cx="175.4" cy="21.4" r="3" fill="' + U('goldRad') + '" stroke="#1a0c04" stroke-width=".5"/><circle cx="284.6" cy="21.4" r="3" fill="' + U('goldRad') + '" stroke="#1a0c04" stroke-width=".5"/>';
      o += '<path d="M220.4 29H239.6L243 36L239.6 43H220.4L217 36Z" fill="' + U('goldX') + '" stroke="#1a0c04" stroke-width=".6"/>';
      o += '<circle cx="230" cy="36" r="3.4" fill="#b3202c" stroke="#2a0606" stroke-width=".5"/><circle cx="230" cy="36" r="3.4" fill="' + U('gem') + '"/>';
      return o;
    }
    function nos(yw, yr) {
      // as voltas das fitas em torno da lâmina
      var o = '';
      [[yw, BRANCO, 'fW'], [yr, RUBRO, 'fR']].forEach(function (b) {
        var y = b[0];
        o += '<path d="M215 ' + (y - 4.6) + 'Q230 ' + (y - .6) + ' 245 ' + (y - 4.6) + 'L245 ' + (y + 4.6) + 'Q230 ' + (y + 8.6) + ' 215 ' + (y + 4.6) + 'Z" fill="' + U(b[2]) + '" stroke="#000" stroke-opacity=".5" stroke-width=".5"/>';
        o += '<path d="M216 ' + (y - 3.8) + 'Q230 ' + (y + .2) + ' 244 ' + (y - 3.8) + '" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".5"/>';
      });
      return o;
    }

    MOTIVOS.kaalia3 = {
      deck: '02. Kaalia',
      nome: 'Juramento de Nira',
      desc: 'A espada de Nira atravessa o escudo, amarrada com as fitas branca e vermelha da tríade; em volta, cada agrupamento é uma lâmina de aço que sai do medalhão. Quanto maior a pontuação, mais longa a lâmina; a maior fica em brasa.',
      defs: function (ctx) {
        ids(ctx, NOMES.concat(['bigL', 'bigD', 'fW', 'fR']));
        return defsComuns() +
          lin('bigL', 0, 0, 1, 0, [[0, '#5a6068'], [.45, '#90979f'], [1, '#bcc2c8']]) +
          lin('bigD', 0, 0, 1, 0, [[0, '#454b53'], [.6, '#2a2e33'], [1, '#17191c']]) +
          lin('fW', 0, 0, 1, 0, [[0, '#8a7f72'], [.45, '#f6efe4'], [.6, '#efe6d8'], [1, '#8a7f72']]) +
          lin('fR', 0, 0, 1, 0, [[0, '#4a0a10'], [.45, '#d02c38'], [.6, '#b8222e'], [1, '#4a0a10']]);
      },
      stage: function (ctx) {
        var o = disco(true);
        // anel gravado de marcas finas
        var tk = '';
        for (var k = 0; k < 96; k++) { var a = k * 3.75, l = k % 4 ? 3 : 6; tk += 'M' + P(172, a) + 'L' + P(172 + l, a); }
        o += '<path d="' + tk + '" stroke="#e8c890" stroke-opacity=".16" stroke-width=".6"/><circle cx="230" cy="230" r="171" fill="none" stroke="#e8c890" stroke-opacity=".12" stroke-width=".6"/>';
        // caudas das fitas (atrás da espada)
        o += fita([[214, 64], [190, 76], [160, 104], [134, 146], [112, 190], [92, 226]], 10, 2.6, .15, BRANCO[0], BRANCO[1], 6, 3.4);
        o += fita([[246, 64], [270, 76], [300, 106], [326, 150], [344, 198], [354, 240]], 10, 2.4, .25, BRANCO[0], BRANCO[1], 6, 3);
        o += fita([[214, 75], [196, 96], [178, 136], [164, 186], [150, 240], [140, 290]], 9, 2.8, -.15, RUBRO[0], RUBRO[1], 5, 3.6);
        o += fita([[246, 75], [272, 88], [306, 100], [338, 118], [364, 142], [382, 170]], 9, 2.2, .1, RUBRO[0], RUBRO[1], 5, 2.6);
        o += fita([[218, 326], [206, 346], [198, 372], [194, 398]], 7.5, 1.8, .2, RUBRO[0], RUBRO[1], 3, 2.4);
        o += fita([[242, 326], [258, 344], [282, 362], [304, 380]], 8, 1.6, .3, BRANCO[0], BRANCO[1], 3, 2.2);
        o += espadaNira() + nos(60, 71) + nos(318, 329);
        return o;
      },
      group: function (g, ctx) {
        var x0 = 66, L = Math.max(5, g.frac * (184 - x0)), w = 5 + 1.8 * g.frac, up = litUp(g.am), hot = g.top;
        var b = lamina('folha', x0, L, w, up, hot), o = '';
        if (hot) {
          o += '<g transform="' + rot(g) + '"><path d="' + b.outline + '" fill="#ff4a10" opacity=".95" filter="' + U('glowO') + '"/>' +
            '<path d="' + b.outline + '" fill="#ffb040" opacity=".85" filter="' + U('b4') + '"/></g>';
        }
        var wg = w + 6.5, gx = 61.5;
        var guard = '<rect x="53" y="-2.3" width="' + n1(gx - 53) + '" height="4.6" fill="' + U('leather') + '"/>' +
          '<path d="M55 -2.3L56.4 2.3M57.6 -2.3L59 2.3" stroke="#000" stroke-opacity=".5" stroke-width=".5"/>' +
          '<path d="M' + n1(gx + 3.4) + ' ' + n1(-wg) + 'Q' + n1(gx - 3) + ' 0 ' + n1(gx + 3.4) + ' ' + n1(wg) + 'L' + n1(gx + 5.6) + ' ' + n1(wg - .8) + 'Q' + n1(gx + .6) + ' 0 ' + n1(gx + 5.6) + ' ' + n1(-wg + .8) + 'Z" fill="' + U('goldA') + '" stroke="#1a0c04" stroke-width=".5"/>' +
          '<circle cx="' + n1(gx + 4.6) + '" cy="' + n1(-wg) + '" r="1.6" fill="' + U('goldRad') + '" stroke="#1a0c04" stroke-width=".4"/>' +
          '<circle cx="' + n1(gx + 4.6) + '" cy="' + n1(wg) + '" r="1.6" fill="' + U('goldRad') + '" stroke="#1a0c04" stroke-width=".4"/>' +
          gema(gx + 1.6, 0, 1.9, g);
        o += '<g filter="' + U('shadow') + '"><g transform="' + rot(g) + '">' + b.svg + guard + '</g></g>';
        if (hot) {
          var r = rng(77), d = dir(g.am), sp = '';
          for (var k = 0; k < 16; k++) {
            var xx = lerp(x0 + 10, x0 + L, r()), p = [230 + d[0] * xx + (r() - .5) * 14, 230 + d[1] * xx - 6 - r() * 24];
            sp += '<circle cx="' + n1(p[0]) + '" cy="' + n1(p[1]) + '" r="' + n1(.4 + r() * .8) + '" fill="' + (r() > .5 ? '#ffe7a0' : '#ff8a30') + '"/>';
          }
          o += '<g filter="' + U('emb') + '" opacity=".9">' + sp + '</g>';
        }
        return o;
      },
      center: function () { return medalhao(emblemaEspada()); }
    };

    /* =====================================================================================
       kaalia4: Sangue e Ascensão (rosácea de vitral)
       ===================================================================================== */
    var LX0 = 64, LX1 = 182, LWI = 6, LWO = 15.5;
    function lancetaPath() {
      var xa = LX1 - LWO * 2.1;
      return 'M' + LX0 + ' ' + (-LWI) + 'L' + n1(xa) + ' ' + (-LWO) + 'C' + n1(xa + LWO * 1.25) + ' ' + (-LWO) + ' ' + n1(LX1 - LWO * .3) + ' ' + n1(-LWO * .55) + ' ' + LX1 + ' 0' +
        'C' + n1(LX1 - LWO * .3) + ' ' + n1(LWO * .55) + ' ' + n1(xa + LWO * 1.25) + ' ' + LWO + ' ' + n1(xa) + ' ' + LWO + 'L' + LX0 + ' ' + LWI + 'A' + LWI + ' ' + LWI + ' 0 0 1 ' + LX0 + ' ' + (-LWI) + 'Z';
    }
    // setor anelar em coordenadas do mundo (graus)
    function anel(r0, r1, a0, a1) {
      var s = '', n = Math.max(4, Math.round(Math.abs(a1 - a0) / 3)), k;
      for (k = 0; k <= n; k++) s += (k ? 'L' : 'M') + P(r0, lerp(a0, a1, k / n));
      for (k = n; k >= 0; k--) s += 'L' + P(r1, lerp(a0, a1, k / n));
      return s + 'Z';
    }
    // folha de vidro (pena, chama) com base em b, direção a, comprimento l, meia-largura w, curvatura bend
    function folhaVidro(b, a, l, w, bend) {
      var d = dir(a), n = [-d[1], d[0]];
      var tip = along(along(b, d, l), n, bend * l);
      var c1 = along(along(b, d, l * .35), n, w), c2 = along(along(b, d, l * .8), n, w * .7 + bend * l * .7);
      var c3 = along(along(b, d, l * .8), n, -w * .7 + bend * l * .7), c4 = along(along(b, d, l * .35), n, -w);
      return { d: 'M' + pt(b) + 'C' + pt(c1) + ' ' + pt(c2) + ' ' + pt(tip) + 'C' + pt(c3) + ' ' + pt(c4) + ' ' + pt(b) + 'Z', tip: tip,
        left: 'M' + pt(b) + 'C' + pt(c1) + ' ' + pt(c2) + ' ' + pt(tip) + 'Q' + pt(along(along(b, d, l * .5), n, bend * l * .4)) + ' ' + pt(b) + 'Z' };
    }
    var LEAD = '#16100e';
    // mosaico de fundo: grade polar com cantos tremidos e compartilhados (sem frestas)
    function mosaico(a0, a1, pal, seed) {
      var r = rng(seed), R = [54, 70, 88, 108, 130, 154, 172, 190], n = Math.round((a1 - a0) / 6.5), G = [], i, j, o = '';
      for (i = 0; i < R.length; i++) {
        G.push([]);
        for (j = 0; j <= n; j++) {
          var jr = (i > 0 && i < R.length - 1) ? (r() - .5) * 7 : 0, ja = (j > 0 && j < n) ? (r() - .5) * 2.6 : 0;
          G[i].push(pol(R[i] + jr, lerp(a0, a1, j / n) + ja));
        }
      }
      for (i = 0; i + 1 < R.length; i++) for (j = 0; j < n; j++)
        o += '<path d="' + poly([G[i][j], G[i][j + 1], G[i + 1][j + 1], G[i + 1][j]]) + '" fill="' + pal[Math.floor(r() * pal.length)] + '" stroke="' + LEAD + '" stroke-width="1"/>';
      return o;
    }
    // pena de vidro de ponta redonda, com o cálamo em chumbo
    function penaVidro(b, a, l, w) {
      var d = dir(a), n = [-d[1], d[0]], tip = along(b, d, l);
      var s1 = along(along(b, d, l * .3), n, w), s2 = along(along(b, d, l * .86), n, w * .95), s3 = along(along(b, d, l * .86), n, -w * .95), s4 = along(along(b, d, l * .3), n, -w);
      return { d: 'M' + pt(b) + 'Q' + pt(along(b, n, w)) + ' ' + pt(s1) + 'L' + pt(s2) + 'Q' + pt(along(tip, n, w * .7)) + ' ' + pt(tip) + 'Q' + pt(along(tip, n, -w * .7)) + ' ' + pt(s3) + 'L' + pt(s4) + 'Q' + pt(along(b, n, -w)) + ' ' + pt(b) + 'Z',
        half: 'M' + pt(b) + 'Q' + pt(along(b, n, -w)) + ' ' + pt(s4) + 'L' + pt(s3) + 'Q' + pt(along(tip, n, -w * .7)) + ' ' + pt(tip) + 'Z', rachis: 'M' + pt(along(b, d, 4)) + 'L' + pt(along(b, d, l - 3)) };
    }
    function campoAnjo(clip) {
      var r = rng(11), o = mosaico(-152, -28, ['#3a3054', '#4a3e6a', '#2e2644', '#52467a', '#3e3460'], 4);
      var pal = ['#f4f0fa', '#e2dbf0', '#cfc4e8', '#bcaee0', '#faf8fd'];
      // duas asas de penas largas abrindo a partir do alto
      [[-1, -96], [1, -84]].forEach(function (wg) {
        for (var k = 0; k < 9; k++) {
          var a = wg[1] + wg[0] * k * 6.6, b = pol(60 + k * 2, a), tilt = wg[0] * (8 + k * 2.4), l = 116 - k * 3 + r() * 4;
          var f = penaVidro(b, a + tilt, l, 7.4);
          o += '<path d="' + f.d + '" fill="' + pal[Math.floor(r() * pal.length)] + '" stroke="' + LEAD + '" stroke-width="1.2"/><path d="' + f.half + '" fill="#2a2040" opacity=".18"/>' +
            '<path d="' + f.rachis + '" stroke="' + LEAD + '" stroke-width=".9"/>';
        }
      });
      o += '<path d="' + anel(150, 158, -108, -72) + '" fill="#f2d98a" stroke="' + LEAD + '" stroke-width="1.2"/>';
      return '<g clip-path="url(#' + clip + ')">' + o + '</g>';
    }
    // chifre em segmentos de vidro (anéis de chumbo)
    function chifreVidro(a, b, c, d, w0, w1, nseg, cores) {
      var N = nseg * 4, L = [], R = [], k, o = '';
      for (k = 0; k <= N; k++) {
        var t = k / N, u = 1 - t;
        var p = [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
        var dv = [3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]), 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1])];
        var len = Math.hypot(dv[0], dv[1]) || 1, w = lerp(w0, w1, Math.pow(t, .9));
        L.push([p[0] - dv[1] / len * w, p[1] + dv[0] / len * w]); R.push([p[0] + dv[1] / len * w, p[1] - dv[0] / len * w]);
      }
      for (k = 0; k < nseg; k++) {
        var Ls = L.slice(k * 4, k * 4 + 5), Rs = R.slice(k * 4, k * 4 + 5);
        o += '<path d="M' + Ls.map(pt).join('L') + 'L' + Rs.reverse().map(pt).join('L') + 'Z" fill="' + cores[k % cores.length] + '" stroke="' + LEAD + '" stroke-width="1.1" stroke-linejoin="round"/>';
      }
      return o;
    }
    // par de chifres de marfim em segmentos de vidro (sem rosto), pontas para cima
    function chifresVidro() {
      var ivo = ['#7a6450', '#9c866a', '#bfa98a', '#dccbae', '#f6eedc'];
      return chifreVidro([-7, 4], [-24, 6], [-38, -4], [-40, -34], 7.5, .6, 5, ivo) + chifreVidro([7, 4], [24, 6], [38, -4], [40, -34], 7.5, .6, 5, ivo) +
        '<path d="M-15 14C-15 2 -8 -3 0 -3C8 -3 15 2 15 14Q0 19 -15 14Z" fill="#5a0810" stroke="' + LEAD + '" stroke-width="1.3"/>' +
        '<path d="M-15 14C-15 2 -8 -3 0 -3L0 16Q-8 16.5 -15 14Z" fill="#7a0c16" stroke="' + LEAD + '" stroke-width="1"/>';
    }
    function campoDemonio(clip) {
      var r = rng(23), o = mosaico(88, 212, ['#3a0a10', '#4e0e16', '#2c070c', '#5e1218', '#420c12'], 5);
      var pal = ['#c41e2a', '#e2452a', '#a8141e', '#ff6a3a', '#d23224'];
      // línguas de fogo subindo do centro
      for (var a = 92; a <= 208; a += 9) {
        var b = pol(58, a), l = 70 + r() * 40, f = folhaVidro(b, a + (r() - .5) * 6, l, 7, (r() - .5) * .3);
        o += '<path d="' + f.d + '" fill="' + pal[Math.floor(r() * pal.length)] + '" stroke="' + LEAD + '" stroke-width="1.1"/><path d="' + f.left + '" fill="#000" opacity=".18"/>';
        var f2 = folhaVidro(pol(60, a + 1), a, l * .55, 3.6, (r() - .5) * .2);
        o += '<path d="' + f2.d + '" fill="#ffb84a" stroke="' + LEAD + '" stroke-width=".9"/>';
      }
      // pares de chifres nos vãos de 135° e 180°
      [[135, 140], [180, 150]].forEach(function (q) { o += '<g transform="translate(' + pt(pol(q[1], q[0])) + ') scale(.82)">' + chifresVidro() + '</g>'; });
      return '<g clip-path="url(#' + clip + ')">' + o + '</g>';
    }
    function campoDragao(clip) {
      var r = rng(37), o = mosaico(-32, 92, ['#24123a', '#2e1848', '#1c0e2e', '#36205a', '#28143e'], 6);
      var pal = ['#5a2a8a', '#7a3aaa', '#3e1a62', '#9a5ac8', '#4a2276', '#6a30a0'];
      for (var rr = 186, ri = 0; rr > 58; rr -= 11, ri++) {
        var step = 14 / rr * 57.3;
        for (var a = -36 + (ri % 2) * step / 2; a < 96; a += step) {
          var c = pol(rr, a), d = dir(a), n = [-d[1], d[0]], s = 7.2;
          o += '<path d="M' + pt(along(c, n, -s)) + 'Q' + pt(along(along(c, n, -s), d, -10)) + ' ' + pt(along(c, d, -13)) + 'Q' + pt(along(along(c, n, s), d, -10)) + ' ' + pt(along(c, n, s)) + 'Z" fill="' + pal[Math.floor(r() * pal.length)] + '" stroke="' + LEAD + '" stroke-width="1"/>';
        }
      }
      // olho de dragão nos vãos de 0° e 45°
      [0, 45].forEach(function (ac) {
        var c = pol(128, ac), d = [0, 1], n = [1, 0];
        var e0 = along(c, n, -24), e1 = along(c, n, 24);
        o += '<path d="M' + pt(e0) + 'Q' + pt(along(c, d, -22)) + ' ' + pt(e1) + 'Q' + pt(along(c, d, 22)) + ' ' + pt(e0) + 'Z" fill="#14081c" stroke="' + LEAD + '" stroke-width="2"/>';
        o += '<path d="M' + pt(along(c, n, -20)) + 'Q' + pt(along(c, d, -17)) + ' ' + pt(along(c, n, 20)) + 'Q' + pt(along(c, d, 17)) + ' ' + pt(along(c, n, -20)) + 'Z" fill="' + U('eyeD') + '" stroke="' + LEAD + '" stroke-width="1.2"/>';
        o += '<path d="M' + pt(along(c, d, -9)) + 'L' + pt(along(c, n, -20)) + 'M' + pt(along(c, d, 9)) + 'L' + pt(along(c, n, 20)) + 'M' + pt(along(c, d, -9)) + 'L' + pt(along(c, n, 20)) + 'M' + pt(along(c, d, 9)) + 'L' + pt(along(c, n, -20)) + '" stroke="' + LEAD + '" stroke-width=".8" opacity=".7"/>';
        o += '<path d="M' + pt(along(c, d, -16)) + 'Q' + pt(along(c, n, -3.6)) + ' ' + pt(along(c, d, 16)) + 'Q' + pt(along(c, n, 3.6)) + ' ' + pt(along(c, d, -16)) + 'Z" fill="#0a0406" stroke="' + LEAD + '" stroke-width=".8"/>';
      });
      return '<g clip-path="url(#' + clip + ')">' + o + '</g>';
    }


    /* =====================================================================================
       kaalia5: Ruínas de Alara
       ===================================================================================== */
    var CORES3 = [['#f6f2ff', '#c8b8ff'], ['#ff3a2a', '#b01212'], ['#b660ff', '#5a1aa0']];
    function espiral(base, off, r0, r1, turns, pw, N) {
      var Q = [];
      for (var i = 0; i <= N; i++) { var s = i / N, th = (base + off) * Math.PI / 180 + s * turns * Math.PI, rr = r0 + (r1 - r0) * Math.pow(s, pw); Q.push([230 + rr * Math.cos(th), 230 + rr * Math.sin(th)]); }
      return Q;
    }
    function redemoinho() {
      var o = '<circle cx="230" cy="230" r="160" fill="' + U('core') + '"/>';
      CORES3.forEach(function (c, k) {
        var gid = C.uid('kqArm'), N = 80, i, base = -90 + k * 120;
        var M = espiral(base, 0, 30, 182, .95, .78, N);
        var Lp = [], Rp = [];
        for (i = 0; i <= N; i++) {
          var a = M[Math.max(0, i - 1)], b = M[Math.min(N, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
          var s2 = i / N, w = 19 * Math.pow(1 - s2, 1.1) * Math.min(1, .3 + s2 * 6);
          Lp.push([M[i][0] - dy / L * w, M[i][1] + dx / L * w]); Rp.push([M[i][0] + dy / L * w * .3, M[i][1] - dx / L * w * .3]);
        }
        var arm = 'M' + Lp.map(pt).join('L') + 'L' + Rp.reverse().map(pt).join('L') + 'Z';
        o += '<defs><radialGradient id="' + gid + '" gradientUnits="userSpaceOnUse" cx="230" cy="230" r="185">' + stops([[0, c[0], 1], [.4, c[0], .9], [.72, c[1], .7], [1, c[1], 0]]) + '</radialGradient></defs>';
        o += '<path d="' + arm + '" fill="' + c[1] + '" opacity=".6" filter="' + U('b8') + '"/>';
        o += '<path d="' + arm + '" fill="url(#' + gid + ')"/>';
        // feixe de fios que acompanha o braço
        for (var j = 0; j < 9; j++) {
          var off = -30 + j * 7 + (j % 2) * 2, Q = espiral(base, off, 36 + j * 2, 180 - (j % 3) * 9, .95, .78 + (j % 3) * .06, 70);
          o += '<path d="M' + Q.map(pt).join('L') + '" fill="none" stroke="url(#' + gid + ')" stroke-width="' + (j % 3 ? .7 : 1.3) + '" opacity="' + (.35 + (j % 4) * .15).toFixed(2) + '"/>';
        }
        o += '<path d="M' + M.slice(3, N - 8).map(pt).join('L') + '" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1" filter="' + U('b1') + '"/>';
      });
      var r = rng(55), sp = '';
      for (var k = 0; k < 70; k++) { var a = r() * 360, rr = 60 + r() * 120, p = pol(rr, a); sp += '<circle cx="' + n1(p[0]) + '" cy="' + n1(p[1]) + '" r="' + n1(.3 + r() * .8) + '" fill="' + CORES3[k % 3][0] + '" opacity="' + (.3 + r() * .6).toFixed(2) + '"/>'; }
      return o + sp;
    }
    // bloco de pedra: setor anelar com bordas opcionalmente quebradas
    function pedraSetor(ra, rb, a0, a1, jag, r) {
      var Pp = [], n = Math.max(3, Math.round((a1 - a0) / 2.5)), k, rr, aa;
      for (k = 0; k <= n; k++) { aa = lerp(a0, a1, k / n); rr = ra + (k > 0 && k < n ? (r() - .5) * 2 * jag[0] : 0); Pp.push(pol(rr, aa)); }
      for (k = 1; k < 4; k++) { rr = lerp(ra, rb, k / 4); Pp.push(pol(rr, a1 + (r() - .5) * 2 * jag[2] / rr * 57.3)); }
      for (k = n; k >= 0; k--) { aa = lerp(a0, a1, k / n); rr = rb + (k > 0 && k < n ? (r() - .5) * 2 * jag[1] : 0); Pp.push(pol(rr, aa)); }
      for (k = 3; k > 0; k--) { rr = lerp(ra, rb, k / 4); Pp.push(pol(rr, a0 + (r() - .5) * 2 * jag[2] / rr * 57.3)); }
      return Pp;
    }
    function mover(Pp, dxy, rotDeg) {
      var cx = 0, cy = 0; Pp.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= Pp.length; cy /= Pp.length;
      var t = rotDeg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
      return Pp.map(function (p) { var x = p[0] - cx, y = p[1] - cy; return [cx + x * c - y * s + dxy[0], cy + x * s + y * c + dxy[1]]; });
    }
    function pedra(Pp, fill, hl) {
      var d = poly(Pp);
      return '<path d="' + d + '" transform="translate(-.8 -.8)" fill="' + (hl || '#efe4d8') + '" fill-opacity=".5"/>' +
        '<path d="' + d + '" transform="translate(1.1 1.4)" fill="#000" fill-opacity=".75"/>' +
        '<path d="' + d + '" fill="' + fill + '"/>';
    }
    var RB = [66, 95, 124, 153, 182], HW = 10.5;

  })();

  // legenda embaixo do gráfico: "Cada <peça><texto> Toque num(a) <peça> para abrir no tabelão."
  MOTIVOS.kaalia3.legenda = { peca: "lâmina", masc: false, texto: " é um agrupamento: o comprimento acompanha a soma das notas, e a maior fica em brasa." };

  return MOTIVOS.kaalia3;
})();
