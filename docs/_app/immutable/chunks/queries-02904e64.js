const E = 'https://query.wikidata.org/sparql',
  P = 'https://www.wikidata.org/w/api.php?';
async function C(t) {
  return await c(t, (e) => q(e, l.choreographer));
}
async function _(t) {
  return await c(t, (e) => d(e, l.choreographer));
}
async function D(t) {
  return await c(t, (e) => d(e, l['notable works']));
}
async function N(t) {
  return await c(t, (e) => d(e, l.country));
}
async function T(t) {
  return await c(t, (e) => w(e, l.student, l['student of']));
}
async function F(t) {
  return await c(t, (e) => w(e, l['student of'], l.student));
}
async function O(t) {
  return await c(t, (e) => d(e, l['location of first performance']));
}
async function c(t, a) {
  let e = {};
  for (const i of t) {
    let r = await m(a(i)),
      n = I(r, i);
    e = Object.assign(e, n);
  }
  return e;
}
function w(t, a, e) {
  let i = `
    SELECT ?item ?itemLabel ?itemDescription WHERE {
      {wd:${t} wdt:${a} ?item.}
      UNION
      {?item wdt:${e} wd:${t}.}
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
  return console.log(i), i;
}
function d(t, a) {
  let e = `
    SELECT ?item ?itemLabel ?itemDescription WHERE {
      wd:${t} wdt:${a} ?item.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
  return console.log(e), e;
}
function q(t, a) {
  let e = `
    SELECT ?item ?itemLabel ?itemDescription WHERE {
      ?item wdt:${a} wd:${t}.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
  return console.log(e), e;
}
async function m(t) {
  const a = E + '?query=' + encodeURIComponent(t);
  return (await (await fetch(a, { headers: { Accept: 'application/sparql-results+json' } })).json())
    .results.bindings;
}
function u(t, a) {
  return a[t].value.split('/')[4];
}
function I(t, a) {
  let e = {},
    i = new Set();
  return (
    t.forEach((r) => {
      let n = u('item', r);
      if (!i.has(n)) {
        e[a] || (e[a] = {});
        let o = r.itemLabel ? r.itemLabel.value : '',
          s = r.itemDescription ? r.itemDescription.value : '';
        (e[a][n] = { id: n, label: o, description: s, subjectId: a }), i.add(n);
      }
    }),
    e
  );
}
async function L(t) {
  let e = `
  SELECT DISTINCT ?item ?itemLabel {
      VALUES (?record) {${t.map((i) => `(wd:${i})`).join(' ')}}
      ?record ?p ?statement .
      ?item wikibase:claim ?p .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  `;
  return await m(e);
}
function k(t) {
  let a = {},
    e = j();
  return (
    t.forEach((i) => {
      let r = i.item.value.split('/')[4],
        n = i.itemLabel.value;
      e[r] && (a[r] = n);
    }),
    a
  );
}
async function W(t) {
  let a = await L(t);
  return k(a);
}
async function S(t, a = 'en') {
  let e = {
    action: 'wbsearchentities',
    format: 'json',
    errorformat: 'plaintext',
    language: a,
    uselang: a,
    type: 'item',
    search: t,
    origin: '*'
  };
  const i = P + new URLSearchParams(e);
  return (await (await fetch(i)).json()).search;
}
function R(t) {
  if (t.length == 0) return [];
  let a = [];
  return (
    t.forEach((e) => {
      let i;
      e.label ? (i = e.label) : 'aliases' in e && (i = e.aliases[0]);
      let r = i;
      e.description && (r += ` (${e.description})`),
        a.push({ id: e.id, label: i, search_label: r });
    }),
    a
  );
}
async function U(t, a = 'en') {
  let e = await S(t, a);
  return R(e);
}
async function y(t, a) {
  let e = a.map((o) => `wdt:${o}`).join(', '),
    r = `
  SELECT DISTINCT ?prop ?propLabel ?selectedItem ?selectedItemLabel ?itemF ?itemFLabel ?itemR ?itemRLabel WHERE {
    VALUES ?selectedItem {
      ${t.map((o) => `wd:${o}`).join(' ')}
    }
    { ?selectedItem ?prop_ ?itemF. }
    UNION
    { ?itemR ?prop_ ?selectedItem. }
    ?prop wikibase:directClaim ?prop_.
    FILTER(?prop_ IN(${e}))
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  LIMIT 1000
  `;
  return console.log(r), { data: await m(r), query: r };
}
function g(t) {
  let a = new Set(),
    e = [],
    i = [];
  return (
    t.forEach((r) => {
      let n,
        o,
        s,
        p,
        b = u('prop', r),
        h = r.propLabel.value;
      r.itemF
        ? ((n = u('selectedItem', r)),
          (o = r.selectedItemLabel.value),
          (s = u('itemF', r)),
          (p = r.itemFLabel.value))
        : ((n = u('itemR', r)),
          (o = r.itemRLabel.value),
          (s = u('selectedItem', r)),
          (p = r.selectedItemLabel.value)),
        a.has(n) || (a.add(n), e.push({ id: n, label: o })),
        a.has(s) || (a.add(s), e.push({ id: s, label: p }));
      let f = `${n} ${b} ${s}`;
      a.has(f) || (a.add(f), i.push({ from: n, to: s, property_id: b, label: h }));
    }),
    { nodes: e, edges: i }
  );
}
async function V(t, a, e) {
  let i;
  for (; e > 0; ) {
    let r = await y(t, a);
    (i = g(r.data)), (i.query = r.query), (t = i.nodes.map((n) => n.id)), (e = e - 1);
  }
  return i;
}
async function M(t, a) {
  let e = await y([t], a),
    i = g(e.data);
  return (i.query = e.query), i;
}
let l = {
  choreographer: 'P1809',
  composer: 'P86',
  'costume designer': 'P2515',
  'lighting designer': 'P5026',
  'location of first performance': 'P4647',
  'musical conductor': 'P3300',
  'notable works': 'P800',
  'production designer': 'P2554',
  scenographer: 'P4608',
  'student of': 'P1066',
  student: 'P802'
};
const j = () => Object.fromEntries(Object.entries(l).map(([t, a]) => [a, t]));
let v = [
    { label: 'notable works', id: 'P800' },
    { label: 'student of', id: 'P1066' },
    { label: 'student', id: 'P802' }
  ],
  A = [{}],
  $ = [
    { label: 'choreographer', id: 'P1809' },
    { label: 'composer', id: 'P86' },
    { label: 'costume designer', id: 'P2515' },
    { label: 'lighting designer', id: 'P5026' },
    { label: 'location of first performance', id: 'P4647' },
    { label: 'musical conductor', id: 'P3300' },
    { label: 'production designer', id: 'P2554' },
    { label: 'scenographer', id: 'P4608' }
  ],
  Q = { people: v, works: $ };
export {
  O as a,
  _ as b,
  C as c,
  D as d,
  T as e,
  F as f,
  N as g,
  W as h,
  M as i,
  Q as j,
  V as k,
  g as l,
  v as p,
  U as s,
  A as v,
  $ as w
};
