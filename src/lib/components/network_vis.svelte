<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  export let data;

  function formatNodes(data) {
    let ids = new Set();
    let allNodes = [];

    data.forEach((datum) => {
      if (!ids.has(datum['subject_id'])) {
        ids.add(datum['subject_id']);
        allNodes.push({ id: datum['subject_id'], label: datum['subject_label'] });
      }
      if (!ids.has(datum['object_id'])) {
        ids.add(datum['object_id']);
        allNodes.push({ id: datum['object_id'], label: datum['object_label'] });
      }
    });

    return allNodes;
  }

  function formatEdges(data) {
    return data.map((datum) => {
      return {
        from: datum['subject_id'],
        to: datum['object_id'],
        label: datum['property_label']
      };
    });
  }

  function renderGraph(data) {
    // create nodes
    var allNodes = formatNodes(data);
    var nodes = new vis.DataSet(allNodes);

    // create edges
    var allEdges = formatEdges(data);
    var edges = new vis.DataSet(allEdges);

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
      }
    };
    var network = new vis.Network(container, data, options);
  }

  onMount(async () => {
    if (browser) {
      renderGraph(data);
    }
  });
</script>

<main>
  <div id="mynetwork" />
</main>

<style>
  #mynetwork {
    width: 100%;
    height: 80vh;
    border: 1px solid lightgray;
  }
</style>
