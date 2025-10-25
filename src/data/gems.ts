/**
 * Elemental Gem Data
 * 
 * Six elemental gems for Active Elemental Alignment system.
 * ONE gem is selected at run start (after team building).
 * 
 * Counter relationships:
 * - Fire ↔ Water (Mars ↔ Mercury)
 * - Earth ↔ Wind (Venus ↔ Jupiter)  
 * - Light ↔ Dark (Moon ↔ Sun)
 * 
 * Bonuses applied at battle start:
 * - Matching element: +15% damage/healing
 * - Neutral element: +5% damage/healing
 * - Counter element: -5% damage/healing
 */

import type { Element, ElementalGem } from '../types/game';

/**
 * Venus - Earth Element
 */
export const VENUS_GEM: ElementalGem = {
  id: 'venus',
  name: 'Venus',
  element: 'Venus',
  description: 'Grants power over earth and nature. Strengthens defensive abilities.',
  icon: '🌍',
};

/**
 * Mars - Fire Element
 */
export const MARS_GEM: ElementalGem = {
  id: 'mars',
  name: 'Mars',
  element: 'Mars',
  description: 'Grants power over fire and heat. Strengthens offensive abilities.',
  icon: '🔥',
};

/**
 * Jupiter - Wind Element
 */
export const JUPITER_GEM: ElementalGem = {
  id: 'jupiter',
  name: 'Jupiter',
  element: 'Jupiter',
  description: 'Grants power over wind and lightning. Strengthens speed and agility.',
  icon: '⚡',
};

/**
 * Mercury - Water Element
 */
export const MERCURY_GEM: ElementalGem = {
  id: 'mercury',
  name: 'Mercury',
  element: 'Mercury',
  description: 'Grants power over water and ice. Strengthens healing and support.',
  icon: '💧',
};

/**
 * Moon - Light Element
 */
export const MOON_GEM: ElementalGem = {
  id: 'moon',
  name: 'Moon',
  element: 'Moon',
  description: 'Grants power over light and purity. Strengthens divine abilities.',
  icon: '🌙',
};

/**
 * Sun - Dark Element
 */
export const SUN_GEM: ElementalGem = {
  id: 'sun',
  name: 'Sun',
  element: 'Sun',
  description: 'Grants power over darkness and shadow. Strengthens debuff abilities.',
  icon: '☀️',
};

/**
 * All available gems
 */
export const ALL_GEMS: readonly ElementalGem[] = [
  VENUS_GEM,
  MARS_GEM,
  JUPITER_GEM,
  MERCURY_GEM,
  MOON_GEM,
  SUN_GEM,
] as const;

/**
 * Element counter relationships (bidirectional)
 * Fire ↔ Water, Earth ↔ Wind, Light ↔ Dark
 */
const ELEMENT_COUNTERS: Record<Element, Element> = {
  Venus: 'Jupiter',   // Earth ↔ Wind
  Jupiter: 'Venus',   // Wind ↔ Earth
  Mars: 'Mercury',    // Fire ↔ Water
  Mercury: 'Mars',    // Water ↔ Fire
  Moon: 'Sun',        // Light ↔ Dark
  Sun: 'Moon',        // Dark ↔ Light
} as const;

/**
 * Get the counter element for a given element
 * @param element - Element to find counter for
 * @returns Counter element
 */
export function getCounterElement(element: Element): Element {
  return ELEMENT_COUNTERS[element];
}

/**
 * Check if two elements counter each other
 * @param element1 - First element
 * @param element2 - Second element
 * @returns true if elements counter each other
 */
export function isCounterElement(element1: Element, element2: Element): boolean {
  return ELEMENT_COUNTERS[element1] === element2;
}

/**
 * Get gem by element
 * @param element - Element to find gem for
 * @returns Gem with matching element, or undefined if not found
 */
export function getGemByElement(element: Element): ElementalGem | undefined {
  return ALL_GEMS.find(gem => gem.element === element);
}

/**
 * Get gem by ID
 * @param id - Gem ID to find
 * @returns Gem with matching ID, or undefined if not found
 */
export function getGemById(id: string): ElementalGem | undefined {
  return ALL_GEMS.find(gem => gem.id === id);
}

