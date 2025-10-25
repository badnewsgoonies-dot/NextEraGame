/*
 * Array utility functions.
 */
import type { IRng } from './rng';

/**
 * Returns a random element from an array using deterministic RNG.
 *
 * @param array - The array to select from
 * @param rng - The deterministic random number generator
 * @returns A random element from the array, or undefined if the array is empty
 *
 * @example
 * const rng = makeRng(12345).fork('test');
 * const items = ['a', 'b', 'c'];
 * const random = getRandomElement(items, rng); // Returns 'a', 'b', or 'c'
 */
export function getRandomElement<T>(array: T[], rng: IRng): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  const index = rng.int(0, array.length - 1);
  return array[index];
}
