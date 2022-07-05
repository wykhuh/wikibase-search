import {
  S as q,
  i as F,
  s as J,
  F as O,
  e as p,
  t as j,
  k as A,
  c as b,
  a as $,
  h as L,
  d as i,
  m as G,
  b as l,
  g as H,
  G as o,
  H as T,
  I as w,
  J as x,
  r as z,
  p as B
} from '../chunks/index-3dbc572b.js';
import { b as I } from '../chunks/paths-396f020f.js';
function K(u) {
  let t, s, n, d, m, _, E, y, c, D, k, f, v;
  const g = u[1].default,
    e = O(g, u, u[0], null);
  return {
    c() {
      (t = p('nav')),
        (s = p('div')),
        (n = p('a')),
        (d = j('Home')),
        (m = A()),
        (_ = p('a')),
        (E = j('Linked Data')),
        (y = A()),
        (c = p('a')),
        (D = j('Linked Data Graph')),
        (k = A()),
        (f = p('section')),
        e && e.c(),
        this.h();
    },
    l(a) {
      t = b(a, 'NAV', { class: !0, 'aria-label': !0 });
      var r = $(t);
      s = b(r, 'DIV', { class: !0 });
      var h = $(s);
      n = b(h, 'A', { href: !0, class: !0 });
      var S = $(n);
      (d = L(S, 'Home')), S.forEach(i), (m = G(h)), (_ = b(h, 'A', { href: !0, class: !0 }));
      var C = $(_);
      (E = L(C, 'Linked Data')), C.forEach(i), (y = G(h)), (c = b(h, 'A', { href: !0, class: !0 }));
      var N = $(c);
      (D = L(N, 'Linked Data Graph')),
        N.forEach(i),
        h.forEach(i),
        r.forEach(i),
        (k = G(a)),
        (f = b(a, 'SECTION', { class: !0 }));
      var V = $(f);
      e && e.l(V), V.forEach(i), this.h();
    },
    h() {
      l(n, 'href', I),
        l(n, 'class', 'navbar-item'),
        l(_, 'href', `${I}/linked_data`),
        l(_, 'class', 'navbar-item'),
        l(c, 'href', `${I}/linked_data_graph`),
        l(c, 'class', 'navbar-item'),
        l(s, 'class', 'navbar-menu is-active'),
        l(t, 'class', 'navbar svelte-1jon02n'),
        l(t, 'aria-label', 'main navigation'),
        l(f, 'class', 'main svelte-1jon02n');
    },
    m(a, r) {
      H(a, t, r),
        o(t, s),
        o(s, n),
        o(n, d),
        o(s, m),
        o(s, _),
        o(_, E),
        o(s, y),
        o(s, c),
        o(c, D),
        H(a, k, r),
        H(a, f, r),
        e && e.m(f, null),
        (v = !0);
    },
    p(a, [r]) {
      e && e.p && (!v || r & 1) && T(e, g, a, a[0], v ? x(g, a[0], r, null) : w(a[0]), null);
    },
    i(a) {
      v || (z(e, a), (v = !0));
    },
    o(a) {
      B(e, a), (v = !1);
    },
    d(a) {
      a && i(t), a && i(k), a && i(f), e && e.d(a);
    }
  };
}
function M(u, t, s) {
  let { $$slots: n = {}, $$scope: d } = t;
  return (
    (u.$$set = (m) => {
      '$$scope' in m && s(0, (d = m.$$scope));
    }),
    [d, n]
  );
}
class R extends q {
  constructor(t) {
    super(), F(this, t, M, K, J, {});
  }
}
export { R as default };
