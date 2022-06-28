<script context="module">
  export async function load({ params }) {
    let currentId = params['id'];
    return { props: { currentId } };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import Claim from '$lib/components/claim.svelte';
  import ItemBasicInfo from '$lib/components/item_basic_info.svelte';

  export let currentId;

  let API_URL = 'http://localhost:8000';

  let currentItem = null;
  let currentLabel = null;
  let loading = false;
  let languagesCodeAll = new Set();
  let languageCodesDisplay = [];
  let languageDisplayLimit = 5;
  let statements = [];
  let identifiers = [];
  let showAllLanguages = false;
  let errorMessage = null;

  // ====================
  // display record
  // ====================

  function toggleAllLanguages() {
    showAllLanguages = !showAllLanguages;

    if (showAllLanguages) {
      languageCodesDisplay = languagesCodeAll;
    } else {
      languageCodesDisplay = languagesCodeAll.slice(0, languageDisplayLimit);
    }
  }

  function setlanguageCodesDisplay(item) {
    let languages = item['languages'];
    let tmp = Object.keys(languages);
    // ensure 'en' is first language shown
    if (languages['en']) {
      let en_idx = tmp.indexOf('en');
      tmp = ['en', ...tmp.slice(0, en_idx), ...tmp.slice(en_idx + 1)];
    }

    languagesCodeAll = tmp;
    languageCodesDisplay = tmp.slice(0, languageDisplayLimit);
  }

  function displayItem(item) {
    statements = (item['statements'] && Object.values(item['statements'])) || [];
    identifiers = (item['identifiers'] && Object.values(item['identifiers'])) || [];

    setlanguageCodesDisplay(item);
  }

  // ====================
  // fetch records
  // ====================

  async function getOneItem() {
    loading = true;
    const url = API_URL + '/items/' + currentId;
    const response = await fetch(url);
    loading = false;

    if (response.ok) {
      let jsonData = await response.json();
      currentItem = jsonData['data'];
      currentId = jsonData['id'];
      currentLabel = jsonData['label'];
      displayItem(currentItem);
    } else if (response.status == 404) {
      errorMessage = 'Item not found.';
    }
  }

  // ====================
  // life cycle
  // ====================

  onMount(async () => {
    if (browser) {
      await getOneItem();
    }
  });
</script>

{#if loading}
  <h1 class="title is-2">Loading...</h1>
{/if}

{#if errorMessage}
  <h1 class="title is-2">{errorMessage}</h1>
{/if}

{#if currentItem}
  <h1 class="title is-2">{currentLabel} ({currentId})</h1>

  <ItemBasicInfo item={currentItem} languageCodes={languageCodesDisplay} />

  <button class="button is-primary is-light" on:click={toggleAllLanguages}>
    {#if showAllLanguages}
      Fewer languages
    {:else}
      All entered languages
    {/if}
  </button>

  <h3 class="title is-3">Statements</h3>
  {#each statements as claimProperty}
    {#each claimProperty as claim}
      <Claim {claim} />
    {/each}
  {/each}

  <h3 class="title is-3">Identifiers</h3>
  {#each identifiers as claimProperty}
    {#each claimProperty as claim}
      <Claim {claim} />
    {/each}
  {/each}
{/if}
