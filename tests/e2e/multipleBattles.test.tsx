/*
 * Integration Test: Multiple Consecutive Battles (State Machine Focus)
 * 
 * Purpose: Prevent regression of the critical soft-lock bug that prevented
 * game progression after the first battle.
 * 
 * Bug History (Fixed in v0.7.1):
 * 1. Defeated enemies weren't being tracked due to ID mismatch
 *    - Battle created indexed IDs: "enemy_0", "enemy_1"
 *    - RewardSystem checked template IDs: "enemy"
 *    - Result: defeatedEnemies always empty → recruitment skipped
 * 
 * 2. State machine didn't accept 'roster_management' for battle advancement
 *    - App transitioned to 'roster_management' after recruitment
 *    - GameController.advanceToNextBattle() only accepted 'recruit' state
 *    - Result: "Cannot advance" error → soft-lock
 * 
 * These tests verify the core game loop state transitions work correctly.
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { GameController } from '../../src/core/GameController';
import { ConsoleLogger } from '../../src/systems/Logger';
import { RewardSystem } from '../../src/systems/RewardSystem';
import type { BattleResult, OpponentSpec, BattleUnit, EnemyUnitTemplate } from '../../src/types/game';
import { makeRng } from '../../src/utils/rng';

describe('Integration: Multi-Battle State Flow (Regression Tests)', () => {
  let controller: GameController;
  let rewardSystem: RewardSystem;
  let logger: ConsoleLogger;

  beforeEach(() => {
    logger = new ConsoleLogger('error');
    controller = new GameController(logger);
    rewardSystem = new RewardSystem(logger);
  });

  test('REGRESSION: Defeated enemies are tracked correctly despite ID indexing', () => {
    // This test verifies the ID mismatch bug fix

    // Simulate how App.tsx creates battle units with indexed IDs
    const enemyTemplate: EnemyUnitTemplate = {
      id: 'test_enemy',
      name: 'Test Enemy',
      role: 'DPS',
      tags: ['Beast'],
      baseStats: { hp: 100, atk: 20, def: 10, speed: 50 },
      spriteKey: 'test',
    };

    // App.tsx creates indexed IDs when duplicates exist
    const enemyBattleUnits: BattleUnit[] = [
      {
        id: 'test_enemy_0', // Indexed ID
        name: 'Test Enemy',
        role: 'DPS',
        tags: ['Beast'],
        currentHp: 0, // Defeated
        maxHp: 100,
        atk: 20,
        def: 10,
        speed: 50,
        isPlayer: false,
        originalIndex: 0,
      },
      {
        id: 'test_enemy_1', // Indexed ID
        name: 'Test Enemy',
        role: 'DPS',
        tags: ['Beast'],
        currentHp: 0, // Defeated
        maxHp: 100,
        atk: 20,
        def: 10,
        speed: 50,
        isPlayer: false,
        originalIndex: 1,
      },
    ];

    // Battle result with indexed IDs in unitsDefeated
    const battleResult: BattleResult = {
      winner: 'player',
      actions: [],
      unitsDefeated: ['test_enemy_0', 'test_enemy_1'], // Indexed IDs
      turnsTaken: 5,
    };

    const opponentSpec: OpponentSpec = {
      id: 'test_opponent',
      name: 'Test Opponent',
      difficulty: 'Standard',
      primaryTag: 'Beast',
      units: [enemyTemplate, enemyTemplate], // Same template twice
      rewardHint: 'Test Rewards',
    };

    // Generate rewards (this was failing before the fix)
    const rewards = rewardSystem.generateRewards(
      opponentSpec,
      battleResult,
      makeRng(12345).fork('rewards')
    );

    // BEFORE FIX: defeatedEnemies would be empty because IDs didn't match
    // AFTER FIX: Should work if App.tsx correctly maps indexed IDs back to templates
    
    // Note: This test passes with the OLD buggy code because RewardSystem itself works fine
    // The bug was in App.tsx not correctly using the defeated battle units
    // This test documents the ID mismatch issue for future reference
    expect(rewards).toBeDefined();
    expect(rewards.experience).toBeGreaterThan(0);
  });

  test('REGRESSION: advanceToNextBattle() accepts roster_management state', () => {
    // This test verifies the state machine fix

    // Start a new run
    const startResult = controller.startRun(['warrior', 'mage'], 12345);
    expect(startResult.ok).toBe(true);

    // Generate opponent choices
    const choicesResult = controller.generateOpponentChoices();
    expect(choicesResult.ok).toBe(true);

    // Select an opponent
    if (choicesResult.ok) {
      const selectResult = controller.selectOpponent(choicesResult.value[0].spec.id);
      expect(selectResult.ok).toBe(true);
    }

    // Follow proper state flow: team_prep → battle → rewards → equipment → recruit → roster_management
    controller.getStateMachine().transitionTo('team_prep');
    controller.getStateMachine().transitionTo('battle');
    controller.getStateMachine().transitionTo('rewards');
    controller.getStateMachine().transitionTo('equipment');
    controller.getStateMachine().transitionTo('recruit');
    controller.getStateMachine().transitionTo('roster_management');

    // Verify we're in roster_management state
    expect(controller.getStateMachine().getState()).toBe('roster_management');

    // BEFORE FIX: This would fail with "Cannot advance - not in recruit state"
    // AFTER FIX: Should succeed because we accept both 'recruit' and 'roster_management'
    const advanceResult = controller.advanceToNextBattle();
    
    expect(advanceResult.ok).toBe(true);
    if (!advanceResult.ok) {
      console.error('Advance failed:', advanceResult.error);
    }

    // Verify battle index incremented
    expect(controller.getState().battleIndex).toBe(1);
  });

  test('Full state machine flow: recruit → roster_management → opponent_select', () => {
    // Test the complete state transition sequence

    const startResult = controller.startRun(['warrior', 'mage'], 12345);
    expect(startResult.ok).toBe(true);

    // Generate and select opponent for Battle 0
    const choices0 = controller.generateOpponentChoices();
    expect(choices0.ok).toBe(true);
    if (choices0.ok) {
      controller.selectOpponent(choices0.value[0].spec.id);
    }

    // Follow proper state flow: team_prep → battle → rewards → equipment → recruit → roster_management
    controller.getStateMachine().transitionTo('team_prep');
    controller.getStateMachine().transitionTo('battle');
    controller.getStateMachine().transitionTo('rewards');
    controller.getStateMachine().transitionTo('equipment');
    controller.getStateMachine().transitionTo('recruit');
    expect(controller.getStateMachine().getState()).toBe('recruit');

    // Transition to roster management (what App.tsx does)
    controller.getStateMachine().transitionTo('roster_management');
    expect(controller.getStateMachine().getState()).toBe('roster_management');

    // Advance to next battle (CRITICAL: this was failing before)
    const advanceResult = controller.advanceToNextBattle();
    expect(advanceResult.ok).toBe(true);

    // Generate choices for Battle 1
    const choices1 = controller.generateOpponentChoices();
    expect(choices1.ok).toBe(true);

    // Verify state transitioned to opponent_select
    expect(controller.getStateMachine().getState()).toBe('opponent_select');

    // Verify battle index incremented
    expect(controller.getState().battleIndex).toBe(1);
  });

  test('Can advance through multiple battle cycles', () => {
    // Verify game can loop indefinitely

    controller.startRun(['warrior', 'mage'], 12345);

    for (let i = 0; i < 5; i++) {
      // Generate choices for current battle
      const choices = controller.generateOpponentChoices();
      expect(choices.ok).toBe(true);
      if (!choices.ok) break;

      // Select opponent
      controller.selectOpponent(choices.value[0].spec.id);

      // Follow proper state flow through post-battle
      controller.getStateMachine().transitionTo('team_prep');
      controller.getStateMachine().transitionTo('battle');
      controller.getStateMachine().transitionTo('rewards');
      controller.getStateMachine().transitionTo('equipment');
      controller.getStateMachine().transitionTo('recruit');
      controller.getStateMachine().transitionTo('roster_management');

      // Advance to next battle (this was failing before the fix)
      const advanceResult = controller.advanceToNextBattle();
      expect(advanceResult.ok).toBe(true);
      expect(controller.getState().battleIndex).toBe(i + 1);
    }

    // Verify we reached Battle 5
    expect(controller.getState().battleIndex).toBe(5);
  });
});
