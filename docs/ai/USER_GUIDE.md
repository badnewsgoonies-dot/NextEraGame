# 🎯 USER GUIDE: Which Docs to Give Which AI

**Quick reference for starting new AI chats**

---

## 📋 TL;DR - Copy/Paste Instructions

### **Starting ARCHITECT AI:**
```
You are the ARCHITECT AI for NextEraGame.

Read these files IN ORDER:
1. C:\Dev\AiGames\NextEraGame\docs\ai\ARCHITECT_ONBOARDING.md
2. C:\Dev\AiGames\NextEraGame\docs\ai\AI_HANDOFF_QUICK.md

That's it! You're ready to plan and review.
```

### **Starting CODER AI:**
```
You are the IMPLEMENTATION CODER AI for NextEraGame.

Read these files IN ORDER:
1. C:\Dev\AiGames\NextEraGame\docs\ai\IMPLEMENTATION_CODER_ONBOARDING.md
2. C:\Dev\AiGames\NextEraGame\docs\ai\AI_HANDOFF_QUICK.md

If this is a NEW chat continuing prior work:
3. C:\Dev\AiGames\NextEraGame\docs\ai\FRESH_SESSION_PROTOCOL.md

That's it! You're ready to code.
```

### **Starting GRAPHICS AI:**
```
You are the GRAPHICS AI for NextEraGame.

Read these files IN ORDER:
1. C:\Dev\AiGames\NextEraGame\docs\ai\GRAPHICS_ONBOARDING.md
2. C:\Dev\AiGames\NextEraGame\docs\ai\AI_HANDOFF_QUICK.md

If this is a NEW chat continuing prior work:
3. C:\Dev\AiGames\NextEraGame\docs\ai\FRESH_SESSION_PROTOCOL.md

That's it! You're ready to create beauty.
```

---

## 🎭 ROLE-SPECIFIC FILE MAP

### 🏛️ ARCHITECT AI

**PRIMARY (Always read):**
- `ARCHITECT_ONBOARDING.md` - Your role, responsibilities, task creation
- `AI_HANDOFF_QUICK.md` - How to handoff tasks to Coder/Graphics

**SECONDARY (Reference as needed):**
- `CHAT_TEMPLATES.md` - Proven task templates (when creating tasks)
- `ROLE_IDENTIFICATION.md` - If roles get confused
- `AI_HANDOFF_PROTOCOL.md` - Full handoff details (if quick guide not enough)

**NEVER NEEDED:**
- ❌ `IMPLEMENTATION_CODER_ONBOARDING.md` (not your role)
- ❌ `GRAPHICS_ONBOARDING.md` (not your role)
- ❌ `FRESH_SESSION_PROTOCOL.md` (you don't code, no continuity issues)
- ❌ `INTERRUPTION_RECOVERY.md` (you don't code)

---

### 🛠️ CODER AI

**PRIMARY (Always read):**
- `IMPLEMENTATION_CODER_ONBOARDING.md` - Your role, patterns, requirements
- `AI_HANDOFF_QUICK.md` - How to receive tasks from Architect

**SECONDARY (Read when applicable):**
- `FRESH_SESSION_PROTOCOL.md` - **CRITICAL if new chat continuing work**
- `INTERRUPTION_RECOVERY.md` - If chat interrupted mid-task
- `CHAT_TEMPLATES.md` - Reference for task patterns

**REFERENCE (Only if needed):**
- `ROLE_IDENTIFICATION.md` - If roles get confused
- `AI_HANDOFF_PROTOCOL.md` - Full handoff details

**NEVER NEEDED:**
- ❌ `ARCHITECT_ONBOARDING.md` (not your role)
- ❌ `GRAPHICS_ONBOARDING.md` (not your role)

---

### 🎨 GRAPHICS AI

**PRIMARY (Always read):**
- `GRAPHICS_ONBOARDING.md` - Your role, sprite library, visual standards
- `AI_HANDOFF_QUICK.md` - How to receive tasks from Architect

**SECONDARY (Read when applicable):**
- `FRESH_SESSION_PROTOCOL.md` - **CRITICAL if new chat continuing work**
- `INTERRUPTION_RECOVERY.md` - If chat interrupted mid-task

**REFERENCE (Only if needed):**
- `ROLE_IDENTIFICATION.md` - If roles get confused
- `CHAT_TEMPLATES.md` - Reference for task patterns

**NEVER NEEDED:**
- ❌ `ARCHITECT_ONBOARDING.md` (not your role)
- ❌ `IMPLEMENTATION_CODER_ONBOARDING.md` (not your role)

---

## 📖 COMPLETE FILE REFERENCE

| File | Architect | Coder | Graphics | Purpose |
|------|-----------|-------|----------|---------|
| `ARCHITECT_ONBOARDING.md` | ✅ PRIMARY | ❌ | ❌ | Role definition, planning, review |
| `IMPLEMENTATION_CODER_ONBOARDING.md` | ❌ | ✅ PRIMARY | ❌ | Role definition, patterns, testing |
| `GRAPHICS_ONBOARDING.md` | ❌ | ❌ | ✅ PRIMARY | Role definition, sprites, polish |
| `AI_HANDOFF_QUICK.md` | ✅ PRIMARY | ✅ PRIMARY | ✅ PRIMARY | Task handoff checklist |
| `FRESH_SESSION_PROTOCOL.md` | ❌ | 🟡 WHEN NEW | 🟡 WHEN NEW | Continuing work in new chat |
| `INTERRUPTION_RECOVERY.md` | ❌ | 🟡 IF NEEDED | 🟡 IF NEEDED | Recovering from mid-task stop |
| `CHAT_TEMPLATES.md` | 🟢 REFERENCE | 🟢 REFERENCE | 🟢 REFERENCE | Proven task templates |
| `ROLE_IDENTIFICATION.md` | 🟢 IF CONFUSED | 🟢 IF CONFUSED | 🟢 IF CONFUSED | Boundary clarification |
| `AI_HANDOFF_PROTOCOL.md` | 🟢 REFERENCE | 🟢 REFERENCE | 🟢 REFERENCE | Full handoff details |

**Legend:**
- ✅ PRIMARY = Always read at start
- 🟡 CONDITIONAL = Read when situation applies
- 🟢 REFERENCE = Read only if needed
- ❌ NOT NEEDED = Skip entirely

---

## 🚀 STARTUP SCRIPTS (For Easy Copy/Paste)

### **Option A: Same Chat, Multiple Sessions**

**Session 1:**
```
[Give PRIMARY files]

Task: [Your task here]
```

**Session 2 (same chat):**
```
Continue from Session 1.

Task: [Your task here]
```

✅ **No need to re-read docs in same chat!**

---

### **Option B: New Chat, Continuing Work**

**New Coder Chat:**
```
You are the IMPLEMENTATION CODER AI for NextEraGame.

Read IN ORDER:
1. IMPLEMENTATION_CODER_ONBOARDING.md
2. AI_HANDOFF_QUICK.md  
3. FRESH_SESSION_PROTOCOL.md ← CRITICAL for new chats!

This is a NEW chat continuing from Session X.

[Provide context about prior work]

Task: [Your task here]
```

**New Graphics Chat:**
```
You are the GRAPHICS AI for NextEraGame.

Read IN ORDER:
1. GRAPHICS_ONBOARDING.md
2. AI_HANDOFF_QUICK.md
3. FRESH_SESSION_PROTOCOL.md ← CRITICAL for new chats!

This is a NEW chat continuing from Session X.

[Provide context about prior work]

Task: [Your task here]
```

---

### **Option C: Chat Interrupted Mid-Task**

**Resume in SAME Chat:**
```
Chat was interrupted. Let's recover.

Read: INTERRUPTION_RECOVERY.md

Then resume where we left off.
```

**Resume in NEW Chat:**
```
Previous chat was interrupted mid-task.

Read IN ORDER:
1. [Your role onboarding doc]
2. FRESH_SESSION_PROTOCOL.md
3. INTERRUPTION_RECOVERY.md

[Describe what was completed vs what's pending]

Let's continue.
```

---

## 🎯 HOW TO ENSURE AIS FOLLOW GUIDELINES

### **Method 1: Explicit Reading (Current Approach)**
```
Read this file: C:\Dev\AiGames\NextEraGame\docs\ai\[FILENAME].md

After reading, confirm:
1. You understand your role
2. You know the patterns to follow
3. You're ready to start
```

✅ **Pro:** AI explicitly reads and confirms  
⚠️ **Con:** Relies on AI actually reading

---

### **Method 2: Self-Enforcing Instructions (Embedded)**

All onboarding docs now have:

**At the TOP:**
```markdown
## 🚨 CRITICAL: READ THIS ENTIRE FILE FIRST

Before accepting ANY tasks:
- [ ] Read this complete file
- [ ] Understand your role boundaries  
- [ ] Confirm architectural patterns
- [ ] Reply: "I have read [FILENAME] and understand my role"

DO NOT proceed without confirming.
```

**At the BOTTOM:**
```markdown
## ✅ CONFIRMATION REQUIRED

Before starting work, confirm:
"I have read [FILENAME]. I will follow [patterns]. I understand my boundaries."

DO NOT start without explicit confirmation.
```

✅ **Pro:** Self-policing  
✅ **Pro:** Forces AI to acknowledge

---

### **Method 3: Pattern Enforcement (In Code Review)**

When Architect reviews Coder's work, check:

```markdown
Did Coder follow patterns?
- [ ] Result types used?
- [ ] Pure functions (no mutations)?
- [ ] Tests added?
- [ ] TypeScript 0 errors?

If NO → Reject and cite IMPLEMENTATION_CODER_ONBOARDING.md § [Section]
```

✅ **Pro:** Catches violations  
✅ **Pro:** Reinforces learning

---

## 📊 CHECKLIST: Starting a New AI Session

### Before Giving Instructions:

- [ ] Decide which AI (Architect, Coder, or Graphics)
- [ ] Find PRIMARY docs for that AI (see table above)
- [ ] Copy appropriate startup script
- [ ] Paste into new chat
- [ ] Wait for AI to confirm reading
- [ ] Verify AI states role and patterns
- [ ] THEN give task

### During Task Execution:

- [ ] AI should reference docs when uncertain
- [ ] AI should cite pattern violations (e.g., "Per IMPLEMENTATION_CODER_ONBOARDING § Result Types...")
- [ ] AI should confirm understanding before coding

### After Task Completion:

- [ ] Check if patterns followed
- [ ] If violated, cite specific doc section
- [ ] Reinforce correct behavior

---

## 🎓 TRAINING THE AIs (Over Time)

**First Session:**
```
Read: IMPLEMENTATION_CODER_ONBOARDING.md

Confirm: You will use Result types, pure functions, tests.
```

**Second Session (if pattern violated):**
```
Your code mutated the input array. That violates:
IMPLEMENTATION_CODER_ONBOARDING.md § Pure Functions

Re-read that section and fix.
```

**Third Session:**
```
[AI naturally follows patterns without prompting]
```

✅ **Result:** AI learns over multiple sessions

---

## 💡 PRO TIPS

### **Tip 1: Role Confusion?**
```
Stop. Read: ROLE_IDENTIFICATION.md

Clarify your role before continuing.
```

### **Tip 2: Fresh Session Issues?**
```
Before coding, read: FRESH_SESSION_PROTOCOL.md

Verify branch and dependencies first.
```

### **Tip 3: Task Unclear?**
```
Read: AI_HANDOFF_PROTOCOL.md

Ask Architect for clarification before starting.
```

### **Tip 4: Need Proven Templates?**
```
Check: CHAT_TEMPLATES.md

Copy structure of similar past tasks.
```

---

## 🚨 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| AI doing wrong role's work | Give `ROLE_IDENTIFICATION.md` |
| AI not following patterns | Cite specific section in onboarding doc |
| Fresh session can't find files | Give `FRESH_SESSION_PROTOCOL.md` |
| Chat interrupted mid-task | Give `INTERRUPTION_RECOVERY.md` |
| Architect task unclear | Give `AI_HANDOFF_PROTOCOL.md` |
| Need task template | Give `CHAT_TEMPLATES.md` |

---

## 📚 SUMMARY

**Core Principle:** Give AI the RIGHT docs for their ROLE at the RIGHT TIME.

**Minimal Setup:**
- Architect: 2 files (onboarding + handoff quick)
- Coder: 2 files (onboarding + handoff quick)
- Graphics: 2 files (onboarding + handoff quick)

**Add when needed:**
- Fresh session: +1 file (protocol)
- Interrupted: +1 file (recovery)
- Reference: +2 files (templates, full handoff)

**Enforcement:**
- AI confirms reading docs
- User checks pattern compliance
- Cite doc sections when violated

**Result:** AIs follow guidelines consistently! ✅
