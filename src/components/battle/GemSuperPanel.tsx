/**
 * Gem Super Panel
 *
 * Displays the global gem super ability on the left side of the battle screen.
 * Shows gem element, name, and activation status.
 *
 * Visual States:
 * - AVAILABLE: Clickable button, gem is ready to use
 * - USED: Grayed out, shows "Used this battle" message
 * - NO_GEM: No gem selected (shouldn't happen in battle, but defensive)
 *
 * Pure component - state managed by parent (BattleScreen)
 */

import React from 'react';
import type { Element } from '../../types/game.js';

export interface GemSuperPanelProps {
  /** Name of the active gem (e.g., "Mars Gem") */
  gemName: string | null;

  /** Element of the active gem */
  gemElement: Element | null;

  /** Whether gem super is available to use (not used this battle) */
  isAvailable: boolean;

  /** Callback when activate button is clicked */
  onActivate: () => void;
}

/**
 * Get element color for visual styling
 */
function getElementColor(element: Element | null): string {
  if (!element) return 'gray';

  switch (element) {
    case 'Mars':
      return 'red'; // Fire
    case 'Mercury':
      return 'blue'; // Water
    case 'Jupiter':
      return 'yellow'; // Wind/Lightning
    case 'Venus':
      return 'green'; // Earth
    case 'Moon':
      return 'purple'; // Light
    case 'Sun':
      return 'orange'; // Dark/Sun
    default:
      return 'gray';
  }
}

/**
 * Get element emoji icon
 */
function getElementIcon(element: Element | null): string {
  if (!element) return '💎';

  switch (element) {
    case 'Mars':
      return '🔥';
    case 'Mercury':
      return '💧';
    case 'Jupiter':
      return '⚡';
    case 'Venus':
      return '🌍';
    case 'Moon':
      return '🌙';
    case 'Sun':
      return '☀️';
    default:
      return '💎';
  }
}

export function GemSuperPanel({
  gemName,
  gemElement,
  isAvailable,
  onActivate,
}: GemSuperPanelProps): React.ReactElement {
  const color = getElementColor(gemElement);
  const icon = getElementIcon(gemElement);

  // No gem selected (defensive - shouldn't happen)
  if (!gemName || !gemElement) {
    return (
      <div
        className="gem-super-panel p-4 bg-gray-800 border-2 border-gray-600 rounded-lg"
        style={{ width: '192px' }}
      >
        <div className="text-sm text-gray-500 text-center">
          No Gem Selected
        </div>
      </div>
    );
  }

  return (
    <div
      className={`gem-super-panel p-4 border-2 rounded-lg ${
        isAvailable
          ? `bg-${color}-900/30 border-${color}-500`
          : 'bg-gray-800 border-gray-600'
      }`}
      style={{ width: '192px' }}
    >
      {/* Header */}
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
        Gem Super
      </div>

      {/* Gem Icon & Name */}
      <div className="flex items-center gap-2 mb-3">
        <div className="text-3xl" role="img" aria-label={`${gemElement} element`}>
          {icon}
        </div>
        <div>
          <div className={`text-lg font-bold ${
            isAvailable ? `text-${color}-400` : 'text-gray-500'
          }`}>
            {gemElement}
          </div>
          <div className="text-xs text-gray-400">
            {gemName}
          </div>
        </div>
      </div>

      {/* Status / Activate Button */}
      {isAvailable ? (
        <button
          onClick={onActivate}
          className={`w-full py-2 px-4 bg-${color}-600 hover:bg-${color}-500
            text-white font-bold rounded transition-colors
            focus:outline-none focus:ring-2 focus:ring-${color}-400`}
          aria-label={`Activate ${gemName} super attack`}
        >
          Activate
        </button>
      ) : (
        <div className="text-center py-2 px-4 bg-gray-700 text-gray-400 text-sm rounded">
          Used this battle
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        AOE damage to all enemies
      </div>
    </div>
  );
}
