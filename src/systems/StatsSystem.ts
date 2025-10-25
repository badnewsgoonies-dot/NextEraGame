/*
 * StatsSystem: 4-Layer Stats Calculation
 * 
 * Calculates final unit stats from multiple sources:
 * Layer 1: Base stats (from template + level)
 * Layer 2: Rank multiplier (C=1.0x, B=1.15x, A=1.3x, S=1.5x)
 * Layer 3: Class modifiers (subclass percentage bonuses)
 * Layer 4: Equipment bonuses (flat additions)
 * 
 * Note: Gem bonuses are now handled by ElementSystem (party-wide damage bonuses, not stat bonuses)
 * 
 * Pure functions, deterministic, no side effects.
 */

import type { PlayerUnit, ClassModifiers, UnitRank } from '../types/game.js';

export interface CalculatedStats {
  readonly maxHp: number;
  readonly attack: number;
  readonly defense: number;
  readonly speed: number;
  readonly maxMp: number; // Fixed at 50 for now
}

/**
 * Get rank multiplier for base stats
 * - C rank: 1.0x (no bonus)
 * - B rank: 1.15x (+15%)
 * - A rank: 1.30x (+30%)
 * - S rank: 1.50x (+50%)
 */
export function getRankMultiplier(rank: UnitRank): number {
  switch (rank) {
    case 'C': return 1.0;
    case 'B': return 1.15;
    case 'A': return 1.30;
    case 'S': return 1.50;
  }
}

/**
 * Get class modifiers from subclass
 * Each subclass provides percentage bonuses to specific stats
 */
export function getClassModifiers(subclass?: string): ClassModifiers {
  if (!subclass) {
    return { hp: 1.0, attack: 1.0, defense: 1.0, speed: 1.0 };
  }
  
  switch (subclass) {
    case 'Fire Adept':
      return { hp: 1.0, attack: 1.10, defense: 1.0, speed: 1.05 }; // +10% ATK, +5% SPD
    case 'Water Adept':
      return { hp: 1.05, attack: 1.0, defense: 1.10, speed: 1.0 }; // +5% HP, +10% DEF
    case 'Earth Adept':
      return { hp: 1.10, attack: 1.0, defense: 1.15, speed: 1.0 }; // +10% HP, +15% DEF
    case 'Air Adept':
      return { hp: 1.0, attack: 1.05, defense: 1.0, speed: 1.15 }; // +5% ATK, +15% SPD
    case 'Mystic Adept':
      return { hp: 1.05, attack: 1.05, defense: 1.05, speed: 1.05 }; // +5% all stats
    default:
      return { hp: 1.0, attack: 1.0, defense: 1.0, speed: 1.0 };
  }
}

/**
 * MAIN FUNCTION: Calculate final unit stats from all sources
 * 
 * This is the core of the progression system. All stat displays should use this.
 * 
 * Calculation order:
 * 1. Base stats (from unit.hp, unit.maxHp, unit.atk, unit.def, unit.speed)
 * 2. Rank multiplier (percentage increase: C=1.0x, B=1.15x, A=1.3x, S=1.5x)
 * 3. Class modifiers (percentage bonuses from subclass)
 * 4. Equipment bonuses (flat additions - TODO: implement when equipment system is ready)
 * 
 * @param unit - The player unit to calculate stats for
 * @returns Calculated final stats ready for display/combat
 */
export function calculateUnitStats(unit: PlayerUnit): CalculatedStats {
  // Layer 1: Base stats from unit
  // Note: Unit.hp/maxHp/atk/def/speed are the BASE stats (not final)
  const baseStats = {
    hp: unit.maxHp,
    atk: unit.atk,
    def: unit.def,
    spd: unit.speed,
  };
  
  // Layer 2: Apply rank multiplier to base stats
  const rankMultiplier = getRankMultiplier(unit.rank);
  const rankedStats = {
    hp: baseStats.hp * rankMultiplier,
    atk: baseStats.atk * rankMultiplier,
    def: baseStats.def * rankMultiplier,
    spd: baseStats.spd * rankMultiplier,
  };
  
  // Layer 3: Apply class modifiers (percentage bonuses from subclass)
  const classModifiers = getClassModifiers(unit.subclass);
  const classedStats = {
    hp: rankedStats.hp * classModifiers.hp,
    atk: rankedStats.atk * classModifiers.attack,
    def: rankedStats.def * classModifiers.defense,
    spd: rankedStats.spd * classModifiers.speed,
  };
  
  // Layer 4: Equipment bonuses (TODO: implement when equipment system is ready)
  // For now, no equipment bonuses
  
  // Final calculation: Round down to integers
  return {
    maxHp: Math.floor(classedStats.hp),
    attack: Math.floor(classedStats.atk),
    defense: Math.floor(classedStats.def),
    speed: Math.floor(classedStats.spd),
    maxMp: 50, // Fixed for now, can be increased with leveling later
  };
}

/**
 * Helper: Calculate stat breakdown for UI display
 * Shows how each layer contributes to final stats
 */
export interface StatBreakdown {
  readonly base: number;
  readonly fromRank: number;
  readonly fromClass: number;
  readonly fromEquipment: number;
  readonly final: number;
}

export function calculateStatBreakdown(
  unit: PlayerUnit,
  statType: 'hp' | 'attack' | 'defense' | 'speed'
): StatBreakdown {
  const baseStat = statType === 'hp' ? unit.maxHp :
                   statType === 'attack' ? unit.atk :
                   statType === 'defense' ? unit.def :
                   unit.speed;
  
  const rankMult = getRankMultiplier(unit.rank);
  const classMods = getClassModifiers(unit.subclass);
  
  const afterRank = baseStat * rankMult;
  const classMultiplier = statType === 'hp' ? classMods.hp :
                          statType === 'attack' ? classMods.attack :
                          statType === 'defense' ? classMods.defense :
                          classMods.speed;
  const afterClass = afterRank * classMultiplier;
  
  // Equipment bonuses (TODO: implement when equipment system is ready)
  const equipBonus = 0;
  
  return {
    base: baseStat,
    fromRank: Math.floor(afterRank - baseStat),
    fromClass: Math.floor(afterClass - afterRank),
    fromEquipment: equipBonus,
    final: Math.floor(afterClass) + equipBonus,
  };
}

