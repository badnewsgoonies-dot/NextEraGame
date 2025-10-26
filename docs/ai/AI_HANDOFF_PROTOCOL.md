# 🤝 AI HANDOFF PROTOCOL

**Ensuring clear communication between Architect AI and Coder AI**

---

## 📋 OVERVIEW

### The Challenge:
```
Architect AI (Strategic Planning)
    ↓ [Translation gap]
Coder AI (Implementation)
    ↓ [Misinterpretation risk]
Wrong Feature Built (Wasted time)
```

### The Solution:
**Explicit handoff protocol with verification checkpoints**

### When to Use:
- Multi-session feature development
- Complex features requiring planning
- Any time Architect AI creates session plan
- Before starting implementation in fresh chat

---

## ⚠️ REAL RISK: The Interpretation Gap

### Example of Misinterpretation:

**Architect AI says:**
> "Add critical hit system"

**What Coder AI might interpret:**
- ❌ Random crits (5% chance for all units)
- ❌ Using Math.random() (non-deterministic)
- ❌ Fixed 2x damage multiplier
- ❌ No integration with stats

**What was actually intended:**
- ✅ Luck-based crits (varies per unit)
- ✅ Using IRng (deterministic)
- ✅ Configurable multiplier
- ✅ Integrated with PlayerUnit.luck stat

**Result:** Perfect code quality, wrong feature! 30 minutes wasted.

---

## 🎯 THE HANDOFF PROTOCOL

### Phase 1: Architect AI Requirements (Planning Session)

**Architect AI MUST provide:**

#### 1. Explicit Algorithm/Formula
```markdown
❌ BAD:
"Calculate critical hit chance"

✅ GOOD:
"Formula: critChance = attacker.luck / 100
Process:
1. Get attacker.luck (0-100 range)
2. Calculate chance: luck / 100
3. Generate random using rng.nextInt(0, 99)
4. If random < luck: return Ok(true)
5. Else: return Ok(false)"
```

#### 2. Exact Function Signatures
```markdown
❌ BAD:
"Create function to check crits"

✅ GOOD:
"Function signature:
export function checkCriticalHit(
  attacker: PlayerUnit,
  rng: IRng
): Result<boolean, never>

Returns: Ok(true) if crit, Ok(false) if not"
```

#### 3. Example Input/Output
```markdown
❌ BAD:
"Function should determine if attack crits"

✅ GOOD:
"Examples:
Input: attacker.luck = 50, rng seed = 12345
Expected: ~50% crit rate over 100 rolls

Input: attacker.luck = 0
Expected: 0% crit rate (never crits)

Input: attacker.luck = 100
Expected: 100% crit rate (always crits)"
```

#### 4. Integration Points
```markdown
❌ BAD:
"Add to battle system"

✅ GOOD:
"Integration:
- Import from: src/systems/CriticalHitSystem.ts
- Called by: BattleSystem.processDamage()
- When: After hit calculation, before applying damage
- Uses: PlayerUnit.luck field (added in prior session)
- Does NOT: Modify damage calculation (separate task)"
```

#### 5. Reference Code
```markdown
❌ BAD:
"Follow existing patterns"

✅ GOOD:
"Reference files:
- src/systems/EquipmentSystem.ts (Result type pattern)
- src/systems/BattleSystem.ts (RNG usage pattern)
- tests/systems/EquipmentSystem.test.ts (test structure)

Copy structure from EquipmentSystem.ts:
- Use Result types
- Pure functions
- Deterministic RNG (IRng parameter)
- Comprehensive error handling"
```

---

### Phase 2: Coder AI Verification (Before Implementation)

**Coder AI MUST do BEFORE writing code:**

#### Verification Checklist:

```markdown
## Pre-Implementation Verification

### 1. Read Session Plan
- [ ] I have read the full session plan
- [ ] I understand the objective
- [ ] I understand the formula/algorithm
- [ ] I know which files to create/modify

### 2. Understand Requirements
- [ ] Function signatures are clear
- [ ] Input/output examples make sense
- [ ] Integration points are specified
- [ ] Reference code identified

### 3. Clarify Ambiguities
List any unclear requirements:
- [ ] Question 1: [What about X scenario?]
- [ ] Question 2: [Should I do Y or Z?]
- [ ] Question 3: [How does this interact with A?]

### 4. Confirm Approach
My interpretation:
"I will implement [feature] using [approach]:
1. Create [files]
2. Implement [functions] with [pattern]
3. Test [scenarios]
4. Integrate with [systems]

Is this correct?"

### 5. Wait for Approval
❌ DO NOT start coding until user confirms
✅ Wait for explicit "Yes, proceed"
```

---

### Phase 3: User Review Checkpoint

**User MUST review BEFORE Coder AI starts:**

#### Review Checklist:

```markdown
## User Review Checklist

### Does Coder AI's interpretation match your intent?
- [ ] Function signatures correct?
- [ ] Algorithm/formula correct?
- [ ] Integration points correct?
- [ ] Testing approach adequate?

### Red flags to watch for:
⚠️ Coder AI mentions features not in plan
⚠️ Different algorithm than specified
⚠️ Different integration points
⚠️ Scope creep (adding extra features)

### Approval:
- [ ] "Yes, proceed" (explicit approval)
- [ ] OR "Adjust [X], then proceed"
- [ ] OR "Stop, let's clarify [Y] first"
```

---

## 📝 HANDOFF TEMPLATE

### For Architect AI to Create:

```markdown
# SESSION PLAN: [Feature Name]

## 🎯 Objective
[One sentence: What we're building and why]

## 📦 Detailed Requirements

### Algorithm/Formula:
```
[Exact calculation steps]

Example:
Input: X
Process: 1. ... 2. ... 3. ...
Output: Y
```

### Function Signatures:
```typescript
export function [name](
  param1: Type1,
  param2: Type2
): Result<SuccessType, ErrorType>
```

### Example Input/Output:
```
Scenario 1:
Input: [data]
Expected: [result]

Scenario 2:
Input: [data]
Expected: [result]
```

### Integration Points:
- Import from: [file path]
- Called by: [system/function]
- When: [timing]
- Uses: [dependencies]
- Does NOT: [out of scope]

### Reference Code:
- Pattern: [file to copy structure from]
- Similar: [related functionality]
- Tests: [test file to reference]

### Testing Requirements:
- [X] tests minimum
- Must cover: [scenarios]
- Test structure: Copy from [reference test]

## ✅ Acceptance Criteria
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]
- [ ] [Testable criterion 3]

## 🚫 Explicitly Out of Scope
- [Feature A] - separate session
- [Feature B] - future work
- [Feature C] - different AI role

## ⏱️ Time Estimate
[X] minutes

---

## FOR CODER AI:

**Before implementing, you MUST:**
1. Read this entire plan
2. Verify you understand the algorithm
3. Confirm your interpretation with user
4. Wait for explicit approval
5. THEN start coding

**Confirmation format:**
"I will implement [feature] by:
- Creating [files]
- Using [algorithm]
- Following [pattern]
- Testing [scenarios]

Proceed?"
```

---

## 🎯 GOOD vs VAGUE HANDOFF EXAMPLES

### Example 1: Critical Hit System

#### ❌ VAGUE HANDOFF (DON'T DO THIS):

**Architect AI:**
```markdown
Session 1: Add critical hit system

Requirements:
- Create crit system
- Use luck stat
- Integrate with battles

Coder AI: Implement this.
```

**Problems:**
- No formula specified
- No function signatures
- No examples
- "Integrate with battles" too vague
- High risk of misinterpretation

---

#### ✅ EXPLICIT HANDOFF (DO THIS):

**Architect AI:**
```markdown
Session 1: Create Critical Hit Calculation System

## Objective:
Create a deterministic critical hit system based on PlayerUnit.luck stat

## Algorithm:
```
Formula: critChance = attacker.luck / 100

Process:
1. Validate: attacker.luck is 0-100
2. Calculate: chance = luck / 100
3. Generate: random = rng.nextInt(0, 99)
4. Compare: if random < luck, return Ok(true)
5. Else: return Ok(false)
```

## Function Signature:
```typescript
export function checkCriticalHit(
  attacker: PlayerUnit,
  rng: IRng
): Result<boolean, never>
```

## Examples:
```
luck: 0 → 0% crit rate
luck: 50 → 50% crit rate
luck: 100 → 100% crit rate

Test with seed 12345:
- luck 50 → first 10 rolls: [true, false, true, true, false, ...]
- Same seed, same luck → same sequence (deterministic)
```

## Integration:
- File: src/systems/CriticalHitSystem.ts (NEW)
- Import pattern: Same as EquipmentSystem
- Called by: (Not yet - out of scope this session)
- Uses: PlayerUnit.luck (added in prior session)

## Reference:
- Copy structure: src/systems/EquipmentSystem.ts
- Copy tests: tests/systems/EquipmentSystem.test.ts
- Use Result types: src/utils/Result.ts
- Use RNG: src/utils/rng.ts (IRng interface)

## Testing:
- 10+ tests required
- Must cover: boundaries (0, 100), probabilities (25%, 50%, 75%), determinism, errors

## Out of Scope:
- Battle system integration (Session 2)
- Damage multiplier calculation (Session 3)
- UI indicators (Graphics AI)

---

**Coder AI: Before implementing, confirm your understanding.**
```

**Result:** Clear, unambiguous, ready to implement correctly


---

### Example 2: Equipment System Refactoring

#### ❌ VAGUE HANDOFF:

```markdown
Session 3: Refactor equipment system

Requirements:
- Make it cleaner
- Improve performance
- Better structure

Coder AI: Refactor the equipment code.
```

**Problems:**
- "Cleaner" is subjective
- No specific performance goals
- "Better structure" - what does that mean?
- Risk of unnecessary changes

---

#### ✅ EXPLICIT HANDOFF:

```markdown
Session 3: Extract Equipment Validation Logic

## Objective:
Reduce duplication in EquipmentSystem.ts by extracting validation logic into helper functions

## Current Problem:
```typescript
// Duplicated 3 times in equipItem, unequipItem, swapItem:
if (!unit.equipment) {
  return Err("Unit has no equipment slots");
}
if (slot < 0 || slot >= unit.equipment.length) {
  return Err(`Invalid slot: ${slot}`);
}
```

## Solution:
Extract to helper function:
```typescript
function validateEquipmentSlot(
  unit: PlayerUnit,
  slot: number
): Result<void, string> {
  if (!unit.equipment) {
    return Err("Unit has no equipment slots");
  }
  if (slot < 0 || slot >= unit.equipment.length) {
    return Err(`Invalid slot: ${slot}`);
  }
  return Ok(undefined);
}
```

## Changes Required:
1. Add helper function (private, not exported)
2. Replace 3 duplicate blocks with helper call
3. NO other changes (pure refactor)

## Critical Requirements:
⚠️ NO BEHAVIOR CHANGE
- All existing tests must pass WITHOUT modification
- Same inputs → same outputs
- Same error messages
- Same performance (validation is trivial)

## Verification:
- [ ] TypeScript compiles
- [ ] ALL tests pass (unchanged)
- [ ] 3 duplicate blocks removed
- [ ] Helper function created
- [ ] No new features added

## Out of Scope:
- Adding new validation rules
- Changing error messages
- Performance optimization (not needed)
- Adding new features

Time: 10-15 minutes (simple refactor)
```

---

### Example 3: Data Migration

#### ❌ VAGUE HANDOFF:

```markdown
Session 5: Update unit data

Requirements:
- Add new stats
- Update all units

Coder AI: Add the new fields.
```

**Problems:**
- Which stats?
- What values?
- How to calculate?
- No migration strategy

---

#### ✅ EXPLICIT HANDOFF:

```markdown
Session 5: Add Defense and MagicDefense Stats to All Units

## Objective:
Add physical and magic defense stats to all 12 starter units with values based on role

## New Fields:
```typescript
interface PlayerUnit {
  // ... existing fields
  defense: number;      // Physical damage reduction
  magicDefense: number; // Magic damage reduction
}
```

## Value Assignment (by role):
```
Tank:    defense: 15, magicDefense: 10
Fighter: defense: 10, magicDefense: 8
Mage:    defense: 5,  magicDefense: 15
Ranger:  defense: 8,  magicDefense: 10
Support: defense: 7,  magicDefense: 12
```

## Files to Modify:
1. src/types/game.ts - Add fields to PlayerUnit interface
2. src/data/starterUnits.ts - Add values to all 12 units

## Assignment by Unit:
```
// From starterUnits.ts (reference role):
Arin (Fighter):    defense: 10, magicDefense: 8
Thane (Tank):      defense: 15, magicDefense: 10
Lyra (Mage):       defense: 5,  magicDefense: 15
Kael (Ranger):     defense: 8,  magicDefense: 10
Zara (Support):    defense: 7,  magicDefense: 12
... (7 more units - check their roles)
```

## Self-Recovery Expectations:
⚠️ This WILL break test fixtures
Expected: 10-20 test files need defense/magicDefense added

Let AI find and fix autonomously:
- Battle fixtures
- Team fixtures
- Unit mock objects

## Testing:
Create integration test:
```typescript
// tests/integration/defense.stats.test.ts
it('all 12 starter units have defense and magicDefense', () => {
  starterUnits.forEach(unit => {
    expect(unit.defense).toBeGreaterThan(0);
    expect(unit.magicDefense).toBeGreaterThan(0);
    // Verify values match role
  });
});
```

## Acceptance:
- [ ] PlayerUnit has defense and magicDefense fields
- [ ] All 12 starters have correct values (by role)
- [ ] Integration test passes
- [ ] ALL existing tests pass (after fixture fixes)
- [ ] TypeScript 0 errors

Time: 15-20 minutes (includes self-recovery)
```

---

## 🔄 THE CONFIRMATION LOOP

### Step 1: Architect Provides Plan
(Using explicit handoff template above)

### Step 2: Coder Reviews and Confirms

**Coder AI response:**
```markdown
## Pre-Implementation Confirmation

I have reviewed the session plan. Here's my understanding:

### What I will implement:
1. Create src/systems/CriticalHitSystem.ts
2. Implement checkCriticalHit(attacker: PlayerUnit, rng: IRng)
3. Formula: critChance = attacker.luck / 100, compare with random
4. Return Result<boolean, never>
5. Create 10+ tests covering boundaries, probabilities, determinism

### Pattern I will follow:
- Copy structure from EquipmentSystem.ts
- Use Result types for returns
- Pure function (no mutations)
- Deterministic RNG (IRng parameter)

### Testing approach:
- Boundary tests: luck 0, 1, 99, 100
- Probability tests: 25%, 50%, 75% rates
- Determinism: same seed = same results
- Error handling: invalid luck values
- Edge cases: immutability, independence

### What I will NOT do:
- Integrate with battle system (out of scope)
- Modify damage calculations (separate task)
- Add UI elements (Graphics AI)

### Questions/Clarifications:
[None - plan is clear]

---

**Proceed with implementation?**
```

### Step 3: User Approves

**User response:**
```
✅ Yes, proceed
```

OR

```
⚠️ Adjust: luck should be 1-100, not 0-100. Zero luck still has 5% base crit chance.

Update formula:
baseCritChance = 0.05
bonusCritChance = (luck - 1) / 100
totalCritChance = baseCritChance + bonusCritChance

Then proceed.
```

### Step 4: Coder Implements

Only after explicit approval does Coder AI start writing code.

---

## ⚠️ RED FLAGS: When to Stop and Clarify

### Stop Sign 1: Ambiguous Requirements

**Example:**
```markdown
Plan says: "Integrate with battle system"

Red flags:
- Where exactly in battle system?
- At what point in the flow?
- What data does it receive?
- What does it return?
```

**Action:**
```
❌ DO NOT guess and implement
✅ Ask: "Please specify:
- Which function in BattleSystem calls this?
- At what point in the battle flow?
- What parameters are passed?
- What should be returned?"
```

---

### Stop Sign 2: Missing Examples

**Example:**
```markdown
Plan says: "Calculate damage modifier"

Red flags:
- No formula provided
- No example calculations
- Don't know what "modifier" means
```

**Action:**
```
❌ DO NOT make up formula
✅ Ask: "Please provide:
- Exact formula for damage modifier
- Example: input values → output value
- Edge cases: what if defense > attack?"
```

---

### Stop Sign 3: Unclear Integration

**Example:**
```markdown
Plan says: "Add to game loop"

Red flags:
- Which file is game loop?
- Where in the loop?
- Does it replace existing code or add?
```

**Action:**
```
❌ DO NOT assume
✅ Ask: "Please specify:
- File path of game loop
- Exact line/function to modify
- Does this replace X or add alongside X?"
```

---

### Stop Sign 4: Scope Creep

**Example:**
```markdown
Plan says: "Add critical hits"

Coder thinks: "I should also add:
- Crit damage multiplier (2x)
- Crit animation trigger
- Crit sound effect
- Crit UI indicator"

Red flags:
- Adding features not in plan
- Making assumptions about scope
```

**Action:**
```
❌ DO NOT add extra features
✅ Ask: "Plan specifies crit calculation only.
Should I also implement:
- Damage multiplier?
- Animation triggers?
- UI elements?

Or are these separate tasks?"
```

---

## ✅ SUCCESS METRICS

### Good Handoff:
✅ Coder AI asks 0-2 clarifying questions  
✅ Implementation matches intent exactly  
✅ Zero wasted time on wrong approach  
✅ Code is correct first try  
✅ Acceptance criteria all met  

### Bad Handoff:
❌ Coder AI asks 5+ questions (plan was vague)  
❌ Implements wrong feature (misunderstood)  
❌ 30+ mins wasted, needs to redo  
❌ Code works but not what was wanted  
❌ Scope creep (added unplanned features)  

---

## 🎯 CHECKLIST SUMMARY

### For Architect AI:
- [ ] Explicit algorithm/formula provided
- [ ] Exact function signatures specified
- [ ] Example input/output shown
- [ ] Integration points detailed
- [ ] Reference code identified
- [ ] Testing requirements clear
- [ ] Out of scope items listed

### For Coder AI:
- [ ] Read full session plan
- [ ] Understand algorithm
- [ ] Confirm interpretation
- [ ] Ask clarifying questions
- [ ] Wait for approval
- [ ] THEN implement

### For User:
- [ ] Review Coder's interpretation
- [ ] Check for misunderstandings
- [ ] Verify scope is correct
- [ ] Give explicit approval
- [ ] OR request adjustments

---

## 🔗 RELATED DOCUMENTATION

**Planning:**
- `ARCHITECT_ONBOARDING.md` - Creating session plans

**Implementation:**
- `CHAT_TEMPLATES.md` - Implementation templates
- `FRESH_SESSION_PROTOCOL.md` - Fresh chat setup

**Recovery:**
- `INTERRUPTION_RECOVERY.md` - Handling interruptions

---

## 💡 PRO TIPS

### Tip 1: Over-Communicate Rather Than Assume
```
When in doubt, be MORE explicit:
"Use IRng from src/utils/rng.ts"

Not just:
"Use deterministic RNG"
```

---

### Tip 2: Show, Don't Tell
```
✅ "Formula: x = (a + b) * c"
✅ "Example: a=5, b=3, c=2 → x=16"

❌ "Calculate the combined value"
```

---

### Tip 3: Reference Existing Code
```
✅ "Copy structure from EquipmentSystem.ts lines 45-78"

❌ "Use similar pattern to existing systems"
```

---

### Tip 4: Explicit Out of Scope
```
Prevents scope creep:
"This task does NOT include:
- Feature A (separate task)
- Feature B (future work)
- Feature C (different AI role)"
```

---

## 🚨 COMMON MISTAKES

### ❌ Mistake 1: Vague Requirements

**Wrong:**
```
"Add a system to handle equipment"
```

**Right:**
```
"Create EquipmentSystem.ts with these 3 functions:
1. equipItem(unit, item, slot) → Result<Unit, string>
2. unequipItem(unit, slot) → Result<Unit, string>
3. getEquipped(unit, slot) → Item | undefined

Example: equipItem(myUnit, ironSword, 0) → Ok(updated unit)"
```

---

### ❌ Mistake 2: No Examples

**Wrong:**
```
"Calculate critical hit chance based on luck"
```

**Right:**
```
"Formula: critChance = luck / 100
Examples:
- luck: 0 → 0% crit
- luck: 50 → 50% crit
- luck: 100 → 100% crit

Test: luck 75 over 100 rolls → ~75 crits"
```

---

### ❌ Mistake 3: Assuming Context Carry-Over

**Wrong:**
```
[Architect in Chat 1]: "We'll add crits using luck stat"
[Coder in Chat 2]: "Add critical hits"
[Coder has no context about luck stat]
```

**Right:**
```
[Architect in Chat 1]: Creates plan
[Coder in Chat 2 receives]: Full plan with "Uses PlayerUnit.luck stat from prior session"
```

---

**Remember: 5 minutes of explicit planning saves 30 minutes of confusion!** 🤝

---

## 🤝 WHEN CODER DISAGREES WITH ARCHITECT

### Scenario:
Architect proposes approach, but Coder sees potential issue.

### Coder Should:
1. **State concern explicitly:**
   "This approach may fail because [specific reason]"

2. **Propose alternative:**
   "Consider [alternative approach] instead because [benefit]"

3. **Await user decision:**
   Don't implement either until user chooses

### User Should:
1. Evaluate both approaches
2. Make explicit choice
3. Document why (for future reference)

### Example:
```
Architect: "Use array.map() for processing"

Coder: "This dataset is 100k items, map will be O(n) with full traversal.
        For early-exit scenarios, consider for loop? Could be 10x faster."

User: "Good catch. Use for loop with early exit."
```

### What NOT to Do:
❌ Coder implements own preference without asking
❌ Architect insists without considering concern  
❌ User delegates decision back to AIs ("you two figure it out")

### Best Outcome:
✅ User makes informed decision
✅ Reasoning documented
✅ Best approach chosen

---

## 📚 RELATED PROTOCOLS

- **INTERRUPTION_RECOVERY.md** - If implementation interrupted mid-task
- **FRESH_SESSION_PROTOCOL.md** - If handoff spans multiple sessions

