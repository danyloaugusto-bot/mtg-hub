/* A Consulta (saidas/00. Consulta.html): uma carta de fora contra todos os decks (contexto/consulta/CONSULTA.md).
   Modo "registrada": o estudo gravado pelo /consulta no Claude Code (dados/consultas/), sem rede nenhuma. Modo "ao vivo" (página
   publicada, com o Claude liberado): a carta pelo Scryfall, o estudo pelo Claude (sample), a conta pela página, igual à do
   motor/encaixe.py (o teste prova), guardado no banco do artefato para o /consulta importar. Sem as capacidades, a página funciona
   inteira no modo registrada.
   É só consulta (decisão do dono, 22/10/2026): nada aqui muda deck, radar ou cadastro. */
(function () {
'use strict';
var D = /*__DATA__*/null;
var PUB = location.protocol !== 'file:';
function $(s) { return document.querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function num(n, d) { return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d == null ? 2 : d }); }
function sinal(n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + num(Math.abs(n)); }
function data(s) { var p = String(s || '').split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : (s || ''); }
function usd(v) { return v == null || v === '' ? null : 'US$ ' + num(Number(v), 2); }
function semAcento(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
function cores(s) {
  var c = String(s || '').toUpperCase(); if (!c) return '<span class="cores" aria-label="Incolor"><i class="ms ms-n">C</i></span>';
  return '<span class="cores" aria-label="Cores: ' + esc(c) + '">' + 'WUBRG'.split('').filter(function (k) { return c.indexOf(k) >= 0; }).map(function (k) { return '<i class="ms ms-' + k + '">' + k + '</i>'; }).join('') + '</span>';
}
function simbolo(k, extra) { return /^[WUBRG]$/.test(k) ? '<i class="ms ms-' + k + extra + '">' + k + '</i>' : '<i class="ms ms-n' + extra + '">' + esc(k) + '</i>'; }
function custo(s) { return '<span class="cs-mana">' + (String(s || '').match(/\{[^}]+\}/g) || []).map(function (t) { return simbolo(t.slice(1, -1), ''); }).join('') + '</span>'; }
function textoMana(s) { return esc(s).replace(/\{([^}]+)\}/g, function (_, k) { return simbolo(k, ' ms-in'); }); }

/* ============ a conta do encaixe: a mesma do motor/encaixe.py ============ */
var CRIT = D.regua.criterios, KS = CRIT.map(function (c) { return c.k; }), PESO = CRIT.map(function (c) { return c.peso; }), FAIXA = CRIT.map(function (c) { return c.faixa; });
function valor(s3, mult) { var t = 0; for (var i = 0; i < s3.length; i++) if (s3[i]) t += PESO[i] * D.regua.pontos[s3[i]] * (mult ? mult[i] : 1); return t; }
function pontosAcel(y) { var a = D.regua.aceleracao; return y < 0 ? 0 : Math.min(a.teto, a.piso + a.pontos_por_passo * Math.floor(y / a.passo)); }
function acel(ace, cmc, nl) { var avg = nl ? cmc / nl : 0; return [pontosAcel(avg ? ace / avg : 0), avg]; }
function r2(x) { return Math.round(x * 100) / 100; }
function chaveLado(c) { return c && c.mdfc ? 'ambos' : c && c.land ? 'terra' : 'magia'; }
/* nome: a carta; s3: as dez notas dela neste deck (as duas sinergias e as oito do cadastro); carta: {cmc, land, mdfc} */
function ganho(nome, s3, dk, carta) {
  var ci = carta && carta.ci != null ? carta.ci : '';
  for (var k = 0; k < ci.length; k++) if (dk.ident.indexOf(ci[k]) < 0) return null;
  var base = String(nome).split(' // ')[0], X = dk.ctx, proprio = dk.ja[base];
  var s = proprio ? proprio.slice() : s3.slice();
  var sai = X.sai[chaveLado(carta)];
  var vc = valor(s, X.mult), vs = sai ? sai.v : 0;
  var out = { valor: r2(vc), sai: sai ? sai.n : null, valor_sai: r2(vs), ganho: r2(vc - vs), ja_no_deck: dk.no_deck.indexOf(base) >= 0,
    cobre: KS.filter(function (_, i) { return s[i] >= 2 && X.ncrit[i] < FAIXA[i][0]; }) };
  if (carta && sai && !out.ja_no_deck) {
    var a0 = acel(X.ace, X.cmc, X.nl), cmc1 = X.cmc, nl1 = X.nl;
    if (!sai.land) { cmc1 -= sai.cmc; nl1 -= 1; }
    if (!carta.land) { cmc1 += carta.cmc || 0; nl1 += 1; }
    var a1 = acel(X.ace - sai.acel + s[X.ia], cmc1, nl1);
    out.d_cmc = Math.round((a1[1] - a0[1]) * 1000) / 1000; out.d_acel = a1[0] - a0[0];
  }
  return out;
}
function tierEstimado(v, med) {
  var pres = ['A', 'B', 'C', 'D'].filter(function (t) { return med[t] != null; });
  for (var i = 0; i < pres.length; i++) if (v >= med[pres[i]]) return pres[i];
  return pres.length ? pres[pres.length - 1] : null;
}
function grauVacuo(v, gc, rank) {
  var L = D.regua.vacuo;
  for (var i = 0; i < L.length; i++) {
    var x = L[i];
    if ((x.gc && gc) || (x.rank_max != null && rank && rank <= x.rank_max) || (x.valor_min != null && v >= x.valor_min)) return x.grau;
    if (x.valor_min == null && x.rank_max == null && !x.gc) return x.grau;
  }
  return 'D';
}

/* ============ a barra do topo, a mesma do hub ============ */
function barra() {
  var N = D.nav || {}, hub = N.hub || {}, b = PUB && hub.pub ? hub.pub : (hub.href || '00.%20Hub.html');
  $('#cs-l-decks').href = b + '#decks'; $('#cs-l-pastas').href = b + '#pastas'; $('#cs-l-dash').href = b + '#dashboard';
  var cx = $('#cs-l-caixa'); if (N.caixa) { cx.hidden = false; cx.href = PUB && N.caixa.pub ? N.caixa.pub : N.caixa.href; }
  var g = $('#cs-l-grim'); if (N.grim) { g.hidden = false; g.href = PUB && N.grim.pub ? N.grim.pub : N.grim.href; }
  var cc = $('#cs-l-cic'); if (N.cic) { cc.hidden = false; cc.href = PUB && N.cic.pub ? N.cic.pub : N.cic.href; }
}

/* ============ o estudo registrado ============ */
var VER = { entra: ['Entra', 'ok'], avaliar: ['Avaliar', 'warn'], fora: ['Fica de fora', 'info'] };
var COMPRA = { comprar: ['Comprar', 'ok'], esperar: ['Esperar', 'warn'], 'so-se-sobrar': ['Só se sobrar', 'warn'], nao: ['Não comprar', 'bad'] };
var ORD = [['ganho', 'Ganho'], ['valor', 'Valor'], ['nome', 'Deck'], ['grupo', 'Grupo']];
var ui = { ord: 'ganho', R: null, vivo: null };
function nomeCrit(k) { for (var i = 0; i < CRIT.length; i++) if (CRIT[i].k === k) return CRIT[i].nome; return k; }

function blocoCarta(R) {
  var C = R.carta, F = R.forca || {}, cad = R.cadastro || {};
  var esc0 = Math.max(18, F.valor_proprio || 0), w = function (x) { return (Math.min(x, esc0) / esc0 * 100).toFixed(1) + '%'; };
  var forte = (D.regua.vacuo.filter(function (x) { return x.grau === 'A'; })[0] || {}).valor_min;
  var notas = KS.slice(2).filter(function (k) { return (cad.n || {})[k]; }).map(function (k) { return '<li><span>' + esc(nomeCrit(k)) + '</span><b class="num">' + cad.n[k] + '</b></li>'; }).join('');
  var faces = C.faces && C.faces.length ? C.faces.map(function (f) { return '<p class="cs-face"><b>' + esc(f.nome) + '</b> ' + custo(f.custo) + '<br><span>' + esc(f.tipo) + '</span></p>' + textoMana(f.texto).replace(/\n/g, '<br>'); }).join('<hr>') : textoMana(C.texto).replace(/\n/g, '<br>');
  return '<section class="cs-carta">' +
    '<figure class="cs-img">' + (C.img ? '<img src="' + C.img + '" alt="' + esc(C.nome) + '" width="300" height="418">' : '<div class="cs-semimg">sem imagem no cache</div>') +
      (C.artista ? '<figcaption>Arte: ' + esc(C.artista) + ' · © Wizards of the Coast</figcaption>' : '') + '</figure>' +
    '<div class="cs-ficha">' +
      '<div class="cs-nome"><h2>' + esc(C.nome) + '</h2>' + custo(C.custo) + '</div>' +
      '<p class="cs-tipo">' + esc(C.tipo) + (C.pt ? ' <span class="cs-pt num">' + esc(C.pt) + '</span>' : '') + ' ' + cores(C.ci) + '</p>' +
      (R.avisos || []).map(function (a) { return '<p class="cs-aviso">' + esc(a.charAt(0).toUpperCase() + a.slice(1)) + '</p>'; }).join('') +
      '<blockquote class="cs-oracle">' + faces + '</blockquote>' +
      '<p class="cs-meta">' + esc(String(C.set || '').toUpperCase()) + ' ' + esc(C.num) + ' · lançamento ' + data(C.lancamento) + ' · <a href="' + esc(C.link) + '" target="_blank" rel="noopener noreferrer">ver no Scryfall</a></p>' +
    '</div>' +
    '<aside class="cs-vacuo" aria-label="A carta no vácuo">' +
      '<div class="cs-vh"><span class="cs-grau g-' + esc(F.grau || 'x') + '">' + esc(F.grau || '—') + '</span><div><b>No vácuo</b><span>a força dela sozinha, pela régua da Caixa</span></div></div>' +
      (F.valor_proprio != null ? '<div class="cs-vbar"><span class="cs-vb"><i style="width:' + w(F.valor_proprio) + '"></i><em style="left:' + w(F.mediana) + '"><small>mediana</small></em>' +
        (forte ? '<em style="left:' + w(forte) + '"><small>forte</small></em>' : '') + '</span>' +
        '<span class="cs-vn"><b class="num">' + num(F.valor_proprio) + '</b> de valor próprio · mediana ' + num(F.mediana) + (F.percentil != null ? ' · acima de ' + F.percentil + '% do cadastro' : '') + '</span></div>' : '') +
      (notas ? '<ul class="cs-notas">' + notas + '</ul>' : '<p class="cs-pq">Nenhuma nota nos oito critérios da carta.</p>') +
      (cad.por_que ? '<p class="cs-pq">' + esc(cad.por_que) + '</p>' : '') +
      '<p class="cs-sinais">' + (F.gc ? '<span class="pill bad">Game Changer</span>' : '<span class="pill info">não é Game Changer</span>') + (F.rank ? ' <span class="pill info">EDHREC #' + F.rank + '</span>' : ' <span class="pill info">EDHREC sem dado</span>') +
        (cad.fonte === 'consulta' ? ' <span class="pill info" title="As notas ficam no registro da consulta; o cadastro de cartas não muda">notas da consulta</span>' : '') + '</p>' +
      '<details class="cs-regua"><summary>Como sai o grau</summary><table><tbody>' + D.regua.vacuo.map(function (x) {
        var t = [];
        if (x.gc) t.push('Game Changer'); if (x.rank_max != null) t.push('EDHREC até #' + x.rank_max); if (x.valor_min != null) t.push('valor a partir de ' + num(x.valor_min) + (x.grau === 'C' ? ' (mediana)' : ''));
        return '<tr><th>' + x.grau + '</th><td>' + (t.length ? t.join(', ou ') : 'o resto') + '</td></tr>';
      }).join('') + '</tbody></table></details>' +
    '</aside></section>';
}
function blocoEstudo(R) {
  var E = R.estudo;
  return '<section class="cs-est">' +
    '<div class="cx cs-leit"><h3>O que faz de verdade</h3><p>' + textoMana(E.leitura) + '</p></div>' +
    '<div class="cs-fw">' +
      '<div class="cx cs-for"><h3><span class="cs-ic ok">▲</span>Fortalezas</h3><ul>' + E.forcas.map(function (x) { return '<li>' + textoMana(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="cx cs-fra"><h3><span class="cs-ic bad">▼</span>Fraquezas</h3><ul>' + E.fraquezas.map(function (x) { return '<li>' + textoMana(x) + '</li>'; }).join('') + '</ul></div>' +
    '</div>' +
    '<div class="cx cs-vtx"><h3>No vácuo: grau ' + esc(E.vacuo.grau) + '</h3><p>' + textoMana(E.vacuo.porque) + '</p></div>' +
  '</section>';
}
function barraGanho(g) {
  var lo = -5, hi = 15, p = function (x) { return (Math.max(lo, Math.min(hi, x)) - lo) / (hi - lo) * 100; };
  var cls = g >= D.regua.deck ? 'deck' : g >= D.regua.guardar ? 'guardar' : g > 0 ? 'abaixo' : 'neg';
  var a = Math.min(p(0), p(g)), b = Math.max(p(0), p(g));
  return '<div class="cs-gb" title="Ganho no placar do deck, se ela entrasse no lugar de quem sai pelo motor">' +
    '<span class="cs-gt"><i class="' + cls + '" style="left:' + a.toFixed(1) + '%;width:' + (b - a).toFixed(1) + '%"></i>' +
    '<em class="z" style="left:' + p(0).toFixed(1) + '%"></em><em style="left:' + p(D.regua.guardar).toFixed(1) + '%"><small>Guardar ' + D.regua.guardar + '</small></em>' +
    '<em style="left:' + p(D.regua.deck).toFixed(1) + '%"><small>Deck ' + D.regua.deck + '</small></em></span>' +
    '<b class="num cs-gv ' + cls + '">' + sinal(g) + '</b></div>';
}
function sinPill(x, dk, i) {
  var n = x.sin[i], pq = (x.sin_por_que || {})['sin' + (i + 1)];
  var h = '<span class="cs-sn">' + esc(dk.sn[i]) + '</span><b class="num">' + n + '</b>';
  return pq ? '<details class="cs-sp s' + n + '"><summary>' + h + '</summary><p>' + esc(pq) + '</p></details>' : '<span class="cs-sp s0">' + h + '</span>';
}
function situacao(x, dk) {
  var t = [], o = (x.situacao || {}).onde;
  if (o === 'deck') t.push('<span class="pill ok">já no deck</span>');
  if (o === 'radar') t.push('<span class="pill info">já no radar</span>');
  if (dk.desejo) t.push('<span class="pill info">Desejo</span>');
  if (dk.precon) t.push('<span class="pill info">precon intacto</span>');
  return t.join(' ');
}
function linhas(R) {
  var V = (R.vereditos || {}).decks || {};
  return (R.encaixe || []).filter(function (x) { return D.decks[x.pasta]; }).map(function (x) {
    var v = V[x.pasta] || {}, dk = D.decks[x.pasta], cri = /Creature/.test(String(R.carta.tipo || '').split('//')[0]);
    var comp = dk.cartas.filter(function (c) { return c[2] === (cri ? 1 : 0) && Math.abs(c[1] - (R.carta.cmc || 0)) <= 1; }).sort(function (a, b) { return a[3] - b[3] || (a[0] < b[0] ? -1 : 1); });
    return { x: x, dk: dk, ver: v.veredito || 'fora', pq: v.porque, pratica: v.sai, fraca: comp[0] ? comp[0][0] : null };
  });
}
function cartao(L) {
  var x = L.x, dk = L.dk, V = VER[L.ver];
  return '<article class="cs-dk v-' + L.ver + '" data-pasta="' + esc(x.pasta) + '">' +
    '<div class="cs-dk-capa"' + (dk.capa ? ' style="background-image:url(' + dk.capa + ')"' : '') + '><span class="pill ' + V[1] + '">' + V[0] + '</span></div>' +
    '<div class="cs-dk-in">' +
      '<header><div><h4>' + esc(dk.painel) + '</h4><p>' + esc(x.pasta.slice(4)) + (dk.cmd && dk.cmd !== x.pasta.slice(4) ? ' · ' + esc(dk.cmd) : '') + '</p></div>' + cores(dk.ident) + '</header>' +
      '<div class="cs-sps">' + sinPill(x, dk, 0) + sinPill(x, dk, 1) + '</div>' +
      barraGanho(x.ganho) +
      '<dl class="cs-nums"><div><dt>Valor</dt><dd class="num">' + num(x.valor) + '</dd></div><div><dt>Tier estimado</dt><dd class="num">~' + esc(x.tier_estimado || '—') + '</dd></div>' +
        '<div><dt>Na fila</dt><dd class="num">' + (x.magicas ? 'acima de ' + x.acima_de + ' de ' + x.magicas : '—') + '</dd></div></dl>' +
      (L.pratica ? '<p class="cs-sai"><span>Sai na prática</span><b>' + esc(L.pratica) + '</b></p>' : '<p class="cs-sai"><span>Disputa a vaga com</span><b>' + esc(L.fraca || '—') + '</b></p>') +
      '<p class="cs-sai m"><span>Sai pelo motor</span><b>' + esc(x.sai || '—') + (x.valor_sai != null ? ' <small class="num">' + num(x.valor_sai) + '</small>' : '') + '</b></p>' +
      ((x.cobre || []).length ? '<p class="cs-cobre">' + x.cobre.map(function (k) { return '<span title="Critério abaixo da faixa no deck, que a carta ajuda">cobre ' + esc(nomeCrit(k)) + '</span>'; }).join('') + '</p>' : '') +
      (situacao(x, dk) ? '<p class="cs-sit">' + situacao(x, dk) + '</p>' : '') +
      (L.pq ? '<p class="cs-pqd">' + textoMana(L.pq) + '</p>' : '') +
    '</div></article>';
}
function ordenar(L) {
  var k = ui.ord;
  return L.slice().sort(function (a, b) {
    var A = a.x, B = b.x;
    return k === 'valor' ? B.valor - A.valor || B.ganho - A.ganho : k === 'nome' ? A.pasta.slice(4).localeCompare(B.pasta.slice(4)) : k === 'grupo' ? A.pasta.localeCompare(B.pasta) : B.ganho - A.ganho || A.pasta.localeCompare(B.pasta);
  });
}
function blocoDecks(R) {
  var L = linhas(R), nas = {}; L.forEach(function (l) { nas[l.x.pasta] = 1; });
  var fora = Object.keys(D.decks).filter(function (p) { return !nas[p]; }).sort();
  var B = [
    ['entra', 'Entra', 'veredito entra', L.filter(function (l) { return l.ver === 'entra'; })],
    ['avaliar', 'Avaliar', 'vale testar no lugar de quem sai na prática', L.filter(function (l) { return l.ver === 'avaliar'; })],
    ['fora', 'Fica de fora, com sinergia', 'tem ligação com o deck, mas não ganha a vaga', L.filter(function (l) { return l.ver === 'fora' && (l.x.sin[0] || l.x.sin[1]); })]
  ];
  var sem = ordenar(L.filter(function (l) { return l.ver === 'fora' && !l.x.sin[0] && !l.x.sin[1]; }));
  var seg = '<div class="seg" role="group" aria-label="Ordenar os decks"><span class="seg-l">Ordenar</span>' + ORD.map(function (o) { return '<button data-ord="' + o[0] + '" aria-pressed="' + (ui.ord === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>';
  var h = '<section class="cs-decks" id="cs-decks"><div class="cs-sh"><div><h2>Nos seus decks</h2><p>' + L.length + ' decks nas cores dela, ' + fora.length + ' fora. Ganho contra a régua da Caixa: ' + D.regua.guardar + ' para Guardar, ' + D.regua.deck + ' para Deck.</p></div>' + seg + '</div>';
  B.forEach(function (b) {
    h += '<div class="cs-bl cs-bl-' + b[0] + '" data-bloco="' + b[0] + '"><h3>' + b[1] + ' <small class="num">' + b[3].length + '</small><span>' + b[2] + '</span></h3>' +
      (b[3].length ? '<div class="cs-grade">' + ordenar(b[3]).map(cartao).join('') + '</div>' : '<p class="cs-vazio">Nenhum deck.</p>') + '</div>';
  });
  h += '<div class="cs-bl cs-bl-sem" data-bloco="sem"><h3>Sem ligação <small class="num">' + sem.length + '</small><span>0 nas duas sinergias: entraria só pelo valor próprio</span></h3>' +
    (sem.length ? '<div class="cs-linhas">' + sem.map(function (l) {
      return '<div class="cs-ln" data-pasta="' + esc(l.x.pasta) + '"><span class="cs-ln-n">' + esc(l.x.pasta.slice(4)) + cores(l.dk.ident) + '</span>' + barraGanho(l.x.ganho) +
        '<span class="cs-ln-s">sai ' + esc(l.x.sai || '—') + '</span><span class="cs-ln-t">' + situacao(l.x, l.dk) + '</span></div>';
    }).join('') + '</div>' : '<p class="cs-vazio">Nenhum deck.</p>') + '</div>';
  h += '<div class="cs-bl cs-bl-fora" data-bloco="cores"><h3>Fora das cores <small class="num">' + fora.length + '</small><span>a identidade do comandante não deixa</span></h3>' +
    (fora.length ? '<p class="chips cs-fora">' + fora.map(function (p) { return '<span>' + esc(p.slice(4)) + '</span>'; }).join('') + '</p>' : '<p class="cs-vazio">Nenhum deck.</p>') + '</div>';
  return h + '</section>';
}
function comando(t) { return '/consulta ' + t; }
function blocoFim(R) {
  var E = R.estudo, ve = R.vereditos || {}, cp = ve.compra || {}, C = COMPRA[cp.acao] || ['—', 'info'];
  var arm = Object.keys(E.armadilhas || {});
  var preco = usd(R.usd);
  return '<section class="cs-fim">' +
    '<div class="cx cs-arm"><h3>Armadilhas</h3><p class="cs-sub2">O que parece sinergia e não é.</p>' +
      (arm.length ? '<ul>' + arm.map(function (p) { return '<li><b>' + esc(p.slice(4)) + '</b><span>' + textoMana(E.armadilhas[p]) + '</span></li>'; }).join('') + '</ul>' : '<p class="cs-vazio">Nenhuma.</p>') + '</div>' +
    '<div class="cx cs-cmp"><h3>Compra</h3><p class="cs-acao ' + C[1] + '">' + C[0] + '</p><p>' + textoMana(cp.porque || '') + '</p>' +
      (preco ? '<p class="cs-preco">Preço no Scryfall em ' + data(R.data) + ': <b class="num">' + preco + '</b>' + (usd(R.usd_foil) ? ' · foil <b class="num">' + usd(R.usd_foil) + '</b>' : '') + '</p>' : '') + '</div>' +
  '</section>' + blocoComando(R.carta.link, 'Refazer esta consulta', 'O estudo registrado é o do Claude Code, com o projeto inteiro à vista. Para refazer (preço novo, deck novo), cole este comando lá:');
}
function blocoComando(link, titulo, texto) {
  return '<section class="cx cs-cmd"><div><h3>' + esc(titulo) + '</h3><p>' + esc(texto) + '</p></div>' +
    '<div class="cs-cmd-l"><code id="cs-cmd">' + esc(comando(link)) + '</code><button type="button" class="cs-copiar" data-copiar="cs-cmd">Copiar</button></div></section>';
}

/* ============ modo ao vivo (fase 2): a carta pelo Scryfall, o estudo pelo Claude, a conta pela página ============ */
var LIVE = { sample: null, db: null, user: null, mcp: null, dono: false, docs: [], pronto: false };
var HOJE = (function () { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); })();
function slug(n) { return semAcento(n).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120) || 'carta'; }
function apiUrl(p) {
  if (!p) return null;
  if (p.tipo === 'carta') return 'https://api.scryfall.com/cards/' + encodeURIComponent(p.set) + '/' + encodeURIComponent(p.num);
  if (p.tipo === 'nome') return 'https://api.scryfall.com/cards/named?fuzzy=' + encodeURIComponent(p.nome);
  return null;
}
/* o que a página guarda de uma carta do Scryfall: só o que o estudo usa (e o preço, que o dono quer ver) */
function normalizar(k) {
  if (!k || k.object === 'error' || !k.name) throw new Error(k && k.details ? k.details : 'não é uma carta do Scryfall');
  if (k.object === 'list') throw new Error('a busca deu mais de uma carta: cole o link de uma só');
  var faces = (k.card_faces || []).map(function (f) { return { nome: f.name, custo: f.mana_cost || '', tipo: f.type_line || '', texto: f.oracle_text || '' }; });
  var frente = faces[0] || {};
  var texto = k.oracle_text || faces.map(function (f) { return f.nome + ' ' + f.custo + '\n' + f.tipo + '\n' + f.texto; }).join('\n//\n');
  if (!String(texto).trim() && !faces.length) throw new Error('o Scryfall não trouxe o texto da carta');
  var tipo = k.type_line || frente.tipo || '';
  return {
    nome: String(k.name).split(' // ')[0], custo: k.mana_cost || frente.custo || '', cmc: Number(k.cmc) || 0, tipo: tipo, texto: texto,
    ci: (k.color_identity || []).join(''), set: k.set, num: k.collector_number, lancamento: k.released_at || '', leg: (k.legalities || {}).commander || null,
    rank: k.edhrec_rank || null, gc: !!k.game_changer, faces: faces.length ? faces : null, pt: k.power != null ? k.power + '/' + k.toughness : null,
    artista: k.artist || null, link: 'https://scryfall.com/card/' + k.set + '/' + k.collector_number,
    usd: (k.prices || {}).usd || null, usd_foil: (k.prices || {}).usd_foil || null,
    terreno: /Land/.test(tipo.split('//')[0]), mdfc: !!faces.length && /Land/.test(tipo.split('//').slice(-1)[0]),
    img: !PUB && k.image_uris ? k.image_uris.normal : (!PUB && k.card_faces && k.card_faces[0].image_uris ? k.card_faces[0].image_uris.normal : null)
  };
}
function avisosDa(C) {
  var a = [];
  if (C.lancamento && C.lancamento > HOJE) a.push('pré-lançamento: sai em ' + C.lancamento + '; o preço é de pré-venda e o EDHREC ainda não tem dado');
  if (C.leg === 'banned') a.push('banida no Commander');
  else if (C.leg && C.leg !== 'legal' && C.leg !== 'restricted' && !(C.lancamento > HOJE)) a.push('não é legal no Commander (' + C.leg + ')');
  return a;
}
/* a carta no navegador do app Claude: a mesma URL da API, lida como texto da página */
function viaNavegador(url) {
  return LIVE.mcp.callTool('host:claude_browser', 'get_page_text', { url: url }).then(function (r) {
    var t = r && r.payload, s = typeof t === 'string' ? t : (t && (t.text || t.content)) || (r.content || []).map(function (b) { return b.text || ''; }).join('');
    var i = s.indexOf('{'), j = s.lastIndexOf('}');
    return JSON.parse(s.slice(i, j + 1));
  });
}
function buscarCarta(p) {
  var url = apiUrl(p);
  if (!url) return Promise.reject(new Error('para buscar, cole o link de uma carta do Scryfall ou o nome em inglês'));
  if (!PUB && window.fetch) return fetch(url, { headers: { Accept: 'application/json' } }).then(function (r) { return r.json(); }).then(normalizar);
  if (LIVE.mcp) return viaNavegador(url).then(normalizar);
  return Promise.reject(new Error('esta página publicada não alcança o Scryfall sozinha'));
}

/* a ficha com os números que a página sabe sem o Claude: valor próprio (se a carta tem cadastro) e o piso do encaixe */
function notasDoCadastro(nome) { var n = D.cad && D.cad[nome]; if (!n) return null; var o = {}; KS.slice(2).forEach(function (k, i) { if (n[i]) o[k] = n[i]; }); return o; }
function s3De(n, sin) { return [sin ? sin[0] : 0, sin ? sin[1] : 0].concat(KS.slice(2).map(function (k) { return (n || {})[k] || 0; })); }
function percentil(v) { var q = D.cadastro.quantis || []; if (!q.length) return null; var i = 0; while (i < q.length && q[i] < v) i++; return Math.round(i / (q.length - 1) * 100); }
function decksNasCores(C) { return Object.keys(D.decks).filter(function (p) { var ci = C.ci || ''; for (var i = 0; i < ci.length; i++) if (D.decks[p].ident.indexOf(ci[i]) < 0) return false; return true; }).sort(); }
function comparaveis(dk, C, n) {
  var cri = /Creature/.test(String(C.tipo).split('//')[0]) ? 1 : 0;
  return dk.cartas.filter(function (c) { return c[2] === cri && Math.abs(c[1] - (C.cmc || 0)) <= 1; }).sort(function (a, b) { return a[3] - b[3] || (a[0] < b[0] ? -1 : 1); }).slice(0, n || 6);
}
function maisFracas(dk, n) { return dk.cartas.filter(function (c) { return !c[5]; }).sort(function (a, b) { return a[3] - b[3] || (a[0] < b[0] ? -1 : 1); }).slice(0, n || 5); }

/* ---------- o pedido ao Claude: tudo o que ele precisa, e o JSON estrito de volta ---------- */
function prompt(C, notas) {
  var ds = decksNasCores(C).map(function (p) {
    var dk = D.decks[p], X = dk.ctx, piso = notas ? ganho(C.nome, s3De(notas), dk, { cmc: C.cmc, land: C.terreno, mdfc: C.mdfc, ci: C.ci }) : null;
    return { pasta: p, painel: dk.painel, comandante: dk.cmd, desejo: !!dk.desejo, precon_intacto: !!dk.precon,
      sin1: { nome: dk.sn[0], regra: dk.regra.sin1, cartas_com_nota_2_ou_mais: X.ncrit[0], faixa: FAIXA[0], saturacao: X.mult[0] },
      sin2: { nome: dk.sn[1], regra: dk.regra.sin2, cartas_com_nota_2_ou_mais: X.ncrit[1], faixa: FAIXA[1], saturacao: X.mult[1] },
      comparaveis: comparaveis(dk, C).map(function (c) { return { carta: c[0], cmc: c[1], valor: c[3], tier: c[4] }; }),
      mais_fracas: maisFracas(dk).map(function (c) { return { carta: c[0], valor: c[3], tier: c[4] }; }),
      piso_do_ganho: piso ? piso.ganho : null };
  });
  var formato = {
    cadastro: notas ? '(não mande: a carta já tem cadastro)' : { n: { '<critério>': '1 a 3, só os critérios ' + KS.slice(2).join(', ') + ' (omita o que for 0)' }, por_que: 'frase curta, sem citar deck' },
    sinergias: { '<pasta>': { sin1: '0 a 3', sin2: '0 a 3', sin1_porque: 'frase, citando a régua, se sin1 > 0', sin2_porque: 'idem' } },
    leitura: 'o que a carta faz de verdade, e o que ela NÃO faz (2 a 4 frases)',
    forcas: ['3 a 5 frases, cada uma ancorada num trecho do texto entre aspas'], fraquezas: ['3 a 5 frases, idem'],
    vacuo_porque: 'por que ela é forte ou fraca sozinha (o grau sai da régua, na página)',
    armadilhas: { '<pasta>': 'o que parece sinergia neste deck e não é (só onde houver)' },
    vereditos: { '<pasta>': { veredito: 'entra | avaliar | fora', porque: 'frase', sai: 'para entra e avaliar: o nome exato de uma das comparaveis do deck' } },
    resumo: 'uma frase: a carta é forte, mediana ou fraca, e onde rende',
    compra: { acao: 'comprar | esperar | so-se-sobrar | nao', porque: 'frase, pelo ganho e pelo preço' }
  };
  return 'Você avalia uma carta de Magic: The Gathering (formato Commander) para a coleção de um jogador, em português do Brasil. ' +
    'Leia o texto oficial abaixo ao pé da letra; nunca use memória sobre a carta. Responda com APENAS um objeto JSON no formato pedido.\n\n' +
    'REGRAS: toda nota acima de 0 tem uma frase de porquê. Sinergia (sin1 e sin2, de 0 a 3) pela régua de cada deck, ao pé da letra; deck sem ligação leva 0 e 0. ' +
    'Os vereditos: um para CADA deck da lista com sinergia acima de 0 (os outros podem ficar de fora do objeto). Deck de Desejo ou precon intacto nunca recebe "entra". ' +
    'Você não calcula número nenhum: valor, ganho, faixa e grau são da página. A régua de compra: ganho a partir de ' + D.regua.deck + ' é Deck, a partir de ' + D.regua.guardar + ' é Guardar.\n\n' +
    'A RUBRICA (as notas das cartas):\n' + (D.rubrica || '') + '\n\n' +
    'O GRAU NO VÁCUO (calculado pela página): ' + JSON.stringify(D.regua.vacuo) + '\n\n' +
    'A CARTA:\n' + JSON.stringify({ nome: C.nome, custo: C.custo, tipo: C.tipo, texto: C.texto, faces: C.faces, identidade: C.ci, lancamento: C.lancamento, game_changer: C.gc, edhrec_rank: C.rank, preco_usd: C.usd }) + '\n' +
    (notas ? 'CADASTRO JÁ EXISTENTE (oito notas da carta): ' + JSON.stringify(notas) + '\n' : 'A carta não tem cadastro: dê as oito notas pela RUBRICA em "cadastro".\n') +
    '\nOS DECKS NAS CORES DELA:\n' + JSON.stringify(ds) + '\n\nO FORMATO DA RESPOSTA (só este JSON):\n' + JSON.stringify(formato);
}
/* confere a resposta como o motor/consulta.py confere: lista de erros (vazia = válida) */
function validar(j, C, temCadastro) {
  var E = [], ds = decksNasCores(C), fr = D.regua.frases;
  if (!j || typeof j !== 'object' || Array.isArray(j)) return ['a resposta não é um objeto JSON'];
  if (!temCadastro) {
    var cd = j.cadastro;
    if (!cd || typeof cd.n !== 'object') E.push('falta o cadastro (as oito notas da carta)');
    else {
      Object.keys(cd.n).forEach(function (k) { var v = cd.n[k]; if (KS.slice(2).indexOf(k) < 0) E.push('cadastro: "' + k + '" não é critério da carta'); else if (v !== 0 && !(v === 1 || v === 2 || v === 3)) E.push('cadastro: ' + k + '=' + JSON.stringify(v) + ', a nota vai de 1 a 3'); });
      if (!String(cd.por_que || '').trim()) E.push('cadastro: falta o por_que');
    }
  }
  var S = j.sinergias || {};
  ds.forEach(function (p) {
    var x = S[p]; if (!x) { E.push(p + ': faltam as sinergias'); return; }
    ['sin1', 'sin2'].forEach(function (k) { var v = x[k] == null ? 0 : x[k]; if (!(v === 0 || v === 1 || v === 2 || v === 3)) E.push(p + ': ' + k + '=' + JSON.stringify(v) + ', a nota vai de 0 a 3'); else if (v > 0 && !String(x[k + '_porque'] || '').trim()) E.push(p + ': ' + k + ' sem porquê'); });
  });
  Object.keys(S).forEach(function (p) { if (ds.indexOf(p) < 0) E.push(p + ': fora das cores da carta, ou não existe'); });
  if (!String(j.leitura || '').trim()) E.push('falta a leitura');
  [['forcas', 'fortalezas'], ['fraquezas', 'fraquezas']].forEach(function (a) { var L = j[a[0]]; if (!Array.isArray(L) || L.length < fr.min || L.length > fr.max || !L.every(function (x) { return String(x || '').trim(); })) E.push(a[1] + ': de ' + fr.min + ' a ' + fr.max + ' frases'); });
  if (!String(j.vacuo_porque || '').trim()) E.push('falta o porquê do grau no vácuo');
  var V = j.vereditos || {};
  Object.keys(V).forEach(function (p) {
    var x = V[p] || {};
    if (ds.indexOf(p) < 0) { E.push(p + ': veredito num deck fora das cores'); return; }
    if (D.regua.veredictos.indexOf(x.veredito) < 0) E.push(p + ': veredito "' + x.veredito + '" não é entra, avaliar ou fora');
    if (!String(x.porque || '').trim()) E.push(p + ': veredito sem porquê');
    if ((x.veredito === 'entra' || x.veredito === 'avaliar') && !x.sai) E.push(p + ': ' + x.veredito + ' pede quem sai');
    if (x.sai && D.decks[p].no_deck.indexOf(String(x.sai).split(' // ')[0]) < 0) E.push(p + ': "' + x.sai + '" não está no deck');
    if (x.veredito === 'entra' && (D.decks[p].desejo || D.decks[p].precon)) E.push(p + ': Desejo e precon intacto não recebem "entra"');
  });
  Object.keys(j.armadilhas || {}).forEach(function (p) { if (!D.decks[p]) E.push('armadilha num deck que não existe: ' + p); });
  if (!String(j.resumo || '').trim()) E.push('falta o resumo');
  var cp = j.compra || {}; if (D.regua.compra.indexOf(cp.acao) < 0 || !String(cp.porque || '').trim()) E.push('compra: "acao" é ' + D.regua.compra.join(', ') + ', com porquê');
  return E;
}
/* a conta, igual à do motor: valor, ganho, faixa, tier, posição na fila, grau; monta a entrada no formato do registro */
function calcularEntrada(C, j, notas, fonte) {
  var cad = { n: notas, por_que: fonte === 'cadastro' ? (D.cadpq && D.cadpq[C.nome]) || '' : String(j.cadastro.por_que).trim(), fonte: fonte };
  var vp = valor(s3De(notas)), med = D.cadastro.mediana, rank = C.lancamento && C.lancamento <= HOJE ? C.rank : null;
  var forca = { valor_proprio: vp, mediana: med, percentil: percentil(vp), rank: rank, gc: C.gc, grau: grauVacuo(vp, C.gc, rank) };
  var enc = decksNasCores(C).map(function (p) {
    var dk = D.decks[p], x = j.sinergias[p] || {}, sin = [x.sin1 || 0, x.sin2 || 0], s3 = s3De(notas, sin);
    var g = ganho(C.nome, s3, dk, { cmc: C.cmc, land: C.terreno, mdfc: C.mdfc, ci: C.ci }), v = valor(s3);
    var pq = {}; if (sin[0]) pq.sin1 = String(x.sin1_porque).trim(); if (sin[1]) pq.sin2 = String(x.sin2_porque).trim();
    var onde = dk.ja[C.nome] ? (dk.no_deck.indexOf(C.nome) >= 0 ? 'deck' : 'radar') : 'nova';
    return { pasta: p, sin: sin, sin_por_que: pq, valor: v, valor_com_saturacao: g.valor, ganho: g.ganho, sai: g.sai, valor_sai: g.valor_sai,
      faixa: g.ganho >= D.regua.deck ? 'deck' : g.ganho >= D.regua.guardar ? 'guardar' : 'abaixo', tier_estimado: tierEstimado(v, dk.med), situacao: { onde: onde },
      cobre: g.cobre, d_cmc: g.d_cmc, d_acel: g.d_acel, acima_de: dk.cartas.filter(function (c) { return c[3] < v; }).length, magicas: dk.cartas.length };
  }).sort(function (a, b) { return b.ganho - a.ganho || (a.pasta < b.pasta ? -1 : 1); });
  var dec = {}; Object.keys(j.vereditos || {}).forEach(function (p) { var x = j.vereditos[p]; dec[p] = { veredito: x.veredito, porque: String(x.porque).trim() }; if (x.sai) dec[p].sai = x.sai; });
  var arm = {}; Object.keys(j.armadilhas || {}).forEach(function (p) { if (String(j.armadilhas[p] || '').trim()) arm[p] = String(j.armadilhas[p]).trim(); });
  return { data: HOJE, usd: C.usd, usd_foil: C.usd_foil, rank: C.rank, avisos: avisosDa(C), cadastro: cad, forca: forca, encaixe: enc, modo: 'ao-vivo',
    vereditos: { resumo: String(j.resumo).trim(), compra: { acao: j.compra.acao, porque: String(j.compra.porque).trim() }, decks: dec },
    estudo: { leitura: String(j.leitura).trim(), forcas: j.forcas.map(function (x) { return String(x).trim(); }), fraquezas: j.fraquezas.map(function (x) { return String(x).trim(); }),
      vacuo: { grau: forca.grau, porque: String(j.vacuo_porque).trim() }, armadilhas: arm } };
}
function comoRegistro(C, e) { return Object.assign({ carta: C, datas: [e.data] }, e); }

var ctl = null;
function pedirEstudo() {
  var V = ui.vivo, C = V.carta; if (!C || !LIVE.sample || V.estado === 'pensando') return;
  var notas = notasDoCadastro(C.nome), tem = !!notas, base = prompt(C, notas);
  ctl = new AbortController(); V.estado = 'pensando'; V.erro = null; render();
  function tentar(entrada, ultima) {
    return LIVE.sample.json(entrada, { modelTier: 'complex', signal: ctl.signal }).then(function (j) {
      var E = validar(j, C, tem);
      if (!E.length) return j;
      if (ultima) { var er = new Error('a resposta do Claude veio fora da régua duas vezes: ' + E.slice(0, 4).join('; ')); er.code = 'invalida'; throw er; }
      return tentar(base + '\n\nA RESPOSTA ANTERIOR FOI RECUSADA. Corrija exatamente isto e mande o JSON inteiro de novo:\n- ' + E.join('\n- '), true);
    });
  }
  tentar(base, false).then(function (j) {
    var n = tem ? notas : Object.keys(j.cadastro.n).reduce(function (o, k) { if (j.cadastro.n[k]) o[k] = j.cadastro.n[k]; return o; }, {});
    var e = calcularEntrada(C, j, n, tem ? 'cadastro' : 'ao-vivo');
    V.estado = 'pronto'; ui.R = comoRegistro(C, e); ui.vivo = null;
    guardar(C, e); render();
  }, function (er) {
    V.estado = 'carta';
    V.erro = er && er.code === 'cancelled' ? null : (er && er.code === 'not_granted' ? 'O Claude não foi liberado para esta página.' : er && er.code === 'rate_limited' ? 'Muitos pedidos agora: tente de novo mais tarde.' :
      er && er.code === 'invalida' ? er.message : 'O pedido não deu certo (' + esc((er && (er.code || er.message)) || 'erro') + '). Tente de novo, ou use o comando no Claude Code.');
    render();
  });
}
function guardar(C, e) {
  if (!LIVE.db || !LIVE.dono) return;
  var doc = { nome: C.nome, link: C.link, data: e.data, modo: 'ao-vivo', carta: C, entrada: e, cadastro_auto: e.cadastro.fonte === 'ao-vivo' };
  try { LIVE.db.collection('consultas').doc(slug(C.nome)).set(JSON.parse(JSON.stringify(doc))).catch(function () { }); } catch (x) { }
}
function blocoVivo() {
  var V = ui.vivo, C = V.carta, h = '';
  if (V.estado === 'buscando') return '<div class="cx cs-nova"><h3>Buscando a carta no Scryfall…</h3></div>';
  if (!C) {
    var url = apiUrl(V.pedido);
    h += '<div class="cx cs-nova"><h3>' + esc(V.titulo || 'Esta carta ainda não foi consultada') + '</h3><p>' + esc(V.texto || '') + '</p>' +
      (url ? '<div class="cs-colar"><p>Para estudar aqui mesmo, abra <a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(url) + '</a>, selecione tudo, copie e cole abaixo: é o texto oficial da carta.</p>' +
        '<label class="sr" for="cs-txt">Texto da carta, do Scryfall</label><textarea id="cs-txt" rows="4" placeholder="Cole aqui o texto do Scryfall (começa com {)"></textarea>' +
        '<button type="button" class="cs-ir" data-vivo="colar">Usar este texto</button>' + (V.erroColar ? '<p class="cs-erro">' + esc(V.erroColar) + '</p>' : '') + '</div>' : '') + '</div>';
    return h + blocoComando(V.link, 'Consultar no Claude Code', 'O estudo registrado sai do /consulta: ele lê o Scryfall, as réguas dos seus decks e escreve o porquê de cada nota. Cole este comando lá:');
  }
  var notas = notasDoCadastro(C.nome), ds = decksNasCores(C);
  var pisos = notas ? ds.map(function (p) { var g = ganho(C.nome, s3De(notas), D.decks[p], { cmc: C.cmc, land: C.terreno, mdfc: C.mdfc, ci: C.ci }); return { p: p, g: g }; }).sort(function (a, b) { return b.g.ganho - a.g.ganho; }) : [];
  var vp = notas ? valor(s3De(notas)) : null;
  h += '<section class="cs-carta cs-carta-v">' + (C.img ? '<figure class="cs-img"><img src="' + esc(C.img) + '" alt="' + esc(C.nome) + '" width="300" height="418"></figure>' : '') +
    '<div class="cs-ficha"><div class="cs-nome"><h2>' + esc(C.nome) + '</h2>' + custo(C.custo) + '</div><p class="cs-tipo">' + esc(C.tipo) + (C.pt ? ' <span class="cs-pt num">' + esc(C.pt) + '</span>' : '') + ' ' + cores(C.ci) + '</p>' +
    avisosDa(C).map(function (a) { return '<p class="cs-aviso">' + esc(a.charAt(0).toUpperCase() + a.slice(1)) + '</p>'; }).join('') +
    '<blockquote class="cs-oracle">' + textoMana(C.texto).replace(/\n/g, '<br>') + '</blockquote>' +
    '<p class="cs-meta">' + esc(String(C.set || '').toUpperCase()) + ' ' + esc(C.num) + (C.usd ? ' · US$ ' + num(Number(C.usd), 2) + ' no Scryfall hoje' : '') + ' · <a href="' + esc(C.link) + '" target="_blank" rel="noopener noreferrer">ver no Scryfall</a></p></div>' +
    '<aside class="cs-vacuo"><div class="cs-vh"><span class="cs-grau g-' + (vp != null ? grauVacuo(vp, C.gc, C.lancamento <= HOJE ? C.rank : null) : 'x') + '">' + (vp != null ? grauVacuo(vp, C.gc, C.lancamento <= HOJE ? C.rank : null) : '—') + '</span><div><b>No vácuo</b><span>' +
      (vp != null ? 'valor próprio ' + num(vp) + ', pelo cadastro' : 'sem cadastro: as notas saem do estudo') + '</span></div></div>' +
      (pisos.length ? '<p class="cs-pq">Piso do encaixe (sinergia ainda não avaliada): melhor em ' + esc(pisos[0].p.slice(4)) + ', ' + sinal(pisos[0].g.ganho) + '.</p>' : '<p class="cs-pq">' + ds.length + ' decks nas cores dela. Sem notas, a página não inventa número.</p>') + '</aside></section>';
  if (V.estado === 'pensando') h += '<div class="cx cs-nova cs-pensando"><h3>O Claude está estudando a carta…</h3><p>Lê a RUBRICA, a régua de sinergia de cada deck nas cores dela e escreve o porquê de cada nota. Leva de meio a dois minutos.</p><button type="button" class="cs-copiar" data-vivo="parar">Parar</button></div>';
  else if (LIVE.sample) h += '<div class="cx cs-nova"><h3>Estudar aqui, ao vivo</h3><p>O Claude dá as notas, as sinergias e os vereditos com o porquê; a página faz a conta. O resultado fica marcado "ao vivo, não registrado" ' + (LIVE.dono ? 'e vai para o banco desta página, para o /consulta importar no Claude Code.' : '(só o dono guarda no banco).') + ' Gasta do seu uso do Claude.</p>' +
    '<button type="button" class="cs-ir" data-vivo="estudar">Pedir o estudo ao Claude</button>' + (V.erro ? '<p class="cs-erro">' + esc(V.erro) + '</p>' : '') + '</div>';
  else h += '<div class="cx cs-nova"><h3>Sem o Claude nesta página</h3><p>No arquivo local, ou sem a permissão do Claude, a página mostra só a ficha e o piso. O estudo completo sai do comando abaixo.</p></div>';
  return h + blocoComando(C.link, 'Registrar no Claude Code', 'O registro oficial é o do Claude Code, com o projeto inteiro à vista. Cole este comando lá:');
}

/* ============ a página ============ */
function vazio() {
  return '<div class="cx cs-nova"><h3>Nenhuma consulta registrada ainda</h3><p>Cole acima o link de uma carta do Scryfall: a página busca a carta e monta o comando /consulta para o Claude Code.</p></div>';
}
function todasRegistradas() {
  var nomes = {}; D.registros.forEach(function (r) { nomes[r.carta.nome] = 1; });
  var vivos = LIVE.docs.filter(function (d) { return d && d.entrada && d.carta && !nomes[d.carta.nome]; }).map(function (d) { return comoRegistro(d.carta, d.entrada); });
  return D.registros.concat(vivos);
}
function render() {
  var R = ui.R;
  $('#cs-nreg').textContent = todasRegistradas().length;
  if (R) {
    var vivo = R.modo === 'ao-vivo';
    $('#cs-modo').innerHTML = vivo ? '<span class="cs-badge vivo">Ao vivo, não registrado</span> estudo de ' + data(R.data) + ', feito nesta página pelo Claude; o registro oficial sai do /consulta no Claude Code'
      : '<span class="cs-badge reg">Registrada</span> estudo de ' + data(R.data) + ', feito no Claude Code' + (R.datas.length > 1 ? ' · consultada antes em ' + R.datas.slice(0, -1).map(data).join(', ') : '');
    $('#cs-estudo').innerHTML = '<p class="cs-resumo">' + textoMana((R.vereditos || {}).resumo || '') + '</p>' + blocoCarta(R) + blocoEstudo(R) + blocoDecks(R) + blocoFim(R);
  } else if (ui.vivo) {
    $('#cs-modo').innerHTML = '<span class="cs-badge vivo">Sem estudo</span> ' + (ui.vivo.carta ? 'a carta veio do Scryfall; o estudo ainda não foi feito' : 'esta carta ainda não foi consultada');
    $('#cs-estudo').innerHTML = blocoVivo();
  } else {
    $('#cs-modo').innerHTML = '<span class="cs-badge vivo">Sem estudo</span> nenhuma carta aberta';
    $('#cs-estudo').innerHTML = vazio();
  }
  var T = todasRegistradas();
  $('#cs-registradas').innerHTML = T.length ? '<div class="cs-reg">' + T.map(function (r) {
    var C = COMPRA[((r.vereditos || {}).compra || {}).acao] || ['—', 'info'], best = (r.encaixe || []).slice().sort(function (a, b) { return b.ganho - a.ganho; })[0];
    return '<a class="cs-rc" href="#estudo=' + encodeURIComponent(r.carta.nome) + '">' + (r.carta.img ? '<img src="' + esc(r.carta.img) + '" alt="">' : '<span class="cs-semimg"></span>') +
      '<div><b>' + esc(r.carta.nome) + '</b><span>' + data(r.data) + (r.modo === 'ao-vivo' ? ' · <em class="cs-av">ao vivo</em>' : '') + '</span><span class="cs-grau g-' + esc((r.forca || {}).grau || 'x') + ' p" title="Grau no vácuo">' + esc((r.forca || {}).grau || '—') + '</span>' +
      (best ? '<span>melhor: ' + esc(best.pasta.slice(4)) + ' <b class="num">' + sinal(best.ganho) + '</b></span>' : '') + '<span class="pill ' + C[1] + '">' + C[0] + '</span></div></a>';
  }).join('') + '</div>' : '<p class="cs-vazio">Nenhuma consulta registrada ainda.</p>';
  $('#foot').innerHTML = '<p>Página montada em ' + data(D.gerado) + '. Texto e preço das cartas: Scryfall; notas: a régua da pontuação v3, pelo /consulta; encaixe: a mesma conta da Caixa e do Grimório. Nada aqui muda deck, radar ou cadastro.</p><p>Arte das cartas: © Wizards of the Coast.</p>';
}

/* ============ o pedido: link do Scryfall ou nome (o mesmo ler_pedido do motor/consulta.py) ============ */
function lerPedido(t) {
  t = String(t || '').trim(); if (!t) return null;
  var m = /^https?:\/\/(?:www\.)?scryfall\.com\/card\/([^\/]+)\/([^\/?#]+)/i.exec(t) || /^https?:\/\/api\.scryfall\.com\/cards\/([^\/]+)\/([^\/?#]+)/i.exec(t);
  if (m && m[1] !== 'named' && m[1] !== 'search') return { tipo: 'carta', set: m[1].toLowerCase(), num: decodeURIComponent(m[2]).toLowerCase() };
  if (/^https?:\/\//i.test(t)) return { tipo: /scryfall\.com/i.test(t) ? 'busca' : 'outro', t: t };
  return { tipo: 'nome', nome: t };
}
function acharEm(L, p) {
  for (var i = 0; i < L.length; i++) {
    var C = L[i].carta;
    if (p.tipo === 'carta' && String(C.set).toLowerCase() === p.set && String(C.num).toLowerCase() === p.num) return L[i];
    if (p.tipo === 'nome' && semAcento(C.nome) === semAcento(p.nome)) return L[i];
  }
  return null;
}
function consultar(t) {
  var p = lerPedido(t); if (!p) return;
  if (p.tipo === 'outro') { ui.R = null; ui.vivo = { pedido: null, titulo: 'Só links do Scryfall', texto: 'Para outro site, digite o nome da carta em inglês.', link: '<link do Scryfall>' }; render(); return; }
  var R = acharEm(todasRegistradas(), p);
  if (R) { location.hash = 'estudo=' + encodeURIComponent(R.carta.nome); return; }
  ui.R = null;
  ui.vivo = { pedido: p, link: t.trim(), estado: 'buscando', titulo: 'Esta carta ainda não foi consultada',
    texto: p.tipo === 'busca' ? 'Busca do Scryfall: cole o link de uma carta só, ou o nome.' : 'O estudo completo (o que ela faz, a força sozinha, a sinergia em cada deck e a compra) sai do texto oficial do Scryfall.' };
  if (location.hash !== '#estudo') history.replaceState(null, '', '#estudo');
  sub(); render();
  var V = ui.vivo;
  buscarCarta(p).then(function (C) { if (ui.vivo !== V) return; V.carta = C; V.estado = 'carta'; render(); },
    function (er) { if (ui.vivo !== V) return; V.estado = 'sem'; V.texto = (V.texto ? V.texto + ' ' : '') + (PUB ? 'A página publicada não alcança o Scryfall: use o campo abaixo.' : 'Não deu para buscar no Scryfall agora (' + ((er && er.message) || 'sem rede') + ').'); render(); });
}
function colar() {
  var V = ui.vivo, t = ($('#cs-txt') || {}).value || '';
  try { var i = t.indexOf('{'), j = t.lastIndexOf('}'); V.carta = normalizar(JSON.parse(t.slice(i, j + 1))); V.estado = 'carta'; V.erroColar = null; }
  catch (e) { V.erroColar = 'Não é o texto de uma carta do Scryfall: ' + (e.message || e) + '. Abra o endereço acima, selecione tudo e cole de novo.'; }
  render();
}

/* ============ endereço: #estudo, #estudo=<carta>, #registradas ============ */
function sub() {
  var h = location.hash || '', s = h === '#registradas' ? 'registradas' : 'estudo';
  var m = /^#estudo=(.+)$/.exec(h);
  if (m) { var n = decodeURIComponent(m[1]), T = todasRegistradas(); for (var i = 0; i < T.length; i++) if (T[i].carta.nome === n) { ui.R = T[i]; ui.vivo = null; } }
  $('#cs-estudo').hidden = s !== 'estudo'; $('#cs-registradas').hidden = s !== 'registradas';
  document.querySelectorAll('.cs-sub a').forEach(function (a) { if (a.dataset.sub === s) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (ui.R && !ui.vivo) $('#cs-q').value = ui.R.carta.link || ui.R.carta.nome;
}
document.addEventListener('click', function (ev) {
  var o = ev.target.closest('[data-ord]'); if (o) { ui.ord = o.dataset.ord; var y = window.scrollY; if (ui.R) $('#cs-decks').outerHTML = blocoDecks(ui.R); window.scrollTo(0, y); var b = document.querySelector('[data-ord="' + ui.ord + '"]'); if (b) b.focus(); return; }
  var v = ev.target.closest('[data-vivo]');
  if (v) { var a = v.dataset.vivo; if (a === 'estudar') pedirEstudo(); else if (a === 'parar' && ctl) ctl.abort(); else if (a === 'colar') colar(); return; }
  var c = ev.target.closest('[data-copiar]');
  if (c) { var t = $('#' + c.dataset.copiar).textContent; var ok = function () { c.textContent = 'Copiado'; setTimeout(function () { c.textContent = 'Copiar'; }, 1600); };
    try { navigator.clipboard.writeText(t).then(ok, function () { c.textContent = 'Selecione e copie'; }); } catch (e) { c.textContent = 'Selecione e copie'; } }
});
$('#cs-busca').addEventListener('submit', function (ev) { ev.preventDefault(); consultar($('#cs-q').value); });
window.addEventListener('hashchange', function () { var a = ui.R; sub(); if (ui.R !== a || !location.hash.indexOf('#estudo=')) render(); });

/* as capacidades do claude.ai, quando a página está publicada: sem elas, a página funciona inteira no modo registrada */
function ligar() {
  if (!window.claude || typeof window.claude.use !== 'function') return;
  var u = function (n) { try { return window.claude.use(n).catch(function () { return null; }); } catch (e) { return Promise.resolve(null); } };
  Promise.all([u('sample'), u('db'), u('user'), u('mcp')]).then(function (r) {
    LIVE.sample = r[0]; LIVE.db = r[1]; LIVE.user = r[2]; LIVE.mcp = r[3];
    var dono = LIVE.user && LIVE.user.isOwner ? LIVE.user.isOwner().catch(function () { return false; }) : Promise.resolve(false);
    dono.then(function (d) { LIVE.dono = !!d; LIVE.pronto = true; if (ui.vivo) render(); });
    if (LIVE.db) try {
      LIVE.db.collection('consultas').onSnapshot(function (s) { LIVE.docs = (s.docs || []).map(function (d) { var x = d.data() || {}; return Object.assign({ id: d.id }, x); }); render(); }, function () { });
    } catch (e) { }
    if (ui.vivo) render();
  });
}

barra();
ui.R = D.registros.length ? D.registros[0] : null;
sub(); render(); ligar();
// #consultar=<carta>: o botão Consultar dos Ciclos (e de qualquer outra página) chega aqui com a carta já no campo
(function () {
  var m = /^#consultar=(.+)$/.exec(location.hash || '');
  if (m) { try { var n = decodeURIComponent(m[1]); $('#cs-q').value = n; history.replaceState(null, '', '#estudo'); consultar(n); } catch (e) { } }
})();
window.CONSULTA = { D: D, ganho: ganho, valor: valor, tierEstimado: tierEstimado, grauVacuo: grauVacuo, lerPedido: lerPedido, consultar: consultar,
  validar: validar, normalizar: normalizar, calcularEntrada: calcularEntrada, prompt: prompt, LIVE: LIVE, ui: ui };   // para os testes
})();
