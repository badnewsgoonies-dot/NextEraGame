# 🤝 Graphics-Coder Handoff Protocol

**Preventing merge conflicts and coordinating visual + logic work**

---

## 🎯 Purpose

This protocol prevents the **exact issues** discovered in Test 3 (from IMPROVEMENTS_SUMMARY.md):
- ❌ Wrong branch (started on main instead of feature branch)
- ❌ Merge conflicts (two AIs modifying same files)
- ❌ Git push failures (403 errors, conflicts)
- ❌ Duplicate work (unaware of prior changes)
- ❌ 15 minutes wasted on git recovery

**This protocol ensures Graphics and Coder work harmoniously, not destructively.**

---

## 📊 The Problem

**From CONTEXT_PACKAGE.md Test 3 Findings:**

> "Test 3 (fresh session) struggled with:
> - Started on wrong branch (main instead of feature branch)
> - Didn't detect luck field from Test 2 (tried to re-add it)
> - Created merge conflicts
> - Multiple git push failures (403 errors)"

**Applied to Graphics-Coder:**

**Scenario (WILL happen without protocol):**

```
Session 10: Architect → Graphics AI
"Add character portraits to party screen"

Graphics AI:
- Creates branch: graphics/party-portraits
- Modifies PartyScreen.tsx (adds sprites, styling)
- Commits and pushes
- Hands off to Architect

Session 11: Architect → Coder AI (NEW chat)
"Add party member selection logic to party screen"

Coder AI:
- Creates branch: coder/party-selection
- Modifies PartyScreen.tsx (adds logic)
- Tries to push...
- âŒ MERGE CONFLICT âŒ
- Both modified same file in parallel branches!
```

**Result:** 10-20 minutes wasted resolving conflicts, frustration, potential data loss

**Solution:** This protocol.

---

## 🎯 Core Principle: Sequential Coordination

**RULE 1: Same File = Sequential Work**

If Graphics and Coder need to modify the **same file**, they work **sequentially** on the **same branch**, not in parallel on different branches.

**RULE 2: Different Files = Parallel Work**

If Graphics and Coder modify **different files**, they can work in parallel on separate branches.

**RULE 3: Branch First, Always**

Both Graphics and Coder **MUST verify branch** before starting work. Use FRESH_SESSION_PROTOCOL.md checklist.

---

## 🗺️ Ownership Boundaries

### **Graphics AI Owns (Can Modify Freely):**

**âœ… Styling & Layout:**
- CSS classes (Tailwind)
- Component structure (JSX layout)
- Positioning, spacing, colors
- Visual hierarchy

**âœ… Sprite Integration:**
- Sprite paths and mappings
- `spriteRegistry.ts` file
- Sprite-related components (AnimatedSprite, etc.)
- Image imports

**âœ… Visual Components:**
- New visual-only components (e.g., `RankUpAnimation.tsx`)
- UI components (buttons, modals, cards) when purely visual
- Transitions and animations

**âœ… Style Files:**
- `src/styles/index.css`
- `tailwind.config.js` (theme configuration)
- Component-specific styles

---

### **Coder AI Owns (Can Modify Freely):**

**âœ… Game Logic:**
- State management (useState, useEffect)
- Game mechanics (calculations, rules)
- Data flow (props, callbacks)
- Event handlers (business logic inside handlers)

**âœ… Systems:**
- `src/systems/` directory (all game systems)
- `src/core/` directory (controllers)
- `src/utils/` directory (utilities)

**âœ… Types & Tests:**
- `src/types/game.ts` (type definitions)
- `tests/` directory (all tests)
- Data structures

**âœ… Data Files:**
- `src/data/` directory (except spriteRegistry.ts)
- Unit catalogs, opponent catalogs
- Configuration files

---

### **Shared Ownership (Requires Coordination):**

**âš ï¸ Screen Component Files (.tsx in src/screens/):**
- **Graphics:** Adds styling, sprites, layout
- **Coder:** Adds logic, state, event handlers
- **Risk:** BOTH modify same file → HIGH CONFLICT POTENTIAL

**âš ï¸ Reusable Components (.tsx in src/components/):**
- **Graphics:** Visual design, styling
- **Coder:** Props, logic, behavior
- **Risk:** BOTH modify same file → HIGH CONFLICT POTENTIAL

**âš ï¸ Sprite Registry (src/data/spriteRegistry.ts):**
- **Graphics:** Adds sprite mappings
- **Coder:** Creates sprite loading functions
- **Risk:** BOTH modify same file → MEDIUM CONFLICT POTENTIAL

**âš ï¸ Package Files (package.json):**
- **Graphics:** Adds visual libraries (if needed)
- **Coder:** Adds logic libraries
- **Risk:** BOTH modify same file → LOW CONFLICT POTENTIAL

---

## 📋 Coordination Workflows

### **Workflow 1: Pure Visual Work (Graphics Only)**

**Scenario:** Add sprites to existing screen, no logic changes

**Graphics AI Process:**
1. Create graphics branch: `claude/graphics-[feature]-[ID]`
2. Modify only visual elements (sprites, CSS)
3. Test visual changes
4. Commit and push
5. Report completion to Architect

**Coder AI:** Not involved (no handoff needed)

**Example:**
```
Task: "Map all enemy sprites to opponent catalog"

Graphics AI:
- Branch: claude/graphics-enemy-sprites-XYZ
- Files: spriteRegistry.ts (add mappings only)
- No logic changes
- Complete and report
```

**Result:** ✅ No conflicts (Graphics-only work)

---

### **Workflow 2: Pure Logic Work (Coder Only)**

**Scenario:** Add game mechanic, no visual changes

**Coder AI Process:**
1. Create coder branch: `claude/coder-[feature]-[ID]`
2. Modify only logic files (systems, utils, types)
3. Test logic with unit tests
4. Commit and push
5. Report completion to Architect

**Graphics AI:** Not involved (no handoff needed)

**Example:**
```
Task: "Add critical hit calculation system"

Coder AI:
- Branch: claude/coder-critical-hits-XYZ
- Files: CriticalHitSystem.ts (new), tests (new)
- No visual changes
- Complete and report
```

**Result:** ✅ No conflicts (Coder-only work)

---

### **Workflow 3: Sequential Work (Graphics → Coder)**

**Scenario:** Graphics adds visuals first, then Coder adds logic

**Process:**

**Step 1: Graphics Work**
```
Architect → Graphics AI:
"Add character portraits to PartyScreen"

Graphics AI:
1. Create branch: claude/graphics-party-portraits-ABC
2. git checkout claude/graphics-party-portraits-ABC
3. Modify PartyScreen.tsx:
   - Add <img> tags for portraits
   - Add CSS styling
   - Add sprite integration
4. Test visuals
5. Commit: "Add character portraits to PartyScreen"
6. Push branch
7. Report to Architect with branch name
```

**Step 2: Coder Handoff**
```
Architect → Coder AI (NEW chat or same):
"Add party selection logic to PartyScreen"

CRITICAL: Coder must continue Graphics' work!

Architect includes in task:
---
ðŸ"„ Fresh Session / Handoff Context

**Prior Work:**
- Session X: Graphics AI added character portraits
- Branch: claude/graphics-party-portraits-ABC
- Files Modified: PartyScreen.tsx (visual changes only)

**BEFORE CODING:**
1. âœ… git checkout claude/graphics-party-portraits-ABC
2. âœ… git pull origin claude/graphics-party-portraits-ABC
3. âœ… Read PartyScreen.tsx (see Graphics' changes)
4. âœ… THEN add your logic
---

Coder AI:
1. âœ… git checkout claude/graphics-party-portraits-ABC (SAME branch!)
2. âœ… git pull (get Graphics' changes)
3. âœ… Read PartyScreen.tsx (understand existing code)
4. Add selection logic:
   - Add onClick handlers
   - Add state management
   - Add selection highlighting
5. Test functionality
6. Commit: "Add party selection logic to PartyScreen"
7. Push to SAME branch
8. Report completion
```

**Result:** ✅ No conflicts (Sequential on same branch)

---

### **Workflow 4: Sequential Work (Coder → Graphics)**

**Scenario:** Coder adds logic first, then Graphics polishes visuals

**Process:**

**Step 1: Coder Work**
```
Architect → Coder AI:
"Implement equipment system logic"

Coder AI:
1. Create branch: claude/coder-equipment-system-XYZ
2. Add EquipmentSystem.ts (logic)
3. Add types, tests
4. Create basic EquipmentScreen.tsx (functional, not pretty)
5. Commit and push
6. Report to Architect with branch name
```

**Step 2: Graphics Handoff**
```
Architect → Graphics AI (NEW chat):
"Polish EquipmentScreen with Golden Sun visuals"

CRITICAL: Graphics must continue Coder's work!

Architect includes in task:
---
ðŸ"„ Fresh Session / Handoff Context

**Prior Work:**
- Session Y: Coder AI implemented equipment system logic
- Branch: claude/coder-equipment-system-XYZ
- Files Created: EquipmentSystem.ts, EquipmentScreen.tsx (basic)

**BEFORE CODING:**
1. âœ… git checkout claude/coder-equipment-system-XYZ
2. âœ… git pull origin claude/coder-equipment-system-XYZ
3. âœ… Read EquipmentScreen.tsx (understand logic)
4. âœ… THEN add visual polish
---

Graphics AI:
1. âœ… git checkout claude/coder-equipment-system-XYZ (SAME branch!)
2. âœ… git pull (get Coder's changes)
3. âœ… Read EquipmentScreen.tsx (understand existing logic)
4. Add visual polish:
   - Golden Sun theme CSS
   - Character portrait sprites
   - Equipment slot styling
   - Animations and transitions
5. Test visuals (don't break logic!)
6. Commit: "Add Golden Sun visual polish to EquipmentScreen"
7. Push to SAME branch
8. Report completion
```

**Result:** ✅ No conflicts (Sequential on same branch)

---

### **Workflow 5: Parallel Work (Different Files)**

**Scenario:** Graphics and Coder work on different features simultaneously

**Process:**

**Graphics Work (Parallel):**
```
Task: "Add battle victory animation"

Graphics AI:
1. Create branch: claude/graphics-victory-animation-ABC
2. Create NEW file: VictoryAnimation.tsx
3. Modify spriteRegistry.ts (add victory sprites)
4. No changes to existing screen files
5. Commit and push
6. Report completion
```

**Coder Work (Parallel):**
```
Task: "Implement leveling system"

Coder AI:
1. Create branch: claude/coder-leveling-system-XYZ
2. Create NEW file: LevelingSystem.ts
3. Add tests
4. No changes to screen files
5. Commit and push
6. Report completion
```

**Merge Strategy:**
```
Both branches complete independently.
Architect (or human) merges both:
1. git checkout main
2. git merge claude/graphics-victory-animation-ABC
3. git merge claude/coder-leveling-system-XYZ
4. No conflicts (different files!)
```

**Result:** ✅ No conflicts (Different files, parallel work safe)

---

## 📋 Handoff Checklist

### **Graphics → Coder Handoff**

**Graphics AI Completion Checklist:**
```markdown
## ✅ Graphics Work Complete - Ready for Coder

**Branch:** claude/graphics-[feature]-[ID]
**Files Modified:**
- [ ] PartyScreen.tsx (visual changes only - styling, sprites)
- [ ] spriteRegistry.ts (new sprite mappings)
- [ ] [other files]

**What Was Done:**
- Added character portrait sprites
- Styled equipment slots
- Created animations

**What's Needed Next (Coder):**
- Add selection logic
- Add state management
- Connect to game controller

**Handoff Instructions for Coder:**
1. âœ… git checkout claude/graphics-[feature]-[ID]
2. âœ… git pull origin claude/graphics-[feature]-[ID]
3. âœ… Read [files modified] to understand visual structure
4. âœ… Add logic WITHOUT breaking visual changes
5. âœ… Test both visuals + logic together
6. âœ… Commit to SAME branch
7. âœ… Push and report
```

---

### **Coder → Graphics Handoff**

**Coder AI Completion Checklist:**
```markdown
## ✅ Coder Work Complete - Ready for Graphics

**Branch:** claude/coder-[feature]-[ID]
**Files Modified:**
- [ ] EquipmentSystem.ts (game logic)
- [ ] EquipmentScreen.tsx (functional, basic styling)
- [ ] game.ts (type definitions)
- [ ] [tests]

**What Was Done:**
- Implemented equipment logic
- Created functional screen (basic UI)
- Added types and tests

**What's Needed Next (Graphics):**
- Golden Sun visual theme
- Character portrait integration
- Animation and polish

**Handoff Instructions for Graphics:**
1. âœ… git checkout claude/coder-[feature]-[ID]
2. âœ… git pull origin claude/coder-[feature]-[ID]
3. âœ… Read [files modified] to understand logic
4. âœ… Add visual polish WITHOUT breaking logic
5. âœ… Test both logic + visuals together
6. âœ… Commit to SAME branch
7. âœ… Push and report
```

---

## 🚨 Conflict Prevention Rules

### **RULE 1: Always Verify Branch First**

**Before ANY work:**
```bash
# Check current branch
git branch --show-current

# If wrong branch:
git checkout [correct-branch-name]

# Always pull latest
git pull origin [branch-name]

# THEN start coding
```

**Why Critical:** Test 3 proved starting on wrong branch causes 10+ mins of git recovery

---

### **RULE 2: Read Before Modifying**

**Before modifying existing file:**
```bash
# Read the file first
cat PartyScreen.tsx  # or open in editor

# Understand:
# - What's already there?
# - What did prior AI add?
# - Where do my changes fit?

# THEN modify
```

**Why Critical:** Understanding existing code prevents duplicate work and conflicts

---

### **RULE 3: Same File = Same Branch**

**If modifying same file:**
- âœ… Use SAME branch (sequential work)
- âŒ Use different branches (guaranteed conflict!)

**Example:**
```
Graphics modifies PartyScreen.tsx → branch: graphics-party-ABC
Coder also needs PartyScreen.tsx → use: graphics-party-ABC (SAME branch!)
```

**Why Critical:** Git cannot auto-merge complex code changes

---

### **RULE 4: Communicate File Changes**

**In handoff note, always list:**
- Which files were modified
- What changed in each file
- What should NOT be changed (preserve this!)

**Example:**
```
Files Modified:
- PartyScreen.tsx
  - Added portrait <img> tags (lines 45-60)
  - Added .portrait-container CSS (lines 120-135)
  - âš ï¸ DO NOT modify portrait JSX structure (keep as-is!)
  
- spriteRegistry.ts
  - Added CHARACTER_PORTRAITS section (lines 200-250)
  - âš ï¸ OK to add more mappings, but don't change existing
```

---

### **RULE 5: Test Before Pushing**

**Always verify:**
```bash
# Run tests
npm test

# Check TypeScript
npm run type-check

# Run dev server
npm run dev

# Verify changes work
# - Visuals display correctly (Graphics)
# - Logic functions correctly (Coder)
# - No console errors
# - No visual bugs

# THEN commit and push
```

---

## 🔧 Conflict Resolution (If It Happens)

**Despite best efforts, conflicts may occur. Here's the fix:**

### **Step 1: Identify Conflict**

```bash
git pull origin [branch]
# Output: CONFLICT (content): Merge conflict in PartyScreen.tsx
```

### **Step 2: Open Conflicted File**

```typescript
<<<<<<< HEAD
// Your changes
const portraits = CHARACTER_SPRITES.portraits;
=======
// Their changes  
const portraits = getCharacterPortraits();
>>>>>>> origin/branch
```

### **Step 3: Resolve Manually**

**Choose ONE:**
- Keep your changes
- Keep their changes
- Merge both intelligently

**Example Resolution:**
```typescript
// Keep both (merged intelligently)
const portraits = CHARACTER_SPRITES.portraits || getCharacterPortraits();
```

### **Step 4: Mark Resolved**

```bash
git add PartyScreen.tsx
git commit -m "Resolve merge conflict in PartyScreen.tsx"
git push origin [branch]
```

---

## 📊 Decision Tree: Which Workflow?

```
Does task involve modifying existing screen file?
  â"‚
  â"œâ"€ YES → Same file as prior AI work?
  â"‚         â"‚
  â"‚         â"œâ"€ YES → Use Workflow 3 or 4 (Sequential, SAME branch)
  â"‚         â"‚
  â"‚         â""â"€ NO → Check if related feature
  â"‚                   â"‚
  â"‚                   â"œâ"€ YES → Consider sequential
  â"‚                   â""â"€ NO → Parallel work OK (different files)
  â"‚
  â""â"€ NO → Pure Graphics or Pure Coder?
            â"‚
            â"œâ"€ Pure Graphics → Use Workflow 1 (Graphics only)
            â""â"€ Pure Coder → Use Workflow 2 (Coder only)
```

---

## 🎯 Best Practices Summary

### **For Graphics AI:**

**âœ… DO:**
- Create graphics-specific branches for pure visual work
- Use same branch when continuing Coder's work
- Read existing code before modifying
- Test visuals don't break logic
- Document visual changes clearly
- Report branch name in completion

**âŒ DON'T:**
- Modify game logic or systems
- Change TypeScript types
- Break existing functionality
- Create new branch for handoff work (use existing!)
- Push without testing

---

### **For Coder AI:**

**âœ… DO:**
- Create coder-specific branches for pure logic work
- Use same branch when continuing Graphics' work
- Read existing code before modifying
- Test logic doesn't break visuals
- Preserve visual styling (don't remove CSS)
- Report branch name in completion

**âŒ DON'T:**
- Rewrite visual styling (unless broken)
- Remove CSS classes added by Graphics
- Change sprite paths without coordination
- Create new branch for handoff work (use existing!)
- Push without testing

---

### **For Architect AI:**

**âœ… DO:**
- Specify branch name in fresh session tasks
- List prior work clearly
- Indicate if Graphics or Coder should continue existing branch
- Provide file change context
- Specify coordination workflow

**âŒ DON'T:**
- Assume AI will detect branch automatically
- Send both Graphics and Coder to modify same file in parallel
- Start new chat without handoff context
- Omit prior work information

---

## 📋 Handoff Template (For Architect Use)

```markdown
# 🎨/💻 Task: [Feature Name]

## ðŸ"„ Fresh Session / Handoff Context

**This is Session [X] continuing prior work.**

### Prior Work:
- Session [Y]: [AI Type] added [what was done]
- Session [Z]: [AI Type] added [what was done]

### Branch:
**MUST USE:** claude/[ai-type]-[feature]-[ID]

### Files Modified (by prior AI):
- [File 1]: [what changed]
- [File 2]: [what changed]

### BEFORE Coding:
1. âœ… git checkout claude/[ai-type]-[feature]-[ID]
2. âœ… git pull origin claude/[ai-type]-[feature]-[ID]
3. âœ… Read [modified files] (understand prior work)
4. âœ… Verify [key elements] exist
5. âœ… THEN start your work

---

## ðŸŽ¯ Your Task

[Clear task description]

## Requirements

[Detailed requirements]

## Acceptance Criteria

- [ ] Your changes added successfully
- [ ] Prior work preserved (not broken)
- [ ] Tests passing
- [ ] Visual + Logic both work
```

---

## âœ… Success Metrics

**Handoff protocol working when:**

- ✅ 0 merge conflicts
- ✅ Sequential work on same branch succeeds
- ✅ Both Graphics and Coder work preserved
- ✅ Fresh sessions detect prior changes
- ✅ Branch coordination smooth
- ✅ No git recovery time wasted

**Warning signs protocol needed:**

- ⚠️ Merge conflicts on same file
- ⚠️ Git push failures (403 errors)
- ⚠️ One AI overwrites other's work
- ⚠️ Branch confusion (wrong branch)
- ⚠️ Duplicate work (didn't detect prior changes)

---

## 🎯 Critical Reminders

**From Test 3 Learnings (CONTEXT_PACKAGE.md):**

> "Fresh sessions CANNOT detect prior changes reliably. Must validate explicitly."

**Application:**
- Always specify branch name in task
- Always include prior work context
- Always use FRESH_SESSION_PROTOCOL checklist
- Never assume AI will "figure it out"

**This protocol eliminates 33% of wasted time on git issues!**

---

## 🚀 Ready to Coordinate!

**You now have:**
- âœ… Clear ownership boundaries
- âœ… 5 coordination workflows
- âœ… Handoff checklists
- âœ… Conflict prevention rules
- âœ… Decision trees

**Your mission:** Graphics and Coder working harmoniously, not destructively! 🤝✨

---

**Let's eliminate merge conflicts and work efficiently!** 🎮💎
