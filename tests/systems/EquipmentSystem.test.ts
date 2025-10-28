import { describe, test, expect } from 'vitest';
import {
  equipItem,
  unequipItem,
  getEquippedItem,
  getUnitStats,
  getUnequippedItems
} from '../../src/systems/EquipmentSystem.js';
import type { InventoryData, Equipment, PlayerUnit } from '../../src/types/game.js';
import { BattleSystem } from '../../src/systems/BattleSystem.js';
import { makeRng } from '../../src/utils/rng.js';
import { ConsoleLogger } from '../../src/systems/Logger.js';
import { EventLogger } from '../../src/systems/EventLogger.js';
import { mockPlayerTeam, weakEnemy } from '../fixtures/battleFixtures.js';

describe('EquipmentSystem', () => {
  // Helper: Create test equipment
  const createEquipment = (overrides?: Partial<Equipment>): Equipment => ({
    id: 'test-weapon-1',
    name: 'Test Sword',
    description: 'A test weapon',
    slot: 'weapon',
    stats: { atk: 10 },
    rarity: 'common',
    ...overrides
  });

  // Helper: Create test unit
  const createUnit = (overrides?: Partial<PlayerUnit>): PlayerUnit => ({
    id: 'unit-1',
    templateId: 'test-template',
    name: 'Test Warrior',
    role: 'Tank',
    tags: [],
    element: 'Venus',
    activeGemState: { gem: null, isActivated: false },
    learnedSpells: [],
    rank: 'C',
    baseClass: 'Warrior',
    level: 1,
    experience: 0,
    hp: 100,
    maxHp: 100,
    currentMp: 50,
    atk: 20,
    def: 15,
    speed: 10,
    ...overrides
  });

  // Helper: Create empty inventory
  const createEmptyInventory = (): InventoryData => ({
    items: [],
    equippedItems: new Map(),
    unequippedItems: [],
    maxItemSlots: 50,
    maxEquipmentSlots: 50
  });

  describe('equipItem', () => {
    test('equips item to unit successfully', () => {
      const weapon = createEquipment();
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon]
      };

      const result = equipItem(inventory, 'unit-1', weapon);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.get('unit-1-weapon')).toEqual(weapon);
        expect(result.value.unequippedItems.length).toBe(0);
      }
    });

    test('replaces existing item in same slot', () => {
      const oldWeapon = createEquipment({ id: 'old-weapon', name: 'Old Sword' });
      const newWeapon = createEquipment({ id: 'new-weapon', name: 'New Sword' });
      
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', oldWeapon]]),
        unequippedItems: [newWeapon]
      };

      const result = equipItem(inventory, 'unit-1', newWeapon);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.get('unit-1-weapon')).toEqual(newWeapon);
        expect(result.value.unequippedItems).toContainEqual(oldWeapon);
        expect(result.value.unequippedItems.length).toBe(1);
      }
    });

    test('returns error if item not in inventory', () => {
      const weapon = createEquipment();
      const inventory = createEmptyInventory();

      const result = equipItem(inventory, 'unit-1', weapon);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    test('handles different slot types correctly', () => {
      const armor = createEquipment({ id: 'armor-1', slot: 'armor', stats: { def: 10 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [armor]
      };

      const result = equipItem(inventory, 'unit-1', armor);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.get('unit-1-armor')).toEqual(armor);
      }
    });

    test('handles accessory slot correctly', () => {
      const accessory = createEquipment({ id: 'acc-1', slot: 'accessory', stats: { speed: 5 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [accessory]
      };

      const result = equipItem(inventory, 'unit-1', accessory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.get('unit-1-accessory')).toEqual(accessory);
      }
    });
  });

  describe('unequipItem', () => {
    test('unequips item from unit', () => {
      const weapon = createEquipment();
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const result = unequipItem(inventory, 'unit-1', 'weapon');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.has('unit-1-weapon')).toBe(false);
        expect(result.value.unequippedItems).toContainEqual(weapon);
      }
    });

    test('returns error if no item equipped in slot', () => {
      const inventory = createEmptyInventory();

      const result = unequipItem(inventory, 'unit-1', 'weapon');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('No weapon equipped');
      }
    });

    test('does not affect other equipped items', () => {
      const weapon = createEquipment({ slot: 'weapon' });
      const armor = createEquipment({ id: 'armor-1', slot: 'armor' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([
          ['unit-1-weapon', weapon],
          ['unit-1-armor', armor]
        ])
      };

      const result = unequipItem(inventory, 'unit-1', 'weapon');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.get('unit-1-armor')).toEqual(armor);
        expect(result.value.equippedItems.size).toBe(1);
      }
    });

    test('handles unequipping armor', () => {
      const armor = createEquipment({ id: 'armor-1', slot: 'armor' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-armor', armor]])
      };

      const result = unequipItem(inventory, 'unit-1', 'armor');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unequippedItems).toContainEqual(armor);
      }
    });

    test('handles unequipping accessory', () => {
      const accessory = createEquipment({ id: 'acc-1', slot: 'accessory' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-accessory', accessory]])
      };

      const result = unequipItem(inventory, 'unit-1', 'accessory');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unequippedItems).toContainEqual(accessory);
      }
    });
  });

  describe('getEquippedItem', () => {
    test('returns equipped item in slot', () => {
      const weapon = createEquipment();
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const equipped = getEquippedItem(inventory, 'unit-1', 'weapon');

      expect(equipped).toEqual(weapon);
    });

    test('returns undefined if no item equipped', () => {
      const inventory = createEmptyInventory();

      const equipped = getEquippedItem(inventory, 'unit-1', 'weapon');

      expect(equipped).toBeUndefined();
    });

    test('returns correct item for different units', () => {
      const weapon1 = createEquipment({ id: 'weapon-1', name: 'Unit 1 Sword' });
      const weapon2 = createEquipment({ id: 'weapon-2', name: 'Unit 2 Sword' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([
          ['unit-1-weapon', weapon1],
          ['unit-2-weapon', weapon2]
        ])
      };

      expect(getEquippedItem(inventory, 'unit-1', 'weapon')).toEqual(weapon1);
      expect(getEquippedItem(inventory, 'unit-2', 'weapon')).toEqual(weapon2);
    });

    test('returns correct item for different slots', () => {
      const weapon = createEquipment({ slot: 'weapon' });
      const armor = createEquipment({ id: 'armor-1', slot: 'armor' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([
          ['unit-1-weapon', weapon],
          ['unit-1-armor', armor]
        ])
      };

      expect(getEquippedItem(inventory, 'unit-1', 'weapon')).toEqual(weapon);
      expect(getEquippedItem(inventory, 'unit-1', 'armor')).toEqual(armor);
    });
  });

  describe('getUnitStats', () => {
    test('calculates base stats without equipment', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100, currentMp: 30 });
      const inventory = createEmptyInventory();

      const stats = getUnitStats(unit, inventory);

      expect(stats).toEqual({ hp: 100, mp: 30, atk: 20, def: 15, speed: 10 });
    });

    test('adds weapon bonus to attack', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100, currentMp: 50 });
      const weapon = createEquipment({ stats: { atk: 10 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats.atk).toBe(30); // 20 base + 10 from weapon
      expect(stats.def).toBe(15); // unchanged
      expect(stats.mp).toBe(50); // no equipment bonuses for MP
    });

    test('adds armor bonus to defense', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const armor = createEquipment({ id: 'armor-1', slot: 'armor', stats: { def: 20 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-armor', armor]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats.def).toBe(35); // 15 base + 20 from armor
    });

    test('adds accessory bonus to speed', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const accessory = createEquipment({ id: 'acc-1', slot: 'accessory', stats: { speed: 5 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-accessory', accessory]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats.speed).toBe(15); // 10 base + 5 from accessory
    });

    test('combines multiple equipment bonuses', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100, currentMp: 50 });
      const weapon = createEquipment({ slot: 'weapon', stats: { atk: 10 } });
      const armor = createEquipment({ id: 'armor-1', slot: 'armor', stats: { def: 20 } });
      const accessory = createEquipment({ id: 'acc-1', slot: 'accessory', stats: { speed: 5 } });

      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([
          ['unit-1-weapon', weapon],
          ['unit-1-armor', armor],
          ['unit-1-accessory', accessory]
        ])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats).toEqual({ hp: 100, mp: 50, atk: 30, def: 35, speed: 15 });
    });

    test('handles missing stat bonuses gracefully', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100, currentMp: 50 });
      const weapon = createEquipment({ stats: {} }); // No bonuses
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats).toEqual({ hp: 100, mp: 50, atk: 20, def: 15, speed: 10 });
    });

    test('handles equipment with multiple stat bonuses', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100, currentMp: 50 });
      const weapon = createEquipment({
        stats: {
          atk: 10,
          def: 5,
          speed: 2
        }
      });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats).toEqual({ hp: 100, mp: 50, atk: 30, def: 20, speed: 12 });
    });

    test('handles HP bonuses from equipment', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100, currentMp: 50 });
      const armor = createEquipment({
        id: 'armor-1',
        slot: 'armor',
        stats: { hp: 50, def: 10 }
      });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-armor', armor]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats.hp).toBe(150); // 100 base + 50 from armor
      expect(stats.def).toBe(25); // 15 base + 10 from armor
      expect(stats.mp).toBe(50); // no equipment bonuses for MP
    });

    test('MP stat is always equal to currentMp (no equipment bonuses)', () => {
      const unit = createUnit({ currentMp: 35 });
      const weapon = createEquipment({ stats: { atk: 10 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats.mp).toBe(35);
    });

    test('MP stat varies with different currentMp values', () => {
      const inventory = createEmptyInventory();

      const unit1 = createUnit({ currentMp: 0 });
      expect(getUnitStats(unit1, inventory).mp).toBe(0);

      const unit2 = createUnit({ currentMp: 25 });
      expect(getUnitStats(unit2, inventory).mp).toBe(25);

      const unit3 = createUnit({ currentMp: 50 });
      expect(getUnitStats(unit3, inventory).mp).toBe(50);
    });

    test('all five stats are returned (hp, mp, atk, def, speed)', () => {
      const unit = createUnit({
        maxHp: 120,
        currentMp: 40,
        atk: 25,
        def: 18,
        speed: 12
      });
      const inventory = createEmptyInventory();

      const stats = getUnitStats(unit, inventory);

      expect(stats).toHaveProperty('hp');
      expect(stats).toHaveProperty('mp');
      expect(stats).toHaveProperty('atk');
      expect(stats).toHaveProperty('def');
      expect(stats).toHaveProperty('speed');
      expect(Object.keys(stats)).toHaveLength(5);
    });
  });

  describe('getUnequippedItems', () => {
    test('returns all unequipped items', () => {
      const weapon = createEquipment();
      const armor = createEquipment({ id: 'armor-1', slot: 'armor' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon, armor]
      };

      const items = getUnequippedItems(inventory);

      expect(items).toEqual([weapon, armor]);
    });

    test('returns empty array when no items', () => {
      const inventory = createEmptyInventory();

      const items = getUnequippedItems(inventory);

      expect(items).toEqual([]);
    });

    test('does not include equipped items', () => {
      const weapon = createEquipment();
      const armor = createEquipment({ id: 'armor-1', slot: 'armor' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]]),
        unequippedItems: [armor]
      };

      const items = getUnequippedItems(inventory);

      expect(items).toEqual([armor]);
      expect(items).not.toContainEqual(weapon);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty inventory correctly', () => {
      const inventory = createEmptyInventory();
      const weapon = createEquipment();

      const equipResult = equipItem(inventory, 'unit-1', weapon);
      expect(equipResult.ok).toBe(false); // Item not in unequipped list

      const unequipResult = unequipItem(inventory, 'unit-1', 'weapon');
      expect(unequipResult.ok).toBe(false); // Nothing to unequip
    });

    test('handles multiple units independently', () => {
      const weapon1 = createEquipment({ id: 'weapon-1' });
      const weapon2 = createEquipment({ id: 'weapon-2' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon1, weapon2]
      };

      const result1 = equipItem(inventory, 'unit-1', weapon1);
      expect(result1.ok).toBe(true);
      
      if (result1.ok) {
        const result2 = equipItem(result1.value, 'unit-2', weapon2);
        expect(result2.ok).toBe(true);
        
        if (result2.ok) {
          expect(result2.value.equippedItems.get('unit-1-weapon')).toEqual(weapon1);
          expect(result2.value.equippedItems.get('unit-2-weapon')).toEqual(weapon2);
          expect(result2.value.unequippedItems.length).toBe(0);
        }
      }
    });

    test('allows equipping to any unitId (validation is UI concern)', () => {
      const weapon = createEquipment();
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon]
      };

      // System allows equipping to any unitId
      const result = equipItem(inventory, 'nonexistent-unit', weapon);
      expect(result.ok).toBe(true); // Still succeeds
    });

    test('maintains immutability of inventory', () => {
      const weapon = createEquipment();
      const originalInventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon]
      };

      const result = equipItem(originalInventory, 'unit-1', weapon);

      // Original inventory should be unchanged
      expect(originalInventory.unequippedItems).toHaveLength(1);
      expect(originalInventory.equippedItems.size).toBe(0);
      
      if (result.ok) {
        expect(result.value.unequippedItems).toHaveLength(0);
        expect(result.value.equippedItems.size).toBe(1);
      }
    });

    test('handles equipment with no stat bonuses', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100, currentMp: 50 });
      const weapon = createEquipment({ stats: {} });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      // Stats should remain unchanged
      expect(stats).toEqual({ hp: 100, mp: 50, atk: 20, def: 15, speed: 10 });
    });
  });

  describe('Equipment Integration - Combat Effects', () => {
    test('equipped weapon increases actual battle damage', () => {
      const logger = new ConsoleLogger('error');
      const eventLogger = new EventLogger(logger);
      const battleSystem = new BattleSystem(logger, eventLogger);
      
      // Setup: Use mockPlayerTeam fixture with known stats
      const baseUnit: PlayerUnit = {
        ...mockPlayerTeam[0],
        id: 'fighter-1',
        atk: 20,  // Base attack
      };
      
      // Battle 1: No equipment (baseline)
      const rng1 = makeRng(12345);
      const result1 = battleSystem.executeBattle([baseUnit], [weakEnemy], rng1, 0, 'baseline');
      
      // Extract damage dealt from actions
      const damageDealt1 = result1.actions
        .filter((a: any) => a.type === 'attack' && a.actorId === 'fighter-1')
        .reduce((sum: number, a: any) => sum + (a.damage || 0), 0);
      
      // Battle 2: Equipped with +10 ATK weapon
      const weapon = createEquipment({
        id: 'iron_sword',
        name: 'Iron Sword',
        slot: 'weapon',
        stats: { atk: 10 },
      });
      
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon],
      };
      
      const equipResult = equipItem(inventory, 'fighter-1', weapon);
      expect(equipResult.ok).toBe(true);
      
      if (!equipResult.ok) return;
      
      // Apply equipment bonuses to unit
      const unitWithWeapon: PlayerUnit = {
        ...baseUnit,
        atk: getUnitStats(baseUnit, equipResult.value).atk,
      };
      
      expect(unitWithWeapon.atk).toBe(30); // 20 base + 10 weapon
      
      const rng2 = makeRng(12345); // Same seed = same RNG rolls
      const result2 = battleSystem.executeBattle([unitWithWeapon], [weakEnemy], rng2, 0, 'equipped');
      
      const damageDealt2 = result2.actions
        .filter((a: any) => a.type === 'attack' && a.actorId === 'fighter-1')
        .reduce((sum: number, a: any) => sum + (a.damage || 0), 0);
      
      // CRITICAL ASSERTION: Equipped weapon MUST increase damage
      expect(damageDealt2).toBeGreaterThan(damageDealt1);
      
      // Damage formula: floor(atk - def/2) + rng(-2, 2)
      // Expected increase: ~10 damage per hit (from +10 ATK)
      const damageIncrease = damageDealt2 - damageDealt1;
      expect(damageIncrease).toBeGreaterThanOrEqual(8); // Allow for RNG variance
    });

    test('multiple equipped items stack bonuses correctly', () => {
      const unit = createUnit({
        id: 'hero-1',
        atk: 20,
        def: 15,
        speed: 10,
      });
      
      const weapon = createEquipment({
        id: 'weapon-1',
        slot: 'weapon',
        stats: { atk: 10 },
      });
      
      const armor = createEquipment({
        id: 'armor-1',
        name: 'Iron Armor',
        slot: 'armor',
        stats: { def: 8 },
      });
      
      const accessory = createEquipment({
        id: 'boots-1',
        name: 'Speed Boots',
        slot: 'accessory',
        stats: { speed: 5 },
      });
      
      let inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon, armor, accessory],
      };
      
      // Equip all three items
      const equipWeapon = equipItem(inventory, 'hero-1', weapon);
      expect(equipWeapon.ok).toBe(true);
      if (!equipWeapon.ok) return;
      inventory = equipWeapon.value;
      
      const equipArmor = equipItem(inventory, 'hero-1', armor);
      expect(equipArmor.ok).toBe(true);
      if (!equipArmor.ok) return;
      inventory = equipArmor.value;
      
      const equipAccessory = equipItem(inventory, 'hero-1', accessory);
      expect(equipAccessory.ok).toBe(true);
      if (!equipAccessory.ok) return;
      inventory = equipAccessory.value;
      
      // Verify all bonuses stack
      const stats = getUnitStats(unit, inventory);
      expect(stats.atk).toBe(30);   // 20 + 10
      expect(stats.def).toBe(23);   // 15 + 8
      expect(stats.speed).toBe(15); // 10 + 5
    });
  });
});
