/**
 * Gem System Integration Tests
 * 
 * End-to-end tests for Active Elemental Alignment system.
 * Covers: Full flow from selection through battle to reset.
 */

import { describe, it, expect } from 'vitest';
import { GameController } from '../../src/core/GameController';
import type { PlayerUnit, ActiveGemState } from '../../src/types/game';
import { VENUS_GEM, MARS_GEM, JUPITER_GEM } from '../../src/data/gems';
import { applyElementBonus } from '../../src/systems/ElementSystem';

// Helper: Create test player unit
const createTestUnit = (element: 'Venus' | 'Mars' | 'Jupiter' | 'Mercury' | 'Moon' | 'Sun', id: string): PlayerUnit => ({
  id,
  templateId: `template_${element}`,
  name: `Unit ${element}`,
  role: 'DPS',
  tags: [],
  element,
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
  luck: 5,
});

describe('Gem System Integration', () => {
  describe('Gem State Lifecycle', () => {
    it('should track gem selection and activation state', () => {
      // Create units for testing
      const venusUnit = createTestUnit('Venus', 'unit_1');
      const marsUnit = createTestUnit('Mars', 'unit_2');
      
      // Simulate gem selection
      const gemState: ActiveGemState = {
        activeGem: VENUS_GEM,
        isActivated: false,
      };
      
      // Bonuses should apply before activation
      // Venus unit with Venus gem: +15% bonus
      const boostedDamage = applyElementBonus(100, venusUnit, gemState);
      expect(boostedDamage).toBe(115); // +15% base damage
      
      // Mars unit with Venus gem: +5% neutral (Fire is neutral to Earth)
      const neutralDamage = applyElementBonus(100, marsUnit, gemState);
      expect(neutralDamage).toBe(105); // +5% neutral
    });

    it('should remove bonuses after gem activation', () => {
      const marsUnit = createTestUnit('Mars', 'unit_1');
      
      // Before activation: bonuses apply
      const beforeState: ActiveGemState = {
        activeGem: MARS_GEM,
        isActivated: false,
      };
      
      const damageBeforeActivation = applyElementBonus(100, marsUnit, beforeState);
      expect(damageBeforeActivation).toBe(115); // +15% matching
      
      // After activation: bonuses removed
      const afterState: ActiveGemState = {
        activeGem: MARS_GEM,
        isActivated: true,
      };
      
      const damageAfterActivation = applyElementBonus(100, marsUnit, afterState);
      expect(damageAfterActivation).toBe(100); // No bonus when activated
    });

    it('should handle gem reset between battles', () => {
      const jupiterUnit = createTestUnit('Jupiter', 'unit_1');
      
      // Activated state (end of battle)
      const activatedState: ActiveGemState = {
        activeGem: JUPITER_GEM,
        isActivated: true,
      };
      
      const duringBattle = applyElementBonus(100, jupiterUnit, activatedState);
      expect(duringBattle).toBe(100); // No bonus when activated
      
      // Reset state (next battle)
      const resetState: ActiveGemState = {
        activeGem: JUPITER_GEM,
        isActivated: false,
      };
      
      const nextBattle = applyElementBonus(100, jupiterUnit, resetState);
      expect(nextBattle).toBe(115); // Bonuses restored
    });
  });
  describe('Team Composition Scenarios', () => {
    it('should apply correct bonuses to mixed-element team', () => {
      const gemState: ActiveGemState = {
        activeGem: VENUS_GEM,
        isActivated: false,
      };
      
      // Venus unit: +15% matching
      const venusUnit = createTestUnit('Venus', 'v1');
      const venusDamage = applyElementBonus(100, venusUnit, gemState);
      expect(venusDamage).toBe(115);
      
      // Jupiter unit: -5% counter (Earth vs Wind)
      const jupiterUnit = createTestUnit('Jupiter', 'j1');
      const jupiterDamage = applyElementBonus(100, jupiterUnit, gemState);
      expect(jupiterDamage).toBe(95);
      
      // Mercury unit: +5% neutral
      const mercuryUnit = createTestUnit('Mercury', 'm1');
      const mercuryDamage = applyElementBonus(100, mercuryUnit, gemState);
      expect(mercuryDamage).toBe(105);
    });

    it('should handle all-matching team optimally', () => {
      const gemState: ActiveGemState = {
        activeGem: VENUS_GEM,
        isActivated: false,
      };
      
      // All Venus units get +15% bonus
      const unit1 = createTestUnit('Venus', 'v1');
      const unit2 = createTestUnit('Venus', 'v2');
      const unit3 = createTestUnit('Venus', 'v3');
      
      expect(applyElementBonus(100, unit1, gemState)).toBe(115);
      expect(applyElementBonus(100, unit2, gemState)).toBe(115);
      expect(applyElementBonus(100, unit3, gemState)).toBe(115);
    });

    it('should handle counter-element team gracefully', () => {
      const gemState: ActiveGemState = {
        activeGem: VENUS_GEM,
        isActivated: false,
      };
      
      // All Jupiter units get -5% penalty (Earth vs Wind counter)
      const unit1 = createTestUnit('Jupiter', 'j1');
      const unit2 = createTestUnit('Jupiter', 'j2');
      
      expect(applyElementBonus(100, unit1, gemState)).toBe(95);
      expect(applyElementBonus(100, unit2, gemState)).toBe(95);
    });
  });
});
