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
  import { getPageFields, getList, getEntity, labelElements } from '$lib/common/graphql_queries';

  export let id;
  let table = 'ca_entities';
  let type = 'individual';
  let fields = [];
  let record = {};

  function listType(settings) {
    let type = 'select';
    settings.forEach((setting) => {
      if (setting['name'] == 'render' && setting['value'] == 'checklist') {
        type = 'checklist';
      }
    });
    return type;
  }

  function multipleFields(restictions) {
    let hasMultiple = false;
    restictions.forEach((restiction) => {
      if (restiction['maxAttributesPerRow'] && restiction['maxAttributesPerRow'] > 1) {
        hasMultiple = true;
      }
    });

    return hasMultiple;
  }

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
    codes = codes.concat(['ca_entities.preferred_labels', 'ca_entities.nonpreferred_labels']);
    record = await getEntity(id, codes);

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

  <div class="field">
    {#if field['dataType'] === 'TEXT'}
      <label class="label" for={field['code']}>{field['name']} </label>
      {#if field['values']}
        {#each field['values'] as value}
          <div class="control">
            <input class="input" type="text" name={field['code']} {value} />
          </div>
        {/each}
      {:else}
        <div class="control">
          <input class="input" type="text" name={field['code']} />
        </div>
      {/if}
    {:else if field['dataType'] === 'LIST'}
      <label class="label" for={field['code']}>{field['name']} </label>
      {#if listType(field['settings']) == 'checklist'}
        {#if field['values']}
          {#each field['values'] as value}
            <div class="control">
              {#each field['listValues'] as option}
                <label class="radio">
                  <input
                    type="radio"
                    bind:group={value}
                    value={option['idno']}
                    name={option['idno']}
                  />
                  {option['label']}
                </label>
              {/each}
            </div>
          {/each}
        {:else}
          <div class="control">
            {#each field['listValues'] as option}
              <label class="radio">
                <input type="radio" value={option['id']} name={field['code']} />
                {option['label']}
              </label>
            {/each}
          </div>
        {/if}
      {:else if field['values']}
        {#each field['values'] as value}
          <select bind:value>
            <option>Select</option>
            {#each field['listValues'] as option}
              <option value={option['idno']}>{option['label']}</option>
            {/each}
          </select>
        {/each}
      {:else}
        <select>
          <option>Select</option>
          {#each field['listValues'] as option}
            <option value={option['id']}>{option['label']}</option>
          {/each}
        </select>
      {/if}
    {:else if field['dataType'] === 'CONTAINER'}
      <label class="label" for={field['code']}>{field['name']} </label>
      {#if field['values']}
        {#each field['values'] as value}
          <div class="record">
            {#each field['subelements'] as subelement}
              {#if subelement['dataType'] !== 'CONTAINER'}
                <div class="control">
                  <label for={subelement['code']}>{subelement['name']} </label>
                  <input
                    type="text"
                    name={subelement['code']}
                    value={value[subelement['code']] ? value[subelement['code']] : ''}
                  />
                </div>
              {/if}
            {/each}
          </div>
        {/each}
      {:else}
        {#each field['subelements'] as subelement}
          {#if subelement['dataType'] !== 'CONTAINER'}
            <div class="control">
              <label for={subelement['code']}>{subelement['name']} </label>
              <input type="text" name={subelement['code']} />
            </div>
          {/if}
        {/each}
      {/if}
    {/if}
    {#if multipleFields(field['typeRestrictions'])}
      <div class="add-more">+ Add {field['name']}</div>
    {/if}
  </div>
{/each}

<style>
  .field {
    border: 1px solid #ccc;
  }

  .field .label {
    background: #eee;
  }

  .add-more {
    margin-top: 1rem;
  }

  .record {
    margin-bottom: 1rem;
  }
</style>
