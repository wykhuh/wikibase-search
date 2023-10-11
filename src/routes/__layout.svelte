<script>
  import { base } from '$app/paths';
  import ADHC_logo from '$lib/images/ADHClogo.png';
  import ADance_logo from '$lib/images/CapstoneALogo-Dept.TheatreDance.jpg';
  import NEH_logo from '$lib/images/NEH-Preferred-Seal.jpg';
  import UT_logo from '$lib/images/RGB_formal_Fine_Arts.svg?raw';
  import whirl_logo from '$lib/images/whirlLogo.jpg';
  import SvgIcon from '../lib/components/svg_icon.svelte';
</script>

<nav class="navbar" aria-label="main navigation">
  <div class="navbar-menu  is-active">
    <a href={`${base}/`} class="navbar-item">Home</a>
    <a href={`${base}/search_graph`} class="navbar-item">Search Graph</a>
    <a href={`${base}/compare_sources_graph`} class="navbar-item">Compare Sources</a>
    <a href={`${base}/wikidata`} class="navbar-item">Wikidata Integration</a>
    <a href={`${base}/relationships`} class="navbar-item">Import Relationships</a>
  </div>
</nav>

<section class="main">
  <slot />
</section>

<div class="columns">
  <footer>
    <p class="title">Dancing Digital/No Boundaries Archive Project - Demo Wikidata Integration</p>
    <p class="attribution">
      Co-directors Gesel Mason (University of Texas at Austin) and Rebecca Salzer (University of
      Alabama). Built by Whirl-i-Gig: Wai-Yin Kwan, Seth Kaufman
    </p>

    <SvgIcon svg={UT_logo} class="logo-svg" />
    <img class="logo" src={ADHC_logo} alt="University of Alabama Digital Humanities Center logo" />
    <img class="logo" src={ADance_logo} alt="University of Alabama Arts and Science logo" />
    <img class="logo" src={NEH_logo} alt="National Endownment for the Humanities logo" />
    <img class="logo" src={whirl_logo} alt="Whirl-i-Gig logo" />
  </footer>
</div>

<style>
  nav {
    border-bottom: 1px solid #999;
  }

  footer {
    padding: 3rem 1rem 1rem 1rem;
    width: 100%;
  }

  footer .title {
    font-size: 1.5rem;
  }

  footer .logo {
    max-height: 60px;
    display: inline-block;
    margin: 5px 10px;
  }

  footer :global(.logo-svg) {
    max-height: 60px;
    background-color: white;
    max-width: 370px;
    margin: 5px 10px;
  }

  footer .attribution {
    margin-bottom: 2rem;
  }

  .main {
    margin-top: 2rem;
  }
</style>
