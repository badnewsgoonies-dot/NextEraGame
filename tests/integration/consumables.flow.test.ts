/**
 * Integration Test: Consumable Items Full Flow
 * 
 * Tests complete lifecycle of consumable items:
 * - Gaining items from battles
 * - Using items in battle
 * - Using items in inventory screen
 * - Validation in real scenarios
 * - Edge cases (KO'd units, full HP, Phoenix Down)
 */

import { describe, test, expect } from 'vitest';
import { GameController } from '../../src/core/GameController.js';
import { ConsoleLogger } from '../../src/systems/Logger.js';
import { useConsumableItem, canUseItem, getUsableItems } from '../../src/systems/ItemSystem.js';
import type { PlayerUnit, Item, InventoryData } from '../../src/types/game.js';

describe('Consumable Items Integration', () => {
  const createMockUnit = (overrides?: Partial<PlayerUnit>): PlayerUnit => ({
    id: 'unit-1',
    name: 'Test Warrior',
    role: 'Tank',
    tags: ['Holy'],
    templateId: 'warrior_01',
    baseClass: 'Warrior',
    rank: 'C',
    level: 1,
    experience: 0,
    hp: 50,
    maxHp: 100,
    currentMp: 50,
    atk: 20,
    def: 15,
    speed: 10,
    ...overrides
  });

  const healthPotion: Item = {
    id: 'health_potion',
    name: 'Health Potion',
    type: 'consumable',
    rarity: 'common',
    description: 'Restores 50 HP',
    stats: { hpRestore: 50 }
  };

  const megaPotion: Item = {
    id: 'mega_potion',
    name: 'Mega Potion',
    type: 'consumable',
    rarity: 'rare',
    description: 'Restores 100 HP',
    stats: { hpRestore: 100 }
  };

  const phoenixDown: Item = {
    id: 'phoenix_down',
    name: 'Phoenix Down',
    type: 'consumable',
    rarity: 'rare',
    description: 'Revives a KO\'d unit',
    stats: { hpRestore: 50 }
  };

  describe('Full Game Flow: Gain → Use → Persist', () => {
    test('controller starts with 3 Health Potions', () => {
      const logger = new ConsoleLogger();
      const controller = new GameController(logger);
      
      const starterTeam = [createMockUnit()];
      controller.startRun(starterTeam, 12345);

      const consumables = controller.getConsumables();
      expect(consumables.length).toBe(3);
      expect(consumables.every(item => item.id === 'health_potion')).toBe(true);
    });

    test('can add items to inventory', () => {
      const logger = new ConsoleLogger();
      const controller = new GameController(logger);
      
      controller.startRun([createMockUnit()], 12345);
      
      controller.addItems([megaPotion]); // Returns void

      const consumables = controller.getConsumables();
      expect(consumables.length).toBe(4); // 3 potions + 1 mega
      expect(consumables.some(i => i.id === 'mega_potion')).toBe(true);
    });

    test('can remove items from inventory', () => {
      const logger = new ConsoleLogger();
      const controller = new GameController(logger);
      
      controller.startRun([createMockUnit()], 12345);

      const removeResult = controller.removeItem('health_potion');
      expect(removeResult.ok).toBe(true);

      const consumables = controller.getConsumables();
      expect(consumables.length).toBe(2);
    });

    test('removing non-existent item returns error', () => {
      const logger = new ConsoleLogger();
      const controller = new GameController(logger);
      
      controller.startRun([createMockUnit()], 12345);

      const removeResult = controller.removeItem('fake_item');
      expect(removeResult.ok).toBe(false);
      if (!removeResult.ok) {
        expect(removeResult.error).toContain('not found');
      }
    });

    test('inventory persists across battles', () => {
      const logger = new ConsoleLogger();
      const controller = new GameController(logger);
      
      controller.startRun([createMockUnit()], 12345);

      // Use one item
      controller.removeItem('health_potion');
      expect(controller.getConsumables().length).toBe(2);

      // Add new items (simulating battle rewards)
      controller.addItems([megaPotion, phoenixDown]);
      expect(controller.getConsumables().length).toBe(4);

      // Verify items are still there
      const consumables = controller.getConsumables();
      expect(consumables.some(i => i.id === 'mega_potion')).toBe(true);
      expect(consumables.some(i => i.id === 'phoenix_down')).toBe(true);
    });
  });

  describe('Battle Usage Scenarios', () => {
    test('healing potion restores HP and removes item from inventory', () => {
      const damagedUnit = createMockUnit({ hp: 50, maxHp: 100 });
      const inventory: InventoryData = {
        items: [healthPotion],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(healthPotion, damagedUnit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(100); // 50 + 50 = 100
        expect(result.value.inventory.items.length).toBe(0); // Item consumed
      }
    });

    test('mega potion heals more HP', () => {
      const damagedUnit = createMockUnit({ hp: 20, maxHp: 150 });
      const inventory: InventoryData = {
        items: [megaPotion],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(megaPotion, damagedUnit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(120); // 20 + 100 = 120
        expect(result.value.unit.hp).toBeLessThanOrEqual(damagedUnit.maxHp);
      }
    });

    test('healing capped at maxHp (no overheal)', () => {
      const damagedUnit = createMockUnit({ hp: 90, maxHp: 100 });
      const inventory: InventoryData = {
        items: [megaPotion], // +100 HP but unit only needs 10
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(megaPotion, damagedUnit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(100); // Capped at maxHp
        expect(result.value.unit.hp).not.toBeGreaterThan(damagedUnit.maxHp);
      }
    });

    test('cannot use potion on unit at full HP', () => {
      const fullHpUnit = createMockUnit({ hp: 100, maxHp: 100 });
      const inventory: InventoryData = {
        items: [healthPotion],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(healthPotion, fullHpUnit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('full HP');
      }
    });

    test('cannot use regular potion on KO\'d unit', () => {
      const koUnit = createMockUnit({ hp: 0, maxHp: 100 });
      const inventory: InventoryData = {
        items: [healthPotion],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(healthPotion, koUnit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('KO');
      }
    });
  });

  describe('Phoenix Down Special Cases', () => {
    test('Phoenix Down revives KO\'d unit', () => {
      const koUnit = createMockUnit({ hp: 0, maxHp: 100 });
      const inventory: InventoryData = {
        items: [phoenixDown],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(phoenixDown, koUnit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(50); // Revived with 50 HP
        expect(result.value.unit.hp).toBeGreaterThan(0);
        expect(result.value.inventory.items.length).toBe(0); // Consumed
      }
    });

    test('Phoenix Down cannot be used on alive unit', () => {
      const aliveUnit = createMockUnit({ hp: 50, maxHp: 100 });
      const inventory: InventoryData = {
        items: [phoenixDown],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(phoenixDown, aliveUnit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('KO\'d units');
      }
    });

    test('Phoenix Down only appears in usable items for KO\'d units', () => {
      const aliveUnit = createMockUnit({ hp: 50, maxHp: 100 });
      const koUnit = createMockUnit({ id: 'unit-2', hp: 0, maxHp: 100 });
      
      const inventory: InventoryData = {
        items: [healthPotion, phoenixDown],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      // Alive unit: should only see health potion
      const usableForAlive = getUsableItems(inventory, aliveUnit);
      expect(usableForAlive.length).toBe(1);
      expect(usableForAlive[0].id).toBe('health_potion');

      // KO'd unit: should only see phoenix down
      const usableForKO = getUsableItems(inventory, koUnit);
      expect(usableForKO.length).toBe(1);
      expect(usableForKO[0].id).toBe('phoenix_down');
    });
  });

  describe('Validation Functions', () => {
    test('canUseItem returns ok for valid usage', () => {
      const damagedUnit = createMockUnit({ hp: 50, maxHp: 100 });
      
      const result = canUseItem(healthPotion, damagedUnit);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(true);
      }
    });

    test('canUseItem returns error for invalid usage', () => {
      const fullHpUnit = createMockUnit({ hp: 100, maxHp: 100 });
      
      const result = canUseItem(healthPotion, fullHpUnit);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeTruthy();
      }
    });

    test('getUsableItems filters correctly', () => {
      const damagedUnit1 = createMockUnit({ id: 'unit-1', hp: 50, maxHp: 100 });
      const fullHpUnit = createMockUnit({ id: 'unit-2', hp: 100, maxHp: 100 });
      
      const inventory: InventoryData = {
        items: [healthPotion, megaPotion],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      // Damaged unit can use both potions
      const usableForDamaged = getUsableItems(inventory, damagedUnit1);
      expect(usableForDamaged.length).toBe(2);

      // Full HP unit cannot use any potions
      const usableForFull = getUsableItems(inventory, fullHpUnit);
      expect(usableForFull.length).toBe(0);
    });

    test('getUsableItems returns empty for empty inventory', () => {
      const damagedUnit = createMockUnit({ hp: 50, maxHp: 100 });
      
      const inventory: InventoryData = {
        items: [],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const usable = getUsableItems(inventory, damagedUnit);
      expect(usable.length).toBe(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('using item that is not in inventory returns error', () => {
      const unit = createMockUnit({ hp: 50, maxHp: 100 });
      const inventory: InventoryData = {
        items: [], // Empty
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(healthPotion, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    test('using non-consumable item returns error', () => {
      const unit = createMockUnit({ hp: 50, maxHp: 100 });
      const equipment: Item = {
        id: 'sword',
        name: 'Iron Sword',
        type: 'consumable', // Wrong type to test validation
        rarity: 'common',
        description: 'A sword',
        stats: { atkBonus: 10 }
      };
      
      const inventory: InventoryData = {
        items: [equipment],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      // This will pass type validation but fail runtime validation
      // since it has no hpRestore stat
      const result = useConsumableItem(equipment, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('no usable effect'); // Item with no hpRestore
      }
    });

    test('multiple items of same type can be used', () => {
      const unit = createMockUnit({ hp: 10, maxHp: 100 });
      const inventory: InventoryData = {
        items: [healthPotion, healthPotion, healthPotion], // 3 potions
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      // Use first potion
      const result1 = useConsumableItem(healthPotion, unit, inventory);
      expect(result1.ok).toBe(true);
      if (!result1.ok) return;

      expect(result1.value.unit.hp).toBe(60); // 10 + 50
      expect(result1.value.inventory.items.length).toBe(2); // 2 left

      // Use second potion on updated unit
      const result2 = useConsumableItem(
        healthPotion,
        result1.value.unit,
        result1.value.inventory
      );
      expect(result2.ok).toBe(true);
      if (!result2.ok) return;

      expect(result2.value.unit.hp).toBe(100); // 60 + 40 (capped)
      expect(result2.value.inventory.items.length).toBe(1); // 1 left
    });

    test('healing a unit at 1 HP works correctly', () => {
      const nearDeathUnit = createMockUnit({ hp: 1, maxHp: 100 });
      const inventory: InventoryData = {
        items: [healthPotion],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(healthPotion, nearDeathUnit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(51); // 1 + 50
      }
    });

    test('healing calculates actual restore amount correctly', () => {
      const unit = createMockUnit({ hp: 95, maxHp: 100 });
      const inventory: InventoryData = {
        items: [healthPotion], // +50 HP
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      const result = useConsumableItem(healthPotion, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        // Should only heal 5 HP (to reach maxHp)
        const actualRestore = result.value.unit.hp - unit.hp;
        expect(actualRestore).toBe(5);
        expect(result.value.unit.hp).toBe(100);
      }
    });
  });

  describe('Inventory Screen Integration', () => {
    test('inventory screen can use items on team members', () => {
      const team = [
        createMockUnit({ id: 'unit-1', hp: 50, maxHp: 100 }),
        createMockUnit({ id: 'unit-2', hp: 30, maxHp: 80 }),
      ];

      const inventory: InventoryData = {
        items: [healthPotion, healthPotion],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      // Use item on first unit
      const result1 = useConsumableItem(healthPotion, team[0], inventory);
      expect(result1.ok).toBe(true);
      if (!result1.ok) return;

      expect(result1.value.unit.hp).toBe(100);
      expect(result1.value.inventory.items.length).toBe(1);

      // Use item on second unit
      const result2 = useConsumableItem(
        healthPotion,
        team[1],
        result1.value.inventory
      );
      expect(result2.ok).toBe(true);
      if (!result2.ok) return;

      expect(result2.value.unit.hp).toBe(80); // 30 + 50 = 80 (at max)
      expect(result2.value.inventory.items.length).toBe(0);
    });

    test('validation prevents wasting items on full HP units', () => {
      const team = [
        createMockUnit({ id: 'unit-1', hp: 100, maxHp: 100 }), // Full HP
        createMockUnit({ id: 'unit-2', hp: 100, maxHp: 100 }), // Full HP
      ];

      const inventory: InventoryData = {
        items: [healthPotion],
        equippedItems: new Map(),
        unequippedItems: [],
        maxItemSlots: 50,
        maxEquipmentSlots: 50
      };

      // Both units should reject healing
      const result1 = canUseItem(healthPotion, team[0]);
      const result2 = canUseItem(healthPotion, team[1]);

      expect(result1.ok).toBe(false);
      expect(result2.ok).toBe(false);

      // No items should be usable
      const usable1 = getUsableItems(inventory, team[0]);
      const usable2 = getUsableItems(inventory, team[1]);

      expect(usable1.length).toBe(0);
      expect(usable2.length).toBe(0);
    });
  });
});
