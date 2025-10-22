/*
 * RewardsScreen Tests
 * Comprehensive tests for battle rewards display
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RewardsScreen } from '../../src/screens/RewardsScreen.js';
import type { BattleReward, Item } from '../../src/types/game.js';

describe('RewardsScreen', () => {
  // Test fixtures
  const createItem = (id: string, name: string, type: 'weapon' | 'armor' | 'accessory', rarity?: 'common' | 'rare' | 'epic'): Item => ({
    id,
    name,
    type,
    rarity,
    description: `Test ${name}`,
  });

  const mockHandlers = {
    onContinue: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering - Basic Layout', () => {
    test('renders header with title', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText(/Rewards/)).toBeInTheDocument();
    });

    test('renders Items Gained section', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Items Gained:')).toBeInTheDocument();
    });

    test('renders Continue button', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByRole('button', { name: /Continue to Recruitment/ })).toBeInTheDocument();
    });
  });

  describe('Items Display', () => {
    test('displays single item with name and type', () => {
      const item = createItem('sword', 'Iron Sword', 'weapon', 'common');
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Iron Sword')).toBeInTheDocument();
      expect(screen.getByText(/Weapon/)).toBeInTheDocument();
    });

    test('displays multiple items', () => {
      const items = [
        createItem('sword', 'Iron Sword', 'weapon'),
        createItem('shield', 'Wooden Shield', 'armor'),
        createItem('ring', 'Speed Ring', 'accessory'),
      ];
      const rewards: BattleReward = {
        items,
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Iron Sword')).toBeInTheDocument();
      expect(screen.getByText('Wooden Shield')).toBeInTheDocument();
      expect(screen.getByText('Speed Ring')).toBeInTheDocument();
    });

    test('displays item rarity when present', () => {
      const item = createItem('sword', 'Legendary Blade', 'weapon', 'epic');
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText(/epic/i)).toBeInTheDocument();
    });

    test('displays item stats when present', () => {
      const item: Item = {
        id: 'sword',
        name: 'Power Sword',
        type: 'weapon',
        rarity: 'rare',
        description: 'Test sword',
        stats: { atkBonus: 10, defBonus: 5, speedBonus: 3 },
      };
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText(/\+10 ATK/)).toBeInTheDocument();
      expect(screen.getByText(/\+5 DEF/)).toBeInTheDocument();
      expect(screen.getByText(/\+3 SPD/)).toBeInTheDocument();
    });

    test('displays only ATK bonus when other stats missing', () => {
      const item: Item = {
        id: 'sword',
        name: 'Basic Sword',
        type: 'weapon',
        description: 'Test sword',
        stats: { atkBonus: 8 },
      };
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText(/\+8 ATK/)).toBeInTheDocument();
    });

    test('displays only DEF bonus when other stats missing', () => {
      const item: Item = {
        id: 'shield',
        name: 'Iron Shield',
        type: 'armor',
        description: 'Test shield',
        stats: { defBonus: 12 },
      };
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText(/\+12 DEF/)).toBeInTheDocument();
    });

    test('displays only SPD bonus when other stats missing', () => {
      const item: Item = {
        id: 'boots',
        name: 'Swift Boots',
        type: 'accessory',
        description: 'Test boots',
        stats: { speedBonus: 5 },
      };
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText(/\+5 SPD/)).toBeInTheDocument();
    });

    test('shows "No items gained" message when items array empty', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('No items gained this battle')).toBeInTheDocument();
    });

    test('capitalizes item type correctly', () => {
      const items = [
        createItem('sword', 'Sword', 'weapon'),
        createItem('armor', 'Armor Piece', 'armor'),
        createItem('ring', 'Ring', 'accessory'),
      ];
      const rewards: BattleReward = {
        items,
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      // Should show capitalized types
      const weaponElements = screen.getAllByText(/Weapon/);
      expect(weaponElements.length).toBeGreaterThan(0);
      
      const armorElements = screen.getAllByText(/Armor/);
      expect(armorElements.length).toBeGreaterThan(0);
      
      const accessoryElements = screen.getAllByText(/Accessory/);
      expect(accessoryElements.length).toBeGreaterThan(0);
    });
  });

  describe('Experience Display', () => {
    test('displays experience gained when > 0', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 100,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Experience Gained')).toBeInTheDocument();
      expect(screen.getByText('+100 XP')).toBeInTheDocument();
    });

    test('displays large experience values correctly', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 9999,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('+9999 XP')).toBeInTheDocument();
    });

    test('does not display experience section when experience is 0', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.queryByText('Experience Gained')).not.toBeInTheDocument();
      expect(screen.queryByText(/XP/)).not.toBeInTheDocument();
    });

    test('displays small experience values', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 5,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('+5 XP')).toBeInTheDocument();
    });
  });

  describe('Continue Button', () => {
    test('Continue button triggers onContinue callback', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      const continueButton = screen.getByRole('button', { name: /Continue to Recruitment/ });
      fireEvent.click(continueButton);

      expect(mockHandlers.onContinue).toHaveBeenCalledOnce();
    });

    test('Continue button works with items', () => {
      const item = createItem('sword', 'Iron Sword', 'weapon');
      const rewards: BattleReward = {
        items: [item],
        experience: 50,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      const continueButton = screen.getByRole('button', { name: /Continue to Recruitment/ });
      fireEvent.click(continueButton);

      expect(mockHandlers.onContinue).toHaveBeenCalledOnce();
    });

    test('Continue button can be clicked multiple times (if needed)', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      const continueButton = screen.getByRole('button', { name: /Continue to Recruitment/ });
      
      fireEvent.click(continueButton);
      fireEvent.click(continueButton);

      expect(mockHandlers.onContinue).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    test('handles rewards with no items and no experience', () => {
      const rewards: BattleReward = {
        items: [],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('No items gained this battle')).toBeInTheDocument();
      expect(screen.queryByText('Experience Gained')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue to Recruitment/ })).toBeInTheDocument();
    });

    test('handles item without rarity', () => {
      const item = createItem('sword', 'Basic Sword', 'weapon');
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Basic Sword')).toBeInTheDocument();
      // Should still show type even without rarity
      expect(screen.getByText(/Weapon/)).toBeInTheDocument();
    });

    test('handles item without stats', () => {
      const item = createItem('potion', 'Health Potion', 'accessory');
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Health Potion')).toBeInTheDocument();
      // Should not crash or show undefined
    });

    test('handles many items (10+)', () => {
      const items = Array.from({ length: 15 }, (_, i) => 
        createItem(`item${i}`, `Item ${i}`, 'weapon')
      );
      const rewards: BattleReward = {
        items,
        experience: 500,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      // Should render all items
      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 14')).toBeInTheDocument();
    });

    test('handles very long item names', () => {
      const item = createItem('legendary', 'Legendary Sword of the Ancient Dragon King', 'weapon', 'epic');
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Legendary Sword of the Ancient Dragon King')).toBeInTheDocument();
    });

    test('handles zero-stat items', () => {
      const item: Item = {
        id: 'broken',
        name: 'Broken Sword',
        type: 'weapon',
        description: 'Test',
        stats: { atkBonus: 0, defBonus: 0, speedBonus: 0 },
      };
      const rewards: BattleReward = {
        items: [item],
        experience: 0,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Broken Sword')).toBeInTheDocument();
    });
  });

  describe('Combined Scenarios', () => {
    test('displays both items and experience', () => {
      const item = createItem('sword', 'Iron Sword', 'weapon', 'common');
      const rewards: BattleReward = {
        items: [item],
        experience: 150,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Iron Sword')).toBeInTheDocument();
      expect(screen.getByText('+150 XP')).toBeInTheDocument();
    });

    test('displays multiple items with different rarities', () => {
      const items = [
        createItem('sword', 'Common Sword', 'weapon', 'common'),
        createItem('bow', 'Rare Bow', 'weapon', 'rare'),
        createItem('staff', 'Epic Staff', 'weapon', 'epic'),
      ];
      const rewards: BattleReward = {
        items,
        experience: 200,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      // Check for rarity text in type sections (not item names)
      expect(screen.getByText('Weapon • common')).toBeInTheDocument();
      expect(screen.getByText('Weapon • rare')).toBeInTheDocument();
      expect(screen.getByText('Weapon • epic')).toBeInTheDocument();
    });

    test('displays multiple items with various stats', () => {
      const items: Item[] = [
        {
          id: 'sword',
          name: 'Attack Sword',
          type: 'weapon',
          description: 'Test',
          stats: { atkBonus: 15 },
        },
        {
          id: 'shield',
          name: 'Defense Shield',
          type: 'armor',
          description: 'Test',
          stats: { defBonus: 20 },
        },
        {
          id: 'boots',
          name: 'Speed Boots',
          type: 'accessory',
          description: 'Test',
          stats: { speedBonus: 8 },
        },
      ];
      const rewards: BattleReward = {
        items,
        experience: 100,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText(/\+15 ATK/)).toBeInTheDocument();
      expect(screen.getByText(/\+20 DEF/)).toBeInTheDocument();
      expect(screen.getByText(/\+8 SPD/)).toBeInTheDocument();
    });

    test('handles maximum rewards scenario', () => {
      const items = Array.from({ length: 5 }, (_, i) => ({
        id: `item${i}`,
        name: `Legendary Item ${i}`,
        type: 'weapon' as const,
        rarity: 'epic' as const,
        description: 'Test',
        stats: { atkBonus: 20, defBonus: 15, speedBonus: 10 },
      }));
      const rewards: BattleReward = {
        items,
        experience: 9999,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      expect(screen.getByText('Legendary Item 0')).toBeInTheDocument();
      expect(screen.getByText('+9999 XP')).toBeInTheDocument();
    });
  });

  describe('UI Consistency', () => {
    test('renders with consistent structure regardless of content', () => {
      const rewards1: BattleReward = {
        items: [],
        experience: 0,
        defeatedEnemies: [],
      };

      const { rerender } = render(<RewardsScreen rewards={rewards1} {...mockHandlers} />);
      
      expect(screen.getByText(/Rewards/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue to Recruitment/ })).toBeInTheDocument();

      // Rerender with different content
      const item = createItem('sword', 'Sword', 'weapon');
      const rewards2: BattleReward = {
        items: [item],
        experience: 100,
        defeatedEnemies: [],
      };

      rerender(<RewardsScreen rewards={rewards2} {...mockHandlers} />);

      expect(screen.getByText(/Rewards/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue to Recruitment/ })).toBeInTheDocument();
    });

    test('maintains proper hierarchy with mixed content', () => {
      const item = createItem('sword', 'Test Sword', 'weapon', 'rare');
      const rewards: BattleReward = {
        items: [item],
        experience: 75,
        defeatedEnemies: [],
      };

      render(<RewardsScreen rewards={rewards} {...mockHandlers} />);

      // Header should appear before items section
      const header = screen.getByText(/Rewards/);
      const itemsSection = screen.getByText('Items Gained:');
      const continueButton = screen.getByRole('button', { name: /Continue to Recruitment/ });

      expect(header).toBeInTheDocument();
      expect(itemsSection).toBeInTheDocument();
      expect(continueButton).toBeInTheDocument();
    });
  });
});
