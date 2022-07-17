<script>
  import { browser } from '$app/env';
  import { getNetworkGraphDataForOneNode } from '$lib/common/wiki_queries';

  export let networkData;
  export let searchItem;
  export let properties;
  export let destroyGraph;
  export let loading;

  let nodes = [];
  let edges = [];
  let nodesCount = 0;
  let network;
  let graphTarget = {};

  $: if (browser) {
    renderGraph(networkData);
    nodesCount = networkData['nodes'] ? networkData['nodes'].length : 0;
  }

  $: if (destroyGraph) {
    network.destroy();
  }

  function renderGraph(networkData) {
    if (!networkData['nodes']) return;

    loading = true;
    graphTarget = { ...searchItem };
    nodes = new vis.DataSet(networkData['nodes']);
    edges = new vis.DataSet(networkData['edges']);

    if (nodes.length == 0) {
      nodes = [{ id: searchItem['id'], label: searchItem['label'] }];
    }

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
      nodes: nodes,
      edges: edges
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
    network = new vis.Network(container, data, options);
    setupEvents(network);
  }

  async function updateGraph(params) {
    let id = params['nodes'][0];
    let newData = await getNetworkGraphDataForOneNode(id, properties, networkData);
    // TODO: update sparql query
    // let newSparqlQuery = networkData['query'];
    let nodeIds = new Set(networkData['nodes'].map((n) => n['id']));
    let edgeIds = new Set(
      networkData['edges'].map((n) => `${n['from']} ${n['property_id']} ${n['to']}`)
    );

    newData['nodes'].forEach((node) => {
      if (!nodeIds.has(node['id'])) {
        nodes.add(node);
        nodesCount += 1;
        networkData['nodes'].push(node);
      }
    });
    newData['edges'].forEach((edge) => {
      if (!edgeIds.has(`${edge['from']} ${edge['property_id']} ${edge['to']}`)) {
        edges.add(edge);
        networkData['edges'].push(edge);
      }
    });
  }

  function setupEvents(network) {
    network.on('click', async function (params) {});
    network.on('doubleClick', async function (params) {
      loading = true;
      await updateGraph(params);
    });

    // startStabilizing, stabilized called by updateGraph.
    // startStabilizing, stabilizationProgress, stabilizationIterationsDone
    // called by renderGraph.

    network.on('startStabilizing', function (params) {
      loading = false;
      // console.log('startStabilizing')
    });
    network.on('stabilizationProgress', function (params) {
      loading = true;
      // console.log('stabilizationProgress')
    });
    network.on('stabilizationIterationsDone', function (params) {
      loading = false;
      // console.log('stabilizationIterationsDone')
    });
    // network.on('stabilized',  function (params) { console.log('stabilized')});
    // network.on('initRedraw',  function (params) {console.log('initRedraw')});
    // network.on('beforeDrawing',  function (params) {console.log('beforeDrawing')});
    // network.on('afterDrawing',  function (params) {console.log('afterDrawing')});
  }
</script>

<main>
  {#if loading}
    <div class="lds-dual-ring" />
  {/if}

  {#if networkData['nodes']}
    {graphTarget['label']} ({graphTarget['id']}): {nodesCount} linked records found
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
