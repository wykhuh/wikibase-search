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
  import { getEntity } from '$lib/common/graphql_queries';
  import { allMenuOptions, getNetworkGraphData } from '$lib/common/wiki_queries';
  import NetworkGraph from '$lib/components/network_graph.svelte';

  export let id;
  let networkData = {};
  let currentItem = {};
  let itemId = null;
  let itemLabel = null;
  let caTable = 'ca_entities';
  let caRecord = {};

  // ====================
  // select properties
  // ====================
  let properties = [].concat(...Object.values(allMenuOptions)).map((o) => o['id']);
  let iterations = 1;
  let destroyGraph = false;

  async function submitQuery() {
    destroyGraph = false;
    networkData = {};
    networkData = await getNetworkGraphData([currentItem['id']], properties, iterations);
  }

  function resetQuery() {
    currentItem = {};
    networkData = {};
    propertiesType = 'preset';
    properties = [].concat(...Object.values(allMenuOptions)).map((o) => o['id']);
    iterations = 1;
    destroyGraph = true;
  }

  // ====================
  // misc
  // ====================

  async function preloadRecord(caRecord) {
    itemId = caRecord['Entity Authority Identifier'];
    itemLabel = caRecord['Display name'];
    currentItem = { id: itemId, label: itemLabel };

    networkData = {};
    networkData = await getNetworkGraphData([itemId], properties, iterations);
  }

  // ====================
  // life cycle
  // ====================
  onMount(async () => {
    if (caTable === 'ca_entities') {
      caRecord = await getEntity(id);
      await preloadRecord(caRecord);
    } else {
      throw new Error(`${caTable} is not implemented`);
    }
  });
</script>

<h1 class="title is-1">Linked Data</h1>
<div class="columns">
  <div class="column is-one-third explorer-menu">
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
        <button on:click={submitQuery} class="button is-link">Submit</button>
      </div>
      <div class="control">
        <button on:click={resetQuery} class="button is-link is-light">Reset</button>
      </div>
    </div>
  </div>
  <div class="column is-two-thirds explorer-graph">
    <NetworkGraph {networkData} searchItem={currentItem} {properties} {destroyGraph} />
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

  .menu-type {
    margin-top: 1em;
  }
</style>
