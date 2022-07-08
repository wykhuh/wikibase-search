<script context="module">
  export async function load({ params }) {
    return {
      props: {
        id: params.id
      }
    };
  }
</script>

<script>
  import { onMount } from 'svelte';

  import { getEntity } from '$lib/common/graphql_queries';
  import { searchKeyword, fetchWikidataItem } from '$lib/common/wiki_queries';
  import ItemBasicInfo from '$lib/components/item_basic_info.svelte';
  import Claim from '$lib/components/claim.svelte';

  export let id;
  let record = {};
  let searchResults = [];
  let showPage = false;
  let currentItem = {};
  let languageCodesDisplay = [];
  let languageDisplayLimit = 5;
  let statements = [];
  let identifiers = [];
  let loading = false;
  let languagesCodeAll = new Set();
  let showAllLanguages = false;

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

  async function getOneItem(id) {
    loading = true;
    currentItem = await fetchWikidataItem(id);
    loading = false;
    displayItem(currentItem);
  }

  // ====================
  // life cycle
  // ====================

  onMount(async () => {
    record = await getEntity(id);
    searchResults = await searchKeyword(record.preferred_labels);
    showPage = true;
  });
</script>

{#if showPage}
  <h1 class="title is-1">Import Wikidata Info</h1>

  <h2 class="title is-2">{record.preferred_labels}</h2>

  {#if searchResults.length == 0}
    <p>No wikidata records found.</p>
  {:else}
    <table class="table">
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>ID</th>
        <th>Action</th>
      </tr>
      {#each searchResults as result}
        <tr>
          <td>{result['label']}</td>
          <td>{result['description']}</td>
          <td>{result['id']}</td>
          <td
            ><button class="button is-primary" on:click={() => getOneItem(result['id'])}
              >Preview</button
            ></td
          >
        </tr>
      {/each}
    </table>

    {#if currentItem['labels']}
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
    {#if loading}
      <p>Loading...</p>
    {/if}
  {/if}
{/if}
