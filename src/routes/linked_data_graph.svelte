<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { onMount } from 'svelte';

  import {
    searchKeyword,
    allMenuOptions,
    getNetworkGraphData,
    formatNetworkGraphDataForVisJs
  } from '$lib/common/wiki_queries';
  import NetworkGraph from '$lib/components/network_graph.svelte';
  import { martha } from '$lib/data/networks_raw.js';

  let networkData = {};

  // ====================
  // select properties
  // ====================
  let properties = [].concat(...Object.values(allMenuOptions)).map((o) => o['id']);
  let iterations = 1;
  let destroyGraph = false;
  let loading = false;

  async function submitQuery() {
    if (!searchItem['id']) return;
    destroyGraph = false;
    loading = true;

    networkData = {};
    networkData = await getNetworkGraphData([searchItem['id']], properties, iterations);
  }

  function resetQuery() {
    searchItem = {};
    networkData = {};
    properties = [].concat(...Object.values(allMenuOptions)).map((o) => o['id']);
    iterations = 1;
    destroyGraph = true;
    loading = false;
  }

  // ====================
  // autocomplete
  // ====================
  let searchItem = {};
  let itemId = null;
  let itemLabel = null;

  async function loadOptions(keyword) {
    if (keyword) {
      itemId = null;
      itemLabel = null;
    }

    if (keyword.length > 1) {
      let json = await searchKeyword(keyword);
      return json;
    }
  }

  async function handleSelect(selectedOption) {
    if (Object.keys(selectedOption).length == 0) return;

    itemId = selectedOption['id'];
    itemLabel = selectedOption['label'];
  }

  // ====================
  // misc
  // ====================
  function preloadRecord() {
    itemId = 'Q487604';
    itemLabel = 'Martha Graham';
    searchItem = { id: itemId, label: itemLabel };
    networkData = formatNetworkGraphDataForVisJs(martha);
  }


  // ====================
  // life cycle
  // ====================
  onMount(async () => {
    // preloadRecord();
  });
</script>

<h1 class="title is-1">Search Wikidata.org</h1>
<div class="columns">
  <div class="column is-one-third explorer-menu">
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
        bind:selectedItem={searchItem}
      />
    </div>

    <div class="field">
      {#each Object.entries(allMenuOptions) as [menuType, options]}
        <div class="menu-type">{menuType}</div>
        {#each options as option (option['id'])}
          <label class="checkbox">
            <input
              type="checkbox"
              name="property_type"
              bind:group={properties}
              value={option['id']}
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
    <NetworkGraph {networkData} {searchItem} {properties} {destroyGraph} {loading} />
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
</style>
