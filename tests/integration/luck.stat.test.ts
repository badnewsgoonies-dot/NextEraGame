import { describe, test, expect } from 'vitest';
import type { PlayerUnit } from '../../src/types/game.js';
import { STARTER_CATALOG } from '../../src/data/starterUnits.js';

describe('Luck Stat Integration', () => {
  test('PlayerUnit type has luck field', () => {
    // Create a sample PlayerUnit to verify the type includes luck
    const sampleUnit: PlayerUnit = {
      id: 'test_unit',
      templateId: 'test_template',
      name: 'Test Unit',
      role: 'Tank',
      tags: ['Holy'],
      element: 'Moon',
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
      luck: 5, // This should compile without errors
    };

    // TypeScript compilation success is the primary test
    expect(sampleUnit.luck).toBe(5);
    expect(typeof sampleUnit.luck).toBe('number');
  });

  test('all 12 starter units have luck = 5', () => {
    // Verify we have exactly 12 starter units
    expect(STARTER_CATALOG.length).toBe(12);

    // Verify each starter unit has luck: 5
    STARTER_CATALOG.forEach((unit, index) => {
      expect(unit.luck).toBe(5);
    });
  });

  test('TypeScript compilation with luck field', () => {
    // Verify each starter unit's luck property is accessible and typed correctly
    const firstUnit = STARTER_CATALOG[0];

    // Should be able to access luck property
    const luckValue: number = firstUnit.luck;
    expect(luckValue).toBe(5);

    // Verify all units have the luck property defined
    const allHaveLuck = STARTER_CATALOG.every(unit =>
      'luck' in unit && typeof unit.luck === 'number'
    );
    expect(allHaveLuck).toBe(true);

    // Verify luck values are all 5
    const allLuckIsFive = STARTER_CATALOG.every(unit => unit.luck === 5);
    expect(allLuckIsFive).toBe(true);
  });
});
