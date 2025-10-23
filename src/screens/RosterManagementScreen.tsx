/*
 * RosterManagementScreen: Manage active party and bench units
 *
 * Features:
 * - View full roster (active 4 + bench)
 * - Swap units between active party and bench
 * - Visual distinction (green=active, gray=bench, yellow=selected)
 * - Continue to next battle
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

  const handleUnitClick = (unitId: string, isActive: boolean) => {
    if (isActive) {
      // Toggle active unit selection
      setSelectedActiveUnit(prev => prev === unitId ? null : unitId);
    } else {
      // Toggle bench unit selection
      setSelectedBenchUnit(prev => prev === unitId ? null : unitId);
    }
  };

  const handleSwap = () => {
    if (canSwap && selectedBenchUnit && selectedActiveUnit) {
      onSwap(selectedBenchUnit, selectedActiveUnit);
      // Clear selections after swap
      setSelectedBenchUnit(null);
      setSelectedActiveUnit(null);
    }
  };

  // Render unit card
  const renderUnitCard = (unit: PlayerUnit, isActive: boolean, isSelected: boolean) => {
    const spriteColor = ROLE_COLORS[unit.role];
    const borderColor = isSelected
      ? 'border-yellow-400'
      : isActive
      ? 'border-green-500'
      : 'border-gray-400';

    return (
      <button
        key={unit.id}
        onClick={() => handleUnitClick(unit.id, isActive)}
        className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-2 ${borderColor} hover:shadow-lg transition-all text-left relative`}
      >
        {/* Selection badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            ✓ Selected
          </div>
        )}

        {/* Unit Sprite */}
        <div className="flex justify-center mb-3">
          <div className={`w-16 h-16 rounded-full ${spriteColor} border-4 border-white shadow-lg flex items-center justify-center`}>
            <span className="text-white text-2xl font-bold">
              {unit.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Unit Info */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-1">
          {unit.name}
        </h3>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          {unit.role} • Lv {unit.level}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded">
            <div className="text-gray-500 dark:text-gray-400">HP</div>
            <div className="font-bold text-gray-900 dark:text-white">{unit.hp}/{unit.maxHp}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded">
            <div className="text-gray-500 dark:text-gray-400">ATK</div>
            <div className="font-bold text-gray-900 dark:text-white">{unit.atk}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded">
            <div className="text-gray-500 dark:text-gray-400">DEF</div>
            <div className="font-bold text-gray-900 dark:text-white">{unit.def}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded">
            <div className="text-gray-500 dark:text-gray-400">SPD</div>
            <div className="font-bold text-gray-900 dark:text-white">{unit.speed}</div>
          </div>
        </div>
      </button>
    );
  };

  // Render empty slot
  const renderEmptySlot = (index: number) => (
    <div
      key={`empty-${index}`}
      className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-[200px]"
    >
      <div className="text-center text-gray-400 dark:text-gray-500">
        <div className="text-4xl mb-2">○</div>
        <div className="text-sm">Empty Slot</div>
      </div>
    </div>
  );

  // Create array of 4 slots (filled or empty)
  const activeSlots = Array.from({ length: 4 }, (_, i) => {
    const unit = activeParty[i];
    return unit ? renderUnitCard(unit, true, selectedActiveUnit === unit.id) : renderEmptySlot(i);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Roster Management
          </h1>
          <p className="text-green-200 mb-2">
            Select one unit from Active Party and one from Bench to swap them
          </p>
          <div className="text-sm text-green-300">
            Active: {activeParty.length}/4 • Bench: {bench.length}
          </div>
        </div>

        {/* Swap Button (conditional) */}
        {canSwap && (
          <div className="text-center mb-6">
            <button
              onClick={handleSwap}
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-bold rounded-lg transition-colors shadow-lg"
            >
              Swap Selected Units ⇄
            </button>
          </div>
        )}

        {/* Active Party Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            Active Party (Combat Team)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeSlots}
          </div>
        </div>

        {/* Bench Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-400 rounded-full"></span>
            Bench (Reserves)
          </h2>
          {bench.length === 0 ? (
            <div className="bg-gray-700/50 rounded-lg p-8 text-center text-gray-300">
              No units on bench
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bench.map(unit => renderUnitCard(unit, false, selectedBenchUnit === unit.id))}
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-lg"
          >
            Continue to Next Battle →
          </button>
        </div>
      </div>
    </div>
  );
}
