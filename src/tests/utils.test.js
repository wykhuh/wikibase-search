import { expect, test, describe } from 'vitest';
import { empty, notEmpty, roundNumber, secondsToHms, truncateText } from '../lib/common/utils';

describe('empty', () => {
  test('returns true if null', () => {
    expect(empty(null)).toEqual(true);
  });

  test('returns true if undefined', () => {
    expect(empty(null)).toEqual(true);
  });

  test('returns false for other values', () => {
    expect(empty(0)).toEqual(false);
    expect(empty(1)).toEqual(false);
    expect(empty(false)).toEqual(false);
    expect(empty(true)).toEqual(false);
    expect(empty([])).toEqual(false);
    expect(empty({})).toEqual(false);
    expect(empty('')).toEqual(false);
    expect(empty('abc')).toEqual(false);
  });
});

describe('notEmpty', () => {
  test('returns false if null', () => {
    expect(notEmpty(null)).toEqual(false);
  });

  test('returns false if undefined', () => {
    expect(notEmpty(null)).toEqual(false);
  });

  test('returns true for other values', () => {
    expect(notEmpty(0)).toEqual(true);
    expect(notEmpty(1)).toEqual(true);
    expect(notEmpty(false)).toEqual(true);
    expect(notEmpty(true)).toEqual(true);
    expect(notEmpty([])).toEqual(true);
    expect(notEmpty({})).toEqual(true);
    expect(notEmpty('')).toEqual(true);
    expect(notEmpty('abc')).toEqual(true);
  });
});

describe('roundNumber', () => {
  test('round number to specified decimal places', () => {
    expect(roundNumber(1.123, 3)).toEqual(1.123);
    expect(roundNumber(1.1231, 3)).toEqual(1.123);
    expect(roundNumber(1.1235, 3)).toEqual(1.123);
    expect(roundNumber(1.1236, 3)).toEqual(1.124);
    expect(roundNumber(1.1239, 3)).toEqual(1.124);
  });

  test('leave integers as is', () => {
    expect(roundNumber(1, 3)).toEqual(1);
  });

  test('leave decimals as is if decimal places is less than number', () => {
    expect(roundNumber(1.9, 3)).toEqual(1.9);
    expect(roundNumber(1.09, 3)).toEqual(1.09);
    expect(roundNumber(1.009, 3)).toEqual(1.009);
    expect(roundNumber(1.0009, 3)).toEqual(1.001);
  });

  test('works with small numbers', () => {
    expect(roundNumber(0.000000006, 9)).toEqual(0.000000006);
    expect(roundNumber(0.0000000061, 9)).toEqual(0.000000006);
    expect(roundNumber(0.0000000065, 9)).toEqual(0.000000007);
    expect(roundNumber(0.0000000066, 9)).toEqual(0.000000007);
    expect(roundNumber(0.0000000069, 9)).toEqual(0.000000007);
  });
});

describe('secondsToHms', () => {
  test('converts seconds to minutes', () => {
    expect(secondsToHms(59)).toEqual('59 sec');
    expect(secondsToHms(60)).toEqual('1 min');
    expect(secondsToHms(65)).toEqual('1 min 5 sec');
    expect(secondsToHms(3600)).toEqual('1 hour');
    expect(secondsToHms(3605)).toEqual('1 hour 5 sec');
    expect(secondsToHms(3665)).toEqual('1 hour 1 min 5 sec');
  });
});

describe('truncateText', () => {
  test('truncates long text strings to specified length', () => {
    expect(truncateText('abc def', 2)).toEqual('ab...');
    expect(truncateText('abc def', 4)).toEqual('abc ...');
    expect(truncateText('abc def', 6)).toEqual('abc de...');
  });

  test('leaves strings as is if equal or shorter than limit', () => {
    expect(truncateText('abc def', 7)).toEqual('abc def');
    expect(truncateText('abc def', 8)).toEqual('abc def');
  });

  test('default string limit is 50', () => {
    let text = 'a'.repeat(50);
    expect(truncateText(text)).toEqual(text);

    let text2 = 'a'.repeat(51);
    expect(truncateText(text2)).toEqual(text + '...');
  });
});
