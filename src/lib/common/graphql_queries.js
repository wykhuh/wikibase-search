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
    ${editReturn}
  }
  `;

  let result = await itemConnect(query);
  return formatItemResult(result);
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

const editReturn = `
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
