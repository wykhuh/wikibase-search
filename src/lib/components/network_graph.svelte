<script>
  import { browser } from '$app/env';
  import { getNetworkGraphDataForOneNode } from '$lib/common/wiki_queries';

  export let networkData;
  export let searchItem;
  export let properties;
  export let destroyGraph;

  let nodes = [];
  let edges = [];
  let nodesCount = 0;
  let network;

  $: if (browser) {
    renderGraph(networkData);
    nodesCount = networkData['nodes'] ? networkData['nodes'].length : 0;
  }

  $: if (destroyGraph) {
    network.destroy();
  }

  function renderGraph(networkData) {
    if (!networkData['nodes']) return;

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
    network.on('click', async function (params) {
      await updateGraph(params);
    });
    network.on('doubleClick', function (params) {
      // TODO: click twice to open wikidata link
    });
  }
</script>

<main>
  {#if networkData['nodes']}
    {searchItem['label']} ({searchItem['id']}): {nodesCount} linked records found
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
  #mynetwork {
    width: 100%;
    height: 80vh;
  }

  table {
    margin-top: 1rem;
  }
</style>
