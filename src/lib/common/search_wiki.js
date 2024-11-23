import { envars } from '$lib/envars';

const WD_API = 'https://www.wikidata.org/w/api.php?';
const WB_API = `${envars.wbUrl}/w/api.php?`;

async function fetchSearchResults(keyword, targetWiki, language = 'en') {
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
  let api = targetWiki === 'wikidata' ? WD_API : WB_API;
  const url = api + new URLSearchParams(params);

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

export async function searchKeyword(keyword, targetWiki = 'wikidata', language = 'en') {
  let results = await fetchSearchResults(keyword, targetWiki, language);
  return formatSearchResults(results);
}
