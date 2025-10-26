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
import type { PlayerUnit, Ability } from '../../src/types/game';

// Test abilities (NEW gem system format with effect structure)
const FIREBALL: Ability = {
  id: 'fireball',
  name: 'Fireball',
  description: 'A fiery blast that burns a single enemy',
  mpCost: 20,
  effect: {
    type: 'damage',
    target: 'single_enemy',
    power: 35,
    element: 'fire',
  },
};

const FLAME_WALL: Ability = {
  id: 'flame_wall',
  name: 'Flame Wall',
  description: 'A wall of flames that damages all enemies',
  mpCost: 25,
  effect: {
    type: 'damage',
    target: 'all_enemies',
    power: 20,
    element: 'fire',
  },
};

const STONE_WALL: Ability = {
  id: 'stone_wall',
  name: 'Stone Wall',
  description: 'Increases defense of a single ally',
  mpCost: 15,
  effect: {
    type: 'buff',
    target: 'single_ally',
    power: 0,
    buffStat: 'defense',
    buffAmount: 5,
    buffDuration: 3,
  },
};

const CURE: Ability = {
  id: 'cure',
  name: 'Cure',
  description: 'Restores HP to a single ally',
  mpCost: 15,
  effect: {
    type: 'heal',
    target: 'single_ally',
    power: 50,
  },
};

const HASTE: Ability = {
  id: 'haste',
  name: 'Haste',
  description: 'Increases speed of a single ally',
  mpCost: 20,
  effect: {
    type: 'buff',
    target: 'single_ally',
    power: 0,
    buffStat: 'speed',
    buffAmount: 10,
    buffDuration: 3,
  },
};

describe('AbilitySystem', () => {
  // Helper to create test unit
  function createTestUnit(overrides: Partial<PlayerUnit> = {}): PlayerUnit {
    return {
      id: 'test-unit-1',
      templateId: 'warrior',
      name: 'Test Warrior',
      role: 'Tank',
      tags: ['Holy'],
      element: 'Mars', // Required field for gem system
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
      const ability = FIREBALL; // Fireball (20 MP)
      
      expect(canUseAbility(unit, ability)).toBe(true);
    });

    test('cannot use ability if MP < cost', () => {
      const unit = createTestUnit({ currentMp: 10 });
      const ability = FIREBALL; // Fireball (20 MP)
      
      expect(canUseAbility(unit, ability)).toBe(false);
    });

    test('can use ability with exact MP', () => {
      const unit = createTestUnit({ currentMp: 20 });
      const ability = FIREBALL; // Fireball (20 MP)
      
      expect(canUseAbility(unit, ability)).toBe(true);
    });

    test('cannot use ability with 1 less MP', () => {
      const unit = createTestUnit({ currentMp: 19 });
      const ability = FIREBALL; // Fireball (20 MP)
      
      expect(canUseAbility(unit, ability)).toBe(false);
    });
  });

  describe('Use Ability', () => {
    test('deducts correct MP amount', () => {
      const unit = createTestUnit({ currentMp: 50 });
      const fireball = FIREBALL; // 20 MP cost
      
      const result = useAbility(unit, fireball);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.currentMp).toBe(30); // 50 - 20
      }
    });

    test('fails if not enough MP', () => {
      const unit = createTestUnit({ currentMp: 10 });
      const fireball = FIREBALL; // 20 MP cost
      
      const result = useAbility(unit, fireball);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Not enough MP');
      }
    });

    test('can use ability multiple times until MP runs out', () => {
      let unit = createTestUnit({ currentMp: 50 });
      const cure = CURE; // Cure (15 MP)
      
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
    test('fireball damage scales with caster attack (no RNG)', () => {
      const fireball = FIREBALL;

      // Low attack caster
      const damage1 = calculateAbilityDamage(fireball, 10);
      expect(damage1).toBe(40); // 35 + (10 * 0.5) = 40

      // High attack caster
      const damage2 = calculateAbilityDamage(fireball, 50);
      expect(damage2).toBe(60); // 35 + (50 * 0.5) = 60
    });

    test('flame wall damage scales with caster attack (no RNG)', () => {
      const flameWall = FLAME_WALL;
      const damage = calculateAbilityDamage(flameWall, 30);

      expect(damage).toBe(35); // 20 + (30 * 0.5) = 35
    });

    test('heal abilities return 0 damage', () => {
      const cure = CURE; // Heal ability
      const damage = calculateAbilityDamage(cure, 100);

      expect(damage).toBe(0);
    });

    test('buff abilities return 0 damage', () => {
      const stoneWall = STONE_WALL; // Buff ability
      const damage = calculateAbilityDamage(stoneWall, 100);

      expect(damage).toBe(0);
    });
  });

  describe('Damage Calculation with RNG', () => {
    test('damage has variance when RNG provided', () => {
      const fireball = FIREBALL; // base power 35
      const casterAttack = 10; // +5 damage
      // Expected base: 40

      // Mock RNG that returns -2 (min variance)
      const rngMin = { int: () => -2 };
      const damageMin = calculateAbilityDamage(fireball, casterAttack, rngMin);
      expect(damageMin).toBe(38); // 40 - 2

      // Mock RNG that returns +2 (max variance)
      const rngMax = { int: () => 2 };
      const damageMax = calculateAbilityDamage(fireball, casterAttack, rngMax);
      expect(damageMax).toBe(42); // 40 + 2

      // Mock RNG that returns 0 (no variance)
      const rngZero = { int: () => 0 };
      const damageZero = calculateAbilityDamage(fireball, casterAttack, rngZero);
      expect(damageZero).toBe(40); // 40 + 0
    });

    test('minimum 1 damage even with negative variance', () => {
      const weakSpell: typeof FIREBALL = {
        ...FIREBALL,
        effect: { ...FIREBALL.effect, power: 1 }
      };
      const casterAttack = 0; // +0 damage
      // Expected base: 1

      // Mock RNG that returns -2 (would make damage -1)
      const rng = { int: () => -2 };
      const damage = calculateAbilityDamage(weakSpell, casterAttack, rng);

      expect(damage).toBeGreaterThanOrEqual(1); // Minimum 1 damage
    });

    test('damage without RNG has no variance', () => {
      const fireball = FIREBALL;
      const casterAttack = 20;

      const damage1 = calculateAbilityDamage(fireball, casterAttack);
      const damage2 = calculateAbilityDamage(fireball, casterAttack);
      const damage3 = calculateAbilityDamage(fireball, casterAttack);

      // All should be exactly the same without RNG
      expect(damage1).toBe(damage2);
      expect(damage2).toBe(damage3);
      expect(damage1).toBe(45); // 35 + (20 * 0.5) = 45
    });
  });

  describe('Healing Calculation', () => {
    test('cure heals fixed amount (no RNG)', () => {
      const cure = CURE;
      const healing = calculateAbilityHealing(cure);

      expect(healing).toBe(50); // Fixed healing (CURE power = 50)
    });

    test('damage abilities return 0 healing', () => {
      const fireball = FIREBALL;
      const healing = calculateAbilityHealing(fireball);

      expect(healing).toBe(0);
    });
  });

  describe('Healing Calculation with RNG', () => {
    test('healing has less variance than damage when RNG provided', () => {
      const cure = CURE; // power 50

      // Mock RNG that returns -1 (min variance for healing)
      const rngMin = { int: () => -1 };
      const healMin = calculateAbilityHealing(cure, rngMin);
      expect(healMin).toBe(49); // 50 - 1

      // Mock RNG that returns +1 (max variance for healing)
      const rngMax = { int: () => 1 };
      const healMax = calculateAbilityHealing(cure, rngMax);
      expect(healMax).toBe(51); // 50 + 1

      // Mock RNG that returns 0 (no variance)
      const rngZero = { int: () => 0 };
      const healZero = calculateAbilityHealing(cure, rngZero);
      expect(healZero).toBe(50); // 50 + 0
    });

    test('minimum 1 HP healed even with negative variance', () => {
      const weakHeal: typeof CURE = {
        ...CURE,
        effect: { ...CURE.effect, power: 1 }
      };

      // Mock RNG that returns -1 (would make healing 0)
      const rng = { int: () => -1 };
      const healing = calculateAbilityHealing(weakHeal, rng);

      expect(healing).toBeGreaterThanOrEqual(1); // Minimum 1 HP
    });

    test('healing without RNG is consistent', () => {
      const cure = CURE;

      const heal1 = calculateAbilityHealing(cure);
      const heal2 = calculateAbilityHealing(cure);
      const heal3 = calculateAbilityHealing(cure);

      // All should be exactly the same without RNG
      expect(heal1).toBe(heal2);
      expect(heal2).toBe(heal3);
      expect(heal1).toBe(50);
    });
  });

  describe('Buff/Debuff Helpers', () => {
    test('stone wall buff amount', () => {
      const stoneWall = STONE_WALL;
      const amount = getAbilityBuffAmount(stoneWall);
      
      expect(amount).toBe(5); // +5 defense buff (STONE_WALL buffAmount = 5)
    });

    test('stone wall buff duration', () => {
      const stoneWall = STONE_WALL;
      const duration = getAbilityBuffDuration(stoneWall);
      
      expect(duration).toBe(3); // Lasts 3 turns
    });

    test('haste buff affects speed', () => {
      const haste = HASTE;
      const amount = getAbilityBuffAmount(haste);
      
      expect(amount).toBe(10); // +10 speed (HASTE buffAmount = 10)
    });
  });

  describe('Ability Usability', () => {
    test('ability usable if MP sufficient and targets available', () => {
      const unit = createTestUnit({ currentMp: 50 });
      const fireball = FIREBALL; // Single enemy damage
      
      const check = isAbilityUsable(unit, fireball, true, true);
      expect(check.usable).toBe(true);
    });

    test('ability not usable if no MP', () => {
      const unit = createTestUnit({ currentMp: 0 });
      const fireball = FIREBALL;
      
      const check = isAbilityUsable(unit, fireball, true, true);
      expect(check.usable).toBe(false);
      expect(check.reason).toContain('Not enough MP');
    });

    test('enemy-targeting ability not usable if no enemies', () => {
      const unit = createTestUnit({ currentMp: 50 });
      const fireball = FIREBALL; // Targets enemy
      
      const check = isAbilityUsable(unit, fireball, true, false); // No enemies
      expect(check.usable).toBe(false);
      expect(check.reason).toContain('No enemies');
    });

    test('ally-targeting ability not usable if no allies', () => {
      const unit = createTestUnit({ currentMp: 50 });
      const cure = CURE; // Targets ally
      
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

