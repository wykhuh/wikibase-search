<script>
  export let field;

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
</script>

<div class="field">
  <!-- LIST -->
  {#if field['dataType'] === 'LIST'}
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
    <!-- CONTAINER -->
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

    <!-- {:else if field['dataType'] === 'TIMECODE'}
  TIMECODE

  {:else if field['dataType'] === 'DATERANGE'}
  DATERANGE

  {:else if field['dataType'] === 'LCSH'}
  LCSH -->

    <!-- TEXT -->
  {:else}
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
  {/if}
  {#if multipleFields(field['typeRestrictions'])}
    <div class="add-more">+ Add {field['name']}</div>
  {/if}
</div>

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
