/*
 * PlayerStatusPanel: Status box for the current acting player unit
 */

import React from 'react';
import type { BattleUnit } from '../../types/game.js';
import { HPBar } from './HPBar.js';

export interface PlayerStatusPanelProps {
  unit?: BattleUnit;
  phase: 'menu' | 'targeting' | 'item-menu' | 'item-targeting' | 'ability-menu' | 'ability-targeting' | 'gem-menu' | 'animating' | 'resolving';
  defending: boolean;
}

export function PlayerStatusPanel({
  unit,
  phase,
  defending,
}: PlayerStatusPanelProps): React.ReactElement {
  if (!unit) {
    return (
      <div className="bg-gradient-to-b from-blue-900/95 to-blue-950/95 border-4 border-yellow-500/80 rounded-xl p-4 backdrop-blur-sm shadow-2xl">
        <div className="text-sm text-yellow-200">No active unit</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-900/95 to-blue-950/95 border-4 border-yellow-500/80 rounded-xl p-4 backdrop-blur-sm shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-yellow-300 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {unit.name}
        </div>
        <div className="text-xs text-yellow-200 uppercase font-semibold bg-blue-800/60 px-2 py-1 rounded border border-yellow-500/50">
          {phase}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <HPBar currentHp={unit.currentHp} maxHp={unit.maxHp} />
        {/* MP Bar */}
        <div className="text-xs font-semibold text-blue-300">
          MP: {unit.currentMp}/50
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden border border-blue-500/50">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, (unit.currentMp / 50) * 100))}%` }}
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div className="bg-blue-800/60 border-2 border-blue-600 rounded-lg px-2 py-1.5 text-center">
          <div className="text-yellow-300 font-bold">ATK</div>
          <div className="text-white font-semibold">{unit.atk}</div>
        </div>
        <div className="bg-blue-800/60 border-2 border-blue-600 rounded-lg px-2 py-1.5 text-center">
          <div className="text-yellow-300 font-bold">DEF</div>
          <div className="text-white font-semibold">{unit.def}</div>
        </div>
        <div className="bg-blue-800/60 border-2 border-blue-600 rounded-lg px-2 py-1.5 text-center">
          <div className="text-yellow-300 font-bold">SPD</div>
          <div className="text-white font-semibold">{unit.speed}</div>
        </div>
      </div>

      {defending && (
        <div className="mt-3 text-yellow-300 text-sm font-bold bg-blue-800/60 border-2 border-yellow-500/50 rounded-lg px-3 py-2 text-center">
          🛡️ Defending (next hit halved)
        </div>
      )}
    </div>
  );
}

