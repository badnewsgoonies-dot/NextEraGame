# 💬 AI Chat Initialization Templates

## Quick Start: Copy-Paste These Exact Messages

---

## 🏛️ Starting an Architect Chat

**Copy this message into a NEW chat:**

```
You are the ARCHITECT AI for the NextEraGame project.

Your role:
- Strategic planning and decision-making
- Create detailed task prompts for implementation
- Review completed work
- Decide priorities and timelines
- DO NOT write implementation code

Read your onboarding document: docs/ai/ARCHITECT_ONBOARDING.md

After reading, confirm your role and give me a brief project status summary.
```

**Expected Response:**
> Architect confirms role, reads onboarding, provides status summary of NextEraGame (905 tests, 10/10 health, etc.)

---

## 🛠️ Starting a Coder Chat

**Copy this message into a DIFFERENT NEW chat:**

```
You are the IMPLEMENTATION CODER AI for the NextEraGame project.

Your role:
- Execute tasks provided by the architect
- Write clean, tested, type-safe code
- Follow project patterns strictly
- Report completion with full verification
- DO NOT make strategic decisions

Read your onboarding document: docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md

After reading, confirm your role and tell me you're ready to receive tasks.
```

**Expected Response:**
> Coder confirms role, reads onboarding, indicates readiness to receive and execute tasks

---

## 🎨 Starting a Graphics Chat

**Copy this message into a THIRD NEW chat:**

```
You are the GRAPHICS & VISUAL POLISH AI for the NextEraGame project.

Your role:
- Integrate Golden Sun sprites into the game
- Create beautiful, polished UI layouts
- Design visual feedback and animations
- Improve aesthetic quality across all screens
- Manage sprite assets and visual consistency
- DO NOT write game logic or make strategic decisions

Read your onboarding document: docs/ai/GRAPHICS_ONBOARDING.md

After reading, confirm your role and tell me you're ready to make the game beautiful.
```

**Expected Response:**
> Graphics AI confirms role, reads onboarding, explores sprite library, indicates readiness to create visual excellence

---

---

## 🧪 Real Task Templates (Battle-Tested)

**These templates are from actual successful implementations. Copy and adapt them.**

---

### **Template 1: Simple Utility Function** (5-10 mins)

**Complexity:** Low | **Risk:** Low | **Value:** Medium

```markdown
# Task: Add [Function Name] Utility Function

## Context
Project: NextEraGame (C:\Dev\AiGames\NextEraGame)
Pattern: Pure functions, uses seeded RNG from pure-rand

## Objective
Create a utility function that [one sentence description].

## Requirements
- File: src/utils/[filename].ts (create new file)
- Function: [name]<T>([params]): [return type]
- [Specific requirement 1]
- [Specific requirement 2]
- Pure function (no mutations)
- Add [N] tests to tests/utils/[filename].test.ts

## Acceptance
- [ ] TypeScript compiles (0 errors)
- [ ] [N] tests pass ([list test cases])
- [ ] Uses deterministic RNG (if applicable)

## Time: 5-10 minutes
```

**Real Example:**
```markdown
# Task: Add getRandomElement Utility Function

## Context
Project: NextEraGame
Pattern: Pure functions, uses seeded RNG from pure-rand

## Objective
Create a utility function that returns a random element from an array using our deterministic RNG.

## Requirements
- File: src/utils/arrayUtils.ts (create new file)
- Function: getRandomElement<T>(array: T[], rng: IRng): T | undefined
- Return undefined for empty arrays
- Use our IRng type from src/utils/rng.ts
- Pure function (no mutations)
- Add 3 tests to tests/utils/arrayUtils.test.ts

## Acceptance
- [ ] TypeScript compiles (0 errors)
- [ ] 3 tests pass (empty array, single element, multiple elements)
- [ ] Uses deterministic RNG

## Time: 5 minutes
```

---

### **Template 2: Add Field to Type** (10-15 mins)

**Complexity:** Medium | **Risk:** Medium (breaking change) | **Value:** High

```markdown
# Task: Add [FieldName] to [TypeName]

## Context
Project: NextEraGame
Pattern: Pure functions, TypeScript strict mode, comprehensive testing

## Objective
Add [field] to [type] type and update all usages.

## Requirements

1. **Update Type Definition:**
   - File: src/types/game.ts
   - Add `[fieldName]: [type]` to [Interface] (find existing interface)
   - DO NOT modify any other interfaces

2. **Update Data Files:**
   - File: [path to data file]
   - Add `[fieldName]: [defaultValue]` to ALL [N] instances
   - Keep all existing properties

3. **Create Tests:**
   - File: tests/integration/[name].test.ts (new file)
   - Test 1: Verify type has field
   - Test 2: Verify all instances have field = [value]
   - Test 3: Verify TypeScript compilation with field

## Pattern Requirements
- No mutations (pure data updates)
- TypeScript must compile with 0 errors
- ALL existing tests must still pass

## Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] ALL existing tests still pass ([N]+ tests)
- [ ] 3 new tests pass
- [ ] All [N] instances have [field]: [value]

## Skip Git Operations
DO NOT commit or push - this is a test task.

## Time: 10-15 minutes
```

**Real Example:**
```markdown
# Task: Add "Luck" Stat to PlayerUnit

## Context
Project: NextEraGame
Pattern: Pure functions, TypeScript strict mode

## Objective
Add luck stat to PlayerUnit type and update starter units to include it.

## Requirements

1. **Update Type Definition:**
   - File: src/types/game.ts
   - Add `luck: number` to PlayerUnit interface
   - DO NOT modify any other interfaces

2. **Update Starter Units:**
   - File: src/data/starterUnits.ts
   - Add `luck: 5` to ALL 12 starter units
   - Keep all existing properties

3. **Create Tests:**
   - File: tests/integration/luck.stat.test.ts
   - Test 1: PlayerUnit type has luck field
   - Test 2: All 12 starter units have luck = 5
   - Test 3: TypeScript compilation with luck field

## Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] ALL existing tests still pass (743+ tests)
- [ ] 3 new tests pass
- [ ] All 12 starter units have luck: 5

## Time: 10 minutes
```

---

### **Template 3: Create New System** (20-30 mins)

**Complexity:** High | **Risk:** Medium | **Value:** High

```markdown
# Task: Add [SystemName]

## Context
Project: NextEraGame
Branch: [branch-name]
Pattern: Copy [ExistingSystem] structure (uses Result types, pure functions)

## Objective
Create a system to [one sentence description].

## Requirements

### 1. Create System File
- File: src/systems/[SystemName].ts (NEW file)
- Pattern: Copy structure from src/systems/[ExistingSystem].ts
- Use Result types for error handling
- Pure functions (no mutations)
- Deterministic RNG

### 2. Function Signature
```typescript
export function [functionName](
  [param1]: [Type1], 
  [param2]: [Type2]
): Result<[SuccessType], [ErrorType]>
```

### 3. Formula/Logic
```
[Describe the calculation or logic]
```

### 4. Create Tests
- File: tests/systems/[SystemName].test.ts (NEW file)
- Pattern: Copy test structure from tests/systems/[ExistingSystem].test.ts
- Required tests:
  - [Test case 1]
  - [Test case 2]
  - [Test case 3]
  - Test determinism (same seed + same input = same result)
  - [Additional tests as needed]

### 5. Integration Check
- Verify it works WITH existing changes
- Can import needed types
- Uses pure function patterns like other systems

## Pattern Requirements
- **Result type** - All functions return Result<T, E>
- **Pure functions** - No mutations, no side effects
- **Deterministic RNG** - Use IRng, not Math.random()
- **TypeScript strict** - No type errors
- **Comprehensive tests** - 10+ tests minimum

## Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] 10+ new tests created
- [ ] ALL new tests passing
- [ ] ALL existing tests still pass
- [ ] Follows pure function pattern
- [ ] Uses Result type correctly
- [ ] Deterministic (same seed = same outcome)

## Skip Git Operations
DO NOT commit or push - this is a test task.

## Time Target: 20-30 minutes

## Reference Files to Copy Patterns From
- src/systems/[ExistingSystem].ts (system structure)
- tests/systems/[ExistingSystem].test.ts (test structure)
- src/utils/Result.ts (Result type usage)
- src/utils/rng.ts (IRng interface)
```

**Real Example:**
```markdown
# Task: Add Critical Hit System

## Context
Project: NextEraGame
Branch: claude/add-random-element-util-011CUUWyg2WA4PiuwTLXj8MM
Pattern: Copy EquipmentSystem structure

**Important:** This is a fresh session. Previous work exists:
- Test 1: Created src/utils/arrayUtils.ts
- Test 2: Added luck stat to PlayerUnit type

## Objective
Create a system to calculate critical hits based on the luck stat.

## Requirements

### 1. Create System File
- File: src/systems/CriticalHitSystem.ts (NEW file)
- Pattern: Copy structure from src/systems/EquipmentSystem.ts
- Use Result types, pure functions, deterministic RNG

### 2. Function Signature
```typescript
export function checkCriticalHit(
  attacker: PlayerUnit, 
  rng: IRng
): Result<boolean, never>
```

### 3. Formula
```typescript
critChance = attacker.luck / 100
// luck: 5 = 5% crit chance
// luck: 50 = 50% crit chance
// Use rng.nextInt(0, 99) to determine if crit occurs
```

### 4. Create Tests
- File: tests/systems/CriticalHitSystem.test.ts (NEW file)
- Required tests:
  - Test with luck = 0 (never crits)
  - Test with luck = 100 (always crits)
  - Test determinism (same seed = same result)
  - Test with luck = 50 (~50% over 100 rolls)
  - Test invalid luck values
  - Test Result type returned correctly

## Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] 10+ new tests created and passing
- [ ] ALL existing tests still pass (1034+)
- [ ] Uses Result type and pure functions
- [ ] Deterministic (same seed = same outcome)

## Skip Git Operations
DO NOT commit or push.

## Time: 20 minutes
```

---

### **Template 4: Fresh Session Task** (Variable)

**Use when continuing work from previous sessions in a NEW chat.**

```markdown
# Task: [Feature Name]

## 🔄 Fresh Session Context

**This is a NEW session continuing prior work.**

### Prior Work Completed:
- Session 1: [What was done]
- Session 2: [What was done]

### Expected Existing Files:
- `path/to/file1.ts` - [What it contains]
- `path/to/file2.ts` - [What it contains]

### Branch Information:
- **Correct Branch:** `[exact-branch-name]`
- **Switch BEFORE starting:** `git checkout [branch-name]`

---

## 🎯 Your Task

[Normal task description...]

---

## ⚠️ CRITICAL INSTRUCTIONS

### BEFORE Writing Any Code:
1. ✅ `git checkout [branch-name]`
2. ✅ `git status` - verify expected files
3. ✅ Read key files for context
4. ✅ Confirm dependencies present

### If Files Missing:
- STOP and report: "Expected file X not found"
- DON'T recreate work from prior sessions
```

**See FRESH_SESSION_PROTOCOL.md for full details.**

---

## 🎯 Task Complexity Guide

### **Simple Tasks (5-10 mins)**
- Single utility function
- Simple data updates
- Isolated changes
- **Template:** Use Template 1

### **Medium Tasks (10-20 mins)**
- Type modifications
- Multiple file updates
- May affect test fixtures
- **Template:** Use Template 2

### **Complex Tasks (20-30+ mins)**
- New system creation
- Integration work
- Comprehensive testing needed
- **Template:** Use Template 3

### **Multi-Session Tasks**
- Requires multiple sessions
- Builds on prior work
- **Template:** Use Template 4 + Fresh Session Protocol

---

## 📚 Pattern Enforcement

**Include this in EVERY task template:**

```markdown
## Pattern Requirements (ALWAYS ENFORCE)

- **Result types** - Use Result<T, E> for error handling
- **Pure functions** - No mutations, no side effects
- **Deterministic RNG** - Use IRng from src/utils/rng.ts
- **TypeScript strict** - No `any`, no type errors
- **Comprehensive tests** - Cover happy path + edge cases

## Quality Gates

- [ ] TypeScript compiles (0 errors)
- [ ] ALL tests passing (100% pass rate)
- [ ] No circular dependencies
- [ ] Follows project patterns
```

---

## 🎨 Graphics AI Quick Example

**When to use Graphics AI:**
- Replacing placeholder circles with Golden Sun sprites
- Polishing screen layouts and beauty
- Adding visual effects and animations
- Integrating psynergy effect animations
- Creating rank-up celebration effects
- Making any screen look more beautiful

**Quick task:**
```
Graphics AI: Replace all character placeholders with Golden Sun sprites from the library.
```

**Graphics AI will:**
- Browse the 2,500+ sprites
- Map characters to appropriate sprites
- Update sprite registry
- Screenshot results
- Report completion

---

## 🎯 Task Handoff Templates

### **Step 1: Architect Creates Task** (in Architect chat)

**You say to Architect:**
```
I need a task prompt for implementing [FEATURE NAME].

Requirements:
- [Requirement 1]
- [Requirement 2]
- [etc.]

Please create a comprehensive task prompt for the implementation coder.
```

**Architect responds with structured task prompt.**

---

### **Step 2: Give Task to Coder** (in Coder chat)

**Copy the task prompt from Architect, then say to Coder:**
```
New task from architect:

[PASTE FULL TASK PROMPT HERE]

Please execute this task and report when complete.
```

**Coder executes task and provides completion report.**

---

### **Step 3: Submit Report to Architect** (in Architect chat)

**Copy completion report from Coder, then say to Architect:**
```
Implementation coder has completed the task. Here's their report:

[PASTE FULL COMPLETION REPORT HERE]

Please review and approve or provide feedback.
```

**Architect reviews and approves or requests changes.**

---

## 🔄 Feedback Loop Template

**If Architect requests changes:**

**Architect provides feedback (in Architect chat):**
> "Changes needed: [specific feedback]"

**You relay to Coder (in Coder chat):**
```
Architect review feedback:

[PASTE ARCHITECT FEEDBACK HERE]

Please make the requested changes and report when complete.
```

**Repeat until approved.**

---

## 📋 Example Full Workflow

### **Scenario: Adding a Leveling System**

#### **Chat #1: Architect**

**You:**
```
I want to add a leveling system to the game. 
Units should gain XP from battles and level up when they reach thresholds.

Can you create a task prompt for the implementation coder?
```

**Architect:**
```markdown
## TASK: Implement Leveling System

### Objective:
Create a leveling system where units gain experience points (XP) from battles 
and level up when reaching XP thresholds, increasing their stats.

### Requirements:
- [ ] Units gain XP from defeating enemies
- [ ] XP thresholds: Level 2 = 100 XP, Level 3 = 250 XP, Level 4 = 500 XP
- [ ] On level up: +5 HP, +2 Attack, +1 Defense, +1 Speed
- [ ] Maximum level: 10
- [ ] XP system integrates with BattleSystem

### Acceptance Criteria:
- [ ] 30+ tests added covering XP gain, level up logic, stat increases
- [ ] All tests passing (625+ → 655+)
- [ ] TypeScript compiles (0 errors)
- [ ] No circular dependencies
- [ ] Deterministic (same seed = same XP gains)
- [ ] Pure functions (no mutations)

### Files to Create/Modify:
- `src/systems/LevelingSystem.ts` - Core leveling logic
- `src/systems/BattleSystem.ts` - Add XP gain after victories
- `src/types/game.ts` - Add XP/level fields to PlayerUnit
- `tests/systems/LevelingSystem.test.ts` - Comprehensive tests

### Patterns to Follow:
- Use Result type for error handling
- Pure functions (return new objects, no mutations)
- Deterministic RNG if needed
- Follow existing BattleSystem patterns

### Context:
- PlayerUnit currently has: id, name, hp, maxHp, attack, defense, speed
- Add: level (default 1), experience (default 0), maxLevel (10)
- BattleSystem.resolveBattle() should call LevelingSystem.gainExperience()
```

---

#### **Chat #2: Coder**

**You:**
```
New task from architect:

## TASK: Implement Leveling System
[Full task from above]

Please execute this task and report when complete.
```

**Coder:**
```
I'll implement the leveling system. Creating todos to track progress...

[Executes task systematically]
[Writes code + tests]
[Runs verification]

## ✅ Leveling System Complete!

### Summary of Changes:
**Created:**
- `src/systems/LevelingSystem.ts` - XP gain, level up logic
- `tests/systems/LevelingSystem.test.ts` - 35 tests

**Modified:**
- `src/systems/BattleSystem.ts` - Integrated XP gain after victory
- `src/types/game.ts` - Added level/experience fields to PlayerUnit

### Tests Added: 35 new tests (660 total)
- **LevelingSystem:** 30 tests
  - XP gain calculations (5 tests)
  - Level up thresholds (8 tests)
  - Stat increases on level up (7 tests)
  - Max level capping (4 tests)
  - Edge cases (6 tests)
- **BattleSystem integration:** 5 tests

### Verification Results:
✅ npm test: 660/660 passing (100%)
✅ npm run type-check: 0 errors
✅ npm run circular: 0 circular dependencies
✅ File size compliance: All files ≤500 lines

### Implementation Highlights:
- Used Result type for level up validation
- Pure functions (no mutations of PlayerUnit)
- Deterministic XP calculations
- Integrated seamlessly with existing BattleSystem
```

---

#### **Back to Chat #1: Architect**

**You:**
```
Implementation coder has completed the task. Here's their report:

[Full completion report from above]

Please review and approve or provide feedback.
```

**Architect:**
```markdown
## REVIEW: Leveling System Implementation

✅ APPROVED

**Quality Check:**
- ✅ All acceptance criteria met
- ✅ 35 tests added (660 total, 100% pass rate)
- ✅ TypeScript clean (0 errors)
- ✅ No circular dependencies
- ✅ Follows project patterns (Result, pure functions, determinism)
- ✅ Good test coverage (XP gain, level up, max level, edge cases)

**Excellent work. The leveling system is production-ready.**

**Next Decision:**
Would you like to:
A) Ship this update to production
B) Add more features (e.g., skill trees, class system)
C) Improve existing systems
```

---

## 🎨 Visual Role Reminder

### **Always Know Which Chat Is Which:**

**Label your chat windows:**

```
┌─────────────────────────────────┐
│  CHAT #1: 🏛️ ARCHITECT         │
│  ───────────────────────────────│
│  Role: Strategic Planning       │
│  Does: Plan, Decide, Review     │
│  Does NOT: Write Code           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  CHAT #2: 🛠️ CODER              │
│  ───────────────────────────────│
│  Role: Code Execution           │
│  Does: Implement, Test, Report  │
│  Does NOT: Make Decisions       │
└─────────────────────────────────┘
```

**Pro Tip:** Actually label your chat windows/tabs with these names!

---

## ⚡ Quick Reference Commands

### **In Architect Chat:**

```
"Create a task prompt for [FEATURE]"
"Review this completion report: [REPORT]"
"Should we ship or keep building?"
"What's the priority: [FEATURE A] or [FEATURE B]?"
"Give me a project health assessment"
```

### **In Coder Chat:**

```
"Execute this task: [TASK PROMPT]"
"Run all verification (tests, type-check, circular deps)"
"Fix these issues from architect review: [FEEDBACK]"
"Provide detailed completion report"
"Show me the test coverage for [SYSTEM]"
```

---

## 🚨 Emergency Commands

**If roles get confused:**

### **In Architect Chat:**
```
STOP - You're the architect, not the coder.
Re-read docs/ai/ARCHITECT_ONBOARDING.md
Do NOT write implementation code.
```

### **In Coder Chat:**
```
STOP - You're the coder, not the architect.
Re-read docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md
Do NOT make strategic decisions.
```

---

## ✅ Checklist: Healthy Two-Chat Setup

Before starting work, verify:

- [ ] Two separate chat sessions opened
- [ ] Architect chat initialized with ARCHITECT_ONBOARDING.md
- [ ] Coder chat initialized with IMPLEMENTATION_CODER_ONBOARDING.md
- [ ] Both AIs confirmed their roles
- [ ] Chat windows labeled clearly (🏛️ vs 🛠️)
- [ ] You understand the handoff workflow (task → execute → report → review)

---

## 🎯 Success Pattern

**Smooth workflow looks like:**

1. **Architect chat:** "Create task for leveling system"
2. **Architect:** [Provides detailed task prompt]
3. **You:** Copy task → Coder chat
4. **Coder chat:** "Execute this task: [task]"
5. **Coder:** [Implements, tests, verifies]
6. **Coder:** [Provides completion report]
7. **You:** Copy report → Architect chat
8. **Architect chat:** "Review this report: [report]"
9. **Architect:** ✅ Approved or ❌ Changes needed
10. **Repeat if changes needed, otherwise done!**

**Each AI stays in their lane. Clean separation. Maximum efficiency.** 🚀
