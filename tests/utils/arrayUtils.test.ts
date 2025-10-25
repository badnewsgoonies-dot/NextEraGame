import { describe, test, expect } from 'vitest';
import { getRandomElement } from '../../src/utils/arrayUtils.js';
import { makeRng } from '../../src/utils/rng.js';

describe('getRandomElement', () => {
  test('returns undefined for empty array', () => {
    const rng = makeRng(42).fork('test');
    const result = getRandomElement([], rng);
    expect(result).toBeUndefined();
  });

  test('returns the only element for single element array', () => {
    const rng = makeRng(123).fork('test');
    const array = ['only'];
    const result = getRandomElement(array, rng);
    expect(result).toBe('only');
  });

  test('returns element from array and is deterministic', () => {
    const array = ['a', 'b', 'c', 'd', 'e'];

    // Same seed should produce same result
    const rng1 = makeRng(999).fork('test');
    const rng2 = makeRng(999).fork('test');
    const result1 = getRandomElement(array, rng1);
    const result2 = getRandomElement(array, rng2);

    expect(result1).toBe(result2);
    expect(array).toContain(result1);
    expect(array).toContain(result2);
  });
});
