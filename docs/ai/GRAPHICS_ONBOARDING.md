# 🎨 AI GRAPHICS & VISUAL POLISH - NextEraGame Project Onboarding

## 🎯 CURRENT STATE (Updated: October 27, 2025)

### ✅ **PHASE 2-3: PARTY & ENEMY SPRITES - COMPLETE** (45 min one-shot makeover)

**What Was Accomplished:**
- **All 12 starter units** now use Golden Sun character sprites instead of colored circles
- **All 19 enemy types** mapped to appropriate GS monster sprites
- **Dual-path asset system** implemented (GS mode for dev, Simple mode for legal compliance)
- **Full animation support**: idle, attack1, attack2, hit, downed, cast1, cast2
- **KO overlay**: Defeated units show grayscale filter + "KO" text
- **Zero 404 errors**: All sprite paths validated and working
- **Production deployed**: Live at https://planetsdesending.netlify.app/

**Technical Implementation:**

```typescript
// src/data/spriteRegistry.ts - Current Working State

// Asset mode detection (defaults to GS mode)
const ASSET_MODE: 'gs' | 'simple' = (() => {
  if (typeof window === 'undefined') return 'gs'; // SSR safety
  const forceSimple = import.meta.env?.VITE_USE_SIMPLE_ASSETS === 'true';
  return forceSimple ? 'simple' : 'gs';
})();

// All 12 starters mapped (COMPLETE):
export const UNIT_TO_GS_CHARACTER: Record<string, CharacterSpriteMapping> = {
  // TANKS
  'Warrior': { gsCharacter: 'isaac', defaultWeapon: 'lSword', availableWeapons: ['lSword', 'Axe', 'lBlade'] },
  'Guardian': { gsCharacter: 'garet', defaultWeapon: 'Axe', availableWeapons: ['Axe', 'Mace'] },
  'Paladin': { gsCharacter: 'felix', defaultWeapon: 'lSword', availableWeapons: ['lSword', 'lBlade'] },
  
  // DPS
  'Rogue': { gsCharacter: 'ivan', defaultWeapon: 'lBlade', availableWeapons: ['lBlade'] },
  'Mage': { gsCharacter: 'ivan', defaultWeapon: 'lBlade', availableWeapons: ['lBlade'] },
  'Ranger': { gsCharacter: 'piers', defaultWeapon: 'lSword', availableWeapons: ['lSword', 'Mace'] },
  
  // SUPPORT
  'Cleric': { gsCharacter: 'mia', defaultWeapon: 'Mace', availableWeapons: ['Mace'] },
  'Shaman': { gsCharacter: 'jenna_gs2', defaultWeapon: 'lBlade', availableWeapons: ['lBlade'] },
  'Bard': { gsCharacter: 'sheba', defaultWeapon: 'Mace', availableWeapons: ['Mace'] },
  
  // SPECIALISTS
  'Necromancer': { gsCharacter: 'felix', defaultWeapon: 'lBlade', availableWeapons: ['lBlade', 'lSword'] },
  'Engineer': { gsCharacter: 'piers', defaultWeapon: 'Mace', availableWeapons: ['Mace', 'lSword'] },
  'Summoner': { gsCharacter: 'sheba', defaultWeapon: 'Mace', availableWeapons: ['Mace'] },
};

// All 19 enemies mapped (COMPLETE):
export const ENEMY_SPRITE_MAP: Record<string, string> = {
  // UNDEAD (4)
  'Skeleton Warrior': 'Undead',
  'Zombie Brute': 'Ghoul',
  'Necromancer': 'Ghost_Mage',
  'Ghost Assassin': 'Vile_Dirge',
  
  // MECH (4)
  'Battle Mech Alpha': 'Golem',
  'Drone Swarm': 'Flash_Ant',
  'Repair Bot': 'Mimic',
  'Siege Cannon': 'Cerebus',
  
  // BEAST (3)
  'Dire Wolf': 'Wild_Wolf',
  'Bear Guardian': 'Wolfkin',
  'Serpent Striker': 'Creeper',
  
  // HOLY (3)
  'Paladin Knight': 'Minotaurus',
  'Cleric Healer': 'Faery',
  'Holy Avenger': 'Gargoyle',
  
  // ARCANE (3)
  'Arcane Evoker': 'Gnome_Wizard',
  'Void Walker': 'Ghost_Mage',
  'Crystal Guardian': 'Grand_Chimera',
  
  // NATURE (3)
  'Treant Ancient': 'Mad_Plant',
  'Thorn Archer': 'Hobgoblin',
  'Druid Shaman': 'Amaze',
};

// Role-based fallbacks (if no direct mapping)
const ROLE_FALLBACK_SPRITES: Record<Role, string> = {
  Tank: 'Brigand',
  DPS: 'Goblin',
  Support: 'Gnome_Wizard',
  Specialist: 'Mimic',
};

// Dual-path sprite loading (WORKING):
export function getPartySpriteSet(unitName: string, weapon?: WeaponType): PartySpriteSet | null {
  const mapping = UNIT_TO_GS_CHARACTER[unitName];
  if (!mapping) {
    console.warn(`[SpriteRegistry] No mapping for unit: ${unitName}`);
    return null;
  }

  const actualWeapon = weapon || mapping.defaultWeapon;

  if (ASSET_MODE === 'gs') {
    // Golden Sun mode - full animation set
    const char = mapping.gsCharacter;
    const displayStem = char.includes('_') ? char.split('_')[0] : char;
    const name = displayStem.charAt(0).toUpperCase() + displayStem.slice(1);
    const base = `/sprites/golden-sun/battle/party/${char}`;
    
    return {
      idle: `${base}/${name}_${actualWeapon}_Front.gif`,
      attack1: `${base}/${name}_${actualWeapon}_Attack1.gif`,
      attack2: `${base}/${name}_${actualWeapon}_Attack2.gif`,
      hit: `${base}/${name}_${actualWeapon}_HitFront.gif`,
      downed: `${base}/${name}_${actualWeapon}_DownedFront.gif`,
      cast1: `${base}/${name}_${actualWeapon}_CastFront1.gif`,
      cast2: `${base}/${name}_${actualWeapon}_CastFront2.gif`,
    };
  } else {
    // Simple mode - reuse idle for all states (avoid 404s)
    const simpleMapping: Record<string, string> = {
      'Warrior': 'warrior', 'Guardian': 'guardian', 'Paladin': 'paladin',
      'Rogue': 'rogue', 'Mage': 'mage', 'Ranger': 'ranger',
      'Cleric': 'cleric', 'Shaman': 'shaman', 'Bard': 'bard',
      'Necromancer': 'necromancer', 'Engineer': 'engineer', 'Summoner': 'summoner',
    };
    
    const simpleName = simpleMapping[unitName];
    if (!simpleName) return null;
    
    const idle = `/sprites/party/${simpleName}_idle.gif`;
    return { idle, attack1: idle, attack2: idle, hit: idle, downed: idle, cast1: idle, cast2: idle };
  }
}

// Enemy sprite loading (WORKING):
export function getEnemySprite(unitName: string, role: Role): string {
  const mappedSprite = ENEMY_SPRITE_MAP[unitName];
  if (mappedSprite) {
    return `/sprites/golden-sun/battle/enemies/${mappedSprite}.gif`;
  }
  const fallbackSprite = ROLE_FALLBACK_SPRITES[role];
  return `/sprites/golden-sun/battle/enemies/${fallbackSprite}.gif`;
}
```

**Component Integration (DO NOT MODIFY - WORKING PERFECTLY):**

```typescript
// src/components/battle/AnimatedUnitSprite.tsx
// Handles both party and enemy rendering with proper detection

export function AnimatedUnitSprite({ unit, weapon, isAttacking, isHit, ... }: Props) {
  // Detect party vs enemy
  const partySpriteSet = getPartySpriteSet(unit.name, unitWeapon);
  const isPartyMember = partySpriteSet !== null;
  
  // Get appropriate sprite
  const enemySprite = !isPartyMember ? getEnemySprite(unit.name, unit.role) : null;
  
  // For party: use sprite set, for enemies: create sprite set from single sprite
  const spriteSet = isPartyMember ? partySpriteSet : (
    enemySprite ? {
      idle: enemySprite,
      attack1: enemySprite,
      attack2: enemySprite,
      hit: enemySprite,
      downed: enemySprite,
      cast1: enemySprite,
      cast2: enemySprite,
    } : null
  );

  // Animation state management with SpriteAnimator
  const animator = useRef(new SpriteAnimator()).current;
  const [currentSprite, setCurrentSprite] = useState<string | null>(null);

  // Handle attack trigger
  useEffect(() => {
    if (isAttacking && !lastAttackState.current) {
      animator.playAttack(() => onAttackComplete?.());
    }
    lastAttackState.current = isAttacking;
  }, [isAttacking, animator, onAttackComplete]);

  // Handle hit trigger
  useEffect(() => {
    if (isHit && !lastHitState.current) {
      animator.playHit(() => onHitComplete?.());
    }
    lastHitState.current = isHit;
  }, [isHit, animator, onHitComplete]);

  // Handle downed state
  useEffect(() => {
    if (unit.currentHp <= 0) {
      animator.playDowned();
    }
  }, [unit.currentHp, animator]);

  return (
    <div className="relative">
      {spriteLoading && (
        <div className="absolute inset-0 w-40 h-40 bg-slate-700/50 animate-pulse rounded-lg" />
      )}
      <img
        src={currentSprite}
        alt={unit.name}
        width={160}
        height={160}
        className={`w-40 h-40 object-contain ${className} ${spriteLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{
          imageRendering: 'pixelated',
          filter: unit.currentHp <= 0 ? 'grayscale(100%) opacity(0.5)' : 'none',
          ...style,
        }}
        onLoad={() => setSpriteLoading(false)}
        onError={() => {
          console.warn(`Failed to load sprite: ${currentSprite}`);
          setSpriteLoadFailed(true);
        }}
      />
      
      {/* KO overlay */}
      {unit.currentHp <= 0 && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
          <span className="text-red-400 font-bold text-sm">KO</span>
        </div>
      )}
    </div>
  );
}
```

---

### ✅ **PHASE 4: UI POLISH - PARTIALLY COMPLETE**

**What Was Fixed:**

**1. UI Overflow Issues (Fixed Oct 27)**
```typescript
// src/screens/StarterSelectScreen.tsx
// BEFORE: pb-28 (bottom row cut off by footer)
// AFTER: pb-48 (full visibility)
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 pb-48">

// Grid margin increased for breathing room
<div className="max-w-7xl mx-auto mb-32">
```

```typescript
// src/screens/GemSelectScreen.tsx
// BEFORE: flex items-center justify-center (content cutoff when tall)
// AFTER: overflow-y-auto py-8 px-8 (proper scrolling)
<div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 overflow-y-auto py-8 px-8">
  <div className="max-w-7xl w-full mx-auto">
    {/* Content with proper centering */}
  </div>
</div>
```

**2. Spam Click Prevention (Fixed Oct 27)**
```typescript
// src/screens/StarterSelectScreen.tsx
const [isStarting, setIsStarting] = useState(false);

const handleStart = () => {
  if (canStart && !isStarting) {
    setIsStarting(true); // Prevent multiple clicks
    const selected = STARTER_CATALOG.filter(u => selectedUnits.has(u.id));
    onSelect(selected);
  }
};

// Button shows "🚀 Starting..." while processing
<button
  onClick={handleStart}
  disabled={!canStart || isStarting}
  className={...}
>
  {isStarting ? '🚀 Starting...' : canStart ? '🚀 Start Journey →' : `Select ${maxSelection - selectedUnits.size} more`}
</button>
```

**What's Still Needed:**
- ⚠️ Attack animations (currently basic CSS transitions)
- ⚠️ Hit flash effects (no screen flash on damage)
- ⚠️ Damage number animations (static text)
- ⚠️ Victory celebration effects

---

### 🔶 **PHASE 1: BACKGROUNDS - MINIMAL** (Only 3 of 72 used)

**Current State:**
```typescript
// src/data/spriteRegistry.ts
export const BATTLE_BACKGROUNDS = [
  '/sprites/golden-sun/backgrounds/gs1/Cave.gif',
  '/sprites/golden-sun/backgrounds/gs1/Desert.gif',
  '/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif',
  // 69 MORE AVAILABLE BUT NOT ADDED
];

// Tag-based selection (working but limited variety)
const BG_BY_TAG: Record<string, string[]> = {
  Undead: ['/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif'],
  Beast: ['/sprites/golden-sun/backgrounds/gs1/Cave.gif'],
  Mech: ['/sprites/golden-sun/backgrounds/gs1/Desert.gif'],
  Holy: ['/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif'],
  Arcane: ['/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif'],
  Nature: ['/sprites/golden-sun/backgrounds/gs1/Cave.gif'],
};
```

**Available But Not Used:**
```
/public/sprites/golden-sun/backgrounds/
├── gs1/           (Golden Sun 1)
│   ├── Cave.gif                  ✅ USED
│   ├── Desert.gif                ✅ USED
│   ├── Sol_Sanctum.gif          ✅ USED
│   ├── Kolima_Forest.gif        ❌ NOT USED
│   ├── Mercury_Lighthouse.gif   ❌ NOT USED
│   ├── Venus_Lighthouse.gif     ❌ NOT USED
│   ├── Fuchin_Falls.gif         ❌ NOT USED
│   ├── Mogall_Forest.gif        ❌ NOT USED
│   ├── Kandorean_Temple.gif     ❌ NOT USED
│   ├── Suhalla_Desert.gif       ❌ NOT USED
│   ├── Altmiller_Cave.gif       ❌ NOT USED
│   ├── Crossbone_Isle.gif       ❌ NOT USED
│   ├── Elemental_Stars.gif      ❌ NOT USED
│   ├── Babi_Lighthouse.gif      ❌ NOT USED
│   ├── Lunpa_Fortress.gif       ❌ NOT USED
│   ├── Tolbi_Springs.gif        ❌ NOT USED
│   ├── Colosso.gif              ❌ NOT USED
│   └── ... (30+ more)
│
└── gs2/           (Golden Sun 2 - The Lost Age)
    ├── Magma_Rock.gif           ❌ NOT USED
    ├── Jupiter_Lighthouse.gif   ❌ NOT USED
    ├── Mars_Lighthouse.gif      ❌ NOT USED
    ├── Gaia_Rock.gif            ❌ NOT USED
    ├── Anemos_Sanctum.gif       ❌ NOT USED
    ├── Aqua_Rock.gif            ❌ NOT USED
    ├── Shrine_of_the_Sea.gif    ❌ NOT USED
    ├── Apojii_Islands.gif       ❌ NOT USED
    ├── Taopo_Swamp.gif          ❌ NOT USED
    └── ... (35+ more)
```

---

## 🎯 PRIORITY TASKS FOR NEXT SESSION

### **TASK 1: Background Expansion** (15-20 min) - HIGH IMPACT

**Goal:** Add variety to battle backgrounds, reduce repetition

**Step-by-Step Process:**

```typescript
// 1. Browse the background folder
// Run this to see what's available:
// ls -la public/sprites/golden-sun/backgrounds/gs1/
// ls -la public/sprites/golden-sun/backgrounds/gs2/

// 2. Choose 15-20 high-quality backgrounds
// Criteria:
// - Clear, vibrant colors
// - Fits battle context (not town/village scenes)
// - Good contrast for unit sprites
// - Thematically diverse (forests, temples, caves, lighthouses, etc.)

// 3. Update BATTLE_BACKGROUNDS array in src/data/spriteRegistry.ts
export const BATTLE_BACKGROUNDS = [
  // GS1 Backgrounds (expand this)
  '/sprites/golden-sun/backgrounds/gs1/Cave.gif',
  '/sprites/golden-sun/backgrounds/gs1/Desert.gif',
  '/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif',
  '/sprites/golden-sun/backgrounds/gs1/Kolima_Forest.gif',         // ADD
  '/sprites/golden-sun/backgrounds/gs1/Mercury_Lighthouse.gif',    // ADD
  '/sprites/golden-sun/backgrounds/gs1/Venus_Lighthouse.gif',      // ADD
  '/sprites/golden-sun/backgrounds/gs1/Fuchin_Falls.gif',          // ADD
  '/sprites/golden-sun/backgrounds/gs1/Mogall_Forest.gif',         // ADD
  '/sprites/golden-sun/backgrounds/gs1/Kandorean_Temple.gif',      // ADD
  '/sprites/golden-sun/backgrounds/gs1/Suhalla_Desert.gif',        // ADD
  '/sprites/golden-sun/backgrounds/gs1/Altmiller_Cave.gif',        // ADD
  '/sprites/golden-sun/backgrounds/gs1/Crossbone_Isle.gif',        // ADD
  '/sprites/golden-sun/backgrounds/gs1/Babi_Lighthouse.gif',       // ADD
  '/sprites/golden-sun/backgrounds/gs1/Lunpa_Fortress.gif',        // ADD
  '/sprites/golden-sun/backgrounds/gs1/Tolbi_Springs.gif',         // ADD
  
  // GS2 Backgrounds (add variety from Lost Age)
  '/sprites/golden-sun/backgrounds/gs2/Magma_Rock.gif',            // ADD
  '/sprites/golden-sun/backgrounds/gs2/Jupiter_Lighthouse.gif',    // ADD
  '/sprites/golden-sun/backgrounds/gs2/Mars_Lighthouse.gif',       // ADD
  '/sprites/golden-sun/backgrounds/gs2/Gaia_Rock.gif',             // ADD
  '/sprites/golden-sun/backgrounds/gs2/Aqua_Rock.gif',             // ADD
];

// 4. Expand BG_BY_TAG for themed battles
const BG_BY_TAG: Record<string, string[]> = {
  Undead: [
    '/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif',
    '/sprites/golden-sun/backgrounds/gs1/Kandorean_Temple.gif',    // ADD - dark temple
    '/sprites/golden-sun/backgrounds/gs1/Crossbone_Isle.gif',      // ADD - spooky isle
  ],
  Beast: [
    '/sprites/golden-sun/backgrounds/gs1/Cave.gif',
    '/sprites/golden-sun/backgrounds/gs1/Kolima_Forest.gif',       // ADD - forest
    '/sprites/golden-sun/backgrounds/gs1/Mogall_Forest.gif',       // ADD - darker forest
  ],
  Mech: [
    '/sprites/golden-sun/backgrounds/gs1/Desert.gif',
    '/sprites/golden-sun/backgrounds/gs1/Suhalla_Desert.gif',      // ADD - barren
    '/sprites/golden-sun/backgrounds/gs2/Gaia_Rock.gif',           // ADD - rocky
  ],
  Holy: [
    '/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif',
    '/sprites/golden-sun/backgrounds/gs1/Venus_Lighthouse.gif',    // ADD - bright temple
    '/sprites/golden-sun/backgrounds/gs2/Jupiter_Lighthouse.gif',  // ADD - holy tower
  ],
  Arcane: [
    '/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif',
    '/sprites/golden-sun/backgrounds/gs1/Babi_Lighthouse.gif',     // ADD - mystical
    '/sprites/golden-sun/backgrounds/gs2/Anemos_Sanctum.gif',      // ADD - wind temple
  ],
  Nature: [
    '/sprites/golden-sun/backgrounds/gs1/Cave.gif',
    '/sprites/golden-sun/backgrounds/gs1/Kolima_Forest.gif',       // ADD - lush forest
    '/sprites/golden-sun/backgrounds/gs1/Fuchin_Falls.gif',        // ADD - waterfall
  ],
};
```

**Testing:**
1. Start multiple battles
2. Verify backgrounds rotate (not always Cave.gif)
3. Check backgrounds match enemy tags
4. No 404 errors in console

**Success Criteria:**
- ✅ 15-20 backgrounds in BATTLE_BACKGROUNDS
- ✅ Each tag has 2-3 background options
- ✅ Visual variety in battles
- ✅ Zero 404 errors

---

### **TASK 2: Visual FX Enhancement** (25-30 min) - HIGH IMPACT

**Goal:** Add juice to combat - make hits feel impactful

**Sub-task 2A: Hit Flash Effect** (10 min)

```typescript
// src/components/battle/BattleScreen.tsx
// Add flash overlay state
const [flashActive, setFlashActive] = useState(false);

// Trigger flash when unit takes damage
useEffect(() => {
  if (damageJustDealt) {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150); // 150ms flash
  }
}, [damageJustDealt]);

// Render flash overlay
return (
  <div className="relative">
    {/* Flash overlay */}
    {flashActive && (
      <div className="absolute inset-0 bg-red-500 opacity-30 pointer-events-none animate-flash z-50" />
    )}
    
    {/* Existing battle UI */}
  </div>
);

// Add CSS animation
// In component or global styles:
@keyframes flash {
  0% { opacity: 0.3; }
  50% { opacity: 0.5; }
  100% { opacity: 0; }
}

.animate-flash {
  animation: flash 150ms ease-out;
}
```

**Sub-task 2B: Screen Shake on Big Hits** (10 min)

```typescript
// src/hooks/useScreenShake.ts (CREATE THIS)
export function useScreenShake() {
  const shake = () => {
    const el = document.body;
    el.style.transform = 'translate(0, 0)';
    
    const shakeSequence = [
      { x: -5, y: 2, duration: 50 },
      { x: 5, y: -2, duration: 50 },
      { x: -3, y: 1, duration: 50 },
      { x: 3, y: -1, duration: 50 },
      { x: 0, y: 0, duration: 50 },
    ];
    
    shakeSequence.forEach((shake, i) => {
      setTimeout(() => {
        el.style.transform = `translate(${shake.x}px, ${shake.y}px)`;
      }, i * shake.duration);
    });
  };
  
  return { shake };
}

// Usage in BattleScreen.tsx:
const { shake } = useScreenShake();

// Trigger on big damage (>30 HP)
useEffect(() => {
  if (damageDealt > 30) {
    shake();
  }
}, [damageDealt]);
```

**Sub-task 2C: Damage Number Animation** (5-10 min)

```typescript
// src/components/battle/DamageNumber.tsx (ENHANCE)
export function DamageNumber({ value, position }: Props) {
  return (
    <div
      className="absolute text-4xl font-bold animate-damage-float pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        color: value > 0 ? '#ef4444' : '#22c55e', // Red for damage, green for healing
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      }}
    >
      {value > 0 ? '-' : '+'}{Math.abs(value)}
    </div>
  );
}

// Add CSS animation for floating effect
@keyframes damage-float {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  20% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
  80% {
    transform: translateY(-60px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-80px) scale(0.8);
    opacity: 0;
  }
}

.animate-damage-float {
  animation: damage-float 1s ease-out forwards;
}
```

**Success Criteria:**
- ✅ Screen flashes red on damage
- ✅ Screen shakes on big hits (>30 damage)
- ✅ Damage numbers float upward and fade
- ✅ Feels impactful and satisfying

---

### **TASK 3: Psynergy Effect Integration** (15-20 min) - MEDIUM IMPACT

**Goal:** Use Golden Sun spell animations for abilities

**Available Psynergy GIFs:**
```
/public/sprites/golden-sun/psynergy/
├── Fireball.gif       (fire attack)
├── Blue_Bolt.gif      (lightning)
├── Ply.gif            (healing)
├── Cure.gif           (healing)
├── Wish.gif           (healing)
├── Revive.gif         (resurrection)
├── Whirlwind.gif      (wind attack)
├── Quake.gif          (earth attack)
├── Frost.gif          (ice attack)
├── Ragnarok.gif       (big sword attack)
├── Odyssey.gif        (big sword attack)
├── Punji.gif          (earth spikes)
└── ... (50+ more)
```

**Implementation:**

```typescript
// src/data/spriteRegistry.ts
// Add psynergy mapping
export const PSYNERGY_ANIMATIONS: Record<string, string> = {
  // Fire spells
  'fireball': '/sprites/golden-sun/psynergy/Fireball.gif',
  'inferno': '/sprites/golden-sun/psynergy/Inferno.gif',
  'fire-storm': '/sprites/golden-sun/psynergy/Fire_Storm.gif',
  
  // Water spells
  'ply': '/sprites/golden-sun/psynergy/Ply.gif',
  'cure': '/sprites/golden-sun/psynergy/Cure.gif',
  'wish': '/sprites/golden-sun/psynergy/Wish.gif',
  
  // Wind spells
  'bolt': '/sprites/golden-sun/psynergy/Blue_Bolt.gif',
  'whirlwind': '/sprites/golden-sun/psynergy/Whirlwind.gif',
  
  // Earth spells
  'quake': '/sprites/golden-sun/psynergy/Quake.gif',
  'punji': '/sprites/golden-sun/psynergy/Punji.gif',
  
  // Light spells
  'revive': '/sprites/golden-sun/psynergy/Revive.gif',
  
  // Dark spells
  'drain': '/sprites/golden-sun/psynergy/Drain.gif',
};

export function getPsynergyAnimation(spellId: string): string | null {
  return PSYNERGY_ANIMATIONS[spellId] || null;
}
```

```typescript
// src/components/battle/PsynergyEffect.tsx (CREATE OR ENHANCE)
export function PsynergyEffect({ spellId, target, onComplete }: Props) {
  const animationUrl = getPsynergyAnimation(spellId);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(false);
      onComplete();
    }, 1500); // GIF duration
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isPlaying || !animationUrl) return null;

  return (
    <div
      className="absolute pointer-events-none z-40"
      style={{
        left: target.x - 80,
        top: target.y - 80,
        width: 160,
        height: 160,
      }}
    >
      <img
        src={animationUrl}
        alt={spellId}
        className="w-full h-full object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

// Usage in BattleScreen.tsx:
const [activePsynergy, setActivePsynergy] = useState<{spellId: string; target: Position} | null>(null);

// When ability is used:
useEffect(() => {
  if (abilityUsed) {
    setActivePsynergy({ spellId: ability.id, target: targetPosition });
  }
}, [abilityUsed]);

// Render:
{activePsynergy && (
  <PsynergyEffect
    spellId={activePsynergy.spellId}
    target={activePsynergy.target}
    onComplete={() => setActivePsynergy(null)}
  />
)}
```

**Success Criteria:**
- ✅ Abilities show appropriate psynergy GIFs
- ✅ Animations play at target location
- ✅ Timing matches ability execution
- ✅ No visual bugs or overlap

---

## 🐛 KNOWN ISSUES & TROUBLESHOOTING

### **Issue 1: Console Warnings for Recruited Enemies**

**Symptom:**
```
[SpriteRegistry] No mapping for unit: Arcane Evoker
⚠️ Unit Arcane Evoker not found in team
```

**Cause:** Recruited enemy units try to use party sprite system, don't find mapping, but correctly fall back to `unit.spriteUrl`

**Impact:** ZERO - sprites display correctly, just noisy console

**Fix (Optional - 5 min):**
```typescript
// src/components/battle/AnimatedUnitSprite.tsx
// Update sprite loading to check spriteUrl FIRST for recruited enemies
const updateSprite = useCallback(() => {
  // Priority 1: If unit has spriteUrl (recruited enemy), use it directly
  if (unit.spriteUrl) {
    setCurrentSprite(unit.spriteUrl);
    setSpriteLoadFailed(false);
    setSpriteLoading(false);
    return; // EARLY RETURN - skip party sprite check
  }
  
  // Priority 2: Try party sprite system
  const partySpriteSet = getPartySpriteSet(unit.name, unitWeapon);
  if (!partySpriteSet) {
    // Priority 3: Try enemy sprite system
    const enemySprite = getEnemySprite(unit.name, unit.role);
    if (enemySprite) {
      setCurrentSprite(enemySprite);
      return;
    }
    setSpriteLoadFailed(true);
    return;
  }
  
  const sprite = animator.getCurrentSprite(partySpriteSet);
  setCurrentSprite(sprite);
}, [unit, animator]);
```

---

### **Issue 2: Harmless CSS/Source Map Errors**

**Symptoms:**
```
Error in parsing value for "-webkit-text-size-adjust". Declaration dropped.
Ruleset ignored due to bad selector.
Source map error: Error: request failed with status 404
```

**Cause:** Browser/extension trying to load debug files that don't exist in production

**Impact:** ZERO - visual noise only, game works perfectly

**Fix:** Ignore these - they're from React DevTools extension

---

### **Issue 3: Sprite Not Loading (404 Error)**

**Symptom:** Console shows `Failed to load sprite: /sprites/...`

**Debug Steps:**
1. Check console for exact path
2. Verify file exists at that path in `/public/sprites/`
3. Check casing (case-sensitive!)
4. Check for typos in mapping

**Common Mistakes:**
```typescript
// WRONG: Folder name uppercase
'/sprites/golden-sun/battle/party/Isaac/...'

// RIGHT: Folder lowercase, filename PascalCase
'/sprites/golden-sun/battle/party/isaac/Isaac_lSword_Front.gif'

// WRONG: Missing underscore
'/sprites/golden-sun/battle/party/jenna_gs2/Jennags2_lBlade_Front.gif'

// RIGHT: Folder has underscore, filename doesn't
'/sprites/golden-sun/battle/party/jenna_gs2/Jenna_lBlade_Front.gif'
```

---

### **Issue 4: Sprites Blurry Instead of Pixelated**

**Symptom:** Sprites look smooth/blurry instead of crisp pixel art

**Cause:** Missing `imageRendering: 'pixelated'` CSS

**Fix:**
```typescript
// Always include this style on sprite <img> tags
<img
  src={spriteUrl}
  style={{
    imageRendering: 'pixelated', // CRITICAL for pixel art
  }}
/>
```

---

## 📋 ASSET PATH REFERENCE (CRITICAL)

### **Party Sprite Paths:**

**Format:**
```
/sprites/golden-sun/battle/party/{character_folder}/{Filename_with_PascalCase}.gif
```

**Examples:**
```
✅ CORRECT:
/sprites/golden-sun/battle/party/isaac/Isaac_lSword_Front.gif
/sprites/golden-sun/battle/party/mia/Mia_Mace_Attack1.gif
/sprites/golden-sun/battle/party/felix/Felix_lBlade_HitFront.gif
/sprites/golden-sun/battle/party/jenna_gs2/Jenna_lBlade_CastFront1.gif  ← Special case!

❌ WRONG:
/sprites/golden-sun/battle/party/Isaac/isaac_lSword_Front.gif  ← Folder wrong
/sprites/golden-sun/battle/party/isaac/isaac_lSword_Front.gif  ← Filename wrong
/sprites/golden-sun/battle/party/jenna_gs2/Jenna_gs2_lBlade_Front.gif  ← Filename wrong
```

**Special Cases:**
- `jenna_gs2`: Folder has `_gs2`, but files use just `Jenna_`
- All others: Folder and file prefix match

---

### **Enemy Sprite Paths:**

**Format:**
```
/sprites/golden-sun/battle/enemies/{EnemyName_with_PascalCase}.gif
```

**Examples:**
```
✅ CORRECT:
/sprites/golden-sun/battle/enemies/Undead.gif
/sprites/golden-sun/battle/enemies/Grand_Chimera.gif  ← Underscore for spaces
/sprites/golden-sun/battle/enemies/Ghost_Mage.gif
/sprites/golden-sun/battle/enemies/Wild_Wolf.gif

❌ WRONG:
/sprites/golden-sun/battle/enemies/undead.gif  ← Should be PascalCase
/sprites/golden-sun/battle/enemies/Grand Chimera.gif  ← Space not allowed
/sprites/golden-sun/battle/enemies/GrandChimera.gif  ← Needs underscore
```

---

### **Background Paths:**

**Format:**
```
/sprites/golden-sun/backgrounds/{game}/{Location_Name}.gif
```

**Examples:**
```
✅ CORRECT:
/sprites/golden-sun/backgrounds/gs1/Cave.gif
/sprites/golden-sun/backgrounds/gs1/Sol_Sanctum.gif  ← Underscore for spaces
/sprites/golden-sun/backgrounds/gs2/Magma_Rock.gif
/sprites/golden-sun/backgrounds/gs2/Jupiter_Lighthouse.gif

❌ WRONG:
/sprites/golden-sun/backgrounds/Cave.gif  ← Missing gs1/gs2 folder
/sprites/golden-sun/backgrounds/gs1/cave.gif  ← Should be PascalCase
```

---

## 🎨 DESIGN SYSTEM REFERENCE

### **Color Palette:**

```typescript
// Golden Sun inspired colors (use these for consistency)
const COLORS = {
  // Metallic
  gold: '#FFD700',
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  
  // Elements
  fire: '#EF4444',      // Mars (red-orange)
  water: '#3B82F6',     // Mercury (blue)
  wind: '#A855F7',      // Jupiter (purple)
  earth: '#22C55E',     // Venus (green)
  light: '#FBBF24',     // Moon (yellow-gold)
  dark: '#7C3AED',      // Sun (deep purple)
  
  // UI States
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Backgrounds
  dark: '#1E293B',      // Slate 800
  darker: '#0F172A',    // Slate 900
  darkest: '#020617',   // Slate 950
};
```

---

### **Animation Timing:**

```typescript
const TIMINGS = {
  instant: '100ms',     // Immediate feedback
  quick: '150ms',       // Button clicks
  normal: '300ms',      // Screen transitions
  slow: '500ms',        // Page transitions
  celebration: '1000ms', // Victory/level up
};

const EASINGS = {
  default: 'ease-in-out',
  snap: 'ease-out',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};
```

---

## 🚀 QUICK WIN CHECKLIST

**5-Minute Wins (Do These When Short on Time):**

- [ ] Add 5 more backgrounds to `BATTLE_BACKGROUNDS`
- [ ] Map 5 more enemies to GS sprites
- [ ] Silence "Arcane Evoker" console warning
- [ ] Add loading skeleton to sprite loading
- [ ] Increase damage number font size

**10-Minute Wins:**
- [ ] Add 10-15 backgrounds with tag mappings
- [ ] Implement hit flash effect
- [ ] Add screen shake on big hits
- [ ] Map psynergy animations to abilities

**20-Minute Wins:**
- [ ] Complete background expansion (all 72)
- [ ] Full psynergy integration
- [ ] Victory celebration animation
- [ ] Attack trail effects

---

## 📊 SESSION COMPLETION TEMPLATE

**Use this format when reporting graphics work:**

```markdown
# 🎨 Graphics Session Report

## Summary
[Brief description of what was accomplished]

## Changes Made

### Sprites
- Added: X party sprites, Y enemy sprites
- Updated: [list sprite mappings changed]

### Backgrounds
- Added: X backgrounds
- Tags expanded: [list tags with new options]

### Visual Effects
- [Effect 1]: [Description + implementation]
- [Effect 2]: [Description + implementation]

## Files Modified
- `src/data/spriteRegistry.ts`: [changes]
- `src/components/...`: [changes]
- `src/screens/...`: [changes]

## Testing Performed
- [ ] All sprites load (0 console 404s)
- [ ] Animations play smoothly
- [ ] No performance issues
- [ ] Mobile responsive
- [ ] Accessibility maintained

## Evidence
📸 Screenshot 1: [Description]
📸 Screenshot 2: [Description]
🎥 Video: [Animation demo if applicable]

## Next Session Priorities
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]
```

---

## 🎯 REMEMBER

**Your Role:** Make NextEraGame visually STUNNING with Golden Sun aesthetics

**Core Responsibilities:**
- ✅ Sprite integration (party, enemies, effects)
- ✅ Background variety and theming
- ✅ Visual feedback (animations, particles, juice)
- ✅ UI polish (layouts, colors, transitions)
- ✅ Asset management (registry, optimization)

**DO NOT Touch:**
- ❌ Game logic (`src/systems/`, `src/core/`)
- ❌ Type definitions (`src/types/`)
- ❌ Battle mechanics
- ❌ Save system
- ❌ State management

**The Goal:** 
Transform NextEraGame from functional → **BEAUTIFUL** 🎨✨

---

**Current Status: 🟢 STRONG FOUNDATION - Ready for Backgrounds + FX Polish!**

**Next AI: Start with TASK 1 (Background Expansion) - 15 min for massive visual impact!**
