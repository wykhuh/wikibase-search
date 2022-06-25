<script>
  // import spacetime from 'spacetime'
  export let value;

  function displayValue(value) {
    // NOTE: use '' for null because svelte will show 'null'
    return value ? value : '';
  }
</script>

{#if value['data_type'] == 'wikibase-item'}
  {displayValue(value['data_value']['value']['label'])}
{:else if value['data_type'] == 'wikibase-property'}
  {displayValue(value['data_value']['value']['label'])}
{:else if value['data_type'] == 'wikibase-lexeme'}
  {displayValue(value['data_value']['value']['label'])}
{:else if value['data_type'] == 'globe-coordinate'}
  {displayValue(value['data_value']['value']['latitude'])},
  {displayValue(value['data_value']['value']['longitude'])}
{:else if value['data_type'] == 'geo-shape'}
  {displayValue(value['data_value']['value']['label'])}<br />
  {displayValue(value['data_value']['value']['url'])}
{:else if value['data_type'] == 'commonsMedia'}
  {displayValue(value['data_value']['value']['label'])}<br />
  {displayValue(value['data_value']['value']['url'])}
{:else if value['data_type'] == 'quantity'}
  {displayValue(value['data_value']['value']['amount'])}
  {#if value['data_value']['value']['unit']}
    {displayValue(value['data_value']['value']['unit'])}
  {/if}
  {#if value['data_value']['value']['lowerBound']}
    {displayValue(value['data_value']['value']['lowerBound'])}
  {/if}
  {#if value['data_value']['value']['upperBound']}
    {displayValue(value['data_value']['value']['upperBound'])}
  {/if}
{:else if value['data_type'] == 'url'}
  {#if value['data_value']['value']}
    <a href={value['data_value']['value']}>{value['data_value']['value']}</a>
  {/if}
{:else if value['data_type'] == 'time'}
  {displayValue(value['data_value']['value'])}
{:else}
  {displayValue(value['data_value']['value'])}
{/if}
