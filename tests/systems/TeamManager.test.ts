/*
 * TeamManager Tests
 * Comprehensive tests for team roster management
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { TeamManager } from '../../src/systems/TeamManager.js';
import type { PlayerUnit, EnemyUnitTemplate } from '../../src/types/game.js';

describe('TeamManager', () => {
  let teamManager: TeamManager;

  beforeEach(() => {
    teamManager = new TeamManager();
  });

  // Test fixtures
  const createEnemyTemplate = (id: string, name: string): EnemyUnitTemplate => ({
    id,
    name,
    role: 'DPS',
    tags: ['Beast'],
    baseStats: { hp: 100, atk: 20, def: 10, speed: 15 },
    portraitUrl: `/portraits/${id}.png`,
    spriteUrl: `/sprites/${id}.png`,
  });

  const createPlayerUnit = (id: string, name: string): PlayerUnit => ({
    id,
    name,
    role: 'Tank',
    tags: ['Holy'],
    hp: 150,
    maxHp: 150,
    atk: 25,
    def: 20,
    speed: 10,
    level: 5,
    experience: 100,
  });

  describe('Recruitment - Team Not Full', () => {
    test('adds unit when team has space (< 4 units)', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy = createEnemyTemplate('orc', 'Orc Warrior');

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].name).toBe('Orc Warrior');
      }
    });

    test('generates unique ID for new unit', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy = createEnemyTemplate('orc', 'Orc Warrior');

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0].id).toMatch(/^recruited_orc_\d+$/);
      }
    });

    test('converts enemy to player unit correctly', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy = createEnemyTemplate('goblin', 'Goblin Scout');

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        const unit = result.value[0];
        expect(unit.name).toBe('Goblin Scout');
        expect(unit.role).toBe('DPS');
        expect(unit.tags).toEqual(['Beast']);
        expect(unit.hp).toBe(100);
        expect(unit.maxHp).toBe(100);
        expect(unit.atk).toBe(20);
        expect(unit.def).toBe(10);
        expect(unit.speed).toBe(15);
        expect(unit.level).toBe(1);
        expect(unit.experience).toBe(0);
      }
    });

    test('preserves enemy stats (HP, attack, defense)', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy: EnemyUnitTemplate = {
        id: 'dragon',
        name: 'Dragon',
        role: 'Specialist',
        tags: ['Arcane'],
        baseStats: { hp: 200, atk: 50, def: 30, speed: 25 },
      };

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        const unit = result.value[0];
        expect(unit.hp).toBe(200);
        expect(unit.maxHp).toBe(200);
        expect(unit.atk).toBe(50);
        expect(unit.def).toBe(30);
        expect(unit.speed).toBe(25);
      }
    });

    test('team grows from 0 to 4 units', () => {
      let team: readonly PlayerUnit[] = [];

      // Add 4 units
      for (let i = 0; i < 4; i++) {
        const enemy = createEnemyTemplate(`unit${i}`, `Unit ${i}`);
        const result = teamManager.recruitUnit(team, enemy);

        expect(result.ok).toBe(true);
        if (result.ok) {
          team = result.value;
          expect(team).toHaveLength(i + 1);
        }
      }

      expect(team).toHaveLength(4);
    });

    test('preserves existing team members when adding', () => {
      const currentTeam = [createPlayerUnit('hero1', 'Hero 1')];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].id).toBe('hero1');
        expect(result.value[0].name).toBe('Hero 1');
        expect(result.value[1].name).toBe('Orc');
      }
    });

    test('preserves sprite URLs from enemy template', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy: EnemyUnitTemplate = {
        id: 'wizard',
        name: 'Wizard',
        role: 'Support',
        tags: ['Arcane'],
        baseStats: { hp: 80, atk: 30, def: 5, speed: 20 },
        portraitUrl: '/portraits/wizard.png',
        spriteUrl: '/sprites/wizard.png',
      };

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0].portraitUrl).toBe('/portraits/wizard.png');
        expect(result.value[0].spriteUrl).toBe('/sprites/wizard.png');
      }
    });
  });

  describe('Replacement - Team Full', () => {
    test('replaces unit when team is full (4 units)', () => {
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy, 'hero2');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(4);
        expect(result.value[1].name).toBe('Orc'); // Replaced at index 1
      }
    });

    test('replacement requires valid replacement ID', () => {
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      // Try to recruit without specifying replacement
      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Team full');
        expect(result.error).toContain('must specify unit to replace');
      }
    });

    test('throws error if replacement ID not found', () => {
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy, 'nonexistent');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
        expect(result.error).toContain('nonexistent');
      }
    });

    test('removed unit is no longer in team', () => {
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy, 'hero2');

      expect(result.ok).toBe(true);
      if (result.ok) {
        const hasHero2 = result.value.some((u) => u.id === 'hero2');
        expect(hasHero2).toBe(false);
      }
    });

    test('new unit takes replaced unit\'s position', () => {
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy, 'hero3');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[2].name).toBe('Orc'); // Position 2 (0-indexed)
        expect(result.value[0].name).toBe('Hero 1');
        expect(result.value[1].name).toBe('Hero 2');
        expect(result.value[3].name).toBe('Hero 4');
      }
    });

    test('can replace first unit', () => {
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy, 'hero1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0].name).toBe('Orc');
      }
    });

    test('can replace last unit', () => {
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy, 'hero4');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[3].name).toBe('Orc');
      }
    });

    test('preserves team order during replacement', () => {
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy, 'hero2');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0].id).toBe('hero1');
        expect(result.value[2].id).toBe('hero3');
        expect(result.value[3].id).toBe('hero4');
      }
    });
  });

  describe('ID Generation', () => {
    test('generates unique IDs for each unit', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy1 = createEnemyTemplate('orc', 'Orc 1');
      const enemy2 = createEnemyTemplate('orc', 'Orc 2');
      const enemy3 = createEnemyTemplate('orc', 'Orc 3');

      const result1 = teamManager.recruitUnit(currentTeam, enemy1);
      expect(result1.ok).toBe(true);
      const team1 = result1.ok ? result1.value : [];

      const result2 = teamManager.recruitUnit(team1, enemy2);
      expect(result2.ok).toBe(true);
      const team2 = result2.ok ? result2.value : [];

      const result3 = teamManager.recruitUnit(team2, enemy3);
      expect(result3.ok).toBe(true);
      const team3 = result3.ok ? result3.value : [];

      // All IDs should be unique
      const ids = team3.map((u) => u.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    test('IDs are deterministic with same TeamManager instance', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        // Should always be counter 1 for first recruit
        expect(result.value[0].id).toBe('recruited_orc_1');
      }
    });

    test('counter increments with each recruitment', () => {
      let team: readonly PlayerUnit[] = [];
      const enemy = createEnemyTemplate('orc', 'Orc');

      // Recruit 3 times
      for (let i = 1; i <= 3; i++) {
        const result = teamManager.recruitUnit(team, enemy);
        expect(result.ok).toBe(true);
        if (result.ok) {
          team = result.value;
          expect(team[team.length - 1].id).toBe(`recruited_orc_${i}`);
        }
      }
    });

    test('no ID collisions in team', () => {
      let team: readonly PlayerUnit[] = [];
      
      // Add 4 units with same enemy template
      for (let i = 0; i < 4; i++) {
        const enemy = createEnemyTemplate('orc', 'Orc');
        const result = teamManager.recruitUnit(team, enemy);
        expect(result.ok).toBe(true);
        if (result.ok) {
          team = result.value;
        }
      }

      const ids = team.map((u) => u.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(4);
    });
  });

  describe('Validation', () => {
    test('validateTeam accepts valid team (1-4 units)', () => {
      const team = [createPlayerUnit('hero1', 'Hero 1')];
      const result = teamManager.validateTeam(team);

      expect(result.ok).toBe(true);
    });

    test('validateTeam rejects empty team', () => {
      const team: PlayerUnit[] = [];
      const result = teamManager.validateTeam(team);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('cannot be empty');
      }
    });

    test('validateTeam rejects team exceeding 4 units', () => {
      const team = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
        createPlayerUnit('hero5', 'Hero 5'),
      ];
      const result = teamManager.validateTeam(team);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('cannot exceed');
        expect(result.error).toContain('4');
      }
    });

    test('validateTeam accepts team with 4 units', () => {
      const team = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const result = teamManager.validateTeam(team);

      expect(result.ok).toBe(true);
    });

    test('isTeamFull returns true for 4 units', () => {
      const team = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];

      expect(teamManager.isTeamFull(team)).toBe(true);
    });

    test('isTeamFull returns false for < 4 units', () => {
      const team = [createPlayerUnit('hero1', 'Hero 1')];

      expect(teamManager.isTeamFull(team)).toBe(false);
    });

    test('isTeamFull returns false for empty team', () => {
      const team: PlayerUnit[] = [];

      expect(teamManager.isTeamFull(team)).toBe(false);
    });

    test('getAvailableSlots returns correct count', () => {
      const team1: PlayerUnit[] = [];
      expect(teamManager.getAvailableSlots(team1)).toBe(4);

      const team2 = [createPlayerUnit('hero1', 'Hero 1')];
      expect(teamManager.getAvailableSlots(team2)).toBe(3);

      const team3 = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
      ];
      expect(teamManager.getAvailableSlots(team3)).toBe(2);

      const team4 = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      expect(teamManager.getAvailableSlots(team4)).toBe(0);
    });

    test('getAvailableSlots never returns negative', () => {
      const team = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
        createPlayerUnit('hero5', 'Hero 5'), // Overflow
      ];

      expect(teamManager.getAvailableSlots(team)).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('handles recruiting first unit (empty team)', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(1);
      }
    });

    test('handles enemy with minimal data', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy: EnemyUnitTemplate = {
        id: 'minimal',
        name: 'Minimal Enemy',
        role: 'DPS',
        tags: [],
        baseStats: { hp: 1, atk: 1, def: 1, speed: 1 },
      };

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0].hp).toBe(1);
        expect(result.value[0].maxHp).toBe(1);
        expect(result.value[0].tags).toEqual([]);
      }
    });

    test('handles enemy with no sprite URLs', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy: EnemyUnitTemplate = {
        id: 'no_sprites',
        name: 'No Sprites',
        role: 'Tank',
        tags: ['Mech'],
        baseStats: { hp: 100, atk: 10, def: 10, speed: 10 },
      };

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0].portraitUrl).toBeUndefined();
        expect(result.value[0].spriteUrl).toBeUndefined();
      }
    });

    test('handles replacing with same enemy type multiple times', () => {
      let team: readonly PlayerUnit[] = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      // Replace hero1 with Orc
      const result1 = teamManager.recruitUnit(team, enemy, 'hero1');
      expect(result1.ok).toBe(true);
      team = result1.ok ? result1.value : team;

      // Replace hero2 with another Orc
      const result2 = teamManager.recruitUnit(team, enemy, 'hero2');
      expect(result2.ok).toBe(true);
      team = result2.ok ? result2.value : team;

      // Both should be Orcs with different IDs
      const orcCount = team.filter((u) => u.name === 'Orc').length;
      expect(orcCount).toBe(2);

      const ids = team.map((u) => u.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(4); // All IDs still unique
    });

    test('handles invalid replacement ID gracefully', () => {
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1'),
        createPlayerUnit('hero2', 'Hero 2'),
        createPlayerUnit('hero3', 'Hero 3'),
        createPlayerUnit('hero4', 'Hero 4'),
      ];
      const enemy = createEnemyTemplate('orc', 'Orc');

      // Empty string triggers "team full" error (no replaceId provided)
      const result1 = teamManager.recruitUnit(currentTeam, enemy, '');
      expect(result1.ok).toBe(false);
      if (!result1.ok) {
        expect(result1.error).toContain('Team full');
      }

      // Non-existent ID triggers "not found" error
      const result2 = teamManager.recruitUnit(currentTeam, enemy, 'invalid_id');
      expect(result2.ok).toBe(false);
      if (!result2.ok) {
        expect(result2.error).toContain('not found');
      }
    });

    test('new recruits start at level 1 with 0 experience', () => {
      const currentTeam: PlayerUnit[] = [];
      const enemy = createEnemyTemplate('orc', 'Orc');

      const result = teamManager.recruitUnit(currentTeam, enemy);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value[0].level).toBe(1);
        expect(result.value[0].experience).toBe(0);
      }
    });
  });
});
