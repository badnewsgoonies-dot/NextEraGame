# 🎨 Graphics Fresh Session Protocol

**Critical instructions for Graphics AI starting new sessions on existing visual work**

---

## âš ï¸ THE PROBLEM (Graphics-Specific)

When starting a **fresh Graphics AI session** (new chat, no prior context):
- ❌ Can't see what prior Graphics work was done
- ❌ May not detect sprite integrations from previous sessions
- ❌ Git branch confusion (same as Coder AI - Test 3 proved this!)
- ❌ Risk of duplicate sprite mapping or conflicting visual changes
- ❌ May overwrite prior visual styling

**This protocol prevents the SAME issues Test 3 encountered, adapted for Graphics work.**

---

## ✅ THE SOLUTION: Graphics Fresh Session Checklist

**Copy this into EVERY fresh Graphics AI session prompt:**

```markdown
## 🎨 Fresh Graphics Session Setup (DO THIS FIRST!)

### Step 1: Branch Setup
**CRITICAL: Run these commands BEFORE any visual work:**

```bash
# 1. Check current branch
git branch --show-current

# 2. If not on correct branch, switch to it
git checkout [exact-branch-name-from-task]

# 3. Verify branch state
git status

# 4. Pull latest changes
git pull origin [branch-name]
```

### Step 2: Visual Context Validation
**Verify these visual dependencies exist:**

- [ ] List expected sprite integrations from prior sessions
- [ ] Check spriteRegistry.ts for existing mappings
- [ ] Read modified screen files to see current visual state
- [ ] Note any visual changes from previous work
- [ ] Verify CSS/styling added in prior sessions

### Step 3: Start Visual Work
**ONLY NOW can you begin graphics work!**
```

---

## 📋 Graphics Fresh Session Task Template

**Use this template for Graphics tasks in new sessions:**

```markdown
# 🎨 Task: [Visual Feature Name]

## ðŸ"„ Fresh Graphics Session Context

**This is a NEW Graphics AI session continuing prior visual work.**

### Prior Visual Work Completed:
- Session X: Graphics AI [what visual work was done]
- Session Y: Graphics AI [what visual work was done]
- Session Z: Coder AI [if logic was added between Graphics sessions]

### Expected Visual State:
- **Sprites Integrated:**
  - Character portraits in PartyScreen (Session X)
  - Enemy sprites in BattleScreen (Session Y)
  - [List all sprite integrations that SHOULD exist]

- **Files Modified:**
  - `src/data/spriteRegistry.ts` - [Sprite mappings added]
  - `src/screens/PartyScreen.tsx` - [Visual changes]
  - `src/styles/index.css` - [Custom animations]
  - [List all files with visual changes]

- **Visual Features:**
  - Golden Sun theme applied to Equipment screen
  - Rank-up animation created
  - [List all visual features that SHOULD be present]

### Branch Information:
- **Correct Branch:** `claude/graphics-[feature]-[ID]`
- **DO NOT use:** main, master, or other branches
- **Switch BEFORE starting:** `git checkout [branch-name]`

---

## ðŸŽ¯ Your Visual Task

[Normal Graphics task description continues here...]

---

## âš ï¸ CRITICAL GRAPHICS-SPECIFIC INSTRUCTIONS

### BEFORE Creating Any Visual Elements:
1. âœ… Switch to correct branch (git checkout)
2. âœ… Read spriteRegistry.ts (see existing mappings)
3. âœ… Read modified screen files (understand current layout)
4. âœ… Check public/sprites/ directory (verify sprites exist)
5. âœ… Review CSS files (see existing styles)

### Visual Work Workflow:
- **DO:** Build on existing visual work
- **DO:** Preserve prior sprite mappings
- **DON'T:** Recreate sprite mappings that exist
- **DON'T:** Overwrite CSS added in prior sessions
- **DON'T:** Assume visual state without checking

### If Expected Visuals Missing:
- STOP and report: "Expected sprite mapping X not found"
- DON'T recreate visual work from prior sessions
- ASK for clarification on branch/visual state
- CHECK if on wrong branch first
```

---

## 🎯 Real Example: Battle Screen Sprites (Fresh Session)

**Scenario:** Continue adding enemy sprites across multiple sessions

### **Session 1: Initial Enemy Sprites**
```markdown
Graphics AI Session 1:
- Branch: claude/graphics-enemy-sprites-ABC
- Added 3 enemy sprite mappings (bat, goblin, slime)
- Modified spriteRegistry.ts
- Tested in battle
- Pushed and reported
```

### **Session 2: Fresh Session - More Enemy Sprites**

**âŒ WRONG APPROACH (Causes Issues):**
```markdown
# New chat starts
Graphics AI: "I'll add enemy sprites to spriteRegistry"
*Starts on main branch*
*Opens spriteRegistry.ts*
*Doesn't see prior mappings (wrong branch!)*
*Re-adds bat, goblin, slime mappings*
*Creates duplicate/conflicting mappings*
*Push fails with merge conflict*
```

**âœ… CORRECT APPROACH (Protocol):**
```markdown
# New chat starts

## ðŸ"„ Fresh Graphics Session Context

**Prior Work:**
- Session 1: Graphics AI added 3 enemy sprites (bat, goblin, slime)
- Branch: claude/graphics-enemy-sprites-ABC
- Modified: spriteRegistry.ts (lines 150-180)

### BEFORE Visual Work:
```bash
# 1. Switch to correct branch
git checkout claude/graphics-enemy-sprites-ABC
git pull origin claude/graphics-enemy-sprites-ABC

# 2. Verify existing mappings
cat src/data/spriteRegistry.ts | grep "bat\|goblin\|slime"
# âœ… See existing mappings from Session 1

# 3. Read file to understand structure
```

Graphics AI:
"I see existing mappings for bat, goblin, and slime from Session 1.
I'll ADD 5 more enemy sprites (skeleton, zombie, wolf, bear, orc)
WITHOUT duplicating the existing 3."

*Adds ONLY new sprites*
*Tests all 8 sprites (3 old + 5 new)*
*Commits: "Add 5 more enemy sprites (total: 8)"*
*Pushes to SAME branch*
âœ… No conflicts, clean continuation!
```

---

## 🚨 Common Graphics Fresh Session Mistakes

### **Mistake 1: Wrong Branch (Visual Context Lost)**
```bash
# âŒ WRONG
*Graphics AI starts on main branch*
*spriteRegistry.ts shows 0 mappings*
*Re-adds sprites from Session 1*
*Creates conflicts*

# âœ… CORRECT
git branch --show-current  # Check first!
git checkout claude/graphics-[feature]-[ID]
grep "CHARACTER_SPRITES" src/data/spriteRegistry.ts
*See existing mappings*
"Building on existing mappings from prior session"
```

---

### **Mistake 2: Missing Visual Context**
```bash
# âŒ WRONG
Graphics AI: "I'll add character portraits to PartyScreen"
*File already has portraits from Session 1*
*Overwrites existing sprite integration*
*Breaks visual layout*

# âœ… CORRECT
git checkout [branch]
cat src/screens/PartyScreen.tsx | grep -A5 "portrait"
*See existing portrait code*
"Portraits already integrated in Session 1.
I'll enhance them by adding hover effects instead."
```

---

### **Mistake 3: Duplicate Sprite Work**
```bash
# âŒ WRONG
*Adds warrior → Isaac mapping*
*Mapping already exists from Session 1*
*Creates duplicate entry in spriteRegistry*

# âœ… CORRECT
cat src/data/spriteRegistry.ts | grep "warrior"
*warrior mapping exists*
"Warrior sprite already mapped to Isaac (Session 1).
I'll map the remaining 8 units instead."
```

---

### **Mistake 4: Overwriting CSS**
```bash
# âŒ WRONG
*Session 2 Graphics AI adds .battle-screen styles*
*Doesn't see Session 1 added same class*
*Overwrites with different styles*
*Visual regression (looks different than designed)*

# âœ… CORRECT
cat src/styles/index.css | grep ".battle-screen"
*Class exists from Session 1*
"Battle screen CSS exists. I'll ADD new classes 
for enemy sprites WITHOUT modifying existing."
```

---

## 📊 Graphics Fresh Session Workflow

```
┌─────────────────────────────────────┐
│   NEW GRAPHICS SESSION STARTS       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Step 1: CHECK BRANCH               │
│  git branch --show-current          │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │  On graphics│
        │  branch?    │
        └──────┬──────┘
          YES  │  NO
          ┌────┴────┐
          │         │
          ▼         ▼
    ┌─────────┐  ┌──────────────────┐
    │Continue │  │git checkout      │
    │         │  │graphics-branch   │
    └────┬────┘  └──────┬───────────┘
         │              │
         └──────┬───────┘
                ▼
┌─────────────────────────────────────┐
│  Step 2: VERIFY VISUAL CONTEXT     │
│  - Check spriteRegistry.ts         │
│  - Read modified screen files       │
│  - List existing sprite mappings    │
│  - Review CSS files                 │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │  Visual     │
        │  state OK?  │
        └──────┬──────┘
          YES  │  NO
          ┌────┴────┐
          │         │
          ▼         ▼
    ┌─────────┐  ┌──────────────┐
    │Continue │  │STOP & REPORT │
    │         │  │Missing assets│
    └────┬────┘  └──────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Step 3: START VISUAL WORK          │
│  - Add NEW sprites (not duplicates) │
│  - Build on existing visual design  │
│  - Preserve prior CSS                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Step 4: TEST VISUALS               │
│  - Verify sprites load (no 404s)   │
│  - Check layout not broken           │
│  - Test animations smooth            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Step 5: COMMIT & PUSH              │
│  - Same branch as prior session     │
│  - Clear commit message              │
│  - Screenshot evidence               │
└─────────────────────────────────────┘
```

---

## 🎯 Graphics Session Handoff Format

**End of each Graphics session, provide handoff for next Graphics session:**

```markdown
## ðŸŽ¨ Graphics Session Handoff for Next Time

### Visual Work Completed:
- âœ… Character portraits added to PartyScreen
- âœ… Enemy sprites mapped for 8 enemies
- âœ… Golden Sun theme applied to Equipment screen
- âœ… Rank-up animation created

### Current Visual State:
- **Branch:** `claude/graphics-[feature]-[ID]`
- **Sprites Integrated:** 12 characters, 8 enemies
- **Tests:** All visual tests passing (no 404s)
- **Commits:** Pushed to origin

### Files Modified/Created:
```
src/data/spriteRegistry.ts              (Modified - added mappings)
src/screens/PartyScreen.tsx             (Modified - added portraits)
src/screens/EquipmentScreen.tsx         (Modified - Golden Sun theme)
src/components/RankUpAnimation.tsx      (NEW - animation)
src/styles/index.css                    (Modified - custom animations)
```

### Visual Assets Used:
- Character sprites: Isaac, Garet, Ivan, Mia, Felix, Jenna, Sheba, Piers
- Enemy sprites: bat, goblin, slime, skeleton, zombie, wolf, bear, orc
- Effect sprites: rank_up_sparkle.gif, victory_flash.gif

### Next Graphics Session Should:
1. Add ability effect animations to battle screen
2. Polish battle victory screen with animations
3. Add sprite hover effects to roster screen

### Fresh Graphics Session Checklist:
- [ ] `git checkout claude/graphics-[feature]-[ID]`
- [ ] Verify spriteRegistry.ts has 12 character + 8 enemy mappings
- [ ] Verify PartyScreen has portrait integration
- [ ] Check EquipmentScreen has Golden Sun theme
- [ ] Confirm 0 console errors for sprites (no 404s)
```

---

## 🎨 Graphics-Specific Best Practices

### **DO:**
âœ… Always read spriteRegistry.ts first (see existing mappings)  
âœ… Check public/sprites/ directory (verify sprites exist)  
âœ… Read modified screen files (understand layout)  
âœ… Build on existing visual work (don't duplicate)  
âœ… Test sprites load (check browser console)  
âœ… Preserve prior CSS styling  
âœ… Screenshot before/after for evidence  

### **DON'T:**
âŒ Skip branch verification (causes 10+ mins of recovery)  
âŒ Re-add sprite mappings that exist  
âŒ Overwrite CSS from prior sessions  
âŒ Ignore console 404 errors  
âŒ Assume visual state without checking  
âŒ Delete prior sprite integrations  
âŒ Push without testing visuals  

---

## 🔍 Detection: Am I In Graphics Fresh Session?

**Signs you're in a fresh Graphics session:**

1. **New chat** about visual work
2. **Task mentions** "continuing visual work" or "Session X added sprites"
3. **Prior Graphics work** referenced in task description
4. **Branch name** starts with `claude/graphics-`

**If ANY of these are true → Use Graphics Fresh Session Protocol!**

---

## 📋 Graphics Handoff Coordination

### **From Prior Graphics Session:**

When handing off to next Graphics session, specify:

**âœ… DO Include:**
- Exact branch name
- List of sprite mappings added
- Files modified (with line numbers if helpful)
- Visual features implemented
- What still needs visual work

**Example Handoff:**
```markdown
## Session 10 Handoff (Graphics → Graphics)

**Visual Work Done:**
- Character sprites mapped (8/12 units complete)
- Branch: claude/graphics-character-sprites-ABC
- spriteRegistry.ts: Lines 50-120 (character mappings)

**Still Needed:**
- Remaining 4 character sprites
- Enemy sprite integration
- Ability effect animations
```

---

### **From Coder Session (Mixed Handoff):**

When Coder AI did logic work, then Graphics continues:

**âœ… Graphics Must Know:**
- Which branch has the logic work
- Which files Coder modified
- What visual elements are needed for the logic

**Example Mixed Handoff:**
```markdown
## Session 11 Handoff (Coder → Graphics)

**Logic Work Done (Coder):**
- Equipment system implemented
- Branch: claude/coder-equipment-system-XYZ
- Created: EquipmentSystem.ts, EquipmentScreen.tsx (functional, basic UI)

**Graphics Work Needed:**
- Golden Sun visual theme for EquipmentScreen
- Character portrait integration
- Equipment slot styling
- Stat comparison visual design

**CRITICAL for Graphics:**
1. âœ… Use branch: claude/coder-equipment-system-XYZ (SAME branch!)
2. âœ… Read EquipmentScreen.tsx (understand logic first)
3. âœ… Add visual polish WITHOUT breaking logic
```

*See GRAPHICS_CODER_HANDOFF.md for complete mixed handoff protocols.*

---

## 🎯 Graphics Fresh Session Checklist (Quick Reference)

**Copy this into every fresh Graphics session:**

```markdown
## âœ… Graphics Fresh Session Checklist

### Before Visual Work:
- [ ] Check branch: `git branch --show-current`
- [ ] Switch if needed: `git checkout [graphics-branch]`
- [ ] Pull latest: `git pull origin [branch]`
- [ ] Read spriteRegistry.ts (existing mappings)
- [ ] Read modified screen files (current visual state)
- [ ] Check console for 404s (prior sprites load correctly)
- [ ] List expected visual state from prior sessions

### During Visual Work:
- [ ] Build on existing sprites (don't duplicate)
- [ ] Preserve prior CSS styling
- [ ] Add NEW visual elements only
- [ ] Test visuals load (no 404 errors)
- [ ] Verify layout not broken

### After Visual Work:
- [ ] All sprites load (0 console errors)
- [ ] Layout looks correct
- [ ] Animations smooth
- [ ] Screenshots as evidence
- [ ] Commit with clear message
- [ ] Push to SAME branch
- [ ] Report completion with handoff note
```

---

## 💡 Tips for Smooth Graphics Fresh Sessions

### **Tip 1: Always Check Console First**
```javascript
// In browser dev tools:
console.clear();
// Navigate to screen with sprites
// Check for 404 errors

// âœ… No errors = sprites from prior session loading correctly
// âŒ 404 errors = missing sprites or wrong paths
```

### **Tip 2: Use grep to Find Existing Work**
```bash
# Find existing sprite mappings
grep -r "CHARACTER_SPRITES" src/data/spriteRegistry.ts

# Find where portraits are used
grep -r "portrait" src/screens/*.tsx

# Find CSS classes added in prior session
grep -r ".rank-up-" src/styles/*.css
```

### **Tip 3: Screenshot Before You Start**
```markdown
Before modifying visuals:
1. Run `npm run dev`
2. Navigate to relevant screen
3. Take screenshot of current state
4. Now you can show before/after!
```

### **Tip 4: Test Incrementally**
```markdown
Don't wait until end to test visuals!

After adding 3 sprites:
âœ… Test them (npm run dev, check screen)

After adding CSS:
âœ… Test layout (reload page, verify)

After animation:
âœ… Test smooth (record video/GIF)

Catch issues early!
```

---

## 🚨 Red Flags: Stop and Verify!

**If you encounter ANY of these, STOP and verify branch:**

âš ï¸ spriteRegistry.ts appears empty (likely wrong branch)  
âš ï¸ Expected sprite mappings not found  
âš ï¸ Screen files don't have expected visual elements  
âš ï¸ Console shows 404 errors for sprites that "should exist"  
âš ï¸ Git status shows unexpected files  
âš ï¸ Task mentions prior work but you don't see it  

**Action:** `git branch --show-current` and verify you're on correct branch!

---

## 📚 Related Graphics Documentation

- **GRAPHICS_ONBOARDING.md** - Complete Graphics AI role and workflow
- **SPRITE_LIBRARY.md** - Inventory of available sprites
- **GRAPHICS_CODER_HANDOFF.md** - Coordination with Coder AI
- **CHAT_TEMPLATES.md** - Graphics task templates

---

## ✅ Success Metrics

**Graphics Fresh Session Protocol working when:**

- âœ… 0 duplicate sprite mappings
- âœ… Prior visual work preserved
- âœ… No console 404 errors (sprites load)
- âœ… Layout consistency maintained
- âœ… CSS from prior sessions intact
- âœ… Branch coordination smooth
- âœ… No git recovery time wasted

**Warning signs protocol needed:**

- ⚠️ Duplicate sprite mappings created
- ⚠️ Sprites from prior session missing (wrong branch)
- ⚠️ Layout broken (overwrote CSS)
- ⚠️ Git push conflicts
- ⚠️ Visual regression (prior work lost)

---

## 🎯 Critical Reminders

**From Test 3 Learnings (Applied to Graphics):**

> "Fresh sessions CANNOT detect prior changes reliably. Must validate explicitly."

**For Graphics:**
- Always specify graphics branch in task
- Always list sprite mappings from prior sessions
- Always check spriteRegistry.ts first
- Never assume visual state
- Always test sprites load (console check)

**This protocol eliminates visual work conflicts!**

---

## ðŸš€ Ready for Graphics Fresh Sessions!

**You now have:**
- âœ… Graphics-specific fresh session checklist
- âœ… Branch verification steps
- âœ… Visual context validation guide
- âœ… Sprite mapping detection workflow
- âœ… Handoff templates

**Your mission:** Continue visual work seamlessly across sessions! 🎨✨

---

**Let's create beautiful visuals without conflicts!** 🎮💎
