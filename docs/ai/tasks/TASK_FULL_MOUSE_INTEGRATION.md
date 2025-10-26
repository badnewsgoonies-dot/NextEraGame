# Task: Full Mouse/Click Integration

**Assigned To:** Implementation Coder AI  
**Priority:** CRITICAL - Blocks user experience  
**Estimated Complexity:** Medium (3-4 hours)  
**Created:** 2025-10-26

## Problem Statement

The game has inconsistent input handling across screens. Users can click some elements but must use keyboard for others, creating roadblocks where the game becomes unplayable without BOTH input methods. This is unacceptable UX.

**Specific Examples:**
- Battle screen: Can click "Attack" button but must press Enter to select enemy (clicking enemy doesn't work)
- Similar patterns exist across multiple screens
- Users get stuck if they don't have both mouse and keyboard available

## Requirements

**PRIMARY GOAL:** Every interactive element in the game must be fully functional with mouse clicks alone AND keyboard alone. No mixing required.

### Scope: All Interactive Elements

1. **Battle Screen (src/screens/BattleScreen.tsx)**
   - Enemy targeting: Click enemy portraits to select target
   - Attack/Item/Ability buttons: Already clickable, verify confirmation works
   - Item selection: Click items in inventory menu
   - Item targeting: Click units for item targeting (healing, buffs)
   - Ability targeting: Click enemies/allies for ability targets
   - Gem super spell targeting: Click to select target (if applicable)
   - Confirmation dialogs: Click Yes/No buttons

2. **Starter Select Screen (src/screens/StarterSelectScreen.tsx)**
   - Unit cards: Click to select/deselect units
   - Confirm button: Click to proceed
   - Back button: Click to return to menu

3. **Opponent Select Screen (src/screens/OpponentSelectScreen.tsx)**
   - Opponent cards: Click to select opponent
   - Difficulty indicators: Should show info on hover/click
   - Confirm/Back buttons: Click functionality

4. **Gem Select Screen (src/screens/GemSelectScreen.tsx)**
   - Gem cards: Click to select gem
   - Affinity preview: Update on hover
   - Confirm/Back buttons: Click functionality

5. **Equipment Screen (src/screens/EquipmentScreen.tsx)**
   - Unit list: Click to select unit
   - Equipment slots: Click to open equipment menu
   - Equipment items: Click to equip/unequip
   - Back button: Click functionality

6. **Inventory Screen (src/screens/InventoryScreen.tsx)**
   - Item list: Click items to select
   - Use/Discard buttons: Click functionality
   - Unit targeting (for item use): Click units to apply items

7. **Recruitment Screen (src/screens/RecruitmentScreen.tsx)**
   - Unit cards: Click to view details
   - Recruit button: Click to recruit
   - Back button: Click functionality

8. **Battle Formation Test (src/screens/BattleFormationTest.tsx)**
   - Dev tools: Ensure all controls are clickable

## Technical Implementation Guide

### Pattern 1: Adding Click Handlers to Cards

```typescript
// Current pattern (keyboard only):
<div className={isSelected ? 'border-4' : 'border-2'}>
  {/* content */}
</div>

// Required pattern (mouse + keyboard):
<div 
  className={isSelected ? 'border-4' : 'border-2'}
  onClick={() => handleSelect(itemId)}
  style={{ cursor: 'pointer' }}
>
  {/* content */}
</div>
```

### Pattern 2: Enemy/Unit Targeting

```typescript
// In BattleScreen.tsx, enemy rendering:
{enemyTeam.map((enemy, idx) => (
  <div
    key={enemy.id}
    onClick={() => {
      if (currentPhase === 'targeting-enemy') {
        handleEnemySelect(idx);
      }
    }}
    className={targetedEnemyIndex === idx ? 'ring-4 ring-yellow-400' : ''}
    style={{ cursor: currentPhase === 'targeting-enemy' ? 'pointer' : 'default' }}
  >
    <OpponentCard opponent={enemy} />
  </div>
))}
```

### Pattern 3: Button Click Integration

```typescript
// Current pattern (Enter key only):
useKeyboard({
  onEnter: () => handleConfirm(),
  enabled: true
});

// Required pattern (mouse + keyboard):
useKeyboard({
  onEnter: () => handleConfirm(),
  enabled: true
});

<button onClick={handleConfirm} className="...">
  Confirm
</button>
```

### Pattern 4: Item Selection

```typescript
// For item menus in BattleScreen:
{items.map((item, idx) => (
  <div
    key={item.id}
    onClick={() => handleItemSelect(idx)}
    className={selectedItemIndex === idx ? 'bg-blue-600' : 'bg-blue-900'}
    style={{ cursor: 'pointer' }}
  >
    {item.name}
  </div>
))}
```

## Testing Requirements

### Manual Testing Checklist

For EACH screen, verify:
- [ ] All interactive elements respond to mouse clicks
- [ ] All interactive elements respond to keyboard input
- [ ] User can complete full workflow with ONLY mouse
- [ ] User can complete full workflow with ONLY keyboard
- [ ] No roadblocks where both input methods are required

### Specific Test Cases

1. **Battle Screen - Mouse Only:**
   - Click Attack → Click enemy → Confirm attack completes
   - Click Item → Click item → Click target unit → Item applied
   - Click Ability → Click ability → Click target → Ability executed
   - Click Gem Super → Click target (if applicable) → Super spell cast

2. **Battle Screen - Keyboard Only:**
   - Arrow keys to select action → Enter → Arrow keys to select target → Enter
   - Same for items, abilities, gem super

3. **Starter Select - Mouse Only:**
   - Click 4 units to select team → Click confirm → Proceed to next screen

4. **Starter Select - Keyboard Only:**
   - Arrow keys to navigate → Space/Enter to select → Arrow to confirm → Enter

5. **Equipment Screen - Mouse Only:**
   - Click unit → Click equipment slot → Click new equipment → Equipped
   - Click back → Return to previous screen

6. **Equipment Screen - Keyboard Only:**
   - Arrow keys to select unit → Enter → Arrow to equipment slot → Enter → Arrow to item → Enter

## Acceptance Criteria

- ✅ All interactive elements have onClick handlers
- ✅ Visual feedback on hover (cursor: pointer, highlight, etc.)
- ✅ No console errors from click handlers
- ✅ Full game playthrough possible with ONLY mouse
- ✅ Full game playthrough possible with ONLY keyboard
- ✅ Existing keyboard shortcuts still work (no regressions)
- ✅ All TypeScript types are correct (no 'any' types added)
- ✅ All tests pass (1004/1004 maintained)

## Implementation Steps

1. **Audit Phase** (30 min)
   - Run game and document every location where click doesn't work
   - Create list of files needing modification
   - Identify common patterns to reuse

2. **Implementation Phase** (2-3 hours)
   - Add onClick handlers to all identified elements
   - Add cursor styles for visual feedback
   - Test each screen individually after changes
   - Fix any TypeScript errors

3. **Testing Phase** (30-45 min)
   - Complete game playthrough with only mouse
   - Complete game playthrough with only keyboard
   - Run test suite: `npm test`
   - Fix any regressions

4. **Commit & Push**
   - Branch: `coder/full-mouse-integration-[DATE]`
   - Commit message: "Add full mouse click integration for all interactive elements"
   - Push and notify Architect for merge

## Files Likely Needing Changes

- `src/screens/BattleScreen.tsx` (CRITICAL - most complex)
- `src/screens/StarterSelectScreen.tsx`
- `src/screens/OpponentSelectScreen.tsx`
- `src/screens/GemSelectScreen.tsx`
- `src/screens/EquipmentScreen.tsx`
- `src/screens/InventoryScreen.tsx`
- `src/screens/RecruitmentScreen.tsx`
- `src/components/OpponentCard.tsx` (if targeting logic is here)
- `src/components/UnitCard.tsx` (if selection logic is here)

## Related Documentation

- User request: "I want full click integration for everything"
- Current state: Inconsistent input handling causes roadblocks
- Expected outcome: Complete mouse OR keyboard independence

## Notes for Coder

- **DO NOT** remove keyboard functionality - ADD mouse functionality
- Use existing state management patterns (don't restructure)
- Visual feedback is important (cursor: pointer, hover states)
- Test thoroughly - this is a UX blocker
- If you find edge cases not listed here, fix them too
- Prioritize BattleScreen (most complex, most used)

## Success Metric

A user with ONLY a mouse can play the entire game from start to finish without ever needing a keyboard. Similarly, a user with ONLY a keyboard can play the entire game without ever needing a mouse.
