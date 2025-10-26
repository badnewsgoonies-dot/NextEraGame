# 🎮 TASK: Redesign Gem System (Global Party Buff + Battle Super Spell)

## 📋 Context

- **Project:** NextEraGame (C:\Dev\AiGames\NextEraGame)
- **Branch:** main (or create new branch)
- **Current State:** Gem system is 100% broken (wrong architecture)
- **New Design:** Global party buff selected at game start + battle super spell

---

## ⚠️ CRITICAL: Read First

**You are the IMPLEMENTATION CODER AI.**

Before starting, read:

1. `docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md` - Your role and patterns
2. `docs/ai/COMPREHENSIVE_TEMPLATE_SYSTEM.md` - Use Template 3 (System Creation)

**Your job:** Completely rebuild gem system with new architecture

**This is a MAJOR refactoring task:** 30-60 minutes estimated

---

## 🎯 New Gem System Design

### **Current (Broken) Design:**

- ❌ Gems equipped to individual units
- ❌ Gem activation happens in battle only
- ❌ No clear selection screen
- ❌ Confusing stat bonus system

### **New (Correct) Design:**

- ✅ **One gem selected at game start** (after roster selection, before first battle)
- ✅ **Global party-wide stat bonuses** based on elemental affinity
- ✅ **Grants spells** to units of matching element
- ✅ **Battle super spell** (one-time use per battle, cooldown after use)
- ✅ **Persistent across entire run** (until game over)

---

## 🌟 Gem Mechanics Specification

### **Elemental System:**

**Elements:** Fire, Water, Wind, Earth, Light (Sun), Dark (Moon)

**Affinity Chart:**

```
Water > Fire
Wind > Earth
Earth > Fire (or Fire > Wind - choose one)
Fire > Wind (or Earth > Fire - choose one)
Light <=> Dark (mutual counter)

Recommendation: Use standard Pokemon-style:
- Water > Fire
- Fire > Wind  
- Wind > Earth
- Earth > Water
- Light <=> Dark (mutual)
```

### **Stat Bonus Rules:**

When gem selected, ALL party members get bonuses based on their elemental affinity to gem:

**Same Element (Strong Affinity):**

- ATK: +15
- DEF: +10
- MATK: +15
- HP: +20
- MP: +15
- SPD: +5

**Neutral Element:**

- ATK: +5
- DEF: +3
- MATK: +5
- HP: +10
- MP: +5
- SPD: +2

**Counter Element (Weak Affinity):**

- ATK: -5
- DEF: -3
- MATK: -5
- HP: -10
- MP: 0
- SPD: -2

### **Spell Grants:**

**Same Element Units:**

- Grant 1 special offensive spell based on gem element
- Example: Fire Gem → Fire units get "Fireball" spell
- Spell costs MP, deals element-typed damage

**Counter Element Units:**

- Grant 1 special spell of THEIR element (compensation for stat penalty)
- Example: Fire Gem → Water units get "Water Blast" spell
- Adds strategic depth (trade-off decision)

**Neutral Element Units:**

- No special spells granted

### **Battle Super Spell:**

**Mechanics:**

- Appears as "Gem Super" button in battle action menu
- One-time use per battle
- After activation, button becomes "Gem (Used)" and is disabled
- Resets to available at start of next battle
- Powerful effect based on gem element

**Effects by Element:**

```
Fire Gem: AOE damage to all enemies (high power)
Water Gem: Full party heal + cleanse debuffs
Wind Gem: Party-wide speed buff + evasion boost
Earth Gem: Party-wide defense buff + barrier
Light Gem: Massive heal + revive fallen ally (if any)
Dark Gem: AOE damage + apply debuffs to all enemies
```

---

## 📦 Implementation Tasks

### **Phase 1: Create Gem Selection Screen (20-25 mins)**

#### **Task 1.1: Create GemSelectScreen Component**

**File:** `src/screens/GemSelectScreen.tsx` (NEW file)

**Requirements:**

- Display 6 gem options in grid (Fire, Water, Wind, Earth, Light, Dark)
- Each gem card shows:
  - Element name
  - Icon/emoji
  - Brief description
  - Preview of stat bonuses
  - Which spells will be granted
- Keyboard navigation (arrow keys, Enter to select)
- Mouse click to select
- Highlights hovered/focused gem
- "Confirm Selection" button (disabled until gem selected)
- Shows party roster with element types
- Visual affinity indicators (same/neutral/counter for each unit)

**Component Structure:**

```tsx
interface GemSelectScreenProps {
  playerUnits: PlayerUnit[];
  onGemSelected: (gemId: string) => void;
  onCancel: () => void;
}

export function GemSelectScreen({
  playerUnits,
  onGemSelected,
  onCancel
}: GemSelectScreenProps): React.ReactElement {
  // Implementation
}
```

**Styling:**

- Golden Sun aesthetic (match existing screens)
- Clear visual hierarchy
- Affinity color coding:
  - Strong: Green/Gold border
  - Neutral: Gray border
  - Weak: Red border

---

#### **Task 1.2: Create Gem Data File**

**File:** `src/data/gems.ts` (may already exist, update if so)

**Structure:**

```typescript
export interface Gem {
  id: string;
  element: 'Fire' | 'Water' | 'Wind' | 'Earth' | 'Light' | 'Dark';
  name: string;
  description: string;
  icon: string;
  strongBonus: StatBonus;
  neutralBonus: StatBonus;
  weakBonus: StatBonus;
  sameElementSpell: Spell;
  counterElementSpell: Spell;
  superSpell: SuperSpell;
}

interface StatBonus {
  atk: number;
  def: number;
  matk: number;
  hp: number;
  mp: number;
  spd: number;
}

interface Spell {
  id: string;
  name: string;
  description: string;
  mpCost: number;
  power: number;
  element: string;
  target: 'single' | 'all_enemies' | 'single_ally' | 'all_allies';
}

interface SuperSpell {
  id: string;
  name: string;
  description: string;
  effect: 'aoe_damage' | 'party_heal' | 'party_buff' | 'enemy_debuff';
  power: number;
}

export const GEMS: Gem[] = [
  {
    id: 'fire-gem',
    element: 'Fire',
    name: 'Mars Gem',
    description: 'Harness the power of flames',
    icon: '🔥',
    strongBonus: { atk: 15, def: 10, matk: 15, hp: 20, mp: 15, spd: 5 },
    neutralBonus: { atk: 5, def: 3, matk: 5, hp: 10, mp: 5, spd: 2 },
    weakBonus: { atk: -5, def: -3, matk: -5, hp: -10, mp: 0, spd: -2 },
    sameElementSpell: {
      id: 'fireball',
      name: 'Fireball',
      description: 'Launch a ball of fire',
      mpCost: 8,
      power: 50,
      element: 'Fire',
      target: 'single'
    },
    counterElementSpell: {
      id: 'water-blast',
      name: 'Water Blast',
      description: 'Unleash water pressure',
      mpCost: 8,
      power: 50,
      element: 'Water',
      target: 'single'
    },
    superSpell: {
      id: 'inferno',
      name: 'Inferno',
      description: 'Rain fire upon all enemies',
      effect: 'aoe_damage',
      power: 100
    }
  },
  // ... 5 more gems
];
```

**Create all 6 gems with proper data**

---

#### **Task 1.3: Add Element Field to PlayerUnit**

**File:** `src/types/game.ts`

**Change:**

```typescript
export interface PlayerUnit {
  // ... existing fields
  element: 'Fire' | 'Water' | 'Wind' | 'Earth' | 'Light' | 'Dark' | 'Neutral';
}
```

**Update all starter units in `src/data/starterUnits.ts`:**

- Assign elements based on role/character theme
- Ensure variety (not all same element)
- Example distribution:

  ```
  Fighter: Fire (2 units)
  Mage: Water (2 units)
  Tank: Earth (2 units)
  Ranger: Wind (2 units)
  Support: Light (2 units)
  Mixed: Dark (2 units)
  ```

---

#### **Task 1.4: Update GameController - Gem State**

**File:** `src/core/GameController.ts`

**Changes Required:**

**Add to GameState:**

```typescript
interface GameState {
  // ... existing fields
  selectedGem: Gem | null;
  gemSuperUsedThisBattle: boolean;
}
```

**Add methods:**

```typescript
// Select gem at game start
selectGem(gemId: string): Result<void, string> {
  const gem = GEMS.find(g => g.id === gemId);
  if (!gem) return Err('Gem not found');
  
  this.state.selectedGem = gem;
  this.applyGemBonusesToParty();
  this.grantGemSpells();
  
  return Ok(undefined);
}

// Apply stat bonuses to entire party
private applyGemBonusesToParty(): void {
  if (!this.state.selectedGem) return;
  
  this.state.party.forEach(unit => {
    const affinity = this.getAffinity(unit.element, this.state.selectedGem!.element);
    const bonus = affinity === 'strong' ? this.state.selectedGem!.strongBonus
                : affinity === 'neutral' ? this.state.selectedGem!.neutralBonus
                : this.state.selectedGem!.weakBonus;
    
    // Apply bonuses (modify base stats)
    unit.baseAtk += bonus.atk;
    unit.baseDef += bonus.def;
    // ... etc
  });
}

// Grant spells based on affinity
private grantGemSpells(): void {
  if (!this.state.selectedGem) return;
  
  this.state.party.forEach(unit => {
    const affinity = this.getAffinity(unit.element, this.state.selectedGem!.element);
    
    if (affinity === 'strong') {
      // Grant same element spell
      unit.abilities.push(this.state.selectedGem!.sameElementSpell);
    } else if (affinity === 'weak') {
      // Grant counter element spell (compensation)
      unit.abilities.push(this.state.selectedGem!.counterElementSpell);
    }
  });
}

// Calculate affinity
private getAffinity(unitElement: string, gemElement: string): 'strong' | 'neutral' | 'weak' {
  if (unitElement === gemElement) return 'strong';
  
  const counters = {
    'Water': 'Fire',
    'Fire': 'Wind',
    'Wind': 'Earth',
    'Earth': 'Water',
    'Light': 'Dark',
    'Dark': 'Light'
  };
  
  if (counters[unitElement] === gemElement) return 'weak';
  return 'neutral';
}

// Use gem super spell in battle
useGemSuper(): Result<SuperSpell, string> {
  if (!this.state.selectedGem) return Err('No gem selected');
  if (this.state.gemSuperUsedThisBattle) return Err('Already used this battle');
  
  this.state.gemSuperUsedThisBattle = true;
  return Ok(this.state.selectedGem.superSpell);
}

// Reset gem super at battle start
resetGemSuper(): void {
  this.state.gemSuperUsedThisBattle = false;
}
```

---

### **Phase 2: Integrate Gem Selection into Game Flow (10 mins)**

#### **Task 2.1: Update App.tsx - Add Gem Selection Screen**

**File:** `src/App.tsx`

**Add new screen to flow:**

**Current flow:**

```
Menu → Starter Selection → Battle Selection → Battle → Rewards → Equipment → Recruitment → Battle Selection
```

**New flow:**

```
Menu → Starter Selection → GEM SELECTION → Battle Selection → Battle → Rewards → Equipment → Recruitment → Battle Selection
```

**Changes:**

- Add `'gem-selection'` screen type
- Show GemSelectScreen after starter selection (first time only)
- Call `gameController.selectGem(gemId)` on selection
- Transition to battle selection after gem chosen

**Pseudocode:**

```tsx
// In App.tsx screen rendering
if (screen === 'gem-selection') {
  return (
    <GemSelectScreen
      playerUnits={gameController.getParty()}
      onGemSelected={(gemId) => {
        gameController.selectGem(gemId);
        setScreen('battle-selection'); // Proceed to game
      }}
      onCancel={() => setScreen('starter-selection')} // Go back
    />
  );
}
```

---

### **Phase 3: Update Battle Screen - Gem Super Button (15 mins)**

#### **Task 3.1: Add Gem Super Action to Battle**

**File:** `src/screens/BattleScreen.tsx`

**Changes:**

**Update ACTIONS array:**

```typescript
// Line ~81
const ACTIONS = ['Attack', 'Defend', 'Abilities', 'Gem Super', 'Items', 'Flee'] as const;
```

**Add gem super handler:**

```typescript
const handleGemSuperAction = useCallback(() => {
  if (!activeId) return;
  
  const result = gameController.useGemSuper();
  
  if (!result.ok) {
    console.warn(result.error);
    return; // Stay in menu
  }
  
  const superSpell = result.value;
  setPhase('animating');
  
  // Execute super spell effect
  executeGemSuper(superSpell, players, enemies);
  
  // Advance turn after animation
  setTimeout(() => {
    setPhase('resolving');
    advanceTurnPointer();
  }, ANIMATION_TIMING.GEM_SUPER_DURATION);
}, [activeId, gameController, players, enemies, advanceTurnPointer]);

// In action menu handler (line ~587)
} else if (label === 'Gem Super') {
  handleGemSuperAction();
}
```

**Disable button when used:**

```typescript
// In ActionMenu rendering
const gemUsed = gameController.getGemState().gemSuperUsedThisBattle;
const actions = ACTIONS.map(action => 
  action === 'Gem Super' && gemUsed ? 'Gem Super (Used)' : action
);
```

**Reset gem super at battle start:**

```typescript
// In battle initialization useEffect
useEffect(() => {
  gameController.resetGemSuper();
}, [gameController]);
```

---

#### **Task 3.2: Create executeGemSuper Function**

**File:** `src/systems/GemSuperSystem.ts` (NEW file)

**Requirements:**

- Pure function
- Takes super spell + player units + enemy units
- Returns updated units with effects applied
- Follows project patterns (Result types, pure functions)

**Structure:**

```typescript
import type { BattleUnit, SuperSpell } from '../types/game.js';
import { Result, Ok, Err } from '../utils/Result.js';

export function executeGemSuper(
  superSpell: SuperSpell,
  playerUnits: BattleUnit[],
  enemyUnits: BattleUnit[]
): Result<{ updatedPlayers: BattleUnit[], updatedEnemies: BattleUnit[] }, string> {
  
  switch (superSpell.effect) {
    case 'aoe_damage':
      // Apply damage to all enemies
      const damagedEnemies = enemyUnits.map(e => ({
        ...e,
        currentHp: Math.max(0, e.currentHp - superSpell.power)
      }));
      return Ok({ updatedPlayers: playerUnits, updatedEnemies: damagedEnemies });
      
    case 'party_heal':
      // Heal all players
      const healedPlayers = playerUnits.map(p => ({
        ...p,
        currentHp: Math.min(p.maxHp, p.currentHp + superSpell.power)
      }));
      return Ok({ updatedPlayers: healedPlayers, updatedEnemies: enemyUnits });
      
    case 'party_buff':
      // Apply stat buffs (use BuffSystem)
      // ...
      
    case 'enemy_debuff':
      // Apply debuffs (use BuffSystem)
      // ...
      
    default:
      return Err('Unknown super spell effect');
  }
}
```

---

### **Phase 4: Testing (10-15 mins)**

#### **Task 4.1: Create GemSelectScreen Tests**

**File:** `tests/screens/GemSelectScreen.test.tsx` (NEW file)

**Required tests (10+ tests):**

- Renders 6 gem options
- Can select gem with keyboard
- Can select gem with mouse
- Shows confirm button disabled initially
- Confirm button enabled after selection
- Shows affinity indicators for party
- Calls onGemSelected with correct gem ID
- Can cancel and return to previous screen
- Shows stat bonus previews
- Shows spell grant previews

---

#### **Task 4.2: Update Existing Battle Tests**

**File:** `tests/screens/BattleScreen.test.tsx`

**Remove old gem activation tests** (lines 880-1020):

- Delete all 4 failing gem tests (outdated system)

**Add new gem super tests:**

- Gem Super button appears in action menu
- Gem Super executes effect when selected
- Gem Super becomes disabled after use
- Gem Super resets at next battle start

---

#### **Task 4.3: Add Integration Tests**

**File:** `tests/integration/GemSystem.test.ts` (NEW file)

**Test full gem flow:**

- Select gem → stat bonuses applied to party
- Select gem → spells granted to units
- Use gem super in battle → effect executes
- Gem super cooldown per battle works
- Affinity calculation correct (strong/neutral/weak)

---

## ✅ Acceptance Criteria

### **Gem Selection Screen:**

- [ ] Screen exists and renders correctly
- [ ] Shows all 6 gems with icons, names, descriptions
- [ ] Keyboard and mouse navigation works
- [ ] Shows party affinity indicators
- [ ] Confirm button only enabled when gem selected
- [ ] Transitions to battle selection after selection

### **Game State:**

- [ ] Selected gem stored in GameController
- [ ] Stat bonuses applied to ALL party members
- [ ] Bonuses vary by affinity (strong/neutral/weak)
- [ ] Spells granted to same element units
- [ ] Spells granted to counter element units (compensation)
- [ ] No spells granted to neutral element units

### **Battle Integration:**

- [ ] "Gem Super" appears in battle action menu
- [ ] Gem Super executes effect when selected
- [ ] Gem Super button shows "(Used)" after activation
- [ ] Gem Super disabled after use (cannot use again)
- [ ] Gem Super resets to available at next battle start

### **Testing:**

- [ ] GemSelectScreen has 10+ tests (all passing)
- [ ] Battle tests updated (old gem tests removed)
- [ ] New gem super tests added (all passing)
- [ ] Integration tests cover full gem flow
- [ ] All existing tests still pass (no regressions)

### **Code Quality:**

- [ ] TypeScript compiles (0 errors)
- [ ] Follows project patterns (Result types, pure functions)
- [ ] No circular dependencies
- [ ] Code is readable and well-documented

---

## 🚫 What NOT to Do

### **DO NOT:**

- ❌ Keep old gem system code (delete it)
- ❌ Allow gem selection mid-game (only at start)
- ❌ Allow gem swapping (one gem per run)
- ❌ Give gem super unlimited uses (one per battle)
- ❌ Apply bonuses to only some units (must be ALL)

### **DO:**

- ✅ Delete old GemActivationSystem code
- ✅ Remove old gem-related battle UI
- ✅ Update all relevant tests
- ✅ Make gem selection mandatory (can't skip)
- ✅ Apply bonuses immediately on selection

---

## ⏱️ Time Estimate

- **Phase 1:** 20-25 minutes (gem selection screen + data)
- **Phase 2:** 10 minutes (integrate into game flow)
- **Phase 3:** 15 minutes (battle super spell button)
- **Phase 4:** 10-15 minutes (testing)
- **Total:** 55-65 minutes

---

## 📋 Completion Report Format

```markdown
## ✅ Gem System Redesign Complete

### New Files Created:
- `src/screens/GemSelectScreen.tsx` - Gem selection UI
- `src/data/gems.ts` - Gem definitions (6 gems)
- `src/systems/GemSuperSystem.ts` - Super spell execution
- `tests/screens/GemSelectScreen.test.tsx` - [X] tests
- `tests/integration/GemSystem.test.ts` - [Y] tests

### Files Modified:
- `src/types/game.ts` - Added element field to PlayerUnit
- `src/data/starterUnits.ts` - Assigned elements to all 12 units
- `src/core/GameController.ts` - Added gem state management
- `src/App.tsx` - Added gem selection screen to flow
- `src/screens/BattleScreen.tsx` - Added Gem Super button
- `tests/screens/BattleScreen.test.tsx` - Removed old gem tests

### Files Deleted:
- `src/systems/GemActivationSystem.ts` (OLD)
- `src/components/battle/GemConfirmPanel.tsx` (OLD)
- `src/data/gemActivations.ts` (OLD)

### Test Results:
- New tests added: [X]
- All tests passing: [YYYY/YYYY]
- TypeScript: 0 errors
- Manual verification: ✅ Complete

### Game Flow Verified:
✅ Starter selection → Gem selection → Battle
✅ Stat bonuses applied correctly
✅ Spells granted to appropriate units
✅ Gem Super works in battle
✅ Gem Super cooldown works
✅ No regressions in existing features

### Notes:
[Any challenges, decisions made, or observations]
```

---

## 🎮 Manual Testing Checklist

After implementation, manually test:

1. **Start new game:**
   - [ ] Gem selection screen appears after starter selection
   - [ ] Can see all 6 gems
   - [ ] Affinity indicators show for party

2. **Select each gem type:**
   - [ ] Fire gem: bonuses + spells granted correctly
   - [ ] Water gem: bonuses + spells granted correctly
   - [ ] Wind gem: bonuses + spells granted correctly
   - [ ] Earth gem: bonuses + spells granted correctly
   - [ ] Light gem: bonuses + spells granted correctly
   - [ ] Dark gem: bonuses + spells granted correctly

3. **In battle:**
   - [ ] "Gem Super" appears in action menu
   - [ ] Selecting Gem Super executes effect
   - [ ] Button shows "(Used)" after activation
   - [ ] Cannot use again same battle
   - [ ] Resets in next battle

4. **Verify affinity:**
   - [ ] Same element units: high bonuses + spell
   - [ ] Neutral element units: small bonuses + no spell
   - [ ] Counter element units: penalties + spell

---

**Good luck! This is a substantial refactor but will fix the gem system completely.** 🚀
