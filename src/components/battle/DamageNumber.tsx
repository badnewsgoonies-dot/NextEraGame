/*
 * DamageNumber: Animated damage popup with floating and fade effects
 * Enhanced with scale, bounce, and color variations based on damage amount
 */

import React, { useEffect, useState } from 'react';

export interface DamageNumberProps {
  damage: number;
  x: number; // Position X (%)
  y: number; // Position Y (%)
  onComplete?: () => void;
}

export function DamageNumber({ damage, x, y, onComplete }: DamageNumberProps): React.ReactElement {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-remove after animation completes
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return <></>;

  // Color and size variations based on damage amount
  const isCritical = damage > 50; // Critical hits are larger and more intense
  const isHeavy = damage > 30;   // Heavy hits are red with orange glow
  const isMedium = damage > 15;  // Medium hits are standard red

  const textColor = isCritical
    ? 'text-red-500'
    : isHeavy
    ? 'text-red-600'
    : isMedium
    ? 'text-orange-500'
    : 'text-yellow-500';

  const textSize = isCritical ? 'text-6xl' : isHeavy ? 'text-5xl' : 'text-4xl';

  const glowColor = isCritical
    ? 'drop-shadow-[0_0_16px_rgba(220,38,38,0.9)]'
    : isHeavy
    ? 'drop-shadow-[0_0_12px_rgba(234,88,12,0.8)]'
    : 'drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]';

  return (
    <div
      className="absolute pointer-events-none z-50 animate-damage-popup"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className={`${textSize} font-black ${textColor} ${glowColor}`}
        style={{
          textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 4px 4px 8px rgba(0,0,0,0.9)',
          WebkitTextStroke: '2px black',
        }}
      >
        -{damage}
      </div>
    </div>
  );
}

