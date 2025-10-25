# 🔮 Task: Complete Gem System - Spells & Activation

## 📋 Overview

**Status:** Gem bonus system implemented, but spells/activation mechanics missing

**What's Already Done:**
- ✅ Element types (Venus/Mars/Jupiter/Mercury/Moon/Sun)
- ✅ Gem selection UI (GemSelectScreen)
- ✅ GameController gem state management
- ✅ ElementSystem bonus calculations (+15% match, +5% neutral, -5% counter)
- ✅ Activation flag tracking (`isActivated`)
- ✅ Save/Load persistence

**What's Missing:**
- ❌ Elemental spells for matching units (Fire Blast, Earth Shield, etc.)
- ❌ Anti-elemental spells for counter units (Fire Ward, Water Shield, etc.)
- ❌ Activation abilities (party-wide effects when gem activated)
- ❌ AbilitySystem integration with element matching
- ❌ Spell unlocking based on gem + unit element

**Goal:** Implement the spell/ability portion of the gem system so units gain spells based on element matching.

**Time Estimate:** 3-4 hours

---

## 🎯 What Needs to Be Built

### **1. Elemental Spell Definitions**

**Matching Element Spells (Unit = Gem):**
- **Mars (Fire):** Fire Blast - 30 damage, 8 MP
- **Venus (Earth):** Stone Wall - +10 defense buff, 8 MP
- **Jupiter (Wind):** Lightning Strike - 25 damage, 8 MP
- **Mercury (Water):** Healing Wave - 20 HP heal, 10 MP
- **Moon (Light):** Divine Shield - +15 defense buff, 10 MP
- **Sun (Dark):** Shadow Strike - 28 damage, 8 MP

**Counter Element Spells (Unit counters Gem):**
- **Fire Ward:** Reduces fire damage taken by 30%, 6 MP
- **Earth Ward:** Reduces earth damage taken by 30%, 6 MP
- **Wind Ward:** Reduces wind damage taken by 30%, 6 MP
- **Water Ward:** Reduces water damage taken by 30%, 6 MP
- **Light Ward:** Reduces light damage taken by 30%, 6 MP
- **Dark Ward:** Reduces dark damage taken by 30%, 6 MP

### **2. Activation Abilities (Party-Wide)**

**When Player Activates Gem:**
- **Mars:** Volcanic Eruption - 50 AoE damage to all enemies
- **Venus:** Earthquake - 40 AoE damage + 20% defense debuff
- **Jupiter:** Thunderstorm - 45 AoE damage + 10% speed debuff
- **Mercury:** Tidal Wave - 35 AoE damage + cleanse all debuffs
- **Moon:** Lunar Blessing - Heal all party 30 HP + remove debuffs
- **Sun:** Solar Flare - 55 AoE damage + blind (50% miss chance)

---

## 🔨 Implementation Plan

### **Phase 1: Define Elemental Spells**

#### **Task 1.1: Create Spell Definitions**

**File:** `src/data/elementalSpells.ts` (NEW FILE)

```typescript
import type { Ability } from '../types/game.js';

/**
 * Elemental spells granted when unit element matches gem element
 * Format: [Element]_SPELL (e.g., MARS_SPELL = Fire Blast)
 */
export const MATCHING_SPELLS: Record<string, Ability> = {
  Mars: {
    id: 'fire_blast',
    name: 'Fire Blast',
    description: 'Unleash a burst of flames at target.',
    type: 'offensive',
    mpCost: 8,
    power: 30, // Base damage
    target: 'single_enemy',
  },
  Venus: {
    id: 'stone_wall',
    name: 'Stone Wall',
    description: 'Raise earthen defense to protect target.',
    type: 'support',
    mpCost: 8,
    power: 10, // Defense bonus
    target: 'single_ally',
  },
  Jupiter: {
    id: 'lightning_strike',
    name: 'Lightning Strike',
    description: 'Strike foe with bolt of lightning.',
    type: 'offensive',
    mpCost: 8,
    power: 25,
    target: 'single_enemy',
  },
  Mercury: {
    id: 'healing_wave',
    name: 'Healing Wave',
    description: 'Restore HP with soothing water.',
    type: 'support',
    mpCost: 10,
    power: 20, // HP restored
    target: 'single_ally',
  },
  Moon: {
    id: 'divine_shield',
    name: 'Divine Shield',
    description: 'Blessed light shields from harm.',
    type: 'support',
    mpCost: 10,
    power: 15, // Defense bonus
    target: 'single_ally',
  },
  Sun: {
    id: 'shadow_strike',
    name: 'Shadow Strike',
    description: 'Attack from the shadows.',
    type: 'offensive',
    mpCost: 8,
    power: 28,
    target: 'single_enemy',
  },
};

/**
 * Counter-element spells (defensive wards)
 * Format: Counter element name (e.g., "Mars" when gem is Mercury)
 */
export const COUNTER_SPELLS: Record<string, Ability> = {
  Mars: {
    id: 'fire_ward',
    name: 'Fire Ward',
    description: 'Reduce fire damage taken by 30%.',
    type: 'support',
    mpCost: 6,
    power: 0, // Ward effect (not damage)
    target: 'self',
  },
  Venus: {
    id: 'earth_ward',
    name: 'Earth Ward',
    description: 'Reduce earth damage taken by 30%.',
    type: 'support',
    mpCost: 6,
    power: 0,
    target: 'self',
  },
  Jupiter: {
    id: 'wind_ward',
    name: 'Wind Ward',
    description: 'Reduce wind damage taken by 30%.',
    type: 'support',
    mpCost: 6,
    power: 0,
    target: 'self',
  },
  Mercury: {
    id: 'water_ward',
    name: 'Water Ward',
    description: 'Reduce water damage taken by 30%.',
    type: 'support',
    mpCost: 6,
    power: 0,
    target: 'self',
  },
  Moon: {
    id: 'light_ward',
    name: 'Light Ward',
    description: 'Reduce light damage taken by 30%.',
    type: 'support',
    mpCost: 6,
    power: 0,
    target: 'self',
  },
  Sun: {
    id: 'dark_ward',
    name: 'Dark Ward',
    description: 'Reduce dark damage taken by 30%.',
    type: 'support',
    mpCost: 6,
    power: 0,
    target: 'self',
  },
};
```

**Acceptance Criteria:**
- ✅ 6 matching spells defined (one per element)
- ✅ 6 counter spells defined (wards)
- ✅ All spells have id, name, description, type, mpCost, power, target
- ✅ TypeScript compiles

---

#### **Task 1.2: Define Activation Abilities**

**File:** `src/data/gemActivations.ts` (NEW FILE)

```typescript
import type { Element } from '../types/game.js';

/**
 * Gem activation abilities (party-wide effects)
 * Used when player activates gem mid-battle
 */
export interface GemActivation {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly effect: 'aoe_damage' | 'party_heal' | 'party_buff' | 'enemy_debuff';
  readonly power: number; // Damage/heal amount or buff percentage
  readonly target: 'all_enemies' | 'all_allies';
}

export const GEM_ACTIVATIONS: Record<Element, GemActivation> = {
  Mars: {
    id: 'volcanic_eruption',
    name: 'Volcanic Eruption',
    description: 'Explosive fire engulfs all foes.',
    effect: 'aoe_damage',
    power: 50,
    target: 'all_enemies',
  },
  Venus: {
    id: 'earthquake',
    name: 'Earthquake',
    description: 'Tremors shake the battlefield, weakening enemies.',
    effect: 'aoe_damage',
    power: 40,
    target: 'all_enemies',
  },
  Jupiter: {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    description: 'Lightning strikes all enemies.',
    effect: 'aoe_damage',
    power: 45,
    target: 'all_enemies',
  },
  Mercury: {
    id: 'tidal_wave',
    name: 'Tidal Wave',
    description: 'Crashing water damages and cleanses debuffs.',
    effect: 'aoe_damage',
    power: 35,
    target: 'all_enemies',
  },
  Moon: {
    id: 'lunar_blessing',
    name: 'Lunar Blessing',
    description: 'Moonlight heals and purifies the party.',
    effect: 'party_heal',
    power: 30,
    target: 'all_allies',
  },
  Sun: {
    id: 'solar_flare',
    name: 'Solar Flare',
    description: 'Blinding light scorches and blinds enemies.',
    effect: 'aoe_damage',
    power: 55,
    target: 'all_enemies',
  },
};
```

**Acceptance Criteria:**
- ✅ 6 activation abilities defined (one per gem)
- ✅ Clear effect types and power values
- ✅ TypeScript compiles

---

### **Phase 2: Spell Unlocking System**

#### **Task 2.1: Add Spell Granting to ElementSystem**

**File:** `src/systems/ElementSystem.ts`

**Add function:**
```typescript
import { MATCHING_SPELLS, COUNTER_SPELLS } from '../data/elementalSpells.js';
import { getCounterElement } from '../data/gems.js';
import type { Ability, Element, ActiveGemState } from '../types/game.js';

/**
 * Get elemental spells granted to a unit based on gem/element match
 * @param unitElement - Unit's element
 * @param gemState - Current gem state
 * @returns Array of abilities granted (0-1 spells)
 */
export function getGrantedSpells(
  unitElement: Element,
  gemState: ActiveGemState
): Ability[] {
  const { activeGem } = gemState;
  
  if (!activeGem) {
    return []; // No gem = no bonus spells
  }
  
  const gemElement = activeGem.element;
  
  // MATCHING: Unit element matches gem element
  if (unitElement === gemElement) {
    const spell = MATCHING_SPELLS[unitElement];
    return spell ? [spell] : [];
  }
  
  // COUNTER: Unit element counters gem element
  const counterElement = getCounterElement(gemElement);
  if (unitElement === counterElement) {
    const spell = COUNTER_SPELLS[gemElement]; // Ward against gem's element
    return spell ? [spell] : [];
  }
  
  // NEUTRAL: No bonus spells
  return [];
}
```

**Acceptance Criteria:**
- ✅ Function returns matching spell for matching elements
- ✅ Function returns counter spell for counter elements
- ✅ Function returns empty array for neutral elements
- ✅ TypeScript compiles

---

#### **Task 2.2: Integrate with AbilitySystem**

**File:** `src/systems/AbilitySystem.ts`

**Modify to include gem spells:**

Currently, AbilitySystem only tracks base unit abilities. We need to merge base abilities with gem-granted spells.

**Add helper function:**
```typescript
import { getGrantedSpells } from './ElementSystem.js';
import type { PlayerUnit, ActiveGemState, Ability } from '../types/game.js';

/**
 * Get all abilities for a unit (base + gem-granted)
 * @param unit - Player unit
 * @param gemState - Current gem state
 * @returns Combined array of abilities
 */
export function getAllAbilities(
  unit: PlayerUnit,
  gemState: ActiveGemState
): Ability[] {
  const baseAbilities = unit.abilities || [];
  const gemSpells = getGrantedSpells(unit.element, gemState);
  
  return [...baseAbilities, ...gemSpells];
}
```

**Update existing functions to use `getAllAbilities`:**

Anywhere AbilitySystem checks `unit.abilities`, it should now call `getAllAbilities(unit, gemState)` instead.

**Acceptance Criteria:**
- ✅ Units can use base abilities + gem-granted spells
- ✅ Gem spells appear in battle ability menu
- ✅ Spells respect MP costs
- ✅ TypeScript compiles

---

### **Phase 3: Activation Ability Integration**

#### **Task 3.1: Add Activation UI to BattleScreen**

**File:** `src/screens/BattleScreen.tsx`

**Add "Activate Gem" button:**

Add a new action button alongside Attack/Ability/Flee:

```tsx
{/* Gem Activation Button */}
{!gemState.isActivated && gemState.activeGem && (
  <button
    onClick={handleActivateGem}
    className="px-6 py-3 bg-purple-600 text-white rounded-lg 
               hover:bg-purple-700 transition-colors font-medium"
  >
    🔮 Activate {gemState.activeGem.name}
  </button>
)}
```

**Handler:**
```tsx
const handleActivateGem = () => {
  const result = controller.activateGem();
  
  if (result.success) {
    // Execute activation ability effect
    const activation = GEM_ACTIVATIONS[gemState.activeGem!.element];
    
    // Apply effect (damage, heal, buff, etc.)
    executeActivationEffect(activation);
    
    // Refresh state
    setGemState(controller.getGemState());
  }
};
```

**Acceptance Criteria:**
- ✅ Activate button appears when gem not activated
- ✅ Button disappears after activation
- ✅ Clicking button triggers activation
- ✅ Visual feedback (animation, message)

---

#### **Task 3.2: Implement Activation Effects**

**File:** `src/systems/BattleSystem.ts` (or create `src/systems/GemActivationSystem.ts`)

**Add function:**
```typescript
import { GEM_ACTIVATIONS } from '../data/gemActivations.js';
import type { BattleState, GemActivation } from '../types/game.js';

/**
 * Execute gem activation effect
 * @param activation - Activation ability data
 * @param battleState - Current battle state
 * @returns Updated battle state
 */
export function executeGemActivation(
  activation: GemActivation,
  battleState: BattleState
): BattleState {
  switch (activation.effect) {
    case 'aoe_damage': {
      // Damage all enemies
      const updatedEnemies = battleState.enemies.map(enemy => ({
        ...enemy,
        currentHp: Math.max(0, enemy.currentHp - activation.power),
      }));
      
      return {
        ...battleState,
        enemies: updatedEnemies,
      };
    }
    
    case 'party_heal': {
      // Heal all allies
      const updatedAllies = battleState.playerUnits.map(unit => ({
        ...unit,
        currentHp: Math.min(unit.maxHp, unit.currentHp + activation.power),
      }));
      
      return {
        ...battleState,
        playerUnits: updatedAllies,
      };
    }
    
    case 'party_buff':
    case 'enemy_debuff':
      // TODO: Implement buff/debuff system if not already present
      return battleState;
    
    default:
      return battleState;
  }
}
```

**Acceptance Criteria:**
- ✅ AoE damage activations damage all enemies
- ✅ Party heal activations heal all allies
- ✅ Effects apply instantly
- ✅ Battle log shows activation message

---

### **Phase 4: Testing**

#### **Task 4.1: Test Spell Granting**

**File:** `tests/systems/ElementSystem.spells.test.ts` (NEW FILE)

```typescript
import { describe, it, expect } from 'vitest';
import { getGrantedSpells } from '../../src/systems/ElementSystem';
import { MARS_GEM, MERCURY_GEM } from '../../src/data/gems';
import type { ActiveGemState } from '../../src/types/game';

describe('ElementSystem - Spell Granting', () => {
  describe('Matching Element', () => {
    it('grants matching spell when unit element = gem element', () => {
      const gemState: ActiveGemState = {
        activeGem: MARS_GEM,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Mars', gemState);
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Fire Blast');
      expect(spells[0].mpCost).toBe(8);
    });
  });
  
  describe('Counter Element', () => {
    it('grants counter spell when unit counters gem', () => {
      const gemState: ActiveGemState = {
        activeGem: MARS_GEM, // Fire
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Mercury', gemState); // Water counters Fire
      
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Fire Ward');
      expect(spells[0].mpCost).toBe(6);
    });
  });
  
  describe('Neutral Element', () => {
    it('grants no spells for neutral elements', () => {
      const gemState: ActiveGemState = {
        activeGem: MARS_GEM,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Jupiter', gemState); // Wind = neutral to Fire
      
      expect(spells).toHaveLength(0);
    });
  });
  
  describe('No Active Gem', () => {
    it('grants no spells when no gem selected', () => {
      const gemState: ActiveGemState = {
        activeGem: null,
        isActivated: false,
      };
      
      const spells = getGrantedSpells('Mars', gemState);
      
      expect(spells).toHaveLength(0);
    });
  });
});
```

**Target: 12+ tests**

**Acceptance Criteria:**
- ✅ All spell granting tests pass
- ✅ Matching, counter, neutral, and no-gem cases covered

---

#### **Task 4.2: Test Activation Effects**

**File:** `tests/systems/GemActivation.test.ts` (NEW FILE)

```typescript
import { describe, it, expect } from 'vitest';
import { executeGemActivation } from '../../src/systems/GemActivationSystem';
import { GEM_ACTIVATIONS } from '../../src/data/gemActivations';
import type { BattleState } from '../../src/types/game';

describe('Gem Activation System', () => {
  describe('AoE Damage Activations', () => {
    it('damages all enemies when activating Mars (Volcanic Eruption)', () => {
      const initialState: BattleState = {
        playerUnits: [/* ... */],
        enemies: [
          { id: 'e1', currentHp: 100, maxHp: 100 /* ... */ },
          { id: 'e2', currentHp: 80, maxHp: 100 /* ... */ },
        ],
        /* ... */
      };
      
      const activation = GEM_ACTIVATIONS.Mars; // 50 damage
      const result = executeGemActivation(activation, initialState);
      
      expect(result.enemies[0].currentHp).toBe(50); // 100 - 50
      expect(result.enemies[1].currentHp).toBe(30); // 80 - 50
    });
  });
  
  describe('Party Heal Activations', () => {
    it('heals all allies when activating Moon (Lunar Blessing)', () => {
      const initialState: BattleState = {
        playerUnits: [
          { id: 'p1', currentHp: 50, maxHp: 100 /* ... */ },
          { id: 'p2', currentHp: 30, maxHp: 80 /* ... */ },
        ],
        enemies: [/* ... */],
        /* ... */
      };
      
      const activation = GEM_ACTIVATIONS.Moon; // 30 heal
      const result = executeGemActivation(activation, initialState);
      
      expect(result.playerUnits[0].currentHp).toBe(80); // 50 + 30
      expect(result.playerUnits[1].currentHp).toBe(60); // 30 + 30
    });
  });
});
```

**Target: 8+ tests**

**Acceptance Criteria:**
- ✅ All activation effect tests pass
- ✅ Damage and heal calculations correct

---

## ✅ Completion Checklist

### **Phase 1: Spell Definitions**
- [ ] `elementalSpells.ts` created with 6 matching + 6 counter spells
- [ ] `gemActivations.ts` created with 6 activation abilities
- [ ] All spells have proper Ability structure
- [ ] TypeScript compiles (0 errors)

### **Phase 2: Spell Unlocking**
- [ ] `getGrantedSpells()` function in ElementSystem
- [ ] `getAllAbilities()` function in AbilitySystem
- [ ] Units show gem-granted spells in battle
- [ ] Spells respect MP costs
- [ ] TypeScript compiles (0 errors)

### **Phase 3: Activation Integration**
- [ ] Activate Gem button in BattleScreen
- [ ] `executeGemActivation()` function implemented
- [ ] AoE damage activations work
- [ ] Party heal activations work
- [ ] Activation effects apply correctly
- [ ] Visual feedback (messages, animations)

### **Phase 4: Testing**
- [ ] 12+ spell granting tests pass
- [ ] 8+ activation effect tests pass
- [ ] Integration test: Full gem cycle (select → bonus → spells → activate → reset)
- [ ] Manual testing: Play through battle with gem spells

### **Overall Quality**
- [ ] 0 TypeScript errors
- [ ] All new tests passing (20+ total new tests)
- [ ] Gem spells usable in battle
- [ ] Activation abilities functional
- [ ] Save/load preserves gem state
- [ ] Code follows project patterns (Result types, pure functions)

---

## 🎯 Success Criteria

**The gem system is COMPLETE when:**

1. ✅ Units gain spells based on element matching (6 matching spells work)
2. ✅ Counter-element units get ward spells (6 ward spells work)
3. ✅ Player can activate gem mid-battle (6 activation abilities work)
4. ✅ Activation removes bonuses but keeps spells
5. ✅ All tests pass (20+ new tests)
6. ✅ Manual testing confirms: select gem → see spells → use spells → activate gem → spells remain

---

## 📊 Test Summary Target

**Current:**
- ElementSystem.test.ts: 20 tests ✅
- GameController.gem.test.ts: 22 tests ✅
- GemSystemIntegration.test.ts: 6 tests ✅

**Need to Add:**
- ElementSystem.spells.test.ts: 12 tests (NEW)
- GemActivation.test.ts: 8 tests (NEW)

**Total Target: 68 tests** (48 existing + 20 new)

---

**This completes the gem system with ALL mechanics from the original design!** 🔮✨
