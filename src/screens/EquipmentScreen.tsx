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
import { getGemById } from '../data/gems.js';

export interface EquipmentScreenProps {
  readonly team: readonly PlayerUnit[];
  readonly inventory: InventoryData;
  readonly onEquip: (unitId: string, equipment: Equipment) => void;
  readonly onUnequip: (unitId: string, slot: 'weapon' | 'armor' | 'accessory') => void;
  readonly onEquipGem?: (unitId: string, gemId: string) => void;
  readonly onUnequipGem?: (unitId: string) => void;
  readonly onContinue: () => void;
}

export function EquipmentScreen({
  team,
  inventory,
  onEquip,
  onUnequip,
  onEquipGem: _onEquipGem, // TODO: Wire up in future update
  onUnequipGem,
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
    <div className="h-full w-full bg-gradient-to-b from-purple-800 to-purple-900 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-purple-700">
        <h1 className="text-3xl font-bold text-white text-center">
          ⚔️ Equipment Management
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="max-w-4xl mx-auto">
          {/* Team Display */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Your Team:</h2>
            <div className="space-y-3">
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
                    
                    {/* Gem Slot (NEW - Progression System) */}
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                        💎 Gem:
                      </span>
                      {unit.equippedGem ? (
                        <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded p-2 border border-purple-300 dark:border-purple-600">
                          <div className="text-sm">
                            <span className="font-semibold text-purple-900 dark:text-purple-100">
                              {getGemById(unit.equippedGem.gemId)?.name || 'Unknown Gem'}
                            </span>
                            {unit.subclass && (
                              <span className="ml-2 text-xs text-purple-700 dark:text-purple-300">
                                ({unit.subclass})
                              </span>
                            )}
                            <span className={`ml-2 text-xs ${unit.equippedGem.state === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                              [{unit.equippedGem.state.toUpperCase()}]
                            </span>
                          </div>
                          {onUnequipGem && (
                            <button
                              onClick={() => onUnequipGem(unit.id)}
                              className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                            >
                              Unequip
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">None (gems grant abilities)</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unequipped Items */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Unequipped Items ({inventory.unequippedItems.length}):
          </h2>
          {inventory.unequippedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inventory.unequippedItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {item.slot} • {item.rarity}
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                    {item.stats.hp && `HP +${item.stats.hp} `}
                    {item.stats.atk && `ATK +${item.stats.atk} `}
                    {item.stats.def && `DEF +${item.stats.def} `}
                    {item.stats.speed && `SPD +${item.stats.speed}`}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No unequipped items</p>
          )}
        </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 p-4 border-t border-purple-700 bg-purple-900">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onContinue}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue to Recruitment →
          </button>
        </div>
      </div>

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
  );
}
