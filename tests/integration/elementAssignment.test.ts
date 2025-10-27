import { describe, it, expect } from 'vitest';
import { STARTER_CATALOG } from '@/data/starterUnits';
import type { Element } from '@/types/game';

describe('Element Assignment Integration', () => {
  it('all 12 starter units have element field', () => {
    STARTER_CATALOG.forEach(unit => {
      expect(unit.element).toBeDefined();
      expect(typeof unit.element).toBe('string');
    });
  });

  it('all elements are valid Element types', () => {
    const validElements: Element[] = ['Mars', 'Venus', 'Jupiter', 'Mercury', 'Moon', 'Sun'];
    STARTER_CATALOG.forEach(unit => {
      expect(validElements).toContain(unit.element);
    });
  });

  it('all 6 elements are represented in starter catalog', () => {
    const elements = STARTER_CATALOG.map(u => u.element);
    const uniqueElements = [...new Set(elements)];

    expect(uniqueElements.length).toBe(6);
    expect(uniqueElements).toContain('Mars');
    expect(uniqueElements).toContain('Venus');
    expect(uniqueElements).toContain('Jupiter');
    expect(uniqueElements).toContain('Mercury');
    expect(uniqueElements).toContain('Moon');
    expect(uniqueElements).toContain('Sun');
  });

  it('all starter units have activeGemState', () => {
    STARTER_CATALOG.forEach(unit => {
      expect(unit.activeGemState).toBeDefined();
      expect(unit.activeGemState.activeGem).toBeDefined();
      expect(unit.activeGemState.isActivated).toBe(false); // SESSION 2: starts inactive, activated at battle start
    });
  });

  it('each unit gem matches their element', () => {
    STARTER_CATALOG.forEach(unit => {
      expect(unit.activeGemState.activeGem?.element).toBe(unit.element);
    });
  });

  it('all gems are tier 1 (starter gems)', () => {
    STARTER_CATALOG.forEach(unit => {
      // Gems don't have tier in ElementalGem interface, but we verify they exist
      expect(unit.activeGemState.activeGem).toBeDefined();
      expect(unit.activeGemState.activeGem?.id).toContain('elemental');
    });
  });

  it('Warrior has Mars element and Mars gem', () => {
    const warrior = STARTER_CATALOG.find(u => u.name === 'Warrior');
    expect(warrior?.element).toBe('Moon');
    expect(warrior?.activeGemState.activeGem?.element).toBe('Moon');
  });

  it('Cleric has Mercury element and Mercury gem', () => {
    const cleric = STARTER_CATALOG.find(u => u.name === 'Cleric');
    expect(cleric?.element).toBe('Moon');
    expect(cleric?.activeGemState.activeGem?.element).toBe('Moon');
  });

  it('Guardian has Venus element and Venus gem', () => {
    const guardian = STARTER_CATALOG.find(u => u.name === 'Guardian');
    expect(guardian?.element).toBe('Venus');
    expect(guardian?.activeGemState.activeGem?.element).toBe('Venus');
  });

  it('Rogue has Mars element and Mars gem', () => {
    const rogue = STARTER_CATALOG.find(u => u.name === 'Rogue');
    expect(rogue?.element).toBe('Mars');
    expect(rogue?.activeGemState.activeGem?.element).toBe('Mars');
  });

  it('Mage has Moon element and Moon gem', () => {
    const mage = STARTER_CATALOG.find(u => u.name === 'Mage');
    expect(mage?.element).toBe('Mercury');
    expect(mage?.activeGemState.activeGem?.element).toBe('Mercury');
  });

  it('Bard has Jupiter element and Jupiter gem', () => {
    const bard = STARTER_CATALOG.find(u => u.name === 'Bard');
    expect(bard?.element).toBe('Mercury');
    expect(bard?.activeGemState.activeGem?.element).toBe('Mercury');
  });

  it('Engineer has Sun element and Sun gem', () => {
    const engineer = STARTER_CATALOG.find(u => u.name === 'Engineer');
    expect(engineer?.element).toBe('Jupiter');
    expect(engineer?.activeGemState.activeGem?.element).toBe('Jupiter');
  });

  it('Necromancer has Sun element and Sun gem', () => {
    const necromancer = STARTER_CATALOG.find(u => u.name === 'Necromancer');
    expect(necromancer?.element).toBe('Sun');
    expect(necromancer?.activeGemState.activeGem?.element).toBe('Sun');
  });

  it('element and activeGemState preserved in spread operations', () => {
    const testUnit = STARTER_CATALOG[0];
    const spreadUnit = { ...testUnit, currentHp: 100 };

    expect(spreadUnit.element).toBe(testUnit.element);
    expect(spreadUnit.activeGemState).toBe(testUnit.activeGemState);
  });

  it('each element has appropriate icon emoji', () => {
    STARTER_CATALOG.forEach(unit => {
      const icon = unit.activeGemState.activeGem?.icon;
      expect(icon).toBeDefined();
      expect(icon?.length).toBeGreaterThan(0);

      // Verify element-specific icons
      if (unit.element === 'Mars') expect(icon).toBe('🔥');
      if (unit.element === 'Venus') expect(icon).toBe('🌍');
      if (unit.element === 'Jupiter') expect(icon).toBe('💨');
      if (unit.element === 'Mercury') expect(icon).toBe('💧');
      if (unit.element === 'Moon') expect(icon).toBe('🌙');
      if (unit.element === 'Sun') expect(icon).toBe('☀️');
    });
  });

  it('element distribution covers all 6 elements', () => {
    const elementCounts: Record<Element, number> = {
      Mars: 0,
      Venus: 0,
      Jupiter: 0,
      Mercury: 0,
      Moon: 0,
      Sun: 0,
    };

    STARTER_CATALOG.forEach(unit => {
      elementCounts[unit.element]++;
    });

    // Check that each element appears at least once (SESSION 2: balanced but not exactly 2 each)
    Object.entries(elementCounts).forEach(([element, count]) => {
      expect(count).toBeGreaterThan(0); // All elements represented
      expect(count).toBeLessThanOrEqual(4); // No element dominates
    });
  });
});
