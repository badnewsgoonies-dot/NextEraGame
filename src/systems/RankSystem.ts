/*
 * RankSystem: Unit Rank Management and Merging
 * 
 * Fire Emblem-inspired merge system:
 * - Units start at C rank
 * - Merge duplicate units (same templateId) to upgrade rank
 * - Ranks: C → B → A → S
 * - Each rank provides stat multipliers (handled by StatsSystem)
 * 
 * Pure functions, no mutations.
 */

import type { PlayerUnit, UnitRank } from '../types/game.js';
import { Ok, Err, type Result } from '../utils/Result.js';

/**
 * Check if a unit can be upgraded (not already S rank)
 */
export function canUpgradeRank(currentRank: UnitRank): boolean {
  return currentRank !== 'S';
}

/**
 * Get next rank in progression
 * Returns null if already at max rank (S)
 */
export function getNextRank(currentRank: UnitRank): UnitRank | null {
  switch (currentRank) {
    case 'C': return 'B';
    case 'B': return 'A';
    case 'A': return 'S';
    case 'S': return null; // Max rank
  }
}

/**
 * Merge duplicate unit into existing unit to upgrade rank
 * 
 * Rules:
 * - Both units must have same templateId (be true duplicates)
 * - Any duplicate can merge (don't need same rank)
 * - Target unit rank increases by 1 (C→B, B→A, A→S)
 * - Target unit keeps: level, XP, equipment, current HP/MP
 * - Target unit stats recalculate automatically (higher rank multiplier)
 * - Duplicate unit is consumed (caller must remove from team)
 * - Duplicate's equipment should go to inventory (handled by caller)
 * 
 * @param targetUnit - Unit to upgrade (will be modified by new rank)
 * @param duplicateUnit - Unit to sacrifice (must be same template)
 * @returns Result with upgraded unit or error
 */
export function mergeUnits(
  targetUnit: PlayerUnit,
  duplicateUnit: PlayerUnit
): Result<PlayerUnit, string> {
  // Validation 1: Verify they're actually duplicates (same templateId)
  if (targetUnit.templateId !== duplicateUnit.templateId) {
    return Err(`Units are not duplicates (${targetUnit.templateId} vs ${duplicateUnit.templateId})`);
  }
  
  // Validation 2: Verify target unit can be upgraded
  if (!canUpgradeRank(targetUnit.rank)) {
    return Err('Target unit is already max rank (S)');
  }
  
  // Get next rank
  const nextRank = getNextRank(targetUnit.rank);
  if (!nextRank) {
    return Err('Cannot upgrade beyond S rank');
  }
  
  // Create upgraded unit
  // Keeps everything except rank (level, XP, equipment, currentHp, currentMp all stay)
  const upgradedUnit: PlayerUnit = {
    ...targetUnit,
    rank: nextRank,
    // Note: Stats will be recalculated by StatsSystem when this unit is displayed/used
    // The base stats (hp, maxHp, atk, def, speed) stay the same
    // But the FINAL stats (via calculateUnitStats) will be higher due to rank multiplier
  };
  
  return Ok(upgradedUnit);
}

/**
 * Get rank display info for UI
 * Returns badge text, star count, and color class
 */
export function getRankDisplay(rank: UnitRank): { badge: string; stars: string; color: string } {
  switch (rank) {
    case 'C':
      return { 
        badge: '[C]', 
        stars: '', 
        color: 'text-gray-400 dark:text-gray-500' 
      };
    case 'B':
      return { 
        badge: '[B]', 
        stars: '⭐', 
        color: 'text-blue-400 dark:text-blue-300' 
      };
    case 'A':
      return { 
        badge: '[A]', 
        stars: '⭐⭐', 
        color: 'text-purple-400 dark:text-purple-300' 
      };
    case 'S':
      return { 
        badge: '[S]', 
        stars: '⭐⭐⭐', 
        color: 'text-yellow-400 dark:text-yellow-300' 
      };
  }
}

/**
 * Get stat bonus description for UI
 * Shows what percentage bonus the rank provides
 */
export function getRankBonusDescription(rank: UnitRank): string {
  switch (rank) {
    case 'C': return 'Base stats (no bonus)';
    case 'B': return '+15% to all base stats';
    case 'A': return '+30% to all base stats';
    case 'S': return '+50% to all base stats';
  }
}

/**
 * Get rank progression info for UI
 * Shows current rank and what's next
 */
export function getRankProgression(rank: UnitRank): {
  current: UnitRank;
  next: UnitRank | null;
  canUpgrade: boolean;
  currentBonus: string;
  nextBonus: string | null;
} {
  const next = getNextRank(rank);
  const canUpgrade = next !== null;
  
  return {
    current: rank,
    next,
    canUpgrade,
    currentBonus: getRankBonusDescription(rank),
    nextBonus: next ? getRankBonusDescription(next) : null,
  };
}

