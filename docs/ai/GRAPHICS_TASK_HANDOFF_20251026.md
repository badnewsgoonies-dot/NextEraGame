# 🎨 Graphics AI: Urgent Layout & Sprite Overhaul

**Priority:** CRITICAL  
**Date:** 2025-10-26  
**Estimated Time:** 4-6 hours

---

## 🚨 User Complaints (Direct Quotes)

> "I DONT WANT TO SCROLL AT ANY POINT EVER"

> "no more emotes unless absolutely impossible everything should be a fire emblem sprite"

---

## 📋 Quick Summary

You have **TWO critical tasks**:

1. **Fix Layout Overflow** - StarterSelectScreen has bottom row cut off (see screenshot), user must scroll. FIX IT.
2. **Replace ALL Emojis** - Game uses 🔥💧⚡⚔️🛡️💍💎 everywhere. Replace with Fire Emblem pixel art sprites.

---

## 📖 Full Task Documentation

**READ THIS FIRST:** `docs/ai/tasks/TASK_SPRITE_GRAPHICS_OVERHAUL.md`

That document has:
- Complete problem breakdown
- Layout fix strategies (4 options)
- Sprite asset requirements (dimensions, style, sourcing)
- Code patterns for emoji replacement
- Testing requirements (1366x768, 1440x900, 1920x1080)
- File modification list

---

## ⚡ Quick Start Checklist

### Before You Start:

- [ ] Read full task doc: `docs/ai/tasks/TASK_SPRITE_GRAPHICS_OVERHAUL.md`
- [ ] Look at user screenshot (bottom row cut off)
- [ ] Check existing sprites in `public/sprites/golden-sun/` for style reference
- [ ] Create branch: `graphics/layout-and-sprite-overhaul-20251026`
- [ ] Run game in dev mode: `npm run dev`

### Priority 1: Fix StarterSelectScreen Layout (1-2 hours)

- [ ] Open `src/screens/StarterSelectScreen.tsx`
- [ ] Test current layout at 1366x768 resolution (browser dev tools)
- [ ] Try Option A: Reduce card size + spacing
- [ ] Try Option B: 3-column grid (if A fails)
- [ ] Try Option C: Viewport-based sizing (if B fails)
- [ ] Test on 1920x1080, 1440x900, 1366x768
- [ ] Verify ALL character cards visible without scrolling
- [ ] Commit: "Fix StarterSelectScreen layout - remove scrolling"

### Priority 2: Audit Other Screens (30-60 min)

- [ ] Run game at 1366x768 resolution
- [ ] Navigate to EVERY screen:
  - [ ] OpponentSelectScreen
  - [ ] GemSelectScreen (6 gems - likely overflow)
  - [ ] EquipmentScreen
  - [ ] InventoryScreen
  - [ ] BattleScreen
  - [ ] RecruitmentScreen
- [ ] Screenshot any overflow
- [ ] Fix each screen (same techniques as StarterSelectScreen)
- [ ] Test all screens at multiple resolutions
- [ ] Commit each fix individually

### Priority 3: Source/Create Sprites (1-2 hours)

- [ ] Create folders: `public/sprites/ui/gems/`, `/equipment/`, `/elements/`
- [ ] Create/source gem sprites (48x48px, Fire Emblem style):
  - [ ] mars_gem.png (🔥 replacement)
  - [ ] mercury_gem.png (💧 replacement)
  - [ ] jupiter_gem.png (⚡ replacement)
  - [ ] venus_gem.png (🌍 replacement)
  - [ ] moon_gem.png (🌙 replacement)
  - [ ] sun_gem.png (☀️ replacement)
- [ ] Create/source equipment sprites (32x32px):
  - [ ] sword.png (⚔️ replacement)
  - [ ] shield.png (🛡️ replacement)
  - [ ] ring.png (💍 replacement)
  - [ ] gem.png (💎 replacement)
- [ ] Create/source element sprites (24x24px):
  - [ ] fire.png, water.png, lightning.png, earth.png
- [ ] Test sprite loading in dev mode

### Priority 4: Replace Emojis (1-2 hours)

- [ ] Update `src/data/spriteRegistry.ts` (add UI sprite section)
- [ ] Replace gem emojis:
  - [ ] `src/data/gems.ts` (update type definitions)
  - [ ] `src/screens/GemSelectScreen.tsx` (render sprites instead of emojis)
  - [ ] `src/screens/BattleScreen.tsx` (gem super spell button)
- [ ] Replace equipment emojis:
  - [ ] `src/screens/EquipmentScreen.tsx`
  - [ ] `src/data/items.ts` (add iconPath field)
- [ ] Replace element emojis:
  - [ ] `src/components/UnitCard.tsx`
  - [ ] `src/components/OpponentCard.tsx`
- [ ] Search for remaining emojis: `Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String -Pattern "[\u{1F300}-\u{1F9FF}]"`
- [ ] Add `.pixelated` CSS class to `src/styles/index.css`

### Priority 5: Testing (30-45 min)

- [ ] Run `npm test` (must pass 1004/1004 tests)
- [ ] Full game playthrough:
  - [ ] Menu → Starter Select (no scrolling!)
  - [ ] Gem Select (sprites visible, no emojis)
  - [ ] Battle (gem super spell uses sprite)
  - [ ] Equipment (equipment icons are sprites)
  - [ ] All screens tested
- [ ] Test on all resolutions (1920x1080, 1440x900, 1366x768)
- [ ] No console errors (check for 404s)
- [ ] All sprites loading correctly

### Final Steps:

- [ ] Run TypeScript check: `npm run type-check` (0 errors)
- [ ] Final commit: "Complete sprite overhaul - remove all emojis"
- [ ] Push branch: `git push origin graphics/layout-and-sprite-overhaul-20251026`
- [ ] Report completion to Architect with summary

---

## 🎯 Critical Constraints

### Layout Requirements:
- ✅ **NO SCROLLING** on any screen at 1366x768+
- ✅ All character cards visible on StarterSelectScreen
- ✅ Content must be readable (don't make text too small)
- ✅ Maintain Golden Sun aesthetic

### Sprite Requirements:
- ✅ **ZERO EMOJIS** visible in final product
- ✅ Fire Emblem GBA pixel art style
- ✅ Match existing Golden Sun sprites in color palette
- ✅ Proper image-rendering: pixelated for crisp pixels
- ✅ All sprites must load (no 404 errors)

### Technical Requirements:
- ✅ 1004/1004 tests must still pass
- ✅ 0 TypeScript errors
- ✅ No console warnings
- ✅ Works on Chrome, Firefox, Edge

---

## 💡 Layout Fix Examples

### Example 1: Reduce Card Size
```typescript
// BEFORE (causes overflow):
<div className="grid grid-cols-2 gap-6 pb-32 px-8">
  <div className="bg-blue-900 rounded-lg p-6 h-64">

// AFTER (fits on screen):
<div className="grid grid-cols-2 gap-4 pb-20 px-6">
  <div className="bg-blue-900 rounded-lg p-4 h-48">
```

### Example 2: 3-Column Grid
```typescript
// BEFORE (2 columns, 3 rows → bottom cut off):
<div className="grid grid-cols-2 gap-6">

// AFTER (3 columns, 2 rows → all fit):
<div className="grid grid-cols-3 gap-4">
```

### Example 3: Viewport Height
```typescript
// Use vh units for guaranteed fit:
<div className="grid grid-cols-2 gap-4" style={{ maxHeight: '75vh' }}>
  <div style={{ height: '30vh' }}> {/* Scales with viewport */}
```

---

## 🎨 Sprite Replacement Examples

### Example 1: Gem Icons
```typescript
// BEFORE (src/screens/GemSelectScreen.tsx):
<div className="text-6xl mb-4">{gem.emoji}</div>

// AFTER:
<img 
  src={`/sprites/ui/gems/${gem.id}_gem.png`}
  alt={gem.name}
  className="w-16 h-16 mb-4 pixelated"
/>
```

### Example 2: Equipment Icons
```typescript
// BEFORE (src/screens/EquipmentScreen.tsx):
<span className="text-2xl">⚔️</span>

// AFTER:
<img 
  src="/sprites/ui/equipment/sword.png"
  alt="Weapon"
  className="w-8 h-8 pixelated"
/>
```

### Example 3: Sprite Registry
```typescript
// Add to src/data/spriteRegistry.ts:
export const UI_SPRITES = {
  gems: {
    mars: '/sprites/ui/gems/mars_gem.png',
    mercury: '/sprites/ui/gems/mercury_gem.png',
    jupiter: '/sprites/ui/gems/jupiter_gem.png',
    venus: '/sprites/ui/gems/venus_gem.png',
    moon: '/sprites/ui/gems/moon_gem.png',
    sun: '/sprites/ui/gems/sun_gem.png',
  },
  equipment: {
    sword: '/sprites/ui/equipment/sword.png',
    shield: '/sprites/ui/equipment/shield.png',
    ring: '/sprites/ui/equipment/ring.png',
    gem: '/sprites/ui/equipment/gem.png',
  },
};
```

---

## 📂 Files You'll Modify

### Layout Fixes:
- `src/screens/StarterSelectScreen.tsx` ⭐ CRITICAL
- `src/screens/GemSelectScreen.tsx` (likely needs fix)
- `src/screens/OpponentSelectScreen.tsx` (check)
- `src/screens/EquipmentScreen.tsx` (check)
- `src/screens/InventoryScreen.tsx` (check)
- `src/screens/BattleScreen.tsx` (check)

### Sprite Replacements:
- `src/data/spriteRegistry.ts` (add UI sprites)
- `src/data/gems.ts` (update gem definitions)
- `src/data/items.ts` (add equipment icons)
- `src/screens/GemSelectScreen.tsx` (render gem sprites)
- `src/screens/BattleScreen.tsx` (gem super spell icon)
- `src/screens/EquipmentScreen.tsx` (equipment icons)
- `src/components/UnitCard.tsx` (element indicators)
- `src/components/OpponentCard.tsx` (element indicators)
- `src/styles/index.css` (add .pixelated class)

### New Assets to Create:
- `public/sprites/ui/gems/` (6 PNG files)
- `public/sprites/ui/equipment/` (4+ PNG files)
- `public/sprites/ui/elements/` (4+ PNG files)

---

## 🚫 Common Mistakes to Avoid

### Layout Mistakes:
- ❌ Using `overflow-y: scroll` (user hates scrolling!)
- ❌ Making text too small to read
- ❌ Only testing on 1920x1080 (test 1366x768!)
- ❌ Breaking existing functionality (preserve logic)

### Sprite Mistakes:
- ❌ Using modern smooth images (need pixelated rendering!)
- ❌ Inconsistent sprite styles (all must match)
- ❌ Wrong dimensions (follow requirements: 48px, 32px, 24px)
- ❌ Forgetting alt text (accessibility)
- ❌ Leaving emojis as fallback (user wants ZERO emojis)

### Git Mistakes:
- ❌ Working on main branch (create feature branch!)
- ❌ Committing everything at once (commit incrementally)
- ❌ Not testing before pushing (run tests first!)

---

## ❓ Questions & Answers

**Q: What if I can't fit all content without scrolling?**  
A: Try all 4 options in order:
1. Reduce card size
2. Change grid layout (3 columns)
3. Use viewport units
4. Ask Architect if truly stuck (pagination last resort)

**Q: Where do I get Fire Emblem sprites?**  
A: 
1. Use existing Golden Sun sprites as reference (`public/sprites/golden-sun/`)
2. Public domain sprite rips (spriters-resource.com)
3. Create custom matching Fire Emblem GBA style

**Q: Can I leave some emojis?**  
A: NO. User said "no more emotes unless absolutely impossible". Replace ALL emojis.

**Q: What if sprites don't match style?**  
A: Use Golden Sun sprites in `public/sprites/` as color/style reference. Keep 16-bit pixel art aesthetic.

**Q: How do I test different resolutions?**  
A: Chrome DevTools → Responsive mode → Enter custom dimensions (1366x768, 1440x900, 1920x1080)

---

## ✅ Success Criteria

When you're done:
- ✅ StarterSelectScreen shows all units without scrolling (1366x768+)
- ✅ All other screens fit content without scrolling
- ✅ Zero emojis visible anywhere in game
- ✅ All UI elements use proper Fire Emblem style sprites
- ✅ Sprites load correctly (no 404 errors)
- ✅ 1004/1004 tests passing
- ✅ 0 TypeScript errors
- ✅ Game looks polished and professional

---

## 🎯 Time Breakdown

- **Layout fixes:** 2-3 hours (StarterSelectScreen + other screens)
- **Sprite creation:** 1-2 hours (sourcing/creating assets)
- **Emoji replacement:** 1-2 hours (code changes)
- **Testing:** 30-45 min (all resolutions, full playthrough)
- **Total:** 4.5-7.75 hours

---

## 🚀 Ready to Start!

1. Read full task doc: `docs/ai/tasks/TASK_SPRITE_GRAPHICS_OVERHAUL.md`
2. Create branch: `graphics/layout-and-sprite-overhaul-20251026`
3. Fix StarterSelectScreen layout FIRST (most critical)
4. Work through checklist systematically
5. Test thoroughly before pushing
6. Report completion with summary

**You got this! This will dramatically improve the game's visual quality.** 🎨✨

---

## 📞 Need Help?

- **Stuck on layout?** Try different approaches, ask Architect if truly blocked
- **Unclear on sprite style?** Show draft sprite, ask for feedback
- **TypeScript errors?** Check existing patterns in same file
- **Tests failing?** Run specific test file to see issue

**Remember:** User is frustrated with current state. Your work directly fixes their complaints. High impact! 💪
