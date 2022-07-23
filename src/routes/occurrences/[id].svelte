<script context="module">
  export async function load({ params }) {
    return {
      props: {
        id: params.id
      }
    };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { getPageFields, getList, getArtisticWork } from '$lib/common/graphql_queries';
  import CAField from '$lib/components/ca_field.svelte';

  export let id;
  let table = 'ca_occurrences';
  let type = 'choreographic_work';
  let fields = [];
  let record = {};

  async function addFieldValues(rawFields, record) {
    let labelFields = [
      {
        name: 'Preferred Labels',
        code: 'preferred_labels',
        dataType: 'CONTAINER',
        typeRestrictions: [{ maxAttributesPerRow: 1 }],
        subelements: [
          {
            name: '',
            code: 'name',
            dataType: 'TEXT'
          }
        ],
        values: record[`${table}.preferred_labels`]['values']
      }
    ];

    let otherFields = await Promise.all(
      rawFields.map(async (field) => {
        // set values attribute with values from the record
        let recordField = record[`${table}.${field['code']}`];
        if (recordField) {
          field['values'] = recordField['values'];
        } else {
          field['values'] = null;
        }

        // if field is a ca_lists, get all the list items
        if (field['dataType'] == 'LIST') {
          field['listValues'] = await getList(field['list']);
        }

        return field;
      })
    );

    fields = labelFields.concat(otherFields);
  }

  onMount(async () => {
    let rawFields = await getPageFields(table, type);
    let codes = rawFields.map((field) => `${table}.${field['code']}`);
    codes = codes.concat([`${table}.preferred_labels`, `${table}.nonpreferred_labels`]);
    record = await getArtisticWork(id, codes);

    await addFieldValues(rawFields, record);
  });
</script>

{#if record['displayname']}
  <h1 class="title is-1">Collective Access</h1>
  <h2 class="title is-2">{record['displayname']}, idno: {record.idno}</h2>
{:else}
  <p>Loading...</p>
{/if}

<!-- <pre>{JSON.stringify(record, null, '    ')}</pre><hr /> -->
{#each fields as field}
  <!-- <pre>{JSON.stringify(field, null, '    ')}</pre> -->

  <CAField {field} />
{/each}
