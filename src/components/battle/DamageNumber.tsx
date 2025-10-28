/**
 * DamageNumber: Floating combat text component
 *
 * Features:
 * - Displays damage, healing, or miss text
 * - Floats upward with scale animation
 * - Color-coded by type (damage=red, heal=green, miss=gray, critical=bright red)
 * - Different sizes for emphasis
 * - Text shadows for visibility
 * - Auto-cleanup after animation completes
 *
 * Design:
 * - Uses existing damage-float CSS animation from index.css
 * - GPU-accelerated with willChange hint
 * - Positioned absolutely at target coordinates
 * - Respects user's reduced motion preferences
 */

import React, { useEffect } from 'react';

// ============================================
// Component Interface
// ============================================

export interface DamageNumberProps {
  /** Amount to display (absolute value) */
  amount: number;
  /** Type of damage number (affects color and size) */
  type: 'damage' | 'heal' | 'miss' | 'critical';
  /** Screen position where number should appear */
  position: { x: number; y: number };
  /** Callback when animation completes (for cleanup) */
  onComplete: () => void;
  /** Optional duration override (default: 1000ms) */
  duration?: number;
}

// ============================================
// Styling Configuration
// ============================================

/**
 * Get color classes and sizing based on damage type
 */
function getTypeStyles(type: DamageNumberProps['type']): {
  textClass: string;
  sizeClass: string;
  shadowClass: string;
} {
  switch (type) {
    case 'damage':
      return {
        textClass: 'text-red-500',
        sizeClass: 'text-3xl',
        shadowClass: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
      };
    case 'critical':
      return {
        textClass: 'text-red-600',
        sizeClass: 'text-4xl',
        shadowClass: 'drop-shadow-[0_3px_6px_rgba(255,0,0,0.8)]',
      };
    case 'heal':
      return {
        textClass: 'text-green-500',
        sizeClass: 'text-3xl',
        shadowClass: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
      };
    case 'miss':
      return {
        textClass: 'text-gray-500',
        sizeClass: 'text-2xl',
        shadowClass: 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]',
      };
  }
}

// ============================================
// Main Component
// ============================================

/**
 * DamageNumber renders floating combat text
 *
 * The component:
 * 1. Renders at absolute position
 * 2. Plays damage-float animation (upward movement with fade)
 * 3. Calls onComplete after duration
 * 4. Cleans up automatically
 *
 * Animation sequence:
 * - 0ms: Fade in, scale up slightly
 * - 500ms: Reach peak (highest point)
 * - 1000ms: Fade out, complete
 *
 * @example
 * ```tsx
 * <DamageNumber
 *   amount={50}
 *   type="damage"
 *   position={{ x: 400, y: 300 }}
 *   onComplete={() => removeDamageNumber(id)}
 * />
 * ```
 */
export function DamageNumber({
  amount,
  type,
  position,
  onComplete,
  duration = 1000,
}: DamageNumberProps): React.ReactElement {
  // ============================================
  // Auto-cleanup After Duration
  // ============================================

  useEffect(() => {
    const timer = setTimeout(onComplete, duration);

    // Important: clear timeout if component unmounts early
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // ============================================
  // Render Configuration
  // ============================================

  const styles = getTypeStyles(type);
  const displayText = type === 'miss' ? 'MISS' : amount.toString();

  return (
    <div
      className={`
        absolute
        pointer-events-none
        select-none
        z-[1000]
        font-mono
        font-bold
        animate-damage-float
        ${styles.textClass}
        ${styles.sizeClass}
        ${styles.shadowClass}
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)', // Center on position
        willChange: 'transform, opacity', // GPU acceleration hint
      }}
      role="presentation"
      aria-hidden="true"
      data-testid="damage-number"
    >
      {displayText}
    </div>
  );
}
