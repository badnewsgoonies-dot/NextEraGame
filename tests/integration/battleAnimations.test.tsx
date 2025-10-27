/**
 * Battle Animations Integration Tests
 *
 * Tests for SESSION 4 psynergy animations, damage numbers, and visual effects
 */

import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { DamageNumber } from '../../src/components/battle/DamageNumber.js';
import { PsynergyAnimation } from '../../src/components/battle/PsynergyAnimation.js';
import { getPsynergySprite, getPsynergySpriteSize } from '../../src/data/psynergySprites.js';

describe('DamageNumber Component', () => {
  it('renders damage amount correctly', () => {
    const { container } = render(
      <DamageNumber
        amount={50}
        type="damage"
        position={{ x: 100, y: 100 }}
        onComplete={() => {}}
      />
    );

    expect(container.textContent).toBe('50');
  });

  it('shows MISS for miss type', () => {
    const { container } = render(
      <DamageNumber
        amount={0}
        type="miss"
        position={{ x: 100, y: 100 }}
        onComplete={() => {}}
      />
    );

    expect(container.textContent).toBe('MISS');
  });

  it('calls onComplete after animation duration', async () => {
    const onComplete = vi.fn();

    render(
      <DamageNumber
        amount={50}
        type="damage"
        position={{ x: 100, y: 100 }}
        onComplete={onComplete}
      />
    );

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('applies correct styling for damage type', () => {
    const { container } = render(
      <DamageNumber
        amount={50}
        type="damage"
        position={{ x: 100, y: 100 }}
        onComplete={() => {}}
      />
    );

    const element = container.querySelector('.text-red-500');
    expect(element).toBeTruthy();
  });

  it('applies correct styling for heal type', () => {
    const { container } = render(
      <DamageNumber
        amount={30}
        type="heal"
        position={{ x: 100, y: 100 }}
        onComplete={() => {}}
      />
    );

    const element = container.querySelector('.text-green-400');
    expect(element).toBeTruthy();
  });

  it('applies correct styling for critical type', () => {
    const { container } = render(
      <DamageNumber
        amount={100}
        type="critical"
        position={{ x: 100, y: 100 }}
        onComplete={() => {}}
      />
    );

    const element = container.querySelector('.text-red-600');
    expect(element).toBeTruthy();
  });
});

describe('PsynergyAnimation Component', () => {
  it('renders sprite image with correct src', () => {
    const { container } = render(
      <PsynergyAnimation
        spellId="fire_blast"
        position={{ x: 100, y: 100 }}
        onComplete={() => {}}
      />
    );

    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toContain('psynergy');
  });

  it('calls onComplete after animation duration', async () => {
    const onComplete = vi.fn();

    render(
      <PsynergyAnimation
        spellId="fire_blast"
        position={{ x: 100, y: 100 }}
        onComplete={onComplete}
      />
    );

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 2500 });
  });

  it('uses pixelated image rendering', () => {
    const { container } = render(
      <PsynergyAnimation
        spellId="fire_blast"
        position={{ x: 100, y: 100 }}
        onComplete={() => {}}
      />
    );

    const img = container.querySelector('img');
    expect(img?.style.imageRendering).toBe('pixelated');
  });
});

describe('Psynergy Sprite Utilities', () => {
  it('returns correct sprite path for fire_blast', () => {
    const sprite = getPsynergySprite('fire_blast');
    expect(sprite).toContain('/sprites/psynergy/');
    expect(sprite).toMatch(/\.gif$/);
  });

  it('returns fallback sprite for unknown spell', () => {
    const sprite = getPsynergySprite('unknown_spell_xyz');
    expect(sprite).toContain('/sprites/');
    expect(sprite).toMatch(/\.gif$/);
  });

  it('returns larger size for AoE spells', () => {
    const sizeAoE = getPsynergySpriteSize('all_enemies');
    const sizeSingle = getPsynergySpriteSize('single_enemy');

    expect(sizeAoE).toBeGreaterThan(sizeSingle);
    expect(sizeAoE).toBe(192);
    expect(sizeSingle).toBe(128);
  });

  it('maps all element basic spells correctly', () => {
    const spells = ['fire_blast', 'lightning_strike', 'healing_wave', 'stone_wall', 'divine_shield', 'shadow_strike'];

    spells.forEach(spellId => {
      const sprite = getPsynergySprite(spellId);
      expect(sprite).toBeTruthy();
      expect(sprite).toMatch(/\.gif$/);
    });
  });
});

describe('Animation Integration', () => {
  it('multiple damage numbers can render simultaneously', () => {
    const { container } = render(
      <div>
        <DamageNumber
          amount={50}
          type="damage"
          position={{ x: 100, y: 100 }}
          onComplete={() => {}}
        />
        <DamageNumber
          amount={30}
          type="heal"
          position={{ x: 200, y: 100 }}
          onComplete={() => {}}
        />
        <DamageNumber
          amount={0}
          type="miss"
          position={{ x: 300, y: 100 }}
          onComplete={() => {}}
        />
      </div>
    );

    expect(container.textContent).toContain('50');
    expect(container.textContent).toContain('30');
    expect(container.textContent).toContain('MISS');
  });

  it('damage number has proper accessibility attributes', () => {
    const { container } = render(
      <DamageNumber
        amount={50}
        type="damage"
        position={{ x: 100, y: 100 }}
        onComplete={() => {}}
      />
    );

    const element = container.querySelector('[role="status"]');
    expect(element).toBeTruthy();
    expect(element?.getAttribute('aria-live')).toBe('polite');
    expect(element?.getAttribute('aria-label')).toContain('damage');
  });
});
