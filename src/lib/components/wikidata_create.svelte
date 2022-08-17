<script>
  import AutoComplete from 'simple-svelte-autocomplete';

  import { onMount } from 'svelte';
  import { envars } from '$lib/envars';
  import {
    searchKeyword,
    createWikiItem,
    formatWikidataRecord,
    formatCreateWikidataItem
  } from '$lib/common/wiki_queries';

  import { printJson, showAlerts } from '$lib/common/utils';

  export let id;
  export let caTable;
  export let caType;
  export let caRecord;
  export let mapping;
  export let rawMapping;

  // ====================
  // create wiki item
  // ====================

  let languages = { en: 'English' };
  let wikiRecord = {};
  let submitRecord = {};
  let alerts = [];
  let wikiInstance = envars.useWikibase ? 'local_wikibase' : 'wikidata';

  async function submitForm(e) {
    submitRecord = formatCreateWikidataItem(wikiRecord);
    let result = await createWikiItem(id, caTable, caType, submitRecord, wikiInstance);
    let text;
    if (envars.useWikibase) {
      text = 'Item record added to local Wikibase';
    } else {
      text = 'Item record added to Wikidata';
    }
    alerts = showAlerts(result, text);
  }

  // ====================
  // search
  // ====================

  async function loadOptions(keyword) {
    if (keyword.length > 1) {
      return searchKeyword(keyword);
    } else {
      return [];
    }
  }

  async function handleSelect(searchResult, claim, index) {
    if (searchResult == undefined) return;
    if (searchResult['id']) {
      wikiRecord['statements'][claim['property']][index]['property'] = claim['property'];
      wikiRecord['statements'][claim['property']][index]['data_type'] = claim['data_type'];
      wikiRecord['statements'][claim['property']][index]['data_value'] = claim['data_value'];
      wikiRecord['statements'][claim['property']][index]['property_label'] =
        claim['property_label'];
    }
  }

  // ====================
  // life cycle
  // ====================

  onMount(async () => {
    if (Object.keys(caRecord).length > 0) {
      wikiRecord = formatWikidataRecord(caRecord, rawMapping, mapping, caTable, caType);
    }
  });
</script>

{@html printJson(caRecord)}
<p>wikiRecord</p>
{@html printJson(wikiRecord)}

{#if alerts.length > 0}
  {#each alerts as alert}
    <p class={`notification ${alert.type}`}>{alert.text}</p>
  {/each}
{:else}
  {#if wikiRecord['labels']}
    {#each Object.entries(languages) as [code, lang], index (code)}
      <li>Label: <input bind:value={wikiRecord['labels'][code]} /></li>
      <li>Alias: <input bind:value={wikiRecord['aliases'][code]} /></li>
      <li>Description: <input bind:value={wikiRecord['descriptions'][code]} /></li>
    {/each}
  {/if}

  {#if wikiRecord['statements']}
    {#each Object.values(wikiRecord['statements']) as claimProperty}
      {#each claimProperty as claim, index (index)}
        <!-- {@html printJson(claim)} -->
        {#if claim['data_type'] == 'wikibase-item'}
          {claim.property_label}: {claim.data_value.value.label}
          <AutoComplete
            searchFunction={(e) => loadOptions(e, index)}
            delay="200"
            onChange={(e) => handleSelect(e, claim, index)}
            labelFieldName="search_label"
            placeholder="Search keyword"
            hideArrow={true}
            showClear={true}
            localFiltering={false}
            bind:selectedItem={claim}
          />
          <!-- <input type="hidden" name="temp" id="temp2" bind:value={ claim['data_type']}> -->
        {:else if claim['data_type'] == 'time'}
          <li>
            {claim.property_label}:
            <input type="text" bind:value={claim['data_value']['value']} />
          </li>
        {:else}
          <p>not implemented</p>
        {/if}
      {/each}
    {/each}
  {/if}
  <button class="button is-primary" on:click={submitForm}>Submit</button>
{/if}
