# 🚀 Quick Start: Send Tasks to Implementation Agent

## Copy-Paste Message for Agent (Task 1 - Fix Tests)

```markdown
You are the Implementation Coder AI for NextEraGame.

**READ THESE FILES IN ORDER:**
1. docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md
2. docs/ai/tasks/TASK_FIX_FAILING_TESTS.md

**After reading, confirm:**
- You understand this is ONLY test fixes (no game logic changes)
- You know which files to modify (test files only)
- You're ready to proceed

**Then execute the task and provide completion report.**
```

---

## Copy-Paste Message for Agent (Task 2 - Gem System)

```markdown
You are the Implementation Coder AI for NextEraGame.

**READ THESE FILES IN ORDER:**
1. docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md
2. docs/ai/COMPREHENSIVE_TEMPLATE_SYSTEM.md (Template 3: System Creation)
3. docs/ai/tasks/TASK_REDESIGN_GEM_SYSTEM.md

**This is a MAJOR refactor (60 mins):**
- Complete redesign of gem system
- New gem selection screen
- Global party stat bonuses
- Battle super spell integration

**After reading, confirm:**
- You understand the new gem mechanics
- You know which files to create/modify/delete
- You have clarifying questions (if any)
- You're ready to proceed

**Then execute the task phase by phase and provide completion report.**
```

---

## What You Need to Include

### For BOTH Tasks

✅ **Implementation Coder Onboarding** (`docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md`)
✅ **The specific task file** (`TASK_FIX_FAILING_TESTS.md` or `TASK_REDESIGN_GEM_SYSTEM.md`)

### Optional (but helpful)

- `docs/ai/COMPREHENSIVE_TEMPLATE_SYSTEM.md` (for Task 2)
- `docs/ai/FRESH_SESSION_PROTOCOL.md` (if using fresh chat)

---

## Expected Timeline

**Task 1 (Fix Tests):**

- Agent reads docs: 3-5 mins
- Agent implements: 20-25 mins
- **Total: ~25-30 mins**

**Task 2 (Gem System):**

- Agent reads docs: 5-7 mins
- Agent implements: 55-65 mins
- **Total: ~60-70 mins**

---

## Success Looks Like

### Task 1

```bash
npm test
# Test Files  47 passed (47)
# Tests       1045 passed | 12 skipped (1045)
# ✅ 100% pass rate!
```

### Task 2

```bash
npm test
# All tests passing
# New gem system working
# Manual testing verified
# ✅ Ready to play!
```

---

## 🎯 Files Ready for Agent

All task files located in: `docs/ai/tasks/`

1. ✅ `TASK_FIX_FAILING_TESTS.md` - Ready to send
2. ✅ `TASK_REDESIGN_GEM_SYSTEM.md` - Ready to send
3. ✅ `README_TASKS.md` - Overview (this file)

---

**You're all set! Send tasks to agents and watch the magic happen!** ✨
