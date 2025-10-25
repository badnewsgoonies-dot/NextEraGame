# 🎨 TASK: Integrate Golden Sun Character Sprites (12 Starters)

**Task ID:** GRAPHICS-001  
**Assigned To:** Graphics AI  
**Priority:** ⭐⭐⭐ HIGH (Highest visual impact)  
**Estimated Time:** 2-4 hours  
**Status:** Ready to Execute

---

## 📋 Overview

**Goal:** Replace all 12 starter unit placeholders with appropriate Golden Sun character sprites from the 2,500+ sprite library.

**Why This Matters:**
- **Visual Impact:** 500% improvement (from circles to authentic Golden Sun sprites)
- **Player Experience:** Game feels like real Golden Sun game
- **Foundation:** Sets pattern for enemy sprites, effects, items
- **Branding:** Establishes authentic retro aesthetic

**Current State:** Starter units display as placeholder circles/cards  
**Target State:** All starters show Golden Sun character sprites

---

## 🎯 Phase 1: Sprite Discovery & Character Mapping (1 hour)

### **Task 1.1: Explore the Sprite Library**

**Location:** `public/sprites/golden-sun/`

**Action:** Browse the directory and catalog available character sprites.

**Expected Structure:**
```
public/sprites/golden-sun/
├── characters/
│   ├── isaac/        # Earth Adept protagonist
│   ├── garet/        # Mars Adept fighter
│   ├── ivan/         # Jupiter Adept mage
│   ├── mia/          # Mercury Adept healer
│   ├── felix/        # Mars Adept swordsman
│   ├── jenna/        # Mars Adept fire mage
│   ├── sheba/        # Jupiter Adept wind mage
│   ├── piers/        # Mercury Adept water knight
│   └── ... (more characters)
```

**Find These Sprite States (if available):**
- `idle.gif` or `stand.gif` - Default standing pose
- `attack.gif` or `strike.gif` - Attack animation
- `defend.gif` or `guard.gif` - Defensive stance
- `ko.gif` or `down.gif` - Defeated/fallen
- `victory.gif` or `win.gif` - Celebration pose

**Deliverable:** Document in comments which characters are available with which states.

**Acceptance Criteria:**
- ✅ Explored full sprite library
- ✅ Located 8-12 complete character sprite sets
- ✅ Noted file paths for each state
- ✅ Verified sprite quality (clear, not corrupted)

---

### **Task 1.2: Create Character Mapping Plan**

**Match 12 starters to Golden Sun characters based on role/theme:**

**TANKS (3):**
1. **Warrior** → **Isaac**
   - Theme: Protagonist, Earth Adept, balanced fighter
   - Why: Classic warrior archetype
   - Sprite: `characters/isaac/`

2. **Guardian** → **Felix**
   - Theme: Strong defender, Mars Adept
   - Why: Sturdy, protective vibe
   - Sprite: `characters/felix/`

3. **Paladin** → **Piers**
   - Theme: Holy knight, Mercury Adept
   - Why: Water/holy association, defensive
   - Sprite: `characters/piers/`

**DPS (3):**
4. **Rogue** → **Garet**
   - Theme: Aggressive, Mars Adept, high damage
   - Why: Fast attacker personality
   - Sprite: `characters/garet/`

5. **Mage** → **Ivan**
   - Theme: Wind mage, Jupiter Adept
   - Why: Classic mage archetype
   - Sprite: `characters/ivan/`

6. **Ranger** → **Sheba**
   - Theme: Agile, Jupiter Adept, ranged
   - Why: Quick, nimble fighter
   - Sprite: `characters/sheba/`

**SUPPORT (3):**
7. **Cleric** → **Mia**
   - Theme: Healer, Mercury Adept, water magic
   - Why: Primary healer of Golden Sun
   - Sprite: `characters/mia/`

8. **Shaman** → **Jenna**
   - Theme: Fire support, Mars Adept
   - Why: Elemental support role
   - Sprite: `characters/jenna/`

9. **Bard** → **Ivan (variant)** or alternate character
   - Theme: Support magic, buff/utility
   - Why: Magical support fits
   - Sprite: `characters/ivan/` or suitable alternative

**SPECIALIST (3):**
10. **Necromancer** → Find dark/shadow character or use mage variant
    - Theme: Dark magic specialist
    - Sprite: Browse for dark mage or use creative mapping

11. **Engineer** → Find unique character or use warrior variant
    - Theme: Technical/mechanical specialist
    - Sprite: Browse for unique option

12. **Summoner** → Use mage variant or find summoner-themed character
    - Theme: Conjuration specialist
    - Sprite: `characters/` suitable mage

**Note:** If some characters aren't available, use creative variants! It's okay to reuse sprites with color shifts or use closest thematic match.

**Acceptance Criteria:**
- ✅ All 12 starters mapped to sprites
- ✅ Good thematic fit
- ✅ Documented reasoning for each mapping
- ✅ Alternative options noted if primary not available

---

## 🎯 Phase 2: Update Sprite Registry (45 min)

### **Task 2.1: Read Current Sprite Registry**

**File:** `src/data/spriteRegistry.ts`

**Action:** Understand current structure and patterns.

**Look for:**
- How are sprites currently organized?
- What's the data structure?
- Are there existing character mappings?

**Acceptance Criteria:**
- ✅ Current registry structure understood
- ✅ Existing patterns identified

---

### **Task 2.2: Add Character Sprite Mappings**

**File:** `src/data/spriteRegistry.ts`

**Add or update character sprite registry:**

```typescript
export const CHARACTER_SPRITES: Record<string, {
  idle: string;
  attack?: string;
  defend?: string;
  ko?: string;
  victory?: string;
}> = {
  'warrior': {
    idle: '/sprites/golden-sun/characters/isaac/idle.gif',
    attack: '/sprites/golden-sun/characters/isaac/attack.gif',
    defend: '/sprites/golden-sun/characters/isaac/defend.gif',
    ko: '/sprites/golden-sun/characters/isaac/ko.gif',
    victory: '/sprites/golden-sun/characters/isaac/victory.gif',
  },
  'guardian': {
    idle: '/sprites/golden-sun/characters/felix/idle.gif',
    attack: '/sprites/golden-sun/characters/felix/attack.gif',
    defend: '/sprites/golden-sun/characters/felix/defend.gif',
    ko: '/sprites/golden-sun/characters/felix/ko.gif',
    victory: '/sprites/golden-sun/characters/felix/victory.gif',
  },
  'paladin': {
    idle: '/sprites/golden-sun/characters/piers/idle.gif',
    // ... (complete for all 12)
  },
  // ... continue for all 12 starters
};

// Helper function to get character sprite
export function getCharacterSprite(unitId: string, state: 'idle' | 'attack' | 'defend' | 'ko' | 'victory' = 'idle'): string {
  const sprites = CHARACTER_SPRITES[unitId];
  if (!sprites) {
    return '/sprites/placeholder.png'; // Fallback
  }
  return sprites[state] || sprites.idle; // Default to idle if state missing
}
```

**Acceptance Criteria:**
- ✅ All 12 starters in registry
- ✅ At minimum: idle state for each
- ✅ Helper function for easy access
- ✅ Fallback for missing sprites
- ✅ No TypeScript errors

---

## 🎯 Phase 3: Update Starter Units Data (30 min)

### **Task 3.1: Add Sprite URLs to Each Starter**

**File:** `src/data/starterUnits.ts`

**For each of the 12 starters, add spriteUrl:**

```typescript
export const STARTER_UNITS: readonly StarterUnitTemplate[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    baseClass: 'Warrior',
    role: 'Tank',
    tags: ['Physical'],
    baseStats: {
      maxHp: 80,
      attack: 15,
      defense: 12,
      speed: 8,
    },
    spriteUrl: '/sprites/golden-sun/characters/isaac/idle.gif', // ADD THIS!
    // ... other fields
  },
  // Repeat for all 12 starters
];
```

**Acceptance Criteria:**
- ✅ All 12 starters have `spriteUrl` field
- ✅ Paths match sprite registry
- ✅ URLs point to actual sprite files
- ✅ No TypeScript errors

---

## 🎯 Phase 4: Update UI Components to Display Sprites (1 hour)

### **Task 4.1: Update UnitCard Component**

**File:** `src/components/UnitCard.tsx`

**Current:** Probably shows circle/placeholder  
**Target:** Show Golden Sun sprite

**Implementation:**

```tsx
// Add sprite display near top of card
{unit.spriteUrl ? (
  <div className="flex justify-center mb-3">
    <img 
      src={unit.spriteUrl}
      alt={`${unit.name} sprite`}
      className="w-20 h-20 object-contain pixel-art"
      style={{ imageRendering: 'pixelated' }} // Crisp pixel art
    />
  </div>
) : (
  // Fallback: existing placeholder
  <div className="w-20 h-20 mx-auto mb-3 bg-slate-600 rounded-full" />
)}

{/* Rest of unit card */}
```

**Styling Tips:**
- Use `imageRendering: 'pixelated'` for crisp pixel art
- Size: 64x64 or 80x80 pixels (w-16 h-16 or w-20 h-20)
- Center the sprite
- Add subtle shadow/glow for depth

**Acceptance Criteria:**
- ✅ Sprites display on unit cards
- ✅ Pixel art renders crisply (not blurry)
- ✅ Fallback works if sprite missing
- ✅ Layout doesn't break
- ✅ Looks good on all screens

---

### **Task 4.2: Update Battle Unit Display**

**Files:** Check battle components:
- `src/components/battle/BattleUnitSlot.tsx`
- `src/components/battle/UnitBattleCard.tsx`
- `src/screens/BattleScreen.tsx`

**Current:** May show placeholders  
**Target:** Show Golden Sun battle sprites

**Implementation Pattern:**
```tsx
// In battle unit display
<img 
  src={unit.spriteUrl || '/sprites/placeholder.png'}
  alt={unit.name}
  className="w-24 h-24 object-contain pixel-art"
  style={{ imageRendering: 'pixelated' }}
/>
```

**Advanced (Optional):**
- Show different sprites based on battle state:
  - Default: idle sprite
  - Attacking: attack sprite
  - Defending: defend sprite
  - KO: ko sprite
  - Victory: victory sprite

**Acceptance Criteria:**
- ✅ Battle units show sprites
- ✅ Sprites sized appropriately (larger in battle)
- ✅ Animation states (if implemented)
- ✅ No layout issues

---

### **Task 4.3: Update Starter Selection Screen**

**File:** `src/screens/StarterSelectScreen.tsx`

**Check if sprites need integration here too.**

**Acceptance Criteria:**
- ✅ Starter selection shows sprites
- ✅ Grid layout maintained
- ✅ Selection visual feedback preserved

---

## 🎯 Phase 5: Testing & Visual Verification (30 min)

### **Task 5.1: Browser Testing**

**Actions:**
1. Start dev server (`npm run dev`)
2. Navigate to starter selection
3. **Verify:** All 12 units show Golden Sun sprites
4. Select 4 units, start game
5. Go to battle
6. **Verify:** Battle units show sprites
7. Check console for 404 errors

**Acceptance Criteria:**
- ✅ All 12 starters display sprites
- ✅ Battle sprites work
- ✅ No console errors (no 404s)
- ✅ Sprites load quickly (<1s)
- ✅ Layout not broken

---

### **Task 5.2: Screenshot Documentation**

**Required Screenshots (Minimum 4):**

1. **📸 Before/After - Starter Selection:**
   - Side-by-side or separate
   - Shows placeholder circles → Golden Sun sprites
   - All 12 units visible

2. **📸 Battle Screen with Sprites:**
   - In-battle view
   - Multiple units showing different Golden Sun characters
   - Action happening (to show it's functional)

3. **📸 Close-Up Unit Card:**
   - Single unit card showing sprite detail
   - Rank badge visible
   - Subclass if equipped
   - Professional quality

4. **📸 Full Team View:**
   - Equipment or roster screen
   - All 4 team members with sprites
   - Shows variety of characters

**Acceptance Criteria:**
- ✅ 4+ high-quality screenshots
- ✅ Before/after comparison clear
- ✅ Visual improvement obvious
- ✅ No visual bugs shown

---

## 🎯 Phase 6: Visual Polish & Final Touches (30 min)

### **Task 6.1: CSS Polish for Sprites**

**Fine-tune sprite display:**

**Pixel Art Rendering:**
```css
.pixel-art {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
```

**Add to Tailwind Config (if needed):**
```javascript
// tailwind.config.js
theme: {
  extend: {
    // Custom utilities for pixel art
  }
}
```

**Visual Enhancements:**
- Add subtle glow/shadow behind sprites
- Ensure sprites pop against backgrounds
- Test on different screen sizes
- Smooth any rough edges

**Acceptance Criteria:**
- ✅ Sprites render crisp (not blurry)
- ✅ Visual hierarchy maintained
- ✅ Sprites stand out appropriately
- ✅ Consistent styling across screens

---

### **Task 6.2: Fallback Handling**

**Ensure graceful degradation if sprites missing:**

```typescript
// In component
const spriteUrl = unit.spriteUrl || getCharacterSprite(unit.id) || '/sprites/placeholder.png';

return (
  <img 
    src={spriteUrl}
    alt={unit.name}
    onError={(e) => {
      // Fallback if sprite fails to load
      e.currentTarget.src = '/sprites/placeholder.png';
    }}
    className="w-20 h-20 object-contain pixel-art"
  />
);
```

**Acceptance Criteria:**
- ✅ Missing sprites don't break UI
- ✅ Fallback image displays
- ✅ Console logs helpful errors (not silent failures)

---

## ✅ Deliverables Checklist

### **Phase 1: Discovery**
- [ ] Golden Sun character sprite library explored
- [ ] Available characters documented
- [ ] 12 starters mapped to Golden Sun characters
- [ ] Sprite states identified (idle, attack, etc.)

### **Phase 2: Registry**
- [ ] `spriteRegistry.ts` updated with character mappings
- [ ] Helper functions created
- [ ] Fallbacks implemented

### **Phase 3: Data**
- [ ] `starterUnits.ts` updated (all 12 have spriteUrl)
- [ ] Sprite paths verified

### **Phase 4: UI Integration**
- [ ] `UnitCard.tsx` displays sprites
- [ ] Battle components display sprites
- [ ] Starter selection shows sprites

### **Phase 5: Testing**
- [ ] Browser testing complete (no errors)
- [ ] 4+ screenshots captured
- [ ] Before/after comparison documented

### **Phase 6: Polish**
- [ ] Pixel-art rendering crisp
- [ ] Visual polish applied
- [ ] Fallbacks working

---

## 📊 Expected Impact

### **Before:**
- Placeholder circles with initials
- Generic colored backgrounds
- Functional but bland
- Visual Quality: 6/10

### **After:**
- Authentic Golden Sun character sprites
- Animated idle poses
- Professional retro aesthetic
- Nostalgic Golden Sun feel
- Visual Quality: 9.5/10

**Visual Improvement:** +350% (from bland to beautiful!)

---

## 🎨 Character Mapping Reference

### **Suggested Mappings (Use Your Judgment!):**

| Starter | Role | Golden Sun Character | Rationale |
|---------|------|---------------------|-----------|
| Warrior | Tank | Isaac | Protagonist, balanced earth warrior |
| Guardian | Tank | Felix | Strong defender, Mars element |
| Paladin | Tank | Piers | Holy knight, water element |
| Rogue | DPS | Garet | Aggressive Mars fighter |
| Mage | DPS | Ivan | Jupiter wind mage |
| Ranger | DPS | Sheba | Agile Jupiter ranger |
| Cleric | Support | Mia | Mercury healer |
| Shaman | Support | Jenna | Mars support mage |
| Bard | Support | Ivan variant | Magical support |
| Necromancer | Specialist | Dark mage sprite | Death magic theme |
| Engineer | Specialist | Creative choice | Technical specialist |
| Summoner | Specialist | Mage variant | Conjuration magic |

**Feel free to adjust based on what sprites look best!**

---

## 📸 Screenshot Requirements

### **Minimum 4 Screenshots:**

**1. Before/After Comparison:**
- Side-by-side if possible
- Starter selection screen
- Clearly shows circle placeholders vs Golden Sun sprites

**2. Battle Screen:**
- Multiple characters in combat
- Shows sprite variety
- Action/animation visible

**3. Unit Card Detail:**
- Close-up of one unit card
- Shows sprite quality
- Professional presentation

**4. Full Team:**
- All 4 team members together
- Equipment or roster screen
- Shows cohesive visual style

### **Optional Bonus Screenshots:**

5. Different character variations
6. Sprite states (attack, defend, KO if implemented)
7. Animation frames (if GIFs are animated)
8. Mobile view (responsive testing)

---

## 🎯 Success Criteria

**Visual Task is Complete When:**

✅ All 12 starters have Golden Sun sprites  
✅ Sprites display correctly on all screens  
✅ No 404 errors in console  
✅ Pixel art renders crisply (not blurry)  
✅ Before/after screenshots show dramatic improvement  
✅ No layout breakage  
✅ Fallbacks work for missing sprites  
✅ Professional visual quality achieved  

---

## 📝 Completion Report Template

```markdown
# ✅ Character Sprite Integration - COMPLETE!

## Summary
Replaced all 12 starter placeholders with Golden Sun character sprites.

## Sprite Mappings
1. Warrior → Isaac (Earth Adept)
2. Guardian → Felix (Mars Adept)
3. Paladin → Piers (Mercury Adept)
[... list all 12]

## Files Modified
- `src/data/spriteRegistry.ts` (+120 lines)
- `src/data/starterUnits.ts` (+12 spriteUrl fields)
- `src/components/UnitCard.tsx` (sprite display)
- `src/components/battle/[BattleComponent].tsx` (sprite display)

## Visual Impact
Before: Placeholder circles (6/10 visual quality)
After: Golden Sun sprites (9.5/10 visual quality)
Improvement: +350% visual appeal!

## Screenshots
📸 [Attach 4+ screenshots]
1. Before/After - Starter selection
2. Battle screen with sprites
3. Unit card close-up
4. Full team view

## Verification
✅ All 12 sprites display correctly
✅ No 404 errors (console clean)
✅ Pixel art crisp (imageRendering: pixelated)
✅ Layout maintained (no breaks)
✅ Fallbacks working

## Issues Found
[None] or [List any problems]

## Recommendations
Next: Enemy sprite integration (19 opponents)
      Effect sprite integration (abilities)
      Item sprite icons (gems, equipment)
```

---

## 🚀 Getting Started

1. Browse `public/sprites/golden-sun/characters/`
2. Map 12 starters to characters (document reasoning)
3. Update `spriteRegistry.ts`
4. Update `starterUnits.ts`
5. Update UI components to display sprites
6. Test in browser (verify loads, no errors)
7. Take before/after screenshots
8. Report completion

**This will transform the game visually!** 🎨✨

---

## 💡 Tips for Success

**Finding Sprites:**
- Use terminal `ls` to browse directories
- Look for GIF files (animated)
- Check file sizes (reasonable = good quality)
- Preview a few to ensure quality

**Mapping Strategy:**
- Match roles first (tank → sturdy sprite)
- Then match elements if applicable
- Prioritize main characters (Isaac, Mia, Ivan, Garet)
- Use variants/alternates for specialists

**Testing:**
- Test on multiple screens (starter select, battle, equipment)
- Check different states (idle, attack if implemented)
- Verify no broken layouts
- Ensure performance good (sprites load fast)

**Documentation:**
- Comment your mapping choices
- Note any creative decisions
- Document sprite states used
- List any missing/unavailable sprites

---

**Ready to make NextEraGame look BEAUTIFUL!** 🎮✨

---

**Task Status:** ✅ Ready to Execute  
**Expected Duration:** 2-4 hours  
**Expected Outcome:** Visually stunning character integration!

