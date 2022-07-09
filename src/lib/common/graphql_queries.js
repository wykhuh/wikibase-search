import { envars } from '$lib/envars';
import { autoRefreshTokens } from '$lib/common/auth';

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

export async function getEntity(id) {
  let query = `
  query {
    get(
      table: "ca_entities",
      identifier: "${id}",
      bundles: ["preferred_labels" ]
    )
    ${getReturn}
  }
  `;

  let result = await itemConnect(query);
  return formatItemResult(result);
}

export async function editEntity(idno, type, bundles) {
  const query = `
  mutation {
    edit(
      table: "ca_entities",
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

  console.log(query);

  return await editConnect(query);
}

function formatSearchResults(results) {
  let records = [];
  results.forEach((result) => {
    result.bundles.forEach((bundle) => {
      let data = {};
      data[bundle.name] = bundle.values[0].value;
      data['id'] = result.id;
      data['idno'] = result.idno.replace('idno', '');
      records.push(data);
    });
  });

  return records;
}

function formatItemResult(result) {
  let record = {};

  record['id'] = result['id'];
  record['idno'] = result['idno'].replace('idno', '');
  result.bundles.forEach((bundle) => {
    bundle.values.forEach((value) => {
      record[bundle.code] = value.value;
    });
  });

  return record;
}

async function searchConnect(query) {
  autoRefreshTokens();
  let url = `${envars.apiUrl}/Search`;
  let response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('caJwtToken')}` },
    body: JSON.stringify({ query: query })
  });

  if (response.ok) {
    let json = await response.json();
    return json.data.find.results;
  } else {
    throw new Error('Could not execute find.');
  }
}

async function editConnect(query) {
  autoRefreshTokens();
  let url = `${envars.apiUrl}/Edit`;
  let response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('caJwtToken')}` },
    body: JSON.stringify({ query: query })
  });

  if (response.ok) {
    let json = await response.json();
    return json.data.edit;
  } else {
    throw new Error('Could not execute edit.');
  }
}

async function itemConnect(query) {
  autoRefreshTokens();
  let url = `${envars.apiUrl}/Item`;
  let response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('caJwtToken')}` },
    body: JSON.stringify({ query: query })
  });

  if (response.ok) {
    let json = await response.json();
    return json.data.get;
  } else {
    throw new Error('Could not execute item.');
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

export function formatBundles(data, type = 'add') {
  // takes an array of {field: value}, and creates bundles strings
  // {name: "field", value: "value"} for graphql query

  let bundlesString = '';
  let nestedFields = {};

  data.forEach((datum) => {
    let field = Object.keys(datum)[0];
    let value = datum[field];

    // handles nested fields
    if (field.includes('.')) {
      let [parent, child] = field.split('.');
      if (nestedFields[parent] === undefined) {
        nestedFields[parent] = [];
      }
      nestedFields[parent].push(`${child}|${value}`);

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

      bundlesString += `  {name: "${fieldName}", value: "${fieldValue}"}, \n`;
    });
    bundlesString += ']},\n';
  }

  return bundlesString;
}
