<script context="module">
  export async function load({ params, url }) {
    const caTable = url.searchParams.get('table') || 'ca_entities';
    const caType = url.searchParams.get('type') || 'individual';

    return {
      props: {
        id: params.id,
        caTable,
        caType
      }
    };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import AutoComplete from 'simple-svelte-autocomplete';

  import {
    getEntity,
    getArtisticWork,
    formatWikidataCollectiveAccessMapping,
    createCAFieldValueObject,
    formatBundles,
    editEntity,
    editArtistWork
  } from '$lib/common/graphql_queries';
  import { searchKeyword, fetchWikidataItem, copyWikidataItem } from '$lib/common/wiki_queries';
  import ItemBasicInfo from '$lib/components/item_basic_info.svelte';
  import Claim from '$lib/components/claim.svelte';
  import rawMapping from '$lib/data/ca_wikidata_mapping.csv';

  export let id;
  export let caTable;
  export let caType;

  let caRecord = {};
  let searchResults = [];
  let showMatches = false;
  let currentItem = {};
  let currentId = null;
  let currentLabel = null;
  let showSelectedRecord = false;
  let loadingSelectedRecord = false;

  let defaultLanguage = 'en';

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
  // additional search
  // ====================

  let searchItem = null;
  let showAdditionalSearch = false;

  async function loadOptions(keyword) {
    if (keyword.length > 1) {
      return searchKeyword(keyword);
    }
  }

  async function handleSelect(searchResult) {
    if (searchResult == null) return;

    resetAlert();
    showSelectedRecord = true;
    await getOneItem(searchResult);
    displayItem(currentItem);
  }

  function resetSearch() {
    // setting searchItem doesn't work in async / await
    searchItem = null;
  }

  function toogleSearch() {
    resetSearch();
    showAdditionalSearch = !showAdditionalSearch;
  }

  // ====================
  // fetch records
  // ====================

  async function previewItem(searchResult) {
    resetAlert();
    resetSearch();
    showAdditionalSearch = false;
    showSelectedRecord = true;
    await getOneItem(searchResult);
    displayItem(currentItem);
  }

  async function getOneItem(searchResult) {
    loadingSelectedRecord = true;
    currentId = searchResult['id'];
    currentLabel = searchResult['label'];
    currentItem = await fetchWikidataItem(currentId);
    loadingSelectedRecord = false;
  }

  // ====================
  // import records
  // ====================
  let alerts = [];
  let importing = false;

  // TODO: birth and death dates don't work
  // TODO: shoud we do replace for each field
  // TODO: what to do if wikidata conflicts with CA data
  // TODO: what to do with references and qualifiers
  // TODO: store claim id so that we edit claims
  // TODO: check if wikidata data has changed since last import
  // TODO: what if there are multiple occupations
  // TODO: add field for qid of local wikibase
  // TODO: at what point do we import into wikidata.org
  // BUG: David Roussève VIAF has import error http://localhost:3000/import_wikidata/3

  async function importItem(wikidataItem) {
    // copy wikidata.org item to local wikibase
    copyWikidataItem(wikidataItem['id'], id, caTable, caType);

    // map wikidata property/value to collective access code/value
    let data = createCAFieldValueObject(wikidataItem, mapping);

    // remove preferred_labels from data so they won't be included in the bundles
    if (caTable === 'ca_entities' && caType === 'individual') {
      data = data.filter((d) => {
        return !Object.keys(d).some((field) => field.startsWith('preferred_labels.'));
      });
    }

    // create string of all the bundles
    let bundles = formatBundles(data, 'replace');
    // update collective access record
    if (caTable === 'ca_entities' && caType === 'individual') {
      return await editEntity(caRecord['idno'], bundles);
    } else if (caTable === 'ca_occurrences' && caType === 'choreographic_work') {
      return await editArtistWork(caRecord['idno'], bundles);
    } else {
      throw new Error(`${caTable}, ${caType} is not implemented`);
    }
  }

  async function loadAndImportItem(searchResult) {
    resetAlert();
    resetSearch();
    showAdditionalSearch = false;
    showSelectedRecord = false;
    importing = true;

    // get item if "import" is the first clicked action
    if (currentId == undefined) {
      await getOneItem(searchResult);
      // get item if item is not being previewed
    } else if (searchResult['id'] !== currentId) {
      await getOneItem(searchResult);
    }

    let result = await importItem(currentItem);
    showAlerts(result);
    importing = false;
  }

  async function importSearchItem(currentItem) {
    resetAlert();
    importing = true;
    let result = await importItem(currentItem);
    showAlerts(result);
    importing = false;
  }

  function resetAlert() {
    alerts = [];
  }

  function showAlerts(result) {
    let tmpAlerts = [];
    if (result.changed == 1) {
      tmpAlerts.push({
        text: 'Data from Wikidata was added to the Collect Access record.',
        type: 'is-success'
      });
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
    let codes = [`${caTable}.preferred_labels`, `${caTable}.${mapping['qid']}`];
    if (caTable === 'ca_entities' && caType === 'individual') {
      caRecord = await getEntity(id, codes);
    } else if (caTable === 'ca_occurrences' && caType === 'choreographic_work') {
      caRecord = await getArtisticWork(id, codes);
    } else {
      throw new Error(`${caTable} is not implemented`);
    }

    searchResults = await searchKeyword(caRecord['displayname']);
    showMatches = true;
  });
</script>

<h1 class="title is-1">Import Wikidata Info</h1>

{#if showMatches}
  <h2 class="title is-2">{caRecord['displayname']}, idno: {caRecord.idno}</h2>

  {#if searchResults.length == 0}
    <p>No wikidata records found.</p>
  {:else}
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
            ><button class="button is-primary" on:click={() => previewItem(result)}>Preview</button>
            <button class="button is-primary" on:click={() => loadAndImportItem(result)}
              >Import</button
            >
          </td>
        </tr>
      {/each}
    </table>
  {/if}
{:else}
  <p>Loading...</p>
{/if}

<div class="additional-search">
  <button class="button is-primary is-light" on:click={toogleSearch}>
    {#if showAdditionalSearch}
      Hide search
    {:else}
      Show search
    {/if}
  </button>
  {#if showAdditionalSearch && currentItem['id']}
    <button class="button is-primary" on:click={() => importSearchItem(currentItem)}>Import</button>
  {/if}
  {#if showAdditionalSearch}
    <AutoComplete
      searchFunction={loadOptions}
      delay="200"
      onChange={handleSelect}
      labelFieldName="search_label"
      placeholder="Search keyword"
      hideArrow={true}
      showClear={false}
      localFiltering={false}
      bind:selectedItem={searchItem}
    />
  {/if}
</div>

{#each alerts as alert}
  <p class={`notification ${alert.type}`}>{alert.text}</p>
{/each}

{#if importing}
  <p>Importing...</p>
{/if}

{#if showSelectedRecord}
  {#if loadingSelectedRecord}
    <p>Loading...</p>
  {:else}
    <p>
      Note: The statements and identifiers with blue background will be imported into Collective
      Access.
    </p>

    <h2 class="title is-2">{currentLabel}, {currentId}</h2>

    <ItemBasicInfo
      item={currentItem}
      importAliases={mapping['aliases'] != undefined}
      languageCodes={languageCodesDisplay}
      {defaultLanguage}
    />

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

<style>
  :global(.select:not(.is-multiple):not(.is-loading)::after) {
    border: 0;
  }
  .additional-search {
    margin-bottom: 1em;
  }
  .additional-search button {
    margin-bottom: 1em;
  }
</style>
