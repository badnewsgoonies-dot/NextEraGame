/*
 * RosterManagementScreen Tests
 * Comprehensive tests for roster management UI
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RosterManagementScreen } from '../../src/screens/RosterManagementScreen.js';
import type { PlayerUnit } from '../../src/types/game.js';

describe('RosterManagementScreen', () => {
  // Test fixtures
  const createUnit = (id: string, name: string, role: 'Tank' | 'DPS' | 'Support' | 'Specialist'): PlayerUnit => ({
    id,
    name,
    role,
    tags: ['Holy'],
    hp: 100,
    maxHp: 100,
    atk: 20,
    def: 15,
    speed: 10,
    level: 1,
    experience: 0,
  });

  const mockHandlers = {
    onSwap: vi.fn(),
    onContinue: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering - Basic Layout', () => {
    test('renders header with title and instructions', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench: PlayerUnit[] = [];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Roster Management')).toBeInTheDocument();
      expect(screen.getByText(/Select one unit from Active Party and one from Bench/i)).toBeInTheDocument();
    });

    test('renders active party section with 4 slots', () => {
      const activeParty = [
        createUnit('active1', 'Active 1', 'Tank'),
        createUnit('active2', 'Active 2', 'DPS'),
      ];
      const bench: PlayerUnit[] = [];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // Should show "Active Party (Combat Team)" heading
      expect(screen.getByText(/Active Party.*Combat Team/i)).toBeInTheDocument();

      // Should show 2 filled slots and 2 empty slots
      expect(screen.getByText('Active 1')).toBeInTheDocument();
      expect(screen.getByText('Active 2')).toBeInTheDocument();
      expect(screen.getAllByText('Empty Slot')).toHaveLength(2);
    });

    test('renders bench units correctly', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench = [
        createUnit('bench1', 'Bench 1', 'DPS'),
        createUnit('bench2', 'Bench 2', 'Support'),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Bench.*Reserves/i)).toBeInTheDocument();
      expect(screen.getByText('Bench 1')).toBeInTheDocument();
      expect(screen.getByText('Bench 2')).toBeInTheDocument();
    });

    test('shows empty bench message when no bench units', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench: PlayerUnit[] = [];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('No units on bench')).toBeInTheDocument();
    });

    test('always renders continue button', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench: PlayerUnit[] = [];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Continue to Next Battle/i)).toBeInTheDocument();
    });
  });

  describe('Unit Selection', () => {
    test('clicking active unit shows selected indicator', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench = [createUnit('bench1', 'Bench 1', 'DPS')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      const activeButton = screen.getByText('Active 1').closest('button');
      expect(activeButton).toBeTruthy();

      if (activeButton) {
        fireEvent.click(activeButton);
        expect(screen.getByText('✓ Selected')).toBeInTheDocument();
      }
    });

    test('clicking bench unit shows selected indicator', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench = [createUnit('bench1', 'Bench 1', 'DPS')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      const benchButton = screen.getByText('Bench 1').closest('button');
      expect(benchButton).toBeTruthy();

      if (benchButton) {
        fireEvent.click(benchButton);
        expect(screen.getByText('✓ Selected')).toBeInTheDocument();
      }
    });

    test('clicking same unit twice deselects it', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench = [createUnit('bench1', 'Bench 1', 'DPS')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      const activeButton = screen.getByText('Active 1').closest('button');

      if (activeButton) {
        // First click - select
        fireEvent.click(activeButton);
        expect(screen.getByText('✓ Selected')).toBeInTheDocument();

        // Second click - deselect
        fireEvent.click(activeButton);
        expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();
      }
    });
  });

  describe('Swap Functionality', () => {
    test('swap button appears when both units selected', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench = [createUnit('bench1', 'Bench 1', 'DPS')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // Initially no swap button
      expect(screen.queryByText(/Swap Selected Units/i)).not.toBeInTheDocument();

      // Select active unit
      const activeButton = screen.getByText('Active 1').closest('button');
      if (activeButton) fireEvent.click(activeButton);

      // Still no swap button (need both)
      expect(screen.queryByText(/Swap Selected Units/i)).not.toBeInTheDocument();

      // Select bench unit
      const benchButton = screen.getByText('Bench 1').closest('button');
      if (benchButton) fireEvent.click(benchButton);

      // Now swap button appears
      expect(screen.getByText(/Swap Selected Units/i)).toBeInTheDocument();
    });

    test('clicking swap calls onSwap with correct unit IDs', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench = [createUnit('bench1', 'Bench 1', 'DPS')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // Select both units
      const activeButton = screen.getByText('Active 1').closest('button');
      const benchButton = screen.getByText('Bench 1').closest('button');

      if (activeButton && benchButton) {
        fireEvent.click(activeButton);
        fireEvent.click(benchButton);

        // Click swap button
        const swapButton = screen.getByText(/Swap Selected Units/i);
        fireEvent.click(swapButton);

        expect(mockHandlers.onSwap).toHaveBeenCalledWith('bench1', 'active1');
        expect(mockHandlers.onSwap).toHaveBeenCalledTimes(1);
      }
    });

    test('after swap, selections are cleared', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench = [createUnit('bench1', 'Bench 1', 'DPS')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // Select both units
      const activeButton = screen.getByText('Active 1').closest('button');
      const benchButton = screen.getByText('Bench 1').closest('button');

      if (activeButton && benchButton) {
        fireEvent.click(activeButton);
        fireEvent.click(benchButton);

        // Verify selections
        expect(screen.getAllByText('✓ Selected')).toHaveLength(2);

        // Click swap button
        const swapButton = screen.getByText(/Swap Selected Units/i);
        fireEvent.click(swapButton);

        // Selections should be cleared
        expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();
        expect(screen.queryByText(/Swap Selected Units/i)).not.toBeInTheDocument();
      }
    });
  });

  describe('Continue Button', () => {
    test('clicking continue calls onContinue', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench: PlayerUnit[] = [];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      const continueButton = screen.getByText(/Continue to Next Battle/i);
      fireEvent.click(continueButton);

      expect(mockHandlers.onContinue).toHaveBeenCalledTimes(1);
    });
  });

  describe('Unit Display', () => {
    test('displays unit stats correctly', () => {
      const unit: PlayerUnit = {
        id: 'test1',
        name: 'Test Warrior',
        role: 'Tank',
        tags: ['Holy'],
        hp: 150,
        maxHp: 200,
        atk: 25,
        def: 20,
        speed: 15,
        level: 5,
        experience: 100,
      };

      render(
        <RosterManagementScreen
          activeParty={[unit]}
          bench={[]}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Test Warrior')).toBeInTheDocument();
      expect(screen.getByText(/Tank/i)).toBeInTheDocument();
      expect(screen.getByText(/Lv 5/i)).toBeInTheDocument();
      expect(screen.getByText('150/200')).toBeInTheDocument(); // HP
      expect(screen.getByText('25')).toBeInTheDocument(); // ATK
      expect(screen.getByText('20')).toBeInTheDocument(); // DEF
      expect(screen.getByText('15')).toBeInTheDocument(); // SPD
    });

    test('shows roster counts in header', () => {
      const activeParty = [
        createUnit('active1', 'Active 1', 'Tank'),
        createUnit('active2', 'Active 2', 'DPS'),
      ];
      const bench = [
        createUnit('bench1', 'Bench 1', 'Support'),
        createUnit('bench2', 'Bench 2', 'Specialist'),
        createUnit('bench3', 'Bench 3', 'Tank'),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Active: 2\/4/i)).toBeInTheDocument();
      expect(screen.getByText(/Bench: 3/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles full active party (4 units)', () => {
      const activeParty = [
        createUnit('active1', 'Active 1', 'Tank'),
        createUnit('active2', 'Active 2', 'DPS'),
        createUnit('active3', 'Active 3', 'Support'),
        createUnit('active4', 'Active 4', 'Specialist'),
      ];
      const bench: PlayerUnit[] = [];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // All 4 slots filled, no empty slots
      expect(screen.queryByText('Empty Slot')).not.toBeInTheDocument();
      expect(screen.getByText('Active 1')).toBeInTheDocument();
      expect(screen.getByText('Active 4')).toBeInTheDocument();
    });

    test('handles empty active party', () => {
      const activeParty: PlayerUnit[] = [];
      const bench = [createUnit('bench1', 'Bench 1', 'DPS')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // All 4 slots should be empty
      expect(screen.getAllByText('Empty Slot')).toHaveLength(4);
    });

    test('handles large bench (10+ units)', () => {
      const activeParty = [createUnit('active1', 'Active 1', 'Tank')];
      const bench = Array.from({ length: 12 }, (_, i) =>
        createUnit(`bench${i}`, `Bench ${i}`, 'DPS')
      );

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // All bench units should render
      expect(screen.getByText('Bench 0')).toBeInTheDocument();
      expect(screen.getByText('Bench 11')).toBeInTheDocument();
    });
  });
});
