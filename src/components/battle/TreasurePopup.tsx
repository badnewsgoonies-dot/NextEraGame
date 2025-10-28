/**
 * Treasure Popup
 *
 * Victory rewards overlay shown after battle.
 * Displays items, equipment, gold, and XP gained.
 *
 * Appears as an overlay on the battle screen with dimmed background.
 * Replaces the separate green Rewards screen for better immersion.
 *
 * Pure component - state managed by parent (BattleScreen)
 */

import React from 'react';
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
 * Get equipment icon emoji
 */
function getEquipmentIcon(slot: string): string {
  switch (slot) {
    case 'weapon':
      return '⚔️';
    case 'armor':
      return '🛡️';
    case 'accessory':
      return '💍';
    default:
      return '📦';
  }
}

/**
 * Get item icon emoji
 */
function getItemIcon(type: string): string {
  switch (type) {
    case 'consumable':
      return '🧪';
    case 'weapon':
      return '⚔️';
    case 'armor':
      return '🛡️';
    default:
      return '📦';
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
  if (!visible) return null;

  return (
    <>
      {/* Dimmed background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-40"
        onClick={onContinue}
        aria-hidden="true"
      />

      {/* Treasure popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 border-4 border-yellow-500 p-8 rounded-lg max-w-md w-full shadow-2xl animate-scale-in">
          {/* Header */}
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
            🎁 Victory Rewards!
          </h2>

          {/* Gold & XP */}
          <div className="mb-6 bg-gray-900/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-yellow-300 font-semibold">Gold:</span>
              <span className="text-yellow-200 text-xl font-bold">+{gold} 💰</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-300 font-semibold">XP:</span>
              <span className="text-blue-200 text-xl font-bold">+{xp} ✨</span>
            </div>
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Items:</h3>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    className="flex items-center gap-3 bg-gray-900/50 p-3 rounded"
                  >
                    <span className="text-2xl" role="img" aria-label={item.type}>
                      {getItemIcon(item.type)}
                    </span>
                    <div className="flex-1">
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

          {/* Equipment */}
          {equipment.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Equipment:</h3>
              <div className="space-y-2">
                {equipment.map((equip, i) => (
                  <div
                    key={`${equip.id}-${i}`}
                    className="flex items-center gap-3 bg-purple-900/30 p-3 rounded border border-purple-500/30"
                  >
                    <span className="text-2xl" role="img" aria-label={equip.slot}>
                      {getEquipmentIcon(equip.slot)}
                    </span>
                    <div className="flex-1">
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

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Continue to roster"
          >
            Continue to Roster →
          </button>
        </div>
      </div>
    </>
  );
}
