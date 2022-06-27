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
  let currentItem = null;
  let currentLabel = null;
  let loading = false;
  let languagesAll = new Set();
  let languagesDisplay = [];
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
      // ensure 'en' is first item in languagesDisplay
      let tmp = languagesAll;
      tmp.delete('en');
      languagesDisplay = ['en', ...tmp];
    } else {
      setLanguagesDisplay();
    }
  }

  function setLanguagesDisplay() {
    // ensure 'en' is first item in languagesDisplay
    let tmp = ['en'];
    languagesAll.forEach((lang) => {
      if (lang !== 'en' && tmp.length < 5) {
        tmp.push(lang);
      }
    });
    languagesDisplay = tmp;
  }

  function mydisplayItem(item) {
    statements = (item['statements'] && Object.values(item['statements'])) || [];
    identifiers = (item['identifiers'] && Object.values(item['identifiers'])) || [];
    ['labels', 'descriptions', 'aliases'].forEach((type) => {
      if (item[type]) {
        Object.keys(item[type]).forEach((lang) => languagesAll.add(lang));
      }
    });
    setLanguagesDisplay();
  }

  // ====================
  // fetch records
  // ====================

  async function getOneItem() {
    loading = true;
    const url = 'http://localhost:8000/items/' + currentId;
    const response = await fetch(url);
    loading = false;

    if (response.ok) {
      let jsonData = await response.json();
      currentItem = jsonData['data'];
      currentId = jsonData['id'];
      currentLabel = jsonData['label'];
      mydisplayItem(currentItem);
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

  <ItemBasicInfo item={currentItem} languages={languagesDisplay} />

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
