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
import type { PlayerUnit, Role } from '../types/game.js';

export interface RosterManagementScreenProps {
  readonly activeParty: readonly PlayerUnit[];
  readonly bench: readonly PlayerUnit[];
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
  onSwap,
  onContinue,
}: RosterManagementScreenProps): React.ReactElement {
  const [selectedBenchUnit, setSelectedBenchUnit] = useState<string | null>(null);
  const [selectedActiveUnit, setSelectedActiveUnit] = useState<string | null>(null);

  const canSwap = selectedBenchUnit !== null && selectedActiveUnit !== null;

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
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Roster Management
          </h1>
          <p className="text-blue-200 mb-4">
            Select one unit from Active Party and one from Bench to swap them
          </p>
          {canSwap && (
            <button
              onClick={handleSwap}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors shadow-lg"
            >
              Swap Units ⇄
            </button>
          )}
        </div>

        {/* Active Party Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Active Party (4 slots)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              return (
                <button
                  key={unit.id}
                  onClick={() => handleActiveClick(unit.id)}
                  className={`bg-white dark:bg-gray-800 rounded-lg p-6 border-2 transition-all hover:shadow-lg text-left ${
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
                    <div className={`w-20 h-20 rounded-full ${spriteColor} border-4 border-white shadow-lg flex items-center justify-center`}>
                      <span className="text-white text-3xl font-bold">
                        {unit.name.charAt(0)}
                      </span>
                    </div>
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
                        {unit.hp}/{unit.maxHp}
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">ATK</div>
                      <div className="font-bold text-gray-900 dark:text-white">{unit.atk}</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">DEF</div>
                      <div className="font-bold text-gray-900 dark:text-white">{unit.def}</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">SPD</div>
                      <div className="font-bold text-gray-900 dark:text-white">{unit.speed}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bench Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Bench ({bench.length} units)
          </h2>
          
          {bench.length === 0 ? (
            <div className="bg-white/10 rounded-lg p-12 border-2 border-dashed border-blue-400 text-center">
              <span className="text-blue-300 text-xl">No units on bench</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {bench.map((unit) => {
                const isSelected = selectedBenchUnit === unit.id;
                const spriteColor = ROLE_COLORS[unit.role];

                return (
                  <button
                    key={unit.id}
                    onClick={() => handleBenchClick(unit.id)}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-6 border-2 transition-all hover:shadow-lg text-left ${
                      isSelected
                        ? 'border-yellow-400 shadow-yellow-400/50 shadow-lg'
                        : 'border-gray-500 hover:border-gray-400'
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
                      <div className={`w-20 h-20 rounded-full ${spriteColor} border-4 border-white shadow-lg flex items-center justify-center`}>
                        <span className="text-white text-3xl font-bold">
                          {unit.name.charAt(0)}
                        </span>
                      </div>
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
                          {unit.hp}/{unit.maxHp}
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <div className="text-gray-500 dark:text-gray-400">ATK</div>
                        <div className="font-bold text-gray-900 dark:text-white">{unit.atk}</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <div className="text-gray-500 dark:text-gray-400">DEF</div>
                        <div className="font-bold text-gray-900 dark:text-white">{unit.def}</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <div className="text-gray-500 dark:text-gray-400">SPD</div>
                        <div className="font-bold text-gray-900 dark:text-white">{unit.speed}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xl shadow-lg"
          >
            Continue to Next Battle →
          </button>
        </div>
      </div>
    </div>
  );
}
