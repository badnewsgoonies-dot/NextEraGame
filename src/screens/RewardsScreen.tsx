/*
 * RewardsScreen: Display battle loot and rewards
 * Per PowerPoint mockup Slide 5
 */

import React from 'react';
import type { BattleReward } from '../types/game.js';

export interface RewardsScreenProps {
  rewards: BattleReward;
  onContinue: () => void;
}

export function RewardsScreen({ rewards, onContinue }: RewardsScreenProps): React.ReactElement {
  // Generate random confetti particles
  const confettiColors = ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-red-400'];
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
  }));

  return (
    <div className="h-full w-full bg-gradient-to-b from-green-800 to-green-900 p-6 flex items-center justify-center relative overflow-hidden">
      {/* Victory Confetti */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {confettiParticles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-3 h-3 ${particle.color} rounded-full animate-confetti`}
            style={{
              left: `${particle.left}%`,
              top: '-20px',
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl relative z-10">
        <h1 className="text-4xl font-bold text-center text-green-600 dark:text-green-400 mb-8">
          🎁 Rewards
        </h1>

        {/* Items Gained */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Items Gained:
          </h2>
          
          {rewards.items.length > 0 ? (
            <div className="space-y-3">
              {rewards.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <div className="text-3xl">📦</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      {item.rarity && ` • ${item.rarity}`}
                    </div>
                  </div>
                  {item.stats && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.stats.atkBonus && `+${item.stats.atkBonus} ATK `}
                      {item.stats.defBonus && `+${item.stats.defBonus} DEF `}
                      {item.stats.speedBonus && `+${item.stats.speedBonus} SPD`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No items gained this battle
            </p>
          )}
        </div>

        {/* Equipment Gained */}
        {rewards.equipment && rewards.equipment.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Equipment Gained:
            </h2>
            <div className="space-y-3">
              {rewards.equipment.map((equip) => (
                <div
                  key={equip.id}
                  className="flex items-center gap-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg"
                >
                  <div className="text-3xl">
                    {equip.slot === 'weapon' ? '⚔️' : equip.slot === 'armor' ? '🛡️' : '💍'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {equip.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {equip.slot.charAt(0).toUpperCase() + equip.slot.slice(1)} • {equip.rarity}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {equip.stats.hp && `+${equip.stats.hp} HP `}
                    {equip.stats.atk && `+${equip.stats.atk} ATK `}
                    {equip.stats.def && `+${equip.stats.def} DEF `}
                    {equip.stats.speed && `+${equip.stats.speed} SPD`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {rewards.experience > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Experience Gained
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                +{rewards.experience} XP
              </span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-lg transition-colors shadow-lg"
        >
          Continue to Equipment →
        </button>
      </div>
    </div>
  );
}

