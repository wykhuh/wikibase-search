<script>
  import ADHC_logo from '$lib/images/ADHClogo.png';
  import ADance_logo from '$lib/images/CapstoneALogo-Dept.TheatreDance.jpg';
  import NEH_logo from '$lib/images/NEH-Preferred-Seal.jpg';
  import UT_logo from '$lib/images/RGB_formal_Fine_Arts.svg?raw';
  import whirl_logo from '$lib/images/whirlLogo.jpg';
  import SvgIcon from '../lib/components/svg_icon.svelte';
</script>

<h1 class="title is-1">
  Dancing Digital/No Boundaries Archive Project - Demo Wikidata Integration
</h1>

<p class="attribution">
  Co-directors Gesel Mason (University of Texas at Austin) and Rebecca Salzer (University of
  Alabama). Built by Whirl-i-Gig: Wai-Yin Kwan, Eve Perry, Seth Kaufman
</p>

<img class="logo" src={ADHC_logo} alt="University of Alabama Digital Humanities Center logo" />
<img class="logo" src={ADance_logo} alt="University of Alabama Arts and Science logo" />
<SvgIcon svg={UT_logo} class="logo-svg" />
<img class="logo" src={NEH_logo} alt="National Endownment for the Humanities logo" />
<img class="logo" src={whirl_logo} alt="Whirl-i-Gig logo" />

<ul>
  <li><a href="https://dancing-digital.wikibase.cloud">Dancing Digital wikibase</a></li>
</ul>

<style>
  .logo {
    max-height: 70px;
    display: inline-block;
    margin: 5px 10px;
  }

  :global(.logo-svg) {
    max-height: 60px;
    background-color: white;
    max-width: 350px;
    margin: 10px 10px;
  }

  .attribution {
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }
</style>
