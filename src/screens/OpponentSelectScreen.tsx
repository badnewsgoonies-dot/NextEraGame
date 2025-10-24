/*
 * OpponentSelectScreen: Main opponent selection interface
 * 
 * Features:
 * - Displays 3 opponent preview cards from ChoiceSystem
 * - Roving tabindex navigation (arrow keys move between cards)
 * - Keyboard selection (Enter/Space to confirm)
 * - Live region for screen reader announcements
 * - Expandable cards (Up/Down arrows)
 * - Performance target: <4ms initial render
 * 
 * Keyboard Controls:
 * - Arrow Left/Right: Navigate between cards
 * - Arrow Up/Down: Expand/collapse focused card
 * - Enter/Space: Select opponent and confirm
 * - Escape: Cancel/back
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { OpponentPreview } from '../types/game.js';
import { OpponentCard } from '../components/OpponentCard.js';
import { useKeyboard } from '../hooks/useKeyboard.js';

export interface OpponentSelectScreenProps {
  previews: readonly OpponentPreview[];
  battleIndex: number;
  onSelect: (opponentId: string) => void;
  onCancel: () => void;
}

export function OpponentSelectScreen({
  previews,
  battleIndex,
  onSelect,
  onCancel,
}: OpponentSelectScreenProps): React.ReactElement {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');

  // Refs for managing focus
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update announcement for screen readers
  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Clear after 1 second to allow re-announcement
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  // Navigate left (previous card)
  const navigateLeft = useCallback(() => {
    if (previews.length === 0) return;
    const newIndex = focusedIndex > 0 ? focusedIndex - 1 : previews.length - 1;
    setFocusedIndex(newIndex);
    setExpandedIndex(null); // Collapse when navigating
    
    const preview = previews[newIndex];
    if (preview) {
      announce(`${preview.spec.name}, ${preview.spec.difficulty} difficulty`);
    }
  }, [focusedIndex, previews, announce]);

  // Navigate right (next card)
  const navigateRight = useCallback(() => {
    if (previews.length === 0) return;
    const newIndex = focusedIndex < previews.length - 1 ? focusedIndex + 1 : 0;
    setFocusedIndex(newIndex);
    setExpandedIndex(null); // Collapse when navigating
    
    const preview = previews[newIndex];
    if (preview) {
      announce(`${preview.spec.name}, ${preview.spec.difficulty} difficulty`);
    }
  }, [focusedIndex, previews, announce]);

  // Toggle expand focused card
  const toggleExpand = useCallback(() => {
    setExpandedIndex(current => current === focusedIndex ? null : focusedIndex);
    announce(expandedIndex === focusedIndex ? 'Collapsed' : 'Expanded');
  }, [focusedIndex, expandedIndex, announce]);

  // Select focused card
  const selectFocused = useCallback(() => {
    if (focusedIndex < 0 || focusedIndex >= previews.length) return;
    const preview = previews[focusedIndex];
    if (!preview) return;
    
    setSelectedIndex(focusedIndex);
    announce(`${preview.spec.name} selected. Press Enter again to confirm.`);
  }, [focusedIndex, previews, announce]);

  // Confirm selection
  const confirmSelection = useCallback(() => {
    if (selectedIndex !== null) {
      if (selectedIndex < 0 || selectedIndex >= previews.length) return;
      const preview = previews[selectedIndex];
      if (!preview) return;
      
      const selectedId = preview.spec.id;
      announce(`Confirmed ${preview.spec.name}`);
      onSelect(selectedId);
    } else {
      // First press selects, need second press to confirm
      selectFocused();
    }
  }, [selectedIndex, previews, onSelect, selectFocused, announce]);

  // Keyboard navigation
  useKeyboard({
    enabled: true,
    onLeft: navigateLeft,
    onRight: navigateRight,
    onUp: toggleExpand,
    onDown: toggleExpand,
    onEnter: confirmSelection,
    onSpace: confirmSelection,
    onEscape: onCancel,
  });

  // Move DOM focus when keyboard navigation changes (for screen readers)
  useEffect(() => {
    const cardElement = cardRefs.current[focusedIndex];
    if (cardElement) {
      cardElement.focus();
    }
  }, [focusedIndex]);

  // Announce on mount
  useEffect(() => {
    announce(`3 opponents available for battle ${battleIndex + 1}. Use arrow keys to navigate.`);
  }, [battleIndex, announce]);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative p-8"
      style={{
        backgroundImage: 'url(/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif)',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content layer */}
      <div className="relative z-10">
        {/* Epic Header */}
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <h1 className="text-6xl font-black text-transparent bg-clip-text 
                       bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400
                       drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]
                       tracking-wider
                       mb-4
                       animate-pulse-slow">
            ⚔️ CHOOSE YOUR BATTLE ⚔️
          </h1>
          <p className="text-2xl text-yellow-200/90 drop-shadow-lg font-semibold">
            Select your opponent wisely...
          </p>
          <div className="text-lg text-amber-400 mt-3 font-bold">
            Battle #{battleIndex + 1}
          </div>
        </div>

        {/* Card Grid */}
        <div 
          role="radiogroup"
          aria-label="Opponent selection"
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {previews.map((preview, index) => (
            <div 
              key={preview.spec.id} 
              ref={(el) => { cardRefs.current[index] = el; }}
              className="animate-slide-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <OpponentCard
                preview={preview}
                selected={selectedIndex === index}
                focused={focusedIndex === index}
                expanded={expandedIndex === index}
                onSelect={() => {
                  setSelectedIndex(index);
                  announce(`${preview.spec.name} selected`);
                }}
                onFocus={() => {
                  setFocusedIndex(index);
                }}
                onToggleExpand={() => {
                  setExpandedIndex(current => current === index ? null : index);
                }}
                tabIndex={focusedIndex === index ? 0 : -1}
              />
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="max-w-7xl mx-auto mt-12 text-center text-sm text-yellow-200/80 drop-shadow-lg">
          <p>
            Use <kbd className="px-2 py-1 bg-amber-900/80 border border-yellow-600 rounded shadow-lg">←</kbd>
            {' '}and{' '}
            <kbd className="px-2 py-1 bg-amber-900/80 border border-yellow-600 rounded shadow-lg">→</kbd>
            {' '}to navigate
          </p>
          <p className="mt-1">
            Press <kbd className="px-2 py-1 bg-amber-900/80 border border-yellow-600 rounded shadow-lg">Enter</kbd>
            {' '}to select, <kbd className="px-2 py-1 bg-amber-900/80 border border-yellow-600 rounded shadow-lg">Esc</kbd>
            {' '}to cancel
          </p>
        </div>

        {/* Live Region for Screen Readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
      </div>
    </div>
  );
}

