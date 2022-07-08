<script>
  import { martha } from '$lib/data/networks_raw.js';
  import NetworkGraph from '$lib/components/network_vis.svelte';
  import { formatNetworkGraphDataForVisJs } from '$lib/common/wiki_queries';

  let data = formatNetworkGraphDataForVisJs(martha);
</script>

<NetworkGraph {data} />
