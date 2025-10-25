# Viewport Layout Fix Task

**Status**: Ready for Graphics AI  
**Priority**: HIGH (Blocking gameplay - buttons inaccessible)  
**Estimated Scope**: 6-8 screen adjustments  
**Assigned To**: Graphics AI

---

## Problem

Graphics AI implemented fixed 1280x720px viewport (`GameContainer`), but didn't adjust screen layouts. Many screens have too much vertical content, causing:
- **Critical**: Action buttons cut off at bottom (can't proceed)
- **UX Issue**: Content overflow without scrolling capability
- **Inconsistent**: Some screens fit, others don't

**Affected Screens:**
1. StarterSelectScreen (12 unit grid + formation + buttons)
2. OpponentSelectScreen (3 opponent cards + details + buttons)
3. RecruitScreen (defeated enemies grid + team + buttons)
4. EquipmentScreen (4 units + equipment slots + inventory + buttons)
5. RosterManagementScreen (active party + bench + swap UI + buttons)
6. InventoryScreen (items list + equipment + buttons)

**Working Screens:**
- MainMenuScreen (centered, minimal content)
- BattleScreen (designed for fixed viewport)
- RewardsScreen (centered, minimal content)
- GemSelectScreen (centered, minimal content)
- SettingsScreen (simple form)

---

## Solution Strategy

### Core Approach
1. **Fixed Header** - Title and key info stay visible at top
2. **Scrollable Content Area** - Main content in `overflow-y-auto` container
3. **Fixed Footer** - Action buttons always visible at bottom
4. **Reduce Spacing** - Tighten padding/margins to fit more content
5. **Compact Layouts** - Smaller grids, tighter spacing

### Layout Pattern
```tsx
<div className="h-full w-full flex flex-col">
  {/* Fixed Header - ~80-100px */}
  <div className="flex-shrink-0 p-4">
    <h1>Screen Title</h1>
    <p>Description</p>
  </div>

  {/* Scrollable Content - fills remaining space */}
  <div className="flex-1 overflow-y-auto px-4 py-2">
    {/* All content here */}
  </div>

  {/* Fixed Footer - ~80-100px */}
  <div className="flex-shrink-0 p-4 border-t border-gray-700">
    <button>Cancel</button>
    <button>Continue</button>
  </div>
</div>
```

### Height Budget (720px total)
- Header: 80-100px
- Footer: 80-100px
- Content: ~520-560px (scrollable if needed)

---

## Phase 1: StarterSelectScreen

### Current Issues
- Header: 120px (title + counter + "Ready" message)
- Unit grid: 12 cards in 3 columns = ~600px (200px per row × 3 rows)
- Formation display: 200px (h-48 + padding)
- Action buttons: 80px
- Keyboard hints: 40px
- **Total: ~1040px** (exceeds 720px by 320px!)

### Fixes
1. Reduce header padding: `mb-8` → `mb-4`
2. Compact unit grid: `gap-4` → `gap-2`, reduce card padding
3. Make formation display optional/collapsible
4. Move buttons to fixed footer
5. Remove keyboard hints (or make floating tooltip)

### Implementation
```tsx
<div className="h-full w-full flex flex-col bg-gray-50 dark:bg-gray-900">
  {/* Fixed Header */}
  <div className="flex-shrink-0 p-4">
    <h1 className="text-3xl font-bold mb-1">Choose Your Team</h1>
    <p className="text-sm">Select exactly 4 units</p>
    <div className="text-xl font-bold mt-2">
      Selected: {selectedUnits.size}/4
      {canStart && <span className="text-green-500 ml-2">✓ Ready!</span>}
    </div>
  </div>

  {/* Scrollable Content */}
  <div className="flex-1 overflow-y-auto px-4 py-2">
    {/* Unit grid - compact */}
    <div className="grid grid-cols-3 gap-2 mb-4">
      {STARTER_CATALOG.map(...)}
    </div>
    
    {/* Formation - compact or hidden */}
    {selectedUnits.size > 0 && (
      <div className="h-32 relative">
        {/* Smaller formation display */}
      </div>
    )}
  </div>

  {/* Fixed Footer */}
  <div className="flex-shrink-0 flex justify-between p-4 border-t border-gray-600">
    <button onClick={onCancel}>← Back</button>
    <button onClick={handleStart} disabled={!canStart}>
      Start Journey →
    </button>
  </div>
</div>
```

---

## Phase 2: OpponentSelectScreen

### Current Issues
- Header: 100px
- 3 opponent cards: ~300px each in grid
- Difficulty indicators: part of cards
- Action buttons: 80px
- **Total: ~1080px** (exceeds by 360px!)

### Fixes
1. Make opponent grid scrollable
2. Reduce card heights: compact stat displays
3. Fix header and buttons
4. Consider horizontal scrolling if needed

### Implementation
```tsx
<div className="h-full w-full flex flex-col">
  {/* Header */}
  <div className="flex-shrink-0 p-4">
    <h1 className="text-3xl font-bold">Battle #{battleIndex + 1}</h1>
    <p className="text-sm">Choose your opponent</p>
  </div>

  {/* Scrollable Opponents */}
  <div className="flex-1 overflow-y-auto px-4 py-2">
    <div className="grid grid-cols-1 gap-3">
      {previews.map(...)}
    </div>
  </div>

  {/* Footer */}
  <div className="flex-shrink-0 p-4 border-t">
    <button onClick={onCancel}>← Back to Menu</button>
  </div>
</div>
```

---

## Phase 3: RecruitScreen

### Current Issues
- Header: 120px
- Defeated enemies grid: 3 columns × variable rows
- Current team display: 200px
- Replacement UI when full: 150px
- Action buttons: 80px
- **Total: Variable, often exceeds 720px**

### Fixes
1. Compact header: `mb-8` → `mb-3`
2. Scrollable enemies grid
3. Show current team in footer (always visible)
4. Fix buttons in footer
5. Smaller enemy cards

---

## Phase 4: EquipmentScreen

### Current Issues
- Header: 80px
- 4 team members × 200px each = 800px
- Each has 3 equipment slots + stats
- Available equipment list below
- Continue button at bottom
- **Total: ~1200px+** (exceeds by 480px!)

### Fixes
1. Scrollable team list
2. Collapsible equipment sections (accordion)
3. Fix continue button
4. Reduce unit card padding

### Implementation
```tsx
<div className="h-full w-full flex flex-col">
  <div className="flex-shrink-0 p-4">
    <h1 className="text-3xl">⚔️ Equipment</h1>
  </div>

  {/* Scrollable Team + Equipment */}
  <div className="flex-1 overflow-y-auto px-4">
    {team.map(unit => (
      <div className="bg-gray-800 rounded p-3 mb-2">
        <h3>{unit.name}</h3>
        {/* Compact equipment slots */}
      </div>
    ))}
  </div>

  <div className="flex-shrink-0 p-4 border-t">
    <button onClick={onContinue}>Continue →</button>
  </div>
</div>
```

---

## Phase 5: RosterManagementScreen

### Current Issues
- Header: 100px
- Active party (4 units): ~400px
- Bench display: Variable
- Swap interface: 100px
- Continue button: 80px
- **Total: Variable, often 900px+**

### Fixes
1. Side-by-side layout for active/bench (horizontal)
2. Scrollable benches
3. Fix header and continue button
4. Compact unit cards

---

## Phase 6: InventoryScreen

### Current Issues
- Header: 80px
- Item categories: Variable
- Item list: Variable rows
- Equipment section: Variable
- Close button: 80px
- **Total: Highly variable**

### Fixes
1. Tabbed or accordion interface (items vs equipment)
2. Scrollable lists
3. Fix header and close button
4. Compact item rows

---

## Common Patterns

### Spacing Adjustments
```css
/* Old */
p-6  /* 24px padding */
mb-8 /* 32px margin-bottom */
gap-6 /* 24px gap */

/* New */
p-4  /* 16px padding */
mb-3 /* 12px margin-bottom */
gap-2 /* 8px gap */
```

### Header Sizes
```css
/* Old */
text-4xl /* 36px */

/* New */
text-3xl /* 30px - saves 6px per title */
```

### Button Sizes
```css
/* Old */
px-8 py-4 /* Large touch targets */

/* New */
px-6 py-3 /* Slightly smaller, still accessible */
```

---

## Testing Checklist

For each screen, verify:
- [ ] Header visible at top
- [ ] Buttons visible at bottom (CRITICAL)
- [ ] Content scrolls smoothly if needed
- [ ] No content cut off without scroll
- [ ] Total height ≤ 720px
- [ ] Buttons always clickable
- [ ] Keyboard navigation still works
- [ ] Responsive to different aspect ratios

---

## Implementation Order

1. **StarterSelectScreen** (most complex, sets pattern)
2. **OpponentSelectScreen** (similar to starter select)
3. **EquipmentScreen** (critical for progression)
4. **RecruitScreen** (similar to equipment)
5. **RosterManagementScreen** (complex swapping UI)
6. **InventoryScreen** (least critical, optional screen)

---

## Success Criteria

✅ All screens fit within 1280x720px viewport  
✅ Action buttons always accessible (no cutting off)  
✅ Content scrolls internally where needed  
✅ GameContainer never scrolls  
✅ Professional, polished feel  
✅ All screens manually tested  

---

## Files to Modify

1. `src/screens/StarterSelectScreen.tsx`
2. `src/screens/OpponentSelectScreen.tsx`
3. `src/screens/RecruitScreen.tsx`
4. `src/screens/EquipmentScreen.tsx`
5. `src/screens/RosterManagementScreen.tsx`
6. `src/screens/InventoryScreen.tsx`

---

## Notes

- Keep `GameContainer` unchanged (1280x720px is correct)
- Use `flex flex-col` + `flex-1` + `overflow-y-auto` pattern
- Test with many items/units to ensure scroll works
- Consider mobile/responsive scaling (GameContainer handles this)
- Maintain Golden Sun aesthetic (compact is good!)
