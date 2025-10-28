/**
 * RecruitScreen - Add to Bench Tests
 *
 * Tests for the "Add to Bench" recruitment feature
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecruitScreen } from '../../src/screens/RecruitScreen.js';
import type { EnemyUnitTemplate, PlayerUnit } from '../../src/types/game.js';

describe('RecruitScreen - Add to Bench', () => {
  const mockOnRecruit = vi.fn();
  const mockOnAddToBench = vi.fn();
  const mockOnMerge = vi.fn();
  const mockOnSkip = vi.fn();

  const createTestEnemy = (id: string, name: string): EnemyUnitTemplate => ({
    id,
    name,
    role: 'DPS',
    tags: ['Human'],
    baseStats: { hp: 50, atk: 10, def: 10, speed: 10 },
  });

  const createTestUnit = (id: string, name: string): PlayerUnit => ({
    id,
    templateId: id,
    name,
    role: 'DPS',
    tags: ['Human'],
    element: 'Mars',
    activeGemState: { activeGem: null, isActivated: false },
    learnedSpells: [],
    rank: 'C',
    baseClass: 'Warrior',
    level: 1,
    experience: 0,
    currentMp: 50,
    hp: 50,
    maxHp: 50,
    atk: 10,
    def: 10,
    speed: 10,
  });

  const createFullTeam = (): PlayerUnit[] => [
    createTestUnit('unit1', 'Unit 1'),
    createTestUnit('unit2', 'Unit 2'),
    createTestUnit('unit3', 'Unit 3'),
    createTestUnit('unit4', 'Unit 4'),
  ];

  const createBench = (count: number): PlayerUnit[] => {
    const bench: PlayerUnit[] = [];
    for (let i = 0; i < count; i++) {
      bench.push(createTestUnit(`bench${i}`, `Bench ${i}`));
    }
    return bench;
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Bench Space Detection', () => {
    it('shows bench status in header when bench has space', () => {
      const team = createFullTeam();
      const bench = createBench(1); // 1/4 bench
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByText(/Bench: 1\/4 units/i)).toBeInTheDocument();
    });

    it('shows bench full status when bench is full', () => {
      const team = createFullTeam();
      const bench = createBench(4); // 4/4 bench FULL
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByText(/Bench: 4\/4 units/i)).toBeInTheDocument();
    });

    it('shows bench empty status when bench is empty', () => {
      const team = createFullTeam();
      const bench: PlayerUnit[] = []; // 0/4 bench
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByText(/Bench: 0\/4 units/i)).toBeInTheDocument();
    });
  });

  describe('Add to Bench Modal', () => {
    it('shows "Add to Bench" modal when bench has space', () => {
      const team = createFullTeam();
      const bench = createBench(2); // 2/4 bench - has space
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      expect(screen.getByText(/Add to Bench or Replace\?/i)).toBeInTheDocument();
    });

    it('shows bench space info in modal', () => {
      const team = createFullTeam();
      const bench = createBench(1); // 1/4
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      expect(screen.getByText(/Bench has space \(1\/4\)/i)).toBeInTheDocument();
    });

    it('shows "Add to Bench" button as primary action', () => {
      const team = createFullTeam();
      const bench = createBench(1);
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      const addToBenchButton = screen.getByRole('button', { name: /add to bench/i });
      expect(addToBenchButton).toBeInTheDocument();
      expect(addToBenchButton).toHaveClass(/bg-green/);
    });

    it('shows "Replace Unit Instead" as secondary option', () => {
      const team = createFullTeam();
      const bench = createBench(1);
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      expect(screen.getByRole('button', { name: /replace unit instead/i })).toBeInTheDocument();
    });

    it('calls onAddToBench when "Add to Bench" clicked', () => {
      const team = createFullTeam();
      const bench = createBench(1);
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      const addToBenchButton = screen.getByRole('button', { name: /add to bench/i });
      fireEvent.click(addToBenchButton);

      expect(mockOnAddToBench).toHaveBeenCalledTimes(1);
      expect(mockOnAddToBench).toHaveBeenCalledWith('e1');
    });

    it('switches to replacement modal when "Replace Unit Instead" clicked', () => {
      const team = createFullTeam();
      const bench = createBench(1);
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      const replaceButton = screen.getByRole('button', { name: /replace unit instead/i });
      fireEvent.click(replaceButton);

      expect(screen.getByText(/Choose Unit to Replace/i)).toBeInTheDocument();
    });

    it('closes modal when Cancel clicked', () => {
      const team = createFullTeam();
      const bench = createBench(1);
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByText(/Add to Bench or Replace\?/i)).not.toBeInTheDocument();
    });
  });

  describe('Bench Full Behavior', () => {
    it('does NOT show Add to Bench modal when bench is full', () => {
      const team = createFullTeam();
      const bench = createBench(4); // 4/4 FULL
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // Should go directly to replacement modal
      expect(screen.queryByText(/Add to Bench or Replace\?/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Choose Unit to Replace/i)).toBeInTheDocument();
    });

    it('shows "bench full" message when bench is full', () => {
      const team = createFullTeam();
      const bench = createBench(4);
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      expect(screen.getByText(/Your roster is full.*4\/4.*Select a unit to replace/i)).toBeInTheDocument();
    });
  });

  describe('Default Bench Prop', () => {
    it('defaults to empty bench when bench prop not provided', () => {
      const team = createFullTeam();
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByText(/Bench: 0\/4 units/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles bench with 3/4 units (last slot)', () => {
      const team = createFullTeam();
      const bench = createBench(3); // 3/4 - one slot left
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onAddToBench={mockOnAddToBench}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByText(/Bench: 3\/4 units/i)).toBeInTheDocument();

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      expect(screen.getByText(/Bench has space \(3\/4\)/i)).toBeInTheDocument();
    });

    it('does not call onAddToBench when callback not provided', () => {
      const team = createFullTeam();
      const bench = createBench(1);
      const enemies = [createTestEnemy('e1', 'Skeleton')];

      render(
        <RecruitScreen
          defeatedEnemies={enemies}
          currentTeam={team}
          bench={bench}
          onRecruit={mockOnRecruit}
          onSkip={mockOnSkip}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // Should skip to replacement modal if onAddToBench not provided
      expect(screen.queryByText(/Add to Bench or Replace\?/i)).not.toBeInTheDocument();
    });
  });
});
