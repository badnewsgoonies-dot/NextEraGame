/*
 * GameController: Main game orchestrator
 * 
 * Coordinates all systems and manages the core game loop:
 * 1. Start run with starter team
 * 2. Generate opponent choices (ChoiceSystem)
 * 3. Select opponent
 * 4. Execute battle (BattleSystem)
 * 5. Award rewards (future)
 * 6. Recruit defeated enemy (future)
 * 7. Loop back to step 2
 * 
 * Also handles:
 * - State machine transitions
 * - Save/load orchestration
 * - Progression tracking
 * - Event logging
 */

import type { ILogger } from '../systems/Logger.js';
import type { IRng } from '../utils/rng.js';
import type {
  PlayerUnit,
  OpponentPreview,
  BattleResult,
  ProgressionCounters,
  GameState,
  Item,
  Gem,
  ActiveGemState,
  ElementalGem,
} from '../types/game.js';
import { ok, err, type Result } from '../utils/Result.js';
import { GameStateMachine } from './GameStateMachine.js';
import { ChoiceSystem } from '../systems/ChoiceSystem.js';
// BattleSystem removed - battles now handled by manual BattleScreen.tsx
import { SaveSystem, type GameStateSnapshot } from '../systems/SaveSystem.js';
import { EventLogger } from '../systems/EventLogger.js';
import { makeRng } from '../utils/rng.js';
import { ITEM_CATALOG } from '../data/items.js';

export interface GameControllerState {
  runSeed: number;
  battleIndex: number;
  playerTeam: PlayerUnit[];
  inventory: Item[];
  gems: Gem[]; // Gem inventory (Djinn equipment system)
  activeGemState: ActiveGemState; // Active elemental alignment gem
  progression: ProgressionCounters;
  currentChoices: OpponentPreview[] | null;
  selectedOpponentId: string | null;
  lastBattleResult: BattleResult | null;
}

export class GameController {
  private readonly stateMachine: GameStateMachine;
  private readonly choiceSystem: ChoiceSystem;
  // battleSystem removed - manual combat in BattleScreen.tsx
  private readonly saveSystem: SaveSystem;
  private readonly eventLogger: EventLogger;
  
  private state: GameControllerState;
  private rootRng: IRng;

  constructor(logger: ILogger, saveSystem?: SaveSystem) {
    this.stateMachine = new GameStateMachine();
    this.choiceSystem = new ChoiceSystem(logger, { enableLogging: true });
    this.eventLogger = new EventLogger(logger);
    // battleSystem removed - manual combat in BattleScreen.tsx
    this.saveSystem = saveSystem || new SaveSystem(logger);

    // Initialize with empty state
    this.state = {
      runSeed: 0,
      battleIndex: 0,
      playerTeam: [],
      inventory: [],
      gems: [],
      activeGemState: {
        activeGem: null,
        isActivated: false,
      },
      progression: {
        runsAttempted: 0,
        runsCompleted: 0,
        battlesWon: 0,
        battlesLost: 0,
        unitsRecruited: 0,
      },
      currentChoices: null,
      selectedOpponentId: null,
      lastBattleResult: null,
    };

    this.rootRng = makeRng(0);
  }

  /**
   * Start a new run with starter team
   */
  startRun(starterTeam: PlayerUnit[], seed?: number): Result<void, string> {
    // Reset state machine
    this.stateMachine.reset();

    // Generate or use provided seed
    const runSeed = seed ?? Date.now();
    this.rootRng = makeRng(runSeed);

    // Initialize inventory with 3 Health Potions for testing
    const healthPotion = ITEM_CATALOG.find(item => item.id === 'health_potion');
    const starterInventory = healthPotion ? [healthPotion, healthPotion, healthPotion] : [];

    // Initialize state
    this.state = {
      runSeed,
      battleIndex: 0,
      playerTeam: [...starterTeam],
      inventory: starterInventory,
      gems: [],
      activeGemState: {
        activeGem: null,
        isActivated: false,
      },
      progression: {
        ...this.state.progression,
        runsAttempted: this.state.progression.runsAttempted + 1,
      },
      currentChoices: null,
      selectedOpponentId: null,
      lastBattleResult: null,
    };

    // Log run start
    this.eventLogger.logRunStarted({
      runSeed,
      starterTeamSize: starterTeam.length,
    });

    // Transition through starter_select (team already provided) then to opponent_select
    let transition = this.stateMachine.transitionTo('starter_select');
    if (!transition.ok) {
      return err(`Failed to transition to starter_select: ${transition.error}`);
    }

    transition = this.stateMachine.transitionTo('opponent_select');
    if (!transition.ok) {
      return err(`Failed to transition to opponent_select: ${transition.error}`);
    }

    return ok(undefined);
  }

  /**
   * Generate three opponent choices for current battle
   */
  generateOpponentChoices(): Result<readonly OpponentPreview[], string> {
    if (this.stateMachine.getState() !== 'opponent_select') {
      return err('Cannot generate choices - not in opponent_select state');
    }

    // Fork RNG for this choice generation
    const choiceRng = this.rootRng.fork('choice');
    const result = this.choiceSystem.generateChoices(
      choiceRng,
      this.state.battleIndex,
      this.state.playerTeam
    );

    if (!result.ok) {
      return err(`Failed to generate choices: ${result.error}`);
    }

    this.state.currentChoices = [...result.value];
    return ok(result.value);
  }

  /**
   * Select an opponent and transition to team prep
   */
  selectOpponent(opponentId: string): Result<OpponentPreview, string> {
    if (!this.state.currentChoices) {
      return err('No choices available - call generateOpponentChoices first');
    }

    const selected = this.state.currentChoices.find(c => c.spec.id === opponentId);
    if (!selected) {
      return err(`Opponent ${opponentId} not found in current choices`);
    }

    this.state.selectedOpponentId = opponentId;

    // Log selection
    this.eventLogger.logChoiceSelected({
      battleIndex: this.state.battleIndex,
      selectedId: opponentId,
      difficulty: selected.spec.difficulty,
      primaryTag: selected.spec.primaryTag,
    });

    // Transition to team prep
    const transition = this.stateMachine.transitionTo('team_prep');
    if (!transition.ok) {
      return err(`State transition failed: ${transition.error}`);
    }

    return ok(selected);
  }

  /**
   * Proceed from team prep to battle
   */
  startBattle(): Result<void, string> {
    if (this.stateMachine.getState() !== 'team_prep') {
      return err('Cannot start battle - not in team_prep state');
    }

    const transition = this.stateMachine.transitionTo('battle');
    if (!transition.ok) {
      return err(`State transition failed: ${transition.error}`);
    }

    return ok(undefined);
  }

  /**
   * @deprecated
   * executeBattle() is deprecated - battles are now manual (BattleScreen.tsx)
   * 
   * The battle result and progression updates are now handled by:
   * - BattleScreen.tsx: Runs manual combat, returns BattleResult via onComplete
   * - App.tsx: Receives result, updates progression, transitions states
   * 
   * This method is preserved for backward compatibility with tests.
   * Remove once all tests are updated to use manual battle flow.
   */
  executeBattle(): Result<BattleResult, string> {
    return err('executeBattle is deprecated - use manual BattleScreen.tsx instead');
  }

  /**
   * Advance to next battle (from recruit or roster management screen)
   */
  advanceToNextBattle(): Result<void, string> {
    const currentState = this.stateMachine.getState();
    if (currentState !== 'recruit' && currentState !== 'roster_management') {
      return err(`Cannot advance - not in recruit/roster_management state (current: ${currentState})`);
    }

    // Increment battle index
    this.state.battleIndex++;

    // Reset battle-specific state
    this.state.currentChoices = null;
    this.state.selectedOpponentId = null;
    this.state.lastBattleResult = null;

    // Transition back to opponent select
    const transition = this.stateMachine.transitionTo('opponent_select');
    if (!transition.ok) {
      return err(`State transition failed: ${transition.error}`);
    }

    return ok(undefined);
  }

  /**
   * Transition from rewards to equipment screen
   */
  handleRewardsContinue(): Result<void, string> {
    if (this.stateMachine.getState() !== 'rewards') {
      return err('Cannot continue - not in rewards state');
    }

    const transition = this.stateMachine.transitionTo('equipment');
    if (!transition.ok) {
      return err(`State transition failed: ${transition.error}`);
    }

    return ok(undefined);
  }

  /**
   * Transition from equipment to recruit screen
   */
  handleEquipmentContinue(): Result<void, string> {
    if (this.stateMachine.getState() !== 'equipment') {
      return err('Cannot continue - not in equipment state');
    }

    const transition = this.stateMachine.transitionTo('recruit');
    if (!transition.ok) {
      return err(`State transition failed: ${transition.error}`);
    }

    return ok(undefined);
  }

  /**
   * Save current game state
   */
  async saveGame(slot: string): Promise<Result<void, string>> {
    const snapshot: GameStateSnapshot = {
      playerTeam: this.state.playerTeam,
      inventory: this.state.inventory,
      gems: this.state.gems, // Include gems in save (Djinn system)
      activeGemState: this.state.activeGemState, // Include active gem state
      progression: this.state.progression,
      choice: {
        nextChoiceSeed: String(this.state.runSeed),
        battleIndex: this.state.battleIndex,
        lastChoices: this.state.currentChoices ?? undefined,
      },
      runSeed: this.state.runSeed,
    };

    return await this.saveSystem.save(slot, snapshot);
  }

  /**
   * Load game state from save
   */
  async loadGame(slot: string): Promise<Result<void, string>> {
    const loadResult = await this.saveSystem.load(slot);
    
    if (!loadResult.ok) {
      return err(loadResult.error);
    }

    const saveData = loadResult.value;

    // Restore state
    this.state = {
      runSeed: saveData.runSeed,
      battleIndex: saveData.choice.battleIndex,
      playerTeam: [...saveData.playerTeam],
      inventory: [...saveData.inventory],
      gems: [...(saveData.gems || [])], // Add gems from save, default to empty array
      activeGemState: saveData.activeGemState || {
        activeGem: null,
        isActivated: false,
      }, // Restore active gem state or default to null
      progression: saveData.progression,
      currentChoices: saveData.choice.lastChoices ? [...saveData.choice.lastChoices] : null,
      selectedOpponentId: null,
      lastBattleResult: null,
    };

    // Restore RNG
    this.rootRng = makeRng(saveData.runSeed);

    // Reset state machine and transition to opponent_select
    this.stateMachine.reset();
    let transition = this.stateMachine.transitionTo('starter_select');
    if (!transition.ok) {
      return err(`Failed to restore state: ${transition.error}`);
    }
    
    transition = this.stateMachine.transitionTo('opponent_select');
    if (!transition.ok) {
      return err(`Failed to restore state: ${transition.error}`);
    }

    return ok(undefined);
  }

  /**
   * Get current game state (read-only)
   */
  getState(): Readonly<GameControllerState> {
    return { ...this.state };
  }

  /**
   * Get current state machine state
   */
  getCurrentState(): GameState {
    return this.stateMachine.getState();
  }

  /**
   * Get state machine (for debugging/testing)
   */
  getStateMachine(): GameStateMachine {
    return this.stateMachine;
  }

  /**
   * Get save system for UI access to save/load operations
   */
  getSaveSystem(): SaveSystem {
    return this.saveSystem;
  }

  /**
   * Get current inventory (read-only)
   */
  getInventory(): readonly Item[] {
    return this.state.inventory;
  }

  /**
   * Get gem inventory (read-only)
   */
  getGems(): readonly Gem[] {
    return [...this.state.gems]; // Return a copy to prevent external modification
  }

  /**
   * Add gem to inventory (after selection)
   */
  addGem(gem: Gem): void {
    this.state.gems = [...this.state.gems, gem];
  }

  /**
   * Get consumable items from inventory
   */
  getConsumables(): readonly Item[] {
    return this.state.inventory.filter(item => item.type === 'consumable');
  }

  /**
   * Get current player team
   * Used by BattleScreen to look up abilities from equipped gems
   */
  getTeam(): readonly PlayerUnit[] {
    return this.state.playerTeam;
  }

  /**
   * Add items to inventory (from battle rewards)
   */
  addItems(items: readonly Item[]): void {
    this.state.inventory = [...this.state.inventory, ...items];
  }

  /**
   * Remove item from inventory (after use in battle)
   * Returns error if item not found
   */
  removeItem(itemId: string): Result<void, string> {
    const itemIndex = this.state.inventory.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return err(`Item ${itemId} not found in inventory`);
    }

    // Remove first occurrence of item
    this.state.inventory = [
      ...this.state.inventory.slice(0, itemIndex),
      ...this.state.inventory.slice(itemIndex + 1),
    ];

    return ok(undefined);
  }

  /**
   * Get RNG instance for systems that need randomness
   */
  get rng(): IRng {
    return this.rootRng;
  }

  // ============================================
  // Active Gem System (Elemental Alignment)
  // ============================================

  /**
   * Set the active elemental gem (selected after team building)
   * @param gem - The gem to activate for this run
   * @returns Success or error if gem is null
   */
  setActiveGem(gem: ElementalGem): Result<void, string> {
    if (!gem) {
      return err('Cannot set null gem as active');
    }

    this.state.activeGemState = {
      activeGem: gem,
      isActivated: false, // Reset activation status
    };

    return ok(undefined);
  }

  /**
   * Get current active gem state
   * @returns Current gem state (read-only)
   */
  getGemState(): Readonly<ActiveGemState> {
    return this.state.activeGemState;
  }

  /**
   * Activate the current gem mid-battle (removes bonuses but keeps spells)
   * @returns Success or error if no gem active or already activated
   */
  activateGem(): Result<void, string> {
    const activeGem = this.state.activeGemState.activeGem;
    
    if (!activeGem) {
      return err('No active gem to activate');
    }

    if (this.state.activeGemState.isActivated) {
      return err('Gem already activated this battle');
    }

    this.state.activeGemState = {
      ...this.state.activeGemState,
      isActivated: true,
    };

    return ok(undefined);
  }

  /**
   * Reset gem activation status (called at start of each battle)
   * Bonuses are restored, activation available again
   */
  resetGem(): void {
    if (this.state.activeGemState.activeGem) {
      this.state.activeGemState = {
        ...this.state.activeGemState,
        isActivated: false,
      };
    }
  }
}
