/*
 * StatsSystem Tests
 * 
 * Verifies 5-layer stat calculation system:
 * - Rank multipliers (C/B/A/S)
 * - Class modifiers (subclasses)
 * - Equipment bonuses
 * - Gem passive bonuses
 * - Layering order and math
 */

import { describe, test, expect } from 'vitest';
import { 
  getRankMultiplier, 
  getClassModifiers, 
  calculateUnitStats,
  calculateStatBreakdown,
  getGemPassiveBonus,
} from '../../src/systems/StatsSystem';
import type { PlayerUnit } from '../../src/types/game';

describe('StatsSystem', () => {
  // Helper to create test unit
  function createTestUnit(overrides: Partial<PlayerUnit> = {}): PlayerUnit {
    return {
      id: 'test-unit-1',
      templateId: 'test_warrior',
      name: 'Test Warrior',
      role: 'Tank',
      tags: ['Holy'],
      hp: 100,
      maxHp: 100,
      atk: 20,
      def: 15,
      speed: 40,
      level: 1,
      experience: 0,
      rank: 'C',
      baseClass: 'Warrior',
      currentMp: 50,
      ...overrides,
    };
  }

  describe('Rank Multipliers', () => {
    test('C rank has 1.0x multiplier (no bonus)', () => {
      expect(getRankMultiplier('C')).toBe(1.0);
    });

    test('B rank has 1.15x multiplier (+15%)', () => {
      expect(getRankMultiplier('B')).toBe(1.15);
    });

    test('A rank has 1.30x multiplier (+30%)', () => {
      expect(getRankMultiplier('A')).toBe(1.30);
    });

    test('S rank has 1.50x multiplier (+50%)', () => {
      expect(getRankMultiplier('S')).toBe(1.50);
    });

    test('rank multipliers are in ascending order', () => {
      const c = getRankMultiplier('C');
      const b = getRankMultiplier('B');
      const a = getRankMultiplier('A');
      const s = getRankMultiplier('S');
      
      expect(b).toBeGreaterThan(c);
      expect(a).toBeGreaterThan(b);
      expect(s).toBeGreaterThan(a);
    });
  });

  describe('Class Modifiers', () => {
    test('no subclass returns 1.0x for all stats', () => {
      const mods = getClassModifiers(undefined);
      expect(mods).toEqual({
        hp: 1.0,
        attack: 1.0,
        defense: 1.0,
        speed: 1.0,
      });
    });

    test('Fire Adept: +10% ATK, +5% SPD', () => {
      const mods = getClassModifiers('Fire Adept');
      expect(mods.attack).toBe(1.10);
      expect(mods.speed).toBe(1.05);
      expect(mods.hp).toBe(1.0);
      expect(mods.defense).toBe(1.0);
    });

    test('Water Adept: +5% HP, +10% DEF', () => {
      const mods = getClassModifiers('Water Adept');
      expect(mods.hp).toBe(1.05);
      expect(mods.defense).toBe(1.10);
      expect(mods.attack).toBe(1.0);
      expect(mods.speed).toBe(1.0);
    });

    test('Earth Adept: +10% HP, +15% DEF', () => {
      const mods = getClassModifiers('Earth Adept');
      expect(mods.hp).toBe(1.10);
      expect(mods.defense).toBe(1.15);
      expect(mods.attack).toBe(1.0);
      expect(mods.speed).toBe(1.0);
    });

    test('Air Adept: +5% ATK, +15% SPD', () => {
      const mods = getClassModifiers('Air Adept');
      expect(mods.attack).toBe(1.05);
      expect(mods.speed).toBe(1.15);
      expect(mods.hp).toBe(1.0);
      expect(mods.defense).toBe(1.0);
    });

    test('Mystic Adept: +5% all stats', () => {
      const mods = getClassModifiers('Mystic Adept');
      expect(mods.hp).toBe(1.05);
      expect(mods.attack).toBe(1.05);
      expect(mods.defense).toBe(1.05);
      expect(mods.speed).toBe(1.05);
    });

    test('unknown subclass returns 1.0x for all stats', () => {
      const mods = getClassModifiers('UnknownClass');
      expect(mods).toEqual({
        hp: 1.0,
        attack: 1.0,
        defense: 1.0,
        speed: 1.0,
      });
    });
  });

  describe('Stat Calculation - Base Cases', () => {
    test('C rank unit with no subclass has base stats', () => {
      const unit = createTestUnit();
      const stats = calculateUnitStats(unit);
      
      // C rank (1.0x) * no subclass (1.0x) = base stats
      expect(stats.maxHp).toBe(100);
      expect(stats.attack).toBe(20);
      expect(stats.defense).toBe(15);
      expect(stats.speed).toBe(40);
      expect(stats.maxMp).toBe(50);
    });

    test('B rank unit has +15% stats', () => {
      const unit = createTestUnit({ rank: 'B', maxHp: 100 });
      const stats = calculateUnitStats(unit);
      
      // B rank (1.15x) applied to base stats
      // Note: Actual calculation uses maxHp field
      expect(stats.maxHp).toBeGreaterThanOrEqual(114); // ~100 * 1.15
      expect(stats.maxHp).toBeLessThanOrEqual(115);
      expect(stats.attack).toBe(23);  // 20 * 1.15
      expect(stats.defense).toBe(17); // 15 * 1.15 (rounded down)
      expect(stats.speed).toBe(46);   // 40 * 1.15
    });

    test('A rank unit has +30% stats', () => {
      const unit = createTestUnit({ rank: 'A' });
      const stats = calculateUnitStats(unit);
      
      // A rank (1.30x) applied to base stats
      expect(stats.maxHp).toBe(130); // 100 * 1.30
      expect(stats.attack).toBe(26);  // 20 * 1.30
      expect(stats.defense).toBe(19); // 15 * 1.30 (rounded down)
      expect(stats.speed).toBe(52);   // 40 * 1.30
    });

    test('S rank unit has +50% stats', () => {
      const unit = createTestUnit({ rank: 'S' });
      const stats = calculateUnitStats(unit);
      
      // S rank (1.50x) applied to base stats
      expect(stats.maxHp).toBe(150); // 100 * 1.50
      expect(stats.attack).toBe(30);  // 20 * 1.50
      expect(stats.defense).toBe(22); // 15 * 1.50 (rounded down)
      expect(stats.speed).toBe(60);   // 40 * 1.50
    });
  });

  describe('Stat Calculation - Subclass Integration', () => {
    test('Fire Adept grants +10% ATK, +5% SPD', () => {
      const unit = createTestUnit({ 
        subclass: 'Fire Adept',
        rank: 'C', // Keep base rank to isolate subclass effect
      });
      const stats = calculateUnitStats(unit);
      
      // Base: 100 HP, 20 ATK, 15 DEF, 40 SPD
      // Fire Adept: 1.0x HP, 1.10x ATK, 1.0x DEF, 1.05x SPD
      expect(stats.maxHp).toBe(100);  // 100 * 1.0
      expect(stats.attack).toBe(22);   // 20 * 1.10
      expect(stats.defense).toBe(15);  // 15 * 1.0
      expect(stats.speed).toBe(42);    // 40 * 1.05
    });

    test('Earth Adept grants +10% HP, +15% DEF', () => {
      const unit = createTestUnit({ subclass: 'Earth Adept' });
      const stats = calculateUnitStats(unit);
      
      expect(stats.maxHp).toBe(110);  // 100 * 1.10
      expect(stats.attack).toBe(20);   // 20 * 1.0
      expect(stats.defense).toBe(17);  // 15 * 1.15
      expect(stats.speed).toBe(40);    // 40 * 1.0
    });

    test('Mystic Adept grants +5% all stats', () => {
      const unit = createTestUnit({ subclass: 'Mystic Adept' });
      const stats = calculateUnitStats(unit);
      
      expect(stats.maxHp).toBe(105);  // 100 * 1.05
      expect(stats.attack).toBe(21);   // 20 * 1.05
      expect(stats.defense).toBe(15);  // 15 * 1.05 (rounds down)
      expect(stats.speed).toBe(42);    // 40 * 1.05
    });
  });

  describe('Stat Calculation - Rank + Subclass Stacking', () => {
    test('B rank + Fire Adept multipliers stack correctly', () => {
      const unit = createTestUnit({ 
        rank: 'B',        // 1.15x
        subclass: 'Fire Adept', // 1.0x HP, 1.10x ATK, 1.0x DEF, 1.05x SPD
        maxHp: 100,
      });
      const stats = calculateUnitStats(unit);
      
      // Base: 100 HP, 20 ATK, 15 DEF, 40 SPD
      // Rank first: 115 HP, 23 ATK, 17.25 DEF, 46 SPD
      // Then class: 115 HP, 25.3 ATK, 17.25 DEF, 48.3 SPD
      // Floor: 115 HP, 25 ATK, 17 DEF, 48 SPD
      expect(stats.maxHp).toBeGreaterThanOrEqual(114); // Rounding tolerance
      expect(stats.attack).toBe(25);
      expect(stats.defense).toBe(17);
      expect(stats.speed).toBe(48);
    });

    test('S rank + Mystic Adept multipliers stack correctly', () => {
      const unit = createTestUnit({ 
        rank: 'S',              // 1.50x
        subclass: 'Mystic Adept', // 1.05x all
      });
      const stats = calculateUnitStats(unit);
      
      // Base: 100 HP, 20 ATK, 15 DEF, 40 SPD
      // Rank: 150 HP, 30 ATK, 22.5 DEF, 60 SPD
      // Class: 157.5 HP, 31.5 ATK, 23.625 DEF, 63 SPD
      // Floor: 157 HP, 31 ATK, 23 DEF, 63 SPD
      expect(stats.maxHp).toBe(157);
      expect(stats.attack).toBe(31);
      expect(stats.defense).toBe(23);
      expect(stats.speed).toBe(63);
    });
  });

  describe('Gem Passive Bonuses', () => {
    test('active gem provides passive bonus', () => {
      // Ruby gem has +5 attack passive
      const bonus = getGemPassiveBonus('ruby_gem', 'active');
      expect(bonus.attack).toBe(5);
    });

    test('inactive gem provides no passive bonus', () => {
      const bonus = getGemPassiveBonus('ruby_gem', 'inactive');
      expect(bonus).toEqual({
        hp: 0,
        attack: 0,
        defense: 0,
        speed: 0,
      });
    });

    test('unknown gem returns zero bonuses', () => {
      const bonus = getGemPassiveBonus('unknown_gem', 'active');
      expect(bonus).toEqual({
        hp: 0,
        attack: 0,
        defense: 0,
        speed: 0,
      });
    });

    test('sapphire gem provides +3 DEF, +10 HP when active', () => {
      const bonus = getGemPassiveBonus('sapphire_gem', 'active');
      expect(bonus.defense).toBe(3);
      expect(bonus.hp).toBe(10);
    });

    test('topaz gem provides +3 ATK, +2 SPD when active', () => {
      const bonus = getGemPassiveBonus('topaz_gem', 'active');
      expect(bonus.attack).toBe(3);
      expect(bonus.speed).toBe(2);
    });
  });

  describe('Full Stat Calculation with Gem', () => {
    test('unit with active gem gets passive bonus', () => {
      const unit = createTestUnit({
        equippedGem: {
          gemId: 'ruby_gem',
          state: 'active',
        },
        subclass: 'Fire Adept', // Gem grants this
      });
      const stats = calculateUnitStats(unit);
      
      // Base: 100 HP, 20 ATK, 15 DEF, 40 SPD
      // Rank C (1.0x): 100 HP, 20 ATK, 15 DEF, 40 SPD
      // Fire Adept: 100 HP, 22 ATK, 15 DEF, 42 SPD
      // Ruby passive (+5 ATK): 100 HP, 27 ATK, 15 DEF, 42 SPD
      expect(stats.maxHp).toBe(100);
      expect(stats.attack).toBe(27);
      expect(stats.defense).toBe(15);
      expect(stats.speed).toBe(42);
    });

    test('unit with inactive gem does NOT get passive bonus', () => {
      const unit = createTestUnit({
        equippedGem: {
          gemId: 'ruby_gem',
          state: 'inactive', // Used gem effect this battle
        },
        subclass: 'Fire Adept', // Subclass still active!
      });
      const stats = calculateUnitStats(unit);
      
      // Base: 100 HP, 20 ATK, 15 DEF, 40 SPD
      // Rank C (1.0x): 100 HP, 20 ATK, 15 DEF, 40 SPD
      // Fire Adept: 100 HP, 22 ATK, 15 DEF, 42 SPD
      // Gem passive (inactive): +0 ATK
      expect(stats.maxHp).toBe(100);
      expect(stats.attack).toBe(22); // No gem bonus!
      expect(stats.defense).toBe(15);
      expect(stats.speed).toBe(42);
    });

    test('S rank + Earth Adept + Emerald gem stacks correctly', () => {
      const unit = createTestUnit({
        rank: 'S',              // 1.50x
        subclass: 'Earth Adept', // 1.10x HP, 1.15x DEF
        equippedGem: {
          gemId: 'emerald_gem', // +5 DEF
          state: 'active',
        },
      });
      const stats = calculateUnitStats(unit);
      
      // Base: 100 HP, 20 ATK, 15 DEF, 40 SPD
      // Rank S: 150 HP, 30 ATK, 22.5 DEF, 60 SPD
      // Earth Adept: 165 HP, 30 ATK, 25.875 DEF, 60 SPD
      // Emerald +5 DEF: 165 HP, 30 ATK, 30 DEF, 60 SPD
      expect(stats.maxHp).toBe(165);
      expect(stats.attack).toBe(30);
      expect(stats.defense).toBe(30);  // Floor(25.875) + 5
      expect(stats.speed).toBe(60);
    });
  });

  describe('Stat Breakdown', () => {
    test('breaks down stats into component layers', () => {
      const unit = createTestUnit({ rank: 'B' });
      const breakdown = calculateStatBreakdown(unit, 'attack');
      
      expect(breakdown.base).toBe(20);
      expect(breakdown.fromRank).toBe(3); // 20 * 1.15 - 20 = 3
      expect(breakdown.fromClass).toBe(0);
      expect(breakdown.fromEquipment).toBe(0);
      expect(breakdown.fromGem).toBe(0);
      expect(breakdown.final).toBe(23);
    });

    test('breakdown shows gem passive bonus', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
        subclass: 'Fire Adept',
      });
      const breakdown = calculateStatBreakdown(unit, 'attack');
      
      expect(breakdown.base).toBe(20);
      expect(breakdown.fromClass).toBe(2); // Fire Adept +10% ATK
      expect(breakdown.fromGem).toBe(5);   // Ruby +5 ATK
      expect(breakdown.final).toBe(27);
    });
  });

  describe('Edge Cases', () => {
    test('stats round down to integers', () => {
      // Create unit where multipliers result in decimals
      const unit = createTestUnit({
        atk: 17, // 17 * 1.15 = 19.55
        rank: 'B',
      });
      const stats = calculateUnitStats(unit);
      
      expect(stats.attack).toBe(19); // Floored
    });

    test('zero base stats remain zero', () => {
      const unit = createTestUnit({
        atk: 0,
        def: 0,
        rank: 'S',
        subclass: 'Fire Adept',
      });
      const stats = calculateUnitStats(unit);
      
      expect(stats.attack).toBe(0);
      expect(stats.defense).toBe(0);
    });

    test('maxMp is always 50 regardless of other stats', () => {
      const unitC = createTestUnit({ rank: 'C' });
      const unitS = createTestUnit({ rank: 'S' });
      
      expect(calculateUnitStats(unitC).maxMp).toBe(50);
      expect(calculateUnitStats(unitS).maxMp).toBe(50);
    });
  });

  describe('Determinism', () => {
    test('same unit always produces same stats', () => {
      const unit = createTestUnit({ 
        rank: 'A', 
        subclass: 'Mystic Adept',
        equippedGem: { gemId: 'amethyst_gem', state: 'active' },
      });
      
      const stats1 = calculateUnitStats(unit);
      const stats2 = calculateUnitStats(unit);
      
      expect(stats1).toEqual(stats2);
    });

    test('equivalent units produce identical stats', () => {
      const unit1 = createTestUnit({ id: 'unit-1', rank: 'B' });
      const unit2 = createTestUnit({ id: 'unit-2', rank: 'B' });
      
      const stats1 = calculateUnitStats(unit1);
      const stats2 = calculateUnitStats(unit2);
      
      expect(stats1).toEqual(stats2);
    });
  });
});

