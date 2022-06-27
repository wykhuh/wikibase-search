<script>
  import Subclaim from '$lib/components/subclaim.svelte';
  import ClaimValue from '$lib/components/claim_value.svelte';
  import WikidataLink from '$lib/components/wikidata_link.svelte';

  export let claim;
</script>

<table class="table  is-bordered is-fullwidth">
  <tr>
    <td class="property">{claim['property_value']} </td>
    <td>
      <ClaimValue value={claim} />
      <WikidataLink value={claim} />

      {#if claim['qualifiers']}
        <section>
          <div class="section-title">Qualifiers</div>
          <table class="table is-fullwidth">
            {#each Object.entries(claim['qualifiers']) as [pid, values], index (pid)}
              {#each values as value}
                <Subclaim {value} />
              {/each}
            {/each}
          </table>
        </section>
      {/if}
      {#if claim['references']}
        <section>
          <div class="section-title">References</div>
          {#each claim['references'] as reference}
            <table class="table is-fullwidth reference-table">
              {#each Object.entries(reference) as [pid, values], index (pid)}
                {#each values as value}
                  <Subclaim {value} />
                {/each}
              {/each}
            </table>
          {/each}
        </section>
      {/if}
      <table>
        <tr />
      </table>
    </td>
  </tr>
</table>

<style>
  .reference-table {
    background-color: #f5f5f5;
    margin-bottom: 7px;
  }
  td.property {
    width: 25%;
  }

  section {
    margin-top: 1rem;
  }

  .section-title {
    font-weight: 400;
  }
</style>
