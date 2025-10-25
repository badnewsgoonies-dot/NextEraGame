/**
 * ElementSystem Tests
 * 
 * Tests for Active Elemental Alignment bonus calculations:
 * - Element matching logic (+15%)
 * - Neutral elements (+5%)
 * - Counter elements (-5%)
 * - Activation status (bonuses removed when activated)
 * - Edge cases
 */

import { describe, it, expect } from 'vitest';
import { calculateElementBonus, applyElementBonus, getElementRelationship } from '../../src/systems/ElementSystem';
import type { PlayerUnit, ActiveGemState, Element } from '../../src/types/game';
import { VENUS_GEM, MARS_GEM, JUPITER_GEM, MERCURY_GEM, MOON_GEM, SUN_GEM } from '../../src/data/gems';

// Helper to create test unit
function createTestUnit(element: Element): PlayerUnit {
  return {
    id: 'test_unit',
    templateId: 'test_template',
    name: 'Test Unit',
    role: 'DPS',
    tags: ['Arcane'],
    element,
    hp: 100,
    maxHp: 100,
    atk: 50,
    def: 20,
    speed: 60,
    level: 1,
    experience: 0,
    rank: 'C',
    baseClass: 'Mage',
    currentMp: 50,
  };
}

describe('ElementSystem - calculateElementBonus', () => {
  it('should return 1.15 for matching element (Venus-Venus)', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: VENUS_GEM,
      isActivated: false,
    };

    const bonus = calculateElementBonus(unit, gemState);
    expect(bonus).toBe(1.15);
  });

  it('should return 1.15 for all matching elements', () => {
    const elements: Element[] = ['Venus', 'Mars', 'Jupiter', 'Mercury', 'Moon', 'Sun'];
    const gems = [VENUS_GEM, MARS_GEM, JUPITER_GEM, MERCURY_GEM, MOON_GEM, SUN_GEM];

    elements.forEach((element, index) => {
      const unit = createTestUnit(element);
      const gemState: ActiveGemState = {
        activeGem: gems[index],
        isActivated: false,
      };

      const bonus = calculateElementBonus(unit, gemState);
      expect(bonus).toBe(1.15);
    });
  });

  it('should return 0.95 for counter element (Venus counters Jupiter)', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: JUPITER_GEM, // Venus ↔ Jupiter counter
      isActivated: false,
    };

    const bonus = calculateElementBonus(unit, gemState);
    expect(bonus).toBe(0.95);
  });

  it('should return 0.95 for all counter relationships', () => {
    const counterPairs: [Element, Element][] = [
      ['Venus', 'Jupiter'],   // Earth ↔ Wind
      ['Jupiter', 'Venus'],   // Wind ↔ Earth
      ['Mars', 'Mercury'],    // Fire ↔ Water
      ['Mercury', 'Mars'],    // Water ↔ Fire
      ['Moon', 'Sun'],        // Light ↔ Dark
      ['Sun', 'Moon'],        // Dark ↔ Light
    ];

    const gemMap = {
      Venus: VENUS_GEM,
      Mars: MARS_GEM,
      Jupiter: JUPITER_GEM,
      Mercury: MERCURY_GEM,
      Moon: MOON_GEM,
      Sun: SUN_GEM,
    };

    counterPairs.forEach(([unitElement, gemElement]) => {
      const unit = createTestUnit(unitElement);
      const gemState: ActiveGemState = {
        activeGem: gemMap[gemElement],
        isActivated: false,
      };

      const bonus = calculateElementBonus(unit, gemState);
      expect(bonus).toBe(0.95);
    });
  });

  it('should return 1.05 for neutral elements', () => {
    const unit = createTestUnit('Mars'); // Fire
    const gemState: ActiveGemState = {
      activeGem: VENUS_GEM, // Earth (not matching, not counter)
      isActivated: false,
    };

    const bonus = calculateElementBonus(unit, gemState);
    expect(bonus).toBe(1.05);
  });

  it('should return 1.0 when no gem is active', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: null,
      isActivated: false,
    };

    const bonus = calculateElementBonus(unit, gemState);
    expect(bonus).toBe(1.0);
  });

  it('should return 1.0 when gem is activated (bonuses removed)', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: VENUS_GEM, // Matching element
      isActivated: true, // But activated = no bonuses
    };

    const bonus = calculateElementBonus(unit, gemState);
    expect(bonus).toBe(1.0);
  });

  it('should return 1.0 for matching element when activated', () => {
    const unit = createTestUnit('Mars');
    const gemState: ActiveGemState = {
      activeGem: MARS_GEM,
      isActivated: true,
    };

    const bonus = calculateElementBonus(unit, gemState);
    expect(bonus).toBe(1.0);
  });
});

describe('ElementSystem - applyElementBonus', () => {
  it('should apply +15% bonus correctly (matching)', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: VENUS_GEM,
      isActivated: false,
    };

    const result = applyElementBonus(100, unit, gemState);
    expect(result).toBe(115); // 100 * 1.15 = 115
  });

  it('should apply +5% bonus correctly (neutral)', () => {
    const unit = createTestUnit('Mars');
    const gemState: ActiveGemState = {
      activeGem: VENUS_GEM,
      isActivated: false,
    };

    const result = applyElementBonus(100, unit, gemState);
    expect(result).toBe(105); // 100 * 1.05 = 105
  });

  it('should apply -5% penalty correctly (counter)', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: JUPITER_GEM,
      isActivated: false,
    };

    const result = applyElementBonus(100, unit, gemState);
    expect(result).toBe(95); // 100 * 0.95 = 95
  });

  it('should round fractional results', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: VENUS_GEM,
      isActivated: false,
    };

    const result = applyElementBonus(47, unit, gemState);
    expect(result).toBe(54); // 47 * 1.15 = 54.05 → 54
  });

  it('should return original value when no gem active', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: null,
      isActivated: false,
    };

    const result = applyElementBonus(100, unit, gemState);
    expect(result).toBe(100);
  });

  it('should return original value when gem activated', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: VENUS_GEM,
      isActivated: true,
    };

    const result = applyElementBonus(100, unit, gemState);
    expect(result).toBe(100);
  });

  it('should handle zero damage correctly', () => {
    const unit = createTestUnit('Venus');
    const gemState: ActiveGemState = {
      activeGem: VENUS_GEM,
      isActivated: false,
    };

    const result = applyElementBonus(0, unit, gemState);
    expect(result).toBe(0);
  });
});

describe('ElementSystem - getElementRelationship', () => {
  it('should identify matching relationship', () => {
    const relationship = getElementRelationship('Venus', 'Venus');
    expect(relationship.type).toBe('matching');
    expect(relationship.bonus).toBe(15);
  });

  it('should identify counter relationship (Venus-Jupiter)', () => {
    const relationship = getElementRelationship('Venus', 'Jupiter');
    expect(relationship.type).toBe('counter');
    expect(relationship.bonus).toBe(-5);
  });

  it('should identify counter relationship (Jupiter-Venus)', () => {
    const relationship = getElementRelationship('Jupiter', 'Venus');
    expect(relationship.type).toBe('counter');
    expect(relationship.bonus).toBe(-5);
  });

  it('should identify neutral relationship', () => {
    const relationship = getElementRelationship('Mars', 'Venus');
    expect(relationship.type).toBe('neutral');
    expect(relationship.bonus).toBe(5);
  });

  it('should handle all element pairs correctly', () => {
    const elements: Element[] = ['Venus', 'Mars', 'Jupiter', 'Mercury', 'Moon', 'Sun'];
    
    elements.forEach(element => {
      // Self should be matching
      const selfRelation = getElementRelationship(element, element);
      expect(selfRelation.type).toBe('matching');
      expect(selfRelation.bonus).toBe(15);
    });
  });
});
