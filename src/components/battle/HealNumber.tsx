/*
 * HealNumber: Animated healing popup
 * Floats upward and fades out (green version of DamageNumber)
 */

import React, { useEffect, useState } from 'react';

export interface HealNumberProps {
  readonly amount: number;
  readonly x: number; // Position X (%)
  readonly y: number; // Position Y (%)
  readonly onComplete?: () => void;
}

export function HealNumber({ amount, x, y, onComplete }: HealNumberProps): React.ReactElement {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-remove after animation completes
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return <></>;

  return (
    <div
      className="absolute pointer-events-none animate-damage-float z-50"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      role="status"
      aria-live="polite"
      aria-label={`Healed ${amount} HP`}
    >
      <div className="text-4xl font-black text-green-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] stroke-white">
        +{amount}
      </div>
    </div>
  );
}
