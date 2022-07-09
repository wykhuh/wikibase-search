<script>
  export let languageCodes;
  export let item;
  export let importAliases = false;
  export let defaultLanguage = 'en';

  $: labels = item['labels'] || {};
  $: descriptions = item['descriptions'] || {};
  $: aliases = item['aliases'] || {};
</script>

{importAliases}

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
    {#each languageCodes as lang (lang)}
      <tr>
        <td>{item['languages'][lang]}</td>
        <td
          >{#if labels[lang]}{labels[lang]}{/if}</td
        >
        <td
          >{#if descriptions[lang]}{descriptions[lang]}{/if}</td
        >
        <td class:highlightImport={importAliases && defaultLanguage === lang && aliases[lang]}
          >{#if aliases[lang]}{aliases[lang]}{/if}</td
        >
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .highlightImport {
    background-color: lightblue;
  }
</style>
