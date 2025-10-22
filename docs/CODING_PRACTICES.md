# Coding Practices & Architecture Standards

**Last Updated:** October 22, 2025  
**Status:** Production Ready (Post-Sprint 1+2)

This document codifies the current architectural patterns, code quality standards, and testing practices for the NextEra Game project.

---

## Table of Contents

1. [Code Quality Standards](#code-quality-standards)
2. [Architecture Patterns](#architecture-patterns)
3. [Testing Standards](#testing-standards)
4. [Project Structure](#project-structure)
5. [Obsolete Patterns](#obsolete-patterns)

---

## Code Quality Standards

### File Size

**Standard:** ≤500 lines per file (soft limit)

**Rationale:**
- Maintainability and readability
- AI context window constraints (Claude, Copilot)
- Focused single responsibility
- Easier to test in isolation

**Current Compliance:** 93% (58/62 files)

**Files Requiring Review:**
1. **`src/screens/BattleScreen.tsx`** - 630 lines
   - **Purpose:** Manual player-controlled JRPG battle UI
   - **Status:** ⚠️ Large but cohesive (battle rendering + input handling)
   - **Recommendation:** Monitor, consider extracting input handling logic to separate hook if grows further

2. **`src/types/game.ts`** - 526 lines
   - **Purpose:** All TypeScript type definitions for the game
   - **Status:** ⚠️ Central type file, acceptable for type-only module
   - **Recommendation:** Keep as-is (type files naturally grow, no logic duplication)

**Files Approaching Limit (400-500 lines):**
1. **`src/App.tsx`** - 454 lines - ⚠️ Monitor
2. **`src/data/opponents.ts`** - 434 lines - ⚠️ Monitor (data file, acceptable)

### Circular Dependencies

**Standard:** 0 circular dependencies

**Verification:** No automated tooling configured (recommended: add `madge` or `dpdm`)

**Current Status:** ✅ PASS (manual inspection, no circular imports detected)

**How to Check:**
```bash
# Option 1: Install madge
npm install --save-dev madge
npx madge --circular src/

# Option 2: Install dpdm
npm install --save-dev dpdm
npx dpdm src/main.tsx --circular
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `BattleScreen.tsx`, `OpponentCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `rng.ts`, `validate.ts`)
- Types: `camelCase.ts` or `PascalCase.ts` (e.g., `game.ts`)
- Tests: `*.test.ts` or `*.test.tsx` (match source file name)

**Types/Interfaces:**
- Interfaces: `PascalCase` (e.g., `BattleUnit`, `SaveEnvelope`)
- Type Aliases: `PascalCase` (e.g., `Role`, `GameState`)

**Constants:**
- Global: `UPPER_SNAKE_CASE` (e.g., `MAX_TEAM_SIZE`, `ANIMATION_TIMING`)
- Config objects: `camelCase` with readonly (e.g., `defaultConfig`)

**Functions:**
- Pure functions: `camelCase` (e.g., `executeTurn`, `generateRewards`)
- Factory functions: `make*` prefix (e.g., `makeRng`, `makeLogger`)
- Type guards: `is*` prefix (e.g., `isOk`, `isErr`)

---

## Architecture Patterns

### 1. Result Type Pattern ✅ **ACTIVE**

**Status:** Core pattern (47 tests, 100% coverage)  
**File:** `src/utils/Result.ts`  
**Usage:** All functions that can fail expectedly (not crashes)

**When to use:**
- File I/O operations (save/load)
- Data validation (user input, save data)
- Expected failures (battle defeat, invalid choice)

**When NOT to use:**
- Unexpected errors (programming bugs) → throw exceptions
- Success-only operations → return value directly

**Example:**
```typescript
function loadSave(id: string): Result<SaveData, string> {
  const data = storage.get(id);
  if (!data) return Err('Save not found');
  
  const parsed = JSON.parse(data);
  if (!isValidSave(parsed)) return Err('Invalid save format');
  
  return Ok(parsed);
}

// Usage
const result = loadSave('slot1');
if (isOk(result)) {
  console.log('Loaded:', result.value);
} else {
  console.error('Error:', result.error);
}
```

**Key Functions:**
- `Ok(value)` - Wrap success value
- `Err(error)` - Wrap error value
- `isOk(result)` - Type guard for success
- `isErr(result)` - Type guard for failure
- `unwrap()` - Extract value (throws if error)
- `unwrapOr(default)` - Extract value or use default
- `map()` - Transform success value
- `mapErr()` - Transform error value
- `andThen()` - Chain operations (monadic bind)

---

### 2. Deterministic RNG ✅ **CRITICAL**

**Status:** Critical for gameplay fairness  
**Files:** `src/utils/rng.ts`, `src/utils/rngStreams.ts`  
**Library:** `pure-rand` (not `Math.random()`)

**Rules:**
1. ✅ **Use `makeRng(seed)`** - Never `Math.random()`
2. ✅ **Fork RNG per system** - `rng.fork('system-name')`
3. ✅ **Never reuse root RNG after forking**
4. ✅ **Pass RNG explicitly** - Don't store in global state

**Example:**
```typescript
// ✅ CORRECT
function generateBattle(seed: number) {
  const rootRng = makeRng(seed);
  const choiceRng = rootRng.fork('choice');
  const battleRng = rootRng.fork('battle');
  
  const choices = generateChoices(choiceRng); // Uses choice RNG
  const outcome = executeBattle(battleRng);   // Uses battle RNG
  
  return { choices, outcome };
}

// ❌ WRONG
function generateBattle(seed: number) {
  const rng = makeRng(seed);
  
  const choices = generateChoices(rng); // Modifies RNG state
  const outcome = executeBattle(rng);   // RNG state is unpredictable
  
  return { choices, outcome };
}
```

**Key Functions:**
- `makeRng(seed)` - Create seeded RNG
- `rng.fork(label)` - Create independent child RNG
- `rng.int(min, max)` - Random integer [min, max)
- `rng.float()` - Random float [0, 1)
- `rng.choice(array)` - Pick random element
- `rng.shuffle(array)` - Shuffle array (Fisher-Yates)
- `rng.sample(array, n)` - Pick N unique elements
- `rng.weighted(weights)` - Weighted random index

---

### 3. Functional Systems ✅ **CURRENT**

**Status:** Replaced dependency injection classes  
**Usage:** All game systems are pure functions, not classes

**Rationale:**
- Simpler than DI containers
- Easier to test (no mocking needed)
- No hidden dependencies
- Explicit data flow

**Example:**
```typescript
// ✅ CORRECT: Functional system
export function executeTurn(
  state: BattleState,
  action: Action,
  rng: RandomGenerator
): BattleState {
  // Pure function, no side effects
  const newState = applyAction(state, action);
  const damage = calculateDamage(action, rng);
  return applyDamage(newState, damage);
}

// ❌ OLD: Class-based system (obsolete)
class BattleSystem {
  constructor(
    private rng: RandomGenerator,
    private logger: ILogger
  ) {}
  
  executeTurn(state: BattleState, action: Action): BattleState {
    // Hidden dependencies, harder to test
    this.logger.info('Executing turn');
    return this.applyAction(state, action);
  }
}
```

**Key Principles:**
- Systems are just exported functions
- All inputs passed as parameters
- Return new state (immutable)
- No hidden side effects
- Easy to test with pure inputs

---

### 4. Validation at Boundaries ✅ **ACTIVE**

**Status:** Active (28 tests, >90% coverage)  
**File:** `src/validation/validate.ts`  
**Library:** Valibot (not Zod - smaller bundle size)

**Usage:** Validate all external input before processing

**Boundaries:**
- User input (forms, keyboard, mouse)
- File I/O (save/load)
- Network requests (if added)
- URL parameters (if added)

**Example:**
```typescript
import * as v from 'valibot';
import { validate } from './validation/validate.js';

const SaveDataSchema = v.object({
  version: v.string(),
  timestamp: v.number(),
  battleIndex: v.number(),
  team: v.array(v.object({
    id: v.string(),
    name: v.string(),
    hp: v.number(),
  })),
});

function loadSave(rawData: unknown): Result<SaveData, Error> {
  return validate(SaveDataSchema, rawData);
}
```

**Key Functions:**
- `validate(schema, data)` - Returns `Result<T, Error>`
- `validateWith(schema, data, errorFn)` - Custom error types
- `assert(schema, data)` - Throws on failure (use sparingly)

---

### 5. Structured Logging ✅ **ACTIVE**

**Status:** Active (28 tests Logger, 24 tests EventLogger)  
**Files:** `src/systems/Logger.ts`, `src/systems/EventLogger.ts`

**Usage:**
- `Logger` - General-purpose logging with levels
- `EventLogger` - Game-specific telemetry

**Log Levels:**
- `debug` - Development debugging (disabled in prod)
- `info` - Normal operations
- `warn` - Unexpected but recoverable
- `error` - Failures requiring attention

**Example:**
```typescript
const logger = makeLogger({ minLevel: 'info' });

logger.info('Battle started', { 
  battleIndex: 5, 
  playerTeam: ['warrior', 'mage'] 
});

const childLogger = logger.child({ module: 'battle' });
childLogger.warn('Low HP', { unitId: 'warrior1', hp: 5 });
```

**EventLogger Example:**
```typescript
const eventLogger = new EventLogger(logger);

eventLogger.logBattleStarted({
  battleIndex: 5,
  opponentId: 'dragon_horde_03',
  playerTeam: [...],
  enemyTeam: [...],
});
```

---

## Testing Standards

### Coverage Goals

**Overall Target:** 40-50% (realistic for game project with heavy UI)

**By System Type:**
- Critical Systems: **90%+** (BattleSystem, RewardSystem, SaveSystem)
- User Flows: **80%+** (screens, major interactions)
- Utilities: **85%+** (Result, RNG, validation, logging)
- UI Components: **60%+** (components with business logic)

**Current Status:** 
- **515 tests passing** (7 skipped)
- **Coverage:** ~45% (target achieved)

### Test File Organization

```
tests/
├── accessibility/     # a11y audits (axe-core)
├── components/        # Component unit tests
├── core/             # GameController, StateMachine
├── fixtures/         # Shared test data
├── integration/      # Full game flow tests
├── performance/      # Render performance tests
├── screens/          # Screen/UI integration tests
├── systems/          # System logic tests
├── ui/               # UI smoke tests
├── utils/            # Utility function tests
└── validation/       # Validation logic tests
```

### Testing Patterns

#### 1. **Deterministic Testing**

Always seed RNG in tests:

```typescript
test('battle outcome is deterministic', () => {
  const rng = makeRng(12345); // Fixed seed
  const result1 = executeBattle(playerTeam, enemyTeam, rng.fork('battle'));
  
  const rng2 = makeRng(12345); // Same seed
  const result2 = executeBattle(playerTeam, enemyTeam, rng2.fork('battle'));
  
  expect(result1).toEqual(result2); // Identical outcomes
});
```

#### 2. **Accessibility Testing**

Test keyboard navigation and ARIA:

```typescript
test('screen is keyboard navigable', () => {
  render(<OpponentSelectScreen {...props} />);
  
  const cards = screen.getAllByRole('radio');
  expect(cards[0]).toHaveAttribute('tabIndex', '0'); // First focused
  
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  expect(cards[1]).toHaveAttribute('tabIndex', '0'); // Second focused
});
```

#### 3. **Edge Case Testing**

Always test boundaries:

```typescript
test('handles empty team', () => {
  const result = TeamManager.recruitUnit([], newUnit);
  expect(isOk(result)).toBe(true);
  if (isOk(result)) {
    expect(result.value.team).toHaveLength(1);
  }
});

test('handles full team', () => {
  const fullTeam = [unit1, unit2, unit3, unit4]; // MAX_TEAM_SIZE
  const result = TeamManager.recruitUnit(fullTeam, newUnit);
  expect(isErr(result)).toBe(true); // Should require replacement
});
```

#### 4. **Property-Based Testing**

Use `fast-check` for complex logic:

```typescript
import fc from 'fast-check';

test('shuffle preserves all elements', () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      const rng = makeRng(12345);
      const shuffled = rng.shuffle([...arr]);
      
      expect(shuffled.sort()).toEqual(arr.sort());
    })
  );
});
```

### Test Naming Conventions

**Pattern:** `<function/component> <scenario> <expected result>`

**Examples:**
- ✅ `validate() returns error on type mismatch`
- ✅ `BattleScreen handles Escape key to flee`
- ✅ `RewardSystem generates items for victory`
- ❌ `test1` (too vague)
- ❌ `it works` (too vague)

---

## Project Structure

### Source Organization

```
src/
├── components/        # Reusable UI components
│   ├── battle/       # Battle-specific components
│   └── *.tsx         # General components (Card, Button, etc.)
├── core/             # Game engine core
│   ├── GameController.ts     # Orchestrates systems
│   └── GameStateMachine.ts   # Screen transitions
├── data/             # Game content (opponents, items, sprites)
├── hooks/            # Custom React hooks
├── screens/          # Full-screen UI components
├── styles/           # Global CSS (Tailwind)
├── systems/          # Game logic (pure functions)
├── types/            # TypeScript type definitions
├── utils/            # Utilities (Result, RNG)
├── validation/       # Input validation (Valibot)
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

### Import Conventions

**Use `.js` extensions** (required for ESM):

```typescript
// ✅ CORRECT
import { makeRng } from './utils/rng.js';
import type { BattleUnit } from './types/game.js';

// ❌ WRONG
import { makeRng } from './utils/rng';  // No extension
import { makeRng } from './utils/rng.ts';  // .ts not .js
```

**Import Order:**
1. External libraries (`react`, `valibot`, etc.)
2. Absolute imports (`@/components/...`)
3. Relative imports (`./utils/...`, `../types/...`)

---

## Obsolete Patterns

The following patterns were used in early development but have been **replaced**:

### ❌ 1. Dependency Injection Classes

**Status:** Replaced with functional systems  
**Last Used:** Never in production code  
**Reason:** Unnecessary complexity, harder to test

**Old Pattern:**
```typescript
class BattleSystem {
  constructor(private rng: RandomGenerator, private logger: ILogger) {}
}
```

**New Pattern:**
```typescript
export function executeBattle(
  state: BattleState,
  rng: RandomGenerator,
  logger?: ILogger
): BattleState { /* ... */ }
```

---

### ❌ 2. SystemTemplate Base Class

**Status:** Never implemented  
**Reason:** Functional systems don't need lifecycle management

---

### ❌ 3. AsyncQueue

**Status:** ⚠️ Code exists but **UNUSED**  
**File:** `src/utils/AsyncQueue.ts` (60 lines)  
**Recommendation:** **DELETE** if not used by next sprint

**Purpose:** Serializes async operations to prevent race conditions  
**Why Unused:** React's `useEffect` cleanup and state management handle most async concerns

**Search Results:**
- No imports found in `src/`
- Only referenced in its own definition file
- Safe to remove

---

### ❌ 4. Scope Resource Management

**Status:** Never implemented  
**Reason:** React's `useEffect` cleanup handles resource lifecycle automatically

---

## Maintenance Checklist

### Before Committing

- [ ] `npm run type-check` passes (0 TypeScript errors)
- [ ] `npm test` passes (100% pass rate)
- [ ] No new files >500 lines (unless justified)
- [ ] No new circular dependencies
- [ ] New code follows naming conventions
- [ ] Tests added for new features (aim for coverage targets)

### Monthly Review

- [ ] Run file size audit (PowerShell script from audit task)
- [ ] Check for circular dependencies (install `madge` if needed)
- [ ] Review test coverage (`npm run test:coverage`)
- [ ] Update this document with new patterns
- [ ] Remove obsolete patterns after 2 sprints unused

---

## Quick Reference

### Common Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint

# Development server
npm run dev

# Production build
npm run build
```

### Key Files to Read First

For new contributors:
1. `docs/CODING_PRACTICES.md` (this file)
2. `src/types/game.ts` - Understand all types
3. `src/utils/Result.ts` - Core error handling
4. `src/utils/rng.ts` - Deterministic randomness
5. `README.md` - Project overview

---

## Additional Resources

- **Architecture Decisions:** `docs/architecture/ARCHITECTURE_DECISIONS.md`
- **Testing Guide:** `docs/QA_CHECKLIST.md`
- **Deployment:** `docs/deployment/DEPLOYMENT_GUIDE.md`
- **Session History:** `docs/sessions/SESSION_SUMMARY.md`

---

**Questions?** Open an issue or ask in team chat!
