<script context="module">
  export async function load({ params, url }) {
    const caTable = url.searchParams.get('table') || 'ca_entities';
    const caType = url.searchParams.get('type') || 'individual';

    return {
      props: {
        id: Number(params.id),
        caTable,
        caType
      }
    };
  }
</script>

<script>
  import { onMount } from 'svelte';

  import { getEntity, getArtisticWork } from '$lib/common/graphql_queries';
  import { searchKeyword, formatWikiCollectiveAccessMapping } from '$lib/common/wiki_queries';
  import WikidataImport from '$lib/components/wikidata_import.svelte';
  import WikidataCreate from '$lib/components/wikidata_create.svelte';
  import rawMapping from '$lib/data/ca_wikidata_mapping.csv';
  import { printJson } from '$lib/common/utils';

  export let id;
  export let caTable;
  export let caType;

  let caRecord = {};
  let searchResults = [];
  let showMatches = false;
  let currentTab = 'import';
  let mapping = formatWikiCollectiveAccessMapping(rawMapping, caTable);
  let allowCreate = false;
  let mounted = false;

  $: if (mounted) {
    fetchRecord(id);
  }

  async function fetchRecord(id) {
    // load collective access record for given id
    let codes = Object.values(mapping);

    if (caTable === 'ca_entities' && caType === 'individual') {
      try {
        caRecord = await getEntity(id, codes);
      } catch (error) {
        caRecord = {};
      }
    } else if (caTable === 'ca_entities' && caType === 'organization') {
      try {
        caRecord = await getEntity(id, codes);
      } catch (error) {
        caRecord = {};
      }
    } else if (caTable === 'ca_occurrences' && caType === 'choreographic_work') {
      try {
        caRecord = await getArtisticWork(id, codes);
      } catch (error) {
        caRecord = {};
      }
    } else {
      throw new Error(`${caTable}.${caType} is not implemented`);
    }

    if (caRecord[`${caTable}.authority_wiki_data`] == undefined) {
      allowCreate = true;
    } else {
      allowCreate = caRecord[`${caTable}.authority_wiki_data`]['values'][0] == undefined;
    }

    // search for wikidata records that matches the name
    searchResults = await searchKeyword(caRecord['displayname'], 'wikibase');
    showMatches = true;
  }

  // ====================
  // life cycle
  // ====================

  onMount(async () => {
    mounted = true;
  });
</script>

<!-- {@html printJson(caRecord)} -->

<h1 class="title is-1">Import Dancing Digital Commons</h1>

<div class="tabs">
  <ul>
    <li class:is-active={currentTab == 'import'}>
      <a href="#import" on:click={() => (currentTab = 'import')}>Import DDC Data</a>
    </li>
    {#if allowCreate}
      <li class:is-active={currentTab == 'create'}>
        <a href="#create" on:click={() => (currentTab = 'create')}>Create Wikibase Records</a>
      </li>
    {/if}
  </ul>
</div>

{#if Object.keys(caRecord).length > 0}
  {#if currentTab == 'import'}
    <WikidataImport
      {id}
      {caTable}
      {caType}
      {caRecord}
      {searchResults}
      {showMatches}
      {mapping}
      targetWiki="wikibase"
    />
  {:else}
    <WikidataCreate
      {id}
      {caTable}
      {caType}
      {caRecord}
      {rawMapping}
      {mapping}
      targetWiki="wikibase"
    />
  {/if}
{/if}
