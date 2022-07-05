const QUERY_API = 'https://query.wikidata.org/sparql';
const WD_API = 'https://www.wikidata.org/w/api.php?';
const CA_API = 'http://localhost:8000';

export async function getWorksChoreographedBy(subjectIds) {
  let query = (subjectId) => targetPropertyItemQuery(subjectId, allowedProps['choreographer']);
  return await multipleQueryWrapper(subjectIds, query);
}

export async function getChoreographer(subjectIds) {
  let query = (subjectId) => itemPropertyTargetQuery(subjectId, allowedProps['choreographer']);
  return await multipleQueryWrapper(subjectIds, query);
}

export async function getNotableWorksBy(subjectIds) {
  let query = (subjectId) => itemPropertyTargetQuery(subjectId, allowedProps['notable works']);
  return await multipleQueryWrapper(subjectIds, query);
}

export async function getCountry(subjectIds) {
  let query = (subjectId) => itemPropertyTargetQuery(subjectId, allowedProps['country']);
  return await multipleQueryWrapper(subjectIds, query);
}

export async function getTeacherOf(subjectIds) {
  let query = (subjectId) =>
    twoWayQuery(subjectId, allowedProps['teacher of'], allowedProps['student of']);
  return await multipleQueryWrapper(subjectIds, query);
}

export async function getStudentOf(subjectIds) {
  let query = (subjectId) =>
    twoWayQuery(subjectId, allowedProps['student of'], allowedProps['teacher of']);
  return await multipleQueryWrapper(subjectIds, query);
}

export async function getLocationOfFirstPerformance(subjectIds) {
  let query = (subjectId) =>
    itemPropertyTargetQuery(subjectId, allowedProps['location of first performance']);
  return await multipleQueryWrapper(subjectIds, query);
}

export async function itemIsInstanceOf(subjectId) {
  let query = itemPropertyTargetQuery(subjectId, 'P31');
  let results = await executeQuery(query);
  let labels = results.map((res) => res['itemLabel']['value']);
  return labels;
}

async function multipleQueryWrapper(subjectIds, query) {
  let allData = {};

  for (const subjectId of subjectIds) {
    let results = await executeQuery(query(subjectId));
    let data = formatRelationsResults(results, subjectId);

    allData = Object.assign(allData, data);
  }
  return allData;
}

function twoWayQuery(subjectId, subjectProperty, targetProperty) {
  let query = `
    SELECT ?item ?itemLabel ?itemDescription WHERE {
      {wd:${subjectId} wdt:${subjectProperty} ?item.}
      UNION
      {?item wdt:${targetProperty} wd:${subjectId}.}
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
  console.log(query);
  return query;
}

function itemPropertyTargetQuery(subjectId, propertyId) {
  let query = `
    SELECT ?item ?itemLabel ?itemDescription WHERE {
      wd:${subjectId} wdt:${propertyId} ?item.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
  console.log(query);
  return query;
}

function targetPropertyItemQuery(subjectId, propertyId) {
  let query = `
    SELECT ?item ?itemLabel ?itemDescription WHERE {
      ?item wdt:${propertyId} wd:${subjectId}.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
  console.log(query);
  return query;
}

function formatQuery(statments) {
  let query = `SELECT ?item ?itemLabel ?itemDescription WHERE {`;

  query += statments;

  query += `
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;
  console.log(query);
  return query;
}

async function executeQuery(query) {
  const fullUrl = QUERY_API + '?query=' + encodeURIComponent(query);
  const headers = { Accept: 'application/sparql-results+json' };
  let response = await fetch(fullUrl, { headers });
  let json = await response.json();
  return json['results']['bindings'];
}

function extractIdFromLink(attr, result) {
  return result[attr]['value'].split('/')[4];
}

function formatRelationsResults(results, subjectId) {
  let data = {};
  let ids = new Set();

  results.forEach((result) => {
    let id = extractIdFromLink('item', result);
    if (!ids.has(id)) {
      if (!data[subjectId]) {
        data[subjectId] = {};
      }
      let label = result['itemLabel'] ? result['itemLabel']['value'] : '';
      let desc = result['itemDescription'] ? result['itemDescription']['value'] : '';
      data[subjectId][id] = {
        id: id,
        label: label,
        description: desc,
        subjectId: subjectId
      };
      ids.add(id);
    }
  });
  return data;
}

export async function getMenuOptionsCa(itemIds) {
  // Get all the properties for a list of item ids. This endpoint returns
  // properites were the item is the subject. The endpoint does not return
  // properties  where the item is the predicate.
  const url = CA_API + '/get_menu_options?ids=' + itemIds.join('|');
  const response = await fetch(url);
  // the response is in {id: label} format
  return await response.json();
}

async function fetchAllPropsForIds(ids) {
  let idStr = ids.mpa((id) => `(wd:${id})`);
  let query = `
  SELECT DISTINCT ?item ?itemLabel {
      VALUES (?record) ${{ idStr }}
      ?record ?p ?statement .
      ?item wikibase:claim ?p .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  `;
  return await executeQuery(query);
}

function formatMenuOptions(results) {
  let data = {};
  for (let result in results) {
    let qid = result['item']['value'].split('/')[-1];
    let value = result['itemLabel']['value'];
    if (qid in allowedProps2) {
      data[qid] = value;
    }
  }

  return data;
}

export async function getMenuOptions(ids) {
  let results = await fetchAllPropsForIds(ids);
  return formatMenuOptions(results);
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
    if (result['description']) {
      search_label += ` (${result['description']})`;
    }

    tmp.push({
      id: result['id'],
      label: label,
      search_label: search_label
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
  let data = await executeQuery(query);
  return { data, query };
}

export function formatNetworkGraphDataForVisJs(results) {
  let ids = new Set();
  let nodes = [];
  let edges = [];

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
    }
    if (!ids.has(object_id)) {
      ids.add(object_id);
      nodes.push({ id: object_id, label: object_label });
    }

    // create edges
    let sub_obj_id = `${subject_id} ${property_id} ${object_id}`;
    if (!ids.has(sub_obj_id)) {
      ids.add(sub_obj_id);
      edges.push({
        from: subject_id,
        to: object_id,
        property_id: property_id,
        label: property_label
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

let allowedProps = {
  choreographer: 'P1809',
  composer: 'P86',
  'costume designer': 'P2515',
  // country: 'P17',
  'lighting designer': 'P5026',
  'location of first performance': 'P4647',
  'musical conductor': 'P3300',
  'notable works': 'P800',
  'production designer': 'P2554',
  scenographer: 'P4608',
  'student of': 'P1066',
  student: 'P802'
};

const allowedProps2 = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

export let peopleMenu = [
  { label: 'notable works', id: 'P800' },
  { label: 'student of', id: 'P1066' },
  { label: 'student', id: 'P802' }
];
export let venueMenu = [];
export let worksMenu = [
  { label: 'choreographer', id: 'P1809' },
  { label: 'composer', id: 'P86' },
  { label: 'costume designer', id: 'P2515' },
  { label: 'lighting designer', id: 'P5026' },
  { label: 'location of first performance', id: 'P4647' },
  { label: 'musical conductor', id: 'P3300' },
  { label: 'production designer', id: 'P2554' },
  { label: 'scenographer', id: 'P4608' }
];

export let allMenuOptions = {
  people: peopleMenu,
  works: worksMenu
};
