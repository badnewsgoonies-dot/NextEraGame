/*
 * InventoryScreen: View and manage items outside of battle
 * 
 * Features:
 * - View all consumables and equipment
 * - Use healing items on team members
 * - See item descriptions and stats
 * - Validation for item usage
 */

import { useState } from 'react';
import type { PlayerUnit, Item, InventoryData } from '../types/game.js';
import { useConsumableItem, canUseItem } from '../systems/ItemSystem.js';

export interface InventoryScreenProps {
  readonly team: readonly PlayerUnit[];
  readonly inventory: InventoryData;
  readonly onUpdateInventory: (inventory: InventoryData) => void;
  readonly onUpdateTeam: (team: readonly PlayerUnit[]) => void;
  readonly onClose: () => void;
}

export function InventoryScreen({
  team,
  inventory,
  onUpdateInventory,
  onUpdateTeam,
  onClose
}: InventoryScreenProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showUseModal, setShowUseModal] = useState(false);

  const handleUseItem = (item: Item, targetId: string) => {
    const target = team.find(u => u.id === targetId);
    if (!target) return;

    const result = useConsumableItem(item, target, inventory);
    
    if (!result.ok) {
      console.error('Failed to use item:', result.error);
      return;
    }

    // Update inventory and team
    onUpdateInventory(result.value.inventory);
    
    const updatedTeam = team.map(u =>
      u.id === targetId ? result.value.unit : u
    );
    onUpdateTeam(updatedTeam);

    // Close modal
    setShowUseModal(false);
    setSelectedItem(null);
  };

  const consumables = inventory.items.filter(i => i.type === 'consumable');
  const equipment = inventory.unequippedItems;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">📦 Inventory</h1>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

        {/* Consumables Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Consumables ({consumables.length})
          </h2>
          
          {consumables.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {consumables.map((item, index) => {
                const anyoneCanUse = team.some(u => canUseItem(item, u).ok);
                
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-lg">{item.name}</h3>
                      <span className="text-xs px-2 py-1 bg-purple-700 rounded text-white">
                        {item.rarity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                    
                    {item.stats?.hpRestore && (
                      <div className="text-green-400 text-sm mb-3">
                        Restores {item.stats.hpRestore} HP
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowUseModal(true);
                      }}
                      disabled={!anyoneCanUse}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
                    >
                      {anyoneCanUse ? 'Use' : 'No Valid Targets'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 italic">No consumable items</p>
          )}
        </div>

        {/* Equipment Section (Read-only for now) */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Unequipped Items ({equipment.length})
          </h2>
          
          {equipment.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-700 rounded text-white">
                      {item.slot}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2">
                    {item.rarity}
                  </div>
                  
                  <div className="text-sm text-gray-300">
                    {item.stats.hp && `HP +${item.stats.hp} `}
                    {item.stats.atk && `ATK +${item.stats.atk} `}
                    {item.stats.def && `DEF +${item.stats.def} `}
                    {item.stats.speed && `SPD +${item.stats.speed}`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No unequipped items</p>
          )}
        </div>

        {/* Use Item Modal */}
        {showUseModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">
                Use {selectedItem.name} on:
              </h3>
              
              <div className="space-y-2 mb-4">
                {team.map(unit => {
                  const canUse = canUseItem(selectedItem, unit);
                  
                  return (
                    <button
                      key={unit.id}
                      onClick={() => handleUseItem(selectedItem, unit.id)}
                      disabled={!canUse.ok}
                      className="w-full p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded-lg text-left transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">{unit.name}</div>
                          <div className="text-sm text-gray-400">
                            HP: {unit.hp}/{unit.maxHp}
                          </div>
                        </div>
                        {!canUse.ok && (
                          <div className="text-xs text-red-400">{canUse.error}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setShowUseModal(false);
                  setSelectedItem(null);
                }}
                className="w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
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
