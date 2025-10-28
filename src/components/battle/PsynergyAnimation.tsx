/**
 * PsynergyAnimation: Golden Sun psynergy sprite display component
 *
 * Features:
 * - Displays actual Golden Sun psynergy GIF sprites
 * - Positioned absolutely at target location
 * - Preserves pixel art aesthetic with image-rendering: pixelated
 * - Auto-cleanup after GIF animation duration
 * - Error handling for missing sprites
 *
 * Design:
 * - Uses actual sprite assets from /public/sprites/psynergy/
 * - Sprite mapping via psynergySprites.ts
 * - Typical GIF duration: 1-2 seconds
 * - Larger size for AoE spells (192px vs 128px)
 */

import React, { useEffect } from 'react';
import { getPsynergySprite } from '../../data/psynergySprites.js';

// ============================================
// Component Interface
// ============================================

export interface PsynergyAnimationProps {
  /** Spell ID to determine which psynergy sprite to show */
  spellId: string;
  /** Screen position where sprite should appear (pixels) */
  position: { x: number; y: number };
  /** Size of the sprite in pixels (default: 128) */
  size?: number;
  /** Callback when animation completes (for cleanup) */
  onComplete: () => void;
  /** Duration override in milliseconds (default: 2000) */
  duration?: number;
}

// ============================================
// Main Component
// ============================================

/**
 * PsynergyAnimation renders Golden Sun psynergy sprite GIFs
 *
 * The component:
 * 1. Loads the appropriate GIF sprite for the spell
 * 2. Positions it at the target location
 * 3. Plays the GIF animation (browser handles playback)
 * 4. Calls onComplete after duration
 * 5. Cleans up automatically
 *
 * @example
 * ```tsx
 * <PsynergyAnimation
 *   spellId="fire_blast"
 *   position={{ x: 400, y: 300 }}
 *   size={128}
 *   onComplete={() => removePsynergyAnimation(id)}
 * />
 * ```
 */
export function PsynergyAnimation({
  spellId,
  position,
  size = 128,
  onComplete,
  duration = 2000,
}: PsynergyAnimationProps): React.ReactElement {
  // ============================================
  // Get Sprite for Spell
  // ============================================

  const spriteUrl = getPsynergySprite(spellId);

  // ============================================
  // Auto-cleanup After Duration
  // ============================================

  useEffect(() => {
    // Golden Sun psynergy GIFs typically play for 1-2 seconds
    // Add buffer for load time
    const timer = setTimeout(onComplete, duration);

    // Important: clear timeout if component unmounts early
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // ============================================
  // Render
  // ============================================

  return (
    <div
      className="absolute pointer-events-none z-[999]"
      style={{
        left: position.x - size / 2, // Center horizontally
        top: position.y - size / 2,  // Center vertically
        width: size,
        height: size,
      }}
      role="presentation"
      aria-hidden="true"
      data-testid="psynergy-animation"
    >
      <img
        src={spriteUrl}
        alt={`psynergy-${spellId}`}
        className="pixelated" // Use existing pixelated class from index.css
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        onError={(e) => {
          console.error('Failed to load psynergy sprite:', spriteUrl);
          // Hide the image on error
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}
