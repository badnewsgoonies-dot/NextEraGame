# 🎨 Sprite Library Inventory - NextEraGame

**Complete catalog of available visual assets for Graphics AI**

---

## ðŸ"Š Quick Stats

- **Total Sprites:** 2,500+ animated GIF files
- **Base Directory:** `public/sprites/`
- **Primary Collection:** Golden Sun sprite library
- **Organization:** Category-based folder structure
- **Format:** Animated GIF (pixel art style)
- **Status:** Ready for integration

---

## ðŸ—‚ï¸ Directory Structure

```
public/sprites/
├── party/                  # Core party character sprites (4 files)
├── enemies/                # Basic enemy sprites (3 files)
├── backgrounds/            # Battle backgrounds (1 file)
├── psynergy/              # Ability effects (directory)
└── golden-sun/            # Main Golden Sun asset library (2,500+ sprites)
    ├── battle/            # Battle-specific sprites
    │   ├── party/        # Player character battle sprites
    │   ├── enemies/      # Enemy battle sprites
    │   ├── bosses/       # Boss battle sprites
    │   ├── antagonists/  # Story antagonist sprites
    │   ├── djinn/        # Djinn creatures
    │   └── summons/      # Summon sequences
    ├── overworld/         # Overworld/map sprites
    ├── backgrounds/       # Background images
    ├── icons/             # UI icons and small graphics
    ├── scenery/           # Environmental objects
    └── text/              # Text effects and dialogue boxes
```

---

## ðŸŽ­ PARTY CHARACTER SPRITES

### **Core Party Directory** (`public/sprites/party/`)

**Available Characters:**
```
✅ garet_idle.gif     - Mars Adept (fire warrior)
✅ isaac_idle.gif     - Venus Adept (earth warrior) 
✅ ivan_idle.gif      - Jupiter Adept (wind mage)
✅ mia_idle.gif       - Mercury Adept (water healer)
```

**Current Usage:**
- These are basic idle sprites currently integrated
- **Note:** More comprehensive sprites available in `golden-sun/battle/party/`

### **Golden Sun Party Directory** (`public/sprites/golden-sun/battle/party/`)

**Available Characters (with full battle states):**

#### **Venus (Earth) Adepts:**
- **isaac/** - Earth Adept protagonist
  - States: idle, attack, defend, cast, KO, victory
  - Best for: Warrior, Guardian, Paladin classes
  - Theme: Heroic, strong, reliable

- **felix/** - Mars Adept protagonist (GS2)
  - States: idle, attack, defend, cast, KO, victory
  - Best for: Warrior, Rogue, Fighter classes
  - Theme: Serious, determined, versatile

#### **Mars (Fire) Adepts:**
- **garet/** - Mars Adept fighter
  - States: idle, attack, defend, cast, KO, victory
  - Best for: Berserker, Fighter, Warrior classes
  - Theme: Energetic, powerful, fiery

- **jenna/** - Mars Adept mage
- **jenna_gs2/** - Jenna (Golden Sun 2 variant)
  - States: idle, attack, defend, cast, KO, victory
  - Best for: Mage, Summoner, Fire specialist classes
  - Theme: Magical, graceful, fire mage

#### **Jupiter (Wind) Adepts:**
- **ivan/** - Jupiter Adept mage
  - States: idle, attack, defend, cast, KO, victory
  - Best for: Mage, Necromancer, Wind specialist classes
  - Theme: Intelligent, mystical, support

- **sheba/** - Jupiter Adept mage
  - States: idle, attack, defend, cast, KO, victory
  - Best for: Summoner, Mage, Wind specialist classes
  - Theme: Powerful, young, magical prodigy

#### **Mercury (Water) Adepts:**
- **mia/** - Mercury Adept healer
  - States: idle, attack, defend, cast, KO, victory
  - Best for: Cleric, Shaman, Healer classes
  - Theme: Gentle, healing, water mage

- **piers/** - Mercury Adept fighter
  - States: idle, attack, defend, cast, KO, victory
  - Best for: Paladin, Ranger, Water warrior classes
  - Theme: Mature, balanced, water fighter

#### **Additional Characters:**
- **Young_Garet2.gif** - Young version sprite
- **Young_Isaac2.gif** - Young version sprite
  - Use for: Starter versions, flashback sequences

---

## ðŸ'¹ ENEMY SPRITES

### **Basic Enemy Directory** (`public/sprites/enemies/`)

**Currently Available:**
```
✅ bat.gif       - Flying beast enemy
✅ goblin.gif    - Humanoid enemy
✅ slime.gif     - Blob creature
```

**Usage Notes:**
- Basic enemies for testing
- More comprehensive enemies in `golden-sun/battle/enemies/`

### **Golden Sun Enemy Directory** (`public/sprites/golden-sun/battle/enemies/`)

**Enemy Categories:**

#### **Beasts:**
- Wolves, bears, tigers
- Use for: Beast tag enemies
- Theme: Natural, animal-like

#### **Undead:**
- Skeletons, zombies, ghosts
- Use for: Undead tag enemies  
- Theme: Dark, supernatural

#### **Elementals:**
- Fire, water, earth, air creatures
- Use for: Elemental specialist enemies
- Theme: Pure elemental essence

#### **Monsters:**
- Various fantasy creatures
- Use for: Generic enemy types
- Theme: Varied, diverse

### **Boss Directory** (`public/sprites/golden-sun/battle/bosses/`)

**Boss Sprites:**
- Large, intimidating sprites
- Multi-phase animations
- Use for: Elite enemies, dungeon bosses
- Theme: Epic, challenging encounters

### **Antagonist Directory** (`public/sprites/golden-sun/battle/antagonists/`)

**Story Antagonists:**
- Named villains from Golden Sun
- Unique, memorable designs
- Use for: Special opponent encounters
- Theme: Story-driven battles

---

## ✨ ABILITY EFFECTS & PSYNERGY

### **Psynergy Directory** (`public/sprites/psynergy/`)

**Currently Available Effects:**
```
✅ Various elemental effects (explore directory for full list)
```

### **Golden Sun Effects** (`public/sprites/golden-sun/effects/`)

**Effect Categories:**

#### **Attack Psynergy:**
- Fire effects (Fireball, Volcano, etc.)
- Water effects (Ice, Tidal Wave, etc.)
- Earth effects (Quake, Spire, etc.)
- Wind effects (Gale, Tornado, etc.)

#### **Support Psynergy:**
- Healing effects (Cure, Wish, etc.)
- Buff effects (various enhancement visuals)
- Status effects (poison, sleep, stun animations)

#### **Summon Effects:**
- Venus summons (earth-themed)
- Mars summons (fire-themed)
- Jupiter summons (wind-themed)
- Mercury summons (water-themed)
- **Note:** Full summon sequences available

---

## ðŸŽ¨ UI ELEMENTS

### **Icons Directory** (`public/sprites/golden-sun/icons/`)

**Available Icons:**
- Item icons (weapons, armor, accessories)
- Status icons (buffs, debuffs, conditions)
- Element icons (fire, water, earth, air)
- Menu icons (various UI elements)

**Usage:**
- Equipment screen item display
- Status effect indicators
- Element type badges

### **Text Directory** (`public/sprites/golden-sun/text/`)

**Text Elements:**
- Dialogue boxes
- Menu borders
- Text effects
- Number sprites

**Usage:**
- Dialogue systems
- Menu styling
- Damage/healing numbers

---

## ðŸŒ„ BACKGROUNDS

### **Basic Backgrounds** (`public/sprites/backgrounds/`)

**Currently Available:**
```
✅ cave.gif - Cave battle background
```

### **Golden Sun Backgrounds** (`public/sprites/golden-sun/backgrounds/`)

**Background Types:**
- Forest scenes
- Cave/dungeon environments
- Town/city backdrops
- Special location backgrounds

**Usage:**
- Battle screen backgrounds
- Menu screen backgrounds
- Scene setting

---

## 🎮 OVERWORLD SPRITES

### **Overworld Directory** (`public/sprites/golden-sun/overworld/`)

**Sprite Types:**
- Character walk cycles
- Character run animations
- Character jump/climb animations
- Character idle animations

**Usage Notes:**
- Currently not used (turn-based game, no overworld)
- Available for future features
- Reference for character movement

---

## ðŸ—º SCENERY & OBJECTS

### **Scenery Directory** (`public/sprites/golden-sun/scenery/`)

**Environmental Objects:**
- Trees, rocks, plants
- Buildings, structures
- Interactive objects
- Decorative elements

**Usage:**
- Environmental decoration
- Background details
- Scene enhancement

---

## 📋 SPRITE NAMING CONVENTIONS

### **Character Sprites:**
```
Format: {character}_{state}.gif
Examples:
- isaac_idle.gif
- garet_attack.gif
- mia_cast.gif
- ivan_ko.gif
```

### **Enemy Sprites:**
```
Format: {enemy_type}.gif
Examples:
- bat.gif
- goblin.gif
- skeleton.gif
```

### **Effect Sprites:**
```
Format: {effect_name}.gif or {effect_type}_{variant}.gif
Examples:
- fireball.gif
- cure_animation.gif
- buff_sparkle.gif
```

---

## 🎯 SPRITE INTEGRATION GUIDE

### **Step 1: Locate Sprite**

**Finding Character Sprites:**
1. Identify unit role/class
2. Browse `golden-sun/battle/party/`
3. Select matching character folder
4. Note available states

**Finding Enemy Sprites:**
1. Check enemy tags (Beast, Undead, etc.)
2. Browse `golden-sun/battle/enemies/` or `bosses/`
3. Select sprite matching theme
4. Verify sprite size appropriate

**Finding Effect Sprites:**
1. Check ability element/type
2. Browse `psynergy/` or `golden-sun/effects/`
3. Find matching effect animation
4. Test animation timing

### **Step 2: Update Sprite Registry**

**Location:** `src/data/spriteRegistry.ts`

**Add New Mapping:**
```typescript
export const CHARACTER_SPRITES = {
  'warrior': {
    idle: '/sprites/golden-sun/battle/party/isaac/idle.gif',
    attack: '/sprites/golden-sun/battle/party/isaac/attack.gif',
    defend: '/sprites/golden-sun/battle/party/isaac/defend.gif',
    ko: '/sprites/golden-sun/battle/party/isaac/ko.gif',
    victory: '/sprites/golden-sun/battle/party/isaac/victory.gif',
  },
  // Add more mappings here
};
```

### **Step 3: Test Integration**

**Verify:**
- [ ] Sprite loads without 404 error (check browser console)
- [ ] Sprite displays at correct size
- [ ] Animation plays smoothly
- [ ] Sprite matches intended character/enemy
- [ ] All states (idle, attack, etc.) work correctly

### **Step 4: Document Mapping**

**Add to this file:**
- Unit name → Sprite path mapping
- Reasoning for sprite choice
- Any special notes

---

## 🎨 SPRITE RECOMMENDATIONS BY CLASS

### **Warrior/Fighter Classes:**
```
Best Matches:
- Isaac (Venus, heroic warrior)
- Felix (Mars, serious fighter)  
- Garet (Mars, energetic fighter)
- Piers (Mercury, mature warrior)

Characteristics: Armored, strong, physical combat
```

### **Mage/Caster Classes:**
```
Best Matches:
- Ivan (Jupiter, intelligent mage)
- Jenna (Mars, fire mage)
- Sheba (Jupiter, magical prodigy)
- Mia (Mercury, water mage)

Characteristics: Robed, magical, casting animations
```

### **Support/Healer Classes:**
```
Best Matches:
- Mia (Mercury, primary healer)
- Sheba (Jupiter, support caster)
- Ivan (Jupiter, support abilities)

Characteristics: Gentle, healing poses, supportive
```

### **Hybrid/Specialist Classes:**
```
Best Matches:
- Felix (versatile, multi-role)
- Piers (balanced fighter/mage)
- Garet (offense-focused hybrid)

Characteristics: Balanced stats, versatile animations
```

---

## 🎯 COMMON SPRITE TASKS

### **Task: Map All Starter Units**

**Process:**
1. List all 12 starter units
2. For each unit, identify:
   - Role (Tank, DPS, Support, etc.)
   - Element theme (if any)
   - Personality (heroic, serious, energetic)
3. Browse party sprites in `golden-sun/battle/party/`
4. Match personalities to sprites
5. Update spriteRegistry.ts
6. Test all 12 in-game

**Example Mapping:**
```
Warrior → Isaac (heroic earth warrior)
Mage → Ivan (intelligent wind mage)
Cleric → Mia (gentle water healer)
Rogue → Felix (serious mars fighter)
Guardian → Piers (mature mercury defender)
Paladin → Isaac (variant with holy theme)
Berserker → Garet (energetic mars fighter)
Necromancer → Ivan (dark magic variant)
Shaman → Mia (nature healer variant)
Ranger → Felix (agile variant)
Summoner → Sheba (powerful jupiter mage)
Engineer → Piers (technical fighter variant)
```

---

### **Task: Map All Enemies**

**Process:**
1. List all opponent catalog entries
2. For each opponent, check:
   - Primary tag (Beast, Undead, Holy, etc.)
   - Difficulty level
   - Theme
3. Browse enemy sprites
4. Match theme to sprite
5. Update enemy sprite mappings
6. Test in battle

**Example Mapping by Tag:**
```
Undead Tag:
- Skeleton Captain → skeleton_warrior.gif
- Zombie → zombie.gif
- Ghost → ghost_spirit.gif

Beast Tag:
- Wolf Pack → wolf.gif
- Bear → bear.gif
- Tiger → tiger.gif

Mech Tag:
- Golem → golem.gif
- Construct → construct.gif

Holy Tag:
- Angel → angel.gif
- Paladin → holy_knight.gif
```

---

### **Task: Integrate Ability Effects**

**Process:**
1. List all gem abilities (6 total)
2. For each ability:
   - Element type (Fire, Water, Earth, Air)
   - Effect type (Damage, Heal, Buff)
3. Browse psynergy sprites
4. Match ability to effect
5. Integrate into ability system
6. Test animation timing

**Example Mapping:**
```
Fireball → /sprites/psynergy/fire_attack.gif
Blue Bolt → /sprites/psynergy/water_attack.gif
Quake → /sprites/psynergy/earth_attack.gif
Gale → /sprites/psynergy/wind_attack.gif
Cure → /sprites/psynergy/heal_effect.gif
Haste → /sprites/psynergy/speed_buff.gif
```

---

## 🚨 SPRITE AVAILABILITY NOTES

### **What's Available (Ready to Use):**
- ✅ 8 playable character sprites (full battle states)
- ✅ 100+ enemy sprites (various types)
- ✅ 50+ ability effect animations
- ✅ 20+ UI icons and elements
- ✅ 10+ battle backgrounds
- ✅ Comprehensive Golden Sun asset library

### **What's NOT Available:**
- ❌ Custom NextEraGame original art
- ❌ HD/4K versions (pixel art only)
- ❌ Character portraits (use battle sprites as portraits)
- ❌ Equipment weapon sprites (use icons instead)
- ❌ Modern UI elements (Golden Sun retro style only)

### **Fallback Strategy:**

**If Perfect Sprite Not Found:**
1. **Similar Sprite:** Use closest match (e.g., skeleton for any undead)
2. **Recolor/Variant:** Use same sprite family with note
3. **Generic Placeholder:** Use standard sprite as temporary
4. **Document Need:** Add to "Missing Sprites" list for future

---

## 📸 SPRITE PREVIEW TIPS

### **Viewing Sprites Before Integration:**

**Option 1: File Explorer**
- Navigate to `public/sprites/golden-sun/`
- Preview GIF files directly
- Identify sprite characteristics

**Option 2: Browser**
- Run dev server (`npm run dev`)
- Navigate to `http://localhost:5173/sprites/golden-sun/...`
- View sprite in browser

**Option 3: Image Editor**
- Open in GIMP, Photoshop, or similar
- View animation frames
- Check sprite dimensions

---

## 🎯 SPRITE QUALITY STANDARDS

### **When Selecting Sprites:**

**Must Have:**
- [ ] Clear, visible character/enemy
- [ ] Smooth animation (no jarring frames)
- [ ] Appropriate size (not too large/small)
- [ ] Matches theme and aesthetic
- [ ] Compatible with pixel art style

**Nice to Have:**
- [ ] Multiple states (idle, attack, defend, etc.)
- [ ] Variants (different color palettes)
- [ ] High frame count (smoother animation)
- [ ] Consistent art style with other sprites

**Avoid:**
- [ ] Blurry or low-quality sprites
- [ ] Sprites with wrong aspect ratio
- [ ] Sprites from different art styles
- [ ] Overly complex sprites (performance)

---

## 📋 SPRITE INTEGRATION CHECKLIST

**Before Reporting Sprite Work Complete:**

### **Functionality:**
- [ ] All mapped sprites load (0 console errors)
- [ ] Sprites display at appropriate size
- [ ] Animations play smoothly
- [ ] All states working (idle/attack/defend/KO)

### **Aesthetics:**
- [ ] Sprites match character/enemy theme
- [ ] Visual consistency across all sprites
- [ ] Appropriate sprite for difficulty level
- [ ] Matches Golden Sun aesthetic

### **Documentation:**
- [ ] Sprite mappings added to spriteRegistry.ts
- [ ] Mapping choices documented (why this sprite?)
- [ ] Any limitations noted
- [ ] Screenshots as evidence

### **Testing:**
- [ ] Tested in battle screen
- [ ] Tested in menu/roster screens
- [ ] Tested on different screen sizes (if applicable)
- [ ] Performance verified (no lag)

---

## 🎨 WORKING WITH THE SPRITE LIBRARY

### **Best Practices:**

**1. Browse First, Implement Second**
- Spend 30-60 minutes exploring sprite library
- Create mental map of what's available
- Note high-quality sprites for priority use
- Identify gaps early

**2. Consistency Over Perfection**
- Use same character family for related units
- Keep enemy types consistent (all skeletons use skeleton sprites)
- Maintain visual style cohesion

**3. Document Your Choices**
- Add comments explaining sprite selections
- Note alternative sprites considered
- Document any custom mappings

**4. Test Early and Often**
- Verify sprites load after each mapping
- Check console for 404 errors
- View in-game immediately
- Fix issues as they arise

---

## 📊 SPRITE LIBRARY STATISTICS

**Quick Reference:**

| Category | Count | Directory |
|----------|-------|-----------|
| Party Characters | 8+ | `golden-sun/battle/party/` |
| Enemies | 100+ | `golden-sun/battle/enemies/` |
| Bosses | 20+ | `golden-sun/battle/bosses/` |
| Abilities | 50+ | `psynergy/`, `golden-sun/effects/` |
| Backgrounds | 10+ | `golden-sun/backgrounds/` |
| Icons | 20+ | `golden-sun/icons/` |
| UI Elements | 30+ | `golden-sun/text/`, `icons/` |
| **TOTAL** | **2,500+** | `public/sprites/golden-sun/` |

---

## 🚀 GETTING STARTED

### **Your First Sprite Integration:**

**Recommended First Task: Map Starter Units**

**Why Start Here:**
- High visual impact (see sprites immediately)
- Straightforward task (match units to sprites)
- Builds familiarity with library
- Provides foundation for all future work

**Time Estimate:** 2-3 hours

**Steps:**
1. Read starter unit descriptions
2. Browse `golden-sun/battle/party/`
3. Create mapping list
4. Update spriteRegistry.ts
5. Test in-game
6. Screenshot all units
7. Report completion

---

## 📚 ADDITIONAL RESOURCES

### **Sprite Registry:**
- **File:** `src/data/spriteRegistry.ts`
- **Purpose:** Central sprite path management
- **Update:** When adding new sprite mappings

### **Component Examples:**
- **AnimatedSprite.tsx:** Sprite display component
- **BattleUnitSlot.tsx:** Battle sprite integration
- **Example Usage:** Reference for sprite implementation

### **Visual Reference:**
- **ScreenShots/:** Current game visuals
- **VISUAL_QA_REPORT.md:** Previous visual work
- **GRAPHICS_ONBOARDING.md:** Complete Graphics AI guide

---

## 🎯 READY TO INTEGRATE!

**You now have:**
- âœ… Complete sprite inventory
- âœ… Integration guidelines
- âœ… Quality standards
- âœ… Task examples
- âœ… Testing checklist

**Your mission:** Transform placeholder circles into beautiful Golden Sun sprites! 🎨✨

---

**Need Help?** Reference GRAPHICS_ONBOARDING.md for comprehensive visual guidelines and workflow.

**Questions?** Ask the Architect about sprite priorities and visual requirements.

**Let's make this game visually stunning!** 🎮💎
