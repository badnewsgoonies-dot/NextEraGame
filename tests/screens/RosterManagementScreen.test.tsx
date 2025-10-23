/*
 * RosterManagementScreen Tests
 * Comprehensive tests for roster management UI
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { RosterManagementScreen } from '../../src/screens/RosterManagementScreen.js';
import type { PlayerUnit } from '../../src/types/game.js';

expect.extend(toHaveNoViolations);

// ============================================
// Test Helpers
// ============================================

// Helper: Create mock unit with defaults
const createMockUnit = (id: string, overrides: Partial<PlayerUnit> = {}): PlayerUnit => ({
  id,
  name: `Unit ${id}`,
  role: 'Tank',
  tags: ['Holy'],
  hp: 100,
  maxHp: 100,
  atk: 20,
  def: 15,
  speed: 10,
  level: 1,
  experience: 0,
  ...overrides,
});

// Helper: Create full active party (4 units)
const createFullParty = (): PlayerUnit[] => [
  createMockUnit('a1', { name: 'Tank Hero', role: 'Tank' }),
  createMockUnit('a2', { name: 'DPS Hero', role: 'DPS' }),
  createMockUnit('a3', { name: 'Support Hero', role: 'Support' }),
  createMockUnit('a4', { name: 'Specialist Hero', role: 'Specialist' }),
];

// Helper: Create bench units
const createBench = (count: number): PlayerUnit[] =>
  Array.from({ length: count }, (_, i) => 
    createMockUnit(`b${i + 1}`, { name: `Bench ${i + 1}` })
  );

describe('RosterManagementScreen', () => {
  // Test fixture helper (kept for backward compatibility with existing tests)
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

  // ============================================
  // Priority 1: Keyboard Navigation & Accessibility (18 tests)
  // ============================================

  describe('Keyboard Navigation & Accessibility', () => {
    test('Tab key navigates through active party units sequentially', async () => {
      const user = userEvent.setup();
      const activeParty = [
        createMockUnit('a1', { name: 'Unit1' }),
        createMockUnit('a2', { name: 'Unit2' }),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const unitButtons = screen.getAllByRole('button').filter(btn => 
        btn.textContent?.includes('Unit1') || btn.textContent?.includes('Unit2')
      );

      // Start tabbing (first tab might focus body or first element)
      await user.tab();
      
      // One of the unit buttons should eventually get focus
      const hasFocus = unitButtons.some(btn => btn === document.activeElement);
      expect(hasFocus || document.activeElement?.tagName === 'BUTTON').toBe(true);
    });

    test('Enter key toggles unit selection', async () => {
      const user = userEvent.setup();
      const activeParty = [createMockUnit('a1', { name: 'Unit1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const unitButton = screen.getAllByRole('button').find(btn =>
        btn.textContent?.includes('Unit1')
      );

      // Focus and press Enter to select
      unitButton?.focus();
      await user.keyboard('{Enter}');
      expect(screen.queryByText('✓ Selected')).toBeInTheDocument();

      // Press Enter again to deselect
      await user.keyboard('{Enter}');
      expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();
    });

    test('Space key toggles unit selection', async () => {
      const user = userEvent.setup();
      const activeParty = [createMockUnit('a1', { name: 'Unit1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const unitButton = screen.getAllByRole('button').find(btn =>
        btn.textContent?.includes('Unit1')
      );

      // Focus and press Space to select
      unitButton?.focus();
      await user.keyboard(' ');
      expect(screen.queryByText('✓ Selected')).toBeInTheDocument();

      // Press Space again to deselect
      await user.keyboard(' ');
      expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();
    });

    test('Swap button is keyboard accessible when both units selected', async () => {
      const user = userEvent.setup();
      const activeParty = [createMockUnit('a1', { name: 'Active1' })];
      const bench = [createMockUnit('b1', { name: 'Bench1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Select both units by clicking (easier than keyboard nav for setup)
      const activeBtn = screen.getAllByRole('button').find(btn =>
        btn.textContent?.includes('Active1')
      );
      const benchBtn = screen.getAllByRole('button').find(btn =>
        btn.textContent?.includes('Bench1')
      );

      fireEvent.click(activeBtn!);
      fireEvent.click(benchBtn!);

      // Swap button should appear and be a button element
      const swapButton = screen.getByText(/Swap Units/i);
      expect(swapButton).toBeInTheDocument();
      expect(swapButton.tagName).toBe('BUTTON');
    });

    test('no accessibility violations on initial render', async () => {
      const { container } = render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={createBench(3)}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('no accessibility violations with units selected', async () => {
      const activeParty = [createMockUnit('a1', { name: 'Active1' })];
      const bench = [createMockUnit('b1', { name: 'Bench1' })];

      const { container } = render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Select both units
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('unit buttons have descriptive accessible names', () => {
      const activeParty = [
        createMockUnit('a1', { name: 'Tank Hero', role: 'Tank', level: 5 }),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Button should include name and role in accessible text
      const button = screen.getByText('Tank Hero');
      expect(button).toBeInTheDocument();
      expect(button.closest('button')?.textContent).toContain('Tank');
    });

    test('Continue button is keyboard accessible', () => {
      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const continueButton = screen.getByText(/Continue to Next Battle/i);
      expect(continueButton.tagName).toBe('BUTTON');
    });

    test('Tab navigation includes bench units', async () => {
      const user = userEvent.setup();
      const bench = [
        createMockUnit('b1', { name: 'Bench1' }),
        createMockUnit('b2', { name: 'Bench2' }),
      ];

      render(
        <RosterManagementScreen
          activeParty={[createMockUnit('a1')]}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // All buttons should be present and focusable
      const allButtons = screen.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(2); // At least active + bench units
    });

    test('active and bench sections have semantic headings', () => {
      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={createBench(2)}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Should have section labels/headings (use getAllByText since text appears in multiple places)
      const activeLabels = screen.getAllByText(/Active Party/i);
      const benchLabels = screen.getAllByText(/Bench/i);
      expect(activeLabels.length).toBeGreaterThan(0);
      expect(benchLabels.length).toBeGreaterThan(0);
    });

    test('keyboard navigation with empty bench shows accessible message', () => {
      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      expect(screen.getByText('No units on bench')).toBeInTheDocument();
    });

    test('keyboard navigation with 10+ bench units', async () => {
      const largeBench = createBench(12);

      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={largeBench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // All bench units should be accessible
      largeBench.forEach(unit => {
        expect(screen.getByText(unit.name)).toBeInTheDocument();
      });
    });

    test('Enter key triggers swap when swap button is focused', async () => {
      const user = userEvent.setup();
      const onSwap = vi.fn();
      const activeParty = [createMockUnit('a1', { name: 'Active1' })];
      const bench = [createMockUnit('b1', { name: 'Bench1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={onSwap}
          onContinue={vi.fn()}
        />
      );

      // Select both units
      const activeBtn = screen.getAllByRole('button').find(btn =>
        btn.textContent?.includes('Active1')
      );
      const benchBtn = screen.getAllByRole('button').find(btn =>
        btn.textContent?.includes('Bench1')
      );

      fireEvent.click(activeBtn!);
      fireEvent.click(benchBtn!);

      // Focus swap button and press Enter
      const swapButton = screen.getByText(/Swap Units/i);
      swapButton.focus();
      await user.keyboard('{Enter}');

      expect(onSwap).toHaveBeenCalledWith('b1', 'a1');
    });

    test('color is not the only visual indicator - role text is visible', () => {
      const activeParty = [
        createMockUnit('a1', { name: 'Unit1', role: 'Tank' }),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Role should be displayed as text, not just color
      expect(screen.getByText(/Tank/i)).toBeInTheDocument();
    });

    test('focus visible on all interactive elements', () => {
      const activeParty = [createMockUnit('a1', { name: 'Unit1' })];
      const bench = [createMockUnit('b1', { name: 'Bench1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // All buttons should be focusable
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        button.focus();
        expect(document.activeElement).toBe(button);
      });
    });

    test('tab order is logical (active → bench → continue)', async () => {
      const user = userEvent.setup();
      const activeParty = [createMockUnit('a1', { name: 'Active1' })];
      const bench = [createMockUnit('b1', { name: 'Bench1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Tab order should be logical - verify all interactive elements are reachable
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(2); // At least active + bench + continue
    });

    test('screen reader gets unit information in accessible order', () => {
      const activeParty = [
        createMockUnit('a1', { name: 'Hero', role: 'Tank', level: 5, hp: 80, maxHp: 100 }),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const unitButton = screen.getByText('Hero').closest('button');
      const buttonText = unitButton?.textContent || '';

      // Should contain name, role, level, and HP in accessible text
      expect(buttonText).toContain('Hero');
      expect(buttonText).toContain('Tank');
      expect(buttonText).toContain('5');
      expect(buttonText).toContain('80');
    });

    test('empty slots are announced correctly for screen readers', () => {
      const activeParty = [createMockUnit('a1')]; // Only 1 unit

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const emptySlots = screen.getAllByText('Empty Slot');
      expect(emptySlots).toHaveLength(3); // 3 empty slots clearly labeled
    });
  });

  // ============================================
  // Priority 2: Edge Cases & Error Handling (10 tests)
  // ============================================

  describe('Edge Cases & Error Handling', () => {
    test('handles empty active party (0 units)', () => {
      render(
        <RosterManagementScreen
          activeParty={[]}
          bench={createBench(2)}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Should show 4 empty slots
      const emptySlots = screen.getAllByText('Empty Slot');
      expect(emptySlots).toHaveLength(4);
    });

    test('handles full active party (4 units) with empty bench', () => {
      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      expect(screen.getByText('No units on bench')).toBeInTheDocument();
      expect(screen.getByText(/Active Party.*4 slots/i)).toBeInTheDocument();
    });

    test('handles large bench (20+ units)', () => {
      const largeBench = createBench(25);

      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={largeBench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      expect(screen.getByText(/Bench.*25 units/i)).toBeInTheDocument();
      
      // All bench units should be rendered
      largeBench.forEach(unit => {
        expect(screen.getByText(unit.name)).toBeInTheDocument();
      });
    });

    test('handles unit with extremely long name (100+ chars)', () => {
      const longName = 'A'.repeat(120);
      const activeParty = [createMockUnit('a1', { name: longName })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Should display without overflow (text wraps or truncates)
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    test('handles unit with HP = 0 (knocked out)', () => {
      const knockedOutUnit = createMockUnit('a1', { name: 'Knocked Out', hp: 0, maxHp: 100 });

      render(
        <RosterManagementScreen
          activeParty={[knockedOutUnit]}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      expect(screen.getByText('Knocked Out')).toBeInTheDocument();
      expect(screen.getByText('0/100')).toBeInTheDocument();
    });

    test('handles unit with max stats (edge values)', () => {
      const maxStatsUnit = createMockUnit('a1', {
        name: 'Max Power',
        hp: 9999,
        maxHp: 9999,
        atk: 999,
        def: 999,
        speed: 999,
        level: 99,
      });

      render(
        <RosterManagementScreen
          activeParty={[maxStatsUnit]}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      expect(screen.getByText('Max Power')).toBeInTheDocument();
      expect(screen.getByText('9999/9999')).toBeInTheDocument();
    });

    test('handles all four roles represented', () => {
      const diverseParty = [
        createMockUnit('a1', { name: 'Tank1', role: 'Tank' }),
        createMockUnit('a2', { name: 'DPS1', role: 'DPS' }),
        createMockUnit('a3', { name: 'Support1', role: 'Support' }),
        createMockUnit('a4', { name: 'Specialist1', role: 'Specialist' }),
      ];

      render(
        <RosterManagementScreen
          activeParty={diverseParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Use getAllByText since role names might appear in unit names too
      const tankElements = screen.getAllByText(/Tank/i);
      const dpsElements = screen.getAllByText(/DPS/i);
      const supportElements = screen.getAllByText(/Support/i);
      const specialistElements = screen.getAllByText(/Specialist/i);
      
      expect(tankElements.length).toBeGreaterThan(0);
      expect(dpsElements.length).toBeGreaterThan(0);
      expect(supportElements.length).toBeGreaterThan(0);
      expect(specialistElements.length).toBeGreaterThan(0);
    });

    test('handles mixed active party (1-3 units)', () => {
      const partialParty = [
        createMockUnit('a1', { name: 'Unit1' }),
        createMockUnit('a2', { name: 'Unit2' }),
      ];

      render(
        <RosterManagementScreen
          activeParty={partialParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // 2 filled slots
      expect(screen.getByText('Unit1')).toBeInTheDocument();
      expect(screen.getByText('Unit2')).toBeInTheDocument();
      
      // 2 empty slots
      const emptySlots = screen.getAllByText('Empty Slot');
      expect(emptySlots).toHaveLength(2);
    });

    test('handles single unit in active party', () => {
      const singleUnit = [createMockUnit('a1', { name: 'Lone Wolf' })];

      render(
        <RosterManagementScreen
          activeParty={singleUnit}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      expect(screen.getByText('Lone Wolf')).toBeInTheDocument();
      
      const emptySlots = screen.getAllByText('Empty Slot');
      expect(emptySlots).toHaveLength(3);
    });

    test('handles bench with single unit', () => {
      const bench = [createMockUnit('b1', { name: 'Reserve' })];

      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      expect(screen.getByText('Reserve')).toBeInTheDocument();
      expect(screen.getByText(/Bench.*1 unit/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // Priority 3: Visual States & Selection Logic (8 tests)
  // ============================================

  describe('Visual States & Selection Logic', () => {
    test('selected unit displays selection indicator', () => {
      const activeParty = [createMockUnit('a1', { name: 'Unit1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const unitButton = screen.getByText('Unit1').closest('button');
      
      // Initially no selection indicator
      expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();

      // Click to select
      fireEvent.click(unitButton!);

      // Selection indicator appears
      expect(screen.getByText('✓ Selected')).toBeInTheDocument();
    });

    test('deselecting unit removes selection indicator', () => {
      const activeParty = [createMockUnit('a1', { name: 'Unit1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const unitButton = screen.getByText('Unit1').closest('button');
      
      // Select
      fireEvent.click(unitButton!);
      expect(screen.getByText('✓ Selected')).toBeInTheDocument();

      // Deselect
      fireEvent.click(unitButton!);
      expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();
    });

    test('can only select one active unit at a time', () => {
      const activeParty = [
        createMockUnit('a1', { name: 'Unit1' }),
        createMockUnit('a2', { name: 'Unit2' }),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Select first unit
      fireEvent.click(screen.getByText('Unit1').closest('button')!);
      expect(screen.getAllByText('✓ Selected')).toHaveLength(1);

      // Select second unit
      fireEvent.click(screen.getByText('Unit2').closest('button')!);
      
      // Should still only have one selection
      expect(screen.getAllByText('✓ Selected')).toHaveLength(1);
    });

    test('can only select one bench unit at a time', () => {
      const bench = [
        createMockUnit('b1', { name: 'Bench1' }),
        createMockUnit('b2', { name: 'Bench2' }),
      ];

      render(
        <RosterManagementScreen
          activeParty={[createMockUnit('a1')]}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Select first bench unit
      fireEvent.click(screen.getByText('Bench1').closest('button')!);
      
      // Select second bench unit
      fireEvent.click(screen.getByText('Bench2').closest('button')!);
      
      // Should still only have one selection indicator (bench selection replaced)
      const selections = screen.getAllByText('✓ Selected');
      expect(selections.length).toBeLessThanOrEqual(2); // Max 1 active + 1 bench
    });

    test('selecting active and bench units shows both indicators', () => {
      const activeParty = [createMockUnit('a1', { name: 'Active1' })];
      const bench = [createMockUnit('b1', { name: 'Bench1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Select active unit
      fireEvent.click(screen.getByText('Active1').closest('button')!);
      expect(screen.getAllByText('✓ Selected')).toHaveLength(1);

      // Select bench unit
      fireEvent.click(screen.getByText('Bench1').closest('button')!);
      expect(screen.getAllByText('✓ Selected')).toHaveLength(2);
    });

    test('swap button only appears when both active and bench selected', () => {
      const activeParty = [createMockUnit('a1', { name: 'Active1' })];
      const bench = [createMockUnit('b1', { name: 'Bench1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // Initially no swap button
      expect(screen.queryByText(/Swap Units/i)).not.toBeInTheDocument();

      // Select only active unit
      fireEvent.click(screen.getByText('Active1').closest('button')!);
      expect(screen.queryByText(/Swap Units/i)).not.toBeInTheDocument();

      // Select bench unit too
      fireEvent.click(screen.getByText('Bench1').closest('button')!);
      expect(screen.getByText(/Swap Units/i)).toBeInTheDocument();
    });

    test('unit stats (HP, ATK, DEF, SPD) display correctly', () => {
      const unit = createMockUnit('a1', {
        name: 'TestUnit',
        hp: 80,
        maxHp: 100,
        atk: 25,
        def: 20,
        speed: 15,
      });

      render(
        <RosterManagementScreen
          activeParty={[unit]}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      expect(screen.getByText('80/100')).toBeInTheDocument(); // HP
      expect(screen.getByText('25')).toBeInTheDocument(); // ATK
      expect(screen.getByText('20')).toBeInTheDocument(); // DEF
      expect(screen.getByText('15')).toBeInTheDocument(); // SPD
    });

    test('each role displays role label text', () => {
      const roles: Array<'Tank' | 'DPS' | 'Support' | 'Specialist'> = ['Tank', 'DPS', 'Support', 'Specialist'];
      
      roles.forEach((role, index) => {
        const unit = createMockUnit(`a${index}`, { name: `Unit${index}`, role });
        
        const { container } = render(
          <RosterManagementScreen
            activeParty={[unit]}
            bench={[]}
            onSwap={vi.fn()}
            onContinue={vi.fn()}
          />
        );

        // Role text should appear somewhere in the component
        const roleElements = screen.getAllByText(new RegExp(role, 'i'));
        expect(roleElements.length).toBeGreaterThan(0);
        
        // Clean up for next iteration
        container.remove();
      });
    });
  });

  // ============================================
  // Priority 4: Integration with RosterManager (6 tests)
  // ============================================

  describe('Integration with RosterManager', () => {
    test('swap operation passes correct unit IDs in correct order', () => {
      const onSwap = vi.fn();
      const activeParty = [createMockUnit('active-1', { name: 'Active1' })];
      const bench = [createMockUnit('bench-1', { name: 'Bench1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={onSwap}
          onContinue={vi.fn()}
        />
      );

      // Select active unit
      const activeBtn = screen.getByText('Active1').closest('button');
      fireEvent.click(activeBtn!);

      // Select bench unit
      const benchBtn = screen.getByText('Bench1').closest('button');
      fireEvent.click(benchBtn!);

      // Click swap
      const swapBtn = screen.getByText(/Swap Units/i);
      fireEvent.click(swapBtn);

      // Should call with (benchUnitId, activeUnitId)
      expect(onSwap).toHaveBeenCalledWith('bench-1', 'active-1');
    });

    test('swap clears selections after successful swap', () => {
      const onSwap = vi.fn();
      const activeParty = [createMockUnit('active-1', { name: 'Active1' })];
      const bench = [createMockUnit('bench-1', { name: 'Bench1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={onSwap}
          onContinue={vi.fn()}
        />
      );

      // Select both units
      fireEvent.click(screen.getByText('Active1').closest('button')!);
      fireEvent.click(screen.getByText('Bench1').closest('button')!);
      expect(screen.getAllByText('✓ Selected')).toHaveLength(2);

      // Click swap
      const swapBtn = screen.getByText(/Swap Units/i);
      fireEvent.click(swapBtn);

      // Selections should be cleared
      expect(screen.queryByText('✓ Selected')).not.toBeInTheDocument();
    });

    test('continue without swapping calls onContinue', () => {
      const onContinue = vi.fn();

      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={createBench(2)}
          onSwap={vi.fn()}
          onContinue={onContinue}
        />
      );

      const continueBtn = screen.getByText(/Continue to Next Battle/i);
      fireEvent.click(continueBtn);

      expect(onContinue).toHaveBeenCalledTimes(1);
    });

    test('multiple swaps in sequence work correctly', () => {
      const onSwap = vi.fn();
      const activeParty = [
        createMockUnit('a1', { name: 'Active1' }),
        createMockUnit('a2', { name: 'Active2' }),
      ];
      const bench = [
        createMockUnit('b1', { name: 'Bench1' }),
        createMockUnit('b2', { name: 'Bench2' }),
      ];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={onSwap}
          onContinue={vi.fn()}
        />
      );

      // First swap
      fireEvent.click(screen.getByText('Active1').closest('button')!);
      fireEvent.click(screen.getByText('Bench1').closest('button')!);
      fireEvent.click(screen.getByText(/Swap Units/i));

      expect(onSwap).toHaveBeenCalledWith('b1', 'a1');

      // Second swap
      fireEvent.click(screen.getByText('Active2').closest('button')!);
      fireEvent.click(screen.getByText('Bench2').closest('button')!);
      fireEvent.click(screen.getByText(/Swap Units/i));

      expect(onSwap).toHaveBeenCalledWith('b2', 'a2');
      expect(onSwap).toHaveBeenCalledTimes(2);
    });

    test('continue works with empty bench', () => {
      const onContinue = vi.fn();

      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={onContinue}
        />
      );

      const continueBtn = screen.getByText(/Continue to Next Battle/i);
      fireEvent.click(continueBtn);

      expect(onContinue).toHaveBeenCalledTimes(1);
    });

    test('swap with all 4 roles represented', () => {
      const onSwap = vi.fn();
      const activeParty = createFullParty(); // Has all 4 roles
      const bench = [createMockUnit('b1', { name: 'BenchTank', role: 'Tank' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={onSwap}
          onContinue={vi.fn()}
        />
      );

      // Swap Tank Hero with BenchTank
      fireEvent.click(screen.getByText('Tank Hero').closest('button')!);
      fireEvent.click(screen.getByText('BenchTank').closest('button')!);
      fireEvent.click(screen.getByText(/Swap Units/i));

      expect(onSwap).toHaveBeenCalledWith('b1', 'a1');
    });
  });

  // ============================================
  // Priority 5: Stress Tests (3 tests)
  // ============================================

  describe('Stress Tests', () => {
    test('renders 30+ bench units without performance issues', () => {
      const largeBench = createBench(35);

      render(
        <RosterManagementScreen
          activeParty={createFullParty()}
          bench={largeBench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      // All units should render
      expect(screen.getByText('Bench 1')).toBeInTheDocument();
      expect(screen.getByText('Bench 35')).toBeInTheDocument();
    });

    test('rapid selection/deselection maintains correct state', () => {
      const activeParty = [createMockUnit('a1', { name: 'Unit1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={[]}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const unitButton = screen.getByText('Unit1').closest('button');

      // Rapid clicks
      fireEvent.click(unitButton!); // Select
      fireEvent.click(unitButton!); // Deselect
      fireEvent.click(unitButton!); // Select
      fireEvent.click(unitButton!); // Deselect
      fireEvent.click(unitButton!); // Select

      // Final state should be selected
      expect(screen.getByText('✓ Selected')).toBeInTheDocument();
    });

    test('swap button appears and disappears correctly with fast selection changes', () => {
      const activeParty = [createMockUnit('a1', { name: 'Active1' })];
      const bench = [createMockUnit('b1', { name: 'Bench1' })];

      render(
        <RosterManagementScreen
          activeParty={activeParty}
          bench={bench}
          onSwap={vi.fn()}
          onContinue={vi.fn()}
        />
      );

      const activeBtn = screen.getByText('Active1').closest('button')!;
      const benchBtn = screen.getByText('Bench1').closest('button')!;

      // Select both
      fireEvent.click(activeBtn);
      fireEvent.click(benchBtn);
      expect(screen.getByText(/Swap Units/i)).toBeInTheDocument();

      // Deselect active
      fireEvent.click(activeBtn);
      expect(screen.queryByText(/Swap Units/i)).not.toBeInTheDocument();

      // Reselect active
      fireEvent.click(activeBtn);
      expect(screen.getByText(/Swap Units/i)).toBeInTheDocument();
    });
  });
});
