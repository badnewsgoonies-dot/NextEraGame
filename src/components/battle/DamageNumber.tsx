/*
 * DamageNumber: Animated damage/heal/status popup
 *
 * Floats upward and fades out with type-specific styling.
 *
 * Features:
 * - Multiple types: damage, heal, miss, critical
 * - Type-specific colors and sizes
 * - Smooth CSS animation
 * - Accessible with ARIA labels
 *
 * Design matches Golden Sun's floating combat text aesthetic.
 */

import React, { useEffect, useState } from 'react';

export type DamageNumberType = 'damage' | 'heal' | 'miss' | 'critical';

export interface DamageNumberProps {
  /** Amount to display (use absolute value) */
  readonly amount: number;
  /** Type of number (determines color and size) */
  readonly type: DamageNumberType;
  /** Position in pixels (absolute screen coordinates) */
  readonly position: { x: number; y: number };
  /** Callback when animation completes */
  readonly onComplete: () => void;
}

/**
 * Type-specific styling configuration
 */
const TYPE_STYLES: Record<DamageNumberType, { color: string; size: string; shadow: string }> = {
  damage: {
    color: 'text-red-500',
    size: 'text-4xl',
    shadow: 'drop-shadow-[0_2px_8px_rgba(239,68,68,0.8)]',
  },
  critical: {
    color: 'text-red-600',
    size: 'text-5xl',
    shadow: 'drop-shadow-[0_3px_12px_rgba(220,38,38,1)]',
  },
  heal: {
    color: 'text-green-400',
    size: 'text-4xl',
    shadow: 'drop-shadow-[0_2px_8px_rgba(74,222,128,0.8)]',
  },
  miss: {
    color: 'text-gray-400',
    size: 'text-3xl',
    shadow: 'drop-shadow-[0_1px_4px_rgba(156,163,175,0.6)]',
  },
};

/**
 * DamageNumber component displays floating combat text
 *
 * Automatically animates upward and fades out over 1.5 seconds.
 * Uses CSS keyframe animation for smooth 60fps performance.
 *
 * @example
 * ```tsx
 * <DamageNumber
 *   amount={50}
 *   type="damage"
 *   position={{ x: 500, y: 300 }}
 *   onComplete={() => setShowDamage(false)}
 * />
 * ```
 */
export function DamageNumber({
  amount,
  type,
  position,
  onComplete,
}: DamageNumberProps): React.ReactElement {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-remove after animation completes (1.5s for damage-float animation)
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return <></>;

  const styles = TYPE_STYLES[type];
  const displayText = type === 'miss' ? 'MISS' : amount > 0 ? `${amount}` : '0';

  return (
    <div
      className="absolute pointer-events-none animate-damage-float z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        willChange: 'transform, opacity', // GPU acceleration
      }}
      role="status"
      aria-live="polite"
      aria-label={
        type === 'miss'
          ? 'Attack missed'
          : type === 'heal'
          ? `Healed ${amount} HP`
          : type === 'critical'
          ? `Critical hit for ${amount} damage`
          : `${amount} damage dealt`
      }
    >
      <div
        className={`font-black select-none ${styles.color} ${styles.size} ${styles.shadow}`}
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          WebkitTextStroke: type === 'critical' ? '2px rgba(0,0,0,0.8)' : '1px rgba(0,0,0,0.6)',
        }}
      >
        {displayText}
      </div>
    </div>
  );
}

