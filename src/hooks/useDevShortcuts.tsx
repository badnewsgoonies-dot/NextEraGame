/*
 * useDevShortcuts: Development shortcuts for rapid testing
 * 
 * Keyboard shortcuts for developers to quickly test game states:
 * - Shift+N: Next screen (skip forward)
 * - Shift+B: Previous screen (go back)
 * - Shift+W: Win battle instantly
 * - Shift+G: Add random gem to inventory
 * - Shift+S: Show current game state (console)
 * - Shift+D: Show dev shortcuts help
 * 
 * Only active in development mode.
 * Uses Shift instead of Ctrl to avoid browser conflicts.
 */

import React, { useEffect } from 'react';

export interface DevShortcutsConfig {
  onNextScreen?: () => void;
  onPrevScreen?: () => void;
  onWinBattle?: () => void;
  onAddGem?: () => void;
  onShowState?: () => void;
  enabled?: boolean;
}

export function useDevShortcuts({
  onNextScreen,
  onPrevScreen,
  onWinBattle,
  onAddGem,
  onShowState,
  enabled = true,
}: DevShortcutsConfig = {}) {
  useEffect(() => {
    if (!enabled || import.meta.env.PROD) {
      return; // Disabled in production
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only respond to Shift+Key combinations
      if (!e.shiftKey) return;

      switch (e.key) {
        case 'N': // Shift+N: Next Screen
          e.preventDefault();
          onNextScreen?.();
          console.log('[DEV] Next screen');
          break;

        case 'B': // Shift+B: Previous Screen
          e.preventDefault();
          onPrevScreen?.();
          console.log('[DEV] Previous screen');
          break;

        case 'W': // Shift+W: Win Battle
          e.preventDefault();
          onWinBattle?.();
          console.log('[DEV] Win battle instantly');
          break;

        case 'G': // Shift+G: Add Random Gem
          e.preventDefault();
          onAddGem?.();
          console.log('[DEV] Added random gem');
          break;

        case 'S': // Shift+S: Show State
          e.preventDefault();
          onShowState?.();
          console.log('[DEV] Showing current state (check console)');
          break;

        case 'D': // Shift+D: Show Help
          e.preventDefault();
          console.log(`
╔════════════════════════════════════════╗
║      DEV MODE SHORTCUTS (Shift+Key)     ║
╠════════════════════════════════════════╣
║ Shift+N   →  Next Screen               ║
║ Shift+B   →  Previous Screen           ║
║ Shift+W   →  Win Battle Instantly      ║
║ Shift+G   →  Add Random Gem            ║
║ Shift+S   →  Show Current State        ║
║ Shift+D   →  Show This Help            ║
╚════════════════════════════════════════╝
          `);
          break;

        default:
          // Ignore other keys
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Show hint on mount
    console.log('🛠️ Dev shortcuts active! Press Shift+D for help');

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onNextScreen, onPrevScreen, onWinBattle, onAddGem, onShowState]);
}

/**
 * Helper: Show dev shortcuts badge in UI
 */
export function DevShortcutsBadge(): React.ReactElement | null {
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed top-4 right-4 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-50">
      DEV MODE (Shift-D for help)
    </div>
  );
}

