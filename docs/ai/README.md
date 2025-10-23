# 🤖 AI Onboarding Documentation

## 📚 Overview

This directory contains comprehensive onboarding documentation for AI assistants working on the NextEraGame project using a **two-tier development workflow**.

---

## 🎭 Two-Tier Workflow Explained

**NextEraGame uses a DUAL AI approach:**

1. **🏛️ Architect AI** (Strategic) - Plans features, makes decisions, reviews work
2. **🛠️ Coder AI** (Tactical) - Executes tasks, writes code, runs tests

**Why two AIs?**
- ✅ Clear separation of concerns
- ✅ Strategic thinking separated from tactical execution
- ✅ Better quality control (architect reviews coder's work)
- ✅ Prevents scope creep (coder can't deviate from plan)
- ✅ Scales well (architect can manage multiple tasks)

---

## 📁 Files in This Directory

### **1. ARCHITECT_ONBOARDING.md** 🏛️
**For:** Strategic planning AI (Chat #1)

**Contents:**
- Role definition and boundaries
- Project context (NextEraGame specifics)
- Strategic responsibilities
- Task prompt creation templates
- Completion review framework
- Quality enforcement standards
- Decision-making frameworks (ship vs. build)
- Success metrics

**Read this if:** You are the AI responsible for planning, deciding priorities, and reviewing work.

---

### **2. IMPLEMENTATION_CODER_ONBOARDING.md** 🛠️
**For:** Code execution AI (Chat #2)

**Contents:**
- Role definition and boundaries
- Architectural patterns (Result types, RNG, pure functions)
- Code quality standards (mandatory rules)
- Testing requirements and examples
- Acceptance criteria checklist
- DO/DON'T rules
- Completion report template
- Project structure and tech stack

**Read this if:** You are the AI responsible for writing code, creating tests, and executing tasks.

---

### **3. ROLE_IDENTIFICATION.md** 🎯
**For:** Both AIs + Human coordinator

**Contents:**
- Quick role identification guide
- Boundary enforcement rules
- What to do if roles get confused
- Two-chat workflow visualization
- Common confusion prevention
- Handoff protocol (task → execution → report → review)
- Session initialization scripts
- Emergency stop phrases
- Success indicators and warning signs

**Read this if:** You need clarity on role boundaries or the workflow is getting messy.

---

### **4. CHAT_TEMPLATES.md** 💬
**For:** Human coordinator

**Contents:**
- Copy-paste initialization messages for both AIs
- Task handoff templates (architect → coder)
- Completion report templates (coder → architect)
- Feedback loop templates
- Full workflow example (leveling system)
- Visual role reminders
- Quick reference commands
- Emergency commands
- Success pattern checklist

**Read this if:** You're starting a new AI session and want exact messages to copy-paste.

---

## 🚀 Quick Start Guide

### **For Human Developers:**

1. **Open TWO separate AI chat sessions**
2. **Initialize Architect (Chat #1):**
   ```
   You are the ARCHITECT AI for NextEraGame.
   Read: docs/ai/ARCHITECT_ONBOARDING.md
   ```
3. **Initialize Coder (Chat #2):**
   ```
   You are the IMPLEMENTATION CODER AI for NextEraGame.
   Read: docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md
   ```
4. **Label your chats clearly:** 🏛️ ARCHITECT | 🛠️ CODER
5. **Follow the workflow:**
   - Ask architect to create task
   - Give task to coder
   - Coder executes and reports
   - Give report to architect
   - Architect reviews and approves

---

### **For AI Assistants:**

**If user said "Read architect onboarding":**
1. Read `ARCHITECT_ONBOARDING.md`
2. Confirm: "I'm the architect AI. I will plan, decide, and review. I will NOT write implementation code."
3. Provide project status summary
4. Ask: "What would you like me to plan or decide?"

**If user said "Read coder onboarding":**
1. Read `IMPLEMENTATION_CODER_ONBOARDING.md`
2. Confirm: "I'm the implementation coder AI. I will execute tasks, write code, and test. I will NOT make strategic decisions."
3. Ask: "What task would you like me to execute?"

---

## 🎯 Role Boundaries (CRITICAL)

### **Architect (🏛️) DOES:**
- ✅ Decide what features to build
- ✅ Set priorities and timelines
- ✅ Create detailed task prompts
- ✅ Review completed work
- ✅ Approve or request changes
- ✅ Decide when to ship

### **Architect (🏛️) DOES NOT:**
- ❌ Write implementation code
- ❌ Create/modify source files
- ❌ Run tests or type-check
- ❌ Execute terminal commands
- ❌ Make file edits

---

### **Coder (🛠️) DOES:**
- ✅ Execute tasks from architect
- ✅ Write clean, tested code
- ✅ Follow architectural patterns
- ✅ Run tests and verification
- ✅ Provide detailed completion reports
- ✅ Ask clarifying questions about tasks

### **Coder (🛠️) DOES NOT:**
- ❌ Choose what features to build
- ❌ Make strategic decisions
- ❌ Decide priorities
- ❌ Determine architecture
- ❌ Decide when to ship

---

## 🔄 Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      HUMAN DEVELOPER                         │
│                   (Coordinates Both AIs)                     │
└──────────┬────────────────────────────────┬──────────────────┘
           │                                │
           │                                │
    ┌──────▼──────┐                  ┌──────▼──────┐
    │ ARCHITECT   │                  │    CODER    │
    │   (🏛️)      │                  │    (🛠️)     │
    │             │                  │             │
    │ • Plan      │   Task Prompt    │ • Execute   │
    │ • Decide    ├─────────────────►│ • Test      │
    │ • Review    │                  │ • Report    │
    │             │◄─────────────────┤             │
    └─────────────┘ Completion Report└─────────────┘
```

**Flow:**
1. Architect creates task prompt
2. Human relays to coder
3. Coder executes task
4. Coder provides completion report
5. Human relays to architect
6. Architect reviews and approves (or requests changes)
7. Repeat until approved

---

## 📊 Project Status (Current)

**NextEraGame - Turn-Based Tactical Roguelike**

- **Status:** Production deployed ✅
- **URL:** https://dist-next-era.vercel.app
- **Health:** 10/10 score
- **Tests:** 625 tests, 100% passing
- **Coverage:** ~45-50%
- **TypeScript Errors:** 0
- **Circular Dependencies:** 0
- **Features Implemented:**
  - ✅ Battle system (turn-based combat)
  - ✅ Recruitment system
  - ✅ Rewards system
  - ✅ Equipment system (weapon/armor/accessory)
  - ✅ Save/load system (3 slots + auto-save)
  - ✅ Opponent selection
  - ✅ Starter unit selection

**Tech Stack:**
- React 19 + TypeScript strict
- Vite 5 (build tool)
- Vitest 2.1.9 (testing)
- pure-rand (deterministic RNG)
- Tailwind CSS v4

**Architecture:**
- Functional programming (pure functions)
- Result type pattern (type-safe errors)
- Deterministic RNG (seeded randomness)
- State machine (game flow)

---

## 🎓 Learning Path

**For new AIs joining the project:**

1. **Start here:** Read your role-specific onboarding (ARCHITECT or CODER)
2. **Understand boundaries:** Read ROLE_IDENTIFICATION.md
3. **Learn workflow:** Review CHAT_TEMPLATES.md examples
4. **Study project:** Review existing code patterns
5. **Confirm understanding:** Ask human for a simple test task

---

## 🆘 Troubleshooting

### **Problem: Not sure which AI you are**
**Solution:** Ask human: "Am I the architect or implementation coder?"

### **Problem: Other AI is doing your job**
**Solution:** Remind them: "Please check ROLE_IDENTIFICATION.md - that's not your role."

### **Problem: Workflow feels messy**
**Solution:** Reset both chats, re-read onboarding files, start fresh.

### **Problem: Architect writing code**
**Solution:** STOP. Read ARCHITECT_ONBOARDING.md. Create task prompt instead.

### **Problem: Coder making strategic decisions**
**Solution:** STOP. Read IMPLEMENTATION_CODER_ONBOARDING.md. Ask architect for guidance.

---

## 📞 Quick Reference

| Need to... | File to Read | AI Role |
|------------|--------------|---------|
| Plan a feature | ARCHITECT_ONBOARDING.md | 🏛️ Architect |
| Create a task prompt | ARCHITECT_ONBOARDING.md | 🏛️ Architect |
| Review completed work | ARCHITECT_ONBOARDING.md | 🏛️ Architect |
| Execute a task | IMPLEMENTATION_CODER_ONBOARDING.md | 🛠️ Coder |
| Write code/tests | IMPLEMENTATION_CODER_ONBOARDING.md | 🛠️ Coder |
| Verify quality | IMPLEMENTATION_CODER_ONBOARDING.md | 🛠️ Coder |
| Understand workflow | ROLE_IDENTIFICATION.md | Both |
| Initialize sessions | CHAT_TEMPLATES.md | Human |
| Handle confusion | ROLE_IDENTIFICATION.md | Both |

---

## ✨ Best Practices

**For Architects:**
- Create detailed, unambiguous task prompts
- Set clear acceptance criteria
- Review thoroughly before approving
- Make strategic decisions confidently
- Don't micromanage implementation details

**For Coders:**
- Follow task prompts exactly
- Ask questions if unclear
- Test thoroughly before reporting
- Provide detailed completion reports
- Don't deviate from the plan

**For Humans:**
- Keep chats clearly labeled
- Copy full task prompts/reports between chats
- Don't let roles blur
- Let each AI do their job
- Coordinate the handoffs smoothly

---

## 🎯 Success Metrics

**You're doing it right when:**

✅ Each AI stays in their lane (no role confusion)  
✅ Task prompts are detailed and clear  
✅ Coder executes tasks without strategic deviations  
✅ Completion reports are thorough  
✅ Architect reviews before approving  
✅ Handoffs are smooth (task → execute → report → review)  
✅ Quality stays high (100% tests, 0 errors, 0 circular deps)  
✅ Both AIs understand their boundaries  

---

## 📝 Version History

- **v1.0** (2025-01-23): Initial creation
  - ARCHITECT_ONBOARDING.md
  - IMPLEMENTATION_CODER_ONBOARDING.md
  - ROLE_IDENTIFICATION.md
  - CHAT_TEMPLATES.md
  - README.md (this file)

---

**🚀 Ready to build amazing things with a well-coordinated AI team!**
