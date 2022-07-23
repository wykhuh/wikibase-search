import { envars } from '$lib/envars';
import { autoRefreshTokens } from '$lib/common/auth';
import { formatClaimValue } from '$lib/common/claim_value.js';

export async function getEntitiesWithoutWikidataId() {
  let query = `query {
    find(
      table: "ca_entities",
      criteria: [
        {
          name:"ca_entities.entity_authority_id.entity_authority_wiki",
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
          "ca_entities.entity_authority_id.entity_authority_wiki",
          "ca_entities.internal_notes"
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
          "ca_occurrences.credit",
          "ca_occurrences.internal_notes"
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
  return formatItemResult(result);
}

export async function getArtisticWork(id, codes) {
  let query = getItemQuery('ca_occurrences', id, codes);
  let result = await itemConnect(query);
  return formatItemResult(result);
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

export async function editEntity(idno, bundles) {
  const query = editRecordQuery('ca_entities', 'individual', idno, bundles)

  return await editConnect(query);
}

export async function editArtistWork(idno, bundles) {
  const query = editRecordQuery('ca_occurrences', 'choreographic_work', idno, bundles)

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
            if(value['code'] === 'displayname') {
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

async function searchConnect(query) {
  let response = await connect(query, `${envars.apiUrl}/Search`);

  if (response.ok) {
    let json = await response.json();
    return json.data.find.results;
  } else {
    throw new Error('Could not execute find.');
  }
}

async function editConnect(query) {
  let response = await connect(query, `${envars.apiUrl}/Edit`);

  if (response.ok) {
    let json = await response.json();
    return json.data.edit;
  } else {
    throw new Error('Could not execute edit.');
  }
}

async function itemConnect(query) {
  let response = await connect(query, `${envars.apiUrl}/Item`);

  if (response.ok) {
    let json = await response.json();
    return json.data.get;
  } else {
    throw new Error('Could not execute item.');
  }
}

async function schemaConnect(query) {
  let response = await connect(query, `${envars.apiUrl}/Schema`);

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
        data.push({ [mapping[claim['property']]]: formatClaimValue(claim) });
      }
    });
  });

  // identifiers
  Object.values(currentItem.identifiers).forEach((claimProperty) => {
    claimProperty.forEach((claim) => {
      if (mapping[claim['property']] !== undefined) {
        data.push({ [mapping[claim['property']]]: formatClaimValue(claim) });
      }
    });
  });

  // aliases
  if (currentItem['aliases'] && currentItem['aliases']['en']) {
    currentItem['aliases']['en'].forEach((alias) => {
      data.push({ [mapping['aliases']]: alias });
    });
  }

  // qid
  if(mapping['qid']) {
    data.push({ [mapping['qid']]: currentItem['id'] });
  }

  return data;
}

export function formatBundles(data, type = 'add') {
  // takes an array of {field: value}, and creates bundles strings
  // {name: "field", value: "value"} for graphql query

  let bundlesString = '';
  let nestedFields = {};

  let nestedKeys = data.map((datum) => Object.keys(datum)[0]).filter((key) => key.includes('.'));
  let nestedKeysCount = {};
  nestedKeys.forEach((key) => {
    if (nestedKeysCount[key] == undefined) {
      nestedKeysCount[key] = 1;
    } else {
      nestedKeysCount[key] += 1;
    }
  });

  data.forEach((datum) => {
    let field = Object.keys(datum)[0];
    let value = datum[field];

    // handles nested fields
    if (field.includes('.')) {
      if (nestedKeysCount[field] === 1) {
        let [parent, child] = field.split('.');
        if (nestedFields[parent] === undefined) {
          nestedFields[parent] = [];
        }
        nestedFields[parent].push(`${child}|${value}`);
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
        bundlesString += `{name: "${field}", value: "${value}", replace: true},\n`;
      } else {
        bundlesString += `{name: "${field}", value: "${value}"},\n`;
      }
    }
  });

  // create bundle string for nested fields
  for (let [parent, values] of Object.entries(nestedFields)) {
    if (type === 'replace') {
      bundlesString += `{name: "${parent}", replace: true, values: [\n`;
    } else {
      bundlesString += `{name: "${parent}", values: [\n`;
    }

    values.forEach((value) => {
      let [fieldName, fieldValue] = value.split('|');

      bundlesString += `  {name: "${fieldName}", value: "${fieldValue}"},\n`;
    });
    bundlesString += ']},\n';
  }

  return bundlesString;
}

export function formatWikidataCollectiveAccessMapping(rawMapping, caTable) {
  // takes data from csv and create object with
  // {wikidata_property_id: collective_access_field}

  let mapping = {};
  rawMapping.forEach((row) => {
    if (row['ca_table'] === caTable) {
      if (row['wikidata_property']) {
        mapping[row['wikidata_property']] = row['ca_field'];
      } else if (row['wikidata_misc'] === 'qid') {
        mapping['qid'] = row['ca_field'];
      } else if (row['wikidata_misc'] === 'qid_local') {
        mapping['qid_local'] = row['ca_field'];
      } else if (row['wikidata_misc'] === 'aliases') {
        mapping['aliases'] = row['ca_field'];
      }
    }
  });

  return mapping;
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
