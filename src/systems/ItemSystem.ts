/*
 * ItemSystem: Consumable Item Usage Logic
 * 
 * Handles validation and application of consumable items (healing potions, Phoenix Down, etc.)
 * 
 * Features:
 * - Pure functions (no mutations)
 * - Result type for error handling
 * - Proper validation (can't use potion at full HP, Phoenix Down only on KO'd units)
 * - Items consumed after use (removed from inventory)
 * 
 * Usage:
 * - Battle: Use items on allies during combat
 * - Inventory: Use items outside battle for healing/preparation
 */

import { Ok, Err, type Result } from '../utils/Result.js';
import type { Item, PlayerUnit, InventoryData } from '../types/game.js';

/**
 * Use a consumable item on a target unit
 * 
 * Validates usage, applies effects, and removes item from inventory.
 * 
 * @param item - The consumable item to use
 * @param target - The unit to apply effects to
 * @param inventory - Current inventory state
 * @returns Result with updated unit and inventory, or error message
 * 
 * @example
 * ```typescript
 * const result = useConsumableItem(healthPotion, damagedUnit, inventory);
 * if (result.ok) {
 *   console.log(`Restored ${result.value.unit.hp - target.hp} HP`);
 *   updateInventory(result.value.inventory);
 *   updateUnit(result.value.unit);
 * }
 * ```
 */
export function useConsumableItem(
  item: Item,
  target: PlayerUnit,
  inventory: InventoryData
): Result<{ unit: PlayerUnit; inventory: InventoryData }, string> {
  // 1. Validate item type
  if (item.type !== 'consumable') {
    return Err('Item is not consumable');
  }

  // 2. Check item exists in inventory
  const itemIndex = inventory.items.findIndex(i => i.id === item.id);
  if (itemIndex === -1) {
    return Err('Item not found in inventory');
  }

  // 3. Get item effects
  const hpRestore = item.stats?.hpRestore ?? 0;

  // 4. Validate usage based on item type and effect
  if (hpRestore <= 0 && item.id !== 'antidote') {
    return Err('Item has no usable effect');
  }

  if (hpRestore > 0) {
    // Healing item validation
    if (item.id === 'phoenix_down') {
      // Phoenix Down: Only works on KO'd units
      if (target.hp > 0) {
        return Err('Phoenix Down only works on KO\'d units');
      }
    } else {
      // Regular healing items: Only work on alive units
      if (target.hp === 0) {
        return Err('Cannot use on KO\'d unit (use Phoenix Down)');
      }
      if (target.hp >= target.maxHp) {
        return Err('Target is already at full HP');
      }
    }
  }

  // Antidote validation (future feature - always fail for now)
  if (item.id === 'antidote') {
    return Err('No status effects to cure');
  }

  // 5. Apply effects
  const newHp = Math.min(target.hp + hpRestore, target.maxHp);

  const updatedUnit: PlayerUnit = {
    ...target,
    hp: newHp
  };

  // 6. Remove item from inventory (consume it)
  const newItems = [...inventory.items];
  newItems.splice(itemIndex, 1);

  const updatedInventory: InventoryData = {
    ...inventory,
    items: newItems
  };

  return Ok({
    unit: updatedUnit,
    inventory: updatedInventory
  });
}

/**
 * Check if an item can be used on a target unit
 * 
 * Validates without modifying state. Used to enable/disable UI buttons
 * and show validation messages.
 * 
 * @param item - The item to check
 * @param target - The target unit
 * @returns Result with boolean (true if usable) or error message explaining why not
 * 
 * @example
 * ```typescript
 * const canUse = canUseItem(healthPotion, unit);
 * if (canUse.ok) {
 *   showUseButton();
 * } else {
 *   showDisabledButton(canUse.error);
 * }
 * ```
 */
export function canUseItem(
  item: Item,
  target: PlayerUnit
): Result<boolean, string> {
  // 1. Validate item type
  if (item.type !== 'consumable') {
    return Err('Item is not consumable');
  }

  // 2. Get item effects
  const hpRestore = item.stats?.hpRestore ?? 0;

  // 3. Validate usage based on item type
  if (hpRestore <= 0 && item.id !== 'antidote') {
    return Err('Item has no usable effect');
  }

  if (hpRestore > 0) {
    // Healing item validation
    if (item.id === 'phoenix_down') {
      // Phoenix Down: Only works on KO'd units
      if (target.hp > 0) {
        return Err('Phoenix Down only works on KO\'d units');
      }
    } else {
      // Regular healing items: Only work on alive units
      if (target.hp === 0) {
        return Err('Cannot use on KO\'d unit');
      }
      if (target.hp >= target.maxHp) {
        return Err('Target is already at full HP');
      }
    }
  }

  // Antidote validation (future feature - always fail for now)
  if (item.id === 'antidote') {
    return Err('No status effects to cure');
  }

  return Ok(true);
}

/**
 * Get all items from inventory that can be used on a target
 * 
 * Filters inventory to only items that pass validation for the target.
 * 
 * @param inventory - Current inventory
 * @param target - The target unit
 * @returns Array of items that can be used on the target
 * 
 * @example
 * ```typescript
 * const usableItems = getUsableItems(inventory, woundedUnit);
 * // Returns [Health Potion, Mega Potion] but not Phoenix Down (unit not KO'd)
 * ```
 */
export function getUsableItems(
  inventory: InventoryData,
  target: PlayerUnit
): readonly Item[] {
  return inventory.items.filter(item => {
    const canUse = canUseItem(item, target);
    return canUse.ok && canUse.value === true;
  });
}
