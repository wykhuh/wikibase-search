<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/env';

  function renderGraph() {
    var nodes = new vis.DataSet([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' }
    ]);

    var edges = new vis.DataSet([
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 3 }
    ]);

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {};
    var network = new vis.Network(container, data, options);
  }

  onMount(async () => {
    if (browser) {
      renderGraph();
    }
  });
</script>

<main>
  <div id="mynetwork" class="map" />
</main>

<style>
  #mynetwork {
    width: 600px;
    height: 400px;
    border: 1px solid lightgray;
  }
</style>
