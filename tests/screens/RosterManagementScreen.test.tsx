/*
 * RosterManagementScreen Tests
 * Comprehensive tests for roster management UI
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RosterManagementScreen } from '../../src/screens/RosterManagementScreen.js';
import type { PlayerUnit } from '../../src/types/game.js';

describe('RosterManagementScreen', () => {
  // Test fixture helper
  const createUnit = (id: string, name: string, role: 'Tank' | 'DPS' | 'Support' | 'Specialist', level = 1): PlayerUnit => ({
    id,
    name,
    role,
    tags: ['Holy'],
    hp: 100,
    maxHp: 100,
    atk: 20,
    def: 15,
    speed: 10,
    level,
    experience: 0,
  });

  const mockHandlers = {
    onSwap: vi.fn(),
    onContinue: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering - Layout', () => {
    test('renders header with title and instructions', () => {
      render(
        <RosterManagementScreen
          activeParty={[createUnit('1', 'Unit1', 'Tank')]}
          bench={[]}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Roster Management')).toBeInTheDocument();
      expect(screen.getByText(/Select one unit from Active Party and one from Bench to swap them/)).toBeInTheDocument();
    });

    test('renders active party section with 4 slots', () => {
      const activeParty = [
        createUnit('1', 'Unit1', 'Tank'),
        createUnit('2', 'Unit2', 'DPS'),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Active Party (4 slots)')).toBeInTheDocument();
      
      // Should show 2 filled slots
      expect(screen.getByText('Unit1')).toBeInTheDocument();
      expect(screen.getByText('Unit2')).toBeInTheDocument();
      
      // Should show 2 empty slots
      const emptySlots = screen.getAllByText('Empty Slot');
      expect(emptySlots).toHaveLength(2);
    });

    test('renders bench section with unit count', () => {
      const bench = [
        createUnit('b1', 'Bench1', 'Support'),
        createUnit('b2', 'Bench2', 'Specialist'),
      ];

      render(
        <RosterManagementScreen
          activeParty={[createUnit('1', 'Unit1', 'Tank')]}
          bench={bench}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Bench (2 units)')).toBeInTheDocument();
      expect(screen.getByText('Bench1')).toBeInTheDocument();
      expect(screen.getByText('Bench2')).toBeInTheDocument();
    });

    test('shows "No units on bench" message when bench is empty', () => {
      render(
        <RosterManagementScreen
          activeParty={[createUnit('1', 'Unit1', 'Tank')]}
          bench={[]}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('No units on bench')).toBeInTheDocument();
    });

    test('always renders continue button', () => {
      render(
        <RosterManagementScreen
          activeParty={[createUnit('1', 'Unit1', 'Tank')]}
          bench={[]}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Continue to Next Battle/)).toBeInTheDocument();
    });
  });

  describe('Unit Selection - Active Party', () => {
    test('clicking active unit shows selected badge', () => {
      const activeParty = [
        createUnit('a1', 'Active1', 'Tank'),
        createUnit('a2', 'Active2', 'DPS'),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[createUnit('b1', 'Bench1', 'Support')]}
          {...mockHandlers}
        />
      );

      const activeUnit = screen.getByText('Active1').closest('button');
      expect(activeUnit).toBeInTheDocument();

      fireEvent.click(activeUnit!);

      expect(screen.getByText('✓ Selected')).toBeInTheDocument();
    });

    test('clicking same active unit twice deselects it', () => {
      const activeParty = [createUnit('a1', 'Active1', 'Tank')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[createUnit('b1', 'Bench1', 'Support')]}
          {...mockHandlers}
        />
      );

      const activeUnit = screen.getByText('Active1').closest('button');

      // First click - select
      fireEvent.click(activeUnit!);
      expect(screen.getByText('✓ Selected')).toBeInTheDocument();

      // Second click - deselect
      fireEvent.click(activeUnit!);
      expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();
    });
  });

  describe('Unit Selection - Bench', () => {
    test('clicking bench unit shows selected badge', () => {
      const bench = [
        createUnit('b1', 'Bench1', 'Support'),
        createUnit('b2', 'Bench2', 'Specialist'),
      ];

      render(
        <RosterManagementScreen
          activeParty={[createUnit('a1', 'Active1', 'Tank')]}
          bench={bench}
          {...mockHandlers}
        />
      );

      const benchUnit = screen.getByText('Bench1').closest('button');
      expect(benchUnit).toBeInTheDocument();

      fireEvent.click(benchUnit!);

      expect(screen.getByText('✓ Selected')).toBeInTheDocument();
    });

    test('clicking same bench unit twice deselects it', () => {
      const bench = [createUnit('b1', 'Bench1', 'Support')];

      render(
        <RosterManagementScreen
          activeParty={[createUnit('a1', 'Active1', 'Tank')]}
          bench={bench}
          {...mockHandlers}
        />
      );

      const benchUnit = screen.getByText('Bench1').closest('button');

      // First click - select
      fireEvent.click(benchUnit!);
      expect(screen.getByText('✓ Selected')).toBeInTheDocument();

      // Second click - deselect
      fireEvent.click(benchUnit!);
      expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();
    });
  });

  describe('Swap Functionality', () => {
    test('swap button appears when both active and bench units selected', () => {
      const activeParty = [createUnit('a1', 'Active1', 'Tank')];
      const bench = [createUnit('b1', 'Bench1', 'Support')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // Initially no swap button
      expect(screen.queryByText(/Swap Units/)).not.toBeInTheDocument();

      // Select active unit
      const activeUnit = screen.getByText('Active1').closest('button');
      fireEvent.click(activeUnit!);

      // Still no swap button (need both)
      expect(screen.queryByText(/Swap Units/)).not.toBeInTheDocument();

      // Select bench unit
      const benchUnit = screen.getByText('Bench1').closest('button');
      fireEvent.click(benchUnit!);

      // Now swap button should appear
      expect(screen.getByText(/Swap Units/)).toBeInTheDocument();
    });

    test('clicking swap button calls onSwap with correct IDs', () => {
      const activeParty = [createUnit('a1', 'Active1', 'Tank')];
      const bench = [createUnit('b1', 'Bench1', 'Support')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // Select both units
      const activeUnit = screen.getByText('Active1').closest('button');
      fireEvent.click(activeUnit!);

      const benchUnit = screen.getByText('Bench1').closest('button');
      fireEvent.click(benchUnit!);

      // Click swap
      const swapButton = screen.getByText(/Swap Units/);
      fireEvent.click(swapButton);

      expect(mockHandlers.onSwap).toHaveBeenCalledTimes(1);
      expect(mockHandlers.onSwap).toHaveBeenCalledWith('b1', 'a1');
    });

    test('after swap, selections are cleared', () => {
      const activeParty = [createUnit('a1', 'Active1', 'Tank')];
      const bench = [createUnit('b1', 'Bench1', 'Support')];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          {...mockHandlers}
        />
      );

      // Select both units
      const activeUnit = screen.getByText('Active1').closest('button');
      fireEvent.click(activeUnit!);

      const benchUnit = screen.getByText('Bench1').closest('button');
      fireEvent.click(benchUnit!);

      // Should have 2 selected badges
      const selectedBadges = screen.getAllByText('✓ Selected');
      expect(selectedBadges).toHaveLength(2);

      // Click swap
      const swapButton = screen.getByText(/Swap Units/);
      fireEvent.click(swapButton);

      // Selections should be cleared (no selected badges)
      expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();
      // Swap button should be hidden
      expect(screen.queryByText(/Swap Units/)).not.toBeInTheDocument();
    });
  });

  describe('Continue Button', () => {
    test('clicking continue button calls onContinue', () => {
      render(
        <RosterManagementScreen
          activeParty={[createUnit('a1', 'Active1', 'Tank')]}
          bench={[]}
          {...mockHandlers}
        />
      );

      const continueButton = screen.getByText(/Continue to Next Battle/);
      fireEvent.click(continueButton);

      expect(mockHandlers.onContinue).toHaveBeenCalledTimes(1);
    });
  });

  describe('Unit Display', () => {
    test('displays unit stats correctly', () => {
      const unit = createUnit('1', 'TestUnit', 'Tank', 5);
      unit.hp = 80;
      unit.maxHp = 100;
      unit.atk = 25;
      unit.def = 20;
      unit.speed = 15;

      render(
        <RosterManagementScreen
          activeParty={[unit]}
          bench={[]}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('TestUnit')).toBeInTheDocument();
      expect(screen.getByText(/Tank.*Level 5/)).toBeInTheDocument();
      expect(screen.getByText('80/100')).toBeInTheDocument(); // HP display
      expect(screen.getByText('25')).toBeInTheDocument(); // ATK
      expect(screen.getByText('20')).toBeInTheDocument(); // DEF
      expect(screen.getByText('15')).toBeInTheDocument(); // SPD
    });

    test('displays all 4 active slots even when some are empty', () => {
      const activeParty = [
        createUnit('1', 'Unit1', 'Tank'),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          {...mockHandlers}
        />
      );

      // 1 filled slot
      expect(screen.getByText('Unit1')).toBeInTheDocument();
      
      // 3 empty slots
      const emptySlots = screen.getAllByText('Empty Slot');
      expect(emptySlots).toHaveLength(3);
    });
  });
});
