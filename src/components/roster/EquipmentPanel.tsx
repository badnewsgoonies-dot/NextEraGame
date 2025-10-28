/*
 * EquipmentPanel: Display unit's equipped items with stat bonuses
 *
 * Features:
 * - Shows equipped weapon, armor, accessory, gem
 * - Displays stat bonuses from equipment
 * - Read-only view (no equip/unequip actions)
 * - Clean overlay design
 */

import React from 'react';
import type { PlayerUnit, InventoryData, Equipment } from '../../types/game.js';
import { getUnitStats, getEquippedItem } from '../../systems/EquipmentSystem.js';
import { getGemById } from '../../data/gems.js';

export interface EquipmentPanelProps {
  readonly unit: PlayerUnit;
  readonly inventory: InventoryData;
  readonly onClose: () => void;
  readonly onManageEquipment?: () => void; // Placeholder for future functionality
}

export function EquipmentPanel({
  unit,
  inventory,
  onClose,
  onManageEquipment
}: EquipmentPanelProps): React.ReactElement {
  // Calculate stats with equipment bonuses
  const stats = getUnitStats(unit, inventory);

  // Get equipped items
  const equippedWeapon = getEquippedItem(inventory, unit.id, 'weapon');
  const equippedArmor = getEquippedItem(inventory, unit.id, 'armor');
  const equippedAccessory = getEquippedItem(inventory, unit.id, 'accessory');
  const equippedGem = unit.equippedGem ? getGemById(unit.equippedGem.gemId) : null;

  // Helper to render stat with bonus
  const renderStatWithBonus = (label: string, baseStat: number, totalStat: number) => {
    const hasBonus = totalStat !== baseStat;

    return (
      <div className="flex items-center justify-between py-1">
        <span className="text-gray-400 text-sm">{label}:</span>
        <div className="text-sm">
          {hasBonus ? (
            <>
              <span className="text-gray-400">{baseStat}</span>
              <span className="text-gray-400 mx-1">→</span>
              <span className="text-green-400 font-bold">{totalStat}</span>
              <span className="text-yellow-400 ml-1">(+{totalStat - baseStat})</span>
            </>
          ) : (
            <span className="text-white font-bold">{baseStat}</span>
          )}
        </div>
      </div>
    );
  };

  // Helper to render equipment slot
  const renderEquipmentSlot = (slotName: string, equipment: Equipment | null | undefined) => {
    return (
      <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
        <div className="text-sm font-semibold text-gray-400 mb-1">{slotName}</div>
        {equipment ? (
          <div>
            <div className="text-white font-bold">{equipment.name}</div>
            <div className="text-xs text-gray-400 mt-1">{equipment.description}</div>
            {equipment.stats && Object.keys(equipment.stats).length > 0 && (
              <div className="mt-2 text-xs">
                {equipment.stats.hp && <div className="text-red-400">HP: +{equipment.stats.hp}</div>}
                {equipment.stats.atk && <div className="text-red-400">ATK: +{equipment.stats.atk}</div>}
                {equipment.stats.def && <div className="text-blue-400">DEF: +{equipment.stats.def}</div>}
                {equipment.stats.speed && <div className="text-yellow-400">SPD: +{equipment.stats.speed}</div>}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 italic text-sm">Empty</div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl p-6 max-w-2xl w-full border-2 border-blue-500 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{unit.name}'s Equipment</h2>
            <div className="text-sm text-gray-400">{unit.role} • Level {unit.level}</div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold px-3 py-1 hover:bg-gray-800 rounded transition-colors"
            aria-label="Close equipment panel"
          >
            ×
          </button>
        </div>

        {/* Stats Summary */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-2">Stats (with equipment)</h3>
          <div className="grid grid-cols-2 gap-x-4">
            {renderStatWithBonus('HP', unit.maxHp, stats.hp)}
            {renderStatWithBonus('MP', unit.currentMp, stats.mp)}
            {renderStatWithBonus('ATK', unit.atk, stats.atk)}
            {renderStatWithBonus('DEF', unit.def, stats.def)}
            {renderStatWithBonus('SPD', unit.speed, stats.speed)}
          </div>
        </div>

        {/* Equipment Slots */}
        <div className="space-y-3 mb-4">
          <h3 className="text-lg font-bold text-white">Equipment Slots</h3>
          {renderEquipmentSlot('⚔️ Weapon', equippedWeapon)}
          {renderEquipmentSlot('🛡️ Armor', equippedArmor)}
          {renderEquipmentSlot('💍 Accessory', equippedAccessory)}

          {/* Gem Slot */}
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-sm font-semibold text-gray-400 mb-1">💎 Gem</div>
            {equippedGem ? (
              <div>
                <div className="text-white font-bold">{equippedGem.name}</div>
                <div className="text-xs text-gray-400 mt-1">{equippedGem.description}</div>
                <div className="text-xs text-purple-400 mt-1">Element: {equippedGem.element}</div>
              </div>
            ) : (
              <div className="text-gray-500 italic text-sm">No gem equipped</div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
          >
            Close
          </button>
          {onManageEquipment && (
            <button
              onClick={onManageEquipment}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              disabled
              title="Equipment management coming in future update"
            >
              Manage Equipment (Coming Soon)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
