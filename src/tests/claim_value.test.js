import { expect, test, describe } from 'vitest';
import { formatTime, formatQuantity } from '../lib/common/claim_value';

describe('formatTime', () => {
  test('returns year when date only has year', () => {
    expect(formatTime('+00000002020-00-00T00:00:00Z')).toBe('2020');
  });

  test('returns day month year when date has year-month-day', () => {
    expect(formatTime('+00000002020-01-20T00:00:00Z')).toBe('20 January 2020');
  });

  test('returns empty string if no date', () => {
    expect(formatTime(null)).toBe('');
    expect(formatTime(undefined)).toBe('');
  });
});

describe('formatQuantity', () => {
  test('returns undefined if no value', () => {
    expect(formatQuantity(null)).toBe(undefined);
    expect(formatQuantity(undefined)).toBe(undefined);
  });

  test('returns undefined if no amount', () => {
    expect(formatQuantity({ foo: 1 })).toBe(undefined);
  });

  test('returns amount if no units or bounds', () => {
    expect(formatQuantity({ amount: '1' })).toBe('1');
  });

  test('returns amount and units if units exists', () => {
    expect(formatQuantity({ amount: '1', unit: 'cm' })).toBe('1 cm');
  });

  test('returns amount ± diff if upper and lower bounds are equal', () => {
    expect(formatQuantity({ amount: '10', lowerBound: '7', upperBound: '13' })).toBe('10±3');
  });

  test('returns amount ± diff of upper bounds if upper and lower bounds are different', () => {
    expect(formatQuantity({ amount: '10', lowerBound: '2', upperBound: '13' })).toBe('10±3');
  });

  test('returns amount ± diff units if bounds and units exists', () => {
    expect(formatQuantity({ amount: '10', lowerBound: '7', upperBound: '13', unit: 'cm' })).toBe(
      '10±3 cm'
    );
  });

  test('handles decimal numbers', () => {
    expect(
      formatQuantity({ amount: '10.123', lowerBound: '10.120', upperBound: '10.126', unit: 'cm' })
    ).toBe('10.123±0.003 cm');
  });
});
