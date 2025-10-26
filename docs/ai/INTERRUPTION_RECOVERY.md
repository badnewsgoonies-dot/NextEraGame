# 🛟 INTERRUPTION RECOVERY PROTOCOL

**What to do when AI implementation stops mid-task**

---

## 📋 OVERVIEW

### When to Use This Document:
- Chat rate limit hit during implementation
- Browser crashes mid-session
- Need to stop for break/emergency
- AI response times out
- Computer restarts/power loss
- Any interruption before "task complete"

### Why This Matters:
Partial implementations create ambiguous state:
- Half-written files (compile errors)
- Some tests pass, others don't exist yet
- Unclear what's done vs what's pending
- Git state uncertain
- Risk of duplicate work if resuming incorrectly

---

## ⚡ QUICK DIAGNOSIS (30 Second Version)

**Chat interrupted? Run this ONE command:**

```bash
npm run type-check && npm test && git status
```

**Then follow this decision tree:**

```
Does TypeScript compile? (0 errors)
│
├─ ✅ YES → Do all tests pass?
│   │
│   ├─ ✅ YES → Any uncommitted changes?
│   │   │
│   │   ├─ ✅ YES → GOOD STATE
│   │   │          └─→ Commit work, then continue (Section: Recovery Strategies)
│   │   │
│   │   └─ ❌ NO → PERFECT STATE
│   │              └─→ Just resume where you left off (Section: Same Chat Resume)
│   │
│   └─ ❌ NO → TESTS BROKEN
│              └─→ Fix failing tests first (Section: Scenario 2 - Partial Tests)
│
└─ ❌ NO → TYPESCRIPT BROKEN
           └─→ Fix compilation errors first (Section: Scenario 1 - TypeScript Errors)
```

**Severity Quick Check:**
* 🟢 TypeScript + Tests OK = Minimal damage (~5 mins to resume)
* 🟡 Tests failing = Moderate damage (~10-15 mins to fix)
* 🔴 TypeScript broken = Severe damage (~20+ mins, consider rollback)

**Jump to relevant section below** ↓

---

## 🔧 PREREQUISITES

**Before using this protocol, verify:**
```bash
# These commands should work:
npm run type-check    # TypeScript verification exists
npm test              # Test suite configured
git status            # Git initialized

# If any fail, see below
```

**Missing Commands?**
- No `type-check` script → Add to package.json or use `npx tsc --noEmit`
- No tests → You're in bigger trouble (set up tests first!)
- No git → Initialize: `git init`

**If prerequisites missing, fix those BEFORE recovering from interruption.**

---

## 🎯 REAL EXAMPLE: Test 3 Interrupted

### Scenario:
```
Task: Create CriticalHitSystem (30 min estimate)
Progress: 15 minutes elapsed
Interruption: Rate limit hit
```

### What Was Completed:
- ✅ src/systems/CriticalHitSystem.ts created
- ✅ Basic function `checkCriticalHit()` implemented
- ✅ 8 tests created (out of planned 19)
- ⚠️ Tests passing but incomplete coverage

### What Was NOT Completed:
- ❌ 11 tests still need to be written
- ❌ Integration with battle system (out of scope anyway)
- ❌ Documentation comments incomplete
- ❌ Git commit not done yet

### The Problem:
Without proper recovery protocol:
- Might recreate CriticalHitSystem.ts (duplicate work)
- Might miss that 8 tests already exist
- Unclear which acceptance criteria met vs pending
- Git state shows uncommitted changes (intentional or error?)

---

## 🚨 IMMEDIATE ACTIONS (DO THIS FIRST)

### Step 1: Assess Current State

**Run these commands immediately after interruption:**

```bash
# 1. Check if TypeScript compiles
npm run type-check

# 2. Check test status
npm test

# 3. Check git status
git status

# 4. Check which files were modified
git diff --name-only

# 5. See actual changes
git diff
```

### Step 2: Document Current State

**Create a recovery note** (text file or comment):

```markdown
## Interruption Recovery Note
Date: [timestamp]
Task: [task name]
Time Elapsed: [X minutes of Y estimated]

### Completed:
- [ ] File X created/modified
- [ ] Function Y implemented
- [ ] Z tests written (passing/failing)

### NOT Completed:
- [ ] Feature A
- [ ] Tests for B
- [ ] Integration with C

### Current State:
- TypeScript: [0 errors / X errors]
- Tests: [N passing / M total]
- Git: [clean / X uncommitted files]

### Next Steps:
- [ ] Action 1
- [ ] Action 2
```

### Step 3: Save Your Work

```bash
# Option A: Commit incomplete work (recommended)
git add .
git commit -m "WIP: [Feature Name] - interrupted at [milestone]

Completed:
- Item 1
- Item 2

Pending:
- Item 3
- Item 4"

# Option B: Stash changes (if not ready to commit)
git stash save "WIP: [Feature Name] - [timestamp]"

# Option C: Create backup branch
git checkout -b backup/[feature-name]-[timestamp]
git add .
git commit -m "Backup before recovery"
git checkout [original-branch]
```

---

## 🔄 RESUMPTION STRATEGIES

### Strategy 1: Resume in SAME Chat (If Possible)

**Best for:** Short interruptions (< 5 mins), chat still accessible

**Process:**
1. Refresh/reopen chat
2. Simply say: **"Continue from where we left off"**
3. AI has full context still in conversation history

**Example:**
```
You: "Continue from where we left off. We were implementing 
CriticalHitSystem and had completed 8/19 tests."

AI: [Checks git status, continues with remaining tests]
```

**Pros:**
- Full context preserved
- No re-explaining needed
- Seamless continuation

**Cons:**
- Only works if chat still accessible
- Not possible if browser crashed
- Rate limits may still apply

---

### Strategy 2: Resume in FRESH Chat (New Session)

**Best for:** Long interruptions, chat unavailable, new day

**CRITICAL:** Use modified Template 4 (Fresh Session) with interruption context


**Process:**

#### A. Prepare Recovery Context

Create detailed context file:

```markdown
# RECOVERY CONTEXT: [Feature Name]

## 🚨 THIS IS AN INTERRUPTED TASK

### Original Session Info:
- Started: [date/time]
- Interrupted: [date/time]
- Elapsed: [X mins of Y estimated]
- Chat ID: [if available]

### What WAS Completed:
✅ Files created:
- src/systems/CriticalHitSystem.ts (checkCriticalHit function)

✅ Tests created (8 total):
- tests/systems/CriticalHitSystem.test.ts
  - luck: 0 never crits ✅
  - luck: 100 always crits ✅
  - luck: 50 ~50% rate ✅
  - luck: 25 ~25% rate ✅
  - Same seed = same result ✅
  - Invalid luck: negative ✅
  - Invalid luck: >100 ✅
  - Multiple calls independent ✅

✅ Acceptance criteria met:
- [x] TypeScript compiles (0 errors)
- [x] Basic function implemented
- [x] 8 tests passing
- [x] Pure function pattern
- [x] Result type used

### What is PENDING:
❌ Tests NOT yet created (11 remaining):
- Original unit not mutated
- Works with different roles
- Edge case: luck exactly 50
- Edge case: luck exactly 1
- Edge case: luck exactly 99
- Probability distribution test (100+ rolls)
- Error message clarity test
- Integration with PlayerUnit test
- Multiple units independent results
- Determinism with different seeds
- Performance test (optional)

❌ Acceptance criteria PENDING:
- [ ] 19 total tests (currently 8/19)
- [ ] Deterministic behavior fully verified
- [ ] Error handling comprehensive
- [ ] JSDoc comments added

### Git State:
Branch: claude/critical-hit-system
Status: Uncommitted changes
Files modified:
- src/systems/CriticalHitSystem.ts (NEW)
- tests/systems/CriticalHitSystem.test.ts (NEW)

### Commit Status:
⚠️ NOT committed yet (work in progress)

## 🎯 RESUME TASK: Complete Remaining Tests

Pick up where we left off by:
1. Verify existing 8 tests still pass
2. Create remaining 11 tests
3. Verify all 19 tests pass
4. Add JSDoc comments
5. Final verification
```

#### B. Start Fresh Chat with Recovery Template

**Use this template in new AI chat:**

```markdown
# Task: RESUME - [Feature Name]

## 🚨 CRITICAL: This is RESUMING an interrupted task

⚠️ **DO NOT re-implement existing work**
⚠️ **READ existing files before starting**
⚠️ **Verify what's done vs what's pending**

---

## 📄 Interruption Context

[Paste your recovery context from above]

---

## ✅ MANDATORY PRE-WORK VERIFICATION

**BEFORE writing any new code, run these commands:**

```bash
# 1. Switch to correct branch
git checkout [branch-name]

# 2. Check if files exist
ls src/systems/CriticalHitSystem.ts
ls tests/systems/CriticalHitSystem.test.ts

# 3. Verify TypeScript compiles
npm run type-check

# 4. Run existing tests
npm test CriticalHitSystem

# 5. Count existing tests
grep -c "it(" tests/systems/CriticalHitSystem.test.ts
```

**Expected results:**
- Files exist: ✅
- TypeScript: 0 errors
- Tests: 8/8 passing
- Test count: 8

**If verification fails:**
STOP and report: "Verification failed - expected state not found"

---

## 🎯 YOUR TASK (Resume Work)

**You are picking up mid-implementation. Your job:**
1. Read existing CriticalHitSystem.ts
2. Read existing 8 tests
3. Implement ONLY the remaining 11 tests (listed above)
4. Add JSDoc comments
5. Final verification

**DO NOT:**
- ❌ Recreate CriticalHitSystem.ts
- ❌ Recreate existing 8 tests
- ❌ Modify existing working code (unless fixing bugs)
- ❌ Start from scratch

**DO:**
- ✅ Build on existing work
- ✅ Add remaining tests only
- ✅ Verify integration with existing code
- ✅ Complete pending acceptance criteria

---

## 📦 Requirements (Remaining Work Only)

### Create 11 Additional Tests:
[List specific tests needed]

### Add Documentation:
- JSDoc for checkCriticalHit function
- Examples in comments
- Parameter descriptions

### Final Verification:
- [ ] 19 total tests passing
- [ ] TypeScript 0 errors
- [ ] All acceptance criteria met
- [ ] Ready for git commit

---

## ⏱️ Time Estimate
15 minutes (to complete remaining 50% of original 30-min task)

---

## 🚫 Out of Scope (Was Out of Scope in Original Task)
- Integration with battle system
- UI display
- Visual effects
```

---

## 🛠️ SPECIFIC RECOVERY SCENARIOS

### Scenario A: TypeScript Compiles, Tests Pass

**Situation:**
- npm run type-check: ✅ 0 errors
- npm test: ✅ All passing
- git status: Uncommitted changes

**Assessment:** Clean partial completion

**Action:**
1. Commit work with "WIP: [feature]" message
2. Document what's pending
3. Resume with fresh chat using recovery template
4. Continue with remaining work

**Example:**
```bash
git add .
git commit -m "WIP: CriticalHitSystem - 8/19 tests complete"
git push origin [branch]

# Then start fresh chat with recovery context
```

---

### Scenario B: TypeScript Errors Present

**Situation:**
- npm run type-check: ❌ 5 errors
- npm test: ❌ Some failing
- git status: Uncommitted changes

**Assessment:** Incomplete implementation in progress

**Action:**
1. **DO NOT commit** (code is broken)
2. **Option A:** Fix immediately in same chat (if accessible)
3. **Option B:** Stash changes and start fresh with simpler scope

**Example:**
```bash
# Save broken state
git stash save "WIP broken: [feature] - [timestamp]"

# Start fresh chat with REDUCED scope:
"Original task was too large for one session.
Break into Phase 1: [smaller piece]"
```

---

### Scenario C: Files Created But Empty/Minimal

**Situation:**
- Files exist but only have boilerplate
- No real implementation yet
- Tests not written

**Assessment:** Very early interruption

**Action:**
```bash
# Remove placeholder files
git checkout -- src/systems/[file].ts
git checkout -- tests/systems/[file].test.ts

# Start fresh with full task
# (Less work to redo than to resume)
```

---

### Scenario D: Multiple Files Modified, Complex State

**Situation:**
- 5+ files modified
- Mix of complete and incomplete changes
- Unclear what works vs what's broken

**Assessment:** Complex recovery needed

**Action:**
1. Create backup branch FIRST
2. Analyze each file individually
3. Consider reverting and re-scoping

**Example:**
```bash
# Create backup
git checkout -b backup/complex-recovery-[timestamp]
git add .
git commit -m "Backup before recovery analysis"

# Return to original branch
git checkout [original-branch]

# Analyze each file
git diff src/systems/SystemA.ts  # Review changes
git diff src/types/game.ts       # Review changes

# Decide per file:
# - Keep (good work)
# - Revert (incomplete/broken)
# - Fix in fresh chat (needs completion)
```

---

## ✅ RECOVERY CHECKLIST

### Phase 1: Immediate Assessment (5 mins)
- [ ] Run type-check
- [ ] Run tests
- [ ] Check git status
- [ ] Document current state
- [ ] Save work (commit, stash, or backup branch)

### Phase 2: Decide Strategy (2 mins)
- [ ] Can resume in same chat? → Try simple "Continue"
- [ ] Need fresh chat? → Prepare recovery context
- [ ] Too broken? → Consider reverting + re-scoping

### Phase 3: Resume Execution (10-30 mins)
- [ ] Verify branch and files (fresh chat only)
- [ ] Read existing code
- [ ] Continue with pending work
- [ ] Do NOT duplicate existing work

### Phase 4: Completion Verification
- [ ] TypeScript compiles (0 errors)
- [ ] All tests pass (100%)
- [ ] Git state clean (committed)
- [ ] Acceptance criteria met
- [ ] No duplicate code created

---

## 🎯 BEST PRACTICES

### 1. Checkpoint Frequently
```bash
# Don't wait until "done" to commit
# Commit after each milestone:

git commit -m "Add checkCriticalHit function"
# ... continue working ...
git commit -m "Add first 5 tests"
# ... continue working ...
git commit -m "Add remaining tests"
# ... continue working ...
git commit -m "Add documentation"
```

**Benefit:** Easy to resume from last checkpoint


### 2. Use Feature Flags for Incomplete Work
```typescript
// If feature is incomplete but you need to commit:
const CRITICAL_HIT_ENABLED = false; // TODO: Enable after testing

export function processDamage(damage: number, attacker: Unit) {
  if (CRITICAL_HIT_ENABLED) {
    // New crit system (work in progress)
    return checkCriticalHit(attacker, rng);
  }
  
  // Old system (stable fallback)
  return calculateDamage(damage);
}
```

**Benefit:** Can commit incomplete work safely

---

### 3. Write Tests First (or Alongside)
```typescript
// Instead of:
// 1. Implement all features (30 mins)
// 2. Write all tests (20 mins)
// [Interruption at minute 40 = broken state]

// Do:
// 1. Write test 1, implement feature 1 (5 mins) ✅
// 2. Write test 2, implement feature 2 (5 mins) ✅
// 3. Write test 3, implement feature 3 (5 mins) ✅
// [Interruption at minute 15 = clean state, 3 tests working]
```

**Benefit:** Always have working state

---

### 4. Document As You Go
```typescript
/**
 * IMPLEMENTATION STATUS: 60% complete
 * 
 * ✅ Completed:
 * - Basic crit calculation
 * - Luck stat integration
 * 
 * ⏳ Pending:
 * - Equipment modifiers
 * - Status effect interactions
 * 
 * @param attacker - Unit making the attack
 * @param rng - Deterministic RNG
 * @returns Whether attack is a critical hit
 */
export function checkCriticalHit(attacker: Unit, rng: IRng) {
  // ... implementation
}
```

**Benefit:** Clear status for resumption

---

### 5. Set Time Limits
```markdown
## Session Time Limit: 25 minutes

Set a timer. At 20 mins, assess:
- Can finish in 5 mins? → Complete task
- Need more time? → Checkpoint and plan resume

DO NOT let sessions run 60+ mins without checkpoints.
```

**Benefit:** Prevents massive interruption recovery

---

## 🚫 COMMON MISTAKES

### ❌ Mistake 1: Assuming AI Remembers

**Wrong:**
```
[New chat after interruption]
You: "Continue with the critical hit system"
AI: "Sure! Let me create CriticalHitSystem.ts..."
[Recreates existing work - WASTE OF TIME]
```

**Right:**
```
[New chat after interruption]
You: "Resume interrupted task. Read recovery context: [paste context]"
AI: "I see CriticalHitSystem.ts already exists with 8 tests.
I'll add the remaining 11 tests."
[Continues correctly]
```

---

### ❌ Mistake 2: Not Checking Git State

**Wrong:**
```bash
# Resume without checking
[Start coding]
[Realize later you're on wrong branch]
[All work needs to be moved]
```

**Right:**
```bash
# ALWAYS verify first
git branch --show-current
git status
git diff --name-only
# THEN start coding
```

---

### ❌ Mistake 3: Committing Broken Code

**Wrong:**
```bash
# "I'll fix it later"
git add .
git commit -m "WIP: broken but saving progress"
[npm test fails - breaks CI/CD]
```

**Right:**
```bash
# Broken code → stash, don't commit
git stash save "WIP broken: [feature] - need to fix [issue]"

# OR use backup branch
git checkout -b wip/broken-[feature]
git add .
git commit -m "WIP: broken - see commit message for issues"
[Branch never pushed to main]
```

---

### ❌ Mistake 4: Vague Recovery Notes

**Wrong:**
```
"I was working on crits and got interrupted"
[No details - hard to resume]
```

**Right:**
```
"CriticalHitSystem implementation interrupted
- Completed: 8/19 tests
- Pending: 11 tests listed in recovery context
- Files: CriticalHitSystem.ts, CriticalHitSystem.test.ts
- Branch: claude/crit-system
- Next: Continue with remaining tests"
```

---

## 📊 SUCCESS METRICS

### Good Recovery:
✅ Resumed work in < 10 minutes  
✅ No duplicate code created  
✅ Git history is clean  
✅ All existing tests still pass  
✅ Completed remaining work as planned  

### Bad Recovery:
❌ Spent 30+ mins figuring out state  
❌ Recreated existing work  
❌ Git conflicts from confusion  
❌ Broke existing tests  
❌ Had to start over  

---

## 🎯 QUICK REFERENCE

### When Interrupted:

```bash
# 1. Assess (2 mins)
npm run type-check && npm test && git status

# 2. Save (1 min)
git add .
git commit -m "WIP: [feature] - [status]"

# 3. Document (2 mins)
echo "Recovery context: [what's done, what's pending]" > RECOVERY.md
```

### When Resuming (Same Chat):

```
"Continue from where we left off"
```

### When Resuming (Fresh Chat):

```
"Resume interrupted task. Recovery context:
- Branch: [name]
- Completed: [list]
- Pending: [list]
- Files: [list]

Verify files exist before continuing."
```

---

## 🔗 RELATED DOCUMENTATION

**Must Read for Fresh Sessions:**
- `FRESH_SESSION_PROTOCOL.md` - Branch verification
- `CHAT_TEMPLATES.md` - Template 4 (Fresh Session)

**Related Workflows:**
- `COMPREHENSIVE_TEMPLATE_SYSTEM.md` - Full template guide
- `QUICK_START.md` - Getting started

---

## 💡 PRO TIPS

### Tip 1: Use Descriptive WIP Commits
```bash
git commit -m "WIP: CriticalHitSystem - 8/19 tests complete

Completed:
- Basic function implementation
- 8 boundary and probability tests

Pending:
- 11 additional tests (immutability, edge cases)
- JSDoc comments
- Final verification

Resume: Continue with remaining tests"
```

---

### Tip 2: Keep Recovery Context in Commit Message
Makes it easy to see what's done vs pending:
```bash
git log -1  # Shows last commit with full context
```

---

### Tip 3: Timebox Sessions
```markdown
## Session Plan:
- Time budget: 25 minutes
- Checkpoint at: 20 minutes
- Hard stop at: 25 minutes

If not done by 25 mins → Commit WIP → Resume later
```

---

### Tip 4: Use Branch Names with Status
```bash
# Clear signal this is WIP
git checkout -b wip/feature-name

# When complete, rename or merge
git branch -m wip/feature-name feature-name
```

---

## ✅ FINAL CHECKLIST

**Before Interruption:**
- [ ] Checkpoint commit if possible
- [ ] Document current state
- [ ] Note what's pending

**After Interruption:**
- [ ] Assess state (type-check, tests, git)
- [ ] Save work (commit or stash)
- [ ] Create recovery context document

**When Resuming:**
- [ ] Choose strategy (same chat vs fresh)
- [ ] Verify branch and files (fresh chat)
- [ ] Read existing code
- [ ] Continue with pending work only
- [ ] Verify no duplication

**After Completion:**
- [ ] All tests pass (100%)
- [ ] TypeScript 0 errors
- [ ] Clean git history
- [ ] Recovery notes cleaned up
- [ ] Ready for review

---

**Remember: Interruptions are normal. Having a protocol makes recovery fast and painless!** 🛟

---

## 🔍 ASSESS DAMAGE (How Much Work Lost?)

**Critical: Understand scope before proceeding.**

### Quick Damage Assessment:
```bash
# See overview of changes
git diff --stat

# Count lines changed
git diff --numstat

# See which files touched
git diff --name-only

# Check last commit
git log -1 --oneline
```

### Damage Categories:

**Minimal (< 5 mins lost):**
- 1-2 files modified, < 50 lines
- TypeScript compiles, tests pass
- Recovery: Just continue

**Moderate (5-15 mins lost):**
- 3-5 files, 50-200 lines
- 1-2 new files, some tests failing
- Recovery: Need careful resume

**Severe (15+ mins lost):**
- 5+ files, 200+ lines
- Multiple new systems, tests broken
- Recovery: Consider rollback

### Memory Reconstruction:
If you forgot what you were doing:
1. Read last 5 chat messages
2. Check WIP commit message (if exists)
3. Look at git diff to see intent
4. Check open files in editor

---

## 📚 RELATED PROTOCOLS

- **AI_HANDOFF_PROTOCOL.md** - If interrupted during handoff phase
- **FRESH_SESSION_PROTOCOL.md** - If starting new chat after interruption
- **COMPREHENSIVE_TEMPLATE_SYSTEM.md** - Resume using appropriate template

