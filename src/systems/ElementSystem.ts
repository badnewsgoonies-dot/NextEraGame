/**
 * Element System
 * 
 * Calculates elemental alignment bonuses for Active Gem System.
 * 
 * Bonus Rules:
 * - Matching element: +15% damage/healing
 * - Neutral element: +5% damage/healing
 * - Counter element: -5% damage/healing
 * 
 * Counter relationships:
 * - Fire ↔ Water (Mars ↔ Mercury)
 * - Earth ↔ Wind (Venus ↔ Jupiter)
 * - Light ↔ Dark (Moon ↔ Sun)
 * 
 * Activation:
 * - Bonuses apply at battle start
 * - Mid-battle activation removes bonuses (keeps element-matching spells)
 * - Resets after each battle
 */

import type { Element, PlayerUnit, ActiveGemState, Ability } from '../types/game.js';
import { getCounterElement } from '../data/gems.js';
import {
  MATCHING_SPELLS,
  COUNTER_SPELLS,
  AOE_SPELLS,
  ULTIMATE_SPELLS,
  SUPPORT_SPELLS
} from '../data/elementalSpells.js';

/**
 * Bonus multipliers for element matching
 */
const BONUS_MATCHING = 1.15;  // +15%
const BONUS_NEUTRAL = 1.05;   // +5%
const BONUS_COUNTER = 0.95;   // -5%

/**
 * Calculate element bonus multiplier for a unit
 * @param unit - Player unit with element affinity
 * @param gemState - Current active gem state
 * @returns Multiplier to apply to damage/healing (1.0 = no bonus)
 */
export function calculateElementBonus(
  unit: PlayerUnit,
  gemState: ActiveGemState
): number {
  // No gem selected or gem activated = no bonus
  if (!gemState.activeGem || gemState.isActivated) {
    return 1.0;
  }

  const unitElement = unit.element;
  const gemElement = gemState.activeGem.element;

  // Matching element: +15%
  if (unitElement === gemElement) {
    return BONUS_MATCHING;
  }

  // Counter element: -5%
  const counterElement = getCounterElement(gemElement);
  if (unitElement === counterElement) {
    return BONUS_COUNTER;
  }

  // Neutral element: +5%
  return BONUS_NEUTRAL;
}

/**
 * Apply element bonus to a damage or healing value
 * @param baseValue - Base damage/healing amount
 * @param unit - Unit performing the action
 * @param gemState - Current active gem state
 * @returns Final value with bonus applied (rounded)
 */
export function applyElementBonus(
  baseValue: number,
  unit: PlayerUnit,
  gemState: ActiveGemState
): number {
  const multiplier = calculateElementBonus(unit, gemState);
  return Math.round(baseValue * multiplier);
}

/**
 * Get element relationship description for UI
 * @param unitElement - Unit's element
 * @param gemElement - Active gem's element
 * @returns Relationship type and bonus percentage
 */
export function getElementRelationship(
  unitElement: Element,
  gemElement: Element
): { type: 'matching' | 'neutral' | 'counter'; bonus: number } {
  if (unitElement === gemElement) {
    return { type: 'matching', bonus: 15 };
  }

  const counterElement = getCounterElement(gemElement);
  if (unitElement === counterElement) {
    return { type: 'counter', bonus: -5 };
  }

  return { type: 'neutral', bonus: 5 };
}

/**
 * Get elemental spells granted to a unit based on gem/element match
 * @param unitElement - Unit's element
 * @param gemState - Current gem state
 * @returns Array of abilities granted (0-4+ spells depending on relationship)
 */
export function getGrantedSpells(
  unitElement: Element,
  gemState: ActiveGemState
): Ability[] {
  const { activeGem } = gemState;

  if (!activeGem) {
    return []; // No gem = no bonus spells
  }

  const gemElement = activeGem.element;

  // MATCHING: Unit element matches gem element
  // Grant: basic spell, AOE, ultimate, and support spell
  if (unitElement === gemElement) {
    return [
      MATCHING_SPELLS[unitElement],
      AOE_SPELLS[unitElement],
      ULTIMATE_SPELLS[unitElement],
      SUPPORT_SPELLS[unitElement],
    ];
  }

  // COUNTER: Unit element counters gem element
  // Grant: defensive ward only
  const counterElement = getCounterElement(gemElement);
  if (unitElement === counterElement) {
    const spell = COUNTER_SPELLS[gemElement]; // Ward against gem's element
    return spell ? [spell] : [];
  }

  // NEUTRAL: No bonus spells
  return [];
}

/**
 * Initialize a unit's learned spells based on their element and active gem
 * Pure function - returns new unit with learnedSpells populated
 * @param unit - Unit to initialize spells for
 * @returns New unit object with learnedSpells populated
 */
export function initializeUnitSpells(unit: PlayerUnit): PlayerUnit {
  // Get spells from element + gem relationship
  const spells = getGrantedSpells(unit.element, unit.activeGemState);

  // Return new unit with populated spells
  return {
    ...unit,
    learnedSpells: spells,
  };
}
