<script>
  export let value;
</script>

{#if value['data_type'] == 'commonsMedia'}
  <a href={value['data_value']['value']['url']}>Wikimedia Commons link&rarr;</a>
{:else if value['data_type'] == 'wikibase-item'}
  <a href={value['data_value']['value']['url']}>Wikidata link&rarr;</a>
{:else if value['data_type'] == 'wikibase-property'}
  <a href={value['data_value']['value']['url']}>Wikidata link&rarr;</a>
{:else if value['data_type'] == 'wikibase-lexeme'}
  <a href={value['data_value']['value']['url']}>Wikidata link&rarr;</a>
{/if}

<style>
  a {
    margin-left: 10px;
  }
</style>
