import { expect, test, describe } from 'vitest';
import { createCAFieldValueObject, formatBundles } from '$lib/common/graphql_queries';

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
      },
      {
        property: 'P2',
        property_value: 'occupation',
        data_type: 'string',
        data_value: { value: 'hhh' },
        id: '3'
      }
    ],
    P3: [
      {
        property: 'P3',
        property_value: 'start time',
        data_type: 'time',
        data_value: { value: '+00000002020-01-10T00:00:00Z' },
        id: '4'
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
            label: 'fff'
          }
        },
        id: '11'
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
      { field1: 'aaa', source: '1' },
      { field2: 'bbb', source: '2' },
      { field2: 'hhh', source: '3' },
      { field3: '10 January 2020', source: '4' },
      { field4: 'eee', source: '10' },
      { field5: 'fff', source: '11' },
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
      { field1: 'aaa', source: '1' },
      { field4: 'eee', source: '10' },
      { my_name: 'cc' },
      { my_name: 'ccc' },
      { my_id: 'Q100' }
    ];
    expect(createCAFieldValueObject(demoItem, mapping)).toEqual(expected);
  });

  test('handles Wikidata object with only id and label', () => {
    let item = {
      labels: { en: 'label' },
      statements: {},
      identifiers: {},
      languages: { en: 'English' },
      id: 'Q100'
    };
    let mapping = {
      qid: 'my_id'
    };

    let expected = [{ my_id: 'Q100' }];
    expect(createCAFieldValueObject(item, mapping)).toEqual(expected);
  });
});

describe('formatBundles', () => {
  test('create string bundles for graphql query', () => {
    let bundles = [{ 'table.field1': 'aaa' }, { 'table.field2': 'bbb' }, { 'table.field2': 'ccc' }];
    let table = 'table';

    let expected = `{name: "field1", value: "aaa"},
{name: "field2", value: "bbb"},
{name: "field2", value: "ccc"},
`;
    expect(formatBundles(bundles, table)).toEqual(expected);
  });

  test('adds source to bundle', () => {
    let bundles = [
      { 'table.field1': 'aaa', source: '11' },
      { 'table.field2': 'bbb', source: '22' }
    ];
    let table = 'table';

    let expected = `{name: "field1", value: "aaa", source: "11"},
{name: "field2", value: "bbb", source: "22"},
`;
    expect(formatBundles(bundles, table)).toEqual(expected);
  });

  test('handles nested fields with same container and different fields', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa' },
      { 'table.container1.field2': 'bbb' },
      { 'table.field3': 'ccc' }
    ];
    let table = 'table';

    let expected = `{name: "field3", value: "ccc"},
{name: "container1", values: [
  {name: "field1", value: "aaa"},
  {name: "field2", value: "bbb"},
]},
`;
    expect(formatBundles(bundles, table)).toEqual(expected);
  });

  test('does not add source to nested fields with same container and different fields', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa', source: '11' },
      { 'table.container1.field2': 'bbb', source: '22' },
      { 'table.field3': 'ccc', source: '33' }
    ];
    let table = 'table';

    let expected = `{name: "field3", value: "ccc", source: "33"},
{name: "container1", values: [
  {name: "field1", value: "aaa"},
  {name: "field2", value: "bbb"},
]},
`;
    expect(formatBundles(bundles, table)).toEqual(expected);
  });

  test('handles nested fields with same container and field', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa' },
      { 'table.container1.field1': 'bbb' },
      { 'table.field3': 'ccc' }
    ];
    let table = 'table';

    let expected = `{name: "container1", values: [
  {name: "field1", value: "aaa"},
]},
{name: "container1", values: [
  {name: "field1", value: "bbb"},
]},
{name: "field3", value: "ccc"},
`;
    expect(formatBundles(bundles, table)).toEqual(expected);
  });

  test('does not add source to nested fields with same container and fields', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa', source: '11' },
      { 'table.container1.field1': 'bbb', source: '22' },
      { 'table.field3': 'ccc', source: '33' }
    ];
    let table = 'table';

    let expected = `{name: "container1", values: [
  {name: "field1", value: "aaa"},
]},
{name: "container1", values: [
  {name: "field1", value: "bbb"},
]},
{name: "field3", value: "ccc", source: "33"},
`;
    expect(formatBundles(bundles, table)).toEqual(expected);
  });

  test('handles complex nested fields ', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa' },
      { 'table.container1.field1': 'bbb' },
      { 'table.container1.field2': 'ccc' },
      { 'table.container2.field1': 'ddd' },
      { 'table.container2.field2': 'eee' },
      { 'table.field3': 'fff' }
    ];
    let table = 'table';

    let expected = `{name: "container1", values: [
  {name: "field1", value: "aaa"},
]},
{name: "container1", values: [
  {name: "field1", value: "bbb"},
]},
{name: "field3", value: "fff"},
{name: "container1", values: [
  {name: "field2", value: "ccc"},
]},
{name: "container2", values: [
  {name: "field1", value: "ddd"},
  {name: "field2", value: "eee"},
]},
`;
    expect(formatBundles(bundles, table)).toEqual(expected);
  });

  test('does not adds source to complex nested fields ', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa', source: '11' },
      { 'table.container1.field1': 'bbb', source: '22' },
      { 'table.container1.field2': 'ccc', source: '33' },
      { 'table.container2.field1': 'ddd', source: '44' },
      { 'table.container2.field2': 'eee', source: '55' },
      { 'table.field3': 'fff', source: '66' }
    ];
    let table = 'table';

    let expected = `{name: "container1", values: [
  {name: "field1", value: "aaa"},
]},
{name: "container1", values: [
  {name: "field1", value: "bbb"},
]},
{name: "field3", value: "fff", source: "66"},
{name: "container1", values: [
  {name: "field2", value: "ccc"},
]},
{name: "container2", values: [
  {name: "field1", value: "ddd"},
  {name: "field2", value: "eee"},
]},
`;
    expect(formatBundles(bundles, table)).toEqual(expected);
  });
});

describe('formatBundles with replace', () => {
  test('create string bundles for graphql query', () => {
    let bundles = [{ 'table.field1': 'aaa' }, { 'table.field2': 'bbb' }, { 'table.field2': 'ccc' }];
    let table = 'table';

    let expected = `{name: "field1", value: "aaa", replace: true},
{name: "field2", value: "bbb", replace: true},
{name: "field2", value: "ccc", replace: true},
`;
    expect(formatBundles(bundles, table, 'replace')).toEqual(expected);
  });

  test('adds source to bundle', () => {
    let bundles = [
      { 'table.field1': 'aaa', source: '11' },
      { 'table.field2': 'bbb', source: '22' }
    ];
    let table = 'table';

    let expected = `{name: "field1", value: "aaa", source: "11", replace: true},
{name: "field2", value: "bbb", source: "22", replace: true},
`;
    expect(formatBundles(bundles, table, 'replace')).toEqual(expected);
  });

  test('handles nested fields with same container and different fields', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa' },
      { 'table.container1.field2': 'bbb' },
      { 'table.field3': 'ccc' }
    ];
    let table = 'table';

    let expected = `{name: "field3", value: "ccc", replace: true},
{name: "container1", replace: true, values: [
  {name: "field1", value: "aaa"},
  {name: "field2", value: "bbb"},
]},
`;
    expect(formatBundles(bundles, table, 'replace')).toEqual(expected);
  });

  test('does not add source to nested fields with same container and different fields', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa', source: '11' },
      { 'table.container1.field2': 'bbb', source: '22' },
      { 'table.field3': 'ccc', source: '33' }
    ];
    let table = 'table';

    let expected = `{name: "field3", value: "ccc", source: "33", replace: true},
{name: "container1", replace: true, values: [
  {name: "field1", value: "aaa"},
  {name: "field2", value: "bbb"},
]},
`;
    expect(formatBundles(bundles, table, 'replace')).toEqual(expected);
  });

  test('handles nested fields with same container and field', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa' },
      { 'table.container1.field1': 'bbb' },
      { 'table.field3': 'ccc' }
    ];
    let table = 'table';

    let expected = `{name: "container1", replace: true, values: [
  {name: "field1", value: "aaa"},
]},
{name: "container1", replace: true, values: [
  {name: "field1", value: "bbb"},
]},
{name: "field3", value: "ccc", replace: true},
`;
    expect(formatBundles(bundles, table, 'replace')).toEqual(expected);
  });

  test('does not add source to nested fields with same container and fields', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa', source: '11' },
      { 'table.container1.field1': 'bbb', source: '22' },
      { 'table.field3': 'ccc', source: '33' }
    ];
    let table = 'table';

    let expected = `{name: "container1", replace: true, values: [
  {name: "field1", value: "aaa"},
]},
{name: "container1", replace: true, values: [
  {name: "field1", value: "bbb"},
]},
{name: "field3", value: "ccc", source: "33", replace: true},
`;
    expect(formatBundles(bundles, table, 'replace')).toEqual(expected);
  });

  test('handles complex nested fields ', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa' },
      { 'table.container1.field1': 'bbb' },
      { 'table.container1.field2': 'ccc' },
      { 'table.container2.field1': 'ddd' },
      { 'table.container2.field2': 'eee' },
      { 'table.field3': 'fff' }
    ];
    let table = 'table';

    let expected = `{name: "container1", replace: true, values: [
  {name: "field1", value: "aaa"},
]},
{name: "container1", replace: true, values: [
  {name: "field1", value: "bbb"},
]},
{name: "field3", value: "fff", replace: true},
{name: "container1", replace: true, values: [
  {name: "field2", value: "ccc"},
]},
{name: "container2", replace: true, values: [
  {name: "field1", value: "ddd"},
  {name: "field2", value: "eee"},
]},
`;
    expect(formatBundles(bundles, table, 'replace')).toEqual(expected);
  });

  test('does not add source to nested fields ', () => {
    let bundles = [
      { 'table.container1.field1': 'aaa', source: '11' },
      { 'table.container1.field1': 'bbb', source: '22' },
      { 'table.container1.field2': 'ccc', source: '33' },
      { 'table.container2.field1': 'ddd', source: '44' },
      { 'table.container2.field2': 'eee', source: '55' },
      { 'table.field3': 'fff', source: '66' }
    ];
    let table = 'table';

    let expected = `{name: "container1", replace: true, values: [
  {name: "field1", value: "aaa"},
]},
{name: "container1", replace: true, values: [
  {name: "field1", value: "bbb"},
]},
{name: "field3", value: "fff", source: "66", replace: true},
{name: "container1", replace: true, values: [
  {name: "field2", value: "ccc"},
]},
{name: "container2", replace: true, values: [
  {name: "field1", value: "ddd"},
  {name: "field2", value: "eee"},
]},
`;
    expect(formatBundles(bundles, table, 'replace')).toEqual(expected);
  });
});
