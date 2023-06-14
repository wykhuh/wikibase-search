<script>
  import { onMount } from 'svelte';

  import { allMenuOptions } from '$lib/common/wiki_queries';
  import NetworkGraph from '$lib/components/network_graph.svelte';
  import graphDataBAM from '$lib/data/bam_graph.json';
  import graphDataNB from '$lib/data/nb_graph.json';
  import graphDataJP from '$lib/data/jp_graph.json';
  import graphDataAll from '$lib/data/all_graph.json';
  import graphDataWD from '$lib/data/wd_graph.json';

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

  let propertiesWD = [].concat(...Object.values(allMenuOptions)).map((o) => o['wikidataId']);
  console.log(propertiesWD.map((p) => `wdt:${p}`).join(', '));
  // ====================
  // data source
  // ====================

  $: switchDataSource(data_source);

  async function switchDataSource(source) {
    if (source === 'Wikidata') {
      networkData = graphDataWD;
    } else if (source === 'BAM') {
      networkData = graphDataBAM;
    } else if (source === 'No Boundaries') {
      networkData = graphDataNB;
    } else if (source === 'Jacobs Pillow') {
      networkData = graphDataJP;
    } else {
      networkData = graphDataAll;
    }
  }

  // ====================
  // events
  // ====================

  onMount(async () => {
    networkData = graphDataWD;
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
          value="Jacobs Pillow"
        />Jacob's Pillow
      </label><br />

      <label class="radio">
        <input type="radio" name="property_type" bind:group={data_source} value="No Boundaries" />No
        Boundaries
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
