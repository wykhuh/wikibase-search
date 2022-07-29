import { expect, test, describe } from 'vitest';
import {
  formatWikidataCollectiveAccessMapping,
  formatNetworkGraphDataForVisJs,
  createTreeNetworkGraphData,
  trimTreeNetworkGraphData,
  formatWikidataItem,
  formatWikidataPropertiesMapping,
  formatWikidataItemsMapping
} from '$lib/common/wiki_queries';
import rawMapping from '$lib/data/ca_wikidata_mapping.csv';

describe('formatWikidataCollectiveAccessMapping', () => {
  test('converts csv data into object with properties and fields', () => {
    let table = 'ca_entities';
    let csvData = [
      { ca_table: table, ca_code: 'ca_entities.aaa', wikidata_property: 'P1', wikidata_misc: '' },
      { ca_table: table, ca_code: 'ca_entities.bbb', wikidata_property: 'P2', wikidata_misc: '' }
    ];

    let expected = {
      P1: 'ca_entities.aaa',
      P2: 'ca_entities.bbb'
    };
    expect(formatWikidataCollectiveAccessMapping(csvData, table)).toEqual(expected);
  });

  test('handles qid', () => {
    let table = 'ca_entities';
    let csvData = [
      { ca_table: table, ca_code: 'ca_entities.aaa', wikidata_property: 'P1', wikidata_misc: '' },
      { ca_table: table, ca_code: 'ca_entities.bbb', wikidata_property: '', wikidata_misc: 'qid' }
    ];

    let expected = {
      P1: 'ca_entities.aaa',
      qid: 'ca_entities.bbb'
    };
    expect(formatWikidataCollectiveAccessMapping(csvData, table)).toEqual(expected);
  });

  test('handles aliases', () => {
    let table = 'ca_entities';
    let csvData = [
      { ca_table: table, ca_code: 'ca_entities.aaa', wikidata_property: 'P1', wikidata_misc: '' },
      {
        ca_table: table,
        ca_code: 'ca_entities.bbb',
        wikidata_property: '',
        wikidata_misc: 'aliases'
      }
    ];

    let expected = {
      P1: 'ca_entities.aaa',
      aliases: 'ca_entities.bbb'
    };
    expect(formatWikidataCollectiveAccessMapping(csvData, table)).toEqual(expected);
  });

  test('handles descriptions', () => {
    let table = 'ca_entities';
    let csvData = [
      { ca_table: table, ca_code: 'ca_entities.aaa', wikidata_property: 'P1', wikidata_misc: '' },
      {
        ca_table: table,
        ca_code: 'ca_entities.bbb',
        wikidata_property: '',
        wikidata_misc: 'descriptions'
      }
    ];

    let expected = {
      P1: 'ca_entities.aaa',
      descriptions: 'ca_entities.bbb'
    };
    expect(formatWikidataCollectiveAccessMapping(csvData, table)).toEqual(expected);
  });

  test('ignores data from other tables', () => {
    let table = 'ca_entities';
    let csvData = [
      { ca_table: table, ca_code: 'ca_entities.aaa', wikidata_property: 'P1', wikidata_misc: '' },
      {
        ca_table: 'other_table',
        ca_code: 'other_table.bbb',
        wikidata_property: 'P2',
        wikidata_misc: ''
      }
    ];

    let expected = {
      P1: 'ca_entities.aaa'
    };
    expect(formatWikidataCollectiveAccessMapping(csvData, table)).toEqual(expected);
  });
});

let graphDemoData = [
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q1' },
    selectedItemLabel: { value: 'a1' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemF: { value: 'http://www.wikidata.org/entity/Q10' },
    itemFLabel: { value: 'b10' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q1' },
    selectedItemLabel: { value: 'a1' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemF: { value: 'http://www.wikidata.org/entity/Q11' },
    itemFLabel: { value: 'b11' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q1' },
    selectedItemLabel: { value: 'a1' },
    prop: { value: 'http://www.wikidata.org/entity/P2' },
    propLabel: { value: 'prop2' },
    itemF: { value: 'http://www.wikidata.org/entity/Q12' },
    itemFLabel: { value: 'b12' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q1' },
    selectedItemLabel: { value: 'a1' },
    prop: { value: 'http://www.wikidata.org/entity/P2' },
    propLabel: { value: 'prop2' },
    itemF: { value: 'http://www.wikidata.org/entity/Q13' },
    itemFLabel: { value: 'b13' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q10' },
    selectedItemLabel: { value: 'a10' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemF: { value: 'http://www.wikidata.org/entity/Q100' },
    itemFLabel: { value: 'c100' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q10' },
    selectedItemLabel: { value: 'a10' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemF: { value: 'http://www.wikidata.org/entity/Q101' },
    itemFLabel: { value: 'c101' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q10' },
    selectedItemLabel: { value: 'a10' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemF: { value: 'http://www.wikidata.org/entity/Q102' },
    itemFLabel: { value: 'c102' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q10' },
    selectedItemLabel: { value: 'a10' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemF: { value: 'http://www.wikidata.org/entity/Q103' },
    itemFLabel: { value: 'c103' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q11' },
    selectedItemLabel: { value: 'a11' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemF: { value: 'http://www.wikidata.org/entity/Q110' },
    itemFLabel: { value: 'c110' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q11' },
    selectedItemLabel: { value: 'a11' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemF: { value: 'http://www.wikidata.org/entity/Q111' },
    itemFLabel: { value: 'c111' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q100' },
    selectedItemLabel: { value: 'a100' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemR: { value: 'http://www.wikidata.org/entity/Q1000' },
    itemRLabel: { value: 'c1000' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q100' },
    selectedItemLabel: { value: 'a100' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemR: { value: 'http://www.wikidata.org/entity/Q1001' },
    itemRLabel: { value: 'c1001' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q100' },
    selectedItemLabel: { value: 'a100' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemR: { value: 'http://www.wikidata.org/entity/Q1002' },
    itemRLabel: { value: 'c1002' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q100' },
    selectedItemLabel: { value: 'a100' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemR: { value: 'http://www.wikidata.org/entity/Q1003' },
    itemRLabel: { value: 'c1003' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q101' },
    selectedItemLabel: { value: 'a100' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemR: { value: 'http://www.wikidata.org/entity/Q1010' },
    itemRLabel: { value: 'c1010' }
  },
  {
    selectedItem: { value: 'http://www.wikidata.org/entity/Q101' },
    selectedItemLabel: { value: 'a100' },
    prop: { value: 'http://www.wikidata.org/entity/P1' },
    propLabel: { value: 'prop1' },
    itemR: { value: 'http://www.wikidata.org/entity/Q1011' },
    itemRLabel: { value: 'c1011' }
  }
];

describe('createTreeNetworkGraphData', () => {
  test('create object with parent and kids for data from wikidata query', () => {
    let expected = {
      Q1: { parent: null, kids: ['Q10', 'Q11', 'Q12', 'Q13'] },
      Q10: { parent: 'Q1', kids: ['Q100', 'Q101', 'Q102', 'Q103'] },
      Q11: { parent: 'Q1', kids: ['Q110', 'Q111'] },
      Q12: { parent: 'Q1', kids: [] },
      Q13: { parent: 'Q1', kids: [] },
      Q100: { parent: 'Q10', kids: ['Q1000', 'Q1001', 'Q1002', 'Q1003'] },
      Q101: { parent: 'Q10', kids: ['Q1010', 'Q1011'] },
      Q102: { parent: 'Q10', kids: [] },
      Q103: { parent: 'Q10', kids: [] },
      Q110: { parent: 'Q11', kids: [] },
      Q111: { parent: 'Q11', kids: [] },
      Q1000: { parent: 'Q100', kids: [] },
      Q1001: { parent: 'Q100', kids: [] },
      Q1002: { parent: 'Q100', kids: [] },
      Q1003: { parent: 'Q100', kids: [] },
      Q1010: { parent: 'Q101', kids: [] },
      Q1011: { parent: 'Q101', kids: [] }
    };
    let results = createTreeNetworkGraphData(graphDemoData);

    expect(Object.keys(results).length).toEqual(Object.keys(expected).length);
    expect(Object.keys(results).length).toEqual(17);

    expect(Object.keys(results)).toEqual(Object.keys(expected));
    expect(results).toEqual(expected);
  });
});

describe('trimTreeNetworkGraphData', () => {
  test('returns ids from tree object if number of kids is less than limit', () => {
    let tree = createTreeNetworkGraphData(graphDemoData);

    let expected = new Set([
      'Q1',
      'Q10',
      'Q11',
      'Q12',
      'Q100',
      'Q101',
      'Q102',
      'Q110',
      'Q111',
      'Q1000',
      'Q1001',
      'Q1002',
      'Q1010',
      'Q1011'
    ]);
    expect(trimTreeNetworkGraphData(tree, 3)).toEqual(expected);
    expect(trimTreeNetworkGraphData(tree, 3).size).toEqual(14);
  });
});

describe('formatNetworkGraphDataForVisJs', () => {
  test('handles forward properties', () => {
    let data = graphDemoData.slice(0, 2);
    let expected = {
      nodes: [
        { id: 'Q1', label: 'a1' },
        { id: 'Q10', label: 'b10' },
        { id: 'Q11', label: 'b11' }
      ],
      edges: [
        {
          from: 'Q1',
          fromLabel: 'a1',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q10',
          toLabel: 'b10'
        },
        {
          from: 'Q1',
          fromLabel: 'a1',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q11',
          toLabel: 'b11'
        }
      ]
    };

    expect(data.length).toEqual(2);
    expect(formatNetworkGraphDataForVisJs(data)).toEqual(expected);
  });

  test('handles reverse properties', () => {
    let data = graphDemoData.slice(10, 12);
    let expected = {
      nodes: [
        { id: 'Q1000', label: 'c1000' },
        { id: 'Q100', label: 'a100' },
        { id: 'Q1001', label: 'c1001' }
      ],
      edges: [
        {
          from: 'Q1000',
          fromLabel: 'c1000',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q100',
          toLabel: 'a100'
        },
        {
          from: 'Q1001',
          fromLabel: 'c1001',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q100',
          toLabel: 'a100'
        }
      ]
    };

    expect(data.length).toEqual(2);
    expect(formatNetworkGraphDataForVisJs(data)).toEqual(expected);
  });

  test('limits number of edges for root node', () => {
    let data = graphDemoData.slice(0, 4);
    let expected = {
      nodes: [
        { id: 'Q1', label: 'a1' },
        { id: 'Q10', label: 'b10' },
        { id: 'Q11', label: 'b11' },
        { id: 'Q12', label: 'b12' }
      ],
      edges: [
        {
          from: 'Q1',
          fromLabel: 'a1',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q10',
          toLabel: 'b10'
        },
        {
          from: 'Q1',
          fromLabel: 'a1',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q11',
          toLabel: 'b11'
        },
        {
          from: 'Q1',
          fromLabel: 'a1',
          propertyId: 'P2',
          label: 'prop2',
          to: 'Q12',
          toLabel: 'b12'
        }
      ]
    };

    expect(data.length).toBe(4);
    expect(formatNetworkGraphDataForVisJs(data, 3)).toEqual(expected);
  });

  test('limits number of edges per node for multiple iterations', () => {
    let expected = {
      nodes: [
        { id: 'Q1', label: 'a1' },
        { id: 'Q10', label: 'b10' },
        { id: 'Q11', label: 'b11' },
        { id: 'Q12', label: 'b12' },
        { id: 'Q100', label: 'c100' },
        { id: 'Q101', label: 'c101' },
        { id: 'Q102', label: 'c102' },
        { id: 'Q110', label: 'c110' },
        { id: 'Q111', label: 'c111' },
        { id: 'Q1000', label: 'c1000' },
        { id: 'Q1001', label: 'c1001' },
        { id: 'Q1002', label: 'c1002' },
        { id: 'Q1010', label: 'c1010' },
        { id: 'Q1011', label: 'c1011' }
      ],
      edges: [
        {
          from: 'Q1',
          fromLabel: 'a1',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q10',
          toLabel: 'b10'
        },
        {
          from: 'Q1',
          fromLabel: 'a1',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q11',
          toLabel: 'b11'
        },
        {
          from: 'Q1',
          fromLabel: 'a1',
          propertyId: 'P2',
          label: 'prop2',
          to: 'Q12',
          toLabel: 'b12'
        },
        {
          from: 'Q10',
          fromLabel: 'b10',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q100',
          toLabel: 'c100'
        },
        {
          from: 'Q10',
          fromLabel: 'b10',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q101',
          toLabel: 'c101'
        },
        {
          from: 'Q10',
          fromLabel: 'b10',
          propertyId: 'P1',
          label: 'prop1',
          to: 'Q102',
          toLabel: 'c102'
        },
        {
          from: 'Q11',
          fromLabel: 'b11',
          label: 'prop1',
          propertyId: 'P1',
          to: 'Q110',
          toLabel: 'c110'
        },
        {
          from: 'Q11',
          fromLabel: 'b11',
          label: 'prop1',
          propertyId: 'P1',
          to: 'Q111',
          toLabel: 'c111'
        },
        {
          from: 'Q1000',
          fromLabel: 'c1000',
          label: 'prop1',
          propertyId: 'P1',
          to: 'Q100',
          toLabel: 'c100'
        },
        {
          from: 'Q1001',
          fromLabel: 'c1001',
          label: 'prop1',
          propertyId: 'P1',
          to: 'Q100',
          toLabel: 'c100'
        },
        {
          from: 'Q1002',
          fromLabel: 'c1002',
          label: 'prop1',
          propertyId: 'P1',
          to: 'Q100',
          toLabel: 'c100'
        },
        {
          from: 'Q1010',
          fromLabel: 'c1010',
          label: 'prop1',
          propertyId: 'P1',
          to: 'Q101',
          toLabel: 'c101'
        },
        {
          from: 'Q1011',
          fromLabel: 'c1011',
          label: 'prop1',
          propertyId: 'P1',
          to: 'Q101',
          toLabel: 'c101'
        }
      ]
    };

    expect(formatNetworkGraphDataForVisJs(graphDemoData, 3)).toEqual(expected);
  });
});

let caRecord = {
  id: 2,
  idno: '00002',
  'ca_entities.preferred_labels': {
    code: 'ca_entities.preferred_labels',
    name: 'Entity names',
    dataType: 'Container',
    values: [
      {
        label_id: '2',
        entity_id: '2',
        displayname: 'Jane Doe',
        forename: 'Jane',
        surname: 'Doe',
        name_sort: 'Doe, Jane',
        access: '0'
      }
    ]
  },
  'ca_entities.nonpreferred_labels': {
    code: 'ca_entities.nonpreferred_labels',
    name: 'Entity names (alternates)',
    dataType: 'Container',
    values: [
      {
        label_id: '70',
        entity_id: '2',
        type_id: 'alt',
        displayname: 'Jane A. Doe',
        forename: 'Jane',
        surname: 'Doe',
        name_sort: 'Doe, Jane',
        access: '1'
      }
    ]
  },
  'ca_entities.description': {
    code: 'ca_entities.description',
    name: 'Description',
    dataType: 'List',
    values: ['An unknown person.']
  },
  'ca_entities.occupation': {
    code: 'ca_entities.occupation',
    name: 'Occupation',
    dataType: 'Text',
    values: ['choreographer', 'dancer']
  },
  'ca_entities.email': {
    code: 'ca_entities.email',
    name: 'Email address',
    dataType: 'Text',
    values: ['user@example.com']
  },
  'ca_entities.authority_viaf_value_id': {
    code: 'ca_entities.authority_viaf_value_id',
    name: 'VIAF',
    dataType: 'InformationService',
    values: ['1234']
  }
};

describe('formatWikidataItem', () => {
  test('foo', () => {
    let table = 'ca_entities';
    let mapping = formatWikidataCollectiveAccessMapping(rawMapping, table);
    let wikiPropertiesMapping = formatWikidataPropertiesMapping(rawMapping, table);
    let wikiItemsMapping = {'P106': {'choreographer': 'Q12', 'dancer': 'Q34'}};

    let expected = {
      labels: { en: 'Jane Doe' },
      descriptions: { en: 'An unknown person.' },
      aliases: { en: ['Jane A. Doe'] },
      statements: {
        P106: [
          {
            property: 'P106',
            data_type: 'wikibase-item',
            data_value: {
              value: {
                label: 'choreographer',
                id: 'Q12'
              }
            }
          },
          {
            property: 'P106',
            data_type: 'wikibase-item',
            data_value: {
              value: {
                label: 'dancer',
                id: 'Q34'
              }
            }
          }
        ]
      },
      identifiers: {
        P214: [
          {
            property: 'P214',
            data_type: 'external-id',
            data_value: {
              value: {
                label: '1234'
              }
            }
          }
        ]
      }
    };

    expect(formatWikidataItem(caRecord, table, mapping, wikiPropertiesMapping, wikiItemsMapping)).toEqual(expected);
  });
});

describe('formatWikidataItemsMapping', () => {
  test('foo', async () => {

    let expected = {'P106': {'choreographer': 'Q12', 'dancer': 'Q34'}}
    let table = 'ca_entities';

    let result = formatWikidataItemsMapping(rawMapping, table, caRecord)
    expect(result).toEqual(expected)
  })
})
