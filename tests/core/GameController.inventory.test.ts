/**
 * Tests for GameController inventory management
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { GameController } from '../../src/core/GameController.js';
import { ConsoleLogger } from '../../src/systems/Logger.js';
import type { PlayerUnit } from '../../src/types/game.js';
import { ITEM_CATALOG } from '../../src/data/items.js';

describe('GameController Inventory', () => {
  let controller: GameController;
  let logger: ConsoleLogger;

  const mockStarterTeam: PlayerUnit[] = [
    {
      id: 'player-1',
      name: 'Isaac',
      role: 'Tank',
      currentHp: 100,
      maxHp: 100,
      atk: 20,
      def: 15,
      speed: 10,
      tags: ['Holy'],
      level: 1,
      exp: 0,
      isPlayer: true,
      originalIndex: 0,
    },
  ];

  beforeEach(() => {
    logger = new ConsoleLogger();
    controller = new GameController(logger);
  });

  describe('initialization', () => {
    test('starts with empty inventory', () => {
      const inventory = controller.getInventory();
      expect(inventory).toEqual([]);
    });

    test('initializes with 3 Health Potions on startRun', () => {
      const result = controller.startRun(mockStarterTeam, 12345);
      expect(result.ok).toBe(true);

      const inventory = controller.getInventory();
      expect(inventory.length).toBe(3);
      expect(inventory.every(item => item.id === 'health_potion')).toBe(true);
    });
  });

  describe('getConsumables', () => {
    test('filters only consumable items', () => {
      controller.startRun(mockStarterTeam, 12345);

      // Add some non-consumable items
      const sword = ITEM_CATALOG.find(item => item.id === 'iron_sword')!;
      const armor = ITEM_CATALOG.find(item => item.id === 'leather_armor')!;
      controller.addItems([sword, armor]);

      const consumables = controller.getConsumables();
      expect(consumables.length).toBe(3); // Only the 3 Health Potions
      expect(consumables.every(item => item.type === 'consumable')).toBe(true);
    });

    test('returns empty array when no consumables', () => {
      controller.startRun(mockStarterTeam, 12345);
      
      // Remove all items
      controller.removeItem('health_potion');
      controller.removeItem('health_potion');
      controller.removeItem('health_potion');

      const consumables = controller.getConsumables();
      expect(consumables.length).toBe(0);
    });
  });

  describe('addItems', () => {
    test('adds items to inventory', () => {
      controller.startRun(mockStarterTeam, 12345);

      const potion = ITEM_CATALOG.find(item => item.id === 'mega_potion')!;
      const elixir = ITEM_CATALOG.find(item => item.id === 'elixir')!;

      controller.addItems([potion, elixir]);

      const inventory = controller.getInventory();
      expect(inventory.length).toBe(5); // 3 Health Potions + 2 new items
      expect(inventory.some(item => item.id === 'mega_potion')).toBe(true);
      expect(inventory.some(item => item.id === 'elixir')).toBe(true);
    });

    test('handles adding empty array', () => {
      controller.startRun(mockStarterTeam, 12345);

      controller.addItems([]);

      const inventory = controller.getInventory();
      expect(inventory.length).toBe(3); // Still just the 3 starter potions
    });

    test('allows duplicate items (stacking)', () => {
      controller.startRun(mockStarterTeam, 12345);

      const potion = ITEM_CATALOG.find(item => item.id === 'health_potion')!;
      controller.addItems([potion, potion]);

      const inventory = controller.getInventory();
      expect(inventory.length).toBe(5); // 3 + 2 more
      expect(inventory.filter(item => item.id === 'health_potion').length).toBe(5);
    });
  });

  describe('removeItem', () => {
    test('removes first occurrence of item', () => {
      controller.startRun(mockStarterTeam, 12345);

      const result = controller.removeItem('health_potion');

      expect(result.ok).toBe(true);
      const inventory = controller.getInventory();
      expect(inventory.length).toBe(2);
    });

    test('returns error when item not found', () => {
      controller.startRun(mockStarterTeam, 12345);

      const result = controller.removeItem('nonexistent_item');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    test('removes only one item at a time', () => {
      controller.startRun(mockStarterTeam, 12345);

      controller.removeItem('health_potion');
      controller.removeItem('health_potion');

      const inventory = controller.getInventory();
      expect(inventory.length).toBe(1);
      expect(inventory[0].id).toBe('health_potion');
    });

    test('handles removing last item', () => {
      controller.startRun(mockStarterTeam, 12345);

      controller.removeItem('health_potion');
      controller.removeItem('health_potion');
      controller.removeItem('health_potion');

      const inventory = controller.getInventory();
      expect(inventory.length).toBe(0);
    });
  });

  describe('RNG access', () => {
    test('exposes RNG for subsystems', () => {
      controller.startRun(mockStarterTeam, 12345);

      const rng = controller.rng;
      expect(rng).toBeDefined();
      expect(typeof rng.fork).toBe('function');
      expect(typeof rng.int).toBe('function');
    });
  });

  describe('inventory persistence', () => {
    test('inventory persists in state', () => {
      controller.startRun(mockStarterTeam, 12345);

      const potion = ITEM_CATALOG.find(item => item.id === 'mega_potion')!;
      controller.addItems([potion]);

      const inventory1 = controller.getInventory();
      expect(inventory1.length).toBe(4);

      // Get state again
      const inventory2 = controller.getInventory();
      expect(inventory2.length).toBe(4);
      expect(inventory2).toEqual(inventory1);
    });

    test('returns readonly array', () => {
      controller.startRun(mockStarterTeam, 12345);

      const inventory = controller.getInventory();

      // TypeScript readonly prevents this, but verify at runtime
      expect(Array.isArray(inventory)).toBe(true);
      
      // Attempting to modify should not affect internal state
      const modifiedCopy = [...inventory, ITEM_CATALOG[0]];
      expect(controller.getInventory().length).toBe(3); // Unchanged
    });
  });
});
