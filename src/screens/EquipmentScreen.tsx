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
      <div className="flex-shrink-0 p-6 border-b-2 border-purple-600/50 bg-gradient-to-b from-purple-800 to-purple-800/95">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
          ⚔️ Equipment Management
        </h1>
        <p className="text-center text-purple-200 mt-2 text-sm">
          Equip items to boost your team's power
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 scroll-smooth scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900">
        <div className="max-w-4xl mx-auto">
          {/* Team Display */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>👥</span> Your Team
            </h2>
            <div className="space-y-4">
              {team.map(unit => {
              // Get equipped items for this unit
              const weapon = inventory.equippedItems.get(`${unit.id}-weapon`);
              const armor = inventory.equippedItems.get(`${unit.id}-armor`);
              const accessory = inventory.equippedItems.get(`${unit.id}-accessory`);
              
              return (
                <div key={unit.id} className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl p-6 border-2 border-purple-500/60 shadow-xl hover:border-purple-400 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-300 drop-shadow-md">
                        {unit.name}
                      </h3>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-gray-300">
                          <span className="text-red-400 font-semibold">❤️ {unit.hp}</span>/{unit.maxHp}
                        </span>
                        <span className="text-blue-300">⚔️ {unit.atk}</span>
                        <span className="text-green-300">🛡️ {unit.def}</span>
                        <span className="text-yellow-300">⚡ {unit.speed}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Equipment Slots */}
                  <div className="space-y-3">
                    {/* Weapon Slot */}
                    <div className="flex items-center gap-4">
                      <span className="w-28 text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <span className="text-lg">⚔️</span> Weapon:
                      </span>
                      {weapon ? (
                        <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg p-3 border border-gray-600">
                          <span className="text-sm font-semibold text-white">
                            {weapon.name} {weapon.stats.atk && <span className="text-red-400">(+{weapon.stats.atk} ATK)</span>}
                          </span>
                          <button
                            onClick={() => handleUnequip(unit.id, 'weapon')}
                            className="text-xs px-3 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded transition-colors"
                          >
                            Unequip
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">None equipped</span>
                      )}
                    </div>
                    
                    {/* Armor Slot */}
                    <div className="flex items-center gap-4">
                      <span className="w-28 text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <span className="text-lg">🛡️</span> Armor:
                      </span>
                      {armor ? (
                        <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg p-3 border border-gray-600">
                          <span className="text-sm font-semibold text-white">
                            {armor.name} {armor.stats.def && <span className="text-green-400">(+{armor.stats.def} DEF)</span>}
                          </span>
                          <button
                            onClick={() => handleUnequip(unit.id, 'armor')}
                            className="text-xs px-3 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded transition-colors"
                          >
                            Unequip
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">None equipped</span>
                      )}
                    </div>
                    
                    {/* Accessory Slot */}
                    <div className="flex items-center gap-4">
                      <span className="w-28 text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <span className="text-lg">💍</span> Accessory:
                      </span>
                      {accessory ? (
                        <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg p-3 border border-gray-600">
                          <span className="text-sm font-semibold text-white">
                            {accessory.name} {accessory.stats.speed && <span className="text-yellow-400">(+{accessory.stats.speed} SPD)</span>}
                          </span>
                          <button
                            onClick={() => handleUnequip(unit.id, 'accessory')}
                            className="text-xs px-3 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded transition-colors"
                          >
                            Unequip
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">None equipped</span>
                      )}
                    </div>
                    
                    {/* Gem Slot (NEW - Progression System) */}
                    <div className="flex items-center gap-4">
                      <span className="w-28 text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <span className="text-lg">💎</span> Gem:
                      </span>
                      {unit.equippedGem ? (
                        <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-3 border-2 border-purple-500/50">
                          <div className="text-sm">
                            <span className="font-bold text-purple-200">
                              {getGemById(unit.equippedGem.gemId)?.name || 'Unknown Gem'}
                            </span>
                            {unit.subclass && (
                              <span className="ml-2 text-xs text-purple-300">
                                ({unit.subclass})
                              </span>
                            )}
                            <span className={`ml-2 text-xs font-semibold ${unit.equippedGem.state === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                              [{unit.equippedGem.state.toUpperCase()}]
                            </span>
                          </div>
                          {onUnequipGem && (
                            <button
                              onClick={() => onUnequipGem(unit.id)}
                              className="text-xs px-3 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded transition-colors"
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
            <span>📦</span> Unequipped Items ({inventory.unequippedItems.length})
          </h2>
          {inventory.unequippedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inventory.unequippedItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 text-left hover:from-slate-600 hover:to-slate-700 transition-all border-2 border-gray-600 hover:border-yellow-500 shadow-md hover:shadow-lg"
                >
                  <div className="font-bold text-white text-base mb-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    {item.slot} • <span className="text-purple-300">{item.rarity}</span>
                  </div>
                  <div className="text-xs text-gray-300 flex gap-2 flex-wrap">
                    {item.stats.hp && <span className="bg-red-900/30 text-red-300 px-2 py-1 rounded">HP +{item.stats.hp}</span>}
                    {item.stats.atk && <span className="bg-red-900/30 text-red-300 px-2 py-1 rounded">ATK +{item.stats.atk}</span>}
                    {item.stats.def && <span className="bg-green-900/30 text-green-300 px-2 py-1 rounded">DEF +{item.stats.def}</span>}
                    {item.stats.speed && <span className="bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded">SPD +{item.stats.speed}</span>}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-800/50 rounded-lg border-2 border-dashed border-gray-600">
              <p className="text-gray-400 italic">No unequipped items</p>
              <p className="text-xs text-gray-500 mt-1">Win battles to earn equipment!</p>
            </div>
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500/60 shadow-2xl">
              <h3 className="text-2xl font-bold text-yellow-300 mb-4 text-center">
                Equip {selectedItem.name}
              </h3>
              <p className="text-sm text-gray-300 mb-6 text-center">
                Select a unit to equip this {selectedItem.slot}
              </p>
              <div className="space-y-3 mb-6">
                {team.map(unit => (
                  <button
                    key={unit.id}
                    onClick={() => handleEquipToUnit(unit.id)}
                    className="w-full p-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-purple-700 hover:to-purple-800 rounded-lg text-left transition-all border-2 border-gray-600 hover:border-purple-400 shadow-md"
                  >
                    <div className="font-bold text-white text-lg">
                      {unit.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {unit.role} • Level {unit.level}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowEquipModal(false);
                  setSelectedItem(null);
                }}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
