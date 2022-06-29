<nav class="navbar" aria-label="main navigation">
  <div class="navbar-menu  is-active">
    <a href="/" class="navbar-item">Home</a>
    <a href="/linked_data" class="navbar-item">Linked Data</a>
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
