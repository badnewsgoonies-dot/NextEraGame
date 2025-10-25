/*
 * GemSelectScreen: Choose one gem from battle rewards
 * 
 * Flow: Player receives 2-3 gem choices after winning a battle
 * Player must select one gem to add to their inventory
 * Similar to opponent selection mechanics
 */

import React, { useState } from 'react';
import { getGemById, getGemIcon, type GemSpec } from '../data/gems.js';

export interface GemSelectScreenProps {
  readonly gemChoices: readonly string[]; // Array of gem IDs to choose from
  readonly onSelect: (gemId: string) => void;
  readonly onSkip?: () => void; // Optional - if no gems were offered
}

export function GemSelectScreen({ gemChoices, onSelect, onSkip }: GemSelectScreenProps): React.ReactElement {
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null);
  const [hoveredGemId, setHoveredGemId] = useState<string | null>(null);

  // Get full gem specs from IDs
  const gems = gemChoices
    .map(id => getGemById(id))
    .filter((gem): gem is GemSpec => gem !== undefined);

  // Handle case where no gems are available
  if (gems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-900 p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl text-center">
          <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            💎 Gem Selection
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            No gems were offered this time.
          </p>
          <button
            onClick={onSkip}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  const selectedGem = selectedGemId ? getGemById(selectedGemId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-white mb-4">
          💎 Choose Your Gem
        </h1>
        <p className="text-xl text-center text-purple-200 mb-8">
          Select one gem to add to your collection
        </p>

        {/* Gem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gems.map((gem) => {
            const icon = getGemIcon(gem.id);
            const isSelected = selectedGemId === gem.id;
            const isHovered = hoveredGemId === gem.id;

            return (
              <div
                key={gem.id}
                onClick={() => setSelectedGemId(gem.id)}
                onMouseEnter={() => setHoveredGemId(gem.id)}
                onMouseLeave={() => setHoveredGemId(null)}
                className={`
                  bg-white dark:bg-gray-800 rounded-xl p-6 cursor-pointer
                  transition-all duration-200 shadow-lg
                  ${isSelected ? 'ring-4 ring-purple-500 scale-105' : ''}
                  ${isHovered && !isSelected ? 'ring-2 ring-purple-300 scale-102' : ''}
                  hover:shadow-2xl
                `}
                role="button"
                tabIndex={0}
                aria-label={`Select ${gem.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedGemId(gem.id);
                  }
                }}
              >
                {/* Gem Icon & Name */}
                <div className="text-center mb-4">
                  <div className={`text-6xl mb-2 ${icon.color}`}>
                    {icon.emoji}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {gem.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {gem.grantsSubclass}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {gem.description}
                </p>

                {/* Passive Bonus */}
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-3">
                  <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    PASSIVE BONUS (When Active)
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    {gem.passiveBonus.hp && <div>+{gem.passiveBonus.hp} HP</div>}
                    {gem.passiveBonus.attack && <div>+{gem.passiveBonus.attack} ATK</div>}
                    {gem.passiveBonus.defense && <div>+{gem.passiveBonus.defense} DEF</div>}
                    {gem.passiveBonus.speed && <div>+{gem.passiveBonus.speed} SPD</div>}
                  </div>
                </div>

                {/* Granted Ability */}
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 mb-3">
                  <h4 className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2">
                    GRANTED ABILITY
                  </h4>
                  <div className="text-sm">
                    <div className="font-semibold text-green-700 dark:text-green-400">
                      {gem.grantedAbility.name} ({gem.grantedAbility.mpCost} MP)
                    </div>
                    <div className="text-green-600 dark:text-green-500 text-xs">
                      {gem.grantedAbility.description}
                    </div>
                  </div>
                </div>

                {/* Gem Effect */}
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    GEM EFFECT (One-time)
                  </h4>
                  <div className="text-sm text-purple-700 dark:text-purple-400">
                    {gem.gemEffect.type.toUpperCase()} - Power {gem.gemEffect.power}
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full font-semibold">
                      <span>✓</span>
                      <span>Selected</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => selectedGemId && onSelect(selectedGemId)}
            disabled={!selectedGemId}
            className={`
              px-8 py-4 font-bold text-xl rounded-lg transition-colors shadow-lg
              ${selectedGemId
                ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }
            `}
            aria-label="Confirm gem selection"
          >
            {selectedGem ? `Select ${selectedGem.name}` : 'Select a Gem'}
          </button>
        </div>
      </div>
    </div>
  );
}
