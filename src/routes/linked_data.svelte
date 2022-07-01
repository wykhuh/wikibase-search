<script>
  import AutoComplete from 'simple-svelte-autocomplete';
  import { onMount } from 'svelte';

  import {
    getStudentOf,
    getTeacherOf,
    getNotableWorksBy,
    getWorksChoreographedBy,
    peopleMenu,
    venueMenu,
    worksMenu,
    getChoreographer,
    getLocationOfFirstPerformance,
    getCountry,
    search_keyword_ca,
    fetch_all_props_for_ids_ca
  } from '$lib/common/queries';


  let searchItem = '';

  // value of search term
  let itemId = null;
  let itemLabel = null;

  // settings for the type selectors
  let defaultMenuOption = 'Select type';
  let selectedPropertyL1 = defaultMenuOption;
  let selectedPropertyL2 = defaultMenuOption;
  let selectedPropertyL3 = defaultMenuOption;
  let menuL1 = [];
  let menuIdsL1 = [];
  let menuL2 = [];
  let menuIdsL2 = [];
  let menuL3 = [];
  let menuIdsL3 = [];

  let linkedItems = {};
  let linkedItemsL1 = {};
  let linkedItemsL2 = {};
  let linkedItemsL3 = {};

  async function formatMenuOptions(itemIds, level) {
    let json = await fetch_all_props_for_ids_ca(itemIds);
    if (json['P802']) {
      // rename "student" to "teacher of"
      json['P802'] = 'teacher of';
    }
    let labels = Object.values(json);

    // compare the property labels from the ids and the pre-set menus to
    // select the correct menu.
    let menu = null;
    if (labels.some((r) => peopleMenu.includes(r))) {
      menu = peopleMenu;
    } else if (labels.some((r) => worksMenu.includes(r))) {
      menu = worksMenu;
    } else if (labels.some((r) => venueMenu.includes(r))) {
      menu = venueMenu;
    } else {
      menu = [];
    }

    // pick the correct select dropdown to update
    if (level == 'L1') {
      menuL1 = menu;
    } else if (level == 'L2') {
      menuL2 = menu;
    } else {
      menuL3 = menu;
    }
  }

  async function handleSelectRelationship(level) {
    let selectedProperty;
    let targetIds;
    let items;

    // assign level-specific variabls to generic variables
    if (level === 'L1') {
      selectedProperty = selectedPropertyL1;
      targetIds = [itemId];
    } else if (level === 'L2') {
      targetIds = menuIdsL1;
      selectedProperty = selectedPropertyL2;
    } else if (level === 'L3') {
      targetIds = menuIdsL2;
      selectedProperty = selectedPropertyL3;
    }

    if (selectedProperty === defaultMenuOption) {
      switch (level) {
        case 'L1':
          linkedItems = {};
          selectedPropertyL2 = defaultMenuOption;
          selectedPropertyL3 = defaultMenuOption;
          break;
        case 'L2':
          linkedItems = linkedItemsL1;
          selectedPropertyL3 = defaultMenuOption;
          break;
        case 'L3':
          linkedItems = linkedItemsL2;
          break;
      }
    }

    switch (selectedProperty) {
      case 'student of':
        items = await getStudentOf(targetIds);
        break;
      case 'teacher of':
        items = await getTeacherOf(targetIds);
        break;
      case 'notable works':
        items = await getNotableWorksBy(targetIds);
        break;
      case 'choreographer for':
        items = await getWorksChoreographedBy(targetIds);
        break;
      case 'choreographed by':
        items = await getChoreographer(targetIds);
        break;
      case 'location of first performance':
        items = await getLocationOfFirstPerformance(targetIds);
        break;
      case 'country':
        items = await getCountry(targetIds);
        break;
      default:
        return;
    }
    if (level === 'L1') {
      let tmpTree = {};

      menuIdsL1 = new Set();
      Object.values(items).forEach((itemA) => {
        Object.values(itemA).forEach((item) => {
          menuIdsL1.add(item['id']);
          tmpTree[item['id']] = {
            id: item['id'],
            label: item['label'],
            description: item['description'],
            related: {}
          };
        });
      });

      menuIdsL1 = [...menuIdsL1];
      linkedItemsL1 = JSON.parse(JSON.stringify(tmpTree));
      linkedItems = tmpTree;

      // set the menu for level 2
      await formatMenuOptions(Object.keys(linkedItemsL1), 'L2');
    } else if (level === 'L2') {
      let tmpTree = JSON.parse(JSON.stringify(linkedItemsL1));

      menuIdsL2 = new Set();

      for (let [itemIdA, itemsA] of Object.entries(tmpTree)) {
        if (!items[itemIdA]) continue;
        for (let [itemIdB, itemsB] of Object.entries(items[itemIdA])) {
          menuIdsL2.add(itemIdB);
          itemsA['related'][itemIdB] = {
            id: itemIdB,
            label: itemsB['label'],
            description: itemsB['description'],
            related: {}
          };
        }
      }

      menuIdsL2 = [...menuIdsL2];
      linkedItemsL2 = JSON.parse(JSON.stringify(tmpTree));
      linkedItems = tmpTree;

      // set the menu for level 3
      await formatMenuOptions(menuIdsL2, 'L3');
    } else if (level === 'L3') {
      let tmpTree = JSON.parse(JSON.stringify(linkedItemsL2));

      menuIdsL3 = new Set();

      for (let [itemIdA, itemsA] of Object.entries(tmpTree)) {
        for (let [itemIdB, itemsB] of Object.entries(itemsA['related'])) {
          if (!items[itemIdB]) continue;
          for (let [itemIdC, itemsC] of Object.entries(items[itemIdB])) {
            menuIdsL3.add(itemIdB);
            itemsB['related'][itemIdC] = {
              id: itemIdC,
              label: itemsC['label'],
              description: itemsC['description'],
              related: {}
            };
          }
        }
      }

      menuIdsL3 = [...menuIdsL3];
      linkedItemsL3 = JSON.parse(JSON.stringify(tmpTree));
      linkedItems = tmpTree;
    }
  }
  // ====================
  // autocomplete
  // ====================

  async function loadOptions(keyword) {
    if (keyword) {
      itemId = null;
      itemLabel = null;
    }

    if (keyword.length > 1) {
      let json = await search_keyword_ca(keyword)
      return json;
    }
  }

  function resetSettings() {
    selectedPropertyL1 = defaultMenuOption;
    selectedPropertyL2 = defaultMenuOption;
    selectedPropertyL3 = defaultMenuOption;
    linkedItems = {};
    menuL1 = [];
    menuIdsL1 = [];
    linkedItemsL1 = {};
    menuL2 = [];
    menuIdsL2 = [];
    linkedItemsL2 = {};
    menuL3 = [];
    menuIdsL3 = [];
    linkedItemsL3 = {};
  }

  async function handleSelect(selectedOption) {
    if (Object.keys(selectedOption).length == 0) return;

    resetSettings();

    itemId = selectedOption['id'];
    itemLabel = selectedOption['label'];

    await formatMenuOptions([itemId], 'L1');
  }

  // ====================
  // life cycle
  // ====================

  function preloadRecord() {
    itemId = 'Q487604';
    itemLabel = 'Martha Graham';
    searchItem = {};
    menuL1 = peopleMenu;
  }

  onMount(async () => {
    // preloadRecord();
  });
</script>

<h1 class="title is-1">Linked Data</h1>

<AutoComplete
  searchFunction={loadOptions}
  delay="200"
  onChange={handleSelect}
  labelFieldName="search_label"
  placeholder="Search keyword"
  hideArrow={true}
  showClear={false}
  localFiltering={false}
  bind:selectedItem={searchItem}
/>

{#if itemId}
  <h2 class="title is-2">{itemLabel} ({itemId})</h2>
{/if}

{#if searchItem}
  <div class="type-selector">
    <div>
      <select
        class="select"
        bind:value={selectedPropertyL1}
        on:change={() => handleSelectRelationship('L1')}
      >
        {#each [defaultMenuOption, ...menuL1] as option}
          <option value={option}>
            {option}
          </option>
        {/each}
      </select>
    </div>
    <div>
      <select
        class="select"
        bind:value={selectedPropertyL2}
        on:change={() => handleSelectRelationship('L2')}
      >
        {#each [defaultMenuOption, ...menuL2] as option}
          <option value={option}>
            {option}
          </option>
        {/each}
      </select>
    </div>
    <div>
      <select
        class="select"
        bind:value={selectedPropertyL3}
        on:change={() => handleSelectRelationship('L3')}
      >
        {#each [defaultMenuOption, ...menuL3] as option}
          <option value={option}>
            {option}
          </option>
        {/each}
      </select>
    </div>
  </div>
  <table class="table is-fullwidth">
    {#each Object.entries(linkedItems) as [idA, itemsA]}
      <tr>
        <td class="is-one-third"> {itemsA['label']} ({itemsA['id']})</td>
        <td>
          {#if Object.keys(itemsA['related']).length > 0}
            <table class="table is-fullwidth">
              {#each Object.entries(itemsA['related']) as [idB, itemsB]}
                <tr>
                  <td class="is-half">{itemsB['label']} ({itemsB['id']})</td>
                  <td>
                    {#if Object.keys(itemsB['related']).length > 0}
                      <table class="table is-fullwidth">
                        {#each Object.entries(itemsB['related']) as [e, f]}
                          <tr>
                            <td class="no-border">
                              {f['label']}
                              {f['id']}
                            </td>
                          </tr>
                        {/each}
                      </table>
                    {/if}
                  </td>
                </tr>
              {/each}
            </table>
          {/if}
        </td>
      </tr>
    {/each}
  </table>
{/if}

<style>
  td {
    border: 0 1px 1px 1px solid #ccc;
  }
  .no-border {
    border-bottom: 0;
  }
  .is-one-third {
    width: 33%;
  }
  .is-half {
    width: 50%;
  }

  .type-selector {
    width: 100%;
    display: flex;
  }

  .type-selector div {
    flex-grow: 1;
  }
</style>
