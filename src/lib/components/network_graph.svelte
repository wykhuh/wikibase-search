<script>
  import { browser } from '$app/env';
  import { createEventDispatcher } from 'svelte';

  import { getNetworkGraphDataForOneNode } from '$lib/common/wiki_queries';

  export let networkData;
  export let graphItem;
  export let properties;
  export let resetGraphStatus;
  export let loading;
  export let newSearchStatus;

  let nodesObj = {};
  let edgesObj = {};
  let networkObj = {};
  let nodesCount = 0;
  const dispatch = createEventDispatcher();

  $: if (browser) {
    // render graph if user does new search
    if (newSearchStatus) {
      resetGraph();
      renderGraph(networkData);
      nodesCount = networkData['nodes'] ? networkData['nodes'].length : 0;
    }
  }

  $: if (resetGraphStatus) {
    resetGraph();
    networkObj.destroy();
  }

  function resetGraph() {
    nodesObj = {};
    edgesObj = {};
    networkObj = {};
    nodesCount = 0;
  }

  // when user enters in new search term, create a new graph
  function renderGraph(networkData) {
    if (!networkData['nodes']) return;

    loading = true;
    nodesObj = new vis.DataSet(networkData['nodes']);
    edgesObj = new vis.DataSet(networkData['edges']);

    if (nodesObj.length == 0) {
      nodesObj.add({ id: graphItem['id'], label: graphItem['label'] });
    }

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
      nodes: nodesObj,
      edges: edgesObj
    };

    // options
    var options = {
      layout: {
        improvedLayout: false
      },
      edges: {
        arrows: {
          to: {
            enabled: true,
            type: 'arrow',
            scaleFactor: 0.5
          }
        }
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -3000,
          damping: 1,
          avoidOverlap: 0.3
        }
      },
      interaction: { hover: true }
    };
    networkObj = new vis.Network(container, data, options);
    setupEvents(networkObj);
  }

  // when user clicks on node, update existing graph
  async function updateGraph(params) {
    let id = params['nodes'][0];
    let newData = await getNetworkGraphDataForOneNode(id, properties, networkData);
    let graphUpdated = false;
    newSearchStatus = false;
    dispatch('changeSearchStatus', newSearchStatus);

    // TODO: update sparql query
    // let newSparqlQuery = networkData['query'];

    let nodeIds = new Set(networkData['nodes'].map((n) => n['id']));
    let edgeIds = new Set(
      networkData['edges'].map((n) => `${n['from']} ${n['property_id']} ${n['to']}`)
    );

    newData['nodes'].forEach((node) => {
      if (!nodeIds.has(node['id'])) {
        nodesObj.add(node);
        nodesCount += 1;
        networkData['nodes'] = [...networkData['nodes'], node];
        graphUpdated = true;
      }
    });
    newData['edges'].forEach((edge) => {
      if (!edgeIds.has(`${edge['from']} ${edge['property_id']} ${edge['to']}`)) {
        edgesObj.add(edge);
        networkData['edges'] = [...networkData['edges'], edge];
        graphUpdated = true;
      }
    });

    return graphUpdated;
  }

  function setupEvents(network) {
    network.on('click', async function (params) {});
    network.on('doubleClick', async function (params) {
      loading = true;
      let result = await updateGraph(params);

      // if no edges or nodes are added, set loading to false.
      // if edges or nodes are added, set loading to false after graph is redrawn.
      if (!result) {
        loading = false;
      }
    });

    // startStabilizing, stabilized called by updateGraph.
    // startStabilizing, stabilizationProgress, stabilizationIterationsDone
    // called by renderGraph.

    // network.on('startStabilizing', function (params) {
    //   console.log('startStabilizing');
    // });
    // network.on('stabilizationProgress', function (params) {
    //   console.log('stabilizationProgress');
    // });
    // network.on('stabilizationIterationsDone', function (params) {
    //   console.log('stabilizationIterationsDone');
    // });
    // network.on('stabilized', function (params) {
    //   console.log('stabilized');
    // });
    // network.on('initRedraw', function (params) {
    //   console.log('initRedraw');
    // });
    // network.on('beforeDrawing', function (params) {
    //   console.log('beforeDrawing');
    // });
    network.on('afterDrawing', function (params) {
      if (loading) {
        loading = false;
      }
      // console.log('afterDrawing');
    });
  }
</script>

<main>
  {#if loading}
    <div class="lds-dual-ring" />
  {/if}

  {#if networkData['nodes']}
    {graphItem['label']} ({graphItem['id']}): {nodesCount} linked records found
  {/if}
  <div id="mynetwork" />

  {#if networkData['edges']}
    <table class="table">
      {#each networkData['edges'] as edge}
        <tr>
          <td><a href={`https://www.wikidata.org/wiki/${edge['from']}`}>{edge['fromLabel']}</a></td>
          <td>{edge['label']}</td>
          <td><a href={`https://www.wikidata.org/wiki/${edge['to']}`}>{edge['toLabel']}</a></td>
        </tr>{/each}
    </table>
  {/if}
</main>

<style>
  :root {
    --spinnserSize: 120px;
    --ringSize: 104px;
  }

  main {
    position: relative;
  }
  #mynetwork {
    width: 100%;
    height: 80vh;
  }

  table {
    margin-top: 1rem;
  }

  .lds-dual-ring {
    display: inline-block;
    width: var(--spinnerSize);
    height: var(--spinnerSize);

    position: absolute;
    top: 30vh;
    right: calc(50% - 80px);
  }
  .lds-dual-ring:after {
    content: ' ';
    display: block;
    width: var(--ringSize);
    height: var(--ringSize);
    margin: 8px;
    border-radius: 50%;
    border: 6px solid rgb(3, 135, 200);
    border-color: rgb(3, 135, 200) transparent rgb(3, 135, 200) transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
