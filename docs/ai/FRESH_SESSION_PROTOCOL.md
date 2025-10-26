# 🔄 Fresh Session Protocol

**Critical instructions for starting new AI coding sessions on existing work**

---

## ⚠️ THE PROBLEM

When starting a **fresh AI session** (new chat, no prior context):
- ❌ Can't see what previous sessions did
- ❌ May not detect recent changes
- ❌ Git branch confusion
- ❌ Risk of duplicate work or conflicts

**This document solves that.**

---

## ✅ THE SOLUTION: Fresh Session Checklist

**Copy this into EVERY fresh session prompt:**

```markdown
## 🚀 Fresh Session Setup (DO THIS FIRST!)

### Step 1: Branch Setup
**CRITICAL: Run these commands BEFORE any code work:**

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

### Step 2: Context Validation
**Verify these dependencies exist:**

- [ ] List expected files from prior sessions
- [ ] Check for expected code patterns  
- [ ] Read key files to confirm changes
- [ ] Note any missing dependencies

### Step 3: Start Implementation
**ONLY NOW can you begin coding!**
```

---

## 📋 Fresh Session Task Template

**Use this template for tasks in new sessions:**

```markdown
# Task: [Feature Name]

## 🔄 Fresh Session Context

**This is a NEW session continuing prior work.**

### Prior Work Completed:
- Session 1: [What was done]
- Session 2: [What was done]
- [List all relevant prior work]

### Expected Existing Files:
- `path/to/file1.ts` - [What it contains]
- `path/to/file2.ts` - [What it contains]
- [List all files that SHOULD exist]

### Branch Information:
- **Correct Branch:** `[exact-branch-name]`
- **DO NOT use:** main, master, or other branches
- **Switch BEFORE starting:** `git checkout [branch-name]`

---

## 🎯 Your Task

[Normal task description continues here...]

---

## ⚠️ CRITICAL INSTRUCTIONS

### BEFORE Writing Any Code:
1. ✅ Switch to correct branch
2. ✅ Verify expected files exist  
3. ✅ Read key files for context
4. ✅ Confirm dependencies present

### Git Workflow:
- **DO:** Create new branch for THIS session
- **DO:** Cherry-pick prior commits if needed
- **DON'T:** Push to shared branch (avoid conflicts)
- **DON'T:** Assume branch state

### If Files Missing:
- STOP and report: "Expected file X not found"
- DON'T recreate work from prior sessions
- ASK for clarification on branch/state
```

---

## 🎯 Real Example from Testing

**Test 3: Critical Hit System (Fresh Session)**

**What Went Wrong:**
```markdown
# Initial Attempt
- Started on wrong branch (main)
- Didn't see luck field from Session 2
- Tried to re-add luck field (duplicate work)
- Created merge conflicts
- Git push failures
- Branch confusion
```

**What Should Have Happened:**
```markdown
# Correct Approach

## 🔄 Fresh Session Setup

### Step 1: Branch
```bash
git checkout claude/add-random-element-util-011CUUWyg2WA4PiuwTLXj8MM
```

### Step 2: Verify Expected State
- [ ] `src/utils/arrayUtils.ts` exists (Session 1)
- [ ] `src/types/game.ts` has luck field (Session 2)
- [ ] All 12 starter units have luck values
- [ ] 1034+ tests passing

### Step 3: Start Critical Hit Work
Now implement CriticalHitSystem knowing luck already exists!
```

**Result with Correct Protocol:**
- ✅ No duplicate work
- ✅ No merge conflicts
- ✅ Clean integration
- ✅ Faster completion

---

## 🔍 Detection: Am I In Fresh Session?

**Signs you're in a fresh session:**

1. **No prior messages** in this chat
2. **Don't remember** previous conversations
3. **Task references** "continuing from prior work"
4. **Multiple sessions** mentioned in task description

**If ANY of these are true → Use Fresh Session Protocol!**

---

## 🚨 Common Fresh Session Mistakes

### **Mistake 1: Wrong Branch**
```bash
# WRONG
*starts on main branch*
*doesn't check branch*

# CORRECT  
git branch --show-current
git checkout [correct-branch]
```

### **Mistake 2: Missing Context**
```bash
# WRONG
"I'll add the luck field to PlayerUnit"
*field already exists from Session 2*

# CORRECT
git checkout [branch]
grep "luck" src/types/game.ts
*sees it exists*
"Luck field already present, proceeding with CriticalHitSystem"
```

### **Mistake 3: Duplicate Work**
```bash
# WRONG
*recreates arrayUtils.ts that exists*
*creates merge conflict*

# CORRECT
ls src/utils/arrayUtils.ts
*file exists*
"arrayUtils already present from Session 1, importing it"
```

### **Mistake 4: Push Conflicts**
```bash
# WRONG
git push origin [shared-branch]
*conflicts with Session 2 work*

# CORRECT
git checkout -b [new-session-branch]
git cherry-pick [session-1-commits]
git cherry-pick [session-2-commits]
git push origin [new-session-branch]
*clean push, no conflicts*
```

---

## 📊 Fresh Session Workflow

```
┌─────────────────────────────────────┐
│   NEW SESSION STARTS                │
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
        │  Correct    │
        │  Branch?    │
        └──────┬──────┘
          YES  │  NO
          ┌────┴────┐
          │         │
          ▼         ▼
    ┌─────────┐  ┌──────────────┐
    │Continue │  │git checkout  │
    │         │  │[correct-br]  │
    └────┬────┘  └──────┬───────┘
         │              │
         └──────┬───────┘
                ▼
┌─────────────────────────────────────┐
│  Step 2: VERIFY CONTEXT             │
│  - List expected files              │
│  - Check for recent changes         │
│  - Read key files                   │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │  Context    │
        │  Valid?     │
        └──────┬──────┘
          YES  │  NO
          ┌────┴────┐
          │         │
          ▼         ▼
    ┌─────────┐  ┌──────────────┐
    │Continue │  │STOP & REPORT │
    │         │  │Missing deps  │
    └────┬────┘  └──────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Step 3: START CODING               │
│  - Implement task                   │
│  - Use existing code                │
│  - Build on prior work              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Step 4: COMMIT STRATEGY            │
│  Option A: New branch (recommended) │
│  Option B: Shared branch (conflicts)│
└─────────────────────────────────────┘
```

---

## 🎯 Session Handoff Format

**End of each session, provide handoff for next session:**

```markdown
## 📋 Session Handoff for Next Time

### What Was Completed:
- ✅ [Feature 1] - src/systems/X.ts created
- ✅ [Feature 2] - 19 tests added (all passing)
- ✅ [Feature 3] - Integrated with Y system

### Current State:
- **Branch:** `claude/feature-branch-name`
- **Tests:** 1047 passing
- **TypeScript:** 0 errors
- **Commits:** Pushed to origin

### Files Modified/Created:
```
src/systems/CriticalHitSystem.ts       (NEW)
tests/systems/CriticalHitSystem.test.ts (NEW)
src/types/game.ts                      (Modified - added luck)
src/data/starterUnits.ts               (Modified - added luck values)
```

### Next Session Should:
1. Integrate crits into battle UI
2. Add visual effects for critical hits
3. Test full battle flow with crits

### Fresh Session Checklist:
- [ ] `git checkout claude/feature-branch-name`
- [ ] Verify CriticalHitSystem.ts exists
- [ ] Verify luck field in PlayerUnit
- [ ] Confirm 1047+ tests passing
```

---

## 💡 Best Practices

### **DO:**
✅ Always specify exact branch in task  
✅ List all expected dependencies  
✅ Verify state before coding  
✅ Create new branch for session  
✅ Cherry-pick when needed  
✅ Report missing context immediately  

### **DON'T:**
❌ Assume branch state  
❌ Skip context verification  
❌ Recreate existing work  
❌ Push to shared branches  
❌ Ignore prior sessions  
❌ Trust default branch  

---

## 📚 Related Documentation

- **ARCHITECT_ONBOARDING.md** - Session planning guidelines
- **IMPLEMENTATION_CODER_ONBOARDING.md** - Code execution patterns
- **CHAT_TEMPLATES.md** - Copy-paste task templates

---

## 🎯 Quick Reference

**Every fresh session:**
1. ✅ Check/switch branch
2. ✅ Verify dependencies
3. ✅ Read key files
4. ✅ Start coding
5. ✅ New branch for push

**When in doubt:**
- STOP and verify branch
- CHECK for existing work
- ASK if context unclear

---

**This protocol prevents 90% of fresh session issues!** 🚀

---

## 📚 RELATED PROTOCOLS

- **INTERRUPTION_RECOVERY.md** - If prior session incomplete (interrupted)
- **AI_HANDOFF_PROTOCOL.md** - Verify you understand prior handoff
