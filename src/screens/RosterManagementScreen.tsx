/*
 * RosterManagementScreen: Manage active party and bench units
 * 
 * Features:
 * - View all units (active party + bench)
 * - Swap units between active and bench
 * - Visual distinction (green=active, gray=bench, yellow=selected)
 * - Continue to next battle after roster management
 */

import React, { useState } from 'react';
import type { PlayerUnit, Role, InventoryData } from '../types/game.js';
import { getUnitStats } from '../systems/EquipmentSystem.js';
import { EquipmentPanel } from '../components/roster/EquipmentPanel.js';

export interface RosterManagementScreenProps {
  readonly activeParty: readonly PlayerUnit[];
  readonly bench: readonly PlayerUnit[];
  readonly inventory: InventoryData;
  readonly onSwap: (benchUnitId: string, activeUnitId: string) => void;
  readonly onContinue: () => void;
}

const ROLE_COLORS: Record<Role, string> = {
  Tank: 'bg-blue-600',
  DPS: 'bg-red-600',
  Support: 'bg-purple-600',
  Specialist: 'bg-amber-600',
};

export function RosterManagementScreen({
  activeParty,
  bench,
  inventory,
  onSwap,
  onContinue,
}: RosterManagementScreenProps): React.ReactElement {
  const [selectedBenchUnit, setSelectedBenchUnit] = useState<string | null>(null);
  const [selectedActiveUnit, setSelectedActiveUnit] = useState<string | null>(null);
  const [equipmentPanelUnit, setEquipmentPanelUnit] = useState<PlayerUnit | null>(null);

  const canSwap = selectedBenchUnit !== null && selectedActiveUnit !== null;

  // Helper function to render stat with equipment bonuses
  const renderStat = (label: string, baseValue: number, totalValue: number) => {
    const hasBonus = totalValue !== baseValue;

    return (
      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
        <div className="text-gray-500 dark:text-gray-400 text-xs">{label}</div>
        <div className="font-bold text-xs">
          {hasBonus ? (
            <>
              <span className="text-gray-400">{baseValue}</span>
              <span className="text-gray-400"> → </span>
              <span className="text-green-400">{totalValue}</span>
              <span className="text-yellow-400"> (+{totalValue - baseValue})</span>
            </>
          ) : (
            <span className="text-gray-900 dark:text-white">{baseValue}</span>
          )}
        </div>
      </div>
    );
  };

  const handleSwap = () => {
    if (canSwap && selectedBenchUnit && selectedActiveUnit) {
      onSwap(selectedBenchUnit, selectedActiveUnit);
      // Clear selections after swap
      setSelectedBenchUnit(null);
      setSelectedActiveUnit(null);
    }
  };

  const handleActiveClick = (unitId: string) => {
    // Toggle selection
    setSelectedActiveUnit(prev => prev === unitId ? null : unitId);
  };

  const handleBenchClick = (unitId: string) => {
    // Toggle selection
    setSelectedBenchUnit(prev => prev === unitId ? null : unitId);
  };

  // Create 4 slots for active party (including empty slots)
  const activeSlots = Array.from({ length: 4 }, (_, i) => activeParty[i] || null);

  return (
    <div className="h-full w-full bg-gradient-to-b from-blue-800 to-blue-900 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-blue-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-1">
            Roster Management
          </h1>
          <p className="text-sm text-blue-200 mb-2">
            Select one unit from Active Party and one from Bench to swap them
          </p>
          {canSwap && (
            <button
              onClick={handleSwap}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors shadow-lg text-sm"
            >
              Swap Units ⇄
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="max-w-7xl mx-auto">
          {/* Active Party Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-3">
              Active Party (4 slots)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {activeSlots.map((unit, index) => {
              if (!unit) {
                // Empty slot
                return (
                  <div
                    key={`empty-${index}`}
                    className="bg-white/10 rounded-lg p-6 border-2 border-dashed border-blue-400 min-h-[280px] flex items-center justify-center"
                  >
                    <span className="text-blue-300 text-lg">Empty Slot</span>
                  </div>
                );
              }

              const isSelected = selectedActiveUnit === unit.id;
              const spriteColor = ROLE_COLORS[unit.role];
              const stats = getUnitStats(unit, inventory);

              return (
                <button
                  key={unit.id}
                  onClick={() => handleActiveClick(unit.id)}
                  className={`bg-white dark:bg-gray-800 rounded-lg p-6 border-2 transition-[colors,shadow] duration-200 hover:shadow-lg text-left ${
                    isSelected
                      ? 'border-yellow-400 shadow-yellow-400/50 shadow-lg'
                      : 'border-green-500 hover:border-green-400'
                  }`}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="text-center mb-2">
                      <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-sm font-bold rounded-full">
                        ✓ Selected
                      </span>
                    </div>
                  )}

                  {/* Unit Sprite */}
                  <div className="flex justify-center mb-4">
                    {(unit.portraitUrl || unit.spriteUrl) ? (
                      <img 
                        src={unit.portraitUrl || unit.spriteUrl}
                        alt={`${unit.name} sprite`}
                        className="w-20 h-20 object-contain pixel-art drop-shadow-lg"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div className={`w-20 h-20 rounded-full ${spriteColor} border-4 border-white shadow-lg flex items-center justify-center`}>
                        <span className="text-white text-3xl font-bold">
                          {unit.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Unit Info */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    {unit.name}
                  </h3>
                  
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {unit.role} • Level {unit.level}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">HP</div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {unit.hp}/{stats.hp}
                      </div>
                    </div>
                    {renderStat('ATK', unit.atk, stats.atk)}
                    {renderStat('DEF', unit.def, stats.def)}
                    {renderStat('SPD', unit.speed, stats.speed)}
                  </div>

                  {/* Show Equipment Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEquipmentPanelUnit(unit);
                    }}
                    className="mt-3 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded transition-colors"
                  >
                    ⚔️ Show Equipment
                  </button>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bench Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-3">
            Bench ({bench.length} units)
          </h2>
          
          {bench.length === 0 ? (
            <div className="bg-white/10 rounded-lg p-8 border-2 border-dashed border-blue-400 text-center">
              <span className="text-blue-300 text-lg">No units on bench</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {bench.map((unit) => {
                const isSelected = selectedBenchUnit === unit.id;
                const spriteColor = ROLE_COLORS[unit.role];
                const stats = getUnitStats(unit, inventory);

                return (
                  <button
                    key={unit.id}
                    onClick={() => handleBenchClick(unit.id)}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-2 transition-[colors,shadow] duration-200 hover:shadow-lg text-left ${
                      isSelected
                        ? 'border-yellow-400 shadow-yellow-400/50 shadow-lg'
                        : 'border-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="text-center mb-1">
                        <span className="inline-block px-2 py-0.5 bg-yellow-400 text-black text-xs font-bold rounded-full">
                          ✓ Selected
                        </span>
                      </div>
                    )}

                    {/* Unit Sprite */}
                    <div className="flex justify-center mb-3">
                      {(unit.portraitUrl || unit.spriteUrl) ? (
                        <img 
                          src={unit.portraitUrl || unit.spriteUrl}
                          alt={`${unit.name} sprite`}
                          className="w-20 h-20 object-contain pixel-art drop-shadow-lg"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      ) : (
                        <div className={`w-20 h-20 rounded-full ${spriteColor} border-4 border-white shadow-lg flex items-center justify-center`}>
                          <span className="text-white text-3xl font-bold">
                            {unit.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Unit Info */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                      {unit.name}
                    </h3>
                    
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {unit.role} • Level {unit.level}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded">
                        <div className="text-gray-500 dark:text-gray-400 text-xs">HP</div>
                        <div className="font-bold text-gray-900 dark:text-white text-xs">
                          {unit.hp}/{stats.hp}
                        </div>
                      </div>
                      {renderStat('ATK', unit.atk, stats.atk)}
                      {renderStat('DEF', unit.def, stats.def)}
                      {renderStat('SPD', unit.speed, stats.speed)}
                    </div>

                    {/* Show Equipment Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEquipmentPanelUnit(unit);
                      }}
                      className="mt-2 w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors"
                    >
                      ⚔️ Equipment
                    </button>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 p-4 border-t border-blue-700 bg-blue-900">
        <div className="max-w-7xl mx-auto text-center">
          <button
            onClick={onContinue}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue to Next Battle →
          </button>
        </div>
      </div>

      {/* Equipment Panel Overlay */}
      {equipmentPanelUnit && (
        <EquipmentPanel
          unit={equipmentPanelUnit}
          inventory={inventory}
          onClose={() => setEquipmentPanelUnit(null)}
        />
      )}
    </div>
  );
}
