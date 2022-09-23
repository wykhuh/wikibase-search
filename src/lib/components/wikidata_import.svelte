<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { goto } from '$app/navigation';

  import {
    createCAFieldValueObject,
    formatBundles,
    editEntityInd,
    editEntityOrg,
    editArtistWork
  } from '$lib/common/graphql_queries';
  import {
    searchKeyword,
    fetchWikidataItem,
    formatWikiCollectiveAccessMapping
  } from '$lib/common/wiki_queries';
  import { showAlerts, printJson } from '$lib/common/utils';
  import ItemBasicInfo from '$lib/components/item_basic_info.svelte';
  import Claim from '$lib/components/claim.svelte';

  export let id;
  export let caTable;
  export let caType;
  export let caRecord;
  export let searchResults;
  export let showMatches;
  export let mapping;
  export let targetWiki='wikidata';

  let currentItem = {};
  let currentId = null;
  let currentLabel = null;
  let showSelectedRecord = false;
  let loadingSelectedRecord = false;

  let defaultLanguage = 'en';

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

  function displayId(caRecord, field) {
    if(caRecord[`ca_entities.${field}`]) {
      return caRecord[`ca_entities.${field}`]['values'][0]
    } else {
      return ''
    }
  }

  // ====================
  // additional search
  // ====================

  let searchItem = null;
  let showAdditionalSearch = false;

  async function loadOptions(keyword) {
    if (keyword.length > 1) {
      return searchKeyword(keyword);
    } else {
      return [];
    }
  }

  async function handleSelect(searchResult) {
    if (searchResult == null) return;

    resetAlert();
    showSelectedRecord = true;
    await getWikidataItem(searchResult);
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
    await getWikidataItem(searchResult);
    displayItem(currentItem);
  }

  async function getWikidataItem(searchResult) {
    loadingSelectedRecord = true;
    currentId = searchResult['id'];
    currentLabel = searchResult['label'];
    currentItem = await fetchWikidataItem(currentId, targetWiki);
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

  async function importWikidataItem(wikidataItem) {
    // map wikidata property/value to collective access code/value
    let data = createCAFieldValueObject(wikidataItem, mapping);

    // remove preferred_labels from data so they won't be included in the bundles
    if (caTable === 'ca_entities' && caType === 'individual') {
      data = data.filter((d) => {
        return !Object.keys(d).some((field) => field.startsWith('ca_entities.preferred_labels.'));
      });
    }

    // create string of all the bundles
    let bundles = formatBundles(data, caTable, 'replace');

    // update collective access record
    if (caTable === 'ca_entities' && caType === 'individual') {
      return await editEntityInd(caRecord['idno'], bundles);
    } else  if (caTable === 'ca_entities' && caType === 'organization') {
      return await editEntityOrg(caRecord['idno'], bundles);
    } else if (caTable === 'ca_occurrences' && caType === 'choreographic_work') {
      return await editArtistWork(caRecord['idno'], bundles);
    } else {
      throw new Error(`${caTable}, ${caType} is not implemented`);
    }
  }

  async function loadAndImportWikidataItem(searchResult) {
    resetAlert();
    resetSearch();
    showAdditionalSearch = false;
    showSelectedRecord = false;
    importing = true;

    // if user clicks "import" without previewing item or
    // if searchItem is different than the item being previewd
    if (currentId == undefined || searchResult['id'] !== currentId) {
      await getWikidataItem(searchResult);
    }

    let result = await importWikidataItem(currentItem);
    let text = 'Data from Wikidata was added to the Collect Access record.';
    alerts = showAlerts(result, text);
    importing = false;
  }

  async function importWikibaseItem(wikidataItem) {
    let data = [{ [mapping['qid_local']]: wikidataItem['id'] }]

    // create string of all the bundles
    let bundles = formatBundles(data, caTable, 'replace');

    // update collective access record
    if (caTable === 'ca_entities' && caType === 'individual') {
      return await editEntityInd(caRecord['idno'], bundles);
    } else if (caTable === 'ca_entities' && caType === 'organization') {
      debugger
      return await editEntityOrg(caRecord['idno'], bundles);
    } else if (caTable === 'ca_occurrences' && caType === 'choreographic_work') {
      return await editArtistWork(caRecord['idno'], bundles);
    } else {
      throw new Error(`${caTable}, ${caType} is not implemented`);
    }
  }

  async function loadAndImportWikibaseItem(searchResult) {
    resetAlert();
    resetSearch();
    showAdditionalSearch = false;
    showSelectedRecord = false;
    importing = true;

    let result = await importWikibaseItem(searchResult);
    if(targetWiki === 'wikidata') {

    } else{
      caRecord['ca_entities.authority_wiki_data'] = []
    caRecord['ca_entities.authority_wiki_data']['values'] = [searchResult['id']]
    }

    let text = 'Wikidata Q id was added to the Collect Access record.';
    alerts = showAlerts(result, text);
    importing = false;
  }

  async function importSearchItem(currentItem) {
    resetAlert();
    importing = true;
    let result
    if(targetWiki==='wikidata'){
      result = await importWikidataItem(currentItem);
    } else {
      result = await importWikibaseItem(currentItem);
    }
    let text = `Data from ${targetWiki} was added to the Collect Access record.`;
    alerts = showAlerts(result, text);
    importing = false;
  }

  function resetAlert() {
    alerts = [];
  }

  // ====================
  // prev next record
  // ====================

  function getPrevNextId(id, action) {
    let recordIds = JSON.parse(localStorage.getItem(`${caTable}.${caType}.ids`))
    let index = recordIds.indexOf(id)
    if (index === 0 && action === 'prev')  {
      return
    } else if (index + 1 === recordIds.length && action === 'next'){
      return
    } else if (action === 'next') {
      return recordIds[index + 1]
    } else {
      return recordIds[index - 1]
    }
  }

  async function changePrevNext(id, action) {
    resetAlert()

    let tmpId = getPrevNextId(id, action)
    if(tmpId == undefined) return

    if(targetWiki === 'wikidata') {
      goto(`/import_wikidata/${tmpId}?table=${caTable}&type=${caType}`)
    } else {
      goto(`/import_wikibase/${tmpId}?table=${caTable}&type=${caType}`)
    }
  }
</script>

{#if importing}
  <p class={`notification is-warning`}>Importing...</p>
{/if}

{#each alerts as alert}
  <p class={`notification ${alert.type}`}>{alert.text}</p>
{/each}

{#if showMatches}
  <!-- {@html printJson(caRecord)} -->
  <ul class="subnav">
    <li><span on:click={()=>changePrevNext(id, 'prev')}>Prev</span></li>
    <li><span on:click={()=>changePrevNext(id, 'next')}>Next</span></li>
    <li><a href="/wikidata">Index</a></li>
  </ul>

  <h2 class="title is-2">{caRecord['displayname']}</h2>
  <p>Collective Access id: {caRecord.id},
    Wikidata id: {displayId(caRecord, 'authority_wikipedia')},
    Dancing Digital Commons id: {displayId(caRecord, 'authority_wiki_data')}
  </p>

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
            >
            <button class="button is-primary" on:click={() => previewItem(result)}>Preview</button>
            {#if targetWiki==='wikidata'}
            <button class="button is-primary" on:click={() => loadAndImportWikidataItem(result)}
              >Import</button>
            {:else}
            <button class="button is-primary" on:click={() => loadAndImportWikibaseItem(result)}
              >Import</button>
              {/if}
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

  .subnav {
    margin-bottom: 1rem;
  }
  .subnav li{
    display: inline-block;
    margin-right: 1rem;
  }

  .subnav span {
    color: blue;
    cursor: pointer;
  }
</style>
