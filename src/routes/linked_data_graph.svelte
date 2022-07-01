<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { onMount } from 'svelte';

  import {
    searchKeyword
  } from '$lib/common/queries';


  let searchItem = {};
  // value of search term
  let itemId = null;
  let itemLabel = null;




  // ====================
  // autocomplete
  // ====================

  async function loadOptions(keyword) {
    if (keyword) {
      itemId = null;
      itemLabel = null;
    }

    if (keyword.length > 1) {
      let json = await searchKeyword(keyword);
      return json;
    }
  }

  async function handleSelect(selectedOption) {
    if (Object.keys(selectedOption).length == 0) return;

    itemId = selectedOption['id'];
    itemLabel = selectedOption['label'];

  }


  // ====================
  // life cycle
  // ====================

  function preloadRecord() {
    itemId = 'Q487604';
    itemLabel = 'Martha Graham';
    searchItem = {};
  }

  onMount(async () => {
    preloadRecord();
  });
</script>

<h1 class="title is-1">Linked Data</h1>

<AutoComplete
  searchFunction={loadOptions}
  delay="200"
  onChange={handleSelect}
  labelFieldName="search_label"
  placeholder="Search keyword"
  hideArrow={true}
  showClear={false}
  localFiltering={false}
  bind:selectedItem={searchItem}
/>

{#if itemId}
  <h2 class="title is-2">{itemLabel} ({itemId})</h2>
{/if}
