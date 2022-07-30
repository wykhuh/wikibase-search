import { envars } from '$lib/envars';
import { swapObjectKeysValues } from '$lib/common/utils';

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
  console.log(query);
  let data = await executePostQuery(query);
  return { data, query };
}

export function formatNetworkGraphDataForVisJs(results) {
  let ids = new Set();
  let nodes = [];
  let edges = [];
  let nodesObject = {};

  results.forEach((result) => {
    let subject_id;
    let subject_label;
    let object_id;
    let object_label;
    let property_id = extractIdFromLink('prop', result);
    let property_label = result['propLabel']['value'];

    if (result['itemF']) {
      subject_id = extractIdFromLink('selectedItem', result);
      subject_label = result['selectedItemLabel']['value'];
      object_id = extractIdFromLink('itemF', result);
      object_label = result['itemFLabel']['value'];
    } else {
      subject_id = extractIdFromLink('itemR', result);
      subject_label = result['itemRLabel']['value'];
      object_id = extractIdFromLink('selectedItem', result);
      object_label = result['selectedItemLabel']['value'];
    }

    // create nodes
    if (!ids.has(subject_id)) {
      ids.add(subject_id);
      nodes.push({ id: subject_id, label: subject_label });
      nodesObject[subject_id] = subject_label;
    }
    if (!ids.has(object_id)) {
      ids.add(object_id);
      nodes.push({ id: object_id, label: object_label });
      nodesObject[object_id] = object_label;
    }

    // create edges
    let sub_obj_id = `${subject_id} ${property_id} ${object_id}`;
    if (!ids.has(sub_obj_id)) {
      ids.add(sub_obj_id);
      edges.push({
        from: subject_id,
        to: object_id,
        property_id: property_id,
        label: property_label,
        fromLabel: nodesObject[subject_id],
        toLabel: nodesObject[object_id]
      });
    }
  });

  return { nodes, edges };
}

function formatNetworkGraphData(results) {
  return results.map((result) => {
    let data = {
      property_id: extractIdFromLink('prop', result),
      property_label: result['propLabel']['value']
    };
    if (result['itemF']) {
      data['subject_id'] = extractIdFromLink('selectedItem', result);
      data['subject_label'] = result['selectedItemLabel']['value'];
      data['object_id'] = extractIdFromLink('itemF', result);
      data['object_label'] = result['itemFLabel']['value'];
    } else {
      data['subject_id'] = extractIdFromLink('itemR', result);
      data['subject_label'] = result['itemRLabel']['value'];
      data['object_id'] = extractIdFromLink('selectedItem', result);
      data['object_label'] = result['selectedItemLabel']['value'];
    }

    return data;
  });
}

export async function getNetworkGraphData(ids, properties, iterations) {
  let data;
  while (iterations > 0) {
    let results = await fetchNetworkGraphData(ids, properties);
    data = formatNetworkGraphDataForVisJs(results['data']);
    data['query'] = results['query'];
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

export let allMenuOptions = {
  people: peopleMenu,
  works: worksMenu
};

export function formatWikidataCollectiveAccessMapping(rawMapping, caTable) {
  // takes data from csv and create object with
  // {wikidata_property_id: collective_access_field}

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
