/**
 * Gem Super System
 *
 * Implements the global Gem Super attack - a powerful AOE ability
 * that targets ALL enemies based on the selected gem's element.
 *
 * Damage Formula:
 * - Base damage: gem super power (typically 100)
 * - Element multiplier: Based on gem vs target element relationship
 *   - Strong (non-counter): 1.5x damage
 *   - Weak (counter relationship): 0.5x damage
 *   - Neutral (same element): 1.0x damage
 * - Random variance: ±15% using seeded RNG for determinism
 *
 * Element Relationships:
 * - Mars (Fire) ↔ Mercury (Water)
 * - Jupiter (Wind) ↔ Venus (Earth)
 * - Moon (Light) ↔ Sun (Dark)
 *
 * Example:
 * Mars gem (power 100) vs Venus (Earth) enemy:
 * - Base: 100
 * - Multiplier: 1.5x (Fire strong vs Earth)
 * - Variance: 0.85-1.15 (RNG)
 * - Final: 127-172 damage
 */

import type { BattleUnit, Element } from '../types/game.js';
import type { IRng } from '../utils/rng.js';
import { isCounterElement } from '../data/gems.js';

/**
 * Calculate element multiplier for gem super damage
 *
 * @param gemElement - Element of the active gem
 * @param targetElement - Element of the target enemy
 * @returns Damage multiplier (0.5x weak, 1.0x neutral, 1.5x strong)
 */
export function getGemSuperMultiplier(
  gemElement: Element,
  targetElement: Element
): number {
  // Same element: neutral (1.0x)
  if (gemElement === targetElement) {
    return 1.0;
  }

  // Counter relationship: weak (0.5x)
  // If either counters the other, damage is reduced
  if (isCounterElement(gemElement, targetElement)) {
    return 0.5;
  }

  // Non-counter different element: strong (1.5x)
  return 1.5;
}

/**
 * Execute gem super attack against all enemies
 *
 * Pure function - returns new array of enemies with updated HP.
 * Does not mutate input.
 *
 * @param enemies - Array of enemy units to target
 * @param gemElement - Element of the active gem
 * @param gemPower - Base power of the gem super (typically 100)
 * @param rng - Seeded RNG for deterministic variance
 * @returns New array of enemies with damage applied
 */
export function executeGemSuper(
  enemies: readonly BattleUnit[],
  gemElement: Element,
  gemPower: number,
  rng: IRng
): BattleUnit[] {
  // Apply damage to each enemy
  return enemies.map(enemy => {
    // Skip if enemy has no element (shouldn't happen, but defensive)
    // For enemies without explicit element, treat as neutral (1.0x)
    const targetElement = (enemy as any).element || gemElement;

    // Calculate element multiplier
    const multiplier = getGemSuperMultiplier(gemElement, targetElement);

    // Apply RNG variance (±15%)
    const variance = 0.85 + (rng.float() * 0.3);

    // Calculate final damage
    const damage = Math.floor(gemPower * multiplier * variance);

    // Apply damage (pure - return new object)
    return {
      ...enemy,
      currentHp: Math.max(0, enemy.currentHp - damage)
    };
  });
}

/**
 * Calculate expected damage range for gem super (for UI display)
 *
 * @param gemPower - Base power of gem super
 * @param gemElement - Gem element
 * @param targetElement - Target element
 * @returns Min and max damage values
 */
export function getGemSuperDamageRange(
  gemPower: number,
  gemElement: Element,
  targetElement: Element
): { min: number; max: number } {
  const multiplier = getGemSuperMultiplier(gemElement, targetElement);
  const min = Math.floor(gemPower * multiplier * 0.85);
  const max = Math.floor(gemPower * multiplier * 1.15);
  return { min, max };
}
