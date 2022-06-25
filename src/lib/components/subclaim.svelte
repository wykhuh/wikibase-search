<script>
  import ClaimValue from '$lib/components/claim_value.svelte';
  import WikidataLink from '$lib/components/wikidata_link.svelte';

  export let value;
</script>

<!-- {JSON.stringify(value)}<hr> -->

<tr>
  <td class="subproperty">
    {value['property_value']}
  </td>

  <td>
    <ClaimValue {value} />
    <WikidataLink {value} />
  </td>
</tr>

<style>
  td.subproperty {
    width: 33%;
  }

  td {
    border: 0;
  }
</style>
