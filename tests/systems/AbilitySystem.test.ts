/*
 * AbilitySystem Tests
 * 
 * Verifies MP-based ability system:
 * - MP cost checking
 * - MP deduction
 * - MP restoration
 * - Damage/heal calculations
 * - Ability usability checks
 */

import { describe, test, expect } from 'vitest';
import { 
  canUseAbility,
  useAbility,
  restoreMp,
  restoreAllMp,
  calculateAbilityDamage,
  calculateAbilityHealing,
  getAbilityBuffAmount,
  getAbilityBuffDuration,
  isAbilityUsable,
  getMpDisplayInfo,
} from '../../src/systems/AbilitySystem';
import { GEM_CATALOG } from '../../src/data/gems';
import type { PlayerUnit } from '../../src/types/game';

describe('AbilitySystem', () => {
  // Helper to create test unit
  function createTestUnit(overrides: Partial<PlayerUnit> = {}): PlayerUnit {
    return {
      id: 'test-unit-1',
      templateId: 'warrior',
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

  describe('MP Check', () => {
    test('can use ability if MP >= cost', () => {
      const unit = createTestUnit({ currentMp: 50 });
      const ability = GEM_CATALOG[0].grantedAbility; // Fireball (20 MP)
      
      expect(canUseAbility(unit, ability)).toBe(true);
    });

    test('cannot use ability if MP < cost', () => {
      const unit = createTestUnit({ currentMp: 10 });
      const ability = GEM_CATALOG[0].grantedAbility; // Fireball (20 MP)
      
      expect(canUseAbility(unit, ability)).toBe(false);
    });

    test('can use ability with exact MP', () => {
      const unit = createTestUnit({ currentMp: 20 });
      const ability = GEM_CATALOG[0].grantedAbility; // Fireball (20 MP)
      
      expect(canUseAbility(unit, ability)).toBe(true);
    });

    test('cannot use ability with 1 less MP', () => {
      const unit = createTestUnit({ currentMp: 19 });
      const ability = GEM_CATALOG[0].grantedAbility; // Fireball (20 MP)
      
      expect(canUseAbility(unit, ability)).toBe(false);
    });
  });

  describe('Use Ability', () => {
    test('deducts correct MP amount', () => {
      const unit = createTestUnit({ currentMp: 50 });
      const fireball = GEM_CATALOG[0].grantedAbility; // 20 MP cost
      
      const result = useAbility(unit, fireball);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.currentMp).toBe(30); // 50 - 20
      }
    });

    test('fails if not enough MP', () => {
      const unit = createTestUnit({ currentMp: 10 });
      const fireball = GEM_CATALOG[0].grantedAbility; // 20 MP cost
      
      const result = useAbility(unit, fireball);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Not enough MP');
      }
    });

    test('can use ability multiple times until MP runs out', () => {
      let unit = createTestUnit({ currentMp: 50 });
      const cure = GEM_CATALOG[3].grantedAbility; // Cure (15 MP)
      
      // Use 1: 50 → 35
      const result1 = useAbility(unit, cure);
      expect(result1.ok).toBe(true);
      if (result1.ok) unit = result1.value;
      
      // Use 2: 35 → 20
      const result2 = useAbility(unit, cure);
      expect(result2.ok).toBe(true);
      if (result2.ok) unit = result2.value;
      
      // Use 3: 20 → 5
      const result3 = useAbility(unit, cure);
      expect(result3.ok).toBe(true);
      if (result3.ok) unit = result3.value;
      
      // Use 4: 5 MP not enough for 15 MP cost
      const result4 = useAbility(unit, cure);
      expect(result4.ok).toBe(false);
    });
  });

  describe('MP Restoration', () => {
    test('restoreMp sets MP to max', () => {
      const unit = createTestUnit({ currentMp: 10 });
      const restored = restoreMp(unit, 50);
      
      expect(restored.currentMp).toBe(50);
    });

    test('restoreMp with custom max', () => {
      const unit = createTestUnit({ currentMp: 0 });
      const restored = restoreMp(unit, 75);
      
      expect(restored.currentMp).toBe(75);
    });

    test('restoreAllMp restores entire team', () => {
      const team = [
        createTestUnit({ id: 'unit-1', currentMp: 10 }),
        createTestUnit({ id: 'unit-2', currentMp: 25 }),
        createTestUnit({ id: 'unit-3', currentMp: 0 }),
      ];
      
      const restored = restoreAllMp(team, 50);
      
      expect(restored[0].currentMp).toBe(50);
      expect(restored[1].currentMp).toBe(50);
      expect(restored[2].currentMp).toBe(50);
    });
  });

  describe('Damage Calculation', () => {
    test('fireball damage scales with caster attack', () => {
      const fireball = GEM_CATALOG[0].grantedAbility;
      
      // Low attack caster
      const damage1 = calculateAbilityDamage(fireball, 10);
      expect(damage1).toBe(40); // 35 + (10 * 0.5) = 40
      
      // High attack caster
      const damage2 = calculateAbilityDamage(fireball, 50);
      expect(damage2).toBe(60); // 35 + (50 * 0.5) = 60
    });

    test('flame wall damage scales with caster attack', () => {
      const flameWall = GEM_CATALOG[1].grantedAbility;
      const damage = calculateAbilityDamage(flameWall, 30);
      
      expect(damage).toBe(35); // 20 + (30 * 0.5) = 35
    });

    test('heal abilities return 0 damage', () => {
      const cure = GEM_CATALOG[3].grantedAbility; // Heal ability
      const damage = calculateAbilityDamage(cure, 100);
      
      expect(damage).toBe(0);
    });

    test('buff abilities return 0 damage', () => {
      const stoneWall = GEM_CATALOG[2].grantedAbility; // Buff ability
      const damage = calculateAbilityDamage(stoneWall, 100);
      
      expect(damage).toBe(0);
    });
  });

  describe('Healing Calculation', () => {
    test('cure heals fixed amount', () => {
      const cure = GEM_CATALOG[3].grantedAbility;
      const healing = calculateAbilityHealing(cure);
      
      expect(healing).toBe(30); // Fixed healing, doesn't scale
    });

    test('damage abilities return 0 healing', () => {
      const fireball = GEM_CATALOG[0].grantedAbility;
      const healing = calculateAbilityHealing(fireball);
      
      expect(healing).toBe(0);
    });
  });

  describe('Buff/Debuff Helpers', () => {
    test('stone wall buff amount', () => {
      const stoneWall = GEM_CATALOG[2].grantedAbility;
      const amount = getAbilityBuffAmount(stoneWall);
      
      expect(amount).toBe(20); // +20 defense buff
    });

    test('stone wall buff duration', () => {
      const stoneWall = GEM_CATALOG[2].grantedAbility;
      const duration = getAbilityBuffDuration(stoneWall);
      
      expect(duration).toBe(3); // Lasts 3 turns
    });

    test('haste buff affects speed', () => {
      const haste = GEM_CATALOG[4].grantedAbility;
      const amount = getAbilityBuffAmount(haste);
      
      expect(amount).toBe(20); // +20 speed
    });
  });

  describe('Ability Usability', () => {
    test('ability usable if MP sufficient and targets available', () => {
      const unit = createTestUnit({ currentMp: 50 });
      const fireball = GEM_CATALOG[0].grantedAbility; // Single enemy damage
      
      const check = isAbilityUsable(unit, fireball, true, true);
      expect(check.usable).toBe(true);
    });

    test('ability not usable if no MP', () => {
      const unit = createTestUnit({ currentMp: 0 });
      const fireball = GEM_CATALOG[0].grantedAbility;
      
      const check = isAbilityUsable(unit, fireball, true, true);
      expect(check.usable).toBe(false);
      expect(check.reason).toContain('Not enough MP');
    });

    test('enemy-targeting ability not usable if no enemies', () => {
      const unit = createTestUnit({ currentMp: 50 });
      const fireball = GEM_CATALOG[0].grantedAbility; // Targets enemy
      
      const check = isAbilityUsable(unit, fireball, true, false); // No enemies
      expect(check.usable).toBe(false);
      expect(check.reason).toContain('No enemies');
    });

    test('ally-targeting ability not usable if no allies', () => {
      const unit = createTestUnit({ currentMp: 50 });
      const cure = GEM_CATALOG[3].grantedAbility; // Targets ally
      
      const check = isAbilityUsable(unit, cure, false, true); // No allies
      expect(check.usable).toBe(false);
      expect(check.reason).toContain('No allies');
    });
  });

  describe('MP Display Info', () => {
    test('high MP shows blue color', () => {
      const info = getMpDisplayInfo(40, 50); // 80%
      expect(info.percentage).toBe(80);
      expect(info.color).toContain('blue');
      expect(info.text).toBe('40/50');
    });

    test('medium MP shows green color', () => {
      const info = getMpDisplayInfo(30, 50); // 60%
      expect(info.percentage).toBe(60);
      expect(info.color).toContain('green');
    });

    test('low MP shows yellow color', () => {
      const info = getMpDisplayInfo(15, 50); // 30%
      expect(info.percentage).toBe(30);
      expect(info.color).toContain('yellow');
    });

    test('critical MP shows red color', () => {
      const info = getMpDisplayInfo(5, 50); // 10%
      expect(info.percentage).toBe(10);
      expect(info.color).toContain('red');
    });
  });
});

