<script>
  import spacetime from 'spacetime';
  import { empty, notEmpty } from '$lib/common/utils';
  export let value;

  let nestedValue = value['data_value']['value'];

  function displayValue(value) {
    // NOTE: use '' for null/undefined because svelte will show 'null'/'undefined'
    return notEmpty(value) ? value : '';
  }

  function formatTime(value) {
    // NOTE: wikidata api provides time as '+00000002000-01-01T10:10:10Z'

    if (empty(value)) return '';

    // get rid of '+' and '0' at the start of the string
    let newTime = value.replace(/^\+0+/, '');

    // if time is just a year, return year
    if (newTime.includes('-00-00T00:00:00Z')) {
      return newTime.split('-00-00T00:00:00Z')[0];

      // if time is year-month-day, return day month year
    } else if (newTime.includes('T00:00:00Z')) {
      return spacetime(newTime).format('{date} {month} {year}');

      // if time is year-month-day hour-minute-second, do ???
    } else {
      throw 'need to implement formatTime() for this time value';
    }
  }
</script>

{#if value['data_type'] == 'wikibase-item'}
  {displayValue(nestedValue['label'])}
{:else if value['data_type'] == 'wikibase-property'}
  {displayValue(nestedValue['label'])}
{:else if value['data_type'] == 'wikibase-lexeme'}
  {displayValue(nestedValue['label'])}
{:else if value['data_type'] == 'globe-coordinate'}
  {displayValue(nestedValue['latitude'])},
  {displayValue(nestedValue['longitude'])}
{:else if value['data_type'] == 'geo-shape'}
  {displayValue(nestedValue['label'])}<br />
  {displayValue(nestedValue['url'])}
{:else if value['data_type'] == 'commonsMedia'}
  {displayValue(nestedValue['label'])}<br />
  {displayValue(nestedValue['url'])}
{:else if value['data_type'] == 'quantity'}
  {displayValue(nestedValue['amount'])}
  {#if nestedValue['unit']}
    {displayValue(nestedValue['unit'])}
  {/if}
  {#if nestedValue['lowerBound']}
    {displayValue(nestedValue['lowerBound'])}
  {/if}
  {#if nestedValue['upperBound']}
    {displayValue(nestedValue['upperBound'])}
  {/if}
{:else if value['data_type'] == 'url'}
  {#if nestedValue}
    <a href={nestedValue}>{nestedValue}</a>
  {/if}
{:else if value['data_type'] == 'time'}
  {formatTime(nestedValue)}
{:else}
  {displayValue(nestedValue)}
{/if}
