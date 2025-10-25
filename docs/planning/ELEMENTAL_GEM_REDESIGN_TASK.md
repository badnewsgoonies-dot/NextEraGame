# 🔮 Task: Elemental Gem System - Correct Implementation

## 📋 Overview

**Goal:** Implement elemental gem system with team-wide bonuses, element matching, and battle activation mechanics.

**Current Issue:** The implemented system is a gem **collection/inventory** system. We need an **active elemental alignment** system instead.

**What Was Implemented (Incorrect):**
- ❌ Gem selection after every battle (3 choices)
- ❌ Gems as collectible inventory items
- ❌ No team-wide bonuses or element matching
- ❌ No spells or activation mechanics
- ❌ No counter-element system

**What We Actually Need:**
- ✅ Gem selection ONCE at start (after team building)
- ✅ ONE active gem affects entire team
- ✅ Element matching determines bonuses (matching/neutral/counter)
- ✅ Spells unlocked based on element match
- ✅ Mid-battle activation removes bonuses but keeps spells
- ✅ Gem resets every battle

**Design:** Party-wide elemental alignment system where ONE gem affects all units differently based on element matching.

**Time Estimate:**
- **AI Time:** 4-6 hours
- **Human Time Equivalent:** 8-12 hours

---

## 🎯 Core Game Mechanics (CRITICAL - READ CAREFULLY)

### **1. Element System**

**Six Elements:**
- **Venus** (Earth)
- **Mars** (Fire)
- **Jupiter** (Wind)
- **Mercury** (Water)
- **Moon** (Light)
- **Sun** (Dark)

**Counter Relationships:**
- Fire (Mars) ↔ Water (Mercury)
- Earth (Venus) ↔ Wind (Jupiter)
- Light (Moon) ↔ Dark (Sun)

---

### **2. Gem Selection Timing**

**When Player Selects Gem:**
- **Once:** After initial team building (after starter selection, before first battle)
- **Future:** Potentially at level 5 and level 10 (not MVP, note for later)

**Selection Process:**
- Player chooses ONE gem from 6 options (one per element)
- This gem becomes the "active gem" for the entire run
- Gem affects all party members differently based on their element

---

### **3. Element Matching & Bonuses**

**Each Unit Has an Element:**
- Units are assigned an element: Venus/Mars/Jupiter/Mercury/Moon/Sun
- Example: Warrior might be Mars (Fire), Mage might be Mercury (Water)

**Bonus Calculation (Per Unit):**

**Matching Element (Unit element = Gem element):**
- **Stat Bonus:** +15% to all stats (HP, Attack, Defense, Speed)
- **Spell Unlock:** Unit gains elemental spell (Fire Blast, Water Shield, etc.)

**Neutral Element (No match, no counter):**
- **Stat Bonus:** +5% to all stats
- **Spell Unlock:** None

**Counter Element (Unit element counters Gem element):**
- **Stat Penalty:** 0% (no bonus) OR -5% (debuff)
- **Spell Unlock:** Unique anti-elemental spell (Fire Ward vs Water, etc.)

**Example:**
```
Active Gem: Mars (Fire)

Party:
- Warrior (Mars): +15% stats, Fire Blast spell (MATCH)
- Mage (Mercury): -5% stats, Water Ward spell (COUNTER)
- Ranger (Jupiter): +5% stats, no spell (NEUTRAL)
- Cleric (Moon): +5% stats, no spell (NEUTRAL)
```

---

### **4. Gem Activation (Mid-Battle Mechanic)**

**Activation:**
- During battle, player can "activate" the gem
- Casts a powerful party-wide ability (damage, heal, buff, etc.)
- **One-time use per battle**

**After Activation:**
- **Stat bonuses removed** (all units return to base stats)
- **Spells remain** (units keep their elemental/anti spells)
- Gem cannot be activated again this battle

**Reset:**
- Gem fully resets after battle (bonuses + activation restored)

**Example:**
```
Turn 5: Player activates Mars (Fire) gem
- Effect: 50 AoE damage to all enemies
- Result: All party stat bonuses removed
- BUT: Warrior still has Fire Blast spell available
```

---

### **5. Persistence Rules**

**Between Battles:**
- Active gem persists
- Stat bonuses reapply (gem resets)
- Activation available again

**Save/Load:**
- Active gem saved with game state
- Units retain their elements

**Run Continuity:**
- Same gem for entire run (unless level 5/10 reselection added later)

---

## 🎯 Phase 1: Core Data Structures (1-2 hours)

### **Task 1.1: Define Element Types**

**File:** `src/types/game.ts`

**Add:**
```typescript
export type Element = 'Venus' | 'Mars' | 'Jupiter' | 'Mercury' | 'Moon' | 'Sun';

export interface ElementalGem {
  readonly element: Element;
  readonly name: string; // "Venus Gem", "Mars Gem", etc.
  readonly description: string;
  readonly activationAbility: string; // Name of ability when activated
}

export interface GemState {
  readonly activeGem: ElementalGem | null;
  readonly isActivated: boolean; // Has gem been used this battle?
}
```

**Modify `PlayerUnit` interface:**
```typescript
export interface PlayerUnit {
  // ... existing fields
  readonly element: Element; // ADD THIS
}
```

**Acceptance Criteria:**
- ✅ Element type defined with 6 values
- ✅ ElementalGem interface created
- ✅ GemState interface tracks active gem + activation status
- ✅ PlayerUnit has element field
- ✅ TypeScript compiles (0 errors)

---

### **Task 1.2: Create Gem Data Catalog**

**File:** `src/data/gems.ts` (create new file)

**Purpose:** Define all 6 elemental gems with their properties

**Content:**
```typescript
import type { ElementalGem, Element } from '../types/game.js';

export const ELEMENTAL_GEMS: Record<Element, ElementalGem> = {
  Venus: {
    element: 'Venus',
    name: 'Venus Gem',
    description: 'Earth element gem. Strong vs Wind, weak vs Earth.',
    activationAbility: 'Stone Shield', // Example
  },
  Mars: {
    element: 'Mars',
    name: 'Mars Gem',
    description: 'Fire element gem. Strong vs Water, weak vs Fire.',
    activationAbility: 'Flame Burst',
  },
  Jupiter: {
    element: 'Jupiter',
    name: 'Jupiter Gem',
    description: 'Wind element gem. Strong vs Earth, weak vs Wind.',
    activationAbility: 'Gale Force',
  },
  Mercury: {
    element: 'Mercury',
    name: 'Mercury Gem',
    description: 'Water element gem. Strong vs Fire, weak vs Water.',
    activationAbility: 'Tidal Wave',
  },
  Moon: {
    element: 'Moon',
    name: 'Moon Gem',
    description: 'Light element gem. Strong vs Dark, weak vs Light.',
    activationAbility: 'Lunar Blessing',
  },
  Sun: {
    element: 'Sun',
    name: 'Sun Gem',
    description: 'Dark element gem. Strong vs Light, weak vs Dark.',
    activationAbility: 'Solar Flare',
  },
};

// Counter relationship lookup
export function getCounterElement(element: Element): Element {
  const counters: Record<Element, Element> = {
    Mars: 'Mercury',
    Mercury: 'Mars',
    Venus: 'Jupiter',
    Jupiter: 'Venus',
    Moon: 'Sun',
    Sun: 'Moon',
  };
  return counters[element];
}

// Check if element1 counters element2
export function isCounterElement(unitElement: Element, gemElement: Element): boolean {
  return getCounterElement(gemElement) === unitElement;
}
```

**Acceptance Criteria:**
- ✅ All 6 gems defined with properties
- ✅ Counter relationship helper functions
- ✅ Clean, type-safe implementation
- ✅ TypeScript compiles

---

### **Task 1.3: Add Gem State to GameController**

**File:** `src/core/GameController.ts`

**Modify `GameState` interface:**
```typescript
interface GameState {
  // ... existing fields
  gemState: GemState;
}
```

**Initialize in constructor:**
```typescript
this.state = {
  // ... existing
  gemState: {
    activeGem: null,
    isActivated: false,
  },
};
```

**Add methods:**
```typescript
/**
 * Set active gem (called after gem selection screen)
 */
setActiveGem(gem: ElementalGem): Result<void, string> {
  this.state = {
    ...this.state,
    gemState: {
      activeGem: gem,
      isActivated: false,
    },
  };
  return ok(undefined);
}

/**
 * Get current gem state
 */
getGemState(): GemState {
  return this.state.gemState;
}

/**
 * Activate gem (mid-battle)
 */
activateGem(): Result<void, string> {
  if (!this.state.gemState.activeGem) {
    return err('No active gem to activate');
  }
  if (this.state.gemState.isActivated) {
    return err('Gem already activated this battle');
  }
  
  this.state = {
    ...this.state,
    gemState: {
      ...this.state.gemState,
      isActivated: true,
    },
  };
  
  return ok(undefined);
}

/**
 * Reset gem for next battle (called after battle ends)
 */
resetGem(): void {
  if (this.state.gemState.activeGem) {
    this.state = {
      ...this.state,
      gemState: {
        ...this.state.gemState,
        isActivated: false,
      },
    };
  }
}
```

**Acceptance Criteria:**
- ✅ GemState in GameState
- ✅ setActiveGem() method works
- ✅ getGemState() returns current state
- ✅ activateGem() validates and sets activated flag
- ✅ resetGem() resets for next battle
- ✅ Pure functions (no mutations)
- ✅ Result type for error handling

---

## 🎯 Phase 2: Element Bonus System (1-2 hours)

### **Task 2.1: Create Element Bonus Calculator**

**File:** `src/systems/ElementSystem.ts` (create new file)

**Purpose:** Calculate stat bonuses based on element matching

**Content:**
```typescript
import type { Element, PlayerUnit, ElementalGem } from '../types/game.js';
import { isCounterElement } from '../data/gems.js';

export interface ElementBonus {
  readonly statMultiplier: number; // 1.15 (match), 1.05 (neutral), 0.95 (counter)
  readonly hasElementalSpell: boolean; // Matching element spell
  readonly hasAntiSpell: boolean; // Counter element spell
  readonly matchType: 'matching' | 'neutral' | 'counter';
}

export function calculateElementBonus(
  unitElement: Element,
  activeGem: ElementalGem | null,
  isGemActivated: boolean
): ElementBonus {
  // No gem active
  if (!activeGem) {
    return {
      statMultiplier: 1.0,
      hasElementalSpell: false,
      hasAntiSpell: false,
      matchType: 'neutral',
    };
  }
  
  // After gem activation, remove stat bonuses but keep spells
  const gemElement = activeGem.element;
  const isMatching = unitElement === gemElement;
  const isCounter = isCounterElement(unitElement, gemElement);
  
  if (isMatching) {
    return {
      statMultiplier: isGemActivated ? 1.0 : 1.15, // +15% if not activated
      hasElementalSpell: true,
      hasAntiSpell: false,
      matchType: 'matching',
    };
  }
  
  if (isCounter) {
    return {
      statMultiplier: isGemActivated ? 1.0 : 0.95, // -5% penalty if not activated
      hasElementalSpell: false,
      hasAntiSpell: true,
      matchType: 'counter',
    };
  }
  
  // Neutral
  return {
    statMultiplier: isGemActivated ? 1.0 : 1.05, // +5% if not activated
    hasElementalSpell: false,
    hasAntiSpell: false,
    matchType: 'neutral',
  };
}

/**
 * Apply element bonus to unit stats
 */
export function applyElementBonus(
  unit: PlayerUnit,
  bonus: ElementBonus
): PlayerUnit {
  const multiplier = bonus.statMultiplier;
  
  return {
    ...unit,
    maxHp: Math.floor(unit.maxHp * multiplier),
    hp: Math.floor(unit.hp * multiplier),
    attack: Math.floor(unit.attack * multiplier),
    defense: Math.floor(unit.defense * multiplier),
    speed: Math.floor(unit.speed * multiplier),
  };
}
```

**Acceptance Criteria:**
- ✅ calculateElementBonus() returns correct multipliers
- ✅ Matching: 1.15x (or 1.0x if activated)
- ✅ Counter: 0.95x (or 1.0x if activated)
- ✅ Neutral: 1.05x (or 1.0x if activated)
- ✅ Spell flags set correctly
- ✅ applyElementBonus() modifies stats correctly
- ✅ Pure functions (returns new unit)

---

### **Task 2.2: Integrate Element Bonuses into Battle Initialization**

**File:** `src/systems/BattleSystem.ts`

**Modify `initializeBattle()` function:**

**Import:**
```typescript
import { calculateElementBonus, applyElementBonus } from './ElementSystem.js';
```

**Before battle starts, apply bonuses:**
```typescript
export function initializeBattle(
  playerUnits: readonly PlayerUnit[],
  enemyUnits: readonly EnemyUnit[],
  rng: IRng,
  activeGem: ElementalGem | null, // ADD THIS PARAMETER
  isGemActivated: boolean // ADD THIS PARAMETER
): BattleState {
  // Apply element bonuses to player units
  const buffedPlayerUnits = playerUnits.map(unit => {
    const bonus = calculateElementBonus(unit.element, activeGem, isGemActivated);
    return applyElementBonus(unit, bonus);
  });
  
  // ... rest of initialization using buffedPlayerUnits
}
```

**Acceptance Criteria:**
- ✅ Element bonuses applied before battle
- ✅ Stats correctly modified based on gem
- ✅ Works with no active gem (1.0x multiplier)
- ✅ Works after activation (removes bonuses)
- ✅ Pure function (no mutations)

---

## 🎯 Phase 3: Gem Selection Screen (1-2 hours)

### **Task 3.1: Create Gem Selection UI**

**File:** `src/screens/GemSelectScreen.tsx`

**Purpose:** Let player choose ONE gem after team building

**Component:**
```typescript
import React from 'react';
import type { ElementalGem, Element } from '../types/game.js';
import { ELEMENTAL_GEMS } from '../data/gems.js';

interface GemSelectScreenProps {
  onSelectGem: (gem: ElementalGem) => void;
}

export const GemSelectScreen: React.FC<GemSelectScreenProps> = ({ onSelectGem }) => {
  const gems = Object.values(ELEMENTAL_GEMS);
  
  // Element icons
  const getElementIcon = (element: Element): string => {
    const icons: Record<Element, string> = {
      Venus: '🌍',
      Mars: '🔥',
      Jupiter: '💨',
      Mercury: '💧',
      Moon: '🌙',
      Sun: '☀️',
    };
    return icons[element];
  };
  
  // Element colors
  const getElementColor = (element: Element): string => {
    const colors: Record<Element, string> = {
      Venus: 'bg-green-500/20 border-green-500',
      Mars: 'bg-red-500/20 border-red-500',
      Jupiter: 'bg-cyan-500/20 border-cyan-500',
      Mercury: 'bg-blue-500/20 border-blue-500',
      Moon: 'bg-purple-500/20 border-purple-500',
      Sun: 'bg-yellow-500/20 border-yellow-500',
    };
    return colors[element];
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔮 Choose Your Elemental Gem
          </h1>
          <p className="text-gray-400 text-lg">
            This gem will empower your team throughout your journey
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Units matching the gem's element gain maximum bonuses and elemental spells
          </p>
        </div>

        {/* Gem Grid (2x3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gems.map((gem) => (
            <div
              key={gem.element}
              className={`${getElementColor(gem.element)} border-2 rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform duration-200 cursor-pointer`}
              onClick={() => onSelectGem(gem)}
            >
              {/* Element Icon */}
              <div className="text-6xl text-center mb-4">
                {getElementIcon(gem.element)}
              </div>

              {/* Gem Name */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {gem.name}
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-center text-sm mb-4">
                {gem.description}
              </p>

              {/* Activation Ability */}
              <div className="text-center">
                <span className="text-yellow-400 font-semibold">
                  ⚡ {gem.activationAbility}
                </span>
              </div>

              {/* Select Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectGem(gem);
                }}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

**Acceptance Criteria:**
- ✅ Shows all 6 gems in grid
- ✅ Element icons and colors match theme
- ✅ Click to select gem
- ✅ Calls onSelectGem with chosen gem
- ✅ Beautiful, responsive design
- ✅ Accessible (keyboard navigation)

---

### **Task 3.2: Integrate Gem Selection into Game Flow**

**File:** `src/App.tsx`

**Add screen:**
```typescript
type AppScreen = 
  | 'menu'
  | 'starter_select'
  | 'gem_select' // ADD THIS (after starter_select)
  | 'opponent_select'
  | // ... rest
```

**After starter selection:**
```typescript
const handleStarterSelected = (starters: PlayerUnit[]) => {
  setPlayerTeam(starters);
  setScreen('gem_select'); // GO TO GEM SELECT, NOT OPPONENT SELECT
};
```

**Gem selection handler:**
```typescript
const handleGemSelected = (gem: ElementalGem) => {
  // Set active gem in controller
  const result = controller.setActiveGem(gem);
  if (!result.ok) {
    console.error('Failed to set gem:', result.error);
    return;
  }
  
  // Initialize opponent previews
  const initResult = controller.startRun(playerTeam, Date.now());
  if (initResult.ok) {
    const state = controller.getState();
    setPreviews(state.opponentPreviews);
    setScreen('opponent_select');
  }
};
```

**In render:**
```typescript
if (screen === 'gem_select') {
  return <GemSelectScreen onSelectGem={handleGemSelected} />;
}
```

**Acceptance Criteria:**
- ✅ Gem select appears after starter selection
- ✅ Gem select before opponent selection
- ✅ Selecting gem saves to controller
- ✅ Proceeds to opponent select after gem chosen
- ✅ Flow works smoothly

---

## 🎯 Phase 4: Save/Load Integration (30 min)

### **Task 4.1: Update SaveSystem**

**File:** `src/systems/SaveSystem.ts`

**Modify `GameStateSnapshot`:**
```typescript
export interface GameStateSnapshot {
  // ... existing fields
  readonly gemState: GemState; // ADD THIS
}
```

**Modify `SaveEnvelope`:**
```typescript
interface SaveEnvelope {
  // ... existing fields
  gemState: GemState; // ADD THIS
}
```

**Update save/load:**
- Include `gemState` in save envelope
- Restore `gemState` on load
- Backward compatibility: Default to `{ activeGem: null, isActivated: false }` if missing

**Acceptance Criteria:**
- ✅ Gem state saves to slot
- ✅ Gem state loads correctly
- ✅ Backward compatible (old saves work)
- ✅ Tests verify persistence

---

## 🎯 Phase 5: Testing (1-2 hours)

### **Task 5.1: Element System Tests**

**File:** `tests/systems/ElementSystem.test.ts` (create new)

**Cover:**
- calculateElementBonus() for all match types
- Matching element: 1.15x, spell = true
- Counter element: 0.95x, antiSpell = true
- Neutral element: 1.05x, no spells
- After activation: 1.0x, spells remain
- applyElementBonus() modifies stats correctly
- Edge cases (no gem, null gem)

**Target:** 20+ tests

---

### **Task 5.2: GameController Gem Tests**

**File:** `tests/core/GameController.gems.test.ts` (modify existing or create)

**Cover:**
- setActiveGem() works
- getGemState() returns state
- activateGem() sets flag
- activateGem() fails if already activated
- resetGem() resets flag
- Gem persists across battles

**Target:** 15+ tests

---

### **Task 5.3: GemSelectScreen Tests**

**File:** `tests/screens/GemSelectScreen.test.tsx`

**Cover:**
- Renders all 6 gems
- Clicking gem calls onSelectGem
- Element icons display correctly
- Accessible (keyboard, screen reader)

**Target:** 10+ tests

---

### **Task 5.4: Integration Tests**

**File:** `tests/integration/GemSystemIntegration.test.ts` (create new)

**Cover:**
- Full flow: Select gem → Start battle → Bonuses apply
- Activation removes bonuses
- Reset restores bonuses
- Counter elements work
- Save/load preserves gem

**Target:** 10+ tests

---

## ✅ Deliverables Checklist

### **Phase 1: Core Data Structures**
- [ ] Element types defined (6 elements)
- [ ] ElementalGem interface created
- [ ] GemState interface created
- [ ] PlayerUnit has element field
- [ ] gems.ts data catalog created
- [ ] GameController has gem methods

### **Phase 2: Element Bonus System**
- [ ] ElementSystem.ts created
- [ ] calculateElementBonus() works correctly
- [ ] applyElementBonus() modifies stats
- [ ] BattleSystem integration complete

### **Phase 3: Gem Selection Screen**
- [ ] GemSelectScreen.tsx created
- [ ] Shows all 6 gems beautifully
- [ ] Integrated into App.tsx flow
- [ ] Appears after starter select

### **Phase 4: Save/Load**
- [ ] Gem state persists
- [ ] Backward compatible

### **Phase 5: Testing**
- [ ] ElementSystem tests (20+)
- [ ] GameController tests (15+)
- [ ] GemSelectScreen tests (10+)
- [ ] Integration tests (10+)

### **Overall Verification**
- [ ] All tests passing (100%)
- [ ] TypeScript compiles (0 errors)
- [ ] No circular dependencies
- [ ] Manual testing: Gem flow works end-to-end

---

## 📊 Expected Impact

**Before:**
- Gem system implemented as inventory/collection
- No element matching mechanics
- No team-wide bonuses

**After:**
- ONE active gem chosen at start
- Team-wide bonuses based on element matching
- Strategic depth: Gem choice matters for team composition
- Matching units get +15% + spell
- Counter units get -5% + anti-spell
- Mid-battle activation mechanic
- Fully tested and integrated

---

## 🚀 Getting Started

**Acknowledgment:**
The previous implementation was well-coded (clean, tested, functional) but implemented the wrong mechanics. This task corrects the design to match the intended game system.

**Approach:**
1. Start with Phase 1 (data structures)
2. Build element bonus calculator (Phase 2)
3. Create beautiful gem selection UI (Phase 3)
4. Add persistence (Phase 4)
5. Comprehensive testing (Phase 5)

**When complete:**
- Report with verification results
- Show test counts (should be 55+ new tests)
- Confirm flow works: Starter select → Gem select → Opponent select → Battle (with bonuses)

---

## 💡 Future Enhancements (Not MVP)

**Level-Based Reselection:**
- Allow gem change at level 5
- Allow gem change at level 10

**Spell System:**
- Define actual spell effects (damage, heal, buff)
- Implement spell casting in battle
- Cooldowns, MP costs, etc.

**Gem Activation Abilities:**
- Implement actual activation effects per element
- Visual effects for activation
- Battle log messages

**But for MVP:** Focus on core mechanics (selection, bonuses, activation flag).

---

## 🎯 Success Criteria

✅ **Gem selection appears after starter select (once per run)**
✅ **ONE active gem affects entire team**
✅ **Element bonuses calculated correctly (matching/neutral/counter)**
✅ **Activation removes bonuses but keeps spell flags**
✅ **Gem resets every battle**
✅ **55+ tests added, all passing**
✅ **TypeScript compiles clean**
✅ **Save/load works**
✅ **Beautiful, accessible UI**

When all criteria met, system is **production-ready**! 🎮✨
