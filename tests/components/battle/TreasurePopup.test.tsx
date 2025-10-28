/**
 * TreasurePopup Tests
 *
 * Tests for the treasure popup component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TreasurePopup } from '../../../src/components/battle/TreasurePopup.js';
import type { Item, Equipment } from '../../../src/types/game.js';

describe('TreasurePopup', () => {
  const mockOnContinue = vi.fn();

  const createTestItem = (name: string): Item => ({
    id: `item-${name}`,
    name,
    type: 'consumable',
    rarity: 'common',
    stats: { hpRestore: 50 },
  });

  const createTestEquipment = (name: string, slot: 'weapon' | 'armor' | 'accessory'): Equipment => ({
    id: `equip-${name}`,
    name,
    slot,
    description: `Test ${name}`,
    rarity: 'common',
    stats: { atk: 5 },
  });

  afterEach(() => {
    mockOnContinue.mockClear();
  });

  describe('Visibility', () => {
    it('renders when visible is true', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.getByText('🎁 Victory Rewards!')).toBeInTheDocument();
    });

    it('does not render when visible is false', () => {
      const { container } = render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Gold and XP Display', () => {
    it('displays gold amount', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={150}
          xp={375}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.getByText(/Gold:/)).toBeInTheDocument();
      expect(screen.getByText(/\+150/)).toBeInTheDocument();
    });

    it('displays XP amount', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={150}
          xp={375}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.getByText(/XP:/)).toBeInTheDocument();
      expect(screen.getByText(/\+375/)).toBeInTheDocument();
    });

    it('handles zero gold and XP', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={0}
          xp={0}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.getByText(/\+0.*💰/)).toBeInTheDocument();
      expect(screen.getByText(/\+0.*✨/)).toBeInTheDocument();
    });
  });

  describe('Items Display', () => {
    it('displays items section when items present', () => {
      const items = [createTestItem('Health Potion')];

      render(
        <TreasurePopup
          items={items}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.getByText('Items:')).toBeInTheDocument();
      expect(screen.getByText('Health Potion')).toBeInTheDocument();
    });

    it('displays multiple items', () => {
      const items = [
        createTestItem('Health Potion'),
        createTestItem('Mana Potion'),
      ];

      render(
        <TreasurePopup
          items={items}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.getByText('Health Potion')).toBeInTheDocument();
      expect(screen.getByText('Mana Potion')).toBeInTheDocument();
    });

    it('does not show items section when no items', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.queryByText('Items:')).not.toBeInTheDocument();
    });

    it('shows "no items" message when no rewards', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.getByText(/no items or equipment gained/i)).toBeInTheDocument();
    });
  });

  describe('Equipment Display', () => {
    it('displays equipment section when equipment present', () => {
      const equipment = [createTestEquipment('Iron Sword', 'weapon')];

      render(
        <TreasurePopup
          items={[]}
          equipment={equipment}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.getByText('Equipment:')).toBeInTheDocument();
      expect(screen.getByText('Iron Sword')).toBeInTheDocument();
    });

    it('displays equipment stats', () => {
      const equipment: Equipment[] = [{
        id: 'weapon-1',
        name: 'Iron Sword',
        slot: 'weapon',
        description: 'Test weapon',
        rarity: 'common',
        stats: { atk: 10 },
      }];

      render(
        <TreasurePopup
          items={[]}
          equipment={equipment}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.getByText(/\+10 ATK/)).toBeInTheDocument();
    });

    it('does not show equipment section when no equipment', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      expect(screen.queryByText('Equipment:')).not.toBeInTheDocument();
    });
  });

  describe('Continue Button', () => {
    it('displays continue button', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      const button = screen.getByRole('button', { name: /continue to roster/i });
      expect(button).toBeInTheDocument();
    });

    it('calls onContinue when button clicked', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      const button = screen.getByRole('button', { name: /continue to roster/i });
      fireEvent.click(button);

      expect(mockOnContinue).toHaveBeenCalledTimes(1);
    });

    it('calls onContinue when background overlay clicked', () => {
      const { container } = render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      // Find the dimmed background overlay
      const overlay = container.querySelector('.fixed.inset-0.bg-black');
      expect(overlay).toBeInTheDocument();

      if (overlay) {
        fireEvent.click(overlay);
        expect(mockOnContinue).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label on continue button', () => {
      render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      const button = screen.getByRole('button', { name: /continue to roster/i });
      expect(button).toHaveAttribute('aria-label', 'Continue to roster');
    });

    it('marks background overlay as aria-hidden', () => {
      const { container } = render(
        <TreasurePopup
          items={[]}
          equipment={[]}
          gold={50}
          xp={125}
          onContinue={mockOnContinue}
          visible={true}
        />
      );

      const overlay = container.querySelector('.fixed.inset-0.bg-black');
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
