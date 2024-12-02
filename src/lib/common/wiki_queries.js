const WD_QUERY_API = 'https://query.wikidata.org/sparql';
const DDC_QUERY_API = 'https://dancing-digital.wikibase.cloud/query/sparql';

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

export function formatSPARQLQuery(ids, properties, wikisource) {
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
    PREFIX wdt: <https://dancing-digital.wikibase.cloud/prop/direct/>`;
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

  return query;
}

export async function fetchNetworkGraphData(ids, properties, wikisource) {
  let query = formatSPARQLQuery(ids, properties, wikisource);
  let data = await executePostQuery(query, wikisource);
  return { data, query };
}

export function formatNetworkGraphData(results, maxEdges = 200) {
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
        let data = { id: subjectId, label: subjectLabel };
        nodes.push(data);
        nodesObject[subjectId] = subjectLabel;
      }
      if (!ids.has(objectId)) {
        ids.add(objectId);
        let data = { id: objectId, label: objectLabel };
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
    data = formatNetworkGraphData(results['data']);
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
  let data = formatNetworkGraphData(results['data']);
  data['query'] = results['query'];

  return data;
}
