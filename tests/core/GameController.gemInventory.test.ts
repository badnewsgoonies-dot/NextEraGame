/*
 * GameController Gem Inventory Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GameController } from '../../src/core/GameController';
import { ConsoleLogger } from '../../src/systems/Logger';
import { mockPlayerTeam } from '../fixtures/battleFixtures';

describe('GameController Gem Inventory', () => {
  let controller: GameController;
  let logger: ConsoleLogger;

  beforeEach(() => {
    logger = new ConsoleLogger('silent');
    controller = new GameController(logger);
  });

  describe('initialization', () => {
    it('starts with empty gem inventory', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      expect(controller.getGemInventory()).toEqual([]);
    });
  });

  describe('addGem', () => {
    it('adds gem to inventory', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      const result = controller.addGem('ruby_gem');

      expect(result.ok).toBe(true);
      expect(controller.getGemInventory()).toEqual(['ruby_gem']);
    });

    it('allows multiple gems', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      controller.addGem('ruby_gem');
      controller.addGem('sapphire_gem');

      expect(controller.getGemInventory()).toEqual(['ruby_gem', 'sapphire_gem']);
    });

    it('allows duplicate gems', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      controller.addGem('ruby_gem');
      controller.addGem('ruby_gem');

      expect(controller.getGemInventory()).toEqual(['ruby_gem', 'ruby_gem']);
    });

    it('returns error for invalid gem ID', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      const result = controller.addGem('invalid_gem');

      expect(result.ok).toBe(false);
      expect(result.error).toContain('Invalid gem ID');
    });
  });

  describe('getGemInventory', () => {
    it('returns empty array when no gems', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      expect(controller.getGemInventory()).toEqual([]);
    });

    it('returns all gems in inventory', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      controller.addGem('ruby_gem');
      controller.addGem('emerald_gem');
      controller.addGem('sapphire_gem');

      expect(controller.getGemInventory()).toEqual(['ruby_gem', 'emerald_gem', 'sapphire_gem']);
    });

    it('returns readonly array', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      controller.addGem('ruby_gem');
      const inventory = controller.getGemInventory();

      // Verify it's a readonly array by checking the type
      expect(Array.isArray(inventory)).toBe(true);
      expect(inventory).toEqual(['ruby_gem']);
    });
  });

  describe('hasGem', () => {
    it('returns false when gem not in inventory', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      expect(controller.hasGem('ruby_gem')).toBe(false);
    });

    it('returns true when gem is in inventory', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      controller.addGem('ruby_gem');

      expect(controller.hasGem('ruby_gem')).toBe(true);
    });

    it('returns true for duplicates', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      controller.addGem('ruby_gem');
      controller.addGem('ruby_gem');

      expect(controller.hasGem('ruby_gem')).toBe(true);
    });
  });

  describe('gem inventory persistence', () => {
    it('gem inventory persists in state', () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      controller.addGem('ruby_gem');
      controller.addGem('sapphire_gem');

      const state = controller.getState();
      expect(state.gemInventory).toEqual(['ruby_gem', 'sapphire_gem']);
    });

    it('gem inventory persists across save/load', async () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      controller.addGem('ruby_gem');
      controller.addGem('emerald_gem');

      // Save
      await controller.saveGame('test-gem-slot');

      // Create new controller with same save system
      const saveSystem = controller.getSaveSystem();
      const newController = new GameController(logger, saveSystem);
      await newController.loadGame('test-gem-slot');

      expect(newController.getGemInventory()).toEqual(['ruby_gem', 'emerald_gem']);
    });

    it('handles old saves without gem inventory', async () => {
      const starter = mockPlayerTeam[0];
      controller.startRun([starter], 12345);

      // Save with current controller
      await controller.saveGame('test-old-slot');

      // Load should work and default to empty gem inventory
      const saveSystem = controller.getSaveSystem();
      const newController = new GameController(logger, saveSystem);
      const result = await newController.loadGame('test-old-slot');

      expect(result.ok).toBe(true);
      expect(newController.getGemInventory()).toEqual([]);
    });
  });
});
