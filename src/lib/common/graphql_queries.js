import { envars } from '$lib/envars';
import { autoRefreshTokens } from '$lib/common/auth';
import { formatClaimValue } from '$lib/common/claim_value.js';

export async function getEntitiesWithoutWikidataId() {
  let query = `query {
    find(
      table: "ca_entities",
      criteria: [
        {
          name:"ca_entities.authority_wikipedia",
          operator: EQ,
          value: null
        },
      ],
      bundles: [
          "ca_entities.preferred_labels.displayname"
      ],
      start: 0,
      limit: 100
    )
    ${findReturn}
  }`;

  let results = await searchConnect(query);
  return formatSearchResults(results);
}

export async function getEntities(type = 'individual') {
  let query = `query {
    find(
      table: "ca_entities",
      restrictToTypes: "${type}",
      criteria: [],
      bundles: [
          "ca_entities.preferred_labels.displayname",
          "ca_entities.authority_wikipedia",
          "ca_entities.authority_wiki_data"
      ],
      start: 0,
      limit: 100
    )
    ${findReturn}
  }`;

  let results = await searchConnect(query);
  return formatSearchResults(results);
}

export async function getArtisticWorks() {
  let query = `query {
    find(
      table: "ca_occurrences",
      restrictToTypes: "choreographic_work",
      criteria: [],
      bundles: [
          "ca_occurrences.preferred_labels",
          "ca_occurrences.authority_wikipedia",
          "ca_occurrences.authority_wiki_data"
      ],
      start: 0,
      limit: 100
    )
    ${findReturn}
  }`;

  let results = await searchConnect(query);
  return formatSearchResults(results);
}

export async function getArtisticWorksByWikibaseId(qid) {
  let query = `query {
    find(
      table: "ca_occurrences",
      restrictToTypes: "choreographic_work",
      criteria: [

      ],
      bundles: [
          "ca_occurrences.preferred_labels",
          "ca_occurrences.authority_wikipedia",
          "ca_occurrences.authority_wiki_data"
      ],
      start: 0,
      limit: 100
    )
    ${findReturn}
  }`;

  let results = await searchConnect(query);
  return formatSearchResults(results);
}

export async function getEntity(id, codes) {
  let query = getItemQuery('ca_entities', id, codes);
  let result = await itemConnect(query);
  return formatItemResult(result.get);
}

export async function getArtisticWork(id, codes) {
  let query = getItemQuery('ca_occurrences', id, codes);
  let result = await itemConnect(query);
  return formatItemResult(result.get);
}

function getItemQuery(table, id, codes) {
  return `
    query {
      get(
        table: "${table}",
        identifier: "${id}",
        bundles: [
          ${codes.map((c) => `"${c}"`).join(',\n')}
        ]
      )
      ${getReturn}
    }`;
}

export async function editEntityInd(idno, bundles) {
  const query = editRecordQuery('ca_entities', 'individual', idno, bundles);

  return await editConnect(query);
}

export async function editEntityOrg(idno, bundles) {
  const query = editRecordQuery('ca_entities', 'organization', idno, bundles);

  return await editConnect(query);
}

export async function editArtistWork(idno, bundles) {
  const query = editRecordQuery('ca_occurrences', 'choreographic_work', idno, bundles);

  return await editConnect(query);
}

function editRecordQuery(table, type, idno, bundles) {
  return `
  mutation {
    edit(
      table: "${table}",
      records: [
        {
          idno: "${idno}",
          type: "${type}",
          bundles: [
            ${bundles}
          ]
        },
      ]
    )
    ${editReturn}
  }`;
}

function formatSearchResults(results) {
  let records = [];

  results.forEach((result) => {
    let data = {};
    data['id'] = result.id;
    data['idno'] = result.idno.replace('idno', '');
    result.bundles.forEach((bundle) => {
      data[bundle.name] = bundle.values[0].value;
      data[bundle.code] = bundle.values[0].value;
    });
    records.push(data);
  });
  return records;
}

export let labelFields = [
  'prefix',
  'forename',
  'middlename',
  'surname',
  'suffix',
  'other_forenames',
  'displayname'
];

export let labelElements = labelFields.map((field) => {
  return {
    name: field,
    code: field,
    dataType: 'TEXT'
  };
});

function formatItemResult(result) {
  let record = {};
  record['id'] = result['id'];
  record['idno'] = result['idno'].replace('idno', '');

  result.bundles.forEach((bundle) => {
    let data = { code: bundle['code'], name: bundle.name, dataType: bundle.dataType };
    // Text: set values to a scalar array
    if (bundle.dataType == 'Text') {
      data['values'] = [];
      bundle.values.forEach((value) => {
        data['values'].push(value.value);
      });
      // List: set values to a scalar array
    } else if (bundle.dataType == 'List') {
      data['values'] = [];
      bundle.values.forEach((value) => {
        data['values'].push(value.value);
      });
      // Container: set values to array of objects
    } else if (bundle.dataType == 'Container') {
      // if container has label_id, create one object for each record
      if (bundle.values[0].subvalues[0]['code'] == 'label_id') {
        data['values'] = [];
        let tmp;
        bundle.values[0].subvalues.forEach((value) => {
          if (value['value'] != undefined && value['value'] != '') {
            // set tmp to new object when code is label_id, e.g. start of new
            // new record
            if (value['code'] == 'label_id') {
              if (tmp) {
                data['values'].push(tmp);
              }
              tmp = {};
            }
            tmp[value['code']] = value['value'];
          }

          // set record displayname
          if (bundle.code.includes('.preferred_labels')) {
            if (value['code'] === 'displayname') {
              record['displayname'] = value['value'];
            } else if (value['code'] === 'name') {
              record['displayname'] = value['value'];
            }
          }
        });
        data['values'].push(tmp);
        // else container has one record
      } else {
        data['values'] = [];
        let tmp = {};
        bundle.values[0].subvalues.forEach((value) => {
          if (value['value'] != undefined && value['value'] != '') {
            tmp[value['code']] = value['value'];
          }
        });
        data['values'].push(tmp);
      }
    } else if (bundle.dataType === 'LCSH') {
      data['values'] = [];
      bundle.values.forEach((value) => {
        data['values'].push(value.value);
      });
    } else if (bundle.dataType === 'DateRange') {
      data['values'] = [];
      bundle.values.forEach((value) => {
        data['values'].push(value.value);
      });
    } else if (bundle.dataType === 'TimeCode') {
      data['values'] = [];
      bundle.values.forEach((value) => {
        data['values'].push(value.value);
      });
    } else if (bundle.dataType === 'InformationService') {
      data['values'] = [];
      bundle.values.forEach((value) => {
        if (bundle.name == 'Wikipedia') {
          data['values'].push(value.value);
          // if there are subvalues
        } else if (value.subvalues) {
          let hasId = false;
          value.subvalues.forEach((subvalue) => {
            // if subvalues code has *_value_id
            if (subvalue.code.endsWith('value_id')) {
              data['values'].push(subvalue.value);
              hasId = true;
            }
          });
          // if subvalues code does not have *_value_id
          if (!hasId) {
            data['values'].push(value.value);
          }
          // if no subvalues
        } else {
          data['values'].push(value.value);
        }
      });
    } else {
      throw new Error('dataType not yet implemented');
    }
    record[bundle['code']] = data;
  });

  return record;
}

async function connect(query, url) {
  console.log(query);

  autoRefreshTokens();
  return await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('caJwtToken')}` },
    body: JSON.stringify({ query: query })
  });
}

async function searchConnect(query, url = envars.apiUrl) {
  let response = await connect(query, `${url}/Search`);

  if (response.ok) {
    let json = await response.json();
    return json.data.find.results;
  } else {
    throw new Error('Could not execute find.');
  }
}

async function editConnect(query, url = envars.apiUrl) {
  let response = await connect(query, `${url}/Edit`);

  if (response.ok) {
    let json = await response.json();
    return json.data.edit;
  } else {
    let json = await response.json();
    return {
      changed: json.data.edit.changed,
      errors: json.data.edit.errors,
      warnings: json.data.edit.warnings
    };
  }
}

async function itemConnect(query, url = envars.apiUrl) {
  let response = await connect(query, `${url}/Item`);

  if (response.ok) {
    let json = await response.json();
    return json.data;
  } else {
    throw new Error('Could not execute item.');
  }
}

async function schemaConnect(query, url = envars.apiUrl) {
  let response = await connect(query, `${url}/Schema`);

  if (response.ok) {
    let json = await response.json();
    return json.data;
  } else {
    throw new Error('Could not execute schema.');
  }
}

const findReturn = `
    {
      table,
      count,
      results {
        id,
        table,
        idno,
        bundles {
          name,
          code,
          values {
            value,
            locale
          }
        }
      }
    }
`;

const getReturn = `
    {
      id,
      table,
      idno,
      bundles {
        name,
        code,
        dataType,
        values {
          locale,
          value,
          subvalues {
            name,
            code,
            value,
            dataType
          }
        }
      }
    }
`;

const editReturn = `
    {
      id,
      table,
      idno,
      changed,
      errors { idno, code, message, bundle },
      warnings { idno, code, message, bundle },
      info { idno, code, message, bundle }
    }
`;

export function createCAFieldValueObject(currentItem, mapping) {
  // create an array of fields and values. [{collective_access_field: value}]

  // use array of objects because a field can have multiple values
  let data = [];

  // statements
  Object.values(currentItem.statements).forEach((claimProperty) => {
    claimProperty.forEach((claim) => {
      if (mapping[claim['property']] !== undefined) {
        data.push({ [mapping[claim['property']]]: formatClaimValue(claim), source: claim.id });
      }
    });
  });

  // identifiers
  Object.values(currentItem.identifiers).forEach((claimProperty) => {
    claimProperty.forEach((claim) => {
      if (mapping[claim['property']] !== undefined) {
        data.push({ [mapping[claim['property']]]: formatClaimValue(claim), source: claim.id });
      }
    });
  });

  // aliases
  if (mapping['aliases'] && currentItem['aliases'] && currentItem['aliases']['en']) {
    currentItem['aliases']['en'].forEach((alias) => {
      data.push({ [mapping['aliases']]: alias });
    });
  }

  // descriptions
  if (mapping['descriptions'] && currentItem['descriptions'] && currentItem['descriptions']['en']) {
    data.push({ [mapping['descriptions']]: currentItem['descriptions']['en'] });
  }

  // qid
  if (mapping['qid']) {
    data.push({ [mapping['qid']]: currentItem['id'] });
  }
  return data;
}

export function formatBundles(data, table, type = 'add') {
  // takes an array of {field: value}, and creates bundles strings
  // {name: "field", value: "value"} for graphql query

  let bundlesString = '';
  let nestedFields = {};

  let nestedKeys = data
    .map((datum) => Object.keys(datum)[0])
    .map((key) => key.replace(table + '.', ''))
    .filter((key) => key.includes('.'));

  let nestedKeysCount = {};
  nestedKeys.forEach((key) => {
    if (nestedKeysCount[key] == undefined) {
      nestedKeysCount[key] = 1;
    } else {
      nestedKeysCount[key] += 1;
    }
  });

  data.forEach((datum) => {
    let field = Object.keys(datum)[0].replace(table + '.', '');
    let value = datum[`${table}.${field}`];
    let source = datum.source;

    // handles nested fields
    if (field.includes('.')) {
      // handles nested fields when same container and different field
      if (nestedKeysCount[field] === 1) {
        let [parent, child] = field.split('.');
        if (nestedFields[parent] === undefined) {
          nestedFields[parent] = [];
        }
        nestedFields[parent].push(`${child}|${value}`);

        // handles nested fields when container and field are the same
      } else {
        let [parent, child] = field.split('.');
        if (type === 'replace') {
          bundlesString += `{name: "${parent}", replace: true, values: [\n  {name: "${child}", value: "${value}"},\n]},\n`;
        } else {
          bundlesString += `{name: "${parent}", values: [\n  {name: "${child}", value: "${value}"},\n]},\n`;
        }
      }

      // create bundle string for flat fields
    } else {
      if (type === 'replace') {
        if (source) {
          bundlesString += `{name: "${field}", value: "${value}", source: "${source}", replace: true},\n`;
        } else {
          bundlesString += `{name: "${field}", value: "${value}", replace: true},\n`;
        }
      } else {
        if (source) {
          bundlesString += `{name: "${field}", value: "${value}", source: "${source}"},\n`;
        } else {
          bundlesString += `{name: "${field}", value: "${value}"},\n`;
        }
      }
    }
  });

  // create bundle string for nested fields with same container and different fields
  for (let [parent, values] of Object.entries(nestedFields)) {
    if (type === 'replace') {
      bundlesString += `{name: "${parent}", replace: true, values: [\n`;
    } else {
      bundlesString += `{name: "${parent}", values: [\n`;
    }

    values.forEach((value) => {
      let parts = value.split('|');
      if (parts.length === 2) {
        bundlesString += `  {name: "${parts[0]}", value: "${parts[1]}"},\n`;
      } else {
        bundlesString += `  {name: "${parts[0]}", value: "${parts[1]}", source: "${parts[2]}"},\n`;
      }
    });
    bundlesString += ']},\n';
  }

  return bundlesString;
}

export async function getPageFields(table, type) {
  // get all the fields for a particular table and type

  let query = `
  query {`;

  if (type) {
    query += `
    bundles(table: "${table}", type: "${type}") {`;
  } else {
    query += `
    bundles(table: "${table}") {`;
  }

  query += `
      bundles {
        name,
        code,
        description,
        type,
        dataType,
        list,
        typeRestrictions {
          name,
          type,
          minAttributesPerRow,
          maxAttributesPerRow
        },
        settings {
          name,
          value
        },
        subelements {
          name,
          code,
          type,
          dataType,
          list,
          settings {
            name,
            value
          }
        }
      }
    }
  }
  `;

  let results = await schemaConnect(query);
  return results.bundles.bundles;
}

export async function getList(list) {
  // returns idno, id, label for every item in a list
  let query = `
  query {
    find(
      table: "ca_list_items",
      criteria: [
        {
          name: "ca_list_items.list_id",
          operator: EQ,
          value: "${list}"
        },
      ],
      bundles: [
        "ca_list_items.preferred_labels.name_singular",
        "ca_list_items.idno",
        "ca_list_items.item_value",
        "ca_list_items.hierarchy.preferred_labels.name_singular%delimiter=➔"
      ],
    )
    ${findReturn}
  }`;

  let results = await searchConnect(query);
  return results
    .filter((result) => !result['idno'].includes('idnoRoot'))
    .map((result) => {
      let data = {
        idno: result['idno'].replace('idno', ''),
        id: result['id']
      };

      result['bundles'].forEach((bundle) => {
        if (bundle['name'] == 'Item name (singular)') {
          data['label'] = bundle['values'][0]['value'];
        }
      });

      return data;
    });
}

export async function getEntityArtisticWorkRelationships(idno) {
  let query = formatGetRelationshipsQuery(
    idno,
    'ca_entities',
    'ca_occurrences',
    'choreographic_work',
    null,
    [
      'ca_entities.preferred_labels.displayname',
      'ca_occurrences.preferred_labels',
      'ca_relationship_types.preferred_labels.typename',
      'ca_entities.authority_wiki_data',
      'ca_occurrences.authority_wiki_data',
      'ca_entities.authority_wikipedia',
      'ca_occurrences.authority_wikipedia'
    ]
  );

  let json = await itemConnect(query);
  let results = json['getRelationships'];

  return formatRelationshipResults(results);
}

export async function getArtisticWorkEntityRelationships(idno, url = envars.apiUrl) {
  let query = formatGetRelationshipsQuery(
    idno,
    'ca_occurrences',
    'ca_entities',
    'choreographic_work',
    null,
    [
      'ca_entities.preferred_labels.displayname',
      'ca_occurrences.preferred_labels',
      'ca_relationship_types.preferred_labels.typename',
      'ca_entities.authority_wiki_data',
      'ca_occurrences.authority_wiki_data',
      'ca_entities.authority_wikipedia',
      'ca_occurrences.authority_wikipedia'
    ]
  );

  let json = await itemConnect(query, url);
  let results = json['getRelationships'];

  return formatRelationshipResults(results);
}

function formatRelationshipResults(results) {
  let data = [];
  results['relationships'].forEach((relationship) => {
    let relationshipData = {};
    relationship.bundles.forEach((bundle) => {
      if (bundle.code.endsWith('.preferred_labels')) {
        relationshipData['target_label'] = bundle['values'][0]['value'];
        relationshipData['target_id'] = bundle['values'][0]['id'];
      } else if (bundle.code === 'ca_relationship_types.preferred_labels.typename') {
        relationshipData['relationship_type'] = bundle['values'][0]['value'];
      } else if (bundle.code === 'ca_occurrences.authority_wiki_data') {
        relationshipData['target_wikibase_id'] = bundle['values'][0]['value'];
      } else if (bundle.code === 'ca_entities.authority_wiki_data') {
        relationshipData['subject_wikibase_id'] = bundle['values'][0]['value'];
      } else if (bundle.code === 'ca_entities.preferred_labels.displayname') {
        relationshipData['subject_label'] = bundle['values'][0]['value'];
      }

      relationshipData['subject_id'] = results['id'];
    });
    data.push(relationshipData);
  });

  return data;
}

function formatGetRelationshipsQuery(idno, table, targetTable, type, relationshipTypes, bundles) {
  let query = `
  query {
    getRelationships(
      table: "${table}",
      identifier: "${idno}",
      target:"${targetTable}",
      bundles: [${bundles.map((c) => `"${c}"`).join(',\n')}],`;

  if (type) {
    query += `
    restrictToTypes: "${type}"`;
  }

  if (relationshipTypes) {
    query += `
    restrictToRelationshipTypes: [${relationshipTypes.map((r) => `"${r}"`).join(', ')}]`;
  }

  query += `
    )
    {
      id,
      table,
      idno,
      relationships {
        id,
        table,
        bundles {
          name,
          code,
          values {
            id,
            value
          }
        }
      }
    }
  }
  `;
  return query;
}

export async function fetchRecordsForTableType(caTable, caType) {
  let records = [];
  let caTableType = `${caTable}.${caType}`;

  if (caTableType === 'ca_entities.individual') {
    records = await getEntities(caType);
  } else if (caTableType === 'ca_entities.organization') {
    records = await getEntities(caType);
  } else if (caTableType === 'ca_occurrences.choreographic_work') {
    records = await getArtisticWorks();
  } else {
    throw new Error(`${caTable} ${caType} is not implemented`);
  }

  return records;
}
