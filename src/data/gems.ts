/*
 * Gem Catalog: Golden Sun Djinn-inspired Progression System
 * 
 * 6 gems with unique abilities and passive bonuses:
 * - Ruby (Fire): Attack focus
 * - Topaz (Fire AoE): Area damage
 * - Emerald (Earth): Defense focus
 * - Sapphire (Water): Healing
 * - Citrine (Air): Speed focus
 * - Amethyst (Mystic): Utility/cleanse
 * 
 * Each gem provides:
 * 1. Passive stat bonus (only when active)
 * 2. Granted ability (permanent while equipped)
 * 3. Gem effect (one-time powerful effect, deactivates gem)
 * 4. Subclass (grants class modifiers)
 */

import type { Ability, Subclass, GemPassiveBonus } from '../types/game.js';

/**
 * Gem effect (one-time powerful effect that deactivates the gem)
 */
export interface GemEffect {
  readonly type: 'damage' | 'heal' | 'buff' | 'debuff_remove';
  readonly target: 'single_enemy' | 'all_enemies' | 'single_ally' | 'all_allies';
  readonly power: number;
  readonly buffStat?: 'attack' | 'defense' | 'speed';
  readonly buffAmount?: number;
  readonly buffDuration?: number;
}

/**
 * Complete gem specification
 */
export interface GemSpec {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly iconColor: string; // Tailwind color class for UI
  
  // What subclass does this gem grant?
  readonly grantsSubclass: Subclass;
  
  // Passive stat bonus (only when gem is active)
  readonly passiveBonus: GemPassiveBonus;
  
  // Ability granted by this gem (permanent when equipped, costs MP)
  readonly grantedAbility: Ability;
  
  // One-time gem effect (powerful but deactivates gem until next battle)
  readonly gemEffect: GemEffect;
  
  // Future: For combination/summon system
  readonly combinationElement?: 'fire' | 'water' | 'earth' | 'air';
  readonly combinationPower?: number; // 1-3
}

// ============================================
// GEM CATALOG - 6 Gems
// ============================================

export const GEM_CATALOG: readonly GemSpec[] = [
  // ===== FIRE GEMS (2) =====
  
  /**
   * Ruby Gem - Single-target fire attack
   * Focus: Pure damage output
   */
  {
    id: 'ruby_gem',
    name: 'Ruby Gem',
    description: 'A fiery red gem pulsing with heat. Grants fire mastery and devastating single-target power.',
    iconColor: 'text-red-500',
    grantsSubclass: 'Fire Adept',
    passiveBonus: { attack: 5 }, // +5 ATK when active
    grantedAbility: {
      id: 'fireball',
      name: 'Fireball',
      description: 'Hurl a ball of flame at one enemy',
      mpCost: 20,
      effect: {
        type: 'damage',
        target: 'single_enemy',
        power: 35,
        element: 'fire',
      },
    },
    gemEffect: {
      type: 'damage',
      target: 'single_enemy',
      power: 50, // More powerful than the ability!
    },
    combinationElement: 'fire',
    combinationPower: 1,
  },
  
  /**
   * Topaz Gem - Area fire attack
   * Focus: Multi-target damage
   */
  {
    id: 'topaz_gem',
    name: 'Topaz Gem',
    description: 'An amber gem crackling with energy. Spreads flames wide across the battlefield.',
    iconColor: 'text-orange-500',
    grantsSubclass: 'Fire Adept',
    passiveBonus: { attack: 3, speed: 2 }, // +3 ATK, +2 SPD when active
    grantedAbility: {
      id: 'flame_wall',
      name: 'Flame Wall',
      description: 'Engulf all enemies in flames',
      mpCost: 25,
      effect: {
        type: 'damage',
        target: 'all_enemies',
        power: 20, // Lower per-target but hits everyone
        element: 'fire',
      },
    },
    gemEffect: {
      type: 'damage',
      target: 'all_enemies',
      power: 30, // Strong AoE
    },
    combinationElement: 'fire',
    combinationPower: 2,
  },
  
  // ===== EARTH GEM (1) =====
  
  /**
   * Emerald Gem - Defense buff
   * Focus: Protection and durability
   */
  {
    id: 'emerald_gem',
    name: 'Emerald Gem',
    description: 'A verdant gem solid as stone. Grants earthen protection and fortitude.',
    iconColor: 'text-green-500',
    grantsSubclass: 'Earth Adept',
    passiveBonus: { defense: 5 }, // +5 DEF when active
    grantedAbility: {
      id: 'stone_wall',
      name: 'Stone Wall',
      description: 'Fortify yourself with earth magic',
      mpCost: 15,
      effect: {
        type: 'buff',
        target: 'self',
        power: 0,
        buffStat: 'defense',
        buffAmount: 20,
        buffDuration: 3, // Lasts 3 turns
      },
    },
    gemEffect: {
      type: 'buff',
      target: 'all_allies',
      power: 0,
      buffStat: 'defense',
      buffAmount: 20,
      buffDuration: 3, // Party-wide defense buff!
    },
    combinationElement: 'earth',
    combinationPower: 1,
  },
  
  // ===== WATER GEM (1) =====
  
  /**
   * Sapphire Gem - Healing
   * Focus: HP restoration
   */
  {
    id: 'sapphire_gem',
    name: 'Sapphire Gem',
    description: 'A deep blue gem flowing with life. Grants healing waters and restoration.',
    iconColor: 'text-blue-500',
    grantsSubclass: 'Water Adept',
    passiveBonus: { defense: 3, hp: 10 }, // +3 DEF, +10 HP when active
    grantedAbility: {
      id: 'cure',
      name: 'Cure',
      description: 'Restore health with soothing water',
      mpCost: 15,
      effect: {
        type: 'heal',
        target: 'single_ally',
        power: 30, // Restores 30 HP
        element: 'water',
      },
    },
    gemEffect: {
      type: 'heal',
      target: 'all_allies',
      power: 40, // Party-wide healing!
    },
    combinationElement: 'water',
    combinationPower: 1,
  },
  
  // ===== AIR GEM (1) =====
  
  /**
   * Citrine Gem - Speed buff
   * Focus: Turn order manipulation
   */
  {
    id: 'citrine_gem',
    name: 'Citrine Gem',
    description: 'A brilliant yellow gem swift as wind. Grants air mastery and incredible speed.',
    iconColor: 'text-yellow-500',
    grantsSubclass: 'Air Adept',
    passiveBonus: { speed: 5 }, // +5 SPD when active
    grantedAbility: {
      id: 'haste',
      name: 'Haste',
      description: 'Accelerate an ally with wind magic',
      mpCost: 20,
      effect: {
        type: 'buff',
        target: 'single_ally',
        power: 0,
        buffStat: 'speed',
        buffAmount: 20,
        buffDuration: 3,
      },
    },
    gemEffect: {
      type: 'buff',
      target: 'all_allies',
      power: 0,
      buffStat: 'speed',
      buffAmount: 30, // Strong party-wide speed boost!
      buffDuration: 2,
    },
    combinationElement: 'air',
    combinationPower: 1,
  },
  
  // ===== MYSTIC GEM (1) =====
  
  /**
   * Amethyst Gem - Utility/cleanse
   * Focus: Debuff removal and support
   */
  {
    id: 'amethyst_gem',
    name: 'Amethyst Gem',
    description: 'A mystic purple gem humming with arcane power. Cleanses harmful effects and protects allies.',
    iconColor: 'text-purple-500',
    grantsSubclass: 'Mystic Adept',
    passiveBonus: { hp: 5, attack: 3 }, // +5 HP, +3 ATK when active
    grantedAbility: {
      id: 'cleanse',
      name: 'Cleanse',
      description: 'Remove all harmful effects from an ally',
      mpCost: 10,
      effect: {
        type: 'debuff_remove',
        target: 'single_ally',
        power: 0, // Doesn't deal damage/heal
      },
    },
    gemEffect: {
      type: 'debuff_remove',
      target: 'all_allies',
      power: 20, // Party cleanse + 20 HP heal!
    },
    combinationPower: 0, // Utility gem, doesn't count for combinations
  },
];

/**
 * Helper: Get gem specification by ID
 */
export function getGemById(id: string): GemSpec | undefined {
  return GEM_CATALOG.find(gem => gem.id === id);
}

/**
 * Helper: Get all gems of a specific element
 */
export function getGemsByElement(element: 'fire' | 'water' | 'earth' | 'air'): readonly GemSpec[] {
  return GEM_CATALOG.filter(gem => gem.combinationElement === element);
}

/**
 * Helper: Get gem icon/color for UI rendering
 */
export function getGemIcon(gemId: string): { emoji: string; color: string } {
  const icons: Record<string, { emoji: string; color: string }> = {
    ruby_gem: { emoji: '💎', color: 'text-red-500' },
    topaz_gem: { emoji: '💎', color: 'text-orange-500' },
    emerald_gem: { emoji: '💎', color: 'text-green-500' },
    sapphire_gem: { emoji: '💎', color: 'text-blue-500' },
    citrine_gem: { emoji: '💎', color: 'text-yellow-500' },
    amethyst_gem: { emoji: '💎', color: 'text-purple-500' },
  };
  return icons[gemId] || { emoji: '💎', color: 'text-gray-500' };
}

