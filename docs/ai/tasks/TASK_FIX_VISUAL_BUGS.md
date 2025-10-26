# 🎨 TASK: Fix Visual Bugs & UI Polish

## 📋 Context

- **Project:** NextEraGame (C:\Dev\AiGames\NextEraGame)
- **Branch:** main (or create new branch)
- **Current State:** Game functional but has multiple visual/UI bugs
- **Role:** Graphics/Visual polish work

---

## ⚠️ CRITICAL: Read First

**You are the GRAPHICS CODER AI.**

Before starting, read:

1. `docs/ai/GRAPHICS_ONBOARDING.md` - Your role and patterns
2. This task file

**Your job:** Fix visual bugs and polish UI elements

**You will NOT:** Change game logic, modify battle systems, or alter core functionality

---

## 🎯 Objective

Fix 6 visual bugs affecting UX quality across multiple screens.

---

## 🐛 Bug List & Fixes

### **Bug #1: StarterSelectScreen - Grid Selection Limited** 🔴

**Issue:**

- Cannot select units past first 2 rows (row 1-2 work, row 3-4 don't respond)
- Animation/selection feedback missing at bottom of screen
- Units in bottom rows cannot be clicked or navigated to

**File:** `src/screens/StarterSelectScreen.tsx`

**Investigation Required:**

1. Check if grid layout is cutting off bottom rows
2. Verify keyboard navigation reaches all 12 units
3. Check if click handlers bound to all unit cards
4. Verify scrolling/overflow settings on grid container

**Likely Causes:**

- Grid container has fixed height that cuts off bottom
- CSS overflow hidden preventing interaction
- Click event listeners only on first N units
- Z-index issues with bottom cards

**Fix Approach:**

```typescript
// Check grid container styling
// Ensure grid shows all 12 units (3 rows of 4 or 4 rows of 3)
// Verify gridRef properly scrolls or expands
// Test keyboard navigation cycles through all units
```

**Acceptance:**

- [ ] All 12 starter units visible
- [ ] Can click any unit in any row
- [ ] Keyboard navigation reaches all units
- [ ] Selection animation visible on all units

---

### **Bug #2: Battle Opponent Selection - Ugly Navigation Instructions** 🟡

**Issue:**

- Bottom navigation text "Use ← and → to navigate" looks dated
- Poor contrast/visibility
- Doesn't match Golden Sun aesthetic

**File:** `src/screens/BattleSelectionScreen.tsx` or `src/screens/OpponentSelectionScreen.tsx`

**Current (Bad):**

```text
Use ← and → to navigate
```

**Desired (Good):**

```text
Golden Sun style:
- Semi-transparent panel
- Better font styling
- Icon-based hints instead of arrow text
- Matches existing UI panels
```

**Fix Approach:**

```tsx
// Replace plain text with styled component
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 
  bg-gradient-to-b from-blue-900/95 to-blue-950/95 
  border-2 border-yellow-500/80 rounded-lg px-6 py-3
  backdrop-blur-sm shadow-2xl">
  <div className="text-sm text-gray-300 text-center flex items-center gap-3">
    <span className="text-yellow-400">◄</span>
    <span>Navigate</span>
    <span className="text-yellow-400">►</span>
    <span className="mx-2">|</span>
    <span className="text-green-400">Enter</span>
    <span>Select</span>
  </div>
</div>
```

**Acceptance:**

- [ ] Navigation hint styled like other UI panels
- [ ] Matches Golden Sun aesthetic
- [ ] Better visibility/contrast
- [ ] Uses icon-style arrows or unicode glyphs

---

### **Bug #3: Battle Items Menu - Potion Selection Breaks UI** 🔴

**Issue:**

- Selecting item from Items menu breaks UI layout
- Shows "CHOOSE ALLY" menu overlapping item selection
- Item menu and target selection panels conflict
- Screenshots 3/4/5 show the broken state

**File:** `src/screens/BattleScreen.tsx`

**Problem:**

- When player selects item → should show ally targeting
- But item menu panel stays open
- Target selection panel appears on top
- Creates visual clutter and confusion

**Current Flow (Broken):**

```text
1. Select "Items" action
2. Item menu appears (✅ correct)
3. Select specific item (e.g., Health Potion)
4. ❌ Item menu STAYS visible
5. ❌ "CHOOSE ALLY" menu appears overlapping
6. ❌ Both panels visible = broken UI
```

**Correct Flow:**

```text
1. Select "Items" action
2. Item menu appears
3. Select specific item
4. ✅ Item menu CLOSES
5. ✅ "CHOOSE ALLY" menu appears in same location
6. ✅ Clean transition, one menu at a time
```

**Fix Approach:**

```typescript
// In BattleScreen.tsx, when item selected:
const handleItemSelect = (index: number) => {
  const item = consumables[index];
  setSelectedItem(item);
  setPhase('item-targeting'); // This should hide item menu
  // Make sure phase === 'item-menu' vs 'item-targeting' controls visibility
};

// In render, ensure only ONE menu visible:
{phase === 'item-menu' && <ItemMenu />}  // Show item list
{phase === 'item-targeting' && <AllyTargetMenu />}  // Show ally selection
// NOT both at once!
```

**Acceptance:**

- [ ] Item menu closes when item selected
- [ ] Ally targeting menu appears in clean transition
- [ ] No overlapping panels
- [ ] Can navigate allies and use item
- [ ] ESC cancels and returns to item menu

---

### **Bug #4: Equipment Screen - Ugly Layout** 🟡

**Issue:** (Image 6 - Equipment Management screen)

- Layout is plain/ugly
- Doesn't match Golden Sun aesthetic
- Text formatting poor
- No visual polish

**File:** `src/screens/EquipmentScreen.tsx`

**Current Issues:**

- Plain text labels
- No decorative elements
- Poor spacing/alignment
- Doesn't feel like Golden Sun

**Improvements Needed:**

```tsx
// Add decorative borders
// Use gradient backgrounds for unit panels
// Add icons for equipment slots (⚔️ weapon, 🛡️ armor, 💍 accessory, 💎 gem)
// Better color coding
// More visual hierarchy
```

**Example Panel Style:**

```tsx
<div className="bg-gradient-to-b from-slate-800 to-slate-900 
  border-2 border-purple-500/80 rounded-xl p-6 shadow-xl">
  <div className="flex items-center gap-3 mb-4">
    <div className="text-2xl">👤</div>
    <h3 className="text-xl font-bold text-yellow-300">{unit.name}</h3>
  </div>
  
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-gray-400 flex items-center gap-2">
        <span>⚔️</span> Weapon:
      </span>
      <span className="text-yellow-200">{weapon.name || 'None'}</span>
    </div>
    {/* More slots... */}
  </div>
</div>
```

**Acceptance:**

- [ ] Uses gradient panels matching other screens
- [ ] Icons for equipment slots
- [ ] Better spacing and alignment
- [ ] Feels polished and cohesive with game aesthetic

---

### **Bug #5: Equipment Screen - Scrolling Issues** 🟡

**Issue:** (Image 7)

- Scrolling behavior janky or broken
- Units list may overflow without proper scroll
- Not a critical bug but annoying UX

**File:** `src/screens/EquipmentScreen.tsx`

**Investigation:**

1. Check if container has `overflow-y-auto` or `overflow-y-scroll`
2. Verify max-height set on scrollable region
3. Test if scrollbar appears when needed
4. Check if keyboard navigation scrolls properly

**Fix:**

```tsx
// Ensure scrollable container
<div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500">
  {party.map(unit => (
    <UnitEquipmentPanel key={unit.id} unit={unit} />
  ))}
</div>
```

**Acceptance:**

- [ ] Smooth scrolling when units overflow
- [ ] Scrollbar visible and styled
- [ ] Keyboard navigation auto-scrolls to focused unit
- [ ] No content cut off

---

### **Bug #6: Recruitment Screen - Circles Instead of Sprites** 🔴

**Issue:** (Image 8)

- Recruited units appear as colored circles
- Should show actual unit sprites (like in starter selection)
- Inconsistent with rest of UI

**File:** `src/screens/RecruitmentScreen.tsx` or `src/components/UnitCard.tsx`

**Problem:**

- Recruitment screen not loading sprites
- Fallback to circle placeholders
- Sprites work in starter selection but not recruitment

**Investigation:**

1. Check if `UnitCard` component used in both screens
2. Verify sprite paths exist for recruited units
3. Check if sprite loading conditional or missing
4. Compare with working `StarterSelectScreen`

**Likely Causes:**

- Sprite path wrong for recruited units
- Conditional rendering skipping sprite
- Image loading error (check console)
- Different component used for recruitment

**Fix Approach:**

```typescript
// In UnitCard.tsx or RecruitmentScreen.tsx
// Ensure sprite rendering for ALL units:

const spriteUrl = unit.spriteUrl || getUnitSprite(unit.role, unit.name);

<div className="w-16 h-16 relative">
  {spriteUrl ? (
    <img 
      src={spriteUrl} 
      alt={unit.name}
      className="w-full h-full object-contain"
      onError={(e) => {
        console.error('Sprite load failed:', spriteUrl);
        // Fallback to circle only on error
      }}
    />
  ) : (
    // Circle fallback only if no sprite URL
    <div className={`w-full h-full rounded-full bg-${getRoleColor(unit.role)}`} />
  )}
</div>
```

**Reference Working Code:**

- `src/screens/StarterSelectScreen.tsx` - Units show sprites correctly
- `src/components/UnitCard.tsx` - Check if sprite rendering differs

**Acceptance:**

- [ ] All recruited units show sprites
- [ ] No circles (unless sprite missing from assets)
- [ ] Consistent with starter selection screen
- [ ] Sprites load properly

---

## 🎯 Priority Order

**Critical (Do First):**

1. ✅ Bug #3 - Item menu breaking UI (blocks gameplay)
2. ✅ Bug #1 - Cannot select units (blocks game start)
3. ✅ Bug #6 - Sprites missing (visual consistency)

**High (Do Next):**
4. ✅ Bug #2 - Ugly navigation text (polish)
5. ✅ Bug #4 - Equipment screen ugly (polish)

**Medium (If Time):**
6. ✅ Bug #5 - Scrolling issues (minor UX)

---

## ✅ Acceptance Criteria

### **Overall:**

- [ ] All 6 bugs fixed
- [ ] NO game logic changed
- [ ] TypeScript compiles (0 errors)
- [ ] ALL existing tests still pass
- [ ] Manual testing confirms fixes

### **Per Bug:**

- [ ] Bug #1: All units selectable
- [ ] Bug #2: Navigation hints styled properly
- [ ] Bug #3: Item selection → ally targeting works cleanly
- [ ] Bug #4: Equipment screen polished
- [ ] Bug #5: Scrolling smooth
- [ ] Bug #6: Sprites show for recruited units

---

## 🧪 Testing Strategy

### **Manual Testing Required:**

**Bug #1 Test:**

```text
1. Start game
2. Go to starter selection
3. Try clicking units in rows 3-4
4. Try keyboard navigation (arrow keys) through all 12 units
5. Verify all units respond to input
```

**Bug #2 Test:**

```text
1. Reach opponent selection screen
2. Check bottom navigation hint styling
3. Verify matches Golden Sun aesthetic
```

**Bug #3 Test:**

```text
1. Start battle
2. Select "Items" action
3. Select a Health Potion
4. Verify item menu closes
5. Verify ally targeting menu appears
6. Select ally and use item
7. Press ESC to cancel (should go back cleanly)
```

**Bug #4 Test:**

```text
1. Win a battle
2. Go to equipment screen
3. Check visual polish matches other screens
```

**Bug #5 Test:**

```text
1. Equipment screen with 4+ units
2. Scroll up/down
3. Verify smooth scrolling
```

**Bug #6 Test:**

```text
1. Win battle
2. Go to recruitment screen
3. Verify units show sprites, not circles
```

---

## 🚫 What NOT to Change

### **DO NOT Modify:**

- ❌ Battle logic or combat systems
- ❌ Game state management
- ❌ Item functionality (just fix UI)
- ❌ Unit selection logic (just fix visibility)
- ❌ Any systems beyond visual rendering

### **ONLY Modify:**

- ✅ CSS/styling
- ✅ Component rendering (visibility, layout)
- ✅ Visual transitions and animations
- ✅ UI panel positioning and z-index
- ✅ Sprite loading and display
- ✅ Keyboard navigation feedback

---

## ⏱️ Time Estimate

- **Bug #1 (Grid Selection):** 15-20 mins
- **Bug #2 (Nav Hints):** 5-10 mins
- **Bug #3 (Item UI):** 15-20 mins
- **Bug #4 (Equipment Polish):** 20-25 mins
- **Bug #5 (Scrolling):** 5-10 mins
- **Bug #6 (Sprites):** 10-15 mins
- **Testing:** 15 mins
- **Total:** 85-115 minutes (~1.5-2 hours)

---

## 📋 Completion Report Format

```markdown
## ✅ Visual Bug Fixes Complete

### Bugs Fixed:

**Bug #1 - StarterSelectScreen Grid:**
- Fixed: [What was wrong]
- Solution: [What you changed]
- File(s): [Modified files]

**Bug #2 - Navigation Hints:**
- Fixed: [What was wrong]
- Solution: [What you changed]
- File(s): [Modified files]

**Bug #3 - Item Menu UI:**
- Fixed: [What was wrong]
- Solution: [What you changed]
- File(s): [Modified files]

**Bug #4 - Equipment Screen:**
- Fixed: [What was wrong]
- Solution: [What you changed]
- File(s): [Modified files]

**Bug #5 - Scrolling:**
- Fixed: [What was wrong]
- Solution: [What you changed]
- File(s): [Modified files]

**Bug #6 - Recruited Sprites:**
- Fixed: [What was wrong]
- Solution: [What you changed]
- File(s): [Modified files]

### Verification:
- [ ] All 6 bugs manually tested and fixed
- [ ] TypeScript: 0 errors
- [ ] Tests: All passing
- [ ] No game logic changed
- [ ] Visual consistency maintained

### Screenshots:
[Provide before/after screenshots if possible]

### Notes:
[Any observations, challenges, or recommendations]
```

---

## 🎨 Style Guidelines

**Golden Sun Aesthetic:**

- Gradient panels: `from-blue-900/95 to-blue-950/95`
- Borders: `border-4 border-yellow-500/80`
- Text colors: Yellow headings, gray body, colored stats
- Backdrop blur on panels: `backdrop-blur-sm`
- Shadows: `shadow-2xl`
- Rounded corners: `rounded-xl`

**Consistency:**

- Match existing BattleScreen UI style
- Match existing ActionMenu component
- Use same color palette throughout
- Maintain visual hierarchy

---

**Good luck! Focus on visual polish while preserving functionality.** 🎨✨
