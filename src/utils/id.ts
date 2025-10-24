/**
 * Simple ID generator for runtime use
 * Generates unique IDs for transient objects (buffs, etc.)
 */

let counter = 0;

export function makeId(): string {
  return `id_${Date.now()}_${counter++}`;
}
