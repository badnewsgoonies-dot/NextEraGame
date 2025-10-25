import { describe, it, expect, beforeEach } from 'vitest';
import { GameController } from '../../src/core/GameController.js';
import { ConsoleLogger } from '../../src/systems/Logger.js';
import type { Gem } from '../../src/types/game.js';
import { mockPlayerTeam } from '../fixtures/battleFixtures.js';

describe('GameController Gem Inventory', () => {
  let controller: GameController;
  let logger: ConsoleLogger;

  beforeEach(() => {
    logger = new ConsoleLogger('error'); // Suppress logs during tests
    controller = new GameController(logger);
    // Use just one player unit for simplicity
    controller.startRun([mockPlayerTeam[0]], 12345);
  });

  describe('initialization', () => {
    it('initializes with empty gem inventory', () => {
      const gems = controller.getGems();
      expect(gems).toEqual([]);
    });

    it('gem inventory is independent of item inventory', () => {
      const gems = controller.getGems();
      const items = controller.getInventory();
      
      expect(gems).not.toBe(items);
      expect(gems.length).toBe(0);
      expect(items.length).toBeGreaterThan(0); // Has starter items
    });
  });

  describe('addGem', () => {
    it('adds a gem to inventory', () => {
      const gem: Gem = { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 };
      
      controller.addGem(gem);
      const gems = controller.getGems();
      
      expect(gems).toHaveLength(1);
      expect(gems[0]).toEqual(gem);
    });

    it('allows duplicate gems', () => {
      const gem: Gem = { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 };
      
      controller.addGem(gem);
      controller.addGem(gem);
      const gems = controller.getGems();
      
      expect(gems).toHaveLength(2);
      expect(gems[0]).toEqual(gem);
      expect(gems[1]).toEqual(gem);
    });

    it('adds different gem types', () => {
      const fireGem: Gem = { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 };
      const waterGem: Gem = { id: 'water_2', name: 'Water Gem', element: 'Water', tier: 2, boost: 15 };
      
      controller.addGem(fireGem);
      controller.addGem(waterGem);
      const gems = controller.getGems();
      
      expect(gems).toHaveLength(2);
      expect(gems[0]).toEqual(fireGem);
      expect(gems[1]).toEqual(waterGem);
    });

    it('preserves gem properties', () => {
      const gem: Gem = { 
        id: 'earth_3', 
        name: 'Supreme Earth Gem', 
        element: 'Earth', 
        tier: 3, 
        boost: 25 
      };
      
      controller.addGem(gem);
      const gems = controller.getGems();
      
      expect(gems[0].id).toBe('earth_3');
      expect(gems[0].name).toBe('Supreme Earth Gem');
      expect(gems[0].element).toBe('Earth');
      expect(gems[0].tier).toBe(3);
      expect(gems[0].boost).toBe(25);
    });
  });

  describe('getGems', () => {
    it('returns empty array when no gems', () => {
      const gems = controller.getGems();
      expect(gems).toEqual([]);
    });

    it('returns all gems in order added', () => {
      const gem1: Gem = { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 };
      const gem2: Gem = { id: 'water_1', name: 'Water Gem', element: 'Water', tier: 1, boost: 10 };
      const gem3: Gem = { id: 'earth_1', name: 'Earth Gem', element: 'Earth', tier: 1, boost: 10 };
      
      controller.addGem(gem1);
      controller.addGem(gem2);
      controller.addGem(gem3);
      const gems = controller.getGems();
      
      expect(gems).toHaveLength(3);
      expect(gems[0]).toEqual(gem1);
      expect(gems[1]).toEqual(gem2);
      expect(gems[2]).toEqual(gem3);
    });

    it('returns readonly array', () => {
      const gem: Gem = { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 };
      controller.addGem(gem);
      
      const gems = controller.getGems();
      expect(Array.isArray(gems)).toBe(true);
      
      // The gems array should be a copy, not the internal state
      // Modifying the returned array shouldn't affect the controller's state
      const gemsCopy = gems as any;
      gemsCopy.push(gem);
      
      // Controller's gems should still be the same
      const gemsAfterModification = controller.getGems();
      expect(gemsAfterModification).toHaveLength(1); // Still only 1 gem
    });
  });

  describe('gem persistence', () => {
    it('gems persist across game state changes', () => {
      const gem: Gem = { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 };
      
      controller.addGem(gem);
      
      // Simulate state change
      const state = controller.getState();
      expect(state.gems).toHaveLength(1);
      expect(state.gems[0]).toEqual(gem);
    });

    it('gems are separate from items in state', () => {
      const gem: Gem = { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 };
      controller.addGem(gem);
      
      const state = controller.getState();
      expect(state.gems).toBeDefined();
      expect(state.inventory).toBeDefined();
      expect(state.gems).not.toBe(state.inventory);
    });
  });

  describe('integration with rewards', () => {
    it('gems can be added during game progression', () => {
      // Simulate winning a battle and getting a gem reward
      const gem: Gem = { id: 'wind_2', name: 'Wind Gem', element: 'Wind', tier: 2, boost: 15 };
      
      const initialGems = controller.getGems();
      expect(initialGems).toHaveLength(0);
      
      controller.addGem(gem);
      
      const updatedGems = controller.getGems();
      expect(updatedGems).toHaveLength(1);
      expect(updatedGems[0]).toEqual(gem);
    });
  });

  describe('multiple gem types', () => {
    it('handles all element types correctly', () => {
      const fire: Gem = { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 };
      const water: Gem = { id: 'water_1', name: 'Water Gem', element: 'Water', tier: 1, boost: 10 };
      const earth: Gem = { id: 'earth_1', name: 'Earth Gem', element: 'Earth', tier: 1, boost: 10 };
      const wind: Gem = { id: 'wind_1', name: 'Wind Gem', element: 'Wind', tier: 1, boost: 10 };
      
      controller.addGem(fire);
      controller.addGem(water);
      controller.addGem(earth);
      controller.addGem(wind);
      
      const gems = controller.getGems();
      expect(gems).toHaveLength(4);
      expect(gems.map(g => g.element)).toEqual(['Fire', 'Water', 'Earth', 'Wind']);
    });

    it('handles different tier levels', () => {
      const tier1: Gem = { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 };
      const tier2: Gem = { id: 'fire_2', name: 'Greater Fire Gem', element: 'Fire', tier: 2, boost: 15 };
      const tier3: Gem = { id: 'fire_3', name: 'Supreme Fire Gem', element: 'Fire', tier: 3, boost: 25 };
      
      controller.addGem(tier1);
      controller.addGem(tier2);
      controller.addGem(tier3);
      
      const gems = controller.getGems();
      expect(gems).toHaveLength(3);
      expect(gems.map(g => g.tier)).toEqual([1, 2, 3]);
      expect(gems.map(g => g.boost)).toEqual([10, 15, 25]);
    });
  });
});
