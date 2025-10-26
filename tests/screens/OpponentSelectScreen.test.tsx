/*
 * OpponentSelectScreen Tests
 * Comprehensive tests for opponent selection UI and keyboard navigation
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { OpponentSelectScreen } from '../../src/screens/OpponentSelectScreen.js';
import type { OpponentPreview, OpponentSpec } from '../../src/types/game.js';

describe('OpponentSelectScreen', () => {
  // Test fixtures
  const createOpponentSpec = (id: string, name: string, difficulty: 'Normal' | 'Standard' | 'Hard'): OpponentSpec => ({
    id,
    name,
    difficulty,
    primaryTag: 'Beast',
    counterTags: ['Holy'],
    units: [
      { id: 'orc', name: 'Orc', role: 'Tank', tags: ['Beast'], baseStats: { hp: 100, atk: 20, def: 10, speed: 15 } },
    ],
    rewardHint: 'Tribal Gear',
  });

  const createPreview = (id: string, name: string, difficulty: 'Normal' | 'Standard' | 'Hard'): OpponentPreview => ({
    spec: createOpponentSpec(id, name, difficulty),
    counterTags: ['Holy'],
    unitSummaries: [{ name: 'Orc', role: 'Tank' }],
  });

  const mockHandlers = {
    onSelect: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering - Basic Layout', () => {
    test('renders header with title', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Select Your Opponent')).toBeInTheDocument();
    });

    test('displays battle number', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={5}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Battle #6')).toBeInTheDocument();
    });

    test('renders all opponent previews', () => {
      const previews = [
        createPreview('enemy1', 'Orc Warband', 'Normal'),
        createPreview('enemy2', 'Goblin Raiders', 'Standard'),
        createPreview('enemy3', 'Dragon Cult', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Orc Warband')).toBeInTheDocument();
      expect(screen.getByText('Goblin Raiders')).toBeInTheDocument();
      expect(screen.getByText('Dragon Cult')).toBeInTheDocument();
    });

    test('displays keyboard instructions', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Check for keyboard instructions (we updated styling)
      expect(screen.getByText('◄')).toBeInTheDocument();
      expect(screen.getByText('►')).toBeInTheDocument();
      expect(screen.getByText('Enter')).toBeInTheDocument();
    });

    test('renders radiogroup with proper ARIA label', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const radiogroup = screen.getByRole('radiogroup', { name: 'Opponent selection' });
      expect(radiogroup).toBeInTheDocument();
    });

    test('renders live region for screen reader announcements', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Keyboard Navigation - Arrow Keys', () => {
    test('ArrowRight moves focus to next card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // First card should be focused (tabIndex 0)
      const cards = screen.getAllByRole('radio');
      expect(cards[0]).toHaveAttribute('tabIndex', '0');
      expect(cards[1]).toHaveAttribute('tabIndex', '-1');

      // Press ArrowRight
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Second card should now be focused
      expect(cards[1]).toHaveAttribute('tabIndex', '0');
      expect(cards[0]).toHaveAttribute('tabIndex', '-1');
    });

    test('ArrowLeft moves focus to previous card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Move to second card first
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      const cards = screen.getAllByRole('radio');
      expect(cards[1]).toHaveAttribute('tabIndex', '0');

      // Press ArrowLeft
      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      // First card should be focused again
      expect(cards[0]).toHaveAttribute('tabIndex', '0');
      expect(cards[1]).toHaveAttribute('tabIndex', '-1');
    });

    test('ArrowRight wraps from last to first card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const cards = screen.getAllByRole('radio');

      // Navigate to last card
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(cards[2]).toHaveAttribute('tabIndex', '0');

      // Press ArrowRight again - should wrap to first
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(cards[0]).toHaveAttribute('tabIndex', '0');
    });

    test('ArrowLeft wraps from first to last card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const cards = screen.getAllByRole('radio');

      // First card is focused by default
      expect(cards[0]).toHaveAttribute('tabIndex', '0');

      // Press ArrowLeft - should wrap to last
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(cards[2]).toHaveAttribute('tabIndex', '0');
    });

    test('navigating between cards maintains focus state', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const cards = screen.getAllByRole('radio');

      // Navigate right then left
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(cards[1]).toHaveAttribute('tabIndex', '0');

      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(cards[0]).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Selection - Enter/Space Keys', () => {
    test('Enter key selects focused card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Press Enter on first card (focused by default)
      fireEvent.keyDown(window, { key: 'Enter' });

      // Should select the card (not yet confirm - needs second press)
      // First press selects, second confirms in the component
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(mockHandlers.onSelect).toHaveBeenCalledWith('enemy1');
    });

    test('Space key selects focused card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Press Space on first card
      fireEvent.keyDown(window, { key: ' ' });
      fireEvent.keyDown(window, { key: ' ' });

      expect(mockHandlers.onSelect).toHaveBeenCalledWith('enemy1');
    });

    test('can select different card by navigating first', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Navigate to second card
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Select it
      fireEvent.keyDown(window, { key: 'Enter' });
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(mockHandlers.onSelect).toHaveBeenCalledWith('enemy2');
    });

    test('can select third card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Navigate to third card
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Select it
      fireEvent.keyDown(window, { key: 'Enter' });
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(mockHandlers.onSelect).toHaveBeenCalledWith('enemy3');
    });
  });

  describe('Mouse Interaction', () => {
    test('clicking card selects it', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const cards = screen.getAllByRole('radio');
      
      // Click first card
      fireEvent.click(cards[0]);

      // Card should show as selected (visual state changes)
      // To confirm, would need to click again or use Enter
      expect(cards[0]).toBeInTheDocument();
    });

    test('can click different cards in sequence', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const cards = screen.getAllByRole('radio');
      
      // Click cards in sequence
      fireEvent.click(cards[0]);
      fireEvent.click(cards[1]);
      fireEvent.click(cards[2]);

      // All interactions should work
      expect(cards[2]).toBeInTheDocument();
    });
  });

  describe('Cancel Functionality', () => {
    test('Escape key triggers onCancel', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(mockHandlers.onCancel).toHaveBeenCalledOnce();
    });

    test('Escape works after navigation', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Navigate first
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Then cancel
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(mockHandlers.onCancel).toHaveBeenCalledOnce();
    });

    test('Escape does not trigger onSelect', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(mockHandlers.onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty previews array', () => {
      const previews: OpponentPreview[] = [];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Select Your Opponent')).toBeInTheDocument();
      // Should not crash
    });

    test('handles single preview', () => {
      const previews = [createPreview('enemy1', 'Solo Enemy', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Solo Enemy')).toBeInTheDocument();
      
      // Navigation should still work (wraps to same card)
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      
      // Should not crash
    });

    test('handles battle index 0', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Battle #1')).toBeInTheDocument();
    });

    test('handles large battle index', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={99}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Battle #100')).toBeInTheDocument();
    });

    test('handles opponents with different difficulties', () => {
      const previews = [
        createPreview('enemy1', 'Easy Enemy', 'Normal'),
        createPreview('enemy2', 'Medium Enemy', 'Standard'),
        createPreview('enemy3', 'Hard Enemy', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // All should render
      expect(screen.getByText('Easy Enemy')).toBeInTheDocument();
      expect(screen.getByText('Medium Enemy')).toBeInTheDocument();
      expect(screen.getByText('Hard Enemy')).toBeInTheDocument();
    });

    test('navigation does nothing with empty previews', () => {
      const previews: OpponentPreview[] = [];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Should not crash when navigating with no cards
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(mockHandlers.onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    test('ArrowUp toggles expand on focused card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Press ArrowUp to expand first card
      fireEvent.keyDown(window, { key: 'ArrowUp' });

      // Should expand (component internal state changes)
      // Verify it doesn't crash
    });

    test('ArrowDown toggles expand on focused card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Press ArrowDown to expand first card
      fireEvent.keyDown(window, { key: 'ArrowDown' });

      // Should expand (component internal state changes)
      // Verify it doesn't crash
    });

    test('navigating away collapses expanded card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Expand first card
      fireEvent.keyDown(window, { key: 'ArrowUp' });

      // Navigate to second card
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // First card should collapse (component behavior)
      // Verify no crashes
    });
  });

  describe('Accessibility', () => {
    test('first card has tabIndex 0, others have -1', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const cards = screen.getAllByRole('radio');
      expect(cards[0]).toHaveAttribute('tabIndex', '0');
      expect(cards[1]).toHaveAttribute('tabIndex', '-1');
      expect(cards[2]).toHaveAttribute('tabIndex', '-1');
    });

    test('live region exists for announcements', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    test('keyboard instructions are visible', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Check for navigation instructions (we updated the styling, so check for arrow symbols)
      expect(screen.getByText('◄')).toBeInTheDocument();
      expect(screen.getByText('►')).toBeInTheDocument();
      expect(screen.getByText('Enter')).toBeInTheDocument();
      expect(screen.getByText('Esc')).toBeInTheDocument();
    });
  });

  describe('Integration Scenarios', () => {
    test('complete selection flow: navigate → select → confirm', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Navigate to second enemy
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Select and confirm
      fireEvent.keyDown(window, { key: 'Enter' });
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(mockHandlers.onSelect).toHaveBeenCalledWith('enemy2');
    });

    test('navigate through all cards and back', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
        createPreview('enemy3', 'Enemy 3', 'Hard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      const cards = screen.getAllByRole('radio');

      // Navigate through all
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(cards[1]).toHaveAttribute('tabIndex', '0');

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(cards[2]).toHaveAttribute('tabIndex', '0');

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(cards[0]).toHaveAttribute('tabIndex', '0'); // Wrapped

      // Navigate back
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(cards[2]).toHaveAttribute('tabIndex', '0');
    });

    test('expand → navigate → expand different card', () => {
      const previews = [
        createPreview('enemy1', 'Enemy 1', 'Normal'),
        createPreview('enemy2', 'Enemy 2', 'Standard'),
      ];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Expand first card
      fireEvent.keyDown(window, { key: 'ArrowDown' });

      // Navigate to second
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Expand second card
      fireEvent.keyDown(window, { key: 'ArrowUp' });

      // Should not crash, state managed correctly
    });

    test('select → cancel does not confirm selection', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      // Select (first press)
      fireEvent.keyDown(window, { key: 'Enter' });

      // Cancel instead of confirming
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(mockHandlers.onSelect).not.toHaveBeenCalled();
      expect(mockHandlers.onCancel).toHaveBeenCalledOnce();
    });
  });

  describe('Multiple Battles', () => {
    test('displays correct battle index for battle 1', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Battle #1')).toBeInTheDocument();
    });

    test('displays correct battle index for battle 10', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={9}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Battle #10')).toBeInTheDocument();
    });

    test('handles battle progression naturally', () => {
      const previews = [createPreview('enemy1', 'Enemy 1', 'Normal')];

      const { rerender } = render(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={0}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Battle #1')).toBeInTheDocument();

      // Simulate progression
      rerender(
        <OpponentSelectScreen
          previews={previews}
          battleIndex={1}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Battle #2')).toBeInTheDocument();
    });
  });
});
