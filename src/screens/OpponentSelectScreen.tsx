/*
 * OpponentSelectScreen: Main opponent selection interface
 * 
 * Features:
 * - Displays 3 opponent preview cards from ChoiceSystem
 * - Roving tabindex navigation (arrow keys move between cards)
 * - Keyboard selection (Enter/Space to confirm)
 * - Live region for screen reader announcements
 * - Expandable cards (Up/Down arrows)
 * - Mobile-friendly confirm button
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

  // Refs for managing focus and card positions
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update announcement for screen readers
  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Clear after 1 second to allow re-announcement
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  // Get card center position for Isaac to walk to
  const getCardCenter = useCallback((index: number): { x: number; y: number } | null => {
    const card = cardRefs.current[index];
    const container = containerRef.current;
    if (!card || !container) return null;

    const cardRect = card.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate center position relative to container
    return {
      x: cardRect.left - containerRect.left + cardRect.width / 2,
      y: cardRect.top - containerRect.top + cardRect.height / 2,
    };
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

  // Confirm selection - trigger Isaac walk animation
  const confirmSelection = useCallback(() => {
    if (selectedIndex !== null) {
      if (selectedIndex < 0 || selectedIndex >= previews.length) return;
      const preview = previews[selectedIndex];
      if (!preview) return;

      // Get card center for Isaac to walk to
      const target = getCardCenter(selectedIndex);
      if (!target) {
        // Fallback: immediate transition if position can't be calculated
        announce(`Confirmed ${preview.spec.name}`);
        onSelect(preview.spec.id);
        return;
      }

      // Directly select the opponent
      onSelect(preview.spec.id);
    } else {
      // First press selects, need second press to confirm
      selectFocused();
    }
  }, [selectedIndex, previews, onSelect, selectFocused, announce, getCardCenter]);

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

  // Get selected preview for button text
  const selectedPreview = selectedIndex !== null ? previews[selectedIndex] : null;

  return (
    <div ref={containerRef} className="h-full w-full bg-gray-50 dark:bg-gray-900 flex flex-col relative">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-1">
          Select Your Opponent
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Battle #{battleIndex + 1}
        </p>
      </div>

      {/* Scrollable Card Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div 
          role="radiogroup"
          aria-label="Opponent selection"
          className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-7xl mx-auto"
        >
          {previews.map((preview, index) => (
            <div 
              key={preview.spec.id} 
              ref={(el) => { cardRefs.current[index] = el; }}
              className="animate-card-entry"
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
      </div>

      {/* Fixed Footer with Confirm Button */}
      <div className="flex-shrink-0 p-4 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="flex justify-center items-center gap-4">
          {selectedPreview ? (
            <button
              onClick={confirmSelection}
              className="px-8 py-3 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              aria-label={`Confirm selection of ${selectedPreview.spec.name}`}
            >
              Confirm: {selectedPreview.spec.name} →
            </button>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              Select an opponent to continue
            </p>
          )}
        </div>
        <div className="text-center text-xs text-gray-500 dark:text-gray-500 mt-2">
          ← → to navigate • Enter to select • Esc to cancel
        </div>
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
  );
}