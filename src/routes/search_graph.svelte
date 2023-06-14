<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { onMount } from 'svelte';

  import { searchKeyword, allMenuOptions, getNetworkGraphData } from '$lib/common/wiki_queries';
  import NetworkGraph from '$lib/components/network_graph.svelte';

  // ====================
  // create graph
  // ====================
  let properties = [];
  let iterations = 1;
  let resetGraphStatus = false;
  let newSearchStatus = false;
  let loading = false;
  let graphItem = {};
  let networkData = {};
  let selectedDatasource = 'wikidata';
  $: {
    selectedDatasource;
    searchItem = {};
  }

  async function submitQuery() {
    resetGraphStatus = false;
    newSearchStatus = true;
    loading = true;
    graphItem = searchItem;
    networkData = {};

    if (!searchItem['id']) return;

    networkData = await getNetworkGraphData(
      [searchItem['id']],
      properties.filter((p) => p !== ''),
      iterations,
      ignoreItems.map((i) => i['id']),
      selectedDatasource
    );
    loading = false;
  }

  function resetQuery() {
    searchItem = {};
    properties = [];
    iterations = 1;
    ignoreItem = {};
    ignoreItems = [];

    resetGraphStatus = true;
    newSearchStatus = false;
    loading = false;
    graphItem = {};
    networkData = {};
  }

  // ====================
  // autocomplete search
  // ====================
  let searchItem = {};

  async function loadOptions(keyword) {
    if (keyword.length > 1) {
      let json = await searchKeyword(keyword, selectedDatasource);
      return json;
    } else {
      return [];
    }
  }

  async function handleSelect(selectedOption) {
    if (Object.keys(selectedOption).length == 0) return;
  }

  // ====================
  // autocomplete ignore items
  // ====================
  let ignoreItem = {};
  let ignoreItems = [];

  async function handleIgnoreSelect(selectedOption) {
    if (Object.keys(selectedOption).length == 0) return;
    ignoreItems = [...ignoreItems, selectedOption];
  }

  function checkOptions(type) {
    if (type === 'none') {
      properties = [];
    } else {
      let menuIdKey = selectedDatasource === 'wikidata' ? 'wikidataId' : 'ddcId';
      properties = [].concat(...Object.values(allMenuOptions)).map((o) => o[menuIdKey]);
    }
  }

  // ====================
  // events
  // ====================

  function handleSearchStatus(event) {
    newSearchStatus = event.detail;
  }

  onMount(async () => {
    // ignoreItem = {
    //   id: 'Q2842976',
    //   label: 'American Masters',
    //   search_label: 'American Masters (American television series)',
    //   description: 'American television series'
    // };
    // searchItem = {
    //   id: 'Q487604',
    //   label: 'Martha Graham',
    //   search_label: 'Martha Graham (American dancer and choreographer)',
    //   description: 'American dancer and choreographer'
    // };
  });
</script>

{#if selectedDatasource == 'wikidata'}
  <h1 class="title is-1">Search Wikidata.org</h1>
{:else}
  <h1 class="title is-1">Search Dancing Digital Commons</h1>
{/if}
<div class="columns">
  <div class="column is-one-third explorer-menu">
    <div class="field">
      <label class="label" for="datasource">Data source</label>
      <div class="control">
        <div class="select">
          <select name="datasource" bind:value={selectedDatasource}>
            <option value="wikidata">Wikidata</option>
            <option value="ddc">Dancing Digital</option>
          </select>
        </div>
      </div>
    </div>
    <div class="field">
      <label class="label" for="search">Search</label>
      <AutoComplete
        searchFunction={loadOptions}
        delay="200"
        onChange={handleSelect}
        labelFieldName="search_label"
        placeholder="Search keyword"
        hideArrow={true}
        showClear={false}
        localFiltering={false}
        lowercaseKeywords={false}
        bind:selectedItem={searchItem}
      />
    </div>

    <div class="field">
      <label class="label" for="filters">Filters</label><button
        class="button is-small"
        on:click={() => checkOptions('all')}
      >
        All</button
      >
      <button class="button is-small" on:click={() => checkOptions('none')}>None</button>
    </div>
    <div class="field">
      {#each Object.entries(allMenuOptions) as [menuType, options]}
        <div class="menu-type">{menuType}</div>
        {#each options as option, index}
          <label class="checkbox">
            <input
              type="checkbox"
              name="property_type"
              bind:group={properties}
              value={option[selectedDatasource === 'wikidata' ? 'wikidataId' : 'ddcId']}
            />{option['label']}
          </label><br />
        {/each}
      {/each}
    </div>

    <div class="field">
      <label class="label" for="iterations"> Iterations</label>
      <div class="control">
        <input id="iterations" type="number" bind:value={iterations} name="iterations" min="1" />
      </div>
    </div>

    <div class="field">
      <label class="label" for="search">Ignore records</label>
      <AutoComplete
        searchFunction={loadOptions}
        delay="200"
        onChange={handleIgnoreSelect}
        labelFieldName="search_label"
        placeholder="Search keyword"
        hideArrow={true}
        showClear={false}
        localFiltering={false}
        lowercaseKeywords={false}
        bind:selectedItem={ignoreItem}
      />

      <ul class="ignore-items">
        {#each ignoreItems as item}
          <li class="tag">{item['label']}</li>
        {/each}
      </ul>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button on:click={submitQuery} class="button is-link">Search</button>
      </div>
      <div class="control">
        <button on:click={resetQuery} class="button is-link is-light">Reset</button>
      </div>
    </div>
  </div>
  <div class="column is-two-thirds explorer-graph">
    <NetworkGraph
      {networkData}
      {graphItem}
      {properties}
      {resetGraphStatus}
      {loading}
      {newSearchStatus}
      targetWiki={selectedDatasource}
      on:changeSearchStatus={handleSearchStatus}
    />
  </div>
</div>

<style>
  .explorer-menu,
  .explorer-graph {
    border: 1px solid #bbb;
  }

  .field {
    margin-bottom: 1rem;
  }

  :global(.select:not(.is-multiple):not(.is-loading)::after) {
    border: 0;
  }

  .menu-type {
    margin-top: 1em;
  }

  .ignore-items li {
    margin-right: 1em;
  }

  input[type='checkbox'] {
    margin-right: 5px;
  }
</style>
