/*
 * EquipmentScreen: Manage unit equipment after battles
 * 
 * Features:
 * - Display all units with their equipped items
 * - Show unequipped items pool
 * - Equip items to units via modal
 * - Unequip items back to pool
 */

import { useState } from 'react';
import type { PlayerUnit, Equipment, InventoryData } from '../types/game.js';

export interface EquipmentScreenProps {
  readonly team: readonly PlayerUnit[];
  readonly inventory: InventoryData;
  readonly onEquip: (unitId: string, equipment: Equipment) => void;
  readonly onUnequip: (unitId: string, slot: 'weapon' | 'armor' | 'accessory') => void;
  readonly onContinue: () => void;
}

export function EquipmentScreen({
  team,
  inventory,
  onEquip,
  onUnequip,
  onContinue
}: EquipmentScreenProps) {
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [showEquipModal, setShowEquipModal] = useState(false);

  const handleItemClick = (item: Equipment) => {
    setSelectedItem(item);
    setShowEquipModal(true);
  };

  const handleEquipToUnit = (unitId: string) => {
    if (selectedItem) {
      onEquip(unitId, selectedItem);
      setShowEquipModal(false);
      setSelectedItem(null);
    }
  };

  const handleUnequip = (unitId: string, slot: 'weapon' | 'armor' | 'accessory') => {
    onUnequip(unitId, slot);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          ⚔️ Equipment Management
        </h1>

        {/* Team Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Your Team:</h2>
          <div className="space-y-4">
            {team.map(unit => {
              // Get equipped items for this unit
              const weapon = inventory.equippedItems.get(`${unit.id}-weapon`);
              const armor = inventory.equippedItems.get(`${unit.id}-armor`);
              const accessory = inventory.equippedItems.get(`${unit.id}-accessory`);
              
              return (
                <div key={unit.id} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {unit.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        HP: {unit.hp}/{unit.maxHp} | ATK: {unit.atk} | DEF: {unit.def} | SPD: {unit.speed}
                      </p>
                    </div>
                  </div>
                  
                  {/* Equipment Slots */}
                  <div className="space-y-2">
                    {/* Weapon Slot */}
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Weapon:
                      </span>
                      {weapon ? (
                        <div className="flex-1 flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded p-2">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {weapon.name} {weapon.stats.atk && `(+${weapon.stats.atk} ATK)`}
                          </span>
                          <button
                            onClick={() => handleUnequip(unit.id, 'weapon')}
                            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                          >
                            Unequip
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">None</span>
                      )}
                    </div>
                    
                    {/* Armor Slot */}
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Armor:
                      </span>
                      {armor ? (
                        <div className="flex-1 flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded p-2">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {armor.name} {armor.stats.def && `(+${armor.stats.def} DEF)`}
                          </span>
                          <button
                            onClick={() => handleUnequip(unit.id, 'armor')}
                            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                          >
                            Unequip
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">None</span>
                      )}
                    </div>
                    
                    {/* Accessory Slot */}
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Accessory:
                      </span>
                      {accessory ? (
                        <div className="flex-1 flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded p-2">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {accessory.name} {accessory.stats.speed && `(+${accessory.stats.speed} SPD)`}
                          </span>
                          <button
                            onClick={() => handleUnequip(unit.id, 'accessory')}
                            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                          >
                            Unequip
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">None</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unequipped Items */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Unequipped Items ({inventory.unequippedItems.length}):
          </h2>
          {inventory.unequippedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventory.unequippedItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.slot} • {item.rarity}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {item.stats.hp && `HP +${item.stats.hp} `}
                    {item.stats.atk && `ATK +${item.stats.atk} `}
                    {item.stats.def && `DEF +${item.stats.def} `}
                    {item.stats.speed && `SPD +${item.stats.speed}`}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No unequipped items</p>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-lg transition-colors shadow-lg"
        >
          Continue to Recruitment →
        </button>

        {/* Equip Modal */}
        {showEquipModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Equip {selectedItem.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a unit to equip this {selectedItem.slot}:
              </p>
              <div className="space-y-2 mb-4">
                {team.map(unit => (
                  <button
                    key={unit.id}
                    onClick={() => handleEquipToUnit(unit.id)}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {unit.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {unit.role}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowEquipModal(false);
                  setSelectedItem(null);
                }}
                className="w-full py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
