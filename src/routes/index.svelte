<script>
  import AutoComplete from 'simple-svelte-autocomplete';

  let foo = '';
  let currentItem = null;
  let currentQid = null;
  let currentLabel = null;
  let loading = false;

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
    loading = false;
  }
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
  {JSON.stringify(currentItem)}
{/if}
