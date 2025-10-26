# 🎯 COMPREHENSIVE TEMPLATE SYSTEM

**Complete guide to all templates with decision trees, adaptation guidelines, and battle-tested examples**

---

## 📋 TABLE OF CONTENTS

1. [Template Selection Decision Tree](#template-selection)
2. [Template 1: Simple Utility Function](#template-1)
3. [Template 2: Type Addition/Modification](#template-2)
4. [Template 3: System Creation](#template-3)
5. [Template 4: Fresh Session Continuation](#template-4)
6. [Template 5: Bug Fix](#template-5)
7. [Template 6: Refactoring](#template-6)
8. [Template 7: Integration Task](#template-7)
9. [Adaptation Guidelines](#adaptation-guidelines)
10. [Pattern Enforcement](#pattern-enforcement)
11. [Quality Gates](#quality-gates)
12. [Common Pitfalls](#common-pitfalls)

---

## 🌳 TEMPLATE SELECTION DECISION TREE {#template-selection}

```
START: What are you building?
│
├─ NEW CHAT continuing prior work? ──YES──> Template 4 (Fresh Session)
│   │                                        + Read FRESH_SESSION_PROTOCOL.md
│   NO
│   │
│   ▼
├─ Single utility function? ──────────YES──> Template 1 (Simple Utility)
│   │                                        Time: 5-10 mins
│   NO
│   │
│   ▼
├─ Adding/modifying a type? ───────────YES──> Template 2 (Type Change)
│   │                                         Time: 10-20 mins
│   NO                                        EXPECT: Collateral fixes
│   │
│   ▼
├─ Creating a new system? ─────────────YES──> Template 3 (System Creation)
│   │                                         Time: 20-30 mins
│   NO                                        EXPECT: Comprehensive tests
│   │
│   ▼
├─ Fixing a bug? ──────────────────────YES──> Template 5 (Bug Fix)
│   │                                         Time: Variable
│   NO
│   │
│   ▼
├─ Refactoring existing code? ────────YES──> Template 6 (Refactoring)
│   │                                         Time: Variable
│   NO                                        CRITICAL: No behavior change
│   │
│   ▼
├─ Integrating multiple systems? ─────YES──> Template 7 (Integration)
│   │                                         Time: 30+ mins
│   NO
│   │
│   ▼
├─ Multi-phase feature? ──────────────YES──> Use Architect AI
│   │                                         Create session plan
│   │                                         Break into smaller templates
│   │
│   ▼
└─ Complex/Unclear? ───────────────────────> Use Architect AI
                                              Define scope first
                                              Then pick template
```

---

## 📐 TEMPLATE 1: SIMPLE UTILITY FUNCTION {#template-1}

### **When to Use:**
- Adding a single, isolated utility function
- Function doesn't touch existing systems
- Low complexity, low risk
- 5-10 minute implementation

### **Characteristics:**
```yaml
Complexity: LOW
Risk: LOW
Files Created: 1-2 (source + test)
Files Modified: 0 (rarely)
Test Count: 3-5
Time Estimate: 5-10 minutes
Success Rate: 100% (Test 1 proved)
```

### **Full Template:**

```markdown
# Task: Add [FunctionName] Utility Function

## 📋 Context
- **Project:** NextEraGame (C:\Dev\AiGames\NextEraGame)
- **Pattern:** Pure functions, deterministic RNG (if applicable)
- **Reference:** Similar utilities in src/utils/

## 🎯 Objective
[One sentence: What this function does and why it's needed]

Example: "Create a utility function that returns a random element from an array using deterministic RNG."

## 📦 Requirements

### 1. Create Source File
- **File:** src/utils/[filename].ts (NEW file)
- **Function Signature:**
  ```typescript
  export function [functionName]<T>(
    [param1]: [Type1],
    [param2]: [Type2]
  ): [ReturnType]
  ```
- **Implementation:**
  - [Specific requirement 1]
  - [Specific requirement 2]
  - Return [specific value] for [edge case]
  - Use [specific pattern] for [behavior]

### 2. Pattern Requirements
- ✅ Pure function (no mutations, no side effects)
- ✅ Type-safe (proper TypeScript types)
- ✅ Deterministic (if uses RNG, use IRng from src/utils/rng.ts)
- ✅ Handle edge cases (empty inputs, null, undefined)

### 3. Create Tests
- **File:** tests/utils/[filename].test.ts (NEW file)
- **Required Tests:**
  - Test 1: [Happy path case]
  - Test 2: [Edge case 1]
  - Test 3: [Edge case 2]
  - Test 4: [Error case] (if applicable)

### 4. Test Structure
```typescript
import { describe, it, expect } from 'vitest';
import { [functionName] } from '@/utils/[filename]';

describe('[functionName]', () => {
  it('[test description]', () => {
    // Arrange
    const input = [test data];
    
    // Act
    const result = [functionName](input);
    
    // Assert
    expect(result).toBe([expected value]);
  });
  
  // More tests...
});
```

## ✅ Acceptance Criteria
- [ ] TypeScript compiles with 0 errors
- [ ] 3+ tests created and passing
- [ ] Function is pure (no mutations)
- [ ] Edge cases handled correctly
- [ ] Uses project patterns (Result type if needed)
- [ ] ALL existing tests still pass

## ⏱️ Time Estimate
5-10 minutes

## 🚫 Out of Scope
- Integration with other systems (separate task)
- UI components (separate task)
- Complex business logic (use Template 3)
```

### **Real Example (Test 1):**

```markdown
# Task: Add getRandomElement Utility Function

## 📋 Context
- **Project:** NextEraGame
- **Pattern:** Pure functions, uses seeded RNG from pure-rand

## 🎯 Objective
Create a utility function that returns a random element from an array using our deterministic RNG.

## 📦 Requirements

### 1. Create Source File
- **File:** src/utils/arrayUtils.ts (NEW file)
- **Function Signature:**
  ```typescript
  export function getRandomElement<T>(
    array: T[],
    rng: IRng
  ): T | undefined
  ```
- **Implementation:**
  - Return undefined for empty arrays
  - Use rng.nextInt(0, array.length - 1) for index selection
  - Return array[randomIndex]
  - Pure function (no array mutation)

### 2. Pattern Requirements
- ✅ Pure function (no mutations)
- ✅ Uses IRng type from src/utils/rng.ts
- ✅ Handles empty array edge case
- ✅ Type-safe with generics

### 3. Create Tests
- **File:** tests/utils/arrayUtils.test.ts (NEW file)
- **Required Tests:**
  - Test 1: Returns undefined for empty array
  - Test 2: Returns the only element for single-element array
  - Test 3: Returns element from array using deterministic RNG (verify with seed)

## ✅ Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] 3 tests pass
- [ ] Uses deterministic RNG
- [ ] Handles empty array correctly

## ⏱️ Time Estimate
5 minutes

**RESULT: ✅ SUCCESS - Completed in 5 mins, all criteria met**
```

### **Adaptation Guidelines:**

**When adapting for your function:**

1. **Replace placeholders:**
   - `[FunctionName]` → Your function name
   - `[filename]` → Your file name
   - `[param1]`, `[param2]` → Your parameters
   - `[ReturnType]` → Your return type

2. **Specify edge cases:**
   - What happens with empty inputs?
   - What about null/undefined?
   - Any special boundary conditions?

3. **Define test cases:**
   - Happy path (normal usage)
   - Edge case 1 (boundary)
   - Edge case 2 (another boundary)
   - Error case (if applicable)

4. **Reference existing code:**
   - "Copy structure from src/utils/[existing].ts"
   - "Follow pattern from [similar function]"

---

## 🔧 TEMPLATE 2: TYPE ADDITION/MODIFICATION {#template-2}

### **When to Use:**
- Adding field(s) to existing type/interface
- Modifying type structure
- Changes affect multiple files
- Medium complexity, medium-high risk

### **Characteristics:**
```yaml
Complexity: MEDIUM
Risk: MEDIUM-HIGH (breaking change)
Files Created: 1 (test file)
Files Modified: 2+ (type + data + possibly many fixtures)
Test Count: 3-10
Time Estimate: 10-20 minutes
Success Rate: 100% (Test 2 proved)
CRITICAL: Expect collateral damage (test fixtures, mock data)
```

### **Full Template:**

```markdown
# Task: Add [FieldName] to [TypeName]

## 📋 Context
- **Project:** NextEraGame
- **Pattern:** Pure functions, TypeScript strict mode
- **Type File:** src/types/game.ts
- **IMPORTANT:** This is a breaking change - expect collateral fixes needed

## 🎯 Objective
[One sentence: What field you're adding and why]

Example: "Add luck stat to PlayerUnit to enable critical hit mechanics."

## 📦 Requirements

### 1. Update Type Definition
- **File:** src/types/game.ts
- **Location:** [Interface] interface (around line [X])
- **Change:** Add `[fieldName]: [type]` field
- **DO NOT:** Modify any other interfaces unless required

```typescript
export interface [TypeName] {
  // Existing fields...
  
  // New field:
  [fieldName]: [type]; // [Brief description]
}
```

### 2. Update Data Files
- **Primary File:** [path to main data file]
- **Action:** Add `[fieldName]: [defaultValue]` to ALL [N] instances
- **Keep:** All existing properties unchanged

**Example:**
```typescript
const item: [TypeName] = {
  // Existing fields...
  [fieldName]: [defaultValue], // NEW
};
```

### 3. Self-Recovery Expectations
**CRITICAL:** This type change WILL break test fixtures and mock data.

**Expected AI Behavior:**
1. Detect TypeScript compilation errors in test files
2. Search codebase for all [TypeName] instantiations
3. Fix ALL affected files autonomously
4. Report comprehensively what was fixed

**DO NOT be surprised if:**
- 10-20 test files need updates
- Mock data objects need new field
- Test fixtures require modifications

**This is NORMAL and EXPECTED. Let AI handle it.**

### 4. Create Integration Tests
- **File:** tests/integration/[fieldName].test.ts (NEW file)
- **Required Tests:**
  - Test 1: Verify [TypeName] type has [fieldName] field
  - Test 2: Verify all [N] data instances have [fieldName] = [value]
  - Test 3: Verify TypeScript compilation with new field
  - Test 4: [Optional] Verify field is used correctly in systems

## ✅ Acceptance Criteria
- [ ] TypeScript compiles with 0 errors (full project)
- [ ] [TypeName] interface has [fieldName] field
- [ ] ALL [N] data instances updated
- [ ] 3+ integration tests pass
- [ ] ALL existing tests still pass (expect ~1000+ tests)
- [ ] Test fixtures updated (if needed)
- [ ] Mock data updated (if needed)

## 📊 Self-Recovery Report
**After completion, AI should report:**
- Files modified (expect more than specified)
- Test fixtures fixed (list them)
- Mock data updated (list them)
- Any other collateral fixes

## ⏱️ Time Estimate
10-20 minutes (includes collateral fixes)

## 🚫 Skip Git Operations
DO NOT commit or push - this is a test task.

## 🚫 Out of Scope
- Using the field in systems (separate task)
- UI display of field (separate task)
- Complex calculations with field (separate task)
```

### **Real Example (Test 2):**

```markdown
# Task: Add "Luck" Stat to PlayerUnit

## 📋 Context
- **Project:** NextEraGame
- **Type File:** src/types/game.ts
- **IMPORTANT:** Breaking change - expect collateral fixes

## 🎯 Objective
Add luck stat to PlayerUnit type to enable critical hit mechanics.

## 📦 Requirements

### 1. Update Type Definition
- **File:** src/types/game.ts
- **Interface:** PlayerUnit (find existing interface)
- **Change:** Add `luck: number` field
- **DO NOT:** Modify any other interfaces

### 2. Update Starter Units
- **File:** src/data/starterUnits.ts
- **Action:** Add `luck: 5` to ALL 12 starter units
- **Keep:** All existing properties

### 3. Self-Recovery Expectations
This WILL break test fixtures. Expected:
- test/fixtures/battleFixtures.ts needs luck
- Multiple test files with PlayerUnit mocks need luck
- TeamManager.ts might need default luck for recruited units

**Let AI find and fix these autonomously.**

### 4. Create Tests
- **File:** tests/integration/luck.stat.test.ts (NEW)
- **Tests:**
  - Test 1: PlayerUnit has luck field
  - Test 2: All 12 starters have luck = 5
  - Test 3: TypeScript compiles

## ✅ Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] All 12 starter units have luck: 5
- [ ] 3 new tests pass
- [ ] ALL existing tests still pass (1034+ expected)

## ⏱️ Time Estimate
10-15 minutes

**RESULT: ✅ OUTSTANDING**
- Completed in 15 mins
- Fixed 14+ test files autonomously
- 1034 tests passing
- Comprehensive self-recovery report
```

### **Adaptation Guidelines:**

**Key Decisions:**

1. **Default Value:**
   ```
   Should all instances get same value?
   OR vary by role/type?
   
   Example:
   - All units: luck: 5
   - By role: Tank: 3, DPS: 10, Support: 5
   ```

2. **Type Selection:**
   ```
   number? (most common)
   string?
   boolean?
   Custom type?
   Optional (field?: type)?
   ```

3. **Scope of Changes:**
   ```
   Just one data file?
   Multiple data files?
   System files too?
   
   List ALL expected files in requirements.
   ```

4. **Testing Strategy:**
   ```
   Simple verification? (3 tests)
   Complex validation? (10+ tests)
   Integration with systems? (add more tests)
   ```

---

## 🏗️ TEMPLATE 3: SYSTEM CREATION {#template-3}

### **When to Use:**
- Creating a complete new system (not just utility)
- System has multiple functions
- Requires comprehensive testing
- High complexity, medium risk

### **Characteristics:**
```yaml
Complexity: HIGH
Risk: MEDIUM
Files Created: 2 (system + tests)
Files Modified: 0-2 (integration points if needed)
Test Count: 10-20
Time Estimate: 20-30 minutes
Success Rate: 100% (Test 3 proved - code quality)
NOTE: Git can be tricky in fresh sessions
```

### **Full Template:**

```markdown
# Task: Create [SystemName]

## 📋 Context
- **Project:** NextEraGame
- **Branch:** [branch-name] (if fresh session)
- **Pattern:** Copy structure from src/systems/[ExistingSystem].ts
- **Reference System:** [ExistingSystem] (uses Result types, pure functions)

## 🎯 Objective
[One sentence: What this system does and why]

Example: "Create a system to calculate critical hits based on luck stat."

## 📦 Requirements

### 1. Create System File
- **File:** src/systems/[SystemName].ts (NEW file)
- **Structure:** Copy from src/systems/[ExistingSystem].ts
- **Patterns to Follow:**
  - ✅ Result types for error handling
  - ✅ Pure functions (no mutations)
  - ✅ Deterministic RNG (use IRng)
  - ✅ TypeScript strict mode
  - ✅ Comprehensive JSDoc comments

### 2. Main Function Signature
```typescript
/**
 * [Brief description of what function does]
 * 
 * @param [param1] - [Description]
 * @param [param2] - [Description]
 * @returns Result with [success type] or [error type]
 * 
 * @example
 * ```typescript
 * const result = [functionName]([example params]);
 * if (result.ok) {
 *   // Use result.value
 * } else {
 *   // Handle result.error
 * }
 * ```
 */
export function [functionName](
  [param1]: [Type1],
  [param2]: [Type2]
): Result<[SuccessType], [ErrorType]>
```

### 3. Formula/Logic Implementation
[Describe the calculation or algorithm]

**Example:**
```
Formula: critChance = attacker.luck / 100
Process:
1. Validate luck is in range 0-100
2. Calculate crit chance (luck / 100)
3. Generate random number 0-99
4. If random < luck, return Ok(true)
5. Else return Ok(false)
```

### 4. Error Handling
**Expected Errors:**
- [Error 1]: [When it occurs] → Return Err("[error message]")
- [Error 2]: [When it occurs] → Return Err("[error message]")

**Example:**
```typescript
if (attacker.luck < 0 || attacker.luck > 100) {
  return Err(`Invalid luck: ${attacker.luck}. Must be 0-100.`);
}
```

### 5. Helper Functions (if needed)
```typescript
// Internal helper (not exported)
function [helperName]([params]): [returnType] {
  // Implementation
}
```

### 6. Create Comprehensive Tests
- **File:** tests/systems/[SystemName].test.ts (NEW file)
- **Pattern:** Copy structure from tests/systems/[ExistingSystem].test.ts

**Required Test Categories:**

**A. Boundary Tests (4+ tests)**
- Test with minimum value (0, empty, etc.)
- Test with maximum value (100, full, etc.)
- Test with edge value 1
- Test with edge value 99

**B. Probability Tests (2-3 tests)**
- Test probability distribution over 100+ runs
- Verify expected percentage (e.g., luck: 50 → ~50% rate)
- Test extreme probabilities (0%, 100%)

**C. Determinism Tests (2 tests)**
- Same seed + same input = same result
- Different seed + same input = different result

**D. Error Handling Tests (2-3 tests)**
- Test with invalid input (negative, >max, etc.)
- Test with null/undefined (if applicable)
- Verify error messages are clear

**E. Edge Case Tests (2-3 tests)**
- Test with multiple different roles/types
- Test immutability (original data unchanged)
- Test independent results (multiple calls)

**F. Integration Tests (optional, 1-2 tests)**
- Test with real game data
- Test interaction with related systems

### 7. Test Structure
```typescript
import { describe, it, expect } from 'vitest';
import { [functionName] } from '@/systems/[SystemName]';
import { Result } from '@/utils/Result';
import { xoroshiro128plus } from 'pure-rand';

describe('[SystemName]', () => {
  describe('Boundary Tests', () => {
    it('[test description]', () => {
      // Test implementation
    });
  });
  
  describe('Probability Tests', () => {
    it('[test description]', () => {
      // Test implementation
    });
  });
  
  // More test groups...
});
```

## ✅ Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] System file created with proper structure
- [ ] 10+ comprehensive tests created
- [ ] ALL new tests passing
- [ ] ALL existing tests still pass (1000+ expected)
- [ ] Follows project patterns (Result, pure functions, RNG)
- [ ] Uses Result type correctly
- [ ] Deterministic behavior verified
- [ ] Error handling comprehensive
- [ ] JSDoc comments added

## 📊 Expected Outcomes
**Before:**
- No [system] functionality
- Manual [calculations]

**After:**
- [System] fully functional
- [Specific capabilities enabled]
- [X] new tests added
- Ready for integration with [related systems]

## ⏱️ Time Estimate
20-30 minutes

## 🚫 Skip Git Operations
DO NOT commit or push - this is a test task.

## 🚫 Out of Scope
- UI integration (separate task)
- Visual effects (separate task - Graphics AI)
- Integration with battle system (separate task)
- Equipment modifiers (future enhancement)

## 📚 Reference Files
**Copy patterns from:**
- src/systems/[ExistingSystem].ts (system structure)
- tests/systems/[ExistingSystem].test.ts (test structure)
- src/utils/Result.ts (Result type usage)
- src/utils/rng.ts (IRng interface)
```

### **Real Example (Test 3):**

```markdown
# Task: Create Critical Hit System

## 📋 Context
- **Project:** NextEraGame
- **Branch:** claude/add-random-element-util-011CUUWyg2WA4PiuwTLXj8MM
- **Pattern:** Copy EquipmentSystem.ts structure
- **IMPORTANT:** Fresh session - prior work exists

### Prior Work:
- Test 1: Created src/utils/arrayUtils.ts
- Test 2: Added luck field to PlayerUnit

## 🎯 Objective
Create a system to calculate critical hits based on luck stat.

## 📦 Requirements

### 1. Create System File
- **File:** src/systems/CriticalHitSystem.ts (NEW)
- **Pattern:** Copy from src/systems/EquipmentSystem.ts

### 2. Function Signature
```typescript
export function checkCriticalHit(
  attacker: PlayerUnit,
  rng: IRng
): Result<boolean, never>
```

### 3. Formula
```
critChance = attacker.luck / 100
Process:
1. Get luck value from attacker
2. Calculate crit chance (luck / 100)
3. Generate random 0-99 using rng.nextInt(0, 99)
4. If random < luck, return Ok(true)
5. Else return Ok(false)
```

### 4. Create Tests (10+ required)
- **File:** tests/systems/CriticalHitSystem.test.ts

**Tests:**
- luck: 0 → never crits (100 rolls)
- luck: 100 → always crits (100 rolls)
- luck: 50 → ~50% rate (100 rolls)
- luck: 25 → ~25% rate (100 rolls)
- Determinism: same seed = same result
- Invalid luck: negative values
- Invalid luck: > 100 values
- Multiple calls are independent
- Original unit not mutated
- Works with different roles

## ✅ Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] 10+ tests created and passing
- [ ] ALL existing tests pass (1034+)
- [ ] Pure function pattern
- [ ] Result type used
- [ ] Deterministic (same seed = same outcome)

## ⏱️ Time Estimate
20 minutes

**RESULT: ✅ EXCELLENT**
- Created 19 tests (exceeded 10+ requirement!)
- 1047 tests passing (13 new)
- Perfect code quality
- Git struggles (branch issues) but code was perfect
```

### **Adaptation Guidelines:**

**System Complexity Assessment:**

```
Simple System (3-5 functions):
- Main function + 2-4 helpers
- 10-15 tests
- 20 mins

Medium System (5-8 functions):
- Main function + 4-7 helpers
- 15-20 tests
- 30 mins

Complex System (8+ functions):
- Multiple main functions
- Many helpers
- 20+ tests
- 40+ mins
→ Consider breaking into phases
```

**Formula Documentation:**

```markdown
### Formula Clarity
BAD:
"Calculate the value"

GOOD:
"Formula: value = (base * modifier) + bonus
Example: base=100, modifier=1.5, bonus=20 → 170"
```

---

## 🔄 TEMPLATE 4: FRESH SESSION CONTINUATION {#template-4}

### **When to Use:**
- Starting NEW chat to continue prior work
- Multiple sessions on same feature
- Need to build on previous implementations
- CRITICAL for avoiding git chaos

### **Characteristics:**
```yaml
Complexity: VARIABLE (depends on task)
Risk: HIGH (if protocol not followed)
Files Created: Variable
Files Modified: Variable
Time Estimate: Variable + 5 mins setup
Success Rate: 70% → 100% (with protocol)
CRITICAL: MUST verify branch first
```

### **Full Template:**

```markdown
# Task: [Feature Name]

## 🔄 FRESH SESSION CONTEXT

**⚠️ CRITICAL: This is a NEW chat session continuing prior work.**

### Session History:
- **Session 1:** [What was done] - [Date/ID]
- **Session 2:** [What was done] - [Date/ID]
- **Session N:** [What was done] - [Date/ID]

### Expected Existing Files:
Check these files EXIST before starting:
- [ ] `src/path/file1.ts` - [What it contains/does]
- [ ] `src/path/file2.ts` - [What it contains/does]
- [ ] `tests/path/test1.test.ts` - [Test coverage]

### Expected Existing Features:
- [ ] [Feature 1] implemented and working
- [ ] [Feature 2] integrated and tested
- [ ] [Type 1] has [field] field
- [ ] [N] tests passing baseline

### Branch Information:
- **Correct Branch:** `[exact-branch-name]`
- **DO NOT use:** main, master, develop, or any other branch
- **Verify before coding:** This branch must have all prior work

---

## ⚠️ MANDATORY SETUP (DO THIS FIRST!)

**Copy-paste and execute these commands BEFORE writing any code:**

```bash
# Step 1: Check current branch
git branch --show-current

# Step 2: Switch to correct branch (if not already on it)
git checkout [exact-branch-name]

# Step 3: Verify branch state
git status

# Step 4: Pull latest changes (if working across machines)
git pull origin [exact-branch-name]

# Step 5: Verify dependencies exist
ls src/path/file1.ts
ls src/path/file2.ts
# Should see files listed, not "No such file"
```

### Expected Output:
```
✅ On branch [exact-branch-name]
✅ Files exist: file1.ts, file2.ts
✅ Working tree clean or has expected uncommitted changes
```

### If Dependencies Missing:
```
❌ STOP - DO NOT PROCEED
❌ Report: "Expected file X not found"
❌ Ask: "Am I on the correct branch?"
❌ DO NOT recreate prior session work
```

---

## 🎯 YOUR TASK (THIS SESSION)

[Normal task description for THIS session's work]

### What You're Building:
[Specific feature/enhancement for this session]

### What You're NOT Building:
(These were done in prior sessions)
- ❌ [Feature from Session 1] - already complete
- ❌ [Feature from Session 2] - already complete

### Requirements:
[Specific requirements for THIS session only]

### Acceptance Criteria:
- [ ] [Criterion 1 specific to this session]
- [ ] [Criterion 2 specific to this session]
- [ ] ALL existing tests still pass ([N]+ baseline)
- [ ] No regressions in prior features

---

## 🔍 Context Validation Checklist

**Before writing code, verify:**

### Files Exist:
```bash
# Run these commands to verify
ls src/systems/[PriorSystem].ts
ls tests/integration/[PriorTest].test.ts
```

### Types Have Expected Fields:
```bash
# Read key files to verify
# Check that PlayerUnit has luck field
grep "luck" src/types/game.ts

# Check that arrayUtils exists
ls src/utils/arrayUtils.ts
```

### Tests Baseline:
```bash
# Run tests to verify starting point
npm test

# Expected: [N]+ tests passing
# If fewer tests, something is wrong
```

### If Validation Fails:
```
STOP and report:
"Context validation failed:
- Expected [X] but found [Y]
- File [Z] is missing
- Am I on the correct branch?"

DO NOT proceed until validation passes.
```

---

## 🚫 COMMON MISTAKES TO AVOID

### ❌ Mistake 1: Wrong Branch
```bash
# DON'T assume you're on the right branch
# DON'T skip verification

# DO verify explicitly
git branch --show-current
```

### ❌ Mistake 2: Recreating Prior Work
```bash
# DON'T re-implement arrayUtils if it exists
# DON'T re-add luck field if it's already there

# DO check first
ls src/utils/arrayUtils.ts
grep "luck" src/types/game.ts
```

### ❌ Mistake 3: Skipping Context Validation
```bash
# DON'T start coding immediately
# DON'T assume files exist

# DO verify all dependencies first
[Run validation checklist]
```

---

## 💾 GIT WORKFLOW (AFTER IMPLEMENTATION)

### Option A: New Branch (Recommended)
```bash
# Create new branch for THIS session
git checkout -b [new-session-branch-name]

# Cherry-pick prior work if needed
git cherry-pick [commit-hash-session-1]
git cherry-pick [commit-hash-session-2]

# Commit your work
git add [your-new-files]
git commit -m "[Your commit message]"

# Push to new branch
git push -u origin [new-session-branch-name]
```

### Option B: Same Branch (May cause conflicts)
```bash
# Commit to existing branch
git add [your-new-files]
git commit -m "[Your commit message]"

# Push (may have conflicts with other sessions)
git push origin [branch-name]

# If conflicts occur, see FRESH_SESSION_PROTOCOL.md
```

---

## ✅ Success Indicators

**You'll know you're on track when:**
- ✅ Branch verification passed
- ✅ All expected files found
- ✅ Context validation passed
- ✅ No duplicate work created
- ✅ Tests show expected baseline
- ✅ New work integrates cleanly

**Warning signs:**
- ⚠️ Files missing that should exist
- ⚠️ Tests failing that should pass
- ⚠️ TypeScript errors in prior work
- ⚠️ Creating files that already exist

---

## 📚 Additional Resources

**Must Read:**
- docs/ai/FRESH_SESSION_PROTOCOL.md (comprehensive guide)

**Reference:**
- Session 1 completion report (see what was done)
- Session 2 completion report (see what was done)

---

## ⏱️ Time Estimate
[Task time] + 5 minutes for setup/verification

---

## 🎯 Quick Checklist

**Before starting:**
- [ ] Read FRESH_SESSION_PROTOCOL.md
- [ ] Verify correct branch
- [ ] Check all dependencies exist
- [ ] Validate context (files, types, tests)
- [ ] Understand prior work
- [ ] Know what THIS session builds

**During implementation:**
- [ ] Build on existing code (don't recreate)
- [ ] Import from prior sessions
- [ ] Test integration with prior features

**After implementation:**
- [ ] All tests pass (baseline + new)
- [ ] No regressions
- [ ] Clean git workflow
- [ ] Comprehensive completion report
```

### **Real Example (What Test 3 Should Have Been):**

```markdown
# Task: Create Critical Hit System

## 🔄 FRESH SESSION CONTEXT

**⚠️ This is a NEW chat session continuing prior work.**

### Session History:
- **Session 1 (Test 1):** Created arrayUtils.ts with getRandomElement
- **Session 2 (Test 2):** Added luck stat to PlayerUnit + updated 12 starters

### Expected Existing Files:
- [ ] `src/utils/arrayUtils.ts` - Random element selection utility
- [ ] `src/types/game.ts` - PlayerUnit has luck field
- [ ] `src/data/starterUnits.ts` - All 12 units have luck: 5
- [ ] `tests/utils/arrayUtils.test.ts` - 3 tests passing
- [ ] `tests/integration/luck.stat.test.ts` - 3 tests passing

### Expected Test Baseline:
- **1034+ tests passing**
- **TypeScript 0 errors**

### Branch Information:
- **Correct Branch:** `claude/add-random-element-util-011CUUWyg2WA4PiuwTLXj8MM`
- **DO NOT use:** main, master, or other branches

---

## ⚠️ MANDATORY SETUP

```bash
# MUST run these before coding:
git branch --show-current
git checkout claude/add-random-element-util-011CUUWyg2WA4PiuwTLXj8MM
git status

# Verify dependencies:
ls src/utils/arrayUtils.ts
grep "luck" src/types/game.ts

# Expected: Both should exist
```

---

## 🎯 YOUR TASK (THIS SESSION)

Create CriticalHitSystem that uses the luck field from Session 2.

[Rest of task details...]

**RESULT: Would have eliminated branch confusion completely**
```

---

## 🐛 TEMPLATE 5: BUG FIX {#template-5}

### **When to Use:**
- Fixing specific bug/issue
- Behavior is broken/incorrect
- Need regression test

### **Full Template:**

```markdown
# Task: Fix [Bug Description]

## 🐛 Bug Report

### Symptom:
[What's broken - be specific]
- When [action] is performed
- Expected: [correct behavior]
- Actual: [wrong behavior]
- Impact: [how this affects gameplay/users]

### Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. Observe: [bug occurs]

### Root Cause (if known):
[What's causing this - or "Unknown, needs investigation"]

### Error Messages (if any):
```
[Copy exact error message]
```

---

## 🎯 Solution Approach

### Hypothesis:
[What you think is wrong]

### Fix Strategy:
1. [What needs to change]
2. [How to verify fix works]
3. [How to prevent regression]

### Files Affected:
- **Primary:** src/[path]/[file].ts
- **Tests:** tests/[path]/[file].test.ts
- **Related:** [any other files]

---

## ✅ Acceptance Criteria

### Bug Fixed:
- [ ] Steps to reproduce no longer cause bug
- [ ] Expected behavior now occurs
- [ ] Manual testing confirms fix

### Regression Test Added:
- [ ] Test reproduces original bug (with old code)
- [ ] Test passes with fix
- [ ] Test will catch if bug returns

### No New Issues:
- [ ] All existing tests still pass
- [ ] No new bugs introduced
- [ ] Related functionality still works

### Code Quality:
- [ ] TypeScript compiles (0 errors)
- [ ] Follows project patterns
- [ ] Fix is minimal (doesn't over-engineer)

---

## 🧪 Testing Strategy

### 1. Create Regression Test FIRST:
```typescript
it('should [correct behavior] - regression test for bug #[X]', () => {
  // Reproduce the bug scenario
  const result = [buggy function call];
  
  // Verify correct behavior
  expect(result).toBe([correct value]);
});
```

### 2. Run Test (Should FAIL):
This confirms test reproduces bug.

### 3. Fix Bug:
Make minimal change to fix issue.

### 4. Run Test (Should PASS):
Confirms fix works.

### 5. Run Full Suite:
Confirms no regressions.

---

## ⏱️ Time Estimate
Variable (depends on complexity)
- Simple fix: 10-15 mins
- Complex investigation: 30+ mins

---

## 📊 Completion Report Format

After fixing, report:
```markdown
## Bug Fix Summary

### What Was Wrong:
[Technical explanation]

### What Was Changed:
[Files modified and how]

### Test Coverage:
- Regression test added: [test name]
- Verifies: [what it checks]

### Verification:
- [ ] Bug no longer occurs
- [ ] All tests pass ([N]/[N])
- [ ] Manual testing confirms fix
```
```

---

## 🔧 TEMPLATE 6: REFACTORING {#template-6}

### **When to Use:**
- Improving code structure
- NO behavior change
- Making code cleaner/more maintainable

### **Full Template:**

```markdown
# Task: Refactor [Component/System]

## 🎯 Refactoring Goal

### Why Refactor:
[Reason for refactoring]
- Code is duplicated
- Function is too complex
- Structure is confusing
- Performance could improve
- Preparing for new feature

### What Improves:
[Expected benefits]
- Better readability
- Easier to maintain
- Clearer structure
- Better performance
- Easier to test

---

## 📦 Approach

### Current State:
```typescript
// Show current problematic code
[Current implementation]
```

### Problems:
- [Problem 1]
- [Problem 2]
- [Problem 3]

### Proposed State:
```typescript
// Show improved structure
[Proposed implementation]
```

### Improvements:
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

---

## 🎯 Refactoring Steps

### Phase 1: Extract Functions
1. Identify duplicated code
2. Extract to helper functions
3. Replace duplicates with calls

### Phase 2: Simplify Logic
1. Reduce nesting
2. Early returns
3. Clear variable names

### Phase 3: Improve Structure
1. Group related code
2. Separate concerns
3. Add clear comments

---

## ✅ CRITICAL ACCEPTANCE CRITERIA

### ⚠️ ZERO BEHAVIOR CHANGE:
- [ ] ALL existing tests pass WITHOUT modification
- [ ] Exact same inputs produce exact same outputs
- [ ] No new features added
- [ ] No bugs introduced

### Code Quality:
- [ ] Code is more readable
- [ ] Complexity reduced
- [ ] Duplication eliminated
- [ ] Performance same or better

### Safety:
- [ ] TypeScript compiles (0 errors)
- [ ] No new dependencies
- [ ] No breaking API changes

---

## 🧪 Verification Strategy

### Before Refactoring:
```bash
# Document current behavior
npm test -- [affected tests]
# Note: X/X tests passing

# Capture baseline performance (if relevant)
[Performance metrics]
```

### After Refactoring:
```bash
# ALL tests must still pass
npm test -- [affected tests]
# Must be: X/X tests passing (same count)

# Verify no regressions
npm test
# Must be: Same total pass count

# Check performance (if relevant)
[Performance metrics]
# Must be: Same or better
```

### Manual Testing:
- [ ] Test same scenarios as before
- [ ] Verify exact same behavior
- [ ] Check edge cases still work

---

## ⏱️ Time Estimate
Variable
- Small refactor: 15-20 mins
- Medium refactor: 30-45 mins
- Large refactor: 1+ hours (consider phasing)

---

## 🚫 What NOT to Do

### DON'T:
- ❌ Add new features (separate task)
- ❌ Fix bugs (separate task)
- ❌ Change behavior
- ❌ Modify test expectations
- ❌ Break existing APIs

### DO:
- ✅ Improve structure only
- ✅ Keep exact same behavior
- ✅ All tests pass unchanged
- ✅ Maintain API compatibility
```

---

## 🔗 TEMPLATE 7: INTEGRATION TASK {#template-7}

### **When to Use:**
- Connecting multiple systems
- Making systems work together
- Complex multi-file changes

### **Full Template:**

```markdown
# Task: Integrate [System A] with [System B]

## 🎯 Integration Goal

### What We're Connecting:
- **System A:** [System name] - [What it does]
- **System B:** [System name] - [What it does]

### Why Integrate:
[Goal of integration]
- Enable [capability]
- Allow [feature]
- Create [workflow]

### Expected Outcome:
[What works after integration]

---

## 📦 Integration Points

### System A Changes:
- **File:** src/systems/[SystemA].ts
- **Changes:**
  - Import [System B] functions
  - Call [function] at [point]
  - Pass [data] between systems

### System B Changes:
- **File:** src/systems/[SystemB].ts
- **Changes:**
  - Export [function] for System A
  - Handle [data] from System A
  - Return [result] to System A

### New Integration Logic:
- **File:** src/systems/[Integration].ts (if needed)
- **Purpose:** Coordinate between A and B

---

## 🎯 Implementation Steps

### Phase 1: Prepare System A
1. [Modification 1]
2. [Modification 2]
3. Test A still works independently

### Phase 2: Prepare System B
1. [Modification 1]
2. [Modification 2]
3. Test B still works independently

### Phase 3: Connect Systems
1. [Integration point 1]
2. [Integration point 2]
3. Test A→B flow works

### Phase 4: Test Full Integration
1. End-to-end testing
2. Edge cases
3. Error handling

---

## ✅ Acceptance Criteria

### Systems Work Independently:
- [ ] System A tests pass (no regressions)
- [ ] System B tests pass (no regressions)
- [ ] Original functionality preserved

### Integration Works:
- [ ] Systems communicate correctly
- [ ] Data flows A→B properly
- [ ] Results flow B→A properly
- [ ] Error handling works across systems

### Testing:
- [ ] Unit tests for each system updated
- [ ] Integration tests added (5+ tests)
- [ ] End-to-end tests pass
- [ ] ALL existing tests pass

---

## 🧪 Testing Strategy

### Test Independently:
```typescript
// System A alone
it('System A works without System B', () => {
  // Test A independently
});

// System B alone
it('System B works without System A', () => {
  // Test B independently
});
```

### Test Integration:
```typescript
// A calls B
it('System A successfully calls System B', () => {
  // Test integration
});

// Error handling
it('System A handles System B errors gracefully', () => {
  // Test error propagation
});

// End-to-end
it('Full workflow A→B→A works', () => {
  // Test complete flow
});
```

---

## ⏱️ Time Estimate
30-60 minutes
- Prep: 10 mins
- Integration: 20-30 mins
- Testing: 10-20 mins

---

## 🚫 Common Integration Pitfalls

### Avoid:
- ❌ Tight coupling (systems too dependent)
- ❌ Circular dependencies
- ❌ Breaking existing functionality
- ❌ No error handling between systems

### Ensure:
- ✅ Loose coupling (systems independent)
- ✅ Clear interfaces
- ✅ Error handling at boundaries
- ✅ Both systems still work alone
```

---

## 🎓 ADAPTATION GUIDELINES {#adaptation-guidelines}

### **How to Customize Templates:**

1. **Replace ALL placeholders:**
   ```
   [FunctionName] → Your actual function name
   [SystemName] → Your actual system name
   [Type1] → Your actual type
   etc.
   ```

2. **Add project-specific context:**
   ```markdown
   ## Context
   - Project: [Your project name]
   - Pattern: [Your specific patterns]
   - Reference: [Similar code in your project]
   ```

3. **Specify exact requirements:**
   ```markdown
   ## Requirements
   - File: [Exact path]
   - Function: [Exact signature]
   - Formula: [Exact calculation]
   - Tests: [Exact cases to cover]
   ```

4. **Set clear boundaries:**
   ```markdown
   ## Out of Scope
   - [Thing 1 NOT doing this session]
   - [Thing 2 NOT doing this session]
   ```

5. **Include acceptance criteria:**
   ```markdown
   ## Acceptance
   - [ ] [Testable criterion 1]
   - [ ] [Testable criterion 2]
   - [ ] [Testable criterion 3]
   ```

---

## 🛡️ PATTERN ENFORCEMENT {#pattern-enforcement}

### **Include in EVERY Template:**

```markdown
## Pattern Requirements (MANDATORY)

### Code Patterns:
- **Result types:** Use Result<T, E> for error handling
- **Pure functions:** No mutations, no side effects
- **Deterministic RNG:** Use IRng from src/utils/rng.ts, NEVER Math.random()
- **TypeScript strict:** No `any`, no type errors
- **Immutability:** Never modify input parameters

### Example:
```typescript
// ✅ CORRECT
export function processUnit(unit: Unit, rng: IRng): Result<Unit, string> {
  const newUnit = { ...unit, hp: unit.hp - 10 }; // New object
  return Ok(newUnit);
}

// ❌ INCORRECT
export function processUnit(unit: Unit): Unit {
  unit.hp -= 10; // Mutation!
  return unit;
}
```

### Testing Patterns:
- **Comprehensive coverage:** Happy path + edge cases + errors
- **Deterministic tests:** Use seeded RNG in tests
- **Clear descriptions:** Test names explain what's being tested

### Example:
```typescript
// ✅ CORRECT
it('returns Err for negative damage values', () => {
  const result = calculateDamage(-10);
  expect(result.ok).toBe(false);
  expect(result.error).toContain('negative');
});

// ❌ INCORRECT
it('test1', () => {
  const result = calculateDamage(-10);
  expect(result).toBeTruthy(); // Vague
});
```
```

---

## ✅ QUALITY GATES {#quality-gates}

### **Every Template Must Include:**

```markdown
## Quality Gates (MANDATORY)

### Pre-Implementation:
- [ ] Read relevant existing code
- [ ] Understand patterns to follow
- [ ] Know exact requirements
- [ ] Have clear acceptance criteria

### During Implementation:
- [ ] Follow project patterns
- [ ] Write tests alongside code
- [ ] Verify types as you go
- [ ] Check for mutations/side effects

### Post-Implementation:
- [ ] TypeScript compiles (0 errors)
- [ ] ALL tests passing (100% pass rate)
- [ ] No circular dependencies
- [ ] Code review ready (clean, readable)
- [ ] Patterns followed (Result, pure, RNG)

### Verification Commands:
```bash
# TypeScript
npm run type-check
# Expected: 0 errors

# Tests
npm test
# Expected: X/X passing (100%)

# Circular Dependencies
npm run circular
# Expected: 0 circular dependencies
```

### If Any Gate Fails:
❌ STOP - Fix before proceeding
❌ Do not continue with failing tests
❌ Do not commit broken code
❌ Do not skip verification
```

---

## ⚠️ COMMON PITFALLS {#common-pitfalls}

### **Pitfall 1: Vague Requirements**
```markdown
❌ BAD:
"Add equipment system"

✅ GOOD:
"Create EquipmentSystem.ts with 5 functions:
- equipItem(unit, item) → Result<Unit, string>
- unequipItem(unit, slot) → Result<Unit, string>
- getEquippedItem(unit, slot) → Item | undefined
- calculateStats(unit) → Stats
- isEquippable(unit, item) → boolean

Each function must use Result types and be pure."
```

### **Pitfall 2: Missing Context (Fresh Sessions)**
```markdown
❌ BAD:
# Task: Continue critical hit system
[no branch, no prior work mentioned]

✅ GOOD:
# Task: Continue critical hit system

## 🔄 Fresh Session
- Branch: feature/crits
- Prior: Session 1 created CriticalHitSystem.ts
- Expected: src/systems/CriticalHitSystem.ts exists

## BEFORE coding:
git checkout feature/crits
ls src/systems/CriticalHitSystem.ts
```

### **Pitfall 3: No Acceptance Criteria**
```markdown
❌ BAD:
"Make it work"

✅ GOOD:
## Acceptance
- [ ] Function returns Result<bool, never>
- [ ] 10 tests pass covering all cases
- [ ] TypeScript 0 errors
- [ ] Deterministic (same seed = same result)
- [ ] ALL 1000+ existing tests still pass
```

### **Pitfall 4: Scope Creep**
```markdown
❌ BAD:
"Add critical hits"
[Leads to: crits + animations + UI + sounds + balance]

✅ GOOD:
## In Scope THIS Session:
- Critical hit calculation logic only

## Out of Scope:
- Animations (Session 2 - Graphics AI)
- UI indicators (Session 3)
- Sound effects (Session 4)
- Balance tuning (After playtest)
```

### **Pitfall 5: Insufficient Testing**
```markdown
❌ BAD:
"Add a test"

✅ GOOD:
## Required Tests (10+ total):
- Boundary: luck=0, luck=100, luck=1, luck=99
- Probability: ~25%, ~50%, ~75% rates
- Determinism: same seed = same result
- Errors: negative luck, luck>100
- Edge cases: immutability, independence
```

---

## 🎯 TEMPLATE SELECTION QUICK REFERENCE

```
Task Type                    → Template #  → Time Estimate
════════════════════════════════════════════════════════════
Single utility function      → Template 1  → 5-10 mins
Add/modify type              → Template 2  → 10-20 mins
Create new system            → Template 3  → 20-30 mins
Fresh session continuation   → Template 4  → Variable + 5 mins
Fix specific bug             → Template 5  → 10-30 mins
Refactor existing code       → Template 6  → 15-60 mins
Integrate systems            → Template 7  → 30-60 mins
Multi-phase feature          → Architect AI → Break into phases
```

---

## 📚 ADDITIONAL RESOURCES

### **Full Documentation:**
- **QUICK_START.md** - Get started in 5 minutes
- **FRESH_SESSION_PROTOCOL.md** - Fresh session deep dive
- **IMPROVEMENTS_SUMMARY.md** - Why these templates exist
- **CONTEXT_PACKAGE.md** - Quick context for next chat

### **Reference Examples:**
- **Test 1:** Template 1 in action (getRandomElement)
- **Test 2:** Template 2 in action (luck stat)
- **Test 3:** Template 3 in action (CriticalHitSystem)

---

**This is your complete template system - battle-tested and ready to use!** 🚀
