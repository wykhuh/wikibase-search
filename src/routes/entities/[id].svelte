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
  import {
    getPageFields,
    getList,
    getEntity,
    labelElements,
    getEntityArtisticWorkRelationships
  } from '$lib/common/graphql_queries';
  import CAField from '$lib/components/ca_field.svelte';
  import { printJson } from '$lib/common/utils';

  export let id;
  let table = 'ca_entities';
  let type = 'individual';
  let fields = [];
  let record = {};
  let artisticWorkRelationships = [];

  async function addFieldValues(rawFields, record) {
    let labelFields = [
      {
        name: 'Preferred Labels',
        code: 'preferred_labels',
        dataType: 'CONTAINER',
        typeRestrictions: [{ maxAttributesPerRow: 1 }],
        subelements: labelElements,
        values: record[`${table}.preferred_labels`]['values']
      }
    ];

    if (record[`${table}.nonpreferred_labels`]) {
      labelFields.push({
        name: 'Non-preferred Labels',
        code: 'nonpreferred_labels',
        dataType: 'CONTAINER',
        typeRestrictions: [{ maxAttributesPerRow: 10 }],
        subelements: labelElements,
        values: record[`${table}.nonpreferred_labels`]['values']
      });
    }

    let otherFields = await Promise.all(
      rawFields.map(async (field) => {
        // set values attribute with values from the record
        let recordField = record[`${table}.${field['code']}`];
        let sourceField = record[`${table}.${field['code']}.__source__`];

        if (recordField) {
          field['values'] = recordField['values'];
        } else {
          field['values'] = null;
        }

        if (sourceField) {
          field['sources'] = sourceField['values'];
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
    let codes = [];
    rawFields.forEach((field) => {
      codes.push(`${table}.${field['code']}`);
      codes.push(`${table}.${field['code']}.__source__`);
    });
    codes = codes.concat(['ca_entities.preferred_labels', 'ca_entities.nonpreferred_labels']);
    record = await getEntity(id, codes);
    console.log(JSON.stringify(record, null, 2));
    await addFieldValues(rawFields, record);
    artisticWorkRelationships = await getEntityArtisticWorkRelationships(id);
  });
</script>

{#if record['displayname']}
  <h1 class="title is-1">Collective Access</h1>
  <h2 class="title is-2">{record['displayname']}, idno: {record.idno}</h2>
{:else}
  <p>Loading...</p>
{/if}

<!-- {@html printJson(record)} -->
{#each fields as field}
  <!-- {@html printJson(field)} -->
  <CAField {field} />
{/each}

<h2>Related Artistic Works</h2>
{#each artisticWorkRelationships as relationship}
  <li>
    <a href={`/occurrences/${relationship.target_id}`}>{relationship.target_id}</a>
    {relationship.target_label} ({relationship.relationship_type})
  </li>
{/each}
