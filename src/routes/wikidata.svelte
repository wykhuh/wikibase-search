<script>
  import { onMount } from 'svelte';
  import { getEntities, getArtisticWorks } from '$lib/common/graphql_queries';
  import { formatWikiCollectiveAccessMapping } from '$lib/common/wiki_queries';
  import { envars } from '$lib/envars';

  import rawMapping from '$lib/data/ca_wikidata_mapping.csv';

  let records = [];
  let caTable;
  let caType;
  let caTableType;
  let loading = false;
  let mapping;

  let tables = [
    { label: 'People', table: 'ca_entities', type: 'individual' },
    { label: 'Organization', table: 'ca_entities', type: 'organization' },
    { label: 'Artistic Works', table: 'ca_occurrences', type: 'choreographic_work' }
  ];

  async function selectTable(event) {
    caTableType
    caTable
    caType
    loading = true;
    if (caTableType === 'ca_entities.individual') {
      caTable = 'ca_entities'
      caType = 'individual'
      records = await getEntities(caType);
    } else if (caTableType === 'ca_entities.organization') {
      caTable = 'ca_entities'
      caType = 'organization'
      records = await getEntities(caType);
    } else if (caTableType === 'ca_occurrences.choreographic_work') {
      caTable = 'ca_occurrences'
      caType = 'choreographic_work'
      records = await getArtisticWorks();
    } else {
      throw new Error(`${caTable} ${caType} is not implemented`);
    }

    mapping = formatWikiCollectiveAccessMapping(rawMapping, caTable);
    loading = false;
    localStorage.setItem('wiki_integration_table', caTable);
    localStorage.setItem('wiki_integration_type', caType);
  }

  function formatLink(record, base, field) {
    return base + record[mapping[field]];
  }

  onMount(async () => {
    caTable = localStorage.getItem('wiki_integration_table') || 'ca_entities';
    caType = localStorage.getItem('wiki_integration_type') || 'individual';
    caTableType = `${caTable}.${caType}`;
    mapping = formatWikiCollectiveAccessMapping(rawMapping, caTable);
    loading = true;

    if (caTable === 'ca_entities' && caType === 'individual') {
      records = await getEntities('individual');
    } else if (caTable === 'ca_entities' && caType === 'organization') {
      records = await getEntities('organization');
    } else if (caTable === 'ca_occurrences' && caType === 'choreographic_work') {
      records = await getArtisticWorks();
    } else {
      throw new Error(`${caTable} ${caType} is not implemented`);
    }

    localStorage.setItem(`${caTable}.${caType}.ids`, JSON.stringify(records.map(r => r.id)))
    loading = false;
  });
</script>

<h1 class="title is-1">Wikidata Integration</h1>
{#if loading}
  <p>Loading...</p>
{:else}
  <select bind:value={caTableType} on:change={selectTable}>
    {#each tables as table}
      <option value={`${table.table}.${table.type}`}>{table.label}</option>
    {/each}
  </select>
  <table class="table">
    <tr>
      <th>Name (CollectiveAccess)</th>
      <th>Wikidata.org</th>
      <th>Dancing Digital Commons</th>
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
          <a class="import-link" href={`import_wikidata/${record['id']}?table=${caTable}&type=${caType}`}>Import</a>

          {#if record[mapping['qid']]}
            <a href={formatLink(record, 'https://www.wikidata.org/wiki/', 'qid')}
              >{record[mapping['qid']]}</a
            >
          {/if}
        </td>
        <td>
          <a class="import-link" href={`import_wikibase/${record['id']}?table=${caTable}&type=${caType}`}>Import</a>

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

<style>
  .import-link {
    margin-right: 0.7rem;
  }
</style>
