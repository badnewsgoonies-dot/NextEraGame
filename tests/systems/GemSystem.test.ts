/*
 * GemSystem Tests
 * 
 * Verifies gem management and Djinn-inspired mechanics:
 * - Equip/unequip gems
 * - Gem effects (activate/deactivate)
 * - Subclass granting
 * - Ability granting
 * - Gem catalog integrity
 */

import { describe, test, expect } from 'vitest';
import { 
  equipGem,
  unequipGem,
  useGemEffect,
  activateAllGems,
  getUnitAbilities,
  getGemPassiveBonus,
  canUseGemEffect,
  getEquippedGemInfo,
} from '../../src/systems/GemSystem';
import { GEM_CATALOG, getGemById } from '../../src/data/gems';
import type { PlayerUnit } from '../../src/types/game';

describe('GemSystem', () => {
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

  describe('Gem Catalog Integrity', () => {
    test('catalog contains exactly 6 gems', () => {
      expect(GEM_CATALOG).toHaveLength(6);
    });

    test('all gems have required fields', () => {
      GEM_CATALOG.forEach(gem => {
        expect(gem.id).toBeDefined();
        expect(gem.name).toBeDefined();
        expect(gem.description).toBeDefined();
        expect(gem.grantsSubclass).toBeDefined();
        expect(gem.passiveBonus).toBeDefined();
        expect(gem.grantedAbility).toBeDefined();
        expect(gem.gemEffect).toBeDefined();
      });
    });

    test('all gems have unique IDs', () => {
      const ids = GEM_CATALOG.map(g => g.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(GEM_CATALOG.length);
    });

    test('all abilities have MP costs', () => {
      GEM_CATALOG.forEach(gem => {
        expect(gem.grantedAbility.mpCost).toBeGreaterThan(0);
        expect(gem.grantedAbility.mpCost).toBeLessThanOrEqual(50);
      });
    });

    test('getGemById finds existing gems', () => {
      const ruby = getGemById('ruby_gem');
      expect(ruby).toBeDefined();
      expect(ruby?.name).toBe('Ruby Gem');
    });

    test('getGemById returns undefined for non-existent gem', () => {
      const fake = getGemById('fake_gem');
      expect(fake).toBeUndefined();
    });
  });

  describe('Equip Gem', () => {
    test('successfully equips gem', () => {
      const unit = createTestUnit();
      const result = equipGem(unit, 'ruby_gem');
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedGem).toEqual({
          gemId: 'ruby_gem',
          state: 'active',
        });
      }
    });

    test('equipping gem grants subclass', () => {
      const unit = createTestUnit();
      const result = equipGem(unit, 'ruby_gem');
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.subclass).toBe('Fire Adept');
      }
    });

    test('equipping different gems grants different subclasses', () => {
      const unit = createTestUnit();
      
      const ruby = equipGem(unit, 'ruby_gem');
      const emerald = equipGem(unit, 'emerald_gem');
      const sapphire = equipGem(unit, 'sapphire_gem');
      
      expect(ruby.ok && ruby.value.subclass).toBe('Fire Adept');
      expect(emerald.ok && emerald.value.subclass).toBe('Earth Adept');
      expect(sapphire.ok && sapphire.value.subclass).toBe('Water Adept');
    });

    test('gem starts in active state', () => {
      const unit = createTestUnit();
      const result = equipGem(unit, 'ruby_gem');
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedGem?.state).toBe('active');
      }
    });

    test('fails for non-existent gem', () => {
      const unit = createTestUnit();
      const result = equipGem(unit, 'fake_gem');
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });
  });

  describe('Unequip Gem', () => {
    test('removes equipped gem', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
        subclass: 'Fire Adept',
      });
      
      const result = unequipGem(unit);
      expect(result.equippedGem).toBeUndefined();
    });

    test('removes subclass', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
        subclass: 'Fire Adept',
      });
      
      const result = unequipGem(unit);
      expect(result.subclass).toBeUndefined();
    });

    test('unequipping when no gem equipped is safe', () => {
      const unit = createTestUnit(); // No gem
      const result = unequipGem(unit);
      
      expect(result.equippedGem).toBeUndefined();
      expect(result.subclass).toBeUndefined();
    });
  });

  describe('Use Gem Effect', () => {
    test('successfully deactivates gem', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
      });
      
      const result = useGemEffect(unit);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedGem?.state).toBe('inactive');
      }
    });

    test('subclass persists after using gem effect', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
        subclass: 'Fire Adept',
      });
      
      const result = useGemEffect(unit);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.subclass).toBe('Fire Adept'); // Still Fire Adept!
      }
    });

    test('fails if no gem equipped', () => {
      const unit = createTestUnit(); // No gem
      const result = useGemEffect(unit);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('No gem');
      }
    });

    test('fails if gem already inactive', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'inactive' },
      });
      
      const result = useGemEffect(unit);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('already inactive');
      }
    });
  });

  describe('Activate All Gems', () => {
    test('activates all inactive gems in team', () => {
      const team = [
        createTestUnit({
          id: 'unit-1',
          equippedGem: { gemId: 'ruby_gem', state: 'inactive' },
        }),
        createTestUnit({
          id: 'unit-2',
          equippedGem: { gemId: 'emerald_gem', state: 'inactive' },
        }),
      ];
      
      const result = activateAllGems(team);
      
      expect(result[0].equippedGem?.state).toBe('active');
      expect(result[1].equippedGem?.state).toBe('active');
    });

    test('leaves already-active gems unchanged', () => {
      const team = [
        createTestUnit({
          equippedGem: { gemId: 'ruby_gem', state: 'active' },
        }),
      ];
      
      const result = activateAllGems(team);
      expect(result[0].equippedGem?.state).toBe('active');
    });

    test('handles units without gems', () => {
      const team = [
        createTestUnit({ id: 'unit-1' }), // No gem
        createTestUnit({ 
          id: 'unit-2',
          equippedGem: { gemId: 'ruby_gem', state: 'inactive' },
        }),
      ];
      
      const result = activateAllGems(team);
      
      expect(result[0].equippedGem).toBeUndefined();
      expect(result[1].equippedGem?.state).toBe('active');
    });
  });

  describe('Get Unit Abilities', () => {
    test('returns ability from equipped gem', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
      });
      
      const abilities = getUnitAbilities(unit);
      
      expect(abilities).toHaveLength(1);
      expect(abilities[0].id).toBe('fireball');
      expect(abilities[0].name).toBe('Fireball');
      expect(abilities[0].mpCost).toBe(20);
    });

    test('returns empty array if no gem equipped', () => {
      const unit = createTestUnit();
      const abilities = getUnitAbilities(unit);
      
      expect(abilities).toHaveLength(0);
    });

    test('different gems grant different abilities', () => {
      const unitRuby = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
      });
      const unitEmerald = createTestUnit({
        equippedGem: { gemId: 'emerald_gem', state: 'active' },
      });
      
      const abilitiesRuby = getUnitAbilities(unitRuby);
      const abilitiesEmerald = getUnitAbilities(unitEmerald);
      
      expect(abilitiesRuby[0].id).toBe('fireball');
      expect(abilitiesEmerald[0].id).toBe('stone_wall');
    });
  });

  describe('Gem Passive Bonus Retrieval', () => {
    test('ruby gem has +5 attack passive', () => {
      const bonus = getGemPassiveBonus('ruby_gem', 'active');
      expect(bonus.attack).toBe(5);
    });

    test('emerald gem has +5 defense passive', () => {
      const bonus = getGemPassiveBonus('emerald_gem', 'active');
      expect(bonus.defense).toBe(5);
    });

    test('sapphire gem has +3 DEF, +10 HP passive', () => {
      const bonus = getGemPassiveBonus('sapphire_gem', 'active');
      expect(bonus.defense).toBe(3);
      expect(bonus.hp).toBe(10);
    });

    test('citrine gem has +5 speed passive', () => {
      const bonus = getGemPassiveBonus('citrine_gem', 'active');
      expect(bonus.speed).toBe(5);
    });
  });

  describe('Can Use Gem Effect', () => {
    test('can use gem effect if equipped and active', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
      });
      expect(canUseGemEffect(unit)).toBe(true);
    });

    test('cannot use gem effect if no gem equipped', () => {
      const unit = createTestUnit();
      expect(canUseGemEffect(unit)).toBe(false);
    });

    test('cannot use gem effect if gem is inactive', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'inactive' },
      });
      expect(canUseGemEffect(unit)).toBe(false);
    });
  });

  describe('Get Equipped Gem Info', () => {
    test('returns gem info when equipped', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'active' },
      });
      
      const info = getEquippedGemInfo(unit);
      expect(info).not.toBeNull();
      expect(info?.gem.name).toBe('Ruby Gem');
      expect(info?.state).toBe('active');
      expect(info?.passiveActive).toBe(true);
    });

    test('returns null if no gem equipped', () => {
      const unit = createTestUnit();
      const info = getEquippedGemInfo(unit);
      expect(info).toBeNull();
    });

    test('shows passive inactive when gem is inactive', () => {
      const unit = createTestUnit({
        equippedGem: { gemId: 'ruby_gem', state: 'inactive' },
      });
      
      const info = getEquippedGemInfo(unit);
      expect(info?.passiveActive).toBe(false);
    });
  });
});

