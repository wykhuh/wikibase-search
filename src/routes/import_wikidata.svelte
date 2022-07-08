<script>
  import { onMount } from 'svelte';
  import { getEntitiesWithoutWikidataId } from '$lib/common/graphql_queries';

  let records = [];
  let ca_table = 'ca_entities';

  onMount(async () => {
    if (ca_table === 'ca_entities') {
      records = await getEntitiesWithoutWikidataId();
    } else {
      throw new Error(`${ca_table} not implemented`);
    }
  });
</script>

<h1 class="title is-1">Import Wikidata Info</h1>

<ol>
  {#each records as record (record['id'])}
    <li><a href={`import_wikidata/${record['id']}`}>{record['Display name']}</a></li>
  {/each}
</ol>
