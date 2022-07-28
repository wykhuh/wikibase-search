import { expect, test, describe } from 'vitest';
import { formatWikidataCollectiveAccessMapping } from '$lib/common/wiki_queries';

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
