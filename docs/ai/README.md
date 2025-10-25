# 🤖 AI Onboarding Documentation

## 📚 Overview

This directory contains comprehensive onboarding documentation for AI assistants working on the NextEraGame project using a **three-tier development workflow**.

---

## 🎭 Three-Tier Workflow Explained

**NextEraGame uses a TRIPLE AI approach:**

1. **🏛️ Architect AI** (Strategic) - Plans features, makes decisions, reviews work
2. **🛠️ Coder AI** (Tactical) - Executes tasks, writes code, runs tests
3. **🎨 Graphics AI** (Visual) - Integrates sprites, polishes UI, creates beauty

**Why three AIs?**
- ✅ Clear separation of concerns (strategy, implementation, visuals)
- ✅ Each AI specializes in their domain
- ✅ Better quality control (architect reviews, graphics AI focuses on beauty)
- ✅ Prevents scope creep and role confusion
- ✅ Scales well (architect coordinates multiple specialists)
- ✅ Visual polish doesn't slow down feature development

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

### **3. GRAPHICS_ONBOARDING.md** 🎨
**For:** Graphics & visual polish AI (Chat #3) - **Project-specific (NextEraGame)**

**Contents:**
- NextEraGame role definition and boundaries
- Golden Sun sprite library guide (2,500+ sprites)
- NextEraGame visual style direction and color palettes
- Sprite integration workflows
- UI/UX polish responsibilities
- Animation and effects creation
- Asset management and organization
- Visual task templates
- Quality standards for visual work

**Read this if:** You are the AI responsible for sprite integration, visual polish, UI beauty, and aesthetic excellence **on the NextEraGame project**.

---

### **4. GRAPHICS_ONBOARDING_GENERALIZED.md** 🎨
**For:** Graphics & visual polish AI - **Generalized template for any project**

**Contents:**
- Universal graphics AI role definition
- General asset integration workflows
- UI/UX polish principles (any visual style)
- Animation and effects creation patterns
- Generic asset management
- Universal visual task templates
- Quality standards for visual work

**Read this if:** You are the AI responsible for visual work **on any project** (not specific to NextEraGame).

---

### **5. ROLE_IDENTIFICATION.md** 🎯
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

### **6. CHAT_TEMPLATES.md** 💬
**For:** Human coordinator

**Contents:**
- Copy-paste initialization messages for all three AIs
- Task handoff templates (architect → coder/graphics)
- Completion report templates (coder/graphics → architect)
- Feedback loop templates
- Full workflow example (leveling system)
- Visual role reminders
- Quick reference commands
- Emergency commands
- Success pattern checklist

**Read this if:** You're starting a new AI session and want exact messages to copy-paste.

---

### **7. CHAT_RESET_GUIDE.md** 🔄
**For:** All roles + Human coordinator

**Contents:**
- When to reset (warning signs for context limits)
- Step-by-step reset process
- Handoff summary templates (Architect/Coder/Graphics)
- Real example from gem redesign session
- Common mistakes to avoid
- Pro tips for efficient resets
- Quick reference checklist

**Read this if:** Your chat context is getting full and you need to start fresh without losing progress.

---

## 🚀 Quick Start Guide

### **For Human Developers:**

1. **Open TWO or THREE separate AI chat sessions**
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
4. **Initialize Graphics (Chat #3 - Optional):**
   ```
   You are the GRAPHICS AI for NextEraGame.
   Read: docs/ai/GRAPHICS_ONBOARDING.md
   ```
5. **Label your chats clearly:** 🏛️ ARCHITECT | 🛠️ CODER | 🎨 GRAPHICS
6. **Follow the workflow:**
   - Ask architect to create task (feature or visual)
   - Give task to coder (logic) or graphics AI (visuals)
   - Specialist executes and reports
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
- ✅ Create detailed task prompts (for coder AND graphics)
- ✅ Review completed work
- ✅ Approve or request changes
- ✅ Decide when to ship (optional—it's a for-fun project!)
- ✅ Define visual direction and style
- ✅ **Simple tasks:** Edit docs, run terminals, adjust text files (use best judgment)

### **Architect (🏛️) DOES NOT:**
- ❌ Write implementation code (feature implementations)
- ❌ Integrate sprites themselves (graphics AI does this)
- ❌ Create CSS styling directly (graphics AI does this)
- ❌ Execute complex terminal workflows (delegate to coder)
- ❌ **Full implementations** (defeats the purpose—delegate to specialists)

---

### **Coder (🛠️) DOES:**
- ✅ Execute logic/system tasks from architect
- ✅ Write clean, tested code
- ✅ Follow architectural patterns
- ✅ Run tests and verification
- ✅ Provide detailed completion reports
- ✅ Build functional systems (stats, battle, progression)

### **Coder (🛠️) DOES NOT:**
- ❌ Choose what features to build
- ❌ Make strategic decisions
- ❌ Decide priorities
- ❌ Determine architecture
- ❌ Decide when to ship
- ❌ Focus on visual polish (graphics AI does this)

---

### **Graphics (🎨) DOES:**
- ✅ Execute visual tasks from architect
- ✅ Integrate Golden Sun sprites
- ✅ Create beautiful UI layouts and polish
- ✅ Design animations and visual effects
- ✅ Manage sprite assets and registry
- ✅ Provide screenshots/videos as evidence
- ✅ Suggest visual improvements

### **Graphics (🎨) DOES NOT:**
- ❌ Choose what features to build
- ❌ Write game logic or systems
- ❌ Modify TypeScript game mechanics
- ❌ Change data structures or types
- ❌ Make strategic decisions
- ❌ Run test suites or type-check

---

## 🔄 Workflow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                        HUMAN DEVELOPER                             │
│                   (Coordinates All Three AIs)                      │
└───────┬──────────────────────┬──────────────────────┬─────────────┘
        │                      │                      │
        │                      │                      │
  ┌─────▼─────┐         ┌──────▼──────┐       ┌──────▼──────┐
  │ ARCHITECT │         │    CODER    │       │  GRAPHICS   │
  │   (🏛️)    │         │    (🛠️)     │       │    (🎨)     │
  │           │         │             │       │             │
  │ • Plan    │  Logic  │ • Systems   │       │ • Sprites   │
  │ • Decide  ├────────►│ • Code      │       │ • Polish    │
  │ • Review  │  Task   │ • Test      │       │ • Beauty    │
  │           │         │ • Report    │       │ • Assets    │
  │           │  Visual │             │       │             │
  │           ├─────────┼─────────────┼──────►│             │
  │           │  Task   │             │       │             │
  │           │◄────────┴─────────────┴───────┤             │
  └───────────┘      Completion Reports       └─────────────┘
```

**Flow:**
1. Architect creates task prompt (logic OR visual)
2. Human relays to coder (logic tasks) or graphics AI (visual tasks)
3. Specialist executes task
4. Specialist provides completion report
5. Human relays to architect
6. Architect reviews and approves (or requests changes)
7. Repeat until approved

---

## 📊 Project Status (Current)

**NextEraGame - Turn-Based Tactical Roguelike**

> **🎮 For-Fun Hobby Project:** No shipping pressure, no commercial deadlines, no player base expectations.  
> **📐 High Standards:** Code quality, logic, and testing guidelines maintained at the highest level (easier on everyone!).  
> **💡 Build for Joy:** Experiment, learn, and have fun—that's the whole point!

- **Status:** Production deployed ✅
- **URL:** <https://nexteragame.netlify.app>
- **Health:** 10/10 score
- **Tests:** 905+ tests, ~99% passing
- **Coverage:** ~50%+
- **TypeScript Errors:** 0
- **Circular Dependencies:** 0
- **Sprites:** 25+ Golden Sun sprites (100% coverage)
- **Visual Quality:** 9.8/10 (professional AAA retro)
- **Features Implemented:**
  - ✅ Battle system (turn-based combat, manual player control)
  - ✅ Recruitment system (with rank merging)
  - ✅ Rewards system (items, equipment, gems)
  - ✅ Equipment system (weapon/armor/accessory/gems)
  - ✅ Save/load system (3 slots + auto-save)
  - ✅ Opponent selection (Golden Sun themed)
  - ✅ **Progression systems** (ranks, gems, abilities, subclasses)
  - ✅ **Golden Sun sprites** (characters, enemies, backgrounds)
  - ✅ **Developer tools** (shortcuts for rapid testing)
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
| Execute a logic task | IMPLEMENTATION_CODER_ONBOARDING.md | 🛠️ Coder |
| Write code/tests | IMPLEMENTATION_CODER_ONBOARDING.md | 🛠️ Coder |
| Verify quality | IMPLEMENTATION_CODER_ONBOARDING.md | 🛠️ Coder |
| Integrate sprites | GRAPHICS_ONBOARDING.md | 🎨 Graphics |
| Polish UI/UX | GRAPHICS_ONBOARDING.md | 🎨 Graphics |
| Add animations | GRAPHICS_ONBOARDING.md | 🎨 Graphics |
| Manage assets | GRAPHICS_ONBOARDING.md | 🎨 Graphics |
| Understand workflow | ROLE_IDENTIFICATION.md | All Three |
| Initialize sessions | CHAT_TEMPLATES.md | Human |
| Handle confusion | ROLE_IDENTIFICATION.md | All Three |

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

- **v2.0** (2025-10-24): Three-tier workflow expansion
  - GRAPHICS_ONBOARDING.md (NEW!)
  - Updated all docs for three-tier workflow
  - Added Graphics AI role boundaries
  - Updated workflow diagrams
  - Added sprite integration guidance

---

**🚀 Ready to build amazing things with a well-coordinated AI team!**
