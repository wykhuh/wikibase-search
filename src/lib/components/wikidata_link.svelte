<script>
  import { notEmpty } from '$lib/common/utils';

  export let value;

  let nestedValue = value['data_value']['value'];
  let wikiTypes = ['wikibase-item', 'wikibase-property', 'wikibase-lexeme', 'geo-shape'];
  let showLink =
    wikiTypes.includes(value['data_type']) && notEmpty(nestedValue) && notEmpty(nestedValue['url']);
</script>

{#if showLink}
  <a href={nestedValue['url']}>Wikidata page&rarr;</a>
{/if}

<style>
  a {
    margin-left: 10px;
    font-size: 0.85rem;
  }
</style>
