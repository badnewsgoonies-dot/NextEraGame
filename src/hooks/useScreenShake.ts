/*
 * useScreenShake: Screen shake effect for battle impact
 *
 * Provides a subtle but noticeable screen shake effect
 * that scales with damage intensity.
 *
 * Features:
 * - Three intensity levels (light, medium, heavy)
 * - Smooth 60fps animation using requestAnimationFrame
 * - Automatic reset after shake completes
 * - No layout shift (uses CSS transform)
 *
 * Design Philosophy:
 * - Subtle enhancement, not distracting
 * - Short duration (300ms) for responsiveness
 * - Scales intensity with damage dealt
 */

import { useCallback } from 'react';

export type ShakeIntensity = 'light' | 'medium' | 'heavy';

/**
 * Intensity to pixel displacement mapping
 */
const INTENSITY_MAP: Record<ShakeIntensity, number> = {
  light: 4,
  medium: 8,
  heavy: 16,
};

/**
 * useScreenShake hook provides screen shake functionality
 *
 * Shakes the entire document body using CSS transform.
 * The shake is random within the intensity bounds for natural feel.
 *
 * @returns shake function to trigger effect
 *
 * @example
 * ```tsx
 * const { shake } = useScreenShake();
 *
 * // On damage dealt
 * if (damage > 100) shake('heavy');
 * else if (damage > 50) shake('medium');
 * else shake('light');
 * ```
 */
export function useScreenShake() {
  const shake = useCallback((intensity: ShakeIntensity = 'medium') => {
    const pixels = INTENSITY_MAP[intensity];
    const duration = 300; // milliseconds

    const element = document.body;
    const originalTransform = element.style.transform;

    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (elapsed < duration) {
        // Random offset within intensity bounds
        const x = (Math.random() - 0.5) * pixels * 2;
        const y = (Math.random() - 0.5) * pixels * 2;
        element.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animate);
      } else {
        // Reset to original state
        element.style.transform = originalTransform;
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return { shake };
}
