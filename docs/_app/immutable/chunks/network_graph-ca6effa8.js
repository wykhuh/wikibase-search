import{S as x,i as $,s as ee,e as N,c as R,a as j,d as c,b as F,g as I,k as T,t as y,m as G,h as E,j as C,G as w,M as te,n as Q,N as ae}from"./index-ef7e113d.js";const le="https://query.wikidata.org/sparql",ie="https://dancing-digital.wikibase.cloud/query/sparql";async function re(s,e){console.log(s);let a=new FormData;a.append("query",s);let r=await fetch(e==="wikidata"?le:ie,{method:"post",headers:{Accept:"application/sparql-results+json"},body:new URLSearchParams(a)});return r.ok?(await r.json()).results.bindings:[]}function D(s,e){return e[s].value.split("/")[4]}async function K(s,e,a){let l=e.map(t=>t.split(" ").map(n=>`wdt:${n}`).join(", ")).join(", "),r=s.map(t=>`wd:${t}`).join(" "),o="";return a==="ddc"&&(o+=`
    PREFIX wd: <https://dancing-digital.wikibase.cloud/entity/>
    PREFIX wdt: <https://dancing-digital.wikibase.cloud/prop/direct/>
    `),o+=`
  SELECT DISTINCT ?prop ?propLabel ?selectedItem ?selectedItemLabel ?itemF ?itemFLabel ?itemR ?itemRLabel WHERE {
    VALUES ?selectedItem {
      ${r}
    }
    { ?selectedItem ?prop_ ?itemF. }
    UNION
    { ?itemR ?prop_ ?selectedItem. }
    ?prop wikibase:directClaim ?prop_.
    FILTER(?prop_ IN(${l}))
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  LIMIT 1000
  `,{data:await re(o,a),query:o}}function Z(s,e=200){let a=new Set,l=[],r=[],o={},i=ne(s),t=se(i,e);return s.filter(n=>{let d;return n.itemF!=null?d=D("itemF",n):d=D("itemR",n),t.has(d)}).forEach(n=>{let d,u,h,g,b=D("prop",n),v=n.propLabel.value;if(n.itemF?(d=D("selectedItem",n),u=n.selectedItemLabel.value,h=D("itemF",n),g=n.itemFLabel.value):(d=D("itemR",n),u=n.itemRLabel.value,h=D("selectedItem",n),g=n.selectedItemLabel.value),!a.has(d)){a.add(d);let S={id:d,label:u};l.push(S),o[d]=u}if(!a.has(h)){a.add(h);let S={id:h,label:g};l.push(S),o[h]=g}let L=`${d} ${b} ${h}`;a.has(L)||(a.add(L),r.push({from:d,to:h,propertyId:b,label:v,fromLabel:o[d],toLabel:o[h]}))}),{nodes:l,edges:r}}function ne(s){let e={};return s.forEach(a=>{let l=D("selectedItem",a);if(e[l]==null&&(e[l]={parent:null,kids:[]}),a.itemF!=null){let r=D("itemF",a);e[r]==null&&(e[r]={parent:l,kids:[]}),e[l].kids.push(r)}if(a.itemR!=null){let r=D("itemR",a);e[r]==null&&(e[r]={parent:l,kids:[]}),e[l].kids.push(r)}}),e}function se(s,e){let a=new Set;for(let[l,r]of Object.entries(s))r.parent==null&&a.add(l),r.kids.forEach((o,i)=>{i<e&&a.add(o)});return a}async function ce(s,e,a,l,r="wikidata"){let o;for(;a>0;){let i=await K(s,e,r);o=Z(i.data),o.query=i.query,o.nodes=o.nodes.filter(t=>!l.includes(t.id)),o.edges=o.edges.filter(t=>!l.includes(t.to)&&!l.includes(t.from)),s=o.nodes.map(t=>t.id),a=a-1}return o}async function oe(s,e,a){let l=await K([s],e,a),r=Z(l.data);return r.query=l.query,r}function V(s,e,a){const l=s.slice();return l[20]=e[a],l}function Y(s){let e;return{c(){e=N("div"),this.h()},l(a){e=R(a,"DIV",{class:!0}),j(e).forEach(c),this.h()},h(){F(e,"class","lds-dual-ring svelte-dt5x0l")},m(a,l){I(a,e,l)},d(a){a&&c(e)}}}function B(s){let e,a,l,r,o,i=s[2].id&&H(s);return{c(){i&&i.c(),e=T(),a=y(s[3]),l=y(" records, "),r=y(s[4]),o=y(" relationships")},l(t){i&&i.l(t),e=G(t),a=E(t,s[3]),l=E(t," records, "),r=E(t,s[4]),o=E(t," relationships")},m(t,n){i&&i.m(t,n),I(t,e,n),I(t,a,n),I(t,l,n),I(t,r,n),I(t,o,n)},p(t,n){t[2].id?i?i.p(t,n):(i=H(t),i.c(),i.m(e.parentNode,e)):i&&(i.d(1),i=null),n&8&&C(a,t[3]),n&16&&C(r,t[4])},d(t){i&&i.d(t),t&&c(e),t&&c(a),t&&c(l),t&&c(r),t&&c(o)}}}function H(s){let e=s[2].label+"",a,l,r=s[2].id+"",o,i;return{c(){a=y(e),l=y(" ("),o=y(r),i=y("):")},l(t){a=E(t,e),l=E(t," ("),o=E(t,r),i=E(t,"):")},m(t,n){I(t,a,n),I(t,l,n),I(t,o,n),I(t,i,n)},p(t,n){n&4&&e!==(e=t[2].label+"")&&C(a,e),n&4&&r!==(r=t[2].id+"")&&C(o,r)},d(t){t&&c(a),t&&c(l),t&&c(o),t&&c(i)}}}function X(s){let e,a=s[0].edges,l=[];for(let r=0;r<a.length;r+=1)l[r]=J(V(s,a,r));return{c(){e=N("table");for(let r=0;r<l.length;r+=1)l[r].c();this.h()},l(r){e=R(r,"TABLE",{class:!0});var o=j(e);for(let i=0;i<l.length;i+=1)l[i].l(o);o.forEach(c),this.h()},h(){F(e,"class","table svelte-dt5x0l")},m(r,o){I(r,e,o);for(let i=0;i<l.length;i+=1)l[i].m(e,null)},p(r,o){if(o&33){a=r[0].edges;let i;for(i=0;i<a.length;i+=1){const t=V(r,a,i);l[i]?l[i].p(t,o):(l[i]=J(t),l[i].c(),l[i].m(e,null))}for(;i<l.length;i+=1)l[i].d(1);l.length=a.length}},d(r){r&&c(e),te(l,r)}}}function J(s){let e,a,l,r=s[20].fromLabel+"",o,i,t,n,d=s[20].label+"",u,h,g,b,v=s[20].toLabel+"",L,S,z;return{c(){e=N("tr"),a=N("td"),l=N("a"),o=y(r),t=T(),n=N("td"),u=y(d),h=T(),g=N("td"),b=N("a"),L=y(v),z=T(),this.h()},l(_){e=R(_,"TR",{});var m=j(e);a=R(m,"TD",{});var P=j(a);l=R(P,"A",{href:!0});var O=j(l);o=E(O,r),O.forEach(c),P.forEach(c),t=G(m),n=R(m,"TD",{});var U=j(n);u=E(U,d),U.forEach(c),h=G(m),g=R(m,"TD",{});var f=j(g);b=R(f,"A",{href:!0});var k=j(b);L=E(k,v),k.forEach(c),f.forEach(c),z=G(m),m.forEach(c),this.h()},h(){F(l,"href",i=s[5](s[20].from)),F(b,"href",S=s[5](s[20].to))},m(_,m){I(_,e,m),w(e,a),w(a,l),w(l,o),w(e,t),w(e,n),w(n,u),w(e,h),w(e,g),w(g,b),w(b,L),w(e,z)},p(_,m){m&1&&r!==(r=_[20].fromLabel+"")&&C(o,r),m&1&&i!==(i=_[5](_[20].from))&&F(l,"href",i),m&1&&d!==(d=_[20].label+"")&&C(u,d),m&1&&v!==(v=_[20].toLabel+"")&&C(L,v),m&1&&S!==(S=_[5](_[20].to))&&F(b,"href",S)},d(_){_&&c(e)}}}function de(s){let e,a,l,r,o,i=s[1]&&Y(),t=s[0].nodes&&B(s),n=s[0].edges&&X(s);return{c(){e=N("main"),i&&i.c(),a=T(),t&&t.c(),l=T(),r=N("div"),o=T(),n&&n.c(),this.h()},l(d){e=R(d,"MAIN",{class:!0});var u=j(e);i&&i.l(u),a=G(u),t&&t.l(u),l=G(u),r=R(u,"DIV",{id:!0,class:!0}),j(r).forEach(c),o=G(u),n&&n.l(u),u.forEach(c),this.h()},h(){F(r,"id","mynetwork"),F(r,"class","svelte-dt5x0l"),F(e,"class","svelte-dt5x0l")},m(d,u){I(d,e,u),i&&i.m(e,null),w(e,a),t&&t.m(e,null),w(e,l),w(e,r),w(e,o),n&&n.m(e,null)},p(d,[u]){d[1]?i||(i=Y(),i.c(),i.m(e,a)):i&&(i.d(1),i=null),d[0].nodes?t?t.p(d,u):(t=B(d),t.c(),t.m(e,l)):t&&(t.d(1),t=null),d[0].edges?n?n.p(d,u):(n=X(d),n.c(),n.m(e,null)):n&&(n.d(1),n=null)},i:Q,o:Q,d(d){d&&c(e),i&&i.d(),t&&t.d(),n&&n.d()}}}function fe(s,e,a){let{networkData:l}=e,{graphItem:r}=e,{properties:o}=e,{resetGraphStatus:i}=e,{loading:t}=e,{newSearchStatus:n}=e,{targetWiki:d="wikidata"}=e,{clickToLoadMoreNodes:u=!0}=e,h={},g={},b={},v=0,L=0,S=0;const z=ae();function _(f){let k=d=="wikidata"?"https://www.wikidata.org":"https://dancing-digital.wikibase.cloud";return k+="/wiki/",k+=d=="wikidata"?f:"Item:"+f,k}function m(){h={},g={},a(11,b={}),a(3,v=0)}function P(f){if(!f.nodes)return;let k="rgb(255,168,7)";a(1,t=!0);let q=[];f.nodes.forEach(p=>{p.id===r.id&&(p.color={background:k}),q.push(p)}),h=new vis.DataSet(q),g=new vis.DataSet(f.edges),h.length==0&&h.add({id:r.id,label:r.label,color:{background:k}});var A=document.getElementById("mynetwork"),M={nodes:h,edges:g},W={layout:{improvedLayout:!1},edges:{arrows:{to:{enabled:!0,type:"arrow",scaleFactor:.5}}},physics:{barnesHut:{gravitationalConstant:-3e3,damping:1,avoidOverlap:.3}},interaction:{hover:u}};a(11,b=new vis.Network(A,M,W)),U(b)}async function O(f){if(!u)return;let k=f.nodes[0],q=await oe(k,o,d),A=!1;a(6,n=!1),z("changeSearchStatus",n);let M=new Set(l.nodes.map(p=>p.id)),W=new Set(l.edges.map(p=>`${p.from} ${p.property_id} ${p.to}`));return q.nodes.forEach(p=>{M.has(p.id)||(h.add(p),a(3,v+=1),a(0,l.nodes=[...l.nodes,p],l),A=!0)}),q.edges.forEach(p=>{W.has(`${p.from} ${p.property_id} ${p.to}`)||(g.add(p),a(0,l.edges=[...l.edges,p],l),A=!0)}),A}function U(f){f.on("doubleClick",async function(k){a(1,t=!0),await O(k)||a(1,t=!1)}),f.on("startStabilizing",function(){a(1,t=!1)}),f.on("stabilizationProgress",function(){a(1,t=!0)}),f.on("stabilizationIterationsDone",function(){a(1,t=!1)}),f.on("stabilized",function(){a(1,t=!1)}),f.on("afterDrawing",function(){t&&(S+=1,S>35&&(S=0,a(1,t=!1)))})}return s.$$set=f=>{"networkData"in f&&a(0,l=f.networkData),"graphItem"in f&&a(2,r=f.graphItem),"properties"in f&&a(7,o=f.properties),"resetGraphStatus"in f&&a(8,i=f.resetGraphStatus),"loading"in f&&a(1,t=f.loading),"newSearchStatus"in f&&a(6,n=f.newSearchStatus),"targetWiki"in f&&a(9,d=f.targetWiki),"clickToLoadMoreNodes"in f&&a(10,u=f.clickToLoadMoreNodes)},s.$$.update=()=>{s.$$.dirty&65&&n&&(m(),P(l),a(3,v=l.nodes?l.nodes.length:0),a(4,L=l.edges?l.edges.length:0)),s.$$.dirty&2304&&i&&typeof b.destroy=="function"&&(b.destroy(),m())},[l,t,r,v,L,_,n,o,i,d,u,b]}class he extends x{constructor(e){super(),$(this,e,fe,de,ee,{networkData:0,graphItem:2,properties:7,resetGraphStatus:8,loading:1,newSearchStatus:6,targetWiki:9,clickToLoadMoreNodes:10})}}export{he as N,ce as g};
