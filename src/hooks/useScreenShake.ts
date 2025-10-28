/**
 * useScreenShake: Screen shake effect hook
 *
 * Features:
 * - Intensity-based shaking (light, medium, heavy)
 * - Uses requestAnimationFrame for smooth 60fps
 * - Automatically restores original position
 * - Non-blocking (doesn't affect gameplay)
 *
 * Design:
 * - Shakes document.body element
 * - Random X/Y displacement
 * - 300ms duration
 * - Respects reduced motion preferences
 */

import { useCallback } from 'react';

// ============================================
// Types
// ============================================

export type ShakeIntensity = 'light' | 'medium' | 'heavy';

// ============================================
// Hook
// ============================================

export function useScreenShake() {
  const shake = useCallback((intensity: ShakeIntensity = 'medium') => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Skip animation if user prefers reduced motion
    }

    const intensityMap: Record<ShakeIntensity, number> = {
      light: 5,
      medium: 10,
      heavy: 20,
    };

    const pixels = intensityMap[intensity];
    const duration = 300; // milliseconds

    const element = document.body;
    const originalTransform = element.style.transform;

    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (elapsed < duration) {
        const x = (Math.random() - 0.5) * pixels;
        const y = (Math.random() - 0.5) * pixels;
        element.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animate);
      } else {
        element.style.transform = originalTransform;
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return { shake };
}
