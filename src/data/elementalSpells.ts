/**
 * Elemental Spells
 * 
 * Spells granted by Active Elemental Alignment gem system.
 * - Matching spells: Granted when unit element matches gem element
 * - Counter spells: Granted when unit element counters gem element
 */

import type { Ability, Element } from '../types/game.js';

/**
 * Elemental spells granted when unit element matches gem element
 * Format: [Element]_SPELL (e.g., MARS_SPELL = Fire Blast)
 */
export const MATCHING_SPELLS: Record<Element, Ability> = {
  Mars: {
    id: 'fire_blast',
    name: 'Fire Blast',
    description: 'Unleash a burst of flames at target.',
    mpCost: 8,
    effect: {
      type: 'damage',
      target: 'single_enemy',
      power: 30,
      element: 'fire',
    },
  },
  Venus: {
    id: 'stone_wall',
    name: 'Stone Wall',
    description: 'Raise earthen defense to protect target.',
    mpCost: 8,
    effect: {
      type: 'buff',
      target: 'single_ally',
      power: 0,
      buffStat: 'defense',
      buffAmount: 10,
      buffDuration: 3,
    },
  },
  Jupiter: {
    id: 'lightning_strike',
    name: 'Lightning Strike',
    description: 'Strike foe with bolt of lightning.',
    mpCost: 8,
    effect: {
      type: 'damage',
      target: 'single_enemy',
      power: 25,
      element: 'air',
    },
  },
  Mercury: {
    id: 'healing_wave',
    name: 'Healing Wave',
    description: 'Restore HP with soothing water.',
    mpCost: 10,
    effect: {
      type: 'heal',
      target: 'single_ally',
      power: 20,
      element: 'water',
    },
  },
  Moon: {
    id: 'divine_shield',
    name: 'Divine Shield',
    description: 'Blessed light shields from harm.',
    mpCost: 10,
    effect: {
      type: 'buff',
      target: 'single_ally',
      power: 0,
      buffStat: 'defense',
      buffAmount: 15,
      buffDuration: 3,
    },
  },
  Sun: {
    id: 'shadow_strike',
    name: 'Shadow Strike',
    description: 'Attack from the shadows.',
    mpCost: 8,
    effect: {
      type: 'damage',
      target: 'single_enemy',
      power: 28,
      element: 'physical',
    },
  },
};

/**
 * Counter-element spells (defensive wards)
 * Granted when unit element counters gem element
 * Format: Ward against the GEM's element (not unit's element)
 * Provides +15 defense buff for 3 turns
 */
export const COUNTER_SPELLS: Record<Element, Ability> = {
  Mars: {
    id: 'fire_ward',
    name: 'Fire Ward',
    description: 'Raise defenses against fire attacks.',
    mpCost: 6,
    effect: {
      type: 'buff',
      target: 'self',
      power: 0,
      buffStat: 'defense',
      buffAmount: 15,
      buffDuration: 3,
    },
  },
  Venus: {
    id: 'earth_ward',
    name: 'Earth Ward',
    description: 'Raise defenses against earth attacks.',
    mpCost: 6,
    effect: {
      type: 'buff',
      target: 'self',
      power: 0,
      buffStat: 'defense',
      buffAmount: 15,
      buffDuration: 3,
    },
  },
  Jupiter: {
    id: 'wind_ward',
    name: 'Wind Ward',
    description: 'Raise defenses against wind attacks.',
    mpCost: 6,
    effect: {
      type: 'buff',
      target: 'self',
      power: 0,
      buffStat: 'defense',
      buffAmount: 15,
      buffDuration: 3,
    },
  },
  Mercury: {
    id: 'water_ward',
    name: 'Water Ward',
    description: 'Raise defenses against water attacks.',
    mpCost: 6,
    effect: {
      type: 'buff',
      target: 'self',
      power: 0,
      buffStat: 'defense',
      buffAmount: 15,
      buffDuration: 3,
    },
  },
  Moon: {
    id: 'light_ward',
    name: 'Light Ward',
    description: 'Raise defenses against light attacks.',
    mpCost: 6,
    effect: {
      type: 'buff',
      target: 'self',
      power: 0,
      buffStat: 'defense',
      buffAmount: 15,
      buffDuration: 3,
    },
  },
  Sun: {
    id: 'dark_ward',
    name: 'Dark Ward',
    description: 'Raise defenses against dark attacks.',
    mpCost: 6,
    effect: {
      type: 'buff',
      target: 'self',
      power: 0,
      buffStat: 'defense',
      buffAmount: 15,
      buffDuration: 3,
    },
  },
};

/**
 * Get matching spell for an element
 */
export function getMatchingSpell(element: Element): Ability {
  return MATCHING_SPELLS[element];
}

/**
 * Get counter spell (ward) for an element
 */
export function getCounterSpell(element: Element): Ability {
  return COUNTER_SPELLS[element];
}
