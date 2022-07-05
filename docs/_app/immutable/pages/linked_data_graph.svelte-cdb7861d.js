import {
  S as at,
  i as rt,
  s as nt,
  t as I,
  h as w,
  g as E,
  j as fe,
  d,
  e as m,
  k as L,
  c as v,
  a as b,
  m as N,
  b as _,
  G as u,
  n as Ge,
  K as ct,
  L as ft,
  x as Ke,
  y as ze,
  z as Je,
  Q as We,
  M as X,
  O as dt,
  a0 as ot,
  r as Xe,
  p as Ye,
  C as Ze,
  R as pt,
  w as _t,
  a1 as ht,
  l as de,
  N as it
} from '../chunks/index-3dbc572b.js';
import { S as mt } from '../chunks/SimpleAutocomplete-81201232.js';
import { i as vt, j as pe, k as bt, s as kt } from '../chunks/queries-02904e64.js';
function $e(a) {
  let l = a[1].label + '',
    e,
    s,
    t = a[1].id + '',
    r,
    n,
    c,
    f;
  return {
    c() {
      (e = I(l)),
        (s = I(' (')),
        (r = I(t)),
        (n = I('): ')),
        (c = I(a[2])),
        (f = I(' linked records found'));
    },
    l(o) {
      (e = w(o, l)),
        (s = w(o, ' (')),
        (r = w(o, t)),
        (n = w(o, '): ')),
        (c = w(o, a[2])),
        (f = w(o, ' linked records found'));
    },
    m(o, i) {
      E(o, e, i), E(o, s, i), E(o, r, i), E(o, n, i), E(o, c, i), E(o, f, i);
    },
    p(o, i) {
      i & 2 && l !== (l = o[1].label + '') && fe(e, l),
        i & 2 && t !== (t = o[1].id + '') && fe(r, t),
        i & 4 && fe(c, o[2]);
    },
    d(o) {
      o && d(e), o && d(s), o && d(r), o && d(n), o && d(c), o && d(f);
    }
  };
}
function gt(a) {
  let l,
    e,
    s,
    t = a[0].nodes && $e(a);
  return {
    c() {
      (l = m('main')), t && t.c(), (e = L()), (s = m('div')), this.h();
    },
    l(r) {
      l = v(r, 'MAIN', {});
      var n = b(l);
      t && t.l(n),
        (e = N(n)),
        (s = v(n, 'DIV', { id: !0, class: !0 })),
        b(s).forEach(d),
        n.forEach(d),
        this.h();
    },
    h() {
      _(s, 'id', 'mynetwork'), _(s, 'class', 'svelte-d2jgol');
    },
    m(r, n) {
      E(r, l, n), t && t.m(l, null), u(l, e), u(l, s);
    },
    p(r, [n]) {
      r[0].nodes ? (t ? t.p(r, n) : ((t = $e(r)), t.c(), t.m(l, e))) : t && (t.d(1), (t = null));
    },
    i: Ge,
    o: Ge,
    d(r) {
      r && d(l), t && t.d();
    }
  };
}
function yt(a, l, e) {
  let { networkData: s } = l,
    { searchItem: t } = l,
    { properties: r } = l,
    { destroyGraph: n } = l,
    c = [],
    f = [],
    o = 0,
    i;
  function P(k) {
    if (!!k.nodes) {
      (c = new vis.DataSet(k.nodes)),
        (f = new vis.DataSet(k.edges)),
        c.length == 0 && (c = [{ id: t.id, label: t.label }]);
      var T = document.getElementById('mynetwork'),
        q = { nodes: c, edges: f },
        G = {
          edges: { arrows: { to: { enabled: !0, type: 'arrow', scaleFactor: 0.5 } } },
          physics: { barnesHut: { gravitationalConstant: -3e3, damping: 1, avoidOverlap: 0.3 } },
          interaction: { hover: !0 }
        };
      e(5, (i = new vis.Network(T, q, G))), V(i);
    }
  }
  async function j(k) {
    let T = k.nodes[0],
      q = await vt(T, r),
      G = new Set(s.nodes.map((h) => h.id)),
      A = new Set(s.edges.map((h) => `${h.from} ${h.property_id} ${h.to}`));
    q.nodes.forEach((h) => {
      G.has(h.id) || (c.add(h), e(2, (o += 1)), s.nodes.push(h));
    }),
      q.edges.forEach((h) => {
        A.has(`${h.from} ${h.property_id} ${h.to}`) || (f.add(h), s.edges.push(h));
      });
  }
  function V(k) {
    k.on('click', async function (T) {
      await j(T);
    }),
      k.on('doubleClick', function (T) {});
  }
  return (
    (a.$$set = (k) => {
      'networkData' in k && e(0, (s = k.networkData)),
        'searchItem' in k && e(1, (t = k.searchItem)),
        'properties' in k && e(3, (r = k.properties)),
        'destroyGraph' in k && e(4, (n = k.destroyGraph));
    }),
    (a.$$.update = () => {
      a.$$.dirty & 1 && (P(s), e(2, (o = s.nodes ? s.nodes.length : 0))),
        a.$$.dirty & 48 && n && i.destroy();
    }),
    [s, t, o, r, n, i]
  );
}
class It extends at {
  constructor(l) {
    super(),
      rt(this, l, yt, gt, nt, { networkData: 0, searchItem: 1, properties: 3, destroyGraph: 4 });
  }
}
function xe(a, l, e) {
  const s = a.slice();
  return (s[22] = l[e][0]), (s[23] = l[e][1]), s;
}
function et(a, l, e) {
  const s = a.slice();
  return (s[26] = l[e]), s;
}
function wt(a) {
  let l;
  return {
    c() {
      l = I('TODO: implement custom properties');
    },
    l(e) {
      l = w(e, 'TODO: implement custom properties');
    },
    m(e, s) {
      E(e, l, s);
    },
    p: Ge,
    d(e) {
      e && d(l);
    }
  };
}
function Et(a) {
  let l,
    e = Object.entries(pe),
    s = [];
  for (let t = 0; t < e.length; t += 1) s[t] = lt(xe(a, e, t));
  return {
    c() {
      for (let t = 0; t < s.length; t += 1) s[t].c();
      l = de();
    },
    l(t) {
      for (let r = 0; r < s.length; r += 1) s[r].l(t);
      l = de();
    },
    m(t, r) {
      for (let n = 0; n < s.length; n += 1) s[n].m(t, r);
      E(t, l, r);
    },
    p(t, r) {
      if (r & 4) {
        e = Object.entries(pe);
        let n;
        for (n = 0; n < e.length; n += 1) {
          const c = xe(t, e, n);
          s[n] ? s[n].p(c, r) : ((s[n] = lt(c)), s[n].c(), s[n].m(l.parentNode, l));
        }
        for (; n < s.length; n += 1) s[n].d(1);
        s.length = e.length;
      }
    },
    d(t) {
      it(s, t), t && d(l);
    }
  };
}
function tt(a) {
  let l,
    e,
    s = a[26].label + '',
    t,
    r,
    n,
    c,
    f;
  return {
    c() {
      (l = m('label')), (e = m('input')), (t = I(s)), (r = L()), (n = m('br')), this.h();
    },
    l(o) {
      l = v(o, 'LABEL', { class: !0 });
      var i = b(l);
      (e = v(i, 'INPUT', { type: !0, name: !0 })),
        (t = w(i, s)),
        (r = N(i)),
        i.forEach(d),
        (n = v(o, 'BR', {})),
        this.h();
    },
    h() {
      _(e, 'type', 'checkbox'),
        _(e, 'name', 'property_type'),
        (e.__value = a[26].id),
        (e.value = e.__value),
        a[14][0].push(e),
        _(l, 'class', 'checkbox');
    },
    m(o, i) {
      E(o, l, i),
        u(l, e),
        (e.checked = ~a[2].indexOf(e.__value)),
        u(l, t),
        u(l, r),
        E(o, n, i),
        c || ((f = X(e, 'change', a[16])), (c = !0));
    },
    p(o, i) {
      i & 4 && (e.checked = ~o[2].indexOf(e.__value));
    },
    d(o) {
      o && d(l), a[14][0].splice(a[14][0].indexOf(e), 1), o && d(n), (c = !1), f();
    }
  };
}
function lt(a) {
  let l,
    e = a[22] + '',
    s,
    t,
    r,
    n = a[23],
    c = [];
  for (let f = 0; f < n.length; f += 1) c[f] = tt(et(a, n, f));
  return {
    c() {
      (l = m('div')), (s = I(e)), (t = L());
      for (let f = 0; f < c.length; f += 1) c[f].c();
      r = de();
    },
    l(f) {
      l = v(f, 'DIV', {});
      var o = b(l);
      (s = w(o, e)), o.forEach(d), (t = N(f));
      for (let i = 0; i < c.length; i += 1) c[i].l(f);
      r = de();
    },
    m(f, o) {
      E(f, l, o), u(l, s), E(f, t, o);
      for (let i = 0; i < c.length; i += 1) c[i].m(f, o);
      E(f, r, o);
    },
    p(f, o) {
      if (o & 4) {
        n = f[23];
        let i;
        for (i = 0; i < n.length; i += 1) {
          const P = et(f, n, i);
          c[i] ? c[i].p(P, o) : ((c[i] = tt(P)), c[i].c(), c[i].m(r.parentNode, r));
        }
        for (; i < c.length; i += 1) c[i].d(1);
        c.length = n.length;
      }
    },
    d(f) {
      f && d(l), f && d(t), it(c, f), f && d(r);
    }
  };
}
function st(a) {
  let l, e;
  return {
    c() {
      (l = m('div')), (e = I(a[5]));
    },
    l(s) {
      l = v(s, 'DIV', {});
      var t = b(l);
      (e = w(t, a[5])), t.forEach(d);
    },
    m(s, t) {
      E(s, l, t), u(l, e);
    },
    p(s, t) {
      t & 32 && fe(e, s[5]);
    },
    d(s) {
      s && d(l);
    }
  };
}
function Dt(a) {
  let l,
    e,
    s,
    t,
    r,
    n,
    c,
    f,
    o,
    i,
    P,
    j,
    V,
    k,
    T,
    q,
    G,
    A,
    h,
    le,
    se,
    g,
    D,
    _e,
    he,
    me,
    U,
    H,
    ve,
    be,
    Y,
    B,
    ke,
    Q,
    Z,
    K,
    R,
    ge,
    ye,
    Ie,
    F,
    $,
    z,
    we,
    Ee,
    x,
    J,
    De,
    Oe,
    ee,
    M,
    ae,
    Se,
    Te;
  function ut(p) {
    a[12](p);
  }
  let je = {
    searchFunction: a[10],
    delay: '200',
    onChange: a[11],
    labelFieldName: 'search_label',
    placeholder: 'Search keyword',
    hideArrow: !0,
    showClear: !1,
    localFiltering: !1
  };
  a[7] !== void 0 && (je.selectedItem = a[7]),
    (i = new mt({ props: je })),
    ct.push(() => ft(i, 'selectedItem', ut));
  function Ae(p, y) {
    return p[1] == 'preset' ? Et : wt;
  }
  let re = Ae(a),
    C = re(a),
    O = a[4] && a[5] && st(a);
  return (
    (M = new It({
      props: { networkData: a[0], searchItem: a[7], properties: a[2], destroyGraph: a[6] }
    })),
    {
      c() {
        (l = m('h1')),
          (e = I('Linked Data')),
          (s = L()),
          (t = m('div')),
          (r = m('div')),
          (n = m('div')),
          (c = m('label')),
          (f = I('Search')),
          (o = L()),
          Ke(i.$$.fragment),
          (j = L()),
          (V = m('div')),
          (k = m('div')),
          (T = I('properties')),
          (q = L()),
          (G = m('div')),
          (A = m('label')),
          (h = m('input')),
          (le = I(`
          Preset properties`)),
          (se = L()),
          (g = m('label')),
          (D = m('input')),
          (_e = I(`
          Custom properties`)),
          (he = L()),
          C.c(),
          (me = L()),
          (U = m('div')),
          (H = m('label')),
          (ve = I('Iterations')),
          (be = L()),
          (Y = m('div')),
          (B = m('input')),
          (ke = L()),
          (Q = m('div')),
          (Z = m('div')),
          (K = m('label')),
          (R = m('input')),
          (ge = I(`
          Show SPARQL query`)),
          (ye = L()),
          O && O.c(),
          (Ie = L()),
          (F = m('div')),
          ($ = m('div')),
          (z = m('button')),
          (we = I('Submit')),
          (Ee = L()),
          (x = m('div')),
          (J = m('button')),
          (De = I('Reset')),
          (Oe = L()),
          (ee = m('div')),
          Ke(M.$$.fragment),
          this.h();
      },
      l(p) {
        l = v(p, 'H1', { class: !0 });
        var y = b(l);
        (e = w(y, 'Linked Data')), y.forEach(d), (s = N(p)), (t = v(p, 'DIV', { class: !0 }));
        var W = b(t);
        r = v(W, 'DIV', { class: !0 });
        var S = b(r);
        n = v(S, 'DIV', { class: !0 });
        var ne = b(n);
        c = v(ne, 'LABEL', { class: !0, for: !0 });
        var Be = b(c);
        (f = w(Be, 'Search')),
          Be.forEach(d),
          (o = N(ne)),
          ze(i.$$.fragment, ne),
          ne.forEach(d),
          (j = N(S)),
          (V = v(S, 'DIV', { class: !0 }));
        var te = b(V);
        k = v(te, 'DIV', {});
        var Ce = b(k);
        (T = w(Ce, 'properties')), Ce.forEach(d), (q = N(te)), (G = v(te, 'DIV', { class: !0 }));
        var oe = b(G);
        A = v(oe, 'LABEL', { class: !0 });
        var Le = b(A);
        (h = v(Le, 'INPUT', { type: !0, name: !0 })),
          (le = w(
            Le,
            `
          Preset properties`
          )),
          Le.forEach(d),
          (se = N(oe)),
          (g = v(oe, 'LABEL', { class: !0 }));
        var Ne = b(g);
        (D = v(Ne, 'INPUT', { type: !0, name: !0 })),
          (_e = w(
            Ne,
            `
          Custom properties`
          )),
          Ne.forEach(d),
          oe.forEach(d),
          (he = N(te)),
          C.l(te),
          te.forEach(d),
          (me = N(S)),
          (U = v(S, 'DIV', { class: !0 }));
        var ie = b(U);
        H = v(ie, 'LABEL', { class: !0, for: !0 });
        var Pe = b(H);
        (ve = w(Pe, 'Iterations')), Pe.forEach(d), (be = N(ie)), (Y = v(ie, 'DIV', { class: !0 }));
        var qe = b(Y);
        (B = v(qe, 'INPUT', { id: !0, type: !0, name: !0, min: !0 })),
          qe.forEach(d),
          ie.forEach(d),
          (ke = N(S)),
          (Q = v(S, 'DIV', { class: !0 }));
        var ue = b(Q);
        Z = v(ue, 'DIV', { class: !0 });
        var Qe = b(Z);
        K = v(Qe, 'LABEL', { class: !0 });
        var Ve = b(K);
        (R = v(Ve, 'INPUT', { type: !0, name: !0 })),
          (ge = w(
            Ve,
            `
          Show SPARQL query`
          )),
          Ve.forEach(d),
          Qe.forEach(d),
          (ye = N(ue)),
          O && O.l(ue),
          ue.forEach(d),
          (Ie = N(S)),
          (F = v(S, 'DIV', { class: !0 }));
        var ce = b(F);
        $ = v(ce, 'DIV', { class: !0 });
        var Ue = b($);
        z = v(Ue, 'BUTTON', { class: !0 });
        var Re = b(z);
        (we = w(Re, 'Submit')),
          Re.forEach(d),
          Ue.forEach(d),
          (Ee = N(ce)),
          (x = v(ce, 'DIV', { class: !0 }));
        var Fe = b(x);
        J = v(Fe, 'BUTTON', { class: !0 });
        var Me = b(J);
        (De = w(Me, 'Reset')),
          Me.forEach(d),
          Fe.forEach(d),
          ce.forEach(d),
          S.forEach(d),
          (Oe = N(W)),
          (ee = v(W, 'DIV', { class: !0 }));
        var He = b(ee);
        ze(M.$$.fragment, He), He.forEach(d), W.forEach(d), this.h();
      },
      h() {
        _(l, 'class', 'title is-1'),
          _(c, 'class', 'label'),
          _(c, 'for', 'search'),
          _(n, 'class', 'field svelte-1k2mpfe'),
          _(h, 'type', 'radio'),
          _(h, 'name', 'property_type'),
          (h.__value = 'preset'),
          (h.value = h.__value),
          a[14][1].push(h),
          _(A, 'class', 'radio'),
          _(D, 'type', 'radio'),
          _(D, 'name', 'property_type'),
          (D.__value = 'custom'),
          (D.value = D.__value),
          a[14][1].push(D),
          _(g, 'class', 'radio'),
          _(G, 'class', 'control'),
          _(V, 'class', 'field svelte-1k2mpfe'),
          _(H, 'class', 'label'),
          _(H, 'for', 'iterations'),
          _(B, 'id', 'iterations'),
          _(B, 'type', 'number'),
          _(B, 'name', 'iterations'),
          _(B, 'min', '1'),
          _(Y, 'class', 'control'),
          _(U, 'class', 'field svelte-1k2mpfe'),
          _(R, 'type', 'checkbox'),
          _(R, 'name', 'show_sparql_query'),
          _(K, 'class', 'checkbox'),
          _(Z, 'class', 'control'),
          _(Q, 'class', 'field svelte-1k2mpfe'),
          _(z, 'class', 'button is-link'),
          _($, 'class', 'control'),
          _(J, 'class', 'button is-link is-light'),
          _(x, 'class', 'control'),
          _(F, 'class', 'field is-grouped svelte-1k2mpfe'),
          _(r, 'class', 'column is-one-third explorer-menu svelte-1k2mpfe'),
          _(ee, 'class', 'column is-two-thirds explorer-graph svelte-1k2mpfe'),
          _(t, 'class', 'columns');
      },
      m(p, y) {
        E(p, l, y),
          u(l, e),
          E(p, s, y),
          E(p, t, y),
          u(t, r),
          u(r, n),
          u(n, c),
          u(c, f),
          u(n, o),
          Je(i, n, null),
          u(r, j),
          u(r, V),
          u(V, k),
          u(k, T),
          u(V, q),
          u(V, G),
          u(G, A),
          u(A, h),
          (h.checked = h.__value === a[1]),
          u(A, le),
          u(G, se),
          u(G, g),
          u(g, D),
          (D.checked = D.__value === a[1]),
          u(g, _e),
          u(V, he),
          C.m(V, null),
          u(r, me),
          u(r, U),
          u(U, H),
          u(H, ve),
          u(U, be),
          u(U, Y),
          u(Y, B),
          We(B, a[3]),
          u(r, ke),
          u(r, Q),
          u(Q, Z),
          u(Z, K),
          u(K, R),
          (R.checked = a[4]),
          u(K, ge),
          u(Q, ye),
          O && O.m(Q, null),
          u(r, Ie),
          u(r, F),
          u(F, $),
          u($, z),
          u(z, we),
          u(F, Ee),
          u(F, x),
          u(x, J),
          u(J, De),
          u(t, Oe),
          u(t, ee),
          Je(M, ee, null),
          (ae = !0),
          Se ||
            ((Te = [
              X(h, 'change', a[13]),
              X(D, 'change', a[15]),
              X(B, 'input', a[17]),
              X(R, 'change', a[18]),
              X(z, 'click', a[8]),
              X(J, 'click', a[9])
            ]),
            (Se = !0));
      },
      p(p, [y]) {
        const W = {};
        !P && y & 128 && ((P = !0), (W.selectedItem = p[7]), dt(() => (P = !1))),
          i.$set(W),
          y & 2 && (h.checked = h.__value === p[1]),
          y & 2 && (D.checked = D.__value === p[1]),
          re === (re = Ae(p)) && C ? C.p(p, y) : (C.d(1), (C = re(p)), C && (C.c(), C.m(V, null))),
          y & 8 && ot(B.value) !== p[3] && We(B, p[3]),
          y & 16 && (R.checked = p[4]),
          p[4] && p[5]
            ? O
              ? O.p(p, y)
              : ((O = st(p)), O.c(), O.m(Q, null))
            : O && (O.d(1), (O = null));
        const S = {};
        y & 1 && (S.networkData = p[0]),
          y & 128 && (S.searchItem = p[7]),
          y & 4 && (S.properties = p[2]),
          y & 64 && (S.destroyGraph = p[6]),
          M.$set(S);
      },
      i(p) {
        ae || (Xe(i.$$.fragment, p), Xe(M.$$.fragment, p), (ae = !0));
      },
      o(p) {
        Ye(i.$$.fragment, p), Ye(M.$$.fragment, p), (ae = !1);
      },
      d(p) {
        p && d(l),
          p && d(s),
          p && d(t),
          Ze(i),
          a[14][1].splice(a[14][1].indexOf(h), 1),
          a[14][1].splice(a[14][1].indexOf(D), 1),
          C.d(),
          O && O.d(),
          Ze(M),
          (Se = !1),
          pt(Te);
      }
    }
  );
}
function Ot(a, l, e) {
  let s = {},
    t = 'preset',
    r = [].concat(...Object.values(pe)).map((g) => g.id),
    n = 1,
    c = !1,
    f = null,
    o = !1;
  async function i() {
    !j.id ||
      (e(6, (o = !1)), e(0, (s = {})), e(0, (s = await bt([j.id], r, n))), e(5, (f = s.query)));
  }
  function P() {
    e(7, (j = {})),
      e(0, (s = {})),
      e(1, (t = 'preset')),
      e(2, (r = [].concat(...Object.values(pe)).map((g) => g.id))),
      e(3, (n = 1)),
      e(4, (c = !1)),
      e(5, (f = null)),
      e(6, (o = !0));
  }
  let j = {};
  async function V(g) {
    if (g.length > 1) return await kt(g);
  }
  async function k(g) {
    Object.keys(g).length != 0 && (g.id, g.label);
  }
  _t(async () => {});
  const T = [[], []];
  function q(g) {
    (j = g), e(7, j);
  }
  function G() {
    (t = this.__value), e(1, t);
  }
  function A() {
    (t = this.__value), e(1, t);
  }
  function h() {
    (r = ht(T[0], this.__value, this.checked)), e(2, r);
  }
  function le() {
    (n = ot(this.value)), e(3, n);
  }
  function se() {
    (c = this.checked), e(4, c);
  }
  return [s, t, r, n, c, f, o, j, i, P, V, k, q, G, T, A, h, le, se];
}
class Vt extends at {
  constructor(l) {
    super(), rt(this, l, Ot, Dt, nt, {});
  }
}
export { Vt as default };
