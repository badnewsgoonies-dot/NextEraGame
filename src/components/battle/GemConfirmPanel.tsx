/**
 * GemConfirmPanel: Confirmation dialog for gem activation in battle
 * Shows gem info and asks player to confirm activation
 */

import React from 'react';
import type { GemActivation } from '../../data/gemActivations.js';
import { MenuButton } from '../MenuButton.js';

export interface GemConfirmPanelProps {
  gemActivation: GemActivation;
  onConfirm: () => void;
  onCancel: () => void;
}

export function GemConfirmPanel({
  gemActivation,
  onConfirm,
  onCancel,
}: GemConfirmPanelProps): React.ReactElement {
  return (
    <div className="bg-gradient-to-b from-blue-900/95 to-blue-950/95 border-4 border-yellow-500/80 rounded-xl p-6 shadow-2xl backdrop-blur-sm max-w-md">
      {/* Header */}
      <div
        className="text-xl font-bold uppercase tracking-wider text-yellow-300 mb-4 drop-shadow-lg text-center"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
      >
        💎 Activate Gem?
      </div>

      {/* Gem Info */}
      <div className="bg-black/40 border-2 border-yellow-600/50 rounded-lg p-4 mb-4">
        <div className="text-lg font-bold text-yellow-200 mb-2">
          {gemActivation.name}
        </div>
        <div className="text-sm text-gray-300 mb-3">
          {gemActivation.description}
        </div>

        {/* Effect Details */}
        <div className="text-xs text-gray-400 space-y-1">
          <div>
            <span className="text-yellow-400">Effect:</span>{' '}
            {gemActivation.effect === 'aoe_damage'
              ? 'Area Damage'
              : gemActivation.effect === 'party_heal'
                ? 'Party Heal'
                : gemActivation.effect === 'party_buff'
                  ? 'Party Buff'
                  : 'Enemy Debuff'}
          </div>
          <div>
            <span className="text-yellow-400">Power:</span>{' '}
            {gemActivation.power}
          </div>
          <div>
            <span className="text-yellow-400">Target:</span>{' '}
            {gemActivation.target === 'all_enemies'
              ? 'All Enemies'
              : 'All Allies'}
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
        <div className="text-xs text-red-300">
          ⚠️ <span className="font-bold">Warning:</span> Removes stat bonuses,
          keeps spells. One-time use per battle.
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2.5">
        <MenuButton
          label="✓ Activate (Enter)"
          selected={false}
          onClick={onConfirm}
        />
        <MenuButton
          label="✗ Cancel (Escape)"
          selected={false}
          onClick={onCancel}
        />
      </div>

      {/* Keyboard Hint */}
      <div className="text-xs text-gray-500 text-center mt-3">
        Use Enter/Escape or click buttons
      </div>
    </div>
  );
}
