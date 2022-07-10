import { expect, test } from 'vitest';

test('test equality', () => {
  expect(1 == 1).toEqual(true);
  expect(1 == 2).toEqual(false);
});
