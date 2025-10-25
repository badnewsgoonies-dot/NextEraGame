/*
 * RankSystem Tests
 * 
 * Verifies rank progression and merging system:
 * - Rank upgrades (C→B→A→S)
 * - Merge validation
 * - Duplicate detection
 * - UI helpers
 */

import { describe, test, expect } from 'vitest';
import { 
  canUpgradeRank,
  getNextRank,
  mergeUnits,
  getRankDisplay,
  getRankBonusDescription,
  getRankProgression,
} from '../../src/systems/RankSystem';
import type { PlayerUnit } from '../../src/types/game';

describe('RankSystem', () => {
  // Helper to create test unit
  function createTestUnit(overrides: Partial<PlayerUnit> = {}): PlayerUnit {
    return {
      id: 'test-unit-1',
      templateId: 'warrior_template',
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

  describe('Rank Upgrade Checks', () => {
    test('C rank can be upgraded', () => {
      expect(canUpgradeRank('C')).toBe(true);
    });

    test('B rank can be upgraded', () => {
      expect(canUpgradeRank('B')).toBe(true);
    });

    test('A rank can be upgraded', () => {
      expect(canUpgradeRank('A')).toBe(true);
    });

    test('S rank cannot be upgraded (max rank)', () => {
      expect(canUpgradeRank('S')).toBe(false);
    });
  });

  describe('Next Rank Calculation', () => {
    test('C → B', () => {
      expect(getNextRank('C')).toBe('B');
    });

    test('B → A', () => {
      expect(getNextRank('B')).toBe('A');
    });

    test('A → S', () => {
      expect(getNextRank('A')).toBe('S');
    });

    test('S → null (max rank)', () => {
      expect(getNextRank('S')).toBeNull();
    });
  });

  describe('Merge Units', () => {
    test('successfully merges C → B', () => {
      const target = createTestUnit({ rank: 'C' });
      const duplicate = createTestUnit({ id: 'dup-1', rank: 'C' });
      
      const result = mergeUnits(target, duplicate);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.rank).toBe('B');
        expect(result.value.id).toBe(target.id); // Keeps original ID
        expect(result.value.templateId).toBe(target.templateId);
      }
    });

    test('successfully merges B → A', () => {
      const target = createTestUnit({ rank: 'B' });
      const duplicate = createTestUnit({ id: 'dup-1' });
      
      const result = mergeUnits(target, duplicate);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.rank).toBe('A');
      }
    });

    test('successfully merges A → S', () => {
      const target = createTestUnit({ rank: 'A' });
      const duplicate = createTestUnit({ id: 'dup-1' });
      
      const result = mergeUnits(target, duplicate);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.rank).toBe('S');
      }
    });

    test('cannot merge S rank (already max)', () => {
      const target = createTestUnit({ rank: 'S' });
      const duplicate = createTestUnit({ id: 'dup-1' });
      
      const result = mergeUnits(target, duplicate);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('max rank');
      }
    });

    test('preserves level and experience', () => {
      const target = createTestUnit({ 
        rank: 'C',
        level: 5,
        experience: 150,
      });
      const duplicate = createTestUnit({ id: 'dup-1' });
      
      const result = mergeUnits(target, duplicate);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.level).toBe(5);
        expect(result.value.experience).toBe(150);
      }
    });

    test('preserves currentHp and currentMp', () => {
      const target = createTestUnit({ 
        hp: 50,  // Damaged
        currentMp: 20, // Partially spent
      });
      const duplicate = createTestUnit({ id: 'dup-1' });
      
      const result = mergeUnits(target, duplicate);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.hp).toBe(50);
        expect(result.value.currentMp).toBe(20);
      }
    });

    test('preserves equipment', () => {
      const target = createTestUnit({ 
        equippedWeapon: 'iron_sword',
        equippedArmor: 'leather_armor',
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
      });
      const duplicate = createTestUnit({ id: 'dup-1' });
      
      const result = mergeUnits(target, duplicate);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedWeapon).toBe('iron_sword');
        expect(result.value.equippedArmor).toBe('leather_armor');
        expect(result.value.equippedGem).toEqual({ gemId: 'ruby_gem', state: 'active' });
      }
    });

    test('fails if units are not duplicates (different templateId)', () => {
      const target = createTestUnit({ templateId: 'warrior' });
      const notDuplicate = createTestUnit({ 
        id: 'other-1', 
        templateId: 'mage', // Different template!
      });
      
      const result = mergeUnits(target, notDuplicate);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not duplicates');
      }
    });

    test('duplicate can be any rank (not restricted to same rank)', () => {
      const targetC = createTestUnit({ rank: 'C' });
      const duplicateB = createTestUnit({ id: 'dup-1', rank: 'B' });
      
      const result = mergeUnits(targetC, duplicateB);
      
      expect(result.ok).toBe(true); // Should succeed
      if (result.ok) {
        expect(result.value.rank).toBe('B'); // Target upgrades to B
      }
    });
  });

  describe('Rank Display', () => {
    test('C rank display', () => {
      const display = getRankDisplay('C');
      expect(display.badge).toBe('[C]');
      expect(display.stars).toBe('');
      expect(display.color).toContain('gray');
    });

    test('B rank display has 1 star', () => {
      const display = getRankDisplay('B');
      expect(display.badge).toBe('[B]');
      expect(display.stars).toBe('⭐');
      expect(display.color).toContain('blue');
    });

    test('A rank display has 2 stars', () => {
      const display = getRankDisplay('A');
      expect(display.badge).toBe('[A]');
      expect(display.stars).toBe('⭐⭐');
      expect(display.color).toContain('purple');
    });

    test('S rank display has 3 stars', () => {
      const display = getRankDisplay('S');
      expect(display.badge).toBe('[S]');
      expect(display.stars).toBe('⭐⭐⭐');
      expect(display.color).toContain('yellow');
    });
  });

  describe('Rank Bonus Descriptions', () => {
    test('C rank description', () => {
      const desc = getRankBonusDescription('C');
      expect(desc).toContain('Base');
      expect(desc).toContain('no bonus');
    });

    test('B rank description shows +15%', () => {
      const desc = getRankBonusDescription('B');
      expect(desc).toContain('15%');
    });

    test('A rank description shows +30%', () => {
      const desc = getRankBonusDescription('A');
      expect(desc).toContain('30%');
    });

    test('S rank description shows +50%', () => {
      const desc = getRankBonusDescription('S');
      expect(desc).toContain('50%');
    });
  });

  describe('Rank Progression', () => {
    test('C rank progression shows next is B', () => {
      const prog = getRankProgression('C');
      expect(prog.current).toBe('C');
      expect(prog.next).toBe('B');
      expect(prog.canUpgrade).toBe(true);
    });

    test('S rank progression shows no next rank', () => {
      const prog = getRankProgression('S');
      expect(prog.current).toBe('S');
      expect(prog.next).toBeNull();
      expect(prog.canUpgrade).toBe(false);
      expect(prog.nextBonus).toBeNull();
    });
  });
});

