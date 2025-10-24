/*
 * AbilitySystem: MP-based Spell/Ability Management
 * 
 * Features:
 * - MP cost checking
 * - MP deduction on ability use
 * - MP restoration at battle start
 * - Damage/heal calculation
 * - Buff/debuff application
 * 
 * Pure functions, no mutations.
 */

import type { PlayerUnit, Ability } from '../types/game.js';
import { Ok, Err, type Result } from '../utils/Result.js';

/**
 * Check if unit has enough MP to use ability
 */
export function canUseAbility(unit: PlayerUnit, ability: Ability): boolean {
  return unit.currentMp >= ability.mpCost;
}

/**
 * Use ability (deduct MP, return updated unit)
 * Does NOT apply the ability effect - that's handled by battle system
 * Only handles MP cost
 */
export function useAbility(
  unit: PlayerUnit,
  ability: Ability
): Result<PlayerUnit, string> {
  if (!canUseAbility(unit, ability)) {
    return Err(`Not enough MP (need ${ability.mpCost}, have ${unit.currentMp})`);
  }
  
  const updatedUnit: PlayerUnit = {
    ...unit,
    currentMp: unit.currentMp - ability.mpCost,
  };
  
  return Ok(updatedUnit);
}

/**
 * Restore MP to max for a single unit
 */
export function restoreMp(unit: PlayerUnit, maxMp: number = 50): PlayerUnit {
  return {
    ...unit,
    currentMp: maxMp,
  };
}

/**
 * Restore all MP to max (called at start of battle)
 */
export function restoreAllMp(team: readonly PlayerUnit[], maxMp: number = 50): readonly PlayerUnit[] {
  return team.map(unit => ({
    ...unit,
    currentMp: maxMp,
  }));
}

/**
 * Calculate ability damage based on caster's attack stat
 * Formula: base power + (caster attack * 0.5)
 * This makes abilities scale with the caster's strength
 */
export function calculateAbilityDamage(
  ability: Ability,
  casterAttack: number
): number {
  const effect = ability.effect;
  
  if (effect.type !== 'damage') {
    return 0;
  }
  
  // Base power + 50% of caster's attack
  return Math.floor(effect.power + (casterAttack * 0.5));
}

/**
 * Calculate ability healing (fixed amount, doesn't scale)
 * Formula: base power (healing is consistent, not based on stats)
 */
export function calculateAbilityHealing(ability: Ability): number {
  const effect = ability.effect;
  
  if (effect.type !== 'heal') {
    return 0;
  }
  
  return effect.power;
}

/**
 * Get buff amount from ability
 * Used for buff/debuff effects
 */
export function getAbilityBuffAmount(ability: Ability): number {
  return ability.effect.buffAmount || 0;
}

/**
 * Get buff duration from ability
 * Returns number of turns the buff lasts
 */
export function getAbilityBuffDuration(ability: Ability): number {
  return ability.effect.buffDuration || 0;
}

/**
 * Check if ability is usable in current battle state
 * Factors: MP cost, ability target type, available targets
 */
export function isAbilityUsable(
  unit: PlayerUnit,
  ability: Ability,
  hasAllies: boolean,
  hasEnemies: boolean
): { usable: boolean; reason?: string } {
  // Check MP
  if (!canUseAbility(unit, ability)) {
    return { 
      usable: false, 
      reason: `Not enough MP (need ${ability.mpCost}, have ${unit.currentMp})` 
    };
  }
  
  // Check valid targets exist
  const targetType = ability.effect.target;
  if ((targetType === 'single_enemy' || targetType === 'all_enemies') && !hasEnemies) {
    return { usable: false, reason: 'No enemies available' };
  }
  
  if ((targetType === 'single_ally' || targetType === 'all_allies') && !hasAllies) {
    return { usable: false, reason: 'No allies available' };
  }
  
  return { usable: true };
}

/**
 * Get MP display info for UI
 */
export function getMpDisplayInfo(currentMp: number, maxMp: number = 50): {
  percentage: number;
  color: string;
  text: string;
} {
  const percentage = (currentMp / maxMp) * 100;
  
  let color: string;
  if (percentage >= 75) {
    color = 'text-blue-400'; // High MP - blue
  } else if (percentage >= 50) {
    color = 'text-green-400'; // Medium MP - green
  } else if (percentage >= 25) {
    color = 'text-yellow-400'; // Low MP - yellow
  } else {
    color = 'text-red-400'; // Critical MP - red
  }
  
  return {
    percentage,
    color,
    text: `${currentMp}/${maxMp}`,
  };
}

