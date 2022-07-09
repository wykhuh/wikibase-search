<script>
  import { onMount } from 'svelte';
  import { getEntitiesWithoutWikidataId } from '$lib/common/graphql_queries';

  let records = [];
  let ca_table = 'ca_entities';
  let loading = false;

  onMount(async () => {
    if (ca_table === 'ca_entities') {
      loading = true;
      records = await getEntitiesWithoutWikidataId();
      loading = false;
    } else {
      throw new Error(`${ca_table} not implemented`);
    }
  });
</script>

<h1 class="title is-1">Import Wikidata Info</h1>

{#if loading}
  <p>Loading...</p>
{:else}
  <p>These Collective Access records do not have corresponding Wikidata records.</p>
  <ol>
    {#each records as record (record['id'])}
      <li><a href={`import_wikidata/${record['id']}`}>{record['Display name']}</a></li>
    {/each}
  </ol>
{/if}
