/*
 * Tests for EventLogger system
 * 
 * Coverage:
 * - All event types (choice, battle, unit, run)
 * - Event data structuring
 * - Logger integration
 * - Edge cases (missing optional fields, large data)
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { EventLogger } from '../../src/systems/EventLogger.js';
import type { ILogger } from '../../src/systems/Logger.js';
import type { 
  ChoiceGeneratedEvent, 
  ChoiceSelectedEvent, 
  BattleStartedEvent 
} from '../../src/types/game.js';

describe('EventLogger.ts', () => {
  let mockLogger: ILogger;
  let eventLogger: EventLogger;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      child: vi.fn().mockReturnThis(),
    };
    eventLogger = new EventLogger(mockLogger);
  });

  describe('Choice Events', () => {
    test('logs choice generation event', () => {
      const event: ChoiceGeneratedEvent = {
        battleIndex: 5,
        previews: [
          { id: 'enemy1', difficulty: 'Normal', primaryTag: 'Beast' },
          { id: 'enemy2', difficulty: 'Standard', primaryTag: 'Mech' },
        ],
        seed: 12345,
        attempts: 3,
        degraded: false,
      };

      eventLogger.logChoiceGenerated(event);

      expect(mockLogger.info).toHaveBeenCalledWith('choice:generated', {
        battleIndex: 5,
        previewCount: 2,
        previews: event.previews,
        seed: 12345,
        attempts: 3,
        degraded: false,
      });
    });

    test('logs choice selection event', () => {
      const event: ChoiceSelectedEvent = {
        battleIndex: 3,
        selectedId: 'beast_pack_01',
        difficulty: 'Hard',
        primaryTag: 'Beast',
      };

      eventLogger.logChoiceSelected(event);

      expect(mockLogger.info).toHaveBeenCalledWith('choice:selected', {
        battleIndex: 3,
        selectedId: 'beast_pack_01',
        difficulty: 'Hard',
        primaryTag: 'Beast',
      });
    });

    test('logs choice degraded event', () => {
      const data = {
        battleIndex: 10,
        reason: 'Too many re-rolls, relaxed constraints',
        attempts: 5,
      };

      eventLogger.logChoiceDegraded(data);

      expect(mockLogger.warn).toHaveBeenCalledWith('choice:degraded', {
        battleIndex: 10,
        reason: 'Too many re-rolls, relaxed constraints',
        attempts: 5,
      });
    });

    test('handles empty previews array', () => {
      const event: ChoiceGeneratedEvent = {
        battleIndex: 0,
        previews: [],
        seed: 111,
        attempts: 1,
        degraded: false,
      };

      eventLogger.logChoiceGenerated(event);

      expect(mockLogger.info).toHaveBeenCalledWith('choice:generated', {
        battleIndex: 0,
        previewCount: 0,
        previews: [],
        seed: 111,
        attempts: 1,
        degraded: false,
      });
    });
  });

  describe('Battle Events', () => {
    test('logs battle started event', () => {
      const event: BattleStartedEvent = {
        battleIndex: 7,
        opponentId: 'dragon_horde_03',
        playerTeam: [
          { id: 'warrior1', name: 'Warrior', role: 'Tank' },
          { id: 'mage1', name: 'Mage', role: 'DPS' },
        ],
        enemyTeam: [
          { id: 'dragon1', name: 'Dragon', role: 'Tank' },
        ],
      };

      eventLogger.logBattleStarted(event);

      expect(mockLogger.info).toHaveBeenCalledWith('battle:started', {
        battleIndex: 7,
        opponentId: 'dragon_horde_03',
        playerTeamSize: 2,
        enemyTeamSize: 1,
        playerTeam: event.playerTeam,
        enemyTeam: event.enemyTeam,
      });
    });

    test('logs battle ended event (player victory)', () => {
      const data = {
        battleIndex: 5,
        winner: 'player' as const,
        turnsTaken: 12,
        unitsDefeated: ['orc1', 'orc2', 'goblin1'] as readonly string[],
      };

      eventLogger.logBattleEnded(data);

      expect(mockLogger.info).toHaveBeenCalledWith('battle:ended', {
        battleIndex: 5,
        winner: 'player',
        turnsTaken: 12,
        unitsDefeatedCount: 3,
      });
    });

    test('logs battle ended event (enemy victory)', () => {
      const data = {
        battleIndex: 10,
        winner: 'enemy' as const,
        turnsTaken: 8,
        unitsDefeated: [] as readonly string[],
      };

      eventLogger.logBattleEnded(data);

      expect(mockLogger.info).toHaveBeenCalledWith('battle:ended', {
        battleIndex: 10,
        winner: 'enemy',
        turnsTaken: 8,
        unitsDefeatedCount: 0,
      });
    });

    test('logs battle ended event (draw/flee)', () => {
      const data = {
        battleIndex: 3,
        winner: 'draw' as const,
        turnsTaken: 5,
        unitsDefeated: ['goblin1'] as readonly string[],
      };

      eventLogger.logBattleEnded(data);

      expect(mockLogger.info).toHaveBeenCalledWith('battle:ended', {
        battleIndex: 3,
        winner: 'draw',
        turnsTaken: 5,
        unitsDefeatedCount: 1,
      });
    });

    test('logs battle defeat event', () => {
      const data = {
        battleIndex: 15,
        playerTeam: [
          { id: 'warrior1', name: 'Warrior' },
          { id: 'rogue1', name: 'Rogue' },
          { id: 'mage1', name: 'Mage' },
        ] as readonly { id: string; name: string }[],
      };

      eventLogger.logBattleDefeat(data);

      expect(mockLogger.error).toHaveBeenCalledWith('battle:defeat', {
        battleIndex: 15,
        teamSize: 3,
        teamComp: 'Warrior, Rogue, Mage',
      });
    });

    test('handles single-unit team in defeat', () => {
      const data = {
        battleIndex: 1,
        playerTeam: [
          { id: 'warrior1', name: 'Solo Warrior' },
        ] as readonly { id: string; name: string }[],
      };

      eventLogger.logBattleDefeat(data);

      expect(mockLogger.error).toHaveBeenCalledWith('battle:defeat', {
        battleIndex: 1,
        teamSize: 1,
        teamComp: 'Solo Warrior',
      });
    });
  });

  describe('Unit Events', () => {
    test('logs unit recruited event (new recruitment)', () => {
      const data = {
        unitId: 'warrior_recruit_01',
        unitName: 'Knight',
        role: 'Tank',
      };

      eventLogger.logUnitRecruited(data);

      expect(mockLogger.info).toHaveBeenCalledWith('unit:recruited', {
        unitId: 'warrior_recruit_01',
        unitName: 'Knight',
        role: 'Tank',
        wasReplacement: false,
        replacedUnitId: undefined,
      });
    });

    test('logs unit recruited event (replacement)', () => {
      const data = {
        unitId: 'mage_recruit_02',
        unitName: 'Sorcerer',
        role: 'DPS',
        replacedUnitId: 'old_mage_01',
      };

      eventLogger.logUnitRecruited(data);

      expect(mockLogger.info).toHaveBeenCalledWith('unit:recruited', {
        unitId: 'mage_recruit_02',
        unitName: 'Sorcerer',
        role: 'DPS',
        wasReplacement: true,
        replacedUnitId: 'old_mage_01',
      });
    });

    test('handles all role types', () => {
      const roles = ['Tank', 'DPS', 'Support', 'Specialist'];
      
      roles.forEach(role => {
        eventLogger.logUnitRecruited({
          unitId: `unit_${role}`,
          unitName: role,
          role: role,
        });
      });

      expect(mockLogger.info).toHaveBeenCalledTimes(4);
    });
  });

  describe('Run Events', () => {
    test('logs run started event', () => {
      const data = {
        runSeed: 98765,
        starterTeamSize: 3,
      };

      eventLogger.logRunStarted(data);

      expect(mockLogger.info).toHaveBeenCalledWith('run:started', 
        expect.objectContaining({
          runSeed: 98765,
          starterTeamSize: 3,
        })
      );
      
      // Check that timestamp was added
      const callArgs = (mockLogger.info as any).mock.calls[0][1];
      expect(callArgs.timestamp).toBeDefined();
      expect(typeof callArgs.timestamp).toBe('string');
    });

    test('logs run completed event', () => {
      const data = {
        battlesWon: 10,
        unitsRecruited: 5,
        finalTeamSize: 4,
      };

      eventLogger.logRunCompleted(data);

      expect(mockLogger.info).toHaveBeenCalledWith('run:completed', 
        expect.objectContaining({
          battlesWon: 10,
          unitsRecruited: 5,
          finalTeamSize: 4,
        })
      );
      
      // Check that timestamp was added
      const callArgs = (mockLogger.info as any).mock.calls[0][1];
      expect(callArgs.timestamp).toBeDefined();
      expect(typeof callArgs.timestamp).toBe('string');
    });

    test('handles zero values in run completion', () => {
      const data = {
        battlesWon: 0,
        unitsRecruited: 0,
        finalTeamSize: 1,
      };

      eventLogger.logRunCompleted(data);

      expect(mockLogger.info).toHaveBeenCalledWith('run:completed', 
        expect.objectContaining({
          battlesWon: 0,
          unitsRecruited: 0,
          finalTeamSize: 1,
        })
      );
    });
  });

  describe('Generic Event Logging', () => {
    test('logs custom event type', () => {
      const customData = {
        customField1: 'value1',
        customField2: 123,
        nested: { key: 'value' },
      };

      eventLogger.logEvent('custom:event' as any, customData);

      expect(mockLogger.info).toHaveBeenCalledWith('custom:event', customData);
    });

    test('handles empty data object', () => {
      eventLogger.logEvent('empty:event' as any, {});

      expect(mockLogger.info).toHaveBeenCalledWith('empty:event', {});
    });

    test('handles complex nested data', () => {
      const complexData = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
              array: [1, 2, 3],
            },
          },
        },
      };

      eventLogger.logEvent('complex:event' as any, complexData);

      expect(mockLogger.info).toHaveBeenCalledWith('complex:event', complexData);
    });
  });

  describe('Integration - Event Sequences', () => {
    test('logs complete battle flow', () => {
      // Run start
      eventLogger.logRunStarted({ runSeed: 111, starterTeamSize: 2 });

      // Choice generation
      eventLogger.logChoiceGenerated({
        battleIndex: 0,
        previews: [{ id: 'e1', difficulty: 'Normal', primaryTag: 'Beast' }],
        seed: 222,
        attempts: 1,
        degraded: false,
      });

      // Choice selection
      eventLogger.logChoiceSelected({
        battleIndex: 0,
        selectedId: 'e1',
        difficulty: 'Normal',
        primaryTag: 'Beast',
      });

      // Battle start
      eventLogger.logBattleStarted({
        battleIndex: 0,
        opponentId: 'e1',
        playerTeam: [{ id: 'w1', name: 'Warrior', role: 'Tank' }],
        enemyTeam: [{ id: 'orc1', name: 'Orc', role: 'Tank' }],
      });

      // Battle end
      eventLogger.logBattleEnded({
        battleIndex: 0,
        winner: 'player',
        turnsTaken: 10,
        unitsDefeated: ['orc1'],
      });

      // Unit recruited
      eventLogger.logUnitRecruited({
        unitId: 'mage1',
        unitName: 'Mage',
        role: 'DPS',
      });

      expect(mockLogger.info).toHaveBeenCalledTimes(6);
    });

    test('logs defeat flow', () => {
      // Battle start
      eventLogger.logBattleStarted({
        battleIndex: 5,
        opponentId: 'dragon',
        playerTeam: [{ id: 'w1', name: 'Warrior', role: 'Tank' }],
        enemyTeam: [{ id: 'dragon1', name: 'Dragon', role: 'Tank' }],
      });

      // Battle defeat
      eventLogger.logBattleDefeat({
        battleIndex: 5,
        playerTeam: [{ id: 'w1', name: 'Warrior' }],
      });

      expect(mockLogger.info).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data Formatting', () => {
    test('formats battle index consistently', () => {
      eventLogger.logChoiceGenerated({
        battleIndex: 42,
        previews: [],
        seed: 123,
        attempts: 1,
        degraded: false,
      });

      eventLogger.logBattleStarted({
        battleIndex: 42,
        opponentId: 'test',
        playerTeam: [],
        enemyTeam: [],
      });

      const calls = (mockLogger.info as any).mock.calls;
      expect(calls[0][1].battleIndex).toBe(42);
      expect(calls[1][1].battleIndex).toBe(42);
    });

    test('formats team composition strings correctly', () => {
      eventLogger.logBattleDefeat({
        battleIndex: 1,
        playerTeam: [
          { id: 'w1', name: 'Warrior' },
          { id: 'r1', name: 'Rogue' },
          { id: 'm1', name: 'Mage' },
        ],
      });

      const callArgs = (mockLogger.error as any).mock.calls[0][1];
      expect(callArgs.teamComp).toBe('Warrior, Rogue, Mage');
    });

    test('includes ISO timestamps where required', () => {
      eventLogger.logRunStarted({ runSeed: 123, starterTeamSize: 2 });
      eventLogger.logRunCompleted({ battlesWon: 10, unitsRecruited: 5, finalTeamSize: 4 });

      const calls = (mockLogger.info as any).mock.calls;
      expect(calls[0][1].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(calls[1][1].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
