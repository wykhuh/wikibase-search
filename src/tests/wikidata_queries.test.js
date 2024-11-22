import { expect, test, describe } from 'vitest';
import {
  formatNetworkGraphDataForVisJs,
  createTreeNetworkGraphData,
  trimTreeNetworkGraphData
} from '$lib/common/wiki_queries';

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
