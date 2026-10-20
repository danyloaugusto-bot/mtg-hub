(function () {
'use strict';

var H = /*__DATA__*/null;
window.HUB = H;   /* para os testes; o hub não lê nada daqui */

function $(s, el) { return (el || document).querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
function pl(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
function semAcento(s) { return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
var MANA = { W: '#f3e7bf', U: '#a9cdf0', B: '#8a7a92', R: '#f0a28c', G: '#9fd0a6' };
var NOMEC = { W: 'Branco', U: 'Azul', B: 'Preto', R: 'Vermelho', G: 'Verde' };

function cores(s) {
  var c = String(s || '').toUpperCase();
  if (!c) return '';
  return '<span class="cores" aria-label="Cores: ' + esc(c) + '">' + 'WUBRG'.split('').filter(function (k) { return c.indexOf(k) >= 0; })
    .map(function (k) { return '<i class="ms ms-' + k + '">' + k + '</i>'; }).join('') + '</span>';
}

/* ============ decks ============ */
/* Três jeitos de ver a mesma carteira: a estante (as capas, por grupo do aplicativo), a lista (uma linha por deck, para
   comparar de olho) e por cor (os decks no álbum das combinações). Filtros de cor e de situação valem nos três.
   O estado da tela fica na memória e, quando o navegador deixa, no localStorage do próprio hub (só conveniência). */
var dk = { v: 'estante', ord: 'grupo', cores: {}, sit: '' }, dkAberto = false;
try { var dk0 = JSON.parse(localStorage.getItem('mtg-hub:decks:v1') || 'null'); if (dk0 && dk0.v) { dk.v = dk0.v; dk.ord = ['grupo', 'nome', 'alertas', 'data'].indexOf(dk0.ord) >= 0 ? dk0.ord : 'grupo'; } } catch (e) { /* sem localStorage: fica o padrão */ }
function dkGuardar() { try { localStorage.setItem('mtg-hub:decks:v1', JSON.stringify({ v: dk.v, ord: dk.ord })); } catch (e) { /* sem localStorage */ } }
function idxDK(d) { return DK.indexOf(d); }
function atualizado(d) { return d.a ? ((d.a.hist && d.a.hist.d) || d.a.feito || '') : ''; }
function dataNum(s) { var x = dataDe(s); return x ? +x : 0; }
function ativoDecks() { return Object.keys(dk.cores).some(function (k) { return dk.cores[k]; }) || dk.sit; }
function passaFiltro(d) {
  var c = d.a ? d.a.ident : (d.cores || '');
  if (Object.keys(dk.cores).some(function (k) { return dk.cores[k] && (k === 'C' ? c.length > 0 : c.indexOf(k) < 0); })) return false;
  if (dk.sit === 'painel' && !d.a) return false;
  if (dk.sit === 'obra' && d.a) return false;
  return true;
}
function ordDecks(ds) {
  var by = {
    grupo: function (a, b) { return H.decks.indexOf(a) - H.decks.indexOf(b); },
    nome: function (a, b) { return a.nome.localeCompare(b.nome); },
    alertas: function (a, b) { return (b.a ? nAlertas(b.a.le) : -1) - (a.a ? nAlertas(a.a.le) : -1) || a.nome.localeCompare(b.nome); },
    data: function (a, b) { return dataNum(atualizado(b)) - dataNum(atualizado(a)) || a.nome.localeCompare(b.nome); }
  };
  return ds.slice().sort(by[dk.ord] || by.grupo);
}
function buscaDe(d) { return esc(semAcento(d.nome + ' ' + (d.painel || '') + ' ' + d.cmd + ' ' + (d.a ? d.a.painel : ''))); }
function cartao(d) {
  var busca = buscaDe(d);
  if (d.painel && d.a) {
    var A = d.a, i = idxDK(d);
    return '<article class="deck" data-busca="' + busca + '">' +
      (d.capa ? '<img class="capa" src="' + d.capa + '" alt="" loading="lazy" style="object-position:' + esc(d.foco || '50% 30%') + '">' : '') +
      '<a class="ir" href="' + esc(d.href) + '" aria-label="Abrir o painel ' + esc(d.painel) + ', deck ' + esc(d.nome) + '"></a>' +
      '<div class="tampa"></div>' +
      '<div class="faixa"><div class="nome"><h3>' + esc(d.nome) + '</h3><p class="sub">' + esc(d.painel) + '</p></div>' +
      '<span class="pts num" title="' + ((d.a || {}).v3 ? 'Placar nos critérios: compara com os outros decks já migrados' : 'Placar do deck: compara o deck com ele mesmo') + '">' + numP(d.placar) + '<small>pts</small></span></div>' +
      '<div class="verso" aria-hidden="true"><dl>' +
        '<div><dt>CMC médio</dt><dd>' + num(A.st.avg, 2) + '</dd></div>' +
      '</dl></div>' +
      '<div class="base"><span class="b-st"></span>' +
        cores(d.cores) + '</div>' +
      '<span class="b-lk"><a href="#f-' + i + '" class="lk" title="Ficha no Dashboard">Ficha</a>' + (d.pub ? '<a href="' + esc(d.pub) + '" class="lk" target="_blank" rel="noopener noreferrer" title="Painel publicado">Online ↗</a>' : '') + '</span></article>';
  }
  var passos = [['capa', !!d.capa], ['lista', !!d.lista], ['referência', !!(d.ref && d.ref.length)]];
  return '<article class="deck vazio' + (d.capa ? ' com-capa' : '') + '" data-busca="' + busca + '">' +
    (d.capa ? '<img class="capa" src="' + d.capa + '" alt="" loading="lazy"><div class="tampa"></div>' : '<div class="meio"><b>Em construção</b></div>') +
    '<div class="faixa"><div class="nome"><h3>' + esc(d.nome) + '</h3>' + (d.cmd ? '<p class="sub">' + esc(d.cmd) + '</p>' : '') + '</div>' + (d.prio ? '<span class="prio" title="Prioridade no inventário">#' + d.prio + '</span>' : '') + '</div>' +
    '<div class="base"><span class="passos">' + passos.map(function (p) { return '<span class="' + (p[1] ? 'ok' : '') + '">' + (p[1] ? '✓ ' : '') + p[0] + '</span>'; }).join('') + '</span>' + cores(d.cores) + '</div></article>';
}
var VERP = { excelente: 'Excelente', satisfatorio: 'Satisfatório', insuficiente: 'Insuficiente' };
function pvB(A) { return A && A.pv ? '<span class="pv pv-' + A.pv + '" title="Plano do deck: habilitadoras, recompensas e multiplicadoras">' + VERP[A.pv] + '</span>' : ''; }
function linha(d) {
  var busca = buscaDe(d), A = d.a;
  var thumb = d.capa ? '<img src="' + d.capa + '" alt="" loading="lazy" style="object-position:' + esc(d.foco || '50% 30%') + '">' : '<span></span>';
  if (!A) return '<tr class="lrow vazio" data-busca="' + busca + '"><td class="th">' + thumb + '</td><td><b>' + esc(d.nome) + '</b><small>em construção' + (d.prio ? ', prioridade ' + d.prio : '') + '</small></td><td class="cm">' + esc(d.cmd) + '</td><td>' + cores(d.cores) + '</td>' +
    '<td class="n">—</td><td class="n">—</td><td class="n">—</td><td class="n">—</td><td class="n">—</td><td class="n">—</td><td></td></tr>';
  var al = nAlertas(A.le), dt = atualizado(d), dp = A.st2.total - A.st.total;
  return '<tr class="lrow" data-busca="' + busca + '"><td class="th"><a href="' + esc(d.href) + '" tabindex="-1" aria-hidden="true">' + thumb + '</a></td>' +
    '<td><a href="' + esc(d.href) + '"><b>' + esc(d.nome) + '</b></a> ' + pvB(A) + '<small>' + esc(d.painel) + '</small></td><td class="cm">' + esc(d.cmd) + '</td><td>' + cores(d.cores) + '</td>' +
    '<td class="n num">' + numP(d.placar) + (dp ? '<small class="' + (dp > 0 ? 'pos' : 'neg') + '">' + sinalP(dp) + '</small>' : '') + '</td><td class="n num">' + num(A.st.avg, 2) + '</td>' +
    '<td class="n num' + (A.res.frageis.length ? ' aviso' : '') + '">' + A.res.frageis.length + '</td><td class="n num' + (al ? ' aviso' : '') + '">' + al + '</td><td class="n num">' + A.tr.length + '</td>' +
    '<td class="n num">' + (dt ? brData(dt) : '—') + '</td><td class="lks"><a href="#f-' + idxDK(d) + '">Ficha</a>' + (d.pub ? ' <a href="' + esc(d.pub) + '" target="_blank" rel="noopener noreferrer">Online ↗</a>' : '') + '</td></tr>';
}
function resumoGrupo(ds) {
  var p = ds.filter(function (d) { return d.a; });
  return pl(ds.length, 'deck', 'decks') + (p.length < ds.length ? ', ' + (ds.length - p.length) + ' em construção' : '');
}
function barraDecks() {
  var seg = function (rot, act, ops, atual) {
    return '<div class="seg" role="group" aria-label="' + rot + '"><span class="seg-l">' + rot + '</span>' + ops.map(function (o) {
      return '<button data-dk="' + act + '" data-k="' + o[0] + '" aria-pressed="' + (String(atual) === String(o[0])) + '">' + o[1] + '</button>';
    }).join('') + '</div>';
  };
  var cor = '<div class="seg cores-f" role="group" aria-label="Cores"><span class="seg-l">Cores</span>' + 'WUBRG'.split('').map(function (k) {
      return '<button data-dk="cor" data-k="' + k + '" aria-pressed="' + !!dk.cores[k] + '" title="Decks com ' + NOMEC[k].toLowerCase() + '"><i class="ms ms-' + k + '">' + k + '</i></button>';
    }).join('') + '</div>';
  var nP = DK.length, nT = H.decks.length;
  /* no celular os filtros ficam recolhidos, para a estante aparecer logo */
  var nf = Object.keys(dk.cores).filter(function (k) { return dk.cores[k]; }).length + (dk.sit ? 1 : 0);
  var aberto = !(window.matchMedia && window.matchMedia('(max-width: 640px)').matches) || dkAberto;
  return '<div class="dk-bar">' + seg('Ver', 'v', [['estante', 'Estante'], ['lista', 'Lista'], ['cor', 'Por cor'], ['tema', 'Por tema']], dk.v) +
    seg('Ordem', 'ord', [['grupo', 'Grupo'], ['nome', 'Nome'], ['alertas', 'Alertas'], ['data', 'Atualizado']], dk.ord) +
    (dk.v === 'cor' || dk.v === 'tema' || dk.ord === 'grupo' ? '<span class="dk-ab"><button class="linkish" data-dk="abrir">Abrir todos</button><button class="linkish" data-dk="fechar">Fechar todos</button></span>' : '') +
    '<p class="dk-cont"><span id="dk-n">' + nT + '</span> de ' + nT + ' decks · ' + nP + ' com painel' + (ativoDecks() ? ' · <button class="linkish" data-dk="limpar">Limpar filtros</button>' : '') + '</p>' +
    '<details class="dk-f"' + (aberto ? ' open' : '') + '><summary>Filtros' + (nf ? ' (' + nf + ')' : '') + '</summary><div class="dk-fs">' +
    cor +
    seg('Situação', 'sit', [['', 'Todos'], ['painel', 'Com painel'], ['obra', 'Em construção']], dk.sit) + '</div></details></div>';
}
function vistaEstante(ds) {
  if (dk.ord !== 'grupo') return '<section class="grupo"><div class="grade">' + ds.map(cartao).join('') + '</div></section>';
  return H.grupos.map(function (g) {
    var gs = ds.filter(function (d) { return d.grupo === g.k; });
    return '<section class="grupo" data-grupo="' + g.k + '">' + sanfona('g-' + g.k, '<h2>' + esc(g.n) + '</h2><span class="g-r">' + resumoGrupo(gs) + '</span>', miniaturas(gs),
      gs.length ? '<div class="grade">' + gs.map(cartao).join('') + '</div>' : '<p class="vazio-g">Nenhum deck neste grupo ainda.</p>', 'g-sf') + '</section>';
  }).join('') + comprasEstante();
}
/* as capas pequenas no cabeçalho do grupo fechado: dá para reconhecer o grupo sem abrir */
function miniaturas(gs) {
  return '<span class="minis">' + gs.map(function (d) {
    return '<i class="' + (d.painel ? '' : 'obra') + '" title="' + esc(d.nome) + '">' + (d.capa ? '<img src="' + d.capa + '" alt="" loading="lazy" style="object-position:' + esc(d.foco || '50% 30%') + '">' : '') + '</i>';
  }).join('') + '</span>';
}
function tabelaLista(ds) {
  return '<div class="tw"><table class="tbl ldk"><colgroup><col class="c-th"><col class="c-dk"><col class="c-cm"><col class="c-co"><col class="c-n"><col class="c-n"><col class="c-n"><col class="c-n"><col class="c-n"><col class="c-n"><col class="c-lk"></colgroup>' +
    '<thead><tr><th></th><th scope="col">Deck</th><th scope="col" class="cm">Comandante</th><th scope="col">Cores</th>' +
    '<th scope="col" class="n">Placar</th><th scope="col" class="n">CMC</th><th scope="col" class="n" title="Funções que dependem de uma ou duas cartas">Sem reserva</th><th scope="col" class="n">Alertas</th><th scope="col" class="n">Trocas</th><th scope="col" class="n">Atualizado</th><th></th></tr></thead><tbody>' +
    ds.map(linha).join('') + '</tbody></table></div>';
}
function vistaLista(ds) {
  var n = nota('A coluna mostra quanto as trocas recomendadas mudam o placar. Nos decks já nos critérios, o placar também se compara entre eles (seção Placar); nos outros, compara o deck com ele mesmo. Use a Ordem para reorganizar.');
  if (dk.ord !== 'grupo') return '<div class="cx lista-dk">' + tabelaLista(ds) + n + '</div>';
  /* em ordem de grupo, cada grupo abre no clique, como na estante */
  return H.grupos.map(function (g) {
    var gs = ds.filter(function (d) { return d.grupo === g.k; }); if (!gs.length) return '';
    return '<section class="grupo" data-grupo="' + g.k + '">' + sanfona('l-' + g.k, '<h2>' + esc(g.n) + '</h2><span class="g-r">' + resumoGrupo(gs) + '</span>', miniaturas(gs), '<div class="cx lista-dk">' + tabelaLista(gs) + '</div>', 'g-sf') + '</section>';
  }).join('') + n;
}
function vistaPorCor(ds) {
  var ordem = []; ALBUM.forEach(function (g) { g.cs.forEach(function (c) { ordem.push({ k: c.k, n: c.n, g: g.g }); }); });
  var chaveCor = function (d) { var c = d.a ? d.a.ident : (d.cores || ''); return c || '-'; };
  var bloco = function (o) {
    var gs = ds.filter(function (d) { return chaveCor(d) === o.k; });
    if (!gs.length) return '';
    return '<section class="grupo cor-g" data-cor="' + esc(o.k) + '"><div class="g-h"><h2>' + esc(o.n) + '</h2>' + (o.k === '-' ? '' : cores(o.k)) + '<span class="g-r">' + resumoGrupo(gs) + '</span></div><div class="grade">' + gs.map(cartao).join('') + '</div></section>';
  };
  /* uma sanfona por número de cores */
  var blocos = ALBUM.map(function (g) {
    var gs = ds.filter(function (d) { return g.cs.some(function (c) { return c.k === chaveCor(d); }); });
    if (!gs.length) return '';
    var tem = g.cs.filter(function (c) { return gs.some(function (d) { return chaveCor(d) === c.k; }); });
    return '<section class="grupo fam">' + sanfona('fam-' + slug(g.g), '<h2>' + esc(g.g) + '</h2><span class="g-r">' + resumoGrupo(gs) + ' · ' + tem.length + ' de ' + pl(g.cs.length, 'combinação', 'combinações') + '</span>',
      '<span class="fam-r">' + g.cs.map(function (c) { var t = tem.indexOf(c) >= 0; return '<span class="' + (t ? 'tem' : '') + '">' + esc(c.n) + '</span>'; }).join('') + '</span>',
      '<div class="por-cor">' + g.cs.map(bloco).join('') + '</div>', 'g-sf') + '</section>';
  }).join('');
  var faltam = ordem.filter(function (o) { return !ds.some(function (d) { return chaveCor(d) === o.k; }); }).length;
  return blocos + nota((faltam ? faltam + ' das 32 combinações de cores não têm deck' + (ativoDecks() ? ' com estes filtros' : '') + '. ' : '') + 'O álbum completo, com o perfil de cada combinação, está no Dashboard, em ' + ir('carteira', 'Bastidores') + '.');
}
/* por tema: famílias de jogo (tema_jogo do tema.json de cada deck) e, dentro delas, o tema de cada deck */
var FAMILIAS = ['Tribais', 'Ataque e dano', 'Controle', 'Motores e combos', 'Caos e mesa'];
function vistaPorTema(ds) {
  var fams = FAMILIAS.slice();
  ds.forEach(function (d) { var f = d.tj && d.tj.familia; if (f && fams.indexOf(f) < 0) fams.push(f); });
  var blocos = fams.concat(['Sem tema ainda']).map(function (f) {
    var gs = ds.filter(function (d) { return f === 'Sem tema ainda' ? !(d.tj && d.tj.familia) : d.tj && d.tj.familia === f; });
    if (!gs.length) return '';
    var temas = []; gs.forEach(function (d) { var n = d.tj ? d.tj.nome : (d.painel ? 'sem tema' : 'em construção'); if (temas.indexOf(n) < 0) temas.push(n); });
    var corpo = '<div class="por-cor">' + temas.map(function (n) {
      var ts = gs.filter(function (d) { return (d.tj ? d.tj.nome : (d.painel ? 'sem tema' : 'em construção')) === n; });
      return '<section class="grupo cor-g"><div class="g-h"><h2>' + esc(n) + '</h2><span class="g-r">' + resumoGrupo(ts) + '</span></div><div class="grade">' + ts.map(cartao).join('') + '</div></section>';
    }).join('') + '</div>';
    return '<section class="grupo fam">' + sanfona('tema-' + slug(f), '<h2>' + esc(f) + '</h2><span class="g-r">' + resumoGrupo(gs) + '</span>',
      '<span class="fam-r">' + temas.map(function (n) { var k = gs.filter(function (d) { return (d.tj ? d.tj.nome : (d.painel ? 'sem tema' : 'em construção')) === n; }).length; return '<span class="tem">' + esc(n) + (k > 1 ? ' ×' + k : '') + '</span>'; }).join('') + '</span>',
      corpo, 'g-sf') + '</section>';
  }).join('');
  return blocos + nota('O tema de cada deck vem do campo <code>tema_jogo</code> do <code>tema.json</code> (nome e família). Deck em construção ganha tema quando vira painel.');
}
function vistaDecks() {
  var ds = ordDecks(H.decks.filter(passaFiltro));
  var corpo = !ds.length ? '<p class="vazio-g">Nenhum deck com esses filtros. <button class="linkish" data-dk="limpar">Limpar</button></p>'
    : dk.v === 'lista' ? vistaLista(ds) : dk.v === 'cor' ? vistaPorCor(ds) : dk.v === 'tema' ? vistaPorTema(ds) : vistaEstante(ds);
  return barraDecks() + '<div id="dk-corpo">' + corpo + '</div>';
}
function redesenharDecks(foco) {
  var v = $('#v-decks'); if (!v) return;
  v.innerHTML = vistaDecks(); filtrar(true);
  if (foco) { var el = v.querySelector(foco); if (el) el.focus(); }
}

/* ============ pastas ============ */
function caixaHref(lista) {
  var C = H.caixa; if (!C) return '';
  return ((location.protocol !== 'file:' && C.pub) ? C.pub : C.href) + (lista ? '#lista=' + encodeURIComponent(lista) : '');
}
/* a gema de ônix das pastas com ficha (Relicário de Ônix, na Preta P) */
function gema() {
  return '<svg class="gema" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="gm-o" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a5262"/><stop offset=".5" stop-color="#17141b"/><stop offset="1" stop-color="#040405"/></linearGradient></defs>' +
    '<path d="M20 6h24l14 16-26 36L6 22z" fill="url(#gm-o)" stroke="rgba(255,201,107,.6)" stroke-width="1.3"/>' +
    '<path d="M6 22h52M20 6l-4 16 16 36 16-36-4-16M16 22L32 6l16 16" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1"/></svg>';
}
function caixaPastas() {
  var C = H.caixa; if (!C) return '';
  var href = caixaHref();
  return '<article class="cx-res"><div><h3>Caixa</h3><p>' + pl(C.cartas, 'carta', 'cartas') + ', ' + pl(C.copias, 'cópia', 'cópias') + ' à espera de destino: ' +
    C.S + ' de prioridade S e ' + C.A + ' de prioridade A.</p></div><a class="bt-c" href="' + esc(href) + '">Abrir a Caixa</a></article>';
}
var ICP = ['◆', '♛', '➜'];   // os papéis da ficha: tesouros, comandantes de amanhã, a caminho de um deck
/* o saldo da pasta: só ao passar o mouse (a única exceção ao "sem preço" do hub, a pedido do dono, 18/10/2026) */
function saldoPasta(p) {
  var s = p.s; if (!s || s.valor == null) return '';
  var real = function (v) { return 'R$ ' + Number(v * H.cambio).toLocaleString('pt-BR', { maximumFractionDigits: 0 }); };
  var dol = function (v) { return 'US$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var d = Math.round((s.valor - s.ant) * 100) / 100, pc = s.ant ? d / s.ant * 100 : 0, sg = d > 0 ? '+' : d < 0 ? '−' : '';
  return '<div class="p-saldo" aria-label="Saldo da pasta"><b>' + (H.cambio ? real(s.valor) : dol(s.valor)) + '</b>' + (H.cambio ? '<small>' + dol(s.valor) + '</small>' : '') +
    '<span class="' + (d > 0 ? 'up' : d < 0 ? 'down' : 'z') + '">' + (d ? (d > 0 ? '▲ ' : '▼ ') + sg + dol(Math.abs(d)) + ' (' + sg + num(Math.abs(pc), Math.abs(pc) < 1 ? 2 : 1) + '%)' : 'estável') + '</span>' +
    '<small>' + (s.desde ? 'desde ' + s.desde.slice(8, 10) + '/' + s.desde.slice(5, 7) : '') + (s.precos_de ? ' · preços de ' + s.precos_de.slice(8, 10) + '/' + s.precos_de.slice(5, 7) : '') + '</small></div>';
}
function vistaPastas() {
  return caixaPastas() + '<p class="intro">As suas pastas físicas. A que já tem lista (o export do ManaBox numa subpasta de <code>dados/pastas/</code>) tem página própria, ' +
    'com as mesmas contas da Caixa: onde cada carta já está, em qual deck rende mais e o que fazer com ela. Passe o mouse na pasta para ver quanto ela vale hoje.</p>' +
    '<div class="pastas">' + H.pastas.map(function (p) {
      var f = p.f, tem = p.q > 0;
      var cont = tem ? pl(p.q, 'carta', 'cartas') + (p.cp !== p.q ? ', ' + pl(p.cp, 'cópia', 'cópias') : '') : 'Sem lista ainda.';
      return '<article class="pasta' + (f ? ' pasta-f' : '') + '" style="--pc:' + esc(p.c) + '"><div class="lomb">' + (f ? gema() : '') + '</div><div class="t">' +
        '<h3>' + esc(p.n) + '</h3>' + (f && f.subnome ? '<p class="p-sub">' + esc(f.subnome) + '</p>' : '') +
        '<p class="p-q">' + (f && f.formato ? '<span>' + esc(f.formato) + '</span> ' : '') + esc(cont) + '</p>' +
        (f && f.frase ? '<p class="p-fr">' + esc(f.frase) + '</p>' : '') +
        (f && f.papeis ? '<ul class="p-pa">' + f.papeis.map(function (x, i) { return '<li><i aria-hidden="true">' + (ICP[i] || '•') + '</i><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></li>'; }).join('') + '</ul>' : '') +
        (tem && p.href ? '<a class="bt-c" href="' + esc((location.protocol !== 'file:' && p.pub) ? p.pub : p.href) + '">Abrir a pasta</a>' : '') + saldoPasta(p) + '</div></article>';
    }).join('') + '</div>';
}

/* =====================================================================
   DASHBOARD
   Contas feitas aqui, com a mesma lógica do painel (motor/painel/app.js):
   placar, leituras, trocas do radar, base de mana e reserva. O build só
   empacota os dados de cada deck em d.a.
   ===================================================================== */
var WUBRG = ['W', 'U', 'B', 'R', 'G'];
var TIERS = ['S', 'A', 'B', 'C', 'D'], RELS = ['INS', 'ALT', 'MED', 'BAX'];
var RELN = { INS: 'Intocáveis', ALT: 'Alta sinergia', MED: 'Flex', BAX: 'Na berlinda' };
var RELL = { INS: 'INS', ALT: 'ALT', MED: 'MÉD', BAX: 'BAX' };
var TR = { S: 0, A: 1, B: 2, C: 3, D: 4 };
var TIPOS = { cri: 'Criaturas', art: 'Artefatos', enc: 'Encantamentos', ins: 'Instantâneas', fei: 'Feitiços', pw: 'Planeswalkers', bat: 'Batalhas', ter: 'Terrenos' };
var ODIO = { cri: 'remoção em massa de criaturas', art: 'destruição de artefatos', enc: 'destruição de encantamentos', ins: 'anulações e taxa', fei: 'anulações e taxa',
             pw: 'ataque direto aos planeswalkers', bat: 'remoção pontual', ter: 'destruição de terrenos' };
var ARQ = [{ k: 'aggro', n: 'Aggro' }, { k: 'voltron', n: 'Voltron' }, { k: 'combo', n: 'Combo' }, { k: 'controle', n: 'Controle' },
           { k: 'stax', n: 'Stax' }, { k: 'aristocratas', n: 'Aristocratas' }, { k: 'spellslinger', n: 'Spellslinger' }, { k: 'ramp', n: 'Ramp e big mana' }];
var RES = { forte: { n: 'Vai bem', c: 'bem', v: 1, ic: '▲' }, equilibrado: { n: 'Equilibrado', c: 'eq', v: 0, ic: '●' }, fraco: { n: 'Vai mal', c: 'mal', v: -1, ic: '▼' } };
var BAS = {}; (H.basicos || []).forEach(function (n) { BAS[n] = 1; });

/* ---------- formato ---------- */
function num(n, d) { d = d || 0; return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function pct(x, d) { return num(x * 100, d || 0) + '%'; }
function sinal(n, d) { return (n > 0 ? '+' : n < 0 ? '−' : '±') + num(Math.abs(n), d || 0); }
function lista(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1]; }
function soma(a, f) { var t = 0; a.forEach(function (x) { t += f ? f(x) : x; }); return t; }
/* régua da pontuação (motor/pontuacao.json). Deck v3: o placar vem dos dez critérios (vetor s3, na ordem da régua),
   peso × pontos da nota, e a aceleração pelas notas de Aceleradores; os agrupamentos (s) seguem como análise à parte.
   Deck antigo: soma das notas dos agrupamentos. A aceleração é a mesma conta nos dois. */
var RG = H.regua, NC = RG.criterios.length;
var ICA = Math.max(0, RG.criterios.map(function (c) { return c.k; }).indexOf('aceleradores'));
function ptsCrit(v, i) { return v > 0 ? RG.criterios[i].peso * RG.pontos_por_nota[Math.min(3, v)] : 0; }
function pontosAcel(y) { var a = RG.aceleracao; return y < 0 ? 0 : Math.min(a.teto, a.piso + a.pontos_por_passo * Math.floor(y / a.passo)); }
function pts(c) { var t = 0; (c.s || []).forEach(function (v) { t += v; }); return t; }
function pts3(c) { var t = 0; (c.s3 || []).forEach(function (v, i) { t += ptsCrit(v, i); }); return t; }
/* valor da carta no placar do deck: pontos dos critérios na v3, soma das notas no antigo */
function valor(c, A) { return A && A.v3 ? pts3(c) : pts(c); }
/* placar com vírgula: a v3 tem meio ponto (peso 2,5 e 1,5) */
function numP(n) { return num(n, n % 1 ? 1 : 0); }
function sinalP(n) { return sinal(n, n % 1 ? 1 : 0); }
function rampNome(A) { return A.v3 ? RG.criterios[ICA].nome : 'Ramp'; }
function chave(c) { return c.o || c.n; }
function dataDe(s) {
  var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s || '');
  if (m) return new Date(+m[3], +m[2] - 1, +m[1], 12);
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3], 12) : null;
}
function hoje() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12); }
function diasDesde(s) { var d = dataDe(s); return d ? Math.max(0, Math.round((hoje() - d) / 864e5)) : null; }
function idade(n) { return n == null ? '—' : n === 0 ? 'hoje' : n === 1 ? 'ontem' : 'há ' + n + ' dias'; }
function brData(s) { var d = dataDe(s); if (!d) return '—'; var p = function (n) { return (n < 10 ? '0' : '') + n; }; return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear(); }
function ico(sev) { return sev === 3 ? '!' : sev === 2 ? '!' : 'i'; }
function pill(cls, txt, ic) { return '<span class="pill ' + cls + '">' + (ic ? '<i aria-hidden="true">' + ic + '</i>' : '') + esc(txt) + '</span>'; }
function manaTxt(k) { return k ? k.split('').map(function (ch) { return '<i class="ms ms-' + ch + '" aria-hidden="true">' + ch + '</i>'; }).join('') : '<i class="ms ms-C" aria-hidden="true">◇</i>'; }
function ir(sec, txt) { return '<a class="ver" href="#d-' + sec + '">' + (txt || 'Ver') + '</a>'; }

/* ---------- contas do painel ---------- */
function gix(A, k) { for (var i = 0; i < A.grupos.length; i++) if (A.grupos[i].k === k) return i; return -1; }
function pipsDe(cost) {
  var n = { W: 0, U: 0, B: 0, R: 0, G: 0 };
  String(cost || '').replace(/\{([^}]+)\}/g, function (m, s) {
    var cs = s.split('/').filter(function (ch) { return n[ch] != null; });
    cs.forEach(function (ch) { n[ch] += 1 / cs.length; });
  });
  return n;
}
function contas(cs, A) {
  var NG = A.grupos.length, i;
  var st = { n: 0, nonland: 0, cmcSum: 0, lands: 0, mdfc: 0, tapped: 0, cri: 0, tribo: 0, wipes: 0, low: 0, top: 0, foils: 0,
             grp: [], mk: {}, pip: { W: 0, U: 0, B: 0, R: 0, G: 0 }, src: { W: 0, U: 0, B: 0, R: 0, G: 0 }, srcC: 0,
             usd: 0, usdN: 0, usdSem: 0, relUsd: {}, rel: {}, tier: {}, tipos: {}, tipoPts: {}, curva: [0, 0, 0, 0, 0, 0, 0, 0] };
  for (i = 0; i < NG; i++) st.grp.push({ hard: 0, soft: 0, pts: 0 });
  st.c3 = []; if (A.v3) for (i = 0; i < NC; i++) st.c3.push({ pts: 0, notas: 0, hard: 0, soft: 0 });
  Object.keys(A.marcadores || {}).forEach(function (k) { st.mk[k] = { n: 0, v: {}, nomes: [] }; });
  cs.forEach(function (c) {
    var q = c.q || 1, mk = c.mk || {}, j, v;
    st.n += q;
    st.tipos[c.t] = (st.tipos[c.t] || 0) + q;
    st.rel[c.r] = (st.rel[c.r] || 0) + q;
    st.tier[c.T] = (st.tier[c.T] || 0) + q;
    if (c.f) st.foils += q;
    if (c.u != null) { st.usd += c.u * q; st.usdN += q; st.relUsd[c.r] = (st.relUsd[c.r] || 0) + c.u * q; } else st.usdSem += q;
    for (j = 0; j < NG; j++) {
      v = c.s[j] || 0; st.grp[j].pts += v * q;
      if (v >= 2) st.grp[j].hard += q; else if (v === 1) st.grp[j].soft += q;
    }
    for (j = 0; j < st.c3.length; j++) {
      v = (c.s3 || [])[j] || 0; st.c3[j].pts += ptsCrit(v, j) * q; st.c3[j].notas += v * q;
      if (v >= 2) st.c3[j].hard += q; else if (v === 1) st.c3[j].soft += q;
    }
    st.tipoPts[c.t] = (st.tipoPts[c.t] || 0) + valor(c, A) * q;
    if (c.L) { st.lands += q; if (c.tp) st.tapped += q; }
    else {
      st.nonland += q; st.cmcSum += c.c * q; st.curva[Math.min(c.c, 7)] += q;
      if (c.c <= 2) st.low += q;
      if (c.c >= 5) st.top += q;
      if (c.md) st.mdfc += q;
      var pn = pipsDe(c.co);
      WUBRG.forEach(function (ch) { st.pip[ch] += pn[ch] * q; });
    }
    if (c.L || c.md) {
      var cor = false;
      WUBRG.forEach(function (ch) { if (c.pd && c.pd.indexOf(ch) >= 0) { st.src[ch] += q; cor = true; } });
      if (!cor && c.L) st.srcC += q;
    }
    if (c.t === 'cri') { st.cri += q; if (mk.tribo) st.tribo += q; }
    if (c.w) st.wipes += q;
    Object.keys(mk).forEach(function (k) {
      var x = st.mk[k], val = mk[k]; if (!x || !val) return;
      x.n += q; x.v[val] = (x.v[val] || 0) + q; x.nomes.push(c.n);
    });
  });
  var a = st.avg = st.nonland ? st.cmcSum / st.nonland : 0;
  st.cmcPts = (A.v3 && !RG.pontos_de_cmc_antigos) || a === 0 ? 0 : a < 2 ? 5 : a < 3 ? 4 : a < 4 ? 3 : a < 5 ? 2 : 1;
  st.ramp = A.v3 ? st.c3[ICA].notas : st.grp[Math.max(0, gix(A, 'ramp'))].pts;
  st.accX = a ? st.ramp / a : 0;
  st.accPts = pontosAcel(st.accX);
  st.crit = soma(A.v3 ? st.c3 : st.grp, function (g) { return g.pts; });
  st.total = st.cmcPts + st.accPts + st.crit;
  return st;
}
/* As leituras do painel, com os limiares que cada deck declarou. Devolve o estado de cada uma. */
function leituras(st, A) {
  var out = [];
  (A.leituras || []).forEach(function (l) {
    var i, w = false, t = '', n = 0, x;
    if (l.tipo === 'terrenos') {
      n = st.lands + st.mdfc; w = n < (l.min == null ? 35 : l.min);
      t = pl(n, 'fonte de terreno', 'fontes de terreno');
    } else if (l.tipo === 'agrupamento') {
      i = gix(A, l.g); if (i < 0) return; n = st.grp[i].hard;
      w = l.min != null && n < l.min;
      t = pl(n, l.rotulo[0], l.rotulo[1]);
    } else if (l.tipo === 'remocao') {
      i = gix(A, l.g); if (i < 0) return; n = st.grp[i].hard;
      w = st.wipes > (l.massa_max == null ? 5 : l.massa_max) || (l.min != null && n < l.min);
      t = pl(n, 'remoção', 'remoções') + ', ' + st.wipes + ' em massa';
    } else if (l.tipo === 'contagem') {
      x = st.mk[l.marcador]; if (!x) return; n = x.n;
      w = (l.min != null && n < l.min) || (l.max != null && n > l.max);
      t = pl(n, l.rotulo[0], l.rotulo[1]);
    } else if (l.tipo === 'tribo') {
      var tri = (A.marcadores || {}).tribo || {};
      n = st.cri ? st.tribo / st.cri * 100 : 0;
      w = !!st.cri && n < (l.min_pct == null ? 75 : l.min_pct);
      t = st.tribo + ' de ' + st.cri + ' criaturas são ' + (tri.plural || tri.nome || 'da tribo');
    } else if (l.tipo === 'proporcao') {
      var MK = A.marcadores || {}, a = (st.mk[l.a] || {}).n || 0, b = (st.mk[l.b] || {}).n || 0;
      var ra = l.rotulo || [(MK[l.a] || {}).nome, (MK[l.a] || {}).nome], rb = l.rotulo_b || [(MK[l.b] || {}).nome, (MK[l.b] || {}).nome];
      n = a; w = a < b * (l.fator || 1);
      t = pl(a, ra[0], ra[1]) + ' para ' + pl(b, rb[0], rb[1]);
    } else if (l.tipo === 'curva') {
      n = st.avg;
      w = (l.cmc_max != null && st.avg > l.cmc_max) || (l.topo_max != null && st.top > l.topo_max);
      t = 'CMC médio de ' + num(st.avg, 2) + (l.topo_max != null ? ', ' + pl(st.top, 'carta', 'cartas') + ' de custo 5 ou mais' : '');
    } else return;
    out.push({ k: l.tipo + (l.g ? ':' + l.g : l.marcador ? ':' + l.marcador : ''), tipo: l.tipo, g: l.g || l.marcador || '', w: !!w, t: t, al: l.alerta || '', n: n });
  });
  return out;
}
function nAlertas(le) { return le.filter(function (x) { return x.w; }).length; }
/* Coloca no deck as cartas do radar marcadas em sel e tira as que elas substituem, como o painel faz. */
function aplicar(A, sel) {
  var sai = {}, add = [];
  A.cands.forEach(function (c) { if (sel[c.i]) { add.push(c); if (c.sa) sai[c.sa] = 1; } });
  return A.cards.filter(function (c) { return !sai[c.i]; }).concat(add);
}
function combosEm(A, cs) {
  var tem = {}; cs.forEach(function (c) { tem[c.i] = 1; });
  return A.combos.map(function (k) { return { k: k, falta: k.p.filter(function (id) { return !tem[id]; }) }; });
}
function motivoTroca(A, c, out, st) {
  var ir = A.v3 ? ICA : gix(A, 'ramp'), vk = A.v3 ? 's3' : 's';
  var r1 = ir >= 0 ? ((c[vk] || [])[ir] || 0) : 0, r0 = out && ir >= 0 ? ((out[vk] || [])[ir] || 0) : 0;
  if (c.L && out && !out.L) return 'Terreno no lugar de mágica: o placar não mede base de mana.';
  if (c.L && out && out.L) return 'Terreno por terreno: o placar só enxerga o que entra virado.';
  if (r1 < r0) return 'Tira ' + pl(r0 - r1, 'ponto', 'pontos') + ' de ' + rampNome(A) + (st.accPts < A.st.accPts ? ' e derruba um degrau de aceleração.' : '.');
  if (out && valor(c, A) < valor(out, A)) return (A.v3 ? 'Vale menos pontos nos critérios' : 'Soma menos notas') + ' que a carta que sai (' + numP(valor(c, A)) + ' contra ' + numP(valor(out, A)) + '): é troca por qualidade, tier ' + c.T + ' no lugar de ' + out.T + '.';
  if (st.cmcPts < A.st.cmcPts || st.accPts < A.st.accPts) return 'Sobe o CMC médio, e o placar sente.';
  return 'O ganho está no tier (' + c.T + ' no lugar de ' + (out ? out.T : '—') + '), não nas notas.';
}
function troca(A, c) {
  var sel = {}; sel[c.i] = 1;
  var st = contas(aplicar(A, sel), A), out = c.sa ? A.idx[c.sa] : null, d = st.total - A.st.total;
  return { c: c, out: out, d: d, deck: A, porque: d <= 0 ? motivoTroca(A, c, out, st) : '' };
}
/* Fórmula de Karsten (2022) para 99 cartas: 31,42 + 3,13 × CMC médio das mágicas − 0,28 × compra e ramp de custo 2 ou menos. */
function karsten(A) {
  var ir = gix(A, 'ramp'), id = gix(A, 'draw'), q = 0, s = 0, baratas = 0;
  A.cards.forEach(function (c) {
    if (c.L || c.cm) return;
    var n = c.q || 1; q += n; s += c.c * n;
    if (c.c <= 2 && ((ir >= 0 && c.s[ir] >= 2) || (id >= 0 && c.s[id] >= 2))) baratas += n;
  });
  var avg = q ? s / q : 0;
  return { avg: avg, baratas: baratas, sug: 31.42 + 3.13 * avg - 0.28 * baratas };
}
/* Onde o placar muda de degrau: aceleração anda de 5 em 5; CMC médio, de 1 em 1. */
function degraus(st) {
  var a = st.avg, R = st.ramp, nl = st.nonland, S = st.cmcSum, r = { teto: st.accPts >= 90 };
  var piso = Math.floor(st.accX * 2) / 2;
  r.prox = piso + 0.5;
  r.sobe = Math.max(1, Math.ceil(r.prox * a - R - 1e-9));
  r.folga = Math.floor(R - piso * a + 1e-9);
  r.folgaCmc = piso > 0 ? Math.floor(R * nl / piso - S + 1e-9) : null;
  var lim = null; [5, 4, 3, 2].forEach(function (x) { if (lim == null && a >= x) lim = x; });
  r.lim = lim; r.corte = lim ? S - lim * nl + 1 : null;
  return r;
}
/* Probabilidade hipergeométrica de ver ao menos k sucessos em n cartas de N, com K sucessos no grimório. */
function comb(n, k) { if (k < 0 || k > n) return 0; k = Math.min(k, n - k); var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
function pGE(N, K, n, k) { if (k <= 0) return 1; var t = comb(N, n), p = 0; for (var x = k; x <= Math.min(K, n); x++) p += comb(K, x) * comb(N - K, n - x); return p / t; }
function baseMana(A) {
  var st = A.st, src = st.lands + st.mdfc, N = Math.max(1, st.n - 1), T = A.cmd ? Math.max(1, A.cmd.c) : 0, curva = [], k;
  var fim = Math.max(src + 4, Math.round(A.kar ? A.kar.sug : 0) + 1);
  for (k = src - 3; k <= fim; k++) curva.push({ k: k, p: pGE(N, k, 7 + T, T) });
  return { src: src, N: N, T: T, p3: pGE(N, src, 10, 3), p4: pGE(N, src, 11, 4), pc: pGE(N, src, 7 + T, T),
           mais1: pGE(N, src + 1, 7 + T, T) - pGE(N, src, 7 + T, T), curva: curva };
}

/* Calibração da régua: cartas que não são terreno básico, por faixa de relevância, e quantas têm a relevância igual ao tier. */
var FAIXA = { INS: [0.12, 0.28], ALT: [0.30, 0.50], MED: [0.20, 0.40], BAX: [0.06, 0.14] };
var PAR = { S: 'INS', A: 'ALT', B: 'MED', C: 'BAX', D: 'BAX' };
function calibra(A) {
  var r = { INS: 0, ALT: 0, MED: 0, BAX: 0 }, n = 0, diag = 0;
  A.cards.forEach(function (c) { if (BAS[chave(c)]) return; var q = c.q || 1; n += q; r[c.r] = (r[c.r] || 0) + q; if (PAR[c.T] === c.r) diag += q; });
  var fora = RELS.filter(function (k) { var x = r[k] / (n || 1); return x < FAIXA[k][0] || x > FAIXA[k][1]; });
  return { r: r, n: n, diag: n ? diag / n : 0, fora: fora };
}
function basicosRel() {
  var por = [], cont = {};
  DK.forEach(function (d) {
    var rs = {}; d.a.cards.forEach(function (c) { if (BAS[chave(c)]) rs[c.r] = (rs[c.r] || 0) + (c.q || 1); });
    var k = Object.keys(rs).sort(function (a, b) { return rs[b] - rs[a]; })[0];
    if (k) { por.push({ nome: d.nome, r: k, q: rs[k] }); cont[k] = (cont[k] || 0) + 1; }
  });
  var moda = Object.keys(cont).sort(function (a, b) { return cont[b] - cont[a]; })[0];
  return { moda: moda, fora: por.filter(function (x) { return x.r !== moda; }) };
}

/* ---------- custo de mana: a mesma conta da Visão geral de cada painel ---------- */
function custoX(c) { return /\{X\}/.test(c.co || ''); }
function pkDe(A, c) {
  if (c.L || c.md) return 'mana';
  if (c.pk && (c.pk === 'mana' || c.pk === 'sem' || gix(A, c.pk) >= 0)) return c.pk;
  var b = 0, bi = -1; (c.s || []).forEach(function (v, i) { if (v > b) { b = v; bi = i; } });
  return bi < 0 ? 'sem' : A.grupos[bi].k;
}
/* a troca baixa o custo sem perder o papel: mesmo pacote do 8×8, nota igual ou maior nele, tier igual ou melhor */
function baixaCusto(A, e, s) {
  if (!s || e.L || s.L || e.md || s.md || custoX(e) || custoX(s) || s.cp || s.c - e.c < 1) return false;
  var k = pkDe(A, s), i = gix(A, k);
  return i >= 0 && pkDe(A, e) === k && !!e.w === !!s.w && (e.s[i] || 0) >= (s.s[i] || 0) && TR[e.T] <= TR[s.T];
}
function pesada(c) { return !c.L && !c.md && !c.cm && !custoX(c) && !c.nc && !c.cp && c.T !== 'S' && c.r !== 'INS'; }
function custoDeck(A) {
  var out = A.cands.filter(function (c) { return c.v !== 'fora'; }), vistos = {}, sel = {};
  var boas = out.filter(function (c) { return baixaCusto(A, c, c.sa ? A.idx[c.sa] : null); })
    .sort(function (a, b) { return (A.idx[b.sa].c - b.c) - (A.idx[a.sa].c - a.c) || TR[a.T] - TR[b.T]; })
    .filter(function (c) { if (vistos[c.sa]) return false; vistos[c.sa] = 1; sel[c.i] = 1; return true; })
    .map(function (c) { return { c: c, s: A.idx[c.sa], d: A.idx[c.sa].c - c.c, deck: A }; });
  /* cada carta do radar é sugerida uma vez só, da mais cara do deck para a menos cara, como no painel */
  var usadas = {}, porSai = {}; boas.forEach(function (b) { usadas[b.c.i] = 1; porSai[b.s.i] = b.c; });
  var caras = A.cards.filter(function (c) { return pesada(c) && c.c >= 5; })
    .sort(function (a, b) { return b.c - a.c || TR[b.T] - TR[a.T] || a.n.localeCompare(b.n); }).map(function (c) {
      var k = pkDe(A, c);
      var alt = porSai[c.i] || out.filter(function (x) { return !usadas[x.i] && !x.L && !x.md && !custoX(x) && x.c <= c.c - 1 && pkDe(A, x) === k && !!x.w === !!c.w; })
        .sort(function (a, b) { return TR[a.T] - TR[b.T] || a.c - b.c || a.n.localeCompare(b.n); })[0];
      if (alt) usadas[alt.i] = 1;
      return { c: c, alt: alt || null, deck: A };
    });
  return { boas: boas, st: boas.length ? contas(aplicar(A, sel), A) : A.st, caras: caras };
}

/* ---------- reserva: a função que depende de uma ou duas cartas e o pacote com carta de sobra ----------
   O pilar da redundância (LigaMagic, "Os 5 pilares da otimização Budget no Commander"): um deck consistente tem mais de
   uma carta para cada função. Dedicada é nota 2 ou 3 no agrupamento, como nas leituras. O comandante está sempre à mão:
   se ele cumpre a função, ela tem reserva. Faixa só em ramp, compra e remoção (a referência do painel): nos temas, passar
   da faixa é o plano, e as faixas 8 a 8 do 8×8 são molde, não teto. Corte seguro: carta de tier C ou D, ou na berlinda,
   cujo pacote primário é o que sobra, fora de intocáveis e estimação, que não deixa outra função curta; a ordem é a da
   fila de corte do painel (relevância, prioridade, tier, notas). */
var RES_ROT = { fragil: 'sem reserva', cmd: 'o comandante cobre', baixo: 'abaixo da faixa', sobra: 'com sobra', ok: 'na faixa' };
var RR = { INS: 0, ALT: 1, MED: 2, BAX: 3 }, FAIXA_K = { ramp: 1, draw: 1, removal: 1 };
function corteCmp(a, b) { return (RR[b.r] - RR[a.r]) || ((a.pr || 99) - (b.pr || 99)) || (TR[b.T] - TR[a.T]) || (pts(a) - pts(b)) || a.n.localeCompare(b.n); }
/* As funções de um deck para a reserva: no deck v3, os dez critérios da régua (faixa só em aceleradores, draw e remoção, como
   no método antigo: nos temas, passar da faixa é o plano); no antigo, os agrupamentos do painel, com a faixa de ramp, compra e remoção. */
var FAIXA_V3 = { aceleradores: 1, draw: 1, remocao: 1 };
function funcoes(A) {
  if (A.v3) return RG.criterios.map(function (c, j) { return { k: c.k, n: c.nome, ab: c.curto, ref: FAIXA_V3[c.k] ? c.faixa : null, j: j }; });
  return A.grupos.map(function (g, j) { return { k: g.k, n: g.n, ab: g.ab, ref: FAIXA_K[g.k] ? g.ref : null, j: j }; });
}
function notaF(A, c, j) { return ((A.v3 ? c.s3 : c.s) || [])[j] || 0; }
/* pacote primário no deck v3: o critério da carta (não as sinergias) com a maior nota; empate, o primeiro da régua */
function pkV3(c) {
  if (c.L || c.md) return 'mana';
  var b = 0, bi = -1; (c.s3 || []).forEach(function (v, i) { if (i >= 2 && v > b) { b = v; bi = i; } });
  return bi < 0 ? 'sem' : RG.criterios[bi].k;
}
function reserva(A) {
  var N = Math.max(8, A.st.n - nCmd(A)), q = function (c) { return c.q || 1; };
  var saiNa = {}; A.tr.forEach(function (t) { if (t.out) saiNa[t.out.i] = t.c; });
  var gr = function (st, j) { return A.v3 ? st.c3[j] : st.grp[j]; };
  var fun = funcoes(A).map(function (g) {
    var j = g.j;
    var ded = A.cards.filter(function (c) { return !c.cm && notaF(A, c, j) >= 2; });
    var nb = soma(ded, q), n = gr(A.st, j).hard, cmd = A.cards.some(function (c) { return c.cm && notaF(A, c, j) >= 2; });
    var lo = g.ref ? g.ref[0] : null, hi = g.ref ? g.ref[1] : null;
    var est = nb <= 2 && !cmd ? 'fragil' : lo != null && n < lo ? 'baixo' : nb <= 2 ? 'cmd' : hi != null && n > hi ? 'sobra' : 'ok';
    return { g: g, j: j, n: n, nb: nb, ded: ded, cmd: cmd, lo: lo, hi: hi, est: est, p: pGE(N, nb, 10, 1), n2: gr(A.st2, j).hard, cortes: [], radar: [] };
  });
  var curta = function (o, c) { return notaF(A, c, o.j) >= 2 && (o.est === 'fragil' || o.est === 'baixo' || (o.lo != null && o.n - q(c) < o.lo)); };
  var usado = {};
  fun.forEach(function (f) {
    if (f.est !== 'sobra') return;
    f.cortes = f.ded.filter(function (c) {
      return (A.v3 ? pkV3(c) : pkDe(A, c)) === f.g.k && !c.nc && !c.L && !c.md && (TR[c.T] >= 3 || c.r === 'BAX') && c.r !== 'INS' && !usado[c.i] && !fun.some(function (o) { return o !== f && curta(o, c); });
    }).sort(corteCmp).slice(0, f.n - f.hi).map(function (c) { usado[c.i] = 1; return { c: c, troca: saiNa[c.i] || null }; });
  });
  var V = { entra: 0, avaliar: 1 };
  fun.forEach(function (f) {
    if (f.est !== 'fragil' && f.est !== 'baixo') return;
    f.radar = A.cands.filter(function (c) { return c.v !== 'fora' && notaF(A, c, f.j) >= 2; })
      .sort(function (a, b) { return V[a.v] - V[b.v] || TR[a.T] - TR[b.T] || notaF(A, b, f.j) - notaF(A, a, f.j) || a.n.localeCompare(b.n); });
  });
  var falta = fun.filter(function (f) { return f.est === 'fragil' || f.est === 'baixo'; });
  var sobra = fun.filter(function (f) { return f.cortes.length; });
  /* troca dentro do deck: um corte seguro que nenhuma troca do radar usa abre a vaga para uma função que continua curta
     mesmo com as trocas recomendadas; entra a melhor carta do radar que ainda não tem troca marcada */
  var par = null;
  var aindaCurta = function (f) { return f.lo != null ? f.n2 < f.lo : f.n2 - (f.n - f.nb) <= 2; };
  var fl = falta.filter(aindaCurta).sort(function (a, b) { return (a.est === 'fragil' ? 0 : 1) - (b.est === 'fragil' ? 0 : 1) || (a.lo != null ? a.n2 - a.lo : 0) - (b.lo != null ? b.n2 - b.lo : 0); })[0];
  var livres = []; sobra.slice().sort(function (a, b) { return (b.n - b.hi) - (a.n - a.hi); }).forEach(function (f) { f.cortes.forEach(function (x) { if (!x.troca) livres.push({ f: f, c: x.c }); }); });
  if (fl && livres.length) {
    var opc = fl.radar.filter(function (c) { return c.v !== 'entra'; });
    par = { falta: fl, sobra: livres[0].f, sai: livres[0].c, entra: opc[0] || null, jaEntram: fl.radar.length - opc.length };
  }
  return { fun: fun, frageis: fun.filter(function (f) { return f.est === 'fragil'; }), falta: falta, sobra: sobra, par: par,
           nCortes: soma(sobra, function (f) { return f.cortes.length; }) };
}
function faixaTxt(f) { return f.lo == null ? '' : f.lo === f.hi ? 'referência ' + f.lo : 'faixa de ' + f.lo + ' a ' + f.hi; }
function resChips(R) {
  return '<div class="rs">' + R.fun.map(function (f) {
    var tip = f.g.n + ': ' + pl(f.n, 'carta dedicada', 'cartas dedicadas') + (f.lo != null ? ' (' + faixaTxt(f) + ')' : '') + ', ' + RES_ROT[f.est] + '. ' +
      (f.cmd ? 'O comandante cumpre a função. ' : '') + 'Ver ao menos uma das ' + pl(f.nb, 'carta', 'cartas') + ' do grimório entre as 10 primeiras: ' + pct(f.p) + '.';
    return '<span class="rs-i rs-' + f.est + '" data-tip="' + esc(tip) + '">' + esc(f.g.ab) + ' <b class="num">' + f.n + '</b></span>';
  }).join('') + '</div>';
}
function nomesR(cs, n) { var a = cs.slice(0, n).map(function (c) { return esc(c.n) + ' ' + tierB(c.T); }); return a.join(', ') + (cs.length > n ? ' e mais ' + (cs.length - n) : ''); }
function resLinhas(R, A) {
  var L = [];
  R.frageis.forEach(function (f) {
    L.push('<li>' + pill('bad', 'sem reserva') + ' <b>' + esc(f.g.n) + '</b> depende de ' + (f.nb ? esc(lista(f.ded.map(function (c) { return c.n; }))) : 'nenhuma carta') + ': ' + pct(f.p) + ' de ver uma até o turno 4.' +
      (f.radar.length ? ' No radar: ' + nomesR(f.radar, 3) + '.' : ' Nada no radar para ela.') + '</li>');
  });
  R.falta.filter(function (f) { return f.est === 'baixo'; }).forEach(function (f) {
    L.push('<li>' + pill('warn', 'abaixo da faixa') + ' <b>' + esc(f.g.n) + '</b>: ' + f.n + ', ' + faixaTxt(f) + (f.n2 !== f.n ? ' (' + f.n2 + ' com as trocas)' : '') + '.' +
      (f.radar.length ? ' No radar: ' + nomesR(f.radar, 3) + '.' : ' Nada no radar para ela.') + '</li>');
  });
  R.sobra.forEach(function (f) {
    L.push('<li>' + pill('info', 'com sobra') + ' <b>' + esc(f.g.n) + '</b>: ' + f.n + ', ' + faixaTxt(f) + '. Cortes mais seguros: ' + f.cortes.map(function (x) {
      return esc(x.c.n) + ' ' + tierB(x.c.T) + (x.troca ? ' <span class="dim">(já sai pelo ' + esc(x.troca.n) + ')</span>' : '');
    }).join(', ') + '.</li>');
  });
  if (R.par) L.push('<li>' + pill('ok', 'troca dentro do deck', '↔') + ' Tire ' + esc(R.par.sai.n) + ' (' + esc(R.par.sobra.g.n) + ' com sobra)' +
    (R.par.entra ? ' e teste ' + esc(R.par.entra.n) + ' ' + tierB(R.par.entra.T) + ', em avaliação no radar, em ' + esc(R.par.falta.g.n) + '.' : ' e procure uma carta de ' + esc(R.par.falta.g.n) + (R.par.jaEntram ? ': as do radar já entram por outras trocas.' : ': o radar não tem.')) + '</li>');
  return L.length ? '<ul class="rs-l">' + L.join('') + '</ul>' : '<p class="hint">Toda função tem reserva, e nenhum pacote passa da faixa.</p>';
}

/* ---------- preparo de cada deck ---------- */
var DK = H.decks.filter(function (d) { return d.a; });
DK.forEach(function (d) {
  var A = d.a;
  A.nome = d.nome; A.pasta = d.pasta; A.href = d.href;
  A.idx = {}; A.cards.forEach(function (c) { A.idx[c.i] = c; }); A.cands.forEach(function (c) { A.idx[c.i] = c; });
  A.vs = {}; A.contra.forEach(function (c) { A.vs[c.k] = c; });
  A.rec = {}; A.cands.forEach(function (c) { if (c.v === 'entra') A.rec[c.i] = 1; });
  A.st = contas(A.cards, A); A.le = leituras(A.st, A);
  A.cs2 = aplicar(A, A.rec); A.st2 = contas(A.cs2, A); A.le2 = leituras(A.st2, A);
  A.tr = A.cands.filter(function (c) { return c.v === 'entra'; }).map(function (c) { return troca(A, c); });
  A.kar = karsten(A); A.deg = degraus(A.st); A.mana = baseMana(A);
  A.combos0 = combosEm(A, A.cards); A.combos2 = combosEm(A, A.cs2);
  A.cv = custoDeck(A);
  A.res = reserva(A);
});

/* ---------- o que pede atenção ---------- */
function atencao() {
  var L = [];
  function add(sev, sec, html) { L.push({ sev: sev, sec: sec, h: html }); }
  /* mesa */
  ARQ.forEach(function (a) {
    var n = 0, bem = 0, mal = 0;
    DK.forEach(function (d) { var c = d.a.vs[a.k]; if (!c) return; n++; if (c.r === 'forte') bem++; if (c.r === 'fraco') mal++; });
    if (n >= 2 && !bem && mal * 2 >= n) add(3, 'mesa', '<b>' + esc(a.n) + ' é o ponto cego da carteira.</b> Nenhum deck vai bem contra ele, e ' + mal + ' de ' + n + ' vão mal.');
  });
  /* fundamentos que o próprio painel acusa */
  var grupos = [['agrupamento:ramp', 'Ramp dedicado abaixo do mínimo'], ['agrupamento:draw', 'Compra dedicada abaixo do mínimo'], ['terrenos', 'Fontes de terreno abaixo do mínimo'], ['remocao', 'Remoção fora da faixa']];
  grupos.forEach(function (g) {
    var ds = DK.filter(function (d) { return d.a.le.some(function (x) { return x.k === g[0] && x.w; }); });
    if (!ds.length) return;
    add(2, 'fundamentos', '<b>' + g[1] + '</b> em ' + lista(ds.map(function (d) { var x = d.a.le.filter(function (y) { return y.k === g[0]; })[0]; return esc(d.nome) + ' (' + num(x.n) + ')'; })) + '.');
  });
  /* degraus no fio */
  DK.forEach(function (d) {
    var g = d.a.deg;
    if (!g.teto && g.folga === 0 && g.folgaCmc === 0) add(2, 'placar', '<b>' + esc(d.nome) + ' está no fio do degrau de aceleração.</b> Perder 1 ponto de Ramp, ou subir 1 de CMC somado, custa 5 pontos de placar.');
    else if (!g.teto && g.folga === 0) add(1, 'placar', '<b>' + esc(d.nome) + ':</b> perder 1 ponto de Ramp derruba um degrau de aceleração (−5).');
  });
  /* cor */
  DK.forEach(function (d) {
    var A = d.a, id = A.ident.split(''); if (id.length < 2) return;
    var pt = soma(id, function (ch) { return A.st.pip[ch]; }), ft = soma(id, function (ch) { return A.st.src[ch]; });
    id.forEach(function (ch) {
      var gap = A.st.pip[ch] / (pt || 1) - A.st.src[ch] / (ft || 1);
      if (gap >= 0.1) add(2, 'mana', '<b>' + esc(d.nome) + ': falta ' + NOMEC[ch].toLowerCase() + ' na base.</b> É ' + pct(A.st.pip[ch] / pt) + ' dos símbolos de mana e ' + pct(A.st.src[ch] / ft) + ' das fontes.');
    });
  });
  /* trocas */
  DK.forEach(function (d) {
    var A = d.a;
    A.tr.forEach(function (t) {
      var ir = gix(A, 'ramp'), rampAlerta = A.le2.some(function (x) { return x.k === 'agrupamento:ramp' && x.w; });
      if (ir >= 0 && t.out && (t.out.s[ir] || 0) > (t.c.s[ir] || 0) && rampAlerta)
        add(2, 'trocas', '<b>' + esc(d.nome) + ': a troca ' + esc(t.c.n) + ' no lugar de ' + esc(t.out.n) + ' tira Ramp de um deck que continua abaixo do mínimo mesmo com as trocas.</b> Sozinha, ela ' + (t.d < 0 ? 'baixa o placar em ' + num(-t.d) : 'não sobe o placar') + '.');
    });
    A.combos2.forEach(function (x, i) {
      var antes = A.combos0[i];
      if (!antes.falta.length && x.falta.length) {
        var nomes = x.falta.map(function (id) { return A.idx[id] ? A.idx[id].n : id; });
        if (/armadilha/i.test(x.k.k)) add(1, 'trocas', '<b>' + esc(d.nome) + ':</b> as trocas recomendadas desfazem a armadilha "' + esc(x.k.n) + '" (sai ' + esc(lista(nomes)) + '). Bom sinal.');
        else add(2, 'trocas', '<b>' + esc(d.nome) + ': as trocas recomendadas desmontam "' + esc(x.k.n) + '".</b> Sai ' + esc(lista(nomes)) + '. Confirme se a linha continua valendo.');
      }
      if (antes.falta.length && !x.falta.length) add(1, 'trocas', '<b>' + esc(d.nome) + ':</b> "' + esc(x.k.n) + '" só fecha com as trocas: falta ' + esc(lista(antes.falta.map(function (id) { return A.idx[id] ? A.idx[id].n : id; }))) + ', que está no radar.');
    });
  });
  DK.forEach(function (d) {
    var A = d.a, dp = A.st2.total - A.st.total, cura = nAlertas(A.le) - nAlertas(A.le2);
    if (cura >= 2 && Math.abs(dp) / (A.st.total || 1) < 0.03) add(1, 'trocas', '<b>' + esc(d.nome) + ': as trocas tiram ' + cura + ' alertas e mexem pouco no placar (' + sinalP(dp) + ').</b> O placar não mede tudo o que a troca conserta.');
    var cal = calibra(A);
    if (cal.diag >= 0.9) add(cal.diag > 0.995 ? 2 : 1, 'auditoria', '<b>' + esc(d.nome) + ': tier e relevância coincidem em ' + pct(cal.diag) + ' das cartas.</b> Os dois eixos deviam dizer coisas diferentes (força e permanência); aqui a relevância ' + (cal.diag > 0.995 ? 'só repete' : 'quase só repete') + ' o tier. Vale um /auditar só dela.');
  });
  var bas = basicosRel();
  if (bas.fora.length) add(1, 'auditoria', '<b>Terrenos básicos com relevância diferente entre os decks.</b> ' + esc(lista(bas.fora.map(function (x) { return x.nome + ' marca ' + RELL[x.r]; }))) + '; nos demais, básico é ' + RELL[bas.moda] + '.');
  /* reserva */
  DK.forEach(function (d) {
    d.a.res.frageis.forEach(function (f) {
      add(2, 'reserva', '<b>' + esc(d.nome) + ': ' + esc(f.g.n) + ' não tem reserva.</b> Depende de ' + (f.nb ? esc(lista(f.ded.map(function (c) { return c.n; }))) : 'nenhuma carta') + ': ' + pct(f.p) + ' de ver uma até o turno 4.' + (f.radar.length ? ' No radar: ' + esc(lista(f.radar.slice(0, 2).map(function (c) { return c.n; }))) + '.' : ''));
    });
  });
  var com = DK.filter(function (d) { var n = d.a.edh ? diasDesde(d.a.edh.l) : null; return n != null && n > 30; });
  if (com.length) add(1, 'auditoria', '<b>Leitura da comunidade com mais de 30 dias</b> em ' + lista(com.map(function (d) { return esc(d.nome); })) + '. Rode o /potenciais.');
  return L.sort(function (a, b) { return b.sev - a.sev; });
}

/* ---------- estado da tela ---------- */
var mesa = {};
var sim = { p: DK.length ? DK[0].pasta : '', sel: {} };
function simDeck() { for (var i = 0; i < DK.length; i++) if (DK[i].pasta === sim.p) return DK[i]; return DK[0]; }
function simCenario(A, k) {
  var s = {};
  A.cands.forEach(function (c) { if (c.v === 'entra' || (k === 'tudo' && c.v === 'avaliar')) s[c.i] = 1; });
  return k === 'hoje' ? {} : s;
}
if (DK.length) sim.sel = simCenario(DK[0].a, 'rec');
var abertos = {};

/* ---------- peças de desenho ---------- */
function secao(id, titulo, lede, corpo) {
  return '<section class="dsec" id="d-' + id + '" aria-labelledby="h-' + id + '"><header class="dsec-h"><h2 id="h-' + id + '">' + titulo + '</h2>' +
    (lede ? '<p>' + lede + '</p>' : '') + '</header>' + corpo + '</section>';
}
function caixa(titulo, corpo, cls, resumo) {
  if (resumo != null && titulo) return sanfona(slug(titulo), '<h3>' + titulo + '</h3>', resumo, corpo, 'cx' + (cls ? ' ' + cls : ''));
  return '<div class="cx' + (cls ? ' ' + cls : '') + '">' + (titulo ? '<h3>' + titulo + '</h3>' : '') + corpo + '</div>';
}
/* Listas que abrem no clique. Fechadas por padrão; o que você abre fica lembrado neste navegador (só conveniência). */
var SF = {};
try { SF = JSON.parse(localStorage.getItem('mtg-hub:abertos:v1') || '{}') || {}; } catch (e) { SF = {}; }
function slug(t) { return semAcento(String(t).replace(/<[^>]+>/g, '').replace(/\(.*?\)|[:\d.,$]+/g, ' ')).trim().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''); }
function sanfona(id, cab, resumo, corpo, cls) {
  return '<details class="sf' + (cls ? ' ' + cls : '') + '" data-sf="' + esc(id) + '"' + (SF[id] ? ' open' : '') + '><summary><span class="sf-t">' + cab + '</span>' +
    (resumo ? '<span class="sf-r">' + resumo + '</span>' : '') + '<i class="sf-i" aria-hidden="true"></i></summary><div class="sf-c">' + corpo + '</div></details>';
}
document.addEventListener('toggle', function (ev) {
  var d = ev.target; if (!d.dataset || !d.dataset.sf) return;
  if (d.dataset.auto) { delete d.dataset.auto; return; }   /* aberta pela busca ou por um filtro: não vira lembrança */
  if (d.open) SF[d.dataset.sf] = 1; else delete SF[d.dataset.sf];
  try { localStorage.setItem('mtg-hub:abertos:v1', JSON.stringify(SF)); } catch (e) { /* sem localStorage */ }
}, true);
function nota(t) { return '<p class="nota">' + t + '</p>'; }
function barras(itens, max) {
  max = Math.max(1, max);
  return '<div class="barras">' + itens.map(function (it) {
    return '<div class="barra"><span>' + it.r + '</span><span class="t"><i style="width:' + (it.v / max * 100).toFixed(1) + '%;' + (it.c ? '--c:' + it.c : '') + '"></i></span><b class="num">' + (it.l != null ? it.l : it.v) + '</b></div>';
  }).join('') + '</div>';
}
function tierB(t) { return '<span class="tb t' + esc(t) + '">' + esc(t) + '</span>'; }
function relB(r) { return '<span class="rb rb-' + esc(r) + '">' + esc(RELL[r] || r) + '</span>'; }
function deckLink(A) { return A.href ? '<a href="' + esc(A.href) + '">' + esc(A.nome) + '</a>' : esc(A.nome); }
function mais(id, itens, n, render, linha) {
  var todos = abertos[id], vis = todos ? itens : itens.slice(0, n);
  var bt = '<button class="linkish" data-act="mais" data-k="' + id + '">' + (todos ? 'Mostrar menos' : 'Ver todas as ' + itens.length) + '</button>';
  return vis.map(render).join('') + (itens.length > n ? (linha ? '<tr class="mais"><td colspan="' + linha + '">' + bt + '</td></tr>' : '<li class="mais">' + bt + '</li>') : '');
}

/* ============ 2. mesa ============ */
function rankMesa() {
  return DK.map(function (d) {
    var A = d.a, sc = 0, bem = [], mal = [], sem = [];
    ARQ.forEach(function (a) {
      var n = mesa[a.k] || 0; if (!n) return;
      var c = A.vs[a.k]; if (!c) { sem.push(a.n); return; }
      sc += RES[c.r].v * n;
      if (c.r === 'forte') bem.push(a.n + (n > 1 ? ' (×' + n + ')' : ''));
      if (c.r === 'fraco') mal.push(a.n + (n > 1 ? ' (×' + n + ')' : ''));
    });
    return { d: d, sc: sc, bem: bem, mal: mal, sem: sem };
  }).sort(function (x, y) { return y.sc - x.sc || x.mal.length - y.mal.length || x.d.nome.localeCompare(y.d.nome); });
}
function boxMesa() {
  var n = soma(ARQ, function (a) { return mesa[a.k] || 0; });
  var h = '<div class="steps" role="group" aria-label="Arquétipos na mesa">' + ARQ.map(function (a) {
    var v = mesa[a.k] || 0;
    return '<div class="step' + (v ? ' on' : '') + '"><button class="st-m" data-act="mesa" data-k="' + a.k + '" data-v="-1" aria-label="Tirar um ' + esc(a.n) + '"' + (v ? '' : ' disabled') + '>−</button>' +
      '<span>' + esc(a.n) + ' <b class="num">' + v + '</b></span><button class="st-p" data-act="mesa" data-k="' + a.k + '" data-v="1" aria-label="Pôr um ' + esc(a.n) + '"' + (n >= 5 ? ' disabled' : '') + '>+</button></div>';
  }).join('') + (n ? '<button class="linkish" data-act="mesa-limpar">Limpar a mesa</button>' : '') + '</div>';
  if (!n) {
    h += '<p class="vazio-m">Ponha na mesa os arquétipos dos oponentes, um por jogador. O ranking sai das seções "Contra quem" de cada painel.</p>';
  } else {
    var r = rankMesa(), top = r[0].sc;
    h += '<ol class="rank">' + r.map(function (x, i) {
      return '<li class="' + (x.sc === top ? 'lider' : '') + '"><span class="ord num">' + (i + 1) + '</span><div><b>' + deckLink(x.d.a) + '</b> <span class="sc num">' + sinal(x.sc) + '</span>' +
        '<p>' + (x.bem.length ? 'vai bem contra ' + esc(lista(x.bem)) : '') + (x.bem.length && x.mal.length ? '; ' : '') + (x.mal.length ? 'vai mal contra ' + esc(lista(x.mal)) : '') +
        (!x.bem.length && !x.mal.length ? 'equilibrado contra tudo o que está na mesa' : '') + (x.sem.length ? '. Sem leitura contra ' + esc(lista(x.sem)) : '') + '.</p></div></li>';
    }).join('') + '</ol>' + nota('Vai bem soma 1, equilibrado 0, vai mal tira 1, por oponente. Empate: ganha quem tem menos "vai mal".');
  }
  return h;
}
function secMesa() {
  var head = '<tr><th scope="col">Deck</th>' + ARQ.map(function (a) { return '<th scope="col" class="c">' + esc(a.n) + '</th>'; }).join('') + '<th scope="col" class="c">Saldo</th></tr>';
  var rows = DK.map(function (d) {
    var A = d.a, b = 0, m = 0;
    return '<tr><th scope="row">' + deckLink(A) + '</th>' + ARQ.map(function (a) {
      var c = A.vs[a.k]; if (!c) return '<td class="c vz">—</td>';
      var R = RES[c.r]; if (c.r === 'forte') b++; if (c.r === 'fraco') m++;
      return '<td class="c r-' + R.c + '" data-tip="' + esc(A.nome + ' contra ' + a.n + ': ' + R.n.toLowerCase() + '. ' + c.p) + '"><i aria-hidden="true">' + R.ic + '</i><span class="sr">' + R.n + '. ' + esc(c.p) + '</span></td>';
    }).join('') + '<td class="c num saldo">' + sinal(b - m) + '</td></tr>';
  }).join('');
  var foot = '<tr class="cob"><th scope="row">Quem vai bem</th>' + ARQ.map(function (a) {
    var bem = DK.filter(function (d) { var c = d.a.vs[a.k]; return c && c.r === 'forte'; }).length, mal = DK.filter(function (d) { var c = d.a.vs[a.k]; return c && c.r === 'fraco'; }).length;
    return '<td class="c num' + (!bem ? ' zero' : '') + '" data-tip="' + esc(a.n + ': ' + bem + ' vão bem, ' + mal + ' vão mal') + '">' + bem + '</td>';
  }).join('') + '<td></td></tr>';
  var vers = DK.map(function (d) {
    var b = 0, m = 0; d.a.contra.forEach(function (c) { if (c.r === 'forte') b++; if (c.r === 'fraco') m++; });
    return { d: d, s: b - m, b: b, m: m };
  }).sort(function (x, y) { return y.s - x.s; });
  var cegos = ARQ.filter(function (a) { return !DK.some(function (d) { var c = d.a.vs[a.k]; return c && c.r === 'forte'; }); }).map(function (a) { return a.n; });
  var h = '<div class="g2 g-mesa">' + caixa('Monte a mesa', '<div id="mesa">' + boxMesa() + '</div>', 'mesa-box') +
    caixa('Contra quem cada deck vai bem', '<div class="tw"><table class="mx"><thead>' + head + '</thead><tbody>' + rows + '</tbody><tfoot>' + foot + '</tfoot></table></div>' +
      '<p class="legenda"><span class="r-bem"><i>▲</i> vai bem</span><span class="r-eq"><i>●</i> equilibrado</span><span class="r-mal"><i>▼</i> vai mal</span></p>' +
      nota((cegos.length ? 'Nenhum deck vai bem contra ' + esc(lista(cegos)) + '. ' : '') + 'Mais versátil: ' + esc(vers[0].d.nome) + ' (' + vers[0].b + ' bem, ' + vers[0].m + ' mal). Mais situacional: ' +
        esc(vers[vers.length - 1].d.nome) + ' (' + vers[vers.length - 1].b + ' bem, ' + vers[vers.length - 1].m + ' mal). Passe o mouse numa célula para ler o porquê.')) + '</div>';
  return secao('mesa', 'Qual deck levar', 'É a opinião da avaliação de cada deck, não o resultado de partidas. Use para escolher; anote o que acontecer na mesa para corrigir.', h);
}

/* ============ 3. fundamentos ============ */
/* cartas dedicadas (nota 2 ou 3) numa função: no deck v3, pelo critério da régua; no antigo, pelo agrupamento */
function iCrit(k) { for (var i = 0; i < NC; i++) if (RG.criterios[i].k === k) return i; return -1; }
function dedicadas(A, g, c3) { if (A.v3) { var j = iCrit(c3); return j < 0 ? null : A.st.c3[j].hard; } var i = gix(A, g); return i < 0 ? null : A.st.grp[i].hard; }
var FUND = [
  { k: 'fontes', n: 'Fontes de terreno', ref: [35, 37], max: 40, min0: 28, v: function (A) { return A.st.lands + A.st.mdfc; }, le: 'terrenos' },
  { k: 'ramp', n: 'Ramp dedicado', ref: [10, 12], max: 16, v: function (A) { return dedicadas(A, 'ramp', 'aceleradores'); }, le: 'agrupamento:ramp', g: 'ramp', c3: 'aceleradores' },
  { k: 'draw', n: 'Compra dedicada', ref: [10, 12], max: 18, v: function (A) { return dedicadas(A, 'draw', 'draw'); }, le: 'agrupamento:draw', g: 'draw', c3: 'draw' },
  { k: 'rem', n: 'Remoção', ref: [8, 12], max: 20, v: function (A) { return dedicadas(A, 'removal', 'remocao'); }, le: 'remocao', g: 'removal', c3: 'remocao' },
  { k: 'massa', n: 'Em massa', ref: [3, 5], max: 9, v: function (A) { return A.st.wipes; }, le: 'remocao', alto: true }
];
function estadoFund(f, A, v) {
  var le = A.le.filter(function (x) { return x.k === f.le; })[0];
  if (f.k === 'massa') { var lr = (A.leituras || []).filter(function (l) { return l.tipo === 'remocao'; })[0], mx = lr && lr.massa_max != null ? lr.massa_max : 5; return v > mx ? 'warn' : v < 3 ? 'baixo' : 'ok'; }
  if (f.k === 'rem') return v < f.ref[0] ? 'warn' : 'ok';
  if (le) return le.w ? 'warn' : (v < f.ref[0] ? 'baixo' : 'ok');
  return v < f.ref[0] ? 'warn' : 'ok';
}
function bullet(f, v, cls, tip) {
  var lo = f.min0 || 0, span = f.max - lo, pos = function (x) { return Math.max(0, Math.min(100, (x - lo) / span * 100)).toFixed(1) + '%'; };
  return '<span class="bul" data-tip="' + esc(tip) + '"><i class="band" style="left:' + pos(f.ref[0]) + ';width:calc(' + pos(f.ref[1]) + ' - ' + pos(f.ref[0]) + ')"></i><i class="val ' + cls + '" style="width:' + pos(v) + '"></i></span>';
}
function secFund() {
  var head = '<tr><th scope="col">Deck</th>' + FUND.map(function (f) { return '<th scope="col">' + f.n + '<small>ref. ' + f.ref[0] + ' a ' + f.ref[1] + '</small></th>'; }).join('') +
    '<th scope="col">CMC médio<small>custo 2 ou menos</small></th><th scope="col" class="c">Alertas<small>do painel</small></th></tr>';
  var rows = DK.map(function (d) {
    var A = d.a;
    return '<tr><th scope="row">' + deckLink(A) + '</th>' + FUND.map(function (f) {
      var v = f.v(A); if (v == null) return '<td class="vz">—</td>';
      var e = estadoFund(f, A, v), soft = !f.g ? 0 : A.v3 ? A.st.c3[iCrit(f.c3)].soft : A.st.grp[gix(A, f.g)].soft;
      var tip = A.nome + ': ' + v + ' ' + f.n.toLowerCase() + (soft ? ', mais ' + soft + ' de passagem' : '') + '. Referência de ' + f.ref[0] + ' a ' + f.ref[1] + '.';
      return '<td class="fu fu-' + e + '"><b class="num">' + v + (e === 'warn' ? ' <i class="ic" aria-label="em alerta">!</i>' : '') + '</b>' + bullet(f, v, e, tip) + '</td>';
    }).join('') +
      '<td><b class="num">' + num(A.st.avg, 2) + '</b><small class="num">' + pct(A.st.low / (A.st.nonland || 1)) + '</small></td>' +
      '<td class="c">' + (nAlertas(A.le) ? pill('warn', nAlertas(A.le) + ' de ' + A.le.length, '!') : pill('ok', 'nenhum', '✓')) + '</td></tr>';
  }).join('');
  var avisos = DK.map(function (d) {
    var A = d.a, ws = A.le.filter(function (x) { return x.w; });
    if (!ws.length) return '';
    return '<li><b>' + deckLink(A) + '</b><ul>' + ws.map(function (x) {
      var depois = A.le2.filter(function (y) { return y.k === x.k; })[0];
      var al = x.al ? x.al.charAt(0).toUpperCase() + x.al.slice(1) : '';
      return '<li><span class="lt">' + esc(x.t) + '.</span> ' + esc(al) + (depois && !depois.w ? ' <span class="res">Com as trocas recomendadas, sai do alerta: ' + esc(depois.t) + '.</span>' : '') + '</li>';
    }).join('') + '</ul></li>';
  }).join('');
  var h = caixa('', '<div class="tw"><table class="tbl fund"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="legenda"><span><i class="lg-band"></i>faixa de referência</span><span><i class="lg-ok"></i>dentro</span><span><i class="lg-baixo"></i>abaixo da faixa, sem alerta no painel</span><span><i class="lg-warn"></i>em alerta no painel</span></p>' +
    nota('Dedicadas são as cartas com nota 2 ou 3 no agrupamento. O alerta segue o mínimo que cada painel definiu, que pode diferir da faixa geral: o Clavileño, por exemplo, aceita 9 de ramp.'), 'larga') +
    caixa('O que cada painel acusa', '<ul class="acusa">' + avisos + '</ul>', 'larga', pl(soma(DK, function (d) { return nAlertas(d.a.le); }), 'alerta', 'alertas') + ' em ' + pl(DK.filter(function (d) { return nAlertas(d.a.le); }).length, 'deck', 'decks'));
  return secao('fundamentos', 'Fundamentos contra a referência', 'As faixas usuais de Commander e as leituras de cada painel, lado a lado.', h);
}

/* ============ 4. trocas ============ */
function boxSim() {
  var d = simDeck(); if (!d) return '';
  var A = d.a, cs = aplicar(A, sim.sel), st = contas(cs, A), le = leituras(st, A), sel = A.cands.filter(function (c) { return sim.sel[c.i]; });
  var saidas = {}, conflito = [];
  sel.forEach(function (c) { if (!c.sa) return; if (saidas[c.sa]) conflito.push([saidas[c.sa], c, A.idx[c.sa]]); else saidas[c.sa] = c; });
  var cmb = combosEm(A, cs), avisos = [];
  conflito.forEach(function (x) { avisos.push(pill('warn', 'vaga disputada', '!') + ' ' + esc(x[0].n) + ' e ' + esc(x[1].n) + ' saem pelo mesmo lugar: ' + esc(x[2] ? x[2].n : '?') + '.'); });
  if (st.n !== 100) avisos.push(pill('warn', st.n + ' cartas', '!') + ' ' + (st.n > 100 ? 'Escolha quem sai no painel, na fila de corte.' : 'Falta carta.'));
  cmb.forEach(function (x, i) {
    var antes = A.combos0[i];
    if (antes.falta.length && !x.falta.length) avisos.push(pill('ok', 'fecha', '✓') + ' "' + esc(x.k.n) + '" fica completo.');
    if (!antes.falta.length && x.falta.length) avisos.push(pill(/armadilha/i.test(x.k.k) ? 'ok' : 'warn', /armadilha/i.test(x.k.k) ? 'armadilha desfeita' : 'desmonta', /armadilha/i.test(x.k.k) ? '✓' : '!') + ' "' + esc(x.k.n) + '" perde ' + esc(lista(x.falta.map(function (id) { return A.idx[id] ? A.idx[id].n : id; }))) + '.');
  });
  var k = function (rot, v, d0) { return '<div class="sk"><span>' + rot + '</span><b class="num">' + v + '</b>' + (d0 ? '<small class="num ' + (d0.indexOf('−') === 0 ? 'neg' : d0.indexOf('+') === 0 ? 'pos' : '') + '">' + d0 + '</small>' : '') + '</div>'; };
  var dif = function (a, b, dd) { var x = a - b; return Math.abs(x) < 1e-9 ? '' : sinal(x, dd); };
  var g = function (key) { var i = gix(A, key); return i < 0 ? null : i; };
  var ir0 = g('ramp'), id0 = g('draw'), irm = g('removal');
  var h = '<div class="sim-top"><div class="seg" role="group" aria-label="Deck do simulador">' + DK.map(function (x) {
    return '<button data-act="sim-deck" data-k="' + esc(x.pasta) + '" aria-pressed="' + (x.pasta === d.pasta) + '">' + esc(x.nome) + '</button>';
  }).join('') + '</div><div class="seg" role="group" aria-label="Cenário">' +
    '<button data-act="sim-cen" data-k="hoje">Deck de hoje</button><button data-act="sim-cen" data-k="rec">Trocas recomendadas</button><button data-act="sim-cen" data-k="tudo">E as em avaliação</button></div></div>';
  h += '<div class="sks">' + k('Placar', numP(st.total), dif(st.total, A.st.total, (st.total - A.st.total) % 1 ? 1 : 0)) + k('Cartas', st.n, dif(st.n, A.st.n)) + k('CMC médio', num(st.avg, 2), dif(st.avg, A.st.avg, 2)) +
    k('Fontes de terreno', st.lands + st.mdfc, dif(st.lands + st.mdfc, A.st.lands + A.st.mdfc)) +
    (ir0 != null ? k('Ramp', st.grp[ir0].hard, dif(st.grp[ir0].hard, A.st.grp[ir0].hard)) : '') + (id0 != null ? k('Compra', st.grp[id0].hard, dif(st.grp[id0].hard, A.st.grp[id0].hard)) : '') +
    (irm != null ? k('Remoção', st.grp[irm].hard, dif(st.grp[irm].hard, A.st.grp[irm].hard)) : '') + k('Alertas', nAlertas(le) + ' de ' + le.length, dif(nAlertas(le), nAlertas(A.le))) + '</div>';
  if (avisos.length) h += '<ul class="sim-av">' + avisos.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul>';
  var ordem = { entra: 0, avaliar: 1, fora: 2 };
  var cands = A.cands.slice().sort(function (a, b) { return ordem[a.v] - ordem[b.v] || TR[a.T] - TR[b.T] || a.n.localeCompare(b.n); });
  var marg = {}; A.tr.forEach(function (t) { marg[t.c.i] = t.d; });
  h += '<ul class="sim-l">' + cands.map(function (c) {
    var dd = marg[c.i];
    if (dd == null) { var s1 = {}; s1[c.i] = 1; dd = contas(aplicar(A, s1), A).total - A.st.total; }
    var o = c.sa ? A.idx[c.sa] : null;
    return '<li class="v-' + c.v + (sim.sel[c.i] ? ' on' : '') + '"><label><input type="checkbox" data-sim="' + esc(c.i) + '"' + (sim.sel[c.i] ? ' checked' : '') + '>' +
      '<span class="nm">' + tierB(c.T) + ' ' + esc(c.n) + '</span><span class="vd vd-' + c.v + '">' + ({ entra: 'entra', avaliar: 'avaliar', fora: 'de fora' }[c.v]) + '</span>' +
      '<span class="sai">' + (o ? 'sai ' + esc(o.n) : 'ninguém sai') + '</span><span class="num dd ' + (dd > 0 ? 'pos' : dd < 0 ? 'neg' : '') + '" title="Efeito no placar se fosse a única troca">' + sinalP(dd) + '</span>' + '</label></li>';
  }).join('') + '</ul>' + nota('O número ao lado de cada carta é o efeito dela sozinha no placar. As trocas ficam só aqui: a decklist não muda.');
  return h;
}
function secTrocas() {
  var todas = []; DK.forEach(function (d) { todas = todas.concat(d.a.tr); });
  var rows = DK.map(function (d) {
    var A = d.a, aval = A.cands.filter(function (c) { return c.v === 'avaliar'; }).length, dp = A.st2.total - A.st.total;
    var marg = soma(A.tr, function (t) { return t.d; }), dc = A.st2.avg - A.st.avg;
    return '<tr><th scope="row">' + deckLink(A) + '</th><td class="n num" data-l="Entram">' + A.tr.length + '</td><td class="n num" data-l="Em avaliação">' + aval + '</td>' +
      '<td class="n num pl" data-l="Placar">' + numP(A.st.total) + ' <span class="seta">→</span> ' + numP(A.st2.total) + '<small class="' + (dp >= 0 ? 'pos' : 'neg') + '">' + sinalP(dp) + ' (' + sinal(dp / A.st.total * 100, 1) + '%)</small></td>' +
      '<td class="n num" data-l="CMC médio">' + num(A.st.avg, 2) + ' <span class="seta">→</span> ' + num(A.st2.avg, 2) +
        (Math.abs(dc) >= 0.005 ? '<small class="' + (dc < 0 ? 'pos' : 'neg') + '">' + sinal(dc, 2) + '</small>' : '') + '</td>' +
      '<td class="n num" data-l="Soma das partes" data-tip="' + esc('Somando as trocas uma a uma: ' + sinalP(marg) + '. Juntas: ' + sinalP(dp) + '.') + '">' + sinalP(marg) + '</td>' +
      '<td class="n num" data-l="Alertas">' + nAlertas(A.le) + ' <span class="seta">→</span> ' + nAlertas(A.le2) + '</td></tr>';
  }).join('');
  var pos = todas.filter(function (t) { return t.d > 0; }).sort(function (a, b) { return b.d - a.d || TR[a.c.T] - TR[b.c.T] || a.c.n.localeCompare(b.c.n); });
  var neg = todas.filter(function (t) { return t.d <= 0; }).sort(function (a, b) { return a.d - b.d; });
  var maior = DK.map(function (d) { return { d: d, x: d.a.st2.total - d.a.st.total - soma(d.a.tr, function (t) { return t.d; }) }; }).sort(function (a, b) { return Math.abs(b.x) - Math.abs(a.x); })[0];
  var h = caixa('', '<div class="tw"><table class="tbl troc"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">Entram</th><th scope="col" class="n">Em avaliação</th>' +
    '<th scope="col" class="n">Placar</th><th scope="col" class="n">CMC médio</th><th scope="col" class="n">Soma das partes</th><th scope="col" class="n">Alertas</th></tr></thead><tbody>' + rows +
    '</tbody></table></div>' + nota('Entram: trocas com veredito "entra" no radar; em avaliação, as que ainda pedem teste. ' +
      (maior && Math.abs(maior.x) >= 5 ? 'O placar anda em degraus: ' + esc(maior.d.nome) + ' soma ' + sinalP(soma(maior.d.a.tr, function (t) { return t.d; })) + ' com as trocas uma a uma e ' + sinalP(maior.d.a.st2.total - maior.d.a.st.total) + ' com todas juntas. Julgue o pacote, não a carta.' : '')), 'larga');
  h += '<div class="g2">' + caixa('As trocas que mais sobem o placar', '<ul class="naopaga">' + mais('sobem', pos, 8, function (t) {
      return '<li><span class="num pos">' + sinalP(t.d) + '</span><div><b>' + esc(t.c.n) + '</b> ' + tierB(t.c.T) + ' <span class="dim">no ' + esc(t.deck.nome) + (t.out ? ', no lugar de ' + esc(t.out.n) + ' ' : '') + '</span>' + (t.out ? tierB(t.out.T) : '') + '</div></li>';
    }) + '</ul>' + nota('Cada troca medida sozinha, no deck de hoje. Placar sobe com nota nos agrupamentos, CMC médio menor e Ramp; o que ele não vê está em "Trocas que o placar não paga".'), '', pos.length ? 'a maior: ' + esc(pos[0].c.n) + ', ' + sinalP(pos[0].d) : '') +
    caixa('Trocas que o placar não paga', '<ul class="naopaga">' + mais('naopaga', neg, 6, function (t) {
      return '<li><span class="num neg">' + sinalP(t.d) + '</span><div><b>' + esc(t.c.n) + '</b> <span class="dim">no ' + esc(t.deck.nome) + (t.out ? ', no lugar de ' + esc(t.out.n) : '') + '</span><p>' + esc(t.porque) + '</p></div></li>';
    }) + '</ul>' + nota('Placar não é tudo: terreno, qualidade e proteção nem sempre viram nota. Essas trocas se justificam pelo motivo escrito no radar de cada painel.'), '', pl(neg.length, 'troca', 'trocas')) + '</div>';
  var boas = [], semAlt = [];
  DK.forEach(function (d) { boas = boas.concat(d.a.cv.boas); semAlt = semAlt.concat(d.a.cv.caras.filter(function (x) { return !x.alt && x.c.c >= 6; })); });
  boas.sort(function (a, b) { return b.d - a.d || TR[a.c.T] - TR[b.c.T] || a.c.n.localeCompare(b.c.n); });
  semAlt.sort(function (a, b) { return b.c.c - a.c.c || TR[b.c.T] - TR[a.c.T] || a.c.n.localeCompare(b.c.n); });
  var mudam = DK.filter(function (d) { return d.a.cv.boas.length; });
  h += '<div class="g2">' + caixa('Trocas que baixam o custo', '<ul class="naopaga custo">' + (boas.length ? mais('baixa', boas, 8, function (b) {
      return '<li><span class="num pos">−' + b.d + '</span><div><b>' + esc(b.c.n) + '</b> <span class="dim">no ' + esc(b.deck.nome) + ', no lugar de ' + esc(b.s.n) +
        ' (custo ' + b.s.c + ' → ' + b.c.c + ')</span>' + (b.c.v === 'avaliar' ? ' ' + pill('info', 'em avaliação') : '') + '</div></li>';
    }) : '<li class="dim">Nenhuma troca do radar baixa o custo mantendo o papel.</li>') + '</ul>' +
    nota((mudam.length ? 'Com essas trocas, o CMC médio fica assim: ' + esc(lista(mudam.map(function (d) { return d.nome + ' ' + num(d.a.st.avg, 2) + ' → ' + num(d.a.cv.st.avg, 2); }))) + '. ' : '') +
      'Mantém o papel quando a carta que entra fica no mesmo pacote do 8×8 que a que sai, com nota igual ou maior nele e tier igual ou melhor. Cada mana a menos adianta a carta em cerca de um turno no começo do jogo.'), '', pl(boas.length, 'troca', 'trocas')) +
    caixa('Custo 6 ou mais, sem troca mais barata no radar', '<ul class="naopaga custo">' + (semAlt.length ? mais('caras', semAlt, 8, function (x) {
      return '<li><span class="num">' + x.c.c + '</span><div><b>' + esc(x.c.n) + '</b> <span class="dim">no ' + esc(x.deck.nome) + ', tier ' + x.c.T + ', ' + RELL[x.c.r] + '</span></div></li>';
    }) : '<li class="dim">Toda carta de custo 6 ou mais fora do plano já tem alternativa mais barata no radar.</li>') + '</ul>' +
    nota('Custo 6 ou mais, sem carta mais barata no mesmo pacote do radar. Ficam fora tier S, intocáveis, estimação, custo variável (X) e as que custam menos na prática. É por onde começar a procurar uma carta mais barata que faça o mesmo.'), '', pl(semAlt.length, 'carta', 'cartas')) + '</div>';
  h += caixa('Simulador de trocas', '<div id="sim">' + boxSim() + '</div>', 'larga sim-box', 'marque e desmarque as cartas do radar e veja o placar, a curva e os alertas');
  return secao('trocas', 'Trocas recomendadas: ganho e risco', 'O radar de cada painel, somado: o que entra, o que sai e o que muda no deck.', h);
}

/* ============ 5. placar ============ */
/* Placar comparável (pontuação v3): os decks já migrados, pelo placar e pela soma de cada critério, com a média dos decks.
   Só os decks v3 entram: o placar do método antigo depende dos agrupamentos de cada deck e não se compara. */
function placarComparavel() {
  var V = DK.filter(function (d) { return d.a.v3; }).sort(function (x, y) { return y.a.st.total - x.a.st.total; });
  if (!V.length) return '';
  var cr = RG.criterios, max = cr.map(function (c, j) { return Math.max.apply(null, V.map(function (d) { return d.a.st.c3[j].pts; })); });
  var head = '<tr><th scope="col">#</th><th scope="col">Deck</th><th scope="col" class="n">Placar</th>' + cr.map(function (c) {
    return '<th scope="col" class="n" title="' + esc(c.nome + ', peso ' + num(c.peso, c.peso % 1 ? 1 : 0)) + '"><i class="cdot" style="background:rgb(' + c.cor + ')"></i>' + esc(c.curto) + '</th>';
  }).join('') + '<th scope="col" class="n">Aceleração</th></tr>';
  var rows = V.map(function (d, i) {
    var st = d.a.st;
    return '<tr><td class="n num">' + (i + 1) + 'ª</td><th scope="row">' + deckLink(d.a) + '</th><td class="n num"><b>' + numP(st.total) + '</b></td>' +
      cr.map(function (c, j) { var v = st.c3[j].pts; return '<td class="n num' + (V.length > 1 && v === max[j] && v > 0 ? ' topo' : '') + '" title="' + esc(c.nome + ': ' + st.c3[j].hard + ' com nota 2 ou 3, faixa ' + c.faixa[0] + ' a ' + c.faixa[1]) + '">' + numP(v) + '</td>'; }).join('') +
      '<td class="n num">' + st.accPts + '</td></tr>';
  }).join('');
  var media = function (f) { return soma(V, f) / V.length; };
  var foot = '<tr class="med"><td></td><th scope="row">Média dos decks</th><td class="n num"><b>' + numP(Math.round(media(function (d) { return d.a.st.total; }) * 10) / 10) + '</b></td>' +
    cr.map(function (c, j) { return '<td class="n num">' + numP(Math.round(media(function (d) { return d.a.st.c3[j].pts; }) * 10) / 10) + '</td>'; }).join('') +
    '<td class="n num">' + numP(Math.round(media(function (d) { return d.a.st.accPts; }) * 10) / 10) + '</td></tr>';
  var fora = DK.length - V.length;
  return caixa('Placar comparável', '<div class="tw"><table class="tbl pcomp"><thead>' + head + '</thead><tbody>' + rows + '</tbody><tfoot>' + foot + '</tfoot></table></div>' +
    nota('Os dez critérios valem igual em todos os decks: peso do critério × pontos da nota (0, 1, 3 ou 6), mais a aceleração. Em destaque, o deck que mais soma em cada critério. ' +
      (fora ? pl(fora, 'deck ainda está', 'decks ainda estão') + ' no método antigo e ' + (fora === 1 ? 'entra' : 'entram') + ' aqui ao migrar.' : '')), 'larga', pl(V.length, 'deck', 'decks') + ' nos critérios');
}
function secPlacar() {
  var rows = DK.map(function (d) {
    var A = d.a, st = A.st, g = A.deg, t = st.total || 1;
    var comp = '<span class="comp" aria-hidden="true"><i class="c1" style="flex:' + st.cmcPts + '"></i><i class="c2" style="flex:' + st.accPts + '"></i><i class="c3" style="flex:' + st.crit + '"></i></span>';
    var rn = rampNome(A);
    var sobe = g.teto ? 'no teto de 90' : '+' + pl(g.sobe, 'ponto', 'pontos') + ' de ' + rn + ': +5';
    var cai = g.teto ? '—' : g.folga === 0 ? '<b class="aviso">−1 ponto de ' + rn + ': −5</b>' : 'aguenta perder ' + g.folga + ' de ' + rn;
    var cmcCai = g.folgaCmc == null ? '—' : g.folgaCmc === 0 ? '<b class="aviso">+1 de CMC somado: −5</b>' : 'aguenta +' + g.folgaCmc + ' de CMC somado';
    var cmcSobe = A.v3 && !RG.pontos_de_cmc_antigos ? 'o CMC médio não pontua' : g.lim ? 'cortar ' + g.corte + ' de CMC somado: +1' : 'no máximo';
    return '<tr><th scope="row">' + deckLink(A) + '</th><td class="n num"><b>' + numP(st.total) + '</b></td>' +
      '<td>' + sobe + '</td><td>' + cai + '</td><td>' + cmcCai + '</td><td>' + cmcSobe + '</td>' +
      '<td class="n num">' + num(st.accX, 2) + '<small>próximo: ' + num(g.prox, 1) + '</small></td><td class="compc">' + comp +
      '<small class="num">' + st.cmcPts + ' + ' + st.accPts + ' + ' + numP(st.crit) + '</small></td></tr>';
  }).join('');
  var expo = DK.map(function (d) {
    var A = d.a, tp = A.st.tipoPts, tot = soma(Object.keys(tp), function (k) { return Math.max(0, tp[k]); }) || 1;
    var ks = Object.keys(TIPOS).filter(function (k) { return tp[k] > 0; });
    var maior = ks.slice().sort(function (a, b) { return tp[b] - tp[a]; })[0];
    return '<div class="ex"><div class="ex-h"><b>' + deckLink(A) + '</b><span>' + pct(tp[maior] / tot) + ' em ' + TIPOS[maior].toLowerCase() + '</span></div><span class="stk">' + ks.map(function (k) {
      return '<i class="tp-' + k + '" style="flex:' + tp[k] + '" data-tip="' + esc(TIPOS[k] + ': ' + pct(tp[k] / tot) + ' das notas') + '"></i>';
    }).join('') + '</span><p class="dim">Teme ' + ODIO[maior] + '.</p></div>';
  }).join('');
  var leg = Object.keys(TIPOS).filter(function (k) { return DK.some(function (d) { return d.a.st.tipoPts[k] > 0; }); }).map(function (k) { return '<span><i class="tp-' + k + '"></i>' + TIPOS[k] + '</span>'; }).join('');
  var h = caixa('', '<div class="tw"><table class="tbl plac"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">Placar</th><th scope="col">Para subir</th><th scope="col">Folga de Ramp</th><th scope="col">Folga de CMC</th><th scope="col">Degrau do CMC</th>' +
    '<th scope="col" class="n">Aceleração</th><th scope="col">CMC + aceleração + notas</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="legenda"><span><i class="c1"></i>CMC médio, de 1 a 5</span><span><i class="c2"></i>aceleração, em degraus de 5</span><span><i class="c3"></i>soma das notas</span></p>' +
    nota('A aceleração é a soma das notas de Ramp dividida pelo CMC médio; cada 0,5 vale 5 pontos, até 90. Por isso um ponto de Ramp pode valer 6 no placar, e um pouco de CMC a mais pode custar 5. CMC somado é a soma dos custos das mágicas: trocar uma carta de 5 por uma de 2 corta 3.'), 'larga');
  h += caixa('Onde mora a força de cada deck', '<div class="exs">' + expo + '</div><p class="legenda">' + leg + '</p>' +
    nota('Parte das notas que está em cada tipo de carta. É a exposição do deck: quanto mais concentrada, mais um tipo de remoção dói.'), 'larga', 'a parte das notas em cada tipo de carta');
  return secao('placar', 'Placar', 'O placar dos decks já nos critérios, comparável entre eles; e onde cada placar muda de degrau.', placarComparavel() + h);
}

/* ============ 6. mana ============ */
function svgMana(A) {
  var M = A.mana, W = 220, Hh = 120, ml = 30, mr = 8, mt = 10, mb = 22;
  var xs = M.curva.map(function (p) { return p.k; }), x0 = xs[0], x1 = xs[xs.length - 1];
  var sx = function (k) { return ml + (k - x0) / (x1 - x0) * (W - ml - mr); }, sy = function (p) { return Hh - mb - (Math.max(0.4, p) - 0.4) / 0.6 * (Hh - mt - mb); };
  var g = [0.4, 0.6, 0.8, 1].map(function (p) { return '<line class="gr" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + sy(p).toFixed(1) + '" y2="' + sy(p).toFixed(1) + '"/><text class="tk" x="' + (ml - 5) + '" y="' + (sy(p) + 3.5).toFixed(1) + '" text-anchor="end">' + pct(p) + '</text>'; }).join('');
  var line = M.curva.map(function (p) { return sx(p.k).toFixed(1) + ',' + sy(p.p).toFixed(1); }).join(' ');
  var kar = Math.round(A.kar.sug), kx = kar >= x0 && kar <= x1 ? '<line class="kar" x1="' + sx(kar).toFixed(1) + '" x2="' + sx(kar).toFixed(1) + '" y1="' + mt + '" y2="' + (Hh - mb) + '"/><text class="tk kt" x="' + (sx(kar) - 3).toFixed(1) + '" y="' + (mt + 8) + '" text-anchor="end">Karsten</text>' : '';
  var pts2 = M.curva.map(function (p) {
    var cur = p.k === M.src;
    return '<g class="pt" data-tip="' + esc(p.k + ' fontes: ' + pct(p.p, 1) + ' de ter ' + M.T + ' terrenos no turno ' + M.T) + '"><circle class="hit" cx="' + sx(p.k).toFixed(1) + '" cy="' + sy(p.p).toFixed(1) + '" r="9"/>' +
      '<circle class="' + (cur ? 'dot cur' : 'dot sm') + '" cx="' + sx(p.k).toFixed(1) + '" cy="' + sy(p.p).toFixed(1) + '" r="' + (cur ? 4.5 : 2.5) + '"/></g>';
  }).join('');
  var tks = M.curva.filter(function (p) { return (p.k - M.src) % 2 === 0; }).map(function (p) { return '<text class="tk" x="' + sx(p.k).toFixed(1) + '" y="' + (Hh - 6) + '" text-anchor="middle">' + p.k + '</text>'; }).join('');
  return '<svg class="ch mini" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="' + esc(A.nome + ': chance de ' + M.T + ' terrenos no turno ' + M.T + ' conforme o número de fontes') + '">' + g + kx +
    '<polyline class="ln" points="' + line + '"/>' + pts2 + tks + '</svg>';
}
function secMana() {
  var rows = DK.map(function (d) {
    var A = d.a, M = A.mana, k = A.kar, gap = M.src - k.sug;
    return '<tr><th scope="row">' + deckLink(A) + '</th><td class="n num">' + A.st.lands + (A.st.mdfc ? ' + ' + A.st.mdfc : '') + ' = <b>' + M.src + '</b></td>' +
      '<td class="n num">' + num(k.sug, 1) + '<small>' + sinal(gap, 1) + '</small></td><td class="n num">' + A.st.tapped + '</td>' +
      '<td class="n num">' + pct(M.p3) + '</td><td class="n num">' + pct(M.p4) + '</td>' +
      '<td class="n num"><b>' + pct(M.pc) + '</b><small>' + (A.cmd ? 'custo ' + A.cmd.c + ', turno ' + M.T : '') + '</small></td><td class="n num">' + sinal(M.mais1 * 100, 1) + ' p.p.</td></tr>';
  }).join('');
  var minis = DK.map(function (d) {
    var A = d.a;
    return '<figure class="mm"><figcaption><b>' + esc(A.nome) + '</b><span>' + pct(A.mana.pc) + ' com ' + A.mana.src + ' fontes</span></figcaption>' + svgMana(A) + '</figure>';
  }).join('');
  var cor = DK.filter(function (d) { return d.a.ident.length >= 2; }).map(function (d) {
    var A = d.a, id = A.ident.split(''), pt = soma(id, function (ch) { return A.st.pip[ch]; }) || 1, ft = soma(id, function (ch) { return A.st.src[ch]; }) || 1;
    return '<div class="cb"><b>' + deckLink(A) + '</b>' + id.map(function (ch) {
      var a = A.st.pip[ch] / pt, b = A.st.src[ch] / ft, gap = a - b;
      return '<div class="cbr"><span>' + manaTxt(ch) + '</span><span class="cbt"><i class="dem" style="width:' + (a * 100).toFixed(1) + '%;--c:' + MANA[ch] + '"></i><i class="ofe" style="width:' + (b * 100).toFixed(1) + '%;--c:' + MANA[ch] + '"></i></span>' +
        '<span class="num' + (gap >= 0.1 ? ' aviso' : '') + '">' + pct(a) + ' / ' + pct(b) + '</span></div>';
    }).join('') + '</div>';
  }).join('');
  var h = caixa('', '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">Terrenos + duplas</th><th scope="col" class="n">Karsten sugere</th><th scope="col" class="n">Virados</th>' +
    '<th scope="col" class="n">3 terrenos no turno 3</th><th scope="col" class="n">4 no turno 4</th><th scope="col" class="n">Comandante na curva</th><th scope="col" class="n">Cada fonte a mais</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    nota('Probabilidade de ter os terrenos, só com terrenos e cartas duplas: grimório de 99, sem mulligan, comprando no primeiro turno, como no multiplayer. Ramp ajuda e não entra na conta, então é o piso. ' +
      'Karsten (2022): 31,42 + 3,13 × CMC médio − 0,28 × compra e ramp de custo 2 ou menos; é mais conservadora que os 35 a 37 do projeto. As duplas contam como terreno aqui.'), 'larga');
  h += caixa('Comandante na curva, conforme o número de fontes', '<div class="mms">' + minis + '</div>' + nota('Cada curva mostra a chance de ter terrenos para o comandante no turno do custo dele, de 3 fontes a menos até a sugestão de Karsten. O ponto maior é o deck de hoje; a linha vertical, a sugestão de Karsten.'), 'larga', 'uma curva por deck');
  if (cor) h += caixa('Demanda e oferta de cada cor', '<div class="cbs">' + cor + '</div>' + nota('Barra cheia: parte dos símbolos de mana nos custos. Barra clara: parte das fontes que geram a cor. Diferença de 10 pontos ou mais fica destacada.'), 'larga', 'símbolos de mana contra fontes');
  return secao('mana', 'Base de mana', 'Terrenos, chance de cumprir a curva e equilíbrio de cores.', h);
}

/* ============ reserva e sobra ============ */
function secReserva() {
  var frag = [], linhas = [], pares = [];
  DK.forEach(function (d) {
    var A = d.a, R = A.res;
    R.frageis.forEach(function (f) { frag.push({ A: A, f: f }); });
    if (R.par) pares.push({ A: A, p: R.par });
    var curtas = R.falta.filter(function (f) { return f.est === 'baixo'; });
    if (curtas.length || R.sobra.length) linhas.push({ A: A, curtas: curtas, sobra: R.sobra });
  });
  frag.sort(function (a, b) { return a.f.p - b.f.p || a.A.nome.localeCompare(b.A.nome); });
  var chip = function (f, cls) { return '<span class="rs-i rs-' + cls + '" data-tip="' + esc(f.g.n + ': ' + f.n + ', ' + faixaTxt(f) + (f.n2 !== f.n ? '; ' + f.n2 + ' com as trocas' : '')) + '">' + esc(f.g.ab) + ' <b class="num">' + f.n + '</b><small>/' + (cls === 'sobra' ? f.hi : f.lo) + '</small></span>'; };
  var rows = linhas.map(function (x) {
    var cortes = []; x.sobra.forEach(function (f) { cortes = cortes.concat(f.cortes); });
    return '<tr><th scope="row">' + deckLink(x.A) + '</th><td data-l="Abaixo da faixa"><div class="rs">' + (x.curtas.map(function (f) { return chip(f, 'baixo'); }).join('') || '<span class="dim">—</span>') + '</div></td>' +
      '<td data-l="Com sobra"><div class="rs">' + (x.sobra.map(function (f) { return chip(f, 'sobra'); }).join('') || '<span class="dim">—</span>') + '</div></td>' +
      '<td data-l="Cortes mais seguros">' + (cortes.length ? cortes.map(function (c) { return esc(c.c.n) + ' ' + tierB(c.c.T) + (c.troca ? ' <span class="dim">(já sai pelo ' + esc(c.troca.n) + ')</span>' : ''); }).join(', ') : '<span class="dim">—</span>') + '</td></tr>';
  }).join('');
  var nCortes = soma(DK, function (d) { return d.a.res.nCortes; });
  var h = '<div class="g2">' + caixa('Funções sem reserva', (frag.length ? '<ul class="naopaga">' + mais('frag', frag, 8, function (x) {
      var f = x.f;
      return '<li><span class="num neg">' + pct(f.p) + '</span><div><b>' + esc(x.A.nome) + ': ' + esc(f.g.n) + '</b> <span class="dim">depende de ' + (f.nb ? esc(lista(f.ded.map(function (c) { return c.n; }))) : 'nenhuma carta') + '</span>' +
        '<p>' + (f.radar.length ? 'No radar: ' + nomesR(f.radar, 3) + '.' : 'Nada no radar para ela.') + '</p></div></li>';
    }) + '</ul>' : '<p class="hint">Toda função de todo deck tem três cartas ou mais, ou o comandante cobre.</p>') +
    nota('A porcentagem é a chance de ver ao menos uma carta da função entre as 10 primeiras (mão de 7 e três compras). Com uma carta só, a função aparece em 1 de cada 10 partidas; com quatro, em 1 de cada 3. Se o comandante cumpre a função, ela tem reserva.'), '', pl(frag.length, 'função', 'funções')) +
    caixa('Trocas dentro do deck', (pares.length ? '<ul class="lst">' + pares.map(function (x) {
      var p = x.p;
      return '<li><b>' + deckLink(x.A) + '</b>: tire ' + esc(p.sai.n) + ' ' + tierB(p.sai.T) + ' (' + esc(p.sobra.g.n) + ': ' + p.sobra.n + ', ' + faixaTxt(p.sobra) + ')' +
        (p.entra ? ' e teste ' + esc(p.entra.n) + ' ' + tierB(p.entra.T) + ' (' + esc(p.falta.g.n) + ': ' + p.falta.n + (p.falta.lo != null ? ', ' + faixaTxt(p.falta) : '') + ').' : ' e procure uma carta de ' + esc(p.falta.g.n) + ' (' + p.falta.n + (p.falta.lo != null ? ', ' + faixaTxt(p.falta) : '') + (p.jaEntram ? '): as do radar já entram por outras trocas.' : '): o radar não tem.')) + '</li>';
    }).join('') + '</ul>' : '<p class="hint">Nenhum deck tem, ao mesmo tempo, função curta e pacote com sobra.</p>') +
    nota('Só quando a função continua curta mesmo com as trocas recomendadas. O corte é o mais seguro do pacote que mais passa da faixa, entre os que nenhuma troca já tira; entra a melhor carta do radar que ainda está em avaliação. É troca que conserta o deck sem tirar nada de que ele precise.'), '', pl(pares.length, 'deck', 'decks')) + '</div>';
  h += caixa('Funções curtas e pacotes com sobra, deck a deck', (rows ? '<div class="tw"><table class="tbl rs-t"><thead><tr><th scope="col">Deck</th><th scope="col">Abaixo da faixa</th><th scope="col">Com sobra</th><th scope="col">Cortes mais seguros</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="hint">Todo deck está dentro das faixas.</p>') +
    nota('Faixa só em ramp, compra e remoção, a referência de cada painel: nos temas, passar da faixa é o plano. Número: cartas dedicadas (nota 2 ou 3), com o comandante; depois da barra, o limite da faixa. Corte mais seguro: tier C ou D, ou na berlinda, com pacote primário no agrupamento que sobra, fora de intocáveis e estimação, sem deixar outra função curta, na ordem da fila de corte do painel. Saem no máximo as que passam da faixa: o pacote continua no teto.'), 'larga', pl(nCortes, 'corte seguro', 'cortes seguros'));
  return secao('reserva', 'Reserva e sobra', 'Função que mora em uma ou duas cartas falha na maioria das partidas; pacote acima da faixa é de onde sai a próxima troca sem perder nada.', h);
}

/* ============ 8. auditoria ============ */
function secAudit() {
  var chk = [];
  function item(ok, titulo, det) { chk.push('<li class="' + (ok === true ? 'ok' : ok === 'info' ? 'inf' : 'warn') + '">' + pill(ok === true ? 'ok' : ok === 'info' ? 'info' : 'warn', ok === true ? 'ok' : ok === 'info' ? 'nota' : 'ver', ok === true ? '✓' : ok === 'info' ? 'i' : '!') + '<div><b>' + titulo + '</b>' + (det ? '<p>' + det + '</p>' : '') + '</div></li>'); }
  var n100 = DK.filter(function (d) { return d.a.st.n !== 100; });
  item(!n100.length, 'Cem cartas em todos os decks', n100.length ? esc(lista(n100.map(function (d) { return d.nome + ' (' + d.a.st.n + ')'; }))) : '');
  item(true, 'Identidade de cor', 'O build recusa carta fora das cores do comandante, no deck, no radar e nos potenciais.');
  var inc = []; DK.forEach(function (d) { d.a.cards.forEach(function (c) { if ((c.r === 'INS' && TR[c.T] >= 3) || (c.r === 'BAX' && TR[c.T] <= 1)) inc.push(c.n + ' (' + d.nome + ', ' + c.T + ' ' + RELL[c.r] + ')'); }); });
  item(!inc.length, 'Tier e relevância coerentes', inc.length ? esc(lista(inc)) : 'Nenhuma intocável com tier C ou D, nenhuma na berlinda com tier S ou A.');
  var zero = []; DK.forEach(function (d) { d.a.cards.forEach(function (c) { if (!c.L && !c.md && !c.cm && pts(c) === 0) zero.push(c.n + ' (' + d.nome + ', ' + c.T + ' ' + RELL[c.r] + ')'); }); });
  item(!zero.length || 'info', 'Cartas sem nota em agrupamento nenhum', zero.length ? esc(lista(zero)) + '. Uma carta que não pontua em nada precisa de um porquê forte para ficar.' : '');
  var vaga = [], vagaRec = 0; DK.forEach(function (d) {
    var m = {}; d.a.cands.forEach(function (c) { if (c.sa && c.v !== 'fora') (m[c.sa] = m[c.sa] || []).push(c); });
    Object.keys(m).forEach(function (id) {
      if (m[id].length < 2) return;
      if (m[id].filter(function (c) { return c.v === 'entra'; }).length > 1) vagaRec++;
      vaga.push(d.nome + ': ' + lista(m[id].map(function (c) { return c.n; })) + ' disputam a vaga de ' + (d.a.idx[id] ? d.a.idx[id].n : id));
    });
  });
  item(!vaga.length || (vagaRec ? false : 'info'), 'Vagas disputadas no radar', vaga.length ? esc(vaga.join('; ')) + '. Promover as duas deixa o deck com 101 cartas' +
    (vagaRec ? '; ' + pl(vagaRec, 'disputa é', 'disputas são') + ' entre trocas recomendadas, e o pacote do radar não fecha em 100.' : '; nenhuma disputa é entre duas trocas recomendadas.') : '');
  var dep = []; DK.forEach(function (d) { d.a.combos0.forEach(function (x) { if (x.falta.length) dep.push('"' + x.k.n + '" (' + d.nome + ') depende de ' + lista(x.falta.map(function (id) { return d.a.idx[id] ? d.a.idx[id].n : id; }))); }); });
  item(!dep.length || 'info', 'Combos com peça fora do deck', dep.length ? esc(dep.join('; ')) + '.' : '');
  /* calibração da régua, sem os terrenos básicos */
  var bas = basicosRel();
  item(!bas.fora.length || 'info', 'Terrenos básicos com a mesma relevância em todo deck', bas.fora.length ? esc(lista(bas.fora.map(function (x) { return x.nome + ' marca os ' + x.q + ' básicos como ' + RELL[x.r]; }))) + '; os demais, como ' + RELL[bas.moda] + '. Não muda o placar, mas engorda a contagem de intocáveis.' : '');
  var cal = DK.map(function (d) {
    var C = calibra(d.a);
    var cel = RELS.map(function (k) {
      var x = C.r[k] / (C.n || 1), fora = C.fora.indexOf(k) >= 0;
      return '<td class="n num' + (fora ? ' fora' : '') + '" data-tip="' + esc(RELN[k] + ': ' + C.r[k] + ' cartas, ' + pct(x) + '; esperado de ' + pct(FAIXA[k][0]) + ' a ' + pct(FAIXA[k][1])) + '">' + pct(x) + '</td>';
    }).join('');
    var leit = C.diag > 0.995 ? pill('warn', 'eixos colados', '!') : C.diag >= 0.9 ? pill('warn', 'eixos quase colados', '!') : C.fora.length ? pill('warn', C.fora.map(function (k) { return RELL[k]; }).join(' e ') + ' fora da faixa', '!') : pill('ok', 'régua firme', '✓');
    return '<tr><th scope="row">' + deckLink(d.a) + '</th>' + cel + '<td class="n num' + (C.diag >= 0.9 ? ' fora' : '') + '">' + pct(C.diag) + '</td><td>' + leit + '</td></tr>';
  }).join('');
  var hm = DK.map(function (d) {
    var A = d.a, m = {}, mx = 1;
    A.cards.forEach(function (c) { var k = c.T + c.r; m[k] = (m[k] || 0) + (c.q || 1); mx = Math.max(mx, m[k]); });
    return '<figure class="hm"><figcaption>' + esc(A.nome) + '</figcaption><div class="hmg"><span></span>' + RELS.map(function (r) { return '<span class="hh">' + RELL[r] + '</span>'; }).join('') +
      TIERS.map(function (t) {
        return '<span class="hh">' + t + '</span>' + RELS.map(function (r) {
          var v = m[t + r] || 0, anom = v && ((r === 'INS' && TR[t] >= 3) || (r === 'BAX' && TR[t] <= 1));
          var al = v ? 0.14 + 0.86 * v / mx : 0;
          return '<span class="hc' + (anom ? ' anom' : '') + (!v ? ' z' : al < 0.55 ? ' cl' : '') + '" style="--a:' + al.toFixed(2) + '" data-tip="' + esc(A.nome + ': ' + pl(v, 'carta', 'cartas') + ' tier ' + t + ' e ' + RELL[r]) + '">' + (v || '') + '</span>';
        }).join('');
      }).join('') + '</div></figure>';
  }).join('');
  var conf = DK.filter(function (d) { return d.a.conf; });
  var porIA = {};
  conf.forEach(function (d) { d.a.conf.an.forEach(function (x) { var k = x.ia || 'outras'; porIA[k] = porIA[k] || { n: 0, e: 0 }; porIA[k].n++; porIA[k].e += x.e; }); });
  var confRows = conf.map(function (d) {
    var C = d.a.conf;
    return '<tr><th scope="row">' + deckLink(d.a) + '</th>' + ['A', 'B', 'C'].map(function (s) {
      var x = C.an.filter(function (y) { return y.s === s; })[0];
      return x ? '<td class="n num" data-tip="' + esc(x.a) + '">' + x.e + '<small>' + esc(x.ia || 'outra IA') + '</small></td>' : '<td class="vz">—</td>';
    }).join('') + '<td class="n num">' + C.nv + '</td></tr>';
  }).join('');
  var iaTxt = Object.keys(porIA).map(function (k) { var x = porIA[k]; return (k === 'outras' ? 'as não identificadas' : k) + ', ' + num(x.e / x.n, 1) + ' por análise'; });
  var fr = DK.map(function (d) {
    var A = d.a, cel = function (s, lim, rot) { var n = diasDesde(s); var cls = n == null ? '' : n > lim ? 'warn' : 'ok'; return '<td class="n num">' + (s ? brData(s) : '—') + '<small' + (cls ? ' class="' + cls + '"' : '') + '>' + idade(n) + '</small></td>'; };
    return '<tr><th scope="row">' + deckLink(A) + '</th>' + cel(A.feito, 90) + cel(A.edh ? A.edh.l : '', 30) + '<td>' + (A.hist ? esc(A.hist.v) + '<small>' + brData(A.hist.d) + '</small>' : '—') + '</td>' +
      '<td class="n num">' + A.pool.length + '<small>' + A.cands.filter(function (c) { return c.v === 'avaliar'; }).length + ' a avaliar</small></td></tr>';
  }).join('');
  var h = '<div class="g2">' + caixa('Conferências', '<ul class="chk">' + chk.join('') + '</ul>', '', '') +
    caixa('Calibração da régua de relevância', '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Deck</th>' + RELS.map(function (r) { return '<th scope="col" class="n">' + RELL[r] + '</th>'; }).join('') + '<th scope="col" class="n">Tier igual<small>à relevância</small></th><th scope="col">Leitura</th></tr></thead><tbody>' + cal + '</tbody></table></div>' +
      nota('Sem os terrenos básicos. O método espera perto de 20% INS, 40% ALT, 30% MÉD e 8 a 10% BAX; destacado, o que sai da faixa. "Tier igual" conta as cartas em que a relevância repete o tier (S e INS, A e ALT, B e MÉD, C ou D e BAX): perto de 100%, os dois eixos viraram um só.') +
      '<div class="hms">' + hm + '</div>' + nota('Tier contra relevância, carta a carta, com os básicos. As casas de canto (intocável fraca, berlinda forte) são as incoerências. Uma diagonal cheia e o resto vazio quer dizer que a relevância só repete o tier.'), '', '') + '</div>';
  h += '<div class="g2">' + (conf.length ? caixa('As análises de fora, conferidas', '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">A</th><th scope="col" class="n">B</th><th scope="col" class="n">C</th><th scope="col" class="n">Ninguém viu</th></tr></thead><tbody>' + confRows + '</tbody></table></div>' +
      nota('Itens que o CONFRONTO.md registra como desmentidos ou esclarecidos pelo texto oficial, por análise, e os achados que nenhuma das três viu. Média: ' + esc(iaTxt.join('; ')) + '. Análise mais longa faz mais afirmações, então o número não é taxa de erro. Concordância entre IAs não prova nada; o texto da carta decide.'), '', pl(conf.length, 'deck', 'decks')) : '') +
    caixa('Frescor dos dados', '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Deck</th><th scope="col" class="n">Avaliação</th><th scope="col" class="n">Comunidade</th><th scope="col">Versão</th><th scope="col" class="n">Potenciais</th></tr></thead><tbody>' + fr + '</tbody></table></div>' +
      nota('Avaliação com mais de 90 dias pede um /auditar; comunidade com mais de 30, o /potenciais. Potenciais: cartas da comunidade ainda sem triagem.'), '', '') + '</div>';
  return secao('auditoria', 'Auditoria da avaliação', 'Coerência interna, calibração, as análises de fora e a idade de cada fonte.', h);
}

/* ============ 9. compartilhadas ============ */
function secComp() {
  var m = {};
  DK.forEach(function (d) { d.a.cards.forEach(function (c) { var k = chave(c); if (BAS[k]) return; (m[k] = m[k] || []).push({ A: d.a, c: c }); }); });
  var cs = Object.keys(m).filter(function (k) { return m[k].length >= 2; }).map(function (k) {
    var v = m[k], rels = {}; v.forEach(function (x) { rels[x.c.r] = 1; });
    return { k: k, v: v, div: Object.keys(rels).length > 1 && rels.BAX };
  }).sort(function (a, b) { return b.v.length - a.v.length || a.k.localeCompare(b.k); });
  var extra = soma(cs, function (x) { return x.v.length - 1; });
  var rows = mais('comp', cs, 12, function (x) {
    return '<tr><td>' + esc(x.k) + (x.div ? ' ' + pill('info', 'berlinda num deck') : '') + '</td><td class="n num">' + x.v.length + '</td><td><div class="chips">' + x.v.map(function (y) {
      return '<span data-tip="' + esc(y.A.nome + ': tier ' + y.c.T + ', ' + RELN[y.c.r].toLowerCase()) + '" class="ch-' + y.c.r + '">' + esc(y.A.nome) + ' ' + esc(y.c.T) +
        '<span class="sr">, tier ' + esc(y.c.T) + ', ' + esc(RELN[y.c.r]) + '</span></span>';
    }).join('') + '</div></td></tr>';
  }, 4);
  var rad = {}; DK.forEach(function (d) { d.a.cands.forEach(function (c) { if (c.v === 'fora') return; (rad[chave(c)] = rad[chave(c)] || []).push({ A: d.a, c: c }); }); });
  var dem = Object.keys(rad).filter(function (k) { return rad[k].length >= 2; }).map(function (k) { return '<li><b>' + esc(k) + '</b>: ' + esc(lista(rad[k].map(function (y) { return y.A.nome + ' (' + (y.c.v === 'entra' ? 'entra' : 'avaliar') + ')'; }))) + '.</li>'; });
  var ja = Object.keys(rad).filter(function (k) { return m[k]; }).map(function (k) {
    var onde = m[k].map(function (y) { return y.A.nome; });
    return '<li><b>' + esc(k) + '</b>, no radar ' + esc(lista(rad[k].map(function (y) { return 'do ' + y.A.nome; }))) + ', já está ' + esc(onde.length > 1 ? 'em ' + lista(onde) : 'no ' + onde[0]) + '.</li>';
  });
  var pas = H.em_pastas || {}, temPastas = Object.keys(pas).length > 0;
  function ch(c) { return String(c.o || c.n).split(' // ')[0].trim().toLowerCase(); }
  var radarEmPasta = [];
  DK.forEach(function (d) { d.a.cands.forEach(function (c) { if (c.v === 'fora') return; var p = pas[ch(c)]; if (p) radarEmPasta.push({ A: d.a, c: c, p: p }); }); });
  var pastasBox = temPastas
    ? (radarEmPasta.length ? '<ul class="lst">' + radarEmPasta.map(function (x) {
        return '<li><b>' + esc(x.c.n) + '</b>, no radar do ' + esc(x.A.nome) + ' (' + esc(x.c.v === 'entra' ? 'entra' : 'avaliar') + '), já está em ' + esc(lista(x.p.map(function (q) { return q.p + ' ×' + q.q; }))) + '. Dá para pegar de lá em vez de comprar.</li>';
      }).join('') + '</ul>' : '<p class="hint">Nenhuma carta dos radares está nas pastas.</p>')
    : '<p class="hint">As listas das pastas ainda não chegaram. Quando chegarem (em <code>dados/pastas/</code>), esta caixa mostra o que o radar pede e você já tem.</p>';
  var h = '<div class="g2">' + caixa('Cartas em mais de um deck', '<p class="dest">' + pl(cs.length, 'carta aparece', 'cartas aparecem') + ' em dois ou mais decks: para jogar com todos montados, são <b>' + extra + ' cópias a mais</b>.</p>' +
      '<div class="tw"><table class="tbl"><thead><tr><th scope="col">Carta</th><th scope="col" class="n">Decks</th><th scope="col">Onde</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      nota('Terrenos básicos não contam. A cor do nome mostra a relevância da carta em cada deck; passe o mouse para ver tier e relevância.'), '', pl(cs.length, 'carta', 'cartas') + ', ' + pl(extra, 'cópia a mais', 'cópias a mais')) +
    '<div>' + caixa('O radar entre os decks', (dem.length ? '<h4>Pedida em mais de um deck</h4><ul class="lst">' + dem.join('') + '</ul>' : '') + (ja.length ? '<h4>Já existe em outro deck</h4><ul class="lst">' + ja.join('') + '</ul>' : '') +
      nota('Antes de comprar: a carta pode estar parada em outro deck. Se for a mesma cópia, ela sai de lá. A leitura carta a carta, com o tier de cada lugar, está logo acima, em Movimentações.'), '', pl(dem.length, 'pedida em mais de um deck', 'pedidas em mais de um deck')) +
    caixa('O radar contra as pastas', pastasBox, 'larga', temPastas ? '' : 'à espera das listas') + '</div></div>';
  return secao('compartilhadas', 'Cópias entre decks', 'As cartas que aparecem em mais de um deck: quantas cópias a mais para jogar com todos montados.', h);
}

/* ============ 10. carteira e o álbum das cores ============ */
/* Nomes, perfis, mecânicas e outros nomes de cada combinação: Draftsim, "All 26 Color Combinations of Magic" (Ethan Rodgers,
   atualizado em 30/09/2026), em resumo nosso. As cinco cores puras são resumo nosso da roda das cores; o incolor vem da Draftsim.
   f: o tipo da combinação (aliadas ou inimigas, vizinhas ou em cunha). Agrupadas só pelo número de cores, a pedido do dono. */
var ALBUM = [
  { g: 'Uma cor', d: 'As cinco cores do Magic, e o incolor.', cs: [
    { k: 'W', n: 'Mono-branco', f: 'uma cor', p: 'Ordem e comunidade: proteção, vida e limpeza de mesa.' },
    { k: 'U', n: 'Mono-azul', f: 'uma cor', p: 'Conhecimento: anular, comprar, devolver.' },
    { k: 'B', n: 'Mono-preto', f: 'uma cor', p: 'Poder a qualquer preço: destruir e reanimar.' },
    { k: 'R', n: 'Mono-vermelho', f: 'uma cor', p: 'Liberdade e impulso: dano direto e ataque.' },
    { k: 'G', n: 'Mono-verde', f: 'uma cor', p: 'Natureza: criaturas grandes, fichas e ramp.' },
    { k: '-', n: 'Incolor', f: 'sem cor', p: 'Só artefatos, mana phyrexiana ou Eldrazi; o terreno da casa é o Wastes.' }] },
  { g: 'Duas cores', d: 'As dez duplas: cinco de cores vizinhas na roda (aliadas) e cinco de cores opostas (inimigas).', cs: [
    { k: 'WU', n: 'Azorius', f: 'duas cores aliadas', al: 1, p: 'A lei: evasão e prevenção.', m: 'flying, flicker, detain, addendum', alt: ['Guidelight Voyagers (Aetherdrift)'] },
    { k: 'UB', n: 'Dimir', f: 'duas cores aliadas', al: 1, p: 'Segredo, manipulação e contraespionagem.', m: 'mill, surveil, looting, deathtouch', alt: ['Speed Demons (Aetherdrift)'] },
    { k: 'BR', n: 'Rakdos', f: 'duas cores aliadas', al: 1, p: 'Destruição e excesso: queimar e sacrificar.', m: 'spectacle, menace, compra por impulso', alt: ['Endriders (Aetherdrift)'] },
    { k: 'RG', n: 'Gruul', f: 'duas cores aliadas', al: 1, p: 'A natureza agressiva contra a cidade.', m: 'riot, trample, landfall', alt: ['Goblin Rocketeers (Aetherdrift)'] },
    { k: 'WG', n: 'Selesnya', f: 'duas cores aliadas', al: 1, p: 'Harmonia: fichas e encantamentos.', m: 'populate, convoke, tokens', alt: ['Alacrian Quickbeasts (Aetherdrift)'] },
    { k: 'WB', n: 'Orzhov', f: 'duas cores inimigas', p: 'Taxa e extorsão: a vida como moeda.', m: 'lifelink, extort, afterlife', alt: ['Silverquill (Strixhaven)', 'Champions of Amonkhet (Aetherdrift)'] },
    { k: 'UR', n: 'Izzet', f: 'duas cores inimigas', p: 'Experimentos: mágicas que mexem na mesa.', m: 'overload, jump-start, haste, cópias', alt: ['Prismari (Strixhaven)', 'Keelhaulers (Aetherdrift)'] },
    { k: 'BG', n: 'Golgari', f: 'duas cores inimigas', p: 'Vida e morte: cemitério e crescimento.', m: 'dredge, scavenge, undergrowth, self-mill', alt: ['Witherbloom (Strixhaven)', 'Speedbrood (Aetherdrift)'] },
    { k: 'WR', n: 'Boros', f: 'duas cores inimigas', p: 'O exército disciplinado: números e combate.', m: 'equipment, mentor, battalion, tokens', alt: ['Lorehold (Strixhaven)', 'Cloudspire Racing (Aetherdrift)'] },
    { k: 'UG', n: 'Simic', f: 'duas cores inimigas', p: 'Adaptação: ramp, compra e evolução.', m: 'landfall, adapt, evolve, graft', alt: ['Quandrix (Strixhaven)', 'Aether Rangers (Aetherdrift)'] }] },
  { g: 'Três cores', d: 'As dez trincas: cinco com uma cor e as duas vizinhas, cinco com uma cor e as duas opostas.', cs: [
    { k: 'WUG', n: 'Bant', f: 'três cores vizinhas', p: 'Nobreza: encantamentos que dão voo e travam.', alt: ['Brokers (Capenna)'] },
    { k: 'WUB', n: 'Esper', f: 'três cores vizinhas', p: 'Controle e ordem: artefatos e artífices.', alt: ['Obscura (Capenna)'] },
    { k: 'UBR', n: 'Grixis', f: 'três cores vizinhas', p: 'Morte e mortos-vivos: gatilhos, taxa e queima.', alt: ['Maestros (Capenna)'] },
    { k: 'BRG', n: 'Jund', f: 'três cores vizinhas', p: 'Comer ou ser comido: agressão, sacrifício e ramp.', alt: ['Riveteers (Capenna)'] },
    { k: 'WRG', n: 'Naya', f: 'três cores vizinhas', p: 'Colossos: os pequenos seguram até os grandes chegarem.', alt: ['Cabaretti (Capenna)'] },
    { k: 'WBG', n: 'Abzan', f: 'três cores em cunha', p: 'Resistência: perdurar, reanimar e ganhar vida.', m: 'outlast, bolster', alt: ['Indatha (Ikoria)', 'Teneb (Planar Chaos)', 'Necra (Apocalypse)', 'Junk'] },
    { k: 'WUR', n: 'Jeskai', f: 'três cores em cunha', p: 'Astúcia: prowess, anulações e queima.', m: 'prowess', alt: ['Raugrin (Ikoria)', 'Numot (Planar Chaos)', 'Raka (Apocalypse)', 'USA'] },
    { k: 'UBG', n: 'Sultai', f: 'três cores em cunha', p: 'Crueldade: o cemitério como recurso.', m: 'delve, self-mill', alt: ['Zagoth (Ikoria)', 'Vorosh (Planar Chaos)', 'Ana (Apocalypse)', 'BUG'] },
    { k: 'WBR', n: 'Mardu', f: 'três cores em cunha', p: 'Velocidade: atacar antes de todos.', m: 'raid, dash', alt: ['Savai (Ikoria)', 'Oros (Planar Chaos)', 'Dega (Apocalypse)', 'Rorzhov'] },
    { k: 'URG', n: 'Temur', f: 'três cores em cunha', p: 'Selvageria: criaturas grandes e cópias.', m: 'cópias de mágica, saque', alt: ['Ketria (Ikoria)', 'Intet (Planar Chaos)', 'Ceta (Apocalypse)', 'RUG'] }] },
  { g: 'Quatro cores', d: 'Cada combinação deixa uma cor de fora.', cs: [
    { k: 'UBRG', n: 'Glint', f: 'quatro cores', p: 'Tudo, menos o branco.', alt: ['Glint-Eye'] },
    { k: 'WBRG', n: 'Dune', f: 'quatro cores', p: 'Tudo, menos o azul.', alt: ['Dune-Brood'] },
    { k: 'WURG', n: 'Ink', f: 'quatro cores', p: 'Tudo, menos o preto.', alt: ['Ink-Treader'] },
    { k: 'WUBG', n: 'Witch', f: 'quatro cores', p: 'Tudo, menos o vermelho.', alt: ['Witch-Maw'] },
    { k: 'WUBR', n: 'Yore', f: 'quatro cores', p: 'Tudo, menos o verde.', alt: ['Yore-Tiller'] }] },
  { g: 'Cinco cores', d: 'Todas as cores de uma vez.', cs: [
    { k: 'WUBRG', n: 'WUBRG', f: 'cinco cores', p: 'Quase tudo ao alcance, se a base de mana deixar.', x: 'É a que mais pede pedras de mana e terrenos de todas as cores.', alt: ['Arco-íris'] }] }
];
function perfil(c) {
  return c.p + (c.x ? ' ' + c.x : '') + (c.m ? ' Mecânicas: ' + c.m + '.' : '') + (c.alt && c.alt.length ? ' Outros nomes: ' + lista(c.alt) + '.' : '');
}
function rotuloCor(k) { return k === '-' ? 'incolor' : k.split('').map(function (ch) { return NOMEC[ch].toLowerCase(); }).join(', ').replace(/, ([^,]+)$/, ' e $1'); }
/* A cara da carteira: as cores mais jogadas, somando todos os decks, viram a combinação que a carteira seria se fosse um deck.
   Três cores quando a terceira aparece em pelo menos metade dos decks da segunda; senão, a dupla das duas primeiras. */
function caraDaCarteira(cnt, por) {
  var ord = WUBRG.slice().sort(function (a, b) { return cnt[b] - cnt[a] || WUBRG.indexOf(a) - WUBRG.indexOf(b); });
  if (!cnt[ord[0]]) return '';
  var top = cnt[ord[2]] && cnt[ord[2]] >= cnt[ord[1]] / 2 ? ord.slice(0, 3) : cnt[ord[1]] ? ord.slice(0, 2) : ord.slice(0, 1);
  var k = WUBRG.filter(function (ch) { return top.indexOf(ch) >= 0; }).join(''), c = null;
  ALBUM.forEach(function (p) { p.cs.forEach(function (x) { if (x.k === k) c = x; }); });
  if (!c) return '';
  var ds = por[k] || [], cores = top.map(function (ch) { return NOMEC[ch].toLowerCase() + ' (' + cnt[ch] + ')'; });
  var vezes = ['', 'uma vez', 'duas vezes', 'três vezes', 'quatro vezes', 'cinco vezes'][ds.length] || ds.length + ' vezes';
  return '<div class="cara"><span class="fig-m">' + manaTxt(k) + '</span><p><b>A cara da carteira: ' + esc(c.n) + '.</b> Somando as cores de todos os decks, ' +
    esc(lista(cores)) + ' vêm na frente. Se a carteira fosse um deck, seria ' + esc(c.n) + ' (' + esc(c.f) + '). ' + esc(c.p) + ' ' +
    (ds.length ? 'E essa figurinha você já tem ' + vezes + ': ' + esc(lista(ds.map(function (d) { return d.nome; }))) + '.' : 'E é justamente uma figurinha que falta no álbum.') + '</p></div>';
}
function coresDeck(d) { return d.cores ? d.cores : (d.painel ? '-' : ''); }
function album() {
  var por = {}, cnt = { W: 0, U: 0, B: 0, R: 0, G: 0 }, conhecidos = 0;
  H.decks.forEach(function (d) {
    var k = coresDeck(d); if (!k) return;
    conhecidos++; (por[k] = por[k] || []).push(d);
    k.split('').forEach(function (ch) { if (cnt[ch] != null) cnt[ch]++; });
  });
  var todas = []; ALBUM.forEach(function (p) { p.cs.forEach(function (c) { todas.push(c); }); });
  var tem = todas.filter(function (c) { return por[c.k]; }), rep = todas.filter(function (c) { return por[c.k] && por[c.k].length > 1; });
  var falta = todas.filter(function (c) { return !por[c.k] && c.k !== '-'; });
  var sug = falta.map(function (c) {
    var s = soma(c.k.split(''), function (ch) { return 1 / Math.max(1, cnt[ch]); }) / c.k.length;
    return { c: c, s: s };
  }).sort(function (a, b) { return b.s - a.s || a.c.k.length - b.c.k.length; }).slice(0, 3);
  var raras = WUBRG.slice().sort(function (a, b) { return cnt[a] - cnt[b]; });
  var n = 0;
  var pags = ALBUM.map(function (p) {
    var dentro = p.cs.filter(function (c) { return por[c.k]; }).length;
    return '<div class="pag"><div class="pag-h"><h4>' + esc(p.g) + '</h4><span class="num">' + dentro + ' de ' + p.cs.length + '</span><p>' + esc(p.d) + '</p></div><div class="figs">' + p.cs.map(function (c) {
      n++;
      var ds = por[c.k] || [], capa = null;
      ds.forEach(function (d) { if (!capa && d.capa) capa = d.capa; });
      var tip = c.n + (c.f === 'uma cor' ? '. ' : ' (' + rotuloCor(c.k) + '; ' + c.f + '). ') + perfil(c) + (ds.length ? ' Seus decks: ' + lista(ds.map(function (d) { return d.nome; })) + '.' : ' Você ainda não tem.');
      return '<article class="fig' + (ds.length ? ' tem' : ' falta') + (c.al ? ' aliada' : '') + '" data-tip="' + esc(tip) + '">' +
        (ds.length && capa ? '<img src="' + capa + '" alt="" loading="lazy">' : '') + '<span class="fig-n num">' + (n < 10 ? '0' : '') + n + '</span>' +
        (ds.length > 1 ? '<span class="rep">×' + ds.length + '</span>' : '') + '<div class="fig-c"><span class="fig-m">' + manaTxt(c.k === '-' ? '' : c.k) + '</span><h5>' + esc(c.n) + '</h5>' +
        (ds.length ? '<p class="fig-d">' + ds.map(function (d) { return d.painel ? '<a href="' + esc(d.href) + '">' + esc(d.nome) + '</a>' : esc(d.nome); }).join(', ') + '</p><span class="sr">' + esc(perfil(c)) + '</span>' : '<p class="fig-p">' + esc(c.p) + '</p>') +
        '</div>' + (ds.length ? '' : '<span class="carimbo" aria-hidden="true">falta</span>') + '</article>';
    }).join('') + '</div></div>';
  }).join('');
  /* a mesma coisa em lista: tenho ou não tenho, combinação por combinação, com o perfil e os outros nomes */
  var m = 0;
  var linhas = ALBUM.map(function (p) {
    return p.cs.map(function (c) {
      m++;
      var ds = por[c.k] || [];
      return '<tr class="' + (ds.length ? 'tem' : 'falta') + '"><td class="n num">' + (m < 10 ? '0' : '') + m + '</td>' +
        '<th scope="row">' + esc(c.n) + '<small>' + esc(c.f) + '</small><span class="cm-m">' + manaTxt(c.k === '-' ? '' : c.k) + '</span></th><td class="cm">' + manaTxt(c.k === '-' ? '' : c.k) + '</td>' +
        '<td>' + (ds.length ? pill('ok', 'tenho' + (ds.length > 1 ? ' ×' + ds.length : ''), '✓') + '<small class="dk">' + ds.map(function (d) { return d.painel ? '<a href="' + esc(d.href) + '">' + esc(d.nome) + '</a>' : esc(d.nome); }).join(', ') + '</small>' : pill('bad', 'falta', '✕')) + '</td>' +
        '<td class="pf">' + esc(perfil(c)) + '</td></tr>';
    }).join('');
  }).join('');
  var conferencia = '<details class="alb-lista"><summary>Ver o álbum como lista: tenho ou não tenho, combinação por combinação</summary><div class="tw"><table class="tbl">' +
    '<thead><tr><th scope="col" class="n">Nº</th><th scope="col">Combinação</th><th scope="col">Cores</th><th scope="col">Na carteira</th><th scope="col">Perfil, mecânicas e outros nomes</th></tr></thead><tbody>' + linhas + '</tbody></table></div></details>';
  var resumo = '<div class="alb-h"><div class="alb-n"><b class="num">' + tem.length + '</b><span>de ' + todas.length + ' figurinhas coladas</span></div>' +
    '<span class="meter grande" aria-hidden="true"><i style="width:' + (tem.length / todas.length * 100).toFixed(1) + '%"></i></span>' +
    '<p>Faltam ' + (todas.length - tem.length) + '. Repetidas: ' + esc(lista(rep.map(function (c) { return c.n + ' ×' + por[c.k].length; }))) + '.</p>' +
    '<p>As cores que você menos joga: ' + esc(lista(raras.slice(0, 2).map(function (ch) { return NOMEC[ch].toLowerCase() + ' (' + pl(cnt[ch], 'deck', 'decks') + ')'; }))) + '. ' +
    'Para equilibrar a carteira, as figurinhas que mais faltam são ' + esc(lista(sug.map(function (x) { return x.c.n; }))) + '.</p></div>' + caraDaCarteira(cnt, por);
  var prog = '<div class="pags">' + ALBUM.map(function (p) {
    var dentro = p.cs.filter(function (c) { return por[c.k]; }).length;
    return '<div class="barra"><span>' + esc(p.g) + '</span><span class="t"><i style="width:' + (dentro / p.cs.length * 100).toFixed(1) + '%"></i></span><b class="num">' + dentro + ' de ' + p.cs.length + '</b></div>';
  }).join('') + '</div>';
  return { h: resumo + roda(por, cnt, prog) + '<div class="album">' + pags + '</div>' + conferencia, tem: tem.length, todas: todas.length };
}
function roda(por, cnt, prog) {
  var R = 104, cx = 170, cy = 164, ang = { W: -90, U: -18, B: 54, R: 126, G: 198 }, P = {};
  WUBRG.forEach(function (ch) { var a = ang[ch] * Math.PI / 180; P[ch] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
  var pares = [['W', 'U', 'Azorius'], ['U', 'B', 'Dimir'], ['B', 'R', 'Rakdos'], ['R', 'G', 'Gruul'], ['G', 'W', 'Selesnya'],
               ['W', 'B', 'Orzhov'], ['U', 'R', 'Izzet'], ['B', 'G', 'Golgari'], ['R', 'W', 'Boros'], ['G', 'U', 'Simic']];
  var ord = function (a, b) { return WUBRG.filter(function (ch) { return ch === a || ch === b; }).join(''); };
  var linhas = pares.map(function (p) {
    var ds = por[ord(p[0], p[1])] || [], a = P[p[0]], b = P[p[1]];
    return '<g data-tip="' + esc(p[2] + ': ' + (ds.length ? lista(ds.map(function (d) { return d.nome; })) : 'nenhum deck')) + '"><line class="hitl" x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '"/>' +
      '<line class="' + (ds.length ? 'gld' : 'gld vazia') + '" style="stroke-width:' + (ds.length ? 3 + 2.5 * (ds.length - 1) : 1) + '" x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '"/></g>';
  }).join('');
  var nos = WUBRG.map(function (ch) {
    var p = P[ch], r = 15 + Math.sqrt(cnt[ch]) * 3.2, lado = Math.cos(ang[ch] * Math.PI / 180), lx, ly, an = 'middle';
    if (lado > 0.5) { lx = p.x + r + 6; ly = p.y + 4; an = 'start'; }
    else if (lado < -0.5) { lx = p.x - r - 6; ly = p.y + 4; an = 'end'; }
    else if (p.y < cy) { lx = p.x; ly = p.y - r - 7; }
    else { lx = p.x; ly = p.y + r + 15; }
    return '<g data-tip="' + esc(NOMEC[ch] + ': em ' + pl(cnt[ch], 'deck', 'decks')) + '"><circle class="no" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + r.toFixed(1) + '" style="fill:' + MANA[ch] + '"/>' +
      '<text class="no-t" x="' + p.x.toFixed(1) + '" y="' + (p.y + 5).toFixed(1) + '" text-anchor="middle">' + cnt[ch] + '</text>' +
      '<text class="no-l" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="' + an + '">' + NOMEC[ch] + '</text></g>';
  }).join('');
  var g2 = pares.filter(function (p) { return por[ord(p[0], p[1])]; }).length;
  return '<div class="roda"><svg viewBox="0 0 340 320" role="img" aria-label="Roda das cores: ' + g2 + ' de 10 duplas na carteira">' + linhas + nos + '</svg>' +
    '<div class="roda-t"><p><b>A roda das cores.</b> Cada círculo é uma cor, do tamanho de quantos decks a usam. Cada linha é uma dupla de cores: grossa quando você tem o deck, fina quando falta. As do contorno são as aliadas; as da estrela, as inimigas.</p>' +
    '<p class="num"><b>' + g2 + ' de 10</b> duplas na carteira. Faltam ' + esc(lista(pares.filter(function (p) { return !por[ord(p[0], p[1])]; }).map(function (p) { return p[2]; }))) + '.</p>' + (prog || '') + '</div></div>';
}
function secCarteira() {
  var comCor = H.decks.filter(function (d) { return d.cores; }), semCor = H.decks.length - comCor.length;
  var porCor = WUBRG.map(function (k) {
    return { r: '<i class="ms ms-' + k + '" style="width:18px;height:18px;font-size:10px;margin-right:6px;vertical-align:-3px">' + k + '</i>' + NOMEC[k], v: comCor.filter(function (d) { return d.cores.indexOf(k) >= 0; }).length, c: MANA[k] };
  });
  var nomesN = ['', 'Uma cor', 'Duas cores', 'Três cores', 'Quatro cores', 'Cinco cores'];
  var porQtd = [1, 2, 3, 4, 5].map(function (n) { return { r: nomesN[n], v: comCor.filter(function (d) { return d.cores.length === n; }).length }; }).filter(function (x) { return x.v; });
  var maxCor = Math.max.apply(null, porCor.map(function (x) { return x.v; }).concat(porQtd.map(function (x) { return x.v; })));
  var cri = DK.map(function (d) { return { r: esc(d.nome), v: (d.tipos && d.tipos.cri) || 0 }; }).sort(function (a, b) { return b.v - a.v; });
  var tot = H.decks.length, capa = H.decks.filter(function (d) { return d.capa; }).length, listaN = H.decks.filter(function (d) { return d.lista; }).length;
  var fun = [{ r: 'No inventário', v: tot }, { r: 'Com capa', v: capa }, { r: 'Com lista', v: listaN }, { r: 'Com painel', v: DK.length }];
  var prox = H.decks.filter(function (d) { return !d.painel && d.prio; }).sort(function (a, b) { return a.prio - b.prio; });
  var A = album();
  var h = caixa('O álbum das combinações de cores', A.h + nota('Nomes, perfis, mecânicas e outros nomes das combinações: <a href="https://draftsim.com/mtg-color-combinations/" target="_blank" rel="noopener noreferrer">Draftsim, “All 26 Color Combinations of Magic”</a> (Ethan Rodgers, atualizado em 30/09/2026), em resumo nosso; as cinco cores puras são resumo nosso da roda das cores. ' +
      'As cores de cada deck vêm do painel ou, sem painel, do inventário. Passe o mouse numa figurinha para ver o perfil, ou abra a lista logo acima.'), 'larga album-box', 'as 32 combinações, o que tem e o que falta');
  h += '<div class="g3">' + caixa('Cores dos seus decks', barras(porCor, maxCor) + '<h4>Quantas cores cada deck usa</h4>' + barras(porQtd, maxCor) +
      nota(pl(comCor.length, 'deck', 'decks') + ' com as cores conhecidas' + (semCor ? '; ' + pl(semCor, 'ainda está', 'ainda estão') + ' sem cor no inventário' : '') + '.'), '', '') +
    caixa('Andamento da análise', barras(fun, tot) + nota((prox.length ? 'Próximos pela prioridade do inventário: ' + esc(lista(prox.map(function (d) { return d.nome; }))) + '. ' : '') + 'Um deck ganha painel com o /novo-deck, a partir da lista e das análises de fora.'), '', DK.length + ' de ' + tot + ' com painel') +
    caixa('Criaturas por deck', (cri.length ? barras(cri, Math.max.apply(null, cri.map(function (x) { return x.v; }))) : '') + nota('Conta o comandante. Só os decks que já têm painel.'), '', '') + '</div>';
  return secao('carteira', 'Carteira', 'Os ' + tot + ' decks do inventário, com ou sem painel.', h);
}

/* ============ Game Changers ============ */
/* Só o fato da carta: quais estão na lista oficial (Scryfall, is:gamechanger). O bracket estimado saiu a pedido do dono
   (14/10/2026): para ele não faz sentido. A.br.gc guarda os nomes; A.br.c2 e o resto não existem mais. */
var KIND_COMBO = { Combo: 1, 'Vitória': 1, Finalizador: 1 };   /* combos que fecham o jogo, para a ficha separar de motor */
function gcsDe(cs) { var gc = []; cs.forEach(function (c) { if (c.gc) gc.push(c.n); }); return { gc: gc }; }
DK.forEach(function (d) { d.a.br = gcsDe(d.a.cards); });

/* ============ a mão inicial ============ */
function pEQ(N, K, n, k) { return comb(K, k) * comb(N - K, n - k) / comb(N, n); }
function nCmd(A) { return soma(A.cards.filter(function (c) { return c.cm; }), function (c) { return c.q || 1; }) || 1; }
function mao(A) {
  var st = A.st, N = Math.max(8, st.n - nCmd(A)), L = st.lands + st.mdfc;
  var g = function (k) { var i = gix(A, k); return i < 0 ? null : st.grp[i].hard; };
  var r = g('ramp'), d = g('draw'), rm = g('removal'), terr = 0, k;
  for (k = 2; k <= 4; k++) terr += pEQ(N, L, 7, k);
  return { terr: terr, ramp: r == null ? null : pGE(N, r, 7, 1), compra: d == null ? null : pGE(N, d, 10, 1), rem: rm == null ? null : pGE(N, rm, 10, 1), n: { r: r, d: d, rm: rm, L: L } };
}

/* ============ peças pequenas das fichas ============ */
function svgCurva(cv, cv2) {
  var W = 236, Hh = 74, mb = 16, mt = 6, n = cv.length, bw = W / n, mx = Math.max.apply(null, cv.concat(cv2 || [])) || 1;
  var g = cv.map(function (v, i) {
    var x = i * bw, h = v / mx * (Hh - mb - mt), h2 = cv2 ? cv2[i] / mx * (Hh - mb - mt) : 0, w = cv2 ? (bw - 6) / 2 : bw - 6;
    var lbl = i === n - 1 ? n - 1 + '+' : String(i);
    return '<g data-tip="' + esc('Custo ' + lbl + ': ' + v + (cv2 ? ' contra ' + cv2[i] : '') + ' mágicas') + '"><rect class="hit" x="' + x.toFixed(1) + '" y="0" width="' + bw.toFixed(1) + '" height="' + Hh + '"/>' +
      '<rect class="cbar" x="' + (x + 3).toFixed(1) + '" y="' + (Hh - mb - h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(h, v ? 1.5 : 0).toFixed(1) + '" rx="2"/>' +
      (cv2 ? '<rect class="cbar b2" x="' + (x + 3 + w).toFixed(1) + '" y="' + (Hh - mb - h2).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(h2, cv2[i] ? 1.5 : 0).toFixed(1) + '" rx="2"/>' : '') +
      '<text class="tk" x="' + (x + bw / 2).toFixed(1) + '" y="' + (Hh - 3) + '" text-anchor="middle">' + lbl + '</text></g>';
  }).join('');
  return '<svg class="curva" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="Curva de custo das mágicas: ' + cv.join(', ') + '">' + g + '</svg>';
}
function tiposBar(A) {
  var t = A.st.tipos, tot = soma(Object.keys(t), function (k) { return t[k]; }) || 1;
  var ks = ['cri', 'art', 'enc', 'ins', 'fei', 'pw', 'bat', 'ter'].filter(function (k) { return t[k]; });
  return '<span class="stk tipos">' + ks.map(function (k) { return '<i class="tp-' + k + '" style="flex:' + t[k] + '" data-tip="' + esc(TIPOS[k] + ': ' + t[k] + ' (' + pct(t[k] / tot) + ')') + '"></i>'; }).join('') + '</span>' +
    '<p class="tipos-l">' + ks.map(function (k) { return '<span><i class="tp-' + k + '"></i>' + TIPOS[k] + ' <b class="num">' + t[k] + '</b></span>'; }).join('') + '</p>';
}
function fundMini(A) {
  return '<div class="fm">' + FUND.map(function (f) {
    var v = f.v(A); if (v == null) return '';
    var e = estadoFund(f, A, v);
    return '<div class="fm-l"><span>' + f.n + '</span><b class="num' + (e === 'warn' ? ' aviso' : '') + '">' + v + '</b>' + bullet(f, v, e, A.nome + ': ' + v + ' ' + f.n.toLowerCase() + '. Referência de ' + f.ref[0] + ' a ' + f.ref[1] + '.') + '</div>';
  }).join('') + '</div>';
}
function coresMini(A) {
  var id = A.ident.split(''); if (id.length < 2) return '';
  var pt = soma(id, function (ch) { return A.st.pip[ch]; }) || 1, ft = soma(id, function (ch) { return A.st.src[ch]; }) || 1;
  return '<div class="cbm">' + id.map(function (ch) {
    var a = A.st.pip[ch] / pt, b = A.st.src[ch] / ft;
    return '<div class="cbr" data-tip="' + esc(NOMEC[ch] + ': ' + pct(a) + ' dos símbolos de mana, ' + pct(b) + ' das fontes') + '"><span>' + manaTxt(ch) + '</span><span class="cbt"><i class="dem" style="width:' + (a * 100).toFixed(1) + '%;--c:' + MANA[ch] + '"></i><i class="ofe" style="width:' + (b * 100).toFixed(1) + '%;--c:' + MANA[ch] + '"></i></span>' +
      '<span class="num' + (a - b >= 0.1 ? ' aviso' : '') + '">' + pct(a) + ' / ' + pct(b) + '</span></div>';
  }).join('') + '</div>';
}
function combosResumo(A) {
  var fech = A.combos0.filter(function (x) { return !x.falta.length && !/armadilha/i.test(x.k.k); });
  var duros = fech.filter(function (x) { return KIND_COMBO[x.k.k]; }), motores = fech.length - duros.length;
  var um = A.combos0.filter(function (x) { return x.falta.length === 1 && !/armadilha/i.test(x.k.k); });
  return { duros: duros, motores: motores, um: um };
}

/* ============ fichas ============ */
var ficha = { ord: 'grupo', g: '' };
var ORD_F = [['grupo', 'Grupo'], ['nome', 'Nome'], ['reserva', 'Sem reserva'], ['alertas', 'Alertas']];
function fichaDe(d, i) {
  var A = d.a, st = A.st, M = mao(A), C = combosResumo(A);
  var bem = A.contra.filter(function (c) { return c.r === 'forte'; }).map(function (c) { return (ARQ.filter(function (a) { return a.k === c.k; })[0] || { n: c.k }).n; });
  var mal = A.contra.filter(function (c) { return c.r === 'fraco'; }).map(function (c) { return (ARQ.filter(function (a) { return a.k === c.k; })[0] || { n: c.k }).n; });
  var al = nAlertas(A.le), dp = A.st2.total - st.total;
  var odd = function (rot, p, tip) { return p == null ? '' : '<div class="odd" data-tip="' + esc(tip) + '"><b class="num">' + pct(p) + '</b><span>' + rot + '</span></div>'; };
  var linhaF = '<span class="fl-n"><b>' + esc(d.nome) + '</b><small>' + esc(A.painel) + '</small></span>' + cores(A.ident) +
    '<span class="fl-k"><small>pts</small><b class="num">' + numP(st.total) + '</b>' + (dp ? '<small class="num ' + (dp > 0 ? 'pos' : 'neg') + '">' + sinalP(dp) + '</small>' : '') + '</span>' +
    '<span class="fl-k"><small>CMC</small><b class="num">' + num(st.avg, 2) + '</b></span>' +
    '<span class="fl-k"><small>trocas</small><b class="num">' + A.tr.length + '</b></span>' +
    '<span class="fl-k"><small>sem reserva</small><b class="num' + (A.res.frageis.length ? ' aviso' : '') + '">' + A.res.frageis.length + '</b></span>' +
    '<span class="fl-k"><small>alertas</small><b class="num' + (al ? ' aviso' : '') + '">' + al + '</b></span>';
  var h = '<details class="fi sf" id="f-' + i + '" data-sf="fi-' + esc(d.pasta) + '" data-grupo="' + esc(d.grupo) + '"' + (SF['fi-' + d.pasta] ? ' open' : '') + '><summary class="fi-l">' + linhaF + '<i class="sf-i" aria-hidden="true"></i></summary><div class="sf-c">' +
    '<header class="fi-h"><div><h3>' + deckLink(A) + ' ' + pvB(A) + '</h3><p class="dim">' + esc(A.painel) + (A.cmd ? ' · ' + esc(A.cmd.n) : '') + '</p></div>' +
    '<div class="fi-b">' + cores(A.ident) + '</div></header>' +
    '<div class="fi-n">' +
      '<div><span>Placar</span><b class="num">' + numP(st.total) + '</b><small class="num ' + (dp > 0 ? 'pos' : dp < 0 ? 'neg' : '') + '">' + (dp ? sinalP(dp) + ' com as trocas' : 'sem trocas') + '</small></div>' +
      '<div><span>CMC médio</span><b class="num">' + num(st.avg, 2) + '</b><small class="num">' + pct(st.low / (st.nonland || 1)) + ' custam 2 ou menos</small></div>' +
      '<div><span>Reserva</span><b class="num' + (A.res.frageis.length ? ' aviso' : '') + '">' + (A.res.frageis.length ? pl(A.res.frageis.length, 'função', 'funções') : 'ok') + '</b><small class="num">' + (A.res.frageis.length ? 'sem reserva' : 'toda função tem reserva') + (A.res.nCortes ? ', ' + pl(A.res.nCortes, 'corte seguro', 'cortes seguros') : '') + '</small></div>' +
      '<div><span>Alertas</span><b class="num' + (al ? ' aviso' : '') + '">' + al + '</b><small class="num">de ' + A.le.length + ' leituras</small></div>' +
    '</div>' +
    '<div class="fi-g">' +
      '<div><h4>Curva das mágicas</h4>' + svgCurva(st.curva) + '<h4>Tipos</h4>' + tiposBar(A) + '</div>' +
      '<div><h4>Fundamentos</h4>' + fundMini(A) + '</div>' +
    '</div>' +
    '<h4>Reserva <small class="dim">função a função; passe o mouse para ver a chance</small></h4>' + resChips(A.res) + resLinhas(A.res, A) +
    '<h4>Na mão</h4><div class="odds">' +
      odd('2 a 4 terrenos na mão de 7', M.terr, M.n.L + ' fontes de terreno em ' + (st.n - nCmd(A)) + ' cartas. Mão de 7, sem mulligan.') +
      odd('ramp na mão de 7', M.ramp, M.n.r + ' cartas de ramp dedicado. Pelo menos uma na mão de 7.') +
      odd('compra até o turno 4', M.compra, M.n.d + ' cartas de compra dedicada. Pelo menos uma entre as 10 primeiras cartas (mão de 7 e três compras).') +
      odd('remoção até o turno 4', M.rem, M.n.rm + ' remoções dedicadas. Pelo menos uma entre as 10 primeiras cartas.') +
    '</div>' +
    (A.ident.length >= 2 ? '<h4>Cores: símbolos / fontes</h4>' + coresMini(A) : '') +
    '<dl class="fi-d">' +
      '<div><dt>Game Changers</dt><dd>' + (A.br.gc.length ? '<span class="chips">' + A.br.gc.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</span>' : (H.gc ? 'nenhum' : 'lista indisponível')) + '</dd></div>' +
      '<div><dt>Combos</dt><dd>' + (C.duros.length ? esc(lista(C.duros.map(function (x) { return x.k.n; }))) : 'nenhum combo fechado') + (C.motores ? ' · ' + pl(C.motores, 'motor', 'motores') : '') +
        (C.um.length ? '<br><span class="dim">A uma carta: ' + esc(lista(C.um.slice(0, 3).map(function (x) { var id = x.falta[0], c = A.idx[id]; return x.k.n + ' (falta ' + (c ? c.n : id) + (c && c.v ? ', no radar' : '') + ')'; }))) + (C.um.length > 3 ? ' e mais ' + (C.um.length - 3) : '') + '</span>' : '') + '</dd></div>' +
      '<div><dt>Mesa</dt><dd>' + (bem.length ? 'vai bem contra ' + esc(lista(bem)) : 'sem ponto forte declarado') + (mal.length ? '; vai mal contra ' + esc(lista(mal)) : '') + '</dd></div>' +
    '</dl>' +
    '<p class="fi-f"><a href="' + esc(A.href) + '">Abrir o painel</a><button class="linkish" data-act="cmp-com" data-k="' + esc(d.pasta) + '">Comparar com outro</button></p>' +
    '</div></details>';
  return h;
}
function ordFichas() {
  var idx = DK.map(function (d, i) { return { d: d, i: i }; }).filter(function (x) { return !ficha.g || x.d.grupo === ficha.g; });
  var by = {
    grupo: function (a, b) { return a.i - b.i; },
    nome: function (a, b) { return a.d.nome.localeCompare(b.d.nome); },
    reserva: function (a, b) { return b.d.a.res.frageis.length - a.d.a.res.frageis.length || b.d.a.res.falta.length - a.d.a.res.falta.length || a.i - b.i; },
    alertas: function (a, b) { return nAlertas(b.d.a.le) - nAlertas(a.d.a.le) || a.i - b.i; }
  };
  return idx.sort(by[ficha.ord]);
}
function secFichas() {
  var gs = H.grupos.filter(function (g) { return DK.some(function (d) { return d.grupo === g.k; }); });
  var ctl = '<div class="ctl"><div class="seg" role="group" aria-label="Ordem das fichas"><span class="seg-l">Ordem</span>' + ORD_F.map(function (o) {
      return '<button data-act="ficha-ord" data-k="' + o[0] + '" aria-pressed="' + (ficha.ord === o[0]) + '">' + o[1] + '</button>';
    }).join('') + '</div><div class="seg" role="group" aria-label="Grupo"><span class="seg-l">Grupo</span><button data-act="ficha-g" data-k="" aria-pressed="' + (!ficha.g) + '">Todos</button>' + gs.map(function (g) {
      return '<button data-act="ficha-g" data-k="' + esc(g.k) + '" aria-pressed="' + (ficha.g === g.k) + '">' + esc(g.n.replace(/^\d+\. /, '')) + '</button>';
    }).join('') + '</div></div>';
  var h = ctl.replace('</div></div>', '</div><span class="dk-ab"><button class="linkish" data-act="fi-abrir">Abrir todas</button><button class="linkish" data-act="fi-fechar">Fechar todas</button></span></div>') + '<div class="fis">' + ordFichas().map(function (x) { return fichaDe(x.d, x.i); }).join('') + '</div>' +
    nota('Game Changers: a lista oficial do Scryfall' + (H.gc ? ' (' + H.gc.n + ' cartas, consulta de ' + brData(H.gc.d) + ')' : ', indisponível neste build') + '. ' +
      'Na mão: probabilidade hipergeométrica, grimório sem o comandante, mão de 7 sem mulligan.');
  return secao('fichas', 'Fichas dos decks', 'Cada deck numa tela: força, custo, reserva, base, interação e a mesa. Nos decks já nos critérios, o placar se compara com os outros; nos demais, compara o deck com ele mesmo.', h);
}

/* ============ comparar dois decks ============ */
function semBas(A) { var m = {}; A.cards.forEach(function (c) { var k = chave(c); if (!BAS[k]) m[k] = c; }); return m; }
function pares() {
  var out = [];
  for (var i = 0; i < DK.length; i++) for (var j = i + 1; j < DK.length; j++) {
    var a = semBas(DK[i].a), b = semBas(DK[j].a), n = 0, u = 0, k;
    for (k in a) { u++; if (b[k]) n++; } for (k in b) if (!a[k]) u++;
    out.push({ a: DK[i], b: DK[j], n: n, j: u ? n / u : 0 });
  }
  return out.sort(function (x, y) { return y.n - x.n || y.j - x.j; });
}
var PARES = pares();
var cmp = { a: PARES.length ? PARES[0].a.pasta : '', b: PARES.length ? PARES[0].b.pasta : '' };
function porPasta(p) { for (var i = 0; i < DK.length; i++) if (DK[i].pasta === p) return DK[i]; return null; }
function secComparar() {
  if (DK.length < 2) return '';
  var da = porPasta(cmp.a) || DK[0], db = porPasta(cmp.b) || DK[1], A = da.a, B = db.a;
  var ma = semBas(A), mb = semBas(B), comum = [], soA = [], soB = [], k;
  for (k in ma) (mb[k] ? comum : soA).push(k); for (k in mb) if (!ma[k]) soB.push(k);
  var porT = function (m) { return function (x, y) { return TR[m[x].T] - TR[m[y].T] || x.localeCompare(y); }; };
  comum.sort(porT(ma)); soA.sort(porT(ma)); soB.sort(porT(mb));
  var sel = function (lado, atual) { return '<label class="cmp-s"><span class="sr">Deck ' + lado + '</span><select data-cmp="' + lado + '">' + DK.map(function (d) { return '<option value="' + esc(d.pasta) + '"' + (d.pasta === atual ? ' selected' : '') + '>' + esc(d.nome) + '</option>'; }).join('') + '</select></label>'; };
  var g = function (X, key) { var i = gix(X, key); return i < 0 ? '—' : X.st.grp[i].hard; };
  var linhas = [
    ['CMC médio', num(A.st.avg, 2), num(B.st.avg, 2)], ['Fontes de terreno', A.st.lands + A.st.mdfc, B.st.lands + B.st.mdfc],
    ['Ramp dedicado', g(A, 'ramp'), g(B, 'ramp')], ['Compra dedicada', g(A, 'draw'), g(B, 'draw')], ['Remoção', g(A, 'removal'), g(B, 'removal')], ['Em massa', A.st.wipes, B.st.wipes],
    ['Criaturas', A.st.cri, B.st.cri], ['Game Changers', A.br.gc.length, B.br.gc.length], ['Funções sem reserva', A.res.frageis.length, B.res.frageis.length], ['Cortes seguros', A.res.nCortes, B.res.nCortes], ['Alertas', nAlertas(A.le), nAlertas(B.le)]
  ];
  var chip = function (m, nome) { return function (k) { var c = m[k]; return '<span class="ch-' + c.r + '" data-tip="' + esc(nome + ': tier ' + c.T + ', ' + RELN[c.r].toLowerCase()) + '">' + esc(k) + ' ' + esc(c.T) + '</span>'; }; };
  var chipC = function (k) { var x = ma[k], y = mb[k]; return '<span data-tip="' + esc(A.nome + ': ' + x.T + ' ' + RELL[x.r] + '; ' + B.nome + ': ' + y.T + ' ' + RELL[y.r]) + '"' + (x.T !== y.T ? ' class="dif"' : '') + '>' + esc(k) + ' <small>' + x.T + '·' + y.T + '</small></span>'; };
  var h = '<div class="cmp-top">' + sel('a', da.pasta) + '<span class="vs">contra</span>' + sel('b', db.pasta) + '</div>' +
    '<div class="g2"><div class="cx"><h3>' + esc(A.nome) + ' e ' + esc(B.nome) + '</h3>' +
      '<p class="dest"><b>' + comum.length + '</b> cartas em comum, sem os básicos: ' + pct(comum.length / Math.max(1, comum.length + soA.length + soB.length)) + ' das cartas dos dois somadas.</p>' +
      '<div class="tw"><table class="tbl cmp"><thead><tr><th></th><th scope="col" class="n">' + esc(A.nome) + '</th><th scope="col" class="n">' + esc(B.nome) + '</th></tr></thead><tbody>' +
      linhas.map(function (l) { return '<tr><th scope="row">' + l[0] + '</th><td class="n num">' + l[1] + '</td><td class="n num">' + l[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<h4>Curva das mágicas</h4>' + svgCurva(A.st.curva, B.st.curva) + '<p class="legenda"><span><i class="lg-a"></i>' + esc(A.nome) + '</span><span><i class="lg-b"></i>' + esc(B.nome) + '</span></p></div>' +
    '<div class="cx"><h3>As cartas</h3><h4>Em comum (' + comum.length + ')</h4><div class="chips">' + comum.map(chipC).join('') + '</div>' +
      '<h4>Só no ' + esc(A.nome) + ' (' + soA.length + ')</h4><div class="chips">' + soA.slice(0, 24).map(chip(ma, A.nome)).join('') + (soA.length > 24 ? '<span class="dim">e mais ' + (soA.length - 24) + '</span>' : '') + '</div>' +
      '<h4>Só no ' + esc(B.nome) + ' (' + soB.length + ')</h4><div class="chips">' + soB.slice(0, 24).map(chip(mb, B.nome)).join('') + (soB.length > 24 ? '<span class="dim">e mais ' + (soB.length - 24) + '</span>' : '') + '</div>' +
      nota('Em comum: o tier no primeiro e no segundo deck; destacadas, as que mudam de tier. Só num deck: as 24 de tier mais alto. Cartas em comum disputam a mesma cópia se você não tiver duas.') + '</div></div>' +
    caixa('Os pares mais parecidos da carteira', '<ol class="pares">' + PARES.slice(0, 8).map(function (p) {
      return '<li><button class="linkish" data-act="cmp-par" data-k="' + esc(p.a.pasta) + '" data-v="' + esc(p.b.pasta) + '">' + esc(p.a.nome) + ' e ' + esc(p.b.nome) + '</button> <span class="num">' + p.n + ' em comum</span> <span class="dim num">(' + pct(p.j) + ')</span></li>';
    }).join('') + '</ol>' + nota('Sem os básicos. Par muito parecido é deck redundante na mesa e disputa de cópia física; vale saber antes de comprar a mesma carta duas vezes.'), 'larga', PARES.length ? esc(PARES[0].a.nome) + ' e ' + esc(PARES[0].b.nome) + ', ' + PARES[0].n + ' em comum' : '');
  return secao('comparar', 'Comparar dois decks', 'Lado a lado: números, curva e cartas. Comece pelos pares mais parecidos.', h);
}

/* ============ movimentações ============ */
/* Uma carta que o radar de um deck pede e que já existe em outro deck. Se ela rende mais onde é pedida (tier melhor no
   radar do que no deck onde está), a sugestão é mover; se não, é "você já tem": compre outra cópia ou aceite tirar de lá.
   O hub não sabe se as duas são a mesma cópia física: quem sabe é o dono. Comandante não sai do lugar. */
function movimentos() {
  var noDeck = {};
  DK.forEach(function (d) { d.a.cards.forEach(function (c) { var k = chave(c); if (BAS[k] || c.cm) return; (noDeck[k] = noDeck[k] || []).push({ A: d.a, c: c }); }); });
  var mova = [], ja = [], pot = [];
  DK.forEach(function (d) {
    d.a.cands.forEach(function (c) {
      if (c.v === 'fora') return;
      var k = chave(c), onde = (noDeck[k] || []).filter(function (x) { return x.A !== d.a; });
      if (!onde.length) return;
      var pior = onde.slice().sort(function (x, y) { return TR[y.c.T] - TR[x.c.T] || RELS.indexOf(y.c.r) - RELS.indexOf(x.c.r); })[0];
      var it = { k: k, para: d.a, c: c, de: pior, onde: onde, ganho: TR[pior.c.T] - TR[c.T] };
      (it.ganho > 0 ? mova : ja).push(it);
    });
    (d.a.pool || []).forEach(function (p) {
      var onde = (noDeck[p.n] || []).filter(function (x) { return x.A !== d.a; });
      if (onde.length) pot.push({ k: p.n, para: d.a, onde: onde, y: p.y });
    });
  });
  var V = { entra: 0, avaliar: 1 };
  mova.sort(function (a, b) { return b.ganho - a.ganho || V[a.c.v] - V[b.c.v] || RELS.indexOf(b.de.c.r) - RELS.indexOf(a.de.c.r) || TR[a.c.T] - TR[b.c.T] || a.k.localeCompare(b.k); });
  ja.sort(function (a, b) { return V[a.c.v] - V[b.c.v] || TR[a.c.T] - TR[b.c.T] || a.k.localeCompare(b.k); });
  pot.sort(function (a, b) { return (b.y || 0) - (a.y || 0) || a.k.localeCompare(b.k); });
  var cartas = {}; mova.concat(ja).forEach(function (x) { cartas[x.k] = 1; });
  return { mova: mova, ja: ja, pot: pot, n: Object.keys(cartas).length };
}
var MOV = movimentos();
var movF = { deck: '', so: '', modo: 'deck' };
/* ============ sub-utilizadas ============ */
/* S ou A no radar de um deck e tier pior em todos os decks onde a carta já está (critério do dono, 14/10/2026):
   antes de comprar, a carta pode sair de onde rende menos. */
var SUB = MOV.mova.filter(function (x) { return TR[x.c.T] <= 1 && x.onde.every(function (o) { return TR[o.c.T] > TR[x.c.T]; }); })
  .sort(function (a, b) { return TR[a.c.T] - TR[b.c.T] || TR[b.de.c.T] - TR[a.de.c.T] || RELS.indexOf(b.de.c.r) - RELS.indexOf(a.de.c.r) || (a.c.v === 'entra' ? 0 : 1) - (b.c.v === 'entra' ? 0 : 1) || a.k.localeCompare(b.k); });
function caixaSub() {
  var L = SUB.filter(function (x) { return (!movF.deck || x.para.pasta === movF.deck || x.onde.some(function (o) { return o.A.pasta === movF.deck; })) && (!movF.so || x.c.v === 'entra'); });
  var vd = function (v) { return '<span class="vd vd-' + v + '">' + (v === 'entra' ? 'entra' : 'avaliar') + '</span>'; };
  var rows = mais('sub', L, 12, function (x) {
    return '<tr><td><b>' + esc(x.k) + '</b></td><td><div class="pede">' + x.onde.map(function (o) { return '<span>' + deckLink(o.A) + ' ' + tierB(o.c.T) + ' ' + relB(o.c.r) + '</span>'; }).join('') + '</div></td>' +
      '<td class="c seta">→</td><td>' + deckLink(x.para) + ' ' + tierB(x.c.T) + ' ' + vd(x.c.v) + '</td></tr>';
  }, 4);
  return caixa('Sub-utilizadas: S ou A no radar, pior onde estão (' + L.length + ')', (L.length ? '<div class="tw"><table class="tbl mov"><thead><tr><th scope="col">Carta</th><th scope="col">Hoje está em</th><th></th><th scope="col">Pedida por</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="hint">Nada com esse filtro.</p>') +
    nota('A carta é S ou A no radar de um deck e tem tier pior em todos os decks onde já está. É a primeira coisa a olhar antes de comprar: mova, ou compre outra cópia. As primeiras são as que estão mais mal aproveitadas onde moram.'), 'larga sub-box');
}

/* ============ compras ============ */
/* A lista de compras mora no banco do hub publicado (coleção "compras", um documento por carta, com os decks que pedem).
   No arquivo offline não há banco: o radar aparece, a lista e o botão não. Só quem edita o hub grava. */
var COMP = { db: null, pode: false, pronto: !(window.claude && typeof window.claude.use === 'function'), docs: {}, ocupado: {}, erro: '', copiado: false };
var radF = { deck: '', tier: 'SA', v: '', tem: '' };
var ONDE = {}; DK.forEach(function (d) { d.a.cards.forEach(function (c) { var k = chave(c); if (BAS[k] || c.cm) return; (ONDE[k] = ONDE[k] || []).push({ A: d.a, c: c }); }); });
var RAD = []; DK.forEach(function (d) { d.a.cands.forEach(function (c) { if (c.v !== 'fora') RAD.push({ A: d.a, c: c }); }); });
var PEDIDOS = {}; RAD.forEach(function (x) { var k = chave(x.c); PEDIDOS[k] = (PEDIDOS[k] || 0) + 1; });
var ENC = {}; RAD.forEach(function (x) { if (x.c.en && x.c.en.length && !ENC[chave(x.c)]) ENC[chave(x.c)] = x.c; });
/* a lista de compras em oito espaços: as cinco cores, incolor e multicolorido, pela identidade de cor, e os terrenos à parte
   (qualquer identidade; a carta com terreno no verso fica na cor da frente). A cor vem do radar (cache do Scryfall, no build)
   e, se a carta saiu do radar, do que foi gravado com ela na lista. */
var ESPACOS = [['W', 'Branco'], ['U', 'Azul'], ['B', 'Preto'], ['R', 'Vermelho'], ['G', 'Verde'], ['C', 'Incolor'], ['M', 'Multicolorido'], ['L', 'Terrenos']];
var CI = {}, TER = {}; RAD.forEach(function (x) { var k = chave(x.c); if (x.c.ci != null && CI[k] == null) CI[k] = x.c.ci; if (x.c.L) TER[k] = 1; });
function corDe(n, ci, ter) { if (TER[n] || ter) return 'L'; var c = CI[n] != null ? CI[n] : ci; return c == null ? '?' : !c.length ? 'C' : c.length > 1 ? 'M' : c; }
function simbCor(k) { return k === 'M' ? '<i class="ms ms-M" aria-hidden="true"></i>' : k === '?' ? '<i class="ms ms-C" aria-hidden="true">?</i>' : k === 'L' ? '<i class="ms ms-L" aria-hidden="true">T</i>' : '<i class="ms ms-' + k + '" aria-hidden="true">' + k + '</i>'; }
function listaCompras() {
  var L = Object.keys(COMP.docs).map(function (id) { var d = COMP.docs[id]; return { id: id, n: d.n, ped: d.pedidos || [], em: d.em || '', ci: d.ci, ter: d.ter }; })
    .filter(function (x) { return x.n && x.ped.length; });
  L.forEach(function (x) { x.T = x.ped.map(function (p) { return p.T; }).sort(function (a, b) { return TR[a] - TR[b]; })[0]; x.cor = corDe(x.n, x.ci, x.ter); });
  return L.sort(function (a, b) { return TR[a.T] - TR[b.T] || b.ped.length - a.ped.length || a.n.localeCompare(b.n); });
}
function porCor(L) {
  var g = ESPACOS.concat(L.some(function (x) { return x.cor === '?'; }) ? [['?', 'Sem cor no cache']] : []);
  return g.map(function (k) { return { k: k[0], n: k[1], L: L.filter(function (x) { return x.cor === k[0]; }) }; });
}
/* 06. Compras na estante: o grupo que vem depois dos cinco do aplicativo, com a lista por cor */
function comprasEstante() {
  var L = listaCompras(), corpo, res;
  if (!COMP.pronto) { corpo = '<p class="vazio-g">Conectando à lista…</p>'; res = 'conectando'; }
  else if (!COMP.db) { corpo = '<p class="vazio-g">A lista de compras mora no hub publicado: abra o hub pelo link do claude.ai para ver as cartas por cor. Para pôr uma carta na lista, use o botão "+ Compras" no radar, no <a href="#d-radar">Dashboard, aba Compras</a>.</p>'; res = 'só no hub publicado'; }
  else if (COMP.erro) { corpo = '<p class="vazio-g">A lista não respondeu agora (' + esc(COMP.erro) + '). Recarregue a página.</p>'; res = 'sem resposta'; }
  else {
    res = pl(L.length, 'carta', 'cartas');
    corpo = '<div class="cmp7">' + porCor(L).map(function (g) {
      return '<article class="cmp-cor" data-cor="' + g.k + '"><h3>' + simbCor(g.k) + esc(g.n) + '<span class="num">' + g.L.length + '</span></h3>' +
        (g.L.length ? '<ul>' + g.L.map(function (x) {
          return '<li><b>' + esc(x.n) + '</b> ' + tierB(x.T) + '<small class="dim">' + esc(lista(x.ped.map(function (p) { return p.d; }))) + '</small></li>';
        }).join('') + '</ul>' : '<p class="dim">Nada nesta cor.</p>') + '</article>';
    }).join('') + '</div>' + nota('Cada carta fica no espaço da sua identidade de cor; terreno fica em Terrenos, com qualquer identidade, e a carta com terreno no verso fica na cor da frente. Para marcar, tirar ou copiar a lista, use o <a href="#d-compras">Dashboard, aba Compras</a>.');
  }
  var minis = COMP.db && !COMP.erro && L.length ? '<span class="cmp-m">' + porCor(L).filter(function (g) { return g.L.length; }).map(function (g) { return '<span>' + simbCor(g.k) + g.L.length + '</span>'; }).join('') + '</span>' : '';
  return '<section class="grupo" data-grupo="06">' + sanfona('g-06', '<h2>06. Compras</h2><span class="g-r">' + res + '</span>', minis, corpo, 'g-sf') + '</section>';
}
function redesenharComprasEstante() {
  var el = document.querySelector('#v-decks .grupo[data-grupo="06"]'); if (!el) return;
  var t = document.createElement('div'); t.innerHTML = comprasEstante(); el.parentNode.replaceChild(t.firstChild, el);
}
function slugC(n) { return semAcento(n).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180) || 'carta'; }
function pastaDe(n) { var p = (H.em_pastas || {})[String(n).split(' // ')[0].trim().toLowerCase()]; return p && p.length ? p : null; }
function hojeISO() { var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
function funcaoDe(A, c) { var k = pkDe(A, c), i = gix(A, k); return i >= 0 ? A.grupos[i].n : k === 'mana' ? 'Mana' : ''; }
function naLista(A, c) { var d = COMP.docs[slugC(chave(c))]; return !!(d && (d.pedidos || []).some(function (p) { return p.p === A.pasta; })); }
function jaTem(k, A) { return (ONDE[k] || []).filter(function (o) { return o.A !== A; }); }
function temTxt(onde) { return onde.map(function (o) { return '<span>' + esc(o.A.nome) + ' ' + tierB(o.c.T) + '</span>'; }).join(''); }
function secCompras() {
  var L = listaCompras();
  var corpo;
  if (!COMP.pronto) corpo = '<p class="hint">Conectando à lista…</p>';
  else if (!COMP.db) corpo = '<p class="hint">A lista de compras mora no hub publicado. Abra o hub pelo link do claude.ai para ver, marcar e tirar cartas; aqui, sem internet, o radar abaixo continua valendo.</p>';
  else if (COMP.erro) corpo = '<p class="hint">A lista não respondeu agora (' + esc(COMP.erro) + '). Recarregue a página.</p>';
  else if (!L.length) corpo = '<p class="hint">Lista vazia. Marque cartas no radar logo abaixo, com o botão "+ Compras".</p>';
  else corpo = porCor(L).filter(function (g) { return g.L.length; }).map(function (g) { return '<h4 class="cl-cor">' + simbCor(g.k) + esc(g.n) + ' <span class="dim">' + g.L.length + '</span></h4><ul class="cl">' + g.L.map(function (x) {
      var tem = jaTem(x.n, null), pas = pastaDe(x.n);
      return '<li><div class="cl-n"><b>' + esc(x.n) + '</b> ' + tierB(x.T) + (x.em ? '<small class="dim">desde ' + brData(x.em) + '</small>' : '') + '</div>' +
        '<div class="cl-p"><span class="dim">pedida por</span> ' + x.ped.map(function (p) { return '<span class="cl-d">' + esc(p.d) + ' ' + tierB(p.T) + '</span>'; }).join('') + '</div>' +
        (ENC[x.n] ? '<div class="cl-a"><span class="dim">rende mais em</span> ' + encTxt(ENC[x.n]) + '</div>' : '') +
        (tem.length ? '<div class="cl-a">' + pill('warn', 'você já tem', '!') + ' <span class="tem">' + temTxt(tem) + '</span></div>' : '') +
        (pas ? '<div class="cl-a">' + pill('ok', 'na pasta', '✓') + ' ' + esc(lista(pas.map(function (q) { return q.p + ' ×' + q.q; }))) + '</div>' : '') +
        (COMP.pode ? '<button class="linkish cl-x" data-act="comp-tirar" data-k="' + esc(x.id) + '"' + (COMP.ocupado[x.id] ? ' disabled' : '') + '>Tirar</button>' : '') + '</li>';
    }).join('') + '</ul>'; }).join('');
  var topo = COMP.db && L.length ? '<div class="ctl"><button class="bt" data-act="comp-copiar">' + (COMP.copiado ? 'Copiada ✓' : 'Copiar a lista') + '</button><span class="dim">uma carta por linha, "1 Nome", para colar na loja ou na wishlist</span></div>' : '';
  return secao('compras', 'Lista de compras', 'O que você marcou no radar dos decks para comprar ou trocar quando tiver chance, por identidade de cor, com os terrenos à parte (a mesma lista aparece na estante, no grupo 06. Compras). Uma carta pedida por mais de um deck aparece uma vez só.',
    caixa('', topo + corpo + nota('"Rende mais em": o deck onde a carta mais soma no placar dos critérios, com quem sairia (só os decks já nos critérios). "Você já tem": a carta está na lista de outro deck; veja se não vale mover em vez de comprar. "Na pasta": está numa das suas pastas (quando as listas chegarem). A lista fica no hub publicado e acompanha você no celular.'), 'larga'));
}
/* encaixe da carta nos decks já nos critérios (motor/encaixe.py): o melhor deck, o ganho e quem sairia */
function encTxt(c) {
  var L = c.en; if (!L || !L.length) return '<span class="dim" title="A carta ainda não tem cadastro nos critérios, ou não cabe nas cores de nenhum deck migrado">—</span>';
  return L.slice(0, 2).map(function (e, i) {
    var dk = porPasta(e[0]), nome = dk ? dk.nome : e[0];
    return (i ? '<small class="dim">' : '<span>') + esc(nome) + ' <b class="num ' + (e[1] > 0 ? 'pos' : e[1] < 0 ? 'neg' : '') + '">' + sinalP(e[1]) + '</b>' +
      (e[3] ? ' <span class="dim">já está</span>' : e[2] ? ' <span class="dim">sai ' + esc(e[2]) + '</span>' : '') + (e[4] ? '' : ' <span class="aviso" title="sinergia a avaliar">*</span>') + (i ? '</small>' : '</span>');
  }).join('');
}
function secRadar() {
  var V = { entra: 0, avaliar: 1 };
  var L = RAD.filter(function (x) {
    var k = chave(x.c), tem = jaTem(k, x.A).length > 0;
    return (!radF.deck || x.A.pasta === radF.deck) && (radF.tier !== 'SA' || TR[x.c.T] <= 1) && (!radF.v || x.c.v === radF.v) && (!radF.tem || (radF.tem === 'sim') === tem);
  }).sort(function (a, b) { return TR[a.c.T] - TR[b.c.T] || V[a.c.v] - V[b.c.v] || (PEDIDOS[chave(b.c)] || 0) - (PEDIDOS[chave(a.c)] || 0) || chave(a.c).localeCompare(chave(b.c)) || a.A.nome.localeCompare(b.A.nome); });
  var seg = function (rot, campo, ops) { return '<div class="seg" role="group" aria-label="' + rot + '"><span class="seg-l">' + rot + '</span>' + ops.map(function (o) { return '<button data-act="rad" data-k="' + campo + '" data-v="' + o[0] + '" aria-pressed="' + (radF[campo] === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>'; };
  var ctl = '<div class="ctl"><label class="cmp-s"><span class="seg-l">Deck</span><select data-rad="deck"><option value="">Todos</option>' + DK.map(function (d) { return '<option value="' + esc(d.pasta) + '"' + (radF.deck === d.pasta ? ' selected' : '') + '>' + esc(d.nome) + '</option>'; }).join('') + '</select></label>' +
    seg('Tier', 'tier', [['SA', 'S e A'], ['', 'Todos']]) + seg('Veredito', 'v', [['', 'Entra e avaliar'], ['entra', 'Entra'], ['avaliar', 'Avaliar']]) + seg('Você tem?', 'tem', [['', 'Tanto faz'], ['nao', 'Não tenho'], ['sim', 'Já tenho em outro deck']]) + '</div>';
  var bt = function (x) {
    var on = naLista(x.A, x.c), key = slugC(chave(x.c));
    if (!COMP.db || !COMP.pode) return '<span class="dim cl-off" title="' + (COMP.db ? 'Só quem edita o hub marca' : 'Só no hub publicado') + '">' + (on ? '✓ na lista' : '') + '</span>';
    return '<button class="bt-c' + (on ? ' on' : '') + '" data-act="comp" data-k="' + esc(x.A.pasta) + '" data-v="' + esc(x.c.i) + '" aria-pressed="' + on + '"' + (COMP.ocupado[key] ? ' disabled' : '') + '>' + (on ? '✓ Na lista' : '+ Compras') + '</button>';
  };
  var rows = mais('radar', L, 30, function (x) {
    var k = chave(x.c), tem = jaTem(k, x.A), pas = pastaDe(k), sai = x.c.sa ? x.A.idx[x.c.sa] : null, f = funcaoDe(x.A, x.c);
    return '<tr><td><b>' + esc(x.c.n) + '</b> ' + tierB(x.c.T) + (f ? '<small class="dim">' + esc(f) + (PEDIDOS[k] > 1 ? ' · em ' + PEDIDOS[k] + ' radares' : '') + '</small>' : '') + '</td>' +
      '<td data-l="Radar de">' + deckLink(x.A) + ' <span class="vd vd-' + x.c.v + '">' + (x.c.v === 'entra' ? 'entra' : 'avaliar') + '</span>' + (sai ? '<small class="dim">sai ' + esc(sai.n) + '</small>' : '') + '</td>' +
      '<td data-l="Rende mais em">' + encTxt(x.c) + '</td>' +
      '<td data-l="Você já tem em">' + (tem.length ? '<span class="tem">' + temTxt(tem) + '</span>' : '') + (pas ? '<small class="ok-t">na pasta ' + esc(pas[0].p) + '</small>' : '') + (!tem.length && !pas ? '<span class="dim">—</span>' : '') + '</td>' +
      '<td class="n">' + bt(x) + '</td></tr>';
  }, 4);
  return secao('radar', 'Radar de todos os decks', 'As cartas que os painéis querem pôr, num lugar só: marque as que vale comprar ou trocar.', ctl +
    caixa('', '<div class="tw"><table class="tbl rad"><thead><tr><th scope="col">Carta</th><th scope="col">Radar de</th><th scope="col">Rende mais em</th><th scope="col">Você já tem em</th><th scope="col" class="n"><span class="sr">Compras</span></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      nota(pl(L.length, 'carta', 'cartas') + ' com esse filtro. Uma carta pedida por dois decks aparece duas vezes, uma por radar; na lista de compras ela vira uma linha só. "Rende mais em": os decks já nos critérios onde a carta mais soma no placar, trocando pela carta de menor valor ("sai"); o asterisco quer dizer sinergia ainda não avaliada naquele deck. "Você já tem em": a carta está na lista de outro deck, com o tier de lá.'), 'larga'));
}
function redesenharCompras(k) { redesenharSecao(k && k.indexOf('comp-') < 0 ? k : null, 'radar'); redesenharSecao(k && k.indexOf('comp-') >= 0 ? k : null, 'compras'); redesenharComprasEstante(); }
function compToggle(pasta, id) {
  var d = porPasta(pasta), c = d && d.a.idx[id]; if (!c || !COMP.db || !COMP.pode) return;
  var key = slugC(chave(c)); if (COMP.ocupado[key]) return;
  var atual = COMP.docs[key], ped = ((atual && atual.pedidos) || []).filter(function (p) { return p.p !== pasta; });
  var tinha = !!atual && ped.length !== (atual.pedidos || []).length;
  if (!tinha) ped.push({ p: pasta, d: d.nome, T: c.T, v: c.v });
  var ref = COMP.db.collection('compras').doc(key);
  COMP.ocupado[key] = 1; redesenharCompras('[data-act="comp"][data-k="' + pasta + '"][data-v="' + id + '"]');
  var doc = { n: chave(c), pedidos: ped, em: (atual && atual.em) || hojeISO() };
  if (c.ci != null) doc.ci = c.ci;   // a identidade de cor e o tipo vão juntos, para a carta seguir no espaço certo se sair do radar
  if (c.L) doc.ter = 1;
  (ped.length ? ref.set(doc) : ref.delete())
    .then(function () { COMP.erro = ''; }, function (e) { COMP.erro = (e && e.code) || 'erro'; if (e && e.code === 'invalid_argument') COMP.pode = false; })
    .then(function () { delete COMP.ocupado[key]; redesenharCompras('[data-act="comp"][data-k="' + pasta + '"][data-v="' + id + '"]'); });
}
function compTirar(key) {
  if (!COMP.db || !COMP.pode || COMP.ocupado[key]) return;
  COMP.ocupado[key] = 1; redesenharCompras();
  COMP.db.collection('compras').doc(key).delete().then(function () { COMP.erro = ''; }, function (e) { COMP.erro = (e && e.code) || 'erro'; })
    .then(function () { delete COMP.ocupado[key]; redesenharCompras(); });
}
function compCopiar() {
  var t = Object.keys(COMP.docs).map(function (id) { return COMP.docs[id]; }).filter(function (d) { return d.n && (d.pedidos || []).length; })
    .map(function (d) { return '1 ' + d.n; }).sort().join('\n');
  var ok = function () { COMP.copiado = true; redesenharCompras('[data-act="comp-copiar"]'); setTimeout(function () { COMP.copiado = false; redesenharCompras(); }, 2500); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, function () {}); 
}
function ligarCompras() {
  if (!window.claude || typeof window.claude.use !== 'function') { COMP.pronto = true; return; }
  Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function (r) {
    COMP.db = r[0];
    if (!COMP.db) { COMP.pronto = true; redesenharCompras(); return; }
    var u = r[1];
    (u && u.canEdit ? u.canEdit() : Promise.resolve(true)).then(function (p) { COMP.pode = p !== false; redesenharCompras(); }, function () { COMP.pode = true; });
    COMP.db.collection('compras').onSnapshot(function (s) {
      var m = {}; s.docs.forEach(function (x) { if (x.exists) m[x.id] = x.data(); });
      COMP.docs = m; COMP.pronto = true; redesenharCompras();
    }, function (e) { COMP.erro = (e && e.code) || 'erro'; COMP.pronto = true; redesenharCompras(); });
  }, function () { COMP.pronto = true; redesenharCompras(); });
}

function filtraMov(L) { return L.filter(function (x) { return (!movF.deck || x.para.pasta === movF.deck || x.onde.some(function (o) { return o.A.pasta === movF.deck; })) && (!movF.so || (x.c && x.c.v === 'entra')); }); }
function ondeTxt(x, exceto) { return x.onde.filter(function (o) { return o !== exceto; }).map(function (o) { return o.A.nome + ' ' + o.c.T; }); }
function secMov() {
  var sel = '<label class="cmp-s"><span class="seg-l">Deck</span><select data-mov="deck"><option value="">Todos</option>' + DK.map(function (d) { return '<option value="' + esc(d.pasta) + '"' + (movF.deck === d.pasta ? ' selected' : '') + '>' + esc(d.nome) + '</option>'; }).join('') + '</select></label>';
  var modo = '<div class="seg" role="group" aria-label="Organização"><button data-act="mov-modo" data-k="deck" aria-pressed="' + (movF.modo === 'deck') + '">Por deck</button><button data-act="mov-modo" data-k="lista" aria-pressed="' + (movF.modo === 'lista') + '">Lista única</button></div>';
  var seg = '<div class="seg" role="group" aria-label="Veredito no radar"><button data-act="mov-so" data-k="" aria-pressed="' + (!movF.so) + '">Entra e avaliar</button><button data-act="mov-so" data-k="entra" aria-pressed="' + (movF.so === 'entra') + '">Só as que entram</button></div>';
  var mv = filtraMov(MOV.mova), ja = filtraMov(MOV.ja), pot = MOV.pot.filter(function (x) { return !movF.deck || x.para.pasta === movF.deck || x.onde.some(function (o) { return o.A.pasta === movF.deck; }); });
  var vd = function (v) { return '<span class="vd vd-' + v + '">' + (v === 'entra' ? 'entra' : 'avaliar') + '</span>'; };
  var rowsM = mais('mova', mv, 10, function (x) {
    var outros = ondeTxt(x, x.de);
    return '<tr><td><b>' + esc(x.k) + '</b>' + (outros.length ? '<small class="dim">também em ' + esc(lista(outros)) + '</small>' : '') + '</td>' +
      '<td>' + deckLink(x.de.A) + ' ' + tierB(x.de.c.T) + ' ' + relB(x.de.c.r) + '</td><td class="c seta">→</td>' +
      '<td>' + deckLink(x.para) + ' ' + tierB(x.c.T) + ' ' + vd(x.c.v) + '</td></tr>';
  }, 5);
  /* uma linha por carta: quem pede, onde já está */
  var porCarta = {}, jaG = [];
  ja.forEach(function (x) { if (!porCarta[x.k]) { porCarta[x.k] = { k: x.k, pedem: [], onde: x.onde }; jaG.push(porCarta[x.k]); } porCarta[x.k].pedem.push(x); });
  var rowsJ = mais('ja', jaG, 10, function (g) {
    var forte = g.pedem.some(function (x) { return x.c.v === 'avaliar'; }) && g.onde.some(function (o) { return TR[o.c.T] <= 1; });
    return '<tr><td><b>' + esc(g.k) + '</b>' + (forte ? ' ' + pill('ok', 'forte em outro deck', '✓') : '') + '</td><td><div class="pede">' + g.pedem.map(function (x) { return '<span>' + deckLink(x.para) + ' ' + tierB(x.c.T) + ' ' + vd(x.c.v) + '</span>'; }).join('') + '</div></td>' +
      '<td><div class="chips">' + g.onde.map(function (o) { return '<span class="ch-' + o.c.r + '" data-tip="' + esc(o.A.nome + ': tier ' + o.c.T + ', ' + RELN[o.c.r].toLowerCase()) + '">' + esc(o.A.nome) + ' ' + esc(o.c.T) + '</span>'; }).join('') + '</div></td>' +
      '</tr>';
  }, 4);
  var rowsP = mais('pot', pot, 8, function (x) {
    return '<li><b>' + esc(x.k) + '</b>, potencial do ' + deckLink(x.para) + ', já está em ' + esc(lista(x.onde.map(function (o) { return o.A.nome + ' (' + o.c.T + ')'; }))) + '.</li>';
  });
  if (movF.modo === 'deck') return secao('movimentacoes', 'Movimentações', 'Onde cada carta rende mais, entre o que você já tem e o que os radares pedem.', '<div class="ctl">' + modo + sel + seg + '</div>' + caixaSub() + movPorDeck());
  var h = '<div class="ctl">' + modo + sel + seg + '</div>' +
    '<p class="dest">' + pl(MOV.n, 'carta que os radares pedem já está', 'cartas que os radares pedem já estão') + ' em algum deck seu: decida onde cada uma rende mais antes de comprar outra cópia.</p>' + caixaSub() +
    caixa('Mova em vez de comprar (' + mv.length + ')', (mv.length ? '<div class="tw"><table class="tbl mov"><thead><tr><th scope="col">Carta</th><th scope="col">Hoje está em</th><th></th><th scope="col">Rende mais em</th></tr></thead><tbody>' + rowsM + '</tbody></table></div>' : '<p class="hint">Nada com esse filtro.</p>') +
      nota('O radar de um deck pede, com tier melhor, uma carta que você já tem em outro deck. Da mais vantajosa para a menos: maior salto de tier, depois "entra" antes de "avaliar", depois quem está na berlinda onde está. Mova, ou compre outra cópia.'), 'larga', pl(mv.length, 'carta', 'cartas')) +
    caixa('Antes de comprar: você já tem (' + jaG.length + ')', (jaG.length ? '<div class="tw"><table class="tbl mov"><thead><tr><th scope="col">Carta</th><th scope="col">Pedida por</th><th scope="col">Já está em</th></tr></thead><tbody>' + rowsJ + '</tbody></table></div>' : '<p class="hint">Nada com esse filtro.</p>') +
      nota('Aqui a carta rende igual ou mais onde já está: tirar de lá custa. Ou compra outra cópia, ou decide qual deck fica com ela. "Forte em outro deck" é carta para avaliar que já é S ou A em outro lugar: um voto a favor de promover.'), 'larga', pl(jaG.length, 'carta', 'cartas')) +
    caixa('Potenciais que você já tem (' + pot.length + ')', '<ul class="lst">' + rowsP + '</ul>' + nota('Cartas que a comunidade sugere para um deck (os potenciais, ainda sem triagem) e que já estão em outro. Quem decide se sobem ao radar é o /atualizar-deck.'), 'larga', '');
  return secao('movimentacoes', 'Movimentações', 'Onde cada carta rende mais, entre o que você já tem e o que os radares pedem.', h);
}

/* por deck: o que cada deck pode receber de outros e o que pode ceder */
function movPorDeck() {
  var todos = filtraMov(MOV.mova.concat(MOV.ja));
  var vd = function (v) { return '<span class="vd vd-' + v + '">' + (v === 'entra' ? 'entra' : 'avaliar') + '</span>'; };
  var blocos = DK.filter(function (d) { return !movF.deck || d.pasta === movF.deck; }).map(function (d) {
    var A = d.a;
    var recebe = todos.filter(function (x) { return x.para === A; });
    var cede = todos.filter(function (x) { return x.onde.some(function (o) { return o.A === A; }); });
    if (!recebe.length && !cede.length) return null;
    var r = recebe.map(function (x) {
      var melhor = x.onde.slice().sort(function (a, b) { return TR[b.c.T] - TR[a.c.T]; })[0];
      return '<li><b>' + esc(x.k) + '</b> ' + tierB(x.c.T) + ' ' + vd(x.c.v) + '<span class="dim"> · está em ' + esc(lista(x.onde.map(function (o) { return o.A.nome + ' ' + o.c.T; }))) + '</span>' +
        (x.ganho > 0 ? ' ' + pill('ok', 'rende mais aqui', '↑') : '') + '</li>';
    }).join('');
    /* ceder: uma linha por carta, com todos os decks que a pedem; primeiro as que rendem mais em outro lugar */
    var porC = {}, ordemC = [];
    cede.forEach(function (x) {
      var aqui = x.onde.filter(function (o) { return o.A === A; })[0];
      if (!porC[x.k]) { porC[x.k] = { k: x.k, aqui: aqui, pedem: [] }; ordemC.push(porC[x.k]); }
      porC[x.k].pedem.push(x);
    });
    ordemC.forEach(function (g) { g.rende = g.pedem.some(function (x) { return TR[g.aqui.c.T] > TR[x.c.T]; }); });
    ordemC.sort(function (a, b) { return (b.rende ? 1 : 0) - (a.rende ? 1 : 0) || a.k.localeCompare(b.k); });
    var nRende = ordemC.filter(function (g) { return g.rende; }).length;
    var c = ordemC.map(function (g) {
      return '<li class="' + (g.rende ? '' : 'mv-fraca') + '"><b>' + esc(g.k) + '</b> ' + tierB(g.aqui.c.T) + ' ' + relB(g.aqui.c.r) + '<span class="dim"> · pedida pelo ' +
        esc(lista(g.pedem.map(function (x) { return x.para.nome + ' (' + x.c.T + ', ' + (x.c.v === 'entra' ? 'entra' : 'avaliar') + ')'; }))) + '</span>' +
        (g.rende ? ' ' + pill('ok', 'rende mais lá', '↗') : '') + '</li>';
    }).join('');
    var resumo = (recebe.length ? 'recebe ' + recebe.length : 'não recebe nada') + ' · ' + (ordemC.length ? 'pedem ' + pl(ordemC.length, 'carta dele', 'cartas dele') + (nRende ? ', ' + nRende + ' rendem mais lá' : '') : 'ninguém pede cartas dele');
    return { d: d, n: recebe.length + cede.length, h: sanfona('mv-' + d.pasta, '<h3>' + esc(d.nome) + '</h3>' + cores(A.ident), resumo,
      '<div class="g2 mv-g"><div><h4>Pode receber de outros decks (' + recebe.length + ')</h4>' + (r ? '<ul class="mv-l">' + r + '</ul>' : '<p class="hint">Nada.</p>') + '</div>' +
      '<div><h4>Outros decks pedem (' + ordemC.length + (nRende ? ', ' + nRende + ' rendem mais lá' : '') + ')</h4>' + (c ? '<ul class="mv-l">' + c + '</ul>' : '<p class="hint">Nada.</p>') + '</div></div>', 'cx mv-dk') };
  }).filter(Boolean);
  return '<p class="dest">' + pl(MOV.n, 'carta que os radares pedem já está', 'cartas que os radares pedem já estão') + ' em algum deck seu: decida onde cada uma rende mais antes de comprar outra cópia.</p>' +
    '<div class="mv-dks">' + blocos.map(function (b) { return b.h; }).join('') + '</div>' +
    nota('Receber: cartas que o radar deste deck pede e que já estão em outro deck. Outros pedem: cartas deste deck que o radar de outro quer; as que rendem mais lá vêm primeiro, as outras ficam apagadas. "Rende mais" quando o tier é melhor no destino. O hub não sabe se é a mesma cópia: mova, ou compre outra.');
}

/* ============ decks em potencial ============ */
function secPotencial() {
  var semP = H.decks.filter(function (d) { return !d.painel; });
  var dono = {};
  DK.forEach(function (d) { d.a.cards.forEach(function (c) { var k = String(chave(c)).split(' // ')[0].toLowerCase(); (dono[k] = dono[k] || []).push({ A: d.a, c: c }); }); });
  semP.sort(function (a, b) { return (b.ref && b.ref.length ? 1 : 0) - (a.ref && a.ref.length ? 1 : 0) || (a.prio || 99) - (b.prio || 99) || a.pasta.localeCompare(b.pasta); });
  var blocos = semP.map(function (d) {
    var cab = '<header class="pot-h">' + (d.capa ? '<img src="' + d.capa + '" alt="">' : '<span class="pot-sem"></span>') + '<div><h3>' + esc(d.nome) + '</h3><p class="dim">' + esc(d.cmd || 'comandante a confirmar') + '</p>' + cores(d.cores) + '</div></header>';
    if (!d.ref || !d.ref.length) return '<article class="pot vazio">' + cab + '<p class="hint">Sem lista de referência. Solte em <code>dados/' + esc(d.pasta) + '/entrada/</code> o texto exportado de uma lista do Moxfield ou do Archidekt, e o hub mede quanto dela você já tem.</p></article>';
    var todas = {}, origem = {};
    var refs = d.ref.map(function (r) {
      var cs = r.cartas.filter(function (x) { return !BAS[x.n] && x.n.split(' // ')[0].toLowerCase() !== String(d.cmd || '').split(' // ')[0].toLowerCase(); });
      var tem = [], falta = [];
      cs.forEach(function (x) { var k = x.n.split(' // ')[0].toLowerCase(), o = dono[k]; todas[x.n] = todas[x.n] || { x: x, em: 0, o: o }; todas[x.n].em++; (o ? tem : falta).push(x); });
      return { r: r, cs: cs, tem: tem, falta: falta };
    });
    var nomes = Object.keys(todas), cons = nomes.filter(function (n) { return todas[n].em === refs.length; });
    var temU = nomes.filter(function (n) { return todas[n].o; }), faltaU = nomes.filter(function (n) { return !todas[n].o; });
    temU.forEach(function (n) {
      var o = todas[n].o.slice().sort(function (a, b) { return TR[b.c.T] - TR[a.c.T]; })[0];
      var rot = o.A.nome + (o.c.cm ? ' (comandante)' : '');
      origem[rot] = (origem[rot] || 0) + 1;
    });
    var orig = Object.keys(origem).map(function (k) { return { r: esc(k), v: origem[k] }; }).sort(function (a, b) { return b.v - a.v; });
    var faltaC = faltaU.map(function (n) { return todas[n]; }).sort(function (a, b) { return (b.em - a.em) || a.x.n.localeCompare(b.x.n); });
    var listas = refs.map(function (R) {
      var p = R.tem.length / (R.cs.length || 1);
      return '<div class="pot-l"><div class="pot-lh"><a href="' + esc(R.r.f || '#') + '" target="_blank" rel="noopener noreferrer">' + esc(R.r.t) + '</a><b class="num">' + R.tem.length + ' de ' + R.cs.length + '</b></div>' +
        '<span class="meter"><i style="width:' + (p * 100).toFixed(1) + '%"></i></span><small class="dim num">' + pct(p) + ' você já tem, sem contar o comandante e os básicos</small></div>';
    }).join('');
    return '<article class="pot">' + cab + listas +
      '<div class="g3">' +
        caixa('Já tem (' + temU.length + ')', '<div class="chips">' + temU.sort().map(function (n) { var t = todas[n]; return '<span' + (t.em === refs.length && refs.length > 1 ? ' class="cons"' : '') + ' data-tip="' + esc(n + ': ' + lista(t.o.map(function (o) { return o.A.nome + ' ' + o.c.T + (o.c.cm ? ', comandante' : ''); }))) + '">' + esc(n) + '</span>'; }).join('') + '</div>', '', '') +
        caixa('Falta (' + faltaU.length + ')', '<div class="chips">' + faltaC.map(function (t) { return '<span' + (t.em === refs.length && refs.length > 1 ? ' class="cons"' : '') + ' data-tip="' + esc(t.x.n + (t.x.sem ? ': ainda sem dados do Scryfall no cache' : '') + (t.em === refs.length && refs.length > 1 ? '; está em todas as listas' : '')) + '">' + esc(t.x.n) + (t.x.gc ? ' <small>GC</small>' : '') + '</span>'; }).join('') + '</div>' +
          nota('Destacadas: estão em todas as listas (' + cons.length + ' no total).'), '', pl(cons.length, 'em todas as listas', 'em todas as listas')) +
        caixa('De onde viriam', barras(orig, Math.max.apply(null, orig.map(function (x) { return x.v; }).concat([1]))) + nota('Para cada carta que você já tem, o deck onde ela rende menos (o mais fácil de ceder). Montar este deck sem comprar segunda cópia mexe nesses decks.')) +
      '</div></article>';
  }).join('');
  var com = semP.filter(function (d) { return d.ref && d.ref.length; }).length;
  return secao('potencial', 'Decks em potencial', 'Os ' + semP.length + ' decks ainda sem painel. ' + (com ? pl(com, 'tem lista de referência', 'têm lista de referência') + ': o hub mede quanto você já tem.' : 'Nenhum tem lista de referência ainda.'), '<div class="pots">' + blocos + '</div>');
}

/* ============ resumo ============ */
function acoes(att) {
  var L = [];
  att.filter(function (x) { return x.sev === 3; }).slice(0, 1).forEach(function (x) { L.push({ tipo: 'Decidir', sec: x.sec, h: x.h }); });
  /* troca dentro do deck: a função mais curta ganha a vaga do pacote que mais sobra */
  var pr = DK.filter(function (d) { return d.a.res.par; }).map(function (d) { return d.a.res; })
    .sort(function (a, b) { return (a.par.falta.est === 'fragil' ? 0 : 1) - (b.par.falta.est === 'fragil' ? 0 : 1) || (b.par.sobra.n - b.par.sobra.hi) - (a.par.sobra.n - a.par.sobra.hi); })[0];
  if (pr) {
    var p = pr.par, Ad = DK.filter(function (d) { return d.a.res === pr; })[0].a;
    L.push({ tipo: 'Rebalancear', sec: 'reserva', h: '<b>' + esc(Ad.nome) + ': ' + esc(p.sobra.g.n) + ' tem ' + p.sobra.n + ' (' + faixaTxt(p.sobra) + ') e ' + esc(p.falta.g.n) + ' tem ' + p.falta.n + (p.falta.lo != null ? ' (' + faixaTxt(p.falta) + ')' : '') + '.</b> Tire ' + esc(p.sai.n) + (p.entra ? ' e ponha ' + esc(p.entra.n) + ', do radar (em avaliação).' : '; procure mais uma carta de ' + esc(p.falta.g.n) + (p.jaEntram ? ': as do radar já entram por outras trocas.' : ': o radar não tem.')) });
  }
  /* a melhor para agir já: entra no radar, maior salto de tier */
  var mv = SUB.filter(function (m) { return m.c.v === 'entra'; });
  mv.slice(0, 1).forEach(function (m) {
    L.push({ tipo: 'Mover', sec: 'movimentacoes', h: '<b>' + esc(m.k) + ': do ' + esc(m.de.A.nome) + ' para o ' + esc(m.para.nome) + '.</b> Lá é ' + m.de.c.T + ' (' + RELL[m.de.c.r] + '); no radar do ' + esc(m.para.nome) + ', ' + m.c.T + '. Mova, ou compre outra cópia.' });
  });
  var gap = null;
  DK.forEach(function (d) {
    var A = d.a, id = A.ident.split(''); if (id.length < 2) return;
    var pt = soma(id, function (ch) { return A.st.pip[ch]; }) || 1, ft = soma(id, function (ch) { return A.st.src[ch]; }) || 1;
    id.forEach(function (ch) { var g = A.st.pip[ch] / pt - A.st.src[ch] / ft; if (!gap || g > gap.g) gap = { g: g, A: A, ch: ch, a: A.st.pip[ch] / pt, b: A.st.src[ch] / ft }; });
  });
  if (gap && gap.g >= 0.1) L.push({ tipo: 'Consertar', sec: 'mana', h: '<b>' + esc(gap.A.nome) + ': falta ' + NOMEC[gap.ch].toLowerCase() + ' na base.</b> É ' + pct(gap.a) + ' dos símbolos de mana e ' + pct(gap.b) + ' das fontes: o maior descompasso da carteira.' });
  var fund = [['agrupamento:draw', 'compra dedicada'], ['agrupamento:ramp', 'ramp dedicado'], ['terrenos', 'fontes de terreno']].map(function (g) {
    return { g: g, ds: DK.filter(function (d) { return d.a.le.some(function (x) { return x.k === g[0] && x.w; }); }) };
  }).sort(function (a, b) { return b.ds.length - a.ds.length; })[0];
  if (fund && fund.ds.length) L.push({ tipo: 'Padrão', sec: 'fundamentos', h: '<b>' + pl(fund.ds.length, 'deck tem', 'decks têm') + ' ' + fund.g[1] + ' abaixo do mínimo</b> (' + esc(lista(fund.ds.slice(0, 6).map(function (d) { return d.nome; }))) + (fund.ds.length > 6 ? ' e mais ' + (fund.ds.length - 6) : '') + '). É o buraco mais comum da carteira.' });
  var best = []; DK.forEach(function (d) { best = best.concat(d.a.tr.filter(function (t) { return t.d > 0; })); });
  best.sort(function (a, b) { return b.d - a.d || TR[a.c.T] - TR[b.c.T]; });
  if (best[0]) L.push({ tipo: 'Trocar', sec: 'trocas', h: '<b>' + esc(best[0].c.n) + ' no ' + esc(best[0].deck.nome) + '</b>' + (best[0].out ? ', no lugar de ' + esc(best[0].out.n) : '') + ': ' + sinalP(best[0].d) + ' pontos de placar. A troca recomendada que mais melhora o deck dela.' });
  return L.slice(0, 5);
}
function saude() {
  return '<div class="sau">' + DK.map(function (d, i) {
    var A = d.a, al = nAlertas(A.le), cls = al === 0 ? 'ok' : al <= 2 ? 'warn' : 'bad';
    return '<a class="sd sd-' + cls + '" href="#f-' + i + '"><span class="sd-n">' + esc(d.nome) + '</span>' + cores(A.ident) +
      '<span class="sd-d"><span class="num" title="Funções sem reserva">' + (A.res.frageis.length ? A.res.frageis.length + ' sem reserva' : '') + '</span><span class="num sd-a" title="Leituras em alerta">' + (al ? al + ' !' : '✓') + '</span></span></a>';
  }).join('') + '</div>';
}
function secResumo(att) {
  var total = H.decks.length, comp = DK.length;
  var nTr = soma(DK, function (d) { return d.a.tr.length; }), dTr = DK.filter(function (d) { return d.a.tr.length; }).length;
  var nFr = soma(DK, function (d) { return d.a.res.frageis.length; }), dFr = DK.filter(function (d) { return d.a.res.frageis.length; }).length, nCo = soma(DK, function (d) { return d.a.res.nCortes; });
  var al0 = soma(DK, function (d) { return nAlertas(d.a.le); }), al2 = soma(DK, function (d) { return nAlertas(d.a.le2); }), nLe = soma(DK, function (d) { return d.a.le.length; });
  var cego = null;
  ARQ.forEach(function (a) {
    var n = 0, bem = 0, mal = 0;
    DK.forEach(function (d) { var c = d.a.vs[a.k]; if (!c) return; n++; if (c.r === 'forte') bem++; if (c.r === 'fraco') mal++; });
    if (n && !bem && (!cego || mal > cego.mal)) cego = { a: a, mal: mal, n: n };
  });
  var kpi = function (rot, val, sub, extra, sec) { return '<a class="kpi" href="#d-' + sec + '"><span class="kpi-l">' + rot + '</span><b class="kpi-v">' + val + '</b>' + (extra || '') + '<span class="kpi-s">' + sub + '</span></a>'; };
  var h = '<div class="kpis">' +
    kpi('Decks com painel', comp + ' <small>de ' + total + '</small>', pct(comp / total) + ' da carteira analisada', '<span class="meter" aria-hidden="true"><i style="width:' + (comp / total * 100).toFixed(1) + '%"></i></span>', 'fichas') +
    kpi('Funções sem reserva', String(nFr), (nFr ? 'em ' + pl(dFr, 'deck', 'decks') + '; ' : '') + pl(nCo, 'corte seguro', 'cortes seguros') + ' em pacotes com sobra', '', 'reserva') +
    kpi('Trocas recomendadas', String(nTr), 'em ' + pl(dTr, 'deck', 'decks'), '', 'trocas') +
    (function () {   // o Plano do deck: quantos já têm veredito e quais estão com plano insuficiente
      var cl = DK.filter(function (d) { return d.a.pv; }), ins = cl.filter(function (d) { return d.a.pv === 'insuficiente'; });
      return kpi('Plano do deck', cl.length + ' <small>de ' + DK.length + '</small>', cl.length ? (ins.length ? 'insuficiente: ' + ins.map(function (d) { return esc(d.nome); }).join(', ') : 'nenhum insuficiente') : 'nenhum deck classificado ainda', '', 'fichas');
    })() +
    kpi('Sub-utilizadas', String(SUB.length), 'S ou A no radar de um deck e pior onde estão; ' + MOV.n + ' cartas dos radares você já tem', '', 'movimentacoes') +
    kpi('Leituras em alerta', al0 + ' <small>de ' + nLe + '</small>', 'caem para ' + al2 + ' com as trocas', '', 'fundamentos') +
    (cego ? kpi('Ponto cego', esc(cego.a.n), 'nenhum deck vai bem; ' + cego.mal + ' de ' + cego.n + ' vão mal', '', 'mesa') : '') +
    '</div>';
  var tipoC = { Decidir: 'bad', Rebalancear: 'ok', Mover: 'ok', Consertar: 'warn', 'Padrão': 'warn', Trocar: 'info' };
  var ac = acoes(att);
  h += '<div class="g2 resumo-g"><div class="cx"><h3>Faça agora</h3><ol class="acoes">' + ac.map(function (x) {
      return '<li>' + pill(tipoC[x.tipo] || 'info', x.tipo) + '<p>' + x.h + '</p>' + ir(x.sec) + '</li>';
    }).join('') + '</ol>' +
    '<details class="todos"><summary>Todos os ' + att.length + ' avisos, por gravidade</summary><ul class="att">' + att.map(function (x) {
      var sevN = { 3: 'Alta', 2: 'Média', 1: 'Nota' }, sevC = { 3: 'bad', 2: 'warn', 1: 'info' };
      return '<li>' + pill(sevC[x.sev], sevN[x.sev], ico(x.sev)) + '<p>' + x.h + '</p>' + ir(x.sec) + '</li>';
    }).join('') + '</ul></details>' +
    nota('As que mais mudam a carteira hoje: uma decisão de mesa, a troca dentro do deck mais urgente, a melhor movimentação, o maior descompasso de cor, o buraco mais comum e a troca que mais sobe o placar. Tudo sai do último build.') + '</div>' +
    '<div class="cx"><h3>A carteira num relance</h3>' + saude() +
      '<p class="legenda"><span><i class="lg-ok"></i>sem alerta</span><span><i class="lg-warn"></i>1 ou 2 alertas</span><span><i class="lg-bad"></i>3 ou mais</span></p>' +
      nota('Clique num deck para abrir a ficha dele. O placar fica de fora de propósito: só os decks já nos critérios se comparam, e eles estão na seção Placar.') + '</div></div>' +
    caixa('Rotina de conferência', '<dl class="rot">' +
    '<div><dt>Antes de jogar</dt><dd>' + ir('mesa', 'Mesa') + ', pela mesa que vai sentar, e a ' + ir('fichas', 'ficha') + ' do deck.</dd></div>' +
    '<div><dt>Antes de comprar</dt><dd>' + ir('movimentacoes', 'Movimentações') + ' (as sub-utilizadas primeiro): a carta pode já estar num deck onde rende menos. Depois, ' + ir('compras', 'Compras') + '.</dd></div>' +
    '<div><dt>Antes de trocar</dt><dd>' + ir('reserva', 'Reserva e sobra') + ': tire do pacote com sobra, não da função sem reserva.</dd></div>' +
    '<div><dt>Depois de mexer num deck</dt><dd>' + ir('fichas', 'Fichas') + ', ' + ir('fundamentos', 'Fundamentos') + ' e ' + ir('trocas', 'Trocas') + '.</dd></div>' +
    '<div><dt>Uma vez por mês</dt><dd>' + ir('auditoria', 'Bastidores') + '. Monte o hub com internet para renovar os Game Changers.</dd></div>' +
    '<div><dt>Deck novo</dt><dd>' + ir('potencial', 'Decks em potencial') + ' e o álbum de cores em ' + ir('carteira', 'Carteira') + '.</dd></div>' +
    '</dl>', 'larga', 'quando olhar cada aba');
  return secao('resumo', 'A carteira hoje', 'Os ' + comp + ' decks com painel, cruzados. Comece pelo "Faça agora"; o resto está nas abas.', h);
}

/* ============ montagem do dashboard ============ */
var DTABS = [['resumo', 'Resumo', ['resumo']], ['fichas', 'Fichas', ['fichas', 'comparar']], ['mov', 'Movimentações', ['movimentacoes', 'compartilhadas']], ['compras', 'Compras', ['compras', 'radar']],
             ['mesa', 'Mesa', ['mesa']], ['trocas', 'Trocas e reserva', ['trocas', 'reserva', 'placar']], ['mana', 'Fundamentos e mana', ['fundamentos', 'mana']],
             ['potencial', 'Decks em potencial', ['potencial']], ['bastidores', 'Bastidores', ['auditoria', 'carteira']]];
var SEC_HTML = { compras: secCompras, radar: secRadar, fichas: secFichas, comparar: secComparar, movimentacoes: secMov, compartilhadas: secComp, mesa: secMesa, trocas: secTrocas, placar: secPlacar,
                 reserva: secReserva, fundamentos: secFund, mana: secMana, potencial: secPotencial, auditoria: secAudit, carteira: secCarteira };
function abaDe(sec) { for (var i = 0; i < DTABS.length; i++) if (DTABS[i][2].indexOf(sec) >= 0) return DTABS[i]; return null; }
function vistaDash() {
  if (!DK.length) return '<p class="intro">Nenhum deck com painel ainda. O Dashboard cruza os decks assim que o primeiro painel existir.</p>' + secCarteira();
  var att = atencao();
  return '<nav class="dnav" aria-label="Abas do Dashboard">' + DTABS.map(function (t) { return '<a href="#d-' + t[2][0] + '" data-dtab="' + t[0] + '">' + t[1] + '</a>'; }).join('') + '</nav>' +
    DTABS.map(function (t, i) {
      return '<div class="dtab" data-dtab="' + t[0] + '"' + (i ? ' hidden' : '') + '>' + t[2].map(function (s) { return s === 'resumo' ? secResumo(att) : SEC_HTML[s](); }).join('') + '</div>';
    }).join('');
}
function mostrarAba(t) {
  document.querySelectorAll('#v-dash .dtab').forEach(function (el) { el.hidden = el.dataset.dtab !== t[0]; });
  document.querySelectorAll('#v-dash .dnav a').forEach(function (a) { if (a.dataset.dtab === t[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
}
/* redesenha só a parte que mudou: as capas embutidas pesam, e o resto da página não precisa voltar */
function seletor(ds) { return '[data-act="' + ds.act + '"]' + (ds.k ? '[data-k="' + ds.k + '"]' : '') + (ds.v ? '[data-v="' + ds.v + '"]' : ''); }
/* Cada seção sabe se redesenhar. O botão "Ver todas" redesenha a seção onde está, seja qual for a lista:
   antes havia um mapa por lista, e as listas que ficaram fora dele (pesa, baixa, caras) não abriam. */
var SEC_FN = { resumo: function () { return secResumo(atencao()); } }; Object.keys(SEC_HTML).forEach(function (k) { SEC_FN[k] = SEC_HTML[k]; });
function redesenharSecao(k, sec) {
  var f = SEC_FN[sec]; if (!f) return;
  var el = document.getElementById('d-' + sec); if (!el) return;
  var tmp = document.createElement('div'); tmp.innerHTML = f();
  el.parentNode.replaceChild(tmp.firstChild, el);
  if (!k) return;
  var bt = document.querySelector(k.charAt(0) === '[' ? '#d-' + sec + ' ' + k : '#d-' + sec + ' [data-act="mais"][data-k="' + k + '"]'); if (bt) bt.focus();
}
function redesenharMesa() {
  var box = $('#mesa'); if (!box) return;
  var ds = document.activeElement && document.activeElement.dataset && document.activeElement.dataset.act ? { act: document.activeElement.dataset.act, k: document.activeElement.dataset.k, v: document.activeElement.dataset.v } : null;
  box.innerHTML = boxMesa();
  var el = ds ? box.querySelector(seletor(ds)) : null;
  if (el && !el.disabled) el.focus(); else { var alt = box.querySelector('button:not([disabled])'); if (alt && ds) alt.focus(); }
}
function redesenharSim(sel) {
  var box = $('#sim'); if (!box) return;
  var foco = document.activeElement, act = foco && foco.dataset ? foco.dataset.act : null, k = foco && foco.dataset ? foco.dataset.k : null;
  box.innerHTML = boxSim();
  var el = sel ? box.querySelector('[data-sim="' + sel + '"]') : (act ? box.querySelector('[data-act="' + act + '"]' + (k ? '[data-k="' + k + '"]' : '')) : null);
  if (el) el.focus();
}

/* ============ dica flutuante ============ */
var tip = document.createElement('div');
tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true;
document.body.appendChild(tip);
function mostrarDica(el, x, y) {
  var t = el.getAttribute('data-tip'); if (!t) return;
  tip.textContent = t; tip.hidden = false;
  var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  var px = x != null ? x : r.left + r.width / 2, py = y != null ? y : r.top;
  var left = Math.max(8, Math.min(window.innerWidth - w - 8, px - w / 2)), top = py - h - 12;
  if (top < 72) top = (y != null ? y : r.bottom) + 16;
  tip.style.left = left + 'px'; tip.style.top = top + 'px';
}
function esconderDica() { tip.hidden = true; }
document.addEventListener('pointerover', function (ev) { var el = ev.target.closest && ev.target.closest('[data-tip]'); if (el) mostrarDica(el, ev.clientX, ev.clientY); });
document.addEventListener('pointermove', function (ev) { var el = ev.target.closest && ev.target.closest('[data-tip]'); if (el) mostrarDica(el, ev.clientX, ev.clientY); else esconderDica(); });
document.addEventListener('pointerout', function (ev) { if (!ev.relatedTarget || !ev.relatedTarget.closest || !ev.relatedTarget.closest('[data-tip]')) esconderDica(); });
document.addEventListener('focusin', function (ev) { var el = ev.target.closest && ev.target.closest('[data-tip]'); if (el) mostrarDica(el); else esconderDica(); });
document.addEventListener('focusout', esconderDica);
window.addEventListener('scroll', esconderDica, { passive: true });
document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') esconderDica(); });

/* ============ navegação ============ */
/* Cada aba tem endereço próprio (#decks, #pastas, #dashboard; as seções do Dashboard, #d-…). Atualizar a página,
   ou voltar e avançar no navegador, abre a aba que o endereço diz. */
var ROTA = { decks: '#decks', pastas: '#pastas', dash: '#dashboard' };
function vista(k) {
  document.querySelectorAll('[role=tab][data-vista]').forEach(function (b) { var on = b.dataset.vista === k; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  document.querySelectorAll('.vista').forEach(function (v) { v.hidden = v.id !== 'v-' + k; });
  esconderDica();
}
function irPara(k) {
  /* troca na hora; o endereço vem em seguida, e o hashchange que ele dispara só repete a mesma vista */
  vista(k); window.scrollTo(0, 0);
  if (location.hash !== ROTA[k]) location.hash = ROTA[k];
}
function rota(inicio) {
  var h = location.hash, m = /^#d-(.+)$/.exec(h), f = /^#f-\d+$/.test(h);
  if (m || f) {
    var sec = f ? 'fichas' : m[1], t = abaDe(sec), el = document.getElementById(h.slice(1));
    /* a ficha pedida pode estar escondida pelo filtro de grupo: limpa o filtro e redesenha */
    if (f && !el && ficha.g) { ficha.g = ''; redesenharSecao(null, 'fichas'); el = document.getElementById(h.slice(1)); }
    if (t && el) {
      vista('dash'); mostrarAba(t);
      if (f && el.tagName === 'DETAILS') el.open = true;
      setTimeout(function () { if (!f && t[2][0] === sec) window.scrollTo(0, 0); else el.scrollIntoView(); }, 0);
      return;
    }
  }
  if (h === '#dashboard') { vista('dash'); mostrarAba(DTABS[0]); if (!inicio) window.scrollTo(0, 0); return; }
  vista(h === '#pastas' ? 'pastas' : 'decks');
  if (!inicio) window.scrollTo(0, 0);
}
function filtrar(semIr) {
  var q = semAcento($('#q').value.trim()), n = 0;
  if (q && $('#v-decks').hidden && !semIr) irPara('decks');
  document.querySelectorAll('#v-decks .deck, #v-decks .lrow').forEach(function (el) { el.hidden = !!q && el.dataset.busca.indexOf(q) < 0; if (!el.hidden) n++; });
  document.querySelectorAll('#v-decks .grupo').forEach(function (g) { g.hidden = !!q && !g.querySelectorAll('.deck:not([hidden]), .lrow:not([hidden])').length; });
  /* a busca abre os grupos onde achou algo; limpar a busca fecha de novo os que ela abriu */
  document.querySelectorAll('#v-decks details.g-sf').forEach(function (d) {
    if ((q || ativoDecks()) && !d.open && d.querySelector('.deck:not([hidden]), .lrow:not([hidden])')) { d.dataset.auto = 1; d.dataset.pelaBusca = 1; d.open = true; }
    else if (!q && !ativoDecks() && d.dataset.pelaBusca && d.open) { delete d.dataset.pelaBusca; d.dataset.auto = 1; d.open = false; }
  });
  var c = $('#dk-n'); if (c) c.textContent = n;
}
$('#v-decks').innerHTML = vistaDecks(); filtrar(true);
$('#v-pastas').innerHTML = vistaPastas();
if (H.caixa) { var tc = $('#t-caixa'); tc.hidden = false; if (location.protocol !== 'file:' && H.caixa.pub) tc.href = H.caixa.pub; }
// o Grimório: a pílula à direita do Dashboard, com o mesmo mecanismo de link da Caixa (local no arquivo, publicado no claude.ai)
if (H.grimorio) { var tg = $('#t-grim'); tg.hidden = false; tg.href = (location.protocol !== 'file:' && H.grimorio.pub) ? H.grimorio.pub : H.grimorio.href; }
$('#v-dash').innerHTML = vistaDash();
$('#foot').innerHTML = '<p>O hub mostra a foto do último build, de ' + esc(H.gerado) + '. O que você edita dentro de um painel fica naquele painel até voltar para o projeto com o <code>/importar-backup</code>, pela aba Oficina.</p>' +
  '<p>Arte das cartas e dos comandantes: © Wizards of the Coast.</p>';
$('#q').addEventListener('input', function () { filtrar(); });
document.addEventListener('click', function (ev) {
  var b = ev.target.closest && ev.target.closest('#v-decks [data-dk]'); if (!b) return;
  var a = b.dataset.dk, k = b.dataset.k;
  if (a === 'v') dk.v = k; else if (a === 'ord') dk.ord = k; else if (a === 'sit') dk.sit = k;
  else if (a === 'cor') dk.cores[k] = !dk.cores[k];
  else if (a === 'limpar') { dk.cores = {}; dk.sit = ''; }
  else if (a === 'abrir' || a === 'fechar') { document.querySelectorAll('#v-decks details.g-sf').forEach(function (d) { d.open = a === 'abrir'; }); return; }
  dkGuardar(); var fd = b.closest('.dk-f'); dkAberto = !!(fd && fd.open);
  redesenharDecks(a === 'limpar' ? '[data-dk="v"][aria-pressed="true"]' : '[data-dk="' + a + '"][data-k="' + k + '"]');
});
rota(true);
window.addEventListener('hashchange', function () { rota(false); });
document.addEventListener('click', function (ev) { var a = ev.target.closest && ev.target.closest('a[href^="#d-"], a[href^="#f-"]'); if (a && $('#v-dash').hidden) vista('dash'); });
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[role=tab][data-vista]'); if (t) { irPara(t.dataset.vista); return; }
  var a = ev.target.closest('#v-dash [data-act]'); if (!a) return;
  var act = a.dataset.act, k = a.dataset.k;
  if (act === 'mesa') { var v = (mesa[k] || 0) + (+a.dataset.v); mesa[k] = Math.max(0, Math.min(3, v)); redesenharMesa(); }
  else if (act === 'mesa-limpar') { mesa = {}; redesenharMesa(); }
  else if (act === 'mais') { var sc = a.closest('.dsec'); abertos[k] = !abertos[k]; if (sc) redesenharSecao(k, sc.id.slice(2)); }
  else if (act === 'sim-deck') { sim.p = k; sim.sel = simCenario(simDeck().a, 'rec'); redesenharSim(); }
  else if (act === 'sim-cen') { sim.sel = simCenario(simDeck().a, k); redesenharSim(); }
  else if (act === 'ficha-ord') { ficha.ord = k; redesenharSecao('[data-act="ficha-ord"][data-k="' + k + '"]', 'fichas'); }
  else if (act === 'ficha-g') { ficha.g = k; redesenharSecao('[data-act="ficha-g"][data-k="' + k + '"]', 'fichas'); }
  else if (act === 'cmp-par') { cmp.a = k; cmp.b = a.dataset.v; redesenharSecao('[data-cmp="a"]', 'comparar'); var c0 = document.getElementById('d-comparar'); if (c0) c0.scrollIntoView(); }
  else if (act === 'cmp-com') {
    /* compara com o deck mais parecido com ele */
    var par = PARES.filter(function (p) { return p.a.pasta === k || p.b.pasta === k; })[0];
    cmp.a = k; if (par) cmp.b = par.a.pasta === k ? par.b.pasta : par.a.pasta;
    location.hash = '#d-comparar'; redesenharSecao('[data-cmp="b"]', 'comparar');
  }
  else if (act === 'fi-abrir' || act === 'fi-fechar') { document.querySelectorAll('#d-fichas details.fi').forEach(function (d) { d.open = act === 'fi-abrir'; }); }
  else if (act === 'mov-modo') { movF.modo = k; redesenharSecao('[data-act="mov-modo"][data-k="' + k + '"]', 'movimentacoes'); }
  else if (act === 'comp') compToggle(k, a.dataset.v);
  else if (act === 'comp-tirar') compTirar(k);
  else if (act === 'comp-copiar') compCopiar();
  else if (act === 'rad') { radF[k] = a.dataset.v; abertos.radar = false; redesenharSecao('[data-act="rad"][data-k="' + k + '"][data-v="' + a.dataset.v + '"]', 'radar'); }
  else if (act === 'mov-so') { movF.so = k; redesenharSecao('[data-act="mov-so"][data-k="' + k + '"]', 'movimentacoes'); }
});
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (t.matches && t.matches('select[data-cmp]')) { cmp[t.dataset.cmp] = t.value; redesenharSecao('[data-cmp="' + t.dataset.cmp + '"]', 'comparar'); }
  else if (t.matches && t.matches('select[data-mov]')) { movF.deck = t.value; redesenharSecao('[data-mov="deck"]', 'movimentacoes'); }
  else if (t.matches && t.matches('select[data-rad]')) { radF.deck = t.value; abertos.radar = false; redesenharSecao('[data-rad="deck"]', 'radar'); }
});
document.addEventListener('change', function (ev) {
  var c = ev.target.closest('#v-dash [data-sim]'); if (!c) return;
  if (c.checked) sim.sel[c.dataset.sim] = 1; else delete sim.sel[c.dataset.sim];
  redesenharSim(c.dataset.sim);
});
document.addEventListener('keydown', function (ev) {
  var t = ev.target; if (!t.matches || !t.matches('[role=tab][data-vista]') || (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft')) return;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role=tab][data-vista]')), i = tabs.indexOf(t);
  var n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; irPara(n.dataset.vista); n.focus();
});
/* para os testes e para conferência: as contas do Dashboard, deck a deck */
ligarCompras();
window.HUB_DASH = { decks: DK.map(function (d) { var A = d.a; return { pasta: d.pasta, placar: A.st.total, placar_trocas: A.st2.total, alertas: nAlertas(A.le), alertas_trocas: nAlertas(A.le2), sem_reserva: A.res.frageis.map(function (f) { return f.g.k; }), cortes: A.res.fun.reduce(function (o, f) { if (f.cortes.length) o[f.g.k] = f.cortes.map(function (x) { return x.c.n; }); return o; }, {}), fontes: A.mana.src, karsten: Math.round(A.kar.sug * 10) / 10,
  cmc: Math.round(A.st.avg * 100) / 100, cmc_custo: Math.round(A.cv.st.avg * 100) / 100, baixa_custo: A.cv.boas.length,
  game_changers: A.br.gc.slice().sort() }; }),
  mov: { mova: MOV.mova.length, ja: MOV.ja.length, pot: MOV.pot.length, cartas: MOV.n, sub: SUB.map(function (x) { return x.k + '|' + x.para.pasta; }).sort() },
  radar: RAD.length };
})();
