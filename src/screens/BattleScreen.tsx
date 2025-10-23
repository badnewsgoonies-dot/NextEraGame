/*
 * BattleScreen: Manual player-controlled JRPG battle
 *
 * Golden Sun-inspired turn-based combat with full player control.
 * Displays party members and enemies in diagonal 2x2 formations,
 * handles keyboard/mouse input, and produces deterministic results.
 *
 * Controls:
 *  - Arrow Up/Down: navigate action menu
 *  - Enter/Space: select action / confirm target
 *  - Arrow Left/Right (in targeting): change target
 *  - Escape: cancel targeting, or Flee from the menu
 *
 * Architecture:
 *  - Battle logic separated into useManualBattle hook
 *  - UI focuses on rendering and input handling
 *  - Reusable BattleUnitSlot component for unit display
 *  - Layout constants for easy visual tweaking
 *
 * Accessibility:
 *  - ARIA labels on all interactive elements
 *  - Live region announcements for turn changes
 *  - Keyboard navigation fully supported
 *  - Screen reader friendly status updates
 *
 * Produces a BattleResult compatible with RewardSystem:
 *  - winner: 'player' | 'enemy' | 'draw' (flee = draw)
 *  - actions: CombatAction[]
 *  - unitsDefeated: string[] (enemy unit IDs)
 *  - turnsTaken: number
 */

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { BattleUnit, BattleResult, Role, Item, CombatAction } from '../types/game.js';
import type { GameController } from '../core/GameController.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { BattleUnitSlot } from '../components/battle/BattleUnitSlot.js';
import { AttackAnimation } from '../components/battle/AttackAnimation.js';
import { HealNumber } from '../components/battle/HealNumber.js';
import { ActionMenu } from '../components/battle/ActionMenu.js';
import { PlayerStatusPanel } from '../components/battle/PlayerStatusPanel.js';
import { TurnBanner } from '../components/battle/TurnBanner.js';
import { TargetHelp } from '../components/battle/TargetHelp.js';
import { BattlefieldFloor } from '../components/battle/BattlefieldFloor.js';
import { makeRng } from '../utils/rng.js';
import { getBattleBackground, preloadCommonSprites } from '../data/spriteRegistry.js';
import { ANIMATION_TIMING } from '../components/battle/battleConstants.js';

// ============================================
// Types & Constants
// ============================================

export interface ManualBattleScreenProps {
  playerUnits: BattleUnit[];
  enemyUnits: BattleUnit[];
  onComplete: (result: BattleResult) => void;
  /** Seed for deterministic RNG (defaults to Date.now() if not provided) */
  seed?: number;
  /** Battle index for deterministic background selection */
  battleIndex?: number;
  /** Game controller for inventory access */
  gameController: GameController;
}

type Phase = 'menu' | 'targeting' | 'item-menu' | 'item-targeting' | 'animating' | 'resolving';

const ACTIONS = ['Attack', 'Defend', 'Items', 'Flee'] as const;

// ============================================
// Main Component
// ============================================

export function BattleScreen({
  playerUnits,
  enemyUnits,
  onComplete,
  seed,
  battleIndex = 0,
  gameController,
}: ManualBattleScreenProps): React.ReactElement {
  // ==================== Background & Sprites ====================

  // Golden Sun background (deterministic based on battle index)
  const background = useMemo(() => getBattleBackground(battleIndex), [battleIndex]);

  // Preload sprites on mount for smoother animations
  useEffect(() => {
    preloadCommonSprites().catch(err => console.warn('Sprite preload failed:', err));
  }, []);

  // ==================== Battle State ====================

  // Clone units to avoid mutating props
  const [players, setPlayers] = useState<BattleUnit[]>(
    playerUnits.map(u => ({ ...u, currentHp: Math.max(0, u.currentHp) }))
  );
  const [enemies, setEnemies] = useState<BattleUnit[]>(
    enemyUnits.map(u => ({ ...u, currentHp: Math.max(0, u.currentHp) }))
  );

  // Turn order and active unit tracking
  const [turnsTaken, setTurnsTaken] = useState(0);
  const [roundOrder, setRoundOrder] = useState<string[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [targetedId, setTargetedId] = useState<string | null>(null);

  // UI phase management
  const [phase, setPhase] = useState<Phase>('menu');
  const [menuIndex, setMenuIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);

  // Attack animation state (FIXED: proper typing instead of 'any')
  const [showAttackAnim, setShowAttackAnim] = useState(false);
  const [attackAnimRole, setAttackAnimRole] = useState<Role | null>(null);
  const [attackAnimPos, setAttackAnimPos] = useState({ x: 0, y: 0 });

  // Item system state
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemMenuIndex, setItemMenuIndex] = useState(0);
  const [showHealAnim, setShowHealAnim] = useState(false);
  const [healAmount, setHealAmount] = useState(0);
  const [healPos, setHealPos] = useState({ x: 0, y: 0 });

  // Battle mechanics
  const defending = useRef<Set<string>>(new Set());
  const rngRef = useRef(makeRng(seed ?? Date.now()));

  // Action log for BattleResult
  const [seq, setSeq] = useState(1);
  const [actions, setActions] = useState<BattleResult['actions']>([]);

  // Refs for position tracking (needed for attack animations)
  const enemyEls = useRef<Record<string, HTMLDivElement | null>>({});

  // Timeout tracking for cleanup (FIXED: proper cleanup on unmount)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // ==================== Derived State ====================

  const alivePlayers = useMemo(() => players.filter(u => u.currentHp > 0), [players]);
  const aliveEnemies = useMemo(() => enemies.filter(u => u.currentHp > 0), [enemies]);

  /**
   * Calculate turn order based on speed with deterministic tiebreakers
   * Priority: Speed > Player wins ties > Original index
   */
  const computeRoundOrder = useCallback((): string[] => {
    const alive = [...alivePlayers, ...aliveEnemies];
    alive.sort((a, b) => {
      if (b.speed !== a.speed) return b.speed - a.speed;
      if (a.isPlayer !== b.isPlayer) return a.isPlayer ? -1 : 1;
      return a.originalIndex - b.originalIndex;
    });
    return alive.map(u => u.id);
  }, [alivePlayers, aliveEnemies]);

  /**
   * Find a unit by ID across both teams
   */
  const findUnit = useCallback(
    (id: string): BattleUnit | undefined => {
      return players.find(u => u.id === id) ?? enemies.find(u => u.id === id);
    },
    [players, enemies]
  );

  /**
   * Check if battle is over (all players or all enemies defeated)
   */
  const isBattleOver = useMemo(() => {
    const playersDead = alivePlayers.length === 0;
    const enemiesDead = aliveEnemies.length === 0;
    return { playersDead, enemiesDead, over: playersDead || enemiesDead };
  }, [alivePlayers, aliveEnemies]);

  // ==================== Battle Actions ====================

  /**
   * Complete the battle and report results
   */
  const finishBattle = useCallback(
    (winner: 'player' | 'enemy' | 'draw') => {
      // Find defeated enemies (currentHp <= 0)
      const unitsDefeated = enemies
        .filter(e => e.currentHp <= 0)
        .map(e => e.id);

      const result: BattleResult = {
        winner,
        actions,
        unitsDefeated,
        turnsTaken,
      };
      onComplete(result);
    },
    [actions, enemies, onComplete, turnsTaken]
  );

  /**
   * Calculate damage using battle formula
   * Formula: floor(atk - def/2) + variance(-2, 2), minimum 1
   * Defend status reduces damage by 50%
   */
  const computeDamage = useCallback((attacker: BattleUnit, defender: BattleUnit): number => {
    const base = Math.floor(attacker.atk - defender.def / 2);
    const variance = rngRef.current.int(-2, 2);
    let dmg = Math.max(1, base + variance);

    // Apply defend reduction
    if (defending.current.has(defender.id)) {
      dmg = Math.floor(dmg * 0.5);
    }

    return Math.max(1, dmg);
  }, []);

  /**
   * Apply damage to a unit (mutates state)
   * Clears defend status when unit takes damage
   */
  const applyDamage = useCallback((defenderId: string, amount: number) => {
    setPlayers(prev =>
      prev.map(u => (u.id !== defenderId ? u : { ...u, currentHp: Math.max(0, u.currentHp - amount) }))
    );
    setEnemies(prev =>
      prev.map(u => (u.id !== defenderId ? u : { ...u, currentHp: Math.max(0, u.currentHp - amount) }))
    );

    // Clear defend status on hit
    if (defending.current.has(defenderId)) {
      defending.current.delete(defenderId);
    }
  }, []);

  /**
   * Log an action to the battle result
   */
  const pushAction = useCallback(
    (a: Omit<CombatAction, 'seq'>) => {
      setActions(prev => [...prev, { ...a, seq } as CombatAction]);
      setSeq(s => s + 1);
    },
    [seq]
  ) as (a: any) => void;

  /**
   * Advance to the next unit's turn
   * Handles round transitions and turn counting
   */
  const advanceTurnPointer = useCallback(() => {
    const nextIndex = roundIdx + 1;
    if (nextIndex >= roundOrder.length) {
      // New round starts
      setTurnsTaken(t => t + 1);
      const nextOrder = computeRoundOrder();
      setRoundOrder(nextOrder);
      setRoundIdx(0);
      setActiveId(nextOrder[0] ?? null);
    } else {
      // Next unit in current round
      setRoundIdx(nextIndex);
      setActiveId(roundOrder[nextIndex] ?? null);
    }
    // Reset phase to 'menu' for the next turn
    setPhase('menu');
  }, [roundIdx, roundOrder, computeRoundOrder]);

  /**
   * Get the center position of a unit's DOM element
   * Used for targeting attack animations
   */
  const getTargetCenter = useCallback((id: string) => {
    const el = enemyEls.current[id];
    if (!el || typeof window === 'undefined') {
      const fallbackX = typeof window !== 'undefined' ? window.innerWidth / 2 : 800;
      const fallbackY = typeof window !== 'undefined' ? window.innerHeight / 2 : 600;
      return { x: Math.round(fallbackX), y: Math.round(fallbackY) };
    }
    const r = el.getBoundingClientRect();
    const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    return {
      x: Math.round(r.left + r.width / 2 + scrollX),
      y: Math.round(r.top + r.height / 2 + scrollY),
    };
  }, []);

  /**
   * Register a timeout for cleanup
   */
  const registerTimeout = useCallback((timeout: NodeJS.Timeout) => {
    timeoutsRef.current.push(timeout);
  }, []);

  // ==================== Initialization ====================

  /**
   * Initialize first round on mount
   */
  useEffect(() => {
    const order = computeRoundOrder();
    setRoundOrder(order);
    setRoundIdx(0);
    setActiveId(order[0] ?? null);
    setPhase('menu');
  }, [computeRoundOrder]);

  /**
   * Cleanup all timeouts on unmount (FIXED: proper cleanup)
   */
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  // ==================== Turn Management ====================

  /**
   * Handle turn changes and enemy AI
   * Prevents duplicate handling with a tracking set
   */
  const hasHandledTurn = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!activeId) return;

    // Prevent handling the same turn multiple times
    const turnKey = `${activeId}-${roundIdx}`;
    if (hasHandledTurn.current.has(turnKey)) return;

    // Check for battle end
    if (isBattleOver.over) {
      if (isBattleOver.enemiesDead) finishBattle('player');
      else if (isBattleOver.playersDead) finishBattle('enemy');
      return;
    }

    const unit = findUnit(activeId);
    if (!unit) return;

    // Skip dead units
    if (unit.currentHp <= 0) {
      hasHandledTurn.current.add(turnKey);
      advanceTurnPointer();
      return;
    }

    // Player turn: show menu
    if (unit.isPlayer) {
      if (phase !== 'menu') {
        setMenuIndex(0);
        setPhase('menu');
      }
      hasHandledTurn.current.add(turnKey);
    }
    // Enemy turn: execute AI attack (only trigger when phase is 'menu')
    else if (phase === 'menu') {
      hasHandledTurn.current.add(turnKey);
      setPhase('animating');

      // Simple AI: target lowest HP player
      const target = [...alivePlayers].sort((a, b) => a.currentHp - b.currentHp)[0];
      if (!target) {
        finishBattle('enemy');
        return;
      }

      const dmg = computeDamage(unit, target);
      setTargetedId(target.id);

      // Show attack animation
      setAttackAnimRole(unit.role);
      setAttackAnimPos(getTargetCenter(target.id));
      setShowAttackAnim(true);

      pushAction({ type: 'attack', actorId: unit.id, targetId: target.id, damage: dmg });

      // Apply damage after delay
      const damageTimeout = setTimeout(() => {
        applyDamage(target.id, dmg);
      }, ANIMATION_TIMING.DAMAGE_APPLY_DELAY);
      registerTimeout(damageTimeout);

      // Clean up and advance turn
      const cleanupTimeout = setTimeout(() => {
        setShowAttackAnim(false);
        setTargetedId(null);
        setPhase('resolving');
        advanceTurnPointer();
      }, ANIMATION_TIMING.ATTACK_TOTAL_DURATION);
      registerTimeout(cleanupTimeout);
    }
  }, [
    activeId,
    roundIdx,
    phase,
    alivePlayers,
    advanceTurnPointer,
    applyDamage,
    computeDamage,
    findUnit,
    finishBattle,
    getTargetCenter,
    isBattleOver,
    pushAction,
    registerTimeout,
  ]);

  // ==================== Player Actions ====================

  /**
   * Handle flee action (ends battle as draw)
   */
  const confirmFlee = useCallback(() => finishBattle('draw'), [finishBattle]);

  /**
   * Handle menu action selection (Attack/Defend/Flee)
   */
  const handleConfirmAction = useCallback(() => {
    if (!activeId) return;
    const actor = findUnit(activeId);
    if (!actor || !actor.isPlayer) return;

    const label = ACTIONS[menuIndex];

    if (label === 'Attack') {
      // Enter targeting mode
      if (aliveEnemies.length === 0) return;
      setTargetIndex(0);
      setPhase('targeting');
      setTargetedId(aliveEnemies[0].id);
    } else if (label === 'Defend') {
      // Execute defend action
      defending.current.add(actor.id);
      pushAction({ type: 'defend', actorId: actor.id });
      setPhase('resolving');
      advanceTurnPointer();
    } else if (label === 'Items') {
      // Show item menu (keyboard/enter flow)
      const consumables = gameController.getConsumables();
      if (consumables.length === 0) {
        // No items - still show menu with "No items available" message
        setItemMenuIndex(0);
        setSelectedItem(null);
        setPhase('item-menu');
        return;
      }
      setItemMenuIndex(0);
      setSelectedItem(null);
      setPhase('item-menu');
    } else if (label === 'Flee') {
      // Flee from battle
      confirmFlee();
    }
  }, [activeId, aliveEnemies, advanceTurnPointer, confirmFlee, findUnit, menuIndex, pushAction]);

  /**
   * Handle mouse/touch action selection
   */
  const handleActionSelect = useCallback(
    (index: number) => {
      if (phase !== 'menu') return;
      setMenuIndex(index);

      // Immediately execute selected action
      const actionTimeout = setTimeout(() => {
        const label = ACTIONS[index];
        if (!activeId) return;
        const actor = findUnit(activeId);
        if (!actor || !actor.isPlayer) return;

        if (label === 'Attack') {
          if (aliveEnemies.length === 0) return;
          setTargetIndex(0);
          setPhase('targeting');
          setTargetedId(aliveEnemies[0].id);
        } else if (label === 'Defend') {
          defending.current.add(actor.id);
          pushAction({ type: 'defend', actorId: actor.id });
          setPhase('resolving');
          advanceTurnPointer();
        } else if (label === 'Items') {
          // Show item menu (always, even if empty - will show "No items available")
          setItemMenuIndex(0);
          setSelectedItem(null);
          setPhase('item-menu');
        } else if (label === 'Flee') {
          confirmFlee();
        }
      }, 0);
      registerTimeout(actionTimeout);
    },
    [
      activeId,
      aliveEnemies,
      advanceTurnPointer,
      confirmFlee,
      findUnit,
      gameController,
      phase,
      pushAction,
      registerTimeout,
    ]
  );

  /**
   * Confirm target selection and execute attack
   */
  const handleConfirmTarget = useCallback(() => {
    if (!activeId) return;
    const actor = findUnit(activeId);
    if (!actor || phase !== 'targeting') return;

    const target = aliveEnemies[targetIndex];
    if (!target) return;

    setPhase('animating');

    const dmg = computeDamage(actor, target);
    setTargetedId(target.id);

    // Show attack animation at target position
    setAttackAnimRole(actor.role);
    setAttackAnimPos(getTargetCenter(target.id));
    setShowAttackAnim(true);

    pushAction({ type: 'attack', actorId: actor.id, targetId: target.id, damage: dmg });

    // Apply damage after delay
    const damageTimeout = setTimeout(() => {
      applyDamage(target.id, dmg);
    }, ANIMATION_TIMING.DAMAGE_APPLY_DELAY);
    registerTimeout(damageTimeout);

    // Clean up and advance turn
    const cleanupTimeout = setTimeout(() => {
      setShowAttackAnim(false);
      setTargetedId(null);
      setPhase('resolving');
      advanceTurnPointer();
    }, ANIMATION_TIMING.ATTACK_TOTAL_DURATION);
    registerTimeout(cleanupTimeout);
  }, [
    activeId,
    advanceTurnPointer,
    aliveEnemies,
    applyDamage,
    computeDamage,
    findUnit,
    getTargetCenter,
    phase,
    pushAction,
    targetIndex,
    registerTimeout,
  ]);

  /**
   * Handle item selection from item menu
   */
  const handleItemSelect = useCallback(
    (index: number) => {
      const consumables = gameController.getConsumables();
      if (index < 0 || index >= consumables.length) return;

      const item = consumables[index];
      setSelectedItem(item);
      setItemMenuIndex(index);

      // Move to targeting phase for healing items
      // TODO: Future - different targeting for different item types (self-only, all-allies, enemies)
      if (alivePlayers.length === 0) return;
      setTargetIndex(0);
      setPhase('item-targeting');
      setTargetedId(alivePlayers[0].id);
    },
    [alivePlayers, gameController]
  );

  /**
   * Confirm item usage on target
   */
  const handleConfirmItemUse = useCallback(() => {
    if (!activeId || !selectedItem) return;
    const actor = findUnit(activeId);
    if (!actor || phase !== 'item-targeting') return;

    const target = alivePlayers[targetIndex];
    if (!target) return;

    setPhase('animating');

    // Calculate heal amount
    const hpRestore = selectedItem.stats?.hpRestore ?? 0;
    const actualHeal = Math.min(hpRestore, target.maxHp - target.currentHp);

    setTargetedId(target.id);
    setHealAmount(actualHeal);
    setHealPos(getTargetCenter(target.id));
    setShowHealAnim(true);

    // Log item usage action
    pushAction({
      type: 'item-used',
      actorId: actor.id,
      targetId: target.id,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      hpRestored: actualHeal,
    });

    // Apply healing after short delay
    const healTimeout = setTimeout(() => {
      setPlayers(prev =>
        prev.map(u =>
          u.id === target.id ? { ...u, currentHp: Math.min(u.maxHp, u.currentHp + actualHeal) } : u
        )
      );
    }, 200);
    registerTimeout(healTimeout);

    // Remove item from inventory
    const removeResult = gameController.removeItem(selectedItem.id);
    if (!removeResult.ok) {
      console.error('Failed to remove item:', removeResult.error);
    }

    // Clean up and advance turn
    const cleanupTimeout = setTimeout(() => {
      setShowHealAnim(false);
      setTargetedId(null);
      setSelectedItem(null);
      setPhase('resolving');
      advanceTurnPointer();
    }, 1000);
    registerTimeout(cleanupTimeout);
  }, [
    activeId,
    advanceTurnPointer,
    alivePlayers,
    findUnit,
    gameController,
    getTargetCenter,
    phase,
    pushAction,
    registerTimeout,
    selectedItem,
    targetIndex,
  ]);

  /**
   * Cancel item menu and return to main menu
   */
  const handleCancelItemMenu = useCallback(() => {
    setSelectedItem(null);
    setPhase('menu');
  }, []);

  // ==================== Keyboard Input ====================

  const keyboardEnabled = phase === 'menu' || phase === 'targeting' || phase === 'item-menu' || phase === 'item-targeting';

  // Get consumables fresh each time to ensure inventory changes are reflected
  // Note: gameController state is mutable, so useMemo wouldn't catch changes
  const consumables = gameController.getConsumables();

  useKeyboard({
    enabled: keyboardEnabled,
    onUp: () => {
      if (phase === 'menu') {
        setMenuIndex(i => (i - 1 + ACTIONS.length) % ACTIONS.length);
      } else if (phase === 'item-menu') {
        setItemMenuIndex(i => (i - 1 + Math.max(1, consumables.length)) % Math.max(1, consumables.length));
      }
    },
    onDown: () => {
      if (phase === 'menu') {
        setMenuIndex(i => (i + 1) % ACTIONS.length);
      } else if (phase === 'item-menu') {
        setItemMenuIndex(i => (i + 1) % Math.max(1, consumables.length));
      }
    },
    onLeft: () => {
      if (phase === 'targeting') {
        setTargetIndex(i => {
          const next = (i - 1 + aliveEnemies.length) % Math.max(1, aliveEnemies.length);
          setTargetedId(aliveEnemies[next]?.id ?? null);
          return next;
        });
      } else if (phase === 'item-targeting') {
        setTargetIndex(i => {
          const next = (i - 1 + alivePlayers.length) % Math.max(1, alivePlayers.length);
          setTargetedId(alivePlayers[next]?.id ?? null);
          return next;
        });
      }
    },
    onRight: () => {
      if (phase === 'targeting') {
        setTargetIndex(i => {
          const next = (i + 1) % Math.max(1, aliveEnemies.length);
          setTargetedId(aliveEnemies[next]?.id ?? null);
          return next;
        });
      } else if (phase === 'item-targeting') {
        setTargetIndex(i => {
          const next = (i + 1) % Math.max(1, alivePlayers.length);
          setTargetedId(alivePlayers[next]?.id ?? null);
          return next;
        });
      }
    },
    onEnter: () => {
      if (phase === 'menu') handleConfirmAction();
      else if (phase === 'targeting') handleConfirmTarget();
      else if (phase === 'item-menu') handleItemSelect(itemMenuIndex);
      else if (phase === 'item-targeting') handleConfirmItemUse();
    },
    onSpace: () => {
      if (phase === 'menu') handleConfirmAction();
      else if (phase === 'targeting') handleConfirmTarget();
      else if (phase === 'item-menu') handleItemSelect(itemMenuIndex);
      else if (phase === 'item-targeting') handleConfirmItemUse();
    },
    onEscape: () => {
      if (phase === 'targeting') {
        setPhase('menu');
        setTargetedId(null);
      } else if (phase === 'item-targeting') {
        setPhase('item-menu');
        setTargetedId(null);
      } else if (phase === 'item-menu') {
        handleCancelItemMenu();
      } else if (phase === 'menu') {
        confirmFlee();
      }
    },
  });

  /**
   * Ensure active unit is set and check for battle end
   */
  useEffect(() => {
    if (!activeId && roundOrder.length > 0) {
      setActiveId(roundOrder[roundIdx] ?? null);
    }
    if (isBattleOver.over) {
      if (isBattleOver.enemiesDead) finishBattle('player');
      else if (isBattleOver.playersDead) finishBattle('enemy');
    }
  }, [activeId, roundIdx, roundOrder, finishBattle, isBattleOver]);

  // ==================== Render ====================

  return (
    <div
      className="min-h-screen w-full text-white relative overflow-hidden"
      role="application"
      aria-label="Battle screen"
    >
      {/* Golden Sun Battle Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${background})`,
          imageRendering: 'pixelated',
        }}
        role="presentation"
        aria-hidden="true"
      />

      {/* Gradient overlay for better HUD contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/55 z-10"
        role="presentation"
        aria-hidden="true"
      />

      {/* Perspective floor effect for depth */}
      <BattlefieldFloor />

      {/* Battlefield Container - Golden Sun Classic Layout */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* ENEMIES - Top-Right Background (2x2 formation) */}
        <div
          className="absolute top-20 md:top-24 right-12 md:right-20 lg:right-32 w-[60%] md:w-[55%] lg:w-[50%]"
          role="region"
          aria-label="Enemy units"
        >
          <div className="relative" style={{ minHeight: '320px' }}>
            {enemies.map((u, idx) => (
              <BattleUnitSlot
                key={u.id}
                ref={el => {
                  enemyEls.current[u.id] = el;
                }}
                unit={u}
                index={idx}
                isPlayer={false}
                isActive={activeId === u.id}
                isTargeted={targetedId === u.id}
                isHit={targetedId === u.id && phase === 'animating'}
              />
            ))}
          </div>
        </div>

        {/* PARTY - Bottom-Left Foreground (2x2 formation) */}
        <div
          className="absolute bottom-20 md:bottom-24 left-8 md:left-16 lg:left-24 w-[65%] md:w-[60%] lg:w-[55%]"
          role="region"
          aria-label="Player party"
        >
          <div className="relative" style={{ minHeight: '360px' }}>
            {players.map((u, idx) => (
              <BattleUnitSlot
                key={u.id}
                unit={u}
                index={idx}
                isPlayer={true}
                isActive={activeId === u.id}
                isTargeted={targetedId === u.id}
                isAttacking={activeId === u.id && phase === 'animating'}
                isHit={targetedId === u.id && phase === 'animating'}
              />
            ))}
          </div>
        </div>

        {/* Right-side HUD - Golden Sun Style */}
        <div
          className="absolute right-4 md:right-6 w-72 md:w-80 pointer-events-auto z-30"
          style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
          role="region"
          aria-label="Battle actions and status"
        >
          <PlayerStatusPanel
            unit={findUnit(activeId ?? '') ?? alivePlayers[0] ?? players[0]}
            phase={phase}
            defending={defending.current.has(activeId ?? '')}
          />
          <div className="mt-3">
            {/* Main action menu or item submenu */}
            {phase === 'item-menu' ? (
              <>
                <ActionMenu
                  items={consumables.length > 0 ? consumables.map(item => {
                    const hpRestore = item.stats?.hpRestore ?? 0;
                    return `${item.name} (+${hpRestore} HP)`;
                  }) : ['No items available']}
                  selectedIndex={consumables.length > 0 ? itemMenuIndex : 0}
                  disabled={consumables.length === 0}
                  title="Items"
                  onSelect={consumables.length > 0 ? handleItemSelect : undefined}
                />
                <div className="mt-2 text-center text-sm text-gray-400">
                  Press Escape to cancel
                </div>
              </>
            ) : (
              <>
                <ActionMenu
                  items={ACTIONS as unknown as string[]}
                  selectedIndex={menuIndex}
                  disabled={phase !== 'menu'}
                  title={phase === 'targeting' ? 'Choose Target' : phase === 'item-targeting' ? 'Choose Ally' : 'Actions'}
                  onSelect={handleActionSelect}
                />
                {phase === 'targeting' && <TargetHelp />}
                {phase === 'item-targeting' && (
                  <div className="mt-2 text-center text-sm text-yellow-300">
                    ← → to select ally, Enter to confirm
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Top-Left Turn Banner */}
        <div className="absolute top-6 left-4 md:left-8 pointer-events-auto">
          <TurnBanner turn={turnsTaken + 1} />
        </div>
      </div>

      {/* Attack animation overlay */}
      {showAttackAnim && attackAnimRole && (
        <AttackAnimation
          attackerRole={attackAnimRole}
          targetPosition={attackAnimPos}
          onComplete={() => setShowAttackAnim(false)}
          duration={ANIMATION_TIMING.ATTACK_EFFECT_DURATION}
        />
      )}

      {/* Heal animation overlay */}
      {showHealAnim && (
        <HealNumber
          amount={healAmount}
          x={healPos.x}
          y={healPos.y}
          onComplete={() => setShowHealAnim(false)}
        />
      )}

      {/* Live region for screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {activeId && findUnit(activeId) && `${findUnit(activeId)!.name}'s turn`}
        {phase === 'targeting' && ' - Choose a target'}
        {phase === 'item-menu' && ' - Select an item'}
        {phase === 'item-targeting' && ' - Choose an ally to heal'}
      </div>
    </div>
  );
}

export default BattleScreen;
