<script>
  import { onMount } from 'svelte';
  import {
    fetchRecordsForTableType,
    getEntityArtisticWorkRelationships
  } from '$lib/common/graphql_queries';
  import { formatWikiCollectiveAccessMapping } from '$lib/common/wiki_queries';
  import { envars } from '$lib/envars';
  import { printJson } from '$lib/common/utils';

  import rawMapping from '$lib/data/ca_wikidata_mapping.csv';

  let records = [];
  let relationships = {};
  let caTable;
  let caType;
  let caTableType;
  let loading = false;
  let mapping;

  let tables = [
    { label: 'People', table: 'ca_entities', type: 'individual' },
    { label: 'Organization', table: 'ca_entities', type: 'organization' }
  ];

  async function selectTable(event) {
    let parts = caTableType.split('.');
    caTable = parts[0];
    caType = parts[1];

    loading = true;
    records = await fetchRecordsForTableType(caTable, caType);
    mapping = formatWikiCollectiveAccessMapping(rawMapping, caTable);
    loading = false;

    saveTableType();
  }

  function saveTableType() {
    localStorage.setItem('wiki_integration_table', caTable);
    localStorage.setItem('wiki_integration_type', caType);
    localStorage.setItem(`${caTable}.${caType}.ids`, JSON.stringify(records.map((r) => r.id)));
  }

  function formatLink(record, base, field) {
    return base + record[mapping[field]];
  }

  async function getRelationships() {
    let calls = [];
    let results = [];
    try {
      records.forEach((r) => calls.push(getEntityArtisticWorkRelationships(r['idno'])));
      results = await Promise.all(calls);
    } catch (e) {
      console.log(e);
    }

    results.forEach((r) => {
      if (r.length > 0) {
        relationships[r[0]['subject_id']] = r;
      }
    });
  }

  onMount(async () => {
    caTable = localStorage.getItem('wiki_integration_table') || 'ca_entities';
    caType = localStorage.getItem('wiki_integration_type') || 'individual';
    caTableType = `${caTable}.${caType}`;

    loading = true;
    records = await fetchRecordsForTableType(caTable, caType);
    mapping = formatWikiCollectiveAccessMapping(rawMapping, caTable);

    await getRelationships();

    loading = false;

    saveTableType();
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
      <th>Person</th>
      <th>Relationship</th>
      <th>Work</th>
    </tr>
    {#each records as record (record['id'])}
      {#if relationships[record['id']]}
        {#each relationships[record['id']] as relationship}
          <tr>
            <td>
              {#if caTable === 'ca_entities'}
                <a
                  href={`${envars.caUrl}/index.php/editor/entities/EntityEditor/Edit/entity_id/${record['id']}`}
                  >{record['ca_entities.preferred_labels.displayname']}</a
                >
              {:else}
                <a
                  href={`${envars.caUrl}/index.php/editor/occurrences/OccurrenceEditor/Edit/occurrence_id/${record['id']}`}
                  >{record[caTable + '.preferred_labels']}</a
                >
              {/if}

              {#if record['ca_entities.authority_wiki_data'] == undefined}
                <span class="has-text-danger">WARNING: Not in Dancing Digital</span>
              {/if}
            </td>
            <td>{relationship['relationship_type']}</td>
            <td>
              {relationship['target_label']}

              {#if relationship['target_wikibase_id'] == undefined}
                <span class="has-text-danger">WARNING: Not in Dancing Digital</span>
              {/if}
            </td>
          </tr>
        {/each}
      {/if}
    {/each}
  </table>
{/if}

{@html printJson(relationships)}

<style>
  .import-link {
    margin-right: 0.7rem;
  }
</style>
