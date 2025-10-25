/*
 * ItemSystem Tests
 * Comprehensive tests for consumable item usage logic
 */

import { describe, test, expect } from 'vitest';
import {
  useConsumableItem,
  canUseItem,
  getUsableItems
} from '../../src/systems/ItemSystem.js';
import type { Item, PlayerUnit, InventoryData } from '../../src/types/game.js';

describe('ItemSystem', () => {
  // Test Helpers
  const createUnit = (overrides?: Partial<PlayerUnit>): PlayerUnit => ({
    id: 'unit-1',
    templateId: 'warrior_template',
    name: 'Test Warrior',
    role: 'Tank',
    baseClass: 'Warrior',
    tags: [],
    hp: 50,
    maxHp: 100,
    atk: 20,
    def: 15,
    speed: 10,
    level: 1,
    experience: 0,
    rank: 'C',
    currentMp: 0,
    ...overrides
  });

  const createItem = (id: string, hpRestore: number): Item => ({
    id,
    name: id === 'health_potion' ? 'Health Potion' : 'Mega Potion',
    type: 'consumable',
    rarity: 'common',
    description: `Restores ${hpRestore} HP`,
    stats: { hpRestore }
  });

  const createInventory = (items: Item[]): InventoryData => ({
    items,
    equippedItems: new Map(),
    unequippedItems: [],
    maxItemSlots: 50,
    maxEquipmentSlots: 50
  });

  describe('useConsumableItem', () => {
    test('uses health potion and restores HP', () => {
      const unit = createUnit({ hp: 50, maxHp: 100 });
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(100); // 50 + 50
        expect(result.value.inventory.items.length).toBe(0); // Item consumed
      }
    });

    test('caps HP at maxHp when healing', () => {
      const unit = createUnit({ hp: 80, maxHp: 100 });
      const potion = createItem('health_potion', 50); // Would heal to 130
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(100); // Capped at maxHp
      }
    });

    test('fails if target at full HP', () => {
      const unit = createUnit({ hp: 100, maxHp: 100 });
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('full HP');
      }
    });

    test('fails if item not in inventory', () => {
      const unit = createUnit({ hp: 50 });
      const potion = createItem('health_potion', 50);
      const emptyInventory = createInventory([]);

      const result = useConsumableItem(potion, unit, emptyInventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    test('fails if item is not consumable', () => {
      const unit = createUnit({ hp: 50 });
      const weapon: Item = {
        id: 'sword',
        name: 'Iron Sword',
        type: 'weapon',
        rarity: 'common',
        description: 'A sword',
        stats: { atkBonus: 10 }
      };
      const inventory = createInventory([weapon]);

      const result = useConsumableItem(weapon, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not consumable');
      }
    });

    test('phoenix down revives KO\'d unit', () => {
      const unit = createUnit({ hp: 0, maxHp: 100 }); // KO'd
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives fallen ally',
        stats: { hpRestore: 50 }
      };
      const inventory = createInventory([phoenixDown]);

      const result = useConsumableItem(phoenixDown, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(50); // Revived with 50 HP
      }
    });

    test('phoenix down fails on alive unit', () => {
      const unit = createUnit({ hp: 50, maxHp: 100 });
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives fallen ally',
        stats: { hpRestore: 50 }
      };
      const inventory = createInventory([phoenixDown]);

      const result = useConsumableItem(phoenixDown, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('KO\'d units');
      }
    });

    test('regular potion fails on KO\'d unit', () => {
      const unit = createUnit({ hp: 0, maxHp: 100 });
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('KO\'d');
      }
    });

    test('consumes item after use', () => {
      const unit = createUnit({ hp: 50 });
      const potion1 = createItem('health_potion', 50);
      const potion2 = { ...potion1, id: 'health_potion_2' };
      const inventory = createInventory([potion1, potion2]);

      const result = useConsumableItem(potion1, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.inventory.items.length).toBe(1);
        expect(result.value.inventory.items[0].id).toBe('health_potion_2');
      }
    });

    test('preserves other inventory properties', () => {
      const unit = createUnit({ hp: 50 });
      const potion = createItem('health_potion', 50);
      let inventory = createInventory([potion]);
      inventory = { ...inventory, maxItemSlots: 99 };

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.inventory.maxItemSlots).toBe(99);
      }
    });

    test('handles item with no hpRestore stat', () => {
      const unit = createUnit({ hp: 50 });
      const brokenItem: Item = {
        id: 'broken',
        name: 'Broken Item',
        type: 'consumable',
        rarity: 'common',
        description: 'Does nothing',
        stats: {} // No hpRestore
      };
      const inventory = createInventory([brokenItem]);

      const result = useConsumableItem(brokenItem, unit, inventory);

      // Should fail validation (no effect to apply)
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('no usable effect');
      }
    });

    test('handles item with undefined stats', () => {
      const unit = createUnit({ hp: 50 });
      const brokenItem: Item = {
        id: 'broken',
        name: 'Broken Item',
        type: 'consumable',
        rarity: 'common',
        description: 'Does nothing'
        // No stats field at all
      };
      const inventory = createInventory([brokenItem]);

      const result = useConsumableItem(brokenItem, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('no usable effect');
      }
    });

    test('antidote always fails (future feature)', () => {
      const unit = createUnit({ hp: 50 });
      const antidote: Item = {
        id: 'antidote',
        name: 'Antidote',
        type: 'consumable',
        rarity: 'common',
        description: 'Cures poison',
        stats: {}
      };
      const inventory = createInventory([antidote]);

      const result = useConsumableItem(antidote, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('status');
      }
    });
  });

  describe('canUseItem', () => {
    test('returns true for valid healing item', () => {
      const unit = createUnit({ hp: 50, maxHp: 100 });
      const potion = createItem('health_potion', 50);

      const result = canUseItem(potion, unit);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(true);
      }
    });

    test('returns error if target at full HP', () => {
      const unit = createUnit({ hp: 100, maxHp: 100 });
      const potion = createItem('health_potion', 50);

      const result = canUseItem(potion, unit);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('full HP');
      }
    });

    test('returns error for non-consumable', () => {
      const unit = createUnit({ hp: 50 });
      const weapon: Item = {
        id: 'sword',
        name: 'Sword',
        type: 'weapon',
        rarity: 'common',
        description: 'A weapon',
        stats: { atkBonus: 10 }
      };

      const result = canUseItem(weapon, unit);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not consumable');
      }
    });

    test('phoenix down valid on KO\'d unit', () => {
      const unit = createUnit({ hp: 0, maxHp: 100 });
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives',
        stats: { hpRestore: 50 }
      };

      const result = canUseItem(phoenixDown, unit);

      expect(result.ok).toBe(true);
    });

    test('phoenix down invalid on alive unit', () => {
      const unit = createUnit({ hp: 50 });
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives',
        stats: { hpRestore: 50 }
      };

      const result = canUseItem(phoenixDown, unit);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('KO\'d');
      }
    });

    test('antidote fails without status effects', () => {
      const unit = createUnit({ hp: 50 });
      const antidote: Item = {
        id: 'antidote',
        name: 'Antidote',
        type: 'consumable',
        rarity: 'common',
        description: 'Cures poison',
        stats: {}
      };

      const result = canUseItem(antidote, unit);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('status');
      }
    });

    test('validates healing on unit with 1 HP', () => {
      const unit = createUnit({ hp: 1, maxHp: 100 });
      const potion = createItem('health_potion', 50);

      const result = canUseItem(potion, unit);

      expect(result.ok).toBe(true);
    });

    test('validates item with no stats field', () => {
      const unit = createUnit({ hp: 50 });
      const item: Item = {
        id: 'test',
        name: 'Test',
        type: 'consumable',
        rarity: 'common'
      };

      const result = canUseItem(item, unit);

      expect(result.ok).toBe(false);
    });
  });

  describe('getUsableItems', () => {
    test('filters items that can be used', () => {
      const unit = createUnit({ hp: 50, maxHp: 100 });
      const potion1 = createItem('health_potion', 50);
      const potion2 = { ...potion1, id: 'mega_potion', name: 'Mega Potion' };
      const inventory = createInventory([potion1, potion2]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(2);
    });

    test('excludes items that cannot be used', () => {
      const unit = createUnit({ hp: 100, maxHp: 100 }); // Full HP
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(0); // Can't use potion at full HP
    });

    test('includes phoenix down only for KO\'d units', () => {
      const unit = createUnit({ hp: 0, maxHp: 100 }); // KO'd
      const potion = createItem('health_potion', 50);
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives',
        stats: { hpRestore: 50 }
      };
      const inventory = createInventory([potion, phoenixDown]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(1);
      expect(usable[0].id).toBe('phoenix_down');
    });

    test('returns empty array for empty inventory', () => {
      const unit = createUnit({ hp: 50 });
      const inventory = createInventory([]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(0);
    });

    test('excludes non-consumables', () => {
      const unit = createUnit({ hp: 50 });
      const weapon: Item = {
        id: 'sword',
        name: 'Sword',
        type: 'weapon',
        rarity: 'common',
        description: 'A weapon',
        stats: { atkBonus: 10 }
      };
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([weapon, potion]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(1);
      expect(usable[0].type).toBe('consumable');
    });

    test('handles mixed valid and invalid items', () => {
      const unit = createUnit({ hp: 50, maxHp: 100 });
      const potion = createItem('health_potion', 50); // Valid
      const phoenixDown: Item = { // Invalid (unit not KO'd)
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        stats: { hpRestore: 50 }
      };
      const inventory = createInventory([potion, phoenixDown]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(1);
      expect(usable[0].id).toBe('health_potion');
    });

    test('returns all healing items for damaged unit', () => {
      const unit = createUnit({ hp: 10, maxHp: 100 });
      const potion1 = createItem('health_potion', 50);
      const potion2 = createItem('mega_potion', 100);
      const elixir: Item = {
        id: 'elixir',
        name: 'Elixir',
        type: 'consumable',
        rarity: 'epic',
        stats: { hpRestore: 150 }
      };
      const inventory = createInventory([potion1, potion2, elixir]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    test('handles multiple uses in sequence', () => {
      const unit = createUnit({ hp: 10, maxHp: 100 });
      const potion1 = createItem('health_potion', 50);
      const potion2 = { ...potion1, id: 'potion2' };
      let inventory = createInventory([potion1, potion2]);

      // First use
      const result1 = useConsumableItem(potion1, unit, inventory);
      expect(result1.ok).toBe(true);
      
      if (result1.ok) {
        const updatedUnit = result1.value.unit;
        inventory = result1.value.inventory;
        
        expect(updatedUnit.hp).toBe(60);
        expect(inventory.items.length).toBe(1);

        // Second use
        const result2 = useConsumableItem(potion2, updatedUnit, inventory);
        expect(result2.ok).toBe(true);
        
        if (result2.ok) {
          expect(result2.value.unit.hp).toBe(100); // Capped
          expect(result2.value.inventory.items.length).toBe(0);
        }
      }
    });

    test('handles unit with 99/100 HP (almost full)', () => {
      const unit = createUnit({ hp: 99, maxHp: 100 });
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(100); // Restored 1 HP, capped
      }
    });

    test('preserves other unit properties', () => {
      const unit = createUnit({ hp: 50, name: 'Hero', level: 5 });
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.name).toBe('Hero');
        expect(result.value.unit.level).toBe(5);
        expect(result.value.unit.atk).toBe(20); // Unchanged
      }
    });

    test('handles inventory with duplicate items', () => {
      const unit = createUnit({ hp: 50 });
      const potion1 = createItem('health_potion', 50);
      const potion2 = createItem('health_potion', 50); // Same ID
      const inventory = createInventory([potion1, potion2]);

      const result = useConsumableItem(potion1, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        // Should remove first occurrence only
        expect(result.value.inventory.items.length).toBe(1);
      }
    });

    test('phoenix down revives with partial HP', () => {
      const unit = createUnit({ hp: 0, maxHp: 200 });
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        stats: { hpRestore: 50 }
      };
      const inventory = createInventory([phoenixDown]);

      const result = useConsumableItem(phoenixDown, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(50); // 50 out of 200
      }
    });
  });
});
