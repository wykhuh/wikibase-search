<script>
  import { onMount } from 'svelte';
  import { getEntities, getArtisticWorks } from '$lib/common/graphql_queries';
  import { formatWikiCollectiveAccessMapping } from '$lib/common/wiki_queries';
  import { envars } from '$lib/envars';

  import rawMapping from '$lib/data/ca_wikidata_mapping.csv';

  let records = [];
  let caTable;
  let caType;
  let loading = false;
  let mapping;

  let tables = [
    { label: 'People', table: 'ca_entities', type: 'individual' },
    { label: 'Artistic Works', table: 'ca_occurrences', type: 'choreographic_work' }
  ];

  async function selectTable(event) {
    if (caTable === 'ca_entities') {
      caType = 'individual';
      loading = true;
      records = await getEntities();
      mapping = formatWikiCollectiveAccessMapping(rawMapping, caTable);
      loading = false;
    } else {
      caType = 'choreographic_work';
      loading = true;
      records = await getArtisticWorks();
      mapping = formatWikiCollectiveAccessMapping(rawMapping, caTable);
      loading = false;
    }
    localStorage.setItem('wiki_integration_table', caTable);
    localStorage.setItem('wiki_integration_type', caType);
  }

  function formatLink(record, base, field) {
    return base + record[mapping[field]];
  }

  onMount(async () => {
    caTable = localStorage.getItem('wiki_integration_table') || 'ca_entities';
    caType = localStorage.getItem('wiki_integration_type') || 'individual';
    mapping = formatWikiCollectiveAccessMapping(rawMapping, caTable);

    if (caTable === 'ca_entities' && caType === 'individual') {
      loading = true;
      records = await getEntities();
      loading = false;
    } else if (caTable === 'ca_occurrences' && caType === 'choreographic_work') {
      loading = true;
      records = await getArtisticWorks();
      loading = false;
    } else {
      throw new Error(`${caTable} is not implemented`);
    }
  });
</script>

<h1 class="title is-1">Wikidata Integration</h1>
{#if loading}
  <p>Loading...</p>
{:else}
  <select bind:value={caTable} on:change={selectTable}>
    {#each tables as table}
      <option value={table.table}>{table.label}</option>
    {/each}
  </select>
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
          {#if caTable === 'ca_entities'}
            <a href={`${envars.caUrl}/index.php/editor/entities/EntityEditor/Edit/entity_id/${record['id']}`}
              >{record['ca_entities.preferred_labels.displayname']}</a
            >
          {:else}
            <a href={`${envars.caUrl}/index.php/editor/occurrences/OccurrenceEditor/Edit/occurrence_id/${record['id']}`}>{record[caTable + '.preferred_labels']}</a>
          {/if}
        </td>
        <td>
          <a href={`import_wikidata/${record['id']}?table=${caTable}&type=${caType}`}>Import</a>
        </td>
        <td>
          {#if record[mapping['qid']]}
            <a href={formatLink(record, 'https://www.wikidata.org/wiki/', 'qid')}
              >{record[mapping['qid']]}</a
            >
          {/if}
        </td>
        <td>
          {#if record[mapping['qid_local']]}
            <a href={formatLink(record, 'http://whirl.mine.nu:8888/wiki/Item:', 'qid_local')}
              >{record[mapping['qid_local']]}</a
            >
          {/if}
        </td>
        <td>
          {#if record[mapping['qid']]}
            <a href={`linked_data_graph/${record['id']}?table=${caTable}&type=${caType}`}>Graph</a>
          {/if}
        </td>
      </tr>
    {/each}
  </table>
{/if}
