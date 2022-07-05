<script>
  import { browser } from '$app/env';

  export let networkData;
  export let searchItem;

  $: if (browser) {
    renderGraph(networkData);
  }

  function renderGraph(networkData) {
    if (!networkData['nodes']) return;

    var nodes = new vis.DataSet(networkData['nodes']);
    var edges = new vis.DataSet(networkData['edges']);

    if (nodes.length == 0) {
      nodes = [{ id: searchItem['id'], label: searchItem['label'] }];
    }

    // create a network
    var container = document.getElementById('mynetwork');
    var networkData = {
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
    var network = new vis.Network(container, networkData, options);
    setupEvents(network);
  }

  function setupEvents(network) {
    network.on('click', function (params) {
      // TODO: click once to do query on node
    });
    network.on('doubleClick', function (params) {
      // TODO: click twice to open wikidata link
    });
  }
</script>

<main>
  {#if networkData['nodes']}
    {searchItem['label']} ({searchItem['id']}): {networkData['nodes'].length} linked records found
  {/if}
  <div id="mynetwork" />
</main>

<style>
  #mynetwork {
    width: 100%;
    height: 80vh;
  }
</style>
