<script>
  import { notEmpty } from '$lib/common/utils';

  export let value;

  let nestedValue = value['data_value']['value'];
  let wikiTypes = ['wikibase-item', 'wikibase-property', 'wikibase-lexeme'];
</script>

{#if notEmpty(nestedValue['url'])}
  {#if value['data_type'] == 'commonsMedia'}
    <a href={nestedValue['url']}>Wikimedia Commons link&rarr;</a>
  {:else if wikiTypes.includes(value['data_type'])}
    <a href={nestedValue['url']}>Wikidata link&rarr;</a>
  {/if}
{/if}

<style>
  a {
    margin-left: 10px;
  }
</style>
