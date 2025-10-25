# 🍶 Task: Implement Consumable Items System

## 📋 Overview

**Goal:** Add a complete consumable items system that allows players to use healing potions and items during battle and manage their inventory outside of battle.

**Design:** Build on existing foundations (items catalog, types, rewards already working) and add:
- Item usage logic (consume item, restore HP, remove from inventory)
- Battle integration (Items action menu, target selection, animation)
- Inventory management screen (view items, see descriptions)

**Time Estimate:**
- **AI Time:** 4-6 hours
- **Human Time Equivalent:** 12-16 hours

**Current Context:**
- 5 consumable items already defined in `items.ts` (Health Potion, Mega Potion, Elixir, Phoenix Down, Antidote)
- Items drop from battles via RewardSystem
- `ItemUsedAction` combat log type exists in `game.ts`
- `getConsumables()` filter method exists in GameController
- Tests exist for consumable filtering
- 905+ tests passing, 10/10 health score

---

## 🎯 Phase 1: Core Item Usage System (90 min)

### **Task 1.1: Create ItemSystem.ts**

**File to Create:** `src/systems/ItemSystem.ts`

**Purpose:** Handle consumable item usage logic (validate, apply effects, update inventory).

**Required Functions:**

#### **1. useConsumableItem** - Main usage function

```typescript
/**
 * Use a consumable item on a target unit
 * 
 * @param item - The consumable item to use
 * @param target - The unit to apply effects to
 * @param inventory - Current inventory state
 * @returns Result with updated unit and inventory, or error message
 */
export function useConsumableItem(
  item: Item,
  target: PlayerUnit,
  inventory: InventoryData
): Result<{ unit: PlayerUnit; inventory: InventoryData }, string>
```

**Implementation Logic:**
1. Validate item is consumable type
2. Check item exists in inventory
3. Validate target can benefit from item:
   - Health Potion/Mega Potion/Elixir: Only if HP < maxHp
   - Phoenix Down: Only if unit is KO'd (hp === 0)
   - Antidote: Only if poisoned (future feature, skip for now)
4. Apply item effects:
   - Restore HP (capped at maxHp)
   - Track amount actually restored
5. Remove item from inventory (consume it)
6. Return updated unit + inventory

**Example Implementation:**

```typescript
import { Ok, Err, type Result } from '../utils/Result.js';
import type { Item, PlayerUnit, InventoryData } from '../types/game.js';

/**
 * Use a consumable item on a target unit
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

  // 3. Validate usage based on item type
  const hpRestore = item.stats.hpRestore ?? 0;

  if (hpRestore > 0) {
    // Healing item
    if (target.hp >= target.maxHp) {
      return Err('Target is already at full HP');
    }
    if (target.hp === 0 && item.id !== 'phoenix_down') {
      return Err('Cannot use on KO\'d unit (use Phoenix Down)');
    }
  }

  if (item.id === 'phoenix_down') {
    if (target.hp > 0) {
      return Err('Phoenix Down only works on KO\'d units');
    }
  }

  // 4. Apply effects
  const newHp = Math.min(target.hp + hpRestore, target.maxHp);
  const actualRestore = newHp - target.hp;

  const updatedUnit: PlayerUnit = {
    ...target,
    hp: newHp
  };

  // 5. Remove item from inventory (consume it)
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
```

#### **2. canUseItem** - Validation helper

```typescript
/**
 * Check if an item can be used on a target unit
 * 
 * @param item - The item to check
 * @param target - The target unit
 * @returns Result with boolean (true if usable) or error message explaining why not
 */
export function canUseItem(
  item: Item,
  target: PlayerUnit
): Result<boolean, string>
```

**Implementation Logic:**
1. Same validation as `useConsumableItem` but without modifying state
2. Returns Ok(true) if item can be used
3. Returns Err(reason) if item cannot be used
4. Used for UI to show/hide "Use" button or gray it out

**Example Implementation:**

```typescript
/**
 * Check if an item can be used on a target
 */
export function canUseItem(
  item: Item,
  target: PlayerUnit
): Result<boolean, string> {
  if (item.type !== 'consumable') {
    return Err('Item is not consumable');
  }

  const hpRestore = item.stats.hpRestore ?? 0;

  if (hpRestore > 0) {
    if (target.hp >= target.maxHp) {
      return Err('Target is already at full HP');
    }
    if (target.hp === 0 && item.id !== 'phoenix_down') {
      return Err('Cannot use on KO\'d unit');
    }
  }

  if (item.id === 'phoenix_down') {
    if (target.hp > 0) {
      return Err('Phoenix Down only works on KO\'d units');
    }
  }

  // Antidote check (future feature - always fail for now)
  if (item.id === 'antidote') {
    return Err('No status effects to cure');
  }

  return Ok(true);
}
```

#### **3. getUsableItems** - Filter helper

```typescript
/**
 * Get all items from inventory that can be used on a target
 * 
 * @param inventory - Current inventory
 * @param target - The target unit
 * @returns Array of items that can be used
 */
export function getUsableItems(
  inventory: InventoryData,
  target: PlayerUnit
): readonly Item[]
```

**Implementation:**

```typescript
/**
 * Get items that can be used on a target
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
```

**Acceptance Criteria:**
- ✅ All 3 functions implemented
- ✅ Use Result type for error handling
- ✅ Pure functions (no mutations)
- ✅ TypeScript strict mode compliant
- ✅ Proper validation (can't use potion at full HP, etc.)
- ✅ Phoenix Down only works on KO'd units
- ✅ Items consumed after use (removed from inventory)

---

### **Task 1.2: Create Tests for ItemSystem**

**File to Create:** `tests/systems/ItemSystem.test.ts`

**Required Coverage (25+ tests):**

```typescript
import { describe, test, expect } from 'vitest';
import {
  useConsumableItem,
  canUseItem,
  getUsableItems
} from '../../src/systems/ItemSystem.js';
import type { Item, PlayerUnit, InventoryData } from '../../src/types/game.js';

describe('ItemSystem', () => {
  // Helpers
  const createUnit = (overrides?: Partial<PlayerUnit>): PlayerUnit => ({
    id: 'unit-1',
    name: 'Test Warrior',
    role: 'Tank',
    tags: [],
    hp: 50,
    maxHp: 100,
    atk: 20,
    def: 15,
    speed: 10,
    level: 1,
    experience: 0,
    rank: 'C',
    ...overrides
  });

  const createItem = (id: string, hpRestore: number): Item => ({
    id,
    name: id === 'health_potion' ? 'Health Potion' : 'Mega Potion',
    type: 'consumable',
    rarity: 'common',
    description: `Restores ${hpRestore} HP`,
    stats: { hpRestore }
  });

  const createInventory = (items: Item[]): InventoryData => ({
    items,
    equippedItems: new Map(),
    unequippedItems: [],
    maxItemSlots: 50,
    maxEquipmentSlots: 50
  });

  describe('useConsumableItem', () => {
    test('uses health potion and restores HP', () => {
      const unit = createUnit({ hp: 50, maxHp: 100 });
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(100); // 50 + 50
        expect(result.value.inventory.items.length).toBe(0); // Item consumed
      }
    });

    test('caps HP at maxHp when healing', () => {
      const unit = createUnit({ hp: 80, maxHp: 100 });
      const potion = createItem('health_potion', 50); // Would heal to 130
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(100); // Capped at maxHp
      }
    });

    test('fails if target at full HP', () => {
      const unit = createUnit({ hp: 100, maxHp: 100 });
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('full HP');
      }
    });

    test('fails if item not in inventory', () => {
      const unit = createUnit({ hp: 50 });
      const potion = createItem('health_potion', 50);
      const emptyInventory = createInventory([]);

      const result = useConsumableItem(potion, unit, emptyInventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    test('fails if item is not consumable', () => {
      const unit = createUnit({ hp: 50 });
      const weapon: Item = {
        id: 'sword',
        name: 'Iron Sword',
        type: 'weapon',
        rarity: 'common',
        description: 'A sword',
        stats: { atkBonus: 10 }
      };
      const inventory = createInventory([weapon]);

      const result = useConsumableItem(weapon, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not consumable');
      }
    });

    test('phoenix down revives KO\'d unit', () => {
      const unit = createUnit({ hp: 0, maxHp: 100 }); // KO'd
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives fallen ally',
        stats: { hpRestore: 50 }
      };
      const inventory = createInventory([phoenixDown]);

      const result = useConsumableItem(phoenixDown, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit.hp).toBe(50); // Revived with 50 HP
      }
    });

    test('phoenix down fails on alive unit', () => {
      const unit = createUnit({ hp: 50, maxHp: 100 });
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives fallen ally',
        stats: { hpRestore: 50 }
      };
      const inventory = createInventory([phoenixDown]);

      const result = useConsumableItem(phoenixDown, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('KO\'d units');
      }
    });

    test('regular potion fails on KO\'d unit', () => {
      const unit = createUnit({ hp: 0, maxHp: 100 });
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('KO\'d');
      }
    });

    test('consumes item after use', () => {
      const unit = createUnit({ hp: 50 });
      const potion1 = createItem('health_potion', 50);
      const potion2 = { ...potion1, id: 'health_potion_2' };
      const inventory = createInventory([potion1, potion2]);

      const result = useConsumableItem(potion1, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.inventory.items.length).toBe(1);
        expect(result.value.inventory.items[0].id).toBe('health_potion_2');
      }
    });

    test('preserves other inventory properties', () => {
      const unit = createUnit({ hp: 50 });
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);
      inventory.maxItemSlots = 99;

      const result = useConsumableItem(potion, unit, inventory);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.inventory.maxItemSlots).toBe(99);
      }
    });
  });

  describe('canUseItem', () => {
    test('returns true for valid healing item', () => {
      const unit = createUnit({ hp: 50, maxHp: 100 });
      const potion = createItem('health_potion', 50);

      const result = canUseItem(potion, unit);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(true);
      }
    });

    test('returns error if target at full HP', () => {
      const unit = createUnit({ hp: 100, maxHp: 100 });
      const potion = createItem('health_potion', 50);

      const result = canUseItem(potion, unit);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('full HP');
      }
    });

    test('returns error for non-consumable', () => {
      const unit = createUnit({ hp: 50 });
      const weapon: Item = {
        id: 'sword',
        name: 'Sword',
        type: 'weapon',
        rarity: 'common',
        description: 'A weapon',
        stats: { atkBonus: 10 }
      };

      const result = canUseItem(weapon, unit);

      expect(result.ok).toBe(false);
    });

    test('phoenix down valid on KO\'d unit', () => {
      const unit = createUnit({ hp: 0, maxHp: 100 });
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives',
        stats: { hpRestore: 50 }
      };

      const result = canUseItem(phoenixDown, unit);

      expect(result.ok).toBe(true);
    });

    test('phoenix down invalid on alive unit', () => {
      const unit = createUnit({ hp: 50 });
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives',
        stats: { hpRestore: 50 }
      };

      const result = canUseItem(phoenixDown, unit);

      expect(result.ok).toBe(false);
    });

    test('antidote fails without status effects', () => {
      const unit = createUnit({ hp: 50 });
      const antidote: Item = {
        id: 'antidote',
        name: 'Antidote',
        type: 'consumable',
        rarity: 'common',
        description: 'Cures poison',
        stats: {}
      };

      const result = canUseItem(antidote, unit);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('status');
      }
    });
  });

  describe('getUsableItems', () => {
    test('filters items that can be used', () => {
      const unit = createUnit({ hp: 50, maxHp: 100 });
      const potion1 = createItem('health_potion', 50);
      const potion2 = { ...potion1, id: 'mega_potion' };
      const inventory = createInventory([potion1, potion2]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(2);
    });

    test('excludes items that cannot be used', () => {
      const unit = createUnit({ hp: 100, maxHp: 100 }); // Full HP
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([potion]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(0); // Can't use potion at full HP
    });

    test('includes phoenix down only for KO\'d units', () => {
      const unit = createUnit({ hp: 0, maxHp: 100 }); // KO'd
      const potion = createItem('health_potion', 50);
      const phoenixDown: Item = {
        id: 'phoenix_down',
        name: 'Phoenix Down',
        type: 'consumable',
        rarity: 'rare',
        description: 'Revives',
        stats: { hpRestore: 50 }
      };
      const inventory = createInventory([potion, phoenixDown]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(1);
      expect(usable[0].id).toBe('phoenix_down');
    });

    test('returns empty array for empty inventory', () => {
      const unit = createUnit({ hp: 50 });
      const inventory = createInventory([]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(0);
    });

    test('excludes non-consumables', () => {
      const unit = createUnit({ hp: 50 });
      const weapon: Item = {
        id: 'sword',
        name: 'Sword',
        type: 'weapon',
        rarity: 'common',
        description: 'A weapon',
        stats: { atkBonus: 10 }
      };
      const potion = createItem('health_potion', 50);
      const inventory = createInventory([weapon, potion]);

      const usable = getUsableItems(inventory, unit);

      expect(usable.length).toBe(1);
      expect(usable[0].type).toBe('consumable');
    });
  });

  describe('Edge Cases', () => {
    test('handles multiple uses in sequence', () => {
      const unit = createUnit({ hp: 10, maxHp: 100 });
      const potion1 = createItem('health_potion', 50);
      const potion2 = { ...potion1, id: 'potion2' };
      let inventory = createInventory([potion1, potion2]);

      // First use
      const result1 = useConsumableItem(potion1, unit, inventory);
      expect(result1.ok).toBe(true);
      
      if (result1.ok) {
        const updatedUnit = result1.value.unit;
        inventory = result1.value.inventory;
        
        expect(updatedUnit.hp).toBe(60);
        expect(inventory.items.length).toBe(1);

        // Second use
        const result2 = useConsumableItem(potion2, updatedUnit, inventory);
        expect(result2.ok).toBe(true);
        
        if (result2.ok) {
          expect(result2.value.unit.hp).toBe(100); // Capped
          expect(result2.value.inventory.items.length).toBe(0);
        }
      }
    });

    test('handles item with no hpRestore stat', () => {
      const unit = createUnit({ hp: 50 });
      const brokenItem: Item = {
        id: 'broken',
        name: 'Broken Item',
        type: 'consumable',
        rarity: 'common',
        description: 'Does nothing',
        stats: {} // No hpRestore
      };
      const inventory = createInventory([brokenItem]);

      const result = useConsumableItem(brokenItem, unit, inventory);

      // Should fail validation (no effect to apply)
      expect(result.ok).toBe(false);
    });
  });
});
```

**Acceptance Criteria:**
- ✅ 25+ tests written
- ✅ All tests passing
- ✅ Cover happy paths (healing, revival)
- ✅ Cover error cases (full HP, wrong item type, KO'd units)
- ✅ Cover edge cases (multiple uses, capping HP)
- ✅ Tests use Result pattern properly

---

## 🎯 Phase 2: Battle Screen Integration (2-3 hours)

### **Task 2.1: Add Items Action to BattleScreen**

**File to Modify:** `src/screens/BattleScreen.tsx`

**Current State:** Battle has manual action menu: Attack / Defend / Auto

**New State:** Add "Items" button that opens item selection modal

**Required Changes:**

#### **1. Add state for item modal:**

```typescript
const [showItemModal, setShowItemModal] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);
const [itemTargetId, setItemTargetId] = useState<string | null>(null);
```

#### **2. Update action menu to include Items button:**

Find the action buttons section (Attack/Defend/Auto) and add:

```tsx
{/* Items Button */}
<button
  onClick={() => {
    if (inventory.items.length === 0) {
      // Show "No items" message
      return;
    }
    setShowItemModal(true);
  }}
  disabled={!isPlayerTurn || inventory.items.length === 0}
  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold rounded-lg transition-colors shadow-lg"
>
  🧪 Items ({inventory.items.length})
</button>
```

#### **3. Create Item Selection Modal component:**

```tsx
{/* Item Selection Modal */}
{showItemModal && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-white">Use Item</h3>
        <button
          onClick={() => {
            setShowItemModal(false);
            setSelectedItem(null);
          }}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Item List */}
      <div className="space-y-2">
        {inventory.items
          .filter(item => item.type === 'consumable')
          .map((item, index) => {
            const usableOnActive = canUseItem(item, activeUnit);
            
            return (
              <button
                key={`${item.id}-${index}`}
                onClick={() => {
                  if (usableOnActive.ok) {
                    // Can use on active unit directly
                    handleUseItem(item, activeUnit.id);
                  } else {
                    // Need to select target
                    setSelectedItem(item);
                  }
                }}
                disabled={!usableOnActive.ok && playerTeam.every(u => !canUseItem(item, u).ok)}
                className="w-full p-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded-lg text-left transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                    {!usableOnActive.ok && (
                      <div className="text-xs text-red-400 mt-1">
                        {usableOnActive.error}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-300">
                    {item.stats.hpRestore && `+${item.stats.hpRestore} HP`}
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {inventory.items.filter(i => i.type === 'consumable').length === 0 && (
        <p className="text-gray-400 text-center py-8">No consumable items</p>
      )}
    </div>
  </div>
)}

{/* Target Selection Modal (if item needs target) */}
{selectedItem && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
      <h3 className="text-xl font-bold text-white mb-4">
        Use {selectedItem.name} on:
      </h3>
      
      <div className="space-y-2 mb-4">
        {playerTeam.map(unit => {
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
        onClick={() => setSelectedItem(null)}
        className="w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
      >
        Cancel
      </button>
    </div>
  </div>
)}
```

#### **4. Add handleUseItem function:**

```typescript
const handleUseItem = (item: Item, targetId: string) => {
  const target = playerTeam.find(u => u.id === targetId);
  if (!target) {
    console.error('Target not found');
    return;
  }

  const result = useConsumableItem(item, target, inventory);
  
  if (!result.ok) {
    console.error('Failed to use item:', result.error);
    return;
  }

  // Update inventory
  setInventory(result.value.inventory);

  // Update team with healed unit
  const updatedTeam = playerTeam.map(u =>
    u.id === targetId ? result.value.unit : u
  );
  setPlayerTeam(updatedTeam);

  // Log action
  console.log(`Used ${item.name} on ${target.name}, restored HP`);

  // Close modals
  setShowItemModal(false);
  setSelectedItem(null);

  // Optional: Show feedback animation
  // TODO: Add visual feedback ("+50 HP" floating text)
};
```

#### **5. Import ItemSystem functions:**

Add to imports:
```typescript
import { useConsumableItem, canUseItem } from '../systems/ItemSystem.js';
import type { Item } from '../types/game.js';
```

**Acceptance Criteria:**
- ✅ "Items" button visible in battle action menu
- ✅ Shows item count badge
- ✅ Disabled if no items in inventory
- ✅ Opens modal showing all consumable items
- ✅ Can select item and target
- ✅ Uses item and updates inventory + team
- ✅ Shows validation messages (can't use at full HP, etc.)
- ✅ Closes modals after successful use
- ✅ Keyboard accessible (Tab, Enter, Escape)

---

### **Task 2.2: Add Visual Feedback for Item Use**

**File to Create:** `src/components/battle/FloatingText.tsx`

**Purpose:** Show "+50 HP" style floating text when items are used.

**Component:**

```tsx
import { useEffect, useState } from 'react';

export interface FloatingTextProps {
  readonly text: string;
  readonly x: number; // % position
  readonly y: number; // % position
  readonly color?: string;
  readonly duration?: number; // ms
  readonly onComplete?: () => void;
}

export function FloatingText({
  text,
  x,
  y,
  color = '#4ade80', // green
  duration = 1500,
  onComplete
}: FloatingTextProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div
      className="absolute text-2xl font-bold pointer-events-none animate-float-up"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        color,
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        animation: 'floatUp 1.5s ease-out forwards'
      }}
    >
      {text}
    </div>
  );
}
```

**Add CSS animation to global styles or Tailwind config:**

```css
@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-50px);
  }
}
```

**Update BattleScreen to use FloatingText:**

```typescript
const [floatingTexts, setFloatingTexts] = useState<Array<{
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}>>([]);

// In handleUseItem, after successful use:
const hpRestored = result.value.unit.hp - target.hp;
setFloatingTexts(prev => [...prev, {
  id: `${Date.now()}-${Math.random()}`,
  text: `+${hpRestored} HP`,
  x: 30, // Position near player units
  y: 50,
  color: '#4ade80'
}]);

// Render floating texts:
{floatingTexts.map(ft => (
  <FloatingText
    key={ft.id}
    text={ft.text}
    x={ft.x}
    y={ft.y}
    color={ft.color}
    onComplete={() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== ft.id));
    }}
  />
))}
```

**Acceptance Criteria:**
- ✅ Floating text appears when item used
- ✅ Shows actual HP restored (not item base value)
- ✅ Animates upward and fades out
- ✅ Green color for healing
- ✅ Auto-removes after animation
- ✅ Positioned near target unit

---

## 🎯 Phase 3: Inventory Management Screen (90 min)

### **Task 3.1: Create InventoryScreen Component**

**File to Create:** `src/screens/InventoryScreen.tsx`

**Purpose:** View all items outside of battle, see descriptions, use healing items between battles.

**Component:**

```tsx
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
                    
                    {item.stats.hpRestore && (
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
                  
                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                  
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
      </div>

      {/* Use Item Modal */}
      {showUseModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Use {selectedItem.name}
            </h3>
            
            <div className="space-y-2 mb-4">
              {team.map(unit => {
                const canUse = canUseItem(selectedItem, unit);
                
                return (
                  <button
                    key={unit.id}
                    onClick={() => handleUseItem(selectedItem, unit.id)}
                    disabled={!canUse.ok}
                    className="w-full p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 disabled:opacity-50 rounded-lg text-left transition-colors"
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
              className="w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Shows all consumable items with descriptions
- ✅ Shows all unequipped equipment (read-only)
- ✅ Can use consumables on team members
- ✅ Validates usage (same as battle)
- ✅ Updates inventory and team state
- ✅ Close button returns to previous screen
- ✅ Keyboard accessible
- ✅ Responsive grid layout

---

### **Task 3.2: Wire InventoryScreen into Game Flow**

**Files to Modify:**
- `src/App.tsx` (add route)
- `src/core/GameController.ts` (add navigation methods)

**Changes to App.tsx:**

```typescript
import { InventoryScreen } from './screens/InventoryScreen.js';

// Add case for inventory screen:
{currentScreen === 'inventory' && (
  <InventoryScreen
    team={gameState.team}
    inventory={gameState.inventory}
    onUpdateInventory={(inv) => {
      setGameState({ ...gameState, inventory: inv });
    }}
    onUpdateTeam={(team) => {
      setGameState({ ...gameState, team });
    }}
    onClose={() => {
      controller.closeInventory(); // Returns to previous screen
    }}
  />
)}
```

**Changes to GameController.ts:**

```typescript
/**
 * Open inventory screen from menu or between battles
 */
async openInventory(): Promise<void> {
  const result = this.stateMachine.transitionTo('inventory');
  if (!result.ok) {
    this.logger.error('controller:transition_failed', {
      to: 'inventory',
      error: result.error
    });
  }
}

/**
 * Close inventory and return to previous screen
 */
async closeInventory(): Promise<void> {
  // Return to menu (simplest implementation)
  const result = this.stateMachine.transitionTo('menu');
  if (!result.ok) {
    this.logger.error('controller:transition_failed', {
      from: 'inventory',
      to: 'menu',
      error: result.error
    });
  }
}
```

**Add "Inventory" button to main menu:**

In `MenuScreen.tsx` (or wherever menu lives), add:

```tsx
<button
  onClick={onOpenInventory}
  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl rounded-lg transition-colors shadow-lg"
>
  📦 Inventory
</button>
```

**Acceptance Criteria:**
- ✅ Can access inventory from main menu
- ✅ InventoryScreen renders correctly
- ✅ Can use items and see updates
- ✅ Close button returns to menu
- ✅ State transitions validate correctly

---

## 🧪 Phase 4: Integration Testing (30-45 min)

### **Task 4.1: Integration Tests**

**File to Create:** `tests/integration/consumables.flow.test.ts`

**Purpose:** Test full consumable flow (gain items → use in battle → use in inventory).

**Example Tests:**

```typescript
import { describe, test, expect, beforeEach } from 'vitest';
import { GameController } from '../../src/core/GameController.js';
import { useConsumableItem } from '../../src/systems/ItemSystem.js';
import type { Item, PlayerUnit, InventoryData } from '../../src/types/game.js';

describe('Consumables Integration Flow', () => {
  let controller: GameController;

  beforeEach(() => {
    controller = new GameController();
    controller.startNewGame({ difficulty: 'Normal', seed: 12345 });
  });

  test('complete flow: gain items → use in battle → inventory updates', async () => {
    // 1. Add consumables to inventory
    const healthPotion: Item = {
      id: 'health_potion',
      name: 'Health Potion',
      type: 'consumable',
      rarity: 'common',
      description: 'Restores 50 HP',
      stats: { hpRestore: 50 }
    };

    controller.addItemToInventory(healthPotion);
    
    const inventory = controller.getInventory();
    expect(inventory.items).toContainEqual(healthPotion);

    // 2. Damage a unit
    const team = controller.getTeam();
    const damagedUnit: PlayerUnit = {
      ...team[0],
      hp: 30 // Damaged
    };
    controller.updateUnit(damagedUnit);

    // 3. Use item
    const result = useConsumableItem(healthPotion, damagedUnit, inventory);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.unit.hp).toBe(80); // 30 + 50
      expect(result.value.inventory.items.length).toBe(0); // Consumed
    }
  });

  test('cannot use potion on unit at full HP', () => {
    const healthPotion: Item = {
      id: 'health_potion',
      name: 'Health Potion',
      type: 'consumable',
      rarity: 'common',
      description: 'Restores 50 HP',
      stats: { hpRestore: 50 }
    };

    const team = controller.getTeam();
    const fullHpUnit = team[0]; // Assume at full HP

    const inventory = controller.getInventory();
    inventory.items = [healthPotion];

    const result = useConsumableItem(healthPotion, fullHpUnit, inventory);
    
    expect(result.ok).toBe(false);
  });

  test('phoenix down revives KO\'d unit', () => {
    const phoenixDown: Item = {
      id: 'phoenix_down',
      name: 'Phoenix Down',
      type: 'consumable',
      rarity: 'rare',
      description: 'Revives fallen ally',
      stats: { hpRestore: 50 }
    };

    const team = controller.getTeam();
    const koUnit: PlayerUnit = {
      ...team[0],
      hp: 0 // KO'd
    };

    const inventory = controller.getInventory();
    inventory.items = [phoenixDown];

    const result = useConsumableItem(phoenixDown, koUnit, inventory);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.unit.hp).toBe(50); // Revived
    }
  });
});
```

**Acceptance Criteria:**
- ✅ Integration tests pass
- ✅ Test full flow (gain → use → update)
- ✅ Test validation in real scenarios
- ✅ Test edge cases (KO'd units, full HP)

---

### **Task 4.2: Update Existing Tests**

**Files to Check:**
- `tests/core/GameController.inventory.test.ts` (already has consumable tests)
- Any battle tests that might be affected

**Action:** Ensure existing tests still pass with new ItemSystem.

**Run:**
```bash
npm test
npm run type-check
npm run circular
```

**Acceptance Criteria:**
- ✅ All existing tests still pass
- ✅ No new TypeScript errors
- ✅ No circular dependencies
- ✅ Test count increases by ~30+ (ItemSystem + integration tests)

---

## ✅ Deliverables Checklist

### **Phase 1: Core System (90 min)**
- [ ] `ItemSystem.ts` created with 3 functions (use, canUse, getUsable)
- [ ] All functions use Result type
- [ ] Pure functions (no mutations)
- [ ] Proper validation (can't use at full HP, Phoenix Down only on KO'd, etc.)
- [ ] `ItemSystem.test.ts` created with 25+ tests
- [ ] All ItemSystem tests passing

### **Phase 2: Battle Integration (2-3 hours)**
- [ ] "Items" button added to BattleScreen action menu
- [ ] Item selection modal implemented
- [ ] Target selection modal implemented
- [ ] `handleUseItem` function working
- [ ] Inventory updates after item use
- [ ] Team HP updates after healing
- [ ] `FloatingText.tsx` component created
- [ ] "+X HP" text appears when items used
- [ ] Keyboard accessible (Tab, Enter, Escape)

### **Phase 3: Inventory Screen (90 min)**
- [ ] `InventoryScreen.tsx` created
- [ ] Shows consumables and equipment
- [ ] Can use consumables on team members
- [ ] Validation works (same as battle)
- [ ] Close button works
- [ ] Wired into App.tsx
- [ ] GameController has `openInventory()` and `closeInventory()` methods
- [ ] Accessible from main menu

### **Phase 4: Testing (30-45 min)**
- [ ] Integration tests created (`consumables.flow.test.ts`)
- [ ] Tests cover full flow (gain → use → update)
- [ ] Existing tests still pass
- [ ] No TypeScript errors
- [ ] No circular dependencies

### **Overall Verification**
- [ ] `npm test` - All tests passing (905+ → 935+)
- [ ] `npm run type-check` - 0 errors
- [ ] `npm run circular` - 0 circular dependencies
- [ ] Can use potions in battle (full flow works)
- [ ] Can use potions in inventory screen
- [ ] Items consumed after use
- [ ] HP restores correctly (capped at maxHp)
- [ ] Phoenix Down revives KO'd units
- [ ] Validation messages appear (can't use at full HP, etc.)
- [ ] Visual feedback (floating "+50 HP" text)

---

## 📊 Expected Impact

**Before:**
- Items drop from battles but can't be used
- No item usage system
- No inventory management
- 905 tests passing

**After:**
- ✅ Full consumable item system
- ✅ Use healing potions in battle
- ✅ Use items between battles (inventory screen)
- ✅ Phoenix Down revives KO'd units
- ✅ Visual feedback (floating HP text)
- ✅ Proper validation (can't waste items)
- ✅ ~935+ tests passing (all green)
- ✅ Expected RPG feature complete

---

## 🎯 Design Philosophy: Simple But Complete

**What to Include:**
- ✅ Use consumables in battle (Items action)
- ✅ Use consumables in inventory screen
- ✅ Healing validation (can't use at full HP)
- ✅ Phoenix Down revival
- ✅ Visual feedback (floating text)
- ✅ Proper item consumption (remove from inventory)

**What to Skip (For Now):**
- ❌ Status effects (poison, sleep, etc.) - Antidote just fails for now
- ❌ Battle items (damage items, buff items)
- ❌ Item shops/merchants
- ❌ Item crafting/combining
- ❌ Item sorting/filtering
- ❌ Drag-and-drop inventory management
- ❌ Item tooltips with detailed stats

**Keep it focused on core healing mechanic - the #1 expected consumable feature!**

---

## 🚀 Getting Started

1. **Start with Phase 1** (Core System) - Build ItemSystem.ts + tests
   - Pure functions, Result types
   - Comprehensive tests (25+)

2. **Move to Phase 2** (Battle Integration) - Add Items button + modals
   - Item selection
   - Target selection
   - Visual feedback

3. **Phase 3** (Inventory Screen) - Build management UI
   - View all items
   - Use items outside battle
   - Wire into game flow

4. **Finish with Phase 4** (Testing) - Integration tests + verification
   - Full flow tests
   - Regression testing
   - Final verification

**Run validation after each phase:**
```bash
npm test
npm run type-check
```

**Test the full flow manually after Phase 2!**

---

## 🔍 Key Technical Notes

1. **Phoenix Down Special Case:** Only works on hp === 0 units, fails on alive units
2. **HP Capping:** Always cap restored HP at maxHp (don't overheal)
3. **Item Consumption:** Remove item from inventory immediately after use
4. **Validation First:** Check `canUseItem()` before showing "Use" button
5. **Target Selection:** Some items (potions) can be used on any valid target, not just active unit
6. **Antidote Placeholder:** Will always fail validation for now (no poison system yet)
7. **Floating Text:** Position relative to target unit for better feedback
8. **Modal Stacking:** Item modal → Target modal (two-step process)

---

## 🎮 UX Flow Examples

### **Battle Usage:**
1. Player's turn
2. Click "Items" button
3. Modal opens showing consumables
4. Click "Health Potion"
5. If active unit at low HP: Use directly on active unit
6. If active unit at full HP: Show target selection modal
7. Select target unit (must be damaged)
8. "+50 HP" floats up from target
9. Modals close
10. Inventory updated (item removed)

### **Inventory Usage:**
1. From main menu, click "Inventory"
2. InventoryScreen opens
3. See all consumables and equipment
4. Click "Use" on Health Potion
5. Target selection modal opens
6. Select wounded unit
7. HP restored, item consumed
8. Modal closes, screen updates

---

**This will give you a complete, polished consumable items system that meets player expectations!** 🍶✨

**Ready for implementation!** 🚀
