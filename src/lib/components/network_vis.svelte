<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/env';

  export let data;

  function renderGraph(data) {
    var nodes = new vis.DataSet(data['nodes']);
    var edges = new vis.DataSet(data['edges']);

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
      configure: {
        filter: function (option, path) {
          if (path.indexOf('physics') !== -1) {
            return true;
          }
          if (path.indexOf('smooth') !== -1 || option === 'smooth') {
            return true;
          }
          return false;
        },
        container: document.getElementById('config')
      },
      interaction: { hover: true }
    };
    var network = new vis.Network(container, data, options);
    setupEvents(network);
  }

  function setupEvents(network) {
    network.on('click', function (params) {
      params.event = '[original event]';
      document.getElementById('eventSpanHeading').innerText = 'Click event:';
      document.getElementById('eventSpanContent').innerText = JSON.stringify(params, null, 4);
      console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
    });
    network.on('doubleClick', function (params) {
      params.event = '[original event]';
      document.getElementById('eventSpanHeading').innerText = 'doubleClick event:';
      document.getElementById('eventSpanContent').innerText = JSON.stringify(params, null, 4);
    });
    network.on('oncontext', function (params) {
      params.event = '[original event]';
      document.getElementById('eventSpanHeading').innerText = 'oncontext (right click) event:';
      document.getElementById('eventSpanContent').innerText = JSON.stringify(params, null, 4);
    });
    network.on('dragStart', function (params) {
      // There's no point in displaying this event on screen, it gets immediately overwritten
      params.event = '[original event]';
      console.log('dragStart Event:', params);
      console.log('dragStart event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
    });
    network.on('dragging', function (params) {
      params.event = '[original event]';
      document.getElementById('eventSpanHeading').innerText = 'dragging event:';
      document.getElementById('eventSpanContent').innerText = JSON.stringify(params, null, 4);
    });
    network.on('dragEnd', function (params) {
      params.event = '[original event]';
      document.getElementById('eventSpanHeading').innerText = 'dragEnd event:';
      document.getElementById('eventSpanContent').innerText = JSON.stringify(params, null, 4);
      console.log('dragEnd Event:', params);
      console.log('dragEnd event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
    });
    network.on('controlNodeDragging', function (params) {
      params.event = '[original event]';
      document.getElementById('eventSpanHeading').innerText = 'control node dragging event:';
      document.getElementById('eventSpanContent').innerText = JSON.stringify(params, null, 4);
    });
    network.on('controlNodeDragEnd', function (params) {
      params.event = '[original event]';
      document.getElementById('eventSpanHeading').innerText = 'control node drag end event:';
      document.getElementById('eventSpanContent').innerText = JSON.stringify(params, null, 4);
      console.log('controlNodeDragEnd Event:', params);
    });
    network.on('zoom', function (params) {
      document.getElementById('eventSpanHeading').innerText = 'zoom event:';
      document.getElementById('eventSpanContent').innerText = JSON.stringify(params, null, 4);
    });
    network.on('showPopup', function (params) {
      document.getElementById('eventSpanHeading').innerText = 'showPopup event: ';
      document.getElementById('eventSpanContent').innerText = JSON.stringify(params, null, 4);
    });
    network.on('hidePopup', function () {
      console.log('hidePopup Event');
    });
    network.on('select', function (params) {
      console.log('select Event:', params);
    });
    network.on('selectNode', function (params) {
      console.log('selectNode Event:', params);
    });
    network.on('selectEdge', function (params) {
      console.log('selectEdge Event:', params);
    });
    network.on('deselectNode', function (params) {
      console.log('deselectNode Event:', params);
    });
    network.on('deselectEdge', function (params) {
      console.log('deselectEdge Event:', params);
    });
    network.on('hoverNode', function (params) {
      console.log('hoverNode Event:', params);
    });
    network.on('hoverEdge', function (params) {
      console.log('hoverEdge Event:', params);
    });
    network.on('blurNode', function (params) {
      console.log('blurNode Event:', params);
    });
    network.on('blurEdge', function (params) {
      console.log('blurEdge Event:', params);
    });
  }

  onMount(async () => {
    if (browser) {
      renderGraph(data);
    }
  });
</script>

<main>
  <div id="mynetwork" />

  <h2 id="eventSpanHeading">Events</h2>
  <pre id="eventSpanContent" />

  <div id="config" />
  <p id="selection" />
</main>

<style>
  #mynetwork {
    width: 100%;
    height: 80vh;
    border: 1px solid lightgray;
  }
</style>
