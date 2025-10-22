# ⚔️ Task: Implement Basic Equipment System

## 📋 Overview

**Goal:** Add a basic equipment system that allows players to equip items gained from battles in a menu screen after the rewards screen.

**Design:** Keep it simple and bareboned - just enough to be functional:
- Items can be equipped to units
- Each unit has equipment slots (weapon, armor, accessory)
- Equipment provides stat bonuses
- New screen between RewardsScreen and RecruitScreen for equipping

**Time Estimate:**
- **AI Time:** 2-3 hours
- **Human Time Equivalent:** 8-12 hours

**Current Context:**
- Type scaffolding already exists in `game.ts` (Equipment, InventoryData interfaces)
- SaveEnvelope has optional field `inventoryData` ready (backward-compatible)
- 595 tests passing, 10/10 health score
- RewardSystem already generates items

---

## 🎯 Phase 1: Core Equipment System (45-60 min)

### **Task 1.1: Review and Adjust Equipment Types**

**File:** `src/types/game.ts` (lines 497-526)

**Current Equipment Types (VERIFIED - these exist):**
```typescript
export interface Equipment {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly slot: 'weapon' | 'armor' | 'accessory';
  readonly stats: {
    readonly hp?: number;
    readonly atk?: number;
    readonly def?: number;
    readonly speed?: number;
  };
  readonly rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  readonly levelRequirement?: number;
  readonly spriteUrl?: string;
}

export interface InventoryData {
  readonly items: readonly Item[];
  readonly equipment: readonly Equipment[];
  readonly maxItemSlots: number;
  readonly maxEquipmentSlots: number;
}
```

**⚠️ ADJUSTMENT NEEDED:** InventoryData structure needs updating for equipment tracking:

**Replace InventoryData with:**
```typescript
/**
 * Inventory System (Planned - Not Yet Implemented)
 * 
 * Tracks equipped items per unit and unequipped equipment pool.
 * Structure: Map uses "unitId-slot" as key (e.g., "unit1-weapon")
 */
export interface InventoryData {
  readonly items: readonly Item[]; // Consumables (existing)
  readonly equippedItems: ReadonlyMap<string, Equipment>; // "unitId-slot" -> Equipment
  readonly unequippedItems: readonly Equipment[]; // Unequipped equipment pool
  readonly maxItemSlots: number;
  readonly maxEquipmentSlots: number;
}
```

**Actions:**
1. Update the `InventoryData` interface (lines ~522-527)
2. Keep Equipment interface as-is (already good!)
3. Remove TODO comments from both interfaces (marking them as implemented)

**Acceptance Criteria:**
- ✅ InventoryData uses Map for equipped items (key: "unitId-slot")
- ✅ Equipment type has all needed fields (already present)
- ✅ Types compile with TypeScript strict mode

---

### **Task 1.2: Create EquipmentSystem**

**File to Create:** `src/systems/EquipmentSystem.ts`

**Purpose:** Handle equipment logic (equip, unequip, stat calculations).

**Required Functions:**

1. **equipItem** - Equip an item to a unit
   ```typescript
   export function equipItem(
     inventory: InventoryData,
     unitId: string,
     equipment: Equipment
   ): Result<InventoryData, string>
   ```
   - Check item exists in unequippedItems
   - Remove item from unequippedItems
   - If unit already has equipment in that slot, unequip it first
   - Add to equippedItems map with key `${unitId}-${equipment.slot}`
   - Return updated inventory

2. **unequipItem** - Remove equipment from a unit
   ```typescript
   export function unequipItem(
     inventory: InventoryData,
     unitId: string,
     slotType: 'weapon' | 'armor' | 'accessory'
   ): Result<InventoryData, string>
   ```
   - Check if item equipped in slot
   - Remove from equippedItems map (key: `${unitId}-${slotType}`)
   - Add back to unequippedItems
   - Return updated inventory

3. **getEquippedItem** - Get equipment in a specific slot for a unit
   ```typescript
   export function getEquippedItem(
     inventory: InventoryData,
     unitId: string,
     slot: 'weapon' | 'armor' | 'accessory'
   ): Equipment | undefined
   ```
   - Return item from map with key `${unitId}-${slot}`

4. **getUnitStats** - Calculate unit stats with equipment bonuses
   ```typescript
   export function getUnitStats(
     unit: PlayerUnit,
     inventory: InventoryData
   ): { hp: number; atk: number; def: number; speed: number }
   ```
   - Start with base stats from unit
   - Get all equipped items for this unit (weapon, armor, accessory)
   - Add stat bonuses from each equipped item
   - Return combined stats object

5. **getUnequippedItems** - Get all unequipped items
   ```typescript
   export function getUnequippedItems(
     inventory: InventoryData
   ): readonly Equipment[]
   ```
   - Simply return `inventory.unequippedItems`

**Implementation Pattern:**
```typescript
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
```

**Acceptance Criteria:**
- ✅ All 5 functions implemented
- ✅ Use Result type for error handling
- ✅ Pure functions (no mutations - use spread/new Map/array copies)
- ✅ TypeScript strict mode compliant
- ✅ Map keys use format: `"unitId-slot"`

---

### **Task 1.3: Update RewardSystem to Generate Equipment**

**File:** `src/systems/RewardSystem.ts`

**Current:** RewardSystem generates items (consumables) in `BattleReward`

**⚠️ IMPORTANT:** Check current `BattleReward` interface first!

**Expected in game.ts:**
```typescript
export interface BattleReward {
  readonly items: readonly Item[];
  readonly defeatedEnemies: readonly EnemyUnit[];
  readonly experience: number;
  readonly equipment?: readonly Equipment[]; // ADD THIS
}
```

**Actions:**

1. **Add equipment field to BattleReward interface** (in `game.ts`, around line 170):
   ```typescript
   export interface BattleReward {
     readonly items: readonly Item[];
     readonly defeatedEnemies: readonly EnemyUnit[];
     readonly experience: number;
     readonly equipment: readonly Equipment[]; // NEW - equipment drops
   }
   ```

2. **Add equipment generation helper in RewardSystem.ts:**
   ```typescript
   /**
    * Generate equipment drops from battle
    * Drop rate and rarity affected by difficulty
    */
   private generateEquipment(
     difficulty: Difficulty,
     rng: IRng,
     enemyCount: number
   ): Equipment[] {
     const equipment: Equipment[] = [];
     
     // Drop chance per enemy
     const dropChance = difficulty === 'Hard' ? 0.4
                      : difficulty === 'Normal' ? 0.3
                      : 0.2;
     
     for (let i = 0; i < enemyCount; i++) {
       if (rng.float() > dropChance) continue;
       
       // Random slot
       const slots = ['weapon', 'armor', 'accessory'] as const;
       const slot = slots[rng.int(0, 2)];
       
       // Random rarity (simplified distribution)
       const rarityRoll = rng.float();
       const rarity = rarityRoll > 0.95 ? 'epic'
                    : rarityRoll > 0.80 ? 'rare'
                    : rarityRoll > 0.60 ? 'uncommon'
                    : 'common';
       
       // Stat bonuses based on rarity
       const baseBonus = rarity === 'epic' ? 20
                       : rarity === 'rare' ? 15
                       : rarity === 'uncommon' ? 10
                       : 5;
       
       // Stats based on slot type
       const stats = slot === 'weapon' ? { atk: baseBonus }
                   : slot === 'armor' ? { def: baseBonus }
                   : { speed: baseBonus }; // accessory
       
       equipment.push({
         id: `equip-${Date.now()}-${rng.int(1000, 9999)}`,
         name: `${rarity} ${slot}`.replace(/^\w/, c => c.toUpperCase()),
         description: `A ${rarity} ${slot} found in battle`,
         slot,
         stats,
         rarity,
       });
     }
     
     return equipment;
   }
   ```

3. **Update `generateRewards` method to include equipment:**
   ```typescript
   generateRewards(
     opponentSpec: OpponentSpec,
     battleResult: BattleResult,
     rng: IRng
   ): BattleReward {
     // ... existing XP and item logic ...
     
     // Generate equipment drops
     const equipment = this.generateEquipment(
       opponentSpec.difficulty,
       rng,
       opponentSpec.units.length
     );
     
     this.logger.info('rewards:generated', {
       opponentId: opponentSpec.id,
       difficulty: opponentSpec.difficulty,
       experience,
       itemCount: items.length,
       equipmentCount: equipment.length, // NEW
       defeatedCount: defeatedEnemies.length,
     });
     
     return {
       items,
       defeatedEnemies,
       experience,
       equipment, // NEW
     };
   }
   ```

**Acceptance Criteria:**
- ✅ Equipment can be generated as rewards
- ✅ Generation is deterministic (uses RNG from system)
- ✅ BattleReward includes equipment array
- ✅ Drop rates scale with difficulty
- ✅ Logger tracks equipment drop count

---

## 🎨 Phase 2: Equipment Screen UI (60-75 min)

### **Task 2.1: Create EquipmentScreen Component**

**File to Create:** `src/screens/EquipmentScreen.tsx`

**Purpose:** Simple screen to equip items after rewards.

**Design (Barebones):**
```
┌─────────────────────────────────────┐
│         Equipment Management        │
├─────────────────────────────────────┤
│                                     │
│  Your Team:                         │
│  ┌─────────────────────────────┐   │
│  │ [Unit 1] HP: 100/100        │   │
│  │ ATK: 15 (+5) DEF: 10 SPD: 8 │   │
│  │ Weapon: Iron Sword          │   │
│  │ Armor: None                 │   │
│  │ Accessory: None             │   │
│  └─────────────────────────────┘   │
│  ... (repeat for all units)        │
│                                     │
│  Unequipped Items: (3)              │
│  [Rare Weapon] ATK +10             │
│  [Common Armor] DEF +5             │
│  [Common Accessory] SPD +5         │
│                                     │
│  [Continue →]                       │
└─────────────────────────────────────┘
```

**Component Structure:**
```typescript
import React, { useState } from 'react';
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
}: EquipmentScreenProps): React.ReactElement {
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
```

**UX Flow:**
1. Show all units with current equipment and stats
2. Show all unequipped items in a grid
3. Click unequipped item → modal opens: "Equip to which unit?"
4. Select unit → item equipped, modal closes, UI updates
5. Click "Unequip" button on equipped item → item returns to unequipped pool
6. Click "Continue" → advance to RecruitScreen

**Acceptance Criteria:**
- ✅ Displays all units with stats and equipped items
- ✅ Displays all unequipped items in grid
- ✅ Can equip items to units (modal flow)
- ✅ Can unequip items from units (button)
- ✅ Continue button advances to next screen
- ✅ Keyboard accessible (Tab, Enter, Escape for modal)
- ✅ Auto-replaces equipment if slot already filled

---

### **Task 2.2: Update Game Flow to Include Equipment Screen**

**Files:** 
- `src/core/GameStateMachine.ts`
- `src/core/GameController.ts`

**Current Flow:**
```
Battle → Rewards → Recruit → OpponentSelect
```

**New Flow:**
```
Battle → Rewards → Equipment → Recruit → OpponentSelect
```

**Actions:**

1. **Update allowed transitions in game.ts** (around line 350):
   ```typescript
   export const ALLOWED_TRANSITIONS = {
     menu: ['starter_select', 'settings'],
     starter_select: ['opponent_select'],
     opponent_select: ['battle', 'menu'],
     team_prep: ['battle'],
     battle: ['rewards', 'defeat', 'menu'],
     rewards: ['equipment'], // CHANGED: was 'recruit'
     equipment: ['recruit'], // NEW: added this transition
     recruit: ['opponent_select'],
     defeat: ['menu'],
     
     // Future screens (not yet wired)
     inventory: ['menu', 'team_prep'],
     level_up: ['rewards', 'recruit'],
   } as const;
   ```

2. **Add equipment to GameScreen union** (already exists, just verify around line 340):
   ```typescript
   export type GameScreen =
     | 'menu'
     | 'starter_select'
     | 'opponent_select'
     | 'team_prep'
     | 'battle'
     | 'rewards'
     | 'equipment'    // Should already be here
     | 'recruit'
     | 'defeat'
     | 'settings'
     | 'inventory'    // Future
     | 'level_up';    // Future
   ```

3. **Update GameController transition methods** (`GameController.ts`):

   Find the `handleRewardsContinue` method and update it:
   ```typescript
   async handleRewardsContinue(): Promise<void> {
     // Transition to equipment screen instead of recruit
     const result = this.stateMachine.transitionTo('equipment');
     if (!result.ok) {
       this.logger.error('controller:transition_failed', {
         from: 'rewards',
         to: 'equipment',
         error: result.error
       });
     }
   }
   ```

   Add new method for equipment screen:
   ```typescript
   async handleEquipmentContinue(): Promise<void> {
     // After equipment, go to recruit
     const result = this.stateMachine.transitionTo('recruit');
     if (!result.ok) {
       this.logger.error('controller:transition_failed', {
         from: 'equipment',
         to: 'recruit',
         error: result.error
       });
     }
   }
   ```

**Acceptance Criteria:**
- ✅ Equipment screen appears after rewards
- ✅ Recruit screen appears after equipment
- ✅ State transitions validate correctly
- ✅ Flow works end-to-end (Battle → Rewards → Equipment → Recruit)

---

### **Task 2.3: Update RewardsScreen to Show Equipment**

**File:** `src/screens/RewardsScreen.tsx`

**Current:** Shows items and XP only

**Update:** Also display equipment earned (informational - actual equipping happens in next screen)

**Actions:**

1. **Add equipment display section** (after items section, before XP):
   ```tsx
   {/* Equipment Gained */}
   {rewards.equipment && rewards.equipment.length > 0 && (
     <div className="mb-8">
       <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
         Equipment Gained:
       </h2>
       <div className="space-y-3">
         {rewards.equipment.map((equip) => (
           <div
             key={equip.id}
             className="flex items-center gap-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg"
           >
             <div className="text-3xl">
               {equip.slot === 'weapon' ? '⚔️' : equip.slot === 'armor' ? '🛡️' : '💍'}
             </div>
             <div className="flex-1">
               <div className="font-semibold text-gray-900 dark:text-white">
                 {equip.name}
               </div>
               <div className="text-sm text-gray-600 dark:text-gray-400">
                 {equip.slot.charAt(0).toUpperCase() + equip.slot.slice(1)} • {equip.rarity}
               </div>
             </div>
             <div className="text-sm text-gray-700 dark:text-gray-300">
               {equip.stats.hp && `+${equip.stats.hp} HP `}
               {equip.stats.atk && `+${equip.stats.atk} ATK `}
               {equip.stats.def && `+${equip.stats.def} DEF `}
               {equip.stats.speed && `+${equip.stats.speed} SPD`}
             </div>
           </div>
         ))}
       </div>
     </div>
   )}
   ```

2. **Update button text** (since next screen is now Equipment):
   ```tsx
   <button
     onClick={onContinue}
     className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-lg transition-colors shadow-lg"
   >
     Continue to Equipment →
   </button>
   ```

**Acceptance Criteria:**
- ✅ Displays equipment earned (if any) with icons
- ✅ Shows equipment stats/bonuses clearly
- ✅ Button text updated to "Continue to Equipment →"
- ✅ No equipping functionality (just display)

---

## 🧪 Phase 3: Integration & Testing (30-45 min)

### **Task 3.1: Update SaveSystem for Equipment**

**File:** `src/systems/SaveSystem.ts`

**SaveEnvelope already has optional field** (verified around line 223 in game.ts):
```typescript
readonly inventoryData?: InventoryData;
```

**Actions:**

1. **Update save method** to include inventory data (in `save()` method):
   ```typescript
   async save(slot: string, gameState: /* GameState type */): Promise<Result<void, string>> {
     try {
       const envelope: SaveEnvelope = {
         version: SAVE_VERSION,
         slot,
         timestamp: new Date().toISOString(),
         team: gameState.team,
         battleIndex: gameState.battleIndex,
         // ... other existing fields ...
         inventoryData: gameState.inventory, // NEW - save equipment
       };
       
       const serialized = JSON.stringify(envelope, (key, value) => {
         // Handle Map serialization for equippedItems
         if (value instanceof Map) {
           return {
             __type: 'Map',
             entries: Array.from(value.entries())
           };
         }
         return value;
       });
       
       await this.store.write(slot, serialized);
       this.logger.info('save:success', { slot });
       return Ok(undefined);
     } catch (error) {
       this.logger.error('save:failed', { slot, error });
       return Err(`Failed to save: ${error}`);
     }
   }
   ```

2. **Update load method** to restore inventory (in `load()` method):
   ```typescript
   async load(slot: string): Promise<Result<SaveEnvelope, string>> {
     try {
       const serialized = await this.store.read(slot);
       const envelope = JSON.parse(serialized, (key, value) => {
         // Restore Map from serialized format
         if (value?.__type === 'Map') {
           return new Map(value.entries);
         }
         return value;
       }) as SaveEnvelope;
       
       // Ensure inventory has default structure if not present (backward compat)
       if (!envelope.inventoryData) {
         envelope.inventoryData = {
           items: [],
           equippedItems: new Map(),
           unequippedItems: [],
           maxItemSlots: 50,
           maxEquipmentSlots: 50
         };
       }
       
       this.logger.info('save:load_success', { slot });
       return Ok(envelope);
     } catch (error) {
       this.logger.error('save:load_failed', { slot, error });
       return Err(`Failed to load save: ${error}`);
     }
   }
   ```

**Acceptance Criteria:**
- ✅ Equipment saves to localStorage (Map serialized properly)
- ✅ Equipment loads from saves (Map restored properly)
- ✅ Backward compatible (old saves without inventoryData get default empty inventory)
- ✅ equippedItems Map serializes/deserializes correctly

---

### **Task 3.2: Update App.tsx to Include EquipmentScreen Route**

**File:** `src/App.tsx`

**Actions:**

1. **Import EquipmentScreen and equipment functions:**
   ```tsx
   import { EquipmentScreen } from './screens/EquipmentScreen.js';
   import { equipItem, unequipItem } from './systems/EquipmentSystem.js';
   ```

2. **Add route/case for 'equipment' state** (in screen rendering logic):
   ```tsx
   {currentScreen === 'equipment' && inventory && (
     <EquipmentScreen
       team={gameState.team}
       inventory={inventory}
       onEquip={(unitId, equipment) => {
         const result = equipItem(inventory, unitId, equipment);
         if (result.ok) {
           // Update game state with new inventory
           setGameState({ ...gameState, inventory: result.value });
         } else {
           console.error('Failed to equip item:', result.error);
         }
       }}
       onUnequip={(unitId, slot) => {
         const result = unequipItem(inventory, unitId, slot);
         if (result.ok) {
           setGameState({ ...gameState, inventory: result.value });
         } else {
           console.error('Failed to unequip item:', result.error);
         }
       }}
       onContinue={() => {
         controller.handleEquipmentContinue();
       }}
     />
   )}
   ```

3. **Initialize inventory in game state** (if not already present):
   ```tsx
   // When creating new game state
   const [gameState, setGameState] = useState({
     team: [],
     battleIndex: 0,
     inventory: {
       items: [],
       equippedItems: new Map(),
       unequippedItems: [],
       maxItemSlots: 50,
       maxEquipmentSlots: 50
     },
     // ... other state ...
   });
   ```

4. **Add equipment to inventory after rewards:**
   ```tsx
   // In battle victory handler (wherever rewards are processed)
   const updatedInventory = {
     ...gameState.inventory,
     unequippedItems: [
       ...gameState.inventory.unequippedItems,
       ...rewards.equipment // Add new equipment to unequipped pool
     ]
   };
   
   setGameState({
     ...gameState,
     inventory: updatedInventory
   });
   ```

**Acceptance Criteria:**
- ✅ EquipmentScreen renders in game flow
- ✅ Equipment state persists across screens
- ✅ Can equip/unequip items (state updates correctly)
- ✅ Can continue to recruitment after equipping
- ✅ Reward equipment added to inventory automatically

---

### **Task 3.3: Basic Tests for EquipmentSystem**

**File to Create:** `tests/systems/EquipmentSystem.test.ts`

**Required Coverage (15+ tests):**

```typescript
import { describe, test, expect } from 'vitest';
import {
  equipItem,
  unequipItem,
  getEquippedItem,
  getUnitStats,
  getUnequippedItems
} from '../../src/systems/EquipmentSystem.js';
import type { InventoryData, Equipment, PlayerUnit } from '../../src/types/game.js';

describe('EquipmentSystem', () => {
  // Helper: Create test equipment
  const createEquipment = (overrides?: Partial<Equipment>): Equipment => ({
    id: 'test-weapon-1',
    name: 'Test Sword',
    description: 'A test weapon',
    slot: 'weapon',
    stats: { atk: 10 },
    rarity: 'common',
    ...overrides
  });

  // Helper: Create test unit
  const createUnit = (overrides?: Partial<PlayerUnit>): PlayerUnit => ({
    id: 'unit-1',
    name: 'Test Warrior',
    role: 'Tank',
    tags: [],
    hp: 100,
    maxHp: 100,
    atk: 20,
    def: 15,
    speed: 10,
    ...overrides
  });

  // Helper: Create empty inventory
  const createEmptyInventory = (): InventoryData => ({
    items: [],
    equippedItems: new Map(),
    unequippedItems: [],
    maxItemSlots: 50,
    maxEquipmentSlots: 50
  });

  describe('equipItem', () => {
    test('equips item to unit successfully', () => {
      const weapon = createEquipment();
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon]
      };

      const result = equipItem(inventory, 'unit-1', weapon);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.get('unit-1-weapon')).toEqual(weapon);
        expect(result.value.unequippedItems.length).toBe(0);
      }
    });

    test('replaces existing item in same slot', () => {
      const oldWeapon = createEquipment({ id: 'old-weapon', name: 'Old Sword' });
      const newWeapon = createEquipment({ id: 'new-weapon', name: 'New Sword' });
      
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', oldWeapon]]),
        unequippedItems: [newWeapon]
      };

      const result = equipItem(inventory, 'unit-1', newWeapon);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.get('unit-1-weapon')).toEqual(newWeapon);
        expect(result.value.unequippedItems).toContainEqual(oldWeapon);
        expect(result.value.unequippedItems.length).toBe(1);
      }
    });

    test('returns error if item not in inventory', () => {
      const weapon = createEquipment();
      const inventory = createEmptyInventory();

      const result = equipItem(inventory, 'unit-1', weapon);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    test('handles different slot types correctly', () => {
      const armor = createEquipment({ id: 'armor-1', slot: 'armor', stats: { def: 10 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [armor]
      };

      const result = equipItem(inventory, 'unit-1', armor);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.get('unit-1-armor')).toEqual(armor);
      }
    });
  });

  describe('unequipItem', () => {
    test('unequips item from unit', () => {
      const weapon = createEquipment();
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const result = unequipItem(inventory, 'unit-1', 'weapon');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.has('unit-1-weapon')).toBe(false);
        expect(result.value.unequippedItems).toContainEqual(weapon);
      }
    });

    test('returns error if no item equipped in slot', () => {
      const inventory = createEmptyInventory();

      const result = unequipItem(inventory, 'unit-1', 'weapon');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('No weapon equipped');
      }
    });

    test('does not affect other equipped items', () => {
      const weapon = createEquipment({ slot: 'weapon' });
      const armor = createEquipment({ id: 'armor-1', slot: 'armor' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([
          ['unit-1-weapon', weapon],
          ['unit-1-armor', armor]
        ])
      };

      const result = unequipItem(inventory, 'unit-1', 'weapon');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.equippedItems.get('unit-1-armor')).toEqual(armor);
        expect(result.value.equippedItems.size).toBe(1);
      }
    });
  });

  describe('getEquippedItem', () => {
    test('returns equipped item in slot', () => {
      const weapon = createEquipment();
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const equipped = getEquippedItem(inventory, 'unit-1', 'weapon');

      expect(equipped).toEqual(weapon);
    });

    test('returns undefined if no item equipped', () => {
      const inventory = createEmptyInventory();

      const equipped = getEquippedItem(inventory, 'unit-1', 'weapon');

      expect(equipped).toBeUndefined();
    });

    test('returns correct item for different units', () => {
      const weapon1 = createEquipment({ id: 'weapon-1', name: 'Unit 1 Sword' });
      const weapon2 = createEquipment({ id: 'weapon-2', name: 'Unit 2 Sword' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([
          ['unit-1-weapon', weapon1],
          ['unit-2-weapon', weapon2]
        ])
      };

      expect(getEquippedItem(inventory, 'unit-1', 'weapon')).toEqual(weapon1);
      expect(getEquippedItem(inventory, 'unit-2', 'weapon')).toEqual(weapon2);
    });
  });

  describe('getUnitStats', () => {
    test('calculates base stats without equipment', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const inventory = createEmptyInventory();

      const stats = getUnitStats(unit, inventory);

      expect(stats).toEqual({ hp: 100, atk: 20, def: 15, speed: 10 });
    });

    test('adds equipment bonuses to stats', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const weapon = createEquipment({ stats: { atk: 10 } });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats.atk).toBe(30); // 20 base + 10 from weapon
      expect(stats.def).toBe(15); // unchanged
    });

    test('combines multiple equipment bonuses', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const weapon = createEquipment({ slot: 'weapon', stats: { atk: 10 } });
      const armor = createEquipment({ id: 'armor-1', slot: 'armor', stats: { def: 20 } });
      const accessory = createEquipment({ id: 'acc-1', slot: 'accessory', stats: { speed: 5 } });
      
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([
          ['unit-1-weapon', weapon],
          ['unit-1-armor', armor],
          ['unit-1-accessory', accessory]
        ])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats).toEqual({ hp: 100, atk: 30, def: 35, speed: 15 });
    });

    test('handles missing stat bonuses gracefully', () => {
      const unit = createUnit({ atk: 20, def: 15, speed: 10, maxHp: 100 });
      const weapon = createEquipment({ stats: {} }); // No bonuses
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        equippedItems: new Map([['unit-1-weapon', weapon]])
      };

      const stats = getUnitStats(unit, inventory);

      expect(stats).toEqual({ hp: 100, atk: 20, def: 15, speed: 10 });
    });
  });

  describe('getUnequippedItems', () => {
    test('returns all unequipped items', () => {
      const weapon = createEquipment();
      const armor = createEquipment({ id: 'armor-1', slot: 'armor' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon, armor]
      };

      const items = getUnequippedItems(inventory);

      expect(items).toEqual([weapon, armor]);
    });

    test('returns empty array when no items', () => {
      const inventory = createEmptyInventory();

      const items = getUnequippedItems(inventory);

      expect(items).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty inventory correctly', () => {
      const inventory = createEmptyInventory();
      const weapon = createEquipment();

      const equipResult = equipItem(inventory, 'unit-1', weapon);
      expect(equipResult.ok).toBe(false); // Item not in unequipped list

      const unequipResult = unequipItem(inventory, 'unit-1', 'weapon');
      expect(unequipResult.ok).toBe(false); // Nothing to unequip
    });

    test('handles multiple units independently', () => {
      const weapon1 = createEquipment({ id: 'weapon-1' });
      const weapon2 = createEquipment({ id: 'weapon-2' });
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon1, weapon2]
      };

      const result1 = equipItem(inventory, 'unit-1', weapon1);
      expect(result1.ok).toBe(true);
      
      if (result1.ok) {
        const result2 = equipItem(result1.value, 'unit-2', weapon2);
        expect(result2.ok).toBe(true);
        
        if (result2.ok) {
          expect(result2.value.equippedItems.get('unit-1-weapon')).toEqual(weapon1);
          expect(result2.value.equippedItems.get('unit-2-weapon')).toEqual(weapon2);
          expect(result2.value.unequippedItems.length).toBe(0);
        }
      }
    });

    test('prevents equipping to non-existent unit gracefully', () => {
      const weapon = createEquipment();
      const inventory: InventoryData = {
        ...createEmptyInventory(),
        unequippedItems: [weapon]
      };

      // System allows equipping to any unitId (validation should be in UI/controller)
      const result = equipItem(inventory, 'nonexistent-unit', weapon);
      expect(result.ok).toBe(true); // Still succeeds, validation is UI concern
    });
  });
});
```

**Acceptance Criteria:**
- ✅ 18+ tests for EquipmentSystem
- ✅ All tests passing
- ✅ Key logic paths covered (equip, unequip, stats, edge cases)
- ✅ Tests use Result type properly
- ✅ Helper functions for creating test data

---

## ✅ Deliverables Checklist

### **Phase 1: Core System**
- [ ] Equipment types reviewed in `game.ts`
- [ ] InventoryData updated with Map structure
- [ ] `EquipmentSystem.ts` created with 5 functions (equip, unequip, get, stats, list)
- [ ] `RewardSystem.ts` updated to generate equipment
- [ ] BattleReward interface includes equipment array
- [ ] Equipment appears in rewards

### **Phase 2: UI**
- [ ] `EquipmentScreen.tsx` created (barebones functional UI)
- [ ] Game flow updated (Rewards → Equipment → Recruit)
- [ ] ALLOWED_TRANSITIONS updated in game.ts
- [ ] GameController has `handleEquipmentContinue()` method
- [ ] `RewardsScreen.tsx` shows equipment earned
- [ ] All screens connected and navigable

### **Phase 3: Integration**
- [ ] `SaveSystem.ts` saves/loads inventory (Map serialization)
- [ ] Backward compatibility maintained (old saves work)
- [ ] `App.tsx` includes EquipmentScreen route
- [ ] Equipment state persists across screens
- [ ] `EquipmentSystem.test.ts` created (18+ tests)
- [ ] All tests passing

### **Overall Verification**
- [ ] `npm test` - 613+ tests passing (595 + ~18 new)
- [ ] `npm run type-check` - 0 errors
- [ ] `npm run circular` - 0 circular dependencies
- [ ] Full flow works: Battle → Rewards (shows equipment) → Equipment (equip items) → Recruit → Next Battle
- [ ] Save/load preserves equipped items
- [ ] Equipment bonuses apply in stat calculations
- [ ] Keyboard accessible (Tab, Enter, Esc)

---

## 📊 Expected Impact

**Before:**
- No equipment system
- Static unit stats
- Rewards = items + XP only
- 595 tests passing

**After:**
- ✅ Basic equipment system functional
- ✅ Units can equip weapon/armor/accessory
- ✅ Equipment provides stat bonuses
- ✅ Equipment screen in game flow (Rewards → Equipment → Recruit)
- ✅ Equipment saved/loaded with games
- ✅ ~613+ tests passing (all green)
- ✅ Equipment drops from battles (difficulty-scaled)

---

## 🎯 Design Philosophy: Keep It Simple

**What to Include:**
- ✅ Three equipment slots (weapon, armor, accessory)
- ✅ Simple stat bonuses (hp, atk, def, speed)
- ✅ Basic equip/unequip UI (modal-based)
- ✅ Equipment from battle rewards (drop system)
- ✅ Save/load equipment state

**What to Skip (For Now):**
- ❌ Equipment shops/merchants
- ❌ Equipment durability/breaking
- ❌ Set bonuses
- ❌ Equipment leveling/upgrading
- ❌ Complex stat calculations (crit, elemental damage, etc.)
- ❌ Equipment comparison tooltips
- ❌ Drag-and-drop equipping
- ❌ Equipment visual changes on units

**Keep it bareboned and functional. You can add complexity later!**

---

## 🚀 Getting Started

1. **Start with Phase 1** (Core System) - get the logic working
   - Update types
   - Create EquipmentSystem
   - Update RewardSystem

2. **Move to Phase 2** (UI) - simple, functional screens
   - Create EquipmentScreen
   - Wire up game flow
   - Update RewardsScreen

3. **Finish with Phase 3** (Integration & Tests) - connect everything
   - Update SaveSystem
   - Wire App.tsx
   - Write comprehensive tests

**Run validation frequently:**
```bash
npm test
npm run type-check
npm run circular
```

**Test the full flow manually after each phase!**

---

## 🔍 Key Technical Notes

1. **Map Serialization:** Maps need custom serialization in SaveSystem (see Task 3.1)
2. **Map Key Format:** Always use `"unitId-slot"` format (e.g., `"unit1-weapon"`)
3. **Immutability:** All EquipmentSystem functions return new objects (no mutations)
4. **Result Type:** Use `Ok()` and `Err()` from `utils/Result.ts` for error handling
5. **Backward Compat:** Old saves without `inventoryData` get default empty inventory
6. **RNG Usage:** RewardSystem uses `rng.float()` and `rng.int()` for determinism

---

**This will give you a basic but functional equipment system that enhances gameplay without overcomplicating things!** ⚔️✨

**Ready for implementation!** 🚀
