/**
 * Global Gem System Data - Redesigned
 *
 * ONE gem is selected at game start (after roster selection).
 * Provides:
 * - Global party-wide stat bonuses based on elemental affinity
 * - Spells granted to units based on element matching
 * - Battle super spell (one-time use per battle)
 *
 * Element counter relationships:
 * - Mars (Fire) ↔ Mercury (Water)
 * - Jupiter (Wind) ↔ Venus (Earth)
 * - Moon (Light) ↔ Sun (Dark)
 */

import type { GlobalGem, Element, ElementAffinity, StatBonus } from '../types/game.js';

// ============================================
// Stat Bonus Presets
// ============================================

const STRONG_BONUS: StatBonus = {
  atk: 15,
  def: 10,
  matk: 15,
  hp: 20,
  mp: 15,
  spd: 5,
};

const NEUTRAL_BONUS: StatBonus = {
  atk: 5,
  def: 3,
  matk: 5,
  hp: 10,
  mp: 5,
  spd: 2,
};

const WEAK_BONUS: StatBonus = {
  atk: -5,
  def: -3,
  matk: -5,
  hp: -10,
  mp: 0,
  spd: -2,
};

// ============================================
// Mars Gem (Fire Element)
// ============================================

export const MARS_GEM: GlobalGem = {
  id: 'mars-gem',
  element: 'Mars',
  name: 'Mars Gem',
  description: 'Harness the power of fire. Strengthens offensive abilities and burns enemies.',
  icon: '🔥',

  strongBonus: STRONG_BONUS,
  neutralBonus: NEUTRAL_BONUS,
  weakBonus: WEAK_BONUS,

  sameElementSpell: {
    id: 'fireball',
    name: 'Fireball',
    description: 'Launch a blazing ball of fire at a single enemy',
    mpCost: 8,
    power: 50,
    element: 'Mars',
    target: 'single_enemy',
  },

  counterElementSpell: {
    id: 'water-blast',
    name: 'Water Blast',
    description: 'Unleash a powerful torrent of water at a single enemy',
    mpCost: 8,
    power: 50,
    element: 'Mercury',
    target: 'single_enemy',
  },

  superSpell: {
    id: 'inferno',
    name: 'Inferno',
    description: 'Rain devastating fire upon all enemies',
    effect: 'aoe_damage',
    power: 100,
    element: 'Mars',
  },
};

// ============================================
// Mercury Gem (Water Element)
// ============================================

export const MERCURY_GEM: GlobalGem = {
  id: 'mercury-gem',
  element: 'Mercury',
  name: 'Mercury Gem',
  description: 'Command the power of water. Strengthens healing and purifies the party.',
  icon: '💧',

  strongBonus: STRONG_BONUS,
  neutralBonus: NEUTRAL_BONUS,
  weakBonus: WEAK_BONUS,

  sameElementSpell: {
    id: 'ply',
    name: 'Ply',
    description: 'Restore health to a single ally with soothing water',
    mpCost: 7,
    power: 40,
    element: 'Mercury',
    target: 'single_ally',
  },

  counterElementSpell: {
    id: 'flame-strike',
    name: 'Flame Strike',
    description: 'Strike an enemy with concentrated flame',
    mpCost: 8,
    power: 50,
    element: 'Mars',
    target: 'single_enemy',
  },

  superSpell: {
    id: 'divine-cleanse',
    name: 'Divine Cleanse',
    description: 'Fully heal the party and remove all debuffs',
    effect: 'party_heal',
    power: 120,
    element: 'Mercury',
  },
};

// ============================================
// Jupiter Gem (Wind Element)
// ============================================

export const JUPITER_GEM: GlobalGem = {
  id: 'jupiter-gem',
  element: 'Jupiter',
  name: 'Jupiter Gem',
  description: 'Channel the power of wind and lightning. Enhances speed and agility.',
  icon: '⚡',

  strongBonus: STRONG_BONUS,
  neutralBonus: NEUTRAL_BONUS,
  weakBonus: WEAK_BONUS,

  sameElementSpell: {
    id: 'bolt',
    name: 'Bolt',
    description: 'Strike an enemy with a lightning bolt from the sky',
    mpCost: 8,
    power: 50,
    element: 'Jupiter',
    target: 'single_enemy',
  },

  counterElementSpell: {
    id: 'rockfall',
    name: 'Rockfall',
    description: 'Summon rocks to crush a single enemy',
    mpCost: 8,
    power: 50,
    element: 'Venus',
    target: 'single_enemy',
  },

  superSpell: {
    id: 'tempest-rush',
    name: 'Tempest Rush',
    description: 'Grant the party immense speed and evasion',
    effect: 'party_buff',
    power: 50,
    element: 'Jupiter',
  },
};

// ============================================
// Venus Gem (Earth Element)
// ============================================

export const VENUS_GEM: GlobalGem = {
  id: 'venus-gem',
  element: 'Venus',
  name: 'Venus Gem',
  description: 'Wield the power of earth and nature. Strengthens defense and endurance.',
  icon: '🌍',

  strongBonus: STRONG_BONUS,
  neutralBonus: NEUTRAL_BONUS,
  weakBonus: WEAK_BONUS,

  sameElementSpell: {
    id: 'quake',
    name: 'Quake',
    description: 'Cause the earth to shake beneath a single enemy',
    mpCost: 8,
    power: 50,
    element: 'Venus',
    target: 'single_enemy',
  },

  counterElementSpell: {
    id: 'gale',
    name: 'Gale',
    description: 'Summon a powerful wind to strike an enemy',
    mpCost: 8,
    power: 50,
    element: 'Jupiter',
    target: 'single_enemy',
  },

  superSpell: {
    id: 'earth-barrier',
    name: 'Earth Barrier',
    description: 'Raise a protective barrier and boost party defense',
    effect: 'party_buff',
    power: 60,
    element: 'Venus',
  },
};

// ============================================
// Moon Gem (Light Element)
// ============================================

export const MOON_GEM: GlobalGem = {
  id: 'moon-gem',
  element: 'Moon',
  name: 'Moon Gem',
  description: 'Invoke the power of light and purity. Enhances divine abilities and resurrection.',
  icon: '🌙',

  strongBonus: STRONG_BONUS,
  neutralBonus: NEUTRAL_BONUS,
  weakBonus: WEAK_BONUS,

  sameElementSpell: {
    id: 'wish',
    name: 'Wish',
    description: 'Restore health to a single ally with divine light',
    mpCost: 7,
    power: 40,
    element: 'Moon',
    target: 'single_ally',
  },

  counterElementSpell: {
    id: 'darkness',
    name: 'Darkness',
    description: 'Engulf an enemy in shadow to deal damage',
    mpCost: 8,
    power: 50,
    element: 'Sun',
    target: 'single_enemy',
  },

  superSpell: {
    id: 'revive',
    name: 'Revive',
    description: 'Massively heal the party and revive fallen allies',
    effect: 'revive',
    power: 150,
    element: 'Moon',
  },
};

// ============================================
// Sun Gem (Dark Element)
// ============================================

export const SUN_GEM: GlobalGem = {
  id: 'sun-gem',
  element: 'Sun',
  name: 'Sun Gem',
  description: 'Master the power of darkness and shadow. Strengthens debuffs and drains foes.',
  icon: '☀️',

  strongBonus: STRONG_BONUS,
  neutralBonus: NEUTRAL_BONUS,
  weakBonus: WEAK_BONUS,

  sameElementSpell: {
    id: 'drain',
    name: 'Drain',
    description: 'Drain life force from an enemy to damage them',
    mpCost: 8,
    power: 50,
    element: 'Sun',
    target: 'single_enemy',
  },

  counterElementSpell: {
    id: 'purge',
    name: 'Purge',
    description: 'Purify an enemy with holy light to deal damage',
    mpCost: 8,
    power: 50,
    element: 'Moon',
    target: 'single_enemy',
  },

  superSpell: {
    id: 'eclipse',
    name: 'Eclipse',
    description: 'Shroud all enemies in darkness, dealing damage and debuffing them',
    effect: 'enemy_debuff',
    power: 100,
    element: 'Sun',
  },
};

// ============================================
// All Gems Catalog
// ============================================

export const ALL_GLOBAL_GEMS: readonly GlobalGem[] = [
  MARS_GEM,
  MERCURY_GEM,
  JUPITER_GEM,
  VENUS_GEM,
  MOON_GEM,
  SUN_GEM,
] as const;

// ============================================
// Element Counter Relationships
// ============================================

const ELEMENT_COUNTERS: Record<Element, Element> = {
  Venus: 'Jupiter',   // Earth ↔ Wind
  Jupiter: 'Venus',   // Wind ↔ Earth
  Mars: 'Mercury',    // Fire ↔ Water
  Mercury: 'Mars',    // Water ↔ Fire
  Moon: 'Sun',        // Light ↔ Dark
  Sun: 'Moon',        // Dark ↔ Light
} as const;

// ============================================
// Helper Functions
// ============================================

/**
 * Get the counter element for a given element
 */
export function getCounterElement(element: Element): Element {
  return ELEMENT_COUNTERS[element];
}

/**
 * Check if two elements counter each other
 */
export function isCounterElement(element1: Element, element2: Element): boolean {
  return ELEMENT_COUNTERS[element1] === element2;
}

/**
 * Calculate elemental affinity between unit and gem
 * @param unitElement - Unit's elemental affinity
 * @param gemElement - Selected gem's element
 * @returns 'strong' if same element, 'weak' if counter element, 'neutral' otherwise
 */
export function calculateAffinity(unitElement: Element, gemElement: Element): ElementAffinity {
  if (unitElement === gemElement) {
    return 'strong';
  }

  if (isCounterElement(unitElement, gemElement)) {
    return 'weak';
  }

  return 'neutral';
}

/**
 * Get gem by ID
 */
export function getGemById(id: string): GlobalGem | undefined {
  return ALL_GLOBAL_GEMS.find(gem => gem.id === id);
}

/**
 * Get gem by element
 */
export function getGemByElement(element: Element): GlobalGem | undefined {
  return ALL_GLOBAL_GEMS.find(gem => gem.element === element);
}
