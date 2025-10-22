import { describe, test, expect } from 'vitest';
import {
  equipItem,
  unequipItem,
  getEquippedItem,
  getUnitStats,
  getUnequippedItems
} from '../../src/systems/EquipmentSystem.js';
import type { InventoryData, Equipment, PlayerUnit } from '../../src/types/game.js';

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
    name: 'Test Warrior',
    role: 'Tank',
    tags: [],
    level: 1,
    experience: 0,
    hp: 100,
    maxHp: 100,
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
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const inventory = createEmptyInventory();

      const stats = getUnitStats(unit, inventory);

      expect(stats).toEqual({ hp: 100, atk: 20, def: 15, speed: 10 });
    });

    test('adds weapon bonus to attack', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const weapon = createEquipment({ stats: { atk: 10 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats.atk).toBe(30); // 20 base + 10 from weapon
      expect(stats.def).toBe(15); // unchanged
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
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
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

      expect(stats).toEqual({ hp: 100, atk: 30, def: 35, speed: 15 });
    });

    test('handles missing stat bonuses gracefully', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const weapon = createEquipment({ stats: {} }); // No bonuses
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats).toEqual({ hp: 100, atk: 20, def: 15, speed: 10 });
    });

    test('handles equipment with multiple stat bonuses', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
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

      expect(stats).toEqual({ hp: 100, atk: 30, def: 20, speed: 12 });
    });

    test('handles HP bonuses from equipment', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
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
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const weapon = createEquipment({ stats: {} });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      // Stats should remain unchanged
      expect(stats).toEqual({ hp: 100, atk: 20, def: 15, speed: 10 });
    });
  });
});
