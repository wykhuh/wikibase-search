import {
  S as ke,
  i as de,
  s as Ie,
  e as z,
  t as y,
  c as G,
  a as P,
  h as L,
  d as m,
  b as R,
  g as p,
  G as O,
  j as X,
  k as D,
  x as Y,
  l as S,
  m as H,
  y as Z,
  z as x,
  M as we,
  r as b,
  p as C,
  C as ee,
  q as K,
  N as W,
  w as Ce,
  o as Q
} from '../../chunks/index-3dbc572b.js';
import { I as Ne, C as ge } from '../../chunks/item_basic_info-d9e32901.js';
import '../../chunks/preload-helper-08e20361.js';
function ne(r, e, f) {
  const l = r.slice();
  return (l[14] = e[f]), l;
}
function se(r, e, f) {
  const l = r.slice();
  return (l[17] = e[f]), l;
}
function ie(r, e, f) {
  const l = r.slice();
  return (l[14] = e[f]), l;
}
function fe(r, e, f) {
  const l = r.slice();
  return (l[17] = e[f]), l;
}
function oe(r) {
  let e, f;
  return {
    c() {
      (e = z('h1')), (f = y('Loading...')), this.h();
    },
    l(l) {
      e = G(l, 'H1', { class: !0 });
      var n = P(e);
      (f = L(n, 'Loading...')), n.forEach(m), this.h();
    },
    h() {
      R(e, 'class', 'title is-2');
    },
    m(l, n) {
      p(l, e, n), O(e, f);
    },
    d(l) {
      l && m(e);
    }
  };
}
function re(r) {
  let e, f;
  return {
    c() {
      (e = z('h1')), (f = y(r[8])), this.h();
    },
    l(l) {
      e = G(l, 'H1', { class: !0 });
      var n = P(e);
      (f = L(n, r[8])), n.forEach(m), this.h();
    },
    h() {
      R(e, 'class', 'title is-2');
    },
    m(l, n) {
      p(l, e, n), O(e, f);
    },
    p(l, n) {
      n & 256 && X(f, l[8]);
    },
    d(l) {
      l && m(e);
    }
  };
}
function ce(r) {
  let e, f, l, n, u, i, o, s, _, M, N, F, T, B, j, J, k, w, d, v, le;
  o = new Ne({ props: { item: r[1], languageCodes: r[4] } });
  function te(t, c) {
    return t[7] ? Le : ye;
  }
  let V = te(r),
    A = V(r),
    U = r[5],
    h = [];
  for (let t = 0; t < U.length; t += 1) h[t] = ue(ie(r, U, t));
  const pe = (t) =>
    C(h[t], 1, 1, () => {
      h[t] = null;
    });
  let $ = r[6],
    g = [];
  for (let t = 0; t < $.length; t += 1) g[t] = me(ne(r, $, t));
  const be = (t) =>
    C(g[t], 1, 1, () => {
      g[t] = null;
    });
  return {
    c() {
      (e = z('h1')),
        (f = y(r[2])),
        (l = y(' (')),
        (n = y(r[0])),
        (u = y(')')),
        (i = D()),
        Y(o.$$.fragment),
        (s = D()),
        (_ = z('button')),
        A.c(),
        (M = D()),
        (N = z('h3')),
        (F = y('Statements')),
        (T = D());
      for (let t = 0; t < h.length; t += 1) h[t].c();
      (B = D()), (j = z('h3')), (J = y('Identifiers')), (k = D());
      for (let t = 0; t < g.length; t += 1) g[t].c();
      (w = S()), this.h();
    },
    l(t) {
      e = G(t, 'H1', { class: !0 });
      var c = P(e);
      (f = L(c, r[2])),
        (l = L(c, ' (')),
        (n = L(c, r[0])),
        (u = L(c, ')')),
        c.forEach(m),
        (i = H(t)),
        Z(o.$$.fragment, t),
        (s = H(t)),
        (_ = G(t, 'BUTTON', { class: !0 }));
      var I = P(_);
      A.l(I), I.forEach(m), (M = H(t)), (N = G(t, 'H3', { class: !0 }));
      var a = P(N);
      (F = L(a, 'Statements')), a.forEach(m), (T = H(t));
      for (let q = 0; q < h.length; q += 1) h[q].l(t);
      (B = H(t)), (j = G(t, 'H3', { class: !0 }));
      var E = P(j);
      (J = L(E, 'Identifiers')), E.forEach(m), (k = H(t));
      for (let q = 0; q < g.length; q += 1) g[q].l(t);
      (w = S()), this.h();
    },
    h() {
      R(e, 'class', 'title is-2'),
        R(_, 'class', 'button is-primary is-light'),
        R(N, 'class', 'title is-3'),
        R(j, 'class', 'title is-3');
    },
    m(t, c) {
      p(t, e, c),
        O(e, f),
        O(e, l),
        O(e, n),
        O(e, u),
        p(t, i, c),
        x(o, t, c),
        p(t, s, c),
        p(t, _, c),
        A.m(_, null),
        p(t, M, c),
        p(t, N, c),
        O(N, F),
        p(t, T, c);
      for (let I = 0; I < h.length; I += 1) h[I].m(t, c);
      p(t, B, c), p(t, j, c), O(j, J), p(t, k, c);
      for (let I = 0; I < g.length; I += 1) g[I].m(t, c);
      p(t, w, c), (d = !0), v || ((le = we(_, 'click', r[9])), (v = !0));
    },
    p(t, c) {
      (!d || c & 4) && X(f, t[2]), (!d || c & 1) && X(n, t[0]);
      const I = {};
      if (
        (c & 2 && (I.item = t[1]),
        c & 16 && (I.languageCodes = t[4]),
        o.$set(I),
        V !== (V = te(t)) && (A.d(1), (A = V(t)), A && (A.c(), A.m(_, null))),
        c & 32)
      ) {
        U = t[5];
        let a;
        for (a = 0; a < U.length; a += 1) {
          const E = ie(t, U, a);
          h[a]
            ? (h[a].p(E, c), b(h[a], 1))
            : ((h[a] = ue(E)), h[a].c(), b(h[a], 1), h[a].m(B.parentNode, B));
        }
        for (Q(), a = U.length; a < h.length; a += 1) pe(a);
        K();
      }
      if (c & 64) {
        $ = t[6];
        let a;
        for (a = 0; a < $.length; a += 1) {
          const E = ne(t, $, a);
          g[a]
            ? (g[a].p(E, c), b(g[a], 1))
            : ((g[a] = me(E)), g[a].c(), b(g[a], 1), g[a].m(w.parentNode, w));
        }
        for (Q(), a = $.length; a < g.length; a += 1) be(a);
        K();
      }
    },
    i(t) {
      if (!d) {
        b(o.$$.fragment, t);
        for (let c = 0; c < U.length; c += 1) b(h[c]);
        for (let c = 0; c < $.length; c += 1) b(g[c]);
        d = !0;
      }
    },
    o(t) {
      C(o.$$.fragment, t), (h = h.filter(Boolean));
      for (let c = 0; c < h.length; c += 1) C(h[c]);
      g = g.filter(Boolean);
      for (let c = 0; c < g.length; c += 1) C(g[c]);
      d = !1;
    },
    d(t) {
      t && m(e),
        t && m(i),
        ee(o, t),
        t && m(s),
        t && m(_),
        A.d(),
        t && m(M),
        t && m(N),
        t && m(T),
        W(h, t),
        t && m(B),
        t && m(j),
        t && m(k),
        W(g, t),
        t && m(w),
        (v = !1),
        le();
    }
  };
}
function ye(r) {
  let e;
  return {
    c() {
      e = y('All entered languages');
    },
    l(f) {
      e = L(f, 'All entered languages');
    },
    m(f, l) {
      p(f, e, l);
    },
    d(f) {
      f && m(e);
    }
  };
}
function Le(r) {
  let e;
  return {
    c() {
      e = y('Fewer languages');
    },
    l(f) {
      e = L(f, 'Fewer languages');
    },
    m(f, l) {
      p(f, e, l);
    },
    d(f) {
      f && m(e);
    }
  };
}
function ae(r) {
  let e, f;
  return (
    (e = new ge({ props: { claim: r[17] } })),
    {
      c() {
        Y(e.$$.fragment);
      },
      l(l) {
        Z(e.$$.fragment, l);
      },
      m(l, n) {
        x(e, l, n), (f = !0);
      },
      p(l, n) {
        const u = {};
        n & 32 && (u.claim = l[17]), e.$set(u);
      },
      i(l) {
        f || (b(e.$$.fragment, l), (f = !0));
      },
      o(l) {
        C(e.$$.fragment, l), (f = !1);
      },
      d(l) {
        ee(e, l);
      }
    }
  );
}
function ue(r) {
  let e,
    f,
    l = r[14],
    n = [];
  for (let i = 0; i < l.length; i += 1) n[i] = ae(fe(r, l, i));
  const u = (i) =>
    C(n[i], 1, 1, () => {
      n[i] = null;
    });
  return {
    c() {
      for (let i = 0; i < n.length; i += 1) n[i].c();
      e = S();
    },
    l(i) {
      for (let o = 0; o < n.length; o += 1) n[o].l(i);
      e = S();
    },
    m(i, o) {
      for (let s = 0; s < n.length; s += 1) n[s].m(i, o);
      p(i, e, o), (f = !0);
    },
    p(i, o) {
      if (o & 32) {
        l = i[14];
        let s;
        for (s = 0; s < l.length; s += 1) {
          const _ = fe(i, l, s);
          n[s]
            ? (n[s].p(_, o), b(n[s], 1))
            : ((n[s] = ae(_)), n[s].c(), b(n[s], 1), n[s].m(e.parentNode, e));
        }
        for (Q(), s = l.length; s < n.length; s += 1) u(s);
        K();
      }
    },
    i(i) {
      if (!f) {
        for (let o = 0; o < l.length; o += 1) b(n[o]);
        f = !0;
      }
    },
    o(i) {
      n = n.filter(Boolean);
      for (let o = 0; o < n.length; o += 1) C(n[o]);
      f = !1;
    },
    d(i) {
      W(n, i), i && m(e);
    }
  };
}
function _e(r) {
  let e, f;
  return (
    (e = new ge({ props: { claim: r[17] } })),
    {
      c() {
        Y(e.$$.fragment);
      },
      l(l) {
        Z(e.$$.fragment, l);
      },
      m(l, n) {
        x(e, l, n), (f = !0);
      },
      p(l, n) {
        const u = {};
        n & 64 && (u.claim = l[17]), e.$set(u);
      },
      i(l) {
        f || (b(e.$$.fragment, l), (f = !0));
      },
      o(l) {
        C(e.$$.fragment, l), (f = !1);
      },
      d(l) {
        ee(e, l);
      }
    }
  );
}
function me(r) {
  let e,
    f,
    l = r[14],
    n = [];
  for (let i = 0; i < l.length; i += 1) n[i] = _e(se(r, l, i));
  const u = (i) =>
    C(n[i], 1, 1, () => {
      n[i] = null;
    });
  return {
    c() {
      for (let i = 0; i < n.length; i += 1) n[i].c();
      e = S();
    },
    l(i) {
      for (let o = 0; o < n.length; o += 1) n[o].l(i);
      e = S();
    },
    m(i, o) {
      for (let s = 0; s < n.length; s += 1) n[s].m(i, o);
      p(i, e, o), (f = !0);
    },
    p(i, o) {
      if (o & 64) {
        l = i[14];
        let s;
        for (s = 0; s < l.length; s += 1) {
          const _ = se(i, l, s);
          n[s]
            ? (n[s].p(_, o), b(n[s], 1))
            : ((n[s] = _e(_)), n[s].c(), b(n[s], 1), n[s].m(e.parentNode, e));
        }
        for (Q(), s = l.length; s < n.length; s += 1) u(s);
        K();
      }
    },
    i(i) {
      if (!f) {
        for (let o = 0; o < l.length; o += 1) b(n[o]);
        f = !0;
      }
    },
    o(i) {
      n = n.filter(Boolean);
      for (let o = 0; o < n.length; o += 1) C(n[o]);
      f = !1;
    },
    d(i) {
      W(n, i), i && m(e);
    }
  };
}
function je(r) {
  let e,
    f,
    l,
    n,
    u = r[3] && oe(),
    i = r[8] && re(r),
    o = r[1] && ce(r);
  return {
    c() {
      u && u.c(), (e = D()), i && i.c(), (f = D()), o && o.c(), (l = S());
    },
    l(s) {
      u && u.l(s), (e = H(s)), i && i.l(s), (f = H(s)), o && o.l(s), (l = S());
    },
    m(s, _) {
      u && u.m(s, _), p(s, e, _), i && i.m(s, _), p(s, f, _), o && o.m(s, _), p(s, l, _), (n = !0);
    },
    p(s, [_]) {
      s[3] ? u || ((u = oe()), u.c(), u.m(e.parentNode, e)) : u && (u.d(1), (u = null)),
        s[8]
          ? i
            ? i.p(s, _)
            : ((i = re(s)), i.c(), i.m(f.parentNode, f))
          : i && (i.d(1), (i = null)),
        s[1]
          ? o
            ? (o.p(s, _), _ & 2 && b(o, 1))
            : ((o = ce(s)), o.c(), b(o, 1), o.m(l.parentNode, l))
          : o &&
            (Q(),
            C(o, 1, 1, () => {
              o = null;
            }),
            K());
    },
    i(s) {
      n || (b(o), (n = !0));
    },
    o(s) {
      C(o), (n = !1);
    },
    d(s) {
      u && u.d(s), s && m(e), i && i.d(s), s && m(f), o && o.d(s), s && m(l);
    }
  };
}
async function He({ params: r }) {
  return { props: { currentId: r.id } };
}
let Ae = 'http://localhost:8000',
  he = 5;
function Be(r, e, f) {
  let { currentId: l } = e,
    n = null,
    u = null,
    i = !1,
    o = new Set(),
    s = [],
    _ = [],
    M = [],
    N = !1,
    F = null;
  function T() {
    f(7, (N = !N)), N ? f(4, (s = o)) : f(4, (s = o.slice(0, he)));
  }
  function B(k) {
    let w = k.languages,
      d = Object.keys(w);
    if (w.en) {
      let v = d.indexOf('en');
      d = ['en', ...d.slice(0, v), ...d.slice(v + 1)];
    }
    (o = d), f(4, (s = d.slice(0, he)));
  }
  function j(k) {
    f(5, (_ = (k.statements && Object.values(k.statements)) || [])),
      f(6, (M = (k.identifiers && Object.values(k.identifiers)) || [])),
      B(k);
  }
  async function J() {
    f(3, (i = !0));
    const k = Ae + '/items/' + l,
      w = await fetch(k);
    if ((f(3, (i = !1)), w.ok)) {
      let d = await w.json();
      f(1, (n = d.data)), f(0, (l = d.id)), f(2, (u = d.label)), j(n);
    } else w.status == 404 && f(8, (F = 'Item not found.'));
  }
  return (
    Ce(async () => {
      await J();
    }),
    (r.$$set = (k) => {
      'currentId' in k && f(0, (l = k.currentId));
    }),
    [l, n, u, i, s, _, M, N, F, T]
  );
}
class Se extends ke {
  constructor(e) {
    super(), de(this, e, Be, je, Ie, { currentId: 0 });
  }
}
export { Se as default, He as load };
