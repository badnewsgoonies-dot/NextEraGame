/*
 * StarterSelectScreen: Choose 4 starter units
 * 
 * Features:
 * - Display 12 starter units in grid
 * - Select exactly 4 units
 * - Clear visual feedback for selection
 * - Start button enabled when 4 selected
 * - Cancel button returns to menu
 * - Full keyboard navigation
 * - Accessibility (ARIA, screen reader)
 */

import React, { useState, useEffect, useRef } from 'react';
import { UnitCard } from '../components/UnitCard.js';
import { AnimatedSprite } from '../components/AnimatedSprite.js';
import type { PlayerUnit } from '../types/game.js';
import { STARTER_CATALOG } from '../data/starterUnits.js';

// Formation positions for selected units (relative to formation container)
const FORMATION_POSITIONS = [
  { x: 200, y: 60 },  // Back-left
  { x: 350, y: 60 },  // Back-right
  { x: 200, y: 120 }, // Front-left
  { x: 350, y: 120 }, // Front-right
];

export interface StarterSelectScreenProps {
  onSelect: (starters: PlayerUnit[]) => void;
  onCancel: () => void;
}

export function StarterSelectScreen({
  onSelect,
  onCancel,
}: StarterSelectScreenProps): React.ReactElement {
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridCols, setGridCols] = useState(3);

  const maxSelection = 4;
  const canStart = selectedUnits.size === maxSelection;

  // Toggle unit selection
  const toggleUnit = (unitId: string) => {
    setSelectedUnits(prev => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else if (next.size < maxSelection) {
        next.add(unitId);
      }
      return next;
    });
  };

  // Start game with selected units
  const handleStart = () => {
    if (canStart) {
      const selected = STARTER_CATALOG.filter(u => selectedUnits.has(u.id));
      onSelect(selected);
    }
  };

  // Compute grid columns for responsive keyboard navigation
  useEffect(() => {
    const computeCols = () => {
      const el = gridRef.current;
      if (!el) return;
      const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length;
      setGridCols(cols || 1);
    };
    
    computeCols();
    window.addEventListener('resize', computeCols);
    return () => window.removeEventListener('resize', computeCols);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const totalUnits = STARTER_CATALOG.length;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(0, prev - 1));
          break;

        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(totalUnits - 1, prev + 1));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(0, prev - gridCols));
          break;

        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(totalUnits - 1, prev + gridCols));
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            // Ctrl+Enter = Start (if ready)
            if (canStart) {
              handleStart();
            }
          } else {
            // Select/deselect focused unit
            toggleUnit(STARTER_CATALOG[focusedIndex].id);
          }
          break;

        case 'Escape':
          e.preventDefault();
          onCancel();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, canStart, onCancel, gridCols]);

  // Move DOM focus when focusedIndex changes (for screen readers)
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const items = el.querySelectorAll('[role="checkbox"]');
    const target = items[focusedIndex] as HTMLElement | undefined;
    target?.focus();
  }, [focusedIndex]);

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-300 dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Choose Your Team
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select exactly {maxSelection} units to begin your journey
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`text-xl font-bold ${
                  canStart
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                role="status"
                aria-live="polite"
              >
                {selectedUnits.size}/{maxSelection}
              </div>
              {canStart && (
                <div className="text-green-600 dark:text-green-400 font-semibold text-sm">
                  ✓ Ready!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="max-w-6xl mx-auto">
          {/* Unit grid - more compact */}
          <div
            ref={gridRef}
            role="group"
            aria-label="Starter units selection"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4"
          >
            {STARTER_CATALOG.map((unit, index) => (
              <div
                key={unit.id}
                className="animate-card-entry"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <UnitCard
                  unit={unit}
                  selected={selectedUnits.has(unit.id)}
                  focused={focusedIndex === index}
                  disabled={!selectedUnits.has(unit.id) && selectedUnits.size >= maxSelection}
                  onSelect={() => toggleUnit(unit.id)}
                  onFocus={() => setFocusedIndex(index)}
                  tabIndex={focusedIndex === index ? 0 : -1}
                />
              </div>
            ))}
          </div>

          {/* Formation Display - Compact */}
          {selectedUnits.size > 0 && (
            <div className="mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
                Your Team Formation
              </h2>
              <div className="relative h-32 bg-gradient-to-b from-blue-900/20 to-blue-950/30 rounded-lg border-2 border-blue-500/50">
                {Array.from(selectedUnits).map((unitId, index) => {
                  const unit = STARTER_CATALOG.find(u => u.id === unitId);
                  if (!unit || index >= FORMATION_POSITIONS.length) return null;
                  
                  const position = FORMATION_POSITIONS[index];
                  const spriteUrl = unit.spriteUrl || '/sprites/party/default-unit.png';

                  return (
                    <AnimatedSprite
                      key={unitId}
                      src={spriteUrl}
                      alt={unit.name}
                      startX={-50}
                      startY={position.y * 0.7} // Scale down for smaller container
                      endX={position.x}
                      endY={position.y * 0.7}
                      duration={800}
                      size={48} // Smaller sprites
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            ← Back to Menu
          </button>

          <div className="text-xs text-gray-600 dark:text-gray-400">
            Arrow keys: Navigate • Space/Enter: Select • Ctrl+Enter: Start
          </div>

          <button
            type="button"
            onClick={handleStart}
            disabled={!canStart}
            className={`px-6 py-2.5 rounded-lg font-bold transition-[colors,shadow,transform] duration-200 ${
              canStart
                ? 'bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            Start Journey →
          </button>
        </div>
      </div>
    </div>
  );
}
