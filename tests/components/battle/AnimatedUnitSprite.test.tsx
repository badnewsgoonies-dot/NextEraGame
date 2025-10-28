import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedUnitSprite } from '../../../src/components/battle/AnimatedUnitSprite.js';
import type { BattleUnit } from '../../../src/types/game.js';

describe('AnimatedUnitSprite', () => {
  const createTestUnit = (overrides = {}): BattleUnit => ({
    id: 'unit-1',
    name: 'Warrior',
    role: 'Tank',
    isPlayer: true,
    currentHp: 100,
    maxHp: 100,
    attack: 20,
    defense: 15,
    speed: 10,
    level: 5,
    experience: 0,
    ...overrides,
  });

  describe('Sprite Facing Direction', () => {
    test('party sprites face right by default (no flip)', () => {
      const unit = createTestUnit();
      render(<AnimatedUnitSprite unit={unit} />);

      const img = screen.getByRole('img', { name: unit.name });
      expect(img).toBeInTheDocument();

      // Check that transform does NOT include scaleX(-1)
      // Party sprites should face right (toward enemies) without flipping
      const style = window.getComputedStyle(img);
      const transform = img.style.transform || style.transform;

      // Should not have scaleX(-1) - either no transform or other transforms only
      if (transform && transform !== 'none') {
        expect(transform).not.toContain('scaleX(-1)');
      }
    });

    test('party sprite maintains correct facing across all units', () => {
      const units = ['Warrior', 'Mage', 'Cleric', 'Ranger'];

      for (const unitName of units) {
        const unit = createTestUnit({ name: unitName, id: `${unitName}-1` });
        const { unmount } = render(<AnimatedUnitSprite unit={unit} />);

        const img = screen.getByRole('img', { name: unitName });
        const style = window.getComputedStyle(img);
        const transform = img.style.transform || style.transform;

        // No horizontal flip for party members
        if (transform && transform !== 'none') {
          expect(transform).not.toContain('scaleX(-1)');
        }

        unmount();
      }
    });
  });

  describe('Visual States', () => {
    test('renders alive unit normally', async () => {
      const unit = createTestUnit({ currentHp: 50 });
      render(<AnimatedUnitSprite unit={unit} />);

      const img = screen.getByRole('img', { name: unit.name });

      // Wait for sprite to load (starts with opacity-0, then transitions to opacity-100)
      // We're just verifying the component renders without errors
      expect(img).toBeInTheDocument();
    });

    test('renders dead unit with grayscale filter', () => {
      const unit = createTestUnit({ currentHp: 0 });
      render(<AnimatedUnitSprite unit={unit} />);

      const img = screen.getByRole('img', { name: unit.name });

      // Check inline style for grayscale filter
      expect(img.style.filter).toContain('grayscale');
    });

    test('shows KO overlay for dead units', () => {
      const unit = createTestUnit({ currentHp: 0 });
      render(<AnimatedUnitSprite unit={unit} />);

      expect(screen.getByText('KO')).toBeInTheDocument();
    });
  });

  describe('Sprite Set Loading', () => {
    test('renders proper size for party sprites', () => {
      const unit = createTestUnit();
      render(<AnimatedUnitSprite unit={unit} />);

      const img = screen.getByRole('img', { name: unit.name });

      // Party sprites are 160x160 (w-40 h-40)
      expect(img).toHaveClass('w-40', 'h-40');
      expect(img).toHaveAttribute('width', '160');
      expect(img).toHaveAttribute('height', '160');
    });
  });

  describe('Accessibility', () => {
    test('has proper alt text for screen readers', () => {
      const unit = createTestUnit({ name: 'Guardian' });
      render(<AnimatedUnitSprite unit={unit} />);

      expect(screen.getByAltText('Guardian')).toBeInTheDocument();
    });
  });
});
