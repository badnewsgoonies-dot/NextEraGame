# ⚡ Quick Start: AI-Assisted Development

**Get up and running with NextEraGame's AI workflow in 5 minutes**

---

## 🎯 What You'll Learn

- How to start Architect and Coder AI chats
- How to create and assign tasks
- How to handle fresh sessions (continuing work)
- Common patterns and best practices

---

## 🚀 Method 1: Single-Session Work (Fastest)

**Use for:** New features, bug fixes, single-session tasks

### **Step 1: Start Coder AI Chat**

**Copy-paste into NEW chat:**
```
You are the IMPLEMENTATION CODER AI for NextEraGame.

Read your onboarding: docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md

After reading, confirm your role and tell me you're ready for tasks.
```

### **Step 2: Give Task Using Template**

**Copy-paste a template from docs/ai/CHAT_TEMPLATES.md and customize:**

**Example - Simple Task:**
```markdown
# Task: Add getMaxHealth Utility

## Context
Project: NextEraGame (C:\Dev\AiGames\NextEraGame)

## Objective
Create utility to calculate max health with equipment bonuses.

## Requirements
- File: src/utils/statUtils.ts (new file)
- Function: getMaxHealth(unit: PlayerUnit): number
- Formula: unit.maxHp + (equippedArmor?.hpBonus || 0)
- Add 3 tests to tests/utils/statUtils.test.ts

## Acceptance
- [ ] TypeScript compiles (0 errors)
- [ ] 3 tests pass
- [ ] Pure function (no mutations)

## Time: 10 minutes
```

### **Step 3: Review Completion**

Coder reports back with:
- ✅ Files created
- ✅ Tests passing
- ✅ TypeScript clean
- ✅ Verification results

**Done!** Feature implemented in one session.

---

## 🏗️ Method 2: Multi-Session Work (With Planning)

**Use for:** Complex features, work that spans multiple sessions

### **Step 1: Start Architect AI Chat**

**Copy-paste into NEW chat:**
```
You are the ARCHITECT AI for NextEraGame.

Read your onboarding: docs/ai/ARCHITECT_ONBOARDING.md

After reading, give me a brief project status summary.
```

### **Step 2: Create Session Plan**

**In Architect chat:**
```
Create a session plan for implementing [feature name].

Use the session planning template from your onboarding.
```

**Architect will provide:**
- Session objectives
- Task breakdown
- Time estimates
- Out-of-scope items
- Success criteria

### **Step 3: Start Coder AI Chat**

**Copy-paste into DIFFERENT NEW chat:**
```
You are the IMPLEMENTATION CODER AI for NextEraGame.

Read your onboarding: docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md

Ready for tasks.
```

### **Step 4: Execute Tasks**

**Copy task from Architect → paste to Coder:**
```
[Architect's detailed task prompt]
```

### **Step 5: Review & Iterate**

**Copy Coder's completion report → paste to Architect:**
```
[Coder's completion report]
```

**Architect reviews and either:**
- ✅ Approves (move to next task)
- 🔄 Requests changes (give feedback to Coder)
- ❌ Rejects (provide corrected task)

---

## 🔄 Method 3: Continuing Work (Fresh Session)

**Use for:** Picking up where you left off in a NEW chat

### **Step 1: Check What Was Done**

**Look at:**
- Previous session's completion report
- Git log: `git log --oneline -5`
- Current branch: `git branch --show-current`

### **Step 2: Start Fresh Coder Session**

**Copy-paste into NEW chat:**
```
You are the IMPLEMENTATION CODER AI for NextEraGame.

Read your onboarding: docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md

**IMPORTANT:** Read FRESH_SESSION_PROTOCOL.md
This is a fresh session continuing prior work.

Ready for fresh session tasks.
```

### **Step 3: Give Task with Context**

**Use Fresh Session Template from CHAT_TEMPLATES.md:**
```markdown
# Task: Add Critical Hit Visual Effects

## 🔄 Fresh Session Context

**This is a NEW session continuing prior work.**

### Prior Work Completed:
- Session 1: Created CriticalHitSystem.ts (logic complete)
- Session 2: Added luck stat to PlayerUnit

### Expected Existing Files:
- `src/systems/CriticalHitSystem.ts` - Crit calculation logic
- `src/types/game.ts` - Has luck field in PlayerUnit
- `tests/systems/CriticalHitSystem.test.ts` - 19 tests passing

### Branch Information:
- **Correct Branch:** `feature/critical-hits`
- **Switch BEFORE starting:** `git checkout feature/critical-hits`

---

## ⚠️ BEFORE Coding:
1. ✅ Run: git checkout feature/critical-hits
2. ✅ Verify CriticalHitSystem.ts exists
3. ✅ Verify luck field in PlayerUnit
4. ✅ THEN start implementation

---

## 🎯 Your Task
[Task details for THIS session]
```

---

## 📋 Task Template Cheat Sheet

### **Choose Your Template:**

| Complexity | Time | Template | Use For |
|------------|------|----------|---------|
| **Simple** | 5-10 min | Template 1 | Single utility function |
| **Medium** | 10-20 min | Template 2 | Type changes, data updates |
| **Complex** | 20-30 min | Template 3 | New system creation |
| **Multi-Session** | Variable | Template 4 | Fresh session continuation |

**Find templates in:** `docs/ai/CHAT_TEMPLATES.md`

---

## ✅ Quality Checklist

**Every task should include:**

```markdown
## Pattern Requirements
- **Result types** for error handling
- **Pure functions** (no mutations)
- **Deterministic RNG** (use IRng)
- **TypeScript strict** (no errors)
- **Comprehensive tests** (cover edge cases)

## Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] ALL tests passing (100% pass rate)
- [ ] Follows project patterns
- [ ] No circular dependencies
```

---

## 🚨 Common Mistakes & Fixes

### **Mistake 1: Vague Task Description**
```markdown
❌ BAD: "Add equipment system"

✅ GOOD: "Create EquipmentSystem.ts with 5 functions:
- equipItem(unit, item): Result<Unit, string>
- unequipItem(unit, slot): Result<Unit, string>
[detailed specs...]"
```

### **Mistake 2: Fresh Session Without Protocol**
```markdown
❌ BAD: 
# Task: Continue crit system
[no context, wrong branch, duplicate work]

✅ GOOD:
# Task: Continue crit system

## 🔄 Fresh Session Context
### Prior Work: [list]
### Branch: feature/critical-hits
### BEFORE Coding: [checklist]
```

### **Mistake 3: No Acceptance Criteria**
```markdown
❌ BAD:
"Add a function"
[no way to verify success]

✅ GOOD:
## Acceptance
- [ ] Function returns Result<T, E>
- [ ] 5 tests pass covering all cases
- [ ] TypeScript 0 errors
```

---

## 💡 Pro Tips

### **Tip 1: Use Real Examples**
- Check `CHAT_TEMPLATES.md` for battle-tested templates
- Copy structure from Tests 1-3 (proven to work)

### **Tip 2: Break Big Features into Sessions**
- Don't try to do too much in one task
- Use session planning (Architect AI)
- Each session = 1-3 related tasks

### **Tip 3: Always Verify Branch**
```bash
# Before every fresh session:
git branch --show-current
git checkout [correct-branch]
git status
```

### **Tip 4: Let AI Self-Recover**
- If type changes break tests → AI can fix
- Don't interrupt for every small issue
- Review completion report to see what was fixed

### **Tip 5: Session Planning Prevents Scope Creep**
```markdown
# 🗓️ Session Plan

## 🎯 Goals
1. Critical hit system (logic only)

## 🚫 Out of Scope  
- Visual effects (next session)
- Equipment modifiers (future)
```

---

## 🎯 Workflow Flowchart

```
START
  │
  ▼
Need Planning? ────YES───> Use Architect AI
  │                         Create Session Plan
  NO                               │
  │                                │
  │<───────────────────────────────┘
  ▼
New Session? ──YES─> Use Fresh Session Template
  │                  (Branch + Context)
  NO
  │
  ▼
Pick Template
  │
  ├─> Simple (5-10m)   → Template 1
  ├─> Medium (10-20m)  → Template 2
  ├─> Complex (20-30m) → Template 3
  └─> Multi-Session    → Template 4
  │
  ▼
Give to Coder AI
  │
  ▼
Coder Executes
  │
  ▼
Review Completion
  │
  ├─> ✅ Approve ────> Next Task
  ├─> 🔄 Changes ───> Give Feedback
  └─> ❌ Reject ────> Revise Task
```

---

## 📚 Documentation Quick Links

### **Must-Read:**
- `CHAT_TEMPLATES.md` - Copy-paste templates
- `FRESH_SESSION_PROTOCOL.md` - For new sessions

### **Deep Dives:**
- `ARCHITECT_ONBOARDING.md` - Strategic planning
- `IMPLEMENTATION_CODER_ONBOARDING.md` - Code patterns
- `ROLE_IDENTIFICATION.md` - Workflow clarity

### **Reference:**
- `IMPROVEMENTS_SUMMARY.md` - What we learned
- `README.md` - Full overview

---

## 🎉 You're Ready!

**Basic Workflow:**
1. Choose template based on complexity
2. Start Coder AI chat
3. Give task using template
4. Review completion
5. Repeat!

**Advanced Workflow:**
1. Start Architect AI chat
2. Create session plan
3. Start Coder AI chat (separate)
4. Execute tasks from plan
5. Review with Architect
6. Iterate!

**Fresh Sessions:**
1. Start NEW Coder AI chat
2. Tell it to read FRESH_SESSION_PROTOCOL.md
3. Use Fresh Session template
4. Verify branch FIRST
5. Execute task!

---

**Let's build something amazing! 🚀**
