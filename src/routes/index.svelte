<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { onMount } from 'svelte';
  import Claim from '$lib/components/claim.svelte';

  let testIds = {
    Q5: 'human',
    Q30: 'United States', // place
    Q487604: 'Martha Graham', // dancing digital
    Q16973731: 'Dianne McIntyre', // dancing digital
    Q753828: 'Essex', // place
    Q76: 'Barack Obama', // has lexeme
    Q28425: 'Chiroptera' // has video, sound, images
  };
  let testId = null;

  let foo = '';
  let currentItem = null;
  let currentId = testId;
  let currentLabel = testIds[testId];
  let loading = false;
  let languagesAll = new Set();
  let languagesDisplay = [];
  let labels = {};
  let descriptions = {};
  let aliases = {};
  let statements = [];
  let identifiers = [];
  let showAllLanguages = false;
  let doneImporting = false;

  // ====================
  // display record
  // ====================

  function toggleAllLanguages() {
    showAllLanguages = !showAllLanguages;

    if (showAllLanguages) {
      languagesDisplay = [...languagesAll];
    } else {
      limitLanguagesDisplay();
    }
  }

  function limitLanguagesDisplay() {
    languagesDisplay = ['en'];
    languagesAll.forEach((lang) => {
      if (lang !== 'en' && languagesDisplay.length < 5) {
        languagesDisplay = [...languagesDisplay, lang];
      }
    });
  }

  function displayItem(item) {
    descriptions = item['descriptions'] || {};
    aliases = item['aliases'] || {};
    labels = item['labels'] || {};
    statements = (item['statements'] && Object.values(item['statements'])) || [];
    identifiers = (item['identifiers'] && Object.values(item['identifiers'])) || [];

    ['labels', 'descriptions', 'aliases'].forEach((type) => {
      if (item[type]) {
        Object.keys(item[type]).forEach((lang) => languagesAll.add(lang));
      }
    });
    limitLanguagesDisplay();
  }

  // ====================
  // import record
  // ====================

  async function importRecord() {
    const url = 'http://localhost:8000/import_wikidata';
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
    currentItem = null;
    currentLabel = null;
    currentId = null;
    doneImporting = true;
  }

  // ====================
  // autocomplete
  // ====================

  async function loadOptions(keyword) {
    if (keyword.length > 2) {
      const url = 'http://localhost:8000/search?keyword=' + keyword;
      const response = await fetch(url);
      console.log('search for ' + keyword);
      let json = await response.json();
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
    const url = 'http://localhost:8000/fetch_wikidata_item/' + currentId;
    const response = await fetch(url);
    currentItem = await response.json();
    displayItem(currentItem);
    loading = false;
  }

  // ====================
  // life cycle
  // ====================

  onMount(async () => {
  });
</script>

<h1 class="title is-1">Wikidata Demo</h1>

<AutoComplete
  searchFunction={loadOptions}
  delay="200"
  onChange={handleSelect}
  labelFieldName="search_label"
  placeholder="Search keyword"
  hideArrow={true}
  showClear={true}
  localFiltering={false}
  bind:selectedItem={foo}
/>

{#if currentLabel}
  <h2 class="title is-2">{currentLabel} ({currentId})</h2>
{/if}

{#if loading}
  <h2 class="title is-2">Loading...</h2>
{/if}

{#if doneImporting}
  <div>Record imported!</div>
{/if}

{#if currentItem}
  {#if !doneImporting}
    <button class="button is-primary" on:click={importRecord}>Import record</button>
  {/if}

  <table class="table  is-bordered is-fullwidth">
    <thead>
      <tr>
        <th>Language</th>
        <th>Label</th>
        <th>Description</th>
        <th>Also known as</th>
      </tr>
    </thead>
    <tbody>
      {#each languagesDisplay as lang}
        <tr>
          <td>{lang}</td>
          <td
            >{#if labels[lang]}{labels[lang]}{/if}</td
          >
          <td
            >{#if descriptions[lang]}{descriptions[lang]}{/if}</td
          >
          <td
            >{#if aliases[lang]}{aliases[lang]}{/if}</td
          >
        </tr>
      {/each}
    </tbody>
  </table>

  <button class="button is-primary is-light" on:click={toggleAllLanguages}>
    {#if showAllLanguages}
      Fewer languages
    {:else}
      All entered languages
    {/if}
  </button>

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
</style>
