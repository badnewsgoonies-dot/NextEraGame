/**
 * Treasure Popup
 *
 * Victory rewards overlay shown after battle.
 * Displays items, equipment, gold, and XP gained.
 *
 * Appears as an overlay on the battle screen with dimmed background.
 * Replaces the separate green Rewards screen for better immersion.
 *
 * Visual Enhancements (Session 3B):
 * - Animated chest sprite instead of emoji
 * - Equipment sprites (sword, shield, ring)
 * - Slide-in entrance animation with bounce
 * - Shimmer effect on reward items
 * - Staggered item fade-in (0.1s delays)
 * - Count-up animation for gold/XP
 * - Enhanced button hover effects
 *
 * Pure component - state managed by parent (BattleScreen)
 */

import React, { useState, useEffect } from 'react';
import type { Item, Equipment } from '../../types/game.js';

export interface TreasurePopupProps {
  /** Items gained from battle */
  items: Item[];

  /** Equipment gained from battle */
  equipment: Equipment[];

  /** Gold gained from battle */
  gold: number;

  /** XP gained from battle */
  xp: number;

  /** Callback when continue button clicked */
  onContinue: () => void;

  /** Whether popup is visible */
  visible: boolean;
}

/**
 * Get equipment sprite path
 */
function getEquipmentSprite(slot: string): string {
  switch (slot) {
    case 'weapon':
      return '/sprites/ui/equipment/sword.gif';
    case 'armor':
      return '/sprites/ui/equipment/shield.gif';
    case 'accessory':
      return '/sprites/ui/equipment/ring.gif';
    default:
      return '/sprites/ui/equipment/gem.gif';
  }
}

/**
 * Get item sprite path (fallback to equipment sprites)
 */
function getItemSprite(type: string): string {
  switch (type) {
    case 'consumable':
      return '/sprites/ui/equipment/gem.gif'; // Use gem for potions
    case 'weapon':
      return '/sprites/ui/equipment/sword.gif';
    case 'armor':
      return '/sprites/ui/equipment/shield.gif';
    default:
      return '/sprites/ui/equipment/gem.gif';
  }
}

export function TreasurePopup({
  items,
  equipment,
  gold,
  xp,
  onContinue,
  visible,
}: TreasurePopupProps): React.ReactElement | null {
  // Count-up animation state
  const [displayGold, setDisplayGold] = useState(0);
  const [displayXp, setDisplayXp] = useState(0);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animate numbers counting up from 0
  useEffect(() => {
    if (!visible) {
      setDisplayGold(0);
      setDisplayXp(0);
      setHasAnimated(false);
      return;
    }

    // If already animated or values are small, show immediately
    if (hasAnimated || gold <= 100 || xp <= 100) {
      setDisplayGold(gold);
      setDisplayXp(xp);
      setHasAnimated(true);
      return;
    }

    // Animate for larger values
    setHasAnimated(true);

    // Gold count-up
    let goldCurrent = 0;
    const goldStep = Math.ceil(gold / 20);
    const goldInterval = setInterval(() => {
      goldCurrent += goldStep;
      if (goldCurrent >= gold) {
        goldCurrent = gold;
        clearInterval(goldInterval);
      }
      setDisplayGold(goldCurrent);
    }, 30);

    // XP count-up
    let xpCurrent = 0;
    const xpStep = Math.ceil(xp / 20);
    const xpInterval = setInterval(() => {
      xpCurrent += xpStep;
      if (xpCurrent >= xp) {
        xpCurrent = xp;
        clearInterval(xpInterval);
      }
      setDisplayXp(xpCurrent);
    }, 30);

    return () => {
      clearInterval(goldInterval);
      clearInterval(xpInterval);
    };
  }, [visible, gold, xp, hasAnimated]);

  if (!visible) return null;

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes treasureSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes fadeInStagger {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes backgroundFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .treasure-popup {
          animation: treasureSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .reward-item {
          position: relative;
          overflow: hidden;
        }

        .reward-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        .chest-sprite {
          animation: chestBounce 0.6s ease-out;
          image-rendering: pixelated;
        }

        @keyframes chestBounce {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-5px);
          }
        }

        .item-sprite {
          image-rendering: pixelated;
          transition: transform 0.2s ease;
        }

        .item-sprite:hover {
          transform: scale(1.2);
        }
      `}</style>

      {/* Dimmed background overlay */}
      <div
        className="fixed inset-0 bg-black z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          animation: 'backgroundFadeIn 0.3s ease',
        }}
        onClick={onContinue}
        aria-hidden="true"
      />

      {/* Treasure popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="treasure-popup bg-gray-800 border-4 border-yellow-500 p-8 rounded-lg max-w-md w-full shadow-2xl">
          {/* Header with Chest Sprite */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="/sprites/golden-sun/scenery/chest.gif"
              alt="Treasure chest"
              className="chest-sprite w-16 h-16 mb-3"
            />
            <h2 className="text-3xl font-bold text-yellow-400 text-center">
              🎁 Victory Rewards!
            </h2>
          </div>

          {/* Gold & XP with Count-up Animation */}
          <div className="mb-6 bg-gray-900/50 p-4 rounded-lg border border-yellow-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-yellow-300 font-semibold">Gold:</span>
              <span className="text-yellow-200 text-xl font-bold tabular-nums">
                +{displayGold} 💰
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-300 font-semibold">XP:</span>
              <span className="text-blue-200 text-xl font-bold tabular-nums">
                +{displayXp} ✨
              </span>
            </div>
          </div>

          {/* Items with Staggered Animation */}
          {items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Items:</h3>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    className="reward-item flex items-center gap-3 bg-gray-900/50 p-3 rounded border border-blue-500/20"
                    style={{
                      animation: `fadeInStagger 0.4s ease ${i * 0.1}s both`,
                    }}
                  >
                    <img
                      src={getItemSprite(item.type)}
                      alt={item.type}
                      className="item-sprite w-8 h-8"
                      role="img"
                      aria-label={item.type}
                    />
                    <div className="flex-1 relative z-10">
                      <div className="text-gray-200 font-medium">{item.name}</div>
                      {item.stats?.hpRestore && (
                        <div className="text-xs text-green-400">+{item.stats.hpRestore} HP</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment with Staggered Animation */}
          {equipment.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Equipment:</h3>
              <div className="space-y-2">
                {equipment.map((equip, i) => (
                  <div
                    key={`${equip.id}-${i}`}
                    className="reward-item flex items-center gap-3 bg-purple-900/30 p-3 rounded border border-purple-500/30"
                    style={{
                      animation: `fadeInStagger 0.4s ease ${(items.length + i) * 0.1}s both`,
                    }}
                  >
                    <img
                      src={getEquipmentSprite(equip.slot)}
                      alt={equip.slot}
                      className="item-sprite w-8 h-8"
                      role="img"
                      aria-label={equip.slot}
                    />
                    <div className="flex-1 relative z-10">
                      <div className="text-gray-200 font-medium">{equip.name}</div>
                      <div className="text-xs text-purple-300">
                        {equip.stats?.atk && `+${equip.stats.atk} ATK `}
                        {equip.stats?.def && `+${equip.stats.def} DEF `}
                        {equip.stats?.speed && `+${equip.stats.speed} SPD`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No items/equipment message */}
          {items.length === 0 && equipment.length === 0 && (
            <div className="mb-6 text-center text-gray-400 italic">
              No items or equipment gained
            </div>
          )}

          {/* Continue Button with Enhanced Hover */}
          <button
            onClick={onContinue}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="w-full py-3 text-white font-bold rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800"
            style={{
              background: isButtonHovered
                ? 'linear-gradient(135deg, #10B981 0%, #22C55E 100%)'
                : 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              transform: isButtonHovered ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isButtonHovered
                ? '0 0 30px rgba(16, 185, 129, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 0 15px rgba(16, 185, 129, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
            aria-label="Continue to roster"
          >
            Continue to Roster →
          </button>
        </div>
      </div>
    </>
  );
}
