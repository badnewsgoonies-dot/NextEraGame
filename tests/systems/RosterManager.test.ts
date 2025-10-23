/*
 * RosterManager Tests
 * Comprehensive tests for roster management (active party + bench)
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { RosterManager } from '../../src/systems/RosterManager.js';
import type { PlayerUnit, RosterData } from '../../src/types/game.js';

describe('RosterManager', () => {
  let rosterManager: RosterManager;

  beforeEach(() => {
    rosterManager = new RosterManager();
  });

  // Test fixture
  const createUnit = (id: string, name: string): PlayerUnit => ({
    id,
    name,
    role: 'Tank',
    tags: ['Holy'],
    hp: 100,
    maxHp: 100,
    atk: 20,
    def: 15,
    speed: 10,
    level: 1,
    experience: 0,
  });

  describe('createRosterFromTeam', () => {
    test('splits 4 units into all active, 0 bench', () => {
      const team = [
        createUnit('unit1', 'Unit 1'),
        createUnit('unit2', 'Unit 2'),
        createUnit('unit3', 'Unit 3'),
        createUnit('unit4', 'Unit 4'),
      ];

      const roster = rosterManager.createRosterFromTeam(team);

      expect(roster.activeParty).toHaveLength(4);
      expect(roster.bench).toHaveLength(0);
      expect(roster.activeParty[0].id).toBe('unit1');
      expect(roster.activeParty[3].id).toBe('unit4');
    });

    test('splits 6 units into 4 active, 2 bench', () => {
      const team = [
        createUnit('unit1', 'Unit 1'),
        createUnit('unit2', 'Unit 2'),
        createUnit('unit3', 'Unit 3'),
        createUnit('unit4', 'Unit 4'),
        createUnit('unit5', 'Unit 5'),
        createUnit('unit6', 'Unit 6'),
      ];

      const roster = rosterManager.createRosterFromTeam(team);

      expect(roster.activeParty).toHaveLength(4);
      expect(roster.bench).toHaveLength(2);
      expect(roster.activeParty[0].id).toBe('unit1');
      expect(roster.bench[0].id).toBe('unit5');
      expect(roster.bench[1].id).toBe('unit6');
    });

    test('handles empty array', () => {
      const team: PlayerUnit[] = [];

      const roster = rosterManager.createRosterFromTeam(team);

      expect(roster.activeParty).toHaveLength(0);
      expect(roster.bench).toHaveLength(0);
    });

    test('splits 10 units into 4 active, 6 bench', () => {
      const team = Array.from({ length: 10 }, (_, i) =>
        createUnit(`unit${i}`, `Unit ${i}`)
      );

      const roster = rosterManager.createRosterFromTeam(team);

      expect(roster.activeParty).toHaveLength(4);
      expect(roster.bench).toHaveLength(6);
      expect(roster.activeParty[0].id).toBe('unit0');
      expect(roster.activeParty[3].id).toBe('unit3');
      expect(roster.bench[0].id).toBe('unit4');
      expect(roster.bench[5].id).toBe('unit9');
    });
  });

  describe('swapUnits', () => {
    test('swaps units correctly between active and bench', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
          createUnit('active3', 'Active 3'),
          createUnit('active4', 'Active 4'),
        ],
        bench: [
          createUnit('bench1', 'Bench 1'),
          createUnit('bench2', 'Bench 2'),
        ],
      };

      const result = rosterManager.swapUnits(roster, {
        benchUnitId: 'bench1',
        activeUnitId: 'active2',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.activeParty[1].id).toBe('bench1');
        expect(result.value.bench[0].id).toBe('active2');
        expect(result.value.activeParty).toHaveLength(4);
        expect(result.value.bench).toHaveLength(2);
      }
    });

    test('returns error if bench unit not found', () => {
      const roster: RosterData = {
        activeParty: [createUnit('active1', 'Active 1')],
        bench: [createUnit('bench1', 'Bench 1')],
      };

      const result = rosterManager.swapUnits(roster, {
        benchUnitId: 'nonexistent',
        activeUnitId: 'active1',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Bench unit');
        expect(result.error).toContain('nonexistent');
        expect(result.error).toContain('not found');
      }
    });

    test('returns error if active unit not found', () => {
      const roster: RosterData = {
        activeParty: [createUnit('active1', 'Active 1')],
        bench: [createUnit('bench1', 'Bench 1')],
      };

      const result = rosterManager.swapUnits(roster, {
        benchUnitId: 'bench1',
        activeUnitId: 'nonexistent',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Active unit');
        expect(result.error).toContain('nonexistent');
        expect(result.error).toContain('not found');
      }
    });

    test('does not mutate original roster', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
        ],
        bench: [createUnit('bench1', 'Bench 1')],
      };

      const originalActive = roster.activeParty[0];
      const originalBench = roster.bench[0];

      rosterManager.swapUnits(roster, {
        benchUnitId: 'bench1',
        activeUnitId: 'active1',
      });

      // Original roster unchanged
      expect(roster.activeParty[0]).toBe(originalActive);
      expect(roster.bench[0]).toBe(originalBench);
      expect(roster.activeParty[0].id).toBe('active1');
      expect(roster.bench[0].id).toBe('bench1');
    });

    test('swap at different indices works correctly', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
          createUnit('active3', 'Active 3'),
        ],
        bench: [
          createUnit('bench1', 'Bench 1'),
          createUnit('bench2', 'Bench 2'),
          createUnit('bench3', 'Bench 3'),
        ],
      };

      const result = rosterManager.swapUnits(roster, {
        benchUnitId: 'bench3',
        activeUnitId: 'active1',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.activeParty[0].id).toBe('bench3');
        expect(result.value.bench[2].id).toBe('active1');
      }
    });
  });

  describe('validateRoster', () => {
    test('accepts valid roster with 1-4 active units', () => {
      const roster: RosterData = {
        activeParty: [createUnit('active1', 'Active 1')],
        bench: [],
      };

      const result = rosterManager.validateRoster(roster);

      expect(result.ok).toBe(true);
    });

    test('rejects empty active party', () => {
      const roster: RosterData = {
        activeParty: [],
        bench: [createUnit('bench1', 'Bench 1')],
      };

      const result = rosterManager.validateRoster(roster);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Active party cannot be empty');
      }
    });

    test('rejects more than 4 active units', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
          createUnit('active3', 'Active 3'),
          createUnit('active4', 'Active 4'),
          createUnit('active5', 'Active 5'),
        ],
        bench: [],
      };

      const result = rosterManager.validateRoster(roster);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Active party cannot exceed 4 units');
      }
    });

    test('rejects duplicate IDs across active and bench', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('duplicate', 'Unit 1'),
          createUnit('active2', 'Active 2'),
        ],
        bench: [createUnit('duplicate', 'Unit 2')],
      };

      const result = rosterManager.validateRoster(roster);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Duplicate unit IDs found');
      }
    });

    test('accepts valid roster with bench units', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
        ],
        bench: [
          createUnit('bench1', 'Bench 1'),
          createUnit('bench2', 'Bench 2'),
        ],
      };

      const result = rosterManager.validateRoster(roster);

      expect(result.ok).toBe(true);
    });
  });

  describe('addRecruitedUnit', () => {
    test('adds to active party when room available', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
        ],
        bench: [],
      };

      const newUnit = createUnit('new1', 'New Unit');
      const newRoster = rosterManager.addRecruitedUnit(roster, newUnit);

      expect(newRoster.activeParty).toHaveLength(3);
      expect(newRoster.activeParty[2].id).toBe('new1');
      expect(newRoster.bench).toHaveLength(0);
    });

    test('adds to bench when active party full', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
          createUnit('active3', 'Active 3'),
          createUnit('active4', 'Active 4'),
        ],
        bench: [],
      };

      const newUnit = createUnit('new1', 'New Unit');
      const newRoster = rosterManager.addRecruitedUnit(roster, newUnit);

      expect(newRoster.activeParty).toHaveLength(4);
      expect(newRoster.bench).toHaveLength(1);
      expect(newRoster.bench[0].id).toBe('new1');
    });
  });

  describe('getActiveTeam', () => {
    test('returns active party as flat array', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
        ],
        bench: [createUnit('bench1', 'Bench 1')],
      };

      const activeTeam = rosterManager.getActiveTeam(roster);

      expect(activeTeam).toHaveLength(2);
      expect(activeTeam[0].id).toBe('active1');
      expect(activeTeam[1].id).toBe('active2');
    });
  });

  describe('getAllUnits', () => {
    test('returns all units (active + bench) as flat array', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
        ],
        bench: [
          createUnit('bench1', 'Bench 1'),
          createUnit('bench2', 'Bench 2'),
        ],
      };

      const allUnits = rosterManager.getAllUnits(roster);

      expect(allUnits).toHaveLength(4);
      expect(allUnits[0].id).toBe('active1');
      expect(allUnits[1].id).toBe('active2');
      expect(allUnits[2].id).toBe('bench1');
      expect(allUnits[3].id).toBe('bench2');
    });
  });

  describe('getRosterStats', () => {
    test('returns correct statistics', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
        ],
        bench: [
          createUnit('bench1', 'Bench 1'),
          createUnit('bench2', 'Bench 2'),
          createUnit('bench3', 'Bench 3'),
        ],
      };

      const stats = rosterManager.getRosterStats(roster);

      expect(stats.activeCount).toBe(2);
      expect(stats.benchCount).toBe(3);
      expect(stats.totalCount).toBe(5);
      expect(stats.activeSlotsFree).toBe(2);
    });

    test('handles full active party', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('active1', 'Active 1'),
          createUnit('active2', 'Active 2'),
          createUnit('active3', 'Active 3'),
          createUnit('active4', 'Active 4'),
        ],
        bench: [],
      };

      const stats = rosterManager.getRosterStats(roster);

      expect(stats.activeCount).toBe(4);
      expect(stats.activeSlotsFree).toBe(0);
    });

    test('handles empty roster', () => {
      const roster: RosterData = {
        activeParty: [],
        bench: [],
      };

      const stats = rosterManager.getRosterStats(roster);

      expect(stats.activeCount).toBe(0);
      expect(stats.benchCount).toBe(0);
      expect(stats.totalCount).toBe(0);
      expect(stats.activeSlotsFree).toBe(4);
    });
  });
});
