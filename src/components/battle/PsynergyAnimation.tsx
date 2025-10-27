/*
 * PsynergyAnimation: Golden Sun spell sprite display
 *
 * Displays animated GIF sprites from Golden Sun at target location.
 * Sprites are authentic assets from the original games.
 *
 * Features:
 * - Automatic sprite selection based on spell ID
 * - Size adjustment for AOE vs single-target spells
 * - Pixel art preservation (crisp rendering)
 * - Automatic cleanup after animation completes
 * - Error handling for missing sprites
 *
 * Design Philosophy:
 * - Authentic Golden Sun visual experience
 * - Performant (GIF plays once, then cleanup)
 * - Positioned precisely at target location
 */

import React, { useEffect } from 'react';
import { getPsynergySprite, getPsynergySpriteSize } from '../../data/psynergySprites.js';

export interface PsynergyAnimationProps {
  /** Spell ID to determine which sprite to display */
  readonly spellId: string;
  /** Screen position where sprite should appear (pixels) */
  readonly position: { x: number; y: number };
  /** Spell target type (for size determination) */
  readonly targetType?: string;
  /** Optional size override (pixels) */
  readonly size?: number;
  /** Callback when animation completes */
  readonly onComplete: () => void;
}

/**
 * PsynergyAnimation displays Golden Sun spell sprites
 *
 * GIFs are animated once (most Golden Sun psynergy GIFs are 1-2 seconds).
 * Component auto-removes after 2 seconds to ensure full playback.
 *
 * Sprite files located in:
 * - /public/sprites/psynergy/ (battle animations)
 * - /public/sprites/golden-sun/icons/psynergy/ (ability icons)
 *
 * @example
 * ```tsx
 * <PsynergyAnimation
 *   spellId="fire_blast"
 *   position={{ x: 500, y: 300 }}
 *   targetType="single_enemy"
 *   onComplete={() => setAnimating(false)}
 * />
 * ```
 */
export function PsynergyAnimation({
  spellId,
  position,
  targetType = 'single_enemy',
  size,
  onComplete,
}: PsynergyAnimationProps): React.ReactElement {
  const spriteUrl = getPsynergySprite(spellId);
  const spriteSize = size || getPsynergySpriteSize(targetType);

  useEffect(() => {
    // Golden Sun psynergy GIFs typically play for 1-2 seconds
    // Add buffer for load time to ensure full playback
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute pointer-events-none z-[999]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)', // Center on position
        width: `${spriteSize}px`,
        height: `${spriteSize}px`,
      }}
      role="presentation"
      aria-hidden="true"
    >
      <img
        src={spriteUrl}
        alt={`psynergy-${spellId}`}
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated', // Preserve pixel art quality
          objectFit: 'contain',
        }}
        onError={e => {
          console.error(`Failed to load psynergy sprite: ${spriteUrl}`);
          // Hide broken image
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}
