<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { goto } from '$app/navigation';

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
  export let targetWiki='wikidata'

  // ====================
  // create wiki item
  // ====================

  let languages = { en: 'English' };
  let wikiRecord = {};
  let submitRecord = {};
  let alerts = [];
  let wikiInstance = envars.useWikibase ? 'local_wikibase' : 'wikidata';
  let importing = false

  $: loadWikiRecord(caRecord)

  async function submitForm(e) {
    importing = true
    submitRecord = formatCreateWikidataItem(wikiRecord);
    let result = await createWikiItem(id, caTable, caType, submitRecord, wikiInstance);
    importing = false

    let text;
    if (envars.useWikibase) {
      text = 'Record added to local Wikibase';
    } else {
      text = 'Record added to Wikidata';
    }
    alerts = showAlerts(result, text);
  }

  // ====================
  // misc
  // ====================


  function resetAlert() {
    alerts = [];
  }

  function loadWikiRecord(caRecord) {
    if (caRecord && Object.keys(caRecord).length > 0) {
      wikiRecord = formatWikidataRecord(caRecord, rawMapping, mapping, caTable, caType);
    }
  }

  function displayId(caRecord, field) {
    if(caRecord[`ca_entities.${field}`]) {
      return caRecord[`ca_entities.${field}`]['values'][0]
    } else {
      return ''
    }
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
  // prev next record
  // ====================

  function getPrevNextId(id, action) {
    let recordIds = JSON.parse(localStorage.getItem(`${caTable}.${caType}.ids`))
    let index = recordIds.indexOf(id)
    if (index === 0 && action === 'prev')  {
      return
    } else if (index + 1 === recordIds.length && action === 'next'){
      return
    } else if (action === 'next') {
      return recordIds[index + 1]
    } else {
      return recordIds[index - 1]
    }
  }


  async function changePrevNext(id, action) {
    resetAlert()

    let tmpId = getPrevNextId(id, action)
    if(tmpId == undefined) return

    if(targetWiki === 'wikidata') {
      goto(`/import_wikidata/${tmpId}?table=${caTable}&type=${caType}`)
    } else {
      goto(`/import_wikibase/${tmpId}?table=${caTable}&type=${caType}`)
    }
  }

  // ====================
  // life cycle
  // ====================

  onMount(async () => {
    loadWikiRecord()
  });
</script>

<!-- {@html printJson(caRecord)} -->
<!-- <p>wikiRecord</p>
{@html printJson(wikiRecord)} -->

{#if importing}
  <p class={`notification is-warning`}>Importing...</p>
{/if}

{#each alerts as alert}
  <p class={`notification ${alert.type}`}>{alert.text}</p>
{/each}

<ul class="subnav">
  <li><span on:click={()=>changePrevNext(id, 'prev')}>Prev</span></li>
  <li><span on:click={()=>changePrevNext(id, 'next')}>Next</span></li>
  <li><a href="/wikidata">Index</a></li>
</ul>

<h2 class="title is-2">{caRecord['displayname']}</h2>
<p>Collective Access id: {caRecord.id},
  Wikidata id: {displayId(caRecord, 'authority_wikipedia')},
  Dancing Digital Commons id: {displayId(caRecord, 'authority_wiki_data')}
</p>


{#if alerts.length == 0 && caRecord['ca_entities.authority_wiki_data'] == undefined}
  {#if wikiRecord['labels']}
    {#each Object.entries(languages) as [code, lang], index (code)}
      <div class="field">
        <label class="label" for="label">Label</label>
        <div class="control">
          <input class="input" name="label" bind:value={wikiRecord['labels'][code]} />
        </div>
      </div>
      <div class="field">
        <label class="label" for="alias">Alias</label>
        <div class="control">
          <input class="input" name="alias" bind:value={wikiRecord['aliases'][code]} />
        </div>
      </div>
      <div class="field">
        <label class="label" for="description">Description</label>
        <div class="control">
          <input class="input" name="description" bind:value={wikiRecord['descriptions'][code]} />
        </div>
      </div>
    {/each}
  {/if}

  {#if wikiRecord['statements']}
    {#each Object.values(wikiRecord['statements']) as claimProperty}
      {#each claimProperty as claim, index (index)}
        <!-- {@html printJson(claim)} -->
        {#if claim['data_type'] == 'wikibase-item'}
          <label class="label" for="">{claim.property_label}: {claim.data_value.value.label}</label>
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
          <div class="field">
            <label class="label" for="">{claim.property_label}</label>
            <div class="control">
              <input class="input" type="text" bind:value={claim['data_value']['value']} />
            </div>
          </div>
        {:else}
          <p>not implemented</p>
        {/if}
      {/each}
    {/each}
  {/if}
  <button class="submit button is-primary" on:click={submitForm}>Submit</button>
{/if}

<style>
  .subnav {
    margin-bottom: 1rem;
  }
  .subnav li{
    display: inline-block;
    margin-right: 1rem;
  }

  .subnav span {
    color: blue;
    cursor: pointer;
  }

  .submit {
    margin-top: 1rem;
  }
</style>
