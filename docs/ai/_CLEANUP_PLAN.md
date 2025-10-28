# 🧹 AI DOCS CLEANUP PLAN

**Generated:** October 28, 2025  
**Purpose:** Eliminate outdated/redundant files, streamline documentation

---

## 📊 CURRENT STATE: 24 Files + Tasks Folder

**Total:** Too many files, significant redundancy

**Problems:**
- Outdated task files with specific dates
- Duplicate content across multiple files
- Empty/stub files
- Unclear which files are current

---

## 🎯 CLEANUP STRATEGY

### **KEEP (Core Documentation - 10 files)**

These are essential, up-to-date, and actively referenced:

1. ✅ **README.md** - Main index, project overview
2. ✅ **USER_GUIDE.md** - Which docs for which AI (already excellent!)
3. ✅ **ARCHITECT_ONBOARDING.md** - Architect role definition
4. ✅ **IMPLEMENTATION_CODER_ONBOARDING.md** - Coder role definition
5. ✅ **GRAPHICS_ONBOARDING.md** - Graphics role definition
6. ✅ **AI_HANDOFF_PROTOCOL.md** - Full handoff details (v3.0)
7. ✅ **AI_HANDOFF_QUICK.md** - Quick reference checklist (v3.0)
8. ✅ **FRESH_SESSION_PROTOCOL.md** - New chat continuation (v3.0)
9. ✅ **INTERRUPTION_RECOVERY.md** - Mid-task recovery (v3.0)
10. ✅ **CHAT_TEMPLATES.md** - Proven task templates with examples

---

### **DELETE (Outdated/Redundant - 9 files)**

These should be removed entirely:

1. ❌ **CHAT_RESET_GUIDE.md** - Empty file (1 line)
2. ❌ **COMPREHENSIVE_TEMPLATE_SYSTEM.md** - Redundant (1852 lines, superseded by CHAT_TEMPLATES)
3. ❌ **GRAPHICS_TASK_HANDOFF_20251026.md** - Dated task (Oct 26, specific)
4. ❌ **GRAPHICS_CURRENT_STATE.md** - Dated (Oct 27, info in GRAPHICS_ONBOARDING)
5. ❌ **GRAPHICS_CODER_HANDOFF.md** - Old version (superseded by AI_HANDOFF_PROTOCOL)
6. ❌ **IMPLEMENTATION_CODER_HANDOFF.md** - Redundant (covered in ONBOARDING)
7. ❌ **QUICK_START.md** - Redundant (covered in USER_GUIDE + README)
8. ❌ **UPDATE_SUMMARY.md** - Empty (1 line)
9. ❌ **tasks/** folder - All dated/completed tasks, archive or delete

---

### **ARCHIVE (Historical Value - 5 files)**

Move to `docs/ai/_archive/` subfolder:

1. 📦 **CONTEXT_PACKAGE.md** - Historical context system
2. 📦 **GRAPHICS_FRESH_SESSION_PROTOCOL.md** - Superseded by main FRESH_SESSION
3. 📦 **GRAPHICS_ONBOARDING_GENERALIZED.md** - Old version
4. 📦 **GRAPHICS_QA_TASK_TEMPLATE.md** - Specific template (historical)
5. 📦 **SESSION_LEARNINGS.md** - Historical learnings
6. 📦 **SPRITE_LIBRARY.md** - Now in GRAPHICS_ONBOARDING
7. 📦 **IMPROVEMENTS_SUMMARY.md** - Historical improvements doc
8. 📦 **ROLE_IDENTIFICATION.md** - Keep or archive? (Useful but rarely needed)

---

## 📁 FINAL STRUCTURE (After Cleanup)

```
docs/ai/
├── README.md                              ← Main index
├── USER_GUIDE.md                          ← Which docs for which AI
│
├── ARCHITECT_ONBOARDING.md                ← Role docs
├── IMPLEMENTATION_CODER_ONBOARDING.md
├── GRAPHICS_ONBOARDING.md
│
├── AI_HANDOFF_PROTOCOL.md                 ← Coordination
├── AI_HANDOFF_QUICK.md
│
├── FRESH_SESSION_PROTOCOL.md              ← Continuity
├── INTERRUPTION_RECOVERY.md
│
├── CHAT_TEMPLATES.md                      ← Templates
│
└── _archive/                              ← Historical docs
    ├── CONTEXT_PACKAGE.md
    ├── GRAPHICS_FRESH_SESSION_PROTOCOL.md
    ├── GRAPHICS_ONBOARDING_GENERALIZED.md
    ├── GRAPHICS_QA_TASK_TEMPLATE.md
    ├── SESSION_LEARNINGS.md
    ├── SPRITE_LIBRARY.md
    ├── IMPROVEMENTS_SUMMARY.md
    └── ROLE_IDENTIFICATION.md (maybe)
```

**Total:** 10 core files (down from 24!)

---

## 🔧 IMPLEMENTATION STEPS

### **Step 1: Create Archive Folder**
```bash
mkdir docs/ai/_archive
```

### **Step 2: Move Files to Archive**
```bash
# Historical docs
mv docs/ai/CONTEXT_PACKAGE.md docs/ai/_archive/
mv docs/ai/GRAPHICS_FRESH_SESSION_PROTOCOL.md docs/ai/_archive/
mv docs/ai/GRAPHICS_ONBOARDING_GENERALIZED.md docs/ai/_archive/
mv docs/ai/GRAPHICS_QA_TASK_TEMPLATE.md docs/ai/_archive/
mv docs/ai/SESSION_LEARNINGS.md docs/ai/_archive/
mv docs/ai/SPRITE_LIBRARY.md docs/ai/_archive/
mv docs/ai/IMPROVEMENTS_SUMMARY.md docs/ai/_archive/
mv docs/ai/ROLE_IDENTIFICATION.md docs/ai/_archive/  # Optional
```

### **Step 3: Delete Outdated Files**
```bash
# Empty/dated/redundant files
rm docs/ai/CHAT_RESET_GUIDE.md
rm docs/ai/COMPREHENSIVE_TEMPLATE_SYSTEM.md
rm docs/ai/GRAPHICS_TASK_HANDOFF_20251026.md
rm docs/ai/GRAPHICS_CURRENT_STATE.md
rm docs/ai/GRAPHICS_CODER_HANDOFF.md
rm docs/ai/IMPLEMENTATION_CODER_HANDOFF.md
rm docs/ai/QUICK_START.md
rm docs/ai/UPDATE_SUMMARY.md
```

### **Step 4: Archive Tasks Folder**
```bash
# Option A: Archive entire folder
mv docs/ai/tasks docs/ai/_archive/tasks

# Option B: Delete if no historical value
rm -rf docs/ai/tasks
```

### **Step 5: Update README.md**

Update the file list in README.md to reflect new structure:
- Remove references to deleted files
- Add note about _archive folder
- Update version to v3.1

### **Step 6: Update USER_GUIDE.md**

Verify USER_GUIDE.md only references the 10 core files:
- Remove any references to deleted files
- Confirm file table is accurate

---

## ✅ VERIFICATION CHECKLIST

After cleanup:

- [ ] Only 10 core files remain in docs/ai/
- [ ] _archive folder contains 7-8 historical files
- [ ] README.md updated with new file list
- [ ] USER_GUIDE.md references only core files
- [ ] No broken links in any documentation
- [ ] Test: Give USER_GUIDE instructions to new AI chat
- [ ] Test: AI can find all referenced files

---

## 📊 IMPACT ANALYSIS

### **Before Cleanup:**
- 24 files + tasks folder = ~25 items
- Confusion about which files are current
- Redundant/outdated content
- Hard to find the right doc

### **After Cleanup:**
- 10 core files (active use)
- 7-8 archived files (historical reference)
- Clear structure
- USER_GUIDE.md points to exactly what's needed

**Reduction:** ~60% fewer active files!

---

## 🚨 RISK MITIGATION

**What if we need archived content?**
- It's in _archive folder, not deleted
- Can be restored anytime
- Git history preserves original versions

**What if USER_GUIDE references deleted files?**
- Verify before deletion (Step 6)
- Update references in cleanup process

**What if AI needs archived docs?**
- Rare (historical content)
- Can explicitly point to _archive if needed
- Most content consolidated into core files

---

## 💡 NEXT STEPS AFTER CLEANUP

1. **Update GRAPHICS_ONBOARDING.md** (per earlier discussion)
   - Add v3.0+ protocol references
   - Add interruption recovery section
   - Version to 3.1

2. **Create _ARCHIVE_README.md**
   - Explain what's in archive and why
   - When to reference archived docs

3. **Test with Fresh AI Session**
   - Start new chat using USER_GUIDE
   - Verify all files accessible
   - Confirm AI can follow instructions

4. **Monitor for Issues**
   - Week 1: Watch for missing references
   - Week 2: Confirm no one needs archived content
   - Week 3: Consider cleanup successful

---

## 🎯 SUCCESS CRITERIA

**Cleanup is successful when:**

✅ Only essential files remain active  
✅ USER_GUIDE works perfectly  
✅ No broken references  
✅ AIs can onboard quickly (< 5 min reading)  
✅ Historical content preserved in archive  
✅ Clear, maintainable structure  

---

**Ready to execute? See implementation steps above!**
