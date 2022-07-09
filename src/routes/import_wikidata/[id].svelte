<script context="module">
  export async function load({ params }) {
    return {
      props: {
        id: params.id
      }
    };
  }
</script>

<script>
  import { onMount } from 'svelte';

  import { getEntity, formatBundles, editEntity } from '$lib/common/graphql_queries';
  import { searchKeyword, fetchWikidataItem } from '$lib/common/wiki_queries';
  import { formatClaimValue } from '$lib/common/claim_value.js';
  import ItemBasicInfo from '$lib/components/item_basic_info.svelte';
  import Claim from '$lib/components/claim.svelte';
  import raw_mapping from '$lib/data/ca_wikidata_mapping.csv';

  export let id;
  let caRecord = {};
  let searchResults = [];
  let showMatches = false;
  let currentItem = {};
  let languageCodesDisplay = [];
  let languageDisplayLimit = 5;
  let statements = [];
  let identifiers = [];
  let showSelectedRecord = false;
  let loadingSelectedRecord = false;
  let languagesCodeAll = new Set();
  let showAllLanguages = false;
  let wikidataId = null;
  let caTable = 'ca_entities';
  let caType = 'individual';

  // ====================
  // mapping
  // ====================

  let mapping = {};

  function formatWikidataCollectiveAccessMapping(raw_mapping) {
    // takes data from csv and create object with
    // {wikidata_property_id: collective_access_field}
    raw_mapping.forEach((row) => {
      if (row['ca_table'] === caTable) {
        if (row['wikidata_property']) {
          mapping[row['wikidata_property']] = row['ca_field'];
        } else if (row['wikidata_misc'] === 'qid') {
          mapping['qid'] = row['ca_field'];
        } else if (row['wikidata_misc'] === 'aliases') {
          mapping['aliases'] = row['ca_field'];
        }
      }
    });
  }

  formatWikidataCollectiveAccessMapping(raw_mapping);

  // ====================
  // display record
  // ====================

  function toggleAllLanguages() {
    showAllLanguages = !showAllLanguages;

    if (showAllLanguages) {
      languageCodesDisplay = languagesCodeAll;
    } else {
      languageCodesDisplay = languagesCodeAll.slice(0, languageDisplayLimit);
    }
  }

  function setlanguageCodesDisplay(item) {
    let languages = item['languages'];
    let tmp = Object.keys(languages);
    // ensure 'en' is first language shown
    if (languages['en']) {
      let en_idx = tmp.indexOf('en');
      tmp = ['en', ...tmp.slice(0, en_idx), ...tmp.slice(en_idx + 1)];
    }

    languagesCodeAll = tmp;
    languageCodesDisplay = tmp.slice(0, languageDisplayLimit);
  }

  function displayItem(item) {
    statements = (item['statements'] && Object.values(item['statements'])) || [];
    identifiers = (item['identifiers'] && Object.values(item['identifiers'])) || [];

    setlanguageCodesDisplay(item);
  }

  // ====================
  // fetch records
  // ====================

  async function getOneItem(id) {
    showSelectedRecord = true;
    loadingSelectedRecord = true;
    wikidataId = id;
    currentItem = await fetchWikidataItem(id);
    loadingSelectedRecord = false;
    displayItem(currentItem);
  }

  // ====================
  // import records
  // ====================

  function createCAFieldValueObject() {
    // create an array of fields and values. [{collective_access_field: value}]

    // use array of objects because a field can have multiple values
    let data = [];

    // statements
    statements.forEach((claimProperty) => {
      claimProperty.forEach((claim) => {
        if (mapping[claim['property']] !== undefined) {
          data.push({ [mapping[claim['property']]]: formatClaimValue(claim) });
        }
      });
    });

    // identifiers
    identifiers.forEach((claimProperty) => {
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
    data.push({ [mapping['qid']]: wikidataId });

    return data;
  }

  // TODO: birth and death dates don't work
  // TODO: shoud we do replace for each field
  // TODO: what to do if wikidata conflicts with CA data
  // TODO: what to do with references and qualifiers
  // TODO: store claim id so that we edit claims
  // TODO: check if wikidata data has changed since last import
  // TODO: what if there are multiple occupations
  async function importItem() {
    let data = createCAFieldValueObject();
    let bundles = formatBundles(data, 'replace');
    await editEntity(caRecord['idno'], caType, bundles);
  }

  // ====================
  // life cycle
  // ====================

  onMount(async () => {
    if (caTable === 'ca_entities') {
      caRecord = await getEntity(id);
    } else {
      throw new Error(`${caTable} is not implemented`);
    }
    searchResults = await searchKeyword(caRecord.preferred_labels);
    showMatches = true;
  });
</script>

{#if showMatches}
  <h1 class="title is-1">Import Wikidata Info</h1>
  <h2 class="title is-2">{caRecord.preferred_labels}, idno: {caRecord.idno}</h2>

  {#if searchResults.length == 0}
    <p>No wikidata records found.</p>
  {:else}
    <h3 class="title is-4">Matching Wikidata Records</h3>
    <table class="table">
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>ID</th>
        <th>Action</th>
      </tr>
      {#each searchResults as result (result['id'])}
        <tr>
          <td>{result['label']}</td>
          <td>{result['description']}</td>
          <td>{result['id']}</td>
          <td
            ><button class="button is-primary" on:click={() => getOneItem(result['id'])}
              >Preview</button
            ></td
          >
        </tr>
      {/each}
    </table>
  {/if}
{:else}
  <p>Loading...</p>
{/if}

{#if showSelectedRecord}
  {#if loadingSelectedRecord}
    <p>Loading...</p>
  {:else}
    <p>
      Note: The statements and identifiers with blue background will be imported into Collective
      Access.
    </p>
    <button class="button is-primary" on:click={importItem}>Import Item</button>

    <h2 class="title is-2">{caRecord.preferred_labels}, {wikidataId}</h2>

    <ItemBasicInfo item={currentItem} languageCodes={languageCodesDisplay} />

    <button class="button is-primary is-light" on:click={toggleAllLanguages}>
      {#if showAllLanguages}
        Fewer languages
      {:else}
        All entered languages
      {/if}
    </button>

    <h3 class="title is-3">Statements</h3>
    {#each statements as claimProperty}
      {#each claimProperty as claim (claim.id)}
        <Claim {claim} shouldImport={mapping[claim['property']] !== undefined} />
      {/each}
    {/each}

    <h3 class="title is-3">Identifiers</h3>
    {#each identifiers as claimProperty}
      {#each claimProperty as claim (claim.id)}
        <Claim {claim} shouldImport={mapping[claim['property']] !== undefined} />
      {/each}
    {/each}
  {/if}
{/if}
