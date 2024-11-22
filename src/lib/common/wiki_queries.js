import { envars } from '$lib/envars';

const WD_QUERY_API = 'https://query.wikidata.org/sparql';
const DDC_QUERY_API = 'https://dancing-digital.wikibase.cloud/query/sparql';
const WD_API = 'https://www.wikidata.org/w/api.php?';
const WB_API = `${envars.wbUrl}/w/api.php?`;

async function executePostQuery(query, wikisource) {
  console.log(query);
  let formData = new FormData();
  formData.append('query', query);

  let QUERY_API = wikisource === 'wikidata' ? WD_QUERY_API : DDC_QUERY_API;

  let response = await fetch(QUERY_API, {
    method: 'post',
    headers: {
      Accept: 'application/sparql-results+json'
    },
    body: new URLSearchParams(formData)
  });

  if (response.ok) {
    let json = await response.json();
    return json['results']['bindings'];
  } else {
    return [];
  }
}

function extractIdFromLink(attr, result) {
  return result[attr]['value'].split('/')[4];
}

async function fetchSearchResults(keyword, targetWiki, language = 'en') {
  let params = {
    action: 'wbsearchentities',
    format: 'json',
    errorformat: 'plaintext',
    language: language,
    uselang: language,
    type: 'item',
    search: keyword,
    origin: '*' // set origin to deal with CORS on non-authenticated requests
  };
  let api = targetWiki === 'wikidata' ? WD_API : WB_API;
  const url = api + new URLSearchParams(params);

  const response = await fetch(url);
  let json = await response.json();
  return json['search'];
}

function formatSearchResults(results) {
  if (results.length == 0) {
    return [];
  }

  let tmp = [];

  results.forEach((result) => {
    let label;
    if (result['label']) {
      label = result['label'];
    } else if ('aliases' in result) {
      label = result['aliases'][0];
    }

    let search_label = label;
    let description = '';
    if (result['description']) {
      description = result['description'];
      search_label += ` (${description})`;
    }

    tmp.push({
      id: result['id'],
      label: label,
      search_label: search_label,
      description: description
    });
  });

  return tmp;
}

export async function searchKeyword(keyword, targetWiki = 'wikidata', language = 'en') {
  let results = await fetchSearchResults(keyword, targetWiki, language);
  return formatSearchResults(results);
}

export async function fetchNetworkGraphData(ids, properties, wikisource) {
  let propertiesString = properties
    .map((p) =>
      p
        .split(' ')
        .map((pp) => `wdt:${pp}`)
        .join(', ')
    )
    .join(', ');
  let idsString = ids.map((i) => `wd:${i}`).join(' ');
  let query = '';
  if (wikisource === 'ddc') {
    query += `
    PREFIX wd: <https://dancing-digital.wikibase.cloud/entity/>
    PREFIX wdt: <https://dancing-digital.wikibase.cloud/prop/direct/>
    `;
  }
  query += `
  SELECT DISTINCT ?prop ?propLabel ?selectedItem ?selectedItemLabel ?itemF ?itemFLabel ?itemR ?itemRLabel WHERE {
    VALUES ?selectedItem {
      ${idsString}
    }
    { ?selectedItem ?prop_ ?itemF. }
    UNION
    { ?itemR ?prop_ ?selectedItem. }
    ?prop wikibase:directClaim ?prop_.
    FILTER(?prop_ IN(${propertiesString}))
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  LIMIT 1000
  `;
  let data = await executePostQuery(query, wikisource);
  return { data, query };
}

export function formatNetworkGraphDataForVisJs(results, maxEdges = 200) {
  let ids = new Set();
  let nodes = [];
  let edges = [];
  let nodesObject = {};

  let tree = createTreeNetworkGraphData(results);
  let allowedIds = trimTreeNetworkGraphData(tree, maxEdges);
  results
    .filter((result) => {
      let id;
      if (result['itemF'] != undefined) {
        id = extractIdFromLink('itemF', result);
      } else {
        id = extractIdFromLink('itemR', result);
      }
      return allowedIds.has(id);
    })
    .forEach((result) => {
      let subjectId;
      let subjectLabel;
      let objectId;
      let objectLabel;
      let colorField;
      let propertyId = extractIdFromLink('prop', result);
      let propertyLabel = result['propLabel']['value'];

      if (result['itemF']) {
        colorField = 'subject';
        subjectId = extractIdFromLink('selectedItem', result);
        subjectLabel = result['selectedItemLabel']['value'];
        objectId = extractIdFromLink('itemF', result);
        objectLabel = result['itemFLabel']['value'];
      } else {
        colorField = 'object';
        subjectId = extractIdFromLink('itemR', result);
        subjectLabel = result['itemRLabel']['value'];
        objectId = extractIdFromLink('selectedItem', result);
        objectLabel = result['selectedItemLabel']['value'];
      }

      // create nodes
      if (!ids.has(subjectId)) {
        ids.add(subjectId);
        let data = { id: subjectId, label: subjectLabel };
        if (colorField == 'subject') {
          data['color'] = { background: '#00d1b2' };
        }
        nodes.push(data);
        nodesObject[subjectId] = subjectLabel;
      }
      if (!ids.has(objectId)) {
        ids.add(objectId);
        let data = { id: objectId, label: objectLabel };
        if (colorField == 'object') {
          data['color'] = { background: '#00d1b2' };
        }
        nodes.push(data);
        nodesObject[objectId] = objectLabel;
      }

      // create edges
      let subObjId = `${subjectId} ${propertyId} ${objectId}`;
      if (!ids.has(subObjId)) {
        ids.add(subObjId);
        edges.push({
          from: subjectId,
          to: objectId,
          propertyId: propertyId,
          label: propertyLabel,
          fromLabel: nodesObject[subjectId],
          toLabel: nodesObject[objectId]
        });
      }
    });
  return { nodes, edges };
}

export function createTreeNetworkGraphData(results) {
  let tree = {};

  results.forEach((result) => {
    let id = extractIdFromLink('selectedItem', result);
    if (tree[id] == undefined) {
      tree[id] = { parent: null, kids: [] };
    }

    if (result['itemF'] != undefined) {
      let id2 = extractIdFromLink('itemF', result);
      if (tree[id2] == undefined) {
        tree[id2] = { parent: id, kids: [] };
      }
      tree[id]['kids'].push(id2);
    }

    if (result['itemR'] != undefined) {
      let id2 = extractIdFromLink('itemR', result);
      if (tree[id2] == undefined) {
        tree[id2] = { parent: id, kids: [] };
      }
      tree[id]['kids'].push(id2);
    }
  });

  return tree;
}

export function trimTreeNetworkGraphData(tree, maxLimit) {
  let newTree = new Set();

  for (let [key, data] of Object.entries(tree)) {
    if (data['parent'] == null) {
      newTree.add(key);
    }
    data['kids'].forEach((kid, i) => {
      if (i < maxLimit) {
        newTree.add(kid);
      }
    });
  }

  return newTree;
}

export async function getNetworkGraphData(
  ids,
  properties,
  iterations,
  ignoreItemsIds,
  wikisource = 'wikidata'
) {
  let data;
  while (iterations > 0) {
    let results = await fetchNetworkGraphData(ids, properties, wikisource);
    data = formatNetworkGraphDataForVisJs(results['data']);
    data['query'] = results['query'];
    data['nodes'] = data['nodes'].filter((n) => !ignoreItemsIds.includes(n['id']));
    data['edges'] = data['edges'].filter(
      (n) => !ignoreItemsIds.includes(n['to']) && !ignoreItemsIds.includes(n['from'])
    );
    ids = data['nodes'].map((n) => n['id']);
    iterations = iterations - 1;
  }

  return data;
}

export async function getNetworkGraphDataForOneNode(id, properties, wikisource) {
  let results = await fetchNetworkGraphData([id], properties, wikisource);
  let data = formatNetworkGraphDataForVisJs(results['data']);
  data['query'] = results['query'];

  return data;
}

export let peopleMenu = [
  { label: 'academic appointment', wikidataId: 'P8413', ddcId: '' },
  { label: 'award received', wikidataId: 'P166', ddcId: '' },
  // { label: 'copyright status as a creator', wikidataId: 'P7763', ddcId: ''  },
  // { label: 'documentation files at', wikidataId: 'P10527', ddcId: ''  },
  { label: 'educated at', wikidataId: 'P69', ddcId: '' },
  { label: 'employer', wikidataId: 'P108', ddcId: '' },
  // { label: 'exhibited creator', wikidataId: 'P10661', ddcId: ''  },
  { label: 'founded by', wikidataId: 'P112', ddcId: '' },
  // { label: 'has works in the collection', wikidataId: 'P6379', ddcId: ''  },
  // { label: 'member of', wikidataId: 'P463', ddcId: ''  },
  { label: 'nominated for', wikidataId: 'P1411', ddcId: '' },
  { label: 'notable works', wikidataId: 'P800', ddcId: '' },
  // { label: 'occupation', wikidataId: 'P106', ddcId: ''  },
  { label: 'professorship', wikidataId: 'P803', ddcId: '' },
  { label: 'student of', wikidataId: 'P1066', ddcId: '' },
  { label: 'student', wikidataId: 'P802', ddcId: '' },
  { label: 'work location', wikidataId: 'P937', ddcId: '' },
  { label: 'winner', wikidataId: 'P1346', ddcId: '' }
];
export let venueMenu = [];
export let rolesMenu = [
  { label: 'art director', wikidataId: 'P3174', ddcId: 'P198 P110' },
  { label: 'cast member', wikidataId: 'P161', ddcId: '' },
  { label: 'choreographer', wikidataId: 'P1809', ddcId: 'P116' },
  { label: 'composer', wikidataId: 'P86', ddcId: 'P123 P172' },
  { label: 'costume designer', wikidataId: 'P2515', ddcId: 'P127' },
  { label: 'curator', wikidataId: 'P1640', ddcId: 'P128' },
  { label: 'director', wikidataId: 'P57', ddcId: 'P118 P132' },
  { label: 'director/manager', wikidataId: 'P1037', ddcId: 'P122 P205 P136 P182 P185' },
  { label: 'executive producer', wikidataId: 'P1431', ddcId: 'P223 P164' },
  { label: 'film editor', wikidataId: 'P1040', ddcId: 'P229 P190' },
  { label: 'illustrator', wikidataId: 'P110', ddcId: 'P220 P156' },
  { label: 'librettist', wikidataId: 'P87', ddcId: 'P145' },
  { label: 'lighting designer', wikidataId: 'P5026', ddcId: 'P146' },
  { label: 'make-up artist', wikidataId: 'P4805', ddcId: 'P218' },
  // { label: 'main subject', wikidataId: 'P921', ddcId: '' },
  { label: 'musical conductor', wikidataId: 'P3300', ddcId: 'P124 P207 P152' },
  {
    label: 'performer',
    wikidataId: 'P175',
    ddcId: 'P106 P112 P119 P129 P130 P131 P150 P154 P155 P171 P179 P187 P188 P191'
  },
  { label: 'presenter', wikidataId: 'P371', ddcId: 'P160' },
  { label: 'producer', wikidataId: 'P162', ddcId: 'P162' },
  { label: 'production designer', wikidataId: 'P2554', ddcId: '' },
  { label: 'scenographer', wikidataId: 'P4608', ddcId: 'P224 P170' },
  { label: 'sound designer', wikidataId: 'P5028', ddcId: 'P173' },
  { label: 'speaker', wikidataId: 'P823', ddcId: 'P175' },
  {
    label: 'stage crew member',
    wikidataId: 'P5802',
    ddcId:
      'P108 P109 P113 P114 P115 P125 P135 P137 P138 P139 P144 P147 P159 P161 P163 P165 P166 P167 P168 P169 P174 P176 P177 P178 P180 P181 P183 P189 P192 P193 P197'
  },
  { label: 'translator', wikidataId: 'P655', ddcId: 'P186 P228' }
];
export let worksMenu = [
  { label: 'location of first performance', wikidataId: 'P4647', ddcId: '' },
  { label: 'part of the series', wikidataId: 'P179', ddcId: 'P142 P214' },
  { label: 'production company', wikidataId: 'P272', ddcId: 'P121 P204' },
  { label: 'recorded at studio or venue', wikidataId: 'P483', ddcId: '' },
  { label: 'recording or performance of', wikidataId: 'P2550', ddcId: 'P140 P141 P213' }
];
export let otherMenu = [];

export let allMenuOptions = {
  people: peopleMenu,
  roles: rolesMenu,
  works: worksMenu
};
