import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EquipmentPanel } from '../../../src/components/roster/EquipmentPanel.js';
import type { PlayerUnit, InventoryData, Equipment } from '../../../src/types/game.js';

describe('EquipmentPanel', () => {
  // Helper: Create test unit
  const createTestUnit = (overrides?: Partial<PlayerUnit>): PlayerUnit => ({
    id: 'test-unit-1',
    templateId: 'warrior-template',
    name: 'Test Warrior',
    role: 'Tank',
    tags: [],
    element: 'Venus',
    activeGemState: { gem: null, isActivated: false },
    learnedSpells: [],
    rank: 'C',
    baseClass: 'Warrior',
    level: 5,
    experience: 0,
    hp: 80,
    maxHp: 100,
    currentMp: 30,
    atk: 25,
    def: 20,
    speed: 15,
    ...overrides
  });

  // Helper: Create test equipment
  const createTestEquipment = (overrides?: Partial<Equipment>): Equipment => ({
    id: 'test-weapon',
    name: 'Iron Sword',
    description: 'A sturdy iron sword',
    slot: 'weapon',
    stats: { atk: 10 },
    rarity: 'common',
    ...overrides
  });

  // Helper: Create empty inventory
  const createEmptyInventory = (): InventoryData => ({
    items: [],
    equippedItems: new Map(),
    unequippedItems: [],
    maxItemSlots: 50,
    maxEquipmentSlots: 50
  });

  describe('Rendering', () => {
    test('renders unit name and basic info', () => {
      const unit = createTestUnit({ name: 'Guardian', role: 'Tank', level: 10 });
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      expect(screen.getByText("Guardian's Equipment")).toBeInTheDocument();
      expect(screen.getByText('Tank • Level 10')).toBeInTheDocument();
    });

    test('renders close button', () => {
      const unit = createTestUnit();
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      const closeButtons = screen.getAllByRole('button', { name: /close/i });
      expect(closeButtons.length).toBeGreaterThan(0);
    });

    test('renders all equipment slots', () => {
      const unit = createTestUnit();
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      expect(screen.getByText(/Weapon/)).toBeInTheDocument();
      expect(screen.getByText(/Armor/)).toBeInTheDocument();
      expect(screen.getByText(/Accessory/)).toBeInTheDocument();
      expect(screen.getByText(/Gem/)).toBeInTheDocument();
    });

    test('shows Empty for unequipped slots', () => {
      const unit = createTestUnit();
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      const emptySlots = screen.getAllByText('Empty');
      expect(emptySlots.length).toBeGreaterThanOrEqual(3); // weapon, armor, accessory
    });
  });

  describe('Stats Display', () => {
    test('displays all five stats', () => {
      const unit = createTestUnit();
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      expect(screen.getByText(/HP:/)).toBeInTheDocument();
      expect(screen.getByText(/MP:/)).toBeInTheDocument();
      expect(screen.getByText(/ATK:/)).toBeInTheDocument();
      expect(screen.getByText(/DEF:/)).toBeInTheDocument();
      expect(screen.getByText(/SPD:/)).toBeInTheDocument();
    });

    test('shows base stats without equipment', () => {
      const unit = createTestUnit({ maxHp: 100, currentMp: 50, atk: 20, def: 15, speed: 10 });
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      // When no equipment, should show just the values (no arrows)
      expect(screen.getByText('100')).toBeInTheDocument(); // HP
      expect(screen.getByText('50')).toBeInTheDocument();  // MP
      expect(screen.getByText('20')).toBeInTheDocument();  // ATK
      expect(screen.getByText('15')).toBeInTheDocument();  // DEF
      expect(screen.getByText('10')).toBeInTheDocument();  // SPD
    });

    test('shows stat bonuses with equipment', () => {
      const unit = createTestUnit({ atk: 20 });
      const weapon = createTestEquipment({ stats: { atk: 10 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['test-unit-1-weapon', weapon]])
      };
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      // Should show: 20 → 30 (+10)
      expect(screen.getByText('→')).toBeInTheDocument(); // Arrow
      expect(screen.getByText('(+10)')).toBeInTheDocument(); // Bonus indicator
      // Verify ATK stat row contains the bonus display
      const container = screen.getByText('ATK:').closest('div');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Equipment Display', () => {
    test('shows equipped weapon details', () => {
      const unit = createTestUnit();
      const weapon = createTestEquipment({
        name: 'Steel Sword',
        description: 'A sharp blade',
        stats: { atk: 15 }
      });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['test-unit-1-weapon', weapon]])
      };
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      expect(screen.getByText('Steel Sword')).toBeInTheDocument();
      expect(screen.getByText('A sharp blade')).toBeInTheDocument();
      expect(screen.getByText('ATK: +15')).toBeInTheDocument();
    });

    test('shows equipped armor details', () => {
      const unit = createTestUnit();
      const armor = createTestEquipment({
        id: 'plate-armor',
        name: 'Plate Armor',
        description: 'Heavy armor',
        slot: 'armor',
        stats: { def: 20 }
      });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['test-unit-1-armor', armor]])
      };
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      expect(screen.getByText('Plate Armor')).toBeInTheDocument();
      expect(screen.getByText('Heavy armor')).toBeInTheDocument();
      expect(screen.getByText('DEF: +20')).toBeInTheDocument();
    });

    test('shows multiple equipment pieces', () => {
      const unit = createTestUnit();
      const weapon = createTestEquipment({
        name: 'Axe',
        stats: { atk: 12 }
      });
      const armor = createTestEquipment({
        id: 'chain-mail',
        name: 'Chain Mail',
        slot: 'armor',
        stats: { def: 10 }
      });
      const accessory = createTestEquipment({
        id: 'speed-boots',
        name: 'Speed Boots',
        slot: 'accessory',
        stats: { speed: 5 }
      });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([
          ['test-unit-1-weapon', weapon],
          ['test-unit-1-armor', armor],
          ['test-unit-1-accessory', accessory]
        ])
      };
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      expect(screen.getByText('Axe')).toBeInTheDocument();
      expect(screen.getByText('Chain Mail')).toBeInTheDocument();
      expect(screen.getByText('Speed Boots')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('calls onClose when close button clicked', () => {
      const unit = createTestUnit();
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      const closeButton = screen.getAllByRole('button', { name: /close/i })[0];
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when clicking overlay background', () => {
      const unit = createTestUnit();
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      const { container } = render(
        <EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />
      );

      // Click the overlay (first child of container)
      const overlay = container.firstChild as HTMLElement;
      fireEvent.click(overlay);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('does not close when clicking panel content', () => {
      const unit = createTestUnit();
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      const { container } = render(
        <EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />
      );

      // Click the panel content (child of overlay)
      const overlay = container.firstChild as HTMLElement;
      const panel = overlay.firstChild as HTMLElement;
      fireEvent.click(panel);

      // Should not have called onClose (stopPropagation works)
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('handles unit with no gem equipped', () => {
      const unit = createTestUnit({ equippedGem: undefined });
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      expect(screen.getByText('No gem equipped')).toBeInTheDocument();
    });

    test('handles equipment with multiple stat bonuses', () => {
      const unit = createTestUnit();
      const weapon = createTestEquipment({
        stats: { hp: 20, atk: 10, def: 5, speed: 2 }
      });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['test-unit-1-weapon', weapon]])
      };
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      expect(screen.getByText('HP: +20')).toBeInTheDocument();
      expect(screen.getByText('ATK: +10')).toBeInTheDocument();
      expect(screen.getByText('DEF: +5')).toBeInTheDocument();
      expect(screen.getByText('SPD: +2')).toBeInTheDocument();
    });

    test('handles equipment with empty stats object', () => {
      const unit = createTestUnit();
      const weapon = createTestEquipment({ stats: {} });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['test-unit-1-weapon', weapon]])
      };
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      // Should render equipment name but no stat bonuses
      expect(screen.getByText('Iron Sword')).toBeInTheDocument();
      // No stat bonus text should appear
      expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('close button has proper aria-label', () => {
      const unit = createTestUnit();
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      const closeButton = screen.getByLabelText('Close equipment panel');
      expect(closeButton).toBeInTheDocument();
    });

    test('panel can be dismissed with close button', () => {
      const unit = createTestUnit();
      const inventory = createEmptyInventory();
      const onClose = vi.fn();

      render(<EquipmentPanel unit={unit} inventory={inventory} onClose={onClose} />);

      const closeButton = screen.getByLabelText('Close equipment panel');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });
  });
});
