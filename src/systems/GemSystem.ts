/*
 * GemSystem: Djinn-inspired Gem Management
 * 
 * Features:
 * - Equip gems to grant subclass + ability
 * - Use gem effects (powerful one-time effects)
 * - Gem activation system (active/inactive states)
 * - Passive bonuses (only when active)
 * 
 * Pure functions, no mutations.
 */

import type { PlayerUnit, EquippedGem, Ability, GemPassiveBonus } from '../types/game.js';
import { getGemById, type GemSpec } from '../data/gems.js';
import { Ok, Err, type Result } from '../utils/Result.js';

/**
 * Equip a gem to a unit
 * - Grants subclass (with stat modifiers)
 * - Grants ability (permanent while equipped)
 * - Gem starts in active state
 * - Stats will be recalculated by StatsSystem
 */
export function equipGem(
  unit: PlayerUnit,
  gemId: string
): Result<PlayerUnit, string> {
  const gem = getGemById(gemId);
  if (!gem) {
    return Err(`Gem not found: ${gemId}`);
  }
  
  // Create equipped gem (starts active)
  const equippedGem: EquippedGem = {
    gemId,
    state: 'active',
  };
  
  // Update unit with gem and subclass
  const updatedUnit: PlayerUnit = {
    ...unit,
    equippedGem,
    subclass: gem.grantsSubclass,
    // Note: Stats will be recalculated by StatsSystem
    // - Subclass provides class modifiers (percentage bonuses)
    // - Gem passive provides flat stat bonuses (when active)
  };
  
  return Ok(updatedUnit);
}

/**
 * Unequip gem from unit
 * - Removes subclass (loses class modifiers)
 * - Removes ability (can no longer cast it)
 * - Stats will be recalculated by StatsSystem
 */
export function unequipGem(unit: PlayerUnit): PlayerUnit {
  return {
    ...unit,
    equippedGem: undefined,
    subclass: undefined,
    // Stats will be recalculated (loses class modifiers and gem passive)
  };
}

/**
 * Use gem effect in battle (one-time powerful effect)
 * - Deactivates gem (loses passive bonus until next battle)
 * - DOES NOT remove subclass or ability (they persist!)
 * - Stats will be recalculated (loses passive bonus only)
 * 
 * @param unit - Unit using the gem effect
 * @returns Updated unit with deactivated gem
 */
export function useGemEffect(unit: PlayerUnit): Result<PlayerUnit, string> {
  if (!unit.equippedGem) {
    return Err('No gem equipped');
  }
  
  if (unit.equippedGem.state === 'inactive') {
    return Err('Gem is already inactive (already used this battle)');
  }
  
  // Deactivate gem
  const updatedUnit: PlayerUnit = {
    ...unit,
    equippedGem: {
      ...unit.equippedGem,
      state: 'inactive',
    },
    // Subclass stays! Ability stays! Only passive bonus is lost.
    // Stats will be recalculated by StatsSystem (passive bonus no longer applies)
  };
  
  return Ok(updatedUnit);
}

/**
 * Activate all gems in team (called at start of battle)
 * Resets gem states after previous battle
 */
export function activateAllGems(team: readonly PlayerUnit[]): readonly PlayerUnit[] {
  return team.map(unit => {
    if (unit.equippedGem && unit.equippedGem.state === 'inactive') {
      return {
        ...unit,
        equippedGem: {
          ...unit.equippedGem,
          state: 'active',
        },
        // Stats will be recalculated (passive bonus restored)
      };
    }
    return unit;
  });
}

/**
 * Get abilities available to a unit (from equipped gem)
 * Returns array of abilities the unit can cast
 */
export function getUnitAbilities(unit: PlayerUnit): readonly Ability[] {
  if (!unit.equippedGem) {
    return [];
  }
  
  const gem = getGemById(unit.equippedGem.gemId);
  if (!gem) {
    return [];
  }
  
  return [gem.grantedAbility];
}

/**
 * Get gem passive bonus (for StatsSystem integration)
 * Returns stat bonuses only if gem is active
 */
export function getGemPassiveBonus(
  gemId: string,
  gemState: 'active' | 'inactive'
): GemPassiveBonus {
  if (gemState !== 'active') {
    return { hp: 0, attack: 0, defense: 0, speed: 0 };
  }
  
  const gem = getGemById(gemId);
  if (!gem) {
    return { hp: 0, attack: 0, defense: 0, speed: 0 };
  }
  
  return gem.passiveBonus;
}

/**
 * Check if unit can use gem effect
 * Requirements: Has gem equipped AND gem is active
 */
export function canUseGemEffect(unit: PlayerUnit): boolean {
  return unit.equippedGem !== undefined && unit.equippedGem.state === 'active';
}

/**
 * Get gem info for UI display
 * Returns null if no gem equipped
 */
export function getEquippedGemInfo(unit: PlayerUnit): {
  gem: GemSpec;
  state: 'active' | 'inactive';
  passiveActive: boolean;
} | null {
  if (!unit.equippedGem) {
    return null;
  }
  
  const gem = getGemById(unit.equippedGem.gemId);
  if (!gem) {
    return null;
  }
  
  return {
    gem,
    state: unit.equippedGem.state,
    passiveActive: unit.equippedGem.state === 'active',
  };
}

