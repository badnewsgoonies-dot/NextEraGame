/**
 * Gem Activation Abilities
 * 
 * Party-wide effects triggered when player activates gem mid-battle.
 * Removes bonuses but keeps spells, triggers powerful effect.
 */

import type { Element } from '../types/game.js';

/**
 * Gem activation abilities (party-wide effects)
 * Used when player activates gem mid-battle
 */
export interface GemActivation {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly effect: 'aoe_damage' | 'party_heal' | 'party_buff' | 'enemy_debuff';
  readonly power: number; // Damage/heal amount or buff percentage
  readonly target: 'all_enemies' | 'all_allies';
}

export const GEM_ACTIVATIONS: Record<Element, GemActivation> = {
  Mars: {
    id: 'volcanic_eruption',
    name: 'Volcanic Eruption',
    description: 'Explosive fire engulfs all foes.',
    effect: 'aoe_damage',
    power: 50,
    target: 'all_enemies',
  },
  Venus: {
    id: 'earthquake',
    name: 'Earthquake',
    description: 'Tremors shake the battlefield, weakening enemies.',
    effect: 'aoe_damage',
    power: 40,
    target: 'all_enemies',
  },
  Jupiter: {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    description: 'Lightning strikes all enemies.',
    effect: 'aoe_damage',
    power: 45,
    target: 'all_enemies',
  },
  Mercury: {
    id: 'tidal_wave',
    name: 'Tidal Wave',
    description: 'Crashing water damages and cleanses debuffs.',
    effect: 'aoe_damage',
    power: 35,
    target: 'all_enemies',
  },
  Moon: {
    id: 'lunar_blessing',
    name: 'Lunar Blessing',
    description: 'Moonlight heals and purifies the party.',
    effect: 'party_heal',
    power: 30,
    target: 'all_allies',
  },
  Sun: {
    id: 'solar_flare',
    name: 'Solar Flare',
    description: 'Blinding light scorches and blinds enemies.',
    effect: 'aoe_damage',
    power: 55,
    target: 'all_enemies',
  },
};

/**
 * Get activation ability for an element
 */
export function getGemActivation(element: Element): GemActivation {
  return GEM_ACTIVATIONS[element];
}
