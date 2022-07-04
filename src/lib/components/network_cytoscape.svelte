<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import cytoscape from 'cytoscape';

  function renderGraph() {
    var cy = cytoscape({
      container: document.getElementById('cy'), // container to render in
      elements: [
        // list of graph elements to start with
        {
          // node a
          data: { id: 'a' }
        },
        {
          // node b
          data: { id: 'b' }
        },
        {
          // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],

      style: [
        // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            label: 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }
    });
  }

  onMount(async () => {
    if (browser) {
      renderGraph();
    }
  });
</script>

<main>
  <div id="cy" class="map" />
</main>

<style>
  main .map {
    height: 200px;
    width: 350px;
    margin-bottom: 10px;
  }
</style>
