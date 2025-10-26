# Implementation Coder: Full Mouse Integration Task

## Quick Context
You're working on NextEraGame, a Golden Sun-inspired tactical RPG. The game is fully functional but has **critical UX issue**: inconsistent mouse/keyboard support creates roadblocks where users need BOTH input methods to play.

## Your Mission
Make the ENTIRE game playable with mouse-only OR keyboard-only (no mixing required).

## Detailed Task Document
📄 **Read this first:** `docs/ai/tasks/TASK_FULL_MOUSE_INTEGRATION.md`

That document contains:
- Complete problem statement with specific examples
- Technical implementation patterns for each scenario
- Comprehensive testing checklist
- Acceptance criteria
- List of files needing changes

## Critical Examples to Fix

### Example 1: Battle Screen Enemy Targeting
**Problem:** User clicks "Attack" button (works) but must press Enter to select enemy (clicking enemy doesn't work)

**Solution:** Add onClick handler to enemy cards:
```typescript
{enemyTeam.map((enemy, idx) => (
  <div
    onClick={() => {
      if (currentPhase === 'targeting-enemy') {
        handleEnemySelect(idx);
      }
    }}
    style={{ cursor: currentPhase === 'targeting-enemy' ? 'pointer' : 'default' }}
  >
    <OpponentCard opponent={enemy} />
  </div>
))}
```

### Example 2: Item Selection
**Problem:** Item menu shows items but clicking them doesn't select

**Solution:** Add onClick to item list elements with proper state updates

### Example 3: Unit Card Selection
**Problem:** Various screens show unit cards but clicking doesn't select

**Solution:** Add onClick handlers that call the same logic as keyboard Enter key

## Implementation Priority

1. **BattleScreen.tsx** (HIGHEST PRIORITY - most complex, most used)
   - Enemy targeting
   - Item selection & targeting
   - Ability targeting
   - Gem super spell targeting
   - All button confirmations

2. **StarterSelectScreen.tsx**
   - Unit card selection
   - Confirm button

3. **OpponentSelectScreen.tsx**
   - Opponent card selection
   - Difficulty info

4. **GemSelectScreen.tsx**
   - Gem card selection
   - Affinity preview

5. **EquipmentScreen.tsx**
   - Unit selection
   - Equipment slot selection
   - Item selection

6. **InventoryScreen.tsx**
   - Item selection
   - Unit targeting for item use

7. **RecruitmentScreen.tsx**
   - Unit card viewing
   - Recruit button

## Testing Requirements

### Must Pass: Full Game Playthrough
1. **Mouse Only:** Complete game from menu → starter select → gem select → battle → equipment → inventory using ONLY mouse
2. **Keyboard Only:** Complete same flow using ONLY keyboard
3. **No Roadblocks:** At no point should user be stuck without both input methods

### Automated Tests
- Run `npm test` after changes
- Must maintain 1004/1004 tests passing
- Fix any regressions immediately

## Technical Guidelines

### Pattern: Add Click Without Breaking Keyboard
```typescript
// Keep existing keyboard hook:
useKeyboard({
  onEnter: () => handleConfirm(),
  enabled: true
});

// ADD mouse support:
<button onClick={handleConfirm}>Confirm</button>
```

### Pattern: Visual Feedback
```typescript
// Add cursor pointer + hover states:
<div 
  onClick={handleSelect}
  className={isSelected ? 'ring-4 ring-yellow-400' : ''}
  style={{ cursor: 'pointer' }}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
>
```

### Pattern: Conditional Clicks
```typescript
// Only allow clicks during appropriate phases:
onClick={() => {
  if (currentPhase === 'targeting-enemy') {
    handleSelect(idx);
  }
}}
```

## Branch & Commit Strategy

**Branch:** `coder/full-mouse-integration-20251026`

**Commit Messages:**
- "Add mouse click support to BattleScreen enemy targeting"
- "Add mouse click support to item selection and targeting"
- "Add mouse click support to StarterSelectScreen unit cards"
- "Add mouse click support to Equipment and Inventory screens"
- "Add mouse click support to remaining screens"

## Files You'll Modify

Core screens (from workspace context):
- `src/screens/BattleScreen.tsx`
- `src/screens/StarterSelectScreen.tsx`
- `src/screens/OpponentSelectScreen.tsx`
- `src/screens/GemSelectScreen.tsx`
- `src/screens/EquipmentScreen.tsx`
- `src/screens/InventoryScreen.tsx`
- `src/screens/RecruitmentScreen.tsx`

Supporting components:
- `src/components/OpponentCard.tsx` (may need onClick props)
- `src/components/UnitCard.tsx` (may need onClick props)

## Success Criteria

- ✅ User can complete entire game with ONLY mouse
- ✅ User can complete entire game with ONLY keyboard
- ✅ All interactive elements have cursor: pointer on hover
- ✅ No console errors from click handlers
- ✅ All 1004 tests still passing
- ✅ No TypeScript errors

## Existing Code Context

**Current State:**
- Game uses keyboard-first design with `useKeyboard` hook
- Most screens have keyboard navigation working perfectly
- Some buttons have onClick, but targeting/selection often keyboard-only
- State management uses React hooks (useState, useEffect)

**Don't Break:**
- Existing keyboard functionality (users love it)
- Test suite (1004/1004 passing)
- TypeScript strict mode (0 errors currently)
- Game state management patterns

## Questions? Check These First

1. **"How do I handle phase-based clicks?"**
   - Check currentPhase state, only allow clicks when appropriate
   - See BattleScreen.tsx existing phase logic

2. **"Should I remove keyboard support?"**
   - NO! Add mouse support alongside keyboard (both should work)

3. **"What if card selection logic is complex?"**
   - Look for existing keyboard handlers (onEnter, onSpace)
   - Call the same handler function from onClick

4. **"How do I test without breaking stuff?"**
   - Test each screen individually after changes
   - Run `npm test` frequently
   - Do full playthrough before final commit

## Start Here

1. Read full task doc: `docs/ai/tasks/TASK_FULL_MOUSE_INTEGRATION.md`
2. Create branch: `coder/full-mouse-integration-20251026`
3. Start with BattleScreen.tsx (most critical)
4. Test each change immediately
5. Move to other screens systematically
6. Final full playthrough test (mouse-only, then keyboard-only)
7. Run `npm test` to verify no regressions
8. Commit and push

## Need Help?

- **Task stuck?** Document the specific roadblock and ask Architect
- **TypeScript errors?** Check existing patterns in same file
- **Tests failing?** Run individual test file to see specific issue
- **Unclear requirement?** Refer back to task doc or ask for clarification

## Time Estimate

- BattleScreen: 1.5-2 hours
- Other screens: 1-1.5 hours
- Testing: 0.5 hours
- **Total: 3-4 hours**

Good luck! This is high-impact work that dramatically improves UX. 🎯
