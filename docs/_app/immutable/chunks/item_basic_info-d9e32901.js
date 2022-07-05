import {
  S as $e,
  i as Oe,
  s as je,
  e as w,
  c as $,
  a as O,
  d,
  b as B,
  g as D,
  G as m,
  n as E,
  w as or,
  l as L,
  o as ne,
  p as I,
  q as ae,
  r as M,
  t as S,
  h as q,
  V as ir,
  W as lr,
  x as he,
  k as C,
  y as de,
  m as A,
  z as me,
  C as pe,
  j as ze,
  X as Rt,
  N as Ue,
  Y as Wt
} from './index-3dbc572b.js';
import { _ as sr } from './preload-helper-08e20361.js';
const ur = 60 * 60 * 1e3,
  dt = (e, t, r) => {
    const [n, a] = e.split('/'),
      [o, i] = a.split(':');
    return Date.UTC(r, n - 1, o, i) - t * ur;
  },
  cr = (e, t, r, n, a) => {
    const o = new Date(e).getUTCFullYear(),
      i = dt(t, a, o),
      c = dt(r, n, o);
    return e >= i && e < c;
  };
var Jt = cr;
const fr = (e) => {
  let r = e.timezones[e.tz];
  if (r === void 0) return console.warn("Warning: couldn't find timezone " + e.tz), 0;
  if (r.dst === void 0) return r.offset;
  let n = r.offset,
    a = r.offset + 1;
  r.hem === 'n' && (a = n - 1);
  let o = r.dst.split('->');
  return Jt(e.epoch, o[0], o[1], n, a) === !0 ? n : a;
};
var hr = fr,
  mt = {
    '9|s': '2/dili,2/jayapura',
    '9|n': '2/chita,2/khandyga,2/pyongyang,2/seoul,2/tokyo,11/palau,japan,rok',
    '9.5|s|04/03:03->10/02:02': '4/adelaide,4/broken_hill,4/south,4/yancowinna',
    '9.5|s': '4/darwin,4/north',
    '8|s|03/08:01->10/04:00': '12/casey',
    '8|s': '2/kuala_lumpur,2/makassar,2/singapore,4/perth,2/ujung_pandang,4/west,singapore',
    '8|n':
      '2/brunei,2/choibalsan,2/hong_kong,2/irkutsk,2/kuching,2/macau,2/manila,2/shanghai,2/taipei,2/ulaanbaatar,2/chongqing,2/chungking,2/harbin,2/macao,2/ulan_bator,hongkong,prc,roc',
    '8.75|s': '4/eucla',
    '7|s': '12/davis,2/jakarta,9/christmas',
    '7|n':
      '2/bangkok,2/barnaul,2/hovd,2/krasnoyarsk,2/novokuznetsk,2/novosibirsk,2/phnom_penh,2/pontianak,2/ho_chi_minh,2/tomsk,2/vientiane,2/saigon',
    '6|s': '12/vostok',
    '6|n':
      '2/almaty,2/bishkek,2/dhaka,2/omsk,2/qyzylorda,2/qostanay,2/thimphu,2/urumqi,9/chagos,2/dacca,2/kashgar,2/thimbu',
    '6.5|n': '2/yangon,9/cocos,2/rangoon',
    '5|s': '12/mawson,9/kerguelen',
    '5|n':
      '2/aqtau,2/aqtobe,2/ashgabat,2/atyrau,2/dushanbe,2/karachi,2/oral,2/samarkand,2/tashkent,2/yekaterinburg,9/maldives,2/ashkhabad',
    '5.75|n': '2/katmandu,2/kathmandu',
    '5.5|n': '2/kolkata,2/colombo,2/calcutta',
    '4|s': '9/reunion',
    '4|n':
      '2/baku,2/dubai,2/muscat,2/tbilisi,2/yerevan,8/astrakhan,8/samara,8/saratov,8/ulyanovsk,8/volgograd,2/volgograd,9/mahe,9/mauritius',
    '4.5|n|03/22:00->09/21:24': '2/tehran,iran',
    '4.5|n': '2/kabul',
    '3|s': '12/syowa,9/antananarivo',
    '3|n|03/27:03->10/30:04':
      '2/famagusta,2/nicosia,8/athens,8/bucharest,8/helsinki,8/kiev,8/mariehamn,8/riga,8/sofia,8/tallinn,8/uzhgorod,8/vilnius,8/zaporozhye,8/nicosia',
    '3|n|03/27:02->10/30:03': '8/chisinau,8/tiraspol',
    '3|n|03/27:00->10/29:24': '2/beirut',
    '3|n|03/27:00->10/28:01': '2/gaza,2/hebron',
    '3|n|03/25:02->10/30:02': '2/jerusalem,2/tel_aviv,israel',
    '3|n|03/25:00->10/27:24': '2/damascus',
    '3|n|02/25:00->10/28:01': '2/amman',
    '3|n':
      '0/addis_ababa,0/asmara,0/asmera,0/dar_es_salaam,0/djibouti,0/juba,0/kampala,0/mogadishu,0/nairobi,2/aden,2/baghdad,2/bahrain,2/kuwait,2/qatar,2/riyadh,8/istanbul,8/kirov,8/minsk,8/moscow,8/simferopol,9/comoro,9/mayotte,2/istanbul,turkey,w-su',
    '2|s|03/27:02->10/30:02': '12/troll',
    '2|s': '0/gaborone,0/harare,0/johannesburg,0/lubumbashi,0/lusaka,0/maputo,0/maseru,0/mbabane',
    '2|n|03/27:02->10/30:03':
      '0/ceuta,arctic/longyearbyen,8/amsterdam,8/andorra,8/belgrade,8/berlin,8/bratislava,8/brussels,8/budapest,8/busingen,8/copenhagen,8/gibraltar,8/ljubljana,8/luxembourg,8/madrid,8/malta,8/monaco,8/oslo,8/paris,8/podgorica,8/prague,8/rome,8/san_marino,8/sarajevo,8/skopje,8/stockholm,8/tirane,8/vaduz,8/vatican,8/vienna,8/warsaw,8/zagreb,8/zurich,3/jan_mayen,poland',
    '2|n': '0/blantyre,0/bujumbura,0/cairo,0/khartoum,0/kigali,0/tripoli,8/kaliningrad,egypt,libya',
    '1|s': '0/brazzaville,0/kinshasa,0/luanda,0/windhoek',
    '1|n|03/27:03->05/08:02': '0/casablanca,0/el_aaiun',
    '1|n|03/27:01->10/30:02':
      '3/canary,3/faroe,3/madeira,8/dublin,8/guernsey,8/isle_of_man,8/jersey,8/lisbon,8/london,3/faeroe,eire,8/belfast,gb-eire,gb,portugal',
    '1|n':
      '0/algiers,0/bangui,0/douala,0/lagos,0/libreville,0/malabo,0/ndjamena,0/niamey,0/porto-novo,0/tunis',
    '14|n': '11/kiritimati',
    '13|s|04/04:04->09/26:03': '11/apia',
    '13|s|01/15:02->11/05:03': '11/tongatapu',
    '13|n': '11/enderbury,11/fakaofo',
    '12|s|04/03:03->09/25:02': '12/mcmurdo,11/auckland,12/south_pole,nz',
    '12|s|01/17:03->11/14:02': '11/fiji',
    '12|n':
      '2/anadyr,2/kamchatka,2/srednekolymsk,11/funafuti,11/kwajalein,11/majuro,11/nauru,11/tarawa,11/wake,11/wallis,kwajalein',
    '12.75|s|04/03:03->04/03:02': '11/chatham,nz-chat',
    '11|s|04/03:03->10/02:02': '12/macquarie',
    '11|s': '11/bougainville',
    '11|n': '2/magadan,2/sakhalin,11/efate,11/guadalcanal,11/kosrae,11/noumea,11/pohnpei,11/ponape',
    '11.5|n|04/03:03->10/02:02': '11/norfolk',
    '10|s|04/03:03->10/02:02':
      '4/currie,4/hobart,4/melbourne,4/sydney,4/act,4/canberra,4/nsw,4/tasmania,4/victoria',
    '10|s': '12/dumontdurville,4/brisbane,4/lindeman,11/port_moresby,4/queensland',
    '10|n': '2/ust-nera,2/vladivostok,2/yakutsk,11/guam,11/saipan,11/chuuk,11/truk,11/yap',
    '10.5|s|04/03:01->10/02:02': '4/lord_howe,4/lhi',
    '0|n|03/27:00->10/30:01': '1/scoresbysund,3/azores',
    '0|n':
      '0/abidjan,0/accra,0/bamako,0/banjul,0/bissau,0/conakry,0/dakar,0/freetown,0/lome,0/monrovia,0/nouakchott,0/ouagadougou,0/sao_tome,1/danmarkshavn,3/reykjavik,3/st_helena,13/gmt,13/utc,0/timbuktu,13/greenwich,13/uct,13/universal,13/zulu,gmt-0,gmt+0,gmt0,greenwich,iceland,uct,universal,utc,zulu',
    '-9|n|03/13:02->11/06:02': '1/adak,1/atka,us/aleutian',
    '-9|n': '11/gambier',
    '-9.5|n': '11/marquesas',
    '-8|n|03/13:02->11/06:02':
      '1/anchorage,1/juneau,1/metlakatla,1/nome,1/sitka,1/yakutat,us/alaska',
    '-8|n': '11/pitcairn',
    '-7|n|03/13:02->11/06:02':
      '1/los_angeles,1/santa_isabel,1/tijuana,1/vancouver,1/ensenada,6/pacific,10/bajanorte,us/pacific-new,us/pacific',
    '-7|n|03/08:02->11/01:01': '1/dawson,1/whitehorse,6/yukon',
    '-7|n': '1/creston,1/dawson_creek,1/fort_nelson,1/hermosillo,1/phoenix,us/arizona',
    '-6|s|04/02:22->09/03:22': '11/easter,7/easterisland',
    '-6|n|04/03:02->10/30:02': '1/chihuahua,1/mazatlan,10/bajasur',
    '-6|n|03/13:02->11/06:02':
      '1/boise,1/cambridge_bay,1/denver,1/edmonton,1/inuvik,1/ojinaga,1/yellowknife,1/shiprock,6/mountain,navajo,us/mountain',
    '-6|n':
      '1/belize,1/costa_rica,1/el_salvador,1/guatemala,1/managua,1/regina,1/swift_current,1/tegucigalpa,11/galapagos,6/east-saskatchewan,6/saskatchewan',
    '-5|s': '1/lima,1/rio_branco,1/porto_acre,5/acre',
    '-5|n|04/03:02->10/30:02': '1/bahia_banderas,1/merida,1/mexico_city,1/monterrey,10/general',
    '-5|n|03/13:02->11/06:02':
      '1/chicago,1/matamoros,1/menominee,1/rainy_river,1/rankin_inlet,1/resolute,1/winnipeg,1/indiana/knox,1/indiana/tell_city,1/north_dakota/beulah,1/north_dakota/center,1/north_dakota/new_salem,1/knox_in,6/central,us/central,us/indiana-starke',
    '-5|n|03/12:03->11/05:01': '1/north_dakota',
    '-5|n':
      '1/bogota,1/cancun,1/cayman,1/coral_harbour,1/eirunepe,1/guayaquil,1/jamaica,1/panama,1/atikokan,jamaica',
    '-4|s|05/13:23->08/13:01': '12/palmer',
    '-4|s|04/02:24->09/04:00': '1/santiago,7/continental',
    '-4|s|03/26:24->10/02:00': '1/asuncion',
    '-4|s|02/16:24->11/03:00': '1/campo_grande,1/cuiaba',
    '-4|s': '1/la_paz,1/manaus,5/west',
    '-4|n|03/13:02->11/06:02':
      '1/detroit,1/grand_turk,1/indianapolis,1/iqaluit,1/louisville,1/montreal,1/nassau,1/new_york,1/nipigon,1/pangnirtung,1/port-au-prince,1/thunder_bay,1/toronto,1/indiana/marengo,1/indiana/petersburg,1/indiana/vevay,1/indiana/vincennes,1/indiana/winamac,1/kentucky/monticello,1/fort_wayne,1/indiana/indianapolis,1/kentucky/louisville,6/eastern,us/east-indiana,us/eastern,us/michigan',
    '-4|n|03/13:00->11/06:01': '1/havana,cuba',
    '-4|n|03/12:03->11/05:01': '1/indiana,1/kentucky',
    '-4|n':
      '1/anguilla,1/antigua,1/aruba,1/barbados,1/blanc-sablon,1/boa_vista,1/caracas,1/curacao,1/dominica,1/grenada,1/guadeloupe,1/guyana,1/kralendijk,1/lower_princes,1/marigot,1/martinique,1/montserrat,1/port_of_spain,1/porto_velho,1/puerto_rico,1/santo_domingo,1/st_barthelemy,1/st_kitts,1/st_lucia,1/st_thomas,1/st_vincent,1/tortola,1/virgin',
    '-3|s':
      '1/argentina,1/buenos_aires,1/catamarca,1/cordoba,1/fortaleza,1/jujuy,1/mendoza,1/montevideo,1/punta_arenas,1/sao_paulo,12/rothera,3/stanley,1/argentina/la_rioja,1/argentina/rio_gallegos,1/argentina/salta,1/argentina/san_juan,1/argentina/san_luis,1/argentina/tucuman,1/argentina/ushuaia,1/argentina/comodrivadavia,1/argentina/buenos_aires,1/argentina/catamarca,1/argentina/cordoba,1/argentina/jujuy,1/argentina/mendoza,1/argentina/rosario,1/rosario,5/east',
    '-3|n|03/13:02->11/06:02':
      '1/glace_bay,1/goose_bay,1/halifax,1/moncton,1/thule,3/bermuda,6/atlantic',
    '-3|n': '1/araguaina,1/bahia,1/belem,1/cayenne,1/maceio,1/paramaribo,1/recife,1/santarem',
    '-2|n|03/26:22->10/29:23': '1/nuuk,1/godthab',
    '-2|n|03/13:02->11/06:02': '1/miquelon',
    '-2|n': '1/noronha,3/south_georgia,5/denoronha',
    '-2.5|n|03/13:02->11/06:02': '1/st_johns,6/newfoundland',
    '-1|n': '3/cape_verde',
    '-11|n': '11/midway,11/niue,11/pago_pago,11/samoa,us/samoa',
    '-10|n': '11/honolulu,11/johnston,11/rarotonga,11/tahiti,us/hawaii'
  },
  dr = [
    'africa',
    'america',
    'asia',
    'atlantic',
    'australia',
    'brazil',
    'canada',
    'chile',
    'europe',
    'indian',
    'mexico',
    'pacific',
    'antarctica',
    'etc'
  ];
let Ie = {};
Object.keys(mt).forEach((e) => {
  let t = e.split('|'),
    r = { offset: Number(t[0]), hem: t[1] };
  t[2] && (r.dst = t[2]),
    mt[e].split(',').forEach((a) => {
      (a = a.replace(/(^[0-9]+)\//, (o, i) => ((i = Number(i)), dr[i] + '/'))), (Ie[a] = r);
    });
});
Ie.utc = { offset: 0, hem: 'n' };
for (let e = -14; e <= 14; e += 0.5) {
  let t = e;
  t > 0 && (t = '+' + t);
  let r = 'etc/gmt' + t;
  (Ie[r] = { offset: e * -1, hem: 'n' }),
    (r = 'utc/gmt' + t),
    (Ie[r] = { offset: e * -1, hem: 'n' });
}
var Kt = Ie;
const mr = 'utc',
  pr = () => {
    if (typeof Intl == 'undefined' || typeof Intl.DateTimeFormat == 'undefined') return null;
    let e = Intl.DateTimeFormat();
    if (typeof e == 'undefined' || typeof e.resolvedOptions == 'undefined') return null;
    let t = e.resolvedOptions().timeZone;
    return t ? t.toLowerCase() : null;
  },
  yr = () => {
    let e = pr();
    return e === null ? mr : e;
  };
var gr = yr;
const _r = /(\-?[0-9]+)h(rs)?/i,
  br = /(\-?[0-9]+)/,
  kr = /utc([\-+]?[0-9]+)/i,
  vr = /gmt([\-+]?[0-9]+)/i,
  Ye = function (e) {
    return (
      (e = Number(e)),
      e >= -13 && e <= 13 ? ((e = e * -1), (e = (e > 0 ? '+' : '') + e), 'etc/gmt' + e) : null
    );
  },
  wr = function (e) {
    let t = e.match(_r);
    if (t !== null || ((t = e.match(kr)), t !== null)) return Ye(t[1]);
    if (((t = e.match(vr)), t !== null)) {
      let r = Number(t[1]) * -1;
      return Ye(r);
    }
    return (t = e.match(br)), t !== null ? Ye(t[1]) : null;
  };
var $r = wr;
const Or = gr(),
  pt = Object.keys(Kt).reduce((e, t) => {
    let r = t.split('/')[1] || '';
    return (r = r.replace(/_/g, ' ')), (e[r] = t), e;
  }, {}),
  jr = (e) => (
    (e = e.replace(/ time/g, '')),
    (e = e.replace(/ (standard|daylight|summer)/g, '')),
    (e = e.replace(/\b(east|west|north|south)ern/g, '$1')),
    (e = e.replace(/\b(africa|america|australia)n/g, '$1')),
    (e = e.replace(/\beuropean/g, 'europe')),
    (e = e.replace(/\islands/g, 'island')),
    e
  ),
  zr = (e, t) => {
    if (!e) return Or;
    typeof e != 'string' &&
      console.error(
        "Timezone must be a string - recieved: '",
        e,
        `'
`
      );
    let r = e.trim();
    if (
      ((r = r.toLowerCase()),
      t.hasOwnProperty(r) === !0 || ((r = jr(r)), t.hasOwnProperty(r) === !0))
    )
      return r;
    if (pt.hasOwnProperty(r) === !0) return pt[r];
    if (/[0-9]/.test(r) === !0) {
      let n = $r(r);
      if (n) return n;
    }
    throw new Error(
      "Spacetime: Cannot find timezone named: '" + e + "'. Please enter an IANA timezone id."
    );
  };
var Fe = zr;
function Pe(e) {
  return (e % 4 === 0 && e % 100 !== 0) || e % 400 === 0;
}
function Xt(e) {
  return Object.prototype.toString.call(e) === '[object Date]' && !isNaN(e.valueOf());
}
function Dr(e) {
  return Object.prototype.toString.call(e) === '[object Array]';
}
function ve(e) {
  return Object.prototype.toString.call(e) === '[object Object]';
}
function Er(e) {
  return Object.prototype.toString.call(e) === '[object Boolean]';
}
function y(e, t = 2) {
  let r = '0';
  return (e = e + ''), e.length >= t ? e : new Array(t - e.length + 1).join(r) + e;
}
function Tr(e) {
  return e ? e[0].toUpperCase() + e.substr(1) : '';
}
function K(e) {
  let t = e % 10,
    r = e % 100;
  return t === 1 && r !== 11
    ? e + 'st'
    : t === 2 && r !== 12
    ? e + 'nd'
    : t === 3 && r !== 13
    ? e + 'rd'
    : e + 'th';
}
function we(e) {
  return (e = String(e)), (e = e.replace(/([0-9])(st|nd|rd|th)$/i, '$1')), parseInt(e, 10);
}
function _e(e = '') {
  return (
    (e = e.toLowerCase().trim()),
    (e = e.replace(/ies$/, 'y')),
    (e = e.replace(/s$/, '')),
    (e = e.replace(/-/g, '')),
    e === 'day' || e === 'days' ? 'date' : e === 'min' || e === 'mins' ? 'minute' : e
  );
}
function Ee(e) {
  return typeof e == 'number' ? e : Xt(e) ? e.getTime() : e.epoch ? e.epoch : null;
}
function se(e, t) {
  return ve(e) === !1 ? t.clone().set(e) : e;
}
function Ne(e, t = '') {
  const r = e > 0 ? '+' : '-',
    n = Math.abs(e),
    a = y(parseInt('' + n, 10)),
    o = y((n % 1) * 60);
  return `${r}${a}${t}${o}`;
}
const rt = { year: new Date().getFullYear(), month: 0, date: 1 },
  Mr = (e, t, r) => {
    if (t.length === 0) return e;
    let n = ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond'];
    for (let a = 0; a < n.length; a++) {
      let o = t[a] || r[n[a]] || rt[n[a]] || 0;
      e = e[n[a]](o);
    }
    return e;
  },
  Nr = (e, t, r) => {
    if (Object.keys(t).length === 0) return e;
    t = Object.assign({}, rt, r, t);
    let n = Object.keys(t);
    for (let a = 0; a < n.length; a++) {
      let o = n[a];
      if (
        e[o] === void 0 ||
        typeof e[o] != 'function' ||
        t[o] === null ||
        t[o] === void 0 ||
        t[o] === ''
      )
        continue;
      let i = t[o] || r[o] || rt[o] || 0;
      e = e[o](i);
    }
    return e;
  },
  Sr = function (e, t) {
    return (
      t > 0 &&
        t < 25e8 &&
        e.silent === !1 &&
        (console.warn('  - Warning: You are setting the date to January 1970.'),
        console.warn('       -   did input seconds instead of milliseconds?')),
      (e.epoch = t),
      e
    );
  };
var qr = { parseArray: Mr, parseObject: Nr, parseNumber: Sr };
const le = function (e) {
    return (
      (e.epoch = Date.now()),
      Object.keys(e._today || {}).forEach((t) => {
        typeof e[t] == 'function' && (e = e[t](e._today[t]));
      }),
      e
    );
  },
  nt = {
    now: (e) => le(e),
    today: (e) => le(e),
    tonight: (e) => ((e = le(e)), (e = e.hour(18)), e),
    tomorrow: (e) => ((e = le(e)), (e = e.add(1, 'day')), (e = e.startOf('day')), e),
    yesterday: (e) => ((e = le(e)), (e = e.subtract(1, 'day')), (e = e.startOf('day')), e),
    christmas: (e) => {
      let t = le(e).year();
      return (e = e.set([t, 11, 25, 18, 0, 0])), e;
    },
    'new years': (e) => {
      let t = le(e).year();
      return (e = e.set([t, 11, 31, 18, 0, 0])), e;
    }
  };
nt['new years eve'] = nt['new years'];
var yt = nt;
const Ir = function (e) {
  return (
    (e = e.replace(/\b(mon|tues?|wed|wednes|thur?s?|fri|sat|satur|sun)(day)?\b/i, '')),
    (e = e.replace(/([0-9])(th|rd|st|nd)/, '$1')),
    (e = e.replace(/,/g, '')),
    (e = e.replace(/ +/g, ' ').trim()),
    e
  );
};
var Cr = Ir;
let V = { millisecond: 1 };
V.second = 1e3;
V.minute = 6e4;
V.hour = 36e5;
V.day = 864e5;
V.date = V.day;
V.month = 864e5 * 29.5;
V.week = 6048e5;
V.year = 3154e7;
Object.keys(V).forEach((e) => {
  V[e + 's'] = V[e];
});
var Y = V;
const Le = (e, t, r, n, a) => {
    let o = e.d[r]();
    if (o === t) return;
    let i = a === null ? null : e.d[a](),
      c = e.epoch,
      u = t - o;
    (e.epoch += Y[n] * u),
      n === 'day' && Math.abs(u) > 28 && t < 28 && (e.epoch += Y.hour),
      a !== null && i !== e.d[a]() && (e.epoch = c);
    const l = Y[n] / 2;
    for (; e.d[r]() < t; ) e.epoch += l;
    for (; e.d[r]() > t; ) e.epoch -= l;
    a !== null && i !== e.d[a]() && (e.epoch = c);
  },
  Ge = {
    year: {
      valid: (e) => e > -4e3 && e < 4e3,
      walkTo: (e, t) => Le(e, t, 'getFullYear', 'year', null)
    },
    month: {
      valid: (e) => e >= 0 && e <= 11,
      walkTo: (e, t) => {
        let r = e.d,
          n = r.getMonth(),
          a = e.epoch,
          o = r.getFullYear();
        if (n === t) return;
        let i = t - n;
        for (
          e.epoch += Y.day * (i * 28), o !== e.d.getFullYear() && (e.epoch = a);
          e.d.getMonth() < t;

        )
          e.epoch += Y.day;
        for (; e.d.getMonth() > t; ) e.epoch -= Y.day;
      }
    },
    date: {
      valid: (e) => e > 0 && e <= 31,
      walkTo: (e, t) => Le(e, t, 'getDate', 'day', 'getMonth')
    },
    hour: {
      valid: (e) => e >= 0 && e < 24,
      walkTo: (e, t) => Le(e, t, 'getHours', 'hour', 'getDate')
    },
    minute: {
      valid: (e) => e >= 0 && e < 60,
      walkTo: (e, t) => Le(e, t, 'getMinutes', 'minute', 'getHours')
    },
    second: {
      valid: (e) => e >= 0 && e < 60,
      walkTo: (e, t) => {
        e.epoch = e.seconds(t).epoch;
      }
    },
    millisecond: {
      valid: (e) => e >= 0 && e < 1e3,
      walkTo: (e, t) => {
        e.epoch = e.milliseconds(t).epoch;
      }
    }
  },
  Ar = (e, t) => {
    let r = Object.keys(Ge),
      n = e.clone();
    for (let a = 0; a < r.length; a++) {
      let o = r[a],
        i = t[o];
      if (
        (i === void 0 && (i = n[o]()),
        typeof i == 'string' && (i = parseInt(i, 10)),
        !Ge[o].valid(i))
      ) {
        (e.epoch = null), e.silent === !1 && console.warn('invalid ' + o + ': ' + i);
        return;
      }
      Ge[o].walkTo(e, i);
    }
  };
var z = Ar;
const Br = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var ye = Br;
let Ce = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  Ae = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ];
function Yr() {
  const e = { sep: 8 };
  for (let t = 0; t < Ce.length; t++) e[Ce[t]] = t;
  for (let t = 0; t < Ae.length; t++) e[Ae[t]] = t;
  return e;
}
function Te() {
  return Ce;
}
function Lr() {
  return Ae;
}
function xt() {
  return Yr();
}
function Fr(e) {
  (Ce = e.short || Ce), (Ae = e.long || Ae);
}
const Hr = (e, t) => {
  if (!t) return e;
  let r = 0;
  if (
    (/^[\+-]?[0-9]{2}:[0-9]{2}$/.test(t) &&
      (/:00/.test(t) === !0 && (t = t.replace(/:00/, '')),
      /:30/.test(t) === !0 && (t = t.replace(/:30/, '.5'))),
    /^[\+-]?[0-9]{4}$/.test(t) && (t = t.replace(/30$/, '.5')),
    (r = parseFloat(t)),
    Math.abs(r) > 100 && (r = r / 100),
    r === 0 || t === 'Z' || t === 'z')
  )
    return (e.tz = 'etc/gmt'), e;
  (r *= -1), r >= 0 && (r = '+' + r);
  let n = 'etc/gmt' + r;
  return e.timezones[n] && (e.tz = n), e;
};
var Zr = Hr;
const Ur = function (e = '') {
    return (
      (e = String(e)),
      e.length > 3
        ? (e = e.substr(0, 3))
        : e.length === 1
        ? (e = e + '00')
        : e.length === 2 && (e = e + '0'),
      Number(e) || 0
    );
  },
  Pr = (e, t = '') => {
    t = t.replace(/^\s+/, '').toLowerCase();
    let r = t.match(/([0-9]{1,2}):([0-9]{1,2}):?([0-9]{1,2})?[:\.]?([0-9]{1,4})?/);
    if (r !== null) {
      let n = Number(r[1]);
      if (n < 0 || n > 24) return e.startOf('day');
      let a = Number(r[2]);
      if (r[2].length < 2 || a < 0 || a > 59) return e.startOf('day');
      (e = e.hour(n)), (e = e.minute(a)), (e = e.seconds(r[3] || 0)), (e = e.millisecond(Ur(r[4])));
      let o = t.match(/[\b0-9] ?(am|pm)\b/);
      return o !== null && o[1] && (e = e.ampm(o[1])), e;
    }
    if (((r = t.match(/([0-9]+) ?(am|pm)/)), r !== null && r[1])) {
      let n = Number(r[1]);
      return n > 12 || n < 1
        ? e.startOf('day')
        : ((e = e.hour(r[1] || 0)), (e = e.ampm(r[2])), (e = e.startOf('hour')), e);
    }
    return (e = e.startOf('day')), e;
  };
var Z = Pr;
let gt = xt();
const U = (e) => {
    if (ye.hasOwnProperty(e.month) !== !0) return !1;
    if (e.month === 1) return Pe(e.year) && e.date <= 29 ? !0 : e.date <= 28;
    let t = ye[e.month] || 0;
    return e.date <= t;
  },
  x = (e = '', t) => {
    if (((e = e.trim()), /^'[0-9][0-9]$/.test(e) === !0)) {
      let n = Number(e.replace(/'/, ''));
      return n > 50 ? 1900 + n : 2e3 + n;
    }
    let r = parseInt(e, 10);
    return !r && t && (r = t.year), (r = r || new Date().getFullYear()), r;
  },
  re = function (e) {
    return (e = e.toLowerCase().trim()), e === 'sept' ? gt.sep : gt[e];
  };
var Vr = [
    {
      reg: /^(\-?0?0?[0-9]{3,4})-([0-9]{1,2})-([0-9]{1,2})[T| ]([0-9.:]+)(Z|[0-9\-\+:]+)?$/i,
      parse: (e, t) => {
        let r = { year: t[1], month: parseInt(t[2], 10) - 1, date: t[3] };
        return U(r) === !1 ? ((e.epoch = null), e) : (Zr(e, t[5]), z(e, r), (e = Z(e, t[4])), e);
      }
    },
    {
      reg: /^([0-9]{4})[\-\/\. ]([0-9]{1,2})[\-\/\. ]([0-9]{1,2})( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
      parse: (e, t) => {
        let r = { year: t[1], month: parseInt(t[2], 10) - 1, date: parseInt(t[3], 10) };
        return (
          r.month >= 12 && ((r.date = parseInt(t[2], 10)), (r.month = parseInt(t[3], 10) - 1)),
          U(r) === !1 ? ((e.epoch = null), e) : (z(e, r), (e = Z(e, t[4])), e)
        );
      }
    },
    {
      reg: /^([0-9]{4})[\-\/\. ]([a-z]+)[\-\/\. ]([0-9]{1,2})( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
      parse: (e, t) => {
        let r = { year: x(t[1], e._today), month: re(t[2]), date: we(t[3] || '') };
        return U(r) === !1 ? ((e.epoch = null), e) : (z(e, r), (e = Z(e, t[4])), e);
      }
    }
  ],
  Qr = [
    {
      reg: /^([0-9]{1,2})[\-\/.]([0-9]{1,2})[\-\/.]?([0-9]{4})?( [0-9]{1,2}:[0-9]{2}:?[0-9]{0,2}? ?(am|pm|gmt))?$/i,
      parse: (e, t) => {
        let r = parseInt(t[1], 10) - 1,
          n = parseInt(t[2], 10);
        (e.british || r >= 12) && ((n = parseInt(t[1], 10)), (r = parseInt(t[2], 10) - 1));
        let a = { date: n, month: r, year: x(t[3], e._today) || new Date().getFullYear() };
        return U(a) === !1 ? ((e.epoch = null), e) : (z(e, a), (e = Z(e, t[4])), e);
      }
    },
    {
      reg: /^([a-z]+)[\-\/\. ]([0-9]{1,2})[\-\/\. ]?([0-9]{4}|'[0-9]{2})?( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
      parse: (e, t) => {
        let r = { year: x(t[3], e._today), month: re(t[1]), date: we(t[2] || '') };
        return U(r) === !1 ? ((e.epoch = null), e) : (z(e, r), (e = Z(e, t[4])), e);
      }
    },
    {
      reg: /^([a-z]+) ([0-9]{1,2})( [0-9]{4})?( ([0-9:]+( ?am| ?pm| ?gmt)?))?$/i,
      parse: (e, t) => {
        let r = { year: x(t[3], e._today), month: re(t[1]), date: we(t[2] || '') };
        return U(r) === !1 ? ((e.epoch = null), e) : (z(e, r), (e = Z(e, t[4])), e);
      }
    },
    {
      reg: /^([a-z]+) ([0-9]{1,2})( [0-9:]+)?( \+[0-9]{4})?( [0-9]{4})?$/i,
      parse: (e, t) => {
        let r = { year: x(t[5], e._today), month: re(t[1]), date: we(t[2] || '') };
        return U(r) === !1 ? ((e.epoch = null), e) : (z(e, r), (e = Z(e, t[3])), e);
      }
    }
  ],
  Gr = [
    {
      reg: /^([0-9]{1,2})[\-\/]([a-z]+)[\-\/]?([0-9]{4})?$/i,
      parse: (e, t) => {
        let r = { year: x(t[3], e._today), month: re(t[2]), date: we(t[1] || '') };
        return U(r) === !1 ? ((e.epoch = null), e) : (z(e, r), (e = Z(e, t[4])), e);
      }
    },
    {
      reg: /^([0-9]{1,2})( [a-z]+)( [0-9]{4}| '[0-9]{2})? ?([0-9]{1,2}:[0-9]{2}:?[0-9]{0,2}? ?(am|pm|gmt))?$/i,
      parse: (e, t) => {
        let r = { year: x(t[3], e._today), month: re(t[2]), date: we(t[1]) };
        return !r.month || U(r) === !1 ? ((e.epoch = null), e) : (z(e, r), (e = Z(e, t[4])), e);
      }
    },
    {
      reg: /^([0-9]{1,2})[\. -/]([a-z]+)[\. -/]([0-9]{4})?( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
      parse: (e, t) => {
        let r = { date: Number(t[1]), month: re(t[2]), year: Number(t[3]) };
        return U(r) === !1
          ? ((e.epoch = null), e)
          : (z(e, r), (e = e.startOf('day')), (e = Z(e, t[4])), e);
      }
    }
  ],
  Rr = [
    {
      reg: /^([0-9]{4})[\-\/]([0-9]{2})$/i,
      parse: (e, t) => {
        let r = { year: t[1], month: parseInt(t[2], 10) - 1, date: 1 };
        return U(r) === !1 ? ((e.epoch = null), e) : (z(e, r), (e = Z(e, t[4])), e);
      }
    },
    {
      reg: /^([a-z]+) ([0-9]{4})$/i,
      parse: (e, t) => {
        let r = { year: x(t[2], e._today), month: re(t[1]), date: e._today.date || 1 };
        return U(r) === !1 ? ((e.epoch = null), e) : (z(e, r), (e = Z(e, t[4])), e);
      }
    },
    {
      reg: /^(q[0-9])( of)?( [0-9]{4})?/i,
      parse: (e, t) => {
        let r = t[1] || '';
        e = e.quarter(r);
        let n = t[3] || '';
        return n && ((n = n.trim()), (e = e.year(n))), e;
      }
    },
    {
      reg: /^(spring|summer|winter|fall|autumn)( of)?( [0-9]{4})?/i,
      parse: (e, t) => {
        let r = t[1] || '';
        e = e.season(r);
        let n = t[3] || '';
        return n && ((n = n.trim()), (e = e.year(n))), e;
      }
    },
    {
      reg: /^[0-9,]+ ?b\.?c\.?$/i,
      parse: (e, t) => {
        let r = t[0] || '';
        r = r.replace(/^([0-9,]+) ?b\.?c\.?$/i, '-$1');
        let n = new Date(),
          a = { year: parseInt(r.trim(), 10), month: n.getMonth(), date: n.getDate() };
        return U(a) === !1 ? ((e.epoch = null), e) : (z(e, a), (e = Z(e)), e);
      }
    },
    {
      reg: /^[0-9,]+ ?(a\.?d\.?|c\.?e\.?)$/i,
      parse: (e, t) => {
        let r = t[0] || '';
        r = r.replace(/,/g, '');
        let n = new Date(),
          a = { year: parseInt(r.trim(), 10), month: n.getMonth(), date: n.getDate() };
        return U(a) === !1 ? ((e.epoch = null), e) : (z(e, a), (e = Z(e)), e);
      }
    },
    {
      reg: /^[0-9]{4}( ?a\.?d\.?)?$/i,
      parse: (e, t) => {
        let r = e._today;
        r.month && !r.date && (r.date = 1);
        let n = new Date(),
          a = { year: x(t[0], r), month: r.month || n.getMonth(), date: r.date || n.getDate() };
        return U(a) === !1 ? ((e.epoch = null), e) : (z(e, a), (e = Z(e)), e);
      }
    }
  ],
  Re = [].concat(Vr, Qr, Gr, Rr);
const Wr = function (e, t, r) {
  for (let n = 0; n < Re.length; n++) {
    let a = t.match(Re[n].reg);
    if (a) {
      let o = Re[n].parse(e, a, r);
      if (o !== null && o.isValid()) return o;
    }
  }
  return (
    e.silent === !1 && console.warn("Warning: couldn't parse date-string: '" + t + "'"),
    (e.epoch = null),
    e
  );
};
var Jr = Wr;
const { parseArray: Kr, parseObject: _t, parseNumber: Xr } = qr,
  bt = { year: new Date().getFullYear(), month: 0, date: 1 },
  xr = (e, t) => {
    let r = e._today || bt;
    if (typeof t == 'number') return Xr(e, t);
    if (((e.epoch = Date.now()), e._today && ve(e._today) && Object.keys(e._today).length > 0)) {
      let n = _t(e, r, bt);
      n.isValid() && (e.epoch = n.epoch);
    }
    return t == null || t === ''
      ? e
      : Xt(t) === !0
      ? ((e.epoch = t.getTime()), e)
      : Dr(t) === !0
      ? ((e = Kr(e, t, r)), e)
      : ve(t) === !0
      ? t.epoch
        ? ((e.epoch = t.epoch), (e.tz = t.tz), e)
        : ((e = _t(e, t, r)), e)
      : typeof t != 'string'
      ? e
      : ((t = Cr(t)), yt.hasOwnProperty(t) === !0 ? ((e = yt[t](e)), e) : Jr(e, t));
  };
var er = xr;
let at = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  ot = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
function Be() {
  return at;
}
function He() {
  return ot;
}
function en(e) {
  (at = e.short || at), (ot = e.long || ot);
}
const kt = {
  mo: 1,
  tu: 2,
  we: 3,
  th: 4,
  fr: 5,
  sa: 6,
  su: 7,
  tues: 2,
  weds: 3,
  wedn: 3,
  thur: 4,
  thurs: 4
};
let tr = !0;
function tn() {
  return tr;
}
function rn(e) {
  tr = e;
}
const nn = (e) => {
  let t = e.timezone().current.offset;
  return t ? Ne(t, ':') : 'Z';
};
var vt = nn;
const X = (e) => (tn() ? Tr(e) : e),
  an = (e) => (e >= 0 ? y(e, 4) : ((e = Math.abs(e)), '-' + y(e, 4))),
  ke = {
    day: (e) => X(e.dayName()),
    'day-short': (e) => X(Be()[e.day()]),
    'day-number': (e) => e.day(),
    'day-ordinal': (e) => K(e.day()),
    'day-pad': (e) => y(e.day()),
    date: (e) => e.date(),
    'date-ordinal': (e) => K(e.date()),
    'date-pad': (e) => y(e.date()),
    month: (e) => X(e.monthName()),
    'month-short': (e) => X(Te()[e.month()]),
    'month-number': (e) => e.month(),
    'month-ordinal': (e) => K(e.month()),
    'month-pad': (e) => y(e.month()),
    'iso-month': (e) => y(e.month() + 1),
    year: (e) => {
      let t = e.year();
      return t > 0 ? t : ((t = Math.abs(t)), t + ' BC');
    },
    'year-short': (e) => {
      let t = e.year();
      return t > 0 ? `'${String(e.year()).substr(2, 4)}` : ((t = Math.abs(t)), t + ' BC');
    },
    'iso-year': (e) => {
      let t = e.year(),
        r = t < 0,
        n = y(Math.abs(t), 4);
      return r && ((n = y(n, 6)), (n = '-' + n)), n;
    },
    time: (e) => e.time(),
    'time-24': (e) => `${e.hour24()}:${y(e.minute())}`,
    hour: (e) => e.hour12(),
    'hour-pad': (e) => y(e.hour12()),
    'hour-24': (e) => e.hour24(),
    'hour-24-pad': (e) => y(e.hour24()),
    minute: (e) => e.minute(),
    'minute-pad': (e) => y(e.minute()),
    second: (e) => e.second(),
    'second-pad': (e) => y(e.second()),
    millisecond: (e) => e.millisecond(),
    'millisecond-pad': (e) => y(e.millisecond(), 3),
    ampm: (e) => e.ampm(),
    quarter: (e) => 'Q' + e.quarter(),
    season: (e) => e.season(),
    era: (e) => e.era(),
    json: (e) => e.json(),
    timezone: (e) => e.timezone().name,
    offset: (e) => vt(e),
    numeric: (e) => `${e.year()}/${y(e.month() + 1)}/${y(e.date())}`,
    'numeric-us': (e) => `${y(e.month() + 1)}/${y(e.date())}/${e.year()}`,
    'numeric-uk': (e) => `${y(e.date())}/${y(e.month() + 1)}/${e.year()}`,
    'mm/dd': (e) => `${y(e.month() + 1)}/${y(e.date())}`,
    iso: (e) => {
      let t = e.format('iso-year'),
        r = y(e.month() + 1),
        n = y(e.date()),
        a = y(e.h24()),
        o = y(e.minute()),
        i = y(e.second()),
        c = y(e.millisecond(), 3),
        u = vt(e);
      return `${t}-${r}-${n}T${a}:${o}:${i}.${c}${u}`;
    },
    'iso-short': (e) => {
      let t = y(e.month() + 1),
        r = y(e.date());
      return `${an(e.year())}-${t}-${r}`;
    },
    'iso-utc': (e) => new Date(e.epoch).toISOString(),
    nice: (e) => `${Te()[e.month()]} ${K(e.date())}, ${e.time()}`,
    'nice-24': (e) => `${Te()[e.month()]} ${K(e.date())}, ${e.hour24()}:${y(e.minute())}`,
    'nice-year': (e) => `${Te()[e.month()]} ${K(e.date())}, ${e.year()}`,
    'nice-day': (e) => `${Be()[e.day()]} ${X(Te()[e.month()])} ${K(e.date())}`,
    'nice-full': (e) => `${e.dayName()} ${X(e.monthName())} ${K(e.date())}, ${e.time()}`,
    'nice-full-24': (e) =>
      `${e.dayName()} ${X(e.monthName())} ${K(e.date())}, ${e.hour24()}:${y(e.minute())}`
  },
  wt = {
    'day-name': 'day',
    'month-name': 'month',
    'iso 8601': 'iso',
    'time-h24': 'time-24',
    'time-12': 'time',
    'time-h12': 'time',
    tz: 'timezone',
    'day-num': 'day-number',
    'month-num': 'month-number',
    'month-iso': 'iso-month',
    'year-iso': 'iso-year',
    'nice-short': 'nice',
    'nice-short-24': 'nice-24',
    mdy: 'numeric-us',
    dmy: 'numeric-uk',
    ymd: 'numeric',
    'yyyy/mm/dd': 'numeric',
    'mm/dd/yyyy': 'numeric-us',
    'dd/mm/yyyy': 'numeric-us',
    'little-endian': 'numeric-uk',
    'big-endian': 'numeric',
    'day-nice': 'nice-day'
  };
Object.keys(wt).forEach((e) => (ke[e] = ke[wt[e]]));
const on = (e, t = '') => {
  if (e.isValid() !== !0) return '';
  if (ke.hasOwnProperty(t)) {
    let r = ke[t](e) || '';
    return t !== 'json' && ((r = String(r)), t !== 'ampm' && (r = X(r))), r;
  }
  if (t.indexOf('{') !== -1) {
    let r = /\{(.+?)\}/g;
    return (
      (t = t.replace(r, (n, a) => {
        if (((a = a.toLowerCase().trim()), ke.hasOwnProperty(a))) {
          let o = String(ke[a](e));
          return a !== 'ampm' ? X(o) : o;
        }
        return '';
      })),
      t
    );
  }
  return e.format('iso-short');
};
var We = on;
const Ze = {
    G: (e) => e.era(),
    GG: (e) => e.era(),
    GGG: (e) => e.era(),
    GGGG: (e) => (e.era() === 'AD' ? 'Anno Domini' : 'Before Christ'),
    y: (e) => e.year(),
    yy: (e) => y(Number(String(e.year()).substr(2, 4))),
    yyy: (e) => e.year(),
    yyyy: (e) => e.year(),
    yyyyy: (e) => '0' + e.year(),
    Q: (e) => e.quarter(),
    QQ: (e) => e.quarter(),
    QQQ: (e) => e.quarter(),
    QQQQ: (e) => e.quarter(),
    M: (e) => e.month() + 1,
    MM: (e) => y(e.month() + 1),
    MMM: (e) => e.format('month-short'),
    MMMM: (e) => e.format('month'),
    w: (e) => e.week(),
    ww: (e) => y(e.week()),
    d: (e) => e.date(),
    dd: (e) => y(e.date()),
    D: (e) => e.dayOfYear(),
    DD: (e) => y(e.dayOfYear()),
    DDD: (e) => y(e.dayOfYear(), 3),
    E: (e) => e.format('day-short'),
    EE: (e) => e.format('day-short'),
    EEE: (e) => e.format('day-short'),
    EEEE: (e) => e.format('day'),
    EEEEE: (e) => e.format('day')[0],
    e: (e) => e.day(),
    ee: (e) => e.day(),
    eee: (e) => e.format('day-short'),
    eeee: (e) => e.format('day'),
    eeeee: (e) => e.format('day')[0],
    a: (e) => e.ampm().toUpperCase(),
    aa: (e) => e.ampm().toUpperCase(),
    aaa: (e) => e.ampm().toUpperCase(),
    aaaa: (e) => e.ampm().toUpperCase(),
    h: (e) => e.h12(),
    hh: (e) => y(e.h12()),
    H: (e) => e.hour(),
    HH: (e) => y(e.hour()),
    m: (e) => e.minute(),
    mm: (e) => y(e.minute()),
    s: (e) => e.second(),
    ss: (e) => y(e.second()),
    SSS: (e) => y(e.millisecond(), 3),
    A: (e) => e.epoch - e.startOf('day').epoch,
    z: (e) => e.timezone().name,
    zz: (e) => e.timezone().name,
    zzz: (e) => e.timezone().name,
    zzzz: (e) => e.timezone().name,
    Z: (e) => Ne(e.timezone().current.offset),
    ZZ: (e) => Ne(e.timezone().current.offset),
    ZZZ: (e) => Ne(e.timezone().current.offset),
    ZZZZ: (e) => Ne(e.timezone().current.offset, ':')
  },
  ee = (e, t, r) => {
    let n = e,
      a = t;
    for (let o = 0; o < r; o += 1) (Ze[n] = Ze[a]), (n += e), (a += t);
  };
ee('q', 'Q', 4);
ee('L', 'M', 4);
ee('Y', 'y', 4);
ee('c', 'e', 4);
ee('k', 'H', 2);
ee('K', 'h', 2);
ee('S', 's', 2);
ee('v', 'z', 4);
ee('V', 'Z', 4);
const ln = function (e) {
    for (let t = 0; t < e.length; t += 1)
      if (e[t] === "'")
        for (let r = t + 1; r < e.length; r += 1) {
          if ((e[r] && (e[t] += e[r]), e[r] === "'")) {
            e[r] = null;
            break;
          }
          e[r] = null;
        }
    return e.filter((t) => t);
  },
  sn = function (e) {
    for (let t = 0; t < e.length; t += 1) {
      let r = e[t];
      for (let n = t + 1; n < e.length && e[n] === r; n += 1) (e[t] += e[n]), (e[n] = null);
    }
    return (e = e.filter((t) => t)), (e = e.map((t) => (t === "''" && (t = "'"), t))), e;
  },
  un = (e, t) => {
    let r = t.split('');
    return (
      (r = ln(r)),
      (r = sn(r)),
      r.reduce(
        (n, a) => (
          Ze[a] !== void 0
            ? (n += Ze[a](e) || '')
            : (/^'.{1,}'$/.test(a) && (a = a.replace(/'/g, '')), (n += a)),
          n
        ),
        ''
      )
    );
  };
var cn = un;
const fn = ['year', 'season', 'quarter', 'month', 'week', 'day', 'quarterHour', 'hour', 'minute'],
  $t = function (e, t) {
    let r = e.clone().startOf(t),
      a = e.clone().endOf(t).epoch - r.epoch,
      o = (e.epoch - r.epoch) / a;
    return parseFloat(o.toFixed(2));
  },
  hn = (e, t) => {
    if (t) return (t = _e(t)), $t(e, t);
    let r = {};
    return (
      fn.forEach((n) => {
        r[n] = $t(e, n);
      }),
      r
    );
  };
var dn = hn;
const mn = (e, t) => {
  let r = e.progress();
  return (
    (t = _e(t)),
    t === 'quarterhour' && (t = 'quarterHour'),
    r[t] !== void 0
      ? (r[t] > 0.5 && (e = e.add(1, t)), (e = e.startOf(t)))
      : e.silent === !1 && console.warn("no known unit '" + t + "'"),
    e
  );
};
var pn = mn;
const Ot = (e, t, r) => {
    let n = 0;
    for (e = e.clone(); e.isBefore(t); ) (e = e.add(1, r)), (n += 1);
    return e.isAfter(t, r) && (n -= 1), n;
  },
  yn = (e, t, r) => (e.isBefore(t) ? Ot(e, t, r) : Ot(t, e, r) * -1);
var Je = yn;
const gn = (e, t) => {
    let r = t.year() - e.year();
    return (e = e.year(t.year())), e.isAfter(t) && (r -= 1), r;
  },
  _n = function (e, t) {
    let r = t.epoch - e.epoch,
      n = { milliseconds: r, seconds: parseInt(r / 1e3, 10) };
    (n.minutes = parseInt(n.seconds / 60, 10)), (n.hours = parseInt(n.minutes / 60, 10));
    let a = e.clone();
    return (
      (n.years = gn(a, t)),
      (a = e.add(n.years, 'year')),
      (n.months = n.years * 12),
      (a = e.add(n.months, 'month')),
      (n.months += Je(a, t, 'month')),
      (n.weeks = n.years * 52),
      (a = e.add(n.weeks, 'week')),
      (n.weeks += Je(a, t, 'week')),
      (n.days = n.weeks * 7),
      (a = e.add(n.days, 'day')),
      (n.days += Je(a, t, 'day')),
      n
    );
  };
var bn = _n;
const kn = function (e) {
    return (
      Object.keys(e).forEach((t) => {
        e[t] *= -1;
      }),
      e
    );
  },
  vn = function (e, t, r) {
    t = se(t, e);
    let n = !1;
    if (e.isAfter(t)) {
      let o = e;
      (e = t), (t = o), (n = !0);
    }
    let a = bn(e, t);
    return (
      n && (a = kn(a)),
      r ? ((r = _e(r)), /s$/.test(r) !== !0 && (r += 's'), r === 'dates' && (r = 'days'), a[r]) : a
    );
  };
var wn = vn;
const be = (e) => Math.abs(e) || 0,
  $n = function (e) {
    let t = 'P';
    return (
      (t += be(e.years) + 'Y'),
      (t += be(e.months) + 'M'),
      (t += be(e.days) + 'DT'),
      (t += be(e.hours) + 'H'),
      (t += be(e.minutes) + 'M'),
      (t += be(e.seconds) + 'S'),
      t
    );
  };
var On = $n;
function jn(e, t) {
  const r = e.isBefore(t),
    n = r ? t : e;
  let a = r ? e : t;
  a = a.clone();
  const o = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return (
    Object.keys(o).forEach((i) => {
      if (a.isSame(n, i)) return;
      let c = a.diff(n, i);
      (a = a.add(c, i)), (o[i] = c);
    }),
    r &&
      Object.keys(o).forEach((i) => {
        o[i] !== 0 && (o[i] *= -1);
      }),
    o
  );
}
const jt = {
  months: { almost: 10, over: 4 },
  days: { almost: 25, over: 10 },
  hours: { almost: 20, over: 8 },
  minutes: { almost: 50, over: 20 },
  seconds: { almost: 50, over: 20 }
};
function zt(e, t) {
  return e === 1 && (t = t.slice(0, -1)), e + ' ' + t;
}
const zn = function (e) {
  let t = null,
    r = null,
    n = [],
    a = [];
  return (
    Object.keys(e).forEach((o, i, c) => {
      const u = Math.abs(e[o]);
      if (u === 0) return;
      n.push(u + o[0]);
      const l = zt(u, o);
      if ((a.push(l), !t)) {
        if (((t = r = l), i > 4)) return;
        const s = c[i + 1],
          f = Math.abs(e[s]);
        f > jt[s].almost
          ? ((t = zt(u + 1, o)), (r = 'almost ' + t))
          : f > jt[s].over && (r = 'over ' + l);
      }
    }),
    { qualified: r, rounded: t, abbreviated: n, englishValues: a }
  );
};
var Dn = zn;
const En = (e, t) => {
  t = se(t, e);
  const r = jn(e, t);
  if (Object.keys(r).every((f) => !r[f]) === !0)
    return {
      diff: r,
      rounded: 'now',
      qualified: 'now',
      precise: 'now',
      abbreviated: [],
      iso: 'P0Y0M0DT0H0M0S',
      direction: 'present'
    };
  let a,
    o = 'future',
    { rounded: i, qualified: c, englishValues: u, abbreviated: l } = Dn(r);
  (a = u.splice(0, 2).join(', ')),
    e.isAfter(t) === !0
      ? ((i += ' ago'), (c += ' ago'), (a += ' ago'), (o = 'past'))
      : ((i = 'in ' + i), (c = 'in ' + c), (a = 'in ' + a));
  let s = On(r);
  return { diff: r, rounded: i, qualified: c, precise: a, abbreviated: l, iso: s, direction: o };
};
var Tn = En;
const Mn = [
    ['spring', 2, 1],
    ['summer', 5, 1],
    ['fall', 8, 1],
    ['autumn', 8, 1],
    ['winter', 11, 1]
  ],
  Nn = [
    ['fall', 2, 1],
    ['autumn', 2, 1],
    ['winter', 5, 1],
    ['spring', 8, 1],
    ['summer', 11, 1]
  ];
var W = { north: Mn, south: Nn },
  ue = [null, [0, 1], [3, 1], [6, 1], [9, 1]];
const fe = {
  minute: (e) => (z(e, { second: 0, millisecond: 0 }), e),
  quarterhour: (e) => {
    let t = e.minutes();
    return (
      t >= 45
        ? (e = e.minutes(45))
        : t >= 30
        ? (e = e.minutes(30))
        : t >= 15
        ? (e = e.minutes(15))
        : (e = e.minutes(0)),
      z(e, { second: 0, millisecond: 0 }),
      e
    );
  },
  hour: (e) => (z(e, { minute: 0, second: 0, millisecond: 0 }), e),
  day: (e) => (z(e, { hour: 0, minute: 0, second: 0, millisecond: 0 }), e),
  week: (e) => {
    let t = e.clone();
    return (
      (e = e.day(e._weekStart)),
      e.isAfter(t) && (e = e.subtract(1, 'week')),
      z(e, { hour: 0, minute: 0, second: 0, millisecond: 0 }),
      e
    );
  },
  month: (e) => (z(e, { date: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }), e),
  quarter: (e) => {
    let t = e.quarter();
    return (
      ue[t] &&
        z(e, { month: ue[t][0], date: ue[t][1], hour: 0, minute: 0, second: 0, millisecond: 0 }),
      e
    );
  },
  season: (e) => {
    let t = e.season(),
      r = 'north';
    e.hemisphere() === 'South' && (r = 'south');
    for (let n = 0; n < W[r].length; n++)
      if (W[r][n][0] === t) {
        let a = e.year();
        return (
          t === 'winter' && e.month() < 3 && (a -= 1),
          z(e, {
            year: a,
            month: W[r][n][1],
            date: W[r][n][2],
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
          }),
          e
        );
      }
    return e;
  },
  year: (e) => (z(e, { month: 0, date: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }), e),
  decade: (e) => {
    e = e.startOf('year');
    let t = e.year(),
      r = parseInt(t / 10, 10) * 10;
    return (e = e.year(r)), e;
  },
  century: (e) => {
    e = e.startOf('year');
    let t = e.year(),
      r = parseInt(t / 100, 10) * 100;
    return (e = e.year(r)), e;
  }
};
fe.date = fe.day;
const Sn = (e, t) => {
    let r = e.clone();
    return (
      (t = _e(t)),
      fe[t] ? fe[t](r) : t === 'summer' || t === 'winter' ? ((r = r.season(t)), fe.season(r)) : r
    );
  },
  qn = (e, t) => {
    let r = e.clone();
    return (
      (t = _e(t)),
      fe[t] && ((r = fe[t](r)), (r = r.add(1, t)), (r = r.subtract(1, 'millisecond'))),
      r
    );
  },
  In = function (e) {
    return !!(Be().find((t) => t === e) || He().find((t) => t === e));
  },
  Cn = function (e, t, r) {
    if (!t || !r) return [];
    if (((t = _e(t)), (r = e.clone().set(r)), e.isAfter(r))) {
      let o = e;
      (e = r), (r = o);
    }
    let n = e.clone();
    In(t) ? ((n = n.next(t)), (t = 'week')) : n.startOf(t).isBefore(e) && (n = n.next(t));
    let a = [];
    for (; n.isBefore(r); ) a.push(n), (n = n.add(1, t));
    return a;
  };
var An = Cn;
const Bn = (e) => (e ? e.split('->') : []),
  Yn = (e) => (
    (e = e[0].toUpperCase() + e.substr(1)),
    (e = e.replace(/\/gmt/, '/GMT')),
    (e = e.replace(/[\/_]([a-z])/gi, (t) => t.toUpperCase())),
    e
  ),
  Ln = (e) => {
    let t = e.timezones,
      r = e.tz;
    if ((t.hasOwnProperty(r) === !1 && (r = Fe(e.tz, t)), r === null))
      return (
        e.silent === !1 &&
          console.warn("Warn: could not find given or local timezone - '" + e.tz + "'"),
        { current: { epochShift: 0 } }
      );
    let n = t[r],
      a = {
        name: Yn(r),
        hasDst: Boolean(n.dst),
        default_offset: n.offset,
        hemisphere: n.hem === 's' ? 'South' : 'North',
        current: {}
      };
    if (a.hasDst) {
      let c = Bn(n.dst);
      a.change = { start: c[0], back: c[1] };
    }
    let o = n.offset,
      i = o;
    return (
      a.hasDst === !0 && (a.hemisphere === 'North' ? (i = o - 1) : (i = n.offset + 1)),
      a.hasDst === !1
        ? ((a.current.offset = o), (a.current.isDST = !1))
        : Jt(e.epoch, a.change.start, a.change.back, o, i) === !0
        ? ((a.current.offset = o), (a.current.isDST = a.hemisphere === 'North'))
        : ((a.current.offset = i), (a.current.isDST = a.hemisphere === 'South')),
      a
    );
  };
var Me = Ln;
const Fn = [
    'century',
    'decade',
    'year',
    'month',
    'date',
    'day',
    'hour',
    'minute',
    'second',
    'millisecond'
  ],
  ge = {
    set: function (e, t) {
      let r = this.clone();
      return (r = er(r, e)), t && (this.tz = Fe(t)), r;
    },
    timezone: function () {
      return Me(this);
    },
    isDST: function () {
      return Me(this).current.isDST;
    },
    hasDST: function () {
      return Me(this).hasDst;
    },
    offset: function () {
      return Me(this).current.offset * 60;
    },
    hemisphere: function () {
      return Me(this).hemisphere;
    },
    format: function (e) {
      return We(this, e);
    },
    unixFmt: function (e) {
      return cn(this, e);
    },
    startOf: function (e) {
      return Sn(this, e);
    },
    endOf: function (e) {
      return qn(this, e);
    },
    leapYear: function () {
      let e = this.year();
      return Pe(e);
    },
    progress: function (e) {
      return dn(this, e);
    },
    nearest: function (e) {
      return pn(this, e);
    },
    diff: function (e, t) {
      return wn(this, e, t);
    },
    since: function (e) {
      return e || (e = this.clone().set()), Tn(this, e);
    },
    next: function (e) {
      return this.add(1, e).startOf(e);
    },
    last: function (e) {
      return this.subtract(1, e).startOf(e);
    },
    isValid: function () {
      return !this.epoch && this.epoch !== 0 ? !1 : !isNaN(this.d.getTime());
    },
    goto: function (e) {
      let t = this.clone();
      return (t.tz = Fe(e, t.timezones)), t;
    },
    every: function (e, t) {
      if (typeof e == 'object' && typeof t == 'string') {
        let r = t;
        (t = e), (e = r);
      }
      return An(this, e, t);
    },
    isAwake: function () {
      let e = this.hour();
      return !(e < 8 || e > 22);
    },
    isAsleep: function () {
      return !this.isAwake();
    },
    daysInMonth: function () {
      switch (this.month()) {
        case 0:
          return 31;
        case 1:
          return this.leapYear() ? 29 : 28;
        case 2:
          return 31;
        case 3:
          return 30;
        case 4:
          return 31;
        case 5:
          return 30;
        case 6:
          return 31;
        case 7:
          return 31;
        case 8:
          return 30;
        case 9:
          return 31;
        case 10:
          return 30;
        case 11:
          return 31;
        default:
          throw new Error('Invalid Month state.');
      }
    },
    log: function () {
      return console.log(''), console.log(We(this, 'nice-short')), this;
    },
    logYear: function () {
      return console.log(''), console.log(We(this, 'full-short')), this;
    },
    json: function () {
      return Fn.reduce((e, t) => ((e[t] = this[t]()), e), {});
    },
    debug: function () {
      let e = this.timezone(),
        t = this.format('MM') + ' ' + this.format('date-ordinal') + ' ' + this.year();
      return (
        (t +=
          `
     - ` + this.format('time')),
        console.log(
          `

`,
          t +
            `
     - ` +
            e.name +
            ' (' +
            e.current.offset +
            ')'
        ),
        this
      );
    },
    from: function (e) {
      return (e = this.clone().set(e)), e.since(this);
    },
    fromNow: function () {
      return this.clone().set(Date.now()).since(this);
    },
    weekStart: function (e) {
      if (typeof e == 'number') return (this._weekStart = e), this;
      if (typeof e == 'string') {
        e = e.toLowerCase().trim();
        let t = Be().indexOf(e);
        t === -1 && (t = He().indexOf(e)), t === -1 && (t = 1), (this._weekStart = t);
      } else console.warn('Spacetime Error: Cannot understand .weekStart() input:', e);
      return this;
    }
  };
ge.inDST = ge.isDST;
ge.round = ge.nearest;
ge.each = ge.every;
var Dt = ge;
const te = (e) => (typeof e == 'string' && (e = parseInt(e, 10)), e),
  Ke = ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond'],
  ut = (e, t, r) => {
    let n = Ke.indexOf(r),
      a = Ke.slice(n, Ke.length);
    for (let o = 0; o < a.length; o++) {
      let i = t[a[o]]();
      e[a[o]](i);
    }
    return e;
  },
  ie = function (e, t, r, n) {
    return (
      r === !0 && e.isBefore(t)
        ? (e = e.add(1, n))
        : r === !1 && e.isAfter(t) && (e = e.minus(1, n)),
      e
    );
  },
  Hn = function (e, t) {
    t = te(t);
    let n = e.millisecond() - t;
    return e.epoch - n;
  },
  Zn = function (e, t, r) {
    t = te(t);
    let n = e.clone(),
      o = (e.second() - t) * Y.second;
    return (e.epoch = e.epoch - o), (e = ie(e, n, r, 'minute')), e.epoch;
  },
  Et = function (e, t, r) {
    t = te(t);
    let n = e.clone(),
      o = (e.minute() - t) * Y.minute;
    return (e.epoch -= o), ut(e, n, 'second'), (e = ie(e, n, r, 'hour')), e.epoch;
  },
  Xe = function (e, t, r) {
    (t = te(t)), t >= 24 ? (t = 24) : t < 0 && (t = 0);
    let n = e.clone(),
      a = e.hour() - t,
      o = a * Y.hour;
    return (
      (e.epoch -= o),
      e.date() !== n.date() &&
        ((e = n.clone()), a > 1 && (a -= 1), a < 1 && (a += 1), (o = a * Y.hour), (e.epoch -= o)),
      z(e, { hour: t }),
      ut(e, n, 'minute'),
      (e = ie(e, n, r, 'day')),
      e.epoch
    );
  },
  Un = function (e, t, r) {
    let n = t.match(/([0-9]{1,2})[:h]([0-9]{1,2})(:[0-9]{1,2})? ?(am|pm)?/);
    if (!n) {
      if (((n = t.match(/([0-9]{1,2}) ?(am|pm)/)), !n)) return e.epoch;
      n.splice(2, 0, '0'), n.splice(3, 0, '');
    }
    let a = !1,
      o = parseInt(n[1], 10),
      i = parseInt(n[2], 10);
    i >= 60 && (i = 59),
      o > 12 && (a = !0),
      a === !1 && (n[4] === 'am' && o === 12 && (o = 0), n[4] === 'pm' && o < 12 && (o += 12)),
      (n[3] = n[3] || ''),
      (n[3] = n[3].replace(/:/, ''));
    let c = parseInt(n[3], 10) || 0,
      u = e.clone();
    return (
      (e = e.hour(o)),
      (e = e.minute(i)),
      (e = e.second(c)),
      (e = e.millisecond(0)),
      (e = ie(e, u, r, 'day')),
      e.epoch
    );
  },
  Pn = function (e, t, r) {
    if (((t = te(t)), t > 28)) {
      let a = e.month(),
        o = ye[a];
      a === 1 && t === 29 && Pe(e.year()) && (o = 29), t > o && (t = o);
    }
    t <= 0 && (t = 1);
    let n = e.clone();
    return z(e, { date: t }), (e = ie(e, n, r, 'month')), e.epoch;
  },
  Vn = function (e, t, r) {
    typeof t == 'string' && (t === 'sept' && (t = 'sep'), (t = xt()[t.toLowerCase()])),
      (t = te(t)),
      t >= 12 && (t = 11),
      t <= 0 && (t = 0);
    let n = e.date();
    n > ye[t] && (n = ye[t]);
    let a = e.clone();
    return z(e, { month: t, d: n }), (e = ie(e, a, r, 'year')), e.epoch;
  },
  xe = function (e, t) {
    return (
      typeof t == 'string' &&
        /^'[0-9]{2}$/.test(t) &&
        ((t = t.replace(/'/, '').trim()), (t = Number(t)), t > 30 ? (t = 1900 + t) : (t = 2e3 + t)),
      (t = te(t)),
      z(e, { year: t }),
      e.epoch
    );
  },
  Qn = function (e, t, r) {
    let n = e.clone();
    return (
      (t = te(t)),
      (e = e.month(0)),
      (e = e.date(1)),
      (e = e.day('monday')),
      e.monthName() === 'december' && e.date() >= 28 && (e = e.add(1, 'week')),
      (t -= 1),
      (e = e.add(t, 'weeks')),
      (e = ie(e, n, r, 'year')),
      e.epoch
    );
  },
  Gn = function (e, t, r) {
    t = te(t);
    let n = e.clone();
    return (
      (t -= 1),
      t <= 0 ? (t = 0) : t >= 365 && (t = 364),
      (e = e.startOf('year')),
      (e = e.add(t, 'day')),
      ut(e, n, 'hour'),
      (e = ie(e, n, r, 'year')),
      e.epoch
    );
  };
let it = 'am',
  lt = 'pm';
function Rn() {
  return it;
}
function Wn() {
  return lt;
}
function Jn(e) {
  (it = e.am || it), (lt = e.pm || lt);
}
const Kn = {
  millisecond: function (e) {
    if (e !== void 0) {
      let t = this.clone();
      return (t.epoch = Hn(t, e)), t;
    }
    return this.d.getMilliseconds();
  },
  second: function (e, t) {
    if (e !== void 0) {
      let r = this.clone();
      return (r.epoch = Zn(r, e, t)), r;
    }
    return this.d.getSeconds();
  },
  minute: function (e, t) {
    if (e !== void 0) {
      let r = this.clone();
      return (r.epoch = Et(r, e, t)), r;
    }
    return this.d.getMinutes();
  },
  hour: function (e, t) {
    let r = this.d;
    if (e !== void 0) {
      let n = this.clone();
      return (n.epoch = Xe(n, e, t)), n;
    }
    return r.getHours();
  },
  hourFloat: function (e, t) {
    if (e !== void 0) {
      let o = this.clone(),
        i = e % 1;
      i = i * 60;
      let c = parseInt(e, 10);
      return (o.epoch = Xe(o, c, t)), (o.epoch = Et(o, i, t)), o;
    }
    let r = this.d,
      n = r.getHours(),
      a = r.getMinutes();
    return (a = a / 60), n + a;
  },
  hour12: function (e, t) {
    let r = this.d;
    if (e !== void 0) {
      let a = this.clone();
      e = '' + e;
      let o = e.match(/^([0-9]+)(am|pm)$/);
      if (o) {
        let i = parseInt(o[1], 10);
        o[2] === 'pm' && (i += 12), (a.epoch = Xe(a, i, t));
      }
      return a;
    }
    let n = r.getHours();
    return n > 12 && (n = n - 12), n === 0 && (n = 12), n;
  },
  time: function (e, t) {
    if (e !== void 0) {
      let r = this.clone();
      return (e = e.toLowerCase().trim()), (r.epoch = Un(r, e, t)), r;
    }
    return `${this.h12()}:${y(this.minute())}${this.ampm()}`;
  },
  ampm: function (e, t) {
    let r = Rn(),
      n = this.hour();
    if ((n >= 12 && (r = Wn()), typeof e != 'string')) return r;
    let a = this.clone();
    return (
      (e = e.toLowerCase().trim()),
      n >= 12 && e === 'am'
        ? ((n -= 12), a.hour(n, t))
        : n < 12 && e === 'pm'
        ? ((n += 12), a.hour(n, t))
        : a
    );
  },
  dayTime: function (e, t) {
    if (e !== void 0) {
      const n = {
        morning: '7:00am',
        breakfast: '7:00am',
        noon: '12:00am',
        lunch: '12:00pm',
        afternoon: '2:00pm',
        evening: '6:00pm',
        dinner: '6:00pm',
        night: '11:00pm',
        midnight: '23:59pm'
      };
      let a = this.clone();
      return (
        (e = e || ''), (e = e.toLowerCase()), n.hasOwnProperty(e) === !0 && (a = a.time(n[e], t)), a
      );
    }
    let r = this.hour();
    return r < 6
      ? 'night'
      : r < 12
      ? 'morning'
      : r < 17
      ? 'afternoon'
      : r < 22
      ? 'evening'
      : 'night';
  },
  iso: function (e) {
    return e !== void 0 ? this.set(e) : this.format('iso');
  }
};
var Xn = Kn;
const xn = {
  date: function (e, t) {
    if (e !== void 0) {
      let r = this.clone();
      return (e = parseInt(e, 10)), e && (r.epoch = Pn(r, e, t)), r;
    }
    return this.d.getDate();
  },
  day: function (e, t) {
    if (e === void 0) return this.d.getDay();
    let r = this.clone(),
      n = e;
    typeof e == 'string' &&
      ((e = e.toLowerCase()),
      kt.hasOwnProperty(e)
        ? (n = kt[e])
        : ((n = Be().indexOf(e)), n === -1 && (n = He().indexOf(e))));
    let o = this.d.getDay() - n;
    t === !0 && o > 0 && (o = o - 7), t === !1 && o < 0 && (o = o + 7);
    let i = this.subtract(o, 'days');
    return z(i, { hour: r.hour(), minute: r.minute(), second: r.second() }), i;
  },
  dayName: function (e, t) {
    if (e === void 0) return He()[this.day()];
    let r = this.clone();
    return (r = r.day(e, t)), r;
  }
};
var ea = xn;
const Tt = (e) => ((e = e.minute(0)), (e = e.second(0)), (e = e.millisecond(1)), e),
  ta = {
    dayOfYear: function (e, t) {
      if (e !== void 0) {
        let o = this.clone();
        return (o.epoch = Gn(o, e, t)), o;
      }
      let r = 0,
        n = this.d.getMonth(),
        a;
      for (let o = 1; o <= n; o++)
        (a = new Date()),
          a.setDate(1),
          a.setFullYear(this.d.getFullYear()),
          a.setHours(1),
          a.setMinutes(1),
          a.setMonth(o),
          a.setHours(-2),
          (r += a.getDate());
      return r + this.d.getDate();
    },
    week: function (e, t) {
      if (e !== void 0) {
        let c = this.clone();
        return (c.epoch = Qn(this, e, t)), (c = Tt(c)), c;
      }
      let r = this.clone();
      (r = r.month(0)),
        (r = r.date(1)),
        (r = Tt(r)),
        (r = r.day('monday')),
        r.monthName() === 'december' && r.date() >= 28 && (r = r.add(1, 'week'));
      let n = 1;
      r.date() === 1 && (n = 0), (r = r.minus(1, 'second'));
      const a = this.epoch;
      if (r.epoch > a) return 1;
      let o = 0,
        i = this.month() * 4;
      for (r.epoch += Y.week * i, o += i; o <= 52; o++) {
        if (r.epoch > a) return o + n;
        r = r.add(1, 'week');
      }
      return 52;
    },
    month: function (e, t) {
      if (e !== void 0) {
        let r = this.clone();
        return (r.epoch = Vn(r, e, t)), r;
      }
      return this.d.getMonth();
    },
    monthName: function (e, t) {
      if (e !== void 0) {
        let r = this.clone();
        return (r = r.month(e, t)), r;
      }
      return Lr()[this.month()];
    },
    quarter: function (e, t) {
      if (
        e !== void 0 &&
        (typeof e == 'string' && ((e = e.replace(/^q/i, '')), (e = parseInt(e, 10))), ue[e])
      ) {
        let n = this.clone(),
          a = ue[e][0];
        return (n = n.month(a, t)), (n = n.date(1, t)), (n = n.startOf('day')), n;
      }
      let r = this.d.getMonth();
      for (let n = 1; n < ue.length; n++) if (r < ue[n][0]) return n - 1;
      return 4;
    },
    season: function (e, t) {
      let r = 'north';
      if ((this.hemisphere() === 'South' && (r = 'south'), e !== void 0)) {
        let a = this.clone();
        for (let o = 0; o < W[r].length; o++)
          e === W[r][o][0] &&
            ((a = a.month(W[r][o][1], t)), (a = a.date(1)), (a = a.startOf('day')));
        return a;
      }
      let n = this.d.getMonth();
      for (let a = 0; a < W[r].length - 1; a++)
        if (n >= W[r][a][1] && n < W[r][a + 1][1]) return W[r][a][0];
      return 'winter';
    },
    year: function (e) {
      if (e !== void 0) {
        let t = this.clone();
        return (t.epoch = xe(t, e)), t;
      }
      return this.d.getFullYear();
    },
    era: function (e) {
      if (e !== void 0) {
        let t = this.clone();
        e = e.toLowerCase();
        let r = t.d.getFullYear();
        return (
          e === 'bc' && r > 0 && (t.epoch = xe(t, r * -1)),
          e === 'ad' && r < 0 && (t.epoch = xe(t, r * -1)),
          t
        );
      }
      return this.d.getFullYear() < 0 ? 'BC' : 'AD';
    },
    decade: function (e) {
      if (e !== void 0) {
        if (
          ((e = String(e)),
          (e = e.replace(/([0-9])'?s$/, '$1')),
          (e = e.replace(/([0-9])(th|rd|st|nd)/, '$1')),
          !e)
        )
          return console.warn('Spacetime: Invalid decade input'), this;
        e.length === 2 && /[0-9][0-9]/.test(e) && (e = '19' + e);
        let t = Number(e);
        return isNaN(t) ? this : ((t = Math.floor(t / 10) * 10), this.year(t));
      }
      return this.startOf('decade').year();
    },
    century: function (e) {
      if (e !== void 0) {
        typeof e == 'string' &&
          ((e = e.replace(/([0-9])(th|rd|st|nd)/, '$1')),
          (e = e.replace(
            /([0-9]+) ?(b\.?c\.?|a\.?d\.?)/i,
            (n, a, o) => (o.match(/b\.?c\.?/i) && (a = '-' + a), a)
          )),
          (e = e.replace(/c$/, '')));
        let r = Number(e);
        return isNaN(e)
          ? (console.warn('Spacetime: Invalid century input'), this)
          : (r === 0 && (r = 1), r >= 0 ? (r = (r - 1) * 100) : (r = (r + 1) * 100), this.year(r));
      }
      let t = this.startOf('century').year();
      return (t = Math.floor(t / 100)), t < 0 ? t - 1 : t + 1;
    },
    millenium: function (e) {
      if (e !== void 0) {
        if (
          typeof e == 'string' &&
          ((e = e.replace(/([0-9])(th|rd|st|nd)/, '$1')), (e = Number(e)), isNaN(e))
        )
          return console.warn('Spacetime: Invalid millenium input'), this;
        e > 0 && (e -= 1);
        let r = e * 1e3;
        return r === 0 && (r = 1), this.year(r);
      }
      let t = Math.floor(this.year() / 1e3);
      return t >= 0 && (t += 1), t;
    }
  };
var ra = ta;
const F = Object.assign({}, Xn, ea, ra);
F.milliseconds = F.millisecond;
F.seconds = F.second;
F.minutes = F.minute;
F.hours = F.hour;
F.hour24 = F.hour;
F.h12 = F.hour12;
F.h24 = F.hour24;
F.days = F.day;
const na = (e) => {
  Object.keys(F).forEach((t) => {
    e.prototype[t] = F[t];
  });
};
var aa = na;
const st = function (e, t) {
    return e === 1 && Pe(t) ? 29 : ye[e];
  },
  oa = (e, t) => {
    if (e.month > 0) {
      let r = parseInt(e.month / 12, 10);
      (e.year = t.year() + r), (e.month = e.month % 12);
    } else if (e.month < 0) {
      let r = Math.abs(e.month),
        n = parseInt(r / 12, 10);
      r % 12 !== 0 && (n += 1),
        (e.year = t.year() - n),
        (e.month = e.month % 12),
        (e.month = e.month + 12),
        e.month === 12 && (e.month = 0);
    }
    return e;
  },
  ia = (e, t, r) => {
    (e.year = t.year()), (e.month = t.month());
    let n = t.date();
    for (e.date = n - Math.abs(r); e.date < 1; ) {
      (e.month -= 1), e.month < 0 && ((e.month = 11), (e.year -= 1));
      let a = st(e.month, e.year);
      e.date += a;
    }
    return e;
  },
  la = (e, t, r) => {
    let n = t.year(),
      a = t.month(),
      o = st(a, n);
    for (; r > o; ) (r -= o), (a += 1), a >= 12 && ((a -= 12), (n += 1)), (o = st(a, n));
    return (e.month = a), (e.date = r), e;
  },
  sa = oa,
  ua = la,
  ca = ia,
  R = ['millisecond', 'second', 'minute', 'hour', 'date', 'month'];
let oe = {
  second: R.slice(0, 1),
  minute: R.slice(0, 2),
  quarterhour: R.slice(0, 2),
  hour: R.slice(0, 3),
  date: R.slice(0, 4),
  month: R.slice(0, 4),
  quarter: R.slice(0, 4),
  season: R.slice(0, 4),
  year: R,
  decade: R,
  century: R
};
oe.week = oe.hour;
oe.season = oe.date;
oe.quarter = oe.date;
const fa = { year: !0, quarter: !0, season: !0, month: !0, week: !0, date: !0 },
  ha = { month: !0, quarter: !0, season: !0, year: !0 },
  da = (e) => {
    (e.prototype.add = function (t, r) {
      let n = this.clone();
      if (!r || t === 0) return n;
      let a = this.clone();
      if (((r = _e(r)), r === 'millisecond')) return (n.epoch += t), n;
      r === 'fortnight' && ((t *= 2), (r = 'week')),
        Y[r]
          ? (n.epoch += Y[r] * t)
          : r === 'week' || r === 'weekend'
          ? (n.epoch += Y.day * (t * 7))
          : r === 'quarter' || r === 'season'
          ? (n.epoch += Y.month * (t * 3))
          : r === 'quarterhour' && (n.epoch += Y.minute * 15 * t);
      let o = {};
      if (
        (oe[r] &&
          oe[r].forEach((i) => {
            o[i] = a[i]();
          }),
        fa[r])
      ) {
        const i = a.timezone().current.offset - n.timezone().current.offset;
        n.epoch += i * 3600 * 1e3;
      }
      if ((r === 'month' && ((o.month = a.month() + t), (o = sa(o, a))), r === 'week')) {
        let i = a.date() + t * 7;
        i <= 28 && i > 1 && (o.date = i);
      }
      if (r === 'weekend' && n.dayName() !== 'saturday') n = n.day('saturday', !0);
      else if (r === 'date') {
        if (t < 0) o = ca(o, a, t);
        else {
          let i = a.date() + t;
          o = ua(o, a, i);
        }
        t !== 0 && a.isSame(n, 'day') && (o.date = a.date() + t);
      } else if (r === 'quarter') {
        if (((o.month = a.month() + t * 3), (o.year = a.year()), o.month < 0)) {
          let i = Math.floor(o.month / 12),
            c = o.month + Math.abs(i) * 12;
          (o.month = c), (o.year += i);
        } else if (o.month >= 12) {
          let i = Math.floor(o.month / 12);
          (o.month = o.month % 12), (o.year += i);
        }
        o.date = a.date();
      } else if (r === 'year') {
        let i = a.year() + t,
          c = n.year();
        if (c < i) {
          let u = Math.floor(t / 4) || 1;
          n.epoch += Math.abs(Y.day * u);
        } else if (c > i) {
          let u = Math.floor(t / 4) || 1;
          n.epoch += Y.day * u;
        }
      } else
        r === 'decade' ? (o.year = n.year() + 10) : r === 'century' && (o.year = n.year() + 100);
      if (ha[r]) {
        let i = ye[o.month];
        (o.date = a.date()), o.date > i && (o.date = i);
      }
      return Object.keys(o).length > 1 && z(n, o), n;
    }),
      (e.prototype.subtract = function (t, r) {
        return this.clone().add(t * -1, r);
      }),
      (e.prototype.minus = e.prototype.subtract),
      (e.prototype.plus = e.prototype.add);
  };
var ma = da;
const qe = {
  millisecond: (e) => e.epoch,
  second: (e) => [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second()].join('-'),
  minute: (e) => [e.year(), e.month(), e.date(), e.hour(), e.minute()].join('-'),
  hour: (e) => [e.year(), e.month(), e.date(), e.hour()].join('-'),
  day: (e) => [e.year(), e.month(), e.date()].join('-'),
  week: (e) => [e.year(), e.week()].join('-'),
  month: (e) => [e.year(), e.month()].join('-'),
  quarter: (e) => [e.year(), e.quarter()].join('-'),
  year: (e) => e.year()
};
qe.date = qe.day;
const pa = (e) => {
  e.prototype.isSame = function (t, r, n = !0) {
    let a = this;
    if (!r) return null;
    if (typeof t == 'string' && typeof r == 'object') {
      let o = t;
      (t = r), (r = o);
    }
    return (
      (typeof t == 'string' || typeof t == 'number') && (t = new e(t, this.timezone.name)),
      (r = r.replace(/s$/, '')),
      n === !0 && a.tz !== t.tz && ((t = t.clone()), (t.tz = a.tz)),
      qe[r] ? qe[r](a) === qe[r](t) : null
    );
  };
};
var ya = pa;
const ga = (e) => {
  const t = {
    isAfter: function (r) {
      r = se(r, this);
      let n = Ee(r);
      return n === null ? null : this.epoch > n;
    },
    isBefore: function (r) {
      r = se(r, this);
      let n = Ee(r);
      return n === null ? null : this.epoch < n;
    },
    isEqual: function (r) {
      r = se(r, this);
      let n = Ee(r);
      return n === null ? null : this.epoch === n;
    },
    isBetween: function (r, n, a = !1) {
      (r = se(r, this)), (n = se(n, this));
      let o = Ee(r);
      if (o === null) return null;
      let i = Ee(n);
      return i === null
        ? null
        : a
        ? this.isBetween(r, n) || this.isEqual(r) || this.isEqual(n)
        : o < this.epoch && this.epoch < i;
    }
  };
  Object.keys(t).forEach((r) => {
    e.prototype[r] = t[r];
  });
};
var _a = ga;
const ba = (e) => {
  const t = {
    i18n: (r) => {
      ve(r.days) && en(r.days),
        ve(r.months) && Fr(r.months),
        Er(r.useTitleCase) && rn(r.useTitleCase),
        ve(r.ampm) && Jn(r.ampm);
    }
  };
  Object.keys(t).forEach((r) => {
    e.prototype[r] = t[r];
  });
};
var ka = ba;
let et = Kt;
const J = function (e, t, r = {}) {
  (this.epoch = null),
    (this.tz = Fe(t, et)),
    (this.silent = typeof r.silent != 'undefined' ? r.silent : !0),
    (this.british = r.dmy || r.british),
    (this._weekStart = 1),
    r.weekStart !== void 0 && (this._weekStart = r.weekStart),
    (this._today = {}),
    r.today !== void 0 && (this._today = r.today),
    Object.defineProperty(this, 'd', {
      get: function () {
        let a = hr(this),
          i = (new Date(this.epoch).getTimezoneOffset() || 0) + a * 60;
        i = i * 60 * 1e3;
        let c = this.epoch + i;
        return new Date(c);
      }
    }),
    Object.defineProperty(this, 'timezones', { get: () => et, set: (a) => ((et = a), a) });
  let n = er(this, e);
  this.epoch = n.epoch;
};
Object.keys(Dt).forEach((e) => {
  J.prototype[e] = Dt[e];
});
J.prototype.clone = function () {
  return new J(this.epoch, this.tz, {
    silent: this.silent,
    weekStart: this._weekStart,
    today: this._today,
    parsers: this.parsers
  });
};
J.prototype.toLocalDate = function () {
  return this.toNativeDate();
};
J.prototype.toNativeDate = function () {
  return new Date(this.epoch);
};
aa(J);
ma(J);
ya(J);
_a(J);
ka(J);
var G = J;
const va = (e, t) => {
  let r = new G(null),
    n = new G(null);
  (r = r.time(e)), t ? (n = n.time(t)) : (n = r.add(59, 'minutes'));
  let a = r.hour(),
    o = n.hour();
  return Object.keys(r.timezones).filter((c) => {
    if (c.indexOf('/') === -1) return !1;
    let u = new G(null, c),
      l = u.hour();
    return l >= a && l <= o
      ? !((l === a && u.minute() < r.minute()) || (l === o && u.minute() > n.minute()))
      : !1;
  });
};
var wa = va,
  $a = '7.1.4';
const Q = (e, t, r) => new G(e, t, r),
  Ve = function (e) {
    let t = e._today || {};
    return (
      Object.keys(t).forEach((r) => {
        e = e[r](t[r]);
      }),
      e
    );
  };
Q.now = (e, t) => {
  let r = new G(new Date().getTime(), e, t);
  return (r = Ve(r)), r;
};
Q.today = (e, t) => {
  let r = new G(new Date().getTime(), e, t);
  return (r = Ve(r)), r.startOf('day');
};
Q.tomorrow = (e, t) => {
  let r = new G(new Date().getTime(), e, t);
  return (r = Ve(r)), r.add(1, 'day').startOf('day');
};
Q.yesterday = (e, t) => {
  let r = new G(new Date().getTime(), e, t);
  return (r = Ve(r)), r.subtract(1, 'day').startOf('day');
};
Q.extend = function (e = {}) {
  return (
    Object.keys(e).forEach((t) => {
      G.prototype[t] = e[t];
    }),
    this
  );
};
Q.timezones = function () {
  return new G().timezones;
};
Q.max = function (e, t) {
  let r = new G(null, e, t);
  return (r.epoch = 864e13), r;
};
Q.min = function (e, t) {
  let r = new G(null, e, t);
  return (r.epoch = -864e13), r;
};
Q.whereIts = wa;
Q.version = $a;
Q.plugin = Q.extend;
var Oa = Q;
function Se(e) {
  return e == null;
}
function ce(e) {
  return !Se(e);
}
function tt(e, t) {
  return +(Math.round(e + 'e+' + t) + 'e-' + t);
}
function Mt(e) {
  e = Number(e);
  var t = Math.floor(e / 3600),
    r = Math.floor((e % 3600) / 60),
    n = Math.floor((e % 3600) % 60),
    a = t > 0 ? t + ' hour ' : '',
    o = r > 0 ? r + ' min ' : '',
    i = n > 0 ? n + ' sec ' : '';
  return `${a}${o}${i}`;
}
function ja(e, t = 50) {
  return e.slice(0, t) + '...';
}
function za(e) {
  let t, r, n;
  return {
    c() {
      (t = w('main')), (r = w('div')), this.h();
    },
    l(a) {
      t = $(a, 'MAIN', { class: !0 });
      var o = O(t);
      (r = $(o, 'DIV', { id: !0, class: !0 })), O(r).forEach(d), o.forEach(d), this.h();
    },
    h() {
      B(r, 'id', (n = `map_${e[0]}`)),
        B(r, 'class', 'map svelte-xl5gpj'),
        B(t, 'class', 'svelte-xl5gpj');
    },
    m(a, o) {
      D(a, t, o), m(t, r);
    },
    p(a, [o]) {
      o & 1 && n !== (n = `map_${a[0]}`) && B(r, 'id', n);
    },
    i: E,
    o: E,
    d(a) {
      a && d(t);
    }
  };
}
function Da(e, t, r) {
  let { lat: n = 51.505 } = t,
    { lon: a = -0.09 } = t,
    { zoom: o = 13 } = t,
    { id: i } = t;
  return (
    or(async () => {
      {
        const c = await sr(
            () =>
              import('./leaflet-src-84a0a24d.js').then(function (l) {
                return l.l;
              }),
            []
          ),
          u = c.map(`map_${i}`).setView([n, a], o);
        c
          .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 0,
            maxZoom: 20,
            maxNativeZoom: 19,
            attribution:
              '\xA9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          })
          .addTo(u),
          c.marker([n, a]).addTo(u);
      }
    }),
    (e.$$set = (c) => {
      'lat' in c && r(1, (n = c.lat)),
        'lon' in c && r(2, (a = c.lon)),
        'zoom' in c && r(3, (o = c.zoom)),
        'id' in c && r(0, (i = c.id));
    }),
    [i, n, a, o]
  );
}
class Ea extends $e {
  constructor(t) {
    super(), Oe(this, t, Da, za, je, { lat: 1, lon: 2, zoom: 3, id: 0 });
  }
}
function Ta(e) {
  let t = e[3](e[1]) + '',
    r;
  return {
    c() {
      r = S(t);
    },
    l(n) {
      r = q(n, t);
    },
    m(n, a) {
      D(n, r, a);
    },
    p: E,
    i: E,
    o: E,
    d(n) {
      n && d(r);
    }
  };
}
function Ma(e) {
  let t;
  function r(o, i) {
    return ce(o[1].url) ? Ya : Ba;
  }
  let a = r(e)(e);
  return {
    c() {
      a.c(), (t = L());
    },
    l(o) {
      a.l(o), (t = L());
    },
    m(o, i) {
      a.m(o, i), D(o, t, i);
    },
    p(o, i) {
      a.p(o, i);
    },
    i: E,
    o: E,
    d(o) {
      a.d(o), o && d(t);
    }
  };
}
function Na(e) {
  let t = e[4](e[1]) + '',
    r;
  return {
    c() {
      r = S(t);
    },
    l(n) {
      r = q(n, t);
    },
    m(n, a) {
      D(n, r, a);
    },
    p: E,
    i: E,
    o: E,
    d(n) {
      n && d(r);
    }
  };
}
function Sa(e) {
  let t,
    r = e[1] && La(e);
  return {
    c() {
      r && r.c(), (t = L());
    },
    l(n) {
      r && r.l(n), (t = L());
    },
    m(n, a) {
      r && r.m(n, a), D(n, t, a);
    },
    p(n, a) {
      n[1] && r.p(n, a);
    },
    i: E,
    o: E,
    d(n) {
      r && r.d(n), n && d(t);
    }
  };
}
function qa(e) {
  let t = e[5](e[1]) + '',
    r;
  return {
    c() {
      r = S(t);
    },
    l(n) {
      r = q(n, t);
    },
    m(n, a) {
      D(n, r, a);
    },
    p: E,
    i: E,
    o: E,
    d(n) {
      n && d(r);
    }
  };
}
function Ia(e) {
  let t,
    r = e[6](e[1]) + '',
    n;
  return {
    c() {
      (t = new ir(!1)), (n = L()), this.h();
    },
    l(a) {
      (t = lr(a, !1)), (n = L()), this.h();
    },
    h() {
      t.a = n;
    },
    m(a, o) {
      t.m(r, a, o), D(a, n, o);
    },
    p: E,
    i: E,
    o: E,
    d(a) {
      a && d(n), a && t.d();
    }
  };
}
function Ca(e) {
  let t,
    r,
    n = Ha(e[1]) + '',
    a,
    o;
  return (
    (t = new Ea({ props: { lat: e[1].latitude, lon: e[1].longitude, id: e[0].id } })),
    {
      c() {
        he(t.$$.fragment), (r = C()), (a = S(n));
      },
      l(i) {
        de(t.$$.fragment, i), (r = A(i)), (a = q(i, n));
      },
      m(i, c) {
        me(t, i, c), D(i, r, c), D(i, a, c), (o = !0);
      },
      p(i, c) {
        const u = {};
        c & 1 && (u.id = i[0].id), t.$set(u);
      },
      i(i) {
        o || (M(t.$$.fragment, i), (o = !0));
      },
      o(i) {
        I(t.$$.fragment, i), (o = !1);
      },
      d(i) {
        pe(t, i), i && d(r), i && d(a);
      }
    }
  );
}
function Aa(e) {
  let t = e[3](e[1].label) + '',
    r;
  return {
    c() {
      r = S(t);
    },
    l(n) {
      r = q(n, t);
    },
    m(n, a) {
      D(n, r, a);
    },
    p: E,
    i: E,
    o: E,
    d(n) {
      n && d(r);
    }
  };
}
function Ba(e) {
  let t = e[3](e[1].label) + '',
    r;
  return {
    c() {
      r = S(t);
    },
    l(n) {
      r = q(n, t);
    },
    m(n, a) {
      D(n, r, a);
    },
    p: E,
    d(n) {
      n && d(r);
    }
  };
}
function Ya(e) {
  let t,
    r = e[3](e[1].label) + '',
    n,
    a;
  return {
    c() {
      (t = w('a')), (n = S(r)), (a = S('\u2192')), this.h();
    },
    l(o) {
      t = $(o, 'A', { href: !0 });
      var i = O(t);
      (n = q(i, r)), (a = q(i, '\u2192')), i.forEach(d), this.h();
    },
    h() {
      B(t, 'href', e[3](e[1].url));
    },
    m(o, i) {
      D(o, t, i), m(t, n), m(t, a);
    },
    p: E,
    d(o) {
      o && d(t);
    }
  };
}
function La(e) {
  let t,
    r = ja(e[1], 50) + '',
    n,
    a;
  return {
    c() {
      (t = w('a')), (n = S(r)), (a = S('\u2192')), this.h();
    },
    l(o) {
      t = $(o, 'A', { href: !0 });
      var i = O(t);
      (n = q(i, r)), (a = q(i, '\u2192')), i.forEach(d), this.h();
    },
    h() {
      B(t, 'href', e[1]);
    },
    m(o, i) {
      D(o, t, i), m(t, n), m(t, a);
    },
    p: E,
    d(o) {
      o && d(t);
    }
  };
}
function Fa(e) {
  let t, r, n, a, o;
  const i = [Aa, Ca, Ia, qa, Sa, Na, Ma, Ta],
    c = [];
  function u(l, s) {
    return (
      s & 1 && (t = null),
      t == null && (t = !!l[2].includes(l[0].data_type)),
      t
        ? 0
        : l[0].data_type == 'globe-coordinate'
        ? 1
        : l[0].data_type == 'commonsMedia'
        ? 2
        : l[0].data_type == 'quantity'
        ? 3
        : l[0].data_type == 'url'
        ? 4
        : l[0].data_type == 'time'
        ? 5
        : l[0].data_type == 'external-id'
        ? 6
        : 7
    );
  }
  return (
    (r = u(e, -1)),
    (n = c[r] = i[r](e)),
    {
      c() {
        n.c(), (a = L());
      },
      l(l) {
        n.l(l), (a = L());
      },
      m(l, s) {
        c[r].m(l, s), D(l, a, s), (o = !0);
      },
      p(l, [s]) {
        let f = r;
        (r = u(l, s)),
          r === f
            ? c[r].p(l, s)
            : (ne(),
              I(c[f], 1, 1, () => {
                c[f] = null;
              }),
              ae(),
              (n = c[r]),
              n ? n.p(l, s) : ((n = c[r] = i[r](l)), n.c()),
              M(n, 1),
              n.m(a.parentNode, a));
      },
      i(l) {
        o || (M(n), (o = !0));
      },
      o(l) {
        I(n), (o = !1);
      },
      d(l) {
        c[r].d(l), l && d(a);
      }
    }
  );
}
function Ha(e) {
  let t = e.latitude || '',
    r = e.longitude || '';
  return ` ${t}, ${r}`;
}
function Za(e, t, r) {
  let { value: n } = t,
    a = n.data_value.value,
    o = ['wikibase-item', 'wikibase-property', 'wikibase-lexeme', 'geo-shape'];
  function i(s) {
    return ce(s) ? s : '';
  }
  function c(s) {
    if (Se(s)) return '';
    let f = s.replace(/^\+0+/, '');
    if (f.includes('-00-00T00:00:00Z')) return f.split('-00-00T00:00:00Z')[0];
    if (f.includes('T00:00:00Z')) return Oa(f).format('{date} {month} {year}');
    throw 'need to implement formatTime() for this time value';
  }
  function u(s) {
    if (Se(s) || Se(s.amount)) return;
    let f = Number(s.amount),
      h = ce(s.lowerBound),
      p = ce(s.upperBound),
      _ = 0;
    if (
      (h && p && s.upperBound.includes('.') && (_ = s.upperBound.split('.')[1].length),
      (h && !p) || (!h && p))
    )
      throw 'need both lowerBound and upperBound';
    if (h && p) {
      let v = f - Number(s.lowerBound),
        j = Number(s.upperBound) - f;
      if (tt(v, _) !== tt(j, _)) throw 'diff of lowerBound and upperBound have different values';
    }
    let k = String(f);
    if (h && p) {
      let v = Number(s.upperBound) - f;
      k += `\xB1${tt(v, _)}`;
    }
    return ce(s.unit) && (k += ` ${s.unit}`), k;
  }
  function l(s) {
    if (Se(s) || Object.keys(s).length == 0) return '';
    let f = s.title.replace('File:', '');
    switch (s.mediatype) {
      case 'AUDIO':
        return `
        <figure>
          <audio controls src=${s.url}>
            Your browser does not support embedded audio.
          </audio>
          <figcaption>
            <a href="${s.descriptionurl}">${f}&rarr;</a><br>
            ${Mt(s.duration)}
          </figcaption>
        </figure>
        `;
      case 'VIDEO':
        return `
        <figure>
          <video controls width="250">
            <source src=${s.url} type=${s.mime}>
             Your browser does not support embedded audio.
          </video>
          <figcaption>
            <a href="${s.descriptionurl}">${f}&rarr;</a><br>
            ${Mt(s.duration)}
          </figcaption>
        </figure>
        `;
      default:
        return `
        <figure>
          <img alt=${f.split('.')[0]} src=${s.thumburl}><br>
          <figcaption>
            <a href="${s.descriptionurl}">${f}&rarr;</a>
          </figcaption>
        </figure>
        `;
    }
  }
  return (
    (e.$$set = (s) => {
      'value' in s && r(0, (n = s.value));
    }),
    [n, a, o, i, c, u, l]
  );
}
class rr extends $e {
  constructor(t) {
    super(), Oe(this, t, Za, Fa, je, { value: 0 });
  }
}
function Ua(e) {
  let t, r, n;
  return {
    c() {
      (t = w('a')), (r = S('Wikidata page\u2192')), this.h();
    },
    l(a) {
      t = $(a, 'A', { href: !0, class: !0 });
      var o = O(t);
      (r = q(o, 'Wikidata page\u2192')), o.forEach(d), this.h();
    },
    h() {
      B(t, 'href', (n = e[0].url)), B(t, 'class', 'svelte-tbi6ah');
    },
    m(a, o) {
      D(a, t, o), m(t, r);
    },
    p: E,
    d(a) {
      a && d(t);
    }
  };
}
function Pa(e) {
  let t,
    r = e[1] && Ua(e);
  return {
    c() {
      r && r.c(), (t = L());
    },
    l(n) {
      r && r.l(n), (t = L());
    },
    m(n, a) {
      r && r.m(n, a), D(n, t, a);
    },
    p(n, [a]) {
      n[1] && r.p(n, a);
    },
    i: E,
    o: E,
    d(n) {
      r && r.d(n), n && d(t);
    }
  };
}
function Va(e, t, r) {
  let { value: n } = t,
    a = n.data_value.value,
    i =
      ['wikibase-item', 'wikibase-property', 'wikibase-lexeme', 'geo-shape'].includes(
        n.data_type
      ) &&
      ce(a) &&
      ce(a.url);
  return (
    (e.$$set = (c) => {
      'value' in c && r(2, (n = c.value));
    }),
    [a, i, n]
  );
}
class nr extends $e {
  constructor(t) {
    super(), Oe(this, t, Va, Pa, je, { value: 2 });
  }
}
function Qa(e) {
  let t,
    r,
    n = e[0].property_value + '',
    a,
    o,
    i,
    c,
    u,
    l,
    s;
  return (
    (c = new rr({ props: { value: e[0] } })),
    (l = new nr({ props: { value: e[0] } })),
    {
      c() {
        (t = w('tr')),
          (r = w('td')),
          (a = S(n)),
          (o = C()),
          (i = w('td')),
          he(c.$$.fragment),
          (u = C()),
          he(l.$$.fragment),
          this.h();
      },
      l(f) {
        t = $(f, 'TR', {});
        var h = O(t);
        r = $(h, 'TD', { class: !0 });
        var p = O(r);
        (a = q(p, n)), p.forEach(d), (o = A(h)), (i = $(h, 'TD', { class: !0 }));
        var _ = O(i);
        de(c.$$.fragment, _),
          (u = A(_)),
          de(l.$$.fragment, _),
          _.forEach(d),
          h.forEach(d),
          this.h();
      },
      h() {
        B(r, 'class', 'subproperty svelte-12reg0z'), B(i, 'class', 'svelte-12reg0z');
      },
      m(f, h) {
        D(f, t, h),
          m(t, r),
          m(r, a),
          m(t, o),
          m(t, i),
          me(c, i, null),
          m(i, u),
          me(l, i, null),
          (s = !0);
      },
      p(f, [h]) {
        (!s || h & 1) && n !== (n = f[0].property_value + '') && ze(a, n);
        const p = {};
        h & 1 && (p.value = f[0]), c.$set(p);
        const _ = {};
        h & 1 && (_.value = f[0]), l.$set(_);
      },
      i(f) {
        s || (M(c.$$.fragment, f), M(l.$$.fragment, f), (s = !0));
      },
      o(f) {
        I(c.$$.fragment, f), I(l.$$.fragment, f), (s = !1);
      },
      d(f) {
        f && d(t), pe(c), pe(l);
      }
    }
  );
}
function Ga(e, t, r) {
  let { value: n } = t;
  return (
    (e.$$set = (a) => {
      'value' in a && r(0, (n = a.value));
    }),
    [n]
  );
}
class ar extends $e {
  constructor(t) {
    super(), Oe(this, t, Ga, Qa, je, { value: 0 });
  }
}
function Nt(e, t, r) {
  const n = e.slice();
  return (n[1] = t[r]), n;
}
function St(e, t, r) {
  const n = e.slice();
  return (n[4] = t[r][0]), (n[5] = t[r][1]), (n[7] = r), n;
}
function qt(e, t, r) {
  const n = e.slice();
  return (n[8] = t[r]), n;
}
function It(e, t, r) {
  const n = e.slice();
  return (n[4] = t[r][0]), (n[5] = t[r][1]), (n[7] = r), n;
}
function Ct(e, t, r) {
  const n = e.slice();
  return (n[8] = t[r]), n;
}
function At(e) {
  let t,
    r,
    n,
    a,
    o,
    i = [],
    c = new Map(),
    u,
    l = Object.entries(e[0].qualifiers);
  const s = (f) => f[4];
  for (let f = 0; f < l.length; f += 1) {
    let h = It(e, l, f),
      p = s(h);
    c.set(p, (i[f] = Yt(p, h)));
  }
  return {
    c() {
      (t = w('section')), (r = w('div')), (n = S('Qualifiers')), (a = C()), (o = w('table'));
      for (let f = 0; f < i.length; f += 1) i[f].c();
      this.h();
    },
    l(f) {
      t = $(f, 'SECTION', { class: !0 });
      var h = O(t);
      r = $(h, 'DIV', { class: !0 });
      var p = O(r);
      (n = q(p, 'Qualifiers')), p.forEach(d), (a = A(h)), (o = $(h, 'TABLE', { class: !0 }));
      var _ = O(o);
      for (let k = 0; k < i.length; k += 1) i[k].l(_);
      _.forEach(d), h.forEach(d), this.h();
    },
    h() {
      B(r, 'class', 'section-title svelte-4k59kk'),
        B(o, 'class', 'table is-fullwidth'),
        B(t, 'class', 'svelte-4k59kk');
    },
    m(f, h) {
      D(f, t, h), m(t, r), m(r, n), m(t, a), m(t, o);
      for (let p = 0; p < i.length; p += 1) i[p].m(o, null);
      u = !0;
    },
    p(f, h) {
      h & 1 &&
        ((l = Object.entries(f[0].qualifiers)),
        ne(),
        (i = Rt(i, h, s, 1, f, l, c, o, Wt, Yt, null, It)),
        ae());
    },
    i(f) {
      if (!u) {
        for (let h = 0; h < l.length; h += 1) M(i[h]);
        u = !0;
      }
    },
    o(f) {
      for (let h = 0; h < i.length; h += 1) I(i[h]);
      u = !1;
    },
    d(f) {
      f && d(t);
      for (let h = 0; h < i.length; h += 1) i[h].d();
    }
  };
}
function Bt(e) {
  let t, r;
  return (
    (t = new ar({ props: { value: e[8] } })),
    {
      c() {
        he(t.$$.fragment);
      },
      l(n) {
        de(t.$$.fragment, n);
      },
      m(n, a) {
        me(t, n, a), (r = !0);
      },
      p(n, a) {
        const o = {};
        a & 1 && (o.value = n[8]), t.$set(o);
      },
      i(n) {
        r || (M(t.$$.fragment, n), (r = !0));
      },
      o(n) {
        I(t.$$.fragment, n), (r = !1);
      },
      d(n) {
        pe(t, n);
      }
    }
  );
}
function Yt(e, t) {
  let r,
    n,
    a,
    o = t[5],
    i = [];
  for (let u = 0; u < o.length; u += 1) i[u] = Bt(Ct(t, o, u));
  const c = (u) =>
    I(i[u], 1, 1, () => {
      i[u] = null;
    });
  return {
    key: e,
    first: null,
    c() {
      r = L();
      for (let u = 0; u < i.length; u += 1) i[u].c();
      (n = L()), this.h();
    },
    l(u) {
      r = L();
      for (let l = 0; l < i.length; l += 1) i[l].l(u);
      (n = L()), this.h();
    },
    h() {
      this.first = r;
    },
    m(u, l) {
      D(u, r, l);
      for (let s = 0; s < i.length; s += 1) i[s].m(u, l);
      D(u, n, l), (a = !0);
    },
    p(u, l) {
      if (((t = u), l & 1)) {
        o = t[5];
        let s;
        for (s = 0; s < o.length; s += 1) {
          const f = Ct(t, o, s);
          i[s]
            ? (i[s].p(f, l), M(i[s], 1))
            : ((i[s] = Bt(f)), i[s].c(), M(i[s], 1), i[s].m(n.parentNode, n));
        }
        for (ne(), s = o.length; s < i.length; s += 1) c(s);
        ae();
      }
    },
    i(u) {
      if (!a) {
        for (let l = 0; l < o.length; l += 1) M(i[l]);
        a = !0;
      }
    },
    o(u) {
      i = i.filter(Boolean);
      for (let l = 0; l < i.length; l += 1) I(i[l]);
      a = !1;
    },
    d(u) {
      u && d(r), Ue(i, u), u && d(n);
    }
  };
}
function Lt(e) {
  let t,
    r,
    n,
    a,
    o,
    i = e[0].references,
    c = [];
  for (let l = 0; l < i.length; l += 1) c[l] = Zt(Nt(e, i, l));
  const u = (l) =>
    I(c[l], 1, 1, () => {
      c[l] = null;
    });
  return {
    c() {
      (t = w('section')), (r = w('div')), (n = S('References')), (a = C());
      for (let l = 0; l < c.length; l += 1) c[l].c();
      this.h();
    },
    l(l) {
      t = $(l, 'SECTION', { class: !0 });
      var s = O(t);
      r = $(s, 'DIV', { class: !0 });
      var f = O(r);
      (n = q(f, 'References')), f.forEach(d), (a = A(s));
      for (let h = 0; h < c.length; h += 1) c[h].l(s);
      s.forEach(d), this.h();
    },
    h() {
      B(r, 'class', 'section-title svelte-4k59kk'), B(t, 'class', 'svelte-4k59kk');
    },
    m(l, s) {
      D(l, t, s), m(t, r), m(r, n), m(t, a);
      for (let f = 0; f < c.length; f += 1) c[f].m(t, null);
      o = !0;
    },
    p(l, s) {
      if (s & 1) {
        i = l[0].references;
        let f;
        for (f = 0; f < i.length; f += 1) {
          const h = Nt(l, i, f);
          c[f]
            ? (c[f].p(h, s), M(c[f], 1))
            : ((c[f] = Zt(h)), c[f].c(), M(c[f], 1), c[f].m(t, null));
        }
        for (ne(), f = i.length; f < c.length; f += 1) u(f);
        ae();
      }
    },
    i(l) {
      if (!o) {
        for (let s = 0; s < i.length; s += 1) M(c[s]);
        o = !0;
      }
    },
    o(l) {
      c = c.filter(Boolean);
      for (let s = 0; s < c.length; s += 1) I(c[s]);
      o = !1;
    },
    d(l) {
      l && d(t), Ue(c, l);
    }
  };
}
function Ft(e) {
  let t, r;
  return (
    (t = new ar({ props: { value: e[8] } })),
    {
      c() {
        he(t.$$.fragment);
      },
      l(n) {
        de(t.$$.fragment, n);
      },
      m(n, a) {
        me(t, n, a), (r = !0);
      },
      p(n, a) {
        const o = {};
        a & 1 && (o.value = n[8]), t.$set(o);
      },
      i(n) {
        r || (M(t.$$.fragment, n), (r = !0));
      },
      o(n) {
        I(t.$$.fragment, n), (r = !1);
      },
      d(n) {
        pe(t, n);
      }
    }
  );
}
function Ht(e, t) {
  let r,
    n,
    a,
    o = t[5],
    i = [];
  for (let u = 0; u < o.length; u += 1) i[u] = Ft(qt(t, o, u));
  const c = (u) =>
    I(i[u], 1, 1, () => {
      i[u] = null;
    });
  return {
    key: e,
    first: null,
    c() {
      r = L();
      for (let u = 0; u < i.length; u += 1) i[u].c();
      (n = L()), this.h();
    },
    l(u) {
      r = L();
      for (let l = 0; l < i.length; l += 1) i[l].l(u);
      (n = L()), this.h();
    },
    h() {
      this.first = r;
    },
    m(u, l) {
      D(u, r, l);
      for (let s = 0; s < i.length; s += 1) i[s].m(u, l);
      D(u, n, l), (a = !0);
    },
    p(u, l) {
      if (((t = u), l & 1)) {
        o = t[5];
        let s;
        for (s = 0; s < o.length; s += 1) {
          const f = qt(t, o, s);
          i[s]
            ? (i[s].p(f, l), M(i[s], 1))
            : ((i[s] = Ft(f)), i[s].c(), M(i[s], 1), i[s].m(n.parentNode, n));
        }
        for (ne(), s = o.length; s < i.length; s += 1) c(s);
        ae();
      }
    },
    i(u) {
      if (!a) {
        for (let l = 0; l < o.length; l += 1) M(i[l]);
        a = !0;
      }
    },
    o(u) {
      i = i.filter(Boolean);
      for (let l = 0; l < i.length; l += 1) I(i[l]);
      a = !1;
    },
    d(u) {
      u && d(r), Ue(i, u), u && d(n);
    }
  };
}
function Zt(e) {
  let t,
    r = [],
    n = new Map(),
    a,
    o,
    i = Object.entries(e[1]);
  const c = (u) => u[4];
  for (let u = 0; u < i.length; u += 1) {
    let l = St(e, i, u),
      s = c(l);
    n.set(s, (r[u] = Ht(s, l)));
  }
  return {
    c() {
      t = w('table');
      for (let u = 0; u < r.length; u += 1) r[u].c();
      (a = C()), this.h();
    },
    l(u) {
      t = $(u, 'TABLE', { class: !0 });
      var l = O(t);
      for (let s = 0; s < r.length; s += 1) r[s].l(l);
      (a = A(l)), l.forEach(d), this.h();
    },
    h() {
      B(t, 'class', 'table is-fullwidth reference-table svelte-4k59kk');
    },
    m(u, l) {
      D(u, t, l);
      for (let s = 0; s < r.length; s += 1) r[s].m(t, null);
      m(t, a), (o = !0);
    },
    p(u, l) {
      l & 1 &&
        ((i = Object.entries(u[1])), ne(), (r = Rt(r, l, c, 1, u, i, n, t, Wt, Ht, a, St)), ae());
    },
    i(u) {
      if (!o) {
        for (let l = 0; l < i.length; l += 1) M(r[l]);
        o = !0;
      }
    },
    o(u) {
      for (let l = 0; l < r.length; l += 1) I(r[l]);
      o = !1;
    },
    d(u) {
      u && d(t);
      for (let l = 0; l < r.length; l += 1) r[l].d();
    }
  };
}
function Ra(e) {
  let t,
    r,
    n,
    a = e[0].property_value + '',
    o,
    i,
    c,
    u,
    l,
    s,
    f,
    h,
    p,
    _,
    k,
    v;
  (u = new rr({ props: { value: e[0] } })), (s = new nr({ props: { value: e[0] } }));
  let j = e[0].qualifiers && At(e),
    b = e[0].references && Lt(e);
  return {
    c() {
      (t = w('table')),
        (r = w('tr')),
        (n = w('td')),
        (o = S(a)),
        (i = C()),
        (c = w('td')),
        he(u.$$.fragment),
        (l = C()),
        he(s.$$.fragment),
        (f = C()),
        j && j.c(),
        (h = C()),
        b && b.c(),
        (p = C()),
        (_ = w('table')),
        (k = w('tr')),
        this.h();
    },
    l(g) {
      t = $(g, 'TABLE', { class: !0 });
      var N = O(t);
      r = $(N, 'TR', {});
      var T = O(r);
      n = $(T, 'TD', { class: !0 });
      var H = O(n);
      (o = q(H, a)), H.forEach(d), (i = A(T)), (c = $(T, 'TD', {}));
      var P = O(c);
      de(u.$$.fragment, P),
        (l = A(P)),
        de(s.$$.fragment, P),
        (f = A(P)),
        j && j.l(P),
        (h = A(P)),
        b && b.l(P),
        (p = A(P)),
        (_ = $(P, 'TABLE', {}));
      var De = O(_);
      (k = $(De, 'TR', {})),
        O(k).forEach(d),
        De.forEach(d),
        P.forEach(d),
        T.forEach(d),
        N.forEach(d),
        this.h();
    },
    h() {
      B(n, 'class', 'property svelte-4k59kk'), B(t, 'class', 'table is-bordered is-fullwidth');
    },
    m(g, N) {
      D(g, t, N),
        m(t, r),
        m(r, n),
        m(n, o),
        m(r, i),
        m(r, c),
        me(u, c, null),
        m(c, l),
        me(s, c, null),
        m(c, f),
        j && j.m(c, null),
        m(c, h),
        b && b.m(c, null),
        m(c, p),
        m(c, _),
        m(_, k),
        (v = !0);
    },
    p(g, [N]) {
      (!v || N & 1) && a !== (a = g[0].property_value + '') && ze(o, a);
      const T = {};
      N & 1 && (T.value = g[0]), u.$set(T);
      const H = {};
      N & 1 && (H.value = g[0]),
        s.$set(H),
        g[0].qualifiers
          ? j
            ? (j.p(g, N), N & 1 && M(j, 1))
            : ((j = At(g)), j.c(), M(j, 1), j.m(c, h))
          : j &&
            (ne(),
            I(j, 1, 1, () => {
              j = null;
            }),
            ae()),
        g[0].references
          ? b
            ? (b.p(g, N), N & 1 && M(b, 1))
            : ((b = Lt(g)), b.c(), M(b, 1), b.m(c, p))
          : b &&
            (ne(),
            I(b, 1, 1, () => {
              b = null;
            }),
            ae());
    },
    i(g) {
      v || (M(u.$$.fragment, g), M(s.$$.fragment, g), M(j), M(b), (v = !0));
    },
    o(g) {
      I(u.$$.fragment, g), I(s.$$.fragment, g), I(j), I(b), (v = !1);
    },
    d(g) {
      g && d(t), pe(u), pe(s), j && j.d(), b && b.d();
    }
  };
}
function Wa(e, t, r) {
  let { claim: n } = t;
  return (
    (e.$$set = (a) => {
      'claim' in a && r(0, (n = a.claim));
    }),
    [n]
  );
}
class eo extends $e {
  constructor(t) {
    super(), Oe(this, t, Wa, Ra, je, { claim: 0 });
  }
}
function Ut(e, t, r) {
  const n = e.slice();
  return (n[5] = t[r]), n;
}
function Pt(e) {
  let t = e[2][e[5]] + '',
    r;
  return {
    c() {
      r = S(t);
    },
    l(n) {
      r = q(n, t);
    },
    m(n, a) {
      D(n, r, a);
    },
    p(n, a) {
      a & 1 && t !== (t = n[2][n[5]] + '') && ze(r, t);
    },
    d(n) {
      n && d(r);
    }
  };
}
function Vt(e) {
  let t = e[3][e[5]] + '',
    r;
  return {
    c() {
      r = S(t);
    },
    l(n) {
      r = q(n, t);
    },
    m(n, a) {
      D(n, r, a);
    },
    p(n, a) {
      a & 1 && t !== (t = n[3][n[5]] + '') && ze(r, t);
    },
    d(n) {
      n && d(r);
    }
  };
}
function Qt(e) {
  let t = e[4][e[5]] + '',
    r;
  return {
    c() {
      r = S(t);
    },
    l(n) {
      r = q(n, t);
    },
    m(n, a) {
      D(n, r, a);
    },
    p(n, a) {
      a & 1 && t !== (t = n[4][n[5]] + '') && ze(r, t);
    },
    d(n) {
      n && d(r);
    }
  };
}
function Gt(e) {
  let t,
    r,
    n = e[1].languages[e[5]] + '',
    a,
    o,
    i,
    c,
    u,
    l,
    s,
    f,
    h = e[2][e[5]] && Pt(e),
    p = e[3][e[5]] && Vt(e),
    _ = e[4][e[5]] && Qt(e);
  return {
    c() {
      (t = w('tr')),
        (r = w('td')),
        (a = S(n)),
        (o = C()),
        (i = w('td')),
        h && h.c(),
        (c = C()),
        (u = w('td')),
        p && p.c(),
        (l = C()),
        (s = w('td')),
        _ && _.c(),
        (f = C());
    },
    l(k) {
      t = $(k, 'TR', {});
      var v = O(t);
      r = $(v, 'TD', {});
      var j = O(r);
      (a = q(j, n)), j.forEach(d), (o = A(v)), (i = $(v, 'TD', {}));
      var b = O(i);
      h && h.l(b), b.forEach(d), (c = A(v)), (u = $(v, 'TD', {}));
      var g = O(u);
      p && p.l(g), g.forEach(d), (l = A(v)), (s = $(v, 'TD', {}));
      var N = O(s);
      _ && _.l(N), N.forEach(d), (f = A(v)), v.forEach(d);
    },
    m(k, v) {
      D(k, t, v),
        m(t, r),
        m(r, a),
        m(t, o),
        m(t, i),
        h && h.m(i, null),
        m(t, c),
        m(t, u),
        p && p.m(u, null),
        m(t, l),
        m(t, s),
        _ && _.m(s, null),
        m(t, f);
    },
    p(k, v) {
      v & 3 && n !== (n = k[1].languages[k[5]] + '') && ze(a, n),
        k[2][k[5]]
          ? h
            ? h.p(k, v)
            : ((h = Pt(k)), h.c(), h.m(i, null))
          : h && (h.d(1), (h = null)),
        k[3][k[5]]
          ? p
            ? p.p(k, v)
            : ((p = Vt(k)), p.c(), p.m(u, null))
          : p && (p.d(1), (p = null)),
        k[4][k[5]]
          ? _
            ? _.p(k, v)
            : ((_ = Qt(k)), _.c(), _.m(s, null))
          : _ && (_.d(1), (_ = null));
    },
    d(k) {
      k && d(t), h && h.d(), p && p.d(), _ && _.d();
    }
  };
}
function Ja(e) {
  let t,
    r,
    n,
    a,
    o,
    i,
    c,
    u,
    l,
    s,
    f,
    h,
    p,
    _,
    k,
    v,
    j = e[0],
    b = [];
  for (let g = 0; g < j.length; g += 1) b[g] = Gt(Ut(e, j, g));
  return {
    c() {
      (t = w('table')),
        (r = w('thead')),
        (n = w('tr')),
        (a = w('th')),
        (o = S('Language')),
        (i = C()),
        (c = w('th')),
        (u = S('Label')),
        (l = C()),
        (s = w('th')),
        (f = S('Description')),
        (h = C()),
        (p = w('th')),
        (_ = S('Also known as')),
        (k = C()),
        (v = w('tbody'));
      for (let g = 0; g < b.length; g += 1) b[g].c();
      this.h();
    },
    l(g) {
      t = $(g, 'TABLE', { class: !0 });
      var N = O(t);
      r = $(N, 'THEAD', {});
      var T = O(r);
      n = $(T, 'TR', {});
      var H = O(n);
      a = $(H, 'TH', {});
      var P = O(a);
      (o = q(P, 'Language')), P.forEach(d), (i = A(H)), (c = $(H, 'TH', {}));
      var De = O(c);
      (u = q(De, 'Label')), De.forEach(d), (l = A(H)), (s = $(H, 'TH', {}));
      var ct = O(s);
      (f = q(ct, 'Description')), ct.forEach(d), (h = A(H)), (p = $(H, 'TH', {}));
      var ft = O(p);
      (_ = q(ft, 'Also known as')),
        ft.forEach(d),
        H.forEach(d),
        T.forEach(d),
        (k = A(N)),
        (v = $(N, 'TBODY', {}));
      var ht = O(v);
      for (let Qe = 0; Qe < b.length; Qe += 1) b[Qe].l(ht);
      ht.forEach(d), N.forEach(d), this.h();
    },
    h() {
      B(t, 'class', 'table is-bordered is-fullwidth');
    },
    m(g, N) {
      D(g, t, N),
        m(t, r),
        m(r, n),
        m(n, a),
        m(a, o),
        m(n, i),
        m(n, c),
        m(c, u),
        m(n, l),
        m(n, s),
        m(s, f),
        m(n, h),
        m(n, p),
        m(p, _),
        m(t, k),
        m(t, v);
      for (let T = 0; T < b.length; T += 1) b[T].m(v, null);
    },
    p(g, [N]) {
      if (N & 31) {
        j = g[0];
        let T;
        for (T = 0; T < j.length; T += 1) {
          const H = Ut(g, j, T);
          b[T] ? b[T].p(H, N) : ((b[T] = Gt(H)), b[T].c(), b[T].m(v, null));
        }
        for (; T < b.length; T += 1) b[T].d(1);
        b.length = j.length;
      }
    },
    i: E,
    o: E,
    d(g) {
      g && d(t), Ue(b, g);
    }
  };
}
function Ka(e, t, r) {
  let { languageCodes: n } = t,
    { item: a } = t,
    o = a.labels || {},
    i = a.descriptions || {},
    c = a.aliases || {};
  return (
    (e.$$set = (u) => {
      'languageCodes' in u && r(0, (n = u.languageCodes)), 'item' in u && r(1, (a = u.item));
    }),
    [n, a, o, i, c]
  );
}
class to extends $e {
  constructor(t) {
    super(), Oe(this, t, Ka, Ja, je, { languageCodes: 0, item: 1 });
  }
}
export { eo as C, to as I };
