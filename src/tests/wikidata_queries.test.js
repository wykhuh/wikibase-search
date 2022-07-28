import { expect, test, describe } from 'vitest';
import { formatWikidataCollectiveAccessMapping } from '$lib/common/wiki_queries';

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
