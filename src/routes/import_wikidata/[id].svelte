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

  import {
    getEntity,
    formatWikidataCollectiveAccessMapping,
    createCAFieldValueObject,
    formatBundles,
    editEntity
  } from '$lib/common/graphql_queries';
  import { searchKeyword, fetchWikidataItem } from '$lib/common/wiki_queries';
  import ItemBasicInfo from '$lib/components/item_basic_info.svelte';
  import Claim from '$lib/components/claim.svelte';
  import rawMapping from '$lib/data/ca_wikidata_mapping.csv';

  export let id;
  let caRecord = {};
  let searchResults = [];
  let showMatches = false;
  let currentItem = {};
  let showSelectedRecord = false;
  let loadingSelectedRecord = false;
  let caTable = 'ca_entities';
  let caType = 'individual';

  // ====================
  // mapping
  // ====================

  let mapping = formatWikidataCollectiveAccessMapping(rawMapping, caTable);

  // ====================
  // display record
  // ====================

  let languageCodesDisplay = [];
  let languageDisplayLimit = 5;
  let languagesCodeAll = new Set();
  let showAllLanguages = false;

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
    setlanguageCodesDisplay(item);
  }

  // ====================
  // fetch records
  // ====================

  async function getOneItem(id) {
    resetAlert();
    showSelectedRecord = true;
    loadingSelectedRecord = true;
    currentItem = await fetchWikidataItem(id);
    loadingSelectedRecord = false;
    displayItem(currentItem);
  }

  // ====================
  // import records
  // ====================
  let alerts = [];

  // TODO: birth and death dates don't work
  // TODO: shoud we do replace for each field
  // TODO: what to do if wikidata conflicts with CA data
  // TODO: what to do with references and qualifiers
  // TODO: store claim id so that we edit claims
  // TODO: check if wikidata data has changed since last import
  // TODO: what if there are multiple occupations
  // BUG: David Roussève VIAF has import error http://localhost:3000/import_wikidata/3
  async function importItem() {
    let data = createCAFieldValueObject(currentItem, mapping);
    let bundles = formatBundles(data, 'replace');
    let result = await editEntity(caRecord['idno'], caType, bundles);
    showAlerts(result);
  }

  function resetAlert() {
    alerts = [];
  }

  function showAlerts(result) {
    let tmpAlerts = [];
    if (result.changed == 1) {
      tmpAlerts.push({ text: 'Data from Wikidata was added to the record.', type: 'is-success' });
    }
    if (result.warnings.length > 0) {
      let messages = [];
      result.warnings.forEach((warning) => messages.push(warning.message));
      tmpAlerts.push({ text: `Warning: ${messages.join('\n')}`, type: 'is-warning' });
    }
    if (result.errors.length > 0) {
      let messages = [];
      result.errors.forEach((error) => messages.push(error.message));
      tmpAlerts.push({ text: `Error: ${messages.join('\n')}`, type: 'is-danger' });
    }
    alerts = tmpAlerts;
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

<h1 class="title is-1">Import Wikidata Info</h1>

{#if showMatches}
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
    {#each alerts as alert}
      <p class={`notification ${alert.type}`}>{alert.text}</p>
    {/each}

    <p>
      Note: The statements and identifiers with blue background will be imported into Collective
      Access.
    </p>
    <button class="button is-primary" on:click={importItem}>Import Item</button>

    <h2 class="title is-2">{caRecord.preferred_labels}, {currentItem.id}</h2>

    <ItemBasicInfo item={currentItem} languageCodes={languageCodesDisplay} />

    <button class="button is-primary is-light" on:click={toggleAllLanguages}>
      {#if showAllLanguages}
        Fewer languages
      {:else}
        All entered languages
      {/if}
    </button>

    <h3 class="title is-3">Statements</h3>
    {#each Object.values(currentItem['statements']) as claimProperty}
      {#each claimProperty as claim (claim.id)}
        <Claim {claim} shouldImport={mapping[claim['property']] !== undefined} />
      {/each}
    {/each}

    <h3 class="title is-3">Identifiers</h3>
    {#each Object.values(currentItem['identifiers']) as claimProperty}
      {#each claimProperty as claim (claim.id)}
        <Claim {claim} shouldImport={mapping[claim['property']] !== undefined} />
      {/each}
    {/each}
  {/if}
{/if}
