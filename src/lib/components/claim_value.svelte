<script>
  import spacetime from 'spacetime';

  import { empty, notEmpty, secondsToHms, truncateText } from '$lib/common/utils';
  import { formatTime, formatQuantity, wikiTypes } from '$lib/common/claim_value';

  import LeafletMap from './leaflet_map.svelte';

  export let value;

  let nestedValue = value['data_value']['value'];

  function displayValue(value) {
    // NOTE: use '' for null/undefined because svelte will show 'null'/'undefined'
    return notEmpty(value) ? value : '';
  }

  function formatMedia(value) {
    if (empty(value)) return '';
    if (Object.keys(value).length == 0) return '';

    let title = value['title'].replace('File:', '');

    switch (value['mediatype']) {
      case 'AUDIO':
        return `
        <figure>
          <audio controls src=${value['url']}>
            Your browser does not support embedded audio.
          </audio>
          <figcaption>
            <a href="${value['descriptionurl']}">${title}&rarr;</a><br>
            ${secondsToHms(value['duration'])}
          </figcaption>
        </figure>
        `;
      case 'VIDEO':
        return `
        <figure>
          <video controls width="250">
            <source src=${value['url']} type=${value['mime']}>
             Your browser does not support embedded audio.
          </video>
          <figcaption>
            <a href="${value['descriptionurl']}">${title}&rarr;</a><br>
            ${secondsToHms(value['duration'])}
          </figcaption>
        </figure>
        `;
      default:
        let altText = title.split('.')[0];
        return `
        <figure>
          <img alt=${altText} src=${value['thumburl']}><br>
          <figcaption>
            <a href="${value['descriptionurl']}">${title}&rarr;</a>
          </figcaption>
        </figure>
        `;
    }
  }

  function formatCoordinates(value) {
    if (empty(value)) return;

    return ` ${displayValue(value['latitude'])}, ${displayValue(value['longitude'])}`;
  }
</script>

{#if wikiTypes.includes(value['data_type'])}
  {displayValue(nestedValue['label'])}
{:else if value['data_type'] == 'globe-coordinate'}
  {#if nestedValue}
    <LeafletMap lat={nestedValue['latitude']} lon={nestedValue['longitude']} id={value['id']} />
    {formatCoordinates(nestedValue)}
  {/if}
{:else if value['data_type'] == 'commonsMedia'}
  {@html formatMedia(nestedValue)}
{:else if value['data_type'] == 'quantity'}
  {formatQuantity(nestedValue)}
{:else if value['data_type'] == 'url'}
  {#if nestedValue}
    <a href={nestedValue}>{truncateText(nestedValue, 50)}&rarr;</a>
  {/if}
{:else if value['data_type'] == 'time'}
  {formatTime(nestedValue)}
{:else if value['data_type'] == 'external-id'}
  {#if notEmpty(nestedValue['url'])}
    <a href={displayValue(nestedValue['url'])}>{displayValue(nestedValue['label'])}&rarr;</a>
  {:else}
    {displayValue(nestedValue['label'])}
  {/if}
{:else}
  {displayValue(nestedValue)}
{/if}
