import React from 'react';
import type { GemChoice } from '../types/game.js';

interface GemSelectScreenProps {
  gemChoices: readonly GemChoice[];
  onSelectGem: (gem: GemChoice) => void;
}

export const GemSelectScreen: React.FC<GemSelectScreenProps> = ({
  gemChoices,
  onSelectGem,
}) => {
  // Element icons
  const getElementIcon = (element: string): string => {
    switch (element) {
      case 'Fire': return '🔥';
      case 'Water': return '💧';
      case 'Earth': return '🌍';
      case 'Wind': return '💨';
      default: return '💎';
    }
  };

  // Element color classes
  const getElementColor = (element: string): string => {
    switch (element) {
      case 'Fire': return 'bg-red-500/20 border-red-500';
      case 'Water': return 'bg-blue-500/20 border-blue-500';
      case 'Earth': return 'bg-green-500/20 border-green-500';
      case 'Wind': return 'bg-cyan-500/20 border-cyan-500';
      default: return 'bg-purple-500/20 border-purple-500';
    }
  };

  // Tier color
  const getTierColor = (tier: number): string => {
    switch (tier) {
      case 3: return 'text-purple-400';
      case 2: return 'text-blue-400';
      case 1: return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            💎 Select a Gem
          </h1>
          <p className="text-gray-400 text-lg">
            Choose one gem to add to your inventory
          </p>
        </div>

        {/* Gem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {gemChoices.map((gem, index) => (
            <div
              key={`${gem.id}-${index}`}
              className={`${getElementColor(gem.element)} border-2 rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform duration-200`}
            >
              {/* Element Icon */}
              <div className="text-6xl text-center mb-4">
                {getElementIcon(gem.element)}
              </div>

              {/* Gem Name */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {gem.name}
              </h2>

              {/* Element Type */}
              <div className="text-center mb-3">
                <span className="text-gray-300 text-lg">
                  {getElementIcon(gem.element)} {gem.element}
                </span>
              </div>

              {/* Tier */}
              <div className="text-center mb-3">
                <span className={`${getTierColor(gem.tier)} font-semibold text-lg`}>
                  Tier {gem.tier}
                </span>
              </div>

              {/* Boost */}
              <div className="text-center mb-6">
                <span className="text-yellow-400 font-bold text-xl">
                  +{gem.boost} boost
                </span>
              </div>

              {/* Select Button */}
              <button
                onClick={() => onSelectGem(gem)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Select
              </button>
            </div>
          ))}
        </div>

        {/* Help Text */}
        {gemChoices.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            No gems available
          </div>
        )}
      </div>
    </div>
  );
};
