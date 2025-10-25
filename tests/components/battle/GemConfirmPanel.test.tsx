/**
 * Tests for GemConfirmPanel component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GemConfirmPanel } from '../../../src/components/battle/GemConfirmPanel';
import type { GemActivation } from '../../../src/data/gemActivations';
import userEvent from '@testing-library/user-event';

describe('GemConfirmPanel', () => {
  const mockGemActivation: GemActivation = {
    id: 'volcanic_eruption',
    name: 'Volcanic Eruption',
    description: 'Explosive fire engulfs all foes.',
    effect: 'aoe_damage',
    power: 50,
    target: 'all_enemies',
  };

  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders gem activation title', () => {
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Activate Gem/i)).toBeTruthy();
    });

    it('renders gem name and description', () => {
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Volcanic Eruption')).toBeTruthy();
      expect(screen.getByText('Explosive fire engulfs all foes.')).toBeTruthy();
    });

    it('renders effect details', () => {
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Area Damage/i)).toBeTruthy();
      expect(screen.getByText(/50/)).toBeTruthy();
      expect(screen.getByText(/All Enemies/i)).toBeTruthy();
    });

    it('renders warning message', () => {
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Warning:/i)).toBeTruthy();
      expect(screen.getByText(/One-time use per battle/i)).toBeTruthy();
    });

    it('renders activate and cancel buttons', () => {
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Activate \(Enter\)/i)).toBeTruthy();
      expect(screen.getByText(/Cancel \(Escape\)/i)).toBeTruthy();
    });

    it('renders keyboard hint', () => {
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Use Enter\/Escape or click buttons/i)).toBeTruthy();
    });
  });

  describe('Effect Type Display', () => {
    it('displays party heal correctly', () => {
      const healActivation: GemActivation = {
        ...mockGemActivation,
        effect: 'party_heal',
        target: 'all_allies',
      };

      render(
        <GemConfirmPanel
          gemActivation={healActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Party Heal/i)).toBeTruthy();
      expect(screen.getByText(/All Allies/i)).toBeTruthy();
    });

    it('displays party buff correctly', () => {
      const buffActivation: GemActivation = {
        ...mockGemActivation,
        effect: 'party_buff',
        target: 'all_allies',
      };

      render(
        <GemConfirmPanel
          gemActivation={buffActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Party Buff/i)).toBeTruthy();
    });

    it('displays enemy debuff correctly', () => {
      const debuffActivation: GemActivation = {
        ...mockGemActivation,
        effect: 'enemy_debuff',
      };

      render(
        <GemConfirmPanel
          gemActivation={debuffActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Enemy Debuff/i)).toBeTruthy();
    });
  });

  describe('Button Interactions', () => {
    it('calls onConfirm when activate button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const activateButton = screen.getByText(/Activate \(Enter\)/i);
      await user.click(activateButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByText(/Cancel \(Escape\)/i);
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const buttons = screen.getAllByRole('menuitem');
      expect(buttons).toHaveLength(2);
    });

    it('has ARIA labels on buttons', () => {
      render(
        <GemConfirmPanel
          gemActivation={mockGemActivation}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText(/Activate \(Enter\)/i)).toBeTruthy();
      expect(screen.getByLabelText(/Cancel \(Escape\)/i)).toBeTruthy();
    });
  });
});
