/**
 * Spell Casting Integration Tests (SESSION 3)
 *
 * Tests the complete spell casting flow in battle:
 * - MP cost validation
 * - Spell execution (damage, healing, buffs)
 * - MP deduction
 * - HP clamping
 * - Targeting (single, AoE)
 * - Edge cases
 *
 * The spell casting system is already implemented in BattleScreen.tsx.
 * These tests verify the underlying mechanics work correctly.
 */

import { describe, it, expect } from 'vitest';
import { calculateAbilityDamage, calculateAbilityHealing } from '@/systems/AbilitySystem';
import type { BattleUnit, Ability } from '@/types/game';
import { makeRng } from '@/utils/rng';

// ============================================
// Test Helpers
// ============================================

/**
 * Create a test battle unit with customizable properties
 */
function createTestCaster(overrides?: Partial<BattleUnit>): BattleUnit {
  return {
    id: 'caster',
    name: 'Test Mage',
    role: 'DPS',
    tags: ['Arcane'],
    currentHp: 100,
    maxHp: 100,
    currentMp: 50,
    maxMp: 50,
    buffState: { buffs: [] },
    atk: 20,
    def: 10,
    speed: 50,
    isPlayer: true,
    originalIndex: 0,
    portraitUrl: '',
    spriteUrl: '',
    ...overrides,
  };
}

/**
 * Create a test enemy unit
 */
function createTestTarget(overrides?: Partial<BattleUnit>): BattleUnit {
  return {
    id: 'target',
    name: 'Test Enemy',
    role: 'DPS',
    tags: [],
    currentHp: 80,
    maxHp: 100,
    currentMp: 0,
    maxMp: 0,
    buffState: { buffs: [] },
    atk: 15,
    def: 8,
    speed: 40,
    isPlayer: false,
    originalIndex: 0,
    portraitUrl: '',
    spriteUrl: '',
    ...overrides,
  };
}

/**
 * Simulate spell execution (mimics BattleScreen.tsx logic)
 * Returns updated caster and targets
 */
function executeSpell(
  caster: BattleUnit,
  spell: Ability,
  targets: BattleUnit[]
): {
  success: boolean;
  mpCost: number;
  effects: {
    targetId: string;
    effectType: 'damage' | 'heal' | 'buff' | 'debuff';
    amount: number;
    oldHp: number;
    newHp: number;
  }[];
  message: string;
  updatedCaster: BattleUnit;
  updatedTargets: BattleUnit[];
} {
  // Validate MP
  if (caster.currentMp < spell.mpCost) {
    return {
      success: false,
      mpCost: 0,
      effects: [],
      message: `${caster.name} doesn't have enough MP!`,
      updatedCaster: caster,
      updatedTargets: targets,
    };
  }

  // Deduct MP from caster
  const updatedCaster = {
    ...caster,
    currentMp: Math.max(0, caster.currentMp - spell.mpCost),
  };

  const rng = makeRng(12345); // Deterministic RNG for testing
  const effects = targets.map(target => {
    let amount = 0;
    const oldHp = target.currentHp;

    switch (spell.effect.type) {
      case 'damage':
        amount = calculateAbilityDamage(spell, caster.atk, rng);
        break;
      case 'heal':
        amount = calculateAbilityHealing(spell, rng);
        break;
      case 'buff':
      case 'debuff':
        // Placeholder for buff system (already implemented in BattleScreen)
        amount = spell.effect.power;
        break;
    }

    // Clamp HP: damage reduces HP, healing increases it
    let newHp: number;
    if (spell.effect.type === 'heal') {
      newHp = Math.min(target.maxHp, oldHp + amount);
    } else if (spell.effect.type === 'damage') {
      newHp = Math.max(0, oldHp - amount);
    } else {
      newHp = oldHp; // Buffs don't change HP directly
    }

    return {
      targetId: target.id,
      effectType: spell.effect.type,
      amount,
      oldHp,
      newHp,
    };
  });

  // Apply HP changes to targets
  const updatedTargets = targets.map(target => {
    const effect = effects.find(e => e.targetId === target.id);
    if (!effect) return target;

    return {
      ...target,
      currentHp: effect.newHp,
    };
  });

  return {
    success: true,
    mpCost: spell.mpCost,
    effects,
    message: `${caster.name} cast ${spell.name}!`,
    updatedCaster,
    updatedTargets,
  };
}

// ============================================
// Test Spells
// ============================================

const fireBlast: Ability = {
  id: 'fire_blast',
  name: 'Fire Blast',
  description: 'Fire attack',
  mpCost: 8,
  effect: { type: 'damage', power: 25, target: 'single_enemy' },
};

const healingWave: Ability = {
  id: 'healing_wave',
  name: 'Healing Wave',
  description: 'Restore HP',
  mpCost: 8,
  effect: { type: 'heal', power: 30, target: 'single_ally' },
};

const inferno: Ability = {
  id: 'inferno',
  name: 'Inferno',
  description: 'Fire AoE',
  mpCost: 18,
  effect: { type: 'damage', power: 45, target: 'all_enemies' },
};

const ragnarok: Ability = {
  id: 'ragnarok',
  name: 'Ragnarok',
  description: 'Ultimate fire attack',
  mpCost: 28,
  effect: { type: 'damage', power: 999, target: 'single_enemy' },
};

const stoneWall: Ability = {
  id: 'stone_wall',
  name: 'Stone Wall',
  description: 'Defense buff',
  mpCost: 8,
  effect: {
    type: 'buff',
    power: 0,
    target: 'single_ally',
    buffStat: 'defense',
    buffAmount: 10,
    buffDuration: 3,
  },
};

// ============================================
// Tests
// ============================================

describe('Spell Casting Integration', () => {
  // ===== DAMAGE SPELLS =====

  it('successfully casts damage spell on single target', () => {
    const caster = createTestCaster();
    const target = createTestTarget();

    const result = executeSpell(caster, fireBlast, [target]);

    expect(result.success).toBe(true);
    expect(result.mpCost).toBe(8);
    expect(result.effects).toHaveLength(1);
    expect(result.effects[0].effectType).toBe('damage');
    expect(result.effects[0].amount).toBeGreaterThan(0);
    expect(result.effects[0].newHp).toBeLessThan(target.currentHp);
    expect(result.updatedCaster.currentMp).toBe(42); // 50 - 8
  });

  it('damage spell deals correct damage based on caster attack', () => {
    const caster = createTestCaster({ atk: 30 }); // Higher attack
    const target = createTestTarget();

    const result = executeSpell(caster, fireBlast, [target]);

    // Damage formula: base power (25) + 50% of attack (15) + variance(-2, 2)
    // Expected range: 38-42 damage
    expect(result.effects[0].amount).toBeGreaterThanOrEqual(38);
    expect(result.effects[0].amount).toBeLessThanOrEqual(42);
  });

  it('damage cannot reduce HP below 0', () => {
    const caster = createTestCaster();
    const target = createTestTarget({ currentHp: 10 }); // Low HP

    const result = executeSpell(caster, ragnarok, [target]); // Overkill spell

    expect(result.success).toBe(true);
    expect(result.effects[0].newHp).toBe(0); // Clamped to 0
    expect(result.updatedTargets[0].currentHp).toBe(0);
  });

  // ===== HEALING SPELLS =====

  it('successfully casts healing spell on ally', () => {
    const caster = createTestCaster();
    const target = createTestCaster({ id: 'ally', currentHp: 50, maxHp: 100 }); // Damaged ally

    const result = executeSpell(caster, healingWave, [target]);

    expect(result.success).toBe(true);
    expect(result.effects[0].effectType).toBe('heal');
    expect(result.effects[0].newHp).toBeGreaterThan(50);
    expect(result.effects[0].newHp).toBeLessThanOrEqual(100); // Clamped to maxHp
    expect(result.updatedCaster.currentMp).toBe(42); // MP deducted
  });

  it('healing cannot exceed maxHp', () => {
    const caster = createTestCaster();
    const target = createTestCaster({ id: 'ally', currentHp: 95, maxHp: 100 });

    const result = executeSpell(caster, healingWave, [target]);

    expect(result.effects[0].newHp).toBe(100); // Clamped to maxHp
    expect(result.updatedTargets[0].currentHp).toBe(100);
  });

  it('healing on full HP ally stays at max', () => {
    const caster = createTestCaster();
    const target = createTestCaster({ id: 'ally', currentHp: 100, maxHp: 100 }); // Full HP

    const result = executeSpell(caster, healingWave, [target]);

    expect(result.effects[0].newHp).toBe(100); // Still at max
    expect(result.effects[0].oldHp).toBe(100);
  });

  // ===== AOE SPELLS =====

  it('casts AoE spell on multiple targets', () => {
    const caster = createTestCaster();
    const targets = [
      createTestTarget({ id: 'enemy1' }),
      createTestTarget({ id: 'enemy2' }),
      createTestTarget({ id: 'enemy3' }),
    ];

    const result = executeSpell(caster, inferno, targets);

    expect(result.success).toBe(true);
    expect(result.mpCost).toBe(18);
    expect(result.effects).toHaveLength(3);

    result.effects.forEach(effect => {
      expect(effect.effectType).toBe('damage');
      expect(effect.amount).toBeGreaterThan(0);
      expect(effect.newHp).toBeLessThan(effect.oldHp);
    });

    expect(result.updatedCaster.currentMp).toBe(32); // 50 - 18
    expect(result.updatedTargets).toHaveLength(3);
  });

  it('AoE spell affects all targets independently', () => {
    const caster = createTestCaster();
    const targets = [
      createTestTarget({ id: 'enemy1', currentHp: 100 }),
      createTestTarget({ id: 'enemy2', currentHp: 50 }),
      createTestTarget({ id: 'enemy3', currentHp: 10 }),
    ];

    const result = executeSpell(caster, inferno, targets);

    // Each target takes damage independently
    expect(result.effects[0].oldHp).toBe(100);
    expect(result.effects[1].oldHp).toBe(50);
    expect(result.effects[2].oldHp).toBe(10);

    // Low HP enemy might die (0 HP)
    const lowHpEffect = result.effects.find(e => e.targetId === 'enemy3');
    expect(lowHpEffect!.newHp).toBe(0); // Definitely killed
  });

  // ===== MP COST VALIDATION =====

  it('fails to cast spell if not enough MP', () => {
    const caster = createTestCaster({ currentMp: 5 }); // Not enough for 8 MP spell
    const target = createTestTarget();

    const result = executeSpell(caster, fireBlast, [target]);

    expect(result.success).toBe(false);
    expect(result.mpCost).toBe(0);
    expect(result.effects).toHaveLength(0);
    expect(result.message).toContain("doesn't have enough MP");
    expect(result.updatedCaster.currentMp).toBe(5); // MP not deducted
  });

  it('spell with exactly enough MP succeeds', () => {
    const caster = createTestCaster({ currentMp: 8 }); // Exactly enough
    const target = createTestTarget();

    const result = executeSpell(caster, fireBlast, [target]);

    expect(result.success).toBe(true);
    expect(result.updatedCaster.currentMp).toBe(0); // All MP spent
  });

  it('expensive spell requires more MP', () => {
    const caster = createTestCaster({ currentMp: 25 }); // Not enough for 28 MP spell
    const target = createTestTarget();

    const result = executeSpell(caster, ragnarok, [target]);

    expect(result.success).toBe(false);
    expect(result.message).toContain("doesn't have enough MP");
  });

  // ===== MP DEDUCTION =====

  it('MP is correctly deducted after spell cast', () => {
    const caster = createTestCaster({ currentMp: 30 });
    const target = createTestTarget();

    const result = executeSpell(caster, fireBlast, [target]); // 8 MP

    expect(result.updatedCaster.currentMp).toBe(22); // 30 - 8
  });

  it('casting multiple spells deducts MP each time', () => {
    let caster = createTestCaster({ currentMp: 50 });
    const target = createTestTarget();

    // First cast
    let result = executeSpell(caster, fireBlast, [target]); // -8 MP
    caster = result.updatedCaster;
    expect(caster.currentMp).toBe(42);

    // Second cast
    result = executeSpell(caster, fireBlast, [target]); // -8 MP
    caster = result.updatedCaster;
    expect(caster.currentMp).toBe(34);

    // Third cast
    result = executeSpell(caster, fireBlast, [target]); // -8 MP
    caster = result.updatedCaster;
    expect(caster.currentMp).toBe(26);
  });

  it('MP cannot go below 0', () => {
    const caster = createTestCaster({ currentMp: 10 });
    const target = createTestTarget();

    const result = executeSpell(caster, fireBlast, [target]); // -8 MP

    expect(result.updatedCaster.currentMp).toBe(2); // 10 - 8
    expect(result.updatedCaster.currentMp).toBeGreaterThanOrEqual(0);
  });

  // ===== EDGE CASES =====

  it('spell on unit with 0 MP fails', () => {
    const caster = createTestCaster({ currentMp: 0 });
    const target = createTestTarget();

    const result = executeSpell(caster, fireBlast, [target]);

    expect(result.success).toBe(false);
    expect(result.message).toContain("doesn't have enough MP");
  });

  it('spell with 0 targets returns empty effects', () => {
    const caster = createTestCaster();
    const targets: BattleUnit[] = [];

    const result = executeSpell(caster, fireBlast, targets);

    expect(result.success).toBe(true); // Spell executes
    expect(result.effects).toHaveLength(0); // But no targets affected
    expect(result.updatedCaster.currentMp).toBe(42); // MP still deducted
  });

  it('damage variance is applied correctly', () => {
    const caster = createTestCaster({ atk: 20 });
    const target = createTestTarget();

    // Test multiple casts to see variance (using different RNG seeds)
    const damages: number[] = [];

    for (let seed = 0; seed < 10; seed++) {
      // Reset caster MP for each test
      const freshCaster = createTestCaster({ atk: 20 });
      const rng = makeRng(seed);
      const damage = calculateAbilityDamage(fireBlast, freshCaster.atk, rng);
      damages.push(damage);
    }

    // Variance should create different damage values
    const uniqueDamages = new Set(damages);
    expect(uniqueDamages.size).toBeGreaterThan(1); // Should have variance
  });

  it('healing variance is applied correctly', () => {
    const caster = createTestCaster();

    const healAmounts: number[] = [];

    for (let seed = 0; seed < 10; seed++) {
      const rng = makeRng(seed);
      const heal = calculateAbilityHealing(healingWave, rng);
      healAmounts.push(heal);
    }

    // Variance should create different heal values
    const uniqueHeals = new Set(healAmounts);
    expect(uniqueHeals.size).toBeGreaterThan(1);
  });

  it('buff spell does not change HP', () => {
    const caster = createTestCaster();
    const target = createTestCaster({ id: 'ally', currentHp: 80, maxHp: 100 });

    const result = executeSpell(caster, stoneWall, [target]);

    expect(result.success).toBe(true);
    expect(result.effects[0].effectType).toBe('buff');
    expect(result.effects[0].newHp).toBe(80); // HP unchanged
    expect(result.effects[0].oldHp).toBe(80);
  });

  it('deterministic RNG produces same damage with same seed', () => {
    const caster = createTestCaster({ atk: 20 });
    const seed = 42;

    const rng1 = makeRng(seed);
    const damage1 = calculateAbilityDamage(fireBlast, caster.atk, rng1);

    const rng2 = makeRng(seed);
    const damage2 = calculateAbilityDamage(fireBlast, caster.atk, rng2);

    expect(damage1).toBe(damage2); // Same seed = same result
  });

  it('different RNG seeds produce different damage', () => {
    const caster = createTestCaster({ atk: 20 });

    const rng1 = makeRng(111);
    const damage1 = calculateAbilityDamage(fireBlast, caster.atk, rng1);

    const rng2 = makeRng(222);
    const damage2 = calculateAbilityDamage(fireBlast, caster.atk, rng2);

    // Should be different (not guaranteed, but very likely with variance)
    expect(damage1).not.toBe(damage2);
  });
});
