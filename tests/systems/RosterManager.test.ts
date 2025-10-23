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

  // Test fixture helper
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
    test('creates roster with 4 units all in active party', () => {
      const team: PlayerUnit[] = [
        createUnit('1', 'Unit1'),
        createUnit('2', 'Unit2'),
        createUnit('3', 'Unit3'),
        createUnit('4', 'Unit4'),
      ];

      const roster = rosterManager.createRosterFromTeam(team);

      expect(roster.activeParty).toHaveLength(4);
      expect(roster.bench).toHaveLength(0);
      expect(roster.activeParty[0].id).toBe('1');
      expect(roster.activeParty[3].id).toBe('4');
    });

    test('creates roster with 6 units - 4 active, 2 bench', () => {
      const team: PlayerUnit[] = [
        createUnit('1', 'Unit1'),
        createUnit('2', 'Unit2'),
        createUnit('3', 'Unit3'),
        createUnit('4', 'Unit4'),
        createUnit('5', 'Unit5'),
        createUnit('6', 'Unit6'),
      ];

      const roster = rosterManager.createRosterFromTeam(team);

      expect(roster.activeParty).toHaveLength(4);
      expect(roster.bench).toHaveLength(2);
      expect(roster.activeParty[0].id).toBe('1');
      expect(roster.activeParty[3].id).toBe('4');
      expect(roster.bench[0].id).toBe('5');
      expect(roster.bench[1].id).toBe('6');
    });

    test('creates empty roster from empty team', () => {
      const team: PlayerUnit[] = [];

      const roster = rosterManager.createRosterFromTeam(team);

      expect(roster.activeParty).toHaveLength(0);
      expect(roster.bench).toHaveLength(0);
    });

    test('creates roster with 10 units - 4 active, 6 bench', () => {
      const team: PlayerUnit[] = Array.from({ length: 10 }, (_, i) =>
        createUnit(`${i + 1}`, `Unit${i + 1}`)
      );

      const roster = rosterManager.createRosterFromTeam(team);

      expect(roster.activeParty).toHaveLength(4);
      expect(roster.bench).toHaveLength(6);
      expect(roster.activeParty[0].id).toBe('1');
      expect(roster.activeParty[3].id).toBe('4');
      expect(roster.bench[0].id).toBe('5');
      expect(roster.bench[5].id).toBe('10');
    });
  });

  describe('swapUnits', () => {
    test('successfully swaps unit from bench to active party', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('a1', 'Active1'),
          createUnit('a2', 'Active2'),
          createUnit('a3', 'Active3'),
          createUnit('a4', 'Active4'),
        ],
        bench: [
          createUnit('b1', 'Bench1'),
          createUnit('b2', 'Bench2'),
        ],
      };

      const result = rosterManager.swapUnits(roster, {
        benchUnitId: 'b1',
        activeUnitId: 'a2',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.activeParty).toHaveLength(4);
        expect(result.value.bench).toHaveLength(2);
        // Check swapped positions
        expect(result.value.activeParty[1].id).toBe('b1'); // Bench1 now in position 1
        expect(result.value.bench[0].id).toBe('a2'); // Active2 now on bench
        // Check other positions unchanged
        expect(result.value.activeParty[0].id).toBe('a1');
        expect(result.value.activeParty[2].id).toBe('a3');
        expect(result.value.activeParty[3].id).toBe('a4');
        expect(result.value.bench[1].id).toBe('b2');
      }
    });

    test('returns error when bench unit not found', () => {
      const roster: RosterData = {
        activeParty: [createUnit('a1', 'Active1')],
        bench: [createUnit('b1', 'Bench1')],
      };

      const result = rosterManager.swapUnits(roster, {
        benchUnitId: 'nonexistent',
        activeUnitId: 'a1',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Bench unit');
        expect(result.error).toContain('not found');
      }
    });

    test('returns error when active unit not found', () => {
      const roster: RosterData = {
        activeParty: [createUnit('a1', 'Active1')],
        bench: [createUnit('b1', 'Bench1')],
      };

      const result = rosterManager.swapUnits(roster, {
        benchUnitId: 'b1',
        activeUnitId: 'nonexistent',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Active unit');
        expect(result.error).toContain('not found');
      }
    });

    test('swap is immutable - original roster unchanged', () => {
      const roster: RosterData = {
        activeParty: [createUnit('a1', 'Active1')],
        bench: [createUnit('b1', 'Bench1')],
      };

      const originalActiveId = roster.activeParty[0].id;
      const originalBenchId = roster.bench[0].id;

      rosterManager.swapUnits(roster, {
        benchUnitId: 'b1',
        activeUnitId: 'a1',
      });

      // Original roster unchanged
      expect(roster.activeParty[0].id).toBe(originalActiveId);
      expect(roster.bench[0].id).toBe(originalBenchId);
    });

    test('swaps units at different indices correctly', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('a1', 'Active1'),
          createUnit('a2', 'Active2'),
          createUnit('a3', 'Active3'),
        ],
        bench: [
          createUnit('b1', 'Bench1'),
          createUnit('b2', 'Bench2'),
          createUnit('b3', 'Bench3'),
        ],
      };

      // Swap last active with last bench
      const result = rosterManager.swapUnits(roster, {
        benchUnitId: 'b3',
        activeUnitId: 'a3',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.activeParty[2].id).toBe('b3');
        expect(result.value.bench[2].id).toBe('a3');
      }
    });
  });

  describe('validateRoster', () => {
    test('accepts valid roster with 1-4 active units', () => {
      const validRosters: RosterData[] = [
        {
          activeParty: [createUnit('1', 'Unit1')],
          bench: [],
        },
        {
          activeParty: [createUnit('1', 'Unit1'), createUnit('2', 'Unit2')],
          bench: [createUnit('3', 'Unit3')],
        },
        {
          activeParty: [
            createUnit('1', 'Unit1'),
            createUnit('2', 'Unit2'),
            createUnit('3', 'Unit3'),
            createUnit('4', 'Unit4'),
          ],
          bench: [],
        },
      ];

      for (const roster of validRosters) {
        const result = rosterManager.validateRoster(roster);
        expect(result.ok).toBe(true);
      }
    });

    test('rejects empty active party', () => {
      const roster: RosterData = {
        activeParty: [],
        bench: [createUnit('1', 'Unit1')],
      };

      const result = rosterManager.validateRoster(roster);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Active party cannot be empty');
      }
    });

    test('rejects active party with more than 4 units', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('1', 'Unit1'),
          createUnit('2', 'Unit2'),
          createUnit('3', 'Unit3'),
          createUnit('4', 'Unit4'),
          createUnit('5', 'Unit5'),
        ],
        bench: [],
      };

      const result = rosterManager.validateRoster(roster);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Active party cannot exceed 4 units');
      }
    });

    test('rejects roster with duplicate IDs in active party', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('1', 'Unit1'),
          createUnit('1', 'Unit1Duplicate'), // Duplicate ID
        ],
        bench: [],
      };

      const result = rosterManager.validateRoster(roster);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Duplicate unit ID');
      }
    });

    test('rejects roster with duplicate IDs across active and bench', () => {
      const roster: RosterData = {
        activeParty: [createUnit('1', 'Unit1')],
        bench: [createUnit('1', 'Unit1Duplicate')], // Duplicate ID
      };

      const result = rosterManager.validateRoster(roster);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Duplicate unit ID');
      }
    });
  });

  describe('addRecruitedUnit', () => {
    test('adds unit to active party when not full', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('1', 'Unit1'),
          createUnit('2', 'Unit2'),
        ],
        bench: [],
      };

      const newUnit = createUnit('3', 'NewRecruit');
      const result = rosterManager.addRecruitedUnit(roster, newUnit);

      expect(result.activeParty).toHaveLength(3);
      expect(result.bench).toHaveLength(0);
      expect(result.activeParty[2].id).toBe('3');
    });

    test('adds unit to bench when active party is full', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('1', 'Unit1'),
          createUnit('2', 'Unit2'),
          createUnit('3', 'Unit3'),
          createUnit('4', 'Unit4'),
        ],
        bench: [createUnit('5', 'Unit5')],
      };

      const newUnit = createUnit('6', 'NewRecruit');
      const result = rosterManager.addRecruitedUnit(roster, newUnit);

      expect(result.activeParty).toHaveLength(4);
      expect(result.bench).toHaveLength(2);
      expect(result.bench[1].id).toBe('6');
    });
  });

  describe('getActiveTeam', () => {
    test('returns active party as array', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('1', 'Unit1'),
          createUnit('2', 'Unit2'),
        ],
        bench: [createUnit('3', 'Unit3')],
      };

      const activeTeam = rosterManager.getActiveTeam(roster);

      expect(activeTeam).toHaveLength(2);
      expect(activeTeam[0].id).toBe('1');
      expect(activeTeam[1].id).toBe('2');
    });
  });

  describe('getAllUnits', () => {
    test('returns all units (active + bench)', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('1', 'Unit1'),
          createUnit('2', 'Unit2'),
        ],
        bench: [
          createUnit('3', 'Unit3'),
          createUnit('4', 'Unit4'),
        ],
      };

      const allUnits = rosterManager.getAllUnits(roster);

      expect(allUnits).toHaveLength(4);
      expect(allUnits[0].id).toBe('1');
      expect(allUnits[1].id).toBe('2');
      expect(allUnits[2].id).toBe('3');
      expect(allUnits[3].id).toBe('4');
    });
  });

  describe('getRosterStats', () => {
    test('returns correct roster statistics', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('1', 'Unit1'),
          createUnit('2', 'Unit2'),
          createUnit('3', 'Unit3'),
        ],
        bench: [
          createUnit('4', 'Unit4'),
          createUnit('5', 'Unit5'),
        ],
      };

      const stats = rosterManager.getRosterStats(roster);

      expect(stats.activeCount).toBe(3);
      expect(stats.benchCount).toBe(2);
      expect(stats.totalCount).toBe(5);
      expect(stats.hasFullActiveParty).toBe(false);
    });

    test('reports hasFullActiveParty correctly', () => {
      const roster: RosterData = {
        activeParty: [
          createUnit('1', 'Unit1'),
          createUnit('2', 'Unit2'),
          createUnit('3', 'Unit3'),
          createUnit('4', 'Unit4'),
        ],
        bench: [],
      };

      const stats = rosterManager.getRosterStats(roster);

      expect(stats.activeCount).toBe(4);
      expect(stats.hasFullActiveParty).toBe(true);
    });
  });
});
