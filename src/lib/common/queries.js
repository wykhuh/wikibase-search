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

function extractIdFromLink(result) {
  return result['item']['value'].split('/')[4];
}

function formatRelationsResults(results, subjectId) {
  let data = {};
  let ids = new Set();

  results.forEach((result) => {
    let id = extractIdFromLink(result);
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

let allowedProps = {
  choreographer: 'P1809',
  composer: 'P86',
  'costume designer': 'P2515',
  country: 'P17',
  employer: 'P108',
  'lighting designer': 'P5026',
  'location of first performance': 'P4647',
  'musical conductor': 'P3300',
  'notable works': 'P800',
  'production designer': 'P2554',
  scenographer: 'P4608',
  'student of': 'P1066',
  student: 'P802' // teacher of
};

const allowedProps2 = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

export let peopleMenu = ['choreographer for', 'notable works', 'student of', 'teacher of'];
export let venueMenu = ['country'];
export let worksMenu = ['choreographed by', 'location of first performance'];

export let allMenuOptions = {
  people: peopleMenu,
  works: worksMenu,
  venue: venueMenu
};
