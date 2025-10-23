/*
 * EquipmentSystem: Handle equipment logic (equip, unequip, stat calculations)
 * 
 * Features:
 * - Equip items to units (weapon, armor, accessory slots)
 * - Unequip items from units
 * - Calculate unit stats with equipment bonuses
 * - Pure functions using Result type for error handling
 */

import { Ok, Err, type Result } from '../utils/Result.js';
import type { Equipment, InventoryData, PlayerUnit } from '../types/game.js';

/**
 * Equip an item to a unit
 * If unit already has item in this slot, it's unequipped first
 */
export function equipItem(
  inventory: InventoryData,
  unitId: string,
  equipment: Equipment
): Result<InventoryData, string> {
  // 1. Check if item exists in unequippedItems
  const itemIndex = inventory.unequippedItems.findIndex(i => i.id === equipment.id);
  if (itemIndex === -1) {
    return Err('Item not found in inventory');
  }

  // 2. Get currently equipped item in this slot (if any)
  const slotKey = `${unitId}-${equipment.slot}`;
  const currentEquipped = inventory.equippedItems.get(slotKey);
  
  // 3. Build new state (immutable)
  const newUnequipped = [...inventory.unequippedItems];
  newUnequipped.splice(itemIndex, 1); // Remove item being equipped
  
  if (currentEquipped) {
    newUnequipped.push(currentEquipped); // Add old item back to pool
  }
  
  const newEquipped = new Map(inventory.equippedItems);
  newEquipped.set(slotKey, equipment);

  return Ok({
    ...inventory,
    equippedItems: newEquipped,
    unequippedItems: newUnequipped
  });
}

/**
 * Unequip an item from a unit's slot
 */
export function unequipItem(
  inventory: InventoryData,
  unitId: string,
  slotType: 'weapon' | 'armor' | 'accessory'
): Result<InventoryData, string> {
  const slotKey = `${unitId}-${slotType}`;
  const equipped = inventory.equippedItems.get(slotKey);
  
  if (!equipped) {
    return Err(`No ${slotType} equipped in slot`);
  }
  
  const newEquipped = new Map(inventory.equippedItems);
  newEquipped.delete(slotKey);
  
  const newUnequipped = [...inventory.unequippedItems, equipped];
  
  return Ok({
    ...inventory,
    equippedItems: newEquipped,
    unequippedItems: newUnequipped
  });
}

/**
 * Get equipment in a specific slot for a unit
 */
export function getEquippedItem(
  inventory: InventoryData,
  unitId: string,
  slot: 'weapon' | 'armor' | 'accessory'
): Equipment | undefined {
  return inventory.equippedItems.get(`${unitId}-${slot}`);
}

/**
 * Calculate unit stats with equipment bonuses
 */
export function getUnitStats(
  unit: PlayerUnit,
  inventory: InventoryData
): { hp: number; atk: number; def: number; speed: number } {
  // Base stats
  let hp = unit.maxHp;
  let atk = unit.atk;
  let def = unit.def;
  let speed = unit.speed;
  
  // Add bonuses from each slot
  const slots: Array<'weapon' | 'armor' | 'accessory'> = ['weapon', 'armor', 'accessory'];
  
  for (const slot of slots) {
    const equipped = getEquippedItem(inventory, unit.id, slot);
    if (equipped?.stats) {
      hp += equipped.stats.hp ?? 0;
      atk += equipped.stats.atk ?? 0;
      def += equipped.stats.def ?? 0;
      speed += equipped.stats.speed ?? 0;
    }
  }
  
  return { hp, atk, def, speed };
}

/**
 * Get all unequipped items
 */
export function getUnequippedItems(
  inventory: InventoryData
): readonly Equipment[] {
  return inventory.unequippedItems;
}
