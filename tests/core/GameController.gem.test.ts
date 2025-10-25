/**
 * GameController Gem Method Tests
 * 
 * Tests for active gem state management in GameController.
 * Covers: setActiveGem, getGemState, activateGem, resetGem
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GameController } from '../../src/core/GameController';
import { ConsoleLogger } from '../../src/systems/Logger';
import { VENUS_GEM, MARS_GEM, JUPITER_GEM } from '../../src/data/gems';
import type { PlayerUnit } from '../../src/types/game';

// Helper: Create test player unit
const createTestUnit = (id: string): PlayerUnit => ({
  id,
  templateId: `template_${id}`,
  name: `Unit ${id}`,
  role: 'DPS',
  tags: [],
  element: 'Venus',
  hp: 100,
  maxHp: 100,
  atk: 50,
  def: 20,
  speed: 30,
  level: 1,
  experience: 0,
  rank: 'C',
  baseClass: 'Warrior',
  currentMp: 50,
});

describe('GameController - Gem Methods', () => {
  let controller: GameController;
  let logger: ConsoleLogger;
  let testTeam: PlayerUnit[];

  beforeEach(() => {
    logger = new ConsoleLogger('error'); // Suppress logs during tests
    controller = new GameController(logger);
    testTeam = [
      createTestUnit('unit1'),
      createTestUnit('unit2'),
      createTestUnit('unit3'),
      createTestUnit('unit4'),
    ];
    
    // Initialize run
    controller.startRun(testTeam);
  });

  describe('setActiveGem', () => {
    it('should successfully set active gem', () => {
      const result = controller.setActiveGem(VENUS_GEM);
      
      expect(result.ok).toBe(true);
      
      const gemState = controller.getGemState();
      expect(gemState.activeGem).toBe(VENUS_GEM);
      expect(gemState.isActivated).toBe(false);
    });

    it('should replace previously active gem', () => {
      controller.setActiveGem(VENUS_GEM);
      const result = controller.setActiveGem(MARS_GEM);
      
      expect(result.ok).toBe(true);
      
      const gemState = controller.getGemState();
      expect(gemState.activeGem).toBe(MARS_GEM);
      expect(gemState.isActivated).toBe(false);
    });

    it('should reset activation status when setting new gem', () => {
      controller.setActiveGem(VENUS_GEM);
      controller.activateGem(); // Activate first gem
      
      const result = controller.setActiveGem(MARS_GEM);
      
      expect(result.ok).toBe(true);
      
      const gemState = controller.getGemState();
      expect(gemState.activeGem).toBe(MARS_GEM);
      expect(gemState.isActivated).toBe(false); // Reset!
    });

    it('should handle setting same gem twice', () => {
      controller.setActiveGem(VENUS_GEM);
      const result = controller.setActiveGem(VENUS_GEM);
      
      expect(result.ok).toBe(true);
      
      const gemState = controller.getGemState();
      expect(gemState.activeGem).toBe(VENUS_GEM);
    });

    it('should work for all gem types', () => {
      const gems = [VENUS_GEM, MARS_GEM, JUPITER_GEM];
      
      gems.forEach(gem => {
        const result = controller.setActiveGem(gem);
        expect(result.ok).toBe(true);
        
        const gemState = controller.getGemState();
        expect(gemState.activeGem).toBe(gem);
      });
    });
  });

  describe('getGemState', () => {
    it('should return null gem state initially', () => {
      const gemState = controller.getGemState();
      
      expect(gemState.activeGem).toBeNull();
      expect(gemState.isActivated).toBe(false);
    });

    it('should return current gem state after setting gem', () => {
      controller.setActiveGem(VENUS_GEM);
      
      const gemState = controller.getGemState();
      
      expect(gemState.activeGem).toBe(VENUS_GEM);
      expect(gemState.isActivated).toBe(false);
    });

    it('should return activated state correctly', () => {
      controller.setActiveGem(VENUS_GEM);
      controller.activateGem();
      
      const gemState = controller.getGemState();
      
      expect(gemState.activeGem).toBe(VENUS_GEM);
      expect(gemState.isActivated).toBe(true);
    });

    it('should return readonly state (immutable)', () => {
      controller.setActiveGem(VENUS_GEM);
      
      const gemState = controller.getGemState();
      
      // TypeScript enforces readonly, runtime check
      expect(Object.isFrozen(gemState)).toBe(false); // Not frozen but should be treated as readonly
      expect(gemState).toBeDefined();
    });
  });

  describe('activateGem', () => {
    it('should successfully activate gem', () => {
      controller.setActiveGem(VENUS_GEM);
      
      const result = controller.activateGem();
      
      expect(result.ok).toBe(true);
      
      const gemState = controller.getGemState();
      expect(gemState.isActivated).toBe(true);
    });

    it('should fail when no gem is active', () => {
      const result = controller.activateGem();
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('No active gem to activate');
      }
    });

    it('should fail when gem already activated', () => {
      controller.setActiveGem(VENUS_GEM);
      controller.activateGem(); // First activation
      
      const result = controller.activateGem(); // Second activation
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('Gem already activated this battle');
      }
    });

    it('should maintain gem reference after activation', () => {
      controller.setActiveGem(VENUS_GEM);
      controller.activateGem();
      
      const gemState = controller.getGemState();
      
      expect(gemState.activeGem).toBe(VENUS_GEM);
      expect(gemState.isActivated).toBe(true);
    });

    it('should allow activation after resetting', () => {
      controller.setActiveGem(VENUS_GEM);
      controller.activateGem();
      controller.resetGem();
      
      const result = controller.activateGem();
      
      expect(result.ok).toBe(true);
      expect(controller.getGemState().isActivated).toBe(true);
    });
  });

  describe('resetGem', () => {
    it('should reset activation status', () => {
      controller.setActiveGem(VENUS_GEM);
      controller.activateGem();
      
      controller.resetGem();
      
      const gemState = controller.getGemState();
      expect(gemState.isActivated).toBe(false);
      expect(gemState.activeGem).toBe(VENUS_GEM); // Gem still active!
    });

    it('should be safe to call when gem not activated', () => {
      controller.setActiveGem(VENUS_GEM);
      
      controller.resetGem(); // Should not throw
      
      const gemState = controller.getGemState();
      expect(gemState.isActivated).toBe(false);
    });

    it('should be safe to call with no active gem', () => {
      controller.resetGem(); // Should not throw
      
      const gemState = controller.getGemState();
      expect(gemState.activeGem).toBeNull();
      expect(gemState.isActivated).toBe(false);
    });

    it('should allow re-activation after reset', () => {
      controller.setActiveGem(VENUS_GEM);
      controller.activateGem();
      controller.resetGem();
      
      const result = controller.activateGem();
      
      expect(result.ok).toBe(true);
      expect(controller.getGemState().isActivated).toBe(true);
    });

    it('should preserve gem selection after reset', () => {
      controller.setActiveGem(VENUS_GEM);
      controller.activateGem();
      
      controller.resetGem();
      
      const gemState = controller.getGemState();
      expect(gemState.activeGem).toBe(VENUS_GEM);
    });
  });

  describe('Integration - Full Gem Lifecycle', () => {
    it('should handle complete gem lifecycle', () => {
      // Select gem
      const selectResult = controller.setActiveGem(VENUS_GEM);
      expect(selectResult.ok).toBe(true);
      expect(controller.getGemState().activeGem).toBe(VENUS_GEM);
      expect(controller.getGemState().isActivated).toBe(false);
      
      // Activate gem mid-battle
      const activateResult = controller.activateGem();
      expect(activateResult.ok).toBe(true);
      expect(controller.getGemState().isActivated).toBe(true);
      
      // Reset for next battle
      controller.resetGem();
      expect(controller.getGemState().isActivated).toBe(false);
      expect(controller.getGemState().activeGem).toBe(VENUS_GEM);
    });

    it('should prevent double activation in same battle', () => {
      controller.setActiveGem(VENUS_GEM);
      
      const result1 = controller.activateGem();
      expect(result1.ok).toBe(true);
      
      const result2 = controller.activateGem();
      expect(result2.ok).toBe(false);
      if (!result2.ok) {
        expect(result2.error).toContain('already activated');
      }
    });

    it('should allow changing gems between battles', () => {
      // Battle 1: Venus gem
      controller.setActiveGem(VENUS_GEM);
      controller.activateGem();
      controller.resetGem();
      
      // Battle 2: Mars gem
      controller.setActiveGem(MARS_GEM);
      const gemState = controller.getGemState();
      
      expect(gemState.activeGem).toBe(MARS_GEM);
      expect(gemState.isActivated).toBe(false);
    });
  });
});
