/**
 * BuffSystem: Buff/Debuff Management
 *
 * Features:
 * - Apply buffs to units
 * - Track buff duration
 * - Decay buffs each turn
 * - Calculate total stat modifiers
 * - Remove expired buffs
 *
 * Pure functions, no mutations.
 */

import type { BattleUnit, ActiveBuff, Ability } from '../types/game.js';
import { makeId } from '../utils/id.js';

/**
 * Apply a buff to a unit
 * Creates a new buff and adds it to the unit's buff list
 */
export function applyBuff(
  unit: BattleUnit,
  ability: Ability,
  duration: number
): BattleUnit {
  const effect = ability.effect;

  // Only buff effects create buffs
  if (effect.type !== 'buff' || !effect.buffStat || !effect.buffAmount) {
    return unit;
  }

  const newBuff: ActiveBuff = {
    id: makeId(),
    stat: effect.buffStat,
    amount: effect.buffAmount,
    duration,
    source: ability.id,
    sourceName: ability.name,
  };

  return {
    ...unit,
    buffState: {
      buffs: [...unit.buffState.buffs, newBuff],
    },
  };
}

/**
 * Decay all buffs on a unit by 1 turn
 * Remove expired buffs (duration <= 0)
 */
export function decayBuffs(unit: BattleUnit): BattleUnit {
  const updatedBuffs = unit.buffState.buffs
    .map(buff => ({
      ...buff,
      duration: buff.duration - 1,
    }))
    .filter(buff => buff.duration > 0);

  return {
    ...unit,
    buffState: { buffs: updatedBuffs },
  };
}

/**
 * Decay buffs for all units in a team
 */
export function decayAllBuffs(units: readonly BattleUnit[]): readonly BattleUnit[] {
  return units.map(decayBuffs);
}

/**
 * Calculate total stat modifier from all buffs
 * @param unit - Unit to check
 * @param stat - Which stat to get modifier for
 * @returns Total modifier (can be positive or negative)
 */
export function getBuffModifier(
  unit: BattleUnit,
  stat: 'attack' | 'defense' | 'speed'
): number {
  return unit.buffState.buffs
    .filter(buff => buff.stat === stat)
    .reduce((total, buff) => total + buff.amount, 0);
}

/**
 * Get all active buffs on a unit (for UI display)
 */
export function getActiveBuffs(unit: BattleUnit): readonly ActiveBuff[] {
  return unit.buffState.buffs;
}

/**
 * Check if unit has any active buffs
 */
export function hasActiveBuffs(unit: BattleUnit): boolean {
  return unit.buffState.buffs.length > 0;
}

/**
 * Remove all buffs from a unit (for cleanse abilities)
 */
export function removeAllBuffs(unit: BattleUnit): BattleUnit {
  return {
    ...unit,
    buffState: { buffs: [] },
  };
}

/**
 * Get buff display info for UI
 * Returns summary of all buffs by stat
 */
export function getBuffSummary(unit: BattleUnit): {
  attack: number;
  defense: number;
  speed: number;
} {
  return {
    attack: getBuffModifier(unit, 'attack'),
    defense: getBuffModifier(unit, 'defense'),
    speed: getBuffModifier(unit, 'speed'),
  };
}
