/**
 * ElementSystem Spell Granting Tests
 * 
 * Tests for getGrantedSpells() function.
 * Verifies units receive correct spells based on element matching.
 */

import { describe, it, expect } from 'vitest';
import { getGrantedSpells } from '../../src/systems/ElementSystem';
import { VENUS_GEM, MARS_GEM, JUPITER_GEM, MERCURY_GEM, MOON_GEM, SUN_GEM } from '../../src/data/gems';
import type { ActiveGemState } from '../../src/types/game';

describe('ElementSystem - Spell Granting', () => {
  describe('Matching Element Spells', () => {
    it('grants Fire Blast when Mars unit has Mars gem', () => {
      const gemState: ActiveGemState = {
        activeGem: MARS_GEM,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Mars', gemState);
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Fire Blast');
      expect(spells[0].mpCost).toBe(8);
      expect(spells[0].effect.power).toBe(30);
    });

    it('grants Stone Wall when Venus unit has Venus gem', () => {
      const gemState: ActiveGemState = {
        activeGem: VENUS_GEM,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Venus', gemState);
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Stone Wall');
      expect(spells[0].mpCost).toBe(8);
    });

    it('grants Lightning Strike when Jupiter unit has Jupiter gem', () => {
      const gemState: ActiveGemState = {
        activeGem: JUPITER_GEM,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Jupiter', gemState);
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Lightning Strike');
      expect(spells[0].effect.power).toBe(25);
    });

    it('grants Healing Wave when Mercury unit has Mercury gem', () => {
      const gemState: ActiveGemState = {
        activeGem: MERCURY_GEM,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Mercury', gemState);
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Healing Wave');
      expect(spells[0].effect.type).toBe('heal');
      expect(spells[0].effect.power).toBe(20);
    });

    it('grants Divine Shield when Moon unit has Moon gem', () => {
      const gemState: ActiveGemState = {
        activeGem: MOON_GEM,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Moon', gemState);
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Divine Shield');
      expect(spells[0].effect.buffAmount).toBe(15);
    });

    it('grants Shadow Strike when Sun unit has Sun gem', () => {
      const gemState: ActiveGemState = {
        activeGem: SUN_GEM,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Sun', gemState);
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Shadow Strike');
      expect(spells[0].effect.power).toBe(28);
    });
  });
  
  describe('Counter Element Spells (Wards)', () => {
    it('grants Fire Ward when Mercury unit has Mars gem (Water counters Fire)', () => {
      const gemState: ActiveGemState = {
        activeGem: MARS_GEM, // Fire
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Mercury', gemState); // Water counters Fire
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Fire Ward');
      expect(spells[0].mpCost).toBe(6);
    });

    it('grants Earth Ward when Jupiter unit has Venus gem (Wind counters Earth)', () => {
      const gemState: ActiveGemState = {
        activeGem: VENUS_GEM, // Earth
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Jupiter', gemState); // Wind counters Earth
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Earth Ward');
      expect(spells[0].mpCost).toBe(6);
    });

    it('grants Wind Ward when Venus unit has Jupiter gem (Earth counters Wind)', () => {
      const gemState: ActiveGemState = {
        activeGem: JUPITER_GEM, // Wind
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Venus', gemState); // Earth counters Wind
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Wind Ward');
    });

    it('grants Water Ward when Mars unit has Mercury gem (Fire counters Water)', () => {
      const gemState: ActiveGemState = {
        activeGem: MERCURY_GEM, // Water
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Mars', gemState); // Fire counters Water
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Water Ward');
    });

    it('grants Light Ward when Sun unit has Moon gem (Dark counters Light)', () => {
      const gemState: ActiveGemState = {
        activeGem: MOON_GEM, // Light
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Sun', gemState); // Dark counters Light
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Light Ward');
    });

    it('grants Dark Ward when Moon unit has Sun gem (Light counters Dark)', () => {
      const gemState: ActiveGemState = {
        activeGem: SUN_GEM, // Dark
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Moon', gemState); // Light counters Dark
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Dark Ward');
    });
  });
  
  describe('Neutral Element (No Spells)', () => {
    it('grants no spells for neutral element match', () => {
      const gemState: ActiveGemState = {
        activeGem: MARS_GEM, // Fire
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Jupiter', gemState); // Wind = neutral to Fire
      
      expect(spells).toHaveLength(0);
    });

    it('grants no spells when Venus unit has Mars gem (neutral)', () => {
      const gemState: ActiveGemState = {
        activeGem: MARS_GEM,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Venus', gemState);
      
      expect(spells).toHaveLength(0);
    });
  });
  
  describe('No Active Gem', () => {
    it('grants no spells when no gem selected', () => {
      const gemState: ActiveGemState = {
        activeGem: null,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Mars', gemState);
      
      expect(spells).toHaveLength(0);
    });

    it('grants no spells for any element when no gem', () => {
      const gemState: ActiveGemState = {
        activeGem: null,
        isActivated: false,
      };
      
      expect(getGrantedSpells('Venus', gemState)).toHaveLength(0);
      expect(getGrantedSpells('Jupiter', gemState)).toHaveLength(0);
      expect(getGrantedSpells('Mercury', gemState)).toHaveLength(0);
    });
  });
});
