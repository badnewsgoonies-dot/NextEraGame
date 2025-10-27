/*
 * useFlashEffect: Screen flash overlay for spell impact
 *
 * Provides a brief full-screen color flash effect
 * that synchronizes with spell damage.
 *
 * Features:
 * - Color-coded flashes (red for damage, green for heal, etc.)
 * - Brief duration (150ms) for impact without distraction
 * - Multiple simultaneous flashes supported
 * - Automatic cleanup
 * - CSS animation for smooth 60fps
 *
 * Design Philosophy:
 * - Quick flash for impact feel
 * - Semi-transparent to not obscure gameplay
 * - Color matches spell element/type
 */

import React, { useState, useCallback } from 'react';

interface FlashInstance {
  readonly id: string;
  readonly color: string;
}

/**
 * useFlashEffect hook provides screen flash functionality
 *
 * Returns a flash function to trigger colored overlays
 * and a FlashOverlay component to render in UI.
 *
 * @returns { flash, FlashOverlay }
 *
 * @example
 * const { flash, FlashOverlay } = useFlashEffect();
 * flash('rgba(255, 0, 0, 0.3)');
 */
export function useFlashEffect() {
  const [flashes, setFlashes] = useState<FlashInstance[]>([]);

  /**
   * Trigger a flash effect with specified color
   *
   * @param color - CSS color string (recommend rgba with alpha 0.2-0.4)
   */
  const flash = useCallback((color: string = 'rgba(255, 255, 255, 0.5)') => {
    const id = `flash-${Date.now()}-${Math.random()}`;
    setFlashes(prev => [...prev, { id, color }]);

    // Auto-remove after flash duration
    setTimeout(() => {
      setFlashes(prev => prev.filter(f => f.id !== id));
    }, 150); // Quick flash
  }, []);

  /**
   * FlashOverlay component renders active flashes
   * Place this at root level of your component
   */
  const FlashOverlay = useCallback(() => (
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
            animation: 'flash-fade 150ms ease-out',
          }}
        />
      ))}
    </>
  ), [flashes]);

  return { flash, FlashOverlay };
}
