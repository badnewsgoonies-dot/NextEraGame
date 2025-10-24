/*
 * useDevShortcuts: Developer Mode Keyboard Shortcuts
 * 
 * ONLY active in development mode (import.meta.env.DEV)
 * Provides shortcuts for rapid testing and screen navigation
 * 
 * Shortcuts:
 * - Ctrl+N: Next screen (skip current screen)
 * - Ctrl+B: Previous screen
 * - Ctrl+W: Win current battle instantly
 * - Ctrl+G: Add random gem to inventory
 * - Ctrl+D: Show dev shortcuts help in console
 * 
 * Usage:
 *   useDevShortcuts({
 *     onNextScreen: () => handleSkipToNextScreen(),
 *     onWinBattle: () => handleInstantWin(),
 *   });
 */

import { useEffect } from 'react';

export interface DevShortcutHandlers {
  onNextScreen?: () => void;
  onPrevScreen?: () => void;
  onWinBattle?: () => void;
  onAddGems?: () => void;
  onAddGold?: () => void;
  onShowState?: () => void;
}

export function useDevShortcuts(handlers: DevShortcutHandlers) {
  useEffect(() => {
    // Only active in development mode
    if (!import.meta.env.DEV) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Shift+N = Next screen
      if (e.shiftKey && e.key === 'N') {
        e.preventDefault();
        handlers.onNextScreen?.();
        console.log('[DEV] ⏭️ Next screen');
      }
      
      // Shift+B = Previous screen  
      else if (e.shiftKey && e.key === 'B') {
        e.preventDefault();
        handlers.onPrevScreen?.();
        console.log('[DEV] ⏮️ Previous screen');
      }
      
      // Shift+W = Win current battle instantly
      else if (e.shiftKey && e.key === 'W') {
        e.preventDefault();
        handlers.onWinBattle?.();
        console.log('[DEV] 🏆 Battle won instantly');
      }
      
      // Shift+G = Add random gem
      else if (e.shiftKey && e.key === 'G') {
        e.preventDefault();
        handlers.onAddGems?.();
        console.log('[DEV] 💎 Random gem added');
      }
      
      // Shift+M = Add gold (Money)
      else if (e.shiftKey && e.key === 'M') {
        e.preventDefault();
        handlers.onAddGold?.();
        console.log('[DEV] 💰 Gold added');
      }
      
      // Shift+S = Show current state
      else if (e.shiftKey && e.key === 'S') {
        e.preventDefault();
        handlers.onShowState?.();
        console.log('[DEV] 📊 State logged to console');
      }
      
      // Shift+D = Show dev mode help
      else if (e.shiftKey && e.key === 'D') {
        e.preventDefault();
        console.log(`
%c╔════════════════════════════════════════╗
║     🛠️  DEV MODE SHORTCUTS 🛠️        ║
╚════════════════════════════════════════╝`, 
          'color: yellow; font-weight: bold; font-size: 14px'
        );
        console.log(`
%cNAVIGATION:
  Shift+N  ⏭️  Next Screen (skip current)
  Shift+B  ⏮️  Previous Screen

BATTLE:
  Shift+W  🏆  Win Battle Instantly

REWARDS:
  Shift+G  💎  Add Random Gem
  Shift+M  💰  Add Gold (future)

DEBUG:
  Shift+S  📊  Show Current State
  Shift+D  ❓  Show This Help

%cDev mode is ONLY active in development build.
Production builds have dev mode disabled.`,
          'color: cyan',
          'color: gray; font-style: italic'
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Show dev mode activated message on mount
    console.log(
      '%c🛠️ DEV MODE ACTIVE',
      'background: #f59e0b; color: black; padding: 4px 8px; border-radius: 4px; font-weight: bold'
    );
    console.log('%cPress Shift+D for dev shortcuts', 'color: #f59e0b');
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}

