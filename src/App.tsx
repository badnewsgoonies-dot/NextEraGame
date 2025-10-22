/*
 * App: Main application component
 * 
 * Full game loop with all screens:
 * - Menu → StarterSelect → OpponentSelect → Battle → Rewards → Recruit → (loop)
 * - Settings screen accessible from menu
 * - Full integration with GameController, RewardSystem, TeamManager
 */

import React, { useState, useEffect } from 'react';
import { ConsoleLogger } from './systems/Logger.js';
import { GameController } from './core/GameController.js';
import { RewardSystem } from './systems/RewardSystem.js';
import { TeamManager } from './systems/TeamManager.js';
import { SettingsManager } from './systems/SettingsManager.js';
import { MainMenuScreen } from './screens/MainMenuScreen.js';
import { StarterSelectScreen } from './screens/StarterSelectScreen.js';
import { OpponentSelectScreen } from './screens/OpponentSelectScreen.js';
import { BattleScreen } from './screens/BattleScreen.js';
import { RewardsScreen } from './screens/RewardsScreen.js';
import { RecruitScreen } from './screens/RecruitScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';
import { makeRng } from './utils/rng.js';
import type { OpponentPreview, BattleResult, BattleUnit, BattleReward, PlayerUnit } from './types/game.js';
import { LocalStorageSaveStore } from './systems/SaveStore.js';

type AppScreen = 
  | 'menu'
  | 'starter_select'
  | 'opponent_select'
  | 'battle'
  | 'rewards'
  | 'recruit'
  | 'defeat'
  | 'settings';

export function App(): React.ReactElement {
  const [logger] = useState(() => new ConsoleLogger('info'));
  const [controller] = useState(() => {
    const gameController = new GameController(logger);
    // Use LocalStorage for browser persistence
    gameController.getSaveSystem().setStore(new LocalStorageSaveStore());
    return gameController;
  });
  const [rewardSystem] = useState(() => new RewardSystem(logger));
  const [teamManager] = useState(() => new TeamManager());
  const [settingsManager] = useState(() => new SettingsManager());

  const [screen, setScreen] = useState<AppScreen>('menu');
  const [playerTeam, setPlayerTeam] = useState<PlayerUnit[]>([]);
  const [previews, setPreviews] = useState<readonly OpponentPreview[]>([]);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [rewards, setRewards] = useState<BattleReward | null>(null);
  const [playerUnits, setPlayerUnits] = useState<BattleUnit[]>([]);
  const [enemyUnits, setEnemyUnits] = useState<BattleUnit[]>([]);
  const [hasSaves, setHasSaves] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing saves on mount and after saves
  const checkSaves = async () => {
    try {
      const result = await controller.getSaveSystem().hasSaves();
      if (result.ok) {
        setHasSaves(result.value);
      }
    } catch (error) {
      logger.warn('Failed to check for saves:', error);
    }
  };

  useEffect(() => {
    checkSaves().finally(() => setIsLoading(false));
  }, [controller, logger]);

  // Menu handlers
  const handleNewGame = () => {
    // Reset all transient state from previous runs
    setPreviews([]);
    setBattleResult(null);
    setRewards(null);
    setPlayerUnits([]);
    setEnemyUnits([]);
    setPlayerTeam([]);
    setScreen('starter_select');
  };

  const handleContinue = async () => {
    try {
      // Get list of save slots
      const slotsResult = await controller.getSaveSystem().listSlots();
      if (!slotsResult.ok) {
        logger.error('Failed to list save slots:', slotsResult.error);
        return;
      }

      const slots = slotsResult.value;
      if (slots.length === 0) {
        logger.warn('No saves found');
        return;
      }

      // Load the most recent save (by modified date)
      const mostRecentSlot = slots.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())[0];

      const loadResult = await controller.loadGame(mostRecentSlot.slot);
      if (!loadResult.ok) {
        logger.error('Failed to load save:', loadResult.error);
        return;
      }

      // Restore UI state from loaded game
      const state = controller.getState();
      setPlayerTeam(state.playerTeam);

      // Generate opponent choices for current state
      const choicesResult = controller.generateOpponentChoices();
      if (choicesResult.ok) {
        setPreviews(choicesResult.value);
        setScreen('opponent_select');
      } else {
        logger.error('Failed to generate choices after load:', choicesResult.error);
        // Fall back to menu if we can't generate choices
        setScreen('menu');
      }
    } catch (error) {
      logger.error('Continue game failed:', error);
    }
  };

  const handleLoadGame = async () => {
    try {
      // Get list of save slots
      const slotsResult = await controller.getSaveSystem().listSlots();
      if (!slotsResult.ok) {
        logger.error('Failed to list save slots:', slotsResult.error);
        return;
      }

      const slots = slotsResult.value;
      if (slots.length === 0) {
        logger.warn('No saves found');
        return;
      }

      // Load the most recent save (loads most recently modified)
      const mostRecentSlot = slots.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())[0];

      const loadResult = await controller.loadGame(mostRecentSlot.slot);
      if (!loadResult.ok) {
        logger.error('Failed to load save:', loadResult.error);
        return;
      }

      // Restore UI state from loaded game
      const state = controller.getState();
      setPlayerTeam(state.playerTeam);

      // Generate opponent choices for current state
      const choicesResult = controller.generateOpponentChoices();
      if (choicesResult.ok) {
        setPreviews(choicesResult.value);
        setScreen('opponent_select');
      } else {
        logger.error('Failed to generate choices after load:', choicesResult.error);
        setScreen('menu');
      }
    } catch (error) {
      logger.error('Load game failed:', error);
    }
  };

  const handleOpenSettings = () => {
    setScreen('settings');
  };

  const handleExit = () => {
    // In a real application, this would close the window or return to launcher
    // For web deployment, we could navigate to the home page or show a confirmation
    if (confirm('Are you sure you want to exit the game?')) {
      // Could navigate to home page or close tab
      window.close();
    }
  };

  // Starter selection
  const handleStarterSelected = (starters: PlayerUnit[]) => {
    setPlayerTeam(starters);
    
    const initResult = controller.startRun(starters, Date.now());
    if (initResult.ok) {
      const choicesResult = controller.generateOpponentChoices();
      if (choicesResult.ok) {
        setPreviews(choicesResult.value);
        setScreen('opponent_select');
      }
    }
  };

  const handleStarterCancel = () => {
    setScreen('menu');
  };

  // Opponent selection
  const handleSelectOpponent = (opponentId: string) => {
    const selectResult = controller.selectOpponent(opponentId);
    if (!selectResult.ok) {
      logger.error('Failed to select opponent:', selectResult.error);
      return;
    }

    const startResult = controller.startBattle();
    if (!startResult.ok) {
      logger.error('Failed to start battle:', startResult.error);
      return;
    }

    // NO executeBattle call - manual battle screen handles combat
    const selectedPreview = previews.find(p => p.spec.id === opponentId);
    if (selectedPreview) {
      const currentTeam = playerTeam;
      
      const playerBattleUnits: BattleUnit[] = currentTeam.map((unit, index) => ({
        id: unit.id,
        name: unit.name,
        role: unit.role,
        tags: unit.tags,
        currentHp: unit.hp,
        maxHp: unit.maxHp,
        atk: unit.atk,
        def: unit.def,
        speed: unit.speed,
        isPlayer: true,
        originalIndex: index,
      }));

      const enemyBattleUnits: BattleUnit[] = selectedPreview.spec.units.map((template, index) => ({
        id: `${template.id}_${index}`, // Make unique when same template used multiple times
        name: template.name,
        role: template.role,
        tags: template.tags,
        currentHp: template.baseStats.hp,
        maxHp: template.baseStats.hp,
        atk: template.baseStats.atk,
        def: template.baseStats.def,
        speed: template.baseStats.speed,
        isPlayer: false,
        originalIndex: index,
      }));

      setPlayerUnits(playerBattleUnits);
      setEnemyUnits(enemyBattleUnits);
      
      // Rewards will be generated AFTER manual battle completes (in handleBattleComplete)
      setScreen('battle');
    }
  };

  // Battle handlers - NOW accepts result from manual battle screen
  const handleBattleComplete = async (result: BattleResult) => {
    setBattleResult(result);

    // Auto-save after battle completion
    try {
      const saveResult = await controller.saveGame('autosave');
      if (saveResult.ok) {
        await checkSaves(); // Refresh save detection
        logger.info('Auto-saved after battle');
      } else {
        logger.warn('Auto-save failed:', saveResult.error);
      }
    } catch (error) {
      logger.warn('Auto-save error:', error);
    }

    // Generate rewards if player won
    if (result.winner === 'player') {
      const selectedPreview = previews.find(p => p.spec.id === controller.getState().selectedOpponentId);
      if (selectedPreview) {
        const rewardRng = makeRng(controller.getState().runSeed).fork('rewards').fork(String(controller.getState().battleIndex));
        const generatedRewards = rewardSystem.generateRewards(
          selectedPreview.spec,
          result,
          rewardRng
        );
        setRewards(generatedRewards);
      }
    }

    if (result.winner === 'player') {
      // Transition state machine first
      controller.getStateMachine().transitionTo('rewards');
      setScreen('rewards');
    } else if (result.winner === 'enemy') {
      controller.getStateMachine().transitionTo('defeat');
      setScreen('defeat');
    } else {
      // Draw - back to menu
      controller.getStateMachine().transitionTo('menu');
      setScreen('menu');
    }
  };

  // Rewards handlers
  const handleRewardsContinue = () => {
    // Transition FSM from rewards → recruit
    const transition = controller.getStateMachine().transitionTo('recruit');
    if (!transition.ok) {
      logger.error('Failed to transition to recruit state:', transition.error);
      return;
    }
    setScreen('recruit');
  };

  // Recruit handlers
  const handleRecruit = async (enemyId: string, replaceUnitId?: string) => {
    if (!rewards) return;

    const enemyTemplate = rewards.defeatedEnemies.find(e => e.id === enemyId);
    if (!enemyTemplate) {
      logger.error('Enemy not found for recruitment:', { enemyId });
      return;
    }

    const recruitResult = teamManager.recruitUnit(playerTeam, enemyTemplate, replaceUnitId);
    if (recruitResult.ok) {
      setPlayerTeam(recruitResult.value as PlayerUnit[]);

      // Auto-save after recruitment
      try {
        const saveResult = await controller.saveGame('autosave');
        if (saveResult.ok) {
          await checkSaves(); // Refresh save detection
          logger.info('Auto-saved after recruitment');
        } else {
          logger.warn('Auto-save failed after recruitment:', saveResult.error);
        }
      } catch (error) {
        logger.warn('Auto-save error after recruitment:', error);
      }

      // Advance to next battle (transitions FSM to opponent_select)
      const advanceResult = controller.advanceToNextBattle();
      if (!advanceResult.ok) {
        logger.error('Failed to advance to next battle:', advanceResult.error);
        return;
      }

      const choicesResult = controller.generateOpponentChoices();
      if (choicesResult.ok) {
        setPreviews(choicesResult.value);
        setScreen('opponent_select');
      }
    } else {
      logger.error('Recruitment failed:', recruitResult.error);
    }
  };

  const handleSkipRecruit = async () => {
    // Auto-save after skipping recruitment
    try {
      const saveResult = await controller.saveGame('autosave');
      if (saveResult.ok) {
        await checkSaves(); // Refresh save detection
        logger.info('Auto-saved after skipping recruitment');
      } else {
        logger.warn('Auto-save failed after skipping recruitment:', saveResult.error);
      }
    } catch (error) {
      logger.warn('Auto-save error after skipping recruitment:', error);
    }

    // Advance to next battle (transitions FSM to opponent_select)
    const advanceResult = controller.advanceToNextBattle();
    if (!advanceResult.ok) {
      logger.error('Failed to advance to next battle after skipping recruitment:', advanceResult.error);
      return;
    }

    const choicesResult = controller.generateOpponentChoices();
    if (choicesResult.ok) {
      setPreviews(choicesResult.value);
      setScreen('opponent_select');
    }
  };

  // Defeat handlers
  const handleDefeatRestart = () => {
    setScreen('menu');
  };

  // Settings handlers
  const handleSettingsBack = () => {
    setScreen('menu');
  };

  // Show loading screen while checking for saves
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Render appropriate screen
  switch (screen) {
    case 'menu':
      return (
        <MainMenuScreen
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          onLoadGame={handleLoadGame}
          onSettings={handleOpenSettings}
          onExit={handleExit}
          hasSaves={hasSaves}
        />
      );

    case 'starter_select':
      return (
        <StarterSelectScreen
          onSelect={handleStarterSelected}
          onCancel={handleStarterCancel}
        />
      );

    case 'opponent_select':
      return (
        <OpponentSelectScreen
          previews={previews}
          battleIndex={controller.getState().battleIndex}
          onSelect={handleSelectOpponent}
          onCancel={() => {
            // Return to menu (note: could add controller.abortRun() if needed)
            setScreen('menu');
          }}
        />
      );

    case 'battle':
      if (playerUnits.length === 0 || enemyUnits.length === 0) {
        return <div>Loading battle...</div>;
      }
      return (
        <BattleScreen
          playerUnits={playerUnits}
          enemyUnits={enemyUnits}
          onComplete={handleBattleComplete}
          battleIndex={controller.getState().battleIndex}
        />
      );

    case 'rewards':
      if (!rewards) {
        return <div>Loading rewards...</div>;
      }
      return (
        <RewardsScreen
          rewards={rewards}
          onContinue={handleRewardsContinue}
        />
      );

    case 'recruit':
      if (!rewards) {
        return <div>Loading recruitment...</div>;
      }
      return (
        <RecruitScreen
          defeatedEnemies={rewards.defeatedEnemies}
          currentTeam={playerTeam}
          onRecruit={handleRecruit}
          onSkip={handleSkipRecruit}
        />
      );

    case 'defeat':
      return (
        <div className="min-h-screen bg-gradient-to-b from-red-800 to-red-900 flex items-center justify-center">
          <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl">
            <div className="text-7xl mb-4">💀</div>
            <h1 className="text-5xl font-bold text-red-500 mb-4">Defeat</h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
              Your party was defeated...
            </p>
            {battleResult && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Survived {battleResult.turnsTaken} turns
              </p>
            )}
            <button
              onClick={handleDefeatRestart}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg"
            >
              Return to Menu
            </button>
          </div>
        </div>
      );

    case 'settings':
      return (
        <SettingsScreen
          onBack={handleSettingsBack}
          settingsManager={settingsManager}
        />
      );

    default:
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      );
  }
}
