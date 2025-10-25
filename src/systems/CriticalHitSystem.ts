/*
 * CriticalHitSystem: Calculate critical hits based on luck stat
 *
 * Features:
 * - Deterministic critical hit calculation using RNG
 * - Luck-based crit chance (luck stat / 100)
 * - Pure functions using Result type for error handling
 * - Validates luck values (0-100 range)
 */

import { Ok, Err, type Result } from '../utils/Result.js';
import type { PlayerUnit } from '../types/game.js';
import type { IRng } from '../utils/rng.js';

/**
 * Check if an attack results in a critical hit
 *
 * Formula: critChance = attacker.luck / 100
 * - luck: 0 = 0% crit chance (never crits)
 * - luck: 5 = 5% crit chance
 * - luck: 50 = 50% crit chance
 * - luck: 100 = 100% crit chance (always crits)
 *
 * @param attacker - The attacking unit
 * @param rng - Deterministic random number generator
 * @returns Result<boolean, string> - true if critical hit, false otherwise
 */
export function checkCriticalHit(
  attacker: PlayerUnit,
  rng: IRng
): Result<boolean, string> {
  // Validate luck is in valid range (0-100)
  if (attacker.luck < 0 || attacker.luck > 100) {
    return Err(`Invalid luck value: ${attacker.luck}. Must be between 0 and 100.`);
  }

  // Generate random number from 0-99
  const roll = rng.int(0, 99);

  // Critical hit occurs if roll is less than luck value
  // Example: luck = 50 means 0-49 crits (50% chance)
  const isCritical = roll < attacker.luck;

  return Ok(isCritical);
}
