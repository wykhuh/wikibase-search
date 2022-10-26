<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { onMount } from 'svelte';

  import { searchKeyword, allMenuOptions, getNetworkGraphData } from '$lib/common/wiki_queries';
  import NetworkGraph from '$lib/components/network_graph.svelte';
  import graphDataBAM from '$lib/data/graph_data_bam.json';
  import graphDataWikidata from '$lib/data/graph_data_wikidata.json';
  import graphDataDD from '$lib/data/graph_data_dd.json';
  import graphDataAll from '$lib/data/graph_data_all.json';

  // ====================
  // create graph
  // ====================
  let properties = [];
  let resetGraphStatus = false;
  let newSearchStatus = false;
  let loading = false;
  let graphItem = {};
  let networkData = {};
  let data_source = 'Wikidata';

  // ====================
  // data source
  // ====================

  $: switchDataSource(data_source);

  function switchDataSource(source) {
    if (source === 'Wikidata') {
      networkData = graphDataWikidata;
    } else if (source === 'BAM') {
      networkData = graphDataBAM;
    } else if (source === 'Dancing Digital') {
      networkData = graphDataDD;
    } else {
      networkData = graphDataAll;
    }
  }

  // ====================
  // events
  // ====================

  onMount(async () => {
    networkData = graphDataWikidata;
    resetGraphStatus = false;
    newSearchStatus = true;
    loading = false;
  });
</script>

<h1 class="title is-1">Compare Data Sources</h1>
<div class="columns">
  <div class="column is-one-third explorer-menu">
    <div class="field">
      <div class="menu-type">Data Source</div>

      <label class="radio">
        <input
          type="radio"
          name="property_type"
          bind:group={data_source}
          value="Wikidata"
        />Wikidata
      </label><br />
      <label class="radio">
        <input type="radio" name="property_type" bind:group={data_source} value="BAM" />BAM
      </label><br />
      <label class="radio">
        <input
          type="radio"
          name="property_type"
          bind:group={data_source}
          value="Dancing Digital"
        />Dancing Digital
      </label><br />
      <label class="radio">
        <input type="radio" name="property_type" bind:group={data_source} value="All" />All
      </label><br />
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
      targetWiki={'wikibase'}
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
  input[type='radio'] {
    margin-right: 5px;
  }
  input[type='checkbox'] {
    margin-right: 5px;
  }
</style>
