<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { onMount } from 'svelte';

  import { searchKeyword, allMenuOptions, getNetworkGraphData } from '$lib/common/queries';
  import NetworkGraph from '$lib/components/network_vis.svelte';

  // ====================
  // select properties
  // ====================
  let propertiesType = 'preset';
  let properties = [].concat(...Object.values(allMenuOptions)).map((o) => o['id']);
  let iterations = 1;
  let showSparqlQuery = false;

  async function submitQuery() {
    if (!searchItem['id']) return;

    let results = await getNetworkGraphData([searchItem['id']], properties);
    console.log(results);
    // downloadObjectAsJson(results, 'networks');
  }

  function resetQuery() {
    searchItem = {};
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
  // life cycle
  // ====================

  function preloadRecord() {
    itemId = 'Q487604';
    itemLabel = 'Martha Graham';
    searchItem = {};
  }

  onMount(async () => {
    preloadRecord();
  });

  function downloadObjectAsJson(exportObj, exportName) {
    // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', exportName + '.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
</script>

{JSON.stringify(properties)}

<h1 class="title is-1">Linked Data</h1>
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
      <div>properties</div>

      <div class="control">
        <label class="radio">
          <input type="radio" name="property_type" bind:group={propertiesType} value={'preset'} />
          Preset properties
        </label>
        <label class="radio">
          <input type="radio" name="property_type" bind:group={propertiesType} value={'custom'} />
          Custom properties
        </label>
      </div>
    </div>
    {#if propertiesType == 'preset'}
      {#each Object.entries(allMenuOptions) as [menuType, options]}
        <div>{menuType}</div>
        {#each options as option}
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
    {:else}
      custom
    {/if}

    <div class="field">
      <label class="label" for="iterations"> Iterations</label>
      <div class="control">
        <input id="iterations" type="number" bind:value={iterations} name="iterations" min="1" />
      </div>
    </div>

    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={showSparqlQuery} name="show_sparql_query" />
          Show SPARQL query
        </label>
      </div>
    </div>
    {#if showSparqlQuery}
      <div class="field">
        <label class="label" for="query">SPARQL query</label>
        <div class="control">
          <textarea id="query" class="textarea" placeholder="Textarea" />
        </div>
      </div>
    {/if}

    <div class="field is-grouped">
      <div class="control">
        <button on:click={submitQuery} class="button is-link">Submit</button>
      </div>
      <div class="control">
        <button on:click={resetQuery} class="button is-link is-light">Reset</button>
      </div>
    </div>
  </div>
  <div class="column is-two-thirds explorer-graph">
    <NetworkGraph />
  </div>
</div>

<style>
  .explorer-menu,
  .explorer-graph {
    border: 1px solid #bbb;
  }
</style>
