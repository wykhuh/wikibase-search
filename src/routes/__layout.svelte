<script>
  import { base } from '$app/paths';
</script>

<nav class="navbar" aria-label="main navigation">
  <div class="navbar-menu  is-active">
    <a href={`${base}/`} class="navbar-item">Home</a>
    <a href={`${base}/linked_data`} class="navbar-item">Linked Data</a>
    <a href={`${base}/linked_data_graph`} class="navbar-item">Linked Data Graph</a>
    <a href={`${base}/import_wikidata`} class="navbar-item">Import Wikidata</a>
  </div>
</nav>

<section class="main">
  <slot />
</section>

<style>
  nav {
    border-bottom: 1px solid #999;
  }

  .main {
    margin-top: 2rem;
  }
</style>
