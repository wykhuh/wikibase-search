<script>
  export let languages;
  export let item;

  let labels = item['labels'] || {};
  let descriptions = item['descriptions'] || {};
  let aliases = item['aliases'] || {};
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
    {#each languages as lang}
      <tr>
        <td>{lang}</td>
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
