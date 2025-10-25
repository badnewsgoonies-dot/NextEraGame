# 🔄 Chat Reset Guide - Handling Context Limits

## 📚 Overview

This guide covers how to handle "soft resets" when your AI chat context gets full. A soft reset means starting a fresh chat session while preserving all the important decisions and progress.

**Why you need this:**
- AI chats have token/context limits
- Long design discussions fill up context
- Complex tasks generate lots of conversation
- Need efficient way to resume without losing progress

**What this guide covers:**
- When to reset (warning signs)
- How to create handoff summaries
- Templates for all three AI roles
- Real examples (like our elemental gem redesign!)
- Common mistakes to avoid

---

## 🚦 When to Reset - Warning Signs

### **Time to Reset When:**

1. **Response quality degrading:**
   - AI starts forgetting earlier decisions
   - Responses become less coherent
   - AI repeats information already discussed

2. **Context warnings:**
   - AI mentions "I don't see that in our conversation"
   - AI asks for information already provided
   - Performance noticeably slower

3. **Long planning sessions:**
   - Spent 30+ minutes designing a feature
   - Made many decisions that need to be locked in
   - Ready to move from planning to implementation

4. **Natural breakpoints:**
   - Finished a major design discussion
   - About to delegate task to specialist AI
   - Completed a review cycle

### **Don't Reset When:**

- ❌ In the middle of active implementation
- ❌ During complex debugging (need full context)
- ❌ First few exchanges of a conversation
- ❌ Just because chat is "long" (quality matters, not length)

---

## 📋 Reset Process (Step-by-Step)

### **Step 1: Create Handoff Summary (In Current Chat)**

**Before closing the chat, ask the AI:**

```
We're hitting context limits. Please create a concise handoff summary for a fresh chat.

Include:
1. Role (Architect/Coder/Graphics)
2. What we were working on
3. Key decisions made
4. Next actions
5. Any blockers or open questions

Keep it under 500 words - decisions and actions only, not the full discussion.
```

**AI will generate structured summary (see templates below).**

---

### **Step 2: Copy the Summary**

- Select ALL text from the handoff summary
- Copy to clipboard
- Keep it handy for next step

---

### **Step 3: Open Fresh Chat Session**

- Open a new AI chat window/tab
- Don't close the old chat yet (in case you need to reference something)

---

### **Step 4: Initialize Fresh Chat**

**For Architect:**
```
You are the ARCHITECT AI for the NextEraGame project.

Read your onboarding document: docs/ai/ARCHITECT_ONBOARDING.md

Then review this handoff summary from the previous chat session:

[PASTE HANDOFF SUMMARY HERE]

Confirm you understand the context and are ready to continue.
```

**For Coder:**
```
You are the IMPLEMENTATION CODER AI for the NextEraGame project.

Read your onboarding document: docs/ai/IMPLEMENTATION_CODER_ONBOARDING.md

Then review this handoff summary from the previous chat session:

[PASTE HANDOFF SUMMARY HERE]

Confirm you understand the context and are ready to continue.
```

**For Graphics:**
```
You are the GRAPHICS AI for the NextEraGame project.

Read your onboarding document: docs/ai/GRAPHICS_ONBOARDING.md

Then review this handoff summary from the previous chat session:

[PASTE HANDOFF SUMMARY HERE]

Confirm you understand the context and are ready to continue.
```

---

### **Step 5: Verify & Continue**

- AI should confirm understanding
- AI should acknowledge key decisions
- AI should be ready to proceed with next actions
- If AI seems confused, provide more context from old chat

---

## 📝 Handoff Summary Templates

### **Template: Architect Handoff**

```markdown
## 🔄 Architect Chat Reset Handoff

**Role:** Architect AI
**Date:** [October 25, 2025]
**Reason for Reset:** [Context full / Long planning session]

---

### 📌 Current Task
**Working On:** [Feature name or decision being made]
**Status:** [Planning / Reviewing / Deciding next steps]

---

### ✅ Key Decisions Made

1. **[Decision 1 Name]**
   - Decision: [What was decided]
   - Rationale: [Why]

2. **[Decision 2 Name]**
   - Decision: [What was decided]
   - Rationale: [Why]

3. **[Decision 3 Name]**
   - Decision: [What was decided]
   - Rationale: [Why]

[Add more as needed]

---

### 📝 Next Actions

1. **Immediate:** [Next thing to do]
2. **Then:** [Following step]
3. **After that:** [Subsequent step]

---

### 🔗 Reference

**Files to Create:**
- [List any docs/files that need to be created]

**Files to Modify:**
- [List any existing files that need changes]

**Open Questions:**
- [Any unresolved issues or blockers]

---

### 💡 Context Notes

[Any additional context that's critical to remember]
[Keep this brief - 1-2 sentences max]
```

---

### **Template: Coder Handoff**

```markdown
## 🔄 Coder Chat Reset Handoff

**Role:** Implementation Coder AI
**Date:** [October 25, 2025]
**Reason for Reset:** [Context full / Long implementation]

---

### 📌 Current Task
**Task:** [Task name from architect]
**Status:** [Not started / Phase X of Y / Testing / Blocked]

---

### ✅ Completed Work

**Phases Completed:**
- [x] Phase 1: [Description]
- [x] Phase 2: [Description]
- [ ] Phase 3: [In progress/Not started]

**Files Created:**
- `path/to/file1.ts` - [Purpose]
- `path/to/file2.test.ts` - [Purpose]

**Files Modified:**
- `path/to/existing.ts` - [Changes made]

**Tests Added:** [X tests (Y/Y passing)]

---

### 📝 Next Actions

1. **Immediate:** [What to do next]
2. **Then:** [Following step]
3. **Finally:** [Last step before reporting]

---

### 🔗 Reference

**Patterns to Follow:**
- [List any specific patterns mentioned]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Blockers:**
- [Any issues preventing progress]

---

### 💡 Context Notes

[Critical technical details]
[Edge cases to remember]
```

---

### **Template: Graphics Handoff**

```markdown
## 🔄 Graphics Chat Reset Handoff

**Role:** Graphics AI
**Date:** [October 25, 2025]
**Reason for Reset:** [Context full / Long visual work]

---

### 📌 Current Task
**Task:** [Visual task from architect]
**Status:** [Planning / Implementing / Testing]

---

### ✅ Completed Work

**Sprites Integrated:**
- [Character/unit name] → [Sprite path]
- [Character/unit name] → [Sprite path]

**Screens Polished:**
- [Screen name] - [What was improved]

**Files Modified:**
- `path/to/component.tsx` - [Visual changes]
- `src/data/spriteRegistry.ts` - [Sprite mappings]

---

### 📝 Next Actions

1. **Immediate:** [Next visual task]
2. **Then:** [Following task]
3. **Screenshot:** [When to provide visual evidence]

---

### 🔗 Reference

**Sprite Mappings:**
- [Unit → Sprite assignments]

**Style Direction:**
- [Any specific visual guidance]

**Visual Issues Found:**
- [Any bugs or inconsistencies noted]

---

### 💡 Context Notes

[Visual details to remember]
[Color schemes, layout decisions]
```

---

## 🎯 Real Example: Elemental Gem Redesign

**This actually happened in our project! Here's how it worked:**

### **Context:**
- Architect and human were designing elemental gem system
- Long discussion about counters, elements, buffs
- Chat context getting full
- Many decisions locked in
- Ready to create implementation task

### **What We Did (The RIGHT Way):**

**Step 1: Recognized the need to reset**
- Human: "We're hitting context limits"
- Decisions were made but not yet documented

**Step 2: Created handoff summary**

```markdown
## 🔄 Chat Reset Handoff

**Task:** Redesign gem system - party-wide buffs, element-based

**Decisions Locked:**
1. Counter System: Fire↔Water, Earth↔Wind, Light↔Dark
2. Units get element field (Venus/Mars/Mercury/Jupiter/Moon/Sun)
3. 6 spells (one per element), only usable if gem matches
4. Buffs: +15% match, +5% neutral, 0% counter
5. Gem selection after starter select (once per run)
6. Element = primary classification (no Tank/DPS roles)

**Next:** Create task document in docs/planning/ELEMENTAL_GEM_REDESIGN_TASK.md
```

**Step 3: Used revert to start fresh**
- Human reverted chat to initial state
- Pasted handoff summary
- Architect immediately understood context
- Created comprehensive task document with full tokens available

### **Result:**
✅ No decisions lost
✅ Fresh context for detailed task creation
✅ Smooth handoff, no confusion
✅ Implementation can proceed with clarity

---

## ❌ Common Mistakes to Avoid

### **1. Resetting Without Handoff Summary**

**Wrong:**
```
[Close chat]
[Open new chat]
"Um... we were working on something with gems?"
```

**Result:** Lost context, decisions forgotten, waste time reconstructing

**Right:**
```
[Create detailed handoff summary]
[Copy summary]
[Open new chat with summary]
"Continue gem redesign with these locked decisions..."
```

---

### **2. Handoff Too Verbose**

**Wrong:**
```
We started by discussing how gems currently work, which is that they...
[500 words of background]
Then we talked about whether buffs should be...
[500 words of discussion]
Finally we decided...
[100 words of actual decisions]
```

**Problem:** Wastes tokens on history instead of decisions

**Right:**
```
Decisions:
1. Counter system: Fire↔Water
2. Buffs: +15% match, 0% counter
3. Selection: After starter select

Next: Create task doc
```

**Keep it concise:** Decisions and actions only!

---

### **3. Resetting Too Early**

**Wrong:**
```
[After 5 exchanges]
"Let me reset the chat"
```

**Problem:** No need yet, just wasting time

**Right:** Wait until you actually hit limits or natural breakpoint

---

### **4. Not Verifying Fresh Chat Understands**

**Wrong:**
```
[Paste handoff]
[Immediately ask for complex task]
```

**Problem:** AI might not have fully absorbed context

**Right:**
```
[Paste handoff]
"Confirm you understand these decisions"
[Wait for acknowledgment]
[Then proceed]
```

---

## 💡 Pro Tips

### **1. Keep Handoff Under 500 Words**
- Focus on **decisions** and **actions**
- Skip the **discussion** and **reasoning** (unless critical)
- Use bullet points, not paragraphs

### **2. Include Exact File Paths**
- `src/systems/GemSystem.ts` not "the gem system file"
- `tests/systems/GemSystem.test.ts` not "gem tests"
- Specificity prevents confusion

### **3. Lock In Technical Details**
- Exact function names
- Specific data structures
- Concrete acceptance criteria
- Don't say "improve the gem system" → Say "Add element field to PlayerUnit type"

### **4. Reference Existing Patterns**
```
Follow Result type pattern (see src/utils/Result.ts)
Use deterministic RNG (fork from root)
Pure functions (no mutations)
```

### **5. Test the Handoff**
After resetting:
- Ask AI to repeat key decisions back to you
- Verify it knows the next actions
- Check it has all critical context

---

## 🎨 Role-Specific Tips

### **Architect Resets:**
- Focus on **strategic decisions**
- Include **design rationale** (why choices were made)
- List **tasks to delegate** to coder/graphics
- Note **priorities** for next work

### **Coder Resets:**
- Focus on **implementation status**
- Include **phase completion** checklist
- List **files created/modified**
- Note **acceptance criteria** remaining

### **Graphics Resets:**
- Focus on **visual decisions**
- Include **sprite mappings** made
- List **screens polished**
- Note **style direction** established

---

## 🚀 Quick Reference Checklist

**Before Reset:**
- [ ] Create handoff summary (under 500 words)
- [ ] Include all key decisions
- [ ] List next actions clearly
- [ ] Note any blockers
- [ ] Copy summary to clipboard

**During Reset:**
- [ ] Open fresh chat
- [ ] Initialize with role (read onboarding doc)
- [ ] Paste handoff summary
- [ ] Wait for AI to confirm understanding

**After Reset:**
- [ ] Verify AI understands decisions
- [ ] Check AI knows next actions
- [ ] Proceed with work
- [ ] Keep old chat open for reference (temporarily)

---

## 📊 Success Metrics

**Good Reset When:**
- ✅ No decisions lost
- ✅ Fresh chat understands context immediately
- ✅ Work continues smoothly
- ✅ No time wasted reconstructing context
- ✅ AI quality restored (fresh tokens!)

**Bad Reset When:**
- ❌ Decisions forgotten
- ❌ AI confused about context
- ❌ Waste time explaining again
- ❌ Lose momentum

---

## 🎯 Summary

**Chat resets are normal and healthy!** They're a tool for managing context limits efficiently.

**The key:** Create a **concise, decision-focused handoff summary** before resetting.

**Remember:**
1. Reset when quality degrades or at natural breakpoints
2. Handoff = Decisions + Actions (not full discussion)
3. Keep it under 500 words
4. Verify fresh chat understands before proceeding
5. Use templates for consistency

**With good handoffs, resets are seamless!** 🎮✨

---

## 📚 Related Documentation

- **ARCHITECT_ONBOARDING.md** - Architect role and responsibilities
- **IMPLEMENTATION_CODER_ONBOARDING.md** - Coder role and responsibilities
- **GRAPHICS_ONBOARDING.md** - Graphics role and responsibilities
- **CHAT_TEMPLATES.md** - Chat initialization templates
- **ROLE_IDENTIFICATION.md** - Role boundaries and enforcement
