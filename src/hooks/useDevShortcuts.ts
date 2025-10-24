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
      
      // Ctrl+N = Next screen
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        handlers.onNextScreen?.();
        console.log('[DEV] ⏭️ Next screen');
      }
      
      // Ctrl+B = Previous screen  
      else if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        handlers.onPrevScreen?.();
        console.log('[DEV] ⏮️ Previous screen');
      }
      
      // Ctrl+W = Win current battle instantly
      else if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        handlers.onWinBattle?.();
        console.log('[DEV] 🏆 Battle won instantly');
      }
      
      // Ctrl+G = Add random gem
      else if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        handlers.onAddGems?.();
        console.log('[DEV] 💎 Random gem added');
      }
      
      // Ctrl+M = Add gold (Money)
      else if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        handlers.onAddGold?.();
        console.log('[DEV] 💰 Gold added');
      }
      
      // Ctrl+S = Show current state
      else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handlers.onShowState?.();
        console.log('[DEV] 📊 State logged to console');
      }
      
      // Ctrl+D = Show dev mode help
      else if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        console.log(`
%c╔════════════════════════════════════════╗
║     🛠️  DEV MODE SHORTCUTS 🛠️        ║
╚════════════════════════════════════════╝`, 
          'color: yellow; font-weight: bold; font-size: 14px'
        );
        console.log(`
%cNAVIGATION:
  Ctrl+N  ⏭️  Next Screen (skip current)
  Ctrl+B  ⏮️  Previous Screen

BATTLE:
  Ctrl+W  🏆  Win Battle Instantly

REWARDS:
  Ctrl+G  💎  Add Random Gem
  Ctrl+M  💰  Add Gold (future)

DEBUG:
  Ctrl+S  📊  Show Current State
  Ctrl+D  ❓  Show This Help

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
    console.log('%cPress Ctrl+D for dev shortcuts', 'color: #f59e0b');
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}

