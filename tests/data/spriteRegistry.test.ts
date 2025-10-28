import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getPartySpriteSet,
  getEnemySprite,
  getUnitWeapon,
  ENEMY_SPRITE_MAP,
  UNIT_TO_GS_CHARACTER,
} from '../../src/data/spriteRegistry.js';

describe('SpriteRegistry', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('getPartySpriteSet', () => {
    test('returns sprite set for mapped party units', () => {
      const spriteSet = getPartySpriteSet('Warrior');

      expect(spriteSet).not.toBeNull();
      if (spriteSet) {
        expect(spriteSet.idle).toContain('isaac');
        expect(spriteSet.attack1).toContain('isaac');
        expect(spriteSet.attack2).toContain('isaac');
        expect(spriteSet.hit).toContain('isaac');
        expect(spriteSet.downed).toContain('isaac');
      }
    });

    test('returns sprite set with correct weapon', () => {
      const spriteSet = getPartySpriteSet('Warrior', 'Axe');

      expect(spriteSet).not.toBeNull();
      if (spriteSet) {
        expect(spriteSet.idle).toContain('Axe');
        expect(spriteSet.attack1).toContain('Axe');
      }
    });

    test('uses default weapon when not specified', () => {
      const spriteSet = getPartySpriteSet('Guardian');

      expect(spriteSet).not.toBeNull();
      if (spriteSet) {
        // Guardian defaults to Axe
        expect(spriteSet.idle).toContain('Axe');
      }
    });

    test('returns null for known enemy units WITHOUT warning', () => {
      const spriteSet = getPartySpriteSet('Bear Guardian');

      expect(spriteSet).toBeNull();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('returns null for all known enemies WITHOUT warnings', () => {
      const enemies = Object.keys(ENEMY_SPRITE_MAP);
      const partyUnits = Object.keys(UNIT_TO_GS_CHARACTER);

      // Test only enemies that are NOT also party unit names
      const enemyOnlyNames = enemies.filter(e => !partyUnits.includes(e));

      for (const enemyName of enemyOnlyNames) {
        const spriteSet = getPartySpriteSet(enemyName);
        expect(spriteSet).toBeNull();
      }

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('warns for truly unmapped units', () => {
      const spriteSet = getPartySpriteSet('Nonexistent Unit Name');

      expect(spriteSet).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('No mapping for unit: Nonexistent Unit Name')
      );
    });

    test('returns sprite sets for all 12 starter units', () => {
      const starterUnits = Object.keys(UNIT_TO_GS_CHARACTER);

      for (const unitName of starterUnits) {
        const spriteSet = getPartySpriteSet(unitName);
        expect(spriteSet).not.toBeNull();
        if (spriteSet) {
          expect(spriteSet.idle).toBeTruthy();
          expect(spriteSet.attack1).toBeTruthy();
          expect(spriteSet.attack2).toBeTruthy();
          expect(spriteSet.hit).toBeTruthy();
          expect(spriteSet.downed).toBeTruthy();
        }
      }
    });
  });

  describe('getEnemySprite', () => {
    test('returns sprite path for mapped enemies', () => {
      const sprite = getEnemySprite('Bear Guardian', 'Tank');

      expect(sprite).toContain('/sprites/golden-sun/battle/enemies/');
      expect(sprite).toContain('Wolfkin.gif');
    });

    test('returns sprite path for skeleton warrior', () => {
      const sprite = getEnemySprite('Skeleton Warrior', 'Tank');

      expect(sprite).toContain('/sprites/golden-sun/battle/enemies/');
      expect(sprite).toContain('Undead.gif');
    });

    test('returns role-based fallback for unmapped enemies', () => {
      const sprite = getEnemySprite('Unknown Enemy', 'Tank');

      expect(sprite).toContain('/sprites/golden-sun/battle/enemies/');
      expect(sprite).toContain('Brigand.gif');
    });

    test('returns correct fallback for each role', () => {
      const tankSprite = getEnemySprite('Unknown Tank', 'Tank');
      const dpsSprite = getEnemySprite('Unknown DPS', 'DPS');
      const supportSprite = getEnemySprite('Unknown Support', 'Support');
      const specialistSprite = getEnemySprite('Unknown Specialist', 'Specialist');

      expect(tankSprite).toContain('Brigand.gif');
      expect(dpsSprite).toContain('Goblin.gif');
      expect(supportSprite).toContain('Gnome_Wizard.gif');
      expect(specialistSprite).toContain('Mimic.gif');
    });
  });

  describe('getUnitWeapon', () => {
    test('returns default weapon for mapped units', () => {
      expect(getUnitWeapon('Warrior')).toBe('lSword');
      expect(getUnitWeapon('Guardian')).toBe('Axe');
      expect(getUnitWeapon('Cleric')).toBe('Mace');
    });

    test('returns lSword for unmapped units', () => {
      expect(getUnitWeapon('Unknown Unit')).toBe('lSword');
    });
  });

  describe('Edge Cases', () => {
    test('handles underscore variant enemy names', () => {
      // cleric_healer is a special case with underscore
      const sprite = getEnemySprite('cleric_healer', 'Support');

      expect(sprite).toContain('Faery.gif');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('all enemy mappings use consistent naming', () => {
      const enemyNames = Object.keys(ENEMY_SPRITE_MAP);

      for (const enemyName of enemyNames) {
        const sprite = getEnemySprite(enemyName, 'Tank');
        expect(sprite).toContain('/sprites/golden-sun/battle/enemies/');
        expect(sprite).toContain('.gif');
      }
    });
  });

  describe('Regression Tests', () => {
    test('no warnings logged for Bear Guardian', () => {
      getPartySpriteSet('Bear Guardian');

      expect(consoleWarnSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Bear Guardian')
      );
    });

    test('no warnings logged for any enemy in battle', () => {
      const commonEnemies = [
        'Skeleton Warrior',
        'Zombie Brute',
        'Dire Wolf',
        'Bear Guardian',
        'Battle Mech Alpha',
      ];

      for (const enemyName of commonEnemies) {
        getPartySpriteSet(enemyName);
      }

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
