<script>
  // https://khromov.se/using-leaflet-with-sveltekit/

  import { onMount } from 'svelte';
  import { browser } from '$app/env';

  export let lat = 51.505;
  export let lon = -0.09;
  export let zoom = 13;
  export let id;

  onMount(async () => {
    if (browser) {
      const leaflet = await import('leaflet');

      const map = leaflet.map(`map_${id}`).setView([lat, lon], zoom);

      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          minZoom: 0,
          maxZoom: 20,
          maxNativeZoom: 19,
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
        .addTo(map);

      leaflet.marker([lat, lon]).addTo(map);
    }
  });
</script>

<main>
  <div id={`map_${id}`} class="map" />
</main>

<style>
  @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
  main .map {
    height: 200px;
    width: 350px;
    margin-bottom: 10px;
  }
</style>
