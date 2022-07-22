<script>
  import { onMount } from 'svelte';
  import { getEntities } from '$lib/common/graphql_queries';

  let records = [];
  let ca_table = 'ca_entities';
  let loading = false;

  onMount(async () => {
    if (ca_table === 'ca_entities') {
      loading = true;
      records = await getEntities();
      loading = false;
    } else {
      throw new Error(`${ca_table} not implemented`);
    }
  });
</script>

<h1 class="title is-1">Wikidata Integration</h1>
{#if loading}
  <p>Loading...</p>
{:else}
  <table class="table">
    <tr>
      <th>Name</th>
      <th>Import Wikidata</th>
      <th>Wikidata.org link</th>
      <th>Wikibase link</th>
      <th>Network Graph</th>
    </tr>
    {#each records as record (record['id'])}
      <tr>
        <td>
          <a href={`entities/${record['id']}`}>{record['Display name']}</a>
        </td>
        <td>
          <a href={`import_wikidata/${record['id']}`}>Import</a>
        </td>
        <td>
          {#if record['Entity Authority Identifier']}
            <a href={`https://www.wikidata.org/wiki/${record['Entity Authority Identifier']}`}
              >{record['Entity Authority Identifier']}</a
            >
          {/if}
        </td>
        <td>
          <!-- TODO: change notes field to ??? -->
          {#if record['Notes (internal use only)']}
            <a href={`http://whirl.mine.nu:8888/wiki/Item:${record['Notes (internal use only)']}`}
              >{record['Notes (internal use only)']}</a
            >
          {/if}
        </td>
        <td>
          {#if record['Entity Authority Identifier']}
            <a href={`linked_data_graph/${record['id']}`}>Graph</a>
          {/if}
        </td>
      </tr>
    {/each}
  </table>
{/if}
