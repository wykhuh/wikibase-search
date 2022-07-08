<script>
  export let languageCodes;
  export let item;

  $: labels = item['labels'] || {};
  $: descriptions = item['descriptions'] || {};
  $: aliases = item['aliases'] || {};
</script>

<table class="table  is-bordered is-fullwidth">
  <thead>
    <tr>
      <th>Language</th>
      <th>Label</th>
      <th>Description</th>
      <th>Also known as</th>
    </tr>
  </thead>
  <tbody>
    {#each languageCodes as lang}
      <tr>
        <td>{item['languages'][lang]}</td>
        <td
          >{#if labels[lang]}{labels[lang]}{/if}</td
        >
        <td
          >{#if descriptions[lang]}{descriptions[lang]}{/if}</td
        >
        <td
          >{#if aliases[lang]}{aliases[lang]}{/if}</td
        >
      </tr>
    {/each}
  </tbody>
</table>
