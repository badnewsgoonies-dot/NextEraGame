# Task: Sprite Graphics Overhaul & Layout Fixes

**Assigned To:** Graphics AI  
**Priority:** CRITICAL - Visual quality & UX blocking  
**Estimated Complexity:** High (4-6 hours)  
**Created:** 2025-10-26

## Problem Statement

The game has two critical visual issues:

1. **Layout Overflow:** Character selection screen (and potentially others) has content cut off at the bottom, requiring scrolling. User requirement: **"I DONT WANT TO SCROLL AT ANY POINT EVER"**

2. **Emoji Overuse:** Many UI elements use emojis (🔥💧⚡🌍🌙☀️⚔️🛡️💍💎) instead of proper Fire Emblem-style sprites. User requirement: **"ALSO no more emotes unless absolutely impossible everything should be a fire emblem sprite"**

## Requirements

### Part 1: Layout Fixes (NO SCROLLING ALLOWED)

#### Critical: StarterSelectScreen Layout

**Current Issue:** (See screenshot)
- 6 character cards arranged in 2x3 grid
- Bottom row is cut off
- User must scroll to see all options

**Required Solutions (pick best approach):**

1. **Option A: Reduce Card Size**
   - Scale down card height/width proportionally
   - Maintain readability of stats/text
   - Ensure all 6+ cards fit in viewport

2. **Option B: Adjust Grid Layout**
   - Change from 2 columns to 3 columns (3x2 grid)
   - Reduce vertical spacing/padding
   - Use viewport units (vh) for sizing

3. **Option C: Pagination**
   - Show 4 cards at a time
   - Add "Next/Previous" buttons
   - Less ideal but acceptable if needed

4. **Option D: Scrollable Container (LAST RESORT)**
   - Only if absolutely impossible to fit content
   - Must have clear visual indicators for more content
   - Prefer any other solution first

**File:** `src/screens/StarterSelectScreen.tsx`

**Acceptance Criteria:**
- ✅ All starter units visible without scrolling
- ✅ Cards are large enough to read stats/names
- ✅ Works on 1920x1080 and 1366x768 resolutions
- ✅ Maintains Golden Sun aesthetic

#### Other Screens to Audit

Check EVERY screen for overflow:
- [ ] `src/screens/OpponentSelectScreen.tsx` - Opponent cards fit?
- [ ] `src/screens/GemSelectScreen.tsx` - 6 gem cards fit?
- [ ] `src/screens/EquipmentScreen.tsx` - Equipment list fit?
- [ ] `src/screens/InventoryScreen.tsx` - Item list fit?
- [ ] `src/screens/BattleScreen.tsx` - All UI elements visible?
- [ ] `src/screens/RecruitmentScreen.tsx` - Recruitment cards fit?
- [ ] `src/screens/MapScreen.tsx` - Map + UI fit?

For each screen with overflow:
1. Document the issue (screenshot if possible)
2. Implement fix using similar strategies as StarterSelectScreen
3. Test on multiple resolutions

### Part 2: Replace Emojis with Sprites

#### Phase 1: Emoji Audit

Search codebase for emoji usage:
```bash
# PowerShell command to find emojis:
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String -Pattern "[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]" -AllMatches
```

**Known Emoji Locations:**

1. **Gem System:**
   - 🔥 Mars (Fire)
   - 💧 Mercury (Water)
   - ⚡ Jupiter (Lightning)
   - 🌍 Venus (Earth)
   - 🌙 Moon
   - ☀️ Sun
   - Files: `src/data/gems.ts`, `src/screens/GemSelectScreen.tsx`, `src/screens/BattleScreen.tsx`

2. **Equipment System:**
   - ⚔️ Weapon
   - 🛡️ Shield
   - 💍 Ring
   - 💎 Gem
   - Files: `src/screens/EquipmentScreen.tsx`, `src/data/items.ts`

3. **Element Indicators:**
   - 🔥💧⚡🌍 in various status displays
   - Files: `src/components/UnitCard.tsx`, `src/components/OpponentCard.tsx`

4. **UI Decorations:**
   - Various emojis in buttons, labels, tooltips
   - Files: Multiple components

#### Phase 2: Sprite Asset Creation/Sourcing

**Required Sprites (Fire Emblem Style):**

1. **Gem Icons (48x48px)**
   - mars_gem.png (red/fire theme)
   - mercury_gem.png (blue/water theme)
   - jupiter_gem.png (yellow/lightning theme)
   - venus_gem.png (green/earth theme)
   - moon_gem.png (silver/moon theme)
   - sun_gem.png (gold/sun theme)

2. **Equipment Icons (32x32px)**
   - weapon_sword.png
   - weapon_axe.png
   - weapon_lance.png
   - shield_small.png
   - shield_large.png
   - ring_power.png
   - ring_defense.png
   - accessory_gem.png

3. **Element Icons (24x24px)**
   - element_fire.png
   - element_water.png
   - element_lightning.png
   - element_earth.png
   - element_light.png
   - element_dark.png

4. **UI Elements (various sizes)**
   - button_confirm.png
   - button_cancel.png
   - cursor_select.png
   - indicator_selected.png

**Sourcing Options:**
1. Use existing Fire Emblem sprite rips (check public domain)
2. Create custom sprites matching Fire Emblem style
3. Use Golden Sun sprite style (already in project)
4. Commission artist (if budget available)

**Storage Location:** `public/sprites/ui/`

#### Phase 3: Sprite Registry Update

Update `src/data/spriteRegistry.ts`:

```typescript
export const UI_SPRITES = {
  // Gem icons
  gems: {
    mars: '/sprites/ui/gems/mars_gem.png',
    mercury: '/sprites/ui/gems/mercury_gem.png',
    jupiter: '/sprites/ui/gems/jupiter_gem.png',
    venus: '/sprites/ui/gems/venus_gem.png',
    moon: '/sprites/ui/gems/moon_gem.png',
    sun: '/sprites/ui/gems/sun_gem.png',
  },
  
  // Equipment icons
  equipment: {
    sword: '/sprites/ui/equipment/weapon_sword.png',
    axe: '/sprites/ui/equipment/weapon_axe.png',
    lance: '/sprites/ui/equipment/weapon_lance.png',
    shield: '/sprites/ui/equipment/shield.png',
    ring: '/sprites/ui/equipment/ring.png',
    accessory: '/sprites/ui/equipment/accessory.png',
  },
  
  // Element indicators
  elements: {
    fire: '/sprites/ui/elements/fire.png',
    water: '/sprites/ui/elements/water.png',
    lightning: '/sprites/ui/elements/lightning.png',
    earth: '/sprites/ui/elements/earth.png',
    light: '/sprites/ui/elements/light.png',
    dark: '/sprites/ui/elements/dark.png',
  }
};
```

#### Phase 4: Component Updates

**Example: Replace Gem Emojis**

```typescript
// BEFORE (src/screens/GemSelectScreen.tsx):
<div className="text-6xl">{gem.emoji}</div>

// AFTER:
<img 
  src={UI_SPRITES.gems[gem.id]} 
  alt={gem.name}
  className="w-16 h-16"
/>
```

**Example: Replace Equipment Emojis**

```typescript
// BEFORE (src/screens/EquipmentScreen.tsx):
<span>⚔️ Weapon</span>

// AFTER:
<div className="flex items-center gap-2">
  <img 
    src={UI_SPRITES.equipment.sword} 
    alt="Weapon"
    className="w-6 h-6"
  />
  <span>Weapon</span>
</div>
```

**Files to Update:**
- `src/screens/GemSelectScreen.tsx`
- `src/screens/BattleScreen.tsx`
- `src/screens/EquipmentScreen.tsx`
- `src/data/gems.ts` (update type definitions)
- `src/data/items.ts` (update item definitions)
- `src/components/UnitCard.tsx`
- `src/components/OpponentCard.tsx`
- Any other components using emojis

## Implementation Steps

### Step 1: Layout Fixes (2-3 hours)

1. **StarterSelectScreen Priority:**
   - Open `src/screens/StarterSelectScreen.tsx`
   - Test current layout on 1366x768 resolution (common laptop size)
   - Document exact overflow amount (px)
   - Try Option A (reduce card size) first
   - If fails, try Option B (3-column grid)
   - Test on multiple resolutions
   - Commit: "Fix StarterSelectScreen layout - remove scrolling"

2. **Other Screens Audit:**
   - Run game on 1366x768 resolution
   - Navigate to every screen
   - Screenshot any overflow
   - Fix each screen using similar techniques
   - Commit: "Fix [ScreenName] layout - remove scrolling"

### Step 2: Sprite Asset Preparation (1-2 hours)

1. **Create/Source Sprites:**
   - Follow Fire Emblem GBA style guide
   - Maintain consistent pixel art aesthetic
   - Use Golden Sun color palettes (already in game)
   - Store in `public/sprites/ui/` directory

2. **Update Sprite Registry:**
   - Add all UI sprites to `spriteRegistry.ts`
   - Use proper TypeScript types
   - Test sprite loading in dev mode

### Step 3: Replace Emojis (1-2 hours)

1. **Gem System:**
   - Update `src/data/gems.ts` (remove emoji, add spriteId)
   - Update `GemSelectScreen.tsx` (render sprites)
   - Update `BattleScreen.tsx` (gem super spell UI)
   - Test gem selection and battle usage

2. **Equipment System:**
   - Update `src/data/items.ts` (add sprite paths)
   - Update `EquipmentScreen.tsx` (render sprites)
   - Test equipment equip/unequip

3. **Element Indicators:**
   - Update `UnitCard.tsx` (element display)
   - Update `OpponentCard.tsx` (element display)
   - Test in battle and selection screens

4. **Remaining Emojis:**
   - Search for any remaining emoji usage
   - Replace with sprites or text as appropriate
   - Only keep emojis if truly no alternative

### Step 4: Testing & Polish (30-45 min)

1. **Visual Testing:**
   - Every screen loads without errors
   - All sprites render correctly
   - No emoji fallbacks visible
   - Layouts work on 1920x1080, 1440x900, 1366x768

2. **Automated Testing:**
   - Run `npm test` - ensure 1004/1004 passing
   - Fix any broken tests (sprite path issues, etc.)

3. **Manual Playthrough:**
   - Start new game
   - Select starters (no scrolling)
   - Select gem (see sprites)
   - Battle opponent (see element sprites)
   - Check equipment (see equipment sprites)
   - Verify all screens have no scrolling

## Acceptance Criteria

### Layout Requirements
- ✅ StarterSelectScreen shows all units without scrolling
- ✅ All other screens fit content in viewport
- ✅ Works on 1920x1080, 1440x900, 1366x768 resolutions
- ✅ No horizontal or vertical scrollbars on any screen
- ✅ Text/stats remain readable after size adjustments

### Sprite Requirements
- ✅ All gem emojis replaced with sprites
- ✅ All equipment emojis replaced with sprites
- ✅ All element emojis replaced with sprites
- ✅ Sprites follow Fire Emblem pixel art style
- ✅ Sprites match Golden Sun color palette
- ✅ No emojis visible in production build
- ✅ Sprite loading works (no 404 errors)

### Technical Requirements
- ✅ All TypeScript types updated (no 'any' added)
- ✅ Sprite registry properly organized
- ✅ All tests passing (1004/1004 maintained)
- ✅ No console errors or warnings
- ✅ Git history clean (meaningful commits)

## Files Requiring Modification

### Layout Fixes:
- `src/screens/StarterSelectScreen.tsx` (CRITICAL)
- `src/screens/OpponentSelectScreen.tsx` (audit needed)
- `src/screens/GemSelectScreen.tsx` (audit needed)
- `src/screens/EquipmentScreen.tsx` (audit needed)
- `src/screens/InventoryScreen.tsx` (audit needed)
- `src/screens/RecruitmentScreen.tsx` (audit needed)
- `src/screens/BattleScreen.tsx` (audit needed)

### Sprite Replacements:
- `src/data/gems.ts` (gem definitions)
- `src/data/items.ts` (equipment definitions)
- `src/data/spriteRegistry.ts` (add UI sprites)
- `src/screens/GemSelectScreen.tsx` (render gem sprites)
- `src/screens/BattleScreen.tsx` (gem super spell UI)
- `src/screens/EquipmentScreen.tsx` (equipment icons)
- `src/components/UnitCard.tsx` (element indicators)
- `src/components/OpponentCard.tsx` (element indicators)

### New Files to Create:
- `public/sprites/ui/gems/` (6 gem sprites)
- `public/sprites/ui/equipment/` (6+ equipment sprites)
- `public/sprites/ui/elements/` (6 element sprites)

## Success Metrics

1. **Zero Scrolling:** User can navigate entire game without ever scrolling
2. **Zero Emojis:** No emoji characters visible in any screen (except extreme edge cases)
3. **Fire Emblem Aesthetic:** All sprites match Fire Emblem GBA pixel art style
4. **No Regressions:** All 1004 tests still passing

## Notes for Graphics AI

- **Prioritize layout fixes** - these block user experience immediately
- **Source sprites carefully** - Fire Emblem has distinctive pixel art style
- **Maintain consistency** - all sprites should feel cohesive
- **Test on low resolutions** - 1366x768 is common laptop size
- **Ask for feedback** - if sprite style is unclear, ask Architect to clarify
- **Document sprite sources** - credit artists/sources in commit messages
- **Use existing Golden Sun sprites as reference** - already in `public/sprites/golden-sun/`

## Reference Images

- **StarterSelectScreen overflow:** (See user-provided screenshot - bottom row cut off)
- **Fire Emblem GBA sprites:** Reference existing sprites in `public/sprites/` folder
- **Golden Sun UI style:** Current game aesthetic to match

## Branch Naming

- Layout fixes: `graphics/remove-all-scrolling-[DATE]`
- Sprite replacements: `graphics/replace-emojis-with-sprites-[DATE]`

Or combined: `graphics/layout-and-sprite-overhaul-[DATE]`
