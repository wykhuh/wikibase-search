const endpointUrl = 'https://query.wikidata.org/sparql';

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
  const fullUrl = endpointUrl + '?query=' + encodeURIComponent(query);
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

export let peopleMenu = ['choreographer for', 'notable works', 'student of', 'teacher of'];
export let venueMenu = ['country'];
export let worksMenu = ['choreographed by', 'location of first performance'];
