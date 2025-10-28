/**
 * useFlashEffect: Screen flash overlay effect hook
 *
 * Features:
 * - Color-coded flashes (red for damage, green for heal, etc.)
 * - Brief duration (150ms)
 * - Fades in and out smoothly
 * - Multiple simultaneous flashes supported
 * - Non-blocking overlay
 *
 * Design:
 * - Returns flash function and FlashOverlay component
 * - FlashOverlay should be rendered in app root
 * - Uses CSS animations for smooth fade
 */

import React, { useState, useCallback } from 'react';

// ============================================
// Types
// ============================================

interface FlashInstance {
  id: string;
  color: string;
}

// ============================================
// Hook
// ============================================

export function useFlashEffect() {
  const [flashes, setFlashes] = useState<FlashInstance[]>([]);

  const flash = useCallback((color: string = 'rgba(255, 255, 255, 0.5)') => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Skip animation if user prefers reduced motion
    }

    const timestamp = Date.now();
    const random = Math.random();
    const id = 'flash-' + timestamp + '-' + random;
    setFlashes(prev => [...prev, { id, color }]);

    // Remove flash after duration
    setTimeout(() => {
      setFlashes(prev => prev.filter(f => f.id !== id));
    }, 150); // Quick flash
  }, []);

  // Component to render flashes (must be called in render)
  const FlashOverlay = useCallback((): React.ReactElement | null => {
    if (flashes.length === 0) return null;

    return (
      <>
        {flashes.map(f => (
          <div
            key={f.id}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: f.color,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            className="animate-flash-fade"
            role="presentation"
            aria-hidden="true"
          />
        ))}
      </>
    );
  }, [flashes]);

  return { flash, FlashOverlay };
}
