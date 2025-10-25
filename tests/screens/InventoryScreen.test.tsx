/*
 * InventoryScreen Tests
 * Tests for inventory management UI
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryScreen } from '../../src/screens/InventoryScreen.js';
import type { PlayerUnit, Item, Equipment, InventoryData } from '../../src/types/game.js';

describe('InventoryScreen', () => {
  const mockUnit1: PlayerUnit = {
    id: 'unit-1',
    name: 'Hero',
    role: 'Tank',
    tags: ['Holy'],
    level: 1,
    experience: 0,
    rank: 'C',
    hp: 50,
    maxHp: 100,
    atk: 20,
    def: 15,
    speed: 10,
  };

  const mockUnit2: PlayerUnit = {
    id: 'unit-2',
    name: 'Warrior',
    role: 'DPS',
    tags: ['Arcane'],
    level: 1,
    experience: 0,
    rank: 'C',
    hp: 100, // Full HP
    maxHp: 100,
    atk: 30,
    def: 10,
    speed: 12,
  };

  const mockUnit3KOd: PlayerUnit = {
    id: 'unit-3',
    name: 'Rogue',
    role: 'DPS',
    tags: [],
    level: 1,
    experience: 0,
    rank: 'C',
    hp: 0, // KO'd
    maxHp: 80,
    atk: 25,
    def: 8,
    speed: 15,
  };

  const mockHealthPotion: Item = {
    id: 'health_potion',
    name: 'Health Potion',
    type: 'consumable',
    rarity: 'common',
    description: 'Restores 50 HP',
    stats: { hpRestore: 50 },
  };

  const mockMegaPotion: Item = {
    id: 'mega_potion',
    name: 'Mega Potion',
    type: 'consumable',
    rarity: 'rare',
    description: 'Restores 100 HP',
    stats: { hpRestore: 100 },
  };

  const mockPhoenixDown: Item = {
    id: 'phoenix_down',
    name: 'Phoenix Down',
    type: 'consumable',
    rarity: 'rare',
    description: 'Revives a KO\'d unit',
    stats: { hpRestore: 50 },
  };

  const mockWeapon: Equipment = {
    id: 'sword-1',
    name: 'Iron Sword',
    description: 'A sturdy sword',
    slot: 'weapon',
    rarity: 'common',
    stats: { atk: 10 },
  };

  const createInventory = (items: Item[], unequippedItems: Equipment[] = []): InventoryData => ({
    items,
    equippedItems: new Map() as ReadonlyMap<string, Equipment>,
    unequippedItems,
    maxItemSlots: 50,
    maxEquipmentSlots: 50,
  });

  describe('Rendering', () => {
    test('renders screen with header and sections', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      expect(screen.getByText(/📦 Inventory/i)).toBeInTheDocument();
      expect(screen.getByText(/Consumables \(0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Unequipped Items \(0\)/i)).toBeInTheDocument();
    });

    test('displays consumable items', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([mockHealthPotion, mockMegaPotion])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      expect(screen.getByText(/Consumables \(2\)/i)).toBeInTheDocument();
      expect(screen.getByText('Health Potion')).toBeInTheDocument();
      expect(screen.getByText('Mega Potion')).toBeInTheDocument();
      // Items may have duplicate text (description + stat display)
      expect(screen.getAllByText('Restores 50 HP').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Restores 100 HP').length).toBeGreaterThan(0);
    });

    test('displays unequipped items', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([], [mockWeapon])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      expect(screen.getByText(/Unequipped Items \(1\)/i)).toBeInTheDocument();
      expect(screen.getByText('Iron Sword')).toBeInTheDocument();
    });

    test('shows empty state when no consumables', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      expect(screen.getByText('No consumable items')).toBeInTheDocument();
    });

    test('shows empty state when no unequipped items', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      expect(screen.getByText('No unequipped items')).toBeInTheDocument();
    });
  });

  describe('Item Usage', () => {
    test('clicking Use button opens target selection modal', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([mockHealthPotion])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      const useButton = screen.getByRole('button', { name: /Use/i });
      fireEvent.click(useButton);

      expect(screen.getByText(/Use Health Potion on:/i)).toBeInTheDocument();
    });

    test('modal shows all team members', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1, mockUnit2]}
          inventory={createInventory([mockHealthPotion])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      const useButton = screen.getByRole('button', { name: /Use/i });
      fireEvent.click(useButton);

      expect(screen.getByText('Hero')).toBeInTheDocument();
      expect(screen.getByText('Warrior')).toBeInTheDocument();
      expect(screen.getByText('HP: 50/100')).toBeInTheDocument();
      expect(screen.getByText('HP: 100/100')).toBeInTheDocument();
    });

    test('disables targets that cannot use the item', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1, mockUnit2]} // mockUnit2 at full HP
          inventory={createInventory([mockHealthPotion])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      const useButton = screen.getByRole('button', { name: /Use/i });
      fireEvent.click(useButton);

      const targetButtons = screen.getAllByRole('button').filter(b => 
        b.textContent?.includes('Hero') || b.textContent?.includes('Warrior')
      );

      // mockUnit1 (injured) should be enabled, mockUnit2 (full HP) should be disabled
      const heroButton = targetButtons.find(b => b.textContent?.includes('Hero'));
      const warriorButton = targetButtons.find(b => b.textContent?.includes('Warrior'));

      expect(heroButton).not.toBeDisabled();
      expect(warriorButton).toBeDisabled();
    });

    test('using item on target calls onUpdateInventory and onUpdateTeam', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([mockHealthPotion])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      // Open modal
      const useButton = screen.getByRole('button', { name: /Use/i });
      fireEvent.click(useButton);

      // Select target
      const heroButton = screen.getAllByRole('button').find(b => 
        b.textContent?.includes('Hero') && b.textContent?.includes('HP: 50/100')
      );
      fireEvent.click(heroButton!);

      // Check callbacks were called
      expect(mockOnUpdateInventory).toHaveBeenCalledTimes(1);
      expect(mockOnUpdateTeam).toHaveBeenCalledTimes(1);

      // Verify inventory was updated (item removed)
      const inventoryArg = mockOnUpdateInventory.mock.calls[0][0];
      expect(inventoryArg.items.length).toBe(0); // Item consumed

      // Verify team was updated (HP restored)
      const teamArg = mockOnUpdateTeam.mock.calls[0][0];
      expect(teamArg[0].hp).toBe(100); // 50 + 50 = 100
    });

    test('closes modal after successful use', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([mockHealthPotion])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      // Open modal
      const useButton = screen.getByRole('button', { name: /Use/i });
      fireEvent.click(useButton);

      // Select target
      const heroButton = screen.getAllByRole('button').find(b => 
        b.textContent?.includes('Hero')
      );
      fireEvent.click(heroButton!);

      // Modal should be closed
      expect(screen.queryByText(/Use Health Potion on:/i)).not.toBeInTheDocument();
    });

    test('Cancel button closes modal without making changes', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([mockHealthPotion])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      // Open modal
      const useButton = screen.getByRole('button', { name: /Use/i });
      fireEvent.click(useButton);

      // Click Cancel
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      // Modal should be closed
      expect(screen.queryByText(/Use Health Potion on:/i)).not.toBeInTheDocument();

      // No updates should have been called
      expect(mockOnUpdateInventory).not.toHaveBeenCalled();
      expect(mockOnUpdateTeam).not.toHaveBeenCalled();
    });
  });

  describe('Item Validation', () => {
    test('disables Use button when no valid targets exist', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit2]} // Full HP
          inventory={createInventory([mockHealthPotion])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      const noTargetsButton = screen.getByRole('button', { name: /No Valid Targets/i });
      expect(noTargetsButton).toBeDisabled();
    });

    test('Phoenix Down only usable on KO\'d units', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1, mockUnit3KOd]} // mockUnit1 alive, mockUnit3KOd KO'd
          inventory={createInventory([mockPhoenixDown])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      // Open modal
      const useButton = screen.getByRole('button', { name: /Use/i });
      fireEvent.click(useButton);

      const targetButtons = screen.getAllByRole('button').filter(b => 
        b.textContent?.includes('Hero') || b.textContent?.includes('Rogue')
      );

      // mockUnit1 (alive) should be disabled, mockUnit3KOd (KO'd) should be enabled
      const heroButton = targetButtons.find(b => b.textContent?.includes('Hero'));
      const rogueButton = targetButtons.find(b => b.textContent?.includes('Rogue'));

      expect(heroButton).toBeDisabled();
      expect(rogueButton).not.toBeDisabled();
    });

    test('shows error message for invalid targets', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1, mockUnit2]} // mockUnit2 at full HP
          inventory={createInventory([mockHealthPotion])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      // Open modal
      const useButton = screen.getByRole('button', { name: /Use/i });
      fireEvent.click(useButton);

      // Check for error message next to full HP unit
      expect(screen.getByText(/already at full HP/i)).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    test('Close button calls onClose', () => {
      const mockOnClose = vi.fn();
      const mockOnUpdateInventory = vi.fn();
      const mockOnUpdateTeam = vi.fn();

      render(
        <InventoryScreen
          team={[mockUnit1]}
          inventory={createInventory([])}
          onClose={mockOnClose}
          onUpdateInventory={mockOnUpdateInventory}
          onUpdateTeam={mockOnUpdateTeam}
        />
      );

      const closeButton = screen.getByRole('button', { name: /Close/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
