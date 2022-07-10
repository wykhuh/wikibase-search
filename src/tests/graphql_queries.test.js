import { expect, test, describe } from 'vitest';
import {
  formatWikidataCollectiveAccessMapping,
  createCAFieldValueObject
} from '../lib/common/graphql_queries';

describe('formatWikidataCollectiveAccessMapping', () => {
  test('converts csv data into object with properties and fields', () => {
    let table = 'ca_entities';
    let csvData = [
      { ca_table: table, ca_field: 'aaa', wikidata_property: 'P1', wikidata_misc: '' },
      { ca_table: table, ca_field: 'bbb', wikidata_property: 'P2', wikidata_misc: '' }
    ];

    let expected = {
      P1: 'aaa',
      P2: 'bbb'
    };
    expect(formatWikidataCollectiveAccessMapping(csvData, table)).toEqual(expected);
  });

  test('handles qid', () => {
    let table = 'ca_entities';
    let csvData = [
      { ca_table: table, ca_field: 'aaa', wikidata_property: 'P1', wikidata_misc: '' },
      { ca_table: table, ca_field: 'bbb', wikidata_property: '', wikidata_misc: 'qid' }
    ];

    let expected = {
      P1: 'aaa',
      qid: 'bbb'
    };
    expect(formatWikidataCollectiveAccessMapping(csvData, table)).toEqual(expected);
  });

  test('handles aliases', () => {
    let table = 'ca_entities';
    let csvData = [
      { ca_table: table, ca_field: 'aaa', wikidata_property: 'P1', wikidata_misc: '' },
      { ca_table: table, ca_field: 'bbb', wikidata_property: '', wikidata_misc: 'aliases' }
    ];

    let expected = {
      P1: 'aaa',
      aliases: 'bbb'
    };
    expect(formatWikidataCollectiveAccessMapping(csvData, table)).toEqual(expected);
  });
  test('ignores data from other tables', () => {
    let table = 'ca_entities';
    let csvData = [
      { ca_table: table, ca_field: 'aaa', wikidata_property: 'P1', wikidata_misc: '' },
      { ca_table: 'other_table', ca_field: 'bbb', wikidata_property: 'P2', wikidata_misc: '' }
    ];

    let expected = {
      P1: 'aaa'
    };
    expect(formatWikidataCollectiveAccessMapping(csvData, table)).toEqual(expected);
  });
});

let demoItem = {
  labels: { en: 'label' },
  descriptions: {
    de: 'de description',
    en: 'description'
  },
  aliases: {
    en: ['cc', 'ccc'],
    de: ['dd', 'ddd']
  },
  statements: {
    P1: [
      {
        property: 'P1',
        property_value: 'instance of',
        data_type: 'wikibase-item',
        data_value: {
          value: {
            label: 'aaa',
            id: 'Q1',
            url: 'https://www.wikidata.org/wiki/Q1'
          }
        },
        id: '1'
      }
    ],
    P2: [
      {
        property: 'P2',
        property_value: 'occupation',
        data_type: 'string',
        data_value: { value: 'bbb' },
        id: '2'
      }
    ],
    P3: [
      {
        property: 'P3',
        property_value: 'start time',
        data_type: 'time',
        data_value: { value: '+00000002020-01-10T00:00:00Z' },
        id: '3'
      }
    ]
  },
  identifiers: {
    P10: [
      {
        property: 'P10',
        property_value: 'ID 1',
        data_type: 'external-id',
        data_value: {
          value: {
            label: 'eee',
            url: 'https://example.com/eee'
          }
        },
        id: '10'
      }
    ],
    P11: [
      {
        property: 'P11',
        property_value: 'ID 2',
        data_type: 'external-id',
        data_value: {
          value: {
            label: 'fff',
          }
        },
        id: '10'
      }
    ]
  },
  languages: { de: 'German', en: 'English' },
  id: 'Q100'
};

describe('createCAFieldValueObject', () => {
  test('converts Wikidata object to [{CollectiveAccess_field: value}]', () => {
    let mapping = {
      P1: 'field1',
      P2: 'field2',
      P3: 'field3',
      P10: 'field4',
      P11: 'field5',
      qid: 'my_id',
      aliases: 'my_name'
    };

    let expected = [
      { field1: 'aaa' },
      { field2: 'bbb' },
      { field3: '10 January 2020' },
      { field4: 'eee' },
      { field5: 'fff' },
      { my_name: 'cc' },
      { my_name: 'ccc' },
      { my_id: 'Q100' }
    ];
    expect(createCAFieldValueObject(demoItem, mapping)).toEqual(expected);
  });


  test('ignores properties that are not in the mapping', () => {
    let mapping = {
      P1: 'field1',
      P10: 'field4',
      qid: 'my_id',
      aliases: 'my_name'
    };

    let expected = [
      { field1: 'aaa' },
      { field4: 'eee' },
      { my_name: 'cc' },
      { my_name: 'ccc' },
      { my_id: 'Q100' }
    ];
    expect(createCAFieldValueObject(demoItem, mapping)).toEqual(expected);
  });

  test('handles item with only id', () => {
    let item = {
      labels: {},
      descriptions: {},
      statements: {},
      identifiers: {},
      languages: {},
      id: 'Q100'
    };
    let mapping = {
      qid: 'my_id',
      aliases: 'my_name'
    };

    let expected = [{my_id: 'Q100'}]
    expect(createCAFieldValueObject(item, mapping)).toEqual(expected);
  })
});
