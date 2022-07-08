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
