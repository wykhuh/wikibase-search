import { swapObjectKeysValues } from '$lib/common/utils';
import { envars } from '$lib/envars';

const QUERY_API = 'https://query.wikidata.org/sparql';
const WD_API = 'https://www.wikidata.org/w/api.php?';
const CA_API = envars.wikiDemoApi;

async function executeQuery(query) {
  const fullUrl = QUERY_API + '?query=' + encodeURIComponent(query);
  const headers = { Accept: 'application/sparql-results+json' };
  let response = await fetch(fullUrl, { headers });
  let json = await response.json();
  return json['results']['bindings'];
}

async function executePostQuery(query) {
  console.log(query);
  let formData = new FormData();
  formData.append('query', query);

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

async function fetchAllPropsForIds(ids) {
  let idStr = ids.map((id) => `(wd:${id})`).join(' ');
  let query = `
  SELECT DISTINCT ?item ?itemLabel {
      VALUES (?record) {${idStr}}
      ?record ?p ?statement .
      ?item wikibase:claim ?p .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  `;
  return await executeQuery(query);
}

export async function fetchSearchResults(keyword, language = 'en') {
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
  const url = WD_API + new URLSearchParams(params);

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

export async function searchKeyword(keyword, language = 'en') {
  let results = await fetchSearchResults(keyword, language);
  return formatSearchResults(results);
}

export async function searchKeywordCa(keyword) {
  // works!
  const url = CA_API + '/search?keyword=' + keyword;
  const response = await fetch(url);
  return await response.json();
}

export async function fetchNetworkGraphData(ids, properties) {
  let propertiesString = properties.map((p) => `wdt:${p}`).join(', ');
  let idsString = ids.map((i) => `wd:${i}`).join(' ');
  let query = `
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
  let data = await executePostQuery(query);
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
      let propertyId = extractIdFromLink('prop', result);
      let propertyLabel = result['propLabel']['value'];

      if (result['itemF']) {
        subjectId = extractIdFromLink('selectedItem', result);
        subjectLabel = result['selectedItemLabel']['value'];
        objectId = extractIdFromLink('itemF', result);
        objectLabel = result['itemFLabel']['value'];
      } else {
        subjectId = extractIdFromLink('itemR', result);
        subjectLabel = result['itemRLabel']['value'];
        objectId = extractIdFromLink('selectedItem', result);
        objectLabel = result['selectedItemLabel']['value'];
      }

      // create nodes
      if (!ids.has(subjectId)) {
        ids.add(subjectId);
        nodes.push({ id: subjectId, label: subjectLabel });
        nodesObject[subjectId] = subjectLabel;
      }
      if (!ids.has(objectId)) {
        ids.add(objectId);
        nodes.push({ id: objectId, label: objectLabel });
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

function formatNetworkGraphData(results) {
  return results.map((result) => {
    let data = {
      propertyId: extractIdFromLink('prop', result),
      propertyLabel: result['propLabel']['value']
    };
    if (result['itemF']) {
      data['subjectId'] = extractIdFromLink('selectedItem', result);
      data['subjectLabel'] = result['selectedItemLabel']['value'];
      data['objectId'] = extractIdFromLink('itemF', result);
      data['objectLabel'] = result['itemFLabel']['value'];
    } else {
      data['subjectId'] = extractIdFromLink('itemR', result);
      data['subjectLabel'] = result['itemRLabel']['value'];
      data['objectId'] = extractIdFromLink('selectedItem', result);
      data['objectLabel'] = result['selectedItemLabel']['value'];
    }

    return data;
  });
}

export async function getNetworkGraphData(ids, properties, iterations, ignoreItemsIds) {
  let data;
  while (iterations > 0) {
    let results = await fetchNetworkGraphData(ids, properties);
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

export async function getNetworkGraphDataForOneNode(id, properties) {
  let results = await fetchNetworkGraphData([id], properties);
  let data = formatNetworkGraphDataForVisJs(results['data']);
  data['query'] = results['query'];

  return data;
}

export async function fetchWikidataItem(id) {
  console.log('fetchWikidataItem', id);
  const url = CA_API + '/wikidata_item/' + id;
  let response = await fetch(url);
  if (response.ok) {
    return await response.json();
  } else {
    console.log('Could not fetch item from wikidata.');
  }
}

export async function copyWikidataItem(qid, ca_id, table, type) {
  const url = CA_API + '/copy_wikidata_item';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      qid: qid,
      ca_id: ca_id,
      table,
      type
    })
  });
  if (response.ok) {
    return await response.json();
  } else {
    console.log('Could not copy wikidata item.');
  }
}

export function formatWikidataItem(
  caRecord,
  caTable,
  wikiCaMapping,
  wikiIdTypeMapping,
  wikiIdLabelMapping
) {
  let caWikiMapping = swapObjectKeysValues(wikiCaMapping);

  let data = {
    labels: { en: '' },
    aliases: { en: '' },
    descriptions: { en: '' },
    statements: {},
    identifiers: {}
  };

  Object.keys(caRecord)
    .filter((k) => k.startsWith(caTable) && caWikiMapping[k] != undefined)
    .forEach((key) => {
      // if key is labels
      let dataType = wikiIdTypeMapping[caWikiMapping[key]];
      if (key == wikiCaMapping['labels']) {
        if (caTable === 'ca_entities') {
          data['labels'] = { en: caRecord[key]['values'][0]['displayname'] };
        } else {
          data['labels'] = { en: caRecord[key]['values'][0]['name'] };
        }
        // if key is aliases
      } else if (key == wikiCaMapping['aliases']) {
        data['aliases'] = { en: caRecord[key]['values'].map((v) => v['displayname']) };
        // if key is descriptions
      } else if (key == wikiCaMapping['descriptions']) {
        data['descriptions'] = { en: caRecord[key]['values'][0] };
        // if data type of key is external-id
      } else if (dataType === 'external-id') {
        let propertyId = caWikiMapping[key];
        data['identifiers'][propertyId] = [
          {
            data_type: 'external-id',
            data_value: { value: { label: caRecord[key]['values'][0] } },
            property: propertyId,
            property_label: wikiIdLabelMapping[propertyId]
          }
        ];
        // if data type of key is time
      } else if (dataType === 'time') {
        let propertyId = caWikiMapping[key];
        data['statements'][propertyId] = [
          {
            data_type: 'time',
            data_value: { value: caRecord[key]['values'][0] },
            property: propertyId,
            property_label: wikiIdLabelMapping[propertyId]
          }
        ];
        // if data type of key is wiki-item
      } else if (dataType === 'wikibase-item') {
        let propertyId = caWikiMapping[key];
        if (data['statements'][propertyId] == undefined) {
          data['statements'][propertyId] = [];
        }
        caRecord[key]['values'].forEach((value) => {
          data['statements'][propertyId].push({
            data_type: 'wikibase-item',
            data_value: { value: { id: null, label: value } },
            property: propertyId,
            property_label: wikiIdLabelMapping[propertyId],
            search_label: null
          });
        });
      } else if (dataType != undefined) {
        throw new Error('formatWikidataItem not implemted for ' + key);
      }
    });

  return data;
}

export function formatCreateWikidataItem(wikiRecord) {
  let record = {
    labels: wikiRecord['labels'],
    statements: []
  };

  if (wikiRecord['descriptions']['en'] != '') {
    record['descriptions'] = wikiRecord['descriptions'];
  }
  if (wikiRecord['aliases']['en'] != '') {
    record['aliases'] = wikiRecord['aliases'];
  }

  for (let [propertyId, values] of Object.entries(wikiRecord.statements)) {
    values.forEach((value) => {
      if (value['data_type'] == 'wikibase-item') {
        if (value['id']) {
          record['statements'].push({
            data_type: 'wikibase-item',
            data_value: {
              value: {
                id: value['id'],
                label: value['label']
              }
            },
            property: propertyId
          });
        }
      }
    });
  }

  return record;
}

export async function createWikiItem(
  id,
  caTable,
  caType,
  wikiRecord,
  wikiInstance = 'local_wikibase'
) {
  const url = CA_API + '/create_wiki_item';

  let payload = {
    data: wikiRecord,
    wiki_instance: wikiInstance,
    ca_id: id,
    table: caTable,
    type: caType
  };
  console.log(JSON.stringify(payload, null, 2));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (response.ok) {
    return await response.json();
  } else {
    let json = await response.json();
    debugger;
    return {
      errors: []
    };
  }
}

let allowedProps = {
  choreographer: 'P1809',
  composer: 'P86',
  'costume designer': 'P2515',
  // country: 'P17',
  // 'educated at': 'P69',
  // employer: 'P108',
  'lighting designer': 'P5026',
  'location of first performance': 'P4647',
  'musical conductor': 'P3300',
  'notable works': 'P800',
  // 'part of': 'P361',
  'production company': 'P272',
  'production designer': 'P2554',
  'recorded at studio or venue': 'P483',
  scenographer: 'P4608',
  'student of': 'P1066',
  student: 'P802',
  'cast member': 'P161',
  performer: 'P175'
};

const allowedProps2 = swapObjectKeysValues(allowedProps);

export let peopleMenu = [
  { label: 'award received', id: 'P166', checked: true },
  { label: 'nominated for', id: 'P1411', checked: true },
  { label: 'notable works', id: 'P800', checked: true },
  { label: 'student of', id: 'P1066', checked: true },
  { label: 'student', id: 'P802', checked: true }
];
export let venueMenu = [{}];
export let worksMenu = [
  { label: 'cast member', id: 'P161', checked: true },
  { label: 'choreographer', id: 'P1809', checked: true },
  { label: 'composer', id: 'P86', checked: true },
  { label: 'costume designer', id: 'P2515', checked: true },
  { label: 'librettist', id: 'P87', checked: true },
  { label: 'lighting designer', id: 'P5026', checked: true },
  { label: 'location of first performance', id: 'P4647', checked: true },
  { label: 'musical conductor', id: 'P3300', checked: true },
  { label: 'performer', id: 'P175', checked: true },
  { label: 'production company', id: 'P272', checked: true },
  { label: 'production designer', id: 'P2554', checked: true },
  { label: 'recorded at studio or venue', id: 'P483', checked: true },
  { label: 'scenographer', id: 'P4608', checked: true }
];
export let otherMenu = [{ label: 'founded by', id: 'P112', checked: true }];

export let allMenuOptions = {
  people: peopleMenu,
  works: worksMenu,
  other: otherMenu
};

export function formatWikiCollectiveAccessMapping(rawMapping, caTable) {
  // takes data from csv and create object with
  // {wikidata_property_id: collective_access_code}

  let mapping = {};
  rawMapping.forEach((row) => {
    if (row['ca_table'] === caTable) {
      if (row['wikidata_property']) {
        mapping[row['wikidata_property']] = row['ca_code'];
      } else if (row['wikidata_misc'] != undefined) {
        mapping[row['wikidata_misc']] = row['ca_code'];
      }
    }
  });

  return mapping;
}

export function formatWikiIdTypeMapping(rawMapping, caTable) {
  // takes data from csv and create object with
  // {wikidata_property_id: wikidata_data_type}

  let mapping = {};
  rawMapping.forEach((row) => {
    if (row['ca_table'] === caTable && row['wikidata_data_type']) {
      mapping[row['wikidata_property']] = row['wikidata_data_type'];
    }
  });

  return mapping;
}

export function formatwikiIdLabelMapping(rawMapping, caTable) {
  // takes data from csv and create object with
  // {wikidata_property_id: wikidata_property_label}

  let mapping = {};
  rawMapping.forEach((row) => {
    if (row['ca_table'] === caTable && row['wikidata_property_label']) {
      mapping[row['wikidata_property']] = row['wikidata_property_label'];
    }
  });

  return mapping;
}

export async function formatWikiItemsMapping(rawMapping, caTable, caRecord) {
  let mapping = {};

  for (const row of rawMapping) {
    if (
      row['ca_table'] === caTable &&
      row['wikidata_data_type'] === 'wikibase-item' &&
      caRecord[row['ca_code']]
    ) {
      if (mapping[row['wikidata_property']] == undefined) {
        mapping[row['wikidata_property']] = {};
      }

      for (const keyword of caRecord[row['ca_code']].values) {
        const results = await fetchSearchResults(keyword);
        mapping[row['wikidata_property']][keyword] = formatSearchResults(results);
      }
    }
  }
  return mapping;
}

export function formatWikidataRecord(caRecord, rawMapping, mapping, caTable, caType) {
  let wikiIdTypeMapping = formatWikiIdTypeMapping(rawMapping, caTable);
  let wikiIdLabelMapping = formatwikiIdLabelMapping(rawMapping, caTable);
  let wikidataItem = formatWikidataItem(
    caRecord,
    caTable,
    mapping,
    wikiIdTypeMapping,
    wikiIdLabelMapping
  );
  return wikidataItem;
}
