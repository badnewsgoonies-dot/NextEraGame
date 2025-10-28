/**
 * Gem Select Screen - Redesigned
 *
 * Shown ONCE at game start (after roster selection, before first battle).
 * Player selects ONE gem that provides:
 * - Global party-wide stat bonuses based on elemental affinity
 * - Spells granted to matching element units
 * - Battle super spell (one-time use per battle)
 *
 * Features:
 * - Displays all 6 gems in grid layout
 * - Shows player's current team
 * - Displays affinity indicators for each unit
 * - Shows stat bonus previews
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Mouse support (click to select)
 * - Accessible (ARIA labels, keyboard navigation)
 */

import React, { useState, useCallback, useEffect } from 'react';
import type { PlayerUnit, ElementAffinity } from '../types/game.js';
import { ALL_GLOBAL_GEMS, calculateAffinity } from '../data/gems.js';
import { useKeyboard } from '../hooks/useKeyboard.js';

export interface GemSelectScreenProps {
  playerUnits: readonly PlayerUnit[];
  onGemSelected: (gemId: string) => void;
  onCancel?: () => void;
}

export function GemSelectScreen({
  playerUnits,
  onGemSelected,
  onCancel,
}: GemSelectScreenProps): React.ReactElement {
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null);
  const [focusedGemIndex, setFocusedGemIndex] = useState(0);
  const [hoveredGemId, setHoveredGemId] = useState<string | null>(null);

  const selectedGem = selectedGemId ? ALL_GLOBAL_GEMS.find(g => g.id === selectedGemId) : null;
  const displayGem = hoveredGemId
    ? ALL_GLOBAL_GEMS.find(g => g.id === hoveredGemId)
    : selectedGem;

  // Keyboard navigation
  useKeyboard({
    onUp: () => {
      setFocusedGemIndex((prev) => {
        const newIndex = prev - 3;
        return newIndex < 0 ? prev : newIndex;
      });
    },
    onDown: () => {
      setFocusedGemIndex((prev) => {
        const newIndex = prev + 3;
        return newIndex >= ALL_GLOBAL_GEMS.length ? prev : newIndex;
      });
    },
    onLeft: () => {
      setFocusedGemIndex((prev) => (prev > 0 ? prev - 1 : prev));
    },
    onRight: () => {
      setFocusedGemIndex((prev) =>
        (prev < ALL_GLOBAL_GEMS.length - 1 ? prev + 1 : prev)
      );
    },
    onEnter: () => {
      if (focusedGemIndex >= 0 && focusedGemIndex < ALL_GLOBAL_GEMS.length) {
        const gem = ALL_GLOBAL_GEMS[focusedGemIndex];
        if (selectedGemId === gem.id) {
          // Confirm selection if already selected
          onGemSelected(gem.id);
        } else {
          // Select gem
          setSelectedGemId(gem.id);
        }
      }
    },
    onEscape: () => {
      if (selectedGemId) {
        setSelectedGemId(null);
      } else if (onCancel) {
        onCancel();
      }
    },
  });

  // Focus management
  useEffect(() => {
    const gemElement = document.getElementById(`gem-${focusedGemIndex}`);
    if (gemElement) {
      gemElement.focus();
    }
  }, [focusedGemIndex]);

  const handleGemClick = useCallback((gemId: string) => {
    setSelectedGemId(gemId);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedGemId) {
      onGemSelected(selectedGemId);
    }
  }, [selectedGemId, onGemSelected]);

  // Get affinity indicator styling
  const getAffinityStyle = (affinity: ElementAffinity): string => {
    switch (affinity) {
      case 'strong':
        return 'border-green-400 bg-green-400/20 text-green-300';
      case 'neutral':
        return 'border-gray-400 bg-gray-400/10 text-gray-400';
      case 'weak':
        return 'border-red-400 bg-red-400/20 text-red-300';
    }
  };

  const getAffinityLabel = (affinity: ElementAffinity): string => {
    switch (affinity) {
      case 'strong':
        return '★ Strong';
      case 'neutral':
        return '○ Neutral';
      case 'weak':
        return '✕ Weak';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 overflow-y-auto pt-8 pb-24 px-4 md:px-8">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your Gem
          </h1>
          <p className="text-gray-300 text-lg">
            Select one gem to empower your party throughout your journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Gem Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-4">
              {ALL_GLOBAL_GEMS.map((gem, index) => {
                const isSelected = selectedGemId === gem.id;
                const isFocused = focusedGemIndex === index;
                const isHovered = hoveredGemId === gem.id;

                return (
                  <button
                    key={gem.id}
                    id={`gem-${index}`}
                    onClick={() => handleGemClick(gem.id)}
                    onMouseEnter={() => setHoveredGemId(gem.id)}
                    onMouseLeave={() => setHoveredGemId(null)}
                    onFocus={() => setFocusedGemIndex(index)}
                    className={`
                      relative p-6 rounded-xl border-4 transition-all duration-200
                      ${isSelected
                        ? 'border-yellow-400 bg-yellow-400/20 shadow-2xl scale-105'
                        : isFocused || isHovered
                        ? 'border-white/50 bg-white/10 scale-105'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-400'
                      }
                    `}
                    aria-label={`Select ${gem.name}`}
                    aria-pressed={isSelected}
                    tabIndex={isFocused ? 0 : -1}
                  >
                    {/* Element Icon - Sprite */}
                    <div className="flex justify-center mb-3">
                      <img 
                        src={gem.iconPath}
                        alt={`${gem.name} icon`}
                        className="w-16 h-16 pixelated"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>

                    {/* Gem Name */}
                    <h3 className="text-xl font-bold text-white text-center mb-1">
                      {gem.name}
                    </h3>

                    {/* Element Type */}
                    <p className="text-gray-300 text-center text-sm mb-2">
                      {gem.element} Element
                    </p>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-yellow-400 text-2xl">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Confirm Button */}
            <div className="mt-6 mb-8 flex gap-4">
              <button
                onClick={handleConfirm}
                disabled={!selectedGemId}
                className={`
                  flex-1 py-4 px-8 rounded-lg font-bold text-xl transition-all duration-200 touch-manipulation
                  ${selectedGemId
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl active:scale-95'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }
                `}
                aria-label="Confirm gem selection"
              >
                {selectedGemId ? 'Confirm Selection' : 'Select a Gem'}
              </button>

              {onCancel && (
                <button
                  onClick={onCancel}
                  className="py-4 px-8 rounded-lg font-bold text-xl bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
                  aria-label="Cancel and go back"
                >
                  Back
                </button>
              )}
            </div>
          </div>

          {/* Right Panel: Details & Team Preview */}
          <div className="lg:col-span-1 space-y-2">
            {/* Gem Details */}
            {displayGem && (
              <div className="bg-gray-900/80 rounded-xl p-4 border-2 border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={displayGem.iconPath}
                    alt={`${displayGem.name} icon`}
                    className="w-10 h-10 pixelated"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {displayGem.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{displayGem.element} Element</p>
                  </div>
                </div>

                <p className="text-gray-300 text-xs mb-2">
                  {displayGem.description}
                </p>

                {/* Super Spell Preview */}
                <div className="mb-2 p-2 bg-purple-900/50 rounded-lg border border-purple-500">
                  <h4 className="text-yellow-300 font-bold text-xs mb-1">
                    Super Spell
                  </h4>
                  <p className="text-white font-semibold text-sm">{displayGem.superSpell.name}</p>
                  <p className="text-gray-300 text-xs">{displayGem.superSpell.description}</p>
                </div>

                {/* Stat Bonuses Preview */}
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-xs">Stat Bonuses:</h4>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center">
                      <div className="text-green-300 font-bold">Strong</div>
                      <div className="text-gray-400">+{displayGem.strongBonus.atk} ATK</div>
                      <div className="text-gray-400">+{displayGem.strongBonus.hp} HP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-300 font-bold">Neutral</div>
                      <div className="text-gray-400">+{displayGem.neutralBonus.atk} ATK</div>
                      <div className="text-gray-400">+{displayGem.neutralBonus.hp} HP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-300 font-bold">Weak</div>
                      <div className="text-gray-400">{displayGem.weakBonus.atk} ATK</div>
                      <div className="text-gray-400">{displayGem.weakBonus.hp} HP</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Affinity Preview */}
            {displayGem && (
              <div className="bg-gray-900/80 rounded-xl p-4 border-2 border-gray-700">
                <h3 className="text-white font-bold text-sm mb-2">Your Team Affinity</h3>
                <div className="space-y-2">
                  {playerUnits.map((unit) => {
                    const affinity = calculateAffinity(unit.element, displayGem.element);
                    return (
                      <div
                        key={unit.id}
                        className={`flex items-center justify-between p-2 rounded-lg border-2 ${getAffinityStyle(affinity)}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            {unit.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({unit.element})
                          </span>
                        </div>
                        <span className="text-xs font-bold">
                          {getAffinityLabel(affinity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Affinity Summary */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div>
                      <div className="text-green-300 font-bold">
                        {playerUnits.filter(u =>
                          calculateAffinity(u.element, displayGem.element) === 'strong'
                        ).length}
                      </div>
                      <div className="text-gray-400">Strong</div>
                    </div>
                    <div>
                      <div className="text-gray-300 font-bold">
                        {playerUnits.filter(u =>
                          calculateAffinity(u.element, displayGem.element) === 'neutral'
                        ).length}
                      </div>
                      <div className="text-gray-400">Neutral</div>
                    </div>
                    <div>
                      <div className="text-red-300 font-bold">
                        {playerUnits.filter(u =>
                          calculateAffinity(u.element, displayGem.element) === 'weak'
                        ).length}
                      </div>
                      <div className="text-gray-400">Weak</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
