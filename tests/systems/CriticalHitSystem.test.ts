import { describe, test, expect } from 'vitest';
import { checkCriticalHit } from '../../src/systems/CriticalHitSystem.js';
import type { PlayerUnit } from '../../src/types/game.js';
import { makeRng } from '../../src/utils/rng.js';

describe('CriticalHitSystem', () => {
  // Helper: Create test unit with specific luck value
  const createUnit = (luck: number, overrides?: Partial<PlayerUnit>): PlayerUnit => ({
    id: 'unit-1',
    name: 'Test Warrior',
    templateId: 'warrior-template',
    role: 'Tank',
    tags: [],
    element: 'Mars',
    rank: 'C',
    baseClass: 'Warrior',
    level: 1,
    experience: 0,
    hp: 100,
    maxHp: 100,
    atk: 20,
    def: 15,
    speed: 10,
    currentMp: 0,
    luck,
    ...overrides
  });

  describe('checkCriticalHit', () => {
    test('returns Result type with ok=true for valid luck', () => {
      const unit = createUnit(50);
      const rng = makeRng(12345);

      const result = checkCriticalHit(unit, rng);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(typeof result.value).toBe('boolean');
      }
    });

    test('never crits with luck = 0', () => {
      const unit = createUnit(0);

      // Test 100 rolls to ensure no crits
      for (let i = 0; i < 100; i++) {
        const rng = makeRng(i);
        const result = checkCriticalHit(unit, rng);

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value).toBe(false);
        }
      }
    });

    test('always crits with luck = 100', () => {
      const unit = createUnit(100);

      // Test 100 rolls to ensure all crit
      for (let i = 0; i < 100; i++) {
        const rng = makeRng(i);
        const result = checkCriticalHit(unit, rng);

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value).toBe(true);
        }
      }
    });

    test('is deterministic with same seed and unit', () => {
      const unit = createUnit(50);
      const seed = 42;

      // First run
      const rng1 = makeRng(seed);
      const result1 = checkCriticalHit(unit, rng1);

      // Second run with same seed
      const rng2 = makeRng(seed);
      const result2 = checkCriticalHit(unit, rng2);

      expect(result1.ok).toBe(true);
      expect(result2.ok).toBe(true);

      if (result1.ok && result2.ok) {
        expect(result1.value).toBe(result2.value);
      }
    });

    test('produces approximately 50% crit rate with luck = 50 over 100 rolls', () => {
      const unit = createUnit(50);
      let critCount = 0;

      for (let i = 0; i < 100; i++) {
        const rng = makeRng(i);
        const result = checkCriticalHit(unit, rng);

        if (result.ok && result.value) {
          critCount++;
        }
      }

      // Allow 35-65% range for statistical variance
      expect(critCount).toBeGreaterThanOrEqual(35);
      expect(critCount).toBeLessThanOrEqual(65);
    });

    test('produces approximately 25% crit rate with luck = 25 over 100 rolls', () => {
      const unit = createUnit(25);
      let critCount = 0;

      for (let i = 0; i < 100; i++) {
        const rng = makeRng(i);
        const result = checkCriticalHit(unit, rng);

        if (result.ok && result.value) {
          critCount++;
        }
      }

      // Allow 15-35% range for statistical variance
      expect(critCount).toBeGreaterThanOrEqual(15);
      expect(critCount).toBeLessThanOrEqual(35);
    });

    test('produces approximately 75% crit rate with luck = 75 over 100 rolls', () => {
      const unit = createUnit(75);
      let critCount = 0;

      for (let i = 0; i < 100; i++) {
        const rng = makeRng(i);
        const result = checkCriticalHit(unit, rng);

        if (result.ok && result.value) {
          critCount++;
        }
      }

      // Allow 65-85% range for statistical variance
      expect(critCount).toBeGreaterThanOrEqual(65);
      expect(critCount).toBeLessThanOrEqual(85);
    });

    test('returns error for negative luck', () => {
      const unit = createUnit(-10);
      const rng = makeRng(12345);

      const result = checkCriticalHit(unit, rng);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid luck value');
        expect(result.error).toContain('-10');
      }
    });

    test('returns error for luck > 100', () => {
      const unit = createUnit(150);
      const rng = makeRng(12345);

      const result = checkCriticalHit(unit, rng);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid luck value');
        expect(result.error).toContain('150');
      }
    });

    test('handles luck = 1 (minimum valid)', () => {
      const unit = createUnit(1);
      let critCount = 0;

      // Test 100 rolls
      for (let i = 0; i < 100; i++) {
        const rng = makeRng(i);
        const result = checkCriticalHit(unit, rng);

        expect(result.ok).toBe(true);
        if (result.ok && result.value) {
          critCount++;
        }
      }

      // Should have at least some crits, but very few (0-5 range is reasonable)
      expect(critCount).toBeGreaterThanOrEqual(0);
      expect(critCount).toBeLessThanOrEqual(5);
    });

    test('handles luck = 99 (maximum non-guaranteed)', () => {
      const unit = createUnit(99);
      let critCount = 0;

      // Test 100 rolls
      for (let i = 0; i < 100; i++) {
        const rng = makeRng(i);
        const result = checkCriticalHit(unit, rng);

        expect(result.ok).toBe(true);
        if (result.ok && result.value) {
          critCount++;
        }
      }

      // Should have most crits (95-100 range is reasonable)
      expect(critCount).toBeGreaterThanOrEqual(95);
      expect(critCount).toBeLessThanOrEqual(100);
    });

    test('different units with same luck produce independent results', () => {
      const unit1 = createUnit(50, { id: 'unit-1' });
      const unit2 = createUnit(50, { id: 'unit-2' });
      const seed = 999;

      const rng1 = makeRng(seed);
      const result1 = checkCriticalHit(unit1, rng1);

      const rng2 = makeRng(seed);
      const result2 = checkCriticalHit(unit2, rng2);

      expect(result1.ok).toBe(true);
      expect(result2.ok).toBe(true);

      // With same seed and same luck, results should be identical
      // (because unit ID doesn't affect the calculation)
      if (result1.ok && result2.ok) {
        expect(result1.value).toBe(result2.value);
      }
    });

    test('different seeds with same unit produce different results', () => {
      const unit = createUnit(50);

      const rng1 = makeRng(100);
      const result1 = checkCriticalHit(unit, rng1);

      const rng2 = makeRng(200);
      const result2 = checkCriticalHit(unit, rng2);

      expect(result1.ok).toBe(true);
      expect(result2.ok).toBe(true);

      // Results may or may not be different on a single roll,
      // but testing multiple seeds should show variation
      let differentResults = false;
      for (let i = 0; i < 50; i++) {
        const rngA = makeRng(i * 100);
        const rngB = makeRng(i * 100 + 97);
        const resA = checkCriticalHit(unit, rngA);
        const resB = checkCriticalHit(unit, rngB);

        if (resA.ok && resB.ok && resA.value !== resB.value) {
          differentResults = true;
          break;
        }
      }

      expect(differentResults).toBe(true);
    });

    test('multiple consecutive calls with same RNG instance produce different results', () => {
      const unit = createUnit(50);
      const rng = makeRng(555);

      const results: boolean[] = [];

      // Make 10 consecutive calls
      for (let i = 0; i < 10; i++) {
        const result = checkCriticalHit(unit, rng);
        if (result.ok) {
          results.push(result.value);
        }
      }

      // Should have some variation (not all the same)
      const allSame = results.every(r => r === results[0]);
      expect(allSame).toBe(false);
    });

    test('validates luck at exact boundaries (0 and 100)', () => {
      const unit0 = createUnit(0);
      const unit100 = createUnit(100);
      const rng = makeRng(777);

      const result0 = checkCriticalHit(unit0, rng);
      expect(result0.ok).toBe(true);

      const rng2 = makeRng(777);
      const result100 = checkCriticalHit(unit100, rng2);
      expect(result100.ok).toBe(true);
    });

    test('returns error with descriptive message for invalid luck values', () => {
      const invalidUnits = [
        createUnit(-1),
        createUnit(-100),
        createUnit(101),
        createUnit(1000),
      ];

      for (const unit of invalidUnits) {
        const rng = makeRng(123);
        const result = checkCriticalHit(unit, rng);

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error).toMatch(/Invalid luck value/);
          expect(result.error).toMatch(/Must be between 0 and 100/);
        }
      }
    });
  });

  describe('Edge Cases', () => {
    test('maintains immutability - does not modify unit', () => {
      const unit = createUnit(50);
      const originalLuck = unit.luck;
      const rng = makeRng(123);

      checkCriticalHit(unit, rng);

      expect(unit.luck).toBe(originalLuck);
    });

    test('works with units of different roles', () => {
      const units = [
        createUnit(50, { role: 'Tank' }),
        createUnit(50, { role: 'DPS' }),
        createUnit(50, { role: 'Support' }),
        createUnit(50, { role: 'Specialist' }),
      ];

      for (const unit of units) {
        const rng = makeRng(456);
        const result = checkCriticalHit(unit, rng);

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(typeof result.value).toBe('boolean');
        }
      }
    });

    test('works regardless of other unit stats', () => {
      const lowStatUnit = createUnit(50, { atk: 1, def: 1, speed: 1, hp: 1, maxHp: 1 });
      const highStatUnit = createUnit(50, { atk: 999, def: 999, speed: 999, hp: 999, maxHp: 999 });
      const seed = 789;

      const rng1 = makeRng(seed);
      const result1 = checkCriticalHit(lowStatUnit, rng1);

      const rng2 = makeRng(seed);
      const result2 = checkCriticalHit(highStatUnit, rng2);

      expect(result1.ok).toBe(true);
      expect(result2.ok).toBe(true);

      // Same seed and same luck should give same result
      if (result1.ok && result2.ok) {
        expect(result1.value).toBe(result2.value);
      }
    });
  });
});
