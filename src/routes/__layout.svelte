<script>
  import { base } from '$app/paths';
</script>

<nav class="navbar" aria-label="main navigation">
  <div class="navbar-menu  is-active">
    <a href={`${base}/`} class="navbar-item">Home</a>
    <a href={`${base}/search_graph`} class="navbar-item">Search Graph</a>
    <a href={`${base}/compare_sources_graph`} class="navbar-item">Compare Sources</a>
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
