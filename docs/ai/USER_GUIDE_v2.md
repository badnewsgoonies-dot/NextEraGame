# 🎯 USER GUIDE v2.0: AI Documentation Quick Reference

**Last Updated:** October 28, 2025  
**For:** Human coordinators managing AI development workflow

---

## ⚡ ULTRA-QUICK START (Copy/Paste)

### **🏛️ Starting ARCHITECT AI:**
```
You are the ARCHITECT AI for NextEraGame.

🚨 BEFORE doing ANYTHING, read these files IN ORDER:

1. C:\Dev\AiGames\NextEraGame\docs\ai\ARCHITECT_ONBOARDING.md
2. C:\Dev\AiGames\NextEraGame\docs\ai\AI_HANDOFF_QUICK.md

After reading BOTH files, confirm:
"I have read ARCHITECT_ONBOARDING.md and AI_HANDOFF_QUICK.md. 
I understand my role is to PLAN and REVIEW, not to write code. 
I will use Result types, pure functions, and provide explicit algorithms. 
Ready to work."

DO NOT proceed without this confirmation.
```

---

### **🛠️ Starting CODER AI (New Work):**
```
You are the IMPLEMENTATION CODER AI for NextEraGame.

🚨 BEFORE doing ANYTHING, read these files IN ORDER:

1. C:\Dev\AiGames\NextEraGame\docs\ai\IMPLEMENTATION_CODER_ONBOARDING.md
2. C:\Dev\AiGames\NextEraGame\docs\ai\AI_HANDOFF_QUICK.md

After reading BOTH files, confirm:
"I have read IMPLEMENTATION_CODER_ONBOARDING.md and AI_HANDOFF_QUICK.md.
I understand I will use Result types, pure functions, and deterministic RNG.
I will write tests for all code. I will NOT make strategic decisions.
Ready to work."

DO NOT proceed without this confirmation.
```

---

### **🛠️ Starting CODER AI (Continuing Work):**
```
You are the IMPLEMENTATION CODER AI for NextEraGame.

🚨 BEFORE doing ANYTHING, read these files IN ORDER:

1. C:\Dev\AiGames\NextEraGame\docs\ai\IMPLEMENTATION_CODER_ONBOARDING.md
2. C:\Dev\AiGames\NextEraGame\docs\ai\AI_HANDOFF_QUICK.md
3. C:\Dev\AiGames\NextEraGame\docs\ai\FRESH_SESSION_PROTOCOL.md  ← CRITICAL!

This is a NEW CHAT continuing from Session [X].

After reading ALL THREE files, confirm:
"I have read all three files. I understand this is a fresh session.
I will verify git branch and dependencies BEFORE coding.
I will use Result types, pure functions, tests.
Ready to work."

[Then provide context about prior sessions]

DO NOT proceed without this confirmation.
```

---

### **🎨 Starting GRAPHICS AI (New Work):**
```
You are the GRAPHICS AI for NextEraGame.

🚨 BEFORE doing ANYTHING, read these files IN ORDER:

1. C:\Dev\AiGames\NextEraGame\docs\ai\GRAPHICS_ONBOARDING.md
2. C:\Dev\AiGames\NextEraGame\docs\ai\AI_HANDOFF_QUICK.md

After reading BOTH files, confirm:
"I have read GRAPHICS_ONBOARDING.md and AI_HANDOFF_QUICK.md.
I understand my role is UI/sprites/polish, not game logic.
I will use Golden Sun sprites and avoid emoji.
Ready to work."

DO NOT proceed without this confirmation.
```

---

### **🎨 Starting GRAPHICS AI (Continuing Work):**
```
You are the GRAPHICS AI for NextEraGame.

🚨 BEFORE doing ANYTHING, read these files IN ORDER:

1. C:\Dev\AiGames\NextEraGame\docs\ai\GRAPHICS_ONBOARDING.md
2. C:\Dev\AiGames\NextEraGame\docs\ai\AI_HANDOFF_QUICK.md
3. C:\Dev\AiGames\NextEraGame\docs\ai\FRESH_SESSION_PROTOCOL.md  ← CRITICAL!

This is a NEW CHAT continuing from Session [X].

After reading ALL THREE files, confirm:
"I have read all three files. I understand this is a fresh session.
I will verify prior work before making changes.
I will use sprites and focus on visual polish.
Ready to work."

[Then provide context about prior sessions]

DO NOT proceed without this confirmation.
```

---

## 📚 COMPLETE FILE REFERENCE (10 Core Files)

| File | Architect | Coder | Graphics | Purpose |
|------|-----------|-------|----------|---------|
| `ARCHITECT_ONBOARDING.md` | ✅ PRIMARY | ❌ Never | ❌ Never | Role: planning, decisions, review |
| `IMPLEMENTATION_CODER_ONBOARDING.md` | ❌ Never | ✅ PRIMARY | ❌ Never | Role: code, tests, patterns |
| `GRAPHICS_ONBOARDING.md` | ❌ Never | ❌ Never | ✅ PRIMARY | Role: UI, sprites, polish |
| `AI_HANDOFF_QUICK.md` | ✅ PRIMARY | ✅ PRIMARY | ✅ PRIMARY | Handoff checklist (all roles) |
| `FRESH_SESSION_PROTOCOL.md` | ❌ Never | 🟡 NEW CHAT | 🟡 NEW CHAT | Continuing work protocol |
| `INTERRUPTION_RECOVERY.md` | ❌ Never | 🟡 IF INTERRUPTED | 🟡 IF INTERRUPTED | Mid-task recovery |
| `CHAT_TEMPLATES.md` | 🟢 REFERENCE | 🟢 REFERENCE | 🟢 REFERENCE | Proven task templates |
| `AI_HANDOFF_PROTOCOL.md` | 🟢 REFERENCE | 🟢 REFERENCE | 🟢 REFERENCE | Full handoff details |
| `README.md` | 🟢 OVERVIEW | 🟢 OVERVIEW | 🟢 OVERVIEW | Project documentation index |
| `USER_GUIDE.md` | 🔵 YOU ARE HERE | 🔵 YOU ARE HERE | 🔵 YOU ARE HERE | This file |

**Legend:**
- ✅ **PRIMARY** = Always read at session start
- 🟡 **CONDITIONAL** = Read when situation applies
- 🟢 **REFERENCE** = Read only if needed
- ❌ **NEVER** = Not for this role
- 🔵 **META** = Documentation about documentation

---

## 🛡️ ENFORCEMENT MECHANISM (How to Ensure AIs Follow Guidelines)

### **Method 1: Self-Enforcing Prompts (Built-In) ✅**

All startup prompts above include:
1. 🚨 WARNING: Read files BEFORE proceeding
2. 📋 CHECKLIST: Explicit confirmation required
3. ⛔ BLOCKER: "DO NOT proceed without confirmation"

**Why this works:**
- AI must acknowledge reading
- AI must state understanding
- AI must confirm patterns
- Creates explicit commitment

---

### **Method 2: Pattern Verification (During Work)**

When AI completes work, check for pattern compliance:

**For Coder AI:**
```
Did you follow the patterns from IMPLEMENTATION_CODER_ONBOARDING.md?

Checklist:
- [ ] Used Result<T, E> types for fallible functions?
- [ ] Pure functions (no mutations)?
- [ ] Added tests (10+ per task)?
- [ ] TypeScript 0 errors?
- [ ] File sizes ≤500 lines?

If NO on any item, cite the specific section:
"You violated IMPLEMENTATION_CODER_ONBOARDING.md § Result Types.
Please re-read that section and fix."
```

**For Graphics AI:**
```
Did you follow the patterns from GRAPHICS_ONBOARDING.md?

Checklist:
- [ ] Used Golden Sun sprites (not emoji)?
- [ ] 0 console 404 errors?
- [ ] Proper sprite paths?
- [ ] pixelated image rendering?

If NO, cite: "GRAPHICS_ONBOARDING.md § Sprite Integration"
```

---

### **Method 3: Architect Review (Quality Gate)**

When Coder/Graphics reports completion, Architect reviews:

```
Architect AI - Review this completion report:

[Paste Coder's completion report]

Check against acceptance criteria in original task.

If criteria NOT met:
1. Cite specific violation
2. Reference doc section
3. Request fixes

Example:
"Task specified Result<T, E> but code uses throw Error().
Violates: IMPLEMENTATION_CODER_ONBOARDING.md § Result Types
Request: Refactor to use Result pattern"
```

---

### **Method 4: Interrupt and Correct**

If AI starts doing wrong thing MID-TASK:

```
STOP.

You're violating your role boundaries.

Re-read: [ROLE]_ONBOARDING.md § [Section]

Example:
- Coder making strategic decisions → "Re-read § Role Boundaries"
- Graphics writing game logic → "Re-read § What Graphics AI Does"
- Architect writing code → "Re-read § Role Definition"

After re-reading, confirm understanding and continue.
```

---

## 📊 WORKFLOW DIAGRAM

```
┌─────────────────────────────────────────────────────┐
│                 HUMAN COORDINATOR                   │
│         (You - starting AI sessions)                │
└────────┬────────────────────┬───────────────────────┘
         │                    │
         │ Give USER_GUIDE    │ Give USER_GUIDE
         │ startup prompt     │ startup prompt
         │                    │
    ┌────▼────┐         ┌─────▼────┐
    │ARCHITECT│         │  CODER   │
    │   🏛️    │         │   🛠️     │
    │         │  Task   │          │
    │ Read 2  ├────────►│  Read    │
    │ files   │  Prompt │  2-3     │
    │         │         │  files   │
    │ Confirm │◄────────┤          │
    │ patterns│ Report  │ Confirm  │
    └────┬────┘         │ patterns │
         │              └──────────┘
         │
         │ Give USER_GUIDE
         │ startup prompt
         │
    ┌────▼────┐
    │GRAPHICS │
    │   🎨    │
    │         │
    │ Read    │
    │ 2-3     │
    │ files   │
    │         │
    │ Confirm │
    │ patterns│
    └─────────┘
```

**Flow:**
1. You (human) use USER_GUIDE to start AI
2. AI reads specified files
3. AI confirms understanding + patterns
4. You give task
5. AI works following patterns
6. You verify patterns followed
7. If violated → cite doc section, request fix

---

## 🎓 TRAINING AIS OVER TIME

**Session 1:**
```
[AI reads docs, confirms patterns]
[Works on task]
[You check: Did they follow patterns?]
```

**Session 2 (if pattern violated in Session 1):**
```
"In Session 1, you violated [Pattern].
That's in [DOC].md § [Section].
Re-read that section now.
Confirm you understand before starting today's task."
```

**Session 3:**
```
[AI naturally follows patterns without prompting]
```

**Result:** Reinforcement learning through explicit feedback!

---

## 🚨 COMMON VIOLATIONS & HOW TO FIX

| Violation | How to Detect | How to Fix |
|-----------|---------------|------------|
| Coder making decisions | Says "I decided to...", "I chose to..." | "Re-read IMPLEMENTATION_CODER_ONBOARDING § Role Boundaries" |
| Architect writing code | Provides implementation code | "Re-read ARCHITECT_ONBOARDING § What Architect Does NOT Do" |
| Graphics writing logic | Modifies game systems | "Re-read GRAPHICS_ONBOARDING § Role Boundaries" |
| No Result types | Code throws errors | "Re-read IMPLEMENTATION_CODER_ONBOARDING § Result Types" |
| Impure functions | Code mutates inputs | "Re-read IMPLEMENTATION_CODER_ONBOARDING § Pure Functions" |
| No tests | Completion report shows 0 tests added | "Re-read IMPLEMENTATION_CODER_ONBOARDING § Testing" |
| Missing confirmation loop | AI starts coding without approval | "Re-read AI_HANDOFF_QUICK § Confirmation Loop" |
| Fresh session confusion | Wrong branch, missing files | "Re-read FRESH_SESSION_PROTOCOL § Pre-Flight Checklist" |

---

## 💡 PRO TIPS

### **Tip 1: Label Your Chats**
```
🏛️ ARCHITECT - NextEraGame
🛠️ CODER - NextEraGame  
🎨 GRAPHICS - NextEraGame
```
Prevents confusion about which AI is which!

---

### **Tip 2: Keep Chats Separate**
- Don't ask Coder to plan (that's Architect)
- Don't ask Architect to code (that's Coder)
- Don't ask either to do graphics (that's Graphics AI)

**Each AI has ONE job. Keep it that way.**

---

### **Tip 3: Always Verify Reading**
```
Bad:  "Here's your task [immediately]"
Good: "Read [files], confirm, then I'll give task"
```
Confirmation ensures AI actually read docs!

---

### **Tip 4: Cite Docs When Correcting**
```
Bad:  "That's wrong, use Result types"
Good: "Violates IMPLEMENTATION_CODER_ONBOARDING § Result Types. 
       Re-read and fix."
```
Teaches AI where to find the rule!

---

### **Tip 5: Fresh Sessions Need Protocol**
**Every NEW chat continuing work needs:**
```
+ C:\Dev\AiGames\NextEraGame\docs\ai\FRESH_SESSION_PROTOCOL.md
```
Don't skip this! Git chaos awaits if you do.

---

## 🎯 SUCCESS CHECKLIST

You're using this guide correctly when:

- ✅ All AI sessions start with reading confirmation
- ✅ AIs state their role boundaries clearly
- ✅ AIs follow architectural patterns (Result types, pure functions)
- ✅ You catch violations and cite doc sections
- ✅ Fresh sessions verify branch/dependencies first
- ✅ Each AI stays in their lane (no role confusion)
- ✅ Quality improves over time (AIs learn patterns)

---

## 📖 FILE SUMMARIES (What's in Each Doc)

### **ARCHITECT_ONBOARDING.md**
- Role: Planning, decisions, reviews
- Creates task prompts
- Reviews completed work
- Makes strategic choices
- Never writes code

### **IMPLEMENTATION_CODER_ONBOARDING.md**  
- Role: Code execution
- Result types pattern
- Pure functions
- Testing requirements
- Never makes decisions

### **GRAPHICS_ONBOARDING.md**
- Role: UI, sprites, polish
- Golden Sun sprite library
- Sprite integration workflows
- Visual quality standards
- Never writes game logic

### **AI_HANDOFF_QUICK.md**
- Checklist for task handoffs
- Architect → Coder/Graphics
- Confirmation loop
- What to include in tasks

### **FRESH_SESSION_PROTOCOL.md**
- Starting new chat with prior work
- Branch verification
- Dependency checks
- Context validation
- Git workflow

### **INTERRUPTION_RECOVERY.md**
- Chat interrupted mid-task
- State assessment
- Recovery strategies
- Resume vs restart

### **CHAT_TEMPLATES.md**
- Proven task templates
- Real examples
- Pattern guidelines
- Complexity estimates

### **AI_HANDOFF_PROTOCOL.md**
- Full handoff details
- Algorithm specifications
- Example inputs/outputs
- Integration points

### **README.md**
- Project overview
- File index
- Quick start
- Architecture summary

### **USER_GUIDE.md**
- This file!
- Which docs for which AI
- Enforcement mechanisms
- Workflow guide

---

## 🎉 YOU'RE READY!

Use the startup prompts at the top of this file.

**Remember the golden rule:**
> Give AI the RIGHT docs for their ROLE at the RIGHT TIME,
> then VERIFY they follow patterns.

**Questions?** Check the file summaries above or README.md.

---

**Version:** 2.0 (Enhanced with enforcement mechanisms)  
**Last Updated:** October 28, 2025  
**Next Update:** When new patterns added or roles change
