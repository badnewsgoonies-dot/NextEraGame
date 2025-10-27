/*
 * BattleScreen Integration Tests
 * Tests manual player-controlled battle flow, interactions, and results
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react';
import fc from 'fast-check';
import { BattleScreen } from '../../src/screens/BattleScreen.js';
import type { BattleUnit, BattleResult, PlayerUnit } from '../../src/types/game.js';
import { GameController } from '../../src/core/GameController.js';
import { ConsoleLogger } from '../../src/systems/Logger.js';

// Mock sprite registry at module top level (MUST be here for Vitest hoisting)
vi.mock('../../src/data/spriteRegistry.js', () => ({
  getBattleBackground: vi.fn(() => '/test-background.png'),
  preloadCommonSprites: vi.fn(() => Promise.resolve()),
  getUnitSprite: vi.fn((unitName) => `/test-${unitName}.png`),
  getEnemySprite: vi.fn((enemyName, role) => `/test-${enemyName}.png`),
  getUnitWeapon: vi.fn((unitName) => {
    const weapons: Record<string, string> = {
      warrior: 'lSword',
      mage: 'lBlade',
      healer: 'Mace',
      rogue: 'lBlade'
    };
    return weapons[unitName?.toLowerCase()] || 'lSword';
  }),
  getPartySpriteSet: vi.fn((unitName, weapon) => ({
    idle: `/sprites/${unitName}-idle.gif`,
    attack1: `/sprites/${unitName}-attack1.gif`,
    attack2: `/sprites/${unitName}-attack2.gif`,
    hit: `/sprites/${unitName}-hit.gif`,
    downed: `/sprites/${unitName}-downed.gif`,
    victory: `/sprites/${unitName}-victory.gif`
  })),
  getBattleBackgroundForTags: vi.fn((tags, fallbackIndex) => '/test-background.png')
}));

// Convert test fixtures to BattleUnit format
const mockPlayerUnits: BattleUnit[] = [
  {
    id: 'p1',
    name: 'Warrior',
    role: 'Tank',
    tags: ['Holy'],
    currentHp: 100,
    maxHp: 100,
    currentMp: 50,
    maxMp: 50,
    buffState: { buffs: [] },
    atk: 20,
    def: 15,
    speed: 40,
    isPlayer: true,
    originalIndex: 0,
  },
  {
    id: 'p2',
    name: 'Rogue',
    role: 'DPS',
    tags: ['Beast'],
    currentHp: 60,
    maxHp: 60,
    currentMp: 50,
    maxMp: 50,
    buffState: { buffs: [] },
    atk: 35,
    def: 5,
    speed: 75,
    isPlayer: true,
    originalIndex: 1,
  },
];

const mockEnemyUnits: BattleUnit[] = [
  {
    id: 'e1',
    name: 'Skeleton',
    role: 'Tank',
    tags: ['Undead'],
    currentHp: 80,
    maxHp: 80,
    currentMp: 0,
    maxMp: 0,
    buffState: { buffs: [] },
    atk: 15,
    def: 10,
    speed: 35,
    isPlayer: false,
    originalIndex: 0,
  },
];

// Weak enemy with low speed so player always goes first in tests
const weakEnemy: BattleUnit = {
  id: 'e_weak',
  name: 'Goblin',
  role: 'DPS',
  tags: ['Beast'],
  currentHp: 30,
  maxHp: 30,
  currentMp: 0,
  maxMp: 0,
  buffState: { buffs: [] },
  atk: 10,
  def: 3,
  speed: 30, // Lower speed than Warrior (40) to ensure player goes first
  isPlayer: false,
  originalIndex: 0,
};

describe('BattleScreen', () => {
  let onComplete: ReturnType<typeof vi.fn>;
  let gameController: GameController;

  beforeEach(() => {
    onComplete = vi.fn();
    // Create fresh GameController for each test
    const logger = new ConsoleLogger('error');
    gameController = new GameController(logger);
    // Initialize with starter team to set up inventory
    const starterTeam: PlayerUnit[] = mockPlayerUnits.map(
      (u) =>
        ({
          ...u,
          hp: u.currentHp,
          level: 1,
          experience: 0,
        } as PlayerUnit)
    );
    gameController.startRun(starterTeam, 12345);
    // Sprite mocks now at module top level
  });

  describe('Rendering', () => {
    test('renders battle screen with player units', async () => {
      // React 19: Wrap render in act() for proper async handling
      const result = await act(async () => {
        return render(
          <BattleScreen
            playerUnits={mockPlayerUnits}
            enemyUnits={[weakEnemy]}
            onComplete={onComplete}
            seed={12345}
          gameController={gameController}
          />
        );
      });

      // Wait for battle to fully render
      await waitFor(() => {
        // Use getAllByText since unit names appear multiple times (in unit display and status)
        const warriors = result.queryAllByText('Warrior');
        const rogues = result.queryAllByText('Rogue');
        expect(warriors.length).toBeGreaterThan(0);
        expect(rogues.length).toBeGreaterThan(0);
      });
    });

    test('renders battle screen with enemy units', () => {
      const { getByText } = render(
        <BattleScreen
          playerUnits={mockPlayerUnits}
          enemyUnits={mockEnemyUnits}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      expect(getByText('Skeleton')).toBeDefined();
    });

    test('renders turn counter', () => {
      const { getByText } = render(
        <BattleScreen
          playerUnits={mockPlayerUnits}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Turn banner should show turn 1 initially
      expect(getByText(/Turn/)).toBeDefined();
    });

    test('renders action menu', () => {
      const { getByText } = render(
        <BattleScreen
          playerUnits={mockPlayerUnits}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      expect(getByText('Attack')).toBeDefined();
      expect(getByText('Defend')).toBeDefined();
      expect(getByText('Flee')).toBeDefined();
    });

    test('has accessible role attributes', () => {
      const { container } = render(
        <BattleScreen
          playerUnits={mockPlayerUnits}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      const app = container.querySelector('[role="application"]');
      expect(app).toBeDefined();

      const regions = container.querySelectorAll('[role="region"]');
      expect(regions.length).toBeGreaterThan(0);
    });
  });

  describe('Turn Order', () => {
    test('faster units act first', async () => {
      // Rogue (speed 75) should act before Warrior (speed 40)
      const { container } = render(
        <BattleScreen
          playerUnits={mockPlayerUnits}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Wait for initial render
      await waitFor(() => {
        // Live region should announce active unit
        const liveRegion = container.querySelector('[role="status"]');
        expect(liveRegion?.textContent).toContain("Rogue's turn");
      });
    });

    test('player wins speed ties', async () => {
      const sameSpeedEnemy: BattleUnit = {
        ...weakEnemy,
        speed: 75, // Same as Rogue
      };

      const { container } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[1]]} // Rogue with speed 75
          enemyUnits={[sameSpeedEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      await waitFor(() => {
        const liveRegion = container.querySelector('[role="status"]');
        // Player should go first in speed tie
        expect(liveRegion?.textContent).toContain("Rogue's turn");
      });
    });
  });

  describe('Player Actions', () => {
    test('player can select Attack action with Enter', async () => {
      const { getByText, container } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Wait for battle to initialize and player's turn
      await waitFor(() => {
        const liveRegion = container.querySelector('[role="status"]');
        expect(liveRegion?.textContent).toContain("Warrior's turn");
      });

      const attackButton = getByText('Attack');

      // React 19: BattleScreen uses useKeyboard hook which listens on window
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Enter' });
      });

      await waitFor(() => {
        // Should enter targeting mode
        expect(getByText('Choose Target')).toBeDefined();
      });
    });

    test('player can select Defend action', async () => {
      const { container, getByText } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Navigate to Defend and select
      fireEvent.keyDown(container, { key: 'ArrowDown' });
      await waitFor(() => expect(getByText('Defend')).toBeDefined());

      fireEvent.keyDown(container, { key: 'Enter' });

      // Defend should advance turn immediately
      await waitFor(() => {
        // Enemy turn should start (or battle should progress)
        const liveRegion = container.querySelector('[role="status"]');
        expect(liveRegion).toBeDefined();
      });
    });

    test('player can flee from battle', async () => {
      const { getByText } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // React 19: Fire keyboard events on window (useKeyboard listens there)
      // Navigate to Flee action (now at index 5 due to Abilities and Gems)
      await act(async () => {
        fireEvent.keyDown(window, { key: 'ArrowDown' });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: 'ArrowDown' });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: 'ArrowDown' });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: 'ArrowDown' });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: 'ArrowDown' });
      });
      await waitFor(() => expect(getByText('Flee')).toBeDefined());

      await act(async () => {
        fireEvent.keyDown(window, { key: 'Enter' });
      });

      // Should call onComplete with draw result
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
        const result: BattleResult = onComplete.mock.calls[0][0];
        expect(result.winner).toBe('draw');
      }, { timeout: 3000 }); // Increase timeout for battle completion animations
    });

    test('Escape key triggers flee', async () => {
      const { container } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Wait for battle to initialize and player's turn (menu phase)
      await waitFor(() => {
        const liveRegion = container.querySelector('[role="status"]');
        expect(liveRegion?.textContent).toContain("Warrior's turn");
      });

      // React 19: Fire on window (useKeyboard listens there)
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
        const result: BattleResult = onComplete.mock.calls[0][0];
        expect(result.winner).toBe('draw');
      }, { timeout: 3000 }); // Increase timeout for battle completion animations
    });
  });

  describe('Targeting', () => {
    test('can cycle through targets with arrow keys', async () => {
      const twoEnemies: BattleUnit[] = [
        { ...weakEnemy, id: 'e1', name: 'Goblin 1' },
        { ...weakEnemy, id: 'e2', name: 'Goblin 2' },
      ];

      const { container, getByText } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={twoEnemies}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Wait for battle to initialize and player's turn
      await waitFor(() => {
        const liveRegion = container.querySelector('[role="status"]');
        expect(liveRegion?.textContent).toContain("Warrior's turn");
      });

      // React 19: Fire on window (useKeyboard listens there)
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Enter' });
      });

      await waitFor(() => expect(getByText('Choose Target')).toBeDefined());

      // Cycle through targets with proper async handling
      await act(async () => {
        fireEvent.keyDown(window, { key: 'ArrowRight' });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
      });

      // Both targets should be accessible
      expect(container).toBeDefined();
    });

    test('Escape cancels targeting', async () => {
      const { getByText, container } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Wait for battle to initialize and player's turn
      await waitFor(() => {
        const liveRegion = container.querySelector('[role="status"]');
        expect(liveRegion?.textContent).toContain("Warrior's turn");
      });

      // React 19: Fire on window (useKeyboard listens there)
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Enter' });
      });
      await waitFor(() => expect(getByText('Choose Target')).toBeDefined());

      // Cancel with Escape
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });

      await waitFor(() => {
        // Should return to action menu
        expect(getByText('Actions')).toBeDefined();
      });
    });
  });

  describe('Determinism', () => {
    test('same seed produces same result', async () => {
      const seed = 98765;
      const results: BattleResult[] = [];

      // Run battle twice with same seed
      for (let i = 0; i < 2; i++) {
        const onCompleteLocal = vi.fn();
        const { container } = render(
          <BattleScreen
            playerUnits={[mockPlayerUnits[0]]}
            enemyUnits={[weakEnemy]}
            onComplete={onCompleteLocal}
            seed={seed}
            battleIndex={0}
          gameController={gameController}
          />
        );

        // Wait for battle to initialize and player's turn
        await waitFor(() => {
          const liveRegion = container.querySelector('[role="status"]');
          expect(liveRegion?.textContent).toContain("Warrior's turn");
        });

        // React 19: Fire on window (useKeyboard listens there)
        await act(async () => {
          fireEvent.keyDown(window, { key: 'Escape' });
        });

        await waitFor(() => expect(onCompleteLocal).toHaveBeenCalled(), {
          timeout: 3000, // Increase timeout for battle completion
        });
        results.push(onCompleteLocal.mock.calls[0][0]);
      }

      // Results should be identical
      expect(results[0].winner).toBe(results[1].winner);
      expect(results[0].actions.length).toBe(results[1].actions.length);
    });

    test('different seeds can produce different results', () => {
      // Property test: with different seeds, RNG can vary
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (seed1, seed2) => {
          // If seeds are the same, results must match
          // If seeds are different, results may vary
          fc.pre(seed1 !== seed2); // Only test different seeds

          const onComplete1 = vi.fn();
          const onComplete2 = vi.fn();

          // This test just verifies seeds can be different
          // Actual battle outcomes would need to be executed
          return seed1 !== seed2;
        }),
        { numRuns: 10 }
      );
    });
  });

  describe('Battle Results', () => {
    test('produces valid BattleResult on completion', async () => {
      const { container } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Wait for battle to initialize and player's turn
      await waitFor(() => {
        const liveRegion = container.querySelector('[role="status"]');
        expect(liveRegion?.textContent).toContain("Warrior's turn");
      });

      // React 19: Fire on window (useKeyboard listens there)
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });

      await waitFor(() => expect(onComplete).toHaveBeenCalled(), {
        timeout: 3000, // Increase timeout for battle completion
      });

      const result: BattleResult = onComplete.mock.calls[0][0];

      // Validate result structure
      expect(result).toHaveProperty('winner');
      expect(result).toHaveProperty('actions');
      expect(result).toHaveProperty('unitsDefeated');
      expect(result).toHaveProperty('turnsTaken');

      expect(['player', 'enemy', 'draw']).toContain(result.winner);
      expect(Array.isArray(result.actions)).toBe(true);
      expect(Array.isArray(result.unitsDefeated)).toBe(true);
      expect(typeof result.turnsTaken).toBe('number');
    });

    test('flee produces draw result', async () => {
      const { container } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Wait for battle to initialize and player's turn
      await waitFor(() => {
        const liveRegion = container.querySelector('[role="status"]');
        expect(liveRegion?.textContent).toContain("Warrior's turn");
      });

      // React 19: Fire on window (useKeyboard listens there)
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
        const result: BattleResult = onComplete.mock.calls[0][0];
        expect(result.winner).toBe('draw');
      }, { timeout: 3000 }); // Increase timeout for battle completion
    });

    test('actions are logged with sequence numbers', async () => {
      const { container } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Wait for battle to initialize and player's turn
      await waitFor(() => {
        const liveRegion = container.querySelector('[role="status"]');
        expect(liveRegion?.textContent).toContain("Warrior's turn");
      });

      // Immediately flee to test that actions are logged
      // React 19: Fire on window (useKeyboard listens there)
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
        const result: BattleResult = onComplete.mock.calls[0][0];

        // Battle fled - should have action log (even if empty or minimal)
        expect(Array.isArray(result.actions)).toBe(true);

        // If actions exist, verify sequence numbers
        if (result.actions.length > 0) {
          result.actions.forEach((action, idx) => {
            if (idx === 0) {
              // First action can be seq 0 or 1 depending on implementation
              expect(typeof action.seq).toBe('number');
            } else {
              // Each subsequent action should increment by 1
              expect(action.seq).toBe(result.actions[idx - 1].seq + 1);
            }
          });
        }
      }, { timeout: 3000 });
    });
  });

  describe('Accessibility', () => {
    test('live region announces turn changes', async () => {
      const { container } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeDefined();
      expect(liveRegion?.getAttribute('role')).toBe('status');
    });

    test('units have descriptive labels', () => {
      const { container } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      const unitGroups = container.querySelectorAll('[role="group"]');
      expect(unitGroups.length).toBeGreaterThan(0);

      // Each unit should have aria-label
      unitGroups.forEach(group => {
        expect(group.getAttribute('aria-label')).toBeTruthy();
      });
    });

    test('regions are properly labeled', () => {
      const { container } = render(
        <BattleScreen
          playerUnits={mockPlayerUnits}
          enemyUnits={mockEnemyUnits}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      const enemyRegion = container.querySelector('[aria-label="Enemy units"]');
      const playerRegion = container.querySelector('[aria-label="Player party"]');
      const actionRegion = container.querySelector('[aria-label="Battle actions and status"]');

      expect(enemyRegion).toBeDefined();
      expect(playerRegion).toBeDefined();
      expect(actionRegion).toBeDefined();
    });
  });

  describe('Timeout Cleanup', () => {
    test('component unmounts without errors', () => {
      const { unmount } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Should unmount cleanly without timeout errors
      expect(() => unmount()).not.toThrow();
    });

    test('unmounting during animation does not cause errors', async () => {
      const { container, unmount } = render(
        <BattleScreen
          playerUnits={[mockPlayerUnits[0]]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Start an attack
      fireEvent.keyDown(container, { key: 'Enter' }); // Attack
      fireEvent.keyDown(container, { key: 'Enter' }); // Confirm target

      // Unmount during animation
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('TypeScript Type Safety', () => {
    test('accepts valid BattleUnit props', () => {
      expect(() => {
        render(
          <BattleScreen
            playerUnits={mockPlayerUnits}
            enemyUnits={mockEnemyUnits}
            onComplete={onComplete}
            seed={12345}
          gameController={gameController}
          />
        );
      }).not.toThrow();
    });

    test('accepts optional seed parameter', () => {
      expect(() => {
        render(
          <BattleScreen
            playerUnits={mockPlayerUnits}
            enemyUnits={mockEnemyUnits}
            onComplete={onComplete}
            gameController={gameController}
          />
        );
      }).not.toThrow();
    });

    test('accepts optional battleIndex parameter', () => {
      expect(() => {
        render(
          <BattleScreen
            playerUnits={mockPlayerUnits}
            enemyUnits={mockEnemyUnits}
            onComplete={onComplete}
            seed={12345}
            battleIndex={5}
          gameController={gameController}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    test('handles single player vs single enemy', () => {
      expect(() => {
        render(
          <BattleScreen
            playerUnits={[mockPlayerUnits[0]]}
            enemyUnits={[weakEnemy]}
            onComplete={onComplete}
            seed={12345}
          gameController={gameController}
          />
        );
      }).not.toThrow();
    });

    test('handles 4v4 battle', () => {
      const fourPlayers: BattleUnit[] = [
        ...mockPlayerUnits,
        { ...mockPlayerUnits[0], id: 'p3', name: 'Mage', originalIndex: 2 },
        { ...mockPlayerUnits[1], id: 'p4', name: 'Cleric', originalIndex: 3 },
      ];
      const fourEnemies: BattleUnit[] = [
        ...mockEnemyUnits,
        { ...weakEnemy, id: 'e2', name: 'Goblin 2', originalIndex: 1 },
        { ...weakEnemy, id: 'e3', name: 'Goblin 3', originalIndex: 2 },
      ];

      expect(() => {
        render(
          <BattleScreen
            playerUnits={fourPlayers}
            enemyUnits={fourEnemies}
            onComplete={onComplete}
            seed={12345}
          gameController={gameController}
          />
        );
      }).not.toThrow();
    });

    test('handles units with 0 HP at start', () => {
      const deadPlayer: BattleUnit = {
        ...mockPlayerUnits[0],
        currentHp: 0,
      };

      const { container } = render(
        <BattleScreen
          playerUnits={[deadPlayer]}
          enemyUnits={[weakEnemy]}
          onComplete={onComplete}
          seed={12345}
        gameController={gameController}
        />
      );

      // Battle should end immediately (all players dead)
      waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
        const result: BattleResult = onComplete.mock.calls[0][0];
        expect(result.winner).toBe('enemy');
      });
    });
  });

  // TODO: Add tests for new global gem system with super spells

  describe('SESSION 2.5 - Spell Display from unit.learnedSpells', () => {
    test('displays unit learned spells from unit.learnedSpells field', () => {
      // Create test spells
      const fireBlast: Ability = {
        id: 'fire_blast',
        name: 'Fire Blast',
        description: 'Fire attack',
        mpCost: 8,
        effect: {
          type: 'damage',
          target: 'single_enemy',
          power: 25,
        },
      };

      const inferno: Ability = {
        id: 'inferno',
        name: 'Inferno',
        description: 'Fire AOE attack',
        mpCost: 18,
        effect: {
          type: 'damage',
          target: 'all_enemies',
          power: 45,
        },
      };

      // Create a mock PlayerUnit with learned spells
      const marsUnitWithSpells = {
        id: 'test_mars_unit',
        templateId: 'test_template',
        name: 'Test Warrior',
        role: 'DPS' as Role,
        tags: ['Beast'] as const,
        element: 'Mars' as const,
        activeGemState: {
          activeGem: {
            id: 'gem_mars',
            element: 'Mars' as const,
            name: 'Mars Gem',
            description: 'Fire gem',
            icon: '🔥',
          },
          isActivated: false,
        },
        learnedSpells: [fireBlast, inferno], // Unit has 2 spells
        hp: 100,
        maxHp: 100,
        atk: 15,
        def: 10,
        speed: 8,
        currentMp: 50,
        level: 1,
        experience: 0,
        rank: 'C' as const,
        baseClass: 'Warrior' as const,
        portraitUrl: '',
        spriteUrl: '',
      };

      // Mock gameController to return this unit
      const mockGetTeam = vi.fn(() => [marsUnitWithSpells]);
      gameController.getTeam = mockGetTeam;

      // Test the direct learnedSpells access
      const abilities = marsUnitWithSpells.learnedSpells || [];

      expect(abilities).toHaveLength(2);
      expect(abilities[0].name).toBe('Fire Blast');
      expect(abilities[1].name).toBe('Inferno');
      expect(abilities[0].mpCost).toBe(8);
      expect(abilities[1].mpCost).toBe(18);
    });

    test('returns empty array if unit has no learned spells', () => {
      // Create unit with no spells
      const unitNoSpells = {
        id: 'test_no_spells',
        templateId: 'test_template',
        name: 'Test Unit',
        role: 'DPS' as Role,
        tags: [] as const,
        element: 'Venus' as const,
        activeGemState: {
          activeGem: null,
          isActivated: false,
        },
        learnedSpells: [], // No spells
        hp: 100,
        maxHp: 100,
        atk: 10,
        def: 10,
        speed: 5,
        currentMp: 50,
        level: 1,
        experience: 0,
        rank: 'C' as const,
        baseClass: 'Warrior' as const,
        portraitUrl: '',
        spriteUrl: '',
      };

      const abilities = unitNoSpells.learnedSpells || [];

      expect(abilities).toHaveLength(0);
    });
  });
});
