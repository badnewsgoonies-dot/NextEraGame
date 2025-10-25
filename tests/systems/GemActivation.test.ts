/**
 * Gem Activation System Tests
 * 
 * Tests for executeGemActivation() function.
 * Verifies activation effects work correctly.
 */

import { describe, it, expect } from 'vitest';
import { executeGemActivation } from '../../src/systems/GemActivationSystem';
import { GEM_ACTIVATIONS } from '../../src/data/gemActivations';
import type { PlayerUnit } from '../../src/types/game';

// Helper: Create test unit
const createUnit = (id: string, hp: number, maxHp: number = 100): PlayerUnit => ({
  id,
  templateId: `template_${id}`,
  name: `Unit ${id}`,
  role: 'DPS',
  tags: [],
  element: 'Mars',
  hp,
  maxHp,
  atk: 50,
  def: 20,
  speed: 30,
  level: 1,
  experience: 0,
  rank: 'C',
  baseClass: 'Warrior',
  currentMp: 50,
  luck: 5,
});

describe('Gem Activation System', () => {
  describe('AoE Damage Activations', () => {
    it('damages all enemies when activating Mars (Volcanic Eruption)', () => {
      const playerUnits = [createUnit('p1', 100)];
      const enemies = [
        createUnit('e1', 100),
        createUnit('e2', 80),
      ];
      
      const activation = GEM_ACTIVATIONS.Mars; // 50 damage
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.updatedEnemies[0].hp).toBe(50); // 100 - 50
      expect(result.updatedEnemies[1].hp).toBe(30); // 80 - 50
      expect(result.message).toContain('50 damage');
    });

    it('damages all enemies when activating Venus (Earthquake)', () => {
      const playerUnits = [createUnit('p1', 100)];
      const enemies = [
        createUnit('e1', 100),
        createUnit('e2', 100),
        createUnit('e3', 50),
      ];
      
      const activation = GEM_ACTIVATIONS.Venus; // 40 damage
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.updatedEnemies[0].hp).toBe(60); // 100 - 40
      expect(result.updatedEnemies[1].hp).toBe(60); // 100 - 40
      expect(result.updatedEnemies[2].hp).toBe(10); // 50 - 40
    });

    it('damages all enemies when activating Jupiter (Thunderstorm)', () => {
      const playerUnits = [createUnit('p1', 100)];
      const enemies = [createUnit('e1', 100)];
      
      const activation = GEM_ACTIVATIONS.Jupiter; // 45 damage
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.updatedEnemies[0].hp).toBe(55); // 100 - 45
    });

    it('damages all enemies when activating Mercury (Tidal Wave)', () => {
      const playerUnits = [createUnit('p1', 100)];
      const enemies = [createUnit('e1', 100), createUnit('e2', 40)];
      
      const activation = GEM_ACTIVATIONS.Mercury; // 35 damage
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.updatedEnemies[0].hp).toBe(65); // 100 - 35
      expect(result.updatedEnemies[1].hp).toBe(5); // 40 - 35
    });

    it('damages all enemies when activating Sun (Solar Flare)', () => {
      const playerUnits = [createUnit('p1', 100)];
      const enemies = [createUnit('e1', 100)];
      
      const activation = GEM_ACTIVATIONS.Sun; // 55 damage
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.updatedEnemies[0].hp).toBe(45); // 100 - 55
    });

    it('prevents HP from going below 0', () => {
      const playerUnits = [createUnit('p1', 100)];
      const enemies = [createUnit('e1', 30)]; // Low HP enemy
      
      const activation = GEM_ACTIVATIONS.Mars; // 50 damage (more than enemy HP)
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.updatedEnemies[0].hp).toBe(0); // Capped at 0, not negative
    });
  });
  
  describe('Party Heal Activations', () => {
    it('heals all allies when activating Moon (Lunar Blessing)', () => {
      const playerUnits = [
        createUnit('p1', 50, 100),
        createUnit('p2', 30, 80),
      ];
      const enemies = [createUnit('e1', 100)];
      
      const activation = GEM_ACTIVATIONS.Moon; // 30 heal
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.updatedPlayerUnits[0].hp).toBe(80); // 50 + 30
      expect(result.updatedPlayerUnits[1].hp).toBe(60); // 30 + 30
      expect(result.message).toContain('30 HP');
    });

    it('prevents HP from exceeding max HP', () => {
      const playerUnits = [
        createUnit('p1', 90, 100), // Near max HP
      ];
      const enemies = [createUnit('e1', 100)];
      
      const activation = GEM_ACTIVATIONS.Moon; // 30 heal
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.updatedPlayerUnits[0].hp).toBe(100); // Capped at maxHp, not 120
    });

    it('does not affect enemies when healing party', () => {
      const playerUnits = [createUnit('p1', 50, 100)];
      const enemies = [createUnit('e1', 50, 100)];
      
      const activation = GEM_ACTIVATIONS.Moon;
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.updatedEnemies[0].hp).toBe(50); // Unchanged
    });
  });
  
  describe('Message Generation', () => {
    it('includes activation name in message', () => {
      const playerUnits = [createUnit('p1', 100)];
      const enemies = [createUnit('e1', 100)];
      
      const activation = GEM_ACTIVATIONS.Mars;
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.message).toContain('Volcanic Eruption');
    });

    it('includes power value in message', () => {
      const playerUnits = [createUnit('p1', 100)];
      const enemies = [createUnit('e1', 100)];
      
      const activation = GEM_ACTIVATIONS.Venus;
      const result = executeGemActivation(activation, playerUnits, enemies);
      
      expect(result.message).toContain('40');
    });
  });
});
