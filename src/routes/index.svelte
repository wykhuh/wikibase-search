<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { onMount } from 'svelte';
  import Claim from '$lib/components/claim.svelte';
  import ItemBasicInfo from '$lib/components/item_basic_info.svelte';
  import { searchKeywordCa, fetchWikidataItem } from '$lib/common/wiki_queries';

  let CA_API = 'http://localhost:8000';

  let testIds = {
    Q5: 'human',
    Q30: 'United States', // place
    Q487604: 'Martha Graham', // dancing digital
    Q16973731: 'Dianne McIntyre', // dancing digital
    Q753828: 'Essex', // place
    Q76: 'Barack Obama', // has lexeme
    Q28425: 'Chiroptera', // has video, sound, images
    Q111420520: 'Karl Hirsch'
  };
  let testId = null;

  let searchItem = '';
  let currentItem = null;
  let currentId = testId;
  let currentLabel = testIds[testId];
  let loading = false;
  let languageCodesDisplay = [];
  let statements = [];
  let identifiers = [];
  let doneImporting = false;
  let savedItems = [];

  // ====================
  // display record
  // ====================

  function setlanguageCodesDisplay(item) {
    let languages = item['languages'];
    let tmp = Object.keys(languages);
    // ensure 'en' is first language shown
    if (languages['en']) {
      let en_idx = tmp.indexOf('en');
      tmp = ['en', ...tmp.slice(0, en_idx), ...tmp.slice(en_idx + 1)];
    }

    languageCodesDisplay = tmp;
  }

  function displayItem(item) {
    statements = (item['statements'] && Object.values(item['statements'])) || [];
    identifiers = (item['identifiers'] && Object.values(item['identifiers'])) || [];

    setlanguageCodesDisplay(item);
  }

  function resetSearch() {
    currentItem = null;
    currentId = null;
    currentLabel = null;
    searchItem = '';
  }

  // ====================
  // import record
  // ====================

  async function importRecord() {
    const url = CA_API + '/import_wikidata';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item_id: currentId,
        item_label: currentLabel,
        item_data: currentItem
      })
    });
    let json = await response.json();
    savedItems = [...savedItems, { id: currentId, label: currentLabel }];
    currentItem = null;
    currentLabel = null;
    currentId = null;
    doneImporting = true;
  }

  // ====================
  // fetch records
  // ====================

  async function getAllItems() {
    loading = true;
    const url = CA_API + '/items';
    const response = await fetch(url);
    let json = await response.json();
    savedItems = json;
    loading = false;
  }

  // ====================
  // delete all records
  // ====================

  async function deleteAllItems() {
    const url = CA_API + '/items';
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let json = await response.json();
    console.log(json);

    savedItems = [];
  }
  // ====================
  // autocomplete
  // ====================

  async function loadOptions(keyword) {
    if (keyword.length > 1) {
      let json = searchKeywordCa(keyword);
      return json;
    }
  }

  async function handleSelect(selectedOption) {
    if (!selectedOption) return;
    loading = true;
    currentItem = null;
    doneImporting = false;
    currentId = selectedOption['id'];
    currentLabel = selectedOption['label'];
    currentItem = await fetchWikidataItem(currentId);
    displayItem(currentItem);
    loading = false;
  }

  // ====================
  // life cycle
  // ====================

  onMount(async () => {
    getAllItems();

    if (!currentId) {
      loading = false;
      return;
    }

    currentItem = await fetchWikidataItem(currentId);
    displayItem(currentItem);
    loading = false;
  });
</script>

<h1 class="title is-1">Wikidata Demo</h1>

<div class="columns">
  <div class="column is-four-fifths">
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
  </div>
  <div class="column">
    <button class="button is-small" on:click={resetSearch}>Reset</button>
  </div>
</div>

{#if loading}
  <h2 class="title is-2">Loading...</h2>
{/if}

{#if !currentItem && !loading && savedItems.length > 0}
  <h2 class="title is-2">Saved Records</h2>
  <ol>
    {#each savedItems as item}
      <li><a href={`/items/${item['id']}`}>{item['label']} ({item['id']})</a></li>
    {/each}
  </ol>

  <button on:click={deleteAllItems} class="button is-danger delete-records-button"
    >Delete all records</button
  >
{/if}

{#if currentItem}
  <h2 class="title is-2">{currentLabel} ({currentId})</h2>

  {#if !doneImporting}
    <button class="button is-primary" on:click={importRecord}>Import record</button>
  {/if}

  <ItemBasicInfo item={currentItem} languageCodes={languageCodesDisplay} />

  <h3 class="title is-3">Statements</h3>
  {#each statements as claimProperty}
    {#each claimProperty as claim}
      <Claim {claim} />
    {/each}
  {/each}

  <h3 class="title is-3">Identifiers</h3>
  {#each identifiers as claimProperty}
    {#each claimProperty as claim}
      <Claim {claim} />
    {/each}
  {/each}
{/if}

<style>
  /* use css to hide the arrow in <Autocomplete> since hideArrow does not work
  with bulma
  https://github.com/pstanoev/simple-svelte-autocomplete/issues/150
  */
  :global(.select:not(.is-multiple):not(.is-loading)::after) {
    border: 0;
  }

  .delete-records-button {
    margin-top: 3rem;
  }
</style>
