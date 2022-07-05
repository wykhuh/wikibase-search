<script>
  import { martha } from '$lib/data/networks.js';
  import NetworkGraph from '$lib/components/network_vis.svelte';
</script>

<NetworkGraph data={martha} />
