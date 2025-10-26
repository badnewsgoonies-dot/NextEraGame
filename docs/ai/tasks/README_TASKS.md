# 📋 Current Tasks for Implementation

## Overview

Two tasks ready for implementation in separate agent chats:

### **Task 1: Fix Failing Tests** ⚡ (QUICK - 25 mins)
**Priority:** HIGH (blocks 100% test pass rate)
**File:** `TASK_FIX_FAILING_TESTS.md`
**Complexity:** LOW
**Impact:** Get from 98.5% → 100% test pass rate

**What it does:**
- Fixes 5 failing tests (4 gem tests + 1 starter screen test)
- Updates test expectations to match current code
- NO game logic changes
- Quick win to restore test health

---

### **Task 2: Redesign Gem System** 🎮 (MAJOR - 60 mins)
**Priority:** HIGH (system is 100% broken)
**File:** `TASK_REDESIGN_GEM_SYSTEM.md`
**Complexity:** HIGH
**Impact:** Completely rebuilds gem system with correct architecture

**What it does:**
- Adds gem selection screen after roster selection
- Global party stat bonuses based on elemental affinity
- Grants spells to matching/counter element units
- Battle super spell button (one-time per battle)
- Deletes old broken gem system

---

## 🎯 Recommended Execution Order

### **Option A: Sequential (Recommended)**
1. **First:** Fix failing tests (25 mins)
   - Gets to 100% test coverage
   - Clean slate before major work
   - Boosts confidence
2. **Second:** Redesign gem system (60 mins)
   - Start fresh with all tests passing
   - Can see if gem redesign breaks anything

### **Option B: Parallel** 
- Run Task 1 in one agent chat
- Run Task 2 in another agent chat simultaneously
- **Risk:** Task 2 may modify test files Task 1 is fixing
- **Mitigation:** Task 1 finishes quickly, merge it first

---

## 📦 What to Include When Sending to Agent

### **For Each Task, Send:**

1. **Onboarding Document:**
   ```
   Read this first: docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md
   ```

2. **Task Prompt:**
   ```
   Task 1: docs/ai/tasks/TASK_FIX_FAILING_TESTS.md
   Task 2: docs/ai/tasks/TASK_REDESIGN_GEM_SYSTEM.md
   ```

3. **Starting Message Template:**
   ```markdown
   You are the Implementation Coder AI for NextEraGame.
   
   Read these files in order:
   1. docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md (your role)
   2. docs/ai/tasks/TASK_[NAME].md (your task)
   
   After reading:
   - Confirm you understand the task
   - List the files you'll modify
   - Ask any clarifying questions
   - Wait for approval
   - Then proceed with implementation
   ```

---

## ✅ Success Criteria

### **Task 1 Complete When:**
- [ ] 1045/1045 tests passing (100%)
- [ ] TypeScript 0 errors
- [ ] No game logic changed
- [ ] Completion report provided

### **Task 2 Complete When:**
- [ ] Gem selection screen works
- [ ] Stat bonuses applied to party
- [ ] Spells granted correctly
- [ ] Battle super spell works
- [ ] All tests passing
- [ ] Manual testing checklist completed
- [ ] Old gem system deleted

---

## 🚨 Important Notes

### **For Task 1:**
- Tests may need creative fixes (console.warn capture issues)
- Focus on making tests pass, not changing game code
- Should be straightforward

### **For Task 2:**
- This is a MAJOR refactor (60 mins)
- Deletes old system entirely
- Adds new screen to game flow
- Requires careful testing
- Agent should ask questions if unclear

---

## 📞 Communication Tips

### **When Agent Asks Questions:**
- Provide specific answers
- Reference exact line numbers if possible
- Confirm understanding before proceeding

### **If Agent Gets Stuck:**
- Ask them to show current code
- Review what they've tried
- Suggest alternative approaches
- Break into smaller subtasks

### **Red Flags to Watch For:**
- Agent changing game logic (Task 1 should ONLY change tests)
- Agent not following project patterns
- Agent skipping tests
- Agent not providing completion report

---

## 🎯 After Both Tasks Complete

You should have:
- ✅ 100% test pass rate
- ✅ Working gem system with new architecture
- ✅ Gem selection screen integrated into game flow
- ✅ Battle super spell functional
- ✅ All systems tested and verified

**Ready to ship!** 🚀

---

**Questions?** Check the onboarding docs or ask in chat!
