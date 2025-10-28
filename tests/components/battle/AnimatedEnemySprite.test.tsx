import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedEnemySprite } from '../../../src/components/battle/AnimatedEnemySprite.js';
import type { BattleUnit } from '../../../src/types/game.js';

describe('AnimatedEnemySprite', () => {
  const createTestEnemy = (overrides = {}): BattleUnit => ({
    id: 'enemy-1',
    name: 'Bear Guardian',
    role: 'Tank',
    isPlayer: false,
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
    test('enemy sprites are flipped to face left (toward party)', () => {
      const enemy = createTestEnemy();
      render(<AnimatedEnemySprite unit={enemy} />);

      const img = screen.getByRole('img', { name: enemy.name });
      expect(img).toBeInTheDocument();

      // Check that transform includes scaleX(-1) to flip horizontally
      const style = window.getComputedStyle(img);
      const transform = img.style.transform || style.transform;

      // scaleX(-1) flips the sprite horizontally
      expect(transform).toContain('scaleX(-1)');
    });

    test('flipped sprite maintains correct rendering', () => {
      const enemy = createTestEnemy();
      render(<AnimatedEnemySprite unit={enemy} />);

      const img = screen.getByRole('img', { name: enemy.name });

      // Verify the image is visible and properly styled
      expect(img).toHaveClass('w-32', 'h-32', 'object-contain');
      expect(img).toHaveAttribute('width', '128');
      expect(img).toHaveAttribute('height', '128');
    });
  });

  describe('Visual States', () => {
    test('renders alive enemy with full opacity', () => {
      const enemy = createTestEnemy({ currentHp: 50 });
      render(<AnimatedEnemySprite unit={enemy} />);

      const img = screen.getByRole('img', { name: enemy.name });
      expect(img).toHaveClass('opacity-100');
    });

    test('renders dead enemy with reduced opacity', () => {
      const enemy = createTestEnemy({ currentHp: 0 });
      render(<AnimatedEnemySprite unit={enemy} />);

      const img = screen.getByRole('img', { name: enemy.name });
      expect(img).toHaveClass('opacity-30', 'grayscale');
    });

    test('shows death overlay skull for dead enemies', () => {
      const enemy = createTestEnemy({ currentHp: 0 });
      render(<AnimatedEnemySprite unit={enemy} />);

      // Look for the skull emoji
      expect(screen.getByText('💀')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper alt text for screen readers', () => {
      const enemy = createTestEnemy({ name: 'Dire Wolf' });
      render(<AnimatedEnemySprite unit={enemy} />);

      expect(screen.getByAltText('Dire Wolf')).toBeInTheDocument();
    });
  });
});
