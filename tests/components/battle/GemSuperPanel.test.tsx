/**
 * GemSuperPanel Tests
 *
 * Tests for the gem super panel component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GemSuperPanel } from '../../../src/components/battle/GemSuperPanel.js';
import type { Element } from '../../../src/types/game.js';

describe('GemSuperPanel', () => {
  const mockOnActivate = vi.fn();

  afterEach(() => {
    mockOnActivate.mockClear();
  });

  describe('Rendering', () => {
    it('renders gem name and element', () => {
      render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      expect(screen.getByText('Mars Gem')).toBeInTheDocument();
      expect(screen.getByText('Mars')).toBeInTheDocument();
    });

    it('renders "Gem Super" header', () => {
      render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      expect(screen.getByText('Gem Super')).toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      expect(screen.getByText('AOE damage to all enemies')).toBeInTheDocument();
    });

    it('renders element emoji icon', () => {
      const { container } = render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      const emoji = container.querySelector('[role="img"]');
      expect(emoji).toBeInTheDocument();
      expect(emoji).toHaveAttribute('aria-label', 'Mars element');
    });
  });

  describe('Visual States', () => {
    it('shows Activate button when available', () => {
      render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      const button = screen.getByRole('button', { name: /activate.*mars gem/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Activate');
    });

    it('shows "Used this battle" when not available', () => {
      render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={false}
          onActivate={mockOnActivate}
        />
      );

      expect(screen.getByText('Used this battle')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /activate/i })).not.toBeInTheDocument();
    });

    it('shows "No Gem Selected" when gem is null', () => {
      render(
        <GemSuperPanel
          gemName={null}
          gemElement={null}
          isAvailable={false}
          onActivate={mockOnActivate}
        />
      );

      expect(screen.getByText('No Gem Selected')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onActivate when Activate button is clicked', () => {
      render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      const button = screen.getByRole('button', { name: /activate/i });
      fireEvent.click(button);

      expect(mockOnActivate).toHaveBeenCalledTimes(1);
    });

    it('does not call onActivate when not available', () => {
      render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={false}
          onActivate={mockOnActivate}
        />
      );

      // No button should be present
      const button = screen.queryByRole('button', { name: /activate/i });
      expect(button).not.toBeInTheDocument();

      expect(mockOnActivate).not.toHaveBeenCalled();
    });

    it('does not call onActivate when gem is null', () => {
      render(
        <GemSuperPanel
          gemName={null}
          gemElement={null}
          isAvailable={false}
          onActivate={mockOnActivate}
        />
      );

      expect(mockOnActivate).not.toHaveBeenCalled();
    });
  });

  describe('Element-Specific Rendering', () => {
    const elements: Element[] = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Moon', 'Sun'];

    elements.forEach(element => {
      it(`renders ${element} gem correctly`, () => {
        render(
          <GemSuperPanel
            gemName={`${element} Gem`}
            gemElement={element}
            isAvailable={true}
            onActivate={mockOnActivate}
          />
        );

        expect(screen.getByText(element)).toBeInTheDocument();
        expect(screen.getByText(`${element} Gem`)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label on activate button', () => {
      render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      const button = screen.getByRole('button', { name: /activate mars gem super attack/i });
      expect(button).toBeInTheDocument();
    });

    it('has proper aria-label on element emoji', () => {
      const { container } = render(
        <GemSuperPanel
          gemName="Venus Gem"
          gemElement="Venus"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      const emoji = container.querySelector('[role="img"]');
      expect(emoji).toHaveAttribute('aria-label', 'Venus element');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty gem name gracefully', () => {
      render(
        <GemSuperPanel
          gemName=""
          gemElement="Mars"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      // Should show "No Gem Selected" for empty name
      expect(screen.getByText('No Gem Selected')).toBeInTheDocument();
    });

    it('maintains fixed width', () => {
      const { container } = render(
        <GemSuperPanel
          gemName="Mars Gem"
          gemElement="Mars"
          isAvailable={true}
          onActivate={mockOnActivate}
        />
      );

      const panel = container.querySelector('.gem-super-panel');
      expect(panel).toHaveStyle({ width: '192px' });
    });
  });
});
