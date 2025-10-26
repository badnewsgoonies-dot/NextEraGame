/**
 * Elemental Spells
 *
 * Spells granted by Active Elemental Alignment gem system.
 * - Matching spells: Granted when unit element matches gem element
 * - Counter spells: Granted when unit element counters gem element
 * - AOE spells: More expensive, hit all enemies
 * - Ultimate spells: High cost, high power abilities
 *
 * Design:
 * - Basic spells: 6-10 MP, 20-30 power
 * - Advanced spells: 12-15 MP, 35-45 power
 * - AOE spells: 15-20 MP, 25-35 power (lower per-target)
 * - Ultimate spells: 25-30 MP, 50-60 power
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
 * AOE spells (hit all enemies) - Higher MP cost, lower per-target damage
 * Available to all units with matching element
 */
export const AOE_SPELLS: Record<Element, Ability> = {
  Mars: {
    id: 'inferno',
    name: 'Inferno',
    description: 'Engulf all enemies in flames.',
    mpCost: 18,
    effect: {
      type: 'damage',
      target: 'all_enemies',
      power: 28,
      element: 'fire',
    },
  },
  Venus: {
    id: 'earthquake',
    name: 'Earthquake',
    description: 'Shake the earth beneath all foes.',
    mpCost: 18,
    effect: {
      type: 'damage',
      target: 'all_enemies',
      power: 26,
      element: 'earth',
    },
  },
  Jupiter: {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    description: 'Call lightning to strike all enemies.',
    mpCost: 18,
    effect: {
      type: 'damage',
      target: 'all_enemies',
      power: 30,
      element: 'air',
    },
  },
  Mercury: {
    id: 'tidal_wave',
    name: 'Tidal Wave',
    description: 'Summon a wave to crash into all foes.',
    mpCost: 18,
    effect: {
      type: 'damage',
      target: 'all_enemies',
      power: 27,
      element: 'water',
    },
  },
  Moon: {
    id: 'divine_wrath',
    name: 'Divine Wrath',
    description: 'Holy light burns all darkness.',
    mpCost: 18,
    effect: {
      type: 'damage',
      target: 'all_enemies',
      power: 29,
      element: 'physical',
    },
  },
  Sun: {
    id: 'shadow_storm',
    name: 'Shadow Storm',
    description: 'Darkness engulfs all enemies.',
    mpCost: 18,
    effect: {
      type: 'damage',
      target: 'all_enemies',
      power: 28,
      element: 'physical',
    },
  },
};

/**
 * Ultimate single-target spells - High cost, high power
 * Available to units with strong element matching
 */
export const ULTIMATE_SPELLS: Record<Element, Ability> = {
  Mars: {
    id: 'ragnarok',
    name: 'Ragnarok',
    description: 'Apocalyptic flames consume the target.',
    mpCost: 28,
    effect: {
      type: 'damage',
      target: 'single_enemy',
      power: 55,
      element: 'fire',
    },
  },
  Venus: {
    id: 'gaia_hammer',
    name: 'Gaia Hammer',
    description: "The earth's fury crushes the enemy.",
    mpCost: 28,
    effect: {
      type: 'damage',
      target: 'single_enemy',
      power: 52,
      element: 'earth',
    },
  },
  Jupiter: {
    id: 'thor_hammer',
    name: "Thor's Hammer",
    description: 'Divine lightning obliterates the foe.',
    mpCost: 28,
    effect: {
      type: 'damage',
      target: 'single_enemy',
      power: 50,
      element: 'air',
    },
  },
  Mercury: {
    id: 'poseidon_wrath',
    name: "Poseidon's Wrath",
    description: 'Ocean depths drown the enemy.',
    mpCost: 28,
    effect: {
      type: 'damage',
      target: 'single_enemy',
      power: 53,
      element: 'water',
    },
  },
  Moon: {
    id: 'judgement',
    name: 'Judgement',
    description: 'Divine verdict smites the wicked.',
    mpCost: 28,
    effect: {
      type: 'damage',
      target: 'single_enemy',
      power: 54,
      element: 'physical',
    },
  },
  Sun: {
    id: 'death_scythe',
    name: 'Death Scythe',
    description: 'Reaper harvests the soul.',
    mpCost: 28,
    effect: {
      type: 'damage',
      target: 'single_enemy',
      power: 52,
      element: 'physical',
    },
  },
};

/**
 * Party-wide healing and support spells
 * Available to healers with matching elements
 */
export const SUPPORT_SPELLS: Record<Element, Ability> = {
  Mars: {
    id: 'battle_cry',
    name: 'Battle Cry',
    description: 'Inspire allies with fiery determination.',
    mpCost: 15,
    effect: {
      type: 'buff',
      target: 'all_allies',
      power: 0,
      buffStat: 'attack',
      buffAmount: 8,
      buffDuration: 3,
    },
  },
  Venus: {
    id: 'ironclad',
    name: 'Ironclad',
    description: 'Fortify all allies with earthen armor.',
    mpCost: 15,
    effect: {
      type: 'buff',
      target: 'all_allies',
      power: 0,
      buffStat: 'defense',
      buffAmount: 12,
      buffDuration: 3,
    },
  },
  Jupiter: {
    id: 'wind_walk',
    name: 'Wind Walk',
    description: 'Wind hastens all allies.',
    mpCost: 15,
    effect: {
      type: 'buff',
      target: 'all_allies',
      power: 0,
      buffStat: 'speed',
      buffAmount: 10,
      buffDuration: 3,
    },
  },
  Mercury: {
    id: 'cure_well',
    name: 'Cure Well',
    description: 'Healing waters restore all allies.',
    mpCost: 22,
    effect: {
      type: 'heal',
      target: 'all_allies',
      power: 35,
      element: 'water',
    },
  },
  Moon: {
    id: 'revitalize',
    name: 'Revitalize',
    description: 'Divine blessing restores party.',
    mpCost: 22,
    effect: {
      type: 'heal',
      target: 'all_allies',
      power: 38,
      element: 'physical',
    },
  },
  Sun: {
    id: 'dark_pact',
    name: 'Dark Pact',
    description: 'Shadow magic empowers allies.',
    mpCost: 15,
    effect: {
      type: 'buff',
      target: 'all_allies',
      power: 0,
      buffStat: 'attack',
      buffAmount: 10,
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

/**
 * Get AOE spell for an element
 */
export function getAOESpell(element: Element): Ability {
  return AOE_SPELLS[element];
}

/**
 * Get ultimate spell for an element
 */
export function getUltimateSpell(element: Element): Ability {
  return ULTIMATE_SPELLS[element];
}

/**
 * Get support spell for an element
 */
export function getSupportSpell(element: Element): Ability {
  return SUPPORT_SPELLS[element];
}

/**
 * Get all available spells for an element
 * Includes: basic matching, AOE, ultimate, and support spells
 */
export function getAllSpellsForElement(element: Element): Ability[] {
  return [
    MATCHING_SPELLS[element],
    AOE_SPELLS[element],
    ULTIMATE_SPELLS[element],
    SUPPORT_SPELLS[element],
  ];
}
