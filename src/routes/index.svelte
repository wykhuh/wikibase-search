<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { onMount } from 'svelte';
  import Subclaim from '$lib/components/subclaim.svelte';
  import ClaimValue from '$lib/components/claim_value.svelte';
  import WikidataLink from '$lib/components/wikidata_link.svelte';

  let testIds = {
    Q5: 'human',
    Q30: 'United States',
    Q487604: 'Martha Graham',
    Q16973731: 'Dianne McIntyre',
    Q753828: 'Essex',
    Q111420520: 'Karl Hirsch',
    Q76: 'Barack Obama'
  };
  let testId = 'Q753828';

  let foo = '';
  let currentItem = null;
  let currentQid = testId;
  let currentLabel = testIds[testId];
  let loading = false;
  let languagesAll = new Set();
  let languagesDisplay = [];
  let labels = {};
  let descriptions = {};
  let aliases = {};
  let claims = [];
  let showAllLanguages = false;

  function toggleAllLanguages() {
    showAllLanguages = !showAllLanguages;

    if (showAllLanguages) {
      languagesDisplay = [...languagesAll];
    } else {
      limitLanguagesDisplay();
    }
  }

  function limitLanguagesDisplay() {
    languagesDisplay = ['en'];
    languagesAll.forEach((lang) => {
      if (lang !== 'en' && languagesDisplay.length < 5) {
        languagesDisplay = [...languagesDisplay, lang];
      }
    });
  }

  function displayItem(item) {
    descriptions = item['descriptions'] || {};
    aliases = item['aliases'] || {};
    labels = item['labels'] || {};
    claims = (item['claims'] && Object.values(item['claims'])) || [];

    ['labels', 'descriptions', 'aliases'].forEach((type) => {
      if (item[type]) {
        Object.keys(item[type]).forEach((lang) => languagesAll.add(lang));
      }
    });
    limitLanguagesDisplay();
  }

  async function loadOptions(keyword) {
    if (keyword.length > 2) {
      const url = 'http://localhost:8000/search?keyword=' + keyword;
      const response = await fetch(url);
      console.log('search for ' + keyword);
      return await response.json();
    }
  }

  async function handleSelect(selectedOption) {
    if (!selectedOption) return;
    loading = true;
    currentItem = null;
    currentQid = selectedOption['id'];
    currentLabel = selectedOption['label'];
    const url = 'http://localhost:8000/items/' + currentQid;
    const response = await fetch(url);
    currentItem = await response.json();
    displayItem(currentItem);
    loading = false;
  }

  onMount(async () => {
    if (!testId) return;

    loading = true;
    const url = 'http://localhost:8000/items/' + currentQid;
    const response = await fetch(url);
    currentItem = await response.json();
    displayItem(currentItem);
    loading = false;
  });
</script>

<h1 class="title is-1">Wikidata Demo</h1>

<AutoComplete
  searchFunction={loadOptions}
  onChange={handleSelect}
  labelFieldName="label"
  valueFieldName="label"
  placeholder="Search keyword"
  hideArrow={true}
  bind:selectedItem={foo}
/>

{#if currentLabel}
  <h2 class="title is-2">{currentLabel} ({currentQid})</h2>
{/if}

{#if loading}
  <h2 class="title is-2">Loading...</h2>
{/if}

{#if currentItem}
  <table class="table  is-bordered is-fullwidth">
    <thead>
      <tr>
        <th>Language</th>
        <th>Label</th>
        <th>Description</th>
        <th>Also known as</th>
      </tr>
    </thead>
    <tbody>
      {#each languagesDisplay as lang}
        <tr>
          <td>{lang}</td>
          <td
            >{#if labels[lang]}{labels[lang]}{/if}</td
          >
          <td
            >{#if descriptions[lang]}{descriptions[lang]}{/if}</td
          >
          <td
            >{#if aliases[lang]}{aliases[lang]}{/if}</td
          >
        </tr>
      {/each}
    </tbody>
  </table>

  <button class="button is-primary is-light" on:click={toggleAllLanguages}>
    {#if showAllLanguages}
      Fewer languages
    {:else}
      All entered languages
    {/if}
  </button>

  <h3 class="title is-3">Statements</h3>

  <table class="table  is-bordered is-fullwidth">
    <tr>
      <td class="property">wikidata.org link</td>
      <td
        ><a href="https://www.wikidata.org/wiki/{currentQid}"
          >https://www.wikidata.org/wiki/{currentQid}</a
        ></td
      >
    </tr>
  </table>

  {#each claims as claimProperty}
    {#each claimProperty as claim}
      <!-- {JSON.stringify(claim)} -->
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
                <table class="table is-fullwidth">
                  {#each claim['references'] as reference}
                    {#each Object.entries(reference) as [pid, values], index (pid)}
                      {#each values as value}
                        <Subclaim {value} />
                      {/each}
                    {/each}
                  {/each}
                </table>
              </section>
            {/if}
            <table>
              <tr />
            </table>
          </td>
        </tr>
      </table>
    {/each}
  {/each}
{/if}

<style>
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
