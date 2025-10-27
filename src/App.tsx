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
import { RosterManager } from './systems/RosterManager.js';
import { SettingsManager } from './systems/SettingsManager.js';
import { equipItem, unequipItem } from './systems/EquipmentSystem.js';
import { restoreAllMp } from './systems/AbilitySystem.js';
import { initializeUnitSpells } from './systems/ElementSystem.js';
import { MainMenuScreen } from './screens/MainMenuScreen.js';
import { StarterSelectScreen } from './screens/StarterSelectScreen.js';
import { OpponentSelectScreen } from './screens/OpponentSelectScreen.js';
import { BattleScreen } from './screens/BattleScreen.js';
import { RewardsScreen } from './screens/RewardsScreen.js';
import { GemSelectScreen } from './screens/GemSelectScreen.js';
import { EquipmentScreen } from './screens/EquipmentScreen.js';
import { RecruitScreen } from './screens/RecruitScreen.js';
import { RosterManagementScreen } from './screens/RosterManagementScreen.js';
import { InventoryScreen } from './screens/InventoryScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';
import { LoadGameModal } from './components/LoadGameModal.js';
import { GameContainer } from './components/GameContainer.js';
import { ScreenTransition } from './components/ScreenTransition.js';
import { makeRng } from './utils/rng.js';
import type { OpponentPreview, BattleResult, BattleUnit, BattleReward, PlayerUnit, InventoryData, RosterData, GemChoice } from './types/game.js';
import { useDevShortcuts, DevShortcutsBadge } from './hooks/useDevShortcuts.js';

type AppScreen =
  | 'menu'
  | 'starter_select'
  | 'global_gem_select' // NEW: Gem selection at game start
  | 'opponent_select'
  | 'battle'
  | 'rewards'
  | 'gem_select' // OLD: Gem selection from rewards (deprecated)
  | 'equipment'
  | 'recruit'
  | 'roster_management'
  | 'defeat'
  | 'settings'
  | 'inventory';

export function App(): React.ReactElement {
  const [logger] = useState(() => new ConsoleLogger('info'));
  const [controller] = useState(() => new GameController(logger));
  const [rewardSystem] = useState(() => new RewardSystem(logger));
  const [teamManager] = useState(() => new TeamManager());
  const [rosterManager] = useState(() => new RosterManager());
  const [settingsManager] = useState(() => new SettingsManager());

  const [screen, setScreen] = useState<AppScreen>('menu');
  const [playerTeam, setPlayerTeam] = useState<PlayerUnit[]>([]);
  const [roster, setRoster] = useState<RosterData>({
    activeParty: [],
    bench: [],
  });
  const [inventory, setInventory] = useState<InventoryData>({
    items: [],
    equippedItems: new Map(),
    unequippedItems: [],
    maxItemSlots: 50,
    maxEquipmentSlots: 50
  });
  const [previews, setPreviews] = useState<readonly OpponentPreview[]>([]);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [rewards, setRewards] = useState<BattleReward | null>(null);
  const [playerUnits, setPlayerUnits] = useState<BattleUnit[]>([]);
  const [enemyUnits, setEnemyUnits] = useState<BattleUnit[]>([]);

  // Save/Load state
  const [hasSaves, setHasSaves] = useState(false);
  const [saveSlots, setSaveSlots] = useState<Array<{slot: string; modified: string; size: number}>>([]);
  const [showLoadModal, setShowLoadModal] = useState(false);

  // Check for existing saves on mount
  useEffect(() => {
    checkForSaves();
  }, []);

  // Dev shortcuts for rapid testing (Shift+D for help)
  useDevShortcuts({
    // Shift+S: Show current state
    onShowState: () => {
      console.log('[DEV STATE]', {
        screen,
        teamSize: playerTeam.length,
        battleIndex: controller.getState().battleIndex,
        hasRewards: !!rewards,
        roster: { active: roster.activeParty.length, bench: roster.bench.length },
      });
    },
    
    // Shift+W: Win battle instantly
    onWinBattle: () => {
      if (screen === 'battle') {
        console.log('[DEV] Winning battle instantly!');
        const fakeResult: BattleResult = {
          winner: 'player',
          actions: [],
          unitsDefeated: enemyUnits.map(e => e.id),
          turnsTaken: 1,
        };
        handleBattleComplete(fakeResult);
      } else {
        console.warn('[DEV] Not in battle - Shift+W only works during battle');
      }
    },
    
    // Shift+N: Skip to next screen
    onNextScreen: () => {
      console.log(`[DEV] Next screen from: ${screen}`);
      
      if (screen === 'rewards' && rewards) {
        if (rewards.gemChoices && rewards.gemChoices.length > 0) {
          setScreen('gem_select');
        } else {
          setScreen('equipment');
        }
      } else if (screen === 'gem_select' && rewards?.gemChoices) {
        // Auto-select first gem
        controller.addGem(rewards.gemChoices[0]);
        setScreen('equipment');
      } else if (screen === 'equipment') {
        handleEquipmentContinue();
      } else if (screen === 'recruit') {
        handleSkipRecruit();
      } else if (screen === 'roster_management') {
        handleRosterContinue();
      } else {
        console.warn(`[DEV] Cannot skip from ${screen} screen`);
      }
    },
    
    // Shift+B: Go to previous screen
    onPrevScreen: () => {
      console.log(`[DEV] Previous screen from: ${screen}`);
      
      if (screen === 'gem_select' && rewards) {
        setScreen('rewards');
      } else if (screen === 'equipment' && rewards) {
        if (rewards.gemChoices && rewards.gemChoices.length > 0) {
          setScreen('gem_select');
        } else {
          setScreen('rewards');
        }
      } else if (screen === 'recruit') {
        setScreen('equipment');
      } else {
        console.warn(`[DEV] Cannot go back from ${screen} screen`);
      }
    },
    
    // Shift+G: Add random gem (placeholder)
    onAddGem: () => {
      console.log('[DEV] Add gem requested');
      console.warn('[DEV] Gem inventory system not yet implemented - coming in future update!');
      // TODO: When inventory supports gems, add random gem here
    },
  });

  const checkForSaves = async () => {
    try {
      const result = await controller.getSaveSystem().listSlots();
      if (result.ok) {
        const slots = result.value;
        setHasSaves(slots.length > 0);
        setSaveSlots([...slots]); // Convert readonly to mutable array
      }
    } catch (error) {
      console.error('Failed to check saves:', error);
    }
  };

  // Menu handlers
  const handleNewGame = () => {
    // Reset all transient state from previous runs
    setPreviews([]);
    setBattleResult(null);
    setRewards(null);
    setPlayerUnits([]);
    setEnemyUnits([]);
    setPlayerTeam([]);
    setInventory({
      items: [],
      equippedItems: new Map(),
      unequippedItems: [],
      maxItemSlots: 50,
      maxEquipmentSlots: 50
    });
    setScreen('starter_select');
  };

  const handleContinue = async () => {
    if (saveSlots.length === 0) {
      console.warn('No saves available');
      return;
    }

    try {
      // Find most recent save
      const mostRecent = [...saveSlots].sort((a, b) =>
        new Date(b.modified).getTime() - new Date(a.modified).getTime()
      )[0];

      console.log('Loading most recent save:', mostRecent.slot);

      // Load the game
      const loadResult = await controller.loadGame(mostRecent.slot);
      if (!loadResult.ok) {
        console.error('Failed to load:', loadResult.error);
        alert(`Failed to load game: ${loadResult.error}`);
        return;
      }

      // Restore UI state from loaded game
      const gameState = controller.getState();

      // Re-initialize spells (they're not saved, derived from element + gem)
      const teamWithSpells = gameState.playerTeam.map(initializeUnitSpells);
      setPlayerTeam(teamWithSpells);

      // Navigate based on what was saved
      if (gameState.currentChoices && gameState.currentChoices.length > 0) {
        setPreviews(gameState.currentChoices);
        setScreen('opponent_select');
      } else {
        // Generate new choices if none were saved
        const choicesResult = controller.generateOpponentChoices();
        if (choicesResult.ok) {
          setPreviews(choicesResult.value);
          setScreen('opponent_select');
        }
      }
    } catch (error) {
      console.error('Failed to continue game:', error);
      alert('Failed to load game');
    }
  };

  const handleLoadGame = () => {
    setShowLoadModal(true);
  };

  const handleLoadFromSlot = async (slot: string) => {
    setShowLoadModal(false);

    try {
      console.log('Loading save from slot:', slot);

      const loadResult = await controller.loadGame(slot);
      if (!loadResult.ok) {
        console.error('Failed to load:', loadResult.error);
        alert(`Failed to load game: ${loadResult.error}`);
        return;
      }

      // Restore UI state (same as handleContinue)
      const gameState = controller.getState();

      // Re-initialize spells (they're not saved, derived from element + gem)
      const teamWithSpells = gameState.playerTeam.map(initializeUnitSpells);
      setPlayerTeam(teamWithSpells);

      if (gameState.currentChoices && gameState.currentChoices.length > 0) {
        setPreviews(gameState.currentChoices);
        setScreen('opponent_select');
      } else {
        const choicesResult = controller.generateOpponentChoices();
        if (choicesResult.ok) {
          setPreviews(choicesResult.value);
          setScreen('opponent_select');
        }
      }
    } catch (error) {
      console.error('Failed to load from slot:', error);
      alert('Failed to load game');
    }
  };

  const handleDeleteSave = async (slot: string): Promise<void> => {
    try {
      const deleteResult = await controller.getSaveSystem().deleteSave(slot);
      if (deleteResult.ok) {
        console.log('Deleted save:', slot);
        await checkForSaves(); // Refresh save list
      } else {
        throw new Error(deleteResult.error);
      }
    } catch (error) {
      console.error('Failed to delete save:', error);
      throw error; // Re-throw so modal can handle it
    }
  };

  const handleOpenSettings = () => {
    setScreen('settings');
  };

  const handleExit = () => {
    console.log('Exit game');
    // In production, this would close the window or return to launcher
  };

  // Starter selection
  const handleStarterSelected = (starters: PlayerUnit[]) => {
    setPlayerTeam(starters);

    const initResult = controller.startRun(starters, Date.now());
    if (initResult.ok) {
      // NEW: Go to global gem selection screen (once at game start)
      setScreen('global_gem_select');
    }
  };

  const handleStarterCancel = () => {
    setScreen('menu');
  };

  // Global gem selection (at game start)
  const handleGlobalGemSelect = (gemId: string) => {
    // Select gem in controller (applies bonuses and grants spells)
    const selectResult = controller.selectGlobalGem(gemId);
    if (!selectResult.ok) {
      console.error('Failed to select gem:', selectResult.error);
      return;
    }

    // Update player team with gem bonuses applied
    const updatedTeam = controller.getState().playerTeam;
    setPlayerTeam(updatedTeam);

    // Proceed to opponent selection
    const choicesResult = controller.generateOpponentChoices();
    if (choicesResult.ok) {
      setPreviews(choicesResult.value);
      setScreen('opponent_select');
    }
  };

  const handleGlobalGemCancel = () => {
    setScreen('starter_select');
  };

  // Opponent selection
  const handleSelectOpponent = (opponentId: string) => {
    const selectResult = controller.selectOpponent(opponentId);
    if (!selectResult.ok) {
      console.error('Failed to select opponent:', selectResult.error);
      return;
    }

    const startResult = controller.startBattle();
    if (!startResult.ok) {
      console.error('Failed to start battle:', startResult.error);
      return;
    }

    // NO executeBattle call - manual battle screen handles combat
    const selectedPreview = previews.find(p => p.spec.id === opponentId);
    if (selectedPreview) {
      // Restore MP to full at battle start
      const currentTeam = restoreAllMp(playerTeam);

      // Initialize spells based on element + active gem (SESSION 2)
      const teamWithSpells = currentTeam.map(initializeUnitSpells);

      // Update player team state with spells (persist for after battle)
      setPlayerTeam(teamWithSpells);

      const playerBattleUnits: BattleUnit[] = teamWithSpells.map((unit, index) => ({
        id: unit.id,
        name: unit.name,
        role: unit.role,
        tags: unit.tags,
        currentHp: unit.hp,
        maxHp: unit.maxHp,
        currentMp: unit.currentMp, // PRESERVE MP for ability system
        maxMp: 50,
        buffState: { buffs: [] },
        atk: unit.atk,
        def: unit.def,
        speed: unit.speed,
        isPlayer: true,
        originalIndex: index,
        spriteUrl: unit.spriteUrl, // PRESERVE sprite URL for recruited enemies!
        portraitUrl: unit.portraitUrl,
      }));

      const enemyBattleUnits: BattleUnit[] = selectedPreview.spec.units.map((template, index) => ({
        id: `${template.id}_${index}`, // Make unique when same template used multiple times
        name: template.name,
        role: template.role,
        tags: template.tags,
        currentHp: template.baseStats.hp,
        maxHp: template.baseStats.hp,
        currentMp: 50, // Enemies start with full MP
        maxMp: 50,
        buffState: { buffs: [] },
        atk: template.baseStats.atk,
        def: template.baseStats.def,
        speed: template.baseStats.speed,
        isPlayer: false,
        originalIndex: index,
        spriteUrl: template.spriteUrl, // PRESERVE enemy sprite URLs!
        portraitUrl: template.portraitUrl,
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

    // Generate rewards if player won
    if (result.winner === 'player') {
      const selectedPreview = previews.find(p => p.spec.id === controller.getState().selectedOpponentId);
      if (selectedPreview) {
        const rewardRng = makeRng(controller.getState().runSeed).fork('rewards').fork(String(controller.getState().battleIndex));
        
        // FIX: Get actual defeated enemy units (not just IDs)
        // The battle returns indexed IDs like "cleric_healer_0", but we have the full units
        const defeatedEnemyUnits = enemyUnits.filter(enemy => 
          result.unitsDefeated.includes(enemy.id)
        );
        
        const generatedRewards = rewardSystem.generateRewards(
          selectedPreview.spec,
          result,
          rewardRng
        );
        
        // Override defeated enemies with actual defeated units (not template matching)
        const fixedRewards = {
          ...generatedRewards,
          defeatedEnemies: defeatedEnemyUnits.map(enemy => {
            // Find the template this enemy was created from
            // Strip the "_${index}" suffix to match back to template
            const templateId = enemy.id.replace(/_\d+$/, '');
            const template = selectedPreview.spec.units.find(t => t.id === templateId);
            return template || {
              id: enemy.id,
              name: enemy.name,
              role: enemy.role,
              tags: enemy.tags,
              baseStats: {
                hp: enemy.maxHp,
                atk: enemy.atk,
                def: enemy.def,
                speed: enemy.speed,
              },
              spriteKey: `enemy-${enemy.name.toLowerCase().replace(/\s+/g, '-')}`,
            };
          }),
        };
        setRewards(fixedRewards);  // Use the fixed rewards!
      }
    }

    // Auto-save after battle (victory, defeat, or draw)
    try {
      const saveResult = await controller.saveGame('autosave');
      if (saveResult.ok) {
        console.log('Auto-saved after battle');
        await checkForSaves(); // Refresh save list
      } else {
        console.error('Auto-save failed:', saveResult.error);
      }
    } catch (error) {
      console.error('Auto-save error:', error);
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
    // Add equipment to inventory
    if (rewards?.equipment && rewards.equipment.length > 0) {
      setInventory(prev => ({
        ...prev,
        unequippedItems: [...prev.unequippedItems, ...rewards.equipment]
      }));
    }

    // Add items (consumables) to game controller inventory
    if (rewards?.items && rewards.items.length > 0) {
      controller.addItems(rewards.items);
    }

    // Check if there are gem choices
    if (rewards?.gemChoices && rewards.gemChoices.length > 0) {
      // Go to gem selection screen
      setScreen('gem_select');
    } else {
      // Skip gem selection, go directly to equipment
      const transition = controller.handleRewardsContinue();
      if (!transition.ok) {
        console.error('Failed to transition to equipment state:', transition.error);
        return;
      }
      setScreen('equipment');
    }
  };

  // Gem selection handler
  const handleGemSelect = (gem: GemChoice) => {
    // Add selected gem to controller's gem inventory
    controller.addGem(gem);
    
    // Transition FSM from rewards → equipment
    const transition = controller.handleRewardsContinue();
    if (!transition.ok) {
      console.error('Failed to transition to equipment state:', transition.error);
      return;
    }
    setScreen('equipment');
  };

  // Equipment handlers
  const handleEquip = (unitId: string, equipment: any) => {
    const result = equipItem(inventory, unitId, equipment);
    if (result.ok) {
      setInventory(result.value);
    } else {
      console.error('Failed to equip item:', result.error);
    }
  };

  const handleUnequip = (unitId: string, slot: 'weapon' | 'armor' | 'accessory') => {
    const result = unequipItem(inventory, unitId, slot);
    if (result.ok) {
      setInventory(result.value);
    } else {
      console.error('Failed to unequip item:', result.error);
    }
  };

  const handleEquipmentContinue = () => {
    // Transition FSM from equipment → recruit
    const transition = controller.handleEquipmentContinue();
    if (!transition.ok) {
      console.error('Failed to transition to recruit state:', transition.error);
      return;
    }
    
    // Auto-skip recruitment if no enemies were defeated
    if (rewards && rewards.defeatedEnemies.length === 0) {
      console.log('No enemies defeated - skipping recruitment');
      handleSkipRecruit();
      return;
    }
    
    setScreen('recruit');
  };

  // Recruit handlers
  const handleRecruit = (enemyId: string, replaceUnitId?: string) => {
    if (!rewards) return;

    const enemyTemplate = rewards.defeatedEnemies.find(e => e.id === enemyId);
    if (!enemyTemplate) {
      console.error('Enemy not found:', enemyId);
      return;
    }

    const recruitResult = teamManager.recruitUnit(playerTeam, enemyTemplate, replaceUnitId);
    if (recruitResult.ok) {
      const newTeam = recruitResult.value as PlayerUnit[];
      setPlayerTeam(newTeam);

      // Create roster from updated team
      const newRoster = rosterManager.createRosterFromTeam(newTeam);
      setRoster(newRoster);

      // Transition to roster management
      controller.getStateMachine().transitionTo('roster_management');
      setScreen('roster_management');
    } else {
      console.error('Recruitment failed:', recruitResult.error);
    }
  };

  const handleSkipRecruit = () => {
    // Create roster from current team (no recruitment)
    const newRoster = rosterManager.createRosterFromTeam(playerTeam);
    setRoster(newRoster);

    // Transition to roster management
    controller.getStateMachine().transitionTo('roster_management');
    setScreen('roster_management');
  };

  // Roster management handlers
  const handleRosterSwap = (benchUnitId: string, activeUnitId: string) => {
    const swapResult = rosterManager.swapUnits(roster, { benchUnitId, activeUnitId });
    if (swapResult.ok) {
      const newRoster = swapResult.value;
      setRoster(newRoster);
      // Sync playerTeam with active party
      setPlayerTeam(rosterManager.getActiveTeam(newRoster) as PlayerUnit[]);
    } else {
      console.error('Swap failed:', swapResult.error);
    }
  };

  const handleRosterContinue = () => {
    // Validate roster before continuing
    const validateResult = rosterManager.validateRoster(roster);
    if (!validateResult.ok) {
      console.error('Invalid roster:', validateResult.error);
      alert(`Cannot continue: ${validateResult.error}`);
      return;
    }

    // Sync playerTeam with active party
    setPlayerTeam(rosterManager.getActiveTeam(roster) as PlayerUnit[]);

    // Advance to next battle (transitions FSM to opponent_select)
    const advanceResult = controller.advanceToNextBattle();
    if (!advanceResult.ok) {
      console.error('Failed to advance to next battle:', advanceResult.error);
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

  // Render appropriate screen
  const renderScreen = () => {
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

      case 'global_gem_select':
        return (
          <GemSelectScreen
            playerUnits={playerTeam}
            onGemSelected={handleGlobalGemSelect}
            onCancel={handleGlobalGemCancel}
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
            gameController={controller}
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

      case 'gem_select':
        // DEPRECATED: Old gem selection from rewards (replaced by global gem system)
        // If gem choices are provided, skip to equipment screen
        if (rewards?.gemChoices && rewards.gemChoices.length > 0) {
          handleGemSelect(rewards.gemChoices[0]); // Auto-select first gem
          return <div>Selecting gem...</div>;
        }
        // Skip to equipment
        const transition = controller.handleRewardsContinue();
        if (transition.ok) {
          setScreen('equipment');
        }
        return <div>Loading...</div>;

      case 'equipment':
        return (
          <EquipmentScreen
            team={playerTeam}
            inventory={inventory}
            onEquip={handleEquip}
            onUnequip={handleUnequip}
            onContinue={handleEquipmentContinue}
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

      case 'roster_management':
        return (
          <RosterManagementScreen
            activeParty={roster.activeParty}
            bench={roster.bench}
            onSwap={handleRosterSwap}
            onContinue={handleRosterContinue}
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

      case 'inventory':
        return (
          <InventoryScreen
            team={playerTeam}
            inventory={inventory}
            onUpdateInventory={(inv) => {
              setInventory(inv);
            }}
            onUpdateTeam={(team) => {
              setPlayerTeam([...team]); // Convert readonly to mutable
            }}
            onClose={() => {
              setScreen('menu');
            }}
          />
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        );
    }
  };

  return (
    <GameContainer>
      <DevShortcutsBadge />
      <ScreenTransition screenKey={screen} type="fade" duration={300}>
        {renderScreen()}
      </ScreenTransition>
      {showLoadModal && (
        <LoadGameModal
          saves={saveSlots}
          onLoad={handleLoadFromSlot}
          onClose={() => setShowLoadModal(false)}
          onDelete={handleDeleteSave}
        />
      )}
    </GameContainer>
  );
}
